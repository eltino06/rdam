import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [AuditoriaModule],
  providers: [TasksService],
})
export class TasksModule {}
