// frames of the lotteries' demonstration, one every <every> ms, until it ends: node payis_scan.mjs <plugin> <out> <rambam|tamid> <every ms> <max frames>
import { open } from '/home/claude/qa/fs/h.mjs'; import fs from 'fs'; import path from 'path';
const [,, dir, out, reading, every, count] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir, { vw: 1280, vh: 640, dsf: 1 }); const pg = P.page;
await pg.evaluate((r) => { const c = window.__ctx; c.shared.payis.setReading(r); const b = c.shared.modelButtons.find((b) => b.id === 'crt-payis-demo'); b.set(true); }, reading);
for (let i = 0; i < +count; i++) { await pg.waitForTimeout(+every); await pg.evaluate(() => window.__q.grab()); await pg.screenshot({ path: path.join(out, 'f' + String(i).padStart(2, '0') + '.jpg'), type: 'jpeg', quality: 72 });
  const st = await pg.evaluate(() => { const c = window.__ctx; const b = c.shared.modelButtons.find((b) => b.id === 'crt-payis-demo'); return b.get(); }); if (!st) { console.log('ended at frame', i); break; } }
console.log('errs', JSON.stringify(P.errs.slice(0, 3))); await P.close();
