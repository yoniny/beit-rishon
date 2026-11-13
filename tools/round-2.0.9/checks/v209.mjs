// the morning's service seen by its own cameras (no camera set by hand): node v209.mjs <plugin> <out> "i:s,s,s;i:s,s"
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out, spec] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate(async () => { const S = window.__ctx.shared; S.tamid.setOrder('abba'); S.tour.start('tamid', { speed: 1 }); await new Promise((r) => setTimeout(r, 1500)); });
for (const part of spec.split(';')) {
  const [i, secs] = part.split(':'); const L = secs.split(',').map(Number);
  await pg.evaluate((i) => { const T = window.__ctx.shared.tour; T.pause(false); T.goto(+i); }, i);
  for (const s of L) {
    const t1 = Date.now();
    let st = null;
    while (Date.now() - t1 < 90000) {
      st = await pg.evaluate(() => { const W = window.__ctx.shared.tamid; return { stage: W.stage, sec: +(+W.sec).toFixed(2) }; });
      if (st.sec >= s) break;
      await pg.waitForTimeout(120);
    }
    await P.rshot(out + '/' + st.stage + '_' + String(s).replace('.', '_') + '.png');
    console.log(i, s, JSON.stringify(st));
  }
}
console.log('errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
