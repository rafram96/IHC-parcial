"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Database, STORAGE_KEY, seedDatabase } from "./jornada";

export function useJornada() {
  const [db, setDb] = useState<Database>(seedDatabase);
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState("Guardado en esta tableta");
  const [storageError, setStorageError] = useState("");
  const current = useRef(db);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blocked = useRef(false);
  // Read browser-only storage once after hydration; the loading shell prevents stale UI.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed.version !== 1 ||
          !Array.isArray(parsed.records) ||
          !Array.isArray(parsed.activities) ||
          !parsed.drafts ||
          !Array.isArray(parsed.milestones)
        )
          throw new Error("invalid");
        current.current = parsed;
        setDb(parsed);
      }
    } catch {
      blocked.current = true;
      setStorageError(
        "No se pudo leer el almacenamiento. No sobrescribiremos los datos existentes. Exporta una copia o reinicia la demostración.",
      );
    }
    setReady(true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  const update = useCallback((recipe: (old: Database) => Database) => {
    if (blocked.current) return false;
    const next = recipe(current.current);
    setSaveState("Guardando…");
    try {
      // Persist synchronously before confirming: closing a tab never loses a keystroke.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      current.current = next;
      setDb(next);
      setStorageError("");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => setSaveState("Guardado en esta tableta"),
        350,
      );
      return true;
    } catch {
      setStorageError(
        "No se pudo guardar en esta tableta. Libera espacio o permite el almacenamiento y vuelve a intentarlo. El último cambio no se guardó.",
      );
      setSaveState("No guardado");
      return false;
    }
  }, []);
  const reset = useCallback(() => {
    blocked.current = false;
    return update(() => seedDatabase());
  }, [update]);
  return { db, ready, saveState, storageError, update, reset, current };
}
