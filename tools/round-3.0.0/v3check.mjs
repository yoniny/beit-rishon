// Round 3.0.0 checks in the browser, on a frozen clock: the High Priest's walk (hei-yk-entry) and the morning service's lamps.
// node v3check.mjs <dist plugin dir> <out dir>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');
const [dir0, out] = process.argv.slice(2); const dir = path.resolve(dir0); fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => { const p = decodeURIComponent(req.url.split('?')[0]); const f = path.join(dir, p); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8' }); fs.createReadStream(f).pipe(res); }).listen(8811, '127.0.0.1');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, protocolTimeout: 900000, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--lang=he'] });
const log = [];
try {
  const pg = await b.newPage(); await pg.setViewport({ width: 1000, height: 640 });
  const errs = []; pg.on('pageerror', (e) => errs.push(String(e.message || e).slice(0, 200)));
  await pg.evaluateOnNewDocument(() => { try { localStorage.setItem('tm1.news.seen', '1.4.9'); localStorage.setItem('tm2.news.seen', '2.0.10'); } catch (_) {} });
  await pg.goto('http://127.0.0.1:8811/sheni/index.html');
  await pg.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 500 });
  await sleep(1500);
  // ---- the High Priest's walk, the default reading (two parochot)
  await pg.evaluate(() => {
    for (const id of ['tm-news', 'tm-help', 'tm-panel', 'tm-xcard', 'tm-card']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; }
    const real = performance.now.bind(performance); window.__fakeT = real(); performance.now = () => window.__fakeT;
    const c = window.__TM_CTX; window.__t0 = window.__fakeT;
    c.shared.modelButtons.find((x) => x.id === 'hei-yk-entry').set(true);
  });
  for (const td of [9.6, 10.6, 11.4, 12.4, 14.0, 17.6, 18.5, 27.0]) {
    const st = await pg.evaluate(async (td) => {
      const c = window.__TM_CTX, w = c.shared.walk;
      { const nw = document.getElementById('tm-news'); if (nw) nw.remove(); }
      let guard = 0;
      while (w.on && w.now() < td - 1e-6 && guard++ < 4000) { window.__fakeT += 0.1 * 1.5 * 1000; for (const fn of c.animated) { try { fn(window.__fakeT); } catch (_) {} } }
      for (const fn of c.animated) { try { fn(window.__fakeT); } catch (_) {} }
      const r = (v) => [+v.x.toFixed(2), +v.y.toFixed(2), +v.z.toFixed(2)];
      return { td: w.on ? +w.now().toFixed(2) : null, eye: r(c.camera.position) };
    }, td);
    await sleep(2500);
    const f = path.join(out, 'hp-' + td.toFixed(1) + '.jpg');
    await pg.screenshot({ path: f, type: 'jpeg', quality: 80 });
    log.push(['hp', td, st]);
  }
  await pg.evaluate(() => { const c = window.__TM_CTX; try { c.shared.modelButtons.find((x) => x.id === 'hei-yk-entry').set(false); } catch (_) {} });
  // ---- the morning service: the lamps' stages (the Rambam's reading of the lamps, the default) - the hand at the lamp, and the caption
  const caps = await pg.evaluate(() => {
    const T = window.__TM_CTX.shared.tamid; T.begin();
    const L = T.list(); const i2 = L.indexOf('lamps2'); const sl = T.slides()[i2];
    return { lamps: T.readings().lamps, caps: sl.caps.slice(0, 3), i5: L.indexOf('lamps5'), i2 };
  });
  log.push(['caps', caps]);
  for (const [i, sec, name] of [[caps.i5, 8.9, 'lamps5-a'], [caps.i5, 14.1, 'lamps5-b'], [caps.i2, 8.0, 'lamps2']]) {
    const st = await pg.evaluate((i, sec) => {
      const c = window.__TM_CTX, T = c.shared.tamid; { const nw = document.getElementById('tm-news'); if (nw) nw.remove(); } T.seek(i, sec);
      const k = T.camAt(i, sec); if (k) { c.camera.position.set(k[0][0], k[0][1], k[0][2]); c.controls.target.set(k[1][0], k[1][1], k[1][2]); c.camera.lookAt(k[1][0], k[1][1], k[1][2]); }
      for (const fn of c.animated) { try { fn(performance.now()); } catch (_) {} }
      T.seek(i, sec);
      return T.figAt('s4');
    }, i, sec);
    await sleep(2500);
    // zoom on the menorah: a second shot with the eye moved 45% of the way to the target
    await pg.screenshot({ path: path.join(out, name + '.jpg'), type: 'jpeg', quality: 80 });
    await pg.evaluate((i, sec) => { const c = window.__TM_CTX, T = c.shared.tamid; const k = T.camAt(i, sec); if (!k) return; const e = k[0].map((v, j) => v + (k[1][j] - v) * 0.5); c.camera.position.set(e[0], e[1], e[2]); c.camera.lookAt(k[1][0], k[1][1], k[1][2]); T.seek(i, sec); }, i, sec);
    await sleep(2500);
    await pg.screenshot({ path: path.join(out, name + '-close.jpg'), type: 'jpeg', quality: 80 });
    log.push([name, st && { pose: st.pose, lamp: st.lamp, x: st.x, z: st.z }]);
  }
  log.push(['errors', errs]);
} finally { await b.close(); server.close(); }
console.log(JSON.stringify(log, null, 1));
