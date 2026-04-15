import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstudiantesRepository } from '../repository/estudiantes.repository';
import { CreateEstudianteDto } from '../dto/create-estudiante.dto';
import { UpdateEstudianteDto } from '../dto/update-estudiante.dto';

/**
 * Servicio que gestiona la lógica de negocio para la entidad Estudiante.
 * Delega el acceso a datos al EstudiantesRepository.
 */
@Injectable()
export class EstudiantesService {
  constructor(private readonly estudiantesRepository: EstudiantesRepository) {}

  /** Crea un nuevo estudiante validando unicidad de código y email. */
  async create(dto: CreateEstudianteDto) {
    // Verificar unicidad de código y email
    const existente = await this.estudiantesRepository.findByCodigoOrEmail(
      dto.codigo,
      dto.email,
    );

    if (existente) {
      if (existente.codigo === dto.codigo) {
        throw new ConflictException(`Ya existe un estudiante con el código "${dto.codigo}"`);
      }
      throw new ConflictException(`Ya existe un estudiante con el email "${dto.email}"`);
    }

    return this.estudiantesRepository.create(dto);
  }

  /** Retorna todos los estudiantes con su facultad. */
  findAll() {
    return this.estudiantesRepository.findAll();
  }

  /** Retorna un estudiante por su ID o lanza NotFoundException. */
  async findOne(id: number) {
    const estudiante = await this.estudiantesRepository.findById(id);
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return estudiante;
  }

  /** Actualiza un estudiante validando unicidad de código y email. */
  async update(id: number, dto: UpdateEstudianteDto) {
    await this.findOne(id);

    if (dto.codigo || dto.email) {
      const conflicto = await this.estudiantesRepository.findConflicto(
        dto.codigo,
        dto.email,
        id,
      );

      if (conflicto) {
        if (dto.codigo && conflicto.codigo === dto.codigo) {
          throw new ConflictException(`Ya existe un estudiante con el código "${dto.codigo}"`);
        }
        throw new ConflictException(`Ya existe un estudiante con el email "${dto.email}"`);
      }
    }

    return this.estudiantesRepository.update(id, dto);
  }

  /** Elimina un estudiante por su ID. */
  async remove(id: number) {
    await this.findOne(id);
    await this.estudiantesRepository.delete(id);
  }
}
