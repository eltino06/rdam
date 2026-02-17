import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class PagosService {
  constructor(
    private prisma: PrismaService,
    private auditoriaService: AuditoriaService,
    private emailService: EmailService,
  ) {}

  async iniciarPago(solicitudId: string) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { id: solicitudId },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.estado !== 'PENDIENTE_PAGO') {
      throw new BadRequestException('La solicitud no está lista para pago');
    }

    const pago = await this.prisma.pago.create({
      data: {
        solicitudId: solicitud.id,
        monto: solicitud.montoArancel,
        estado: 'PENDIENTE',
      },
    });

    return {
      success: true,
      data: {
        pagoId: pago.id,
        monto: pago.monto,
        numeroSolicitud: solicitud.numeroSolicitud,
        checkoutUrl: `http://pluspagos.com/checkout/${pago.id}`, // Simulado
      },
    };
  }

  async confirmarPago(numeroSolicitud: string, transactionId: string, webhookData: any) {
    const solicitud = await this.prisma.solicitud.findUnique({
      where: { numeroSolicitud },
      include: { pago: true },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    const existingTransaction = await this.prisma.pago.findUnique({
      where: { pluspagosTransactionId: transactionId },
    });

    if (existingTransaction) {
      return { success: true, message: 'Pago ya procesado' };
    }

    let pago;
    if (solicitud.pago) {
      pago = await this.prisma.pago.update({
        where: { id: solicitud.pago.id },
        data: {
          pluspagosTransactionId: transactionId,
          estado: 'EXITOSO',
          metodoPago: webhookData.payment_method || 'Tarjeta',
          datosTransaccion: webhookData,
          fechaConfirmacion: new Date(),
        },
      });
    } else {
      pago = await this.prisma.pago.create({
        data: {
          solicitudId: solicitud.id,
          monto: solicitud.montoArancel,
          pluspagosTransactionId: transactionId,
          estado: 'EXITOSO',
          metodoPago: webhookData.payment_method || 'Tarjeta',
          datosTransaccion: webhookData,
          fechaConfirmacion: new Date(),
        },
      });
    }

    await this.prisma.solicitud.update({
      where: { id: solicitud.id },
      data: {
        estado: 'PAGADA',
        pagoId: pago.id,
        pagoFecha: new Date(),
        pagoMetodo: pago.metodoPago,
      },
    });

    await this.auditoriaService.registrar({
      solicitudId: solicitud.id,
      accion: 'PAGAR',
      estadoAnterior: 'PENDIENTE_PAGO',
      estadoNuevo: 'PAGADA',
      observaciones: `Transaction ID: ${transactionId}`,
    });

    await this.emailService.enviarSolicitudAprobada(solicitud);

    return { success: true, message: 'Pago confirmado exitosamente' };
  }
}
