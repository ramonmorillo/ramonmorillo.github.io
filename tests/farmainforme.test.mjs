import test from 'node:test';
import assert from 'node:assert/strict';
import { TYPES, fieldsFor } from '../herramientas/farmainforme/schema.mjs';
import { STORAGE_KEY, blankReport, demoReport, normalizeReport, validate, warnings, blocks, plainText, budget, safeURL, loadDrafts, saveDraft, removeDraft, clearDrafts } from '../herramientas/farmainforme/core.mjs';
import { createDocx } from '../herramientas/farmainforme/export-docx.mjs';
import { SOURCE_PROVIDERS, sourceURL } from '../herramientas/farmainforme/sources.mjs';
class Storage {
  data = new Map(); getItem(k) { return this.data.get(k) ?? null; } setItem(k,v) { this.data.set(k,String(v)); } removeItem(k) { this.data.delete(k); }
}
for (const type of Object.keys(TYPES)) test(`Informe ${type}: demostración válida, trazabilidad y ninguna referencia inventada`, () => {
  const r = demoReport(type);
  assert.deepEqual(validate(r), []);
  assert.equal(r.sources.length, 0);
  assert.ok(warnings(r).length > 0);
  assert.match(plainText(r), /DEMOSTRACIÓN FICTICIA/);
  assert.match(plainText(r), /pendiente de verificación/i);
  assert.match(plainText(r), /Bibliografía y trazabilidad/);
  assert.equal(new Set(fieldsFor(type).map(f => f.id)).size, fieldsFor(type).length);
});
test('Obligatorios y fecha imposible; omisión con justificación incluso tras guardar', () => {
  assert.ok(validate(blankReport()).length >= 8);
  const r = demoReport('soles'); r.meta.fecha = '2026-02-30';
  assert.ok(validate(r).some(e => e.id === 'meta-fecha'));
  r.meta.fecha = '2026-02-28'; r.omissions.alternativas = '';
  assert.ok(validate(normalizeReport(r)).some(e => e.id === 'alternativas-reason'));
  r.omissions.alternativas = 'Sin comparador en el supuesto docente.';
  assert.deepEqual(validate(r), []);
  assert.match(plainText(r), /No procede. Justificación: Sin comparador/);
});
test('Campos CFT condicionales conservan valores sin aparecer en modo breve', () => {
  const r = demoReport('cft'); r.values.calidad = 'Limitación reservada a la evaluación extensa'; r.variant = 'breve';
  assert.ok(!fieldsFor(r.type,r.variant).some(f => f.id === 'calidad'));
  assert.ok(!plainText(r).includes('Limitación reservada'));
  r.variant = 'extenso'; assert.match(plainText(r), /Limitación reservada/);
});
test('Costes: cero válido, diferencia, datos faltantes, negativos, infinitos y fracciones', () => {
  const r = demoReport('cft'); assert.deepEqual(budget(r), { proposed:1000, comparator:800, delta:200 });
  r.values.costeActual = '0'; assert.equal(budget(r).delta, 1000);
  r.values.pacientes = '0'; assert.equal(budget(r).delta, 0);
  for (const bad of ['-1','NaN','Infinity','1.5']) { r.values.pacientes = bad; assert.ok(validate(r).some(e => e.id === 'pacientes')); assert.equal(budget(r),null); }
  r.values.pacientes = ''; assert.equal(budget(r),null);
  r.values.pacientes = '10'; r.omissions.costeActual = 'No aportado'; assert.equal(budget(r),null);
});
test('Fuentes manuales: no se verifica automáticamente, ni se confunde con hechos', () => {
  const r = demoReport('soles'); const before = warnings(r).length;
  r.sources.push({id:'test', title:'Documento ficticio de prueba', identifier:'DOC-TEST', url:'', verified:false}); r.sourceFor.evidencia = 'test';
  assert.equal(warnings(r).length,before);
  r.sources[0].verified = true; assert.equal(warnings(r).length,before-1);
  assert.match(plainText(r), /sin comprobación automática/);
  assert.match(plainText(r), /Recomendación profesional/);
  r.sources[0].url = 'javascript:alert(1)'; assert.ok(validate(r).some(e => e.id === 'source-url-test'));
});
test('Borradores: guardar, editar, recuperar, borrar selectivamente y no tocar otras aplicaciones', () => {
  const storage = new Storage(); storage.setItem('otra-app','conservar');
  const r = demoReport('individual'); saveDraft(r,storage);
  r.values.medicamento = 'Cambio documentado'; saveDraft(r,storage);
  assert.equal(loadDrafts(storage).length,1); assert.equal(loadDrafts(storage)[0].values.medicamento,'Cambio documentado');
  const other = demoReport('cft'); saveDraft(other,storage); removeDraft(r.id,storage); assert.equal(loadDrafts(storage)[0].id,other.id);
  clearDrafts(storage); assert.deepEqual(loadDrafts(storage),[]); assert.equal(storage.getItem('otra-app'),'conservar');
});
test('Datos dañados y cuota de almacenamiento generan errores recuperables', () => {
  const storage = new Storage(); storage.setItem(STORAGE_KEY,'not-json');
  assert.throws(() => loadDrafts(storage)); assert.throws(() => saveDraft(demoReport('soles'),storage));
  assert.equal(storage.getItem(STORAGE_KEY),'not-json');
  assert.throws(() => saveDraft(demoReport('soles'), { getItem:()=>null,setItem:()=>{throw new Error('QuotaExceededError');} }));
});
test('Normalización rechaza formatos desconocidos, referencias inseguras y propiedades ajenas', () => {
  assert.throws(() => normalizeReport({schema:2,type:'soles'}));
  const r = demoReport('soles'); r.logo = 'data:image/svg+xml,<script>bad</script>'; r.unexpected = 'x';
  const normalized = normalizeReport(r); assert.equal(normalized.logo,''); assert.ok(!('unexpected' in normalized));
  for (const url of ['javascript:alert(1)','http://example.org','https://user:pass@example.org']) assert.equal(safeURL(url),'');
});
test('La edición manual es literal; metadatos y revisión obligatoria se conservan', () => {
  const r = demoReport('individual'); r.finalText = '<script>alert(1)</script>\nConclusión editada';
  assert.match(plainText(r), /Conclusión editada/); assert.match(plainText(r), /Hospital Docente Ficticio/);
  assert.match(plainText(r), /Control de revisión/);
  assert.ok(!blocks(r).some(b => b.kind === 'table'));
});
test('Exportación DOCX: ZIP y XML escapado; no contiene scripts ejecutables', async () => {
  const r = demoReport('soles'); r.values.medicamento = '<script>"A & B"</script>';
  const bytes = new Uint8Array(await createDocx(r).arrayBuffer());
  assert.deepEqual([...bytes.slice(0,4)],[80,75,3,4]);
  const text = new TextDecoder().decode(bytes);
  assert.match(text,/word\/document.xml/); assert.match(text,/&lt;script&gt;&quot;A &amp; B&quot;&lt;\/script&gt;/);
  assert.match(text,/w:instr="PAGE"/); assert.ok(!text.includes('<script>'));
  r.values.medicamento = 'Texto\u000bcon control y sustituto \ud800';
  const sanitized = new TextDecoder().decode(await createDocx(r).arrayBuffer());
  assert.ok(!sanitized.includes('Texto\u000bcon')); assert.ok(sanitized.includes('Textocon control'));
});
test('Consulta externa solo contiene términos expresamente introducidos', () => {
  for (const provider of SOURCE_PROVIDERS) {
    const url = new URL(sourceURL(provider,'término docente'));
    assert.equal(url.protocol,'https:');
    if (provider.search) assert.equal(url.searchParams.get(provider.search),'término docente');
  }
});
