# -*- coding: utf-8 -*-
# 2.0.4 / B1 1.3.7:
#  (1) THE EAST GATE'S STEPS - the one wide drawing (the user, 11.11.2026 16:38: "גם בבית ראשון מעלות");
#  (2) THE TWO LESSER COURTS AS CLOSED CHAMBERS, a bigger half circle, the three rows of students, and the row of their place - as in
#      the Second Temple model 1.9.5 (remarks sent on to the user 14:40; his decision 15:02 "9. מקומן אפשרות ג. לבנות לשכה להגדיל
#      ולהוסיף"; the rule: a fix in one house goes to the other in the same round).
# Idempotent by the marker "lesserChamber" in 30-courts.js.
import io

B1 = '/home/claude/beit-rishon/src/'


def rd(n):
    return io.open(B1 + n, encoding='utf-8').read()


def wr(n, s):
    io.open(B1 + n, 'w', encoding='utf-8', newline='\n').write(s)


def rep(s, old, new, name):
    k = s.count(old)
    if k != 1:
        raise SystemExit('PATCH %s: %d matches' % (name, k))
    return s.replace(old, new)


c = rd('30-courts.js')
if 'lesserChamber' in c:
    print('30-courts.js: already patched')
else:
    # ---- (1) the steps
    A = '    {\n      const rise = (AZ - wcY) / eSteps, XW0 = podL / 2, R1 = 2.9,'
    B = '    // 1.3.5 (the user, 10.11.2026 22:12: "תוסיף סנהדראות"; as in the Second Temple): THE TWO LESSER COURTS'
    a, b = c.index(A), c.index(B)
    assert a < b
    STEPS = '''    // 1.3.7 (the user, 11.11.2026 16:38: "גם בבית ראשון מעלות" - the ONE WIDE DRAWING of the Second Temple's fifteen steps, there
    // 1.9.5): STRAIGHT STEPS ALONG THE PODIUM'S EAST FACE, the lowest the shortest and each one above it longer at both its ends,
    // their ends on an arc - the Meiri's shape (above) with the Rid's length: "ואורך המעלה היה קל"ה אמה כרוחב העזרה מכותל לכותל"
    // (Piskei HaRid, Sukkah 53a - "קובץ שיטות קמאי על מדות", book 7576, line 355). The free width here: between the two western
    // chambers of the outer court (their fronts at z +-56.5; 20-mount.js MNT_LISHKA) - 113 amot. The arc (through the two ends of
    // the top step, as deep as the steps' run) and so the lowest step's length - a model choice. Until 1.3.6: a block before the
    // gate with a half-round hollow (1.3.5).
    const eRun = eSteps * STEP;   // 3: the steps' run east of the podium's face
    {
      const rise = (AZ - wcY) / eSteps, XW0 = podL / 2, HZ = 56.5, RR = (HZ * HZ + eRun * eRun) / (2 * eRun);
      for (let k = 1; k <= eSteps; k++) {
        const d = STEP * (eSteps - k), half = Math.sqrt(Math.max(0, RR * RR - (RR - eRun + d) * (RR - eRun + d))), dep = STEP * (eSteps + 1 - k);
        const st = H2.box(g, dep, rise * k, 2 * half, M2.stoneSmooth, XW0 + dep / 2, wcY, 0);   // solid down to the outer court's floor
        st.name = "eastGateStep";
        st.castShadow = st.receiveShadow = true;
      }
    }

'''
    c = c[:a] + STEPS + c[b:]
    # ---- (2) the lesser courts
    C0 = '      const bG = new CylinderGeometry(0.2, 0.3, 1, 10);\n      bG.translate(0, 0.5, 0);'
    D0 = '      ctx.shared.lesserCourts = {'
    i = c.index(C0)
    j = c.index(D0)
    j = c.index('\n', j) + 1
    LESSER = '''      // 1.3.7 (remarks sent on to the user, 11.11.2026: "הסנהדרין לא יכלה לשבת בחוץ בצורה פתוחה גם משום כבודם וגם כיון שבקבלת העדות הם
      // צריכים להוציא כולם החוצה ולהשאר לבדם / וכן מקומם לא הי' בפתח עז"נ אלא בפתח הר הבית / וכן היו שם ג' שורות... / ועוד שעיגול ישיבת
      // הדיינים צריך להיות יותר מעשר אמות"; the user: "9. מקומן אפשרות ג. לבנות לשכה להגדיל ולהוסיף"; as in the Second Temple model
      // 1.9.5): each court sits in A CLOSED CHAMBER (walls, a door, a roof lifted by its own pill), its half circle fifteen amot across
      // (twenty-three seats of an amah), two scribes standing before the judges (Sanhedrin 4:3) and THE THREE ROWS of students before
      // them (4:4) in the reading of the row "שורות התלמידים שלפני הסנהדרין" (ctx.shared.sanhedrinRows, below). THE PLACE of the court
      // "על פתח הר הבית" - two readings (ctx.shared.lesserPlace, the row "מקום שתי הסנהדראות הקטנות"): "rashi" (the default) - by the
      // outer court's east gate (Rashi 86b: "הוא שער המזרחי שלפנים מן החיל לפני עזרת נשים"); "mount" - by the Temple Mount's eastern
      // gate, the Mishnah's plain words (the Rambam, Sanhedrin 1:3: "אחד על פתח העזרה ואחד על פתח הר הבית"). The court "על פתח העזרה"
      // stands before the inner court's east gate in both. Until 1.3.6: open benches three amot in radius. The chambers' exact places,
      // their size, walls, doors and the figures - model choices (the cards say so).
      const bG = new CylinderGeometry(0.2, 0.3, 1, 10);
      bG.translate(0, 0.5, 0);
      const hG = new SphereGeometry(0.21, 12, 10);
      const fM = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), sM = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
      const m4 = new Matrix4(), q = new Quaternion(), v = new Vector3(), p = new Vector3(), c3 = new Color();
      const R = 7.5, WT = 1, WH2 = 7, HX = R + 0.45 + 0.6, ZB = -(R + 0.45 + 0.6), ZF = 2.65;   // the room inside: x -HX..HX, z ZB..ZF (the half circle's centre at 0, its open side to +z, the door there)
      const people = (grp, pts, y, w, h, tones) => {
        const bodies = new InstancedMesh(bG, fM, pts.length), heads = new InstancedMesh(hG, sM, pts.length);
        pts.forEach(([x, z], i) => {
          m4.compose(p.set(x, y, z), q, v.set(w, h, w)); bodies.setMatrixAt(i, m4); bodies.setColorAt(i, c3.setHex(tones[i % tones.length]));
          m4.compose(p.set(x, y + h + 0.14 * w, z), q, v.set(w, w, w)); heads.setMatrixAt(i, m4); heads.setColorAt(i, c3.setHex([0xc99a73, 0xb98763, 0xd7aa86][i % 3]));
        });
        for (const im of [bodies, heads]) {
          im.instanceMatrix.needsUpdate = true;
          if (im.instanceColor) im.instanceColor.needsUpdate = true;
          im.castShadow = true;
          im.name = "lesserCourtFigures";
          grp.add(im);
        }
      };
      const arcPts = (r, n, a0, a1) => Array.from({ length: n }, (_, i) => { const a = a0 + (a1 - a0) * (i + 0.5) / n; return [r * Math.cos(a), -r * Math.sin(a)]; });
      const rounds = [], straights = [], roofs = [];
      const lesserChamber = (cx, y, cz, name) => {
        const lg2 = new Group();
        lg2.name = "lesserChamber";
        lg2.position.set(cx, y, cz);
        g.add(lg2);
        // the judges' bench - half a ring - and the twenty-three on it
        const sh = new Shape();
        sh.absarc(0, 0, R + 0.42, 0, Math.PI, false);
        sh.lineTo(-(R - 0.42), 0);
        sh.absarc(0, 0, R - 0.42, Math.PI, 0, true);
        sh.lineTo(R + 0.42, 0);
        const geo = new ExtrudeGeometry(sh, { depth: 0.45, bevelEnabled: false, curveSegments: 32 });
        geo.rotateX(-Math.PI / 2);   // the shape's y is the model's -z (the arc to the back wall); the bench rises 0.45 from the floor
        const bench = new Mesh(geo, M2.cedar);
        bench.name = "lesserCourtBench";
        bench.castShadow = bench.receiveShadow = true;
        lg2.add(bench);
        people(lg2, arcPts(R, 23, 0, Math.PI), 0.45, 0.7, 0.8, [0xece4cc, 0xe3d9bb, 0xd9cfae]);
        // the two scribes, standing before them, one at the right and one at the left (Sanhedrin 4:3)
        people(lg2, [[-2.2, 1.3], [2.2, 1.3]], 0, 0.62, 1.75, [0x8fa3b8]);
        // the three rows of students (4:4): round, on the ground (Rashi 37a) / straight (the Yad Ramah)
        const stR = new Group(), stS = new Group();
        stS.visible = false;
        lg2.add(stR);
        lg2.add(stS);
        for (const r of [6.15, 4.95, 3.75]) people(stR, arcPts(r, 23, 0.07 * Math.PI, 0.93 * Math.PI), 0, 0.45, 0.6, [0xb9c4d2, 0xa9b6c6, 0xc6cfdb]);
        for (const dz of [1.3, 2.5, 3.7]) people(stS, Array.from({ length: 23 }, (_, i) => [-5.5 + i * 0.5, -dz]), 0, 0.45, 0.6, [0xb9c4d2, 0xa9b6c6, 0xc6cfdb]);
        rounds.push(stR);
        straights.push(stS);
        // the chamber: three whole walls, the front one with its door (3 wide, 5 high), and the roof
        const xo = HX + WT, w = 2 * xo, zc = (ZB + ZF) / 2, d = ZF - ZB;
        H2.box(lg2, w, WH2, WT, M2.stone, 0, 0, ZB - WT / 2);
        for (const sx of [-1, 1]) H2.box(lg2, WT, WH2, d, M2.stone, sx * (HX + WT / 2), 0, zc);
        for (const sx of [-1, 1]) H2.box(lg2, xo - 1.5, WH2, WT, M2.stone, sx * (1.5 + (xo - 1.5) / 2), 0, ZF + WT / 2);
        H2.box(lg2, 3, WH2 - 5, WT, M2.stone, 0, 5, ZF + WT / 2);
        H2.box(lg2, 3.6, 0.5, WT + 0.3, M2.stoneLight, 0, 5, ZF + WT / 2);                       // the lintel
        H2.box(lg2, w, 0.08, d + 2 * WT, M2.paveFine, 0, 0, zc);                                // the floor
        const roof = H2.box(lg2, w + 0.6, 0.6, d + 2 * WT + 0.6, M2.stoneLight, 0, WH2, zc);
        roof.name = "lesserChamberRoof";
        roofs.push(roof);
        lbl(name, cx, y + WH2 + 2.2, cz + zc, 1.5);
        return lg2;
      };
      const nc = ctx.shared && ctx.shared.newCourt;
      const gE2 = ctx.shared && ctx.shared.gates && ctx.shared.gates.greatE;
      const zO = -7.9 - (ZF + WT);   // the origin's z of a chamber whose front wall's outer face stands at z -7.9, north of the way to the gate
      // "על פתח העזרה": in the outer court, before the inner court's east gate, east of its steps and north of the way; its door to the south
      const xA = podL / 2 + eRun + 3 + HX + WT;
      lesserChamber(xA, wcY, zO, "סנהדרי קטנה — על פתח העזרה (סנהדרין יא, ב)");
      // "על פתח הר הבית": Rashi's - outside the outer court's east gate, north of its steps; the plain reading's - inside the Mount's east gate
      const xR = nc && typeof nc.x1 === "number" ? nc.x1 + 2.5 + HX + WT : null;
      const xM = gE2 && typeof gE2.x === "number" ? gE2.x - 8 - HX - WT : null;
      let lA = null, lM = null;
      ctx.layers = ctx.layers || {};
      if (xR !== null) {
        lA = lesserChamber(xR, LV2.HAR, zO, "סנהדרי קטנה — על פתח הר הבית (סנהדרין יא, ב; רש״י)");
        ctx.labels[ctx.labels.length - 1].layer = "lesserRashi";
        ctx.layers.lesserRashi = lA;
      }
      if (xM !== null) {
        lM = lesserChamber(xM, LV2.HAR, zO, "סנהדרי קטנה — על פתח הר הבית, בשער המזרחי (סנהדרין יא, ב)");
        ctx.labels[ctx.labels.length - 1].layer = "lesserMount";
        ctx.layers.lesserMount = lM;
        lM.visible = false;
      }
      const zc0 = (ZB + ZF) / 2;
      ctx.shared.lesserCourts = { azarah: [xA, wcY, zO + zc0], har: xR !== null ? [xR, LV2.HAR, zO + zc0] : null, mount: xM !== null ? [xM, LV2.HAR, zO + zc0] : null, roofH: WH2 };
      ctx.shared.lesserPlace = {
        mode: "rashi",
        set(m) {
          this.mode = m === "mount" && lM ? "mount" : "rashi";
          if (lA) lA.visible = this.mode === "rashi";
          if (lM) lM.visible = this.mode === "mount";
          return this.mode;
        }
      };
      ctx.shared.lesserStudents = { rounds, straights };   // the students' rows follow the row of the Great Sanhedrin's (ctx.shared.sanhedrinRows, below)
      // the roofs: one pill on the chamber before the inner court's gate lifts the three (a viewing tool, as the other chambers' pills)
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({
        id: "crt-lesser-roofs",
        label: "פתח את גג הלשכה",
        labelOn: "החזר את הגג",
        title: "מסיר לרגע את גגות לשכות הסנהדראות הקטנות, לצפייה בלבד: עשרים ושלושה כחצי גורן, שני הסופרים ושלוש שורות התלמידים.",
        anchor: [xA, wcY + WH2 + 1.4, zO + zc0],
        maxDist: 150,
        get: () => !roofs[0].visible,
        under: () => !!(ctx.shared.camUnder && ctx.shared.camUnder(roofs)),
        set: (on) => { for (const r of roofs) r.visible = !on; }
      });
'''
    c = c[:i] + LESSER + c[j:]
    # the students' rows of the lesser chambers follow the Great Sanhedrin's row
    c = rep(c, '''stRound.visible = this.mode === "round"; stStraight.visible = this.mode === "straight"; return this.mode; } };''',
            '''stRound.visible = this.mode === "round"; stStraight.visible = this.mode === "straight"; const LS = ctx.shared.lesserStudents; if (LS) { for (const x of LS.rounds) x.visible = this.mode === "round"; for (const x of LS.straights) x.visible = this.mode === "straight"; } return this.mode; } };   // 1.3.7: the lesser chambers' rows too''',
            'rows')
    wr('30-courts.js', c)
    print('30-courts.js: patched')

u = rd('70-ui.js')
if 'id: "lesserPlace"' in u:
    print('70-ui.js: already patched')
else:
    # the place's card
    a = u.index('          { t: "שתי הסנהדראות הקטנות", tg: [102.4, 4.6, -11.2], cam: [117, 17, -27],')
    b = u.index('          { t: "חצר הכהנים", view: "azarah", key: "azarah" },')
    assert a < b
    PLACE = '''          { t: "שתי הסנהדראות הקטנות", action: () => openPill20("crt-lesser-roofs"),
            tg: () => { const L = ctx.shared.lesserCourts, p = (L && L.azarah) || [114, 3, -15]; return [p[0], p[1] + 2, p[2]]; },
            cam: () => { const L = ctx.shared.lesserCourts, p = (L && L.azarah) || [114, 3, -15]; return [p[0], p[1] + 31, p[2] + 24]; },
            info: "לשון המשנה (סנהדרין יא, ב): 'שלשה בתי דינין היו שם, אחד יושב על פתח הר הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית'.\\nבקצרה — מקום בית הדין שעל פתח הר הבית: לרש״י — אצל השער המזרחי שלפני עזרת נשים (**ברירת המחדל**); וכפשט המשנה — אצל שער הר הבית עצמו (בטבלת השיטות, בשורה 'מקום שתי הסנהדראות הקטנות'). ושורות התלמידים: לרש״י כעגולה, וליד רמה פשוטות (שם, בשורה 'שורות התלמידים שלפני הסנהדרין').\\nרש״י (פו:): 'אחד יושב על פתח הר הבית — הוא שער המזרחי שלפנים מן החיל לפני עזרת נשים'; 'ואחד יושב למעלה הימנו — כשעברו עזרת נשים ובאין לפני עזרת ישראל'.\\nועל ישיבתם (סנהדרין ד, ג–ד): 'סנהדרין היתה כחצי גרן עגלה, כדי שיהו רואין זה את זה. ושני סופרי הדינין עומדין לפניהם, אחד מימין ואחד משמאל'; 'ושלש שורות של תלמידי חכמים יושבין לפניהם, כל אחד ואחד מכיר את מקומו'.\\nבמודל: כל בית דין יושב **בלשכה סגורה** — עשרים ושלושה כחצי גורן, חמש עשרה אמה קוטרו; לפניהם שני סופרי הדיינים ושלוש שורות התלמידים. המשנה ורש״י מדברים בלשון בית שני; העתקת הדבר לחצרות בית ראשון, הלשכה, מידותיה, פתחה ומקומה המדויק — בחירת מודל. המבט כאן: אל בית הדין שלפני שער חצר הכהנים; גג הלשכה מוסר לשעה.",
            refs: [["משנה סנהדרין יא, ב", { book: 73, index: 78 }], ["רש״י סנהדרין פו:", { book: 2180, index: 4632 }], ["רמב״ם סנהדרין א, ג", { book: 375, index: 5 }], ["משנה סנהדרין ד, ג", MN(73, 4, 3)], ["משנה סנהדרין ד, ד", MN(73, 4, 4)], ["משנה סנהדרין א, ו", MN(73, 1, 6)]] },
'''
    u = u[:a] + PLACE + u[b:]
    # the row of the place
    ROW = '''        // 1.3.7 (as the Second Temple model 1.9.5; the user: "9. מקומן אפשרות ג"): the place of the lesser court "על פתח הר הבית" -
        // ctx.shared.lesserPlace (30-courts.js). Every quote from the user's library (Sanhedrin 11:2: book 73, line 78; Rashi 86b:
        // book 2180, line 4632; Rambam Sanhedrin 1:3: book 375, line 5; Meiri 17a: book 2214, line 190).
        if (ctx.shared.lesserPlace) {
          const LP_M = "לשון המשנה (סנהדרין יא, ב): 'שלשה בתי דינין היו שם, אחד יושב על פתח הר הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית'.\\n";
          const lpFly = (k) => { openPill20("crt-lesser-roofs"); const L = ctx.shared.lesserCourts || {}, p = (k === "mount" ? L.mount : L.har) || L.azarah || [114, 3, -15]; fly([p[0], p[1] + 31, p[2] + 24], [p[0], p[1] + 2, p[2]]); };
          opRow({
            id: "lesserPlace", short: "מקום הסנהדראות הקטנות", cardFly: true, chips: { rashi: "רש״י: אצל שער החצר החיצונה", mount: "כפשט המשנה: אצל שער הר הבית" },
            cap: "מקום שתי הסנהדראות הקטנות",
            refs: [["משנה סנהדרין יא, ב", { book: 73, index: 78 }], ["רש״י סנהדרין פו:", { book: 2180, index: 4632 }], ["רמב״ם סנהדרין א, ג", { book: 375, index: 5 }], ["מאירי סנהדרין יז.", { book: 2214, index: 190 }]],
            options: [
              ["rashi", "רש״י — אצל השער המזרחי של החצר החיצונה", LP_M + "רש״י (פו:): 'אחד יושב על פתח הר הבית — הוא שער המזרחי שלפנים מן החיל לפני עזרת נשים'; 'ואחד יושב למעלה הימנו — כשעברו עזרת נשים ובאין לפני עזרת ישראל'.\\nבמודל (**ברירת המחדל**): בית הדין שעל פתח הר הבית — בלשכה מחוץ לשער המזרחי של החצר החיצונה, מצפון למעלותיו; ובית הדין שעל פתח העזרה — בלשכה שבתוך החצר החיצונה, לפני השער המזרחי של חצר הכהנים, מצפון לדרך אל השער. המשנה ורש״י מדברים בלשון בית שני; העתקת הדבר לחצרות בית ראשון, ומקומן המדויק של הלשכות — בחירת מודל.", null],
              ["mount", "כפשט המשנה — אצל שער הר הבית", LP_M + "הרמב״ם (סנהדרין א, ג): 'ועוד מעמידין שני בתי דינין של עשרים ושלשה עשרים ושלשה אחד על פתח העזרה ואחד על פתח הר הבית'. המאירי (סנהדרין יז.): 'וסנהדרי קטנה היו בירושלים שנים אחד על פתח העזרה ואחד על פתח הר הבית'.\\nבשיטה זו 'פתח הר הבית' כפשוטו — אצל שער הר הבית עצמו, ולא כפירוש רש״י. מי שפירש כך במפורש — לא אומת בספרייה.\\nבמודל: בית הדין **בלשכה שבתוך הר הבית, אצל השער המזרחי**, מצפון לדרך. איזה משערי הר הבית — לא נתפרש במשנה; בחירת מודל. בית הדין שעל פתח העזרה נשאר לפני שער חצר הכהנים. מקומן המדויק של הלשכות — בחירת מודל.", null]
            ],
            current: ctx.shared.lesserPlace.mode,
            onPick: (k) => { ctx.shared.lesserPlace.set(k); },
            fly: lpFly
          });
        }
'''
    u = rep(u, '''        // 8. the House of the Forest of Lebanon (I Kings 7:2-6) - ctx.shared.forestHouse (60-palace.js)
''', ROW + '''        // 8. the House of the Forest of Lebanon (I Kings 7:2-6) - ctx.shared.forestHouse (60-palace.js)
''', 'row')
    # the gates' card: the steps
    u = rep(u, '''במודל: לפני השער המזרחי **שש מעלות מוקפות כחצי גורן** — כדברי המאירי על חמש עשרה המעלות של בית שני (מדות ב, ה): 'מוקפות כחצי גורן, שהתחתונה קצרה, והשניה עודפת לה משני קצותיה, וכן שלישית לשניה'. המעלות עצמן, מספרן וצורתן בבית ראשון — בחירת מודל.",''',
            '''במודל: לפני השער המזרחי **שש מעלות מוקפות כחצי גורן**, לאורך פני החצר, בין שתי הלשכות המערביות של החצר החיצונה: התחתונה קצרה, וכל מעלה שמעליה עודפת עליה משני קצותיה — כדברי המאירי על חמש עשרה המעלות של בית שני (מדות ב, ה): 'מוקפות כחצי גורן, שהתחתונה קצרה, והשניה עודפת לה משני קצותיה, וכן שלישית לשניה'; ואורכן — כלשון פסקי הרי״ד שם (סוכה נג.): 'ואורך המעלה היה קל\\"ה אמה כרוחב העזרה מכותל לכותל'. המעלות עצמן, מספרן, צורתן ואורכן בבית ראשון — בחירת מודל.",''',
            'gates-card')
    u = rep(u, '''["מדות ב, ה", MI(2, 5)], ["המאירי מדות ב, ה", { book: 6033, index: 35 }]] },''',
            '''["מדות ב, ה", MI(2, 5)], ["המאירי מדות ב, ה", { book: 6033, index: 35 }], ["פסקי הרי״ד סוכה נג.", { book: 7576, index: 355 }]] },''', 'gates-refs')
    # labels -> the place's card; the rows on the place's card; the walk order
    u = rep(u, '''"סנהדרי קטנה — על פתח הר הבית (סנהדרין יא, ב)": { p: "שתי הסנהדראות הקטנות" },''',
            '''"סנהדרי קטנה — על פתח הר הבית (סנהדרין יא, ב; רש״י)": { p: "שתי הסנהדראות הקטנות" }, "סנהדרי קטנה — על פתח הר הבית, בשער המזרחי (סנהדרין יא, ב)": { p: "שתי הסנהדראות הקטנות" },''', 'labels')
    u = rep(u, '''        "לשכת הגזית": ["sanhedrinRows"], "לשכת הגזית — מקורות מבית שני": ["sanhedrinRows"],   // 1.3.5''',
            '''        "לשכת הגזית": ["sanhedrinRows"], "לשכת הגזית — מקורות מבית שני": ["sanhedrinRows"],   // 1.3.5
        "שתי הסנהדראות הקטנות": ["lesserPlace", "sanhedrinRows"],   // 1.3.7''', 'ops-p')
    u = rep(u, '''["seaPlacement", "sanhedrinRows", "slaughterLayout",''', '''["lesserPlace", "seaPlacement", "sanhedrinRows", "slaughterLayout",''', 'want')
    wr('70-ui.js', u)
    print('70-ui.js: patched')
