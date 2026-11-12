#!/usr/bin/env python3
# B2 1.9.5 - THE THREE NORTHERN CHAMBERS: ONE BUILDING, ONE LEVEL ROOF, IN THE COURT'S NORTH-EAST (the user, 11.11.2026: "אפשרות א";
# "את לשכת הגזית תעביר כדברי הבועז. ברור שתעשה כך"; his rule: "אנו לא עושים נגד ראשונים"). The sources were read in his library on
# 11.11.2026 (LIB_1111.md, "~21:00"). Idempotent (marker THREE_CHAMBERS_195). Run: python3 b2_three_chambers.py
import io, sys
P = '/home/claude/b2src/src/30-courts.js'
s = io.open(P, encoding='utf-8').read()
if 'THREE_CHAMBERS_195' in s:
    print('already applied'); sys.exit(0)
n = [0]
def rep(old, new, cnt=1):
    global s
    c = s.count(old)
    assert c == cnt, ('expected %d, found %d: %r' % (cnt, c, old[:90]))
    s = s.replace(old, new); n[0] += 1

# 1. the openings of the court's north wall: the hall's (x 69..89) and the wood chamber's door (x 64.5..66.5, with its steps)
rep('const opsN = ops(gN).concat([{ center: 60, width: 22, height: 16 }], extraN != null ? [small(extraN)] : []);',
    'const opsN = ops(gN).concat([{ center: 79, width: 20, height: 16 }, { center: 65.5, width: 2, height: 9.5 }], extraN != null ? [small(extraN)] : []);   // 1.9.5 THREE_CHAMBERS_195: the hall in the north-east (centre 60, 22 wide until 1.9.4) and the wood chamber\'s door to the Hel')

# 2. the old Golah chamber (x 13..27) and the unlabelled well outside the wall (32, -74) go; the chamber is rebuilt in the one building
i0 = s.index('    annex(20, -1, 14, 14.5, 13.5, "לשכת הגולה ובור הגולה", 0, F_GOLAH);')
i1 = s.index('    // ===== 1.0.21: Lishkat HaGazit (Middot 5:4)')
assert s[i0:i1].count('\n') == 8
s = s[:i0] + ('    // 1.9.5 (THREE_CHAMBERS_195): the Golah chamber stood here alone until 1.9.4 (annex at x 20, 14 x 14.5), with a second, unlabelled\n'
              '    // well outside the wall at (32, -74) - both gone: the chamber is part of the one building of the three chambers, below\n') + s[i1:]
n[0] += 1

# 3. the well and its wheel can be drawn smaller (the Golah chamber is 4 by 4 inside now)
rep('    const wheelAt = (wx, wy, wz, r) => {', '    const wheelAt = (wx, wy, wz, r, px = 1.45) => {   // 1.9.5: px - the posts\' distance from the middle')
rep('      const axle = H2.cyl(g, 0.09, 0.09, 3.2, M2.cedar, wx, wy - 1.6, wz); axle.rotation.z = HP;',
    '      const axL = 3.2 * px / 1.45, axle = H2.cyl(g, 0.09, 0.09, axL, M2.cedar, wx, wy - axL / 2, wz); axle.rotation.z = HP;')
rep('      for (const sx of [-1, 1]) H2.box(g, 0.35, wy - 13.8, 0.35, M2.cedar, wx + sx * 1.45, 13.8, wz);',
    '      for (const sx of [-1, 1]) H2.box(g, 0.35, wy - 13.8, 0.35, M2.cedar, wx + sx * px, 13.8, wz);')
rep('''    const F_GOLAH = (cx, cz, y) => {   // "בור קבוע והגלגל נתון עליו, ומשם מספיקים מים לכל העזרה" (Middot 5:4)
      H2.ring(g, 2.2, 0.55, M2.stoneSmooth, cx, y + 0.3, cz);
      H2.cyl(g, 1.75, 1.75, 0.9, darkMat, cx, y - 0.45, cz);
      H2.cyl(g, 1.7, 1.7, 0.1, water, cx, y - 0.05, cz);
      wheelAt(cx, y + 5.2, cz, 1.4);
      H2.cyl(g, 0.04, 0.04, 4.2, cedarDark, cx + 1.2, y + 1, cz);   // the rope, from the bucket to the wheel
      H2.cyl(g, 0.45, 0.38, 0.7, M2.bronze, cx + 1.2, y + 0.35, cz);   // the bucket
      lbl("בור הגולה והגלגל", cx, y + 8.6, cz, 1.3);
    };''',
'''    const F_GOLAH = (cx, cz, y, roof, k = 1) => {   // "בור קבוע והגלגל נתון עליו, ומשם מספיקים מים לכל העזרה" (Middot 5:4); 1.9.5: k - its size (1 until 1.9.4)
      const wh = k < 1 ? 4.2 : 5.2;   // the wheel's height over the floor
      H2.ring(g, 2.2 * k, 0.55 * k, M2.stoneSmooth, cx, y + 0.3 * k, cz);
      H2.cyl(g, 1.75 * k, 1.75 * k, 0.9, darkMat, cx, y - 0.45, cz);
      H2.cyl(g, 1.7 * k, 1.7 * k, 0.1, water, cx, y - 0.05, cz);
      wheelAt(cx, y + wh, cz, 1.4 * k, 1.45 * k);
      H2.cyl(g, 0.04, 0.04, wh - 1, cedarDark, cx + 1.2 * k, y + 1, cz);   // the rope, from the bucket to the wheel
      H2.cyl(g, 0.45 * Math.sqrt(k), 0.38 * Math.sqrt(k), 0.7, M2.bronze, cx + 1.2 * k, y + 0.35, cz);   // the bucket
      lbl("בור הגולה והגלגל", cx, y + wh + 3.4, cz, k < 1 ? 1.1 : 1.3);
    };''')

# 4. the hall
rep('      wb(49, 71, 13.5, FY, -78, -59.5, M2.pave); // floor (flush with the court of the priests)\n'
    '      wb(47, 73, 13.5, 29.5, -79.6, -78); // north wall (towards the Hel)\n'
    '      wb(71, 73, 13.5, 29.5, -78, -59.5); // east end\n'
    '      // west end with the door to the Hel (z -73..-69, 7.5 high) - steps down outside\n'
    '      wb(47, 49, 13.5, 29.5, -78, -73);\n'
    '      wb(47, 49, 13.5, 29.5, -69, -59.5);\n'
    '      wb(47, 49, 13.5, FY, -73, -69);\n'
    '      wb(47, 49, 23.5, 29.5, -73, -69);\n'
    '      H2.stairs(g, { width: 4, totalRise: 2.5, steps: 5, dir: "E", x: 44.5, y: 13.5, z: -71, tread: 0.5 });\n'
    '      // south wall with the door to the Azara (x 64.15..66.75, between two pillars of the colonnade)\n'
    '      wb(47, 64.15, 13.5, 29.5, -59.5, -57.5);\n'
    '      wb(66.75, 73, 13.5, 29.5, -59.5, -57.5);\n'
    '      wb(64.15, 66.75, 13.5, FY, -59.5, -57.5);\n'
    '      wb(64.15, 66.75, 23.5, 29.5, -59.5, -57.5);\n'
    '      const ceil = wb(46.2, 73.8, 29.5, 30.4, -80.2, -56.7, M2.marble);\n'
    '      ctx2.lishkotCut.push(ceil);\n'
    '      // the line between the holy and the unconsecrated (wall axis z=-67.5) - a bronze strip in the floor\n'
    '      wb(49, 71, FY, FY + 0.04, -67.62, -67.38, M2.bronze);\n',
    '      // ===== 1.9.5 (THREE_CHAMBERS_195; the user, 11.11.2026: "אפשרות א" - the three chambers joined under one level roof; "את לשכת\n'
    '      // הגזית תעביר כדברי הבועז. ברור שתעשה כך"; his rule: "אנו לא עושים נגד ראשונים"). THE THREE CHAMBERS ARE ONE BUILDING IN THE\n'
    '      // COURT\'S NORTH-EAST, x 61.8..91: the hall in the east (outer x 67..91, until 1.9.4 x 47..73), the two chambers behind it, in the\n'
    '      // west (the block after this one). The texts (the user\'s library, read 11.11.2026):\n'
    '      // - the Boaz on Middot 5 (1329, line 26): "ואותן ג\' הלשכות היה מקצת מהן בעזרת ישראל, ומקצת מהן בעזרת כהנים. ויהיה איך שיהיה היה\n'
    '      //   לכה"פ קצת מג\' לשכות ההן בעזרת ישראל"; "ובצדה למערב לשכה שלכה"פ היה רחבה ד\' אמות, מלבד עובי כותלים שמפסיק בין גזית\n'
    '      //   לפלהדרין". So the hall takes the court of Israel\'s eleven amot (x 82.5..91, over the duchan\'s steps) and the priests\' eleven\n'
    '      //   (71.5..82.5), and the building ends ten amot further west, east of the slaughter-place\'s pillars (x 60.5).\n'
    '      // - the Yachin (819, line 679): "שלשכת הגזית היתה במזרח להב\' לשכות האחרות, והיה ארכה מצפון לדרום, כאורך לשכת עץ ולשכת גולה\n'
    '      //   מצפון לדרום יחד... לשכת עץ וגזית על כרחך שהיו סמוכין לכותל צפוני של עזרה... פתוחין לחול". So the hall is LONG NORTH-SOUTH\n'
    '      //   now: 20 by 22 inside (22 by 18.5, long east-west, until 1.9.4), its south face in one line with the Golah chamber\'s.\n'
    '      // - the Tosafot Yom Tov (948, line 208): "ראוי לשומה גדולה הרבה יותר משתי האחרות שאצלה... שהמקום שהיא בנויה בו בחול היה ג"כ\n'
    '      //   גבוה כגובה העזרה... אבל במקום שפתוחה היא לחול היו מעלות שעליה עולין וממנה יורדין לחול. שהוא נמוך".\n'
    '      // - Yoma 25a (107, line 580): "פייס במזרחה, וזקן יושב במערבה"; the Meiri (2199, line 229): "שחציה... בצד המערב פתוח לחול\n'
    '      //   וחציה שבמזרח פתוח במקום קדש": the door to the Hel stays in the WEST end.\n'
    '      // NOT CHANGED, AN OPEN QUESTION PUT TO THE USER (12.11.2026): the hall is divided by the court wall\'s line - its north part,\n'
    '      // built outside the wall, is the unconsecrated half where the seventy-one sit (Tosafot Yeshanim, Yoma 25a - 1992, line 243:\n'
    '      // "דחציה בנויה בקדש וחציה בנויה בחול"); the Meiri (2199, line 228) has the holy half in the east and the unconsecrated in the west.\n'
    '      const HX0 = 67, HX1 = 91, HZS = -54;   // the hall\'s outer faces: west, east (the court\'s east wall\'s inner face) and south; north -79.6, as before\n'
    '      wb(HX0 + 2, HX1 - 2, 13.5, FY + 0.02, -78, HZS - 2, M2.pave); // floor (flush with the court of the priests; a hair above the duchan\'s top step, which runs under it)\n'
    '      wb(HX0, HX1, 13.5, 29.5, -79.6, -78); // north wall (towards the Hel)\n'
    '      wb(HX1 - 2, HX1, 13.5, 29.5, -78, HZS - 2); // east end\n'
    '      // west end with the door to the Hel (z -77..-74, 7.5 high) - five steps down outside, to the Hel\'s pavement\n'
    '      wb(HX0, HX0 + 2, 13.5, 29.5, -78, -77);\n'
    '      wb(HX0, HX0 + 2, 13.5, 29.5, -74, HZS - 2);\n'
    '      wb(HX0, HX0 + 2, 13.5, FY, -77, -74);\n'
    '      wb(HX0, HX0 + 2, 23.5, 29.5, -77, -74);\n'
    '      H2.stairs(g, { width: 3, totalRise: 2.5, steps: 5, dir: "E", x: HX0 - 2.5, y: 13.5, z: -75.5, tread: 0.5 });\n'
    '      // south wall with the door to the Azara (between two pillars of the colonnade, in the court of the priests)\n'
    '      const KD0 = 77.75, KD1 = 80.25;\n'
    '      wb(HX0, KD0, 13.5, 29.5, HZS - 2, HZS);\n'
    '      wb(KD1, HX1, 13.5, 29.5, HZS - 2, HZS);\n'
    '      wb(KD0, KD1, 13.5, FY, HZS - 2, HZS);\n'
    '      wb(KD0, KD1, 23.5, 29.5, HZS - 2, HZS);\n'
    '      // ONE LEVEL ROOF FOR THE THREE: Middot 5:4 (89, line 39) "וגג שלשתן שוה"; Rashi, Yoma 19a (2157, line 596): "קירוי אחד\n'
    '      // לשלשתן"; the Yachin (819, line 681): "שאלו הג\' לשכות לא היתה אחת גבוה מחבירתה". The hall\'s gable (until 1.9.4) is gone; this\n'
    '      // slab and the two chambers\' (below) are one level and one stone.\n'
    '      const ceil = wb(HX0 - 0.8, HX1 + 0.8, 29.5, 30.4, -80.2, HZS + 0.7, M2.stoneSmooth);\n'
    '      ctx2.lishkotCut.push(ceil);\n'
    '      // the hall reaches the soreg\'s line, 2.1 amot past the podium\'s edge (z -77.5): a foundation under that part, down to the\n'
    '      // mount\'s floor (until 1.9.4 its north wall hung in the air there)\n'
    '      wb(HX0, HX1, 0, 13.5, -79.6, -77.5, M2.stone);\n'
    '      // the line between the holy and the unconsecrated (wall axis z=-67.5) - a bronze strip in the floor\n'
    '      wb(HX0 + 2, HX1 - 2, FY + 0.02, FY + 0.06, -67.62, -67.38, M2.bronze);\n')
rep('      const CX = 60, CZ = -67.9, EA = 10.2, EB = 9.4;', '      const CX = 79, CZ = -67.9, EA = 9.5, EB = 9.4;   // 1.9.5: the hall is 20 wide inside (CX 60, EA 10.2 until 1.9.4)')
rep('      figures(g, ovalPts(EA, EB, 71, 0, Math.PI), FY + 0.45, 0.68, 0.8, cloth, 35);', '      figures(g, ovalPts(EA, EB, 71, 0, Math.PI), FY + 0.45, 0.66, 0.8, cloth, 35);')
rep('      for (const [a, b] of [[8.3, 7.5], [7.0, 6.2], [5.7, 4.9]]) figures(stRound,', '      for (const [a, b] of [[7.7, 7.5], [6.5, 6.2], [5.3, 4.9]]) figures(stRound,')
rep('      lbl("גבול קודש | חול", 52.5, 17.2, -67.5, 1.2);\n'
    '      lbl("פתח לקודש", 65.45, 25, -57.4, 1.5);\n'
    '      lbl("פתח לחול", 46.8, 25, -71, 1.5);\n'
    '      lbl("מקום הפייס", 67, 19, -62.5, 1.2);\n',
    '      lbl("גבול קודש | חול", HX0 + 5, 17.2, -67.5, 1.2);\n'
    '      lbl("פתח לקודש", (KD0 + KD1) / 2, 25, HZS + 0.1, 1.5);\n'
    '      lbl("פתח לחול", HX0 - 0.2, 25, -75.5, 1.5);\n'
    '      lbl("מקום הפייס", 84.5, 19, -61, 1.2);\n')

# 5. the gable goes; the colonnade follows the hall's south face; the end pilasters go
rep('    const tri = new Shape();\n'
    '    tri.moveTo(-11.75, 0);\n'
    '    tri.lineTo(11.75, 0);\n'
    '    tri.lineTo(0, 4.4);\n'
    '    tri.closePath();\n'
    '    const gg = new ExtrudeGeometry(tri, { depth: 27, bevelEnabled: false });\n'
    '    gg.translate(0, 0, -13.5);\n'
    '    const gable = new Mesh(gg, M2.stoneLight);\n'
    '    gable.rotation.y = HP;\n'
    '    gable.position.set(60, 30.4, -68.45);\n'
    '    gable.castShadow = gable.receiveShadow = true;\n'
    '    g.add(gable);\n'
    '    ctx2.lishkotCut.push(gable);\n',
    '    // 1.9.5 (THREE_CHAMBERS_195): the hall\'s gable (until 1.9.4) is gone - "וגג שלשתן שוה", one level roof for the three chambers\n')
rep('    const pilA = new InstancedMesh(H2.uvWorldBox(new BoxGeometry(1, 11.5, 1), 1, 11.5, 1), M2.marble, 7);\n'
    '    [49, 52.7, 56.4, 60, 63.6, 67.3, 71].forEach((x, i) => {\n'
    '      const m = new Matrix4();\n'
    '      m.makeTranslation(x, 21.75, -57.2);\n',
    '    // 1.9.5: six pillars before the hall\'s south face (z -54), the door to the court between the third and the fourth; the two east\n'
    '    // ones stand past the priests\' podium (x 82.5) in the Chazon Ish\'s reading of the duchan (no steps there) - a base under each\n'
    '    const pilA = new InstancedMesh(H2.uvWorldBox(new BoxGeometry(1, 11.5, 1), 1, 11.5, 1), M2.marble, 6);\n'
    '    for (const x of [84.4, 88]) H2.box(g, 1, 2.5, 1, M2.marble, x, 13.5, -53.7);\n'
    '    [70, 73.6, 77.2, 80.8, 84.4, 88].forEach((x, i) => {\n'
    '      const m = new Matrix4();\n'
    '      m.makeTranslation(x, 21.75, -53.7);\n')
rep('    const pilB = new InstancedMesh(H2.uvWorldBox(new BoxGeometry(1, 14.5, 1), 1, 14.5, 1), M2.marble, 6);\n'
    '    let bi = 0;\n'
    '    for (const x of [46.8, 73.2]) for (const z of [-74.5, -67.5, -60.5]) {\n'
    '      const m = new Matrix4();\n'
    '      m.makeTranslation(x, 20.75, z);\n'
    '      pilB.setMatrixAt(bi++, m);\n'
    '    }\n'
    '    for (const p of [pilA, pilB]) {\n',
    '    // 1.9.5: the pilasters of the hall\'s two ends (until 1.9.4) are gone - the west end is the chambers\' and the door\'s, the east end\n'
    '    // stands against the court\'s east wall\n'
    '    for (const p of [pilA]) {\n')
rep('    lbl("לשכת הגזית — מושב הסנהדרין", 60, 33.5, -67.5, 3);', '    lbl("לשכת הגזית — מושב הסנהדרין", 79, 33.5, -67.5, 3);')

# 6. the wood chamber's old room goes
rep('      room(40, -83.5, 40, 10, 13.5, 13.5, { dx: 0, dz: -1 }, "לשכת העץ — לשכת כהן גדול (פרהדרין)", 30.5, F_ETZ);\n',
    '      // 1.9.5 (THREE_CHAMBERS_195): until 1.9.4 a room of its own, 40 x 10, north of the hall and OUTSIDE the court\'s wall (z -88.5..\n'
    '      // -78.5: past the podium\'s edge and the soreg\'s line; its roof at 27, lower than the other two). Now inside the court, the\n'
    '      // north-west part of the one building - see there.\n')

WEST = r'''    // ===== 1.9.5 (THREE_CHAMBERS_195): THE TWO CHAMBERS BEHIND THE HALL - west of it, x 61.8..67, INSIDE the court (z -65..-54), under
    // the hall's roof level. Middot 5:4 (89, line 39): "לשכת העץ... אבא שאול אומר, לשכת כהן גדול, והיא היתה אחורי שתיהן, וגג שלשתן
    // שוה"; Rashi, Yoma 19a (2157, lines 595-596): "אחורי שתיהן - ללשכת הגולה וללשכת הגזית", "וגג שלשתן שוה - קירוי אחד לשלשתן".
    // The Tosafot Yom Tov (948, line 205), in the name of the Shiltei HaGiborim: "שלשכת הגזית היתה במזרח לפני שתיהם שלשכת הגולה ולשכת
    // העץ היו בנוין אחורי לשכת הגזית בשוה. והיתה לשכת הגולה לדרום של גזית ולשכת העץ בצפון של גזית. ונמצאת אומר שלשכת העץ אחורי דגזית
    // ממש שהרי במערב שלה היא. וגם היא אחורי דגולה שהגולה היא בדרום. ונמצא שלשכת העץ אחוריה לצפון".
    // THE WOOD CHAMBER (north, z -65..-60.2, against the court's wall): until 1.9.4 it stood OUTSIDE the wall. Tosafot, Yoma 8b (1908,
    // line 68): "ללשכת פרהדרין שהיתה בנויה בקודש ואפילו את"ל שהיתה פתוחה לחול"; the Tosafot Rid, Yoma 25a (2109, line 76): "דבתוך העזרה
    // קיימא"; the Tosafot Yom Tov (948, line 204): "שאע"פ שהיתה בנויה בקדש היתה פתוחה לחול... ולא היה לזו פתח כלל אל הקדש משא"כ לשכת
    // הגזית דלקמן. והיו לה מעלות אשר יעלו עליה מן החול שהיא נמוך ממקומה של הלשכה שהיא בעזרה". So: built inside the court, ITS ONLY
    // DOOR NORTH, through the court's wall, to the Hel, and five steps in the wall's thickness, up from the Hel's pavement (13.5) to
    // the chamber's floor (16). THE GOLAH CHAMBER (south, z -59.2..-55.2): its door south, to the court ("ומשם מספיקים מים לכל העזרה").
    // Their width inside, 4 - the Boaz (1329, line 26): "לשכה שלכה"פ היה רחבה ד' אמות". MODEL CHOICES: their lengths, the doors'
    // places in their walls, the furniture, the well's size.
    {
      const X0 = 61.8, X1 = 67, T = 1.2, TOP = 29.5, DH = 7, FYK = LV.KOH, ZS = -54;
      const ix0 = X0 + T, icx = (ix0 + X1) / 2;   // inside x 63..67
      const wb = (x0, x1, y0, y1, z0, z1, mat = M2.stoneLight) => H2.box(g, x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, y0, (z0 + z1) / 2);
      const leaf = (w, x, y, z, rot) => {   // a door leaf ajar in a wall along x, hinged at its west jamb (as the other chambers')
        const geo = H2.uvWorldBox(new BoxGeometry(w, DH - 0.2, 0.25), w, DH - 0.2, 0.25);
        geo.translate(w / 2, (DH - 0.2) / 2, 0);
        const m = new Mesh(geo, cedarDark);
        m.position.set(x, y, z); m.rotation.y = rot; m.castShadow = m.receiveShadow = true; g.add(m);
      };
      // the two rooms are four amot wide and 13.5 high: with the roofs open (ctx2.lishkotCut - the chambers' pill and the places' views)
      // their walls are open too, above the doors' height, so that the floor is seen from above (the eye cannot stand at the zenith)
      const wb2 = (x0, x1, z0, z1) => { wb(x0, x1, FYK, FYK + DH, z0, z1); ctx2.lishkotCut.push(wb(x0, x1, FYK + DH, TOP, z0, z1)); };
      wb2(X0, ix0, -65, ZS);                                                 // the west wall of both
      wb2(ix0, X1, -60.2, -59.2);                                            // the wall between the two
      const ceilW = wb(X0 - 0.7, 66.2, 29.5, 30.4, -65, ZS + 0.7, M2.stoneSmooth);   // their roof - the hall's level and stone
      ctx2.lishkotCut.push(ceilW);
      // --- the wood chamber
      H2.box(g, X1 - ix0, 0.3, 4.8, M2.marble, icx, FYK, -62.6);
      H2.stairs(g, { width: 2, totalRise: 2.5, steps: 5, dir: "S", x: 65.5, y: 13.5, z: -70, tread: 0.5 });   // in the court wall's thickness
      leaf(1.84, 64.5, FYK + 0.3, -64.85, -0.6);
      H2.box(g, 3.9, 1, 2, M2.cedar, icx, FYK + 0.3, -61.3);                 // the bed, along the south wall
      H2.box(g, 3.7, 0.5, 1.8, clothMat, icx, FYK + 1.3, -61.3);
      H2.box(g, 0.9, 0.5, 1.8, linenMat, ix0 + 0.6, FYK + 1.8, -61.3);       // the pillow
      H2.box(g, 1.2, 1.6, 1, cedarDark, ix0 + 0.7, FYK + 0.3, -64.4);        // a chest
      H2.box(g, 0.8, 0.8, 0.8, M2.cedar, X1 - 0.6, FYK + 0.3, -63.2);        // a stool
      lbl("דירת כהן גדול בשבעת הימים", icx, FYK + 7.3, -62.6, 1.1);
      lbl("לשכת העץ — לשכת כהן גדול (פרהדרין)", icx, 42.8, -67.5, 2);   // over the court's wall, beside the room: over the room itself it would hide it from above
      lbl("פתח לשכת העץ — אל החיל", 65.5, 25, -70.2, 1.2);
      // --- the Golah chamber
      H2.box(g, X1 - ix0, 0.3, 4, M2.marble, icx, FYK, -57.2);
      wb2(ix0, icx - 1.2, -55.2, ZS);                                        // south wall, with the door to the court
      wb2(icx + 1.2, X1, -55.2, ZS);
      ctx2.lishkotCut.push(wb(icx - 1.2, icx + 1.2, FYK + DH, TOP, -55.2, ZS));
      leaf(2.2, icx - 1.2, FYK + 0.3, -55.35, 0.6);
      F_GOLAH(icx, -57.2, FYK + 0.3, null, 0.62);
      lbl("לשכת הגולה ובור הגולה", icx, 31.8, -51.6, 2);   // before the room's door, for the same reason
    }
'''
anchor = '    // 1.9.3 (the user, of the kuntres, point 13: "כן"): THE TWO LESSER COURTS - Sanhedrin 11:2'
assert s.count(anchor) == 1
s = s.replace(anchor, WEST + anchor); n[0] += 1

io.open(P, 'w', encoding='utf-8').write(s)
print('applied', n[0], 'edits')
