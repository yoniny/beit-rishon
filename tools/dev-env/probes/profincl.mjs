// re-run the profile and print inclusive time per app function (bundle line > 480), with a code snippet
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 1280, h: 720, frozen: true });
const cdp = await S.page.target().createCDPSession();
await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
await S.ev(async (house) => { const c = window.__TM_CTX, SC = window.__SCAN; const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0]; SC.setPose({ p: [tg[0] + 190, 150, tg[2]], t: tg }); for (let i = 0; i < 6; i++) { window.__step(50); await SC.sleep(5); } window.__rr = c.renderer.render; c.renderer.render = function () {}; }, house);
await cdp.send('Profiler.start');
await S.ev(async (house) => { const c = window.__TM_CTX, SC = window.__SCAN; const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0];
  for (let k = 0; k < 300; k++) { const a = k / 300 * Math.PI * 2; c.camera.position.set(tg[0] + 190 * Math.cos(a), 150, tg[2] + 190 * Math.sin(a)); c.controls.target.set(...tg); c.controls.update(); window.__step(33); if (k % 25 === 0) await SC.sleep(1); }
  c.renderer.render = window.__rr; }, house);
const { profile } = await cdp.send('Profiler.stop');
const byId = new Map(profile.nodes.map((n) => [n.id, n])), parent = new Map();
for (const n of profile.nodes) for (const ch of n.children || []) parent.set(ch, n.id);
const cnt = new Map(); for (let i = 0; i < profile.samples.length; i++) cnt.set(profile.samples[i], (cnt.get(profile.samples[i]) || 0) + (profile.timeDeltas[i] || 0));
const incl = new Map();
for (const [id, t] of cnt) { const seen = new Set(); let cur = id; while (cur != null) { const n = byId.get(cur); const cf = n.callFrame; const k = cf.functionName + '@' + cf.lineNumber + ':' + cf.columnNumber; if (!seen.has(k) && cf.url.includes('bundle.js') && cf.lineNumber > 480) { seen.add(k); incl.set(k, (incl.get(k) || 0) + t); } cur = parent.get(cur); } }
const total = [...cnt.values()].reduce((a, b) => a + b, 0);
const edge = new Map();
for (const [id, t] of cnt) { let cur = id, lastApp = null; const chain = []; while (cur != null) { const n = byId.get(cur); const cf = n.callFrame; if (cf.url.includes('bundle.js') && cf.lineNumber > 480) chain.push(cf.functionName + '@' + cf.lineNumber + ':' + cf.columnNumber); cur = parent.get(cur); }
  const seen = new Set(); for (let i = 0; i + 1 < chain.length; i++) { const k = chain[i + 1] + ' -> ' + chain[i]; if (seen.has(k)) continue; seen.add(k); edge.set(k, (edge.get(k) || 0) + t); } }
console.log('EDGES'); for (const [k, v] of [...edge.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18)) console.log((v / 1000).toFixed(0).padStart(6), k);
const src = fs.readFileSync(plugin + '/' + house + '/bundle.js', 'utf8').split('\n');
const top = [...incl.entries()].sort((a, b) => b[1] - a[1]).slice(0, 22);
console.log('total ms', (total / 1000).toFixed(0));
for (const [k, v] of top) { const [, ln, col] = k.match(/@(\d+):(\d+)$/); console.log((v / 1000).toFixed(0).padStart(6), k.padEnd(18), (src[+ln] || '').slice(+col, +col + 110).replace(/\s+/g, ' ')); }
await S.close();
