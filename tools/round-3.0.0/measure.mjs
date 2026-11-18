import { createRequire } from 'node:module';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');
const dir = process.argv[2], house = process.argv[3] || 'rishon', out = process.argv[4] || '/home/claude/work219/t-measure';
fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); const f = path.join(dir, p); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8' }); fs.createReadStream(f).pipe(res); }).listen(8798, '127.0.0.1');
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage(); const W = 900, H = 600; await pg.setViewport({ width: W, height: H });
await pg.evaluateOnNewDocument(() => { try { for (const k of ['tm1.news.seen', 'tm2.news.seen']) localStorage.setItem(k, '99.0.0'); } catch (_) {} });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await pg.goto('http://127.0.0.1:8798/' + house + '/index.html'); await pg.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 500 });
await sleep(1500);
await pg.evaluate(() => { try { window.__renderer.shadowMap.enabled = false; } catch (_) {} });
// a view of Yachin from the side, level with its middle: the eye 30 amot east-south-east, at y 22
await pg.evaluate(() => { for (const id of ['tm-news', 'tm-help']) { const e = document.getElementById(id); if (e) e.remove(); } const c = window.__TM_CTX; const b = c.ui.viewButton('yachinBoazFull'); if (b) b.click(); else c.flyTo([74, 32, -40], [18.4, 24.63, -1.39], 300); });
await sleep(7000);
const hide = () => pg.evaluate(() => { for (const id of ['tm-xcard', 'tm-card', 'tm-panel']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } });
await hide();
const proj = (p) => pg.evaluate((p, W, H) => { const c = window.__TM_CTX, v = new c.THREE.Vector3(...p).project(c.camera); return [Math.round((v.x + 1) / 2 * W), Math.round((1 - v.y) / 2 * H), v.z]; }, p, W, H);
await pg.evaluate(() => document.getElementById('tm-nav-ruler').click());
await pg.evaluate(() => { const st = document.createElement('style'); st.textContent = 'body *:not(canvas){pointer-events:none !important} canvas{pointer-events:auto !important}'; document.head.appendChild(st); });
await sleep(400);
const res = {};
for (const [name, A, B] of [
  ['floor at the foot -> top of the small capital', [6.08 + 2.31 * 0.821, 12.0, 7.17 - 2.31 * 0.571], [6.08, 32.98, 7.17]],
  ['floor at the foot -> foot of the capital (the shaft seen)', [6.08 + 2.31 * 0.821, 12.0, 7.17 - 2.31 * 0.571], [6.08 + 2.07 * 0.821, 28.03, 7.17 - 2.07 * 0.571]],
  ['the same point twice (top of the capital)', [6.08, 32.98, 7.17], [6.08, 32.98, 7.17]],
]) {
  const a = await proj(A), bb = await proj(B);
  const cover = await pg.evaluate((a, b) => [document.elementFromPoint(a[0], a[1]).tagName, document.elementFromPoint(b[0], b[1]).tagName], a, bb);
  await pg.mouse.click(a[0], a[1]); await sleep(500);
  await pg.mouse.click(bb[0], bb[1]); await sleep(800);
  res[name] = { screenA: a, screenB: bb, cover, text: await pg.evaluate(() => document.getElementById('tm-measure-out').textContent) };
  await pg.screenshot({ path: path.join(out, house + '-' + Object.keys(res).length + '.jpg'), type: 'jpeg', quality: 80 });
}
console.log(JSON.stringify(res, null, 1));
await b.close(); server.close();
