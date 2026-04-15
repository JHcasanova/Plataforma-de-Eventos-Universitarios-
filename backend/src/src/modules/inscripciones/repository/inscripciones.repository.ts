import { Injectable } from '@nestjs/common';
import { EstadoInscripcion } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

/** Relaciones incluidas al retornar una inscripción */
const INCLUDE_INSCRIPCION = {
  estudiante: true,
  evento: {
    include: {
      tipoEvento: true,
      espacio: true,
      facultad: true,
    },
  },
};

/**
 * Repositorio que encapsula todas las operaciones de base de datos
 * para la entidad Inscripcion usando PrismaService.
 */
@Injectable()
export class InscripcionesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Busca una inscripción por su ID, incluyendo el evento. */
  findById(id: number) {
    return this.prisma.inscripcion.findUnique({
      where: { id },
      include: { evento: true },
    });
  }

  /**
   * Busca una inscripción activa (estado != CANCELADA) para un estudiante y evento.
   * Usado para detectar inscripciones duplicadas.
   */
  findActiva(estudianteId: number, eventoId: number) {
    return this.prisma.inscripcion.findFirst({
      where: {
        estudianteId,
        eventoId,
        estado: { not: EstadoInscripcion.CANCELADA },
      },
    });
  }

  /**
   * Retorna todas las inscripciones de un estudiante con el include completo,
   * ordenadas por fechaInscripcion descendente.
   */
  findByEstudiante(estudianteId: number) {
    return this.prisma.inscripcion.findMany({
      where: { estudianteId },
      include: INCLUDE_INSCRIPCION,
      orderBy: { fechaInscripcion: 'desc' },
    });
  }

  /**
   * Retorna todas las inscripciones de un evento, incluyendo el estudiante,
   * ordenadas por fechaInscripcion ascendente.
   */
  findByEvento(eventoId: number) {
    return this.prisma.inscripcion.findMany({
      where: { eventoId },
      include: { estudiante: true },
      orderBy: { fechaInscripcion: 'asc' },
    });
  }

  /** Crea una nueva inscripción con los datos proporcionados, incluyendo relaciones. */
  create(data: {
    estudianteId: number;
    eventoId: number;
    estado: EstadoInscripcion;
  }) {
    return this.prisma.inscripcion.create({
      data,
      include: INCLUDE_INSCRIPCION,
    });
  }

  /** Actualiza el estado de una inscripción por su ID, incluyendo relaciones. */
  updateEstado(id: number, estado: EstadoInscripcion) {
    return this.prisma.inscripcion.update({
      where: { id },
      data: { estado },
      include: INCLUDE_INSCRIPCION,
    });
  }

  /**
   * Busca un evento por su ID.
   * Usado para validar estado y cupos antes de inscribir.
   */
  findEventoById(eventoId: number) {
    return this.prisma.evento.findUnique({ where: { id: eventoId } });
  }

  /**
   * Ejecuta una función dentro de una transacción de Prisma.
   * Permite al service coordinar múltiples operaciones atómicamente.
   */
  ejecutarTransaccion<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
