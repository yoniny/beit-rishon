// node drawmap.mjs <plugin> <house> -> what the draws of the overview are: visible meshes in the frustum by group path and by material
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 480, h: 300, frozen: true });
const r = await S.ev(async ({ house }) => { const c = window.__TM_CTX, SC = window.__SCAN, T = c.THREE; const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0];
  SC.setPose({ p: [tg[0] + 190, 150, tg[2]], t: tg }); for (let i = 0; i < 60; i++) window.__step(50);
  c.camera.updateMatrixWorld(); const fr = new T.Frustum().setFromProjectionMatrix(new T.Matrix4().multiplyMatrices(c.camera.projectionMatrix, c.camera.matrixWorldInverse));
  const byG = new Map(), byM = new Map(); let n = 0, small = 0;
  const walk = (o, path) => { if (!o.visible) return; const nm = o.name ? (path ? path + '/' : '') + o.name : path;
    if ((o.isMesh || o.isLine || o.isPoints) && !o.isSprite) { let ok = true; if (o.frustumCulled !== false && o.geometry) { if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); const sp = o.geometry.boundingSphere.clone().applyMatrix4(o.matrixWorld); ok = fr.intersectsSphere(sp); }
      const mats = Array.isArray(o.material) ? o.material : [o.material]; if (ok && mats.some((m) => m && m.visible !== false)) { n++; const key = nm.split('/').slice(0, 3).join('/') || '(none)'; byG.set(key, (byG.get(key) || 0) + 1); const mk = (mats[0] && (mats[0].name || mats[0].type)) + (mats[0] && mats[0].color ? '#' + mats[0].color.getHexString() : '') + (mats[0] && mats[0].transparent ? ' T' : ''); byM.set(mk, (byM.get(mk) || 0) + 1); const ga = o.geometry && o.geometry.attributes.position; if (ga && ga.count < 100) small++; } }
    for (const k of o.children) walk(k, nm); };
  walk(c.scene, '');
  const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
  return { n, small, byG: top(byG), byM: top(byM) };
}, { house });
console.log(JSON.stringify(r, null, 0));
await S.close();
