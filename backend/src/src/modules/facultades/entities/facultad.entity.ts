/**
 * Representa la entidad Facultad en el dominio de la aplicación.
 * No usa decoradores de Prisma; es una clase TypeScript pura.
 */
export class FacultadEntity {
  /** Identificador único de la facultad */
  id: number;

  /** Nombre completo de la facultad */
  nombre: string;

  /** Código abreviado de la facultad (en mayúsculas) */
  codigo: string;

  /** Fecha de creación del registro */
  creadoEn: Date;

  /** Fecha de última actualización del registro */
  actualizadoEn: Date;
}
