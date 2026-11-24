// One process of the full scan = one house, several categories one after the other (each in a fresh page), each result file written as soon as
// the category is done:  node tools/scan/job.mjs --plugin <dir> --house rishon|sheni --cats views,toggles,... --out <dir> [--only a,b] [--limit n] ...
// (the orchestrator, tools/scan-full.mjs, runs it through tools/one-browser.sh: a browser slot of the machine)
import path from 'node:path';
import { openHouse, parseArgs, Out } from './lib.mjs';
const a = parseArgs(process.argv.slice(2));
const plugin = path.resolve(a.plugin), house = a.house, outDir = path.resolve(a.out);
const cats = String(a.cats || a.cat).split(',');
const MODS = { toggles: './toggles.mjs', views: './views.mjs', demos: './demos.mjs', ui: './ui.mjs', perf: './perf.mjs', walk: './walk.mjs' };
for (const cat of cats) {
  const out = new Out(outDir, house, cat);
  const t0 = Date.now();
  let S;
  try {
    const opts = { w: 480, h: 300, frozen: true };
    if (cat === 'ui') { opts.w = 1280; opts.h = 720; }
    if (cat === 'perf') { opts.w = 800; opts.h = 500; opts.frozen = false; }
    if (cat === 'walk') { opts.w = 320; opts.h = 200; }
    console.log(`[job] ${house}/${cat}: opening`);
    S = await openHouse(plugin, house, opts);
    out.stats.loadMs = S.tReady;
    const mod = await import(MODS[cat]);
    const o = { ...a, plugin }; for (const k of Object.keys(a)) if (k.endsWith('.' + cat)) o[k.slice(0, -cat.length - 1)] = a[k];
    await mod.run(S, out, o);
    const errs = S.msgs.filter((m) => m.type === 'error' || m.type === 'pageerror' || m.type === 'requestfailed');
    out.stats.consoleErrors = errs.length;
    if (cat !== 'perf' && errs.length) { const g = new Map(); for (const m of errs) { const k = m.type + ': ' + m.text.replace(/\d+(\.\d+)?/g, '#').slice(0, 140); g.set(k, (g.get(k) || 0) + 1); } for (const [k, v] of g) out.add('medium', `קונסול (${house}/${cat}): ${k.slice(0, 110)} ×${v}`, 'שגיאה שנרשמה במהלך הסריקה (ראו גם ממצאים לפי פריט).', { item: 'console' }); }
  } catch (e) {
    out.add('critical', `הסריקה ${house}/${cat} קרסה`, String(e && e.stack || e).slice(0, 600));
  } finally {
    out.stats.seconds = Math.round((Date.now() - t0) / 1000);
    out.save();
    if (S) try { await S.close(); } catch (_) {}
  }
  console.log(`[job] ${house}/${cat}: ${out.list.length} findings in ${out.stats.seconds}s`);
}
