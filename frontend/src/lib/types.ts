// Tipos TypeScript compartidos para la Plataforma de Eventos Universitarios

// ─── Enums ───────────────────────────────────────────────────────────────────

export type EstadoEvento = 'BORRADOR' | 'PUBLICADO' | 'CANCELADO' | 'FINALIZADO';
export type EstadoInscripcion = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
export type TipoEspacio = 'AULA' | 'AUDITORIO' | 'LABORATORIO' | 'CANCHA' | 'OTRO';

// ─── Entidades ────────────────────────────────────────────────────────────────

export interface Facultad {
  id: number;
  nombre: string;
  codigo: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface TipoEvento {
  id: number;
  nombre: string;
  descripcion?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Espacio {
  id: number;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  tipo: TipoEspacio;
  disponible: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Ponente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  areasExperticia: string[];
  institucion?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Evento {
  id: number;
  titulo: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  cupoMaximo: number;
  cuposDisponibles: number;
  estado: EstadoEvento;
  tipoEventoId: number;
  tipoEvento: TipoEvento;
  espacioId: number;
  espacio: Espacio;
  facultadId: number;
  facultad: Facultad;
  ponentes: Ponente[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface Estudiante {
  id: number;
  codigo: string;
  nombre: string;
  apellido: string;
  email: string;
  facultadId: number;
  facultad: Facultad;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Inscripcion {
  id: number;
  estudianteId: number;
  eventoId: number;
  estado: EstadoInscripcion;
  fechaInscripcion: string;
  estudiante?: Estudiante;
  evento?: Evento;
}

export interface Asistencia {
  id: number;
  inscripcionId: number;
  asistio: boolean;
  horaRegistro?: string;
  observaciones?: string;
}

// ─── Paginación ───────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
