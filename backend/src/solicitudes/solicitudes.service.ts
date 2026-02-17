import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class SolicitudesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(data: any, userId: string) {
    const ciudadano = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!ciudadano) throw new NotFoundException('Usuario no encontrado');

    const year = new Date().getFullYear();
    const lastSolicitud = await this.prisma.solicitud.findFirst({
      where: { numeroSolicitud: { startsWith: `CERT-${year}-` } },
      orderBy: { fechaCreacion: 'desc' },
    });

    let nextNumber = 1;
    if (lastSolicitud) {
      const lastNumber = parseInt(lastSolicitud.numeroSolicitud.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    const numeroSolicitud = `CERT-${year}-${String(nextNumber).padStart(5, '0')}`;

    const solicitud = await this.prisma.solicitud.create({
      data: {
        numeroSolicitud,
        estado: 'PENDIENTE_REVISION',
        tipoCertificado: data.tipoCertificado,
        motivoSolicitud: data.motivoSolicitud,
        montoArancel: data.montoArancel || 5000,
        ciudadanoId: userId,
        ciudadanoNombre: ciudadano.nombreCompleto,
        ciudadanoEmail: ciudadano.email,
        ciudadanoCuil: ciudadano.cuil,
        ciudadanoTelefono: data.ciudadanoTelefono,
        ciudadanoDomicilio: data.ciudadanoDomicilio,
        datosAdicionales: data.datosAdicionales,
      },
    });

    await this.emailService.enviarSolicitudCreada(solicitud);

    return { success: true, data: solicitud, message: 'Solicitud creada exitosamente' };
  }

  async findAll(userId: string, userRole: string, filters?: any) {
    const where: any = {};
    if (userRole === 'CIUDADANO') where.ciudadanoId = userId;
    if (filters?.estado) where.estado = filters.estado;
    if (filters?.numeroSolicitud) {
      where.numeroSolicitud = { contains: filters.numeroSolicitud, mode: 'insensitive' };
    }

    const solicitudes = await this.prisma.solicitud.findMany({
      where,
      include: {
        ciudadano: { select: { id: true, nombreCompleto: true, email: true, cuil: true } },
      },
      orderBy: { fechaCreacion: 'desc' },
    });

    return { success: true, data: solicitudes };
  }

  async findOne(id: string, userId: string, userRole: string) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id },
      include: {
        ciudadano: { select: { id: true, nombreCompleto: true, email: true, cuil: true } },
        internoRevisor: { select: { id: true, nombreCompleto: true } },
      },
    });

    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');
    if (userRole === 'CIUDADANO' && solicitud.ciudadanoId !== userId) {
      throw new ForbiddenException('No tiene permiso para ver esta solicitud');
    }

    return { success: true, data: solicitud };
  }

  async iniciarRevision(id: string, userId: string) {
    const solicitud = await this.prisma.solicitud.findUnique({ where: { id } });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');
    if (solicitud.estado !== 'PENDIENTE_REVISION') {
      throw new BadRequestException('La solicitud no está en estado PENDIENTE_REVISION');
    }

    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: { estado: 'EN_REVISION', internoRevisorId: userId, fechaRevision: new Date() },
    });

    return { success: true, data: updated, message: 'Revisión iniciada' };
  }

  async aprobar(id: string, userId: string) {
    const solicitud = await this.prisma.solicitud.findUnique({ where: { id } });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');
    if (solicitud.estado !== 'EN_REVISION') {
      throw new BadRequestException('La solicitud no está en estado EN_REVISION');
    }

    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: { estado: 'PENDIENTE_PAGO', fechaAprobacion: new Date(), internoRevisorId: userId },
    });

    await this.emailService.enviarSolicitudAprobada(updated);

    return { success: true, data: updated, message: 'Solicitud aprobada' };
  }

  async rechazar(id: string, userId: string, observaciones: string) {
    const solicitud = await this.prisma.solicitud.findUnique({ where: { id } });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');
    if (solicitud.estado !== 'EN_REVISION') {
      throw new BadRequestException('La solicitud no está en estado EN_REVISION');
    }
    if (!observaciones?.trim()) {
      throw new BadRequestException('Debe indicar el motivo del rechazo');
    }

    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: {
        estado: 'RECHAZADA',
        observacionesRechazo: observaciones,
        fechaRevision: new Date(),
        internoRevisorId: userId,
      },
    });

    await this.emailService.enviarSolicitudRechazada(updated);

    return { success: true, data: updated, message: 'Solicitud rechazada' };
  }

  async emitir(id: string, userId: string) {
    const solicitud = await this.prisma.solicitud.findUnique({ where: { id } });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');
    if (solicitud.estado !== 'PAGADA') {
      throw new BadRequestException('La solicitud no está en estado PAGADA');
    }

    const updated = await this.prisma.solicitud.update({
      where: { id },
      data: { estado: 'EMITIDA', fechaEmision: new Date(), internoEmisorId: userId },
    });

    await this.emailService.enviarCertificadoEmitido(updated);

    return { success: true, data: updated, message: 'Certificado emitido' };
  }

  async getDashboardCiudadano(userId: string) {
    const totalActivas = await this.prisma.solicitud.count({
      where: { ciudadanoId: userId, estado: { notIn: ['EMITIDA', 'RECHAZADA'] } },
    });
    const pendientePago = await this.prisma.solicitud.count({
      where: { ciudadanoId: userId, estado: 'PENDIENTE_PAGO' },
    });
    const emitidas = await this.prisma.solicitud.count({
      where: { ciudadanoId: userId, estado: 'EMITIDA' },
    });
    const recientes = await this.prisma.solicitud.findMany({
      where: { ciudadanoId: userId },
      orderBy: { fechaCreacion: 'desc' },
      take: 5,
    });

    return { success: true, data: { totalActivas, pendientePago, emitidas, recientes } };
  }

  async getDashboardInterno() {
    const total = await this.prisma.solicitud.count();
    const pendientesRevision = await this.prisma.solicitud.count({
      where: { estado: 'PENDIENTE_REVISION' },
    });
    const pagadasSinEmitir = await this.prisma.solicitud.count({ where: { estado: 'PAGADA' } });
    const emitidasHoy = await this.prisma.solicitud.count({
      where: {
        estado: 'EMITIDA',
        fechaEmision: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });

    return { success: true, data: { total, pendientesRevision, pagadasSinEmitir, emitidasHoy } };
  }
}
