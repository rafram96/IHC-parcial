"use client";
import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup } from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Activity,
  ActivityDraft,
  RecordItem,
  TODAY,
  formatDate,
  validateActivity,
} from "@/lib/jornada";
import { FormField, SelectField } from "./record-form";
import { SyncBadge } from "./records";

export function ActivityForm({
  draft,
  records,
  activities,
  onChange,
  onSave,
  onBack,
}: {
  draft: ActivityDraft;
  records: RecordItem[];
  activities: Activity[];
  onChange: (d: ActivityDraft) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const patch = (v: Partial<ActivityDraft>) => onChange({ ...draft, ...v });
  const clashes = activities.filter(
    (a) =>
      a.status === "Programada" &&
      a.date === draft.date &&
      a.start &&
      a.end &&
      draft.start &&
      draft.end &&
      draft.start < a.end &&
      draft.end > a.start,
  );
  return (
    <section>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft data-icon="inline-start" />
        Volver a la agenda
      </Button>
      <div className="page-heading">
        <div>
          <p className="eyebrow">UN ESPACIO PARA CONVERSAR</p>
          <h2>Nueva actividad</h2>
          <p>
            Los campos con * son obligatorios. El borrador se guarda en esta
            tableta.
          </p>
        </div>
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const next = validateActivity(draft);
          setErrors(next);
          if (!Object.keys(next).length) onSave();
          else document.getElementById(Object.keys(next)[0])?.focus();
        }}
      >
        <FieldGroup>
          <FormField
            id="title"
            label="Nombre de la actividad *"
            error={errors.title}
          >
            <Input
              id="title"
              maxLength={80}
              value={draft.title}
              onChange={(e) => patch({ title: e.target.value })}
              aria-invalid={Boolean(errors.title)}
            />
          </FormField>
          <div className="field-grid">
            <FormField id="date" label="Fecha *" error={errors.date}>
              <Input
                id="date"
                type="date"
                value={draft.date}
                onChange={(e) => patch({ date: e.target.value })}
                aria-invalid={Boolean(errors.date)}
              />
            </FormField>
            <FormField id="activityType" label="Tipo de actividad">
              <SelectField
                id="activityType"
                value={draft.type}
                options={["Reunión", "Audiencia", "Visita", "Otra"]}
                onChange={(type) => patch({ type })}
              />
            </FormField>
          </div>
          {draft.date < TODAY ? (
            <p className="attention">
              Esta fecha ya pasó en la jornada. Comprueba si es correcta.
            </p>
          ) : null}
          <div className="field-grid">
            <FormField id="start" label="Hora de inicio (opcional)">
              <Input
                id="start"
                type="time"
                value={draft.start}
                onChange={(e) => patch({ start: e.target.value })}
              />
            </FormField>
            <FormField
              id="end"
              label="Hora de término (opcional)"
              error={errors.end}
            >
              <Input
                id="end"
                type="time"
                value={draft.end}
                onChange={(e) => patch({ end: e.target.value })}
                aria-invalid={Boolean(errors.end)}
              />
            </FormField>
          </div>
          {clashes.length ? (
            <p className="attention">
              El horario coincide con: {clashes.map((a) => a.title).join(", ")}.
              Puedes cambiarlo o guardar de todos modos.
            </p>
          ) : null}
          <FormField
            id="place"
            label="Lugar o comunidad *"
            error={errors.place}
          >
            <Input
              id="place"
              maxLength={150}
              value={draft.place}
              onChange={(e) => patch({ place: e.target.value })}
              aria-invalid={Boolean(errors.place)}
            />
          </FormField>
          <FormField id="activityDescription" label="Descripción (opcional)">
            <Textarea
              id="activityDescription"
              value={draft.description}
              maxLength={500}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </FormField>
          <div className="field-grid">
            <FormField id="activityStatus" label="Estado">
              <SelectField
                id="activityStatus"
                value={draft.status}
                options={["Programada", "Realizada", "Cancelada"]}
                onChange={(status) => patch({ status })}
              />
            </FormField>
            <FormField
              id="linkedId"
              label="Vincular con un registro (opcional)"
            >
              <select
                className="native-control"
                id="linkedId"
                value={draft.linkedId}
                onChange={(e) => patch({ linkedId: e.target.value })}
              >
                <option value="">Sin vínculo</option>
                {records.map((r) => (
                  <option value={r.id} key={r.id}>
                    {r.id} · {r.people[0].name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={onBack}>
              Guardar y salir
            </Button>
            <Button type="submit">
              <CalendarDays data-icon="inline-start" />
              Guardar actividad
            </Button>
          </div>
        </FieldGroup>
      </form>
    </section>
  );
}
export function Agenda({
  activities,
  hasDraft,
  onNew,
  onUpdate,
  onOpen,
  onWeek,
}: {
  activities: Activity[];
  hasDraft: boolean;
  onNew: () => void;
  onUpdate: (a: Activity) => void;
  onOpen: (id: string) => void;
  onWeek: () => void;
}) {
  const [view, setView] = useState("month");
  const [selected, setSelected] = useState(TODAY);
  const [month, setMonth] = useState("2026-05");
  const start = new Date(selected + "T12:00:00");
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const filtered = activities
    .filter((a) =>
      view === "week"
        ? a.date >= iso(start) && a.date <= iso(end)
        : a.date === selected,
    )
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
  const [year, monthNumber] = month.split("-").map(Number);
  const days = new Date(year, monthNumber, 0).getDate();
  const offset = (new Date(year, monthNumber - 1, 1).getDay() + 6) % 7;
  function changeMonth(delta: number) {
    const next = new Date(year, monthNumber - 1 + delta, 1);
    setMonth(iso(next).slice(0, 7));
    setSelected(iso(next));
  }
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TIEMPO PARA CADA PERSONA</p>
          <h2>Agenda</h2>
          <p>Organiza las atenciones y los encuentros de la comunidad.</p>
        </div>
        <Button onClick={onNew}>
          <Plus data-icon="inline-start" />
          {hasDraft ? "Retomar actividad" : "Nueva actividad"}
        </Button>
      </div>
      <div className="agenda-toolbar">
        <Tabs
          value={view}
          onValueChange={(value) => {
            setView(String(value));
            if (value === "week") onWeek();
          }}
        >
          <TabsList>
            <TabsTrigger value="month">Mes</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="day">Día</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant="outline"
          onClick={() => {
            setSelected(TODAY);
            setMonth("2026-05");
          }}
        >
          Hoy
        </Button>
        <label className="date-picker">
          Ir a fecha
          <Input
            aria-label="Ir a fecha"
            type="date"
            value={selected}
            onChange={(e) => {
              if (e.target.value) {
                setSelected(e.target.value);
                setMonth(e.target.value.slice(0, 7));
              }
            }}
          />
        </label>
      </div>
      {view === "month" ? (
        <div className="calendar">
          <div className="calendar-heading">
            <Button
              variant="ghost"
              aria-label="Mes anterior"
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeft />
            </Button>
            <h3>
              {new Date(year, monthNumber - 1, 1).toLocaleDateString("es-PE", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <Button
              variant="ghost"
              aria-label="Mes siguiente"
              onClick={() => changeMonth(1)}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="calendar-grid">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <span key={d} className="calendar-weekday">
                {d}
              </span>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <span key={`empty${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const day = `${month}-${String(i + 1).padStart(2, "0")}`;
              const entries = activities.filter((a) => a.date === day);
              return (
                <button
                  key={day}
                  className="calendar-day"
                  aria-pressed={selected === day}
                  aria-label={`${formatDate(day)}, ${entries.length} actividades`}
                  onClick={() => {
                    setSelected(day);
                    setView("day");
                  }}
                >
                  <span>{i + 1}</span>
                  {entries.length ? (
                    <small>
                      <CalendarDays size={13} />
                      {entries.length} act.
                    </small>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {view !== "month" ? (
        <>
          <h3 className="section-heading">
            {view === "week"
              ? `${formatDate(iso(start))} — ${formatDate(iso(end))}`
              : formatDate(selected)}
          </h3>
          <div className="activity-list">
            {filtered.map((a) => (
              <article
                className="activity-row"
                key={a.id}
                data-cancelled={a.status === "Cancelada"}
              >
                <div className="activity-time">
                  <strong>{a.start || "Sin hora"}</strong>
                  <span>{formatDate(a.date)}</span>
                </div>
                <div className="activity-copy">
                  <Badge variant="secondary">
                    <CalendarDays />
                    {a.type}
                  </Badge>
                  <h4>{a.title}</h4>
                  <p>
                    <MapPin size={14} />
                    {a.place}
                    {a.end ? ` · Hasta las ${a.end}` : ""}
                  </p>
                  {a.description ? <p>{a.description}</p> : null}
                  <SyncBadge pending={a.pending} />
                  {a.linkedId ? (
                    <Button variant="link" onClick={() => onOpen(a.linkedId)}>
                      Ver {a.linkedId}
                    </Button>
                  ) : null}
                </div>
                <div>
                  <label className="sr-only" htmlFor={`status-${a.id}`}>
                    Estado de {a.title}
                  </label>
                  <SelectField
                    id={`status-${a.id}`}
                    value={a.status}
                    options={["Programada", "Realizada", "Cancelada"]}
                    onChange={(status) =>
                      onUpdate({
                        ...a,
                        status,
                        pending: true,
                        revision: a.revision + 1,
                      })
                    }
                  />
                </div>
              </article>
            ))}
          </div>
          {!filtered.length ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No hay actividades programadas</EmptyTitle>
                <EmptyDescription>
                  Puedes reservar un espacio con Nueva actividad.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}
        </>
      ) : (
        <p className="calendar-help">
          Selecciona un día para consultar sus actividades.
        </p>
      )}
    </section>
  );
}
