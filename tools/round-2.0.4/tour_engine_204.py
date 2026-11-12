#!/usr/bin/env python3
# The presentation's engine, 1.3.7 / 1.9.5 (75-tour.js of BOTH houses: beit-rishon/src and b1/src - the second house's port source).
# Idempotent (marker TOUR_ENGINE_204).
#  1. THE ENGINE BUG (the scan of 11.11.2026): leaving the slide of a reading whose row runs a demonstration when it is picked (the
#     way from the wicket to the great gate) set the row back - and the row's onPick started the DEFAULT reading's demonstration over
#     the next slide. Now the demonstrations are stopped after the rows went back.
#  2. A PLACE OF SEVERAL THINGS (the user, 11.11.2026: "אם כרטיס אחד... מציג כמה דברים המצגת צריכה להציג את כולם באותו הכרטיס (דהיינו
#     באותם ה7 שניות להסתובב ולהציג הכל"): a place of the panel may name further cameras (item.tourThen); its slide flies to each in
#     its turn, the slide's time shared between them. (The verses' slides had this already: "then".)
#  3. A PLACE THAT HAS NO SLIDE OF ITS OWN (item.noTour: its matter is shown by another place's slide - the same camera twice).
import io, sys
n = 0
for P in ('/home/claude/beit-rishon/src/75-tour.js', '/home/claude/b1/src/75-tour.js'):
    s = io.open(P, encoding='utf-8').read()
    if 'TOUR_ENGINE_204' in s:
        print(P, 'already'); continue
    def rep(a, b):
        global s
        assert s.count(a) == 1, (P, s.count(a), a[:80])
        s = s.replace(a, b)
    rep("""          const rows0 = rowsOf().filter((r) => r !== s.row).map((r) => [r, r.cur]);
          rt.undo.push(() => {
            for (const [r, k] of rows0) if (r.cur !== k) setRow(r, k);
          });
          setRow(s.row, s.key);""",
        """          // 1.3.7 / 1.9.5 (TOUR_ENGINE_204; the scan of 11.11.2026): a row whose onPick runs a demonstration (the way from the wicket to
          // the great gate) started the DEFAULT reading's demonstration when the slide was left and the row went back - over the next
          // slide. The demonstrations are stopped after the rows went back (pushed before their undos: the stack runs backwards)
          rt.undo.push(() => call(ctx.shared.stopDemos));
          const rows0 = rowsOf().filter((r) => r !== s.row).map((r) => [r, r.cur]);
          rt.undo.push(() => {
            for (const [r, k] of rows0) if (r.cur !== k) setRow(r, k);
          });
          setRow(s.row, s.key);""")
    rep("""      const placeSlide = (p, groupCam) => {""",
        """      // 1.3.7 / 1.9.5 (TOUR_ENGINE_204; the user, 11.11.2026: "אם כרטיס אחד... מציג כמה דברים המצגת צריכה להציג את כולם באותו הכרטיס
      // (דהיינו באותם ה7 שניות להסתובב ולהציג הכל"): a place that speaks of several things names their further cameras - item.tourThen,
      // a list of { cam, tg } | { fp } | { place } - and its slide flies to each in its turn, the slide's time shared between them
      const placeThen = (p) => {
        const L = p && p.item && Array.isArray(p.item.tourThen) ? p.item.tourThen.filter((t) => t && (t.fp || t.place || (t.cam && t.tg))) : [];
        if (!L.length) return null;
        const share = 1 / (L.length + 1);
        return L.map((t, i) => ({ go: [t.fp ? { fp: t.fp } : t.place ? { place: t.place } : { pos: t.cam, target: t.tg }], at: (i + 1) * share, dur: t.dur || 1900 }));
      };
      const placeSlide = (p, groupCam) => {""")
    rep("""          pf: placeOwnFeat(p), act: placeAct(p), actOnly: !!(placeAct(p) && !placeOwnCam(p)),   // 1.3.5 / 1.9.3""",
        """          pf: placeOwnFeat(p), act: placeAct(p), actOnly: !!(placeAct(p) && !placeOwnCam(p)),   // 1.3.5 / 1.9.3
          then: placeThen(p),   // 1.3.7 / 1.9.5""")
    rep("""        if (Array.isArray(list) && list.length) return list.filter((p) => p && p.title);""",
        """        // 1.3.7 / 1.9.5 (TOUR_ENGINE_204): a place whose matter is shown by another place's slide (item.noTour) has no slide of its own
        if (Array.isArray(list) && list.length) return list.filter((p) => p && p.title && !(p.item && p.item.noTour));""")
    io.open(P, 'w', encoding='utf-8').write(s)
    n += 1
    print(P, 'applied')
print(n, 'files')
