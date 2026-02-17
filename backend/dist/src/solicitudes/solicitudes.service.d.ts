import { PrismaService } from '../prisma/prisma.service';
export declare class SolicitudesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any, userId: string): Promise<{
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
    findAll(userId: string, userRole: string, filters?: any): Promise<{
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
    findOne(id: string, userId: string, userRole: string): Promise<{
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
    getDashboardCiudadano(userId: string): Promise<{
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
    getDashboardInterno(): Promise<{
        success: boolean;
        data: {
            total: number;
            pendientesRevision: number;
            pagadasSinEmitir: number;
            emitidasHoy: number;
        };
    }>;
}
