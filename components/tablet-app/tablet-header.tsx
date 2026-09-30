"use client";

import React from "react";
import {
  BatteryMediumIcon,
  CheckCircle2Icon,
  EyeIcon,
  Maximize2Icon,
  Minimize2Icon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";

export function TabletHeader() {
  const {
    isOnline,
    offlineBanner,
    setOfflineBanner,
    lastSyncTime,
    getPendingSyncCount,
    viewPerspective,
    setViewPerspective,
    setActiveTab,
  } = useApp();

  const pendingCount = getPendingSyncCount();

  return (
    <header className="relative z-20 flex flex-col border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-sm">
      {/* Top Device Status Bar (Time, Battery, Wi-Fi, Sync status) */}
      <div className="flex h-10 items-center justify-between px-4 text-xs font-medium text-stone-600 dark:text-stone-300 bg-stone-100/90 dark:bg-stone-950/80">
        {/* Left: Device status */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-stone-800 dark:text-stone-200">09:45</span>
          <div className="flex items-center gap-1">
            {isOnline ? (
              <WifiIcon className="size-4 text-emerald-600" />
            ) : (
              <WifiOffIcon className="size-4 text-red-500 animate-pulse" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {isOnline ? "En línea" : "Sin conexión"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <BatteryMediumIcon className="size-4 text-stone-600 dark:text-stone-300" />
            <span className="text-[11px]">88%</span>
          </div>
        </div>

        {/* Center: D1 Fixed Connectivity & Pending Status Indicator */}
        <div className="flex items-center">
          {isOnline ? (
            <button
              onClick={() => setActiveTab("sincronizacion")}
              className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors border border-emerald-200 dark:border-emerald-800"
              title="Ver estado de respaldo en el Poder Judicial"
            >
              <CheckCircle2Icon className="size-3.5 text-emerald-600" />
              <span>
                {pendingCount > 0
                  ? `Con conexión · ${pendingCount} por enviar`
                  : `Con conexión · Todo respaldado (${lastSyncTime || "hoy"})`}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab("sincronizacion")}
              className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-200 transition-colors border border-amber-300 dark:border-amber-800 animate-pulse"
              title="Los datos están protegidos en la memoria de la tableta"
            >
              <span className="size-2 rounded-full bg-amber-600" />
              <span>
                Sin conexión · {pendingCount} {pendingCount === 1 ? "registro" : "registros"} en tableta
              </span>
            </button>
          )}
        </div>

        {/* Right: Camera / Perspective Switches */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewPerspective("office")}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            title="Mirar hacia los visitantes sentados en el escritorio"
          >
            <EyeIcon className="size-3.5 text-amber-700 dark:text-amber-400" />
            <span className="hidden md:inline">Mirar visitantes</span>
          </button>

          <button
            onClick={() =>
              setViewPerspective(
                viewPerspective === "fullscreen" ? "tablet" : "fullscreen"
              )
            }
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            title={
              viewPerspective === "fullscreen"
                ? "Volver al marco de tableta 10 pulgadas"
                : "Ampliar a toda la pantalla"
            }
          >
            {viewPerspective === "fullscreen" ? (
              <>
                <Minimize2Icon className="size-3.5" />
                <span className="hidden md:inline">Tableta 10&quot;</span>
              </>
            ) : (
              <>
                <Maximize2Icon className="size-3.5" />
                <span className="hidden md:inline">Ampliar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Non-intrusive Offline Toast Banner (Scene Central Requirement) */}
      {offlineBanner && !isOnline && (
        <div className="flex items-center justify-between bg-amber-500 px-4 py-2 text-stone-950 font-medium text-xs sm:text-sm shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <WifiOffIcon className="size-4 shrink-0" />
            <span>
              <strong>Se perdió la conexión.</strong> Puedes continuar: tus cambios se guardan de forma segura en esta tableta.
            </span>
          </div>
          <button
            onClick={() => setOfflineBanner(false)}
            className="rounded p-1 hover:bg-amber-600/30 transition-colors"
            aria-label="Cerrar aviso"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}
    </header>
  );
}
