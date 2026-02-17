import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AuditoriaService } from '../auditoria/auditoria.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private prisma: PrismaService,
    private auditoriaService: AuditoriaService,
  ) {}

  @Cron('0 */15 * * * *')
  async liberarSolicitudesEnRevision() {
    this.logger.log('Ejecutando tarea: liberar solicitudes en revisión con timeout');

    const solicitudesTimeout = await this.prisma.solicitud.findMany({
      where: {
        estado: 'EN_REVISION',
        fechaTimeout: {
          lte: new Date(),
        },
      },
    });

    for (const solicitud of solicitudesTimeout) {
      await this.prisma.solicitud.update({
        where: { id: solicitud.id },
        data: {
          estado: 'PENDIENTE_REVISION',
          internoRevisorId: null,
          internoRevisorNombre: null,
          fechaTimeout: null,
        },
      });

      await this.auditoriaService.registrar({
        solicitudId: solicitud.id,
        accion: 'TIMEOUT',
        estadoAnterior: 'EN_REVISION',
        estadoNuevo: 'PENDIENTE_REVISION',
        observaciones: 'Liberada automáticamente por timeout (2 horas)',
      });

      this.logger.log(`Solicitud ${solicitud.numeroSolicitud} liberada por timeout`);
    }

    this.logger.log(`Total liberadas: ${solicitudesTimeout.length}`);
  }
}
