// Shared by the full scan's jobs: opens one house of the built unified plugin through its shell (as the watcher does; the browser pieces of
// /home/claude/split/watch/lib.mjs, the way tools shoot.mjs / probe.mjs open it), frozen clock + __step, the in-page helpers (inpage.js).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, sleep, shellCfg, shellUrl, sdkStub, freezer, READY_HOOK, waitFrameReady, collectConsole } from '/home/claude/split/watch/lib.mjs';
export { sleep };
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const INPAGE = fs.readFileSync(path.join(HERE, 'inpage.js'), 'utf8');

export function parseArgs(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { const k = a.slice(2); const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; o[k] = v; } else o._.push(a);
  }
  return o;
}

// opts: { w, h, frozen (default true), mobile, load: false -> do not wait for ready }
export async function openHouse(plugin, house, opts = {}) {
  const CFG = shellCfg(plugin);
  const VERS = { rishon: CFG.houses.rishon.version, sheni: CFG.houses.sheni.version };
  const browser = await launch();
  const msgs = [];
  const ctxB = await browser.createBrowserContext();
  const page = await ctxB.newPage();
  page.setDefaultTimeout(600000);
  collectConsole(page, msgs);
  const W = opts.w || 480, H = opts.h || 300;
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });   // the size the model is known to start at; made smaller after it is ready
  await page.evaluateOnNewDocument(sdkStub, VERS);
  await page.evaluateOnNewDocument(READY_HOOK);
  const frozen = opts.frozen !== false;
  if (frozen) await page.evaluateOnNewDocument(freezer, 20261121);
  const t0 = Date.now();
  await page.goto(shellUrl(plugin), { waitUntil: 'load' });
  await sleep(500);
  const tShell = Date.now() - t0;
  if (house === 'shell') return { browser, ctxB, page, msgs, W, H, tShell, VERS, CFG, close: async () => { await ctxB.close(); await browser.close(); } };
  await page.click('#pick-' + house);
  const t1 = Date.now();
  const fr = await waitFrameReady(page, house, 200000);
  const tReady = Date.now() - t1;
  await sleep(800);
  await fr.evaluate(() => { const n = document.getElementById('tm-news'); if (n) n.remove(); });
  if (W !== 1280 || H !== 800) { await page.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: !!opts.mobile, hasTouch: !!opts.mobile }); await sleep(300); }
  if (frozen) for (let i = 0; i < 4; i++) { await fr.evaluate(() => window.__step(300)); await sleep(60); }
  await fr.evaluate(INPAGE);
  await fr.evaluate(() => window.__SCAN.refreshSph());
  const S = {
    browser, ctxB, page, fr, msgs, house, W, H, VERS, CFG, tShell, tReady, frozen,
    ev: (fn, arg) => fr.evaluate(fn, arg),
    step: (ms) => fr.evaluate((d) => window.__step(d), ms),
    // fly + animations: big steps (the animation clocks are performance.now based) then small ones for the fade loop
    settle: async (big = 6000, small = 2) => { await fr.evaluate((b) => { window.__step(b); }, big); for (let i = 0; i < small; i++) await fr.evaluate(() => window.__step(120)); },
    errsSince: (n) => msgs.slice(n).filter((m) => m.type === 'error' || m.type === 'pageerror' || m.type === 'requestfailed'),
    warnsSince: (n) => msgs.slice(n).filter((m) => m.type === 'warn'),
    close: async () => { try { await ctxB.close(); } catch (_) {} await browser.close(); }
  };
  return S;
}

// findings -------------------------------------------------------------------------------------------------------------
export class Out {
  constructor(dir, house, cat) { this.dir = dir; this.house = house; this.cat = cat; this.list = []; this.stats = {}; this.extra = {}; this.n = 0; fs.mkdirSync(path.join(dir, 'shots'), { recursive: true }); }
  add(sev, title, detail, extra = {}) {
    const f = { id: `${this.house}-${this.cat}-${String(++this.n).padStart(3, '0')}`, cat: this.cat, house: this.house, sev, title, detail, ...extra };
    this.list.push(f); if (this.n % 3 === 0) this.save(); console.log(`[${sev}] ${this.house}/${this.cat}: ${title} - ${typeof detail === 'string' ? detail.slice(0, 160) : ''}`); return f;
  }
  shot(name, dataUrl) {
    if (!dataUrl) return null;
    const rel = `shots/${this.house}-${this.cat}-${name.replace(/[^\w֐-׿.-]+/g, '_').slice(0, 60)}.jpg`;
    fs.writeFileSync(path.join(this.dir, rel), Buffer.from(dataUrl.split(',')[1], 'base64'));
    return rel;
  }
  save(extra = {}) { fs.writeFileSync(path.join(this.dir, `result-${this.house}-${this.cat}.json`), JSON.stringify({ house: this.house, cat: this.cat, stats: this.stats, findings: this.list, ...this.extra, ...extra }, null, 1)); }
}
export const SEV = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
