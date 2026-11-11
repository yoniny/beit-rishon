// the harness of the full scan: one page of a plugin dir, with helpers in the page (window.__q)
import { chromium } from 'playwright'; import http from 'http'; import fs from 'fs'; import path from 'path';
export async function open(dir, opt = {}) {
  const srv = http.createServer((req, res) => { const u = decodeURIComponent(req.url.split('?')[0]); const p = path.join(dir, u === '/' ? '/index.html' : u); fs.readFile(p, (e, d) => { if (e) { res.statusCode = 404; res.end(); return; } res.setHeader('Content-Type', p.endsWith('.js') ? 'text/javascript' : p.endsWith('.png') ? 'image/png' : 'text/html; charset=utf-8'); res.end(d); }); }).listen(0);
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: opt.vw || 1280, height: opt.vh || 800 }, deviceScaleFactor: opt.dsf || 0.5 });
  const errs = [], warns = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + String(e).slice(0, 400)));
  page.on('console', (m) => { const t = m.text(); if (/GPU stall|KHR_parallel|favicon|404/.test(t)) return; if (m.type() === 'error') errs.push('E ' + t.slice(0, 400)); else if (m.type() === 'warning') warns.push('W ' + t.slice(0, 600)); });
  let VER = ''; try { VER = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')).version; } catch (_) {}
  if (opt.otz !== false) await page.addInitScript(() => {
    const H = {};
    window.Otzaria = {
      call: async (m, p) => { (window.__otzCalls = window.__otzCalls || []).push([m, p]); return m === 'feedback.report' ? 'sent' : null; },
      on: (ev, cb) => { (H[ev] = H[ev] || []).push(cb); if (ev === 'plugin.boot') setTimeout(() => { try { cb({ plugin: { version: 'test' }, theme: {} }); } catch (e) { console.error(e); } }, 50); }
    };
  });
  await page.addInitScript((v) => { try { localStorage.setItem('tm2.news.seen', v); localStorage.setItem('tm1.news.seen', v); } catch (_) {} }, VER);
  await page.goto(`http://127.0.0.1:${srv.address().port}/` + (opt.path || ''));
  if (!opt.noWait) {
    await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), null, { timeout: 300000 });
    await page.waitForTimeout(1200);
    await page.evaluate(() => { const n = document.getElementById('tm-news'); if (n) n.remove(); });
    await page.evaluate(helpers);
  }
  const close = async () => { await browser.close(); srv.close(); };
  // wait until the camera stands still for n frames (frame-based: the loop's own frames), at most ms
  const settle = (ms = 45000, n = 4) => page.evaluate(([ms, n]) => window.__q.settle(ms, n), [ms, n]);
  // render now and read the canvas in the same task -> png file
  const rshot = async (file) => { const url = await page.evaluate(() => window.__q.grab()); fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64')); };
  return { page, browser, close, errs, warns, settle, rshot, VER };
}
export function helpers() {
  const c = window.__ctx, T = c.THREE;
  const q = window.__q = {};
  q.vis = (e) => { if (!e) return false; const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  q.settle = (ms, n) => new Promise((res) => { let last = null, still = 0, frames = 0; const t1 = performance.now();
    const tick = () => { frames++; const k = c.camera.position.toArray().concat(c.controls.target.toArray()).map((v) => v.toFixed(2)).join(','); still = k === last ? still + 1 : 0; last = k;
      if (still < n && performance.now() - t1 < ms) { requestAnimationFrame(() => setTimeout(tick, 60)); return; } res({ frames, ms: Math.round(performance.now() - t1), still }); };
    requestAnimationFrame(tick); });
  // the waits do not draw: the loop's own render only brings the matrices up to date (as three's render does first), so a flight, a fade or a
  // demonstration runs at the script's speed and in real time; q.grab draws one real frame and reads it in the same task
  const rr = c.renderer.render; q.skip = true; q.draws = 0;
  c.renderer.render = function (s, cam) { if (!q.skip) return rr.call(c.renderer, s, cam); if (s.matrixWorldAutoUpdate !== false) s.updateMatrixWorld(); if (cam.parent === null && cam.matrixWorldAutoUpdate !== false) cam.updateMatrixWorld(); };
  q.grab = () => { const cv = c.renderer.domElement; rr.call(c.renderer, c.scene, c.camera); q.draws++; const t = document.createElement('canvas'); t.width = cv.width; t.height = cv.height; t.getContext('2d').drawImage(cv, 0, 0); return t.toDataURL('image/png'); };
  q.cam = () => c.camera.position.toArray().concat(c.controls.target.toArray()).map((v) => +v.toFixed(1));
  // place buttons (not the opinion chips)
  q.placeBtns = () => [...document.querySelectorAll('.tm-pl button')].filter((b) => !b.closest('.tm-op'));
  q.pills = () => [...document.querySelectorAll('.tm-pill')].filter(q.vis).map((e) => { const r = e.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; const top = document.elementFromPoint(cx, cy); const inView = cx > 0 && cy > 0 && cx < innerWidth && cy < innerHeight; return { t: e.textContent.trim(), x: Math.round(cx), y: Math.round(cy), reach: !!(top && (top === e || e.contains(top))), inView, cover: top && top !== e && !e.contains(top) ? (top.id || top.className || top.tagName).toString().slice(0, 30) : '' }; });
  q.card = () => { const x = document.getElementById('tm-xcard'); if (!x || !q.vis(x)) return null; const tt = x.querySelector('.tt'), b = x.querySelector('.b'), txt = b ? b.innerText : '';
    const refs = [...x.querySelectorAll('.r a, .r button')].map((a) => a.textContent.trim());
    const chips = [...x.querySelectorAll('.tm-op button, .ops button, .o button')].map((a) => a.textContent.trim());
    const bad = []; for (const w of ['undefined', 'null', 'NaN', '[object', '**', '\\n', '{', '}', '  ']) if (txt.indexOf(w) >= 0) bad.push(w);
    const r = x.getBoundingClientRect();
    return { title: tt ? tt.textContent.trim() : '', len: txt.length, short: /בקצרה —/.test(txt), model: /במודל/.test(txt), refs: refs.length, bad, bold: b ? b.querySelectorAll('b, strong').length : 0, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], scroll: b ? b.scrollHeight > b.clientHeight + 2 : false, html: opt_html ? (b ? b.innerHTML : '') : undefined }; };
  let opt_html = false; q.htmlOn = (v) => { opt_html = !!v; };
  q.confirm = () => { const cf = document.getElementById('tm-confirm'); return cf && q.vis(cf) ? (cf.querySelector('.m') || cf).textContent.trim().slice(0, 80) : ''; };
  q.confirmYes = () => { const cf = document.getElementById('tm-confirm'); if (cf && q.vis(cf)) { const y = cf.querySelector('.y'); if (y) { y.click(); return true; } } return false; };
  // is the way from the eye to the target free? the first solid thing on the ray, as a part of the distance
  q.ray = () => { try { const rc = new T.Raycaster(); rc.camera = c.camera; const p = c.camera.position.clone(), t = c.controls.target.clone(); const d = t.clone().sub(p), L = d.length(); if (!(L > 0.5)) return null; rc.set(p, d.normalize()); rc.far = L; rc.near = 0.05;
      const hits = rc.intersectObjects(c.scene.children, true);
      for (const h of hits) { let o = h.object, ok = true; if (o.isSprite || o.isLine || o.isPoints) continue; for (let a = o; a; a = a.parent) if (a.visible === false) { ok = false; break; } if (!ok) continue; const m = Array.isArray(o.material) ? o.material[0] : o.material; if (!m || m.visible === false || (m.transparent && m.opacity < 0.75) || m.depthTest === false) continue; if (o.userData && o.userData.noPick) continue;
        let nm = ''; for (let a = o; a && !nm; a = a.parent) nm = a.name || ''; return { f: +(h.distance / L).toFixed(2), d: +h.distance.toFixed(1), L: +L.toFixed(1), name: nm.slice(0, 40) }; }
      return { f: 1, L: +L.toFixed(1) }; } catch (e) { return { err: String(e).slice(0, 100) }; } };
  // the model's state: every effectively visible mesh with its place and shape (not sprites - the labels follow the eye; not materials - the fade swaps them)
  q.sig = () => { const m = new Map(); c.scene.updateMatrixWorld(true); c.scene.traverse((o) => { if (!(o.isMesh || o.isLine || o.isPoints) || o.isSprite) return; for (let a = o; a; a = a.parent) if (a.visible === false) return;
      const e = o.matrixWorld.elements; let s = ''; for (let i = 0; i < 16; i++) s += e[i].toFixed(2) + ','; s += (o.geometry ? o.geometry.uuid : '') + (o.isInstancedMesh ? '#' + o.count : ''); let nm = ''; for (let a = o; a && !nm; a = a.parent) nm = a.name || ''; m.set(o.uuid, [s, nm]); }); return m; };
  q.sigs = {};
  q.keep = (k) => { q.sigs[k] = q.sig(); return q.sigs[k].size; };
  q.diff = (a, b, skip) => { const A = q.sigs[a], B = q.sigs[b]; if (!A || !B) return null; const names = {}; let n = 0; const sk = skip ? q.sigs[skip] : null; const add = (id, nm) => { if (q.unstable && q.unstable.has(id)) return; n++; names[nm || '?'] = (names[nm || '?'] || 0) + 1; };
      for (const [id, v] of A) { const w = B.get(id); if (!w) add(id, v[1] + '(-)'); else if (w[0] !== v[0]) add(id, v[1] + '(~)'); } for (const [id, v] of B) if (!A.has(id)) add(id, v[1] + '(+)');
      return { n, names: Object.entries(names).sort((x, y) => y[1] - x[1]).slice(0, 8).map((e) => e[0] + '×' + e[1]).join(' | ') }; };
  // the things that move by themselves (fire, smoke, water, the cloud): two states some frames apart
  q.markUnstable = async () => { q.unstable = q.unstable || new Set(); const A = q.sig(); await new Promise((r) => setTimeout(r, 1500)); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); const B = q.sig(); for (const [id, v] of A) { const w = B.get(id); if (!w || w[0] !== v[0]) q.unstable.add(id); } for (const [id] of B) if (!A.has(id)) q.unstable.add(id); return q.unstable.size; };
  q.frames = (n) => new Promise((res) => { let k = 0; const f = () => { if (++k >= n) res(k); else requestAnimationFrame(f); }; requestAnimationFrame(f); });
}
