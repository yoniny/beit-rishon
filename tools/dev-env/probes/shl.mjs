// node shl.mjs <plugin> <prefix> <t,t,...> -> images of the Shiloach demo at those seconds (its own eye), plus T
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, pre, ts] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 960, h: 600, frozen: true });
const T = await S.ev(async () => JSON.stringify(window.__TM_CTX.shared.shiloach.T));
console.log(T);
for (const t of ts.split(',').map(Number)) {
  const r = await S.ev(async (t) => { const SC = window.__SCAN, L = window.__TM_CTX.shared.shiloach; let o = L.at(t); for (let k = 0; k < 3; k++) { window.__step(40); await SC.sleep(5); } o = L.at(t); if (o.cam) SC.setPose({ p: o.cam.p || o.cam[0], t: o.cam.t || o.cam[1] }); window.__step(16); return { img: SC.jpg(960, 0.85), cam: o.cam }; }, t);
  fs.writeFileSync(`${pre}-${t}.jpg`, Buffer.from(r.img.split(',')[1], 'base64')); console.log(t, JSON.stringify(r.cam).slice(0, 160));
}
await S.close();
