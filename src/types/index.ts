export interface Negocio {
  id: string;
  nombre: string;
  slug: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  logo_url: string | null;
  plan: "free" | "pro" | "enterprise";
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profesional {
  id: string;
  negocio_id: string;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  avatar_url: string | null;
  especialidad: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Servicio {
  id: string;
  negocio_id: string;
  nombre: string;
  descripcion: string | null;
  duracion_minutos: number;
  precio: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  id: string;
  negocio_id: string;
  nombre: string;
  apellido: string | null;
  telefono: string;
  email: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export type EstadoTurno =
  | "pendiente"
  | "confirmado"
  | "en_curso"
  | "completado"
  | "cancelado"
  | "no_asistio";

export interface Turno {
  id: string;
  negocio_id: string;
  cliente_id: string;
  profesional_id: string;
  servicio_id: string;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  estado: EstadoTurno;
  notas: string | null;
  precio_cobrado: number | null;
  created_at: string;
  updated_at: string;
  // Relations (joined)
  cliente?: Cliente;
  profesional?: Profesional;
  servicio?: Servicio;
}

export interface MetricasOverview {
  turnosHoy: number;
  turnosHoyConfirmados: number;
  ingresosEstimadosHoy: number;
  proximasCitas: Turno[];
  turnosMes: number;
  ingresosMes: number;
}
