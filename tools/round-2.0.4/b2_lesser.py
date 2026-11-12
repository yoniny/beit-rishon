# -*- coding: utf-8 -*-
# 1.9.5 - the two lesser courts in CHAMBERS, their half circle bigger than ten amot, the three rows of students before them, and their
# place in two readings (the user, 11.11.2026: "9. מקומן אפשרות ג. לבנות לשכה להגדיל ולהוסיף"). Patches /home/claude/b2src/src/30-courts.js.
import io, sys
P = '/home/claude/b2src/src/30-courts.js'
s = io.open(P, encoding='utf-8').read()
if 'lesserChamber' in s:
    print('b2_lesser: already applied'); sys.exit(0)
i0 = s.index('    // 1.9.3 (the user, of the kuntres, point 13: "כן"): THE TWO LESSER COURTS')
i1 = s.index('    const tri = new Shape();\n    tri.moveTo(-11.75, 0);')
old = s[i0:i1]
assert 'const lesser = (cx, y, cz, R, a0, name) => {' in old and old.rstrip().endswith('}'), old[-200:]
new = r'''    // 1.9.3 (the user, of the kuntres, point 13: "כן"): THE TWO LESSER COURTS - Sanhedrin 11:2 "שלשה בתי דינין היו שם, אחד יושב על פתח הר
    // הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית" (73, line 78); Rashi 86b (2180, lines 4632-4633): "על פתח הר הבית - הוא שער
    // המזרחי שלפנים מן החיל לפני עזרת נשים", "ואחד יושב למעלה הימנו - כשעברו עזרת נשים ובאין לפני עזרת ישראל". Until 1.9.4: twenty-three
    // on an open bench three amot in radius, one in the chel by the women's court's east gate and one on the terrace before Nikanor's gate.
    // 1.9.5 (remarks sent on to the user, 11.11.2026: "הסנהדרין לא יכלה לשבת בחוץ בצורה פתוחה גם משום כבודם וגם כיון שבקבלת העדות הם צריכים
    // להוציא כולם החוצה ולהשאר לבדם / וכן מקומם לא הי' בפתח עז"נ אלא בפתח הר הבית / וכן היו שם ג' שורות... / ועוד שעיגול ישיבת הדיינים
    // צריך להיות יותר מעשר אמות"; the user: "9. מקומן אפשרות ג. לבנות לשכה להגדיל ולהוסיף"): each court sits in A CLOSED CHAMBER (walls,
    // a door, a roof that goes with the chambers' roofs - lishkotCut), its half circle fifteen amot across (twenty-three seats of an
    // amah), two scribes standing before the judges (Sanhedrin 4:3) and THE THREE ROWS of students before them (4:4) in the reading of
    // the row "שורות התלמידים שלפני הסנהדרין" (Rashi 37a: round, on the ground; the Yad Ramah: straight). THE PLACE - two readings
    // (ctx2.shared.lesserPlace, the row "מקום שתי הסנהדראות הקטנות"): "rashi" (the default) - the court "על פתח הר הבית" by the women's
    // court's east gate, as Rashi; "mount" - by the Temple Mount's eastern gate (Shushan), as the Mishnah's plain words (the Rambam,
    // Sanhedrin 1:3: "אחד על פתח העזרה ואחד על פתח הר הבית"). The court "על פתח העזרה" stands before Nikanor's gate in both. The
    // chambers' exact places, their size, walls, doors and the figures - model choices (the cards say so).
    {
      const bG = new CylinderGeometry(0.2, 0.3, 1, 10); bG.translate(0, 0.5, 0);
      const hG = new SphereGeometry(0.21, 12, 10);
      const fM = new MeshStandardMaterial({ color: 16777215, roughness: 0.85 }), sM = new MeshStandardMaterial({ color: 16777215, roughness: 0.8 });
      const m4 = new Matrix4(), q = new Quaternion(), v = new Vector3(), p = new Vector3(), c3 = new Color();
      const R = 7.5, WT = 1, WH2 = 7, HX = R + 0.45 + 0.6, ZB = -(R + 0.45 + 0.6), ZF = 2.65;   // the room inside: x -HX..HX, z ZB..ZF (the half circle's centre at 0, its open side to +z, the door there)
      const people = (grp, pts, y, w, h, tones) => {
        const bodies = new InstancedMesh(bG, fM, pts.length), heads = new InstancedMesh(hG, sM, pts.length);
        pts.forEach(([x, z], i) => {
          m4.compose(p.set(x, y, z), q, v.set(w, h, w)); bodies.setMatrixAt(i, m4); bodies.setColorAt(i, c3.setHex(tones[i % tones.length]));
          m4.compose(p.set(x, y + h + 0.14 * w, z), q, v.set(w, w, w)); heads.setMatrixAt(i, m4); heads.setColorAt(i, c3.setHex([0xc99a73, 0xb98763, 0xd7aa86][i % 3]));
        });
        for (const im of [bodies, heads]) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.castShadow = true; grp.add(im); }
      };
      const arcPts = (r, n, a0, a1) => Array.from({ length: n }, (_, i) => { const a = a0 + (a1 - a0) * (i + 0.5) / n; return [r * Math.cos(a), -r * Math.sin(a)]; });
      const rounds = [], straights = [];
      const lesserChamber = (cx, y, cz, name) => {
        const lg2 = new Group();
        lg2.position.set(cx, y, cz);
        g.add(lg2);
        // the judges' bench - half a ring - and the twenty-three on it
        const sh = new Shape();
        sh.absarc(0, 0, R + 0.42, 0, Math.PI, false); sh.lineTo(-(R - 0.42), 0); sh.absarc(0, 0, R - 0.42, Math.PI, 0, true); sh.lineTo(R + 0.42, 0);
        const geo = new ExtrudeGeometry(sh, { depth: 0.45, bevelEnabled: false, curveSegments: 32 });
        geo.rotateX(Math.PI / 2);   // the shape's y is the model's z (the arc to -z); the bench hangs 0.45 down from its top
        const bench = new Mesh(geo, M2.cedar);
        bench.position.set(0, 0.45, 0);
        bench.castShadow = bench.receiveShadow = true;
        lg2.add(bench);
        people(lg2, arcPts(R, 23, 0, Math.PI), 0.45, 0.7, 0.8, [0xece4cc, 0xe3d9bb, 0xd9cfae]);
        // the two scribes, standing before them, one at the right and one at the left (Sanhedrin 4:3)
        people(lg2, [[-2.2, 1.3], [2.2, 1.3]], 0, 0.62, 1.75, [0x8fa3b8]);
        // the three rows of students (4:4): round, on the ground (Rashi 37a) / straight (the Yad Ramah)
        const stR = new Group(), stS = new Group();
        stS.visible = false;
        lg2.add(stR); lg2.add(stS);
        for (const r of [6.15, 4.95, 3.75]) people(stR, arcPts(r, 23, 0.07 * Math.PI, 0.93 * Math.PI), 0, 0.45, 0.6, [0xd9d2bd, 0xcfc6ad, 0xc9c0a4]);
        for (const dz of [1.3, 2.5, 3.7]) people(stS, Array.from({ length: 23 }, (_, i) => [-5.5 + i * 0.5, -dz]), 0, 0.45, 0.6, [0xd9d2bd, 0xcfc6ad, 0xc9c0a4]);
        rounds.push(stR); straights.push(stS);
        // the chamber: three whole walls, the front one with its door (3 wide, 5 high), and the roof
        const xo = HX + WT, w = 2 * xo, zc = (ZB + ZF) / 2, d = ZF - ZB;
        H2.box(lg2, w, WH2, WT, M2.stone, 0, 0, ZB - WT / 2);
        for (const sx of [-1, 1]) H2.box(lg2, WT, WH2, d, M2.stone, sx * (HX + WT / 2), 0, zc);
        for (const sx of [-1, 1]) H2.box(lg2, xo - 1.5, WH2, WT, M2.stone, sx * (1.5 + (xo - 1.5) / 2), 0, ZF + WT / 2);
        H2.box(lg2, 3, WH2 - 5, WT, M2.stone, 0, 5, ZF + WT / 2);
        H2.box(lg2, 3.6, 0.5, WT + 0.3, M2.stoneLight, 0, 5, ZF + WT / 2);                       // the lintel
        H2.box(lg2, w, 0.08, d + 2 * WT, M2.paveFine, 0, 0, zc);                                // the floor
        const roof = H2.box(lg2, w + 0.6, 0.6, d + 2 * WT + 0.6, M2.stoneLight, 0, WH2, zc);
        ctx2.lishkotCut.push(roof);
        lbl(name, cx, y + WH2 + 2.2, cz + zc, 1.5);
        return lg2;
      };
      const zO = -7.9 - (ZF + WT);   // the origin's z of a chamber whose front wall's outer face stands at z -7.9, north of the way to the gate
      // before Nikanor's gate ("על פתח העזרה"): on the women's court's floor, north-east of the fifteen steps, its door to the south
      lesserChamber(117 + HX + WT, LV.EZN, -27.5 - (ZB - WT), "סנהדרי קטנה — על פתח העזרה (סנהדרין יא, ב)");
      // "על פתח הר הבית": Rashi's - by the women's court's east gate, outside the soreg, north of the way in; the plain reading's - inside the Shushan gate
      const lA = lesserChamber(242 + HX + WT, 0, zO, "סנהדרי קטנה — על פתח הר הבית (סנהדרין יא, ב; רש״י)");
      const lAL = ctx2.labels[ctx2.labels.length - 1];
      const lM = lesserChamber(332.2 - HX - WT, 0, zO, "סנהדרי קטנה — על פתח הר הבית, בשער המזרחי (סנהדרין יא, ב)");
      const lML = ctx2.labels[ctx2.labels.length - 1];
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.lesserRashi = lA; ctx2.layers.lesserMount = lM;
      lAL.layer = "lesserRashi"; lML.layer = "lesserMount";
      lM.visible = false;
      ctx2.shared.lesserPlace = { mode: "rashi", set(m) { this.mode = m === "mount" ? "mount" : "rashi"; lA.visible = this.mode === "rashi"; lM.visible = this.mode === "mount"; return this.mode; } };
      // the students' rows follow the row of the Great Sanhedrin's (ctx2.shared.sanhedrinRows, above)
      const SR = ctx2.shared.sanhedrinRows;
      if (SR) {
        const set0 = SR.set.bind(SR);
        SR.set = (m) => { const r = set0(m); for (const x of rounds) x.visible = r === "round"; for (const x of straights) x.visible = r === "straight"; return r; };
      }
    }
'''
s = s[:i0] + new + s[i1:]
io.open(P, 'w', encoding='utf-8').write(s)
print('b2_lesser: applied')
