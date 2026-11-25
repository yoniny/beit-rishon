// node hit.mjs <plugin> <js> <[cam]> <[tg]>
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, js, cam, tg] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async ({ js, cam, tg }) => {
  if (js) (0, eval)(js);
  window.__step(50);
  const c = window.__TM_CTX, T3 = c.THREE, o = new T3.Vector3(...cam), d = new T3.Vector3(...tg).sub(o).normalize();
  const rc = new T3.Raycaster(o, d); rc.far = 80;
  const vis = (m) => { for (let q = m; q; q = q.parent) if (!q.visible) return false; return true; };
  const ms = []; c.scene.traverse((m) => { if (m.isMesh && !m.isSkinnedMesh && !m.isInstancedMesh && m.geometry && m.geometry.attributes && m.geometry.attributes.position) ms.push(m); }); const hs0 = []; for (const m of ms) { try { hs0.push(...rc.intersectObject(m, false)); } catch (_) {} } hs0.sort((a, b) => a.distance - b.distance); const hs = hs0.filter((h) => h.object.isMesh && vis(h.object)).slice(0, 6);
  return hs.map((h) => { const b = new T3.Box3().setFromObject(h.object); const path = []; for (let q = h.object; q && path.length < 4; q = q.parent) path.push(q.name || q.type); return [+h.distance.toFixed(1), path.join('<'), h.object.material && h.object.material.color ? h.object.material.color.getHexString() : '', [b.min.x, b.max.x, b.min.y, b.max.y, b.min.z, b.max.z].map((v) => +v.toFixed(1))]; });
}, { js, cam: JSON.parse(cam), tg: JSON.parse(tg) });
for (const x of r) console.log(JSON.stringify(x));
await S.close();
