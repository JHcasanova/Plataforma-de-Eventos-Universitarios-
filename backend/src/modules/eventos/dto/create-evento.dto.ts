import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para la creación de un nuevo evento universitario.
 */
export class CreateEventoDto {
  @ApiProperty({ description: 'Título del evento', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @ApiPropertyOptional({ description: 'Descripción detallada del evento' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Fecha y hora de inicio (ISO 8601)', example: '2025-09-01T10:00:00Z' })
  @IsDateString()
  fechaInicio: string;

  @ApiProperty({ description: 'Fecha y hora de fin (ISO 8601)', example: '2025-09-01T12:00:00Z' })
  @IsDateString()
  fechaFin: string;

  @ApiProperty({ description: 'Cupo máximo de participantes', minimum: 1 })
  @IsInt()
  @Min(1)
  cupoMaximo: number;

  @ApiProperty({ description: 'ID del tipo de evento' })
  @IsInt()
  @IsPositive()
  tipoEventoId: number;

  @ApiProperty({ description: 'ID del espacio físico asignado' })
  @IsInt()
  @IsPositive()
  espacioId: number;

  @ApiProperty({ description: 'ID de la facultad organizadora' })
  @IsInt()
  @IsPositive()
  facultadId: number;

  @ApiPropertyOptional({ description: 'IDs de los ponentes asignados', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ponenteIds?: number[];
}