import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 1000, h: 640, frozen: true });
const r = await S.ev(async () => { const c = window.__TM_CTX, SC = window.__SCAN, I = window.__ent360.idle; const b = c.ui.placeButton("ארבעת הפייסות ו״ברקאי״ — הדגמה"); SC.clickEl(b); SC.yes(); window.__step(300); SC.yes();
  const out = []; let t = 0;
  for (const s of [1, 3, 6, 8]) { while (t < s) { window.__step(250); t += 0.25; } const sk0 = I.skipped; window.__step(16);
    out.push({ s, busy: I.busy, n: I.n, skippedNow: I.skipped - sk0, sinceLast: performance.now() - I.last, ds: (c.shared.demoStops || []).map((d) => d.id + ':' + (d.running && d.running())).join(','), lp: (() => { const st = SC.pstats(SC.px(16)); return st.mean; })() }); }
  return out; });
console.log(JSON.stringify(r, null, 0));
await S.close();
