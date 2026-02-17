import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private config;
    private readonly logger;
    constructor(config: ConfigService);
    enviarSolicitudCreada(solicitud: any): Promise<boolean>;
    enviarSolicitudAprobada(solicitud: any): Promise<boolean>;
    enviarSolicitudRechazada(solicitud: any): Promise<boolean>;
    enviarCertificadoEmitido(solicitud: any): Promise<boolean>;
}
