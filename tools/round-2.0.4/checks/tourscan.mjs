// THE SCAN OF THE PRESENTATIONS (11.11.2026, the user: "יש כרטיסים שלא מראים כלום"; "כרטיס אחד מציג כמה דברים - להציג את כולם"):
// every slide of a presentation is entered as the presentation enters it, the page is photographed as the viewer sees it (the banner too),
// and the view is measured. The measure only flags - a person looks at every picture (mksheets.py).
//   node tourscan.mjs <plugin dir> <out dir> <mode key> [from-to]
// The presentation is paused right after each slide is entered (so that it does not go on by itself); LATE=<ms> photographs the slide once
// more after it ran <ms> more (unpaused): its further cameras ("then"), its orbit, its demonstration.
import { open } from '/home/claude/qa/fs/h.mjs'; import fs from 'fs'; import path from 'path';
const [,, dir, out, modeKey, range] = process.argv; fs.mkdirSync(out, { recursive: true });
const LATE = +(process.env.LATE || 0);
const P = await open(dir, { vw: 1680, vh: 760, dsf: 0.5 }); const pg = P.page;
await pg.evaluate(() => { const c = window.__ctx, q = window.__q, T = c.THREE; const RW = 210, RH = 95, rt = new T.WebGLRenderTarget(RW, RH, { depthBuffer: true });
  const dm = new T.ShaderMaterial({ side: T.DoubleSide, vertexShader: 'varying float vD;\nvoid main() {\n#include <begin_vertex>\n#include <project_vertex>\nvD = -mvPosition.z;\n}', fragmentShader: 'varying float vD;\nvoid main() { float d = clamp(vD, 0.0, 4079.0) / 16.0; gl_FragColor = vec4(floor(d) / 255.0, fract(d), 0.0, 1.0); }' });
  const buf = new Uint8Array(RW * RH * 4);
  q.view = () => { const hidden = []; c.scene.traverse((o) => { if (o.visible === false) return; let hide = false; if (o.isSprite || o.isLine || o.isPoints) hide = true; else if (o.isMesh) { const m = Array.isArray(o.material) ? o.material[0] : o.material; if (!m || m.visible === false || (m.transparent && m.opacity < 0.5)) hide = true; } if (hide) { o.visible = false; hidden.push(o); } });
    const om = c.scene.overrideMaterial, bg = c.scene.background, prev = c.renderer.getRenderTarget(), cc = new T.Color(); c.renderer.getClearColor(cc); const ca = c.renderer.getClearAlpha();
    c.scene.overrideMaterial = dm; c.scene.background = null; c.renderer.setRenderTarget(rt); c.renderer.setClearColor(0xffff00, 1); c.renderer.clear(); q.skip = false; try { c.renderer.render(c.scene, c.camera); } finally { q.skip = true; }
    c.renderer.readRenderTargetPixels(rt, 0, 0, RW, RH, buf); c.renderer.setRenderTarget(prev); c.renderer.setClearColor(cc, ca); c.scene.overrideMaterial = om; c.scene.background = bg; for (const o of hidden) o.visible = true;
    const D = (x, y) => { const i = ((RH - 1 - y) * RW + x) * 4; return (buf[i] + buf[i + 1] / 255) * 16; }; const L = c.controls.target.distanceTo(c.camera.position); const mid = []; for (let y = 45; y <= 49; y++) for (let x = 103; x <= 107; x++) mid.push(D(x, y)); mid.sort((a, b) => a - b);
    let n = 0, near = 0, close = 0; for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) if (x > RW * 0.22 && x < RW * 0.8 && y > RH * 0.12 && y < RH * 0.9) { n++; const d = D(x, y); if (d < 0.35 * L) near++; if (d < 3) close++; }
    const cv = c.renderer.domElement; q.grab(); const t = document.createElement('canvas'); t.width = 96; t.height = 54; const g = t.getContext('2d'); g.drawImage(cv, 0, 0, 96, 54); const d = g.getImageData(20, 6, 58, 42).data; let s1 = 0, s2 = 0, k = 0; for (let i = 0; i < d.length; i += 4) { const y = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; s1 += y; s2 += y * y; k++; }
    return { f: +Math.min(1, mid[12] / L).toFixed(2), near: +(near / n).toFixed(2), close: +(close / n).toFixed(2), std: +Math.sqrt(Math.max(0, s2 / k - (s1 / k) * (s1 / k))).toFixed(1), L: +L.toFixed(1) }; }; });
const modes = await pg.evaluate(() => (window.__ctx.shared.tour.modes || []).map((m) => [m.key, m.label || m.title || '']));
console.log('modes', JSON.stringify(modes));
await pg.evaluate((k) => { window.__ctx.shared.tour.start(k, { speed: 1 }); }, modeKey); await pg.waitForTimeout(900);
const pause = async (on) => { await pg.evaluate((on) => { const T = window.__ctx.shared.tour; const st = T.state(); if (!!st.paused === !!on) return; const b = [...document.querySelectorAll('#tm-tour-box button')].find((b) => /השהה|המשך/.test(b.textContent)); if (b) b.click(); }, on); await pg.waitForTimeout(120); };
const total = await pg.evaluate(() => window.__ctx.shared.tour.state().total);
let [a, b] = (range && range !== '-' ? range.split('-').map(Number) : [0, total - 1]); b = Math.min(b, total - 1);
console.log('slides', total, 'range', a, b);
const log = fs.createWriteStream(path.join(out, 'vis.jsonl'), { flags: 'a' });
const info = () => pg.evaluate(() => { const c = window.__ctx, q = window.__q, T = c.shared.tour; const st = T.state(); const s = (T.slides || [])[st.idx] || {}; const box = document.getElementById('tm-tour-box');
  const open = (c.shared.modelButtons || []).filter((b) => { try { return b.get && b.get(); } catch (_) { return false; } }).map((b) => b.id);
  const go = (s.go || []).map((g) => g.fp || g.view || (g.place ? 'place:' + g.place : (g.pos ? 'cam' : '?'))).slice(0, 4);
  return { idx: st.idx, total: st.total, kind: s.kind, part: s.part, group: s.group || '', title: s.title || '', key: s.key || '', text: (s.text || '').slice(0, 600), len: (s.text || '').length, go, then: (s.then || []).length, anim: !!s.anim, nofly: !!s.nofly, f_: (s.go && s.go[0] && s.go[0].f) || '', num: box ? (box.querySelector('.num') || {}).textContent : '', paused: !!st.paused, ended: !!st.ended, open, sec: !!(c.shared.section && c.shared.section.on), cam: q.cam(), confirm: q.confirm() }; });
// go to the first slide of the range (the presentation starts at 0)
for (let i = 0; i < a; i++) { await pg.evaluate(() => window.__ctx.shared.tour.next()); await pg.waitForTimeout(60); }
for (let i = a; i <= b; i++) {
  await pg.waitForTimeout(350); await pause(true);
  // a dialog of the cloud: answer it as the viewer who wants to see (yes)
  if (await pg.evaluate(() => window.__q.confirm())) { await pg.evaluate(() => window.__q.confirmYes()); await pg.waitForTimeout(400); }
  await P.settle(30000, 10); await pg.waitForTimeout(500);
  const I = await info(); const v = await pg.evaluate(() => window.__q.view());
  const name = 's' + String(i).padStart(3, '0');
  await pg.screenshot({ path: path.join(out, name + '.jpg'), type: 'jpeg', quality: 72 });
  const rec = { i, name, ri: i, cap: I.title, key: I.kind, label: I.group, ...I, ...v };
  if (LATE) { await pause(false); await pg.waitForTimeout(LATE); await pause(true); await P.settle(20000, 8); const v2 = await pg.evaluate(() => window.__q.view()); const I2 = await info(); await pg.screenshot({ path: path.join(out, name + '_later.jpg'), type: 'jpeg', quality: 72 }); rec.later = { ...v2, cam: I2.cam, idx: I2.idx, open: I2.open }; if (I2.idx !== I.idx) { rec.later.moved = true; } }
  log.write(JSON.stringify(rec) + '\n');
  console.log(i, I.num, '|', I.kind, '|', I.group, '|', I.title, '| f', v.f, 'near', v.near, 'close', v.close, 'std', v.std, '| open', I.open.join(','), I.then ? '| then ' + I.then : '', I.anim ? '| anim' : '');
  if (i < b) { const before = I.idx; await pg.evaluate(() => window.__ctx.shared.tour.next()); await pg.waitForTimeout(200); const st = await pg.evaluate(() => window.__ctx.shared.tour.state()); if (st.ended || !st.running) { console.log('ended at', i); break; } if (st.idx === before) { console.log('did not advance at', i); } }
}
console.log('errs', JSON.stringify(P.errs.slice(0, 5)));
log.end(); fs.writeFileSync(path.join(out, 'done'), '1');
await P.close();
