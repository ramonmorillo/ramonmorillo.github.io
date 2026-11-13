/**
 * Santiago 2026 · envío de apuntes (borrador para Apps Script).
 * Ejecutar solo tras configurar propiedades, privacidad y pruebas.
 * Material del taller fijado al PDF de Drive compartido como lector.
 * Desplegar como aplicación web: ejecutar como propietario / acceso público.
 * ATENCIÓN: endpoint público; revisar cuotas y monitorizar abuso.
 */
const EVENTO = 'santiago-16-noviembre-2026';
const LIMITE_DIARIO = 80; // Conservador para cuentas personales; comprobar cuota real.
function doPost(e) {
  const p = (e && e.parameter) || {};
  const email = String(p.email || '').trim().toLowerCase();
  const ok = p.consent === 'si' && p.evento === EVENTO &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 &&
    !String(p.website || '').trim();
  if (!ok) return salida('La solicitud no es válida. Vuelve al formulario y revisa los datos.');
  const cfg = PropertiesService.getScriptProperties();
  const url = 'https://drive.google.com/file/d/1xLdvrQKHxxVxE8K3kmc1AZZgE_giFBFQ/view';
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return salida('Servicio ocupado. Inténtalo más tarde.');
  try {
    const cache = CacheService.getScriptCache();
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
    const key = 'envios-' + today;
    const sent = Number(cfg.getProperty(key) || 0);
    if (sent >= LIMITE_DIARIO) return salida('Se ha alcanzado el límite diario. Contacta con la organización.');
    // Evita dobles envíos inmediatos. No protege contra abuso distribuido.
    const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email)
      .map(x => ('0' + (x & 255).toString(16)).slice(-2)).join('');
    if (cache.get('u-' + hash)) return salida('Si ya lo solicitaste, revisa tu bandeja de entrada y spam.');
    MailApp.sendEmail({
      to: email,
      subject: 'Tus apuntes · Taller de IA en Farmacia Hospitalaria · Santiago',
      name: 'Ramón Morillo · Formación',
      htmlBody: '<p>Hola:</p><p>Gracias por participar en el taller de IA aplicada a la Farmacia Hospitalaria.</p>' +
        '<p>Puedes acceder a los materiales docentes desde este enlace:</p>' +
        '<p><a href="' + url.replace(/&/g,'&amp;').replace(/"/g,'&quot;') + '">Consultar los apuntes</a></p>' +
        '<p>Recuerda utilizar únicamente datos ficticios en los ejercicios y validar los resultados antes de un uso asistencial.</p>' +
        '<p>Un saludo,<br>Ramón Morillo</p>'
    });
    cfg.setProperty(key, String(sent + 1));
    cache.put('u-' + hash, '1', 21600);
    return salida('Solicitud recibida. Revisa tu correo, incluida la carpeta de spam.');
  } finally { lock.releaseLock(); }
}
function salida(mensaje) {
  const safe = String(mensaje).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  return HtmlService.createHtmlOutput('<!doctype html><html lang="es"><meta charset="utf-8"><title>Apuntes Santiago</title><body style="font:18px system-ui;max-width:660px;margin:10vh auto;padding:25px"><h1>Recursos del taller</h1><p>'+safe+'</p><p><a href="https://ramonmorillo.es/santiago-recursos.html">Volver</a></p></body></html>');
}
