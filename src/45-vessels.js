  // ===== 45-vessels.js: כלי הנחושת של חירם בחצר (Hiram's bronze works in the priests' court, I Kings 7:13-47; II Chr 4:2-18) =====
  // The Sea on twelve oxen (I Kings 7:23-26, 7:39, 7:44; II Chr 4:2-5, 4:10, 4:15), Moses' laver (II Chr 4:6 "חמשה מימין וחמשה משמאול"; Rashi there
  // "ויתן חמשה מימין. לכיור של משה", Metzudat David there "מימין. של הכיור שעשה משה": right and left of the laver of Moses; Radak on I Kings 7:39 only as a second reading,
  // "או יהיה פירוש מימין כיור שעשה משה ומשמאלו") and the ten bases with their ten lavers
  // (I Kings 7:27-39; II Chr 4:6, 4:14). Yachin and Boaz are built in 50-heichal.js (they stand inside the ulam).
  // Two placements of the Sea are built in (ctx.shared.seaPlacement): 'rashi' = north-east (Rashi on I Kings 7:39 "משוך מצד דרום לצד
  // צפון... מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה") - the default; 'radak' = south-east (Radak, Metzudat
  // David, Ralbag on I Kings 7:39; Rashi on II Chr 4:10 "רחק אותו מן המזרח מן כנגד הפתח לדרומה של עזרה"). 1.0.1-L: both in the court's
  // corner (vsl_layout): Rashi's at x 80, z -54; the second reading's at x 80, z 54 (the south-east corner is free since FIXES L.21 moved
  // לשכת הגזית to the north wall, east of the eastern north gate - the Sea keeps at least 1 amah from it, vsl_layout).
  // 1.0.1-K (FIXES J.2 / K.3; the user: "ראשי הבקר יותר בולטים החוצה ויותר הבלטה שזהו ראש בקר"; "לא מצליחים לראות את המכונות ופעולתם
  // היטב - אין לשם גישה"): new oxen whose front halves stand outside the basin with real ox heads (the book p16); the bases rebuilt after
  // Rashi, "בעל צורת הבית" (printed after Rashi 7:37), the Metzudot and the book (p17-p19): spoked wheels "אופן בתוך אופן", a body of
  // bars and relief panels, the roof (כותרת), the mouth, the כן and a laver 4 high; ONE base (1.0.1-L: in the block's north row, the
  // easternmost with a free way north past the altar) is built as moving parts. Contracts (FIXES-1.0.1-K 0.5):
  //   ctx.shared.mechona = { demo: {start(), stop() (finishes its round fast and parks), reset() (parks at once), seek(sec), running,
  //     home, duration, path, station (1.0.1-L: [x, z] of its stop beside the altar), pourAt (1.0.1-L: [from, to] seconds of the
  //     water), washStation / washAt (1.0.1-L, L.64: the first stop by the ramp for the priests' hands and feet, and its seconds)}, explode:
  //     {set(on, instant), on}, partLabels (the label objects, moved with the base), group, home, purposeLabel, washLabel,
  //     follow (1.0.2, item 9: the demonstration's follow view - {start(), stop(), snap(), on, view(tau) -> {pos, target}}; the
  //     pill "mechonaDemo" starts it, a drag / pinch / wheel on the canvas or any other move of the camera ends it) }
  //   ctx.shared.modelButtons += "mechonaDemo" (1.0.1-L: "הבא את הכיור להדחת העולה" / "עצור את המכונה") and "mechonaExplode" ("פרק:
  //     כיור, כן ומכונה" / "הרכב בחזרה"), anchored above the moving base (one preallocated anchor array each), maxDist 70; the explode
  //     pill also shows / hides the part labels (1.0.1-K review)
  //   ctx.layers.mechonaParts (hidden Group): gates the seven part labels (layer "mechonaParts")
  //   ctx.layers.mechonaPurpose (1.0.1-L, hidden Group): the demonstration's own label at its stop ("הדחת קרבי העולה..."), shown by the
  //     demonstration itself while the base stands there - not a panel layer; ctx.layers.mechonaWash (1.0.1-L, L.64): the same for the
  //     label of the priests' washing at the first stop by the ramp
  //   flyPoints: yam and yamOxen (follow seaPlacement.set), mechonot, mechonaClose, mechonaParts (the exploded base), mechonaDemo (1.0.1-L:
  //     the route from the block to the slaughter place north of the altar; 1.0.2: kept, the pill flies to the follow view), kiyorMoshe (1.0.1-L, L.74: along the aisle between the rows)
  //   The ידות: for Rashi (7:28, 7:32, 7:33) and בעל צורת הבית the axles / rods; the vertical posts and the small lying wheel follow the
  //     book's drawing (p19L) - a model choice (1.0.1-K review; vsl_baseParts)
  // 1.0.1-L (FIXES-1.0.1-L; the user's answers of 29.10.2026):
  //   L.7 "כרש"י ובספר" - the Sea stands in the CORNER (מקצוע) of the inner court as the book p20 draws it: its axis 11 amot from the
  //     inner faces of the east wall and of the north wall (Rashi) / the south wall (the second reading), the oxen's muzzles 3.83 from the
  //     walls (room to walk round); it keeps at least 1 amah between the muzzles and לשכת הגזית (30-courts.js, ctx.shared.lishkatHaGazit;
  //     FIXES L.21 puts it on the north wall west of the Sea), sliding deeper into the corner first if the chamber comes nearer
  //     (vsl_layout); yam / yamOxen re-aimed from inside the court (seaPlacement.flyPoint / oxenFlyPoint)
  //   L.8 "בתוך, רק שיראו ברור" - the bases' wheels stay inside the 4 x 4 but their outer faces are at its edge (the posts and the small
  //     lying wheels moved inboard of them), with a thicker rim, spokes and hub in a darker bronze than the body (VSL_WHEEL_Z, vsl_baseParts)
  //   L.9 "תוסיף" - two taps on every laver of the bases, as the book draws them (p17-p19; p. לח along the rows): a model choice "כציור הספר"
  //     (spouts on the lavers: Metzudat Zion II Chr 4:6 "כעין דוד ולה דדים המריקים מים"; two: Mishnah Yoma 3:10 "שלא היו לו אלא שנים"; their form and place are the book's); part of the laver's geometry, so they are instanced, ride on the moving base and rise with the explode; their
  //     spouts just outside the base's body, so that the demonstration's water (L.40) falls clear of it to the floor
  //   L.10 "תסיר" - the twelve spouts of Moses' laver are removed (Ben Katin's, Mishnah Yoma 3:10: Second Temple); later the user: "תוסיף ברזים לכיור משה (2)": the two the same Mishnah gives it before him
  //   L.40 "מה היה תפקידה של המכונה?" - the sources: the base is the laver's seat (Radak 7:27 "המכונה היא מושב הכיור"; Ralbag 7:27;
  //     Metzudat David 7:27), the lavers rinse the burnt offering (II Chr 4:6 "את מעשה העולה ידיחו בם"; Rashi there "מן מימי הכיור ידיחו
  //     קרבי העולה") and, for Radak 7:39, Ralbag 7:38 and Abarbanel 7:27, the priests' hands and feet; the wheels carry it (Metzudat David
  //     7:30 "כאלו ישאו אותה") wherever it is needed (בעל צורת הבית: "למען יוכל להוליכם אל אשר יהיה הרוח והרצון להוליכם"). The
  //     demonstration takes the laver to the slaughter place north of the altar, where the burnt offering is slaughtered (Lev 1:11 "על
  //     ירך המזבח צפנה") and its innards are rinsed on the marble tables (Shekalim 6:4 "שעליהן מדיחין את הקרבים"; 30-courts.js, L.68),
  //     lets its water run from the tap for the rinsing of the innards and legs (Lev 1:9 "וקרבו וכרעיו ירחץ במים") under the label of
  //     the purpose (layer mechonaPurpose), and brings it back (route, stop and water: model choices on these sources)
  // 1.0.1-L, the user's messages of 31.10.2026 (FIXES-1.0.1-L Part 4; vessels-2):
  //   L.61 "במסגרות שבין השלבים... היו 3 מכל צד - ביאור הגר"א" - each side of the body carries THREE panels (מסגרות בין השלבים) between
  //     its rungs (two rungs between the corner posts; vsl_baseParts, vsl_reliefAtlas). The Gra's commentary on Kings is not in the
  //     Otzaria library (49 of his works are, none on Kings; the library's others cite it - רש"ש on Yoma 59a "ביאור הגר"א ז"ל במלכים א", רד"ל on Pirkei d'Rabbi Eliezer 7:22): the user's citation, A3 "אני הבאתי את זה"
  //   L.62 "הים של שלמה צריך להכיל 2000 בת" / "כל כיור היה בגודל 40 בת" - the Sea's basin is checked against I Kings 7:23-26 and Eruvin
  //     14a-b (10 x 10 x 3 square + 10 round x 2 = 457 cubic amot to the brim, 450 by the Gemara's reckoning = 150 mikvaot = 2,000 bat);
  //     its water raised to 4.935 above the basin floor (450 cubic amot, measured). The lavers are widened to 1.9 across (1.75 inside - Malbim
  //     7:28 "אם היה כולו עגול, היה מחזיק בחללו אמה וחצי ורביע" - x 3.95 deep, see at the laver; 3 mikvaot = 40 bat, Malbim 7:38 "שהוא שיעור ג' מקואות"); the כן's opening
  //     widened with them (vsl_baseParts)
  //   L.63 "הכל דק ולא בולט/שקוע" - all the decorations are flat thin drawings: the user's decision; Rashi 7:29 says it of the ליות, "מעשה מורד. מרדדין, כמין רדוד טס דק, ואין
  //     בולטין בעביו, ולא חקוקים בשקוע" (of the lower frames Rashi 7:36 "פתח וחקק"): no bump map, the panels flush with the boards; on the panels lions and oxen above, cherubim
  //     below with the ליות between them (Rashi 7:29 "ליות, כמין זכר ונקבה מחברין זה בזה" - drawn as two bands twined round each other);
  //     on the lower frame and the boards lions, cherubim and palms (7:36); on the shoulders cherubim; on the mouth flowers (Rashi 7:31)
  //   L.64 "המכונות נועדו גם לקידוש ידים ורגלים של הכהנים" - Rashi on II Chr 4:6 "לרחצה בהם. קדוש ידים ורגלים"; Radak 7:39 "והכיורים היו
  //     לרחוץ מהם הכהנים ידיהם ורגליהם ולהדיח בהם מעשה העולה": the demonstration first stops by the altar's ramp for the priests' hands
  //     and feet (Ex 30:19-20 "ורחצו... את ידיהם ואת רגליהם... בגשתם אל המזבח"), under its own label (layer mechonaWash), then drives on
  //     to the marble tables of the slaughter place north of the altar for the rinsing of the burnt offering
  //   L.65 the capital as the user describes it (= Rashi 7:31): a square roof, in its middle a round hole 1.5 across, round the hole a
  //     partition 0.5 high (פי הכותרת, 1.5 across inside, its wall 0.1 - model choice) with the flowers, the כן resting on it, its bottom
  //     inserted, protruding 1 amah; the roof's slope 0.2 and the body 0.8 high (model choice for the split of Rashi's amah)
  //   L.66 "הקטן הסתובב לצדדים והגדול הלך קדימה ואחור" - checked: the small lying wheel on the post swivels the big wheel's heading
  //     (vsl_wheelMats alpha), the big wheel rolls (phi); the demonstration turns the small wheels at every corner and rolls between them
  //   L.67 "חשוב מאוד! המכונות היו כולן במקום אחד" / "הכיור בין שתי השורות" - ALL TEN bases stand in ONE BLOCK of two rows of five with
  //     Moses' laver in its middle, as the book draws them (its picture p. לח, "חמש מכונות מימין הכיור של משה רבינו" / "חמש מכונות משמאל
  //     הכיור של משה רבינו", and its plan p. ב-ג "לשיטת רש״י"): south of the axis, within the strip between the line of the house's right
  //     (south) wall and the court's south wall, directly east of the ulam's south wing, between it and the altar's ramp (vsl_layout:
  //     columns x 21..39, rows z 33 and 45, the laver at x 30, z 39). The axis before the ulam's door is free now; CO.kiyorX / mechX / mechZ
  //     carry the block
  //   L.75 "עד היום הים לא היה במקומו הנכון - בדוק שוב" - re-checked: the Sea at x 80, z -54 stands in the north-east corner, within the
  //     air between the house and the court's north wall - Rashi "כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה" - east of the north end
  //     of the slaughter place (the pillars z -50, the tables z -46), as the book's plan p. ב-ג draws it; its p. לט stands it a little further south, by the tables; unchanged
  // Every bronze is vsl_bronze (a warm polished clone of M.bronze). The book = the illustrated book "מקרא מפורש — איורי בית המקדש
  // הראשון" (the user's reference): it is cited only as the basis of a model choice, never as a source.
  // Private helpers are prefixed vsl_.

  var VSL_TEFACH = 1 / 6;   // 1 tefach = 1/6 amah: the building amah is six tefachim (Radak and Metzudat David on II Chr 3:3)

  // THE BLOCK OF THE BASES - 1.0.1-L (FIXES L.67 / L.74; the user: "חשוב מאוד! המכונות היו כולן במקום אחד 5 מצד ימין (בין כותל ההיכל
  // הימני לכותל העזרה הימני) ו-5 בשמאל על אותו הדרך", then "הכיור בין שתי השורות! של המכונות (היינו בין ה-5 ל-5)", pointing to the book's
  // picture p. לח): ALL TEN bases stand together in one block of two rows of five with Moses' laver in its middle, as the book (the
  // user's reference) draws it - the picture: "חמש מכונות מימין הכיור של משה רבינו" / "חמש מכונות משמאל הכיור של משה רבינו", its caption
  // "חמשה מימין הכיור של משה וחמשה משמאלו (ברייתא דמלאכת המשכן יב א; עזרת כהנים מדות פ"ג מ"ו)", and its plan of the courts p. ב-ג "לשיטת
  // רש״י". The sources for right and left of the laver: ברייתא דמלאכת המשכן ch. 12 (אוצר מדרשים) "חמשה מימין כיור של משה וחמשה משמאל
  // כיור משה"; Rashi on II Chr 4:6 "ויתן חמשה מימין. לכיור של משה"; Radak there "מימין כיור משה ומשמאלו"; Radak on I Kings 7:39 "או יהיה
  // פירוש מימין כיור שעשה משה ומשמאלו" (עזרת כהנים is not in the Otzaria library - not checked). The side of the court: Rashi on Ex
  // 30:18: the laver "ועומד כנגד אויר שבין המזבח והמשכן... משוך קמעא כלפי הדרום; כך שנויה בזבחים".
  // PLACE, after the book's plan and picture: the plan draws the block directly east of the ulam's south wing, between the wing and the
  // ramp - its rows about 30 and 47 south of the axis, the laver at about 39, the columns about 5 apart from 3 to 24 east of the wing's
  // face; the picture has that face as the ashlar wall on its right (the ulam's steps at its foot, in the picture's corner), the altar
  // and its ramp in front and the court's south wall with two gates behind, and it stands the rows closer, about 9 centre to centre (1.0.1-L: measured; the plan's about 16)
  // with the laver between them, the bases about 5 apart in a row with their taps along the row, almost meeting. So here the rows stand
  // at z 33 and 45, 12 apart round the plan's z 39 (a model choice between the two drawings; the wing and the ramp end at z 42, so the south row stands just past them): the whole block lies in the user's strip, south of the line of the house's south
  // wall (z 27) and 18 from the court's south wall (z 65). Five columns x 21, 25.5, 30, 34.5, 39: the space between the wing's east face
  // (x 18.5) and the ramp's west face (x 41.5) is 23 amot, less than the book's (its altar stands further east), so the columns stand
  // 4.5 apart - 4-wide bases (I Kings 7:27 "ארבע באמה ארך המכונה האחת וארבע באמה רחבה") with half an amah between them and half an amah
  // to the wing and to the ramp (model choice; the taps' tips stand 0.17 apart and 0.33 from the wing and the ramp). Moses' laver on its
  // 4 x 4 stone base at x 30, z 39, in the middle of the block: 2 amot from each row, opposite the air between the house (x 18.5) and
  // the altar (x 39.5), as Rashi says. Clear of the ulam's steps (x 18.5..24.5, |z| <= 12) by 19 and of the altar (z <= 10) by 21; the
  // axis before the ulam's door stays free. CO.kiyorX / mechX (30) and CO.mechZ [33, 45] in 10-core.js carry the block (the UI reads them
  // as a fallback only). Was one row at x 27, z +-8..28 (1.0.1-K: five right and five left of Moses' laver before the ulam).
  var VSL_COL_STEP = 4.5;         // the columns' spacing: 4-wide bases with half an amah between them (model choice, above)
  var VSL_BLOCK_MARGIN = 0.25;    // vsl_layout warns if the block comes nearer than this to the wing's face or the ramp's face (as built: 0.5)
  // SEA POSITION - 1.0.1-L (FIXES L.7; the user: "כרש"י ובספר"): in the CORNER of the inner court. The sources give the corner, not a
  // distance: Rashi on I Kings 7:39 "מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה" (the north-east corner, in
  // the strip between the house's north wall, z -27, and the court's north wall) - the default; the second reading in the south-east:
  // Metzudat David 7:39 "משוך כלפי מקצוע מזרחית דרומית שבעזרת כהנים", Radak 7:39 "נתן הים בעזרה לצד דרום משוך כלפי מזרח", Ralbag 7:39
  // "הים היה לפאת מזרחי דרומי שבחצר הכהנים", Rashi on II Chr 4:10 "רחק אותו מן המזרח מן כנגד הפתח לדרומה של עזרה, לפי שאין כבוד ונאה
  // שיהו מטבילין כנגד פתח האולם". The book p20 (the user's reference; it follows Rashi) draws the Sea in the north-east corner, close to
  // the east wall ("הים של שלמה מונח בקרן מזרחית צפונית"); its plan of the courts (p02, "לשיטת רש״י") draws it in that corner with
  // לשכת הגזית just west of it on the north wall. MODEL CHOICE for the distance: the Sea's axis VSL_SEA_FROM_WALL = 11 amot from the
  // inner faces of the court's east wall (x 91) and of its north / south wall (z -+65): the oxen's muzzles (7.17 from the axis,
  // vsl_oxGeometry) leave 3.83 amot to walk round the Sea, the basin's walls (5.17) 5.83. Rashi: x 80, z -54; the second reading: x 80,
  // z 54 (the south-east corner is free: FIXES L.21 moved לשכת הגזית from there to the north wall).
  // לשכת הגזית (30-courts.js, ctx.shared.lishkatHaGazit {x0, x1, z0, z1}; FIXES L.21: on the north wall between the eastern north gate
  // and the Sea, x about 46..71): VSL_SEA_GAP = at least 1 amah between it and the muzzles (x 72.83 on the west). If the chamber comes
  // nearer, the Sea first slides east, deeper into the corner, as long as VSL_SEA_WALK = 2 amot stay between the east muzzles and the
  // east wall (to x 81.83, which clears a chamber up to x 73.66); only a chamber in the corner itself moves it along the wall toward
  // the court's axis (so the old south-east chamber, x 59..89, z 50..85, would put the second reading at z 41.83).
  // Clear of everything else in the court: the east gate (z +-5 at x 91) by 23 amot and more, the north / south gates (x 35..45) by
  // 27, the altar (x 39.5..59.5, z +-10) and its ramp (x 41.5..57.5, z 10..42) by 15, the block of the bases (x 18.8..41.2, z 31..47) by 31
  // and the demonstration's route (x <= 45.2, z -48..35) by 27. 10-core.js CO.seaX / seaZ / seaZRashi carry this build's values (80 /
  // 54 / -54; the UI reads them only as a fallback). Was x 34, z +-40 (1.0.1-K).
  // 1.0.1-L (L.75; the user: "עד היום הים לא היה במקומו הנכון - בדוק שוב", and "בקרן מזרחית צפונית מול השולחנות והטבעות"): re-checked.
  // The axis z -54 lies within the air between the house and the court's north wall (the house's north wall z -27, the ulam's wing z -42,
  // the court wall z -65) - Rashi "כנגד האויר" - and the Sea stands in the corner EAST of the north end of the slaughter place that
  // 30-courts.js builds north of the altar: its basin z -59.17..-48.83 opposite the pillars' row (z -50), its muzzles reaching the tables'
  // north rows (z -48.25, -46.75), 16.83 amot from the pillars' east face (x 56). The book's plan p. ב-ג draws it so - in the very corner, level with the north
  // end of בית המטבחים, הגזית just west of it. Its p. לט stands it about 8 amot further south, its axis through the south tables (estimate from the picture). The
  // rings (z -42..-18) are further south than the basin in both. The plan followed, unchanged; לשכת הגזית now ends 1.03 from the muzzles (30-courts.js, A9).
  var VSL_SEA_FROM_WALL = 11;
  var VSL_SEA_GAP = 1;            // at least 1 amah between the oxen's muzzles and לשכת הגזית (FIXES L.21 "keep clear by at least 1 amah")
  var VSL_SEA_WALK = 2;           // at least 2 amot between the muzzles and a court wall when the Sea slides toward it (model choice)
  function vsl_layout(CO2, shared) {
    // the court's inner faces: 30-courts.js ctx.shared.innerCourt (the walls' centre lines and thickness), else CO with its 5-thick wall
    const ic = shared && shared.innerCourt, wt = ic && ic.wallT > 0 ? ic.wallT : 5;
    const xE = (ic ? ic.x1 : CO2.azE) - wt / 2;                                  // 91
    const zN = (ic ? ic.z0 : CO2.azN) + wt / 2, zS = (ic ? ic.z1 : CO2.azS) - wt / 2;   // -65, 65
    // --- the block of the bases (1.0.1-L, L.67 / L.74 - the comment above): five columns round CO.mechX, the two rows CO.mechZ, Moses'
    // laver between the rows at CO.kiyorX. The numbers are only guarded, never moved: a console.warn if a row north of the wing's south
    // end (CO.zHouseS + CO.ULAM_WING = 42, also the ramp's foot) meets the wing's east face (CO.xUlamE) or the ramp's west face (2 east of
    // the altar's west face, 40-altar.js), or if the block leaves the strip (the line of the house's south wall, the court wall) ---
    const mx = typeof CO2.mechX === "number" ? CO2.mechX : 30;
    const cols = [-2, -1, 0, 1, 2].map((k) => mx + k * VSL_COL_STEP);          // 21, 25.5, 30, 34.5, 39
    const rows = Array.isArray(CO2.mechZ) && CO2.mechZ.length === 2 ? CO2.mechZ.slice().sort((a, b) => a - b) : [33, 45];
    const laver = { x: typeof CO2.kiyorX === "number" ? CO2.kiyorX : mx, z: (rows[0] + rows[1]) / 2 };   // 30, 39
    const houseS = CO2.zHouseS || 27, wingS = houseS + (CO2.ULAM_WING || 15), rampW = CO2.xAltarW + 2;   // 27, 42, 41.5
    if ((rows[0] - 2 < wingS && (cols[0] - 2 < CO2.xUlamE + VSL_BLOCK_MARGIN || cols[4] + 2 > rampW - VSL_BLOCK_MARGIN)) ||
        rows[0] - 2 < houseS || rows[1] + 2 > zS - 3 || rows[1] - rows[0] < 8)
      console.warn("[vessels] the block of the bases meets the wing, the ramp or the court wall, or its rows each other:", cols.join(", "), "/", rows.join(", "));
    // the moving base: in the north row, the easternmost column with a free way north, 2 amot clear of the ulam's steps (their east end
    // CO.xUlamE + 6, 12 steps x tread 0.5, 50-heichal.js) and of the altar's west face: x 34.5, z 33
    const freeCols = cols.filter((x) => x - 4 >= CO2.xUlamE + 6 && x + 4 <= CO2.xAltarW);
    const home = [freeCols.length ? freeCols[freeCols.length - 1] : cols[4], rows[0]];
    const D = VSL_SEA_FROM_WALL;
    const R = CO2.SEA_D / 2 + VSL_TEFACH + VSL_OX_PROTRUDE;                      // 7.17: the muzzles from the Sea's axis (vsl_oxGeometry)
    const rashi = { x: xE - D, z: zN + D }, radak = { x: xE - D, z: zS - D };   // (80, -54), (80, 54)
    const gz = shared && shared.lishkatHaGazit, moved = [], K = R + VSL_SEA_GAP;
    const clear = (p) => !gz || !(gz.x1 > gz.x0) || gz.x0 >= p.x + K || gz.x1 <= p.x - K || gz.z0 >= p.z + K || gz.z1 <= p.z - K;
    for (const [key, p, sz] of [["rashi", rashi, 1], ["radak", radak, -1]]) {   // sz: toward the court's axis (z 0)
      if (clear(p)) continue;
      const east = { x: Math.max(p.x, gz.x1 + K), z: p.z };                    // a chamber west of the Sea: deeper into the corner
      if (gz.x0 < p.x && east.x <= xE - R - VSL_SEA_WALK && clear(east)) p.x = east.x;
      else p.z = sz > 0 ? Math.max(p.z, gz.z1 + K) : Math.min(p.z, gz.z0 - K);  // a chamber in the corner: along the wall, out of its way
      moved.push(key);
    }
    if (moved.length) console.warn("[vessels] the Sea moved for לשכת הגזית:", moved.join(", "), JSON.stringify({ rashi, radak }));
    return { cols, rows, laver, home, seaX: rashi.x, seaZ: radak.z, seaZRashi: rashi.z, rashi, radak, reach: R, moved, wallFaces: { xE, zN, zS } };
  }

  // A tube of varying radius along a smooth curve (horns, tails). Same construction as three's TubeGeometry (Frenet frames, indexed,
  // position / normal / uv) so it merges with the other primitives.
  function vsl_taperTube(pts, r0, r1, tubular, radial) {
    const curve = new CatmullRomCurve3(pts.map((p) => new Vector3(p[0], p[1], p[2])));
    const fr = curve.computeFrenetFrames(tubular, false);
    const pos = [], nrm = [], uv = [], idx = [];
    const P = new Vector3(), N = new Vector3();
    for (let i = 0; i <= tubular; i++) {
      const u = i / tubular;
      curve.getPointAt(u, P);
      const r = r0 + (r1 - r0) * u, n = fr.normals[i], b = fr.binormals[i];
      for (let j = 0; j <= radial; j++) {
        const v = j / radial * Math.PI * 2, s = Math.sin(v), c = -Math.cos(v);
        N.set(c * n.x + s * b.x, c * n.y + s * b.y, c * n.z + s * b.z).normalize();
        pos.push(P.x + r * N.x, P.y + r * N.y, P.z + r * N.z);
        nrm.push(N.x, N.y, N.z);
        uv.push(u, j / radial);
      }
    }
    for (let i = 1; i <= tubular; i++) for (let j = 1; j <= radial; j++) {
      const a = (radial + 1) * (i - 1) + j - 1, b = (radial + 1) * i + j - 1, c = (radial + 1) * i + j, d = (radial + 1) * (i - 1) + j;
      idx.push(a, b, d, b, c, d);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    return geo;
  }
  // a square plate (half-size h) with a round hole (radius r) as a Shape whose hole is a polygon of n points WITHOUT a repeated point.
  // 1.0.1-L (found by the vessels-2 ray tests): Path.absarc(0, 2 PI) repeats its first point, and the extrusion then holds zero-area
  // triangles at the seam, on which three's Mesh.raycast throws (Triangle.getBarycoord gives null) when a ray passes exactly through it
  function vsl_holedSquare(h, r, n) {
    const sh = new Shape();
    sh.moveTo(-h, -h);
    sh.lineTo(h, -h);
    sh.lineTo(h, h);
    sh.lineTo(-h, h);
    sh.closePath();
    const hole = new Path();
    for (let i = 0; i < n; i++) {
      const a = -i / n * Math.PI * 2, x = r * Math.cos(a), y = r * Math.sin(a);
      if (i) hole.lineTo(x, y); else hole.moveTo(x, y);
    }
    hole.closePath();
    sh.holes.push(hole);
    return sh;
  }
  // a cylinder (or tapered tube) from point a to point b; lateral = scale across the a-b line in z (the parts lie in the x-y plane)
  function vsl_rod(a, b, rA, rB, seg, lateral) {
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
    const g = new CylinderGeometry(rB, rA, len, seg);       // radiusTop at +y = the b end
    if (lateral) g.scale(1, 1, lateral);
    g.rotateZ(Math.atan2(-dx, dy));                         // +y onto (dx, dy)
    g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, ((a[2] || 0) + (b[2] || 0)) / 2);
    return g;
  }
  // an ellipsoid (sphere scaled) at a point, optionally rolled about x / pitched about z
  function vsl_ell(rx, ry, rz, x, y, z, rotX, rotZ, ws, hs) {
    const g = new SphereGeometry(1, ws || 16, hs || 12);
    g.scale(rx, ry, rz);
    if (rotX) g.rotateX(rotX);
    if (rotZ) g.rotateZ(rotZ);
    g.translate(x, y, z);
    return g;
  }
  // a "superellipsoid": a sphere whose coordinates are raised to the power e (< 1 = boxy, flat faces with round edges), optionally
  // narrowing toward +x (taper = the fraction lost at the +x end) - for the ox's broad flat forehead and squared muzzle
  function vsl_superEll(rx, ry, rz, e, taper, x, y, z) {
    const g = new SphereGeometry(1, 18, 12);
    const p = g.attributes.position;
    const f = (v) => Math.sign(v) * Math.pow(Math.abs(v), e);
    for (let i = 0; i < p.count; i++) {
      const fx = f(p.getX(i)), k = 1 - (taper || 0) * (fx + 1) / 2;
      p.setXYZ(i, fx * rx, f(p.getY(i)) * ry * k, f(p.getZ(i)) * rz * k);
    }
    g.computeVertexNormals();
    g.translate(x, y, z);
    return g;
  }

  // ---------------------------------------------------------------- THE OXEN ----------------------------------------------------------------
  // One ox in the SEA'S RADIAL FRAME: x = distance from the Sea's axis along the ox's facing (outward), y up from the court floor, z across.
  // The instance matrix only turns it to its side and shifts it sideways. All sizes are model choices (the verses give none: I Kings 7:25,
  // 7:44; II Chr 4:4, 4:15); the shape follows the book p16 (the user's reference: stocky oxen whose heads, necks, chests and forelegs
  // stand outside the basin, the heads raised, horns curving out and up, ears to the sides) and the brief (FIXES J.2):
  //   - the back carries the basin: its top at BACK = the basin's outer bottom (B - T = 3.43 above the court floor);
  //   - the forelegs at x 5.0, at the basin's edge line (its outer wall HO = 5.17); the chest ends at x 5.55;
  //   - the muzzle tip exactly at HO + VSL_OX_PROTRUDE = 7.17, 2 amot beyond the outer wall (1.0.1: 1.1) - the head is placed by it;
  //   - the hindquarters 2.45 from the axis: the twelve rumps meet under the centre ("וכל אחריהם ביתה", I Kings 7:25; Rashi "אל תחת הים
  //     היו אחוריהם פונים"; Metzudat David "אחוריו של זה מול אחוריו של זה"; Ralbag "והנה היו פני הבקר בחוץ נראים ואחוריהם היו נסתרים").
  // Returns { body, dark }: the bronze body and the dark details (eyes, nostrils, mouth, hooves).
  var VSL_OX_PROTRUDE = 2.0;      // the muzzle 2 amot beyond the basin's outer wall (FIXES J.2 "about 2 amot (was 1.1)"; model choice)
  var VSL_OX_LAT = 1.5;           // the three oxen of a side 1.5 apart centre to centre: 0.22 between the 1.28-wide bodies (model choice)
  var VSL_OX_PITCH = 0.95;        // the head's long axis 54 degrees below the horizontal: the broad forehead faces forward, the muzzle
                                  // forward and down, as the book p16 draws the heads (model choice)
  function vsl_oxGeometry(HO, BACK) {
    const body = [], dark = [];
    const BW = 0.64, BH = 0.97;                       // trunk: 1.28 wide, 1.94 deep (model choice)
    const XR = 2.45, XC = 5.55;                       // rump and chest ends of the trunk (3.1 long)
    const CY = BACK - BH;                             // 2.46: the trunk's axis; the back touches the basin's bottom
    {
      const g = new CapsuleGeometry(BW, XC - XR - 2 * BW, 6, 16);   // 16 round: a vertex exactly on the back line
      g.rotateZ(-Math.PI / 2);                        // along x
      g.scale(1, BH / BW, 1);
      g.translate((XR + XC) / 2, CY, 0);
      body.push(g);
    }
    body.push(vsl_ell(0.56, 0.44, 0.6, 4.95, CY + 0.3, 0, 0, 0, 14, 10));    // shoulders (top 3.2, under the basin)
    body.push(vsl_ell(0.62, 0.5, 0.62, 3.0, CY + 0.25, 0, 0, 0, 14, 10));    // haunches (top 3.21)
    // legs: one smooth taper each from the body to the hoof (dark), slender like the book's; forelegs at the basin's edge line
    for (const lx of [5.0, 2.95]) for (const lz of [-0.34, 0.34]) {
      body.push(vsl_rod([lx, 0.12, lz], [lx, 2.05, lz], 0.095, 0.21, 10));
      const hoof = new CylinderGeometry(0.105, 0.13, 0.14, 10);
      hoof.translate(lx + 0.02, 0.07, lz);
      dark.push(hoof);
    }
    // tail hanging from the rump, with its tuft
    body.push(vsl_taperTube([[2.52, 3.05, 0], [2.36, 2.75, 0], [2.32, 2.2, 0], [2.34, 1.5, 0]], 0.05, 0.03, 14, 6));
    body.push(vsl_ell(0.075, 0.16, 0.075, 2.34, 1.4, 0, 0, 0, 8, 6));
    // neck: deep and narrow, from the shoulders forward and up to the back of the head (its top 3.3 at the shoulder, under the basin,
    // rising only past the outer wall at x 5.17)
    body.push(vsl_rod([5.05, 2.8, 0], [6.22, 3.12, 0], 0.5, 0.38, 16, 0.8));
    // dewlap: a thin fold hanging from the throat to the brisket (the book; a mark of cattle)
    body.push(vsl_ell(0.58, 0.21, 0.09, 5.72, 2.2, 0, 0, 0.85, 12, 8));
    // --- the head (the book: a big broad head, the forehead flat, a squared muzzle, eyes on the sides, ears out to the sides under
    // short thick horns that curve out and up), built in its own frame: u along the face from the poll to the muzzle, v = the forehead
    // side, w across; then pitched and placed so that the muzzle tip is exactly 2 amot beyond the basin's outer wall ---
    const hb = [], hd = [];
    hb.push(vsl_superEll(0.4, 0.31, 0.39, 0.6, 0, 0.28, -0.04, 0));         // skull: boxy, the broad flat forehead on its v side
    hb.push(vsl_superEll(0.43, 0.24, 0.3, 0.7, 0.12, 0.8, -0.07, 0));       // face, narrowing a little toward the muzzle
    hb.push(vsl_superEll(0.18, 0.2, 0.31, 0.62, 0, 1.17, -0.08, 0));        // broad squared muzzle (0.62 across, 0.4 deep)
    hb.push(vsl_ell(0.3, 0.1, 0.22, 0.92, -0.27, 0, 0, 0, 12, 8));                        // jaw
    hb.push(vsl_ell(0.09, 0.08, 0.3, 0.04, 0.12, 0, 0, 0, 10, 8));           // poll ridge between the horn bases
    for (const s of [-1, 1]) {
      hd.push(vsl_ell(0.035, 0.06, 0.05, 1.338, -0.05, s * 0.12, 0, 0, 8, 6));    // nostrils
      hd.push(vsl_ell(0.075, 0.075, 0.05, 0.44, 0.06, s * 0.37, 0, 0, 10, 8));    // eyes
      hb.push(vsl_ell(0.07, 0.13, 0.2, 0.14, -0.04, s * 0.47, s * 0.3, 0, 10, 8)); // ears out to the sides (to 0.66), drooping a little
      // horns: short and thick, out to the side and up, the tips turning in (in the ox frame: out, up and a little forward)
      hb.push(vsl_taperTube([[0.06, 0.13, s * 0.3], [0.02, 0.17, s * 0.47], [-0.04, 0.31, s * 0.58], [-0.07, 0.47, s * 0.58],
        [-0.03, 0.57, s * 0.5]], 0.095, 0.025, 14, 7));
    }
    hd.push(vsl_ell(0.05, 0.014, 0.24, 1.27, -0.255, 0, 0, 0, 8, 6));        // mouth line
    const headBody = mergeGeometries(hb), headDark = mergeGeometries(hd);
    headBody.rotateZ(-VSL_OX_PITCH);
    headDark.rotateZ(-VSL_OX_PITCH);
    headBody.computeBoundingBox();
    const tx = HO + VSL_OX_PROTRUDE - headBody.boundingBox.max.x;            // the muzzle tip exactly 2 amot beyond the outer wall
    const ty = 3.55;                                                          // the poll at 3.55 (beyond the wall): the eyes at ~3.25, just under
                                                                              // the basin's bottom line, the horn tips at ~3.9 (the book p16)
    headBody.translate(tx, ty, 0);
    headDark.translate(tx, ty, 0);
    body.push(headBody);
    dark.push(headDark);
    return { body: mergeGeometries(body), dark: mergeGeometries(dark) };
  }
  // 1.0.1-K bronze for every vessel: a clone of M.bronze, polished and warm, so it reads as bright copper-bronze like the book's
  // and not as dull brown in the shade (the user; K.3 "polished, not dull brown"): metalness 0.75 lets the hemisphere light count, a
  // faint warm emissive keeps the shaded faces from sinking to brown (the idea of GOLD_OPTS in 10-core.js). Chosen from four variants
  // rendered side by side in headless Chrome (1.0.1 M.bronze 0xA26F2E / metalness 0.95 read dark brown on every shaded face).
  function vsl_bronze(M2, color, rough, glow) {
    const m = M2.bronze.clone();
    m.color.set(color);
    m.metalness = 0.75;
    m.roughness = rough;
    m.envMapIntensity = 1.4;
    m.emissive.set(0x351a08);
    m.emissiveIntensity = glow == null ? 0.4 : glow;
    return m;
  }

  // The Sea (ים של שלמה). Built in a Group whose origin is on the court floor under the Sea's centre; moved by seaPlacement.set().
  function vsl_buildSea(ctx, parent) {
    const H2 = ctx.H, M2 = ctx.M, CO2 = ctx.CO, LV2 = ctx.LV;
    const sea = new Group();
    sea.name = "yam";
    parent.add(sea);
    // bronze (vsl_bronze): the basin polished, the oxen a little darker so they read as separate figures (FIXES 1.0.1 C.2 / J.2), the
    // knobs a little lighter, the details (eyes, nostrils, mouth, hooves) dark patina
    const BRS = vsl_bronze(M2, 0xc08040, 0.3);
    const BRO = vsl_bronze(M2, 0xad733a, 0.32);
    const BRK = vsl_bronze(M2, 0xd38d46, 0.28);
    const BRX = vsl_bronze(M2, 0x3b2412, 0.5, 0.12);

    const T = VSL_TEFACH;                           // wall thickness 1 tefach: I Kings 7:26 "ועביו טפח"; II Chr 4:5
    const HI = CO2.SEA_D / 2;                       // 5: inner radius / inner half-width - 10 "משפתו עד שפתו" measured INSIDE (Eruvin 14a "מגואי קא חשיב"; Rashi there "חללו שלו לבד עובי דופנותיו"; Malbim on 7:24)
    const HO = HI + T;                              // 5.17: outer half-width
    const B = 3.6;                                  // the basin floor 3.6 above the court floor = the oxen's height (model choice, FIXES 1.0.1 C.2)
    const SQ = 3;                                   // the lower 3 amot are square (Eruvin 14b: "שלש אמות תחתונות מרובעות"; Rashi, Radak, Metzudot, Ralbag, Malbim)
    const RD = CO2.SEA_H - SQ;                      // the upper 2 amot are round (Eruvin 14b: "שתים עליונות עגולות"); total height 5: I Kings 7:23 "וחמש באמה קומתו"

    // --- the twelve oxen (I Kings 7:25 "עמד על שני עשר בקר שלשה פנים צפונה ושלשה פנים ימה ושלשה פנים נגבה ושלשה פנים מזרחה והים עליהם
    // מלמעלה וכל אחריהם ביתה"; II Chr 4:4): three per side, heads outward, hindquarters inward. Extents around the Sea's axis (vsl_oxGeometry):
    // 7.17 (the muzzles) along each side's facing, 2.12 across it (1.5 + the 0.62 half-body; horns and ears stay inside that). The rumps
    // end 2.45 from the axis: two oxen that meet at a corner keep 0.13 between them. ---
    {
      const og = vsl_oxGeometry(HO, B - T);
      const ox = new InstancedMesh(og.body, BRO, 12), oxd = new InstancedMesh(og.dark, BRX, 12);
      const m42 = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(1, 1, 1);
      let k = 0;
      for (let side = 0; side < 4; side++) {        // 0 east (+x), 1 south (+z), 2 west (-x), 3 north (-z)
        const ang = -side * Math.PI / 2;            // turns the ox frame's +x to the side's facing
        for (const l of [-VSL_OX_LAT, 0, VSL_OX_LAT]) {
          e.set(0, ang, 0);
          q.setFromEuler(e);
          p.set(l * Math.sin(ang), 0, l * Math.cos(ang));   // sideways along the turned z axis
          m42.compose(p, q, s);
          ox.setMatrixAt(k, m42);
          oxd.setMatrixAt(k, m42);
          k++;
        }
      }
      ox.castShadow = ox.receiveShadow = true;
      oxd.castShadow = true;
      ox.name = "yam-oxen";
      sea.add(ox, oxd);
    }

    // --- the basin: floor slab 1 tefach (model choice after the wall thickness), square part 10 x 10 inside, walls 1 tefach ---
    H2.box(sea, 2 * HO, T, 2 * HO, BRS, 0, B - T, 0);                   // floor, outer bottom at B - T (rests on the oxen)
    H2.box(sea, 2 * HO, SQ, T, BRS, 0, B, -(HI + T / 2));                // north wall
    H2.box(sea, 2 * HO, SQ, T, BRS, 0, B, HI + T / 2);                   // south wall
    H2.box(sea, T, SQ, 2 * HI, BRS, -(HI + T / 2), B, 0);                // west wall
    H2.box(sea, T, SQ, 2 * HI, BRS, HI + T / 2, B, 0);                   // east wall
    // the shoulder at the transition from square to round: a plate closing the corners (the round part's inner circle is inscribed
    // in the square's interior: volumes 300 + 150 = 450 cubic amot = 150 mikvaot, Eruvin 14b)
    try {
      const sh = vsl_holedSquare(HI, HI - 0.02, 80);   // 1.0.1-L: a polygonal hole without the seam's repeated point (vsl_holedSquare)
      const geo = new ExtrudeGeometry(sh, { depth: T, bevelEnabled: false, curveSegments: 40 });
      geo.rotateX(Math.PI / 2);                     // the plate lies flat, its top at B + SQ
      geo.translate(0, B + SQ, 0);
      const m = new Mesh(geo, BRS);
      m.castShadow = m.receiveShadow = true;
      sea.add(m);
    } catch (e) {
      console.warn("[vessels] sea shoulder skipped", e);
    }
    // the round part: inner diameter 10, wall 1 tefach, 2 amot high; the rim flares out like a lily cup
    // (I Kings 7:26 "ושפתו כמעשה שפת כוס פרח שושן"; Rashi "שאצל פיו היה דק ומרקע ומרדד, כמעשה שפת כוס"; II Chr 4:5); the flare's size is
    // a model choice
    H2.lathe(sea, [
      [HO, B + SQ], [HO, B + SQ + RD - 0.55], [HO + 0.13, B + SQ + RD - 0.25], [HO + 0.45, B + SQ + RD - 0.02], [HO + 0.73, B + SQ + RD + 0.1],
      [HO + 0.63, B + SQ + RD + 0.14], [HO + 0.33, B + SQ + RD + 0.02], [HO, B + SQ + RD - 0.22], [HI + 0.02, B + SQ + RD - 0.5],
      [HI, B + SQ + RD - 0.7], [HI, B + SQ]
    ], BRS, 0, 0, 0, 48);
    // 1.0.1-L (the user: "על שפת הים של שלמה צריך להיות עיטור שושנים דק"): a thin flat frieze of lilies on the flare's outer face - I Kings 7:26
    // "ושפתו כמעשה שפת כוס פרח שושן", Rashi "שאצל פיו היה דק ומרקע ומרדד": drawn, not raised (vsl_motif "lily", as on the bases). A second surface
    // 0.012 outside the flare, following its profile. The number of lilies (48) and their height (the flare's) are model choices.
    try {
      const NL = 48, LW = 64, LH = 128, T0 = B + SQ + RD, EPS = 0.012;
      const band = document.createElement("canvas");
      band.width = NL * LW;
      band.height = LH;
      const bc = band.getContext("2d"), one = vsl_motif("lily", LW, LH);
      for (let i = 0; i < NL; i++) bc.drawImage(one, i * LW, 0, LW, LH);
      const lilyMap = new CanvasTexture(band);
      lilyMap.colorSpace = SRGBColorSpace;
      lilyMap.anisotropy = 4;
      const lip = new LatheGeometry([[HO + EPS, T0 - 0.55], [HO + 0.056 + EPS, T0 - 0.42], [HO + 0.13 + EPS, T0 - 0.25], [HO + 0.31 + EPS, T0 - 0.12],
        [HO + 0.45 + EPS, T0 - 0.02 + 0.003], [HO + 0.6, T0 + 0.05]].map((p) => new Vector2(p[0], p[1])), 96);
      const lilies = new Mesh(lip, new MeshStandardMaterial({ map: lilyMap, alphaTest: 0.45, side: DoubleSide, metalness: 0.55, roughness: 0.38 }));
      lilies.name = "sea-rim-lilies";
      sea.add(lilies);
    } catch (e) {
      console.warn("[vessels] the Sea's lilies skipped", e);
    }

    // --- two rows of knobs (פקעים) around the square part under the transition (I Kings 7:24 "ופקעים מתחת לשפתו... שני טורים";
    // Rashi "בשלש אמות תחתונות שהיו מרבעות"; Radak: eggs with oxen faces; the book draws them at the top of the square part). Rows at 2.3 and
    // 2.7 above the basin floor, one every half amah = 80 per row (model choice; Rashi/Radak/Metzudot read "עשר באמה" as ten amot per side) ---
    try {
      const knob = new SphereGeometry(0.12, 8, 6);
      knob.scale(1, 1.3, 1);
      const rows = [B + 2.3, B + 2.7];
      const PER = 20;                               // per side per row
      const inst = new InstancedMesh(knob, BRK, 4 * PER * rows.length);
      const m42 = new Matrix4();
      let k = 0;
      for (const y of rows) for (let i = 0; i < PER; i++) {
        const l = -HI + 0.25 + i * 0.5;
        m42.makeTranslation(l, y, -(HO + 0.06)); inst.setMatrixAt(k++, m42);   // north face
        m42.makeTranslation(l, y, HO + 0.06); inst.setMatrixAt(k++, m42);      // south face
        m42.makeTranslation(-(HO + 0.06), y, l); inst.setMatrixAt(k++, m42);   // west face
        m42.makeTranslation(HO + 0.06, y, l); inst.setMatrixAt(k++, m42);      // east face
      }
      inst.castShadow = true;
      sea.add(inst);
    } catch (e) {
      console.warn("[vessels] sea knobs skipped", e);
    }

    // --- the water (1.0.1-L, L.62; the user: "הים של שלמה צריך להכיל 2000 בת... שלא יהיה קטן מדי"). The basin: inside 10 x 10 x 3 square
    // (300 cubic amot) + 10 round x 2 (157.1) = 457.1 cubic amot to the brim; the Gemara reckons the round part as 3/4 of the square
    // (Eruvin 14b "מכדי, כמה מרובע יתר על העגול? רביע") - 300 + 150 = 450 = 150 mikvaot of 3 cubic amot ("אמה על אמה ברום שלש אמות...
    // ארבעים סאה") = 6,000 seah = 2,000 bat ("״בת״ כמה הויא - שלש סאין... דהוה להו שיתא אלפי גריוי"; Rashi "ו' אלפים סאין - שהן ק"נ
    // מקואות"; Eruvin 14a "ים שעשה שלמה היה מחזיק מאה וחמשים מקוה טהרה"). The water stands 4.935 above the basin floor (was 4.6, then 4.9 = 446.9), in the rim's flare
    // (the disc's edge lies inside the wall): 1.0.1-L: measured from the real triangles, with the shoulder plate that fills the square's top corners (3.78), 450.0 cubic amot = 2,000 bat. With the amah 48 cm a cubic amah is 110.6 litres: 2,000 bat = 450 cubic
    // amot = 49,766 litres (the user's 44,040 litres is the same 450 at 97.87 litres a cubic amah: the seah 7.34 litres, the amah 46.1 cm). ---
    {
      const water = new Mesh(new CircleGeometry(5.4, 48), new MeshStandardMaterial({ color: 0x173a66, roughness: 0.15, metalness: 0.1 }));
      water.rotation.x = -Math.PI / 2;
      water.position.set(0, B + 4.935, 0);
      water.receiveShadow = true;
      sea.add(water);
    }

    // --- placement: two opinions, both built in; the UI switches with ctx.shared.seaPlacement.set('rashi' | 'radak') ---
    // 1.0.1-L (L.7): both in the court's corner (vsl_layout at the top: Rashi x 80, z -54; the second reading x 80, z 54)
    const L = vsl_layout(CO2, ctx.shared);
    const F = LV2.AZ;
    // y 20.6 (1.0.1-L: was 18.1 - from the high corner views the label sat on the basin's far rim and was cut by it); x / z follow set()
    const label = { text: "הים של שלמה", x: L.rashi.x, y: F + B + CO2.SEA_H + 6, z: L.rashi.z, size: 3 };
    ctx.labels.push(label);
    const placement = {
      // north-east: Rashi on I Kings 7:39 "מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה" (the book p20)
      rashi: { x: L.rashi.x, z: L.rashi.z },
      // south-east: Metzudat David 7:39 "משוך כלפי מקצוע מזרחית דרומית"; Radak and Ralbag on 7:39; Rashi on II Chr 4:10 "לדרומה של עזרה"
      radak: { x: L.radak.x, z: L.radak.z },
      current: "rashi",
      group: sea,
      label,
      // 1.0.1-L (L.7) the general view of the Sea in its corner, like the book p20 (from above, the two walls of the corner behind it):
      // the camera inside the court over the floor between the Sea and the court's middle, 18 amot toward the house and 20 toward the
      // court's axis, 30 above the floor (45 degrees down), aimed just in front of the Sea's axis (model choice). It stands higher than
      // the court walls (y 26), the altar and its ramp (to y 16), so no turn step can put it inside a solid; the ray to the target
      // crosses only the open court (headless ray test, FIXES L.7)
      flyPoint() {
        const p = placement[placement.current] || placement.rashi, sg = p.z < 0 ? 1 : -1;   // sg: toward the court's axis (z 0)
        return { pos: [p.x - 18, F + 30, p.z + sg * 20], target: [p.x - 1, F + 3, p.z + sg * 1] };
      },
      // a close view of the oxen's heads: eye 3.4 above the court floor, ~9 amot from the muzzles of the Sea's side that faces the court's
      // axis - for Rashi the three oxen "פנים נגבה" (7:25), lit by the sun (90-entry.js: from the south-east); for the second reading the
      // three "פנים צפונה" (its south and east sides face the court walls, 3.83 away) - from the west (the house side), 7.5 west
      // and 14.5 toward the axis (model choice; 1.0.1-L: in the corner the K-review's south-east camera stood 3.5 from the east wall).
      // Checked headless: the ray meets the oxen first, the camera is inside no solid, clear of the ramp, >= 0.5 from every surface
      // for the turn steps of 70-ui.js orbitBy reported in the round-L report
      oxenFlyPoint() {
        const p = placement[placement.current] || placement.rashi, sg = p.z < 0 ? 1 : -1;
        return { pos: [p.x - 7.5, F + 3.4, p.z + sg * 14.5], target: [p.x, F + 3.0, p.z + sg * 5.5] };
      },
      set(key) {
        if (key !== "rashi" && key !== "radak") return placement.current;   // only the two opinions are valid keys
        const p = placement[key];
        placement.current = key;
        sea.position.set(p.x, F, p.z);
        // move the label entry and, if 70-ui.js already made its sprite (group "labels" under ctx.root), the sprite too: the UI
        // keeps the label object in sprite.userData.label (1.0.1-H); an older UI is matched by the old position
        const old = { x: label.x, y: label.y, z: label.z };
        label.x = p.x;
        label.z = p.z;
        try {
          const lg = ctx.root.getObjectByName("labels");
          if (lg) for (const spr of lg.children) {
            const mine = spr.userData && spr.userData.label === label;
            if (mine || (Math.abs(spr.position.x - old.x) < 1e-3 && Math.abs(spr.position.y - old.y) < 1e-3 && Math.abs(spr.position.z - old.z) < 1e-3)) {
              spr.position.set(label.x, label.y, label.z);
              break;
            }
          }
        } catch (_) {
        }
        ctx.shared.flyPoints = ctx.shared.flyPoints || {};
        ctx.shared.flyPoints.yam = placement.flyPoint();
        ctx.shared.flyPoints.yamOxen = placement.oxenFlyPoint();
        return placement.current;
      }
    };
    sea.position.set(placement.rashi.x, F, placement.rashi.z);
    ctx.shared.seaPlacement = placement;
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    ctx.shared.flyPoints.yam = placement.flyPoint();
    ctx.shared.flyPoints.yamOxen = placement.oxenFlyPoint();
    return placement;
  }

  // Moses' laver (כיור משה). 1.0.1-L (FIXES L.74; the user: "גם כיור משה בין המכונות", then "הכיור בין שתי השורות! של המכונות (היינו בין
  // ה-5 ל-5)"): it stands in the MIDDLE of the block of the bases, between its two rows of five, as the book p. לח draws it - Radak on
  // I Kings 7:39 "או יהיה פירוש מימין כיור שעשה משה ומשמאלו"; Rashi on II Chr 4:6 "ויתן חמשה מימין. לכיור של משה"; Metzudat David
  // there. Its place comes from vsl_layout (x 30, z 39; was x 27, z 0 on the house axis before the ulam). No measure in the sources:
  // ~3 across x 3 high (SPEC 5; model choice); the shape is the Second Temple laver of ref-altar-bayit2.js scaled down.
  // 1.0.1-L (L.10; the user: "תסיר"): its 12 spouts (דדים, SPEC 5) are removed - they are Ben Katin's, a Second Temple addition: Mishnah
  // Yoma 3:10 "בן קטין עשה שנים עשר דד לכיור, שלא היו לו אלא שנים" (Yoma 37a, and 25b: "כדי שיהיו שנים עשר אחיו הכהנים העסוקין בתמיד
  // מקדשין ידיהן ורגליהן בבת אחת"). 1.0.1-L (the user, 1.11.2026: "תוסיף ברזים לכיור משה (2)"): it has the two taps that the same Mishnah gives the laver before Ben Katin
  // ("שלא היו לו אלא שנים"), in the form of the bases' taps (vsl_tapGeometry); their height, their sides and their form are model choices.
  function vsl_buildKiyorMoshe(ctx, g) {
    const H2 = ctx.H, M2 = ctx.M, CO2 = ctx.CO, F = ctx.LV.AZ;
    const LP = vsl_layout(CO2, ctx.shared).laver, KX = LP.x, KZ = LP.z;   // 1.0.1-L: (30, 39), the middle of the block (see the comment above)
    const BR = vsl_bronze(M2, 0xc08040, 0.3);       // polished (1.0.1-K, vsl_bronze)
    H2.box(g, 4, 0.3, 4, M2.stoneSmooth, KX, F, KZ);           // a low stone base (model choice)
    const REF = [
      [0.01, 0], [1.5, 0], [1.55, 0.14], [1.05, 0.3], [0.6, 0.55], [0.52, 1.3], [0.85, 1.6], [1.9, 2.05], [2.9, 2.6], [3.42, 3.1],
      [3.5, 3.5], [3.42, 3.62], [3.15, 3.45], [3.05, 3], [2.2, 2.45], [0.9, 2.2], [0.01, 2.15]
    ];
    const SR = 0.43, SY = 0.83;                     // 7 across x 3.6 high -> 3 across x 3 high (SPEC 5 "~3 across"; model choice)
    const pts = REF.map((p) => [Math.max(0.01, p[0] * SR), p[1] * SY]);
    const Y0 = F + 0.3;
    H2.lathe(g, pts, BR, KX, Y0, KZ, 32);
    {
      // the water disc sits inside the rim (the profile's inner wall is at r 3.15 * SR at this height)
      const water = new Mesh(new CircleGeometry(3.0 * SR, 28), new MeshStandardMaterial({ color: 0x1f4a7a, roughness: 0.15, metalness: 0.1 }));
      water.rotation.x = -Math.PI / 2;
      water.position.set(KX, Y0 + 3.45 * SY, KZ);
      water.receiveShadow = true;
      g.add(water);
    }
    // (1.0.1-L, L.10: the block of the 12 spouts that stood here is removed - see the comment above the function)
    // 1.0.1-L ("תוסיף ברזים לכיור משה (2)"): two taps, at the bowl's wall (r 1.25 at this height) 2.46 above the court floor, a washing height; on the
    // north and south sides, so that both show from the aisle and its fly point (from the east), the mouths over the stone base (r 1.97 < 2). Model choices.
    {
      const taps = new Mesh(mergeGeometries(vsl_tapGeometry(2.46, 1.25, 1.85)).rotateY(Math.PI / 2), BR);
      taps.name = "kiyorMoshe-taps";
      taps.position.set(KX, F, KZ);
      taps.castShadow = true;
      g.add(taps);
    }
    // 1.0.1-L (L.74): the label 8.2 above the floor (was 5.5) - in the block's middle it stood behind the front row's lavers (to y 7)
    ctx.labels.push({ text: "כיור משה", x: KX, y: F + 8.2, z: KZ, size: 2.2 });
    // 1.0.1-L (L.74): its fly point, from the east along the aisle between the two rows of bases, over the ramp's lower part (its surface y 7 at this z): the laver in the middle, the bases on
    // either hand (model choice; rays checked headless)
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    // 1.0.1-L (verifier): nearer and higher, so that the whole circle of the turn buttons is free (from 18 away, 44 of 252 steps entered the ulam's wing and the lavers)
    ctx.shared.flyPoints.kiyorMoshe = { pos: [KX + 10, F + 12, KZ], target: [KX, F + 2, KZ] };
  }

  // ------------------------------------------------------------ THE BASES' RELIEFS ------------------------------------------------------------
  // 1.0.1-L (FIXES L.61 / L.63; the user: "הכל דק ולא בולט/שקוע"): every figure is a FLAT THIN DRAWING on the bronze - Rashi 7:29 on
  // "מעשה מורד": "מרדדין, כמין רדוד טס דק, ואין בולטין בעביו, ולא חקוקים בשקוע" (thin hammered plates attached to the surface, neither
  // standing out nor cut in; Targum "מדבק עובד כבוש"; Radak "בדי נחשת קטנים דבוקים זה בזה"). So: no bump map, no recessed panels - a
  // figure is a slightly lighter plate of the same bronze with a thin dark edge line (the plate's shadow), nothing more.
  // One motif (lion, ox, cherub, palm, rosette, lily) is drawn ONCE into a small offscreen canvas (W x H px) in a 100 x 100 design box
  // and then stamped into the atlas with drawImage. The figures follow the book p18R (a walking ox and lion; cherubs as robed standing
  // figures whose wings rise from the shoulders - no arms, as the verses describe none) and p18L (palms on the boards).
  var VSL_RELIEF_PLATE = "#d6a365", VSL_RELIEF_LINE = "#4a2a0e";   // the thin plate's tone and its edge line (model choice)
  function vsl_motif(kind, W, H) {
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const c = cv.getContext("2d");
    c.scale(W / 100, H / 100);
    const FILL = VSL_RELIEF_PLATE, LINE = VSL_RELIEF_LINE;
    c.lineJoin = "round";
    c.lineCap = "round";
    const E = (x, y, rx, ry, rot) => {
      c.moveTo(x + rx * Math.cos(rot || 0), y + rx * Math.sin(rot || 0));
      c.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2);
    };
    const part = (build, lw) => {                    // a plate: the light fill with its thin edge (lw in design units: 1.6 = ~1.8 px on a 110 px stamp)
      c.beginPath();
      build();
      c.fillStyle = FILL;
      c.fill();
      c.lineWidth = lw || 1.6;
      c.strokeStyle = LINE;
      c.stroke();
    };
    const line = (build, lw, col) => {
      c.beginPath();
      build();
      c.lineWidth = lw;
      c.strokeStyle = col || LINE;
      c.stroke();
    };
    if (kind === "lion") {                           // walking lion facing right
      line(() => { c.moveTo(22, 50); c.bezierCurveTo(9, 50, 5, 38, 11, 27); }, 4.5);
      line(() => { c.moveTo(22, 50); c.bezierCurveTo(9, 50, 5, 38, 11, 27); }, 2.4, FILL);
      part(() => E(11, 25, 5, 6.5));
      part(() => { c.rect(24, 52, 8, 32); c.rect(35, 55, 8, 29); c.rect(61, 53, 8, 31); c.rect(72, 52, 8, 32); });
      part(() => E(45, 50, 27, 13));                 // body
      part(() => E(71, 39, 17, 19));                 // mane
      line(() => { for (let i = 0; i < 7; i++) { const a = -2.4 + i * 0.55; c.moveTo(71 + 9 * Math.cos(a), 39 + 9 * Math.sin(a)); c.lineTo(71 + 16 * Math.cos(a), 39 + 17 * Math.sin(a)); } }, 1.1);
      part(() => E(80, 40, 10, 9));                  // face
      part(() => E(88, 45, 6.5, 5));                 // muzzle
      part(() => E(76, 30, 3.2, 3.2));               // ear
      line(() => { c.moveTo(82, 37); c.lineTo(84.5, 37); }, 1.4);   // eye
    } else if (kind === "ox") {                      // walking ox facing left: hump, dewlap, horns
      line(() => { c.moveTo(84, 44); c.bezierCurveTo(92, 52, 92, 64, 89, 76); }, 2.6);
      part(() => E(89, 79, 4, 6));
      part(() => { c.rect(30, 55, 8, 31); c.rect(41, 58, 8, 28); c.rect(66, 55, 8, 31); c.rect(77, 54, 8, 32); });
      part(() => E(57, 49, 30, 15));                 // body
      part(() => E(37, 41, 12, 10, -0.3));           // withers
      part(() => E(26, 59, 7, 6));                   // dewlap
      part(() => E(24, 47, 11, 9, -0.5));            // neck
      part(() => E(14, 55, 9.5, 7.5, -1.0));         // head
      part(() => E(9, 63, 6.5, 5.5));                // muzzle
      line(() => { c.moveTo(13, 47); c.quadraticCurveTo(3, 44, 6, 33); c.moveTo(19, 46); c.quadraticCurveTo(27, 41, 25, 31); }, 3.4);
      line(() => { c.moveTo(13, 47); c.quadraticCurveTo(3, 44, 6, 33); c.moveTo(19, 46); c.quadraticCurveTo(27, 41, 25, 31); }, 1.6, FILL);
      part(() => E(22, 50, 5, 2.6, 0.5));            // ear
      line(() => { c.moveTo(12, 53); c.lineTo(14.5, 53.5); }, 1.4);   // eye
    } else if (kind === "cherub") {                  // robed standing figure, wings raised from the shoulders, no arms
      part(() => { c.moveTo(45, 40); c.bezierCurveTo(31, 43, 13, 31, 5, 7); c.bezierCurveTo(20, 12, 36, 21, 47, 32); c.closePath(); });
      part(() => { c.moveTo(55, 40); c.bezierCurveTo(69, 43, 87, 31, 95, 7); c.bezierCurveTo(80, 12, 64, 21, 53, 32); c.closePath(); });
      line(() => { for (const s of [-1, 1]) for (let i = 1; i <= 3; i++) { c.moveTo(50 + s * (8 + i * 9), 37 - i * 6); c.lineTo(50 + s * (5 + i * 10), 28 - i * 7); } }, 1.0);
      part(() => { c.moveTo(43, 33); c.lineTo(57, 33); c.lineTo(66, 95); c.lineTo(34, 95); c.closePath(); });   // the robe to the feet
      line(() => { c.moveTo(47, 42); c.lineTo(44, 93); c.moveTo(53, 42); c.lineTo(56, 93); }, 1.0);
      part(() => E(50, 24, 8, 9));                   // head
    } else if (kind === "palm") {                    // palm tree (תמורה, I Kings 7:36; Radak "צורת דקלין")
      part(() => { c.moveTo(45.5, 96); c.lineTo(54.5, 96); c.lineTo(52.5, 36); c.lineTo(47.5, 36); c.closePath(); });
      line(() => { for (let y = 42; y < 92; y += 7) { c.moveTo(47.6, y); c.lineTo(50, y + 3); c.lineTo(52.4, y); } }, 1.0);
      for (const a of [-2.95, -2.5, -2.05, -1.57, -1.1, -0.65, -0.2, 2.75, 0.4]) part(() => E(50 + 17 * Math.cos(a), 33 + 15 * Math.sin(a), 18, 4.6, a), 1.3);
      part(() => E(50, 34, 5, 5));
    } else if (kind === "rosette") {                 // eight-petalled flower (פרח; Rashi 7:31 "מקלעות - צורת פרחים")
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; part(() => E(50 + 25 * Math.cos(a), 50 + 25 * Math.sin(a), 21, 10, a), 1.4); }
      part(() => E(50, 50, 13, 13));
      part(() => E(50, 50, 5.5, 5.5));
    } else if (kind === "lily") {                    // lily (שושן): a raised centre petal and two petals curling out
      part(() => { c.rect(46.5, 66, 7, 32); });
      part(() => { c.moveTo(47, 72); c.bezierCurveTo(29, 70, 13, 52, 16, 28); c.bezierCurveTo(28, 42, 39, 55, 47, 62); c.closePath(); });
      part(() => { c.moveTo(53, 72); c.bezierCurveTo(71, 70, 87, 52, 84, 28); c.bezierCurveTo(72, 42, 61, 55, 53, 62); c.closePath(); });
      part(() => { c.moveTo(41, 70); c.bezierCurveTo(37, 46, 43, 22, 50, 6); c.bezierCurveTo(57, 22, 63, 46, 59, 70); c.closePath(); });
      part(() => E(50, 71, 11, 5));
    }
    return cv;
  }
  // The atlas of the bases' decorations, colour only, 1024 x 512 (1.0.1-L: the bump map is gone - L.63 "לא בולט/שקוע"). Regions (canvas
  // rows; three's v = 1 - row / 512; 256 px per amah along a side, s -2..2 -> x 0..1024):
  //   S rows   0..205  one side of the body, y 2.30..1.50 (vsl_baseParts VSL_BODY_*): the upper boards (נסרים, rows 0..31, y 2.30..2.18)
  //                    and the lower frame (מסגרת, rows 174..205, y 1.62..1.50) with friezes of lions, cherubs and palms (7:36 "ויפתח על
  //                    הלחת ידתיה ועל מסגרתיה כרובים אריות ותמרת"; Rashi "התחתונות על שניהם, פתח וחקק כרובים אריות"; the user: "על
  //                    המסגרות התחתונות וכן על הנסרים - אריות כרובים ודקלים"); between them, rows 31..174, the THREE panels of the side
  //                    (מסגרות בין השלבים, 1.0.1-L L.61 - the Gra, by the user: three on each side) between the corner posts and the two
  //                    rungs (s +-0.613): on each an ox and a lion above, facing each other as the book p18R draws them, and two cherubim below joined by the ליות (7:29 "ועל
  //                    המסגרות אשר בין השלבים אריות בקר וכרובים... ומתחת לאריות ולבקר ליות מעשה מורד"; the user: "אריות ובקרים בשורה
  //                    עליונה, וכרובים למטה - ליות (חבוקים זה בזה)"; Rashi "ליות, כמין זכר ונקבה מחברין זה בזה" - drawn as two bands
  //                    twined round each other, joining the two cherubs; Metzudat David 7:31 "מסגרי המכונות אשר היו בין השלבים, היו
  //                    מרובעות בכל אורכן")
  //   M rows 205..333  the mouth (פי הכותרת) all round, 0.5 high: twined borders and flowers (7:31 "וגם על פיה מקלעות"; Rashi "צורת פרחים")
  //   K rows 333..397  the shoulders (כתפות): cherubs (the user: "על הכתפות כרובים"; the book; 7:30 "מעבר איש ליות")
  //   P rows 397..512  plain bronze (the other faces of the boards and the shoulders)
  var VSL_ATLAS_ROWS = { boards: [0, 31], panels: [31, 174], frame: [174, 205], mouth: [205, 333], shoulders: [333, 397], plain: [397, 512] };
  var VSL_RUNG_S = 0.613;          // the two rungs of a side at s +-0.613: three equal panels of 1.227 between the corner posts (s +-1.84)
  function vsl_reliefAtlas() {
    const W = 1024, HH = 512, RW = VSL_ATLAS_ROWS;
    const stamps = {};
    const stamp = (kind, w, h) => {
      const key = kind + ":" + w + "x" + h;
      return stamps[key] || (stamps[key] = vsl_motif(kind, w, h));
    };
    const GROUND = "#a8733a", BAND = "#a37038", EDGE = "#cf9a5a", LINE = VSL_RELIEF_LINE;
    // two bands twined round each other ("ליות... מחברין זה בזה"; "מקלעות" on the mouth): along x from x0 to x1 at the row yc
    const twine = (c, x0, x1, yc, amp, period, lw) => {   // yc: the row, or a function of x (the arch between the cherubim)
      for (const ph of [0, Math.PI]) {
        c.beginPath();
        for (let x = x0; x <= x1; x += 3) {
          const y = (typeof yc === "function" ? yc(x) : yc) + amp * Math.sin((x - x0) / period * Math.PI * 2 + ph);
          if (x > x0) c.lineTo(x, y); else c.moveTo(x, y);
        }
        c.lineWidth = lw;
        c.strokeStyle = VSL_RELIEF_PLATE;
        c.stroke();
        c.lineWidth = 0.9;
        c.strokeStyle = LINE;
        c.stroke();
      }
    };
    const paint = (c) => {
      c.fillStyle = GROUND;
      c.fillRect(0, 0, W, HH);
      // S: the boards (upper) and the lower frame with their friezes of lions, cherubs and palms, period 64 px = 1/4 amah
      const seq = ["lion", "palm", "cherub", "palm"];
      for (const [y0, y1, off] of [[RW.boards[0], RW.boards[1], 0], [RW.frame[0], RW.frame[1], 2]]) {
        c.fillStyle = BAND;
        c.fillRect(0, y0, W, y1 - y0);
        c.fillStyle = EDGE;
        c.fillRect(0, y0 + 1, W, 2);
        c.fillRect(0, y1 - 3, W, 2);
        for (let i = 0; i < 16; i++) {
          const kind = seq[(i + off) % seq.length], w = kind === "lion" ? 30 : 24, h = 23;
          c.drawImage(stamp(kind, w, h), i * 64 + (64 - w) / 2, y0 + 4, w, h);
        }
      }
      // S: the three panels between the rungs (L.61), flush with the body: a thin frame line near the edge (the מסגרת's rim); in the upper
      // row an ox on the left facing right and a lion on the right facing left, as the book p18R draws them; in the lower row two cherubim
      // joined by the ליות - two bands twined round each other, arching from the wing of the one to the wing of the other: the book's
      // arch, the user's "חבוקים זה בזה". The stamps' boxes are nearly square, so that the figures keep their shape
      const xs = [41, (-VSL_RUNG_S + 2) * 256, (VSL_RUNG_S + 2) * 256, 983];   // 41, 355, 669, 983: the posts' and rungs' lines
      const p0 = RW.panels[0], p1 = RW.panels[1];
      const AW = 88, AH = 80, CW = 66;                                          // an animal's figure fills rows 18%..84% of its box, a cherub's 7%..95%
      const flip = (img, x, y, w, h) => {                                       // a stamp facing the other way
        c.save();
        c.translate(x + w, y);
        c.scale(-1, 1);
        c.drawImage(img, 0, 0, w, h);
        c.restore();
      };
      for (let k = 0; k < 3; k++) {
        const x0 = xs[k] + 7, x1 = xs[k + 1] - 7, w4 = (x1 - x0) / 4;
        c.lineWidth = 1.4;
        c.strokeStyle = EDGE;
        c.strokeRect(x0 + 2, p0 + 5, x1 - x0 - 4, p1 - p0 - 10);
        c.lineWidth = 0.8;
        c.strokeStyle = LINE;
        c.strokeRect(x0 + 4.5, p0 + 7.5, x1 - x0 - 9, p1 - p0 - 15);
        const ay = p0 - 3, cy = p1 - 7 - CW;                                    // the animals' feet at row 95, the cherubim from row 105 to 164
        flip(stamp("ox", AW, AH), x0 + w4 - AW / 2, ay, AW, AH);
        flip(stamp("lion", AW, AH), x1 - w4 - AW / 2, ay, AW, AH);
        c.drawImage(stamp("cherub", CW, CW), x0 + w4 - CW / 2, cy, CW, CW);
        c.drawImage(stamp("cherub", CW, CW), x1 - w4 - CW / 2, cy, CW, CW);
        const ax0 = x0 + w4 + CW * 0.45, ax1 = x1 - w4 - CW * 0.45, ty = cy + CW * 0.07 + 2;   // from the inner wing tip of the one to that of the other
        twine(c, ax0, ax1, (x) => ty - 3 * Math.sin(Math.PI * (x - ax0) / (ax1 - ax0)), 3.5, 24, 3.6);
      }
      // M: the mouth - twined borders (seamless round the 1024 px: 32 px periods) and 16 flowers
      c.fillStyle = BAND;
      c.fillRect(0, RW.mouth[0], W, RW.mouth[1] - RW.mouth[0]);
      for (const yb of [RW.mouth[0] + 12, RW.mouth[1] - 12]) twine(c, 0, W, yb, 4.5, 32, 4.5);
      for (let i = 0; i < 16; i++) {
        const lily = i % 2 === 1, w = lily ? 48 : 60, h = lily ? 70 : 60, yc = (RW.mouth[0] + RW.mouth[1]) / 2;
        c.drawImage(stamp(lily ? "lily" : "rosette", w, h), i * 64 + (64 - w) / 2, yc - h / 2, w, h);
      }
      // K: the shoulders - a board with eight cherubs, their heads toward the bar's upper end (the atlas' +x, vsl_baseParts)
      c.fillStyle = BAND;
      c.fillRect(0, RW.shoulders[0], W, RW.shoulders[1] - RW.shoulders[0]);
      c.fillStyle = EDGE;
      c.fillRect(0, RW.shoulders[0] + 1, W, 2);
      c.fillRect(0, RW.shoulders[1] - 3, W, 2);
      for (let i = 0; i < 8; i++) {
        c.save();
        c.translate(30.7 + 962.6 * (i + 0.5) / 8, (RW.shoulders[0] + RW.shoulders[1]) / 2);
        c.rotate(Math.PI / 2);
        c.drawImage(stamp("cherub", 50, 50), -25, -25, 50, 50);
        c.restore();
      }
      // P: plain, a faint mottling
      c.fillStyle = GROUND;
      c.fillRect(0, RW.plain[0], W, HH - RW.plain[0]);
      for (let i = 0; i < 140; i++) {
        c.fillStyle = "rgba(255,226,170," + (0.04 + hash(i) * 0.05).toFixed(3) + ")";
        c.fillRect(hash(i * 3) * W, RW.plain[0] + hash(i * 7) * (HH - RW.plain[0]), 2 + hash(i) * 6, 2 + hash(i * 2) * 4);
      }
    };
    // load speed (1.0.1-K; the bases are not in the first view): the canvas starts as flat bronze (one fill) so the texture and the
    // material exist from the start (no shader change later), and the drawings are painted on idle time after the build - a few ms of
    // canvas work off the load path (1.0.1-L: one canvas instead of two, no bump)
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = HH;
    const cctx = cv.getContext("2d");
    cctx.fillStyle = GROUND;
    cctx.fillRect(0, 0, W, HH);
    const map = new CanvasTexture(cv);
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 4;
    let painted = false;
    const paintNow = () => {
      if (painted) return;
      painted = true;
      try {
        paint(cctx);
        map.needsUpdate = true;
      } catch (e) {
        console.warn("[vessels] relief atlas", e);
      }
    };
    try {
      const idle = typeof window !== "undefined" && window.requestIdleCallback;
      if (idle) idle.call(window, paintNow, { timeout: 2500 }); else setTimeout(paintNow, 300);
    } catch (_) {
      paintNow();
    }
    return { map, paint: paintNow };
  }
  // ---------------------------------------------------------------- THE BASES ----------------------------------------------------------------
  // One base (מכונה) in its own frame: origin on the court floor under its centre, y up. The assembly follows Rashi on I Kings 7:27-35,
  // "בעל צורת הבית" (printed after Rashi 7:37), Metzudat David and the book p17-p19 (the user's reference):
  //   y 0..1.5   the wheels (7:32 "וקומת האופן האחד אמה וחצי האמה"; Rashi 7:27 "לבד קומת האופן... אמה וחצי אמה")
  //   y 1.5..2.5 the body with its roof: "האמה גבה היתה מרבעת" (Rashi 7:27); the book "גוף המכונה והכותרת בגובה אמה אחת": the box
  //              1.5..2.3 (model choice for the split), the roof (כותרת) rising from 2.3 to the mouth at 2.5 - "גג המכונה עשוי כמין כובע
  //              משפע מכל צדדיו" (Rashi 7:31)
  //   y 2.5..3.0 the mouth (פי הכותרת): a round hole 1.5 across with a collar half an amah high - "נקב עגל אמה וחצי אמה רחב בעגול, וסביב
  //              אותו נקב כמין הקף מחצה, חצי אמה גבה" (Rashi 7:31; 7:35 "ובראש המכונה חצי האמה קומה עגל סביב")
  //   total 3 = 7:27 "ושלש באמה קומתה" (the book: "סך הכל גובה המכונה שלש אמות")
  //   the כן: its round bottom half an amah inside the collar, its square top one amah above it, y 3.0..4.0 - "ושולי הכן תחובין בתוך פי
  //              ההקף, ולמעלה הימנו הוא בולט אמה" (Rashi 7:31); "ועליונית הכן היה מרובע" (Metzudat David 7:30)
  //   the laver: a cylinder 4 high standing in the כן, y 3.0..7.0, 1.9 across, 1.75 inside (1.0.1-L, L.62) - Metzudat David 7:38 "הכיור האחד. גבהו של הכיור"; Malbim
  //              7:38 "ארבע באמה הוא בגובה אבל האורך והרוחב היה אמה וחצי ורביע"; the book "4 אמות גובה הכיור", "סה"כ 7 אמות".
  //              DEV note: Ralbag 7:38 reads the 4 as the diameter ("וזכר שקוט' הכיור היה ארבע באמה" - the 1.0.0/1.0.1 bowl); not built now.
  var VSL_WHEEL_R = 0.75;          // wheel radius: 1.5 across (7:32)
  var VSL_HUB_Y = 0.75;            // the axles at half the wheel's height
  var VSL_POST_X = 1.2;            // the wheels (and the posts above them: the book's "ידות"; Rashi's ידות are the axles - vsl_baseParts)
                                   // 1.2 east and west of the centre: the rims reach x +-1.95, inside the 4 x 4
  // 1.0.1-L (FIXES L.8; the user: "בתוך, רק שיראו ברור" - keep them inside the 4 x 4, only make them clearly visible): the big wheels'
  // planes at z +-1.86, so that their hubs end at the footprint's edge (+-1.99) and the rims (+-1.92) stand flush under the body's
  // boards (+-1.99) - seen from the side and from the court's views, not hidden under the body (1.0.1-K: +-1.43, 0.56 inside it, in its
  // shadow). Model choice: the book draws the wheels at the corners, overhanging, with the post and the small lying wheel outboard of
  // the big wheel (p19L); inside the 4 x 4 the big wheel takes the outer place and the post with the small wheel stand INBOARD of it,
  // seen through its spokes. Rashi 7:30 "שנים לפניה ושנים לאחריה, כדרך העגלות הגדולות" (two in front, two behind) holds either way;
  // 1.0.1-L (L.67): inside the 4 x 4 the wheels meet nothing in the block, with its half-amah gaps
  var VSL_WHEEL_Z = 1.86;
  var VSL_WHEEL_OFF = 0.32;        // the post 0.32 inboard of its wheel's plane (the small lying wheel's arm = the wheel's axle)
  var VSL_POST_Z = VSL_WHEEL_Z - VSL_WHEEL_OFF;   // 1.54: the posts and the small wheels (to 1.76) under the body, inside the big wheels
  var VSL_POSTS = [[-1, -1], [1, -1], [-1, 1], [1, 1]];   // (sx, sz) of the four wheels: north-west, north-east, south-west, south-east
  // the wheels' heading at rest: the axle across the row (north-south), the wheel rolling east-west; the small wheel's arm points
  // from the post OUTWARD to its big wheel (north posts: -z, south posts: +z; 1.0.1-L - it pointed inward while the post was outboard)
  var VSL_REST = VSL_POSTS.map((p) => (p[1] < 0 ? Math.PI : 0));

  // 1.0.1-L (FIXES L.9; the user: "תוסיף"): the TAPS of the lavers - Metzudat Zion II Chr 4:6 "כיורים. כעין דוד ולה דדים המריקים מים", their number Mishnah Yoma 3:10 "שלא היו לו אלא שנים"; form and place a MODEL CHOICE "כציור הספר" (the book,
  // the user's reference, pp. 17-19: TWO taps on opposite sides of the laver, just above the כן, each a straight pipe out of the laver's
  // wall with a round flange, at its end a valve with a cross handle on a short stem and a spout turned down; p. 20 draws them along the
  // rows of the bases). Here: on the laver's east and west sides (1.0.1-L, L.67: along the rows of the block, as p. לח), in the laver's frame (the base's frame, y from the
  // court floor): the pipe at y 4.2 (0.2 above the כן's top, y 4.0), 1.03 long from the wall (r 0.97; 1.0.1-L L.62: the laver is 1.9
  // across now) to the valve (r 2.0), the spout's mouth at r 2.12, y 4.05. 1.0.1-L (L.40): the book's pipe is a little shorter (its spout about 1.85 from the axis, over the base's
  // roof); here the mouth stands 0.13 outside the body's boards (|z| 1.99), so that the water of the demonstration falls clear of the
  // base to the floor (model choice). In the block (L.67) the tips of neighbouring bases' taps stand 0.17 apart, as they almost meet in the book's picture p. לח.
  // Returns the geometries of the two taps (merged by vsl_baseParts into the laver).
  var VSL_TAP_Y = 4.2 - 0.08 - 0.07;              // 4.05: the spout's mouth above the court floor (the base's frame), see vsl_tapGeometry
  var VSL_TAP_R = 2.04 + 0.08;                    // 2.12: the mouth's distance from the laver's axis (east and west)
  function vsl_tapGeometry(Y = 4.2, ZW = 0.97, ZV = 2.0) {   // (1.0.1-L: arguments for Moses' laver; the bases use the defaults)
    const R = 0.08, Z0 = ZV + 0.04;   // the pipe's height, the valve's centre, the spout's bend radius and start, the wall
    const one = [
      new CylinderGeometry(0.075, 0.075, 0.05, 14).rotateX(Math.PI / 2).translate(0, Y, ZW),             // the flange on the wall
      new CylinderGeometry(0.036, 0.036, ZV - ZW, 10).rotateX(Math.PI / 2).translate(0, Y, (ZW + ZV) / 2),   // the pipe r 0.97..2.0
      new SphereGeometry(0.07, 12, 8).translate(0, Y, ZV),                                                    // the valve
      new CylinderGeometry(0.018, 0.018, 0.2, 6).translate(0, Y + 0.16, ZV),                                  // its stem, y 4.26..4.46
      new CylinderGeometry(0.016, 0.016, 0.2, 6).rotateX(Math.PI / 2).translate(0, Y + 0.26, ZV)              // the cross handle
    ];
    // the spout: a quarter ring from the valve outward (+z) and down (-y), centre (0, Y - R, Z0); the torus' own plane (x, y) is turned
    // onto (y, z) (a rotation: x -> y, y -> z, z -> x), then a short flared nozzle down to y 4.05
    const sp = new TorusGeometry(R, 0.028, 8, 8, Math.PI / 2);
    sp.applyMatrix4(new Matrix4().makeBasis(new Vector3(0, 1, 0), new Vector3(0, 0, 1), new Vector3(1, 0, 0)));
    one.push(sp.translate(0, Y - R, Z0));
    one.push(new CylinderGeometry(0.03, 0.046, 0.07, 10).translate(0, Y - R - 0.035, Z0 + R));   // the nozzle, a little flared (1.0.1-L)
    const east = mergeGeometries(one).rotateY(Math.PI / 2);                                                   // built pointing +z, turned to +x
    const west = east.clone().rotateY(Math.PI);                                                               // pointing -x (a turn, not a mirror)
    return [east, west];
  }

  // the geometries of one base, in the base's frame (see above). All parts not listed in the sources are model choices.
  // 1.0.1-L (L.61 / L.63 / L.65): the body y 1.5..2.3 - the lower frame 1.50..1.62, the three panels 1.62..2.18, the boards 2.18..2.30 -
  // and the roof's slope 2.30..2.50 (was body 1.5..2.25, slope 0.25; model choice for the split of Rashi's amah, so that the panels have
  // room for their two rows of figures); the panels flush with the frame (0.02 behind the boards' faces, were 0.06 behind in a recess);
  // two rungs per side instead of eight (three panels, the Gra); the collar's wall 0.1 (r 0.75..0.85, was 0.07); the כן's square 2.2
  // with an opening 1.92 for the wider laver (L.62: 1.9 across, 1.75 inside - Malbim 7:38 "אמה וחצי ורביע"; was 1.75 across, 1.6 inside)
  var VSL_BODY_Y0 = 1.5, VSL_BODY_Y1 = 2.3, VSL_BAND = 0.12;   // the body's bottom and top, the boards' and the lower frame's height
  function vsl_baseParts() {
    // atlas (vsl_reliefAtlas) regions in UV: v = 1 - row / 512; the body's side y 2.30..1.50 = rows 0..205 (256 px per amah)
    const U0 = 41 / 1024, U1 = 983 / 1024;                  // s -1.84..1.84 (between the corner posts)
    const RW = VSL_ATLAS_ROWS, vr = (row) => 1 - row / 512;
    const vS = (y) => 1 - (VSL_BODY_Y1 - y) / 2;            // region S: y 2.30..1.50 -> v 1..0.6
    const PLAIN = [0.1, 0.3, 0.03, 0.2];                    // inside region P (v 0..0.2246)
    const faceUV = (geo, faces) => {                        // BoxGeometry faces: +x, -x, +y, -y, +z, -z; null = plain
      const uv = geo.attributes.uv;
      for (let f = 0; f < 6; f++) {
        const r = faces[f] || PLAIN;
        for (let i = 0; i < 4; i++) {
          const k = f * 4 + i;
          uv.setXY(k, r[0] + uv.getX(k) * (r[1] - r[0]), r[2] + uv.getY(k) * (r[3] - r[2]));
        }
      }
      return geo;
    };
    const SIDES = [0, Math.PI, Math.PI / 2, -Math.PI / 2];  // pieces are built on the south side (+z) and turned to S, N, E, W
    const relief = [], frame = [];
    const yB = VSL_BODY_Y1 - VSL_BAND / 2, yF = VSL_BODY_Y0 + VSL_BAND / 2;   // 2.24, 1.56: the boards' and the lower frame's centres
    const yP0 = VSL_BODY_Y0 + VSL_BAND, yP1 = VSL_BODY_Y1 - VSL_BAND;        // 1.62..2.18: the panels
    for (const rot of SIDES) {
      const put = (arr, geo) => { geo.rotateY(rot); arr.push(geo); };
      // the upper boards (סרנים = נסרים, Rashi 7:30 "הם הנסרים העליונים מול המסגרות") y 2.18..2.30 and the low frame (מסגרת, Metzudat
      // David 7:28 "בתחתיות כל מכונה אצל שוליו, היה מחיצה נמוכה") y 1.50..1.62: boards 0.07 thick, their faces at z 1.99
      put(relief, faceUV(new BoxGeometry(3.68, VSL_BAND, 0.07), [null, null, null, null, [U0, U1, vS(yP1), vS(VSL_BODY_Y1)], null]).translate(0, yB, 1.955));
      put(relief, faceUV(new BoxGeometry(3.68, VSL_BAND, 0.07), [null, null, null, null, [U0, U1, vS(VSL_BODY_Y0), vS(yP0)], null]).translate(0, yF, 1.955));
      // the three panels (מסגרות בין השלבים, 7:28-29; Rashi 7:28 "מסגרות קבועות משליבה לשליבה"; the Gra: three on each side - L.61), one
      // plane y 1.62..2.18 whose drawing holds the three panels between the posts' and the rungs' lines, 0.02 behind the boards' faces
      {
        const pl = new PlaneGeometry(3.68, yP1 - yP0);
        const uv = pl.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, U0 + uv.getX(i) * (U1 - U0), vS(yP0) + uv.getY(i) * (vS(yP1) - vS(yP0)));
        put(relief, pl.translate(0, (yP0 + yP1) / 2, 1.97));
      }
      // the upright rungs (שלבים - Rashi 7:28 "כעין שליבות סלם, כמין מקלות נחשת זקופין על המסגרות התחתונה... מסגרות קבועות משליבה
      // לשליבה"; Radak "בדים כמין חונקי הסולם"): two per side at s +-0.613 between the corner posts, bounding the three panels (L.61);
      // standing on the lower frame, in front of the panels, their fronts at z 2.0 (the footprint's edge)
      for (const s of [-VSL_RUNG_S, VSL_RUNG_S]) put(frame, new CylinderGeometry(0.03, 0.03, yP1 - yP0, 6).translate(s, (yP0 + yP1) / 2, 1.97));
    }
    // the corner posts (the book) y 1.5..2.3
    for (const [sx, sz] of VSL_POSTS) frame.push(new BoxGeometry(0.16, VSL_BODY_Y1 - VSL_BODY_Y0, 0.16).translate(sx * 1.92, (VSL_BODY_Y0 + VSL_BODY_Y1) / 2, sz * 1.92));
    // a floor under the body (Malbim 7:30 "נסרים של נחושת בתחתיתה שהיו כמו רצפה להמכונה"; model choice) y 1.5..1.54
    frame.push(new BoxGeometry(3.84, 0.04, 3.84).translate(0, 1.52, 0));
    // the roof (כותרת): a low SQUARE pyramid - Rashi 7:31 "הכותרת היא גג המכונה עשוי כמין כובע משפע מכל צדדיו", 7:35 "והאמה מרבעת";
    // the user (L.65): "הכותרת היתה מרובעת" - from the box's top (half-size 1.995, over the boards' tops, y 2.3) to the collar (half-size 0.85, y 2.5)
    frame.push(new CylinderGeometry(0.85 * Math.SQRT2, 1.995 * Math.SQRT2, 2.5 - VSL_BODY_Y1, 4, 1, true).rotateY(Math.PI / 4).translate(0, (VSL_BODY_Y1 + 2.5) / 2, 0));
    // its top: a square with the round hole THROUGH it (the user: "ובאמצעיתה נקב ברוחב אמה וחצי בעגול"), seen when the כן is lifted out
    frame.push(new ShapeGeometry(vsl_holedSquare(0.85, 0.75, 48)).rotateX(-Math.PI / 2).translate(0, 2.5, 0));
    // the mouth's partition (פי הכותרת, L.65 - the user: "ובאמצעיתה נקב ברוחב אמה וחצי בעגול וסביב הנקב כמין מחיצה בגובה חצי אמה"; Rashi
    // 7:31 "נקב עגל אמה וחצי אמה רחב בעגול, וסביב אותו נקב כמין הקף מחצה, חצי אמה גבה סביב"; 7:35 "ובראש המכונה חצי האמה קומה עגל
    // סביב"): the hole 1.5 across (r 0.75), the ring 0.5 high (y 2.5..3.0), its wall 0.1 (model choice): top and inside here, its outside
    // carries the flowers (relief, below - "וגם על פיה מקלעות", Rashi "צורת פרחים")
    // (1.0.1-L: the hole's wall goes on down to the body's floor, y 1.54)
    frame.push(new LatheGeometry([new Vector2(0.85, 3.0), new Vector2(0.75, 3.0), new Vector2(0.75, 2.5), new Vector2(0.75, 1.54)], 48));
    {
      const mo = new CylinderGeometry(0.85, 0.85, 0.5, 48, 1, true);
      const uv = mo.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i), vr(RW.mouth[1]) + uv.getY(i) * (vr(RW.mouth[0]) - vr(RW.mouth[1])));
      relief.push(mo.translate(0, 2.75, 0));
    }
    // the posts from the body down into the small lying wheels, y 0.71..1.5: a MODEL CHOICE after the book's drawing (p19L: "ידותם - המקל
    // מהמכונה שיורד לתוך הגלגל"), like the small lying wheel that turns the big one (swParts below). 1.0.1-K review (vessels-4): for
    // Rashi the ידות are the wheels' AXLES - 7:28 "ויד אופן, הוא עץ התחוב בתוך האופן בנקב, וקרוי איישי"ל בלע"ז (ציר של גלגל)"; 7:32
    // "וידות האופנים. הוא עץ התחוב באופנים, וקורין איישי"ל (ציר של גלגל)", cast with the base ("במכונה. דבוקים מצוקים במכונה ביציקה
    // אחת"); 7:33 "ידותם. איישי"ל (ציר של גלגל)" - and for בעל צורת הבית (printed after Rashi 7:37) rods through pairs of wheels, east-west
    // through the outer ones and north-south through the inner ones: "ומקל עב וארוך נתחב בשני האופנים שממזרח למערב הצפוניים... היה מקל
    // נתון ונתחב בשנים מהם שמצפון לדרום המזרחיים... ואלו המקלות קראם הכתוב 'ידות'". Neither has vertical posts or a lying wheel; here
    // the axles are the small wheels' arms (swParts), the posts carry them
    for (const [sx, sz] of VSL_POSTS) frame.push(new CylinderGeometry(0.045, 0.045, 0.79, 8).translate(sx * VSL_POST_X, 1.105, sz * VSL_POST_Z));
    // the four shoulders (כתפות) from the corners of the body up to under the כן's corners - "כתפות להם... בולטות למעלה מן הנסרים בזויות
    // הכן. ותחת הכיור היושב על הכן, היו הכתפות יצוקות" (Rashi 7:30); 7:34 "וארבע כתפות אל ארבע פנות המכנה האחת"; the book: "הם היו יוצאים
    // מפינות המכונה, ומגיעים עד תחתית הכן". A bar 0.12 x 0.1 whose upper face carries cherubs (the user: "על הכתפות כרובים"; the book).
    {
      const X = new Vector3(), Y = new Vector3(), Z = new Vector3(), o = new Vector3(), m4 = new Matrix4();
      for (const [sx, sz] of VSL_POSTS) {
        const a = new Vector3(sx * 1.92, VSL_BODY_Y1, sz * 1.92), b = new Vector3(sx * 1.0, 2.98, sz * 1.0);
        const L = a.distanceTo(b);
        Y.subVectors(b, a).normalize();
        o.set(sx, 0, sz).normalize();
        Z.copy(o).addScaledVector(Y, -o.dot(Y)).normalize();            // across the bar, facing outward and up
        X.crossVectors(Y, Z).normalize();
        const bar = new BoxGeometry(0.12, L, 0.1);
        const uv = bar.attributes.uv;
        for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
          const k = f * 4 + i, u = uv.getX(k), v = uv.getY(k);
          if (f === 4) uv.setXY(k, 0.03 + v * 0.94, vr(RW.shoulders[1]) + u * (vr(RW.shoulders[0]) - vr(RW.shoulders[1])));   // the upper face: region K, the cherubs along the bar
          else uv.setXY(k, PLAIN[0] + u * (PLAIN[1] - PLAIN[0]), PLAIN[2] + v * (PLAIN[3] - PLAIN[2]));
        }
        m4.makeBasis(X, Y, Z).setPosition((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
        relief.push(bar.applyMatrix4(m4));
      }
    }
    // the כן (L.65 - the user: "והכן מונח על ההיקף הנ"ל ושולי הכן תחובים, גובהו של הכן הבולט היה אמה"; Rashi 7:31 "והכן מנח על אותו הקף,
    // ושולי הכן תחובין בתוך פי ההקף, ולמעלה הימנו הוא בולט אמה"; Metzudat David 7:31 "ובתחתיתו היה עגול חצי האמה, והיה תחוב במחיצת נקב
    // הכותרת, והאמה העליונה היתה מרובעת"): the round bottom (open cylinder, r 0.72) half an amah inside the partition (y 2.5..3.0), a
    // floor at 3.0 under the laver, the square amah (2.2 across, y 3.0..4.0) resting on the partition with a round opening for the laver
    // (1.92 across - the laver is 1.9: model choice; Metzudat David 7:30 "ועליונית הכן היה מרובע... קרנות הריבוע העמידו על מקומו")
    const ken = [];
    ken.push(new CylinderGeometry(0.72, 0.72, 0.5, 32, 1, true).translate(0, 2.75, 0).toNonIndexed());
    ken.push(new CircleGeometry(0.98, 32).rotateX(-Math.PI / 2).translate(0, 3.0, 0).toNonIndexed());
    {
      const sh = vsl_holedSquare(1.1, 0.96, 40);     // 1.0.1-L: a polygonal hole without the seam's repeated point (vsl_holedSquare)
      const sq = new ExtrudeGeometry(sh, { depth: 1.0, bevelEnabled: false, curveSegments: 32 });
      sq.rotateX(-Math.PI / 2);                     // extrusion upward
      sq.translate(0, 3.0, 0);
      ken.push(sq);
    }
    // the laver (1.0.1-L, L.62 - the user: "כל כיור היה בגודל 40 בת (40 איפות = 880 ליטר)"; 7:38 "ארבעים בת יכיל הכיור האחד ארבע באמה
    // הכיור האחד"): a cylinder 4 high (y 3.005..7.0: Metzudat David 7:38 "גבהו של הכיור"; Malbim "ארבע באמה הוא בגובה") and 1.9 across
    // outside, 1.75 inside (Malbim 7:28 "אם היה כולו עגול, היה מחזיק בחללו אמה וחצי ורביע על אמה וחצי ורביע"; for Malbim himself, whose lower part is square, 7:28 "מבחוץ";
    // the outer 1.9, the wall 0.075 and the lip - model choices); inside: r 0.875 x 3.95 (1.0.1-L: y 3.05..7.0, was 3.12, so that the Gemara's reckoning too reaches 40 bat:
    // 3/4 x 1.75 x 1.75 x 3.95 = 9.07 = 40.3 bat; by the real circle 9.47 = 42.1 bat to the brim, measured), 3 mikvaot of 3 cubic amot = 120 seah = 40 bat (Malbim "ארבעים בת שהם מאה ועשרים
    // סאין, שהוא שיעור ג' מקואות"; Eruvin 14b "״בת״ כמה הויא - שלש סאין") = 995 litres with the amah 48 cm (the user's 880). The water at
    // 6.9: 9.22 cubic amot = 41.0 bat by the real circle. Was 1.75 across, 1.6 inside = 7.8 cubic amot (35 bat). With its two taps (vsl_tapGeometry, L.9)
    // in the same geometry, so that they are instanced with it, ride on the moving base and rise with the explode. DEV note: Ralbag 7:38
    // reads the 4 as the diameter ("וזכר שקוט' הכיור היה ארבע באמה") - not built.
    const laver = mergeGeometries([new LatheGeometry([[0.01, 3.005], [0.92, 3.005], [0.95, 3.04], [0.95, 6.85], [1.01, 6.9], [1.01, 7.0],
      [0.935, 7.0], [0.875, 6.95], [0.875, 3.05], [0.01, 3.05]].map((p) => new Vector2(p[0], p[1])), 40)].concat(vsl_tapGeometry()));
    const water = new CircleGeometry(0.86, 32).rotateX(-Math.PI / 2).translate(0, 6.9, 0);
    // the wheel (axle along z, centred at the origin): rim (חשוק), 16 spokes (חשרים), hub (גב) - 7:33 "ידותם וגביהם וחשקיהם וחשריהם";
    // Rashi "וגביהם... הם הנקבים; וחשקיהם. הם עגלים סביב; וחשריהם - זרועות האופנים, התחובים מגביהם לחשוקיהם".
    // 1.0.1-L (L.8, "שיראו ברור"): thicker parts so that they read from the court's views (model choice after the book's sturdy wheels,
    // p17-p19): the rim 0.12 thick (outer radius 0.75 = 7:32), the spokes 0.064 (were 0.04), the hub 0.26 across and 0.26 long (to the
    // footprint's edge); the rim's bottom touches the floor
    const wheelParts = [new TorusGeometry(0.69, 0.06, 8, 40)];
    for (let k = 0; k < 16; k++) wheelParts.push(new CylinderGeometry(0.032, 0.032, 0.56, 6).translate(0, 0.395, 0).rotateZ(k * Math.PI / 8));
    wheelParts.push(new CylinderGeometry(0.13, 0.13, 0.26, 16).rotateX(Math.PI / 2));
    // the small lying wheel on the post (origin on the post's axis at the hub height; its arm toward +z = toward the big wheel) - a MODEL
    // CHOICE (1.0.1-K review, vessels-4): the book's reading (p19L) of "אופן בתוך האופן שתי וערב" (Rashi 7:33, after Targum Yonatan):
    // "גלגל קטן [שוכב], המסובב את הגלגל הגדול [עומד], באופן שארבעת הגלגלים הגדולים יכולים להסתובב לכל הצדדים"; the arm (a short axle -
    // Rashi's יד, "ציר של גלגל") carries the big wheel. 1.0.1-L (L.66; the user: "הקטן הסתובב לצדדים והגדול הלך קדימה ואחור"): checked -
    // vsl_wheelMats turns the small wheel with its arm about the post (alpha: the heading) and spins the big wheel about the arm (phi:
    // the rolling); the demonstration swivels at every corner of its route and rolls between them
    const swParts = [new TorusGeometry(0.19, 0.03, 6, 24).rotateX(Math.PI / 2)];
    for (let k = 0; k < 6; k++) swParts.push(new CylinderGeometry(0.014, 0.014, 0.14, 4).rotateZ(Math.PI / 2).translate(0.115, 0, 0).rotateY(k * Math.PI / 3));
    swParts.push(new CylinderGeometry(0.065, 0.065, 0.09, 10));
    swParts.push(new CylinderGeometry(0.035, 0.035, 0.24, 8).rotateX(Math.PI / 2).translate(0, 0, 0.31));
    return {
      frame: mergeGeometries(frame), relief: mergeGeometries(relief), ken: mergeGeometries(ken), laver, water,
      wheel: mergeGeometries(wheelParts), swivel: mergeGeometries(swParts)
    };
  }
  // the local matrices of wheel k for the swivel angle alpha (0 = rolling east-west, PI/2 = rolling north-south) and the spin phi
  function vsl_wheelMats(k, alpha, phi, mSwivel, mWheel, q, q2, e, v, one) {
    const sx = VSL_POSTS[k][0], sz = VSL_POSTS[k][1], psi = VSL_REST[k] + alpha;   // no destructuring: runs every frame (1.0.1-K review)
    const px = sx * VSL_POST_X, pz = sz * VSL_POST_Z;
    e.set(0, psi, 0);
    q.setFromEuler(e);
    mSwivel.compose(v.set(px, VSL_HUB_Y, pz), q, one);
    e.set(0, 0, phi);
    q2.setFromEuler(e);
    q2.premultiply(q);                              // turn about the axle (local z), then the heading
    mWheel.compose(v.set(px + Math.sin(psi) * VSL_WHEEL_OFF, VSL_HUB_Y, pz + Math.cos(psi) * VSL_WHEEL_OFF), q2, one);
  }

  // The ten bases (מכונות) with their lavers (I Kings 7:27-39; II Chr 4:6, 4:14): nine resting bases instanced, and one built as moving
  // parts for the demonstration of the wheels (ctx.shared.mechona). 1.0.1-L (L.67): all ten in one block of two rows of five round
  // Moses' laver (vsl_layout); the moving one stands in the north row, with a free way north past the altar's west side.
  function vsl_buildMechonot(ctx, g) {
    const M2 = ctx.M, CO2 = ctx.CO, F = ctx.LV.AZ;
    const L = vsl_layout(CO2, ctx.shared);
    const centres = [];
    for (const z of L.rows) for (const x of L.cols) centres.push([x, z]);   // the north row (z 33) x 21..39, then the south row (z 45)
    const HX = L.home[0], HZ = L.home[1];           // (34.5, 33): the moving base
    const rest = centres.filter((c) => !(c[0] === HX && c[1] === HZ));
    // bronze (vsl_bronze, 1.0.1-K: polished, not dull brown); the decorations: the atlas colour with the same recipe
    const BR = vsl_bronze(M2, 0xc08040, 0.3);
    BR.roughness = 0.45;                            // 1.0.1-L: at 0.3 the sun burnt the roofs' slopes out to white in the block's views (pictures)
    const BRS = vsl_bronze(M2, 0xc4844a, 0.22);     // the lavers: the most polished (and their taps, L.9)
    // 1.0.1-L (L.8): the wheels and the small lying wheels in a darker bronze than the body, so that they read against it and against
    // the light marble floor (model choice; the book draws the wheels darker than the body, pp. 17-19)
    const BRW = vsl_bronze(M2, 0x7a4520, 0.38, 0.25);
    let REL = BR;
    try {
      const at = vsl_reliefAtlas();
      REL = vsl_bronze(M2, 0xffffff, 0.34);
      REL.color.setRGB(1.12, 1.12, 1.12);           // the atlas holds the bronze colour; brightened like the plain parts
      REL.map = at.map;                             // 1.0.1-L (L.63): no bump map - the drawings are flat ("לא בולט/שקוע")
      // ... so they live on the colour alone: a little of the atlas as emissive, that they read on the shaded sides too
      REL.emissive.set(0xffffff);
      REL.emissiveMap = at.map;
      REL.emissiveIntensity = 0.22;
    } catch (e) {
      console.warn("[vessels] relief texture skipped", e);
    }
    const WAT = new MeshStandardMaterial({ color: 0x1f4a7a, roughness: 0.15, metalness: 0.1 });
    const P = vsl_baseParts();
    const m4 = new Matrix4(), mS = new Matrix4(), mW = new Matrix4(), q = new Quaternion(), q2 = new Quaternion(), e = new Euler();
    const v = new Vector3(), one = new Vector3(1, 1, 1);

    // --- the nine resting bases (instanced) ---
    const inst = (geo, mat, n, name, shadow) => {
      const im = new InstancedMesh(geo, mat, n);
      im.castShadow = shadow !== false;
      im.receiveShadow = true;
      im.name = name;
      g.add(im);
      return im;
    };
    const parts = [["frame", BR], ["relief", REL], ["ken", BR], ["laver", BRS], ["water", WAT]];
    for (const [key, mat] of parts) {
      const im = inst(P[key], mat, rest.length, "mechonot-" + key, key !== "water");
      rest.forEach(([x, z], i) => im.setMatrixAt(i, m4.makeTranslation(x, F, z)));
    }
    {
      const wi = inst(P.wheel, BRW, rest.length * 4, "mechonot-wheels"), si = inst(P.swivel, BRW, rest.length * 4, "mechonot-swivels");
      const bm = new Matrix4();
      rest.forEach(([x, z], i) => {
        bm.makeTranslation(x, F, z);
        for (let k = 0; k < 4; k++) {
          vsl_wheelMats(k, 0, 0.13 * (i * 4 + k), mS, mW, q, q2, e, v, one);
          si.setMatrixAt(i * 4 + k, m4.multiplyMatrices(bm, mS));
          wi.setMatrixAt(i * 4 + k, m4.multiplyMatrices(bm, mW));
        }
      });
    }

    // --- the moving base: the same parts as separate objects in one Group (the body never turns: only the group moves) ---
    const mg = new Group();
    mg.name = "mechona-moving";
    mg.position.set(HX, F, HZ);
    g.add(mg);
    const mk = (geo, mat, name, shadow) => {
      const m = new Mesh(geo, mat);
      m.castShadow = shadow !== false;
      m.receiveShadow = true;
      m.name = name;
      mg.add(m);
      return m;
    };
    mk(P.frame, BR, "mechona-frame");
    mk(P.relief, REL, "mechona-relief");
    const kenM = mk(P.ken, BR, "mechona-ken"), laverM = mk(P.laver, BRS, "mechona-laver"), waterM = mk(P.water, WAT, "mechona-water", false);
    const wheels = new InstancedMesh(P.wheel, BRW, 4), swivels = new InstancedMesh(P.swivel, BRW, 4);
    for (const im of [wheels, swivels]) {
      im.castShadow = im.receiveShadow = true;
      im.frustumCulled = false;                     // the instances move inside the group
      mg.add(im);
    }
    wheels.name = "mechona-wheels";
    swivels.name = "mechona-swivels";

    // --- the demonstration (1.0.1-L, FIXES L.40; the user: "מה היה תפקידה של המכונה? תחפש, ודאי שתפקידה לא היה ללכת ולחזור סתם").
    // What the sources say the base was for:
    //   - the laver's seat: Radak 7:27 "המכונה היא מושב הכיור כמו שנאמר בכיור שעשה משה את הכיור ואת כנו"; Ralbag 7:27 "הנה היו המכונות
    //     משמשות להיות מושב הכיור"; Metzudat David 7:27 "הם כני הכיורות... ובו היה מושב הכיור"; Rashi on II Chr 4:14 "מכונות הם כני הכיור";
    //   - the lavers' water: II Chr 4:6 "לרחצה בהם את מעשה העולה ידיחו בם" - Rashi there "מן מימי הכיור ידיחו קרבי העולה", Metzudat
    //     David there "אף היו מדיחים בהם מעשה העולה כקרבים וכיוצא", Ralbag there "כמו הקרב והכרעים"; Rashi on I Kings 7:38 "כתיב
    //     בדברי הימים: את מעשה העלה ידיחו בם";
    //     and the priests' hands and feet (1.0.1-L, L.64; the user: "המכונות נועדו גם לקידוש ידים ורגלים של הכהנים"): Rashi on II Chr
    //     4:6 "וחמשה משמאול לרחצה בהם. קדוש ידים ורגלים"; Radak 7:39 "והכיורים היו לרחוץ מהם הכהנים ידיהם ורגליהם ולהדיח בהם מעשה
    //     העולה כמו שאומר בדברי הימים"; Ralbag 7:38 "הנה הכיור היה משמש לקדש ידיו ורגליו של כהן כמו שנזכר בתורה והיה משמש להדחת
    //     מעשה העול' ג"כ"; Abarbanel 7:27; the book p. לג "מהכיורות היו מקדשים ידים ורגלים, וכן היו מדיחים במימיהם קרבי העולה";
    //   - the wheels: Metzudat David 7:30 "ב׳ לפנים ב׳ לאחור, כאלו ישאו אותה"; בעל צורת הבית and Malbim 7:32-33 have them turn (Ralbag 7:36, against: "ואחשוב שהאופנים לא היו סובבים"); בעל צורת הבית
    //     (printed after Rashi 7:37, and in his צורת בית המקדש) "אופן בתוך אופן, למען יוכל להוליכם אל אשר יהיה הרוח והרצון להוליכם, שמה
    //     יוליכם מבלי שיצטרך להפכם אנה ואנה".
    // No source says where they were taken. MODEL CHOICE built on these (1.0.1-L, L.67: from the block south of the axis): the base
    // leaves the block northward along its column (x 34.5; the wheels first turn from their rest, rolling east-west, to north-south) - between the ulam's steps (x 18.5..24.5) and the altar's west face (x 39.5) - and
    //   1. stops between the ulam and the altar, beside the ramp (WASH, z 22: the ramp runs x 41.5..57.5, z 10..42), while its water runs
    //      for the priests' hands and feet before they go up to the altar (Ex 30:18 "ונתת אתו בין אהל מועד ובין המזבח"; 30:19-20 "ורחצו אהרן
    //      ובניו ממנו את ידיהם ואת רגליהם... או בגשתם אל המזבח לשרת"; Rashi 30:19 "בבת אחת היה מקדש ידיו ורגליו") - the label of layer
    //      mechonaWash;
    //   2. drives on past the altar's west side to the slaughter place north of the altar, where the burnt offering is slaughtered (Lev
    //      1:11 "ושחט אתו על ירך המזבח צפנה"; Rashi "על צד המזבח") and its innards are rinsed on the marble tables (Mishnah Shekalim 6:4
    //      "שמונה של שיש בבית המטבחים, שעליהן מדיחין את הקרבים"; Middot 3:5 "ומפשיטין על שלחנות של שיש שבין העמודים"; Rambam Beit
    //      HaBechira 5:14 "שלחנות של שיש שמניחין עליהן הנתחים ומדיחין את הבשר לבשלו"), and stops WEST of the tables (STOP: the base's
    //      east face 1.5 from the tables' west face, on their middle line - 30-courts.js ctx.shared.slaughterPlace.tables, FIXES L.68;
    //      x 43, z -46) while the water runs from its EAST tap for the rinsing of the innards and legs (Lev 1:9 "וקרבו וכרעיו ירחץ
    //      במים"; 1:13) - the label of layer mechonaPurpose; the east tap, toward the tables, on the side that the demonstration's view (from the east) sees:
    //      the water falls at x 45.12, 1.38 from the tables' west end (x 46.5);
    //   3. comes back the same way - north, east, west, south: four directions while the body never turns.
    // The route keeps x 32.3..45.2, z -48.4..35 (1.0.1-L: measured on all its parts, every 0.1 s): 7.8 east of the ulam steps, 2.7 west of the altar's body (1.0.2 add-on: its yesod's west face is x 37.5, z -12..12; the base's full box, taps included, keeps 0.38 from it, measured over the whole round), 4.8 west of the ramp, 6.2 west of the
    // rings (x >= 42.82) along x 34.5; at the station 3.9 north of the last rings, 1.5 from the tables and the pillars' row (z -49.5) in the book's layout, the same or more in the other two
    // (30-courts.js, slaughterLayout; the stop is computed from the book's tables and does not move), 27 and more
    // from the Sea (x >= 72.83). Speed 5 amot a second (was 3: the way is 87.5 amot each way now), 0.7 s to turn the wheels, 4 s and 5 s of
    // water: 48.6 s the round. ---
    const SP = ctx.shared.slaughterPlace, TB = SP && SP.tables;
    const STOP = TB && TB.cols && TB.size ? [Math.min.apply(null, TB.cols) - TB.size[0] / 2 - 1.5 - 2, TB.middleZ] : [43, -46];   // (43, -46)
    const WASH = [HX, HZ - 11];                     // (34.5, 22): beside the ramp (z 10..42), 5 west of it, between the ulam and the altar
    const ROUTE = [[HX, HZ], WASH, "wash", [HX, STOP[1]], STOP, "pour", [HX, STOP[1]], [HX, HZ]];   // home, the ramp, the corner, the tables and back
    const WP = ROUTE.filter((p) => typeof p !== "string");   // the corners of the route (the contract's demo.path)
    const SPEED = 5.0, TURN = 0.7, PAUSE0 = 1.2, PAUSE1 = 0.2, POUR = 5.0, WASHT = 4.0, FLOW = 0.35;   // FLOW: the water starts / stops in 0.35 s
    const REST_ALPHA = 0;                           // the resting heading of the small wheels: rolling east-west, like the nine resting bases
                                                    // (the wheels inside the 4 x 4, L.8); the route's first leg runs north, so the round
                                                    // begins and ends with a turn of the small wheels (L.66)
    const TL = [];                                  // the timeline: {type, t0, dur, ...}
    {
      let t = 0, alpha = REST_ALPHA, x = ROUTE[0][0], z = ROUTE[0][1];
      TL.push({ type: "pause", t0: t, dur: PAUSE0, x, z, alpha });
      t += PAUSE0;
      for (let i = 1; i < ROUTE.length; i++) {
        if (typeof ROUTE[i] === "string") {
          const dur = ROUTE[i] === "wash" ? WASHT : POUR;
          TL.push({ type: "pour", kind: ROUTE[i], t0: t, dur, x, z, alpha });
          TL[ROUTE[i]] = [t, t + dur];
          t += dur;
          continue;
        }
        const x1 = ROUTE[i][0], z1 = ROUTE[i][1];
        if (Math.abs(x1 - x) < 1e-9 && Math.abs(z1 - z) < 1e-9) continue;
        const a1 = Math.abs(x1 - x) > 1e-9 ? 0 : Math.PI / 2;
        if (a1 !== alpha) {
          TL.push({ type: "turn", t0: t, dur: TURN, x, z, a0: alpha, a1 });
          t += TURN;
          TL.push({ type: "pause", t0: t, dur: PAUSE1, x, z, alpha: a1 });
          t += PAUSE1;
          alpha = a1;
        }
        const dur = Math.hypot(x1 - x, z1 - z) / SPEED;
        TL.push({ type: "move", t0: t, dur, x0: x, z0: z, x1, z1, alpha });
        t += dur;
        x = x1;
        z = z1;
      }
      // home again: the wheels turn back to their resting heading
      if (alpha !== REST_ALPHA) {
        TL.push({ type: "turn", t0: t, dur: TURN, x, z, a0: alpha, a1: REST_ALPHA });
        t += TURN;
      }
      TL.total = t;
    }
    const smooth = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k));
    const poseAt = (tau, out) => {
      let s = TL[TL.length - 1];
      for (let i = 0; i < TL.length; i++) if (tau < TL[i].t0 + TL[i].dur) { s = TL[i]; break; }   // a plain loop: runs every frame (1.0.1-K review)
      const k = smooth((tau - s.t0) / s.dur);
      out.flow = 0;
      if (s.type === "move") { out.x = s.x0 + (s.x1 - s.x0) * k; out.z = s.z0 + (s.z1 - s.z0) * k; out.alpha = s.alpha; }
      else if (s.type === "turn") { out.x = s.x; out.z = s.z; out.alpha = s.a0 + (s.a1 - s.a0) * k; }
      else {
        out.x = s.x; out.z = s.z; out.alpha = s.alpha;
        if (s.type === "pour") out.flow = Math.max(0, Math.min(1, (tau - s.t0) / FLOW, (s.t0 + s.dur - tau) / FLOW));
      }
      return out;
    };
    const st = { running: false, homing: false, tau: 0, last: null, ex: 0, exTarget: 0, dirty: true };
    const pose = { x: HX, z: HZ, alpha: REST_ALPHA, flow: 0 }, np = { x: HX, z: HZ, alpha: REST_ALPHA, flow: 0 };
    const phi = [0.2, 0.9, 0.5, 1.4];

    // --- the water of the demonstration (1.0.1-L, L.40; model choice): while the base stands at a stop a stream runs from the east
    // tap's spout (VSL_TAP_R 2.12 east of the axis, VSL_TAP_Y 4.05 up) to the floor, with a small spreading pool under it; as wide as
    // the nozzle (0.09 across), a strong blue so that it reads against the marble floor from the demonstration's view. In the moving
    // group, so it follows the base; hidden while the laver is raised (the explode). Scaled per frame, no allocation. ---
    const WATS = new MeshStandardMaterial({ color: 0x7db8ec, emissive: 0x15406a, emissiveIntensity: 0.5, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.85, depthWrite: false });
    const WATP = new MeshStandardMaterial({ color: 0x5f97cc, emissive: 0x0f3050, emissiveIntensity: 0.4, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.7, depthWrite: false });
    const stream = new Mesh(new CylinderGeometry(0.045, 0.04, 1, 12, 1, true).translate(0, -0.5, 0), WATS);   // hangs 1 down from its top
    stream.position.set(VSL_TAP_R, VSL_TAP_Y, 0);
    stream.name = "mechona-stream";
    stream.visible = false;
    const pool = new Mesh(new CircleGeometry(0.5, 24).rotateX(-Math.PI / 2), WATP);
    pool.position.set(VSL_TAP_R, 0.012, 0);
    pool.name = "mechona-pool";
    pool.visible = false;
    mg.add(stream, pool);

    // --- the parts' labels (layer "mechonaParts": shown by the UI with the exploded view), placed round the moving base and moved with
    // it; offsets in the base's frame, `ex` = how far the part rises when the base is taken apart ---
    ctx.layers = ctx.layers || {};
    const layer = new Group();
    layer.name = "mechonaParts";
    layer.visible = false;
    g.add(layer);
    ctx.layers.mechonaParts = layer;
    // laid out for the view of the base taken apart (flyPoints.mechonaParts; 1.0.1-L: from the north, the block's free side - the close
    // view mechonaClose looks from a little further east and still sees them apart): A = toward that camera, L = to the left on its screen
    // (the east side), y = height above the court floor; the laver's and the כן's labels rise with them. All at A >= 2.4: on the row's free
    // north side (1.0.1-L: nearer, they fell inside the neighbouring bases and were hidden)
    const CAM = [4.5, -11.5];                       // the close view's offset from the base (mechonaClose)
    const LAB = [0.5, -14], LL = Math.hypot(LAB[0], LAB[1]);
    const FW = [LAB[0] / LL, LAB[1] / LL], LF = [-LAB[1] / LL, LAB[0] / LL];
    const PL = [
      { text: "הכיור (ז, לח)", A: 2.4, L: 1.6, y: 5.4, ex: 2.5 },
      { text: "הכן (ז, כט; ז, לא)", A: 2.4, L: -1.9, y: 3.75, ex: 1.2 },
      { text: "פי הכותרת (ז, לא)", A: 2.4, L: 1.9, y: 3.25, ex: 0 },
      { text: "הכתפות (ז, ל; ז, לד)", A: 2.4, L: -0.9, y: 3.05, ex: 0 },
      { text: "הכותרת — גג המכונה (רש״י ז, לא)", A: 2.6, L: -2.9, y: 2.15, ex: 0 },
      { text: "המסגרות והשלבים (ז, כח–כט)", A: 2.6, L: -2.7, y: 1.55, ex: 0 },
      { text: "אופן בתוך אופן (רש״י ז, לג)", A: 2.6, L: 1.3, y: 0.95, ex: 0 }
    ].map((p) => ({ text: p.text, o: [p.A * FW[0] + p.L * LF[0], p.y, p.A * FW[1] + p.L * LF[1]], ex: p.ex }));
    const partLabels = PL.map((p) => {
      const l = { text: p.text, x: HX + p.o[0], y: F + p.o[1], z: HZ + p.o[2], size: 0.75, layer: "mechonaParts" };
      ctx.labels.push(l);
      return l;
    });
    // 1.0.1-L (L.40 / L.64): the labels of the demonstration's two purposes at its two stops, each on its own hidden layer that the
    // demonstration shows while the base stands there (from 1.5 s before the water to 0.6 s after it), never a panel layer
    const mkLayer = (name) => {
      const lg = new Group();
      lg.name = name;
      lg.visible = false;
      g.add(lg);
      ctx.layers[name] = lg;
      return lg;
    };
    const purpose = mkLayer("mechonaPurpose"), wash = mkLayer("mechonaWash");
    const PURPOSE_TEXT = "הדחת קרבי העולה (דברי הימים ב ד, ו; שקלים ו, ד)";
    const WASH_TEXT = "קידוש ידים ורגלים (רש״י דברי הימים ב ד, ו; רד״ק ז, לט)";
    // west of each stop, low over the floor (the purpose's 8 south of it, that its long text stays inside the route's view): each stands beside its stop, clear
    // of the base, of its two pills and of the slaughter place's own labels; the size of "המכונות והכיורות" so that they read from afar
    ctx.labels.push({ text: PURPOSE_TEXT, x: STOP[0] - 7.5, y: F + 3.4, z: STOP[1] + 8, size: 2.4, layer: "mechonaPurpose" });
    ctx.labels.push({ text: WASH_TEXT, x: WASH[0] - 7.5, y: F + 3.4, z: WASH[1] - 1.5, size: 2.4, layer: "mechonaWash" });
    let sprites = null, spriteTries = 0;           // the UI's sprites of the part labels (sprite.userData.label), looked up a few times
    const findSprites = () => {
      try {
        const lg = ctx.root.getObjectByName("labels");
        if (!lg) return null;
        const res = partLabels.map((l) => lg.children.find((s) => s.userData && s.userData.label === l) || null);
        return res.some((s) => s) ? res : null;
      } catch (_) {
        return null;
      }
    };

    // --- apply the current pose: the group, the wheels' and small wheels' matrices, the explode offsets, the labels ---
    const apply = () => {
      mg.position.set(pose.x, F, pose.z);
      for (let k = 0; k < 4; k++) {
        vsl_wheelMats(k, pose.alpha, phi[k], mS, mW, q, q2, e, v, one);
        swivels.setMatrixAt(k, mS);
        wheels.setMatrixAt(k, mW);
      }
      swivels.instanceMatrix.needsUpdate = wheels.instanceMatrix.needsUpdate = true;
      const s = smooth(st.ex);
      kenM.position.y = 1.2 * s;                    // the כן rises 1.2: its round bottom (2.5..3.0) clears the partition (3.0) by 0.7
      laverM.position.y = waterM.position.y = 2.5 * s;   // the laver rises 2.5: its bottom (5.5) 0.3 above the raised כן (5.2)
      // 1.0.1-L (L.40): the water from the east tap while the base stands at a stop - the stream grows down from the spout as it
      // opens and the pool spreads under it; nothing while the laver is raised (the explode)
      const fl = s < 0.01 ? pose.flow : 0;
      stream.visible = pool.visible = fl > 0.001;
      if (fl > 0.001) {
        stream.scale.y = VSL_TAP_Y * fl;
        pool.scale.set(0.35 + 0.65 * fl, 1, 0.35 + 0.65 * fl);
      }
      // the purposes' labels: while the base stands at a stop in the demonstration (or is put there by seek), not while it drives
      const act = st.running || st.homing || pose.flow > 0;
      const pOn = act && st.tau > TL.pour[0] - 1.5 && st.tau < TL.pour[1] + 0.6;
      const wOn = act && st.tau > TL.wash[0] - 1.5 && st.tau < TL.wash[1] + 0.6;
      if (purpose.visible !== pOn) purpose.visible = pOn;
      if (wash.visible !== wOn) wash.visible = wOn;
      if (!sprites && spriteTries < 40) { spriteTries++; sprites = findSprites(); }
      for (let i = 0; i < PL.length; i++) {          // (a plain loop: no allocation per frame while the base moves)
        const p = PL[i], l = partLabels[i];
        l.x = pose.x + p.o[0];
        l.y = F + p.o[1] + p.ex * s;
        l.z = pose.z + p.o[2];
        const spr = sprites && sprites[i];
        if (spr) spr.position.set(l.x, l.y, l.z);
      }
      st.dirty = false;
    };
    apply();
    ctx.animated.push((t) => {
      const now = typeof t === "number" && isFinite(t) ? t : performance.now();
      const dt = st.last == null ? 0 : Math.min(0.1, Math.max(0, (now - st.last) / 1000));
      st.last = now;
      let changed = st.dirty;
      if (st.running || st.homing) {
        st.tau += dt * (st.homing ? 3 : 1);
        if (st.tau >= TL.total) {
          if (st.homing) { st.tau = 0; st.homing = false; } else st.tau -= TL.total;
        }
        poseAt(st.tau, np);
        const dx = np.x - pose.x, dz = np.z - pose.z;
        if (dx || dz) for (let k = 0; k < 4; k++) {
          const psi = VSL_REST[k] + np.alpha;
          phi[k] -= (dx * Math.cos(psi) - dz * Math.sin(psi)) / VSL_WHEEL_R;   // rolling without slipping along the wheel's own x
        }
        pose.x = np.x;
        pose.z = np.z;
        pose.alpha = np.alpha;
        pose.flow = np.flow;
        changed = true;
      }
      if (st.ex !== st.exTarget) {
        st.ex = st.exTarget > st.ex ? Math.min(st.exTarget, st.ex + dt / 1.1) : Math.max(st.exTarget, st.ex - dt / 1.1);
        changed = true;
      }
      if (changed) apply();
    });
    const demo = {
      start() {
        st.running = true;
        st.homing = false;
      },
      // stop: the base finishes its round at three times the speed and stands in its place again (never left in the court)
      stop() {
        if (!st.running) return;
        st.running = false;
        st.homing = st.tau > PAUSE0;
        if (!st.homing) st.tau = 0;
      },
      // reset: at once back in its place (for the presentation)
      reset() {
        st.running = st.homing = false;
        st.tau = 0;
        poseAt(0, np);
        pose.x = np.x;
        pose.z = np.z;
        pose.alpha = np.alpha;
        pose.flow = np.flow;
        st.dirty = true;
      },
      // seek: put the base at a moment of its round (seconds from the start; for the presentation and the pictures)
      seek(sec) {
        st.tau = ((+sec || 0) % TL.total + TL.total) % TL.total;
        poseAt(st.tau, np);
        pose.x = np.x;
        pose.z = np.z;
        pose.alpha = np.alpha;
        pose.flow = np.flow;
        st.dirty = true;
      },
      get running() { return st.running; },
      get home() { return !st.running && !st.homing && Math.abs(pose.x - HX) < 1e-9 && Math.abs(pose.z - HZ) < 1e-9; },
      path: WP,
      duration: TL.total,
      // 1.0.1-L (L.40 / L.64): where the base stops and when its water runs (seconds from the start of a round) - e.g. for the
      // presentation: seek(pourAt[0] - 2) shows the rinsing without waiting for the drive, seek(washAt[0] - 2) the priests' washing
      station: STOP.slice(),
      pourAt: TL.pour.slice(),
      washStation: WASH.slice(),
      washAt: TL.wash.slice()
    };
    const explode = {
      // set(on[, instant]): animate (1.1 s) the laver and the כן up out of the base or back; instant = jump to the end state
      set(on, instant) {
        st.exTarget = on ? 1 : 0;
        if (instant) {
          st.ex = st.exTarget;
          st.dirty = true;
        }
      },
      get on() { return st.exTarget === 1; }
    };
    // --- 1.0.2 (item 9; the user: "לא רואים את כל פעולת המכונה מקרוב, רק כשמתרחקים מאוד"): the FOLLOW VIEW of the demonstration.
    // While the demonstration runs from its pill, the camera follows the moving base about 20 amot away (16.4 and 18.4 at the two stops, so that
    // the water is seen running and the stop's label with it - 1.0.2 (M), below), from a side that neither the altar nor the ulam hides; the old route view (flyPoints.mechonaDemo, 72
    // high) is kept for whoever uses it. All of it is a model choice of the view, no source. The sides, measured on the route (x 34.5
    // from z 33 to -46, then east to the stop x 43, z -46; the altar x 39.5..59.5, z +-10, its top F + 10.5 with the lip (1.0.2 add-on:
    // its yesod, 1 high, out to x 37.5 and z +-12 on the west, north and south, and the wall under the sovev out to x 38.5, up to F + 6); the ramp x
    // 41.5..57.5, z 10..42; the ulam's face x 18.5 and its steps to x 24.5; the slaughter place's rings z -20..-40, tables x 46.5..52.5,
    // z -44.25..-48.75, 1.5 high, pillars z -50 / -57 - 40-altar.js, 30-courts.js):
    //   - the azimuth `az` of the camera round the base, in degrees: 0 = from the north (-z), 90 = from the east (+x), 180 = from the south;
    //   - home, the wash and the north leg along the altar: from the north-north-east, az 12 (18 at the wash stop): the camera stays in
    //     the free strip west of the altar's west face (x <= 38.5; above the yesod, which reaches x 37.5 but is only 1 high) and of the ramp, ahead of the base; from the east the altar or the
    //     ramp would stand between, from the west the east tap (VSL_TAP_R) and its water are behind the base's own body;
    //   - past the altar's north face (the base at z -8 .. -30) it swings round the EAST side (never the west: there the ulam's north wing
    //     reaches z -42) over the rings, which are low, to az 110, and on the way to the marble tables to az 160: from the south-south-east,
    //     between the base's east face and the tables, where the water falls (x 45.12), the tables beyond it;
    //   - coming back it swings the same way to az 12 again, behind the base, while the base is still north of z -20 (so that the altar's
    //     west edge never comes between), and follows it home: the round ends where it began, and the camera stays there.
    // Time-based: the view follows the base's pose with an exponential lag of FOL_LAG seconds (position, aim, distance and azimuth), so a
    // slow frame never makes it jump. A drag, a pinch or a wheel on the canvas, or any other move of the camera (the nav buttons, the
    // keys, a flight from the panel), ends the follow until the pill switches the demonstration on again; the camera then stays where it
    // is. The pill's "עצור" stays reachable: the camera is within 23 amot of it (maxDist 190 while it runs) and the pill stays inside the
    // view (by projection at most 0.6 of the half-height, measured over the round) ---
    // 1.0.2 (M; 1.0.2 left it open: "בהדגמה מקרוב תוויות התחנות ... נחתכות בשולי התמונה"): at the two stops the labels WASH_TEXT and PURPOSE_TEXT (above, west of each
    // stop, 13 and 12.2 amot long at their nearest scale, 70-ui.js) were cut by the frame's edge - at 13.5 amot the frame is about 19 wide, the wash label stood 31
    // degrees off the aim and the purpose label 52 (beside the camera). The near view now aims FOL_NEAR.lab of the way from the base toward its stop's label and stands
    // a little further (FOL_NEAR.rWash / rPour instead of 13): the base, the water, the pills and the whole label are in the frame, measured by projection with a margin
    // at 16 : 10 and wider (about 4 % of the half-width at the narrowest point; at 4 : 3 just inside). The azimuths, the heights and the labels are unchanged. Model choice.
    const FOL_LAG = 0.35;                           // seconds (model choice)
    const FOL_FAR = { r: 26, h: 17, ty: 3.5 };      // 1.2.0 (the user: "מזווית שונה וממרחק קצת יותר"): farther and higher (was 18 / 12)
    const FOL_NEAR = { h: 12, ty: 4.3, rWash: 22, rPour: 24, lab: 0.7 };   // 1.2.0: at the stops too (was 8 / 16 / 18)
    const FOL_LABW = [WASH[0] - 7.5, WASH[1] - 1.5], FOL_LABP = [STOP[0] - 7.5, STOP[1] + 8];   // 1.0.2 (M): x / z of the two labels, as they are pushed above
    const FOL_AZ = { route: 38, wash: 44, corner: 118, pour: 160 };   // 1.2.0: a three-quarter view on the way (was 12 / 18 / 110)
    const D2R = Math.PI / 180;
    // the view for a moment of the round: the base at (x, z); out = {tx, ty, tz, az (radians), r, h}
    const folNear = (tau, w) => smooth(Math.min((tau - (w[0] - 1.6)) / 1.6, (w[1] + 1.2 - tau) / 1.2));   // in 1.6 s before the water, out 1.2 s after it
    const folView = (tau, x, z, out) => {          // (runs every frame: no allocation)
      const nW = folNear(tau, TL.wash), nP = folNear(tau, TL.pour), n = Math.max(nW, nP);
      let az;
      if (z <= STOP[1] + 0.01) az = FOL_AZ.corner + (FOL_AZ.pour - FOL_AZ.corner) * smooth((x - HX) / (STOP[0] - HX));   // the leg to the tables and back
      else if (tau < TL.pour[0]) az = FOL_AZ.route + (FOL_AZ.corner - FOL_AZ.route) * smooth((-8 - z) / 22);      // going: swings at z -8 .. -30
      else az = FOL_AZ.corner - (FOL_AZ.corner - FOL_AZ.route) * smooth((z - STOP[1]) / 26);                       // coming back: at z -46 .. -20
      az += (FOL_AZ.wash - FOL_AZ.route) * nW;
      out.az = az * D2R;
      out.r = FOL_FAR.r + ((nW >= nP ? FOL_NEAR.rWash : FOL_NEAR.rPour) - FOL_FAR.r) * n;   // 1.0.2 (M): was 13 at both
      out.h = F + FOL_FAR.h + (FOL_NEAR.h - FOL_FAR.h) * n;
      out.ty = F + FOL_FAR.ty + (FOL_NEAR.ty - FOL_FAR.ty) * n;
      out.tx = x + 1.0 * n;                          // at a stop the aim moves 1 east, toward the tap's side
      out.tz = z;
      // 1.0.2 (M): and then toward the stop's label, so that the whole of it is in the frame with the base
      const lab = nW >= nP ? FOL_LABW : FOL_LABP, kl = n * FOL_NEAR.lab;
      out.tx += (lab[0] - out.tx) * kl;
      out.tz += (lab[1] - out.tz) * kl;
      return out;
    };
    const folPos = (v, p) => {                      // the camera's place of a view, into the array p
      p[0] = v.tx + v.r * Math.sin(v.az);
      p[1] = v.h;
      p[2] = v.tz - v.r * Math.cos(v.az);
      return p;
    };
    const fo = { on: false, wait: 0, cur: { tx: 0, ty: 0, tz: 0, az: 0, r: 0, h: 0 }, want: { tx: 0, ty: 0, tz: 0, az: 0, r: 0, h: 0 },
      p: [0, 0, 0], set: [0, 0, 0, 0, 0, 0], last: null, el: null, downs: new Map() };
    const folCam = () => (ctx.camera && ctx.controls && ctx.controls.target ? ctx.camera : null);
    const folPut = () => {                          // the camera at fo.cur, and what was set, to see whether anyone else moves it
      const cam = folCam();
      if (!cam) return;
      folPos(fo.cur, fo.p);
      cam.position.set(fo.p[0], fo.p[1], fo.p[2]);
      ctx.controls.target.set(fo.cur.tx, fo.cur.ty, fo.cur.tz);
      cam.lookAt(ctx.controls.target);              // as OrbitControls' update does: this frame is drawn already aimed
      const s = fo.set;
      s[0] = fo.p[0]; s[1] = fo.p[1]; s[2] = fo.p[2]; s[3] = fo.cur.tx; s[4] = fo.cur.ty; s[5] = fo.cur.tz;
    };
    const folMoved = () => {                        // has anything but the follow moved the camera since the last frame?
      const cam = folCam(), q = ctx.controls.target, s = fo.set, E = 0.02;
      return Math.abs(cam.position.x - s[0]) > E || Math.abs(cam.position.y - s[1]) > E || Math.abs(cam.position.z - s[2]) > E ||
        Math.abs(q.x - s[3]) > E || Math.abs(q.y - s[4]) > E || Math.abs(q.z - s[5]) > E;
    };
    const folListen = () => {                       // once: the canvas's drag, pinch and wheel end the follow (passive: OrbitControls untouched)
      if (fo.el || !ctx.renderer || !ctx.renderer.domElement) return;
      const el = (fo.el = ctx.renderer.domElement);
      el.addEventListener("pointerdown", (e) => {
        if (!fo.on) return;
        fo.downs.set(e.pointerId, [e.clientX, e.clientY]);
        if (fo.downs.size > 1) follow.stop();       // a second finger: a pinch
      }, { passive: true });
      el.addEventListener("pointermove", (e) => {
        const d = fo.downs.get(e.pointerId);
        if (d && fo.on && Math.hypot(e.clientX - d[0], e.clientY - d[1]) > 4) follow.stop();   // a drag (a plain click on a label does not end it)
      }, { passive: true });
      const up = (e) => fo.downs.delete(e.pointerId);
      window.addEventListener("pointerup", up, { passive: true });
      window.addEventListener("pointercancel", up, { passive: true });
      el.addEventListener("wheel", () => { if (fo.on) follow.stop(); }, { passive: true });
    };
    const follow = {
      // start(): fly to the view of the base's present moment (the UI's flight, 1.6 s), then follow it
      start() {
        folListen();
        const cam = folCam();
        if (!cam) return false;
        folView(st.tau, pose.x, pose.z, fo.want);
        Object.assign(fo.cur, fo.want);
        folPos(fo.cur, fo.p);
        const fly = ctx.ui && typeof ctx.ui.fly === "function" ? ctx.ui.fly : typeof ctx.flyTo === "function" ? ctx.flyTo : null;
        if (fly) {
          fly(fo.p.slice(), [fo.cur.tx, fo.cur.ty, fo.cur.tz]);
          fo.wait = performance.now() + 1700;       // the flight's 1600 ms (90-entry.js flyTo) and a frame
        } else fo.wait = 0;
        fo.downs.clear();
        fo.on = true;
        fo.last = null;
        return true;
      },
      stop() { fo.on = false; fo.wait = 0; },
      // snap(): the camera at once in the view of the present moment (for the pictures and the checks)
      snap() {
        if (!folCam()) return false;
        folListen();
        folView(st.tau, pose.x, pose.z, fo.cur);
        folPut();
        fo.on = true;
        fo.wait = 0;
        fo.last = null;
        return true;
      },
      get on() { return fo.on; },
      // view(tau): {pos, target} of the follow view at a moment of the round (no lag) - for the checks
      view(tau) {
        const P = poseAt(((+tau || 0) % TL.total + TL.total) % TL.total, { x: 0, z: 0, alpha: 0, flow: 0 });
        const v = folView(((+tau || 0) % TL.total + TL.total) % TL.total, P.x, P.z, {});
        return { pos: folPos(v, [0, 0, 0]), target: [v.tx, v.ty, v.tz] };
      }
    };
    ctx.animated.push((t) => {
      const now = typeof t === "number" && isFinite(t) ? t : performance.now();
      const dt = fo.last == null ? 0 : Math.min(0.25, Math.max(0, (now - fo.last) / 1000));
      fo.last = now;
      if (!fo.on) return;
      if (!st.running || !folCam()) { fo.on = false; return; }   // the demonstration ended: the camera stays where it is
      if (fo.wait) {
        if (now < fo.wait) return;                 // the flight is still on (the frame's own time: the flight ended in this frame's first step)
        fo.wait = 0;
        // the flight did not end in the view (a flight elsewhere took over): no follow
        const s = fo.set;
        s[0] = fo.p[0]; s[1] = fo.p[1]; s[2] = fo.p[2]; s[3] = fo.cur.tx; s[4] = fo.cur.ty; s[5] = fo.cur.tz;
        if (folMoved()) { fo.on = false; return; }
      } else if (!ctx.controls.autoRotate && folMoved()) { fo.on = false; return; }   // someone else moved the camera ("סיבוב איטי" is overridden)
      folView(st.tau, pose.x, pose.z, fo.want);
      const k = dt > 0 ? 1 - Math.exp(-dt / FOL_LAG) : 0, c = fo.cur, w = fo.want;
      c.tx += (w.tx - c.tx) * k; c.ty += (w.ty - c.ty) * k; c.tz += (w.tz - c.tz) * k;
      c.az += (w.az - c.az) * k; c.r += (w.r - c.r) * k; c.h += (w.h - c.h) * k;
      folPut();
    });

    ctx.shared.mechona = { demo, explode, follow, partLabels, group: mg, home: [HX, HZ], poseAt: (tau) => poseAt(tau, { x: 0, z: 0, alpha: 0, flow: 0 }), timeline: TL,
      purposeLabel: PURPOSE_TEXT, washLabel: WASH_TEXT, block: { cols: L.cols.slice(), rows: L.rows.slice(), laver: [L.laver.x, L.laver.z] } };

    // --- on-model buttons (contract 0.5b), above the moving base; they follow it and the raised laver ---
    const top = () => F + 7 + 2.5 * smooth(st.ex);
    // 1.0.1-K review (vessels-1): 70-ui.js calls anchor() every frame for every pill - one preallocated array per pill, filled in place
    // (the UI reads it at once: place() and occluded())
    const ancDemo = [0, 0, 0], ancEx = [0, 0, 0];
    const anchorAt = (a, dy) => {
      a[0] = pose.x;
      a[1] = top() + dy;
      a[2] = pose.z;
      return a;
    };
    ctx.shared.modelButtons = ctx.shared.modelButtons || [];
    ctx.shared.modelButtons.push({
      // 1.0.1-L (L.40 / L.64): the pill says what the base is for, and its title quotes the sources (see the demonstration above)
      id: "mechonaDemo", label: "הבא את הכיור לקידוש ידים ורגלים ולהדחת העולה", labelOn: "עצור את המכונה",
      // 1.0.1-K review (vessels-4): the ידות are the axles for Rashi and for בעל צורת הבית (see vsl_baseParts); the posts and the small
      // lying wheel are the book's drawing (p19L) - a model choice, said so here
      title: "תפקיד המכונה: מושב הכיור — 'המכונה היא מושב הכיור כמו שנאמר בכיור שעשה משה את הכיור ואת כנו' (רד״ק, מלכים א ז, כז). והכיורות — לשני דברים: קידוש ידים ורגלים של הכהנים — 'לרחצה בהם. קדוש ידים ורגלים' (רש״י, דברי הימים ב ד, ו), 'והכיורים היו לרחוץ מהם הכהנים ידיהם ורגליהם ולהדיח בהם מעשה העולה' (רד״ק ז, לט), וכן רלב״ג ואברבנאל — והדחת העולה: 'לרחצה בהם את מעשה העולה ידיחו בם' (דברי הימים ב ד, ו); רש״י שם: 'מן מימי הכיור ידיחו קרבי העולה'. והאופנים — 'כאלו ישאו אותה' (מצודת דוד ז, ל); 'אופן בתוך אופן, למען יוכל להוליכם אל אשר יהיה הרוח והרצון להוליכם, שמה יוליכם מבלי שיצטרך להפכם אנה ואנה' (בעל צורת הבית, אחרי רש״י ז, לז). בהדגמה המכונה יוצאת מן המכונות שבדרום הבית, עוצרת ליד הכבש — שם מקדשים הכהנים ידיהם ורגליהם בטרם יעלו למזבח: 'ורחצו אהרן ובניו ממנו את ידיהם ואת רגליהם... בגשתם אל המזבח לשרת' (שמות ל, יט–כ) — וממשיכה לבית המטבחים שבצפון המזבח, מקום שחיטת העולה — 'ושחט אתו על ירך המזבח צפנה' (ויקרא א, יא) — אל שלחנות השיש 'שעליהן מדיחין את הקרבים' (שקלים ו, ד), ושם יורדים מי הכיור מן הברז להדחת הקרבים והכרעים — 'וקרבו וכרעיו ירחץ במים' (ויקרא א, ט) — וחוזרת למקומה; גופה אינו מסתובב: בכל פינה הגלגל הקטן השוכב מסובב את הגדול לצדדים, והגדול הולך קדימה ואחור. הידות הן צירי האופנים (רש״י ז, לב: 'עץ התחוב באופנים... ציר של גלגל'); העמודים והגלגל הקטן השוכב הם ציור הספר ל'אופן בתוך האופן שתי וערב' (רש״י ז, לג). המקום, הדרך, המים והברזים (כציור הספר) — בחירת מודל.",
      // 1.0.1-L (L.67): the route's view stands far from the base, so "עצור" must show from there while it runs (the UI reads maxDist every frame)
      anchor: () => anchorAt(ancDemo, 1.9), get maxDist() { return st.running || st.homing ? 190 : 70; },
      get: () => st.running,
      // 1.0.1-L (L.67): the way is long now, so switching it on also turns the camera to the route's view, as the section's pill does (L.43).
      // 1.0.2 (item 9): it turns the camera to the follow view instead (follow, above); the route's view is the fallback without a camera
      set: (on) => {
        if (!on) { follow.stop(); demo.stop(); return; }   // the UI flies back to the view before the pill (70-ui.js revealPress)
        demo.start();
        if (follow.start()) return;
        const f = ctx.shared.flyPoints && ctx.shared.flyPoints.mechonaDemo;
        const fly = ctx.ui && typeof ctx.ui.fly === "function" ? ctx.ui.fly : typeof ctx.flyTo === "function" ? ctx.flyTo : null;
        if (f && fly) fly(f.pos, f.target);
      }
    }, {
      id: "mechonaExplode", label: "פרק: כיור, כן ומכונה", labelOn: "הרכב בחזרה",
      title: "פירוק המכונה לחלקיה: הכיור מונח בכן, והכן מונח במכונה — שולי הכן תחובים בפי הכותרת ובולט מעליו אמה (רש״י ז, לא), והכתפות תומכות מתחת לכן ולכיור (רש״י ז, ל). כמו באיור ב'מקרא מפורש'. לחיצה נוספת מרכיבה בחזרה.",
      anchor: () => anchorAt(ancEx, 0.8), maxDist: 70,
      get: () => st.exTarget === 1,
      // 1.0.1-K review (vessels-6): the seven part labels (layer "mechonaParts") come and go with the exploded view, through the UI's
      // setLayer when it is there (its rows stay in step). 1.0.1-L: 70-ui.js's own hook (explodeWas) only hides the part labels at the
      // moment the explode goes off, whoever turns it off; FIXES L.51 removes the panel places "פעולת המכונה" / "המכונה בפירוק", so
      // this pill and the one above are the way to run the base and to take it apart
      set: (on) => {
        explode.set(on);
        if (ctx.ui && typeof ctx.ui.setLayer === "function") ctx.ui.setLayer("mechonaParts", !!on);
        else if (ctx.layers && ctx.layers.mechonaParts) ctx.layers.mechonaParts.visible = !!on;
      }
    });

    // 1.0.1-L (L.67): the block's label over its south row's middle, above the lavers (the laver's own label "כיור משה" stands lower in
    // the block's middle, vsl_buildKiyorMoshe)
    // 1.0.1-L (verifier): 17 above the floor (was 10.5): on the court's default view it lay on the label "שער דרומי א"
    ctx.labels.push({ text: "המכונות והכיורות", x: L.laver.x, y: F + 17, z: L.rows[1], size: 2.5 });
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    // 1.0.1-L (L.67): the block as the book's picture p. לח sees it: from the north-east, high over the altar's ramp, the wing's east face
    // on the right, the ramp in front on the left, the court's south wall with its gates behind (model choice; headless ray test, FIXES
    // L.67). Was [70, 30, -40] -> [27, 10, -10]
    // 1.0.1-L (verifier): raised over the wing's roof, so that the whole circle of the turn buttons is free and every laver shows (from [50, 30, 14], 51 of 252 steps entered a solid)
    ctx.shared.flyPoints.mechonot = { pos: [50, F + 43, 16], target: [30, F + 1, 39] };
    // one base close up: the moving base from the north-north-east, its free side, ~12.3 amot away, the eye 8 above the court floor (the
    // two pills above the laver, F + 7.8 and F + 8.9, and the wheels stay inside the view, by projection +0.76 / -0.86 of the half-height)
    ctx.shared.flyPoints.mechonaClose = { pos: [HX + CAM[0], F + 8, HZ + CAM[1]], target: [HX, F + 4.3, HZ] };   // CAM: see the part labels. 1.0.1-L (verifier): target 0.5 lower, the near wheel stood at the frame's edge
    // the same base taken apart, with its parts' labels (LAB): from the north, 14 amot away, aimed 1.2 toward the screen's left so that
    // the raised laver (to 9.5) fits and the labels have room (by projection +0.69 / -0.88 of the half-height, and in a picture)
    ctx.shared.flyPoints.mechonaParts = { pos: [HX + LAB[0], F + 9.5, HZ + LAB[1]], target: [HX + 1.2 * LF[0], F + 5.2, HZ + 1.2 * LF[1]] };
    // the demonstration's route from the east, steep (1.0.1-L, L.67: the route runs 77 amot north-south along x 34.5, past the altar's west
    // side): the route across the frame, the block at home on the left, the stop by the ramp, the stop by the marble tables on the right, the
    // altar in front; 65 degrees down, so that the rays to the route pass over the altar's west edge (from the first candidates, from the
    // north-east, the altar hid the stop by the ramp); above the court walls and the house (headless, FIXES L.67)
    ctx.shared.flyPoints.mechonaDemo = { pos: [66, F + 72, -3], target: [34, F + 2, -3] };
  }
  async function buildVessels(ctx) {
    const g = new Group();
    g.name = "vessels";
    ctx.root.add(g);
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    if (!Array.isArray(ctx.animated)) ctx.animated = [];
    try {
      vsl_buildSea(ctx, g);
    } catch (e) {
      console.error("[vessels] sea", e);
    }
    try {
      vsl_buildKiyorMoshe(ctx, g);
    } catch (e) {
      console.error("[vessels] Moses' laver", e);
    }
    try {
      vsl_buildMechonot(ctx, g);
    } catch (e) {
      console.error("[vessels] bases", e);
    }
    // safety net: the UI expects ctx.shared.seaPlacement even if the Sea failed to build
    if (!ctx.shared.seaPlacement) {
      const L = vsl_layout(ctx.CO, ctx.shared), F = ctx.LV.AZ;   // 1.0.1-L: the corner places and the views of vsl_buildSea
      ctx.shared.seaPlacement = {
        rashi: { x: L.rashi.x, z: L.rashi.z }, radak: { x: L.radak.x, z: L.radak.z }, current: "rashi",
        set(key) { if (key === "rashi" || key === "radak") this.current = key; return this.current; },
        flyPoint() { const p = this[this.current], sg = p.z < 0 ? 1 : -1; return { pos: [p.x - 18, F + 30, p.z + sg * 20], target: [p.x - 1, F + 3, p.z + sg] }; },
        oxenFlyPoint() { return this.flyPoint(); }
      };
      ctx.shared.flyPoints.yam = ctx.shared.seaPlacement.flyPoint();
    }
  }
