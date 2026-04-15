/**
 * Representa la entidad TipoEvento en el dominio de la aplicación.
 * No usa decoradores de Prisma; es una clase TypeScript pura.
 */
export class TipoEventoEntity {
  /** Identificador único del tipo de evento */
  id: number;

  /** Nombre del tipo de evento (único) */
  nombre: string;

  /** Descripción opcional del tipo de evento */
  descripcion: string | null;

  /** Fecha de creación del registro */
  creadoEn: Date;

  /** Fecha de última actualización del registro */
  actualizadoEn: Date;
}
