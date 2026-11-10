import { TYPES, META, fieldsFor } from './schema.mjs';
export const STORAGE_KEY = 'farmainforme.borradores.v1';
const clean = (s, max = 12000) => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '').slice(0, max);
export function safeURL(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
export function blankReport(type = 'soles') {
  if (!Object.hasOwn(TYPES, type)) type = 'soles';
  return { schema: 1, id: globalThis.crypto.randomUUID(), type, variant: 'extenso', meta: { hospital: '', servicio: 'Servicio de Farmacia', autor: '', fecha: new Date().toLocaleDateString('sv-SE'), version: '1.0', estado: 'Borrador', codigo: '' }, values: {}, omissions: {}, sourceFor: {}, sources: [], finalText: '', logo: '', logoWidth: 0, logoHeight: 0, demo: false };
}
// Solo se aceptan propiedades conocidas. Nunca se mezcla JSON almacenado con objetos de configuración.
export function normalizeReport(raw) {
  if (!raw || raw.schema !== 1 || !Object.hasOwn(TYPES, raw.type)) throw new Error('Formato de borrador no compatible.');
  const r = blankReport(raw.type);
  r.id = /^[a-zA-Z0-9-]{1,80}$/.test(raw.id) ? raw.id : r.id;
  r.variant = raw.variant === 'breve' ? 'breve' : 'extenso';
  for (const f of META) r.meta[f.id] = clean(raw.meta?.[f.id], 200);
  for (const f of fieldsFor(r.type)) {
    r.values[f.id] = clean(raw.values?.[f.id]);
    if (raw.omissions && Object.hasOwn(raw.omissions, f.id) && !f.required) r.omissions[f.id] = clean(raw.omissions[f.id]);
    r.sourceFor[f.id] = clean(raw.sourceFor?.[f.id], 80);
  }
  r.sources = (Array.isArray(raw.sources) ? raw.sources : []).slice(0, 40).map(s => ({ id: clean(s.id, 80), title: clean(s.title, 500), url: safeURL(s.url), identifier: clean(s.identifier, 150), verified: s.verified === true }));
  r.finalText = clean(raw.finalText, 150000);
  if (/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(raw.logo || '') && raw.logo.length < 700000) {
    r.logo = raw.logo;
    r.logoWidth = Math.min(10000, Math.max(1, Number(raw.logoWidth) || 1));
    r.logoHeight = Math.min(10000, Math.max(1, Number(raw.logoHeight) || 1));
  }
  r.demo = raw.demo === true;
  return r;
}
export function validate(r, step = null) {
  const errors = [];
  if (step === null || step === 0) {
    for (const f of META) if (f.required && !r.meta[f.id]?.trim()) errors.push({ id: `meta-${f.id}`, message: `${f.label}: campo obligatorio.` });
    if (r.meta.fecha && (!/^\d{4}-\d{2}-\d{2}$/.test(r.meta.fecha) || Number.isNaN(Date.parse(r.meta.fecha)) || new Date(r.meta.fecha).toISOString().slice(0, 10) !== r.meta.fecha)) errors.push({ id: 'meta-fecha', message: 'Fecha no válida.' });
  }
  for (const f of fieldsFor(r.type, r.variant).filter(f => step === null || f.step === step)) {
    const v = r.values[f.id] || '';
    if (f.required && !v.trim()) errors.push({ id: f.id, message: `${f.label}: campo obligatorio.` });
    if (r.omissions[f.id] !== undefined && !r.omissions[f.id].trim()) errors.push({ id: `${f.id}-reason`, message: `${f.label}: justifica por qué no procede.` });
    if (r.omissions[f.id] !== undefined) continue;
    if (f.kind === 'number' && v !== '' && (!Number.isFinite(Number(v)) || Number(v) < 0 || (f.integer && !Number.isInteger(Number(v))))) errors.push({ id: f.id, message: `${f.label}: introduce un número ${f.integer ? 'entero ' : ''}mayor o igual a cero.` });
    if (f.kind === 'select' && v && !f.options.includes(v)) errors.push({ id: f.id, message: `${f.label}: opción no válida.` });
  }
  if (step === null || step === 3) for (const s of r.sources) {
    if (!s.title.trim()) errors.push({ id: `source-${s.id}`, message: 'Cada fuente necesita un título o referencia.' });
    if (s.url && !safeURL(s.url)) errors.push({ id: `source-url-${s.id}`, message: 'Las fuentes deben usar una URL HTTPS sin credenciales.' });
    if (!s.url && !s.identifier.trim()) errors.push({ id: `source-${s.id}`, message: 'Añade URL, DOI, PMID o identificador documental a cada fuente.' });
  }
  return errors;
}
export function warnings(r) {
  return fieldsFor(r.type, r.variant).filter(f => f.scientific && r.values[f.id]?.trim() && r.omissions[f.id] === undefined && !r.sources.some(s => s.id === r.sourceFor[f.id] && s.verified)).map(f => `${f.label}: información aportada por el usuario, pendiente de verificación.`);
}
export function budget(r) {
  const keys = ['pacientes', 'costeNuevo', 'costeActual'];
  if (keys.some(k => r.omissions[k] !== undefined || r.values[k] === undefined || r.values[k] === '' || !Number.isFinite(Number(r.values[k])) || Number(r.values[k]) < 0) || !Number.isInteger(Number(r.values.pacientes))) return null;
  const n = Number(r.values.pacientes), proposed = n * Number(r.values.costeNuevo), comparator = n * Number(r.values.costeActual);
  return [proposed, comparator, proposed - comparator].every(Number.isFinite) ? { proposed, comparator, delta: proposed - comparator } : null;
}
export function blocks(r) {
  const b = [{ kind: 'title', text: TYPES[r.type] + (r.type === 'cft' ? ` · evaluación ${r.variant === 'breve' ? 'breve' : 'extensa'}` : '') }, { kind: 'p', text: `${r.meta.hospital} · ${r.meta.servicio}` }, { kind: 'p', text: `Autor: ${r.meta.autor} · Fecha: ${r.meta.fecha} · Versión: ${r.meta.version} · Estado: ${r.meta.estado}` }];
  if (r.meta.codigo) b.push({ kind: 'p', text: `Referencia interna: ${r.meta.codigo}` });
  b.push({ kind: 'p', text: r.demo ? 'DEMOSTRACIÓN FICTICIA. No utilizar para decisiones clínicas.' : 'Documento de apoyo. Requiere validación farmacéutica. No constituye autorización administrativa.' });
  if (r.finalText) b.push({ kind: 'h', text: 'Documento editado manualmente' }, ...r.finalText.split('\n').map(text => ({ kind: 'p', text })));
  else {
    for (const f of fieldsFor(r.type, r.variant)) {
      const omitted = r.omissions[f.id] !== undefined;
      b.push({ kind: 'h', text: f.label }, { kind: 'p', text: omitted ? `No procede. Justificación: ${r.omissions[f.id] || '[PENDIENTE]'}` : (r.values[f.id]?.trim() || '[PENDIENTE DE CUMPLIMENTAR]') });
      if (!omitted && r.values[f.id]?.trim()) {
        b.push({ kind: 'p', text: f.classification || (f.scientific ? 'Hechos aportados por el usuario' : 'Información aportada por el usuario') });
        if (f.scientific) {
          const s = r.sources.find(s => s.id === r.sourceFor[f.id]);
          b.push({ kind: 'p', text: s ? `Fuente [${r.sources.indexOf(s) + 1}]: ${s.title}. ${s.verified ? 'Marcada como verificada por el autor; sin comprobación automática.' : 'Pendiente de verificación.'}` : 'Sin fuente asociada: pendiente de verificación.' });
        }
      }
    }
    const cost = budget(r);
    if (cost) b.push({ kind: 'h', text: 'Estimación presupuestaria anual' }, { kind: 'table', rows: [['Concepto', 'Importe (€)'], ['Tratamiento propuesto', cost.proposed.toFixed(2)], ['Alternativa', cost.comparator.toFixed(2)], ['Diferencia', cost.delta.toFixed(2)]] }, { kind: 'p', text: 'Cálculo aritmético con los datos aportados. No incluye descuentos, incertidumbre ni otros costes salvo que se hayan incorporado a los supuestos. No es un análisis de coste-efectividad.' });
  }
  b.push({ kind: 'h', text: 'Bibliografía y trazabilidad' });
  if (!r.sources.length) b.push({ kind: 'p', text: 'No se han aportado referencias. Información pendiente de verificación.' });
  for (const [i, s] of r.sources.entries()) b.push({ kind: 'p', text: `[${i + 1}] ${s.title}. ${s.identifier} ${s.url} — ${s.verified ? 'Verificación declarada por el autor' : 'Pendiente de verificación'}` });
  b.push({ kind: 'h', text: 'Control de revisión' }, { kind: 'p', text: 'FarmaInforme organiza una plantilla; no analiza evidencia ni genera recomendaciones mediante IA. El autor debe verificar datos, fuentes, cálculos y cualquier edición manual. No es un producto sanitario certificado.' });
  return b;
}
export const plainText = (r) => blocks(r).map(b => b.kind === 'table' ? b.rows.map(row => row.join(' | ')).join('\n') : b.text).join('\n\n');
export function loadDrafts(storage = globalThis.localStorage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || data.length > 15) throw new Error('Historial local no compatible o dañado. Puedes borrar los datos locales.');
  return data.map(normalizeReport);
}
export function saveDraft(r, storage = globalThis.localStorage) {
  const drafts = loadDrafts(storage).filter(d => d.id !== r.id);
  if (drafts.length >= 15) throw new Error('Límite de 15 borradores. Elimina uno antes de guardar otro.');
  storage.setItem(STORAGE_KEY, JSON.stringify([normalizeReport(r), ...drafts]));
}
export function removeDraft(id, storage = globalThis.localStorage) { storage.setItem(STORAGE_KEY, JSON.stringify(loadDrafts(storage).filter(d => d.id !== id))); }
export function clearDrafts(storage = globalThis.localStorage) { storage.removeItem(STORAGE_KEY); }
export function demoReport(type) {
  const r = blankReport(type); r.demo = true;
  Object.assign(r.meta, { hospital: 'Hospital Docente Ficticio', autor: 'Profesional de demostración', codigo: `DEMO-${type.toUpperCase()}` });
  Object.assign(r.values, { medicamento: 'Medicamento Docente A (inventado)', principio: 'Principio activo ficticio A', presentacion: 'Presentación simulada para el taller', indicacion: 'Escenario docente inventado; ninguna indicación autorizada declarada.', regulatoria: 'No evaluada: medicamento inventado. No hay autorización ni financiación que comprobar en este caso ficticio.', alternativas: 'Alternativa Docente B (inventada).', evidencia: 'No se aportan ensayos ni resultados reales. Ejercicio de estructura documental.', seguridad: 'Riesgos no evaluados. No se afirman datos de seguridad reales.', recomendacion: 'Completar revisión por el farmacéutico y no utilizar este ejemplo en práctica clínica.', seguimiento: 'Comprobar cumplimentación, trazabilidad y revisión antes de cualquier uso.', condiciones: 'Solo datos y circuito docentes.', economia: 'Supuesto simulado: 10 pacientes/año, 100 € frente a 80 € por paciente/año. No representa precios ni financiación reales.', pacientes: '10', costeNuevo: '100', costeActual: '80' });
  for (const f of fieldsFor(type)) if (!r.values[f.id]) r.values[f.id] = f.kind === 'select' ? f.options[0] : 'Información ficticia para comprobar la estructura; pendiente de evaluación profesional.';
  if (type === 'cft') r.values.propuesta = 'Pendiente de evaluación';
  return r;
}
