// node phase.mjs <plugin> <house> [render 0|1] -> per-phase ms of a 300-frame 360 turn (needs the timed build)
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house, rnd] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 1280, h: 720, frozen: true });
const r = await S.ev(async ({ house, rnd }) => { const c = window.__TM_CTX, SC = window.__SCAN; const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0];
  SC.setPose({ p: [tg[0] + 190, 150, tg[2]], t: tg }); for (let i = 0; i < 6; i++) { window.__step(50); await SC.sleep(5); }
  const rr = c.renderer.render; if (rnd !== '1') c.renderer.render = function () {};
  window.__PH = {}; window.__AN = new Map(); const RN = () => new Event("x").timeStamp; const t0 = RN();
  for (let k = 0; k < 300; k++) { const a = k / 300 * Math.PI * 2; c.camera.position.set(tg[0] + 190 * Math.cos(a), 150, tg[2] + 190 * Math.sin(a)); c.controls.target.set(...tg); c.controls.update(); window.__step(16.7); if (k % 25 === 0) await SC.sleep(1); }
  const tot = RN() - t0; c.renderer.render = rr;
  const ph = Object.fromEntries(Object.entries(window.__PH).map(([k, v]) => [k, +(v / 300).toFixed(2)]));
  const an = [...window.__AN.entries()].sort((a, b) => b[1].s - a[1].s).slice(0, 10).map(([f, v]) => [+(v.s / 300).toFixed(2), +v.mx.toFixed(1), v.n1, v.n3, String(f).replace(/\s+/g, ' ').slice(0, 110)]);
  return { perFrame: +(tot / 300).toFixed(2), ph, an };
}, { house, rnd: rnd || '0' });
console.log(JSON.stringify(r, null, 1));
await S.close();
