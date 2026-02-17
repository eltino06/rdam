import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Solo se permiten imágenes y PDFs'), false);
  }
};

@Controller('solicitudes')
@UseGuards(JwtAuthGuard)
export class ArchivosController {
  constructor(private prisma: PrismaService) {}

  @Post(':id/archivos')
  @UseInterceptors(
    FileInterceptor('archivo', { storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  async subirArchivo(@Param('id') id: string, @UploadedFile() file: any, @Request() req: any) {
    if (!file) throw new BadRequestException('No se subió ningún archivo');

    const solicitud = await this.prisma.solicitud.findUnique({ where: { id } });
    if (!solicitud) throw new BadRequestException('Solicitud no encontrada');

    const archivo = await this.prisma.archivoAdjunto.create({
      data: {
        solicitudId: id,
        nombre: file.originalname,
        url: `/api/solicitudes/archivos/file/${file.filename}`,
        tipo: file.mimetype,
        subidoPor: req.user.id,
      },
    });

    return { success: true, data: archivo };
  }

  @Get(':id/archivos')
  async getArchivos(@Param('id') id: string) {
    const archivos = await this.prisma.archivoAdjunto.findMany({
      where: { solicitudId: id },
      orderBy: { fechaSubida: 'desc' },
    });
    return { success: true, data: archivos };
  }

  @Delete(':id/archivos/:archivoId')
  async eliminarArchivo(
    @Param('id') id: string,
    @Param('archivoId') archivoId: string,
    @Request() req: any,
  ) {
    const archivo = await this.prisma.archivoAdjunto.findUnique({ where: { id: archivoId } });
    if (!archivo) throw new BadRequestException('Archivo no encontrado');

    // Borrar del disco
    const filename = archivo.url.split('/').pop();
    const filepath = `./uploads/${filename}`;
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

    await this.prisma.archivoAdjunto.delete({ where: { id: archivoId } });

    return { success: true, message: 'Archivo eliminado' };
  }
}
