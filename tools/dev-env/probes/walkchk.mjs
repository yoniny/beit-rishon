import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, pose] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 1280, h: 720, frozen: true });
const r = await S.ev(async (pose) => {
  const c = window.__TM_CTX, SC = window.__SCAN;
  SC.setPose(pose); for (let i = 0; i < 4; i++) { window.__step(50); await SC.sleep(5); }
  const before = c.camera.position.toArray().map((v) => +v.toFixed(1));
  const W = c.shared.walkMode; if (!W) return { err: 'no walkMode', keys: Object.keys(c.shared).filter((k) => /walk/i.test(k)) };
  let err = null; try { W.set(true); } catch (e) { err = String(e && e.message); }
  for (let i = 0; i < 6; i++) { window.__step(50); await SC.sleep(5); }
  const after = c.camera.position.toArray().map((v) => +v.toFixed(1)), tg = c.controls.target.toArray().map((v) => +v.toFixed(1));
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === '🚶');
  return { before, after, tg, on: W.on, err, btnClass: btn && btn.className };
}, JSON.parse(pose));
console.log(JSON.stringify(r));
await S.close();
