// the demonstration in real time: node rt.mjs <plugin> <outdir> [no]  ("no" answers the cloud question with "ביטול")
import { open } from '../fs/h.mjs';
const [,, dir, out, ans] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const before = await pg.evaluate(() => { const c = window.__ctx, A = c.shared.arkParts; return { cloud: c.ui.cloudOn(), body: A.body.every((o) => o.visible), staffs: A.staffs.every((o) => o.visible), layoutHidden: c.shared.kodeshLayout.hidden }; });
await pg.evaluate(() => window.__ctx.shared.arkGates.demo());
await pg.waitForTimeout(400);
const dlg = await pg.evaluate(() => { const cf = document.getElementById('tm-confirm'); return cf && cf.style.display; });
if (dlg === 'flex') await pg.click(ans === 'no' ? '#tm-confirm .n' : '#tm-confirm .y');
const t0 = Date.now();
const SLOW = 1.5, LEAD = 1.4;
const at = [1, 10, 21.5, 31, 37, 44, 49.5, 60, 68.3, 77.5, 84.5];   // SEU_SHEARIM_208: the times after the prayer +7.5
const log = [];
for (const t of at) {
  const real = (t + LEAD) * SLOW * 1000;
  const wait = real - (Date.now() - t0);
  if (wait > 0) await pg.waitForTimeout(wait);
  const st = await pg.evaluate(() => { const c = window.__ctx, W = c.shared.walk, cap = document.getElementById('tm-walk-cap'); return { now: +W.now().toFixed(2), cap: cap ? cap.textContent.slice(0, 40) : '', cloud: c.ui.cloudOn(), pills: document.body.classList.contains('tm-arkdemo') }; });
  log.push([t, st]);
  await P.rshot(out + '/rt_' + String(t).replace('.', '_') + '.png');
}
const TEND = await pg.evaluate(() => window.__ctx.shared.arkGates.T.end);
await pg.waitForTimeout(Math.max(0, (TEND + LEAD + 1.5) * SLOW * 1000 - (Date.now() - t0)));
const after = await pg.evaluate(() => { const c = window.__ctx, A = c.shared.arkParts, D = c.shared.devirDoor, Pp = D.parts(D.current); return { running: c.shared.arkGates.isRunning(), walk: c.shared.walk.on, cloud: c.ui.cloudOn(), body: A.body.every((o) => o.visible), staffs: A.staffs.every((o) => o.visible), swell: A.swell.every((o) => o.visible), curtain: Pp.curtain.every((o) => o.visible), hinge: Pp.hinges.map((h) => +h.hinge.rotation.y.toFixed(3)), layoutHidden: c.shared.kodeshLayout.hidden, pills: document.body.classList.contains('tm-arkdemo'), grp: c.root.getObjectByName('arkGates').visible }; });
console.log('before', JSON.stringify(before));
for (const l of log) console.log(JSON.stringify(l));
console.log('after', JSON.stringify(after));
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
