import { PartialType } from '@nestjs/swagger';
import { CreateFacultadDto } from './create-facultad.dto';

/**
 * DTO para actualizar una facultad (todos los campos son opcionales).
 */
export class UpdateFacultadDto extends PartialType(CreateFacultadDto) {}
