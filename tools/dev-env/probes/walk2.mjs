// node walk2.mjs <plugin> <pose-json> <secs> -> walk forward in walk mode, eye height over the floor every 0.5 s
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, pose, secs] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 1280, h: 720, frozen: true });
const r = await S.ev(async ({ pose, secs }) => {
  const c = window.__TM_CTX, SC = window.__SCAN, T3 = c.THREE;
  SC.setPose(pose); for (let i = 0; i < 4; i++) { window.__step(50); await SC.sleep(5); }
  c.shared.walkMode.set(true);
  for (let i = 0; i < 6; i++) { window.__step(50); await SC.sleep(5); }
  const rc = new T3.Raycaster(); const ms = []; c.scene.traverse((m) => { if (m.isMesh && !m.isSkinnedMesh && !m.isInstancedMesh && !m.userData.noPick) ms.push(m); });
  const vis = (m) => { for (let q = m; q; q = q.parent) if (!q.visible) return false; return true; };
  const floorAt = (x, z, from) => { rc.set(new T3.Vector3(x, from, z), new T3.Vector3(0, -1, 0)); rc.far = 60; let best = null; for (const m of ms) { if (!vis(m)) continue; let h = []; try { h = rc.intersectObject(m, false); } catch (_) {} for (const q of h) if (!best || q.distance < best) best = q.distance; } return best == null ? null : from - best; };
  const out = [];
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  let wt = 0;
  for (let t = 0; t < secs * 1000; t += 50) {
    const t0 = performance.now(); window.__step(50); wt += performance.now() - t0;
    if (t % 500 === 0) { const p = c.camera.position; const f = floorAt(p.x, p.z, p.y + 0.4); out.push([t / 1000, +p.x.toFixed(1), +p.y.toFixed(2), +p.z.toFixed(1), f == null ? null : +f.toFixed(2)]); await SC.sleep(2); }
  }
  window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp', bubbles: true }));
  out.push(['ms/step', +(wt / (secs * 20)).toFixed(1)]);
  return out;
}, { pose: JSON.parse(pose), secs: +secs });
for (const x of r) console.log(JSON.stringify(x));
await S.close();
