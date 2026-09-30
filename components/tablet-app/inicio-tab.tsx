"use client";

import React from "react";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  FileSignatureIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  ScaleIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";

export function InicioTab() {
  const {
    cases,
    notarials,
    agenda,
    setActiveTab,
    getPendingSyncCount,
  } = useApp();

  const casosEnTramite = cases.filter((c) => c.estado === "En trámite").length;
  const actuacionesPendientes = notarials.filter((n) => n.estado === "Pendiente" || n.estado === "Atendida").length;
  const hoyStr = "2026-09-30"; // Demo day
  const actividadesHoy = agenda.filter((a) => a.fecha === hoyStr || a.fecha === "2026-09-29");
  const pendingSync = getPendingSyncCount();
  const casesRequiringAttention = cases.filter((c) => c.requiereAtencion && c.estado !== "Concluido");

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Welcome & Community Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Juzgado de Paz · Distrito de Huasicancha (Junín)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Buenos días, Señora Jueza
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Resumen de actividades y expedientes para la jornada de hoy.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700">
          <ClockIcon className="size-4 text-amber-600" />
          <span>Miércoles 30 de septiembre de 2026</span>
        </div>
      </div>

      {/* Summary KPI Cards (Large, accessible, touch-friendly) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Casos en trámite */}
        <button
          onClick={() => setActiveTab("casos")}
          className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm hover:border-amber-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 transition-all min-h-[105px]"
        >
          <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Casos en trámite</span>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <ScaleIcon className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {casosEnTramite}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center">
              Ver lista <ArrowRightIcon className="size-3 ml-1" />
            </span>
          </div>
        </button>

        {/* Actuaciones pendientes */}
        <button
          onClick={() => setActiveTab("actuaciones")}
          className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm hover:border-amber-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 transition-all min-h-[105px]"
        >
          <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Actuaciones notariales</span>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <FileSignatureIcon className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {actuacionesPendientes}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              Ver trámites <ArrowRightIcon className="size-3 ml-1" />
            </span>
          </div>
        </button>

        {/* Actividades de hoy */}
        <button
          onClick={() => setActiveTab("agenda")}
          className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm hover:border-amber-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 transition-all min-h-[105px]"
        >
          <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Agenda de hoy</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <CalendarDaysIcon className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {actividadesHoy.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center">
              Revisar <ArrowRightIcon className="size-3 ml-1" />
            </span>
          </div>
        </button>

        {/* Pendientes de sincronizar */}
        <button
          onClick={() => setActiveTab("sincronizacion")}
          className={`flex flex-col justify-between rounded-2xl border p-4 text-left shadow-sm transition-all min-h-[105px] ${
            pendingSync > 0
              ? "border-amber-400 bg-amber-50/80 hover:bg-amber-100/80 dark:border-amber-800 dark:bg-amber-950/40"
              : "border-stone-200 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Por respaldar
            </span>
            <div
              className={`rounded-lg p-2 ${
                pendingSync > 0
                  ? "bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200"
                  : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
              }`}
            >
              <RefreshCwIcon className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {pendingSync}
            </span>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center">
              {pendingSync > 0 ? "Enviar ahora" : "Al día"} <ArrowRightIcon className="size-3 ml-1" />
            </span>
          </div>
        </button>
      </div>

      {/* D18 Section: ⚠ Casos que requieren atención */}
      {casesRequiringAttention.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/90 p-4 sm:p-5 dark:border-amber-700 dark:bg-amber-950/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500 text-stone-950">
                <AlertTriangleIcon className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-amber-950 dark:text-amber-100">
                  Casos que requieren atención hoy
                </h2>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Tienen fecha de atención fijada para hoy o llevan días sin avance registrado.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("casos")}
              className="text-xs font-bold text-amber-900 underline dark:text-amber-200 hover:text-amber-700"
            >
              Ver todos los casos
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {casesRequiringAttention.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl bg-white p-3 border border-amber-200 shadow-sm dark:bg-stone-900 dark:border-amber-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {c.codigo}
                    </span>
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      {c.materia}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 font-medium line-clamp-1">
                    {c.partes.map((p) => `${p.nombres} ${p.apellidos}`).join(" vs ")}
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                    📅 Próxima atención: {c.proximaFechaAtencion || "Sin fecha fija"}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("casos")}
                  className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 shrink-0"
                >
                  Atender
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* D11 Quick Action Buttons (At least 48px height for touch convenience) */}
      <div>
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3">
          Acciones directas para hoy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab("casos")}
            className="flex min-h-[54px] items-center gap-3 rounded-2xl bg-amber-600 px-4 py-3 text-white shadow hover:bg-amber-500 active:scale-95 transition-all text-left"
          >
            <PlusCircleIcon className="size-6 shrink-0" />
            <div>
              <span className="block text-sm font-bold">Registrar nuevo caso</span>
              <span className="block text-xs text-amber-100">Conflicto vecinal o tierras</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("actuaciones")}
            className="flex min-h-[54px] items-center gap-3 rounded-2xl bg-emerald-700 px-4 py-3 text-white shadow hover:bg-emerald-600 active:scale-95 transition-all text-left"
          >
            <FileSignatureIcon className="size-6 shrink-0" />
            <div>
              <span className="block text-sm font-bold">Registrar actuación</span>
              <span className="block text-xs text-emerald-100">Posesión, firmas o convivencia</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("agenda")}
            className="flex min-h-[54px] items-center gap-3 rounded-2xl bg-blue-700 px-4 py-3 text-white shadow hover:bg-blue-600 active:scale-95 transition-all text-left"
          >
            <CalendarDaysIcon className="size-6 shrink-0" />
            <div>
              <span className="block text-sm font-bold">Agendar actividad</span>
              <span className="block text-xs text-blue-100">Audiencia, reunión o visita</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("sincronizacion")}
            className="flex min-h-[54px] items-center gap-3 rounded-2xl bg-stone-800 px-4 py-3 text-white shadow hover:bg-stone-700 active:scale-95 transition-all text-left dark:bg-stone-700 dark:hover:bg-stone-600"
          >
            <RefreshCwIcon className="size-6 shrink-0 text-amber-400" />
            <div>
              <span className="block text-sm font-bold">Enviar datos al PJ</span>
              <span className="block text-xs text-stone-300">
                {pendingSync > 0 ? `${pendingSync} pendientes` : "Todo al día"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Today's Agenda Preview */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 dark:border-stone-800 dark:bg-stone-900 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="size-5 text-amber-600" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Compromisos programados
            </h2>
          </div>
          <button
            onClick={() => setActiveTab("agenda")}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center"
          >
            Abrir agenda completa <ArrowRightIcon className="size-3 ml-1" />
          </button>
        </div>

        <div className="space-y-3">
          {agenda.slice(0, 3).map((act) => (
            <div
              key={act.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-stone-50 p-3 border border-stone-200/80 dark:bg-stone-800/50 dark:border-stone-700/80"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mt-0.5">
                  <ClockIcon className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {act.titulo}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-500 dark:text-stone-400">
                    <span>
                      📅 {act.fecha} {act.horaInicio ? `· ${act.horaInicio} hrs` : ""}
                    </span>
                    <span>📍 {act.lugar}</span>
                  </div>
                </div>
              </div>

              <span className="self-start sm:self-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {act.estado}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
