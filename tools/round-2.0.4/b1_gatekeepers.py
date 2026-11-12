# -*- coding: utf-8 -*-
# B1 1.3.7 - "משמרות השוערים" (I Chr 26:12-18) at the Mishnah's places: a switch, off by default (the user, 11.11.2026: 21:51 "מתג חדש
# אפשרות ב"; 22:06 "ב" - all twenty-one, the three without a place in this model pale). Idempotent (marker GATEKEEPERS_137).
# Edits /home/claude/beit-rishon/src/30-courts.js (the layer, the figures, the labels, the pill) and 70-ui.js (the panel's place + card).
import io, os, shutil
C = '/home/claude/beit-rishon/src/30-courts.js'
U = '/home/claude/beit-rishon/src/70-ui.js'
for f, b in ((C, '/tmp/30-courts.b1.before_gatekeepers.js'), (U, '/tmp/70-ui.b1.before_gatekeepers.js')):
    if not os.path.exists(b):
        shutil.copy(f, b)
BLOCK = r'''
    // ===== GATEKEEPERS_137 - 1.3.7: "משמרות השוערים" (I Chr 26:12-18) AT THE MISHNAH'S PLACES - A SWITCH, OFF BY DEFAULT =====
    // The user (11.11.2026): 21:39, of the lots in Chronicles ("תחפור על זה יותר… המקור הנ"ל מעניין מאוד"); 21:51 "מתג חדש אפשרות ב" - the
    // Levites at the Mishnah's places (Middot 1:1), as the Gemara learns them from the verse (Tamid 27a); 22:06 "ב" - all twenty-one are
    // drawn, and the three whose place the First Temple's model does not have stand PALE at an approximate spot with the label "מקומו
    // בבית ראשון לא נתפרש".
    // The verse (I Chr 26:17-18): "למזרח הלוים ששה לצפונה ליום ארבעה לנגבה ליום ארבעה ולאספים שנים שנים. לפרבר למערב ארבעה למסלה
    // שנים לפרבר". The Gemara (Tamid 27a; the user's library, book 138, lines 29-40): the Mishnah's twenty-one places - "חמשה – על חמשה
    // שערי הר הבית. ארבעה – על ארבע פנותיו מבפנים. חמשה – על חמשה שערי עזרה. וארבעה – על ארבע פנותיו מבחוץ. אחד – בלשכת הקרבן, ואחד –
    // בלשכת הפרוכת, ואחד – אחורי בית הכפורת" - are learned from it; Abaye: "לאספים – שנים", "היאך דפרבר – חד הוה, ואחרינא, בצוותא";
    // "תרי מינייהו לא צריכי שימור" (of the court's seven gates).
    // WHICH PLACE BELONGS TO WHICH SIDE - THE ROSH on Tamid 27a (book 2224, lines 50-58), the only commentator found (11.11.2026) who
    // assigns every number of the verse: EAST six - "שנים בשני פנות הר הבית ואחד על שער מזרח… וכן לעזרת נשים בשתי פינות ואחד בשער
    // נקנור"; NORTH four - "אחד בשער הטדי בהר הבית. ושנים בב' שערי עזרה… ואחד בלשכת הקרבן או בלשכת הפרוכת"; SOUTH four - "שני' בשני
    // שערי חולדה בהר הבית ושנים בשני שערי עזרה", the middle gate of the north and of the south unguarded ("לפי שכל אחד באמצע השניי'
    // היה"); WEST four - "שנים לפנות הר הבית וב' לפנות העזרה". Left of the Mishnah's list: the Mount's west gate, the other chamber and
    // "אחורי בית הכפורת" - and of the verse: the asuppim's two and the parbar; the Rosh does not say which is which (the card says so).
    // The Rambam's five gates (Beit HaBechirah 8:8: "שהרי הכהנים שומרים על שער המוקד ועל שער הניצוץ") cannot be drawn here: this model
    // has no Moked and Nitzotz gates - told in the card. The priests' three places (Beit Avtinas, Beit HaNitzotz, Beit HaMoked) are not
    // in this model either and are not drawn.
    // IN THIS MODEL: the great court stands for "הר הבית" (four gates, one a side - 20-mount.js), the inner court for "העזרה" (seven
    // gates - above), the outer court (החצר החיצונה) for "עזרת נשים". MODEL CHOICES: where exactly each one stands by his gate or
    // corner; "אחורי בית הכפורת" outside the inner court's west wall, on the House's axis; the three pale ones' spots; the figures,
    // the discs under them and the thin beams of light that show them from afar.
    try {
      const gk = new Group();
      gk.name = "gatekeepers";
      gk.visible = false;
      ctx.root.add(gk);
      ctx.layers = ctx.layers || {};
      ctx.layers.gatekeepers = gk;
      const robe = new MeshStandardMaterial({ color: 0xe8dfc8, roughness: 0.85 }), skin = new MeshStandardMaterial({ color: 0xc99a73, roughness: 0.8 });
      const robeP = new MeshStandardMaterial({ color: 0xcfd8e3, roughness: 0.9, transparent: true, opacity: 0.5 });
      const skinP = new MeshStandardMaterial({ color: 0xd9c4b0, roughness: 0.9, transparent: true, opacity: 0.5 });
      const discM = new MeshBasicMaterial({ color: 0xf0b63a, transparent: true, opacity: 0.85, depthWrite: false });
      const discP = new MeshBasicMaterial({ color: 0xaab8c8, transparent: true, opacity: 0.6, depthWrite: false });
      const beamM = new MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0.3, depthWrite: false, fog: false });
      const beamP = new MeshBasicMaterial({ color: 0xc4d0de, transparent: true, opacity: 0.22, depthWrite: false, fog: false });
      const bodyG = new CylinderGeometry(0.28, 0.45, 2.75, 12); bodyG.translate(0, 1.375, 0);
      const headG = new SphereGeometry(0.27, 14, 10); headG.translate(0, 3.02, 0);
      const discG = new CylinderGeometry(2.2, 2.2, 0.06, 28); discG.translate(0, 0.06, 0);
      const beamG = new CylinderGeometry(0.16, 0.16, 30, 8); beamG.translate(0, 18.5, 0);
      const PALE = "מקומו בבית ראשון לא נתפרש";
      const levite = (x, y, z, tag, pale) => {
        const f = new Group();
        f.position.set(x, y, z);
        const b = new Mesh(bodyG, pale ? robeP : robe), h = new Mesh(headG, pale ? skinP : skin);
        b.castShadow = h.castShadow = !pale;
        const d = new Mesh(discG, pale ? discP : discM), bm = new Mesh(beamG, pale ? beamP : beamM);
        for (const m of [d, bm]) { m.userData.noPick = true; m.renderOrder = 2; }
        f.add(b, h, d, bm);
        f.userData.far = [d, bm];
        gk.add(f);
        ctx.labels.push({ text: pale ? tag + " — " + PALE : tag, x, y: y + 5.4, z, size: pale ? 1.5 : 1.3, layer: "gatekeepers" });
      };
      const H0 = LV2.HAR, IN = 7;                                            // seven amot inside the great court's wall
      const hE = CO2.harE - IN, hW = CO2.harW + IN, hN = CO2.harN + IN, hS = CO2.harS - IN;
      const GG = ctx.shared.gates || {};
      const gEz = GG.greatE && typeof GG.greatE.z === "number" ? GG.greatE.z : 0, gWz = GG.greatW && typeof GG.greatW.z === "number" ? GG.greatW.z : 0;
      const gNx = GG.greatN && typeof GG.greatN.x === "number" ? GG.greatN.x : 103, gSx = GG.greatS && typeof GG.greatS.x === "number" ? GG.greatS.x : 103;
      const T_MG = "״על חמשה שערי הר הבית״", T_MC = "״על ארבע פנותיו מבפנים״", T_AG = "״על חמשה שערי עזרה״", T_AC = "״על ארבע פנותיו מבחוץ״";
      const oX = CO2.azE + T / 2 + 1.3, oZ = CO2.azS - 3.5;                  // on the podium's ledge, outside the inner court's east wall
      const nZ = CO2.azN - T / 2 - 3, sZ = CO2.azS + T / 2 + 3, wX = CO2.azW - T / 2 - 3.5;   // on the great court's floor, clear of the ledge
      const gA = CRT_NS_GATES[0], gC = CRT_NS_GATES[CRT_NS_GATES.length - 1], SIDE = CRT_GATE_W / 2 + 3.5;   // the outer two of the three gates
      // EAST - six
      levite(hE, H0, gEz - 9, T_MG); levite(hE, H0, hN, T_MC); levite(hE, H0, hS, T_MC);
      levite(oX, AZ, -(CRT_GATE_W / 2 + 2.5), T_AG); levite(oX, AZ, -oZ, T_AC); levite(oX, AZ, oZ, T_AC);
      // NORTH - four (one of them pale: "בלשכת הקרבן או בלשכת הפרוכת")
      levite(gNx + 9, H0, hN, T_MG); levite(gA + SIDE, H0, nZ, T_AG); levite(gC - SIDE, H0, nZ, T_AG);
      levite(-70, H0, nZ - 0.5, "לשכת הקרבן או לשכת הפרוכת", true);
      // SOUTH - four (one of them pale: the second of the Mount's two southern gates)
      levite(gSx + 9, H0, hS, T_MG); levite(gA + SIDE, H0, sZ, T_AG); levite(gC - SIDE, H0, sZ, T_AG);
      levite(gSx - 80, H0, hS, "השער השני שבדרום", true);
      // WEST - four
      levite(hW, H0, hN, T_MC); levite(hW, H0, hS, T_MC); levite(wX, H0, nZ - 0.5, T_AC); levite(wX, H0, sZ + 0.5, T_AC);
      // the three that are left: the Mount's west gate, behind the House, and the other chamber (pale)
      levite(hW, H0, gWz - 9, T_MG); levite(wX - 1, H0, 0, "״אחורי בית הכפורת״");
      levite(-70, H0, sZ + 0.5, "הלשכה האחרת", true);
      // the verse's words by the sides, and who drew each side by the lot (26:14-16)
      const side = (text, lot, x, z) => {
        ctx.labels.push({ text, x, y: 20, z, size: 7, far: 1500, layer: "gatekeepers" });   // read from the whole Mount's view (70-ui.js: a label's own reach)
        ctx.labels.push({ text: lot, x, y: 15, z: z + 14, size: 4.5, layer: "gatekeepers" });   // read from nearer
      };
      side("״למזרח הלוים ששה״", "״ויפל הגורל מזרחה לשלמיהו״ (דברי הימים א כו, יד)", (CO2.harE + CO2.azE + 135) / 2, -90);
      side("״לצפונה ליום ארבעה״", "״וזכריהו בנו… ויצא גורלו צפונה״ (דברי הימים א כו, יד)", 0, -118);
      side("״לנגבה ליום ארבעה״", "״לעבד אדם נגבה ולבניו בית האספים״ (דברי הימים א כו, טו)", 0, 195);
      side("״לפרבר למערב ארבעה״", "״לשפים ולחסה למערב עם שער שלכת במסלה העולה״ (דברי הימים א כו, טז)", (CO2.harW + CO2.azW) / 2, 140);
      ctx.labels.push({ text: "״ולאספים שנים שנים״ · ״שנים לפרבר״ — שלושת הנותרים", x: (CO2.harW + CO2.azW) / 2, y: 14, z: -112, size: 4.5, layer: "gatekeepers" });
      // from afar the discs and the beams grow with the distance (as the labels do), so that the whole Mount's view shows where they stand
      ctx.animated.push(() => {
        if (!gk.visible) return;
        const cp = ctx.camera.position;
        for (const f of gk.children) {
          const k = Math.min(4.5, Math.max(1, cp.distanceTo(f.position) / 150));
          for (const m of f.userData.far) m.scale.set(k, 1, k);
        }
      });
      ctx.shared.gatekeepers = { get on() { return gk.visible; }, set(v) { gk.visible = !!v; return gk.visible; }, count: gk.children.length };
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({
        id: "crt-gatekeepers",
        label: "משמרות השוערים (דברי הימים א כו)",
        labelOn: "הסתר את משמרות השוערים",
        title: "עשרים ואחד הלויים שבמשמרות השוערים, במקומות המשנה (מדות א, א) כפי שהגמרא לומדת אותם מן הפסוק (תמיד כז.), בחלוקת הרא״ש לרוחות. שלושה בגוון חיוור: מקומם בבית ראשון לא נתפרש.",
        anchor: [CO2.azE + 4, AZ + 30, 0],
        occlude: false,
        get maxDist() { return gk.visible ? 5000 : 320; },
        get: () => gk.visible,
        set: (on) => { gk.visible = !!on; }
      });
    } catch (e) {
      console.warn("[courts] משמרות השוערים skipped", e);
    }
'''
s = io.open(C, encoding='utf-8').read()
if 'GATEKEEPERS_137' in s:
    i0 = s.index('\n    // ===== GATEKEEPERS_137')
    i1 = s.index('console.warn("[courts] משמרות השוערים skipped", e);\n    }\n', i0) + len('console.warn("[courts] משמרות השוערים skipped", e);\n    }\n')
    s = s[:i0] + BLOCK + s[i1:]
    print('30-courts.js: block replaced')
else:
    A = '      if (typeof MNT_WC_SIZE === "number") zone("zoneOuter",'
    assert s.count(A) == 1
    i = s.index(A)
    j = s.index('\n    }\n', i) + len('\n    }\n')
    s = s[:j] + BLOCK.lstrip('\n') + s[j:]
    print('30-courts.js: block inserted')
io.open(C, 'w', encoding='utf-8').write(s)

INFO = ('הפסוקים (דברי הימים א כו, יב–יח), בסדר המשמרות שבימי דוד: ״לאלה מחלקות השערים לראשי הגברים משמרות לעמת אחיהם לשרת בבית ה׳״; '
        '״ויפילו גורלות כקטן כגדול לבית אבותם לשער ושער״. רש״י: ״למי יבוא שער זה ולמי שער זה, למזרח למערב לצפון לדרום, וכן לכל שערים שבעזרה״. '
        'רד״ק: הגורל — ״לא לדעת אי זה מהם קודם, אלא איזה מהם לשער מזרח, ואי זה מהם לשער מערב ודרום וצפון״.\\n'
        'מי עלה בגורל: ״ויפל הגורל מזרחה לשלמיהו וזכריהו בנו יועץ בשכל הפילו גורלות ויצא גורלו צפונה״; ״לעבד אדם נגבה ולבניו בית האספים״; '
        '״לשפים ולחסה למערב עם שער שלכת במסלה העולה משמר לעמת משמר״.\\n'
        'והמניין: ״למזרח הלוים ששה לצפונה ליום ארבעה לנגבה ליום ארבעה ולאספים שנים שנים. לפרבר למערב ארבעה למסלה שנים לפרבר״.\\n'
        'בגמרא (תמיד כז.) למדים מן הפסוק את מקומות המשנה (מדות א, א): ״והלוים בעשרים ואחד מקומות: חמשה – על חמשה שערי הר הבית. ארבעה – על '
        'ארבע פנותיו מבפנים. חמשה – על חמשה שערי עזרה. וארבעה – על ארבע פנותיו מבחוץ. אחד – בלשכת הקרבן, ואחד – בלשכת הפרוכת, ואחד – אחורי '
        'בית הכפורת״. והקשו: ״הני עשרים וארבעה הוו!״ — ותירץ אביי: ״לאספים – שנים״, ו״היאך דפרבר – חד הוה, ואחרינא, בצוותא הוא דאזיל ויתיב '
        'גביה – משום דקאי אבראי״. ״ואיבעית אימא: לעולם עשרים וארבעה, כדכתיב. תלתא מינייהו – דכהנים, ועשרין וחד – דלוים״.\\n'
        '**הרא״ש** (תמיד כז.) מפרש כל מספר שבפסוק. במזרח: ״שנים בשני פנות הר הבית ואחד על שער מזרח… וכן לעזרת נשים בשתי פינות ואחד בשער '
        'נקנור״. בצפון: ״אחד בשער הטדי בהר הבית. ושנים בב\' שערי עזרה… ואחד בלשכת הקרבן או בלשכת הפרוכת״. בדרום: ״שני\' בשני שערי חולדה בהר '
        'הבית ושנים בשני שערי עזרה״ — והשער האמצעי שבצפון ושבדרום בלא שומר: ״תרי מינייהו לא בעי שימור. לפי שכל אחד באמצע השניי\' היה״. '
        'במערב: ״שנים לפנות הר הבית וב\' לפנות העזרה״.\\n'
        'במודל — מתג, כבוי כברירת מחדל: עשרים ואחד הלויים במקומות המשנה, כחלוקת הרא״ש לרוחות. החצר הגדולה היא כנגד ״הר הבית״, החצר הפנימית '
        'כנגד ״העזרה״, והחצר החיצונה כנגד עזרת הנשים. שמונה־עשר עומדים במקומות שיש במודל. שלושה בגוון חיוור ובמקום משוער, ועליהם ״מקומו בבית '
        'ראשון לא נתפרש״: השער השני שבדרום (במודל שער אחד בכל צד), לשכת הקרבן ולשכת הפרוכת. אחרי ארבע הרוחות נשארו במשנה שלושה מקומות — '
        'שער המערב, אחורי בית הכפורת והלשכה האחרת — כנגד ״ולאספים שנים״ ו״לפרבר״ שבפסוק; הרא״ש לא פירש איזה מהם כנגד מה. שלושת מקומות '
        'הכהנים שבמשנה (בית אבטינס, בית הניצוץ ובית המוקד) אינם במודל של בית ראשון. מקומו המדויק של כל לוי, הדמויות, העיגולים וקרני האור '
        '— בחירת מודל.\\n'
        'בקצרה — **הרמב״ם** (בית הבחירה ח, ח) מונה את חמשת שערי העזרה אחרת: ״ועל חמשה שערי העזרה חוץ לעזרה שהרי הכהנים שומרים על שער '
        'המוקד ועל שער הניצוץ״; במודל של בית ראשון אין שערים אלה, ולכן לא צויר לפיו. **האספים:** רש״י — ״מקום ששמו אסופים״; רד״ק — ״והיה זה '
        'הבית לדרום העזרה מבחוץ״; רבנו תם (בפירוש הרא״ש) — ״לאסופים סופי הדלתות״; רבנו גרשום — ״ב\' קיטוניות שנתוספו על הבנין״; המאירי — '
        '״ואספים הוא שם לשכה… ופרבר הוא שם לשכה גם כן״. **הפרבר:** ״כמאן דאמר כלפי בר״ (תמיד כז.). **המניין:** לרבנו תם הלויים שומרים '
        '״בכ״א מקומות מלבד ג\' מקומות ששומרים שם עם הכהנים״.')
ITEM = ('          // GATEKEEPERS_137 - 1.3.7 (the user, 11.11.2026: "מתג חדש אפשרות ב"; "ב"): the gatekeepers\' watches of I Chr 26 at the Mishnah\'s\n'
        '          // places (30-courts.js, ctx.shared.gatekeepers). The place switches them on and they stay on (timed: false) until the pill on\n'
        '          // the model, or "החזר הכל", switches them off. Every quotation as read in the user\'s library (qa/fs/LIB_1111.md).\n'
        '          { t: "משמרות השוערים (דברי הימים א כו)", tg: [103, 0, 82.5], cam: [103, 700, 215],\n'
        '            feature: { key: "gatekeepers", timed: false, isOn: () => !!(ctx.shared.gatekeepers && ctx.shared.gatekeepers.on),\n'
        '              on: () => { if (ctx.shared.gatekeepers) ctx.shared.gatekeepers.set(true); }, off: () => { if (ctx.shared.gatekeepers) ctx.shared.gatekeepers.set(false); } },\n'
        '            tourThen: [{ pos: [0, 250, 150], target: [0, 0, 0] }, { pos: [330, 170, 150], target: [225, 0, 0] }],\n'
        '            info: "' + INFO.replace('"', '\\"') + '",\n'
        '            refs: [["דברי הימים א כו, יג", V(38, 26, 13)], ["דברי הימים א כו, יז", V(38, 26, 17)], ["רש״י דברי הימים א כו, יג", { book: 3664, index: 841 }], '
        '["רד״ק דברי הימים א כו, יג", { book: 3521, index: 686 }], ["רד״ק דברי הימים א כו, טו", { book: 3521, index: 688 }], ["תמיד כז.", { book: 138, index: 29 }], '
        '["הרא״ש, תמיד כז.", { book: 2224, index: 50 }], ["המפרש, תמיד כז.", { book: 2105, index: 70 }], ["רבנו גרשום, תמיד כז.", { book: 2101, index: 26 }], '
        '["מדות א, א", MI(1, 1)], ["רמב״ם בית הבחירה ח, ח", RB(8, 8)], ["המאירי מדות א, א", { book: 6033, index: 6 }]] },\n')
u = io.open(U, encoding='utf-8').read()
if 'GATEKEEPERS_137' in u:
    i0 = u.index('          // GATEKEEPERS_137')
    i1 = u.index('["המאירי מדות א, א", { book: 6033, index: 6 }]] },\n', i0) + len('["המאירי מדות א, א", { book: 6033, index: 6 }]] },\n')
    u = u[:i0] + ITEM + u[i1:]
    print('70-ui.js: place replaced')
else:
    a = u.index('          { t: "שערי חצר הכהנים", tg: [0, 12, 64], cam: [0, 62, 200],')
    b = u.index('          // 1.0.1-K (K.6.5, Yossi): לשכת הגזית', a)
    u = u[:b] + ITEM + u[b:]
    print('70-ui.js: place inserted')
io.open(U, 'w', encoding='utf-8').write(u)
