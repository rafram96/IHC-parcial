# SRS v2 — Justicia Cercana
Especificación de requisitos para el prototipo del Examen Parcial CS2H01 (UTEC, 2026-2).

**Cómo leer este documento.** Cada requisito indica su origen:
- **[PDF]**: lo exige el enunciado del examen.
- **[Notas]**: sale de `work.md`.
- **[Propuesta]**: lo agrega el equipo. El enunciado permite añadir campos y estados si se justifican, así que cada propuesta trae su justificación.

---

## 1. Contexto

### 1.1 Problema [PDF]
Los jueces de paz rurales atienden conflictos y formalizan actuaciones notariales. Hoy registran la información en cuadernos, formularios impresos y archivos digitales sueltos, y eso provoca tres problemas:

| Problema | Qué debe resolver la aplicación |
|---|---|
| Datos duplicados | Detectar registros y personas repetidas antes de guardar. |
| Difícil encontrar registros anteriores | Búsqueda y listados con filtros. |
| Fechas importantes olvidadas | Agenda y avisos de lo próximo o vencido. |

### 1.2 Usuario [PDF]
- Juez o jueza de paz con **poca experiencia en aplicaciones digitales**.
- Trabaja en **zonas rurales con conectividad limitada o inestable**; puede pasar **varias horas sin Internet**.
- Atiende a las personas **cara a cara**, así que el registro no debe interrumpir la atención. [Propuesta]

### 1.3 Dispositivos [PDF]
| Dispositivo | Uso | Conexión |
|---|---|---|
| Tableta de 10" (táctil) | Trabajo diario en la comunidad | Intermitente o nula |
| Computadora | Consulta y sincronización, en su comunidad o en la sede del Poder Judicial | Con Internet |

- La tableta tiene teclado. [Notas]
- Resolución de diseño: **1280×800 px** en horizontal (típica de 10"). [Propuesta]

### 1.4 Situación de uso de referencia [PDF]
| # | Momento | Módulo |
|---|---|---|
| E1 | En la mañana, dos personas registran un **conflicto vecinal** | Casos |
| E2 | Atiende una **solicitud de actuación notarial** | Actuaciones |
| E3 | Antes de terminar el día, **revisa las actividades de la semana** | Agenda |
| E4 | **Agenda una reunión nueva** | Agenda |
| E5 | **Pierde la conexión varias veces** durante la jornada y sigue trabajando sin perder nada | Transversal |
| E6 | **Sincroniza** en la sede del PJ o desde una computadora y **recibe confirmación** | Sincronización |

El prototipo debe poder recorrer E1–E6 de principio a fin.

---

## 2. Requisitos generales de la interfaz

| ID | Requisito | Origen |
|---|---|---|
| RG-01 | Cada tarea **guía al usuario** paso a paso. | [PDF] |
| RG-02 | Se usan **términos familiares** y se evita la jerga jurídica o técnica innecesaria. | [PDF] |
| RG-03 | Se **evitan pasos innecesarios**. | [PDF] |
| RG-04 | La interfaz está adaptada al **uso táctil en la tableta de 10"**. | [PDF] |
| RG-05 | La aplicación se puede usar **desde una computadora con Internet**. | [PDF] |
| RG-06 | Se **distinguen los campos obligatorios de los opcionales** y cada campo tiene **validaciones explícitas**. | [PDF] |
| RG-07 | Hay una pantalla de **Inicio** que responde a "¿qué tengo pendiente hoy?". | [Propuesta]: resuelve las fechas olvidadas. |
| RG-08 | Hay una **búsqueda única** por nombre, DNI o código que busca en casos y actuaciones a la vez. | [Propuesta]: resuelve la dificultad para encontrar registros. |
| RG-09 | Una persona registrada una vez se **reutiliza** en otros casos o actuaciones (autocompletar por DNI o nombre). | [Propuesta]: evita duplicar personas. |
| RG-10 | Los formularios se pueden **dejar a medias** (borrador) y retomar después. | [Propuesta]: la jueza puede ser interrumpida mientras atiende. |

---

## 3. Módulo 1 — Casos judiciales

### 3.1 Historias de usuario
| ID | Como jueza quiero… | Para… | Origen |
|---|---|---|---|
| HU-C1 | registrar un caso nuevo | dejar constancia del conflicto | [PDF] |
| HU-C2 | consultar los casos existentes | encontrar un registro anterior | [PDF] |
| HU-C3 | actualizar el avance de un caso | llevar su seguimiento | [PDF] |
| HU-C4 | ver el detalle de un caso | recordar partes, historia y acuerdos | [PDF] |
| HU-C5 | reconocer qué casos requieren atención | no olvidar fechas | [PDF] |
| HU-C6 | identificar fácilmente a las partes | no confundir quién es quién | [PDF] |
| HU-C7 | reconocer rápido el estado de un caso | priorizar mi trabajo | [PDF] |

### 3.2 Campos

**Datos del caso**
| Campo | Obligatorio | Validación | Origen |
|---|---|---|---|
| Código del caso | Automático | Lo genera la app y no se puede editar. Formato `C-2026-0001`. | [PDF] |
| Fecha de registro | Sí | Viene con la fecha de hoy; no puede ser futura. | [PDF] |
| Tipo de conflicto o materia | Sí | Se elige de una lista (Vecinal, Familiar, Deudas, Terrenos o linderos, Daños, Otro). "Otro" pide escribirlo. | [PDF], lista [Propuesta] |
| Motivo del caso (breve) | Sí | De 10 a 300 caracteres, con contador visible. | [PDF] |
| Estado | Sí | Ver 3.3. | [PDF] |
| Observaciones | No | Hasta 1000 caracteres. | [PDF] |

**Partes involucradas** (al menos 1 persona con rol Solicitante)
| Campo | Obligatorio | Validación | Origen |
|---|---|---|---|
| Nombres | Sí | Solo letras, espacios y tildes. | [PDF] |
| Apellidos | Sí | Igual que Nombres. | [PDF] |
| Tipo de documento | No | DNI · Carné de extranjería · **No tiene / no lo trajo**. | [PDF] "si corresponde" |
| Número de documento | Solo si se eligió un tipo | DNI: 8 dígitos. Si el DNI ya existe, se ofrece "¿Es esta persona?" para reutilizarla. | [PDF] |
| Teléfono o contacto | No | 9 dígitos si es celular, o texto libre (p. ej. "vía el teniente gobernador"). | [PDF] "si se dispone" |
| Comunidad o localidad | Sí | Lista de comunidades con opción de texto libre. | [PDF] |
| Dirección o referencia | No | Texto libre. | [PDF] |
| Rol en el caso | Sí | Solicitante · Invitado · Testigo. | [PDF] |

**Seguimiento** (una entrada por cada avance)
| Campo | Obligatorio | Validación | Origen |
|---|---|---|---|
| Fecha del avance | Sí | Viene con la fecha de hoy; no puede ser futura. | [PDF] |
| Qué se hizo | Sí | De 5 a 500 caracteres. | [PDF] |
| Próxima fecha de atención | No | Hoy o posterior. Al llenarla, **se ofrece crear la actividad en la Agenda**. | [PDF], vínculo [Propuesta] |
| Resultado o acuerdo | Solo al concluir | Obligatorio para pasar el caso a *Concluido*. | [PDF] |
| Documentos o fotos | No | Foto con la cámara o archivo (imagen o PDF). | [PDF] opcional |

### 3.3 Estados del caso
```
 [En trámite] ──► [En espera] ──► [En trámite]
      │                                │
      └──────────► [Concluido] ◄───────┘
```
| Estado | Significado en lenguaje simple | Etiqueta visual | Origen |
|---|---|---|---|
| En trámite | "Se está atendiendo" | 🔵 ícono de reloj + texto | [PDF] |
| En espera | "Esperando que vuelva una de las partes" | 🟡 ícono de pausa + texto | [Propuesta]: en la práctica las partes no siempre asisten a la siguiente cita, y así esos casos no se confunden con los activos. |
| Concluido | "Terminado, con acuerdo o resultado" | 🟢 ícono de check + texto | [PDF] |

Pasar a *Concluido* pide confirmación y exige el campo Resultado.

### 3.4 Regla "requiere atención" [Propuesta]
Un caso aparece marcado con ⚠ **"Requiere atención"** en la lista y en el Inicio cuando cumple alguna de estas condiciones:
- su próxima fecha de atención es **hoy, mañana o ya pasó**;
- está *En trámite* y **lleva más de 30 días sin avances**.

### 3.5 Edición [PDF]
- Al editar, los campos modificados se **resaltan** y se muestra un aviso: *"Estás cambiando: Estado, Observaciones"*.
- Botones: **Guardar cambios** y **Descartar**.
- Al guardar se confirma: *"Cambios guardados en la tableta"*, junto con el estado de sincronización (ver sección 6).

---

## 4. Módulo 2 — Actuaciones notariales

### 4.1 Historias de usuario
| ID | Como jueza quiero… | Para… | Origen |
|---|---|---|---|
| HU-N1 | dejar constancia de una actuación notarial | formalizarla | [PDF] |
| HU-N2 | localizarla después | responder consultas y entregar documentos | [PDF] |
| HU-N3 | que el formulario me explique qué se necesita | no equivocarme con términos legales | [PDF] |
| HU-N4 | que se me avise si falta algo o si ya existe | evitar registros incompletos o duplicados | [PDF] |
| HU-N5 | poder seguir aunque falte un dato opcional | no bloquearme en una zona rural | [PDF] |

### 4.2 Campos

**Datos de la actuación**
| Campo | Obligatorio | Validación | Origen |
|---|---|---|---|
| Código de registro | Automático | Formato `N-2026-0001`, no editable. | [PDF] |
| Fecha de solicitud | Sí | Viene con la fecha de hoy; no puede ser futura. | [PDF] |
| Fecha de atención | No | Igual o posterior a la fecha de solicitud. | [PDF] |
| Tipo de actuación | Sí | Tarjetas grandes, cada una con una explicación simple debajo (ver 4.3). | [PDF] |
| Asunto | Sí | De 10 a 300 caracteres, con un ejemplo en gris dentro del campo. | [PDF] |
| Estado | Sí | Pendiente → Atendida → Concluida. | [PDF] |
| Observaciones | No | Hasta 1000 caracteres. | [PDF] |

**Personas participantes**: los mismos campos y validaciones que las partes del caso (3.2). Cambia el rol: **Solicitante · Declarante · Testigo**. Debe haber al menos 1 Solicitante. [PDF]

**Resultado y documentación**
| Campo | Obligatorio | Validación | Origen |
|---|---|---|---|
| Resultado | Solo al concluir | Obligatorio para marcar *Concluida*. | [PDF] |
| Fecha de entrega o conclusión | Solo al concluir | Igual o posterior a la fecha de solicitud. | [PDF] |
| Documentos adjuntos | No | Foto o archivo. | [PDF] opcional |
| Referencia a documento físico | No | Texto, p. ej. "Libro 2, folio 45". | [PDF] opcional |

### 4.3 Tipos de actuación con ayuda en lenguaje simple [Propuesta]
| Tipo | Explicación que ve la jueza |
|---|---|
| Constancia de posesión | "Certifica que una persona vive en un terreno o lo usa." |
| Constancia de convivencia | "Certifica que dos personas viven juntas." |
| Certificación de firmas | "Confirma que una firma es de quien dice ser." |
| Transferencia de bienes muebles | "Deja constancia de una compra o venta de animales, herramientas u otros bienes." |
| Otro | "Escribe de qué se trata." |

> Nota: la lista exacta de tipos debe validarse con la normativa vigente de justicia de paz. Aquí sirve como ejemplo para el prototipo.

### 4.4 Prevención de duplicados e incompletos [PDF]
- **Duplicado probable**: mismo tipo, mismo DNI del solicitante y solicitud en los últimos 30 días. Antes de guardar se muestra: *"Ya existe una actuación parecida (N-2026-0012, 3 de mayo). ¿Es la misma?"* con dos opciones: **Ver la existente** o **Es otra, continuar**.
- **Incompleto**: el botón Guardar muestra qué falta (*"Falta: Tipo de actuación"*) y al tocarlo lleva directo al campo vacío.
- **Dato no disponible**: los campos opcionales dicen "(opcional)" y el documento tiene la opción "No tiene / no lo trajo". Así la jueza puede seguir sin mensajes de error.
- **Antes de guardar** se muestra una pantalla "Revisa los datos", y **después** una confirmación con el código asignado.

---

## 5. Módulo 3 — Agenda

### 5.1 Historias de usuario
| ID | Como jueza quiero… | Origen |
|---|---|---|
| HU-A1 | ver las actividades del mes | [PDF] |
| HU-A2 | ver el detalle de un día | [PDF] |
| HU-A3 | crear una actividad nueva | [PDF] |
| HU-A4 | reconocer si tengo tareas próximas | [PDF] |
| HU-A5 | revisar lo programado para la semana | [PDF] (escenario E3) |

### 5.2 Campos
| Campo | Obligatorio | Validación | Origen |
|---|---|---|---|
| Título | Sí | Hasta 80 caracteres. | [PDF] |
| Tipo de actividad | Sí | Audiencia · Reunión · Visita · Otra. | [PDF] los menciona; como campo es [Propuesta] |
| Fecha | Sí | Selector de calendario; se avisa si la fecha ya pasó. | [PDF] |
| Hora de inicio | No | Selector de hora con botones grandes. | [PDF] "cuando corresponda" |
| Hora de término | No | Posterior a la hora de inicio. | [PDF] |
| Lugar o comunidad | Sí | Lista con opción de texto libre. | [PDF] |
| Motivo | No | Hasta 500 caracteres. | [PDF] |
| Estado | Sí | Programada (por defecto) · Realizada · Cancelada. | [PDF] |
| Caso o actuación vinculada | No | Se busca por código o nombre. | [Propuesta]: une la agenda con los expedientes. |

### 5.3 Vistas
| Vista | Contenido | Origen |
|---|---|---|
| **Mes** | Cuadrícula; en cada día, íconos pequeños por tipo y el número de actividades. | [PDF] |
| **Día** | Lista por hora; cada actividad con ícono, etiqueta del tipo, estado, lugar y hora. | [PDF] |
| **Semana / Próximas** | Lista de los próximos 7 días agrupada por día. | [Propuesta]: cubre el escenario E3 sin navegar día por día. |

### 5.4 Codificación visual [PDF]
Cada tipo de actividad usa **color + ícono + texto**; el color nunca va solo.
| Tipo | Color | Ícono |
|---|---|---|
| Audiencia | Azul | ⚖ balanza |
| Reunión | Verde | 👥 personas |
| Visita | Naranja | 📍 ubicación |
| Otra | Gris | 📌 chincheta |

Las actividades canceladas se muestran **tachadas y con la etiqueta "Cancelada"**, no solo en otro color.

- Si una actividad nueva cruza horario con otra, se muestra un aviso sin bloquear el guardado. [Propuesta]

---

## 6. Trabajo sin conexión y sincronización

### 6.1 Requisitos
| ID | Requisito | Origen |
|---|---|---|
| RS-01 | Se puede **seguir trabajando sin Internet** en los tres módulos. | [PDF] |
| RS-02 | **No se pierde nada** de lo registrado cuando se corta la conexión. | [PDF] |
| RS-03 | Los cambios se **guardan en la tableta**. | [PDF] |
| RS-04 | Se **indica claramente** qué está guardado en la tableta y **pendiente de sincronizar**. | [PDF] |
| RS-05 | Se **sincroniza** cuando hay conexión, en la sede del PJ o desde una computadora. | [PDF] |
| RS-06 | Se **confirma si la sincronización se completó correctamente**. | [PDF] |
| RS-07 | Los datos se borran de la cola local **solo cuando el servidor confirma** que los recibió. | [Propuesta] |
| RS-08 | Si la sincronización se corta, se **reanuda sin duplicar** registros. | [Propuesta] |
| RS-09 | Se muestra la **fecha y hora de la última sincronización exitosa**. | [Propuesta] |
| RS-10 | Si el mismo registro cambió en la tableta y en la computadora, se muestran **las dos versiones para elegir**. | [Propuesta] |

### 6.2 Estados de un registro [Propuesta]
```
Borrador ──guardar──► Guardado en la tableta ──sincronizar──► Enviando ──ok──► Enviado ✓
                          ▲      (pendiente)                     │
                          │                                      └──falla──► Error ⚠ ──reintentar──┐
                          └──── editar después de enviado ◄──────────────────────────────────────────┘
```
| Estado | Cómo se ve | Texto para la jueza |
|---|---|---|
| Borrador | ✏ gris | "Sin terminar" |
| Guardado en la tableta | ⏳ ámbar | "Guardado en la tableta. Falta enviarlo." |
| Enviando | ↻ animado | "Enviando…" |
| Enviado | ✓ verde | "Enviado y respaldado" |
| Error | ⚠ rojo | "No se pudo enviar. Tus datos siguen en la tableta." |

### 6.3 Indicadores en pantalla [Propuesta]
- **Barra superior fija** en todas las pantallas:
  - `● Sin conexión · 4 registros por enviar`, o
  - `● Con conexión · Todo enviado (hoy 17:40)`.
- **Aviso breve** al perder la conexión: *"Te quedaste sin Internet. Puedes seguir trabajando: todo se guarda en la tableta."* Al recuperarla, se ofrece el botón **Enviar ahora**.
- **Ícono por registro** en las listas y en cada detalle, según 6.2.

### 6.4 Pantalla "Enviar datos" [PDF] + [Propuesta]
1. Resumen de lo pendiente: *"Casos: 2 · Actuaciones: 1 · Actividades: 1"*.
2. Botón grande **Enviar ahora**. Si no hay conexión, aparece desactivado con el motivo visible.
3. Barra de progreso: *"Enviando 2 de 4…"*.
4. Resultado:
   - Si todo salió bien: ✓ *"Listo. Se enviaron 4 registros. Todo está respaldado."*
   - Si algo falló: ⚠ *"Se enviaron 3 de 4. 1 no se pudo enviar:"*, con la lista de registros, el motivo y el botón **Reintentar**.

---

## 7. Requisitos no funcionales

### 7.1 Factores humanos y dispositivo
| ID | Requisito | Justificación |
|---|---|---|
| RNF-01 | Zonas táctiles de **al menos 48×48 px** (≈ 9 mm), separadas al menos 8 px. | Ley de Fitts; precisión del dedo. |
| RNF-02 | Texto base de 18 px; nunca menos de 16 px. | Legibilidad para usuarios con presbicia. |
| RNF-03 | Contraste de **al menos 4.5:1** (WCAG AA). | Se usa en exteriores, con luz solar. |
| RNF-04 | Las acciones principales van en la mitad inferior o en los laterales. | Alcance del pulgar al sostener la tableta. |
| RNF-05 | Cualquier tarea principal está a **3 toques o menos** desde el Inicio. | Evitar pasos innecesarios [PDF]. |
| RNF-06 | Los íconos siempre llevan texto. | Los íconos solos son ambiguos para usuarios novatos. |
| RNF-07 | Funciona en horizontal y en vertical; en la computadora, la misma estructura usa más ancho. | Uso en dos dispositivos [PDF]. |
| RNF-08 | Se puede recorrer todo con el teclado físico (Tab y Enter). | Tableta con teclado [Notas]. |
| RNF-09 | Nada de gestos ocultos (deslizar para borrar, mantener presionado); todas las acciones tienen un botón visible. | Usuarios con poca afinidad tecnológica. |

### 7.2 Rendimiento y fiabilidad [Propuesta]
| ID | Requisito |
|---|---|
| RNF-10 | Guardar y confirmar en la tableta tarda menos de 1 s. |
| RNF-11 | La búsqueda local responde en menos de 1 s. |
| RNF-12 | No se pierden datos si la app se cierra o la batería se agota en medio de un formulario (guardado automático del borrador). |
| RNF-13 | La tableta guarda al menos un mes de trabajo sin sincronizar. |

### 7.3 Seguridad y privacidad [Propuesta]
| ID | Requisito |
|---|---|
| RNF-14 | Se ingresa con un PIN de 4–6 dígitos, que funciona sin conexión. La sesión se bloquea tras 10 minutos sin uso. |
| RNF-15 | Los datos se guardan cifrados en la tableta y se envían por HTTPS. |
| RNF-16 | Los datos personales se tratan conforme a la Ley 29733 (Protección de Datos Personales). |

---

## 8. Pantallas y flujos

### 8.1 Inventario de pantallas
| # | Pantalla | Módulo |
|---|---|---|
| P01 | Ingreso con PIN | General |
| P02 | Inicio: pendientes de hoy, casos que requieren atención, accesos rápidos | General |
| P03 | Búsqueda | General |
| P04 | Lista de casos | Casos |
| P05 | Nuevo caso: paso 1, datos del caso | Casos |
| P06 | Nuevo caso: paso 2, partes | Casos |
| P07 | Nuevo caso: paso 3, revisar y guardar | Casos |
| P08 | Detalle del caso con la línea de tiempo del seguimiento | Casos |
| P09 | Agregar avance / Concluir caso | Casos |
| P10 | Editar caso (cambios resaltados) | Casos |
| P11 | Lista de actuaciones | Actuaciones |
| P12 | Nueva actuación: paso 1, tipo y asunto | Actuaciones |
| P13 | Nueva actuación: paso 2, participantes | Actuaciones |
| P14 | Nueva actuación: paso 3, revisar (con aviso de duplicado) | Actuaciones |
| P15 | Detalle de la actuación / Registrar resultado | Actuaciones |
| P16 | Agenda: vista mes | Agenda |
| P17 | Agenda: vista día | Agenda |
| P18 | Agenda: vista semana | Agenda |
| P19 | Nueva o editar actividad | Agenda |
| P20 | Enviar datos (sincronización) | Sincronización |
| P21 | Resultado de la sincronización (éxito o error) | Sincronización |

### 8.2 Flujos que recorren la situación de uso
| Flujo | Recorrido | Escenario |
|---|---|---|
| F1 | P02 → P05 → P06 (2 partes) → P07 → confirmación "C-2026-0031 guardado en la tableta ⏳" | E1 |
| F2 | P02 → P12 → P13 → P14 (aviso de duplicado, si aplica) → confirmación | E2 |
| F3 | P02 → P18 (semana) → P17 (día) | E3 |
| F4 | P18 → P19 → confirmación → la actividad aparece en P16 y P18 | E4 |
| F5 | En cualquier pantalla: aviso de "sin conexión" y la tarea continúa; el contador de pendientes sube | E5 |
| F6 | Barra superior "4 por enviar" → P20 → progreso → P21 | E6 |

---

## 9. Justificación de diseño (decisión → fundamento → necesidad)

| # | Decisión | Heurística / principio / factor humano | Necesidad que atiende o error que previene |
|---|---|---|---|
| D1 | Barra fija de conexión y pendientes + ícono por registro | Nielsen 1: visibilidad del estado del sistema | Saber en todo momento si lo registrado está a salvo y si falta enviarlo. |
| D2 | Textos como "Guardado en la tableta" y "Enviar datos" en vez de "sync" o "persistido" | Nielsen 2: relación con el mundo real | El usuario tiene poca familiaridad con términos técnicos. |
| D3 | Explicaciones simples bajo cada tipo de actuación | Nielsen 2 y 10: lenguaje del usuario, ayuda en contexto | Evita elegir mal un trámite por no entender el término legal. |
| D4 | Formularios de 3 pasos con indicador "Paso 2 de 3" | Chunking · Miller (7±2) · Nielsen 1 | Menos carga cognitiva; la jueza sabe cuánto falta. |
| D5 | El mismo patrón (lista → nuevo por pasos → revisar → confirmar) en los 3 módulos | Nielsen 4: consistencia · Ley de Jakob | Se aprende una vez y se aplica en todo. |
| D6 | Pantalla "Revisa los datos" antes de guardar | Nielsen 5: prevención de errores | Evita registros con errores o incompletos. |
| D7 | Aviso de duplicado probable con "Ver la existente" | Nielsen 5 | Resuelve el problema de datos duplicados del estado actual. |
| D8 | Autocompletar personas por DNI o nombre, y listas en vez de texto libre | Nielsen 6: reconocer antes que recordar | Menos tipeo y menos errores de escritura. |
| D9 | Editar con cambios resaltados, "Descartar" y confirmación antes de concluir | Nielsen 3: control y libertad del usuario | Corregir sin miedo; evita cierres accidentales. |
| D10 | Mensajes de error junto al campo que dicen cómo corregirlo | Nielsen 9: reconocer y recuperarse de errores | Corregir sin frustración ni bloqueo. |
| D11 | Accesos rápidos en el Inicio ("Nuevo caso", "Hoy", "Enviar datos") | Nielsen 7: flexibilidad y eficiencia · Ley de Hick | Las tareas frecuentes quedan a 1 toque. |
| D12 | Pantallas con una sola acción principal destacada | Nielsen 8: diseño minimalista · Ley de Hick | Menos opciones, decisiones más rápidas. |
| D13 | Botones de al menos 48 px y acciones principales al alcance del pulgar | Ley de Fitts · factores humanos táctiles | Precisión en la pantalla de 10". |
| D14 | Color + ícono + texto en estados y agenda | Accesibilidad (daltonismo) · codificación redundante | Exigido por el enunciado [PDF]; nadie depende solo del color. |
| D15 | Tipografía de 18 px y contraste AA | Factores humanos: visión y entorno | Legibilidad en exteriores y para usuarios mayores. |
| D16 | Guardado automático del borrador | Tolerancia a interrupciones | La jueza atiende personas y puede ser interrumpida. |
| D17 | "No tiene / no lo trajo" en los campos que pueden faltar | Nielsen 5 + contexto rural | Seguir adelante sin confusión cuando falta un dato [PDF]. |
| D18 | Regla "Requiere atención" (⚠) en el Inicio y en las listas | Nielsen 1 · memoria prospectiva | Resuelve el problema de fechas olvidadas. |
| D19 | Resultado de sincronización con detalle y "Reintentar" | Nielsen 1 y 9 | Confirmar si se completó correctamente [PDF] y saber qué hacer si falló. |
| D20 | Gestos solo como atajo; siempre hay un botón visible | Descubribilidad (Norman) | Los usuarios novatos no descubren gestos ocultos. |

---

## 10. Cobertura frente a la rúbrica

| Criterio (4 pts c/u) | Dónde se cumple |
|---|---|
| Cobertura y funcionamiento de los módulos | Secciones 3, 4 y 5; flujos F1–F4 |
| Principios de diseño y heurísticas | Sección 9 (las 10 heurísticas de Nielsen + Fitts, Hick, Miller, Jakob, Norman) |
| Factores humanos y dispositivo | Secciones 1.2–1.3 y 7.1; D13–D16 |
| Funcionamiento sin conexión | Sección 6; flujos F5–F6; D1, D19 |
| Justificación de las decisiones | Sección 9: cada decisión enlaza su fundamento con una necesidad concreta |

### Checklist de lo que exige el enunciado
- [ ] Campos obligatorios y opcionales diferenciados, con validaciones (3.2, 4.2, 5.2)
- [ ] Código generado por la app en casos y actuaciones
- [ ] Estados de los casos, incluido uno propuesto y justificado (3.3)
- [ ] Reconocer qué casos requieren atención (3.4)
- [ ] Edición que indica qué cambia y confirma el guardado (3.5)
- [ ] Evitar actuaciones incompletas o duplicadas y confirmar al guardar (4.4)
- [ ] Continuar cuando falta un dato opcional (4.4, D17)
- [ ] Vista mensual y vista de día en la agenda (5.3)
- [ ] Color acompañado de etiqueta o ícono (5.4)
- [ ] Trabajo offline, guardado local visible, pendientes y confirmación de sincronización (6)
- [ ] Uso desde tableta de 10" y desde computadora (7.1)
- [ ] PDF entregable con la descripción de cada módulo, pantallas, flujos y justificación
