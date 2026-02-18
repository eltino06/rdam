-- CreateTable
CREATE TABLE "codigos_verificacion" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "codigos_verificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivos_adjuntos" (
    "id" TEXT NOT NULL,
    "solicitud_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "subido_por" TEXT NOT NULL,
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivos_adjuntos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "codigos_verificacion_email_idx" ON "codigos_verificacion"("email");

-- CreateIndex
CREATE INDEX "codigos_verificacion_codigo_idx" ON "codigos_verificacion"("codigo");

-- CreateIndex
CREATE INDEX "archivos_adjuntos_solicitud_id_idx" ON "archivos_adjuntos"("solicitud_id");

-- AddForeignKey
ALTER TABLE "archivos_adjuntos" ADD CONSTRAINT "archivos_adjuntos_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
