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
  executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, timeout: 60000, protocolTimeout: 240000,
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
// Observe the browser's RAF before the house bridge wraps it. These counters never
// request an extra frame or render: a failure must distinguish browser starvation,
// a visibility gate, context loss and a callback that itself takes a long time.
async function installFrameProbe(page) {
  await page.evaluateOnNewDocument(() => {
    const nativeRaf = window.requestAnimationFrame.bind(window);
    const nativeCancel = window.cancelAnimationFrame.bind(window);
    const pending = new Map();
    const stats = { requested: 0, delivered: 0, cancelled: 0, callbackMs: 0, maxCallbackMs: 0, lastDeliveryAt: null, events: [] };
    const event = (type, detail = {}) => {
      stats.events.push({ type, at: Math.round(performance.now()), hidden: document.hidden, houseVisible: window.__tmHouseVisible ?? null, ...detail });
      if (stats.events.length > 24) stats.events.shift();
    };
    window.requestAnimationFrame = function (cb) {
      stats.requested++;
      const id = nativeRaf(function (t) {
        pending.delete(id);
        stats.delivered++;
        const start = performance.now();
        stats.lastDeliveryAt = start;
        try { return cb.call(window, t); }
        finally {
          const ms = performance.now() - start;
          stats.callbackMs += ms;
          stats.maxCallbackMs = Math.max(stats.maxCallbackMs, ms);
        }
      });
      pending.set(id, performance.now());
      return id;
    };
    window.cancelAnimationFrame = function (id) {
      if (pending.delete(id)) stats.cancelled++;
      return nativeCancel(id);
    };
    window.__qaFrameProbe = () => ({ ...stats, pending: pending.size,
      oldestPendingMs: pending.size ? Math.round(performance.now() - Math.min(...pending.values())) : null,
      lastDeliveryAgoMs: stats.lastDeliveryAt == null ? null : Math.round(performance.now() - stats.lastDeliveryAt) });
    document.addEventListener('visibilitychange', () => event('visibilitychange'));
    window.addEventListener('message', (e) => {
      if (e.source === window.parent && e.data?.tm === 'visible') {
        event('bridge-visible', { visible: e.data.visible });
        setTimeout(() => event('bridge-applied', { visible: e.data.visible }), 0);
      }
    });
    for (const type of ['webglcontextlost', 'webglcontextrestored', 'webglcontextcreationerror']) {
      window.addEventListener(type, (e) => event(type, { status: e.statusMessage || null }), true);
    }
    event('installed');
  });
}
async function frameState(frame) {
  return frame.evaluate(() => {
    const r = window.__renderer, canvas = r?.domElement, rect = canvas?.getBoundingClientRect();
    return { name: window.name, hidden: document.hidden, visibility: document.visibilityState, focus: document.hasFocus(),
      houseVisible: window.__tmHouseVisible ?? null, ready: document.documentElement.classList.contains('tm-ready'),
      frame: r?.info.render.frame ?? null, contextLost: r ? r.getContext().isContextLost() : null,
      canvas: rect ? { width: rect.width, height: rect.height, visibility: getComputedStyle(canvas).visibility } : null,
      firstVisibleFrame: window.__loadTimes?.find(r => r.step === 'first visible frame') ?? null,
      loadTimes: window.__loadTimes ?? null, raf: window.__qaFrameProbe?.() ?? null };
  });
}
async function frameSnapshot(page, phase) {
  const shell = await page.evaluate(() => ({ hidden: document.hidden, visibility: document.visibilityState,
    current: window.__tmShell?.current(), frames: [...document.querySelectorAll('iframe.house-frame')].map(f => {
      const s = getComputedStyle(f), r = f.getBoundingClientRect();
      return { name: f.name, shown: f.classList.contains('on'), visibility: s.visibility, opacity: s.opacity, width: r.width, height: r.height };
    }) }));
  const houses = {};
  for (const h of ['rishon', 'sheni']) {
    const f = frameOf(page, h);
    if (f) houses[h] = await frameState(f);
  }
  const state = { phase, shell, houses };
  console.log('[frame-state] ' + JSON.stringify(state));
  return state;
}
async function assertForeground(page, house, phase) {
  const state = await frameSnapshot(page, phase);
  const active = state.houses[house];
  ok(phase + ': top page and active house are visible', !state.shell.hidden && !active.hidden && active.houseVisible === true,
    { topHidden: state.shell.hidden, houseHidden: active.hidden, houseVisible: active.houseVisible, current: state.shell.current });
}
async function assertDrawing(page, frame, name, before) {
  const a = before ?? await frame.evaluate(() => window.__renderer.info.render.frame);
  const started = Date.now(), timeout = +(process.env.QA_FRAME_WAIT || 30000);
  let b = await frame.evaluate(() => window.__renderer.info.render.frame);
  // CDP polling remains usable if RAF has stopped. SwiftShader is not subject to
  // a one-second FPS budget, but a permanently stopped loop still fails.
  while (b <= a && Date.now() - started < timeout) {
    await sleep(250);
    b = await frame.evaluate(() => window.__renderer.info.render.frame);
  }
  const state = await frameState(frame);
  const draws = b > a && !state.hidden && state.houseVisible === true && !state.contextLost;
  ok(name, draws, { before: a, after: b, waitMs: Date.now() - started, hidden: state.hidden, houseVisible: state.houseVisible,
    contextLost: state.contextLost, firstVisibleFrame: state.firstVisibleFrame, raf: state.raf });
  if (!draws) await frameSnapshot(page, 'FAILED: ' + name);
}
async function dismissWelcome(page) {
  // The shell now has its own first-visit note/news, above the house buttons.
  // Use their real controls; a coordinate click on a covered picker never enters a house.
  for (const [dialog, button] of [['#uni-note', '#uni-note-ok'], ['#news', '#news-close']]) {
    if (await page.$eval(dialog, e => !e.hidden)) { await page.click(button); await sleep(650); }
  }
}

try {
  // ---------------- in "Otzaria" ----------------
  const page = await browser.newPage();
  await installFrameProbe(page);
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
  await frameSnapshot(page, 'plugin before initial foreground');
  await page.bringToFront();
  await sleep(800);
  ok('the plugin starts in a foreground document', await page.evaluate(() => !document.hidden));
  ok('choice screen shown, no house loaded yet', await page.evaluate(() => !document.getElementById('home').classList.contains('off') && !document.querySelector('iframe')));
  await shot(page, '01-choice');
  await dismissWelcome(page);

  // enter the First Temple
  await page.click('#pick-rishon');
  const msR = await waitReady(page, 'rishon');
  const fr = frameOf(page, 'rishon');
  ok('בית ראשון ready', true, { ms: msR });
  ok('בית ראשון got its own version from boot', (await fr.evaluate(() => document.getElementById('version').textContent)) === 'v' + JSON.parse(fs_manifest_r).version);
  await assertForeground(page, 'rishon', 'first house ready');
  await assertDrawing(page, fr, 'the first house starts drawing');
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
  await assertForeground(page, 'sheni', 'second house ready');
  await sleep(1500);
  await shot(page, '03-sheni');
  await frameSnapshot(page, 'after second-house screenshot');
  // the hidden First Temple does not draw
  const frames1 = await fr.evaluate(() => window.__renderer.info.render.frame);
  await sleep(1500);
  const frames2 = await fr.evaluate(() => window.__renderer.info.render.frame);
  ok('the hidden house stops drawing', frames2 - frames1 <= 1, { frames1, frames2 });
  await assertDrawing(page, fs2, 'the shown house draws');

  // CSS-hiding a house and backgrounding the whole document are different browser states.
  // The former RAF wrapper must not be bypassed by a document.hidden timer in the latter.
  const cover = await browser.newPage();
  await cover.goto('about:blank');
  await cover.bringToFront();
  await sleep(600);
  ok('the plugin document becomes hidden in the background', await page.evaluate(() => document.hidden));
  const bgBefore = await Promise.all([fr, fs2].map(f => f.evaluate(() => window.__renderer.info.render.frame)));
  await sleep(1800);
  const bgAfter = await Promise.all([fr, fs2].map(f => f.evaluate(() => window.__renderer.info.render.frame)));
  ok('both loaded houses stop drawing in a background document', bgAfter.every((n, i) => n === bgBefore[i]), { before: bgBefore, after: bgAfter });
  await cover.close();
  await page.bringToFront();
  await assertForeground(page, 'sheni', 'return from background');
  await assertDrawing(page, fs2, 'the active house resumes after backgrounding', bgAfter[1]);

  // back to the First Temple: the same place
  await clickIn(page, fs2, '#tm-go-other');
  await sleep(1200);
  const camR2 = await fr.evaluate(() => window.__camera.position.toArray());
  const same = camR1.every((v, i) => Math.abs(v - camR2[i]) < 1e-6);
  ok('back in בית ראשון at exactly the same place', same, { before: camR1.map((v) => +v.toFixed(3)), after: camR2.map((v) => +v.toFixed(3)) });
  await assertForeground(page, 'rishon', 'switch back to first house');
  await assertDrawing(page, fr, 'בית ראשון draws again');

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
    await installFrameProbe(p2);
    const err2 = [];
    p2.on('pageerror', (e) => err2.push(String(e.message || e).slice(0, 200)));
    await p2.setViewport({ width: 1280, height: 800 });
    // 12.11.2026: the houses show "מה חדש" unless the seen version IS this version ('9.9.9' never was) - the window opened a second or two
    // after the house was ready, and the click on the bar below sometimes fell on its veil ("rishon not ready ... no frame")
    await p2.evaluateOnNewDocument((v) => { try { localStorage.setItem('tm1.news.seen', v.rishon); localStorage.setItem('tm2.news.seen', v.sheni); } catch (_) {} }, { rishon: CFG.houses.rishon.version, sheni: CFG.houses.sheni.version });
    await p2.goto(pathToFileURL(path.resolve(standalone)).href, { waitUntil: 'load' });
    await frameSnapshot(p2, 'one file: before initial foreground');
    await p2.bringToFront();
    await sleep(500);
    ok('one file: starts in a foreground document', await p2.evaluate(() => !document.hidden));
    await dismissWelcome(p2);
    await p2.click('#pick-sheni');
    const a = await waitReady(p2, 'sheni');
    const s2 = frameOf(p2, 'sheni');
    await sleep(1200);
    ok('one file: בית שני ready', true, { ms: a });
    await assertForeground(p2, 'sheni', 'one file: second house ready');
    await assertDrawing(p2, s2, 'one file: second house draws');
    await clickIn(p2, s2, '#tm-go-other');
    const b = await waitReady(p2, 'rishon');
    ok('one file: בית ראשון ready', true, { ms: b });
    await assertForeground(p2, 'rishon', 'one file: first house ready');
    await assertDrawing(p2, frameOf(p2, 'rishon'), 'one file: first house draws');
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
