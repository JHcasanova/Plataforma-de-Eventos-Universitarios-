import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PonentesRepository } from '../repository/ponentes.repository';
import { CreatePonenteDto } from '../dto/create-ponente.dto';
import { UpdatePonenteDto } from '../dto/update-ponente.dto';

/**
 * Servicio que gestiona la lógica de negocio para la entidad Ponente.
 * Delega el acceso a datos al PonentesRepository.
 */
@Injectable()
export class PonentesService {
  constructor(private readonly ponentesRepository: PonentesRepository) {}

  /** Crea un nuevo ponente validando unicidad de email y que areasExperticia tenga al menos 1 elemento. */
  async create(dto: CreatePonenteDto) {
    const existente = await this.ponentesRepository.findByEmail(dto.email);

    if (existente) {
      throw new ConflictException(`Ya existe un ponente registrado con el email "${dto.email}"`);
    }

    return this.ponentesRepository.create(dto);
  }

  /** Retorna todos los ponentes registrados. */
  findAll() {
    return this.ponentesRepository.findAll();
  }

  /** Retorna un ponente por su ID o lanza NotFoundException. */
  async findOne(id: number) {
    const ponente = await this.ponentesRepository.findById(id);
    if (!ponente) {
      throw new NotFoundException(`Ponente con ID ${id} no encontrado`);
    }
    return ponente;
  }

  /** Actualiza un ponente validando unicidad de email. */
  async update(id: number, dto: UpdatePonenteDto) {
    await this.findOne(id);

    if (dto.email) {
      const conflicto = await this.ponentesRepository.findConflicto(dto.email, id);
      if (conflicto) {
        throw new ConflictException(`Ya existe un ponente registrado con el email "${dto.email}"`);
      }
    }

    return this.ponentesRepository.update(id, dto);
  }

  /** Elimina un ponente por su ID. */
  async remove(id: number) {
    await this.findOne(id);
    await this.ponentesRepository.delete(id);
  }
}
