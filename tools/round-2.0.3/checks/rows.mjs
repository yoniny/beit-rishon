// list the opinion rows of a plugin dir: node rows.mjs <plugin dir>
import { open } from '/home/claude/qa/fs/h.mjs';
const P = await open(process.argv[2]);
const rows = await P.page.evaluate(() => { const c = window.__ctx; return (c.ui.opinions || []).map((r, ri) => ({ ri, id: r.id || '', cap: r.cap, cur: r.cur, dis: !!r.disabled, cardOnly: !!r.cardOnly, fly: typeof r.fly, opts: (r.options || []).map((o) => o[0] + '=' + o[1]) })); });
for (const r of rows) console.log(String(r.ri).padStart(2), (r.id || '-').padEnd(18), r.cap, '| cur=' + r.cur, r.dis ? 'DISABLED' : '', r.cardOnly ? 'cardOnly' : '', '|', r.opts.join(' ; '));
await P.close();
