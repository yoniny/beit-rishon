// node kidshot.mjs <plugin> <prefix> <secs,...>  - the kiddush's own demo, frames at model seconds
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, pre, ts] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 960, h: 600, frozen: true });
await S.ev(async () => { const SC = window.__SCAN, c = window.__TM_CTX; const b = c.ui.placeButton("קידוש ידיים ורגליים מן הכיור — הדגמה"); SC.clickEl(b); await SC.afterClick(6000); });
let tPrev = 0;
for (const t of ts.split(',').map(Number)) {
  const r = await S.ev(async ({ dt }) => { const SC = window.__SCAN; for (let k = 0; k < Math.round(dt * 1000 / 100); k++) { window.__step(100); if (k % 10 === 0) await SC.sleep(2); } window.__step(16); return SC.jpg(960, 0.85); }, { dt: t - tPrev });
  tPrev = t;
  fs.writeFileSync(`${pre}-${t}.jpg`, Buffer.from(r.split(',')[1], 'base64')); console.log('ok', t);
}
await S.close();
