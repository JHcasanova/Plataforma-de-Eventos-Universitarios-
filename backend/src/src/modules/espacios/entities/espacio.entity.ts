import { TipoEspacio } from '@prisma/client';

/**
 * Representa la entidad Espacio en el dominio de la aplicación.
 * No usa decoradores de Prisma; es una clase TypeScript pura.
 */
export class EspacioEntity {
  /** Identificador único del espacio */
  id: number;

  /** Nombre del espacio (único) */
  nombre: string;

  /** Ubicación física del espacio dentro del campus */
  ubicacion: string;

  /** Capacidad máxima de personas */
  capacidad: number;

  /** Tipo de espacio (AULA, AUDITORIO, LABORATORIO, CANCHA, OTRO) */
  tipo: TipoEspacio;

  /** Indica si el espacio está disponible para ser asignado */
  disponible: boolean;

  /** Fecha de creación del registro */
  creadoEn: Date;

  /** Fecha de última actualización del registro */
  actualizadoEn: Date;
}
