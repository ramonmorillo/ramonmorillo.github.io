/* ramonmorillo.es · mejoras progresivas. El contenido es legible sin este archivo. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');

  // Navegación móvil
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
      }
    });
  }

  var norm = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };

  // Catálogo: búsqueda + filtros (categoría, área, estado, acceso). Estado reflejado en la URL.
  var catalog = document.querySelector('[data-catalog]');
  if (catalog) {
    var cards = Array.prototype.slice.call(catalog.querySelectorAll('.card-tool'));
    var sections = Array.prototype.slice.call(catalog.querySelectorAll('.cat-section'));
    var q = document.getElementById('q');
    var fArea = document.getElementById('f-area');
    var fStatus = document.getElementById('f-status');
    var fAccess = document.getElementById('f-access');
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-cat-chip]'));
    var count = document.getElementById('result-count');
    var empty = document.getElementById('catalog-empty');
    var reset = document.getElementById('catalog-reset');
    var cat = '';
    cards.forEach(function (c) { c._text = norm(c.textContent + ' ' + (c.dataset.keywords || '')); });

    var params = new URLSearchParams(location.search);
    if (params.get('q')) q.value = params.get('q');
    if (params.get('categoria')) cat = params.get('categoria');
    [['area', fArea], ['estado', fStatus], ['acceso', fAccess]].forEach(function (p) { if (params.get(p[0])) p[1].value = params.get(p[0]); });

    var apply = function (push) {
      var terms = norm(q.value).split(/\s+/).filter(Boolean);
      var n = 0;
      cards.forEach(function (c) {
        var ok = (!cat || c.dataset.category === cat) &&
          (!fArea.value || (c.dataset.areas || '').split('|').indexOf(fArea.value) > -1) &&
          (!fStatus.value || c.dataset.status === fStatus.value) &&
          (!fAccess.value || c.dataset.access === fAccess.value) &&
          terms.every(function (t) { return c._text.indexOf(t) > -1; });
        c.hidden = !ok; if (ok) n++;
      });
      sections.forEach(function (s) { s.hidden = !s.querySelector('.card-tool:not([hidden])'); });
      chips.forEach(function (ch) { ch.setAttribute('aria-pressed', String(ch.dataset.catChip === cat)); });
      count.textContent = n === 1 ? '1 herramienta' : n + ' herramientas';
      empty.hidden = n !== 0;
      if (push) {
        var p = new URLSearchParams();
        if (q.value.trim()) p.set('q', q.value.trim());
        if (cat) p.set('categoria', cat);
        if (fArea.value) p.set('area', fArea.value);
        if (fStatus.value) p.set('estado', fStatus.value);
        if (fAccess.value) p.set('acceso', fAccess.value);
        var s = p.toString();
        history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash);
      }
    };
    var t;
    q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { apply(true); }, 120); });
    [fArea, fStatus, fAccess].forEach(function (el) { el.addEventListener('change', function () { apply(true); }); });
    chips.forEach(function (ch) { ch.addEventListener('click', function () { cat = ch.dataset.catChip; apply(true); }); });
    reset.addEventListener('click', function () { q.value = ''; cat = ''; fArea.value = ''; fStatus.value = ''; fAccess.value = ''; apply(true); q.focus(); });
    apply(false);
  }

  // Conferencias: filtro por temática y marcado de próximas
  var talks = document.querySelector('[data-talks]');
  if (talks) {
    var now = new Date();
    var items = Array.prototype.slice.call(talks.querySelectorAll('.talk'));
    items.forEach(function (it) {
      var end = new Date(it.dataset.end || it.dataset.date);
      var flag = it.querySelector('.upcoming');
      if (flag) flag.hidden = !(end > now);
    });
    var tchips = Array.prototype.slice.call(document.querySelectorAll('[data-topic-chip]'));
    var years = Array.prototype.slice.call(talks.querySelectorAll('.year'));
    tchips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        var topic = ch.dataset.topicChip;
        tchips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === ch)); });
        items.forEach(function (it) { it.hidden = !!topic && (it.dataset.topics || '').split('|').indexOf(topic) < 0; });
        years.forEach(function (y) { y.hidden = !y.querySelector('.talk:not([hidden])'); });
      });
    });
  }
})();
