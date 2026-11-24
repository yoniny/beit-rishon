// Category 3 - the demonstrations (and the presentation). Each demonstration runs from its start to its end, a tick every 500 ms of the model's
// clock: figures needed in every frame (visible, feet on the floor - not under it, not in the air, not in a wall), no console errors, no blank
// frames, the eye not in a solid; then its bar: pause / resume / forward / back / speed / restart / stop.
export async function run(S, out, opt) {
  // the list: the pills that are demonstrations, and the places of the group "הדגמות"
  const list = await S.ev(() => {
    const c = window.__TM_CTX, o = [], ids = new Set((c.shared.demoStops || []).map((d) => d.id));
    (c.shared.modelButtons || []).forEach((b, i) => {
      if (!(ids.has(b.id) || /^הדגמ/.test(b.label || '') || /הדגמ/.test(b.id || ''))) return;
      // SCAN_420: a pill the model does not show now (its anchor is null - e.g. the throne's, which stand only in the readings that build
      // the scene they start) is not a button the user can press; its demonstration is checked from its place
      let a = true; try { if (typeof b.anchor === 'function') a = b.anchor(); } catch (_) { a = true; }
      if (a === null || a === undefined || a === false) return;
      o.push({ kind: 'pill', i, id: b.id, label: b.label });
    });
    for (const p of c.ui.places()) if (/הדגמה|הליכת|הכנסת|פתיחת דלתות|עלייה בלולים|עליית המלך/.test(p.title) || p.group === 'הדגמות') o.push({ kind: 'place', title: p.title, group: p.group, label: p.title, id: p.feature || p.title });
    return o;
  });
  out.stats.demoEntries = list.length;
  const only = opt.only ? String(opt.only).split(',') : null, limit = opt.limit ? +opt.limit : 1e9;
  const maxS = (opt.maxdemo ? +opt.maxdemo : 400) * 1000;   // SCAN_420: 400 s of the model's clock (the longest demonstrations run ~5 minutes)
  const doneIds = new Set();
  let k = 0;
  for (const d of list) {
    if (only && !only.some((o) => (d.label || '').includes(o) || (d.id || '').includes(o))) continue;
    if (doneIds.has(d.kind + d.label)) continue; doneIds.add(d.kind + d.label);
    if (k++ >= limit) break;
    const name = `${d.label}`;
    { const al0 = await S.ev(() => window.__SCAN.alive()).catch(() => null); if (al0 && (al0.lost || al0.mean < 5)) { out.add('critical', `הרינדור מת לפני ההדגמה "${name}" — סריקת ההדגמות נעצרה`, JSON.stringify(al0)); break; } }
    const n0 = S.msgs.length, t0 = Date.now();
    const start = (fresh) => S.ev(async (d, fresh) => {
      const c = window.__TM_CTX, SC = window.__SCAN; await SC.stopAll();
      window.__step(200);
      try {
        if (d.kind === 'pill') { const B = c.shared.modelButtons[d.i]; try { if (B.layer && c.ui.setLayer) c.ui.setLayer(B.layer, true); } catch (_) {} B.set(true); }
        else { const b = c.ui.placeButton(d.title); if (!b) return { err: 'no button' }; SC.clickEl(b); }
      } catch (e) { return { err: String(e.message) }; }
      SC.yes(); window.__step(300); await SC.sleep(15); SC.yes();
      S2: for (let i = 0; i < 4; i++) { window.__step(500); if (SC.running().length) break; }
      SC.cur = null; return { running: SC.running() };
    }, d, fresh).catch((e) => ({ err: String(e.message) }));
    const r0 = await start(true);
    if (r0.err) { out.add('high', `ההדגמה "${name}" לא התחילה: ${r0.err}`, 'שגיאה בהפעלה.', { item: d.id }); continue; }
    if (!r0.running.length) { out.add('high', `ההדגמה "${name}" לא רצה אחרי ההפעלה`, 'אחרי הלחיצה אף הדגמה אינה רשומה כרצה (demoStops).', { item: d.id }); continue; }
    // pass A: to the end
    let fin = null, guard = 0;
    while (guard++ < 60) {
      fin = await S.ev((ms) => window.__SCAN.demoRun(ms, 500, { fresh: false }), 20000).catch((e) => ({ err: String(e.message) }));
      if (fin.err || fin.finished || fin.t * 1000 >= maxS) break;
    }
    const rep = await S.ev(() => window.__SCAN.demoReport());
    const errs = S.errsSince(n0);
    const secs = rep ? rep.t : 0;
    out.stats['demo:' + name] = { seconds: Math.round(secs), figures: rep ? rep.figs.length : 0, finished: !!(fin && fin.finished), wall: Math.round((Date.now() - t0) / 1000) };
    const shotFor = (kind) => { const s = rep && rep.shots.find((x) => x.kind === kind); return s ? [out.shot('demo-' + d.label + '-' + kind, s.img)].filter(Boolean) : []; };
    if (fin && fin.err) out.add('high', `הדגמה "${name}" — שגיאה בזמן הריצה`, fin.err, { item: d.id });
    const contin = await S.ev(() => (window.__TM_CTX.shared.demoStops || []).some((q) => { try { return q.continuous && q.running(); } catch (_) { return false; } })).catch(() => false);
    if (fin && !fin.finished && !fin.err && !contin) out.add('medium', `הדגמה "${name}" לא הסתיימה תוך ${Math.round(secs)} שניות`, `עדיין רצות: ${(fin.running || []).join(', ')}.`, { item: d.id });
    if (errs.length) out.add('high', `שגיאות קונסול בהדגמה "${name}"`, `${errs.length} שגיאות. ${errs.slice(0, 3).map((m) => m.text).join(' | ')}`, { item: d.id });
    if (rep) {
      if (rep.nonfin) out.add('critical', `הדגמה "${name}": מצלמה במצב NaN/אינסוף`, `${rep.nonfin} פריימים.`, { item: d.id });
      if (rep.nBlank) out.add('high', `הדגמה "${name}": ${rep.nBlank} פריימים ריקים/שחורים`, `לדוגמה בשנייה ${rep.blank[0].t}: ממוצע בהירות ${rep.blank[0].ps.mean}, סטייה ${rep.blank[0].ps.std}.`, { item: d.id, shots: shotFor('blank') });
      if (rep.nInside) out.add('high', `הדגמה "${name}": המצלמה בתוך גוש בשנייה ${rep.inside[0].t}`, `${rep.nInside} דגימות; פוגעת בפן אחורי של ${rep.inside[0].of.join(', ')}.`, { item: d.id, shots: shotFor('cam-inside') });
      if (!rep.figs.length) out.add('info', `הדגמה "${name}": לא זוהו דמויות`, 'לא נמצאה קבוצה נעה בגודל אדם (ייתכן שהדגמה בלי דמויות).', { item: d.id });
      for (const f of rep.figs) {
        const pct = (n) => Math.round(100 * n / Math.max(1, f.vis));
        if (f.nUnder >= 2) out.add(pct(f.nUnder) > 25 ? 'high' : 'medium', `הדגמה "${name}": דמות "${f.name}" מתחת לרצפה`, `${f.nUnder} מתוך ${f.vis} פריימים גלויים (${pct(f.nUnder)}%); למשל בשנייה ${f.under[0].t}: כפות הרגליים ${f.under[0].dy} אמות מתחת לרצפה ב־${f.under[0].at}.`, { item: d.id, shots: shotFor('feet') });
        if (f.nHover >= 2) out.add(pct(f.nHover) > 25 ? 'high' : 'medium', `הדגמה "${name}": דמות "${f.name}" באוויר`, `${f.nHover} מתוך ${f.vis} פריימים (${pct(f.nHover)}%); למשל בשנייה ${f.hover[0].t}: ${f.hover[0].dy} אמות מעל הרצפה ב־${f.hover[0].at}.`, { item: d.id, shots: shotFor('feet') });
        if (f.nWall >= 2) out.add('medium', `הדגמה "${name}": דמות "${f.name}" בתוך קיר/גוש`, `${f.nWall} דגימות; למשל בשנייה ${f.wall[0].t} ב־${f.wall[0].at} (${f.wall[0].of.join(', ')}).`, { item: d.id, shots: shotFor('wall') });
        if (f.vanish.length && f.lastVis < secs - 3 && f.vis >= 4) out.add('medium', `הדגמה "${name}": דמות "${f.name}" נעלמת באמצע (בשנייה ${f.vanish[0]} מתוך ${Math.round(secs)})`, `גלויה ${f.vis} פריימים (${f.firstVis}–${f.lastVis} שנ').`, { item: d.id });
        if (f.noFloor > 3) out.add('low', `הדגמה "${name}": דמות "${f.name}" ללא רצפה מתחתיה`, `${f.noFloor} פריימים בלי משטח מתחת לרגליים.`, { item: d.id });
      }
    }
    // pass B: the bar
    const n1 = S.msgs.length;
    const r1 = await start(false);
    let ctl = null;
    if (r1.running && r1.running.length) ctl = await S.ev(() => window.__SCAN.demoControls()).catch((e) => ({ err: String(e.message) }));
    if (ctl && ctl.err) out.add('high', `הדגמה "${name}": בדיקת הפס נכשלה`, ctl.err, { item: d.id });
    else if (ctl) for (const st of ctl.steps) if (!st.ok) out.add(st.name === 'bar-visible' ? 'medium' : 'high', `הדגמה "${name}": בקרה "${st.name}" נכשלה`, st.detail, { item: d.id });
    const errs2 = S.errsSince(n1); if (errs2.length) out.add('high', `שגיאות קונסול בבקרת ההדגמה "${name}"`, errs2.slice(0, 2).map((m) => m.text).join(' | '), { item: d.id });
    await S.ev(() => window.__SCAN.stopAll());
    console.log(`[demos] ${name}: ${Math.round(secs)}s of the model's clock, ${rep ? rep.figs.length : 0} figures, ${((Date.now() - t0) / 1000).toFixed(0)}s wall`);
  }
  // presentations: the slides that run a demonstration
  if (!opt.notour) {
    const modes = await S.ev(() => { const T = window.__TM_CTX.shared.tour; return T ? T.modes.map((m) => m.key) : []; });
    out.stats.tourModes = modes;
    for (const mk of modes) {
      if (only) break;
      const slides = await S.ev((mk) => window.__TM_CTX.shared.tour.plan(mk).map((s, i) => ({ i, title: s.title, anim: s.anim, target: s.target })), mk);
      out.stats['tour:' + mk] = slides.length;
      const miss = slides.filter((s) => /MISSING/.test(s.target || ''));
      for (const s of miss.slice(0, 10)) out.add('medium', `מצגת "${mk}": שקופית ${s.i + 1} "${s.title}" בלי יעד מצלמה`, `היעד: ${s.target}.`, { item: mk + ':' + s.i });
      const anims = slides.filter((s) => s.anim);
      const lim = opt.tourlimit ? +opt.tourlimit : 6;
      for (const s of anims.slice(0, lim)) {
        const n0 = S.msgs.length;
        const res = await S.ev(async (mk, i) => {
          const SC = window.__SCAN, T = window.__TM_CTX.shared.tour; await SC.stopAll();
          try { T.start(mk, {}); } catch (e) { return { err: 'start: ' + e.message }; }
          window.__step(2500); await SC.sleep(300); window.__step(300); SC.yes();
          if (!T.goto(i)) return { err: 'goto(' + i + ') false' };
          window.__step(2500); await SC.sleep(100); window.__step(500); SC.cur = null;
          const r = await SC.demoRun(40000, 500, { fresh: true, alive: () => T.state().running && T.state().idx === i });
          const rep = SC.demoReport(); await SC.stopAll(); return { r, rep };
        }, mk, s.i).catch((e) => ({ err: String(e.message) }));
        const errs = S.errsSince(n0);
        if (res.err) { out.add('high', `מצגת "${mk}", שקופית ${s.i + 1} "${s.title}": ${res.err}`, 'שגיאה בהרצת השקופית.', { item: mk + ':' + s.i }); continue; }
        for (const f of res.rep.figs) {
          if (f.nUnder >= 2) out.add('medium', `מצגת "${mk}" / "${s.title}": דמות "${f.name}" מתחת לרצפה`, `${f.nUnder} מתוך ${f.vis} פריימים (בשנייה ${f.under[0].t}: ${f.under[0].dy}).`, { item: mk + ':' + s.i });
          if (f.nHover >= 2) out.add('medium', `מצגת "${mk}" / "${s.title}": דמות "${f.name}" באוויר`, `${f.nHover} מתוך ${f.vis} פריימים (בשנייה ${f.hover[0].t}: ${f.hover[0].dy}).`, { item: mk + ':' + s.i });
        }
        if (res.rep.nBlank) out.add('high', `מצגת "${mk}" / "${s.title}": ${res.rep.nBlank} פריימים ריקים`, '', { item: mk + ':' + s.i });
        if (errs.length) out.add('high', `שגיאות קונסול במצגת "${mk}" / "${s.title}"`, errs.slice(0, 2).map((m) => m.text).join(' | '), { item: mk + ':' + s.i });
      }
    }
  }
}
