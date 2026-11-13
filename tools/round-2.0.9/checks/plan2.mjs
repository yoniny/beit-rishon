import { open } from '../fs/h.mjs';
const [,, dir, pat] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const r = await pg.evaluate((pat) => { const T = window.__ctx.shared.tour, re = new RegExp(pat); const L = T.plan('topics') || []; return L.map((s, i) => [i, s.title, JSON.stringify(s).slice(0, 300)]).filter((x) => re.test(x[1])); }, pat);
console.log(JSON.stringify(r, null, 1));
await P.close(); process.exit(0);
