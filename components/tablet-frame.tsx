"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { TabletHeader } from "./tablet-app/tablet-header";
import { TabletNav } from "./tablet-app/tablet-nav";
import { InicioTab } from "./tablet-app/inicio-tab";
import { CasosTab } from "./tablet-app/casos-tab";
import { ActuacionesTab } from "./tablet-app/actuaciones-tab";
import { AgendaTab } from "./tablet-app/agenda-tab";
import { SincronizacionTab } from "./tablet-app/sincronizacion-tab";
import { BuscarTab } from "./tablet-app/buscar-tab";
import { TabletLauncher } from "./tablet-launcher";

export function TabletFrame() {
  const {
    viewPerspective,
    tabletAppOpen,
    setTabletAppOpen,
    activeTab,
  } = useApp();

  const isFullscreen = viewPerspective === "fullscreen";

  return (
    <div
      className={`relative flex flex-1 items-center justify-center p-1 sm:p-4 transition-all duration-300 ${
        isFullscreen
          ? "w-full h-full p-0"
          : "max-w-6xl w-full mx-auto"
      }`}
    >
      {/* 10-Inch Tablet Chassis Frame (Bezels, Camera, Physical Home button) */}
      <div
        className={`relative flex flex-col overflow-hidden bg-stone-900 shadow-2xl transition-all duration-300 ${
          isFullscreen
            ? "w-full h-[calc(100vh-80px)] rounded-none border-0"
            : "w-full max-w-5xl h-[820px] rounded-[36px] border-[14px] border-stone-800 ring-1 ring-stone-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
        }`}
      >
        {/* Tablet Top Bezel: Camera & Ambient Sensor (hidden in fullscreen) */}
        {!isFullscreen && (
          <div className="flex h-5 shrink-0 items-center justify-center bg-stone-900">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-stone-800 ring-1 ring-stone-700" />
              <div className="size-2.5 rounded-full bg-stone-950 ring-1 ring-stone-800 flex items-center justify-center">
                <div className="size-1 rounded-full bg-blue-900/60" />
              </div>
            </div>
          </div>
        )}

        {/* Tablet Screen Content (1280x800 logical landscape area) */}
        <div className="relative flex flex-1 flex-col overflow-hidden bg-white dark:bg-stone-950">
          {!tabletAppOpen ? (
            /* Launcher / Home Screen */
            <TabletLauncher />
          ) : (
            /* "Mi jornada" App Inside Tablet */
            <div className="flex flex-1 flex-col overflow-hidden">
              <TabletHeader />

              <main className="flex flex-1 overflow-hidden">
                {activeTab === "inicio" && <InicioTab />}
                {activeTab === "casos" && <CasosTab />}
                {activeTab === "actuaciones" && <ActuacionesTab />}
                {activeTab === "agenda" && <AgendaTab />}
                {activeTab === "sincronizacion" && <SincronizacionTab />}
                {activeTab === "buscar" && <BuscarTab />}
              </main>

              <TabletNav />
            </div>
          )}
        </div>

        {/* Tablet Bottom Bezel: Physical/Virtual Home Button (D9, D16, SRS v2) */}
        {!isFullscreen && (
          <div className="flex h-8 shrink-0 items-center justify-center bg-stone-900">
            <button
              onClick={() => setTabletAppOpen(!tabletAppOpen)}
              className="group flex items-center gap-1.5 rounded-full px-4 py-1 hover:bg-stone-800 transition-colors"
              title={
                tabletAppOpen
                  ? "Botón Inicio: Salir a la pantalla de aplicaciones de la tableta"
                  : "Abrir 'Mi jornada'"
              }
            >
              <div className="size-3.5 rounded-full border-2 border-stone-600 group-hover:border-amber-400 group-hover:bg-amber-400/20 transition-colors" />
              <span className="text-[10px] font-bold text-stone-500 group-hover:text-amber-400 uppercase tracking-widest">
                {tabletAppOpen ? "Inicio tableta" : "Mi jornada"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
