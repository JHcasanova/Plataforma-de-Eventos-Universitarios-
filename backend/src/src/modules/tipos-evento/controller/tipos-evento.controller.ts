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
import { CreateTipoEventoDto } from '../dto/create-tipo-evento.dto';
import { UpdateTipoEventoDto } from '../dto/update-tipo-evento.dto';
import { TiposEventoService } from '../service/tipos-evento.service';

/**
 * Controlador REST para la gestión de tipos de evento.
 */
@ApiTags('Tipos de Evento')
@Controller('tipos-evento')
export class TiposEventoController {
  constructor(private readonly tiposEventoService: TiposEventoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de evento' })
  @ApiResponse({ status: 201, description: 'Tipo de evento creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Nombre ya existe' })
  create(@Body() dto: CreateTipoEventoDto) {
    return this.tiposEventoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los tipos de evento' })
  findAll() {
    return this.tiposEventoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de evento por ID' })
  @ApiResponse({ status: 404, description: 'Tipo de evento no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tiposEventoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de evento' })
  @ApiResponse({ status: 409, description: 'Nombre ya existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoEventoDto) {
    return this.tiposEventoService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un tipo de evento' })
  @ApiResponse({ status: 204, description: 'Tipo de evento eliminado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tiposEventoService.remove(id);
  }
}
