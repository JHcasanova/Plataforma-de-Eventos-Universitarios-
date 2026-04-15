import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoEvento, EstadoInscripcion } from '@prisma/client';
import { InscripcionesRepository } from '../repository/inscripciones.repository';
import { CreateInscripcionDto } from '../dto/create-inscripcion.dto';

/**
 * Servicio que gestiona la lógica de negocio para Inscripciones (HU-04 y HU-05).
 * Delega el acceso a datos al InscripcionesRepository.
 */
@Injectable()
export class InscripcionesService {
  constructor(private readonly inscripcionesRepository: InscripcionesRepository) {}

  /**
   * HU-04: Inscribe un estudiante a un evento.
   * Valida estado del evento, cupos disponibles e inscripción duplicada.
   * Ejecuta la creación de inscripción y el decremento de cupos en una transacción.
   */
  async inscribir(dto: CreateInscripcionDto) {
    // 1. Buscar el evento
    const evento = await this.inscripcionesRepository.findEventoById(dto.eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento con ID ${dto.eventoId} no encontrado`);
    }

    // 2. Validar que el evento esté publicado
    if (evento.estado !== EstadoEvento.PUBLICADO) {
      throw new BadRequestException('El evento no está disponible para inscripción');
    }

    // 3. Validar cupos disponibles
    if (evento.cuposDisponibles <= 0) {
      throw new ConflictException('No hay cupos disponibles para este evento');
    }

    // 4. Verificar inscripción existente activa (estado != CANCELADA)
    const existente = await this.inscripcionesRepository.findActiva(
      dto.estudianteId,
      dto.eventoId,
    );
    if (existente) {
      throw new ConflictException('Ya estás inscrito en este evento');
    }

    // 5. Transacción: crear inscripción y decrementar cupo
    const inscripcion = await this.inscripcionesRepository.ejecutarTransaccion(async (tx) => {
      const nueva = await tx.inscripcion.create({
        data: {
          estudianteId: dto.estudianteId,
          eventoId: dto.eventoId,
          estado: EstadoInscripcion.PENDIENTE,
        },
        include: {
          estudiante: true,
          evento: {
            include: {
              tipoEvento: true,
              espacio: true,
              facultad: true,
            },
          },
        },
      });

      await tx.evento.update({
        where: { id: dto.eventoId },
        data: { cuposDisponibles: { decrement: 1 } },
      });

      return nueva;
    });

    return inscripcion;
  }

  /**
   * HU-05: Cancela una inscripción por su ID.
   * Cambia el estado a CANCELADA e incrementa los cupos del evento si corresponde.
   */
  async cancelar(id: number) {
    // 1. Buscar la inscripción
    const inscripcion = await this.inscripcionesRepository.findById(id);
    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    // 2. Validar que no esté ya cancelada
    if (inscripcion.estado === EstadoInscripcion.CANCELADA) {
      throw new BadRequestException('La inscripción ya está cancelada');
    }

    // 3. Transacción: cancelar inscripción e incrementar cupo si aplica
    const actualizada = await this.inscripcionesRepository.ejecutarTransaccion(async (tx) => {
      const result = await tx.inscripcion.update({
        where: { id },
        data: { estado: EstadoInscripcion.CANCELADA },
        include: {
          estudiante: true,
          evento: {
            include: {
              tipoEvento: true,
              espacio: true,
              facultad: true,
            },
          },
        },
      });

      // Solo incrementar cupos si el evento no está CANCELADO ni FINALIZADO
      const estadoEvento = inscripcion.evento.estado;
      if (
        estadoEvento !== EstadoEvento.CANCELADO &&
        estadoEvento !== EstadoEvento.FINALIZADO
      ) {
        await tx.evento.update({
          where: { id: inscripcion.eventoId },
          data: { cuposDisponibles: { increment: 1 } },
        });
      }

      return result;
    });

    return actualizada;
  }

  /**
   * Retorna todas las inscripciones de un estudiante, incluyendo el evento con sus relaciones.
   */
  findByEstudiante(estudianteId: number) {
    return this.inscripcionesRepository.findByEstudiante(estudianteId);
  }

  /**
   * Retorna todas las inscripciones de un evento, incluyendo el estudiante.
   */
  findByEvento(eventoId: number) {
    return this.inscripcionesRepository.findByEvento(eventoId);
  }
}
