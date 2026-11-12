// the morning's service in the ported B2: node stages.mjs <plugin> <out> [order] [at] [only]  - every stage at a moment, a picture each,
// the errors, and the figures' count of triangles
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out, order = 'abba', at = '0.62', only] = process.argv;
fs.mkdirSync(out, { recursive: true });
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const r0 = await pg.evaluate(async (o) => { const S = window.__ctx.shared; if (!S.tamid) return 'no tamid'; S.tamid.setOrder(o); const ok = S.tour.start('tamid', { speed: 1 }); await new Promise((r) => setTimeout(r, 1500)); S.tour.pause(true); return { ok, n: S.tour.slides.length, ids: S.tour.slides.map((s) => s.id) }; }, order);
console.log('start:', JSON.stringify(r0).slice(0, 400));
const n = r0.n || 0, sel = only ? only.split(',').map(Number) : [...Array(n).keys()];
for (const i of sel) {
  const info = await pg.evaluate(async ([i, at]) => { const c = window.__ctx, T = c.shared.tour; T.goto(i); T.pause(true); await new Promise((r) => setTimeout(r, 400));
    const s = T.slides[i]; T.seek(s.dur * at); await new Promise((r) => setTimeout(r, 300));
    // the eye of the slide (as the other chat's s_stages.mjs: the tour does not move it while paused) - or the stage's moving eye at that second
    const g = s.go && s.go[0], W0 = c.shared.tamid, ck = W0.camAt(i, s.dur * at);
    const pos = ck ? ck[0] : g && g.pos, tg = ck ? ck[1] : g && g.target;
    if (pos && tg) { c.camera.position.set(...pos); c.controls.target.set(...tg); c.camera.lookAt(...tg); c.controls.update(); if (window.__ent360 && window.__ent360.decide) window.__ent360.decide(); }
    await new Promise((r) => setTimeout(r, 250));
    let tris = 0; const W = c.shared.tamid; return { id: s.id, title: s.title || s.t, dur: s.dur, st: W.stage + '@' + (+W.sec).toFixed(1), cam: c.camera.position.toArray().map((v) => +v.toFixed(1)) }; }, [i, +at]);
  await P.rshot(out + '/' + String(i).padStart(2, '0') + '-' + info.id + '.png');
  info.frame = await pg.evaluate(() => { const c = window.__ctx, r = window.__renderer || c.renderer, a = r.info.autoReset; r.info.autoReset = false; r.info.reset(); r.render(c.scene, c.camera); const o = { tris: r.info.render.triangles, calls: r.info.render.calls }; r.info.autoReset = a; return o; });
  console.log(i, JSON.stringify(info));
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 8)));
await P.close(); process.exit(0);
