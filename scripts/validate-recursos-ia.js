// Ejecutar desde la raíz: node scripts/validate-recursos-ia.js
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context = {window:{}};
vm.createContext(context);
for (const file of ['data/diccionario-ia.js','data/herramientas-ia.js']) vm.runInContext(fs.readFileSync(file,'utf8'),context);
const terms = context.window.DICCIONARIO_IA;
const {items,categories} = context.window.HERRAMIENTAS_IA;
for (const list of [terms,items]) {
 assert(list.length > 0);
 assert.equal(new Set(list.map(x=>x.name)).size,list.length,'Nombres duplicados');
 for (const item of list) assert(['Básico','Intermedio','Avanzado'].includes(item.level),`Nivel inválido: ${item.name}`);
}
for (const term of terms) for (const key of ['name','definition','why','example']) assert(term[key]?.trim(),`Falta ${key}: ${term.name}`);
for (const item of items) {
 for (const key of ['name','description','use','accessNote']) assert(item[key]?.trim(),`Falta ${key}: ${item.name}`);
 assert(['Gratis','Freemium','Pago','Consultar'].includes(item.access));
 assert.equal(typeof item.recommended,'boolean');
 assert(item.categories.length && item.categories.every(c=>categories.includes(c)),`Categoría inválida: ${item.name}`);
 for (const key of ['url','source']) assert.equal(new URL(item[key]).protocol,'https:');
 assert(/^\d{4}-\d{2}-\d{2}$/.test(item.reviewedAt));
}
assert.equal(new Set(categories).size,categories.length);
for (const category of categories) assert(items.some(t=>t.categories.includes(category)),`Categoría vacía: ${category}`);
// Las páginas y recursos de los talleres con clave se validan en su fuente en claro (_talleres/), no en la versión cifrada.
const fuente = p => fs.existsSync('_talleres/'+p) ? '_talleres/'+p : p;
for (const file of ['diccionario-ia.html','herramientas-ia.html','sevilla-14-octubre.html','santiago-16-noviembre.html','encuesta-previa.html']) {
 const html=fs.readFileSync(fuente(file),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,`IDs duplicados: ${file}`);
 for (const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (/^(?:https?:|mailto:)/.test(url)) continue;
  const [path,hash]=url.split('#').map((x,i)=>i?x:x.split('?')[0]);const target=path||file;
  assert(fs.existsSync(fuente(target)),`${file}: ${url} no existe`);
  // index.html usa un router de hash, no anclas estáticas.
  if(hash && target!=='index.html') assert(fs.readFileSync(fuente(target),'utf8').includes(`id="${hash}"`),`${file}: ${url} no existe`);
 }
}
console.log(`OK: ${terms.length} términos, ${items.length} herramientas, ${categories.length} categorías y enlaces internos.`);
