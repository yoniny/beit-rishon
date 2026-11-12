// the checks of the round of 12.11.2026 16:00 (2.0.6 = B1 1.3.9 + B2 1.9.7), IN REAL TIME: node t6.mjs <plugin dir> <rishon|sheni>
//  both:   a slide whose demonstration was cut after ten seconds now lasts to the demonstration's end, and then rests (2 s) or shows
//          its further views (3 s each); a slide of a place's demonstration still does
//  rishon: the base that brings the laver goes round and round - its slide shows one round
//  sheni:  the places "שער שושן" and "שער ניקנור" open their long card (the commentators; "בקצרה")
import { open } from './h.mjs';
const [,, dir, house] = process.argv;
const res = []; const ok = (name, cond, info) => { res.push(!!cond); console.log((cond ? 'OK   ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 420) : '')); };
const P = await open(dir); const pg = P.page;
const place = (t) => pg.evaluate((T) => { const b = [...document.querySelectorAll('#tm-panel details.tm-pl button')].find((b) => b.textContent.trim().indexOf(T) === 0); if (!b) return false; let d = b.closest('details'); while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); } b.click(); return true; }, t);
// one slide (by the start of its title) in real time: when the demonstration that it started stopped holding it, and when the slide left
const slide = (mode, title) => pg.evaluate(async ([mode, title]) => { const c = window.__ctx, T = c.shared.tour, wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const D = () => (c.shared.demoStops || []).filter((d) => { try { return d.running(); } catch (_) { return false; } });
  T.start(mode, { speed: 1 }); await wait(500); const i = (T.slides || []).findIndex((s) => String(s.title || '').indexOf(title) === 0); if (i < 0) { T.stop(); return { missing: title }; }
  T.goto(i); const t0 = performance.now(); let ids = '', end = null, left = null, round = null;
  for (;;) { await wait(200); const st = T.state(), el = performance.now() - t0, run = D();
    if (run.length) { ids = run.map((d) => d.id).join(','); if (round == null) { const r = run.find((d) => typeof d.roundLeft === 'function'); round = r ? +(el / 1000 + r.roundLeft()).toFixed(1) : 0; } }
    else if (ids && end == null) end = +(el / 1000).toFixed(1);
    if (!st.running || st.idx !== i) { left = +(el / 1000).toFixed(1); break; } if (el > 200000) break; }
  T.stop(); await wait(500); for (const d of (c.shared.demoStops || [])) { try { if (d.running()) d.stop(); } catch (_) {} } await wait(300);
  return { i, ran: ids, round, end, left }; }, [mode, title]);
const held = (r, tail0, tail1) => r && r.ran && r.left != null && (r.round ? r.left >= r.round + tail0 && r.left <= r.round + tail1 : r.end != null && r.left - r.end >= tail0 - 0.5 && r.left - r.end <= tail1) && r.left > 12;
if (house === 'rishon') {
  const a = await slide('topics', 'המכונה בפעולה');
  ok('the base that brings the laver: its slide shows one whole round (about 49 s) and two seconds more - it was cut after ten', held(a, 1.5, 4.5) && a.round > 40, a);
  const b = await slide('topics', 'פתיחת דלתות ההיכל — הדגמה');
  ok('the heichal\'s doors: the slide lasts to the demonstration\'s end and rests two seconds', held(b, 1.5, 4), b);
  const v = await slide('verses', "האופנים — 'אופן בתוך אופן'");
  ok('the same base in the verses\' presentation: one round', held(v, 1.5, 4.5) && v.round > 40, v);
} else {
  const a = await slide('topics', 'הראב״ד — הפשפש כעין חלון');
  ok('a reading of the wickets (a slide of the readings): the walk and the gate it opens run to their end - it was cut after ten seconds', held(a, 1.5, 4) && a.left > 45, a);
  const b = await slide('topics', 'רבי יהודה — בתוך הפתח, ונקפלות');
  ok('R. Yehudah\'s doors (a slide of the readings): to the demonstration\'s end', held(b, 1.5, 4) && b.left > 25, b);
  const g = await slide('topics', 'פתיחת השער הגדול — הדגמה');
  ok('the great gate: its further view (the open doors) comes after the demonstration, three seconds', held(g, 2.5, 5) && g.left > 25, g);
  // ---- the two gates' cards
  const card = async (t) => { await place(t); await pg.waitForTimeout(1500); return pg.evaluate(() => { const b = document.querySelector('#tm-xcard .b'); const x = b ? b.textContent : ''; return x; }); };
  const s = await card('שער שושן');
  ok('שער שושן opens the long card: the three commentators, the low wall, the ramp, and "בקצרה" twice (the rods; the wall\'s height)',
    s.indexOf('כשעלו מן הגולה ציוו להם מלכי פרס') >= 0 && s.indexOf('תוספות יום טוב') >= 0 && s.indexOf('תפארת ישראל') >= 0 && s.indexOf('בקצרה — המחלוקת בשתי האמות') >= 0 && s.indexOf('בקצרה — השיטות בגובהו') >= 0 && s.indexOf('כפין על גבי כפין') >= 0 && s.indexOf('חמש השיטות בגובהו: בכרטיס') < 0, { chars: s.length });
  const n = await card('שער ניקנור');
  ok('שער ניקנור opens the long card: the miracle of the doors (Bartenura), Tosafot Yom Tov, Tiferet Yisrael, "בקצרה" once',
    n.indexOf('שהלך לאלכסנדריא של מצרים להביא דלתות') >= 0 && n.indexOf('מכוון כנגד בית קודש הקדשים') >= 0 && n.split('בקצרה —').length === 2 && n.indexOf('לכל אחת כרטיס משלה') >= 0 && n.indexOf('הכרטיסים ״שער ניקנור״') < 0, { chars: n.length });
}
console.log('errs', JSON.stringify(P.errs.slice(0, 4)));
ok('no errors in the console', P.errs.length === 0, P.errs.slice(0, 3));
console.log(res.every(Boolean) ? 'ALL PASS (' + res.length + ')' : 'FAILED ' + res.filter((x) => !x).length + ' of ' + res.length);
await P.close(); process.exit(res.every(Boolean) ? 0 : 1);
