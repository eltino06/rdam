import { AuditoriaService } from './auditoria.service';
export declare class AuditoriaController {
    private readonly auditoriaService;
    constructor(auditoriaService: AuditoriaService);
    findAll(filters: any): {
        success: boolean;
        data: Promise<{
            id: string;
            usuarioNombre: string | null;
            accion: string;
            estadoAnterior: string | null;
            estadoNuevo: string | null;
            observaciones: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            timestamp: Date;
            solicitudId: string | null;
            usuarioId: string | null;
        }[]>;
    };
}
