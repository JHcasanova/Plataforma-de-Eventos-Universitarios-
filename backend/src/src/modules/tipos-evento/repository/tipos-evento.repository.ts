import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Repositorio que encapsula todas las operaciones de base de datos
 * para la entidad TipoEvento usando PrismaService.
 */
@Injectable()
export class TiposEventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Retorna todos los tipos de evento ordenados por nombre ascendente. */
  findAll() {
    return this.prisma.tipoEvento.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  /** Busca un tipo de evento por su ID único. */
  findById(id: number) {
    return this.prisma.tipoEvento.findUnique({ where: { id } });
  }

  /** Busca un tipo de evento por nombre (para validar unicidad en creación). */
  findByNombre(nombre: string) {
    return this.prisma.tipoEvento.findUnique({ where: { nombre } });
  }

  /**
   * Busca un tipo de evento con el mismo nombre, excluyendo opcionalmente un ID
   * (para validar unicidad en actualización).
   */
  findConflicto(nombre: string, excludeId?: number) {
    return this.prisma.tipoEvento.findFirst({
      where: {
        nombre,
        ...(excludeId !== undefined && { NOT: { id: excludeId } }),
      },
    });
  }

  /** Crea un nuevo tipo de evento con los datos proporcionados. */
  create(data: { nombre: string; descripcion?: string }) {
    return this.prisma.tipoEvento.create({ data });
  }

  /** Actualiza un tipo de evento por su ID. */
  update(id: number, data: { nombre?: string; descripcion?: string }) {
    return this.prisma.tipoEvento.update({ where: { id }, data });
  }

  /** Elimina un tipo de evento por su ID. */
  delete(id: number) {
    return this.prisma.tipoEvento.delete({ where: { id } });
  }
}
