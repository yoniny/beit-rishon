// node cpurot.mjs <plugin> <house> -> CPU cost per frame (rendering switched off) while the view turns 360 from above the courts
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 1280, h: 720, frozen: true });
const r = await S.ev(async (house) => {
  const c = window.__TM_CTX, SC = window.__SCAN;
  const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0], R = house === 'sheni' ? 190 : 140, H = house === 'sheni' ? 150 : 110;
  SC.setPose({ p: [tg[0] + R, H, tg[2]], t: tg });
  for (let i = 0; i < 4; i++) { window.__step(50); await SC.sleep(5); }
  const rr = c.renderer.render; let rn = 0; c.renderer.render = function () { rn++; };
  const ft = [];
  for (let k = 0; k < 240; k++) {
    const a = k / 240 * Math.PI * 2;
    c.camera.position.set(tg[0] + R * Math.cos(a), H, tg[2] + R * Math.sin(a)); c.controls.target.set(tg[0], tg[1], tg[2]); c.controls.update();
    const t0 = performance.now(); window.__step(16); ft.push(performance.now() - t0);
    if (k % 30 === 0) await SC.sleep(1);
  }
  c.renderer.render = rr;
  ft.sort((a, b) => a - b);
  const sum = ft.reduce((a, b) => a + b, 0);
  return { renders: rn, avg: +(sum / ft.length).toFixed(2), p50: +ft[120].toFixed(2), p95: +ft[228].toFixed(2), max: +ft[239].toFixed(1), over50: ft.filter((x) => x > 50).length };
}, house);
console.log(JSON.stringify(r));
await S.close();
