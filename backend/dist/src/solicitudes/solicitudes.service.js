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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SolicitudesService = class SolicitudesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId) {
        const ciudadano = await this.prisma.usuario.findUnique({
            where: { id: userId },
        });
        if (!ciudadano) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const year = new Date().getFullYear();
        const lastSolicitud = await this.prisma.solicitud.findFirst({
            where: {
                numeroSolicitud: {
                    startsWith: `CERT-${year}-`,
                },
            },
            orderBy: {
                fechaCreacion: 'desc',
            },
        });
        let nextNumber = 1;
        if (lastSolicitud) {
            const lastNumber = parseInt(lastSolicitud.numeroSolicitud.split('-')[2]);
            nextNumber = lastNumber + 1;
        }
        const numeroSolicitud = `CERT-${year}-${String(nextNumber).padStart(5, '0')}`;
        const solicitud = await this.prisma.solicitud.create({
            data: {
                numeroSolicitud,
                estado: 'PENDIENTE_REVISION',
                tipoCertificado: data.tipoCertificado,
                motivoSolicitud: data.motivoSolicitud,
                montoArancel: data.montoArancel || 5000,
                ciudadanoId: userId,
                ciudadanoNombre: ciudadano.nombreCompleto,
                ciudadanoEmail: ciudadano.email,
                ciudadanoCuil: ciudadano.cuil,
                ciudadanoTelefono: data.ciudadanoTelefono,
                ciudadanoDomicilio: data.ciudadanoDomicilio,
                datosAdicionales: data.datosAdicionales,
            },
        });
        return {
            success: true,
            data: solicitud,
            message: 'Solicitud creada exitosamente',
        };
    }
    async findAll(userId, userRole, filters) {
        const where = {};
        if (userRole === 'CIUDADANO') {
            where.ciudadanoId = userId;
        }
        if (filters?.estado) {
            where.estado = filters.estado;
        }
        if (filters?.numeroSolicitud) {
            where.numeroSolicitud = {
                contains: filters.numeroSolicitud,
                mode: 'insensitive',
            };
        }
        const solicitudes = await this.prisma.solicitud.findMany({
            where,
            include: {
                ciudadano: {
                    select: {
                        id: true,
                        nombreCompleto: true,
                        email: true,
                        cuil: true,
                    },
                },
            },
            orderBy: {
                fechaCreacion: 'desc',
            },
        });
        return {
            success: true,
            data: solicitudes,
        };
    }
    async findOne(id, userId, userRole) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { id },
            include: {
                ciudadano: {
                    select: {
                        id: true,
                        nombreCompleto: true,
                        email: true,
                        cuil: true,
                    },
                },
                internoRevisor: {
                    select: {
                        id: true,
                        nombreCompleto: true,
                    },
                },
            },
        });
        if (!solicitud) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (userRole === 'CIUDADANO' && solicitud.ciudadanoId !== userId) {
            throw new common_1.ForbiddenException('No tiene permiso para ver esta solicitud');
        }
        return {
            success: true,
            data: solicitud,
        };
    }
    async getDashboardCiudadano(userId) {
        const totalActivas = await this.prisma.solicitud.count({
            where: {
                ciudadanoId: userId,
                estado: {
                    notIn: ['EMITIDA', 'RECHAZADA'],
                },
            },
        });
        const pendientePago = await this.prisma.solicitud.count({
            where: {
                ciudadanoId: userId,
                estado: 'PENDIENTE_PAGO',
            },
        });
        const emitidas = await this.prisma.solicitud.count({
            where: {
                ciudadanoId: userId,
                estado: 'EMITIDA',
            },
        });
        const recientes = await this.prisma.solicitud.findMany({
            where: {
                ciudadanoId: userId,
            },
            orderBy: {
                fechaCreacion: 'desc',
            },
            take: 5,
        });
        return {
            success: true,
            data: {
                totalActivas,
                pendientePago,
                emitidas,
                recientes,
            },
        };
    }
    async getDashboardInterno() {
        const total = await this.prisma.solicitud.count();
        const pendientesRevision = await this.prisma.solicitud.count({
            where: {
                estado: 'PENDIENTE_REVISION',
            },
        });
        const pagadasSinEmitir = await this.prisma.solicitud.count({
            where: {
                estado: 'PAGADA',
            },
        });
        const emitidasHoy = await this.prisma.solicitud.count({
            where: {
                estado: 'EMITIDA',
                fechaEmision: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });
        return {
            success: true,
            data: {
                total,
                pendientesRevision,
                pagadasSinEmitir,
                emitidasHoy,
            },
        };
    }
};
exports.SolicitudesService = SolicitudesService;
exports.SolicitudesService = SolicitudesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SolicitudesService);
//# sourceMappingURL=solicitudes.service.js.map