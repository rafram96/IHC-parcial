"use client";

import React, { useState } from "react";
import {
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CompassIcon,
  EyeIcon,
  Maximize2Icon,
  RotateCcwIcon,
  SmartphoneIcon,
  SparklesIcon,
  WifiIcon,
  WifiOffIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { STORY_ACTS } from "@/lib/initial-data";

export function DemoControls() {
  const {
    isOnline,
    toggleOnline,
    viewPerspective,
    setViewPerspective,
    storyMode,
    setStoryMode,
    currentActIndex,
    setActIndex,
    setIsJustificationOpen,
    resetAllData,
  } = useApp();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  return (
    <header className="relative z-40 w-full border-b border-stone-800 bg-stone-950 text-stone-100 shadow-md">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-6">
        {/* Left: Branding & Role info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Controles de Demostración
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-stone-400">
            Juzgado de Paz · Tableta 10&quot;
          </span>
        </div>

        {/* Center: Story vs Free mode & Perspective */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg bg-stone-900 p-0.5 border border-stone-800">
            <button
              onClick={() => setStoryMode("story")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                storyMode === "story"
                  ? "bg-amber-600 text-white shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
              title="Recorrido guiado por los 5 acontecimientos de la jornada"
            >
              <SparklesIcon className="size-3.5" />
              <span>Vivir la jornada</span>
            </button>
            <button
              onClick={() => setStoryMode("free")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                storyMode === "free"
                  ? "bg-amber-600 text-white shadow"
                  : "text-stone-400 hover:text-stone-200"
              }`}
              title="Explorar libremente los módulos de la aplicación"
            >
              <CompassIcon className="size-3.5" />
              <span>Explorar libre</span>
            </button>
          </div>

          {/* Perspective View Switcher */}
          <div className="flex items-center rounded-lg bg-stone-900 p-0.5 border border-stone-800">
            <button
              onClick={() => setViewPerspective("office")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                viewPerspective === "office"
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:text-stone-200"
              }`}
              title="Vista en primera persona: Escritorio y visitantes"
            >
              <EyeIcon className="size-3.5" />
              <span className="hidden md:inline">Oficina</span>
            </button>
            <button
              onClick={() => setViewPerspective("tablet")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                viewPerspective === "tablet"
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:text-stone-200"
              }`}
              title="Enfocar pantalla de la tableta de 10 pulgadas"
            >
              <SmartphoneIcon className="size-3.5" />
              <span>Tableta 10&quot;</span>
            </button>
            <button
              onClick={() => setViewPerspective("fullscreen")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                viewPerspective === "fullscreen"
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:text-stone-200"
              }`}
              title="Ver aplicación en pantalla completa para evaluación en computadora"
            >
              <Maximize2Icon className="size-3.5" />
              <span className="hidden md:inline">Completa</span>
            </button>
          </div>
        </div>

        {/* Right: Network toggle, Justification, Reset */}
        <div className="flex items-center gap-2">
          {/* Internet Toggle */}
          <button
            onClick={() => toggleOnline()}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
              isOnline
                ? "border-emerald-600/60 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60"
                : "border-red-600/60 bg-red-950/80 text-red-300 hover:bg-red-900/80 animate-pulse"
            }`}
            title="Simula la pérdida o recuperación de Internet en la comunidad"
          >
            {isOnline ? (
              <>
                <WifiIcon className="size-3.5 text-emerald-400" />
                <span>Internet: Conectado</span>
              </>
            ) : (
              <>
                <WifiOffIcon className="size-3.5 text-red-400" />
                <span>Internet: Cortado</span>
              </>
            )}
          </button>

          {/* Design Justification Button */}
          <button
            onClick={() => setIsJustificationOpen(true)}
            className="flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-900/50 transition-colors"
            title="Ver los 20 fundamentos de diseño y rúbrica HCI"
          >
            <BookOpenIcon className="size-3.5 text-amber-400" />
            <span className="hidden sm:inline">Fundamentos</span>
          </button>

          {/* Reset Demo */}
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-900 px-2 py-1 text-xs text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition-colors"
            title="Reiniciar jornada y datos de prueba"
          >
            <RotateCcwIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Story Act Stepper (only visible when in story mode) */}
      {storyMode === "story" && (
        <div className="border-t border-stone-900 bg-stone-900/80 px-4 py-2">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                Paso {currentActIndex + 1} de {STORY_ACTS.length}
              </span>
              <span className="text-xs font-semibold text-stone-200">
                {STORY_ACTS[currentActIndex].title}
              </span>
              <span className="hidden lg:inline text-xs text-stone-400">
                — {STORY_ACTS[currentActIndex].subtitle}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (currentActIndex > 0) setActIndex(currentActIndex - 1);
                }}
                disabled={currentActIndex === 0}
                className="flex items-center gap-0.5 rounded px-2 py-0.5 text-xs text-stone-300 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeftIcon className="size-3.5" /> Anterior
              </button>
              <div className="flex items-center gap-1 px-1">
                {STORY_ACTS.map((act, idx) => (
                  <button
                    key={act.id}
                    onClick={() => setActIndex(idx)}
                    className={`size-2.5 rounded-full transition-all ${
                      idx === currentActIndex
                        ? "bg-amber-400 scale-125"
                        : "bg-stone-700 hover:bg-stone-500"
                    }`}
                    title={act.title}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  if (currentActIndex < STORY_ACTS.length - 1) {
                    setActIndex(currentActIndex + 1);
                  }
                }}
                disabled={currentActIndex === STORY_ACTS.length - 1}
                className="flex items-center gap-0.5 rounded px-2 py-0.5 text-xs text-stone-300 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                Siguiente <ChevronRightIcon className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-stone-700 bg-stone-900 p-6 text-stone-100 shadow-xl">
            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <RotateCcwIcon className="size-5" />
              ¿Reiniciar la demostración?
            </h3>
            <p className="mt-3 text-sm text-stone-300">
              Esta acción restablecerá los datos de prueba a su estado original (casos, actuaciones y agenda) y reiniciará el recorrido guiado en el Acto 1.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-stone-400 hover:bg-stone-800 hover:text-stone-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setConfirmResetOpen(false);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Sí, reiniciar datos
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
