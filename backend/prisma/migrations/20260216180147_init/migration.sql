-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('CIUDADANO', 'INTERNO');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('CIUDADANO', 'OPERADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE_REVISION', 'EN_REVISION', 'APROBADA', 'RECHAZADA', 'PENDIENTE_PAGO', 'PAGADA', 'EMITIDA');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'EXITOSO', 'FALLIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "cuil" TEXT,
    "rol" "RolUsuario" NOT NULL DEFAULT 'CIUDADANO',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes" (
    "id" TEXT NOT NULL,
    "numero_solicitud" TEXT NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL,
    "tipo_certificado" TEXT NOT NULL,
    "motivo_solicitud" TEXT NOT NULL,
    "datos_adicionales" JSONB,
    "monto_arancel" DECIMAL(10,2) NOT NULL,
    "ciudadano_id" TEXT NOT NULL,
    "ciudadano_nombre" TEXT NOT NULL,
    "ciudadano_email" TEXT NOT NULL,
    "ciudadano_cuil" TEXT NOT NULL,
    "ciudadano_telefono" TEXT,
    "ciudadano_domicilio" TEXT,
    "interno_revisor_id" TEXT,
    "interno_revisor_nombre" TEXT,
    "fecha_revision" TIMESTAMP(3),
    "fecha_aprobacion" TIMESTAMP(3),
    "observaciones_rechazo" TEXT,
    "fecha_timeout" TIMESTAMP(3),
    "pago_id" TEXT,
    "pago_fecha" TIMESTAMP(3),
    "pago_metodo" TEXT,
    "certificado_pdf_url" TEXT,
    "fecha_emision" TIMESTAMP(3),
    "interno_emisor_id" TEXT,
    "interno_emisor_nombre" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "solicitud_id" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "pluspagos_transaction_id" TEXT,
    "estado" "EstadoPago" NOT NULL,
    "metodo_pago" TEXT,
    "datos_transaccion" JSONB,
    "fecha_intento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_confirmacion" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" TEXT NOT NULL,
    "solicitud_id" TEXT,
    "usuario_id" TEXT,
    "usuario_nombre" TEXT,
    "accion" TEXT NOT NULL,
    "estado_anterior" TEXT,
    "estado_nuevo" TEXT,
    "observaciones" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion" (
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_pkey" PRIMARY KEY ("clave")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cuil_key" ON "usuarios"("cuil");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_cuil_idx" ON "usuarios"("cuil");

-- CreateIndex
CREATE INDEX "usuarios_tipo_activo_idx" ON "usuarios"("tipo", "activo");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_numero_solicitud_key" ON "solicitudes"("numero_solicitud");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_pago_id_key" ON "solicitudes"("pago_id");

-- CreateIndex
CREATE INDEX "solicitudes_estado_idx" ON "solicitudes"("estado");

-- CreateIndex
CREATE INDEX "solicitudes_ciudadano_id_idx" ON "solicitudes"("ciudadano_id");

-- CreateIndex
CREATE INDEX "solicitudes_numero_solicitud_idx" ON "solicitudes"("numero_solicitud");

-- CreateIndex
CREATE INDEX "solicitudes_fecha_creacion_idx" ON "solicitudes"("fecha_creacion" DESC);

-- CreateIndex
CREATE INDEX "solicitudes_ciudadano_cuil_idx" ON "solicitudes"("ciudadano_cuil");

-- CreateIndex
CREATE INDEX "solicitudes_interno_revisor_id_idx" ON "solicitudes"("interno_revisor_id");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_solicitud_id_key" ON "pagos"("solicitud_id");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_pluspagos_transaction_id_key" ON "pagos"("pluspagos_transaction_id");

-- CreateIndex
CREATE INDEX "pagos_pluspagos_transaction_id_idx" ON "pagos"("pluspagos_transaction_id");

-- CreateIndex
CREATE INDEX "pagos_estado_idx" ON "pagos"("estado");

-- CreateIndex
CREATE INDEX "auditoria_solicitud_id_idx" ON "auditoria"("solicitud_id");

-- CreateIndex
CREATE INDEX "auditoria_usuario_id_idx" ON "auditoria"("usuario_id");

-- CreateIndex
CREATE INDEX "auditoria_timestamp_idx" ON "auditoria"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "auditoria_accion_idx" ON "auditoria"("accion");

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_ciudadano_id_fkey" FOREIGN KEY ("ciudadano_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_interno_revisor_id_fkey" FOREIGN KEY ("interno_revisor_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pagos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_interno_emisor_id_fkey" FOREIGN KEY ("interno_emisor_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
