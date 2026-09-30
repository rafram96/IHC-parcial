"use client";

import React, { useState } from "react";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  Edit3Icon,
  FileCheckIcon,
  PauseCircleIcon,
  PlusCircleIcon,
  ScaleIcon,
  SearchIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { Caso, EstadoCaso, MateriaCaso, Persona, TipoDocumento } from "@/lib/types";

export function CasosTab() {
  const {
    cases,
    addCaso,
    updateCaso,
    addAvanceCaso,
    concluirCaso,
    draftCaso,
    saveDraftCaso,
    clearDraftCaso,
    draftStatus,
  } = useApp();

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // New Case Wizard State (Step 1, 2, 3)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [materia, setMateria] = useState<MateriaCaso>(
    (draftCaso?.materia as MateriaCaso) || "Terrenos y linderos"
  );
  const [motivo, setMotivo] = useState<string>(draftCaso?.motivo || "");
  const [observaciones, setObservaciones] = useState<string>(
    draftCaso?.observaciones || ""
  );
  const [partes, setPartes] = useState<Persona[]>(
    draftCaso?.partes || [
      {
        id: "p-new-1",
        nombres: "Faustino",
        apellidos: "Quispe Mayta",
        tipoDoc: "No tiene / no lo trajo",
        numDoc: "",
        telefono: "Sin celular (avisar vía Teniente Gobernador)",
        comunidad: "Huasicancha Alta",
        direccion: "Paraje Callqui s/n",
        rol: "Solicitante",
      },
      {
        id: "p-new-2",
        nombres: "Bertha",
        apellidos: "Mamani Soto",
        tipoDoc: "DNI",
        numDoc: "20458912",
        telefono: "964112233",
        comunidad: "Huasicancha Centro",
        direccion: "Jr. Comercio 124",
        rol: "Invitado",
      },
    ]
  );

  // Add Progress / Conclude Modal
  const [showAddAvanceModal, setShowAddAvanceModal] = useState<boolean>(false);
  const [avanceTexto, setAvanceTexto] = useState<string>("");
  const [avanceProximaFecha, setAvanceProximaFecha] = useState<string>("");
  const [avanceVincularAgenda, setAvanceVincularAgenda] = useState<boolean>(true);

  const [showConcluirModal, setShowConcluirModal] = useState<boolean>(false);
  const [resultadoTexto, setResultadoTexto] = useState<string>("");

  // Edit State
  const [editEstado, setEditEstado] = useState<EstadoCaso>("En trámite");
  const [editObservaciones, setEditObservaciones] = useState<string>("");

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  // Auto-drafting on text changes
  const handleMotivoChange = (val: string) => {
    setMotivo(val);
    saveDraftCaso({
      materia,
      motivo: val,
      observaciones,
      partes,
    });
  };

  const handleObservacionesChange = (val: string) => {
    setObservaciones(val);
    saveDraftCaso({
      materia,
      motivo,
      observaciones: val,
      partes,
    });
  };

  const handleAddPersona = () => {
    const newPersona: Persona = {
      id: `p-${Date.now()}`,
      nombres: "",
      apellidos: "",
      tipoDoc: "DNI",
      numDoc: "",
      telefono: "",
      comunidad: "Huasicancha",
      rol: "Invitado",
    };
    const next = [...partes, newPersona];
    setPartes(next);
    saveDraftCaso({ materia, motivo, observaciones, partes: next });
  };

  const handleUpdatePersona = (idx: number, field: keyof Persona, val: string) => {
    const next = [...partes];
    next[idx] = { ...next[idx], [field]: val };
    setPartes(next);
    saveDraftCaso({ materia, motivo, observaciones, partes: next });
  };

  const handleRemovePersona = (idx: number) => {
    if (partes.length <= 1) return;
    const next = partes.filter((_, i) => i !== idx);
    setPartes(next);
    saveDraftCaso({ materia, motivo, observaciones, partes: next });
  };

  const handleSaveNewCase = () => {
    const nextId = `C-2026-00${cases.length + 1}`;
    const nuevo: Caso = {
      id: nextId,
      codigo: nextId,
      fechaRegistro: "2026-09-30",
      materia,
      motivo,
      estado: "En trámite",
      observaciones,
      partes,
      historial: [
        {
          id: `h-${Date.now()}`,
          fecha: "2026-09-30",
          descripcion: "Recepción de partes y apertura formal del caso.",
        },
      ],
      requiereAtencion: true,
      syncEstado: "local",
      updatedAt: new Date().toISOString(),
    };

    addCaso(nuevo);
    clearDraftCaso();
    setIsCreatingNew(false);
    setSelectedCaseId(nextId);
    setStep(1);
    setMotivo("");
    setObservaciones("");
  };

  // Filtered cases
  const filteredCases = cases.filter((c) => {
    const matchesFilter =
      filterStatus === "Todos" ||
      (filterStatus === "Requiere atención"
        ? c.requiereAtencion && c.estado !== "Concluido"
        : c.estado === filterStatus);

    const matchesSearch =
      c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.partes.some(
        (p) =>
          p.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.numDoc && p.numDoc.includes(searchTerm))
      );

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-stone-50 dark:bg-stone-950">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow">
            <ScaleIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Casos Judiciales de Paz
            </h1>
            <p className="text-xs text-stone-500">
              Registro de conflictos vecinales, conciliaciones y seguimiento
            </p>
          </div>
        </div>

        {!isCreatingNew && !selectedCaseId && (
          <button
            onClick={() => {
              setIsCreatingNew(true);
              setStep(1);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-amber-500 active:scale-95 transition-all min-h-[48px]"
          >
            <PlusCircleIcon className="size-5" />
            <span>Registrar nuevo caso</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* NEW CASE 3-STEP WIZARD (D4, D6, D16) */}
        {isCreatingNew ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 shadow-lg dark:border-stone-800 dark:bg-stone-900">
            {/* Wizard Header & Stepper */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 dark:border-stone-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Nuevo Expediente · C-2026-00{cases.length + 1}
                </span>
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                  {step === 1 && "Paso 1: Datos del caso"}
                  {step === 2 && "Paso 2: Personas involucradas"}
                  {step === 3 && "Paso 3: Revisar y guardar"}
                </h2>
              </div>

              {/* Autosave Draft Indicator (D16) */}
              <div className="flex items-center gap-2 text-xs">
                {draftStatus === "saving" && (
                  <span className="text-amber-600 animate-pulse font-medium">
                    Guardando borrador…
                  </span>
                )}
                {draftStatus === "saved" && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2Icon className="size-3.5" />
                    Borrador en tableta ⏳
                  </span>
                )}
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
            </div>

            {/* Stepper progress indicator */}
            <div className="my-5 flex items-center justify-between">
              {[
                { s: 1, label: "1. Datos del caso" },
                { s: 2, label: "2. Personas" },
                { s: 3, label: "3. Revisar" },
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      step >= item.s
                        ? "bg-amber-600 text-white"
                        : "bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                    }`}
                  >
                    {item.s}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-semibold ${
                      step >= item.s
                        ? "text-stone-900 dark:text-stone-100"
                        : "text-stone-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: Datos del caso */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Código de expediente (Automático)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`C-2026-00${cases.length + 1}`}
                    className="w-full rounded-xl border border-stone-200 bg-stone-100 px-4 py-2.5 text-sm font-bold text-stone-600 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">
                    Generado automáticamente por el juzgado. No requiere modificación.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Tipo de conflicto o materia <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "Terrenos y linderos",
                      "Vecinal",
                      "Deudas",
                      "Familiar",
                      "Daños",
                      "Otro",
                    ].map((mat) => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => {
                          setMateria(mat as MateriaCaso);
                          saveDraftCaso({
                            materia: mat as MateriaCaso,
                            motivo,
                            observaciones,
                            partes,
                          });
                        }}
                        className={`flex min-h-[48px] items-center justify-center rounded-xl p-3 text-xs font-bold transition-all border ${
                          materia === mat
                            ? "border-amber-600 bg-amber-50 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 shadow-sm"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300"
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      Motivo del conflicto <span className="text-red-500">*</span>
                    </label>
                    <span
                      className={`text-xs ${
                        motivo.length < 10
                          ? "text-red-500 font-bold"
                          : "text-stone-500"
                      }`}
                    >
                      {motivo.length}/300 caracteres (mínimo 10)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={motivo}
                    onChange={(e) => handleMotivoChange(e.target.value)}
                    placeholder="Describe brevemente el desacuerdo entre los comuneros (ej. colocación de cerco y desvío de acequia)..."
                    className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm focus:border-amber-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  />
                  {motivo.length > 0 && motivo.length < 10 && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      Escribe al menos 10 caracteres para describir el hecho.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Observaciones iniciales (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={observaciones}
                    onChange={(e) => handleObservacionesChange(e.target.value)}
                    placeholder="Voluntad de diálogo, acuerdos previos, estado anímico..."
                    className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm focus:border-amber-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    disabled={motivo.trim().length < 10}
                    onClick={() => setStep(2)}
                    className="flex min-h-[48px] items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-amber-500 disabled:opacity-40"
                  >
                    <span>Siguiente: Personas involucradas</span>
                    <ArrowRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Personas involucradas (D17, D8) */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Registra al solicitante y a la persona invitada o testigos. Si no trajeron DNI o no tienen teléfono, puedes continuar marcando esa opción.
                  </p>
                  <button
                    onClick={handleAddPersona}
                    className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    <UserPlusIcon className="size-4" />
                    <span>Agregar otra persona</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {partes.map((p, idx) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-stone-200 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-800/40 relative"
                    >
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3 dark:border-stone-700">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          Persona {idx + 1}: Rol {p.rol}
                        </span>
                        {partes.length > 1 && (
                          <button
                            onClick={() => handleRemovePersona(idx)}
                            className="text-stone-400 hover:text-red-500 p-1"
                            title="Quitar persona"
                          >
                            <Trash2Icon className="size-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Nombres <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={p.nombres}
                            onChange={(e) =>
                              handleUpdatePersona(idx, "nombres", e.target.value)
                            }
                            placeholder="Ej. Faustino"
                            className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Apellidos <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={p.apellidos}
                            onChange={(e) =>
                              handleUpdatePersona(idx, "apellidos", e.target.value)
                            }
                            placeholder="Ej. Quispe Mayta"
                            className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Tipo de documento
                          </label>
                          <select
                            value={p.tipoDoc}
                            onChange={(e) =>
                              handleUpdatePersona(
                                idx,
                                "tipoDoc",
                                e.target.value as TipoDocumento
                              )
                            }
                            className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                          >
                            <option value="DNI">DNI (8 dígitos)</option>
                            <option value="Carné de extranjería">
                              Carné de extranjería
                            </option>
                            <option value="No tiene / no lo trajo">
                              No tiene / no lo trajo
                            </option>
                          </select>
                        </div>

                        {p.tipoDoc !== "No tiene / no lo trajo" && (
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                              Número de documento
                            </label>
                            <input
                              type="text"
                              value={p.numDoc || ""}
                              onChange={(e) =>
                                handleUpdatePersona(idx, "numDoc", e.target.value)
                              }
                              placeholder="Ej. 20458912"
                              maxLength={8}
                              className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Teléfono o medio de aviso (Opcional)
                          </label>
                          <input
                            type="text"
                            value={p.telefono || ""}
                            onChange={(e) =>
                              handleUpdatePersona(idx, "telefono", e.target.value)
                            }
                            placeholder="Ej. 964112233 o 'Vía Teniente Gobernador'"
                            className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Comunidad o paraje <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={p.comunidad}
                            onChange={(e) =>
                              handleUpdatePersona(idx, "comunidad", e.target.value)
                            }
                            placeholder="Ej. Huasicancha Alta"
                            className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Rol en el caso
                          </label>
                          <select
                            value={p.rol}
                            onChange={(e) =>
                              handleUpdatePersona(idx, "rol", e.target.value)
                            }
                            className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                          >
                            <option value="Solicitante">Solicitante</option>
                            <option value="Invitado">Invitado (Contraparte)</option>
                            <option value="Testigo">Testigo</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    onClick={() => setStep(1)}
                    className="flex min-h-[48px] items-center gap-1 rounded-xl border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    <ArrowLeftIcon className="size-4" /> Anterior
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    disabled={partes.some((p) => !p.nombres.trim() || !p.apellidos.trim())}
                    className="flex min-h-[48px] items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-amber-500 disabled:opacity-40"
                  >
                    <span>Siguiente: Revisar y guardar</span>
                    <ArrowRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Revisar y Guardar (D6) */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-xl bg-amber-50/80 p-4 border border-amber-200 text-xs text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <ShieldCheckIcon className="size-5 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong>Revisión previa al registro formal:</strong> Verifica que los datos coincidan con lo expuesto por las partes antes de generar el acta en la tableta.
                  </div>
                </div>

                <div className="rounded-xl border border-stone-200 p-4 space-y-3 dark:border-stone-800 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-stone-500">Expediente:</span>
                      <p className="font-bold text-stone-900 dark:text-stone-100">
                        C-2026-00{cases.length + 1}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-stone-500">Materia:</span>
                      <p className="font-bold text-amber-700 dark:text-amber-400">
                        {materia}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-stone-500">Motivo del caso:</span>
                    <p className="font-medium text-stone-800 dark:text-stone-200">
                      {motivo}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-stone-500">Partes involucradas ({partes.length}):</span>
                    <ul className="mt-1 space-y-1">
                      {partes.map((p, i) => (
                        <li key={i} className="text-xs text-stone-700 dark:text-stone-300">
                          • <strong>{p.nombres} {p.apellidos}</strong> ({p.rol}) — Doc: {p.tipoDoc === "DNI" ? p.numDoc : p.tipoDoc} — {p.comunidad}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {observaciones && (
                    <div>
                      <span className="text-xs text-stone-500">Observaciones:</span>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        {observaciones}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    onClick={() => setStep(2)}
                    className="flex min-h-[48px] items-center gap-1 rounded-xl border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    <ArrowLeftIcon className="size-4" /> Modificar datos
                  </button>

                  <button
                    onClick={handleSaveNewCase}
                    className="flex min-h-[48px] items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-500 active:scale-95 transition-all"
                  >
                    <CheckCircle2Icon className="size-5" />
                    <span>Guardar caso en la tableta ⏳</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : selectedCase ? (
          /* CASE DETAIL VIEW (D9, 3.2, 3.3, 3.5) */
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Back button and header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedCaseId(null);
                  setIsEditing(false);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 min-h-[44px]"
              >
                <ArrowLeftIcon className="size-4" />
                <span>Volver al listado de casos</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedCase.estado !== "Concluido" && (
                  <>
                    <button
                      onClick={() => setShowAddAvanceModal(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-amber-500 min-h-[44px]"
                    >
                      <PlusCircleIcon className="size-4" />
                      <span>Agregar avance</span>
                    </button>

                    <button
                      onClick={() => setShowConcluirModal(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-600 min-h-[44px]"
                    >
                      <FileCheckIcon className="size-4" />
                      <span>Concluir caso</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setEditEstado(selectedCase.estado);
                    setEditObservaciones(selectedCase.observaciones || "");
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 min-h-[44px]"
                >
                  <Edit3Icon className="size-4" />
                  <span>{isEditing ? "Cancelar edición" : "Editar"}</span>
                </button>
              </div>
            </div>

            {/* Case Title Banner */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                    {selectedCase.codigo}
                  </span>
                  <span className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    {selectedCase.materia}
                  </span>
                </div>

                {/* Status Badges with Icon + Color + Text (D14) */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      selectedCase.estado === "En trámite"
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300"
                        : selectedCase.estado === "En espera"
                        ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {selectedCase.estado === "En trámite" && (
                      <ClockIcon className="size-3.5 text-blue-600" />
                    )}
                    {selectedCase.estado === "En espera" && (
                      <PauseCircleIcon className="size-3.5 text-amber-600" />
                    )}
                    {selectedCase.estado === "Concluido" && (
                      <CheckCircle2Icon className="size-3.5 text-emerald-600" />
                    )}
                    {selectedCase.estado}
                  </span>

                  {/* Sync status */}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedCase.syncEstado === "local"
                        ? "bg-amber-50 text-amber-800 border border-amber-300"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-300"
                    }`}
                  >
                    {selectedCase.syncEstado === "local"
                      ? "⏳ En tableta (pendiente)"
                      : "✓ Sincronizado"}
                  </span>
                </div>
              </div>

              {/* D9 Highlighted Editing Form */}
              {isEditing ? (
                <div className="mt-4 rounded-xl border-2 border-amber-400 bg-amber-50/50 p-4 space-y-3 dark:bg-amber-950/20">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
                    <Edit3Icon className="size-3.5" />
                    Estás modificando: Estado y Observaciones
                  </span>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Estado del expediente
                    </label>
                    <select
                      value={editEstado}
                      onChange={(e) => setEditEstado(e.target.value as EstadoCaso)}
                      className="rounded-lg border border-amber-300 bg-white p-2 text-sm font-semibold text-stone-800 dark:bg-stone-800 dark:text-stone-100"
                    >
                      <option value="En trámite">En trámite</option>
                      <option value="En espera">En espera</option>
                      <option value="Concluido">Concluido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      rows={3}
                      value={editObservaciones}
                      onChange={(e) => setEditObservaciones(e.target.value)}
                      className="w-full rounded-lg border border-amber-300 bg-white p-2 text-sm text-stone-800 dark:bg-stone-800 dark:text-stone-100"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                    >
                      Descartar cambios
                    </button>
                    <button
                      onClick={() => {
                        updateCaso(selectedCase.id, {
                          estado: editEstado,
                          observaciones: editObservaciones,
                        });
                        setIsEditing(false);
                      }}
                      className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-amber-500"
                    >
                      Guardar cambios en tableta
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Motivo del conflicto:
                    </span>
                    <p className="mt-1 text-sm text-stone-800 dark:text-stone-200">
                      {selectedCase.motivo}
                    </p>
                  </div>

                  {selectedCase.observaciones && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Observaciones:
                      </span>
                      <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                        {selectedCase.observaciones}
                      </p>
                    </div>
                  )}

                  {selectedCase.resultado && (
                    <div className="rounded-xl bg-emerald-50 p-3.5 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2Icon className="size-4" />
                        Resultado / Acuerdo de conclusión:
                      </span>
                      <p className="mt-1 text-xs font-medium text-emerald-900 dark:text-emerald-200">
                        {selectedCase.resultado}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Partes Involucradas */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
                <UsersIcon className="size-4 text-amber-600" />
                <span>Partes involucradas ({selectedCase.partes.length})</span>
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {selectedCase.partes.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs dark:border-stone-800 dark:bg-stone-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {p.nombres} {p.apellidos}
                      </span>
                      <span className="rounded bg-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-800 dark:bg-stone-700 dark:text-stone-200">
                        {p.rol}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-stone-600 dark:text-stone-400">
                      <p>
                        <strong>Documento:</strong>{" "}
                        {p.tipoDoc === "DNI" ? `DNI ${p.numDoc}` : p.tipoDoc}
                      </p>
                      <p>
                        <strong>Contacto:</strong> {p.telefono || "No proporcionado"}
                      </p>
                      <p>
                        <strong>Comunidad:</strong> {p.comunidad}
                        {p.direccion ? ` (${p.direccion})` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial de Avances y Seguimiento */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-3 dark:border-stone-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <ClockIcon className="size-4 text-amber-600" />
                  <span>Historial de actuaciones y seguimiento</span>
                </h3>

                {selectedCase.proximaFechaAtencion && (
                  <span className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200 flex items-center gap-1">
                    <CalendarDaysIcon className="size-3.5" />
                    Próxima cita: {selectedCase.proximaFechaAtencion}
                  </span>
                )}
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
                {selectedCase.historial.map((h, i) => (
                  <div key={h.id} className="relative">
                    <span className="absolute -left-6 top-1 flex size-3.5 items-center justify-center rounded-full bg-amber-600 ring-4 ring-white dark:ring-stone-900" />
                    <div className="rounded-xl bg-stone-50 p-3 border border-stone-200/80 dark:bg-stone-800/40 dark:border-stone-800 text-xs">
                      <div className="flex items-center justify-between font-semibold text-stone-500 mb-1">
                        <span>Actuación {i + 1}</span>
                        <span>{h.fecha}</span>
                      </div>
                      <p className="text-stone-800 dark:text-stone-200 font-medium">
                        {h.descripcion}
                      </p>
                      {h.proximaFecha && (
                        <p className="mt-1 text-amber-700 dark:text-amber-400 font-semibold">
                          📅 Próxima atención acordada: {h.proximaFecha}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* CASES LIST VIEW */
          <div className="space-y-4">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 size-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar por código (ej. C-2026-0001), parte, DNI o materia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-stone-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-amber-600 focus:outline-none dark:border-stone-700 dark:bg-stone-900"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                {["Todos", "En trámite", "En espera", "Concluido", "Requiere atención"].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                        filterStatus === st
                          ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                          : "bg-white text-stone-600 hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                      }`}
                    >
                      {st === "Requiere atención" ? `⚠ ${st}` : st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* List Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm hover:border-amber-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 transition-all min-h-[160px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                        {c.codigo}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          c.estado === "En trámite"
                            ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300"
                            : c.estado === "En espera"
                            ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {c.estado}
                      </span>
                    </div>

                    <span className="inline-block rounded bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 mb-1.5 border border-amber-200/60 dark:border-amber-800">
                      {c.materia}
                    </span>

                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 line-clamp-1">
                      {c.partes.map((p) => `${p.nombres} ${p.apellidos}`).join(" vs ")}
                    </p>

                    <p className="mt-1 text-xs text-stone-500 line-clamp-2">
                      {c.motivo}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                    <span>
                      {c.syncEstado === "local" ? "⏳ En tableta" : "✓ Sincronizado"}
                    </span>
                    {c.requiereAtencion && c.estado !== "Concluido" && (
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <AlertTriangleIcon className="size-3" /> Requiere atención
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {filteredCases.length === 0 && (
              <div className="py-16 text-center text-stone-500">
                No se encontraron casos con los filtros seleccionados.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Agregar Avance */}
      {showAddAvanceModal && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 dark:border-stone-800">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                Registrar nuevo avance · {selectedCase.codigo}
              </h3>
              <button
                onClick={() => setShowAddAvanceModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                ¿Qué actuación o diálogo se realizó? <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={avanceTexto}
                onChange={(e) => setAvanceTexto(e.target.value)}
                placeholder="Ej. Se recibió a Don Faustino y se levantó acta de compromiso preliminar..."
                className="w-full rounded-xl border border-stone-300 p-3 text-sm focus:border-amber-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Próxima fecha de atención (Opcional)
              </label>
              <input
                type="date"
                value={avanceProximaFecha}
                onChange={(e) => setAvanceProximaFecha(e.target.value)}
                className="w-full rounded-xl border border-stone-300 p-2.5 text-sm dark:border-stone-700 dark:bg-stone-800"
              />
            </div>

            {avanceProximaFecha && (
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={avanceVincularAgenda}
                  onChange={(e) => setAvanceVincularAgenda(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 size-4"
                />
                <span>Agendar automáticamente esta audiencia en el calendario de la semana</span>
              </label>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setShowAddAvanceModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancelar
              </button>
              <button
                disabled={!avanceTexto.trim()}
                onClick={() => {
                  addAvanceCaso(
                    selectedCase.id,
                    {
                      id: `h-${Date.now()}`,
                      fecha: "2026-09-30",
                      descripcion: avanceTexto,
                      proximaFecha: avanceProximaFecha || undefined,
                    },
                    avanceProximaFecha || undefined,
                    avanceVincularAgenda
                  );
                  setShowAddAvanceModal(false);
                  setAvanceTexto("");
                  setAvanceProximaFecha("");
                }}
                className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-500 disabled:opacity-40"
              >
                Guardar avance en la tableta ⏳
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Concluir Caso (D9, 3.3) */}
      {showConcluirModal && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 dark:border-stone-800">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                <FileCheckIcon className="size-5 text-emerald-600" />
                <span>Concluir caso judicial · {selectedCase.codigo}</span>
              </h3>
              <button
                onClick={() => setShowConcluirModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400">
              Para archivar el expediente como <strong>Concluido</strong>, es obligatorio registrar el acuerdo formal de conciliación alcanzado por las partes.
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Resultado o acuerdo de conciliación <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={resultadoTexto}
                onChange={(e) => setResultadoTexto(e.target.value)}
                placeholder="Ej. Se acuerda respetar el hito de piedras original y ambas partes limpian la acequia este sábado..."
                className="w-full rounded-xl border border-stone-300 p-3 text-sm focus:border-emerald-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setShowConcluirModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancelar
              </button>
              <button
                disabled={!resultadoTexto.trim()}
                onClick={() => {
                  concluirCaso(selectedCase.id, resultadoTexto);
                  setShowConcluirModal(false);
                  setResultadoTexto("");
                }}
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-600 disabled:opacity-40"
              >
                Confirmar y concluir caso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
