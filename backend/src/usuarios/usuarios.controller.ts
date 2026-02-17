import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(@Query() filters: any) {
    return this.usuariosService.findAll(filters);
  }

  @Post()
  create(@Body() body: any) {
    return this.usuariosService.create(body);
  }

  @Patch(':id/toggle-activo')
  toggleActivo(@Param('id') id: string) {
    return this.usuariosService.toggleActivo(id);
  }
}