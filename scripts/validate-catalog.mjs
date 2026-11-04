#!/usr/bin/env node
// Valida data/catalogo.json, data/conferencias.json y data/investigacion.json
// y comprueba que el HTML generado coincide con `npm run build`. Sale con código 1 si hay errores.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, loadData } from './build-site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = []; const warnings = [];
const err = (m) => errors.push(m); const warn = (m) => warnings.push(m);
const isHttps = (u) => { try { return new URL(u).protocol === 'https:'; } catch { return false; } };
const isoDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

const { cat, conf, res } = loadData();
const ids = new Set(); const repos = new Set(); const pages = new Set();
const catIds = new Set(cat.categories.map((c) => c.id));
const stIds = new Set(cat.statuses.map((s) => s.id));
const accIds = new Set(cat.access.map((a) => a.id));
const aiIds = new Set(cat.aiTypes.map((a) => a.id));
const REQUIRED = ['id', 'name', 'repo', 'category', 'areas', 'tags', 'status', 'access', 'summary', 'problem', 'audience', 'features', 'ai', 'validation', 'authorship', 'updated'];

for (const t of cat.tools) {
  const where = `herramienta «${t.id || t.name || '?'}»`;
  for (const k of REQUIRED) {
    const v = t[k];
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) err(`${where}: falta el campo obligatorio «${k}»`);
  }
  if (t.id && !/^[a-z0-9-]+$/.test(t.id)) err(`${where}: el id debe ser estable, en minúsculas y con guiones`);
  if (ids.has(t.id)) err(`${where}: id duplicado`); ids.add(t.id);
  if (repos.has(t.repo)) err(`${where}: repositorio duplicado «${t.repo}»`); repos.add(t.repo);
  if (!catIds.has(t.category)) err(`${where}: categoría inválida «${t.category}»`);
  if (!stIds.has(t.status)) err(`${where}: estado inválido «${t.status}»`);
  if (!accIds.has(t.access)) err(`${where}: acceso inválido «${t.access}»`);
  if (!aiIds.has(t.ai)) err(`${where}: tipo de IA inválido «${t.ai}»`);
  if (t.url !== null && t.url !== undefined && !isHttps(t.url)) err(`${where}: URL ausente o malformada «${t.url}»`);
  if (t.updated && !isoDate(t.updated)) err(`${where}: fecha «updated» inválida`);
  if (t.summary && t.summary.length > 200) warn(`${where}: resumen de más de 200 caracteres`);
  if (t.summary && t.summary.length < 30) err(`${where}: descripción demasiado breve`);
  // Coherencia entre estado, acceso y enlaces
  if (t.access === 'publico' && !t.url) err(`${where}: acceso abierto sin URL de la aplicación`);
  if (t.access === 'interno' && t.url) err(`${where}: una herramienta de uso interno no debe enlazar su interfaz`);
  if (t.access === 'restringido' && t.url && !t.urlLabel) err(`${where}: acceso restringido con URL pública: añadir «urlLabel» (portal) o eliminar el enlace`);
  if (t.category === 'gestion' && t.access !== 'interno') err(`${where}: las herramientas de gestión interna deben marcarse como «interno»`);
  if (t.category === 'estudios' && t.access === 'publico') warn(`${where}: plataforma de estudio con acceso abierto; revisar`);
  if (t.status === 'disponible' && /validad[oa] clínicamente|validación clínica completada/i.test(t.validation) && !/sin validación|no ha|pendiente/i.test(t.validation)) warn(`${where}: revisar que la validación clínica declarada tenga evidencia`);
  if (t.page) { if (pages.has(t.page)) err(`${where}: página duplicada «${t.page}»`); pages.add(t.page); }
  if (t.recognition && (!t.recognition.title || !t.recognition.source)) err(`${where}: reconocimiento sin título o sin fuente`);
  if (t.recognition?.sourceUrl && !isHttps(t.recognition.sourceUrl)) err(`${where}: fuente del reconocimiento malformada`);
  if (!Array.isArray(t.features) || t.features.some((f) => !f || f.length < 8)) err(`${where}: funcionalidades vacías o demasiado breves`);
}
for (const x of cat.excludedRepos || []) {
  if (repos.has(x.repo)) err(`El repositorio «${x.repo}» está a la vez en el catálogo y en excludedRepos`);
  if (!x.reason) err(`excludedRepos «${x.repo}»: falta el motivo`);
}

// Investigación
const pmids = new Set(res.publications.map((p) => p.pmid));
if (pmids.size !== res.publications.length) err('investigacion.json: PMID duplicado');
for (const p of res.publications) {
  if (!/^\d{6,9}$/.test(p.pmid)) err(`Publicación con PMID inválido «${p.pmid}»`);
  if (!p.title || !p.journal || !p.year || !p.doi) err(`Publicación ${p.pmid}: faltan título, revista, año o DOI`);
}
for (const l of res.lines) {
  for (const id of l.tools) if (!ids.has(id)) err(`Línea «${l.id}»: herramienta inexistente «${id}»`);
  for (const p of l.publications) if (!pmids.has(p)) err(`Línea «${l.id}»: PMID no listado «${p}»`);
}

// Conferencias
const topicIds = new Set(conf.topics.map((t) => t.id)); const evIds = new Set();
for (const e of conf.events) {
  const where = `conferencia «${e.id || e.title}»`;
  for (const k of ['id', 'date', 'title', 'event', 'city', 'type', 'topics']) if (!e[k] || (Array.isArray(e[k]) && !e[k].length)) err(`${where}: falta «${k}»`);
  if (evIds.has(e.id)) err(`${where}: id duplicado`); evIds.add(e.id);
  if (e.date && !isoDate(e.date)) err(`${where}: fecha inválida (AAAA-MM-DD)`);
  if (!conf.types.includes(e.type)) err(`${where}: tipo «${e.type}» no está en la lista de tipos`);
  for (const t of e.topics || []) if (!topicIds.has(t)) err(`${where}: temática inválida «${t}»`);
  if (e.href && e.href.startsWith('/') && !existsSync(join(ROOT, e.href))) err(`${where}: el enlace local «${e.href}» no existe`);
  if (e.href && !e.href.startsWith('/') && !isHttps(e.href)) err(`${where}: enlace malformado`);
  if (e.photo && !existsSync(join(ROOT, e.photo))) err(`${where}: la fotografía «${e.photo}» no existe`);
}

// Archivos del dominio y salida generada
if (!existsSync(join(ROOT, 'CNAME')) || readFileSync(join(ROOT, 'CNAME'), 'utf8').trim() !== 'ramonmorillo.es') err('CNAME ausente o modificado: debe contener ramonmorillo.es');
if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); console.error(`\n${errors.length} error(es) en los datos. Corrígelos antes de generar el sitio.`); process.exit(1); }
const out = build();
for (const [p, html] of Object.entries(out)) {
  const f = join(ROOT, p);
  if (!existsSync(f)) err(`Falta el archivo generado ${p}: ejecuta «npm run build»`);
  else if (readFileSync(f, 'utf8') !== html) err(`${p} no coincide con los datos: ejecuta «npm run build»`);
  // enlaces internos de la salida
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = m[1];
    const file = target.endsWith('/') ? join(ROOT, target, 'index.html') : join(ROOT, target);
    if (!existsSync(file) && !out[target.replace(/^\//, '') + (target.endsWith('/') ? 'index.html' : '')]) err(`${p}: enlace interno roto ${target}`);
  }
  for (const m of html.matchAll(/src="(\/[^"?]+)/g)) if (!existsSync(join(ROOT, m[1]))) err(`${p}: recurso inexistente ${m[1]}`);
  if (/formaci[oó]n|cursos|aula/i.test(html.match(/<nav[\s\S]*?<\/nav>/)?.[0] || '')) err(`${p}: la navegación contiene enlaces de formación`);
}

for (const w of warnings) console.warn('Aviso:', w);
if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); console.error(`\n${errors.length} error(es).`); process.exit(1); }
console.log(`✓ Catálogo válido: ${cat.tools.length} herramientas, ${conf.events.length} conferencias, ${res.publications.length} publicaciones. Salida generada al día (${Object.keys(out).length} archivos).`);
