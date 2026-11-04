#!/usr/bin/env node
// Generador estático de ramonmorillo.es. Sin dependencias.
// Lee data/catalogo.json, data/conferencias.json y data/investigacion.json y escribe HTML estático,
// sitemap.xml y robots.txt. Uso: `npm run build`. `npm test` comprueba que la salida está al día.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

export function loadData() {
  return { cat: readJson('data/catalogo.json'), conf: readJson('data/conferencias.json'), res: readJson('data/investigacion.json') };
}

const BASE = 'https://ramonmorillo.es';
const PERSON = 'Ramón Morillo Verdugo';
const EMAIL = ['ramon.morillo.verdugo', 'gmail.com'].join('@');
const GITHUB = 'https://github.com/ramonmorillo';
const OG_IMAGE = '/assets/og-ramon-morillo.png';
const ASSET_V = '20261104';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtMonth = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
const ext = (href, label, cls = '') => `<a class="${cls ? cls + ' ' : ''}ext" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;

const NAV = [
  ['/', 'Inicio'],
  ['/sobre-mi/', 'Sobre mí'],
  ['/proyectos/', 'Proyectos y herramientas'],
  ['/investigacion/', 'Investigación'],
  ['/conferencias/', 'Conferencias'],
];

function layout({ path, title, description, body, jsonld = [], noindex = false, section = path, ogType = 'website', headExtra = '' }) {
  const canonical = BASE + path;
  const nav = NAV.map(([href, label]) => {
    const current = href === '/' ? section === '/' : section.startsWith(href);
    return `<li><a href="${href}"${current ? ' aria-current="page"' : ''}>${label}</a></li>`;
  }).join('');
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${PERSON}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow">'}
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#0f2530" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d1619" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="${ogType}">
<meta property="og:locale" content="es_ES">
<meta property="og:site_name" content="${PERSON}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${BASE}${OG_IMAGE}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/source-serif-4-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_V}">
<script>document.documentElement.classList.add('js')</script>
${headExtra}${ld}
<!-- Cloudflare Web Analytics --><script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "5a04dad56e064c7ab68ffed70d23e732"}'></script><!-- End Cloudflare Web Analytics -->
</head>
<body>
<a class="skip" href="#contenido">Saltar al contenido</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="${PERSON}, inicio"><span class="brand-mark" aria-hidden="true">RM</span><span><strong>Ramón Morillo Verdugo</strong><small>Farmacia hospitalaria · investigación · herramientas digitales</small></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menú</button>
    <nav id="site-nav" class="nav" aria-label="Principal"><ul>${nav}<li class="nav-cta"><a href="/contacto/"${section.startsWith('/contacto/') ? ' aria-current="page"' : ''}>Contacto</a></li></ul></nav>
  </div>
</header>
<main id="contenido" tabindex="-1">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div><h2>Ramón Morillo Verdugo</h2><p>Farmacéutico especialista en Farmacia Hospitalaria, investigador y profesor universitario. Coordinador nacional de MAPEX-SEFH.</p><p class="small muted">Las herramientas enlazadas son de apoyo profesional. Su disponibilidad no implica validación clínica ni certificación como producto sanitario.</p></div>
      <div><h2>Explorar</h2><ul><li><a href="/proyectos/">Proyectos y herramientas</a></li><li><a href="/proyectos/ecosistema-cmo/">Ecosistema CMO</a></li><li><a href="/investigacion/">Investigación</a></li><li><a href="/conferencias/">Conferencias</a></li></ul></div>
      <div><h2>Contacto</h2><ul><li><a href="mailto:${EMAIL}">${EMAIL}</a></li><li>${ext(GITHUB, 'GitHub')}</li><li><a href="/privacidad/">Aviso legal y privacidad</a></li></ul></div>
    </div>
    <p class="legal">© 2026 Ramón Morillo Verdugo. Textos de esta web: todos los derechos reservados salvo indicación distinta. El modelo CMO es una obra colectiva de la Sociedad Española de Farmacia Hospitalaria (SEFH).</p>
  </div>
</footer>
<script src="/assets/js/site.js?v=${ASSET_V}" defer></script>
</body>
</html>
`;
}

// ---------- utilidades de catálogo ----------
function helpers(cat) {
  const byId = Object.fromEntries(cat.tools.map((t) => [t.id, t]));
  const catName = (id) => cat.categories.find((c) => c.id === id)?.name || id;
  const stName = (id) => cat.statuses.find((s) => s.id === id)?.name || id;
  const accName = (id) => cat.access.find((a) => a.id === id)?.name || id;
  const aiName = (id) => cat.aiTypes.find((a) => a.id === id)?.name || id;
  const badges = (t) => `<ul class="badges"><li><span class="badge st-${t.status}">${stName(t.status)}</span></li><li><span class="badge acc">${accName(t.access)}</span></li>${t.recognition ? '<li><span class="badge award">Premio</span></li>' : ''}</ul>`;
  const pageHref = (t) => (t.page ? `/proyectos/${t.page}/` : null);
  const repoUrl = (t) => `${GITHUB}/${t.repo}`;
  const showRepo = (t) => t.access === 'publico';
  const related = (t, n = 3) => cat.tools
    .filter((o) => o.id !== t.id && o.access !== 'interno')
    .map((o) => ({ o, s: o.tags.filter((x) => t.tags.includes(x) && x !== 'CMO').length * 2 + o.areas.filter((x) => t.areas.includes(x) && x !== 'Multipatología').length * 3 + (o.category === t.category ? 1 : 0) }))
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.o.name.localeCompare(b.o.name)).slice(0, n).map((x) => x.o);
  return { byId, catName, stName, accName, aiName, badges, pageHref, repoUrl, showRepo, related };
}

function toolLinks(t, h, { withPage = true } = {}) {
  const out = [];
  if (t.url) out.push(ext(t.url, t.access === 'restringido' ? `Portal ${esc(t.urlLabel || '')}`.trim() : 'Abrir herramienta', 'btn sm'));
  if (withPage && h.pageHref(t)) out.push(`<a class="btn sm ghost" href="${h.pageHref(t)}">Ficha completa</a>`);
  if (h.showRepo(t)) out.push(ext(h.repoUrl(t), 'Código', 'btn sm ghost'));
  return out.length ? `<div class="links">${out.join('')}</div>` : '';
}

function toolCard(t, h) {
  const kw = [t.name, t.repo, t.summary, t.problem, t.audience, ...t.tags, ...t.areas, h.catName(t.category)].join(' ');
  const title = h.pageHref(t) ? `<a href="${h.pageHref(t)}">${esc(t.name)}</a>` : esc(t.name);
  return `<article class="card-tool" id="${t.id}" data-category="${t.category}" data-status="${t.status}" data-access="${t.access}" data-areas="${esc(t.areas.join('|'))}" data-keywords="${esc(kw)}">
  ${h.badges(t)}
  <h3>${title}</h3>
  <p class="area">${esc(t.areas.join(' · '))}</p>
  <p>${esc(t.summary)}</p>
  <div class="tags">${t.tags.filter((x) => x !== 'CMO' || t.category !== 'estratificacion').slice(0, 4).map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>
  <details>
    <summary>Ver ficha</summary>
    <dl>
      <dt>Problema que aborda</dt><dd>${esc(t.problem)}</dd>
      <dt>Para quién</dt><dd>${esc(t.audience)}</dd>
      <dt>Funcionalidades verificadas</dt><dd><ul>${t.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></dd>
      <dt>Componente de IA</dt><dd>${esc(h.aiName(t.ai))}${t.aiNote ? '. ' + esc(t.aiNote) : ''}</dd>
      <dt>Validación</dt><dd>${esc(t.validation)}</dd>
      <dt>Autoría</dt><dd>${esc(t.authorship)}</dd>
      ${t.registration ? `<dt>Registro</dt><dd>${esc(t.registration)}</dd>` : ''}
      ${t.recognition ? `<dt>Reconocimiento</dt><dd>${esc(t.recognition.title)}</dd>` : ''}
      <dt>Último cambio en el repositorio</dt><dd><time datetime="${t.updated}">${fmtDate(t.updated)}</time></dd>
    </dl>
  </details>
  ${toolLinks(t, h)}
</article>`;
}

function stats(cat) {
  const visible = cat.tools;
  const pub = visible.filter((t) => t.access === 'publico' && t.url);
  const areas = new Set(visible.flatMap((t) => t.areas).filter((a) => !['Multipatología', 'Gestión del servicio', 'Metodología de la investigación', 'Ética de la investigación'].includes(a)));
  const cmo = visible.filter((t) => t.category === 'estratificacion' && t.access === 'publico' && t.url && !['hub-estratificacion-cmo', 'siaf-cmo', 'neumocmo'].includes(t.id));
  const studies = visible.filter((t) => t.category === 'estudios' && t.access === 'restringido');
  return { total: visible.length, pub: pub.length, areas: areas.size, cmo: cmo.length, studies: studies.length };
}

// ---------- páginas ----------
function pageHome(d) {
  const { cat, conf, res } = d; const h = helpers(cat); const s = stats(cat);
  const hiv = h.byId['hiv-cascade-auditor'];
  const featured = ['iris', 'dermapex', 'coamo', 'neumocmo', 'hub-estratificacion-cmo'].map((id) => h.byId[id]);
  const next = conf.events.filter((e) => e.visible !== false).sort((a, b) => a.date.localeCompare(b.date));
  const body = `
<section class="hero"><div class="wrap hero-grid">
  <div class="reveal">
    <p class="kicker">Farmacia hospitalaria · Investigación · Inteligencia artificial</p>
    <h1>De las ideas a herramientas reales para la farmacia hospitalaria.</h1>
    <p class="lead">Soy Ramón Morillo Verdugo, farmacéutico de hospital, investigador y coordinador nacional de MAPEX-SEFH. Desarrollo herramientas digitales y proyectos de investigación para estratificar la atención farmacéutica, mejorar la seguridad de los tratamientos y avanzar hacia una atención más personalizada.</p>
    <div class="actions"><a class="btn" href="/proyectos/">Explorar herramientas</a><a class="btn ghost" href="/sobre-mi/">Conocer mi trayectoria</a></div>
  </div>
  <figure class="portrait"><img src="/assets/ramon-morillo-retrato.webp" alt="Retrato de Ramón Morillo Verdugo" width="1122" height="1402" fetchpriority="high" decoding="async"></figure>
</div></section>

<section class="section" aria-labelledby="h-cifras" style="padding-top:0"><div class="wrap">
  <h2 id="h-cifras" class="visually-hidden">Cifras del catálogo</h2>
  <div class="facts">
    <div><strong>${s.pub}</strong><span>herramientas de acceso abierto en el catálogo</span></div>
    <div><strong>${s.cmo}</strong><span>aplicaciones de estratificación CMO por patología</span></div>
    <div><strong>${s.studies}</strong><span>plataformas de estudios clínicos (acceso restringido)</span></div>
    <div><strong>${res.meta.pubmedCount}</strong><span>registros en PubMed con autoría «Morillo-Verdugo R»</span></div>
  </div>
  <p class="facts-note">Las tres primeras cifras se calculan a partir del <a href="/proyectos/">catálogo</a>. PubMed: <a href="${esc(res.meta.pubmedUrl)}" target="_blank" rel="noopener noreferrer">búsqueda</a> del ${fmtDate(res.meta.pubmedCountDate)}.</p>
</div></section>

<section class="section" aria-labelledby="h-problema"><div class="wrap">
  <div class="section-head split"><div><p class="kicker">Qué problema intento resolver</p><h2 id="h-problema">Los modelos de atención farmacéutica necesitan herramientas para llegar a la consulta.</h2></div>
  <p>Un modelo de estratificación bien diseñado tiene poco efecto si en la consulta no hay tiempo para aplicarlo. Mi trabajo consiste en convertir criterios farmacéuticos explícitos en aplicaciones que se pueden examinar, probar y mejorar, y en investigar si funcionan.</p></div>
  <div class="grid g3">
    <div class="panel"><h3>Estratificar con criterios explícitos</h3><p>Aplicaciones del modelo CMO por patología que muestran qué variable determina cada prioridad y qué intervención corresponde.</p><a class="arrow-link" href="/proyectos/ecosistema-cmo/">Ecosistema CMO</a></div>
    <div class="panel"><h3>Hacer más seguros los tratamientos</h3><p>Revisión estructurada de cascadas de prescripción, complejidad terapéutica y cambios de tratamiento.</p><a class="arrow-link" href="/proyectos/?categoria=seguridad">Seguridad farmacoterapéutica</a></div>
    <div class="panel"><h3>Medir para investigar</h3><p>Plataformas de estudio con datos seudonimizados, cuestionarios y exportación para el análisis.</p><a class="arrow-link" href="/investigacion/">Investigación</a></div>
  </div>
</div></section>

<section class="section" aria-labelledby="h-destacados"><div class="wrap">
  <div class="section-head split"><div><p class="kicker">Proyectos destacados</p><h2 id="h-destacados">Herramientas en uso, en estudio y en construcción.</h2></div><p>Cada proyecto indica su estado, quién puede acceder y qué validación tiene documentada.</p></div>
  <article class="feature" aria-labelledby="h-hiv">
    <div>
      <p class="kicker">Seguridad farmacoterapéutica · VIH</p>
      <h3 id="h-hiv">${esc(hiv.name)}</h3>
      <p>${esc(hiv.summary)} ${esc(hiv.problem.split('. ')[0])}.</p>
      <div class="actions"><a class="btn" href="/proyectos/${hiv.page}/">Conocer el proyecto</a>${ext(hiv.url, 'Abrir herramienta', 'btn ghost')}</div>
    </div>
    <dl class="feature-aside">
      <dt>Reconocimiento</dt><dd>${esc(hiv.recognition.title)}</dd>
      <dt>Autoría</dt><dd>Ramón Morillo Verdugo y Cecilia Solís Martín</dd>
      <dt>Registro de la Propiedad Intelectual</dt><dd>Asiento 04/2026/2614</dd>
    </dl>
  </article>
  <ul class="project-list" style="margin-top:var(--s-6)">
    ${featured.map((t) => `<li><a href="${h.pageHref(t) || '/proyectos/#' + t.id}"><strong>${esc(t.name)}</strong><span class="desc">${esc(t.summary)}</span><span class="go"><span class="badge st-${t.status}">${h.stName(t.status)}</span></span></a></li>`).join('')}
  </ul>
  <p style="margin-top:var(--s-5)"><a class="arrow-link" href="/proyectos/">Ver el catálogo completo (${s.total} fichas)</a></p>
</div></section>

<section class="section" aria-labelledby="h-cmo"><div class="wrap">
  <div class="section-head split"><div><p class="kicker">Modelo CMO</p><h2 id="h-cmo">Un mismo marco, adaptado a cada patología.</h2></div>
  <p>El modelo Capacidad–Motivación–Oportunidad, desarrollado colectivamente en el proyecto MAPEX de la SEFH, ordena la atención farmacéutica según las necesidades de cada paciente. Las adaptaciones por patología se han traducido en aplicaciones que comparten lógica y diseño.</p></div>
  <div class="actions"><a class="btn" href="/proyectos/ecosistema-cmo/">Ver el ecosistema CMO</a>${ext(h.byId['hub-estratificacion-cmo'].url, 'Abrir el Hub de Estratificación', 'btn ghost')}</div>
</div></section>

<section class="section" aria-labelledby="h-conf"><div class="wrap">
  <div class="section-head split"><div><p class="kicker">Conferencias</p><h2 id="h-conf">Ponencias y sesiones recientes.</h2></div><p>Participaciones en congresos y encuentros profesionales, con sus materiales cuando están publicados.</p></div>
  <ul class="project-list">${next.slice(-3).reverse().map((e) => `<li><a href="/conferencias/#${e.id}"><strong>${esc(e.event)}</strong><span class="desc">${esc(e.title)} · ${esc(e.city)}</span><span class="go"><time datetime="${e.date}">${fmtDate(e.date)}</time></span></a></li>`).join('')}</ul>
  <p style="margin-top:var(--s-5)"><a class="arrow-link" href="/conferencias/">Todas las conferencias</a></p>
</div></section>

<section class="section" aria-labelledby="h-colab"><div class="wrap narrow">
  <p class="kicker">Colaboración</p><h2 id="h-colab">¿Un proyecto de investigación o una herramienta que construir?</h2>
  <p class="lead">Colaboro con servicios de farmacia, grupos de investigación y sociedades científicas en estudios multicéntricos, adaptación de modelos de estratificación y desarrollo de herramientas.</p>
  <div class="actions"><a class="btn" href="/contacto/">Contactar</a></div>
</div></section>`;
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: PERSON, url: BASE + '/', inLanguage: 'es' },
    personLd(),
  ];
  return layout({ path: '/', title: 'Ramón Morillo Verdugo · Farmacia hospitalaria, investigación y herramientas digitales', description: 'Farmacéutico de hospital, investigador y coordinador de MAPEX-SEFH. Herramientas digitales de estratificación CMO, seguridad farmacoterapéutica e investigación clínica.', body, jsonld, headExtra: legacyRedirectScript() });
}

function personLd() {
  return {
    '@context': 'https://schema.org', '@type': 'Person', '@id': BASE + '/#persona', name: PERSON, alternateName: 'Ramón Morillo',
    url: BASE + '/', image: BASE + '/assets/ramon-morillo-retrato.webp', jobTitle: 'Farmacéutico especialista en Farmacia Hospitalaria',
    worksFor: { '@type': 'Hospital', name: 'Hospital Universitario de Valme' },
    memberOf: { '@type': 'Organization', name: 'Sociedad Española de Farmacia Hospitalaria (SEFH)' },
    knowsAbout: ['Farmacia hospitalaria', 'Atención farmacéutica', 'Modelo CMO', 'Estratificación de pacientes', 'VIH', 'Investigación clínica', 'Herramientas digitales en salud'],
    sameAs: [GITHUB],
  };
}

// Redirección de las antiguas rutas con almohadilla (#conferencias, #portfolio…) a las nuevas páginas.
function legacyRedirectScript() {
  const map = { conferencias: '/conferencias/', portfolio: '/proyectos/', iris: '/proyectos/iris/', acerca: '/sobre-mi/', contacto: '/contacto/' };
  return `<script>(function(){var h=location.hash.slice(1);if(!h||h==='inicio'||h==='contenido')return;var m=${JSON.stringify(map)};if(m[h]){location.replace(m[h]);return;}if(/^[a-z0-9-]+$/.test(h)&&!document.getElementById(h)){location.replace('/formacion/?desde='+encodeURIComponent(h));}})();</script>\n`;
}

function pageCatalog(d) {
  const { cat } = d; const h = helpers(cat); const s = stats(cat);
  const areas = [...new Set(cat.tools.flatMap((t) => t.areas))].sort((a, b) => a.localeCompare(b, 'es'));
  const sections = cat.categories.map((c) => {
    const tools = cat.tools.filter((t) => t.category === c.id);
    if (!tools.length) return '';
    return `<section class="cat-section" id="cat-${c.id}" aria-labelledby="h-${c.id}"><header><h2 id="h-${c.id}">${esc(c.name)}</h2><p>${esc(c.description)}</p></header><div class="tool-grid">${tools.map((t) => toolCard(t, h)).join('\n')}</div></section>`;
  }).join('\n');
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="kicker">Proyectos y herramientas</p>
  <h1>Catálogo de herramientas para la farmacia hospitalaria</h1>
  <p class="lead">${s.total} fichas de aplicaciones desarrolladas a partir de repositorios públicos. Cada ficha distingue el estado de desarrollo, el tipo de acceso, el componente real de IA y la validación documentada.</p>
  <p><a class="arrow-link" href="/proyectos/ecosistema-cmo/">Ver cómo se relacionan las herramientas del ecosistema CMO</a></p>
  <p class="note">«Disponible» significa que la aplicación funciona y puede abrirse. No equivale a validación clínica ni a certificación como producto sanitario.</p>
</div></section>
<section class="section" style="padding-top:var(--s-6)"><div class="wrap" data-catalog>
  <div class="catalog-tools" role="search">
    <div class="search"><label class="visually-hidden" for="q">Buscar por nombre, problema, especialidad o palabra clave</label><input id="q" type="search" placeholder="Buscar: VIH, adherencia, hemofilia, cascadas…" autocomplete="off"></div>
    <div class="chips" role="group" aria-label="Categoría"><button type="button" class="chip" data-cat-chip="" aria-pressed="true">Todas <span class="n">${cat.tools.length}</span></button>${cat.categories.map((c) => `<button type="button" class="chip" data-cat-chip="${c.id}" aria-pressed="false">${esc(c.short)} <span class="n">${cat.tools.filter((t) => t.category === c.id).length}</span></button>`).join('')}</div>
    <div class="filters">
      <label>Área clínica<select id="f-area"><option value="">Todas</option>${areas.map((a) => `<option>${esc(a)}</option>`).join('')}</select></label>
      <label>Estado<select id="f-status"><option value="">Todos</option>${cat.statuses.map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></label>
      <label>Acceso<select id="f-access"><option value="">Todos</option>${cat.access.map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></label>
    </div>
    <div class="result-bar"><span id="result-count" aria-live="polite"></span><button type="button" class="linkish" id="catalog-reset">Limpiar filtros</button></div>
  </div>
  ${sections}
  <p id="catalog-empty" class="empty" hidden>No hay herramientas con esos criterios. Prueba con otra palabra o limpia los filtros.</p>
  <section class="panel" aria-labelledby="h-leyenda" style="margin-top:var(--s-6)">
    <h2 id="h-leyenda" style="font-size:var(--fs-3)">Cómo leer las fichas</h2>
    <dl class="deflist">
      ${cat.statuses.map((x) => `<div><dt><span class="badge st-${x.id}">${esc(x.name)}</span></dt><dd>${esc(x.description)}</dd></div>`).join('')}
      <div><dt>Acceso restringido / uso interno</dt><dd>Plataformas de estudios o herramientas del servicio. Se describen sin enlazar sus interfaces ni sus datos.</dd></div>
      ${cat.aiTypes.map((x) => `<div><dt>${esc(x.name)}</dt><dd>${esc(x.description)}</dd></div>`).join('')}
    </dl>
    <p class="small muted" style="margin-top:var(--s-4)">Catálogo revisado el ${fmtDate(cat.meta.reviewedAt)}. ${esc(cat.meta.source)}</p>
  </section>
</div></section>`;
  const jsonld = [{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Catálogo de herramientas de Ramón Morillo Verdugo', numberOfItems: cat.tools.filter((t) => t.access !== 'interno').length,
    itemListElement: cat.tools.filter((t) => t.access !== 'interno').map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: BASE + (h.pageHref(t) || '/proyectos/#' + t.id) })) }];
  return layout({ path: '/proyectos/', title: 'Proyectos y herramientas digitales para farmacia hospitalaria · Ramón Morillo', description: `Catálogo de ${s.total} herramientas: estratificación CMO, seguridad farmacoterapéutica, adherencia, plataformas de estudios clínicos y evidencia. Con estado, acceso y validación documentada.`, body, jsonld });
}

function projectPage(t, d) {
  const h = helpers(d.cat);
  const rel = h.related(t);
  const lines = d.res.lines.filter((l) => l.tools.includes(t.id));
  const pubs = lines.flatMap((l) => l.publications).filter((v, i, a) => a.indexOf(v) === i).map((p) => d.res.publications.find((x) => x.pmid === p)).filter(Boolean).slice(0, 4);
  const restricted = t.access !== 'publico';
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="breadcrumb"><a href="/proyectos/">Proyectos</a> / ${esc(h.catName(t.category))}</p>
  ${h.badges(t)}
  <h1 style="margin-top:var(--s-4)">${esc(t.name)}</h1>
  <p class="lead">${esc(t.summary)}</p>
  ${toolLinks(t, h, { withPage: false })}
  ${restricted ? `<p class="note" style="margin-top:var(--s-4)">${t.access === 'restringido' ? 'Herramienta de acceso restringido al equipo investigador. Esta ficha es informativa: no se enlazan interfaces internas ni datos.' : 'Herramienta de uso interno.'}</p>` : ''}
</div></section>
<section class="section"><div class="wrap">
  <div class="grid g2">
    <div><p class="kicker">El problema</p><h2>Qué necesidad aborda</h2><p>${esc(t.problem)}</p><p><strong>Para quién:</strong> ${esc(t.audience)}</p></div>
    <div><p class="kicker">La solución</p><h2>Qué hace</h2><ul>${t.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
  </div>
</div></section>
${t.recognition ? `<section class="section"><div class="wrap"><div class="feature"><div><p class="kicker">Reconocimiento</p><h3>${esc(t.recognition.title)}</h3><p>${esc(t.recognition.detail)}</p></div><dl class="feature-aside"><dt>Fuente</dt><dd>${esc(t.recognition.source)} ${t.recognition.sourceUrl ? ext(t.recognition.sourceUrl, 'Ver la página') : ''}</dd></dl></div></div></section>` : ''}
<section class="section"><div class="wrap">
  <p class="kicker">Ficha técnica y científica</p><h2>Contexto, validación y autoría</h2>
  <dl class="deflist">
    <div><dt>Categoría</dt><dd>${esc(h.catName(t.category))}</dd></div>
    <div><dt>Área clínica</dt><dd>${esc(t.areas.join(', '))}</dd></div>
    ${t.research ? `<div><dt>Contexto investigador</dt><dd>${esc(t.research)}</dd></div>` : ''}
    <div><dt>Estado</dt><dd>${esc(h.stName(t.status))}. ${esc(d.cat.statuses.find((s) => s.id === t.status).description)}</dd></div>
    <div><dt>Validación</dt><dd>${esc(t.validation)}</dd></div>
    <div><dt>Componente de IA</dt><dd>${esc(h.aiName(t.ai))}${t.aiNote ? '. ' + esc(t.aiNote) : ''}</dd></div>
    <div><dt>Autoría</dt><dd>${esc(t.authorship)}</dd></div>
    ${t.registration ? `<div><dt>Propiedad intelectual</dt><dd>${esc(t.registration)}</dd></div>` : ''}
    <div><dt>Etiquetas</dt><dd>${t.tags.map((x) => `<span class="tag">${esc(x)}</span>`).join(' ')}</dd></div>
    <div><dt>Último cambio en el repositorio</dt><dd><time datetime="${t.updated}">${fmtDate(t.updated)}</time>. La fecha de un cambio no equivale a una publicación ni a una validación clínica.</dd></div>
  </dl>
</div></section>
${pubs.length ? `<section class="section"><div class="wrap"><p class="kicker">Publicaciones relacionadas por línea de investigación</p><h2>Producción científica vinculada</h2><ul class="pubs">${pubs.map(pubItem).join('')}</ul><p class="small muted" style="margin-top:var(--s-3)">Relación temática con la línea «${esc(lines[0].title)}». No implica que las publicaciones evalúen esta herramienta concreta.</p></div></section>` : ''}
<section class="section"><div class="wrap">
  <div class="grid g2">
    <div class="panel tint"><h2 style="font-size:var(--fs-4)">Colaboración</h2><p>${t.category === 'estudios' ? 'Para información sobre el estudio o la participación de centros, escribe indicando tu servicio y tu interés. El acceso a la plataforma lo gestiona el equipo investigador.' : 'Si quieres evaluar la herramienta en tu servicio, adaptarla a otro contexto o colaborar en su validación, escríbeme.'}</p><a class="btn" href="/contacto/">Contactar</a></div>
    ${rel.length ? `<div><h2 style="font-size:var(--fs-4)">Proyectos relacionados</h2><ul class="project-list">${rel.map((o) => `<li><a href="${h.pageHref(o) || '/proyectos/#' + o.id}"><strong>${esc(o.name)}</strong><span class="desc">${esc(o.summary)}</span></a></li>`).join('')}</ul><p class="small muted">Relacionados por área clínica y etiquetas comunes.</p></div>` : ''}
  </div>
</div></section>`;
  const jsonld = [{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: t.name, description: t.summary, applicationCategory: 'HealthApplication', operatingSystem: 'Navegador web', url: t.url || BASE + h.pageHref(t),
    author: t.authorship.includes('Cecilia') ? [{ '@type': 'Person', name: PERSON }, { '@type': 'Person', name: 'Cecilia Solís Martín' }] : t.authorship.includes('María Romero') ? [{ '@type': 'Person', name: PERSON }, { '@type': 'Person', name: 'María Romero Murillo' }] : [{ '@type': 'Person', name: PERSON }],
    ...(t.recognition ? { award: t.recognition.title } : {}), ...(h.showRepo(t) ? { codeRepository: h.repoUrl(t) } : {}) }];
  return layout({ path: h.pageHref(t), section: '/proyectos/', title: `${t.name} · ${h.catName(t.category)} · Ramón Morillo`, description: t.summary, body, jsonld });
}

function pubItem(p) {
  return `<li><span class="t">${esc(p.title)}</span><span class="m">${esc(p.authors)} <em>${esc(p.journal)}</em>. ${p.year}.</span><a href="https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/" target="_blank" rel="noopener noreferrer">PubMed ${p.pmid}</a><a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener noreferrer">DOI</a></li>`;
}

function pageCmo(d) {
  const { cat } = d; const h = helpers(cat);
  const strat = cat.tools.filter((t) => t.category === 'estratificacion' && t.access === 'publico' && !['hub-estratificacion-cmo', 'siaf-cmo', 'neumocmo'].includes(t.id));
  const follow = ['neumocmo', 'adhefar-hub', 'cmodelta'].map((id) => h.byId[id]);
  const studies = ['iris', 'dermapex', 'coamo'].map((id) => h.byId[id]);
  const li = (t, note) => `<li><a href="${h.pageHref(t) || '/proyectos/#' + t.id}">${esc(t.name)} <em>${esc(note || t.areas[0])}</em></a></li>`;
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="breadcrumb"><a href="/proyectos/">Proyectos</a> / Ecosistema CMO</p>
  <p class="kicker">Modelo Capacidad · Motivación · Oportunidad</p>
  <h1>Ecosistema CMO: un marco común, herramientas por patología</h1>
  <p class="lead">El modelo CMO se apoya en tres pilares: Capacidad (estratificar para atender a cada paciente según sus necesidades), Motivación (alinear los objetivos farmacoterapéuticos con el paciente) y Oportunidad (seguimiento continuo más allá de la consulta). Se ha adaptado a distintas patologías y cada adaptación tiene ya su propia aplicación.</p>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head split"><div><p class="kicker">Mapa del ecosistema</p><h2>Del modelo a la consulta y a la investigación</h2></div><p>Cuatro capas, de izquierda a derecha: el marco conceptual, las herramientas que estratifican, los entornos que acompañan el seguimiento y los estudios que evalúan su aplicación.</p></div>
  <div class="eco" role="list">
    <div class="eco-col base" role="listitem"><h3>1 · Marco conceptual</h3><p>Modelo de atención farmacéutica CMO · proyecto MAPEX-SEFH</p>
      <div class="dim"><span>Capacidad<small>estratificar para atender a cada paciente según sus necesidades</small></span><span>Motivación<small>alinear con el paciente los objetivos farmacoterapéuticos</small></span><span>Oportunidad<small>seguimiento continuo, más allá de la consulta presencial</small></span></div>
      <p style="margin:0">Obra colectiva de los grupos de trabajo de la SEFH.</p></div>
    <div class="eco-col" role="listitem"><h3>2 · Estratificación</h3><p>${strat.length} aplicaciones, una por modelo publicado, reunidas en el Hub.</p><ul>${li(h.byId['hub-estratificacion-cmo'], 'acceso único')}${strat.map((t) => li(t)).join('')}</ul></div>
    <div class="eco-col" role="listitem"><h3>3 · Seguimiento y consulta</h3><p>Entornos que integran estratificación, adherencia y educación.</p><ul>${follow.map((t) => li(t, h.stName(t.status))).join('')}</ul></div>
    <div class="eco-col" role="listitem"><h3>4 · Investigación</h3><p>Estudios con plataforma propia y acceso restringido.</p><ul>${studies.map((t) => li(t, t.areas[0])).join('')}<li><a href="/proyectos/hiv-prescribing-cascade-auditor/">HIV Cascade Auditor <em>VIH · seguridad</em></a></li></ul></div>
  </div>
  <p class="eco-legend">El HIV Prescribing Cascade Auditor no aplica el modelo CMO; se incluye en la capa de investigación porque comparte población (VIH) y línea investigadora.</p>
</div></section>

<section class="section"><div class="wrap">
  <div class="grid g2">
    <div><p class="kicker">Por qué funciona como ecosistema</p><h2>Misma lógica, distintos pacientes</h2>
      <p>Cada adaptación del modelo define sus propias variables, puntuaciones e intervenciones. Las aplicaciones respetan esa especificidad: ninguna extrapola reglas de otra patología, y la lógica clínica se traza al documento de origen.</p>
      <p>Lo que comparten es la estructura: identificación de variables, cálculo de prioridad, necesidades e intervenciones acumulativas por nivel, informe para la historia clínica y exportación para investigación. Eso permite que un farmacéutico que conoce una herramienta entienda las demás.</p></div>
    <div><p class="kicker">Autoría</p><h2>Qué es colectivo y qué es individual</h2>
      <dl class="deflist">
        <div><dt>Modelo CMO y sus adaptaciones</dt><dd>Obra colectiva de la SEFH y sus grupos de trabajo. He participado en su desarrollo como coordinador nacional de MAPEX y coautor de publicaciones del modelo.</dd></div>
        <div><dt>Aplicaciones</dt><dd>Desarrolladas por mí a partir de los documentos publicados, con desarrollo asistido por herramientas de IA bajo mi dirección y revisión.</dd></div>
        <div><dt>Estudios</dt><dd>Cada estudio tiene su investigador principal y su equipo; la ficha de cada proyecto indica la atribución.</dd></div>
      </dl></div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <p class="kicker">Lo que no son</p><h2>Límites comunes a todas las herramientas</h2>
  <div class="grid g3">
    <div class="panel"><h3>No deciden</h3><p>Proponen una prioridad a partir de variables confirmadas por el farmacéutico, que puede modificarla de forma justificada.</p></div>
    <div class="panel"><h3>No son productos sanitarios certificados</h3><p>Salvo que se indique con su evidencia, ninguna tiene validación clínica formal ni marcado CE.</p></div>
    <div class="panel"><h3>No envían datos por defecto</h3><p>Funcionan en el navegador y guardan la información en el propio equipo. Las dos que admiten un conector de IA lo tienen desactivado salvo que el centro configure su propio servidor.</p></div>
  </div>
  <div class="actions" style="margin-top:var(--s-6)">${ext(h.byId['hub-estratificacion-cmo'].url, 'Abrir el Hub de Estratificación CMO', 'btn')}${ext('https://www.sefh.es/mapex/documentacion.php', 'Documentación MAPEX-SEFH', 'btn ghost')}</div>
</div></section>`;
  return layout({ path: '/proyectos/ecosistema-cmo/', section: '/proyectos/', title: 'Ecosistema CMO: herramientas de estratificación farmacéutica · Ramón Morillo', description: 'Cómo el modelo CMO (Capacidad, Motivación y Oportunidad) del proyecto MAPEX-SEFH se aplica a distintas patologías mediante herramientas de estratificación, seguimiento e investigación.', body });
}

function pageResearch(d) {
  const { cat, res } = d; const h = helpers(cat);
  const pubBy = Object.fromEntries(res.publications.map((p) => [p.pmid, p]));
  const studies = cat.tools.filter((t) => t.category === 'estudios' || t.research);
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="kicker">Investigación</p>
  <h1>Líneas de investigación y producción científica</h1>
  <p class="lead">Investigo cómo personalizar la atención farmacéutica: estratificación con el modelo CMO, seguridad del tratamiento en personas con VIH, adherencia y resultados comunicados por los pacientes.</p>
  <p><a class="arrow-link" href="${esc(res.meta.pubmedUrl)}" target="_blank" rel="noopener noreferrer">${res.meta.pubmedCount} registros en PubMed (búsqueda del ${fmtDate(res.meta.pubmedCountDate)})</a></p>
</div></section>
<section class="section"><div class="wrap">
  <p class="kicker">Tipos de evidencia</p><h2>Qué es cada cosa</h2>
  <dl class="deflist">
    <div><dt>Proyecto de investigación</dt><dd>Estudio con protocolo y, cuando procede, dictamen de comité de ética.</dd></div>
    <div><dt>Aplicación informática</dt><dd>Software que apoya la práctica o la recogida de datos. Puede estar disponible sin haber sido evaluada.</dd></div>
    <div><dt>Publicación científica</dt><dd>Artículo indexado, identificado por PMID o DOI.</dd></div>
    <div><dt>Herramienta validada</dt><dd>Solo cuando un estudio publicado evalúa su funcionamiento. A fecha de esta revisión, ninguna aplicación del catálogo declara una validación clínica formal.</dd></div>
    <div><dt>Prototipo experimental</dt><dd>Aplicación en desarrollo o en fase de pruebas.</dd></div>
  </dl>
</div></section>
${res.lines.map((l) => `<section class="section" id="linea-${l.id}"><div class="wrap">
  <div class="section-head split"><div><p class="kicker">Línea de investigación</p><h2>${esc(l.title)}</h2></div><p>${esc(l.text)}</p></div>
  ${l.publications.length ? `<ul class="pubs">${l.publications.map((p) => pubItem(pubBy[p])).join('')}</ul>` : ''}
  ${l.tools.length ? `<p style="margin-top:var(--s-4)"><strong>Herramientas relacionadas:</strong> ${l.tools.map((id) => h.byId[id]).map((t) => `<a href="${h.pageHref(t) || '/proyectos/#' + t.id}">${esc(t.name)}</a>`).join(' · ')}</p>` : ''}
</div></section>`).join('')}
<section class="section"><div class="wrap">
  <p class="kicker">Proyectos con herramienta propia</p><h2>Estudios y aplicaciones vinculadas</h2>
  <div class="table-wrap"><table><caption class="visually-hidden">Proyectos de investigación con aplicación asociada</caption>
  <thead><tr><th scope="col">Proyecto</th><th scope="col">Contexto investigador documentado</th><th scope="col">Aplicación</th></tr></thead>
  <tbody>${studies.map((t) => `<tr><th scope="row"><a href="${h.pageHref(t) || '/proyectos/#' + t.id}">${esc(t.name)}</a></th><td>${esc(t.research || '—')}</td><td><span class="badge st-${t.status}">${h.stName(t.status)}</span> <span class="badge acc">${h.accName(t.access)}</span></td></tr>`).join('')}</tbody></table></div>
  <p class="small muted" style="margin-top:var(--s-3)">Se incluyen solo los proyectos cuya relación con una aplicación está documentada en el repositorio correspondiente.</p>
</div></section>`;
  return layout({ path: '/investigacion/', title: 'Investigación en atención farmacéutica, modelo CMO y VIH · Ramón Morillo', description: 'Líneas de investigación de Ramón Morillo Verdugo: modelo CMO y estratificación, seguridad en VIH, adherencia y PROM/PREM. Publicaciones con PMID y estudios con plataforma digital propia.', body });
}

function pageConferences(d) {
  const { conf } = d;
  const events = conf.events.filter((e) => e.visible !== false).sort((a, b) => b.date.localeCompare(a.date));
  const years = [...new Set(events.map((e) => e.date.slice(0, 4)))];
  const topicName = (id) => conf.topics.find((t) => t.id === id)?.name || id;
  const usedTopics = conf.topics.filter((t) => events.some((e) => e.topics.includes(t.id)));
  const now = new Date(conf.meta.reviewedAt + 'T12:00:00'); // fecha de referencia fija: la salida es reproducible; el navegador lo recalcula
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="kicker">Conferencias</p>
  <h1>Ponencias, congresos y participaciones científicas</h1>
  <p class="lead">Intervenciones como ponente sobre inteligencia artificial, innovación y atención farmacéutica. Cada entrada enlaza a la información o los materiales publicados del evento.</p>
</div></section>
<section class="section" style="padding-top:var(--s-6)"><div class="wrap" data-talks>
  ${usedTopics.length > 1 ? `<div class="chips" role="group" aria-label="Filtrar por temática" style="margin-bottom:var(--s-6)"><button type="button" class="chip" data-topic-chip="" aria-pressed="true">Todas</button>${usedTopics.map((t) => `<button type="button" class="chip" data-topic-chip="${t.id}" aria-pressed="false">${esc(t.name)}</button>`).join('')}</div>` : ''}
  <div class="timeline">
  ${years.map((y) => `<section class="year" aria-labelledby="y-${y}"><h2 id="y-${y}">${y}</h2>
    ${events.filter((e) => e.date.startsWith(y)).map((e) => `<article class="talk" id="${e.id}" data-date="${e.date}" data-end="${e.end || e.date}" data-topics="${e.topics.join('|')}">
      <time datetime="${e.date}">${new Date(e.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}<small>${esc(e.city)}</small></time>
      <div>
        <p class="upcoming"${new Date(e.end || e.date) > now ? '' : ' hidden'}>Próximamente</p>
        <h3>${esc(e.title)}</h3>
        <p class="ev">${esc(e.event)} · ${esc(e.type)}${e.venue ? ' · ' + esc(e.venue) : ''}${e.organizer ? ' · Organiza: ' + esc(e.organizer) : ''}</p>
        ${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
        <div class="tags" style="margin-bottom:var(--s-3)">${e.topics.map((t) => `<span class="tag">${esc(topicName(t))}</span>`).join(' ')}</div>
        <div class="actions">${e.href ? `<a class="arrow-link" href="${esc(e.href)}">${esc(e.hrefLabel || 'Más información')}</a>` : ''}${e.programUrl ? ext(e.programUrl, 'Programa del evento') : ''}</div>
      </div>
      ${e.photo ? `<img src="${esc(e.photo)}" alt="${esc(e.photoAlt || '')}" loading="lazy" decoding="async" width="480" height="360">` : '<span aria-hidden="true"></span>'}
    </article>`).join('')}
  </section>`).join('')}
  </div>
  <div class="panel" style="margin-top:var(--s-7)"><h2 style="font-size:var(--fs-4)">Invitaciones</h2><p>Para proponer una ponencia o una mesa en un congreso o jornada científica, indica el evento, la fecha, el público y el tema.</p><a class="btn" href="/contacto/">Proponer una ponencia</a></div>
</div></section>`;
  const jsonld = events.map((e) => ({ '@context': 'https://schema.org', '@type': 'Event', name: `${e.event}: ${e.title}`, startDate: e.date, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', location: { '@type': 'Place', name: e.venue || e.city, address: e.city }, performer: { '@type': 'Person', name: PERSON } }));
  return layout({ path: '/conferencias/', title: 'Conferencias y ponencias sobre IA y farmacia hospitalaria · Ramón Morillo', description: 'Ponencias y participaciones de Ramón Morillo Verdugo en congresos y encuentros sobre inteligencia artificial, innovación y atención farmacéutica, ordenadas por año y temática.', body, jsonld });
}

function pageAbout(d) {
  const s = stats(d.cat);
  const body = `
<section class="page-hero"><div class="wrap hero-grid">
  <div><p class="kicker">Sobre mí</p><h1>Farmacéutico de hospital que investiga y construye herramientas</h1>
  <p class="lead">Soy farmacéutico especialista en Farmacia Hospitalaria, doctor y profesor universitario. Trabajo en el Servicio de Farmacia del Hospital Universitario de Valme (Sevilla) y coordino a nivel nacional MAPEX, la estrategia de la SEFH para la atención farmacéutica al paciente externo.</p></div>
  <figure class="portrait"><img src="/assets/ramon-morillo-retrato.webp" alt="Ramón Morillo Verdugo" width="1122" height="1402" loading="lazy" decoding="async"></figure>
</div></section>
<section class="section"><div class="wrap">
  <p class="kicker">Ejes de trabajo</p><h2>Cinco frentes que se alimentan entre sí</h2>
  <dl class="deflist">
    <div><dt>Práctica clínica</dt><dd>Más de veinte años en farmacia hospitalaria, con especial dedicación a la atención farmacéutica en consultas externas y a las personas que viven con VIH.</dd></div>
    <div><dt>Liderazgo MAPEX-SEFH</dt><dd>Coordinación nacional de MAPEX desde 2014: priorizar la atención farmacéutica con criterios explícitos y extenderla a distintas patologías.</dd></div>
    <div><dt>Modelo CMO</dt><dd>He participado en el desarrollo del modelo de atención farmacéutica Capacidad–Motivación–Oportunidad, una obra colectiva de los grupos de trabajo de la SEFH. <a href="/proyectos/ecosistema-cmo/">Ver el ecosistema CMO</a>.</dd></div>
    <div><dt>Investigación</dt><dd>Estratificación, seguridad farmacoterapéutica en VIH, adherencia y resultados comunicados por los pacientes; participación en estudios multicéntricos. <a href="/investigacion/">Ver líneas y publicaciones</a>.</dd></div>
    <div><dt>Docencia universitaria</dt><dd>Profesor universitario y formador de especialistas en farmacia hospitalaria.</dd></div>
    <div><dt>Desarrollo tecnológico</dt><dd>${s.total} herramientas catalogadas a partir de mis repositorios públicos; dos programas inscritos en el Registro de la Propiedad Intelectual con autoría compartida. <a href="/proyectos/">Ver el catálogo</a>.</dd></div>
  </dl>
</div></section>
<section class="section"><div class="wrap narrow">
  <p class="kicker">Cómo trabajo</p><h2>Primero el criterio farmacéutico, después la tecnología</h2>
  <p>Cada herramienta empieza por un documento clínico o un protocolo de estudio, no por una tecnología. Desarrollo con ayuda de asistentes de IA, bajo mi dirección y revisión, y publico el código para que pueda examinarse. Las limitaciones se escriben en cada aplicación: qué no decide, qué validación le falta y qué datos no deben introducirse.</p>
  <p>La autoría de los modelos y de los estudios es casi siempre colectiva. En cada ficha indico a quién corresponde cada parte.</p>
  <div class="actions"><a class="btn" href="/proyectos/">Explorar herramientas</a><a class="btn ghost" href="/contacto/">Contactar</a></div>
</div></section>`;
  return layout({ path: '/sobre-mi/', title: 'Sobre Ramón Morillo Verdugo · Farmacéutico de hospital, investigador y coordinador de MAPEX-SEFH', description: 'Trayectoria de Ramón Morillo Verdugo: farmacia hospitalaria, coordinación nacional de MAPEX-SEFH, modelo CMO, investigación clínica, docencia universitaria y desarrollo de herramientas digitales.', body, jsonld: [{ ...personLd(), '@type': 'Person' }], ogType: 'profile' });
}

function pageContact() {
  const next = BASE + '/contacto/?enviado=1';
  const body = `
<section class="page-hero"><div class="wrap">
  <p class="kicker">Contacto</p><h1>Colaboración científica y tecnológica</h1>
  <p class="lead">Estudios multicéntricos, adaptación de modelos de estratificación, evaluación de herramientas en un servicio o invitaciones a congresos.</p>
</div></section>
<section class="section"><div class="wrap">
  <p id="enviado" class="panel tint" role="status" hidden>Mensaje enviado. Gracias: responderé al correo que has indicado.</p>
  <div class="grid g2" style="align-items:start">
    <form class="form panel" action="https://formsubmit.co/${EMAIL}" method="POST">
      <input type="hidden" name="_subject" value="Web ramonmorillo.es · contacto">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_captcha" value="false">
      <input type="hidden" name="_next" value="${next}">
      <label>Nombre<input name="Nombre" autocomplete="name" maxlength="120" required></label>
      <label>Correo electrónico<input name="email" type="email" autocomplete="email" maxlength="160" required></label>
      <label class="full">Institución u organización <small>(opcional)</small><input name="Institución" autocomplete="organization" maxlength="160"></label>
      <label class="full">Motivo<select name="Motivo" required><option>Colaboración en investigación</option><option>Evaluación o adaptación de una herramienta</option><option>Invitación a congreso o jornada</option><option>Otra consulta profesional</option></select></label>
      <label class="full">Mensaje<textarea name="Mensaje" maxlength="3000" required></textarea><small>No incluyas datos de pacientes ni información clínica identificable.</small></label>
      <input type="text" name="_honey" class="honey" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="check full"><input type="checkbox" required> <span>He leído el <a href="/privacidad/">aviso de privacidad</a> y acepto que estos datos se usen solo para responder a mi consulta.</span></label>
      <p class="full small muted" style="margin:0">El envío se realiza mediante el servicio externo FormSubmit, que remite el mensaje por correo electrónico. No se almacena en esta web.</p>
      <button class="btn full" type="submit">Enviar mensaje</button>
    </form>
    <div>
      <h2 style="font-size:var(--fs-4)">Correo directo</h2>
      <p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
      <h2 style="font-size:var(--fs-4);margin-top:var(--s-6)">Código</h2>
      <p>${ext(GITHUB, 'github.com/ramonmorillo')}</p>
      <h2 style="font-size:var(--fs-4);margin-top:var(--s-6)">Para orientar la respuesta</h2>
      <ul><li>Servicio, centro o grupo desde el que escribes.</li><li>Proyecto o herramienta de interés.</li><li>Tipo de colaboración y plazos aproximados.</li></ul>
      <p class="note warn">Las herramientas de estudios con acceso restringido solo se abren a los equipos autorizados por cada investigador principal.</p>
    </div>
  </div>
</div></section>
<script>if(new URLSearchParams(location.search).get('enviado')==='1'){document.getElementById('enviado').hidden=false;history.replaceState(null,'',location.pathname)}</script>`;
  return layout({ path: '/contacto/', title: 'Contacto · Ramón Morillo Verdugo', description: 'Contacto profesional con Ramón Morillo Verdugo para colaboración en investigación, evaluación de herramientas digitales o invitaciones a congresos.', body });
}

function pagePrivacy() {
  const body = `
<section class="page-hero"><div class="wrap narrow">
  <p class="kicker">Información legal</p><h1>Aviso legal y privacidad</h1>
  <p class="lead">Qué hace realmente esta web con tus datos y en qué condiciones se ofrecen los contenidos y las herramientas enlazadas.</p>
  <p class="small muted">Última revisión: 4 de noviembre de 2026.</p>
</div></section>
<section class="section"><div class="wrap narrow">
  <h2>Titular</h2>
  <p>Ramón Morillo Verdugo. Contacto: <a href="mailto:${EMAIL}">${EMAIL}</a>. Web personal y profesional de carácter informativo; no se contratan servicios ni se venden productos a través de ella.</p>
  <h2>Datos que se tratan</h2>
  <dl class="deflist">
    <div><dt>Navegación</dt><dd>La web es estática y no usa cookies propias ni almacenamiento en tu navegador. Se aloja en GitHub Pages (GitHub, Inc.), que registra datos técnicos de acceso como la dirección IP por razones de seguridad.</dd></div>
    <div><dt>Estadística</dt><dd>Se usa Cloudflare Web Analytics, que ofrece datos agregados de visitas sin cookies ni perfiles individuales.</dd></div>
    <div><dt>Formulario de contacto</dt><dd>Nombre, correo, institución opcional y mensaje. Se envían mediante FormSubmit al correo del titular con la única finalidad de responder. Base jurídica: tu consentimiento. Se conservan el tiempo necesario para atender la consulta y la relación que se derive de ella.</dd></div>
    <div><dt>Datos de salud</dt><dd>Esta web no solicita ni debe recibir datos de pacientes. Si se incluyen por error en un mensaje, se eliminarán.</dd></div>
  </dl>
  <p>Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo con las garantías que ofrezcan en sus propias condiciones. Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo al correo indicado, y reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).</p>
  <p>Las tipografías se sirven desde esta misma web; no se cargan fuentes de terceros.</p>
  <h2>Herramientas enlazadas</h2>
  <p>Las aplicaciones del catálogo son proyectos independientes, cada uno con su propio repositorio y, cuando existen, sus propias condiciones de uso, aviso legal y política de privacidad. En particular:</p>
  <ul>
    <li>Son herramientas de apoyo profesional. No diagnostican, no prescriben y no sustituyen el juicio clínico.</li>
    <li>Salvo indicación expresa con su evidencia, no han sido validadas clínicamente ni están certificadas como producto sanitario conforme al Reglamento (UE) 2017/745. Su cualificación regulatoria debe valorarse antes de cualquier uso asistencial.</li>
    <li>No deben introducirse datos que identifiquen a pacientes en herramientas de acceso abierto.</li>
    <li>Las plataformas de estudios clínicos tienen acceso restringido, se rigen por el protocolo aprobado por el comité de ética correspondiente y su tratamiento de datos lo determina el promotor de cada estudio.</li>
    <li>En cada ficha se indica qué componente de inteligencia artificial existe realmente. Esta web no incorpora sistemas de IA que interactúen con quien la visita.</li>
  </ul>
  <h2>Propiedad intelectual</h2>
  <p>Los textos de esta web pertenecen a su titular salvo indicación distinta. El modelo CMO y sus adaptaciones son obra colectiva de la Sociedad Española de Farmacia Hospitalaria. Los programas inscritos en el Registro de la Propiedad Intelectual se identifican en su ficha con su número de asiento y su autoría compartida. Las tipografías Inter y Source Serif 4 se distribuyen con licencia SIL Open Font License 1.1.</p>
  <h2>Enlaces externos</h2>
  <p>Los enlaces a sitios de terceros (PubMed, SEFH, revistas) se ofrecen como referencia; su contenido es responsabilidad de sus titulares.</p>
</div></section>`;
  return layout({ path: '/privacidad/', title: 'Aviso legal y privacidad · Ramón Morillo Verdugo', description: 'Aviso legal y política de privacidad de ramonmorillo.es: datos que se tratan, formulario de contacto, estadística sin cookies y condiciones de las herramientas enlazadas.', body });
}

function pageFormacion() {
  const body = `
<section class="page-hero"><div class="wrap narrow">
  <p class="kicker">Sección retirada</p><h1>La sección de formación ya no forma parte de esta web</h1>
  <p class="lead">Los cursos, el aula y la biblioteca formativa se han retirado. Las páginas de las sesiones ya celebradas o programadas siguen disponibles en Conferencias.</p>
  <div class="actions"><a class="btn" href="/conferencias/">Ir a Conferencias</a><a class="btn ghost" href="/proyectos/">Ver proyectos y herramientas</a><a class="btn ghost" href="/contacto/">Contactar</a></div>
</div></section>`;
  return layout({ path: '/formacion/', title: 'Sección retirada · Ramón Morillo Verdugo', description: 'La sección de formación se ha retirado de ramonmorillo.es.', body, noindex: true });
}

function page404() {
  const body = `
<section class="page-hero"><div class="wrap narrow">
  <p class="kicker">Error 404</p><h1>Esta página no existe</h1>
  <p class="lead">Puede que la dirección haya cambiado con la nueva organización de la web.</p>
  <div class="actions"><a class="btn" href="/">Inicio</a><a class="btn ghost" href="/proyectos/">Proyectos y herramientas</a><a class="btn ghost" href="/conferencias/">Conferencias</a></div>
</div></section>`;
  return layout({ path: '/404.html', title: 'Página no encontrada · Ramón Morillo Verdugo', description: 'Página no encontrada.', body, noindex: true });
}

export function build(d = loadData()) {
  const out = {};
  const add = (path, html) => { out[path] = html; };
  add('index.html', pageHome(d));
  add('proyectos/index.html', pageCatalog(d));
  add('proyectos/ecosistema-cmo/index.html', pageCmo(d));
  d.cat.tools.filter((t) => t.page).forEach((t) => add(`proyectos/${t.page}/index.html`, projectPage(t, d)));
  add('investigacion/index.html', pageResearch(d));
  add('conferencias/index.html', pageConferences(d));
  add('sobre-mi/index.html', pageAbout(d));
  add('contacto/index.html', pageContact());
  add('privacidad/index.html', pagePrivacy());
  add('formacion/index.html', pageFormacion());
  add('404.html', page404());
  const urls = Object.keys(out).filter((p) => !['formacion/index.html', '404.html'].includes(p)).map((p) => '/' + p.replace(/index\.html$/, ''))
    .concat(d.conf.events.filter((e) => e.visible !== false && e.href && e.href.startsWith('/')).map((e) => e.href));
  add('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${BASE}${u}</loc><lastmod>${d.cat.meta.reviewedAt}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  add('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = build();
  for (const [p, html] of Object.entries(out)) {
    const f = join(ROOT, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html);
  }
  console.log(`Generados ${Object.keys(out).length} archivos.`);
}
