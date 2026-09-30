"use client";

import React, { useState } from "react";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  FileCheckIcon,
  FileSignatureIcon,
  PlusCircleIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { ActuacionNotarial, Persona, TipoActuacion, TipoDocumento } from "@/lib/types";

export function ActuacionesTab() {
  const {
    notarials,
    addActuacion,
    updateActuacion,
    draftActuacion,
    saveDraftActuacion,
    clearDraftActuacion,
    draftStatus,
  } = useApp();

  const [selectedActId, setSelectedActId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // 3-Step Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tipo, setTipo] = useState<TipoActuacion>(
    (draftActuacion?.tipo as TipoActuacion) || "Constancia de posesión"
  );
  const [asunto, setAsunto] = useState<string>(draftActuacion?.asunto || "");
  const [observaciones, setObservaciones] = useState<string>(
    draftActuacion?.observaciones || ""
  );
  const [participantes, setParticipantes] = useState<Persona[]>(
    draftActuacion?.participantes || [
      {
        id: "pn-new-1",
        nombres: "Gregoria",
        apellidos: "Condori Páucar",
        tipoDoc: "DNI",
        numDoc: "20584913",
        telefono: "964789521",
        comunidad: "Huasicancha",
        direccion: "Sector Chaupimarca s/n",
        rol: "Solicitante",
      },
    ]
  );

  // Duplicate Warning Modal (D7 / 4.4)
  const [duplicateWarningOpen, setDuplicateWarningOpen] = useState<boolean>(false);
  const [matchedDuplicate, setMatchedDuplicate] = useState<ActuacionNotarial | null>(null);

  // Conclude Modal
  const [showConcludeModal, setShowConcludeModal] = useState<boolean>(false);
  const [resultadoTexto, setResultadoTexto] = useState<string>("");
  const [refFisica, setRefFisica] = useState<string>("Libro de Actuaciones Notariales 2026, Folio ");

  const selectedAct = notarials.find((a) => a.id === selectedActId);

  const tiposInfo: { tipo: TipoActuacion; explicacion: string }[] = [
    {
      tipo: "Constancia de posesión",
      explicacion: "Certifica que una persona vive en un terreno o lo trabaja pacíficamente.",
    },
    {
      tipo: "Constancia de convivencia",
      explicacion: "Certifica que dos personas viven juntas bajo el mismo techo.",
    },
    {
      tipo: "Certificación de firmas",
      explicacion: "Confirma que la firma en un documento es auténtica de quien se presenta.",
    },
    {
      tipo: "Transferencia de bienes muebles",
      explicacion: "Deja constancia formal de compra o venta de animales, herramientas o vehículos.",
    },
    {
      tipo: "Otro",
      explicacion: "Cualquier otra actuación notarial autorizada por ley para el juez de paz.",
    },
  ];

  const handleAsuntoChange = (val: string) => {
    setAsunto(val);
    saveDraftActuacion({ tipo, asunto: val, observaciones, participantes });
  };

  const handleUpdateParticipante = (idx: number, field: keyof Persona, val: string) => {
    const next = [...participantes];
    next[idx] = { ...next[idx], [field]: val };
    setParticipantes(next);
    saveDraftActuacion({ tipo, asunto, observaciones, participantes: next });
  };

  const handleCheckStep3 = () => {
    // Check for probable duplicate (D7): same DNI or same applicant with same type in notarials
    const solicitante = participantes.find((p) => p.rol === "Solicitante");
    if (solicitante && solicitante.numDoc) {
      const match = notarials.find(
        (n) =>
          n.tipo === tipo &&
          n.participantes.some((p) => p.numDoc === solicitante.numDoc)
      );
      if (match) {
        setMatchedDuplicate(match);
        setDuplicateWarningOpen(true);
        return;
      }
    }
    setStep(3);
  };

  const handleSaveActuacion = () => {
    const nextId = `N-2026-00${notarials.length + 15}`;
    const nueva: ActuacionNotarial = {
      id: nextId,
      codigo: nextId,
      fechaSolicitud: "2026-09-30",
      fechaAtencion: "2026-09-30",
      tipo,
      asunto,
      estado: "Atendida",
      observaciones,
      participantes,
      syncEstado: "local",
      updatedAt: new Date().toISOString(),
    };

    addActuacion(nueva);
    clearDraftActuacion();
    setIsCreatingNew(false);
    setSelectedActId(nextId);
    setStep(1);
    setAsunto("");
  };

  const filteredNotarials = notarials.filter((n) => {
    const matchesFilter = filterStatus === "Todas" || n.estado === filterStatus;
    const matchesSearch =
      n.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.participantes.some(
        (p) =>
          p.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.numDoc && p.numDoc.includes(searchTerm))
      );
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-stone-50 dark:bg-stone-950">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow">
            <FileSignatureIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Actuaciones Notariales
            </h1>
            <p className="text-xs text-stone-500">
              Constancias de posesión, supervivencia, certificación de firmas y transferencias
            </p>
          </div>
        </div>

        {!isCreatingNew && !selectedActId && (
          <button
            onClick={() => {
              setIsCreatingNew(true);
              setStep(1);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-600 active:scale-95 transition-all min-h-[48px]"
          >
            <PlusCircleIcon className="size-5" />
            <span>Registrar actuación notarial</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* NEW NOTARIAL WIZARD */}
        {isCreatingNew ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 shadow-lg dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 dark:border-stone-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Nueva Actuación Notarial · N-2026-00{notarials.length + 15}
                </span>
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                  {step === 1 && "Paso 1: Tipo de actuación y asunto"}
                  {step === 2 && "Paso 2: Personas participantes"}
                  {step === 3 && "Paso 3: Revisar y confirmar"}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs">
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

            {/* Stepper */}
            <div className="my-5 flex items-center justify-between">
              {[
                { s: 1, label: "1. Tipo de trámite" },
                { s: 2, label: "2. Participantes" },
                { s: 3, label: "3. Revisar" },
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
                      step >= item.s
                        ? "bg-emerald-700 text-white"
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

            {/* STEP 1: Tipo y Asunto (D3 Plain Language) */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                    Selecciona el tipo de trámite notarial <span className="text-red-500">*</span>
                  </label>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {tiposInfo.map((t) => (
                      <button
                        key={t.tipo}
                        type="button"
                        onClick={() => {
                          setTipo(t.tipo);
                          saveDraftActuacion({ tipo: t.tipo, asunto, observaciones, participantes });
                        }}
                        className={`flex flex-col text-left rounded-xl p-3.5 border transition-all min-h-[64px] ${
                          tipo === t.tipo
                            ? "border-emerald-600 bg-emerald-50/90 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-sm ring-1 ring-emerald-500"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300"
                        }`}
                      >
                        <span className="font-bold text-sm">{t.tipo}</span>
                        <span className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                          {t.explicacion}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Asunto o descripción breve <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={asunto}
                    onChange={(e) => handleAsuntoChange(e.target.value)}
                    placeholder="Ej. Constancia de posesión pacífica del predio rústico Chaupimarca para solicitud de medidor de luz..."
                    className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm focus:border-emerald-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  />
                  {asunto.length > 0 && asunto.length < 10 && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      Escribe al menos 10 caracteres describiendo el asunto notarial.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Observaciones adicionales (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={observaciones}
                    onChange={(e) => {
                      setObservaciones(e.target.value);
                      saveDraftActuacion({ tipo, asunto, observaciones: e.target.value, participantes });
                    }}
                    placeholder="Documentos físicos presentados, acuerdos verbales..."
                    className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm focus:border-emerald-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    disabled={asunto.trim().length < 10}
                    onClick={() => setStep(2)}
                    className="flex min-h-[48px] items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-600 disabled:opacity-40"
                  >
                    <span>Siguiente: Participantes</span>
                    <ArrowRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Participantes */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Registra los datos de la persona solicitante. Si viene acompañada de testigos o declarantes, puedes agregarlos con el botón inferior.
                </p>

                {participantes.map((p, idx) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-stone-200 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-800/40"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-3">
                      Participante {idx + 1}: {p.rol}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Nombres <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={p.nombres}
                          onChange={(e) =>
                            handleUpdateParticipante(idx, "nombres", e.target.value)
                          }
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
                            handleUpdateParticipante(idx, "apellidos", e.target.value)
                          }
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
                            handleUpdateParticipante(
                              idx,
                              "tipoDoc",
                              e.target.value as TipoDocumento
                            )
                          }
                          className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                        >
                          <option value="DNI">DNI (8 dígitos)</option>
                          <option value="Carné de extranjería">Carné de extranjería</option>
                          <option value="No tiene / no lo trajo">No tiene / no lo trajo</option>
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
                              handleUpdateParticipante(idx, "numDoc", e.target.value)
                            }
                            maxLength={8}
                            className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Teléfono o contacto (Opcional)
                        </label>
                        <input
                          type="text"
                          value={p.telefono || ""}
                          onChange={(e) =>
                            handleUpdateParticipante(idx, "telefono", e.target.value)
                          }
                          className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Comunidad o dirección <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={p.comunidad}
                          onChange={(e) =>
                            handleUpdateParticipante(idx, "comunidad", e.target.value)
                          }
                          className="w-full rounded-lg border border-stone-300 bg-white p-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    onClick={() => setStep(1)}
                    className="flex min-h-[48px] items-center gap-1 rounded-xl border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    <ArrowLeftIcon className="size-4" /> Anterior
                  </button>

                  <button
                    onClick={handleCheckStep3}
                    disabled={participantes.some((p) => !p.nombres.trim() || !p.apellidos.trim())}
                    className="flex min-h-[48px] items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-600 disabled:opacity-40"
                  >
                    <span>Siguiente: Revisar datos</span>
                    <ArrowRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Revisar y Guardar */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-xl border border-stone-200 p-4 space-y-3 dark:border-stone-800 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-stone-500">Código previsto:</span>
                      <p className="font-bold text-stone-900 dark:text-stone-100">
                        N-2026-00{notarials.length + 15}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-stone-500">Tipo de actuación:</span>
                      <p className="font-bold text-emerald-700 dark:text-emerald-400">
                        {tipo}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-stone-500">Asunto:</span>
                    <p className="font-medium text-stone-800 dark:text-stone-200">
                      {asunto}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-stone-500">Solicitante:</span>
                    <p className="text-xs text-stone-800 dark:text-stone-200 font-semibold">
                      {participantes[0]?.nombres} {participantes[0]?.apellidos} (Doc: {participantes[0]?.numDoc || participantes[0]?.tipoDoc})
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    onClick={() => setStep(2)}
                    className="flex min-h-[48px] items-center gap-1 rounded-xl border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    <ArrowLeftIcon className="size-4" /> Modificar
                  </button>

                  <button
                    onClick={handleSaveActuacion}
                    className="flex min-h-[48px] items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-600 active:scale-95 transition-all"
                  >
                    <CheckCircle2Icon className="size-5" />
                    <span>Registrar actuación en la tableta ⏳</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : selectedAct ? (
          /* NOTARIAL DETAIL VIEW */
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedActId(null)}
                className="flex items-center gap-1.5 rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 min-h-[44px]"
              >
                <ArrowLeftIcon className="size-4" />
                <span>Volver al listado</span>
              </button>

              {selectedAct.estado !== "Concluida" && (
                <button
                  onClick={() => setShowConcludeModal(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-600 min-h-[44px]"
                >
                  <FileCheckIcon className="size-4" />
                  <span>Registrar entrega / Concluir</span>
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-stone-900 dark:text-stone-100">
                    {selectedAct.codigo}
                  </span>
                  <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                    {selectedAct.tipo}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                    {selectedAct.estado}
                  </span>
                  <span className="text-xs text-stone-400">
                    {selectedAct.syncEstado === "local" ? "⏳ En tableta" : "✓ Sincronizado"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Asunto formal:
                </span>
                <p className="mt-1 text-base font-semibold text-stone-800 dark:text-stone-200">
                  {selectedAct.asunto}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-4 rounded-xl dark:bg-stone-800/40">
                <div>
                  <span className="text-stone-500 font-medium">Fecha de solicitud:</span>
                  <p className="font-bold text-stone-800 dark:text-stone-200">{selectedAct.fechaSolicitud}</p>
                </div>
                <div>
                  <span className="text-stone-500 font-medium">Fecha de atención:</span>
                  <p className="font-bold text-stone-800 dark:text-stone-200">{selectedAct.fechaAtencion || "Inmediata"}</p>
                </div>
                <div>
                  <span className="text-stone-500 font-medium">Referencia física en libro:</span>
                  <p className="font-bold text-stone-800 dark:text-stone-200">
                    {selectedAct.referenciaFisica || "Pendiente de asiento"}
                  </p>
                </div>
              </div>

              {/* Participantes */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                  Participantes ({selectedAct.participantes.length})
                </h3>
                <div className="space-y-2">
                  {selectedAct.participantes.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-stone-200 bg-white p-3 text-xs dark:border-stone-800 dark:bg-stone-900"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{p.nombres} {p.apellidos}</span>
                        <span className="text-emerald-700">{p.rol}</span>
                      </div>
                      <p className="text-stone-500 mt-1">
                        {p.tipoDoc}: {p.numDoc || "No trajo"} · {p.comunidad}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedAct.resultado && (
                <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 text-xs">
                  <span className="font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                    Resultado / Constancia emitida:
                  </span>
                  <p className="font-medium text-emerald-900 dark:text-emerald-200">
                    {selectedAct.resultado}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* NOTARIALS LIST */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 size-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar por código (ej. N-2026-0012), solicitante, DNI o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-stone-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-emerald-600 focus:outline-none dark:border-stone-700 dark:bg-stone-900"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                {["Todas", "Pendiente", "Atendida", "Concluida"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      filterStatus === st
                        ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                        : "bg-white text-stone-600 hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNotarials.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedActId(n.id)}
                  className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm hover:border-emerald-500 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 transition-all min-h-[160px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                        {n.codigo}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {n.estado}
                      </span>
                    </div>

                    <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-1.5 border border-emerald-200">
                      {n.tipo}
                    </span>

                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 line-clamp-1">
                      {n.participantes.map((p) => `${p.nombres} ${p.apellidos}`).join(", ")}
                    </p>

                    <p className="mt-1 text-xs text-stone-500 line-clamp-2">
                      {n.asunto}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                    <span>{n.fechaSolicitud}</span>
                    <span>
                      {n.syncEstado === "local" ? "⏳ En tableta" : "✓ Sincronizado"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* D7 Prevent Duplicate Warning Dialog (SRS v2 4.4) */}
      {duplicateWarningOpen && matchedDuplicate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border-2 border-amber-400 bg-white p-6 shadow-2xl dark:border-amber-700 dark:bg-stone-900 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 shrink-0">
                <AlertCircleIcon className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  Posible actuación duplicada detectada
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Ya existe un registro reciente (<strong>{matchedDuplicate.codigo}</strong>) del tipo <strong>{matchedDuplicate.tipo}</strong> para esta misma persona ({matchedDuplicate.participantes[0]?.nombres} {matchedDuplicate.participantes[0]?.apellidos}) de fecha <strong>{matchedDuplicate.fechaSolicitud}</strong>.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200">
              ¿Deseas revisar la actuación existente o se trata de un nuevo trámite diferente?
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => {
                  setDuplicateWarningOpen(false);
                  setIsCreatingNew(false);
                  setSelectedActId(matchedDuplicate.id);
                }}
                className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                Ver actuación existente ({matchedDuplicate.codigo})
              </button>
              <button
                onClick={() => {
                  setDuplicateWarningOpen(false);
                  setStep(3);
                }}
                className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-600"
              >
                Es otro trámite, continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conclude Notarial Modal */}
      {showConcludeModal && selectedAct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
              Registrar entrega y concluir actuación · {selectedAct.codigo}
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Resultado de la actuación notarial <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={resultadoTexto}
                onChange={(e) => setResultadoTexto(e.target.value)}
                placeholder="Ej. Constancia de posesión otorgada formalmente en duplicado. Solicitante firmó en el libro de actas."
                className="w-full rounded-xl border border-stone-300 p-3 text-sm focus:border-emerald-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Referencia al libro físico de registro
              </label>
              <input
                type="text"
                value={refFisica}
                onChange={(e) => setRefFisica(e.target.value)}
                className="w-full rounded-xl border border-stone-300 p-2.5 text-sm dark:border-stone-700 dark:bg-stone-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setShowConcludeModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancelar
              </button>
              <button
                disabled={!resultadoTexto.trim()}
                onClick={() => {
                  updateActuacion(selectedAct.id, {
                    estado: "Concluida",
                    resultado: resultadoTexto,
                    referenciaFisica: refFisica,
                    fechaEntrega: "2026-09-30",
                  });
                  setShowConcludeModal(false);
                  setResultadoTexto("");
                }}
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-600 disabled:opacity-40"
              >
                Concluir actuación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
