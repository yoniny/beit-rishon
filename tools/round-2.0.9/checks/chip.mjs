// one chip of the opinions table, photographed: node chip.mjs <plugin> <out.png> <caption> <option index>
import { open } from '../fs/h.mjs';
const [,, dir, out, cap, j] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const r = await pg.evaluate(([cap, j]) => { const box = [...document.querySelectorAll('.tm-op')].find((b) => (b.querySelector('.cap') || {}).textContent === cap); if (!box) return 'no box'; const b = box.querySelectorAll('button')[+j]; if (!b) return 'no button'; b.click(); return b.textContent; }, [cap, j]);
await pg.waitForTimeout(3500); await P.settle(20000, 8);
await P.rshot(out);
console.log(r, JSON.stringify(await pg.evaluate(() => ({ cam: window.__ctx.camera.position.toArray().map((v) => +v.toFixed(1)), ray: window.__q.ray() }))), 'errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
