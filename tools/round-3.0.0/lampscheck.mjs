// The morning service's lamps (sheni): the priest's hand at the lamp he dresses, at the presentation's own view of the stage, and a
// closer look; and the sound kit's state. node lampscheck.mjs <dist plugin dir> <out dir>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');
const [dir0, out] = process.argv.slice(2); const dir = path.resolve(dir0); fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => { const p = decodeURIComponent(req.url.split('?')[0]); const f = path.join(dir, p); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8' }); fs.createReadStream(f).pipe(res); }).listen(8812, '127.0.0.1');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, protocolTimeout: 900000, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--lang=he'] });
const log = [];
try {
  const pg = await b.newPage(); await pg.setViewport({ width: 1000, height: 640 });
  const errs = []; pg.on('pageerror', (e) => errs.push(String(e.message || e).slice(0, 200)));
  await pg.evaluateOnNewDocument(() => { try { localStorage.setItem('tm1.news.seen', '1.4.9'); localStorage.setItem('tm2.news.seen', '2.0.10'); } catch (_) {} });
  await pg.goto('http://127.0.0.1:8812/sheni/index.html');
  await pg.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 500 });
  await sleep(1500);
  log.push(['sound kit', await pg.evaluate(() => { const S = window.__TM_CTX.shared; return { sfx: typeof S.sfx, play: typeof (S.sfx && S.sfx.play), loop: typeof S.sfxLoop, cut: typeof S.sfxCut }; })]);
  const info = await pg.evaluate(() => {
    for (const id of ['tm-news', 'tm-help', 'tm-panel', 'tm-xcard', 'tm-card']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; }
    const T = window.__TM_CTX.shared.tamid; T.begin(); const L = T.list();
    return { i5: L.indexOf('lamps5'), i2: L.indexOf('lamps2') };
  });
  for (const [i, sec, name] of [[info.i5, 8.9, 'lamps5-a'], [info.i5, 14.1, 'lamps5-b'], [info.i2, 3.0, 'lamps2-start'], [info.i2, 8.0, 'lamps2']]) {
    for (const [k, frac] of [['', 0], ['-close', 0.55]]) {
      const st = await pg.evaluate((i, sec, frac) => {
        const c = window.__TM_CTX, T = c.shared.tamid; { const nw = document.getElementById('tm-news'); if (nw) nw.remove(); }
        T.seek(i, sec);
        const g = T.slides()[i].go[0], e = g.pos.map((v, j) => v + (g.target[j] - v) * frac);
        c.camera.position.set(e[0], e[1], e[2]); c.controls.target.set(g.target[0], g.target[1], g.target[2]); c.camera.lookAt(g.target[0], g.target[1], g.target[2]);
        T.seek(i, sec);
        const f = T.figAt('s4'); return f && { pose: f.pose, lamp: f.lamp, eye: e.map((v) => +v.toFixed(1)), tg: g.target };
      }, i, sec, frac);
      await sleep(2600);
      await pg.screenshot({ path: path.join(out, name + k + '.jpg'), type: 'jpeg', quality: 82 });
      log.push([name + k, st]);
    }
  }
  log.push(['errors', errs]);
} finally { await b.close(); server.close(); }
console.log(JSON.stringify(log));
