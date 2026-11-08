// Headless checks of the camera controller (90-entry.js, 1.2.0): node tools/qa-cam.mjs [--chrome path] [--port 8774]
// For a few fly points: the mode after the flight (orbit / look), then a mouse drag on the canvas - in "orbit" the eye moves round the
// target (the target stays), in "look" the eye stays and the target turns round it. Then the wheel (a dolly), the lift keys, and the
// floor rule (the eye never under the floor of the target). Writes qa/cam-<name>.png and prints a JSON summary; exit 1 on a failed rule.
// 1.2.2: the kk view (14 amot from its target, under CAM_NEAR 18) orbits - a thing in the room; the walk keys (ArrowUp) are checked too.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const chrome = opt('--chrome', process.env.CHROME || '/usr/bin/google-chrome');
const port = +opt('--port', 8774);
const outDir = path.join(root, 'qa');
fs.mkdirSync(outDir, { recursive: true });
const W = 560, H = 360;
const server = spawn('node', [path.join(root, 'tools', 'serve.mjs'), String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 400));
const browser = await puppeteer.launch({
  executablePath: chrome, headless: true, timeout: 60000,
  args: ['--no-sandbox', '--no-proxy-server', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-background-networking', '--disable-sync', '--no-first-run']
});
const out = { errors: [], cases: [] };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  await page.evaluateOnNewDocument((ver) => { try { localStorage.setItem('tm1.news.seen', ver); } catch (_) {} }, JSON.parse(fs.readFileSync(path.join(root, 'plugin', 'manifest.json'), 'utf8')).version);   // no "מה חדש" window during the tests
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => out.errors.push('pageerror: ' + String(e && e.message || e).slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error' && !/404|favicon/.test(m.text())) out.errors.push(m.text().slice(0, 200)); });
  await page.goto('http://127.0.0.1:' + port + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 180000, polling: 500 });
  await page.evaluate(() => { const n = document.getElementById('tm-news'); if (n) n.remove(); const p = document.getElementById('tm-panel'); if (p) p.style.display = 'none'; });
  const state = () => page.evaluate(() => {
    const c = window.__TM_CTX, E = window.__ent360;
    const r = (v) => [+v.x.toFixed(2), +v.y.toFixed(2), +v.z.toFixed(2)];
    return { mode: E.cam.mode, roofed: E.cam.roofed, floorY: +(+E.cam.floorY).toFixed(2), pos: r(c.camera.position), tg: r(c.controls.target), dist: +c.camera.position.distanceTo(c.controls.target).toFixed(2) };
  });
  const fly = async (key) => {
    await page.evaluate((key) => { const c = window.__TM_CTX; let b = c.ui.viewButton(key) || (c.ui.placeButton && c.ui.placeButton(key)); if (!b) b = [...document.querySelectorAll('#tm-panel button')].find((x) => (x.title || x.textContent.trim()) === key); if (b) b.click(); else throw new Error('no button ' + key); }, key);
    await sleep(900);
    await page.evaluate(() => { const cf = document.getElementById('tm-confirm'); if (cf && cf.style.display === 'flex') { const y = cf.querySelector('.y'); if (y) y.click(); } });
    await sleep(2300);
    await page.evaluate(() => { for (const id of ['tm-xcard', 'tm-panel']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } });
  };
  const dist3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const drag = async (dx, dy) => {
    const x0 = Math.round(W * 0.36), y0 = Math.round(H * 0.62);   // off the centre: an on-model pill may stand there
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    const n = 6;
    for (let i = 1; i <= n; i++) { await page.mouse.move(x0 + dx * i / n, y0 + dy * i / n); await sleep(60); }
    await page.mouse.up();
    await sleep(1400);
  };
  for (const [name, key, expect] of [['general', '__general', 'orbit'], ['kodesh', 'kodesh', 'look'], ['menorot', 'מנורת משה ועשר המנורות', 'orbit'], ['kk', 'קודש הקדשים — הדביר', 'orbit'], ['forest', 'פנים בית יער הלבנון — המגינים, הצינות והכלים', 'look']]) {
    const c = { name, key, expect };
    try {
      await fly(key);
      c.after = await state();
      const a = c.after;
      await drag(140, 0);
      c.drag = await state();
      c.eyeMoved = +dist3(a.pos, c.drag.pos).toFixed(2);
      c.targetMoved = +dist3(a.tg, c.drag.tg).toFixed(2);
      c.ok = a.mode === expect && (a.mode === 'look' ? c.eyeMoved < 0.05 && c.targetMoved > 1 : c.eyeMoved > 0.5 && c.targetMoved < 0.05);
      if (a.mode === 'orbit') {
        // the floor rule: drag far down - the eye stays over the floor of the target
        await drag(0, 260);
        c.down = await state();
        c.floorOk = !(isFinite(c.down.floorY)) || c.down.pos[1] >= c.down.floorY + 0.3;
        c.ok = c.ok && c.floorOk;
      }
      await page.screenshot({ path: path.join(outDir, 'cam-' + name + '.png') });
    } catch (e) {
      c.error = String(e && e.message || e).slice(0, 200);
      c.ok = false;
    }
    out.cases.push(c);
    console.log('[case] ' + JSON.stringify(c));
  }
  // the wheel: a dolly in "look" walks toward the target (the distance shrinks), then the mode flips to "orbit" near it
  try {
    await fly('kodesh');
    const a = await state();
    await page.mouse.move(W / 2, H / 2);
    await page.evaluate(() => { const el = window.__TM_CTX.renderer.domElement; for (let i = 0; i < 12; i++) el.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, deltaMode: 0, bubbles: true, cancelable: true, clientX: 200, clientY: 150 })); });
    await sleep(1500);
    const b = await state();
    out.wheel = { before: a.dist, after: b.dist, modeAfter: b.mode, ok: b.dist < a.dist - 1 };
  } catch (e) {
    out.wheel = { error: String(e && e.message || e).slice(0, 200), ok: false };
  }
  // the lift keys
  try {
    const a = await state();
    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true, cancelable: true })); });
    await sleep(2500);   // software GL draws few frames a second: a long hold
    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keyup', { key: 'PageUp', bubbles: true, cancelable: true })); });
    await sleep(900);
    const b = await state();
    out.lift = { before: a.pos[1], after: b.pos[1], ok: b.pos[1] > a.pos[1] + 0.1 };   // (software GL: a few frames in the hold)
  } catch (e) {
    out.lift = { error: String(e && e.message || e).slice(0, 200), ok: false };
  }
  // 1.2.2 (the user's recording: the eye left the heichal through its north wall while orbiting the menorot): in the default mode
  // ("סיבוב בתוך הבית בלבד") the eye stays INSIDE the heichal - x -43.5..2.5, |z| < 10, y 12..42 - through long drags in four
  // directions and a wheel out; cam_keepInside needs the walls marked userData.tmPass (70-ui.js hideList, now in every mode)
  try {
    await fly('מנורת משה ועשר המנורות');
    const inside = (p) => p[0] > -43.5 && p[0] < 2.5 && Math.abs(p[2]) < 10 && p[1] > 12 && p[1] < 42;
    const steps = [];
    for (const [dx, dy] of [[260, 0], [260, 0], [-260, 0], [0, -200], [0, 200], [200, 120]]) {
      await drag(dx, dy);
      const st = await state();
      steps.push({ dx, dy, pos: st.pos, inside: inside(st.pos), mode: st.mode });
    }
    await page.mouse.move(W / 2, H / 2);
    await page.evaluate(() => { const el = window.__TM_CTX.renderer.domElement; for (let i = 0; i < 20; i++) el.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, deltaMode: 0, bubbles: true, cancelable: true, clientX: 200, clientY: 150 })); });
    await sleep(2000);
    const st = await state();
    steps.push({ wheelOut: true, pos: st.pos, inside: inside(st.pos), mode: st.mode });
    out.room = { steps, ok: steps.every((x) => x.inside) };
    await page.screenshot({ path: path.join(outDir, 'cam-room.png') });
  } catch (e) {
    out.room = { error: String(e && e.message || e).slice(0, 200), ok: false };
  }
  // 1.2.2: the walk keys - ArrowUp moves the eye AND the target along the view's horizontal direction (the height stays)
  try {
    const a = await state();
    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })); });
    await sleep(2500);
    await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp', bubbles: true, cancelable: true })); });
    await sleep(900);
    const b = await state();
    const dx = b.pos[0] - a.pos[0], dz = b.pos[2] - a.pos[2], tx = b.tg[0] - a.tg[0], tz = b.tg[2] - a.tg[2];
    const moved = Math.hypot(dx, dz), together = Math.hypot(dx - tx, dz - tz) < 0.05 * Math.max(1, moved);
    out.walk = { moved: +moved.toFixed(2), dy: +(b.pos[1] - a.pos[1]).toFixed(2), together, ok: moved > 0.2 && together && Math.abs(b.pos[1] - a.pos[1]) < 0.3 };
  } catch (e) {
    out.walk = { error: String(e && e.message || e).slice(0, 200), ok: false };
  }
} finally {
  await browser.close();
  server.kill();
}
fs.writeFileSync(path.join(outDir, 'cam-report.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(JSON.stringify(out, null, 1));
const bad = out.errors.length || out.cases.some((c) => !c.ok) || !(out.wheel && out.wheel.ok) || !(out.lift && out.lift.ok) || !(out.walk && out.walk.ok) || !(out.room && out.room.ok);
process.exit(bad ? 1 : 0);
