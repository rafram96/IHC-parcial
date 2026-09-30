"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CloudUpload,
  Coffee,
  FileCheck2,
  FolderOpen,
  Home,
  Info,
  Leaf,
  Maximize2,
  Minimize2,
  RotateCcw,
  Scale,
  Settings2,
  Sun,
  Tablet,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { TabletHome } from "./tablet-home";
import { SaveConfirmation } from "./save-confirmation";
import { SyncPanel } from "./sync-panel";
import { RecordForm } from "./record-form";
import { RecordList, RecordDetail } from "./records";
import { ActivityForm, Agenda } from "./agenda";
import { useJornada } from "@/lib/use-jornada";
import {
  Activity,
  Draft,
  Kind,
  RecordItem,
  acknowledgeSnapshot,
  newActivity,
  newDraft,
  nextCode,
  validateDraft,
  validateActivity,
} from "@/lib/jornada";
import { cn } from "@/lib/utils";

const OfficeScene = dynamic(() => import("./office-scene"), {
  ssr: false,
  loading: () => <div className="office-scene scene-loading" />,
});
type Module = "home" | "case" | "notary" | "agenda" | "sync";
const navigation = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "case", label: "Casos", icon: FolderOpen },
  { id: "notary", label: "Actuaciones notariales", icon: FileCheck2 },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "sync", label: "Sincronización", icon: CloudUpload },
] as const;
const reasons = [
  [
    "Formularios en tres pasos",
    "La jueza atiende a personas mientras registra",
    "Segmentación y visibilidad del progreso",
    "Reduce la carga de memoria y permite retomar la tarea.",
  ],
  [
    "Contacto opcional y documento no disponible",
    "La información puede faltar durante la atención",
    "Prevención de errores y adecuación al contexto",
    "Evita inventar datos o bloquear una solicitud válida.",
  ],
  [
    "Guardado local inmediato por cada cambio",
    "La conexión es inestable y hay interrupciones",
    "Tolerancia a fallos y visibilidad del estado",
    "Conserva lo escrito al salir, recargar o perder Internet.",
  ],
  [
    "Estado del trámite separado del envío",
    "Concluir un caso no significa haberlo enviado",
    "Visibilidad del estado del sistema",
    "Evita confundir atención terminada con respaldo remoto.",
  ],
  [
    "Botones de 48 px, texto e iconos",
    "Uso táctil en una tableta de 10 pulgadas",
    "Ley de Fitts y codificación redundante",
    "Facilita acertar con el dedo y comprender sin depender del color.",
  ],
  [
    "Revisión de coincidencias antes de guardar",
    "Una persona puede acudir por distintos asuntos",
    "Prevención de errores y control del usuario",
    "Ayuda a detectar duplicados sin rechazar atenciones legítimas.",
  ],
  [
    "Agenda vinculada y semana visible",
    "Recordar compromisos sin volver a escribir los datos",
    "Reconocimiento antes que recuerdo",
    "Reduce omisiones y conserva el contexto de cada reunión.",
  ],
  [
    "Acceso directo y movimiento reducido",
    "Distintas capacidades y preferencias de navegación",
    "Control y libertad; accesibilidad",
    "Permite completar las tareas sin depender de la experiencia 3D.",
  ],
];

export default function Jornada() {
  const { db, ready, update, reset, saveState, storageError, current } =
    useJornada();
  const [view, setView] = useState<"office" | "launcher" | "app">("office");
  const [confirmation, setConfirmation] = useState<{
    id: string;
    kind: "record" | "activity";
  } | null>(null);
  const [started, setStarted] = useState(false);
  const [guided, setGuided] = useState(true);
  const [module, setModule] = useState<Module>("home");
  const [form, setForm] = useState<Kind | "activity" | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [realOnline, setRealOnline] = useState(true);
  const [offlineReady, setOfflineReady] = useState(false);
  const [info, setInfo] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [controls, setControls] = useState(false);
  const [syncState, setSyncState] = useState<
    "idle" | "sending" | "success" | "failed"
  >("idle");
  const [syncProgress, setSyncProgress] = useState(0);
  const [failNext, setFailNext] = useState(false);
  const online = realOnline && !simulatedOffline;
  const onlineRef = useRef(online);
  const syncToken = useRef(0);
  const syncing = useRef(false);
  const appScroll = useRef<HTMLDivElement>(null);
  const pending = [...db.records, ...db.activities].filter((r) => r.pending);
  const caseDone = db.milestones.includes("case"),
    notaryDone = db.milestones.includes("notary"),
    agendaDone = db.milestones.includes("agenda"),
    weekDone = db.milestones.includes("week"),
    syncDone = db.milestones.includes("sync");
  const chapter = !caseDone
    ? 0
    : !notaryDone
      ? 1
      : !agendaDone || !weekDone
        ? 2
        : 3;
  const record = db.records.find((r) => r.id === detail);
  useEffect(() => {
    onlineRef.current = online;
  }, [online]);
  useEffect(() => {
    const on = () => setRealOnline(navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    // This browser preference is unavailable during server rendering.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReduced(true);
    }
    let active = true;
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then((registration) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = (e) => {
            if (active && e.data === "OFFLINE_READY") setOfflineReady(true);
            channel.port1.close();
          };
          const assets = performance
            .getEntriesByType("resource")
            .map((entry) => entry.name)
            .filter(
              (url) =>
                url.startsWith(location.origin) &&
                /\.(js|css|woff2)(\?|$)/.test(url),
            );
          registration.active?.postMessage({ type: "CACHE_APP", assets }, [
            channel.port2,
          ]);
        })
        .catch(() => {
          if (active) setOfflineReady(false);
        });
    }
    // Invalidate the current asynchronous operation, not a captured DOM ref.
    return () => {
      active = false;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      syncToken.current++;
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);
  function mark(milestone: string) {
    if (!current.current.milestones.includes(milestone))
      update((old) => ({ ...old, milestones: [...old.milestones, milestone] }));
  }
  function navigate(next: Module) {
    setConfirmation(null);
    setModule(next);
    setForm(null);
    setDetail(null);
    appScroll.current?.scrollTo({ top: 0 });
  }
  function openRecord(id: string) {
    setConfirmation(null);
    const found = current.current.records.find((r) => r.id === id);
    if (found) {
      setModule(found.kind);
      setDetail(id);
      setForm(null);
      appScroll.current?.scrollTo({ top: 0 });
    }
  }
  function openForm(kind: Kind) {
    setConfirmation(null);
    if (
      !db.drafts[kind] &&
      !update((old) => ({
        ...old,
        drafts: { ...old.drafts, [kind]: newDraft(kind) },
      }))
    )
      return;
    setModule(kind);
    setForm(kind);
    setDetail(null);
    appScroll.current?.scrollTo({ top: 0 });
  }
  function changeDraft(draft: Draft) {
    update((old) => ({
      ...old,
      drafts: { ...old.drafts, [draft.kind]: draft },
    }));
    if (
      guided &&
      draft.kind === "case" &&
      draft.description.length >= 28 &&
      !current.current.milestones.includes("outage")
    ) {
      setSimulatedOffline(true);
      onlineRef.current = false;
      mark("outage");
    }
  }
  function saveRecord(draft: Draft) {
    if (Object.keys(validateDraft(draft, 2)).length) return;
    const id = nextCode(
      draft.kind === "case" ? "C" : "N",
      current.current.records,
    );
    const saved = update((old) => {
      const drafts = { ...old.drafts };
      delete drafts[draft.kind];
      return {
        ...old,
        drafts,
        records: [
          ...old.records,
          {
            ...draft,
            id,
            status: draft.kind === "case" ? "En trámite" : "Pendiente",
            result: "",
            attentionDate: "",
            completionDate: "",
            history: [
              { date: draft.date, text: "Registro creado en esta tableta." },
            ],
            pending: true,
            revision: 1,
          },
        ],
        milestones: [...new Set([...old.milestones, draft.kind])],
      };
    });
    if (saved) {
      setForm(null);
      setDetail(null);
      setConfirmation({ id, kind: "record" });
      appScroll.current?.scrollTo({ top: 0 });
    }
  }
  function schedule(linkedId = "") {
    setConfirmation(null);
    if (!db.activityDraft || linkedId) {
      const linked = db.records.find((r) => r.id === linkedId);
      if (
        !update((old) => ({
          ...old,
          activityDraft: {
            ...newActivity(linkedId),
            ...(linked
              ? {
                  title: `Atención de ${linked.people[0].name}`,
                  place: "Juzgado de paz",
                  description: linked.description,
                }
              : {}),
          },
        }))
      )
        return;
    }
    setModule("agenda");
    setForm("activity");
    setDetail(null);
    appScroll.current?.scrollTo({ top: 0 });
  }
  function saveActivity() {
    const draft = current.current.activityDraft;
    if (!draft || Object.keys(validateActivity(draft)).length) return;
    const id = nextCode("A", current.current.activities);
    if (
      update((old) => ({
        ...old,
        activityDraft: null,
        activities: [
          ...old.activities,
          { ...draft, id, pending: true, revision: 1 },
        ],
        records: old.records.map((r) =>
          r.id === draft.linkedId && r.kind === "case"
            ? {
                ...r,
                attentionDate: draft.date,
                pending: true,
                revision: r.revision + 1,
              }
            : r,
        ),
        milestones: [...new Set([...old.milestones, "agenda"])],
      }))
    ) {
      setForm(null);
      setConfirmation({ id, kind: "activity" });
      appScroll.current?.scrollTo({ top: 0 });
    }
  }
  function updateRecord(next: RecordItem) {
    const ok = update((old) => ({
      ...old,
      records: old.records.map((r) => (r.id === next.id ? next : r)),
      milestones: [...new Set([...old.milestones, next.kind])],
    }));
    if (ok) appScroll.current?.scrollTo({ top: 0 });
    return ok;
  }
  function updateActivity(next: Activity) {
    if (
      update((old) => ({
        ...old,
        activities: old.activities.map((a) => (a.id === next.id ? next : a)),
      }))
    )
      toast.success(`Actividad ${next.status.toLowerCase()}: cambio guardado`);
  }
  function cutInternet() {
    setSimulatedOffline(true);
    onlineRef.current = false;
    mark("outage");
  }
  async function synchronize() {
    if (!onlineRef.current || syncing.current) return;
    const snapshot = [...current.current.records, ...current.current.activities]
      .filter((r) => r.pending)
      .map(({ id, revision }) => ({ id, revision }));
    if (!snapshot.length) return;
    syncing.current = true;
    const token = ++syncToken.current;
    setSyncState("sending");
    setSyncProgress(0);
    const fail = failNext;
    setFailNext(false);
    for (let i = 1; i <= 4; i++) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      if (token !== syncToken.current) {
        syncing.current = false;
        return;
      }
      if (!onlineRef.current || (fail && i === 3)) {
        syncing.current = false;
        setSyncState("failed");
        return;
      }
      setSyncProgress(i * 25);
    }
    const saved = update((old) =>
      acknowledgeSnapshot(old, snapshot, new Date().toISOString()),
    );
    syncing.current = false;
    setSyncState(saved ? "success" : "failed");
  }
  function start(mode: boolean, direct = false) {
    setGuided(mode);
    setStarted(true);
    if (direct) {
      setView("app");
      setExpanded(true);
    }
  }
  const story =
    chapter === 0
      ? {
          person: "Mateo y Rosa",
          title: "«Queremos conversar sobre el lindero.»",
          text: "Mateo Huamán y Rosa Flores viven en Santa Rosa. No están de acuerdo con el límite entre sus terrenos. Rosa no tiene teléfono; puedes registrar el caso sin ese dato.",
          action: "Registrar el conflicto",
          run: () => {
            setView("app");
            openForm("case");
          },
        }
      : chapter === 1
        ? {
            person: "Lucía Torres",
            title: "«Necesito dejar constancia de mi firma.»",
            text: "Lucía vive en Santa Rosa y solicita una certificación de firmas para una declaración de entrega de herramientas. Ya acudió días atrás: revisa si se trata de la misma solicitud.",
            action: "Atender la solicitud",
            run: () => {
              setView("app");
              openForm("notary");
            },
          }
        : chapter === 2
          ? {
              person: "Antes de cerrar el día",
              title: "Un momento para organizar lo que sigue.",
              text: "Revisa los compromisos de la semana y reserva una reunión para el viernes 15 de mayo a las 11:00, en el local comunal de Santa Rosa.",
              action: "Consultar la semana",
              run: () => {
                setView("app");
                navigate("agenda");
              },
            }
          : {
              person: "En la sede con Internet",
              title: syncDone
                ? "Una jornada que queda registrada."
                : "Tus registros están listos para enviar.",
              text: syncDone
                ? "Completaste las atenciones, la agenda y el envío simulado. Puedes seguir explorando o revisar el fundamento de las decisiones."
                : "Conecta esta misma tableta y envía los cambios. Abrir otra computadora no recupera datos que todavía están solo aquí.",
              action: syncDone
                ? "Ver fundamento del diseño"
                : "Recuperar conexión y enviar",
              run: () => {
                if (syncDone) setInfo(true);
                else {
                  setSimulatedOffline(false);
                  onlineRef.current = realOnline;
                  setView("app");
                  navigate("sync");
                }
              },
            };
  if (!ready)
    return (
      <main className="loading-screen">
        <Scale size={40} />
        <p>Preparando tu jornada…</p>
      </main>
    );
  return (
    <main
      className={cn(
        "experience",
        reduced && "reduce-motion",
        view === "app" && expanded && "is-expanded",
      )}
    >
      <OfficeScene
        close={view !== "office"}
        reduced={reduced}
        visitors={
          chapter === 0 ? "neighbors" : chapter === 1 ? "notary" : "none"
        }
      />
      <div className="scene-shade" />
      <header className="experience-header">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView("office");
          }}
          className="brand"
        >
          <span className="brand-mark">
            <Scale size={25} />
          </span>
          <span>
            Mi jornada<small>JUSTICIA CERCANA</small>
          </span>
        </a>
        <div className="scene-location">
          <span className="live-dot" />
          Santa Rosa · Juzgado de paz
          <span className="header-divider" />
          12 de mayo de 2026
        </div>
        <Button variant="outline" onClick={() => setInfo(true)}>
          <Info data-icon="inline-start" />
          <span>Sobre la experiencia</span>
        </Button>
      </header>
      {view === "office" ? (
        <div className={cn("office-overlay", started && "has-started")}>
          {!started ? (
            <section className="intro">
              <p className="eyebrow">
                <span />
                UNA HISTORIA, DESDE TU LUGAR
              </p>
              <h1>
                La justicia empieza
                <br />
                por <em>escuchar.</em>
              </h1>
              <p className="intro-copy">
                Hoy eres la jueza de paz de Santa Rosa.
                <br />
                Dos vecinos esperan, una comunidad confía en ti.
                <br />
                Tu jornada está por comenzar.
              </p>
              <div className="intro-actions">
                <Button onClick={() => start(true)}>
                  Vivir la jornada
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button variant="outline" onClick={() => start(false, true)}>
                  Explorar libremente
                  <ArrowUpRight data-icon="inline-end" />
                </Button>
              </div>
              <p className="intro-note">
                <Coffee size={16} />A tu ritmo · Sin experiencia previa · Datos
                ficticios
              </p>
              <div className="intro-rule" />
              <div className="intro-bottom">
                <span>01 / ESCUCHAR</span>
                <span>02 / ACOMPAÑAR</span>
                <span>03 / ORGANIZAR</span>
              </div>
            </section>
          ) : (
            <section className="visitor-dialog">
              <p className="eyebrow">
                {guided ? `CAPÍTULO ${chapter + 1} DE 4` : "EXPLORACIÓN LIBRE"}{" "}
                · {story.person}
              </p>
              <h2>{story.title}</h2>
              <p>{story.text}</p>
              <div className="dialog-actions">
                <Button onClick={story.run}>
                  {story.action}
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button variant="outline" onClick={() => setView("launcher")}>
                  Usar la tableta
                  <Tablet data-icon="inline-end" />
                </Button>
              </div>
            </section>
          )}
          <button
            className="tablet-hotspot"
            onClick={() => {
              setStarted(true);
              setView("launcher");
            }}
            aria-label="Seleccionar la tableta"
          >
            <span>
              <Tablet size={19} />
              Toca la tableta para comenzar
              <ChevronRight size={17} />
            </span>
            <i />
          </button>
          <div className="scene-caption">
            <Sun size={18} />
            <span>
              Una mañana en Santa Rosa
              <small>Escenario ficticio de diseño · HCI</small>
            </span>
          </div>
        </div>
      ) : null}
      {view === "launcher" ? (
        <section className="launcher tablet-frame">
          <div className="launcher-top">
            <span>09:12 · martes 12 de mayo</span>
            <Wifi size={20} />
          </div>
          <div className="launcher-content">
            <p className="eyebrow">TU ESPACIO DE TRABAJO</p>
            <h2>Buenos días, jueza.</h2>
            <p>Todo lo que necesitas para acompañar a tu comunidad.</p>
            <button className="app-icon" onClick={() => setView("app")}>
              <span>
                <Scale size={44} />
              </span>
              <strong>Mi jornada</strong>
              <small>Justicia cercana</small>
            </button>
          </div>
          <Button variant="ghost" onClick={() => setView("office")}>
            <Users data-icon="inline-start" />
            Volver a las personas
          </Button>
        </section>
      ) : null}
      {view === "app" ? (
        <section
          className="tablet-frame application"
          aria-label="Aplicación Mi jornada"
        >
          <div className="tablet-topbar">
            <span>
              <Tablet size={15} />
              Mi tableta{" "}
              <span className="topbar-date">· Martes 12 de mayo</span>
            </span>
            <div>
              <Button variant="ghost" onClick={() => setView("office")}>
                <Users data-icon="inline-start" />
                Mirar a las personas
              </Button>
              <Button variant="ghost" onClick={() => setExpanded(!expanded)}>
                {expanded ? (
                  <Minimize2 data-icon="inline-start" />
                ) : (
                  <Maximize2 data-icon="inline-start" />
                )}
                {expanded ? "Reducir" : "Ampliar"}
              </Button>
              <Button variant="ghost" onClick={() => setView("launcher")}>
                <Home data-icon="inline-start" />
                Aplicaciones
              </Button>
            </div>
          </div>
          <div className="application-body">
            <header className="tablet-navigation">
              <button
                className="tablet-app-brand"
                onClick={() => navigate("home")}
                aria-label="Mi jornada, ir al inicio"
              >
                <Leaf />
                <span>Mi jornada</span>
              </button>
              <nav aria-label="Navegación principal">
                {navigation.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    aria-label={item.label}
                    aria-current={module === item.id ? "page" : undefined}
                    onClick={() => navigate(item.id)}
                  >
                    <item.icon data-icon="inline-start" />
                    <span>
                      {item.id === "notary" ? "Notariales" : item.label}
                    </span>
                  </Button>
                ))}
              </nav>
            </header>
            <div className="app-main">
              <div
                className={cn("connection-bar", !online && "offline")}
                role="status"
              >
                <span>
                  {online ? <Wifi size={17} /> : <WifiOff size={17} />}
                  {online ? "Con conexión" : "Sin conexión"}
                  <span className="connection-detail">
                    {" "}
                    ·{" "}
                    {pending.length
                      ? `${pending.length} cambios por enviar`
                      : "Sin registros pendientes"}
                  </span>
                </span>
                <button onClick={() => navigate("sync")}>
                  {saveState}
                  <ChevronRight size={15} />
                </button>
              </div>
              {!online ? (
                <div className="offline-notice" role="status">
                  Se perdió la conexión. Puedes continuar: tus cambios se
                  guardan en esta tableta.
                </div>
              ) : null}
              {storageError ? (
                <Alert variant="destructive">
                  <AlertTitle>No se ha confirmado el guardado</AlertTitle>
                  <AlertDescription>{storageError}</AlertDescription>
                </Alert>
              ) : null}
              <div className="app-content" ref={appScroll}>
                {confirmation ? (
                  <SaveConfirmation
                    record={
                      confirmation.kind === "record"
                        ? db.records.find((r) => r.id === confirmation.id)
                        : undefined
                    }
                    activity={
                      confirmation.kind === "activity"
                        ? db.activities.find((a) => a.id === confirmation.id)
                        : undefined
                    }
                    onView={() =>
                      confirmation.kind === "record"
                        ? openRecord(confirmation.id)
                        : navigate("agenda")
                    }
                    onHome={() => navigate("home")}
                  />
                ) : form === "case" || form === "notary" ? (
                  <RecordForm
                    key={form}
                    draft={db.drafts[form]!}
                    records={db.records}
                    saveState={saveState}
                    onChange={changeDraft}
                    onSave={saveRecord}
                    onBack={() => setForm(null)}
                    onOpen={openRecord}
                  />
                ) : form === "activity" && db.activityDraft ? (
                  <ActivityForm
                    draft={db.activityDraft}
                    records={db.records}
                    activities={db.activities}
                    onChange={(activityDraft) =>
                      update((old) => ({ ...old, activityDraft }))
                    }
                    onSave={saveActivity}
                    onBack={() => setForm(null)}
                  />
                ) : record ? (
                  <RecordDetail
                    key={record.id}
                    record={record}
                    onBack={() => setDetail(null)}
                    onUpdate={updateRecord}
                    onSchedule={() => schedule(record.id)}
                  />
                ) : module === "home" ? (
                  <TabletHome
                    db={db}
                    onRegister={openForm}
                    onAgenda={() => navigate("agenda")}
                    onSchedule={() => schedule()}
                    onCases={() => navigate("case")}
                  />
                ) : module === "case" || module === "notary" ? (
                  <RecordList
                    key={module}
                    kind={module}
                    records={db.records}
                    hasDraft={Boolean(db.drafts[module])}
                    onNew={() => openForm(module)}
                    onOpen={openRecord}
                  />
                ) : module === "agenda" ? (
                  <Agenda
                    activities={db.activities}
                    hasDraft={Boolean(db.activityDraft)}
                    onNew={() => schedule()}
                    onUpdate={updateActivity}
                    onOpen={openRecord}
                    onWeek={() => mark("week")}
                  />
                ) : (
                  <SyncPanel
                    db={db}
                    online={online}
                    state={syncState}
                    progress={syncProgress}
                    onSync={synchronize}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {started && guided && view !== "office" && !expanded ? (
        <aside className="story-strip">
          <span className="story-number">0{chapter + 1}</span>
          <div>
            <strong>{story.person}</strong>
            <p>{story.text}</p>
          </div>
          <Button variant="outline" onClick={story.run}>
            {story.action}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </aside>
      ) : null}
      <footer className="demo-bar">
        <div className="demo-label">
          <span />
          MODO DEMOSTRACIÓN
        </div>
        <div className="demo-actions">
          <Button
            variant="ghost"
            onClick={() =>
              online
                ? cutInternet()
                : (setSimulatedOffline(false), (onlineRef.current = realOnline))
            }
          >
            {online ? (
              <WifiOff data-icon="inline-start" />
            ) : (
              <Wifi data-icon="inline-start" />
            )}
            {online ? "Cortar Internet" : "Restablecer Internet"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setGuided(!guided);
              setStarted(true);
              if (view === "office") setView("app");
            }}
          >
            {guided ? "Explorar libremente" : "Vivir la jornada"}
          </Button>
          <Button variant="ghost" onClick={() => setControls(true)}>
            <Settings2 data-icon="inline-start" />
            Opciones
          </Button>
          <Button variant="ghost" onClick={() => setInfo(true)}>
            <BookOpen data-icon="inline-start" />
            Fundamento
          </Button>
          <Button
            variant="ghost"
            onClick={() => setResetOpen(true)}
            aria-label="Reiniciar demostración"
          >
            <RotateCcw />
          </Button>
        </div>
        <span className="demo-end">Diseñado para acercar.</span>
      </footer>
      <Dialog open={controls} onOpenChange={setControls}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controles de la demostración</DialogTitle>
            <DialogDescription>
              Estos controles pertenecen al escenario, fuera de la aplicación de
              la jueza.
            </DialogDescription>
          </DialogHeader>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={reduced}
              onChange={(e) => setReduced(e.target.checked)}
            />
            Reducir transiciones
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={failNext}
              onChange={(e) => setFailNext(e.target.checked)}
            />
            Simular un fallo en el próximo envío
          </label>
          <p>
            Conexión real del navegador:{" "}
            {realOnline ? "disponible" : "sin conexión"}. Conexión del
            escenario: {simulatedOffline ? "interrumpida" : "disponible"}.
          </p>
          <p>
            {offlineReady
              ? "Aplicación preparada para volver a abrirse sin conexión."
              : "La reapertura sin conexión se prepara en la versión de producción, tras cargar la aplicación."}
          </p>
          <Button
            onClick={() => {
              start(false, true);
              setControls(false);
            }}
          >
            Acceder directamente a la aplicación
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const blob = new Blob(
                [JSON.stringify(current.current, null, 2)],
                { type: "application/json" },
              );
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = "mi-jornada-datos-demo.json";
              anchor.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            Exportar una copia de los datos de prueba
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={info} onOpenChange={setInfo}>
        <DialogContent className="design-dialog">
          <DialogHeader>
            <DialogTitle>Una interfaz que acompaña</DialogTitle>
            <DialogDescription>
              Fundamento del diseño · Caso Justicia cercana, examen de HCI de
              UTEC, 12/05/2026.
            </DialogDescription>
          </DialogHeader>
          <p>
            Escenario de diseño con personajes y datos ficticios. No representa
            investigación ni validación con personas usuarias reales.
          </p>
          <div className="source-notes">
            <p>
              <strong>Requisitos del examen:</strong> casos, actuaciones
              notariales, agenda mensual y diaria, uso táctil en tableta de 10
              pulgadas, funcionamiento sin conexión y confirmación de
              sincronización.
            </p>
            <p>
              <strong>Decisiones de la propuesta:</strong> oficina 3D, historia
              guiada, comunidad Santa Rosa, pasos del formulario, estado En
              espera, borradores automáticos, vínculo con la agenda y controles
              de simulación.
            </p>
            <p>
              <strong>Alcance:</strong> almacenamiento local real, sin cifrado
              ni autenticación; solo datos de prueba. Sincronización simulada,
              sin servidor. La reapertura sin conexión se comprueba en
              producción para la aplicación; la escena 3D no es necesaria para
              atender.
            </p>
          </div>
          {reasons.map(([decision, need, principle, benefit]) => (
            <article className="design-reason" key={decision}>
              <h3>{decision}</h3>
              <p>
                <strong>Necesidad:</strong> {need}
              </p>
              <p>
                <strong>Principio o factor:</strong> {principle}
              </p>
              <p>
                <strong>Beneficio:</strong> {benefit}
              </p>
            </article>
          ))}
          <Button variant="outline" onClick={() => setInfo(false)}>
            Volver a la jornada
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Reiniciar la demostración?</DialogTitle>
            <DialogDescription>
              Se eliminarán los casos, actuaciones, actividades y borradores de
              prueba creados en este navegador. Volverán los ejemplos iniciales.
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Conservar mi trabajo
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!reset()) return;
                syncToken.current++;
                syncing.current = false;
                setView("office");
                setStarted(false);
                setGuided(true);
                setModule("home");
                setConfirmation(null);
                setForm(null);
                setDetail(null);
                setSimulatedOffline(false);
                setSyncState("idle");
                setSyncProgress(0);
                setFailNext(false);
                setResetOpen(false);
                toast.success("Demostración reiniciada");
              }}
            >
              Eliminar datos de prueba y reiniciar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster position="top-center" richColors />
    </main>
  );
}
