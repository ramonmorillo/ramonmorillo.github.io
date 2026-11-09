// Ejecutar desde la raíz: node scripts/validate-google-ia.js
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context = {window:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('_talleres/data/google-ia.js','utf8'),context);
const {tools,categories,accessLevels,reviewedAt} = context.window.GOOGLE_IA;
assert(/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt),'Fecha de revisión inválida');
assert.equal(new Set(tools.map(t=>t.id)).size,tools.length,'IDs duplicados');
assert.equal(new Set(tools.map(t=>t.name)).size,tools.length,'Nombres duplicados');
for (const t of tools) {
 for (const key of ['id','name','url','icon','access','accessNote','description','example','prompt']) assert(String(t[key]||'').trim(),`Falta ${key}: ${t.name}`);
 assert.equal(new URL(t.url).protocol,'https:',`URL no segura: ${t.name}`);
 assert(Object.hasOwn(accessLevels,t.access),`Acceso inválido: ${t.name}`);
 assert(t.categories.length && t.categories.every(c=>categories.includes(c)),`Categoría inválida: ${t.name}`);
}
for (const c of categories) assert(tools.some(t=>t.categories.includes(c)),`Categoría vacía: ${c}`);
assert(!tools.every(t=>t.access==='gratis'),'No todas las herramientas pueden presentarse como gratuitas');
// Fuente en claro: la página publicada está cifrada.
const html = fs.readFileSync('_talleres/sevilla-14-octubre.html','utf8');
for (const t of tools) assert(html.includes(`href="${t.url}"`),`Falta el enlace de respaldo sin JavaScript: ${t.name}`);
assert(html.includes('Comprueba siempre la información oficial'),'Falta la nota sobre condiciones de acceso');
assert(html.includes('anonimizada de forma irreversible'),'Falta la advertencia de seguridad');
console.log(`OK: ${tools.length} herramientas Google, ${categories.length} categorías.`);
