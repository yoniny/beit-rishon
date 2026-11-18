// Focused before/after checks of the CAM_219 camera fixes, in headless Chrome (software WebGL).
//   node camtest.mjs <plugin dir: the unified plugin folder> <rishon|sheni> <out dir> [port]
// T1 a steep-down look drag inside a roofed space, then release: the eye must not jump after the release
// T2 a long flight: the eye and the target must stay on their straight lines (no clamp on the way)
// T3 a press on the model during a flight: the flight must stop there
// T4 the + key down to minDistance at a vessel: the near plane must stay in front of the target
// T5 walk mode toward higher floors: the eye keeps its height over the floor under it
// T7 a two-finger touch pinch inside a roofed space: a zoom, not a turn
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');

const [pluginDir0, house, outDir, port0] = process.argv.slice(2);
const pluginDir = path.resolve(pluginDir0), port = +(port0 || 8791);
fs.mkdirSync(outDir, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(pluginDir, p);
  if (!f.startsWith(pluginDir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
}).listen(port, '127.0.0.1');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const W = 480, H = 300;
const out = { house, plugin: pluginDir, tests: {}, errors: [] };
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome', headless: true, timeout: 120000, protocolTimeout: 600000,
  args: ['--no-sandbox', '--no-proxy-server', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist', '--no-first-run', '--disable-background-networking', '--disable-sync', '--lang=he']
});
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(300000);
  page.on('pageerror', (e) => out.errors.push(String(e && e.message || e).slice(0, 200)));
  await page.evaluateOnNewDocument(() => { try { for (const k of ['tm1.news.seen', 'tm2.news.seen']) localStorage.setItem(k, '99.0.0'); } catch (_) {} });
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:' + port + '/' + house + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 500 });
  await sleep(1500);
  await page.evaluate(() => {
    for (const id of ['tm-news', 'tm-help']) { const n = document.getElementById(id); if (n) n.remove(); }
    const p = document.getElementById('tm-panel'); if (p) p.style.display = 'none';
    try { window.__renderer.shadowMap.enabled = false; } catch (_) {}
    // a per-frame sampler (after the app's own frame: registered later, re-registered each frame)
    window.__samp = [];
    const loop = () => {
      const c = window.__TM_CTX;
      if (c && c.camera && c.controls) {
        const p = c.camera.position, q = c.controls.target, d = new c.THREE.Vector3();
        c.camera.getWorldDirection(d);
        window.__samp.push([performance.now(), p.x, p.y, p.z, q.x, q.y, q.z, d.x, d.y, d.z, c.camera.near, (c.camFlying ? (c.camFlying() ? 1 : 0) : -1)]);
        if (window.__samp.length > 4000) window.__samp.splice(0, 2000);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  const st = () => page.evaluate(() => {
    const c = window.__TM_CTX, E = window.__ent360, d = new c.THREE.Vector3();
    c.camera.getWorldDirection(d);
    return { pos: c.camera.position.toArray(), tg: c.controls.target.toArray(), dir: d.toArray(), mode: E.cam.mode, near: c.camera.near,
      dist: c.camera.position.distanceTo(c.controls.target), minPolar: c.controls.minPolarAngle, flying: c.camFlying ? c.camFlying() : null };
  });
  const titles = await page.evaluate(() => window.__TM_CTX.ui.placeTitles());
  out.placeCount = titles.length;
  const findT = (subs) => { for (const s of subs) { const t = titles.find((x) => x.includes(s)); if (t) return t; } return null; };
  const clickPlace = async (t) => {
    await page.evaluate((t) => { const b = window.__TM_CTX.ui.placeButton(t); if (!b) throw new Error('no place ' + t); b.click(); }, t);
    await sleep(300);
    await page.evaluate(() => { const cf = document.getElementById('tm-confirm'); if (cf && cf.style.display === 'flex') { const y = cf.querySelector('.y'); if (y) y.click(); } });
  };
  const settle = async (ms = 4000) => {
    // wait for the flight to land (by the camera standing still), then a little more
    const t0 = Date.now();
    let last = null, still = 0;
    while (Date.now() - t0 < 60000) {
      await sleep(400);
      const s = await st();
      if (last && Math.hypot(s.pos[0] - last.pos[0], s.pos[1] - last.pos[1], s.pos[2] - last.pos[2]) < 0.01 && s.flying !== true) { if (++still >= 2) break; } else still = 0;
      last = s;
    }
    await sleep(ms);
    await page.evaluate(() => { for (const id of ['tm-xcard', 'tm-card', 'tm-panel']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } for (const id of ['tm-news', 'tm-help']) { const e = document.getElementById(id); if (e) e.remove(); } });
  };
  // a point of the canvas itself (nothing over it), near (fx, fy) of the view
  const canvasPt = (fx, fy) => page.evaluate((fx, fy, W, H) => {
    for (let r = 0; r < 12; r++) for (let a = 0; a < 12; a++) {
      const x = Math.round(W * fx + Math.cos(a / 12 * 6.283) * r * 14), y = Math.round(H * fy + Math.sin(a / 12 * 6.283) * r * 10);
      const e = document.elementFromPoint(x, y);
      if (e && e.tagName === 'CANVAS') return [x, y];
    }
    const e = document.elementFromPoint(Math.round(W * fx), Math.round(H * fy));
    window.__lastCover = e ? (e.tagName + '#' + e.id + '.' + String(e.className).slice(0, 30) + ' < ' + (e.parentElement ? e.parentElement.tagName + '#' + e.parentElement.id : '')) : 'none';
    return null;
  }, fx, fy, W, H);
  const shot = async (name) => { const f = path.join(outDir, house + '-' + name + '.jpg'); await page.screenshot({ path: f, type: 'jpeg', quality: 78 }); return f; };
  const samples = (t0) => page.evaluate((t0) => window.__samp.filter((s) => s[0] >= t0), t0);
  const now = () => page.evaluate(() => performance.now());
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const len = (v) => Math.hypot(v[0], v[1], v[2]);
  const segDist = (p, a, b) => { const ab = sub(b, a), ap = sub(p, a), L2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2; const t = L2 > 0 ? Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / L2)) : 0; return len(sub(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t])); };
  const angDeg = (u, v) => Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (len(u) * len(v) || 1)))) * 180 / Math.PI;

  // ---------- T1: steep-down look drag, release ----------
  try {
    const cand = house === 'rishon' ? ['ההיכל — הקודש', 'הקודש', 'ההיכל'] : ['הקודש', 'האולם'];
    let t = null, s0 = null;
    for (const c of titles.filter((x) => cand.some((k) => x.includes(k))).slice(0, 8)) {
      await clickPlace(c);
      await settle(1500);
      s0 = await st();
      if (s0.mode === 'look') { t = c; break; }
    }
    if (!t) throw new Error('no place in mode look among ' + cand.join('/'));
    const pt = await canvasPt(0.36, 0.3);
    if (!pt) throw new Error('no free point of the canvas: ' + await page.evaluate(() => window.__lastCover));
    const [x0, y0] = pt;
    const dirStart = (await st()).dir;
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) { await page.mouse.move(x0, y0 + i * 16); await sleep(80); }
    const sDown = await st();
    const tRel = await now();
    await page.mouse.up();
    await sleep(2200);
    const sAfter = await st();
    const S = await samples(tRel);
    let maxStep = 0;
    for (let i = 1; i < S.length; i++) maxStep = Math.max(maxStep, len(sub(S[i].slice(1, 4), S[i - 1].slice(1, 4))));
    out.tests.T1 = { place: t, at: pt, startDownDeg: +(Math.asin(-dirStart[1]) * 180 / Math.PI).toFixed(1), modeBefore: s0.mode, minPolar: sDown.minPolar, lookDownDeg: +(Math.asin(-sDown.dir[1]) * 180 / Math.PI).toFixed(1),
      eyeJumpAfterRelease: +len(sub(sAfter.pos, sDown.pos)).toFixed(3), viewTurnAfterReleaseDeg: +angDeg(sAfter.dir, sDown.dir).toFixed(2),
      maxFrameStep: +maxStep.toFixed(3), shot: await shot('T1-steep-down') };
  } catch (e) { out.tests.T1 = { error: String(e.message || e).slice(0, 300) }; }

  // ---------- T2: a long flight stays on its line ----------
  try {
    const gen = house === 'rishon' ? findT(['הר הבית והחצר הגדולה', 'הר הבית']) : findT(['הר הבית']);
    const far = house === 'rishon' ? findT(['משמרות השוערים']) : findT(['שערי חולדה', 'שער שושן']);
    const pairs = [];
    for (const [a, b] of [[gen, far], [far, findT(['הים של שלמה', 'הכיור', 'המזבח', 'מזבח'])]]) {
      if (!a || !b) continue;
      await clickPlace(a);
      await settle(1200);
      const sA = await st();
      const t0 = await now();
      await clickPlace(b);
      await settle(800);
      const sB = await st();
      const S = await samples(t0);
      let dEye = 0, dTg = 0;
      for (const s of S) { dEye = Math.max(dEye, segDist(s.slice(1, 4), sA.pos, sB.pos)); dTg = Math.max(dTg, segDist(s.slice(4, 7), sA.tg, sB.tg)); }
      pairs.push({ from: a, to: b, frames: S.length, flightLen: +len(sub(sB.pos, sA.pos)).toFixed(1), maxEyeOffLine: +dEye.toFixed(3), maxTargetOffLine: +dTg.toFixed(3) });
    }
    out.tests.T2 = { pairs, shot: await shot('T2-flight') };
  } catch (e) { out.tests.T2 = { error: String(e.message || e).slice(0, 300) }; }

  // ---------- T3: a press during a flight ----------
  try {
    const a = findT(['הר הבית']), b = house === 'rishon' ? findT(['הים של שלמה', 'יכין ובועז']) : findT(['המזבח', 'ההיכל']);
    await clickPlace(a);
    await settle(1200);
    await page.evaluate((t) => window.__TM_CTX.ui.placeButton(t).click(), b);
    await sleep(500);
    const sMid = await st();
    await page.evaluate(() => { for (const id of ['tm-xcard', 'tm-card', 'tm-panel']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } for (const id of ['tm-news', 'tm-help']) { const e = document.getElementById(id); if (e) e.remove(); } });
    const pt = await canvasPt(0.36, 0.45);
    if (!pt) throw new Error('no free point of the canvas: ' + await page.evaluate(() => window.__lastCover));
    await page.mouse.click(pt[0], pt[1]);
    const sClick = await st();
    await sleep(2500);
    const sLater = await st();
    out.tests.T3 = { from: a, to: b, flyingBeforeClick: sMid.flying, flyingAfterClick: sClick.flying,
      movedAfterClick: +len(sub(sLater.pos, sClick.pos)).toFixed(3), shot: await shot('T3-press-in-flight') };
  } catch (e) { out.tests.T3 = { error: String(e.message || e).slice(0, 300) }; }

  // ---------- T4: + down to minDistance at a vessel ----------
  try {
    const v = house === 'rishon' ? findT(['מנורת משה', 'המנורות', 'מנורה']) : findT(['המנורה', 'מנורה']);
    await clickPlace(v);
    await settle(1500);
    await page.mouse.move(Math.round(W * 0.5), Math.round(H * 0.5));
    await page.evaluate(() => { const c = document.querySelector('canvas'); if (c) c.focus(); document.activeElement && document.activeElement.blur && document.activeElement.blur(); });
    for (let i = 0; i < 70; i++) { await page.keyboard.press('+'); await sleep(25); }
    await sleep(1500);
    const s = await st();
    out.tests.T4 = { place: v, dist: +s.dist.toFixed(3), near: +s.near.toFixed(3), targetBehindNear: s.dist < s.near, shot: await shot('T4-near') };
  } catch (e) { out.tests.T4 = { error: String(e.message || e).slice(0, 300) }; }

  // ---------- T5: walk mode toward higher floors ----------
  try {
    const v = house === 'rishon' ? findT(['יכין ובועז — מבט מפתח האולם', 'יכין ובועז']) : findT(['חמש עשרה המעלות', 'בין האולם ולמזבח']);
    await clickPlace(v);
    await settle(1500);
    await page.evaluate(() => window.__TM_CTX.shared.walkMode.set(true));
    await sleep(800);
    const t0 = await now();
    await page.keyboard.down(house === 'rishon' ? 'ArrowDown' : 'ArrowUp');
    const hs = [];
    for (let i = 0; i < 30; i++) {
      await sleep(450);
      hs.push(await page.evaluate(() => {
        const c = window.__TM_CTX, T = c.THREE, p = c.camera.position, r = new T.Raycaster(new T.Vector3(p.x, p.y + 12, p.z), new T.Vector3(0, -1, 0), 0, 400);
        const h = r.intersectObjects(window.__ent360.solids(false), false);
        // the highest floor at or below the eye (the first hit below the eye's level)
        const under = h.find((x) => x.point.y <= p.y + 0.01);
        return { y: +p.y.toFixed(2), floor: under ? +under.point.y.toFixed(2) : null, x: +p.x.toFixed(1), z: +p.z.toFixed(1) };
      }));
    }
    await page.keyboard.up(house === 'rishon' ? 'ArrowDown' : 'ArrowUp');
    const over = hs.filter((h) => h.floor != null).map((h) => +(h.y - h.floor).toFixed(2));
    const floors = hs.map((h) => h.floor);
    out.tests.T5 = { place: v, path: hs.map((h) => [h.x, h.z, h.y]), heightsOverFloor: over, floors, minOver: Math.min(...over), maxOver: Math.max(...over), shot: await shot('T5-walk') };
    await page.evaluate(() => window.__TM_CTX.shared.walkMode.set(false));
  } catch (e) { out.tests.T5 = { error: String(e.message || e).slice(0, 300) }; }

  // ---------- T7: a two-finger pinch inside a roofed space ----------
  try {
    const cand = house === 'rishon' ? ['ההיכל — הקודש', 'הקודש', 'ההיכל'] : ['הקודש', 'האולם'];
    let t = null;
    for (const c of titles.filter((x) => cand.some((k) => x.includes(k))).slice(0, 8)) {
      await clickPlace(c);
      await settle(1200);
      if ((await st()).mode === 'look') { t = c; break; }
    }
    if (!t) throw new Error('no look place');
    const cdp = await page.target().createCDPSession();
    const tp = (x, y, id) => ({ x, y, id, radiusX: 2, radiusY: 2, force: 1 });
    const s0 = await st();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [tp(220, 150, 1)] });
    await sleep(120);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [tp(226, 151, 1)] });
    await sleep(120);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [tp(226, 151, 1), tp(300, 151, 2)] });
    await sleep(150);
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [tp(226 - i * 8, 151, 1), tp(300 + i * 8, 151, 2)] });
      await sleep(120);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(1800);
    const s1 = await st();
    out.tests.T7 = { place: t, distBefore: +s0.dist.toFixed(2), distAfter: +s1.dist.toFixed(2), eyeMoved: +len(sub(s1.pos, s0.pos)).toFixed(3),
      viewTurnDeg: +angDeg(s1.dir, s0.dir).toFixed(2), shot: await shot('T7-pinch') };
  } catch (e) { out.tests.T7 = { error: String(e.message || e).slice(0, 300) }; }
} catch (e) {
  out.errors.push('FATAL ' + String(e && e.stack || e).slice(0, 400));
} finally {
  fs.writeFileSync(path.join(outDir, house + '-result.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
  server.close();
}
