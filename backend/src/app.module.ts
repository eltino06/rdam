import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { PagosModule } from './pagos/pagos.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { EmailModule } from './email/email.module';
import { PdfModule } from './pdf/pdf.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    SolicitudesModule,
    PagosModule,
    WebhooksModule,
    EmailModule,
    PdfModule,
    UsuariosModule,
    AuditoriaModule,
    TasksModule,
  ],
})
export class AppModule {}
