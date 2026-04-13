import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEstudianteDto } from '../dto/create-estudiante.dto';
import { UpdateEstudianteDto } from '../dto/update-estudiante.dto';

/**
 * Servicio que gestiona la lógica de negocio para la entidad Estudiante.
 */
@Injectable()
export class EstudiantesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crea un nuevo estudiante validando unicidad de código y email. */
  async create(dto: CreateEstudianteDto) {
    // Verificar unicidad de código y email
    const existente = await this.prisma.estudiante.findFirst({
      where: {
        OR: [{ codigo: dto.codigo }, { email: dto.email }],
      },
    });

    if (existente) {
      if (existente.codigo === dto.codigo) {
        throw new ConflictException(`Ya existe un estudiante con el código "${dto.codigo}"`);
      }
      throw new ConflictException(`Ya existe un estudiante con el email "${dto.email}"`);
    }

    return this.prisma.estudiante.create({
      data: dto,
      include: { facultad: true },
    });
  }

  /** Retorna todos los estudiantes con su facultad. */
  findAll() {
    return this.prisma.estudiante.findMany({
      include: { facultad: true },
      orderBy: { apellido: 'asc' },
    });
  }

  /** Retorna un estudiante por su ID o lanza NotFoundException. */
  async findOne(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id },
      include: { facultad: true },
    });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return estudiante;
  }

  /** Actualiza un estudiante validando unicidad de código y email. */
  async update(id: number, dto: UpdateEstudianteDto) {
    await this.findOne(id);

    if (dto.codigo || dto.email) {
      const condiciones: any[] = [];
      if (dto.codigo) condiciones.push({ codigo: dto.codigo });
      if (dto.email) condiciones.push({ email: dto.email });

      const conflicto = await this.prisma.estudiante.findFirst({
        where: { OR: condiciones, NOT: { id } },
      });

      if (conflicto) {
        if (dto.codigo && conflicto.codigo === dto.codigo) {
          throw new ConflictException(`Ya existe un estudiante con el código "${dto.codigo}"`);
        }
        throw new ConflictException(`Ya existe un estudiante con el email "${dto.email}"`);
      }
    }

    return this.prisma.estudiante.update({
      where: { id },
      data: dto,
      include: { facultad: true },
    });
  }

  /** Elimina un estudiante por su ID. */
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.estudiante.delete({ where: { id } });
  }
}
