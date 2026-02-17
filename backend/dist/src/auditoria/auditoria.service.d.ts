import { PrismaService } from '../prisma/prisma.service';
export declare class AuditoriaService {
    private prisma;
    constructor(prisma: PrismaService);
    registrar(data: any): Promise<{
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
    }>;
    findAll(filters?: any): Promise<{
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
}
