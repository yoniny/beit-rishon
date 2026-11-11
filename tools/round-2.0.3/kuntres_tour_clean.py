#!/usr/bin/env python3
# 1.3.6 / 1.9.4 (the user, 11.11.2026: "למה הוא מציג במצגת בהתחלה את החתך פתוח לא קשור למקום"; "החתך נשאר פתוח לאורך כל המצגת"):
# the presentation starts from the model's regular state - every viewing tool the viewer left on goes off when it starts and comes back
# when it ends. Applied to the First Temple's 75-tour.js and to the snapshot the Second Temple's port reads (b1/src/75-tour.js). Idempotent.
import sys
FILES = ['/home/claude/beit-rishon/src/75-tour.js', '/home/claude/b1/src/75-tour.js']
A1 = '      const mbList = () => (Array.isArray(ctx.shared.modelButtons) ? ctx.shared.modelButtons : []);\n'
B1 = A1 + '''      // 1.3.6 / 1.9.4 (the user, 11.11.2026: "למה הוא מציג במצגת בהתחלה את החתך פתוח לא קשור למקום"; "החתך נשאר פתוח לאורך כל המצגת"): the
      // presentation starts from the model's regular state. Every viewing tool the viewer left on - the on-model buttons (the house or
      // the galleries opened, a section of the galleries, roofs, a demonstration), the live section and the walk - goes off when it
      // starts, and what is not a demonstration comes back when it ends (restore), as the rows and the layers do. Not touched: the
      // cloud (the devir's slides ask about it themselves) and a button that only mutes (keepDemos).
      const toolsOff = () => {
        const back = [];
        for (const b of mbList().slice()) {
          try {
            if (!b || !fnc(b.get) || !fnc(b.set) || b.keepDemos || b.id === "ui-cloud" || !b.get()) continue;
            b.set(false);
            if (!b.get() && !/^עצור/.test(String(b.labelOn || "")) && !/demo/i.test(String(b.id || ""))) back.push(() => { if (!b.get()) b.set(true); });
          } catch (_) {
          }
        }
        try {
          const S = ctx.shared.section;
          if (S && S.on && fnc(S.set)) {
            const ax = S.axis, v = S.v;
            S.set(false, ax, v);
            back.push(() => { if (!S.on) S.set(true, ax, v); });
          }
          const w = ctx.shared.walkMode;
          if (w && w.on && fnc(w.set)) w.set(false);
          if (fnc(ctx.shared.navRepaint)) ctx.shared.navRepaint();
        } catch (_) {
        }
        return back;
      };
'''
A2 = '''        saved = snapshot();
        cloudDenied = false;
'''
B2 = '''        if (fnc(ctx.shared.closeAuto)) call(ctx.shared.closeAuto);   // (1.9.4: what a place or a row opened for a while, the Second Temple's timers)
        const tools = toolsOff();   // 1.3.6 / 1.9.4: before the snapshot, so that the features among them are "off" in it
        saved = snapshot();
        saved.tools = tools;
        cloudDenied = false;
'''
A3 = '''        // the parts' labels go with the base taken apart: as before the tour while it is apart
'''
B3 = '''        // 1.3.6 / 1.9.4: the viewing tools that were on before the presentation come back (toolsOff)
        for (const f of sv.tools || []) {
          try {
            f();
          } catch (_) {
          }
        }
''' + A3
for p in FILES:
    s = open(p, encoding='utf-8').read()
    if 'const toolsOff = () => {' in s:
        print('already applied:', p); continue
    for a, b in ((A1, B1), (A2, B2), (A3, B3)):
        assert s.count(a) == 1, (p, a[:60], s.count(a))
        s = s.replace(a, b)
    open(p, 'w', encoding='utf-8').write(s)
    print('patched:', p)
