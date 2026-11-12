# -*- coding: utf-8 -*-
# 2.0.4 / B2 1.9.5 - TWO READINGS OF THE FIFTEEN STEPS, THE RAMBAM'S THE DEFAULT (the user, 11.11.2026 17:11: "מעלות שתי קריאות רמבם
# ברירת מחדל"). Adds the Rambam's half discs (the group steps15Round) beside the wide steps of b2_steps_wide.py (steps15In / steps15Out,
# now the reading of the Rid and R. Yehonatan), and gives ctx2.shared.steps15 its two modes. Idempotent by the marker "steps15Round".
import io
P = '/home/claude/b2src/src/30-courts.js'
s = io.open(P, encoding='utf-8').read()
if 'steps15Round' in s:
    print('30-courts.js: already patched')
else:
    OLD = '''    ctx2.shared.steps15 = {   // the steps' length follows the place of the four chambers (ctx2.shared.eznChambers, above)
      sync() {
        const out = !!(ctx2.shared.eznChambers && ctx2.shared.eznChambers.mode === "outside");
        steps15Out.visible = out; steps15In.visible = !out;
        return out;
      }
    };
'''
    assert s.count(OLD) == 1
    NEW = '''    // 1.9.5, later the same day (the user, 11.11.2026 17:11: "מעלות שתי קריאות רמבם ברירת מחדל"): TWO READINGS OF THE FIFTEEN STEPS.
    // The Rambam's commentary on Middot 2:5 (the user's library, book 573, line 25) stands against the Rid's length: "שמעלות עזרת נשים
    // לא היו ארוכים כשאר המעלות כמו שהוא מפורסם היום מצורת המדרגות אלא היתה כל מעלה כמו חצי עגולה עד שתהא כל מעלה חצי גורן כזה [a
    // drawing] ולפיכך היתה צורת המעלה כמי שלקח קצת אצטבא ונתן אותה על המעלה עד שמשלים צורת הסולם". So the row "חמש עשרה המעלות —
    // צורתן" is back in the opinions table (rows_200.py, part 9):
    //   "rambam" (THE DEFAULT) - the group steps15Round: fifteen half discs lying one on the other before Nikanor's gate, each half an
    //     amah high (Middot 2:3; Beit HaBechirah 6:2), the top one 15 in radius (the gate and its two wickets, z +-10..14, stand on
    //     it) and each one below it half an amah more - the lowest 22; the five lowest are cut at z +-19.5, where the walls of the two
    //     small chambers of the gate stand. The radii and the cut - model choices. (These are the half discs the model had until 1.9.2
    //     and again in 1.9.4 under "הרא״ש — כציורו"; there they ran into the two small chambers.)
    //   "rid" - the wide steps above (steps15In / steps15Out by the place of the four chambers): the Rid and R. Yehonatan's length
    //     with the Meiri's shape.
    const steps15Round = new Group();
    steps15Round.name = "steps15Round";
    g.add(steps15Round);
    ctx2.layers.steps15Round = steps15Round;
    for (let k = 1; k <= 15; k++) {
      const R = 22 - (k - 1) * 0.5, zc = Math.min(R, 19.5), uc = Math.sqrt(Math.max(0, R * R - zc * zc)), a = Math.asin(zc / R);
      const sh = new Shape();   // in the shape's plane: x = the model's x - 96 (east of the wall's face), y = the model's -z
      sh.moveTo(0, -zc);
      if (uc > 0.001) sh.lineTo(uc, -zc);
      sh.absarc(0, 0, R, -a, a, false);
      sh.lineTo(0, zc);
      sh.lineTo(0, -zc);
      const geo = new ExtrudeGeometry(sh, { depth: 0.5, bevelEnabled: false, curveSegments: 48 });
      geo.rotateX(-Math.PI / 2);   // the extrusion rises: the slab stands on y 0..0.5
      const st = new Mesh(geo, M2.stoneSmooth);
      st.position.set(96, 6 + (k - 1) * 0.5, 0);
      st.castShadow = st.receiveShadow = true;
      steps15Round.add(st);
    }
    steps15In.visible = false;
    ctx2.shared.steps15 = {
      mode: "rambam",
      set(m) { this.mode = m === "rid" ? "rid" : "rambam"; this.sync(); return this.mode; },
      sync() {   // the wide steps' length follows the place of the four chambers (ctx2.shared.eznChambers, above)
        const rid = this.mode === "rid", out = !!(ctx2.shared.eznChambers && ctx2.shared.eznChambers.mode === "outside");
        steps15Round.visible = !rid;
        steps15Out.visible = rid && out; steps15In.visible = rid && !out;
        return out;
      }
    };
'''
    s = s.replace(OLD, NEW)
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('30-courts.js: patched')
