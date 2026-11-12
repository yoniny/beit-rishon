// the whole morning's service in real time: node fullrun.mjs <plugin> <order> <speed> - every slide's real length, the errors, the end
import { open } from '../fs/h.mjs';
const [,, dir, order = 'abba', speed = '0.6'] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const r = await pg.evaluate(async ([o, sp]) => { const c = window.__ctx, S = c.shared, T = S.tour, wait = (ms) => new Promise((r) => setTimeout(r, ms));
  S.tamid.setOrder(o); T.start('tamid', { speed: sp }); await wait(300);
  const n = T.slides.length, durs = T.slides.map((s) => s.dur), log = []; let last = -1, t0 = performance.now(), tl = t0;
  for (;;) { await wait(200); const st = T.state(); const now = performance.now();
    if (st.idx !== last) { if (last >= 0) log.push([last, T.slides[last] ? T.slides[last].id : '?', Math.round(now - tl)]); last = st.idx; tl = now; }
    if (!st.running || now - t0 > 1500000) { if (last >= 0) log.push([last, (T.slides[last] || {}).id, Math.round(now - tl), 'end']); break; } }
  return { n, durs, log, total: Math.round(performance.now() - t0), active: S.tamid.active, sun: S.sky.sun.intensity, env: !!c.scene.environment }; }, [order, +speed]);
console.log(JSON.stringify(r));
console.log('errors:', JSON.stringify(P.errs.slice(0, 10)), 'warns:', JSON.stringify((P.warns || []).filter((w) => /tamid/.test(w)).slice(0, 6)));
await P.close(); process.exit(0);
