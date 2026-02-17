import { Controller, Post, Body, Logger } from '@nestjs/common';
import { PagosService } from '../pagos/pagos.service';

@Controller('webhook')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private pagosService: PagosService) {}

  @Post('pluspagos')
  async handlePlusPagosWebhook(@Body() payload: any) {
    this.logger.log(`Webhook recibido: ${JSON.stringify(payload)}`);

    try {
      if (payload.event === 'payment.approved') {
        await this.pagosService.confirmarPago(payload.order_id, payload.transaction_id, payload);
      }

      return { status: 'received' };
    } catch (error) {
      this.logger.error(`Error procesando webhook: ${error.message}`);
      throw error;
    }
  }
}
