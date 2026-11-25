// node spikes.mjs <plugin> <house> <render 0|1> -> per-frame time distribution of a 600-frame 360 turn
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house, rnd] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 320, h: 200, frozen: true });
const r = await S.ev(async ({ house, rnd }) => { const c = window.__TM_CTX, SC = window.__SCAN; const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0];
  const RN = () => new Event('x').timeStamp;
  SC.setPose({ p: [tg[0] + 190, 150, tg[2]], t: tg }); for (let i = 0; i < 200; i++) { window.__step(50); if (i % 10 === 0) await SC.sleep(5); }
  const rr = c.renderer.render; if (rnd !== '1') c.renderer.render = function () {};
  const ft = [];
  for (let k = 0; k < 600; k++) { const a = k / 600 * Math.PI * 2; c.camera.position.set(tg[0] + 190 * Math.cos(a), 150, tg[2] + 190 * Math.sin(a)); c.controls.target.set(...tg); c.controls.update(); const t0 = RN(); window.__step(16.7); ft.push(RN() - t0); if (k % 50 === 0) await SC.sleep(1); }
  c.renderer.render = rr;
  const s = ft.slice().sort((a, b) => a - b), q = (p) => +s[Math.floor(p * (s.length - 1))].toFixed(2);
  const big = ft.map((v, i) => [i, +v.toFixed(1)]).filter(([, v]) => v > q(0.5) * 3 + 1);
  return { p50: q(0.5), p95: q(0.95), p99: q(0.99), max: q(1), mean: +(ft.reduce((a, b) => a + b, 0) / ft.length).toFixed(2), spikes: big.length, spikeFrames: big.slice(0, 30) };
}, { house, rnd: rnd || '0' });
console.log(JSON.stringify(r));
await S.close();
