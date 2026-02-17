import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    const where: any = {
      tipo: 'INTERNO',
    };

    if (filters?.rol) {
      where.rol = filters.rol;
    }

    if (filters?.activo !== undefined) {
      where.activo = filters.activo === 'true';
    }

    const usuarios = await this.prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nombreCompleto: true,
        email: true,
        rol: true,
        activo: true,
        fechaRegistro: true,
      },
      orderBy: {
        fechaRegistro: 'desc',
      },
    });

    return {
      success: true,
      data: usuarios,
    };
  }

  async create(data: any) {
    const existing = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordTemporal = crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(passwordTemporal, 12);

    const usuario = await this.prisma.usuario.create({
      data: {
        tipo: 'INTERNO',
        nombreCompleto: data.nombreCompleto,
        email: data.email,
        passwordHash,
        rol: data.rol,
      },
      select: {
        id: true,
        nombreCompleto: true,
        email: true,
        rol: true,
        activo: true,
      },
    });

    return {
      success: true,
      data: usuario,
      message: 'Usuario creado exitosamente',
    };
  }

  async toggleActivo(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const updated = await this.prisma.usuario.update({
      where: { id },
      data: {
        activo: !usuario.activo,
      },
    });

    return {
      success: true,
      data: updated,
      message: `Usuario ${updated.activo ? 'activado' : 'desactivado'}`,
    };
  }
}