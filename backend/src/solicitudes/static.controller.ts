import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('solicitudes/archivos')
export class StaticController {
  @Get('file/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filepath = path.join(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    return res.sendFile(filepath);
  }
}
