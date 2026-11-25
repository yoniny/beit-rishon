// node defmat.mjs <plugin> <house> [js to run first] -> meshes drawn in three's default material (a white MeshBasicMaterial, untouched)
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house, js] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 640, h: 400, frozen: true });
const r = await S.ev(async (js) => { const c = window.__TM_CTX; if (js) { (0, eval)(js); for (let i = 0; i < 20; i++) window.__step(200); }
  const out = {}; const def = (m) => m && m.isMeshBasicMaterial && m.color && m.color.getHex() === 0xffffff && !m.map && !m.transparent && m.opacity === 1 && !m.vertexColors && m.name === '' && m.side === 0 && m.depthTest && !m.alphaMap && !m.envMap;
  c.scene.traverse((o) => { if (!o.isMesh) return; const mats = Array.isArray(o.material) ? o.material : [o.material]; if (!mats.some(def)) return;
    const path = []; let p = o; while (p && path.length < 5) { path.push(p.name || p.type); p = p.parent; } const k = path.join(' < '); out[k] = (out[k] || 0) + 1; });
  return out; }, js || '');
for (const [k, v] of Object.entries(r).sort((a, b) => b[1] - a[1]).slice(0, 60)) console.log(v, k);
await S.close();
