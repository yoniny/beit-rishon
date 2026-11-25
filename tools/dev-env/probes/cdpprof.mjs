// node cdpprof.mjs <plugin> <house> <out.json> -> CPU profile of a 360 turn (rendering off), self time by function with a code snippet
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, house, outF] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 1280, h: 720, frozen: true });
const cdp = await S.page.target().createCDPSession();
await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
await S.ev(async (house) => {
  const c = window.__TM_CTX, SC = window.__SCAN;
  const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0];
  SC.setPose({ p: [tg[0] + 190, 150, tg[2]], t: tg });
  for (let i = 0; i < 6; i++) { window.__step(50); await SC.sleep(5); }
  window.__rr = c.renderer.render; c.renderer.render = function () {};
}, house);
await cdp.send('Profiler.start');
const fr = await S.ev(async (house) => {
  const c = window.__TM_CTX, SC = window.__SCAN; const tg = house === 'sheni' ? [20, 15, 0] : [0, 15, 0], R = 190, H = 150; const ft = [];
  for (let k = 0; k < 300; k++) {
    const a = k / 300 * Math.PI * 2;
    c.camera.position.set(tg[0] + R * Math.cos(a), H, tg[2] + R * Math.sin(a)); c.controls.target.set(...tg); c.controls.update();
    const t0 = performance.now(); window.__step(33); ft.push(+(performance.now() - t0).toFixed(1));
    if (k % 25 === 0) await SC.sleep(1);
  }
  c.renderer.render = window.__rr;
  return ft;
}, house);
const { profile } = await cdp.send('Profiler.stop');
// self time per node -> per function (url:line:col)
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const self = new Map(); const dt = profile.timeDeltas; 
for (let i = 0; i < profile.samples.length; i++) { const n = byId.get(profile.samples[i]); const k = n.callFrame.functionName + '@' + n.callFrame.url.split('/').slice(-2).join('/') + ':' + n.callFrame.lineNumber + ':' + n.callFrame.columnNumber; self.set(k, (self.get(k) || 0) + (dt[i] || 0)); }
const top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => [k, +(v / 1000).toFixed(1)]);
const sorted = fr.slice().sort((a, b) => a - b);
fs.writeFileSync(outF, JSON.stringify({ frames: fr, top }));
console.log('frames avg', (fr.reduce((a, b) => a + b, 0) / fr.length).toFixed(1), 'p50', sorted[150], 'p95', sorted[285], 'max', sorted[299], '>50ms', fr.filter((x) => x > 50).length);
for (const t of top) console.log(t[1], 'ms', t[0]);
await S.close();
