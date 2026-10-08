/*
 * soluzioni.js — Genera il PDF con le soluzioni dell'esercitazione, per gli istruttori.
 *
 * Le soluzioni si leggono dai dati di scripts/games.js (gli stessi array che usa il gioco),
 * così il PDF non può dire una cosa diversa dal gioco. Le regole delle due mappe (piano sul
 * campo e flusso dei mezzi) sono codice, e qui sono riassunte a parole: se cambiano nel gioco,
 * vanno cambiate anche qui (cerca "REGOLE DELLE MAPPE").
 *
 * Uso:  cd Gioco  &&  node tools/soluzioni.js
 * Scrive tools/soluzioni.html e, se trova Chrome o Edge, il PDF alla radice del repository.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');           // .../Gioco
const src = fs.readFileSync(path.join(root, 'scripts', 'games.js'), 'utf8');
const PDF = path.join(root, '..', 'Maxi-Emergenza - Soluzioni per gli istruttori.pdf');

// Estrae il letterale (array o oggetto) assegnato a `nome` in games.js, saltando stringhe e commenti
function letterale(nome) {
  const m = new RegExp('(?:const|let)\\s+' + nome + '\\s*=\\s*').exec(src);
  if (!m) throw new Error('Non trovo ' + nome + ' in games.js');
  let i = m.index + m[0].length;
  const apre = src[i], chiude = apre === '[' ? ']' : '}';
  if (apre !== '[' && apre !== '{') throw new Error(nome + ' non è un array o un oggetto');
  let livello = 0, k = i;
  for (; k < src.length; k++) {
    const c = src[k];
    if (c === '"' || c === "'" || c === '`') {        // stringa: fino alla chiusura, con gli escape
      for (k++; k < src.length && src[k] !== c; k++) if (src[k] === '\\') k++;
    } else if (c === '/' && src[k + 1] === '/') {     // commento di riga
      while (k < src.length && src[k] !== '\n') k++;
    } else if (c === '/' && src[k + 1] === '*') {     // commento di blocco
      k = src.indexOf('*/', k + 2) + 1;
    } else if (c === apre) livello++;
    else if (c === chiude && --livello === 0) break;
  }
  return Function('"use strict"; return (' + src.slice(i, k + 1) + ');')();
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const html = [];
let n = 0;
const prova = (titolo, fonte, corpo) => {
  n++;
  html.push(`<section><h2><span class="n">${n}</span>${esc(titolo)}</h2>${corpo}${fonte ? `<p class="fonte">Fonte: ${esc(fonte)}</p>` : ''}</section>`);
};
const giusta = t => `<li class="ok">${esc(t)}</li>`;
const lista = (righe, ordinata) => `<${ordinata ? 'ol' : 'ul'}>${righe.join('')}</${ordinata ? 'ol' : 'ul'}>`;

// 1. Lo scenario
const sc = letterale('correctScenarioAnswers');
prova('Lo scenario: valuta l\'evento', 'gioco, valutazione dello scenario', lista([
  `<li>A) L'evento corrisponde a quanto riferito dal 118: <b>${sc.eventMatch === 'si' ? 'sì' : 'no'}</b>.</li>`,
  `<li>B) Che cosa si vede: una descrizione di almeno 15 caratteri con almeno due di queste parole o radici: ${esc(sc.scenarioDescriptionKeywords.join(', '))}.</li>`,
  `<li>C) Rischio evolutivo: <b>${sc.evolutiveRisk === 'si' ? 'sì' : 'no'}</b>.</li>`,
  `<li>D) Coinvolti stimati: fra <b>${sc.victimsRange[0]}</b> e <b>${sc.victimsRange[1]}</b>.</li>`,
  `<li>E) Patologie prevalenti: almeno due di queste parole o radici: ${esc(sc.prevalentPathologiesKeywords.join(', '))}.</li>`]));

// 2. Le aree
prova('Le aree della maxiemergenza', 'manuale AREU 2026, p. 17, 19-20, 28, 30; lezione, istruzioni per il primo MSB',
  lista(letterale('zoneDefinitionsData').map(z => `<li><b>${esc(z.zone)}</b>: ${esc(z.definition)}</li>`)));

// 3. Le pettorine
prova('Le pettorine', 'manuale AREU 2026, p. 14-18',
  lista(letterale('roleColorData').map(r => `<li><b>${esc(r.role)}</b> (${esc(r.acronym)}): pettorina <b>${esc(r.nome)}</b></li>`)));

// 4. Il primo MSB
const etichette = letterale('msbRoleLabels');
const msb = letterale('msbGameTasksData');
prova('Il primo MSB: chi fa che cosa', 'action card del primo MSB, lezione AREU 2026',
  Object.keys(etichette).map(r => `<h3>${esc(etichette[r])}</h3>` + lista(msb.filter(t => t.role === r).map(t => `<li>${esc(t.text)}</li>`))).join(''));

// 5. I compiti del Referente
prova('I compiti del Referente per la SOREU, in ordine', 'action card del primo MSB',
  lista(letterale('referenteTasksOrdered').map(t => `<li>${esc(t)}</li>`), true));

// 6. Il METHANE
prova('Il messaggio METHANE', 'manuale AREU 2026, p. 26',
  lista(letterale('methaneGameData').map(m => `<li><b>${esc(m.letter)}</b>: ${esc(m.definition)}</li>`)));

// 7-8. REGOLE DELLE MAPPE (sono codice in games.js: tenerle allineate)
prova('Progetta il piano sul campo', 'manuale AREU 2026, p. 19-20, 28; lezione, istruzioni per il primo MSB', `
  <p>Tre aree da posizionare intorno al crash (🚆 e 🔥, con l'area di sicurezza da tenere sgombra). Cinque punti; si supera con 4.</p>
  ${lista([
    '<li>L\'<b>area di raccolta</b> dei codici giallo e rosso vicino al crash (al massimo due celle dal centro).</li>',
    '<li>Il <b>PMA</b> ai margini esterni dell\'area di sicurezza (almeno tre celle dal centro del crash).</li>',
    '<li>Il <b>PMA vicino all\'area di raccolta</b> (al massimo due celle): distanze minime fra le due aree.</li>',
    '<li>L\'<b>area dei codici verdi</b> a debita distanza dal luogo dell\'evento (almeno tre celle).</li>',
    '<li>L\'<b>area dei verdi distinta dal PMA</b> (non attaccata): al PMA accedono di norma solo gialli e rossi.</li>'])}
  <p class="nota">Le ultime due regole e «l'entrata dal lato del crash» del gioco seguente sono deduzioni dalle fonti, non frasi del manuale.</p>`);
prova('Crash: il flusso dei mezzi', 'manuale AREU 2026, p. 17, 19, 29; lezione, la catena dei soccorsi', `
  <p>Il crash e il PMA sono già sulla mappa. Si posizionano l'entrata e l'uscita del PMA, due check point e l'area di sosta. Cinque punti; si supera con 4.</p>
  ${lista([
    '<li><b>Entrata e uscita</b> a ridosso del PMA e separate fra loro.</li>',
    '<li>L\'<b>entrata dal lato del crash</b> (piccola noria), l\'uscita dall\'altro (grande noria verso gli ospedali).</li>',
    '<li>I due <b>check point sul perimetro</b> del cantiere: punti di passaggio obbligati per i mezzi in entrata e in uscita (un punto ciascuno).</li>',
    '<li>L\'<b>area di sosta</b> defilata, ad almeno tre celle dal crash e due dal PMA; gli autisti restano a bordo in ascolto radio.</li>'])}`);

// 9. Le priorità
prova('Le priorità del primo MSB sul deragliamento', 'manuale AREU 2026, p. 26 e 28; action card del primo MSB',
  lista(letterale('priorityActions').slice().sort((a, b) => a.priority - b.priority).map(a => `<li>${esc(a.text)}</li>`), true));

// 10. Le risorse
const zone = letterale('zonesData');
prova('Gestione delle risorse: chi lavora dove', 'manuale AREU 2026, p. 17, 19, 25, 28-29, glossario; lezione',
  lista(zone.map(z => {
    const conto = {};
    z.expectedResources.forEach(r => { conto[r] = (conto[r] || 0) + 1; });
    return `<li><b>${esc(z.display)}</b>: ${Object.entries(conto).map(([r, k]) => esc(k > 1 ? `${r} (${k})` : r)).join(', ')}</li>`;
  })));

// 11. Le comunicazioni
prova('Le comunicazioni: che cosa e a chi', 'manuale AREU 2026, p. 17, 19, 22-23, 26, 28-30',
  letterale('radioScenarios').map((s, i) => {
    const g = s.options.find(o => o.correct);
    return `<div class="caso"><p><b>${i + 1}.</b> ${esc(s.scenario)}</p>${lista([giusta(g.text)])}<p class="perche">${esc(g.feedback)}</p></div>`;
  }).join(''));

// 12. Le scelte difficili
prova('Scelte difficili', 'manuale AREU 2026',
  letterale('ethicalDilemmas').map((d, i) => {
    const g = d.options.find(o => o.isCorrect);
    return `<div class="caso"><p><b>${i + 1}.</b> ${esc(d.scenario)}</p>${lista([giusta(g.text)])}<p class="perche">${esc(d.outcomeExplanation.true)}</p></div>`;
  }).join(''));

// 13. Il quiz
const quiz = (nome) => lista(letterale(nome).map(q => `<li>${esc(q.question.replace(/^\d+\)\s*/, ''))} <b>${esc(q.correctAnswer)}</b></li>`), true);
prova('Il quiz', 'manuale AREU 2026 (START a p. 22-23)', `<h3>Triage START</h3>${quiz('startQuizQuestions')}<h3>Concetti</h3>${quiz('conceptsQuizQuestions')}`);

// In più: gli altri enti (schermata informativa, con domande ma senza blocco)
const enti = letterale('otherForcesQuestions');
html.push(`<section><h2><span class="n">+</span>Gli altri enti (domande della schermata informativa)</h2>${lista(enti.map(q => {
  const g = q.options.find(o => o.correct);
  return `<li>${esc(q.question.replace(/^\d+\)\s*/, ''))} <b>${esc(g.text)}</b></li>`;
}), true)}</section>`);

const oggi = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
const pagina = `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Maxi-Emergenza: soluzioni per gli istruttori</title>
<style>
  @page { size: A4; margin: 16mm 15mm; }
  body { font: 10.5pt/1.45 "Segoe UI", Arial, sans-serif; color: #1f2937; }
  h1 { font-size: 20pt; margin: 0 0 4px; color: #b91c1c; }
  .sotto { color: #4b5563; margin: 0 0 14px; }
  .fonti { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 12px; background: #f9fafb; font-size: 9.5pt; }
  section { break-inside: avoid-page; margin-top: 16px; }
  h2 { font-size: 13pt; margin: 0 0 6px; border-bottom: 2px solid #fecaca; padding-bottom: 3px; }
  h2 .n { display: inline-block; min-width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 11px; background: #b91c1c; color: #fff; font-size: 10pt; margin-right: 8px; }
  h3 { font-size: 11pt; margin: 8px 0 2px; }
  ul, ol { margin: 4px 0 4px 18px; padding: 0; }
  li { margin: 2px 0; }
  li.ok { list-style: none; margin-left: -16px; color: #166534; font-weight: 600; }
  li.ok::before { content: "✔ "; }
  .caso { margin: 6px 0 8px; break-inside: avoid; }
  .caso p { margin: 2px 0; }
  .perche { color: #4b5563; font-size: 9.5pt; }
  .fonte, .nota { color: #6b7280; font-size: 9pt; margin: 4px 0 0; }
</style></head><body>
<h1>Esercitazione Maxi-Emergenza: soluzioni</h1>
<p class="sotto">Per gli istruttori · le 13 prove dell'esercitazione come sono nel gioco · generato il ${esc(oggi)} da tools/soluzioni.js</p>
<div class="fonti"><b>Fonti.</b> AREU Lombardia, <i>Manuale Maxiemergenza – Soccorritori</i>, Rev1 LAS, gennaio 2026; lezione <i>Maxiemergenza</i> del LAS con l'action card del primo MSB, gennaio 2026. Il materiale 2026 annulla e sostituisce quello precedente (nota AREU prot. 1747 del 21/01/2026). Ogni prova si supera solo con la risposta giusta, o con 4 punti su 5 nelle due mappe.</div>
${html.join('\n')}
</body></html>`;

const htmlPath = path.join(__dirname, 'soluzioni.html');
fs.writeFileSync(htmlPath, pagina, 'utf8');
console.log(`OK: ${n} prove in ${path.relative(root, htmlPath)}`);

// Stampa in PDF con Chrome o Edge, se ci sono
const browser = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(p => fs.existsSync(p));
if (!browser) { console.log('Chrome o Edge non trovati: stampa a mano tools/soluzioni.html in PDF.'); process.exit(0); }
execFileSync(browser, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer',
  '--print-to-pdf=' + PDF, 'file:///' + htmlPath.replace(/\\/g, '/')], { stdio: 'ignore' });
console.log('OK: ' + path.basename(PDF));
