import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO para crear un nuevo tipo de evento.
 */
export class CreateTipoEventoDto {
  @ApiProperty({ description: 'Nombre del tipo de evento', example: 'Académico' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción del tipo de evento', example: 'Eventos de carácter académico y científico' })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
