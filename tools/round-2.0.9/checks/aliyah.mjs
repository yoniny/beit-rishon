// the aliyah's view chip in its card: node aliyah.mjs <plugin> <out.png>
import { open } from '../fs/h.mjs';
const [,, dir, out] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate(() => window.__ctx.ui.placeButton('העלייה והלולין').click());
await pg.waitForTimeout(3500);
const chips = await pg.evaluate(() => [...document.querySelectorAll('#tm-xcard button, #tm-card button, #tm-xcard a[role=button], #tm-card a[role=button]')].map((b) => b.textContent.trim()).filter(Boolean));
console.log('card buttons:', JSON.stringify(chips));
const hit = await pg.evaluate(() => { const b = [...document.querySelectorAll('#tm-xcard a[role=button], #tm-card a[role=button]')].find((x) => /מלמעלה/.test(x.textContent)); if (!b) return null; b.click(); return b.textContent; });
console.log('clicked', hit);
await pg.waitForTimeout(3500); await P.settle(20000, 8);
await P.rshot(out);
console.log(JSON.stringify(await pg.evaluate(() => ({ cam: window.__ctx.camera.position.toArray().map((v) => +v.toFixed(1)), sec: !!(window.__ctx.shared.section && window.__ctx.shared.section.on) }))), 'errors:', JSON.stringify(P.errs.slice(0, 4)));
await P.close(); process.exit(0);
