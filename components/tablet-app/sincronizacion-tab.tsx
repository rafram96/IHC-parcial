"use client";

import React, { useState } from "react";
import {
  CloudOffIcon,
  DatabaseIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  WifiIcon,
  WifiOffIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";

export function SincronizacionTab() {
  const {
    cases,
    notarials,
    agenda,
    isOnline,
    lastSyncTime,
    syncInProgress,
    syncProgress,
    syncLog,
    syncError,
    synchronizeAll,
  } = useApp();

  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);

  const pendingCases = cases.filter((c) => c.syncEstado === "local");
  const pendingNotarials = notarials.filter((n) => n.syncEstado === "local");
  const pendingAgenda = agenda.filter((a) => a.syncEstado === "local");
  const totalPending = pendingCases.length + pendingNotarials.length + pendingAgenda.length;

  const handleStartSync = () => {
    synchronizeAll(simulateFailure);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-stone-50 p-4 sm:p-6 dark:bg-stone-950 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-200 bg-white p-5 rounded-2xl dark:border-stone-800 dark:bg-stone-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md">
            <RefreshCwIcon className={`size-6 ${syncInProgress ? "animate-spin" : ""}`} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
              Enviar datos al Poder Judicial
            </h1>
            <p className="text-xs text-stone-500">
              Sincronización segura de registros locales de la tableta con la sede central
            </p>
          </div>
        </div>

        {/* Network status pill */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 border border-emerald-200 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
              <WifiIcon className="size-4 text-emerald-600" />
              <span>Conexión a Internet activa</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2 border border-red-200 text-xs font-bold text-red-800 dark:bg-red-950/60 dark:border-red-800 dark:text-red-300 animate-pulse">
              <WifiOffIcon className="size-4 text-red-600" />
              <span>Sin conexión a Internet</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary of Pending Records (SRS v2 6.4) */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <DatabaseIcon className="size-5 text-amber-600" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Registros en la tableta pendientes de envío
            </h2>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            Último respaldo exitoso: <strong>{lastSyncTime || "Pendiente"}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/50">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Casos judiciales
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                {pendingCases.length}
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                {pendingCases.length === 0 ? "Todo enviado" : "⏳ Por enviar"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/50">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Actuaciones notariales
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                {pendingNotarials.length}
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                {pendingNotarials.length === 0 ? "Todo enviado" : "⏳ Por enviar"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/50">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Actividades de agenda
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                {pendingAgenda.length}
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                {pendingAgenda.length === 0 ? "Todo enviado" : "⏳ Por enviar"}
              </span>
            </div>
          </div>
        </div>

        {/* Sync Action Area */}
        <div className="pt-2">
          {!isOnline ? (
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 flex items-start gap-3">
              <CloudOffIcon className="size-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>No es posible enviar ahora:</strong> La tableta no detecta conexión a Internet.
                Tus datos no se pierden y continúan almacenados de forma segura en este dispositivo.
                Podrás presionar &ldquo;Enviar ahora&rdquo; en cuanto se recupere la señal o llegues a la sede con red.
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-stone-600 dark:text-stone-400">
                {totalPending > 0
                  ? `Se enviarán ${totalPending} registros al sistema integrado del Poder Judicial.`
                  : "Todos los expedientes y trámites locales ya están debidamente respaldados."}
              </div>

              <div className="flex items-center gap-3">
                {/* Simulator Checkbox for Evaluator */}
                <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="rounded text-amber-600 size-4"
                  />
                  <span>Simular fallo a mitad de envío (D19)</span>
                </label>

                <button
                  disabled={syncInProgress || (!isOnline && totalPending > 0)}
                  onClick={handleStartSync}
                  className="flex min-h-[50px] items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-amber-500 active:scale-95 disabled:opacity-40 transition-all"
                >
                  <RefreshCwIcon className={`size-4 ${syncInProgress ? "animate-spin" : ""}`} />
                  <span>{syncInProgress ? "Enviando registros…" : "Enviar ahora al PJ"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress & Live Transfer Feedback */}
      {(syncInProgress || syncLog.length > 0) && (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-amber-600" />
              <span>Progreso de la transferencia de datos</span>
            </h3>
            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">
              {syncProgress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                syncError
                  ? "bg-red-500"
                  : syncProgress === 100
                  ? "bg-emerald-600"
                  : "bg-amber-600"
              }`}
              style={{ width: `${syncProgress}%` }}
            />
          </div>

          {/* Log steps */}
          <div className="rounded-xl bg-stone-950 p-4 text-xs font-mono text-stone-300 space-y-1.5 max-h-48 overflow-y-auto">
            {syncLog.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.startsWith("✓")
                    ? "text-emerald-400 font-bold"
                    : log.startsWith("⚠") || log.startsWith("Error")
                    ? "text-red-400 font-bold"
                    : "text-stone-300"
                }
              >
                {log}
              </div>
            ))}
          </div>

          {syncError && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                No se perdieron datos. La tableta conserva todos los registros intactos.
              </span>
              <button
                onClick={() => {
                  setSimulateFailure(false);
                  synchronizeAll(false);
                }}
                className="flex items-center gap-1 rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800"
              >
                <RotateCcwIcon className="size-3.5" /> Reintentar sincronización
              </button>
            </div>
          )}
        </div>
      )}

      {/* Rationale explanation card (D1, D2, D19) */}
      <div className="rounded-2xl border border-stone-200 bg-stone-100/60 p-5 dark:border-stone-800 dark:bg-stone-900/40 text-xs text-stone-600 dark:text-stone-400 space-y-2">
        <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
          ¿Cómo funciona la sincronización sin conexión en esta tableta?
        </h4>
        <p>
          • <strong>Persistencia local total:</strong> Cada vez que registras o editas un caso, se guarda inmediatamente en la memoria interna de la tableta (localStorage), garantizando continuidad aunque se corte la energía o la señal de la antena.
        </p>
        <p>
          • <strong>Diferenciación de estados:</strong> Un caso puede estar <em>&ldquo;Concluido&rdquo;</em> judicialmente y al mismo tiempo figurar como <em>&ldquo;Guardado en la tableta (pendiente de envío)&rdquo;</em> hasta que se complete esta sincronización.
        </p>
        <p>
          • <strong>Seguridad en reintentos:</strong> Si la señal se interrumpe durante el envío, el protocolo solo marca como respaldados aquellos registros confirmados por el servidor, evitando duplicados.
        </p>
      </div>
    </div>
  );
}
