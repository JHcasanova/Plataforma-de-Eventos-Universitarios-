import { PartialType } from '@nestjs/swagger';
import { CreatePonenteDto } from './create-ponente.dto';

/**
 * DTO para actualizar un ponente (todos los campos son opcionales).
 */
export class UpdatePonenteDto extends PartialType(CreatePonenteDto) {}
