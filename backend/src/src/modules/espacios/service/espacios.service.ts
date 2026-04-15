import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EspaciosRepository } from '../repository/espacios.repository';
import { CreateEspacioDto } from '../dto/create-espacio.dto';
import { UpdateEspacioDto } from '../dto/update-espacio.dto';

/**
 * Servicio que gestiona la lógica de negocio para la entidad Espacio.
 * Delega el acceso a datos al EspaciosRepository.
 */
@Injectable()
export class EspaciosService {
  constructor(private readonly espaciosRepository: EspaciosRepository) {}

  /** Crea un nuevo espacio validando unicidad de nombre y capacidad > 0. */
  async create(dto: CreateEspacioDto) {
    const existente = await this.espaciosRepository.findByNombre(dto.nombre);

    if (existente) {
      throw new ConflictException(`Ya existe un espacio con el nombre "${dto.nombre}"`);
    }

    return this.espaciosRepository.create({
      nombre: dto.nombre,
      ubicacion: dto.ubicacion,
      capacidad: dto.capacidad,
      tipo: dto.tipo,
      disponible: dto.disponible ?? true,
    });
  }

  /** Retorna todos los espacios registrados. */
  findAll() {
    return this.espaciosRepository.findAll();
  }

  /** Retorna un espacio por su ID o lanza NotFoundException. */
  async findOne(id: number) {
    const espacio = await this.espaciosRepository.findById(id);
    if (!espacio) {
      throw new NotFoundException(`Espacio con ID ${id} no encontrado`);
    }
    return espacio;
  }

  /** Actualiza un espacio validando unicidad de nombre. */
  async update(id: number, dto: UpdateEspacioDto) {
    await this.findOne(id);

    if (dto.nombre) {
      const conflicto = await this.espaciosRepository.findConflicto(dto.nombre, id);
      if (conflicto) {
        throw new ConflictException(`Ya existe un espacio con el nombre "${dto.nombre}"`);
      }
    }

    return this.espaciosRepository.update(id, dto);
  }

  /** Elimina un espacio por su ID. */
  async remove(id: number) {
    await this.findOne(id);
    await this.espaciosRepository.delete(id);
  }

  /**
   * Verifica si un espacio está disponible en el rango de fechas indicado.
   * Retorna true si está libre, false si hay conflicto o el espacio no está disponible.
   */
  async checkDisponibilidad(id: number, fechaInicio: Date, fechaFin: Date): Promise<boolean> {
    const espacio = await this.espaciosRepository.findById(id);
    if (!espacio) {
      throw new NotFoundException(`Espacio con ID ${id} no encontrado`);
    }
    if (!espacio.disponible) return false;

    const conflictos = await this.espaciosRepository.countEventosConflictivos(
      id,
      fechaInicio,
      fechaFin,
    );

    return conflictos === 0;
  }
}
