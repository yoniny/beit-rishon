// Headless test of the unified plugin with a stand-in for Otzaria's SDK in the top frame:
//   node tools/qa-unified.mjs <dist-unified/plugin> [--shots <dir>] [--standalone <the one-file html>]
// Pages are opened as file:// (as Otzaria serves them on Windows: the frames are opaque origins, so only postMessage works).
// Checks: the choice screen; entering each house (boot reaches it with the house's version, the model gets ready); the two bar
// buttons; switching away and back keeps the camera exactly; the hidden house stops drawing; a book button opens its house
// from the choice screen; SDK calls go through; the standalone file runs both houses without Otzaria.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const plugin = path.resolve(argv[0]);
const shots = opt('--shots');
const standalone = opt('--standalone');
if (shots) fs.mkdirSync(shots, { recursive: true });
// the houses' versions, from the shell's configuration
const CFG = JSON.parse(/var CFG = (\{[\s\S]*?\});\n/.exec(fs.readFileSync(path.join(plugin, 'index.html'), 'utf8'))[1]);
const fs_manifest_r = JSON.stringify({ version: CFG.houses.rishon.version });
const fs_manifest_s = JSON.stringify({ version: CFG.houses.sheni.version });
const results = [];
const ok = (name, cond, info) => { results.push({ name, ok: !!cond, info }); console.log((cond ? 'OK   ' : 'FAIL ') + name + (info ? '  ' + JSON.stringify(info) : '')); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, timeout: 60000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist', '--lang=he', '--font-render-hinting=none', '--allow-file-access-from-files', '--no-first-run']
});
const frameOf = (page, house) => page.frames().find((f) => f.name() === 'tm-house:' + house + ':otz' || f.name() === 'tm-house:' + house + ':web');
async function waitReady(page, house, timeout = +(process.env.QA_WAIT || 240000)) {
  const t0 = Date.now();
  for (;;) {
    const f = frameOf(page, house);
    if (f) {
      try { if (await f.evaluate(() => document.documentElement.classList.contains('tm-ready'))) return Date.now() - t0; } catch (_) {}
    }
    if (Date.now() - t0 > timeout) {
      const info = f ? await f.evaluate(() => ({ cls: document.documentElement.className, msg: (document.getElementById('loading-msg') || {}).textContent, fill: (document.getElementById('fill') || {}).style && document.getElementById('fill').style.width })).catch((e) => e.message) : 'no frame';
      const cur = await page.evaluate(() => window.__tmShell && window.__tmShell.current());
      throw new Error(house + ' not ready ' + JSON.stringify({ info, cur }));
    }
    await sleep(500);
  }
}
// a real mouse click on an element inside a house (the frames fill the page, so frame coordinates are page coordinates)
async function clickIn(page, frame, sel) {
  const r = await frame.evaluate((s) => { const b = document.querySelector(s).getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }, sel);
  const top = await frame.evaluate((x, y) => { const e = document.elementFromPoint(x, y); return e ? (e.id || e.tagName) + '.' + e.className : null; }, r[0], r[1]);
  if (process.env.QA_DEBUG) console.log('click', sel, r, top);
  await page.mouse.click(r[0], r[1]);
}
const shot = async (page, name) => { if (shots) await page.screenshot({ path: path.join(shots, name + '.png') }); };

try {
  // ---------------- in "Otzaria" ----------------
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e).slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  await page.setViewport({ width: 1280, height: 800 });
  await page.evaluateOnNewDocument((VERS) => {
    if (window.top !== window) return;            // the SDK exists in the top frame only, as in Otzaria
    try { localStorage.setItem('tm1.news.seen', '9.9.9'); localStorage.setItem('tm2.news.seen', '9.9.9'); } catch (_) {}
    const h = {};
    window.__calls = [];
    window.Otzaria = {
      on(evt, cb) { (h[evt] = h[evt] || []).push(cb); },
      call(method, params) {
        window.__calls.push(method);
        if (method === 'storage.get') return Promise.resolve({ success: true, data: params && params.key === 'tm2.news.seen' ? VERS.sheni : VERS.rishon });   // no "what's new" window in the tests
        if (method === 'test.fail') return Promise.reject(Object.assign(new Error('nope'), { code: 'error.test' }));
        return Promise.resolve({ ok: true, method });
      }
    };
    window.__fire = (evt, p) => (h[evt] || []).forEach((cb) => cb(p));
    window.addEventListener('load', () => setTimeout(() => window.__fire('plugin.boot', {
      plugin: { id: 'com.beit-hamikdash.rishon-3d-model', version: '2.0.0' },
      theme: { mode: 'dark', colorScheme: { primary: '#c9a84c', onPrimary: '#1a1200', surface: '#0a0e1a', onSurface: '#e8e8e8', outline: '#2a2a3a', surfaceContainerHigh: '#171f37' } }
    }), 300));
  }, { rishon: CFG.houses.rishon.version, sheni: CFG.houses.sheni.version });
  await page.goto(pathToFileURL(path.join(plugin, 'index.html')).href, { waitUntil: 'load' });
  await sleep(800);
  ok('choice screen shown, no house loaded yet', await page.evaluate(() => !document.getElementById('home').classList.contains('off') && !document.querySelector('iframe')));
  await shot(page, '01-choice');

  // enter the First Temple
  await page.click('#pick-rishon');
  const msR = await waitReady(page, 'rishon');
  const fr = frameOf(page, 'rishon');
  ok('בית ראשון ready', true, { ms: msR });
  ok('בית ראשון got its own version from boot', (await fr.evaluate(() => document.getElementById('version').textContent)) === 'v' + JSON.parse(fs_manifest_r).version);
  await sleep(1500);
  const btnsR = await fr.evaluate(() => [...document.querySelectorAll('#tm-topbtns > *')].map((b) => b.id || b.textContent.trim()).slice(0, 3));
  ok('בית ראשון: the two buttons first in the bar', btnsR[0] === 'tm-go-other' && btnsR[1] === 'tm-go-home', btnsR);
  // an SDK call through the bridge
  const callRes = await fr.evaluate(() => window.Otzaria.call('reader.open', { x: 1 }).then((r) => r.method));
  ok('SDK call goes through the shell', callRes === 'reader.open');
  const failRes = await fr.evaluate(() => window.Otzaria.call('test.fail').then(() => 'resolved', (e) => e.code));
  ok('SDK error comes back with its code', failRes === 'error.test');
  // move the camera somewhere
  const camR = await fr.evaluate(() => { const c = window.__camera; c.position.set(c.position.x + 7.25, c.position.y + 3.5, c.position.z - 4.75); return c.position.toArray(); });
  await sleep(600);
  const camR1 = await fr.evaluate(() => window.__camera.position.toArray());
  await shot(page, '02-rishon');

  // to the Second Temple by the bar button
  await clickIn(page, fr, '#tm-go-other');
  const msS = await waitReady(page, 'sheni');
  const fs2 = frameOf(page, 'sheni');
  ok('בית שני ready (by the bar button)', true, { ms: msS });
  ok('בית שני got its own version from boot', (await fs2.evaluate(() => document.getElementById('version').textContent)) === 'v' + JSON.parse(fs_manifest_s).version);
  await sleep(1500);
  await shot(page, '03-sheni');
  // the hidden First Temple does not draw
  const frames1 = await fr.evaluate(() => window.__renderer.info.render.frame);
  await sleep(1500);
  const frames2 = await fr.evaluate(() => window.__renderer.info.render.frame);
  ok('the hidden house stops drawing', frames2 - frames1 <= 1, { frames1, frames2 });
  const sFrames1 = await fs2.evaluate(() => window.__renderer.info.render.frame);
  await sleep(1000);
  const sFrames2 = await fs2.evaluate(() => window.__renderer.info.render.frame);
  ok('the shown house draws', sFrames2 > sFrames1, { sFrames1, sFrames2 });

  // back to the First Temple: the same place
  await clickIn(page, fs2, '#tm-go-other');
  await sleep(1200);
  const camR2 = await fr.evaluate(() => window.__camera.position.toArray());
  const same = camR1.every((v, i) => Math.abs(v - camR2[i]) < 1e-6);
  ok('back in בית ראשון at exactly the same place', same, { before: camR1.map((v) => +v.toFixed(3)), after: camR2.map((v) => +v.toFixed(3)) });
  {
    const a = await fr.evaluate(() => window.__renderer.info.render.frame);
    await sleep(4000);
    const b = await fr.evaluate(() => window.__renderer.info.render.frame);
    ok('בית ראשון draws again', b > a, { a, b });
  }

  // the choice screen, then a book button of the Second Temple
  await clickIn(page, fr, '#tm-go-home');
  await sleep(600);
  ok('the bar button returns to the choice screen', await page.evaluate(() => window.__tmShell.current() === 'home' && !document.getElementById('home').classList.contains('off')));
  ok('the choice screen marks the visited houses', await page.evaluate(() => document.getElementById('pick-rishon').classList.contains('visited') && document.getElementById('pick-sheni').classList.contains('visited')));
  await shot(page, '04-choice-again');
  await page.evaluate(() => window.__fire('reader.toolbar_item_clicked', { itemId: 'open-beit-sheni', currentId: 89, currentIndex: 3 }));
  await sleep(800);
  ok('a בית שני book button opens בית שני', await page.evaluate(() => window.__tmShell.current() === 'sheni'));
  await page.evaluate(() => window.__fire('plugin.page_opened', { param: { currentId: 10, currentIndex: 40 } }));
  await sleep(800);
  ok('a page opened from מלכים א opens בית ראשון', await page.evaluate(() => window.__tmShell.current() === 'rishon'));
  ok('no page errors', errors.length === 0, errors.slice(0, 5));
  await page.close();

  // ---------------- the one-file HTML, without Otzaria ----------------
  if (standalone) {
    const p2 = await browser.newPage();
    const err2 = [];
    p2.on('pageerror', (e) => err2.push(String(e.message || e).slice(0, 200)));
    await p2.setViewport({ width: 1280, height: 800 });
    // 12.11.2026: the houses show "מה חדש" unless the seen version IS this version ('9.9.9' never was) - the window opened a second or two
    // after the house was ready, and the click on the bar below sometimes fell on its veil ("rishon not ready ... no frame")
    await p2.evaluateOnNewDocument((v) => { try { localStorage.setItem('tm1.news.seen', v.rishon); localStorage.setItem('tm2.news.seen', v.sheni); } catch (_) {} }, { rishon: CFG.houses.rishon.version, sheni: CFG.houses.sheni.version });
    await p2.goto(pathToFileURL(path.resolve(standalone)).href, { waitUntil: 'load' });
    await sleep(500);
    await p2.click('#pick-sheni');
    const a = await waitReady(p2, 'sheni');
    const s2 = frameOf(p2, 'sheni');
    await sleep(1200);
    ok('one file: בית שני ready', true, { ms: a });
    await clickIn(p2, s2, '#tm-go-other');
    const b = await waitReady(p2, 'rishon');
    ok('one file: בית ראשון ready', true, { ms: b });
    await sleep(1200);
    await shot(p2, '05-file-rishon');
    ok('one file: no page errors', err2.length === 0, err2.slice(0, 5));
    await p2.close();
  }
} finally {
  await browser.close();
}
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? failed + ' FAILED' : 'all ' + results.length + ' passed');
process.exit(failed ? 1 : 0);
