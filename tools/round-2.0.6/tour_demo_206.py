#!/usr/bin/env python3
# 12.11.2026 16:00, the user: "בודאי כל מקום שיש הדגמה חייב להיות ארוך עד סוף ההדגמה".
# Measured first (qa/fs/demoprobe.mjs, real time): a PLACE's demonstration already held its slide (1.3.5 / 1.9.3, rt.act) - the lulim
# 36.8 s, the heichal's doors 15.1 s, the great gate 29.3 s, the wickets 52.8 s, the mesibah 47.8 s, the mukhni 25.7 s. What WAS cut after
# ten seconds: a demonstration started by a READING's choice (B2: the wickets' three readings, R. Yehudah's doors, the avnet's garments)
# or by a FEATURE of the slide (B1: the base that brings the laver - topics 31, verses 33).
# TOUR_DEMO_HOLD_206, in both copies of the engine (B1: beit-rishon/src/75-tour.js; the base that port_tour.py carries to B2: b1/src/75-tour.js):
#   - any running demonstration holds the slide (two minutes more at most, as before);
#   - while it runs it leads the eye: no orbit, and the slide's further views wait for it; when it ends they come, three seconds each;
#   - with no further views, the demonstration's end rests two seconds before the next slide.
import sys
FILES = ['/home/claude/beit-rishon/src/75-tour.js', '/home/claude/b1/src/75-tour.js']
A1 = "        if (!th || rt.thenI >= th.length || elapsed < total * th[rt.thenI].at) return;\n"
B1 = ("        // TOUR_DEMO_HOLD_206: after a demonstration the further views that waited for it have times of their own (rt.thenAbs)\n"
      "        if (!th || rt.thenI >= th.length || elapsed < (rt.thenAbs ? rt.thenAbs[rt.thenI] : total * th[rt.thenI].at)) return;\n")
A2 = ("          thenStep(rt);\n"
      "          if (!(rt.act && demoRunning())) orbitStep(rt);   // 1.3.5 / 1.9.3: a demonstration leads the eye itself\n")
B2 = ("          // TOUR_DEMO_HOLD_206 (the user, 12.11.2026 16:00: \"כל מקום שיש הדגמה חייב להיות ארוך עד סוף ההדגמה\"): ANY demonstration that\n"
      "          // runs in a slide holds it - also one that a reading's choice or a feature of the slide started (until 2.0.5 only a place's\n"
      "          // action, rt.act, did: the readings of the wickets and of the doors, and the base that brings the laver, were cut after ten\n"
      "          // seconds). While it runs it leads the eye itself: no orbit, and the slide's further views wait; when it ends they come one\n"
      "          // after the other, three seconds each; with none, its end rests two seconds.\n"
      "          const demo = demoRunning();\n"
      "          if (demo) rt.demoSeen = true;\n"
      "          else if (rt.demoSeen && rt.demoEnd == null) {\n"
      "            rt.demoEnd = elapsed;\n"
      "            const th = rt.s.then, n = th ? th.length - rt.thenI : 0;\n"
      "            if (n > 0) {\n"
      "              rt.thenAbs = [];\n"
      "              for (let j = rt.thenI; j < th.length; j++) rt.thenAbs[j] = elapsed + 300 + (j - rt.thenI) * 3000;\n"
      "              total = Math.max(total, elapsed + 300 + n * 3000);\n"
      "            } else total = Math.max(total, elapsed + 2000);\n"
      "          }\n"
      "          if (!demo) {\n"
      "            thenStep(rt);\n"
      "            if (!rt.demoSeen) orbitStep(rt);   // (after a demonstration the eye stays where it left it)\n"
      "          }\n")
A3 = "          if (rt && rt.act && elapsed < total + 120000 * speed && demoRunning()) return;\n"
B3 = "          if (rt && elapsed < total + 120000 * speed && demoRunning()) return;   // TOUR_DEMO_HOLD_206: any demonstration, not only a place's action\n"
A4 = "thenI: 0, lv: null, anim: null, outside: false, act: false, actOnly: false };"
B4 = "thenI: 0, lv: null, anim: null, outside: false, act: false, actOnly: false, demoSeen: false, demoEnd: null, thenAbs: null };"
for f in FILES:
    s = open(f, encoding='utf-8').read()
    if 'TOUR_DEMO_HOLD_206' in s:
        print('already:', f); continue
    for a, b in ((A1, B1), (A2, B2), (A3, B3), (A4, B4)):
        assert s.count(a) == 1, (f, a[:60])
        s = s.replace(a, b)
    open(f, 'w', encoding='utf-8').write(s); print('patched:', f)

# ---- stage b (after the first real-time run): 
#   - a demonstration that goes round and round (B1: the base that brings the laver - a round of about 49 s, then again; with stage a alone
#     its slide waited the whole two minutes) holds a slide for ONE round: its demoStops entry tells roundLeft(), seconds;
#   - a slide with a timeline of its own (the throne's three, 66-80 s) is not held: the timeline is its length, as before.
C1 = "      const runPlace = (rt, s, res) => {\n"
D1 = ("      // TOUR_DEMO_HOLD_206 b: does a demonstration hold this slide now? One that goes round and round (its entry has roundLeft(), the\n"
      "      // seconds left of its present round) holds it for one round, counted from the moment the slide first saw it running\n"
      "      const demoHolds = (rt) => {\n"
      "        const L = ctx.shared.demoStops;\n"
      "        if (!rt || rt.anim || !Array.isArray(L)) return false;   // (a slide with a timeline: the timeline is its length)\n"
      "        for (const d of L) {\n"
      "          try {\n"
      "            if (!d || !fnc(d.running) || !d.running()) continue;\n"
      "            if (fnc(d.roundLeft)) {\n"
      "              const R = rt.rounds || (rt.rounds = {});\n"
      "              if (R[d.id] === undefined) R[d.id] = elapsed + Math.max(0, +d.roundLeft() || 0) * 1000;\n"
      "              if (elapsed >= R[d.id]) continue;\n"
      "            }\n"
      "            return true;\n"
      "          } catch (_) {\n"
      "          }\n"
      "        }\n"
      "        return false;\n"
      "      };\n"
      "      const runPlace = (rt, s, res) => {\n")
C2 = "          const demo = demoRunning();\n"
D2 = "          const demo = demoHolds(rt);\n"
C3 = "          if (rt && elapsed < total + 120000 * speed && demoRunning()) return;   // TOUR_DEMO_HOLD_206: any demonstration, not only a place's action\n"
D3 = "          if (rt && elapsed < total + 120000 * speed && demoHolds(rt)) return;   // TOUR_DEMO_HOLD_206: any demonstration, not only a place's action\n"
for f in FILES:
    s = open(f, encoding='utf-8').read()
    if 'TOUR_DEMO_HOLD_206 b' in s:
        print('already (b):', f); continue
    for a, b in ((C1, D1), (C2, D2), (C3, D3)):
        assert s.count(a) == 1, (f, a[:60])
        s = s.replace(a, b)
    open(f, 'w', encoding='utf-8').write(s); print('patched (b):', f)
# the base's entry tells how much of its round is left (B1 only)
f = '/home/claude/beit-rishon/src/45-vessels.js'
s = open(f, encoding='utf-8').read()
if 'TOUR_DEMO_HOLD_206' not in s:
    a = '.push({ id: "mechonaDemo", running: () => st.running || st.homing, stop: () => demo.reset() });'
    b = ('.push({ id: "mechonaDemo", running: () => st.running || st.homing, stop: () => demo.reset(),\n'
         '      roundLeft: () => Math.max(0, TL.total - st.tau) });   // TOUR_DEMO_HOLD_206: it goes round and round - a slide of the presentation shows one round')
    assert s.count(a) == 1
    open(f, 'w', encoding='utf-8').write(s.replace(a, b)); print('patched: the base tells roundLeft')
