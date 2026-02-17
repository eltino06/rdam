import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [AuditoriaModule, EmailModule],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}