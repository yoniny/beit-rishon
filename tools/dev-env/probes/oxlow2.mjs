import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, t] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async (t) => {
  const c = window.__TM_CTX, B = c.shared.bikkurim, T3 = c.THREE;
  B.setReading('tk'); B.at(t); c.scene.updateMatrixWorld(true);
  const ox = c.scene.getObjectByName('bikkurimOx'); const out = [];
  ox.traverse((o) => { if (o.isMesh) { const b = new T3.Box3().setFromObject(o); if (b.min.y < 13.6) out.push([o.geometry.type.replace('Geometry',''), o.material.color.getHexString(), ...[b.min.x,b.max.x,b.min.y,b.max.y,b.min.z,b.max.z].map((v)=>+v.toFixed(2)), o.parent === ox ? 'G' : (o.parent && o.parent.parent === ox ? 'G>1' : 'deep')]); } });
  return { G: ox.position.toArray().map((v)=>+v.toFixed(2)), rot: [ox.rotation.y, ox.children[0] && ox.children[0].rotation.x], out };
}, +t);
console.log(JSON.stringify(r.G), JSON.stringify(r.rot)); for (const x of r.out) console.log(JSON.stringify(x));
await S.close();
