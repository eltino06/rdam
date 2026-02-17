import { Module } from '@nestjs/common';
import { SolicitudesController } from './solicitudes.controller';
import { SolicitudesService } from './solicitudes.service';
import { ArchivosController } from './archivos.controller';
import { StaticController } from './static.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule, EmailModule, MulterModule.register({ dest: './uploads' })],
  controllers: [SolicitudesController, ArchivosController, StaticController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}
