import { PartialType } from '@nestjs/swagger';
import { CreateEstudianteDto } from './create-estudiante.dto';

/**
 * DTO para actualizar un estudiante (todos los campos son opcionales).
 */
export class UpdateEstudianteDto extends PartialType(CreateEstudianteDto) {}
