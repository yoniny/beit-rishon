  // ===== 40-altar.js: מזבח הנחושת (the bronze altar of Solomon) =====
  // II Chr 4:1 "ויעש מזבח נחשת עשרים אמה ארכו ועשרים אמה רחבו ועשר אמות קומתו". User decision: the altar is BRONZE
  // (the verse), not stone. Kings I does not describe the altar (only "המזבח" in 8:64, 9:25), so every detail beyond
  // 20 x 20 x 10 is a model choice, marked below. Placement (CO.xAltarW/E, CO.altarZ): west face 26.5 amot east of the ulam front
  // (1.3.2, the user: "צריך להתחיל כ־26 עד 27 אמה מן האולם... ואז יש לך מקום למכונות"; the yesod 24.5; until 1.3.1 21, after Middot 5:1),
  // centred on the house axis. NOTE: x numbers in the comments below that predate 1.3.2 are 5.5 short (the code reads CO).
  // The ramp (כבש) and the horns (קרנות) are MODEL CHOICES: no First Temple verse mentions them; the ramp follows
  // Ex 20:23 "ולא תעלה במעלת על מזבחי" (no steps) with the size of Middot 3:3 (32 x 16) as a convention, on the SOUTH
  // (Middot 3:3 "וכבש היה לדרומו של מזבח" as a convention; user decision); the horns follow Ex 27:2 "ועשית קרנתיו על ארבע פנתיו",
  // plan 1 x 1 after Middot 3:1 "מקום הקרנות אמה מזה ואמה מזה", height 1 as a model choice (cf. the altar baraita, Zevachim 54a).
  // Pyre, logs, flames, smoke and the fire lights are copied from the Second Temple module (ref-altar-bayit2.js) with y adapted.
  // 1.0.2 (the user's items 7, 8):
  //   - השיתין, a completion (השלמה) from the Mishnah: Middot 3:2-3, Rambam Beit HaBechira 2:11-12 describe the Second Temple's altar;
  //     Sukkah 49a "שיתין מששת ימי בראשית נבראו" and 53a "בשעה שכרה דוד שיתין" are why they belong to the First Temple too. Two
  //     openings and the marble slab with its ring in the court floor at the south-west corner (see the section below).
  //     Contract: ctx.shared.shitin = { title, info, refs, fly: "shitin" }; ctx.shared.flyPoints.shitin; the label "השיתין".
  //   - the look of the altar, a switch: ctx.shared.altarLook = { get(), set(key), current, keys, options: [{key, label}], title,
  //     info: {stone, abarbanel}, refs: {stone, abarbanel} }, default "stone" (1.0.1-L's look); "abarbanel" = Abarbanel on I Kings 8:64
  //     "ועם היותו מזבח אבנים כמו שצותה התורה, הנה קראו מזבח הנחשת, לפי שהיה מצופה נחשת": the body, lip, horns and band in bronze
  //     (since the add-on below: the body, the sovev, the lip, the horns and the yesod; the band is gone);
  //     the ramp (and the small ramps), the red line, the fire and the ash stay. Refs are [label, {book, index}] as ui_REFS in 70-ui.js.
  // 1.0.2 (add-on, the user, after Tosafot Zevachim 61b): THE YESOD, THE SOVEV, THE RED LINE AND THE TWO SMALL RAMPS - completions
  //   (השלמות) from the Mishnah and the Gemara, which describe the Second Temple's altar; every altar needs a yesod (Zevachim 62a
  //   "שכל מזבח שאין לו קרן וכבש ויסוד וריבוע – פסול"), so Solomon's had one. See the section "the profile" below for the sources
  //   of each measure and for where the verse's 20 x 20 sits. The old band (כרכוב) at half height is gone: it is the sovev now
  //   (Zevachim 62a, R. Yose b. R. Yehuda "זה הסובב"), and the middle of the height is the red line's.
  //   Contract: ctx.shared.altarRamps = { title: "הכבשים הקטנים", current, keys, get(), set(key), options: [{key, label}],
  //   info: {rashi, tosafot}, refs: {rashi, tosafot}, fly: "mizbeachRamps" }, default "rashi" (Rashi Zevachim 62b, 64a: the small ramp
  //   to the sovev only east of the big ramp); "tosafot" (Tosafot Zevachim 64a, Tosafot Yom Tov on Zevachim 6:3, Mishneh LaMelech
  //   on Beit HaBechira 2:14) adds the one west of it; get/set do not use `this`, an unknown key changes nothing.
  //   ctx.shared.altarProfile = { yesod, sovev, redLine: {title, info, refs} } (the texts of the three small labels);
  //   ctx.layers.altarProfile: their layer, shown by this module only while the camera is within 130 amot of the altar (not a
  //   panel layer, like 45-vessels.js's mechonaWash). Fly points: mizbeachSW (the south-west corner), mizbeachRamps (the small ramps).

  // 1.0.0: the fire on the altar: logs are instanced cylinders; the flames are animated cones; the smoke is 7 rising sprites.
  async function buildAltar(ctx) {
    const H2 = ctx.H, M2 = ctx.M, LV2 = ctx.LV, CO2 = ctx.CO;
    const g = new Group();
    g.name = "altar";
    ctx.root.add(g);
    const altLabel0 = ctx.labels.length;   // 1.2.0: the labels this module pushes (moved with the altar, altarPlace below)

    const F = LV2.AZ;                                  // court floor, y 6 (inner court level, model choice: see 10-core.js)
    const S = CO2.ALTAR;                               // 20: II Chr 4:1 "עשרים אמה ארכו ועשרים אמה רחבו"
    const AH = CO2.ALTAR_H;                            // 10: II Chr 4:1 "ועשר אמות קומתו"
    const ACX = (CO2.xAltarW + CO2.xAltarE) / 2;       // 55: x 45..65 (1.3.2: west face 26.5 east of the ulam front; was 21, Middot 5:1)
    const ACZ = CO2.altarZ;                            // 0: on the house axis (model choice)
    const TOP = F + AH;                                // 16: the top surface of the altar

    // materials: bronze body (II Chr 4:1; big bronze surface -> roughness .45 per SPEC), darker bronze for the band,
    // bronze-tinted stone for the ramp (model choice: the ramp is not in the verses, so it is not made part of the bronze casting)
    const BR = M2.altarStone.clone();   // 1.0.1-L (the user: a stone altar in colour; the name stays): was M2.bronze
    BR.roughness = 0.9;
    const BRD = M2.altarStone.clone();
    BRD.color.set(0xb0a58e);
    BRD.roughness = 0.95;
    const AS = M2.altarStone.clone();
    AS.color.set(0xbfb39c);
    // 1.0.2: Abarbanel's look - stone plated with bronze (Abarbanel on I Kings 8:64 "לפי שהיה מצופה נחשת"). A clone of M.bronze
    // (10-core.js: metalness 0.95 rendered the shaded faces black); rendered, M.bronze's 0.75 still left the north and west faces
    // almost black on a body this big, so metalness 0.55 with a stronger warm emissive here (checked in a render); roughness .5;
    // the band a darker bronze as in 1.0.0 (model choice)
    const PL = M2.bronze.clone();
    PL.metalness = 0.55;
    PL.roughness = 0.5;
    PL.emissive.set(0x4a2610);
    PL.emissiveIntensity = 0.55;
    const PLD = PL.clone();
    PLD.color.set(0x8f5f30);
    PLD.emissiveIntensity = 0.4;
    // 1.0.2 (add-on): bandParts now holds the yesod (the darker tone sets the lowest step apart from the body; model choice)
    const bodyParts = [], bandParts = [];   // the meshes the look switch re-dresses (body, sovev, lip, horns / yesod); the ramps are not among them

    // 1.3.2 (the user: "תוסיף שיטת ר' יוסי"): the body of the verse's altar (20 x 20 with the yesod and the sovev round it) is in defG; R. Yose's
    // reading - "בתחילה בימי שלמה לא היה אלא כ"ח כונס ועולה יסוד וסובב ומקום קרנות ומקום הילוך עד שהיה מקום המערכה כ' על כ'" (Rashi
    // Zevachim 61b; Middot 3:1) - is yoseG, built after the ramp; ctx.shared.altarYose swaps them, the ramps and the shitin
    const defG = new Group();
    g.add(defG);
    // --- the body: 20 x 20 x 10, y 6..16 (II Chr 4:1) ---
    bodyParts.push(H2.box(defG, S, AH, S, BR, ACX, F, ACZ));

    // --- 1.0.2 (add-on): THE PROFILE - the yesod, the sovev and the red line (completions from the Mishnah, Middot 3:1) ---
    // Middot 3:1 "עלה אמה וכנס אמה, זה היסוד... עלה חמש וכנס אמה, זה הסובב... וחוט של סקרא חוגרו באמצע, להבדיל בין הדמים העליונים
    // לדמים התחתונים. והיסוד היה מהלך על פני כל הצפון ועל פני כל המערב, ואוכל בדרום אמה אחת ובמזרח אמה אחת" (the Second Temple).
    // WHERE THE VERSE'S 20 x 20 SITS: for Rashi it is the place of the pyre - Rashi Zevachim 61b (book 2191, line 2952) "בתחילה בימי שלמה
    // לא היה אלא כ"ח כונס ועולה יסוד וסובב ומקום קרנות ומקום הילוך עד שהיה מקום המערכה כ' על כ'" (R. Yose in Middot 3:1; also Rashi
    // 59b, line 2871, and Malbim on II Chr 4:1 "היינו מקום המערכה היה עשרים על עשרים"), so the foot would be 28 x 28. The model does NOT
    // widen the altar to 28 (x 35.5..63.5 would run into the bases' demonstration route, which passes 2.7 west of the body, 45-vessels.js,
    // and would move the ramp, the shitin and the court's layout): it keeps the 20 x 20 body of 1.0.0-1.0.2 and adds the yesod and the
    // sovev AROUND it, as Rashi measures Moses' altar: Rashi Zevachim 59b (line 2871) "יסוד וסובב לא היו ממעטין בארכו ורחבו לפי שמקיפין
    // ובולטין סביביו". MODEL CHOICE, an open question for the melamed. So: the yesod 24 x 24 at the foot (x 37.5..61.5, z -12..12),
    // 1 high; the wall between the yesod and the sovev 22 x 22 (x 38.5..60.5, z -11..11) up to the sovev at 6 amot (y 12: 1 + 5, Middot
    // 3:1); above it the old body (20 x 20, its top at 10 as before, y 16 - the upper 4 amot, where Rambam Beit HaBechira 2:8-9 has 3,
    // are kept so as not to move the top, the fire and the ramp; model choice).
    // THE YESOD'S RUN IN THE FIRST TEMPLE: Zevachim 53b (book 130, lines 1865-1866) "וקרן מזרחית דרומית לא היה לה יסוד. מאי טעמא? אמר
    // רבי אלעזר: לפי שלא היתה בחלקו של טורף"; Tosafot Zevachim 61b (book 1936, line 654), the whole dibur: R. Tam's question
    // "דמסתמא בבית ראשון לא היה יסוד לקרן דרומית מזרחית", and the conclusion, with Rashi's reading (they added four amot on the south and
    // the west), "ובבית ראשון היה להם יסוד לדרום שהיה משוך בחלקו של טורף חוץ מרוח מזרחית שלא נשתנה שהיה בלא יסוד (עד) חלקו של
    // יהודה כמו בבית שני", and "אף בבית ראשון לא חשיב קרן דרומית קרן כיון דלא הוה ליה יסוד משני צדדין כגון בצד מזרח". So the yesod
    // runs the whole north, the whole west and the whole south (to the end of the south face, x 60.5), and on the east only the one
    // amah at the north-east corner, as in the Second Temple ("ואוכל... במזרח אמה אחת"; Rashi 53b, line 2590: the east strip "כלה
    // בסמוך לקרן אמה"; read here as the amah beyond the north run's corner square, z -11..-10, model choice): the south-east corner
    // has no yesod on its east side. Under the ramp the yesod runs on (Rashi 54a, line 2605: "ויש תחתיו כניסת יסוד המזבח").
    // THE BAND (כרכוב, 1.0.0, at half the height after Ex 27:5) is reconciled, not doubled: Zevachim 62a (line 2109) "איזהו כרכוב?...
    // רבי יוסי ברבי יהודה אומר: זה הסובב"; Rashi there (line 2987, of Moses' altar) "סביב הקיר משעלה שש אמות גובה... היקף הבליטה
    // קטנה חוגרתו סביב לנוי וזהו סובב" - the band is the sovev now; and the lip at the top is the other כרכוב, "וחד לכהנים דלא
    // נשתרקו" (line 2988 "שפתו היקף מעקה קטן סביב שלא יחליקו"). The middle of the height is the red line's (below).
    const YS = 1;                                      // the yesod: 1 out, 1 high (Middot 3:1 "עלה אמה וכנס אמה")
    const SVH = 6;                                     // the sovev's ledge 6 above the floor: 1 + 5 (Middot 3:1 "עלה חמש וכנס אמה")
    const MID = S + 2;                                 // 22: the wall below the sovev, 1 out of the body all round (the sovev's amah)
    const YO = MID + 2 * YS;                           // 24: the yesod's outline
    const XW = ACX - MID / 2, XE = ACX + MID / 2;      // 44, 66 (1.3.2): the wall's west and east faces
    const ZN = ACZ - MID / 2, ZS = ACZ + MID / 2;      // -11, 11: its north and south faces
    bodyParts.push(H2.box(defG, MID, SVH, MID, BR, ACX, F, ACZ));   // the wall up to the sovev, y 6..12 (the body stands inside it)
    bandParts.push(
      H2.box(defG, YO, YS, YS, BRD, ACX, F, ZN - YS / 2),                     // north, the whole side with both corners: x 37.5..61.5, z -12..-11
      H2.box(defG, YS, YS, MID + YS, BRD, XW - YS / 2, F, ACZ + YS / 2),      // west, the whole side with the south-west corner: z -11..12
      H2.box(defG, MID, YS, YS, BRD, ACX, F, ZS + YS / 2),                    // south, to the end of the face: x 38.5..60.5, z 11..12
      H2.box(defG, YS, YS, 1, BRD, XE + YS / 2, F, ZN + 0.5)                  // east: one amah at the north-east corner, z -11..-10
    );
    // the red line, חוט הסיקרא: "חוגרו באמצע" (Middot 3:1) - at 5 amot, half the altar's 10 (II Chr 4:1), one amah below the sovev as
    // Rambam Beit HaBechira 2:9 "כששה טפחים מסוף הסובב ולמטה"; 0.12 high and 0.02 out of the wall (model choice: thin, but seen from
    // the court); red in both looks
    const RED = new MeshStandardMaterial({ color: 0xa8231b, roughness: 0.7, metalness: 0, emissive: 0x3a0806, emissiveIntensity: 0.6 });
    {
      const RY = F + AH / 2 - 0.06, RT = 0.02, RH = 0.12;
      H2.box(defG, MID + 2 * RT, RH, RT, RED, ACX, RY, ZN - RT / 2);
      H2.box(defG, MID + 2 * RT, RH, RT, RED, ACX, RY, ZS + RT / 2);
      H2.box(defG, RT, RH, MID, RED, XW - RT / 2, RY, ACZ);
      H2.box(defG, RT, RH, MID, RED, XE + RT / 2, RY, ACZ);
    }

    // --- a lip 0.5 high and 0.5 thick around the top edge (model choice; cf. the כרכוב of Ex 27:5) ---
    // The south lip is interrupted where the ramp meets the altar (x 41.5..57.5, model choice).
    {
      const LIP = 0.5;
      bodyParts.push(
        H2.box(defG, S, LIP, LIP, BR, ACX, TOP, ACZ - S / 2 + LIP / 2),                     // north
        H2.box(defG, 2, LIP, LIP, BR, CO2.xAltarW + 1, TOP, ACZ + S / 2 - LIP / 2),         // south, west stub (x 39.5..41.5)
        H2.box(defG, 2, LIP, LIP, BR, CO2.xAltarE - 1, TOP, ACZ + S / 2 - LIP / 2),         // south, east stub (x 57.5..59.5)
        H2.box(defG, LIP, LIP, S - 2 * LIP, BR, CO2.xAltarE - LIP / 2, TOP, ACZ),           // east
        H2.box(defG, LIP, LIP, S - 2 * LIP, BR, CO2.xAltarW + LIP / 2, TOP, ACZ)            // west
      );
    }

    // --- four horns 1 x 1 x 1 at the corners (model choice after Ex 27:2; plan after Middot 3:1 "מקום הקרנות אמה מזה ואמה מזה";
    // height 1 a model choice after the altar baraita, Zevachim 54a) ---
    for (const sx of [-1, 1]) for (const sz of [-1, 1])
      bodyParts.push(H2.box(defG, 1, 1, 1, BR, ACX + sx * (S / 2 - 0.5), TOP, ACZ + sz * (S / 2 - 0.5)));

    // (1.0.2 add-on: the band (כרכוב) that stood here at half the height, y 10.75..11.25, 0.2 out of the body, is now the sovev - see
    // "the profile" above; it would have been inside the wall below the sovev anyway.)

    // (No bronze net / מכבר: Ex 27:4-5 describes the Tabernacle altar; SPEC 5 lists body, lip, horns, band, ramp and fire only.)

    // --- the ramp (כבש) on the SOUTH: 32 long x 16 wide (Middot 3:3 as a convention; Ex 20:23: a ramp, not steps; model choice),
    // from the court floor at z 42 up to the altar top (y 16) at z 10, x 41.5..57.5 ---
    // 1.0.2 (add-on): its upper two amot now float over the yesod and the sovev - Zevachim 62b (book 130, line 2131) "נמצא פורח אמה על
    // יסוד ואמה על סובב"; Rambam Beit HaBechira 2:13 "והיה אוכל בארץ שלשים אמה מצד המזבח. ופורח ממנה אמה על היסוד ואמה על הסובב.
    // ואויר מעט היה מפסיק בין הכבש למזבח" - so 30 on the floor (z 12..42) and 32 in all, as Middot 3:3; and it no longer runs into the
    // body: Rashi Zevachim 62b "שלא היה ראש הכבש נוגע במזבח אלא אויר מעט מפסיק בינתיים". The underside follows the altar's steps (over
    // the sovev at 6, over the yesod at 1) with the same small air; the slope of the top is unchanged.
    const GAP = 0.04;                                  // "אויר מעט" / "מלא נימא", drawn 0.04 so that it can be seen up close (model choice)
    const RTOP = (z) => (AH - 0.02) * (42 - z) / 32;   // the ramp's top over the floor at z (0.02 below the altar top at z 10, as 1.0.0)
    // a solid built on a profile in the (z, height) plane, extruded over x xa..xb (the ramp's own method: local u -> world z, depth -> -x)
    const prism = (xa, xb, pts, mat, parent) => {   // 1.3.2: parent - the group of the reading (rampDefG / rampYoseG)
      const sh = new Shape();
      sh.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
      sh.closePath();
      const geo = new ExtrudeGeometry(sh, { depth: xb - xa, bevelEnabled: false });
      geo.rotateY(-Math.PI / 2);
      geo.translate(xb, F, 0);
      const m = new Mesh(geo, mat);
      m.castShadow = m.receiveShadow = true;
      (parent || g).add(m);
      return m;
    };
    const rampDefG = new Group(), rampYoseG = new Group();
    rampYoseG.visible = false;
    g.add(rampDefG);
    g.add(rampYoseG);
    // 1.3.5 (the user, 10.11.2026 22:12, of the three readings built in the Second Temple: "אפשרות 3"): THE AIR BETWEEN THE RAMP AND THE
    // ALTAR - three readings, each a whole prism of its own (no seam), switched by ctx.shared.rampGap.set("hair" | "tosafot" | "chaim"):
    //  "hair" (the default, as before): "מבדל מן המזבח מלא חוט השערה" (Rashi Shemot 27:5; book 3692, line 1912), "ואויר מעט" (Rambam 2:13);
    //  "tosafot" (Zevachim 62b d"h אויר קרקע; book 1936, line 663): "אבל הכא בעינן אויר גדול וניכר" - half an amah, over the sovev (the
    //   measure - a model choice);
    //  "chaim" (Tosafot Zevachim 87b; line 949): "יש אויר מפסיק יותר מכדי אמה סובב, כדי שיהא אויר קרקע מפסיקו". In the First Temple the
    //   yesod ran along the south too (Tosafot 61b, above), so the ground shows only past the sovev's amah AND the yesod's: two amot and
    //   a quarter (the user's choice). There the ramp's head is a plain upright face on the floor.
    // The foot stays in its place and the slope is the same: the head only ends earlier (and lower).
    const RAMP_GAPS = { hair: GAP, tosafot: 0.5, chaim: 1 + YS + 0.25 };
    const rampMain = {};
    // zf - the altar's upper face; zw - the face of the wall below the sovev; foot - the ramp's foot; top(z) - its top over the floor
    const mainRamp = (grp, zf, zw, foot, top) => {
      const out = {};
      for (const k in RAMP_GAPS) {
        const zh = zf + RAMP_GAPS[k];
        const pts = zh >= zw + YS + GAP
          ? [[zh, 0], [foot, 0], [zh, top(zh)]]
          : [[zw + YS + GAP, 0], [foot, 0], [zh, top(zh)], [zh, SVH + GAP], [zw + GAP, SVH + GAP], [zw + GAP, YS + GAP], [zw + YS + GAP, YS + GAP]];
        out[k] = prism(ACX - 8, ACX + 8, pts, AS, grp);   // Middot 3:3 "שלשים ושתים על רחב שש עשרה" (convention)
        out[k].name = "rampMain_" + k;
        out[k].visible = k === "hair";
      }
      return out;
    };
    // z 10.04: the end at the top; z 11.04 over the sovev; z 12.04 over the yesod; z 12.04..42 on the floor
    rampMain.def = mainRamp(rampDefG, ACZ + S / 2, ZS, 42, RTOP);

    // --- 1.0.2 (add-on): THE TWO SMALL RAMPS (כבשים קטנים) - Zevachim 62b (book 130, line 2129) "שני כבשים קטנים יוצאין מן הכבש,
    // שבהן פונים ליסוד ולסובב; ומובדלין מן המזבח מלא נימא"; Rambam Beit HaBechira 2:14. Rashi there (book 2191, line 3022): "אותו
    // שפונין בו לסובב יצא במזרחו של כבש לימין ויוצא ומתחיל בשפולו של כבש ונמשך ועולה באלכסון עד שמגיע לסובב והפונה ליסוד יוצא
    // למערבו... ומתחיל לצאת בשיפולו של כבש רחוק מן המזבח כדי שיהא נוח לשפע ולירד ליסוד". Built: each leaves the big ramp where its
    // top is 2 amot over the floor (z 35.6, "בשפולו של כבש", model choice), along its side, 1.25 wide (model choice); the one to the
    // sovev rises to the sovev (6 amot) and floats over the yesod, the one to the yesod comes down to the yesod (1 amah); both end a
    // hair (GAP) from the altar. THE TWO READINGS (ctx.shared.altarRamps): Rashi Zevachim 64a (line 3089) "אבל לצד המערב אין לו
    // [כבש] לפנות לסובב וצריך לעלות על ראש המזבח ועומד בדרומה של קרן" - only the two; Tosafot Zevachim 64a (book 1936, line 681)
    // "וכשהיה מגיע לקרן מערבית דרומית היה צריך לחזור על עקיבו ולכך נראה דהיה שם כבש" - a third, to the sovev, west of the big ramp;
    // Tosafot Yom Tov on Zevachim 6:3 (book 945, line 183) answers why the Gemara counts two: "שאותו כבש עצמו היה רחב ומקצת ממנו מוגבה
    // ועולה עד על הסובב גם כן" - so it is drawn as one wide ramp beside the yesod's, the outer half raised (Mishneh LaMelech on Beit
    // HaBechira 2:14, book 4606, line 25, sets out the dispute). (Tosafot Yom Tov on Middot 3 was read, book 948: it does not speak of
    // the small ramps.) The small ramps are stone like the big one in both looks.
    const SRW = 1.25;                                  // the width of a small ramp (model choice)
    const BRZ = 42 - 2 * 32 / (AH - 0.02);             // 35.59: where the big ramp's top is 2 amot over the floor
    const RX0 = ACX - 8, RX1 = ACX + 8;                // 41.5, 57.5: the big ramp's west and east faces
    const toSovev = [[ZS + YS + GAP, 0], [BRZ, 0], [BRZ, 2], [ZS + GAP, SVH], [ZS + GAP, YS + GAP], [ZS + YS + GAP, YS + GAP]];
    const smallRamps = {
      // east of the big ramp, up to the sovev (x 57.5..58.75; 0.01 into the big ramp, so that no seam shows)
      sovevEast: prism(RX1 - 0.01, RX1 + SRW, toSovev, AS, rampDefG),
      // west of it, down to the southern yesod (x 40.25..41.5): from 2 amot to the yesod's top, 1 amah
      yesod: prism(RX0 - SRW, RX0 + 0.01, [[ZS + YS + GAP, 0], [BRZ, 0], [BRZ, 2], [ZS + YS + GAP, YS]], AS, rampDefG),
      // Tosafot: the raised half of the same wide western ramp, up to the sovev (x 39..40.25), hidden for Rashi (the default)
      sovevWest: prism(RX0 - 2 * SRW, RX0 - SRW + 0.01, toSovev, AS, rampDefG)
    };
    smallRamps.sovevWest.visible = false;
    for (const [k, m] of Object.entries(smallRamps)) m.name = "smallRamp_" + k;
    // 1.3.2: R. YOSE'S ALTAR - the yesod 28 (z +-14), the wall below the sovev 26 (to 6 amot), above it 24 up to the top (16), the horns
    // and the priests' walk round the place of the pyre, 20 x 20 - the verse's measure (Rashi Zevachim 61b; Malbim on II Chr 4:1 "היינו
    // מקום המערכה היה עשרים על עשרים"). Centred where the verse's altar is (model choice); the yesod's run as there. Its ramp is the same
    // 32 x 16 (Middot 3:3), its top at the top's south face (z 12) - so its foot is at z 44 - and the small ramps with it.
    const yoseG = new Group();
    yoseG.visible = false;
    g.add(yoseG);
    const YT = 24, YM = 26, YY = 28, YZN = ACZ - YM / 2, YZS = ACZ + YM / 2, YXW = ACX - YM / 2, YXE = ACX + YM / 2;
    {
      bodyParts.push(H2.box(yoseG, YM, SVH, YM, BR, ACX, F, ACZ), H2.box(yoseG, YT, AH - SVH, YT, BR, ACX, F + SVH, ACZ));
      bandParts.push(
        H2.box(yoseG, YY, YS, YS, BRD, ACX, F, YZN - YS / 2),
        H2.box(yoseG, YS, YS, YM + YS, BRD, YXW - YS / 2, F, ACZ + YS / 2),
        H2.box(yoseG, YM, YS, YS, BRD, ACX, F, YZS + YS / 2),
        H2.box(yoseG, YS, YS, 1, BRD, YXE + YS / 2, F, YZN + 0.5)
      );
      const RY = F + AH / 2 - 0.06, RT = 0.02, RH = 0.12, RED2 = new MeshStandardMaterial({ color: 0xa8231b, roughness: 0.7, metalness: 0, emissive: 0x3a0806, emissiveIntensity: 0.6 });
      H2.box(yoseG, YM + 2 * RT, RH, RT, RED2, ACX, RY, YZN - RT / 2);
      H2.box(yoseG, YM + 2 * RT, RH, RT, RED2, ACX, RY, YZS + RT / 2);
      H2.box(yoseG, RT, RH, YM, RED2, YXW - RT / 2, RY, ACZ);
      H2.box(yoseG, RT, RH, YM, RED2, YXE + RT / 2, RY, ACZ);
      const LIP = 0.5, h = YT / 2;
      bodyParts.push(
        H2.box(yoseG, YT, LIP, LIP, BR, ACX, TOP, ACZ - h + LIP / 2),
        H2.box(yoseG, h - 8, LIP, LIP, BR, ACX - (h + 8) / 2, TOP, ACZ + h - LIP / 2),
        H2.box(yoseG, h - 8, LIP, LIP, BR, ACX + (h + 8) / 2, TOP, ACZ + h - LIP / 2),
        H2.box(yoseG, LIP, LIP, YT - 2 * LIP, BR, ACX + h - LIP / 2, TOP, ACZ),
        H2.box(yoseG, LIP, LIP, YT - 2 * LIP, BR, ACX - h + LIP / 2, TOP, ACZ)
      );
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) bodyParts.push(H2.box(yoseG, 1, 1, 1, BR, ACX + sx * (h - 0.5), TOP, ACZ + sz * (h - 0.5)));
      // its ramps: the same profiles, 2 further south
      const YRT = (z) => (AH - 0.02) * (44 - z) / 32, YBRZ = 44 - 2 * 32 / (AH - 0.02);
      rampMain.yose = mainRamp(rampYoseG, ACZ + YT / 2, YZS, 44, YRT);   // 1.3.5: the three readings of the air (above)
      const ySov = [[YZS + YS + GAP, 0], [YBRZ, 0], [YBRZ, 2], [YZS + GAP, SVH], [YZS + GAP, YS + GAP], [YZS + YS + GAP, YS + GAP]];
      smallRamps.yoseSovevEast = prism(RX1 - 0.01, RX1 + SRW, ySov, AS, rampYoseG);
      smallRamps.yoseYesod = prism(RX0 - SRW, RX0 + 0.01, [[YZS + YS + GAP, 0], [YBRZ, 0], [YBRZ, 2], [YZS + YS + GAP, YS]], AS, rampYoseG);
      smallRamps.yoseSovevWest = prism(RX0 - 2 * SRW, RX0 - SRW + 0.01, ySov, AS, rampYoseG);
      smallRamps.yoseSovevWest.visible = false;
    }
    // 1.3.5 (the user, of the kuntres' author's note 9 - "היסוד כבית קיבול"; in both houses): THE YESOD - A RECEPTACLE. Rashi on Shemot 29:12
    // (book 3692, line 2101): "אל יסוד המזבח - כמין בליטת בית קבול עשוי לו סביב סביב, לאחר שעלה אמה מן הארץ" - a low rim on the outer edge of
    // the yesod's top wherever the yesod runs (not under the ramps, which float a hair over it), in each reading of the altar. Its
    // measures (0.14 high, 0.1 thick) - a model choice. (The Second Temple's small ledge at the south-east corner, Rashi Zevachim 54a,
    // is not here: in the First Temple the yesod ran along the south - Tosafot Zevachim 61b, above.)
    {
      const RIM = 0.14, RT = 0.1, yr = F + YS;
      const yesodRim = (grp, xw, xe, zn, zs) => {   // the faces of the wall below the sovev: west, east, north, south
        const rim = (w, d, x, z) => bandParts.push(H2.box(grp, w, RIM, d, BRD, x, yr, z));
        rim(xe - xw + 2 * YS, RT, (xw + xe) / 2, zn - YS + RT / 2);                              // the north edge, corner to corner
        rim(RT, zs - zn + 2 * YS - 2 * RT, xw - YS + RT / 2, (zn + zs) / 2);                     // the west edge
        rim(RX0 - 2 * SRW - (xw - YS), RT, (xw - YS + RX0 - 2 * SRW) / 2, zs + YS - RT / 2);     // the south edge, west of the ramps
        rim(xe - (RX1 + SRW), RT, (RX1 + SRW + xe) / 2, zs + YS - RT / 2);                       // the south edge, east of the ramps
        rim(RT, YS - RT, xe - RT / 2, zs + (YS - RT) / 2);                                       // the south run's east end
        rim(RT, 2 * YS - RT, xe + YS - RT / 2, zn + RT / 2);                                     // the east amah: its outer edge
        rim(YS - RT, RT, xe + (YS - RT) / 2, zn + YS - RT / 2);                                  // and its south end
      };
      yesodRim(defG, XW, XE, ZN, ZS);
      yesodRim(yoseG, YXW, YXE, YZN, YZS);
    }
    // 1.3.5 (the user, of the kuntres, point 10: "חריצין"; as in the Second Temple): THE THREE ROVDIN - R. Hai Gaon (Beit Yosef OC 123; book
    // 3900, line 2000): "ובין כבש למזבח היו שלש רובדין של אבן, ויורד בהם ג' פסיעות על עקב"; Binyan Tzion 12 (book 5791, lines 50-51): one
    // where the ramp floats over the sovev, one where it floats over the yesod, one over the ground. Three dark slots 0.2 wide on the
    // EAST half of the ramp's head (the kuntres' drawing), in the middle of each of the three amot from the altar's face. Their width,
    // depth and places - model choices.
    {
      const gm = new MeshBasicMaterial({ color: 0x120e09 });
      const slots = (grp, z0, top) => {   // z0 - the altar's upper face; top(z) - the ramp's top over the floor at z
        const sg = new Group();
        sg.name = "rovdin";
        grp.add(sg);
        for (const dz of [0.5, 1.5, 2.5]) {
          const b = new Mesh(new BoxGeometry(8.04, 0.5, 0.2), gm);
          b.position.set(ACX + 4.02, F + top(z0 + dz) - 0.235, z0 + dz);
          b.rotation.x = Math.atan2(AH - 0.02, 32);
          b.userData.noPick = true;
          b.name = "rovdinSlot";
          sg.add(b);
        }
        return sg;
      };
      const rov = [slots(rampDefG, ACZ + S / 2, RTOP), slots(rampYoseG, ACZ + YT / 2, (z) => (AH - 0.02) * (44 - z) / 32)];
      // the air's reading (RAMP_GAPS, above): the prism of the reading in each altar, and the slots move with the ramp's head
      ctx.shared.rampGap = {
        mode: "hair", keys: Object.keys(RAMP_GAPS),
        set(m) {
          this.mode = Object.prototype.hasOwnProperty.call(RAMP_GAPS, m) ? m : "hair";
          for (const r of [rampMain.def, rampMain.yose]) if (r) for (const k in r) r[k].visible = k === this.mode;
          const d = RAMP_GAPS[this.mode] - RAMP_GAPS.hair;
          for (const sg of rov) sg.position.set(0, -(AH - 0.02) * d / 32, d);
          return this.mode;
        }
      };
      ctx.shared.flyPoints = ctx.shared.flyPoints || {};
      // from the east, close, a little over the top: the ramp's head, the air and the altar's face side by side (follows the altar's place)
      ctx.shared.flyPoints.rampGap = { pos: [ACX + 17.5, F + AH + 3.2, ACZ + S / 2 + 1.6], target: [ACX + 3, F + AH - 1.4, ACZ + S / 2 + 1.1] };
    }
    ctx.layers = ctx.layers || {};
    ctx.layers.altarDefG = defG;
    ctx.layers.altarYoseG = yoseG;

    // --- 1.0.2: השיתין at the south-west corner (a completion from the Mishnah; the Mishnah describes the Second Temple's altar) ---
    // Middot 3:2 "ובקרן מערבית דרומית היו שני נקבים, כמין שני חטמין דקין, שהדמים הנתנין על יסוד מערבי ועל יסוד דרומי, יורדין בהן
    // ומתערבין באמה, ויוצאין לנחל קדרון"; Rambam Beit HaBechira 2:11 "והן הנקראין שיתין". Middot 3:3 "למטה ברצפה באותה הקרן, מקום
    // היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה, שבו יורדין לשית ומנקין אותו" (Rambam 2:12). They belong to the First
    // Temple too: Sukkah 49a "שיתין מששת ימי בראשית נבראו", Sukkah 53a "בשעה שכרה דוד שיתין".
    // WHERE THE TWO HOLES SIT: in Solomon's days the pit was not inside the altar - Rashi on Zevachim 61b "ובימי שלמה היה כמין בור כרוי אצל המזבח באותה זוית לירד הנסכים בתוכו ויורדין מן
    // המזבח ולרצפה ושותתין שם" (the returning exiles took it into the altar; Zevachim 61b "שיתין הוסיפו... מעיקרא סבור מזבח
    // אדמה שהוא אטום באדמה"). So the two openings are in the court FLOOR at the foot of the corner, not in the altar: one by the
    // west face and one by the south face (after Yachin on Middot 3:2, one hole for the west side's blood and one for the south
    // side's) - their place, shape (thin ovals, "חטמין דקין") and size are model choices. The marble slab 1 x 1 (Middot 3:3) lies in
    // the floor diagonally off the same corner, with its ring (bronze like the slaughter rings, model choice). The pit itself is
    // under the floor and is not drawn.
    // 1.0.2 (add-on): the yesod now covers the spot of round M (the corner of the body, x 39.5, z 10), so the openings and the slab moved
    // to the foot of the YESOD's south-west corner (x 37.5, z 12) - still in the floor beside the altar, as Rashi has it; and Middot 3:2
    // "שהדמים הנתנין על יסוד מערבי ועל יסוד דרומי, יורדין בהן" - the blood runs off the west and the south yesod into them. The slab is
    // no longer diagonal off the corner but south of it (x 37.05..38.15, z 12.55..13.65): diagonal it would lie under the bases' route
    // (x <= 36.7 there, 45-vessels.js); the small ramps begin at x 39 (model choices).
    const SHX = ACX - YO / 2, SHZ = ACZ + YO / 2;      // the south-west corner of the yesod: x 37.5, z 12
    const shitinG = new Group();   // 1.3.2: R. Yose's altar moves them to its own corner (2 west, 2 south)
    g.add(shitinG);
    {
      const holeMat = new MeshBasicMaterial({ color: 0x0b0907, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      const hole = (x, z, alongX) => {
        const geo = new CircleGeometry(1, 28);
        geo.rotateX(-Math.PI / 2);
        geo.scale(alongX ? 0.24 : 0.13, 1, alongX ? 0.13 : 0.24);   // 0.48 x 0.26 amah, the long side along the face (model choice)
        const m = new Mesh(geo, holeMat);
        m.position.set(x, F + 0.012, z);
        m.receiveShadow = true;
        m.name = "shitinHole";
        shitinG.add(m);
      };
      hole(SHX - 0.3, SHZ - 0.6, false);              // by the yesod's west face, 0.6 north of the corner
      hole(SHX + 1.1, SHZ + 0.3, true);               // by its south face, 1.1 east of the corner (the small ramps start at x 39)
      // the slab: x 37.1..38.1, z 12.6..13.6, a dark joint 0.05 round it, 0.04 above the floor (model choice, so that it reads)
      const SCX = SHX + 0.1, SCZ = SHZ + 1.1;
      const joint = new MeshBasicMaterial({ color: 0x2a2520 });
      H2.box(shitinG, 1.1, 0.012, 1.1, joint, SCX, F, SCZ).castShadow = false;
      const slabMat = M2.marble.clone();
      slabMat.color.set(0xf4efe4);
      const slab = H2.box(shitinG, 1, 0.04, 1, slabMat, SCX, F, SCZ);   // "מקום היה שם אמה על אמה, וטבלא של שיש" (Middot 3:3)
      slab.name = "shitinSlab";
      // "וטבעת היתה קבועה בה": a ring lying flat on the slab, held by a small staple at its north side (model choice)
      const ring = new Mesh(new TorusGeometry(0.15, 0.025, 8, 28), M2.bronze);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(SCX, F + 0.04 + 0.025, SCZ + 0.05);
      ring.castShadow = true;
      shitinG.add(ring);
      H2.box(shitinG, 0.1, 0.05, 0.06, M2.bronze, SCX, F + 0.04, SCZ - 0.1);
    }
    // 1.3.3 (the user: "ספלים — להוסיף בשיטות"): THE TWO BOWLS OF THE LIBATIONS - a completion from the Mishnah, as the shitin beside them
    // (Sukkah 4:9 "עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם... ומנקבין כמין שני חטמין דקין, אחד מעבה ואחד דק... מערבי של מים, מזרחי
    // של יין"; the Bartenura there, book 588 line 227: "הספלים היו נתונים אצל הקרן סמוכים זה לזה, זה לפני זה, אחד לצד מערב ואחד לפנים
    // ממנו"): on the top by the south-west horn, the western for the water, the eastern (the wider hole) for the wine. Two readings of the
    // holes, as the Second Temple plugin (ctx.shared.sfalim, the row "ספלי הניסוך"): "rashi" - Rashi Sukkah 48b (book 2163, line 2274) and
    // the Bartenura (588, 224): "חוטם אחד בספל ונקב אחד בחוטמו... ויורדין דרך החוטמין על גב המזבח ובמזבח היה נקב שבו המים והיין יורדין
    // לשיתין" - a spout out of each bowl and a hole in the top before it; "tosafot" - Tosafot there (1903, 504): "דלמא הוא דמנקב הספלים
    // יורדין לשיתין כמין שני נקבי החוטם ולא שהיה בולט כמין חוטם" - the holes in the bowls' bottoms. In shitinG, so that R. Yose's altar takes
    // them to its own corner. Sizes and the exact spot (1.4 in from the south edge, beside the horn, off the ramp) - model choices.
    const SFX = [ACX - S / 2 + 1.3, ACX - S / 2 + 2.2], SFZ = ACZ + S / 2 - 1.4;
    {
      const bowlPts = [[0.02, 0], [0.22, 0], [0.3, 0.1], [0.34, 0.28], [0.3, 0.36]];
      const sil = new MeshStandardMaterial({ color: 0xe8e8ec, metalness: 0.8, roughness: 0.3, envMapIntensity: 1.2 });
      for (const x of SFX) H2.lathe(shitinG, bowlPts, sil, x, TOP + 0.05, SFZ, 16);
      const sfR = new Group(), sfT = new Group();
      sfR.name = "sfalimRashi"; sfT.name = "sfalimTosafot";
      shitinG.add(sfR, sfT);
      sfT.visible = false;
      const dark = new MeshBasicMaterial({ color: 0x120e08 });
      SFX.forEach((x, i) => {
        const sp = H2.cyl(sfR, i ? 0.045 : 0.03, i ? 0.045 : 0.03, 0.3, sil, x, TOP + 0.2, SFZ + 0.42, 8);   // the spout, over the south rim (the wine's thicker)
        sp.rotation.x = Math.PI / 2;
        H2.cyl(sfR, 0.06, 0.06, 0.02, dark, x, TOP + 0.01, SFZ + 0.75, 8);                                    // the hole in the top the libation runs to
        H2.cyl(sfT, i ? 0.05 : 0.035, i ? 0.05 : 0.035, 0.02, dark, x, TOP + 0.06, SFZ, 8);                   // the hole in the bowl's bottom
      });
      ctx.shared.sfalim = {
        current: "rashi", keys: ["rashi", "tosafot"],
        names: { rashi: "רש״י וברטנורא — חוטם ונקב בגג המזבח", tosafot: "תוספות — נקב בתחתית הספל" },
        get() { return this.current; },
        set(k) { if (k !== "rashi" && k !== "tosafot") return false; this.current = k; sfR.visible = k === "rashi"; sfT.visible = k === "tosafot"; return true; }
      };
      for (const [dx, dz, L] of [[0, 0, "altarDefG"], [-2, 2, "altarYoseG"]])
        ctx.labels.push({ text: "ספלי הניסוך — מים (מערבי) ויין (מזרחי)", x: (SFX[0] + SFX[1]) / 2 + dx, y: TOP + 1.2, z: SFZ + dz, size: 0.8, layer: L });
    }

    // --- the fire: three pyres (מערכות) of cedar logs (model choice as in the Second Temple model, after Yoma 45a; the First Temple
    // verses only mention the burnt offerings on the altar: I Kings 8:64, 9:25; II Chr 7:1 "והאש ירדה מהשמים") ---
    // 1.3.5 (the user, of the kuntres "בגדרי ודיני צורת הבית", point 20: "תשנה לפי מה שכתב"): THE GREAT PYRE IN THE SOUTH-EAST - the Rambam,
    // Temidin uMusafin 2:7 "מסדרה במזרח המזבח... וראשי הגזרים הפנימיים היו נוגעין בדשן שבאמצע המזבח"; the Mefaresh on Tamid 31b "ומקום
    // המערכה במזרח המזבח אצל מזרחו של כבש ורחב המערכה אינו תופס עד חצי המזבח שהרי התפוח באמצע המזבח" (both checked in the library, as in
    // the Second Temple model). Until now east of the centre (ACX + 4.5, ACZ - 1.5); how far south - a model choice.
    const PX = ACX + 4.0, PZ = ACZ + 3.0;              // the big pyre, in the south-east, its corner in the heap's side
    const E1X = ACX - 5.5, E1Z = ACZ + 5.5;            // second pyre (model choice)
    const E2X = ACX - 5.5, E2Z = ACZ - 6;              // third pyre (model choice)
    // 1.3.0 (the opinions table, as in the Second Temple model 1.8.0): THE NUMBER OF PYRES - Mishnah Yoma 4:6 "בכל יום היו שם ארבע
    // מערכות, והיום חמש, דברי רבי מאיר. רבי יוסי אומר, בכל יום שלש, והיום ארבע. רבי יהודה אומר, בכל יום שתים, והיום שלש"; the Rambam
    // (Temidin uMusafin 2:4) rules like R. Yose - the default, the three of 1.0.0. The third, R. Meir's fourth (south-east) and the Yom
    // Kippur one (north-east) are their own instanced meshes with their own flames, shown by ctx.shared.maarachot; places: model choices.
    const R4X = ACX + 5.5, R4Z = ACZ - 2.5;            // R. Meir's fourth pyre (model choice; 1.3.5: north of the great pyre, which is in the south-east now)
    const YKX = ACX + 5.5, YKZ = ACZ - 7;              // the Yom Kippur pyre (model choice)
    const logs = [], logs3 = [], logs4 = [], logsYK = [];
    const addPyre = (cx, cz, len, r, layers, list) => {
      list = list || logs;
      for (let l = 0; l < layers; l++) {
        const n = l === layers - 1 ? 2 : 3, alongX = l % 2 === 0;
        for (let i = 0; i < n; i++) {
          const off = (i - (n - 1) / 2) * len * 0.3;
          list.push({
            x: cx + (alongX ? 0 : off),
            z: cz + (alongX ? off : 0),
            y: TOP + r + l * r * 1.9,
            alongX,
            len: len * (0.9 + 0.1 * ((i + l) % 2)),
            r
          });
        }
      }
    };
    addPyre(PX, PZ, 4.4, 0.24, 3);
    addPyre(E1X, E1Z, 2.4, 0.17, 2);
    addPyre(E2X, E2Z, 2.4, 0.17, 2, logs3);
    addPyre(R4X, R4Z, 2.2, 0.15, 2, logs4);
    addPyre(YKX, YKZ, 2.2, 0.15, 2, logsYK);
    const instLogs = (list) => {
      const geo = new CylinderGeometry(1, 1, 1, 8);
      const inst = new InstancedMesh(geo, M2.cedar, list.length);
      const m42 = new Matrix4(), q = new Quaternion(), e = new Euler();
      const p = new Vector3(), s = new Vector3();
      list.forEach((L, i) => {
        e.set(L.alongX ? 0 : Math.PI / 2, 0, L.alongX ? Math.PI / 2 : 0);
        q.setFromEuler(e);
        p.set(L.x, L.y, L.z);
        s.set(L.r, L.len, L.r);
        m42.compose(p, q, s);
        inst.setMatrixAt(i, m42);
      });
      inst.castShadow = inst.receiveShadow = true;
      g.add(inst);
      return inst;
    };
    instLogs(logs);
    const pyre3 = instLogs(logs3), pyre4 = instLogs(logs4), pyreYK = instLogs(logsYK);
    pyre4.visible = false;
    pyreYK.visible = false;
    const flames = [];
    // ===== 1.2.8 (the user: "חי יותר"): REALISTIC FIRE, the Second Temple plugin's 1.0.28 - each flame a camera-facing quad with a noise
    // shader (no textures, offline): the tongue is bent and eaten by scrolling fractal noise, deep red at the edge, orange, pale-yellow core;
    // additive. The flames sit in the altar's group, so they go with it in every reading of its place. Tuning: FIRE.speed, FIRE.heat.
    const FIRE = { speed: 1, heat: 0.65 };
    const flameVS = "uniform vec2 uSize; varying vec2 vUv; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(0.0,0.0,0.0,1.0); mv.xy += position.xy * uSize; gl_Position = projectionMatrix * mv; }";
    const flameFS = [
      "varying vec2 vUv; uniform float uTime; uniform float uSeed; uniform float uOp;",
      "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }",
      "float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);",
      "  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }",
      "float fbm(vec2 p){ return noise(p)*0.5 + noise(p*2.03)*0.25 + noise(p*4.1)*0.125 + noise(p*8.3)*0.0625; }",
      "void main(){",
      "  vec2 q = vec2(vUv.x - 0.5, vUv.y); float t = uTime + uSeed * 0.37;",
      "  float n1 = fbm(vec2(q.x*2.6, q.y*1.8 - t*1.35) + uSeed);",
      "  float n2 = fbm(vec2(q.x*5.5 + 3.1, q.y*3.6 - t*2.6) + uSeed*1.7);",
      "  float sway = (n1 - 0.5) * 0.9 * q.y * q.y * 2.2;",
      "  float xw = (q.x + sway) * (1.0 + q.y * 2.4);",
      "  float body = 1.0 - smoothstep(0.0, 0.42 - 0.18*q.y, abs(xw));",
      "  float h = q.y + (n2 - 0.5) * 0.55 * (0.3 + q.y);",
      "  float top = 1.0 - smoothstep(0.30, 0.98, h);",
      "  float a = body * top;",
      "  a *= 0.75 + 0.5 * n2;",
      "  a = clamp(a * smoothstep(0.0, 0.10, q.y), 0.0, 1.0);",
      "  float heat = a * (1.15 - q.y * 0.75);",
      "  vec3 col = mix(vec3(0.55,0.05,0.0), vec3(1.0,0.38,0.04), smoothstep(0.08,0.45,heat));",
      "  col = mix(col, vec3(1.0,0.72,0.18), smoothstep(0.38,0.75,heat));",
      "  col = mix(col, vec3(1.0,0.93,0.65), smoothstep(0.72,1.05,heat));",
      "  gl_FragColor = vec4(col, pow(a, 1.25) * uOp);",
      "}"
    ].join("\n");
    const flameGeo = new PlaneGeometry(1, 1);
    flameGeo.translate(0, 0.5, 0);
    const addFlame = (x, y, z, r, h, color, op) => {
      const mat = new ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uSeed: { value: flames.length * 7.31 }, uOp: { value: op * FIRE.heat }, uSize: { value: new Vector2(r * 2.6, h * 1.35) } },
        vertexShader: flameVS, fragmentShader: flameFS, transparent: true, depthWrite: false, blending: AdditiveBlending, fog: false
      });
      const m = new Mesh(flameGeo, mat);
      m.position.set(x, y, z);
      m.castShadow = false;
      m.frustumCulled = false;
      m.renderOrder = 2;
      m.userData.op = op;
      m.userData.w = r * 2.6;
      m.userData.h = h * 1.35;
      m.userData.noPick = true;
      g.add(m);
      flames.push(m);
      return m;
    };
    {
      const fx = [PX - 1.3, PX, PX + 1.3], fz = [PZ - 1.6, PZ, PZ + 1.6];
      let fi = 0;
      for (const x of fx) for (const z of fz) {
        const k = fi % 3;
        addFlame(x + (fi % 2 ? 0.2 : -0.15), TOP + 1.1, z + (k - 1) * 0.15, 0.75 - k * 0.1, 3.0 - k * 0.5, [0xff791e, 0xffb730, 0xffdf8a][k], 0.78 + k * 0.06);
        fi++;
      }
    }
    addFlame(E1X, TOP + 0.55, E1Z, 0.65, 1.5, 0xffb730, 0.8);
    const flame3 = addFlame(E2X, TOP + 0.55, E2Z, 0.6, 1.3, 0xff791e, 0.8);
    const flame4 = addFlame(R4X, TOP + 0.5, R4Z, 0.5, 1.1, 0xffb730, 0.75), flameYK = addFlame(YKX, TOP + 0.5, YKZ, 0.5, 1.1, 0xff791e, 0.75);
    flame4.visible = flameYK.visible = false;
    ctx.shared.maarachot = {
      count: 3, yk: false,
      set(count, yk) {
        this.count = Math.max(2, Math.min(4, +count || 3));
        this.yk = !!yk;
        pyre3.visible = flame3.visible = this.count >= 3;
        pyre4.visible = flame4.visible = this.count >= 4;
        pyreYK.visible = flameYK.visible = this.yk;
      },
      get() { return { count: this.count, yk: this.yk }; }
    };
    const fireLight = new PointLight(0xff9a3d, 24, 60, 1.8);
    fireLight.position.set(PX, TOP + 3.2, PZ);
    g.add(fireLight);
    const emberLight = new PointLight(0xff8a30, 6, 22, 1.8);
    emberLight.position.set(E2X, TOP + 1.6, E2Z);
    g.add(emberLight);
    const smokeTexture = (() => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 128;
      const c = cv.getContext("2d");
      const grad = c.createRadialGradient(64, 64, 6, 64, 64, 62);
      grad.addColorStop(0, "rgba(140,140,140,0.5)");
      grad.addColorStop(0.55, "rgba(140,140,140,0.22)");
      grad.addColorStop(1, "rgba(140,140,140,0)");
      c.fillStyle = grad;
      c.fillRect(0, 0, 128, 128);
      return new CanvasTexture(cv);
    })();
    const smoke = [];
    for (let i = 0; i < 7; i++) {
      const sp = new Sprite(new SpriteMaterial({ map: smokeTexture, color: 0x8a8a8a, transparent: true, opacity: 0.15, depthWrite: false }));
      sp.renderOrder = 3;
      g.add(sp);
      smoke.push(sp);
    }
    // the ash heap (תפוח) in the middle of the top (model choice, as in the Second Temple model after Tamid 2:2)
    try {
      // 1.3.5 (the user, 10.11.2026: "התפוח שעל המזבח צריך להיות כעין אפר (אותה הצורה רק החומר והצבע משתנים)"): THE ASH - the heap kept
      // its shape; its material is ash - BLACK since 19:03 the same day ("האפר צריך להיות כדשן שחור"), see inside: drawn once on a
      // canvas (a fixed seed - the same heap at every load), the same picture as its bump, no shine. Until now a plain dark copy of the altar's stone.
      const ashMat = (() => {
        // 10.11.2026 (the user, 19:03: "האפר צריך להיות כדשן שחור"): BLACK ASH. One drawing made twice, of the same seed - the picture in
        // black (a black ground, darker and lighter patches, black grains with a few pale flecks, bits of charcoal), and the relief in the
        // former grey, so the grains stand where they are seen. Shape and measures untouched.
        let seed = 0;
        const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
        const draw = (black) => {
          const cv = document.createElement("canvas");
          cv.width = cv.height = 256;
          const c2 = cv.getContext("2d");
          seed = 20261110;
          const col = (v, a) => "rgba(" + v + "," + Math.max(0, v - (black ? 1 : 3)) + "," + Math.max(0, v - (black ? 2 : 9)) + "," + a + ")";
          c2.fillStyle = black ? "#232120" : "#8f8b84";
          c2.fillRect(0, 0, 256, 256);
          for (let i = 0; i < 90; i++) {   // soft patches, lighter and darker
            const x = rnd() * 256, y = rnd() * 256, r = 14 + rnd() * 34, k = rnd();
            const v = Math.round(black ? 10 + k * 46 : 104 + k * 92);
            const gr = c2.createRadialGradient(x, y, 0, x, y, r);
            gr.addColorStop(0, col(v, 0.5));
            gr.addColorStop(1, col(v, 0));
            c2.fillStyle = gr;
            c2.fillRect(x - r, y - r, 2 * r, 2 * r);
          }
          for (let i = 0; i < 5200; i++) {   // the grains
            const k = rnd(), s = 0.6 + rnd() * 1.7;
            const v = Math.round(black ? (k > 0.93 ? 78 + (k - 0.93) * 700 : 5 + k * 58) : 70 + k * 150);
            c2.fillStyle = col(v, (0.35 + rnd() * 0.5).toFixed(2));
            c2.fillRect(rnd() * 256, rnd() * 256, s, s);
          }
          for (let i = 0; i < 130; i++) {   // bits of charcoal
            const s = 1 + rnd() * 2.6, a = rnd(), b = rnd(), d = rnd();
            c2.fillStyle = black ? "rgba(" + Math.round(2 + a * 10) + "," + Math.round(2 + b * 9) + "," + Math.round(2 + d * 8) + ",0.95)"
              : "rgba(" + Math.round(28 + a * 26) + "," + Math.round(26 + b * 22) + "," + Math.round(24 + d * 20) + ",0.9)";
            c2.fillRect(rnd() * 256, rnd() * 256, s, s * (0.6 + rnd() * 0.9));
          }
          return cv;
        };
        const tex = new CanvasTexture(draw(true));
        tex.colorSpace = SRGBColorSpace;
        tex.wrapS = tex.wrapT = RepeatWrapping;
        tex.repeat.set(5, 2);
        tex.anisotropy = 4;
        const bump = new CanvasTexture(draw(false));
        bump.wrapS = bump.wrapT = RepeatWrapping;
        bump.repeat.set(5, 2);
        return new MeshStandardMaterial({ color: 0xffffff, map: tex, bumpMap: bump, bumpScale: 0.3, roughness: 1, metalness: 0 });
      })();
      const geo = new SphereGeometry(2, 20, 14);
      geo.scale(1, 0.4, 1);
      const m = new Mesh(geo, ashMat);
      m.position.set(ACX, TOP + 0.05, ACZ);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    } catch (e) {
      console.warn("[altar] ash heap skipped", e);
    }

    // --- labels and fly point ---
    ctx.labels.push(
      { text: "מזבח הנחושת", x: ACX, y: TOP + 9, z: ACZ, size: 4.5 },
      { text: "הכבש", x: ACX, y: F + 8, z: ACZ + 30, size: 3 }
    );
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    ctx.shared.flyPoints.mizbeach = { pos: [115, 52, 72], target: [ACX, TOP, ACZ] };
    ctx.shared.flyPoints.mizbeachTop = { pos: [ACX + 0.5, TOP + 44, ACZ + 3], target: [ACX + 0.5, TOP, ACZ + 0.5] };   // 1.3.0: the top from above (the pyres' row); 1.3.2 (the list): straight down, the 28 of R. Yose in the frame too; moves with the altar (FPK below)
    // 1.3.3: the measures' frames (below) from the north-east, above: the north and east sides with their numbers, the top and the height line
    ctx.shared.flyPoints.mizbeachMeasures = { pos: [ACX + 35, TOP + 31, ACZ - 35], target: [ACX + 1, F + 3, ACZ + 1] };
    // 1.3.3: the libation bowls by the south-west horn, close, from the south-east above the top (the ramp's head below)
    ctx.shared.flyPoints.sfalim = { pos: [ACX - S / 2 + 5, TOP + 7.5, ACZ + S / 2 + 3], target: [ACX - S / 2 + 1.8, TOP + 0.2, ACZ + S / 2 - 1.3] };

    // --- 1.0.2: השיתין - the text, the sources (book id + line index, each line read in the Otzaria DB), the label and the fly point ---
    {
      const SHITIN_INFO = "לשון המשנה: 'ובקרן מערבית דרומית היו שני נקבים, כמין שני חטמין דקין' — הדם יורד בהם ויוצא לנחל קדרון (מדות ג, ב; רמב״ם בית הבחירה ב, יא). ועוד: 'למטה ברצפה באותה הקרן, מקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה, שבו יורדין לשית ומנקין אותו' (מדות ג, ג).\nבבית ראשון: המשנה מתארת את מזבח הבית השני, אבל השיתין היו כבר בבית ראשון — 'שיתין מששת ימי בראשית נבראו' (סוכה מט.), ו'בשעה שכרה דוד שיתין' (סוכה נג.).\nרש״י: בימי שלמה היה 'כמין בור כרוי אצל המזבח באותה זוית', וכשעלו בני הגולה 'קלטו אותו הבור לתוך המזבח ועשו נקבים כנגדן בראש המזבח' (רש״י זבחים סא:).\nבמודל: פי הבור מסומן בשני פתחים ברצפה, לרגלי היסוד שבקרן — אחד במערב ואחד בדרום (בחירת המודל).";
      // 1.0.2 (fix, the review): the text no longer derives the two openings from Rashi - he has one pit beside the altar (book 2191, line 2955)
      // and the holes only in the Second Temple ("וכשעלו בני הגולה", Zevachim 61b, book 130, line 2096); the two openings are the model's mark of it
      const SHITIN_REFS = [
        ["מדות ג, ב", { book: 89, index: 20 }],
        ["מדות ג, ג", { book: 89, index: 21 }],
        ["רמב״ם בית הבחירה ב, יא", { book: 337, index: 34 }],
        ["ב, יב", { book: 337, index: 35 }],
        ["סוכה מט.", { book: 108, index: 1261 }],
        ["סוכה נג.", { book: 108, index: 1371 }],
        ["רש״י זבחים סא:", { book: 2191, index: 2955 }]
      ];
      // the label west of the west face, north of the corner, 2.6 out so that the sprite does not cut into the altar and does not hide
      // the openings or the slab (checked in a render)
      ctx.labels.push({ text: "השיתין", x: SHX - 2.6, y: F + 2.4, z: SHZ - 2.6, size: 2.5, info: SHITIN_INFO, refs: SHITIN_REFS });
      // from the south-west, looking down on the corner: both openings, the slab and its ring in view (checked in a render).
      // 1.0.2 (fix): the same camera, the aim 2 amot to the screen's left (north-west), so that the corner and its label stand right of the
      // panel's card (which opens at the window's left edge) - the label is not moved (closer in, the altar cut its first letter)
      ctx.shared.flyPoints.shitin = { pos: [SHX - 5, F + 6, SHZ + 5.5], target: [SHX - 2.1, F + 0.3, SHZ - 1.5] };
      ctx.shared.shitin = { title: "השיתין", info: SHITIN_INFO, refs: SHITIN_REFS, fly: "shitin" };
    }

    // --- 1.0.2 (add-on): the yesod, the sovev and the red line - their texts, sources (each line read in the Otzaria DB) and three small
    // labels on the layer altarProfile, which this module shows only while the camera is within 130 amot of the altar (the court's
    // overview stays clean; the altar's fly point, 104 away, shows them) ---
    {
      const PROFILE = {
        yesod: {
          title: "היסוד",
          info: "היסוד — השלמה מן המשנה: 'שכל מזבח שאין לו קרן וכבש ויסוד וריבוע – פסול' (זבחים סב.), ולכן גם למזבח שלמה היה יסוד. צורתו כמשנה: 'עלה אמה וכנס אמה, זה היסוד' (מדות ג, א).\nבבית שני: 'קרן מזרחית דרומית לא היה לה יסוד... לפי שלא היתה בחלקו של טורף' (זבחים נג:).\nהתוספות, על בית ראשון: 'היה להם יסוד לדרום שהיה משוך בחלקו של טורף חוץ מרוח מזרחית שלא נשתנה שהיה בלא יסוד' (תוספות זבחים סא:).\nרש״י, על מזבח משה: 'יסוד וסובב לא היו ממעטין בארכו ורחבו לפי שמקיפין ובולטין סביביו' (רש״י זבחים נט:). ולרש״י, כרבי יוסי במדות, 'בתחילה בימי שלמה לא היה אלא כ\"ח' (רש״י זבחים סא:), ועשרים על עשרים הם מקום המערכה.\nבמודל: **היסוד על פני כל הצפון, כל המערב וכל הדרום, ובמזרח רק אמה אחת בקרן הצפונית**; לקרן הדרומית המזרחית אין יסוד בצד המזרח. עשרים על עשרים של הפסוק (דברי הימים ב ד, א) הם גוף המזבח, והיסוד והסובב בולטים סביבו. המזבח לא הורחב — בחירת המודל.\nהיסוד כבית קיבול: רש״י (שמות כט, יב): 'אל יסוד המזבח. כמין בליטת בית קבול עשוי לו סביב סביב, לאחר שעלה אמה מן הארץ'. במודל: שפה נמוכה על קצה גג היסוד, בכל מקום שיש יסוד; מידות השפה — בחירת מודל.",
          refs: [
            ["זבחים סב.", { book: 130, index: 2110 }], ["מדות ג, א", { book: 89, index: 19 }], ["זבחים נג:", { book: 130, index: 1865 }],
            ["תוספות זבחים סא:", { book: 1936, index: 654 }], ["רש״י זבחים נג:", { book: 2191, index: 2590 }],
            ["רש״י זבחים נט:", { book: 2191, index: 2871 }], ["רש״י זבחים סא:", { book: 2191, index: 2952 }],
            ["רמב״ם בית הבחירה ב, י", { book: 337, index: 33 }], ["דברי הימים ב ד, א", { book: 39, index: 57 }], ["רש״י שמות כט, יב", { book: 3692, index: 2101 }]
          ]
        },
        sovev: {
          title: "הסובב",
          info: "הסובב — השלמה מן המשנה: 'עלה חמש וכנס אמה. זה הסובב' (מדות ג, א) — מדף של אמה סביב המזבח, שש אמות מן הרצפה.\nבגמרא: עליו הולך הכהן לתת את הדם בקרנות — 'עלה בכבש ופנה לסובב, ובא לו לקרן דרומית מזרחית' (זבחים נג.); 'איזהו כרכוב?... רבי יוסי ברבי יהודה אומר: זה הסובב' (זבחים סב.). הכבש 'פורח אמה על יסוד ואמה על סובב' (זבחים סב:).\nרש״י, על מזבח משה: 'סביב הקיר משעלה שש אמות גובה... היקף הבליטה קטנה חוגרתו סביב לנוי וזהו סובב' (רש״י זבחים סב.).\nהרמב״ם: 'ואויר מעט היה מפסיק בין הכבש למזבח' (רמב״ם בית הבחירה ב, יג).",
          refs: [
            ["מדות ג, א", { book: 89, index: 19 }], ["זבחים נג.", { book: 130, index: 1844 }], ["זבחים סב.", { book: 130, index: 2109 }],
            ["רש״י זבחים סב.", { book: 2191, index: 2987 }], ["זבחים סב:", { book: 130, index: 2131 }],
            ["רמב״ם בית הבחירה ב, ז", { book: 337, index: 30 }], ["ב, יג", { book: 337, index: 36 }]
          ]
        },
        redLine: {
          title: "חוט הסיקרא",
          info: "חוט הסיקרא — השלמה מן המשנה: 'וחוט של סקרא חוגרו באמצע, להבדיל בין הדמים העליונים לדמים התחתונים' (מדות ג, א); הרמב״ם: 'כששה טפחים מסוף הסובב ולמטה' (רמב״ם בית הבחירה ב, ט).\nבמודל: באמצע גובה המזבח — **חמש אמות מן הרצפה, אמה מתחת לסובב**. עוביו — בחירת המודל.",
          refs: [["מדות ג, א", { book: 89, index: 19 }], ["רמב״ם בית הבחירה ב, ט", { book: 337, index: 32 }]]
        }
      };
      const lay = new Group();
      lay.name = "altarProfile";
      lay.visible = false;
      g.add(lay);
      ctx.layers.altarProfile = lay;
      // on the east side, which the altar's fly point (from the south-east) sees: each beside its own step, 1.6 out (checked in a render)
      // 1.3.2: one set for each reading of the altar (the layers of its body - defG / yoseG)
      for (const [ex, zn, L] of [[XE, ZN, "altarDefG"], [YXE, YZN, "altarYoseG"]]) ctx.labels.push(
        { text: "הסובב", x: ex + 1.6, y: F + SVH + 1.2, z: ACZ - 3, size: 2.2, layers: ["altarProfile", L], info: PROFILE.sovev.info, refs: PROFILE.sovev.refs },
        { text: "חוט הסיקרא", x: ex + 1.6, y: F + AH / 2 - 0.9, z: ACZ + 3, size: 2, layers: ["altarProfile", L], info: PROFILE.redLine.info, refs: PROFILE.redLine.refs },
        { text: "היסוד", x: ex + 1.6, y: F + 1.6, z: zn - 0.5, size: 2.2, layers: ["altarProfile", L], info: PROFILE.yesod.info, refs: PROFILE.yesod.refs }
      );
      // 1.3.5: the three rovdin's label over the ramp's head, in each reading of the altar
      const ROVDIN = {
        info: "שלושה רובדין: בבית יוסף (אורח חיים קכג) בשם רבינו האי: 'ובין כבש למזבח היו שלש רובדין של אבן, ויורד בהם ג׳ פסיעות על עקב'.\nובבנין ציון (סימן יב) ביאר את מקומם: אחד במקום שהכבש פורח על הסובב, אחד במקום שהוא פורח על היסוד, ואחד כנגד אוויר הקרקע.\nבמודל: **שלושה חריצים בראש הכבש, בחציו המזרחי**, ובינם שלושה רובדין המחוברים בצידם אל אמצע הכבש; צורת החריצים, רוחבם ומקומם — בחירת מודל.",
        refs: [["בית יוסף, אורח חיים קכג", { book: 3900, index: 2000 }], ["בנין ציון, יב", { book: 5791, index: 50 }], ["זבחים סב:", { book: 130, index: 2131 }]]
      };
      for (const [zh, L] of [[ACZ + S / 2, "altarDefG"], [ACZ + YT / 2, "altarYoseG"]]) ctx.labels.push(
        { text: "שלושה רובדין — חריצים בראש הכבש (רב האי גאון)", x: ACX + 5, y: F + AH + 1.5, z: zh + 1.6, size: 1.7, layers: ["altarProfile", L], info: ROVDIN.info, refs: ROVDIN.refs });
      ctx.shared.altarProfile = PROFILE;
      // 1.3.2 (the user: "בית ראשון: תוסיף שיטת ר' יוסי"): THE ALTAR'S MEASURES, a switch - "chronicles" (the default: the verse's 20 x 20,
      // the yesod and the sovev round it, as 1.0.2) or "yose" (28 x 28, receding to the place of the pyre, 20 x 20)
      ctx.shared.altarYose = {
        current: "chronicles", keys: ["chronicles", "yose"],
        names: { chronicles: "דברי הימים — עשרים על עשרים", yose: "רבי יוסי — עשרים ושמונה" },
        get() { return this.current; },
        set(k) {
          if (k !== "yose" && k !== "chronicles") return;
          this.current = k;
          const y = k === "yose";
          defG.visible = rampDefG.visible = !y;
          yoseG.visible = rampYoseG.visible = y;
          shitinG.position.set(y ? -2 : 0, 0, y ? 2 : 0);
          if (ctx.shared.altarMeasures) ctx.shared.altarMeasures.sync();   // 1.3.3: the measures' frames of the reading
        }
      };
      const AC = new Vector3(ACX, F + AH / 2, ACZ);
      ctx.animated.push(() => {
        const cam = ctx.camera;
        const mg = ctx.layers.altarMeasures;   // 1.3.3: while the measures are shown their numbers stand where these labels would
        if (cam) lay.visible = cam.position.distanceTo(AC) < 130 && !(mg && mg.visible);
      });
    }

    // --- 1.0.2 (add-on): the two readings of the small ramps - Rashi (the default) or Tosafot; only the western ramp to the sovev changes ---
    {
      const RAMP_INFO = {
        rashi: "בגמרא: 'שני כבשים קטנים יוצאין מן הכבש, שבהן פונים ליסוד ולסובב; ומובדלין מן המזבח מלא נימא' (זבחים סב:).\nרש״י: 'אותו שפונין בו לסובב יצא במזרחו של כבש לימין... ונמשך ועולה באלכסון עד שמגיע לסובב והפונה ליסוד יוצא למערבו... ומתחיל לצאת בשיפולו של כבש רחוק מן המזבח כדי שיהא נוח לשפע ולירד ליסוד' (רש״י זבחים סב:). ובמערב **אין כבש לסובב**: 'אבל לצד המערב אין לו [כבש] לפנות לסובב וצריך לעלות על ראש המזבח ועומד בדרומה של קרן' (רש״י זבחים סד.).\nבמודל: מקום תחילתם ורוחבם — בחירת המודל.",
        tosafot: "התוספות: 'ונראה דאין משם ראי' שלא היה כבש לסובב במערב', שאם לא כן, בדם החטאת 'כשהיה מגיע לקרן מערבית דרומית היה צריך לחזור על עקיבו ולכך נראה דהיה שם כבש' (תוספות זבחים סד.).\nתוספות יום טוב — ולמה מנו רק שניים? 'שאותו כבש עצמו היה רחב ומקצת ממנו מוגבה ועולה עד על הסובב גם כן' (תוספות יום טוב זבחים ו, ג).\nהמשנה למלך: 'התוספות ס\"ל דגם במערבו היה כבש קטן פונה לסובב' (משנה למלך בית הבחירה ב, יד).\nבמודל: **הכבש המערבי רחב, וחציו החיצון עולה לסובב**."
      };
      const R_SUGYA = [["זבחים סב:", { book: 130, index: 2129 }], ["רמב״ם בית הבחירה ב, יד", { book: 337, index: 37 }]];
      const RAMP_REFS = {
        rashi: R_SUGYA.concat([["רש״י זבחים סב:", { book: 2191, index: 3022 }], ["רש״י זבחים סד.", { book: 2191, index: 3089 }]]),
        tosafot: R_SUGYA.concat([["תוספות זבחים סד.", { book: 1936, index: 681 }], ["תוספות יום טוב זבחים ו, ג", { book: 945, index: 183 }],
          ["משנה למלך בית הבחירה ב, יד", { book: 4606, index: 25 }]])
      };
      let cur = "rashi";
      const ramps = {
        title: "הכבשים הקטנים",
        keys: ["rashi", "tosafot"],
        options: [{ key: "rashi", label: "רש״י — שני כבשים" }, { key: "tosafot", label: "תוספות — גם כבש שלישי" }],
        info: RAMP_INFO,
        refs: RAMP_REFS,
        fly: "mizbeachRamps",
        get current() { return cur; },
        get() { return cur; },
        set(key) {                                     // shows or hides the western ramp to the sovev; returns the current key
          if (key !== "rashi" && key !== "tosafot") return cur;
          smallRamps.sovevWest.visible = key === "tosafot";
          if (smallRamps.yoseSovevWest) smallRamps.yoseSovevWest.visible = key === "tosafot";
          cur = key;
          return cur;
        }
      };
      ctx.shared.altarRamps = ramps;
      // the small ramps from the south-west, high (above the bases' block): the western ramps along the big ramp's west face and where
      // they meet the yesod and the sovev, which is where the two readings differ (1.0.2 fix, the review: the old view down the ramp's
      // axis, [ACX, F + 24, 62], showed them as thin strips and both readings looked the same; checked in renders with the card open on
      // the left, both readings; model choice) = [24, 28, 44] looking at [42, 8, 16]
      // 1.3.6 (the scan of 11.11.2026): that view was far and high, over the mechonot and their label, and the small ramps were two thin
      // strips. Now close: from the south-west and above, at the place where the western ramps meet the altar = [37.5, 22, 33] looking at
      // [46.6, 9, 25.5] (in pictures: Rashi - the one ramp at the foot; the Tosafot - the second above it, rising to the sovev)
      ctx.shared.flyPoints.mizbeachRamps = { pos: [RX0 - 9.5, F + 16, ZS + 12], target: [RX0 - 0.4, F + 3, ZS + 4.5] };
      // the south-west corner from outside: the yesod's corner, the sovev, the red line, the western small ramps and the shitin
      ctx.shared.flyPoints.mizbeachSW = { pos: [SHX - 14, F + 10, SHZ + 15], target: [SHX + 2.5, F + 3, SHZ - 3] };
    }

    // --- 1.0.2: the look of the altar - stone (1.0.1-L, the default) or Abarbanel's bronze plating; only the materials change ---
    {
      const LOOK = {
        stone: { body: BR, band: BRD },
        abarbanel: { body: PL, band: PLD }
      };
      // 1.0.2 (the user): Abarbanel's plating covers the big ramp and the small ramps too - the ramp is part of the altar (Zevachim 62a)
      const rampParts = [];
      g.traverse((o) => { if (o.isMesh && o.material === AS) rampParts.push(o); });
      const look = {
        title: "מראה המזבח",
        current: "stone",
        keys: ["stone", "abarbanel"],
        options: [{ key: "stone", label: "מזבח אבנים" }, { key: "abarbanel", label: "אברבנאל — מצופה נחושת" }],
        info: {
          stone: "במודל: **המזבח בצבע אבן** — 'אבנים שלמות תבנה את מזבח ה׳ אלהיך' (דברים כז, ו); הרמב״ם: 'המזבח אין עושין אותו אלא בנין אבנים' (רמב״ם בית הבחירה א, יג).\nהשם כלשון הפסוק: 'כי מזבח הנחשת אשר לפני ה׳ קטן' (מלכים א ח, סד). המראה — בחירת המודל.",
          abarbanel: "אברבנאל: 'ועם היותו מזבח אבנים כמו שצותה התורה, הנה קראו מזבח הנחשת, לפי שהיה מצופה נחשת, כמו שנקרא מזבח הזהב להיותו מצופה זהב' (אברבנאל מלכים א ח, סד).\nבמודל: **המזבח כולו מצופה נחושת** — היסוד, הסובב, השפה והקרנות — וכך גם הכבש והכבשים הקטנים, שהכבש חלק מן המזבח: 'כל מזבח שאין לו קרן וכבש ויסוד וריבוע – פסול' (זבחים סב.)."
        },
        // 1.0.2 (fix, the review): the name with the article is I Kings 8:64 (book 10, line 340, read in the DB); II Chr 4:1 has "ויעש מזבח נחשת"
        refs: {
          stone: [["דברים כז, ו", { book: 5, index: 723 }], ["רמב״ם בית הבחירה א, יג", { book: 337, index: 15 }], ["מלכים א ח, סד", { book: 10, index: 340 }], ["דברי הימים ב ד, א", { book: 39, index: 57 }]],
          abarbanel: [["אברבנאל מלכים א ח, סד", { book: 3574, index: 511 }], ["זבחים סב.", { book: 130, index: 2110 }], ["דברי הימים ב ד, א", { book: 39, index: 57 }]]
        },
        get() { return look.current; },
        set(key) {                                     // re-dresses the body, sovev, lip, horns and yesod (1.0.2 add-on); returns the current key
          const L = LOOK[key];
          if (!L) return look.current;
          for (const m of bodyParts) m.material = L.body;
          for (const m of bandParts) m.material = L.band;
          for (const m of rampParts) m.material = key === "abarbanel" ? L.body : AS;
          look.current = key;
          return key;
        }
      };
      ctx.shared.altarLook = look;
    }

    // --- animation: flicker, lights, smoke ---
    ctx.animated.push((t) => {
      const s = t * 1e-3;
      for (let i = 0; i < flames.length; i++) {
        const f = flames[i];
        const n = Math.sin(s * 9.1 + i * 2.3) * 0.6 + Math.sin(s * 15.7 + i * 4.1) * 0.4;
        const u = f.material.uniforms;
        u.uTime.value = s * FIRE.speed;
        u.uSize.value.set(f.userData.w * (1 + 0.06 * Math.sin(s * 12.3 + i * 3.1)), f.userData.h * (1 + 0.15 * n));
        u.uOp.value = f.userData.op * FIRE.heat * (0.85 + 0.15 * n);
      }
      fireLight.intensity = 23 + 4.5 * Math.sin(s * 9.7) + 2.5 * Math.sin(s * 22.3 + 1.3);
      emberLight.intensity = 5.5 + 1.4 * Math.sin(s * 7.3);
      for (let i = 0; i < smoke.length; i++) {
        const sp = smoke[i];
        const p = (s * 0.045 + i / smoke.length) % 1;
        // 1.2.8: a straight column (Yoma 21b: the smoke of the pyre "מתמר ועולה כמקל" - one of the ten wonders), almost no drift
        sp.position.set(
          PX + Math.sin(s * 0.55 + i * 1.9 + p * 5) * (0.15 + p * 0.5),
          TOP + 1.6 + p * 70,
          PZ + Math.cos(s * 0.5 + i * 2.7 + p * 4) * (0.12 + p * 0.4)
        );
        const sc2 = 2.2 + p * 4.5;
        sp.scale.set(sc2, sc2, 1);
        sp.material.opacity = 0.17 * (p < 0.12 ? p / 0.12 : 1 - (p - 0.12) / 0.88);
      }
    });

    // 1.2.8 (the user: "לבית ראשון הוסף תוך ציון שלא מאומת"): THE RUBUVA - the window 1 x 1 in the west side of the ramp (Rambam Beit
    // HaBechirah 2:14, of the Second Temple's altar; Zevachim 62b "רבובה היתה"). No source places it in Solomon's altar - told on the label.
    {
      const darkMat = new MeshBasicMaterial({ color: 0x0f0c08 });
      const rx = ACX - 8 - 0.05, rz = ACZ + S / 2 + 14;   // the ramp is 16 wide (RW above); the window mid-way along it, near the ground
      H2.box(g, 0.1, 1.5, 1.5, M2.altarStone, rx, F + 0.15, rz);
      H2.box(g, 0.1, 1, 1, darkMat, rx - 0.04, F + 0.4, rz);
      ctx.labels.push({ text: "רבובה — חלון בכבש (רמב״ם ב, יד; לבית ראשון לא מאומת)", x: rx - 2, y: F + 3.2, z: rz, size: 1.2 });
    }
    // --- 1.3.3 (the user: "הוספת את מדידת אמות המזבח לבית ראשון?"): THE ALTAR'S MEASURES DRAWN, as in the Second Temple plugin - a thin
    // frame round every step at its own height, its number of amot on a dark plate on all four sides (read from every side and from above),
    // by the reading of the row "מידות המזבח" (ctx.shared.altarYose): "chronicles" - the yesod 24, the wall up to the sovev 22, the body 20
    // (II Chr 4:1 "עשרים אמה ארכו ועשרים אמה רחבו"), and a height line, "ועשר אמות קומתו", with the yesod's 1 and the sovev's 6 (Middot 3:1
    // "עלה אמה וכנס אמה, זה היסוד... עלה חמש וכנס אמה. זה הסובב"); "yose" - 28, 26, 24, 22 ("מקום הקרנות אמה מזה ואמה מזה") and 20 ("מקום
    // הלוך רגלי הכהנים, אמה מזה ואמה מזה"), "עד שנמצא מקום המערכה עשרים על עשרים" (Middot 3:1; Rashi Zevachim 61b, book 2191 line 2952).
    // The frames stand where the model's surfaces are; the yesod's frame is its outline (on the east it runs one amah only - Tosafot 61b).
    // ctx.shared.altarMeasures = { on, get(), set(v), sync(), info, refs }; shown by the place "מידות המזבח — קווי האמות" and by the row,
    // 15 s (70-ui.js); the group is in g, so it moves with the altar's place (below), and its labels are pushed before the place's snapshot.
    {
      const measG = new Group();
      measG.name = "altar-measures";
      measG.visible = false;
      g.add(measG);
      ctx.layers.altarMeasures = measG;
      // strong colours: the court's floor is white marble and the altar light stone, so the Second Temple plugin's white and pale gold
      // did not show here (checked in a render); each step its own colour, the same in both readings
      const COL = [0x1e40af, 0x047857, 0xbe185d, 0x6d28d9, 0xc2410c];
      const amotTxt = (w) => w + (w === 1 ? " אמה" : w <= 10 ? " אמות" : " אמה");
      const READ = {
        chronicles: { w: [YO, MID, S], y: [F + 0.05, F + YS + 0.05, F + SVH + 0.05],
          what: ["היסוד", "הכותל שעד הסובב", "גוף המזבח — ״עשרים אמה ארכו ועשרים אמה רחבו״"] },
        yose: { w: [YY, YM, YT, YT - 2, YT - 4], y: [F + 0.05, F + YS + 0.05, F + SVH + 0.05, TOP + 0.08, TOP + 0.08],
          what: ["היסוד", "מעל היסוד — ״כונס ועולה״", "מעל הסובב", "מקום הקרנות — ״אמה מזה ואמה מזה״", "מקום המערכה — ״עשרים על עשרים״"] }
      };
      const INFO = {
        chronicles: "הפסוק: ״ויעש מזבח נחשת עשרים אמה ארכו ועשרים אמה רחבו ועשר אמות קומתו״ (דברי הימים ב ד, א).\nהשלמה מן המשנה — היסוד והסובב: ״עלה אמה וכנס אמה, זה היסוד... עלה חמש וכנס אמה. זה הסובב״ (מדות ג, א).\nרש״י: הם אינם ממעטים במידה שבפסוק — ״יסוד וסובב לא היו ממעטין בארכו ורחבו לפי שמקיפין ובולטין סביביו״ (זבחים נט:).\nבמודל, בקריאה זו: **גוף המזבח עשרים על עשרים, ועשר אמות גובהו**; לכן הכותל שעד הסובב עשרים ושתים, והיסוד עשרים וארבע. גובה היסוד אמה, והסובב שש אמות מן הרצפה. קו היסוד הוא מתארו: במזרח היסוד רק אמה אחת, בקרן הצפונית (תוספות זבחים סא:). בחירת מודל.",
        yose: "לשון המשנה (מדות ג, א): ״אמר רבי יוסי, מתחלה לא היה אלא שמנה ועשרים על שמנה ועשרים, כונס ועולה במדה זו, עד שנמצא מקום המערכה עשרים על עשרים״.\nרש״י (זבחים סא:): ״בתחילה בימי שלמה לא היה אלא כ״ח כונס ועולה יסוד וסובב ומקום קרנות ומקום הילוך עד שהיה מקום המערכה כ׳ על כ׳״.\n״במדה זו״ — כמידות שבמשנה: ״מקום הקרנות אמה מזה ואמה מזה... מקום הלוך רגלי הכהנים, אמה מזה ואמה מזה״.\nבמודל: **עשרים ושמונה היסוד**, עשרים ושש מעליו, עשרים וארבע מעל הסובב, עשרים ושתים בתוך מקום הקרנות, **ועשרים מקום המערכה** — העשרים שבפסוק. גובהו עשר אמות, כפסוק."
      };
      const REFS = [["דברי הימים ב ד, א", { book: 39, index: 57 }], ["מדות ג, א", { book: 89, index: 19 }], ["רש״י זבחים סא:", { book: 2191, index: 2952 }], ["רש״י זבחים נט:", { book: 2191, index: 2871 }]];
      const subs = {};
      for (const key of Object.keys(READ)) {
        const R = READ[key], grp = new Group();
        grp.visible = key === "chronicles";
        measG.add(grp);
        subs[key] = grp;
        ctx.layers["altarM_" + key] = grp;
        const W0 = R.w[0], n = R.w.length;
        R.w.forEach((w, i) => {
          const half = w / 2, y = R.y[i], th = i < 3 ? 0.4 : 0.35, o = half + th / 2;   // the whole line just outside the step's edge, seen
          const lm = new MeshBasicMaterial({ color: COL[i] });
          const bar = (bw, bd, x, z) => { const b = new Mesh(new BoxGeometry(bw, 0.06, bd), lm); b.position.set(x, y, z); b.userData.noPick = true; grp.add(b); };
          bar(w + 2 * th, th, ACX, ACZ - o); bar(w + 2 * th, th, ACX, ACZ + o);
          bar(th, w, ACX - o, ACZ); bar(th, w, ACX + o, ACZ);
          // the number on all four sides, just outside the line, each side's numbers spread along it the other way round, so that the
          // plates of two frames never meet (as the Second Temple plugin, 1.9.1)
          const t = -W0 / 2 + 3 + i * (W0 - 8) / (n - 1);
          const lay = { size: 2.6, box: true, layers: ["altarMeasures", "altarM_" + key], title: R.what[i], info: INFO[key], refs: REFS };
          for (const [lx, lz] of [[ACX + t, ACZ + half + 0.6], [ACX + half + 0.6, ACZ - t], [ACX - t, ACZ - half - 0.6], [ACX - half - 0.6, ACZ + t]])
            ctx.labels.push(Object.assign({ text: amotTxt(w), x: lx, y: y + 0.8, z: lz }, lay));
        });
        // the height: a line up the north-east corner, outside the yesod, with its ticks at the yesod (1), the sovev (6) and the top (10)
        const hx = ACX + W0 / 2 + 2.6, hz = ACZ - W0 / 2 - 2.6;
        const hm = new MeshBasicMaterial({ color: 0x1e3a8a });
        const post = new Mesh(new BoxGeometry(0.3, AH, 0.3), hm);
        post.position.set(hx, F + AH / 2, hz); post.userData.noPick = true; grp.add(post);
        for (const [hy, txt, what] of [[YS, amotTxt(YS), "גובה היסוד"], [SVH, amotTxt(SVH), "הסובב — מן הרצפה"], [AH, amotTxt(AH), "קומתו — ״ועשר אמות קומתו״"]]) {
          const tick = new Mesh(new BoxGeometry(1.4, 0.16, 0.16), hm);
          tick.position.set(hx - 0.5, F + hy, hz); tick.userData.noPick = true; grp.add(tick);
          ctx.labels.push({ text: txt, x: hx + 1.8, y: F + hy, z: hz - 1.2, size: 2.2, box: true, layers: ["altarMeasures", "altarM_" + key], title: what, info: INFO[key], refs: REFS });
        }
        const bot = new Mesh(new BoxGeometry(1.4, 0.16, 0.16), hm);
        bot.position.set(hx - 0.5, F + 0.06, hz); bot.userData.noPick = true; grp.add(bot);
      }
      ctx.shared.altarMeasures = {
        on: false,
        info: INFO.chronicles + "\n" + INFO.yose,
        refs: REFS,
        get() { return this.on; },
        set(v) { this.on = !!v; measG.visible = this.on; this.sync(); },
        sync() {
          const k = (ctx.shared.altarYose && ctx.shared.altarYose.current) === "yose" ? "yose" : "chronicles";
          for (const key of Object.keys(subs)) subs[key].visible = key === k;
        }
      };
    }
    // --- 1.3.3 (the user: "לסמן בלבד את מקום הלויים"): THE PLACE OF THE LEVITES, a marking on the floor only - no platform: II Chr 5:12
    // "והלוים המשררים... עמדים מזרח למזבח ועמהם כהנים למאה ועשרים מחצרים בחצצרות" (book 39, line 91), at the house's dedication; and
    // II Chr 35:15 "והמשררים בני אסף על מעמדם" - a station of their own. The Second Temple's דוכן (Middot 2:6) is not built here (30-courts.js:
    // "No דוכן"). The strip east of the altar - 8 deep, 28 wide, 4 amot from its east face - and its tint are model choices; in g, so it
    // moves with the altar's place; shown by the place "מקום הלויים המשוררים" for 15 s (ctx.shared.leviimPlace) ---
    {
      const lv = new Group();
      lv.name = "leviim-place";
      lv.visible = false;
      g.add(lv);
      ctx.layers.leviimPlace = lv;
      const X0 = ACX + S / 2 + 4, X1 = X0 + 8, Z0 = ACZ - 14, Z1 = ACZ + 14;
      const fill = new Mesh(new BoxGeometry(X1 - X0, 0.03, Z1 - Z0), new MeshBasicMaterial({ color: 0x2f6fd6, transparent: true, opacity: 0.3, depthWrite: false }));
      fill.position.set((X0 + X1) / 2, F + 0.03, (Z0 + Z1) / 2);
      fill.userData.noPick = true;
      fill.renderOrder = 2;
      lv.add(fill);
      const em = new MeshBasicMaterial({ color: 0x1e40af });
      for (const [w, d, x, z] of [[X1 - X0 + 0.4, 0.4, (X0 + X1) / 2, Z0], [X1 - X0 + 0.4, 0.4, (X0 + X1) / 2, Z1], [0.4, Z1 - Z0, X0, (Z0 + Z1) / 2], [0.4, Z1 - Z0, X1, (Z0 + Z1) / 2]]) {
        const b = new Mesh(new BoxGeometry(w, 0.06, d), em);
        b.position.set(x, F + 0.04, z);
        b.userData.noPick = true;
        lv.add(b);
      }
      const info = "הפסוק, בחנוכת הבית: ״והלוים המשררים לכלם לאסף להימן לידתון ולבניהם ולאחיהם מלבשים בוץ במצלתים ובנבלים וכנרות עמדים מזרח למזבח ועמהם כהנים למאה ועשרים מחצרים בחצצרות״ (דברי הימים ב ה, יב).\nובפסח של יאשיהו: ״והמשררים בני אסף על מעמדם״ (דברי הימים ב לה, טו).\nבמודל: **סימון על הרצפה בלבד, ממזרח למזבח**. הדוכן של בית שני (מידות ב, ו) אינו בנוי כאן. גודל השטח ומרחקו מן המזבח — בחירת מודל.";
      const refs = [["דברי הימים ב ה, יב", { book: 39, index: 91 }], ["דברי הימים ב לה, טו", { book: 39, index: 822 }]];
      ctx.labels.push({ text: "מקום הלויים המשוררים — ״עמדים מזרח למזבח״", x: (X0 + X1) / 2, y: F + 3.2, z: ACZ, size: 2.2, layer: "leviimPlace", info, refs });
      ctx.shared.leviimPlace = { on: false, info, refs, get() { return this.on; }, set(v) { this.on = !!v; lv.visible = this.on; } };
      ctx.shared.flyPoints.leviim = { pos: [X1 + 9, F + 22, ACZ + 27], target: [(X0 + X1) / 2 - 4, F + 1, ACZ - 1] };   // inside the court (its east wall x 91)
    }
    // --- 1.2.0 (the user): THE PLACE OF THE ALTAR in the court - the Tannaim's dispute (Yoma 16a; Zevachim 58b-59a, 63a). All agree the
    // ramp stood at the altar's south (Rav Huna from "ירך המזבח צפונה", R. Yehuda from "ומעלותיהו פנות קדים"); they differ where the altar
    // and its ramp stood in the court's 135 amot north to south: R. Eliezer b. Yaakov - "כוליה מזבח בדרום קאי" (so the Rambam rules);
    // R. Yose (R. Yose HaGelili, R. Elazar) - "כוליה מזבח בצפון קאי"; R. Yehuda - in the middle, half north and half south. The whole
    // group moves (the body, the yesod and sovev, the ramp and the small ramps, the shitin, the fire): "כוליה" = the body of 20 (model
    // choice): south = its north edge on the house's axis, north = its south edge on it, middle = centred (the 1.0.x model). The court's
    // slaughter place (30-courts.js) and the mechonot's route (45-vessels.js) stay. The labels and the fly points follow. ---
    {
      const S2 = CO2.ALTAR;
      const mine = ctx.labels.slice(altLabel0);
      const base = mine.map((l) => l.z);
      const FPK = ["mizbeach", "mizbeachSW", "mizbeachRamps", "shitin", "mizbeachTop", "mizbeachMeasures", "sfalim", "leviim", "rampGap"];   // 1.3.3: the measures' view too
      const fp0 = {};
      for (const k of FPK) if (ctx.shared.flyPoints[k]) fp0[k] = { pos: ctx.shared.flyPoints[k].pos.slice(), target: ctx.shared.flyPoints[k].target.slice() };
      const PLACE = {
        title: "מקום המזבח בעזרה",
        current: "south",
        keys: ["south", "north", "middle"],
        dz: { south: S2 / 2, north: -S2 / 2, middle: 0 },
        names: {
          south: "רבי אליעזר בן יעקב — כולו בדרום",
          north: "רבי יוסי — כולו בצפון",
          middle: "רבי יהודה — באמצע העזרה"
        },
        info: {
          south: "בגמרא: 'כוליה מזבח בדרום קאי' — המזבח והכבש עמדו כולם בחלק הדרומי של העזרה (וכן פסק הרמב״ם).\nבמודל: **גוף המזבח מתחיל בקו ציר הבית ונמשך דרומה**, והכבש ממנו הלאה לדרום; פתח ההיכל אינו חסום על ידי גוף המזבח.",
          north: "בגמרא: 'כוליה מזבח בצפון קאי' — שיטת רבי יוסי (וכן רבי יוסי הגלילי ורבי אלעזר).\nבמודל: **המזבח בחצי הצפוני של העזרה**, והכבש נמשך ממנו לצד הדרום, אל מול פתח ההיכל.",
          middle: "רבי יהודה: המזבח היה ממוצע ועמד באמצע העזרה ממש — חציו בצפון וחציו בדרום.\nבמודל: **גוף המזבח והכבש בקו ישר כנגד פתח ההיכל**, וחוסמים את מראה הפתח."
        },
        lead: "מחלוקת התנאים במקום המזבח והכבש בעזרה (יומא טז., זבחים סג.).\nהמוסכם: הכבש עמד בצדו הדרומי של המזבח עצמו — כדדרש רב הונא מ'ירך המזבח צפונה', וכדדרש רבי יהודה מ'ומעלותיהו פנות קדים'.\nהמחלוקת: היכן עמדו המזבח והכבש בתוך חלל העזרה, שרוחבה 135 אמות מצפון לדרום — באמצע, בצפון או בדרום. היא קובעת לא רק את מקום הכבש, אלא גם **אם גוף המזבח והכבש עמדו בקו ישר כנגד פתח ההיכל וחסמו את מראהו**.\nבמודל: 'כוליה' = גוף המזבח (עשרים על עשרים); היסוד, הכבש, הכבשים הקטנים והשיתין זזים עמו (בחירת מודל).",
        refs: [["יומא טז.", ["P", 107, "טז."]], ["זבחים סג.", ["P", 130, "סג."]], ["זבחים נח:", ["P", 130, "נח:"]], ["רמב״ם בית הבחירה ה, יג", ["RB", 5, 13]]],
        get() { return this.current; },
        set(key) {
          if (!(key in this.dz)) return false;
          this.current = key;
          const dz = this.dz[key];
          g.position.z = dz;
          g.updateMatrixWorld(true);
          let lg = null;
          try { lg = ctx.root.getObjectByName("labels"); } catch (_) {}
          mine.forEach((l, i) => {
            const oz = l.z;
            l.z = base[i] + dz;
            if (lg) for (const spr of lg.children) {
              if (spr.userData && spr.userData.label === l) { spr.position.z = l.z; break; }
              if (Math.abs(spr.position.x - l.x) < 1e-3 && Math.abs(spr.position.y - l.y) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3) { spr.position.z = l.z; break; }
            }
          });
          for (const k of FPK) if (fp0[k] && ctx.shared.flyPoints[k]) {
            const f = ctx.shared.flyPoints[k];
            f.pos = [fp0[k].pos[0], fp0[k].pos[1], fp0[k].pos[2] + dz];
            f.target = [fp0[k].target[0], fp0[k].target[1], fp0[k].target[2] + dz];
          }
          // 1.2.2: the mechona's demonstration stops beside the ramp - its route follows (45-vessels.js demo.rebuild)
          try { const m = ctx.shared.mechona; if (m && m.demo && typeof m.demo.rebuild === "function") m.demo.rebuild(); } catch (_) {}
          if (axis) axis.visible = false;
          return true;
        }
      };
      // 1.2.2 (the user: "שיהיה ברור איזה צד"): the house's axis drawn on the court - a bright strip from the ulam's front eastward, z = 0,
      // shown by the row "מקום המזבח" for 15 s with the far view (ctx.shared.altarAxis); the altar's body north / south of it is then plain
      // (a group registered as a label layer, so that its label shows only with the line; 1.5 wide - from the far view 0.5 was a hairline)
      const axis = new Group();
      axis.name = "altar-axis-line";
      axis.visible = false;
      const axl = new Mesh(new BoxGeometry(CO2.azE - CO2.xUlamE - 1, 0.1, 1.5), new MeshBasicMaterial({ color: 0xe39a1c, transparent: true, opacity: 1, depthWrite: false }));
      axl.position.set((CO2.xUlamE + CO2.azE) / 2, F + 0.08, 0);
      axl.userData.noPick = true;
      axl.renderOrder = 3;
      axis.add(axl);
      ctx.root.add(axis);
      ctx.layers.altarAxis = axis;
      ctx.labels.push({ text: "קו ציר הבית — כנגד פתח ההיכל", x: (CO2.xUlamE + CO2.azE) / 2 + 12, y: F + 2.2, z: 0, size: 2.4, layer: "altarAxis" });
      ctx.shared.altarAxis = { get: () => axis.visible, set: (on) => { axis.visible = !!on; } };
      ctx.shared.altarPlace = PLACE;
      PLACE.set("south");   // the user: the default - in the south, as the Rambam rules
    }
  }
