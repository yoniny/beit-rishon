import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');
const [dir0, out] = process.argv.slice(2); const dir = path.resolve(dir0); fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); const f = path.join(dir, p); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8' }); fs.createReadStream(f).pipe(res); }).listen(8803, '127.0.0.1');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, protocolTimeout: 900000, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--lang=he'] });
const res = {};
for (const house of ['rishon', 'sheni']) {
  const pg = await b.newPage(); await pg.setViewport({ width: 1000, height: 640 });
  const errs = []; pg.on('pageerror', (e) => errs.push(String(e.message || e).slice(0, 200)));
  await pg.evaluateOnNewDocument(() => { try { for (const k of ['tm1.news.seen', 'tm2.news.seen']) localStorage.setItem(k, '99.0.0'); } catch (_) {} });
  await pg.goto('http://127.0.0.1:8803/' + house + '/index.html'); await pg.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 300 });
  await sleep(1500);
  const info = await pg.evaluate(() => {
    for (const id of ['tm-news', 'tm-help']) { const e = document.getElementById(id); if (e) e.remove(); }
    try { window.__renderer.shadowMap.enabled = false; } catch (_) {}
    const P = window.__TM_CTX.ui.places(), groups = [...new Set(P.map((p) => p.group))];
    const demos = P.filter((p) => p.group === 'הדגמות').map((p) => p.title);
    const sm = [...document.querySelectorAll('#tm-panel details.tm-pl > summary')].find((s) => s.textContent === 'הדגמות');
    if (sm) { sm.parentElement.open = true; sm.scrollIntoView(); }
    return { firstGroups: groups.slice(0, 3), demos };
  });
  await sleep(800);
  await pg.screenshot({ path: path.join(out, house + '-demos-group.jpg'), type: 'jpeg', quality: 82 });
  // click every demo button in turn; record whether a demonstration (or the presentation) runs after it
  const runs = [];
  for (const t of info.demos) {
    await pg.evaluate(() => { try { window.__TM_CTX.shared.stopDemos(); } catch (_) {} try { const T = window.__TM_CTX.shared.tour; if (T && T.stop) T.stop(); } catch (_) {} });
    await sleep(600);
    await pg.evaluate((t) => { window.__TM_CTX.ui.placeButton(t).click(); }, t);
    await sleep(1500);
    await pg.evaluate(() => { const cf = document.getElementById('tm-confirm'); if (cf && cf.style.display === 'flex') { const y = cf.querySelector('.y'); if (y) y.click(); } });
    await sleep(3500);
    runs.push([t, await pg.evaluate(() => { const S = window.__TM_CTX.shared; const live = (S.demoStops || []).filter((d) => { try { return d.running(); } catch (_) { return false; } }).map((d) => d.id); let tour = false; try { tour = !!(S.tour && S.tour.state && S.tour.state().running); } catch (_) {} return { live, tour }; })]);
  }
  res[house] = { ...info, runs, errs };
  if (house === 'sheni') {
    await pg.evaluate(() => { try { window.__TM_CTX.shared.stopDemos(); } catch (_) {} try { const T = window.__TM_CTX.shared.tour; if (T && T.stop) T.stop(); } catch (_) {} const c = window.__TM_CTX; c.ui.placeButton(c.ui.placeTitles().find((x) => x.includes('שתי הסנהדראות הקטנות'))).click(); });
    await sleep(9000);
    await pg.evaluate(() => { for (const id of ['tm-news', 'tm-help', 'tm-xcard', 'tm-card', 'tm-panel']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } });
    await pg.screenshot({ path: path.join(out, 'sheni-two-courts.jpg'), type: 'jpeg', quality: 82 });
  }
  await pg.close();
}
console.log(JSON.stringify(res, null, 1));
await b.close(); server.close();
