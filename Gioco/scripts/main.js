/*
 * main.js — Wizard di navigazione dell'esercitazione Maxi-Emergenza.
 *
 * - Carica/usa le 16 sezioni (incorporate in index.html, o via fetch come fallback).
 * - Chiama UNA volta window.initGames() (in scripts/games.js) per inizializzare i giochi.
 * - Mostra una schermata alla volta, con Precedente/Successivo, barra di avanzamento
 *   e link della barra superiore.
 * - GATING: il pulsante "Successivo" si abilita solo quando il gioco corrente è stato
 *   completato correttamente. I giochi segnalano il completamento chiamando
 *   window.__markDone('<id>') (vedi games.js). Le sezioni informative non richiedono nulla.
 * - Al termine di tutti i giochi si sblocca la schermata finale di congratulazioni.
 */

// Ordine ufficiale delle schermate-gioco. `id` combacia con l'id della <section>,
// con l'id del wrapper .wizard-step (step-<id>) e con gli anchor (#id) dei link.
const SECTIONS = [
  { id: 'hero',                  label: 'Introduzione',          file: 'sections/01-hero.html' },
  { id: 'attivazione-chiamata',  label: 'Attivazione Chiamata',  file: 'sections/02-attivazione-chiamata.html' },
  { id: 'scenario',              label: 'Valutazione Scenario',  file: 'sections/03-scenario.html' },
  { id: 'fasi',                  label: 'Fasi di Risposta',      file: 'sections/04-fasi.html' },
  { id: 'attori',                label: 'Attori Chiave',         file: 'sections/05-attori.html' },
  { id: 'mezzi',                 label: 'Mezzi e Strutture',     file: 'sections/06-mezzi.html' },
  { id: 'msb-game-section',      label: 'Primo MSB',             file: 'sections/07-msb-game-section.html' },
  { id: 'compiti-referente',     label: 'Compiti Referente',     file: 'sections/08-compiti-referente.html' },
  { id: 'comunicazione-soreu',   label: 'Comunicazione SOREU',   file: 'sections/09-comunicazione-soreu.html' },
  { id: 'progetta-piano',        label: 'Progetta Piano',        file: 'sections/10-progetta-piano.html' },
  { id: 'crash',                 label: 'Crash',                 file: 'sections/11-crash.html' },
  { id: 'priority-intervention', label: 'Priorità Intervento',   file: 'sections/12-priority-intervention.html' },
  { id: 'resource-management',   label: 'Gestione Risorse',      file: 'sections/13-resource-management.html' },
  { id: 'radio-communication',   label: 'Comunicazione Radio',   file: 'sections/14-radio-communication.html' },
  { id: 'ethical-dilemma',       label: 'Dilemma Etico',         file: 'sections/15-ethical-dilemma.html' },
  { id: 'quiz',                  label: 'Quiz',                  file: 'sections/16-quiz.html' },
];

// Sezioni che richiedono il completamento corretto per proseguire (le altre sono
// informative e si sbloccano subito).
const REQUIRED = new Set([
  'scenario', 'fasi', 'attori', 'msb-game-section', 'compiti-referente',
  'comunicazione-soreu', 'progetta-piano', 'crash', 'priority-intervention',
  'resource-management', 'radio-communication', 'ethical-dilemma', 'quiz',
]);

const CONGRATS_INDEX = SECTIONS.length; // 16 -> schermata finale

// === Sblocco navigazione (riservato ai formatori) ===
// Password per navigare liberamente tra i giochi senza completarli.
// NB: essendo un sito statico, questo valore è LEGGIBILE nel sorgente: è una
// protezione "morbida" per i formatori, non una password sicura.
// Per cambiarla, modifica la stringa qui sotto.
const NAV_UNLOCK_PASSWORD = 'maxi-sblocca-2025';

let current = 0;
let navUnlocked = false;
try { navUnlocked = sessionStorage.getItem('maxiNavUnlocked') === '1'; } catch (e) {}
const done = new Set();                 // id delle sezioni-gioco completate
const idToIndex = {};
SECTIONS.forEach((s, i) => { idToIndex[s.id] = i; });

function appEl() { return document.getElementById('app'); }

// Indice della prima sezione richiesta non ancora completata; se tutte fatte -> CONGRATS_INDEX
function frontier() {
  if (navUnlocked) return CONGRATS_INDEX; // formatore: tutte le schermate raggiungibili
  for (let i = 0; i < SECTIONS.length; i++) {
    if (REQUIRED.has(SECTIONS[i].id) && !done.has(SECTIONS[i].id)) return i;
  }
  return CONGRATS_INDEX;
}

// Chiamata dai giochi (games.js) al completamento corretto
window.__markDone = function (id) {
  if (!REQUIRED.has(id) || done.has(id)) return;
  done.add(id);
  updateNav(); // se è la sezione corrente, abilita subito "Successivo"
};

// --- Preparazione sezioni (inline oppure fetch di fallback) ---
async function prepareSections() {
  const app = appEl();
  if (app.querySelectorAll('.wizard-step').length >= SECTIONS.length) return; // già incorporate

  const htmls = await Promise.all(SECTIONS.map(s =>
    fetch(s.file)
      .then(r => { if (!r.ok) throw new Error(r.status + ' ' + s.file); return r.text(); })
      .catch(err => {
        console.error('Errore nel caricamento della sezione:', err);
        return `<section class="text-center py-12 text-red-600">Errore nel caricamento di ${s.file}.<br>Apri l'app tramite un web server (es. <code>npm start</code>), non con doppio click sul file.</section>`;
      })
  ));
  app.innerHTML = '';
  htmls.forEach((html, i) => {
    const step = document.createElement('div');
    step.className = 'wizard-step';
    step.id = 'step-' + SECTIONS[i].id;
    step.dataset.index = String(i);
    step.innerHTML = html;
    app.appendChild(step);
  });
}

// --- Navigazione ---
function showStep(i) {
  if (i < 0 || i > CONGRATS_INDEX) return;
  if (i > frontier()) return; // schermata ancora bloccata

  current = i;
  const steps = appEl().querySelectorAll('.wizard-step');
  steps.forEach((s, idx) => s.classList.toggle('active', idx === i));

  updateNav();
  window.dispatchEvent(new Event('resize')); // ricalcola i grafici Chart.js
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNav() {
  const label = document.getElementById('section-label');
  const bar = document.getElementById('wizard-progress-bar');
  const prev = document.getElementById('prev-section-btn');
  const next = document.getElementById('next-section-btn');
  const hint = document.getElementById('wizard-hint');

  const isCongrats = current >= CONGRATS_INDEX;
  const f = frontier();

  if (label) label.textContent = isCongrats
    ? '🎉 Esercitazione completata!'
    : `${current + 1}/${SECTIONS.length} — ${SECTIONS[current].label}`;
  if (bar) bar.style.width = isCongrats ? '100%' : ((current + 1) / SECTIONS.length * 100) + '%';

  if (prev) prev.disabled = current === 0;

  // "Successivo" abilitato solo se la schermata corrente è già superata (current < frontiera)
  const canNext = !isCongrats && current < f;
  if (next) {
    next.disabled = !canNext;
    next.style.display = isCongrats ? 'none' : '';
  }

  // Messaggio di aiuto
  if (hint) {
    if (navUnlocked) {
      hint.textContent = '🔓 Navigazione sbloccata (formatore)';
      hint.className = 'wizard-hint';
    } else if (isCongrats) {
      hint.textContent = '';
    } else if (REQUIRED.has(SECTIONS[current].id) && !done.has(SECTIONS[current].id)) {
      hint.textContent = '🔒 Completa correttamente il gioco per sbloccare il successivo';
      hint.className = 'wizard-hint locked';
    } else {
      hint.textContent = '';
      hint.className = 'wizard-hint';
    }
  }

  // Stato dei link della barra superiore (attivo + bloccati)
  document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(a => {
    const id = (a.getAttribute('href') || '').slice(1);
    const idx = idToIndex[id];
    const isActive = !isCongrats && idx === current;
    a.classList.toggle('active-nav', isActive);
    a.classList.toggle('inactive-nav', !isActive);
    const locked = idx === undefined || idx > f;
    a.classList.toggle('nav-locked', locked);
  });
}

function wireNav() {
  const prev = document.getElementById('prev-section-btn');
  const next = document.getElementById('next-section-btn');
  if (prev) prev.addEventListener('click', () => showStep(current - 1));
  if (next) next.addEventListener('click', () => showStep(current + 1));

  document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#') && href.slice(1) in idToIndex) {
        e.preventDefault();
        const idx = idToIndex[href.slice(1)];
        if (idx <= frontier()) showStep(idx); // niente salti oltre la frontiera sbloccata
        const mm = document.getElementById('mobile-menu');
        if (mm) mm.classList.add('hidden');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowRight') { const n = document.getElementById('next-section-btn'); if (n && !n.disabled) showStep(current + 1); }
    else if (e.key === 'ArrowLeft') showStep(current - 1);
  });

  const restart = document.getElementById('restart-experience-btn');
  if (restart) restart.addEventListener('click', () => location.reload());
}

// Modale "Info & Credits" (pulsante "i" in alto a sinistra)
function wireInfoModal() {
  const btn = document.getElementById('info-button');
  const modal = document.getElementById('info-modal');
  if (!btn || !modal) return;
  const content = modal.querySelector('.modal-content');
  const open = () => {
    modal.classList.remove('invisible', 'opacity-0');
    if (content) content.classList.remove('scale-95');
  };
  const close = () => {
    modal.classList.add('invisible', 'opacity-0');
    if (content) content.classList.add('scale-95');
  };
  btn.addEventListener('click', open);
  const overlayBtn = document.getElementById('overlay-info-btn');
  if (overlayBtn) overlayBtn.addEventListener('click', open);
  modal.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', close));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// Sblocco navigazione (formatori)
function setUnlockButtonState() {
  const btn = document.getElementById('unlock-button');
  if (!btn) return;
  btn.innerHTML = navUnlocked ? '&#128275;' : '&#128274;'; // 🔓 / 🔒
  btn.classList.toggle('nav-unlocked-btn', navUnlocked);
  btn.title = navUnlocked
    ? 'Navigazione sbloccata — clicca per ri-bloccare'
    : 'Sblocca navigazione (formatori)';
}

function applyUnlock(state) {
  navUnlocked = state;
  try { sessionStorage.setItem('maxiNavUnlocked', state ? '1' : '0'); } catch (e) {}
  setUnlockButtonState();
  if (!state && current > frontier()) showStep(frontier()); // ri-bloccando, riporta alla frontiera
  else updateNav();
}

function wireUnlock() {
  const btn = document.getElementById('unlock-button');
  const modal = document.getElementById('unlock-modal');
  if (!btn || !modal) return;
  const content = modal.querySelector('.modal-content');
  const input = document.getElementById('unlock-password');
  const feedback = document.getElementById('unlock-feedback');

  const openM = () => {
    modal.classList.remove('invisible', 'opacity-0');
    if (content) content.classList.remove('scale-95');
    if (feedback) { feedback.textContent = ''; feedback.className = 'text-sm h-5'; }
    if (input) { input.value = ''; setTimeout(() => input.focus(), 50); }
  };
  const closeM = () => {
    modal.classList.add('invisible', 'opacity-0');
    if (content) content.classList.add('scale-95');
  };
  const trySubmit = () => {
    if (input.value === NAV_UNLOCK_PASSWORD) {
      applyUnlock(true);
      if (feedback) { feedback.textContent = '✔️ Navigazione sbloccata'; feedback.className = 'text-sm h-5 text-green-600'; }
      setTimeout(closeM, 700);
    } else if (feedback) {
      feedback.textContent = '❌ Password errata'; feedback.className = 'text-sm h-5 text-red-600';
    }
  };

  btn.addEventListener('click', () => { navUnlocked ? applyUnlock(false) : openM(); });
  const submit = document.getElementById('unlock-submit');
  if (submit) submit.addEventListener('click', trySubmit);
  if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') trySubmit(); });
  modal.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', closeM));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeM(); });

  setUnlockButtonState();
}

// Overlay iniziale "Affronta la Maxi-Emergenza!"
function startExperience() {
  const overlay = document.getElementById('start-activity-button-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.addEventListener('transitionend', () => { overlay.style.display = 'none'; }, { once: true });
  }
  document.body.classList.remove('locked');
  showStep(0);
}

async function init() {
  await prepareSections();

  // Durante l'init teniamo visibili tutte le sezioni (classe .wizard-preinit): così i
  // grafici Chart.js nascono con dimensioni corrette invece che a 0.
  const app = appEl();
  app.classList.add('wizard-preinit');
  if (typeof window.initGames === 'function') {
    try { window.initGames(); }
    catch (err) { console.error('Errore in initGames():', err); }
  } else {
    console.error('window.initGames non definito — scripts/games.js non è stato caricato.');
  }
  app.classList.remove('wizard-preinit');

  wireNav();
  wireInfoModal();
  wireUnlock();
  showStep(0);

  const startBtn = document.getElementById('wizard-start-btn');
  if (startBtn) startBtn.addEventListener('click', startExperience);
  else startExperience();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
