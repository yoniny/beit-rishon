// the checks of the round of 12.11.2026 (2.0.5 = B1 1.3.8 + B2 1.9.6): node t5.mjs <plugin dir> <rishon|sheni>
//  both:   the slides' times (7 / 10 / 12 s, no less than 3 s a view); the Sanhedrin's figures in levels (none in full from the opening view);
//          the wheel under a roof (a notch <= 2 amot, a burst <= 16, <= 24 amot a second); a place's section stays while the eye stands in
//          the cut half and goes when it leaves; a stopped demonstration is silent
//  sheni:  the wicket's walk stops the great gate it started; the marble table's loaves are the inner table's; 13 discs over the gates;
//          the place of the two curtains has no section and its eye stands between them; the readings' further views
//  rishon: the upper chamber over the devir has no button of its own; the cherubim's slide has two further views
import { open } from './h.mjs';
const [,, dir, house] = process.argv;
const res = []; const ok = (name, cond, info) => { res.push(!!cond); console.log((cond ? 'OK   ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 360) : '')); };
const P = await open(dir); const pg = P.page;
const place = (t) => pg.evaluate((T) => { const b = [...document.querySelectorAll('#tm-panel details.tm-pl button')].find((b) => b.textContent.trim().indexOf(T) === 0); if (!b) return false; let d = b.closest('details'); while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); } b.click(); return true; }, t);
// ---- the figures' levels (before anything moves)
{
  const lv = await pg.evaluate(() => { const c = window.__ctx; const M = []; c.scene.traverse((o) => { if (o.isInstancedMesh && o.material && o.material.color && o.material.color.getHex() === 0x2f2f36) M.push({ n: o.count, v: o.geometry.attributes.position.count, vis: !!(o.visible && o.parent && o.parent.visible) }); });
    const heavy = Math.max(...M.map((m) => m.v)); return { meshes: M.length, figs: M.reduce((s, m) => s + m.n, 0), heavyVisible: M.filter((m) => m.v === heavy && m.vis).length, visible: M.filter((m) => m.vis).length }; });
  ok('the Sanhedrin\'s figures: two drawn levels of the robe (1400 instances for 700 figures); from the opening view none is drawn in full', lv.figs === 1400 && lv.heavyVisible === 0, lv);
}
// ---- the slides' times
{
  const tt = await pg.evaluate(async () => { const T = window.__ctx.shared.tour, wait = (ms) => new Promise((r) => setTimeout(r, ms)), out = {};
    for (const [nm, sp] of [['fast', 0.6], ['normal', 1], ['slow', 1.5]]) { T.start('topics', { speed: sp }); await wait(400);
      const S = T.slides || [], i0 = S.findIndex((s, i) => i > 0 && !s.anim && !(s.then && s.then.length)), i2 = S.findIndex((s) => !s.anim && s.then && s.then.length === 2), i3 = S.findIndex((s) => !s.anim && s.then && s.then.length === 3);
      T.goto(i0); await wait(250); out[nm] = T.state().slideMs; if (i2 >= 0) { T.goto(i2); await wait(250); out[nm + '2'] = T.state().slideMs; } if (i3 >= 0) { T.goto(i3); await wait(250); out[nm + '3'] = T.state().slideMs; }
      T.stop(); await wait(300); }
    return out; });
  ok('the presentation: 7 / 10 / 12 seconds a slide (fast / normal / slow); a slide of three views 9 at least, of four 12', tt.fast === 7000 && tt.normal === 10000 && tt.slow === 12000 && (tt.fast2 === undefined || tt.fast2 === 9000) && (tt.fast3 === undefined || tt.fast3 === 12000), tt);
}
// ---- the wheel under a roof
{
  const okp = await place(house === 'sheni' ? 'הקודש' : 'ההיכל'); await pg.waitForTimeout(600); await P.settle(30000, 8); await pg.waitForTimeout(500);
  const w = await pg.evaluate(async () => { const c = window.__ctx, el = c.renderer.domElement, wait = (ms) => new Promise((r) => setTimeout(r, ms)), Q = () => c.camera.position.clone(), out = {};
    const wheel = (dy) => el.dispatchEvent(new WheelEvent('wheel', { deltaY: dy, deltaMode: 0, bubbles: true, cancelable: true, clientX: 640, clientY: 400 }));
    out.roofed = window.__ent360.cam.roofed; let a = Q(); wheel(-120); await wait(800); out.notch = +Q().distanceTo(a).toFixed(2);
    // the speed is read at the frames' own boundaries (a callback after the engine's, with the frame's time): windows cut by a timer do not
    // fall on the frames, and under a loaded machine one more frame inside a window read as 29 amot a second (12.11.2026, the last run)
    a = Q(); let maxV = 0, prev = Q(), pt = 0, on = true;
    const tick = (t) => { if (!on) return; const p = Q(); if (pt && t - pt >= 4) maxV = Math.max(maxV, p.distanceTo(prev) / ((t - pt) / 1000)); prev = p; pt = t; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    for (let i = 0; i < 40; i++) { wheel(-300); await wait(8); }
    await wait(1500); on = false;
    out.burst = +Q().distanceTo(a).toFixed(2); out.maxV = +maxV.toFixed(1); return out; });
  ok('the wheel under a roof: a notch moves the eye two amot at most, a burst of forty events sixteen at most, never faster than 24 amot a second', okp && w.roofed === true && w.notch > 0.3 && w.notch <= 2.05 && w.burst <= 16 && w.maxV <= 24, w);
}
// ---- a place's section stays while the eye stands in the cut half
{
  await pg.evaluate(() => { const c = window.__ctx; if (c.shared.closeAuto) c.shared.closeAuto(); });
  const okp = await place('שיפוע רצפת הבית'); await pg.waitForTimeout(600); await P.settle(30000, 8);
  const s = await pg.evaluate(async () => { const c = window.__ctx, wait = (ms) => new Promise((r) => setTimeout(r, ms)), S = () => { const s = c.shared.section || {}; return s.on ? s.axis + s.v : 'off'; };
    const out = { at0: S(), ax: (c.shared.section || {}).axis, v: (c.shared.section || {}).v, eye: c.camera.position.toArray().map((x) => +x.toFixed(1)) }; if (out.at0 === 'off') return out;
    out.inCut = c.camera.position[out.ax] > out.v; await wait(19000); out.after19 = S();
    const p = c.camera.position, q = c.controls.target; if (out.ax === 'z') { p.z = out.v - 30; q.z = out.v - 5; } else if (out.ax === 'x') { p.x = out.v - 30; q.x = out.v - 5; } else { p.y = out.v - 3; q.y = out.v - 6; } c.controls.update(); await wait(5500); out.afterLeaving = S(); return out; });
  ok('a place\'s section stays while the eye stands in the half that it cut away (19 s), and goes within seconds after the eye left', okp && s.at0 !== 'off' && s.inCut === true && s.after19 === s.at0 && s.afterLeaving === 'off', s);
}
// ---- a stopped demonstration is silent
{
  const a = await pg.evaluate(async (house) => { const c = window.__ctx, wait = (ms) => new Promise((r) => setTimeout(r, ms)), AC = window.AudioContext || window.webkitAudioContext, au = window.__au = { closed: 0, made: 0 };
    const oc = AC.prototype.close, ob = AC.prototype.createBufferSource, oo = AC.prototype.createOscillator;
    AC.prototype.close = function () { au.closed++; return oc.apply(this, arguments); }; AC.prototype.createBufferSource = function () { au.made++; return ob.apply(this, arguments); }; AC.prototype.createOscillator = function () { au.made++; return oo.apply(this, arguments); };
    const B = (c.shared.modelButtons || []).find((b) => b.id === (house === 'sheni' ? 'hei-pish-demo' : 'int-doors-demo')), out = {}; if (!B) return { noButton: true };
    B.set(true); await wait(3000); out.made = au.made; B.set(false); await wait(400); out.closed = au.closed; out.running = B.get(); const m1 = au.made; await wait(3500); out.quiet = au.made === m1;
    if (house === 'sheni') { const G = c.shared.greatGate; B.set(true); let t = 0; while (!(G.t0 >= 0) && t < 160) { await wait(500); t++; } out.handOffSec = t / 2; await wait(1500); const c0 = au.closed; out.gateRan = G.t0 >= 0;
      B.set(false); await wait(500); out.closedMore = au.closed - c0; out.gateStill = G.t0 >= 0; const m2 = au.made; await wait(4000); out.quiet2 = au.made === m2; }
    return out; }, house);
  ok('a demonstration stopped by its own button is silent at once' + (house === 'sheni' ? '; the wicket\'s walk stops the great gate that it started' : ''), !a.noButton && a.closed >= 1 && a.running === false && a.quiet === true && (house !== 'sheni' || (a.gateRan === true && a.gateStill === false && a.closedMore >= 1 && a.quiet2 === true)), a);
}
if (house === 'sheni') {
  const m = await pg.evaluate(() => { const c = window.__ctx, out = {}; const br = c.scene.getObjectByName('ulam-table-bread'); out.bread = !!(br && br.isInstancedMesh && c.shared.breadKit && br.geometry === c.shared.breadKit.geo);
    for (const k of ['gates13', 'gates13r']) { const g = c.layers[k]; let gold = 0, red = 0; g.traverse((o) => { if (o.isMesh && o.material && o.material.isMeshBasicMaterial) { const h = o.material.color.getHex(); if (h === 0xe2a400) gold++; else if (h === 0xc23b22) red++; } }); out[k] = gold + '+' + red; }
    const r6 = c.ui.opinions.find((r) => r.cap.indexOf('שער העליון') === 0); out.then13 = r6 && r6.tourThen && r6.tourThen.o1 ? r6.tourThen.o1.length : 0;
    const T = c.shared.tour; T.start('topics', { speed: 1 }); const S = T.slides || []; const sl = S.find((s) => s.kind === 'opinion' && s.title.indexOf('אבא יוסי בן חנן — שלושה עשר') === 0); out.slide13 = sl && sl.then ? sl.then.length : 0;
    const pp = S.find((s) => s.title.indexOf('שתי הפרוכות') === 0); out.par = pp && pp.then ? pp.then.length : 0; const mn = S.find((s) => s.title === 'לשכת שמנים'); out.shmanim = mn && mn.then ? mn.then.length : 0; T.stop(); return out; });
  ok('the marble table in the ulam carries the loaves of the table inside', m.bread, m);
  ok('thirteen discs over the gates in each reading of thirteen (7 gold, 6 red); the reading\'s slide has its two further views', m.gates13 === '7+6' && m.gates13r === '7+6' && m.then13 === 2 && m.slide13 === 2, m);
  ok('slides of several things move among them: the two curtains 2 further views, the oil chamber 3', m.par === 2 && m.shmanim === 3, m);
  await pg.evaluate(() => { const c = window.__ctx; if (c.shared.closeAuto) c.shared.closeAuto(); });
  const okp = await place('שתי הפרוכות'); await pg.waitForTimeout(600); await P.settle(30000, 8); await pg.waitForTimeout(400);
  const pr = await pg.evaluate(() => { const c = window.__ctx, p = c.camera.position; return { sec: !!(c.shared.section && c.shared.section.on), eye: p.toArray().map((x) => +x.toFixed(2)) }; });
  ok('the place of the two curtains: no section, and the eye stands between them (x -45.5..-44.5)', okp && pr.sec === false && pr.eye[0] > -45.5 && pr.eye[0] < -44.5 && Math.abs(pr.eye[2]) < 10, pr);
} else {
  const m = await pg.evaluate(() => { const c = window.__ctx, out = {}; const btns = [...document.querySelectorAll('#tm-panel details.tm-pl button')].map((b) => (b.title || b.textContent).trim());
    out.upper = btns.some((t) => t.indexOf('עליית קודש הקדשים') === 0); out.devir = btns.some((t) => t.indexOf('קודש הקדשים — הדביר') === 0);
    const T = c.shared.tour; T.start('topics', { speed: 1 }); const S = T.slides || []; const ch = S.find((s) => s.title === 'הכרובים'); out.cherubim = ch && ch.then ? ch.then.length : 0;
    out.upperSlide = S.some((s) => s.title.indexOf('עליית קודש הקדשים') === 0); const dv = S.find((s) => s.title.indexOf('קודש הקדשים — הדביר') === 0); out.devirThen = dv && dv.then ? dv.then.length : 0; T.stop(); return out; });
  ok('the upper chamber over the devir is told in the devir\'s card: no button and no slide of its own', m.upper === false && m.devir === true && m.upperSlide === false, m);
  ok('the cherubim\'s slide has two further views (from the entrance, low - their whole height; from the side)', m.cherubim === 2, m);
}
console.log('errs', JSON.stringify(P.errs.slice(0, 4)));
ok('no errors in the console', P.errs.length === 0, P.errs.slice(0, 2));
await P.close();
console.log(res.every(Boolean) ? 'ALL PASS (' + res.length + ')' : 'FAILED ' + res.filter((x) => !x).length + ' of ' + res.length);
process.exit(res.every(Boolean) ? 0 : 1);
