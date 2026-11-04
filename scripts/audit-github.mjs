#!/usr/bin/env node
// Contrasta el catálogo local con los repositorios públicos de github.com/ramonmorillo.
// Solo lectura y solo bajo demanda (no se ejecuta en producción). Uso:
//   npm run audit:github                 → repositorios nuevos, ausentes y desactualizados
//   npm run audit:github -- --check-urls → además, comprueba que cada URL publicada responde
// Opcional: GITHUB_TOKEN para ampliar el límite de la API (60 peticiones/hora sin token).
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const cat = JSON.parse(readFileSync(join(ROOT, 'data/catalogo.json'), 'utf8'));
const USER = 'ramonmorillo';
const headers = { 'User-Agent': 'ramonmorillo-es-catalog-audit', Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };

async function allRepos() {
  const repos = [];
  for (let page = 1; ; page++) {
    const r = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&page=${page}&type=owner`, { headers });
    if (!r.ok) throw new Error(`GitHub API ${r.status}: ${await r.text()}`);
    const batch = await r.json(); repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

const repos = await allRepos();
const byName = Object.fromEntries(repos.map((r) => [r.name, r]));
const inCatalog = new Map(cat.tools.map((t) => [t.repo, t]));
const excluded = new Set((cat.excludedRepos || []).map((x) => x.repo));

const nuevos = repos.filter((r) => !inCatalog.has(r.name) && !excluded.has(r.name));
const ausentes = cat.tools.filter((t) => !byName[t.repo]);
const desfasados = cat.tools.filter((t) => byName[t.repo] && byName[t.repo].pushed_at.slice(0, 10) > t.updated);
const archivados = cat.tools.filter((t) => byName[t.repo]?.archived);

console.log(`Repositorios públicos: ${repos.length} · en catálogo: ${inCatalog.size} · excluidos con motivo: ${excluded.size}\n`);
const show = (title, rows) => { console.log(`${title} (${rows.length})`); rows.forEach((x) => console.log('  - ' + x)); console.log(''); };
show('Repositorios no catalogados ni excluidos (revisar e incorporar o excluir)', nuevos.map((r) => `${r.name} · último push ${r.pushed_at.slice(0, 10)} · Pages: ${r.has_pages ? 'sí' : 'no'}${r.description ? ' · ' + r.description : ''}`));
show('Fichas cuyo repositorio ya no es público o ha cambiado de nombre', ausentes.map((t) => `${t.id} → ${t.repo}`));
show('Fichas con cambios posteriores en el repositorio (revisar contenido y fecha)', desfasados.map((t) => `${t.id}: ficha ${t.updated} · repositorio ${byName[t.repo].pushed_at.slice(0, 10)}`));
show('Fichas de repositorios archivados', archivados.map((t) => t.id));

if (process.argv.includes('--check-urls')) {
  const rows = [];
  for (const t of cat.tools.filter((x) => x.url)) {
    try { const r = await fetch(t.url, { method: 'GET', redirect: 'follow' }); rows.push(`${r.ok ? 'OK ' : 'ERR'} ${r.status} ${t.url}`); }
    catch (e) { rows.push(`ERR --- ${t.url} (${e.message})`); }
  }
  show('Comprobación de URLs publicadas', rows);
}
