// The morning service's lamps (sheni): the priest's hand at the lamp he dresses, at the presentation's own view of the stage, and a
// closer look; and the sound kit's state. node lampscheck.mjs <dist plugin dir> <out dir>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');
const [dir0, out] = process.argv.slice(2); const dir = path.resolve(dir0); fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => { const p = decodeURIComponent(req.url.split('?')[0]); const f = path.join(dir, p); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8' }); fs.createReadStream(f).pipe(res); }).listen(8813, '127.0.0.1');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, protocolTimeout: 900000, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--lang=he'] });
const log = [];
try {
  const pg = await b.newPage(); await pg.setViewport({ width: 1000, height: 640 });
  const errs = []; pg.on('pageerror', (e) => errs.push(String(e.message || e).slice(0, 200)));
  await pg.evaluateOnNewDocument(() => { try { localStorage.setItem('tm1.news.seen', '1.4.9'); localStorage.setItem('tm2.news.seen', '2.0.10'); } catch (_) {} });
  await pg.goto('http://127.0.0.1:8813/sheni/index.html');
  await pg.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 500 });
  await sleep(1500);
  log.push(['sound kit', await pg.evaluate(() => { const S = window.__TM_CTX.shared; return { sfx: typeof S.sfx, play: typeof (S.sfx && S.sfx.play), loop: typeof S.sfxLoop, cut: typeof S.sfxCut }; })]);
  const info = await pg.evaluate(() => {
    for (const id of ['tm-news', 'tm-help', 'tm-panel', 'tm-xcard', 'tm-card']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; }
    const T = window.__TM_CTX.shared.tamid; T.begin(); const L = T.list();
    return { i5: L.indexOf('lamps5'), i2: L.indexOf('lamps2') };
  });
  for (const [i, sec, name] of [[info.i5, 8.9, 'lamps5-a'], [info.i5, 14.1, 'lamps5-b'], [info.i2, 8.0, 'lamps2']]) {
    for (const [k, side] of [["-n", 1], ["-s", -1]]) {
      const st = await pg.evaluate((i, sec, side) => {
        const c = window.__TM_CTX, T = c.shared.tamid; { const nw = document.getElementById('tm-news'); if (nw) nw.remove(); }
        T.seek(i, sec);
        const f = T.figAt('s4'), m = c.shared.menorah;
        const q = m && m.flamePos ? m.flamePos[f.lamp] : null;
        if (!q) return { err: 'no flamePos', keys: m ? Object.keys(m).slice(0, 30) : null };
        const dx = q[0] - f.x, dz = q[2] - f.z, L = Math.hypot(dx, dz) || 1, nx = -dz / L * side, nz = dx / L * side;
        const tg = [q[0] - dx / L * 0.25, q[1] + 0.1, q[2] - dz / L * 0.25], e = [tg[0] + nx * 3.4 + dx / L * 0.8, tg[1] + 0.7, tg[2] + nz * 3.4 + dz / L * 0.8];
        c.camera.position.set(e[0], e[1], e[2]); c.controls.target.set(tg[0], tg[1], tg[2]); c.camera.lookAt(tg[0], tg[1], tg[2]);
        T.seek(i, sec);
        return { pose: f.pose, lamp: f.lamp, flame: q.map((v) => +v.toFixed(2)), fig: [f.x, f.y, f.z].map((v) => +(+v).toFixed(2)) };
      }, i, sec, side);
      await sleep(2600);
      await pg.screenshot({ path: path.join(out, name + k + '.jpg'), type: 'jpeg', quality: 82 });
      log.push([name + k, st]);
    }
  }
  log.push(['errors', errs]);
} finally { await b.close(); server.close(); }
console.log(JSON.stringify(log));
