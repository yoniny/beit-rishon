// A sweep of every button of the panel's tree (and "מבט כללי"): node tools/qa-views.mjs [--port 8776] [--only <substring>]
// Loads the built plugin headless, clicks each button in the tree's order, waits for the flight, closes the card, and writes
// qa/views/NN.png (viewport 640x400) plus qa/views/index.json (NN -> title, mode, camera). Then: montage (ImageMagick) makes
// qa/views/sheet-K.png contact sheets, 12 tiles each, numbered - for a look at all the views at once.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const chrome = opt('--chrome', process.env.CHROME || '/usr/bin/google-chrome');
const port = +opt('--port', 8776);
const only = opt('--only', '');
const from = +opt('--from', 1);
const to = +opt('--to', 999);
const wait = +opt('--wait', 3600);
const outDir = path.join(root, 'qa', 'views');
fs.mkdirSync(outDir, { recursive: true });
const W = 640, H = 400;
const server = spawn('node', [path.join(root, 'tools', 'serve.mjs'), String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 400));
const browser = await puppeteer.launch({
  executablePath: chrome, headless: true, timeout: 60000,
  args: ['--no-sandbox', '--no-proxy-server', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-background-networking', '--disable-sync', '--no-first-run']
});
const index = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.evaluateOnNewDocument((ver) => { try { localStorage.setItem('tm1.news.seen', ver); } catch (_) {} }, JSON.parse(fs.readFileSync(path.join(root, 'plugin', 'manifest.json'), 'utf8')).version);   // no "מה חדש" window during the tests
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('pageerror: ' + String(e && e.message || e).slice(0, 200)));
  await page.goto('http://127.0.0.1:' + port + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 180000, polling: 500 });
  await page.evaluate(() => { const n = document.getElementById('tm-news'); if (n) n.remove(); });
  const titles = await page.evaluate(() => [...document.querySelectorAll('#tm-views button, details.tm-pl:not(.tm-ops-det) > div > button')].map((b) => b.title || b.textContent.trim()));
  let n = 0;
  for (let i = 0; i < titles.length; i++) {
    const t = titles[i];
    if (only && !only.split(',').some((o) => t.indexOf(o) >= 0)) continue;
    if (i + 1 < from || i + 1 > to) continue;
    n++;
    const nn = String(i + 1).padStart(2, '0');
    await page.evaluate((i) => {
      const bs = [...document.querySelectorAll('#tm-views button, details.tm-pl:not(.tm-ops-det) > div > button')];
      const b = bs[i];
      const d = b.closest('details');
      if (d) d.open = true;
      b.click();
    }, i);
    await sleep(900);
    await page.evaluate(() => { const cf = document.getElementById('tm-confirm'); if (cf && cf.style.display === 'flex') { const y = cf.querySelector('.y'); if (y) y.click(); } });   // the cloud's question: yes
    await sleep(wait - 900);
    await page.evaluate(() => { for (const id of ['tm-xcard']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } const p = document.getElementById('tm-panel'); if (p) p.style.display = 'none'; });
    await sleep(500);
    const st = await page.evaluate(() => { const c = window.__TM_CTX, E = window.__ent360; const r = (v) => v.toArray().map((x) => +x.toFixed(1)); return { mode: E && E.cam ? E.cam.mode : '?', pos: r(c.camera.position), tg: r(c.controls.target) }; });
    await page.screenshot({ path: path.join(outDir, nn + '.png') });
    index.push({ n: nn, title: t, ...st });
    console.log('[view] ' + nn + ' ' + t + ' ' + JSON.stringify(st));
    await page.evaluate(() => { const p = document.getElementById('tm-panel'); if (p) p.style.display = ''; });
  }
} finally {
  await browser.close();
  server.kill();
}
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 1), 'utf8');
// contact sheets: 12 tiles (4 x 3), each 320 x 200, numbered
const files = index.map((e) => path.join(outDir, e.n + '.png'));
for (let k = 0; k * 12 < files.length; k++) {
  const part = files.slice(k * 12, k * 12 + 12);
  const labeled = part.map((f) => { const o = f.replace(/\.png$/, '-l.png'); execFileSync('convert', [f, '-resize', '320x200', '-gravity', 'NorthWest', '-pointsize', '22', '-fill', 'yellow', '-stroke', 'black', '-strokewidth', '1', '-annotate', '+6+4', path.basename(f, '.png'), o]); return o; });
  execFileSync('montage', [...labeled, '-tile', '4x3', '-geometry', '+3+3', '-background', '#222', path.join(outDir, 'sheet-' + (k + 1) + '.png')]);
}
console.log('sheets: ' + Math.ceil(files.length / 12));
