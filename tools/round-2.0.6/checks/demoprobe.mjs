// the demonstrations inside the presentation: node demoprobe.mjs <plugin dir> list | run <mode> <index> [speed]
//   list: the registered demonstrations and, in every mode, the slides that start one (by a short run of each candidate slide)
//   run:  one slide in real time - how long it stays, and whether a demonstration was still running when the slide changed
import { open } from './h.mjs';
const [,, dir, cmd, mode, idx, spd] = process.argv;
const P = await open(dir); const pg = P.page;
if (cmd === 'list') {
  const r = await pg.evaluate(async ([ALL, ONLY]) => { const c = window.__ctx, T = c.shared.tour, wait = (ms) => new Promise((r) => setTimeout(r, ms)), out = { demos: (c.shared.demoStops || []).map((d) => d.id), modes: {} };
    const running = () => (c.shared.demoStops || []).filter((d) => { try { return d.running(); } catch (_) { return false; } }).map((d) => d.id);
    for (const m of T.modes) { if (ONLY && ONLY.indexOf(m.key) < 0) continue; T.start(m.key, { speed: 1 }); await wait(500); const S = T.slides || []; const L = [];
      for (let i = 0; i < S.length; i++) { const s = S[i]; const t = s.t || s.title || ''; const cand = ALL || !!s.act || /הדגמ|הליכה|הליכת|פתיחת|פשפש|מסיב|לול|דלתות|פייס|מנעול|נגר|השער הגדול|תמיד/.test(t + ' ' + JSON.stringify(s.go || ''));
        if (!cand) continue; T.goto(i); await wait(ALL ? 2200 : 2600); const run = running(); const st = T.state(); L.push({ i, t, ms: st.slideMs, run, then: (s.then || []).length, anim: !!s.anim, go: JSON.stringify(s.go || '').slice(0, 90) }); const D = c.shared.demoStops || []; for (const d of D) { try { if (d.running()) d.stop(); } catch (_) {} } }
      out.modes[m.key] = { n: S.length, L }; T.stop(); await wait(400); }
    return out; }, [mode === 'all', idx ? String(idx).split(',') : null]);
  console.log('demos registered:', r.demos.join(', '));
  for (const k of Object.keys(r.modes)) { console.log('== mode', k, '(' + r.modes[k].n + ' slides)'); for (const x of r.modes[k].L) console.log((x.run.length ? 'DEMO ' : '     ') + String(x.i).padStart(3) + ' ' + x.t + ' | ms ' + x.ms + ' | then ' + x.then + (x.anim ? ' | anim' : '') + ' | runs: ' + x.run.join(',') + ' | ' + x.go); }
} else {
  // run <mode> <i1,i2,...> [speed]: each slide in real time
  for (const one of String(idx).split(',')) {
    const r = await pg.evaluate(async ([mode, i, sp]) => { const c = window.__ctx, T = c.shared.tour, wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const running = () => (c.shared.demoStops || []).filter((d) => { try { return d.running(); } catch (_) { return false; } }).map((d) => d.id);
      T.start(mode, { speed: sp }); await wait(500); T.goto(i); const t0 = performance.now(); const log = []; let last = '', ran = false, endedAt = null, cut = null; const eyes = [];
      for (;;) { await wait(250); const st = T.state(), el = Math.round(performance.now() - t0), run = running().join(','); if (run) ran = true; if (ran && !run && endedAt == null) endedAt = el;
        if (run !== last) { log.push([el, run || '-']); last = run; }
        if (eyes.length < 400 && el % 5000 < 260) eyes.push([Math.round(el / 1000), c.camera.position.toArray().map((v) => +v.toFixed(1))]);
        if (!st.running || st.idx !== i) { cut = { at: el, idx: st.idx, running: st.running, demoStill: run }; break; } if (el > 420000) { cut = { at: el, timeout: true }; break; } }
      await wait(1200); const after = running().join(','), idxAfter = T.state().idx; const title = (T.slides[i] || {}).t; T.stop(); await wait(600); for (const d of (c.shared.demoStops || [])) { try { if (d.running()) d.stop(); } catch (_) {} } await wait(400);
      return { mode, i, title, log, demoEndedAt: endedAt, slideLeftAt: cut, afterLeave: after, idxAfter, eyes }; }, [mode, +one, +(spd || 1)]);
    console.log(JSON.stringify(r));
  }
}
await P.close(); process.exit(0);
