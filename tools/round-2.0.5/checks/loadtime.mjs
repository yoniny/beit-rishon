// load time to "tm-ready" of plugin dirs, alternating, N rounds: node loadtime.mjs <rounds> <name=dir>...
import { chromium } from 'playwright'; import http from 'http'; import fs from 'fs'; import path from 'path';
const [,, rounds, ...pairs] = process.argv; const res = {};
for (let r = 0; r < +rounds; r++) for (const pr of pairs) { const [name, dir] = pr.split('=');
  const srv = http.createServer((req, rs) => { const u = decodeURIComponent(req.url.split('?')[0]); const p = path.join(dir, u === '/' ? '/index.html' : u); fs.readFile(p, (e, d) => { if (e) { rs.statusCode = 404; rs.end(); return; } rs.end(d); }); }); await new Promise((ok) => srv.listen(0, ok));
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 0.5 });
  await page.addInitScript(() => { const H = {}; window.Otzaria = { call: async () => null, on: (ev, cb) => { if (ev === 'plugin.boot') setTimeout(() => { try { cb({ plugin: { version: 'test' }, theme: {} }); } catch (e) {} }, 50); } }; });
  const t0 = Date.now(); await page.goto(`http://127.0.0.1:${srv.address().port}/`); await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), null, { timeout: 300000 }); const ms = Date.now() - t0;
  (res[name] = res[name] || []).push(ms); console.log(name, ms); await browser.close(); srv.close(); }
console.log(JSON.stringify(Object.fromEntries(Object.entries(res).map(([k, v]) => [k, Math.round(v.reduce((a, b) => a + b, 0) / v.length)]))));
