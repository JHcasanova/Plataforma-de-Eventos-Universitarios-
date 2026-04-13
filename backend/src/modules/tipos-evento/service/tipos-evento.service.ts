import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTipoEventoDto } from '../dto/create-tipo-evento.dto';
import { UpdateTipoEventoDto } from '../dto/update-tipo-evento.dto';

/**
 * Servicio que gestiona la lógica de negocio para la entidad TipoEvento.
 */
@Injectable()
export class TiposEventoService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crea un nuevo tipo de evento validando unicidad de nombre. */
  async create(dto: CreateTipoEventoDto) {
    const existente = await this.prisma.tipoEvento.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existente) {
      throw new ConflictException(`Ya existe un tipo de evento con el nombre "${dto.nombre}"`);
    }

    return this.prisma.tipoEvento.create({ data: dto });
  }

  /** Retorna todos los tipos de evento registrados. */
  findAll() {
    return this.prisma.tipoEvento.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  /** Retorna un tipo de evento por su ID o lanza NotFoundException. */
  async findOne(id: number) {
    const tipoEvento = await this.prisma.tipoEvento.findUnique({ where: { id } });
    if (!tipoEvento) {
      throw new NotFoundException(`Tipo de evento con ID ${id} no encontrado`);
    }
    return tipoEvento;
  }

  /** Actualiza un tipo de evento validando unicidad de nombre. */
  async update(id: number, dto: UpdateTipoEventoDto) {
    await this.findOne(id);

    if (dto.nombre) {
      const conflicto = await this.prisma.tipoEvento.findFirst({
        where: { nombre: dto.nombre, NOT: { id } },
      });
      if (conflicto) {
        throw new ConflictException(`Ya existe un tipo de evento con el nombre "${dto.nombre}"`);
      }
    }

    return this.prisma.tipoEvento.update({ where: { id }, data: dto });
  }

  /** Elimina un tipo de evento por su ID. */
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.tipoEvento.delete({ where: { id } });
  }
}
