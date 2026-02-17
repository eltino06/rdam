import { SolicitudesService } from './solicitudes.service';
export declare class SolicitudesController {
    private readonly solicitudesService;
    constructor(solicitudesService: SolicitudesService);
    create(body: any, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            numeroSolicitud: string;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            tipoCertificado: string;
            motivoSolicitud: string;
            datosAdicionales: import("@prisma/client/runtime/library").JsonValue | null;
            montoArancel: import("@prisma/client/runtime/library").Decimal;
            ciudadanoId: string;
            ciudadanoNombre: string;
            ciudadanoEmail: string;
            ciudadanoCuil: string;
            ciudadanoTelefono: string | null;
            ciudadanoDomicilio: string | null;
            internoRevisorId: string | null;
            internoRevisorNombre: string | null;
            fechaRevision: Date | null;
            fechaAprobacion: Date | null;
            observacionesRechazo: string | null;
            fechaTimeout: Date | null;
            pagoId: string | null;
            pagoFecha: Date | null;
            pagoMetodo: string | null;
            certificadoPdfUrl: string | null;
            fechaEmision: Date | null;
            internoEmisorId: string | null;
            internoEmisorNombre: string | null;
            fechaCreacion: Date;
        };
        message: string;
    }>;
    findAll(req: any, filters: any): Promise<{
        success: boolean;
        data: ({
            ciudadano: {
                id: string;
                email: string;
                cuil: string;
                nombreCompleto: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            numeroSolicitud: string;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            tipoCertificado: string;
            motivoSolicitud: string;
            datosAdicionales: import("@prisma/client/runtime/library").JsonValue | null;
            montoArancel: import("@prisma/client/runtime/library").Decimal;
            ciudadanoId: string;
            ciudadanoNombre: string;
            ciudadanoEmail: string;
            ciudadanoCuil: string;
            ciudadanoTelefono: string | null;
            ciudadanoDomicilio: string | null;
            internoRevisorId: string | null;
            internoRevisorNombre: string | null;
            fechaRevision: Date | null;
            fechaAprobacion: Date | null;
            observacionesRechazo: string | null;
            fechaTimeout: Date | null;
            pagoId: string | null;
            pagoFecha: Date | null;
            pagoMetodo: string | null;
            certificadoPdfUrl: string | null;
            fechaEmision: Date | null;
            internoEmisorId: string | null;
            internoEmisorNombre: string | null;
            fechaCreacion: Date;
        })[];
    }>;
    misSolicitudes(req: any, filters: any): Promise<{
        success: boolean;
        data: ({
            ciudadano: {
                id: string;
                email: string;
                cuil: string;
                nombreCompleto: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            numeroSolicitud: string;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            tipoCertificado: string;
            motivoSolicitud: string;
            datosAdicionales: import("@prisma/client/runtime/library").JsonValue | null;
            montoArancel: import("@prisma/client/runtime/library").Decimal;
            ciudadanoId: string;
            ciudadanoNombre: string;
            ciudadanoEmail: string;
            ciudadanoCuil: string;
            ciudadanoTelefono: string | null;
            ciudadanoDomicilio: string | null;
            internoRevisorId: string | null;
            internoRevisorNombre: string | null;
            fechaRevision: Date | null;
            fechaAprobacion: Date | null;
            observacionesRechazo: string | null;
            fechaTimeout: Date | null;
            pagoId: string | null;
            pagoFecha: Date | null;
            pagoMetodo: string | null;
            certificadoPdfUrl: string | null;
            fechaEmision: Date | null;
            internoEmisorId: string | null;
            internoEmisorNombre: string | null;
            fechaCreacion: Date;
        })[];
    }>;
    dashboardCiudadano(req: any): Promise<{
        success: boolean;
        data: {
            totalActivas: number;
            pendientePago: number;
            emitidas: number;
            recientes: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                numeroSolicitud: string;
                estado: import(".prisma/client").$Enums.EstadoSolicitud;
                tipoCertificado: string;
                motivoSolicitud: string;
                datosAdicionales: import("@prisma/client/runtime/library").JsonValue | null;
                montoArancel: import("@prisma/client/runtime/library").Decimal;
                ciudadanoId: string;
                ciudadanoNombre: string;
                ciudadanoEmail: string;
                ciudadanoCuil: string;
                ciudadanoTelefono: string | null;
                ciudadanoDomicilio: string | null;
                internoRevisorId: string | null;
                internoRevisorNombre: string | null;
                fechaRevision: Date | null;
                fechaAprobacion: Date | null;
                observacionesRechazo: string | null;
                fechaTimeout: Date | null;
                pagoId: string | null;
                pagoFecha: Date | null;
                pagoMetodo: string | null;
                certificadoPdfUrl: string | null;
                fechaEmision: Date | null;
                internoEmisorId: string | null;
                internoEmisorNombre: string | null;
                fechaCreacion: Date;
            }[];
        };
    }>;
    dashboardInterno(): Promise<{
        success: boolean;
        data: {
            total: number;
            pendientesRevision: number;
            pagadasSinEmitir: number;
            emitidasHoy: number;
        };
    }>;
    findOne(id: string, req: any): Promise<{
        success: boolean;
        data: {
            ciudadano: {
                id: string;
                email: string;
                cuil: string;
                nombreCompleto: string;
            };
            internoRevisor: {
                id: string;
                nombreCompleto: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            numeroSolicitud: string;
            estado: import(".prisma/client").$Enums.EstadoSolicitud;
            tipoCertificado: string;
            motivoSolicitud: string;
            datosAdicionales: import("@prisma/client/runtime/library").JsonValue | null;
            montoArancel: import("@prisma/client/runtime/library").Decimal;
            ciudadanoId: string;
            ciudadanoNombre: string;
            ciudadanoEmail: string;
            ciudadanoCuil: string;
            ciudadanoTelefono: string | null;
            ciudadanoDomicilio: string | null;
            internoRevisorId: string | null;
            internoRevisorNombre: string | null;
            fechaRevision: Date | null;
            fechaAprobacion: Date | null;
            observacionesRechazo: string | null;
            fechaTimeout: Date | null;
            pagoId: string | null;
            pagoFecha: Date | null;
            pagoMetodo: string | null;
            certificadoPdfUrl: string | null;
            fechaEmision: Date | null;
            internoEmisorId: string | null;
            internoEmisorNombre: string | null;
            fechaCreacion: Date;
        };
    }>;
}
