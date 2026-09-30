"use client";

import React from "react";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MessageSquareIcon,
  SmartphoneIcon,
  SparklesIcon,
  WifiOffIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";

export function OfficeView() {
  const {
    currentAct,
    dialogIndex,
    nextDialog,
    prevDialog,
    setViewPerspective,
    setTabletAppOpen,
    setActiveTab,
    isOnline,
    currentActIndex,
  } = useApp();

  const currentDialog = currentAct.dialogs[dialogIndex] || currentAct.dialogs[0];

  const handleOpenTablet = () => {
    setViewPerspective("tablet");
    setTabletAppOpen(true);
    setActiveTab(currentAct.targetModule);
  };

  return (
    <div className="relative flex flex-1 flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-amber-950/20 via-stone-900 to-stone-950 p-2 sm:p-6 min-h-[calc(100vh-80px)]">
      {/* Background Room Atmosphere: Andean landscape window, adobe wall, court coat of arms */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {/* Soft daylight gradient from window */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-sky-400/20 via-amber-200/10 to-transparent blur-3xl" />
      </div>

      {/* Wall Decor & Office Elements */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between px-4 py-2 text-stone-300">
        <div className="flex items-center gap-2 rounded-lg bg-stone-900/80 px-3 py-1.5 border border-stone-800 shadow">
          <div className="size-2 rounded-full bg-amber-500 animate-ping" />
          <span className="text-xs font-semibold text-amber-200">
            Despacho del Juzgado de Paz · Huasicancha
          </span>
        </div>

        {!isOnline && (
          <div className="flex items-center gap-2 rounded-lg bg-red-950/80 border border-red-700/60 px-3 py-1.5 text-xs text-red-200 shadow animate-bounce">
            <WifiOffIcon className="size-4 text-red-400" />
            <span>Sin señal de antena repetidora en la comunidad</span>
          </div>
        )}
      </div>

      {/* Visitors Area (Middle Section) */}
      <div className="relative z-10 my-auto flex w-full max-w-4xl flex-col items-center justify-center">
        {/* Visitor Illustration & Character presentation */}
        <div className="relative flex items-end justify-center gap-8 mb-4">
          {/* Character 1 */}
          <div className="flex flex-col items-center transition-transform hover:scale-105 duration-300">
            <div className="relative size-32 sm:size-40 rounded-full border-4 border-amber-900/60 bg-gradient-to-t from-stone-800 via-amber-950/60 to-stone-700 p-2 shadow-2xl flex flex-col items-center justify-end overflow-hidden">
              {/* Silhouette / Respectful Stylized Avatar */}
              <div className="w-20 sm:w-24 h-24 sm:h-28 rounded-t-full bg-stone-300/80 dark:bg-stone-300 flex flex-col items-center pt-2 shadow-inner">
                {/* Traditional Andean Hat / Chullo detail */}
                <div className="w-14 sm:w-16 h-8 bg-amber-800 rounded-t-lg -mt-1 shadow-sm border-b-2 border-amber-950 flex items-center justify-center">
                  <div className="w-8 h-1 bg-amber-400 rounded-full" />
                </div>
                {/* Face & poncho */}
                <div className="size-9 bg-amber-200/90 rounded-full mt-1 border border-amber-300/50" />
                <div className="w-full h-12 bg-amber-900 mt-1 rounded-t-md border-t border-amber-600" />
              </div>
            </div>
            <span className="mt-2 text-xs font-bold text-amber-200 bg-stone-900/90 px-2.5 py-0.5 rounded-full border border-stone-700">
              {currentActIndex === 0 || currentActIndex === 3
                ? "Don Faustino Quispe"
                : currentActIndex === 1
                ? "Doña Gregoria Condori"
                : "Don Eloy Huamán"}
            </span>
          </div>

          {/* Character 2 (if present in Act 1 / Act 4) */}
          {(currentActIndex === 0 || currentActIndex === 3) && (
            <div className="flex flex-col items-center transition-transform hover:scale-105 duration-300">
              <div className="relative size-32 sm:size-40 rounded-full border-4 border-amber-900/60 bg-gradient-to-t from-stone-800 via-amber-950/60 to-stone-700 p-2 shadow-2xl flex flex-col items-center justify-end overflow-hidden">
                <div className="w-20 sm:w-24 h-24 sm:h-28 rounded-t-full bg-stone-300/80 dark:bg-stone-300 flex flex-col items-center pt-2 shadow-inner">
                  {/* Traditional Sombrero andino */}
                  <div className="w-16 sm:w-18 h-7 bg-stone-800 rounded-full -mt-1 shadow-sm border border-stone-900" />
                  <div className="size-9 bg-amber-200/90 rounded-full mt-1 border border-amber-300/50" />
                  {/* Manta colorida */}
                  <div className="w-full h-12 bg-rose-800 mt-1 rounded-t-md border-t border-rose-500" />
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-amber-200 bg-stone-900/90 px-2.5 py-0.5 rounded-full border border-stone-700">
                Doña Bertha Mamani
              </span>
            </div>
          )}
        </div>

        {/* Dialogue Bubble */}
        <div className="w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-stone-900/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <MessageSquareIcon className="size-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-300">
                {currentDialog.speaker}
              </span>
              <span className="text-xs text-stone-400">
                ({currentDialog.role})
              </span>
            </div>
            <span className="text-[11px] text-stone-500">
              Diálogo {dialogIndex + 1} de {currentAct.dialogs.length}
            </span>
          </div>

          <p className="text-base sm:text-lg font-medium text-stone-100 leading-relaxed italic">
            &ldquo;{currentDialog.text}&rdquo;
          </p>

          {currentDialog.hint && (
            <div className="mt-3 rounded-lg bg-amber-950/40 border border-amber-800/40 p-2.5 text-xs text-amber-200/90 flex items-start gap-2">
              <SparklesIcon className="size-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold">
                  Información clave para la atención:
                </strong>{" "}
                {currentDialog.hint}
              </div>
            </div>
          )}

          {currentDialog.actionPrompt && (
            <div className="mt-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 p-2.5 text-xs text-emerald-200 flex items-start gap-2">
              <ArrowRightIcon className="size-4 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <strong className="text-emerald-300 font-semibold">
                  Paso sugerido en la tableta:
                </strong>{" "}
                {currentDialog.actionPrompt}
              </div>
            </div>
          )}

          {/* Dialogue Stepper Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-800 pt-3">
            <div className="flex items-center gap-1">
              <button
                onClick={prevDialog}
                disabled={dialogIndex === 0}
                className="flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-950 px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-800 disabled:opacity-40"
              >
                <ChevronLeftIcon className="size-3.5" /> Anterior
              </button>
              <button
                onClick={nextDialog}
                className="flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-950 px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-800"
              >
                Siguiente diálogo <ChevronRightIcon className="size-3.5" />
              </button>
            </div>

            <button
              onClick={handleOpenTablet}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-amber-500 transition-all transform hover:scale-105 active:scale-95"
            >
              <SmartphoneIcon className="size-4" />
              <span>Mirar a la tableta y atender</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wooden Desk Foreground (First person perspective) */}
      <div className="relative z-20 w-full max-w-5xl rounded-t-3xl border-t-4 border-amber-900 bg-gradient-to-b from-[#4a2e18] via-[#352010] to-[#20140a] p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Desk props: Folders, court seal, mate cup */}
        <div className="flex items-center gap-4 text-amber-200/80 text-xs">
          <div className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-2 border border-amber-800/40">
            <div className="size-3 rounded-full bg-red-600" />
            <span className="font-semibold text-amber-100">
              Sello del Juzgado de Paz
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-2 border border-amber-800/40">
            <span>☕ Mate de muña tibio</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-2 border border-amber-800/40">
            <span>📁 Expedientes en trámite 2026</span>
          </div>
        </div>

        {/* 10-Inch Tablet on the Desk: Interactive Click to Zoom In */}
        <button
          onClick={handleOpenTablet}
          className="group relative flex items-center gap-3 rounded-2xl border-2 border-amber-500/80 bg-stone-900 px-5 py-3 shadow-2xl hover:border-amber-400 hover:bg-stone-800 transition-all transform hover:-translate-y-1"
        >
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow">
            <SmartphoneIcon className="size-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-3 bg-amber-500"></span>
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white group-hover:text-amber-300">
                Tableta 10&quot; de la Jueza
              </span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                Tocar para acercar
              </span>
            </div>
            <p className="text-xs text-stone-400">
              App &ldquo;Mi jornada&rdquo; lista para operar
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
