import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePonenteDto } from '../dto/create-ponente.dto';
import { UpdatePonenteDto } from '../dto/update-ponente.dto';

/**
 * Servicio que gestiona la lógica de negocio para la entidad Ponente.
 */
@Injectable()
export class PonentesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crea un nuevo ponente validando unicidad de email y que areasExperticia tenga al menos 1 elemento. */
  async create(dto: CreatePonenteDto) {
    const existente = await this.prisma.ponente.findUnique({
      where: { email: dto.email },
    });

    if (existente) {
      throw new ConflictException(`Ya existe un ponente registrado con el email "${dto.email}"`);
    }

    return this.prisma.ponente.create({ data: dto });
  }

  /** Retorna todos los ponentes registrados. */
  findAll() {
    return this.prisma.ponente.findMany({
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    });
  }

  /** Retorna un ponente por su ID o lanza NotFoundException. */
  async findOne(id: number) {
    const ponente = await this.prisma.ponente.findUnique({ where: { id } });
    if (!ponente) {
      throw new NotFoundException(`Ponente con ID ${id} no encontrado`);
    }
    return ponente;
  }

  /** Actualiza un ponente validando unicidad de email. */
  async update(id: number, dto: UpdatePonenteDto) {
    await this.findOne(id);

    if (dto.email) {
      const conflicto = await this.prisma.ponente.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (conflicto) {
        throw new ConflictException(`Ya existe un ponente registrado con el email "${dto.email}"`);
      }
    }

    return this.prisma.ponente.update({ where: { id }, data: dto });
  }

  /** Elimina un ponente por su ID. */
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.ponente.delete({ where: { id } });
  }
}
