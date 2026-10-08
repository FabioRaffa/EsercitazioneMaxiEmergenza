# EsercitazioneMaxiEmergenza
Esercitazione Interattiva Maxi Emergenza

## Descrizione

Questo progetto è una simulazione interattiva per la formazione nella gestione di maxi emergenze, come incidenti con molte vittime, che permette di esercitarsi nella coordinazione dei soccorsi, nella distribuzione delle priorità e nella presa di decisioni operative.

## Come si esegue

Il progetto vive nella cartella **`Gioco/`** ed è organizzato come sito navigabile
una schermata (gioco) alla volta, con pulsanti **Precedente/Successivo**, barra di
avanzamento e link rapidi nella barra in alto.

**È sufficiente aprire `Gioco/index.html`** con il browser (doppio click,
consigliato Google Chrome): la pagina è autonoma e non richiede un server.
All'interno sono presenti filmati, quindi assicurati che l'audio del dispositivo
sia attivo per seguire correttamente tutta la simulazione.

> In alternativa puoi servirlo con un piccolo web server locale
> (`cd Gioco && npm install && npm start` → http://localhost:8000). Non è
> necessario per l'uso normale, ma è comodo in sviluppo.

## Struttura

La simulazione è composta da una serie di giochi sequenziali che guidano l'utente attraverso diversi scenari e prove interattive. Il percorso è pensato per essere seguito dall'inizio alla fine, con livelli di difficoltà progressivi, e ogni gioco propone specifiche sfide da risolvere legate alla gestione di emergenze.

## Requisiti

- Un browser aggiornato (consigliato Google Chrome)
- Audio del dispositivo attivo per la corretta riproduzione dei filmati

## Materiale di supporto

Nel progetto è incluso anche un **PDF per gli istruttori** con le soluzioni delle 13 prove e le fonti AREU 2026. Si rigenera dai dati del gioco con `cd Gioco && node tools/soluzioni.js`, quindi dice sempre quello che dice il gioco.

Ospitata in una pagina (iframe), l'esercitazione dialoga con la didattica: a ogni prova superata manda `{tipo: 'tappa', id, punteggio}`, alla fine `{tipo: 'completato', punteggio}`, e all'avvio riceve `{tipo: 'avvio', ruolo, tappeSuperate}` (vedi `Gioco/scripts/main.js`).

## Note

Per domande, suggerimenti o segnalazioni, è possibile utilizzare la sezione *Issues* del repository.
