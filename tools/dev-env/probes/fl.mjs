// node fl.mjs <plugin> <chel> <x0,x1,dx> <z0,z1,dz> -> top floor y by downward rays from y 30
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, chel, xs, zs] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async ({ chel, xs, zs }) => {
  const c = window.__TM_CTX, T = c.THREE; if (chel && c.shared.chelSteps.mode !== chel) c.shared.chelSteps.set(chel);
  c.scene.updateMatrixWorld(true);
  const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const sol = []; c.scene.traverse((o) => { if (o.isMesh && vis(o) && !(o.material && o.material.transparent && o.material.opacity < 0.5) && !(o.name || '').match(/label/i)) sol.push(o); });
  const rc = new T.Raycaster(), out = [];
  const [x0, x1, dx] = xs.split(',').map(Number), [z0, z1, dz] = zs.split(',').map(Number);
  for (let z = z0; z <= z1 + 1e-6; z += dz) { const row = []; for (let x = x0; x <= x1 + 1e-6; x += dx) { rc.set(new T.Vector3(x, 30, z), new T.Vector3(0, -1, 0)); rc.far = 60; const h = rc.intersectObjects(sol, false); row.push(h.length ? +h[0].point.y.toFixed(2) : null); } out.push([+z.toFixed(2), row]); }
  return out;
}, { chel, xs, zs });
for (const [z, row] of r) console.log(z, row.join(' '));
await S.close();
