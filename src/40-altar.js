  // ===== 40-altar.js: מזבח הנחושת (the bronze altar of Solomon) =====
  // II Chr 4:1 "ויעש מזבח נחשת עשרים אמה ארכו ועשרים אמה רחבו ועשר אמות קומתו". User decision: the altar is BRONZE
  // (the verse), not stone. Kings I does not describe the altar (only "המזבח" in 8:64, 9:25), so every detail beyond
  // 20 x 20 x 10 is a model choice, marked below. Placement (CO.xAltarW/E, CO.altarZ): west face 21 amot east of the ulam front
  // after Middot 5:1 (model choice), centred on the house axis.
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

    const F = LV2.AZ;                                  // court floor, y 6 (inner court level, model choice: see 10-core.js)
    const S = CO2.ALTAR;                               // 20: II Chr 4:1 "עשרים אמה ארכו ועשרים אמה רחבו"
    const AH = CO2.ALTAR_H;                            // 10: II Chr 4:1 "ועשר אמות קומתו"
    const ACX = (CO2.xAltarW + CO2.xAltarE) / 2;       // 49.5: x 39.5..59.5 (west face 21 east of the ulam front, Middot 5:1 convention)
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

    // --- the body: 20 x 20 x 10, y 6..16 (II Chr 4:1) ---
    bodyParts.push(H2.box(g, S, AH, S, BR, ACX, F, ACZ));

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
    const XW = ACX - MID / 2, XE = ACX + MID / 2;      // 38.5, 60.5: the wall's west and east faces
    const ZN = ACZ - MID / 2, ZS = ACZ + MID / 2;      // -11, 11: its north and south faces
    bodyParts.push(H2.box(g, MID, SVH, MID, BR, ACX, F, ACZ));   // the wall up to the sovev, y 6..12 (the body stands inside it)
    bandParts.push(
      H2.box(g, YO, YS, YS, BRD, ACX, F, ZN - YS / 2),                     // north, the whole side with both corners: x 37.5..61.5, z -12..-11
      H2.box(g, YS, YS, MID + YS, BRD, XW - YS / 2, F, ACZ + YS / 2),      // west, the whole side with the south-west corner: z -11..12
      H2.box(g, MID, YS, YS, BRD, ACX, F, ZS + YS / 2),                    // south, to the end of the face: x 38.5..60.5, z 11..12
      H2.box(g, YS, YS, 1, BRD, XE + YS / 2, F, ZN + 0.5)                  // east: one amah at the north-east corner, z -11..-10
    );
    // the red line, חוט הסיקרא: "חוגרו באמצע" (Middot 3:1) - at 5 amot, half the altar's 10 (II Chr 4:1), one amah below the sovev as
    // Rambam Beit HaBechira 2:9 "כששה טפחים מסוף הסובב ולמטה"; 0.12 high and 0.02 out of the wall (model choice: thin, but seen from
    // the court); red in both looks
    const RED = new MeshStandardMaterial({ color: 0xa8231b, roughness: 0.7, metalness: 0, emissive: 0x3a0806, emissiveIntensity: 0.6 });
    {
      const RY = F + AH / 2 - 0.06, RT = 0.02, RH = 0.12;
      H2.box(g, MID + 2 * RT, RH, RT, RED, ACX, RY, ZN - RT / 2);
      H2.box(g, MID + 2 * RT, RH, RT, RED, ACX, RY, ZS + RT / 2);
      H2.box(g, RT, RH, MID, RED, XW - RT / 2, RY, ACZ);
      H2.box(g, RT, RH, MID, RED, XE + RT / 2, RY, ACZ);
    }

    // --- a lip 0.5 high and 0.5 thick around the top edge (model choice; cf. the כרכוב of Ex 27:5) ---
    // The south lip is interrupted where the ramp meets the altar (x 41.5..57.5, model choice).
    {
      const LIP = 0.5;
      bodyParts.push(
        H2.box(g, S, LIP, LIP, BR, ACX, TOP, ACZ - S / 2 + LIP / 2),                     // north
        H2.box(g, 2, LIP, LIP, BR, CO2.xAltarW + 1, TOP, ACZ + S / 2 - LIP / 2),         // south, west stub (x 39.5..41.5)
        H2.box(g, 2, LIP, LIP, BR, CO2.xAltarE - 1, TOP, ACZ + S / 2 - LIP / 2),         // south, east stub (x 57.5..59.5)
        H2.box(g, LIP, LIP, S - 2 * LIP, BR, CO2.xAltarE - LIP / 2, TOP, ACZ),           // east
        H2.box(g, LIP, LIP, S - 2 * LIP, BR, CO2.xAltarW + LIP / 2, TOP, ACZ)            // west
      );
    }

    // --- four horns 1 x 1 x 1 at the corners (model choice after Ex 27:2; plan after Middot 3:1 "מקום הקרנות אמה מזה ואמה מזה";
    // height 1 a model choice after the altar baraita, Zevachim 54a) ---
    for (const sx of [-1, 1]) for (const sz of [-1, 1])
      bodyParts.push(H2.box(g, 1, 1, 1, BR, ACX + sx * (S / 2 - 0.5), TOP, ACZ + sz * (S / 2 - 0.5)));

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
    const prism = (xa, xb, pts, mat) => {
      const sh = new Shape();
      sh.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
      sh.closePath();
      const geo = new ExtrudeGeometry(sh, { depth: xb - xa, bevelEnabled: false });
      geo.rotateY(-Math.PI / 2);
      geo.translate(xb, F, 0);
      const m = new Mesh(geo, mat);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
      return m;
    };
    {
      const RW = 16;                                   // Middot 3:3 "וכבש היה לדרומו של מזבח, שלשים ושתים על רחב שש עשרה" (convention)
      // z 10.04: the end at the top; z 11.04 over the sovev; z 12.04 over the yesod; z 12.04..42 on the floor
      prism(ACX - RW / 2, ACX + RW / 2, [
        [ZS + YS + GAP, 0], [42, 0], [ACZ + S / 2 + GAP, RTOP(ACZ + S / 2 + GAP)],
        [ACZ + S / 2 + GAP, SVH + GAP], [ZS + GAP, SVH + GAP], [ZS + GAP, YS + GAP], [ZS + YS + GAP, YS + GAP]
      ], AS);
    }

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
      sovevEast: prism(RX1 - 0.01, RX1 + SRW, toSovev, AS),
      // west of it, down to the southern yesod (x 40.25..41.5): from 2 amot to the yesod's top, 1 amah
      yesod: prism(RX0 - SRW, RX0 + 0.01, [[ZS + YS + GAP, 0], [BRZ, 0], [BRZ, 2], [ZS + YS + GAP, YS]], AS),
      // Tosafot: the raised half of the same wide western ramp, up to the sovev (x 39..40.25), hidden for Rashi (the default)
      sovevWest: prism(RX0 - 2 * SRW, RX0 - SRW + 0.01, toSovev, AS)
    };
    smallRamps.sovevWest.visible = false;
    for (const [k, m] of Object.entries(smallRamps)) m.name = "smallRamp_" + k;

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
        g.add(m);
      };
      hole(SHX - 0.3, SHZ - 0.6, false);              // by the yesod's west face, 0.6 north of the corner
      hole(SHX + 1.1, SHZ + 0.3, true);               // by its south face, 1.1 east of the corner (the small ramps start at x 39)
      // the slab: x 37.1..38.1, z 12.6..13.6, a dark joint 0.05 round it, 0.04 above the floor (model choice, so that it reads)
      const SCX = SHX + 0.1, SCZ = SHZ + 1.1;
      const joint = new MeshBasicMaterial({ color: 0x2a2520 });
      H2.box(g, 1.1, 0.012, 1.1, joint, SCX, F, SCZ).castShadow = false;
      const slabMat = M2.marble.clone();
      slabMat.color.set(0xf4efe4);
      const slab = H2.box(g, 1, 0.04, 1, slabMat, SCX, F, SCZ);   // "מקום היה שם אמה על אמה, וטבלא של שיש" (Middot 3:3)
      slab.name = "shitinSlab";
      // "וטבעת היתה קבועה בה": a ring lying flat on the slab, held by a small staple at its north side (model choice)
      const ring = new Mesh(new TorusGeometry(0.15, 0.025, 8, 28), M2.bronze);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(SCX, F + 0.04 + 0.025, SCZ + 0.05);
      ring.castShadow = true;
      g.add(ring);
      H2.box(g, 0.1, 0.05, 0.06, M2.bronze, SCX, F + 0.04, SCZ - 0.1);
    }

    // --- the fire: three pyres (מערכות) of cedar logs (model choice as in the Second Temple model, after Yoma 45a; the First Temple
    // verses only mention the burnt offerings on the altar: I Kings 8:64, 9:25; II Chr 7:1 "והאש ירדה מהשמים") ---
    const PX = ACX + 4.5, PZ = ACZ - 1.5;              // the big pyre, east of the centre (model choice)
    const E1X = ACX - 5.5, E1Z = ACZ + 5.5;            // second pyre (model choice)
    const E2X = ACX - 5.5, E2Z = ACZ - 6;              // third pyre (model choice)
    const logs = [];
    const addPyre = (cx, cz, len, r, layers) => {
      for (let l = 0; l < layers; l++) {
        const n = l === layers - 1 ? 2 : 3, alongX = l % 2 === 0;
        for (let i = 0; i < n; i++) {
          const off = (i - (n - 1) / 2) * len * 0.3;
          logs.push({
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
    addPyre(E2X, E2Z, 2.4, 0.17, 2);
    {
      const geo = new CylinderGeometry(1, 1, 1, 8);
      const inst = new InstancedMesh(geo, M2.cedar, logs.length);
      const m42 = new Matrix4(), q = new Quaternion(), e = new Euler();
      const p = new Vector3(), s = new Vector3();
      logs.forEach((L, i) => {
        e.set(L.alongX ? 0 : Math.PI / 2, 0, L.alongX ? Math.PI / 2 : 0);
        q.setFromEuler(e);
        p.set(L.x, L.y, L.z);
        s.set(L.r, L.len, L.r);
        m42.compose(p, q, s);
        inst.setMatrixAt(i, m42);
      });
      inst.castShadow = inst.receiveShadow = true;
      g.add(inst);
    }
    const flames = [];
    const addFlame = (x, y, z, r, h, color, op) => {
      const geo = new ConeGeometry(r, h, 10);
      geo.translate(0, h / 2, 0);
      const m = new Mesh(geo, new MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false }));
      m.position.set(x, y, z);
      m.castShadow = false;
      m.renderOrder = 2;
      m.userData.op = op;
      g.add(m);
      flames.push(m);
    };
    addFlame(PX, TOP + 1.1, PZ, 1.5, 3.6, 0xff791e, 0.75);
    addFlame(PX + 0.4, TOP + 1.15, PZ + 0.3, 0.95, 2.5, 0xffb730, 0.85);
    addFlame(PX - 0.3, TOP + 1.2, PZ - 0.3, 0.55, 1.7, 0xffdf8a, 0.9);
    addFlame(E1X, TOP + 0.55, E1Z, 0.65, 1.5, 0xffb730, 0.8);
    addFlame(E2X, TOP + 0.55, E2Z, 0.6, 1.3, 0xff791e, 0.8);
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
      const ashMat = M2.altarStone.clone();
      ashMat.color.set(0x555049);
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

    // --- 1.0.2: השיתין - the text, the sources (book id + line index, each line read in the Otzaria DB), the label and the fly point ---
    {
      const SHITIN_INFO = "השיתין (השלמה מן המשנה): 'ובקרן מערבית דרומית היו שני נקבים, כמין שני חטמין דקין' — הדם יורד בהם "
        + "ויוצא לנחל קדרון (מדות ג, ב; רמב״ם בית הבחירה ב, יא). 'למטה ברצפה באותה הקרן, מקום היה שם אמה על אמה, וטבלא של שיש, "
        + "וטבעת היתה קבועה בה, שבו יורדין לשית ומנקין אותו' (מדות ג, ג). המשנה מתארת את מזבח הבית השני, אבל השיתין היו גם בבית "
        + "ראשון: 'שיתין מששת ימי בראשית נבראו' (סוכה מט.), ו'בשעה שכרה דוד שיתין' (סוכה נג.). בימי שלמה היה 'כמין בור כרוי אצל "
        + "המזבח באותה זוית', וכשעלו בני הגולה 'קלטו אותו הבור לתוך המזבח ועשו נקבים כנגדן בראש המזבח' (רש״י זבחים סא:). "
        + "כאן פי הבור מסומן בשני פתחים ברצפה לרגלי היסוד שבקרן, אחד במערב ואחד בדרום (בחירת המודל).";
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
          info: "היסוד (השלמה מן המשנה): 'שכל מזבח שאין לו קרן וכבש ויסוד וריבוע – פסול' (זבחים סב.), ולכן גם למזבח שלמה היה יסוד. "
            + "צורתו כמשנה: 'עלה אמה וכנס אמה, זה היסוד' (מדות ג, א). בבית שני 'קרן מזרחית דרומית לא היה לה יסוד... לפי שלא היתה "
            + "בחלקו של טורף' (זבחים נג:). ובבית ראשון כתבו התוספות: 'היה להם יסוד לדרום שהיה משוך בחלקו של טורף חוץ "
            + "מרוח מזרחית שלא נשתנה שהיה בלא יסוד' (תוספות זבחים סא:). לכן כאן היסוד על פני כל הצפון, כל המערב וכל הדרום, ובמזרח רק אמה אחת בקרן "
            + "הצפונית; לקרן הדרומית המזרחית אין יסוד בצד המזרח. "
            + "עשרים על עשרים של הפסוק (דברי הימים ב ד, א) הם כאן גוף המזבח, והיסוד והסובב בולטים סביבו, כמו שכתב רש״י על מזבח משה: "
            + "'יסוד וסובב לא היו ממעטין בארכו ורחבו לפי שמקיפין ובולטין סביביו' (רש״י זבחים נט:). ולרש״י, כרבי יוסי במדות, "
            + "'בתחילה בימי שלמה לא היה אלא כ\"ח' (רש״י זבחים סא:), ועשרים על עשרים הם מקום המערכה. כאן המזבח לא הורחב — בחירת המודל.",
          refs: [
            ["זבחים סב.", { book: 130, index: 2110 }], ["מדות ג, א", { book: 89, index: 19 }], ["זבחים נג:", { book: 130, index: 1865 }],
            ["תוספות זבחים סא:", { book: 1936, index: 654 }], ["רש״י זבחים נג:", { book: 2191, index: 2590 }],
            ["רש״י זבחים נט:", { book: 2191, index: 2871 }], ["רש״י זבחים סא:", { book: 2191, index: 2952 }],
            ["רמב״ם בית הבחירה ב, י", { book: 337, index: 33 }], ["דברי הימים ב ד, א", { book: 39, index: 57 }]
          ]
        },
        sovev: {
          title: "הסובב",
          info: "הסובב (השלמה מן המשנה): 'עלה חמש וכנס אמה. זה הסובב' (מדות ג, א) — מדף של אמה סביב המזבח, שש אמות מן הרצפה. "
            + "עליו הולך הכהן לתת את הדם בקרנות: 'עלה בכבש ופנה לסובב, ובא לו לקרן דרומית מזרחית' (זבחים נג.). "
            + "'איזהו כרכוב?... רבי יוסי ברבי יהודה אומר: זה הסובב' (זבחים סב.), ורש״י שם במזבח משה: 'סביב הקיר משעלה שש אמות גובה... "
            + "היקף הבליטה קטנה חוגרתו סביב לנוי וזהו סובב' (רש״י זבחים סב.). הכבש 'פורח אמה על יסוד ואמה על סובב' (זבחים סב:), "
            + "'ואויר מעט היה מפסיק בין הכבש למזבח' (רמב״ם בית הבחירה ב, יג).",
          refs: [
            ["מדות ג, א", { book: 89, index: 19 }], ["זבחים נג.", { book: 130, index: 1844 }], ["זבחים סב.", { book: 130, index: 2109 }],
            ["רש״י זבחים סב.", { book: 2191, index: 2987 }], ["זבחים סב:", { book: 130, index: 2131 }],
            ["רמב״ם בית הבחירה ב, ז", { book: 337, index: 30 }], ["ב, יג", { book: 337, index: 36 }]
          ]
        },
        redLine: {
          title: "חוט הסיקרא",
          info: "חוט הסיקרא (השלמה מן המשנה): 'וחוט של סקרא חוגרו באמצע, להבדיל בין הדמים העליונים לדמים התחתונים' (מדות ג, א); "
            + "'כששה טפחים מסוף הסובב ולמטה' (רמב״ם בית הבחירה ב, ט). כאן באמצע גובה המזבח, חמש אמות מן הרצפה, אמה מתחת לסובב. "
            + "עוביו — בחירת המודל.",
          refs: [["מדות ג, א", { book: 89, index: 19 }], ["רמב״ם בית הבחירה ב, ט", { book: 337, index: 32 }]]
        }
      };
      const lay = new Group();
      lay.name = "altarProfile";
      lay.visible = false;
      g.add(lay);
      ctx.layers.altarProfile = lay;
      // on the east side, which the altar's fly point (from the south-east) sees: each beside its own step, 1.6 out (checked in a render)
      ctx.labels.push(
        { text: "הסובב", x: XE + 1.6, y: F + SVH + 1.2, z: ACZ - 3, size: 2.2, layer: "altarProfile", info: PROFILE.sovev.info, refs: PROFILE.sovev.refs },
        { text: "חוט הסיקרא", x: XE + 1.6, y: F + AH / 2 - 0.9, z: ACZ + 3, size: 2, layer: "altarProfile", info: PROFILE.redLine.info, refs: PROFILE.redLine.refs },
        { text: "היסוד", x: XE + 1.6, y: F + 1.6, z: ZN - 0.5, size: 2.2, layer: "altarProfile", info: PROFILE.yesod.info, refs: PROFILE.yesod.refs }
      );
      ctx.shared.altarProfile = PROFILE;
      const AC = new Vector3(ACX, F + AH / 2, ACZ);
      ctx.animated.push(() => {
        const cam = ctx.camera;
        if (cam) lay.visible = cam.position.distanceTo(AC) < 130;
      });
    }

    // --- 1.0.2 (add-on): the two readings of the small ramps - Rashi (the default) or Tosafot; only the western ramp to the sovev changes ---
    {
      const RAMP_INFO = {
        rashi: "'שני כבשים קטנים יוצאין מן הכבש, שבהן פונים ליסוד ולסובב; ומובדלין מן המזבח מלא נימא' (זבחים סב:). רש״י שם: 'אותו שפונין "
          + "בו לסובב יצא במזרחו של כבש לימין... ונמשך ועולה באלכסון עד שמגיע לסובב והפונה ליסוד יוצא למערבו... ומתחיל לצאת בשיפולו "
          + "של כבש רחוק מן המזבח כדי שיהא נוח לשפע ולירד ליסוד' (רש״י זבחים סב:). ובמערב אין כבש לסובב: 'אבל לצד המערב אין לו [כבש] לפנות לסובב "
          + "וצריך לעלות על ראש המזבח ועומד בדרומה של קרן' (רש״י זבחים סד.). מקום תחילתם ורוחבם — בחירת המודל.",
        tosafot: "התוספות: 'ונראה דאין משם ראי' שלא היה כבש לסובב במערב', שאם לא כן, בדם החטאת 'כשהיה מגיע לקרן מערבית "
          + "דרומית היה צריך לחזור על עקיבו ולכך נראה דהיה שם כבש' (תוספות זבחים סד.). ולמה מנו רק שניים? תוספות יום טוב: 'שאותו כבש עצמו "
          + "היה רחב ומקצת ממנו מוגבה ועולה עד על הסובב גם כן' (תוספות יום טוב זבחים ו, ג). וכן הביא המשנה למלך: 'התוספות ס\"ל דגם במערבו "
          + "היה כבש קטן פונה לסובב' (משנה למלך בית הבחירה ב, יד). כאן הכבש המערבי רחב, וחציו החיצון עולה לסובב."
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
        options: [{ key: "rashi", label: "רש״י: לסובב רק ממזרח לכבש" }, { key: "tosafot", label: "תוספות: לסובב גם ממערב לכבש" }],
        info: RAMP_INFO,
        refs: RAMP_REFS,
        fly: "mizbeachRamps",
        get current() { return cur; },
        get() { return cur; },
        set(key) {                                     // shows or hides the western ramp to the sovev; returns the current key
          if (key !== "rashi" && key !== "tosafot") return cur;
          smallRamps.sovevWest.visible = key === "tosafot";
          cur = key;
          return cur;
        }
      };
      ctx.shared.altarRamps = ramps;
      // the small ramps from the south-west, high (above the bases' block): the western ramps along the big ramp's west face and where
      // they meet the yesod and the sovev, which is where the two readings differ (1.0.2 fix, the review: the old view down the ramp's
      // axis, [ACX, F + 24, 62], showed them as thin strips and both readings looked the same; checked in renders with the card open on
      // the left, both readings; model choice) = [24, 28, 44] looking at [42, 8, 16]
      ctx.shared.flyPoints.mizbeachRamps = { pos: [SHX - 13.5, F + 22, SHZ + 32], target: [RX0 + 0.5, F + 2, ZS + 5] };
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
        options: [{ key: "stone", label: "מזבח אבנים" }, { key: "abarbanel", label: "אברבנאל: מצופה נחושת" }],
        info: {
          stone: "המזבח כאן בצבע אבן: 'אבנים שלמות תבנה את מזבח ה׳ אלהיך' (דברים כז, ו); 'המזבח אין עושין אותו אלא בנין אבנים' "
            + "(רמב״ם בית הבחירה א, יג). השם כלשון הפסוק: 'כי מזבח הנחשת אשר לפני ה׳ קטן' (מלכים א ח, סד). המראה בחירת המודל.",
          abarbanel: "אברבנאל: 'ועם היותו מזבח אבנים כמו שצותה התורה, הנה קראו מזבח הנחשת, לפי שהיה מצופה נחשת, "
            + "כמו שנקרא מזבח הזהב להיותו מצופה זהב' (אברבנאל מלכים א ח, סד). כאן המזבח כולו — היסוד, הסובב, השפה והקרנות — מצופה נחושת, וכך גם הכבש והכבשים הקטנים, שהכבש חלק מן המזבח: 'כל מזבח שאין לו קרן וכבש ויסוד וריבוע – פסול' (זבחים סב.)."
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
        f.scale.y = 1 + 0.15 * n;
        f.scale.x = f.scale.z = 1 + 0.06 * Math.sin(s * 12.3 + i * 3.1);
        f.material.opacity = f.userData.op * (0.85 + 0.15 * n);
      }
      fireLight.intensity = 23 + 4.5 * Math.sin(s * 9.7) + 2.5 * Math.sin(s * 22.3 + 1.3);
      emberLight.intensity = 5.5 + 1.4 * Math.sin(s * 7.3);
      for (let i = 0; i < smoke.length; i++) {
        const sp = smoke[i];
        const p = (s * 0.045 + i / smoke.length) % 1;
        sp.position.set(
          PX + Math.sin(s * 0.55 + i * 1.9 + p * 5) * (0.3 + p * 1.7),
          TOP + 1.6 + p * 40,
          PZ + Math.cos(s * 0.5 + i * 2.7 + p * 4) * (0.25 + p * 1.3)
        );
        const sc2 = 2.2 + p * 6.5;
        sp.scale.set(sc2, sc2, 1);
        sp.material.opacity = 0.17 * (p < 0.12 ? p / 0.12 : 1 - (p - 0.12) / 0.88);
      }
    });
  }
