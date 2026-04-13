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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventoDto } from '../dto/create-evento.dto';
import { FiltrosEventoDto } from '../dto/filtros-evento.dto';
import { UpdateEventoDto } from '../dto/update-evento.dto';
import { EventosService } from '../service/eventos.service';

/**
 * Controlador REST para la gestión de eventos universitarios.
 */
@ApiTags('Eventos')
@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo evento' })
  @ApiResponse({ status: 201, description: 'Evento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o fechas incorrectas' })
  @ApiResponse({ status: 404, description: 'Espacio, tipo de evento o facultad no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto de horario en el espacio' })
  create(@Body() dto: CreateEventoDto) {
    return this.eventosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar eventos con filtros y paginación' })
  findAll(@Query() filtros: FiltrosEventoDto) {
    return this.eventosService.findAll(filtros);
  }

  // IMPORTANTE: las rutas estáticas deben ir ANTES de :id para evitar conflictos en NestJS

  @Get('calendario')
  @ApiOperation({ summary: 'Obtener calendario de eventos publicados' })
  getCalendario(@Query() filtros: FiltrosEventoDto) {
    return this.eventosService.getCalendario(filtros);
  }

  @Get('proximos')
  @ApiOperation({ summary: 'Obtener los próximos 10 eventos publicados' })
  getProximos() {
    return this.eventosService.getProximos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento por ID' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un evento' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto de horario en el espacio' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventoDto) {
    return this.eventosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un evento' })
  @ApiResponse({ status: 204, description: 'Evento eliminado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.remove(id);
  }
}
