# -*- coding: utf-8 -*-
# B2 1.9.5 - THE MENORAH'S DIRECTION: north-south (the Rambam; the default, as it stood) / east-west (Rabbi) - the user, 11.11.2026, 22:15:
# "שתוסיף את שיטת רבי בקוד עצמו… במבנה הפשוט של התוסף". Idempotent (marker MENORAH_DIR_195). Edits b2src/src/45-vessels.js;
# backup /tmp/45-vessels.b2.before_menorahdir.js. The row and its cards: tools204/edits/rows200_part15.py.
import io, os, shutil
F = '/home/claude/b2src/src/45-vessels.js'
s = io.open(F, encoding='utf-8').read()
if 'MENORAH_DIR_195' in s:
    print('already applied'); raise SystemExit(0)
if not os.path.exists('/tmp/45-vessels.b2.before_menorahdir.js'):
    shutil.copy(F, '/tmp/45-vessels.b2.before_menorahdir.js')
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:90])
    s = s.replace(old, new)
rep("    int_inst(g, menorahGeo.steps, MM.marble, [int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0)]);\n",
    "    const menStone = int_inst(g, menorahGeo.steps, MM.marble, [int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0)]);\n")
rep("    const c0 = Math.cos(MEN.rot), s0 = Math.sin(MEN.rot);\n"
    "    const flamePos = lampX.map((dx) => [MEN.x + dx * c0, FL + 3.14, MEN.z - dx * s0]);\n",
    "    const flameAt = (rot) => lampX.map((dx) => [MEN.x + dx * Math.cos(rot), FL + 3.14, MEN.z - dx * Math.sin(rot)]);\n"
    "    let flamePos = flameAt(MEN.rot);   // MENORAH_DIR_195: follows the menorah's direction (ctx2.shared.menorahDir)\n")
rep("    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};\n    Object.assign(ctx2.shared.flyPoints, {\n      menorah: {",
    "    // ---- MENORAH_DIR_195 - 1.9.5 (the user, 11.11.2026, 22:15: \"שתוסיף את שיטת רבי בקוד עצמו… במבנה הפשוט של התוסף\"): THE MENORAH'S\n"
    "    // DIRECTION, a row of the opinions table. Menachot 98b (the user's library, book 131, lines 3512-3518): \"מזרח ומערב היו מונחין,\n"
    "    // דברי רבי. רבי אלעזר ברבי שמעון אומר: צפון ודרום. מאי טעמא דרבי? גמר ממנורה – מה מנורה מזרח ומערב…\"; \"מנורה גופה צפון\n"
    "    // ודרום הוה מנחה\". \"ns\" (THE DEFAULT, as it stood): the Rambam, Beit HaBechirah 3:12 - \"וכן נרות המנורה כנגד רחב הבית בין\n"
    "    // הצפון ובין הדרום\". \"ew\": Rabbi - Rashi there: \"השלשה קנים במזרח והשלשה במערב\"; the Ra'avad on 3:12, Tosafot Menachot 98b and\n"
    "    // the Bartenura (Tamid 3:9) read the Mishnah of Tamid so (\"שתי נרות מזרחיות\"). The whole menorah turns a quarter about its shaft,\n"
    "    // its stone with it: in \"ew\" the stone stands north of it, toward the inside of the heichal (a model choice - the sources give\n"
    "    // \"לפני המנורה\" only). The lamps are plain cups with no mouth drawn, so nothing else turns. The table does not move: its length\n"
    "    // lies along the house in both (the Rambam rules so for it, as Rabbi).\n"
    "    const menLay = { ns: new Group(), ew: new Group() };   // two empty groups: the layers of the stone's two labels\n"
    "    menLay.ew.visible = false;\n"
    "    g.add(menLay.ns, menLay.ew);\n"
    "    ctx2.layers = ctx2.layers || {};\n"
    "    ctx2.layers.menNS = menLay.ns;\n"
    "    ctx2.layers.menEW = menLay.ew;\n"
    "    ctx2.shared.menorahDir = {\n"
    "      current: \"ns\",\n"
    "      keys: [\"ns\", \"ew\"],\n"
    "      set(k) {\n"
    "        k = k === \"ew\" ? \"ew\" : \"ns\";\n"
    "        this.current = k;\n"
    "        MEN.rot = k === \"ew\" ? 0 : Math.PI / 2;\n"
    "        const m = int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0);\n"
    "        for (const im of [menBody, menStone]) {\n"
    "          im.setMatrixAt(0, m);\n"
    "          im.instanceMatrix.needsUpdate = true;\n"
    "          if (typeof im.computeBoundingSphere === \"function\") im.computeBoundingSphere();\n"
    "          if (typeof im.computeBoundingBox === \"function\") im.computeBoundingBox();\n"
    "        }\n"
    "        flamePos = flameAt(MEN.rot);\n"
    "        flamePos.forEach((p, i) => flames.setMatrixAt(i, int_m4(p[0], p[1], p[2], 0, MEN.rot, 0)));\n"
    "        flames.instanceMatrix.needsUpdate = true;\n"
    "        if (typeof flames.computeBoundingSphere === \"function\") flames.computeBoundingSphere();\n"
    "        menLay.ns.visible = k === \"ns\";\n"
    "        menLay.ew.visible = k === \"ew\";\n"
    "        const fp = ctx2.shared.flyPoints && ctx2.shared.flyPoints.menorah;   // the menorah's view: broadside to the row of the lamps\n"
    "        if (fp) fp.pos = k === \"ew\" ? [MEN.x + 1.2, FL + 3.2, MEN.z - 4.4] : [MEN.x + 4.2, FL + 3.2, MEN.z + 1.2];\n"
    "        return true;\n"
    "      },\n"
    "      get() { return this.current; }\n"
    "    };\n"
    "    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};\n    Object.assign(ctx2.shared.flyPoints, {\n      menorah: {")
rep("      { text: \"אבן שלפני המנורה — שלוש מעלות\", x: MEN.x - 1.9, y: FL + 1.6, z: MEN.z, size: 0.9 },\n",
    "      { text: \"אבן שלפני המנורה — שלוש מעלות\", x: MEN.x - 1.9, y: FL + 1.6, z: MEN.z, size: 0.9, layer: \"menNS\" },\n"
    "      { text: \"אבן שלפני המנורה — שלוש מעלות\", x: MEN.x, y: FL + 1.6, z: MEN.z - 1.9, size: 0.9, layer: \"menEW\" },   // MENORAH_DIR_195\n")
io.open(F, 'w', encoding='utf-8').write(s)
print('applied')
