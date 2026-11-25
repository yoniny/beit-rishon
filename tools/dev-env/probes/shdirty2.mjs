// node shdirty.mjs <plugin> <house> -> which shadow casters change during a still/turning view (they force the shadow map to be redrawn)
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 320, h: 200, frozen: true });
const r = await S.ev(async ({ house }) => { const c = window.__TM_CTX, SC = window.__SCAN; const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0];
  SC.setPose({ p: [tg[0] + 190, 150, tg[2]], t: tg }); for (let i = 0; i < 150; i++) { window.__step(50); if (i % 10 === 0) await SC.sleep(5); }
  const snap = () => { const m = new Map(); const walk = (o) => { if (o.visible === false) return; if ((o.isMesh || o.isLine || o.isPoints) && o.castShadow) { const g = o.geometry, pa = g && g.attributes && g.attributes.position; m.set(o, o.matrixWorld.elements.join(',') + '|' + (g ? g.id : -1) + '|' + (pa ? pa.version : -1) + '|' + (Array.isArray(o.material) ? 'arr' : o.material && o.material.id) + '|' + (o.instanceMatrix ? o.instanceMatrix.version : -1) + '|' + (o.isInstancedMesh ? o.count : -1)); } for (const k of o.children) walk(k); }; walk(c.scene); return m; };
  const hits = new Map(); let prev = snap(), frames = 0, dirtyFrames = 0;
  for (let k = 0; k < 60; k++) { const a = k / 60 * Math.PI * 2; c.camera.position.set(tg[0] + 190 * Math.cos(a), 150, tg[2] + 190 * Math.sin(a)); c.controls.target.set(...tg); c.controls.update(); window.__step(33); const cur = snap(); let d = false; for (const [o, v] of cur) { if (prev.get(o) !== v) { d = true; const nm = []; for (let q = o; q && nm.length < 4; q = q.parent) if (q.name) nm.push(q.name); const key = (o.name || o.type) + ' < ' + nm.join(' < '); hits.set(key, (hits.get(key) || 0) + 1); } } if (cur.size !== prev.size) d = true; if (d) dirtyFrames++; frames++; prev = cur; if (k % 10 === 0) await SC.sleep(1); }
  return { frames, dirtyFrames, casters: prev.size, top: [...hits.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15) };
}, { house });
console.log(JSON.stringify(r, null, 1));
await S.close();
