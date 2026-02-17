import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendSolicitudCreada(email: string, nombre: string, numeroSolicitud: string, tipo: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: `✅ Solicitud ${numeroSolicitud} recibida - RDAM`,
      html: this.template({
        titulo: 'Solicitud Recibida',
        color: '#3b82f6',
        nombre,
        contenido: `
          <p>Tu solicitud ha sido recibida correctamente y está siendo procesada.</p>
          <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">NÚMERO DE SOLICITUD</p>
            <p style="margin:0;color:#60a5fa;font-size:22px;font-weight:700;">${numeroSolicitud}</p>
          </div>
          <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">TIPO DE CERTIFICADO</p>
            <p style="margin:0;color:white;font-size:16px;font-weight:600;">${tipo}</p>
          </div>
          <p style="color:#94a3b8;">Un operador revisará tu solicitud a la brevedad. Te notificaremos cuando haya novedades.</p>
        `,
      }),
    });
  }

  async sendSolicitudAprobada(email: string, nombre: string, numeroSolicitud: string, monto: number) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: `🎉 Solicitud ${numeroSolicitud} aprobada - RDAM`,
      html: this.template({
        titulo: 'Solicitud Aprobada',
        color: '#10b981',
        nombre,
        contenido: `
          <p>¡Buenas noticias! Tu solicitud fue <strong style="color:#34d399;">aprobada</strong>.</p>
          <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">NÚMERO DE SOLICITUD</p>
            <p style="margin:0;color:#60a5fa;font-size:22px;font-weight:700;">${numeroSolicitud}</p>
          </div>
          <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">MONTO A PAGAR</p>
            <p style="margin:0;color:#34d399;font-size:22px;font-weight:700;">$${monto.toLocaleString('es-AR')} ARS</p>
          </div>
          <p style="color:#94a3b8;">Para continuar con el trámite, ingresá al sistema y realizá el pago del arancel correspondiente.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
               style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
              Ir al Sistema
            </a>
          </div>
        `,
      }),
    });
  }

  async sendSolicitudRechazada(email: string, nombre: string, numeroSolicitud: string, motivo: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: `❌ Solicitud ${numeroSolicitud} rechazada - RDAM`,
      html: this.template({
        titulo: 'Solicitud Rechazada',
        color: '#ef4444',
        nombre,
        contenido: `
          <p>Lamentamos informarte que tu solicitud fue <strong style="color:#f87171;">rechazada</strong>.</p>
          <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">NÚMERO DE SOLICITUD</p>
            <p style="margin:0;color:#60a5fa;font-size:22px;font-weight:700;">${numeroSolicitud}</p>
          </div>
          <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #ef4444;">
            <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">MOTIVO DEL RECHAZO</p>
            <p style="margin:0;color:#fca5a5;font-size:15px;line-height:1.6;">${motivo}</p>
          </div>
          <p style="color:#94a3b8;">Podés crear una nueva solicitud corrigiendo los puntos mencionados. Si tenés dudas, contactá con la oficina.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
               style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
              Ir al Sistema
            </a>
          </div>
        `,
      }),
    });
  }

  async sendCertificadoEmitido(email: string, nombre: string, numeroSolicitud: string, tipo: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: `📄 Certificado ${numeroSolicitud} disponible - RDAM`,
      html: this.template({
        titulo: 'Certificado Emitido',
        color: '#8b5cf6',
        nombre,
        contenido: `
          <p>¡Tu certificado está listo! Ya podés descargarlo desde el sistema.</p>
          <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">NÚMERO DE SOLICITUD</p>
            <p style="margin:0;color:#60a5fa;font-size:22px;font-weight:700;">${numeroSolicitud}</p>
          </div>
          <div style="background:#1e293b;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px 0;color:#94a3b8;font-size:13px;">TIPO DE CERTIFICADO</p>
            <p style="margin:0;color:#a78bfa;font-size:16px;font-weight:600;">${tipo}</p>
          </div>
          <p style="color:#94a3b8;">Ingresá al sistema y descargá tu certificado en formato PDF desde la sección "Mis Solicitudes".</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
               style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
              Descargar Certificado
            </a>
          </div>
        `,
      }),
    });
  }

  private template({ titulo, color, nombre, contenido }: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
          <div style="width:60px;height:60px;background:rgba(255,255,255,0.15);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <span style="font-size:28px;">🏛️</span>
          </div>
          <h1 style="margin:0;color:white;font-size:28px;font-weight:800;letter-spacing:-0.03em;">RDAM</h1>
          <p style="margin:8px 0 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Sistema de Certificados Digitales</p>
        </div>

        <!-- Body -->
        <div style="background:#1e293b;padding:40px;border-left:1px solid rgba(59,130,246,0.2);border-right:1px solid rgba(59,130,246,0.2);">
          <div style="display:inline-block;background:${color}20;border:1px solid ${color}40;border-radius:8px;padding:6px 14px;margin-bottom:20px;">
            <span style="color:${color};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${titulo}</span>
          </div>
          
          <h2 style="margin:0 0 16px 0;color:white;font-size:22px;font-weight:700;">
            Hola, ${nombre} 👋
          </h2>

          <div style="color:#cbd5e1;font-size:15px;line-height:1.7;">
            ${contenido}
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#0f172a;border:1px solid rgba(59,130,246,0.1);border-radius:0 0 16px 16px;padding:24px;text-align:center;">
          <p style="margin:0 0 8px 0;color:#475569;font-size:13px;">
            Este es un email automático del sistema RDAM. Por favor no respondas este correo.
          </p>
          <p style="margin:0;color:#334155;font-size:12px;">
            © ${new Date().getFullYear()} RDAM - Registro Digital de Actos Municipales
          </p>
        </div>

      </div>
    </body>
    </html>
    `;
  }
}
