import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 320, h: 200, frozen: true });
const r = await S.ev(async () => { const E = window.__ent360, RN = () => new Event('x').timeStamp, out = [];
  for (let i = 0; i < 5; i++) { window.__step(1100); const t0 = RN(); const l = E.solids(false); out.push([+(RN() - t0).toFixed(2), l.length]); }
  let n = 0; window.__TM_CTX.scene.traverse(() => n++); return { out, nodes: n }; });
console.log(JSON.stringify(r));
await S.close();
