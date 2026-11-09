// Acceso con clave a las páginas de los talleres (generadas por scripts/talleres-cifrar.mjs).
// El contenido viaja cifrado (AES-256-GCM); la clave se deriva en el navegador con PBKDF2-SHA-256.
// Sin la clave correcta no hay nada que mostrar: no es una capa visual sobre contenido ya presente.
// Persistencia: se guarda en sessionStorage la clave AES derivada (nunca la contraseña), por pestaña y por taller.
(function () {
  'use strict';
  const datosEl = document.getElementById('taller-cifrado');
  const raiz = document.getElementById('acceso');
  if (!datosEl || !raiz) return;
  const meta = JSON.parse(datosEl.textContent);
  const taller = raiz.dataset.taller;
  const CLAVE_SESION = 'taller-acceso:v1:' + taller;
  const $ = (id) => document.getElementById(id);
  const form = $('acceso-form'), input = $('acceso-clave'), boton = $('acceso-boton');
  const error = $('acceso-error'), estado = $('acceso-estado'), aviso = $('acceso-aviso'), ver = $('acceso-ver');

  const deB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const aB64 = (buf) => { let s = ''; new Uint8Array(buf).forEach((b) => { s += String.fromCharCode(b); }); return btoa(s); };
  const normalizar = (c) => meta.n === 'minusculas' ? c.normalize('NFC').trim().toLowerCase() : c;
  const sesion = {
    leer() { try { const v = JSON.parse(sessionStorage.getItem(CLAVE_SESION) || 'null'); return v && v.s === meta.s ? v.k : null; } catch (e) { return null; } },
    guardar(k) { try { sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ s: meta.s, k })); } catch (e) { /* ventana privada estricta: solo se pierde la persistencia */ } },
    borrar() { try { sessionStorage.removeItem(CLAVE_SESION); } catch (e) { /* nada */ } },
  };

  if (!window.crypto || !crypto.subtle) {
    aviso.textContent = 'Este navegador no permite descifrar los materiales en esta conexión. Abre la página con https://ramonmorillo.es o actualiza el navegador.';
    return;
  }
  aviso.hidden = true;
  form.hidden = false;

  async function derivar(clave) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(normalizar(clave)), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: deB64(meta.s), iterations: meta.it }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
  }
  async function descifrar(key) {
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: deB64(meta.iv) }, key, deB64(meta.ct));
    return JSON.parse(new TextDecoder().decode(pt));
  }

  // Recursos protegidos → URL blob locales. Los HTML reciben <base> para que sus enlaces relativos sigan funcionando.
  function prepararArchivos(files) {
    const mapa = new Map();
    Object.keys(files).forEach((ruta) => {
      const f = files[ruta];
      let bytes = deB64(f.d);
      if (f.t.indexOf('text/html') === 0) {
        const base = new URL(ruta.replace(/[^/]*$/, ''), location.href).href;
        bytes = new TextEncoder().encode(new TextDecoder().decode(bytes).replace(/<head([^>]*)>/i, '<head$1><base href="' + base + '">'));
      }
      const url = URL.createObjectURL(new Blob([bytes], { type: f.t }));
      mapa.set(new URL(ruta, location.href).pathname, { url, nombre: ruta.split('/').pop() });
    });
    return mapa;
  }
  function reescribirEnlaces(mapa, ambito) {
    ambito.querySelectorAll('a[href], img[src]').forEach((el) => {
      const attr = el.tagName === 'A' ? 'href' : 'src';
      const valor = el.getAttribute(attr);
      if (!valor || /^(blob:|#|https?:|mailto:)/.test(valor)) return;
      const destino = mapa.get(new URL(valor, location.href).pathname);
      if (!destino) return;
      el.setAttribute(attr, destino.url);
      el.dataset.origen = valor;
      if (el.hasAttribute('download') && !el.getAttribute('download')) el.setAttribute('download', destino.nombre);
    });
  }
  // Los <script> insertados con innerHTML no se ejecutan: se recrean en orden, esperando a los externos.
  async function ejecutarScripts() {
    for (const viejo of Array.from(document.body.querySelectorAll('script'))) {
      const nuevo = document.createElement('script');
      Array.from(viejo.attributes).forEach((a) => nuevo.setAttribute(a.name, a.value));
      if (viejo.src) {
        await new Promise((ok) => { nuevo.onload = nuevo.onerror = ok; viejo.replaceWith(nuevo); });
      } else {
        nuevo.textContent = viejo.textContent;
        viejo.replaceWith(nuevo);
      }
    }
  }

  async function mostrar(carga) {
    const mapa = prepararArchivos(carga.files);
    document.body.innerHTML = carga.body;
    reescribirEnlaces(mapa, document.body);
    new MutationObserver((cambios) => cambios.forEach((c) => c.addedNodes.forEach((n) => {
      if (n.nodeType === 1) reescribirEnlaces(mapa, n.parentNode || n);
    }))).observe(document.body, { childList: true, subtree: true });
    await ejecutarScripts();
    document.documentElement.dataset.tallerAbierto = taller;
    if (!location.hash || location.hash === '#top') {
      const h1 = document.querySelector('main h1, h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
      window.scrollTo(0, 0);
    }
  }

  function ocupado(si, texto) {
    boton.disabled = si;
    form.setAttribute('aria-busy', si ? 'true' : 'false');
    estado.textContent = texto || '';
  }

  // Reapertura automática dentro de la misma pestaña (recargas, volver desde otra página).
  (async function () {
    const guardada = sesion.leer();
    if (!guardada) return;
    ocupado(true, 'Abriendo los materiales…');
    try {
      const key = await crypto.subtle.importKey('raw', deB64(guardada), { name: 'AES-GCM' }, false, ['decrypt']);
      await mostrar(await descifrar(key));
    } catch (e) {
      sesion.borrar();
      ocupado(false);
    }
  })();

  ver.addEventListener('click', () => {
    const mostrarTexto = input.type === 'password';
    input.type = mostrarTexto ? 'text' : 'password';
    ver.setAttribute('aria-pressed', String(mostrarTexto));
    ver.textContent = mostrarTexto ? 'Ocultar' : 'Mostrar';
    input.focus();
  });
  input.addEventListener('input', () => { if (error.textContent) { error.textContent = ''; input.removeAttribute('aria-invalid'); } });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (boton.disabled) return;
    if (!input.value.trim()) {
      error.textContent = 'Escribe la clave del taller.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    error.textContent = '';
    ocupado(true, 'Comprobando la clave…');
    let key, carga;
    try {
      key = await derivar(input.value);
      carga = await descifrar(key);
    } catch (e) {
      ocupado(false);
      input.setAttribute('aria-invalid', 'true');
      error.textContent = 'La clave no es correcta para este taller. Revísala o pídela al docente.';
      input.focus();
      input.select();
      return;
    }
    sesion.guardar(aB64(await crypto.subtle.exportKey('raw', key)));
    await mostrar(carga);
  });
})();
