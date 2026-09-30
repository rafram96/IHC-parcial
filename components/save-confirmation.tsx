"use client";
import {
  CalendarDays,
  Check,
  CloudUpload,
  FileText,
  Home,
  Save,
  Users,
  ArrowRight,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, RecordItem, formatDate } from "@/lib/jornada";

export function FormSteps({
  step,
  notary = false,
}: {
  step: number;
  notary?: boolean;
}) {
  return (
    <ol className="form-steps" aria-label="Pasos del registro">
      {[
        notary ? "Datos de la solicitud" : "Datos del caso",
        "Personas",
        "Revisar",
        "Confirmar",
      ].map((name, i) => (
        <li
          key={name}
          data-complete={i < step}
          aria-current={step === i ? "step" : undefined}
        >
          <span>{i < step ? <Check size={16} /> : i + 1}</span>
          <small>{name}</small>
        </li>
      ))}
    </ol>
  );
}

export function SaveConfirmation({
  record,
  activity,
  onView,
  onHome,
}: {
  record?: RecordItem;
  activity?: Activity;
  onView: () => void;
  onHome: () => void;
}) {
  const isCase = record?.kind === "case";
  return (
    <section className="save-confirmation">
      {record ? <FormSteps step={3} notary={!isCase} /> : null}
      <div className="confirmation-heading">
        <span className="success-symbol">
          <Check />
        </span>
        <h2>
          {activity
            ? "Actividad guardada"
            : isCase
              ? "Caso registrado"
              : "Solicitud registrada"}
        </h2>
        {record ? (
          <strong className="confirmation-code">{record.id}</strong>
        ) : null}
      </div>
      {activity ? (
        <div className="confirmation-summary activity-summary">
          <Users />
          <div>
            <h3>{activity.title}</h3>
            <p>
              {formatDate(activity.date)}
              {activity.start ? ` · ${activity.start}` : ""}
              {activity.end ? ` – ${activity.end}` : ""}
            </p>
            <p>{activity.place}</p>
            {activity.linkedId ? (
              <span className="linked-code">{activity.linkedId}</span>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="confirmation-summary">
          <div>
            <FileText />
            <span>Estado {isCase ? "del caso" : "de la atención"}:</span>
            <Badge variant="secondary">{record?.status}</Badge>
          </div>
          <div>
            <Save />
            <span>Guardado en esta tableta</span>
          </div>
          <div className="pending-status">
            <CloudUpload />
            <span>Pendiente de sincronización</span>
          </div>
        </div>
      )}
      {activity ? (
        <div className="confirmation-badges">
          <Badge variant="secondary">
            <CalendarDays />
            {activity.status}
          </Badge>
          <Badge variant="outline">
            <CloudUpload />
            Pendiente de sincronización
          </Badge>
        </div>
      ) : null}
      <div className="confirmation-actions">
        <Button variant={activity ? "default" : "secondary"} onClick={onView}>
          {activity ? (
            <CalendarDays data-icon="inline-start" />
          ) : isCase ? (
            <FileText data-icon="inline-start" />
          ) : (
            <Clock3 data-icon="inline-start" />
          )}
          {activity ? "Ir a la agenda" : isCase ? "Ver caso" : "Ver actuación"}
          {activity ? <ArrowRight data-icon="inline-end" /> : null}
        </Button>
        {!activity ? (
          <Button variant="secondary" onClick={onHome}>
            <Home data-icon="inline-start" />
            Volver al inicio
          </Button>
        ) : null}
      </div>
    </section>
  );
}
