// the ark's demonstration inside the presentation: node ark.mjs <plugin> <outdir> <mode: verses|topics> [no]
import { open } from '../fs/h.mjs';
const [,, dir, out, mode, ans] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const idx = await pg.evaluate((mode) => {
  const T = window.__ctx.shared.tour; T.start(mode);
  const L = T.plan(mode); return L.findIndex((s) => /דבקו שערים/.test(s.title || ''));
}, mode);
console.log('slide', idx);
await pg.waitForTimeout(1500);
await pg.evaluate((i) => window.__ctx.shared.tour.goto(i), idx);
const t0 = Date.now(); let answered = false; const log = []; let shot = 0;
while (Date.now() - t0 < 240000) {
  await pg.waitForTimeout(answered ? 6000 : 700);
  const st = await pg.evaluate(() => { const c = window.__ctx, T = c.shared.tour, s = T.state(), cf = document.getElementById('tm-confirm'); return { idx: s.idx, title: s.title.slice(0, 40), waiting: s.waiting, el: Math.round(s.elapsed / 1000), ms: Math.round(s.slideMs / 1000), run: c.shared.arkGates.isRunning(), now: c.shared.walk && c.shared.walk.on ? +c.shared.walk.now().toFixed(1) : null, dlg: cf ? cf.style.display : '', cap: (document.getElementById('tm-walk-cap') || {}).textContent ? document.getElementById('tm-walk-cap').textContent.slice(0, 30) : '' }; });
  log.push([Math.round((Date.now() - t0) / 1000), st]);
  if (!answered && st.dlg === 'flex') { await pg.click(ans === 'no' ? '#tm-confirm .n' : '#tm-confirm .y'); answered = true; log.push(['answered', ans || 'yes']); continue; }
  if (answered && shot < 6 && st.run) { await P.rshot(out + '/' + mode + '_' + (shot++) + '.png'); }
  if (st.idx !== idx) { log.push(['moved on']); break; }
}
for (const l of log) console.log(JSON.stringify(l));
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
