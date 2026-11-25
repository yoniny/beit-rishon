import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, pre, secsS] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 1000, h: 640, frozen: true });
const r = await S.ev(async (secsS) => { const c = window.__TM_CTX, SC = window.__SCAN; const b = c.ui.placeButton("ארבעת הפייסות ו״ברקאי״ — הדגמה"); if (!b) return { err: 'no' }; SC.clickEl(b); SC.yes(); window.__step(300); SC.yes();
  const imgs = [], secs = JSON.parse(secsS); let t = 0;
  for (const s of secs) { while (t < s) { window.__step(250); t += 0.25; } window.__step(16); SC.px(16); imgs.push(SC.jpg(1000, 0.88)); }
  return { imgs, running: SC.running() }; }, secsS);
if (r.err) { console.log(r.err); process.exit(0); }
r.imgs.forEach((im, k) => fs.writeFileSync(`${pre}-${k}.jpg`, Buffer.from(im.split(',')[1], 'base64')));
console.log(JSON.stringify(r.running));
await S.close();
