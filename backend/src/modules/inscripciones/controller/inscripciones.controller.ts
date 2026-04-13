import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInscripcionDto } from '../dto/create-inscripcion.dto';
import { InscripcionesService } from '../service/inscripciones.service';

/**
 * Controlador REST para la gestión de inscripciones (HU-04 y HU-05).
 * IMPORTANTE: las rutas estáticas deben ir antes de la ruta dinámica :id.
 */
@ApiTags('Inscripciones')
@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  @ApiOperation({ summary: 'Inscribir un estudiante a un evento (HU-04)' })
  @ApiResponse({ status: 201, description: 'Inscripción creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Evento no disponible para inscripción' })
  @ApiResponse({ status: 409, description: 'Sin cupos o ya inscrito' })
  inscribir(@Body() dto: CreateInscripcionDto) {
    return this.inscripcionesService.inscribir(dto);
  }

  // Rutas estáticas ANTES de la ruta dinámica :id
  @Get('estudiante/:estudianteId')
  @ApiOperation({ summary: 'Obtener inscripciones de un estudiante' })
  findByEstudiante(@Param('estudianteId', ParseIntPipe) estudianteId: number) {
    return this.inscripcionesService.findByEstudiante(estudianteId);
  }

  @Get('evento/:eventoId')
  @ApiOperation({ summary: 'Obtener inscripciones de un evento' })
  findByEvento(@Param('eventoId', ParseIntPipe) eventoId: number) {
    return this.inscripcionesService.findByEvento(eventoId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar una inscripción (HU-05)' })
  @ApiResponse({ status: 200, description: 'Inscripción cancelada' })
  @ApiResponse({ status: 400, description: 'La inscripción ya está cancelada' })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionesService.cancelar(id);
  }
}
