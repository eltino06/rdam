import { ConfigService } from '@nestjs/config';
export declare class PdfService {
    private config;
    private readonly logger;
    constructor(config: ConfigService);
    generarCertificado(solicitud: any): Promise<string>;
}
