import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

/**
 * DTO para crear un nuevo estudiante.
 */
export class CreateEstudianteDto {
  @ApiProperty({ description: 'Código universitario único', example: '20230001' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ description: 'Nombre del estudiante', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Apellido del estudiante', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ description: 'Correo electrónico único', example: 'juan.perez@uni.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'ID de la facultad a la que pertenece', example: 1 })
  @IsInt()
  @IsPositive()
  facultadId: number;
}
