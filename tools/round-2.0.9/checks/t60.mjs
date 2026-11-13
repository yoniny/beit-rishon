import { open } from '../fs/h.mjs';
const [,, dir, idx] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate((i) => { const T = window.__ctx.shared.tour; T.start('topics'); setTimeout(() => T.goto(+i), 800); }, idx);
for (let k = 0; k < 6; k++) { await pg.waitForTimeout(2500); console.log(JSON.stringify(await pg.evaluate(() => { const s = window.__ctx.shared.tour.state(); return { running: s.running, mode: s.mode, idx: s.idx, title: s.title.slice(0, 40), total: s.total }; }))); }
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
