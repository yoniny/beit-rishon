import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 320, h: 200, frozen: true });
const r = await S.ev(async () => { const c = window.__TM_CTX; const out = []; c.scene.traverse((o) => { if (o.isLight) { let vis = true; for (let q = o; q; q = q.parent) if (q.visible === false) vis = false; out.push([o.type, o.name || (o.parent && o.parent.name) || '', vis, o.castShadow, +o.intensity.toFixed(2), o.distance || 0]); } }); return { pr: c.renderer.getPixelRatio(), lights: out }; });
console.log(JSON.stringify(r));
await S.close();
