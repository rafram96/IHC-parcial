"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  INITIAL_AGENDA,
  INITIAL_CASES,
  INITIAL_NOTARIAL,
  STORY_ACTS,
} from "./initial-data";
import {
  ActividadAgenda,
  ActuacionNotarial,
  AvanceCaso,
  Caso,
  StoryAct,
} from "./types";

export type ViewPerspective = "office" | "tablet" | "fullscreen";
export type TabKey =
  | "inicio"
  | "casos"
  | "actuaciones"
  | "agenda"
  | "sincronizacion"
  | "buscar";

interface AppContextType {
  cases: Caso[];
  notarials: ActuacionNotarial[];
  agenda: ActividadAgenda[];
  isOnline: boolean;
  offlineBanner: boolean;
  setOfflineBanner: (visible: boolean) => void;
  toggleOnline: (forcedValue?: boolean) => void;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  viewPerspective: ViewPerspective;
  setViewPerspective: (p: ViewPerspective) => void;
  tabletAppOpen: boolean;
  setTabletAppOpen: (open: boolean) => void;
  storyMode: "story" | "free";
  setStoryMode: (mode: "story" | "free") => void;
  currentActIndex: number;
  currentAct: StoryAct;
  dialogIndex: number;
  nextDialog: () => void;
  prevDialog: () => void;
  nextAct: () => void;
  prevAct: () => void;
  setActIndex: (index: number) => void;
  isJustificationOpen: boolean;
  setIsJustificationOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Drafts
  draftCaso: Partial<Caso> | null;
  saveDraftCaso: (data: Partial<Caso>) => void;
  clearDraftCaso: () => void;
  draftActuacion: Partial<ActuacionNotarial> | null;
  saveDraftActuacion: (data: Partial<ActuacionNotarial>) => void;
  clearDraftActuacion: () => void;
  draftStatus: "idle" | "saving" | "saved";
  // Crud
  addCaso: (caso: Caso) => void;
  updateCaso: (id: string, partial: Partial<Caso>) => void;
  addAvanceCaso: (
    casoId: string,
    avance: AvanceCaso,
    proximaFecha?: string,
    vincularAgenda?: boolean
  ) => void;
  concluirCaso: (casoId: string, resultado: string) => void;
  addActuacion: (act: ActuacionNotarial) => void;
  updateActuacion: (id: string, partial: Partial<ActuacionNotarial>) => void;
  addActividad: (act: ActividadAgenda) => void;
  updateActividad: (id: string, partial: Partial<ActividadAgenda>) => void;
  // Sync
  lastSyncTime: string | null;
  syncInProgress: boolean;
  syncProgress: number;
  syncLog: string[];
  syncError: boolean;
  synchronizeAll: (simulateFailure?: boolean) => Promise<boolean>;
  getPendingSyncCount: () => number;
  getRequiereAtencionCount: () => number;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_CASES = "jc_cases_v2";
const STORAGE_KEY_NOTARIAL = "jc_notarial_v2";
const STORAGE_KEY_AGENDA = "jc_agenda_v2";
const STORAGE_KEY_LAST_SYNC = "jc_last_sync_v2";
const STORAGE_KEY_DRAFT_CASO = "jc_draft_caso_v2";
const STORAGE_KEY_DRAFT_ACT = "jc_draft_act_v2";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<Caso[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_CASES);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_CASES;
  });

  const [notarials, setNotarials] = useState<ActuacionNotarial[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_NOTARIAL);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_NOTARIAL;
  });

  const [agenda, setAgenda] = useState<ActividadAgenda[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_AGENDA);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_AGENDA;
  });

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineBanner, setOfflineBanner] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabKey>("inicio");
  const [viewPerspective, setViewPerspective] = useState<ViewPerspective>("office");
  const [tabletAppOpen, setTabletAppOpen] = useState<boolean>(true);
  const [storyMode, setStoryMode] = useState<"story" | "free">("story");
  const [currentActIndex, setCurrentActIndex] = useState<number>(0);
  const [dialogIndex, setDialogIndex] = useState<number>(0);
  const [isJustificationOpen, setIsJustificationOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [draftCaso, setDraftCasoState] = useState<Partial<Caso> | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_DRAFT_CASO);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return null;
  });

  const [draftActuacion, setDraftActuacionState] = useState<Partial<ActuacionNotarial> | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_DRAFT_ACT);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return null;
  });

  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");

  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_LAST_SYNC);
        if (stored) return stored;
      } catch {}
    }
    return "Hoy 08:30";
  });

  const [syncInProgress, setSyncInProgress] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [syncError, setSyncError] = useState<boolean>(false);

  // Save to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(cases));
    } catch {}
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTARIAL, JSON.stringify(notarials));
    } catch {}
  }, [notarials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AGENDA, JSON.stringify(agenda));
    } catch {}
  }, [agenda]);

  const toggleOnline = useCallback((forcedValue?: boolean) => {
    setIsOnline((prev) => {
      const next = forcedValue !== undefined ? forcedValue : !prev;
      if (!next) {
        setOfflineBanner(true);
      } else {
        setOfflineBanner(false);
      }
      return next;
    });
  }, []);

  const saveDraftCaso = useCallback((data: Partial<Caso>) => {
    setDraftStatus("saving");
    setDraftCasoState(data);
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT_CASO, JSON.stringify(data));
    } catch {}
    setTimeout(() => {
      setDraftStatus("saved");
    }, 350);
  }, []);

  const clearDraftCaso = useCallback(() => {
    setDraftCasoState(null);
    try {
      localStorage.removeItem(STORAGE_KEY_DRAFT_CASO);
    } catch {}
    setDraftStatus("idle");
  }, []);

  const saveDraftActuacion = useCallback((data: Partial<ActuacionNotarial>) => {
    setDraftStatus("saving");
    setDraftActuacionState(data);
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT_ACT, JSON.stringify(data));
    } catch {}
    setTimeout(() => {
      setDraftStatus("saved");
    }, 350);
  }, []);

  const clearDraftActuacion = useCallback(() => {
    setDraftActuacionState(null);
    try {
      localStorage.removeItem(STORAGE_KEY_DRAFT_ACT);
    } catch {}
    setDraftStatus("idle");
  }, []);

  const addCaso = useCallback(
    (nuevoCaso: Caso) => {
      setCases((prev) => [nuevoCaso, ...prev]);
      clearDraftCaso();
    },
    [clearDraftCaso]
  );

  const updateCaso = useCallback((id: string, partial: Partial<Caso>) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...partial,
              syncEstado: "local",
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
  }, []);

  const addAvanceCaso = useCallback(
    (
      casoId: string,
      avance: AvanceCaso,
      proximaFecha?: string,
      vincularAgenda?: boolean
    ) => {
      setCases((prev) =>
        prev.map((c) => {
          if (c.id !== casoId) return c;
          const nextHistorial = [...c.historial, avance];
          return {
            ...c,
            historial: nextHistorial,
            proximaFechaAtencion: proximaFecha || c.proximaFechaAtencion,
            requiereAtencion: proximaFecha ? true : c.requiereAtencion,
            syncEstado: "local",
            updatedAt: new Date().toISOString(),
          };
        })
      );

      if (vincularAgenda && proximaFecha) {
        const found = cases.find((c) => c.id === casoId);
        const newAct: ActividadAgenda = {
          id: `ACT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          titulo: `Atención de caso: ${found ? found.codigo : casoId}`,
          tipo: "Audiencia",
          fecha: proximaFecha,
          horaInicio: "10:00",
          horaFin: "11:30",
          lugar: "Despacho del Juzgado de Paz de Huasicancha",
          motivo: avance.descripcion,
          estado: "Programada",
          casoVinculadoId: casoId,
          syncEstado: "local",
          updatedAt: new Date().toISOString(),
        };
        setAgenda((prev) => [newAct, ...prev]);
      }
    },
    [cases]
  );

  const concluirCaso = useCallback((casoId: string, resultado: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === casoId
          ? {
              ...c,
              estado: "Concluido",
              resultado,
              requiereAtencion: false,
              syncEstado: "local",
              updatedAt: new Date().toISOString(),
              historial: [
                ...c.historial,
                {
                  id: `h-concl-${Date.now()}`,
                  fecha: new Date().toISOString().slice(0, 10),
                  descripcion: "Caso concluido formalmente.",
                  resultado,
                },
              ],
            }
          : c
      )
    );
  }, []);

  const addActuacion = useCallback(
    (act: ActuacionNotarial) => {
      setNotarials((prev) => [act, ...prev]);
      clearDraftActuacion();
    },
    [clearDraftActuacion]
  );

  const updateActuacion = useCallback(
    (id: string, partial: Partial<ActuacionNotarial>) => {
      setNotarials((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                ...partial,
                syncEstado: "local",
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );
    },
    []
  );

  const addActividad = useCallback((act: ActividadAgenda) => {
    setAgenda((prev) => [act, ...prev]);
  }, []);

  const updateActividad = useCallback(
    (id: string, partial: Partial<ActividadAgenda>) => {
      setAgenda((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                ...partial,
                syncEstado: "local",
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );
    },
    []
  );

  const getPendingSyncCount = useCallback(() => {
    const pendCases = cases.filter((c) => c.syncEstado === "local").length;
    const pendNotarials = notarials.filter((n) => n.syncEstado === "local").length;
    const pendAgenda = agenda.filter((a) => a.syncEstado === "local").length;
    return pendCases + pendNotarials + pendAgenda;
  }, [cases, notarials, agenda]);

  const getRequiereAtencionCount = useCallback(() => {
    return cases.filter((c) => c.requiereAtencion && c.estado !== "Concluido").length;
  }, [cases]);

  const synchronizeAll = useCallback(
    async (simulateFailure: boolean = false): Promise<boolean> => {
      if (!isOnline) {
        setSyncError(true);
        setSyncLog(["Error: No hay conexión a Internet en la tableta."]);
        return false;
      }

      setSyncInProgress(true);
      setSyncError(false);
      setSyncProgress(10);
      setSyncLog(["Iniciando enlace seguro con el servidor del Poder Judicial..."]);

      await new Promise((r) => setTimeout(r, 600));
      setSyncProgress(35);
      setSyncLog((prev) => [
        ...prev,
        "Comprobando integridad de firmas y registros locales...",
      ]);

      await new Promise((r) => setTimeout(r, 700));
      setSyncProgress(65);

      if (simulateFailure) {
        setSyncProgress(70);
        setSyncError(true);
        setSyncLog((prev) => [
          ...prev,
          "⚠ Se interrumpió la transferencia en el 70%.",
          "Tus datos se mantienen a salvo en la tableta. Puedes reintentar cuando la señal sea estable.",
        ]);
        setSyncInProgress(false);
        return false;
      }

      setSyncLog((prev) => [
        ...prev,
        "Transmitiendo casos judiciales, actuaciones notariales y agenda...",
      ]);
      await new Promise((r) => setTimeout(r, 800));
      setSyncProgress(100);

      // Mark all as synchronized
      setCases((prev) => prev.map((c) => ({ ...c, syncEstado: "sincronizado" })));
      setNotarials((prev) => prev.map((n) => ({ ...n, syncEstado: "sincronizado" })));
      setAgenda((prev) => prev.map((a) => ({ ...a, syncEstado: "sincronizado" })));

      const timeStr = `Hoy ${new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
      setLastSyncTime(timeStr);
      try {
        localStorage.setItem(STORAGE_KEY_LAST_SYNC, timeStr);
      } catch {}

      setSyncLog((prev) => [
        ...prev,
        "✓ ¡Sincronización completada con éxito!",
        `Todos los registros respaldados formalmente (${timeStr}).`,
      ]);
      setSyncInProgress(false);
      return true;
    },
    [isOnline]
  );

  const resetAllData = useCallback(() => {
    setCases(INITIAL_CASES);
    setNotarials(INITIAL_NOTARIAL);
    setAgenda(INITIAL_AGENDA);
    setLastSyncTime("Hoy 08:30");
    setDraftCasoState(null);
    setDraftActuacionState(null);
    setCurrentActIndex(0);
    setDialogIndex(0);
    setIsOnline(true);
    setOfflineBanner(false);
    setActiveTab("inicio");
    try {
      localStorage.removeItem(STORAGE_KEY_CASES);
      localStorage.removeItem(STORAGE_KEY_NOTARIAL);
      localStorage.removeItem(STORAGE_KEY_AGENDA);
      localStorage.removeItem(STORAGE_KEY_LAST_SYNC);
      localStorage.removeItem(STORAGE_KEY_DRAFT_CASO);
      localStorage.removeItem(STORAGE_KEY_DRAFT_ACT);
    } catch {}
  }, []);

  const currentAct = STORY_ACTS[currentActIndex] || STORY_ACTS[0];

  const setActIndex = useCallback((index: number) => {
    if (index >= 0 && index < STORY_ACTS.length) {
      setCurrentActIndex(index);
      setDialogIndex(0);
      const act = STORY_ACTS[index];
      if (act.offlineSimulated) {
        setIsOnline(false);
        setOfflineBanner(true);
      } else {
        setIsOnline(true);
        setOfflineBanner(false);
      }
      setActiveTab(act.targetModule);
    }
  }, []);

  const nextAct = useCallback(() => {
    if (currentActIndex < STORY_ACTS.length - 1) {
      setActIndex(currentActIndex + 1);
    }
  }, [currentActIndex, setActIndex]);

  const prevAct = useCallback(() => {
    if (currentActIndex > 0) {
      setActIndex(currentActIndex - 1);
    }
  }, [currentActIndex, setActIndex]);

  const nextDialog = useCallback(() => {
    if (dialogIndex < currentAct.dialogs.length - 1) {
      setDialogIndex((prev) => prev + 1);
    } else {
      nextAct();
    }
  }, [dialogIndex, currentAct.dialogs.length, nextAct]);

  const prevDialog = useCallback(() => {
    if (dialogIndex > 0) {
      setDialogIndex((prev) => prev - 1);
    }
  }, [dialogIndex]);

  return (
    <AppContext.Provider
      value={{
        cases,
        notarials,
        agenda,
        isOnline,
        offlineBanner,
        setOfflineBanner,
        toggleOnline,
        activeTab,
        setActiveTab,
        viewPerspective,
        setViewPerspective,
        tabletAppOpen,
        setTabletAppOpen,
        storyMode,
        setStoryMode,
        currentActIndex,
        currentAct,
        dialogIndex,
        nextDialog,
        prevDialog,
        nextAct,
        prevAct,
        setActIndex,
        isJustificationOpen,
        setIsJustificationOpen,
        searchQuery,
        setSearchQuery,
        draftCaso,
        saveDraftCaso,
        clearDraftCaso,
        draftActuacion,
        saveDraftActuacion,
        clearDraftActuacion,
        draftStatus,
        addCaso,
        updateCaso,
        addAvanceCaso,
        concluirCaso,
        addActuacion,
        updateActuacion,
        addActividad,
        updateActividad,
        lastSyncTime,
        syncInProgress,
        syncProgress,
        syncLog,
        syncError,
        synchronizeAll,
        getPendingSyncCount,
        getRequiereAtencionCount,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
