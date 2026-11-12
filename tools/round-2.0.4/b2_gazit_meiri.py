#!/usr/bin/env python3
# 1.9.5 - the Gazit hall's inside per the Meiri (the user, 11.11.2026 21:15: "ב"): the seventy-one in the WEST half facing east,
# the lottery's place in the EAST half; the door to the holy in the east half; the strip divides east | west. Idempotent
# (marker GAZIT_MEIRI_195). File: /home/claude/b2src/src/30-courts.js (backup /tmp/30-courts.b2.before_meiri.js).
import io, shutil, os
F = "/home/claude/b2src/src/30-courts.js"
s = io.open(F, encoding="utf-8").read()
if "GAZIT_MEIRI_195" in s:
    raise SystemExit("already applied")
if not os.path.exists("/tmp/30-courts.b2.before_meiri.js"):
    shutil.copy(F, "/tmp/30-courts.b2.before_meiri.js")
def rep(a, b, what, count=1):
    global s
    n = s.count(a)
    if n != count:
        raise SystemExit("GAZIT_MEIRI: %s: found %d, expected %d" % (what, n, count))
    s = s.replace(a, b)

rep("""      // NOT CHANGED, AN OPEN QUESTION PUT TO THE USER (12.11.2026): the hall is divided by the court wall's line - its north part,
      // built outside the wall, is the unconsecrated half where the seventy-one sit (Tosafot Yeshanim, Yoma 25a - 1992, line 243:
      // "דחציה בנויה בקדש וחציה בנויה בחול"); the Meiri (2199, line 228) has the holy half in the east and the unconsecrated in the west.
""", """      // GAZIT_MEIRI_195 (the user's decision, 11.11.2026 21:15, on the question put to him - "ב"): THE HALL IS DIVIDED EAST | WEST, as
      // the Gemara's words and the Meiri's (2199, lines 228-229): "מתקבצים בחציה של קדש שהיה בצד מזרחה של לשכה... וזקן מזקני
      // הסנהדרין יושב בחציה של חול לצד מערבה של לשכה"; "שחציה הבנוי במקום קדש ר"ל בצד המערב פתוח לחול וחציה שבמזרח פתוח במקום
      // קדש". So: the seventy-one sit in the WEST half (x 69..79) and face east; the lottery's place is the EAST half (79..89);
      // the door to the Hel in the west (as it was); the door to the Azara in the east half of the south wall; the bronze strip in the
      // floor runs north-south on the hall's middle line (x 79). (Until this change, in the 1.9.5 working build only, the hall was
      // divided by the court wall's line: the row in the north part, the Tosafot Yeshanim's "חציה בנויה בקדש וחציה בנויה בחול".)
""", "comment")
rep("""      const KD0 = 77.75, KD1 = 80.25;
""", """      const KD0 = 79.75, KD1 = 82.25;   // GAZIT_MEIRI_195: in the hall's EAST half (77.75..80.25 before), over the priests' podium (x < 82.5), between two pillars
""", "door")
rep("""      // the line between the holy and the unconsecrated (wall axis z=-67.5) - a bronze strip in the floor
      wb(HX0 + 2, HX1 - 2, FY + 0.02, FY + 0.06, -67.62, -67.38, M2.bronze);
""", """      // the line between the holy (east) and the unconsecrated (west) - a bronze strip in the floor, on the hall's middle line (GAZIT_MEIRI_195)
      wb(78.88, 79.12, FY + 0.02, FY + 0.06, -78, HZS - 2, M2.bronze);
""", "strip")
rep("""      const CX = 79, CZ = -67.9, EA = 9.5, EB = 9.4;   // 1.9.5: the hall is 20 wide inside (CX 60, EA 10.2 until 1.9.4)
""", """      // GAZIT_MEIRI_195: the half oval opens EAST - its ends on the line x = CX (just west of the middle line), its back to the west
      // wall; EA = its half-length north-south, EB = its depth westwards. North of its end a way two amot wide is left along the
      // north wall, from the door to the Hel (west end, z -77..-74) into the hall
      const CX = 78.7, CZ = -67, EA = 8.6, EB = 8.7;
""", "oval consts")
rep("""      // n points evenly spaced by length on the half-oval (a, b), from t0 to t1 (radians; 0 = east end, PI = west end)
""", """      // n points evenly spaced by length on the half-oval (a, b), from t0 to t1 (radians; 0 = north end, PI = south end; PI / 2 = the west point)
""", "ovalPts comment")
rep("""          out.push([CX + a * Math.cos(t), CZ - b * Math.sin(t)]);
""", """          out.push([CX - b * Math.sin(t), CZ - a * Math.cos(t)]);
""", "ovalPts")
rep("""        geo.rotateX(-Math.PI / 2);
        const bench = new Mesh(geo, M2.cedar);
        bench.position.set(CX, FY, CZ);
""", """        geo.rotateX(-Math.PI / 2);
        geo.rotateY(Math.PI / 2);   // GAZIT_MEIRI_195: the bulge to the west (it was to the north)
        const bench = new Mesh(geo, M2.cedar);
        bench.position.set(CX, FY, CZ);
""", "bench")
rep("""      figures(g, ovalPts(EA, EB, 71, 0, Math.PI), FY + 0.45, 0.66, 0.8, cloth, 35);
""", """      figures(g, ovalPts(EA, EB, 71, 0, Math.PI), FY + 0.45, 0.62, 0.8, cloth, 35);
""", "judges")
rep("""      for (const [a, b] of [[7.7, 7.5], [6.5, 6.2], [5.3, 4.9]]) figures(stRound, ovalPts(a, b, 23, 0.1 * Math.PI, 0.9 * Math.PI), FY, 0.6, 0.62, cloth2, -1);
      for (const dz of [1.7, 3.0, 4.3]) figures(stStraight, Array.from({ length: 23 }, (_, i) => [CX - 8.25 + i * 0.75, CZ - dz]), FY, 0.6, 0.62, cloth2, -1);
""", """      for (const [a, b] of [[6.97, 6.94], [5.88, 5.74], [4.8, 4.53]]) figures(stRound, ovalPts(a, b, 23, 0.1 * Math.PI, 0.9 * Math.PI), FY, 0.56, 0.62, cloth2, -1);
      for (const dx of [1.7, 3.0, 4.3]) figures(stStraight, Array.from({ length: 23 }, (_, i) => [CX - dx, CZ - 6.6 + i * 0.6]), FY, 0.56, 0.62, cloth2, -1);
""", "students")
rep("""      for (const sx of [-2.4, 2.4]) {
        const b = new Mesh(new CylinderGeometry(0.18, 0.26, 1.9, 10), new MeshStandardMaterial({ color: 0x8fa3b8, roughness: 0.85 }));
        b.position.set(CX + sx, FY + 0.95, -67.2);
        const hd = new Mesh(new SphereGeometry(0.17, 12, 10), new MeshStandardMaterial({ color: 0xc99a73, roughness: 0.8 }));
        hd.position.set(CX + sx, FY + 2.05, -67.2);
""", """      for (const sx of [-2.4, 2.4]) {
        const b = new Mesh(new CylinderGeometry(0.18, 0.26, 1.9, 10), new MeshStandardMaterial({ color: 0x8fa3b8, roughness: 0.85 }));
        b.position.set(CX - 0.7, FY + 0.95, CZ + sx);
        const hd = new Mesh(new SphereGeometry(0.17, 12, 10), new MeshStandardMaterial({ color: 0xc99a73, roughness: 0.8 }));
        hd.position.set(CX - 0.7, FY + 2.05, CZ + sx);
""", "scribes")
rep("""      lbl("הסנהדרין הגדולה — שבעים ואחד בשורה אחת, כחצי גורן", CX, 22.5, -74.5, 1.8);
      lbl("הנשיא", CX, 19.2, CZ - EB - 0.2, 1.1);
      lbl("סופרי הדיינין", CX, 19.6, -67.2, 1);
      lbl("שלוש שורות של תלמידי חכמים", CX, 18.4, CZ - 4.6, 1);
      lbl("גבול קודש | חול", HX0 + 5, 17.2, -67.5, 1.2);
      lbl("פתח לקודש", (KD0 + KD1) / 2, 25, HZS + 0.1, 1.5);
      lbl("פתח לחול", HX0 - 0.2, 25, -75.5, 1.5);
      lbl("מקום הפייס", 84.5, 19, -61, 1.2);
""", """      lbl("הסנהדרין הגדולה — שבעים ואחד בשורה אחת, כחצי גורן", 73.4, 22.5, CZ, 1.8);
      lbl("הנשיא", CX - EB - 0.2, 19.2, CZ, 1.1);
      lbl("סופרי הדיינין", CX - 0.7, 19.6, CZ, 1);
      lbl("שלוש שורות של תלמידי חכמים", CX - 3.3, 18.4, CZ + 3.4, 1);
      lbl("חצי החול — במערב", 74, 17.4, HZS - 3.4, 1.2);      // GAZIT_MEIRI_195 (one label "גבול קודש | חול" on the old east-west line before)
      lbl("חצי הקודש — במזרח", 84, 17.4, HZS - 3.4, 1.2);
      lbl("פתח לקודש", (KD0 + KD1) / 2, 25, HZS + 0.1, 1.5);
      lbl("פתח לחול", HX0 - 0.2, 25, -75.5, 1.5);
      lbl("מקום הפייס", 84, 19, CZ, 1.2);
""", "labels")
rep("""    // 1.9.5: six pillars before the hall's south face (z -54), the door to the court between the third and the fourth; the two east
    // ones stand past the priests' podium (x 82.5) in the Chazon Ish's reading of the duchan (no steps there) - a base under each
    const pilA = new InstancedMesh(H2.uvWorldBox(new BoxGeometry(1, 11.5, 1), 1, 11.5, 1), M2.marble, 6);
    for (const x of [84.4, 88]) H2.box(g, 1, 2.5, 1, M2.marble, x, 13.5, -53.7);
    [70, 73.6, 77.2, 80.8, 84.4, 88].forEach((x, i) => {
""", """    // 1.9.5: pillars before the hall's south face (z -54) - GAZIT_MEIRI_195: five, four amot apart (six, 3.6 apart, before), the
    // door to the court (now in the hall's east half) between the third and the fourth; the two east ones stand past the priests'
    // podium (x 82.5) - a base under each
    const pilA = new InstancedMesh(H2.uvWorldBox(new BoxGeometry(1, 11.5, 1), 1, 11.5, 1), M2.marble, 5);
    for (const x of [83, 87]) H2.box(g, 1, 2.5, 1, M2.marble, x, 13.5, -53.7);
    [71, 75, 79, 83, 87].forEach((x, i) => {
""", "pillars")
io.open(F, "w", encoding="utf-8").write(s)
print("GAZIT_MEIRI_195 applied")
