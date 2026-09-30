# SRS — "Justicia Cercana"
**Especificación de Requisitos de Software**
Curso: CS2H01 – Human Computer Interaction (UTEC) · Examen Parcial 2026-2

---

## 1. Introducción

### 1.1 Propósito
Este documento define los requisitos de una aplicación web para que los **jueces de paz** de comunidades rurales registren casos, actuaciones notariales y su agenda. La aplicación funciona **sin conexión** en una tableta de 10" y **sincroniza** cuando hay Internet. Sirve de base para diseñar el prototipo interactivo (Figma o similar) y justificar sus decisiones de diseño.

### 1.2 Alcance
El sistema incluye tres módulos:
1. **Casos judiciales**: registrar, consultar y hacer seguimiento de conflictos.
2. **Actuaciones notariales**: dejar constancia y localizar actuaciones.
3. **Agenda / calendario**: audiencias, reuniones, visitas y otras actividades.

Además incluye un subsistema transversal de **almacenamiento local y sincronización**.

**Fuera de alcance:** interoperabilidad con los sistemas internos del Poder Judicial (más allá de la sincronización), firma digital y pagos.

### 1.3 Definiciones
| Término | Significado |
|---|---|
| Juez/a de paz | Autoridad comunal que concilia conflictos y realiza actuaciones notariales. |
| Caso | Conflicto registrado entre partes (p. ej. vecinal). |
| Actuación notarial | Trámite del que el juez deja constancia (p. ej. certificación, constancia de posesión). |
| Parte / participante | Persona que interviene en un caso o una actuación. |
| Guardado local | Datos almacenados en la tableta, todavía no enviados al servidor. |
| Pendiente de sincronización | Registro guardado localmente que aún no se ha enviado. |
| Sincronización | Envío y recepción de datos entre la tableta y el servidor del Poder Judicial. |

### 1.4 Problema actual
- La información se guarda en cuadernos, formularios impresos o archivos digitales separados.
- Consecuencias: **datos duplicados**, **registros anteriores difíciles de encontrar** y **fechas importantes olvidadas**.

---

## 2. Descripción general

### 2.1 Perfil del usuario
| Característica | Implicación de diseño |
|---|---|
| Poca experiencia con aplicaciones complejas | Flujos guiados paso a paso, lenguaje cotidiano, pocas opciones por pantalla. |
| Trabaja en zonas rurales | Offline-first; no depende de la red para ninguna tarea principal. |
| Atiende a personas en persona | Formularios rápidos que no interrumpen la conversación y permiten guardar parcialmente. |
| Posible presbicia o condiciones de luz variables (exteriores) | Tipografía grande, alto contraste. |

### 2.2 Entorno de operación
- **Dispositivo principal:** tableta de 10", uso táctil (con teclado, según las notas de trabajo).
- **Dispositivo secundario:** computadora con navegador cuando hay Internet (en la comunidad o en la sede del Poder Judicial).
- **Conectividad:** limitada o inestable; puede no haber Internet durante varias horas.
- **Plataforma:** aplicación web adaptable (PWA) con almacenamiento local.

### 2.3 Escenario principal de uso
1. La jueza inicia la jornada en la comunidad (sin conexión garantizada).
2. En la mañana registra un **conflicto vecinal** de dos personas.
3. Luego atiende una **solicitud de actuación notarial**.
4. Antes de terminar el día **revisa las actividades de la semana** y **agenda una reunión nueva**.
5. La conexión se pierde varias veces y ella sigue trabajando sin perder datos.
6. Después **sincroniza** desde la sede del PJ o desde una computadora y recibe la confirmación del resultado.

### 2.4 Supuestos y restricciones
- Cada tableta tiene asignado un solo juez (una cuenta por dispositivo).
- Se puede iniciar sesión offline con credenciales en caché después del primer ingreso en línea.
- El número de caso o actuación se genera localmente con un formato único por dispositivo para evitar colisiones al sincronizar.

---

## 3. Requisitos funcionales

> Prioridad: **A** = imprescindible · **M** = deseable · **B** = opcional.

### 3.1 Transversales

| ID | Requisito | Prioridad |
|---|---|---|
| RF-G01 | Mostrar una **pantalla de inicio** con acceso directo a los 3 módulos y un resumen de "qué requiere atención hoy" (casos con fecha próxima y actividades del día). | A |
| RF-G02 | Mostrar en todo momento un **indicador de conexión y sincronización** (En línea / Sin conexión, número de registros pendientes). | A |
| RF-G03 | Guardar automáticamente en la tableta cada registro o cambio, sin depender de la red. | A |
| RF-G04 | Mostrar una **confirmación explícita** después de cada guardado ("Guardado en la tableta · pendiente de enviar"). | A |
| RF-G05 | Guardar borradores de formularios incompletos y permitir retomarlos. | A |
| RF-G06 | Ofrecer una **búsqueda** por nombre de la persona, DNI o número de caso/actuación. | A |
| RF-G07 | Pedir confirmación antes de acciones destructivas o irreversibles (cancelar, cambiar a concluido) y permitir deshacer cuando sea posible. | A |
| RF-G08 | Reutilizar personas ya registradas (autocompletar por DNI o nombre) para evitar duplicados. | M |
| RF-G09 | Ofrecer ayuda contextual (ícono "?" con una explicación en lenguaje simple) en los campos que pueden generar dudas. | M |

### 3.2 Módulo 1 — Registro de casos judiciales

| ID | Requisito | Prioridad |
|---|---|---|
| RF-C01 | Registrar un caso nuevo con un asistente por pasos: **1) Datos del caso → 2) Partes → 3) Revisar y guardar**. | A |
| RF-C02 | Generar automáticamente el código del caso. | A |
| RF-C03 | Listar los casos con filtros por estado y orden por fecha; mostrar el estado con **etiqueta de texto + ícono + color**. | A |
| RF-C04 | Marcar de forma destacada los casos que **requieren atención** (próxima fecha cercana o vencida). | A |
| RF-C05 | Ver el detalle del caso: datos, partes y línea de tiempo de seguimiento. | A |
| RF-C06 | Agregar una **actuación o avance** al seguimiento (fecha, descripción, próxima fecha). | A |
| RF-C07 | Editar el caso indicando visualmente **qué campos se modifican**, y confirmar que se guardó. | A |
| RF-C08 | Registrar el resultado o acuerdo al concluir el caso. | A |
| RF-C09 | Crear automáticamente una actividad en la agenda al fijar una "próxima fecha de atención". | M |
| RF-C10 | Adjuntar documentos o fotos de evidencia (cámara de la tableta). | B |

**Campos del caso**

| Campo | Oblig. | Validación / nota |
|---|---|---|
| Código del caso | Auto | Solo lectura. Formato `CAS-AAAA-NNNN-<disp>`. |
| Fecha de registro | Sí | Por defecto la fecha de hoy; no puede ser futura. |
| Tipo de conflicto / materia | Sí | Lista cerrada (Vecinal, Familiar, Deudas, Linderos/terrenos, Otro → texto). |
| Descripción breve del motivo | Sí | 10–500 caracteres. |
| Estado | Sí | En trámite (defecto) · En conciliación · Concluido · Archivado. |
| Observaciones | No | Máx. 1000 caracteres. |

**Campos de las partes** (mínimo 1 solicitante)

| Campo | Oblig. | Validación / nota |
|---|---|---|
| Nombres y apellidos | Sí | Solo letras y espacios, mín. 3 caracteres. |
| Tipo de documento | No | DNI · Carné de extranjería · Sin documento. |
| Número de documento | Condicional | Obligatorio si se elige un tipo; DNI = 8 dígitos. Avisa si el documento ya existe (posible duplicado). |
| Teléfono / contacto | No | 9 dígitos si es celular. Opción "No tiene". |
| Dirección / comunidad | Sí | Comunidad por lista con opción de texto libre; la dirección exacta es opcional. |
| Rol en el caso | Sí | Solicitante · Invitado · Testigo. |

**Seguimiento**

| Campo | Oblig. | Validación / nota |
|---|---|---|
| Fecha de la actuación | Sí | No puede ser futura. |
| Descripción | Sí | Máx. 500 caracteres. |
| Próxima fecha de atención | No | Debe ser igual o posterior a hoy. |
| Resultado / acuerdo | Condicional | Obligatorio para pasar el caso a "Concluido". |
| Documentos / evidencias | No | Imagen o PDF, máx. 10 MB. |

### 3.3 Módulo 2 — Actuaciones notariales

| ID | Requisito | Prioridad |
|---|---|---|
| RF-N01 | Registrar una actuación con un formulario por pasos y **textos de ayuda en lenguaje simple**. | A |
| RF-N02 | Generar automáticamente el código de registro. | A |
| RF-N03 | **Detectar posibles duplicados** (mismo tipo, mismo solicitante y fecha cercana) y avisar antes de guardar. | A |
| RF-N04 | Permitir continuar si falta un dato opcional (p. ej. teléfono), con la opción "No disponible", sin bloquear ni confundir. | A |
| RF-N05 | Mostrar un **resumen antes de guardar** y una confirmación clara después. | A |
| RF-N06 | Buscar y listar actuaciones por tipo, estado, fecha o persona. | A |
| RF-N07 | Registrar el resultado y la fecha de entrega o conclusión. | A |
| RF-N08 | Adjuntar documentos o anotar una **referencia a documento físico** (n.º de folio del cuaderno). | M |

**Campos de la actuación**

| Campo | Oblig. | Validación / nota |
|---|---|---|
| Código de registro | Auto | `ACT-AAAA-NNNN-<disp>`. |
| Fecha de solicitud | Sí | Por defecto hoy; no puede ser futura. |
| Fecha de atención | No | Igual o posterior a la fecha de solicitud. |
| Tipo de actuación | Sí | Lista con descripción simple (p. ej. "Constancia de posesión: certifica que alguien vive o usa un terreno"). |
| Descripción / asunto | Sí | Máx. 500 caracteres. |
| Estado | Sí | Pendiente · Atendida · Concluida. |
| Observaciones | No | — |
| Participantes | Sí (≥1 solicitante) | Mismos campos y validaciones que las partes del caso; rol: Solicitante · Declarante · Testigo. |
| Resultado | Condicional | Obligatorio para marcar "Concluida". |
| Fecha de entrega / conclusión | Condicional | Obligatoria si el estado es "Concluida"; igual o posterior a la fecha de solicitud. |
| Documentos / referencia física | No | — |

### 3.4 Módulo 3 — Agenda / calendario

| ID | Requisito | Prioridad |
|---|---|---|
| RF-A01 | Ofrecer una **vista mensual** con indicadores de actividades por día. | A |
| RF-A02 | Ofrecer una **vista de día** con la lista cronológica de actividades. | A |
| RF-A03 | Ofrecer una vista "Esta semana / próximas" para revisar lo programado. | A |
| RF-A04 | Crear, editar y cambiar el estado de una actividad. | A |
| RF-A05 | Distinguir las categorías (Audiencia, Reunión, Visita, Otro) por **color + ícono + etiqueta de texto** (nunca solo por color). | A |
| RF-A06 | Mostrar alertas o recordatorios de actividades próximas en la pantalla de inicio. | A |
| RF-A07 | Advertir de **cruces de horario** al crear una actividad. | M |
| RF-A08 | Vincular una actividad a un caso o a una actuación. | M |

**Campos de la actividad**

| Campo | Oblig. | Validación / nota |
|---|---|---|
| Título | Sí | Máx. 80 caracteres. |
| Categoría | Sí | Audiencia · Reunión · Visita · Otro. |
| Fecha | Sí | Selector de calendario. |
| Hora de inicio | No | — |
| Hora de término | No | Posterior a la hora de inicio. |
| Lugar / comunidad | Sí | Lista con opción de texto libre. |
| Descripción / motivo | No | Máx. 500 caracteres. |
| Estado | Sí | Programada (defecto) · Realizada · Cancelada. |

### 3.5 Trabajo sin conexión y sincronización

| ID | Requisito | Prioridad |
|---|---|---|
| RF-S01 | Todas las tareas de los 3 módulos están disponibles **sin Internet**. | A |
| RF-S02 | Cada registro muestra su **estado de sincronización**: ☁✓ Enviado · ⏳ Pendiente · ⚠ Error. | A |
| RF-S03 | Mostrar un aviso no intrusivo al perder o recuperar la conexión. | A |
| RF-S04 | Ofrecer una pantalla **"Sincronizar"** con el número de registros pendientes por módulo y el botón "Enviar ahora". | A |
| RF-S05 | Mostrar el progreso de la sincronización y el **resultado final** (éxito, o lista de los registros que fallaron y qué hacer). | A |
| RF-S06 | No borrar nunca los datos locales hasta que el servidor confirme su recepción. | A |
| RF-S07 | Si la sincronización se interrumpe, reanudarla sin duplicar registros. | A |
| RF-S08 | Si hay conflictos (el mismo registro se editó en la tableta y en la computadora), mostrar ambas versiones y dejar elegir. | M |
| RF-S09 | Mostrar la fecha y hora de la última sincronización exitosa. | A |
| RF-S10 | Desde la computadora (en línea), acceder a los mismos datos ya sincronizados. | A |

---

## 4. Requisitos no funcionales

### 4.1 Usabilidad y factores humanos
| ID | Requisito |
|---|---|
| RNF-U01 | Las áreas táctiles miden **≥ 48×48 px** (≈ 9 mm) y están separadas al menos 8 px. |
| RNF-U02 | El texto base mide ≥ 16 px (recomendado 18 px) y los títulos ≥ 24 px. |
| RNF-U03 | El contraste es **≥ 4.5:1** (WCAG AA), legible a pleno sol. |
| RNF-U04 | La navegación es **plana**: máximo 3 toques para llegar a cualquier tarea principal. |
| RNF-U05 | Se usa lenguaje cotidiano sin jerga técnica ni jurídica innecesaria ("Guardar" en lugar de "Persistir"; "Enviar datos" en lugar de "Sync"). |
| RNF-U06 | Los íconos siempre van acompañados de una etiqueta de texto. |
| RNF-U07 | Los mensajes de error dicen qué pasó y cómo corregirlo, junto al campo afectado. |
| RNF-U08 | Los campos obligatorios se marcan de forma visible y los opcionales dicen "(opcional)". |
| RNF-U09 | El diseño es para orientación horizontal y vertical de la tableta, y se adapta a la computadora (layout responsive). |
| RNF-U10 | Se admite entrada por teclado físico (orden de tabulación lógico, Enter para avanzar). |
| RNF-U11 | Una persona sin experiencia completa el registro de un caso nuevo en **≤ 5 min** en una prueba de usabilidad. |

### 4.2 Rendimiento
| ID | Requisito |
|---|---|
| RNF-P01 | Las pantallas cargan offline en < 2 s. |
| RNF-P02 | El guardado local y su confirmación tardan < 1 s. |
| RNF-P03 | La búsqueda local sobre 5 000 registros responde en < 1 s. |

### 4.3 Fiabilidad y datos
| ID | Requisito |
|---|---|
| RNF-F01 | No se pierden datos si se cierra la app, se agota la batería o falla la red en medio de una tarea. |
| RNF-F02 | La sincronización es idempotente (reintentarla no duplica registros). |
| RNF-F03 | El almacenamiento local soporta al menos 30 días de trabajo sin sincronizar. |

### 4.4 Seguridad y privacidad
| ID | Requisito |
|---|---|
| RNF-S01 | Se accede con PIN o contraseña; la sesión se bloquea tras un periodo de inactividad. |
| RNF-S02 | Los datos locales se cifran en la tableta. |
| RNF-S03 | La comunicación con el servidor usa HTTPS. |
| RNF-S04 | Los datos personales (DNI, teléfono) se tratan conforme a la Ley N.º 29733 de Protección de Datos Personales. |

---

## 5. Pantallas y flujos del prototipo

### 5.1 Mapa de pantallas
```
Inicio (resumen del día + estado de sincronización)
├── Casos
│   ├── Lista de casos (filtros, "requieren atención")
│   ├── Nuevo caso (Paso 1 Datos → Paso 2 Partes → Paso 3 Revisar)
│   └── Detalle del caso
│       ├── Agregar avance
│       └── Editar / Concluir
├── Actuaciones notariales
│   ├── Lista / búsqueda
│   ├── Nueva actuación (Paso 1 Tipo y asunto → Paso 2 Participantes → Paso 3 Resultado → Revisar)
│   └── Detalle
├── Agenda
│   ├── Vista mensual
│   ├── Vista de día
│   ├── Esta semana
│   └── Nueva actividad
└── Sincronizar (pendientes, enviar, resultado)
```

### 5.2 Flujos críticos (corresponden al escenario 2.3)
| Flujo | Pasos clave | Requisitos |
|---|---|---|
| F1 Registrar un conflicto vecinal offline | Inicio → Casos → Nuevo → Datos → 2 partes → Revisar → Guardar → "Guardado en la tableta ⏳" | RF-C01..C02, RF-G03..G04, RF-S02 |
| F2 Registrar una actuación notarial | Inicio → Actuaciones → Nueva → pasos → aviso de duplicado (si aplica) → Guardar | RF-N01..N05 |
| F3 Revisar la semana y agendar una reunión | Inicio → Agenda → Esta semana → + Nueva actividad → Guardar | RF-A03..A05 |
| F4 Sincronizar | Indicador "3 pendientes" → Sincronizar → Enviar ahora → Progreso → "✓ 3 registros enviados" o lista de errores | RF-S04..S07, RF-S09 |
| F5 Pérdida de conexión en medio de una tarea | El aviso "Sin conexión, tu trabajo se guarda en la tableta" aparece y el flujo continúa sin interrupción | RF-S01, RF-S03 |

---

## 6. Trazabilidad: decisiones de diseño ↔ principios / heurísticas

| Decisión de diseño | Heurística / principio / factor humano | Necesidad atendida |
|---|---|---|
| Indicador permanente de conexión + ⏳ por registro | Nielsen #1 Visibilidad del estado del sistema | Saber si lo registrado está a salvo y si falta enviarlo. |
| Lenguaje cotidiano y ejemplos en los campos | Nielsen #2 Relación con el mundo real | Usuario con poca familiaridad con términos técnicos o jurídicos. |
| Deshacer, cancelar y editar con cambios resaltados | Nielsen #3 Control y libertad | Corregir errores sin miedo a "romper" algo. |
| Mismo patrón de formulario por pasos en los 3 módulos | Nielsen #4 Consistencia · Ley de Jakob | Aprender una sola vez. |
| Validación en línea, aviso de duplicados, confirmar antes de concluir | Nielsen #5 Prevención de errores | Evitar registros incompletos o duplicados. |
| Autocompletar personas y listas en lugar de texto libre | Nielsen #6 Reconocer antes que recordar | Menos carga de memoria y tipeo. |
| Accesos rápidos en el Inicio ("Nuevo caso", "Hoy") | Nielsen #7 Flexibilidad y eficiencia | Tareas frecuentes con menos pasos. |
| Pocas opciones por pantalla, jerarquía visual clara | Nielsen #8 Diseño minimalista · Ley de Hick | Reducir el tiempo de decisión. |
| Errores junto al campo con la solución | Nielsen #9 Ayudar a reconocer y recuperarse de errores | Corregir sin frustración. |
| Ícono "?" con explicaciones breves | Nielsen #10 Ayuda y documentación | Autonomía sin capacitación extensa. |
| Botones ≥ 48 px, zona de pulgar | Ley de Fitts · factores humanos táctiles | Precisión en la pantalla táctil de 10". |
| Formularios divididos en 3 pasos | Agrupamiento (chunking) · Miller 7±2 · Gestalt de proximidad | Menor carga cognitiva. |
| Color + ícono + texto en los estados y la agenda | Accesibilidad (daltonismo), redundancia de codificación | Distinguir categorías sin depender del color. |
| Alto contraste y tipografía grande | Factores humanos: visión y entorno exterior | Legibilidad en campo y para usuarios mayores. |
| Guardado automático y borradores | Tolerancia a interrupciones (atiende personas en persona) | No perder trabajo. |

---

## 7. Criterios de aceptación (según la rúbrica del examen)

| Criterio de la rúbrica | Evidencia en el prototipo |
|---|---|
| Cobertura de los módulos | Flujos F1–F3 completos para los 3 módulos (registrar, consultar, actualizar). |
| Principios y heurísticas | Tabla de la sección 6 aplicada en cada pantalla. |
| Factores humanos y dispositivo | RNF-U01..U10; diseño a 1280×800 (tableta de 10"). |
| Funcionamiento sin conexión | RF-S01..S10 y flujos F4–F5 con todos los estados visibles. |
| Justificación de las decisiones | Cada pantalla del PDF entregable relaciona su decisión → principio → necesidad del usuario. |

---

## 8. Entregable
- Prototipo interactivo web (Figma o similar) para tableta de 10".
- **PDF** con la descripción de cada módulo, las pantallas, los flujos y la justificación de cada decisión de diseño.
