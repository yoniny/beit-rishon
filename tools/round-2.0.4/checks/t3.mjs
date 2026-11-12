// the checks of 11.11.2026 (the user's pictures and recording): node t3.mjs <plugin dir> <rishon|sheni>
//  - the presentation's menu is a menu (under the bar, inside the window, on its own dark ground), and a click of the mouse on a kind starts it
//  - a presentation starts from the model's regular state: what the viewer left open goes off, and comes back when it ends (a demonstration does not)
//  - (the Second Temple) the rows whose view showed nothing: the way from the eye to the matter is free and the picture is not empty, in both shapes of the building
//  - (both) no text of the bundle begins with the mark that safe-lines.mjs writes at line ends
import { open } from './h.mjs'; import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const [,, dir, house] = process.argv;
const res = []; const ok = (name, cond, info) => { res.push(!!cond); console.log((cond ? 'OK   ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 300) : '')); };
// ---- the bundle's template texts
{ const require = createRequire('/home/claude/beit-rishon/tools/'); const acorn = require('acorn'); const code = fs.readFileSync(path.join(dir, 'bundle.js'), 'utf8'); let bad = 0, n = 0;
  acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true, onToken: (t) => { if (t.type.label === 'template') { n++; if (/^ \/\/\r?\n/.test(code.slice(t.start, t.start + 5))) bad++; } } });
  ok('no text of the bundle begins with the line-end mark (' + n + ' template pieces)', bad === 0, { bad }); }
const P = await open(dir, { vw: 1676, vh: 626, dsf: 0.5 }); const pg = P.page;
const st = () => pg.evaluate(() => { const c = window.__ctx; const box = document.getElementById('tm-tour-box'), menu = document.getElementById('tm-tour-menu');
  return { menu: getComputedStyle(menu).display, box: getComputedStyle(box).display, num: (box.querySelector('.num') || {}).textContent || '', ttl: (box.querySelector('.ttl') || {}).textContent || '',
    open: (c.shared.modelButtons || []).filter((b) => { try { return b.get && b.get(); } catch (_) { return false; } }).map((b) => b.id).sort(), sec: !!(c.shared.section && c.shared.section.on) }; });
// ---- the menu
await pg.mouse.click(...(await pg.evaluate(() => { const r = document.getElementById('tm-tour-btn').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }))); await pg.waitForTimeout(350);
const m = await pg.evaluate(() => { const m = document.getElementById('tm-tour-menu'), cs = getComputedStyle(m), r = m.getBoundingClientRect(), bar = document.querySelector('header.topbar').getBoundingClientRect(); const a = (cs.backgroundColor.match(/[\d.]+/g) || []).map(Number);
  return { pos: cs.position, alpha: a.length > 3 ? a[3] : 1, rect: [r.left, r.top, r.right, r.bottom].map(Math.round), barBottom: Math.round(bar.bottom), btnBottom: Math.round(document.getElementById('tm-tour-btn').getBoundingClientRect().bottom), vw: innerWidth, vh: innerHeight,
    items: [...m.querySelectorAll('button')].map((b) => { const r = b.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return { t: b.querySelector('b').textContent, in: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight, at: [x, y], hit: !!top && (top === b || b.contains(top)) }; }) }; });
ok('the presentation\'s menu hangs under its button, inside the window, on its own ground', m.pos === 'absolute' && m.alpha > 0.8 && m.rect[1] >= m.btnBottom - 2 && m.rect[1] <= m.barBottom + 4 && m.rect[3] > m.barBottom + 100 && m.rect[0] >= 0 && m.rect[2] <= m.vw && m.rect[3] <= m.vh, { pos: m.pos, alpha: m.alpha, rect: m.rect, bar: m.barBottom, btn: m.btnBottom });
ok('its three kinds are whole inside the window, each under the mouse at its middle', m.items.length === 3 && m.items.every((i) => i.in && i.hit), m.items.map((i) => [i.t, i.in, i.hit]));
await pg.mouse.click(m.items[0].at[0], m.items[0].at[1]); await pg.waitForTimeout(900);
let s = await st(); ok('a click of the mouse on "' + m.items[0].t + '" starts the presentation', s.box !== 'none' && /^1 \/ \d+/.test(s.num) && s.menu === 'none', s);
const endTour = async () => { for (let i = 0; i < 2; i++) { await pg.evaluate(() => { const b = [...document.querySelectorAll('#tm-tour-box button')].find((b) => /סיום|סגור/.test(b.textContent)); if (b) b.click(); }); await pg.waitForTimeout(700); } };
await endTour();
// ---- from the regular state
const WANT = house === 'rishon' ? ['ui-house', 'ui-yatzia', 'hei-yatzia-section'] : ['ui-house', 'crt-lishkot-roofs', 'hei-ulam-front'];
const DEMO = house === 'rishon' ? 'hei-lulim-demo' : 'hei-mesibah-demo';
await pg.evaluate(([want, demo]) => { const c = window.__ctx; for (const id of want.concat([demo])) { const b = c.shared.modelButtons.find((b) => b.id === id); if (b) b.set(true); } const S = c.shared.section; if (S && typeof S.set === 'function') S.set(true, S.axis, S.v); }, [WANT, DEMO]); await pg.waitForTimeout(900);
const before = await st(); ok('(setting) the viewing tools, a demonstration and the live section are on before the presentation', WANT.every((id) => before.open.includes(id)) && before.open.includes(DEMO) && before.sec, before);
await pg.click('#tm-tour-btn'); await pg.waitForTimeout(300); await pg.evaluate(() => document.querySelectorAll('#tm-tour-menu button')[0].click()); await pg.waitForTimeout(1200); await P.settle(8000, 8);
s = await st(); ok('the presentation starts from the regular state: nothing open, no section', /^1 \/ \d+/.test(s.num) && s.open.filter((id) => id !== 'ui-cloud').length === 0 && !s.sec, s);
await pg.evaluate(() => { const b = [...document.querySelectorAll('#tm-tour-box button')].find((b) => /הבא/.test(b.textContent)); if (b) b.click(); }); await pg.waitForTimeout(600); await P.settle(8000, 8);
s = await st(); ok('and stays so on the next slide', /^2 \/ \d+/.test(s.num) && WANT.every((id) => !s.open.includes(id)) && !s.sec, s);
await endTour(); await pg.waitForTimeout(600);
s = await st(); ok('at its end the viewing tools and the section are back, and the demonstration is not', s.box === 'none' && WANT.every((id) => s.open.includes(id)) && !s.open.includes(DEMO) && s.sec, s);
await pg.evaluate(() => { const c = window.__ctx; c.ui.resetAll(); const S = c.shared.section; if (S && S.on) S.set(false, S.axis, S.v); }); await pg.waitForTimeout(400);
// ---- the rows' views
{
  await pg.evaluate(() => { const c = window.__ctx, q = window.__q, T = c.THREE; const RW = 210, RH = 95, rt = new T.WebGLRenderTarget(RW, RH, { depthBuffer: true });
    const dm = new T.ShaderMaterial({ side: T.DoubleSide, vertexShader: 'varying float vD;\nvoid main() {\n#include <begin_vertex>\n#include <project_vertex>\nvD = -mvPosition.z;\n}', fragmentShader: 'varying float vD;\nvoid main() { float d = clamp(vD, 0.0, 4079.0) / 16.0; gl_FragColor = vec4(floor(d) / 255.0, fract(d), 0.0, 1.0); }' });
    const buf = new Uint8Array(RW * RH * 4);
    q.view = () => { const hidden = []; c.scene.traverse((o) => { if (o.visible === false) return; let hide = false; if (o.isSprite || o.isLine || o.isPoints) hide = true; else if (o.isMesh) { const m = Array.isArray(o.material) ? o.material[0] : o.material; if (!m || m.visible === false || (m.transparent && m.opacity < 0.5)) hide = true; } if (hide) { o.visible = false; hidden.push(o); } });
      const om = c.scene.overrideMaterial, bg = c.scene.background, prev = c.renderer.getRenderTarget(), cc = new T.Color(); c.renderer.getClearColor(cc); const ca = c.renderer.getClearAlpha();
      c.scene.overrideMaterial = dm; c.scene.background = null; c.renderer.setRenderTarget(rt); c.renderer.setClearColor(0xffff00, 1); c.renderer.clear(); q.skip = false; try { c.renderer.render(c.scene, c.camera); } finally { q.skip = true; }
      c.renderer.readRenderTargetPixels(rt, 0, 0, RW, RH, buf); c.renderer.setRenderTarget(prev); c.renderer.setClearColor(cc, ca); c.scene.overrideMaterial = om; c.scene.background = bg; for (const o of hidden) o.visible = true;
      const D = (x, y) => { const i = ((RH - 1 - y) * RW + x) * 4; return (buf[i] + buf[i + 1] / 255) * 16; }; const L = c.controls.target.distanceTo(c.camera.position); const mid = []; for (let y = 45; y <= 49; y++) for (let x = 103; x <= 107; x++) mid.push(D(x, y)); mid.sort((a, b) => a - b);
      let n = 0, near = 0; for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) if (x > RW * 0.22 && x < RW * 0.8 && y > RH * 0.12 && y < RH * 0.9) { n++; if (D(x, y) < 0.35 * L) near++; }
      const cv = c.renderer.domElement; q.grab(); const t = document.createElement('canvas'); t.width = 96; t.height = 54; const g = t.getContext('2d'); g.drawImage(cv, 0, 0, 96, 54); const d = g.getImageData(20, 6, 58, 42).data; let s1 = 0, s2 = 0, k = 0; for (let i = 0; i < d.length; i += 4) { const y = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; s1 += y; s2 += y * y; k++; }
      return { f: +Math.min(1, mid[12] / L).toFixed(2), near: +(near / n).toFixed(2), std: +Math.sqrt(Math.max(0, s2 / k - (s1 / k) * (s1 / k))).toFixed(1), cam: q.cam() }; }; });
  const rows = await pg.evaluate(() => window.__ctx.ui.opinions.map((r) => r.cap));
  const press = async (cap, key) => { await pg.evaluate(() => { const c = window.__ctx; if (c.shared.stopDemos) c.shared.stopDemos(); if (c.shared.closeAuto) c.shared.closeAuto(); c.ui.resetAll(); }); await pg.evaluate(([ri, key]) => { const c = window.__ctx; const r = c.ui.opinions[ri]; const j = r.options.findIndex((o) => o[0] === key); const box = [...document.querySelectorAll('.tm-op')].find((b) => (b.querySelector('.cap') || {}).textContent === r.cap); [...box.querySelectorAll('button')][j].click(); }, [rows.indexOf(cap), key]); await pg.waitForTimeout(700); await pg.evaluate(() => { const q = window.__q; if (q.confirm()) q.confirmYes(); }); await P.settle(30000, 10); await pg.waitForTimeout(500); return pg.evaluate(() => window.__q.view()); };
  if (house === 'sheni') {
  const LIST = [['תקרת האולם', 'o1'], ['תקרת האולם', 'o0'], ['חומר המנורה והשולחן', 'o1'], ['הציור על הפרוכות', 'o0'], ['שערי בית המוקד', 'o0'], ['שערי בית המוקד', 'o1'], ['הרווח שבין הכבש למזבח', 'o1']];
  const shapeRow = 'צורת הבניין — ״צר מאחוריו ורחב מלפניו״';
  for (const shape of ['o1', 'o0']) {
    await press(shapeRow, shape);
    for (const [cap, key] of LIST) { const v = await press(cap, key); const lim = cap === 'תקרת האולם' && key === 'o0' ? 0.65 : 0.3;   // (the vault's view is from inside the hall, between its two walls)
      ok('the view of "' + cap + '" (' + key + ') shows its matter - the building\'s shape ' + (shape === 'o1' ? 'of the Mishnah' : 'of the Rambam'), v.f >= (cap === 'הרווח שבין הכבש למזבח' ? 0.7 : 0.85) && v.near <= lim && v.std >= 12, v); }   // (the gap's view aims into the cleft: the eye's middle ray rests on the ramp's head beside it)
  }
  await press(shapeRow, 'o1');
  const men = await pg.evaluate(() => { const c = window.__ctx; const r = c.ui.opinions.find((r) => r.cap === 'חומר המנורה והשולחן'); r.onPick('o1'); let out = null; c.scene.traverse((o) => { if (out || !o.isMesh) return; const m = Array.isArray(o.material) ? o.material[0] : o.material; if (m && m.color && m.color.getHex() === 0xF4F4F8 && m.map && m.map.image && m.map.image.getContext) { const d = m.map.image.getContext('2d').getImageData(m.map.image.width >> 1, m.map.image.height >> 1, 4, 4).data; let spread = 0; for (let i = 0; i < d.length; i += 4) spread = Math.max(spread, Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2])); out = { spread }; } }); r.onPick('o0'); return out; });
  ok('the silver of the menorah and the table is drawn in grey (not on the gold\'s picture)', !!men && men.spread <= 6, men);
  const cl = await pg.evaluate(() => { const c = window.__ctx; let g = null; c.scene.traverse((o) => { if (o.name === 'rampGapShade') g = o; }); const G = c.shared.rampGap; const a = [!g]; for (const k of ['hair', 'tosafot', 'chaim', 'hair']) a.push(G.set(k)); return a; });
  ok('the ramp\'s head: no dark shade in the cleft (1.9.5: real grooves in the stone), and the gap takes its three readings', !!cl && cl.join() === 'true,hair,tosafot,chaim,hair', cl);
  }
  if (house === 'rishon') {
    // the two rows this round's scan found in the First Temple: the switch flew to a general view where its matter could not be told
    const P1 = 'הפותות — ״והפתות... זהב״';
    let v = await press(P1, 'pivots');
    const a = await pg.evaluate(() => { const c = window.__ctx; const L = c.layers || {}; const pv = c.shared.potot.view('pivots'); const cam = c.camera.position; const d = Math.hypot(cam.x - pv.target[0], cam.y - pv.target[1], cam.z - pv.target[2]); return { d: +d.toFixed(2), pivLabel: !!(L.pototPivots && L.pototPivots.visible), keyLabel: !!(L.pototKeys && L.pototKeys.visible) }; });
    ok('"הפותות" - the pivots: the eye stands close to the lower pivot of the heichal\'s north leaf, and its label shows', a.d < 4.5 && a.pivLabel && !a.keyLabel && v.f >= 0.85 && v.std >= 12, { a, v });
    v = await press(P1, 'rashi');
    const b = await pg.evaluate(() => { const c = window.__ctx, T = c.THREE; let key = null; c.scene.traverse((o) => { if (o.name === 'goldKey' && o.userData.heichal) key = o; }); if (!key) return null; const kp = new T.Vector3(); key.getWorldPosition(kp); const L = c.layers || {}; const p = kp.clone().project(c.camera); return { d: +c.camera.position.distanceTo(kp).toFixed(2), ndc: [+p.x.toFixed(2), +p.y.toFixed(2)], vis: key.visible, pivLabel: !!(L.pototPivots && L.pototPivots.visible), keyLabel: !!(L.pototKeys && L.pototKeys.visible) }; });
    ok('"הפותות" - Rashi: the eye stands close to the key of gold in the lock, the key in the middle of the picture', !!b && b.d < 4 && b.vis && Math.abs(b.ndc[0]) < 0.3 && Math.abs(b.ndc[1]) < 0.3 && b.keyLabel && !b.pivLabel && v.f >= 0.85 && v.std >= 12, { b, v });
    const R1 = 'הכבשים הקטנים';
    v = await press(R1, 'tosafot');
    const r = await pg.evaluate(() => { const c = window.__ctx; return { d: +c.camera.position.distanceTo(c.controls.target).toFixed(1), reading: c.shared.altarRamps.get() }; });
    ok('"הכבשים הקטנים": the eye stands close to the place where they meet the altar', r.d < 20 && r.reading === 'tosafot' && v.f >= 0.75 && v.near <= 0.3 && v.std >= 12, { r, v });   // (the middle ray rests on the raised ramp itself, a little before the point it aims at)
    await press(R1, 'rashi');
  }
}
console.log('errs', JSON.stringify(P.errs.slice(0, 4)));
ok('no errors in the console', P.errs.length === 0, P.errs.slice(0, 2));
await P.close();
console.log(res.every(Boolean) ? 'ALL PASS (' + res.length + ')' : 'FAILED ' + res.filter((x) => !x).length + ' of ' + res.length);
process.exit(res.every(Boolean) ? 0 : 1);
