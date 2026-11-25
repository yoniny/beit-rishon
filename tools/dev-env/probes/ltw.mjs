import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, pre] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 900, h: 600, frozen: true });
const r = await S.ev(async () => { const c = window.__TM_CTX, SC = window.__SCAN, TM = c.shared.tamid; TM.begin(); window.__step(100);
  let grp = null; c.scene.traverse((q) => { if (!grp && q.name === 'night-watch') grp = q.parent; });
  const V = c.camera.position.constructor, W = (x, y, z) => { const v = new V(x, y, z); grp.localToWorld(v); return [v.x, v.y, v.z]; };
  const out = [];
  for (const [sec, cam, tg] of [[19.9, [-73.6, 1.5, -73.9], [-72.1, 0.9, -75.8]], [19.9, [-74.4, 1.1, -75.6], [-72.0, 0.9, -75.8]], [19.9, [-72.3, 2.6, -73.6], [-72.1, 0.8, -75.8]], [18.7, [-74.6, 2.2, -78.6], [-72.4, 1.2, -76.2]]]) {
    TM.seek(0, sec, 'abba'); SC.setPose({ p: W(...cam), t: W(...tg) }); window.__step(16); SC.px(16); out.push(SC.jpg(900, 0.86)); }
  return out; });
r.forEach((im, k) => fs.writeFileSync(`${pre}-${k}.jpg`, Buffer.from(im.split(',')[1], 'base64')));
await S.close();
