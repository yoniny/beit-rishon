import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, t] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async (t) => {
  const c = window.__TM_CTX, B = c.shared.bikkurim, T3 = c.THREE;
  B.setReading('tk'); B.at(t); c.scene.updateMatrixWorld(true);
  const ox = c.scene.getObjectByName('bikkurimOx'), P = ox.children[0]; const inv = new T3.Matrix4().copy(P.matrixWorld).invert(), v = new T3.Vector3(); const out = [];
  P.traverse((o) => { if (!o.isMesh) return; const pos = o.geometry.attributes.position; let mn = [1e9, 0]; for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld).applyMatrix4(inv); if (v.y < mn[0]) mn = [v.y, v.z]; }
    out.push([+mn[0].toFixed(2), +mn[1].toFixed(2), o.geometry.type.replace('Geometry',''), o.material.color.getHexString(), o.parent === P ? 'P' : 'deep']); });
  out.sort((a, b) => a[0] - b[0]); return { py: P.position.toArray(), out: out.filter((x) => x[1] < -1.2).slice(0, 14) };
}, +t);
console.log(JSON.stringify(r.py)); for (const x of r.out) console.log(JSON.stringify(x));
await S.close();
