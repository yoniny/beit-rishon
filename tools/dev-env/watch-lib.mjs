// Shared helpers of the watcher's browser scripts (views.mjs, loadtime.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire('/home/claude/split/base/package.json');
export const puppeteer = require('puppeteer-core');
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const CHROME_ARGS = ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist', '--lang=he', '--font-render-hinting=none', '--allow-file-access-from-files', '--no-first-run',
  '--disable-background-networking', '--disable-sync', '--disable-features=CodeCacheForJavaScript', '--mute-audio',
  '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows'];

export async function launch() {
  return puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, timeout: 120000,
    protocolTimeout: 900000, args: CHROME_ARGS });
}

// the houses' versions, from the shell's configuration (as tools/qa-unified.mjs reads them)
export function shellCfg(plugin) {
  return JSON.parse(/var CFG = (\{[\s\S]*?\});\n/.exec(fs.readFileSync(path.join(plugin, 'index.html'), 'utf8'))[1]);
}
export const shellUrl = (plugin) => pathToFileURL(path.join(plugin, 'index.html')).href;

// The Otzaria SDK stand-in, in the top frame only (as tools/qa-unified.mjs): boot 300 ms after load, "what's new" already seen.
export function sdkStub(VERS) {
  if (window.top !== window) return;
  try { localStorage.setItem('tm1.news.seen', VERS.rishon); localStorage.setItem('tm2.news.seen', VERS.sheni); } catch (_) {}
  const h = {};
  window.Otzaria = {
    on(evt, cb) { (h[evt] = h[evt] || []).push(cb); },
    off() {},
    call(method, params) {
      if (method === 'storage.get') return Promise.resolve({ success: true, data: params && params.key === 'tm2.news.seen' ? VERS.sheni : params && params.key === 'tm1.news.seen' ? VERS.rishon : null });
      return Promise.resolve({ ok: true, method });
    }
  };
  window.__fire = (evt, p) => (h[evt] || []).forEach((cb) => cb(p));
  window.addEventListener('load', () => setTimeout(() => window.__fire('plugin.boot', {
    plugin: { id: 'com.beit-hamikdash.rishon-3d-model', version: '3.0.6' },
    theme: { mode: 'dark', colorScheme: { primary: '#c9a84c', onPrimary: '#1a1200', surface: '#0a0e1a', onSurface: '#e8e8e8', outline: '#2a2a3a', surfaceContainerHigh: '#171f37' } }
  }), 300));
}

// The moment html.tm-ready is set, caught synchronously: DOMTokenList.prototype.add is wrapped (an iframe that navigates from its first
// about:blank keeps the same window - same origin under file:// - so an observer on the first document would miss the real one).
// (a function source for evaluateOnNewDocument; it calls window.__onTmReady[] when the class is set)
function readyHook() {
  if (window.__tmHook) return;
  window.__tmHook = true;
  window.__onTmReady = window.__onTmReady || [];
  const origAdd = DOMTokenList.prototype.add;
  DOMTokenList.prototype.add = function (...a) {
    const r = origAdd.apply(this, a);
    try { if (a.indexOf('tm-ready') >= 0 && document.documentElement && this === document.documentElement.classList) for (const f of window.__onTmReady) f(); } catch (_) {}
    return r;
  };
}
export const READY_HOOK = '(' + readyHook.toString() + ')();';

// In every frame: the moment html.tm-ready appears (performance.now() of the frame), for the load-time runs.
export function readyProbe() {
  window.__wReady = null;
  (window.__onTmReady = window.__onTmReady || []).push(() => { if (window.__wReady == null) window.__wReady = performance.now(); });
}

// In every frame, for the views: a fixed date, a seeded Math.random, and - from the moment html.tm-ready is set - a frozen clock:
// performance.now() stands still and requestAnimationFrame callbacks wait in a queue; window.__step(dt) advances the clock by dt and
// runs the queued frames (the model's own animation loop: flights, animations, the render). Math.random is seeded again at that moment.
export function freezer(SEED) {
  const mulberry = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  if (window.__freezerOn) return;
  window.__freezerOn = true;
  let rnd = mulberry(SEED);
  Math.random = () => rnd();
  const RealDate = Date, FIXED = 1763366400000;   // 2026-11-17 08:00 UTC (a Tuesday)
  class FDate extends RealDate { constructor(...a) { if (a.length === 0) super(FIXED); else super(...a); } static now() { return FIXED; } }
  FDate.parse = RealDate.parse; FDate.UTC = RealDate.UTC;
  window.Date = FDate;
  const realNow = performance.now.bind(performance);
  const realRAF = window.requestAnimationFrame.bind(window);
  let frozen = false, vt = 0, queue = [], nid = 1e7;
  performance.now = () => (frozen ? vt : realNow());
  const isReady = () => { try { return document.documentElement.classList.contains('tm-ready'); } catch (_) { return false; } };
  // the virtual clock starts at the same value in every run (periodic animations depend on the absolute time), far after any real time
  const freeze = () => { if (frozen) return; frozen = true; vt = 1e6; rnd = mulberry(SEED + 1); window.__frozenAt = realNow(); };
  window.requestAnimationFrame = (cb) => {
    if (!frozen && isReady()) freeze();
    if (frozen) { queue.push(cb); return ++nid; }
    return realRAF((ts) => { if (!frozen && isReady()) freeze(); if (frozen) queue.push(cb); else cb(ts); });
  };
  (window.__onTmReady = window.__onTmReady || []).push(freeze);
  window.__step = (dt) => { vt += dt; const q = queue; queue = []; for (const cb of q) { try { cb(vt); } catch (e) { console.error('step: ' + (e && e.message)); } } return q.length; };
  window.__isFrozen = () => frozen;
}

export const frameOf = (page, house) => page.frames().find((f) => f.name() === 'tm-house:' + house + ':otz' || f.name() === 'tm-house:' + house + ':web');

export async function waitFrameReady(page, house, timeout = 300000) {
  const t0 = Date.now();
  for (;;) {
    const f = frameOf(page, house);
    if (f) { try { if (await f.evaluate(() => document.documentElement.classList.contains('tm-ready'))) return f; } catch (_) {} }
    if (Date.now() - t0 > timeout) throw new Error(house + ': not ready after ' + timeout + ' ms');
    await sleep(100);
  }
}

// console messages: errors, warnings and page errors of every frame; numbers and GL addresses are normalised for comparison
export function collectConsole(page, list) {
  page.on('console', (m) => { const t = m.type(); if (t === 'error' || t === 'warn' || t === 'warning') list.push({ type: t === 'warning' ? 'warn' : t, text: m.text().slice(0, 400) }); });
  page.on('pageerror', (e) => list.push({ type: 'pageerror', text: String((e && e.message) || e).slice(0, 400) }));
  page.on('requestfailed', (r) => list.push({ type: 'requestfailed', text: r.url().slice(-160) + ' ' + ((r.failure() || {}).errorText || '') }));
}
export const normMsg = (s) => s.replace(/0x[0-9a-f]+/gi, '0x?').replace(/\d+(\.\d+)?/g, '#').replace(/\s+/g, ' ').trim();
