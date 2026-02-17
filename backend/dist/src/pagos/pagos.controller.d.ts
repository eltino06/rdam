import { PagosService } from './pagos.service';
export declare class PagosController {
    private readonly pagosService;
    constructor(pagosService: PagosService);
    iniciar(solicitudId: string): Promise<{
        success: boolean;
        data: {
            pagoId: string;
            monto: import("@prisma/client/runtime/library").Decimal;
            numeroSolicitud: string;
            checkoutUrl: string;
        };
    }>;
}
