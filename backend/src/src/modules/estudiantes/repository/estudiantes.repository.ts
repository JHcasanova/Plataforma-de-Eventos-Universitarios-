import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Repositorio que encapsula todas las operaciones de base de datos
 * para la entidad Estudiante usando PrismaService.
 */
@Injectable()
export class EstudiantesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Retorna todos los estudiantes con su facultad, ordenados por apellido ascendente. */
  findAll() {
    return this.prisma.estudiante.findMany({
      include: { facultad: true },
      orderBy: { apellido: 'asc' },
    });
  }

  /** Busca un estudiante por su ID, incluyendo la facultad. */
  findById(id: number) {
    return this.prisma.estudiante.findUnique({
      where: { id },
      include: { facultad: true },
    });
  }

  /** Busca un estudiante por código o email (para validar unicidad en creación). */
  findByCodigoOrEmail(codigo: string, email: string) {
    return this.prisma.estudiante.findFirst({
      where: {
        OR: [{ codigo }, { email }],
      },
    });
  }

  /**
   * Busca un estudiante que tenga el mismo código o email,
   * excluyendo opcionalmente un ID (para validar unicidad en actualización).
   */
  findConflicto(codigo?: string, email?: string, excludeId?: number) {
    const condiciones: any[] = [];
    if (codigo) condiciones.push({ codigo });
    if (email) condiciones.push({ email });

    if (condiciones.length === 0) return Promise.resolve(null);

    return this.prisma.estudiante.findFirst({
      where: {
        OR: condiciones,
        ...(excludeId !== undefined && { NOT: { id: excludeId } }),
      },
    });
  }

  /** Crea un nuevo estudiante con los datos proporcionados, incluyendo la facultad. */
  create(data: {
    codigo: string;
    nombre: string;
    apellido: string;
    email: string;
    facultadId: number;
  }) {
    return this.prisma.estudiante.create({
      data,
      include: { facultad: true },
    });
  }

  /** Actualiza un estudiante por su ID, incluyendo la facultad en la respuesta. */
  update(
    id: number,
    data: {
      codigo?: string;
      nombre?: string;
      apellido?: string;
      email?: string;
      facultadId?: number;
    },
  ) {
    return this.prisma.estudiante.update({
      where: { id },
      data,
      include: { facultad: true },
    });
  }

  /** Elimina un estudiante por su ID. */
  delete(id: number) {
    return this.prisma.estudiante.delete({ where: { id } });
  }
}
