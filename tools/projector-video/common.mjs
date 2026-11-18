// Shared helpers: a static server for the plugin build, and a headless Chrome launcher (SwiftShader WebGL).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from '/home/claude/src/beit-rishon/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
export const PLUGIN = '/home/claude/src/beit-rishon/unified-plugin';
export const FONTS = '/home/claude/usb/fonts/node_modules/@fontsource';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.css': 'text/css' };
export async function serve() {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    let root = PLUGIN;
    if (p.startsWith('/__fonts/')) { root = FONTS; p = p.slice('/__fonts'.length); }
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(root, p);
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(f).pipe(res);
  }).listen(0, '127.0.0.1');
  await new Promise((r) => srv.on('listening', r));
  return { srv, port: srv.address().port };
}
export async function launch() {
  return puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, timeout: 60000, protocolTimeout: 600000,
    args: ['--no-sandbox', '--no-proxy-server', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-background-networking', '--disable-sync', '--no-first-run', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows'] });
}
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function openHouse(browser, port, house, W, H, preNav) {
  const page = await browser.newPage();
  page.setDefaultTimeout(600000);
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('tm1.news.seen', '9.9.9'); localStorage.setItem('tm2.news.seen', '9.9.9'); } catch (_) {} });
  if (preNav) await preNav(page);
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('pageerror: ' + String(e && e.message || e).slice(0, 300)));
  await page.goto('http://127.0.0.1:' + port + '/' + house + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 600000, polling: 500 });
  await page.evaluate(() => { const n = document.getElementById('tm-news'); if (n) n.remove(); });
  return page;
}
