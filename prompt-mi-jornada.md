# Prompt: Mi jornada — Justicia cercana

Quiero crear un **prototipo web interactivo e inmersivo llamado “Mi jornada”**, basado en el caso **“Justicia cercana”** del examen de Human Computer Interaction. La experiencia debe permitir ponerse en el lugar de una jueza de paz que trabaja en una comunidad rural, tiene poca experiencia digital y utiliza una tableta de 10 pulgadas con conexión a Internet inestable.

Usa el PDF del examen como referencia para los requisitos, los campos y la rúbrica. Distingue los requisitos explícitos del documento de las decisiones adicionales de nuestra propuesta.

## Concepto general

La experiencia se desarrolla en un **entorno 3D en primera persona**, desde el lugar de la jueza en su oficina. Se ve el escritorio, la tableta y a las personas que llegan a solicitar atención.

El evaluador debe participar en una jornada: recibir a dos vecinos, registrar un conflicto, atender una solicitud notarial, consultar la agenda y programar una reunión. Los acontecimientos deben dar sentido a las funciones de la aplicación.

Priorizar una perspectiva desde el escritorio, con la posibilidad de mirar hacia los visitantes o hacia la tableta. No es necesario implementar desplazamiento libre. Usar un estilo visual coherente, movimientos de cámara suaves y una ambientación respetuosa, evitando caricaturizar a las comunidades rurales.

## Inicio y acceso a la aplicación

La experiencia comienza con la tableta encendida sobre el escritorio y una introducción breve que explica el contexto de la jornada.

Al seleccionar la tableta, la cámara se acerca. El usuario entra a la sección de aplicaciones y abre **“Mi jornada”** mediante su icono.

La apertura debe ser breve e interactiva. Una vez dentro, la pantalla de la tableta debe ocupar suficiente espacio para leer y utilizar cómodamente la aplicación. Incluir una opción para ampliarla y otra para volver a mirar a las personas.

No recrear innecesariamente todo un sistema operativo: implementar lo necesario para abrir la aplicación, salir y volver a entrar.

## Personajes y desarrollo de la jornada

Los visitantes deben ser visibles y presentar sus necesidades mediante diálogos breves, con texto y opciones de interacción. El audio puede ser complementario, pero la experiencia debe comprenderse sin él.

La jornada debe incluir:

1. La llegada de dos vecinos que desean registrar un conflicto.
2. Una solicitud relacionada con una actuación notarial.
3. La consulta de los compromisos de la semana y la programación de una reunión.
4. Una pérdida de conexión durante el registro de información.
5. La recuperación de conexión y la sincronización de los cambios.

Los diálogos deben aportar información útil para las tareas. Por ejemplo, una persona indica que no dispone de teléfono, y el formulario permite continuar sin exigir ese dato.

Presentar la historia como un escenario de diseño basado en el examen. No afirmar que representa investigación o validación con usuarios reales.

## Formas de explorar

Incluir dos modalidades:

- **Vivir la jornada:** recorrido guiado por los acontecimientos y las necesidades de los personajes.
- **Explorar libremente:** acceso a los módulos para revisar sus funciones sin seguir una secuencia obligatoria.

La historia puede sugerir la siguiente tarea, pero el usuario debe poder consultar registros, volver atrás y explorar. Evitar un recorrido que solo permita pulsar un único botón habilitado en cada pantalla.

## Aplicación “Mi jornada”

La pantalla de inicio debe mostrar las actividades del día, asuntos que requieren atención y accesos para registrar un caso, registrar una actuación notarial y agendar una actividad.

Mantener una navegación consistente entre **Inicio, Casos, Actuaciones notariales, Agenda y Sincronización**.

Implementar los siguientes módulos:

### 1. Casos judiciales

Permitir registrar, buscar y consultar casos; revisar detalles; actualizar su avance; reconocer cuáles requieren atención y registrar su conclusión.

Contemplar:

- Código generado por la aplicación.
- Fecha de registro.
- Tipo de conflicto o materia.
- Descripción breve.
- Estado y observaciones.
- Personas involucradas: nombres, documento cuando corresponda, contacto si está disponible, dirección o comunidad y rol.
- Historial de actuaciones con fecha y descripción.
- Próxima fecha de atención cuando corresponda.
- Resultado o acuerdo al concluir.
- Documentos o evidencias si se decide incluir esa función.

Organizar el registro en pasos comprensibles, como **Datos del caso → Personas involucradas → Revisar y guardar**. Conservar la información al avanzar y retroceder.

Desde el detalle, permitir añadir avances y agendar una próxima atención. Una actividad creada desde un caso debe conservar su vínculo con ese caso para evitar ingresar información nuevamente.

### 2. Actuaciones notariales

Permitir registrar solicitudes, localizar actuaciones anteriores, consultar detalles, actualizar estados y registrar resultados.

Contemplar:

- Código generado por la aplicación.
- Fechas de solicitud y atención.
- Tipo de actuación.
- Descripción o asunto.
- Estado y observaciones.
- Datos y roles de los participantes.
- Resultado.
- Fecha de entrega o conclusión cuando corresponda.
- Documentos adjuntos o referencias a documentos físicos si se incluye esa función.

Utilizar una estructura similar a la de casos para reducir el aprendizaje. Ayudar a detectar posibles duplicados, permitiendo revisar coincidencias sin asumir que la participación repetida de una persona constituye un duplicado.

### 3. Agenda

Permitir consultar el mes y el detalle de un día, identificar compromisos próximos, revisar las actividades de la semana y crear nuevas actividades.

Contemplar:

- Título.
- Fecha.
- Hora de inicio y término cuando corresponda.
- Lugar o comunidad.
- Descripción.
- Estado: programada, realizada o cancelada.

Mostrar etiquetas o iconos comprensibles junto con los colores. Permitir crear actividades independientes o vinculadas a un caso.

## Escena central: pérdida de Internet mientras se escribe

El usuario comienza a registrar un caso con conexión. Mientras completa el formulario, Internet se interrumpe por un acontecimiento del recorrido o mediante un control de demostración ubicado fuera de la tableta.

La aplicación debe:

- Conservar lo escrito y mantener el foco del campo.
- Permitir continuar sin bloquear la interacción.
- Mostrar un aviso discreto: **“Se perdió la conexión. Puedes continuar: tus cambios se guardan en esta tableta”.**
- Guardar automáticamente el borrador en almacenamiento local.
- Mostrar estados como **“Guardando…”** y **“Borrador guardado en esta tableta · Pendiente de sincronización”.**

Distinguir entre **guardar automáticamente un borrador** y **registrar formalmente un caso**. Al pulsar “Registrar caso”, validar los campos necesarios y confirmar el resultado.

El usuario debe poder salir a la pantalla de aplicaciones, volver a abrir “Mi jornada” y recuperar su trabajo. **La persistencia local debe ser real y comprobable.**

Aplicar la continuidad sin conexión a los tres módulos.

## Recuperación de conexión y sincronización

Incluir un acontecimiento que represente recuperar conexión, por ejemplo, llegar con la tableta a una sede con Internet. No es necesario construir un desplazamiento completo en 3D; puede utilizarse una transición breve.

Permitir sincronizar y mostrar:

- Cambios guardados localmente y pendientes.
- Sincronización en curso.
- Sincronización completada.
- Sincronización interrumpida o fallida, con posibilidad de reintento y conservación de los datos.

Distinguir siempre el estado del trámite del estado de sincronización. Un caso puede estar concluido y seguir pendiente de sincronización.

Explicar que la tableta debe conectarse y enviar sus cambios antes de que estos puedan consultarse desde una computadora. No sugerir que abrir la aplicación en otro dispositivo recupera automáticamente información que permanece únicamente en la tableta.

Si no se implementa un servidor, identificar la sincronización como simulada en la información de la demostración. Diferenciar la conexión simulada del escenario del funcionamiento real sin Internet.

Preparar la aplicación para volver a abrirse sin conexión después de su primera carga. No afirmar que toda la experiencia 3D funciona sin conexión si únicamente se ha implementado y comprobado esa capacidad en la aplicación.

## Controles de la demostración

Ubicar fuera de la interfaz de la jueza los controles del escenario:

- Cortar Internet.
- Restablecer Internet.
- Explorar libremente.
- Reiniciar demostración.
- Consultar el fundamento del diseño.

Separar visualmente los diálogos y acontecimientos externos de los mensajes propios de la aplicación. Reiniciar la demostración debe indicar si eliminará los datos de prueba.

## Usabilidad y factores humanos

Priorizar:

- Texto legible y controles táctiles amplios.
- Lenguaje familiar y mensajes concretos.
- Navegación consistente.
- Formularios organizados en pasos razonables.
- Identificación de campos obligatorios, opcionales y condicionales.
- Validaciones junto al campo, con instrucciones para corregirlo.
- Confirmaciones claras de guardado y edición.
- Conservación de datos al retroceder o perder conexión.
- Estados que no dependan únicamente del color.
- Uso cómodo en tableta de 10 pulgadas y computadora.
- Opciones para reducir transiciones y acceder directamente a la aplicación.

No exigir información que el contexto permite omitir. Usar datos ficticios en toda la demostración.

## Justificación del diseño

Incluir una opción separada para consultar las razones de las principales decisiones. Relacionar cada una mediante esta estructura:

**Decisión de interfaz → necesidad del usuario → principio, heurística o factor humano → beneficio o error que evita.**

Las explicaciones deben señalar elementos concretos de la propuesta y mantenerse fuera de la interfaz cotidiana de la jueza.

## Resultado esperado

Una experiencia web en primera persona con una oficina 3D, visitantes visibles y una tableta funcional. El evaluador debe poder completar una jornada, utilizar los tres módulos, perder conexión durante una tarea, continuar trabajando, recuperar sus datos y comprobar los estados de sincronización.

Priorizar la integridad de los flujos, la persistencia local y la claridad de uso sobre la complejidad del entorno o las animaciones.

Documentar posteriormente en un PDF las pantallas, los recorridos, los campos, las validaciones, el comportamiento sin conexión, los supuestos y las justificaciones, siguiendo los cinco criterios de la rúbrica: cobertura de módulos, principios y heurísticas, factores humanos y dispositivo, funcionamiento sin conexión y justificación de decisiones.
