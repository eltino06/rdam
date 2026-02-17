
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  UseGuards, 
  Request 
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('solicitudes')
@UseGuards(JwtAuthGuard)
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(@Body() body: any, @Request() req) {
    return this.solicitudesService.create(body, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query() filters: any) {
    return this.solicitudesService.findAll(req.user.id, req.user.rol, filters);
  }

  @Get('mis-solicitudes')
  misSolicitudes(@Request() req, @Query() filters: any) {
    return this.solicitudesService.findAll(req.user.id, 'CIUDADANO', filters);
  }

  @Get('dashboard-ciudadano')
  dashboardCiudadano(@Request() req) {
    return this.solicitudesService.getDashboardCiudadano(req.user.id);
  }

  @Get('dashboard-interno')
  dashboardInterno() {
    return this.solicitudesService.getDashboardInterno();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.solicitudesService.findOne(id, req.user.id, req.user.rol);
  }
}