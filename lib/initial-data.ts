import {
  ActividadAgenda,
  ActuacionNotarial,
  Caso,
  JustificationItem,
  StoryAct,
} from "./types";

export const INITIAL_CASES: Caso[] = [
  {
    id: "C-2026-0001",
    codigo: "C-2026-0001",
    fechaRegistro: "2026-09-28",
    materia: "Terrenos y linderos",
    motivo:
      "Desacuerdo por la colocación de un cerco de piedras en el límite de la chacra de papas y desvío de la acequia de riego comunal.",
    estado: "En trámite",
    observaciones:
      "Ambas partes manifiestan voluntad de diálogo para evitar daños en la siembra de la próxima semana.",
    partes: [
      {
        id: "p-01",
        nombres: "Faustino",
        apellidos: "Quispe Mayta",
        tipoDoc: "No tiene / no lo trajo",
        numDoc: "",
        telefono: "Sin teléfono personal (avisar con teniente gobernador)",
        comunidad: "Huasicancha Alta",
        direccion: "Paraje Callqui s/n",
        rol: "Solicitante",
      },
      {
        id: "p-02",
        nombres: "Bertha",
        apellidos: "Mamani Soto",
        tipoDoc: "DNI",
        numDoc: "20458912",
        telefono: "964112233",
        comunidad: "Huasicancha Centro",
        direccion: "Jr. Comercio 124",
        rol: "Invitado",
      },
    ],
    historial: [
      {
        id: "h-01",
        fecha: "2026-09-28",
        descripcion:
          "Se recibió a Don Faustino Quispe. Se le explicó el proceso de conciliación de paz.",
        proximaFecha: "2026-09-30",
      },
    ],
    proximaFechaAtencion: "2026-09-30",
    requiereAtencion: true, // Mañana tiene audiencia
    syncEstado: "sincronizado",
    updatedAt: "2026-09-28T10:30:00Z",
  },
  {
    id: "C-2026-0002",
    codigo: "C-2026-0002",
    fechaRegistro: "2026-09-15",
    materia: "Deudas",
    motivo:
      "Préstamo de 800 soles para compra de abono orgánico no cancelado en la fecha pactada del mes anterior.",
    estado: "En espera",
    observaciones:
      "El deudor viajó a Huancayo por venta de ganado. Pendiente su retorno para firmar acta de compromiso.",
    partes: [
      {
        id: "p-03",
        nombres: "Teófilo",
        apellidos: "Meza Alanya",
        tipoDoc: "DNI",
        numDoc: "19842510",
        telefono: "954781200",
        comunidad: "Cullhuas",
        direccion: "Barrio San Cristóbal",
        rol: "Solicitante",
      },
      {
        id: "p-04",
        nombres: "Juan",
        apellidos: "Rojas Vilca",
        tipoDoc: "DNI",
        numDoc: "41258796",
        telefono: "998231456",
        comunidad: "Huasicancha",
        direccion: "Camino real km 3",
        rol: "Invitado",
      },
    ],
    historial: [
      {
        id: "h-02",
        fecha: "2026-09-15",
        descripcion: "Recepción de la solicitud y emisión de invitación para conciliar.",
      },
    ],
    proximaFechaAtencion: "2026-10-05",
    requiereAtencion: false,
    syncEstado: "sincronizado",
    updatedAt: "2026-09-15T15:20:00Z",
  },
  {
    id: "C-2026-0003",
    codigo: "C-2026-0003",
    fechaRegistro: "2026-08-20",
    materia: "Daños",
    motivo:
      "Ingreso de cinco ovinos a terreno con sembrío de habas con pérdida de brotes nuevos.",
    estado: "Concluido",
    observaciones:
      "Acuerdo satisfactorio. Se entregaron dos sacos de semilla de papa en compensación.",
    partes: [
      {
        id: "p-05",
        nombres: "Marcelina",
        apellidos: "Gómez Paucar",
        tipoDoc: "DNI",
        numDoc: "20147852",
        telefono: "987456321",
        comunidad: "Huasicancha",
        direccion: "Sector Pampa Grande",
        rol: "Solicitante",
      },
    ],
    historial: [
      {
        id: "h-03",
        fecha: "2026-08-20",
        descripcion: "Audiencia de conciliación con acuerdo total inmediato.",
        resultado: "Acuerdo de entrega de 2 sacos de semilla de papa cumplido con satisfacción.",
      },
    ],
    resultado: "Acuerdo amistoso cumplido de compensación de semillas. Caso archivado.",
    requiereAtencion: false,
    syncEstado: "sincronizado",
    updatedAt: "2026-08-20T17:00:00Z",
  },
];

export const INITIAL_NOTARIAL: ActuacionNotarial[] = [
  {
    id: "N-2026-0012",
    codigo: "N-2026-0012",
    fechaSolicitud: "2026-09-08",
    fechaAtencion: "2026-09-08",
    tipo: "Constancia de posesión",
    asunto:
      "Constancia de posesión continua y pacífica del predio rústico 'Chaupimarca' para solicitud de medidor comunal de agua.",
    estado: "Concluida",
    observaciones: "Presentó constancia de autoridades comunales y colindantes conformes.",
    participantes: [
      {
        id: "pn-01",
        nombres: "Gregoria",
        apellidos: "Condori Páucar",
        tipoDoc: "DNI",
        numDoc: "20584913",
        telefono: "964789521",
        comunidad: "Huasicancha",
        direccion: "Sector Chaupimarca",
        rol: "Solicitante",
      },
    ],
    resultado: "Constancia emitida en original y copia para el archivo comunal.",
    fechaEntrega: "2026-09-08",
    referenciaFisica: "Libro de Actuaciones Notariales 2026, Folio 45",
    syncEstado: "sincronizado",
    updatedAt: "2026-09-08T11:45:00Z",
  },
  {
    id: "N-2026-0013",
    codigo: "N-2026-0013",
    fechaSolicitud: "2026-09-22",
    fechaAtencion: "2026-09-22",
    tipo: "Certificación de firmas",
    asunto:
      "Certificación de firma en carta poder simple para cobro de pensión en la agencia del Banco de la Nación en Chupaca.",
    estado: "Atendida",
    observaciones: "El solicitante cuenta con firma registrada en Reniec coincidente.",
    participantes: [
      {
        id: "pn-02",
        nombres: "Saturnino",
        apellidos: "Huaynalaya Ramos",
        tipoDoc: "DNI",
        numDoc: "19745812",
        telefono: "951234789",
        comunidad: "Cullhuas",
        direccion: "Calle Real 45",
        rol: "Solicitante",
      },
    ],
    resultado: "Firma debidamente cotejada y legalizada.",
    fechaEntrega: "2026-09-22",
    referenciaFisica: "Libro de Certificaciones 2026, Folio 12",
    syncEstado: "sincronizado",
    updatedAt: "2026-09-22T09:15:00Z",
  },
];

export const INITIAL_AGENDA: ActividadAgenda[] = [
  {
    id: "ACT-2026-0001",
    titulo: "Audiencia de conciliación por linderos (Quispe vs Mamani)",
    tipo: "Audiencia",
    fecha: "2026-09-30",
    horaInicio: "09:30",
    horaFin: "11:00",
    lugar: "Despacho del Juzgado de Paz de Huasicancha",
    motivo: "Reunión de diálogo sobre delimitación de acequia de riego.",
    estado: "Programada",
    casoVinculadoId: "C-2026-0001",
    syncEstado: "sincronizado",
    updatedAt: "2026-09-28T10:35:00Z",
  },
  {
    id: "ACT-2026-0002",
    titulo: "Inspección ocular de terreno en paraje Callqui",
    tipo: "Visita",
    fecha: "2026-10-01",
    horaInicio: "14:00",
    horaFin: "16:30",
    lugar: "Paraje Callqui, Huasicancha Alta",
    motivo: "Constatación física de estacas y piedras divisorias.",
    estado: "Programada",
    casoVinculadoId: "C-2026-0001",
    syncEstado: "sincronizado",
    updatedAt: "2026-09-28T10:40:00Z",
  },
  {
    id: "ACT-2026-0003",
    titulo: "Reunión de coordinación con Teniente Gobernador",
    tipo: "Reunión",
    fecha: "2026-10-02",
    horaInicio: "10:00",
    horaFin: "11:30",
    lugar: "Local Comunal de Huasicancha",
    motivo: "Coordinar apoyo para notificaciones en anexos lejanos.",
    estado: "Programada",
    syncEstado: "sincronizado",
    updatedAt: "2026-09-25T14:00:00Z",
  },
];

export const STORY_ACTS: StoryAct[] = [
  {
    id: 1,
    title: "Acto 1: Conflicto vecinal y recepción de partes",
    subtitle: "Llegada de Don Faustino y Doña Bertha al despacho",
    scenario:
      "En la mañana llegan Don Faustino Quispe y Doña Bertha Mamani. Discuten por un lindero y el agua de la acequia. Don Faustino explica que no dispone de celular y no trajo su DNI.",
    targetModule: "casos",
    offlineSimulated: false,
    dialogs: [
      {
        speaker: "Don Faustino Quispe",
        role: "Comunero de Huasicancha Alta (68 años)",
        text: "Buenos días señorita Jueza. Vengo porque Doña Bertha ha movido las piedras del lindero de mi chacra de papas y está tapando la acequia del riego.",
        hint: "Don Faustino no tiene celular ni DNI a la mano.",
      },
      {
        speaker: "Doña Bertha Mamani",
        role: "Vecina colindante (62 años)",
        text: "Señorita Jueza, no es así. El agua se estaba desbordando hacia mi sembrío y tuve que calzar las piedras. Yo traje mi DNI, aquí lo tengo.",
        hint: "Doña Bertha sí tiene DNI.",
      },
      {
        speaker: "Don Faustino Quispe",
        role: "Comunero de Huasicancha Alta",
        text: "Disculpe señorita Jueza, mi DNI se me quedó en la choza y teléfono celular no tengo allá arriba. Avísenme no más con el Teniente Gobernador.",
        hint: "El formulario permite avanzar seleccionando 'No tiene / no lo trajo' y contacto alternativo.",
        actionPrompt:
          "Toca la tableta para abrir 'Mi jornada', entra a Casos y presiona 'Registrar nuevo caso'. Completa los 3 pasos sin exigir teléfono obligatorio.",
      },
    ],
  },
  {
    id: 2,
    title: "Acto 2: Solicitud de actuación notarial",
    subtitle: "Atención de Doña Gregoria Condori",
    scenario:
      "Doña Gregoria solicita una constancia de posesión. La aplicación previene duplicados y explica con claridad el tipo de trámite.",
    targetModule: "actuaciones",
    offlineSimulated: false,
    dialogs: [
      {
        speaker: "Doña Gregoria Condori",
        role: "Pobladora de Chaupimarca",
        text: "Buenos días Jueza. Para el medidor de luz en la comunidad me piden una Constancia de posesión de mi terreno. ¿Usted me la puede otorgar?",
        hint: "En el formulario verás tarjetas explicativas en lenguaje sencillo.",
      },
      {
        speaker: "Jueza de Paz",
        role: "Tu despacho",
        text: "Buenos días Doña Gregoria. Con mucho gusto. Vamos a revisar sus datos en la tableta y registrar la solicitud notarial.",
        hint: "Al registrar a Doña Gregoria, la aplicación detectará si ya cuenta con un trámite anterior en los últimos 30 días para evitar duplicados.",
        actionPrompt:
          "En la tableta, ve al módulo 'Actuaciones notariales' y presiona 'Registrar actuación'. Selecciona 'Constancia de posesión' y revisa la detección preventiva de duplicados.",
      },
    ],
  },
  {
    id: 3,
    title: "Acto 3: Consulta de agenda y programación",
    subtitle: "Coordinación con el Teniente Gobernador Don Eloy",
    scenario:
      "Llega Don Eloy Huamán a coordinar las actividades de la semana y acordar la fecha de la audiencia de conciliación.",
    targetModule: "agenda",
    offlineSimulated: false,
    dialogs: [
      {
        speaker: "Don Eloy Huamán",
        role: "Teniente Gobernador Comunal",
        text: "Buenos días Jueza. Vengo a coordinar: ¿qué compromisos tiene programados para esta semana? Queremos fijar la asamblea del pueblo sin cruzar con sus audiencias.",
        hint: "La jueza necesita revisar la vista de semana y día.",
      },
      {
        speaker: "Jueza de Paz",
        role: "Tu despacho",
        text: "Don Eloy, voy a revisar la agenda en la tableta. Con la vista semanal puedo ver de un vistazo qué días tengo audiencias y qué días están libres.",
        hint: "Cada actividad tiene color + ícono + texto descriptivo para máxima accesibilidad.",
        actionPrompt:
          "Ve a 'Agenda', explora la vista 'Semana / Próximas' para responder al Teniente Gobernador y programa una nueva reunión comunal.",
      },
    ],
  },
  {
    id: 4,
    title: "Acto 4: Escena central — Pérdida de Internet mientras se escribe",
    subtitle: "Corte de conexión durante el registro de información",
    scenario:
      "Mientras redactas en la tableta, el viento andino o la antena repetidora se cae y se interrumpe Internet. La aplicación sigue funcionando sin perder el foco ni los datos.",
    targetModule: "casos",
    offlineSimulated: true,
    dialogs: [
      {
        speaker: "Sistema / Entorno",
        role: "Acontecimiento de la jornada",
        text: "⚡ Se ha interrumpido el enlace satelital en la comunidad de Huasicancha. La tableta se queda sin conexión a Internet.",
        hint: "Aviso discreto: 'Se perdió la conexión. Puedes continuar: tus cambios se guardan en esta tableta'.",
      },
      {
        speaker: "Jueza de Paz",
        role: "Tu despacho",
        text: "Se fue la señal de la antena... Pero la tableta me avisa que todo se sigue guardando localmente. Puedo terminar de escribir el caso con calma.",
        hint: "El borrador se autoguarda en localStorage y el contador de pendientes sube a ámbar ⏳.",
        actionPrompt:
          "Observa el aviso en la barra superior. Escribe o agrega un avance a un caso: verás que no se bloquea, se guarda en la tableta y queda marcado como 'Pendiente de sincronización'.",
      },
    ],
  },
  {
    id: 5,
    title: "Acto 5: Recuperación de conexión y sincronización",
    subtitle: "Llegada a la sede distrital y respaldo exitoso",
    scenario:
      "Llegas a la sede con Internet o regresa la señal. Abres la pantalla 'Enviar datos' y sincronizas todos los registros pendientes con el Poder Judicial.",
    targetModule: "sincronizacion",
    offlineSimulated: false,
    dialogs: [
      {
        speaker: "Sistema / Entorno",
        role: "Acontecimiento de la jornada",
        text: "📶 Se restablece la conectividad. La tableta detecta señal de Internet disponible.",
        hint: "La barra superior muestra 'Con conexión · X registros pendientes por enviar'.",
      },
      {
        speaker: "Jueza de Paz",
        role: "Tu despacho",
        text: "Excelente, ya tenemos señal. Ahora voy al módulo de Sincronización a pulsar 'Enviar ahora' para respaldar todos los casos y actuaciones en el servidor central.",
        hint: "La tableta muestra el progreso registro a registro y confirma con fecha y hora de respaldo exitoso.",
        actionPrompt:
          "Entra a 'Sincronización' (o toca 'Enviar datos' en el header). Presiona 'Enviar ahora' para ver la animación de sincronización y el resultado final exitoso.",
      },
    ],
  },
];

export const DESIGN_JUSTIFICATIONS: JustificationItem[] = [
  {
    id: "D1",
    code: "D1",
    decision: "Barra fija de conexión y pendientes + ícono por registro",
    fundamento: "Nielsen 1: Visibilidad del estado del sistema",
    necesidad:
      "Saber en todo momento si lo registrado está a salvo en la tableta y si falta enviarlo al Poder Judicial.",
    categoria: "Sin Conexión",
  },
  {
    id: "D2",
    code: "D2",
    decision: "Textos claros: 'Guardado en la tableta' y 'Enviar datos' en vez de 'sync' o 'persistido'",
    fundamento: "Nielsen 2: Relación entre el sistema y el mundo real",
    necesidad:
      "La jueza tiene poca experiencia digital y necesita entender qué ocurre sin tecnicismos.",
    categoria: "Heurísticas",
  },
  {
    id: "D3",
    code: "D3",
    decision: "Explicaciones sencillas bajo cada tipo de actuación notarial",
    fundamento: "Nielsen 2 y 10: Lenguaje del usuario, ayuda en contexto",
    necesidad:
      "Evita elegir un tipo de trámite equivocado por no entender la terminología jurídica especializada.",
    categoria: "Prevención de Errores",
  },
  {
    id: "D4",
    code: "D4",
    decision: "Formularios divididos en 3 pasos con indicador 'Paso 2 de 3'",
    fundamento: "Chunking de Miller (7±2) y Nielsen 1",
    necesidad:
      "Reduce la sobrecarga cognitiva durante la atención presencial; la jueza sabe con certeza cuánto falta.",
    categoria: "Factores Humanos",
  },
  {
    id: "D5",
    code: "D5",
    decision: "Patrón unificado (Lista ➔ Nuevo por pasos ➔ Revisar ➔ Confirmación) en todos los módulos",
    fundamento: "Nielsen 4: Consistencia y estándares (Ley de Jakob)",
    necesidad:
      "Al aprender a registrar un caso, la jueza ya sabe exactamente cómo registrar una actuación o una cita.",
    categoria: "Heurísticas",
  },
  {
    id: "D6",
    code: "D6",
    decision: "Pantalla 'Revisa los datos' antes de guardar formalmente",
    fundamento: "Nielsen 5: Prevención de errores",
    necesidad:
      "Previene guardar expedientes con nombres incompletos o errores ortográficos antes de formalizarlos.",
    categoria: "Prevención de Errores",
  },
  {
    id: "D7",
    code: "D7",
    decision: "Aviso de duplicado probable con opciones 'Ver la existente' o 'Es otra, continuar'",
    fundamento: "Nielsen 5: Prevención de errores y detección precoz",
    necesidad:
      "Resuelve el problema histórico del juzgado de registrar trámites repetidos sin asumir que la misma persona no puede tener dos trámites.",
    categoria: "Prevención de Errores",
  },
  {
    id: "D8",
    code: "D8",
    decision: "Sugerencias de personas y comunidades en vez de tipear todo desde cero",
    fundamento: "Nielsen 6: Reconocer antes que recordar",
    necesidad:
      "Acelera el registro en tableta, evita errores tipográficos y facilita la atención cara a cara.",
    categoria: "Heurísticas",
  },
  {
    id: "D9",
    code: "D9",
    decision: "Edición con cambios resaltados, botón 'Descartar' y confirmación antes de concluir",
    fundamento: "Nielsen 3: Control y libertad del usuario",
    necesidad:
      "Permite corregir sin temor a perder información y previene cierres accidentales de casos activos.",
    categoria: "Heurísticas",
  },
  {
    id: "D10",
    code: "D10",
    decision: "Mensajes de validación inmediatos junto al campo con instrucciones de cómo corregirlo",
    fundamento: "Nielsen 9: Reconocer, diagnosticar y recuperarse de errores",
    necesidad:
      "Si falta un dato indispensable, la jueza sabe exactamente qué escribir sin frustración ni bloqueos.",
    categoria: "Heurísticas",
  },
  {
    id: "D11",
    code: "D11",
    decision: "Accesos directos en Inicio ('Nuevo caso', 'Nueva actuación', 'Agendar', 'Enviar datos')",
    fundamento: "Nielsen 7: Flexibilidad y eficiencia de uso (Ley de Hick)",
    necesidad:
      "Las cuatro acciones más frecuentes del día están a un solo toque al encender la aplicación.",
    categoria: "Factores Humanos",
  },
  {
    id: "D12",
    code: "D12",
    decision: "Pantallas limpias con una sola acción principal destacada",
    fundamento: "Nielsen 8: Diseño estético y minimalista",
    necesidad:
      "Evita la indecisión al presentar botones compitiendo entre sí; el botón primario es obvio.",
    categoria: "Factores Humanos",
  },
  {
    id: "D13",
    code: "D13",
    decision: "Botones táctiles de al menos 48×48 px separados con 8 px de margen",
    fundamento: "Ley de Fitts y estándares táctiles WCAG",
    necesidad:
      "Fácil de presionar con el pulgar o el dedo índice en la pantalla de 10 pulgadas sin toques involuntarios.",
    categoria: "Factores Humanos",
  },
  {
    id: "D14",
    code: "D14",
    decision: "Codificación redundante: Color + Ícono + Texto en todos los estados y agenda",
    fundamento: "Accesibilidad universal (WCAG AA - Daltonismo)",
    necesidad:
      "Nadie depende únicamente del color para saber si un caso está en trámite, en espera o concluido.",
    categoria: "Factores Humanos",
  },
  {
    id: "D15",
    code: "D15",
    decision: "Tipografía base amplia (18 px) con contraste alto (≥ 4.5:1)",
    fundamento: "Factores humanos de visión y ergonomía rural",
    necesidad:
      "Lectura cómoda en exteriores bajo luz solar o en despachos con iluminación precaria y para adultos mayores.",
    categoria: "Factores Humanos",
  },
  {
    id: "D16",
    code: "D16",
    decision: "Guardado automático de borradores en tiempo real (Autosave en localStorage)",
    fundamento: "Tolerancia a interrupciones e imprevistos",
    necesidad:
      "Si la jueza debe salir a atender una emergencia o la tableta se apaga, no pierde ni una sola letra.",
    categoria: "Sin Conexión",
  },
  {
    id: "D17",
    code: "D17",
    decision: "Opción 'No tiene / no lo trajo' en documentos y teléfono opcional",
    fundamento: "Adecuación al contexto sociocultural rural",
    necesidad:
      "En comunidades campesinas muchos pobladores no disponen de celular o no portan DNI; el sistema no discrimina ni detiene la atención.",
    categoria: "Prevención de Errores",
  },
  {
    id: "D18",
    code: "D18",
    decision: "Alerta destacada ⚠ 'Casos que requieren atención' en el Inicio y listas",
    fundamento: "Nielsen 1 y Memoria prospectiva",
    necesidad:
      "Resuelve el problema de las fechas de atención olvidadas o expedientes abandonados por más de 30 días.",
    categoria: "Heurísticas",
  },
  {
    id: "D19",
    code: "D19",
    decision: "Pantalla de sincronización con desglose registro por registro y opción 'Reintentar'",
    fundamento: "Nielsen 1 y 9: Visibilidad y recuperación de fallos de red",
    necesidad:
      "Brinda absoluta certeza de qué datos ya llegaron a la sede judicial y permite recuperar cualquier corte sin duplicados.",
    categoria: "Sin Conexión",
  },
  {
    id: "D20",
    code: "D20",
    decision: "Sin gestos táctiles ocultos (todas las acciones cuentan con botón visible)",
    fundamento: "Principio de Descubribilidad (Don Norman)",
    necesidad:
      "Jueces con poca familiaridad tecnológica no descubren gestos invisibles (deslizar para borrar, long-press).",
    categoria: "Factores Humanos",
  },
];
