import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, ts, chel] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
for (const t of ts.split(',').map(Number)) {
  const r = await S.ev(async ({ t, chel }) => {
    const c = window.__TM_CTX, B = c.shared.bikkurim, T3 = c.THREE;
    if (chel && c.shared.chelSteps.mode !== chel) c.shared.chelSteps.set(chel);
    B.setReading('tk'); B.at(t); c.scene.updateMatrixWorld(true);
    const ox = c.scene.getObjectByName('bikkurimOx'); const out = [];
    ox.traverse((o) => { if (o.isMesh) { const b = new T3.Box3().setFromObject(o), m = b.getCenter(new T3.Vector3()); out.push([+b.min.y.toFixed(2), o.geometry.type.replace('Geometry',''), o.material.color ? o.material.color.getHexString() : '', +m.x.toFixed(2), +m.z.toFixed(2), +(b.max.y - b.min.y).toFixed(2)]); } });
    out.sort((a, b) => a[0] - b[0]); return out.slice(0, 6);
  }, { t, chel });
  console.log(t); for (const x of r) console.log('  ', JSON.stringify(x));
}
await S.close();
