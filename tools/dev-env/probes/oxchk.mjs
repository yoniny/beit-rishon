// node oxchk.mjs <plugin> <reading> <chel> <t0> <t1> <dt> -> per time: worst hoof gap (hoof bottom - floor), worst body part below the floor under it
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, rd, chel, t0, t1, dt] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async ({ rd, chel, t0, t1, dt }) => {
  const c = window.__TM_CTX, B = c.shared.bikkurim, T3 = c.THREE;
  if (chel && c.shared.chelSteps.mode !== chel) c.shared.chelSteps.set(chel);
  B.setReading(rd); B.at(0);
  const BG = c.scene.getObjectByName('bikkurimDemo'), ox = c.scene.getObjectByName('bikkurimOx');
  const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const sol = []; c.scene.traverse((o) => { if (!o.isMesh) return; for (let q = o; q; q = q.parent) if (q === BG) return; sol.push(o); });
  const rc = new T3.Raycaster(), down = new T3.Vector3(0, -1, 0), b = new T3.Box3(), out = [];
  const floor = (x, z, y) => { rc.set(new T3.Vector3(x, y, z), down); rc.far = 30; const hs = []; for (const o of sol) { if (!vis(o)) continue; if (o.material && o.material.transparent && o.material.opacity < 0.5) continue; T3.Mesh.prototype.raycast.call(o, rc, hs); } hs.sort((a, q) => a.distance - q.distance); return hs.length ? hs[0].point.y : null; };
  for (let t = t0; t <= t1; t += dt) {
    B.at(t); BG.updateMatrixWorld(true); if (!vis(ox)) continue;
    let hoof = [], body = [-1e9];
    ox.traverse((o) => { if (!o.isMesh) return; b.setFromObject(o); const cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2; const f = floor(cx, cz, b.max.y + 0.6); if (f == null) return;
      const isHoof = o.geometry.type === 'CylinderGeometry' && o.material.color && o.material.color.getHexString() === '2c1c12' && (b.max.y - b.min.y) < 0.5;
      if (isHoof) hoof.push(+(b.min.y - f).toFixed(2)); else { const d = f - b.min.y; if (d > body[0]) body = [+d.toFixed(2), o.geometry.type, +cx.toFixed(1), +cz.toFixed(1)]; } });
    out.push([+t.toFixed(2), hoof, body]);
  }
  return out;
}, { rd, chel, t0: +t0, t1: +t1, dt: +dt });
let bad = 0;
for (const [t, h, bd] of r) { const hmax = Math.max(...h.map(Math.abs)); if (hmax > 0.12 || bd[0] > 0.05) { bad++; console.log(t, 'hooves', JSON.stringify(h), 'body-under', JSON.stringify(bd)); } }
console.log('frames', r.length, 'bad', bad);
await S.close();
