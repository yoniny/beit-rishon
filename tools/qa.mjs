// Headless QA of the built plugin page (plugin/) with the installed Chrome: node tools/qa.mjs [--chrome /path/to/chrome] [--port 8771]
// Serves plugin/ on 127.0.0.1, loads it in headless Chrome (software WebGL), waits for the model (html.tm-ready), then writes
// qa/<name>.png screenshots and qa/report.json (console errors, the top bar's buttons, timings). Steps (each a screenshot):
//   01-desktop (1280x800)  02-help (the navigation dialog open)  03-tour-menu (the presentation menu open)  04-panel-closed
//   05-narrow (520x760, the bar's icons only)  06-news (what's new)  07-inside-kodesh (a fly point inside the house)
// Exit code 1 when the page did not get ready or a console error was logged.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const chrome = opt('--chrome', process.env.CHROME || '/usr/bin/google-chrome');
const port = +opt('--port', 8771);
const outDir = path.join(root, 'qa');
fs.mkdirSync(outDir, { recursive: true });
const report = { ready: false, errors: [], warnings: [], buttons: [], steps: [], readyMs: 0 };
const server = spawn('node', [path.join(root, 'tools', 'serve.mjs'), String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 400));
const browser = await puppeteer.launch({
  executablePath: chrome, headless: true, timeout: 60000,
  args: ['--no-sandbox', '--no-proxy-server', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--lang=he', '--font-render-hinting=none', '--disable-background-networking', '--disable-sync', '--no-first-run', '--disable-component-update', '--disable-default-apps', '--disable-extensions']
});
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.evaluateOnNewDocument((ver) => { try { localStorage.setItem('tm1.news.seen', ver); } catch (_) {} }, JSON.parse(fs.readFileSync(path.join(root, 'plugin', 'manifest.json'), 'utf8')).version);   // no "מה חדש" window during the tests
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  page.on('console', (m) => {
    const t = m.type(), s = m.text();
    if (t === 'error' && !/favicon|status of 404/.test(s)) report.errors.push(s.slice(0, 300));
    else if (t === 'warning') report.warnings.push(s.slice(0, 200));
  });
  page.on('pageerror', (e) => report.errors.push('pageerror: ' + String(e && e.message || e).slice(0, 300)));
  const t0 = Date.now();
  await page.goto('http://127.0.0.1:' + port + '/', { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 180000, polling: 500 });
    report.ready = true;
  } catch (e) {
    report.errors.push('not ready after 180 s');
  }
  report.readyMs = Date.now() - t0;
  // software WebGL is slow: freeze the render loop (no requestAnimationFrame) for the UI steps; the fly step thaws it for a few seconds
  const freeze = (on) => page.evaluate((on) => {
    if (!window.__qaRaf) window.__qaRaf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = on ? () => 0 : window.__qaRaf;
    if (!on) window.__qaRaf(function tick() {});
  }, on);
  await freeze(true);
  const shot = async (name) => {
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: path.join(outDir, name + '.png') });
    report.steps.push(name);
    console.log('[qa] ' + name + ' ' + (Date.now() - t0) + ' ms');
  };
  report.buttons = await page.evaluate(() => [...document.querySelectorAll('#tm-topbtns > *')].map((b) => ({
    id: b.id, order: b.dataset.order, text: (b.textContent || '').trim(), w: Math.round(b.getBoundingClientRect().width), x: Math.round(b.getBoundingClientRect().left)
  })));
  report.version = await page.evaluate(() => (document.getElementById('version') || {}).textContent || '');
  report.bar = await page.evaluate(() => {
    const h = document.querySelector('header.topbar'), v = document.getElementById('version'), n = document.getElementById('tm-topbtns');
    const r = (e) => e ? e.getBoundingClientRect() : null;
    return { bar: r(h) && { h: r(h).height }, version: r(v) && { x: Math.round(r(v).left), w: Math.round(r(v).width) }, nav: r(n) && { x: Math.round(r(n).left), w: Math.round(r(n).width) } };
  });
  await shot('01-desktop');
  // the first visit opens "מה חדש" by itself: close it before the steps
  await page.evaluate(() => { const n = document.getElementById('tm-news'); if (n) n.remove(); });
  if (report.ready) {
    await page.click('#tm-help-btn').catch((e) => report.errors.push('help click: ' + e.message));
    await shot('02-help');
    await page.keyboard.press('Escape');
    await page.click('#tm-tour-btn').catch((e) => report.errors.push('tour click: ' + e.message));
    await shot('03-tour-menu');
    await page.click('#tm-tour-btn').catch(() => {});
    await page.click('#tm-burger').catch((e) => report.errors.push('burger click: ' + e.message));
    await shot('04-panel-closed');
    await page.click('#tm-burger').catch(() => {});
    await page.setViewport({ width: 520, height: 760, deviceScaleFactor: 1 });
    await shot('05-narrow');
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    const hasNews = await page.$('#tm-news-btn');
    if (hasNews) {
      await page.click('#tm-news-btn');
      await shot('06-news');
      await page.keyboard.press('Escape');
    }
    await freeze(false);
    await page.evaluate(() => { try { const c = window.__TM_CTX; const b = c && c.ui && c.ui.viewButton && c.ui.viewButton('kodesh'); if (b) b.click(); } catch (e) { console.error('qa fly: ' + e.message); } });
    await new Promise((r) => setTimeout(r, 6000));
    await freeze(true);
    await shot('07-inside-kodesh');
  }
} finally {
  await browser.close();
  server.kill();
}
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(JSON.stringify({ ready: report.ready, readyMs: report.readyMs, errors: report.errors, version: report.version, buttons: report.buttons, bar: report.bar, steps: report.steps }, null, 1));
process.exit(report.ready && !report.errors.length ? 0 : 1);
