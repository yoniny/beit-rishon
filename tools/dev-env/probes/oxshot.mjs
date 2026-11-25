import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, pre, ts, chel] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 960, h: 600, frozen: true });
for (const t of ts.split(',').map(Number)) {
  const r = await S.ev(async ({ t, chel }) => {
    const SC = window.__SCAN, c = window.__TM_CTX, B = c.shared.bikkurim;
    if (chel && c.shared.chelSteps.mode !== chel) c.shared.chelSteps.set(chel);
    if (c.shared.gateParochot) c.shared.gateParochot.set('up'); B.setReading('tk'); B.at(t);
    const ox = c.scene.getObjectByName('bikkurimOx'); const T3 = c.THREE; const bx = new T3.Box3().setFromObject(ox); const m = bx.getCenter(new T3.Vector3());
    const P = { p: [m.x + 6, m.y + 1.5, m.z - 1], t: [m.x, m.y + 0.3, m.z] };
    SC.setPose(P); for (let k = 0; k < 3; k++) { window.__step(40); await SC.sleep(5); } B.at(t); SC.setPose(P); window.__step(16);
    // lowest hoof
    const hs = []; ox.traverse((o) => { if (o.isMesh) { const b = new T3.Box3().setFromObject(o); hs.push(+b.min.y.toFixed(2)); } }); hs.sort((a, b) => a - b);
    return { img: SC.jpg(960, 0.85), min: hs.slice(0, 6), c: [m.x, m.y, m.z].map((v) => +v.toFixed(2)) };
  }, { t, chel });
  fs.writeFileSync(`${pre}-${t}.jpg`, Buffer.from(r.img.split(',')[1], 'base64')); console.log(t, JSON.stringify({ ...r, img: 0 }));
}
await S.close();
