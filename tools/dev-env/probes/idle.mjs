// node idle.mjs <plugin> <house> -> frames skipped while idle, while turning, and in a demo
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 320, h: 200, frozen: true });
const r = await S.ev(async () => { const c = window.__TM_CTX, SC = window.__SCAN, I = window.__ent360.idle, R = c.renderer; let draws = 0; const rr = R.render; R.render = function (...a) { draws++; return rr.apply(this, a); };
  const run = (n, f) => { const s0 = I.skipped, d0 = draws; for (let k = 0; k < n; k++) { if (f) f(k); window.__step(16.7); } return { skipped: I.skipped - s0, draws: draws - d0 }; };
  SC.setPose({ p: [200, 150, 0], t: [20, 15, 0] }); run(10);
  const idle = run(300);   // 5 s still
  const turn = run(120, (k) => { const a = k / 120 * 6.28; c.camera.position.set(20 + 190 * Math.cos(a), 150, 190 * Math.sin(a)); });
  const after = run(60);
  c.requestRender(); const req = run(2);
  return { idle, turn, after, req };
});
console.log(JSON.stringify(r));
await S.close();
