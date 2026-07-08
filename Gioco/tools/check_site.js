const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:8000/';
const localHtmlDir = path.resolve(__dirname, '..'); // Gioco/
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

function listHtmlFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...listHtmlFiles(full));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const summary = [];

  const htmlFiles = listHtmlFiles(localHtmlDir).map(f => path.relative(localHtmlDir, f).replace(/\\/g, '/'));
  // ensure index.html first
  htmlFiles.sort((a,b) => (a === 'index.html' ? -1 : (b === 'index.html' ? 1 : a.localeCompare(b))));

  for (const rel of htmlFiles) {
    const url = new URL(rel, baseUrl).href;
    const consoleMsgs = [];
    const networkResponses = [];
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.removeAllListeners('response');
    page.on('console', msg => {
      try { const loc = msg.location ? msg.location() : {}; consoleMsgs.push({type: msg.type(), text: msg.text(), url: loc.url, line: loc.lineNumber}); } catch(e) { consoleMsgs.push({type: 'unknown', text: String(msg)}); }
    });
    page.on('pageerror', err => consoleMsgs.push({type: 'pageerror', text: err.stack || err.toString()}));
    page.on('response', resp => { try { networkResponses.push({url: resp.url(), status: resp.status()}); } catch(e){} });

    console.log('\nCrawling', url);
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      const status = resp.status();
      const screenshotPath = path.join(screenshotsDir, rel.replace(/\//g, '__') + '.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });

      summary.push({ page: rel, status, console: consoleMsgs.slice(), network: networkResponses.slice(-40), screenshot: screenshotPath });
      console.log('Status', status, 'screenshot saved to', screenshotPath);
    } catch (e) {
      summary.push({ page: rel, error: e.message, console: consoleMsgs.slice(), network: networkResponses.slice(-40) });
      console.log('ERROR loading', url, e.message);
    }
  }

  // Print compact report
  console.log('\n=== Crawl report ===');
  summary.forEach(s => {
    if (s.error) {
      console.log(s.page, 'ERROR:', s.error);
    } else {
      console.log(s.page, 'STATUS', s.status, 'consoleMsgs', s.console.length, 'networkEvents', s.network.length, 'screenshot', s.screenshot);
    }
  });

  await browser.close();
})();