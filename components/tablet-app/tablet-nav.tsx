"use client";

import React from "react";
import {
  CalendarDaysIcon,
  FileSignatureIcon,
  HomeIcon,
  RefreshCwIcon,
  ScaleIcon,
  SearchIcon,
} from "lucide-react";
import { TabKey, useApp } from "@/lib/context";

export function TabletNav() {
  const {
    activeTab,
    setActiveTab,
    getPendingSyncCount,
    getRequiereAtencionCount,
  } = useApp();

  const pendingSync = getPendingSyncCount();
  const requireAttention = getRequiereAtencionCount();

  const navItems: { key: TabKey; label: string; icon: React.ElementType; badge?: React.ReactNode }[] = [
    { key: "inicio", label: "Inicio", icon: HomeIcon },
    {
      key: "casos",
      label: "Casos",
      icon: ScaleIcon,
      badge:
        requireAttention > 0 ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-stone-950 shadow">
            {requireAttention}
          </span>
        ) : null,
    },
    { key: "actuaciones", label: "Actuaciones", icon: FileSignatureIcon },
    { key: "agenda", label: "Agenda", icon: CalendarDaysIcon },
    {
      key: "sincronizacion",
      label: "Sincronización",
      icon: RefreshCwIcon,
      badge:
        pendingSync > 0 ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-stone-950 shadow">
            {pendingSync}
          </span>
        ) : null,
    },
    { key: "buscar", label: "Buscar", icon: SearchIcon },
  ];

  return (
    <nav className="z-10 flex shrink-0 border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/90 shadow-md">
      <div className="mx-auto flex w-full max-w-4xl justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              // Touch target at least 48px high, clear visual feedback
              className={`relative flex min-h-[52px] min-w-[56px] flex-col items-center justify-center rounded-xl px-2 py-1 transition-all ${
                isActive
                  ? "bg-amber-600/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 font-bold scale-105"
                  : "text-stone-600 hover:bg-stone-200/60 dark:text-stone-400 dark:hover:bg-stone-800"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`size-6 transition-transform ${
                    isActive ? "stroke-[2.5px] text-amber-700 dark:text-amber-400" : ""
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3">{item.badge}</span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 h-1 w-8 rounded-full bg-amber-600 dark:bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
