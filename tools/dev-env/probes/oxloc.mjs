import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, t] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async (t) => {
  const c = window.__TM_CTX, B = c.shared.bikkurim, T3 = c.THREE;
  B.setReading('tk'); B.at(t); c.scene.updateMatrixWorld(true);
  const ox = c.scene.getObjectByName('bikkurimOx'); const inv = new T3.Matrix4().copy(ox.matrixWorld).invert(); const out = [];
  const v = new T3.Vector3();
  ox.traverse((o) => { if (!o.isMesh) return; const pos = o.geometry.attributes.position; let mn = [1e9, 0, 0]; let zr = [1e9, -1e9];
    for (let i = 0; i < pos.count; i += 3) { v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld).applyMatrix4(inv); if (v.y < mn[0]) mn = [v.y, v.z, v.x]; zr[0] = Math.min(zr[0], v.z); zr[1] = Math.max(zr[1], v.z); }
    out.push([+mn[0].toFixed(2), +mn[1].toFixed(2), +mn[2].toFixed(2), +zr[0].toFixed(2), +zr[1].toFixed(2), o.geometry.type.replace('Geometry', ''), o.material.color ? o.material.color.getHexString() : '']); });
  out.sort((a, b) => a[0] - b[0]); return { g: [ox.position.y, ox.rotation.y], ch: ox.children.map((q) => q.type + ':' + (q.name||'') ), out: out.slice(0, 40) };
}, +t);
console.log(JSON.stringify(r.g), JSON.stringify(r.ch)); for (const x of r.out) console.log(JSON.stringify(x));
await S.close();
