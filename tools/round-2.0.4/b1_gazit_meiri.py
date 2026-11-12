# -*- coding: utf-8 -*-
# B1 1.3.7 - לשכת הגזית as in the Second Temple's hall since its 1.9.5 (the user, 11.11.2026, 21:15: "ב" - the Meiri; and of old: "את
# השינויים בלשכת הגזית תעתיק גם לבית ראשון"): the two halves EAST (holy) and WEST (unconsecrated); the 71 in the WEST half on half an
# oval that opens to the EAST; the students' rows and the scribes with them; one floor and a bronze strip north-south between the halves.
# AND THE RING OF THE LOTS IS GONE (the user, 21:39: "ברור שהיה רק בבית שני"). Idempotent (marker GAZIT_MEIRI_137).
# Edits /home/claude/beit-rishon/src/30-courts.js and 70-ui.js; backups /tmp/30-courts.b1.before_gazitmeiri.js, /tmp/70-ui.b1.before_gazitmeiri.js.
import io, os, shutil
C = '/home/claude/beit-rishon/src/30-courts.js'
U = '/home/claude/beit-rishon/src/70-ui.js'
s = io.open(C, encoding='utf-8').read()
u = io.open(U, encoding='utf-8').read()
if 'GAZIT_MEIRI_137' in s:
    print('already applied'); raise SystemExit(0)
for f, b in ((C, '/tmp/30-courts.b1.before_gazitmeiri.js'), (U, '/tmp/70-ui.b1.before_gazitmeiri.js')):
    if not os.path.exists(b):
        shutil.copy(f, b)
def rep(old, new, n=1):
    global s
    assert s.count(old) == n, (s.count(old), old[:100])
    s = s.replace(old, new)
def repu(old, new, n=1):
    global u
    assert u.count(old) == n, (u.count(old), old[:100])
    u = u.replace(old, new)

# ---- the seats' oval: its centre, and what a and b mean now
rep("  var CRT_GAZIT_SEATS = { x: 59.9, z: -67.6, a: 9.2, b: 9.4, n: 71 };\n",
    "  // GAZIT_MEIRI_137 - 1.3.7 (the user, 11.11.2026, 21:15, for the Second Temple's hall: \"ב\" - the Meiri; the standing word of 10.11:\n"
    "  // \"את השינויים בלשכת הגזית תעתיק גם לבית ראשון\"): THE TWO HALVES ARE EAST AND WEST. Yoma 25a \"פייס במזרחה, וזקן יושב במערבה\"; the Meiri\n"
    "  // there (the user's library, book 2199, line 228): \"מתקבצים בחציה של קדש שהיה בצד מזרחה של לשכה… וזקן מזקני הסנהדרין יושב בחציה של\n"
    "  // חול לצד מערבה של לשכה\". So the 71 sit in the WEST half, on half an oval that opens to the EAST (toward the holy half - a model\n"
    "  // choice: the Meiri does not say which way they face): centre (x, z), a = the half length from north to south, b = the depth to the\n"
    "  // west. A way 2.3 wide is left between the row's north end and the north wall, from the unconsecrated door. Until 1.3.6 the oval lay\n"
    "  // along the wall and opened to the south - the Tiferet Yisrael's reading (\"בנויה חציה בדרום בקודש וחציה בצפון בחול… פניהם לדרום\n"
    "  // ואחוריהן לצפון\", book 6029, line 65), now told in the card's \"בקצרה\".\n"
    "  var CRT_GAZIT_SEATS = { x: 59.6, z: -68.3, a: 7.9, b: 9.4, n: 71 };\n")
rep("  var CRT_GAZIT_LOTS = { x: 66.3, z: -62.25, r: 1.8 };   // 1.0.1-L (A9): was x 64.5\n",
    "  // 1.3.7: THE RING OF THE LOTS IS NO LONGER DRAWN (CRT_GAZIT_LOTS, x 66.3, z -62.25, r 1.8, since 1.0.1) - the user, 11.11.2026, 21:39,\n"
    "  // after the search of his library found no source for the daily lots in the First Temple: \"ברור שהיה רק בבית שני\".\n")
# ---- the floor: one floor, and the line between the halves north-south
rep("      const lineMat = M2.stoneSmooth.clone();\n"
    "      lineMat.color.setHex(0xa8a296);\n"
    "      H2.box(g, gx1 - gx0 - 2 * gt, 0.04, T, lineMat, gcx, AZ, gcz).name = \"gazitWallLine\";\n",
    "      // GAZIT_MEIRI_137: until 1.3.6 a darker band lay here along the court wall's line (z -70..-65), the halves being north and south.\n"
    "      // Now ONE FLOOR in the whole hall, and A BRONZE STRIP FROM NORTH TO SOUTH in its middle (x 59.9): the line between the holy half\n"
    "      // (east) and the unconsecrated half (west), as in the Second Temple's hall. The strip and the floor's stone - model choices.\n"
    "      H2.box(g, gx1 - gx0 - 2 * gt, 0.03, gz1 - gz0 - 2 * gt, M2.stoneSmooth, gcx, AZ, (gz0 + gz1) / 2).name = \"gazitFloor\";\n"
    "      H2.box(g, 0.24, 0.04, gz1 - gz0 - 2 * gt, M2.bronze, gcx, AZ + 0.03, (gz0 + gz1) / 2).name = \"gazitHalvesLine\";\n")
# ---- the pill's words; the ring
rep("אל תוך הלשכה: הסנהדרין בחצי עיגול ומקום הפיס.\",", "אל תוך הלשכה: הסנהדרין כחצי גורן, שני הסופרים ושלוש שורות התלמידים.\",")
rep("      // \"פייס במזרחה\": the ring of the lots in the court half toward the east (CRT_GAZIT_LOTS; a darker stone ring, half sunk in the floor)\n"
    "      const LT = CRT_GAZIT_LOTS;\n"
    "      H2.ring(g, LT.r, 0.12, new MeshStandardMaterial({ color: 0x7a6650, roughness: 0.55, metalness: 0 }), LT.x, AZ, LT.z).name = \"gazitLots\";\n",
    "      // 1.3.7: no ring of the lots (see CRT_GAZIT_SEATS above)\n")
rep("        lots: { x: LT.x, z: LT.z, r: LT.r },\n", "")
rep("        boundaryZ: [CO2.azN - T / 2, CO2.azN + T / 2],\n", "        boundaryX: [gcx - 0.12, gcx + 0.12],   // 1.3.7: the strip between the east and the west halves (until 1.3.6 boundaryZ, the wall's line)\n")
# ---- the seats along the oval that opens east
rep("        // n points evenly spaced by length along the half oval, t 0 (the east end) .. PI (the west end)\n"
    "        const N = 720, acc = [0], n = CRT_GAZIT_SEATS.n;\n"
    "        let px = SA, pz = 0;\n"
    "        for (let i = 1; i <= N; i++) { const t = Math.PI * i / N, x = SA * Math.cos(t), z = SB * Math.sin(t); acc.push(acc[i - 1] + Math.hypot(x - px, z - pz)); px = x; pz = z; }\n",
    "        // GAZIT_MEIRI_137: n points evenly spaced by length along the half oval that opens to the east, t 0 (its north end) .. PI (its south end)\n"
    "        const N = 720, acc = [0], n = CRT_GAZIT_SEATS.n;\n"
    "        let px = 0, pz = SA;\n"
    "        for (let i = 1; i <= N; i++) { const t = Math.PI * i / N, x = SB * Math.sin(t), z = SA * Math.cos(t); acc.push(acc[i - 1] + Math.hypot(x - px, z - pz)); px = x; pz = z; }\n")
rep("          const nx = -Math.cos(t) / SA, nz = Math.sin(t) / SB;           // the oval's inward normal (x, z) at t\n"
    "          const m = new Matrix4().makeRotationY(Math.atan2(-nz, nx));     // the seat's front (+x) along it\n"
    "          m.setPosition(SX + SA * Math.cos(t), AZ, SZ - SB * Math.sin(t));\n",
    "          const nx = Math.sin(t) / SB, nz = Math.cos(t) / SA;             // the oval's inward normal (x, z) at t\n"
    "          const m = new Matrix4().makeRotationY(Math.atan2(-nz, nx));     // the seat's front (+x) along it\n"
    "          m.setPosition(SX - SB * Math.sin(t), AZ, SZ - SA * Math.cos(t));\n")
# ---- the figures' oval, the straight rows, the scribes
rep("        // n points evenly spaced by length on the half oval (a, b) round (SX, SZ), from t0 to t1 (0 = the east end, PI = the west end)\n",
    "        // n points evenly spaced by length on the half oval (a north-south, b to the west) round (SX, SZ), from t0 to t1 (0 = the north end, PI = the south end)\n")
rep("          let px = a * Math.cos(t0), pz = b * Math.sin(t0);\n"
    "          for (let i = 1; i <= N; i++) { const t = t0 + (t1 - t0) * i / N, x = a * Math.cos(t), z = b * Math.sin(t); acc.push(acc[i - 1] + Math.hypot(x - px, z - pz)); px = x; pz = z; }\n",
    "          let px = b * Math.sin(t0), pz = a * Math.cos(t0);\n"
    "          for (let i = 1; i <= N; i++) { const t = t0 + (t1 - t0) * i / N, x = b * Math.sin(t), z = a * Math.cos(t); acc.push(acc[i - 1] + Math.hypot(x - px, z - pz)); px = x; pz = z; }\n")
rep("            out.push([SX + a * Math.cos(t), SZ - b * Math.sin(t)]);\n", "            out.push([SX - b * Math.sin(t), SZ - a * Math.cos(t)]);\n")
rep("        for (const dz of [1.7, 3.0, 4.3]) figures(stStraight, Array.from({ length: 23 }, (_, i) => [SX - 7.48 + i * 0.68, SZ - dz]), AZ, 0.6, 0.62, cloth2, -1);\n",
    "        for (const dx of [1.7, 3.0, 4.3]) figures(stStraight, Array.from({ length: 23 }, (_, i) => [SX - dx, SZ - 6.6 + i * 0.6]), AZ, 0.6, 0.62, cloth2, -1);   // GAZIT_MEIRI_137: north-south\n")
rep("          b.position.set(SX + sx, AZ + 0.95, SZ - 0.6);\n", "          b.position.set(SX - 0.6, AZ + 0.95, SZ + sx);\n")
rep("          hd.position.set(SX + sx, AZ + 2.05, SZ - 0.6);\n", "          hd.position.set(SX - 0.6, AZ + 2.05, SZ + sx);\n")
# ---- the names inside
rep("          { text: \"הסנהדרין הגדולה — שבעים ואחד בשורה אחת, כחצי גורן\", x: SX, y: AZ + 5.2, z: SZ - SB + 1.2, size: 1.8, layer: \"gazitInside\" },\n"
    "          { text: \"הנשיא\", x: SX, y: AZ + 2.6, z: SZ - SB - 0.2, size: 1.1, layer: \"gazitInside\" },\n"
    "          { text: \"סופרי הדיינין\", x: SX, y: AZ + 3.3, z: SZ - 0.6, size: 1, layer: \"gazitInside\" },\n"
    "          { text: \"שלוש שורות של תלמידי חכמים\", x: SX, y: AZ + 2.2, z: SZ - 3.6, size: 1, layer: \"gazitInside\" }\n",
    "          { text: \"הסנהדרין הגדולה — שבעים ואחד בשורה אחת, כחצי גורן\", x: SX - SB + 1.6, y: AZ + 5.6, z: SZ, size: 1.8, layer: \"gazitInside\" },\n"
    "          { text: \"הנשיא\", x: SX - SB - 0.2, y: AZ + 2.6, z: SZ, size: 1.1, layer: \"gazitInside\" },\n"
    "          { text: \"סופרי הדיינין\", x: SX - 0.6, y: AZ + 3.3, z: SZ, size: 1, layer: \"gazitInside\" },\n"
    "          { text: \"שלוש שורות של תלמידי חכמים\", x: SX - 3.6, y: AZ + 2.2, z: SZ, size: 1, layer: \"gazitInside\" },\n"
    "          { text: \"חצי החול — במערב\", x: gx0 + gt + 4.6, y: AZ + 7.6, z: gz1 - gt - 2.2, size: 1.2, layer: \"gazitInside\" },   // GAZIT_MEIRI_137\n"
    "          { text: \"חצי הקודש — במזרח\", x: gx1 - gt - 4.6, y: AZ + 4.2, z: (gz0 + gz1) / 2, size: 1.2, layer: \"gazitInside\" }\n")
io.open(C, 'w', encoding='utf-8').write(s)

# ---- the cards
MEIRI = ("חלוקתה במודל (מגרסה 1.3.7) — מזרח ומערב, כלשון הגמרא וכמאירי (יומא כה.): הכהנים 'מתקבצים בחציה של קדש שהיה בצד מזרחה של לשכה', "
         "'וזקן מזקני הסנהדרין יושב בחציה של חול לצד מערבה של לשכה'. פס נחושת ברצפה, מצפון לדרום, מסמן את הגבול. "
         "בקצרה — **תפארת ישראל** (צורת בית המקדש): 'בנויה חציה בדרום בקודש וחציה בצפון בחול', והסנהדרין 'פניהם לדרום ואחוריהן לצפון'.")
repu("— לכן **היא עומדת לאורך חומת החצר הפנימית הצפונית, חציה בחצר וחציה בחוץ** (תפארת ישראל: 'בנויה חציה בדרום בקודש וחציה בצפון בחול'), וקו החומה מסומן ברצפתה.",
     "— לכן **היא עומדת על קו חומת החצר הפנימית הצפונית, חלקה בחצר וחלקה בחוץ**.\\n" + MEIRI)
repu("בפנים: הפייס בחצי הפנימי במזרח — טבעת ברצפה (רש״י: 'קבוצת היקף המפייסין במזרחה היתה'); והסנהדרין בחצי החיצון במערב: 'סנהדרי גדולה היתה של שבעים ואחד' (סנהדרין א, ו), 'כחצי גרן עגלה, כדי שיהו רואין זה את זה' (ד, ג) — **שבעים ואחד מושבים בשורה אחת, כחצי גורן**, פניהם לדרום (תפארת ישראל: 'פניהם לדרום ואחוריהן לצפון').",
     "בפנים: הסנהדרין בחצי המערבי, חצי החול: 'סנהדרי גדולה היתה של שבעים ואחד' (סנהדרין א, ו), 'כחצי גרן עגלה, כדי שיהו רואין זה את זה' (ד, ג) — **שבעים ואחד מושבים בשורה אחת, כחצי גורן**, פניהם למזרח, אל חצי הקודש; כיוון פניהם לשיטת המאירי — בחירת מודל. מקום הפייס ('פייס במזרחה') אינו מצויר בבית ראשון: הפייס — תקנה ('התקינו שלא יהו תורמין את המזבח אלא בפיס', יומא ב, ב), ולא נמצא מקור שנהג בבית ראשון.")
repu("ושבעים ואחד מושבים בשורה אחת, כחצי גורן, בצד החול; טבעת הפייס בחצי שבקודש.",
     "ושבעים ואחד מושבים בשורה אחת, כחצי גורן, בחצי החול שבמערב (כמאירי); מקום הפייס אינו מצויר בבית ראשון.")
# the refs of the place's card: the Meiri and the Mishnah of Yoma
A = '["מהרש״א בבא בתרא צא:", { book: 2845, index: 313 }]] },\n          // 1.0.1-L (L.68, the user: "מול השולחנות והטבעות שבבית שני'
assert u.count(A) == 1, u.count(A)
u = u.replace(A, '["מהרש״א בבא בתרא צא:", { book: 2845, index: 313 }], ["המאירי יומא כה.", { book: 2199, index: 228 }], ["משנה יומא ב, ב", MN(55, 2, 2)]] },\n          // 1.0.1-L (L.68, the user: "מול השולחנות והטבעות שבבית שני')
io.open(U, 'w', encoding='utf-8').write(u)
print('applied')
