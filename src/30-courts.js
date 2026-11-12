  // ===== 30-courts.js: the inner court (החצר הפנימית = חצר הכהנים ועזרת ישראל per Rashi on I Kings 6:36; built as ONE court, no split) =====
  // Builds: the podium 197 x 6 x 145, the floor at LV.AZ (1.0.1-K: marble inside the walls - I Chr 29:2 with Rashi - and stone paving
  // under and outside them), the court wall in bands of 3 stone courses + 1 cedar course,
  // 7 gates with flat stone lintels and bronze doors, and the steps up to the gates; לשכת הגזית astride the north wall and בית המטבחים north of the altar (1.0.1-L, below).
  // 1.0.1-L (the user's answers A5-A9): ctx.shared.slaughterLayout (book / meiri / oneRow), the pillars 4 high with hooks 1.7 / 2.6 / 3.5, לשכת הגזית lengthened to x 71.8; see CRT_GAZIT and CRT_SLAUGHTER.
  // Sources used in this file:
  //   I Kings 6:36  "ויבן את החצר הפנימית שלשה טורי גזית וטור כרתת ארזים";  I Kings 7:12 "ולחצר בית ה' הפנימית" (the same pattern, as a parallel)
  //   Rashi on I Kings 6:36 [308]  "וטור כרתת ארזים. נדבך של קירות (מחטבות) עשה בחומה";  and there: "וקורא אותה פנימית, לפי שהיתה לפנים מעזרת נשים"
  //   Metzudat David on I Kings 6:36 [509]  "שלשה שורות זה על גב זה, בנה באבני גזית, ועליהם שורה הרביעית, בנה מארזים... וכסדר הזה בנה אותו עד כלות גבהי הכתלים"
  //     (the explicit source for repeating the 3 + 1 band up to the crest);  Rashi on I Kings 7:12 "החומה עשויה שלשה נדבכין של אבנים, ונדבך של עץ עליהם"
  //   II Chr 4:9  "ויעש חצר הכהנים והעזרה הגדולה ודלתות לעזרה ודלתותיהם צפה נחשת";  Rashi there [141]: "והעזרה הגדולה. זו עזרת ישראל" (so the
  //     bronze doors are THIS court's; the outer court in 20-mount.js repeats them by analogy)
  //   Middot 5:1  (187 x 135 - user decision "כמדות");  Middot 1:4  (seven gates: 3 north, 3 south, 1 east - convention accepted by the user)
  //   Middot 2:3  (gate openings 20 x 10 with a flat lintel; steps 0.5 / 0.5 - applied as a convention)
  // The gate names are not in the First Temple sources; they are labelled by side and letter. No דוכן, no court split.
  // 1.0.1-K (FIXES K.6.5, Yossi's request): ONE chamber - לשכת הגזית, straddling the court wall (section at the end of buildCourts).
  //   Yoma 25a "לשכת הגזית כמין בסילקי גדולה היתה, פייס במזרחה, וזקן יושב במערבה"; Abaye there: "שמע מינה לשכת הגזית חציה בקדש
  //   וחציה בחול, ושמע מינה שני פתחים היו לה, אחד פתוח בקדש, ואחד פתוח בחול"; Rashi there "בסילקי - בית גבוה שעל עלייה"; Bartenura on
  //   Middot 5:4: the Sanhedrin sat "בצד החל שבה... שאין ישיבה בעזרה אלא למלכי בית דוד בלבד"; Mishnah Tamid 2:5 / 4:3 "וירדו ובאו להם
  //   ללשכת הגזית" (to recite the Shema); Mishnah Sanhedrin 1:6 "סנהדרי גדולה היתה של שבעים ואחד"; 4:3 "סנהדרין היתה כחצי גרן עגלה,
  //   כדי שיהו רואין זה את זה". 1.0.1-K stood it on the SOUTH wall after the printed Mishnah Middot 5:4 "שבדרום, לשכת העץ, לשכת הגולה,
  //   לשכת הגזית... לשכת הגזית, שם היתה סנהדרי גדולה של ישראל יושבת ודנה את הכהנה".
  // 1.0.1-L (FIXES L.21; the user decided "רמבם" / "לאורך" / "הבא את שיטת התוספות יו"ט והמכילתא" / "גם בבית ראשון"): the chamber now
  //   stands on the NORTH wall - Yoma 19a "שלש שבצפון: לשכת העץ, לשכת הגולה, לשכת הגזית" (Rav Pappa's proof there needs this reading);
  //   Rambam Beit HaBechira 5:17 "והשלש שבצפון לשכת הגזית. לשכת הגולה. לשכת העץ. לשכת הגזית שבה סנהדרי גדולה יושבת. וחציה היה קדש
  //   וחציה היה חל. ולה שני פתחים אחד לקדש ואחד לחל ובחצי של חל היו הסנהדרין יושבין"; Tosafot Yom Tov on Middot 5:3 "ונראה בעיני
  //   שגירסת הספר נשתבשה". On the EAST part of the north wall, opposite the altar: Tosafot Yom Tov's drawing "שבצפון סמוכה למזרח לשכת
  //   הגזית"; the Mechilta (Bachodesh 11) "נמצינו למדין שסנהדרין בצד מזבח"; Tosafot Rid on Yoma 25a "סמוכה למזבח ופתוחה למזבח".
  //   LENGTHWISE ("לאורך"): its long side along the wall and the line of the court wall along its length, half in the court and half
  //   outside - Tiferet Yisrael (צורת בית המקדש) "בנויה חציה בדרום בקודש וחציה בצפון בחול". The doors after Chok Natan on Middot 5:4
  //   "שהפתח הפתוח לחול היה פתוח לצד צפון סמוך למערב והפתח הפתוח לקדש היה פתוח לצד דרום סמוך למזרח", so that Yoma 25a "פייס
  //   במזרחה, וזקן יושב במערבה" holds (Rashi there: "פייס במזרחה - קבוצת היקף המפייסין במזרחה היתה"; "וזקן - של ב"ד המורה להן סדר
  //   הפייסין יושב במערבה"; the Rambam on the Mishnah, Middot 5:1: "ושחציה של חול הוא לצד מערב ובאותה המחצה יכולין לשבת"); steps down
  //   from the profane door: Tosafot Yom Tov on Middot 5:4 "היו מעלות שעליה עולין וממנה יורדין לחול"; the seats face south: Tiferet
  //   Yisrael "פניהם לדרום ואחוריהן לצפון". In the First Temple too (the user: "גם בבית ראשון"): Rashi on II Chr 34:22 "כי לשכה אחת
  //   היתה לה לחולדה, סמוכה ללשכת הגזית"; Maharsha on Bava Batra 91b "כי במלכותו נתמנה סנהדרי גדולה לישב בלשכת הגזית". Every
  //   place-source above describes the Second Temple and none gives a measure: the place along the wall and every measure are model choices
  //   (23.8 x 19 at x 48..71.8, z -77..-58 - 1.0.1-L, A9; between the eastern north gate and the Sea - the numbers at CRT_GAZIT; the printed Mishnah Middot
  //   5:4 "שבדרום" is noted in the UI's texts, not followed). The book's plan of the courts (p02-p03, "לשיטת רש״י") draws the chamber in this
  //   very place: "לשכת" | "הגזית" across the fold of the two pages, astride the north wall, its long side along the wall, just west of the
  //   Sea in the corner; and "לשכת המלח", "לשכת הפרוה", "לשכת המדיחין" on the south wall, as Yoma 19a.
  // 1.0.1-L (FIXES L.68; the user, 31.10.2026, on the Sea in the north-east corner: "מול השולחנות והטבעות שבבית שני (אגב למה לא
  //   הוספת אותם גם בבית ראשון? - תוסיף)"): the slaughter place (בית המטבחים) of the Second Temple stands north of the altar as a
  //   model choice for the First Temple (section after לשכת הגזית; the numbers at CRT_SLAUGHTER). Sources (every quote checked in the
  //   Otzaria DB): Middot 3:5 "וטבעות היו לצפונו של מזבח, ששה סדרים של ארבע ארבע, ויש אומרים, ארבעה של שש שש, שעליהן שוחטין את
  //   הקדשים. בית המטבחים היה לצפונו של מזבח, ועליו שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם,
  //   ושלשה סדרים היו לכל אחד ואחד, שבהם תולין. ומפשיטין על שלחנות של שיש שבין העמודים" (so too Tamid 3:5); Middot 5:2 "מן המזבח
  //   לטבעות שמנה אמות, מקום הטבעות עשרים וארבע, מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע. מן הננסין לכתל העזרה שמנה
  //   אמות, והמותר בין הכבש לכתל ומקום הננסין" (so too Yoma 16b; the Rambam, Beit HaBechira 5:13-15: "מכתל צפוני עד בית המטבחים
  //   שמונה אמות. בית המטבחים י"ב אמות ומחצה. ושם תולין ומפשיטין את הקדשים בצדו", "מקום השלחנות שמונה אמות ובו שלחנות של שיש
  //   שמניחין עליהן הנתחים ומדיחין את הבשר לבשלו. ושמונה שלחנות היו. ובצד מקום השלחנות מקום הטבעות כ"ד אמה. ושם שוחטין את
  //   הקדשים", "ובין מקום הטבעות והמזבח שמונה אמות"); Shekalim 6:4 "שלשה עשר שלחנות היו במקדש, שמונה של שיש בבית המטבחים,
  //   שעליהן מדיחין את הקרבים"; Tamid 4:1 "וכך היתה עקדתו, ראשו לדרום ופניו למערב. השוחט, עומד במזרח ופניו למערב. של שחר היה
  //   נשחט על קרן צפונית מערבית, על טבעת שניה. של בין הערבים היה נשחט על קרן מזרחית צפונית, על טבעת שניה" (so too Yoma 62b; Rashi
  //   there: "לא בטבעת שאצל המזבח אלא בשניה לה המשוכה לצד צפון"); Rashi on Yoma 16b: "מן המזבח ולטבעות - קבועים בקרקע בבית המטבחים
  //   שבצפון המזבח שנותנים בהן צוארי בהמות כששוחטין קדשי קדשים ששחיטתן בצפון", "ננסין - עמודים נמוכין התקועין בקרקע ואונקלאות של
  //   ברזל קבועין בהן שבהן תולין את הבהמה להפשיט", "שלחנות - שעליהן מדיחים קרבי קדשים", and the eight tables "נתונות ד' בראש ארבע
  //   נמצאו ד' זו אצל זו ברוחב", "ומקום ד' שולחנות זו אצל זו אינו פחות מד'" (he counts those four in the court's width, north to south: two lines of
  //   four running north-south - so the book's plan p02 draws them); Lev 1:11 "ושחט אתו על ירך המזבח צפנה" (Rashi:
  //   "על ירך המזבח. על צד המזבח"); Yoma 36a "איזהו צפון — מקיר של מזבח צפוני ועד כותל העזרה, וכנגד כל המזבח כולו צפון, דברי רבי
  //   יוסי ברבי יהודה"; Sotah 48a (Yochanan the high priest) "עמד והתקין להם טבעות בקרקע", Rashi there "טבעות - להכניס צואר בהמה
  //   לתוכו"; Bartenura on Middot 3:5: "והיו קבועות ברצפה עשויות כמין קשת שהיו מכניסים בהן צואר בהמה בשעת שחיטה ונועצים ראש הטבעת
  //   בארץ", "עמודים של אבן נמוכין", "חתיכות מרבעות של ארז היו על העמודים", "כעין מזלגות", "של אנקליות זו למעלה מזו היו בכל חתיכת
  //   עץ, לתלות בהמה גדולה או קטנה", "לפי שהשיש מקרר ומצנן ושומר הבשר שלא יסריח"; Tosafot Yom Tov there (the Ra'avyah): "הצדדין
  //   קבועים האונקליות למזרח. לצפון ולדרום אבל לא לצד מערב שלא יהפכו המפשיטים אחוריהן לקדש הקדשים"; Tiferet Yisrael (Yachin 3:5):
  //   "עמודי אבן שנמוכין כננסין, הרבה פחות מקומת איש המפשיט", "חתיכות מרובעות של ארז כבדין מונחין על העמודין, אבל לא היו מחוברין
  //   בהעמודים"; his צורת בית המקדש: "נמצא היה בין טבעת לטבעת מצפון לדרום ד' אמות בקרוב", "שמונה עמודים ננסין עומדים בצפון המזבח בד׳
  //   שורות מצפון לדרום, וכל שורה של ב’ ב'. ורחוקים מחומת צפון של עזרה ח' אמות", "עמדו ח׳ שולחנות של שיש, בב׳ שורות מצפון לדרום. וכל שורה של
  //   ד’ ד’"; the book's plan of the courts (p02-p03, across the fold, "לשיטת רש״י"): the tables and the two rows of pillars just so. All these describe the Second Temple (the
  //   rings are Yochanan the high priest's); for the First Temple the sources give only the north side of the altar (Lev 1:11) - the
  //   whole place is a model choice by the user's word, and every measure not in Middot 5:2 is marked at CRT_SLAUGHTER.
  //   1.0.1-L (the verifier of this file): the tables in two lines running north-south and the pillars in two rows of four (they were two rows
  //   east-west and one row of eight), as Rashi on Yoma 16b, Tiferet Yisrael and the book's plan have them; the labels and the fly points re-placed for that.
  // Uses mnt_bandWall / mnt_gatePortal from 20-mount.js (same IIFE).
  var CRT_WALL_T = 5;       // model choice: wall thickness 5 (as the great court wall; no measure in the sources)
  var CRT_WALL_H = 20;      // model choice: same height as the great court wall (5 bands of 3 stone + 1 cedar, y 6..26), so the 20-high gate lintels cap the crest; was 16, changed after review
  var CRT_GATE_W = 10;      // model choice: openings 10 wide x 20 high with a flat stone lintel (Middot 2:3 as a convention)
  var CRT_GATE_H = 20;
  var CRT_LEDGE = 2.5;      // model choice: the podium reaches 2.5 beyond the wall's outer face (197 x 145 around the 187 x 135 court)
  var CRT_NS_GATES = [-40, 0, 40]; // model choice: the three north and three south gates centred at x = -40, 0, 40 (as the 1.0.19 model)
  // לשכת הגזית (1.0.1-L, FIXES L.21; all model choice - the sources are in the header, and none gives a measure): 22 (x) x 19 (z), its
  // long side along the NORTH wall ("לאורך"), straddling the wall's centre line (z -67.5) - 9.5 in the court (z -67.5..-58) and 9.5
  // outside (z -77..-67.5); x 48..70 on the wall's east part, opposite the altar (x 39.5..59.5): 1.2 clear of the eastern north gate's
  // portal (x 33.2..46.8; its stair x 34..46) and 2.83 clear of the Sea's oxen in the north-east corner (45-vessels.js vsl_layout: the
  // muzzles reach 7.17 from the Sea's axis x 80, z -54, i.e. x 72.83; a chamber nearer than 1 amah to them would push the Sea deeper into
  // its corner); hewn-stone walls 1.5 thick, 22 high (as 1.0.1-K). The holy door (into the court) in the south wall near its east end,
  // centred at x 65.5; the profane door in the north wall near its west end, x 52 (Chok Natan). The length follows FIXES L.21 "about
  // 22-25 amot along the wall" (an earlier round-L attempt had 20 x 17 at x 48..68, too small for the seats); the depth is what the half
  // circle of seats needs. 1.0.1-K: 30 x 35 on the south wall at x 59..89, z 50..85.
  // 1.0.1-L (A9, the user: "תאריך"): lengthened eastward from x 70 to x 71.8, 1.03 from the oxen's muzzles (x 72.83): vsl_layout's 1 amah holds and the Sea
  // does not move. So now 23.8 along the wall; the holy door (centred x 67.3) and the lots' ring (x 66.3) moved east with the wall, the same 0.5 and
  // 2.2 from its inner face; the seats keep their place from the west wall, the lantern re-centred on x 59.9. The numbers in the lines above are the earlier 22.
  // 1.3.5 (the user, of the kuntres, point 12: "להגדיל את לשכת הגזית" - in both houses): 3 deeper to the north (z0 -77 -> -80), so the
  // unconsecrated half holds the one row of 71 (below). So now 23.8 x 22.
  var CRT_GAZIT = { x0: 48, x1: 71.8, z0: -80, z1: -58, T: 1.5, H: 22, doorIn: 67.3, doorOut: 52 };
  // the 71 seats (Sanhedrin 1:6) in a half circle round (x 58.25, the wall's centre line z -67.5), facing south: four rows (r = radius of
  // the seats' centres, n = seats, base = the step under the row; model choice: seats 0.8 wide, 1.0..1.06 amah apart - a person's seat -
  // so the half circle, 15.5 across and 7.75 deep, fits the outer half (inner faces x 49.5..68.5, z to -75.5) with a passage 1 wide along
  // the west wall from the profane door and 2.5 along the east wall); the lots' ring in the court half toward the east (x 64.5, z -62.25,
  // radius 1.8, before the holy door)
  // 1.3.5 (the user, of the kuntres, point 12; 21:30 "תקטין את הדיינים"): THE SEVENTY-ONE IN ONE ROW - Sanhedrin 4:3 "סנהדרין היתה כחצי גרן
  // עגלה, כדי שיהו רואין זה את זה"; Rashi 36b (book 2180, line 1777): "בעגולה היו יושבין כדי שיהו כולן רואין זה את זה, לפי שאם היו יושבין
  // בשורה אין פני הראשונים רואין זה את זה". Until 1.3.4 four rows (the lines above). Now one row on half an oval in the unconsecrated
  // half: centre (x, z), half axes a (along the wall) and b (to the north), n seats evenly along it - 0.41 apart, so the seats are
  // small (0.34 wide; a real row of 71 would need a radius of 22.6). A model choice.
  // GAZIT_MEIRI_137 - 1.3.7 (the user, 11.11.2026, 21:15, for the Second Temple's hall: "ב" - the Meiri; the standing word of 10.11:
  // "את השינויים בלשכת הגזית תעתיק גם לבית ראשון"): THE TWO HALVES ARE EAST AND WEST. Yoma 25a "פייס במזרחה, וזקן יושב במערבה"; the Meiri
  // there (the user's library, book 2199, line 228): "מתקבצים בחציה של קדש שהיה בצד מזרחה של לשכה… וזקן מזקני הסנהדרין יושב בחציה של
  // חול לצד מערבה של לשכה". So the 71 sit in the WEST half, on half an oval that opens to the EAST (toward the holy half - a model
  // choice: the Meiri does not say which way they face): centre (x, z), a = the half length from north to south, b = the depth to the
  // west. A way 2.3 wide is left between the row's north end and the north wall, from the unconsecrated door. Until 1.3.6 the oval lay
  // along the wall and opened to the south - the Tiferet Yisrael's reading ("בנויה חציה בדרום בקודש וחציה בצפון בחול… פניהם לדרום
  // ואחוריהן לצפון", book 6029, line 65), now told in the card's "בקצרה".
  var CRT_GAZIT_SEATS = { x: 59.6, z: -68.3, a: 7.9, b: 9.4, n: 71 };
  // 1.3.7: THE RING OF THE LOTS IS NO LONGER DRAWN (CRT_GAZIT_LOTS, x 66.3, z -62.25, r 1.8, since 1.0.1) - the user, 11.11.2026, 21:39,
  // after the search of his library found no source for the daily lots in the First Temple: "ברור שהיה רק בבית שני".
  // בית המטבחים (1.0.1-L, FIXES L.68; the sources are in the header - all Second Temple; the user's "תוסיף" makes it a model choice for
  // the First Temple). North of the altar (x 39.5..59.5, its north face z -10) and opposite it ("וכנגד כל המזבח כולו צפון"), at the
  // distances of Middot 5:2 measured from the altar's north face: 8 clear ("מן המזבח לטבעות שמנה אמות"), the rings' place 24 ("מקום
  // הטבעות עשרים וארבע": z -18..-42), 4 to the middle line of the tables and 4 from it to the first row of pillars ("מן הטבעות לשלחנות
  // ארבע, מן השלחנות ולננסין ארבע", read with the Kesef Mishneh on the Rambam 5:14 - to the middle of the tables' place: z -46 and -50),
  // and the last row of pillars 8 from the court wall's inner face z -65 ("מן הננסין לכתל העזרה שמנה אמות"; Tiferet Yisrael "ורחוקים
  // מחומת צפון של עזרה ח' אמות": z -57). "ומקום הננסין" is what is left between the two rows: 7 here, because this court has 55 from the
  // altar to the wall (its 20 x 20 altar centred on the axis) where the Second Temple's had 60.5 (Rambam 5:15), with 12.5 for the pillars
  // (Rambam 5:13; the book's plan p02 measures 8 / 12.5 / 8) - model choice. The south face of לשכת הגזית (z -58, x 48..70) stands inside the
  // last 8 amot, 1 from the last row, as in the book's plan, where the chamber's court half comes up to that row's eastern pillars.
  // The rings: six rows of four (Middot
  // 3:5's first opinion; "ארבעה של שש שש" is the same 6 x 4 grid counted the other way), 4 apart both ways (Tiferet Yisrael "ד' אמות
  // בקרוב"), rows z -20..-40, columns x 43.5..55.5 centred on the altar's axis (model choice); each a bronze arch 1.1 wide and 0.55 high
  // with its two feet in the floor (Bartenura "כמין קשת... ונועצים ראש הטבעת בארץ"; the size, for an ox's neck, a model choice; the
  // second ring of each outer column, z -24, is where the daily offering was slaughtered - Tamid 4:1, Rashi on Yoma 62b). The tables:
  // eight of marble (Shekalim 6:4) in two lines of four running north-south (Rashi on Yoma 16b "נתונות ד' בראש ארבע נמצאו ד' זו אצל זו
  // ברוחב", the court's width; Tiferet Yisrael "בב׳ שורות מצפון לדרום"; the book), under the two inner columns of pillars, x 47.5 / 51.5
  // (the book), each 2 (east-west) x 1 (north-south) and 1.5 high (model choice: the showbread table's measures, Ex 25:23 "אמתים ארכו
  // ואמה רחבו ואמה וחצי קמתו"; Rashi "אינו פחות מד'" for the four), 1.5 apart along the line, z -43.75..-48.25, the middle at z -46. The
  // pillars: eight of stone, 1 x 1 and (1.0.1-L, A7: 1.4 + cedar 2.6, hooks 1.7 / 2.6 / 3.5, the note below this comment; the 2, 3.5 and 3 / 4 / 5 here are the earlier) 2 high (Rashi "עמודים נמוכין"; Tiferet Yisrael "הרבה פחות מקומת איש המפשיט"; model choice), in two
  // rows of four (Tiferet Yisrael "בד׳ שורות מצפון לדרום, וכל שורה של ב’ ב'"; the book), z -50 and -57, in the rings' columns, 4 apart (the
  // book; model choice); on each a squared cedar post 0.8 x 0.8 x 3.5
  // ("רביעין של ארז על גביהן" - Bartenura "חתיכות מרבעות של ארז"; laid on, not joined - Tiferet Yisrael) carrying the iron hooks in
  // three rows one above the other (Bartenura "זו למעלה מזו"), 3 / 4 / 5 above the floor (model choice: a large or a small animal hangs
  // clear of the floor; R. Shemaya in צורת בית המקדש "שהנמוך לתלות בו כבש, והאמצעי לתלות בו איל, והגבוה לתלות בו פר"), on the east, north and
  // south faces and none on the west (the Ra'avyah in Tosafot Yom Tov, who reads the "שלשה סדרים" as those three sides; the model keeps both
  // readings: three rows on each of the three faces). 1.0.1-L: other layouts in the sources, not built: Tiferet Yisrael (Yachin, Middot 3:5)
  // "דלרש"י ותוס' (יומא דט"ז) עמדו שם בב' שורות של ד' ד' מצפון לדרום ולרמב"ם פ"ה מבחירה, עמדו שם בשורה א'" (the Rambam: eight tables in
  // one north-south line, "בסדר א' מצפון לדרום"); one east-west row of eight pillars - the Ra'avyah "אלא כל דממזרח למערב עמודים ח'. שלחנות
  // שמנה", the Gra on Middot 5:2 "כי שמונה ננסין היו. נמצא היו ז' אוירים וכנגד כל אויר היה שולחן".
  // 1.0.1-L (A5, A6, A7; the user: "כדאי", "תוסיף כשיטה", "יש לך מקור לגובה מסוים, אם לא תשווה"). A pass over the whole library found no number for the
  // pillars' height, so their height and hooks are those of the user's Second Temple plugin (ref-altar-bayit2.js: 4 high, hooks at 1.7, 2.6, 3.5). The hooks
  // are in the cedar, so here the stone is 1.4 and the cedar 2.6, 4 together (the earlier 2 + 3.5 and hooks 3 / 4 / 5 in the comment above are gone).
  // Three layouts, one switch, ctx.shared.slaughterLayout:
  //   "book"   as built, the book's: a squared cedar piece on each pillar (Bartenura "חתיכות מרבעות של ארז היו על העמודים");
  //   "meiri"  the Meiri on Middot "כעין קורות קצרות באים מעמוד לעמוד", hooks "בשני הצדדים ושטח התחתון": short cedar beams along the two rows, stone 3.4 + beam
  //            0.6 = 4 (the plugin's beams lie at 4), three hooks a span on the north side, the south side and the underside;
  //   "oneRow" the Ra'avyah in Tosafot Yom Tov on Middot 3:5 "אלא כל דממזרח למערב עמודים ח'. שלחנות שמנה", the Gra on Middot 5:2 "נמצא היו ז' אוירים וכנגד כל אויר
  //            היה שולחן הרי ז' שולחנות ושולחן הח' הי' עמוד אצל הננס שבקצה מבחוץ": eight pillars in one east-west row at z -50, 2.5 apart across the altar's width
  //            (model choice), a table in each of the seven gaps and the eighth beyond the east end ("מבחוץ"; which end is a model choice); 1 x 2 tables, their
  //            long side north-south (A8), to fit the 1.5 gaps.
  // 1.3.2: every x of the slaughter place follows the altar (CO.ALTAR_DX - it stands "opposite the whole altar", the numbers are the 1.3.1 ones)
  var CRT_DX = CO.ALTAR_DX || 0;
  var CRT_SLAUGHTER_ROW = { z: -50, cols: [40.75, 43.25, 45.75, 48.25, 50.75, 53.25, 55.75, 58.25].map((x) => x + CRT_DX), tableExtraX: 59.5 + CRT_DX, tableW: 1, tableD: 2 };
  var CRT_SLAUGHTER_BEAM = { pillarH: 3.4, beamH: 0.6, beamW: 0.6, hooksPerSpan: 3 };
  var CRT_SLAUGHTER = {
    x0: 39.5 + CRT_DX, x1: 59.5 + CRT_DX, ringsZ0: -18, ringsZ1: -42, tablesZ: -46,
    ringRows: [-20, -24, -28, -32, -36, -40], ringCols: [43.5, 47.5, 51.5, 55.5].map((x) => x + CRT_DX), ringR: 0.55, ringTube: 0.07,
    tableRows: [-43.75, -45.25, -46.75, -48.25], tableCols: [47.5, 51.5].map((x) => x + CRT_DX), tableW: 2, tableD: 1, tableH: 1.5,
    pillarRows: [-50, -57], pillarCols: [43.5, 47.5, 51.5, 55.5].map((x) => x + CRT_DX), pillarW: 1, pillarH: 1.4, postW: 0.8, postH: 2.6, hookY: [1.7, 2.6, 3.5]   // 1.0.1-L (A7): were 2, 3.5, [3, 4, 5]
  };

  // A wall with rectangular holes anywhere (the courts' own copy of the palace's helper, so this module does not depend on 60-palace.js):
  // axis "x" runs along x, axis "z" along z; holes [{c, b, w, h}] with c = the hole centre's offset along the wall (+x / +z), b = its
  // bottom above the wall bottom; x,z = the wall centre, y = its bottom. Registered as an occluder (fades when it hides the target).
  function crt_holedWall(H2, parent, mat, { axis = "x", length, height, thickness, cx, cz, y, holes = [] }) {
    const shape = new Shape();
    shape.moveTo(-length / 2, 0);
    shape.lineTo(length / 2, 0);
    shape.lineTo(length / 2, height);
    shape.lineTo(-length / 2, height);
    shape.closePath();
    for (const o of holes) {
      const lc = axis === "z" ? -o.c : o.c;   // after the +90 degree turn the shape's +x is world -z
      const p = new Path();
      p.moveTo(lc - o.w / 2, o.b);
      p.lineTo(lc + o.w / 2, o.b);
      p.lineTo(lc + o.w / 2, o.b + o.h);
      p.lineTo(lc - o.w / 2, o.b + o.h);
      p.closePath();
      shape.holes.push(p);
    }
    const geo = new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 1 });
    geo.translate(0, 0, -thickness / 2);
    const m = new Mesh(geo, mat);
    if (axis === "z") m.rotation.y = Math.PI / 2;
    m.position.set(cx, y, cz);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    H2.occ(m);
    return m;
  }

  // ===== PEOPLE_KIT_204 BEGIN - THE SANHEDRIN'S FIGURES (one text, the same in both houses' 30-courts.js; tools204/people_204.py).
  // The user, 12.11.2026 01:41: "תעשה סנהדרין בשתי הבתים, הגוף אותו גוף רק יושב, [כעין] שמלה שחורה כזאת וכיפה, זקן לבן לכולם, חוץ
  // מהשורה היותר חיצונית ... בעצם הזקנים הכי בפנים לבן, האמצעי אפור והעליון שחור חום"; 01:42: "אלו שמולם בלי זקן בכלל. אבל צורה
  // חרדית כזאת, אבל לא חרדית קלאסית. רק בנראות של הפרצוף." He was told (01:46): in the model the seventy-one sit in ONE row and
  // the three inner rows are the students (Sanhedrin 4:4), so the beards' colours go ALONG the judges' row by the nearness to the
  // Nasi - "ושאר השבעים יושבין לפניו כפי שניהם וכפי מעלתם" (the Rambam, Sanhedrin 1:3; qa/fs/LIB_1111.md) - white by him, grey
  // further, black-brown at the row's two ends; the students - no beard, a kippah and peyot; the two scribes stand, grey-bearded.
  // THE BODY is the lottery's priest's (the Second House's 55-payis.js, PAYIS_FIGURE4: the head, the face, the beard - one body -
  // and the robe's breadth at each height), sitting, in a black robe and a kippah, with far fewer faces: the figures are small
  // (seventy-one in one row in the hall) and many, so every part is one InstancedMesh, and from afar a plain figure stands in.
  // tm_people(ctx).crowd(parent, pts, o): pts [[x, z, yaw] ...] in the parent's frame (yaw 0: the face to +z); o = { y, s (the
  // scale: figure units to amot), pose "bench" | "ground" | "stand", seat (the bench's height, amot), kind "judge" | "student" |
  // "scribe", tone (i) => 0 white | 1 grey | 2 black-brown, big (the index of the one a little larger), fwd (amot forward, to the
  // bench's front edge), name, shadow }.
  // MODEL CHOICES: the figures' size, their faces, the robe, the scribes' tablets, the beards' colours and lengths.
  // PEOPLE_KIT_205 (12.11.2026 12:11, the user: "הכל נהיה איטי בטירוף"): measured against 2.0.3 - the 700 full figures were drawn
  // (and cast shadows) from 150 amot, under closed roofs too: +160,000 to +350,000 triangles in every view inside the courts.
  // Now THREE levels by the eye's distance from the crowd: full (within ~22 amot), plain (~300 triangles: the same robe, head, face,
  // beard and kippah - to ~120 amot), a peg beyond; no figure casts a shadow; the full figure itself has fewer faces.
  function tm_people(ctx) {
    if (ctx.__tmPeople) return ctx.__tmPeople;
    const TAU = Math.PI * 2;
    const rnd = (() => { let q = 20261113; return () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; }; })();   // a fixed sequence
    const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const spl = (tab, x) => {
      let i = 0;
      while (i < tab.length - 2 && x > tab[i + 1][0]) i++;
      const p0 = tab[Math.max(0, i - 1)], p1 = tab[i], p2 = tab[i + 1], p3 = tab[Math.min(tab.length - 1, i + 2)];
      const d = p2[0] - p1[0], t = Math.max(0, Math.min(1, (x - p1[0]) / d));
      const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * d, m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * d, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
    };
    // a surface P(u, v) - u goes round (`open`: a strip, not closed), v goes along - with uv, a shade per vertex (o.c) and smooth normals
    const surf = (nu, nv, fn, open) => {
      const pos = [], uv = [], col = [], idx = [], o = { x: 0, y: 0, z: 0, c: 1 };
      for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
        o.c = 1;
        fn(i === nu && !open ? 0 : i / nu, j / nv, o);
        pos.push(o.x, o.y, o.z);
        uv.push(i / nu, j / nv);
        col.push(o.c, o.c, o.c);
      }
      for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
        const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
      const q = new BufferGeometry();
      q.setAttribute("position", new Float32BufferAttribute(pos, 3));
      q.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      q.setAttribute("color", new Float32BufferAttribute(col, 3));
      q.setIndex(idx);
      q.computeVertexNormals();
      if (!open) {
        const n = q.attributes.normal;
        for (let j = 0; j <= nv; j++) {
          const a = j * (nu + 1), b = a + nu, x = n.getX(a) + n.getX(b), y = n.getY(a) + n.getY(b), z = n.getZ(a) + n.getZ(b), l = Math.hypot(x, y, z) || 1;
          n.setXYZ(a, x / l, y / l, z / l);
          n.setXYZ(b, x / l, y / l, z / l);
        }
      }
      return q;
    };
    const shade = (q, c) => { q.setAttribute("color", new Float32BufferAttribute(new Float32Array(q.attributes.position.count * 3).fill(c), 3)); return q; };
    const tint = (q, c) => {
      const n = q.attributes.position.count, a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
      q.setAttribute("color", new Float32BufferAttribute(a, 3));
      return q;
    };
    const sph = (sx, sy, sz, ws, hs, ps, pl, ts, tl) => {
      const q = new SphereGeometry(1, ws, hs, ps === undefined ? 0 : ps, pl === undefined ? TAU : pl, ts === undefined ? 0 : ts, tl === undefined ? Math.PI : tl);
      q.scale(sx, sy, sz);
      return q;
    };
    const at = (q, x, y, z) => { q.translate(x, y, z); return q; };
    const rot = (q, rx, ry, rz) => { if (rz) q.rotateZ(rz); if (rx) q.rotateX(rx); if (ry) q.rotateY(ry); return q; };
    const flatUV = (q, u, v) => { const a = q.attributes.uv; for (let i = 0; i < a.count; i++) a.setXY(i, u, v); return q; };
    // a tube from p0 (radius r0) to p1 (radius r1), its ends open
    const limb = (p0, p1, r0, r1, n) => {
      const d = new Vector3(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]), len = d.length();
      const q = new CylinderGeometry(r1, r0, len, n, 1, true);
      q.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), d.normalize()));
      q.translate((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2);
      return q;
    };
    // ---------- the face's skin (the face's front is at a quarter of the width): the eyes with their lids, the shade about them
    // and by the nose, colour in the cheeks, the mouth; a patch of parchment (the scribes' tablets)
    const texFace = (() => {
      const cv = document.createElement("canvas");
      cv.width = 512;
      cv.height = 256;
      const c = cv.getContext("2d");
      c.fillStyle = "#cfa07a";
      c.fillRect(0, 0, 512, 256);
      const cx = 128, ey = 121;
      const blob = (x, y, rx, ry, col) => {
        const gr = c.createRadialGradient(0, 0, 0, 0, 0, 1);
        gr.addColorStop(0, col);
        gr.addColorStop(1, col.replace(/[\d.]+\)$/, "0)"));
        c.save(); c.translate(x, y); c.scale(rx, ry); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.restore();
      };
      blob(cx, 102, 56, 20, "rgba(232,190,150,0.45)");
      for (const sd of [-1, 1]) {
        const ex = cx + sd * 30.4;
        blob(ex, ey, 23, 13, "rgba(110,62,38,0.2)");
        blob(cx + sd * 40, 152, 26, 20, "rgba(200,100,82,0.26)");
        c.strokeStyle = "rgba(110,62,38,0.22)";
        c.lineWidth = 5;
        c.beginPath(); c.moveTo(cx + sd * 10, ey + 2); c.lineTo(cx + sd * 12, 152); c.stroke();
        c.fillStyle = "#e6ddcf";
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, 0, TAU); c.fill();
        c.save();
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, 0, TAU); c.clip();
        c.fillStyle = "#33210f"; c.beginPath(); c.arc(ex, ey, 4.7, 0, TAU); c.fill();
        c.fillStyle = "#5b4027"; c.beginPath(); c.arc(ex, ey, 3.7, 0, TAU); c.fill();
        c.fillStyle = "#0c0806"; c.beginPath(); c.arc(ex, ey, 2.2, 0, TAU); c.fill();
        c.fillStyle = "#ffffff"; c.beginPath(); c.arc(ex - 1.6, ey - 1.7, 1.1, 0, TAU); c.fill();
        c.restore();
        c.strokeStyle = "rgba(52,30,20,0.95)";
        c.lineWidth = 1.8;
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, Math.PI, TAU); c.stroke();
        c.strokeStyle = "rgba(120,78,58,0.6)";
        c.lineWidth = 1;
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, 0, Math.PI); c.stroke();
        c.strokeStyle = "rgba(110,70,48,0.35)";
        c.lineWidth = 1.2;
        c.beginPath(); c.ellipse(ex, ey - 2, 9.6, 5, 0, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
      }
      c.fillStyle = "rgba(156,83,71,0.9)";
      c.beginPath(); c.ellipse(cx, 175, 13, 3.1, 0, 0, TAU); c.fill();
      c.strokeStyle = "rgba(84,40,34,0.85)";
      c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(cx - 13, 174.6); c.quadraticCurveTo(cx, 176.6, cx + 13, 174.6); c.stroke();
      c.fillStyle = "#eadfc4";
      c.fillRect(436, 8, 68, 56);
      const t = new CanvasTexture(cv);
      t.colorSpace = SRGBColorSpace;
      return t;
    })();
    const mCloth = new MeshStandardMaterial({ color: 0x2f2f36, vertexColors: true, roughness: 0.9 });      // the black robe, the kippah, the shoes
    const mSkin = new MeshStandardMaterial({ color: 0xffffff, map: texFace, roughness: 0.8 });
    const mHair = new MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.95, side: DoubleSide });
    const mFar = new MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.9 });
    const TONES = [[0xf4f2ec, 0xe9e6de, 0xfbfaf6, 0xe2dfd6], [0xa8a49b, 0x8e8a82, 0xbab6ad, 0x9a9388], [0x3d2c1f, 0x2e231b, 0x4c3727, 0x36281d], [0x2a1f17, 0x3b2a1c, 0x1f1813, 0x4b3320, 0x5d4129]];
    const SKINS = [0xffffff, 0xf3e7dc, 0xfff3e6, 0xeedccd];
    // ---------- the head (its middle at the origin, the face to +z): an egg, narrower at the chin; the nose and the ears
    const HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1095], HS = 1.045, YJ = -0.118, OFF = 0.96, HEAD_Y = 2.075;
    const headR = (ph, y) => {
      const yn = Math.max(-0.999, Math.min(0.999, y / HR[1])), j = yn < 0 ? yn * yn : 0;
      return Math.sqrt(1 - yn * yn) / Math.hypot(Math.sin(ph) / (HR[0] * (1 - 0.2 * j)), Math.cos(ph) / (HR[2] * (1 - 0.1 * j)));
    };
    const skinPart = (q) => shade(flatUV(q, 0.75, 0.3), 1);
    const headParts = () => {
      const WS = 14, HG = 10, k = new SphereGeometry(1, WS, HG), p = k.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i), j = y < 0 ? y * y : 0;
        p.setXYZ(i, x * HR[0] * (1 - 0.2 * j), y * HR[1], z * HR[2] * (1 - 0.1 * j));
      }
      k.computeVertexNormals();
      const nr = k.attributes.normal;
      for (let j = 0; j <= HG; j++) {
        const a = j * (WS + 1), b = a + WS, x = nr.getX(a) + nr.getX(b), y = nr.getY(a) + nr.getY(b), z = nr.getZ(a) + nr.getZ(b), l = Math.hypot(x, y, z) || 1;
        nr.setXYZ(a, x / l, y / l, z / l);
        nr.setXYZ(b, x / l, y / l, z / l);
      }
      const parts = [shade(k, 1)];
      parts.push(skinPart(at(sph(0.013, 0.034, 0.02, 5, 3), 0, -0.012, 0.133)));
      parts.push(skinPart(at(sph(0.019, 0.017, 0.022, 6, 4), 0, -0.041, 0.146)));
      for (const sd of [-1, 1]) parts.push(skinPart(at(sph(0.012, 0.03, 0.02, 4, 3), sd * 0.126, 0, -0.004)));
      return parts;
    };
    // ---------- the hair. The beard is one body: from the cheeks before the ears and from the jaw, lying on the face, and under
    // the chin it hangs and comes forward to the chest, narrowing; its lower edge uneven
    const beard = (len, w2, nu, nv) => surf(nu || 14, nv || 6, (u, v, o) => {
      const PM = 1.4, a = u * 2 - 1, ph = a * PM, ya = Math.abs(a), sd = 1 - v;
      const yTop = -0.094 + 0.124 * Math.pow(ya, 1.3), yBot = -0.07 - len * (1 - Math.pow(ya, 5)) + 0.008 * Math.sin(6 * ph + w2) * (1 - ya);
      const y = yTop + sd * (yBot - yTop);
      const strand = Math.sin(9 * ph + 3 * sd + w2), th = (0.004 + 0.03 * Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, sd * 1.22))), 0.9) + 0.003 * strand) * (1 - Math.pow(ya, 5));
      if (y >= YJ) {
        const r = headR(ph, y) + th;
        o.x = Math.sin(ph) * r;
        o.z = Math.cos(ph) * r;
      } else {
        const k = Math.min(1, (YJ - y) / 0.2), r = headR(ph, YJ) + th + 0.028 * Math.sin(Math.PI * Math.min(1, k * 1.3)) * Math.abs(Math.sin(ph));
        o.x = Math.sin(ph) * r * (1 - 0.08 * k * k);
        o.z = Math.cos(ph) * r * (1 - 0.1 * k) + 0.05 * k * Math.max(0, Math.cos(ph));
      }
      o.y = y;
      o.c = 0.86 + 0.14 * (0.5 + 0.5 * strand) - 0.06 * sd;
    }, true);
    const brows = () => [-1, 1].map((sd) => shade(at(rot(sph(0.027, 0.0058, 0.009, 6, 3), 0, 0, -sd * 0.05), sd * EYE[0], 0.051, 0.1262), 0.72));
    const stache = () => [-1, 1].map((sd) => shade(at(rot(sph(0.037, 0.0125, 0.016, 5, 3), 0, 0, -sd * 0.4), sd * 0.027, -0.066, 0.127), 1));
    const hairCap = (young) => [shade(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 10, 2, 0, TAU, 0, young ? 1.08 : 0.8), 0.92), shade(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 8, 3, Math.PI + 0.3, Math.PI - 0.6, 1.08, 1.4), 0.9)];
    const peyot = () => [-1, 1].flatMap((sd) => [shade(at(sph(0.013, 0.062, 0.016, 5, 4), sd * 0.122, -0.04, 0.05), 0.95), shade(at(sph(0.016, 0.016, 0.016, 5, 3), sd * 0.124, -0.102, 0.054), 1)]);
    const kippah = (ws, hs) => shade(at(rot(sph(HR[0] * 1.09, HR[1] * 1.09, HR[2] * 1.09, ws || 10, hs || 3, 0, TAU, 0, 0.99), -0.14), 0, 0.002, -0.004), 0.45);
    // ---------- the body: the robe's breadth and depth at each height of a standing man (the priest's table); a sitting man is
    // the table from OFF up, with the lap before it
    const BODY = [[0.1, 0.207, 0.166], [0.5, 0.205, 0.164], [1.0, 0.201, 0.16], [1.2, 0.199, 0.158], [1.33, 0.193, 0.15], [1.45, 0.197, 0.152], [1.58, 0.216, 0.158], [1.68, 0.244, 0.156], [1.745, 0.264, 0.146], [1.79, 0.242, 0.128], [1.83, 0.186, 0.11], [1.87, 0.116, 0.09], [1.9, 0.076, 0.076]];
    const bX = BODY.map((r) => [r[0], r[1]]), bZ = BODY.map((r) => [r[0], r[2]]);
    const robe = (ys, yo, folds, nu) => surf(nu || 12, ys.length - 1, (u, v, o) => {
      const y = ys[Math.round(v * (ys.length - 1))], a = u * TAU + Math.PI, k = folds ? Math.max(0, (1.3 - y) / 1.2) : 0;
      const fold = Math.sin(3 * a + 0.8) * 0.6 + Math.sin(5 * a + 2.1) * 0.4, m = 1 + 0.03 * k * fold;
      o.x = spl(bX, y) * m * Math.sin(a);
      o.y = y + yo;
      o.z = spl(bZ, y) * m * Math.cos(a);
      o.c = 1 - 0.16 * k * Math.max(0, -fold);
    });
    // the robe over the thighs, round the knees and down to the shoes (a man on a bench; L: the bench's height in the figure's units)
    const lapBench = (L) => {
      const yT = 0.1, zK = 0.3, RK = 0.085, l1 = zK, l2 = RK * Math.PI / 2, l3 = (yT - RK) - (-L + 0.05), tot = l1 + l2 + l3;
      const D = [0, l1 * 0.5, l1, l1 + l2 / 3, l1 + 2 * l2 / 3, l1 + l2, l1 + l2 + l3 * 0.4, l1 + l2 + l3 * 0.75, tot];
      return surf(12, D.length - 1, (u, v, o) => {
        const d = D[Math.round(v * (D.length - 1))], ph = -u * TAU;
        let pz, py, nz, ny;
        if (d <= l1) { pz = d; py = yT; nz = 0; ny = 1; }
        else if (d <= l1 + l2 + 1e-9) { const th = (d - l1) / RK; pz = zK + RK * Math.sin(th); py = yT - RK + RK * Math.cos(th); nz = Math.sin(th); ny = Math.cos(th); }
        else { pz = zK + RK; py = yT - RK - (d - l1 - l2); nz = 1; ny = 0; }
        const k3 = sstep(l1 + l2, tot, d);
        const a = 0.212 - 0.012 * sstep(0, l1 + l2, d) + 0.02 * k3 * k3, b = 0.1 - 0.012 * sstep(l1 * 0.5, l1 + l2, d) + 0.012 * k3 * k3;
        const sx = Math.sin(ph), cx = Math.cos(ph), x = a * sx, g = Math.exp(-(x / 0.06) * (x / 0.06)), fold = Math.sin(5 * ph + 1.3) * k3;
        const r = b * (cx > 0 ? Math.pow(cx, 0.6) * (1 - 0.3 * g) : cx) * (1 + 0.04 * fold);
        o.x = x * (1 + 0.03 * fold);
        o.y = py + ny * r;
        o.z = pz + nz * r;
        o.c = (cx > 0 ? 1 - 0.3 * g : 0.8) - 0.1 * Math.max(0, fold);
      });
    };
    const arm = (S, E, W) => [shade(at(sph(0.074, 0.074, 0.074, 6, 4), S[0], S[1], S[2]), 1), shade(limb(S, E, 0.072, 0.06, 6), 0.95), shade(at(sph(0.06, 0.06, 0.06, 6, 3), E[0], E[1], E[2]), 0.95), shade(limb(E, W, 0.058, 0.048, 6), 0.9)];
    // a hand lying flat: the palm, the fingers a little bent, the thumb at the inner side (sd: the arm's side; dir: its way, from +z)
    const hand = (sd, H, dir) => {
      const q = mergeGeometries([at(sph(0.03, 0.0135, 0.042, 5, 3), 0, 0, 0.04), at(sph(0.027, 0.011, 0.03, 5, 3), 0, -0.006, 0.085), at(sph(0.01, 0.01, 0.024, 4, 2), -sd * 0.03, 0, 0.04)]);
      q.rotateY(dir);
      q.translate(H[0], H[1], H[2]);
      return skinPart(q);
    };
    const cache = {};
    const build = (pose, L, kind) => {
      const key = pose + "|" + L.toFixed(3) + "|" + kind;
      if (cache[key]) return cache[key];
      const seated = pose !== "stand", HY = HEAD_Y - (seated ? OFF : 0), SY = 1.728 - (seated ? OFF : 0), cloth = [], skin = [];
      const headT = (q) => at(q, 0, HY, 0);
      if (seated) cloth.push(robe([0.98, 1.13, 1.28, 1.43, 1.58, 1.644, 1.708, 1.772, 1.836, 1.9], -OFF, false));
      else cloth.push(robe([0.1, 0.4, 0.7, 1.0, 1.3, 1.45, 1.58, 1.644, 1.708, 1.772, 1.836, 1.9], 0, true));
      for (const sd of [-1, 1]) {
        if (pose === "bench") {
          for (const q of arm([sd * 0.245, SY - 0.01, 0], [sd * 0.27, 0.43, 0.03], [sd * 0.15, 0.225, 0.26])) cloth.push(q);
          skin.push(hand(sd, [sd * 0.13, 0.2, 0.27], -sd * 0.25));
          cloth.push(shade(at(sph(0.05, 0.032, 0.1, 5, 3), sd * 0.1, -L + 0.032, 0.42), 0.4));                       // the shoes
        } else if (pose === "ground") {
          for (const q of arm([sd * 0.245, SY - 0.01, 0], [sd * 0.285, 0.44, -0.02], [sd * 0.262, 0.225, 0.15])) cloth.push(q);
          skin.push(hand(sd, [sd * 0.25, 0.195, 0.17], sd * 0.1));
          cloth.push(shade(at(sph(0.115, 0.095, 0.14, 6, 4), sd * 0.255, 0.085, 0.2), 1));                           // the knees under the robe
        } else {
          // (a man facing +z: his left is at +x) the left hand under the tablet, the right hand on it with the pen
          const W = sd > 0 ? [0.11, 1.4, 0.25] : [-0.1, 1.46, 0.27];
          for (const q of arm([sd * 0.25, SY - 0.01, 0], [sd * 0.275, 1.4, 0.02], W)) cloth.push(q);
          skin.push(hand(sd, sd > 0 ? [0.1, 1.395, 0.26] : [-0.09, 1.475, 0.27], -sd * 0.3));
          cloth.push(shade(at(sph(0.05, 0.03, 0.1, 5, 3), sd * 0.1, 0.03, 0.07), 0.4));
        }
      }
      if (pose === "bench") cloth.push(lapBench(L));
      else if (pose === "ground") cloth.push(shade(at(sph(0.3, 0.115, 0.24, 10, 4), 0, 0.075, 0.17), 0.8));         // the robe over the crossed legs
      else {
        skin.push(shade(flatUV(at(rot(new BoxGeometry(0.21, 0.016, 0.27), -0.5), 0.01, 1.455, 0.37), 0.92, 0.86), 1));   // the scribe's tablet ("וכותבין", Sanhedrin 4:3)
        cloth.push(shade(limb([-0.07, 1.5, 0.36], [-0.11, 1.6, 0.33], 0.006, 0.004, 5), 0.5));                          // and his pen
      }
      cloth.push(headT(kippah()));
      for (const q of headParts()) skin.push(headT(q));
      skin.push(skinPart(at(new CylinderGeometry(0.066, 0.072, 0.1, 8, 1, true), 0, HY - 0.15, 0)));
      const base = () => brows().concat(hairCap(kind === "student")).map(headT);
      const hair = kind === "student"
        ? [mergeGeometries(base().concat(peyot().map(headT)))]
        : [[0.25, 1.1], [0.19, 3.3], [0.14, 5.2]].map(([len, w2]) => mergeGeometries(base().concat(stache().map(headT), [headT(beard(len, w2))])));
      // PEOPLE_KIT_205 - the plain figure (from ~22 amot): the same body in a few faces - the robe, the lap, the arms, the kippah; the
      // head with its painted face; the beard (or a young man's hair and peyot) in its own colour
      const mc = [], ms = [], mh = [];
      mc.push(robe(seated ? [0.98, 1.3, 1.58, 1.745, 1.9] : [0.1, 0.7, 1.3, 1.58, 1.745, 1.9], seated ? -OFF : 0, false, 8));
      if (pose === "bench") {
        mc.push(shade(at(new BoxGeometry(0.4, 0.19, 0.46), 0, 0.105, 0.2), 0.95));
        mc.push(shade(at(new BoxGeometry(0.38, L, 0.17), 0, -L / 2 + 0.06, 0.385), 0.88));
      } else if (pose === "ground") mc.push(shade(at(sph(0.36, 0.115, 0.26, 8, 3), 0, 0.075, 0.17), 0.85));
      for (const sd of [-1, 1]) {
        const E = pose === "bench" ? [sd * 0.27, 0.43, 0.03] : pose === "ground" ? [sd * 0.285, 0.44, -0.02] : [sd * 0.275, 1.4, 0.02];
        const W = pose === "bench" ? [sd * 0.15, 0.225, 0.26] : pose === "ground" ? [sd * 0.262, 0.225, 0.15] : (sd > 0 ? [0.11, 1.4, 0.25] : [-0.1, 1.46, 0.27]);
        mc.push(shade(limb([sd * 0.245, SY - 0.01, 0], E, 0.074, 0.06, 5), 0.95));
        mc.push(shade(limb(E, W, 0.058, 0.048, 5), 0.9));
        ms.push(skinPart(at(sph(0.032, 0.016, 0.05, 4, 3), W[0] - sd * 0.02, W[1] - 0.02, W[2] + 0.05)));
      }
      if (pose === "stand") ms.push(shade(flatUV(at(rot(new BoxGeometry(0.21, 0.016, 0.27), -0.5), 0.01, 1.455, 0.37), 0.92, 0.86), 1));
      mc.push(headT(kippah(8, 2)));
      {
        const k = new SphereGeometry(1, 10, 6), p = k.attributes.position;
        for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), j = y < 0 ? y * y : 0; p.setXYZ(i, x * HR[0] * (1 - 0.2 * j), y * HR[1], z * HR[2] * (1 - 0.1 * j)); }
        k.computeVertexNormals();
        ms.push(headT(shade(k, 1)));
      }
      if (kind === "student") {
        mh.push(headT(shade(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 8, 2, 0, TAU, 0, 1.08), 0.92)));
        for (const sd of [-1, 1]) mh.push(headT(shade(at(sph(0.015, 0.07, 0.018, 4, 3), sd * 0.123, -0.05, 0.05), 0.95)));
      } else mh.push(headT(beard(0.2, 2.2, 8, 3)));
      const mid = { cloth: mergeGeometries(mc), skin: mergeGeometries(ms), hair: mergeGeometries(mh) };
      // from afar: the robe, the head and the kippah, plain
      const cR = new Color(0x26262c), cS = new Color(0xcfa07a), cK = new Color(0x121215), far = [];
      if (!seated) far.push(tint(at(new CylinderGeometry(0.17, 0.21, 1.8, 6), 0, 1.0, 0), cR));
      else {
        far.push(tint(at(new CylinderGeometry(0.16, 0.2, 0.9, 6), 0, 0.45, 0), cR));
        if (pose === "bench") {
          far.push(tint(at(new BoxGeometry(0.42, 0.2, 0.5), 0, 0.1, 0.22), cR));
          far.push(tint(at(new BoxGeometry(0.4, L, 0.19), 0, -L / 2 + 0.05, 0.39), cR));
        } else far.push(tint(at(sph(0.36, 0.12, 0.27, 6, 3), 0, 0.07, 0.17), cR));
      }
      far.push(tint(at(sph(HR[0], HR[1], HR[2], 6, 4), 0, HY, 0), cS));
      far.push(tint(at(sph(HR[0] * 1.09, HR[1] * 1.09, HR[2] * 1.09, 6, 2, 0, TAU, 0, 0.92), 0, HY, -0.004), cK));
      return (cache[key] = { cloth: mergeGeometries(cloth), skin: mergeGeometries(skin), hair, mid, far: mergeGeometries(far) });
    };
    const LOD = [], m4 = new Matrix4(), qt = new Quaternion(), sc = new Vector3(), ps = new Vector3(), up = new Vector3(0, 1, 0), c3 = new Color(), wp = new Vector3();
    const crowd = (parent, pts, o) => {
      const n = pts.length, L = o.pose === "bench" ? o.seat / o.s : 0, G = build(o.pose, L, o.kind);
      const near = new Group(), mid = new Group(), far = new Group(), anchor = new Group();
      const mk = (g, m) => { const im = new InstancedMesh(g, m, n); im.castShadow = false; im.receiveShadow = true; im.userData.noPick = true; if (o.name) im.name = o.name; return im; };   // (PEOPLE_KIT_205: no figure casts a shadow)
      const cloth = mk(G.cloth, mCloth), skin = mk(G.skin, mSkin), hairs = G.hair.map((g) => mk(g, mHair)), cnt = hairs.map(() => 0), fm = mk(G.far, mFar);
      const mCl = mk(G.mid.cloth, mCloth), mSk = mk(G.mid.skin, mSkin), mHr = mk(G.mid.hair, mHair);
      let ax = 0, az = 0;
      for (const p of pts) { ax += p[0] / n; az += p[1] / n; }
      let R = 0;
      pts.forEach(([x, z, yaw], i) => {
        const big = o.big === i, s = o.s * (big ? 1.08 : 0.97 + rnd() * 0.06), fw = o.fwd || 0;
        qt.setFromAxisAngle(up, yaw + (rnd() - 0.5) * (o.pose === "bench" ? 0.16 : 0.3));
        m4.compose(ps.set(x + Math.sin(yaw) * fw, o.y, z + Math.cos(yaw) * fw), qt, sc.set(s, s, s));
        for (const im of [cloth, skin, fm, mCl, mSk, mHr]) im.setMatrixAt(i, m4);
        c3.setHex(SKINS[(i * 5 + 1) % SKINS.length]);
        skin.setColorAt(i, c3);
        mSk.setColorAt(i, c3);
        const pal = TONES[o.kind === "student" ? 3 : (o.tone ? o.tone(i) : 1)], k = big ? 0 : (i * 7 + 3) % hairs.length;
        c3.setHex(big ? TONES[0][2] : pal[Math.floor(rnd() * pal.length)]);
        hairs[k].setMatrixAt(cnt[k], m4);
        hairs[k].setColorAt(cnt[k], c3);
        mHr.setColorAt(i, c3);
        cnt[k]++;
        R = Math.max(R, Math.hypot(x - ax, z - az));
      });
      hairs.forEach((h, k) => { h.count = cnt[k]; });
      for (const im of [cloth, skin, fm, mCl, mSk, mHr].concat(hairs)) {
        im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        if (im.count > 0) (im === fm ? far : im === mCl || im === mSk || im === mHr ? mid : near).add(im);
      }
      near.visible = false;
      far.visible = false;
      anchor.position.set(ax, o.y, az);
      for (const q of [near, mid, far, anchor]) parent.add(q);
      LOD.push({ near, mid, far, anchor, R: R * 1.0, lv: 1 });
      return near;
    };
    // PEOPLE_KIT_205: the level by the eye's distance from the crowd's edge (as it would be at a 45-degree lens); a tenth of slack
    // both ways, so that a level does not flicker at its border
    if (Array.isArray(ctx.animated)) ctx.animated.push(() => {
      const cam = ctx.camera;
      if (!cam) return;
      const f = cam.isPerspectiveCamera ? Math.tan(cam.fov * Math.PI / 360) / 0.4142 / (cam.zoom || 1) : 1;
      for (const e of LOD) {
        e.anchor.getWorldPosition(wp);
        const d = Math.max(0, wp.distanceTo(cam.position) - e.R) * f;
        let lv = e.lv;
        if (lv === 0) lv = d > 24 ? (d > 132 ? 2 : 1) : 0;
        else if (lv === 1) lv = d < 20 ? 0 : d > 132 ? 2 : 1;
        else lv = d < 20 ? 0 : d < 110 ? 1 : 2;
        if (lv !== e.lv || e.near.visible !== (lv === 0) || e.mid.visible !== (lv === 1)) { e.lv = lv; e.near.visible = lv === 0; e.mid.visible = lv === 1; e.far.visible = lv === 2; }
      }
    });
    // pts [[x, z] ...] along a row round the centre c: every one's face to the row's inner side (`away`: to its outer side)
    const facing = (pts, c, away) => pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), nz = b[0] - a[0];
      if (nx * (c[0] - p[0]) + nz * (c[1] - p[1]) < 0) { nx = -nx; nz = -nz; }
      if (away) { nx = -nx; nz = -nz; }
      return [p[0], p[1], Math.atan2(nx, nz)];
    });
    // the beards along a row of n judges: white by the one in the middle, grey further, black-brown at the two ends
    const age = (n) => (i) => { const d = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2); return d < 0.34 ? 0 : d < 0.67 ? 1 : 2; };
    return (ctx.__tmPeople = { crowd, facing, age });
  }
  // ===== PEOPLE_KIT_204 END
  async function buildCourts(ctx) {
    const M2 = ctx.M, H2 = ctx.H, CO2 = ctx.CO, LV2 = ctx.LV;
    if (typeof mnt_bandWall !== "function" || typeof mnt_gatePortal !== "function") throw new Error("30-courts.js needs the wall helpers of 20-mount.js");
    const g = new Group();
    g.name = "courts";
    ctx.root.add(g);
    const lbl = (text, x, y, z, size = 3) => ctx.labels.push({ text, x, y, z, size });
    const T = CRT_WALL_T, WH = CRT_WALL_H, AZ = LV2.AZ, STEP = 0.5; // tread 0.5, rise 0.5 (SPEC 1, Middot 2:3)
    const stoneC = typeof mnt_courseStone === "function" ? mnt_courseStone(M2) : M2.stone;
    const bronzeDoor = M2.bronze.clone();
    bronzeDoor.roughness = 0.4; // II Chr 4:9 "ודלתותיהם צפה נחשת" - the court doors overlaid with bronze

    // ---------- podium: stone block 197 x 6 x 145 from y 0 to 6 (x -98.5..98.5, z +-72.5), floor paving at y 6 ----------
    // The inner court lies 6 above the great court = 12 steps (model choice, after Middot 2:3 / 3:6; Kings gives no levels).
    const podL = CO2.AZ_L + 2 * (T / 2 + CRT_LEDGE), podW = CO2.AZ_W + 2 * (T / 2 + CRT_LEDGE); // 197 x 145: the 187 x 135 court (Middot 5:1) + half the wall (2.5) + ledge 2.5 each side
    H2.box(g, podL, AZ - 0.15, podW, M2.stone, 0, LV2.HAR, 0);
    // 1.0.1-K (the user: "אכן רצפת העזרה היתה משיש, אייר זאת כך"): the court's floor inside the wall's inner faces (182 x 130) is marble
    // slabs - I Chr 29:2 "ואבני שיש לרב"; Rashi there "ואבני שיש. לעמודים ושלחנות ולרצפה"; Targum "ואבני מרמוריא" (M.marblePave,
    // 10-core.js). The band under the wall and the ledge outside it keep the stone paving: four strips around the marble, no overlap.
    const inL = CO2.AZ_L - T, inW = CO2.AZ_W - T, rimX = (podL - inL) / 2, rimZ = (podW - inW) / 2;   // 182 x 130; rims 7.5
    H2.box(g, inL, 0.15, inW, M2.marblePave || M2.pave, 0, AZ - 0.15, 0).name = "azarahFloor";        // top at LV.AZ
    for (const s of [-1, 1]) {
      H2.box(g, podL, 0.15, rimZ, M2.pave, 0, AZ - 0.15, s * (inW + rimZ) / 2);                      // north / south strips, full length
      H2.box(g, rimX, 0.15, inW, M2.pave, s * (inL + rimX) / 2, AZ - 0.15, 0);                       // east / west strips between them
    }

    // ---------- the wall: I Kings 6:36 "שלשה טורי גזית וטור כרתת ארזים" (Rashi 6:36 [308]: a course of hewn cedar in the wall; Metzudat David 6:36 [509] ----------
    // "וכסדר הזה בנה אותו עד כלות גבהי הכתלים": the band repeated up to the top; Rashi 7:12 as the parallel: three stone courses and a cedar course on them)
    // Bands of 3 stone courses (3 high) + 1 cedar course (1 high), thickness 5, height 20 (model choice), on the court's edge:
    // centre lines x = +-93.5, z = +-67.5 (Middot 5:1 court 187 x 135 measured on the wall's CENTRE line - model choice per SPEC 4; the clear
    // court inside the 5-thick wall is 182 x 130, while Middot 5:1 gives the clear size), from y 6. Openings 10 x 20 cut through the whole
    // wall; the gate portals' 20-high lintels cap the crest of the 20-high wall. The north / south walls cover the corners (length 192 = 187 + 5);
    // the east / west walls run between their inner faces (length 130 = 135 - 5), so no corner volume is built twice (as the great court's 505 / 495).
    const nsOpen = CRT_NS_GATES.map((x) => ({ center: x, width: CRT_GATE_W }));
    // 3 stone courses of 1 amah + 1 cedar course (course height: model choice; Radak on I Kings 7:9 [432] gives the גזית course as 5 tefachim, Bava Batra 3a [41])
    const bandOpts = { height: WH, thickness: T, y: AZ, stoneH: 3, cedarH: 1, stoneMat: stoneC, cedarMat: M2.cedar, H: H2 };
    // 1.0.1-L (L.21): the NORTH wall is open where לשכת הגזית stands in it (x 48.5..69.5: the chamber's own side walls, x 48..49.5 and
    // 68.5..70, take the wall's place, and the wall's ends stop 0.5 inside them so no face is shared); the south wall is whole again
    // (1.0.1-K had this opening in the south wall, x 59.5..88.5)
    const GZ = CRT_GAZIT, gzOpen = { center: (GZ.x0 + GZ.x1) / 2, width: GZ.x1 - GZ.x0 - 1 };
    const wallN = mnt_bandWall(g, Object.assign({ axis: "x", length: CO2.AZ_L + T, cx: 0, cz: CO2.azN, openings: nsOpen.concat([gzOpen]) }, bandOpts));
    const wallS = mnt_bandWall(g, Object.assign({ axis: "x", length: CO2.AZ_L + T, cx: 0, cz: CO2.azS, openings: nsOpen }, bandOpts));
    const wallE = mnt_bandWall(g, Object.assign({ axis: "z", length: CO2.AZ_W - T, cx: CO2.azE, cz: 0, openings: [{ center: 0, width: CRT_GATE_W }] }, bandOpts)); // 130, z -65..65; east gate on the axis
    const wallW = mnt_bandWall(g, Object.assign({ axis: "z", length: CO2.AZ_W - T, cx: CO2.azW, cz: 0 }, bandOpts)); // 130; no gate on the west (Middot 1:4)

    // 1.3.5 (the user, 10.11.2026 22:12: "בר שורא חובה"): BAR SHURA - Pesachim 86a (book 106, line 2736) "משכחת לה בבר שורא, דכתיב:
    // ויאבל חל וחומה, ואמר רבי אחא ואיתימא רבי חנינא: שורא ובר שורא"; Rashi (book 2162, line 4148): "חומה קטנה לפנים מן החומה גדולה, והיא
    // נמוכה ושוה לקרקע גובה העזרה, שקרקע העזרה הולך וגבוה ועולה במעלות"; Tosafot Yom Tov, Middot 2:3 (book 948, line 69): "כלומר שראשה
    // תהא שוה לקרקע העזרה ותהא מוקדשת כמוה". As in the Second Temple's model: ONE low wall against the court's wall on its inside, all
    // round, its top at the level of the court's floor. There the court of Israel lies two and a half amot under that level and the
    // wall stands out of it; here the court has one level, so the wall's head is level with the floor - a band of darker smooth stone
    // one amah wide at the wall's foot (0.06 proud, so that it reads), broken at the seven gates and where Lishkat HaGazit stands in
    // the north wall. One amah thick - a model choice.
    {
      const bm = M2.stoneSmooth.clone();
      bm.color.setHex(0x9d968a);
      const xi = CO2.AZ_L / 2 - T / 2, zi = CO2.AZ_W / 2 - T / 2;   // 91, 65: the wall's inner faces
      const band = (x0, x1, z0, z1) => { if (x1 - x0 < 0.05 || z1 - z0 < 0.05) return; const m = H2.box(g, x1 - x0, 0.06, z1 - z0, bm, (x0 + x1) / 2, AZ, (z0 + z1) / 2); m.name = "barShura"; m.castShadow = false; };   // level with the floor, as Rashi's words (the user, 11.11.2026: "לא להגביה - אנו לא עושים נגד ראשונים")
      // along x between -xi and xi, less the spans [a, b] (sorted)
      const run = (z0, z1, gaps) => { let x = -xi; for (const [a, b] of gaps) { band(x, a, z0, z1); x = b; } band(x, xi, z0, z1); };
      const gates = CRT_NS_GATES.slice().sort((a, b) => a - b).map((x) => [x - CRT_GATE_W / 2 - 1.6, x + CRT_GATE_W / 2 + 1.6]);
      const north = gates.concat([[CRT_GAZIT.x0 - 0.3, CRT_GAZIT.x1 + 0.3]]).sort((a, b) => a[0] - b[0]);
      run(-zi, -zi + 1, north);
      run(zi - 1, zi, gates);
      band(xi - 1, xi, -zi + 1, -CRT_GATE_W / 2 - 1.6);
      band(xi - 1, xi, CRT_GATE_W / 2 + 1.6, zi - 1);
      band(-xi, -xi + 1, -zi + 1, zi - 1);
      lbl("בר שורא — חומה קטנה לפנים מן החומה (רש״י פסחים פו.)", xi - 1.5, AZ + 3.2, 38, 2);
    }

    // ---------- 7 gates (Middot 1:4 convention): square 10 x 20 openings, flat stone lintels (no arches), bronze doors (II Chr 4:9) ----------
    const portal = { T, openW: CRT_GATE_W, openH: CRT_GATE_H, doorH: CRT_GATE_H, doorMat: bronzeDoor, M: M2, H: H2, y: AZ };
    for (const gx of CRT_NS_GATES) {
      mnt_gatePortal(g, Object.assign({ axis: "x", gx, gz: CO2.azN, inward: 1, fadeWith: wallN.stone }, portal));  // doors swing south, into the court
      mnt_gatePortal(g, Object.assign({ axis: "x", gx, gz: CO2.azS, inward: -1, fadeWith: wallS.stone }, portal)); // doors swing north, into the court
    }
    mnt_gatePortal(g, Object.assign({ axis: "z", gx: CO2.azE, gz: 0, inward: 1, fadeWith: wallE.stone }, portal)); // doors swing west, into the court

    // ---------- steps ----------
    // 12 steps (6 rise) outside each north / south gate, from the great court (LV.HAR = 0) up to the podium edge (LV.AZ = 6): model choice
    const SW = 12; // model choice: flight width 12, a little wider than the 10-wide gate opening
    for (const gx of CRT_NS_GATES) {
      H2.stairs(g, { width: SW, totalRise: AZ - LV2.HAR, steps: 12, dir: "S", x: gx, y: LV2.HAR, z: -podW / 2 - 12 * STEP, tread: STEP }); // z -78.5 -> -72.5
      H2.stairs(g, { width: SW, totalRise: AZ - LV2.HAR, steps: 12, dir: "N", x: gx, y: LV2.HAR, z: podW / 2 + 12 * STEP, tread: STEP });  // z 78.5 -> 72.5
    }
    // the east gate: 6 steps (3 rise) from the outer court (החצר החיצונה) floor (level 3, 20-mount.js) up to the podium edge at x 98.5: model choice
    const wcY = ctx.shared && ctx.shared.newCourt && typeof ctx.shared.newCourt.y === "number" ? ctx.shared.newCourt.y : 3;
    const eSteps = Math.max(1, Math.round((AZ - wcY) / STEP));
    // 1.3.5 (the user: "את המדרגות שנמצאות בשער המזרחי של עזרת כהנים תעשה עגולות (זה שייך גם לבית שני)"): ROUND, as the fifteen steps of the
    // Second Temple that went up from the women's court - "לא היו טרוטות, אלא מקפות כחצי גרן עגלה" (Middot 2:5): half discs, one on the
    // other, their straight side at the podium's face (x 98.5) and their round side to the east; rise and tread half an amah (Middot
    // 2:3). The top one 5.5 in radius (the gate's 10 and half an amah at each side), each one below it half an amah more - the lowest 8,
    // clear of the king's pillar (its platform at x 104..108, z 6..10). Until 1.3.4 a straight flight 12 wide. The radii - a model choice.
    // 1.3.5 (10.11.2026; the user, of the kuntres "בגדרי ודיני צורת הבית", point 1 - "לשנות לפי המאירי"; as the Second Temple's fifteen):
    // THE STEPS GO ROUND AS HALF A THRESHING FLOOR, as the Meiri reads Middot 2:5 (book 6033, line 35): "מוקפות כחצי גורן, שהתחתונה קצרה,
    // והשניה עודפת לה משני קצותיה, וכן שלישית לשניה" - the lowest the shortest, each one above it longer at both its ends. So: a block
    // before the gate (x 98.5..105.9, z +-5.75) with a half-round hollow open to the east, its centre on the block's east face; the
    // lowest step's edge 2.9 from the centre and each one above it half an amah more (the top one 5.4); rise and tread half an amah.
    // Until then (the first build of 1.3.5) half discs lying one on the other, the lowest the widest. The radii and the block - a
    // model choice. Each slab is one rise thick, the block less its own half disc.
    // 1.3.7 (the user, 11.11.2026 16:38: "גם בבית ראשון מעלות" - the ONE WIDE DRAWING of the Second Temple's fifteen steps, there
    // 1.9.5): STRAIGHT STEPS ALONG THE PODIUM'S EAST FACE, the lowest the shortest and each one above it longer at both its ends,
    // their ends on an arc - the Meiri's shape (above) with the Rid's length: "ואורך המעלה היה קל"ה אמה כרוחב העזרה מכותל לכותל"
    // (Piskei HaRid, Sukkah 53a - "קובץ שיטות קמאי על מדות", book 7576, line 355). The free width here: between the two western
    // chambers of the outer court (their fronts at z +-56.5; 20-mount.js MNT_LISHKA) - 113 amot. The arc (through the two ends of
    // the top step, as deep as the steps' run) and so the lowest step's length - a model choice. Until 1.3.6: a block before the
    // gate with a half-round hollow (1.3.5).
    // 1.3.7, later the same day (the user, 11.11.2026 17:11: "מעלות שתי קריאות רמבם ברירת מחדל"; 17:13: "בבית ראשון, תעשה גם שתי
    // שיטות"): TWO READINGS OF THESE STEPS, as of the Second Temple's fifteen (there 1.9.5). The Rambam's commentary on Middot 2:5
    // (the user's library, book 573, line 25) stands against the Rid's length: "שמעלות עזרת נשים לא היו ארוכים כשאר המעלות כמו שהוא
    // מפורסם היום מצורת המדרגות אלא היתה כל מעלה כמו חצי עגולה עד שתהא כל מעלה חצי גורן כזה ... ולפיכך היתה צורת המעלה כמי שלקח קצת
    // אצטבא ונתן אותה על המעלה עד שמשלים צורת הסולם". ctx.shared.eastSteps (the row "מעלות השער המזרחי — צורתן", 70-ui.js):
    //   "rambam" (THE DEFAULT) - the group eStepsRound: half discs lying one on the other before the gate, the top one 5.5 in radius
    //     (the gate's 10 and half an amah at each side) and each one below it half an amah more - the lowest 8, clear of the king's
    //     pillar (its platform at x 104..108, z 6..10) and of the lesser court's chamber north of the way (as the first build of
    //     1.3.5). The radii - a model choice.
    //   "rid" - the group eStepsWide: the straight steps along the podium's east face (above).
    const eRun = eSteps * STEP;   // 3: the steps' run east of the podium's face
    const eStepsWide = new Group(), eStepsRound = new Group();
    eStepsWide.name = "eStepsWide"; eStepsRound.name = "eStepsRound";
    eStepsWide.visible = false;
    g.add(eStepsWide); g.add(eStepsRound);
    {
      const rise = (AZ - wcY) / eSteps, XW0 = podL / 2, HZ = 56.5, RR = (HZ * HZ + eRun * eRun) / (2 * eRun);
      for (let k = 1; k <= eSteps; k++) {
        const d = STEP * (eSteps - k), half = Math.sqrt(Math.max(0, RR * RR - (RR - eRun + d) * (RR - eRun + d))), dep = STEP * (eSteps + 1 - k);
        const st = H2.box(eStepsWide, dep, rise * k, 2 * half, M2.stoneSmooth, XW0 + dep / 2, wcY, 0);   // solid down to the outer court's floor
        st.name = "eastGateStep";
        st.castShadow = st.receiveShadow = true;
      }
      for (let k = 1; k <= eSteps; k++) {
        const R = CRT_GATE_W / 2 + 0.5 + STEP * (eSteps - k);   // 8 .. 5.5
        const sh = new Shape();   // in the shape's plane: x = the model's x - the podium's face, y = the model's -z
        sh.moveTo(0, -R);
        sh.absarc(0, 0, R, -Math.PI / 2, Math.PI / 2, false);
        sh.lineTo(0, -R);
        const geo = new ExtrudeGeometry(sh, { depth: rise, bevelEnabled: false, curveSegments: 40 });
        geo.rotateX(-Math.PI / 2);   // the extrusion rises: the slab stands on y 0..rise
        const st = new Mesh(geo, M2.stoneSmooth);
        st.position.set(XW0, wcY + (k - 1) * rise, 0);
        st.name = "eastGateStepRound";
        st.castShadow = st.receiveShadow = true;
        eStepsRound.add(st);
      }
    }
    ctx.shared.eastSteps = {
      mode: "rambam", x: podL / 2, y: wcY, run: eRun,
      set(m) { this.mode = m === "rid" ? "rid" : "rambam"; eStepsWide.visible = this.mode === "rid"; eStepsRound.visible = this.mode !== "rid"; return this.mode; }
    };

    // 1.3.5 (the user, 10.11.2026 22:12: "תוסיף סנהדראות"; as in the Second Temple): THE TWO LESSER COURTS - Sanhedrin 11:2 (book 73, line 78)
    // "שלשה בתי דינין היו שם, אחד יושב על פתח הר הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית"; Rashi 86b (book 2180, lines
    // 4632-4633): "על פתח הר הבית - הוא שער המזרחי שלפנים מן החיל לפני עזרת נשים", "ואחד יושב למעלה הימנו - כשעברו עזרת נשים ובאין לפני
    // עזרת ישראל". In this model's courts: one outside the outer court's east gate (the court before the inner one - Rashi on I Kings
    // 6:36), on the platform north of its steps; one inside the outer court before the inner court's east gate, north of its steps
    // (the king's pillar stands south of them). Twenty-three (Sanhedrin 1:6) in half a circle on a low bench, as small figures. The
    // places, the sides, the benches and the figures - model choices.
    {
      // 1.3.7 (remarks sent on to the user, 11.11.2026: "הסנהדרין לא יכלה לשבת בחוץ בצורה פתוחה גם משום כבודם וגם כיון שבקבלת העדות הם
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
      const PPL = tm_people(ctx);   // PEOPLE_KIT_204 (1.3.7): sitting men in black robes and kippot (until 1.3.6: pegs with a ball for a head)
      const R = 7.5, WT = 1, WH2 = 7, HX = R + 0.45 + 0.6, ZB = -(R + 0.45 + 0.6), ZF = 2.65;   // the room inside: x -HX..HX, z ZB..ZF (the half circle's centre at 0, its open side to +z, the door there)
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
        PPL.crowd(lg2, PPL.facing(arcPts(R, 23, 0, Math.PI), [0, 0], false), { y: 0.45, s: 0.7, pose: "bench", seat: 0.45, kind: "judge", tone: PPL.age(23), big: 11, shadow: true, fwd: 0.2, name: "lesserCourtFigures" });
        // the two scribes, standing before them, one at the right and one at the left (Sanhedrin 4:3)
        PPL.crowd(lg2, [[-2.2, 1.3, Math.PI], [2.2, 1.3, Math.PI]], { y: 0, s: 0.7, pose: "stand", kind: "scribe", tone: () => 1, shadow: true, name: "lesserCourtFigures" });
        // the three rows of students (4:4): round, on the ground (Rashi 37a) / straight (the Yad Ramah)
        const stR = new Group(), stS = new Group();
        stS.visible = false;
        lg2.add(stR);
        lg2.add(stS);
        PPL.crowd(stR, [6.15, 4.95, 3.75].flatMap((r) => PPL.facing(arcPts(r, 23, 0.07 * Math.PI, 0.93 * Math.PI), [0, 0], true)), { y: 0, s: 0.6, pose: "ground", kind: "student", shadow: true, name: "lesserCourtFigures" });
        PPL.crowd(stS, [1.3, 2.5, 3.7].flatMap((dz) => Array.from({ length: 23 }, (_, i) => [-5.5 + i * 0.5, -dz, Math.PI])), { y: 0, s: 0.6, pose: "ground", kind: "student", shadow: true, name: "lesserCourtFigures" });
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
    }

    // ---------- labels ----------
    // Rashi on I Kings 6:36: the inner court = עזרת כהנים ועזרת ישראל (Rashi on II Chr 4:9: "העזרה הגדולה. זו עזרת ישראל"); one court in the model, no split
    // 1.0.1-K: over the north-east quarter (was z 48, on לשכת הגזית's label). 1.0.1-L: kept there - tried at z 48 and 26 (pictures from
    // the court's default view): there it hid the label "שער דרומי א" / the altar's label; here it sits between the chamber's label above it
    // and the Sea's below it, all three readable
    lbl("החצר הפנימית (חצר הכהנים ועזרת ישראל)", 70, AZ + 24, -48, 5.5);
    // gate labels: the names are not in the sources - counted from the east, the entrance side (model choice)
    const gN = [["שער צפוני א", 40], ["שער צפוני ב", 0], ["שער צפוני ג", -40]];
    const gS = [["שער דרומי א", 40], ["שער דרומי ב", 0], ["שער דרומי ג", -40]];
    gN.forEach(([n, x]) => lbl(n, x, AZ + 25, CO2.azN - 3, 3.2));
    gS.forEach(([n, x]) => lbl(n, x, AZ + 25, CO2.azS + 3, 3.2));
    lbl("השער המזרחי", CO2.azE + 6, AZ + 25, 0, 3.5);

    // ---------- לשכת הגזית (1.0.1-L, FIXES L.21; the sources are in the header - every place-source describes the Second Temple and none
    // gives a measure, so the place along the wall and every measure are model choices; the numbers are at CRT_GAZIT) ----------
    // On the NORTH wall's east part, opposite the altar ("בצד מזבח"), between the eastern north gate and the Sea in the corner; lengthwise
    // (22 along the wall x 19 across), straddling the wall's centre line: the court half (z -67.5..-58, "בקדש") and the outer half
    // (z -77..-67.5, "בחול"), the line of the court wall across the floor between them. "כמין בסילקי גדולה" (Yoma 25a; Rashi "בית גבוה
    // שעל עלייה"): a tall hall of hewn stone (the chamber's name; Tosafot Yom Tov on Middot 5:4 "והיתה עשויה גזית לכבודם של הסנהדרין"),
    // its floor all at the court's level (Tosafot Yom Tov there "שהלשכה היתה קרקעיתה שוה": the outer half stands on a stone platform built
    // out from the podium). The holy door into the court in the SOUTH wall near its EAST end, the profane door in the NORTH wall near its
    // WEST end with 12 steps down to the great court (Chok Natan; Tosafot Yom Tov "היו מעלות שעליה עולין וממנה יורדין לחול"). In the court
    // half toward the east - "פייס במזרחה" (Rashi "קבוצת היקף המפייסין במזרחה היתה") - a ring set in the floor marks the round where the
    // priests stood for the lots ("והכהנים מוקפין ועומדין כמין (ב)כוליאר"; Rashi "בכוליאר - עגול"; the ring is a model choice: the priests
    // are not modelled); in the outer half toward the west - "וזקן יושב במערבה", "ובחצי של חל היו הסנהדרין יושבין" (Rambam 5:17) - the 71
    // seats (Sanhedrin 1:6) on a half circle ("כחצי גרן עגלה", Sanhedrin 4:3) facing south, toward the court (Tiferet Yisrael "פניהם
    // לדרום ואחוריהן לצפון"), in ONE row since 1.3.5 (CRT_GAZIT_SEATS: small seats on half an oval; until 1.3.4 four rows on rising steps - a
    // model choice, as in 1.0.1-K). Over the middle a raised lantern with windows (Rashi "בית
    // גבוה"; the "עלייה" under it is not modelled). Not modelled: the three rows of disciples sitting on the ground before them (Sanhedrin
    // 4:4; Tiferet Yisrael) and the two scribes standing (Sanhedrin 4:3). 1.0.1-K's two rows of columns in the court half are gone: the
    // smaller hall has no room for them beside the seats and the lots, and Rashi's "בית גבוה שעל עלייה" names no columns.
    try {
      const gx0 = GZ.x0, gx1 = GZ.x1, gz0 = GZ.z0, gz1 = GZ.z1, gt = GZ.T, gh = GZ.H;
      const gcx = (gx0 + gx1) / 2, gcz = CO2.azN;           // 59, -67.5: the court wall's centre line = the line between the two halves
      const podN = -podW / 2;                                // -72.5: the podium's north edge
      const gzStone = stoneC;
      // the outer half's platform (y 0..6, z -77..-72.5) beyond the podium edge and its paving; the 12 steps down from the profane door
      H2.box(g, gx1 - gx0, AZ - 0.15, podN - gz0, M2.stone, gcx, LV2.HAR, (gz0 + podN) / 2);
      H2.box(g, gx1 - gx0, 0.15, podN - gz0, M2.pave, gcx, AZ - 0.15, (gz0 + podN) / 2);
      H2.stairs(g, { width: 4, totalRise: AZ - LV2.HAR, steps: 12, dir: "S", x: GZ.doorOut, y: LV2.HAR, z: gz0 - 12 * STEP, tread: STEP });   // z -83 -> -77, x 50..54
      // "חציה בקדש וחציה בחול": the line of the court wall across the floor (z -70..-65, between the side walls)
      // in a darker smooth stone (model choice), so the two halves read apart: the court's marble to the south, the outer paving to the north
      // GAZIT_MEIRI_137: until 1.3.6 a darker band lay here along the court wall's line (z -70..-65), the halves being north and south.
      // Now ONE FLOOR in the whole hall, and A BRONZE STRIP FROM NORTH TO SOUTH in its middle (x 59.9): the line between the holy half
      // (east) and the unconsecrated half (west), as in the Second Temple's hall. The strip and the floor's stone - model choices.
      H2.box(g, gx1 - gx0 - 2 * gt, 0.03, gz1 - gz0 - 2 * gt, M2.stoneSmooth, gcx, AZ, (gz0 + gz1) / 2).name = "gazitFloor";
      H2.box(g, 0.24, 0.04, gz1 - gz0 - 2 * gt, M2.bronze, gcx, AZ + 0.03, (gz0 + gz1) / 2).name = "gazitHalvesLine";
      // the walls (holes: the holy door 5 x 9 and the profane door 4 x 9 from the floor - 1.0.1-L: a 0.04 sill, so that the hole's bottom face
      // is not coplanar with the floor (it z-fought with the marble / the paving); windows 2 x 3 with the sill 14 above the floor -
      // in the side walls only where the court wall (z -70..-65) does not stand outside them)
      const W = (cs) => cs.map((c) => ({ c, b: 14, w: 2, h: 3 }));
      const WIN = [-8.7, -2.9, 2.9, 8.7];   // 1.0.1-L (A9): evenly along the 23.8
      crt_holedWall(H2, g, gzStone, { axis: "x", length: gx1 - gx0, height: gh, thickness: gt, cx: gcx, cz: gz1 - gt / 2, y: AZ, holes: [{ c: GZ.doorIn - gcx, b: 0.04, w: 5, h: 8.96 }].concat(W(WIN)) });    // south: the door into the court ("פתוח בקדש"), x 63..68
      crt_holedWall(H2, g, gzStone, { axis: "x", length: gx1 - gx0, height: gh, thickness: gt, cx: gcx, cz: gz0 + gt / 2, y: AZ, holes: [{ c: GZ.doorOut - gcx, b: 0.04, w: 4, h: 8.96 }].concat(W(WIN)) });   // north: the door outside ("פתוח בחול"), x 50..54
      // 1.3.5: the hall is no longer centred on the court wall's line (3 deeper to the north): the side walls round the hall's own middle,
      // their windows where the court wall does not stand outside them (z -74.25 and -62.75)
      for (const wx of [gx0 + gt / 2, gx1 - gt / 2]) crt_holedWall(H2, g, gzStone, { axis: "z", length: gz1 - gz0 - 2 * gt, height: gh, thickness: gt, cx: wx, cz: (gz0 + gz1) / 2, y: AZ, holes: W([-74.25 - (gz0 + gz1) / 2, -62.75 - (gz0 + gz1) / 2]) });
      // door leaves (cedar, ajar into the chamber; model choice)
      for (const [dx, dz, w, inward] of [[GZ.doorIn, gz1 - gt / 2, 5, -1], [GZ.doorOut, gz0 + gt / 2, 4, 1]]) for (const s of [-1, 1]) {
        const leaf = new Group();
        const pw = w / 2 - 0.06;
        leaf.position.set(dx + s * w / 2, AZ, dz);
        H2.box(leaf, pw, 8.8, 0.25, M2.cedar, -s * (pw / 2 + 0.03), 0, 0);
        leaf.rotation.y = s * 0.5 * inward;
        g.add(leaf);
      }
      // the roof: a stone slab (y 28..29) around the lantern opening (x 53..65, z -70.75..-64.25 - over the line of the wall) with a
      // cedar ceiling under it, and the lantern ("בית גבוה"): walls 1 thick, 4 high, windows 2 x 1.6, and its own slab (y 33..34)
      const top = AZ + gh, LX0 = 53.9, LX1 = 65.9, LZ0 = -70.75, LZ1 = -64.25;   // 1.0.1-L (A9): round the chamber's new centre x 59.9
      // 1.0.1-L (the user: "תוסיף כפתור פתיחת הגג בלשכות"): the slab, its cedar ceiling and the lantern in one group, lifted only by the pill (a viewing tool)
      const gazitRoof = new Group();
      gazitRoof.name = "gazitRoof";
      g.add(gazitRoof);
      const roofPart = (xa, xb, za, zb) => {
        H2.box(gazitRoof, xb - xa, 1, zb - za, M2.stoneLight, (xa + xb) / 2, top, (za + zb) / 2);
        const ia = Math.max(xa, gx0 + gt), ib = Math.min(xb, gx1 - gt), ja = Math.max(za, gz0 + gt), jb = Math.min(zb, gz1 - gt);
        H2.box(gazitRoof, ib - ia, 0.2, jb - ja, M2.cedar, (ia + ib) / 2, top - 0.2, (ja + jb) / 2);
      };
      roofPart(gx0, gx1, gz0, LZ0);
      roofPart(gx0, gx1, LZ1, gz1);
      roofPart(gx0, LX0, LZ0, LZ1);
      roofPart(LX1, gx1, LZ0, LZ1);
      // the lantern's walls stand on the slab around the opening (x 52..66, z -71.75..-63.25), y 29..33
      const LW = (cs) => cs.map((c) => ({ c, b: 1.2, w: 2, h: 1.6 }));
      for (const lz of [LZ0 - 0.5, LZ1 + 0.5]) crt_holedWall(H2, gazitRoof, M2.stoneLight, { axis: "x", length: LX1 - LX0 + 2, height: 4, thickness: 1, cx: (LX0 + LX1) / 2, cz: lz, y: top + 1, holes: LW([-4.8, -1.6, 1.6, 4.8]) });
      for (const lx of [LX0 - 0.5, LX1 + 0.5]) crt_holedWall(H2, gazitRoof, M2.stoneLight, { axis: "z", length: LZ1 - LZ0, height: 4, thickness: 1, cx: lx, cz: (LZ0 + LZ1) / 2, y: top + 1, holes: LW([-1.6, 1.6]) });
      H2.box(gazitRoof, LX1 - LX0 + 2, 1, LZ1 - LZ0 + 2, M2.stoneLight, (LX0 + LX1) / 2, top + 5, (LZ0 + LZ1) / 2);
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({
        id: "crt-gazit-roof",
        label: "פתח את גג הלשכה",
        labelOn: "החזר את הגג",
        title: "מסיר לרגע את גג לשכת הגזית, לצפייה בלבד, ומעביר את המבט מלמעלה אל תוך הלשכה: הסנהדרין כחצי גורן, שני הסופרים ושלוש שורות התלמידים.",
        anchor: [(LX0 + LX1) / 2, top + 8, (LZ0 + LZ1) / 2],
        maxDist: 170,
        get: () => !gazitRoof.visible,
        under: () => !!(ctx.shared.camUnder && ctx.shared.camUnder(gazitRoof.children.length ? gazitRoof.children : [gazitRoof])),   // 1.3.4: not closed over the eye
        set: (on) => {
          gazitRoof.visible = !on;
          if (on) {
            const fly = ctx.ui && typeof ctx.ui.fly === "function" ? ctx.ui.fly : typeof ctx.flyTo === "function" ? ctx.flyTo : null;
            if (fly) fly([(LX0 + LX1) / 2 + 8, top + 42, (LZ0 + LZ1) / 2 + 26], [(LX0 + LX1) / 2, AZ + 2, (LZ0 + LZ1) / 2]);
          }
        }
      });
      // 1.3.7: no ring of the lots (see CRT_GAZIT_SEATS above)
      // 1.3.5: THE 71 SEATS IN ONE ROW (CRT_GAZIT_SEATS; the sources there): cedar, each 0.34 wide x 0.4 deep, 0.45 high, with a back,
      // evenly along half an oval that lies on the north (outer) side, every seat turned square to the row (its front to the inside), so
      // the middle seats face south - "פניהם לדרום ואחוריהן לצפון" (Tiferet Yisrael)
      const SX = CRT_GAZIT_SEATS.x, SZ = CRT_GAZIT_SEATS.z, SA = CRT_GAZIT_SEATS.a, SB = CRT_GAZIT_SEATS.b;
      {
        const parts = [];
        const s = new BoxGeometry(0.4, 0.45, 0.34);
        s.translate(0, 0.225, 0);
        parts.push(s);
        const b = new BoxGeometry(0.07, 0.55, 0.34);
        b.translate(-0.165, 0.45 + 0.275, 0);
        parts.push(b);
        const seat = mergeGeometries(parts);
        // GAZIT_MEIRI_137: n points evenly spaced by length along the half oval that opens to the east, t 0 (its north end) .. PI (its south end)
        const N = 720, acc = [0], n = CRT_GAZIT_SEATS.n;
        let px = 0, pz = SA;
        for (let i = 1; i <= N; i++) { const t = Math.PI * i / N, x = SB * Math.sin(t), z = SA * Math.cos(t); acc.push(acc[i - 1] + Math.hypot(x - px, z - pz)); px = x; pz = z; }
        const inst = new InstancedMesh(seat, M2.cedar, n);
        for (let k = 0, j = 0; k < n; k++) {
          const want = acc[N] * (k + 0.5) / n;
          while (j < N - 1 && acc[j + 1] < want) j++;
          const t = Math.PI * (j + (want - acc[j]) / Math.max(1e-9, acc[j + 1] - acc[j])) / N;
          const nx = Math.sin(t) / SB, nz = Math.cos(t) / SA;             // the oval's inward normal (x, z) at t
          const m = new Matrix4().makeRotationY(Math.atan2(-nz, nx));     // the seat's front (+x) along it
          m.setPosition(SX - SB * Math.sin(t), AZ, SZ - SA * Math.cos(t));
          inst.setMatrixAt(k, m);
        }
        inst.instanceMatrix.needsUpdate = true;
        inst.castShadow = false;
        inst.receiveShadow = true;
        inst.name = "sanhedrinSeats";
        g.add(inst);
      }
      // 1.3.5 (the user, 10.11.2026 22:08: "את השינויים בלשכת הגזית תעתיק גם לבית ראשון"): AS IN THE SECOND TEMPLE'S HALL - small figures (the
      // First Temple's model had none until now; the user was told): a judge on each of the 71 seats, the one in the middle marked
      // (the Second Temple's card: "הנשיא באמצע" - a model's statement); THE THREE ROWS OF STUDENTS - Sanhedrin 4:4 "ושלש שורות של תלמידי
      // חכמים יושבין לפניהם", 23 each (Rashi 37a, book 2180, line 1781) - in two readings, ctx.shared.sanhedrinRows.set("round" |
      // "straight"): Rashi 37a (line 1782) "אף הן כעגולה, אלא שהגדולים יושבין על הספסלין והתלמידים על הקרקע" - the default; the Yad Ramah
      // (book 1957, line 564) "שורות פשוטות היו ולא בעיגול"; and THE TWO SCRIBES standing before the judges, one at the right and one at
      // the left (4:3). The figures, their sizes and the gaps between the rows - model choices. The names inside show with the roof open.
      {
        const PPG = tm_people(ctx);   // PEOPLE_KIT_204 (1.3.7): sitting men in black robes and kippot (1.3.5-1.3.6: pegs with a ball for a head)
        // n points evenly spaced by length on the half oval (a north-south, b to the west) round (SX, SZ), from t0 to t1 (0 = the north end, PI = the south end)
        const ovalPts = (a, b, n, t0, t1) => {
          const N = 720, acc = [0];
          let px = b * Math.sin(t0), pz = a * Math.cos(t0);
          for (let i = 1; i <= N; i++) { const t = t0 + (t1 - t0) * i / N, x = b * Math.sin(t), z = a * Math.cos(t); acc.push(acc[i - 1] + Math.hypot(x - px, z - pz)); px = x; pz = z; }
          const out = [];
          for (let k = 0, j = 0; k < n; k++) {
            const want = acc[N] * (k + 0.5) / n;
            while (j < N - 1 && acc[j + 1] < want) j++;
            const t = t0 + (t1 - t0) * (j + (want - acc[j]) / Math.max(1e-9, acc[j + 1] - acc[j])) / N;
            out.push([SX - b * Math.sin(t), SZ - a * Math.cos(t)]);
          }
          return out;
        };
        // PEOPLE_KIT_204: a judge on each seat, his face as the seat's; the one in the middle a little larger; the beards white by
        // him, grey further and black-brown at the row's two ends ("יושבין לפניו כפי שניהם וכפי מעלתם", the Rambam, Sanhedrin 1:3)
        PPG.crowd(g, PPG.facing(ovalPts(SA, SB, CRT_GAZIT_SEATS.n, 0, Math.PI), [SX, SZ], false), { y: AZ + 0.45, s: 0.62, pose: "bench", seat: 0.45, kind: "judge", tone: PPG.age(CRT_GAZIT_SEATS.n), big: (CRT_GAZIT_SEATS.n - 1) / 2, name: "sanhedrinFigures" });
        const stRound = new Group(), stStraight = new Group();
        stRound.name = "sanhedrinStudentsRound";
        stStraight.name = "sanhedrinStudentsStraight";
        stStraight.visible = false;
        g.add(stRound);
        g.add(stStraight);
        // the students sit on the ground, their faces to the judges ("יושבין לפניהם"): no beards, a kippah and peyot (the user, 12.11.2026 01:42)
        PPG.crowd(stRound, [1.9, 3.2, 4.5].flatMap((d) => PPG.facing(ovalPts(SA - d, SB - d, 23, 0.1 * Math.PI, 0.9 * Math.PI), [SX, SZ], true)), { y: AZ, s: 0.58, pose: "ground", kind: "student", name: "sanhedrinFigures" });
        PPG.crowd(stStraight, [1.7, 3.0, 4.3].flatMap((dx) => Array.from({ length: 23 }, (_, i) => [SX - dx, SZ - 6.6 + i * 0.6, -Math.PI / 2])), { y: AZ, s: 0.58, pose: "ground", kind: "student", name: "sanhedrinFigures" });   // GAZIT_MEIRI_137: north-south
        ctx.shared.sanhedrinRows = { mode: "round", set(m) { this.mode = m === "straight" ? "straight" : "round"; stRound.visible = this.mode === "round"; stStraight.visible = this.mode === "straight"; const LS = ctx.shared.lesserStudents; if (LS) { for (const x of LS.rounds) x.visible = this.mode === "round"; for (const x of LS.straights) x.visible = this.mode === "straight"; } return this.mode; } };   // 1.3.7: the lesser chambers' rows too
        // the two scribes of the judges, standing in the half circle before them
        PPG.crowd(g, [-2.6, 2.6].map((sx) => [SX - 0.6, SZ + sx, -Math.PI / 2]), { y: AZ, s: 0.62, pose: "stand", kind: "scribe", tone: () => 1, name: "sanhedrinScribe" });   // their faces to the judges, a tablet in the hand ("וכותבין")
        // the names inside: a layer that goes with the open roof (the pill "crt-gazit-roof")
        const gazitIn = new Group();
        gazitIn.name = "gazitInside";
        gazitIn.visible = false;
        g.add(gazitIn);
        ctx.layers = ctx.layers || {};
        ctx.layers.gazitInside = gazitIn;
        const rb = (ctx.shared.modelButtons || []).find((b) => b && b.id === "crt-gazit-roof");
        if (rb) { const set0 = rb.set; rb.set = (on) => { set0(on); gazitIn.visible = !!on; }; }
        ctx.labels.push(
          { text: "הסנהדרין הגדולה — שבעים ואחד בשורה אחת, כחצי גורן", x: SX - SB + 1.6, y: AZ + 5.6, z: SZ, size: 1.8, layer: "gazitInside" },
          { text: "הנשיא", x: SX - SB - 0.2, y: AZ + 2.6, z: SZ, size: 1.1, layer: "gazitInside" },
          { text: "סופרי הדיינין", x: SX - 0.6, y: AZ + 3.3, z: SZ, size: 1, layer: "gazitInside" },
          { text: "שלוש שורות של תלמידי חכמים", x: SX - 3.6, y: AZ + 2.2, z: SZ, size: 1, layer: "gazitInside" },
          { text: "חצי החול — במערב", x: gx0 + gt + 4.6, y: AZ + 7.6, z: gz1 - gt - 2.2, size: 1.2, layer: "gazitInside" },   // GAZIT_MEIRI_137
          { text: "חצי הקודש — במזרח", x: gx1 - gt - 4.6, y: AZ + 4.2, z: (gz0 + gz1) / 2, size: 1.2, layer: "gazitInside" }
        );
      }
      // the label: Yoma 19a + the Rambam for the side, Yoma 25a for the two halves (FIXES L.21)
      // (y 46: 12 above the lantern, so from the court's default view it clears the row of the north gates' labels at y 31)
      lbl("לשכת הגזית (יומא יט.; רמב״ם בית הבחירה ה, יז; יומא כה.)", gcx, top + 18, gcz, 4);
      ctx.shared.flyPoints = ctx.shared.flyPoints || {};
      // inside, high over the court half (20.5 above the floor, under the cedar ceiling at 27.8), looking down north-east: the lots' ring on the
      // right, whole (1.0.1-L: from over the holy door it stood half under the frame's edge), the line of the wall across the floor, the 71
      // seats facing the camera beyond it (model choice). The camera stands 6.4 from the target across the floor, so the turn buttons keep it
      // inside the room (the inner faces x 49.5..68.5, z -75.5..-59.5) at every step
      ctx.shared.flyPoints.lishkatHaGazit = { pos: [44, AZ + 11, -40], target: [62, AZ + 3, -64] };   // 1.2.0 (the user: the angle): from the court, south-west, low (the Sea stands east of it)   // 1.0.1-L (A9): 1.2 east, with the ring
      // outside (a second view for the UI, optional): high over the outer court's corner, 136 from the chamber's nearest corner - beyond the
      // walls' fade reach along the view (70-ui.js: 120), so the chamber stays solid - aimed at the court floor 11 in front of it: the
      // chamber on the north wall beside the gate, the Sea in its corner, the altar
      ctx.shared.flyPoints.lishkatHaGazitOut = { pos: [135, 80, 50], target: [60, 12, -48] };
      ctx.shared.lishkatHaGazit = {
        x0: gx0, x1: gx1, z0: gz0, z1: gz1, y: AZ, side: "north", seats: 71,
        seatRow: { n: CRT_GAZIT_SEATS.n, a: SA, b: SB }, seatsCentre: [SX, SZ],   // 1.3.5: one row on half an oval (was seatRows, four)
        boundaryX: [gcx - 0.12, gcx + 0.12],   // 1.3.7: the strip between the east and the west halves (until 1.3.6 boundaryZ, the wall's line)
        doors: { court: [GZ.doorIn, gz1], outside: [GZ.doorOut, gz0] },
        stairs: { x: GZ.doorOut, z0: gz0 - 12 * STEP, z1: gz0, width: 4 }
      };
    } catch (e) {
      console.warn("[courts] לשכת הגזית skipped", e);
    }

    // ---------- בית המטבחים (1.0.1-L, FIXES L.68; the sources in the header, the numbers and their reasons at CRT_SLAUGHTER) ----------
    try {
      const SL = CRT_SLAUGHTER, scx = (SL.x0 + SL.x1) / 2;   // 49.5: the altar's axis
      const bronzeSl = M2.bronze.clone();                     // the rings: bronze (model choice - no source names their metal)
      bronzeSl.roughness = 0.4;
      const ironSl = new MeshStandardMaterial({ color: 0x3a3a3e, roughness: 0.5, metalness: 0.7 });   // "אנקליות של ברזל": dark grey iron
      const mat4 = new Matrix4();
      // 1.0.1-L (A5, A6): what differs between the layouts stands in a group of its own; the rings are common to the three
      const layG = {};
      for (const key of ["book", "meiri", "oneRow"]) {
        layG[key] = new Group();
        layG[key].name = "slaughterLayout-" + key;
        layG[key].visible = key === "book";
        g.add(layG[key]);
      }
      const inst = (geo, mat, places, name, shadow = true, parent = g) => {
        const im = new InstancedMesh(geo, mat, places.length);
        places.forEach((p, i) => { mat4.makeTranslation(p[0], p[1], p[2]); im.setMatrixAt(i, mat4); });
        im.instanceMatrix.needsUpdate = true;
        im.castShadow = shadow;
        im.receiveShadow = true;
        im.name = name;
        parent.add(im);
        return im;
      };
      // the 24 rings: a bronze arch (half a torus standing in the x-y plane, so the neck of the animal lying north-south - "ראשו לדרום",
      // Tamid 4:1 - passes under it) with a round foot at each end sunk in the floor
      const ringGeo = mergeGeometries([
        new TorusGeometry(SL.ringR, SL.ringTube, 8, 20, Math.PI),
        new CylinderGeometry(0.13, 0.13, 0.08, 12).translate(-SL.ringR, 0.04, 0),
        new CylinderGeometry(0.13, 0.13, 0.08, 12).translate(SL.ringR, 0.04, 0)
      ]);
      const ringAt = [];
      for (const rz of SL.ringRows) for (const rx of SL.ringCols) ringAt.push([rx, AZ, rz]);
      inst(ringGeo, bronzeSl, ringAt, "slaughterRings");
      // the eight marble tables: a slab on four legs, two lines of four running north-south
      const tw = SL.tableW, td = SL.tableD, th = SL.tableH, legW = 0.2, slab = 0.25;
      const tableParts = [H2.uvWorldBox(new BoxGeometry(tw, slab, td), tw, slab, td).translate(0, th - slab / 2, 0)];
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) tableParts.push(H2.uvWorldBox(new BoxGeometry(legW, th - slab, legW), legW, th - slab, legW).translate(sx * (tw / 2 - legW / 2 - 0.1), (th - slab) / 2, sz * (td / 2 - legW / 2 - 0.1)));
      const tableAt = [];
      for (const tz of SL.tableRows) for (const tx of SL.tableCols) tableAt.push([tx, AZ, tz]);
      const tableGeo = mergeGeometries(tableParts);
      inst(tableGeo, M2.marble, tableAt, "slaughterTables", true, layG.book);
      inst(tableGeo, M2.marble, tableAt, "slaughterTables-meiri", true, layG.meiri);
      // the eight short stone pillars, the squared cedar posts on them, and the iron hooks: nine on each post - three rows (1.0.1-L, A7: 1.7 / 2.6 / 3.5
      // above the floor) on the east, north and south faces; each hook a rod out of the face with an upturned tip
      const pillarAt = [];
      for (const pz of SL.pillarRows) for (const px of SL.pillarCols) pillarAt.push([px, AZ, pz]);
      inst(H2.uvWorldBox(new BoxGeometry(SL.pillarW, SL.pillarH, SL.pillarW), SL.pillarW, SL.pillarH, SL.pillarW).translate(0, SL.pillarH / 2, 0), M2.stoneSmooth, pillarAt, "slaughterPillars", true, layG.book);
      inst(H2.uvWorldBox(new BoxGeometry(SL.postW, SL.postH, SL.postW), SL.postW, SL.postH, SL.postW).translate(0, SL.pillarH + SL.postH / 2, 0), M2.cedar, pillarAt, "slaughterPosts", true, layG.book);
      const hookParts = [], rodL = 0.32, tipL = 0.2, hr = 0.035;
      for (const [dx, dz] of [[1, 0], [0, -1], [0, 1]]) for (const hy of SL.hookY) {          // the east, north and south faces
        const rod = new CylinderGeometry(hr, hr, rodL, 8);
        if (dx) rod.rotateZ(Math.PI / 2); else rod.rotateX(Math.PI / 2);                        // the rod along x or along z
        rod.translate(dx * (SL.postW / 2 + rodL / 2 - 0.02), hy, dz * (SL.postW / 2 + rodL / 2 - 0.02));
        hookParts.push(rod);
        hookParts.push(new CylinderGeometry(hr, hr, tipL, 8).translate(dx * (SL.postW / 2 + rodL - 0.02), hy + tipL / 2 - hr, dz * (SL.postW / 2 + rodL - 0.02)));
      }
      const hookGeo = mergeGeometries(hookParts);
      // 1.3.4 (the user, 10.11.2026: "תוסיף כפתור לאונקליות"; as the Second Temple plugin 1.9.2): every hooks' instance has a twin in a
      // floating colour, lit by the button "האונקליות" (below) for 15 s
      const glowM = new MeshBasicMaterial({ color: 0xffc23a, transparent: true, opacity: 0.95, depthTest: false, depthWrite: false });
      const glows = [], m4g = new Matrix4();
      const twin = (im) => {
        const tw = new InstancedMesh(im.geometry, glowM, im.count);
        for (let i = 0; i < im.count; i++) { im.getMatrixAt(i, m4g); tw.setMatrixAt(i, m4g); }
        tw.instanceMatrix.needsUpdate = true;
        tw.renderOrder = 30;
        tw.visible = false;
        tw.name = im.name + "-glow";
        im.parent.add(tw);
        glows.push(tw);
        return im;
      };
      twin(inst(hookGeo, ironSl, pillarAt, "slaughterHooks", false, layG.book));
      // 1.0.1-L (A5, A6): the Meiri's layout - the same places, a taller stone, short beams from pillar to pillar along each row, hooks on the beams
      {
        const BM = CRT_SLAUGHTER_BEAM, by = BM.pillarH, span = SL.pillarCols[1] - SL.pillarCols[0];
        inst(H2.uvWorldBox(new BoxGeometry(SL.pillarW, by, SL.pillarW), SL.pillarW, by, SL.pillarW).translate(0, by / 2, 0), M2.stoneSmooth, pillarAt, "slaughterPillars-meiri", true, layG.meiri);
        const beamAt = [], beamHookAt = [];
        for (const pz of SL.pillarRows) for (let i = 0; i + 1 < SL.pillarCols.length; i++) {
          beamAt.push([SL.pillarCols[i] + span / 2, AZ, pz]);
          for (let k = 1; k <= BM.hooksPerSpan; k++) beamHookAt.push([SL.pillarCols[i] + k * span / (BM.hooksPerSpan + 1), AZ, pz]);
        }
        inst(H2.uvWorldBox(new BoxGeometry(span - 0.04, BM.beamH, BM.beamW), span - 0.04, BM.beamH, BM.beamW).translate(0, by + BM.beamH / 2, 0), M2.cedar, beamAt, "slaughterBeams", true, layG.meiri);
        // one hook on each side and one under the beam ("בשני הצדדים ושטח התחתון")
        const parts = [];
        for (const dz of [-1, 1]) {
          const hy = by + BM.beamH / 2;
          parts.push(new CylinderGeometry(hr, hr, rodL, 8).rotateX(Math.PI / 2).translate(0, hy, dz * (BM.beamW / 2 + rodL / 2 - 0.02)));
          parts.push(new CylinderGeometry(hr, hr, tipL, 8).translate(0, hy + tipL / 2 - hr, dz * (BM.beamW / 2 + rodL - 0.02)));
        }
        parts.push(new CylinderGeometry(hr, hr, rodL, 8).translate(0, by - rodL / 2 + 0.02, 0));
        parts.push(new CylinderGeometry(hr, hr, tipL, 8).rotateX(Math.PI / 2).translate(0, by - rodL + 0.02, tipL / 2));
        twin(inst(mergeGeometries(parts), ironSl, beamHookAt, "slaughterHooks-meiri", false, layG.meiri));
      }
      // 1.0.1-L (A5, A6): the Ra'avyah's and the Gra's layout - one east-west row, a table in each gap and the eighth beyond the east end
      {
        const R = CRT_SLAUGHTER_ROW, tw2 = R.tableW, td2 = R.tableD;
        const rowAt = R.cols.map((x) => [x, AZ, R.z]);
        const t2 = [H2.uvWorldBox(new BoxGeometry(tw2, slab, td2), tw2, slab, td2).translate(0, th - slab / 2, 0)];
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) t2.push(H2.uvWorldBox(new BoxGeometry(legW, th - slab, legW), legW, th - slab, legW).translate(sx * (tw2 / 2 - legW / 2 - 0.05), (th - slab) / 2, sz * (td2 / 2 - legW / 2 - 0.1)));
        const rowTables = [];
        for (let i = 0; i + 1 < R.cols.length; i++) rowTables.push([(R.cols[i] + R.cols[i + 1]) / 2, AZ, R.z]);
        rowTables.push([R.tableExtraX, AZ, R.z]);
        inst(mergeGeometries(t2), M2.marble, rowTables, "slaughterTables-oneRow", true, layG.oneRow);
        inst(H2.uvWorldBox(new BoxGeometry(SL.pillarW, SL.pillarH, SL.pillarW), SL.pillarW, SL.pillarH, SL.pillarW).translate(0, SL.pillarH / 2, 0), M2.stoneSmooth, rowAt, "slaughterPillars-oneRow", true, layG.oneRow);
        inst(H2.uvWorldBox(new BoxGeometry(SL.postW, SL.postH, SL.postW), SL.postW, SL.postH, SL.postW).translate(0, SL.pillarH + SL.postH / 2, 0), M2.cedar, rowAt, "slaughterPosts-oneRow", true, layG.oneRow);
        twin(inst(hookGeo, ironSl, rowAt, "slaughterHooks-oneRow", false, layG.oneRow));
      }
      // the switch (1.0.1-L, A5, A6): the UI's opinion row sets it; default "book"
      ctx.shared.slaughterLayout = {
        current: "book",
        keys: ["book", "meiri", "oneRow"],
        names: { book: "כציור הספר — חתיכת ארז על כל עמוד", meiri: "המאירי — קורות מעמוד לעמוד", oneRow: "ראבי״ה והגר״א — שורה אחת" },
        set(key) {
          if (!layG[key]) return this.current;
          this.current = key;
          for (const k of this.keys) layG[k].visible = k === key;
          return key;
        }
      };
      // 1.3.4: THE BUTTON "האונקליות" by the pillars - the eye comes close and the hooks of the layout shown are lit in a floating colour for
      // 15 s, with the Mishnah's words (Middot 3:5); ctx.shared.onkliot(on, noFly) - the opinions row lights them too, without its own flight
      {
        const lg = new Group();
        lg.visible = false;
        g.add(lg);
        ctx.layers.onkGlow = lg;
        ctx.labels.push({ text: "״ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין״ (מדות ג, ה)", x: scx, y: AZ + 6.6, z: -46.5, size: 1.1, layers: ["onkGlow"] });
        const ON = { on: false, timer: null };
        const glowSet = (on) => { ON.on = !!on; for (const t of glows) t.visible = ON.on; lg.visible = ON.on; };
        ctx.shared.onkliot = (on, noFly) => {
          clearTimeout(ON.timer);
          glowSet(on !== false);
          if (!ON.on) return;
          const fly = ctx.ui && typeof ctx.ui.fly === "function" ? ctx.ui.fly : typeof ctx.flyTo === "function" ? ctx.flyTo : null;
          if (fly && !noFly) fly([scx, AZ + 10.5, -36.5], [scx, AZ + 2.5, -53.5]);   // from the south, over the tables: all the pillars
          ON.timer = setTimeout(() => glowSet(false), 15000);
        };
        ctx.shared.modelButtons = ctx.shared.modelButtons || [];
        ctx.shared.modelButtons.push({
          id: "crt-onkliot", label: "האונקליות", labelOn: "כבה את הסימון", maxDist: 70,
          title: "״ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין״ (מדות ג, ה) — המבט מתקרב, והאונקליות מסומנות בצבע צף ל־15 שניות, בשיטה שנבחרה בשורה ״בית המטבחים״.",
          anchor: () => {
            const p = ctx.camera && ctx.camera.position;
            return p && p.x > SL.x0 - 30 && p.x < SL.x1 + 50 && p.z < 10 && p.z > -100 && p.y < AZ + 70 ? [SL.pillarCols[SL.pillarCols.length - 1] + 1.6, AZ + 4.9, -53.5] : null;
          },
          get: () => ON.on,
          set: (on) => ctx.shared.onkliot(!!on)
        });
      }
      // labels (their texts are keys of the UI's LABEL_MAP). 1.0.1-L: placed from the views (headless projection with the UI's label scaling):
      // from the fly point they cover no ring, table or pillar, and in the court's default view they do not lie on the altar's or the Sea's
      // label (at x 49.5, y 13 the first one lay on "מזבח הנחושת"; at x 41.5, y 8.6 the second stood at the demonstration's stop and the
      // cedar posts hid its first word)
      lbl("בית המטבחים — הטבעות (מדות ג, ה; ה, ב; תמיד ד, א)", 56 + CRT_DX, AZ + 12, -14, 2.8);
      lbl("שלחנות השיש (שקלים ו, ד; מדות ג, ה)", 40 + CRT_DX, AZ + 9, -39, 2.4);
      lbl("הננסין (מדות ג, ה; תמיד ג, ה)", 60 + CRT_DX, AZ + 14, -50, 2.6);
      ctx.shared.flyPoints = ctx.shared.flyPoints || {};
      // the whole place from the south-south-east, high: the rows of rings nearly level on the screen, all 24 arches, the two lines of tables,
      // the two rows of pillars, the altar's north edge at the bottom, the chamber's face at the top and the Sea in its corner on the right
      // ("מול השולחנות והטבעות"). 46 above the floor, y 52, above the house's top (47.5), so the UI's turn buttons never put the camera
      // inside a solid (checked headless)
      ctx.shared.flyPoints.slaughterPlace = { pos: [66 + CRT_DX, AZ + 46, -2], target: [58 + CRT_DX, AZ + 1, -36] };
      // close: from the south over the rings, 6.5 above the floor (above the cedar posts): the arches in front, the two lines of tables, both
      // rows of pillars with their hooks, the chamber's face behind them (the turn buttons' circle, 13.2 across the floor, stays clear of it)
      ctx.shared.flyPoints.slaughterPlaceClose = { pos: [52, AZ + 6.5, -31], target: [scx, AZ + 3, -44] };
      const altarN = CO2.altarZ - CO2.ALTAR / 2;   // -10: the altar's north face
      const wallIn = CO2.azN + T / 2, pR = SL.pillarRows;   // -65: the court wall's inner face
      ctx.shared.slaughterPlace = {
        x0: SL.x0, x1: SL.x1, z0: pR[1] - 1, z1: SL.ringsZ0, y: AZ, axisX: scx,
        rings: { rows: SL.ringRows.slice(), cols: SL.ringCols.slice(), r: SL.ringR, place: [SL.ringsZ0, SL.ringsZ1], secondRing: { morning: [SL.ringCols[0], SL.ringRows[1]], evening: [SL.ringCols[3], SL.ringRows[1]] } },
        tables: { rows: SL.tableRows.slice(), cols: SL.tableCols.slice(), size: [SL.tableW, SL.tableH, SL.tableD], middleZ: SL.tablesZ },
        pillars: { rows: pR.slice(), z: pR[0], cols: SL.pillarCols.slice(), h: SL.pillarH, postH: SL.postH, hookY: SL.hookY.slice(), topY: AZ + SL.pillarH + SL.postH },
        distances: { altarToRings: altarN - SL.ringsZ0, ringsPlace: SL.ringsZ0 - SL.ringsZ1, ringsToTables: SL.ringsZ1 - SL.tablesZ, tablesToPillars: SL.tablesZ - pR[0], pillarsPlace: pR[0] - pR[1], pillarsToWall: pR[1] - wallIn, lastRowToGazit: pR[1] - GZ.z1 }
      };
    } catch (e) {
      console.warn("[courts] בית המטבחים skipped", e);
    }

    // ---------- fly points and shared data ----------
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    Object.assign(ctx.shared.flyPoints, {
      azarah: { pos: [150, 105, 150], target: [20, 15, 0] },
      innerEastGate: { pos: [168, 27, 42], target: [CO2.azE + 2, AZ + 8, 0] } // from the outer court (החצר החיצונה), looking west at the east gate
    });
    ctx.shared.gates = Object.assign(ctx.shared.gates || {}, {
      innerN: CRT_NS_GATES.map((x) => ({ x, z: CO2.azN })),
      innerS: CRT_NS_GATES.map((x) => ({ x, z: CO2.azS })),
      innerE: { x: CO2.azE, z: 0 }
    });
    ctx.shared.innerCourt = { x0: CO2.azW, x1: CO2.azE, z0: CO2.azN, z1: CO2.azS, y: AZ, wallH: WH, wallT: T };
    // 1.3.3 (from the Second Temple plugin 1.5.0; the user's list: "תחומים שנדלקים על הרצפה"): THE COURTS' ZONES - a translucent patch and a
    // bright frame on the floor, lit for 15 s by their places (ctx.shared.zones.<key>, a feature of 70-ui.js), each with its label: the inner
    // court, "החצר הפנימית" (I Kings 6:36) = "חצר הכהנים" (II Chr 4:9), 187 x 135 as in the model; the great court, "העזרה הגדולה" (II Chr 4:9)
    // = "החצר הגדולה" (I Kings 7:12), the platform within its wall; the outer court, "החצר החיצונה (החצר החדשה)". The measures are the model's
    // (model choices, as each place's card says); the colours - the Second Temple plugin's.
    {
      ctx.shared.zones = ctx.shared.zones || {};
      ctx.layers = ctx.layers || {};
      const zone = (key, x0, x1, z0, z1, y, color, text, size) => {
        const grp = new Group();
        grp.visible = false;
        grp.name = key;
        const pm = new MeshBasicMaterial({ color, transparent: true, opacity: 0.3, depthWrite: false });
        const patch = new Mesh(new BoxGeometry(x1 - x0, 0.04, z1 - z0), pm);
        patch.position.set((x0 + x1) / 2, y + 0.07, (z0 + z1) / 2);
        patch.userData.noPick = true;
        patch.renderOrder = 2;
        grp.add(patch);
        const fm = new MeshBasicMaterial({ color });
        const bar = (w, d, x, z) => { const b = new Mesh(new BoxGeometry(w, 0.22, d), fm); b.position.set(x, y + 0.11, z); b.userData.noPick = true; grp.add(b); };
        bar(x1 - x0, 0.6, (x0 + x1) / 2, z0); bar(x1 - x0, 0.6, (x0 + x1) / 2, z1); bar(0.6, z1 - z0, x0, (z0 + z1) / 2); bar(0.6, z1 - z0, x1, (z0 + z1) / 2);
        ctx.root.add(grp);
        ctx.layers[key] = grp;
        ctx.shared.zones[key] = { key, on: false, get() { return grp.visible; }, set(v) { this.on = !!v; grp.visible = this.on; } };
        ctx.labels.push({ text, x: (x0 + x1) / 2, y: y + 3, z: (z0 + z1) / 2, size: size || 3, layer: key });
      };
      const az = CO2.AZ_L / 2, aw = CO2.AZ_W / 2;
      zone("zoneInner", -az, az, -aw, aw, AZ, 0xffb13a, "החצר הפנימית — חצר הכהנים (מלכים א ו, לו; דברי הימים ב ד, ט)", 4);
      zone("zoneGreat", CO2.harW, CO2.harE, CO2.harN, CO2.harS, LV2.HAR, 0x3aa0ff, "החצר הגדולה — העזרה הגדולה (מלכים א ז, יב; דברי הימים ב ד, ט)", 6);
      if (typeof MNT_WC_SIZE === "number") zone("zoneOuter", CO2.azE, CO2.azE + MNT_WC_SIZE, -MNT_WC_SIZE / 2, MNT_WC_SIZE / 2, LV2.HAR + (typeof MNT_WC_Y === "number" ? MNT_WC_Y : 3), 0xc07aff, "החצר החיצונה — החצר החדשה (דברי הימים ב כ, ה)", 4);
    }
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
        get occlude() { return gk.visible ? false : undefined; },   // TOUR_FIX_137: while it is off a wall hides it (it showed inside the heichal)
        get maxDist() { return gk.visible ? 5000 : 320; },
        get: () => gk.visible,
        set: (on) => { gk.visible = !!on; }
      });
    } catch (e) {
      console.warn("[courts] משמרות השוערים skipped", e);
    }
  }
