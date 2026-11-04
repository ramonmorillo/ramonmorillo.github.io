# Auditoría y rediseño de ramonmorillo.es · noviembre de 2026

Rama: `claude/tender-keller-gclqgu`. Estado inicial recuperable: commit `f965fe2` (= `main` al empezar; etiqueta local `estado-inicial-pre-rediseno`).

## 1. Diagnóstico del estado inicial

| Hallazgo | Evidencia | Decisión |
|---|---|---|
| La web era una SPA de formación con rutas `#hash`; la portada (`renderTeachingHome`) vendía cursos, aula, mentorías y consultoría | `js/app.js`, `js/teaching.js`, `data/site-v5.js` | Sustituida por páginas estáticas con URL propias |
| Contenido no indexable: todo se generaba con JavaScript; el `<noscript>` mostraba un texto residual «IA aplicada a la farmacia hospitalaria… progreso, búsqueda y evaluaciones» | `index.html` anterior | Todo el contenido principal está ahora en el HTML |
| Sin `robots.txt`, `sitemap.xml`, `canonical`, `og:image`, `og:url`, datos estructurados ni `404.html` | Inventario de archivos | Añadidos y generados desde los datos |
| Meta description y OG orientados a «Cursos y sesiones prácticas» | `index.html` anterior | Reescritos por página |
| Proyectos codificados a mano dentro de cadenas HTML en JS (8 tarjetas) | `renderToolLab()` | Catálogo centralizado en `data/catalogo.json` (34 fichas) |
| Conferencias mezcladas con talleres en un array dentro de `app.js` | `CONFERENCE_EVENTS` | `data/conferencias.json` |
| Afirmaciones de trayectoria sin fuente enlazada («+100 publicaciones») | `data/site-v5.js` | Sustituida por un recuento verificable: 123 registros en PubMed para `Morillo-Verdugo R[Author]` (04/11/2026), con enlace a la búsqueda |
| Cloudflare Web Analytics presente pero no declarado en ningún texto legal | `index.html` | Mantenido y declarado en `/privacidad/` |
| Formulario de contacto con FormSubmit (servicio externo) | `js/app.js` | Mantenido, sin campos comerciales, con consentimiento y aviso |

**No verificado en esta sesión (red bloqueada):** la web publicada `https://ramonmorillo.es/`, la configuración de GitHub Pages (API no permitida) y las webs de referencia del benchmarking (`dr.juanmoradelgado.com`, `garciapellicer.ai`, `hesalud.com`, `farmaciaenvideo.com`). No se ha podido comprobar si producción coincide con `main`. Para hacerlo: abrir la web y comparar con el último commit de `main`, o ejecutar `npm run audit:github -- --check-urls` desde un equipo con acceso a internet.

## 2. Inventario de repositorios (44 públicos + 1 privado)

Leídos mediante clonado superficial de solo lectura. «Pages» = GitHub Pages activo según la API de búsqueda.

| Repositorio | Ficha | Categoría | Estado | Acceso | Observación |
|---|---|---|---|---|---|
| hub-estratificacionCMO | Hub de Estratificación CMO | Estratificación | Disponible | Abierto | Ya estaba en la web |
| cmo-vih-app | CMO-VIH Pro v3 | Estratificación | Piloto | Abierto | Se autodefine «pilot level». **Nueva ficha** |
| cmoriesgocardiovascular | CMO Cardiovascular | Estratificación | Disponible | Abierto | Conector IA opcional vacío. **Nueva ficha** |
| cmorespiratorio | SIAF-CMO Respiratorio | Estratificación | Disponible | Abierto | **Nueva ficha** |
| estratificacionmigrana | CMO-Migraña | Estratificación | Disponible | Abierto | **Nueva ficha** |
| cmoinmunomediadas | CMO Inmunomediadas | Estratificación | Disponible | Abierto | Sin pruebas automatizadas. **Nueva ficha** |
| cmopediatria | SIAF-CMO Pediatría | Estratificación | Disponible | Abierto | **Nueva ficha** |
| cmoncologia | SIAF-CMO Oncología | Estratificación | Disponible | Abierto | **Nueva ficha** |
| cmocoagulopatias | CMO Coagulopatías Congénitas | Estratificación | Disponible | Abierto | Despliegue por Actions. **Nueva** |
| cmo-vhb-vhd | CMO-HBV/HDV Pro | Estratificación | Disponible | Abierto | xlsx desde CDN sin SRI (según auditoría del hub). **Nueva** |
| estratificacionEM | CMO-EM Pro | Estratificación | Disponible | Abierto | **Nueva** |
| neumoCMO | neumoCMO | Estratificación | Disponible | Abierto | Pendiente de validación asistencial |
| SIAF-CMO | SIAF-CMO · Hub CMO-MAPEX | Estratificación | Disponible | Abierto | Página divulgativa. **Nueva** |
| cmodelta | cmodelta | Estratificación | En desarrollo | Interno | Apps Script, sin Pages. **Nueva** |
| hiv-prescribing-cascade-auditor | HIV Prescribing Cascade Auditor | Seguridad | Disponible | Abierto | Premio y registro, ver §4 |
| MRCI | MRCI Local-First Calculator | Seguridad | Disponible | Abierto | Interfaz en inglés. **Nueva** |
| cmorcvtesis | IRIS CMO | Estudios | Piloto | Restringido | Portal iriscmo.es (ya estaba) |
| dermapex | DERMAPEX | Estudios | En desarrollo | Restringido | **Nueva**. Sin enlace a la app |
| COAMO | COAMO | Estudios | Piloto | Restringido | **Nueva**. Sin enlace a la app |
| ayudaceia | AYUDA CEIA | Estudios | Disponible | Interno | **Nueva**, sin enlace |
| adhefarmapexhub | MAPEX-ADHEFAR Hub | Resultados | Disponible | Abierto | **Nueva** |
| cambiosTAR | cambiosTAR | Resultados | Disponible | Abierto | **Nueva** |
| drugpersist | DrugPersist | Resultados | Disponible | Abierto | **Nueva** |
| DRUGIMID | DrugPersist-IMID | Resultados | Disponible | Abierto | **Nueva** |
| evidencegap-radar | EvidenceGap Radar | Evidencia | Disponible | Abierto | Ya estaba |
| rxplain | RxPlain | Evidencia | Disponible | Abierto | Ya estaba; usa la API de CIMA, no IA |
| fharmacuentos | FHarmacuentos | Evidencia | Disponible | Abierto | Ya estaba; plantillas, modo IA inactivo |
| ayudainvestigacion | AyudaInvestigación | Evidencia | En desarrollo | Abierto | v0.2. **Nueva** |
| CMO-Scientific-Engine | CMO Scientific Engine | Evidencia | En desarrollo | Abierto | MVP. **Nueva** |
| pidefar | PIDEFAR | Gestión | Disponible | Interno | **Nueva**, sin enlace |
| actadeguardias | Acta de Guardias | Gestión | Disponible | Interno | **Nueva**, sin enlace |
| sesionesfarmacia | Sesiones clínicas | Gestión | Disponible | Interno | **Nueva**, sin enlace |
| ubicacionesfh | Localizador de medicamentos | Gestión | Disponible | Interno | **Nueva**, sin enlace. Ver riesgo R3 |
| antipcsk9tool | Prescripción de anti-PCSK9 | Gestión | Disponible | Interno | **Nueva**, sin enlace |

Excluidos con motivo (en `excludedRepos`): `ramonmorillo.github.io`, `cmo-vih-app2` (v2 sustituida), `cmocomunifar` (versión previa de IRIS), `estratificacionRCV` (vacío), `scientific-writing-hospital-pharmacy` (archivado), `herramientasfarmacia` (portal interno), `farmahub360` (privada con autenticación), `Liga`, `pisobarbate`, `clinicadelpiemorillo` (no profesionales o de terceros), `markitdown-converter` (privado).

**Buscados y no encontrados como repositorio público:** CMOPROMEM. «CMO-RCV / IRIS» corresponde a `cmorcvtesis` (IRIS) y `cmoriesgocardiovascular` (hospital).

## 3. Componente de IA real (verificado en código)

Ningún repositorio llama a APIs de modelos de lenguaje (búsqueda de endpoints de OpenAI, Anthropic, Gemini, Groq, OpenRouter, WebLLM o transformers.js). Lo que existe:
- **Extracción por reglas locales** (heurística en el navegador): CMO-VIH, CMO-Migraña, SIAF-CMO Pediatría, CMO-HBV/HDV, MRCI y HIV Cascade Auditor («NLP local, sin IA externa»).
- **Conector opcional a un servidor de IA institucional, desactivado**: CMO Inmunomediadas y CMO Cardiovascular.
- FHarmacuentos tiene un «modo con IA» previsto pero inactivo.

Las fichas lo declaran así. **Incoherencia a revisar:** el título del proyecto premiado habla de «herramienta digital basada en inteligencia artificial», mientras el README del auditor declara procesamiento local por reglas. La web reproduce el título literal del premio y describe el componente técnico real.

## 4. Premio del HIV Prescribing Cascade Auditor

Fuente encontrada: la propia página pública de la herramienta (sección «Reconocimientos»): «1.er Premio — XII Premios SEFH/CSL sobre Calidad de los Servicios de Farmacia y Seguridad en el Uso de los Medicamentos»; proyecto galardonado: «Mejora de la seguridad farmacoterapéutica en personas que viven con VIH mediante una herramienta digital basada en inteligencia artificial para la detección y abordaje de cascadas terapéuticas». En `site.config.js`, `awardUrl` está vacío: **no hay enlace a una comunicación oficial de la SEFH**, y una búsqueda web no la localizó. Pendiente: añadir la URL oficial en `recognition.sourceUrl` del catálogo.

## 5. Decisiones de arquitectura

- **Sin framework nuevo.** Generador estático en Node sin dependencias (`scripts/build-site.mjs`); la salida HTML se versiona y GitHub Pages la sirve tal cual (sin Actions).
- **Navegación:** Inicio · Sobre mí · Proyectos y herramientas · Investigación · Conferencias · Contacto. El Ecosistema CMO es una página dentro de Proyectos, destacada en portada y catálogo.
- **Taxonomía:** una categoría principal por ficha (6) + áreas clínicas y etiquetas como dimensiones secundarias. VIH es un área, no una categoría, para no duplicar fichas.
- **Estado y acceso son ejes distintos.** Estado: disponible / piloto / en desarrollo. Acceso: abierto / restringido / interno. La validación clínica es un tercer campo de texto.
- **Formación retirada** de la navegación y del contenido. Las rutas antiguas (`#cursos`, `#aula`, módulos…) redirigen a `/formacion/` (página de transición `noindex`); `#conferencias`, `#portfolio`, `#iris`, `#acerca` y `#contacto` redirigen a sus nuevas páginas. Las páginas estáticas formativas (`modulos/`, `perfiles/`, `recursos/`, `diccionario-ia.html`, `herramientas-ia.html`, `encuesta-previa.html`) se conservan para no romper enlaces y se han marcado `noindex`.
- **Talleres de Sevilla y Santiago:** se mantienen en Conferencias como participaciones en eventos, con sus páginas intactas (Santiago es el 16/11/2026 y los asistentes tienen el enlace). **Decisión del autor:** si los considera «formación», basta `"visible": false` en `data/conferencias.json`.
- **Privacidad:** sin cookies propias ni `localStorage`; tipografías autoalojadas (OFL) en lugar de Google Fonts.

## 6. Riesgos y pendientes de verificación

- **R1. Producción no verificada** (red bloqueada). Tras fusionar, comprobar que `ramonmorillo.es` sirve esta versión y que las URL de las herramientas responden (`npm run audit:github -- --check-urls`).
- **R2. URL de herramientas nuevas inferidas** de `ramonmorillo.es/<repositorio>/` con Pages activo; no comprobadas en vivo: cmo-vhb-vhd, estratificacionEM, cmocoagulopatias, adhefarmapexhub, cambiosTAR, drugpersist, DRUGIMID, MRCI, ayudainvestigacion, CMO-Scientific-Engine.
- **R3. `ubicacionesfh` publica exportaciones XLS reales de Farmatools** (`data/raw/`) en un repositorio público. No son datos de pacientes, pero son inventario interno del hospital. Valorar hacerlo privado. No se ha modificado (fuera del alcance).
- **R4. Afiliación «Hospital Universitario de Valme»**: tomada de las páginas propias de los talleres. «Doctor» y «profesor universitario» proceden del encargo y de la web anterior; no hay fuente enlazada. Confirmar.
- **R5. DERMAPEX:** el README dice que la lógica clínica «aún no está implementada», pero el repositorio tiene commits del 03/11/2026. Ficha marcada «En desarrollo»; actualizar cuando cambie.
- **R6. Conferencias:** solo hay tres participaciones documentadas en el repositorio. El resto de la trayectoria como ponente (incluida la del Congreso SEFH con neumoCMO) debe añadirse con su evidencia.
- **R7. Código antiguo de la SPA** (`js/app.js`, `js/teaching.js`, `js/diagnostico.js`, `data/course-data.js`, `data/site-v5.js`, `data/teaching-programs.js`, `data/cases.js`, `data/github-route.js`, `data/tooling-current.js`, `css/components.css`, `css/professional.css`) ya no se carga desde ninguna página. Se conserva sin borrar; puede eliminarse tras aprobación.
