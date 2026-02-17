import { PrismaService } from '../prisma/prisma.service';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class TasksService {
    private prisma;
    private auditoriaService;
    private readonly logger;
    constructor(prisma: PrismaService, auditoriaService: AuditoriaService);
    liberarSolicitudesEnRevision(): Promise<void>;
}
