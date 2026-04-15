import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * DTO para crear un nuevo ponente.
 */
export class CreatePonenteDto {
  @ApiProperty({ description: 'Nombre del ponente', example: 'Carlos' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  @ApiProperty({ description: 'Apellido del ponente', example: 'García' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  apellido: string;

  @ApiProperty({ description: 'Correo electrónico único del ponente', example: 'carlos.garcia@universidad.edu' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  email: string;

  @ApiProperty({
    description: 'Áreas de experticia del ponente (mínimo 1)',
    example: ['Inteligencia Artificial', 'Machine Learning'],
    type: [String],
  })
  @IsArray({ message: 'Las áreas de experticia deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un área de experticia' })
  @IsString({ each: true, message: 'Cada área de experticia debe ser un texto' })
  areasExperticia: string[];

  @ApiPropertyOptional({ description: 'Institución a la que pertenece el ponente', example: 'Universidad Nacional' })
  @IsString()
  @IsOptional()
  institucion?: string;
}
