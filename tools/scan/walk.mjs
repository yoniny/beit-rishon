// Category 6 - walk mode, mapped. The walker's own floor rule over a grid of the whole model (walk-inpage.js): places that the main walk cannot
// reach, places from which one cannot come back, stairs whose rise is too high for the eye (the eye keeps its height - the stair is a wall),
// jumps of the eye, enclosed rooms with no way in, and explicit pairs (City of David <-> the Siloam spring ...).
import fs from 'node:fs';
const SRC = fs.readFileSync(new URL('./walk-inpage.js', import.meta.url), 'utf8');
export async function run(S, out, opt) {
  await S.ev(SRC);
  const t0 = Date.now();
  const R = await S.ev((G, cap) => window.__SCAN.walkBuild(G, cap), opt.grid ? +opt.grid : 2, opt.cap ? +opt.cap : 200000);
  out.stats.walk = { G: R.G, nodes: R.N, tris: R.tris, mainReach: R.reach, back: R.back, region: R.region.map((v) => Math.round(v)), seconds: Math.round((Date.now() - t0) / 1000), skipped: R.skipped };
  const sh = async (name, pos, tg) => { try { const j = await S.ev(async (pos, tg) => { const SC = window.__SCAN; SC.stopAll && 0; const P = { p: [pos[0] + 12, pos[1] + 10, pos[2] + 12], t: tg || pos }; SC.setPose(P); window.__step(200); window.__step(200); return SC.shotNow(420); }, pos, tg); return [out.shot(name, j)].filter(Boolean); } catch (_) { return []; } };
  if (!R.mainStart) { out.add('high', 'סריקת ההליכה: לא נמצאה נקודת התחלה על רצפה', 'אין משטח הליכה בנקודות המצלמה של המקומות.'); return; }
  const unreach = R.places.filter((p) => p.node && !p.fwd), traps = R.places.filter((p) => p.node && p.fwd && !p.back), nofl = R.places.filter((p) => !p.node);
  out.stats.walk.places = R.places.length; out.stats.walk.unreachablePlaces = unreach.length; out.stats.walk.trapPlaces = traps.length; out.stats.walk.noFloorPlaces = nofl.length;
  for (const p of unreach) out.add('high', `נקודה בלתי נגישה במצב הליכה: "${p.title}"`, `מצב הליכה שמתחיל בנקודת המצלמה של המקום (${p.pos}) אינו מגיע אליו מההליכה הראשית (מ־${R.mainStart.map((v) => Math.round(v))}); קבוצה: ${p.group}.`, { item: p.title, shots: await sh('unreach-' + p.title, p.pos) });
  for (const p of traps.slice(0, 5)) out.add('info', `מלכודת: מ"${p.title}" אי אפשר לחזור להליכה הראשית`, `אפשר להגיע אליו (בנפילה/ירידה) אך לא לעלות חזרה לנקודת ההתחלה. תלוי בבחירת ההתחלה (ההתחלה הנבחרת היא הגבוהה ביותר) — מידע בלבד, לא באג. ${p.pos}.`, { item: p.title });
  for (const p of nofl.slice(0, 20)) out.add('low', `אין רצפה מתחת למצלמת המקום "${p.title}"`, `במצב הליכה עין תנחת לגובה לא מוגדר (${p.pos}).`, { item: p.title });
  for (const q of R.blocked) out.add(q.rise > 1.6 ? 'high' : 'medium', `מדרגה גבוהה מדי לעין (${q.rise} אמות > 1.2) ליד ${q.near}`, `${q.n} עמודות רשת סביב ${q.at}: מעבר מרצפה נגישה למשטח גבוה ב־${q.rise} אמות שהעין לא מטפסת עליו — הגובה "לא עולה", והעין נכנסת אל המדרגה. המשטח שמעליה אינו נגיש מההליכה הראשית.`, { item: 'blocked@' + q.at.join(','), shots: await sh('step-' + q.at.join('_'), q.at) });
  for (const r of R.rooms.slice(0, 15)) out.add(r.area >= 200 ? 'medium' : 'low', `חלל סגור (עם תקרה) שאין אליו דרך הליכה ליד ${r.near}`, `${r.area} מ"ר באמות, מרכז ${r.at}.`, { item: 'room@' + r.at.join(',') });
  for (const j of R.jumps.filter((x) => x.dy > -6).slice(0, 20)) out.add(Math.abs(j.dy) >= 1.0 ? 'medium' : 'low', `קפיצת גובה של העין (${j.dy > 0 ? '+' : ''}${j.dy} אמות בצעד של שליש אמה) ליד ${j.near}`, `${j.n} צעדים באזור ${j.at}. עלייה מעל 0.7 או ירידה מעל 1.5 בצעד אחד נראית כקפיצה.`, { item: 'jump@' + j.at.join(',') });
  out.stats.walk.trapNote = 'trap = reachable from the (highest) start but cannot climb back: start-dependent, shown as info only; ' + traps.length + ' places';
  out.stats.walk.jumpSpots = R.jumps.length; out.stats.walk.blockedSpots = R.blocked.length; out.stats.walk.roomsNoWay = R.rooms.length;
  // explicit pairs
  const pairs = [['עיר דוד', 'מעיין השילוח'], ['השער המזרחי', 'הר הבית'], ['מזבח הנחושת', 'ההיכל'], ['העזרה', 'שער ניקנור'], ['עזרת ישראל', 'הבית (בית ה']];
  for (const [a, b] of pairs) {
    const r = await S.ev(([a, b]) => window.__SCAN.walkPair(a, b), [a, b]);
    if (!r || r.missing || r.nofloor) { out.add('info', `בדיקת מעבר "${a}" ↔ "${b}" לא בוצעה`, r ? (r.missing ? 'לא נמצא מקום בשם "' + r.missing + '"' : 'אין רצפה ב"' + r.nofloor + '"') : 'ללא תוצאה'); continue; }
    if (!r.ab || !r.ba) out.add('high', `חסימה במעבר: "${r.a}" ${r.ab ? '→' : '✗→'} "${r.b}" ${r.ba ? '' : '(וחזרה ✗)'}`, `${!r.ab ? 'מ' + r.a + ' אי אפשר להגיע ל' + r.b + ' ברגל (מצב הליכה). ' : ''}${!r.ba ? 'מ' + r.b + ' אי אפשר להגיע ל' + r.a + '.' : ''} נקודות: ${r.pa} ↔ ${r.pb}.`, { item: a + '↔' + b, shots: await sh('pair-' + a + '-' + b, r.pa, r.pb) });
    else out.add('info', `מעבר "${r.a}" ↔ "${r.b}" תקין בשני הכיוונים`, '', { item: a + '↔' + b });
  }
  out.extra.walkRaw = { places: R.places, blocked: R.blocked, jumps: R.jumps, rooms: R.rooms };
}
