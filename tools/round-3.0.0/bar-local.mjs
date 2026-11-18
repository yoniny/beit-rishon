// the choice screen's bar (2.0.18): node bar.mjs <dist-unified/plugin> <standalone.html> <shots dir>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from '/home/claude/beit-rishon/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const [plugin, standalone, shots] = process.argv.slice(2);
fs.mkdirSync(shots, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const res = [];
const ok = (n, c, i) => { res.push(!!c); console.log((c ? 'OK   ' : 'FAIL ') + n + (i !== undefined ? '  ' + JSON.stringify(i) : '')); };
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--lang=he', '--allow-file-access-from-files'] });
const errors = [];
async function otzPage(w, h, fontSize, stored) {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e.message || e).slice(0, 200)));
  await page.setViewport({ width: w, height: h });
  await page.evaluateOnNewDocument((fontSize, stored) => {
    if (window.top !== window) return;
    try { localStorage.setItem('tm.unified.note', '1'); } catch (_) {}
    const hs = {}, store = Object.assign({ 'tm.unified.note': '1' }, stored || {});
    window.__sets = [];
    window.Otzaria = {
      on(evt, cb) { (hs[evt] = hs[evt] || []).push(cb); },
      call(m, p) {
        if (m === 'storage.get') return Promise.resolve({ success: true, data: p && p.key in store ? store[p.key] : null });
        if (m === 'storage.set') { window.__sets.push([p.key, p.value]); store[p.key] = p.value; return Promise.resolve({ success: true }); }
        return Promise.resolve({ success: true });
      }
    };
    window.addEventListener('load', () => setTimeout(() => (hs['plugin.boot'] || []).forEach((cb) => cb({
      plugin: { id: 'x', version: '2.0.18' },
      theme: { colorScheme: { primary: '#c9a84c', onPrimary: '#1a1200', surface: '#0a0e1a', onSurface: '#e8e8e8', outline: '#2a2a3a', surfaceContainerHigh: '#171f37' }, typography: { fontSize } }
    })), 200));
  }, fontSize, stored);
  await page.goto(pathToFileURL(path.join(plugin, 'index.html')).href, { waitUntil: 'load' });
  await sleep(1200);
  return page;
}
const geom = (page) => page.evaluate(() => {
  const bar = document.getElementById('uni-bar'), pick = document.getElementById('pick');
  const b = bar.getBoundingClientRect(), p = pick.getBoundingClientRect();
  const kids = [...bar.querySelectorAll('label, button, .lbl')].map((e) => e.getBoundingClientRect());
  return { barTop: Math.round(b.top), barH: Math.round(b.height), pickBottom: Math.round(p.bottom), pickTop: Math.round(p.top), inside: kids.every((r) => r.left >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1), vis: !bar.hidden, scrollW: document.documentElement.scrollWidth <= innerWidth };
});
// 1. in Otzaria, the defaults
let page = await otzPage(1280, 800, 25);
let g = await geom(page);
ok('bar shown in Otzaria', g.vis, g);
ok('its Otzaria group shown, the update group hidden', await page.evaluate(() => !document.getElementById('uni-bar-otz').hidden && document.getElementById('uni-bar-web').hidden));
ok('the reader button switch on by default', await page.evaluate(() => document.getElementById('set-reader').checked));
ok('the search field switch shown, disabled', await page.evaluate(() => { const c = document.getElementById('set-search'); return c.disabled && c.checked; }));
ok('the houses above the bar', g.pickBottom <= g.barTop, g);
await page.screenshot({ path: path.join(shots, 'otz_1280x800_25.png') });
// 2. the switch writes the storage, and back
const lbl = await page.evaluate(() => { const r = document.querySelector('label[title] .knob').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
await page.mouse.click(lbl[0], lbl[1]);
await sleep(300);
ok('a click hides: storage.set(tm.ui.readerButton, false)', JSON.stringify(await page.evaluate(() => window.__sets)) === JSON.stringify([['tm.ui.readerButton', false]]), await page.evaluate(() => window.__sets));
await page.screenshot({ path: path.join(shots, 'otz_off.png') });
await page.mouse.click(lbl[0], lbl[1]);
await sleep(300);
ok('a second click shows: storage.set(tm.ui.readerButton, true)', JSON.stringify(await page.evaluate(() => window.__sets.slice(-1))) === JSON.stringify([['tm.ui.readerButton', true]]));
await page.close();
// 3. a stored "off" is read back
page = await otzPage(1280, 800, 25, { 'tm.ui.readerButton': false });
ok('a stored off shows the switch off', await page.evaluate(() => !document.getElementById('set-reader').checked));
await page.close();
// 4. sizes: the bar holds its line(s), the houses stay above it, no sideways scroll
for (const [w, h, f] of [[1280, 800, 16], [1280, 800, 36], [900, 600, 25], [800, 500, 36], [420, 820, 25], [360, 640, 36]]) {
  page = await otzPage(w, h, f);
  g = await geom(page);
  ok(`size ${w}x${h} font ${f}: inside, houses above, no sideways scroll`, g.inside && g.pickBottom <= g.barTop + 1 && g.scrollW, g);
  await page.screenshot({ path: path.join(shots, `otz_${w}x${h}_${f}.png`) });
  await page.close();
}
// 5. the one-file HTML: the update button in the bar, none in the houses
page = await browser.newPage();
page.on('pageerror', (e) => errors.push(String(e.message || e).slice(0, 200)));
await page.setViewport({ width: 1280, height: 800 });
await page.evaluateOnNewDocument(() => { try { localStorage.setItem('tm.unified.note', '1'); localStorage.setItem('tm1.news.seen', '9.9.9'); localStorage.setItem('tm2.news.seen', '9.9.9'); } catch (_) {} });
await page.goto(pathToFileURL(standalone).href, { waitUntil: 'load' });
await sleep(1500);
ok('one file: the bar shows the update group only', await page.evaluate(() => !document.getElementById('uni-bar').hidden && document.getElementById('uni-bar-otz').hidden && !document.getElementById('uni-bar-web').hidden));
ok('one file: the button "בדיקת עדכונים" in the bar', await page.evaluate(() => { const b = document.getElementById('tm-upd'); return !!b && b.textContent === 'בדיקת עדכונים' && !!b.closest('#uni-bar'); }));
await page.screenshot({ path: path.join(shots, 'web_bar.png') });
await page.evaluate(() => document.getElementById('tm-upd').click());
await sleep(4000);
const out = await page.evaluate(() => document.querySelector('#uni-bar .out').textContent);
ok('one file: a click answers in the bar', /בודק|העדכנית|יש גרסה חדשה|הבדיקה לא הצליחה/.test(out), out);
await page.screenshot({ path: path.join(shots, 'web_bar_clicked.png') });
await page.evaluate(() => window.__tmShell.show('sheni'));
let fr = null;
for (let i = 0; i < 120 && !fr; i++) { await sleep(1000); fr = page.frames().find((f) => /tm-house:sheni/.test(f.name())); if (fr) { try { if (!(await fr.evaluate(() => document.documentElement.classList.contains('tm-ready')))) fr = null; } catch (_) { fr = null; } } }
ok('one file: no update button in the house menu', fr && await fr.evaluate(() => !document.getElementById('tm-upd')));
ok('no page errors', errors.length === 0, errors);
console.log(res.every(Boolean) ? 'all ' + res.length + ' passed' : (res.filter((x) => !x).length + ' failed'));
await browser.close();
