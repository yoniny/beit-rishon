# -*- coding: utf-8 -*-
# 1.9.5 - the two holes of the yesod ("והן הנקראין שיתין", Rambam Beit HaBechirah 2:11) made visible and named.
# A remark sent on to the user (11.11.2026): "ברמב"ם משמע שהם היו על היסוד ממש... הנקבים היו על היסוד"; the user: "מקבל את הצעתך".
# Patches /home/claude/b2src/src/40-altar.js. Idempotent.
import io, sys
P = '/home/claude/b2src/src/40-altar.js'
s = io.open(P, encoding='utf-8').read()
if 'SHITIN_LABEL' in s:
    print('b2_shitin: already applied'); sys.exit(0)
def rep(a, b):
    global s
    if s.count(a) != 1: raise SystemExit('b2_shitin: %d occurrences of: %s' % (s.count(a), a[:80]))
    s = s.replace(a, b)
rep("""      H2.box(grp, 0.2, 0.03, 0.2, holeMat, x0 + 0.35, F + 1.005, z1 - 0.45);
      H2.box(grp, 0.2, 0.03, 0.2, holeMat, x0 + 0.85, F + 1.005, z1 - 0.45);
""", """      // 1.9.5 (a remark sent on to the user, 11.11.2026: "ברמב"ם משמע שהם היו על היסוד ממש"; the user: "מקבל את הצעתך"): they stood on
      // the yesod's corner since 1.0, but a fifth of an amah across and unnamed - nobody saw them. Now each a dark round mouth in a pale
      // rim, a third of an amah across (still "דקין"), side by side on the corner's top, and a label over them (SHITIN_LABEL, below).
      for (const hx of [x0 + 0.27, x0 + 0.74]) {
        H2.cyl(grp, 0.23, 0.23, 0.03, M2.stoneLight, hx, F + 1.0, z1 - 0.45, 20);
        H2.cyl(grp, 0.16, 0.16, 0.04, holeMat, hx, F + 1.0, z1 - 0.45, 20);
      }
""")
rep("""    ctx2.labels.push({ text: "טבלא של שיש וטבעת — יורדין לשית", x: 39, y: F + 1.5, z: 13.3, size: 0.9, layer: "altarBody32" }, { text: "טבלא של שיש וטבעת — יורדין לשית", x: 43, y: F + 1.5, z: 9.3, size: 0.9, layer: "altarBody28" });   // 1.9.3
""", """    ctx2.labels.push({ text: "טבלא של שיש וטבעת — יורדין לשית", x: 39, y: F + 1.5, z: 13.3, size: 0.9, layer: "altarBody32" }, { text: "טבלא של שיש וטבעת — יורדין לשית", x: 43, y: F + 1.5, z: 9.3, size: 0.9, layer: "altarBody28" });   // 1.9.3
    const SHITIN_LABEL = "שני הנקבים שבקרן היסוד — ״והן הנקראין שיתין״";   // 1.9.5 (Rambam Beit HaBechirah 2:11; Middot 3:2)
    ctx2.labels.push({ text: SHITIN_LABEL, x: 40, y: F + 2.5, z: 12.05, size: 0.9, layer: "altarBody32", moveWithAltar: true }, { text: SHITIN_LABEL, x: 44, y: F + 2.5, z: 8.05, size: 0.9, layer: "altarBody28", moveWithAltar: true });
""")
io.open(P, 'w', encoding='utf-8').write(s)
print('b2_shitin: applied')
