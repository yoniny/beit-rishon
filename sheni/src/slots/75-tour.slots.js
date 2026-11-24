//@@begin top-note
  // plugin/js/tour.js
  // ===== 75-tour.js — the presentation ("מצגת"), 1.0.1-K (FIXES-1.0.1-K.md, K.8; replaces the 1.0.1-H tour) =====
  // The user: "הוסף כפתור 1) של מצגת רציפה 2) מצגת לפי סדר הפס' במלכים" (part J); "אם בנית את המצגת מחדש פשוט צריך להזיז את באנר ההסבר
  // מאמצע העמוד"; "את באנר המצגת תעשה יותר מאורך ולא מלבן מאוזן" (part K).
  // The button at the top left (#tm-tour-btn) opens a small menu of three modes (tour_MODES):
  //   (1) "לפי הנושאים" (1.0.1-L: and every place of the panel, below) - every view of the "מבטים" grid in its order (ctx.ui.views, read when the tour starts; the view "העליות" is a row of
  //       the opinions table and comes with the readings), the model in its DEFAULT readings (the first option of every row: Rashi first),
  //       then every other reading of the opinions table, one slide each (as 1.0.1-H);
  //   (2) "רציפה" - the same slides, ~7 s each (tour_DWELL), a slow orbit on exterior slides (up to 12 degrees, alternating sides, eased;
  //       only where nothing is above the camera within 150 amot and the camera is >= 35 from its target), looping until stopped; a slide
  //       whose camera or target is inside the devir is skipped while the cloud covers it (ctx.ui.cloudOn()); a pointer, wheel or arrow-key
  //       interaction holds it and it goes on by itself 8 s after the last one (an explicit "השהה" is not resumed by itself);
  //   (3) "לפי סדר הפסוקים במלכים" - I Kings 6:1-38, 7:1-51, 8:1-11, 8:62-66 in order: tour_KINGS = 46 slides (1.2.0: the verses with nothing to show are gone - the user), one per verse or per group of
  //       consecutive verses, each with the pointed verses (tour_VERSES: the text of the Otzaria library, book 10, ketiv in parentheses and
  //       qere in brackets as printed there), its view or place, a short explanation built on Rashi first (then Targum, Radak, Metzudot,
  //       Ralbag; every quotation was checked mechanically against the Otzaria text of the verse and its commentaries: 260 fragments) and
  //       source links that open in Otzaria (ui_V / ui_P / ui_MI of 70-ui.js; Otzaria line = ui_BASE[10][chapter] + verse, checked in the
  //       library: 6:1 = 186, 7:1 = 225, 8:1 = 277, 8:62 = 338). 1.0.1-L: + I Kings 10:18-20 (10:18 = 390) and two completion slides = 53.
  // The banner (#tm-tour-box): a TALL NARROW panel on the LEFT - left 12, top 52, bottom 76 (above the compass and the nav row), width
  // min(300px, 34vw) - with the part and "n / N", the title, the reference, a notice line OUTSIDE the scrolling area (the cloud
  // confirmation, the pause, the countdown of the continuous mode), the scrolling text (the verses in a Hebrew serif with nikud, the
  // explanation, the sources), a progress bar and the controls (הקודם / השהה / הבא / סיום, and the speed "קצב", remembered in
  // localStorage); RTL; under 640 px a bottom sheet (left/right 8, bottom 66, max-height min(40vh, 50vh - 70px)); z-index 29, under the
  // side panel (30), so it never covers it. fitBox() keeps it above #tm-nav / #tm-compass whatever their height (the nav row wraps to two
  // lines on a phone) and caps the sheet so that it never reaches the centre of the view.
  // Rules (the user's): the tour never opens a removal by itself - interior slides use cameras inside the closed house; a navigation call of
  // the UI that would still open one is undone at once (keepClosed). A slide that needs a model feature switches it on for itself and
  // restores it when it is left: the yatzia section (ctx.shared.yatziaSection, 6:6), the wall and floor layers (ctx.shared.wallLayers,
  // 6:14-15, 6:30), the incense altar's layers (ctx.shared.incenseAltar.layers, 6:22), the base's demo (ctx.shared.mechona.demo, 7:30-33)
  // and its exploded view with the parts' labels (explode + ctx.layers.mechonaParts, 7:34-37) and the palace layer (7:1-12, 8:1-5); the
  // cloud is put back over the devir for 8:10-11 and left there (the UI returns it by itself whenever the camera leaves the devir). At the
  // end (or on "סיום" / Esc) every reading, layer and switch the tour changed is restored: the opinion rows, the layers of ctx.layers (1.0.1-H
  // review F3: the palace layer) but for the groups that a feature's own set() drives (OWNED), the features as they were before the
  // tour through their own set() (the yatzia section, the wall layers, the altar's layers, the base taken apart), the auto-rotation
  // "סיבוב איטי" (suspended while the tour runs; through ctx.ui.autoRotate when the UI has it), the side panel on a phone. A removal the
  // user opened before the tour is left as it is.
  // Review fixes (journal wf_b468c06b-909): F1/UX2 a click on a source link pauses (capture-phase listener: openSource stops the bubbling);
  // F2/UX1 while the Holy-of-Holies confirmation is open the tour's keys and buttons do nothing, Esc answers the dialog ("ביטול") instead of
  // ending the tour (ctx.ui.cancelConfirm), and leaving a slide / ending cancels a pending confirmation so its fly cannot land later; after
  // "ביטול" the slide flies to a view outside the devir (tour_OUT: the parochet from the heichal; 8:6-9: the two bulges of the staffs in
  // the parochet, 8:8); F3/UX7 layers restored; F4/UX6 the nav buttons and the arrow keys pause too (any pointerdown outside
  // the tour's own elements and the dialog, any wheel outside the banner and the panel); UX3 the banner moves up while measuring
  // (body.tm-measuring); UX4 never over the centre; UX5 the last "הבא" reads "לסיכום"; UX8 the notice line is outside the scroll; UX9 the
  // running label is short ("■ עצור"). No key is taken while the focus is in an input or the side panel; the clock is a ctx.animated hook
  // (no interval), frozen while paused, held, waiting for the dialog or while the document is hidden.
  // 1.0.1-K review fixes (review-K-fixargs.json): vessels-2/tour-4 leaving 7:30-33 parks the base at once (demo.reset, not stop: it drove
  // home at three times the speed into 7:34-37), and 7:34-37 takes the base apart in its place (a demo still running is parked and started
  // again when the slide is left); tour-1/cross-2/interior-2 the groups a feature's own set() drives (yatziaDims, wallLayers, altarLayers,
  // mechonaParts) are never written raw at the end - the features go back through their set(); tour-2 the label's card (ctx.ui.closeCard)
  // is closed on every slide change and when the tour starts or ends; tour-3 Esc is handled before the focus test (a panel button or the
  // speed <select> kept it), and the select gives the focus back after a choice; tour-5 the layers an opinion slide's own calls switch (the
  // forest house turns the palace on) are put back when it is left; tour-6 the continuous mode holds while a pointer is down (and on a
  // move with a button pressed); tour-7 one phone rule for the CSS and fitBox (tour_PHONE_MQ), and on a phone the speed sits in the controls
  // row (no "Esc" line), for the text's height; tour-8 auto-rotation through ctx.ui.autoRotate; tour-9 the quotation of 7:14.
  // API: ctx.shared.tour = { modes, start(mode, {speed}), stop(), next(), prev(), state (a function; also state.running / .mode / .idx ...),
  // slides (the current list), plan(mode) (each slide's resolved target, for tests), setSpeed(k) }.
  // Navigation: views by key (ctx.ui.resolveFp + ctx.ui.fly: the fly asks for the cloud), places by title (ctx.ui.place: its view, or its
  // cam / tg), each slide with a chain of candidates that ends in a broad view - a missing target falls back, never an error.
  // Model choices (marked): which view illustrates each verse group; 8:10-11 is shown from the heichal (Rashi 8:10 "כשיצאו שרתה שכינה
  // בהיכל"; the model's cloud covers the devir only); the dwell (7 s), the orbit (12 degrees) and the reading times (2.5 s + 55 ms per
  // character, 9..45 s; verse slides 3 s + 55 ms per character of the explanation + 70 ms per letter of the verses, 10..60 s; x speed).
  // 1.0.1-K review (tour-7): the phone sheet - ONE rule for the CSS below and for narrow() (window.matchMedia of the same query): the CSS
  // said max-width 640 while narrow() said innerWidth < 640, so at exactly 640 the sheet was laid out with the desktop thresholds. On a
  // phone the text gets more of the sheet's height (it had 34-64 px at 360 x 640): the speed choice moves into the controls row (.spd,
  // without its word "קצב"; placeSpeed()), the row under the controls is not shown, the paddings and the notice line are tighter; the "Esc"
  // hint is not shown on a touch screen (hover: none) - there is no Esc key there. From 640 to 881 px (640 is now the desktop banner, as
  // narrow() said) the banner is 34vw < 300 px wide: the controls' gaps, side paddings and font (11 px) are smaller there, so that
  // "→ הקודם" and "⏸ השהה" are not cut (they were cut from 641 px up to ~750 before)
  // 1.0.1-L (FIXES-1.0.1-L.md; the user: "אני רוצה שהמצגת תכלול גם תקריבים - בעצם את כל הכפתורים האפשריים בתוסף - שיטות נוספות בסוף ממש"):
  //   - L.50 the topics mode (and the continuous mode, which plays the same slides) goes through EVERY view of the grid and EVERY place of the
  //     panel, read at runtime from ctx.ui.places() (fallback: placeTitles() + place(t)), in the panel's order: the opening view, then group by
  //     group; a view comes right before the first place of its group that flies to it (a view no place flies to, and the overview "בית שלמה",
  //     opens its group), and a place that only repeats its view's text is the view's slide. Each place has its title, text and sources and
  //     flies to its fly point / view / camera; a place with no target is shown at its group's view camera. A place that switches a model
  //     feature on has it on for its slide and off when the slide is left; the base's demonstration and its parts (L.51 took their places
  //     away, the pills on the base do them) are slides of the tour after "המכונות מקרוב". The tour never opens a removal, the ulam stays closed
  //     ("תשאיר סגור, אולי תרחיק מאוד את המבט"), and only at the VERY END come the other readings of the opinions table.
  //   - L.78-L.81 the throne: after the throne's own places, ONE SLIDE PER VERSION of ctx.shared.throneVersion ("pesukim" = the verses with
  //     their commentators and no midrashic figures; the three midrashim play ctx.shared.throne.ascent with the captions of throne.script
  //     shown progressively, each at its time, the midrash's own words as each thing happens) and after each midrash its witnesses' scene
  //     (throne.witnesses, witnessScript). The tour drives their timeline (ascent.start, then seek per frame), so a pause, a hold or a hidden
  //     document freezes them with the captions and the speed scales them; the version goes back when the slide is left. A slide with a
  //     timeline dwells for that timeline in every mode, the continuous one too. The verses gain I Kings 10:18-20 (tour_KINGS, last slide).
  //   - L.80 the bubble (.bub): a speech bubble in the banner on the throne slides: the Ben Yehoyada's words on Sanhedrin 106b (book 2546 line 778),
  //     and apart from them, under the marker "לכאורה", the inference (the user's: "זהו מקור לכאו' לכך שהכל פעל עפ"י חשמל"), never attributed to him - his
  //     words are about the flying tower. No text on the screen names the user (the integrator's rule): what he decided reads "בחירת מודל".
  //   - the verse slides brought in step with the model (the builders' reports): the ulam's doorway and doors, the section, the golden altar,
  //     the cherubim's wings and faces, the devir's lintel, the forest house's THREE readings (forestAlam / forestAv), the king's own court,
  //     the Sea in the corner, the bases' block of 2 x 5, the tables in Moses' form with his table at the rows' head, the menorot, the staves;
  //     two completion slides, marked as such: לשכת הגזית (with 6:36) and בית המטבחים (with 8:62-66).
  //   - the floating explanation card (ctx.ui.card) stays closed while the tour runs (while the user himself paused it, a card he opened from
  //     the panel may stay on a desktop); ctx.ui.autoOff is cancelled at the start: a slide's feature is the tour's alone. After "ביטול" in
  //     the cloud dialog the tour does not ask again in that run: the next devir slides are shown from outside the devir (their "out" views).
  // 1.0.1-L, part 5 (brief-part5.md):
  //   - L.93 ("אני רוצה שבזמן הצפיה התפריט מצד ימין יסגר לצד לגמרי"): in every mode the panel closes when the presentation starts (through the burger, which stays) and goes
  //     back to its state at the end; the view's centre moves to the middle of the free space beside the banner (viewShift: a lens shift, no camera or ray changes).
  //   - L.88: the exhibit of the vessels (ctx.shared.kelim) is on on its slides only: the place, 7:40-47, 7:49 (second stop), 7:50 and the completion slide on 7:40-50.
  //   - L.89: the slide's text, title and captions through ctx.ui.smallSources (it leaves a quote's own words); the verses are not touched.
  //   - L.85: arkInside is a removal, which stays by its pill: no slide opens it; a press during the tour goes back at the end (OWN_FEAT). A31: one slide per version, the
  //     ascent and then the witnesses. A32: the throne's long texts are short here (tour_SHORT); the whole text stays in the panel's card.
  //   - 1.0.2: the box starts 5 px below the fixed top bar of index.html (--topbar-h: 56 px, 44 px in a narrow window), as it did below the old 47 px header.
//@@end top-note
//@@begin tour_CSS
#tm-tour-box .opts{display:none;flex-wrap:wrap;gap:4px 9px;padding:6px 12px 1px;flex:none;font-size:11px;color:#b9ac82}
#tm-tour-box .opts.on{display:flex}
#tm-tour-box .opts .og{display:inline-flex;align-items:center;gap:3px;white-space:nowrap}
#tm-tour-box .opts .og b{font-weight:600;color:#c9a84c;margin-left:2px}
#tm-tour-box .opts button{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.45);color:#f3dc9a;border-radius:6px;padding:1px 7px;font:inherit;line-height:1.5;cursor:pointer}
#tm-tour-box .opts button:hover{background:rgba(201,168,76,.3)}
#tm-tour-box .opts button.on{background:rgba(201,168,76,.5);color:#14110a;border-color:rgba(255,236,170,.85);cursor:default}
//@@end tour_CSS
//@@begin tour_CSS-2
#tm-tour-box .vs .vl{display:block;color:#c9a84c;font:600 12px 'Segoe UI',Arial,sans-serif;margin:6px 0 1px}
//@@end tour_CSS-2
//@@begin tour_VIEWS
  // TOUR_VIEWS_205 BEGIN (tools/tour_views_b2.json)
  var tour_VIEWS = {"שער ניקנור": [[[128, 26, 16], [93.5, 17.5, -4]]], "לשכת הנזירים": [[[206.2, 20.96, 44.39], [208.5, 9.6, 47.5]], [[212.97, 15.77, 40.43], [214.5, 8.2, 42.5]]], "לשכת המצורעים": [[[115.99, 20.91, -44.13], [113.5, 8.6, -47.5]]], "לשכת שמנים": [[[111.92, 16.82, 51.67], [110.2, 8.3, 54]], [[115.22, 17.52, 44.17], [113.5, 9, 46.5]], [[120.03, 15.87, 51.03], [118.5, 8.3, 53.1]]], "לשכת הגזית — הסנהדרין": [[[83.5, 32.75, -62.03], [83.5, 18.6, -67]], [[86.5, 28.38, -61.36], [85.5, 18, -65]]], "בית המוקד": [[[-20, 23.6, -68.19], [-20, 14.9, -70.5]], [[-18, 28.56, -64.16], [-18, 16, -67.5]]], "לשכת בית אבטינס — על גבי שער המים": [[[-30, 55.04, 63.73], [-30, 42.6, 67.5]]], "לשכת המדיחין": [[[84.74, 30.46, 33.4], [84.5, 20, 36.8]]], "לשכת הפרוה": [[[84, 47.45, 46.3], [84, 35, 50]]], "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28": [[[104, 34, 9], [55.5, 22, 9]]], "בית המטבחים": [[[51.8, 33.58, -44.13], [51.8, 20, -50.5]]], "כבשים קטנים — רש״י": [[[84, 42, 50], [64, 22, 31]]], "כבשים קטנים — תוספות": [[[84, 42, 50], [64, 22, 31]]], "הכבש הגדול": [[[69.04, 33.54, 29.46], [59, 26.6, 25]]], "שולחנות האולם — שיש וזהב": [[[9.5, 26.6, -4.5], [4, 24.4, -8]], [[9.5, 26.6, 4.5], [4, 24.2, 8]]], "המנורה": [[[-41.8, 26.6, 4.2], [-38.2, 24.2, 6.4]]], "פתח העלייה ופנים העלייה": [[[-20, 74, 2], [-50, 69.5, -2]]], "המזבח": [[[100, 60, -40], [52, 18, 14]]], "פשפשי בית החליפות": [[[-13, 34, -47], [0.4, 27.5, -51.5]]]};
  // TOUR_VIEWS_205 END
  var tour_MODES = [
    { key: "topics", label: "לפי הנושאים", desc: "כל המבטים וכל המקומות לפי סדר התפריט, ובסוף השיטות הנוספות שבתפריט, תחת ״שיטות ומחלוקות״." },
    { key: "continuous", label: "רציפה", desc: "אותן שקופיות ברצף, בתנועה איטית ובלולאה עד לעצירה." },
    { key: "tamid", label: "סדר עבודת הבוקר — מסכת תמיד", desc: "הדגמה: מבית המוקד בלילה ועד שיר הלויים, שלב אחר שלב, בלשון המשנה — בסדר שנבחר במתג ״סדר עבודת הבוקר״ (אביי או הרמב״ם)." },   // 2.0 (55-tamid.js)
    { key: "verses", label: "לפי סדר המשניות במסכת מידות", desc: "מסכת מידות א–ה — שלושים וארבע המשניות המנוקדות, כל אחת במקומה במודל, עם הסבר ומקורות ברמב״ם ובגמרא." }
//@@end tour_VIEWS
//@@begin tour_VIEW_GROUP
  // 1.0.1-L (L.50): the group of a view that no place of the panel flies to (a fragment of the group's name; else the previous view's group)
  var tour_VIEW_GROUP = {};    // Beit Sheni: every view has a home place in the panel
  var tour_VIEW_OPENS = {};
  var tour_VIEW_ALIAS = {};
  var tour_ORBIT = 12 * Math.PI / 180;   // the continuous mode's orbit on exterior slides: 12 degrees (the brief: +-12, alternating sides; model choice)
  // the view of a devir slide when the cloud dialog is answered "ביטול": the parochet from the heichal (K.4), else the devir doorway, the heichal
  var tour_OUT = [{ fp: "kodesh" }];   // a Holy-of-Holies slide when the cloud dialog is answered "ביטול": the kodesh, before the parochet
  // The pointed text of Mishnah Middot 1:1-5:4 as printed in the Otzaria library (book 89; generated from its text, nothing retyped).
  var tour_VERSES = {
    "1:1": "בִּשְׁלשָׁה מְקוֹמוֹת הַכֹּהֲנִים שׁוֹמְרִים בְּבֵית הַמִּקְדָּשׁ, בְּבֵית אַבְטִינָס, וּבְבֵית הַנִּיצוֹץ, וּבְבֵית הַמּוֹקֵד. וְהַלְוִיִּם בְּעֶשְׂרִים וְאֶחָד מָקוֹם. חֲמִשָּׁה, עַל חֲמִשָּׁה שַׁעֲרֵי הַר הַבַּיִת. אַרְבָּעָה, עַל אַרְבַּע פִּנּוֹתָיו מִתּוֹכוֹ. חֲמִשָּׁה, עַל חֲמִשָּׁה שַׁעֲרֵי הָעֲזָרָה. אַרְבָּעָה, עַל אַרְבַּע פִּנּוֹתֶיהָ מִבַּחוּץ. וְאֶחָד בְּלִשְׁכַּת הַקָּרְבָּן, וְאֶחָד בְּלִשְׁכַּת הַפָּרֹכֶת, וְאֶחָד לַאֲחוֹרֵי בֵית הַכַּפֹּרֶת:",
    "1:2": "אִישׁ הַר הַבַּיִת הָיָה מְחַזֵּר עַל כָּל מִשְׁמָר וּמִשְׁמָר, וַאֲבוּקוֹת דּוֹלְקִין לְפָנָיו, וְכָל מִשְׁמָר שֶׁאֵינוֹ עוֹמֵד, אוֹמֵר לוֹ אִישׁ הַר הַבַּיִת, שָׁלוֹם עָלֶיךָ. נִכָּר שֶׁהוּא יָשֵׁן, חוֹבְטוֹ בְמַקְלוֹ. וּרְשׁוּת הָיָה לוֹ לִשְׂרֹף אֶת כְּסוּתוֹ. וְהֵם אוֹמְרִים, מַה קּוֹל בָּעֲזָרָה. קוֹל בֶּן לֵוִי לוֹקֶה וּבְגָדָיו נִשְׂרָפִין, שֶׁיָּשֵׁן לוֹ עַל מִשְׁמָרוֹ. רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב אוֹמֵר, פַּעַם אַחַת מָצְאוּ אֶת אֲחִי אִמָּא יָשֵׁן, וְשָׂרְפוּ אֶת כְּסוּתוֹ:",
    "1:3": "חֲמִשָּׁה שְׁעָרִים הָיוּ לְהַר הַבַּיִת. שְׁנֵי שַׁעֲרֵי חֻלְדָּה מִן הַדָּרוֹם, מְשַׁמְּשִׁין כְּנִיסָה וִיצִיאָה. קִיפוֹנוֹס מִן הַמַּעֲרָב, מְשַׁמֵּשׁ כְּנִיסָה וִיצִיאָה. טָדִי מִן הַצָּפוֹן, לֹא הָיָה מְשַׁמֵּשׁ כְּלוּם. שַׁעַר הַמִּזְרָחִי, עָלָיו שׁוּשַׁן הַבִּירָה צוּרָה, שֶׁבּוֹ כֹהֵן גָּדוֹל הַשּׂוֹרֵף אֶת הַפָּרָה וּפָרָה וְכָל מְסַעֲדֶיהָ יוֹצְאִים לְהַר הַמִּשְׁחָה:",
    "1:4": "שִׁבְעָה שְׁעָרִים הָיוּ בָעֲזָרָה, שְׁלשָׁה בַצָּפוֹן וּשְׁלשָׁה בַדָּרוֹם וְאֶחָד בַּמִּזְרָח. שֶׁבַּדָּרוֹם, שַׁעַר הַדֶּלֶק. שֵׁנִי לוֹ, שַׁעַר הַבְּכוֹרוֹת. שְׁלִישִׁי לוֹ, שַׁעַר הַמָּיִם. שֶׁבַּמִּזְרָח, שַׁעַר נִקָּנוֹר, וּשְׁתֵּי לְשָׁכוֹת הָיוּ לוֹ, אַחַת מִימִינוֹ וְאַחַת מִשְּׂמֹאלוֹ, אַחַת לִשְׁכַּת פִּנְחָס הַמַּלְבִּישׁ, וְאַחַת לִשְׁכַּת עוֹשֵׂי חֲבִתִּין:",
    "1:5": "וְשֶׁבַּצָּפוֹן, שַׁעַר הַנִּיצוֹץ. וּכְמִין אַכְסַדְרָה הָיָה, וַעֲלִיָּה בְנוּיָה עַל גַּבָּיו, שֶׁהַכֹּהֲנִים שׁוֹמְרִים מִלְמַעְלָן וְהַלְוִיִּם מִלְּמַטָּן, וּפֶתַח הָיָה לוֹ לַחֵיל. שֵׁנִי לוֹ, שַׁעַר הַקָּרְבָּן. שְׁלִישִׁי לוֹ, בֵּית הַמּוֹקֵד:",
    "1:6": "וְאַרְבַּע לְשָׁכוֹת הָיוּ בְּבֵית הַמּוֹקֵד, כְּקִיטוֹנוֹת פְּתוּחוֹת לִטְרַקְלִין, שְׁתַּיִם בַּקֹּדֶשׁ וּשְׁתַּיִם בַּחֹל, וְרָאשֵׁי פִסְפָּסִין מַבְדִּילִין בֵּין קֹדֶשׁ לַחֹל. וּמֶה הָיוּ מְשַׁמְּשׁוֹת. מַעֲרָבִית דְּרוֹמִית, הִיא הָיְתָה לִשְׁכַּת טְלָאֵי קָרְבָּן. דְּרוֹמִית מִזְרָחִית, הִיא הָיְתָה לִשְׁכַּת עוֹשֵׂי לֶחֶם הַפָּנִים. מִזְרָחִית צְפוֹנִית, בָּהּ גָּנְזוּ בְנֵי חַשְׁמוֹנַאי אֶת אַבְנֵי הַמִּזְבֵּחַ שֶׁשִּׁקְּצוּם מַלְכֵי יָוָן. צְפוֹנִית מַעֲרָבִית, בָּהּ יוֹרְדִים לְבֵית הַטְּבִילָה:",
    "1:7": "שְׁנַיִם שְׁעָרִים הָיוּ לְבֵית הַמּוֹקֵד, אֶחָד פָּתוּחַ לַחֵיל וְאֶחָד פָּתוּחַ לָעֲזָרָה. אָמַר רַבִּי יְהוּדָה, זֶה שֶׁהָיָה פָתוּחַ לָעֲזָרָה, פִּשְׁפָּשׁ קָטָן הָיָה לוֹ, שֶׁבּוֹ נִכְנָסִין לִבְלֹשׁ אֶת הָעֲזָרָה:",
    "1:8": "בֵּית הַמּוֹקֵד, כִּפָּה, וּבַיִת גָּדוֹל הָיָה, מֻקָּף רוֹבָדִין שֶׁל אֶבֶן, וְזִקְנֵי בֵית אָב יְשֵׁנִים שָׁם, וּמַפְתְּחוֹת הָעֲזָרָה בְּיָדָם, וּפִרְחֵי כְהֻנָּה, אִישׁ כִּסְתּוֹ בָאָרֶץ:",
    "1:9": "וּמָקוֹם הָיָה שָׁם, אַמָּה עַל אַמָּה, וְטַבְלָא שֶׁל שַׁיִשׁ וְטַבַּעַת הָיְתָה קְבוּעָה בָהּ, וְשַׁלְשֶׁלֶת שֶׁהַמַּפְתְּחוֹת הָיוּ תְלוּיוֹת בָּהּ. הִגִּיעַ זְמַן הַנְּעִילָה, הִגְבִּיהַּ אֶת הַטַּבְלָא בַּטַּבַּעַת וְנָטַל אֶת הַמַּפְתְּחוֹת מִן הַשַּׁלְשֶׁלֶת, וְנָעַל הַכֹּהֵן מִבִּפְנִים, וּבֶן לֵוִי יָשֵׁן לוֹ מִבַּחוּץ. גָּמַר מִלִּנְעֹל, הֶחֱזִיר אֶת הַמַּפְתְּחוֹת לַשַּׁלְשֶׁלֶת וְאֶת הַטַּבְלָא לִמְקוֹמָהּ, נָתַן כְּסוּתוֹ עָלֶיהָ, יָשֵׁן לוֹ. אֵרַע קֶרִי בְּאַחַד מֵהֶם, יוֹצֵא וְהוֹלֵךְ לוֹ בַמְּסִבָּה הַהוֹלֶכֶת תַּחַת הַבִּירָה, וְהַנֵּרוֹת דּוֹלְקִים מִכָּאן וּמִכָּאן, עַד שֶׁהוּא מַגִּיעַ לְבֵית הַטְּבִילָה. רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב אוֹמֵר, בַּמְּסִבָּה הַהוֹלֶכֶת תַּחַת הַחֵיל יוֹצֵא וְהוֹלֵךְ לוֹ בְּטָדִי:",
    "2:1": "הַר הַבַּיִת הָיָה חֲמֵשׁ מֵאוֹת אַמָּה עַל חֲמֵשׁ מֵאוֹת אַמָּה, רֻבּוֹ מִן הַדָּרוֹם, שֵׁנִי לוֹ מִן הַמִּזְרָח, שְׁלִישִׁי לוֹ מִן הַצָּפוֹן, מִעוּטוֹ מִן הַמַּעֲרָב. מְקוֹם שֶׁהָיָה רֹב מִדָּתוֹ, שָׁם הָיָה רֹב תַּשְׁמִישׁוֹ:",
    "2:2": "כָּל הַנִּכְנָסִין לְהַר הַבַּיִת נִכְנָסִין דֶּרֶךְ יָמִין וּמַקִּיפִין וְיוֹצְאִין דֶּרֶךְ שְׂמֹאל, חוּץ מִמִּי שֶׁאֵרְעוֹ דָבָר, שֶׁהוּא מַקִּיף לִשְׂמֹאל. מַה לְּךָ מַקִּיף לִשְׂמֹאל, שֶׁאֲנִי אָבֵל, הַשּׁוֹכֵן בַּבַּיִת הַזֶּה יְנַחֲמֶךָּ. שֶׁאֲנִי מְנֻדֶּה, הַשּׁוֹכֵן בַּבַּיִת הַזֶּה יִתֵּן בְּלִבָּם וִיקָרְבוּךָ, דִּבְרֵי רַבִּי מֵאִיר. אָמַר לוֹ רַבִּי יוֹסֵי, עֲשִׂיתָן כְּאִלּוּ עָבְרוּ עָלָיו אֶת הַדִּין. אֶלָּא, הַשּׁוֹכֵן בַּבַּיִת הַזֶּה יִתֵּן בְּלִבְּךָ וְתִשְׁמַע לְדִבְרֵי חֲבֵרֶיךָ וִיקָרְבוּךָ:",
    "2:3": "לִפְנִים מִמֶּנּוּ, סוֹרֵג, גָּבוֹהַּ עֲשָׂרָה טְפָחִים. וּשְׁלשׁ עֶשְׂרֵה פְרָצוֹת הָיוּ שָׁם, שֶׁפְּרָצוּם מַלְכֵי יָוָן. חָזְרוּ וּגְדָרוּם, וְגָזְרוּ כְנֶגְדָּם שְׁלשׁ עֶשְׂרֵה הִשְׁתַּחֲוָיוֹת. לִפְנִים מִמֶּנּוּ, הַחֵיל, עֶשֶׂר אַמּוֹת. וּשְׁתֵּים עֶשְׂרֵה מַעֲלוֹת הָיוּ שָׁם. רוּם הַמַּעֲלָה חֲצִי אַמָּה, וְשִׁלְחָהּ חֲצִי אַמָּה. כָּל הַמַּעֲלוֹת שֶׁהָיוּ שָׁם, רוּם מַעֲלָה חֲצִי אַמָּה, וְשִׁלְחָהּ חֲצִי אַמָּה, חוּץ מִשֶּׁל אוּלָם. כָּל הַפְּתָחִים וְהַשְּׁעָרִים שֶׁהָיוּ שָׁם, גָּבְהָן עֶשְׂרִים אַמָּה, וְרָחְבָּן עֶשֶׂר אַמּוֹת, חוּץ מִשֶּׁל אוּלָם. כָּל הַפְּתָחִים שֶׁהָיוּ שָׁם, הָיוּ לָהֶן דְּלָתוֹת, חוּץ מִשֶּׁל אוּלָם. כָּל הַשְּׁעָרִים שֶׁהָיוּ שָׁם, הָיוּ לָהֶן שְׁקוֹפוֹת, חוּץ מִשַּׁעַר טָדִי, שֶׁהָיוּ שָׁם שְׁתֵּי אֲבָנִים מֻטּוֹת זוֹ עַל גַּב זוֹ. כָּל הַשְּׁעָרִים שֶׁהָיוּ שָׁם, נִשְׁתַּנּוּ לִהְיוֹת שֶׁל זָהָב, חוּץ מִשַּׁעַר נִקָּנוֹר, מִפְּנֵי שֶׁנַּעֲשָׂה בָהֶן נֵס. וְיֵשׁ אוֹמְרִים, מִפְּנֵי שֶׁנְּחֻשְׁתָּן מַצְהִיב:",
    "2:4": "כָּל הַכְּתָלִים שֶׁהָיוּ שָׁם, הָיוּ גְבוֹהִים, חוּץ מִכֹּתֶל הַמִּזְרָחִי, שֶׁהַכֹּהֵן הַשּׂוֹרֵף אֶת הַפָּרָה עוֹמֵד בְּרֹאשׁ הַר הַמִּשְׁחָה, וּמִתְכַּוֵּן וְרוֹאֶה בְפִתְחוֹ שֶׁל הֵיכָל בִּשְׁעַת הַזָּיַת הַדָּם:",
    "2:5": "עֶזְרַת הַנָּשִׁים הָיְתָה אֹרֶךְ מֵאָה וּשְׁלשִׁים וְחָמֵשׁ עַל רֹחַב מֵאָה וּשְׁלֹשִׁים וְחָמֵשׁ. וְאַרְבַּע לְשָׁכוֹת הָיוּ בְאַרְבַּע מִקְצוֹעוֹתֶיהָ, שֶׁל אַרְבָּעִים אַרְבָּעִים אַמָּה. וְלֹא הָיוּ מְקוֹרוֹת. וְכָךְ הֵם עֲתִידִים לִהְיוֹת, שֶׁנֶּאֱמַר (יחזקאל מו), וַיּוֹצִיאֵנִי אֶל הֶחָצֵר הַחִיצוֹנָה וַיַּעֲבִירֵנִי אֶל אַרְבַּעַת מִקְצוֹעֵי הֶחָצֵר וְהִנֵּה חָצֵר בְּמִקְצֹעַ הֶחָצֵר, חָצֵר בְּמִקְצֹעַ הֶחָצֵר, בְּאַרְבַּעַת מִקְצֹעוֹת הֶחָצֵר חֲצֵרוֹת קְטֻרוֹת. וְאֵין קְטֻרוֹת אֶלָּא שֶׁאֵינָן מְקוֹרוֹת. וּמֶה הָיוּ מְשַׁמְּשׁוֹת. דְּרוֹמִית מִזְרָחִית, הִיא הָיְתָה לִשְׁכַּת הַנְּזִירִים, שֶׁשָּׁם הַנְּזִירִים מְבַשְּׁלִין אֶת שַׁלְמֵיהֶן, וּמְגַלְּחִין אֶת שְׂעָרָן, וּמְשַׁלְּחִים תַּחַת הַדּוּד. מִזְרָחִית צְפוֹנִית, הִיא הָיְתָה לִשְׁכַּת הָעֵצִים, שֶׁשָּׁם הַכֹּהֲנִים בַּעֲלֵי מוּמִין מַתְלִיעִין הָעֵצִים. וְכָל עֵץ שֶׁנִּמְצָא בוֹ תוֹלַעַת, פָּסוּל מֵעַל גַּבֵּי הַמִּזְבֵּחַ. צְפוֹנִית מַעֲרָבִית, הִיא הָיְתָה לִשְׁכַּת מְצֹרָעִים. מַעֲרָבִית דְּרוֹמִית, אָמַר רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב, שָׁכַחְתִּי מֶה הָיְתָה מְשַׁמֶּשֶׁת. אַבָּא שָׁאוּל אוֹמֵר, שָׁם הָיוּ נוֹתְנִין יַיִן וָשֶׁמֶן, הִיא הָיְתָה נִקְרֵאת לִשְׁכַּת בֵּית שְׁמַנְיָה. וַחֲלָקָה הָיְתָה בָּרִאשׁוֹנָה, וְהִקִּיפוּהָ כְצוֹצְרָה, שֶׁהַנָּשִׁים רוֹאוֹת מִלְמַעְלָן, וְהָאֲנָשִׁים מִלְּמַטָּן, כְּדֵי שֶׁלֹּא יְהוּ מְעֹרָבִין. וַחֲמֵשׁ עֶשְׂרֵה מַעֲלוֹת עוֹלוֹת מִתּוֹכָהּ לְעֶזְרַת יִשְׂרָאֵל, כְּנֶגֶד חֲמֵשׁ עֶשְׂרֵה מַעֲלוֹת שֶׁבַּתְּהִלִּים, שֶׁעֲלֵיהֶן הַלְוִיִּם אוֹמְרִים בַּשִּׁיר. לֹא הָיוּ טְרוּטוֹת, אֶלָּא מֻקָּפוֹת כַּחֲצִי גֹרֶן עֲגֻלָּה:",
    "2:6": "וּלְשָׁכוֹת הָיוּ תַחַת עֶזְרַת יִשְׂרָאֵל, וּפְתוּחוֹת לְעֶזְרַת הַנָּשִׁים, שֶׁשָּׁם הַלְוִיִּם נוֹתְנִים כִּנּוֹרוֹת וּנְבָלִים וּמְצִלְתַּיִם וְכָל כְּלֵי שִׁיר. עֶזְרַת יִשְׂרָאֵל הָיְתָה אֹרֶךְ מֵאָה אַמָּה וּשְׁלשִׁים וְחָמֵשׁ עַל רֹחַב אַחַת עֶשְׂרֵה. וְכֵן עֶזְרַת כֹּהֲנִים הָיְתָה אֹרֶךְ מֵאָה וּשְׁלשִׁים וְחָמֵשׁ עַל רֹחַב אַחַת עֶשְׂרֵה. וְרָאשֵׁי פִסְפָּסִין מַבְדִּילִין בֵּין עֶזְרַת יִשְׂרָאֵל לְעֶזְרַת הַכֹּהֲנִים. רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב אוֹמֵר, מַעֲלָה הָיְתָה שָׁם, וּגְבוֹהָה אַמָּה, וְהַדּוּכָן נָתוּן עָלֶיהָ, וּבָהּ שָׁלשׁ מַעֲלוֹת שֶׁל חֲצִי חֲצִי אַמָּה. נִמְצֵאת עֶזְרַת הַכֹּהֲנִים גְּבוֹהָה מֵעֶזְרַת יִשְׂרָאֵל שְׁתֵּי אַמּוֹת וּמֶחֱצָה. כָּל הָעֲזָרָה הָיְתָה אֹרֶךְ מֵאָה וּשְׁמוֹנִים וָשֶׁבַע עַל רֹחַב מֵאָה וּשְׁלשִׁים וְחָמֵשׁ. וּשְׁלֹשׁ עֶשְׂרֵה הִשְׁתַּחֲוָיוֹת הָיוּ שָׁם. אַבָּא יוֹסֵי בֶן חָנָן אוֹמֵר, כְּנֶגֶד שְׁלֹשָׁה עָשָׂר שְׁעָרִים. שְׁעָרִים דְּרוֹמִיִּים סְמוּכִים לַמַּעֲרָב, שַׁעַר הָעֶלְיוֹן, שַׁעַר הַדֶּלֶק, שַׁעַר הַבְּכוֹרוֹת, שַׁעַר הַמָּיִם, וְלָמָּה נִקְרָא שְׁמוֹ שַׁעַר הַמַּיִם. שֶׁבּוֹ מַכְנִיסִין צְלוֹחִית שֶׁל מַיִם שֶׁל נִסּוּךְ בֶּחָג. רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב אוֹמֵר, וּבוֹ הַמַּיִם מְפַכִּים, וַעֲתִידִין לִהְיוֹת יוֹצְאִין מִתַּחַת מִפְתַּן הַבָּיִת. וּלְעֻמָּתָן בַּצָּפוֹן סְמוּכִים לַמַּעֲרָב, שַׁעַר יְכָנְיָה, שַׁעַר הַקָּרְבָּן, שַׁעַר הַנָּשִׁים, שַׁעַר הַשִּׁיר. וְלָמָּה נִקְרָא שְׁמוֹ שַׁעַר יְכָנְיָה, שֶׁבּוֹ יָצָא יְכָנְיָה בְּגָלוּתוֹ. שֶׁבַּמִּזְרָח, שַׁעַר נִקָּנוֹר. וּשְׁנֵי פִשְׁפָּשִׁים הָיוּ לוֹ, אֶחָד מִימִינוֹ וְאֶחָד מִשְּׂמֹאלוֹ. וּשְׁנַיִם בַּמַעֲרָב, לֹא הָיָה לָהֶם שֵׁם:",
    "3:1": "הַמִּזְבֵּחַ הָיָה שְׁלֹשִׁים וּשְׁתַּיִם עַל שְׁלֹשִׁים וּשְׁתַּיִם. עָלָה אַמָּה וְכָנַס אַמָּה, זֶה הַיְסוֹד. נִמְצָא שְׁלֹשִׁים עַל שְׁלֹשִׁים. עָלָה חָמֵשׁ וְכָנַס אַמָּה. זֶה הַסּוֹבֵב. נִמְצָא עֶשְׂרִים וּשְׁמֹנֶה עַל עֶשְׂרִים וּשְׁמֹנֶה. מְקוֹם הַקְּרָנוֹת אַמָּה מִזֶּה וְאַמָּה מִזֶּה. נִמְצָא עֶשְׂרִים וָשֵׁשׁ עַל עֶשְׂרִים וָשֵׁשׁ. מְקוֹם הִלּוּךְ רַגְלֵי הַכֹּהֲנִים, אַמָּה מִזֶּה וְאַמָּה מִזֶּה. נִמְצָא עֶשְׂרִים וְאַרְבַּע עַל עֶשְׂרִים וְאַרְבַּע, מְקוֹם הַמַּעֲרָכָה. אָמַר רַבִּי יוֹסֵי, מִתְּחִלָּה לֹא הָיָה אֶלָּא שְׁמֹנֶה וְעֶשְׂרִים עַל שְׁמֹנֶה וְעֶשְׂרִים, כּוֹנֵס וְעוֹלֶה בְּמִדָּה זוֹ, עַד שֶׁנִּמְצָא מְקוֹם הַמַּעֲרָכָה עֶשְׂרִים עַל עֶשְׂרִים. וּכְשֶׁעָלוּ בְנֵי הַגּוֹלָה, הוֹסִיפוּ עָלָיו אַרְבַּע אַמּוֹת מִן הַדָּרוֹם וְאַרְבַּע אַמּוֹת מִן הַמַּעֲרָב, כְּמִין גַּמָּא, שֶׁנֶּאֱמַר (יחזקאל מג), וְהָאֲרִיאֵל שְׁתֵּים עֶשְׂרֵה אֹרֶךְ בִּשְׁתֵּים עֶשְׂרֵה רֹחַב רָבוּעַ. יָכוֹל שֶׁאֵינוֹ אֶלָּא שְׁתֵּים עֶשְׂרֵה עַל שְׁתֵּים עֶשְׂרֵה, כְּשֶׁהוּא אוֹמֵר (שם) אֶל אַרְבַּעַת רְבָעָיו, מְלַמֵּד שֶׁמִּן הָאֶמְצַע הוּא מוֹדֵד שְׁתֵּים עֶשְׂרֵה אַמָּה לְכָל רוּחַ. וְחוּט שֶׁל סִקְרָא חוֹגְרוֹ בָאֶמְצַע, לְהַבְדִּיל בֵּין הַדָּמִים הָעֶלְיוֹנִים לַדָּמִים הַתַּחְתּוֹנִים. וְהַיְסוֹד הָיָה מְהַלֵּךְ עַל פְּנֵי כָל הַצָּפוֹן וְעַל פְּנֵי כָל הַמַּעֲרָב, וְאוֹכֵל בַּדָּרוֹם אַמָּה אַחַת, וּבַמִּזְרָח אַמָּה אֶחָת:",
    "3:2": "וּבְקֶרֶן מַעֲרָבִית דְּרוֹמִית הָיוּ שְׁנֵי נְקָבִים, כְּמִין שְׁנֵי חֳטָמִין דַּקִּין, שֶׁהַדָּמִים הַנִּתָּנִין עַל יְסוֹד מַעֲרָבִי וְעַל יְסוֹד דְּרוֹמִי, יוֹרְדִין בָּהֶן וּמִתְעָרְבִין בָּאַמָּה, וְיוֹצְאִין לְנַחַל קִדְרוֹן:",
    "3:3": "לְמַטָּה בָרִצְפָה בְּאוֹתָהּ הַקֶּרֶן, מָקוֹם הָיָה שָׁם אַמָּה עַל אַמָּה, וְטַבְלָא שֶׁל שַׁיִשׁ, וְטַבַּעַת הָיְתָה קְבוּעָה בָהּ, שֶׁבּוֹ יוֹרְדִין לַשִּׁית וּמְנַקִּין אוֹתוֹ. וְכֶבֶשׁ הָיָה לִדְרוֹמוֹ שֶׁל מִזְבֵּחַ, שְׁלֹשִׁים וּשְׁתַּיִם עַל רֹחַב שֵׁשׁ עֶשְׂרֵה, וּרְבוּבָה הָיְתָה לוֹ בְּמַעֲרָבוֹ, שֶׁשָּׁם הָיוּ נוֹתְנִים פְּסוּלֵי חַטַּאת הָעוֹף:",
    "3:4": "אֶחָד אַבְנֵי הַכֶּבֶשׁ וְאֶחָד אַבְנֵי הַמִּזְבֵּחַ, מִבִּקְעַת בֵּית כָּרֶם. וְחוֹפְרִין לְמַטָּה מֵהַבְּתוּלָה, וּמְבִיאִים מִשָּׁם אֲבָנִים שְׁלֵמוֹת, שֶׁלֹּא הוּנַף עֲלֵיהֶן בַּרְזֶל, שֶׁהַבַּרְזֶל פּוֹסֵל בִּנְגִיעָה. וּבִפְגִימָה לְכָל דָּבָר. נִפְגְּמָה אַחַת מֵהֶן, הִיא פְסוּלָה וְכֻלָּן כְּשֵׁרוֹת. וּמְלַבְּנִים אוֹתָן פַּעֲמַיִם בַּשָּׁנָה, אַחַת בַּפֶּסַח וְאַחַת בֶּחָג. וְהַהֵיכָל, פַּעַם אַחַת, בַּפֶּסַח. רַבִּי אוֹמֵר, כָּל עֶרֶב שַׁבָּת מְלַבְּנִים אוֹתוֹ בְמַפָּה מִפְּנֵי הַדָּמִים. לֹא הָיוּ סָדִין אוֹתָן בְּכָפִיס שֶׁל בַּרְזֶל, שֶׁמָּא יִגַּע וְיִפְסֹל, שֶׁהַבַּרְזֶל נִבְרָא לְקַצֵּר יָמָיו שֶׁל אָדָם, וְהַמִּזְבֵּחַ נִבְרָא לְהַאֲרִיךְ יָמָיו שֶׁל אָדָם, אֵינוֹ בַדִין שֶׁיּוּנַף הַמְקַצֵּר עַל הַמַּאֲרִיךְ:",
    "3:5": "וְטַבָּעוֹת הָיוּ לִצְפוֹנוֹ שֶׁל מִזְבֵּחַ, שִׁשָּׁה סְדָרִים שֶׁל אַרְבַּע אַרְבַּע, וְיֵשׁ אוֹמְרִים, אַרְבָּעָה שֶׁל שֵׁשׁ שֵׁשׁ, שֶׁעֲלֵיהֶן שׁוֹחֲטִין אֶת הַקֳּדָשִׁים. בֵּית הַמִּטְבָּחַיִם הָיָה לִצְפוֹנוֹ שֶׁל מִזְבֵּחַ, וְעָלָיו שְׁמֹנָה עַמּוּדִים נַנָּסִין, וּרְבִיעִין שֶׁל אֶרֶז עַל גַּבֵּיהֶן, וְאֻנְקְלָיוֹת שֶׁל בַּרְזֶל הָיוּ קְבוּעִין בָּהֶם, וּשְׁלֹשָׁה סְדָרִים הָיוּ לְכָל אֶחָד וְאֶחָד, שֶׁבָּהֶם תּוֹלִין. וּמַפְשִׁיטִין עַל שֻׁלְחָנוֹת שֶׁל שַׁיִשׁ שֶׁבֵּין הָעַמּוּדִים:",
    "3:6": "הַכִּיּוֹר הָיָה בֵּין הָאוּלָם וְלַמִּזְבֵּחַ, וּמָשׁוּךְ כְּלַפֵּי הַדָּרוֹם. בֵּין הָאוּלָם וְלַמִּזְבֵּחַ, עֶשְׂרִים וּשְׁתַּיִם אַמָּה. וּשְׁתֵּים עֶשְׂרֵה מַעֲלוֹת הָיוּ שָׁם, רוּם מַעֲלָה חֲצִי אַמָּה, וְשִׁלְחָהּ אַמָּה. אַמָּה אַמָּה וְרֹבֶד שָׁלֹשׁ, וְאַמָּה אַמָּה וְרֹבֶד שָׁלֹשׁ. וְהָעֶלְיוֹנָה, אַמָּה אַמָּה וְרֹבֶד אַרְבַּע. רַבִּי יְהוּדָה אוֹמֵר, הָעֶלְיוֹנָה, אַמָּה אַמָּה וְרֹבֶד חָמֵשׁ:",
    "3:7": "פִּתְחוֹ שֶׁל אוּלָם, גָּבְהוֹ אַרְבָּעִים אַמָּה, וְרָחְבּוֹ עֶשְׂרִים אַמָּה. וְחָמֵשׁ מַלְתְּרָאוֹת שֶׁל מִילָת הָיוּ עַל גַּבָּיו. הַתַּחְתּוֹנָה עוֹדֶפֶת עַל הַפֶּתַח אַמָּה מִזֶּה וְאַמָּה מִזֶּה. שֶׁלְּמַעְלָה מִמֶּנָּה עוֹדֶפֶת עָלֶיהָ אַמָּה מִזֶּה וְאַמָּה מִזֶּה. נִמְצֵאת הָעֶלְיוֹנָה שְׁלֹשִׁים אַמָּה. וְנִדְבָּךְ שֶׁל אֲבָנִים הָיָה בֵין כָּל אַחַת וְאֶחָת:",
    "3:8": "וּכְלוֹנָסוֹת שֶׁל אֶרֶז הָיוּ קְבוּעִין מִכָּתְלוֹ שֶׁל הֵיכָל לְכָתְלוֹ שֶׁל אוּלָם, כְּדֵי שֶׁלֹּא יִבְעָט. וְשַׁרְשְׁרוֹת שֶׁל זָהָב הָיוּ קְבוּעוֹת בְּתִקְרַת הָאוּלָם, שֶׁבָּהֶן פִּרְחֵי כְהֻנָּה עוֹלִין וְרוֹאִין אֶת הָעֲטָרֹת, שֶׁנֶּאֱמַר (זכריה ו), וְהָעֲטָרֹת תִּהְיֶה לְחֵלֶם וּלְטוֹבִיָּה וְלִידַעְיָה וּלְחֵן בֶּן צְפַנְיָה לְזִכָּרוֹן בְּהֵיכַל ה'. גֶּפֶן שֶׁל זָהָב הָיְתָה עוֹמֶדֶת עַל פִּתְחוֹ שֶׁל הֵיכָל, וּמֻדְלָה עַל גַּבֵּי כְלוֹנָסוֹת. כָּל מִי שֶׁהוּא מִתְנַדֵּב עָלֶה, אוֹ גַרְגִּיר, אוֹ אֶשְׁכּוֹל, מֵבִיא וְתוֹלֶה בָהּ. אָמַר רַבִּי אֱלִיעֶזֶר בְּרַבִּי צָדוֹק, מַעֲשֶׂה הָיָה, וְנִמְנוּ עָלֶיהָ שְׁלֹשׁ מֵאוֹת כֹּהֲנִים:",
    "4:1": "פִּתְחוֹ שֶׁל הֵיכָל, גָּבְהוֹ עֶשְׂרִים אַמָּה וְרָחְבּוֹ עֶשֶׂר אַמּוֹת. וְאַרְבַּע דְּלָתוֹת הָיוּ לוֹ, שְׁתַּיִם בִּפְנִים וּשְׁתַּיִם בַּחוּץ, שֶׁנֶאֱמַר (יחזקאל מא), וּשְׁתַּיִם דְּלָתוֹת לַהֵיכָל וְלַקֹּדֶשׁ. הַחִיצוֹנוֹת נִפְתָּחוֹת לְתוֹךְ הַפֶּתַח לְכַסּוֹת עָבְיוֹ שֶׁל כֹּתֶל, וְהַפְּנִימִיּוֹת נִפְתָּחוֹת לְתוֹךְ הַבַּיִת לְכַסּוֹת אַחַר הַדְּלָתוֹת, שֶׁכָּל הַבַּיִת טוּחַ בְּזָהָב, חוּץ מֵאַחַר הַדְּלָתוֹת. רַבִּי יְהוּדָה אוֹמֵר, בְּתוֹךְ הַפֶּתַח הָיוּ עוֹמְדוֹת, וּכְמִין אִצְטְרָמִיטָה הָיוּ, וְנִקְפָּלוֹת לַאֲחוֹרֵיהֶן, אֵלּוּ שְׁתֵּי אַמּוֹת וּמֶחֱצָה, וְאֵלּוּ שְׁתֵּי אַמּוֹת וּמֶחֱצָה, חֲצִי אַמָּה מְזוּזָה מִכָּאן, וַחֲצִי אַמָּה מְזוּזָה מִכָּאן, שֶׁנֶּאֱמַר (שם), וּשְׁתַּיִם דְּלָתוֹת לַדְּלָתוֹת שְׁתַּיִם מוּסַבּוֹת דְּלָתוֹת, שְׁתַּיִם לְדֶלֶת אֶחָת וּשְׁתֵּי דְלָתוֹת לָאַחֶרֶת:",
    "4:2": "וּשְׁנֵי פִשְׁפָּשִׁין הָיוּ לוֹ לַשַּׁעַר הַגָּדוֹל, אֶחָד בַּצָּפוֹן, וְאֶחָד בַּדָּרוֹם. שֶׁבַּדָּרוֹם, לֹא נִכְנַס בּוֹ אָדָם מֵעוֹלָם, וְעָלָיו הוּא מְפֹרָשׁ עַל יְדֵי יְחֶזְקֵאל, שֶׁנֶּאֱמַר (שם מד), וַיֹּאמֶר אֵלַי ה' הַשַּׁעַר הַזֶּה סָגוּר יִהְיֶה לֹא יִפָּתֵחַ וְאִישׁ לֹא יָבֹא בוֹ כִּי ה' אֱלֹהֵי יִשְׂרָאֵל בָּא בוֹ וְהָיָה סָגוּר. נָטַל אֶת הַמַּפְתֵּחַ וּפָתַח אֶת הַפִּשְׁפָּשׁ, וְנִכְנַס לְהַתָּא, וּמֵהַתָּא לַהֵיכָל. רַבִּי יְהוּדָה אוֹמֵר, בְּתוֹךְ עָבְיוֹ שֶׁל כֹּתֶל הָיָה מְהַלֵּךְ, עַד שֶׁנִּמְצָא עוֹמֵד בֵּין שְׁנֵי הַשְּׁעָרִים, וּפָתַח אֶת הַחִיצוֹנוֹת מִבִּפְנִים וְאֶת הַפְּנִימִיּוֹת מִבַּחוּץ:",
    "4:3": "וּשְׁלֹשִׁים וּשְׁמֹנָה תָאִים הָיוּ שָׁם, חֲמִשָּׁה עָשָׂר בַּצָּפוֹן, חֲמִשָּׁה עָשָׂר בַּדָּרוֹם, וּשְׁמֹנָה בַּמַּעֲרָב. שֶׁבַּצָּפוֹן וְשֶׁבַּדָּרוֹם, חֲמִשָּׁה עַל גַּבֵּי חֲמִשָּׁה, וַחֲמִשָּׁה עַל גַּבֵּיהֶם. וְשֶׁבַּמַּעֲרָב, שְׁלֹשָׁה עַל גַּבֵּי שְׁלֹשָׁה, וּשְׁנַיִם עַל גַּבֵּיהֶם. וּשְׁלֹשָׁה פְתָחִים הָיוּ לְכָל אֶחָד וְאֶחָד, אֶחָד לַתָּא מִן הַיָּמִין, וְאֶחָד לַתָּא מִן הַשְּׂמֹאל, וְאֶחָד לַתָּא שֶׁעַל גַּבָּיו. וּבְקֶרֶן מִזְרָחִית צְפוֹנִית הָיוּ חֲמִשָּׁה פְתָחִים, אֶחָד לַתָּא מִן הַיָּמִין, וְאֶחָד לַתָּא שֶׁעַל גַּבָּיו, וְאֶחָד לַמְּסִבָּה, וְאֶחָד לַפִּשְׁפָּשׁ, וְאֶחָד לַהֵיכָל:",
    "4:4": "הַתַּחְתּוֹנָה, חָמֵשׁ, וְרֹבֶד שֵׁשׁ. וְהָאֶמְצָעִית, שֵׁשׁ, וְרֹבֶד שֶׁבַע. וְהָעֶלְיוֹנָה, שֶׁבַע, שֶׁנֶּאֱמַר (מלכים א ו), הַיָּצִיעַ הַתַּחְתּוֹנָה חָמֵשׁ בָּאַמָּה רָחְבָּהּ וְהַתִּיכֹנָה שֵׁשׁ בָּאַמָּה רָחְבָּהּ וְהַשְּׁלִישִׁית שֶׁבַע בָּאַמָּה רָחְבָּה:",
    "4:5": "וּמְסִבָּה הָיְתָה עוֹלָה מִקֶּרֶן מִזְרָחִית צְפוֹנִית לְקֶרֶן צְפוֹנִית מַעֲרָבִית, שֶׁבָּהּ הָיוּ עוֹלִים לְגַגּוֹת הַתָּאִים. הָיָה עוֹלֶה בַּמְּסִבָּה וּפָנָיו לַמַּעֲרָב. הָלַךְ עַל כָּל פְּנֵי הַצָּפוֹן, עַד שֶׁהוּא מַגִּיעַ לַמַּעֲרָב. הִגִּיעַ לַמַּעֲרָב, וְהָפַךְ פָּנָיו לַדָּרוֹם. הָלַךְ כָּל פְּנֵי מַעֲרָב עַד שֶׁהוּא מַגִּיעַ לַדָּרוֹם. הִגִּיעַ לַדָּרוֹם, וְהָפַךְ פָּנָיו לַמִּזְרָח. הָיָה מְהַלֵּךְ בַּדָּרוֹם, עַד שֶׁהוּא מַגִּיעַ לְפִתְחָהּ שֶׁל עֲלִיָּה, שֶׁפִּתְחָהּ שֶׁל עֲלִיָּה פָּתוּחַ לַדָּרוֹם. וּבְפִתְחָהּ שֶׁל עֲלִיָּה הָיוּ שְׁנֵי כְלוֹנָסוֹת שֶׁל אֶרֶז, שֶׁבָּהֶן הָיוּ עוֹלִין לְגַגָּהּ שֶׁל עֲלִיָּה. וְרָאשֵׁי פִסְפָּסִין מַבְדִּילִים בָּעֲלִיָּה בֵּין הַקֹּדֶשׁ לְבֵין קֹדֶשׁ הַקֳּדָשִׁים. וְלוּלִין הָיוּ פְתוּחִין בָּעֲלִיָּה לְבֵית קֹדֶשׁ הַקֳּדָשִׁים, שֶׁבָּהֶן הָיוּ מְשַׁלְשְׁלִין אֶת הָאֻמָּנִים בְּתֵבוֹת, כְּדֵי שֶׁלֹּא יָזוּנוּ עֵינֵיהֶן מִבֵּית קָדְשֵׁי הַקֳּדָשִׁים:",
    "4:6": "וְהַהֵיכָל מֵאָה עַל מֵאָה, עַל רוּם מֵאָה. הָאֹטֶם שֵׁשׁ אַמּוֹת, וְגָבְהוֹ אַרְבָּעִים אַמָּה, אַמָּה כִּיּוּר, וְאַמָּתַיִם בֵּית דִּלְפָה, וְאַמָּה תִּקְרָה, וְאַמָּה מַעֲזִיבָה, וְגֹבַהּ שֶׁל עֲלִיָּה אַרְבָּעִים אַמָּה, וְאַמָּה כִּיּוּר, וְאַמָּתַיִם בֵּית דִּלְפָה, וְאַמָּה תִּקְרָה, וְאַמָּה מַעֲזִיבָה, וְשָׁלֹשׁ אַמּוֹת מַעֲקֶה, וְאַמָּה כָּלֵה עוֹרֵב, רַבִּי יְהוּדָה אוֹמֵר, לֹא הָיָה כָלֵה עוֹרֵב עוֹלֶה מִן הַמִּדָּה, אֶלָּא אַרְבַּע אַמּוֹת הָיָה מַעֲקֶה:",
    "4:7": "מֵהַמִּזְרָח לַמַּעֲרָב מֵאָה אַמָּה, כֹּתֶל הָאוּלָם חָמֵשׁ, וְהָאוּלָם אַחַד עָשָׂר, כֹּתֶל הַהֵיכָל שֵׁשׁ, וְתוֹכוֹ אַרְבָּעִים אַמָּה, אַמָּה טְרַקְסִין, וְעֶשְׂרִים אַמָּה בֵּית קֹדֶשׁ הַקֳּדָשִׁים, כֹּתֶל הַהֵיכָל שֵׁשׁ, וְהַתָּא שֵׁשׁ, וְכֹתֶל הַתָּא חָמֵשׁ. מִן הַצָּפוֹן לַדָּרוֹם שִׁבְעִים אַמָּה, כֹּתֶל הַמְּסִבָּה חָמֵשׁ, וְהַמְּסִבָּה שָׁלֹשׁ, כֹּתֶל הַתָּא חָמֵשׁ, וְהַתָּא שֵׁשׁ, כֹּתֶל הַהֵיכָל שֵׁשׁ, וְתוֹכוֹ עֶשְׂרִים אַמָּה, כֹּתֶל הַהֵיכָל שֵׁשׁ, וְהַתָּא שֵׁשׁ, וְכֹתֶל הַתָּא חָמֵשׁ, וּבֵית הוֹרָדַת הַמַּיִם שָׁלֹשׁ אַמּוֹת, וְהַכֹּתֶל חָמֵשׁ אַמּוֹת. הָאוּלָם עוֹדֵף עָלָיו חֲמֵשׁ עֶשְׂרֵה אַמָּה מִן הַצָּפוֹן, וַחֲמֵשׁ עֶשְׂרֵה אַמָּה מִן הַדָּרוֹם, וְהוּא הָיָה נִקְרָא בֵּית הַחֲלִיפוֹת, שֶׁשָּׁם גּוֹנְזִים אֶת הַסַּכִּינִים. וְהַהֵיכָל צַר מֵאַחֲרָיו, וְרָחָב מִלְּפָנָיו, וְדוֹמֶה לַאֲרִי, שֶׁנֶּאֱמַר (ישעיה כט), הוֹי אֲרִיאֵל אֲרִיאֵל קִרְיַת חָנָה דָוִד, מָה הָאֲרִי צַר מֵאַחֲרָיו וְרָחָב מִלְּפָנָיו, אַף הַהֵיכָל צַר מֵאַחֲרָיו וְרָחָב מִלְּפָנָיו:",
    "5:1": "כָּל הָעֲזָרָה הָיְתָה אֹרֶךְ מֵאָה וּשְׁמוֹנִים וָשֶׁבַע עַל רֹחַב מֵאָה וּשְׁלֹשִׁים וְחָמֵשׁ. מִן הַמִּזְרָח לַמַּעֲרָב מֵאָה וּשְׁמוֹנִים וָשֶׁבַע, מְקוֹם דְּרִיסַת יִשְׂרָאֵל אַחַת עֶשְׂרֵה אַמָּה, מְקוֹם דְּרִיסַת הַכֹּהֲנִים אַחַת עֶשְׂרֵה אַמָּה, הַמִּזְבֵּחַ שְׁלֹשִׁים וּשְׁתַּיִם, בֵּין הָאוּלָם וְלַמִּזְבֵּחַ עֶשְׂרִים וּשְׁתַּיִם אַמָּה, הַהֵיכָל מֵאָה אַמָּה, וְאַחַת עֶשְׂרֵה אַמָּה לַאֲחוֹרֵי בֵית הַכַּפֹּרֶת:",
    "5:2": "מִן הַצָּפוֹן לַדָּרוֹם מֵאָה וּשְׁלֹשִׁים וְחָמֵשׁ, הַכֶּבֶשׁ וְהַמִּזְבֵּחַ שִׁשִּׁים וּשְׁתַּיִם. מִן הַמִּזְבֵּחַ לַטַּבָּעוֹת שְׁמֹנֶה אַמּוֹת, מְקוֹם הַטַּבָּעוֹת עֶשְׂרִים וְאַרְבַּע, מִן הַטַּבָּעוֹת לַשֻּׁלְחָנוֹת אַרְבַּע, מִן הַשֻּׁלְחָנוֹת וְלַנַּנָּסִין אַרְבַּע. מִן הַנַּנָּסִין לְכֹתֶל הָעֲזָרָה שְׁמֹנֶה אַמּוֹת, וְהַמּוֹתָר בֵּין הַכֶּבֶשׁ לַכֹּתֶל וּמְקוֹם הַנַּנָּסִין:",
    "5:3": "שֵׁשׁ לְשָׁכוֹת הָיוּ בָעֲזָרָה, שָׁלֹשׁ בַּצָּפוֹן וְשָׁלֹשׁ בַּדָּרוֹם. שֶׁבַּצָּפוֹן, לִשְׁכַּת הַמֶּלַח, לִשְׁכַּת הַפַּרְוָה, לִשְׁכַּת הַמְדִיחִים. לִשְׁכַּת הַמֶּלַח, שָׁם הָיוּ נוֹתְנִים מֶלַח לַקָּרְבָּן. לִשְׁכַּת הַפַּרְוָה, שָׁם הָיוּ מוֹלְחִין עוֹרוֹת קָדָשִׁים, וְעַל גַּגָּהּ הָיָה בֵית הַטְּבִילָה לְכֹהֵן גָּדוֹל בְּיוֹם הַכִּפּוּרִים. לִשְׁכַּת הַמְדִיחִין, שֶׁשָּׁם הָיוּ מְדִיחִין קִרְבֵי הַקֳּדָשִׁים. וּמִשָּׁם מְסִבָּה עוֹלָה לְגַג בֵּית הַפַּרְוָה:",
    "5:4": "שֶׁבַּדָּרוֹם, לִשְׁכַּת הָעֵץ, לִשְׁכַּת הַגּוֹלָה, לִשְׁכַּת הַגָּזִית. לִשְׁכַּת הָעֵץ, אָמַר רַבִּי אֱלִיעֶזֶר בֶּן יַעֲקֹב, שָׁכַחְתִּי מֶה הָיְתָה מְשַׁמֶּשֶׁת. אַבָּא שָׁאוּל אוֹמֵר, לִשְׁכַּת כֹּהֵן גָּדוֹל, וְהִיא הָיְתָה אֲחוֹרֵי שְׁתֵּיהֶן, וְגַג שְׁלָשְׁתָּן שָׁוֶה. לִשְׁכַּת הַגּוֹלָה, שָׁם הָיָה בוֹר קָבוּעַ, וְהַגַּלְגַּל נָתוּן עָלָיו, וּמִשָּׁם מַסְפִּיקִים מַיִם לְכָל הָעֲזָרָה. לִשְׁכַּת הַגָּזִית, שָׁם הָיְתָה סַנְהֶדְרִי גְדוֹלָה שֶׁל יִשְׂרָאֵל יוֹשֶׁבֶת וְדָנָה אֶת הַכְּהֻנָּה, וְכֹהֵן שֶׁנִּמְצָא בוֹ פְסוּל, לוֹבֵשׁ שְׁחוֹרִים וּמִתְעַטֵּף שְׁחוֹרִים, וְיוֹצֵא וְהוֹלֵךְ לוֹ. וְשֶׁלֹּא נִמְצָא בוֹ פְסוּל, לוֹבֵשׁ לְבָנִים וּמִתְעַטֵּף לְבָנִים, נִכְנָס וּמְשַׁמֵּשׁ עִם אֶחָיו הַכֹּהֲנִים. וְיוֹם טוֹב הָיוּ עוֹשִׂים, שֶׁלֹּא נִמְצָא פְסוּל בְּזַרְעוֹ שֶׁל אַהֲרֹן הַכֹּהֵן, וְכָךְ הָיוּ אוֹמְרִים, בָּרוּךְ הַמָּקוֹם בָּרוּךְ הוּא, שֶׁלֹּא נִמְצָא פְסוּל בְּזַרְעוֹ שֶׁל אַהֲרֹן. וּבָרוּךְ הוּא, שֶׁבָּחַר בְּאַהֲרֹן וּבְבָנָיו לַעֲמֹד לְשָׁרֵת לִפְנֵי ה' בְּבֵית קָדְשֵׁי הַקֳּדָשִׁים:"
  };
  // 1.0.1-L (L.78-L.81): the throne's slides. pesukim = the default version's text (the verses with Rashi first, then Radak, Metzudat David, Ralbag,
  // Malbim, Abarbanel; every quotation from the Otzaria library: 3673:610-613, 3540:683, 3345:939, 944, 3645:462, 3394:624, 3574:563, 3318:493), the
  // topics mode's plain slide and the verse slide of 10:18-20; lead / leadW = the few words before a timeline's captions (the captions themselves,
  // the midrash's own words, are ctx.shared.throne.script / witnessScript of 60-palace.js); refs = the slide's source links
  var tour_THRONE = { pesukim: "", lead: {}, leadW: "", refs: {} };   // Beit Sheni: no throne (First Temple only); the engine's branches are guarded
  var tour_SHORT = {};
  // 1.0.1-L (L.88): the exhibit's slides. The stand's own axis (x -60; flyPoints.kelim stands 5 east of it to clear the panel, which is closed here); same line of sight, moved 5 west
  var tour_KELIM_GO = [{ pos: [-60, 21, -78], target: [-60, 4.5, -120], f: "kelim" }, { fp: "kelim", f: "kelim" }];
  // 1.0.1-L (L.80, the user: "זהו מקור לכאו' לכך שהכל פעל עפ"י חשמל - ציין זאת כבועה בתוך המצגת"): the inference, marked "לכאורה" and apart from the quotation, is
  // never the Ben Ish Chai's own statement: he speaks of the tower in the air and not of the throne; his words: בן יהוידע על סנהדרין קו: (book 2546, line 778,
  // letter for letter); the Gemara's line "ארבע מאה בעיי בעו דואג ואחיתופל במגדל הפורח באויר": book 125, line 4140
  var tour_BUBBLE = { quote: "", mark: "", inference: "", refs: [] };
  var tour_KINGS = [
    { v: [1, 1, 1], t: "שמירת המקדש", go: [{"place": "המשמרות — שלושה לכהנים ועשרים ואחד ללויים", "act": true}, {"fp": "harHabayit"}],
      x: "הכהנים שומרים בשלושה מקומות — בית אבטינס ובית הניצוץ (עליות על גבי שערים) ובית המוקד (כיפה) — והלויים בעשרים ואחד מקום: על שערי הר הבית ופינותיו מבפנים, על שערי העזרה ופינותיה מבחוץ, ובלשכות. השמירה אינה מפני גנבים אלא כבוד למקדש: 'אינו דומה פלטרין שיש עליו שומרין לפלטרין שאין עליו שומרין' (רמב״ם בית הבחירה ח, א). במודל: מקומות המשמר יסומנו בשלב הבא.",
      r: [["רמב״ם בית הבחירה ח, א", ["RB", 8, 1]], ["רמב״ם בית הבחירה ח, ד", ["RB", 8, 4]], ["תמיד א, א", ["MN", 88, 1, 1]]] },
    { v: [1, 2, 2], t: "איש הר הבית", go: [{"pos": [-20, 250, 150], "target": [-20, 20, 0], "lay": "guards"}, {"fp": "harHabayit"}],
      x: "הממונה על השומרים מחזר בלילה על כל משמר ואבוקות לפניו. שומר שאינו עומד — חובטו במקלו, ורשות בידו לשרוף את כסותו; לכן אמרו 'קול בעזרה — קול בן לוי לוקה ובגדיו נשרפין'. הרמב״ם (ח, י): 'ומעמידין ממונה אחד על כל משמרות השומרים ואיש הר הבית היה נקרא'.",
      r: [["רמב״ם בית הבחירה ח, י", ["RB", 8, 10]]] },
    { v: [1, 3, 3], t: "חמישה שערים להר הבית", go: [{"fp": "harHabayit"}],
      x: "שני שערי חולדה מן הדרום — לכניסה וליציאה; קיפונוס מן המערב; טדי מן הצפון — 'לא היה משמש כלום'; והשער המזרחי שעליו שושן הבירה צורה, שבו כהן גדול השורף את הפרה יוצא להר המשחה. כל השערים במודל מרובעים ומשקוף אבן על גביהם, ושער טדי — שתי אבנים מוטות זו על זו (מידות ב, ג).",
      r: [["רמב״ם בית הבחירה ה, ב", ["RB", 5, 2]], ["מידות ב, ג", ["MI", 2, 3]]],
      then: [{"go": [{"pos": [55, 24, 436], "target": [55, 10, 340]}], "at": 0.2, "dur": 1500}, {"go": [{"pos": [-204, 16, 0], "target": [-154, 10, 0]}], "at": 0.4, "dur": 1500}, {"go": [{"pos": [55, 16, -224], "target": [55, 13, -174.5]}], "at": 0.6, "dur": 1500}, {"go": [{"pos": [455, 24, -88], "target": [392, -4, 0]}], "at": 0.8, "dur": 1500}] },
    { v: [1, 4, 4], t: "שבעה שערים לעזרה", go: [{"fp": "azarah"}],
      x: "שלושה בצפון, שלושה בדרום ואחד במזרח. בדרום: שער הדלק (שבו מכניסים עצים למערכה), שער הבכורות (שבו מכניסים את הבכורות לשחיטה), שער המים (שבו מכניסים צלוחית של מים לניסוך בחג). במזרח שער ניקנור, ושתי לשכות לו — לשכת פנחס המלביש ולשכת עושי חביתין; ולשכות היו תחת עזרת ישראל, ופתוחות לעזרת הנשים, ששם הלוים נותנים כינורות ונבלים ומצלתיים (מידות ב, ו) — במודל, מתחת לשתי הלשכות. מקומם של שערי הצפון והדרום בכותל — 'סמוכים למערב' לפי המשנה והרמב״ם — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ה, ד", ["RB", 5, 4]], ["שקלים ו, ג", ["MN", 54, 6, 3]], ["מידות ב, ו", ["MI", 2, 6]]] },
    { v: [1, 5, 5], t: "שערי הצפון: הניצוץ, הקרבן ובית המוקד", go: [{"place": "שער הניצוץ"}, {"fp": "azarah"}],
      x: "שער הניצוץ — כמין אכסדרה, ועלייה בנויה על גביו: הכהנים שומרים מלמעלה והלויים מלמטה, ופתח היה לו לחיל. שני לו שער הקרבן, שלישי לו בית המוקד — שהוא עצמו היה השער, ופתחו לעזרה הוא השער השלישי (ראה בתפריט, תחת ״שיטות ומחלוקות״).",
      r: [["רמב״ם בית הבחירה ה, ד", ["RB", 5, 4]], ["רמב״ם בית הבחירה ח, ה", ["RB", 8, 5]]] },
    { v: [1, 6, 6], t: "ארבע לשכות בית המוקד", go: [{"place": "בית המוקד", "act": true}],
      x: "כקיטוניות הפתוחות לטרקלין: דרומית־מערבית — לשכת טלאי קרבן התמיד; דרומית־מזרחית — לשכת עושי לחם הפנים; צפונית־מזרחית — שם גנזו בני חשמונאי את אבני המזבח ששיקצום מלכי יוון; צפונית־מערבית — בה יורדים לבית הטבילה. שתיים בקודש ושתיים בחול, וראשי פספסין מבדילים.",
      r: [["תמיד ג, ג", ["MN", 88, 3, 3]], ["רמב״ם בית הבחירה ה, יא", ["RB", 5, 11]]] },
    { v: [1, 7, 7], t: "שני שערים לבית המוקד", go: [{"pos": [8, 66, -112], "target": [-15, 17, -69]}, {"place": "בית המוקד", "act": true}],
      x: "פתח אחד לחיל ופתח אחד לעזרה. בשער הפתוח לעזרה פשפש קטן, שבו נכנסים לבלוש את העזרה בבוקר קודם פתיחת השערים (תמיד א, ג). במודל שני הפתחים נוספו בתיקון 1.0.6.",
      r: [["תמיד א, ג", ["MN", 88, 1, 3]]],
      then: [{"go": [{"place": "שער בית המוקד — פתחו של הבית לעזרה"}], "at": 0.5, "dur": 1500}] },
    { v: [1, 8, 8], t: "בית המוקד — כיפה ורובדין", go: [{"place": "בית המוקד", "act": true}],
      x: "בית גדול מוקף רובדין של אבן — מדרגות־אצטבאות — שבהן ישנים זקני בית אב, ומפתחות העזרה בידם; פרחי כהונה ישנים על הרצפה, 'איש כסתו בארץ'. שמו על שם המדורה הגדולה שדלקה בו לחמם את הכהנים ההולכים יחפים על הרצפה.",
      r: [["תמיד א, א", ["MN", 88, 1, 1]], ["רמב״ם בית הבחירה ח, ה", ["RB", 8, 5]]],
      then: [{"go": [{"pos": [-18, 28.56, -64.16], "target": [-18, 16, -67.5]}], "at": 0.5, "dur": 1500}] },
    { v: [1, 9, 9], t: "מקום המפתחות ובית הטבילה", go: [{"place": "בית המוקד", "act": true}],
      x: "מקום היה שם אמה על אמה, וטבלא של שיש וטבעת קבועה בה ושלשלת שהמפתחות תלויות בה; הגיע זמן הנעילה — הגביה את הטבלא בטבעת, נטל את המפתחות, נעל, והחזיר את המפתחות והטבלא למקומן, וכסתו עליהן. מי שאירע בו קרי — יורד במסיבה ההולכת תחת הבירה לבית הטבילה, ונרות דולקים מכאן ומכאן.",
      r: [["תמיד א, א", ["MN", 88, 1, 1]], ["רמב״ם בית הבחירה ה, יא", ["RB", 5, 11]]],
      then: [{"go": [{"pos": [-20, 23.6, -68.19], "target": [-20, 14.9, -70.5]}], "at": 0.5, "dur": 1500}] },
    { v: [2, 1, 1], t: "הר הבית — חמש מאות על חמש מאות", go: [{"fp": "harHabayit"}],
      x: "רובו מן הדרום, שני לו מן המזרח, שלישי לו מן הצפון, ומיעוטו מן המערב — 'מקום שהיה רוב מדתו שם היה רוב תשמישו'. במודל: העזרה מוסטת לצפון־מערב ההר בהתאם, והסטיו המלכותי ושערי חולדה בדרום הרחב.",
      r: [["רמב״ם בית הבחירה ה, א", ["RB", 5, 1]], ["רמב״ם בית הבחירה ה, ו", ["RB", 5, 6]]] },
    { v: [2, 2, 2], t: "הנכנסים להר הבית", go: [{"place": "שערי חולדה"}, {"fp": "harHabayit"}],
      x: "כל הנכנסים נכנסים דרך ימין, מקיפים ויוצאים דרך שמאל — חוץ ממי שאירעו דבר (אבל ומנודה), שמקיף לשמאל, וכשרואים אותו מקיף לשמאל שואלים 'מה לך מקיף לשמאל?' ומברכים אותו: 'השוכן בבית הזה ינחמך'.",
      r: [["רמב״ם בית הבחירה ז, ג", ["RB", 7, 3]]] },
    { v: [2, 3, 3], t: "הסורג והחיל", go: [{"place": "הסורג"}, {"fp": "ezratNashim"}],
      x: "לפנים מן החומה הסורג — מחיצת שתי וערב גבוהה עשרה טפחים — ובו שלוש עשרה פרצות שפרצו מלכי יוון, וחזרו וגדרום וגזרו כנגדן שלוש עשרה השתחוויות. לפנים ממנו החיל, עשר אמות, ושתים עשרה מעלות — רום מעלה חצי אמה ושלחה חצי אמה. כל הפתחים גובהם עשרים אמה ורוחבם עשר חוץ משל אולם; כל השערים מצופים זהב חוץ משער ניקנור, שנעשה בהם נס (יומא לח.). מקומן של שתים עשרה המעלות — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ה, ג", ["RB", 5, 3]], ["יומא לח.", ["P", 107, "לח."]]] },
    { v: [2, 4, 4], t: "כותל המזרח הנמוך", go: [{"place": "שער שושן"}, {"fp": "shushanGate"}],
      x: "כל הכתלים גבוהים חוץ מכותל המזרחי — שהכהן השורף את הפרה עומד בראש הר המשחה ומתכוון ורואה בפתחו של היכל בשעת הזאת הדם. הוא כותל המזרח של הר הבית, שבו שער שושן (רש״י וברטנורא). לרמב״ם רק הכותל שעל גבי השער נמוך; לתפארת ישראל כל הכותל מעט יותר מעשרים; לפסקי תוספות שש אמות; לרבינו שמעיה — כותל החיל, כעשר אמות. כל השיטות — בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ו, ה", ["RB", 6, 5]], ["פרה ג, ט", ["MN", 94, 3, 9]]] },
    { v: [2, 5, 5], t: "עזרת נשים", go: [{"place": "עזרת נשים", "act": true}, {"fp": "ezratNashim"}],
      x: "אורך מאה ושלושים וחמש על רוחב מאה ושלושים וחמש, וארבע לשכות בארבע מקצועותיה של ארבעים אמה: לשכת הנזירים (דרומית־מזרחית), לשכת העצים (צפונית־מזרחית), לשכת המצורעים (צפונית־מערבית), לשכת בית שמניא (דרומית־מערבית). חלקה היתה בראשונה והקיפוה כצוצרה, שהנשים רואות מלמעלן. חמש עשרה מעלות עולות ממנה לעזרת ישראל, כנגד חמש עשרה שיר המעלות, שעליהן הלויים אומרים בשיר — לא טרוטות אלא מוקפות כחצי גורן עגולה.",
      r: [["רמב״ם בית הבחירה ה, ז", ["RB", 5, 7]], ["רמב״ם בית הבחירה ה, ח", ["RB", 5, 8]], ["סוכה ה, ד", ["MN", 56, 5, 4]]] },
    { v: [2, 6, 6], t: "עזרת ישראל, הדוכן ולשכות העזרה", go: [{"place": "דוכן הלויים", "act": true}, {"fp": "azarah"}],
      x: "עזרת ישראל מאה ושלושים וחמש על אחת עשרה, וכן עזרת הכהנים; ראשי פספסין מבדילים ביניהן, ורבי אליעזר בן יעקב אומר: מעלה היתה שם גבוהה אמה והדוכן נתון עליה ובה שלוש מעלות של חצי חצי אמה — וכך במודל (רמב״ם ו, ג). שש לשכות בעזרה, שלוש בצפון ושלוש בדרום; לשכת הגזית — בצפון (יומא יט.; רמב״ם ה, יז).",
      r: [["רמב״ם בית הבחירה ו, ג", ["RB", 6, 3]], ["רמב״ם בית הבחירה ה, יז", ["RB", 5, 17]], ["יומא יט.", ["P", 107, "יט."]]] },
    { v: [3, 1, 1], t: "המזבח", go: [{"place": "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28", "act": true}, {"fp": "mizbeach"}],
      x: "שלושים ושתיים על שלושים ושתיים: עלה אמה וכנס אמה — זה היסוד; חמש וכנס אמה — זה הסובב; שלוש וכנס אמה — מקום הקרנות, אמה מכאן ואמה מכאן, ומקום הילוך רגלי הכהנים אמה מכאן ואמה מכאן; נמצא מקום המערכה עשרים ושמונה על עשרים ושמונה. היסוד מהלך על פני כל הצפון וכל המערב ואוכל בדרום אמה אחת ובמזרח אמה אחת. רבי יוסי: מתחילה היה עשרים ושמונה, וכשעלו בני הגולה הוסיפו עליו ארבע אמות מן הדרום וארבע מן המערב כמין גמא — 'והאריאל שתים עשרה' (יחזקאל מג).",
      r: [["רמב״ם בית הבחירה ב, ה", ["RB", 2, 5]], ["רמב״ם בית הבחירה ב, ז", ["RB", 2, 7]], ["זבחים סא:", ["P", 130, "סא:"]]] },
    { v: [3, 2, 2], t: "נקבי היסוד", go: [{"place": "השיתין — שני הנקבים וטבלת השיש"}, {"fp": "mizbeach"}],
      x: "בקרן מערבית־דרומית שני נקבים כמין שני חוטמין דקין, שהדמים הניתנים על יסוד מערבי ועל יסוד דרומי יורדים בהם ומתערבים באמה ויוצאים לנחל קדרון — ונמכרים לגננים לזבל (יומא ה, ו). הכיוון: שיירי הדם של החיצון ליסוד דרומי, ושל הפנימי ליסוד מערבי (יומא נח:).",
      r: [["רמב״ם בית הבחירה ב, יא", ["RB", 2, 11]], ["יומא ה, ו", ["MN", 55, 5, 6]], ["יומא נח:", ["P", 107, "נח:"]]] },
    { v: [3, 3, 3], t: "הטבלא, השיתין והכבש", go: [{"place": "הכבש הגדול"}, {"fp": "mizbeach"}],
      x: "למטה ברצפה באותה הקרן מקום אמה על אמה, וטבלא של שיש וטבעת קבועה בה, שבו יורדים לשית ומנקים אותו. כבש היה לדרומו של מזבח, שלושים ושתיים על רוחב שש עשרה, ורבובה היתה לו במערבו — חלון שבו נותנים פסולי חטאת העוף עד שתעובר צורתם. שני כבשים קטנים יוצאים ממנו, אחד לסובב ואחד ליסוד (רמב״ם ב, יד) — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ב, יב", ["RB", 2, 12]], ["רמב״ם בית הבחירה ב, יג", ["RB", 2, 13]], ["רמב״ם בית הבחירה ב, יד", ["RB", 2, 14]]] },
    { v: [3, 4, 4], t: "אבני המזבח והכבש", go: [{"fp": "mizbeach"}],
      x: "אחד אבני הכבש ואחד אבני המזבח — מבקעת בית כרם, חופרים למטה מן הבתולה ומביאים אבנים שלמות שלא הונף עליהן ברזל, שהברזל פוסל בנגיעה ופגימה בכל דבר. אבן שנפגמה — פסולה, וחברותיה כשרות. מלבנים אותן פעמיים בשנה, בפסח ובחג, וההיכל פעם אחת בפסח; רבי אומר: כל ערב שבת מלבנים אותן במפה מפני הדמים. לא היו סדים אותן בכפיס של ברזל, 'שלא יגע בהן הברזל ויפסול'.",
      r: [["רמב״ם בית הבחירה א, יד", ["RB", 1, 14]], ["רמב״ם בית הבחירה א, טז", ["RB", 1, 16]]] },
    { v: [3, 5, 5], t: "הטבעות, השולחנות והננסין", go: [{"place": "בית המטבחים"}, {"fp": "azarah"}],
      x: "טבעות היו לצפונו של מזבח — שש סדרים של ארבע ארבע, ויש אומרים ארבע של שש שש — שעליהן שוחטים את הקדשים: מכניסים צוואר הבהמה לטבעת. בית המטבחיים לצפונו של מזבח: שמונה עמודים ננסים ורביעים של ארז על גביהם, ואונקליות של ברזל קבועים בהם, ושלושה סדרים לכל אחד — שבהם תולים ומפשיטים, על שולחנות של שיש שבין העמודים.",
      r: [["רמב״ם בית הבחירה ה, יד", ["RB", 5, 14]], ["רמב״ם בית הבחירה ה, טו", ["RB", 5, 15]], ["תמיד ג, ה", ["MN", 88, 3, 5]]] },
    { v: [3, 6, 6], t: "הכיור ומעלות האולם", go: [{"place": "הכיור"}, {"fp": "ulam"}],
      x: "הכיור בין האולם ולמזבח, משוך כלפי הדרום (זבחים נט.). בין האולם ולמזבח עשרים ושתיים אמה, ושתים עשרה מעלות — רום מעלה חצי אמה ושלחה אמה — אמה אמה ורובד שלוש, אמה אמה ורובד שלוש, והעליונה אמה אמה ורובד ארבע; רבי יהודה אומר: העליונה אמה אמה ורובד חמש. ברטנורא (כמו במודל), תפארת ישראל או הרמב״ם — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ו, ד", ["RB", 6, 4]], ["רמב״ם בית הבחירה ג, יח", ["RB", 3, 18]], ["זבחים נט.", ["P", 130, "נט."]]] },
    { v: [3, 7, 7], t: "פתחו של אולם", go: [{"pos": [78, 48, 0], "target": [15, 52, 0]}, {"fp": "ulam"}],
      x: "גובהו ארבעים אמה ורוחבו עשרים, וחמש מלתראות של מילה — קורות מגולפות של עץ מילה — על גביו: התחתונה עודפת על הפתח אמה מזה ואמה מזה, ושלמעלה ממנה עודפת עליה אמה מזה ואמה מזה, נמצאת העליונה שלושים אמה; ונדבך של אבנים בין כל אחת ואחת.",
      r: [["רמב״ם בית הבחירה ד, ח", ["RB", 4, 8]]] },
    { v: [3, 8, 8], t: "כלונסות, שרשרות וגפן של זהב", go: [{"place": "הגפן של זהב", "act": true}, {"fp": "ulam"}],
      x: "כלונסות של ארז קבועים מכותלו של היכל לכותלו של אולם, כדי שלא יבעט — שלא יטה כותל האולם הגבוה. שרשרות של זהב בתקרת האולם, שבהן פרחי כהונה עולים ורואים את העטרות שבחלונות (זכריה ו). גפן של זהב עומדת על פתחו של היכל, מודלה על גבי כלונסות, וכל המתנדב עלה או גרגיר או אשכול — מביא ותולה בה; אמר רבי אליעזר ברבי צדוק: מעשה היה ונמנו עליה שלוש מאות כהנים לפנותה.",
      r: [["רמב״ם בית הבחירה ד, ח", ["RB", 4, 8]]] },
    { v: [4, 1, 1], t: "פתחו של היכל ודלתותיו", go: [{"place": "פתיחת השער הגדול — הדגמה", "act": true}, {"place": "השער הגדול — ארבע הדלתות"}, {"fp": "kodesh"}],
      x: "גובהו עשרים אמה ורוחבו עשר, וארבע דלתות לו — שתיים מבפנים ושתיים מבחוץ. החיצונות נפתחות לתוך הפתח לכסות עוביו של כותל, והפנימיות נפתחות לתוך הבית לכסות אחר הדלתות — שכל הבית טוח בזהב חוץ מאחר הדלתות. רבי יהודה אומר: בתוך הפתח היו עומדות, כמין איצטרמיטה, ונקפלות לאחוריהן.",
      r: [["רמב״ם בית הבחירה ד, ז", ["RB", 4, 7]]] },
    { v: [4, 2, 2], t: "שני פשפשין לשער הגדול", go: [{"place": "פשפשי ההיכל", "act": true}, {"fp": "kodesh"}],
      x: "אחד בצפון ואחד בדרום; שבדרום לא נכנס בו אדם מעולם, ועליו מפורש על ידי יחזקאל (מד, ב): 'השער הזה סגור יהיה'. נטל את המפתח ופתח את הפשפש, נכנס לתא ומן התא להיכל, עד שמגיע לשער הגדול, ופותחו מבפנים; רבי יהודה אומר: בתוך עוביו של כותל היה מהלך.",
      r: [["רמב״ם בית הבחירה ד, ו", ["RB", 4, 6]], ["תמיד ג, ז", ["MN", 88, 3, 7]]] },
    { v: [4, 3, 3], t: "שלושים ושמונה תאים", go: [{"place": "התאים — שלושים ושמונה בשלוש קומות", "act": true}, {"fp": "heichalFront"}],
      x: "חמישה עשר בצפון, חמישה עשר בדרום ושמונה במערב: שבצפון ושבדרום — חמישה על גבי חמישה וחמישה על גביהן; שבמערב — שלושה על גבי שלושה ושניים על גביהן. שלושה פתחים לכל אחד: לתא מן הימין, לתא מן השמאל, ולתא שעל גביו; ובקרן צפונית־מזרחית חמישה פתחים — לתא מן הימין, לתא שעל גביו, למסיבה, לפשפש, ולהיכל. במודל: התאים ייבנו בשלב הבא.",
      r: [["רמב״ם בית הבחירה ד, יא", ["RB", 4, 11]]] },
    { v: [4, 4, 4], t: "רוחב התאים", go: [{"place": "התאים — שלושים ושמונה בשלוש קומות", "act": true}, {"fp": "heichalFront"}],
      x: "התחתונה חמש ורובד שש, האמצעית שש ורובד שבע, והעליונה שבע — שנאמר 'היציע התחתונה חמש באמה רחבה והתיכונה שש באמה רחבה והשלישית שבע באמה רחבה' (מלכים א ו, ו): כותל ההיכל נכנס בכל קומה אמה, והתא רחב בה אמה יותר.",
      r: [["רמב״ם בית הבחירה ד, ה", ["RB", 4, 5]]] },
    { v: [4, 5, 5], t: "המסיבה, העלייה והלולין", go: [{"place": "המסיבה", "act": true}, {"fp": "heichalFront"}],
      x: "מסיבה עולה מקרן מזרחית־צפונית לקרן צפונית־מערבית, ומשם למערב ולדרום, עד פתחה של עלייה — פתוח לדרום. בפתחה שני כלונסות של ארז שבהן עולים לגגה של עלייה. ראשי פספסין מבדילים בעלייה בין הקודש לקודש הקדשים, ולולין פתוחים בעלייה לבית קודש הקדשים — שבהם משלשלים את האומנים בתיבות, כדי שלא יזונו עיניהם מבית קודשי הקדשים (פסחים כו.). במודל: ייבנה בשלב הבא.",
      r: [["רמב״ם בית הבחירה ד, יב", ["RB", 4, 12]], ["רמב״ם בית הבחירה ד, יג", ["RB", 4, 13]], ["פסחים כו.", ["P", 106, "כו."]]] },
    { v: [4, 6, 6], t: "גובה ההיכל — מאה אמה", go: [{"place": "גובה ההיכל — מאה אמה מרצפת העזרה (1.1.0)"}, {"fp": "heichalFront"}],
      x: "האוטם שש אמות, גובהו ארבעים אמה, אמה כיור, אמתיים בית דילפה, אמה תקרה, אמה מעזיבה; גובה העלייה ארבעים אמה, אמה כיור, אמתיים בית דילפה, אמה תקרה, אמה מעזיבה, שלוש אמות מעקה ואמה כלה עורב — טבלאות חדות על הגג שלא ישבו עליו העורבים. רבי יהודה אומר: לא היה כלה עורב עולה מן המידה, אלא ארבע אמות היה מעקה. במודל גובה ההיכל מאה אמה; שתי השיטות במעקה — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ד, ג", ["RB", 4, 3]], ["ערכין ו.", ["P", 134, "ו."]]] },
    { v: [4, 7, 7], t: "ההיכל — מאה על מאה, וצר מאחוריו", go: [{"pos": [-30, 250, 70], "target": [-45, 60, 0]}, {"fp": "heichalFront"}],
      x: "ממזרח למערב מאה: כותל האולם חמש, האולם אחת עשרה, כותל ההיכל שש, תוכו ארבעים, אמה טרקסין, עשרים אמה בית קודש הקדשים, כותל ההיכל שש, התא שש, כותל התא חמש. מן הצפון לדרום שבעים: כותל המסיבה חמש, המסיבה שלוש, כותל התא חמש, התא שש, כותל ההיכל שש, תוכו עשרים, כותל ההיכל שש, התא שש, כותל התא חמש, בית הורדת המים שלוש, הכותל חמש. האולם עודף עליו חמש עשרה אמה מן הצפון וחמש עשרה מן הדרום — בית החליפות, ששם גונזים את הסכינים. ההיכל צר מאחוריו ורחב מלפניו, דומה לארי: 'הוי אריאל אריאל קרית חנה דוד'. רוחב האולם לפי המשנה או הרמב״ם — ראה בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ד, ד", ["RB", 4, 4]], ["רמב״ם בית הבחירה ד, ה", ["RB", 4, 5]], ["רמב״ם בית הבחירה ד, ט", ["RB", 4, 9]]] },
    { v: [5, 1, 1], t: "העזרה — ממזרח למערב", go: [{"fp": "azarah"}],
      x: "כל העזרה אורך מאה ושמונים ושבע על רוחב מאה ושלושים וחמש. ממזרח למערב: אחת עשרה אמה מקום דריסת רגלי ישראל, אחת עשרה אמה מקום דריסת רגלי הכהנים, המזבח שלושים ושתיים, בין האולם ולמזבח עשרים ושתיים, ההיכל מאה אמה, ואחת עשרה אמה לאחורי בית הכפורת.",
      r: [["רמב״ם בית הבחירה ה, יב", ["RB", 5, 12]]] },
    { v: [5, 2, 2], t: "העזרה — מצפון לדרום", go: [{"pos": [150, 120, 0.5], "target": [20, 15, 0]}, {"fp": "azarah"}],
      x: "מן הצפון לדרום מאה ושלושים וחמש: הכבש והמזבח שישים ושתיים, מן המזבח לטבעות שמונה אמות, מקום הטבעות עשרים וארבע, מן הטבעות לשולחנות ארבע, מן השולחנות לננסין ארבע, מן הננסין לכותל העזרה שמונה אמות, והמותר — בין הכבש לכותל ומקום הננסין. מכאן שהמזבח אינו באמצע העזרה; מקומו המדויק — מחלוקת בזבחים נח:–נט.; ראה את המתג ״מקום המזבח בעזרה״ בתפריט, תחת ״שיטות ומחלוקות״.",
      r: [["רמב״ם בית הבחירה ה, יג", ["RB", 5, 13]], ["זבחים נח:", ["P", 130, "נח:"]]] },
    { v: [5, 3, 3], t: "לשכות הדרום", go: [{"place": "לשכת המלח", "act": true}, {"fp": "azarah"}],
      x: "לשכת המלח — שם נותנים מלח לקרבן; לשכת הפרוה — שם מולחים עורות קדשים, ועל גגה בית הטבילה לכהן גדול ביום הכיפורים; לשכת המדיחין — שם מדיחים קרבי הקדשים, ומסיבה עולה ממנה לגג בית הפרוה. על שם פרוה אמגושא, שבנאה.",
      r: [["רמב״ם בית הבחירה ה, יז", ["RB", 5, 17]], ["יומא ג, ג", ["MN", 55, 3, 3]]] },
    { v: [5, 4, 4], t: "לשכות הצפון", go: [{"place": "לשכת הגזית — הסנהדרין", "act": true}, {"fp": "azarah"}],
      x: "לשכת העץ — לשכת כהן גדול (פרהדרין), אחורי שתיהן, וגג שלושתן שווה; לשכת הגולה — בור קבוע וגלגל נתון עליו, ומשם מספקים מים לכל העזרה; לשכת הגזית — שם סנהדרין גדולה של ישראל יושבת ודנה את הכהונה: כהן שנמצא בו פסול לובש שחורים ומתעטף שחורים ויוצא, ושלא נמצא בו פסול לובש לבנים ונכנס ומשמש עם אחיו הכהנים, ויום טוב היו עושים — 'ברוך המקום ברוך הוא שלא נמצא פסול בזרעו של אהרן'. לשכת הגזית בצפון (יומא יט.; רמב״ם ה, יז).",
      r: [["רמב״ם בית הבחירה ה, יז", ["RB", 5, 17]], ["יומא יט.", ["P", 107, "יט."]], ["סנהדרין יא, ב", ["MN", 73, 11, 2]]] }
//@@end tour_VIEW_GROUP
//@@begin after-tour_KINGS-note
//@@end after-tour_KINGS-note
//@@begin buildTour.OWNED
      // 1.0.1-K review (tour-1 / cross-2 / interior-2): the layer groups that a feature's own set() drives, together with its meshes and its
      // "on" (50-heichal.js: the yatzia section -> yatziaDims; 55-interior.js: the wall layers -> wallLayers, the altar's layers ->
      // altarLayers; the base taken apart -> mechonaParts, its parts' labels). The tour never writes them raw: at the end the features go
      // back through their own set() (OWN_FEAT), and the parts' labels follow the explode; the other layers are restored as before
      // 1.0.1-L: + yatziaWhole (the section's set), mechonaPurpose and mechonaWash (the demonstration), the ulam tables' groups (ulamTables.set), forestBoards (a
      // palace hook keeps it equal to the boards) and the throne's version groups (throneVersion.set)
      const OWNED = new Set(["sfalimSee", "yatziaDims", "yatziaWhole", "wallLayers", "altarLayers", "mechonaParts", "mechonaPurpose", "mechonaWash", "ulamTables", "ulamTablesRyby", "ulamTablesMishnah", "forestBoards", "kelim", "arkInside", "arkLid"]);
//@@end buildTour.OWNED
//@@begin isTamidRow
      // 2.0 (55-tamid.js): the demonstration's two rows are the user's own choice - never reset, restored or shown as slides by the tour
      const isTamidRow = (r) => /^(סדר עבודת הבוקר|המנורה והנרות בבוקר)/.test(String(r.cap || ""));
      const tamidSlides = () => (ctx.shared.tamid && fnc(ctx.shared.tamid.slides) ? call(ctx.shared.tamid.slides) || [] : []);
//@@end isTamidRow
//@@begin placeOwnFeat
        if (!F || !fnc(F.on) || !fnc(F.isOn)) return null;   // TOUR_UNTIMED_211: (Beit Rishon skips timed === false here - the throne's slides)
//@@end placeOwnFeat
//@@begin placeSlide
          pf: placeOwnFeat(p), act: p.item && p.item.tourNoAct ? null : placeAct(p), actOnly: !!(placeAct(p) && !placeOwnCam(p) && !(p.item && p.item.tourNoAct)),   // 1.3.5 / 1.9.3; TAMID_STOP_209
//@@end placeSlide
//@@begin topicSlides
          if (ts.length && isThroneRow(row)) continue;
          if (isTamidRow(row)) continue;   // 2.0 (55-tamid.js)   // its readings are the version slides above
          // 1.3.5 / 1.9.3 (the full scan: a row that stands by default on a reading that is not its first - its first reading had no
          // slide, and the row was left on it after its slides): the reading the row stands on is the one gone back to, and every other
          // reading has its slide
//@@end topicSlides
//@@begin verseSlides.refs
        const refs = d.compl ? [] : [["מידות " + vRange(d.v), tour_ref(["MI", d.v[0], d.v[1]])]];
//@@end verseSlides.refs
//@@begin verseSlides
        return { kind: "verse", part: 2, d, ch: d.v[0], title: d.t, sub: (d.compl ? "השלמה — על מידות " : "מידות ") + vRange(d.v), text: d.kelim ? ctx.shared.kelim.info : d.x, xf: d.xf || "", refs: refs.filter((x) => x[1]),
//@@end verseSlides
//@@begin buildTour.after-btn
      tip(btn, "מצגת: בחירה בין מצגת לפי הנושאים, מצגת רציפה, או מצגת לפי סדר המשניות במסכת מידות");
//@@end buildTour.after-btn
//@@begin buildTour.elOpts
      const elOpts = mk("div", "opts", null, null);   // 2.0 (55-tamid.js): the demonstration's switches, under the subtitle
      box.insertBefore(elOpts, elWait);
//@@end buildTour.elOpts
//@@begin setBtn
        tip(btn, running ? "עצירת המצגת (Esc)" : "מצגת: בחירה בין מצגת לפי הנושאים, מצגת רציפה, או מצגת לפי סדר המשניות במסכת מידות");
//@@end setBtn
//@@begin partLabel
      // 2.0 (55-tamid.js): the demonstration's readings in the banner - each a pair of buttons; a change goes on at once, in the same stage
      const TAMID_OPTS = [
        { k: "order", lab: "סדר", o: [["abba", "אביי"], ["rambam", "הרמב״ם"]], row: /^סדר עבודת הבוקר/, set: "setOrder",
          tip: "סדר אביי (יומא לג.) או סדר הרמב״ם (תמידים ומוספין ו). ההדגמה ממשיכה מאותו שלב." },
        { k: "lamps", lab: "נרות", o: [["rambam", "הרמב״ם"], ["rashi", "רש״י"]], row: /^המנורה והנרות בבוקר/, set: "setLamps",
          tip: "הרמב״ם: המנורה בין צפון לדרום, ומדליק נר שכבה. רש״י, הראב״ד והברטנורא: המנורה בין מזרח למערב, והנרות נשארים כבויים עד הערב." },
        { k: "belt", lab: "אבנט כהן הדיוט", o: [["kilayim", "כלאים"], ["white", "לבן"]], row: /^אבנטו של כהן הדיוט/, set: "setBelt",
          tip: "יומא יב: \"לא נחלקו אלא באבנטו של כהן הדיוט... שרבי אומר: של כלאים, ורבי אלעזר ברבי שמעון אומר: של בוץ\". הרמב״ם (כלי המקדש ח, א) כרבי. אבנט כהן גדול תמיד של כלאים." },
        { k: "hp", lab: "הכהן הגדול", o: [["off", "אינו מקריב"], ["on", "מקריב"]], set: "setHp",
          tip: "תמיד ז, א: \"בזמן שכהן גדול נכנס להשתחוות, שלשה אוחזין בו\"; ז, ג: \"בזמן שכהן גדול רוצה להקטיר, היה עולה בכבש והסגן בימינו\". בשמונה בגדיו." },
        { k: "kidd", lab: "קידוש ידיים ורגליים", o: [["tk", "תנא קמא והרמב״ם"], ["ryose", "ר׳ יוסי בר״י"]], set: "setKidd",
          tip: "זבחים יט: \"מניח ידו הימנית על גבי רגלו הימנית, וידו השמאלית על גבי רגלו השמאלית, ומקדש. רבי יוסי ברבי יהודה אומר: מניח שתי ידיו זו על גב זו, ועל גבי שתי רגליו זו על גבי זו\" — \"וחבירו מסייעו\". הרמב״ם (ביאת מקדש ה, טז) כתנא קמא: \"ושוחה ומקדש\"." },
        { k: "mitz", lab: "מצנפת כהן גדול", o: [["rashi", "רש״י"], ["ramban", "רמב״ן"]], row: /^מצנפת הכהן הגדול/, set: "setMitz",   // CHIP_KEEPS_DEMO_T: + its row
          tip: "רש״י (שמות כח, ד): \"כמין כפת כובע\"; (כח, לז): \"למעלה בגבה הראש\". הרמב״ן (כח, לא): \"כעין צניף שצונף בו את ראשו\"." },
        { k: "ephod", lab: "אפוד", o: [["rashi", "רש״י"], ["rambam", "הרמב״ם"]], row: /^אפוד הכהן הגדול/, set: "setEphod",   // CHIP_KEEPS_DEMO_T: + its row
          tip: "רש״י (שמות כח, ו): \"רחבו כמדת רחב גבו של אדם ויותר\"; (כח, כו): \"ונקפל הסינר לפני הכהן על מתניו\". הרמב״ם (כלי המקדש ט, ט): \"רחבו כרחב גבו של אדם מכתף לכתף\"." }
      ];
      const renderOpts = (s) => {
        const T = ctx.shared.tamid;
        const on = !!(s && s.kind === "tamid" && T && fnc(T.readings));
        elOpts.classList.toggle("on", on);
        if (!on) return;
        const cur = call(T.readings) || {};
        elOpts.textContent = "";
        for (const g of TAMID_OPTS) {
          const w = mk("span", "og", null, elOpts);
          tip(mk("b", null, g.lab + ":", w), g.tip);
          g.o.forEach(([v, lab], j) => {
            const b = mk("button", cur[g.k] === v ? "on" : null, lab, w);
            b.type = "button";
            b.addEventListener("click", () => {
              const now = call(T.readings) || {};
              if (now[g.k] === v) return;
              const row = g.row ? rowsOf().find((r) => g.row.test(String(r.cap || ""))) : null;
              if (row) setRow(row, row.options.some((o) => o[0] === v) ? v : "o" + j);   // CHIP_KEEPS_DEMO_T: a row keyed by the reading's own name (the mitre, the ephod)
              else call(T[g.set], v);
              renderOpts(slides[idx] || s);
              // SEG_ONLY_420 (the user 24.11.2026: "שיטות עבודת הבוקר מראות רק את מה ששונה ולא את כל המצגת - חוץ מהרמב״ם - אא״כ גם אצלו יש קטע
              // ברור ששונה בסדר העבודה ואז אפשר לקצר את הקריאה שלו לחלק זה"): a reading chosen goes to the part where it differs, plays it and
              // holds at its end (the buttons go on from there). The order of Abaye and the Rambam's - from the first stage where the two
              // orders part to the last; the High Priest's garments - with him offering
              setTimeout(() => { try {
                const TT = ctx.shared.tour, SL = (TT && TT.slides) || slides;
                let ids = { lamps: ["lamps5", "lamps2"], belt: ["kiyor12"], hp: ["birkat", "haalaah"], kidd: ["kiyor", "kiyor12"], mitz: ["birkat", "haalaah"], ephod: ["birkat", "haalaah"] }[g.k] || null;
                if (g.k === "order" && fnc(T.list)) {
                  const la = call(T.list, "abba") || [], lr = call(T.list, "rambam") || [];
                  let f = 0; while (f < la.length && f < lr.length && la[f] === lr[f]) f++;
                  let e1 = la.length - 1, e2 = lr.length - 1; while (e1 > f && e2 > f && la[e1] === lr[e2]) { e1--; e2--; }
                  const cur = v === "rambam" ? lr : la, e = v === "rambam" ? e2 : e1;
                  ids = f <= e ? cur.slice(f, e + 1) : null;
                }
                if ((g.k === "mitz" || g.k === "ephod") && fnc(T.setHp) && (call(T.readings) || {}).hp !== "on") call(T.setHp, "on");
                if (!ids || !TT || !fnc(TT.only) || !fnc(TT.goto)) return;
                const ix = []; SL.forEach((x, i) => { if (x && x.kind === "tamid" && ids.indexOf(x.id) >= 0) ix.push(i); });
                if (!ix.length) return;
                TT.only(ix); TT.goto(ix[0]); if (fnc(TT.pause)) TT.pause(false);
                renderOpts(SL[ix[0]]);
              } catch (_) {} }, 60);
            });
          });
        }
      };
      if (U.chips && fnc(U.chips.hook)) call(U.chips.hook, () => { if (running && slides[idx] && slides[idx].kind === "tamid") renderOpts(slides[idx]); });   // CHIP_KEEPS_DEMO_T
      const partLabel = (s) => {
        if (mode.key === "continuous") return "מצגת רציפה · סבב " + round;
        if (s.kind === "verse") return "לפי סדר המשניות · מידות פרק " + tour_heb(s.ch);
        if (s.kind === "tamid") return "סדר עבודת הבוקר · מסכת תמיד";   // 2.0 (55-tamid.js)
        // OPS_GROUPS_303: a reading of the opinions table says its group of the table
//@@end partLabel
//@@begin renderVerses
        for (const [v, txt, lbl] of list || []) {   // 2.0 (55-tamid.js): [n, words, label]
          const p = mk("div", "v", null, elVs);
          if (lbl) mk("span", "vl", lbl, p);
          else mk("span", "vn", tour_heb(v), p);
          // ketiv "(...)" small and grey, qere "[...]" in the text, as printed in Otzaria
          for (const part of String(txt).split(/(\([^)]*\)|\[[^\]]*\])/)) {
            if (!part) continue;
            if (part[0] === "(") { const e = mk("span", "kt", part, p); if (!lbl) tip(e, "כתיב"); }
            else if (part[0] === "[") { const e = mk("span", "qr", lbl ? part : part.slice(1, -1), p); if (!lbl) tip(e, "קרי"); }
//@@end renderVerses
//@@begin render
        renderOpts(s);   // 2.0 (55-tamid.js)
//@@end render
//@@begin beginAnim
        if (s.anim === "tamid") {   // 2.0 (55-tamid.js)
          const T = ctx.shared.tamid;
          if (!T || !fnc(T.seek)) return;
          const api = { start: () => true, seek: (sec) => T.seek(s.stage, sec, s.order), reset: () => T.seek(s.stage, s.dur, s.order) };
          T.seek(s.stage, 0, s.order);
          rt.anim = { api, dur: s.dur, whole: s.dur, base: 0, next: null, caps: Array.isArray(s.caps) ? s.caps : [], i: 0, last: null, done: false, scrolled: false };
          total = slideMs(s);
          return;
        }
//@@end beginAnim
//@@begin restore
        for (const [row, key] of sv.rows) if (!isTamidRow(row)) setRow(row, key);
//@@end restore
//@@begin start
        slides = M.key === "tamid" ? tamidSlides() : M.key === "verses" ? verseSlides() : topicSlides();   // 2.0 (55-tamid.js)
//@@end start
//@@begin start-2
        // TOUR_DEFAULT_207: the row's own default (row.current) - a row may begin with another reading than its first (2.0.7: the first lottery,
        // "אביי"); until 2.0.7 every row was set to its first reading here
        for (const [r] of saved.rows) if (!isTamidRow(r)) setRow(r, r.current || r.options[0][0]);   // the model in its default readings (Rashi first)
//@@end start-2
//@@begin start-3
        if (mode.key === "tamid" && ctx.shared.tamid) call(ctx.shared.tamid.begin);   // 2.0 (55-tamid.js): the night, the figures
//@@end start-3
//@@begin showEnd
        elPart.textContent = mode.key === "tamid" ? "סדר עבודת הבוקר" : mode.key === "verses" ? "לפי סדר הפסוקים" : "לפי הנושאים";
//@@end showEnd
//@@begin finish
        if (mode && mode.key === "tamid" && ctx.shared.tamid) call(ctx.shared.tamid.end);   // 2.0 (55-tamid.js): the day and the model back
//@@end finish
//@@begin plan.list
        const list = M.key === "tamid" ? tamidSlides() : M.key === "verses" ? verseSlides() : topicSlides();
//@@end plan.list
//@@begin retamid
        // 2.0 (55-tamid.js): the slides again (the order or the lamps' reading changed), at the same stage
        retamid: () => {
          if (!running || !mode || mode.key !== "tamid") return false;
          const id = slides[idx] && slides[idx].id;
          slides = tamidSlides();
          if (!slides.length) return false;
          const j = Math.max(0, slides.findIndex((x) => x.id === id));
          return go(j, 1);
        },
//@@end retamid
