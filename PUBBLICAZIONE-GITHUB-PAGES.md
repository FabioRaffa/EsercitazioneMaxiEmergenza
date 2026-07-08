# Pubblicare l'esercitazione su GitHub Pages

Guida passo-passo per mettere online l'app (accessibile via link, gratis).
L'app è statica e usa solo percorsi relativi, quindi è pronta per GitHub Pages:
alla radice del repo ci sono già `index.html` (che reindirizza a `Gioco/index.html`)
e `.nojekyll` (sito statico puro).

---

## 1. Carica le modifiche su GitHub (push)

Le modifiche sono committate in locale ma vanno inviate al repository online.
Da terminale, nella cartella del progetto:

```bash
git push
```

> Se compare un messaggio tipo *"has no upstream branch"*, usa:
> ```bash
> git push -u origin Splitting
> ```
> (sostituisci `Splitting` con il nome del branch che stai usando).

Verifica su GitHub che i file siano presenti (in particolare `index.html` alla
radice e la cartella `Gioco/`).

---

## 2. Attiva GitHub Pages

1. Vai sul repository su **github.com**.
2. Clicca su **Settings** (Impostazioni), in alto.
3. Nel menu a sinistra, clicca su **Pages**.
4. Alla voce **Build and deployment → Source**, scegli **Deploy from a branch**.
5. In **Branch** seleziona il branch da pubblicare (es. `main` oppure `Splitting`)
   e la cartella **`/ (root)`**. Poi **Save**.

GitHub impiega da pochi secondi a un paio di minuti per pubblicare. Ricaricando la
pagina delle impostazioni Pages comparirà il link del sito, del tipo:

```
https://<tuo-utente>.github.io/<nome-repo>/
```

Aprendo quel link, il redirect ti porterà direttamente all'esercitazione.

---

## 3. (Consigliato) Pubblicare da `main`

Se ora lavori sul branch `Splitting`, conviene portare il lavoro su `main` prima di
pubblicare, così il sito segue il branch principale:

- **Via web (semplice):** su GitHub apri **Pull requests → New pull request**,
  imposta base `main` e compare `Splitting`, crea la PR e fai **Merge**.
- **Via terminale:**
  ```bash
  git checkout main
  git merge Splitting
  git push
  ```

Poi al passo 2 scegli `main` come branch di pubblicazione.

---

## Aggiornare il sito in futuro

Ogni volta che fai `git push` sul branch pubblicato, GitHub Pages **ricostruisce
automaticamente** il sito dopo pochi istanti. Non serve rifare la configurazione.

Ricorda: se modifichi i file in `Gioco/sections/`, rigenera prima `index.html` con
```bash
cd Gioco
node tools/build.js
```
poi committa e fai push.

---

## Note utili

- **Percorsi già a posto:** l'app usa solo percorsi relativi (`images/`, `scripts/`),
  quindi funziona anche nel sottopercorso `/<nome-repo>/` di GitHub Pages.
- **CDN esterne:** Tailwind, Chart.js e Google Fonts sono caricati via HTTPS e
  funzionano regolarmente online.
- **`node_modules` escluso:** è già in `.gitignore` (serve solo in locale per
  `Gioco/tools/check_site.js`), quindi non appesantisce il sito.
- **Audio/video:** i browser bloccano l'audio in autoplay finché l'utente non
  interagisce con la pagina. Nell'app l'interazione parte dal pulsante iniziale
  "Affronta la Maxi-Emergenza!", quindi l'audio funziona dopo il primo click.
- **Repository privato:** GitHub Pages sui repo privati richiede un piano a pagamento.
  Se il repo è pubblico, Pages è gratuito.
