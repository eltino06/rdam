import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private config: ConfigService) {}

  async enviarSolicitudCreada(solicitud: any) {
    this.logger.log(`📧 Email enviado: Solicitud ${solicitud.numeroSolicitud} creada`);
    // TODO: Implementar envío real de email
    return true;
  }

  async enviarSolicitudAprobada(solicitud: any) {
    this.logger.log(`📧 Email enviado: Solicitud ${solicitud.numeroSolicitud} aprobada`);
    return true;
  }

  async enviarSolicitudRechazada(solicitud: any) {
    this.logger.log(`📧 Email enviado: Solicitud ${solicitud.numeroSolicitud} rechazada`);
    return true;
  }

  async enviarCertificadoEmitido(solicitud: any) {
    this.logger.log(`📧 Email enviado: Certificado ${solicitud.numeroSolicitud} emitido`);
    return true;
  }
}