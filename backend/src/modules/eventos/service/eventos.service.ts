import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoEvento } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEventoDto } from '../dto/create-evento.dto';
import { FiltrosEventoDto } from '../dto/filtros-evento.dto';
import { UpdateEventoDto } from '../dto/update-evento.dto';

/** Relaciones estándar incluidas en las respuestas de eventos */
const INCLUDE_RELACIONES = {
  tipoEvento: true,
  espacio: true,
  facultad: true,
  ponentes: true,
};

/**
 * Servicio que gestiona la lógica de negocio para la entidad Evento.
 */
@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo evento validando fechas, espacio y entidades relacionadas.
   * El evento se crea con estado BORRADOR y cuposDisponibles = cupoMaximo.
   */
  async create(dto: CreateEventoDto) {
    const fechaInicio = new Date(dto.fechaInicio);
    const fechaFin = new Date(dto.fechaFin);
    const ahora = new Date();

    // Validar que fechaInicio sea futura
    if (fechaInicio <= ahora) {
      throw new BadRequestException('La fecha de inicio debe ser posterior al momento actual');
    }

    // Validar que fechaFin sea posterior a fechaInicio
    if (fechaFin <= fechaInicio) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Validar disponibilidad del espacio
    await this.validarDisponibilidadEspacio(dto.espacioId, fechaInicio, fechaFin);

    // Verificar que existen las entidades relacionadas
    const [tipoEvento, espacio, facultad] = await Promise.all([
      this.prisma.tipoEvento.findUnique({ where: { id: dto.tipoEventoId } }),
      this.prisma.espacio.findUnique({ where: { id: dto.espacioId } }),
      this.prisma.facultad.findUnique({ where: { id: dto.facultadId } }),
    ]);

    if (!tipoEvento) {
      throw new NotFoundException(`TipoEvento con ID ${dto.tipoEventoId} no encontrado`);
    }
    if (!espacio) {
      throw new NotFoundException(`Espacio con ID ${dto.espacioId} no encontrado`);
    }
    if (!facultad) {
      throw new NotFoundException(`Facultad con ID ${dto.facultadId} no encontrada`);
    }

    // Crear el evento
    return this.prisma.evento.create({
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        fechaInicio,
        fechaFin,
        cupoMaximo: dto.cupoMaximo,
        cuposDisponibles: dto.cupoMaximo,
        estado: EstadoEvento.BORRADOR,
        tipoEventoId: dto.tipoEventoId,
        espacioId: dto.espacioId,
        facultadId: dto.facultadId,
        ...(dto.ponenteIds?.length && {
          ponentes: { connect: dto.ponenteIds.map((id) => ({ id })) },
        }),
      },
      include: INCLUDE_RELACIONES,
    });
  }

  /**
   * Retorna la lista paginada de eventos con filtros opcionales.
   */
  async findAll(filtros: FiltrosEventoDto) {
    const page = filtros.page ?? 1;
    const limit = filtros.limit ?? 20;
    const skip = (page - 1) * limit;

    // Construir cláusula where dinámica
    const where: any = {};

    if (filtros.tipoEventoId) {
      where.tipoEventoId = filtros.tipoEventoId;
    }
    if (filtros.facultadId) {
      where.facultadId = filtros.facultadId;
    }
    if (filtros.desde || filtros.hasta) {
      where.fechaInicio = {};
      if (filtros.desde) where.fechaInicio.gte = new Date(filtros.desde);
      if (filtros.hasta) where.fechaInicio.lte = new Date(filtros.hasta);
    }

    const [data, total] = await Promise.all([
      this.prisma.evento.findMany({
        where,
        skip,
        take: limit,
        include: INCLUDE_RELACIONES,
        orderBy: { fechaInicio: 'asc' },
      }),
      this.prisma.evento.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Retorna un evento por su ID incluyendo todas las relaciones.
   * Lanza NotFoundException si no existe.
   */
  async findOne(id: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }
    return evento;
  }

  /**
   * Actualiza un evento existente.
   * Si cambian fechas o espacioId, revalida disponibilidad del espacio.
   */
  async update(id: number, dto: UpdateEventoDto) {
    // Verificar que existe
    const eventoActual = await this.findOne(id);

    const fechaInicio = dto.fechaInicio ? new Date(dto.fechaInicio) : eventoActual.fechaInicio;
    const fechaFin = dto.fechaFin ? new Date(dto.fechaFin) : eventoActual.fechaFin;
    const espacioId = dto.espacioId ?? eventoActual.espacioId;

    // Si cambian fechas o espacio, revalidar disponibilidad
    if (dto.fechaInicio || dto.fechaFin || dto.espacioId) {
      await this.validarDisponibilidadEspacio(espacioId, fechaInicio, fechaFin, id);
    }

    return this.prisma.evento.update({
      where: { id },
      data: {
        ...(dto.titulo !== undefined && { titulo: dto.titulo }),
        ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
        ...(dto.fechaInicio && { fechaInicio }),
        ...(dto.fechaFin && { fechaFin }),
        ...(dto.cupoMaximo !== undefined && { cupoMaximo: dto.cupoMaximo }),
        ...(dto.tipoEventoId !== undefined && { tipoEventoId: dto.tipoEventoId }),
        ...(dto.espacioId !== undefined && { espacioId: dto.espacioId }),
        ...(dto.facultadId !== undefined && { facultadId: dto.facultadId }),
        ...(dto.ponenteIds !== undefined && {
          ponentes: { set: dto.ponenteIds.map((pid) => ({ id: pid })) },
        }),
      },
      include: INCLUDE_RELACIONES,
    });
  }

  /**
   * Elimina un evento por su ID.
   */
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.evento.delete({ where: { id } });
  }

  /**
   * Retorna los eventos publicados con filtros opcionales, ordenados por fechaInicio.
   * Usado para la vista de calendario.
   */
  async getCalendario(filtros: FiltrosEventoDto) {
    const where: any = { estado: EstadoEvento.PUBLICADO };

    if (filtros.tipoEventoId) {
      where.tipoEventoId = filtros.tipoEventoId;
    }
    if (filtros.facultadId) {
      where.facultadId = filtros.facultadId;
    }
    if (filtros.desde || filtros.hasta) {
      where.fechaInicio = {};
      if (filtros.desde) where.fechaInicio.gte = new Date(filtros.desde);
      if (filtros.hasta) where.fechaInicio.lte = new Date(filtros.hasta);
    }

    return this.prisma.evento.findMany({
      where,
      include: INCLUDE_RELACIONES,
      orderBy: { fechaInicio: 'asc' },
    });
  }

  /**
   * Retorna los próximos 10 eventos publicados con fecha futura.
   */
  async getProximos() {
    return this.prisma.evento.findMany({
      where: {
        estado: EstadoEvento.PUBLICADO,
        fechaInicio: { gt: new Date() },
      },
      include: INCLUDE_RELACIONES,
      orderBy: { fechaInicio: 'asc' },
      take: 10,
    });
  }

  /**
   * Valida que el espacio esté disponible en el rango de fechas indicado.
   * Lanza excepción si el espacio no existe, no está disponible o hay conflicto de horario.
   *
   * @param espacioId - ID del espacio a validar
   * @param fechaInicio - Fecha de inicio del nuevo evento
   * @param fechaFin - Fecha de fin del nuevo evento
   * @param excludeEventoId - ID del evento a excluir del chequeo (para actualizaciones)
   */
  private async validarDisponibilidadEspacio(
    espacioId: number,
    fechaInicio: Date,
    fechaFin: Date,
    excludeEventoId?: number,
  ): Promise<void> {
    // Verificar que el espacio existe
    const espacio = await this.prisma.espacio.findUnique({ where: { id: espacioId } });
    if (!espacio) {
      throw new NotFoundException(`Espacio con ID ${espacioId} no encontrado`);
    }

    // Verificar que el espacio está disponible
    if (!espacio.disponible) {
      throw new BadRequestException(`El espacio "${espacio.nombre}" no está disponible`);
    }

    // Buscar eventos conflictivos (solapamiento de fechas)
    // Dos rangos [A,B] y [C,D] se solapan si A < D AND C < B
    const conflictos = await this.prisma.evento.findMany({
      where: {
        espacioId,
        ...(excludeEventoId && { id: { not: excludeEventoId } }),
        estado: { in: [EstadoEvento.PUBLICADO, EstadoEvento.BORRADOR] },
        fechaInicio: { lt: fechaFin },
        fechaFin: { gt: fechaInicio },
      },
    });

    if (conflictos.length > 0) {
      throw new ConflictException(
        `El espacio ya tiene un evento en ese horario: "${conflictos[0].titulo}"`,
      );
    }
  }

  /**
   * Verifica si un espacio está disponible en un rango de fechas.
   * Retorna true si está libre, false si hay conflicto.
   * Usado por EspaciosService para el endpoint de disponibilidad.
   */
  async checkDisponibilidadEspacio(
    espacioId: number,
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<boolean> {
    const espacio = await this.prisma.espacio.findUnique({ where: { id: espacioId } });
    if (!espacio || !espacio.disponible) return false;

    const conflictos = await this.prisma.evento.count({
      where: {
        espacioId,
        estado: { in: [EstadoEvento.PUBLICADO, EstadoEvento.BORRADOR] },
        fechaInicio: { lt: fechaFin },
        fechaFin: { gt: fechaInicio },
      },
    });

    return conflictos === 0;
  }
}