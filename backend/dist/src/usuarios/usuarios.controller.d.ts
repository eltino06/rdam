import { UsuariosService } from './usuarios.service';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    findAll(filters: any): Promise<{
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
    create(body: any): Promise<{
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
