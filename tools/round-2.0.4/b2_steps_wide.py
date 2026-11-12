# -*- coding: utf-8 -*-
# 2.0.4 / B2 1.9.5 - ONE DRAWING OF THE FIFTEEN STEPS (the user, 11.11.2026 16:06: "יוצא היום שאין הבדל בין המאירי לראש במעלות של שער
# ניקנור... צריך לאחד אותם. כבר אין שתי שיטות"; 16:31: "רחב במעלות"). Replaces the two groups steps15Meiri / steps15Rosh of 30-courts.js.
# Idempotent by the marker "steps15In".
import io, re
P = '/home/claude/b2src/src/30-courts.js'
s = io.open(P, encoding='utf-8').read()
if 'steps15In' in s:
    print('30-courts.js: already patched')
else:
    a = s.index('    const steps15M = new Group(), steps15R = new Group();')
    b = s.index('    const leafGeo = H2.uvWorldBox(new BoxGeometry(0.35, 19, 4.9), 0.35, 19, 4.9);')
    assert a < b and s.count('const steps15M = new Group()') == 1
    NEW = '''    // 1.9.5 (the user, 11.11.2026 16:06: "יוצא היום שאין הבדל בין המאירי לראש במעלות של שער ניקנור... צריך לאחד אותם. כבר אין שתי
    // שיטות"; 16:31: "רחב במעלות"): ONE DRAWING OF THE FIFTEEN STEPS. In the user's library the Meiri (6033, line 35) gives the shape -
    // "התחתונה קצרה והשניה עודפת לה משני קצותיה וכן שלישית לשניה" - and no length; the Rid (7576, line 355) and R. Yehonatan (line
    // 353) give the length - "ואורך המעלה היה קל"ה אמה כרוחב העזרה מכותל לכותל" - and no shape; the Rosh (6035, line 32): "אלא מוקפות
    // כחצי גורן עגולה. כזו". So: straight steps along the court's west wall, half an amah high and deep (Middot 2:3), the top one as
    // long as the free width and each one below it shorter at both its ends, the ends on an arc - "כחצי גורן". THE FREE WIDTH: with the
    // four chambers inside the court's corners (the default, Tosafot Yom Tov) the two small chambers of Nikanor's gate (z +-19.5..28.5)
    // stand between the gate and the corner chambers, so the steps run between them - 39 amot; with the chambers outside (the Rosh;
    // ctx2.shared.eznChambers) - from wall to wall, 135, and the two small chambers stand in them (no step is drawn inside those two,
    // nor before their doors). The arc (through the two ends of the top step, 7.5 deep - the steps' whole run) and so the lowest step's
    // length, and the steps being straight - model choices. The two drawings of 1.9.3 / 1.9.4 (the round terrace by the gate, "המאירי";
    // the half discs, "הרא״ש — כציורו") are gone, and with them the row "חמש עשרה המעלות — צורתן" of the opinions table.
    const steps15In = new Group(), steps15Out = new Group();
    steps15In.name = "steps15In"; steps15Out.name = "steps15Out";
    steps15Out.visible = false;
    g.add(steps15In); g.add(steps15Out);
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.steps15In = steps15In; ctx2.layers.steps15Out = steps15Out;
    {
      const XW = 96, C0 = 19.5, C1 = 28.5;   // the west wall's face; the two small chambers of the gate stand at z +-C0..C1
      const build = (grp, HZ) => {
        const RR = (HZ * HZ + 7.5 * 7.5) / 15;   // the arc: its chord the free width, its depth the steps' run
        for (let k = 1; k <= 15; k++) {
          const d = 0.5 * (15 - k), half = Math.sqrt(Math.max(0, RR * RR - (RR - 7.5 + d) * (RR - 7.5 + d))), dep = 0.5 * (16 - k);
          const seg = (z0, z1) => {   // solid down to the court's floor, so that no step hangs over the one below it
            const st = H2.box(grp, dep, 0.5 * k, z1 - z0, M2.stoneSmooth, XW + dep / 2, 6, (z0 + z1) / 2);
            st.castShadow = st.receiveShadow = true;
          };
          seg(-Math.min(half, C0), Math.min(half, C0));
          if (half > C1 + 0.01) { seg(C1, half); seg(-half, -C1); }
        }
      };
      build(steps15In, C0);
      build(steps15Out, 67.5);
    }
    ctx2.labels.push({ text: "חמש עשרה המעלות — כחצי גורן", x: 104, y: 16.5, z: 0, size: 1.6 });
    ctx2.shared.steps15 = {   // the steps' length follows the place of the four chambers (ctx2.shared.eznChambers, above)
      sync() {
        const out = !!(ctx2.shared.eznChambers && ctx2.shared.eznChambers.mode === "outside");
        steps15Out.visible = out; steps15In.visible = !out;
        return out;
      }
    };
    {
      const E = ctx2.shared.eznChambers, set0 = E.set;
      E.set = function (m) { const r = set0.call(this, m); ctx2.shared.steps15.sync(); return r; };
    }
'''
    s = s[:a] + NEW + s[b:]
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('30-courts.js: patched')
