import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async () => { const c = window.__TM_CTX; let courts = null; c.root.traverse((o) => { if (o.name === 'courts' && !courts) courts = o; });
  const m = new Map(); const walk = (o, d) => { if (o.isMesh && !o.isInstancedMesh) { const g = o.geometry, p = g.parameters || {}; const k = (o.parent === courts ? 'direct ' : 'sub ') + g.type + ' ' + [p.width, p.height, p.depth].map((v) => v == null ? '' : +(+v).toFixed(2)).join('x') + ' ' + (o.material.color ? o.material.color.getHexString() : '') + (o.name ? ' n=' + o.name : '') + (o.userData && Object.keys(o.userData).length ? ' ud=' + Object.keys(o.userData).join(',') : ''); m.set(k, (m.get(k) || 0) + 1); } for (const k of o.children) walk(k, d + 1); };
  walk(courts, 0); return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30); });
for (const [k, v] of r) console.log(v, k);
await S.close();
