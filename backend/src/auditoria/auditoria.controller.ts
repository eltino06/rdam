import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  findAll(@Query() filters: any) {
    return {
      success: true,
      data: this.auditoriaService.findAll(filters),
    };
  }
}