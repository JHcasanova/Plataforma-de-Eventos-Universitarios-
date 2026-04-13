import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

/**
 * DTO para inscribir un estudiante a un evento.
 */
export class CreateInscripcionDto {
  @ApiProperty({ description: 'ID del estudiante', example: 1 })
  @IsInt()
  @IsPositive()
  estudianteId: number;

  @ApiProperty({ description: 'ID del evento', example: 1 })
  @IsInt()
  @IsPositive()
  eventoId: number;
}
