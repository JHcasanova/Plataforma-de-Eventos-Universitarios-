-- CreateEnum
CREATE TYPE "EstadoEvento" AS ENUM ('BORRADOR', 'PUBLICADO', 'CANCELADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "EstadoInscripcion" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoEspacio" AS ENUM ('AULA', 'AUDITORIO', 'LABORATORIO', 'CANCHA', 'OTRO');

-- CreateTable
CREATE TABLE "Facultad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facultad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoEvento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Espacio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "tipo" "TipoEspacio" NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Espacio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ponente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "areasExperticia" TEXT[],
    "institucion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ponente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "facultadId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "cupoMaximo" INTEGER NOT NULL,
    "cuposDisponibles" INTEGER NOT NULL,
    "estado" "EstadoEvento" NOT NULL DEFAULT 'BORRADOR',
    "tipoEventoId" INTEGER NOT NULL,
    "espacioId" INTEGER NOT NULL,
    "facultadId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" SERIAL NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "estado" "EstadoInscripcion" NOT NULL DEFAULT 'PENDIENTE',
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" SERIAL NOT NULL,
    "inscripcionId" INTEGER NOT NULL,
    "asistio" BOOLEAN NOT NULL DEFAULT false,
    "horaRegistro" TIMESTAMP(3),
    "observaciones" TEXT,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventoToPonente" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Facultad_nombre_key" ON "Facultad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Facultad_codigo_key" ON "Facultad"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "TipoEvento_nombre_key" ON "TipoEvento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Espacio_nombre_key" ON "Espacio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Ponente_email_key" ON "Ponente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_codigo_key" ON "Estudiante"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_email_key" ON "Estudiante"("email");

-- CreateIndex
CREATE INDEX "Evento_fechaInicio_idx" ON "Evento"("fechaInicio");

-- CreateIndex
CREATE INDEX "Evento_espacioId_idx" ON "Evento"("espacioId");

-- CreateIndex
CREATE INDEX "Inscripcion_estudianteId_eventoId_idx" ON "Inscripcion"("estudianteId", "eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_estudianteId_eventoId_key" ON "Inscripcion"("estudianteId", "eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_inscripcionId_key" ON "Asistencia"("inscripcionId");

-- CreateIndex
CREATE UNIQUE INDEX "_EventoToPonente_AB_unique" ON "_EventoToPonente"("A", "B");

-- CreateIndex
CREATE INDEX "_EventoToPonente_B_index" ON "_EventoToPonente"("B");

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_facultadId_fkey" FOREIGN KEY ("facultadId") REFERENCES "Facultad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_tipoEventoId_fkey" FOREIGN KEY ("tipoEventoId") REFERENCES "TipoEvento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_espacioId_fkey" FOREIGN KEY ("espacioId") REFERENCES "Espacio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_facultadId_fkey" FOREIGN KEY ("facultadId") REFERENCES "Facultad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES "Inscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventoToPonente" ADD CONSTRAINT "_EventoToPonente_A_fkey" FOREIGN KEY ("A") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventoToPonente" ADD CONSTRAINT "_EventoToPonente_B_fkey" FOREIGN KEY ("B") REFERENCES "Ponente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
