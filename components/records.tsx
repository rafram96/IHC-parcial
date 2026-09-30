"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarPlus,
  CheckCheck,
  Clock3,
  FileText,
  Plus,
  Search,
  TriangleAlert,
  Users,
  Check,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup } from "@/components/ui/field";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormField, SelectField } from "./record-form";
import {
  RecordItem,
  Kind,
  needsAttention,
  normalize,
  formatDate,
  TODAY,
} from "@/lib/jornada";

export function SyncBadge({ pending }: { pending: boolean }) {
  return (
    <span className="sync-label">
      {pending ? <Clock3 size={14} /> : <CheckCheck size={14} />}
      {pending ? "Pendiente de sincronización" : "Sincronizado · demo"}
    </span>
  );
}
export function RecordList({
  kind,
  records,
  hasDraft,
  onNew,
  onOpen,
}: {
  kind: Kind;
  records: RecordItem[];
  hasDraft: boolean;
  onNew: () => void;
  onOpen: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todos");
  const filtered = records.filter(
    (r) =>
      r.kind === kind &&
      (status === "Todos" ||
        (status === "Requiere atención"
          ? needsAttention(r)
          : r.status === status)) &&
      normalize(
        [
          r.id,
          r.description,
          ...r.people.map((p) => `${p.name} ${p.document}`),
        ].join(" "),
      ).includes(normalize(search)),
  );
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TU ARCHIVO, SIEMPRE A MANO</p>
          <h2>{kind === "case" ? "Casos" : "Actuaciones notariales"}</h2>
          <p>Consulta los registros y continúa su atención.</p>
        </div>
        <Button onClick={onNew}>
          <Plus data-icon="inline-start" />
          {hasDraft
            ? "Retomar borrador"
            : kind === "case"
              ? "Nuevo caso"
              : "Nueva actuación"}
        </Button>
      </div>
      <div className="search-row">
        <FormField id="search" label="Buscar por nombre, documento o código">
          <div className="search-input">
            <Search size={18} />
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="¿Qué registro buscas?"
            />
          </div>
        </FormField>
        <FormField id="filter" label="Estado">
          <SelectField
            id="filter"
            value={status}
            onChange={setStatus}
            options={
              kind === "case"
                ? [
                    "Todos",
                    "En trámite",
                    "En espera",
                    "Concluido",
                    "Requiere atención",
                  ]
                : ["Todos", "Pendiente", "Atendida", "Concluida"]
            }
          />
        </FormField>
      </div>
      <p className="list-count">
        {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
      </p>
      <div className="record-list">
        {filtered.map((r) => (
          <button
            key={r.id}
            className="record-row"
            onClick={() => onOpen(r.id)}
          >
            <span className="record-icon">
              <FileText size={23} />
            </span>
            <span className="record-copy">
              <span className="record-code">
                {r.id} · {formatDate(r.date)}
              </span>
              <strong>{r.description}</strong>
              <span>{r.people.map((p) => p.name).join(" y ")}</span>
              <SyncBadge pending={r.pending} />
            </span>
            <span className="record-tags">
              <Badge variant="secondary">{r.status}</Badge>
              {needsAttention(r) ? (
                <span className="attention">
                  <TriangleAlert size={15} />
                  Requiere atención
                </span>
              ) : null}
            </span>
            <ArrowUpRight size={19} />
          </button>
        ))}
      </div>
      {!filtered.length ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No hay registros con estos criterios</EmptyTitle>
            <EmptyDescription>
              Prueba otro nombre o selecciona Todos en el estado.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
    </section>
  );
}
export function RecordDetail({
  record,
  onBack,
  onUpdate,
  onSchedule,
}: {
  record: RecordItem;
  onBack: () => void;
  onUpdate: (r: RecordItem) => boolean;
  onSchedule: () => void;
}) {
  const [text, setText] = useState("");
  const [date, setDate] = useState(TODAY);
  const [status, setStatus] = useState(record.status);
  const [result, setResult] = useState(record.result);
  const [attentionDate, setAttentionDate] = useState(record.attentionDate);
  const [completionDate, setCompletionDate] = useState(record.completionDate);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const isCase = record.kind === "case";
  const concluding = status === "Concluido" || status === "Concluida";
  function submit() {
    if (text.trim().length < 5) {
      setError("Describe el avance con al menos 5 caracteres.");
      return;
    }
    if (!date || date > TODAY || date < record.date) {
      setError(
        "La fecha del avance debe estar entre el registro y el día de esta jornada.",
      );
      return;
    }
    if (concluding && !result.trim()) {
      setError("Escribe el resultado o acuerdo antes de concluir.");
      return;
    }
    if (
      attentionDate &&
      (attentionDate < record.date || (isCase && attentionDate < TODAY))
    ) {
      setError(
        "Revisa la fecha de atención: la próxima atención no puede estar en el pasado.",
      );
      return;
    }
    if (
      completionDate &&
      (completionDate < record.date || completionDate > TODAY)
    ) {
      setError(
        "La conclusión debe estar entre la solicitud y el día de esta jornada.",
      );
      return;
    }
    setError("");
    setConfirm(true);
  }
  function save() {
    if (
      onUpdate({
        ...record,
        status,
        result: result.trim(),
        attentionDate,
        completionDate: concluding ? completionDate || TODAY : completionDate,
        history: [...record.history, { date, text: text.trim() }],
        pending: true,
        revision: record.revision + 1,
      })
    ) {
      setText("");
      setConfirm(false);
      setEditing(false);
      setSaved(true);
    }
  }
  return (
    <section className="record-detail">
      <Button
        variant="ghost"
        onClick={() => (editing ? setEditing(false) : onBack())}
      >
        <ArrowLeft data-icon="inline-start" />
        {editing ? "Volver al detalle" : "Volver a registros"}
      </Button>
      <div className="page-heading">
        <div>
          <h2>
            {editing
              ? concluding
                ? isCase
                  ? "Concluir caso"
                  : "Registrar resultado"
                : "Añadir avance"
              : record.id}
          </h2>
          {editing ? <span className="detail-code">{record.id}</span> : null}
          <p>{record.description}</p>
        </div>
        <Badge variant="secondary">{record.status}</Badge>
      </div>
      <SyncBadge pending={record.pending} />
      {!editing ? (
        <>
          <div className="detail-participants">
            <Users />
            <div>
              <strong>{record.people.map((p) => p.name).join(" · ")}</strong>
              <span>{record.type}</span>
            </div>
            {needsAttention(record) ? (
              <Badge variant="outline" className="attention-badge">
                Requiere atención
              </Badge>
            ) : null}
          </div>
          {saved ? (
            <div className="result-callout">
              <span className="success-symbol">
                <Check />
              </span>
              <div>
                <h3>
                  {concluding
                    ? isCase
                      ? "Caso concluido"
                      : "Actuación concluida"
                    : "Avance guardado"}
                </h3>
                <p>
                  {concluding
                    ? record.result
                    : "Los cambios quedaron guardados en esta tableta."}
                </p>
              </div>
            </div>
          ) : null}
          <h3 className="timeline-title">Historial de atención</h3>
          <ol className="timeline">
            {record.history.map((h, i) => (
              <li key={i}>
                <strong>{h.text}</strong>
                <span>{formatDate(h.date)}</span>
              </li>
            ))}
            {record.status !== "Concluido" && record.status !== "Concluida" ? (
              <li className="timeline-pending">
                <strong>
                  {isCase ? "Acuerdo o resultado" : "Resultado de la actuación"}
                </strong>
                <span>Pendiente</span>
              </li>
            ) : null}
          </ol>
          <div className="detail-actions">
            <Button
              variant="outline"
              onClick={() => {
                setEditing(true);
                setSaved(false);
              }}
            >
              <FileText data-icon="inline-start" />
              {isCase ? "Añadir avance" : "Actualizar estado"}
            </Button>
            <Button onClick={onSchedule}>
              <CalendarPlus data-icon="inline-start" />
              Agendar atención vinculada
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(true);
                setStatus(isCase ? "Concluido" : "Concluida");
                setSaved(false);
              }}
            >
              <Check data-icon="inline-start" />
              {isCase ? "Concluir caso" : "Registrar resultado"}
            </Button>
          </div>
          <details className="record-more">
            <summary>Ver personas y datos del registro</summary>
            <div className="detail-grid">
              <div>
                <h3>
                  <Users size={20} />
                  Personas involucradas
                </h3>
                {record.people.map((p, i) => (
                  <div className="review-person" key={i}>
                    <strong>{p.name}</strong>
                    <Badge variant="outline">{p.role}</Badge>
                    <p>
                      {p.community} · {p.contact || "Sin contacto disponible"}
                    </p>
                    <p>
                      {p.documentType}
                      {p.document ? `: ${p.document}` : ""}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <h3>Fechas y resultado</h3>
                <p>Registro: {formatDate(record.date)}</p>
                <p>
                  {isCase ? "Próxima atención" : "Atención"}:{" "}
                  {record.attentionDate
                    ? formatDate(record.attentionDate)
                    : "Sin fecha"}
                </p>
                <p>
                  Conclusión:{" "}
                  {record.completionDate
                    ? formatDate(record.completionDate)
                    : "Sin fecha"}
                </p>
                <p>
                  {record.result || "Todavía no se ha registrado un resultado."}
                </p>
                <p>{record.observations || "Sin observaciones adicionales."}</p>
              </div>
            </div>
          </details>
        </>
      ) : null}
      {editing ? (
        <div className="edit-panel">
          <p>
            Vas a actualizar el estado, las fechas y el resultado de {record.id}
            . El historial anterior se conserva.
          </p>
          <FieldGroup>
            <div className="field-grid">
              <FormField id="advanceDate" label="Fecha del avance *">
                <Input
                  id="advanceDate"
                  type="date"
                  value={date}
                  max={TODAY}
                  min={record.date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormField>
              <FormField id="recordStatus" label="Estado del trámite *">
                <SelectField
                  id="recordStatus"
                  value={status}
                  onChange={setStatus}
                  options={
                    isCase
                      ? ["En trámite", "En espera", "Concluido"]
                      : ["Pendiente", "Atendida", "Concluida"]
                  }
                />
              </FormField>
            </div>
            <FormField id="advance" label="¿Qué se hizo? *" error={error}>
              <Textarea
                id="advance"
                value={text}
                maxLength={500}
                onChange={(e) => setText(e.target.value)}
                aria-invalid={Boolean(error)}
              />
            </FormField>
            <div className="field-grid">
              <FormField
                id="attentionDate"
                label={
                  isCase
                    ? "Próxima atención (opcional)"
                    : "Fecha de atención (opcional)"
                }
              >
                <Input
                  id="attentionDate"
                  type="date"
                  value={attentionDate}
                  onChange={(e) => setAttentionDate(e.target.value)}
                />
              </FormField>
              <FormField
                id="completionDate"
                label="Fecha de entrega o conclusión (opcional)"
              >
                <Input
                  id="completionDate"
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  max={TODAY}
                />
              </FormField>
            </div>
            <FormField
              id="result"
              label={`Resultado o acuerdo ${concluding ? "*" : "(opcional)"}`}
              help="Es obligatorio para concluir el trámite."
            >
              <Textarea
                id="result"
                value={result}
                maxLength={1000}
                onChange={(e) => setResult(e.target.value)}
              />
            </FormField>
            <div className="form-actions">
              <Button variant="secondary" onClick={() => setEditing(false)}>
                <ArrowLeft data-icon="inline-start" />
                Volver
              </Button>
              <Button onClick={submit}>
                <Save data-icon="inline-start" />
                Revisar cambios
              </Button>
            </div>
          </FieldGroup>
        </div>
      ) : null}
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar actualización</DialogTitle>
            <DialogDescription>
              Se añadirá un avance a {record.id} y se guardarán estos cambios en
              la tableta.
            </DialogDescription>
          </DialogHeader>
          <p>
            Estado: {record.status} → {status}
          </p>
          <p>Avance: {text}</p>
          <p>Fecha de atención: {attentionDate || "Sin fecha"}</p>
          <p>Resultado: {result || "Sin resultado"}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Seguir revisando
            </Button>
            <Button onClick={save}>Confirmar y guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
