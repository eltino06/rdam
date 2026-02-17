import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            tipo: import(".prisma/client").$Enums.TipoUsuario;
            nombreCompleto: string;
            rol: import(".prisma/client").$Enums.RolUsuario;
            fechaRegistro: Date;
        };
        message: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        data: {
            access_token: string;
            token_type: string;
            expires_in: number;
            user: {
                id: string;
                nombreCompleto: string;
                email: string;
                tipo: import(".prisma/client").$Enums.TipoUsuario;
                rol: import(".prisma/client").$Enums.RolUsuario;
            };
        };
    }>;
}
