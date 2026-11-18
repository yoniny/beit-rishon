// Visual checks of round 3.0.0 (screenshots): node verify.mjs <plugin dir> <out dir>
// rishon: a demonstration's bar over the compass; sheni: the young priests, the two lesser courts, a gate's parochet, the bar
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');
const [dir0, out] = process.argv.slice(2);
const dir = path.resolve(dir0);
fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); const f = path.join(dir, p); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8' }); fs.createReadStream(f).pipe(res); }).listen(8799, '127.0.0.1');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const W = 1000, H = 620;
const log = [];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, protocolTimeout: 600000,
  args: ['--no-sandbox', '--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--lang=he'] });
async function open(house) {
  const pg = await b.newPage();
  pg.setDefaultTimeout(300000);
  pg.on('pageerror', (e) => log.push(house + ' pageerror: ' + String(e && e.message || e).slice(0, 200)));
  pg.on('console', (m) => { if (m.type() === 'error' && !/favicon|404/.test(m.text())) log.push(house + ' console: ' + m.text().slice(0, 200)); });
  await pg.evaluateOnNewDocument(() => { try { for (const k of ['tm1.news.seen', 'tm2.news.seen']) localStorage.setItem(k, '99.0.0'); } catch (_) {} });
  await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  const t0 = Date.now();
  await pg.goto('http://127.0.0.1:8799/' + house + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 300 });
  log.push(house + ' ready in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s; load rows: ' + JSON.stringify(await pg.evaluate(() => (window.__loadTimes || []).map((r) => [r.step, r.ms]))));
  await sleep(1200);
  await pg.evaluate(() => { for (const id of ['tm-news', 'tm-help']) { const e = document.getElementById(id); if (e) e.remove(); } try { window.__renderer.shadowMap.enabled = false; } catch (_) {} });
  return pg;
}
const hideCards = (pg) => pg.evaluate(() => { for (const id of ['tm-xcard', 'tm-card', 'tm-panel']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } });
const place = async (pg, frag, wait = 9000) => {
  const t = await pg.evaluate((frag) => { const c = window.__TM_CTX; const t = c.ui.placeTitles().find((x) => x.includes(frag)); if (!t) return null; c.ui.placeButton(t).click(); return t; }, frag);
  await sleep(500);
  await pg.evaluate(() => { const cf = document.getElementById('tm-confirm'); if (cf && cf.style.display === 'flex') { const y = cf.querySelector('.y'); if (y) y.click(); } });
  await sleep(wait);
  return t;
};
const shot = async (pg, name) => { await pg.evaluate(() => { for (const id of ['tm-news', 'tm-help']) { const e = document.getElementById(id); if (e) e.remove(); } }); return pg.screenshot({ path: path.join(out, name + '.jpg'), type: 'jpeg', quality: 82 }); };
try {
  // ---------- rishon: the demonstration bar ----------
  {
    const pg = await open('rishon');
    const t = await place(pg, 'המכונות', 7000);
    await pg.evaluate(() => { const M = window.__TM_CTX.shared.mechona; if (M && M.demo) M.demo.start(); });
    await hideCards(pg);
    await sleep(2500);
    const bar = await pg.evaluate(() => { const e = document.getElementById('tm-dpause'), c = document.getElementById('tm-compass'), n = document.getElementById('tm-nav'); const r = (x) => x ? (({ left, top, right, bottom }) => ({ left: Math.round(left), top: Math.round(top), right: Math.round(right), bottom: Math.round(bottom) }))(x.getBoundingClientRect()) : null; return { shown: !!(e && e.style.display === 'flex'), bar: r(e), compass: r(c), nav: r(n) }; });
    log.push('rishon demo "' + t + '" bar: ' + JSON.stringify(bar));
    await shot(pg, 'rishon-demo-bar');
    await pg.close();
  }
  // ---------- sheni ----------
  {
    const pg = await open('sheni');
    // the two lesser courts
    let t = await place(pg, 'שתי הסנהדראות הקטנות', 10000);
    await hideCards(pg);
    await sleep(800);
    await shot(pg, 'sheni-two-lesser-courts');
    log.push('sheni "' + t + '" cam ' + JSON.stringify(await pg.evaluate(() => [window.__TM_CTX.camera.position.toArray().map((v) => +v.toFixed(1)), window.__TM_CTX.controls.target.toArray().map((v) => +v.toFixed(1))])));
    // a gate and its parochet
    t = await place(pg, 'שער הבכורות', 10000);
    await hideCards(pg);
    await sleep(2500);
    await shot(pg, 'sheni-gate-bechorot');
    log.push('sheni "' + t + '" parochot raised: ' + JSON.stringify(await pg.evaluate(() => { const G = window.__TM_CTX.shared.gateParochot; return G ? G.list.filter((o) => o.u > 0.5).map((o) => o.name) : null; })));
    // the young priests: the place, then a close view of one of them, then the demonstration (the bar)
    t = await place(pg, 'שמחת בית השואבה', 9000);
    await hideCards(pg);
    await pg.evaluate(() => { const c = window.__TM_CTX; c.flyTo([143.6, 8.5, -21.2], [146.8, 8.0, -20.0], 300); });
    await sleep(6000);
    await shot(pg, 'sheni-young-priest-close');
    await pg.evaluate(() => { const c = window.__TM_CTX; c.flyTo([160, 22, 12], [161, 14, -2], 300); });
    await sleep(5000);
    const started = await pg.evaluate(() => { const S = window.__TM_CTX.shared.simchaDemo; if (S && typeof S.start === 'function') { S.start(); return true; } return false; });
    await sleep(5000);
    await hideCards(pg);
    const bar = await pg.evaluate(() => { const e = document.getElementById('tm-dpause'), c = document.getElementById('tm-compass'); const r = (x) => x ? (({ left, top, right, bottom }) => ({ left: Math.round(left), top: Math.round(top), right: Math.round(right), bottom: Math.round(bottom) }))(x.getBoundingClientRect()) : null; return { shown: !!(e && e.style.display === 'flex'), bar: r(e), compass: r(c) }; });
    log.push('sheni simcha demo started: ' + started + ', bar: ' + JSON.stringify(bar));
    await shot(pg, 'sheni-simcha-demo-bar');
    await pg.close();
  }
} catch (e) {
  log.push('FATAL ' + String(e && e.stack || e).slice(0, 500));
} finally {
  fs.writeFileSync(path.join(out, 'log.txt'), log.join('\n'));
  console.log(log.join('\n'));
  await b.close();
  server.close();
}
