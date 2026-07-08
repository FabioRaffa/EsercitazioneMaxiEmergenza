/*
 * touch-drag.js — Abilita il Drag & Drop HTML5 sui dispositivi touch.
 *
 * Il DnD nativo del browser NON emette eventi drag su touchscreen, quindi tutti
 * i giochi che usano il trascinamento sarebbero ingiocabili su telefono/tablet.
 * Questo shim intercetta gli eventi touch e sintetizza i corrispondenti eventi
 * dragstart/dragenter/dragover/dragleave/drop/dragend, così i giochi funzionano
 * al tocco SENZA alcuna modifica alla loro logica.
 *
 * È inerte su desktop (non arrivano eventi touch) e non interferisce col mouse.
 * Mostra anche un "fantasma" che segue il dito per un feedback visivo.
 */
(function () {
  var src = null;        // elemento draggable in trascinamento
  var dt = null;         // DataTransfer condiviso tra gli eventi sintetici
  var started = false;   // drag effettivamente iniziato (oltre la soglia)
  var sx = 0, sy = 0;    // punto iniziale del tocco
  var lastOver = null;   // ultimo elemento sotto il dito (per dragenter/leave)
  var ghost = null;      // clone visivo che segue il dito
  var THRESHOLD = 8;     // px di movimento prima di iniziare il drag

  function draggableAt(el) {
    while (el && el.nodeType === 1) {
      if (el.getAttribute('draggable') === 'true') return el;
      el = el.parentElement;
    }
    return null;
  }

  function makeDataTransfer() {
    try { return new DataTransfer(); } catch (e) { return null; }
  }

  function fire(type, target, x, y) {
    if (!target) return null;
    var ev;
    try {
      ev = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt, clientX: x, clientY: y });
    } catch (e) {
      // Fallback per browser che non accettano dataTransfer nel costruttore
      ev = new Event(type, { bubbles: true, cancelable: true });
      try { Object.defineProperty(ev, 'dataTransfer', { value: dt, configurable: true }); } catch (_) {}
      ev.clientX = x; ev.clientY = y;
    }
    target.dispatchEvent(ev);
    return ev;
  }

  function makeGhost(el, x, y) {
    var r = el.getBoundingClientRect();
    ghost = el.cloneNode(true);
    ghost.style.position = 'fixed';
    ghost.style.left = r.left + 'px';
    ghost.style.top = r.top + 'px';
    ghost.style.width = r.width + 'px';
    ghost.style.height = r.height + 'px';
    ghost.style.margin = '0';
    ghost.style.pointerEvents = 'none';
    ghost.style.opacity = '0.85';
    ghost.style.zIndex = '9999';
    ghost.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
    ghost.dataset.gdx = (x - r.left);
    ghost.dataset.gdy = (y - r.top);
    document.body.appendChild(ghost);
  }
  function moveGhost(x, y) {
    if (!ghost) return;
    ghost.style.left = (x - parseFloat(ghost.dataset.gdx)) + 'px';
    ghost.style.top = (y - parseFloat(ghost.dataset.gdy)) + 'px';
  }
  function removeGhost() {
    if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
    ghost = null;
  }

  document.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    var d = draggableAt(e.target);
    if (!d) return;
    src = d; started = false;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!src) return;
    var t = e.touches[0], x = t.clientX, y = t.clientY;
    if (!started) {
      if (Math.abs(x - sx) < THRESHOLD && Math.abs(y - sy) < THRESHOLD) return;
      started = true;
      dt = makeDataTransfer();
      fire('dragstart', src, x, y);
      makeGhost(src, x, y);
    }
    e.preventDefault(); // blocca lo scroll della pagina durante il trascinamento
    moveGhost(x, y);
    var over = document.elementFromPoint(x, y);
    if (over !== lastOver) {
      if (lastOver) fire('dragleave', lastOver, x, y);
      if (over) fire('dragenter', over, x, y);
      lastOver = over;
    }
    if (over) fire('dragover', over, x, y);
  }, { passive: false });

  function end(e) {
    if (!src) return;
    var t = (e.changedTouches && e.changedTouches[0]) || {};
    var x = t.clientX, y = t.clientY;
    if (started) {
      removeGhost();
      var over = document.elementFromPoint(x, y);
      if (over) fire('drop', over, x, y);
      fire('dragend', src, x, y);
    }
    src = null; started = false; lastOver = null; dt = null;
  }
  document.addEventListener('touchend', end);
  document.addEventListener('touchcancel', end);
})();
