// node ltorch.mjs <plugin> <pre> -> the morning service, stage "ihb": the lantern's torch - its flame vs the officer and vs the hem; shots
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, pre] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 900, h: 600, frozen: true });
const r = await S.ev(async () => { const c = window.__TM_CTX, SC = window.__SCAN, TM = c.shared.tamid, V = c.camera.position.constructor;
  TM.begin(); window.__step(100);
  const out = [];
  for (const sec of [18.2, 18.7, 19.4, 19.8, 20.3, 21.3, 22.1]) {
    TM.seek(0, sec, 'abba'); window.__step(16); TM.seek(0, sec, 'abba');
    const f = TM.figObj('ihb'), lt = (() => { let o = null; c.scene.traverse((q) => { if (!o && q.isGroup && q.children.length === 2 && q.parent && q.visible && q.children[0].geometry && q.children[0].geometry.parameters && q.children[0].geometry.parameters.height === 0.7) o = q; }); return o; })();
    if (!lt) { out.push({ sec, err: 'no torch' }); continue; }
    lt.updateWorldMatrix(true, false);
    const tip = new V(0, 0.55, 0).applyMatrix4(lt.matrixWorld), grip = new V(0, 0, 0).applyMatrix4(lt.matrixWorld);
    const body = new V(); f.g.getWorldPosition(body);
    const W = c.shared.tamid; // hem in the group frame -> world: the group = the torch's ancestor that holds the props
    let G = lt; while (G.parent && G.parent !== c.scene && !(G.name === 'tamid-world' )) G = G.parent;
    const hem = new V(-71.95, 0.78, -75.7); let grp = null; c.scene.traverse((q) => { if (!grp && q.name === 'night-watch') grp = q.parent; }); if (grp) grp.localToWorld(hem);
    const up = tip.clone().sub(grip).normalize();
    // the shot: from the side (east of them), a little above
    const mid = tip.clone().add(grip).multiplyScalar(0.5); const dx = tip.x - grip.x, dz = tip.z - grip.z, dl = Math.hypot(dx, dz) || 1; let px = -dz / dl, pz = dx / dl; if (Math.hypot(mid.x + px - body.x, mid.z + pz - body.z) < Math.hypot(mid.x - px - body.x, mid.z - pz - body.z)) { px = -px; pz = -pz; }
    TM.seek(0, sec, 'abba'); SC.setPose({ p: [mid.x + px * 2.4, mid.y + 0.7, mid.z + pz * 2.4], t: [mid.x, mid.y, mid.z] }); window.__step(16); SC.px(16);
    const img1 = SC.jpg(900, 0.85);
    TM.seek(0, sec, 'abba'); SC.setPose({ p: [mid.x + px * 1.6 - dx / dl * 1.6, mid.y + 1.2, mid.z + pz * 1.6 - dz / dl * 1.6], t: [mid.x, mid.y, mid.z] }); window.__step(16); SC.px(16);
    const img2 = SC.jpg(900, 0.85);
    out.push({ sec, tip: [tip.x, tip.y, tip.z].map((v) => +v.toFixed(2)), body: [body.x, body.y, body.z].map((v) => +v.toFixed(2)), hem: [hem.x, hem.y, hem.z].map((v) => +v.toFixed(2)),
      dTipHem: +tip.distanceTo(hem).toFixed(2), dTipBodyXZ: +Math.hypot(tip.x - body.x, tip.z - body.z).toFixed(2), dGripBodyXZ: +Math.hypot(grip.x - body.x, grip.z - body.z).toFixed(2), dir: [up.x, up.y, up.z].map((v) => +v.toFixed(2)), img1, img2 });
  }
  return out; });
for (const [k, o] of r.entries()) { if (o.err) { console.log(o.sec, o.err); continue; } fs.writeFileSync(`${pre}-${k}a.jpg`, Buffer.from(o.img1.split(',')[1], 'base64')); fs.writeFileSync(`${pre}-${k}b.jpg`, Buffer.from(o.img2.split(',')[1], 'base64')); delete o.img1; delete o.img2; console.log(JSON.stringify(o)); }
await S.close();
