import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEspacioDto } from '../dto/create-espacio.dto';
import { UpdateEspacioDto } from '../dto/update-espacio.dto';
import { EspaciosService } from '../service/espacios.service';

/**
 * Controlador REST para la gestión de espacios físicos universitarios.
 */
@ApiTags('Espacios')
@Controller('espacios')
export class EspaciosController {
  constructor(private readonly espaciosService: EspaciosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo espacio' })
  @ApiResponse({ status: 201, description: 'Espacio creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Nombre ya existe' })
  create(@Body() dto: CreateEspacioDto) {
    return this.espaciosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los espacios' })
  findAll() {
    return this.espaciosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un espacio por ID' })
  @ApiResponse({ status: 404, description: 'Espacio no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.espaciosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un espacio' })
  @ApiResponse({ status: 409, description: 'Nombre ya existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEspacioDto) {
    return this.espaciosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un espacio' })
  @ApiResponse({ status: 204, description: 'Espacio eliminado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.espaciosService.remove(id);
  }

  @Get(':id/disponibilidad')
  @ApiOperation({ summary: 'Verificar disponibilidad de un espacio en un rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', required: true, description: 'Fecha de inicio (ISO 8601)' })
  @ApiQuery({ name: 'fechaFin', required: true, description: 'Fecha de fin (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Retorna { disponible: boolean }' })
  @ApiResponse({ status: 404, description: 'Espacio no encontrado' })
  async checkDisponibilidad(
    @Param('id', ParseIntPipe) id: number,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const disponible = await this.espaciosService.checkDisponibilidad(
      id,
      new Date(fechaInicio),
      new Date(fechaFin),
    );
    return { disponible };
  }
}