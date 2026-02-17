import { PagosService } from '../pagos/pagos.service';
export declare class WebhooksController {
    private pagosService;
    private readonly logger;
    constructor(pagosService: PagosService);
    handlePlusPagosWebhook(payload: any): Promise<{
        status: string;
    }>;
}
