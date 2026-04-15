import { PartialType } from '@nestjs/swagger';
import { CreateEspacioDto } from './create-espacio.dto';

/**
 * DTO para actualizar un espacio (todos los campos son opcionales).
 */
export class UpdateEspacioDto extends PartialType(CreateEspacioDto) {}
