import { PrismaClient, TipoEspacio, EstadoEvento } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de datos...');

  // ─── Facultades ───────────────────────────────────────────────
  const [ingenieria, ciencias, humanidades] = await Promise.all([
    prisma.facultad.upsert({
      where: { codigo: 'FING' },
      update: {},
      create: { nombre: 'Facultad de Ingeniería', codigo: 'FING' },
    }),
    prisma.facultad.upsert({
      where: { codigo: 'FCIE' },
      update: {},
      create: { nombre: 'Facultad de Ciencias', codigo: 'FCIE' },
    }),
    prisma.facultad.upsert({
      where: { codigo: 'FHUM' },
      update: {},
      create: { nombre: 'Facultad de Humanidades', codigo: 'FHUM' },
    }),
  ]);
  console.log('Facultades creadas');

  // ─── Tipos de Evento ──────────────────────────────────────────
  const [tipoAcademico, tipoCultural, tipoDeportivo] = await Promise.all([
    prisma.tipoEvento.upsert({
      where: { nombre: 'Académico' },
      update: {},
      create: {
        nombre: 'Académico',
        descripcion: 'Conferencias, seminarios y talleres académicos',
      },
    }),
    prisma.tipoEvento.upsert({
      where: { nombre: 'Cultural' },
      update: {},
      create: {
        nombre: 'Cultural',
        descripcion: 'Actividades artísticas, musicales y culturales',
      },
    }),
    prisma.tipoEvento.upsert({
      where: { nombre: 'Deportivo' },
      update: {},
      create: {
        nombre: 'Deportivo',
        descripcion: 'Torneos, competencias y actividades deportivas',
      },
    }),
  ]);
  console.log('Tipos de evento creados');

  // ─── Espacios ─────────────────────────────────────────────────
  const [auditorio, aulaA, aulaB, cancha] = await Promise.all([
    prisma.espacio.upsert({
      where: { nombre: 'Auditorio Central' },
      update: {},
      create: {
        nombre: 'Auditorio Central',
        ubicacion: 'Edificio Principal, Planta Baja',
        capacidad: 300,
        tipo: TipoEspacio.AUDITORIO,
        disponible: true,
      },
    }),
    prisma.espacio.upsert({
      where: { nombre: 'Aula 101' },
      update: {},
      create: {
        nombre: 'Aula 101',
        ubicacion: 'Edificio A, Primer Piso',
        capacidad: 40,
        tipo: TipoEspacio.AULA,
        disponible: true,
      },
    }),
    prisma.espacio.upsert({
      where: { nombre: 'Aula 205' },
      update: {},
      create: {
        nombre: 'Aula 205',
        ubicacion: 'Edificio B, Segundo Piso',
        capacidad: 35,
        tipo: TipoEspacio.AULA,
        disponible: true,
      },
    }),
    prisma.espacio.upsert({
      where: { nombre: 'Cancha Polideportiva' },
      update: {},
      create: {
        nombre: 'Cancha Polideportiva',
        ubicacion: 'Campus Norte',
        capacidad: 200,
        tipo: TipoEspacio.CANCHA,
        disponible: true,
      },
    }),
  ]);
  console.log('Espacios creados');

  // ─── Ponentes ─────────────────────────────────────────────────
  const [ponente1, ponente2, ponente3] = await Promise.all([
    prisma.ponente.upsert({
      where: { email: 'ana.garcia@universidad.edu' },
      update: {},
      create: {
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana.garcia@universidad.edu',
        areasExperticia: ['Inteligencia Artificial', 'Machine Learning'],
        institucion: 'Universidad Nacional',
      },
    }),
    prisma.ponente.upsert({
      where: { email: 'carlos.mendez@externo.com' },
      update: {},
      create: {
        nombre: 'Carlos',
        apellido: 'Méndez',
        email: 'carlos.mendez@externo.com',
        areasExperticia: ['Desarrollo Web', 'Arquitectura de Software'],
        institucion: 'Tech Solutions S.A.',
      },
    }),
    prisma.ponente.upsert({
      where: { email: 'lucia.torres@ciencias.edu' },
      update: {},
      create: {
        nombre: 'Lucía',
        apellido: 'Torres',
        email: 'lucia.torres@ciencias.edu',
        areasExperticia: ['Biología Molecular', 'Genética'],
        institucion: 'Instituto de Ciencias',
      },
    }),
  ]);
  console.log('Ponentes creados');

  // ─── Estudiantes ──────────────────────────────────────────────
  const [est1, est2, est3] = await Promise.all([
    prisma.estudiante.upsert({
      where: { codigo: '20210001' },
      update: {},
      create: {
        codigo: '20210001',
        nombre: 'María',
        apellido: 'López',
        email: 'maria.lopez@estudiante.edu',
        facultadId: ingenieria.id,
      },
    }),
    prisma.estudiante.upsert({
      where: { codigo: '20210002' },
      update: {},
      create: {
        codigo: '20210002',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@estudiante.edu',
        facultadId: ciencias.id,
      },
    }),
    prisma.estudiante.upsert({
      where: { codigo: '20210003' },
      update: {},
      create: {
        codigo: '20210003',
        nombre: 'Sofía',
        apellido: 'Ramírez',
        email: 'sofia.ramirez@estudiante.edu',
        facultadId: humanidades.id,
      },
    }),
  ]);
  console.log('Estudiantes creados');

  // ─── Eventos ──────────────────────────────────────────────────
  const ahora = new Date();
  const enUnaSemana = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);
  const enUnaSemanaYDosHoras = new Date(enUnaSemana.getTime() + 2 * 60 * 60 * 1000);
  const enDosSemanas = new Date(ahora.getTime() + 14 * 24 * 60 * 60 * 1000);
  const enDosSemanaYTresHoras = new Date(enDosSemanas.getTime() + 3 * 60 * 60 * 1000);

  const evento1 = await prisma.evento.create({
    data: {
      titulo: 'Conferencia de Inteligencia Artificial 2025',
      descripcion:
        'Exploración de las últimas tendencias en IA y su impacto en la industria y la academia.',
      fechaInicio: enUnaSemana,
      fechaFin: enUnaSemanaYDosHoras,
      cupoMaximo: 250,
      cuposDisponibles: 250,
      estado: EstadoEvento.PUBLICADO,
      tipoEventoId: tipoAcademico.id,
      espacioId: auditorio.id,
      facultadId: ingenieria.id,
      ponentes: {
        connect: [{ id: ponente1.id }, { id: ponente2.id }],
      },
    },
  });

  const evento2 = await prisma.evento.create({
    data: {
      titulo: 'Taller de Biología Molecular para Estudiantes',
      descripcion:
        'Taller práctico sobre técnicas modernas de biología molecular y sus aplicaciones.',
      fechaInicio: enDosSemanas,
      fechaFin: enDosSemanaYTresHoras,
      cupoMaximo: 30,
      cuposDisponibles: 30,
      estado: EstadoEvento.PUBLICADO,
      tipoEventoId: tipoAcademico.id,
      espacioId: aulaA.id,
      facultadId: ciencias.id,
      ponentes: {
        connect: [{ id: ponente3.id }],
      },
    },
  });

  console.log(' Eventos creados');
  console.log(`\n Resumen del seed:`);
  console.log(`   - 3 Facultades`);
  console.log(`   - 3 Tipos de evento`);
  console.log(`   - 4 Espacios`);
  console.log(`   - 3 Ponentes`);
  console.log(`   - 3 Estudiantes`);
  console.log(`   - 2 Eventos publicados`);
  console.log('\n Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
