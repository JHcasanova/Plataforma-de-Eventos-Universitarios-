import { Injectable } from '@nestjs/common';
import { EstadoEvento } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

/** Relaciones estándar incluidas en las respuestas de eventos */
const INCLUDE_RELACIONES = {
  tipoEvento: true,
  espacio: true,
  facultad: true,
  ponentes: true,
};

/**
 * Repositorio que encapsula todas las operaciones de base de datos
 * para la entidad Evento usando PrismaService.
 */
@Injectable()
export class EventosRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna una lista paginada de eventos con filtros opcionales,
   * incluyendo todas las relaciones.
   */
  findAll(where: any, skip: number, take: number) {
    return this.prisma.evento.findMany({
      where,
      skip,
      take,
      include: INCLUDE_RELACIONES,
      orderBy: { fechaInicio: 'asc' },
    });
  }

  /** Cuenta el total de eventos que coinciden con el filtro (para paginación). */
  count(where: any) {
    return this.prisma.evento.count({ where });
  }

  /** Busca un evento por su ID, incluyendo todas las relaciones. */
  findById(id: number) {
    return this.prisma.evento.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
  }

  /**
   * Busca eventos que se solapan con el rango de fechas en el espacio indicado.
   * Excluye opcionalmente un evento por ID (para actualizaciones).
   * Dos rangos [A,B] y [C,D] se solapan si A < D AND C < B.
   */
  findByEspacioConflicto(
    espacioId: number,
    fechaInicio: Date,
    fechaFin: Date,
    excludeId?: number,
  ) {
    return this.prisma.evento.findMany({
      where: {
        espacioId,
        ...(excludeId !== undefined && { id: { not: excludeId } }),
        estado: { in: [EstadoEvento.PUBLICADO, EstadoEvento.BORRADOR] },
        fechaInicio: { lt: fechaFin },
        fechaFin: { gt: fechaInicio },
      },
    });
  }

  /**
   * Retorna eventos con estado PUBLICADO que coincidan con el filtro,
   * ordenados por fechaInicio ascendente.
   */
  findPublicados(where: any) {
    return this.prisma.evento.findMany({
      where: { ...where, estado: EstadoEvento.PUBLICADO },
      include: INCLUDE_RELACIONES,
      orderBy: { fechaInicio: 'asc' },
    });
  }

  /**
   * Retorna los próximos 10 eventos publicados con fecha futura,
   * ordenados por fechaInicio ascendente.
   */
  findProximos() {
    return this.prisma.evento.findMany({
      where: {
        estado: EstadoEvento.PUBLICADO,
        fechaInicio: { gt: new Date() },
      },
      include: INCLUDE_RELACIONES,
      orderBy: { fechaInicio: 'asc' },
      take: 10,
    });
  }

  /** Crea un nuevo evento con los datos proporcionados, incluyendo relaciones. */
  create(data: {
    titulo: string;
    descripcion?: string;
    fechaInicio: Date;
    fechaFin: Date;
    cupoMaximo: number;
    cuposDisponibles: number;
    estado: EstadoEvento;
    tipoEventoId: number;
    espacioId: number;
    facultadId: number;
    ponentes?: { connect: { id: number }[] };
  }) {
    return this.prisma.evento.create({
      data,
      include: INCLUDE_RELACIONES,
    });
  }

  /** Actualiza un evento por su ID, incluyendo relaciones en la respuesta. */
  update(id: number, data: any) {
    return this.prisma.evento.update({
      where: { id },
      data,
      include: INCLUDE_RELACIONES,
    });
  }

  /** Elimina un evento por su ID. */
  delete(id: number) {
    return this.prisma.evento.delete({ where: { id } });
  }

  /**
   * Busca un espacio por su ID.
   * Usado para validar disponibilidad antes de crear o actualizar un evento.
   */
  findEspacioById(espacioId: number) {
    return this.prisma.espacio.findUnique({ where: { id: espacioId } });
  }

  /**
   * Busca un tipo de evento por su ID.
   * Usado para validar que existe antes de crear un evento.
   */
  findTipoEventoById(tipoEventoId: number) {
    return this.prisma.tipoEvento.findUnique({ where: { id: tipoEventoId } });
  }

  /**
   * Busca una facultad por su ID.
   * Usado para validar que existe antes de crear un evento.
   */
  findFacultadById(facultadId: number) {
    return this.prisma.facultad.findUnique({ where: { id: facultadId } });
  }
}
