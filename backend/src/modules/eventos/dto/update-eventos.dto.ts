import { PartialType } from '@nestjs/swagger';
import { CreateEventoDto } from './create-evento.dto';

/**
 * DTO para la actualización parcial de un evento.
 * Todos los campos de CreateEventoDto son opcionales.
 */
export class UpdateEventoDto extends PartialType(CreateEventoDto) {}