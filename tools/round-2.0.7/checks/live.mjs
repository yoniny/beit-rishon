// the stages as the viewer sees them: each slide played (not paused), the picture after its flight (wait ms), and where the eye is
// node live.mjs <plugin> <out> [order] [waitMs] [only]
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out, order = 'abba', waitMs = '3800', only] = process.argv;
fs.mkdirSync(out, { recursive: true });
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const n = await pg.evaluate(async (o) => { const S = window.__ctx.shared; S.tamid.setOrder(o); S.tour.start('tamid', { speed: 1 }); await new Promise((r) => setTimeout(r, 1200)); return S.tour.slides.length; }, order);
const sel = only ? only.split(',').map(Number) : [...Array(n).keys()];
for (const i of sel) {
  const info = await pg.evaluate(async ([i, w]) => { const c = window.__ctx, T = c.shared.tour; T.goto(i); await new Promise((r) => setTimeout(r, w));
    const s = T.slides[i], W = c.shared.tamid, g = s.go && s.go[0];
    return { id: s.id, st: W.stage + '@' + (+W.sec).toFixed(1), eye: c.camera.position.toArray().map((v) => +v.toFixed(1)), tg: c.controls.target.toArray().map((v) => +v.toFixed(1)), own: g ? [g.pos, g.target] : null }; }, [i, +waitMs]);
  await P.rshot(out + '/' + String(i).padStart(2, '0') + '-' + info.id + '.png');
  console.log(i, JSON.stringify(info));
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
