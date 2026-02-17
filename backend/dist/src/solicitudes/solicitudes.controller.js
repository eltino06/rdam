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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudesController = void 0;
const common_1 = require("@nestjs/common");
const solicitudes_service_1 = require("./solicitudes.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SolicitudesController = class SolicitudesController {
    constructor(solicitudesService) {
        this.solicitudesService = solicitudesService;
    }
    create(body, req) {
        return this.solicitudesService.create(body, req.user.id);
    }
    findAll(req, filters) {
        return this.solicitudesService.findAll(req.user.id, req.user.rol, filters);
    }
    misSolicitudes(req, filters) {
        return this.solicitudesService.findAll(req.user.id, 'CIUDADANO', filters);
    }
    dashboardCiudadano(req) {
        return this.solicitudesService.getDashboardCiudadano(req.user.id);
    }
    dashboardInterno() {
        return this.solicitudesService.getDashboardInterno();
    }
    findOne(id, req) {
        return this.solicitudesService.findOne(id, req.user.id, req.user.rol);
    }
};
exports.SolicitudesController = SolicitudesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mis-solicitudes'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "misSolicitudes", null);
__decorate([
    (0, common_1.Get)('dashboard-ciudadano'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "dashboardCiudadano", null);
__decorate([
    (0, common_1.Get)('dashboard-interno'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "dashboardInterno", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SolicitudesController.prototype, "findOne", null);
exports.SolicitudesController = SolicitudesController = __decorate([
    (0, common_1.Controller)('solicitudes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [solicitudes_service_1.SolicitudesService])
], SolicitudesController);
//# sourceMappingURL=solicitudes.controller.js.map