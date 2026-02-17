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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const existingUser = await this.prisma.usuario.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        if (data.cuil) {
            const existingCuil = await this.prisma.usuario.findUnique({
                where: { cuil: data.cuil },
            });
            if (existingCuil) {
                throw new common_1.ConflictException('El CUIL ya está registrado');
            }
        }
        const passwordHash = await bcrypt.hash(data.password, 12);
        const user = await this.prisma.usuario.create({
            data: {
                tipo: 'CIUDADANO',
                nombreCompleto: data.nombreCompleto,
                email: data.email,
                passwordHash,
                cuil: data.cuil,
                rol: 'CIUDADANO',
            },
            select: {
                id: true,
                nombreCompleto: true,
                email: true,
                tipo: true,
                rol: true,
                fechaRegistro: true,
            },
        });
        return {
            success: true,
            data: user,
            message: 'Usuario registrado exitosamente',
        };
    }
    async login(email, password) {
        const user = await this.prisma.usuario.findUnique({
            where: { email },
        });
        if (!user || !user.activo) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            tipo: user.tipo,
            rol: user.rol,
        };
        return {
            success: true,
            data: {
                access_token: this.jwtService.sign(payload),
                token_type: 'Bearer',
                expires_in: 86400,
                user: {
                    id: user.id,
                    nombreCompleto: user.nombreCompleto,
                    email: user.email,
                    tipo: user.tipo,
                    rol: user.rol,
                },
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map