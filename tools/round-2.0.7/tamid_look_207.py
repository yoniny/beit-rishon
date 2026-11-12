#!/usr/bin/env python3
# 12.11.2026 ~20:00: two things that the pictures of the 34 stages showed (qa/tamid/st2), in the current model:
#  TAMID_NIGHT_207 - the demonstration's night kept the environment map on (it lights every stone), so the night stages looked like the
#    day under a dark background. The night of this thread's lotteries (55-payis.js NIGHT, the user: "צריך שיהיה מצב לילה כמובן") is
#    used instead: its phases night - alot - barkai - heir - morning, the environment off under the horizon; the demonstration's own
#    clock of the sky (skyAt: 0 the night ... 1.2 barkai ... 3 the day) chooses the phase. Without it: as before.
# Idempotent.
import os
O = '/home/claude/b2src'
def edit(rel, mark, pairs):
    p = os.path.join(O, rel); s = open(p, encoding='utf-8').read()
    if mark in s: print('already:', rel, mark); return
    for a, b in pairs:
        assert s.count(a) == 1, (rel, a[:90], s.count(a))
        s = s.replace(a, b)
    assert mark in s
    open(p, 'w', encoding='utf-8').write(s); print('edited', rel, mark)
edit('src/55-payis.js', 'TAMID_NIGHT_207', [
    ("        get on() { return !!saved; }\n      };\n    })();\n",
     "        get on() { return !!saved; }\n      };\n    })();\n    SH.nightKit = NIGHT;   // TAMID_NIGHT_207: the same night for the morning's service (55-tamid.js)\n")])
edit('src/55-tamid.js', 'TAMID_NIGHT_207', [
    ("    const applySky = (s) => {\n      const K = SH.sky;\n      if (!K || !saved) return;\n",
     """    const applySky = (s) => {
      const K = SH.sky;
      if (!K || !saved) return;
      // TAMID_NIGHT_207: the lotteries' night (55-payis.js NIGHT) - the phase by the demonstration's clock of the sky
      const NK = SH.nightKit;
      if (NK && saved.night) {
        const ph = s < 0.6 ? ["night", "alot", s / 0.6] : s < 1.2 ? ["alot", "barkai", (s - 0.6) / 0.6] : s < 2 ? ["barkai", "heir", (s - 1.2) / 0.8] : ["heir", "morning", Math.min(1, s - 2)];
        NK.set(ph[0], ph[1], ph[2]);
        K.sky.visible = true;
        ctx2.scene.background = saved.bg;
        return;
      }
"""),
    ("      saved = { bg: ctx2.scene.background, sunCol: K ? K.sun.color.clone() : null, labels: lg ? lg.visible : null };\n",
     "      saved = { bg: ctx2.scene.background, sunCol: K ? K.sun.color.clone() : null, labels: lg ? lg.visible : null };\n"
     "      { const NK = SH.nightKit; saved.night = !!(NK && NK.begin()); }   // TAMID_NIGHT_207\n"),
    ("    const leaveWorld = () => {\n      W.group.visible = false;\n      stopSounds();\n",
     "    const leaveWorld = () => {\n      W.group.visible = false;\n      stopSounds();\n"
     "      if (saved && saved.night && SH.nightKit) SH.nightKit.end();   // TAMID_NIGHT_207 (the lines below give the day back as well)\n"),
])
# (TAMID_ROOFS_207 was taken out: the demonstration opens the roofs itself - a.roofs() -> SH.openFor("crt-lishkot-roofs"))
print('tamid_look_207 ok')
