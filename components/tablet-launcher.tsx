"use client";

import React from "react";
import {
  CameraIcon,
  CalculatorIcon,
  FolderIcon,
  LandmarkIcon,
  ScaleIcon,
  SunIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";

export function TabletLauncher() {
  const { setTabletAppOpen, getPendingSyncCount, getRequiereAtencionCount } =
    useApp();
  const pendingSync = getPendingSyncCount();
  const requireAttention = getRequiereAtencionCount();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-between overflow-hidden bg-gradient-to-br from-sky-800 via-teal-900 to-stone-900 p-6 text-white select-none">
      {/* Decorative mountain landscape overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-black/60 pointer-events-none" />

      {/* Top Tablet Widget: Time, Date & Weather in Huasicancha */}
      <div className="relative z-10 mt-8 flex flex-col items-center text-center">
        <div className="text-5xl sm:text-6xl font-extralight tracking-tight drop-shadow-md">
          09:42
        </div>
        <div className="mt-1 text-base sm:text-lg font-medium text-sky-100 drop-shadow">
          Miércoles, 30 de septiembre de 2026
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs text-sky-200 backdrop-blur-sm">
          <SunIcon className="size-4 text-amber-300" />
          <span>Huasicancha · 14°C Despejado</span>
        </div>
      </div>

      {/* Main Apps Grid */}
      <div className="relative z-10 my-auto grid grid-cols-3 sm:grid-cols-4 gap-6 sm:gap-8 max-w-lg">
        {/* "Mi jornada" App Icon - Highlighted! */}
        <button
          onClick={() => setTabletAppOpen(true)}
          className="group flex flex-col items-center gap-2 focus:outline-none"
        >
          <div className="relative flex size-18 sm:size-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 shadow-xl group-hover:scale-110 group-active:scale-95 transition-all border-2 border-white/40">
            <ScaleIcon className="size-10 text-white drop-shadow" />
            {/* Badge for attention or pending sync */}
            {(pendingSync > 0 || requireAttention > 0) && (
              <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white shadow-md border-2 border-white">
                {pendingSync + requireAttention}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-white drop-shadow group-hover:text-amber-200">
            Mi jornada
          </span>
        </button>

        {/* Cámara */}
        <button
          onClick={() => alert("Cámara de la tableta: disponible para adjuntar fotografías de acuerdos físicos.")}
          className="group flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
        >
          <div className="flex size-18 sm:size-20 items-center justify-center rounded-2xl bg-stone-700/80 shadow-md group-hover:scale-105 transition-transform border border-white/20">
            <CameraIcon className="size-9 text-white" />
          </div>
          <span className="text-xs font-medium text-stone-200 drop-shadow">
            Cámara
          </span>
        </button>

        {/* Archivos */}
        <button
          onClick={() => alert("Archivos locales: la persistencia se gestiona automáticamente en la memoria de la tableta.")}
          className="group flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
        >
          <div className="flex size-18 sm:size-20 items-center justify-center rounded-2xl bg-stone-700/80 shadow-md group-hover:scale-105 transition-transform border border-white/20">
            <FolderIcon className="size-9 text-sky-300" />
          </div>
          <span className="text-xs font-medium text-stone-200 drop-shadow">
            Archivos
          </span>
        </button>

        {/* Calculadora */}
        <button
          onClick={() => alert("Calculadora disponible para liquidaciones o deudas en conciliación.")}
          className="group flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
        >
          <div className="flex size-18 sm:size-20 items-center justify-center rounded-2xl bg-stone-700/80 shadow-md group-hover:scale-105 transition-transform border border-white/20">
            <CalculatorIcon className="size-9 text-emerald-300" />
          </div>
          <span className="text-xs font-medium text-stone-200 drop-shadow">
            Calculadora
          </span>
        </button>
      </div>

      {/* Instructions Prompt at Bottom */}
      <div className="relative z-10 mb-4 rounded-xl bg-black/40 px-4 py-2 text-xs text-sky-100 backdrop-blur-md border border-white/10 flex items-center gap-2 animate-pulse">
        <LandmarkIcon className="size-4 text-amber-300" />
        <span>Toca el icono <strong>&ldquo;Mi jornada&rdquo;</strong> para ingresar al sistema judicial</span>
      </div>
    </div>
  );
}
