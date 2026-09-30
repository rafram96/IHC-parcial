"use client";

import React, { useState } from "react";
import {
  ArrowRightIcon,
  FileSignatureIcon,
  ScaleIcon,
  SearchIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";

export function BuscarTab() {
  const { cases, notarials, setActiveTab } = useApp();
  const [query, setQuery] = useState<string>("");

  const q = query.trim().toLowerCase();

  const matchingCases = q
    ? cases.filter(
        (c) =>
          c.codigo.toLowerCase().includes(q) ||
          c.materia.toLowerCase().includes(q) ||
          c.motivo.toLowerCase().includes(q) ||
          c.partes.some(
            (p) =>
              p.nombres.toLowerCase().includes(q) ||
              p.apellidos.toLowerCase().includes(q) ||
              (p.numDoc && p.numDoc.includes(q)) ||
              p.comunidad.toLowerCase().includes(q)
          )
      )
    : [];

  const matchingNotarials = q
    ? notarials.filter(
        (n) =>
          n.codigo.toLowerCase().includes(q) ||
          n.tipo.toLowerCase().includes(q) ||
          n.asunto.toLowerCase().includes(q) ||
          n.participantes.some(
            (p) =>
              p.nombres.toLowerCase().includes(q) ||
              p.apellidos.toLowerCase().includes(q) ||
              (p.numDoc && p.numDoc.includes(q)) ||
              p.comunidad.toLowerCase().includes(q)
          )
      )
    : [];

  const totalMatches = matchingCases.length + matchingNotarials.length;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-stone-50 p-4 sm:p-6 dark:bg-stone-950 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
            <SearchIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Búsqueda Universal de Expedientes
            </h1>
            <p className="text-xs text-stone-500">
              Busca en simultáneo en casos judiciales y actuaciones notariales por DNI, nombre, código o comunidad
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-3.5 size-5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe un apellido, nombre, número de DNI o código (ej. Faustino, 20458912, C-2026-0001)..."
            className="w-full min-h-[52px] rounded-xl border border-stone-300 bg-white pl-11 pr-4 text-sm font-medium focus:border-amber-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      {query ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>Resultados encontrados: {totalMatches}</span>
          </div>

          {/* Matching Cases */}
          {matchingCases.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-2">
                <ScaleIcon className="size-4" />
                <span>Casos Judiciales ({matchingCases.length})</span>
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {matchingCases.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                        {c.codigo}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                        {c.estado}
                      </span>
                    </div>

                    <span className="inline-block rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                      {c.materia}
                    </span>

                    <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                      <strong>Partes:</strong>{" "}
                      {c.partes
                        .map(
                          (p) =>
                            `${p.nombres} ${p.apellidos} (${p.tipoDoc === "DNI" ? p.numDoc : p.tipoDoc})`
                        )
                        .join(" vs ")}
                    </p>

                    <p className="text-xs text-stone-500 line-clamp-2">
                      {c.motivo}
                    </p>

                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                      <button
                        onClick={() => setActiveTab("casos")}
                        className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        <span>Abrir en Casos</span>
                        <ArrowRightIcon className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Notarials */}
          {matchingNotarials.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                <FileSignatureIcon className="size-4" />
                <span>Actuaciones Notariales ({matchingNotarials.length})</span>
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {matchingNotarials.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                        {n.codigo}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        {n.estado}
                      </span>
                    </div>

                    <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                      {n.tipo}
                    </span>

                    <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                      <strong>Solicitante:</strong>{" "}
                      {n.participantes
                        .map(
                          (p) =>
                            `${p.nombres} ${p.apellidos} (${p.tipoDoc === "DNI" ? p.numDoc : p.tipoDoc})`
                        )
                        .join(", ")}
                    </p>

                    <p className="text-xs text-stone-500 line-clamp-2">
                      {n.asunto}
                    </p>

                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                      <button
                        onClick={() => setActiveTab("actuaciones")}
                        className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        <span>Abrir en Actuaciones</span>
                        <ArrowRightIcon className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalMatches === 0 && (
            <div className="py-12 text-center text-stone-500 text-sm">
              No se encontraron coincidencias para &ldquo;{query}&rdquo;. Revisa la ortografía o intenta buscar solo con el apellido o número de documento.
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center text-stone-400 text-sm">
          <p className="font-medium">Ingresa un término en la caja de búsqueda para localizar expedientes anteriores.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-stone-500">Pruebas sugeridas:</span>
            {["Faustino", "Gregoria", "Terrenos", "20458912", "C-2026-0001"].map((sug) => (
              <button
                key={sug}
                onClick={() => setQuery(sug)}
                className="rounded-lg bg-stone-200 px-2.5 py-1 text-stone-700 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-300"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
