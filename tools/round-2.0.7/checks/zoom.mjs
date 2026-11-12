// zoom to the cursor, with real wheel events: node z1.mjs <plugin> <rishon|sheni> <out>
//   1. in the open: the point under a pixel near the lower-right corner stays under it and comes nearer (zoom in), and back (zoom out)
//   2. over the sky: no error, the eye moves
//   3. under a roof (a place inside the house): the eye stops before the wall (>= 1.5) and never moves more than 2 amot an event
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, house, out] = process.argv;
fs.mkdirSync(out, { recursive: true });
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const res = [];
const ok = (name, cond, info) => { res.push((cond ? 'PASS ' : 'FAIL ') + name + ' ' + JSON.stringify(info)); };
const vp = await pg.evaluate(() => { const r = window.__ctx.renderer.domElement.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
const proj = (p) => pg.evaluate((p) => { const c = window.__ctx, v = new (c.camera.position.constructor)(p[0], p[1], p[2]).project(c.camera), r = c.renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height, c.camera.position.distanceTo(new (c.camera.position.constructor)(p[0], p[1], p[2]))]; }, p);
const wheel = async (x, y, n, dy) => { await pg.mouse.move(x, y); for (let i = 0; i < n; i++) { await pg.mouse.wheel(0, dy); await new Promise((r) => setTimeout(r, 60)); } await new Promise((r) => setTimeout(r, 1400)); };
// 1. in the open
const sx = vp[0] + vp[2] * 0.78, sy = vp[1] + vp[3] * 0.72;
const A = await pg.evaluate(([x, y]) => window.__zoomQA.at(x, y), [sx, sy]);
const b0 = await proj(A);
await P.rshot(out + '/1a-before.png');
await wheel(sx, sy, 6, -100);
const b1 = await proj(A);
await P.rshot(out + '/1b-after-in.png');
ok('open: the point stays under the cursor (px)', Math.hypot(b1[0] - sx, b1[1] - sy) < 4, { before: [+(b0[0] - sx).toFixed(1), +(b0[1] - sy).toFixed(1)], after: [+(b1[0] - sx).toFixed(1), +(b1[1] - sy).toFixed(1)] });
ok('open: it came nearer', b1[2] < b0[2] * 0.85, { d0: +b0[2].toFixed(1), d1: +b1[2].toFixed(1) });
await wheel(sx, sy, 6, 100);
const b2 = await proj(A);
ok('open: zoom out - still under the cursor, farther again', Math.hypot(b2[0] - sx, b2[1] - sy) < 4 && b2[2] > b1[2] * 1.15, { off: [+(b2[0] - sx).toFixed(1), +(b2[1] - sy).toFixed(1)], d2: +b2[2].toFixed(1) });
// 2. over the sky (the top edge)
const e0 = await pg.evaluate(() => window.__ctx.camera.position.toArray());
const SKY = await pg.evaluate(([l, t, w, h]) => { const cv = window.__ctx.renderer.domElement, c = window.__ctx, d = c.camera.position.distanceTo(c.controls.target);
  for (const fy of [0.08, 0.12, 0.16, 0.2, 0.25, 0.3]) for (const fx of [0.5, 0.3, 0.7, 0.15, 0.85]) { const x = l + w * fx, y = t + h * fy; if (document.elementFromPoint(x, y) !== cv) continue;
    const p = window.__zoomQA.at(x, y); if (!p) continue; const dd = c.camera.position.distanceTo(new (c.camera.position.constructor)(...p)); if (Math.abs(dd - Math.max(4, d)) < 0.5) return [x, y]; } return null; }, vp);
res.push('INFO sky pixel ' + JSON.stringify(SKY));
if (SKY) await wheel(SKY[0], SKY[1], 3, -100);
const e1 = await pg.evaluate(() => window.__ctx.camera.position.toArray());
ok('sky: the eye moved', !SKY || Math.hypot(e1[0] - e0[0], e1[1] - e0[1], e1[2] - e0[2]) > 0.5, { moved: +Math.hypot(e1[0] - e0[0], e1[1] - e0[1], e1[2] - e0[2]).toFixed(1) });
// 3. under a roof: inside the house, the cursor on a wall
const inside = house === 'rishon' ? { pos: [-8, 34, 0], tg: [-28, 24, 0] } : { pos: [-20, 27.6, 7], tg: [-33.5, 24.4, 0] };   // (B1: the view "kodesh", inside the Heichal)
await pg.evaluate((v) => { const c = window.__ctx; c.camera.position.set(...v.pos); c.controls.target.set(...v.tg); c.camera.lookAt(...v.tg); c.controls.update(); if (window.__ent360 && window.__ent360.decide) window.__ent360.decide(); }, inside);
await new Promise((r) => setTimeout(r, 600));
const wx = vp[0] + vp[2] * 0.62, wy = vp[1] + vp[3] * 0.5;
const W = await pg.evaluate(([x, y]) => window.__zoomQA.at(x, y), [wx, wy]);
const w0 = await proj(W);
const trail = [];
await pg.mouse.move(wx, wy);
for (let i = 0; i < 25; i++) { const a = await pg.evaluate(() => window.__ctx.camera.position.toArray()); await pg.mouse.wheel(0, -300); await new Promise((r) => setTimeout(r, 40)); const b = await pg.evaluate(() => window.__ctx.camera.position.toArray()); trail.push(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])); }
await new Promise((r) => setTimeout(r, 2500));
const w1 = await proj(W);
await P.rshot(out + '/3-roof-after.png');
ok('roof: stopped before the wall (>= 1.9)', w1[2] >= 1.9, { d0: +w0[2].toFixed(2), d1: +w1[2].toFixed(2) });
ok('roof: never more than 2 amot in 40 ms', Math.max(...trail) <= 2.05, { max: +Math.max(...trail).toFixed(2) });
ok('roof: the wall point stays under the cursor (px, the guards may move the eye a little)', Math.hypot(w1[0] - wx, w1[1] - wy) < 12, { off: [+(w1[0] - wx).toFixed(1), +(w1[1] - wy).toFixed(1)] });
console.log(res.join('\n'));
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
console.log(res.filter((x) => !x.startsWith('INFO')).every((x) => x.startsWith('PASS')) ? 'ALL PASS (' + res.filter((x) => !x.startsWith('INFO')).length + ')' : 'FAILED');
await P.close(); process.exit(0);
