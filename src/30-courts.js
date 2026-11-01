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
  var CRT_GAZIT = { x0: 48, x1: 71.8, z0: -77, z1: -58, T: 1.5, H: 22, doorIn: 67.3, doorOut: 52 };
  // the 71 seats (Sanhedrin 1:6) in a half circle round (x 58.25, the wall's centre line z -67.5), facing south: four rows (r = radius of
  // the seats' centres, n = seats, base = the step under the row; model choice: seats 0.8 wide, 1.0..1.06 amah apart - a person's seat -
  // so the half circle, 15.5 across and 7.75 deep, fits the outer half (inner faces x 49.5..68.5, z to -75.5) with a passage 1 wide along
  // the west wall from the profane door and 2.5 along the east wall); the lots' ring in the court half toward the east (x 64.5, z -62.25,
  // radius 1.8, before the holy door)
  var CRT_GAZIT_SEATS = { x: 58.25, rows: [[4.2, 13, 0], [5.25, 16, 0.4], [6.3, 19, 0.8], [7.35, 23, 1.2]] };
  var CRT_GAZIT_LOTS = { x: 66.3, z: -62.25, r: 1.8 };   // 1.0.1-L (A9): was x 64.5
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
  var CRT_SLAUGHTER_ROW = { z: -50, cols: [40.75, 43.25, 45.75, 48.25, 50.75, 53.25, 55.75, 58.25], tableExtraX: 59.5, tableW: 1, tableD: 2 };
  var CRT_SLAUGHTER_BEAM = { pillarH: 3.4, beamH: 0.6, beamW: 0.6, hooksPerSpan: 3 };
  var CRT_SLAUGHTER = {
    x0: 39.5, x1: 59.5, ringsZ0: -18, ringsZ1: -42, tablesZ: -46,
    ringRows: [-20, -24, -28, -32, -36, -40], ringCols: [43.5, 47.5, 51.5, 55.5], ringR: 0.55, ringTube: 0.07,
    tableRows: [-43.75, -45.25, -46.75, -48.25], tableCols: [47.5, 51.5], tableW: 2, tableD: 1, tableH: 1.5,
    pillarRows: [-50, -57], pillarCols: [43.5, 47.5, 51.5, 55.5], pillarW: 1, pillarH: 1.4, postW: 0.8, postH: 2.6, hookY: [1.7, 2.6, 3.5]   // 1.0.1-L (A7): were 2, 3.5, [3, 4, 5]
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
    H2.stairs(g, { width: SW, totalRise: AZ - wcY, steps: eSteps, dir: "W", x: podL / 2 + eSteps * STEP, y: wcY, z: 0, tread: STEP }); // x 101.5 -> 98.5

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
    // לדרום ואחוריהן לצפון"), in four rows on rising steps (CRT_GAZIT_SEATS; one row of 71 would need a radius of 22.6 - the rows are a
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
      const lineMat = M2.stoneSmooth.clone();
      lineMat.color.setHex(0xa8a296);
      H2.box(g, gx1 - gx0 - 2 * gt, 0.04, T, lineMat, gcx, AZ, gcz).name = "gazitWallLine";
      // the walls (holes: the holy door 5 x 9 and the profane door 4 x 9 from the floor - 1.0.1-L: a 0.04 sill, so that the hole's bottom face
      // is not coplanar with the floor (it z-fought with the marble / the paving); windows 2 x 3 with the sill 14 above the floor -
      // in the side walls only where the court wall (z -70..-65) does not stand outside them)
      const W = (cs) => cs.map((c) => ({ c, b: 14, w: 2, h: 3 }));
      const WIN = [-8.7, -2.9, 2.9, 8.7];   // 1.0.1-L (A9): evenly along the 23.8
      crt_holedWall(H2, g, gzStone, { axis: "x", length: gx1 - gx0, height: gh, thickness: gt, cx: gcx, cz: gz1 - gt / 2, y: AZ, holes: [{ c: GZ.doorIn - gcx, b: 0.04, w: 5, h: 8.96 }].concat(W(WIN)) });    // south: the door into the court ("פתוח בקדש"), x 63..68
      crt_holedWall(H2, g, gzStone, { axis: "x", length: gx1 - gx0, height: gh, thickness: gt, cx: gcx, cz: gz0 + gt / 2, y: AZ, holes: [{ c: GZ.doorOut - gcx, b: 0.04, w: 4, h: 8.96 }].concat(W(WIN)) });   // north: the door outside ("פתוח בחול"), x 50..54
      for (const wx of [gx0 + gt / 2, gx1 - gt / 2]) crt_holedWall(H2, g, gzStone, { axis: "z", length: gz1 - gz0 - 2 * gt, height: gh, thickness: gt, cx: wx, cz: gcz, y: AZ, holes: W([-4.75, 4.75]) });
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
        title: "מסיר לרגע את גג לשכת הגזית, לצפייה בלבד, ומעביר את המבט מלמעלה אל תוך הלשכה: הסנהדרין בחצי עיגול ומקום הפיס.",
        anchor: [(LX0 + LX1) / 2, top + 8, (LZ0 + LZ1) / 2],
        maxDist: 170,
        get: () => !gazitRoof.visible,
        set: (on) => {
          gazitRoof.visible = !on;
          if (on) {
            const fly = ctx.ui && typeof ctx.ui.fly === "function" ? ctx.ui.fly : typeof ctx.flyTo === "function" ? ctx.flyTo : null;
            if (fly) fly([(LX0 + LX1) / 2 + 8, top + 42, (LZ0 + LZ1) / 2 + 26], [(LX0 + LX1) / 2, AZ + 2, (LZ0 + LZ1) / 2]);
          }
        }
      });
      // "פייס במזרחה": the ring of the lots in the court half toward the east (CRT_GAZIT_LOTS; a darker stone ring, half sunk in the floor)
      const LT = CRT_GAZIT_LOTS;
      H2.ring(g, LT.r, 0.12, new MeshStandardMaterial({ color: 0x7a6650, roughness: 0.55, metalness: 0 }), LT.x, AZ, LT.z).name = "gazitLots";
      // the 71 seats of the Sanhedrin: cedar, each 0.8 wide x 0.55 deep with a back, every seat turned toward the centre (CRT_GAZIT_SEATS.x,
      // the wall's centre line); the half circle lies on the north (outer) side, so the middle seats face south
      const seatGeo = (base) => {
        const parts = [];
        const s = new BoxGeometry(0.55, 0.9 + base, 0.8);
        s.translate(0, (0.9 + base) / 2, 0);
        parts.push(s);
        const b = new BoxGeometry(0.1, 1.0, 0.8);
        b.translate(-0.225, 0.9 + base + 0.5, 0);
        parts.push(b);
        return mergeGeometries(parts);
      };
      const SX = CRT_GAZIT_SEATS.x;
      const arc = (r, n) => {
        const out = [];
        for (let i = 0; i < n; i++) {
          const th = Math.PI * (i + 0.5) / n;                    // 0..PI: the half circle on the north (outer) side, from east to west
          const m = new Matrix4().makeRotationY(Math.PI + th);   // the seat's front (+x) turned toward the centre
          m.setPosition(SX + r * Math.cos(th), AZ, gcz - r * Math.sin(th));
          out.push(m);
        }
        return out;
      };
      for (const [r, n, base] of CRT_GAZIT_SEATS.rows) {
        const ms = arc(r, n);
        const inst = new InstancedMesh(seatGeo(base), M2.cedar, ms.length);
        ms.forEach((m, i) => inst.setMatrixAt(i, m));
        inst.instanceMatrix.needsUpdate = true;
        inst.castShadow = false;
        inst.receiveShadow = true;
        inst.name = "sanhedrinSeats";
        g.add(inst);
      }
      // the label: Yoma 19a + the Rambam for the side, Yoma 25a for the two halves (FIXES L.21)
      // (y 46: 12 above the lantern, so from the court's default view it clears the row of the north gates' labels at y 31)
      lbl("לשכת הגזית (יומא יט.; רמב״ם בית הבחירה ה, יז; יומא כה.)", gcx, top + 18, gcz, 4);
      ctx.shared.flyPoints = ctx.shared.flyPoints || {};
      // inside, high over the court half (20.5 above the floor, under the cedar ceiling at 27.8), looking down north-east: the lots' ring on the
      // right, whole (1.0.1-L: from over the holy door it stood half under the frame's edge), the line of the wall across the floor, the 71
      // seats facing the camera beyond it (model choice). The camera stands 6.4 from the target across the floor, so the turn buttons keep it
      // inside the room (the inner faces x 49.5..68.5, z -75.5..-59.5) at every step
      ctx.shared.flyPoints.lishkatHaGazit = { pos: [58.5, AZ + 20.5, -63.3], target: [62.2, AZ + 1, -68.5] };   // 1.0.1-L (A9): 1.2 east, with the ring
      // outside (a second view for the UI, optional): high over the outer court's corner, 136 from the chamber's nearest corner - beyond the
      // walls' fade reach along the view (70-ui.js: 120), so the chamber stays solid - aimed at the court floor 11 in front of it: the
      // chamber on the north wall beside the gate, the Sea in its corner, the altar
      ctx.shared.flyPoints.lishkatHaGazitOut = { pos: [135, 80, 50], target: [60, 12, -48] };
      ctx.shared.lishkatHaGazit = {
        x0: gx0, x1: gx1, z0: gz0, z1: gz1, y: AZ, side: "north", seats: 71,
        seatRows: CRT_GAZIT_SEATS.rows.map((r) => ({ r: r[0], n: r[1], base: r[2] })), seatsCentre: [SX, gcz],
        lots: { x: LT.x, z: LT.z, r: LT.r },
        boundaryZ: [CO2.azN - T / 2, CO2.azN + T / 2],
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
      inst(hookGeo, ironSl, pillarAt, "slaughterHooks", false, layG.book);
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
        inst(mergeGeometries(parts), ironSl, beamHookAt, "slaughterHooks-meiri", false, layG.meiri);
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
        inst(hookGeo, ironSl, rowAt, "slaughterHooks-oneRow", false, layG.oneRow);
      }
      // the switch (1.0.1-L, A5, A6): the UI's opinion row sets it; default "book"
      ctx.shared.slaughterLayout = {
        current: "book",
        keys: ["book", "meiri", "oneRow"],
        names: { book: "חתיכת ארז על כל עמוד — כציור הספר", meiri: "קורות מעמוד לעמוד — המאירי", oneRow: "שורה אחת ממזרח למערב — ראבי״ה והגר״א" },
        set(key) {
          if (!layG[key]) return this.current;
          this.current = key;
          for (const k of this.keys) layG[k].visible = k === key;
          return key;
        }
      };
      // labels (their texts are keys of the UI's LABEL_MAP). 1.0.1-L: placed from the views (headless projection with the UI's label scaling):
      // from the fly point they cover no ring, table or pillar, and in the court's default view they do not lie on the altar's or the Sea's
      // label (at x 49.5, y 13 the first one lay on "מזבח הנחושת"; at x 41.5, y 8.6 the second stood at the demonstration's stop and the
      // cedar posts hid its first word)
      lbl("בית המטבחים — הטבעות (מדות ג, ה; ה, ב; תמיד ד, א)", 56, AZ + 12, -14, 2.8);
      lbl("שלחנות השיש (שקלים ו, ד; מדות ג, ה)", 40, AZ + 9, -39, 2.4);
      lbl("הננסין (מדות ג, ה; תמיד ג, ה)", 60, AZ + 14, -50, 2.6);
      ctx.shared.flyPoints = ctx.shared.flyPoints || {};
      // the whole place from the south-south-east, high: the rows of rings nearly level on the screen, all 24 arches, the two lines of tables,
      // the two rows of pillars, the altar's north edge at the bottom, the chamber's face at the top and the Sea in its corner on the right
      // ("מול השולחנות והטבעות"). 46 above the floor, y 52, above the house's top (47.5), so the UI's turn buttons never put the camera
      // inside a solid (checked headless)
      ctx.shared.flyPoints.slaughterPlace = { pos: [66, AZ + 46, -2], target: [58, AZ + 1, -36] };
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
  }
