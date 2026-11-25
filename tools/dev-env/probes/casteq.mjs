// node casteq.mjs <plugin> -> the Sheni ray helper (castFrom / groundAt) against the old brute-force answer, on a grid and slanted rays
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async () => { const c = window.__TM_CTX, T = c.THREE, Q = c.shared.__add208QA; const rc = new T.Raycaster();
  const solid = (o) => o.isMesh && o.visible !== false && !(o.material && o.material.transparent && o.material.opacity < 0.5);
  const old = (from, dir) => { rc.camera = c.camera; rc.set(new T.Vector3(...from), new T.Vector3(...dir).normalize()); const hits = rc.intersectObjects(c.root.children, true).filter((h) => { let o = h.object; while (o) { if (o.visible === false) return false; o = o.parent; } return solid(h.object); }); return hits.length ? hits[0].point : null; };
  const RN = () => new Event('x').timeStamp; let tN = 0, tO = 0, n = 0, bad = []; 
  const cmp = (from, dir) => { let t0 = RN(); const a = Q.castFrom(from, dir, null); tN += RN() - t0; t0 = RN(); const b = old(from, dir); tO += RN() - t0; n++; const ok = (!a && !b) || (a && b && a.distanceTo(b) < 1e-4); if (!ok && bad.length < 8) bad.push([from, dir, a && a.toArray().map((v) => +v.toFixed(3)), b && b.toArray().map((v) => +v.toFixed(3))]); return ok; };
  let okN = 0;
  for (let x = -330; x <= 560; x += 23) for (let z = -300; z <= 520; z += 29) if (cmp([x, 120, z], [0, -1, 0])) okN++;
  for (let k = 0; k < 120; k++) { const a = k * 0.37; if (cmp([80 * Math.cos(a), 10 + (k % 7) * 6, 80 * Math.sin(a)], [-Math.cos(a), -0.1 * (k % 3), -Math.sin(a)])) okN++; }
  return { n, okN, bad, newMs: +tN.toFixed(1), oldMs: +tO.toFixed(1) };
});
console.log(JSON.stringify(r));
await S.close();
