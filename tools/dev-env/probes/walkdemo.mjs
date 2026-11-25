// node walkdemo.mjs <plugin> <title> -> walk mode on, then the demo: the camera's path and brightness over time
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, title, pre] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 480, h: 300, frozen: true });
const r = await S.ev(async (t) => { const c = window.__TM_CTX, SC = window.__SCAN;
  SC.setPose({ p: [110, 9, 0], t: [80, 9, 0] }); for (let i = 0; i < 6; i++) window.__step(50);
  c.shared.walkMode.set(true); for (let i = 0; i < 6; i++) window.__step(50);
  const b = c.ui.placeButton(t); if (!b) return { err: 'no button' }; SC.clickEl(b); SC.yes(); window.__step(300); await SC.sleep(15); SC.yes();
  const out = [], imgs = [];
  for (let k = 0; k < 60; k++) { window.__step(500); const p = c.camera.position; if (k % 4 === 0) { out.push([k / 2, +p.x.toFixed(1), +p.y.toFixed(1), +p.z.toFixed(1), c.shared.walkMode && c.shared.walkMode.on]); window.__step(16); imgs.push(SC.jpg(480, 0.7)); } }
  return { out, imgs, running: SC.running() }; }, title);
if (r.err) { console.log(r.err); process.exit(0); }
r.imgs.forEach((im, i) => fs.writeFileSync(`${pre}-${i}.jpg`, Buffer.from(im.split(',')[1], 'base64')));
for (const x of r.out) console.log(JSON.stringify(x)); console.log(JSON.stringify(r.running));
await S.close();
