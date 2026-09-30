export const TODAY = "2026-05-12";
export const STORAGE_KEY = "mi-jornada:v1";
export type Kind = "case" | "notary";
export type Person = {
  name: string;
  documentType: string;
  document: string;
  contact: string;
  community: string;
  role: string;
};
export type Draft = {
  kind: Kind;
  step: number;
  date: string;
  type: string;
  description: string;
  observations: string;
  people: Person[];
};
export type RecordItem = Omit<Draft, "step"> & {
  id: string;
  status: string;
  result: string;
  attentionDate: string;
  completionDate: string;
  history: { date: string; text: string }[];
  pending: boolean;
  revision: number;
};
export type Activity = {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  place: string;
  description: string;
  type: string;
  status: string;
  linkedId: string;
  pending: boolean;
  revision: number;
};
export type ActivityDraft = Omit<Activity, "id" | "pending" | "revision">;
export type Database = {
  version: 1;
  records: RecordItem[];
  activities: Activity[];
  drafts: Partial<Record<Kind, Draft>>;
  activityDraft: ActivityDraft | null;
  lastSync: string | null;
  milestones: string[];
};
export const emptyPerson = (): Person => ({
  name: "",
  documentType: "Sin documento disponible",
  document: "",
  contact: "",
  community: "",
  role: "Solicitante",
});
export const newDraft = (kind: Kind): Draft => ({
  kind,
  step: 0,
  date: TODAY,
  type: "",
  description: "",
  observations: "",
  people: [emptyPerson()],
});
export const newActivity = (linkedId = ""): ActivityDraft => ({
  title: "",
  date: TODAY,
  start: "",
  end: "",
  place: "",
  description: "",
  type: "Reunión",
  status: "Programada",
  linkedId,
});
export function seedDatabase(): Database {
  return {
    version: 1,
    drafts: {},
    activityDraft: null,
    lastSync: null,
    milestones: [],
    records: [
      {
        ...newDraft("case"),
        id: "C-2026-0001",
        type: "Vecinal",
        date: "2026-05-08",
        description: "Uso compartido del camino a la comunidad",
        people: [
          { ...emptyPerson(), name: "Elena Quispe", community: "Santa Rosa" },
        ],
        status: "En trámite",
        result: "",
        attentionDate: TODAY,
        completionDate: "",
        history: [
          {
            date: "2026-05-08",
            text: "Se recibió la solicitud y se invitó a conversar a ambas partes.",
          },
        ],
        pending: false,
        revision: 1,
      },
      {
        ...newDraft("notary"),
        id: "N-2026-0001",
        type: "Certificación de firmas",
        date: "2026-05-07",
        description: "Firma de una declaración de entrega de herramientas",
        people: [
          { ...emptyPerson(), name: "Lucía Torres", community: "Santa Rosa" },
        ],
        status: "Pendiente",
        result: "",
        attentionDate: "",
        completionDate: "",
        history: [
          {
            date: "2026-05-07",
            text: "Solicitud recibida. Pendiente de atención.",
          },
        ],
        pending: false,
        revision: 1,
      },
    ],
    activities: [
      {
        ...newActivity("C-2026-0001"),
        id: "A-2026-0001",
        title: "Conversación sobre el camino comunal",
        start: "10:30",
        end: "11:00",
        place: "Juzgado de paz",
        type: "Audiencia",
        pending: false,
        revision: 1,
      },
      {
        ...newActivity(),
        id: "A-2026-0002",
        title: "Visita a la comunidad de Los Cedros",
        date: "2026-05-14",
        start: "09:00",
        end: "10:00",
        place: "Los Cedros",
        type: "Visita",
        pending: false,
        revision: 1,
      },
      {
        ...newActivity(),
        id: "A-2026-0003",
        title: "Reunión de coordinación comunal",
        date: "2026-05-15",
        start: "15:00",
        end: "16:00",
        place: "Local comunal",
        pending: false,
        revision: 1,
      },
    ],
  };
}
export function nextCode(prefix: string, items: { id: string }[]) {
  const max = items.reduce(
    (n, item) =>
      item.id.startsWith(prefix + "-")
        ? Math.max(n, Number(item.id.split("-")[2]) || 0)
        : n,
    0,
  );
  return `${prefix}-2026-${String(max + 1).padStart(4, "0")}`;
}
export function validateDraft(draft: Draft, step = draft.step) {
  const errors: Record<string, string> = {};
  if (step === 0 || step === 2) {
    if (!draft.date || draft.date > TODAY)
      errors.date =
        "Elige una fecha hasta el 12 de mayo, fecha de esta jornada.";
    if (!draft.type.trim()) errors.type = "Selecciona el tipo de atención.";
    if (draft.description.trim().length < 10)
      errors.description =
        "Escribe al menos 10 caracteres para explicar el asunto.";
  }
  if (step >= 1) {
    draft.people.forEach((p, i) => {
      if (p.name.trim().split(/\s+/).length < 2)
        errors[`name${i}`] = "Escribe nombres y apellidos.";
      if (!p.community.trim())
        errors[`community${i}`] = "Indica la dirección o comunidad.";
      if (p.documentType === "DNI" && !/^\d{8}$/.test(p.document))
        errors[`document${i}`] = "El DNI debe tener 8 dígitos.";
      if (p.documentType === "Otro documento" && !p.document.trim())
        errors[`document${i}`] = "Escribe el número del documento.";
    });
    if (!draft.people.some((p) => p.role === "Solicitante"))
      errors.people = "Incluye al menos una persona solicitante.";
  }
  return errors;
}
export function validateActivity(a: ActivityDraft) {
  const errors: Record<string, string> = {};
  if (!a.title.trim()) errors.title = "Escribe el nombre de la actividad.";
  if (!a.date) errors.date = "Elige la fecha de la actividad.";
  if (!a.place.trim()) errors.place = "Indica dónde será la actividad.";
  if (a.end && (!a.start || a.end <= a.start))
    errors.end = "La hora de término debe ser posterior al inicio.";
  return errors;
}
export const needsAttention = (r: RecordItem) =>
  r.kind === "case" &&
  r.status !== "Concluido" &&
  Boolean(r.attentionDate && r.attentionDate <= TODAY);
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function duplicateCandidates(d: Draft, records: RecordItem[]) {
  return records.filter(
    (r) =>
      r.kind === d.kind &&
      r.type === d.type &&
      Math.abs(Date.parse(d.date) - Date.parse(r.date)) <= 30 * 86400000 &&
      d.people.some((p) =>
        r.people.some(
          (q) =>
            (p.document && q.document && p.document === q.document) ||
            (p.name.trim() &&
              normalize(p.name.trim()) === normalize(q.name.trim())),
        ),
      ),
  );
}
export const formatDate = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
  });
export function acknowledgeSnapshot(
  db: Database,
  snapshot: { id: string; revision: number }[],
  at: string,
): Database {
  const acknowledged = new Map(snapshot.map((r) => [r.id, r.revision]));
  const update = <T extends { id: string; revision: number; pending: boolean }>(
    r: T,
  ): T =>
    acknowledged.get(r.id) === r.revision ? { ...r, pending: false } : r;
  return {
    ...db,
    records: db.records.map(update),
    activities: db.activities.map(update),
    lastSync: at,
    milestones: [...new Set([...db.milestones, "sync"])],
  };
}
