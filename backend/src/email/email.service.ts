import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  async enviarBienvenida(usuario: any) {
    try {
      await this.transporter.sendMail({
        from: this.config.get('MAIL_FROM'),
        to: usuario.email,
        subject: `👋 Bienvenido a RDAM - ${usuario.nombreCompleto}`,
        html: this.template({
          titulo: 'Bienvenido',
          color: '#3b82f6',
          nombre: usuario.nombreCompleto,
          contenido: `
            <p>Tu cuenta fue creada exitosamente. Ya podés iniciar sesión y solicitar tus certificados digitales.</p>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">TU EMAIL DE ACCESO</p>
              <p style="margin:0;color:#60a5fa;font-size:16px;font-weight:700;">${usuario.email}</p>
            </div>
            <p style="color:#94a3b8;">Podés solicitar los siguientes certificados: Residencia, Antecedentes, Nacimiento, Matrimonio y Defunción.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${this.config.get('FRONTEND_URL') || 'http://localhost:5173'}" 
                 style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">
                Ingresar al Sistema
              </a>
            </div>
          `,
        }),
      });
      this.logger.log(`📧 Email de bienvenida enviado a ${usuario.email}`);
    } catch (error) {
      this.logger.error(`❌ Error enviando bienvenida: ${error.message}`);
    }
    return true;
  }

  async enviarSolicitudCreada(solicitud: any) {
    try {
      await this.transporter.sendMail({
        from: this.config.get('MAIL_FROM'),
        to: solicitud.ciudadanoEmail,
        subject: `✅ Solicitud ${solicitud.numeroSolicitud} recibida - RDAM`,
        html: this.template({
          titulo: 'Solicitud Recibida',
          color: '#3b82f6',
          nombre: solicitud.ciudadanoNombre,
          contenido: `
            <p>Tu solicitud ha sido recibida correctamente y está siendo procesada.</p>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">NÚMERO DE SOLICITUD</p>
              <p style="margin:0;color:#60a5fa;font-size:22px;font-weight:700;">${solicitud.numeroSolicitud}</p>
            </div>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">TIPO DE CERTIFICADO</p>
              <p style="margin:0;color:white;font-size:16px;font-weight:600;">${solicitud.tipoCertificado}</p>
            </div>
            <p style="color:#94a3b8;">Un operador revisará tu solicitud a la brevedad.</p>
          `,
        }),
      });
      this.logger.log(`📧 Email enviado: Solicitud ${solicitud.numeroSolicitud} creada`);
    } catch (error) {
      this.logger.error(`❌ Error enviando email: ${error.message}`);
    }
    return true;
  }

  async enviarSolicitudAprobada(solicitud: any) {
    try {
      await this.transporter.sendMail({
        from: this.config.get('MAIL_FROM'),
        to: solicitud.ciudadanoEmail,
        subject: `🎉 Solicitud ${solicitud.numeroSolicitud} aprobada - RDAM`,
        html: this.template({
          titulo: 'Solicitud Aprobada',
          color: '#10b981',
          nombre: solicitud.ciudadanoNombre,
          contenido: `
            <p>¡Buenas noticias! Tu solicitud fue <strong style="color:#34d399;">aprobada</strong>.</p>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">NÚMERO DE SOLICITUD</p>
              <p style="margin:0;color:#60a5fa;font-size:22px;font-weight:700;">${solicitud.numeroSolicitud}</p>
            </div>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">MONTO A PAGAR</p>
              <p style="margin:0;color:#34d399;font-size:22px;font-weight:700;">$${Number(solicitud.montoArancel).toLocaleString('es-AR')} ARS</p>
            </div>
            <p style="color:#94a3b8;">Ingresá al sistema y realizá el pago para continuar.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${this.config.get('FRONTEND_URL') || 'http://localhost:5173'}" 
                 style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">
                Ir al Sistema
              </a>
            </div>
          `,
        }),
      });
      this.logger.log(`📧 Email enviado: Solicitud ${solicitud.numeroSolicitud} aprobada`);
    } catch (error) {
      this.logger.error(`❌ Error enviando email: ${error.message}`);
    }
    return true;
  }

  async enviarSolicitudRechazada(solicitud: any) {
    try {
      await this.transporter.sendMail({
        from: this.config.get('MAIL_FROM'),
        to: solicitud.ciudadanoEmail,
        subject: `❌ Solicitud ${solicitud.numeroSolicitud} rechazada - RDAM`,
        html: this.template({
          titulo: 'Solicitud Rechazada',
          color: '#ef4444',
          nombre: solicitud.ciudadanoNombre,
          contenido: `
            <p>Tu solicitud fue <strong style="color:#f87171;">rechazada</strong>.</p>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">NÚMERO DE SOLICITUD</p>
              <p style="margin:0;color:#60a5fa;font-size:22px;font-weight:700;">${solicitud.numeroSolicitud}</p>
            </div>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #ef4444;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">MOTIVO DEL RECHAZO</p>
              <p style="margin:0;color:#fca5a5;font-size:15px;line-height:1.6;">${solicitud.observacionesRechazo}</p>
            </div>
            <p style="color:#94a3b8;">Podés crear una nueva solicitud corrigiendo los puntos mencionados.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${this.config.get('FRONTEND_URL') || 'http://localhost:5173'}" 
                 style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">
                Ir al Sistema
              </a>
            </div>
          `,
        }),
      });
      this.logger.log(`📧 Email enviado: Solicitud ${solicitud.numeroSolicitud} rechazada`);
    } catch (error) {
      this.logger.error(`❌ Error enviando email: ${error.message}`);
    }
    return true;
  }

  async enviarCertificadoEmitido(solicitud: any) {
    try {
      await this.transporter.sendMail({
        from: this.config.get('MAIL_FROM'),
        to: solicitud.ciudadanoEmail,
        subject: `📄 Certificado ${solicitud.numeroSolicitud} disponible - RDAM`,
        html: this.template({
          titulo: 'Certificado Emitido',
          color: '#8b5cf6',
          nombre: solicitud.ciudadanoNombre,
          contenido: `
            <p>¡Tu certificado está listo para descargar!</p>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">NÚMERO DE SOLICITUD</p>
              <p style="margin:0;color:#60a5fa;font-size:22px;font-weight:700;">${solicitud.numeroSolicitud}</p>
            </div>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">TIPO DE CERTIFICADO</p>
              <p style="margin:0;color:#a78bfa;font-size:16px;font-weight:600;">${solicitud.tipoCertificado}</p>
            </div>
            <p style="color:#94a3b8;">Ingresá al sistema y descargá tu certificado en PDF.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${this.config.get('FRONTEND_URL') || 'http://localhost:5173'}" 
                 style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">
                Descargar Certificado
              </a>
            </div>
          `,
        }),
      });
      this.logger.log(`📧 Email enviado: Certificado ${solicitud.numeroSolicitud} emitido`);
    } catch (error) {
      this.logger.error(`❌ Error enviando email: ${error.message}`);
    }
    return true;
  }

  private template({ titulo, color, nombre, contenido }: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
          <h1 style="margin:0;color:white;font-size:28px;font-weight:800;">RDAM</h1>
          <p style="margin:8px 0 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Sistema de Certificados Digitales</p>
        </div>
        <div style="background:#1e293b;padding:40px;border:1px solid rgba(59,130,246,0.2);">
          <div style="display:inline-block;background:${color}20;border:1px solid ${color}40;border-radius:8px;padding:6px 14px;margin-bottom:20px;">
            <span style="color:${color};font-size:13px;font-weight:700;text-transform:uppercase;">${titulo}</span>
          </div>
          <h2 style="margin:0 0 16px 0;color:white;font-size:22px;font-weight:700;">Hola, ${nombre} 👋</h2>
          <div style="color:#cbd5e1;font-size:15px;line-height:1.7;">${contenido}</div>
        </div>
        <div style="background:#0f172a;border:1px solid rgba(59,130,246,0.1);border-radius:0 0 16px 16px;padding:24px;text-align:center;">
          <p style="margin:0;color:#475569;font-size:12px;">© ${new Date().getFullYear()} RDAM - Sistema de Certificados Digitales</p>
        </div>
      </div>
    </body>
    </html>`;
  }

  async enviarCodigoVerificacion(usuario: any, codigo: string) {
    try {
      await this.transporter.sendMail({
        from: this.config.get('MAIL_FROM'),
        to: usuario.email,
        subject: `🔐 Tu código de acceso RDAM: ${codigo}`,
        html: this.template({
          titulo: 'Código de Verificación',
          color: '#8b5cf6',
          nombre: usuario.nombreCompleto,
          contenido: `
            <p>Tu código de verificación para ingresar al sistema es:</p>
            <div style="text-align:center;margin:32px 0;">
              <div style="display:inline-block;background:rgba(139,92,246,0.1);border:2px solid rgba(139,92,246,0.4);border-radius:16px;padding:24px 48px;">
                <p style="margin:0;color:#a78bfa;font-size:48px;font-weight:900;letter-spacing:12px;">${codigo}</p>
              </div>
            </div>
            <p style="color:#94a3b8;text-align:center;">Este código expira en <strong style="color:white;">10 minutos</strong>.</p>
            <p style="color:#94a3b8;text-align:center;font-size:13px;">Si no fuiste vos, ignorá este email.</p>
          `,
        }),
      });
      this.logger.log(`📧 Código de verificación enviado a ${usuario.email}`);
    } catch (error) {
      this.logger.error(`❌ Error enviando código: ${error.message}`);
    }
    return true;
  }
}
