import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) {}

  async registrar(data: any) {
    return this.prisma.auditoria.create({
      data: {
        solicitudId: data.solicitudId,
        usuarioId: data.usuarioId,
        usuarioNombre: data.usuarioNombre,
        accion: data.accion,
        estadoAnterior: data.estadoAnterior,
        estadoNuevo: data.estadoNuevo,
        observaciones: data.observaciones,
      },
    });
  }

  async findAll(filters?: any) {
    const where: any = {};

    if (filters?.solicitudId) {
      where.solicitudId = filters.solicitudId;
    }

    if (filters?.usuarioId) {
      where.usuarioId = filters.usuarioId;
    }

    return this.prisma.auditoria.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
      take: 100,
    });
  }
}
