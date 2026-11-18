// Load time, old (2.0.18) against new (3.0.0), each house, alternating runs in one browser: time to html.tm-ready and the plugin's own
// "[load]" rows (window.__loadTimes). node loadtime.mjs <old plugin dir> <new plugin dir> <runs>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const puppeteer = require('puppeteer-core');
const [oldD, newD, runsS] = process.argv.slice(2); const runs = +runsS || 2;
const serve = (dir, port) => http.createServer((req, res) => { const p = decodeURIComponent(req.url.split('?')[0]); const f = path.join(path.resolve(dir), p); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(res); }).listen(port, '127.0.0.1');
const S = [serve(oldD, 8821), serve(newD, 8822)];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, protocolTimeout: 900000, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--lang=he', '--disable-features=CodeCacheForJavaScript'] });
const res = [];
for (let r = 0; r < runs; r++) {
  for (const house of ['rishon', 'sheni']) {
    for (const [tag, port] of (r % 2 ? [['new', 8822], ['old', 8821]] : [['old', 8821], ['new', 8822]])) {
      const ctxB = await b.createBrowserContext();
      const pg = await ctxB.newPage(); await pg.setViewport({ width: 1000, height: 640 });
      await pg.evaluateOnNewDocument(() => { try { localStorage.setItem('tm1.news.seen', '9.9.9'); localStorage.setItem('tm2.news.seen', '9.9.9'); } catch (_) {} });
      const t0 = Date.now();
      await pg.goto('http://127.0.0.1:' + port + '/' + house + '/index.html');
      await pg.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 300000, polling: 100 });
      const ms = Date.now() - t0;
      await new Promise((rr) => setTimeout(rr, 1500));
      const rows = await pg.evaluate(() => { const L = window.__loadTimes; return Array.isArray(L) ? L.map((x) => [x.step || x[0], Math.round(x.ms != null ? x.ms : x[1])]) : L; });
      res.push({ r, house, tag, ready: ms, rows });
      await ctxB.close();
    }
  }
}
await b.close(); S.forEach((s) => s.close());
for (const house of ['rishon', 'sheni']) for (const tag of ['old', 'new']) {
  const R = res.filter((x) => x.house === house && x.tag === tag);
  console.log(house, tag, 'ready ms:', R.map((x) => x.ready).join(', '));
}
console.log(JSON.stringify(res.filter((x) => x.r === runs - 1)));
