// node rinfo.mjs <plugin> <house> -> per-frame draw calls / triangles / render ms over a 60-frame 360 turn (render on, small viewport)
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 480, h: 300, frozen: true });
const r = await S.ev(async ({ house }) => { const c = window.__TM_CTX, SC = window.__SCAN, R = c.renderer; const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0];
  const RN = () => new Event('x').timeStamp;
  SC.setPose({ p: [tg[0] + 190, 150, tg[2]], t: tg }); for (let i = 0; i < 150; i++) { window.__step(50); if (i % 10 === 0) await SC.sleep(5); }
  const gl = R.getContext(); let draws = 0; for (const f of ['drawElements', 'drawArrays', 'drawElementsInstanced', 'drawArraysInstanced']) { const o = gl[f]; if (o) gl[f] = function (...a) { draws++; return o.apply(this, a); }; }
  const rr = R.render; let rt = 0, rn = 0; R.render = function (...a) { const t0 = RN(); const x = rr.apply(this, a); rt += RN() - t0; rn++; return x; };
  const calls = [], tris = [], dr = [];
  for (let k = 0; k < 60; k++) { const a = k / 60 * Math.PI * 2; c.camera.position.set(tg[0] + 190 * Math.cos(a), 150, tg[2] + 190 * Math.sin(a)); c.controls.target.set(...tg); c.controls.update(); draws = 0; window.__step(33); calls.push(R.info.render.calls); tris.push(R.info.render.triangles); dr.push(draws); if (k % 10 === 0) await SC.sleep(1); }
  const avg = (a) => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
  return { calls: avg(calls), tris: avg(tris), glDraws: avg(dr), glDrawsMax: Math.max(...dr), renders: rn, renderMs: +(rt / 60).toFixed(1), programs: R.info.programs ? R.info.programs.length : -1, geoms: R.info.memory.geometries, tex: R.info.memory.textures };
}, { house });
console.log(JSON.stringify(r));
await S.close();
