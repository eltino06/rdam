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
exports.PagosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const auditoria_service_1 = require("../auditoria/auditoria.service");
const email_service_1 = require("../email/email.service");
let PagosService = class PagosService {
    constructor(prisma, auditoriaService, emailService) {
        this.prisma = prisma;
        this.auditoriaService = auditoriaService;
        this.emailService = emailService;
    }
    async iniciarPago(solicitudId) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { id: solicitudId },
        });
        if (!solicitud) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        if (solicitud.estado !== 'PENDIENTE_PAGO') {
            throw new common_1.BadRequestException('La solicitud no está lista para pago');
        }
        const pago = await this.prisma.pago.create({
            data: {
                solicitudId: solicitud.id,
                monto: solicitud.montoArancel,
                estado: 'PENDIENTE',
            },
        });
        return {
            success: true,
            data: {
                pagoId: pago.id,
                monto: pago.monto,
                numeroSolicitud: solicitud.numeroSolicitud,
                checkoutUrl: `http://pluspagos.com/checkout/${pago.id}`,
            },
        };
    }
    async confirmarPago(numeroSolicitud, transactionId, webhookData) {
        const solicitud = await this.prisma.solicitud.findUnique({
            where: { numeroSolicitud },
            include: { pago: true },
        });
        if (!solicitud) {
            throw new common_1.NotFoundException('Solicitud no encontrada');
        }
        const existingTransaction = await this.prisma.pago.findUnique({
            where: { pluspagosTransactionId: transactionId },
        });
        if (existingTransaction) {
            return { success: true, message: 'Pago ya procesado' };
        }
        let pago;
        if (solicitud.pago) {
            pago = await this.prisma.pago.update({
                where: { id: solicitud.pago.id },
                data: {
                    pluspagosTransactionId: transactionId,
                    estado: 'EXITOSO',
                    metodoPago: webhookData.payment_method || 'Tarjeta',
                    datosTransaccion: webhookData,
                    fechaConfirmacion: new Date(),
                },
            });
        }
        else {
            pago = await this.prisma.pago.create({
                data: {
                    solicitudId: solicitud.id,
                    monto: solicitud.montoArancel,
                    pluspagosTransactionId: transactionId,
                    estado: 'EXITOSO',
                    metodoPago: webhookData.payment_method || 'Tarjeta',
                    datosTransaccion: webhookData,
                    fechaConfirmacion: new Date(),
                },
            });
        }
        await this.prisma.solicitud.update({
            where: { id: solicitud.id },
            data: {
                estado: 'PAGADA',
                pagoId: pago.id,
                pagoFecha: new Date(),
                pagoMetodo: pago.metodoPago,
            },
        });
        await this.auditoriaService.registrar({
            solicitudId: solicitud.id,
            accion: 'PAGAR',
            estadoAnterior: 'PENDIENTE_PAGO',
            estadoNuevo: 'PAGADA',
            observaciones: `Transaction ID: ${transactionId}`,
        });
        await this.emailService.enviarSolicitudAprobada(solicitud);
        return { success: true, message: 'Pago confirmado exitosamente' };
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auditoria_service_1.AuditoriaService,
        email_service_1.EmailService])
], PagosService);
//# sourceMappingURL=pagos.service.js.map