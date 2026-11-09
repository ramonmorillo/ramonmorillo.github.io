#!/usr/bin/env node
// Cifra las páginas de los talleres con acceso restringido.
//
//   npm run talleres                       → regenera todas las páginas (pide o lee las claves)
//   npm run talleres -- sevilla-14-octubre → regenera solo esa página
//   npm run talleres:check                 → comprueba, SIN claves, que lo publicado está al día y no expone fuentes
//   npm run talleres:verify                → con claves: descifra cada página y prueba que la clave de un taller no abre otro
//
// Fuentes en claro: _talleres/<id>.html y los recursos que referencia (_talleres/assets/…, _talleres/data/…).
// Jekyll (GitHub Pages) no publica las carpetas que empiezan por «_», así que las fuentes no se sirven en ramonmorillo.es.
// Salida: <id>.html en la raíz, con la pantalla de acceso y el contenido cifrado (AES-256-GCM, clave derivada con PBKDF2-SHA-256).
// Las claves no se guardan en el repositorio: variable de entorno, _talleres/claves.local.json (ignorado por git) o teclado.
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname, extname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto, createHash } from 'node:crypto';
import { createInterface } from 'node:readline';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, '_talleres');
const ITERACIONES = 600000;
const VERSION_ACTIVOS = '20261109a';
const subtle = webcrypto.subtle;
const MIME = {
  '.txt': 'text/plain;charset=utf-8', '.csv': 'text/csv;charset=utf-8', '.md': 'text/markdown;charset=utf-8',
  '.html': 'text/html;charset=utf-8', '.pdf': 'application/pdf', '.zip': 'application/zip', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
};

const args = process.argv.slice(2);
const MODO = args.includes('--check') ? 'check' : args.includes('--verify') ? 'verify' : 'build';
const pedidos = args.filter((a) => !a.startsWith('--'));
const config = JSON.parse(readFileSync(join(SRC, 'talleres.json'), 'utf8'));
const talleres = config.talleres.filter((t) => !pedidos.length || pedidos.includes(t.id));
if (pedidos.length && talleres.length !== pedidos.length) fallo(`Taller desconocido. Disponibles: ${config.talleres.map((t) => t.id).join(', ')}`);

function fallo(msg) { console.error('✗ ' + msg); process.exit(1); }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const b64 = (buf) => Buffer.from(buf).toString('base64');
const sinQuery = (u) => u.split('#')[0].split('?')[0];
const esArchivo = (p) => existsSync(p) && statSync(p).isFile();
// Misma normalización que assets/js/taller-acceso.js: evita fallos por mayúsculas automáticas del móvil o espacios.
const normalizar = (clave) => clave.normalize('NFC').trim().toLowerCase();

// ---------- Fuente → contenido a cifrar ----------
function leerFuente(t) {
  const html = readFileSync(join(SRC, t.id + '.html'), 'utf8');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  const bodyTag = html.match(/<body([^>]*)>/);
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1];
  const header = body?.match(/<header class="event-header">[\s\S]*?<\/header>/)?.[0];
  const footer = body?.match(/<footer class="footer">[\s\S]*?<\/footer>/)?.[0];
  if (!head || !body || !header || !footer) fallo(`${t.id}: no encuentro <head>, <body>, la cabecera o el pie en la fuente`);
  return { head, bodyAttrs: bodyTag[1], body, header, footer };
}

function construirCarga(t, fuente) {
  const inlined = [];
  // Los scripts de datos protegidos (p. ej. data/menu-chatgpt.js) se incrustan dentro del contenido cifrado.
  let body = fuente.body.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
    const ruta = sinQuery(src);
    const archivo = join(SRC, ruta);
    if (!esArchivo(archivo)) return m; // script público (renderizadores en js/): se carga normalmente
    const codigo = readFileSync(archivo, 'utf8');
    if (/<\/script/i.test(codigo)) fallo(`${ruta} contiene «</script»: no puede incrustarse`);
    inlined.push(ruta);
    return `<script data-origen="${esc(ruta)}">\n${codigo}\n</script>`;
  });
  // Recursos protegidos citados en el HTML o en los datos incrustados (descargas, PDF, planificador…).
  const files = {};
  for (const [, ref] of body.matchAll(/(?<![\w./-])((?:assets|data)\/[\w./-]+\.[a-z0-9]+)/gi)) {
    const archivo = join(SRC, ref);
    if (files[ref] || inlined.includes(ref) || !esArchivo(archivo)) continue;
    const tipo = MIME[extname(ref).toLowerCase()];
    if (!tipo) fallo(`${ref}: tipo de archivo sin MIME definido en scripts/talleres-cifrar.mjs`);
    files[ref] = { t: tipo, d: b64(readFileSync(archivo)) };
  }
  // Ningún recurso local citado debe quedar huérfano (ni en la fuente ni publicado).
  for (const [, ref] of body.matchAll(/(?:href|src)="((?:assets|data|css|js)\/[^"#?]+)/g)) {
    if (!files[ref] && !inlined.includes(ref) && !esArchivo(join(ROOT, ref))) fallo(`${t.id}: el recurso ${ref} no existe ni en _talleres/ ni publicado`);
  }
  const texto = JSON.stringify({ body, files });
  return { texto, huella: createHash('sha256').update(texto).digest('hex'), inlined, files: Object.keys(files) };
}

// ---------- Cifrado (equivalente exacto al descifrado de assets/js/taller-acceso.js) ----------
async function derivar(clave, salt) {
  const base = await subtle.importKey('raw', new TextEncoder().encode(normalizar(clave)), 'PBKDF2', false, ['deriveKey']);
  return subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERACIONES }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function cifrar(texto, clave) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const key = await derivar(clave, salt);
  const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(texto));
  return { v: 1, kdf: 'PBKDF2-SHA-256', it: ITERACIONES, n: 'minusculas', s: b64(salt), iv: b64(iv), ct: b64(ct) };
}
async function descifrar(meta, clave) {
  const key = await derivar(clave, Buffer.from(meta.s, 'base64'));
  const pt = await subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(meta.iv, 'base64') }, key, Buffer.from(meta.ct, 'base64'));
  return new TextDecoder().decode(pt);
}

// ---------- Página publicada ----------
const CANDADO = '<svg class="acceso-icono" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 5a3 3 0 1 1 6 0v3H9V7Zm3 7a2 2 0 0 1 1 3.73V19h-2v-1.27A2 2 0 0 1 12 14Z"/></svg>';

function paginaBloqueada(t, fuente, meta, huella) {
  const head = fuente.head.replace(/\s+$/, '');
  const datos = JSON.stringify({ ...meta, h: huella }).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="es">
<head>${head}
  <link rel="stylesheet" href="assets/css/taller-acceso.css?v=${VERSION_ACTIVOS}">
  <script src="assets/js/taller-acceso.js?v=${VERSION_ACTIVOS}" defer></script>
</head>
<body${fuente.bodyAttrs}>
<!-- Página generada por scripts/talleres-cifrar.mjs a partir de _talleres/${t.id}.html. No la edites a mano: edita la fuente y ejecuta «npm run talleres». -->
<a class="skip" href="#acceso">Saltar al acceso</a>
${fuente.header}

<main id="contenido">
<section class="event-hero acceso-hero" aria-labelledby="titulo"><div class="wrap acceso-grid">
  <div class="acceso-evento">
    <p class="hero-kicker">${esc(t.lugar)} · ${esc(t.fecha)}</p>
    <h1 id="titulo">${esc(t.titulo)}</h1>
    <div class="hero-meta"><span>${esc(t.ciudad)}</span><span>${esc(t.fecha.replace(/^\p{L}+ /u, ''))}</span><span>${esc(t.horario)}</span></div>
  </div>
  <section class="acceso-tarjeta" id="acceso" data-taller="${esc(t.id)}" aria-labelledby="acceso-titulo">
    <p class="acceso-marca">${CANDADO}<span>Acceso restringido</span></p>
    <h2 id="acceso-titulo">Contenido exclusivo para asistentes al taller</h2>
    <p class="acceso-texto" id="acceso-ayuda">Introduce la clave facilitada durante la sesión para acceder a los materiales y recursos docentes.</p>
    <form class="acceso-form" id="acceso-form" method="post" action="#" novalidate hidden>
      <input class="acceso-usuario" type="text" name="username" autocomplete="username" value="taller-${esc(t.id)}" readonly tabindex="-1" aria-hidden="true">
      <label for="acceso-clave">Clave del taller</label>
      <div class="acceso-campo">
        <input id="acceso-clave" name="password" type="password" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false" required aria-describedby="acceso-ayuda acceso-error">
        <button type="button" class="acceso-ver" id="acceso-ver" aria-controls="acceso-clave" aria-pressed="false">Mostrar</button>
      </div>
      <p class="acceso-error" id="acceso-error" role="alert"></p>
      <button type="submit" class="acceso-boton" id="acceso-boton">Acceder a los materiales</button>
      <p class="acceso-estado" id="acceso-estado" role="status" aria-live="polite"></p>
    </form>
    <p class="acceso-aviso" id="acceso-aviso">Para abrir los materiales necesitas tener JavaScript activado: el contenido está cifrado y se descifra en tu navegador con la clave.</p>
    <p class="acceso-volver"><a href="index.html#inicio">← Volver a la web de Ramón Morillo</a></p>
  </section>
</div></section>
</main>

${fuente.footer}
<script type="application/json" id="taller-cifrado">${datos}</script>
</body>
</html>
`;
}

// ---------- Claves ----------
let clavesLocales = null;
function clavesDeArchivo() {
  if (clavesLocales) return clavesLocales;
  const f = join(SRC, 'claves.local.json');
  clavesLocales = esArchivo(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
  return clavesLocales;
}
function preguntarOculto(pregunta) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.startsWith(pregunta)) process.stdout.write(s); };
    rl.question(pregunta, (r) => { rl.close(); process.stdout.write('\n'); resolve(r); });
  });
}
async function obtenerClave(t) {
  const clave = process.env[t.variableClave] || clavesDeArchivo()[t.id];
  if (clave) return clave;
  if (!process.stdin.isTTY) fallo(`${t.id}: falta la clave. Define ${t.variableClave}=… o añádela a _talleres/claves.local.json`);
  return preguntarOculto(`Clave para ${t.id}: `);
}

// ---------- Comprobaciones sin clave ----------
function comprobar(t) {
  const errores = [];
  const salida = join(ROOT, t.id + '.html');
  if (!esArchivo(salida)) return [`falta ${t.id}.html: ejecuta «npm run talleres»`];
  const html = readFileSync(salida, 'utf8');
  const meta = JSON.parse(html.match(/<script type="application\/json" id="taller-cifrado">([\s\S]*?)<\/script>/)?.[1] || 'null');
  if (!meta?.ct) return [`${t.id}.html no contiene contenido cifrado`];
  const fuente = leerFuente(t);
  const carga = construirCarga(t, fuente);
  if (meta.h !== carga.huella) errores.push(`${t.id}.html está desactualizada respecto a _talleres/: ejecuta «npm run talleres -- ${t.id}»`);
  if (meta.it < ITERACIONES) errores.push(`${t.id}: iteraciones PBKDF2 insuficientes (${meta.it})`);
  // Ningún título de sección de la fuente puede aparecer en claro en la página publicada.
  const publicoPermitido = fuente.header + fuente.footer + fuente.head;
  for (const [, h] of fuente.body.matchAll(/<h[234][^>]*>([^<]{12,})<\/h[234]>/g)) {
    if (html.includes(h) && !publicoPermitido.includes(h)) errores.push(`${t.id}.html contiene en claro: «${h}»`);
  }
  // Ningún recurso protegido debe existir también en la ruta pública.
  for (const ref of [...carga.files, ...carga.inlined]) if (esArchivo(join(ROOT, ref))) errores.push(`${ref} está publicado en claro (debe estar solo en _talleres/${ref})`);
  return errores;
}

// ---------- Ejecución ----------
if (existsSync(join(ROOT, '.nojekyll'))) fallo('Existe .nojekyll: GitHub Pages publicaría _talleres/ (fuentes en claro). Elimínalo o mueve las fuentes.');

if (MODO === 'check') {
  const errores = talleres.flatMap(comprobar);
  // Recursos de _talleres/ que se hayan vuelto a copiar en la ruta pública.
  const recorrer = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? recorrer(join(dir, d.name)) : [join(dir, d.name)]);
  for (const f of recorrer(SRC)) {
    const ref = relative(SRC, f);
    if (/^(assets|data)\//.test(ref) && esArchivo(join(ROOT, ref))) errores.push(`${ref} existe en claro en la ruta pública`);
  }
  if (errores.length) { [...new Set(errores)].forEach((e) => console.error('✗ ' + e)); fallo(`${new Set(errores).size} error(es).`); }
  console.log(`OK: ${talleres.map((t) => t.id).join(', ')} cifradas, al día y sin fuentes publicadas.`);
} else if (MODO === 'verify') {
  const claves = {};
  for (const t of talleres) claves[t.id] = await obtenerClave(t);
  for (const t of talleres) {
    const html = readFileSync(join(ROOT, t.id + '.html'), 'utf8');
    const meta = JSON.parse(html.match(/id="taller-cifrado">([\s\S]*?)<\/script>/)[1]);
    const esperado = construirCarga(t, leerFuente(t)).texto;
    if ((await descifrar(meta, claves[t.id])) !== esperado) fallo(`${t.id}: el contenido descifrado no coincide con la fuente`);
    for (const otro of talleres.filter((o) => o.id !== t.id)) {
      let abre = true;
      try { await descifrar(meta, claves[otro.id]); } catch { abre = false; }
      if (abre) fallo(`${t.id}: ¡la clave de ${otro.id} también lo abre!`);
    }
    console.log(`OK: ${t.id} se descifra con su clave y no con las de los demás talleres.`);
  }
} else {
  for (const t of talleres) {
    const clave = await obtenerClave(t);
    if (normalizar(clave).length < 4) fallo(`${t.id}: clave demasiado corta`);
    const fuente = leerFuente(t);
    const carga = construirCarga(t, fuente);
    const meta = await cifrar(carga.texto, clave);
    if ((await descifrar(meta, clave)) !== carga.texto) fallo(`${t.id}: fallo de verificación tras cifrar`);
    writeFileSync(join(ROOT, t.id + '.html'), paginaBloqueada(t, fuente, meta, carga.huella));
    console.log(`✓ ${t.id}.html cifrada · ${carga.files.length} recursos y ${carga.inlined.length} archivos de datos incluidos · ${(carga.texto.length / 1024).toFixed(0)} KB en claro`);
  }
}
