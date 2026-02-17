import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(@Request() req) {
    return this.usuariosService.findAll(req.user.rol);
  }

  @Post()
  create(@Body() body: any, @Request() req) {
    return this.usuariosService.create(body, req.user.rol);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.usuariosService.update(id, body, req.user.rol);
  }
}
