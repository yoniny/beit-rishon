// list the tour's slides (both modes) and find the ark's demonstration: node plan.mjs <plugin>
import { open } from '../fs/h.mjs';
const [,, dir] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const r = await pg.evaluate(() => {
  const T = window.__ctx.shared.tour, out = {};
  for (const k of ['topics', 'verses']) {
    const L = T.plan(k) || [];
    out[k] = { n: L.length, hits: L.map((s, i) => [i, s.title || s.t || '', JSON.stringify(s.go || s.c || s.res || '').slice(0, 160)]).filter((x) => /ארון|דבקו|ח, |8:|הכרובים|הענן/.test(x[1] + x[2])) };
  }
  out.keys = Object.keys(T);
  return out;
});
console.log(JSON.stringify(r, null, 1));
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
