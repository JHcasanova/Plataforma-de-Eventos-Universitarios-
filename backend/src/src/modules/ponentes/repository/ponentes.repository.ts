import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Repositorio que encapsula todas las operaciones de base de datos
 * para la entidad Ponente usando PrismaService.
 */
@Injectable()
export class PonentesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Retorna todos los ponentes ordenados por apellido y nombre ascendente. */
  findAll() {
    return this.prisma.ponente.findMany({
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    });
  }

  /** Busca un ponente por su ID único. */
  findById(id: number) {
    return this.prisma.ponente.findUnique({ where: { id } });
  }

  /** Busca un ponente por email (para validar unicidad en creación). */
  findByEmail(email: string) {
    return this.prisma.ponente.findUnique({ where: { email } });
  }

  /**
   * Busca un ponente con el mismo email, excluyendo opcionalmente un ID
   * (para validar unicidad en actualización).
   */
  findConflicto(email: string, excludeId?: number) {
    return this.prisma.ponente.findFirst({
      where: {
        email,
        ...(excludeId !== undefined && { NOT: { id: excludeId } }),
      },
    });
  }

  /** Crea un nuevo ponente con los datos proporcionados. */
  create(data: {
    nombre: string;
    apellido: string;
    email: string;
    areasExperticia: string[];
    institucion?: string;
  }) {
    return this.prisma.ponente.create({ data });
  }

  /** Actualiza un ponente por su ID. */
  update(
    id: number,
    data: {
      nombre?: string;
      apellido?: string;
      email?: string;
      areasExperticia?: string[];
      institucion?: string;
    },
  ) {
    return this.prisma.ponente.update({ where: { id }, data });
  }

  /** Elimina un ponente por su ID. */
  delete(id: number) {
    return this.prisma.ponente.delete({ where: { id } });
  }
}
