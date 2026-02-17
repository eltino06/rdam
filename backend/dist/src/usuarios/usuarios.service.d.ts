import { PrismaService } from '../prisma/prisma.service';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: any): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            nombreCompleto: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
            activo: boolean;
            fechaRegistro: Date;
        }[];
    }>;
    create(data: any): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            nombreCompleto: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
            activo: boolean;
        };
        message: string;
    }>;
    toggleActivo(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            cuil: string | null;
            tipo: import(".prisma/client").$Enums.TipoUsuario;
            nombreCompleto: string;
            passwordHash: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
            activo: boolean;
            fechaRegistro: Date;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
}
