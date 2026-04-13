import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateFacultadDto } from '../dto/create-facultad.dto';
import { UpdateFacultadDto } from '../dto/update-facultad.dto';

/**
 * Servicio que gestiona la lógica de negocio para la entidad Facultad.
 */
@Injectable()
export class FacultadesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Crea una nueva facultad validando unicidad de nombre y código. */
  async create(dto: CreateFacultadDto) {
    // Verificar unicidad de nombre y código
    const existente = await this.prisma.facultad.findFirst({
      where: {
        OR: [
          { nombre: dto.nombre },
          { codigo: dto.codigo.toUpperCase() },
        ],
      },
    });

    if (existente) {
      if (existente.nombre === dto.nombre) {
        throw new ConflictException(`Ya existe una facultad con el nombre "${dto.nombre}"`);
      }
      throw new ConflictException(`Ya existe una facultad con el código "${dto.codigo}"`);
    }

    return this.prisma.facultad.create({
      data: {
        nombre: dto.nombre,
        codigo: dto.codigo.toUpperCase(),
      },
    });
  }

  /** Retorna todas las facultades registradas. */
  findAll() {
    return this.prisma.facultad.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  /** Retorna una facultad por su ID o lanza NotFoundException. */
  async findOne(id: number) {
    const facultad = await this.prisma.facultad.findUnique({ where: { id } });
    if (!facultad) {
      throw new NotFoundException(`Facultad con ID ${id} no encontrada`);
    }
    return facultad;
  }

  /** Actualiza una facultad validando unicidad de nombre y código. */
  async update(id: number, dto: UpdateFacultadDto) {
    // Verificar que existe
    await this.findOne(id);

    // Verificar unicidad si se cambia nombre o código
    if (dto.nombre || dto.codigo) {
      const condiciones: any[] = [];
      if (dto.nombre) condiciones.push({ nombre: dto.nombre });
      if (dto.codigo) condiciones.push({ codigo: dto.codigo.toUpperCase() });

      const conflicto = await this.prisma.facultad.findFirst({
        where: {
          OR: condiciones,
          NOT: { id },
        },
      });

      if (conflicto) {
        if (dto.nombre && conflicto.nombre === dto.nombre) {
          throw new ConflictException(`Ya existe una facultad con el nombre "${dto.nombre}"`);
        }
        throw new ConflictException(`Ya existe una facultad con el código "${dto.codigo}"`);
      }
    }

    return this.prisma.facultad.update({
      where: { id },
      data: {
        ...(dto.nombre && { nombre: dto.nombre }),
        ...(dto.codigo && { codigo: dto.codigo.toUpperCase() }),
      },
    });
  }

  /** Elimina una facultad por su ID. */
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.facultad.delete({ where: { id } });
  }
}
