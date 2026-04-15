import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para crear una nueva facultad.
 */
export class CreateFacultadDto {
  @ApiProperty({ description: 'Nombre completo de la facultad', example: 'Facultad de Ingeniería' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  @ApiProperty({ description: 'Código único de la facultad (mayúsculas)', example: 'FING' })
  @IsString()
  @IsNotEmpty({ message: 'El código no puede estar vacío' })
  codigo: string;
}
