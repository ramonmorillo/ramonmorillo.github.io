const teachingData=window.TEACHING_DATA;

function teachingProgramCard(program){
  return `<article class="course-card"><div class="course-index">${program.number}</div><div><p class="section-kicker">${program.level}</p><h2>${program.title}</h2><p>${program.promise}</p><div class="course-facts"><span>${program.sessions.length} sesiones</span><span>${program.duration}</span><span>${program.outcomes.length} productos</span></div><a class="btn" href="#${program.id}">Ver programa completo</a></div></article>`;
}

// Próximas citas primero y, debajo, la última ya celebrada (mismo orden que la página de Conferencias).
function homeEventTeasers(){
  const {next,past}=conferenceTimeline();
  const teaser=(e,label)=>`<div class="event-teaser"><span>${label} · ${e.place.replace(' · ',', ')}</span><strong>${e.title}</strong><a href="${e.href}">${e.cta} →</a></div>`;
  return next.map(e=>teaser(e,'Próxima cita')).join('')+past.slice(0,1).map(e=>teaser(e,'Última cita')).join('');
}

// Reconocimientos de la portada. Vacío = la franja no se muestra. Añadir solo premios o distinciones verificables, p. ej.:
// {title:'Nombre del premio', year:'2026', detail:'Entidad que lo concede · proyecto premiado', href:'https://enlace-a-la-fuente'}
const HOME_RECOGNITIONS=[];
function homeRecognitions(){
  if(!HOME_RECOGNITIONS.length)return '';
  return `<section class="recognitions" aria-label="Reconocimientos"><p class="section-kicker">Reconocimientos</p><div>${HOME_RECOGNITIONS.map(r=>`<article><strong>${r.title}</strong><span>${r.year} · ${r.detail}</span>${r.href?`<a href="${r.href}" target="_blank" rel="noopener noreferrer">Ver fuente ↗</a>`:''}</article>`).join('')}</div></section>`;
}

// Sesiones ya celebradas con fotografía publicada en su propia página.
function homeSessionGallery(){
  const {past}=conferenceTimeline();
  const withPhoto=past.filter(e=>e.photo);
  if(!withPhoto.length)return '';
  return `<div class="session-gallery">${withPhoto.map(e=>`<a class="session-photo" href="${e.href}"><img src="${e.photo}" alt="${e.photoAlt}" decoding="async"><span><small>${e.place.replace(' · ',', ')}</small><strong>${e.title}</strong></span></a>`).join('')}</div>`;
}

function renderTeachingHome(){
  const cmoTools=data.portfolio.filter(p=>p.category==='Estratificación CMO').length;
  const sessions=teachingData.programs.reduce((n,p)=>n+p.sessions.length,0);
  shell('IA con método para la farmacia hospitalaria.',`<div class="public-home">
    <section class="identity-hero"><div><p class="section-kicker">Ramón Morillo Verdugo · Farmacéutico de hospital</p><h1>IA con método para la farmacia hospitalaria.</h1><p class="lead">Más de veinte años en farmacia hospitalaria y, desde 2014, coordinando MAPEX: priorizar la atención farmacéutica con criterios explícitos y dejar constancia de cada decisión. Ahora enseño a usar la inteligencia artificial igual: con fuentes, con límites y con una decisión profesional que se pueda revisar.</p><div class="hero-actions"><a class="btn" href="#home-recursos">Recursos abiertos <span aria-hidden="true">↓</span></a><a class="btn secondary" href="#home-servicios">Formar a mi equipo</a></div><p class="hero-footnote">Para servicios de farmacia, sociedades científicas, universidades, grupos de investigación y equipos sanitarios.</p></div><figure class="hero-portrait"><img src="assets/ramon-morillo-retrato.webp" alt="Retrato de Ramón Morillo" width="1122" height="1402" fetchpriority="high"><figcaption>Ramón Morillo <span>Farmacia hospitalaria · Coordinación MAPEX · IA aplicada</span></figcaption></figure></section>
    <section class="proof-strip" aria-label="Trayectoria verificable"><div><strong>+20</strong><span>años en farmacia hospitalaria</span></div><div><strong>MAPEX</strong><span>coordinación nacional · SEFH desde 2014</span></div><div><strong>+100</strong><span>publicaciones científicas</span></div><div><strong>${cmoTools}</strong><span>herramientas de estratificación CMO publicadas</span></div><div><strong>2</strong><span>programas inscritos en el Registro de la Propiedad Intelectual</span></div></section>${homeRecognitions()}
    <section class="home-problem"><div><p class="section-kicker">El punto de partida</p><h2>La IA ya ha entrado en tu servicio de farmacia. Falta el método.</h2></div><ul class="scenario-list"><li>Alguien ha pegado un informe de un paciente externo en un chatbot para resumirlo antes de la consulta.</li><li>Una búsqueda bibliográfica ha devuelto tres referencias impecables. Una no existe.</li><li>Una hoja informativa para pacientes se generó en dos minutos. Nadie ha comprobado la posología frente a la ficha técnica.</li><li>Un residente presenta un análisis de datos hecho con IA y nadie sabe reproducir los pasos.</li></ul><p class="problem-close">No se trata de prohibir ni de entusiasmarse. Se trata de decidir <strong>qué tareas sí</strong>, <strong>con qué datos</strong>, <strong>cómo se verifica</strong> y <strong>quién firma</strong>.</p></section>
    <section class="home-section method-section"><div class="section-intro"><div><p class="section-kicker">01 / Método</p><h2>Lo que aprendimos estratificando pacientes, aplicado a la IA.</h2></div><p>El modelo CMO enseñó a la farmacia hospitalaria a priorizar con criterios explícitos y a dejar constancia de cada intervención. Ese mismo rigor es el que falta en el uso cotidiano de la IA.</p></div><ol class="method-steps"><li><span>01</span><h3>Delimitar</h3><p>Qué problema, para quién, con qué datos permitidos y qué no debe hacer la herramienta.</p></li><li><span>02</span><h3>Construir</h3><p>Instrucciones, flujos o prototipos a partir del conocimiento farmacéutico, no al revés.</p></li><li><span>03</span><h3>Verificar</h3><p>Contraste con la fuente, casos límite, errores deliberados y registro de lo comprobado.</p></li><li><span>04</span><h3>Decidir</h3><p>Una persona responsable acepta, corrige o descarta. La decisión y sus límites quedan documentados.</p></li></ol></section>
    <section class="home-resources" id="home-recursos"><div class="resources-head"><div><p class="section-kicker">02 / Recursos abiertos</p><h2>Empieza hoy. Sin registro y sin correo.</h2></div><p>Todo lo que se usa en mis talleres con información ficticia está aquí, en abierto. Si te sirve, úsalo con tu equipo y cita la fuente.</p></div><div class="resource-grid"><a href="#aula"><small>Aula</small><strong>${sessions} sesiones listas para impartir</strong><span>Guion, ejemplo farmacéutico, actividad y evidencia de cada sesión.</span></a><a href="#casos"><small>Entrenamiento</small><strong>${data.cases.length} casos prácticos ficticios</strong><span>Consulta externa, información de medicamentos, investigación y docencia.</span></a><a href="herramientas-ia.html"><small>Directorio</small><strong>Herramientas de IA, revisadas</strong><span>Qué hace cada una, para qué usarla y qué precauciones exige.</span></a><a href="diccionario-ia.html"><small>Glosario</small><strong>Diccionario de IA para farmacéuticos</strong><span>Los términos que aparecen en congresos y contratos, explicados sin jerga.</span></a><a href="assets/sevilla-14-octubre/atajos-de-prompt.txt" download><small>Descarga</small><strong>Atajos de instrucciones</strong><span>Plantillas de prompt para tareas farmacéuticas frecuentes.</span></a><a href="assets/foco-3-octubre/valoracion-farmaceutica-vih.zip" download><small>Descarga · skill</small><strong>Valoración farmacéutica en VIH</strong><span>Una skill instalable que estructura la valoración según el modelo CMO.</span></a><a href="descargas/plantillas/gobernanza-ia.csv" download><small>Descarga · plantilla</small><strong>Registro de gobernanza de IA</strong><span>Para inventariar usos, datos implicados, responsables y revisiones.</span></a><a href="#catalogo"><small>Biblioteca técnica</small><strong>${data.modules.length} módulos de ampliación</strong><span>GitHub, Claude, Codex, NotebookLM y desarrollo asistido, paso a paso.</span></a></div></section>
    <section class="home-section" id="home-servicios"><div class="section-intro"><div><p class="section-kicker">03 / Cómo trabajamos juntos</p><h2>De una conferencia de una hora a una herramienta construida con tu equipo.</h2></div><p>Cinco formatos que se combinan según el punto de partida y el resultado que necesitas. Todos terminan en un producto observable, no en unas diapositivas.</p></div><div class="service-list"><article><span>01</span><div><h3>Talleres prácticos</h3><p>Online o presenciales, de 90 minutos a una jornada. Cada participante sale con un flujo propio verificado.</p></div><a href="#cursos">Ver programas →</a></article><article><span>02</span><div><h3>Programas formativos</h3><p>Tres itinerarios: IA práctica y segura; investigación, docencia y comunicación científica; creación de herramientas.</p></div><a href="#cursos">Ver itinerarios →</a></article><article><span>03</span><div><h3>Conferencias</h3><p>Para congresos, jornadas y sociedades científicas, con demostración en directo y un mensaje claro sobre límites.</p></div><a href="#conferencias">Ver temas →</a></article><article><span>04</span><div><h3>Mentorías</h3><p>Uno a uno o en grupos pequeños: productividad, investigación, tu propia herramienta o liderar la IA en tu servicio.</p></div><a href="#mentorias">Ver mentorías →</a></article><article><span>05</span><div><h3>Proyectos con servicios</h3><p>Diagnóstico, priorización, prototipo, evaluación y gobernanza de un caso de uso concreto.</p></div><a href="#consultoria">Ver el proceso →</a></article></div></section>
    <section class="home-feature"><div><p class="section-kicker">04 / Sesiones recientes y próximas</p><h2>Talleres con materiales que se quedan publicados.</h2><p>Cada sesión tiene su propia página con el programa, los ejercicios y los materiales ficticios, para que el equipo pueda repetir el trabajo después.</p>${homeEventTeasers()}<a class="btn" href="#conferencias">Ver todas las sesiones</a></div>${homeSessionGallery()||'<div class="feature-quote"><span aria-hidden="true">“</span><p>Una buena demostración enseña también dónde falla la herramienta y cómo comprobarlo.</p></div>'}</section>
    <section class="home-section"><div class="section-intro"><div><p class="section-kicker">05 / Proyectos</p><h2>Herramientas que nacen de un modelo asistencial, no de una moda.</h2></div><p>Desarrolladas a partir de criterios farmacéuticos explícitos y abiertas para su examen. Su publicación no implica validación clínica ni autorización institucional.</p></div><div class="project-preview"><article><small><i class="status-dot"></i>Publicado · ${cmoTools} herramientas</small><h3>Hub de Estratificación CMO</h3><p>Un único punto de acceso a las herramientas de estratificación por patología: VIH, riesgo cardiovascular, respiratorio, oncohematología, pediatría, migraña y más. Cada aplicación mantiene sus criterios y límites propios.</p><a href="https://ramonmorillo.es/hub-estratificacionCMO/" target="_blank" rel="noopener noreferrer">Abrir el Hub CMO ↗</a></article><article><small><i class="status-dot"></i>Registro 04/2026/2614</small><h3>HIV Prescribing Cascade Auditor</h3><p>Revisión de posibles cascadas de prescripción en personas con VIH. Autoría compartida con Cecilia Solís Martín.</p><a href="https://ramonmorillo.es/hiv-prescribing-cascade-auditor/" target="_blank" rel="noopener noreferrer">Abrir herramienta ↗</a></article><article><small><i class="status-dot"></i>Registro 04/2026/3197 · iriscmo.es</small><h3>IRIS CMO</h3><p>Atención farmacéutica y seguimiento del riesgo cardiovascular desde farmacia comunitaria. Autoría compartida con María Romero Murillo.</p><a href="#iris">Conocer IRIS →</a></article></div><p class="home-subnav"><a href="#portfolio">Ver los ${data.portfolio.length} proyectos del laboratorio</a></p></section>
    <section class="teaching-faq home-faq"><p class="section-kicker">Preguntas frecuentes</p><h2>Antes de escribirme</h2><details><summary>¿Mi equipo necesita saber programar?</summary><p>No. Los talleres y los dos primeros itinerarios no requieren código. Solo el itinerario de creación de herramientas exige cierta soltura con el ordenador.</p></details><details><summary>¿Se trabaja con datos de pacientes?</summary><p>No. Las prácticas usan información pública o ficticia. Qué datos pueden usarse en la práctica real lo decide cada institución, y ese es uno de los contenidos del taller.</p></details><details><summary>¿Hace falta pagar suscripciones?</summary><p>No como requisito. Antes de cada formación se revisan las herramientas disponibles en el centro y se prepara una alternativa gratuita.</p></details><details><summary>¿Las herramientas del laboratorio están validadas clínicamente?</summary><p>No, salvo que se indique expresamente con su evidencia. Se publican para su examen, docencia e investigación.</p></details></section>
    <section class="home-about"><div><p class="section-kicker">Quién está detrás</p><h2>Farmacéutico primero. Docente, investigador y constructor de herramientas, también.</h2><p>Soy Ramón Morillo. Coordino MAPEX en la SEFH desde 2014, investigo en atención farmacéutica y enseño en la universidad. Uso la IA a diario en esos tres frentes, y enseño exactamente lo que uso.</p><a href="#acerca">Conocer mi trayectoria →</a></div><div class="initial-mark" aria-hidden="true">RM</div></section>
    <section class="home-contact"><p class="section-kicker">Hablemos</p><h2>Cuéntame qué necesita tu equipo.</h2><p>Público, nivel de partida, formato y resultado esperado. Con eso preparo una propuesta ajustada al contexto.</p><div class="hero-actions"><a class="btn" href="#contacto">Contactar</a><a class="btn secondary" href="#diagnostico">Diagnóstico de tu servicio (5 min)</a><a class="btn secondary" href="#propuesta">Definir el encargo</a></div></section>
  </div>`);
  $('#app').classList.add('home-page');
  // Las anclas de portada (#home-recursos, #home-servicios) caen en esta vista: desplazar hasta la sección.
  const anchor=location.hash.length>1&&document.getElementById(location.hash.slice(1));
  if(anchor)anchor.scrollIntoView();
}

function renderCourseIndex(){
  shell('Cursos para enseñar y aplicar',`<p class="lead">Tres itinerarios independientes y combinables. El programa completo es público; las soluciones, rúbricas y notas de facilitación permanecen en el kit docente privado.</p><div class="course-grid">${teachingData.programs.map(teachingProgramCard).join('')}</div><section class="card course-choice"><div><p class="section-kicker">Si no sabes por dónde empezar</p><h2>Usa el configurador según el grupo y el resultado esperado</h2><p>La recomendación distingue nivel, formato, tamaño y tipo de organización.</p></div><a class="btn" href="#propuesta">Diseñar una formación</a></section><section class="teaching-faq"><p class="section-kicker">Preguntas frecuentes</p><h2>Antes de elegir un recorrido</h2><details><summary>¿Es necesario saber programar?</summary><p>No para los dos primeros cursos. El recorrido de creación de herramientas comienza sin código, pero requiere soltura básica con el ordenador y disposición para revisar pruebas y errores.</p></details><details><summary>¿Hay que utilizar datos de pacientes?</summary><p>No. Las prácticas se diseñan con información pública, anonimizada de forma efectiva o completamente ficticia. La autorización institucional debe comprobarse antes de cualquier uso profesional.</p></details><details><summary>¿Son cursos autónomos o para impartir en directo?</summary><p>Las páginas pueden consultarse de forma autónoma, pero su estructura principal está pensada para formaciones facilitadas: explicación, demostración, práctica y comprobación.</p></details><details><summary>¿Se necesitan suscripciones de pago?</summary><p>No como requisito general. Antes de cada formación se revisan las herramientas disponibles y se prepara una alternativa que no dependa de contratar una API.</p></details><details><summary>¿Completar el curso valida una herramienta?</summary><p>No. Una práctica o un prototipo docente no equivalen a validación clínica, certificación institucional ni autorización para uso asistencial.</p></details></section>`);
}

function renderCourseDelivery(program){
  const delivery=program.delivery;
  if(!delivery)return '';
  return `<section class="flagship-course"><div class="section-heading"><div><p class="section-kicker">${delivery.label}</p><h2>Lista para impartir de principio a fin</h2></div><button class="btn" type="button" onclick="downloadCourseWorkbook('${program.id}')">Descargar cuaderno completo</button></div><p class="lead">${delivery.proposition}</p><div class="delivery-facts"><article><strong>Participantes</strong><p>${delivery.audience}</p></article><article><strong>Tamaño recomendado</strong><p>${delivery.groupSize}</p></article></div><h3>Formatos de impartición</h3><div class="delivery-formats">${delivery.formats.map(item=>`<article><span>${item.duration}</span><h4>${item.title}</h4><p>${item.description}</p></article>`).join('')}</div><div class="delivery-preflight"><article><p class="section-kicker">Antes de convocar</p><h3>Preparación del participante</h3><ul>${delivery.participantPreparation.map(item=>`<li>${item}</li>`).join('')}</ul></article><article><p class="section-kicker">Antes de abrir el aula</p><h3>Preparación logística</h3><ul>${delivery.roomSetup.map(item=>`<li>${item}</li>`).join('')}</ul></article></div><h3>Agenda recomendada para una jornada presencial</h3><div class="live-agenda">${delivery.liveAgenda.map(item=>`<article><time>${item.time}</time><div><h4>${item.sessionId?`<a href="#${item.sessionId}">${item.title}</a>`:item.title}</h4><p>${item.detail}</p></div></article>`).join('')}</div><section class="capstone"><p class="section-kicker">Transferencia a la práctica</p><h3>${delivery.capstone.title}</h3><p>${delivery.capstone.task}</p><strong>Carpeta de evidencias</strong><ul>${delivery.capstone.evidence.map(item=>`<li>${item}</li>`).join('')}</ul><p class="portfolio-warning">${delivery.capstone.boundary}</p></section><section><p class="section-kicker">Después de la formación</p><h3>Plan de transferencia 48 horas · 2 semanas · 30 días</h3><ol>${delivery.followUp.map(item=>`<li>${item}</li>`).join('')}</ol></section></section>`;
}

function renderTeachingCourse(program){
  shell(program.title,`<section class="course-overview"><div><p class="lead">${program.promise}</p><div class="course-facts large"><span>${program.level}</span><span>${program.duration}</span><span>${program.sessions.length} sesiones</span></div><a class="btn" href="#${program.sessions[0].id}">Abrir la primera sesión</a></div><article class="card"><p class="section-kicker">Productos del participante</p><ul>${program.outcomes.map(x=>`<li>${x}</li>`).join('')}</ul></article></section><section class="before-after"><article><p class="section-kicker">Punto de partida</p><h2>Antes</h2><ul>${program.before.map(x=>`<li>${x}</li>`).join('')}</ul></article><article><p class="section-kicker">Resultado esperado</p><h2>Después</h2><ul>${program.after.map(x=>`<li>${x}</li>`).join('')}</ul></article></section><section><p class="section-kicker">Programa completo</p><h2>Cada sesión termina en una evidencia</h2><div class="session-list">${program.sessions.map((session,index)=>`<article><div class="session-number">${String(index+1).padStart(2,'0')}</div><div><p class="session-meta">${session.duration}</p><h3>${session.title}</h3><p>${session.summary}</p><p><strong>Producto:</strong> ${session.outcome}</p></div><a class="btn secondary" href="#${session.id}">Abrir sesión</a></article>`).join('')}</div></section>${renderCourseDelivery(program)}<section class="grid two"><article class="card"><h2>Cómo se trabaja</h2><ul><li>Explicaciones breves orientadas a decisiones.</li><li>Demostraciones que hacen visible el proceso.</li><li>Práctica con información pública o ficticia.</li><li>Comprobación mediante un producto observable.</li></ul></article><article class="card"><h2>Qué no promete</h2><ul><li>No sustituye formación clínica ni normativa institucional.</li><li>No convierte un prototipo en herramienta validada.</li><li>No exige introducir información de pacientes.</li><li>No depende de memorizar marcas o interfaces.</li></ul></article></section>`);
}

function renderClassroom(){
  shell('Aula de formación',`<p class="lead">Selecciona una sesión y úsala como guion público durante la clase. Las respuestas y criterios detallados de evaluación se mantienen fuera de esta web.</p>${teachingData.programs.map(program=>`<section class="classroom-course"><div class="section-heading"><div><p class="section-kicker">Curso ${program.number}</p><h2>${program.shortTitle}</h2></div><a href="#${program.id}">Ver programa</a></div><div class="classroom-sessions">${program.sessions.map((session,index)=>`<a href="#${session.id}"><span>${String(index+1).padStart(2,'0')}</span><div><strong>${session.title}</strong><small>${session.duration} · ${session.outcome}</small></div></a>`).join('')}</div></section>`).join('')}`);
}

function findTeachingSession(id){
  for(const program of teachingData.programs){
    const index=program.sessions.findIndex(session=>session.id===id);
    if(index>=0)return {program,session:program.sessions[index],index};
  }
}

function sessionLinks(links){
  return links.map(([label,url])=>`<a class="btn secondary" href="${url}" ${url.startsWith('#')?'':'target="_blank" rel="noreferrer"'}>${label}</a>`).join('');
}

function relatedCases(ids){
  return (ids||[]).map(id=>(data.cases||[]).find(item=>item.id===id)).filter(Boolean);
}

function teachingTable(block){
  return `<div class="session-table-wrap"><table><thead><tr>${block.headers.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function renderPromptBuilder(session){
  if(!session.promptBuilder)return '';
  const requirements=findTeachingSession('sesion-requisitos').session.template.fields;
  const fields=requirements.map((label,index)=>{
    const key=`requirement-${index}`;
    const required=label==='Problema'||label==='Criterios de aceptación';
    return `<div class="prompt-field"><label for="${key}">${label}${required?' *':''}</label><textarea id="${key}" data-requirement="${label}" ${required?'required aria-describedby="'+key+'-error"':''}></textarea>${required?`<span class="field-error" id="${key}-error"></span>`:''}</div>`;
  }).join('');
  return `<section class="card prompt-builder" id="prompt-builder"><p class="section-kicker">Asistente</p><h2>${session.promptBuilder.title}</h2><p>Nada de lo que escribas se guarda ni sale de este navegador. Copia o descarga tu resultado antes de cerrar.</p><form id="first-prompt-form" novalidate><div class="prompt-field"><label for="tool-name">Nombre de la herramienta *</label><input id="tool-name" required aria-describedby="tool-name-error"><span class="field-error" id="tool-name-error"></span></div><fieldset><legend>¿La herramienta manejará datos de pacientes?</legend><label><input type="radio" name="patient-data" value="Sí"> Sí</label><label><input type="radio" name="patient-data" value="No" checked> No</label></fieldset><fieldset><legend>Agente que usarás</legend><label><input type="radio" name="code-agent" value="Codex" checked> Codex</label><label><input type="radio" name="code-agent" value="Claude Code"> Claude Code</label></fieldset><p class="patient-warning" id="patient-warning" role="alert" hidden>El repositorio y la web serán públicos. No uses nunca datos reales de pacientes, ni siquiera seudonimizados, en el código, en los ejemplos ni en el repositorio.</p><div class="prompt-fields">${fields}</div><button class="btn" type="submit">Generar</button></form><div id="prompt-results" class="prompt-results" hidden><article><h3>PRIMER PROMPT</h3><pre id="first-prompt-output" tabindex="0"></pre><div class="hero-actions"><button class="btn secondary" type="button" data-copy-output="first-prompt-output">Copiar</button><button class="btn secondary" type="button" data-download-output="first-prompt-output" data-filename="primer-prompt.md">Descargar .md</button></div></article><article><h3>ARCHIVO DE INSTRUCCIONES: <span id="instructions-filename">AGENTS.md</span></h3><pre id="instructions-output" tabindex="0"></pre><div class="hero-actions"><button class="btn secondary" type="button" data-copy-output="instructions-output">Copiar</button><button class="btn secondary" type="button" data-download-output="instructions-output" id="instructions-download" data-filename="AGENTS.md">Descargar .md</button></div></article></div><article class="change-prompt"><h3>Prompt de cambio (fase B)</h3><pre id="change-prompt-output"># Prompt de cambio (fase B)\n\n## Qué cambiar\n\n## Qué no tocar\n\n## Criterios de aceptación\n\n## Pruebas\n\n## Entrega\nEntrega el cambio como pull request.</pre><button class="btn secondary" type="button" data-copy-output="change-prompt-output">Copiar</button></article></section>`;
}

function renderSessionExtras(session){
  const parts=[];
  if(session.prerequisites)parts.push(`<section class="card session-prerequisites"><p class="section-kicker">Preparación</p><h2>${session.prerequisites.title}</h2><ul class="check-list">${session.prerequisites.items.map(x=>`<li>${x}</li>`).join('')}</ul></section>`);
  if(session.repoAnatomy)parts.push(`<section class="card repo-anatomy"><p class="section-kicker">Orientación</p><h2>${session.repoAnatomy.title}</h2>${teachingTable(session.repoAnatomy)}<p><a href="${session.repoAnatomy.link[1]}">${session.repoAnatomy.link[0]}</a></p></section>`);
  parts.push(renderPromptBuilder(session));
  if(session.workflow)parts.push(`<section class="session-workflow"><p class="section-kicker">Método</p><h2>${session.workflow.title}</h2><div class="workflow-grid">${session.workflow.phases.map(phase=>`<article class="card"><h3>${phase.title}</h3><ol>${phase.steps.map(step=>`<li><p>${step}</p><small><strong>Qué deberías ver:</strong> el resultado descrito en este paso.</small></li>`).join('')}</ol></article>`).join('')}</div><p class="private-note">${session.workflow.note}</p></section>`);
  if(session.troubleshooting)parts.push(`<section class="card troubleshooting"><p class="section-kicker">Ayuda</p><h2>${session.troubleshooting.title}</h2>${teachingTable(session.troubleshooting)}</section>`);
  if(session.security)parts.push(`<section class="card session-security"><p class="section-kicker">Límites</p><h2>${session.security.title}</h2><ul class="check-list">${session.security.items.map(x=>`<li>${x}</li>`).join('')}</ul></section>`);
  return parts.join('');
}

function promptValue(label){
  return document.querySelector(`[data-requirement="${label}"]`)?.value.trim()||'';
}

function patientClauses(){
  return ['No enviar datos a ningún servidor.','No guardar datos introducidos por el usuario en el navegador salvo petición expresa.','Usar ejemplos solo con datos ficticios marcados como tales.','Incluir un aviso de uso en el README.'];
}

function initializePromptBuilder(){
  const form=document.getElementById('first-prompt-form');
  if(!form)return;
  const warning=document.getElementById('patient-warning');
  form.addEventListener('change',()=>{warning.hidden=form.elements['patient-data'].value!=='Sí';});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    document.querySelectorAll('.field-error').forEach(x=>x.textContent='');
    const required=[{element:document.getElementById('tool-name'),message:'Indica el nombre de la herramienta.'},{element:document.querySelector('[data-requirement="Problema"]'),message:'Describe el problema.'},{element:document.querySelector('[data-requirement="Criterios de aceptación"]'),message:'Añade al menos un criterio de aceptación.'}];
    const missing=required.find(item=>!item.element.value.trim());
    if(missing){
      document.getElementById(`${missing.element.id}-error`).textContent=missing.message;
      missing.element.setAttribute('aria-invalid','true');
      missing.element.focus();
      document.getElementById('prompt-results').hidden=true;
      return;
    }
    required.forEach(item=>item.element.removeAttribute('aria-invalid'));
    const values=Object.fromEntries([...form.querySelectorAll('[data-requirement]')].map(x=>[x.dataset.requirement,x.value.trim()]));
    const criteria=values['Criterios de aceptación'].split('\n').map(x=>x.trim()).filter(Boolean).map(x=>`- ${x}`).join('\n');
    const patient=form.elements['patient-data'].value==='Sí';
    const protection=patient?`\n\n## Protección de datos\n${patientClauses().map(x=>`- ${x}`).join('\n')}`:'';
    const prompt=`# ${document.getElementById('tool-name').value.trim()}\n\n## Objetivo\nCrear la herramienta descrita en esta especificación.\n\n## Contexto de uso\n- Usuario: ${values.Usuario||''}\n- Problema: ${values.Problema}\n- Decisión apoyada: ${values['Decisión apoyada']||''}\n\n## Entradas, reglas con su fuente y salidas\n- Entradas: ${values['Entradas mínimas']||''}\n- Reglas y fuente: ${values['Reglas y fuente']||''}\n- Salidas: ${values.Salidas||''}\n\n## Fuera de alcance\n${values['Casos fuera de alcance']||''}\n\n## Tecnología\nHTML, CSS y JavaScript sin compilación, compatible con GitHub Pages, sin dependencias ni servicios externos.\n\n## Qué no hacer\nNo ampliar el alcance ni usar datos reales de pacientes.\n\n## Criterios de aceptación\n${criteria}\n\n## Pruebas a realizar antes de terminar\nComprobar cada criterio de aceptación.\n\n## Entrega\nEntregar como pull request con una descripción de los cambios y el resultado de cada criterio.${protection}`;
    const agent=form.elements['code-agent'].value;
    const filename=agent==='Codex'?'AGENTS.md':'CLAUDE.md';
    const instructions=`# Instrucciones permanentes\n\n- Crear una web estática sin compilación.\n- No añadir dependencias ni servicios externos sin permiso.\n- No romper funcionalidades existentes y verificarlas tras cada cambio.\n- Trabajar siempre mediante pull request con cambios pequeños.\n- Mantener el README con finalidad, uso y limitaciones.\n- La herramienta es docente y no sustituye el juicio clínico ni está validada clínicamente.${patient?`\n${patientClauses().map(x=>`- ${x}`).join('\n')}`:''}`;
    document.getElementById('first-prompt-output').textContent=prompt;
    document.getElementById('instructions-output').textContent=instructions;
    document.getElementById('instructions-filename').textContent=filename;
    document.getElementById('instructions-download').dataset.filename=filename;
    document.getElementById('prompt-results').hidden=false;
  });
  document.querySelectorAll('[data-copy-output]').forEach(button=>button.addEventListener('click',()=>navigator.clipboard.writeText(document.getElementById(button.dataset.copyOutput).textContent)));
  document.querySelectorAll('[data-download-output]').forEach(button=>button.addEventListener('click',()=>{
    const content=document.getElementById(button.dataset.downloadOutput).textContent;
    const url=URL.createObjectURL(new Blob([content],{type:'text/markdown;charset=utf-8'}));
    const link=document.createElement('a'); link.href=url; link.download=button.dataset.filename; link.click(); URL.revokeObjectURL(url);
  }));
}

function downloadTeachingTemplate(sessionId){
  const found=findTeachingSession(sessionId);
  if(!found)return;
  const {program,session}=found;
  const content=[
    `# ${session.template.title}`,
    '',
    `Curso: ${program.title}`,
    `Sesión: ${session.title}`,
    '',
    '## Ejemplo de trabajo',
    '',
    `**Contexto:** ${session.example.context}`,
    '',
    `**Tarea:** ${session.example.task}`,
    '',
    `**Evidencia esperada:** ${session.example.expectedEvidence}`,
    '',
    '## Ficha del participante',
    '',
    ...session.template.fields.flatMap(field=>[`### ${field}`,'','________________________________________________________________','']),
    '---',
    'Utiliza únicamente información pública, efectivamente anonimizada o ficticia. Revisa el resultado con criterio profesional.'
  ].join('\n');
  const filename=`${session.id}-ficha-participante.md`;
  const blob=new Blob([content],{type:'text/markdown;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url; link.download=filename; link.click();
  URL.revokeObjectURL(url);
}

function downloadCourseWorkbook(programId){
  const program=teachingData.programs.find(item=>item.id===programId);
  if(!program||!program.delivery)return;
  const delivery=program.delivery;
  const sections=program.sessions.flatMap((session,index)=>[
    '',
    `# ${index+1}. ${session.title}`,
    '',
    `Duración: ${session.duration}`,
    '',
    `**Pregunta de apertura:** ${session.question}`,
    '',
    `**Ejemplo:** ${session.example.title}`,
    '',
    `**Contexto:** ${session.example.context}`,
    '',
    `**Tarea:** ${session.example.task}`,
    '',
    `**Evidencia esperada:** ${session.example.expectedEvidence}`,
    '',
    ...session.template.fields.flatMap(field=>[`## ${field}`,'','________________________________________________________________',''])
  ]);
  const content=[
    `# Cuaderno del participante`,
    '',
    `## ${program.title}`,
    '',
    delivery.proposition,
    '',
    '### Compromiso de seguridad',
    '',
    'Trabajaré únicamente con información pública, efectivamente anonimizada o ficticia. No introduciré datos personales, clínicos, internos o confidenciales sin autorización institucional expresa.',
    ...sections,
    '',
    `# ${delivery.capstone.title}`,
    '',
    delivery.capstone.task,
    '',
    ...delivery.capstone.evidence.flatMap(item=>[`## ${item}`,'','________________________________________________________________','']),
    '',
    `> ${delivery.capstone.boundary}`,
    '',
    '# Plan de transferencia',
    '',
    ...delivery.followUp.map(item=>`- [ ] ${item}`)
  ].join('\n');
  const blob=new Blob([content],{type:'text/markdown;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url; link.download=`${program.id}-cuaderno-participante.md`; link.click();
  URL.revokeObjectURL(url);
}

function renderTeachingSession(found){
  const {program,session,index}=found;
  const previous=program.sessions[index-1];
  const next=program.sessions[index+1];
  const cases=relatedCases(session.caseIds);
  shell(session.title,`<div class="session-shell"><aside class="session-agenda"><p class="section-kicker">Curso ${program.number}</p><a href="#${program.id}">${program.shortTitle}</a><dl><dt>Duración</dt><dd>${session.duration}</dd><dt>Producto</dt><dd>${session.outcome}</dd></dl><ol>${session.promptBuilder?'<li>Apertura y objetivo</li><li>Tres ideas clave</li><li>Demostración</li><li>Antes de la sesión</li><li>Partes del repositorio</li><li>Asistente de primer prompt</li><li>Dos ciclos de trabajo</li><li>Resolución de problemas</li><li>Datos y responsabilidad</li><li>Ejemplo farmacéutico</li><li>Actividad y ficha</li><li>Casos y comprobación</li>':'<li>Apertura y objetivo</li><li>Tres ideas clave</li><li>Demostración</li><li>Ejemplo farmacéutico</li><li>Actividad y ficha</li><li>Casos y comprobación</li>'}</ol><button class="btn secondary" type="button" onclick="window.print()">Imprimir sesión</button></aside><article class="session-content"><section class="opening-question"><p class="section-kicker">Pregunta de apertura</p><h2>${session.question}</h2></section><section><h2>Al terminar, el participante podrá</h2><ul class="objective-list">${session.objectives.map(x=>`<li>${x}</li>`).join('')}</ul></section><section><p class="section-kicker">Explicación</p><h2>Tres ideas que deben quedar claras</h2><div class="concept-grid">${session.concepts.map((x,i)=>`<article><span>0${i+1}</span><p>${x}</p></article>`).join('')}</div></section><section class="demo-block"><p class="section-kicker">Demostración en directo</p><h2>${session.demo.title}</h2><ol>${session.demo.steps.map(x=>`<li>${x}</li>`).join('')}</ol><div class="hero-actions">${sessionLinks(session.demo.links)}</div></section>${renderSessionExtras(session)}<section class="pharmacy-example"><p class="section-kicker">Ejemplo farmacéutico ficticio</p><h2>${session.example.title}</h2><p><strong>Contexto:</strong> ${session.example.context}</p><p><strong>Encargo al grupo:</strong> ${session.example.task}</p><p><strong>Evidencia esperada:</strong> ${session.example.expectedEvidence}</p></section><section class="activity-block"><div><p class="section-kicker">Actividad del participante · ${session.activity.time}</p><h2>${session.activity.title}</h2><ol>${session.activity.instructions.map(x=>`<li>${x}</li>`).join('')}</ol></div><aside><strong>Entrega</strong><p>${session.activity.deliverable}</p></aside></section><section class="participant-sheet"><div class="section-heading"><div><p class="section-kicker">Material de trabajo</p><h2>${session.template.title}</h2></div><button class="btn" type="button" onclick="downloadTeachingTemplate('${session.id}')">Descargar ficha .md</button></div><p>Complétala individualmente o en equipo. La descarga incluye el ejemplo y campos en blanco; no contiene la solución.</p><div class="template-fields">${session.template.fields.map(field=>`<div><strong>${field}</strong><span aria-hidden="true"></span></div>`).join('')}</div></section><section><p class="section-kicker">Práctica conectada</p><h2>Casos relacionados</h2><div class="related-cases">${cases.map(item=>`<a href="#${item.id}"><span>${item.professionalArea}</span><strong>${item.title}</strong><small>${item.competency} · ${item.estimatedMinutes} min</small></a>`).join('')}</div></section><section><p class="section-kicker">Comprobación</p><h2>Evidencia mínima antes de cerrar</h2><ul class="check-list">${session.checklist.map(x=>`<li>${x}</li>`).join('')}</ul><p class="private-note">La solución razonada, la rúbrica y las notas de facilitación se encuentran en el kit docente privado.</p></section><nav class="session-nav">${previous?`<a class="btn secondary" href="#${previous.id}">← Sesión anterior</a>`:`<a class="btn secondary" href="#${program.id}">← Programa</a>`}<a class="btn secondary" href="#aula">Todas las sesiones</a>${next?`<a class="btn" href="#${next.id}">Siguiente sesión →</a>`:`<a class="btn" href="#casos">Practicar con casos →</a>`}</nav></article></div>`,'teaching-session');
  initializePromptBuilder();
}

function renderToolLab(){
  shell('Proyectos y herramientas',`<p class="lead">Herramientas que muestran cómo una necesidad farmacéutica se convierte en una aplicación revisable. Las aplicaciones publicadas no equivalen por sí mismas a validación clínica ni autorización para uso asistencial.</p><div class="tool-lab curated-tools"><!-- neumoCMO: tarjeta temporal para el Congreso SEFH; revisar tras el congreso. --><article class="tool-card"><p class="section-kicker">Atención farmacéutica respiratoria · Congreso SEFH</p><h2>neumoCMO</h2><p>Entorno digital de apoyo a la consulta del farmacéutico de hospital que atiende a pacientes con enfermedades respiratorias, basado en la metodología CMO. Reúne en un solo lugar la estratificación CMO respiratoria, MAPEX-ADHEFAR Hub, RxPlain, EvidenceGap Radar y una biblioteca de recursos seleccionados.</p><p>No incorpora algoritmos clínicos propios: enlaza a las herramientas existentes sin modificar su lógica. Pendiente de validación asistencial; no recoge datos de pacientes.</p><a class="btn" href="https://ramonmorillo.es/neumoCMO/" target="_blank" rel="noopener noreferrer">Abrir neumoCMO ↗</a></article><article class="tool-card"><p class="section-kicker">Estratificación CMO</p><h2>Hub de Estratificación CMO</h2><p>El acceso unificado a las herramientas de estratificación: VIH, riesgo cardiovascular y otras áreas terapéuticas desde un solo lugar.</p><p>Las reglas y el alcance deben comprobarse en cada herramienta antes de usarla.</p><a class="btn" href="https://ramonmorillo.es/hub-estratificacionCMO/" target="_blank" rel="noopener noreferrer">Abrir Hub CMO ↗</a></article><article class="tool-card"><p class="section-kicker">Seguridad farmacoterapéutica</p><h2>HIV Prescribing Cascade Auditor</h2><p>Auditoría estructurada de posibles cascadas terapéuticas en personas con VIH para su revisión profesional.</p><p class="registration"><strong>Registro de propiedad intelectual:</strong> programa de ordenador, asiento 04/2026/2614. Autoría y titularidad originaria compartidas por Ramón Alejandro Morillo Verdugo (50 %) y Cecilia Solís Martín (50 %).</p><a class="btn" href="https://ramonmorillo.es/hiv-prescribing-cascade-auditor/" target="_blank" rel="noopener noreferrer">Abrir herramienta ↗</a></article><article class="tool-card"><p class="section-kicker">Plataforma con dominio propio</p><h2>IRIS CMO</h2><p>Plataforma de atención farmacéutica CMO y seguimiento del riesgo cardiovascular en farmacia comunitaria, vinculada al proyecto de investigación de María Romero Murillo.</p><p class="registration"><strong>Registro de propiedad intelectual:</strong> programa de ordenador, asiento 04/2026/3197. Autoría y titularidad originaria compartidas por Ramón Alejandro Morillo Verdugo (50 %) y María Romero Murillo (50 %).</p><a class="btn" href="#iris">Conocer el proyecto IRIS →</a></article><article class="tool-card"><p class="section-kicker">Investigación</p><h2>EvidenceGap Radar</h2><p>Exploración rápida de la evidencia disponible para una pregunta PICO: publicaciones en PubMed y ensayos registrados en ClinicalTrials.gov, con una estrategia de búsqueda reproducible.</p><p>Orienta dónde hay huecos de evidencia; no sustituye una revisión sistemática.</p><a class="btn" href="https://ramonmorillo.es/evidencegap-radar/" target="_blank" rel="noopener noreferrer">Abrir herramienta ↗</a></article><article class="tool-card"><p class="section-kicker">Educación al paciente</p><h2>RxPlain</h2><p>Convierte un tratamiento complejo en una infografía clara y priorizada para el paciente: objetivos, forma de toma, señales de alarma y precauciones.</p><p>El farmacéutico revisa y valida siempre el contenido antes de entregarlo.</p><a class="btn" href="https://ramonmorillo.es/rxplain/" target="_blank" rel="noopener noreferrer">Abrir herramienta ↗</a></article><article class="tool-card"><p class="section-kicker">Pediatría</p><h2>FHarmacuentos</h2><p>Cuentos breves y motivacionales, adaptados a la edad, para acompañar a niños, niñas y adolescentes ante su tratamiento o sus visitas al hospital.</p><p>Apoyo educativo, no información clínica: el farmacéutico revisa cada cuento antes de entregarlo.</p><a class="btn" href="https://ramonmorillo.es/fharmacuentos/" target="_blank" rel="noopener noreferrer">Abrir herramienta ↗</a></article></div><section class="card"><h2>Cómo se usan en formación</h2><p>Se trabaja con ejemplos ficticios para analizar la decisión apoyada, las fuentes, los casos límite y la evidencia que faltaría antes de utilizar una herramienta en la práctica real.</p><a href="#aula">Explorar el aula</a></section>`);
}
