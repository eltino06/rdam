import { PrismaService } from '../prisma/prisma.service';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { EmailService } from '../email/email.service';
export declare class PagosService {
    private prisma;
    private auditoriaService;
    private emailService;
    constructor(prisma: PrismaService, auditoriaService: AuditoriaService, emailService: EmailService);
    iniciarPago(solicitudId: string): Promise<{
        success: boolean;
        data: {
            pagoId: string;
            monto: import("@prisma/client/runtime/library").Decimal;
            numeroSolicitud: string;
            checkoutUrl: string;
        };
    }>;
    confirmarPago(numeroSolicitud: string, transactionId: string, webhookData: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
