import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRol: string) {
    if (userRol !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden ver usuarios');
    }

    const usuarios = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nombreCompleto: true,
        email: true,
        tipo: true,
        rol: true,
        cuil: true,
        activo: true,
        fechaRegistro: true,
      },
      orderBy: { fechaRegistro: 'desc' },
    });

    return { success: true, data: usuarios };
  }

  async create(data: any, userRol: string) {
    if (userRol !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden crear usuarios');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nombreCompleto: data.nombreCompleto,
        email: data.email,
        passwordHash: hashedPassword,
        tipo: data.tipo || 'INTERNO',
        rol: data.rol || 'OPERADOR',
        cuil: data.cuil || null,
        activo: true,
      },
      select: {
        id: true,
        nombreCompleto: true,
        email: true,
        tipo: true,
        rol: true,
        cuil: true,
        activo: true,
      },
    });

    return { success: true, data: usuario, message: 'Usuario creado' };
  }

  async update(id: string, data: any, userRol: string) {
    if (userRol !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden editar usuarios');
    }

    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const updateData: any = {};
    if (data.nombreCompleto) updateData.nombreCompleto = data.nombreCompleto;
    if (data.email) updateData.email = data.email;
    if (data.tipo) updateData.tipo = data.tipo;
    if (data.rol) updateData.rol = data.rol;
    if (data.cuil) updateData.cuil = data.cuil;
    if (data.activo !== undefined) updateData.activo = data.activo;
    if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, 10);

    const updated = await this.prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nombreCompleto: true,
        email: true,
        tipo: true,
        rol: true,
        cuil: true,
        activo: true,
      },
    });

    return { success: true, data: updated, message: 'Usuario actualizado' };
  }
}
