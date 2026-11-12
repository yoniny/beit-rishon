// the pause of the demonstrations, in real time: node p1.mjs <plugin> <rishon|sheni>
import { open } from '../fs/h.mjs';
const [,, dir, house] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const res = [];
const ok = (n, c, i) => { const l = (c ? 'PASS ' : 'FAIL ') + n + ' ' + JSON.stringify(i); res.push(l); console.log(l); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const vp = await pg.evaluate(() => { const r = window.__ctx.renderer.domElement.getBoundingClientRect(); return [r.left + r.width * 0.5, r.top + r.height * 0.55]; });
const pressModel = async () => { await pg.mouse.move(vp[0], vp[1]); await pg.mouse.down(); await wait(60); await pg.mouse.up(); await wait(200); };
const bar = () => pg.evaluate(() => { const el = document.getElementById('tm-dpause'); if (!el) return null; return { on: el.style.display !== 'none', btns: [...el.querySelectorAll('button')].filter((b) => b.style.display !== 'none').map((b) => b.textContent) }; });
const clickBar = (txt) => pg.evaluate((t) => { const b = [...document.querySelectorAll('#tm-dpause button')].find((x) => x.textContent.indexOf(t) >= 0 && x.style.display !== 'none'); if (!b) return false; b.click(); return true; }, txt);
const entry = (id) => pg.evaluate((id) => { const d = window.__ctx.shared.demoStops.find((x) => x.id === id); if (!d) return null; return { running: d.running(), paused: d.paused ? d.paused() : null }; }, id);
async function scene(name, startFn, nowFn, id, minRun) {
  await pg.evaluate(startFn);
  await wait(minRun);
  const n0 = await pg.evaluate(nowFn);
  await pressModel();
  const e1 = await entry(id), b1 = await bar(), n1 = await pg.evaluate(nowFn);
  await wait(2000);
  const n2 = await pg.evaluate(nowFn);
  ok(name + ': a press pauses it (not ended)', e1 && e1.running && e1.paused, e1);
  ok(name + ': its clock stands while paused', Math.abs(n2 - n1) < 0.05, { n0: +(+n0).toFixed(2), n1: +(+n1).toFixed(2), n2: +(+n2).toFixed(2) });
  ok(name + ': the bar says "המשך"', b1 && b1.on && b1.btns.some((t) => t.indexOf('המשך') >= 0), b1);
  await clickBar('המשך');
  await wait(1500);
  const n3 = await pg.evaluate(nowFn), e3 = await entry(id), b3 = await bar();
  ok(name + ': "המשך" goes on from the same second', e3 && e3.running && !e3.paused && n3 > n2 + 0.8 && n3 < n2 + 2.6, { n2: +(+n2).toFixed(2), n3: +(+n3).toFixed(2) });
  ok(name + ': the bar says "השהה" again', b3 && b3.btns.some((t) => t.indexOf('השהה') >= 0), b3);
  await clickBar('עצור');
  await wait(600);
  const e4 = await entry(id), b4 = await bar();
  ok(name + ': "עצור" ends it and the bar goes', e4 && !e4.running && b4 && !b4.on, { e4, b4 });
}
const btnOn = (id) => pg.evaluate((id) => { const b = window.__ctx.shared.modelButtons.find((x) => x.id === id); b.set(true); }, id);
const walkNow = () => { const w = window.__ctx.shared.walk; return w && w.now ? w.now() : -9; };
if (house === 'sheni') {
  await scene('lotteries', () => window.__ctx.shared.payis.start(), () => window.__ctx.shared.payis.now(), 'crt-payis-demo', 6000);
  await pg.evaluate(() => window.__ctx.shared.payis.start()); await wait(5000); await pressModel();
  await clickBar('מההתחלה'); await wait(800);
  const r0 = await pg.evaluate(() => window.__ctx.shared.payis.now());
  ok('lotteries: "מההתחלה" starts again', r0 >= 0 && r0 < 1.5, { r0 });
  await clickBar('עצור'); await wait(500);
  await btnOn('hei-mesibah-demo'); await wait(300);
  await scene('mesibah walk', () => 0, walkNow, 'walk', 5000);
  await btnOn('hei-gate-demo'); await wait(300);
  await scene('great gate', () => 0, walkNow, 'hei-gate-demo', 5000);
  await btnOn('hei-pish-demo'); await wait(300);
  await scene('wickets', () => 0, walkNow, 'hei-pish-demo', 5000);
} else {
  await scene('throne ascent', () => { const T = window.__ctx.shared.throne; T.ascent.start(T.versions.find((v) => v !== 'pesukim')); }, () => window.__ctx.shared.throne.ascent.elapsed(), 'palaceThroneAscent', 6000);
  await pg.evaluate(() => window.__ctx.shared.throne.ascent.start()); await wait(4000); await pressModel();
  await clickBar('מההתחלה'); await wait(800);
  const r0 = await pg.evaluate(() => window.__ctx.shared.throne.ascent.elapsed());
  ok('throne: "מההתחלה" starts again', r0 >= 0 && r0 < 1.5, { r0 });
  await clickBar('עצור'); await wait(500);
  await btnOn('hei-lulim-demo'); await wait(300);
  const mk0 = await pg.evaluate(() => 0);
  await scene('lulim walk', () => 0, walkNow, 'walk', 7000);
}
// a switch still ends a demonstration
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
console.log(res.every((x) => x.startsWith('PASS')) ? 'ALL PASS (' + res.length + ')' : 'FAILED');
await P.close(); process.exit(0);
