import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, stage, fig, pre, secsS] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 800, h: 500, frozen: true });
const r = await S.ev(async ({ stage, fig, secsS }) => { const c = window.__TM_CTX, SC = window.__SCAN, T = c.shared.tour, TM = c.shared.tamid;
  T.start('tamid'); for (let k = 0; k < 4; k++) window.__step(200);
  try { if (T.pause) T.pause(); } catch (_) {}
  const list = TM.list(), i = list.indexOf(stage); const out = [], imgs = [];
  for (const sec of JSON.parse(secsS)) { TM.seek(i, sec); window.__step(30); const st = TM.figAt(fig); if (!st) { out.push([sec, 'nofig']); continue; }
    const p = st.p || [st.x, st.y, st.z]; const x = p[0], z = p[p.length - 1], y = (st.y != null ? st.y : 0);
    const fo = TM.figObj(fig); const w = new c.THREE.Vector3(); fo.g ? fo.g.getWorldPosition(w) : (fo.getWorldPosition ? fo.getWorldPosition(w) : null);
    SC.setPose({ p: [w.x + 1.6, w.y + 2.4, w.z + 1.6], t: [w.x, w.y + 1.3, w.z] }); TM.seek(i, sec); window.__step(16); SC.setPose({ p: [w.x + 1.6, w.y + 2.4, w.z + 1.6], t: [w.x, w.y + 1.3, w.z] }); window.__step(16);
    imgs.push(SC.jpg(800, 0.85)); out.push([sec, w.toArray().map((v) => +v.toFixed(1))]); }
  return { list: list.slice(0, 6), i, out, imgs }; }, { stage, fig, secsS });
console.log(JSON.stringify({ list: r.list, i: r.i, out: r.out }));
r.imgs.forEach((im, k) => fs.writeFileSync(`${pre}-${k}.jpg`, Buffer.from(im.split(',')[1], 'base64')));
await S.close();
