# Changelog

## 2026-11-09 · Acceso con clave a los talleres de Sevilla (14-oct) y Santiago (16-nov)

- `sevilla-14-octubre.html` y `santiago-16-noviembre.html` se publican cifradas (AES-256-GCM + PBKDF2-SHA-256, 600 000 iteraciones), con una pantalla de acceso con la identidad visual de cada taller. Cada página tiene su propia clave y una no abre la otra. Las URL no cambian.
- Las fuentes en claro pasan a `_talleres/`, que Jekyll no publica: las páginas, sus materiales (`assets/<taller>/`, excepto la foto de Sevilla que usa `/conferencias/`) y los datos de los módulos (`data/menu-chatgpt.js`, `data/scispace-ejercicios.js`, `data/google-ia.js`). Las URL directas de esos materiales devuelven 404; tras desbloquear se descargan con su nombre original.
- Nuevos `scripts/talleres-cifrar.mjs` (sin dependencias), `assets/js/taller-acceso.js` y `assets/css/taller-acceso.css`. Órdenes `npm run talleres`, `talleres:check` y `talleres:verify`. Las claves no se guardan en el repositorio: variable de entorno o `_talleres/claves.local.json` (en `.gitignore`).
- `validate-google-ia.js` y `validate-recursos-ia.js` validan ahora las fuentes de `_talleres/`.
- Documentación, procedimiento de cambio de clave y límites (el repositorio y su historial siguen siendo públicos en GitHub): `_talleres/README.md`.

## 2026-11-07 · Santiago 16-nov: Preparador de consulta CMO, versión web

- La tarjeta «05 · Regalo del taller» enlaza ahora a la versión web gratuita (funciona en el navegador, sin cuenta ni envío de datos). Se retira el enlace a la hoja de ejemplo: la herramienta trae pacientes ficticios para probarla.

## 2026-11-07 · Santiago 16-nov: Preparador de consulta CMO

- Nueva tarjeta «05 · Regalo del taller» en «Herramientas creadas siguiendo esta ruta» de `santiago-16-noviembre.html`, con enlaces a la herramienta (`/preparadorconsulta/`) y a una hoja de consulta de ejemplo con paciente ficticio.

## 2026-10-16 · Diagnóstico IA publicado

- Validado por el autor con las opciones por defecto. Enlaces desde la portada (bloque «Hablemos») y desde la página de contacto.

## 2026-10-16 · Analítica de visitas con Cloudflare Web Analytics

- Fragmento de Cloudflare Web Analytics (sin cookies) en las 36 páginas HTML del sitio.
- El diagnóstico IA queda accesible solo por URL (`#diagnostico`), sin enlaces, hasta su validación.

## 2026-10-16 · Diagnóstico IA de tu servicio (pendiente de validación)

- Nueva vista `#diagnostico` (`js/diagnostico.js`): 12 preguntas puntuadas en cuatro bloques y 3 de contexto, con nivel, barras por bloque, prioridad por bloque débil y formato recomendado. Se calcula en el navegador y no guarda ni envía nada; «Enviar el resultado a Ramón» abre el formulario de contacto con el resumen.
- Enlaces al diagnóstico desde la portada (bloque «Hablemos») y desde la página de contacto.
- Corrección: los botones secundarios (`.btn.secondary`) fuera de la portada tenían texto blanco sobre fondo claro y no se leían. Ahora usan el color de marca con borde.

## 2026-10-16 · Origen de los contactos y propuesta de diagnóstico

- Formulario de contacto: nuevo campo obligatorio «¿Cómo me has conocido?» (formación, newsletter, LinkedIn, buscador, recomendación, sociedad científica, otro) para saber qué canal trae encargos.
- `DIAGNOSTICO_IA_PROPUESTA.md`: borrador de preguntas, puntuación y recomendaciones del futuro «Diagnóstico IA de tu servicio», pendiente de validación.

## 2026-10-16 · Formulario de contacto: envío como el cuestionario previo

- El formulario de `#contacto` deja de usar el endpoint `formsubmit.co/ajax/`, que fallaba mostrando solo un error genérico, y pasa al envío HTML clásico de FormSubmit, el mismo que usa `encuesta-previa.html`. Tras enviar, FormSubmit redirige a `?enviado=1#contacto` y la página muestra «Mensaje enviado».
- Si FormSubmit necesita algo (activación pendiente, captcha), ahora lo muestra en su propia página en lugar de un error sin causa.
- Campos opcionales nuevos: formato previsto, asistentes aproximados y fecha orientativa. El asunto del correo sigue el motivo elegido.

## 2026-10-15 · Santiago 16-nov: sin patrocinador

- Retirada la mención «Con la colaboración de BeOne» del pie de `santiago-16-noviembre.html`, que venía de la copia de Sevilla. La jornada de Santiago no tiene patrocinador.
- Retirada también del pie de `diccionario-ia.html` y `herramientas-ia.html`, recursos generales enlazados desde varias jornadas y desde la portada. La página de Sevilla la conserva.

## 2026-10-15 · Sede de Santiago, PNT regenerado y limpieza de cabeceras

- Santiago 16-nov: sede confirmada en el Complejo Universitario de Santiago (cabecera, programa y ficha del evento).
- PNT ficticio de telefarmacia (`fuente-1`) regenerado para Sevilla y Santiago con `scripts/generar-pnt-telefarmacia.py`. La tabla del circuito ya no se sale del margen y el documento cabe en una página. El texto es idéntico al anterior, comprobado por extracción.
- Las vistas internas de la web dejan de mostrar «Aula y formación aplicada · Versión · Actualizado».
- El contenedor principal no dibuja el marco de foco al cambiar de vista.

## 2026-10-15 · Santiago 16-nov: réplica completa del taller de Sevilla

- `santiago-16-noviembre.html` pasa de plantilla con contenido pendiente a la misma página que Sevilla: programa, preparación, ruta centauro–ciborg, guía paso a paso (Claude, ChatGPT con mapa del menú +, Gemini Notebook, SciSpace y parte ciborg), 12 atajos, «códigos secretos», materiales, herramientas, recursos y ecosistema Google IA.
- Adaptado al evento: lunes 16 de noviembre, taller de 16:00 a 18:50 con cierre de 18:50 a 19:00, sede por confirmar. Sin bloque de bienvenida del patrocinador ni foto de recuerdo, que eran propios de Sevilla.
- Materiales propios en `assets/santiago-16-noviembre/`: textos, CSV, planificador de pautas (vuelve a la página de Santiago) y los dos PDF ficticios con la cabecera «Santiago de Compostela (16-11-2026)».
- `css/santiago-16-noviembre.css` se genera a partir de la hoja de Sevilla con la paleta azul y ámbar de Santiago.
- La ficha del evento en la web indica que la guía y los materiales ya están disponibles.

## 2026-10-15 · Portada v6 tras análisis comparativo

- Nueva portada (`js/teaching.js`, `renderTeachingHome`): titular «IA con método para la farmacia hospitalaria», franja de trayectoria verificable, sección del problema del lector, método en cuatro pasos, recursos abiertos sin registro, cinco formatos de trabajo, galería de sesiones con foto, proyectos con estado y registro, preguntas frecuentes, «Quién está detrás» y contacto.
- «Recursos» en la navegación principal (`#home-recursos`). Las anclas `#home-recursos` y `#home-servicios` desplazan a su sección.
- `CONFERENCE_EVENTS` admite `photo` y `photoAlt`; FOCO-VIH y Sevilla muestran la foto ya publicada en sus páginas.
- Corrección del contraste de los botones principales en modo oscuro.
- Análisis y decisiones en `ANALISIS_COMPETIDORES.md`.

## 2026-10-14 · Sevilla 14-oct: foto de la sesión

- Foto de recuerdo de la sesión del 14 de octubre al inicio de la página del taller (`sevilla-14-octubre.html#recuerdo`), en WebP y sin metadatos.

## 2026-10-14 · Sevilla 14-oct: Ecosistema Google IA como tarjeta desplegable

- «Recursos para llevarte» pasa a tres tarjetas iguales (Diccionario IA, Herramientas IA y Ecosistema Google IA); la intro dice «Tres recursos».
- El botón «Ver las 7 herramientas» despliega y pliega el catálogo debajo de las tarjetas. Empieza plegado; se abre solo si se llega con `#google-ia`. Sin JavaScript el catálogo queda visible.

## 2026-10-14 · Sevilla 14-oct: ecosistema Google IA en «Recursos para llevarte»

- Nuevo bloque `#google-ia` dentro de `#recursos`: siete tarjetas (Stitch, Pomelli, Flow Music, AI Studio, Antigravity, Flow y Mixboard) con descripción, ejemplo en farmacia hospitalaria, ejercicio práctico, «Copiar prompt» y «Abrir herramienta» en pestaña nueva (`noopener noreferrer`).
- Filtros Diseño, Comunicación, Audio/Vídeo, Desarrollo y Creatividad; etiqueta de acceso por herramienta (gratuita experimental, gratuita con límites, requiere suscripción) revisada el 14-10-2026.
- Advertencia de datos ficticios y validación profesional; nota de que las condiciones de acceso pueden cambiar.
- Contenido en `data/google-ia.js` (para añadir herramientas basta con un objeto nuevo), render en `js/google-ia.js` y validador `scripts/validate-google-ia.js` (`npm run validate-google-ia`).

## 2026-10-09 · Sevilla 14-oct: plugins, tareas programadas, diseño y artefactos

- Bloque 01: la tabla de piezas de Claude pasa de cinco a siete (añade plugin y tarea programada) con la disponibilidad por plan verificada en la ayuda oficial.
- Nuevo apartado 1.6: diferencias entre conectores, skills y plugins, con analogías y ejemplos de farmacia hospitalaria.
- Nuevo apartado 1.7: tareas programadas, con cuatro ideas por área y dos encargos copiables (PubMed semanal y notas de seguridad de la AEMPS).
- Nuevo apartado 1.8: plantilla Design, Claude Design (de pago) y conectores de diseño, con un prompt de prototipo.
- Bloque 05: opción C con el Planificador de Pautas (cuatro prompts del método y cuatro casos con resultado esperado) y tres ejemplos de artefacto (documento, presentación y diseño) a partir del PNT ficticio de telefarmacia.
- Nueva herramienta de ejemplo `assets/sevilla-14-octubre/planificador-pautas.html`, añadida también a la galería de herramientas.

## 2026-10-03 · FOCO VIH

- Foto de recuerdo de la sesión del 3 de octubre en la página del taller (`foco-3-octubre.html#recuerdo`), en WebP y sin metadatos.

## 5.2.0 - 2026-09-11

- Conversión de “IA práctica y segura para farmacia hospitalaria” en la primera formación insignia.
- Tres formatos definidos: jornada presencial, programa modular e introducción ejecutiva.
- Preparación previa del participante y checklist logístico para la organización.
- Agenda completa de 5 horas y 30 minutos con accesos directos a cada sesión.
- Proyecto final con carpeta de evidencias y límites de uso explícitos.
- Cuaderno integral del participante descargable en Markdown.
- Plan de transferencia a 48 horas, 2 semanas y 30 días.

## 5.1.0 - 2026-09-11

- Incorporación de un ejemplo farmacéutico ficticio específico en cada una de las 14 sesiones.
- Fichas de trabajo descargables en Markdown, preparadas para participantes y sin respuestas.
- Conexión de cada sesión con entre dos y cuatro casos prácticos coherentes con sus objetivos.
- Adaptación de las fichas para impresión, móvil y trabajo en equipo durante la formación.
- Validación automática de materiales, campos descargables y enlaces internos a casos.

## 5.0.0 - 2026-09-11

- Reorientación de la plataforma desde un catálogo técnico hacia un recurso docente utilizable en directo.
- Tres cursos completos con nivel, duración, transformación esperada, productos y programa público.
- Nueva aula con 14 sesiones preparadas para proyectar e impartir.
- Cada sesión incorpora pregunta de apertura, objetivos, conceptos, demostración, actividad y evidencia final.
- Navegación simplificada alrededor de cursos, aula, herramientas y casos.
- Laboratorio actualizado para abrir directamente las herramientas publicadas sin mostrar enlaces al código.
- Versión imprimible de cada sesión y adaptación específica para móvil.

## 4.2.0 - 2026-09-11

- Nuevo configurador de propuestas para hospitales, sociedades científicas, universidades y laboratorios.
- Recomendación inicial según necesidad, nivel, formato y tamaño del grupo.
- Preparación local de un correo estructurado sin enviar ni almacenar la información introducida.
- Advertencias explícitas para evitar datos personales, clínicos o confidenciales.
- Condición de independencia docente y declaración de posibles conflictos para encargos de laboratorios.

## 4.1.0 - 2026-09-10

- Reposicionamiento de la portada como plataforma de formación, consultoría y laboratorio aplicado.
- Incorporación de tres programas formativos con resultados observables.
- Nueva ruta de consultoría desde el diagnóstico hasta la implantación y el mantenimiento.
- Recuperación de los 32 casos prácticos perdidos durante el rediseño anterior.
- Reparación y ampliación del módulo de NotebookLM.
- Actualización del laboratorio con herramientas CMO recientes y descripciones específicas.
- Sincronización de versiones, fechas, fuentes de herramientas y validación automática.
- Separación efectiva entre contenidos públicos y material docente privado; retirada del repositorio de soluciones, rúbricas, claves y presentaciones reservadas.
- Incorporación del correo profesional en navegación, llamadas a la acción y documentación.

## 3.1.0 - 2026-07-14

- Corrección integral de contenidos: 15 módulos con modelo centralizado, actividades, microevaluación, fuentes, autoría, fechas, navegación y guía docente.
- Desarrollo de 32 casos prácticos con escenarios ficticios, errores deliberados, verificación, resolución, feedback y rúbrica.
- Restauración visible de la autoría de Ramón Morillo Verdugo y metadatos de creación, actualización y versión.
- Nueva presentación navegable con contador, teclado, reinicio, pantalla completa y salida.
- Nuevo modo docente con guía diferenciada, notas locales, preguntas aleatorias, temporizador, impresión y descarga.
- Añadida página “Acerca del curso” e “Historial de versiones”.
- Añadida validación automática `validate-content`.

## 3.0 - 2026-07-14

- Rediseño de la aplicación como entorno formativo modular para farmacia hospitalaria.
- Nueva arquitectura de datos centralizados y componentes reutilizables.
- Tres niveles acumulativos y ruta avanzada de farmacia hospitalaria.

## 2.0 - 2026-03

- Versión pública previa verificada en GitHub Pages con autoría de Ramón Morillo y actualización de marzo de 2026.

## 1.0 - 2026-01

- Creación original inferida del primer commit del repositorio, fechado el 2026-01-25.
