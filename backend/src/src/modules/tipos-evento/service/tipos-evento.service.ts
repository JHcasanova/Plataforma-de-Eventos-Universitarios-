import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TiposEventoRepository } from '../repository/tipos-evento.repository';
import { CreateTipoEventoDto } from '../dto/create-tipo-evento.dto';
import { UpdateTipoEventoDto } from '../dto/update-tipo-evento.dto';

/**
 * Servicio que gestiona la lógica de negocio para la entidad TipoEvento.
 * Delega el acceso a datos al TiposEventoRepository.
 */
@Injectable()
export class TiposEventoService {
  constructor(private readonly tiposEventoRepository: TiposEventoRepository) {}

  /** Crea un nuevo tipo de evento validando unicidad de nombre. */
  async create(dto: CreateTipoEventoDto) {
    const existente = await this.tiposEventoRepository.findByNombre(dto.nombre);

    if (existente) {
      throw new ConflictException(`Ya existe un tipo de evento con el nombre "${dto.nombre}"`);
    }

    return this.tiposEventoRepository.create(dto);
  }

  /** Retorna todos los tipos de evento registrados. */
  findAll() {
    return this.tiposEventoRepository.findAll();
  }

  /** Retorna un tipo de evento por su ID o lanza NotFoundException. */
  async findOne(id: number) {
    const tipoEvento = await this.tiposEventoRepository.findById(id);
    if (!tipoEvento) {
      throw new NotFoundException(`Tipo de evento con ID ${id} no encontrado`);
    }
    return tipoEvento;
  }

  /** Actualiza un tipo de evento validando unicidad de nombre. */
  async update(id: number, dto: UpdateTipoEventoDto) {
    await this.findOne(id);

    if (dto.nombre) {
      const conflicto = await this.tiposEventoRepository.findConflicto(dto.nombre, id);
      if (conflicto) {
        throw new ConflictException(`Ya existe un tipo de evento con el nombre "${dto.nombre}"`);
      }
    }

    return this.tiposEventoRepository.update(id, dto);
  }

  /** Elimina un tipo de evento por su ID. */
  async remove(id: number) {
    await this.findOne(id);
    await this.tiposEventoRepository.delete(id);
  }
}
