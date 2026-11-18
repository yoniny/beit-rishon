import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');
const dir = '/home/claude/work219/dist-unified/plugin';
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); const f = path.join(dir, p); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8' }); fs.createReadStream(f).pipe(res); }).listen(8802, '127.0.0.1');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, protocolTimeout: 900000, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage(); await pg.setViewport({ width: 400, height: 250 });
await pg.evaluateOnNewDocument(() => { try { localStorage.setItem('tm1.news.seen', '99.0.0'); } catch (_) {} });
await pg.goto('http://127.0.0.1:8802/rishon/index.html'); await pg.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 300 });
await pg.evaluate(() => { try { window.__renderer.shadowMap.enabled = false; } catch (_) {} const S = window.__TM_CTX.shared; window.__clicks = 0; const f = S.sfx; S.sfx = (n, o) => { if (n === 'click') window.__clicks++; return f(n, o); }; window.__r = S.throne.ascent.start('targumSheni'); });
for (let i = 0; i < 9; i++) {
  await sleep(8000);
  console.log(JSON.stringify(await pg.evaluate(() => { const S = window.__TM_CTX.shared; let sil = null; window.__TM_CTX.scene.traverse((o) => { if (o.name === 'throneSilhouette' && !sil) sil = o.parent; }); return { r: window.__r, running: S.throne.ascent.running, el: +(+S.throne.ascent.elapsed() || 0).toFixed(1), dur: S.throne.ascent.duration, silVis: sil && sil.visible, y: sil && +sil.position.y.toFixed(2), clicks: window.__clicks }; })));
}
await b.close(); server.close();
