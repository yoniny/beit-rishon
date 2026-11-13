// candidate cameras for a stage at a second (the stage paused there): node cand.mjs <plugin> <out> <json [[name, i, sec, [cam, tg]], ...]>
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out, js] = process.argv; fs.mkdirSync(out, { recursive: true });
const shots = JSON.parse(fs.readFileSync(js, 'utf8'));
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate(async () => { const S = window.__ctx.shared; S.tamid.setOrder('abba'); S.tour.start('tamid', { speed: 1 }); await new Promise((r) => setTimeout(r, 1500)); });
for (const [name, i, sec, cam] of shots) {
  const st = await pg.evaluate(async ([i, sec, cam]) => { const c = window.__ctx, T = c.shared.tour; T.pause(false); T.goto(i); await new Promise((r) => setTimeout(r, 3000)); T.seek(sec); await new Promise((r) => setTimeout(r, 600)); T.pause(true);
    await new Promise((r) => setTimeout(r, 300));
    if (cam) { c.camera.position.set(...cam[0]); c.controls.target.set(...cam[1]); c.camera.lookAt(...cam[1]); c.controls.update && c.controls.update(); }
    const W = c.shared.tamid; return W.stage + '@' + (+W.sec).toFixed(1); }, [i, sec, cam]);
  await pg.waitForTimeout(700); await P.settle(12000, 5);
  await P.rshot(out + '/' + name + '.png');
  console.log(name, st);
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
