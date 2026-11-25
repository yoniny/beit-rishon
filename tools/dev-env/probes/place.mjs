// node place.mjs <plugin> <house> <title> <out.jpg> [extra js before] -> click a place button, let the flight end, shoot; prints the camera
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, house, title, out, js] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 1272, h: 830, frozen: true });
const r = await S.ev(async ({ title, js }) => { const c = window.__TM_CTX, SC = window.__SCAN; if (js) (0, eval)(js);
  const b = c.ui.placeButton(title); if (!b) return { err: 'no button' }; SC.clickEl(b); SC.yes();
  for (let i = 0; i < 24; i++) { window.__step(250); await SC.sleep(3); }
  window.__step(16); SC.px(16);
  const cam = c.camera.position, t = c.controls.target;
  return { img: SC.jpg(1272, 0.88), cam: [cam.x, cam.y, cam.z].map((v) => +v.toFixed(2)), tg: [t.x, t.y, t.z].map((v) => +v.toFixed(2)) }; }, { title, js: js || '' });
if (r.err) { console.log(r.err); process.exit(0); }
fs.writeFileSync(out, Buffer.from(r.img.split(',')[1], 'base64')); console.log(JSON.stringify({ cam: r.cam, tg: r.tg }));
await S.close();
