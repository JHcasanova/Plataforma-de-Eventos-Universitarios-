import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoEspacio } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

/**
 * DTO para crear un nuevo espacio físico.
 */
export class CreateEspacioDto {
  @ApiProperty({ description: 'Nombre del espacio', example: 'Auditorio Principal' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  @ApiProperty({ description: 'Ubicación del espacio', example: 'Edificio A, Piso 1' })
  @IsString()
  @IsNotEmpty({ message: 'La ubicación no puede estar vacía' })
  ubicacion: string;

  @ApiProperty({ description: 'Capacidad máxima de personas', example: 200, minimum: 1 })
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @Min(1, { message: 'La capacidad debe ser mayor que cero' })
  capacidad: number;

  @ApiProperty({ description: 'Tipo de espacio', enum: TipoEspacio, example: TipoEspacio.AUDITORIO })
  @IsEnum(TipoEspacio, { message: 'El tipo de espacio no es válido' })
  tipo: TipoEspacio;

  @ApiPropertyOptional({ description: 'Indica si el espacio está disponible para asignación', default: true })
  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
