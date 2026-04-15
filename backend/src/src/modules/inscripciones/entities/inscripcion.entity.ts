import { EstadoInscripcion } from '@prisma/client';

/**
 * Representa la entidad Inscripcion en el dominio de la aplicación.
 * No usa decoradores de Prisma; es una clase TypeScript pura.
 */
export class InscripcionEntity {
  /** Identificador único de la inscripción */
  id: number;

  /** ID del estudiante inscrito */
  estudianteId: number;

  /** ID del evento al que se inscribió */
  eventoId: number;

  /** Estado de la inscripción (PENDIENTE, CONFIRMADA, CANCELADA) */
  estado: EstadoInscripcion;

  /** Fecha y hora en que se realizó la inscripción */
  fechaInscripcion: Date;
}
