import { EstadoEvento } from '@prisma/client';

/**
 * Representa la entidad Evento en el dominio de la aplicación.
 * No usa decoradores de Prisma; es una clase TypeScript pura.
 */
export class EventoEntity {
  /** Identificador único del evento */
  id: number;

  /** Título del evento */
  titulo: string;

  /** Descripción opcional del evento */
  descripcion: string | null;

  /** Fecha y hora de inicio del evento */
  fechaInicio: Date;

  /** Fecha y hora de fin del evento */
  fechaFin: Date;

  /** Cupo máximo de asistentes */
  cupoMaximo: number;

  /** Cupos disponibles restantes */
  cuposDisponibles: number;

  /** Estado actual del evento (BORRADOR, PUBLICADO, CANCELADO, FINALIZADO) */
  estado: EstadoEvento;

  /** ID del tipo de evento asociado */
  tipoEventoId: number;

  /** ID del espacio donde se realizará el evento */
  espacioId: number;

  /** ID de la facultad organizadora */
  facultadId: number;

  /** Fecha de creación del registro */
  creadoEn: Date;

  /** Fecha de última actualización del registro */
  actualizadoEn: Date;
}
