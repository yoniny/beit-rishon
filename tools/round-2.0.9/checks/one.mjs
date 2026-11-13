// one place of the panel, photographed: node one.mjs <plugin> <out.png> <title> [wait ms]
import { open } from '../fs/h.mjs';
const [,, dir, out, title, w] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate((t) => window.__ctx.ui.placeButton(t).click(), title);
await pg.waitForTimeout(+(w || 3500));
await P.settle(20000, 8);
await P.rshot(out);
console.log(JSON.stringify(await pg.evaluate(() => ({ cam: window.__ctx.camera.position.toArray().map((v) => +v.toFixed(1)) }))), 'errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
