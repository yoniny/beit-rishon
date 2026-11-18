// which demonstration sounds fire: node sndtest.mjs <plugin> <house> <seconds> <js to start the demos, run in the page>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');
const [dir0, house, secs, startJs] = process.argv.slice(2); const dir = path.resolve(dir0);
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); const f = path.join(dir, p); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8' }); fs.createReadStream(f).pipe(res); }).listen(8801, '127.0.0.1');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, protocolTimeout: 900000, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const pg = await b.newPage(); await pg.setViewport({ width: 480, height: 300 });
const errs = []; pg.on('pageerror', (e) => errs.push(String(e.message || e).slice(0, 200)));
await pg.evaluateOnNewDocument(() => { try { for (const k of ['tm1.news.seen', 'tm2.news.seen']) localStorage.setItem(k, '99.0.0'); } catch (_) {} });
await pg.goto('http://127.0.0.1:8801/' + house + '/index.html'); await pg.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 300 });
await sleep(1000);
await pg.evaluate(() => {
  try { window.__renderer.shadowMap.enabled = false; } catch (_) {}
  const S = window.__TM_CTX.shared, t0 = performance.now(); window.__snd = [];
  const f = S.sfx, L = S.sfxLoop;
  S.sfx = (n, o) => { window.__snd.push([+((performance.now() - t0) / 1000).toFixed(1), 'sfx', n, o ? JSON.stringify(o) : '']); return f(n, o); };
  S.sfxLoop = (n) => { const l = L(n); const set = l.set; let last = -1; l.set = (v) => { const r = Math.round(v * 10) / 10; if (r !== last) { last = r; window.__snd.push([+((performance.now() - t0) / 1000).toFixed(1), 'loop', n, r]); } return set(v); }; return l; };
});
await pg.evaluate(startJs);
await sleep(+secs * 1000);
const log = await pg.evaluate(() => window.__snd);
console.log(JSON.stringify({ house, n: log.length, log: log.slice(0, 80), errs }));
await b.close(); server.close();
