import { PartialType } from '@nestjs/swagger';
import { CreateTipoEventoDto } from './create-tipo-evento.dto';

/**
 * DTO para actualizar un tipo de evento (todos los campos son opcionales).
 */
export class UpdateTipoEventoDto extends PartialType(CreateTipoEventoDto) {}
