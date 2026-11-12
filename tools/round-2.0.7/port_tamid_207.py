#!/usr/bin/env python3
# 12.11.2026 19:28, the user: "הנה הזיפ תתחיל לעבוד / שים לב להתאים את הדמויות לאלו שעשית בשרשור הזה" (and 12:11: "תראה אם אפשר להעתיק את
# הההדגמה של עבודת הבוקר ולשלב אותה בתוך המצגת (תתאים שם את בגדי הכהונה והמקומות)").
# THE PORT of the demonstration "סדר עבודת הבוקר" (built in the other chat on B2 1.9.4) onto B2 1.9.7. Its sources: /home/claude/tamid-in
# (the user's zip). Its changes against 1.9.4 (/home/claude/b2-194, from the 2.0.3 delivery): two new source files (55-tamid.js,
# 56-tamid-data.js), four tools (tamid_200.py makes 56-tamid-data.js from the library; their rows_200.py - here tamid_rows_200.py, our
# rows_200.py is another file - two rows and a place; ui_200.py and tour_200.py patch the generated 70-ui.js and 75-tour.js), and small
# edits of 40-altar.js, 45-vessels.js, 90-entry.js, assemble.mjs, chain.sh and rows_198.py - made here again, by anchors, on our files.
# Idempotent (every edit is marked TAMID_PORT_207).
import os, shutil, re
T = '/home/claude/tamid-in/בית שני - הדגמת סדר העבודה/קוד המקור'
O = '/home/claude/b2src'
MARK = 'TAMID_PORT_207'
def cp(a, b):
    b = os.path.join(O, b)
    os.makedirs(os.path.dirname(b), exist_ok=True)
    if not os.path.exists(b):
        shutil.copyfile(os.path.join(T, a), b); print('copied', a, '->', b)
cp('src/55-tamid.js', 'src/55-tamid.js')
cp('tools/tamid_200.py', 'tools/tamid_200.py')
cp('tools/rows_200.py', 'tools/tamid_rows_200.py')
cp('tools/ui_200.py', 'tools/ui_200.py')
cp('tools/tour_200.py', 'tools/tour_200.py')
def edit(rel, pairs):
    p = os.path.join(O, rel); s = open(p, encoding='utf-8').read()
    if MARK in s: return
    for a, b in pairs:
        assert s.count(a) == 1, (rel, a[:80], s.count(a))
        s = s.replace(a, b)
    open(p, 'w', encoding='utf-8').write(s); print('edited', rel)
# 40-altar.js: the round heap, raised by the morning's ash
edit('src/40-altar.js', [(
    "          ctx2.shared.maarachot.set(ctx2.shared.maarachot.count, ctx2.shared.maarachot.yk);\n        }\n      };\n",
    "          ctx2.shared.maarachot.set(ctx2.shared.maarachot.count, ctx2.shared.maarachot.yk);\n        }\n      };\n"
    "      ctx2.shared.tapuach.heap = m;   // %s (55-tamid.js): the round heap, raised by the morning's ash\n" % MARK)])
# 45-vessels.js: the demonstration's menorah (lampK, setRot, the stone) and the golden altar's coals - its own hunks, on our names
p45 = os.path.join(O, 'src/45-vessels.js'); s45 = open(p45, encoding='utf-8').read()
if MARK not in s45:
    a = "      menorahLight.intensity = 15.5 + 2.2 * Math.sin(t * 0.011) + 1.3 * Math.sin(t * 0.029 + 1);\n"
    assert s45.count(a) == 1
    import subprocess
    r = subprocess.run(['patch', '-p1', '--no-backup-if-mismatch', '-r', '-', '-i', '/home/claude/tools207/patches/src_45-vessels.js.patch'], cwd=O, capture_output=True, text=True)
    print(r.stdout.strip().replace('\n', ' | '))
    s45 = open(p45, encoding='utf-8').read()
    assert 'ctx2.shared.menorah = {' in s45 and 'ctx2.shared.goldenAltar = ' in s45 and 'const lampK = ' in s45, 'the vessels hunks'
    # hunk 1 (failed: the steps are menStone here since 1.9.x): the demonstration's menSteps is our menStone
    s45 = s45.replace('menSteps.setMatrixAt(0,', 'menStone.setMatrixAt(0,').replace('for (const im of [menBody, menSteps, flames])', 'for (const im of [menBody, menStone, flames])')
    assert 'menSteps' not in s45
    s45 = s45.replace('    const MEN0 = { z: MEN.z, rot: MEN.rot };\n', '    const MEN0 = { z: MEN.z, rot: MEN.rot };   // %s: the hunks of the demonstration (its menSteps is our menStone)\n' % MARK, 1)
    assert MARK in s45
    open(p45, 'w', encoding='utf-8').write(s45); print('edited src/45-vessels.js')
# 90-entry.js: the hemisphere light kept; the sky and the floor for the demonstration; its module after the lotteries'; its loading line
edit('src/90-entry.js', [
    ("  scene.add(new HemisphereLight(12572400, 9074e3, 0.75));\n",
     "  var hemi = new HemisphereLight(12572400, 9074e3, 0.75);   // %s (55-tamid.js): kept, the night and the dawn of the morning's service dim it\n  scene.add(hemi);\n" % MARK),
    ('      { name: "payis.js", build: typeof buildPayis === "function" ? buildPayis : async () => {} },   // 1.9.5: the lotteries\' demonstration (55-payis.js); built hidden\n',
     '      { name: "payis.js", build: typeof buildPayis === "function" ? buildPayis : async () => {} },   // 1.9.5: the lotteries\' demonstration (55-payis.js); built hidden\n'
     '      { name: "tamid.js", build: typeof buildTamid === "function" ? buildTamid : async () => {} },   // 2.0.7: the morning\'s service (55-tamid.js; built on its first use)\n'),
    ('      "מכין את הדגמת הפייסות",\n', '      "מכין את הדגמת הפייסות",\n      "מכין את סדר העבודה",\n'),
])
p90 = os.path.join(O, 'src/90-entry.js'); s90 = open(p90, encoding='utf-8').read()
if 'ctx.shared.sky = { sky, sun, hemi' not in s90:
    T90 = open(os.path.join(T, 'src/90-entry.js'), encoding='utf-8').read()
    i = T90.index("  // 2.0 (55-tamid.js, the morning's service): the sky, the sun and the light of the hemisphere")
    blk = T90[i:T90.index('  ctx.shared.floorY = (x, y, z) => cam_floorY({ x, y, z });\n', i) + len('  ctx.shared.floorY = (x, y, z) => cam_floorY({ x, y, z });\n')]
    # after the object ctx.ui ... (its end: "    camera,\n    controls,\n    renderer\n  };\n"), as in the demonstration's file
    prev = '    camInside: { get: () => cam.inside, set: (on) => { cam.inside = !!on; } },   // "סיבוב בתוך הבית בלבד" (70-ui.js)\n    camera,\n    controls,\n    renderer\n  };\n'
    assert s90.count(prev) == 1, ('the end of the ui object', s90.count(prev))
    s90 = s90.replace(prev, prev + blk)
    open(p90, 'w', encoding='utf-8').write(s90); print('edited src/90-entry.js (sky)')
# assemble.mjs: the data first, then the demonstration, after the lotteries
edit('tools/assemble.mjs', [
    ("'55-payis.js', '70-ui.js'", "'55-payis.js', '56-tamid-data.js', '55-tamid.js', '70-ui.js'"),
    ("'55-payis.js': 'payis.js', ", "'55-payis.js': 'payis.js', '56-tamid-data.js': 'tamid-data.js', '55-tamid.js': 'tamid.js', "),
    ("import fs from 'node:fs';\n", "import fs from 'node:fs';   // %s: + the morning's service (56-tamid-data.js, 55-tamid.js)\n" % MARK)])
# chain.sh: the two rows and the place after our rows_200.py; the texts; the patches of the generated UI and tour
edit('tools/chain.sh', [
    ("rows_198 rows_199 rows_200 cards_196; do", "rows_198 rows_199 rows_200 tamid_rows_200 cards_196; do"),
    ("python3 -I tools/port_ui.py >/dev/null\n", "# %s: the morning's service - its words from the library (56-tamid-data.js), and its patches of the generated UI and tour\n"
     "python3 -I tools/tamid_200.py >/dev/null\npython3 -I tools/port_ui.py >/dev/null\npython3 -I tools/ui_200.py >/dev/null\n" % MARK),
    ("python3 -I tools/port_tour.py >/dev/null\n", "python3 -I tools/port_tour.py >/dev/null\npython3 -I tools/tour_200.py >/dev/null\n")])
# rows_198.py: the two rows in the walk's order
edit('tools/rows_198.py', [
    ("'המערכות ביום הכיפורים', ", "'המערכות ביום הכיפורים', 'סדר עבודת הבוקר', "),
    ("'חומר המנורה', ", "'חומר המנורה', 'המנורה והנרות בבוקר', "),
    ("WANT_ROWS = [", "# %s: + 'סדר עבודת הבוקר', 'המנורה והנרות בבוקר' (tamid_rows_200.py)\nWANT_ROWS = [" % MARK)])
print('port_tamid_207 ok')
