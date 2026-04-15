import { Injectable } from '@nestjs/common';
import { EstadoEvento, TipoEspacio } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Repositorio que encapsula todas las operaciones de base de datos
 * para la entidad Espacio usando PrismaService.
 */
@Injectable()
export class EspaciosRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Retorna todos los espacios ordenados por nombre ascendente. */
  findAll() {
    return this.prisma.espacio.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  /** Busca un espacio por su ID único. */
  findById(id: number) {
    return this.prisma.espacio.findUnique({ where: { id } });
  }

  /** Busca un espacio por nombre (para validar unicidad en creación). */
  findByNombre(nombre: string) {
    return this.prisma.espacio.findUnique({ where: { nombre } });
  }

  /**
   * Busca un espacio con el mismo nombre, excluyendo opcionalmente un ID
   * (para validar unicidad en actualización).
   */
  findConflicto(nombre: string, excludeId?: number) {
    return this.prisma.espacio.findFirst({
      where: {
        nombre,
        ...(excludeId !== undefined && { NOT: { id: excludeId } }),
      },
    });
  }

  /** Crea un nuevo espacio con los datos proporcionados. */
  create(data: {
    nombre: string;
    ubicacion: string;
    capacidad: number;
    tipo: TipoEspacio;
    disponible?: boolean;
  }) {
    return this.prisma.espacio.create({ data });
  }

  /** Actualiza un espacio por su ID. */
  update(
    id: number,
    data: {
      nombre?: string;
      ubicacion?: string;
      capacidad?: number;
      tipo?: TipoEspacio;
      disponible?: boolean;
    },
  ) {
    return this.prisma.espacio.update({ where: { id }, data });
  }

  /** Elimina un espacio por su ID. */
  delete(id: number) {
    return this.prisma.espacio.delete({ where: { id } });
  }

  /**
   * Cuenta los eventos que se solapan con el rango de fechas indicado para un espacio.
   * Dos rangos [A,B] y [C,D] se solapan si A < D AND C < B.
   */
  countEventosConflictivos(espacioId: number, fechaInicio: Date, fechaFin: Date) {
    return this.prisma.evento.count({
      where: {
        espacioId,
        estado: { in: [EstadoEvento.PUBLICADO, EstadoEvento.BORRADOR] },
        fechaInicio: { lt: fechaFin },
        fechaFin: { gt: fechaInicio },
      },
    });
  }
}
