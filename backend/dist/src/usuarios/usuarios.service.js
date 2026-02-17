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
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
let UsuariosService = class UsuariosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
        const where = {
            tipo: 'INTERNO',
        };
        if (filters?.rol) {
            where.rol = filters.rol;
        }
        if (filters?.activo !== undefined) {
            where.activo = filters.activo === 'true';
        }
        const usuarios = await this.prisma.usuario.findMany({
            where,
            select: {
                id: true,
                nombreCompleto: true,
                email: true,
                rol: true,
                activo: true,
                fechaRegistro: true,
            },
            orderBy: {
                fechaRegistro: 'desc',
            },
        });
        return {
            success: true,
            data: usuarios,
        };
    }
    async create(data) {
        const existing = await this.prisma.usuario.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const passwordTemporal = crypto.randomBytes(8).toString('hex');
        const passwordHash = await bcrypt.hash(passwordTemporal, 12);
        const usuario = await this.prisma.usuario.create({
            data: {
                tipo: 'INTERNO',
                nombreCompleto: data.nombreCompleto,
                email: data.email,
                passwordHash,
                rol: data.rol,
            },
            select: {
                id: true,
                nombreCompleto: true,
                email: true,
                rol: true,
                activo: true,
            },
        });
        return {
            success: true,
            data: usuario,
            message: 'Usuario creado exitosamente',
        };
    }
    async toggleActivo(id) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const updated = await this.prisma.usuario.update({
            where: { id },
            data: {
                activo: !usuario.activo,
            },
        });
        return {
            success: true,
            data: updated,
            message: `Usuario ${updated.activo ? 'activado' : 'desactivado'}`,
        };
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map