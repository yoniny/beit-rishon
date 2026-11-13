import { open } from '../fs/h.mjs';
const [,, dir, out] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const r0 = await pg.evaluate(() => ({ on: window.__ctx.shared.yehoyada.on }));
// the place from the panel: by its title
const ok = await pg.evaluate(() => { const b = window.__q && window.__q.placeBtns ? window.__q.placeBtns().find((x) => x.textContent.indexOf('ארון יהוידע אצל המזבח') >= 0) : null; if (b) { b.click(); return true; } return false; });
await pg.waitForTimeout(3500); await P.settle(15000, 5);
const r1 = await pg.evaluate(() => ({ on: window.__ctx.shared.yehoyada.on }));
await P.rshot(out + '/yh_in.png');
await pg.evaluate(() => { const b = window.__q.placeBtns().find((x) => x.textContent.indexOf('ארון יהוידע שבשער') >= 0); if (b) b.click(); });
await pg.waitForTimeout(3500); await P.settle(15000, 5);
await P.rshot(out + '/yh_out.png');
const warns = P.warns ? P.warns.filter((w) => /labels without/.test(w)).slice(0, 3) : [];
console.log(JSON.stringify({ r0, ok, r1, warns, errs: P.errs.slice(0, 4) }));
await P.close(); process.exit(0);
