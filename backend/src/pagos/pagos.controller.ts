import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pagos')
@UseGuards(JwtAuthGuard)
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('iniciar/:solicitudId')
  async iniciar(@Param('solicitudId') solicitudId: string) {
    return this.pagosService.iniciarPago(solicitudId);
  }
}