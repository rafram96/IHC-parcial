"use client";

import React, { useState } from "react";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  PlusCircleIcon,
  ScaleIcon,
  UsersIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { ActividadAgenda, TipoActividad } from "@/lib/types";

export function AgendaTab() {
  const { agenda, addActividad, updateActividad, cases, setActiveTab } = useApp();

  // Current view: "calendario" (Calendar grid) or "detalles" (Day details)
  const [currentView, setCurrentView] = useState<"calendario" | "detalles">("calendario");

  // Selected date in YYYY-MM-DD format (defaults to the demo day: 2026-09-30)
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-30");

  // Calendar month navigation (Year 2026, Month 8 = September, 9 = October)
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(8); // 8 is September (0-indexed)

  // New Activity Modal State
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [titulo, setTitulo] = useState<string>("");
  const [tipo, setTipo] = useState<TipoActividad>("Audiencia");
  const [fecha, setFecha] = useState<string>("2026-09-30");
  const [horaInicio, setHoraInicio] = useState<string>("10:00");
  const [horaFin, setHoraFin] = useState<string>("11:30");
  const [lugar, setLugar] = useState<string>("Despacho del Juzgado de Paz de Huasicancha");
  const [motivo, setMotivo] = useState<string>("");
  const [casoVinculadoId, setCasoVinculadoId] = useState<string>("");

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const tiposVisuales: Record<
    TipoActividad,
    { colorBg: string; colorBorder: string; colorText: string; icon: React.ElementType }
  > = {
    Audiencia: {
      colorBg: "bg-blue-100 dark:bg-blue-950/60",
      colorBorder: "border-blue-300 dark:border-blue-800",
      colorText: "text-blue-900 dark:text-blue-200",
      icon: ScaleIcon,
    },
    Reunión: {
      colorBg: "bg-emerald-100 dark:bg-emerald-950/60",
      colorBorder: "border-emerald-300 dark:border-emerald-800",
      colorText: "text-emerald-900 dark:text-emerald-200",
      icon: UsersIcon,
    },
    Visita: {
      colorBg: "bg-amber-100 dark:bg-amber-950/60",
      colorBorder: "border-amber-300 dark:border-amber-800",
      colorText: "text-amber-900 dark:text-amber-200",
      icon: MapPinIcon,
    },
    Otra: {
      colorBg: "bg-stone-100 dark:bg-stone-800",
      colorBorder: "border-stone-300 dark:border-stone-700",
      colorText: "text-stone-900 dark:text-stone-200",
      icon: CalendarDaysIcon,
    },
  };

  // Build days for month grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday = 0

  const calendarDays: { dayNum: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Padding days from previous month
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dateStr = `${prevY}-${String(prevM + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarDays.push({ dayNum: day, dateStr, isCurrentMonth: false });
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarDays.push({ dayNum: day, dateStr, isCurrentMonth: true });
  }

  // Padding days to fill remaining week grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    const dateStr = `${nextY}-${String(nextM + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarDays.push({ dayNum: day, dateStr, isCurrentMonth: false });
  }

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (dateStr: string) => {
    setSelectedDate(dateStr);
    setCurrentView("detalles");
  };

  const handleCreateActivity = () => {
    const newAct: ActividadAgenda = {
      id: `ACT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      titulo,
      tipo,
      fecha,
      horaInicio,
      horaFin,
      lugar,
      motivo,
      estado: "Programada",
      casoVinculadoId: casoVinculadoId || undefined,
      syncEstado: "local",
      updatedAt: new Date().toISOString(),
    };
    addActividad(newAct);
    setShowNewModal(false);
    setTitulo("");
    setMotivo("");
  };

  // Selected date formatted in Spanish
  const [sYear, sMonth, sDay] = selectedDate.split("-").map(Number);
  const selectedDateObj = new Date(sYear, sMonth - 1, sDay);
  const dayNameFormatted = selectedDateObj.toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activitiesOnSelectedDate = agenda.filter((a) => a.fecha === selectedDate);

  // Navigate to previous/next day in details view
  const handleShiftDay = (delta: number) => {
    const d = new Date(sYear, sMonth - 1, sDay + delta);
    const newDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setSelectedDate(newDateStr);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-stone-50 dark:bg-stone-950">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow">
            <CalendarDaysIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Agenda Judicial Comunal
            </h1>
            <p className="text-xs text-stone-500">
              {currentView === "calendario"
                ? "Selecciona un día en el calendario para ver sus actividades en detalle"
                : `Mostrando compromisos para el ${dayNameFormatted}`}
            </p>
          </div>
        </div>

        {/* View Switcher: Calendario vs Detalles */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-stone-100 p-1 dark:bg-stone-800">
            <button
              onClick={() => setCurrentView("calendario")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all min-h-[36px] ${
                currentView === "calendario"
                  ? "bg-white text-stone-900 shadow dark:bg-stone-900 dark:text-stone-100"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400"
              }`}
            >
              <CalendarDaysIcon className="size-3.5 text-blue-600" />
              <span>Calendario</span>
            </button>
            <button
              onClick={() => setCurrentView("detalles")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all min-h-[36px] ${
                currentView === "detalles"
                  ? "bg-white text-stone-900 shadow dark:bg-stone-900 dark:text-stone-100"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400"
              }`}
            >
              <ClockIcon className="size-3.5 text-amber-600" />
              <span>Detalles del día</span>
            </button>
          </div>

          <button
            onClick={() => {
              setFecha(selectedDate);
              setShowNewModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-600 min-h-[44px]"
          >
            <PlusCircleIcon className="size-4" />
            <span className="hidden sm:inline">Nueva actividad</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {/* ============================================================== */}
        {/* 1. VISTA CALENDARIO MENSUAL                                    */}
        {/* ============================================================== */}
        {currentView === "calendario" && (
          <div className="mx-auto max-w-5xl space-y-4">
            {/* Month & Year Navigation Bar */}
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="flex size-10 items-center justify-center rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  title="Mes anterior"
                >
                  <ChevronLeftIcon className="size-5" />
                </button>
                <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
                  {monthNames[viewMonth]} {viewYear}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="flex size-10 items-center justify-center rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  title="Mes siguiente"
                >
                  <ChevronRightIcon className="size-5" />
                </button>
              </div>

              {/* Legend with Redundant Visual Coding (D14) */}
              <div className="hidden md:flex items-center gap-3 text-xs font-semibold text-stone-600 dark:text-stone-400">
                <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                  <ScaleIcon className="size-3.5" /> Audiencia
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <UsersIcon className="size-3.5" /> Reunión
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                  <MapPinIcon className="size-3.5" /> Visita
                </span>
              </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="rounded-2xl border border-stone-200 bg-white p-3 sm:p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-stone-500 py-2 border-b border-stone-100 dark:border-stone-800">
                <span>Lunes</span>
                <span>Martes</span>
                <span>Miércoles</span>
                <span>Jueves</span>
                <span>Viernes</span>
                <span>Sábado</span>
                <span>Domingo</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-2">
                {calendarDays.map((item) => {
                  const dayActivities = agenda.filter((a) => a.fecha === item.dateStr);
                  const isToday = item.dateStr === "2026-09-30";
                  const isSelected = item.dateStr === selectedDate;

                  return (
                    <button
                      key={item.dateStr}
                      onClick={() => handleSelectDay(item.dateStr)}
                      className={`group relative flex min-h-[95px] sm:min-h-[110px] flex-col justify-between rounded-xl p-2 text-left transition-all border ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/40 dark:bg-blue-950/20"
                          : isToday
                          ? "border-amber-400 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/20 shadow-sm"
                          : item.isCurrentMonth
                          ? "border-stone-200 bg-white hover:border-amber-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
                          : "border-stone-100 bg-stone-50/50 text-stone-400 opacity-60 dark:border-stone-800/40 dark:bg-stone-900/30"
                      }`}
                    >
                      {/* Day number header */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                            isToday
                              ? "bg-amber-500 text-stone-950 font-black shadow"
                              : isSelected
                              ? "bg-blue-600 text-white font-bold"
                              : item.isCurrentMonth
                              ? "text-stone-900 dark:text-stone-100 font-semibold"
                              : "text-stone-400"
                          }`}
                        >
                          {item.dayNum}
                        </span>

                        {isToday && (
                          <span className="hidden sm:inline text-[9px] font-black uppercase text-amber-700 dark:text-amber-400">
                            HOY
                          </span>
                        )}

                        {dayActivities.length > 0 && (
                          <span className="rounded-full bg-stone-200 px-1.5 py-0.2 text-[10px] font-bold text-stone-800 dark:bg-stone-700 dark:text-stone-200">
                            {dayActivities.length}
                          </span>
                        )}
                      </div>

                      {/* Event pills on the day */}
                      <div className="w-full space-y-1 my-1">
                        {dayActivities.slice(0, 2).map((act) => {
                          const visual = tiposVisuales[act.tipo];
                          return (
                            <div
                              key={act.id}
                              className={`truncate rounded px-1.5 py-0.5 text-[10px] font-bold ${visual.colorBg} ${visual.colorText} border ${visual.colorBorder}`}
                              title={`${act.horaInicio || ""} ${act.titulo}`}
                            >
                              {act.tipo === "Audiencia"
                                ? "⚖ "
                                : act.tipo === "Reunión"
                                ? "👥 "
                                : "📍 "}
                              {act.titulo}
                            </div>
                          );
                        })}
                        {dayActivities.length > 2 && (
                          <span className="block text-[9px] font-bold text-stone-500">
                            +{dayActivities.length - 2} más…
                          </span>
                        )}
                      </div>

                      {/* Click prompt */}
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                        Ver detalles →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. VISTA DETALLES DEL DÍA SELECCIONADO                         */}
        {/* ============================================================== */}
        {currentView === "detalles" && (
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Return to Calendar & Day Navigation Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <button
                onClick={() => setCurrentView("calendario")}
                className="flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 min-h-[44px]"
              >
                <ArrowLeftIcon className="size-4 text-blue-600" />
                <span>Volver al calendario mensual</span>
              </button>

              {/* Day shifting buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShiftDay(-1)}
                  className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300"
                >
                  <ChevronLeftIcon className="size-4" /> Día anterior
                </button>
                <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100 px-2">
                  {selectedDate}
                </span>
                <button
                  onClick={() => handleShiftDay(1)}
                  className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300"
                >
                  Día siguiente <ChevronRightIcon className="size-4" />
                </button>
              </div>
            </div>

            {/* Date Details Card Header */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                      Detalle de compromisos
                    </span>
                    {selectedDate === "2026-09-30" && (
                      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-stone-950">
                        HOY
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black capitalize text-stone-900 dark:text-stone-100 mt-1">
                    {dayNameFormatted}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-stone-100 px-3 py-2 text-xs font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    {activitiesOnSelectedDate.length}{" "}
                    {activitiesOnSelectedDate.length === 1 ? "actividad" : "actividades"} programadas
                  </span>

                  <button
                    onClick={() => {
                      setFecha(selectedDate);
                      setShowNewModal(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-blue-600 min-h-[40px]"
                  >
                    <PlusCircleIcon className="size-4" />
                    <span>Agregar actividad</span>
                  </button>
                </div>
              </div>

              {/* Activities List on Selected Date */}
              {activitiesOnSelectedDate.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {activitiesOnSelectedDate.map((act) => {
                    const visual = tiposVisuales[act.tipo];
                    const Icon = visual.icon;

                    return (
                      <div
                        key={act.id}
                        className={`rounded-2xl border p-4 sm:p-5 shadow-sm transition-all ${visual.colorBg} ${visual.colorBorder}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3 mb-3 dark:border-white/10">
                          {/* Type + Icon + Text (D14) */}
                          <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-lg bg-white/80 dark:bg-black/40 shadow-sm">
                              <Icon className="size-4 text-stone-800 dark:text-stone-100" />
                            </span>
                            <span className="font-extrabold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                              {act.tipo}
                            </span>
                          </div>

                          {/* Time Badge */}
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-stone-900 shadow-sm dark:bg-black/50 dark:text-stone-100">
                              <ClockIcon className="size-3.5 text-blue-700" />
                              {act.horaInicio} - {act.horaFin || "término"}
                            </span>

                            {/* Status */}
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                act.estado === "Programada"
                                  ? "bg-blue-200/80 text-blue-950 dark:bg-blue-900 dark:text-blue-100"
                                  : act.estado === "Realizada"
                                  ? "bg-emerald-200/80 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-100"
                                  : "bg-red-200/80 text-red-950 line-through dark:bg-red-900 dark:text-red-100"
                              }`}
                            >
                              {act.estado}
                            </span>
                          </div>
                        </div>

                        {/* Activity details */}
                        <div className="space-y-2">
                          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                            {act.titulo}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-700 dark:text-stone-300">
                            <p className="flex items-center gap-1.5">
                              <MapPinIcon className="size-4 text-stone-500" />
                              <strong>Lugar:</strong> {act.lugar}
                            </p>

                            {act.casoVinculadoId && (
                              <button
                                onClick={() => setActiveTab("casos")}
                                className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400 hover:underline"
                              >
                                <ScaleIcon className="size-4" />
                                <span>Ver expediente: {act.casoVinculadoId}</span>
                              </button>
                            )}
                          </div>

                          {act.motivo && (
                            <div className="mt-2 rounded-xl bg-white/60 p-3 text-xs text-stone-800 dark:bg-black/30 dark:text-stone-200">
                              <strong className="block text-[11px] uppercase tracking-wider text-stone-500 mb-0.5">
                                Motivo o agenda de la cita:
                              </strong>
                              {act.motivo}
                            </div>
                          )}
                        </div>

                        {/* Actions for this activity */}
                        <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-stone-500">
                            {act.syncEstado === "local" ? "⏳ En tableta" : "✓ Respaldada formalmente"}
                          </span>

                          <div className="flex items-center gap-2">
                            {act.estado !== "Realizada" && (
                              <button
                                onClick={() =>
                                  updateActividad(act.id, { estado: "Realizada" })
                                }
                                className="flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-600"
                              >
                                <CheckCircle2Icon className="size-3.5" />
                                <span>Marcar como realizada</span>
                              </button>
                            )}
                            {act.estado !== "Cancelada" && (
                              <button
                                onClick={() =>
                                  updateActividad(act.id, { estado: "Cancelada" })
                                }
                                className="flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-100 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300"
                              >
                                <XCircleIcon className="size-3.5" />
                                <span>Cancelar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="my-8 rounded-2xl border-2 border-dashed border-stone-200 p-8 text-center dark:border-stone-800">
                  <CalendarDaysIcon className="mx-auto size-12 text-stone-300 dark:text-stone-700 mb-2" />
                  <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                    No hay compromisos programados para este día
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 max-w-md mx-auto">
                    La jueza no tiene audiencias, visitas oculares ni asambleas registradas en esta fecha.
                  </p>
                  <button
                    onClick={() => {
                      setFecha(selectedDate);
                      setShowNewModal(true);
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-600"
                  >
                    <PlusCircleIcon className="size-4" />
                    <span>Programar actividad en esta fecha</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: NUEVA ACTIVIDAD EN LA AGENDA                            */}
      {/* ============================================================== */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 dark:border-stone-800">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                Programar nueva actividad en la Agenda
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Título del compromiso <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Audiencia de conciliación de linderos..."
                className="w-full rounded-xl border border-stone-300 p-2.5 text-sm dark:border-stone-700 dark:bg-stone-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Tipo de actividad
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoActividad)}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm dark:border-stone-700 dark:bg-stone-800"
                >
                  <option value="Audiencia">Audiencia (⚖)</option>
                  <option value="Reunión">Reunión (👥)</option>
                  <option value="Visita">Visita / Inspección (📍)</option>
                  <option value="Otra">Otra actividad (📌)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm dark:border-stone-700 dark:bg-stone-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Hora de inicio
                </label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm dark:border-stone-700 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Hora de término
                </label>
                <input
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm dark:border-stone-700 dark:bg-stone-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Lugar o comunidad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                placeholder="Ej. Despacho del Juzgado de Paz o Local Comunal..."
                className="w-full rounded-xl border border-stone-300 p-2.5 text-sm dark:border-stone-700 dark:bg-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Vincular a expediente judicial (Opcional)
              </label>
              <select
                value={casoVinculadoId}
                onChange={(e) => setCasoVinculadoId(e.target.value)}
                className="w-full rounded-xl border border-stone-300 p-2.5 text-sm dark:border-stone-700 dark:bg-stone-800"
              >
                <option value="">Ninguno (Actividad comunal independiente)</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} · {c.materia} ({c.partes[0]?.nombres} {c.partes[0]?.apellidos})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setShowNewModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancelar
              </button>
              <button
                disabled={!titulo.trim() || !fecha || !lugar.trim()}
                onClick={handleCreateActivity}
                className="rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-600 disabled:opacity-40"
              >
                Guardar en la agenda ⏳
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
