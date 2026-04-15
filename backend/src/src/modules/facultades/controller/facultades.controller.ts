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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFacultadDto } from '../dto/create-facultad.dto';
import { UpdateFacultadDto } from '../dto/update-facultad.dto';
import { FacultadesService } from '../service/facultades.service';

/**
 * Controlador REST para la gestión de facultades universitarias.
 */
@ApiTags('Facultades')
@Controller('facultades')
export class FacultadesController {
  constructor(private readonly facultadesService: FacultadesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva facultad' })
  @ApiResponse({ status: 201, description: 'Facultad creada exitosamente' })
  @ApiResponse({ status: 409, description: 'Nombre o código ya existe' })
  create(@Body() dto: CreateFacultadDto) {
    return this.facultadesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las facultades' })
  findAll() {
    return this.facultadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una facultad por ID' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facultadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una facultad' })
  @ApiResponse({ status: 409, description: 'Nombre o código ya existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFacultadDto) {
    return this.facultadesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una facultad' })
  @ApiResponse({ status: 204, description: 'Facultad eliminada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facultadesService.remove(id);
  }
}
