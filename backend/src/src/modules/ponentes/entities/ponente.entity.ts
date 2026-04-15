/**
 * Representa la entidad Ponente en el dominio de la aplicación.
 * No usa decoradores de Prisma; es una clase TypeScript pura.
 */
export class PonenteEntity {
  /** Identificador único del ponente */
  id: number;

  /** Nombre del ponente */
  nombre: string;

  /** Apellido del ponente */
  apellido: string;

  /** Correo electrónico del ponente (único) */
  email: string;

  /** Lista de áreas de experticia del ponente */
  areasExperticia: string[];

  /** Institución a la que pertenece el ponente (opcional) */
  institucion: string | null;

  /** Fecha de creación del registro */
  creadoEn: Date;

  /** Fecha de última actualización del registro */
  actualizadoEn: Date;
}
