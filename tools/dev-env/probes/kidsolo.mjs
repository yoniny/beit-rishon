import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 640, h: 400, frozen: true });
const shots = [];
const r = await S.ev(async () => { const c = window.__TM_CTX, SC = window.__SCAN, out = [];
  const b = c.ui.placeButton("קידוש ידיים ורגליים מן הכיור — הדגמה"); SC.clickEl(b); SC.yes(); window.__step(300);
  const imgs = [];
  for (let k = 1; k <= 80; k++) { window.__step(500); if (k % 10 === 0) { window.__step(16); imgs.push(SC.jpg(640, 0.8)); const cap = document.getElementById('tm-kidd-cap'); out.push([k / 2, SC.running(), c.renderer.toneMappingExposure.toFixed(2), cap && cap.style.display !== 'none' ? cap.textContent.slice(0, 40) : '-']); } }
  // the morning's service after it
  const T = c.shared.tour; T.start('tamid'); for (let k = 0; k < 8; k++) window.__step(500); window.__step(16); imgs.push(SC.jpg(640, 0.8)); out.push(['tamid', SC.running(), c.renderer.toneMappingExposure.toFixed(2)]);
  return { out, imgs }; });
r.imgs.forEach((im, i) => fs.writeFileSync(`ks-${i}.jpg`, Buffer.from(im.split(',')[1], 'base64')));
for (const x of r.out) console.log(JSON.stringify(x));
await S.close();
