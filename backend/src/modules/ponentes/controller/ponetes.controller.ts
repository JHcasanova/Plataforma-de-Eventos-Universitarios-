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
import { CreatePonenteDto } from '../dto/create-ponente.dto';
import { UpdatePonenteDto } from '../dto/update-ponente.dto';
import { PonentesService } from '../service/ponentes.service';

/**
 * Controlador REST para la gestión de ponentes.
 */
@ApiTags('Ponentes')
@Controller('ponentes')
export class PonentesController {
  constructor(private readonly ponentesService: PonentesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo ponente' })
  @ApiResponse({ status: 201, description: 'Ponente creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  create(@Body() dto: CreatePonenteDto) {
    return this.ponentesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los ponentes' })
  findAll() {
    return this.ponentesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ponente por ID' })
  @ApiResponse({ status: 404, description: 'Ponente no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ponentesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ponente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePonenteDto) {
    return this.ponentesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un ponente' })
  @ApiResponse({ status: 204, description: 'Ponente eliminado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ponentesService.remove(id);
  }
}