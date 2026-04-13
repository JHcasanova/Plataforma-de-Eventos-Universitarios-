import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para filtros y paginación en la consulta de eventos.
 */
export class FiltrosEventoDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID de tipo de evento' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tipoEventoId?: number;

  @ApiPropertyOptional({ description: 'Filtrar por ID de facultad' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  facultadId?: number;

  @ApiPropertyOptional({ description: 'Fecha de inicio del rango (ISO 8601)', example: '2025-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin del rango (ISO 8601)', example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  hasta?: string;

  @ApiPropertyOptional({ description: 'Número de página', minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Cantidad de resultados por página', minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;
}
