# Documentazione tecnica — Esercitazione Maxi-Emergenza

Simulazione interattiva per la formazione nella gestione di una maxi-emergenza
(scenario: deragliamento ferroviario con numerose vittime). L'utente attraversa
**16 schermate sequenziali**, alcune informative e altre con mini-giochi
(drag & drop, ordinamenti, quiz, posizionamento su mappa), navigando **un gioco
alla volta** con i pulsanti Precedente/Successivo.

> **Stato**: lo "splitting" è stato completato. La logica è separata in `games.js`,
> la navigazione in `main.js`, e ogni schermata ha il suo frammento in `sections/`.
> Per funzionare anche col **doppio click** (`file://`, dove il browser blocca
> `fetch()`), `index.html` incorpora le sezioni al suo interno: i file in
> `sections/` restano la sorgente modificabile e `tools/build.js` le reincorpora
> in `index.html`. La vecchia pagina monolitica è in `Gioco/index.monolith.html.bak`.

---

## Struttura delle cartelle

```
EsercitazioneMaxiEmergenza_Splitting/
├── README.md
├── DOCUMENTAZIONE.md                    # questo file
├── Maxi-Emergenza_...(Soluzioni).pdf    # soluzioni dei giochi (materiale di supporto)
└── Gioco/
    ├── index.html                       # ★ SHELL: head/stili, nav, overlay, <main id="app">, barra Prev/Next, modali globali
    ├── index.monolith.html.bak          #   backup della vecchia pagina monolitica (riferimento)
    ├── server.js                        #   web server statico Node (porta 8000)
    ├── package.json                     #   dipendenze (puppeteer, per tools/check_site.js)
    ├── images/                          #   immagini, audio (attivazione.mp3), video (clip.mp4)
    ├── sections/                        # ★ i 16 frammenti HTML delle schermate (solo markup)
    │   └── 01-hero.html … 16-quiz.html
    ├── scripts/
    │   ├── games.js                     # ★ logica di TUTTI i mini-giochi -> window.initGames()
    │   ├── main.js                      # ★ wizard: carica le sezioni, chiama initGames(), naviga
    │   └── common.js                    #   helper (attualmente non utilizzati dalla nuova architettura)
    └── tools/
        ├── build.js                     # ★ reincorpora sections/ dentro index.html
        ├── check_site.js                #   crawler Puppeteer: screenshot + log console
        └── screenshots/
```

---

## Come si esegue

**Basta aprire `Gioco/index.html`** col browser (doppio click): è autonomo,
le sezioni sono incorporate e non serve alcun server. Serve l'audio attivo per i filmati.

In alternativa, per lo sviluppo, si può servire con un web server:

```bash
cd Gioco
npm install      # una tantum
npm start        # avvia server.js → http://localhost:8000
```

`server.js` è un server statico minimale (~65 righe): mappa i MIME type, serve
`index.html` per `/`, blocca il directory traversal e imposta CORS `*`. In questa
modalità `main.js`, se `index.html` non contenesse già le sezioni, le caricherebbe
via `fetch()` da `sections/` (fallback).

Dipendenze CDN caricate a runtime: **Tailwind CSS**, **Chart.js**, **Google Fonts (Inter)**.

---

## Architettura (come funziona la navigazione)

Tre pezzi collaborano:

### 1. `index.html` — la *shell*
Contiene solo la struttura fissa: `<head>` con stili e CDN, la barra di
navigazione superiore, l'overlay di avvio ("Affronta la Maxi-Emergenza!"), un
contenitore vuoto `<main id="app">`, la **barra Precedente/Successivo** con
etichetta e barra di avanzamento, e gli **elementi globali** che non appartengono
a una singola sezione (footer + i 4 modali dei ruoli DSS/DPMA/TRO/ALO). In fondo
carica `scripts/games.js` e `scripts/main.js`.

### 2. `sections/01-hero.html … 16-quiz.html` — i frammenti
Ogni file contiene **solo il markup** di una schermata (una `<section>` più gli
eventuali elementi collegati). Nessuno script: la logica è tutta in `games.js`.

### 3. `scripts/games.js` — la logica dei giochi
Tutta la logica dei 16 mini-giochi, estratta dal vecchio script monolitico ed
esposta come **`window.initGames()`**. Va invocata **una sola volta**, dopo che
le sezioni sono nel DOM.

### 4. `scripts/main.js` — il *wizard*
Orchestratore. Al caricamento:
1. **prepara le sezioni**: se sono già incorporate in `index.html` (caso normale,
   avvolte in `.wizard-step`) le usa direttamente; altrimenti (contenitore vuoto)
   fa da fallback caricandole via `fetch()` da `sections/` — utile solo con server;
2. attiva temporaneamente la classe `wizard-preinit` (che rende visibili tutte le
   sezioni) e chiama **`initGames()`** — così i grafici **Chart.js** nascono con
   le dimensioni corrette invece che a 0 (problema tipico degli elementi creati
   dentro contenitori `display:none`);
3. mostra **una schermata alla volta** (`showStep`), aggiornando etichetta, barra
   di avanzamento e stato dei pulsanti;
4. collega la navigazione: pulsanti **Precedente/Successivo**, **link della barra
   superiore** (salto diretto alla schermata), **frecce della tastiera** ← →, e
   l'**overlay** di avvio.

L'ordine ufficiale delle schermate è l'array `SECTIONS` in cima a `main.js`
(l'`id` di ogni voce combacia con l'id della `<section>` e con gli anchor `#id`
dei link in alto).

---

## Le 16 schermate / giochi

| # | id | Titolo | Interazione |
|---|-----|--------|-------------|
| 1 | `hero` | Introduzione | Statica |
| 2 | `attivazione-chiamata` | Attivazione Chiamata (SOREU) | Telefono + audio; sblocca la vista scenario e il video |
| 3 | `scenario` | Valutazione Scenario | Abbinamento evento + rischio evolutivo |
| 4 | `fasi` | Fasi di Risposta | Tab informative + gioco zone |
| 5 | `attori` | Attori Chiave | Ruoli/colori + modali DSS/DPMA/TRO/ALO |
| 6 | `mezzi` | Mezzi e Strutture | Grafici Chart.js (mezzi, triage) |
| 7 | `msb-game-section` | Primo MSB | Drag & drop compiti → ruoli equipaggio |
| 8 | `compiti-referente` | Compiti Referente | Ordinamento compiti |
| 9 | `comunicazione-soreu` | METHANE Game | Drag & drop lettere M.E.T.H.A.N.E. |
| 10 | `progetta-piano` | Progetta Piano | Posizionamento zone su griglia |
| 11 | `crash` | Crash | Marcatori su mappa incidente |
| 12 | `priority-intervention` | Priorità d'Intervento | Ordinamento azioni per priorità |
| 13 | `resource-management` | Gestione Risorse | Drag & drop risorse nei settori |
| 14 | `radio-communication` | Comunicazione Radio | Scelta risposte radio |
| 15 | `ethical-dilemma` | Dilemma Etico | Scelta a tempo con esito |
| 16 | `quiz` | Quiz finale | Quiz a tab (triage START / concetti) |

---

## Progressione e completamento (gating)

Il pulsante **Successivo** è abilitato solo quando il gioco della schermata corrente
è stato **completato correttamente**; le sezioni informative (Introduzione,
Attivazione, Mezzi) si sbloccano subito. Non si può saltare avanti (né con i link in
alto) oltre la prima schermata non ancora completata.

Come funziona: ogni gioco, nel suo punto di successo dentro `scripts/games.js`,
chiama **`window.__markDone('<id-sezione>')`**. `main.js` tiene un insieme delle
sezioni completate e calcola la "frontiera" (prima sezione richiesta non completata):
Successivo è attivo solo se la schermata corrente è già superata.

- Giochi "tutto corretto" (scenario, fasi, attori, MSB, referente, METHANE, priorità,
  risorse): completati quando tutte le risposte sono corrette.
- Giochi a punteggio (crash, progetta-piano): completati con punteggio sufficiente
  (≥70% crash, ≥50% progetta-piano).
- Giochi sequenziali (radio, dilemmi): completati quando si finiscono tutti gli item.
- Quiz: completato al termine delle domande.

Quando **tutti** i giochi richiesti sono completati si sblocca una **schermata finale
di congratulazioni** (`step-congratulazioni`) con un pulsante "Ricomincia da capo".

> Nota: il gating è volutamente stringente ("completato *correttamente*"). Per
> allentarlo, si può cambiare la soglia dei giochi a punteggio in `games.js` o togliere
> un id dall'insieme `REQUIRED` in `main.js`.

### Sblocco navigazione (formatori)

In alto a sinistra, accanto al pulsante info, c'è un pulsante **🔒**: inserendo la
password sblocca la **libera navigazione** tra tutte le schermate senza dover
completare i giochi (utile ai formatori). Lo stato resta attivo per la sessione del
browser (`sessionStorage`, si azzera chiudendo la scheda); si può ri-bloccare
cliccando di nuovo il pulsante (che diventa 🔓 quando sbloccato).

La password è definita in `scripts/main.js` (`NAV_UNLOCK_PASSWORD`) ed è facilmente
modificabile. **Attenzione:** essendo un sito statico, la password è *leggibile nel
sorgente* — è una protezione "morbida" pensata per i formatori, **non** una password
sicura. Per una vera protezione servirebbe un backend (non disponibile su GitHub Pages).

## Pubblicazione online (GitHub Pages)

L'app è statica e usa solo percorsi relativi, quindi è pubblicabile su GitHub Pages:

1. Su GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**,
   scegli il branch (es. `main`) e cartella **`/ (root)`**.
2. Alla radice del repo ci sono già:
   - `index.html` che **reindirizza** a `Gioco/index.html` (così l'URL base del sito
     apre direttamente l'esercitazione);
   - `.nojekyll` che disabilita l'elaborazione Jekyll (sito statico puro).
3. L'app sarà su `https://<utente>.github.io/<repo>/`.

Le CDN (Tailwind, Chart.js, Google Fonts) sono servite via HTTPS e funzionano su Pages.
Suggerimento: aggiungi `Gioco/node_modules/` a un `.gitignore` — non serve online ed è
molto pesante (è usato solo da `tools/check_site.js` in locale).

## Note per la manutenzione

- **Modificare il markup di una schermata** → edita il file in `sections/` e poi
  esegui **`node tools/build.js`** (da dentro `Gioco/`) per reincorporare le
  sezioni in `index.html`. In alternativa puoi editare direttamente il blocco
  corrispondente dentro `index.html`. **Modificare la logica di un gioco** → si
  edita `scripts/games.js`.
- `tools/build.js` rigenera SOLO le sezioni dentro `<main id="app">…</main>`;
  header, nav, overlay, barra Prev/Next, footer, modali e script restano intatti.
- `games.js` è stato estratto automaticamente dal monolite: è un unico blocco che
  inizializza tutti i giochi. Gli elementi mancanti vengono in genere gestiti con
  guardie `if (el) …`, ma **gli id nei frammenti devono combaciare** con quelli
  attesi da `games.js` (una divergenza fa fallire l'init di quel gioco).
- Se si aggiunge/riordina una schermata, aggiornare l'array `SECTIONS` in
  `main.js` (e, se serve un collegamento rapido, il link nella barra superiore in
  `index.html`).
- I 4 modali dei ruoli e il footer stanno nella shell (`index.html`) perché sono
  **globali**, non legati a una singola sezione.
- Tailwind è caricato via CDN "play" (`cdn.tailwindcss.com`): ottimo per demo, non
  per la produzione.
- `scripts/common.js` non è più utilizzato dalla nuova architettura (resta per
  compatibilità/uso futuro).
- `index.monolith.html.bak` è la vecchia pagina completa: utile come riferimento,
  non viene servita.
