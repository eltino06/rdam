import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(data: any) {
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    if (data.cuil) {
      const existingCuil = await this.prisma.usuario.findUnique({
        where: { cuil: data.cuil },
      });
      if (existingCuil) {
        throw new ConflictException('El CUIL ya está registrado');
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await this.prisma.usuario.create({
      data: {
        tipo: 'CIUDADANO',
        nombreCompleto: data.nombreCompleto,
        email: data.email,
        passwordHash,
        cuil: data.cuil,
        rol: 'CIUDADANO',
      },
      select: {
        id: true,
        nombreCompleto: true,
        email: true,
        tipo: true,
        rol: true,
        fechaRegistro: true,
      },
    });

    // Email de bienvenida automático
    await this.emailService.enviarBienvenida(user);

    return {
      success: true,
      data: user,
      message: 'Usuario registrado exitosamente',
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });

    if (!user || !user.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tipo: user.tipo,
      rol: user.rol,
    };

    return {
      success: true,
      data: {
        access_token: this.jwtService.sign(payload),
        token_type: 'Bearer',
        expires_in: 86400,
        user: {
          id: user.id,
          nombreCompleto: user.nombreCompleto,
          email: user.email,
          tipo: user.tipo,
          rol: user.rol,
        },
      },
    };
  }
}
