import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, a, b, d] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 320, h: 200, frozen: true });
const r = await S.ev(async ({ a, b, d }) => { const L = window.__TM_CTX.shared.shiloach, out = []; for (let t = a; t <= b; t += d) { const o = L.at(t); out.push([t, o.cam && o.cam[0].map((v) => Math.round(v)), o.cam && o.cam[1].map((v) => Math.round(v))]); } return out; }, { a: +a, b: +b, d: +d });
for (const x of r) console.log(JSON.stringify(x));
await S.close();
