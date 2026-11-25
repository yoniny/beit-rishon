// node dump.mjs <plugin> <cfg-json> <vol-json> -> every mesh box in the volume (size < 40)
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, cfgS, volS] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async ({ cfg, v }) => {
  const c = window.__TM_CTX, SH = c.shared, SC = window.__SCAN;
  if (cfg.salt) SH.saltChamber.set(cfg.salt);
  if (cfg.altar) SH.altarPlace.set(cfg.altar);
  if (cfg.chel) SH.chelSteps.set(cfg.chel);
  if (cfg.duchan) SH.duchanReading.set(cfg.duchan);
  if (cfg.js) (0, eval)(cfg.js);
  for (let k = 0; k < 3; k++) { window.__step(30); await SC.sleep(5); }
  const scene = c.scene; scene.updateMatrixWorld(true);
  const T = c.THREE || window.THREE;
  const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const out = [], B = new T.Box3(), M = new T.Matrix4();
  const nm = (o) => { const a = []; for (let q = o; q && a.length < 3; q = q.parent) { const n = q.name || (q.userData && (q.userData.label || q.userData.name)); if (n) a.push(String(n).slice(0, 24)); } return a.join('<'); };
  let id = 0;
  scene.traverse((o) => {
    if (!o.isMesh || !vis(o) || !o.geometry) return; id++;
    if (o.material && o.material.transparent && o.material.opacity < 0.3) return;
    const g = o.geometry; if (!g.boundingBox) g.computeBoundingBox();
    const boxes = [];
    if (o.isInstancedMesh) { for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, M); M.premultiply(o.matrixWorld); boxes.push(B.copy(g.boundingBox).applyMatrix4(M).clone()); } }
    else boxes.push(B.copy(g.boundingBox).applyMatrix4(o.matrixWorld).clone());
    for (const bx of boxes) {
      const s = bx.getSize(new T.Vector3()); if (s.x > 40 || s.y > 40 || s.z > 40) continue;
      if (bx.max.x > v[0] && bx.min.x < v[1] && bx.max.y > v[2] && bx.min.y < v[3] && bx.max.z > v[4] && bx.min.z < v[5])
        out.push([id, nm(o), g.type.replace('Geometry', ''), o.material && o.material.color ? o.material.color.getHexString() : '', ...[bx.min.x, bx.max.x, bx.min.y, bx.max.y, bx.min.z, bx.max.z].map((q) => +q.toFixed(2))]);
    }
  });
  return out;
}, { cfg: JSON.parse(cfgS), v: JSON.parse(volS) });
console.log(JSON.stringify(r));
await S.close();
