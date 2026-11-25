// node shlf.mjs <plugin> <t0> <t1> <dt> -> per time: each visible figure of shiloachDemo near x 100..120: root pos, lowest mesh y, floor y under
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, t0, t1, dt] = process.argv.slice(2).map((v, i) => i ? +v : v);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const out = await S.ev(async ({ t0, t1, dt }) => {
  const c = window.__TM_CTX, L = c.shared.shiloach, T3 = c.THREE, sc = c.scene;
  const DG = sc.getObjectByName('shiloachDemo'); const res = [];
  const rc = new T3.Raycaster();
  for (let t = t0; t <= t1 + 1e-6; t += dt) {
    L.at(t); window.__step(16);
    DG.updateMatrixWorld(true);
    for (const f of DG.children) {
      if (!f.visible) continue;
      const b = new T3.Box3().setFromObject(f); if (b.isEmpty()) continue;
      const cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2;
      if (cx < 98 || cx > 125 || Math.abs(cz) > 8) continue;
      
      rc.set(new T3.Vector3(cx, b.min.y + 3, cz), new T3.Vector3(0, -1, 0)); rc.far = 10;
      const h = rc.intersectObjects(sc.children, true).filter((x) => { if (!x.object.isMesh) return false; for (let q = x.object; q; q = q.parent) { if (q === DG || !q.visible) return false; } return true; });
      res.push([+t.toFixed(2), +cx.toFixed(2), +cz.toFixed(2), +b.min.y.toFixed(2), h.length ? +h[0].point.y.toFixed(2) : null]);
    }
  }
  return res;
}, { t0, t1, dt });
for (const r of out) console.log(JSON.stringify(r));
await S.close();
