"use client";
import {
  AlertCircle,
  Check,
  CloudUpload,
  FileText,
  RotateCcw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/jornada";
import { SyncBadge } from "./records";

export function SyncPanel({
  db,
  online,
  state,
  progress,
  onSync,
}: {
  db: Database;
  online: boolean;
  state: "idle" | "sending" | "success" | "failed";
  progress: number;
  onSync: () => void;
}) {
  const pending = [...db.records, ...db.activities].filter((r) => r.pending);
  const complete = state === "success" && pending.length === 0;
  return (
    <section className="sync-page">
      <div className="sync-heading">
        <h2>Sincronización</h2>
        <span className={online ? "network-pill" : "network-pill offline"}>
          {online ? <Wifi /> : <WifiOff />}
          {online ? "Con conexión" : "Sin conexión"}
        </span>
      </div>
      <div className="sync-outcome" role="status">
        <span
          className={`sync-result-icon ${state === "failed" ? "failed" : complete ? "success" : ""}`}
        >
          {state === "failed" ? (
            <AlertCircle />
          ) : complete ? (
            <Check />
          ) : (
            <CloudUpload />
          )}
        </span>
        <h3>
          {state === "sending"
            ? "Sincronizando tus registros…"
            : state === "failed"
              ? "Sincronización interrumpida"
              : complete
                ? "Sincronización completada"
                : `${pending.length} registros pendientes`}
        </h3>
        <p>
          {state === "failed"
            ? "Tus datos siguen guardados en esta tableta."
            : complete
              ? "Se confirmó el envío simulado de tus registros."
              : online
                ? "Envía los cambios guardados en esta tableta."
                : "Puedes continuar trabajando. Envía los cambios cuando vuelva Internet."}
        </p>
        {state === "sending" ? (
          <div className="sync-progress">
            <progress value={progress} max={100} />
            <span>{progress}%</span>
          </div>
        ) : null}
        {complete ? (
          <div className="sync-completed-summary">
            <FileText />
            <div>
              <strong>0 registros pendientes</strong>
              <p>La tableta está actualizada.</p>
            </div>
          </div>
        ) : (
          <Button
            onClick={onSync}
            disabled={!online || !pending.length || state === "sending"}
          >
            {state === "failed" ? (
              <RotateCcw data-icon="inline-start" />
            ) : (
              <CloudUpload data-icon="inline-start" />
            )}
            {state === "failed"
              ? "Reintentar sincronización"
              : state === "sending"
                ? "Enviando…"
                : "Sincronizar ahora"}
          </Button>
        )}
      </div>
      <details className="sync-details">
        <summary>Ver detalle y última sincronización</summary>
        <p>
          Último envío simulado:{" "}
          {db.lastSync
            ? new Date(db.lastSync).toLocaleString("es-PE")
            : "Aún no realizado"}
          .
        </p>
        {pending.map((r) => (
          <div className="pending-row" key={r.id}>
            <span>
              <strong>{r.id}</strong> · {"title" in r ? r.title : r.description}
            </span>
            <SyncBadge pending />
          </div>
        ))}
        {Object.keys(db.drafts).length || db.activityDraft ? (
          <p>
            Los borradores permanecen en esta tableta. Termina y registra cada
            formulario para incluirlo en el envío.
          </p>
        ) : null}
      </details>
      <p className="sync-disclaimer">
        Sincronización simulada, sin servidor. Para consultar información desde
        una computadora, primero es necesario enviarla desde esta tableta.
      </p>
    </section>
  );
}
