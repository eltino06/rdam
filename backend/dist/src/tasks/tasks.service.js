"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const auditoria_service_1 = require("../auditoria/auditoria.service");
let TasksService = TasksService_1 = class TasksService {
    constructor(prisma, auditoriaService) {
        this.prisma = prisma;
        this.auditoriaService = auditoriaService;
        this.logger = new common_1.Logger(TasksService_1.name);
    }
    async liberarSolicitudesEnRevision() {
        this.logger.log('Ejecutando tarea: liberar solicitudes en revisión con timeout');
        const solicitudesTimeout = await this.prisma.solicitud.findMany({
            where: {
                estado: 'EN_REVISION',
                fechaTimeout: {
                    lte: new Date(),
                },
            },
        });
        for (const solicitud of solicitudesTimeout) {
            await this.prisma.solicitud.update({
                where: { id: solicitud.id },
                data: {
                    estado: 'PENDIENTE_REVISION',
                    internoRevisorId: null,
                    internoRevisorNombre: null,
                    fechaTimeout: null,
                },
            });
            await this.auditoriaService.registrar({
                solicitudId: solicitud.id,
                accion: 'TIMEOUT',
                estadoAnterior: 'EN_REVISION',
                estadoNuevo: 'PENDIENTE_REVISION',
                observaciones: 'Liberada automáticamente por timeout (2 horas)',
            });
            this.logger.log(`Solicitud ${solicitud.numeroSolicitud} liberada por timeout`);
        }
        this.logger.log(`Total liberadas: ${solicitudesTimeout.length}`);
    }
};
exports.TasksService = TasksService;
__decorate([
    (0, schedule_1.Cron)('0 */15 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "liberarSolicitudesEnRevision", null);
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auditoria_service_1.AuditoriaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map