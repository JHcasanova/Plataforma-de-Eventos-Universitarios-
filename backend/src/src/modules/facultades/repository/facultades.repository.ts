import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Repositorio que encapsula todas las operaciones de base de datos
 * para la entidad Facultad usando PrismaService.
 */
@Injectable()
export class FacultadesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Retorna todas las facultades ordenadas por nombre ascendente. */
  findAll() {
    return this.prisma.facultad.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  /** Busca una facultad por nombre o código (para validar unicidad en creación). */
  findByNombreOrCodigo(nombre: string, codigo: string) {
    return this.prisma.facultad.findFirst({
      where: {
        OR: [{ nombre }, { codigo }],
      },
    });
  }

  /** Busca una facultad por su ID único. */
  findById(id: number) {
    return this.prisma.facultad.findUnique({ where: { id } });
  }

  /**
   * Busca una facultad que tenga el mismo nombre o código,
   * excluyendo opcionalmente un ID (para validar unicidad en actualización).
   */
  findConflicto(nombre?: string, codigo?: string, excludeId?: number) {
    const condiciones: any[] = [];
    if (nombre) condiciones.push({ nombre });
    if (codigo) condiciones.push({ codigo });

    if (condiciones.length === 0) return Promise.resolve(null);

    return this.prisma.facultad.findFirst({
      where: {
        OR: condiciones,
        ...(excludeId !== undefined && { NOT: { id: excludeId } }),
      },
    });
  }

  /** Crea una nueva facultad con nombre y código. */
  create(nombre: string, codigo: string) {
    return this.prisma.facultad.create({
      data: { nombre, codigo },
    });
  }

  /** Actualiza los datos de una facultad por su ID. */
  update(id: number, data: { nombre?: string; codigo?: string }) {
    return this.prisma.facultad.update({
      where: { id },
      data,
    });
  }

  /** Elimina una facultad por su ID. */
  delete(id: number) {
    return this.prisma.facultad.delete({ where: { id } });
  }
}
