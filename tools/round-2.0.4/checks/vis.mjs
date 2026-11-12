// what is seen after every press: node vis.mjs <plugin dir> <out dir> <rows|places> [pre "ri:key,ri:key" | -] [from-to | -] [vw] [vh]
//   every chip of every opinion row (or every place button) is pressed as the user presses it; when the camera rests the page is
//   photographed as he sees it (the menu and the card on it), and the view is measured: is the way from the eye to its target free,
//   is the eye shut in, is the picture empty. A row that opened something is measured again after the 15-second timer.
import { open } from '/home/claude/qa/fs/h.mjs'; import fs from 'fs'; import path from 'path';
const [,, dir, out, what, preArg, rangeArg, vwArg, vhArg] = process.argv; fs.mkdirSync(out, { recursive: true });
const pre = preArg && preArg !== '-' ? preArg.split(',').map((s) => s.split(':')) : [];
const [from, to] = rangeArg && rangeArg !== '-' ? rangeArg.split('-').map(Number) : [0, 1e9];
const P = await open(dir, { vw: +(vwArg || 1680), vh: +(vhArg || 760), dsf: +(process.env.DSF || 0.5) }); const pg = P.page;
const logf = path.join(out, 'vis.jsonl');
await pg.evaluate(() => {
  const c = window.__ctx, q = window.__q, T = c.THREE;
  // the depth of what is seen, from a small picture drawn with one plain material (rays through the whole model took a minute a press).
  // Labels, lines and what is faded to glass are left out; the sky and the empty air read as "far".
  const RW = 210, RH = 95, rt = new T.WebGLRenderTarget(RW, RH, { depthBuffer: true });
  const dm = new T.ShaderMaterial({ side: T.DoubleSide,
    vertexShader: 'varying float vD;\nvoid main() {\n#include <begin_vertex>\n#include <project_vertex>\nvD = -mvPosition.z;\n}',
    fragmentShader: 'varying float vD;\nvoid main() { float d = clamp(vD, 0.0, 4079.0) / 16.0; gl_FragColor = vec4(floor(d) / 255.0, fract(d), 0.0, 1.0); }' });
  const buf = new Uint8Array(RW * RH * 4);
  q.depth = () => {
    const hidden = [];
    c.scene.traverse((o) => { if (o.visible === false) return; let hide = false; if (o.isSprite || o.isLine || o.isPoints) hide = true; else if (o.isMesh) { const m = Array.isArray(o.material) ? o.material[0] : o.material; if (!m || m.visible === false || (m.transparent && m.opacity < 0.5)) hide = true; } if (hide) { o.visible = false; hidden.push(o); } });
    const om = c.scene.overrideMaterial, bg = c.scene.background, prev = c.renderer.getRenderTarget(), cc = new T.Color(); c.renderer.getClearColor(cc); const ca = c.renderer.getClearAlpha();
    c.scene.overrideMaterial = dm; c.scene.background = null; c.renderer.setRenderTarget(rt); c.renderer.setClearColor(0xffff00, 1); c.renderer.clear();
    q.skip = false; try { c.renderer.render(c.scene, c.camera); } finally { q.skip = true; }
    c.renderer.readRenderTargetPixels(rt, 0, 0, RW, RH, buf);
    c.renderer.setRenderTarget(prev); c.renderer.setClearColor(cc, ca); c.scene.overrideMaterial = om; c.scene.background = bg; for (const o of hidden) o.visible = true;
    return (x, y) => { const i = ((RH - 1 - y) * RW + x) * 4; return (buf[i] + buf[i + 1] / 255) * 16; };   // x from the left, y from the top
  };
  q.measure = () => {
    const eye = c.camera.position.clone(), tg = c.controls.target.clone(), L = tg.distanceTo(eye); const o = { cam: q.cam(), L: +L.toFixed(1) };
    if (!(L > 0.3)) return o;
    try {
      const D = q.depth(); const cx = RW >> 1, cy = RH >> 1; const mid = []; for (let y = cy - 2; y <= cy + 2; y++) for (let x = cx - 2; x <= cx + 2; x++) mid.push(D(x, y)); mid.sort((a, b) => a - b);
      o.dc = +mid[12].toFixed(1); o.f = +Math.min(1, mid[12] / L).toFixed(2);
      // the middle of the picture (between the card and the menu): how much of it is something nearer than 35% of the way to the target; and how much of the whole picture is nearer than 2.5 amot
      let n = 0, near = 0, all = 0, close = 0; for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) { const d = D(x, y); all++; if (d < 2.5) close++; if (x > RW * 0.22 && x < RW * 0.8 && y > RH * 0.12 && y < RH * 0.9) { n++; if (d < 0.35 * L) near++; } }
      o.near = +(near / n).toFixed(2); o.close = +(close / all).toFixed(2);
    } catch (e) { o.depthErr = String(e).slice(0, 120); }
    // the picture itself: how much it varies (a small copy of the canvas)
    try { const cv = c.renderer.domElement; q.grab(); q.drawn = true; const t = document.createElement('canvas'); t.width = 96; t.height = 54; const g = t.getContext('2d'); g.drawImage(cv, 0, 0, 96, 54); const d = g.getImageData(20, 6, 58, 42).data; let s1 = 0, s2 = 0, n = 0; const bins = new Set(); for (let i = 0; i < d.length; i += 4) { const y = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; s1 += y; s2 += y * y; n++; bins.add((d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | (d[i + 2] >> 4)); } o.std = +Math.sqrt(Math.max(0, s2 / n - (s1 / n) * (s1 / n))).toFixed(1); o.bins = bins.size; } catch (e) { o.picErr = String(e).slice(0, 60); }
    o.open = (c.shared.modelButtons || []).filter((b) => { try { return b.get && b.get(); } catch (_) { return false; } }).map((b) => b.id);
    o.sec = !!(c.shared.section && c.shared.section.on); const cd = q.card(); o.card = cd ? cd.title : '';
    return o; };
  q.clean = async () => { if (c.shared.stopDemos) c.shared.stopDemos(); if (c.shared.closeAuto) c.shared.closeAuto(); c.ui.resetAll(); try { const S = c.shared.section; if (S && S.on) S.set(false, S.axis, S.v); } catch (_) {} const x = document.getElementById('tm-xcard'); if (x) { const b = x.querySelector('.x, .close, button[title*="סגור"]'); if (b) b.click(); } await q.frames(6); };
});
const rowsInfo = await pg.evaluate(() => (window.__ctx.ui.opinions || []).map((r, ri) => ({ ri, cap: r.cap, cur: r.cur, dis: !!r.disabled, cardOnly: !!r.cardOnly, opts: (r.options || []).map((o) => [o[0], o[1]]) })));
const clickChip = (ri, key) => pg.evaluate(([ri, key]) => { const c = window.__ctx; const r = c.ui.opinions[ri]; const j = r.options.findIndex((o) => o[0] === key); const box = [...document.querySelectorAll('.tm-op')].find((b) => (b.querySelector('.cap') || {}).textContent === r.cap); const b = box ? [...box.querySelectorAll('button')][j] : null; if (b) { b.click(); return 'table'; } if (typeof r.fly === 'function') { r.onPick(key); if (r.mark) r.mark(key); r.fly(key); return 'api'; } return 'none'; }, [ri, key]);
const after = async () => { await pg.waitForTimeout(700); const cf = await pg.evaluate(() => { const q = window.__q; const m = q.confirm(); if (m) q.confirmYes(); return m; }); if (cf) await pg.waitForTimeout(400); await P.settle(40000, 10); await pg.waitForTimeout(600); await P.settle(15000, 6); return cf; };
const shot = async (name) => { await pg.evaluate(() => { if (!window.__q.drawn) window.__q.grab(); window.__q.drawn = false; }); await pg.screenshot({ path: path.join(out, name + '.jpg'), type: 'jpeg', quality: 72 }); };
for (const [ri, key] of pre) { await clickChip(+ri, key); await after(); }
if (pre.length) console.log('pre state:', pre.map((p) => rowsInfo[+p[0]].cap + '=' + (rowsInfo[+p[0]].opts.find((o) => o[0] === p[1]) || [])[1]).join(' ; '));
const preRows = new Set(pre.map((p) => +p[0]));
if (what === 'rows') {
  for (const r of rowsInfo) {
    if (r.ri < from || r.ri > to || r.dis || r.opts.length < 2 || preRows.has(r.ri)) continue;
    const order = r.opts.map((o) => o[0]).filter((k) => k !== r.cur).concat([r.cur]);
    for (const key of order) {
      const rec = { kind: 'row', ri: r.ri, cap: r.cap, key, label: (r.opts.find((o) => o[0] === key) || [])[1], isDef: key === r.cur };
      try { await pg.evaluate(() => window.__q.clean()); rec.via = await clickChip(r.ri, key); rec.confirm = await after(); Object.assign(rec, await pg.evaluate(() => window.__q.measure())); rec.shot = 'r' + String(r.ri).padStart(2, '0') + '_' + key; await shot(rec.shot);
        if (process.env.LATER && (rec.open && rec.open.length || rec.sec)) { await pg.waitForTimeout(16500); await pg.evaluate(() => window.__q.frames(6)); const m2 = await pg.evaluate(() => window.__q.measure()); rec.later = { f: m2.f, near: m2.near, std: m2.std, open: m2.open, sec: m2.sec, fn: m2.fn }; if (m2.open.length !== rec.open.length || m2.sec !== rec.sec) { rec.shot2 = rec.shot + '_later'; await shot(rec.shot2); } }
        rec.errs = P.errs.splice(0).map((e) => e.slice(0, 160)); } catch (e) { rec.err = String(e).slice(0, 200); }
      fs.appendFileSync(logf, JSON.stringify(rec) + '\n'); console.log(r.ri, r.cap.slice(0, 28), '|', (rec.label || '').slice(0, 26), '| f', rec.f, 'near', rec.near, 'close', rec.close, 'std', rec.std, rec.open && rec.open.length ? 'open ' + rec.open.join(',') : '', rec.later ? 'later std ' + rec.later.std + ' f ' + rec.later.f + ' near ' + rec.later.near : '', rec.depthErr || '', rec.err || '');
    }
  }
} else {
  const n = await pg.evaluate(() => window.__q.placeBtns().length);
  for (let i = Math.max(0, from); i < Math.min(n, to + 1); i++) {
    const rec = { kind: 'place', i };
    try { await pg.evaluate(() => window.__q.clean()); rec.t = await pg.evaluate((i) => { const b = window.__q.placeBtns()[i]; const t = (b.title || b.textContent).trim(); b.click(); return t; }, i); rec.confirm = await after(); Object.assign(rec, await pg.evaluate(() => window.__q.measure())); rec.shot = 'p' + String(i).padStart(3, '0'); await shot(rec.shot);
      rec.errs = P.errs.splice(0).map((e) => e.slice(0, 160)); } catch (e) { rec.err = String(e).slice(0, 200); }
    fs.appendFileSync(logf, JSON.stringify(rec) + '\n'); console.log(i, (rec.t || '').slice(0, 40), '| f', rec.f, 'near', rec.near, 'close', rec.close, 'std', rec.std, rec.open && rec.open.length ? 'open ' + rec.open.join(',') : '', rec.depthErr || '', rec.err || '');
  }
}
fs.writeFileSync(path.join(out, 'done'), 'done'); await P.close();
