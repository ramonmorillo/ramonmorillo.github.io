/**
 * Receptor del formulario de contacto de ramonmorillo.es (Google Apps Script).
 * Sin cuentas nuevas: se ejecuta con la cuenta de Google del titular y envía
 * el aviso desde su propio Gmail. Opcionalmente registra cada mensaje en una hoja.
 *
 * Instalación (5 minutos), con la cuenta de Google del titular:
 *  1. Abrir https://script.google.com → «Nuevo proyecto». Pegar este archivo entero.
 *  2. (Opcional, para tener registro) Crear una Hoja de cálculo de Google y copiar su ID
 *     (la parte de la URL entre /d/ y /edit) en SHEET_ID. Si se deja vacío, solo envía correo.
 *  3. «Implementar» → «Nueva implementación» → tipo «Aplicación web».
 *     Ejecutar como: «Yo». Quién tiene acceso: «Cualquier usuario».
 *  4. Autorizar los permisos que pida (enviar correo y, si hay SHEET_ID, editar la hoja).
 *  5. Copiar la URL que termina en /exec y pegarla en APPS_SCRIPT_URL de contacto/index.html.
 *  Si se modifica el script: «Gestionar implementaciones» → editar → «Nueva versión»
 *  (así la URL no cambia).
 */

const TO = 'ramon.morillo.verdugo@gmail.com';
const SHEET_ID = '14tO4bl-kxKH-vfRn54o0CuiNECGQNft5WO8qwG66d5o'; // Hoja «Contactos web ramonmorillo.es»
const FIELDS = ['Nombre', 'email', 'Institución', 'Motivo', 'Mensaje'];
const MAX = { Nombre: 120, email: 160, 'Institución': 160, Motivo: 120, Mensaje: 3000 };

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p._honey) return json({ success: true }); // bot: se ignora en silencio

    const d = {};
    FIELDS.forEach(function (k) { d[k] = String(p[k] || '').trim().slice(0, MAX[k]); });
    if (!d.Nombre || !d.Mensaje || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      return json({ success: false, message: 'Faltan campos obligatorios o el correo no es válido.' });
    }
    if (p.Consentimiento !== 'Sí') {
      return json({ success: false, message: 'Falta el consentimiento.' });
    }

    // Límite simple anti-abuso: máximo 20 mensajes por hora.
    const cache = CacheService.getScriptCache();
    const n = Number(cache.get('n') || 0);
    if (n >= 20) return json({ success: false, message: 'Demasiados envíos; prueba más tarde.' });
    cache.put('n', String(n + 1), 3600);

    const body = FIELDS.map(function (k) { return k + ': ' + (d[k] || '—'); }).join('\n')
      .replace('Mensaje: ', '\nMensaje:\n');
    MailApp.sendEmail({
      to: TO,
      replyTo: d.email,
      subject: 'Web ramonmorillo.es · ' + (d.Motivo || 'contacto') + ' · ' + d.Nombre,
      body: body + '\n\n— Enviado desde el formulario de ramonmorillo.es/contacto/'
    });

    if (SHEET_ID) {
      SpreadsheetApp.openById(SHEET_ID).getSheets()[0]
        .appendRow([new Date()].concat(FIELDS.map(function (k) { return safeCell(d[k]); })));
    }
    return json({ success: true });
  } catch (err) {
    return json({ success: false, message: 'Error interno del receptor.' });
  }
}

// Evita que un texto que empiece por = + - @ se interprete como fórmula en la hoja.
function safeCell(v) { return /^[=+\-@]/.test(v) ? "'" + v : v; }

function doGet() { return json({ ok: true, service: 'contacto ramonmorillo.es' }); }

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
