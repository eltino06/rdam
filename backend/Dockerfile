FROM node:20-alpine

# Instalar OpenSSL y dependencias necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar la aplicación
RUN npm run build && ls -la dist/

EXPOSE 3000

# Ejecutar migraciones y luego iniciar en modo producción
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]