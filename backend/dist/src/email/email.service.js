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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    async enviarSolicitudCreada(solicitud) {
        this.logger.log(`📧 Email enviado: Solicitud ${solicitud.numeroSolicitud} creada`);
        return true;
    }
    async enviarSolicitudAprobada(solicitud) {
        this.logger.log(`📧 Email enviado: Solicitud ${solicitud.numeroSolicitud} aprobada`);
        return true;
    }
    async enviarSolicitudRechazada(solicitud) {
        this.logger.log(`📧 Email enviado: Solicitud ${solicitud.numeroSolicitud} rechazada`);
        return true;
    }
    async enviarCertificadoEmitido(solicitud) {
        this.logger.log(`📧 Email enviado: Certificado ${solicitud.numeroSolicitud} emitido`);
        return true;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map