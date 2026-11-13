// the morning's service and the switches (B2): node stop.mjs <plugin>
import { open } from '../fs/h.mjs';
const [,, dir] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const st = () => pg.evaluate(() => { const c = window.__ctx, s = c.shared.tour.state(); return { running: s.running, paused: s.paused, mode: s.mode, idx: s.idx, sec: +(+c.shared.tamid.sec).toFixed(1), cam: c.camera.position.toArray().map((v) => +v.toFixed(1)) }; });
// (b) the banner's pause and go on
await pg.evaluate(() => window.__ctx.ui.placeButton('סדר עבודת הבוקר — הדגמה (מסכת תמיד)').click());
await pg.waitForTimeout(6000);
console.log('started', JSON.stringify(await st()));
await pg.click('#tm-tour-box button.pause');
await pg.waitForTimeout(2500);
const a1 = await st(); console.log('paused by banner', JSON.stringify(a1));
await pg.waitForTimeout(2500);
const a2 = await st(); console.log('still paused', JSON.stringify(a2), 'frozen:', a1.sec === a2.sec);
await pg.click('#tm-tour-box button.pause');
await pg.waitForTimeout(3000);
console.log('resumed', JSON.stringify(await st()));
// (a) a place of the panel ends it
const exp = await pg.evaluate(() => { const p = window.__ctx.ui.place('המנורה'); return p ? { cam: p.cam, tg: p.tg } : null; });
await pg.evaluate(() => { const b = window.__ctx.ui.placeButton('המנורה'); b.click(); });
await pg.waitForTimeout(6000);
console.log('after place', JSON.stringify(await st()), 'exp', JSON.stringify(exp));
const day = await pg.evaluate(() => { const c = window.__ctx, lg = c.scene.getObjectByName('labels'); return { labels: lg ? lg.visible : null, pill: [...document.querySelectorAll('.tm-pill')].filter((e) => e.offsetParent).map((e) => e.textContent).join('|').slice(0, 200) }; });
console.log('world', JSON.stringify(day));
await P.rshot('/home/claude/qa/tour209/after_place.png');
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
