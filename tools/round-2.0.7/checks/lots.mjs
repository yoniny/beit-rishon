// the two linked rows of the first lottery: node lots.mjs <plugin>
import { open } from '../fs/h.mjs';
const [,, dir] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const r = await pg.evaluate(async () => { const c = window.__ctx, S = c.shared, O = c.ui.opinions, wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const A = O.find((r) => /^הפייס הראשון/.test(r.cap)), B = O.find((r) => /^סדר עבודת הבוקר/.test(r.cap));
  const st = () => [A.cur, B.cur, S.payis && S.payis.reading, S.tamid && S.tamid.order].join(' ');
  const out = ['start: ' + st()];
  const pick = (R, k) => { R.onPick(k); if (R.mark) R.mark(k); R.cur = R.cur; };
  pick(A, 'o0'); await wait(100); out.push('A->o0 (Rambam): ' + st());
  pick(B, 'o0'); await wait(100); out.push('B->o0 (Abaye): ' + st());
  pick(B, 'o1'); await wait(100); out.push('B->o1 (Rambam): ' + st());
  pick(A, 'o1'); await wait(100); out.push('A->o1 (Tiferet Yisrael): ' + st());
  return out; });
console.log(r.join('\n'));
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
