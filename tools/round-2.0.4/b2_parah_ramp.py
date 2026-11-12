# -*- coding: utf-8 -*-
# 1.9.5 - the ramp of the Parah out of the Shushan gate, on arches over arches, instead of the 36 steps (the user: "7. אפשרות א").
# Patches /home/claude/b2src/src/20-mount.js. Idempotent.
import io, sys
P = '/home/claude/b2src/src/20-mount.js'
s = io.open(P, encoding='utf-8').read()
if 'parahRamp' in s:
    print('b2_parah_ramp: already applied'); sys.exit(0)
def rep(a, b):
    global s
    if s.count(a) != 1: raise SystemExit('b2_parah_ramp: %d occurrences of: %s' % (s.count(a), a[:80]))
    s = s.replace(a, b)
rep('    H2.stairs(g, { width: 14, totalRise: 28, steps: 36, dir: "W", x: CO.harE + T / 2 + RUN, y: GROUND_Y, z: 0, tread: 0.8 });\n',
    '    // (1.9.5: no steps at the Shushan gate - the ramp of the Parah, below)\n')
rep('      rail(14, "W", CO.harE + T / 2 + RUN, 0);\n', '')
anchor = "    const colPos = [];\n    const addRun = (axis, fixed, from, to, step, gaps) => {"
new = r'''    // 1.9.5 (a remark sent on to the user, 11.11.2026: "בשער שושן לא הי' מדרגות אלא כבש להר הזיתים לשחיטת פרה ולשעיר המשתלח"; the user:
    // "אפשרות א" - a ramp instead of the steps): THE RAMP OF THE PARAH. Parah 3:6 (book 94, line 18): "וכבש היו עושים מהר הבית להר
    // המשחה, כפין על גבי כפין, וכפה כנגד האטם, מפני קבר התהום"; Middot 1:3: "שער המזרחי... שבו כהן גדול השורף את הפרה ופרה וכל
    // מסעדיה יוצאים להר המשחה"; the Rambam, Parah Adumah 3:1 (372, line 28): "וכבש היו עושין מהר הבית להר המשחה ותחתיו בנוי כפין
    // כפין וכפה על כל שני כפין כדי שיהיו שני רגלי הכפה על גג שני כפין שתחתיה. כדי שתהיה תחת הכל חלול מפני קבר התהום"; the
    // Bartenura (632, line 103): "רגלי הכפה שהכפה נשענת עליהם נקראין אטם. ואין רגלי הכפה העליונה כנגד רגלי התחתונה, אלא כנגד הכפה
    // עצמה, דכנגד אטם העליונה עומד חלל התחתונה". So: out of the Shushan gate eastward, a paved way on two rows of arches - every
    // pier of the upper row stands over the hollow of a lower arch, and every upper arch over a lower pier. It is drawn for 150 amot
    // only (the Mount of Olives is not built), level with the gate's sill, ten amot wide as the gate, a low kerb on both its sides.
    // Its height, width and length and the arches' measures - model choices. The 36 steps of 1.0 and their railing are gone here.
    {
      const X0 = CO.harE + T / 2, LEN = 150, WID = 10, BAY = 10, PIER = 3, YB = GROUND_Y - 2.5, YM = GROUND_Y + 14, YD = -1;
      const cw = new Group();
      cw.name = "parahRamp";
      g.add(cw);
      const R = (BAY - PIER) / 2;
      const tier = (y0, y1, c0, floor) => {   // a wall 0..LEN long, y0..y1, an arched hollow on every centre c0, c0 + BAY, ...
        const sh = new Shape();
        sh.moveTo(0, y0); sh.lineTo(LEN, y0); sh.lineTo(LEN, y1); sh.lineTo(0, y1); sh.closePath();
        const spring = y1 - 1.5 - R;
        for (let c = c0; c + R < LEN - 0.5; c += BAY) {
          const h = new Path();
          h.moveTo(c - R, floor); h.lineTo(c + R, floor); h.lineTo(c + R, spring);
          h.absarc(c, spring, R, 0, Math.PI, false);
          h.lineTo(c - R, floor);
          sh.holes.push(h);
        }
        const geo = new ExtrudeGeometry(sh, { depth: WID, bevelEnabled: false, curveSegments: 14 });
        const m = new Mesh(geo, M2.stone);
        m.position.set(X0, 0, -WID / 2);
        m.castShadow = m.receiveShadow = true;
        cw.add(m);
        return m;
      };
      tier(YB, YM, BAY / 2, YB + 0.4);          // the lower row: hollows on 5, 15, ... 145 (their floors under the ground)
      tier(YM, YD, BAY, YM + 0.03);             // the upper row: hollows on 10, 20, ... 140 - over the lower piers; its piers over the lower hollows
      H2.box(cw, LEN, 1, WID, M2.pave, X0 + LEN / 2, YD, 0);                                            // the way itself, its top level with the gate's sill
      for (const sz of [-1, 1]) H2.box(cw, LEN, 1, 0.5, M2.stoneSmooth, X0 + LEN / 2, 0, sz * (WID / 2 - 0.25));   // a low kerb
      ctx2.labels.push(
        { text: "כבש הפרה — כיפין על גבי כיפין, וכיפה כנגד האוטם (פרה ג, ו)", x: X0 + 55, y: 7, z: 0, size: 2.6 },
        { text: "אל הר המשחה (אינו מצויר)", x: X0 + LEN - 6, y: 4.5, z: 0, size: 2 });
    }
'''
rep(anchor, new + anchor)
# the gate's view: from the north-east, the gate and the ramp's two rows of arches (until 1.9.4 from the east, up the steps)
rep("      shushanGate: { pos: [500, 35, 0], target: [353, 15, 0] },",
    "      shushanGate: { pos: [455, 24, -88], target: [392, -4, 0] },   // 1.9.5: from the north-east - the gate and the ramp of the Parah on its two rows of arches")
io.open(P, 'w', encoding='utf-8').write(s)
print('b2_parah_ramp: applied')
