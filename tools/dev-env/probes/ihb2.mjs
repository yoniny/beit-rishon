import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, pre] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 1280, h: 800, frozen: true });
const r = await S.ev(async () => { const c = window.__TM_CTX, SC = window.__SCAN, T = c.shared.tour; T.start('tamid'); const imgs = [];
  for (let k = 1; k <= 60; k++) { window.__step(500); if (k % 6 === 0) { window.__step(16); imgs.push(SC.jpg(1280, 0.9)); } } return imgs; });
r.forEach((im, k) => fs.writeFileSync(`${pre}-${k}.jpg`, Buffer.from(im.split(',')[1], 'base64')));
await S.close();
