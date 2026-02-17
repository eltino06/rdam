import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: any): Promise<{
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
    login(email: string, password: string): Promise<{
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
