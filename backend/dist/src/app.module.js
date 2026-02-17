"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const solicitudes_module_1 = require("./solicitudes/solicitudes.module");
const pagos_module_1 = require("./pagos/pagos.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const email_module_1 = require("./email/email.module");
const pdf_module_1 = require("./pdf/pdf.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const auditoria_module_1 = require("./auditoria/auditoria.module");
const tasks_module_1 = require("./tasks/tasks.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            solicitudes_module_1.SolicitudesModule,
            pagos_module_1.PagosModule,
            webhooks_module_1.WebhooksModule,
            email_module_1.EmailModule,
            pdf_module_1.PdfModule,
            usuarios_module_1.UsuariosModule,
            auditoria_module_1.AuditoriaModule,
            tasks_module_1.TasksModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map