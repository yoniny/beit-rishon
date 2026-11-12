# -*- coding: utf-8 -*-
# 1.9.5 - the fifteen steps: the reading "הרא״ש — כציורו" (half discs, the smallest on top) is replaced by the unified reading "הרא״ש והרי״ד":
# from wall to wall, 135 amot, each step below shorter at both its ends (the user, 11.11.2026: "10. לאחד זוהי בעצם שיטה אחת").
# And Nikanor's leaves stand in the gate's thickness. Patches /home/claude/b2src/src/30-courts.js. Idempotent.
import io, sys
P = '/home/claude/b2src/src/30-courts.js'
s = io.open(P, encoding='utf-8').read()
if 'steps15 unified' in s:
    print('b2_steps_unified: already applied'); sys.exit(0)
i0 = s.index('    // 1.9.3 (the user, 10.11.2026 22:47, of the Rosh\'s second drawing: "תעשה גם את המעלות לשיטתו"): THE FIFTEEN STEPS AS THE ROSH DREW')
i1 = s.index('    ctx2.shared.steps15 = {')
old = s[i0:i1]
assert 'steps15R.add(st);' in old and 'כציור הרא״ש' in old
new = r'''    // 1.9.3 (the user, 10.11.2026 22:47, of the Rosh's second drawing: "תעשה גם את המעלות לשיטתו"): the fifteen steps as the Rosh drew
    // them - "אלא מוקפות כחצי גורן עגולה. כזו" (6035, line 32) - were fifteen half discs, the smallest on top by the gate.
    // 1.9.5 - steps15 unified (a remark sent on to the user, 11.11.2026: "הרא"ש לא צייר לאיזה צד ולכאו' סבר כהרי"ד שהי' מכותל לכותל -
    // קל"ה אמות ובכיון של המאיר[י]. ההצעה מאוד קשה..."; the Rid's words found in the user's library - Piskei HaRid, Sukkah 53a, in
    // "קובץ שיטות קמאי על מדות" (7576, line 355): "וכל מעלה היתה גבוהה חצי אמה ורחבה חצי אמה... ואורך המעלה היה קל"ה אמה כרוחב
    // העזרה מכותל לכותל"; the user: "10. לאחד זוהי בעצם שיטה אחת"): ONE READING, "הרא״ש והרי״ד" - the top step runs the whole width of
    // the court, 135 amot, from wall to wall, and each step below it is shorter than it at both its ends (the Meiri's direction: "התחתונה
    // קצרה והשניה עודפת לה משני קצותיה"), the steps' ends on an arc - "כחצי גורן". Straight steps, half an amah high and deep; the
    // lowest 35 long (the arc through the two walls and the lowest step's middle) - a model choice. The half discs of 1.9.3 are gone.
    {
      const XW = 96, RR = (67.5 * 67.5 + 7.5 * 7.5) / 15;   // the arc: its chord the court's width (135), its depth the steps' run (7.5)
      for (let k = 1; k <= 15; k++) {
        const d = 0.5 * (15 - k), half = Math.sqrt(Math.max(0, RR * RR - (RR - 7.5 + d) * (RR - 7.5 + d))), dep = 0.5 * (16 - k);
        const st = H2.box(steps15R, dep, 0.5 * k, 2 * half, M2.stoneSmooth, XW + dep / 2, 6, 0);   // solid down to the court's floor, so that no step hangs over the one below it
        st.castShadow = st.receiveShadow = true;
      }
    }
    ctx2.labels.push({ text: "חמש עשרה המעלות — מכותל לכותל, קל״ה אמה (הרא״ש והרי״ד)", x: 104, y: 16.5, z: 0, size: 1.6, layer: "steps15Rosh" });
'''
s = s[:i0] + new + s[i1:]
# Nikanor's leaves: in the gate's thickness, as the heichal's outer doors "לכסות עביו של כתל" - they stood open into the court of Israel
a = '    H2.doors(g, { axis: "z", cx: 93.5, cz: 0, y: 13.5, width: 10, height: 20, inward: -1, mat: M2.nikanorBronze, open: 1.0, inset: 2 });'
if s.count(a) != 1: raise SystemExit('b2_steps_unified: Nikanor doors anchor')
b = '''    // 1.9.5 (a remark sent on to the user, 11.11.2026: "לפי הדגם דלתות שער ניקנור סותמות את העזרה"): the two leaves stood open into the
    // court of Israel - four of its eleven amot. Now they stand open in the gate's own thickness, each leaf (five amot) against a side
    // of the passage (five amot deep) - as the heichal's outer doors, "נפתחות לתוך הפתח לכסות עביו של כתל" (Middot 4:1). For Nikanor's
    // gate no source tells the way its doors opened: a model choice.
    H2.doors(g, { axis: "z", cx: 93.5, cz: 0, y: 13.5, width: 10, height: 20, inward: -1, mat: M2.nikanorBronze, open: Math.PI / 2, inset: -2.45 });'''
s = s.replace(a, b)
io.open(P, 'w', encoding='utf-8').write(s)
print('b2_steps_unified: applied')
