import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FacultadesRepository } from '../repository/facultades.repository';
import { CreateFacultadDto } from '../dto/create-facultad.dto';
import { UpdateFacultadDto } from '../dto/update-facultad.dto';

/**
 * Servicio que gestiona la lógica de negocio para la entidad Facultad.
 * Delega el acceso a datos al FacultadesRepository.
 */
@Injectable()
export class FacultadesService {
  constructor(private readonly facultadesRepository: FacultadesRepository) {}

  /** Crea una nueva facultad validando unicidad de nombre y código. */
  async create(dto: CreateFacultadDto) {
    // Verificar unicidad de nombre y código
    const existente = await this.facultadesRepository.findByNombreOrCodigo(
      dto.nombre,
      dto.codigo.toUpperCase(),
    );

    if (existente) {
      if (existente.nombre === dto.nombre) {
        throw new ConflictException(`Ya existe una facultad con el nombre "${dto.nombre}"`);
      }
      throw new ConflictException(`Ya existe una facultad con el código "${dto.codigo}"`);
    }

    return this.facultadesRepository.create(dto.nombre, dto.codigo.toUpperCase());
  }

  /** Retorna todas las facultades registradas. */
  findAll() {
    return this.facultadesRepository.findAll();
  }

  /** Retorna una facultad por su ID o lanza NotFoundException. */
  async findOne(id: number) {
    const facultad = await this.facultadesRepository.findById(id);
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
      const conflicto = await this.facultadesRepository.findConflicto(
        dto.nombre,
        dto.codigo ? dto.codigo.toUpperCase() : undefined,
        id,
      );

      if (conflicto) {
        if (dto.nombre && conflicto.nombre === dto.nombre) {
          throw new ConflictException(`Ya existe una facultad con el nombre "${dto.nombre}"`);
        }
        throw new ConflictException(`Ya existe una facultad con el código "${dto.codigo}"`);
      }
    }

    return this.facultadesRepository.update(id, {
      ...(dto.nombre && { nombre: dto.nombre }),
      ...(dto.codigo && { codigo: dto.codigo.toUpperCase() }),
    });
  }

  /** Elimina una facultad por su ID. */
  async remove(id: number) {
    await this.findOne(id);
    await this.facultadesRepository.delete(id);
  }
}
