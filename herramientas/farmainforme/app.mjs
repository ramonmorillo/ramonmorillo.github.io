import { TYPES, STEPS, META, fieldsFor } from './schema.mjs';
import { blankReport, demoReport, blocks, plainText, validate, warnings, loadDrafts, saveDraft, removeDraft, clearDrafts } from './core.mjs';
import { createDocx } from './export-docx.mjs';
import { SOURCE_PROVIDERS, sourceURL } from './sources.mjs';
const $ = id => document.getElementById(id);
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) if (value !== undefined && value !== null) node.setAttribute(key, String(value));
  for (const child of Array.isArray(children) ? children : [children]) node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  return node;
}
const button = (text, action, secondary = true) => { const b = el('button', { type: 'button', class: secondary ? 'fi-secondary' : '' }, text); b.addEventListener('click', action); return b; };
let report = blankReport(), step = 0, dirty = false, approved = false;
function status(message) { $('status').textContent = message; }
function changed() { dirty = true; approved = false; }
function guarded(action) { if (!dirty || confirm('Hay cambios sin guardar. ¿Continuar y descartarlos?')) action(); }
function open(r) { report = r; step = 0; dirty = r.demo; approved = false; document.querySelector('.fi-editor').open = false; $('welcome').hidden = true; $('workspace').hidden = false; render(); $('step-title').focus(); status(r.demo ? 'Demostración ficticia cargada. Puedes editarla sin afectar al ejemplo original.' : 'Informe abierto. Los cambios no se guardan automáticamente.'); }
function showHome() { $('workspace').hidden = true; $('welcome').hidden = false; listDrafts(); $('nuevo-titulo').setAttribute('tabindex', '-1'); $('nuevo-titulo').focus(); }
const descriptions = { soles: 'Solicitud interna, valoración o tramitación: apartados adaptables al circuito de tu centro.', cft: 'Evaluación breve o extensa: alternativas, eficacia, seguridad, costes y propuesta a la Comisión.', individual: 'Contexto, tratamiento propuesto, beneficio-riesgo, adherencia y seguimiento.' };
for (const [type, name] of Object.entries(TYPES)) {
  $('type-cards').append(el('article', { class: 'fi-card' }, [el('p', { class: 'eyebrow' }, type === 'soles' ? '01 · Solicitud especial' : type === 'cft' ? '02 · Evaluación de medicamentos' : '03 · Atención individualizada'), el('h3', {}, name), el('p', {}, descriptions[type]), button('Crear informe', () => open(blankReport(type)), false), button('Cargar demostración ficticia', () => open(demoReport(type)))]));
}
function listDrafts() {
  $('drafts').replaceChildren();
  try {
    const drafts = loadDrafts();
    if (!drafts.length) $('drafts').append(el('p', {}, 'No hay borradores guardados.'));
    for (const d of drafts) $('drafts').append(el('div', { class: 'fi-draft' }, [el('p', {}, `${TYPES[d.type]} · ${d.values.medicamento || 'Sin medicamento'} · ${d.meta.fecha}`), el('div', { class: 'fi-actions' }, [button('Abrir borrador', () => open(d)), button('Eliminar borrador', () => { if (confirm('¿Eliminar este borrador local?')) { try { removeDraft(d.id); listDrafts(); status('Borrador eliminado.'); } catch { status('No se pudo eliminar el borrador. Comprueba el almacenamiento del navegador.'); } } })])]));
  } catch { $('drafts').append(el('p', { role: 'alert' }, 'No se pudo leer el historial: almacenamiento bloqueado o datos dañados. No se sobrescribirán. Puedes borrar los datos de FarmaInforme.')); }
}
$('delete-all').addEventListener('click', () => {
  if (!confirm('¿Borrar todos los borradores de FarmaInforme de este navegador? No se pueden recuperar.')) return;
  try { clearDrafts(); report = blankReport(); step = 0; dirty = false; approved = false; $('final-text').value = ''; $('document').replaceChildren(); $('sources-panel').replaceChildren(); $('warnings').replaceChildren(); render(); listDrafts(); status('Todos los datos locales de FarmaInforme se han borrado. Los archivos exportados y el portapapeles deben borrarse por separado.'); } catch { status('El navegador no permite borrar el almacenamiento. Usa sus ajustes de datos del sitio.'); }
});
$('save-draft').addEventListener('click', () => { try { saveDraft(report); dirty = false; status('Borrador guardado solo en este navegador, sin cifrar.'); } catch (e) { status(`No se pudo guardar. ${e.message} Copia o exporta el informe para conservarlo.`); } });
$('close-report').addEventListener('click', () => guarded(() => { dirty = false; showHome(); }));
$('variant').addEventListener('change', e => { report.variant = e.target.value; changed(); render(); });
$('report-form').addEventListener('submit', e => e.preventDefault());
function inputControl(f, value, id) {
  const control = el(f.kind === 'select' ? 'select' : f.kind === 'textarea' ? 'textarea' : 'input', { id, name: id, ...(f.kind === 'textarea' ? { rows: '4', maxlength: '12000' } : f.kind === 'select' ? {} : { type: f.kind || 'text', maxlength: '200' }), 'aria-required': f.required ? 'true' : 'false' });
  if (f.kind === 'number') { control.min = '0'; control.step = f.integer ? '1' : 'any'; }
  if (f.kind === 'select') { control.append(el('option', { value: '' }, 'Selecciona…')); for (const option of f.options) control.append(el('option', { value: option }, option)); }
  control.value = value || '';
  return control;
}
function renderField(f, metadata = false) {
  const id = metadata ? `meta-${f.id}` : f.id, data = metadata ? report.meta : report.values;
  const control = inputControl(f, data[f.id], id), group = el('div', { class: 'fi-field' }, [el('label', { for: id }, `${f.label}${f.required ? ' · obligatorio' : ''}`), control]);
  control.addEventListener('input', () => { data[f.id] = control.value; changed(); control.removeAttribute('aria-invalid'); });
  if (f.help) { group.append(el('p', { id: `${id}-help`, class: 'fi-help' }, f.help)); control.setAttribute('aria-describedby', `${id}-help`); }
  if (!metadata && !f.required) {
    const check = el('input', { type: 'checkbox', id: `${id}-omit` }); check.checked = report.omissions[id] !== undefined;
    const reason = el('textarea', { id: `${id}-reason`, rows: '2', maxlength: '12000' }); reason.value = report.omissions[id] || '';
    const reasonGroup = el('div', {}, [el('label', { for: `${id}-reason` }, 'Justificación de la omisión · obligatoria si no procede'), reason]);
    reasonGroup.hidden = !check.checked; control.disabled = check.checked;
    check.addEventListener('change', () => { if (check.checked) report.omissions[id] = reason.value; else delete report.omissions[id]; control.disabled = check.checked; reasonGroup.hidden = !check.checked; changed(); });
    reason.addEventListener('input', () => { report.omissions[id] = reason.value; changed(); });
    group.append(el('label', { class: 'fi-check', for: `${id}-omit` }, [check, 'No procede']), reasonGroup);
  }
  if (f.scientific) {
    const select = el('select', { id: `${id}-source`, 'data-source-select': '' });
    select.append(el('option', { value: '' }, 'Sin fuente · pendiente de verificación'));
    for (const [i, s] of report.sources.entries()) select.append(el('option', { value: s.id }, `[${i + 1}] ${s.title || 'Sin título'}`));
    select.value = report.sourceFor[id] || '';
    select.addEventListener('change', () => { report.sourceFor[id] = select.value; changed(); });
    group.append(el('label', { for: `${id}-source`, class: 'fi-help' }, 'Fuente del apartado (se añaden en el paso 4)'), select);
  }
  return group;
}
function addLogo() {
  const input = el('input', { type: 'file', id: 'logo', accept: 'image/png,image/jpeg', 'aria-describedby': 'logo-help' });
  input.addEventListener('change', async () => {
    const file = input.files[0]; if (!file) return;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const png = bytes.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10', jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      if (file.size > 500000 || !(png || jpg)) throw new Error('Elige un PNG o JPEG válido de menos de 500 kB. No se admiten SVG.');
      const blobURL = URL.createObjectURL(new Blob([bytes], { type: png ? 'image/png' : 'image/jpeg' }));
      try {
        const image = new Image(); image.src = blobURL; await image.decode();
        if (image.naturalWidth * image.naturalHeight > 16000000) throw new Error('La imagen supera 16 megapíxeles. Reduce su tamaño.');
        report.logoWidth = image.naturalWidth; report.logoHeight = image.naturalHeight;
      } finally { URL.revokeObjectURL(blobURL); }
      report.logo = `data:image/${png ? 'png' : 'jpeg'};base64,${btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''))}`;
      changed(); status('Logotipo incorporado al informe. No se ha enviado a ningún servidor.');
    } catch (e) { input.value = ''; status(e.message || 'No se pudo cargar el logotipo.'); }
  });
  return el('div', { class: 'fi-field' }, [el('label', { for: 'logo' }, 'Logotipo institucional propio (opcional)'), input, el('p', { id: 'logo-help', class: 'fi-help' }, 'PNG/JPEG, máximo 500 kB y 16 megapíxeles. Usa solo archivos que tengas autorización para utilizar.'), button('Quitar logotipo', () => { report.logo = ''; report.logoWidth = 0; report.logoHeight = 0; changed(); input.value = ''; status('Logotipo eliminado del informe actual. Guarda de nuevo si había un borrador.'); })]);
}
function renderSources() {
  const panel = $('sources-panel'); panel.replaceChildren(el('h3', {}, 'Bibliografía aportada por el autor'), el('p', {}, 'No se genera bibliografía. Abre el original, comprueba los datos y asocia la fuente a cada apartado científico. Marcar una referencia no comprueba su contenido automáticamente.'));
  for (const [i, s] of report.sources.entries()) {
    const box = el('fieldset', { class: 'fi-source' }, [el('legend', {}, `Fuente ${i + 1}`)]);
    for (const [key, name] of [['title','Título / referencia'],['url','URL HTTPS (opcional si aportas identificador)'],['identifier','DOI, PMID o identificador documental']]) {
      const id = key === 'url' ? `source-url-${s.id}` : key === 'title' ? `source-${s.id}` : `source-id-${s.id}`;
      const input = el('input', { id, type: key === 'url' ? 'url' : 'text', maxlength: key === 'title' ? '500' : key === 'url' ? '2000' : '150' }); input.value = s[key];
      input.addEventListener('input', () => { s[key] = input.value; changed(); if (key === 'title') document.querySelectorAll('[data-source-select] option').forEach(o => { if (o.value === s.id) o.textContent = `[${i + 1}] ${s.title}`; }); });
      box.append(el('label', { for: id }, name), input);
    }
    const verified = el('input', { type: 'checkbox', id: `verified-${s.id}` }); verified.checked = s.verified;
    verified.addEventListener('change', () => { s.verified = verified.checked; changed(); });
    box.append(el('label', { for: `verified-${s.id}`, class: 'fi-check' }, [verified, 'He contrastado personalmente esta referencia con su original']), button('Eliminar fuente', () => { report.sources = report.sources.filter(source => source.id !== s.id); changed(); render(); })); panel.append(box);
  }
  panel.append(button('Añadir fuente', () => { if (report.sources.length >= 40) { status('Límite de 40 fuentes por informe.'); return; } const s = { id: crypto.randomUUID(), title: '', url: '', identifier: '', verified: false }; report.sources.push(s); changed(); render(); $(`source-${s.id}`).focus(); }));
  const query = el('input', { id: 'source-query', type: 'search', maxlength: '200', placeholder: 'Solo términos no identificativos' });
  const links = el('ul');
  const search = el('details', {}, [el('summary', {}, 'Consultar fuentes públicas (opcional)'), el('p', {}, 'Al abrir un enlace externo, se envía únicamente esta consulta al proveedor. No se adjunta el informe. No incluyas datos de pacientes. Si el sitio no responde, consúltalo por separado y añade la referencia manualmente.'), el('label', { for: 'source-query' }, 'Consulta bibliográfica o nombre del medicamento'), query, links]);
  function updateLinks() { links.replaceChildren(...SOURCE_PROVIDERS.map(provider => el('li', {}, [el('a', { href: sourceURL(provider, query.value), target: '_blank', rel: 'noopener noreferrer' }, `${provider.label} ↗`), el('p', { class: 'fi-help' }, provider.help)]))); }
  query.addEventListener('input', updateLinks); updateLinks(); panel.append(search);
}
function showErrors(errors) {
  const box = $('errors'); box.hidden = !errors.length;
  box.replaceChildren(el('p', {}, 'Revisa los siguientes campos:'), el('ul', {}, errors.map(error => {
    const link = el('a', { href: `#${error.id}` }, error.message);
    link.addEventListener('click', () => $(error.id)?.focus());
    $(error.id)?.setAttribute('aria-invalid', 'true');
    return el('li', {}, link);
  })));
  if (errors.length) box.focus();
}
function go(target) {
  if (target > step) {
    for (let n = 0; n < Math.min(target, 5); n++) {
      const errors = validate(report, n);
      if (errors.length) { step = n; render(); showErrors(errors); return; }
    }
    if (target === 5 && validate(report).length) { showErrors(validate(report)); return; }
  }
  step = target; render(); (step === 5 ? $('revision-titulo') : $('step-title')).focus();
}
function renderPreview() {
  const doc = $('document'); doc.replaceChildren();
  if (report.logo) doc.append(el('img', { src: report.logo, alt: `Logotipo aportado por ${report.meta.hospital}`, width: '160' }));
  for (const b of blocks(report)) {
    if (b.kind === 'table') doc.append(el('table', { 'aria-label': 'Estimación presupuestaria anual' }, el('tbody', {}, b.rows.map((row, index) => el('tr', {}, row.map(cell => el(index === 0 ? 'th' : 'td', index === 0 ? { scope: 'col' } : {}, cell)))))));
    else doc.append(el(b.kind === 'title' ? 'h2' : b.kind === 'h' ? 'h3' : 'p', {}, b.text));
  }
  const list = warnings(report);
  $('warnings').replaceChildren(el('p', {}, `${list.length} apartado(s) científico(s) pendiente(s) de verificación. La herramienta no comprueba fuentes ni contenido clínico.`), ...(list.length ? [el('details', {}, [el('summary', {}, 'Ver los apartados pendientes'), el('ul', {}, list.map(w => el('li', {}, w)))])] : []));
  if (report.finalText) $('warnings').append(el('p', {}, 'La edición manual está activa. Revisa también sus cambios: los controles se basan en el formulario y no analizan el texto final.'));
  const check = el('input', { type: 'checkbox', id: 'reviewed' }); check.checked = approved;
  check.addEventListener('change', () => { approved = check.checked; exportState(); });
  $('warnings').append(el('label', { class: 'fi-check', for: 'reviewed' }, [check, 'He revisado el documento, sus limitaciones y las verificaciones pendientes antes de exportarlo.']));
  if (!report.finalText) {
    const bs = blocks(report); const end = bs.findIndex(b => b.kind === 'h' && b.text === 'Bibliografía y trazabilidad');
    $('final-text').value = bs.slice(4 + (report.meta.codigo ? 1 : 0), end).map(b => b.kind === 'table' ? b.rows.map(row => row.join(' | ')).join('\n') : b.text).join('\n\n');
  } else $('final-text').value = report.finalText;
  exportState();
}
function exportState() { for (const id of ['docx', 'pdf', 'copy-report']) $(id).disabled = !approved; }
function render() {
  $('report-type').textContent = TYPES[report.type]; $('demo-label').hidden = !report.demo;
  $('variant-row').hidden = report.type !== 'cft'; $('variant').value = report.variant;
  $('progress').value = step + 1; $('progress-label').textContent = `Paso ${step + 1} de 6 · ${STEPS[step]}`;
  $('step-nav').replaceChildren(...STEPS.map((name, i) => { const b = button(`${i + 1}. ${name}`, () => go(i)); if (i === step) b.setAttribute('aria-current', 'step'); return el('li', {}, b); }));
  $('errors').hidden = true; $('report-form').hidden = step === 5; $('review').hidden = step !== 5;
  $('step-title').textContent = `${step + 1}. ${STEPS[step]}`;
  $('fields').replaceChildren(...(step === 0 ? META.map(f => renderField(f, true)) : fieldsFor(report.type, report.variant).filter(f => f.step === step).map(f => renderField(f))));
  if (step === 0) $('fields').append(addLogo());
  if (report.finalText && step < 5) $('fields').prepend(el('p', { class: 'fi-notice' }, 'Hay una edición manual del documento final. Los cambios en estos campos no la sustituyen. Usa «Volver a la plantilla» en la revisión para regenerar el cuerpo.'));
  $('sources-panel').hidden = step !== 3; if (step === 3) renderSources();
  $('previous').disabled = step === 0; $('next').hidden = step === 5;
  $('next').textContent = step === 4 ? 'Revisar informe' : 'Siguiente';
  if (step === 5) { approved = false; renderPreview(); }
}
$('previous').addEventListener('click', () => go(step - 1)); $('next').addEventListener('click', () => go(step + 1));
$('apply-edit').addEventListener('click', () => { if (!$('final-text').value.trim()) { status('El documento final no puede quedar vacío.'); return; } report.finalText = $('final-text').value; changed(); renderPreview(); status('Edición aplicada. Revisa de nuevo antes de exportar.'); });
$('reset-edit').addEventListener('click', () => { if (confirm('¿Descartar la edición manual y regenerar el cuerpo desde el formulario?')) { report.finalText = ''; changed(); renderPreview(); status('Plantilla regenerada desde los campos.'); } });
$('docx').addEventListener('click', () => {
  if (!approved || validate(report).length) return;
  try { const url = URL.createObjectURL(createDocx(report)); const a = el('a', { href: url, download: `FarmaInforme-${report.type}-${report.meta.fecha}.docx` }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000); status('DOCX generado. Comprueba su contenido en tu procesador de textos.'); } catch { status('No se pudo exportar DOCX. Conserva el informe con «Copiar informe» o PDF.'); }
});
$('pdf').addEventListener('click', () => { if (approved && !validate(report).length) window.print(); });
$('copy-report').addEventListener('click', async () => { try { await navigator.clipboard.writeText(plainText(report)); status('Informe copiado. El portapapeles puede ser accesible por otras aplicaciones.'); } catch { status('No se pudo acceder al portapapeles. Selecciona el texto de la vista previa y cópialo manualmente.'); } });
window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
listDrafts();
