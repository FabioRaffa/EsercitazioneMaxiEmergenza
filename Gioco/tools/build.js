/*
 * build.js — Rigenera le sezioni incorporate in index.html a partire dai
 * frammenti separati in sections/.
 *
 * Perché serve: index.html è AUTONOMO (le sezioni sono incorporate) così può
 * essere aperto anche con doppio click (file://), dove il browser blocca fetch().
 * I file in sections/ restano la "sorgente" modificabile: dopo averli editati,
 * lancia questo script per riportare le modifiche dentro index.html.
 *
 * Uso:  cd Gioco  &&  node tools/build.js
 *
 * Nota: vengono rigenerate SOLO le sezioni dentro <main id="app">…</main>.
 * Header, nav, overlay, barra Prev/Next, footer, modali e script restano intatti.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');           // .../Gioco
const indexPath = path.join(root, 'index.html');

// Ordine ufficiale delle schermate: [id per il wrapper, file frammento]
const SECTIONS = [
  ['hero', '01-hero.html'],
  ['attivazione-chiamata', '02-attivazione-chiamata.html'],
  ['scenario', '03-scenario.html'],
  ['fasi', '04-fasi.html'],
  ['attori-ruoli', '05a-attori-ruoli.html'],
  ['attori-colori', '05b-attori-colori.html'],
  ['attori-enti', '05c-attori-enti.html'],
  ['mezzi', '06a-mezzi.html'],
  ['mezzi-triage', '06b-mezzi-triage.html'],
  ['msb-game-section', '07-msb-game-section.html'],
  ['compiti-referente', '08-compiti-referente.html'],
  ['comunicazione-soreu', '09-comunicazione-soreu.html'],
  ['progetta-piano', '10-progetta-piano.html'],
  ['crash', '11-crash.html'],
  ['priority-intervention', '12-priority-intervention.html'],
  ['resource-management', '13-resource-management.html'],
  ['radio-communication', '14-radio-communication.html'],
  ['ethical-dilemma', '15-ethical-dilemma.html'],
  ['quiz', '16-quiz.html'],
];

const stepsHtml = SECTIONS.map(([id, file]) => {
  const frag = fs.readFileSync(path.join(root, 'sections', file), 'utf8').replace(/\s+$/, '');
  return `    <div class="wizard-step" id="step-${id}">\n${frag}\n    </div>`;
}).join('\n\n');

// Schermata finale di congratulazioni (mostrata solo quando tutti i giochi sono completati)
const congratsHtml = `    <div class="wizard-step" id="step-congratulazioni">
        <section class="text-center py-16">
            <div class="mb-4" style="font-size:4.5rem;line-height:1">🎉</div>
            <h2 class="text-4xl md:text-5xl font-extrabold text-primary mb-4">Congratulazioni!</h2>
            <p class="max-w-2xl mx-auto text-lg text-secondary mb-8">Hai completato correttamente tutti i giochi dell'esercitazione sulla maxi-emergenza. Ottimo lavoro nella gestione coordinata dei soccorsi!</p>
            <button id="restart-experience-btn" type="button" class="bg-red-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-700 transition shadow-md">Ricomincia da capo</button>
        </section>
    </div>`;

const allStepsHtml = stepsHtml + '\n\n' + congratsHtml;

let html = fs.readFileSync(indexPath, 'utf8');
const re = /(<main id="app"[^>]*>)[\s\S]*?(<\/main>)/;
if (!re.test(html)) {
  console.error('ERRORE: non trovo <main id="app">…</main> in index.html');
  process.exit(1);
}
html = html.replace(re, `$1\n${allStepsHtml}\n    $2`);
fs.writeFileSync(indexPath, html, 'utf8');
console.log(`OK: ${SECTIONS.length} sezioni + schermata finale reincorporate in index.html`);
