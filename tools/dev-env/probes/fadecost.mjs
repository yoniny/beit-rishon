import { openHouse, sleep } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 1280, h: 720, frozen: true });
const poses = { calm: null, court: { p: [140, 60, 40], t: [20, 20, 0] }, inCourt: { p: [60, 22, 50], t: [20, 18, 0] }, mount: { p: [0, 30, 200], t: [0, 15, 80] } };
const r = await S.ev(async (poses) => {
  const c = window.__TM_CTX, SC = window.__SCAN, out = {};
  const fade = c.animated.find((f) => /if\(e-[A-Za-z]+>140\)/.test(String(f)) || /> 140\)/.test(String(f).slice(0, 80)));
  if (!fade) return { err: 'no fade fn' };
  let tt = 1e7;
  for (const [k, pose] of Object.entries(poses)) {
    if (pose) SC.setPose(pose);
    for (let i = 0; i < 3; i++) { window.__step(50); await SC.sleep(5); }
    for (let i = 0; i < 3; i++) { tt += 200; fade(tt); }
    const t0 = performance.now(); const N = 15;
    for (let i = 0; i < N; i++) { tt += 200; fade(tt); }
    out[k] = +((performance.now() - t0) / N).toFixed(2);
  }
  out.fadeOn = c.shared.fadeState && c.shared.fadeState.on;
  return out;
}, poses);
console.log(JSON.stringify(r));
await S.close();
