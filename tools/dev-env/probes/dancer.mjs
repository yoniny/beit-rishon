import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, tS, pre] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 800, h: 500, frozen: true });
const r = await S.ev(async ({ tS }) => { const c = window.__TM_CTX, SC = window.__SCAN, T = c.THREE, Sh = c.shared.simchaShoeva;
  Sh.start(); window.__step(100); Sh.seek(+tS); for (let i = 0; i < 6; i++) window.__step(50); const E = c.shared.demoStops.find((d) => d.id === 'simcha-shoeva'); E.pause(); window.__step(50); if (c.camFlyStop) c.camFlyStop(); window.__step(20);
  const found = []; c.scene.traverse((o) => { if (o.name === 'simchaDancer' && found.length < 40) found.push(o); });
  const info = found.slice(0, 3).map((o) => { const p = new T.Vector3(); o.getWorldPosition(p); return [o.type, o.isInstancedMesh ? o.count : 0, p.toArray().map((v) => +v.toFixed(1)), o.parent && o.parent.type]; });
  // the dancers' groups: parents of simchaDancer meshes
  const groups = [...new Set(found.map((o) => { let g = o; while (g.parent && g.parent.name !== '' && g.parent.type !== 'Group') g = g.parent; return o.parent; }))];
  const imgs = [];
  for (const g of groups.slice(0, 3)) { const p = new T.Vector3(); g.getWorldPosition(p); SC.setPose({ p: [p.x + 2.2, p.y + 2.4, p.z + 2.2], t: [p.x, p.y + 2.0, p.z] }); if (c.camFlyStop) c.camFlyStop(); for (let i = 0; i < 3; i++) window.__step(30); SC.setPose({ p: [p.x + 2.2, p.y + 2.4, p.z + 2.2], t: [p.x, p.y + 2.0, p.z] }); window.__step(16); imgs.push(SC.jpg(800, 0.85)); }
  return { n: found.length, info, ng: groups.length, imgs }; }, { tS });
console.log(JSON.stringify({ n: r.n, info: r.info, ng: r.ng }));
r.imgs.forEach((im, i) => fs.writeFileSync(`${pre}-${i}.jpg`, Buffer.from(im.split(',')[1], 'base64')));
await S.close();
