"use client";

import React, { useState } from "react";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  InfoIcon,
  SearchIcon,
  ShieldAlertIcon,
  SmartphoneIcon,
  WifiOffIcon,
  XIcon,
} from "lucide-react";
import { DESIGN_JUSTIFICATIONS } from "@/lib/initial-data";
import { JustificationItem } from "@/lib/types";

interface JustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JustificationModal({ isOpen, onClose }: JustificationModalProps) {
  const [filterCat, setFilterCat] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (!isOpen) return null;

  const categories = [
    "Todas",
    "Heurísticas",
    "Factores Humanos",
    "Sin Conexión",
    "Prevención de Errores",
  ];

  const filtered = DESIGN_JUSTIFICATIONS.filter((item: JustificationItem) => {
    const matchesCat = filterCat === "Todas" || item.categoria === filterCat;
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.decision.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fundamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.necesidad.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-6 py-4 dark:border-stone-800 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm">
              <BookOpenIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Fundamento de Diseño (HCI / Rúbrica)
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Estructura: Decisión de interfaz ➔ Fundamento (Nielsen / Factores Humanos) ➔ Necesidad que atiende
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="rounded-full p-2 text-stone-500 hover:bg-stone-200 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <XIcon className="size-6" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 border-b border-stone-200 bg-stone-100/60 p-4 dark:border-stone-800 dark:bg-stone-900/60">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por código (ej. D1, D16), principio o necesidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-amber-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  filterCat === cat
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                    : "bg-white text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of Justifications */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-stone-200 bg-stone-50/50 p-4 hover:border-amber-400 dark:border-stone-800 dark:bg-stone-950/50 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                      {item.code}
                    </span>
                    <span className="text-xs font-medium text-stone-500 flex items-center gap-1">
                      {item.categoria === "Sin Conexión" && <WifiOffIcon className="size-3 text-amber-600" />}
                      {item.categoria === "Factores Humanos" && <SmartphoneIcon className="size-3 text-blue-600" />}
                      {item.categoria === "Prevención de Errores" && <ShieldAlertIcon className="size-3 text-emerald-600" />}
                      {item.categoria === "Heurísticas" && <InfoIcon className="size-3 text-purple-600" />}
                      {item.categoria}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base leading-snug mb-2">
                    {item.decision}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="rounded-lg bg-white p-2.5 border border-stone-200/80 dark:bg-stone-900 dark:border-stone-800">
                      <span className="block text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                        Fundamento teórico / Principio HCI
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 font-medium">
                        {item.fundamento}
                      </p>
                    </div>

                    <div className="rounded-lg bg-stone-100/70 p-2.5 dark:bg-stone-900/50">
                      <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                        Necesidad del usuario / Error que evita
                      </span>
                      <p className="text-stone-600 dark:text-stone-400">
                        {item.necesidad}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center text-xs text-stone-500">
                  <CheckCircle2Icon className="size-3.5 text-emerald-600 mr-1.5" />
                  Cumple criterio de evaluación
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-stone-500">
              No se encontraron decisiones con ese criterio de búsqueda.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3 flex justify-between items-center text-xs text-stone-500 dark:border-stone-800 dark:bg-stone-950">
          <span>Total: {DESIGN_JUSTIFICATIONS.length} decisiones justificadas según SRS v2</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-stone-900 px-4 py-2 font-medium text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900"
          >
            Entendido, volver a la experiencia
          </button>
        </div>
      </div>
    </div>
  );
}
