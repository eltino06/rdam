import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@rdam.gob.ar' },
    update: {},
    create: {
      tipo: 'INTERNO',
      nombreCompleto: 'Carlos Díaz',
      email: 'admin@rdam.gob.ar',
      passwordHash: adminPassword,
      rol: 'ADMIN',
    },
  });

  console.log('✅ Admin creado:', admin.email);

  // Crear operador
  const operadorPassword = await bcrypt.hash('Operador123!', 12);
  const operador = await prisma.usuario.upsert({
    where: { email: 'operador@rdam.gob.ar' },
    update: {},
    create: {
      tipo: 'INTERNO',
      nombreCompleto: 'María González',
      email: 'operador@rdam.gob.ar',
      passwordHash: operadorPassword,
      rol: 'OPERADOR',
    },
  });

  console.log('✅ Operador creado:', operador.email);

  // Crear ciudadano de prueba
  const ciudadanoPassword = await bcrypt.hash('Ciudadano123!', 12);
  const ciudadano = await prisma.usuario.upsert({
    where: { email: 'ciudadano@test.com' },
    update: {},
    create: {
      tipo: 'CIUDADANO',
      nombreCompleto: 'Juan Carlos Pérez',
      email: 'ciudadano@test.com',
      passwordHash: ciudadanoPassword,
      cuil: '20-12345678-9',
      rol: 'CIUDADANO',
    },
  });

  console.log('✅ Ciudadano creado:', ciudadano.email);

  // Crear configuración
  await prisma.configuracion.upsert({
    where: { clave: 'monto_arancel_default' },
    update: {},
    create: {
      clave: 'monto_arancel_default',
      valor: '5000.00',
      descripcion: 'Monto default del arancel en ARS',
    },
  });

  await prisma.configuracion.upsert({
    where: { clave: 'timeout_revision_horas' },
    update: {},
    create: {
      clave: 'timeout_revision_horas',
      valor: '2',
      descripcion: 'Horas antes de liberar solicitud EN_REVISION',
    },
  });

  console.log('✅ Configuración creada');
  console.log('🎉 Seed completado!');
  console.log('\n📝 Usuarios creados:');
  console.log('Admin: admin@rdam.gob.ar / Admin123!');
  console.log('Operador: operador@rdam.gob.ar / Operador123!');
  console.log('Ciudadano: ciudadano@test.com / Ciudadano123!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });