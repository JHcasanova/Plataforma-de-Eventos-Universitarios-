/**
 * Representa la entidad Estudiante en el dominio de la aplicación.
 * No usa decoradores de Prisma; es una clase TypeScript pura.
 */
export class EstudianteEntity {
  /** Identificador único del estudiante */
  id: number;

  /** Código universitario del estudiante (único) */
  codigo: string;

  /** Nombre del estudiante */
  nombre: string;

  /** Apellido del estudiante */
  apellido: string;

  /** Correo electrónico del estudiante (único) */
  email: string;

  /** ID de la facultad a la que pertenece el estudiante */
  facultadId: number;

  /** Fecha de creación del registro */
  creadoEn: Date;

  /** Fecha de última actualización del registro */
  actualizadoEn: Date;
}
