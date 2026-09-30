export type SyncEstado = "borrador" | "local" | "enviando" | "sincronizado" | "error";

export type EstadoCaso = "En trámite" | "En espera" | "Concluido";

export type MateriaCaso =
  | "Vecinal"
  | "Terrenos y linderos"
  | "Deudas"
  | "Familiar"
  | "Daños"
  | "Otro";

export type TipoDocumento = "DNI" | "Carné de extranjería" | "No tiene / no lo trajo";

export type RolPersonaCaso = "Solicitante" | "Invitado" | "Testigo";

export type RolPersonaActuacion = "Solicitante" | "Declarante" | "Testigo";

export interface Persona {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDoc: TipoDocumento;
  numDoc?: string;
  telefono?: string;
  comunidad: string;
  direccion?: string;
  rol: string;
}

export interface AvanceCaso {
  id: string;
  fecha: string;
  descripcion: string;
  proximaFecha?: string;
  resultado?: string;
}

export interface Caso {
  id: string; // e.g. C-2026-0001
  codigo: string;
  fechaRegistro: string;
  materia: MateriaCaso;
  materiaOtro?: string;
  motivo: string;
  estado: EstadoCaso;
  observaciones?: string;
  partes: Persona[];
  historial: AvanceCaso[];
  proximaFechaAtencion?: string;
  resultado?: string;
  requiereAtencion: boolean;
  syncEstado: SyncEstado;
  updatedAt: string;
}

export type TipoActuacion =
  | "Constancia de posesión"
  | "Constancia de convivencia"
  | "Certificación de firmas"
  | "Transferencia de bienes muebles"
  | "Otro";

export type EstadoActuacion = "Pendiente" | "Atendida" | "Concluida";

export interface ActuacionNotarial {
  id: string; // e.g. N-2026-0001
  codigo: string;
  fechaSolicitud: string;
  fechaAtencion?: string;
  tipo: TipoActuacion;
  tipoOtro?: string;
  asunto: string;
  estado: EstadoActuacion;
  observaciones?: string;
  participantes: Persona[];
  resultado?: string;
  fechaEntrega?: string;
  referenciaFisica?: string;
  syncEstado: SyncEstado;
  updatedAt: string;
}

export type TipoActividad = "Audiencia" | "Reunión" | "Visita" | "Otra";

export type EstadoActividad = "Programada" | "Realizada" | "Cancelada";

export interface ActividadAgenda {
  id: string;
  titulo: string;
  tipo: TipoActividad;
  fecha: string; // YYYY-MM-DD
  horaInicio?: string; // HH:MM
  horaFin?: string; // HH:MM
  lugar: string;
  motivo?: string;
  estado: EstadoActividad;
  casoVinculadoId?: string;
  actuacionVinculadaId?: string;
  syncEstado: SyncEstado;
  updatedAt: string;
}

export interface JustificationItem {
  id: string;
  code: string;
  decision: string;
  fundamento: string;
  necesidad: string;
  categoria: "Heurísticas" | "Factores Humanos" | "Sin Conexión" | "Prevención de Errores";
}

export interface DialogSpeech {
  speaker: string;
  role: string;
  text: string;
  hint?: string;
  actionPrompt?: string;
}

export interface StoryAct {
  id: number;
  title: string;
  subtitle: string;
  scenario: string;
  dialogs: DialogSpeech[];
  targetModule: "inicio" | "casos" | "actuaciones" | "agenda" | "sincronizacion";
  offlineSimulated: boolean;
}
