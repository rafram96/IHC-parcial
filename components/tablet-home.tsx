"use client";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  FolderOpen,
  Stamp,
  TriangleAlert,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Kind, TODAY, needsAttention } from "@/lib/jornada";

export function TabletHome({
  db,
  onRegister,
  onAgenda,
  onSchedule,
  onCases,
}: {
  db: Database;
  onRegister: (kind: Kind) => void;
  onAgenda: () => void;
  onSchedule: () => void;
  onCases: () => void;
}) {
  const today = db.activities.filter(
    (a) => a.date === TODAY && a.status === "Programada",
  );
  const attention = db.records.filter(needsAttention);
  return (
    <section className="tablet-home">
      <div className="tablet-welcome">
        <h2>Buenos días, jueza</h2>
        <p>¿Qué deseas hacer hoy?</p>
      </div>
      <div className="task-tiles">
        <Button
          variant="secondary"
          className="task-tile"
          onClick={() => onRegister("case")}
        >
          <FileText data-icon="inline-start" />
          <span>
            Registrar
            <br />
            caso
          </span>
        </Button>
        <Button
          variant="secondary"
          className="task-tile"
          onClick={() => onRegister("notary")}
        >
          <Stamp data-icon="inline-start" />
          <span>
            Actuación
            <br />
            notarial
          </span>
        </Button>
        <Button variant="secondary" className="task-tile" onClick={onSchedule}>
          <CalendarDays data-icon="inline-start" />
          <span>
            Agendar
            <br />
            actividad
          </span>
        </Button>
      </div>
      {Object.keys(db.drafts).length || db.activityDraft ? (
        <div className="draft-tiles">
          {Object.keys(db.drafts).map((kind) => (
            <div className="draft-tile" key={kind}>
              <FileText />
              <div>
                <strong>
                  Borrador de {kind === "case" ? "caso" : "actuación"}
                </strong>
                <p>
                  <Save size={16} />
                  Guardado en esta tableta
                </p>
              </div>
              <Button onClick={() => onRegister(kind as Kind)}>
                Retomar {kind === "case" ? "caso" : "actuación"}
              </Button>
            </div>
          ))}
          {db.activityDraft ? (
            <div className="draft-tile">
              <CalendarDays />
              <div>
                <strong>Borrador de actividad</strong>
                <p>Guardado en esta tableta</p>
              </div>
              <Button onClick={onSchedule}>Retomar actividad</Button>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="home-agenda">
        {today.length ? (
          today.map((activity) => (
            <Button
              variant="secondary"
              key={activity.id}
              className="home-agenda-row"
              onClick={onAgenda}
            >
              <CalendarDays data-icon="inline-start" />
              <span>
                <strong>
                  Hoy{activity.start ? ` · ${activity.start}` : ""}
                </strong>
                <span>{activity.type}</span>
              </span>
              <ChevronRight data-icon="inline-end" />
            </Button>
          ))
        ) : (
          <Button
            variant="secondary"
            className="home-agenda-row"
            onClick={onAgenda}
          >
            <CalendarDays data-icon="inline-start" />
            <span>
              <strong>Tu semana</strong>
              <span>Consultar los próximos compromisos</span>
            </span>
            <ChevronRight data-icon="inline-end" />
          </Button>
        )}
      </div>
      {attention.length ? (
        <Button variant="ghost" className="home-attention" onClick={onCases}>
          <FolderOpen data-icon="inline-start" />
          <span>
            {attention.length}{" "}
            {attention.length === 1 ? "caso requiere" : "casos requieren"}{" "}
            atención
          </span>
          <Badge variant="outline">
            <TriangleAlert />
            Revisar
          </Badge>
          <ChevronRight data-icon="inline-end" />
        </Button>
      ) : null}
    </section>
  );
}
