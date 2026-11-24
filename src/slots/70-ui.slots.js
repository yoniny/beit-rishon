//@@begin UI_SRC_NAME
  // plugin/js/ui.js - the panel of the FIRST Temple model (1.0.0). Adapted from the Second Temple ui.js 1.0.19:
  // label sprites, occluder fade loop (FADE_DIST 120), cutaway, burger/panel, views grid, places accordion, toggles,
  // info box with deep links into Otzaria (book id + line index), measuring tool (red line), cloud over the devir with
  // confirmation + visibility ray test, compass, nav buttons. All module-private names are prefixed ui_.
  // ui_makeLabelSprite is only the FALLBACK copy of makeLabelSprite2 (90-entry.js, same IIFE, hoisted): the label loop in
  // buildUI uses makeLabelSprite2 whenever it is in scope, so the two cannot drift apart in the bundle.
  // 1.0.1-K (K.9a, the user's fourth and fifth lists):
  //   - NO AUTOMATIC REMOVALS ("כפתור להסרה ולא הסרה אוט'", "ההיכל צריך להיות סגור מכל צדדיו ורק עם כפתור להסרה"): views, places, the
  //     opinions table, label clicks and the presentation API never open the house, the chambers, the ulam or the boards (their flags
  //     interior / yatzia / ulam / boards / in stay as data only; ctx.ui.applyCut / applyOpen are kept as no-ops for older callers);
  //   - ON-MODEL BUTTONS ("הכפתור צריך להיות על המיצג ולא בתוכן הענינים (כרעיון קה"ק והענן)"): a renderer for the registry
  //     ctx.shared.modelButtons (contract: FIXES-1.0.1-K.md 0.5b) draws a pill at each entry's projected anchor; the UI registers the cloud
  //     (with its confirmation) and the four removals - the house (ctx.cutaway), the chambers' outer walls (ctx.yatziaCut), the ulam
  //     (ctx.ulamCut), the boards of בית יער הלבנון (ctx.forestBoardsCut) - anchored at ctx.shared.anchors (fallbacks from CO); "↺ החזר הכל"
  //     in the nav row while anything is open; the panel's removal rows are gone (the panel only says where the pills are);
  //   - walls that block the view fade to 0.35, not 0.1 (Yossi: "שהחומות יהיו שקופות לא לגמרי, שיאחזו שיש חומה"), with a nav toggle
  //     "טשטוש חומות: פועל / כבוי" and a distance control "מרחק טשטוש" (60..400, default 120), remembered in localStorage;
  //   - custom tooltips (the user: "בריחוף על כפתורי המצפן צריך להיות הסבר מה הם עושים") on the nav buttons, the compass and its four
  //     letters (a click turns the view to that direction), the fade controls, the pills and the top-left buttons; a long press on touch;
  //   - the arrow keys turn the view like the nav buttons (left / right orbit, up / down tilt, + / - zoom) and never act while the focus
  //     is in the panel, the presentation or a form field (90-entry.js no longer gives the keys to OrbitControls);
  //   - a page booted in a hidden tab (0 x 0) decides the phone layout only when the real size is known.
  // 1.0.1-K (K.9b, content and integration, after all the build tracks):
  //   - the views grid without "הר הבית" and "השער המזרחי" (the user: "במבט כללי כפתור הר הבית ושער המזרחי מיותרים"; they stay as places
  //     under "הר הבית והחצרות" and their labels lead to those places); "האולם" = flyPoints.ulamInside, the ulam FROM ABOVE;
  //   - places and texts, with their sources, for everything new of this round: Yachin and Boaz and the capital (K.1), the oxen, the bases
  //     close / in operation (starts the demo) / taken apart (explode + the parts' labels) (K.3), the yatzia closed, its section (switches
  //     ctx.shared.yatziaSection on) and its door (K.2), the ulam from above with its courses (7:12 per Metzudat David, Ralbag, Malbim, Radak),
  //     the tables, the parochet's two faces, the golden altar with its smoke and its layers, the wall and floor layers (an OPTION - the
  //     default stays all gold), the carvings, the floor (K.4, K.5), לשכת הגזית, the forest house inside, the throne, the king's house, the
  //     garden (K.6) and "העמוד" (II Kings 11:14, 23:3; II Chr 23:13 with Rashi, Metzudat David, Ralbag, the Targum); the places that show a
  //     model feature switch it on (never one of the four removals); every new model choice in "השלמות";
  //   - LABEL_MAP covers every label of the modules (the yatzia measures, the parts of the base, the layers, the palace rooms carry their
  //     own texts); a click on a label also opens a CARD next to it on the model (the addendum C: "ליד העמוד"), following the camera,
  //     closed by its ✕ or a click elsewhere;
  //   - the review's text fixes Q2-1..Q2-5, Q2-7 (II Kings, Exodus, Leviticus, Kohelet, Song of Songs, the Mishnah of Menachot, Sanhedrin,
  //     Tamid, Kelim and Sanhedrin 100a open in Otzaria: ui_BASE / ui_PAGES / ui_MN) and UI-H2-1..9; the deep-link bases checked in the DB;
  //   - interior views without ghost walls: under a roof the wall fade only clears the direct line to the target (K.6's report);
  //   - the fallbacks (ui_FP, CO, the pillars) in step with the modules.
  // 1.0.1-K review (the round's review, confirmed findings):
  //   - the places "הכבש" (its camera looked through לשכת הגזית) and "כיור משה" (its camera hung over the altar ramp, the altar's corner
  //     in front of the laver) have new cameras with a clear line to their targets (ray-tested against the real meshes, fade on and off);
  //   - "המכונה בפירוק" and "המכונות מקרוב" park a running demonstration first (both frame the base's home spot); the parts' labels go off
  //     whenever the explode goes off, and only then (the pill of 45-vessels.js switches them on with it);
  //   - the wall fade: a far "מרחק טשטוש" lengthens only the rays toward the target, which stop 3 amot before it; the rays along the view
  //     keep the 1.0.19 reach (120 at most) - no ghost walls behind the target, the target's own wall is not faded;
  //   - the long-press tooltip's "swallow the click" is cleared by the next press and 400 ms after the long press ends;
  //   - texts: the small lying wheel that turns the big wheel is the book's explanation (a model choice), not בעל צורת הבית's (his are
  //     rods through pairs of wheels, "ואלו המקלות קראם הכתוב ידות"; for Rashi the ידות are the axle); "הסר את הנסרים" says what each
  //     reading of בית יער הלבנון shows without the boards (Rashi: the עבים, the small beams and the upper storey; the כרותות stay
  //     under its floor);
  //   - ctx.ui.autoRotate {get, set} (the "סיבוב איטי" row and the controls together) for the presentation.
  //   - integration: the pills (.tm-pill) at z-index 28, under the presentation's banner and the label card (29) - they drew over the
  //     banner's text; the nav row's captions hide below 640 px wide by @media(max-width:639px), the same rule as innerWidth < 640.
  // 1.0.1-L (FIXES-1.0.1-L.md, the user's answers of 29.10-1.11.2026; this file = the panel, 75-tour.js = the presentation):
  //   - L.34 THE FLOATING EXPLANATION CARD (the user: "כל פעם שלוחצים על הר הבית הוא פותח הסבר ואז צריך לגלול כדי למצוא את יתר הכפתורים";
  //     "כן, כרטיס צף"): the explanation of a view, a place or an opinion no longer sits at the panel's foot (the panel scrolled down to it
  //     and the buttons went out of view) - it opens in a floating card #tm-xcard BESIDE the panel, over the model (its top at the clicked
  //     button's height), with a ✕, its own scroll and the source links; the panel's lists never move; a new choice replaces the card's
  //     content; Esc or ✕ closes it; on a phone (<= ui_PHONE_MAX px) it is a bottom sheet above the nav row; one card at a time - it closes
  //     the label's card and the label's card closes it, and the presentation closes it when it starts (ctx.ui.card). The #tm-info box is gone.
  //     A place whose subject the card would hide may open it at the window's left edge (it.cardSide: the section's cut); with the presentation's banner on the
  //     left it stays beside the panel. Thin dark scrollbars on the panel and the card; on a phone the panel ends above the nav row.
  //   - L.27 THE 15-SECOND RULE (the user: "תן לזה 15 שניות ויחזור אוטו"): a place that switches a model FEATURE on (the yatzia section, the
  //     wall layers, the altar layers, the ulam tables of R. Yose b. R. Yehuda) switches it off again 15 s later (ui_AUTO_OFF_S), with a small
  //     countdown badge on the button; the feature's own pill / opinion row cancels the timer and the user's state stays; "↺ החזר הכל" and the
  //     presentation cancel every timer; the pills themselves are never timed; an animation with its own duration (the king's ascent to the
  //     throne) is exempt. ctx.ui.autoOff = { seconds, arm, run, cancel, flush, pending }. One setTimeout per feature, nothing per frame.
  //   - L.43 the yatzia has its own group "היציע" in the places accordion, with the place "חתך היציע" (flyPoints.yatziaSection, square-on;
  //     the texts teach Rashi's 7 / 6 / 5); L.49 the nav buttons' and the arrow keys' step is slower (orbitBy 0.045 -> 0.025 rad, tilt 0.035
  //     -> 0.02, the turn buttons' hold repeat 40 -> 50 ms; 90-entry.js rotateSpeed 0.5); L.51 the places "פעולת המכונה" and "המכונה בפירוק" are
  //     gone (the pills on the base do it; "המכונות מקרוב" stays).
  //   - texts, places, rows, "השלמות" and LABEL_MAP for every round-L change of the model files (their reports' FOR-UI sections): the
  //     Sea in the court's north-east CORNER (Rashi 7:39; the book), ALL TEN bases in one block of 2 x 5 before the ulam's south wing with Moses'
  //     laver between the rows (the book p. לח), their purpose (II Chr 4:6; Radak 7:39), the taps, no spouts; Yachin and Boaz as close to the
  //     wall as the capital allows (PX 6.08 / PZ 7.17) and the view "יכין ובועז" = the far view through the ulam's doorway (yachinBoazFull;
  //     the ulam stays closed, L.58); the ulam doorway 10 x 22 with two open cedar doors (II Chr 29:7; L.59) and its place; Malbim's capital
  //     (ctx.shared.pillarCapital, L.60) and R. Yose b. R. Yehuda's two tables (ctx.shared.ulamTables, L.72) as rows; the tables all in Moses'
  //     form, the golden altar 1 x 1 x 1 east of the rows, the menorot with 22 / 11 / 9 and three steps, the layers window near the entrance,
  //     the horizontal cherub wings and the new faces, the devir lintel, the parochet lions right to left, the staves, the foundation stone
  //     (interior); the three forest readings (Rashi / "מלבי״ם ורלב״ג" / "מצודת דוד"), the places אולם העמודים and העמודים והעב by fly point
  //     per reading, the king's own court, בית בת פרעה in the great court, the garden without the pool, the throne per Kings with its four
  //     midrashic versions (ctx.shared.throneVersion) and the ascent (palace); לשכת הגזית in the NORTH (Yoma 19a, the Rambam) and
  //     בית המטבחים north of the altar (courts); Rashi 7:2-7:6 quoted in the library's spelling (לארך, כלן, מחפין, קרוי, הספון, לרחב).
  //   - no text on the screen names the person who asked for a choice (the integrator's rule for the plugin's readers): "בחירת מודל", "כציור הספר" or the source;
  //     the requests' own words stay in comments. The verifiers' FOR-UI: the far views yachinBoazFull / boazFar and the place "בועז — מרחוק" (verify-heichal.md),
  //     בית המטבחים with its tables and pillars in two lines each, north to south (verify-courts.md).
  //   - ctx.ui.places() (every place button in the panel's order, for the presentation), ctx.ui.card, ctx.ui.autoOff; the boards pill also
  //     gates ctx.layers.forestBoards; the CO / pillar / anchor / fly-point fallbacks in step with the modules; one phone rule (ui_PHONE_MAX).
  // 1.0.1-L, part 5 of the round: L.89 ui_srcRuns / ui_fillSrc / ctx.ui.smallSources (the sources' brackets smaller); L.90 the table REVEAL (a pill flies to what it reveals and back); L.91 the forest row flies to the hall;
  // L.88 the place "כלי הבית — סוף פרק ז"; L.85 the place "מה שבתוך הארון" and its nine labels; the waiting texts of verify-interior.md, part5-rambam.md, lens-results.json, palace-2.md, A3, A10.
  // 1.0.1-L (L.89, the user: "כל הסוגריים של מקורות תקטין יותר"): ONE helper for every text the viewer reads. ui_srcRuns(text) cuts a text into runs
  // { t, s } where s = a source in parentheses: outside a quote (' " ״ at a word's edge; a quote's own words are never touched), with no nikud (a
  // verse's words), no quote inside it, at most 70 letters, and it looks like a source: a book or commentator's name, chapter and verse, or a daf.
  // ui_fillSrc(el, text) writes it to the DOM (a span.tm-src, with no innerHTML), ctx.ui.smallSources(text) returns it as HTML for 75-tour.js, and
  // ui_labelText (below) draws it in the labels on the model.
  // 1.0.2 (the user's list of 2.11.2026; this file = the panel):
  //   - item 4, THE OTHER OPINIONS INSIDE THE CARD: a card (the panel's #tm-xcard and the label's #tm-card) whose subject has rows in "שיטות
  //     ומחלוקות" ends with one compact row "שיטות:" and a small chip per reading, the current one marked; a chip does what the table's button
  //     does (row.mark + row.onPick; row.cardFly rows also fly, because their subject moves with the reading), the card stays open and its
  //     chips follow. The subject -> rows map is UI_OPS_V (view keys) / UI_OPS_P (place titles) / UI_OPS_L (label texts) inside buildUI; a card
  //     with no row shows nothing. The presentation's cards (ctx.ui.card.open) carry no chips.
  //   - item 8: the row "מזבח הנחושת — אבנים או מצופה נחושת" from ctx.shared.altarLook (40-altar.js), and the altar's cards carry its chips;
  //   - item 7: the place "השיתין" beside "מזבח הנחושת" and the label "השיתין" open ctx.shared.shitin's text (40-altar.js); nothing without it;
  //   - item 1: "דיווח על טעות או תקלה" at the panel's foot (inside Otzaria only): a small form -> feedback.report, with the version, the view or
  //     card and the chosen readings added to the details;
  //   - item 2: the button "open-beit-rishon" of I Kings and II Chronicles (manifest.json; 70-ui.js listens) opens the plugin with the reading
  //     position (reader.toolbar_item_clicked: currentId / currentBook / currentIndex): the line -> chapter and verse (ui_BASE, all the
  //     chapters of books 10 and 39 read in the DB) -> ui_READ -> the panel's own view or place button, with its card. The event is listened
  //     to from the script's first run (it may come during the loading) and queued until the UI and the loading are done.
  // 1.0.2, the add-on (same version, not yet published):
  //   - A: the brackets of a source in the cards' text are links (srcLinker / ui_srcParse): the card's own refs by label first, then a
  //     verse of a book of ui_BASE or a page of ui_PAGES; openSource as the chips; unresolved = plain; a hover underline only;
  //   - B: "הדפסה או שמירה כ-PDF" at the panel's foot: a print page #tm-print (the view's picture, the place's name, the open card's text and
  //     sources), @media print; ui.print / ui.exportPdf in Otzaria (from the click), window.print() outside; the page goes after;
  //   - C: "מה חדש בגרסה 1.0.2" (UI_NEWS) once per version, after the loading, never during the presentation; storage.* with localStorage;
  //   - D: the fade button's second mode "טשטוש: גם קיר מסתיר" (fadeState.hide): the building's walls that hide the target fade too;
  //   - the row "הכבשים הקטנים" (ctx.shared.altarRamps, 40-altar.js) next to "מראה המזבח", and its chips in the altar's cards.
  //   - the fixes (rule 6): the place "היסוד, הסובב וחוט הסיקרא" (ctx.shared.altarProfile) after "השיתין" with its "השלמות" item merged
  //     into it, and the item "הכבשים הקטנים — השלמה מן הגמרא" (both readings, the row's chips); ui_INFO.mizbeach, "הכבש והקרנות" and
  //     "מקום המזבח" now speak of the yesod and the sovev; UI_NEWS 11 lines (the fade mode added).
  var UI_SRC_NAME = /^ו?ה?(?:שם|ראו שם|מלכים|שמואל|דברי הימים|דה״י|שמות|ויקרא|במדבר|דברים|בראשית|ישעיה|ירמיה|ירמיהו|יחזקאל|הושע|עמוס|מיכה|זכריה|תהלים|משלי|איוב|שיר השירים|קהלת|אסתר|דניאל|עזרא|נחמיה|רש״י|רשב״ם|רש״ש|רד״ק|רלב״ג|מלבי״ם|מצודת|מצודות|מנחת|אברבנאל|רמב״ם|רמב״ן|ראב״ע|ראב״ד|מאירי|המאירי|הגר״א|תרגום|יונתן|ת״י|משנה|משנת|מדות|מידות|תמיד|יומא|זבחים|מנחות|בבא|סנהדרין|שקלים|סוכה|מגילה|חגיגה|ערכין|כלים|תוספתא|תוספות|תוס׳|ברטנורא|ברייתא|הלכות|כסף משנה|ילקוט|פסיקתא|מדרש|פירוש המשנה|עמ׳|בעל צורת הבית|לחם שמים|מעשי למלך|בית הבחירה|ספרי|מכילתא|תפארת ישראל|ראבי״ה|מהרש״א|פנים אחרים|אבא גוריון)(?:$|[\s,;.:׳״])/;
  // 1.0.2 (fix): the height of index.html's fixed top bar (56 px, 44 px in a narrow window); the floating cards' inline top never goes above it
  // (read once per window width: the label card asks every frame, and offsetHeight would force a layout)
  // 1.1.0: the top bar's icons (inline SVG, stroke = currentColor; index.html sizes them). ui_setTopBtn swaps a button's icon and label.
//@@end UI_SRC_NAME
//@@begin ui_fillRich-note
    // FOLD_211 (stage ג, "קיצור כרטיסים ארוכים"; as the Second Temple's 70-ui.js): a long card (over `fold` letters) shows its first
    // paragraphs and keeps the rest behind a button - none of its words or its sources is cut; the print (el.__raw) sees the whole of it
    // FOLD_MODEL_211 (the understandability review, U-23 / U-40 / U-52; the user, 15.11.2026 18:39: "21. א"): the fold hid the END of the
    // card - and the end is where every card says what in the model has no source ("במודל: ... בחירת מודל"). Now only the MIDDLE folds
    // (the commentators): the paragraphs that open "במודל" - or, in a card that has none, those that say "בחירת מודל" - always show,
    // under the button. The shown head never ends on a line that announces a list (":") nor in the middle of one ("•"). The button is
    // a full-width bar that says how much it hides (it looked like one more source chip).
//@@end ui_fillRich-note
//@@begin ui_smallSources
  function ui_smallSources(text) {   // 1.3.3: the presentation's text as the cards' - paragraphs, the leads and the names in bold
//@@end ui_smallSources
//@@begin UI_ARK_TXT
  // 1.0.1-L (L.85; part5-house.md FOR-UI 3): the card of the ark's inside
  var UI_ARK_TXT = "הפסוק: 'אין בארון רק שני לחות האבנים אשר הנח שם משה בחרב' (מלכים א ח, ט).\nבגמרא: 'מאי אין בארון רק? מיעוט אחר מיעוט; ואין מיעוט אחר מיעוט אלא לרבות – ספר תורה שמונח בארון' (בבא בתרא יד., דברי רבי מאיר). הלוחות 'ארכן ששה, ורחבן ששה, ועביין שלשה; מונחות כנגד ארכו של ארון', ו'נשתיירו שם שני טפחים, שבהן ספר תורה מונח'. 'מלמד שהלוחות ושברי לוחות מונחין בארון' (מנחות צט.) — רש״י: 'תחת הלוחות' (בבא בתרא יד:). 'מלמד, שהשם וכל כינויו מונחין בארון' (שם).\nרבי יהודה חולק: 'מצד הוא מונח, ולא בתוכו', על הארגז (שם יד.).\nרד״ק: 'זה ראייה כי לא היו בארון לא שברי לוחות ולא ס\"ת'.\nמחוץ לארון: העמודים — 'עמודין היכא הוו קיימי? מבראי' (שם יד:), ו'צנצנת המן, וצלוחית שמן המשחה, ומקלו של אהרן ושקדיה ופרחיה, וארגז ששגרו פלשתים' (יומא נב:).\nבמודל: סידור הדברים וצורתם — כציור הספר; הצבע, לשון הדברות על הלוחות וגודל הכלים שמחוץ לארון — בחירת מודל.";
//@@end UI_ARK_TXT
//@@begin ui_GENERAL
  // General view (SPEC 9.2). Camera positions are world coordinates in amot (x east, z south, y up).
  var ui_GENERAL = { pos: [380, 170, 230], target: [0, 25, 0] };
  // Fallback fly points (kept in step with the modules' registrations of 1.0.1-K; used only when a module did not register
  // ctx.shared.flyPoints[key]): the bases row x 27 = CO.mechX; the interior ones are cameras inside the CLOSED house (55-interior.js, K.5).
  // 1.0.1-L: the fallbacks follow the round-L fly points of the modules (heichal.json, heichal-door.md, interior.md, 45-vessels.js):
  // heichalFront from the south-east above (L.41), ulamInside from the FRONT (L.44), yatziaSection square-on (L.43), yachinBoazFull and boazFar
  // far and off the axis (L.45 / L.58, verify-heichal.md), the interior cameras after the vessels' new places (L.69-L.73), mechonot over the block of bases (L.77)
  // 1.2.0 (the user): Baraita d'Melechet HaMishkan ch. 7, as he sent it - the staffs (a), where the ark was hidden (b), the wall and doors of
  // the First Temple's holy of holies against the two curtains of the Second (c); on the cards of the ark, the foundation stone and the traksin
  var UI_BARAITA = {
    a: "ברייתא דמלאכת המשכן (פרק ז): 'מנין אתה אומר שכיון שהכניסו הכהנים את הארון, האריכו הבדים, הגיעו לפרכת ונגעו בפתח — לפיכך לא ננעלו דלתות בית קדשי הקדשים מעולם, שנאמר ויאריכו הבדים. אי אפשר לומר לא יראו, שכבר נאמר ויראו; ואי אפשר לומר ויראו, שכבר נאמר לא (ו)יראו — היו בולטין לפרכת ונראין בהיכל כשני דדי אשה. ומנין שהאריכו מבפנים? שנאמר ולא יראו החוצה — למדנו שהאריכו מבפנים. ומנין שהאריכו מבחוץ? שנאמר ויראו ראשי הבדים. ומנין אתה אומר שכשם שנמתחו הבדים כך נמתחו כנפי הכרובים, וכסו את הארון וחפו את הבית מלמעלה? שנאמר ויסכו הכרובים.'\nבמודל: הבדים נמשכים גם מערבה, עד הכותל.",
    b: "ברייתא דמלאכת המשכן (פרק ז): 'היכן היה נתון? רבי יהודה בן לקיש אומר: במקומו, בבית קדשי הקדשים, שנאמר ויהיו שם עד היום הזה. וחכמים אומרים: בלשכת דיר העצים. רבי אליעזר אומר: לבבל ירד, שנאמר לא יותר דבר אמר ה׳ — אין דבר אלא דברות שבו. רבי אומר: יאשיה גנזו, שנאמר ויאמר אל הלוים — אמר: לא ירד עמהם לבבל, שתעלו אותו בכתף.'",
    c: "ברייתא דמלאכת המשכן (פרק ז): 'בית קדשי הקדשים שעשה לו שלמה היה לו כותל, פתח ודלתות, שנאמר ויעש דלתות להיכל ולקדש. אבל בבנין האחרון לא עשה שם כותל, אלא שני פסין היו שם, וארכו של כל אחד אמה ומחצה, ושתי פרכות של זהב היו שם פרוסות עליהן מלמעלה — והיה נקרא מקום הטרקסין.'"
  };
  var ui_FP = {
    harHabayit: { pos: [720, 320, 520], target: [100, 10, 80] },
    eastGate: { pos: [503, 35, 0], target: [353, 14, 0] },             // great court east gate, from outside (CO.harE 353; 20-mount.js)
    newCourt: { pos: [280, 72, 128], target: [161, 4, 0] },            // the outer court (החצר החיצונה, 1.0.1 name; the key stays) x 93.5..228.5
    azarah: { pos: [150, 105, 150], target: [20, 15, 0] },
    innerEastGate: { pos: [168, 27, 42], target: [95.5, 14, 0] },
    mizbeach: { pos: [120.5, 52, 72], target: [55, 16, 0] },   // 1.3.2: the altar 5.5 east (CO.ALTAR_DX)
    altarFromDoor: { pos: [20.5, 21, 0], target: [60, 12, 0] },   // 1.2.0: from the ulam's doorway down the axis to the altar
    altarPlaceView: { pos: [190, 125, 0], target: [40, 10, 0] },   // 1.2.2: from the east, high, down the axis - the altar's side of the line is plain
    lishkatHaGazit: { pos: [44, 17, -40], target: [62, 9, -64] },   // 1.0.1-L (verify-courts.md): 30-courts.js's three fly points
    slaughterPlace: { pos: [71.5, 52, -2], target: [63.5, 7, -36] },
    slaughterPlaceClose: { pos: [57.5, 12.5, -31], target: [55, 9, -44] },
    mechonot: { pos: [50, 30, 19], target: [29, 8, 44] },               // 1.0.1-L (L.77): the block of 2 x 5 before the ulam's south wing (45-vessels.js)
    heichalFront: { pos: [75.3, 100.2, 78], target: [18.86, 46.62, 30.65] },   // 1.0.1-L (L.41): the whole house from the south-east above, as the book's general view
    heichalSouth: { pos: [-25, 55, 95], target: [-38, 21, 27] },        // 1.0.1-K (K.2): the closed chambers' south wall and the house over it
    ulamInside: { pos: [84, 44, 0], target: [18.4, 25.5, 0] },          // 1.0.1-L (L.44; verify-heichal.md): the ulam from the FRONT, its doorway in the middle (was from above)
    yatziaSection: { pos: [-4, 23.6, 21], target: [-30.5, 23, 21] },   // 1.0.1-L (L.43): square-on to the cut (use only with the section on)
    yachinBoaz: { pos: [18.4, 30.1, 0], target: [2.5, 29.5, 0] },       // 1.0.1-K (K.1): in the ulam's own front doorway, the ulam closed (Rashi's capital; pillarCapital.set re-aims it)
    yachinBoazFull: { pos: [74, 32, -40], target: [18.4, 24.63, -1.39] },   // 1.0.1-L (L.45 / L.58; verify-heichal.md): far, from the north-east: the doorway frames Yachin whole
    boazFar: { pos: [84, 34, 47], target: [18.4, 24.74, 1.4] },         // 1.0.1-L (verify-heichal.md): Boaz whole, from the south-east, farther back
    aliyot: { pos: [260, 150, 220], target: [-25, 70, 0] },
    aliyotSection: { pos: [170, 84, 0], target: [-25, 72, 0] },   // 1.2.3: from the east
    heichalWest: { pos: [-200, 60, -60], target: [-80.6, 25, 0] },      // 1.0.1-L (verify-heichal.md): the old target stood inside the closed chambers
    kodesh: { pos: [-8, 34, 0], target: [-28, 24, 0] },
    kodeshHakodashim: { pos: [-46, 30, 6], target: [-56, 22, 0] },
    menorot: { pos: [-29, 22, -2.5], target: [-42, 15, 5] },            // 1.0.1-L: the menorot one amah west of the tables (interior.md); 1.2.2: 3 further back - the labels were cut by the frame
    shulchanot: { pos: [-29, 23, 3], target: [-41, 15, -4.6] },     // (it stood outside the north wall: the user's "שולחן משה" showed the carvings)
    shulchanMoshe: { pos: [-36.2, 15.8, -5.15], target: [-40, 14.45, -5.25] },   // 1.0.1-L: along Moses' table from its east end
    incenseAltar: { pos: [-24.25, 15, 2.1], target: [-26.75, 12.75, 0.55] },     // 1.0.1-L (L.69): the altar 1 x 1 x 1 east of the rows (Rabbi's layout); ALTAR_EAST_305: 1.25 east
    heichalDoor: { pos: [9, 26, 0], target: [-1, 22, 0] },
    devirDoor: { pos: [-24.5, 20.6, 0], target: [-43.4, 19.2, 0] },     // 1.2.0: centred (the place hides the smoke for 15 s)
    palace: { pos: [400, 170, 760], target: [103, -5, 520] }
  };
  // Views grid (SPEC 9.2). layer -> that layer is switched on before flying; yam -> seaPlacement.flyPoint(). 1.0.1-K: no view opens
  // anything (the flag interior stays as data: the camera is inside the closed house); "הר הבית" and "השער המזרחי" left the grid (the
  // user: "במבט כללי כפתור הר הבית ושער המזרחי מיותרים הם נמצאים כבר בהר הבית") - they are places of "הר הבית והחצרות".
  var ui_VIEWS = [
    { key: "__general", label: "מבט כללי" },
    { key: "newCourt", label: "החצר החיצונה" },                       // 1.0.1: "עזרת נשים" -> "החצר החיצונה" (the user); the key stays
    { key: "azarah", label: "חצר הכהנים" },
    { key: "mizbeach", label: "מזבח הנחושת" },
    { key: "yam", label: "הים של שלמה" },
    { key: "mechonot", label: "המכונות" },
    { key: "heichalFront", label: "הבית מבחוץ" },                     // 1.0.1: "ההיכל" is the kodesh (I Kings 6:17, the user); the exterior is "הבית"
    { key: "heichalSouth", label: "היציע" },                          // 1.0.1-K (K.2): the chambers CLOSED, as the book's general view
    { key: "ulamInside", label: "האולם" },                            // 1.0.1-L (L.44): from the FRONT at a normal height, the doorway in the middle (K.2.4 was from above)
    { key: "yachinBoazFull", label: "יכין ובועז" },                   // 1.0.1-L (L.45 / L.58, the user: "תשאיר סגור, אולי תרחיק מאוד את המבט"): far, off the axis, the ulam closed - Yachin whole through the doorway (Boaz by dragging, or the place boazFar); the in-doorway camera (yachinBoaz) is a place
    { key: "heichalDoor", label: "פתח ההיכל", interior: true },
    { key: "kodesh", label: "ההיכל", interior: true },        // 1.0.1: "הקודש" -> "ההיכל"
    { key: "devirDoor", label: "פתח הדביר", interior: true },
    { key: "kodeshHakodashim", label: "קודש הקדשים", interior: true },
    { key: "aliyot", label: "העליות", layer: "aliyot" },
    { key: "palace", label: "בית שלמה", layer: "palace" }
  ];
  // ===== deep links into Otzaria: book id + line index (numbers pasted from src/refmap.json; see DEV_NOTES "קישורים לאוצריא") =====
  // Otzaria book ids: I Kings 10, II Chronicles 39, Jeremiah 13, Mishnah Middot 89, Menachot 131, Yoma 107, Eruvin 105,
  // Zevachim 130, Bava Batra 124, Rambam Hilchot Beit HaBechira 337. Line of a verse = BASE[book][chapter] + verse.
  // 1.0.1-K (K.9b; review Q2-7): the books this round cites were added from the Otzaria DB (each base checked by reading base + v there):
  // II Kings 11 (11:14 -> 321, 11:19 -> 326), Exodus 2, Leviticus 3, Song of Songs 31, Kohelet 32, the Mishnah of Sanhedrin 73, Menachot 81,
  // Tamid 88, Kelim 91 (ui_MN), Sanhedrin 125 (100a).
  // 1.0.2 (item 2): books 10 and 39 with ALL their chapters (the line before verse 1 = the chapter's heading), read in the DB with the
  // helper (every verse of both books = base + verse, no exception; e.g. I Kings 6:1 = 186, 7:15 = 239, 7:23 = 247, II Chr 3:1 = 39, 4:2 = 58)
  var ui_BASE = {
    10: { 1: 1, 2: 55, 3: 102, 4: 131, 5: 152, 6: 185, 7: 224, 8: 276, 9: 343, 10: 372, 11: 402, 12: 446, 13: 480, 14: 515, 15: 547, 16: 582, 17: 617, 18: 642, 19: 689, 20: 711, 21: 755, 22: 785 },
    11: { 11: 307, 12: 328, 15: 407, 23: 655, 25: 714 },                     // 1.0.1-K: II Kings (11:14 = 321, 23:3 = 658, 25:17 = 731)
    2: { 16: 431, 25: 685, 26: 726, 27: 764, 30: 877 },                               // 1.0.1-K: Exodus (the table, the curtain, the incense altar); 1.0.1-L: 27 (27:20 = 784, the menorah's steps)
    3: { 1: 1, 24: 725 },                                                    // 1.0.1-K: Leviticus 24:6 (the two stacks); 1.0.1-L: 1 (1:9 = 10, 1:11 = 12 - the slaughter in the north)
    4: { 8: 343, 17: 642 },                                                           // 1.0.1-L: Numbers 8:2 = 345 ("בהעלתך")
    55: { 2: 10, 3: 18, 5: 37 },                                                    // 1.0.1-L: Mishnah Yoma 3:10 = 28 (Ben Katin's spouts), 5:2 = 39 (the foundation stone)
    54: { 6: 37 },                                                           // 1.0.1-L: Mishnah Shekalim 6:4 = 41 (the thirteen tables)
    31: { 3: 37 },                                                           // 1.0.1-K: Song of Songs 3:6-7
    32: { 2: 20 },                                                           // 1.0.1-K: Kohelet 2:5-6 (the garden)
    39: { 1: 1, 2: 20, 3: 38, 4: 56, 5: 79, 6: 94, 7: 137, 8: 160, 9: 179, 10: 211, 11: 231, 12: 255, 13: 272, 14: 296, 15: 311, 16: 331, 17: 346, 18: 366, 19: 401, 20: 413, 21: 451, 22: 472, 23: 485, 24: 507, 25: 535, 26: 564, 27: 588, 28: 598, 29: 626, 30: 663, 31: 691, 32: 713, 33: 747, 34: 773, 35: 807, 36: 835 },  // 1.0.1: 23 (II Chr 23:13 "על עמודו"), 24 (II Chr 24:8 the chest); 1.0.1-K: 6 (6:13); 1.0.1-L (read in the DB): 8 (8:11 "לא תשב אשה לי" = 171), 29 (29:7 "דלתות האולם" = 633), 34 (34:22 חולדה = 795); 1.0.2: all 36 chapters (the DB), the old entries unchanged
    38: { 26: 852, 29: 942 },   // 1.3.7: I Chr 26:12 = 864 (the gatekeepers' lots; read in the library, 11.11.2026)                                                         // 1.0.1-K (integration): I Chr 29:2 = 944 ("ואבני שיש לרב", the court floor)
    13: { 22: 530, 26: 652, 35: 912, 36: 932, 52: 1382 },                     // 1.0.1: 22, 26 (the palace below the house), 35, 36 (the chambers)
    89: { 1: 1, 2: 11, 3: 18, 4: 27, 5: 35 },
    73: { 1: 1, 4: 23 },                                                     // 1.0.1-K: Mishnah Sanhedrin (1:6 = 7, 4:3 = 26)
    81: { 11: 79 },                                                          // 1.0.1-K: Mishnah Menachot 11 (11:4 = 83)
    88: { 3: 12, 4: 22, 5: 26, 6: 33 },                                      // 1.0.1-K: Mishnah Tamid (6:2 = 35); 1.0.1-L: 3 (3:5 = 17 הננסין, 3:9 = 21 the menorah's stone), 4:1 = 23 (the second ring)
    91: { 11: 88 },                                                          // 1.0.1-K: Mishnah Kelim 11:2 = 90 ("והפותה שתחת הציר")
    337: { 1: 2, 2: 23, 3: 42, 4: 61, 5: 75, 6: 93, 7: 110, 8: 134 }
  };
  // First line of a Talmud page (refmap.json "pages"; 1.0.1-K: the new pages read in the DB).
  var ui_PAGES = {
    131: { "כח:": 991, "פו:": 3028, "צד:": 3364, "צו.": 3407, "צו:": 3430, "צז.": 3444, "צז:": 3458, "צח.": 3478, "צח:": 3501, "צט.": 3524, "צט:": 3539 },   // 1.0.1-L: 28b (the menorah's tefachim)
    107: { "טז.": 349, "טז:": 360, "יט.": 403, "כא:": 462, "כה.": 577, "לג:": 793, "לו.": 850, "לח.": 899, "נא:": 1312, "נב.": 1323, "נג.": 1353, "נג:": 1379, "נד.": 1397, "סב:": 1619, "עב:": 1948 },   // 1.0.1-L: 16b, 33b (the altar's place), 62b
    105: { "יד.": 449, "יד:": 473 },
    119: { "מח.": 1648 },                              // 1.0.1-L: Sotah 48a (Yochanan the high priest's rings)
    124: { "ג.": 27, "ג:": 52, "יד.": 361, "יד:": 377, "צט.": 2327 },          // 1.0.1-H: Bava Batra 99a (the cherubim "בנס הן עומדין", "מצדדי אצדודי")
    125: { "ק.": 3894, "קו:": 4129 },                  // 1.0.1-K: Sanhedrin 100a (Rashi: the ulam's wall 6); 1.0.1-L: 106b (the Ben Yehoyada on the throne's mechanism)
    130: { "לב:": 1174, "נח:": 2006, "נט:": 2043, "סג.": 2133, "ס.": 2054, "סא:": 2089, "סב.": 2101 },
    114: { "יג:": 386 },                               // 1.0.1-H: Chagigah 13b ("מאי כרוב - כרביא")
    108: { "ה:": 114 },                                // 1.0.1-H: Sukkah 5b (the same)
    106: { "צב.": 2967 },                              // 1.2.8: Pesachim 92a (the new court: "טבול יום לא יכנס במחנה לויה")
    112: { "י:": 355 }                                 // 1.0.1-H: Megillah 10b ("מקום ארון אינו מן המדה... בנס היה עומד")
  };
  // 1.0.1-L (Part 7, U2): no other site: every source opens in Otzaria only (the table of Sefaria names and every URL built from it are gone)
//@@end ui_GENERAL
//@@begin ui_sefToOtz.mm
    const mm = /^Mishnah_Middot(?:\.(\d+))?(?:\.(\d+))?$/.exec(ref);
    if (mm) {
      if (!mm[1]) return { book: 89, index: 0 };
      const c = +mm[1];
      if (!ui_BASE[89][c]) return null;
      return { book: 89, index: ui_BASE[89][c] + (mm[2] ? +mm[2] : 0) };
    }
    const tn = /^(I_Kings|II_Kings|II_Chronicles|Jeremiah|Exodus|Leviticus|Song_of_Songs|Ecclesiastes)\.(\d+)\.(\d+)$/.exec(ref);
    if (tn) {
      const b = { I_Kings: 10, II_Kings: 11, II_Chronicles: 39, Jeremiah: 13, Exodus: 2, Leviticus: 3, Song_of_Songs: 31, Ecclesiastes: 32 }[tn[1]];
      const base = ui_BASE[b] && ui_BASE[b][+tn[2]];
      return base == null ? null : { book: b, index: base + +tn[3] };
    }
    return null;
  }
  // ===== 1.0.2 (A, "links in the brackets"): a source's bracket inside a card's text opens it in Otzaria, as the card's chip does. A part
  // of a bracket ("ו, טו; ו, ל" has two) is matched to the card's own refs by its label first (the label as written, then without a range's
  // end "–כב", then without a commentator's name before it: "רש״י יומא לו." is the chip "יומא לו."); else it is read here: a verse of a book
  // in ui_BASE ("מלכים א ז, טו", "מדות ג, ב", "רמב״ם בית הבחירה ב, יא", "שקלים ו, ד"), a page of ui_PAGES ("יומא נא:"), or a bare "ז, כו" when
  // the last book named in a bracket before it is the book of the card's first ref (both must agree). A commentator's name is dropped only
  // before a verse of the Tanach (its verse opens, as the chips "רש״י ז, טו" do), never before a page or a Mishnah (another book).
  // Anything else stays plain text (model choice: no guessing). The names below are only those of ui_BASE / ui_PAGES. =====
  var UI_SRC_TN = { "מלכים א": 10, "מלכים ב": 11, "דברי הימים א": 38, "דברי הימים ב": 39, 'דה"י א': 38, 'דה"י ב': 39, "ירמיהו": 13, "ירמיה": 13, "שמות": 2, "ויקרא": 3, "במדבר": 4, "שיר השירים": 31, "קהלת": 32 };
  var UI_SRC_MI = { "מדות": 89, "מידות": 89, "משנה מדות": 89, "סנהדרין": 73, "משנה סנהדרין": 73, "מנחות": 81, "משנה מנחות": 81, "תמיד": 88, "משנה תמיד": 88, "כלים": 91, "משנה כלים": 91, "יומא": 55, "משנה יומא": 55, "שקלים": 54, "משנה שקלים": 54, 'רמב"ם בית הבחירה': 337, 'רמב"ם הלכות בית הבחירה': 337, "הלכות בית הבחירה": 337, "בית הבחירה": 337 };
  var UI_SRC_TAL = { "מנחות": 131, "יומא": 107, "עירובין": 105, "סוטה": 119, "בבא בתרא": 124, "סנהדרין": 125, "זבחים": 130, "חגיגה": 114, "סוכה": 108, "מגילה": 112 };
  var UI_SRC_PRE = ['רש"י', 'רד"ק', "מצודת דוד", "מצודת ציון", "מצודות", 'מלבי"ם', 'רלב"ג', "תרגום יונתן", "תרגום"];
  var UI_SRC_TN_IDS = [10, 11, 38, 39, 13, 2, 3, 4, 31, 32];
  var UI_SRC_BARE = "";   // UI_UNIFY_A2: a bare "(ב, ג)" with no citation named before it - not linked (no default book here)
//@@end ui_sefToOtz.mm
//@@begin UI_BOOK_ITEM
  // ===== 1.0.2 (item 2): opening the plugin from the books (the reader's button "open-beit-rishon", openPlugin: true, shown in I Kings
  // and II Chronicles only). Otzaria opens the page and delivers reader.toolbar_item_clicked with the reading position (api.md: itemId,
  // currentBook = the title, currentBookId, currentId = the numeric id, currentIndex = the line, currentRef); plugin.page_opened's param is
  // read the same way when it carries a position. The listeners are set when the script runs - the event may come while the model loads -
  // and the position waits in ui_bookQueue until buildUI is done and the loading screen is gone (ui_bookGo is set at buildUI's end). =====
  var UI_BOOK_ITEM = "open-beit-rishon";
//@@end UI_BOOK_ITEM
//@@begin ui_READ
    10: [   // I Kings
      [6, 5, 10, { p: "היציע והתאים" }],
      [6, 16, 16, { v: "kodeshHakodashim" }], [6, 19, 20, { v: "kodeshHakodashim" }],
      [6, 30, 30, { p: "רצפת הבית — ברושים מצופים זהב" }],   // 6:30 'ואת קרקע הבית צפה זהב' (the floor; in the carvings' range)
      [6, 15, 22, { p: "ההיכל" }],
      [6, 23, 28, { p: "הכרובים" }],
      [6, 29, 29, { p: "גילופי הקירות — כרובים, תמורות, פטורי ציצים, פקעים" }],
      [6, 31, 32, { p: "פתח הדביר (מזוזות חמישית) — שני ביאורי רש״י" }],
      [6, 33, 35, { p: "פתח ההיכל ודלתותיו" }],
      [6, 36, 36, { p: "חצר הכהנים" }],                                // 'ויבן את החצר הפנימית' (Rashi: חצר הכהנים)
      [6, 0, 99, { v: "heichalFront" }],                               // 6:1-4, 6:11-14, 6:37-38: the building of the house (model choice: the house from outside)
      [7, 2, 5, { p: "בית יער הלבנון" }],
      [7, 6, 6, { p: "אולם העמודים" }],                                // 7:6 'ואת אולם העמודים עשה'
      [7, 7, 7, { p: "אולם הכסא ואולם המשפט" }],
      [7, 8, 8, { p: "בית בת פרעה" }],
      [7, 0, 12, { p: "החצר הגדולה" }],                                // 7:1-12 the palace (7:12 'וחצר הגדולה סביב')
      [7, 13, 22, { v: "yachinBoazFull" }],
      [7, 23, 26, { p: "הים של שלמה" }],
      [7, 27, 39, { p: "עשר המכונות והכיורות" }],
      [7, 40, 51, { p: "כלי הבית — סוף פרק ז" }],
      [8, 0, 11, { p: "הארון ובדיו" }],
      [8, 64, 64, { p: "מזבח הנחושת" }],
      [10, 18, 20, { p: "כסא שלמה" }]
    ],
    39: [   // II Chronicles
      [3, 1, 1, { p: "הר הבית והחצר הגדולה" }],                       // 3:1 'בהר המוריה... במקום דויד בגרן ארנן'
      [3, 5, 7, { p: "ההיכל" }],
      [3, 8, 9, { v: "kodeshHakodashim" }],
      [3, 10, 13, { p: "הכרובים" }],
      [3, 14, 14, { p: "הפרוכת" }],
      [3, 15, 17, { v: "yachinBoazFull" }],
      [3, 0, 4, { v: "heichalFront" }],                                // 3:2-4 the house
      [4, 1, 1, { p: "מזבח הנחושת" }],
      [4, 2, 5, { p: "הים של שלמה" }],
      [4, 6, 6, { p: "עשר המכונות והכיורות" }],
      [4, 7, 7, { p: "מנורת משה ועשר המנורות" }],
      [4, 8, 8, { p: "שולחן משה ועשרה השולחנות" }],
      [4, 9, 9, { p: "חצר הכהנים" }],
      [4, 10, 10, { p: "הים של שלמה" }],                                // 4:10 'ואת הים נתן מכתף הימנית קדמה ממול נגבה'
      [4, 11, 22, { p: "כלי הבית — סוף פרק ז" }],
      [5, 2, 10, { p: "הארון ובדיו" }],
      [9, 17, 19, { p: "כסא שלמה" }]
//@@end ui_READ
//@@begin ui_bookOf
    if (typeof b === "number") return b === 10 || b === 39 ? b : null;
//@@end ui_bookOf
//@@begin ui_bookOf-2
    if (/^מלכים א$|^I Kings$/i.test(t)) return 10;
    if (/^(?:דברי הימים ב|דהי ב|II Chronicles)$/i.test(t)) return 39;
//@@end ui_bookOf-2
//@@begin ui_YB_BODY
  // ===== explanation texts of the views (Hebrew, verse reference first; wording after research/*.md) =====
  // 1.0.1-L: the pillars' text is shared by the far view "יכין ובועז" (yachinBoazFull, L.58) and the in-doorway place (yachinBoaz)
  var ui_YB_BODY = "יכין ובועז (מלכים א ז, טו–כב): עמודי נחושת — 'שמנה עשרה אמה קומת העמוד האחד וחוט שתים עשרה אמה יסב' — עגולים, ארבע אמות עוביים, 'והוא חלול' (רש״י), ודופנם ארבע אצבעות (ירמיהו נב, כא: 'ועביו ארבע אצבעות נבוב').\nהכותרת: על כל עמוד כותרת של חמש אמות (ז, טז), והעמוד תחוב בה שתי אמות (רש״י), ולכן **גובה כל העמוד עם הכותרת עשרים ואחת אמה**, כציור הספר. הכותרת — 'כמין שני אגנים' (רש״י ז, יח): הגולה מצוירת שושנים, הבטן ועליה שני טורי רימונים, 'מאה רמונים בטור, חרוזים בשרשרות' (רש״י ז, מב), השבכה 'כמין כפה' הקלועה משבעה לולבים (רש״י ז, יז), וכותרת קטנה בראשה. שיטת מלבי״ם לכותרת — בתפריט, תחת ״שיטות ומחלוקות״.\nמקומם — 'שהעמיד באולם' (רש״י ז, טו), יכין מימין, 'בפאת הדרומי' (מצודת דוד ז, כא), ובועז משמאל — 'העמידם שלמה באולם סמוך לכותל ההיכל' (רש״י ירמיהו נב, כג).\nבמודל: צמודים לכותל ככל שהכותרת מניחה (ראו 'יכין ובועז — מבט מפתח האולם').";
  var ui_INFO = {
    __general: "בית המקדש הראשון שבנה שלמה: **הבית שישים אמה אורך, עשרים רוחב ושלושים גובה** (מלכים א ו, ב), ולפניו האולם. בחצר הכהנים מזבח הנחושת, הים והמכונות, וסביב הכול החצר הגדולה.\nבמודל: מה שאינו בפסוקים הושלם מחז״ל ומן המפרשים, ומסומן בלוח 'השלמות'.",
    harHabayit: "החצר הגדולה (מלכים א ז, יב) מקיפה את הבית ואת חצר הכהנים. ('העזרה הגדולה' שבדברי הימים ב ד, ט, שדלתותיה מצופות נחושת — לרש״י, לרלב״ג, למצודת דוד ולרד״ק היא עזרת ישראל, שבחצר הפנימית; ראו 'החצר הפנימית'.)\nבמודל: חומתה בנויה אבני גזית. ״שלשה טורים גזית וטור כרתת ארזים״ נאמר על חצר בית המלך (מלכים א ז, יב; מצודת דוד: ״אשר היה מסבב כל בתי המלך״; רלב״ג: ״שהחצר הגדולה אשר בה בית המלך״) ועל החצר הפנימית (שם ו, לו), ולא על חומת החצר הגדולה של בית ה׳. גודלה **חמש מאות על חמש מאות אמה** — על פי מסכת מדות (ב, א), כי בפסוקים אין מידה; גובה החומה — בחירת מודל.",
    eastGate: "השער המזרחי של החצר הגדולה, מול פתח הבית.\nבמודל: מספר השערים ושמותיהם אינם בפסוקים — שער אחד בכל צד הוא בחירת מודל. דלתותיהם — עץ (בחירת מודל); דלתות הנחושת (דברי הימים ב ד, ט) — בשערי החצר הפנימית, כרש״י שם.",
    newCourt: "החצר החיצונה (החצר החדשה): לפנים ממנה חצר הכהנים (רש״י מלכים א ו, לו: 'לפנים מעזרת נשים'). היא 'החצר החדשה' שלפניה עמד יהושפט (דברי הימים ב כ, ה; זבחים לב:).\nבה לשכות (ירמיה לה, ד; לו, י), 'העמוד' שעליו עמד המלך (מלכים ב יא, יד; כג, ג) וארון יהוידע שבשער (דברי הימים ב כד, ח) — מימי יואש, ומוצג רק בכפתור שלו.\nבמודל: גודלה ומפלסה — בחירת מודל. חומתה הנמוכה — חומה רגילה של אבני גזית, בלי נדבך ארז, כי לא נמצא מקור לנדבך ארז בחצר החיצונה.",
    azarah: "חצר הכהנים — 'החצר הפנימית' (מלכים א ו, לו): שלושה טורי גזית וטור כרותות ארזים.\nמידותיה (187 על 135) ושבעת שעריה — על פי מסכת מדות (ה, א; א, ד), כי במלכים אין מידה לחצר. רצפתה לוחות שיש — 'ואבני שיש לרב' (דברי הימים א כט, ב), ורש״י שם: 'לעמודים ושלחנות ולרצפה'.\nבמודל: בה מזבח הנחושת ובצפונו בית המטבחים (השלמה מבית שני); **הים בקרן המזרחית הצפונית** (רש״י), ועשר המכונות וכיור משה בגוש אחד מדרום לציר הבית, מול אגף האולם הדרומי; ולשכת הגזית על החומה הצפונית, בין השער הצפוני לים.",
    mizbeach: "מזבח הנחושת (דברי הימים ב ד, א): **עשרים אמה אורך, עשרים רוחב ועשר גובה**.\nהשלמת מודל: הכבש מדרום ('לא תעלה במעלות', שמות כ; מידותיו כמדות ג, ג) והקרנות (כמזבח המשכן, שמות כז; מדות ג, א). סביבו היסוד, הסובב וחוט הסיקרא, כמשנה (מדות ג, א; זבחים סב.), והכבש 'פורח אמה על יסוד ואמה על סובב' (זבחים סב:) — השלמה.",
    // 1.0.1-L (L.7 / L.75, the user: "כרש\"י ובספר"; vessels.json): the Sea in the inner court's CORNER, north-east for Rashi (the default)
    yam: "הים (מלכים א ז, כג–כו): עשר אמות משפה אל שפה, חמש אמות קומתו, 'ועביו טפח' ו'אלפים בת יכיל' (ז, כו) — ובמודל 450 אמה מעוקבת, ראו 'צורת הים' בהמשך — ועומד על שנים עשר בקר: פניהם לחוץ ואחוריהם 'ביתה' (ז, כה). שלוש אמותיו התחתונות מרובעות ושתיים העליונות עגולות (עירובין יד:).\nמקומו — במקצוע, בקרן העזרה: 'ואת הים נתן מכתף הבית הימנית קדמה ממול נגב' (ז, לט).\nרש״י: 'מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה' — **ברירת המחדל**, כציור הספר ומפתו, ממזרח לצפון בית המטבחים.\nבקצרה — המחלוקת: לרד״ק, מצודות ורלב״ג ולרש״י על דברי הימים ב ד, י — במקצוע המזרחית־דרומית (המתג 'מקום הים' בתפריט, תחת ״שיטות ומחלוקות״).\nבמודל: ציר הים 11 אמות מן הכתלים — בחירת מודל; המקורות אומרים 'מקצוע' ולא מרחק.",
    // 1.0.1-K (K.3): the bases rebuilt after Rashi, "בעל צורת הבית" and the book. 1.0.1-L (L.40, L.64, L.77; vessels.json): ALL TEN in one
    // block of 2 x 5 south of the house with Moses' laver between the rows (the book p. לח), their purpose, the pills (L.51: no panel places)
    mechonot: "עשר המכונות (מלכים א ז, כז–לט): 'ארבע באמה ארך המכונה האחת וארבע באמה רחבה ושלש באמה קומתה'; על כל אחת כן וכיור של ארבעים בת.\nמקומן: כולן במקום אחד, שתי שורות של חמש וכיור משה ביניהן — רש״י: 'ויתן חמשה מימין. לכיור של משה' (רש״י דברי הימים ב ד, ו); רד״ק: 'מימין כיור משה ומשמאלו' (רד״ק דברי הימים ב ד, ו). שתי השורות כציור 'מקרא מפורש' (עמ' לח) וכמפתו (עמ' ב–ג): מדרום לציר הבית, מול אגף האולם הדרומי, בינו לבין הכבש — השורה הצפונית בין האגף לכבש, והדרומית מעט מדרום להם.\nתפקידן: 'את מעשה העולה ידיחו בם' (דברי הימים ב ד, ו) וקידוש ידיהם ורגליהם של הכהנים — רש״י: 'לרחצה בהם. קדוש ידים ורגלים' (רש״י שם); רד״ק: 'והכיורים היו לרחוץ מהם הכהנים ידיהם ורגליהם ולהדיח בהם מעשה העולה' (רד״ק ז, לט).\nבמודל: על המכונה שבשורה הצפונית שני כפתורים — 'הבא את הכיור לקידוש ידים ורגלים ולהדחת העולה' ו'פרק: כיור, כן ומכונה'; ובלוח 'המזבח וכלי הנחושת': 'המכונות מקרוב'. גובה הברז — בחירת מודל.",
    // 1.0.1-K (K.2): the house closed on all sides, the chambers' block, the ulam 84 wide and its courses (7:12, not Rashi). 1.0.1-L (L.41):
    // the camera from the south-east above, as the book's general view; L.59 the doorway 10 x 22 with its open doors
    heichalFront: "בית ה׳ מבחוץ (מלכים א ו, ב–ג): **שישים אמה אורך, עשרים רוחב ושלושים גובה מבפנים**; האולם על פניו — עשרים אמה על עשר.\nהבית סגור מכל צדדיו, וסביבו מדרום, ממערב ומצפון גוש התאים הנמוך של היציע — כותליו החיצוניים אבן, וראשי קורות הגג בראשם — וכותל הבית עולה מעליו, כציור הכללי בספר.\nהאולם: חזיתו, עם בית החליפות משני צדיו (רש״י יומא לו.), שמונים וארבע אמות; פתחו עשר על עשרים ושתיים (בחירת מודל) ובו שתי דלתות ארז פתוחות — 'גם סגרו דלתות האולם' (דברי הימים ב כט, ז); כתליו שלושה נדבכי גזית ונדבך ארזים — 'ולאלם הבית' (ז, יב) כפירוש מצודת דוד, רלב״ג, מלבי״ם ורד״ק.\nבמודל: המבט מדרום־מזרח ומלמעלה, כציור הכללי בספר. על המודל: 'פתח את הבית', 'פתח את האולם' — כלי צפייה בלבד.",
    heichalSouth: "היציע (מלכים א ו, ה–י): שלוש קומות של תאים סביב הבית, מדרום, ממערב ומצפון.\nכברירת מחדל הוא סגור, כציור הכללי בספר: כותל התאים החיצוני אבן, חמש אמות עוביו ('וכתל התא חמש', מדות ד, ז), ובראשו רצועת ראשי קורות הגג; ופתח אחד מבחוץ — 'שבחמש תאים שבדרום היה לה פתח אל החוץ בשורה התחתונה' (רש״י ו, ח).\nחשבון רש״י (ו, ו; ו, י): **התאים חמש, שש ושבע אמות רוחבם**, וחמש אמות גובה כל קומה, כי כותל הבית נכנס אמה בכל קומה — שבע, שש וחמש, וארבע מעל גג התאים — וקורות הארז מונחות על המגרעות, 'לבלתי אחז בקירות הבית'.\nבמודל: בלוח 'היציע' — 'חתך היציע' מסובב את המבט אל החתך ומראה את החשבון במידות, כל קומה בצבע משלה (וחוזר לבד אחרי 15 שניות). על המודל: 'הצג חתך של היציע (רש״י)' עושה זאת גם הוא, ו'הסר את קירות היציע' מסיר את הכתלים החיצוניים (הגג נשאר) — לצפייה בלבד.\nבקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״צורת היציע״ שבתפריט, תחת ״שיטות ומחלוקות״): רש״י (כספר, ברירת המחדל) — תאים, וכותל הבית נגרע אמה בכל קומה; הרמב״ם — שני כתלים וביניהם הרחקה, והיציעים גזוזטראות מחוץ לבית.",
    // 1.0.1-L (L.44 the view from the front; L.59 the doorway 10 x 22, a model choice, with two open cedar doors - heichal-door.md)
    ulamInside: "האולם (מלכים א ו, ג): 'עשרים אמה ארכו על פני רחב הבית עשר באמה רחבו' — לפני ההיכל.\nהמבט מן החזית, מול פתח האולם: חזיתו כולה ופתחו באמצע — ובעדו נראה פתח ההיכל — בלי להסיר דבר. משני צדיו בית החליפות, חמש עשרה אמה מכל צד (רש״י יומא לו.), כך שחזיתו שמונים וארבע אמות.\nפתחו — עשר על עשרים ושתיים, בחירת מודל (אין מקור למידות פתח האולם בבית ראשון; 'פתחו של אולם, גבהו ארבעים אמה, ורחבו עשרים אמה', מדות ג, ז, הוא בית שני) — ושתי דלתות ארז פתוחות, מקופלות אל תוך עובי הפתח: 'גם סגרו דלתות האולם ויכבו את הנרות' (דברי הימים ב כט, ז). המאירי (יומא נד.): 'ואע״פ ששערים של עץ היו שם מ״מ לא היו נועלים אותם ביום ופורסים הפרוכת לפניהם' — הפרוכת לא נבנתה. **ראש הפתח קשת** — רש״י (מלכים א ז, ה): 'רבועין היו כשאר פתחי בתים, ולא עשויין כפה כעין פתחי אולם'; והדלתות מגיעות עד תחילת הקשת.\nתקרת האולם — **כיפה**. בקצרה — רש״י (יומא נב., על אולם בית שני): 'כיפת החלל שהיא י״א אמה'; ותוספות רי״ד שם חולק: 'ולא הי׳ שם תקרה ולא כיפה'. במודל: כיפה על עשר האמות של חלל האולם, וראשה בגובה תקרת הארז; העתקת דברי רש״י לבית ראשון, גובה הכיפה וצורתה — בחירת מודל.\nכתליו שלושה נדבכי גזית ונדבך ארזים — 'ולאלם הבית' (ז, יב) כפירוש מצודת דוד ('כי כולם בנה בשלשה טורים גזית'), רלב״ג, מלבי״ם ורד״ק; רש״י שם מתאר את הדגם בלבד ('החומה עשויה שלשה נדבכין של אבנים, ונדבך של עץ עליהם').\nבתוכו, משני צדי פתח ההיכל, יכין ובועז (רש״י ז, טו). **אין בו ציפוי זהב** (רש״י ומצודות על דברי הימים ב ג, ד).\nבמודל: 'פתח את האולם' שעל המודל מסיר את חזיתו ואת גגו — לפתיחה מלאה, לצפייה בלבד.",
    // 1.0.1-K (K.1): after Rashi and the book - the whole pillar 21, the two basins, Rashi on Jer 52:23. 1.0.1-L (L.6, L.58): the far view
    // through the doorway is the grid's "יכין ובועז" (yachinBoazFull); the in-doorway camera stays as a place
    yachinBoaz: ui_YB_BODY + "\nבמודל: המבט מפתח האולם, והאולם סגור; 'פתח את האולם' שעל המודל מסיר את חזיתו ואת גגו, לצפייה בלבד. ראו 'כותרת העמוד' בלוח.",
    // (L.58, verify-heichal.md: the ulam stays closed; the camera far from the north-east, where the doorway frames Yachin whole; Boaz by dragging, or the place "בועז — מרחוק")
    yachinBoazFull: ui_YB_BODY + "\nבמודל: המבט מרחוק, מן החצר, והאולם סגור. בעד פתח האולם (עשר על עשרים ושתיים) ובין דלתותיו הפתוחות נראה יכין בשלמותו, מן הרצפה ועד ראש הכותרת — **עשרים ואחת אמה** — כנגד חזית האולם, המעלות והמזבח, כדי שייראה גודלו.\nשני העמודים יחד אינם נראים בשלמותם מבחוץ: הם עומדים בתוך האולם משני צדי הפתח, והפתח רוחבו עשר. גררו את המבט סביב הפתח אל הדרום־מזרח — ונראה בועז. 'פתח את האולם' שעל המודל מסיר את חזיתו ואת גגו, לצפייה בלבד; אז נראים שניהם בשלמותם במבט 'האולם'. ראו גם 'יכין ובועז — מבט מפתח האולם' ו'כותרת העמוד' בלוח.",
    heichalDoor: "פתח ההיכל (מלכים א ו, לג–לה): מזוזות עצי שמן מרובעות ('מאת רבעית' — רש״י ותרגום), ושתי דלתות ברושים מגולפות כרובים, תמורות ופרחים ומצופות זהב.\nבמודל: מידות הפתח (עשר על עשרים) — בחירת מודל.",
    // 1.0.1-K (K.5, the addendum D): the carvings after the book are the default look; the layers are an option; the floor; the smoke
    kodesh: "ההיכל: ארבעים אמה (מלכים א ו, יז), ובו המנורות, השולחנות ומזבח הזהב — 'הבית הוא ההיכל לפני' (ו, יז): החלל שלפני הדביר, ולא הבית כולו.\nהקירות ארז מגולף ומצופה זהב — 'הכל ארז אין אבן נראה' (ו, יח) — והרצפה ברושים מצופים זהב (ו, טו; ו, ל).\nהגילופים: 'פתוחי מקלעות כרובים ותמורות ופטורי ציצים' (ו, כט) ו'מקלעת פקעים ופטורי ציצים' (ו, יח). רש״י: כרובים, דקלים, חבלים ופרחים, והפקעים 'כמין כפתורים' (תרגום: ביצים). רד״ק: מפותחים ולא בולטים.\nבמודל, כציור הספר: רקע קלוע דק, חבל שזור, זוגות כרובים בגלימות ארוכות בלי ידיים ובפני ילד ('כרביא', חגיגה יג:), דקלים גבוהים, פקעים, שושנים ושרשרות — שורה כל עשר אמות, והזהב שוקע בחקק (רש״י ו, לב). זה מראה הבית; שכבות האבן והארז שמתחת לזהב — אפשרות תצוגה בכפתור 'הצג את שכבות הקיר והרצפה' שעל הקיר הצפוני, סמוך לפתח.\nהכלים: **מנורת משה ועשר המנורות בדרום** — כל אחת עם גביעיה, כפתוריה ופרחיה ואבן של שלוש מעלות לפניה; **שולחן משה ועשרה השולחנות בצפון**, כולם בתבנית שולחן משה; ומזבח הזהב, אמה על אמה ואמתים קומתו (שמות ל, ב), מיד מזרחית לשורות, ועליו עשן הקטורת (ז, מח–מט; מנחות צח:).",
    devirDoor: "הפסוק: 'ואת פתח הדביר עשה דלתות עצי שמן האיל מזוזות חמשית' (מלכים א ו, לא).\nרש״י — שני ביאורים, ושניהם במודל (בתפריט, תחת ״שיטות ומחלוקות״): (א) 'ואני אומר' — חמש צלעות היו למזוזות ולא היו מרובעות, ואין הכתוב מדבר במפתן ובמשקוף (**ברירת המחדל**) — ומעל הפתח משקוף של זהב בחתך המזוזות המחומשות, כציור הספר: רד״ק 'האיל הוא הסף העליון... וכן האיל', רלב״ג 'שהאיל והוא הסף אשר על הפתח', מלבי״ם 'האיל ר״ל המשקוף' (רש״י אינו שולל משקוף) — בחירת מודל; (ב) 'כך שמעתי' — חמישה חלקי מסגרת: המפתן, שתי המזוזות והמשקוף העשוי כשניים.\nבקצרה — עוד שיטות: רד״ק — חמש מדרגות זו לפנים מזו; רלב״ג ומלבי״ם — 'חמישית': הפתח החמישי שבמקדש.\nבמודל: הדלתות עצי שמן מגולפות ומצופות זהב (ו, לב), עומדות פתוחות (רד״ק), ועליהן הפרוכת (דברי הימים ב ג, יד). מידות הפתח — בחירת מודל.",
    kodeshHakodashim: "הדביר — קודש הקדשים (מלכים א ו, יט–כ): **עשרים אמה אורך, עשרים רוחב ועשרים גובה**, כולו זהב, וקירותיו מגולפים כהיכל (ו, כט 'מלפנים').\nשני הכרובים: עצי שמן מצופים זהב, עשר אמות קומתם, חמש אמות כל כנף — כנף נוגעת בקיר וכנף נוגעת בכנף חברו (ו, כג–כח; דברי הימים ב ג, י–יג); 'מעשה צעצעים' — תבנית ילדים (רש״י), 'והם עמדים על רגליהם ופניהם לבית'.\nחז״ל: 'כרובים — בנס הן עומדין' — ארבע הכנפיים ממלאות את כל עשרים האמה ואין מקום לגופם (בבא בתרא צט.; רש״י מלכים א ו, כד: 'וגוף הכרובים אינו מן המדה ועומד בנס'); ושם מקשה אביי: 'ודלמא בולטין כתרנגולין הוו קיימי' — גופם תחת כנפיהם, וכך רד״ק (ו, כז) — וכך נבנה המודל.\nבמודל, כציור הספר: לבושים עד הקרקע, בלי ידיים, פני ילד ('כרביא'), וארבע הכנפיים פרושות במישור אחד מאוזן, שוכבות לרוחב הדביר מתחת לראשים כסוכה על הארון — 'כי הכרובים פרשים כנפים אל מקום הארון ויסכו הכרבים על הארון ועל בדיו מלמעלה' (ח, ז). הארון ובדיו (ח, ו–ח) על אבן השתייה (יומא נג:). **קודש הקדשים מכוסה בענן**; 'הסר ענן' שעליו מבקש אישור.\nבקצרה — גובהו: עשרים אמה, כרש״י (**ברירת המחדל**); לגמרא (בבא בתרא צח:) ולתוספות — שלושים, והעשרים נמנות משפת הכרובים ולמעלה; לרד״ק — שלושים, ועשר העליונות אבן יקרה (בתפריט, תחת ״שיטות ומחלוקות״, במתג 'גובה קודש הקדשים').",
    aliyot: "הפסוק: 'והגבה מאה ועשרים' (דברי הימים ב ג, ד).\nרש״י: שלושים אמה עד תקרת העלייה הראשונה, ועוד תשעים אמה של עליות עד הגג העליון. רד״ק (כדעה שנייה): 'ג' עליות גבהן תשעים אמה'.\nלמה שימשו? לגניזת אהל מועד וכליו — אברבנאל: 'והיו הכהנים נושאים הארון והלויים נושאים אהל מועד, והכלים אשר עשה משה במדבר ואהל מועד גנזו באוצרות בית האלקים, והם העליות שהיו ממעל לדביר ולהיכל' (אברבנאל מלכים א ח); וכן מצודת דוד (מלכים א ח, ד): אהל מועד וכליו הועלו להיגנז בבית.\nבמודל: **שתי עליות, זו על גב זו**, וכל אחת סגורה בתקרת הגבים, בית דילפא ושדרות בארזים — כאיור הספר (חלוקת הגובה — בחירת מודל). הכפתור שעל העליות פותח את הכותל הדרומי ומראה את פנימן.",
    // 1.0.1-L (L.20, L.22, L.33, L.57, L.81): three readings of the forest house, the king's own court, the garden without the pool, the throne's versions
    palace: "בית שלמה (מלכים א ז, א–יב):\nבית יער הלבנון — בשלוש שיטות (רש״י כציור הספר; מלבי״ם ורלב״ג; מצודת דוד — בתפריט, תחת ״שיטות ומחלוקות״), ובו המגינים והצינות (י, טז–יז); אולם העמודים ו'אולם על פניהם' (ז, ו).\nאולם הכסא ואולם המשפט עם כסא שלמה (ז, ז; י, יח–כ) — בארבע גרסאות מדרשיות, ועליית המלך אליו.\nבית המלך בחצר משלו — החצר האחרת, 'מבית לאולם' (ז, ח) — ובה הגן (קהלת ב, ה; בלי בריכה); בית בת פרעה בחצר הגדולה, חצר בית יער הלבנון; והחצר הגדולה סביב (ז, יב)." // 1.0.1: buildUI appends the placement basis (ctx.shared.palaceBasis / ui_PALACE_BASIS); 1.0.1-K: review Q2-5 (Ralbag only with his count)
  };
  // 1.0.1 (FIXES E.2 / F.3): the basis of the palace's placement (south of the Temple's great court, on a lower terrace) - the UI's copy,
  // used when 60-palace.js did not write ctx.shared.palaceBasis. The verses: I Kings 10:5 (II Chr 9:4 "ועליתו"), II Kings 11:19,
  // Jer 26:10, Jer 22:1 (the palace below the house, one goes UP to the house), I Kings 8:1 (the city of David south of the house).
  var ui_PALACE_BASIS = "מקומו: בית המלך עמד למטה מבית ה׳ ועלו ממנו אל הבית — 'ועלתו אשר יעלה בית ה׳' (מלכים א י, ה; דברי הימים ב ט, ד: 'ועליתו'), 'וירידו את המלך מבית ה׳ ויבואו דרך שער הרצים בית המלך' (מלכים ב יא, יט), 'ויעלו מבית המלך בית ה׳' (ירמיהו כו, י), 'רד בית מלך יהודה' (ירמיהו כב, א). והעיר, עיר דוד, הייתה מדרום למקדש — הארון הועלה 'מעיר דוד היא ציון' אל הבית (מלכים א ח, א).\nבמודל: הארמון צמוד לחצר הגדולה מדרום, על מדרגה נמוכה ממנה; המרחק (עשרים אמה) והירידה (עשר אמות) — בחירת מודל.";
  var ui_REFS = {
    __general: [["מלכים א ו, ב", ui_V(10, 6, 2)], ["דברי הימים ב ג, ג", ui_V(39, 3, 3)]],
    harHabayit: [["דברי הימים ב ד, ט", ui_V(39, 4, 9)], ["מלכים א ז, יב", ui_V(10, 7, 12)], ["מדות ב, א", ui_MI(2, 1)]],
    eastGate: [["דברי הימים ב ד, ט", ui_V(39, 4, 9)], ["מלכים א ז, יב", ui_V(10, 7, 12)]],
    newCourt: [["רש״י מלכים א ו, לו", ui_V(10, 6, 36)], ["דברי הימים ב כ, ה", ui_V(39, 20, 5)], ["זבחים לב:", ui_P(130, "לב:")], ["רמב״ם בית הבחירה ז, יז", ui_RB(7, 17)], ["ירמיהו לה, ד", ui_V(13, 35, 4)], ["ירמיהו לו, י", ui_V(13, 36, 10)], ["מלכים ב יא, יד", ui_V(11, 11, 14)], ["דברי הימים ב כד, ח", ui_V(39, 24, 8)]], // 1.0.1: the outer court's uses (FIXES D.2); II Chr 20:5 dropped with the "new court" identification (20-mount.js); 1.0.1-K: II Kings in Otzaria (Q2-7)
    azarah: [["מלכים א ו, לו", ui_V(10, 6, 36)], ["מדות ה, א", ui_MI(5, 1)], ["מדות א, ד", ui_MI(1, 4)], ["דברי הימים א כט, ב", ui_V(38, 29, 2)]],
    mizbeach: [["דברי הימים ב ד, א", ui_V(39, 4, 1)], ["מדות ג, ג", ui_MI(3, 3)], ["מדות ג, א", ui_MI(3, 1)],
      ["זבחים סב.", { book: 130, index: 2110 }], ["זבחים סב:", { book: 130, index: 2131 }]],   // 1.0.2 add-on: the yesod and sovev (lines read in the DB)
    yam: [["מלכים א ז, כג", ui_V(10, 7, 23)], ["ז, כו", ui_V(10, 7, 26)], ["עירובין יד:", ui_P(105, "יד:")], ["ז, לט (ורש״י שם)", ui_V(10, 7, 39)], ["דברי הימים ב ד, י", ui_V(39, 4, 10)]],
    mechonot: [["מלכים א ז, כז", ui_V(10, 7, 27)], ["ז, לב", ui_V(10, 7, 32)], ["ז, לג", ui_V(10, 7, 33)], ["ז, לח", ui_V(10, 7, 38)], ["ז, לט", ui_V(10, 7, 39)], ["דברי הימים ב ד, ו", ui_V(39, 4, 6)]],
    heichalFront: [["מלכים א ו, ב", ui_V(10, 6, 2)], ["ו, ג", ui_V(10, 6, 3)], ["ו, ה", ui_V(10, 6, 5)], ["ז, יב", ui_V(10, 7, 12)], ["יומא לו.", ui_P(107, "לו.")], ["מדות ד, ז", ui_MI(4, 7)]],
    heichalSouth: [["מלכים א ו, ה", ui_V(10, 6, 5)], ["ו, ו", ui_V(10, 6, 6)], ["ו, ח", ui_V(10, 6, 8)], ["ו, י", ui_V(10, 6, 10)], ["מדות ד, ג", ui_MI(4, 3)], ["מדות ד, ז", ui_MI(4, 7)]],
    ulamInside: [["מלכים א ו, ג", ui_V(10, 6, 3)], ["ז, יב", ui_V(10, 7, 12)], ["יומא לו.", ui_P(107, "לו.")], ["רש״י ז, טו", ui_V(10, 7, 15)], ["דברי הימים ב ג, ד", ui_V(39, 3, 4)], ["דברי הימים ב כט, ז", ui_V(39, 29, 7)], ["מדות ג, ז", ui_MI(3, 7)], ["מדות ב, ג", ui_MI(2, 3)], ["יומא נד.", ui_P(107, "נד.")], ["רש״י מלכים א ז, ה", { book: 3673, index: 329 }], ["רש״י יומא נב.", { book: 2157, index: 1959 }], ["תוספות רי״ד יומא נב.", { book: 2109, index: 159 }]],   // 1.0.1-L (L.59): the doorway and its doors; 1.3.5: the arch and the vault
    yachinBoaz: [["מלכים א ז, טו", ui_V(10, 7, 15)], ["ז, טז", ui_V(10, 7, 16)], ["ז, יח", ui_V(10, 7, 18)], ["ז, כא", ui_V(10, 7, 21)], ["ז, מב", ui_V(10, 7, 42)], ["דברי הימים ב ג, טו", ui_V(39, 3, 15)], ["ירמיהו נב, כא", ui_V(13, 52, 21)], ["רש״י ירמיהו נב, כג", ui_V(13, 52, 23)]],
    heichalDoor: [["מלכים א ו, לג", ui_V(10, 6, 33)], ["ו, לד", ui_V(10, 6, 34)], ["ו, לה", ui_V(10, 6, 35)]],
    kodesh: [["מלכים א ו, יז", ui_V(10, 6, 17)], ["ו, טו", ui_V(10, 6, 15)], ["ו, יח", ui_V(10, 6, 18)], ["ו, כט", ui_V(10, 6, 29)], ["ז, מח", ui_V(10, 7, 48)], ["מנחות צח:", ui_P(131, "צח:")], ["חגיגה יג:", ui_P(114, "יג:")]],
    devirDoor: [["מלכים א ו, לא", ui_V(10, 6, 31)], ["רד״ק שם", ui_V(10, 6, 31)], ["ו, לב", ui_V(10, 6, 32)], ["דברי הימים ב ג, יד", ui_V(39, 3, 14)]],
    kodeshHakodashim: [["מלכים א ו, יט", ui_V(10, 6, 19)], ["ו, כ", ui_V(10, 6, 20)], ["ו, כג", ui_V(10, 6, 23)], ["ו, כד", ui_V(10, 6, 24)], ["דברי הימים ב ג, י", ui_V(39, 3, 10)], ["ג, יג", ui_V(39, 3, 13)], ["בבא בתרא צט.", ui_P(124, "צט.")], ["ח, ו", ui_V(10, 8, 6)], ["ח, ז", ui_V(10, 8, 7)], ["יומא נג:", ui_P(107, "נג:")]],
    aliyot: [["דברי הימים ב ג, ד", ui_V(39, 3, 4)], ["בבא בתרא ג.", ui_P(124, "ג.")], ["מלכים א ח, ד", ui_V(10, 8, 4)], ["מצודת דוד שם", ui_V(10, 8, 4)], ["מלכים א ו, ט", ui_V(10, 6, 9)]],
    palace: [["מלכים א ז, א", ui_V(10, 7, 1)], ["ז, ב", ui_V(10, 7, 2)], ["ז, ח", ui_V(10, 7, 8)], ["ז, יב", ui_V(10, 7, 12)],
      ["י, ה", ui_V(10, 10, 5)], ["ח, א", ui_V(10, 8, 1)], ["ירמיהו כו, י", ui_V(13, 26, 10)], ["ירמיהו כב, א", ui_V(13, 22, 1)], ["מלכים ב יא, יט", ui_V(11, 11, 19)]] // 1.0.1: the placement basis (FIXES F.3); 1.0.1-K: II Kings in Otzaria (review Q2-7)
  };
  ui_REFS.yachinBoazFull = ui_REFS.yachinBoaz;   // 1.0.1-L (L.58): the far view shares the pillars' sources
  // 1.0.1-L: ONE phone rule for the JS and the CSS (the brief: "the 639 px media rule"): a window up to this many px wide is a phone -
  // the panel starts closed and closes after a choice, the explanation card is a bottom sheet, the nav row hides its captions
//@@end ui_YB_BODY
//@@begin UI_NEWS
    ver: "__PLUGIN_VERSION__",   // 1.1.0: tools/build.mjs writes manifest.json's version here
    items: ["@גדול **חדש בגרסה 4.2.0**", "**לוח הבקרה בטלפון** — בטלפון, שורת הכפתורים שבתחתית המסך (סיבוב, קירוב, מדידה והליכה) כיסתה את שולי לוח הבקרה, ואת הכפתורים שבתחתית הלוח אי אפשר היה ללחוץ במלואם. עכשיו הלוח מסתיים מעל שורת הכפתורים.", "**שם הבית בסרגל העליון, בחלון צר** — בטלפון ובחלון צר מאוד, שם הבית נחתך עד שנשארו ממנו שתי אותיות בלבד. עכשיו הוא מוצג בשלמותו, בשתי שורות. כדי לפנות לו מקום, מספר הגרסה אינו מוצג בסרגל כשהחלון צר.", "**כרטיסי ההסבר — קריאה נוחה יותר** — הטקסט מיושר לשני הצדדים. בכרטיס שיש בו כמה שיטות, מתגי השיטות עומדים בראש הכרטיס, מעל הטקסט. רשימת המקורות סגורה בתחילה: ״הצג מקורות״ פותח אותה ו״הסתר מקורות״ סוגר אותה. כך גם בכרטיס שבמצגת. התוכן עצמו לא השתנה.", "**מעבר בין כרטיסים** — בכל מעבר המצלמה מתחילה מחדש, כך שהמודל לא ״רץ באוויר״ לפני שהוא מתמקם. הטיסה למקום רחוק ארוכה מן הטיסה למקום קרוב.", "**כפתורי ״פתח את המסיבה״ ו״הסר ענן״** — הם מופיעים רק במקום שלהם, ולא באמצע הדגמה או מצגת.", "**האונקליות (קרסי בית המטבחיים)** — הלחיצה על ״האונקליות״ כבר אינה מהבהבת. הקרסים מסומנים בשחור קבוע, בכל שיטות בית המטבחיים.", "**שחיטת קדשי קדשים בצפון** — הצבע שמסמן את אזור הצפון בעזרה נעלם אחרי שלושים שניות (קודם חמש עשרה), בכל השיטות.", "**בית המדרש שבהר הבית** — החדר כבר אינו ריק: בפנים ספסלים ושולחנות לתלמידים, ארונות ספרים לאורך הקירות, ומקום לראש הישיבה — כסא מכובד על במה, ולפניו שולחן עיון. הגג נפתח (נשארו רק קורות), כדי לראות את הפנים. התוספתא מזכירה את בית המדרש בשמו בלבד, ולכן כל הרהיטים וצורתם הם בחירת מודל, והם מסומנים כך בתוויות ובכרטיס.", "**עיר דוד — מצב הליכה** — הקרקע, המדרגות והמעלות אל השילוח הם עכשיו רצפה להליכה, וגבולות המבט כוללים את העיר ואת המעיין.", "@גדול **מגרסאות קודמות**", "@גדול **כדאי מאוד לעבור בעיון**", "**עיר דוד — שכבה חדשה** — כבויה בתחילה. העיר יושבת על רכס שיורד דרומה, מתחת לבית המלך, ויש בה בתים, טרסות, חומה ומצודת ציון. סביב הרכס — הגיא והנחל.", "**בעיר דוד נוספו גם** — תל המלוא, עם מתג (לפני שבנה אותו שלמה, ואחרי); קברי בית דוד, כפתח חצוב בסלע מחוץ לחומה; גן המלך; ומעיין השילוח, עם התעלה ממנו אל ברכת השלח.", "**אמה טרקסין — מתג** — לפי רש״י היא נוספת על עשרים אמות הדביר. לפי הרמב״ם היא בתוך שישים האמות, והדביר הוא תשע עשרה אמות.", "**מקום הארון — מתג** — באמצע קודש הקדשים, עשר אמות לכל רוח, או כשיטות האחרות. הכרובים ואבן השתייה זזים עם הארון.", "**שיפוע רצפת הבית — מתג** — לפי רש״י הרצפה משופעת.", "**העלייה מבית המלך לבית ה׳ — מתג** — מדרגות, או מעקה של עצי אלמוגים.", "**חומות החצרות** — חומת החצר הפנימית בנויה ״שלשה טורי גזית וטור כרתת ארזים״, כמו בפסוק. חומות החצר הגדולה והחצר החיצונה הן חומות אבן רגילות, כי לא נמצא מקור לנדבך של ארז בהן.", "**שער טדי ושערי המערב** — במקום משקוף, ״שתי אבנים מטות זו על גב זו״.", "**דלתות השערים** — בחצר הפנימית דלתות של נחושת, ובחצר הגדולה דלתות של עץ.", "**כסא שלמה** — גב עגול שלם, ובגרסת הפסוקים כיפה עגולה מעל היושב.", "**מתג ״בגדי הכהנים״** — כהן הדיוט בארבעה בגדים, וכהן גדול בשמונה.", "**הכיור והמוכני** — כמו בחלמיש.", "**ליד המזבח** — בור אחד לניסוך, במקום הספלים.", "**כני הזהב** — בצפון.", "**העמודים הננסין** — גם בשיטת המאירי.", "**שלושה עשר השופרות — מתג** — כבוי בתחילה.", "**שלושה עשר השופרות (בית ראשון) — המצלמה רואה את התיבות** — המצלמה עמדה מחוץ לכותל העזרה וראתה את הכותל במקום את תיבות השופרות. עכשיו היא בתוך העזרה, מול התיבות.", "**הדגמות חדשות** — הליכת עולה רגל בגובה העיניים, ומצוות ערבה.", "**נושאי הארון בתפילין** — בהדגמה ״דבקו שערים״ הכהנים שנושאים את הארון מניחים תפילין, כי הארון הוכנס לבית בימי חנוכת הבית שלפני חג הסוכות (רד״ק, מלכים א ח, ב).", "**מקבילים לבית שני** — דין המנעל, שמות שערי החצר הגדולה, בית הכנסת ובית המדרש.", "**כפתורי הדגמה: קדימה, אחורה ומהירות** — בשורת ההדגמות נוספו ״אחורה״ ו״קדימה״ (קפיצה בין שלבי ההדגמה) ושני כפתורים, ״מהר יותר״ ו״לאט יותר״, עם תווית ״מהירות ×N״ (חצי עד פי שלושה)."]
  };
  // 1.0.6 (the user): what is new by version, newest first - one who saw a version is shown only the versions after it; nothing stored -> all
  var UI_NEWS_VERS = [
    ["2.2.0", ["@גדול **חדש בגרסה 4.2.0**", "**לוח הבקרה בטלפון** — בטלפון, שורת הכפתורים שבתחתית המסך (סיבוב, קירוב, מדידה והליכה) כיסתה את שולי לוח הבקרה, ואת הכפתורים שבתחתית הלוח אי אפשר היה ללחוץ במלואם. עכשיו הלוח מסתיים מעל שורת הכפתורים.", "**שם הבית בסרגל העליון, בחלון צר** — בטלפון ובחלון צר מאוד, שם הבית נחתך עד שנשארו ממנו שתי אותיות בלבד. עכשיו הוא מוצג בשלמותו, בשתי שורות. כדי לפנות לו מקום, מספר הגרסה אינו מוצג בסרגל כשהחלון צר.", "**כרטיסי ההסבר — קריאה נוחה יותר** — הטקסט מיושר לשני הצדדים. בכרטיס שיש בו כמה שיטות, מתגי השיטות עומדים בראש הכרטיס, מעל הטקסט. רשימת המקורות סגורה בתחילה: ״הצג מקורות״ פותח אותה ו״הסתר מקורות״ סוגר אותה. כך גם בכרטיס שבמצגת. התוכן עצמו לא השתנה.", "**מעבר בין כרטיסים** — בכל מעבר המצלמה מתחילה מחדש, כך שהמודל לא ״רץ באוויר״ לפני שהוא מתמקם. הטיסה למקום רחוק ארוכה מן הטיסה למקום קרוב.", "**כפתורי ״פתח את המסיבה״ ו״הסר ענן״** — הם מופיעים רק במקום שלהם, ולא באמצע הדגמה או מצגת.", "**האונקליות (קרסי בית המטבחיים)** — הלחיצה על ״האונקליות״ כבר אינה מהבהבת. הקרסים מסומנים בשחור קבוע, בכל שיטות בית המטבחיים.", "**שחיטת קדשי קדשים בצפון** — הצבע שמסמן את אזור הצפון בעזרה נעלם אחרי שלושים שניות (קודם חמש עשרה), בכל השיטות.", "**בית המדרש שבהר הבית** — החדר כבר אינו ריק: בפנים ספסלים ושולחנות לתלמידים, ארונות ספרים לאורך הקירות, ומקום לראש הישיבה — כסא מכובד על במה, ולפניו שולחן עיון. הגג נפתח (נשארו רק קורות), כדי לראות את הפנים. התוספתא מזכירה את בית המדרש בשמו בלבד, ולכן כל הרהיטים וצורתם הם בחירת מודל, והם מסומנים כך בתוויות ובכרטיס.", "**עיר דוד — מצב הליכה** — הקרקע, המדרגות והמעלות אל השילוח הם עכשיו רצפה להליכה, וגבולות המבט כוללים את העיר ואת המעיין.", "@גדול **מגרסאות קודמות**", "@גדול **כדאי מאוד לעבור בעיון**", "**עיר דוד — שכבה חדשה** — כבויה בתחילה. העיר יושבת על רכס שיורד דרומה, מתחת לבית המלך, ויש בה בתים, טרסות, חומה ומצודת ציון. סביב הרכס — הגיא והנחל.", "**בעיר דוד נוספו גם** — תל המלוא, עם מתג (לפני שבנה אותו שלמה, ואחרי); קברי בית דוד, כפתח חצוב בסלע מחוץ לחומה; גן המלך; ומעיין השילוח, עם התעלה ממנו אל ברכת השלח.", "**אמה טרקסין — מתג** — לפי רש״י היא נוספת על עשרים אמות הדביר. לפי הרמב״ם היא בתוך שישים האמות, והדביר הוא תשע עשרה אמות.", "**מקום הארון — מתג** — באמצע קודש הקדשים, עשר אמות לכל רוח, או כשיטות האחרות. הכרובים ואבן השתייה זזים עם הארון.", "**שיפוע רצפת הבית — מתג** — לפי רש״י הרצפה משופעת.", "**העלייה מבית המלך לבית ה׳ — מתג** — מדרגות, או מעקה של עצי אלמוגים.", "**חומות החצרות** — חומת החצר הפנימית בנויה ״שלשה טורי גזית וטור כרתת ארזים״, כמו בפסוק. חומות החצר הגדולה והחצר החיצונה הן חומות אבן רגילות, כי לא נמצא מקור לנדבך של ארז בהן.", "**שער טדי ושערי המערב** — במקום משקוף, ״שתי אבנים מטות זו על גב זו״.", "**דלתות השערים** — בחצר הפנימית דלתות של נחושת, ובחצר הגדולה דלתות של עץ.", "**כסא שלמה** — גב עגול שלם, ובגרסת הפסוקים כיפה עגולה מעל היושב.", "**מתג ״בגדי הכהנים״** — כהן הדיוט בארבעה בגדים, וכהן גדול בשמונה.", "**הכיור והמוכני** — כמו בחלמיש.", "**ליד המזבח** — בור אחד לניסוך, במקום הספלים.", "**כני הזהב** — בצפון.", "**העמודים הננסין** — גם בשיטת המאירי.", "**שלושה עשר השופרות — מתג** — כבוי בתחילה.", "**שלושה עשר השופרות (בית ראשון) — המצלמה רואה את התיבות** — המצלמה עמדה מחוץ לכותל העזרה וראתה את הכותל במקום את תיבות השופרות. עכשיו היא בתוך העזרה, מול התיבות.", "**הדגמות חדשות** — הליכת עולה רגל בגובה העיניים, ומצוות ערבה.", "**נושאי הארון בתפילין** — בהדגמה ״דבקו שערים״ הכהנים שנושאים את הארון מניחים תפילין, כי הארון הוכנס לבית בימי חנוכת הבית שלפני חג הסוכות (רד״ק, מלכים א ח, ב).", "**מקבילים לבית שני** — דין המנעל, שמות שערי החצר הגדולה, בית הכנסת ובית המדרש.", "**כפתורי הדגמה: קדימה, אחורה ומהירות** — בשורת ההדגמות נוספו ״אחורה״ ו״קדימה״ (קפיצה בין שלבי ההדגמה) ושני כפתורים, ״מהר יותר״ ו״לאט יותר״, עם תווית ״מהירות ×N״ (חצי עד פי שלושה)."]],

    ["2.1.0", ["@גדול **כדאי מאוד לעבור בעיון**", "**עיר דוד — שכבה חדשה** — כבויה בתחילה. העיר יושבת על רכס שיורד דרומה, מתחת לבית המלך, ויש בה בתים, טרסות, חומה ומצודת ציון. סביב הרכס — הגיא והנחל.", "**בעיר דוד נוספו גם** — תל המלוא, עם מתג (לפני שבנה אותו שלמה, ואחרי); קברי בית דוד, כפתח חצוב בסלע מחוץ לחומה; גן המלך; ומעיין השילוח, עם התעלה ממנו אל ברכת השלח.", "**אמה טרקסין — מתג** — לפי רש״י היא נוספת על עשרים אמות הדביר. לפי הרמב״ם היא בתוך שישים האמות, והדביר הוא תשע עשרה אמות.", "**מקום הארון — מתג** — באמצע קודש הקדשים, עשר אמות לכל רוח, או כשיטות האחרות. הכרובים ואבן השתייה זזים עם הארון.", "**שיפוע רצפת הבית — מתג** — לפי רש״י הרצפה משופעת.", "**העלייה מבית המלך לבית ה׳ — מתג** — מדרגות, או מעקה של עצי אלמוגים.", "**חומות החצרות** — חומת החצר הפנימית בנויה ״שלשה טורי גזית וטור כרתת ארזים״, כמו בפסוק. חומות החצר הגדולה והחצר החיצונה הן חומות אבן רגילות, כי לא נמצא מקור לנדבך של ארז בהן.", "**שער טדי ושערי המערב** — במקום משקוף, ״שתי אבנים מטות זו על גב זו״.", "**דלתות השערים** — בחצר הפנימית דלתות של נחושת, ובחצר הגדולה דלתות של עץ.", "**כסא שלמה** — גב עגול שלם, ובגרסת הפסוקים כיפה עגולה מעל היושב.", "**מתג ״בגדי הכהנים״** — כהן הדיוט בארבעה בגדים, וכהן גדול בשמונה.", "**הכיור והמוכני** — כמו בחלמיש.", "**ליד המזבח** — בור אחד לניסוך, במקום הספלים.", "**כני הזהב** — בצפון.", "**העמודים הננסין** — גם בשיטת המאירי.", "**שלושה עשר השופרות — מתג** — כבוי בתחילה.", "**שלושה עשר השופרות (בית ראשון) — המצלמה רואה את התיבות** — המצלמה עמדה מחוץ לכותל העזרה וראתה את הכותל במקום את תיבות השופרות. עכשיו היא בתוך העזרה, מול התיבות.", "**הדגמות חדשות** — הליכת עולה רגל בגובה העיניים, ומצוות ערבה.", "**נושאי הארון בתפילין** — בהדגמה ״דבקו שערים״ הכהנים שנושאים את הארון מניחים תפילין, כי הארון הוכנס לבית בימי חנוכת הבית שלפני חג הסוכות (רד״ק, מלכים א ח, ב).", "**מקבילים לבית שני** — דין המנעל, שמות שערי החצר הגדולה, בית הכנסת ובית המדרש.", "**כפתורי הדגמה: קדימה, אחורה ומהירות** — בשורת ההדגמות נוספו ״אחורה״ ו״קדימה״ (קפיצה בין שלבי ההדגמה) ושני כפתורים, ״מהר יותר״ ו״לאט יותר״, עם תווית ״מהירות ×N״ (חצי עד פי שלושה)."]],
    ["2.0.0", ["@גדול **כדאי מאוד לעבור בעיון**", "**עיר דוד — שכבה חדשה** — כבויה בתחילה. העיר יושבת על רכס שיורד דרומה, מתחת לבית המלך, ויש בה בתים, טרסות, חומה ומצודת ציון. סביב הרכס — הגיא והנחל.", "**בעיר דוד נוספו גם** — תל המלוא, עם מתג (לפני שבנה אותו שלמה, ואחרי); קברי בית דוד, כפתח חצוב בסלע מחוץ לחומה; גן המלך; ומעיין השילוח, עם התעלה ממנו אל ברכת השלח.", "**אמה טרקסין — מתג** — לפי רש״י היא נוספת על עשרים אמות הדביר. לפי הרמב״ם היא בתוך שישים האמות, והדביר הוא תשע עשרה אמות.", "**מקום הארון — מתג** — באמצע קודש הקדשים, עשר אמות לכל רוח, או כשיטות האחרות. הכרובים ואבן השתייה זזים עם הארון.", "**שיפוע רצפת הבית — מתג** — לפי רש״י הרצפה משופעת.", "**העלייה מבית המלך לבית ה׳ — מתג** — מדרגות, או מעקה של עצי אלמוגים.", "**חומות החצרות** — חומת החצר הפנימית בנויה ״שלשה טורי גזית וטור כרתת ארזים״, כמו בפסוק. חומות החצר הגדולה והחצר החיצונה הן חומות אבן רגילות, כי לא נמצא מקור לנדבך של ארז בהן.", "**שער טדי ושערי המערב** — במקום משקוף, ״שתי אבנים מטות זו על גב זו״.", "**דלתות השערים** — בחצר הפנימית דלתות של נחושת, ובחצר הגדולה דלתות של עץ.", "**כסא שלמה** — גב עגול שלם, ובגרסת הפסוקים כיפה עגולה מעל היושב.", "**מתג ״בגדי הכהנים״** — כהן הדיוט בארבעה בגדים, וכהן גדול בשמונה.", "**הכיור והמוכני** — כמו בחלמיש.", "**ליד המזבח** — בור אחד לניסוך, במקום הספלים.", "**כני הזהב** — בצפון.", "**העמודים הננסין** — גם בשיטת המאירי.", "**שלושה עשר השופרות — מתג** — כבוי בתחילה.", "**הדגמות חדשות** — הליכת עולה רגל בגובה העיניים, ומצוות ערבה.", "**נושאי הארון בתפילין** — בהדגמה ״דבקו שערים״ הכהנים שנושאים את הארון מניחים תפילין, כי הארון הוכנס לבית בימי חנוכת הבית שלפני חג הסוכות (רד״ק, מלכים א ח, ב).", "**מקבילים לבית שני** — דין המנעל, שמות שערי החצר הגדולה, בית הכנסת ובית המדרש."]],
    ["1.4.15", ["**הוסרה ההדגמה ״בשעה שכרה דוד שיתין״** — בימי דוד עוד לא נבנה הבית: במקום היה גורן ארונה היבוסי (שמואל ב כד), וההדגמה הציגה את הבית סביב הסיפור. לכן היא הוסרה מקבוצת ״הדגמות״ ומעץ המקומות. ״השיתין״ עצמם, שתחת המזבח, נשארו במקומם.", "**מצב הליכה — עולים במדרגות** — במצב הליכה, כשמגיעים למדרגות, העין עולה עכשיו עם המדרגות בכל קצב הליכה. עד עכשיו, בהליכה רגילה, המבט יכול היה להיכנס לתוך המדרגות במקום לעלות עליהן. אותו תיקון נעשה גם בבית שני."]],   // DAVID_SHITIN_305 removed, WALK_STAIRS_306
    ["1.4.14", ["**חדש: הדגמה ״בשעה שכרה דוד שיתין״** — בקבוצת ״הדגמות״, וגם בעץ המקומות, מיד אחרי ״השיתין״. לפי הגמרא (סוכה נג.): כשכרה דוד את השיתין, עלה התהום ובקש לשטוף את העולם. דוד שאל אם מותר לכתוב את השם על חרס ולזרוק אותו לתהום, ואחיתופל התיר, והתהום ירד שישה עשר אלף אמה. כשראה דוד שירד הרבה, אמר חמש עשרה מעלות, והעלה אותו חמשה עשר אלף אמה, עד שעמד אלף אמה מתחת לארץ. ההדגמה מראה חתך באדמה עם סרגל באמות, ואת התהום יורד ועולה; במודל — אלף אמה בכל מזמור. דוד לבוש כמלך, ושערו וזקנו אדמוניים: ״והוא אדמוני עם יפה עינים״ (שמואל א טז, יב). בסוף, בתמונה עדינה: ״קללת חכם — אפילו בחנם היא באה. מנלן? מאחיתופל״ (מכות יא.). בכרטיס — הגמרא, רש״י, מסכת מכות והנוסח של הירושלמי.", "**מזבח הזהב — אמה ורבע מזרחה** — מזבח הזהב שבהיכל הוזז אמה ורבע לצד מזרח, בכל הסידורים של השולחנות והמנורות. כך יש דרך בינו ובין השולחנות, כתשובת רש״י ביומא (נא:): ״שאין המזבח מכוון כנגד השולחן, אלא משוך קימעא כלפי חוץ״. כמה הוא ״קימעא״ לא נאמר, ואמה ורבע — בחירת מודל. אותו שינוי נעשה גם בבית שני.", "**המנורות — מעט צרות יותר** — המנורות שבהיכל צרות מעט מבעבר: הנרות קרובים יותר זה לזה, והגובה והצורה כמו שהיו. רוחב המנורה אינו נזכר במקורות, והוא בחירת מודל. אותו שינוי נעשה גם בבית שני."]],   // DAVID_SHITIN_305, ALTAR_EAST_305, MENOROT_305
    ["1.4.13", ["**הכנסת הארון — הכהנים יוצאים לאחוריהם** — בהדגמה ״דבקו שערים״, אחרי שארבעת הכהנים מניחים את הארון בקודש הקדשים, הם יוצאים עכשיו לאחוריהם: פניהם אל קודש הקדשים, ואחוריהם אל ההיכל, עד שהם עומדים באולם. כך כתב הרמב״ם (בית הבחירה ז, ד): ״כל שהשלים עבודה ונסתלק לו אינו יוצא ואחוריו להיכל, אלא מהלך אחורנית מעט מעט״, וכך יצא גם הכהן הגדול מקודש הקדשים ביום הכיפורים. עד עכשיו הם הסתובבו ויצאו כשפניהם אל האולם וגבם אל קודש הקדשים."]],   // EXIT_BACK_304
    ["1.4.12", ["**שיטות ומחלוקות — בקבוצות** — הרשימה ״שיטות ומחלוקות״ שבתפריט מחולקת עכשיו לחמש קבוצות, בשמות הקבוצות של רשימת המקומות: ״הר הבית והחצרות״, ״המזבח וכלי הנחושת״, ״הבית מבחוץ והיציע״, ״הבית מבפנים״ ו״בית שלמה״. כל קבוצה נפתחת בלחיצה, ובכותרתה מספר המחלוקות שבה. החיפוש שבראש התפריט פותח לבד את הקבוצה של מה שנמצא, ושם של קבוצה מוצא את כל המחלוקות שבה. גם במצגת, כל שיטה נוספת מראה את שם הקבוצה שלה.", "**האור החוזר מהקירות — בוטל** — השורה ״אור חוזר מהקירות (כבד מאוד)״ ירדה מן ההגדרות. כשסימנו אותה יחד עם ״צל רך בפינות״, כל המבט התעמעם באפור, והופיעו כתמים על הרצפה ועל הקירות. ״צל רך בפינות״ נשאר: הוא מוסיף צל עדין רק בפינות, בחיבורים ובתחתית הקירות."]],   // OPS_GROUPS_303, GI_OFF_303
    ["1.4.11", ["@גדול **שימו לב: ייתכן שהטעינה תהיה איטית מעט יותר** — מנוע הציור עודכן לגרסה חדשה, שמחשבת בטעינה את ההשתקפויות בזהב ובשיש בדיוק רב יותר. זה אמור להשתלם: התנועה בתוך המודל לא נעשתה איטית יותר, ובמחשב עם כרטיס גרפי ההבדל בטעינה אמור להיות קטן. אם אצלכם הטעינה איטית במיוחד, או שמשהו נראה אחרת — נשמח מאוד שתדווחו לנו, בכפתור ״דיווח״ שבסרגל העליון (באוצריא).", "**צל השמש — פחות עבודה למחשב** — צל השמש מצויר עכשיו מחדש רק כשמשהו בו משתנה: כשהאור או חלק מן המודל זזים, או כשמשתמשים בחתך. עד עכשיו הוא צויר מחדש בכל תמונה ותמונה, גם כשדבר לא השתנה. בזכות זה התנועה חלקה יותר, בעיקר במחשבים חלשים.", "**שתי אפשרויות חדשות לתאורה** — בהגדרות נוספו שתי שורות: ״איכות גבוהה: צל רך בפינות״ — צל עדין בפינות, בחיבורים ובתחתית הקירות; ו״אור חוזר מהקירות (כבד מאוד)״ — האור שחוזר מן הקירות ומן הזהב אל מה שסביבם. שתיהן כבויות מראש. במחשב חלש הן מאטות את התנועה, והשנייה מאוד.", "**פתיחת דלתות ההיכל — כהן שלם** — בהדגמה, כהן שלם פותח עכשיו את דלתות ההיכל: הוא עומד באולם, דוחף את שתי הדלתות פנימה, ונכנס אחריהן להיכל. עד עכשיו נראתה רק ידו על המפתח."]],
    ["1.4.10", ["**הדגמת המכונה — המצלמה עוקבת עד הסוף** — בהדגמת המכונה, כשהמכונה עוצרת לקידוש ידיים ורגליים, המצלמה מקיפה אותה עכשיו מצד מערב, יורדת אל הכהן, ואחר כך חוזרת וממשיכה לעקוב אחרי המכונה עד סוף הדרך. עד עכשיו, באותו רגע המצלמה נעצרה מעל המכונה, והמכונה המשיכה בדרכה בלי שראו אותה.", "**עדי השקר — מקבוצת ״הדגמות״** — לחיצה על ״עדי השקר — הכסא מרעיש״ בקבוצת ״הדגמות״ מביאה עכשיו את המבט אל כסא שלמה. עד עכשיו ההדגמה התחילה בלי להזיז את המבט, ולכן כשהמצלמה עמדה רחוק מן הכסא, לא ראו אותה."]],   // FOLLOW_KID_301, DEMO_FLY_301
    ["1.4.9", ["**מבט במקום — גם כלפי מטה** — בתוך מבנה מקורה, ובמצב הליכה, אפשר עכשיו להוריד את המבט כמעט עד למטה ממש. עד עכשיו, כשהמבט ירד הרבה ושחררו את העכבר, המצלמה קפצה ממקומה והמבט הסתובב; ובמצב הליכה העין החליקה לאחור ושקעה.", "**מעבר חלק אל כל מקום** — כל מעבר — בלחיצה על מקום, על מבט, או במצגת — עובר עכשיו בדרך חלקה מתחילתו ועד סופו. עד עכשיו, במעבר שעבר מעל המקום, המבט קפץ והתמונה הסתובבה בבת אחת באמצע הדרך.", "**עצירת מעבר באמצעו** — לחיצה על המודל, גלגלת העכבר, מקש או כפתור ניווט בזמן מעבר עוצרים אותו במקום שבו הוא נמצא, ומשם אפשר להסתובב ולהתקרב מיד. עד עכשיו גרירה בזמן מעבר לא נקלטה, ושארית שלה המשיכה להזיז את המבט אחרי סוף המעבר.", "**התקרבות לכלי** — כשמתקרבים מאוד לכלי — בכפתור ״+״, במקש + או בצביטה — הכלי כבר אינו נחתך.", "**מצב הליכה עולה ויורד עם הרצפה** — בהליכה העין שומרת על גובהה מעל הרצפה שתחתיה: עולה במדרגות ויורדת מהן. עד עכשיו, במעבר מן החצר אל מקום גבוה ממנה, העין נכנסה לתוך הרצפה.", "**הדגמות במצגת הרציפה** — כשמסתכלים סביב בזמן הדגמה במצגת הרציפה, ההדגמה נעצרת והמבט חופשי; כשהמצגת ממשיכה, גם ההדגמה ממשיכה מאותו רגע. עד עכשיו ההדגמה המשיכה להוביל את המבט, ואי אפשר היה להסתובב עד סופה.", "**המצפן** — לחיצה על מקום מיד אחרי לחיצה על אות במצפן כבר אינה מעקמת את המעבר.", "**צביטה במסך מגע** — צביטה בשתי אצבעות בתוך מבנה מקורה מקרבת ומרחיקה את המבט. עד עכשיו היא הרעידה אותו.", "**קבוצת ״הדגמות״** — בראש רשימת המקומות יש עכשיו קבוצה חדשה, ״הדגמות״, ובה כל ההדגמות של הבית במקום אחד.", "**כפתורי ההדגמה בצד** — הכפתורים ״השהה״ ו״עצור״, שמופיעים בזמן הדגמה, עברו לצד שמאל, מעל המצפן. עד עכשיו הם עמדו באמצע המסך והסתירו את המודל.", "**קולות בהדגמות** — בעוד הדגמות נשמעים עכשיו קולות, בעוצמה נמוכה. השהיה או עצירה של ההדגמה משתיקות אותם מיד. אפשר לכבות את כל הקולות בהגדרות, בשורה ״קולות בהדגמות״.", "**מדידה באמות** — נקודת מדידה נקבעת עכשיו רק על מה שרואים: לא על חלק שהחתך הסתיר, ולא על משהו שקרוב מדי לעין. עד עכשיו נקודה יכלה ליפול על חלק שאינו נראה, והמידה יצאה שגויה.", "**עלייה בלולים** — בהדגמה, העין עולה עכשיו בתוך הלולים עצמם, סביב העמוד, אחרי העולה. עד עכשיו העין נשארה מחוץ לתא, ורק עלתה במקום אחד.", "**הקולות בהדגמות של בית ראשון** — גלגלי המכונה והמים שבכיור, חריקת דלתות הדביר, החצוצרות והמצלתיים כשהענן ממלא את הבית, ונקישה בכל אחת משש המעלות של כסא שלמה."]],   // CAM_219, SOUNDS_300, DEMOS_GROUP_300, DPAUSE_LEFT_300, MEASURE_300, the lulim
    ["1.4.8", ["**פירוש רש״י: ״פעמים בזה פעמים בזה״** — בשיטת רבי אלעזר בן שמוע, ״על כולם היו מסדרין... ובכולן היו מדליקין״ (מנחות צט.), נוסף לכרטיס השיטה פירוש רש״י שם: ״פעמים בזה פעמים בזה״ — כלומר, לא על כולם בבת אחת. במודל הלחם והנרות מצוירים על כולם יחד, כמו שהיה.", "**סרגל במסך הבחירה** — במסך הפתיחה, שבו בוחרים בית ראשון או בית שני, יש עכשיו סרגל בתחתית. באוצריא יש בו מתג לכפתור ״פתח בתוסף בית המקדש״, שבסרגל העליון של ספרים כמו מלכים, דברי הימים ומידות: אפשר להסתיר את הכפתור ולהחזיר אותו, בלי לבטל הרשאה. מתג לכפתור שבשדה החיפוש יפעל מגרסה 0.9.99 של אוצריא. בקובץ לצפייה בלי אוצריא נמצא בסרגל הזה כפתור ״בדיקת עדכונים״ — עד עכשיו הוא היה בסוף התפריט."]],
    ["1.4.7", ["**קידוש ידיים ורגליים** — בהדגמת המכונה, בעצירה של הקידוש: הכהן מרים את רגל ימין, ומניח עליה את יד ימין, תחת הזרם שיורד מן הברז. אחר כך הוא מוריד אותה, מסתובב, ועושה כך ברגל שמאל וביד שמאל (זבחים יט, ב). בזמן הקידוש המבט של ההדגמה יורד אל הכהן, ואחר כך חוזר למקומו — עד עכשיו גוף המכונה הסתיר אותו. ועד עכשיו הכהן רק שחה מן המותניים, והניח את ידיו על רגליו."]],
    ["1.4.6", ["**קידוש ידיים ורגליים** — בהדגמת המכונה, בעצירה של הקידוש, הכהן עומד עכשיו ורגליו זקופות, שוחה מן המותניים, וידיו על רגליו (זבחים יט, ב). עד עכשיו נטה כל גופו באלכסון, כמו נופל."]],
    ["1.4.5", ["**מראה מקום** — בכרטיס ״הכבש״ נוסף מספר הפסוק: ״ולא תעלה במעלת על מזבחי״ (שמות כ, כג)."]],
    ["1.4.4", ["**המלך בלבוש מלכות** — בהדגמה ״עליית המלך לכסא״ עולה עכשיו המלך עצמו — בתכלת, בארגמן ובזהב, וכיפה לראשו — ולא צללית. בכל מעלה הוא נשען על הארי ועל הנשר המושיטים לו יד וכנף, כמתואר במדרשים. דמותו ולבושו — בחירת מודל. בתפריט: ״עליית המלך לכסא״.", "**צורת לחם הפנים** — מתג חדש בתפריט, תחת ״שיטות ומחלוקות״: ״כמין ספינה רוקדת״ (רבי יוחנן) או ״כמין תיבה פרוצה״ (רבי חנינא) — מנחות צד:. החלות שעל השולחנות משתנות לפי הבחירה.", "**נרות המנורות** — לרבי, שהנרות ממזרח למערב (ברירת המחדל) — פי כל הנרות למערב, כציור הרמב״ם בפירוש המשנה (תמיד ג, ט); ולרבי אלעזר ברבי שמעון, מצפון לדרום — הם פונים אל הנר האמצעי, ופי האמצעי למערב (מנחות צח: ורש״י).", "**ארון יהוידע** — מתג חדש בתפריט, תחת ״שיטות ומחלוקות״: שני ארונות, כמלבי״ם (ברירת המחדל), או ארון אחד, כרש״י (דברי הימים ב כד, ח). הארון האחד עומד אצל המזבח, בעזרה — כלשון מלכים (ב יב, י) ורש״י שם.", "**הכבש** — הכבש הקטן העולה לסובב יוצא מצד הכבש הגדול. מקום חדש בתפריט, ״עולים במזרח ויורדים במערב — הכבש״: חיצים מראים את דרך העולים ואת דרך היורדים (יומא ד, ה). ובכרטיס ״הכבש״ — למה שימשה הרבובה.", "**מידות המזבח** — לכל מידה קו בצבע משלו, ולצד המזבח לוחית לכל קו: 24, 22 ו־20 אמה כדברי הימים, או 28 עד 20 לרבי יוסי — לפי המתג ״מידות המזבח״. המבט מן הצד, מתוך העזרה, כדי שייראו הכניסות שבין מדרגה למדרגה. בתפריט: ״מידות המזבח — קווי האמות״.", "**בית המטבחים — ארבע שיטות** — שיטת הראבי״ה ושיטת הגר״א הוצגו עד כה, בטעות, כשיטה אחת; עכשיו כל אחת לעצמה, במתג ״בית המטבחים״.", "**המכונות** — בהדגמה ״הבא את הכיור לקידוש ידים ורגלים ולהדחת העולה״ (הכפתור שעל המכונה שבשורה הצפונית) נראים עכשיו כהן המקדש ידיו ורגליו — יד ימין על רגל ימין (זבחים יט:) — וכהן המדיח את קרבי העולה. הדמויות ומקומן — בחירת מודל.", "**צורת ההר** — הקרקע שסביב הר הבית יורדת אל נחל קדרון שבמזרח ואל העמק שבמערב. העומקים והמרחקים — בחירת מודל.", "**נוח יותר** — קולות בהדגמות (לכיבוי: בתפריט, תחת ״תצוגה״); כרטיס הסבר ארוך מציג את תחילתו ואת הפסקה ״במודל״, והכפתור ״המשך הכרטיס״ פותח את האמצע; המקש Enter מקרב אל המקום שהסמן עומד עליו, ו־Shift עם Enter מרחיק; דף ״ניווט״ נכתב מחדש בלשון פשוטה; גוון אבן עתיקה לחומות וללשכות (״תצוגה״); ו״מה חדש בגרסה זו״, בסוף התפריט, פותח שוב את הרשימה הזאת.", "**תיקונים** — ״מבט כללי״ מחזיר את מה שמקום הדליק מעצמו (העליות, משמרות השוערים), ואחרי ״עליית המלך לכסא״ הכסא חוזר לשיטה שנבחרה. תוקנו מבטים שנכנסו לתוך קיר, וכפתור שעל המודל מופיע רק במקום שהוא שייך לו. לדמויות שיער ופאות; הלויים בלבוש פשוט, ולא בבגדי כהונה."]],
    ["1.4.3", ["**הבדים עולים עם הארון** — במקום ״אבן השתייה״ הארון מורם לרגע, כדי שתיראה האבן שתחתיו. עד כה שני הבדים נשארו מונחים על הרצפה, כאילו הוצאו מן הטבעות. עכשיו הם עולים עם הארון — ״בטבעת הארן יהיו הבדים לא יסרו ממנו״ (שמות כה, טו).", "**מעבר בין מקומות** — מקום בתפריט שהדליק לעצמו תצוגה מיוחדת — כמו המגדל של מאה ועשרים אמה ב״העליות״, או השומרים ב״משמרות השוערים״ — מכבה אותה כשעוברים למקום אחר. עד כה התצוגה נשארה דולקת גם במקומות הבאים, ונראה כאילו היא חלק מן המודל. מה שהדלקתם בעצמכם — נשאר דולק.", "**כפתורים שעל המודל** — כפתור שנפל מתחת לתפריט או מתחת לכרטיס ההסבר זז עכשיו הצידה, אל המקום הפנוי, כדי שאפשר יהיה ללחוץ עליו.", "**תיקון ציטוט** — בכרטיס ״משמרות השוערים״ הובא לשון המשנה במידות (א, א) בנוסח שהגמרא מביאה בתמיד (כז.). עכשיו מובא לשון המשנה עצמה.", "**בקובץ לצפייה בלי אוצריא בלבד — עדכון בלחיצה** — כפתור ״בדיקת עדכונים״ שבסוף התפריט מוריד עכשיו את הגרסה החדשה ושומר אותה. בכרום ובאדג׳ נפתח חלון ״שמירה בשם״; בשם הקובץ מופיע מספר הגרסה, כך שהקובץ הישן אינו נדרס. הקובץ נבדק לפני השמירה, וקובץ פגום אינו נשמר."]],
    ["1.4.2", ["**הכנסת הארון — עכשיו גם במצגת** — ההדגמה ״דבקו שערים״ נכנסה למצגת המודרכת. בסדר הפסוקים היא באה לפני ״הארון אל תחת כנפי הכרובים״, ובסדר הנושאים — במקומה בתפריט. המצגת ממתינה עד שההדגמה מסתיימת.", "**השהיה במצגת** — כפתור ״השהה״ של המצגת משהה עכשיו גם הדגמה שרצה באותה שקופית, ו״המשך״ ממשיך אותה מאותו רגע. עד כה ההשהיה עצרה את ההדגמה לגמרי."]],
    ["1.4.1", ["**הדגמה חדשה: הכנסת הארון — ״דבקו שערים״** — כמסופר בגמרא (שבת ל.): כששלמה ביקש להכניס את הארון לקודש הקדשים, נדבקו השערים זה בזה ולא נפתחו, עד שהזכיר את חסדי דוד אביו. בהדגמה: ארבעה כהנים נושאים את הארון, שלמה כורע על ברכיו ומתפלל בעזרה, השערים נפתחים, הארון נכנס למקומו, והענן ממלא את הבית (מלכים א ח). מפעילים בכפתור שליד פתח קודש הקדשים, או בתפריט — בקטגוריה ״הבית מבפנים״.", "**ארון יהוידע** — הארון שהעמיד יהוידע הכהן לאיסוף הכסף לבדק הבית (מלכים ב יב, י; דברי הימים ב כד, ח). לפי המלבי״ם היו שני ארונות: אחד אצל המזבח ואחד בשער. הם מוצגים רק כשלוחצים על הכפתור שלהם — בתפריט, בקטגוריה ״הר הבית והחצרות״.", "**הגדלה בצביטה** — במחשב נייד עם משטח מגע, צביטה בשתי אצבעות עבדה הפוך. עכשיו פתיחת האצבעות מקרבת, וסגירתן מרחיקה."]],
    ["1.4.0", ["**זום אל הסמן** — גלגלת העכבר מגדילה עכשיו את המקום שהסמן עומד עליו, ולא את מרכז התמונה. הסמן נראה כזכוכית מגדלת.", "**השהיית הדגמה** — לחיצה על הדגם בזמן הדגמה (עליית המלך לכסא, העדים, העלייה בלולים) משהה אותה, ולא מפסיקה אותה. בסרגל שלמטה: ״המשך״ — מאותה השנייה; ״מההתחלה״; ״עצור״. בזמן ההשהיה אפשר להסתובב ולהתבונן."]],
    ["1.3.9", ["**המצגת — הדגמות** — שקופית שיש בה הדגמה נמשכת עד סוף ההדגמה. ״המכונה בפעולה״, שנקטעה עד כה אחרי עשר שניות, מוצגת עכשיו סיבוב שלם. אחרי כל הדגמה — שתי שניות של מנוחה לפני השקופית הבאה."]],
    ["1.3.8", ["**מהירות** — דמויות הסנהדרין מצוירות עכשיו בשלוש רמות פירוט, לפי המרחק מהן, ובלי צללים. התוסף חזר למהירותו.",
      "**המצגת — זמנים** — שבע שניות לשקופית במצב מהיר, עשר ברגיל, שתים עשרה באיטי.",
      "**המצגת — כמה דברים בשקופית אחת** — המבט עובר ביניהם באותה שקופית. הכרובים: קומתם, כנפיהם ומראם מן הצד. וכן מנורת משה ועשר המנורות, שולחן משה ועשרה השולחנות, שולחנות האולם, לשכת הגזית, שערי חצר הכהנים, הארון ובדיו ועוד.",
      "**מקומות שאוחדו** — ״עליית קודש הקדשים״ בתוך ״קודש הקדשים — הדביר״.",
      "**בר שורא** — מבט מלמעלה על הפס שלרגלי החומה.",
      "**גלילה תחת גג** — צעד גלגלת אינו מזיז יותר משתי אמות, והתנועה אינה מהירה מעשרים אמה בשנייה.",
      "**חתך שמקום פותח** — אינו נסגר כל עוד העין עומדת בחלק החתוך.",
      "**הדגמת פתיחת הדלתות** — עצירתה משתיקה מיד גם את קול הדלתות."]],
    ["1.3.7", ["**לשכת הגזית כשיטת המאירי** — חציה המזרחי קודש וחציה המערבי חול, ופס נחושת ברצפה מסמן את הגבול. הסנהדרין יושבים בחצי החול, פניהם למזרח. קריאת תפארת ישראל — בכרטיס, בקצרה.",
      "**מתג חדש: משמרות השוערים (דברי הימים א כו)** — עשרים ואחד השומרים במקומותיהם, כפירוש הרא״ש. שלושה שמקומם בבית ראשון לא נתפרש מצוירים חיוורים.",
      "**גובה קודש הקדשים — שלוש קריאות** — רש״י: עשרים (ברירת המחדל); הגמרא והתוספות: שלושים, ועשר האמות העליונות מצופות אותו זהב מפותח; רד״ק: שלושים, ועשר מהן אבן יקרה — לוחות מלוטשים, כחיפוי של קיר.",
      "**פתח הדביר** — עולה עם שיפוע הרצפה.",
      "**כסא שלמה** — בהדגמה נראה מי מושיב את המלך לפי כל מדרש: הנשרים, טווס הכסף או גלגל הכסא. החיות שבמעלה שהמלך עומד בה מרכינות ראש. נוספו אבני החן שבמעלות, שמונה דקלים וטווסי שן, ופרטי הדמויות.",
      "**מעלות השער המזרחי — שתי קריאות** — הרמב״ם: חצאי עיגולים (ברירת המחדל); הרי״ד ורבינו יהונתן: מעלות ארוכות.",
      "**שתי הסנהדראות הקטנות** — לשכות סגורות, ומתג למקומן: לרש״י אצל שער החצר החיצונה, וכפשט המשנה אצל שער הר הבית.",
      "**מתג חדש: יסוד המזבח בדרום — ומקום המזבח** — התוספות ורבינו תם.",
      "**המזבח והכבש** — צבע אבן אחד; והרובדין שבראש הכבש — שלושה חריצים של ממש באבן.",
      "**מקומות שאוחדו** — ״העמודים והעב״ בתוך ״אולם העמודים״, ו״שכבות מזבח הזהב״ בתוך ״מזבח הזהב״.",
      "**החיפוש במילות המקורות** — מוצא גם את מתגי השיטות.",
      "**הסנהדרין — דמויות** — הדיינים יושבים בגלימה שחורה ובכיפה: הזקן לבן סמוך לאמצע השורה, אפור בהמשכה ושחור־חום בקצותיה. התלמידים שלפניהם — בלי זקן. שני הסופרים עומדים, ולוח בידם. כך גם בסנהדראות הקטנות.",
      "**המצגת** — שקופית אחת לכל כפתור. מקום שמראה כמה דברים מראה את כולם בשקופית שלו. הדגמה שרצה נעצרת כשהמצגת מתחילה. סגירת כרטיס צף או קיפולו אינם עוצרים מצגת או הדגמה.",
      "@מאוחד **כפתור אחד בסרגל הספר** — ״פתח בתוסף בית המקדש״, בכל 154 הספרים; התוסף בוחר את הבית לפי הספר והמקום. ומראה מקום שנכתב בשדה החיפוש של אוצריא נפתח במודל."]],
    ["1.3.6", ["**המצגת מתחילה ממצב רגיל** — חתך, גג או קיר שנשארו פתוחים נסגרים בתחילת המצגת, וחוזרים למקומם בסופה.",
      "**מבטים מתוקנים בטבלת השיטות** — ״הפותות״: מקרוב, אל המפתח של זהב שבמנעול הדלת (רש״י), או אל הציר שבתחתיתה (תרגום ורד״ק), ולציר תווית משלו; ״הכבשים הקטנים״: מקרוב, אל המקום שבו הם מגיעים אל המזבח."]],
    ["1.3.5", ["**חיפוש בפסוקים** — שורה חדשה בסוף התפריט: כותבים מילה מפסוקי הבניין שבמלכים א ובדברי הימים ב, ורואים את הפסוק, המילה מסומנת בו, ומתחתיו המקומות שבמודל; לחיצה מעבירה אל המקום. הכפתור ״חפש באוצריא״ מחפש את אותן מילים בכל הספרייה.",
      "@מאוחד **כפתור בחיפוש של אוצריא** — כותבים מילה בשדה החיפוש של אוצריא ולוחצים על כפתור ״בית המקדש״ שבשדה: התוסף נפתח במקומות שהמילה מדברת בהם.",
      "**הכפתור ״פתח בתוסף בית ראשון״ — בעוד 75 ספרים**: מפרשי מלכים א ודברי הימים ב (רש״י, רד״ק, רלב״ג, מלבי״ם, מצודות ועוד), תרגום יונתן, מדרשים, יומא, מנחות ובבא בתרא. הכפתור פותח את המקום שהשורה שלפניכם מקושרת אליו.",
      "@מאוחד **שני בתי המקדש בתוסף אחד** — בסרגל העליון: מעבר לבית שני, וחזרה למסך הבחירה; כל בית נשאר במקום שבו עזבתם.",
      "**רצפת הבית משופעת** — גבוהה במערב בארבע אמות (רש״י מנחות צט.), והכלים, הארון והכרובים עומדים עליה; המקום ״שיפוע רצפת הבית״ מראה אותה בחתך.",
      "**האולם** — כיפה בראש פתחו; ו״תקרת האולם״ בטבלת השיטות: כיפה (רש״י יומא נב.), או בלי תקרה (תוספות רי״ד).",
      "**היציע לשיטת הרמב״ם** — אפשרות חדשה ב״צורת היציע״: רצועות של תאים ארוכים, ומחוץ להן היציעים — חמש, שש ושבע; גם בכפתור ״הסר את קירות היציע״ ובחתך היציע. ברירת המחדל — רש״י, כספר.",
      "**המזבח** — המערכה הגדולה בדרום־מזרח (רמב״ם בית הבחירה ב, ז); היסוד כבית קיבול; שלושה חריצים (רובדין) בראש הכבש; מידות המזבח מצוירות, קו ומספר לכל מידה; ספלי הניסוך ונקביהם; ו״הרווח שבין הכבש למזבח״ — שלוש שיטות בטבלה.",
      "**לשכת הגזית והסנהדראות** — הלשכה הוגדלה: הסנהדרין שורה אחת כחצי גורן, ושורות התלמידים עגולות (רש״י) או פשוטות (יד רמה); ושתי הסנהדראות הקטנות — על פתח הר הבית ועל פתח העזרה (סנהדרין יא, ב).",
      "**מקומות חדשים בתפריט** — בר שורא (פסחים פו.), פשפשי בית החליפות (זבחים נה:), הלול שאחורי בית הכפורת, טבלת השיש של עפר הסוטה, לשכות החצר החיצונה בארבע פינותיה, ושש המעלות שלפני השער המזרחי — כחצי גורן, כדברי המאירי.",
      "**הדגמות** — פתיחת דלתות ההיכל במפתח של זהב; ההליכה בלולים אל היציע (מלכים א ו, ח); והאונקליות שבבית המטבחים. כל ההדגמות לאט יותר, וכל מתג, מקום או כפתור עוצרים הדגמה שרצה.",
      "**כרטיסי ההסבר** — מחולקים לפסקאות, ושמות המפרשים והעיקר מודגשים; ובכרטיס הארון — מתגי השיטות למה שבתוכו.",
      "**ניווט ותצוגה** — חתך לפי גובה בתיבת הניווט; סיבוב חלק יותר; מקום חדש בתפריט סוגר מה שהקודם פתח; תחומי החצרות נדלקים על הרצפה; והתפריט וטבלת השיטות מסודרים כסדר הליכה, ממזרח למערב.",
      "ועוד: הפרוכת כפופה מעט בראשה (סוכה ז:); התפוח שעל המזבח — אפר שחור (דשן); ובדיווח על טעות מסמנים על איזה בית הוא."]],
    ["1.3.4", ["היציע לשיטת הרמב״ם — אפשרות חדשה בטבלת השיטות (״צורת היציע״): רצועות של תאים ארוכים, ומחוץ להן היציעים — חמש, שש ושבע. ברירת המחדל — רש״י, כספר.",
      "הסיבוב חלק יותר: המבט ״מלמעלה״ נוטה מעט, כדי שגרירה תסובב סביב הדבר ולא תסחרר; וגג אינו נסגר כשהמבט מתחתיו.",
      "חתך לפי גובה בתיבת הניווט (״גובה״), והחתך אינו נשבר עוד כשקיר נעשה שקוף.",
      "פתיחת דלתות ההיכל — יד הכהן מסובבת את המפתח: המבט מתקרב אליה, ואחר כך מתרחק לראות את שתי הדלתות נפתחות.",
      "כל ההדגמות לאט יותר, וכל מתג, מקום או כפתור עוצרים הדגמה שרצה, ואחר כך עושים את שלהם.",
      "בית המטבחים — כפתור ״האונקליות״ על המודל: המבט מתקרב, והאונקליות מסומנות בצבע צף, בשיטה שנבחרה בטבלה (מדות ג, ה).",
      "הלולים — הדגמה: מן החצר דרך הפתח שבדרום, ובחתך היציע סביב העמוד אל הקומה האמצעית ואל השלישית (מלכים א ו, ח). בעץ המקומות ובכפתור ליד הפתח.",
      "היציע לשיטת הרמב״ם — גם הכפתור ״הסר את קירות היציע״ (כותל המסבה והגג) וגם חתך היציע, עם המידות.",
      "דיווח על טעות — חובה לסמן על איזה בית הדיווח: בית ראשון, בית שני, או שני בתי המקדש.",
      "פתיחת דלתות ההיכל — הדלתות אינן נעשות שקופות, ושתיהן נראות נפתחות דרך פתח האולם."]],
    ["1.3.3", ["כרטיסי ההסבר מחולקים לפסקאות, ושמות המפרשים והעיקר מודגשים — בלי להגדיל את הכרטיס.",
      "מידות המזבח מצוירות: קו לכל מידה, ועליו מספר האמות — כבתוסף בית שני.",
      "ספלי הניסוך בקרן הדרומית־מערבית, והשיטות בנקביהם; מקום הלויים מסומן על הרצפה.",
      "פתיחת דלתות ההיכל — הדגמה: מפתח של זהב (״והפתות״ — רש״י), וקול של דלת כבדה; כפתור הדגמה על המודל.",
      "מה שבתוך הארון — מתגי השיטות בכרטיס, ובמצגת הארון נפתח לבד.",
      "התחומים של החצרות נדלקים על הרצפה ל־15 שניות."]],
    ["1.3.2", ["מזבח הנחושת זז מזרחה: גופו עשרים ושש אמה וחצי מן האולם, וכך יש מקום למכונות; מקום השחיטה והמבטים זזו איתו, והמכונות חזרו למקומן.",
      "מידות המזבח — שורה חדשה בטבלת השיטות: עשרים על עשרים (דברי הימים ב ד, א), או עשרים ושמונה, כרבי יוסי (מדות ג, א; רש״י זבחים נט:, סא:).",
      "מניין המערכות בשתי שורות: מספר המערכות לכל תנא, ויום הכיפורים — מערכה נוספת לכל שיטה.",
      "ראש המזבח — מבט ישר מלמעלה.",
      "תקרת ההיכל קמורה, ״כמו ספינה וערבה הפוכה״ (רש״י דברי הימים ב ג, ז); התקרה השטוחה הוסרה.",
      "ציטוטים מתוקנים בכרטיסי התקרות (רש״י ומצודת דוד על מלכים א ו, ט)."]],
    ["1.3.0", ["טבלת השיטות: שמות קצרים — שם בעל השיטה ועיקר דבריו, בלי סוגריים ובלי הערות (כבתוסף בית שני).",
      "מניין המערכות על המזבח — רבי יוסי שלוש, רבי יהודה שתיים, רבי מאיר ארבע, וביום הכיפורים מערכה נוספת לכל שיטה (יומא ד, ו).",
      "לחיצה על לשכות החצר החיצונה או על לשכת הגזית מראה אותן מלמעלה, והגג נפתח ל־20 שניות.",
      "המכונות זזו חמש אמות דרומה: המכונה המזרחית שבשורה הצפונית עמדה בתוך הכבשים הקטנים שבצד הכבש."]],
    ["1.2.9", ["מצב הליכה (🚶 בתיבת הניווט): העין בגובה אדם, העכבר מסובב את המבט, W S A D (או ו ד ש ג) או החצים הולכים — Esc משחרר את העכבר.",
      "חתך חי: מישור חיתוך שגוררים במחוון דרך המודל, בציר צפון–דרום או מזרח–מערב — רואים את הפנים כמו בחתך אדריכלי; המישור מתחיל במקום שאליו מביטים, ו״↺ החזר הכל״ מכבה אותו."]],
    ["1.2.8", ["האש שעל המזבח — להבות חיות (שיידר רעש, כבתוסף בית שני), ועשן המערכה עולה בעמוד ישר (יומא כא:); האש שייכת לקבוצת המזבח וזזה איתו בכל קריאה של מקומו.",
      "מזבח הזהב — שתי אמות קומתו (שמות ל, ב; עד כה אמה).",
      "הרבובה — חלון בצד המערבי של הכבש (רמב״ם ב, יד), בציון שלבית ראשון אין לה מקור מאומת.",
      "החצר החיצונה היא ״החצר החדשה״ של יהושפט: דברי הימים ב כ, ה; זבחים לב:; פסחים צב.; רמב״ם בית הבחירה ז, יז — בכרטיס, עם המקורות.",
      "סימון טקסט להעתקה — רק בתוך הכרטיס."]],
    ["1.2.7", ["בית יער הלבנון: הקירוי השני כרש״י (ז, ד) — ארבע שורות מרישים קטנים לרוחב הבית, שלושה בכל שורה זה לסוף זה, ועליהם הנסרים הדקים הבהירים לאורך הבית, ממריש למריש, שלושה בכל טור.",
      "בקריאת העליות: העלייה שמעל קודש הקדשים כולה נמוכה בעשר אמות — רצפתה על תקרת הדביר (גבים, בית דילפא ושדרות), תקרתה נמוכה, והגג מדורג (מצודת דוד ו, כ ע״פ רש״י).",
      "הליכה במקלדת: ↑↓ קדימה ואחורה, ←→ פנייה, PageUp/PageDown גובה (הכול ב״ניווט״).",
      "״פתח את העליות״ — חתך ממזרח לאורך הבית, כבספר: שתי העליות, ובין התקרות שתי אמות של בית דילפא. תקרת הגבים מזהב, הגומות עמוקות, וגם מעל קודש הקדשים.",
      "הדגמת המכונה — המצלמה אינה עומדת עוד על המזבח. קו ציר הבית — כפתור ומבט משלו; עליית קודש הקדשים — מקום חדש.",
      "מבטים מתוקנים: שערי חצר הכהנים, המעלות אל הבית, כיור משה, המנורות והשולחנות, פתח התאים, אולם העמודים."]],
    ["1.2.3", ["הליכה במקלדת: ↑↓ קדימה ואחורה, ←→ פנייה, PageUp/PageDown גובה (הכול ב״ניווט״).",
      "״פתח את העליות״ — חתך ממזרח לאורך הבית, כבספר: שתי העליות, ובין התקרות שתי אמות של בית דילפא. תקרת הגבים מזהב, הגומות עמוקות, וגם מעל קודש הקדשים.",
      "הדגמת המכונה — המצלמה אינה עומדת עוד על המזבח.",
      "קו ציר הבית — כפתור ומבט משלו; עליית קודש הקדשים — מקום חדש.",
      "מבטים מתוקנים: שערי חצר הכהנים, המעלות אל הבית, כיור משה, המנורות והשולחנות, פתח התאים."]],
    ["1.2.2", ["הליכה במקלדת: החצים ↑↓ הולכים קדימה ואחורה לכיוון המבט (כמי שמטייל בבית), ←→ פונים, PageUp/PageDown מגביהים; הכול בכפתור ״ניווט״.",
      "חתך לאורך הבית כאיור הספר: ״פתח את העליות״ ו״בית דילפא״ מסירים את הכותל הדרומי ומשאירים את התקרות — תקרת הגבים, חלל בית דילפא (חשוך) והשדרות חתוכים בקצה, ומעליהם שתי העליות הפתוחות. גם במצגת (מלכים א ו, ט–י).",
      "הדגמת המכונה: המצלמה נשארת ברצועה הפנויה שבין מעלות האולם למזבח ואינה עומדת עוד על המזבח ליד האש — בשלושת מקומות המזבח; תחנת הקידוש ליד הכבש בכולם.",
      "מקום המזבח: המבט מרחוק ממזרח עם קו ציר הבית מסומן על הרצפה (15 שניות) — ברור איזה צד.",
      "הכותרת מקרוב אינה נעלמת עוד; הענן נשאר בדביר ואינו נכנס להיכל ולא לעלייה שמעל הדביר.",
      "מקום חדש: ״עליית קודש הקדשים — מעל הדביר״ (רש״י ו, כ; דברי הימים ב ג, ט).",
      "מבטים מתוקנים: שערי חצר הכהנים (החומה אינה שקופה), המעלות אל הבית (בלי המזבח בחזית), כיור משה, מנורת משה ושולחן משה (התוויות בתוך המסגרת), פתח התאים.",
      "הנסרים הדקים שעל מרישי בית יער הלבנון חזרו (הציור בספר רק חושף את המרישים). ״מה חדש״ מראה את הגרסה הנוכחית בלבד."]],
    ["1.2.1", ["סרגל עליון חדש: מצגת, ניווט, הדפסה, דיווח ו״מה חדש״ בשורה אחת, ומספר הגרסה תמיד נראה.", "כפתור ״ניווט״ — הוראות השימוש בעכבר, במשטח מגע, במסך מגע ובמקלדת.",
      "התפריט בלי כפילויות: כל נושא במקום אחד, ההשלמות בתוך כרטיסי הנושאים, וטבלת השיטות בקבוצה נסגרת; המקורות — בכרטיסים בלבד.",
      "סיבוב חדש (360): בלי עצירות — כל מיצג מכל גובה ומכל מרחק. בתוך הבית הסיבוב סביב כלי נשאר בחדר (למנורות מאחור: להתקרב בגלגלת ולגרור); ״מעבר דרך קירות״ בלוח מרשה לצאת, והקירות נעשים שקופים.",
      "תקרת הבית כבספר: תקרת הגבים (כיור מצויר ומצופה זהב), בית דילפא ושדרות בארזים — וכך מעל כל אחת משתי העליות; כפתור ״פתח את העליות״ מראה את פנימן. כרטיס ״בית דילפא״.",
      "מקום המזבח בעזרה — שורה חדשה בטבלת השיטות: ראב״י (בדרום, ברירת המחדל), ר׳ יוסי (בצפון), ר׳ יהודה (באמצע); ומבט מפתח ההיכל אל המזבח.",
      "מה שבתוך הארון — רבי מאיר או רבי יהודה (בבא בתרא יד.): ספר התורה בארון או על הארגז בצדו, והעמודים. הבדים נמשכים גם מערבה עד הכותל (ברייתא דמלאכת המשכן).",
      "ברייתא דמלאכת המשכן (פרק ז) בכרטיסי הארון, אבן השתייה ואמה טרקסין. אבן השתייה: הארון מורם לרגע כדי להראות אותה.",
      "פתח הדביר בשתי הקריאות ממורכז, עשן הקטורת מוסר ל-15 שניות, וחמש הצלעות מוארות. הכותרת מקרוב, לשכת הגזית והדגמת המכונה — זוויות חדשות.",
      "השולחנות שבאולם תמיד מוצגים (״בלי שולחנות״ הוסר). נסרי בית יער הלבנון — שלושה בכל שורה כבספר.",
      "המצגת לפי הפסוקים — רק פסוקים שיש בהם מה להראות (46 שקופיות). בהדפסה: כותרת אחת וקישור לפתיחת התוסף באוצריא. קובץ התוסף קטן בכמחצית."]],
    ["1.0.6", ["דיווח והדפסה בסרגל העליון, ליד המצגת.", "בהדפסה: קרדיט ״תוסף בית ראשון״, ודף נוסף עם ההסבר והקישורים למקורות.", "החלון הזה מראה רק את מה שהתחדש מאז הגרסה שפתחתם."]],
    ["1.0.5", ["סיבוב מלא סביב מה שמסתכלים עליו בתוך הבית, גם מאחור ומלמעלה; הקירות והתקרות נעשים שקופים בדרך."]],
    ["1.0.4", ["שמירה כ-PDF תוקנה."]],
    ["1.0.3", ["מבט חופשי למעלה ולמטה בכל מקום, וגובה העין בחצים או ב-Shift עם הגלגלת.", "באברבנאל גם הכבש מצופה נחושת.", "תוויות הדגמת המכונה בתוך התמונה."]],
    ["1.0.2", ["כפתור ״פתח בתוסף בית ראשון״ בספרי מלכים א ודברי הימים ב.", "השיתין, ומזבח הנחושת מאבנים או מצופה נחושת (אברבנאל).", "היסוד, הסובב וחוט הסיקרא; הכבשים הקטנים — כרש״י או כתוספות.", "טשטוש חומות: גם קיר שמסתיר את המקום נעשה שקוף.", "השיטות בתוך כרטיסי ההסבר.", "המקורות שבסוגריים נפתחים באוצריא בלחיצה.", "הדפסה או שמירה כ-PDF.", "סיבוב 360 מעלות בתוך הבית ובכל מקום מקורה.", "הדגמת המכונה מקרוב.", "סרגל הכותרת קבוע, גם בזמן הטעינה.", "דיווח על טעות או תקלה מתוך התוסף."]]
//@@end UI_NEWS
//@@begin buildUI.CO
      // fallback = the 10-core.js CO values (used only if ctx.CO is missing): 1.0.1-L the Sea in the court's CORNER x 80, z -54 (Rashi) /
      // +54 (L.7), the block of bases round x 30 in the rows z 33 / 45 with Moses' laver between them at z 39 (L.77; vessels-2.md), the house wall 7 / 6 / 5 / 4 (K.2)
//@@end buildUI.CO
//@@begin applyHidden
        if (ctx.shared && ctx.shared.ulamCeiling && ctx.shared.ulamCeiling.mode === "none") for (const m of cutList(ctx.ulamCeilCut)) hide.add(m);   // 1.3.5: the ulam with no ceiling (50-heichal.js)
        if (boardsOff) for (const m of cutList(ctx.forestBoardsCut)) hide.add(m);
        // 1.2.4: with the aliyot layer on, the house's ceiling pieces over the devir and the devir's gold room go - the first aliyah stands there
        // 1.3.7 (ctx.shared.devirHeight, 50-heichal.js): in the two readings of a devir thirty high its ceiling at 20 and the room over
        // it go (ctx.devirLowCut), and under the aliyot - level there - the house's own ceiling over the devir stays
        const dvHigh = !!(ctx.shared && ctx.shared.devirHeight && ctx.shared.devirHeight.mode !== "rashi");
        if (ctx.layers && ctx.layers.aliyot && ctx.layers.aliyot.visible && !dvHigh) for (const m of cutList(ctx.aliyotHide)) hide.add(m);
        if (dvHigh) for (const m of cutList(ctx.devirLowCut)) hide.add(m);
        for (const list of [ctx.cutaway, ctx.sectionCut, ctx.yatziaCut, ctx.ulamCut, ctx.forestBoardsCut, ctx.aliyotHide, ctx.devirLowCut]) {
//@@end applyHidden
//@@begin buildUI.after-dvHigh
      if (ctx.shared && ctx.shared.ulamCeiling) ctx.shared.ulamCeiling.apply = applyHidden;   // 1.3.5
      if (ctx.shared && ctx.shared.devirHeight) ctx.shared.devirHeight.apply = applyHidden;   // 1.3.7
      // (the on-model pills read the state through get() every frame, so nothing else has to be kept in sync)
//@@end buildUI.after-dvHigh
//@@begin buildUI.spr
          const spr = mkLabel(String(l.text), l.size, l);   // 1.3.3: a label may ask for a plate (l.box)
//@@end buildUI.spr
//@@begin buildUI.after-vis-note
          // 1.3.5 (as the Second Temple plugin 1.9.1): while a live section is on, the labels on its cut side (beyond one amah from the
          // plane) are hidden with the model there
//@@end buildUI.after-vis-note
//@@begin buildUI.after-SEC
          if (vis && SEC && SEC.on) { const p = spr.position; if (SEC.axis === "x" ? p.x > SEC.v + 1 : SEC.axis === "y" ? p.y > SEC.v + 1 : p.z > SEC.v + 1) vis = false; }
//@@end buildUI.after-SEC
//@@begin buildUI.HL
          // KIDDUSH_VIEW_214: a label that a demonstration's close view hides for a moment (45-vessels.js: "השיתין" while the view is down
          // at the washing priest)
          const HL = ctx.shared.hideLabels;
          if (vis && HL && HL.size && HL.has(spr.userData.label)) vis = false;
//@@end buildUI.HL
//@@begin buildUI.fs0
        const fs0 = ctx.shared.fadeState, sOn = lsGet("tm1.fade.on"), sDist = +lsGet("tm1.fade.dist");
        if (sOn === "0" || sOn === "1") fs0.on = sOn === "1";
        fs0.hide = !!fs0.on && lsGet("tm1.fade.hide") === "1";   // 1.0.2 (D): the second mode "טשטוש: גם קיר מסתיר" (default off: the fade as before)
//@@end buildUI.fs0
//@@begin buildUI.HIDE_GROUPS
        // ===== 1.0.2 (D, the mode "טשטוש: גם קיר מסתיר", chosen from the same button): besides the court and mount walls above, a wall of a
        // building - the house, the ulam, the side chambers, the palace (the groups "heichal", "interior", "palace") - that stands between the
        // camera and the controls' target fades to UI_FADE_OPACITY while it hides it, and comes back when it no longer does. Found by rays from
        // the camera to the target (5 rays, 1.5 amot apart at the target; one under a roof) in the same pass as above (every 140 ms), each
        // stopping 2 amot short of the target (a wall the target stands at is not faded) and at the fade distance. A hit on a level face (a
        // floor, a ceiling, a roof's top) does not count; only plain meshes 4 amot high and 5 wide or more, not flat platforms (the otem, the
        // palace's terrace), not the cloud and nothing noPick (the smoke) - model choice: these are the walls. Instanced meshes (the forest
        // house's columns and beams) are left out: fading one would fade all its copies (1.0.4: but for 4 copies or fewer, below). A wall of two courses ("…-stone" / "…-cedar", the
        // ulam) fades whole. Per mesh: its material is cloned once (kept in userData.tmHideClone), the clone is faded, and the shared
        // material is put back when the wall is whole again - no material of another mesh changes; a module that swaps the material
        // meanwhile wins (the fade lets go). userData.fade is set while it is faded: 90-entry.js's ent_solids counts such a wall as a roof
        // for the 360 (the heichal stays "indoors") and lets the camera through it, as it does with a faded court wall (DEV_NOTES "סבב ה'" 10).
        // The court walls' own fade above is unchanged. No allocation per frame (the lists and vectors are kept; three.js's hit records
        // are made only in the 140 ms pass, as above). =====
        // ===== 1.0.4 (the user at the menorot: "למה אני לא יכול לראות מאחוריהם? ... אם צריך תוותר על התקרה - אני לא צריך אותה בשום מקום"): the pass. Round a thing
        // one flew to under a roof (ctx.camPass, 90-entry.js) the camera orbits through the buildings' walls and ceilings; then the same rays (in every fade mode but
        // "כבוי", and 0.3 short of the target, not 2: the wall the target stands at fades too once the camera is behind it) fade every candidate they cross, the
        // ceilings, the roofs and the upper stories' floors too (the flat meshes 5 wide or more, and the 4 high ones from 1 wide, join the list: hideFlat, hideSmall,
        // used only here; a level face counts) - except what still holds the camera (ctx.camPassHit: the floors at or under the target). Every candidate is marked
        // userData.tmPass: those are the meshes 90-entry.js lets the camera through, so a surface it passes is one this loop can fade. Back to whole as before, when
        // the camera returns. =====
        const HIDE_GROUPS = ["heichal", "interior", "palace"], HIDE_PASS_SHORT = 0.3, HIDE_INST = 4;
        // 1.0.4: a ceiling, a roof or a floor that the pass fades goes to HIDE_PASS_FLAT, not UI_FADE_OPACITY: over the heichal four of them lie one on another
        // (the roof, two courses, the gold ceiling), and at 0.35 each the menorot were all but lost (model choice; the walls keep 0.35)
//@@end buildUI.HIDE_GROUPS
//@@begin hideList.hz
              const hz = Math.max(hideSz.x, hideSz.z), flat = !!o.userData.tmFlat || hideSz.y < 0.15 * hz;   // 1.3.2: userData.tmFlat - the heichal's vault counts as a ceiling
              // 1.0.4: for the pass also what is 4 high but narrower than 5 (1 at least): the devir's door leaves, which hid Moses' menorah from the devir,
              // a cherub, the parochet
//@@end hideList.hz
//@@begin buildUI.fadeHeld
            let fadeHeld = false;   // FADE_HOLD_211: a reading that shows a wall itself (90-entry.js)
//@@end buildUI.fadeHeld
//@@begin buildUI.after-title
      title.textContent = "בית המקדש הראשון";
      const sub = document.createElement("div");
      sub.className = "s";
      sub.textContent = "מלכים א ו–ז · דברי הימים ב ג–ד · חז״ל ומפרשים";
//@@end buildUI.after-title
//@@begin opRow-note
            // CHIP_CLOSEAUTO_211 (the user, 15.11.2026: after the place "לשכת הכלים" a reading's view came out EMPTY - that place's section
            // of the house stayed, since only a place put back what the place before it had opened): a reading does the same first - the
            // roof, the section or the zone that a place or a row opened for a while goes back at once (a reading that flies nowhere
            // leaves the view as it is)
//@@end opRow-note
//@@begin opRow-2
        opsBox.appendChild(box);
        row.box = box;   // 1.3.5: kept - the rows are put in the order of one walk after the last of them (below)
//@@end opRow-2
//@@begin buildUI.UI_OPS_V
      // ===== 1.0.2 (item 4, the user: "מעולה"): the other opinions inside the card. A card whose subject has rows in "שיטות ומחלוקות" ends with
      // "שיטות:" and one small chip per reading (the style of the card's source chips), the current one marked; a chip does what the row's
      // button does - row.mark (the table in step) and row.onPick - and a row whose subject moves with the reading (row.cardFly: the Sea's
      // corner, the height of the house, the ulam, the pillars, the forest house, the ulam's tables) flies like the row. The card stays open
      // and its chips follow; a card opened from the table itself shows the new reading's explanation. Subject -> rows: UI_OPS_V by view key,
      // UI_OPS_P by place title, UI_OPS_L by a label's text or layer (model choice: the rows that the subject's own text or picture shows). =====
      const UI_OPS_V = {
        heichalFront: ["aliyot", "ulamRambam"], aliyot: ["aliyot"],
        ulamInside: ["ulamRambam", "ulamCeiling", "ulamTables"],   // 1.3.5: the ceiling (ulamTables: below, with the loaves' shape)
        yachinBoaz: ["pillarCapital"], yachinBoazFull: ["pillarCapital"], boazFar: ["pillarCapital"], yachinBoazCapital: ["pillarCapital"],
        yam: ["seaPlacement"], yamOxen: ["seaPlacement"],
        kodesh: ["kodeshLayout", "kodeshOpinion"], menorot: ["kodeshLayout", "kodeshOpinion"], shulchanot: ["kodeshLayout", "kodeshOpinion", "breadShape"],
        shulchanMoshe: ["kodeshLayout", "kodeshOpinion", "breadShape"], ulamTables: ["ulamTables", "breadShape"],   // SHOWBREAD_SHAPE_211
        devirDoor: ["devirDoor", "potot"], heichalDoor: ["potot"], cherubim: ["cherubPose"],   // 1.3.3: potot
        kodeshHakodashim: ["devirHeight"],   // 1.3.7: the devir's height
        slaughterPlace: ["slaughterLayout"], slaughterPlaceClose: ["slaughterLayout"],
        forestInside: ["forestHouse"], forestRoof: ["forestHouse"], forestAv: ["forestHouse"], forestAlam: ["forestHouse"], forestUpper: ["forestHouse"],
        throne: ["throneVersion"], throneSteps: ["throneVersion"],
        heichalSouth: ["yatziaShape"], yatziaSection: ["yatziaShape"], yatziaDoor: ["yatziaShape"],   // 1.3.4: the yatzia's readings
        arkInside: ["arkLayout"],   // 1.3.3 (the user: "על הדרך תוסיף מתגי שיטות"): what is in the ark - R. Meir / R. Yehuda
        mizbeach: ["altarPlace", "altarRTam", "altarYose", "altarKarkov", "altarLook", "altarRamps", "maarachot", "maarachotYK"], mizbeachSE: ["altarRTam", "altarPlace"], mizbeachTop: ["maarachot", "maarachotYK", "altarYose"], mizbeachMeasures: ["altarYose"], sfalim: ["sfalim"],   // 1.3.3   // 1.0.2: the small ramps (ctx.shared.altarRamps; no row, no chips); 1.2.3: the altar's place too (the user)
        altarFromDoor: ["altarPlace"], altarPlaceView: ["altarPlace"], mizbeachSW: ["altarPlace", "altarRTam", "altarRamps"], mizbeachRamps: ["altarPlace", "altarRTam", "altarRamps", "rampGap"]
      };
      const UI_OPS_P = {
        "הבית (בית ה׳)": ["aliyot"], "גג הבית ותקרותיו": ["aliyot"], "העליות (רש״י דה״י ג, ד)": ["aliyot"],
        "יכין — מבעד לפתח, לכל גובהו": ["pillarCapital"], "בועז — מבעד לפתח, לכל גובהו": ["pillarCapital"],
        "סידור הכלים — עשר המנורות ועשרה השולחנות (מנחות צח:–צט.)": ["kodeshLayout", "kodeshOpinion", "breadShape"],   // SHOWBREAD_SHAPE_211
        "בית יער הלבנון": ["forestHouse"],
        // 1.0.2 (fix): the completions whose whole subject is a row of the table
        "מקום הים (רש״י / רד״ק)": ["seaPlacement"], "בית החליפות (רש״י יומא לו.)": ["ulamRambam"],
        "ארון יהוידע אצל המזבח — לתקלין חדתין": ["yehoyadaChests"], "ארון יהוידע שבשער — לתקלין עתיקין": ["yehoyadaChests"],   // YEHOYADA_ONE_211
        "לשכת הגזית": ["sanhedrinRows"], "לשכת הגזית — מקורות מבית שני": ["sanhedrinRows"],   // 1.3.5
        "שתי הסנהדראות הקטנות": ["lesserPlace", "sanhedrinRows"],   // 1.3.7
        "עליית קודש הקדשים — מעל הדביר": ["devirHeight"], "קודש הקדשים — הדביר": ["devirHeight", "d6"], "אמה טרקסין": ["d6"],   // TRAKSIN_130_D: d6   // 1.3.7
        "שערי חצר הכהנים": ["eastSteps"],   // 1.3.7: the east gate's steps - two readings
        "בית יער הלבנון — שלוש שיטות (רש״י / מלבי״ם ורלב״ג / מצודת דוד)": ["forestHouse"],
        "הכבשים הקטנים — השלמה מן הגמרא": ["altarRamps"],   // 1.0.2 add-on
        "הכבש": ["rampGap"], "פתח האולם ודלתותיו": ["ulamCeiling"],   // 1.3.5
        "שיפוע רצפת הבית": ["d5"],   // SLOPE2_D (fix-d, 145)
        "המעלות מבית המלך אל בית ה׳": ["d4"],   // ASCENT2_D (fix-d, 142)
        "העמוד — מקום המלך": ["d1"], "העמוד — במה ועמוד במבוא": ["d1"],   // AMUD2_D (fix-d, 132)
        "מידות המזבח — קווי האמות": ["altarYose"],   // 1.3.3
        "פתיחת דלתות ההיכל — הדגמה": ["potot"],   // 1.3.3
        "ספלי הניסוך — השלמה מן המשנה": ["sfalim"],   // 1.3.3
        "מזבח הזהב": ["d2"], "מזבח הזהב — גובהו, מקומו, קרנותיו, שכבותיו ועשן הקטורת": ["d2"],   // ALTAR2_D (fix-d, 141)
        "מה שבתוך הארון": ["arkLayout"], "הארון ובדיו": ["d3", "arkLayout"], "אבן השתייה": ["d3"],   // 1.3.3: the ark's readings
        // PARALLELS_C (fix-c): the new places' rows
        "הכבשים הקטנים — תוספות": ["altarRamps"], "חלקי יהודה ובנימין — הרצועה שבדרום המזבח": ["altarRTam", "altarPlace"], "מצות ערבה — הדגמה": ["c1"],
        "שולחן החלבים — שני השולחנות שבמערב הכבש": ["altarPlace"], "שלוש המחתות — בכל יום וביום הכיפורים": ["altarPlace"], "בין האולם ולמזבח": ["altarYose"]
      };
      const UI_OPS_L = [
        [/^(?:יכין|בועז)/, ["pillarCapital"]],
        [/^(?:הים(?:\s|$)|ים של שלמה)/, ["seaPlacement"]],
        [/^מזבח הנחושת/, ["altarPlace", "altarRTam", "altarYose", "altarKarkov", "altarLook", "altarRamps", "maarachot", "maarachotYK"]],
        [/^היסוד/, ["altarRTam"]],   // 1.3.7: R. Tam's reading on the yesod's own label   // 1.2.3: the place's chips on the altar's own label too
        [/^(?:היסוד|הסובב|הכבשים הקטנים|כבש קטן|שני כבשים קטנים)/, ["altarRamps"]],
        [/^ספלי הניסוך/, ["sfalim"]],   // 1.3.3
        [/^מפתח של זהב/, ["potot"]], [/^ציר של זהב/, ["potot"]],   // 1.3.3   // 1.0.2: the labels of 40-altar.js's yesod / sovev / ramps, if it gives them
        [/^בית יער הלבנון/, ["forestHouse"]],
        [/^כסא שלמה/, ["throneVersion"]],
        [/^(?:היציע|התאים לשיטת הרמב״ם|היציעים|לולים)/, ["yatziaShape"]]   // 1.3.4
      ];
      const UI_OPS_LAYER = { thronePesukim: "throneVersion", throneTargumSheni: "throneVersion", throneEstherRabbah: "throneVersion", throneBeitHamidrash: "throneVersion",
        forestRashi: "forestHouse", forestMetzudot: "forestHouse", forestMzd: "forestHouse", aliyot: "aliyot", ulamRambam: "ulamRambam",
        altarMeasures: "altarYose", altarM_chronicles: "altarYose", altarM_yose: "altarYose", yatziaRambam: "yatziaShape", yatziaRashi: "yatziaShape" };   // 1.3.3: the numbers of the altar's frames
      // DEMO_CHIPS_T (fix-t, 23.11.2026 - the user, 01:31: "בכל הדגמה ומצגת שיש שיטות, צריך שבכרטיס יהיה מעבר ברור ומהיר בין השיטות"):
      // the rows on which a demonstration's own course depends, on its card (the button of the group "הדגמות" takes its place's or its
      // card's rows: opsOf, 70-ui.js). Already here: the throne's ascent (its view throneSteps), the willows (c1), the heichal's doors (potot)
      Object.assign(UI_OPS_P, {
        "עדי השקר — הכסא מרעיש": ["throneVersion"],   // the witnesses' scene of the midrash chosen
        "הדגמת המכונה — המסלול והמים": ["kidReading"]   // the priest at the laver sanctifies by the reading chosen (45-vessels.js, KIDDUSH_RYOSE_A2)
      });
      // CHIP_KEEPS_DEMO_T (fix-t): how a row changes while its demonstration runs (a chip on its card: 70-ui.js pickFromCard) - otherwise its onPick
      const UI_LIVE = {
        // the throne's version (60-palace.js throneVersion.set stops the scene): the same scene - the ascent or the witnesses - goes on in
        // the new version from the same second ("הפסוקים ומפרשיהם" has neither: the scene ends)
        throneVersion: (row, key) => {
          const T = ctx.shared.throne, A = T && T.ascent, W = T && T.witnesses;
          const m = A && (A.running || A.paused) ? A : W && (W.running || W.paused) ? W : null;
          const sec = m && typeof m.elapsed === "function" ? m.elapsed() : 0, wasP = !!(m && m.paused);
          row.onPick(key);
          if (m && key !== "pesukim" && typeof m.start === "function" && m.start()) {
            if (sec > 0 && typeof m.seek === "function") m.seek(sec);
            if (wasP && typeof m.pause === "function") m.pause();
          }
        }
      };
      // subj = { view?, title?, label?, layers? } -> the row ids (kept unfiltered: the rows are built after the places and the labels)
//@@end buildUI.UI_OPS_V
//@@begin pickFromCard
          try { if (typeof ctx.shared.closeAuto === "function") ctx.shared.closeAuto(); } catch (_) {}   // CHIP_CLOSEAUTO_211: a card's chip that flies, too
//@@end pickFromCard
//@@begin renderChips
        host.appendChild(document.createTextNode("שיטות: "));
//@@end renderChips
//@@begin xcardOpen
        else ui_fillRich(xBody, String(text || ""), srcLinker(refs), 1700);   // 1.0.2 (A): the brackets open their sources; 1.3.3: rich; FOLD_211
//@@end xcardOpen
//@@begin buildUI.after-a-note
      // PLACE_LEAVE_210 (the outside review, 14.11.2026: in בית ראשון, after "העליות" the tower of 120 amot stood over every later place, and
      // after "משמרות השוערים" its markers - the reader took a reading for the model's conclusion): what the place before switched on BY
      // ITSELF - its layer (it.layer), or its feature that has no timer (feature.timed === false) - goes back when another place is chosen,
      // unless that place asks for it too. What the reader switched on himself (it was on before the place) stays; the 15-second features
      // go back by autoOff.flush, as before.
//@@end buildUI.after-a-note
//@@begin placeLeave
        if (leaveFeat && !keepF) { try { if (leaveFeat.isOn()) leaveFeat.off(); if (typeof leaveFeat.leave === "function") leaveFeat.leave(); } catch (_) {} }   // THRONE_BACK_211: + the feature's own leave()
//@@end placeLeave
//@@begin buildUI.palaceBasis
      // 1.0.1 (FIXES E.2 / F.3): the basis of the palace's placement, written by 60-palace.js (ctx.shared.palaceBasis, a Hebrew string)
      // or the UI's copy; appended once to the "בית שלמה" view text and used by the "מקום בית שלמה" entry of the EXTRAS
      const palaceBasis = (ctx.shared && typeof ctx.shared.palaceBasis === "string" && ctx.shared.palaceBasis.trim()) || ui_PALACE_BASIS;
      if (ui_INFO.palace.indexOf(palaceBasis) < 0) ui_INFO.palace = ui_INFO.palace + "\n" + palaceBasis;   // 1.3.3: its own paragraph
      // 1.0.1 (FIXES D.3 / F.1): the outer court's items from 20-mount.js, ctx.shared.outerCourtItems = [{name, x, y, z}], matched by a
      // fragment of the (Hebrew) name; the FIXES D.2 positions are the fallback when the module did not register them: the court floor
      // y 3 (ctx.shared.newCourt.y), chambers 8 high inside the north low wall, the king's platform 1 high at x 106 / z 8, the chest
      // 1.2 high at x 224 / z 7
//@@end buildUI.palaceBasis
//@@begin buildUI.OCI_FB
      const OCI_FB = { lishkot: [161, ncY + 4, 0], amud: [106, ncY + 1.2, 8], aron: [224, ncY + 0.6, 7] };   // 1.3.5: the chambers stand in the four corners - the court's middle
//@@end buildUI.OCI_FB
//@@begin ociCam
      };
      // 1.3.0 (the user, on the Second Temple: "בלחיצה על כל לשכה שהיא — הצגה מלמעלה, בשביל לראות מה היא מכילה"): a chamber's place opens
      // its roof by the chamber's own pill (ctx.shared.modelButtons) for 20 seconds and looks down into it from above
      // 1.3.4: through the engine's ctx.shared.openFor (90-entry.js) - another place within the 20 s starts the count again, and the
      // roof waits while the eye is under it (the pill's under())
      // LESSER_BOTH_S1: the camera (cam) or the target of the place "שתי הסנהדראות הקטנות" - both chambers, in either reading
      const lesserBoth = (cam) => {
        const L = ctx.shared.lesserCourts || {}, a = L.azarah || [114.05, 3, -14.5];
        const b = (ctx.shared.lesserPlace && ctx.shared.lesserPlace.mode === "mount" ? L.mount : L.har) || [240.55, 0, -14.5];
        const s = Math.max(1, Math.abs(b[0] - a[0]) / 126), x = (a[0] + b[0]) / 2 - 12 * s;   // 126: the two's distance in Rashi's reading
        return cam ? [x, 3 + 191 * s, a[2] + 81 * s] : [x, 3, a[2]];
      };
      const openPill20 = (id) => {
        if (ctx.shared.openFor) { ctx.shared.openFor(id, 20000); return; }
        const b = (ctx.shared.modelButtons || []).find((x) => x && x.id === id);
        if (!b || b.get()) return;
        b.set(true);
        setTimeout(() => { try { if (b.get()) b.set(false); } catch (_) {} }, 20000);
      };
      const gazitTop = () => {
        const gz = ctx.shared.lishkatHaGazit;
        const x = gz ? (gz.x0 + gz.x1) / 2 : 62, z = gz ? (gz.z0 + gz.z1) / 2 : -67.5, y = gz ? gz.y : 13.5;
        return { tg: [x, y + 1, z], cam: [x, y + 50, z + 19] };   // GAZIT_STRAIGHT_211 (the user, 15.11.2026: "זווית מבט לשכת הגזית עקומה"): straight from the south, no turn (was x + 6)
//@@end ociCam
//@@begin fly
        // 1.3.5: the house's floor slopes up to the west (55-interior.js, ctx.shared.houseSlope) and what stands on it rose with it. A view
        // from inside the house at something low keeps its place over the floor: the eye and its target rise by the floor's rise at
        // their places (the places, the fly points and the rows give the heights of the level floor). Views from outside the house, and
        // of what is high in it (the ceilings, the upper rooms), stay. The flights back to a saved eye go by realFly and are not touched.
        try {
          const S = ctx.shared.houseSlope;
          if (S && typeof S.at === "function" && typeof S.hw === "number" && Array.isArray(pos) && Array.isArray(tgt)) {
            const inH = (p) => p[0] <= S.x0 && p[0] >= S.x1 && Math.abs(p[2]) <= S.hw;
            if (inH(pos) && inH(tgt) && tgt[1] <= S.floor + 13) {
              pos = [pos[0], pos[1] + S.at(pos[0]), pos[2]];
              tgt = [tgt[0], tgt[1] + S.at(tgt[0]), tgt[2]];
            }
          }
        } catch (_) {}
//@@end fly
//@@begin altarShift
      // NOTE 13 (F2-08): how far the altar stands from its default place now (the row "מקום המזבח בעזרה", R. Tam's four amot too)
      const altarShift = () => { try { const A = ctx.shared.altarPlace; return A && A.dz && A.current in A.dz ? A.dz[A.current] + (A.extra || 0) - A.dz.south : 0; } catch (_) { return 0; } };
      // DEMOS_GROUP_300: the First Temple's demonstrations, for the group "הדגמות" at the head of the panel (built below, before the loop of
      // the places): a place's own item, or the pill's on the model; the throne's two need a midrash's throne (in the verses' reading
      // there is no ascent and no witnesses): Targum Sheni's, as the presentation shows them
      // MENU_149_D (fix-d, the user's decision 149 ג): the demonstrations too along the route of the places - the palace, the altar's laver,
      // the cells, the house's doors, the ark into the devir (a demonstration of the City of David, when it comes, goes first)
      function ui_demosList() {
        const thr = () => { const V = ctx.shared.throneVersion; if (V && V.current === "pesukim" && typeof V.set === "function") V.set("targumSheni"); };
        return [
          // MENU_149_D: the City of David first (agent C's spring; its demonstration only with the spring, 59-parallels.js), then along the route
          ...(ctx.shared.shiloach1 ? [{ t: "ניסוך המים — מן השילוח", place: "ניסוך המים מן השילוח — הדגמה" }] : []),   // only with the spring (59-parallels.js, SPRING_C)
          { t: "עליית המלך לכסא", place: "עליית המלך לכסא" },   // DEMO_CARD_S1: as the place itself - its card (which says the button moves to Esther Rabbah's throne), its feature and its camera (until now: the pill, with Targum Sheni's throne)
          // WIT_REFS_S2 (the user's note 15, the coordinator's word): the two sources its card quotes, at the lines where their words are (checked in
          // the library: Targum Sheni 3237:17 - line 13 is the head of 1:2 -, Pnei Acherim 274:116)
          { t: "עדי השקר — הכסא מרעיש", pill: "palaceThroneWitnesses", layer: "palace", run: thr, fly: "throneSteps", refs: [["תרגום שני לאסתר א, ב", { book: 3237, index: 17 }], ["פנים אחרים נוסח ב", { book: 274, index: 116 }]] },   // DEMO_FLY_301
          // PARALLELS_C (fix-c, 59-parallels.js): the demonstrations of the Second Temple's places, in this house's building
          { t: "הליכת עולה רגל — בגובה העיניים", place: "הליכת עולה רגל — בגובה העיניים (ברטנורא)" },
          { t: "מצות ערבה — הקפת המזבח", place: "מצות ערבה — הדגמה" },
          { t: "המכונה מביאה את הכיור — לקידוש ידיים ורגליים ולהדחת העולה", pill: "mechonaDemo", card: "הדגמת המכונה — המסלול והמים" },   // DEMO_CARD_S1
          { t: "עלייה בלולים", pill: "hei-lulim-demo", card: "הליכה בלולים — הדגמה" },   // DEMO_CARD_S1
          { t: "פתיחת דלתות ההיכל", place: "פתיחת דלתות ההיכל — הדגמה" },
          { t: "״דבקו שערים״ — הכנסת הארון", pill: "arkGatesDemo", card: "הכנסת הארון — ״דבקו שערים״ (הדגמה)" }   // DEMO_CARD_S1
//@@end altarShift
//@@begin buildUI.after-PLACES
        ["הר הבית והחצרות", [
          { t: "הר הבית והחצר הגדולה", view: "harHabayit",
            // 1.3.3: the great court lit on the floor for 15 s (30-courts.js, ctx.shared.zones)
            feature: { key: "zoneGreat", isOn: () => !!(ctx.shared.zones && ctx.shared.zones.zoneGreat && ctx.shared.zones.zoneGreat.get()),
              on: () => { const z = ctx.shared.zones && ctx.shared.zones.zoneGreat; if (z) z.set(true); }, off: () => { const z = ctx.shared.zones && ctx.shared.zones.zoneGreat; if (z) z.set(false); } },
            info: "הפסוק: 'וחצר הגדולה סביב' (מלכים א ז, יב) — החצר הגדולה מקיפה את הבית ואת חצר הכהנים. ('העזרה הגדולה' שבדברי הימים ב ד, ט, שדלתותיה מצופות נחושת — לרש״י, לרלב״ג, למצודת דוד ולרד״ק היא עזרת ישראל, שבחצר הפנימית; ראו 'החצר הפנימית'.)\nבמודל: חומתה בנויה אבני גזית. ״שלשה טורים גזית וטור כרתת ארזים״ נאמר על חצר בית המלך (מלכים א ז, יב; מצודת דוד: ״אשר היה מסבב כל בתי המלך״; רלב״ג: ״שהחצר הגדולה אשר בה בית המלך״) ועל החצר הפנימית (שם ו, לו: ״ויבן את־החצר הפנימית שלשה טורי גזית וטור כרתת ארזים״), ולא על חומת החצר הגדולה של בית ה׳. **הגודל, חמש מאות אמה, על פי מדות ב, א**; גובה החומה, עשרים אמה — בחירת מודל.",
            refs: [["מלכים א ז, יב", V(10, 7, 12)], ["מצודת דוד מלכים א ז, יב", { book: 3345, index: 562 }], ["רלב״ג מלכים א ז, יב", { book: 3645, index: 236 }], ["מלכים א ו, לו", V(10, 6, 36)], ["דברי הימים ב ד, ט", V(39, 4, 9)], ["רש״י דברי הימים ב ד, ט", { book: 3662, index: 141 }], ["רלב״ג שם", { book: 3639, index: 78 }], ["מצודת דוד שם", { book: 3318, index: 183 }], ["רד״ק שם", { book: 3522, index: 96 }], ["מדות ב, א", MI(2, 1)]] },   // DOORS_WOOD_D (fix-d, 140)
          { t: "השער המזרחי", view: "eastGate",
            info: "השער המזרחי של החצר הגדולה, מול פתח הבית.\nבמודל: בפסוקים אין מספר לשערי החצר הגדולה ואין שמות — שער אחד בכל צד (בצפון ובדרום באמצע הצלע, במזרח ובמערב על ציר הבית) ו־56 מעלות אליו מן הקרקע הם בחירת מודל. דלתותיו — עץ, בחירת מודל: דלתות הנחושת — 'ודלתות לעזרה ודלתותיהם צפה נחשת' (דברי הימים ב ד, ט) — הן של החצר הפנימית, כרש״י שם: 'והעזרה הגדולה. זו עזרת ישראל'.",
            refs: [["דברי הימים ב ד, ט", V(39, 4, 9)], ["רש״י דברי הימים ב ד, ט", { book: 3662, index: 141 }], ["מלכים א ז, יב", V(10, 7, 12)]] },   // DOORS_WOOD_D
          // 1.3.3 (the list: "תחומים שנדלקים על הרצפה"): the inner court, its zone lit for 15 s
          { t: "החצר הפנימית — חצר הכהנים", view: "azarah",
            feature: { key: "zoneInner", isOn: () => !!(ctx.shared.zones && ctx.shared.zones.zoneInner && ctx.shared.zones.zoneInner.get()),
              on: () => { const z = ctx.shared.zones && ctx.shared.zones.zoneInner; if (z) z.set(true); }, off: () => { const z = ctx.shared.zones && ctx.shared.zones.zoneInner; if (z) z.set(false); } },
            info: "הפסוק: ״ויבן את החצר הפנימית שלשה טורי גזית וטור כרתת ארזים״ (מלכים א ו, לו).\nרש״י: ״החצר הפנימית. היא עזרת הכהנים ועזרת ישראל, והיא היתה לפני האולם, וקורא אותה פנימית, לפי שהיתה לפנים מעזרת נשים״.\nובדברי הימים: ״ויעש חצר הכהנים והעזרה הגדולה ודלתות לעזרה ודלתותיהם צפה נחשת״ (דברי הימים ב ד, ט) — רש״י (דברי הימים ב ד, ט): 'והעזרה הגדולה. זו עזרת ישראל'; רלב״ג: 'הנה חצר הכהנים היא אשר היה בתוכו מזבח הנחושת... והעזרה הגדולה היא עזרת ישראל'; מצודת דוד: 'והעזרה הגדולה. היא עזרת ישראל וקרויה עזרה על כי נעזרים מה׳ כאשר יתפללו בה'; רד״ק: 'היא החצר הגדולה שהיו עומדים בה ישראל'. לכן דלתות הנחושת — בשערי החצר הפנימית.\nבמודל: דלתות שעריה מצופות נחושת. החצר הפנימית סביב הבית, ומידותיה — **מאה שמונים ושבע על מאה שלושים וחמש** — כמשנה (מדות ה, א), בחירת מודל. תחום החצר נצבע על הרצפה לחמש עשרה שניות.",
            refs: [["מלכים א ו, לו", V(10, 6, 36)], ["רש״י ו, לו", { book: 3673, index: 307 }], ["דברי הימים ב ד, ט", V(39, 4, 9)], ["רש״י דברי הימים ב ד, ט", { book: 3662, index: 141 }], ["רלב״ג שם", { book: 3639, index: 78 }], ["מצודת דוד שם", { book: 3318, index: 183 }], ["רד״ק שם", { book: 3522, index: 96 }], ["מדות ה, א", MI(5, 1)]] },   // DOORS_WOOD_D (fix-d, 140)
          { t: "החצר החיצונה (החצר החדשה)", view: "newCourt", // 1.0.1: was "עזרת נשים (החצר החדשה)" (the user); the key newCourt stays; 1.2.8: the merge of the other chat's edits
            // 1.3.3: its zone lit for 15 s
            feature: { key: "zoneOuter", isOn: () => !!(ctx.shared.zones && ctx.shared.zones.zoneOuter && ctx.shared.zones.zoneOuter.get()),
              on: () => { const z = ctx.shared.zones && ctx.shared.zones.zoneOuter; if (z) z.set(true); }, off: () => { const z = ctx.shared.zones && ctx.shared.zones.zoneOuter; if (z) z.set(false); } },
            info: "החצר החיצונה — החצר שלפני חצר הכהנים: רש״י (מלכים א ו, לו) קורא לחצר הכהנים 'הפנימית' לפי שהייתה לפנים מעזרת נשים, כלומר חצר חיצונה לעם לפניה.\nהחצר החדשה: שלפניה עמד יהושפט בתפילתו — 'ויעמד יהושפט בקהל יהודה וירושלם בבית ה׳ לפני החצר החדשה' (דברי הימים ב כ, ה). בגמרא: 'מאי חצר החדשה? אמר רבי יוחנן: שחידשו בה דברים, ואמרו: טבול יום אל יכנס למחנה לויה' (זבחים לב:; פסחים צב.), כלומר בימי יהושפט גזרו שטבול יום לא ייכנס לעזרת נשים, שהיא מחנה לויה.\nהרמב״ם: 'עזרת הנשים מקודשת מן החיל, שאין טבול יום נכנס לשם, ואיסור זה מדבריהם' (בית הבחירה ז, יז). התוספות (פסחים צב. ד״ה טבול יום) והמאירי (יבמות ז:) מזהים את החצר החדשה עם עזרת נשים, ורש״י (פסחים צב.) מפרש 'שחידשו' — שגזרו בה גזרה חדשה.\nבה לשכות (ירמיהו לה, ד; לו, י), 'העמוד' שעליו עמד המלך (מלכים ב יא, יד; כג, ג) וארון יהוידע שבשער (דברי הימים ב כד, ח) — מימי יואש, ומוצג רק בכפתור שלו. שערה — 'השער המזרחי של החצר החיצונה'; המסורת קוראת לשער העליון שבנה יותם 'שער בית ה׳ העליון' (מלכים ב טו, לה) — לא נבנה בנפרד.\nבמודל: מידותיה, מפלסה וחומתה הנמוכה — בחירת מודל.",
            refs: [["רש״י מלכים א ו, לו", V(10, 6, 36)], ["דברי הימים ב כ, ה", V(39, 20, 5)], ["זבחים לב:", P(130, "לב:")], ["פסחים צב.", P(106, "צב.")], ["רמב״ם בית הבחירה ז, יז", RB(7, 17)], ["ירמיהו לה, ד", V(13, 35, 4)], ["מלכים ב יא, יד", V(11, 11, 14)], ["דברי הימים ב כד, ח", V(39, 24, 8)], ["מלכים ב טו, לה", V(11, 15, 35)]] },
          // 1.0.1 (FIXES D.2 / F.1): the outer court's uses; positions (and, since 1.0.1-K, the cameras) from ctx.shared.outerCourtItems (20-mount.js)
          // 1.3.5 (the user: "תעביר את הלשכות בבית ראשון ל4 הפינות במקום באמצע"): the four chambers stand in the court's corners - the view
          // is from above over the whole court, the four roofs open (1.3.0: from above, the roofs open)
          { t: "לשכות החצר החיצונה", action: () => openPill20("mnt-lishka-roofs-nw"),
            // TOUR_FIX_137: the four chambers are small at the court's corners - the slide goes on to each
            tourThen: [{ cam: [118, 20, -38], tg: [104.5, 5.5, -61.5] }, { cam: [208, 20, -38], tg: [221.5, 5.5, -61.5] }, { cam: [208, 20, 38], tg: [221.5, 5.5, 61.5] }, { cam: [118, 20, 38], tg: [104.5, 5.5, 61.5] }],
            // SCAN2_FIX (scan 2, item 5): higher and farther - the four chambers between the card and the panel (were in the screen's corners)
            tg: () => [OCI_FB.lishkot[0] - 15.4, ncY + 1, 2.1],
            cam: () => [OCI_FB.lishkot[0] + 2, ncY + 236, 70],
            info: "לשכות בחצר בית ה׳: 'לשכת בני חנן בן יגדליהו איש האלהים אשר אצל לשכת השרים אשר ממעל ללשכת מעשיהו בן שלם שמר הסף' (ירמיהו לה, ד), 'בלשכת גמריהו בן שפן הספר בחצר העליון פתח שער בית ה׳ החדש' (ירמיהו לו, י), ו'לשכת נתן מלך הסריס' (מלכים ב כג, יא).\nהפסוקים מעידים על לשכות בחצר, ולא על מקומן ומידותיהן.\nבמודל: ארבע לשכות, אחת בכל פינה של החצר החיצונה — שתיים אצל החומה הנמוכה שבצפון ושתיים אצל זו שבדרום; שתים עשרה על עשר ושמונה גובה, אבן ותקרת ארז, ופתחן אל החצר — בחירת מודל. בלחיצה כאן — מבט מלמעלה על החצר כולה, וגגות הלשכות נפתחים.",
            refs: [["ירמיהו לה, ד", V(13, 35, 4)], ["ירמיהו לו, י", V(13, 36, 10)], ["מלכים ב כג, יא", V(11, 23, 11)]] },
          // 1.0.1-K (K.9b item 2, the addendum C): "העמוד" - the king's standing place, the full explanation (it is also the label's card)
          { t: "העמוד — מקום המלך", tg: () => oci("עמוד", OCI_FB.amud), cam: () => ociCam("עמוד", OCI_FB.amud, 24),
            info: "הפסוקים: 'ותרא והנה המלך עמד על העמוד כמשפט' (מלכים ב יא, יד) — ביום המלכת יואש; וכן יאשיהו: 'ויעמד המלך על העמוד ויכרת את הברית לפני ה׳' (מלכים ב כג, ג); ובדברי הימים: 'והנה המלך עומד על עמודו במבוא' (דברי הימים ב כג, יג).\nרש״י: 'העמוד — הוא מעמד המלך בבית ה׳' (מלכים ב יא, יד), 'מקום מעמד המלך בבית המקדש' (כג, ג). ובדברי הימים (כג, יג) הוא מביא את בימת הנחושת של שלמה — 'כי עשה שלמה כיור נחשת... ויעמד עליו ויברך על ברכיו' (דברי הימים ב ו, יג: חמש אמות ארכו וחמש רחבו ושלוש קומתו) — ומוסיף: 'ועד היום מנהג כשמועדים יחד, עומד המלך או הדוכוס במקום גבוה כדי שיוכלו לראותו, לשמע את דברו'.\nמצודת דוד: 'על מקום מיוחד למלך לעמוד שם, וזהו כמשפט, רצה לומר: כמנהג המלך', ו'במבוא — במקום שבאים בה לעזרה' (דברי הימים ב כג, יג). התרגום: 'על אסטונא'.\nרלב״ג (מלכים ב כג, ג): 'ידמה שבנו שם עמוד והיה בו המלך בעת קראו את התורה כמו שנזכר בפרשת הקהל'.\nולעומתם — רד״ק (מלכים ב יא, יד): 'עומד על העמוד. פי׳ סמוך לעמוד וכן וזבחת עליו סמוך לו'; ובדברי הימים (ב לד, לא): 'רוצ׳ לומ׳ שעמד על רגליו סמוך לעמוד'. רלב״ג (מלכים ב יא, יד): 'עומד על העמוד. ר״ל אצל העמוד'.\nבמודל — שתי שיטות (בתפריט, תחת ״שיטות ומחלוקות״: ״העמוד — מקום המלך״). **ברירת המחדל — במה**, כרש״י, מצודת דוד והתרגום: במה עגולה של אבן, ארבע אמות רוחבה ואמה גובהה, ועליה עמוד קצר. **עמוד שהמלך עומד לידו**, כרד״ק ורלב״ג: עמוד אבן לבדו על רצפת החצר, שש אמות גובהו. שניהם בחצר החיצונה, סמוך למעלות שער חצר הכהנים ממזרח — 'במבוא'. צורת הבמה והעמוד, גובהם ומקומם המדויק — בחירת מודל.",
            refs: [["מלכים ב יא, יד", V(11, 11, 14)], ["מלכים ב כג, ג", V(11, 23, 3)], ["דברי הימים ב כג, יג", V(39, 23, 13)], ["דברי הימים ב ו, יג", V(39, 6, 13)], ["רש״י דברי הימים ב כג, יג", { book: 3662, index: 709 }], ["רש״י מלכים ב יא, יד", { book: 3680, index: 418 }], ["מצודת דוד מלכים ב יא, יד", { book: 3335, index: 722 }], ["רד״ק מלכים ב יא, יד", { book: 3542, index: 573 }], ["רלב״ג מלכים ב יא, יד", { book: 3644, index: 366 }], ["רד״ק דברי הימים ב לד, לא", { book: 3522, index: 541 }]] },   // AMUD2_D (fix-d, 132)
          // YEHOYADA_208 (the user, 12.11.2026: "כמלבים"; the inner one "בעזרת ישראל"): the two chests, one switch, off by default (20-mount.js)
          { t: "ארון יהוידע אצל המזבח — לתקלין חדתין", tg: [70, 6.7, -8], cam: [80.5, 12.5, 1.5],
            feature: { key: "yehoyada", timed: false, isOn: () => !!(ctx.shared.yehoyada && ctx.shared.yehoyada.on), on: () => { if (ctx.shared.yehoyada) ctx.shared.yehoyada.set(true); }, off: () => { if (ctx.shared.yehoyada) ctx.shared.yehoyada.set(false); } },
            info: "שני ארונות, כמלבי״ם (מלכים ב יב, י): ״ופה נזכר הארון של תקלין חדתין, וזה ניתן בפנים״; והארון שבדברי הימים — ״שנעשה לתקלין עתיקין... וזה נתנו בחוץ״. ובדברי הימים ב (כד, ח): הפנימי ״לשם נדרים ונדבות החדשים״, והחיצון ״מתקלין עתיקין... שזה הולך כולו לבדק הבית״.\n**הפנימי:** ״ויקח יהוידע הכהן ארון אחד ויקב חר בדלתו ויתן אתו אצל המזבח מימין בבוא איש בית ה׳״ (מלכים ב יב, י). רש״י: ״אצל המזבח — בעזרה״; ״מימין ביאת האנשים״. מצודת דוד: ״בימין הבא אל הבית, לא בימין היוצא״. הרלב״ג: ״הנה דרך החור היו משליכין שם הכסף והיה בדלת שהיא מכסה הארון כדי שלא יוכל אחד לקחת ממנו בזולת פתיחת הארון״. אברבנאל (מלכים ב יב, י): ״לקח הכהן הגדול ארון אחד ונתנו במבוא הבית מצד הימין ויקב חור בדלתו״.\n**החיצון:** ״ויאמר המלך ויעשו ארון אחד ויתנהו בשער בית ה׳ חוצה״ (דברי הימים ב כד, ח). רש״י שם: ״ויתנהו בשער בית ה׳ חוצה. כדי שיוכלו לבא אליו כל נדיב לב״; ובפסוק יא: ״מביאין אותו לפקיד המלך בתוך העזרה, מערין אותו ונושאין אותו ומחזירין אל מקומו בשער ה׳ חוצה״.\n**בקצרה —** לרש״י (דברי הימים ב כד, ח) זה ארון אחד: ״ויעשו ארון אחד. ובמלכים כתיב ויקב חור בדלתו״ — ובמלכים הוא אצל המזבח, ובדברי הימים בשער מבחוץ; המלבי״ם מיישב שהיו שניים, וכך ברירת המחדל. במתג ״ארון יהוידע — שניים או אחד״ אפשר לבחור בארון אחד, כרש״י — ובמודל הוא עומד אצל המזבח, כלשון מלכים.\nבימי שלמה עוד לא היו — יהוידע היה בימי יואש. לכן **אינם מוצגים כברירת מחדל**; הכפתור כאן מציג אותם, והכפתור שעל המודל מסתיר.\n**במודל:** ארון ארז, שתי אמות על אמה וחומש, וחור במכסהו. הפנימי — בחצר הפנימית (חצר הכהנים ועזרת ישראל, כאן חצר אחת), חמש אמות ממזרח למזבח ושמונה אמות מצפון לקו האמצע, מימין לנכנס מן השער המזרחי. מידותיהם ומקומם המדויק — בחירת מודל.",
            refs: [["מלכים ב יב, י", V(11, 12, 10)], ["דברי הימים ב כד, ח", V(39, 24, 8)], ["מלבי״ם מלכים ב יב, י", { book: 3379, index: 449 }], ["מלבי״ם דברי הימים ב כד, ח", { book: 3364, index: 652 }], ["רש״י מלכים ב יב, י", { book: 3680, index: 446 }], ["מצודת דוד מלכים ב יב, י", { book: 3335, index: 756 }], ["רלב״ג מלכים ב יב, י", { book: 3644, index: 391 }], ["אברבנאל מלכים ב יב, י", { book: 3568, index: 294 }], ["רש״י דברי הימים ב כד, ח", { book: 3662, index: 740 }], ["רש״י דברי הימים ב כד, יא", { book: 3662, index: 745 }]] },   // fix-d: the Abarbanel and Rashi on Chronicles
          { t: "ארון יהוידע שבשער — לתקלין עתיקין", tg: () => oci("ארון", OCI_FB.aron), cam: () => ociCam("ארון", OCI_FB.aron, 14), noFade: true,   // NOFADE2_211 (the full scan: the gate's walls behind the chest stood as ghosts)
           
            feature: { key: "yehoyada", timed: false, isOn: () => !!(ctx.shared.yehoyada && ctx.shared.yehoyada.on), on: () => { if (ctx.shared.yehoyada) ctx.shared.yehoyada.set(true); }, off: () => { if (ctx.shared.yehoyada) ctx.shared.yehoyada.set(false); } },
            info: "שני ארונות, כמלבי״ם (מלכים ב יב, י): ״ופה נזכר הארון של תקלין חדתין, וזה ניתן בפנים״; והארון שבדברי הימים — ״שנעשה לתקלין עתיקין... וזה נתנו בחוץ״. ובדברי הימים ב (כד, ח): הפנימי ״לשם נדרים ונדבות החדשים״, והחיצון ״מתקלין עתיקין... שזה הולך כולו לבדק הבית״.\n**הפנימי:** ״ויקח יהוידע הכהן ארון אחד ויקב חר בדלתו ויתן אתו אצל המזבח מימין בבוא איש בית ה׳״ (מלכים ב יב, י). רש״י: ״אצל המזבח — בעזרה״; ״מימין ביאת האנשים״. מצודת דוד: ״בימין הבא אל הבית, לא בימין היוצא״. הרלב״ג: ״הנה דרך החור היו משליכין שם הכסף והיה בדלת שהיא מכסה הארון כדי שלא יוכל אחד לקחת ממנו בזולת פתיחת הארון״. אברבנאל (מלכים ב יב, י): ״לקח הכהן הגדול ארון אחד ונתנו במבוא הבית מצד הימין ויקב חור בדלתו״.\n**החיצון:** ״ויאמר המלך ויעשו ארון אחד ויתנהו בשער בית ה׳ חוצה״ (דברי הימים ב כד, ח). רש״י שם: ״ויתנהו בשער בית ה׳ חוצה. כדי שיוכלו לבא אליו כל נדיב לב״; ובפסוק יא: ״מביאין אותו לפקיד המלך בתוך העזרה, מערין אותו ונושאין אותו ומחזירין אל מקומו בשער ה׳ חוצה״.\n**בקצרה —** לרש״י (דברי הימים ב כד, ח) זה ארון אחד: ״ויעשו ארון אחד. ובמלכים כתיב ויקב חור בדלתו״ — ובמלכים הוא אצל המזבח, ובדברי הימים בשער מבחוץ; המלבי״ם מיישב שהיו שניים, וכך ברירת המחדל. במתג ״ארון יהוידע — שניים או אחד״ אפשר לבחור בארון אחד, כרש״י — ובמודל הוא עומד אצל המזבח, כלשון מלכים.\nבימי שלמה עוד לא היו — יהוידע היה בימי יואש. לכן **אינם מוצגים כברירת מחדל**; הכפתור כאן מציג אותם, והכפתור שעל המודל מסתיר.\n**במודל:** ארון ארז, שתי אמות על אמה וחומש, וחור במכסהו. הפנימי — בחצר הפנימית (חצר הכהנים ועזרת ישראל, כאן חצר אחת), חמש אמות ממזרח למזבח ושמונה אמות מצפון לקו האמצע, מימין לנכנס מן השער המזרחי. מידותיהם ומקומם המדויק — בחירת מודל.",
            refs: [["מלכים ב יב, י", V(11, 12, 10)], ["דברי הימים ב כד, ח", V(39, 24, 8)], ["מלבי״ם מלכים ב יב, י", { book: 3379, index: 449 }], ["מלבי״ם דברי הימים ב כד, ח", { book: 3364, index: 652 }], ["רש״י מלכים ב יב, י", { book: 3680, index: 446 }], ["מצודת דוד מלכים ב יב, י", { book: 3335, index: 756 }], ["רלב״ג מלכים ב יב, י", { book: 3644, index: 391 }], ["אברבנאל מלכים ב יב, י", { book: 3568, index: 294 }], ["רש״י דברי הימים ב כד, ח", { book: 3662, index: 740 }], ["רש״י דברי הימים ב כד, יא", { book: 3662, index: 745 }]] },   // fix-d: the Abarbanel and Rashi on Chronicles
          // 1.3.5 (the user, 22:12: "בר שורא חובה"): bar shura (30-courts.js)
          // BARSHURA_VIEW_211 (the user, 15.11.2026, with a picture of the floor and the label alone: "לא מציג כלום"): from inside the court,
          // some 25 amot off, on the eastern wall and the band at its foot - and the wall is not made see-through while the place shows
          // (noFade: PLACE_NOFADE_211). Until 1.4.3 from right above the band (VIEWFIX_138), the wall a ghost.
          { t: "בר שורא — חומה קטנה לפנים מן החומה", tg: [90.5, 6.6, 41], cam: [69, 12.5, 25], noFade: true,
            feature: { key: "barShura", isOn: () => !!(ctx.shared.barShura && ctx.shared.barShura.on), on: () => { if (ctx.shared.barShura) ctx.shared.barShura.set(true); }, off: () => { if (ctx.shared.barShura) ctx.shared.barShura.set(false); } },
            info: "בגמרא (פסחים פו.), על 'עובי החומה' שהוא כלפנים: 'משכחת לה בבר שורא, דכתיב: ויאבל חל וחומה, ואמר רבי אחא ואיתימא רבי חנינא: שורא ובר שורא'.\nרש״י: 'בר שורא — חומה קטנה לפנים מן החומה גדולה, והיא נמוכה ושוה לקרקע גובה העזרה, שקרקע העזרה הולך וגבוה ועולה במעלות'.\nתוספות יום טוב (מדות ב, ג): 'כלומר שראשה תהא שוה לקרקע העזרה ותהא מוקדשת כמוה'; 'והיה זה לדעתי לחזוק הקרקע שלא יפול העפר ממנה'.\nבמודל: חומה קטנה צמודה לחומת החצר הפנימית מבפנים, סביב, וראשה בגובה רצפת החצר. כאן רצפת החצר במפלס אחד, ולכן **ראשה שווה לרצפה**, והיא נראית כפס אבן כהה, ברוחב אמה, לרגלי החומה — חוץ מן השערים ומלשכת הגזית. כשבוחרים במקום הזה הפס מואר לחמש עשרה שניות, כדי שהעין תמצא אותו. (במודל בית שני, שבו עזרת ישראל נמוכה מעזרת הכהנים, היא בולטת שם שתי אמות וחצי.) עוביה אמה — בחירת מודל.",
            refs: [["פסחים פו.", { book: 106, index: 2736 }], ["רש״י פסחים פו.", { book: 2162, index: 4148 }], ["תוספות יום טוב מדות ב, ג", { book: 948, index: 69 }]] },
          // 1.3.5 (the user, 22:12: "תוסיף סנהדראות"): the two lesser courts (30-courts.js, ctx.shared.lesserCourts)
          // LESSER_BOTH_S1 (scan 1, finding 15; as the Second Temple's LESSER_BOTH_300 in 2.0.10): BOTH courts in one view, from above, by the
          // reading of their place (the row "מקום הסנהדראות הקטנות": the one "על פתח הר הבית" by the outer court's gate, or by the Mount's) -
          // the pair's middle a little left of the screen's, so that the open card at the left hides neither; far enough that the roofs' pill
          // ("החזר את הגג", maxDist 150) no longer covers the first one's label. Until now: the court before the inner court's gate alone, and
          // the presentation's second camera (tourThen) went to the outer court's gate in both readings.
          { t: "שתי הסנהדראות הקטנות", action: () => openPill20("crt-lesser-roofs"),
            tg: () => lesserBoth(false),
            cam: () => lesserBoth(true),
            info: "לשון המשנה (סנהדרין יא, ב): 'שלשה בתי דינין היו שם, אחד יושב על פתח הר הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית'.\nבקצרה — מקום בית הדין שעל פתח הר הבית: לרש״י — אצל השער המזרחי שלפני עזרת נשים (**ברירת המחדל**); וכפשט המשנה — אצל שער הר הבית עצמו (בתפריט, תחת ״שיטות ומחלוקות״, במתג 'מקום שתי הסנהדראות הקטנות'). ושורות התלמידים: לרש״י כעגולה, וליד רמה פשוטות (שם, במתג 'שורות התלמידים שלפני הסנהדרין').\nרש״י (פו:): 'אחד יושב על פתח הר הבית — הוא שער המזרחי שלפנים מן החיל לפני עזרת נשים'; 'ואחד יושב למעלה הימנו — כשעברו עזרת נשים ובאין לפני עזרת ישראל'.\nועל ישיבתם (סנהדרין ד, ג–ד): 'סנהדרין היתה כחצי גרן עגלה, כדי שיהו רואין זה את זה. ושני סופרי הדינין עומדין לפניהם, אחד מימין ואחד משמאל'; 'ושלש שורות של תלמידי חכמים יושבין לפניהם, כל אחד ואחד מכיר את מקומו'.\nבמודל: כל בית דין יושב **בלשכה סגורה** — עשרים ושלושה כחצי גורן, חמש עשרה אמה קוטרו; לפניהם שני סופרי הדיינים ושלוש שורות התלמידים. המשנה ורש״י מדברים בלשון בית שני; העתקת הדבר לחצרות בית ראשון, הלשכה, מידותיה, פתחה ומקומה המדויק — בחירת מודל. הדמויות — כבלשכת הגזית: הדיינים בגלימה שחורה ובכיפה, הזקן לבן סמוך לאמצע השורה וכהה בקצותיה; התלמידים בלי זקן; הסופרים עומדים — בחירת מודל. המבט כאן: אל בית הדין שלפני שער חצר הכהנים; גג הלשכה מוסר לשעה.",
            refs: [["משנה סנהדרין יא, ב", { book: 73, index: 78 }], ["רש״י סנהדרין פו:", { book: 2180, index: 4632 }], ["רמב״ם סנהדרין א, ג", { book: 375, index: 5 }], ["משנה סנהדרין ד, ג", MN(73, 4, 3)], ["משנה סנהדרין ד, ד", MN(73, 4, 4)], ["משנה סנהדרין א, ו", MN(73, 1, 6)]] },
          { t: "חצר הכהנים", view: "azarah", key: "azarah" },
          // 1.0.1-K (integration; the user: "אכן רצפת העזרה היתה משיש, אייר זאת כך"): the court floor in marble (30-courts.js, M.marblePave)
          // 1.0.1-L (vessels.json): the Sea now stands in the north-east corner (x 80, z -54) - the K camera [88, 14, -55] was 2.9 from it; this
          // one looks from the east wall's side across the floor toward the slaughter place, the ray clear (nearest surface 5)
          { t: "רצפת חצר הכהנים — שיש", tg: [64, 6.1, -42], cam: [86, 14, -30],
            info: "הפסוק: 'ואבני שיש לרב' (דברי הימים א כט, ב). רש״י: 'ואבני שיש — לעמודים ושלחנות ולרצפה'; התרגום: 'ואבני מרמוריא'.\nבמודל: **כל רצפת חצר הכהנים, בין כתליה, לוחות שיש לבנים**; גודל הלוחות (שלוש על שלוש אמות) — בחירת מודל. הרצועה שמתחת לחומה ומחוצה לה — אבן.",
            refs: [["דברי הימים א כט, ב (ורש״י שם)", V(38, 29, 2)]] },
          // 1.2.2 (the scan): from the south, straight at the wall's three gates (x -40, 0, 40), the house rising behind it - and 136 amot off:
          // nearer than the fade distance (120, the rays along the view) the wall went a ghost over the house's chambers (1.0.x: z 128)
          { t: "שערי חצר הכהנים", tg: [0, 12, 64], cam: [0, 62, 200],
            info: "שבעה שערים לחצר הכהנים — שלושה בצפון, שלושה בדרום ואחד במזרח — על פי מדות א, ד (מוסכמה למודל; במלכים לא נמנו השערים ולא נקראו בשם). דלתותיהם מצופות נחושת — 'ודלתות לעזרה ודלתותיהם צפה נחשת' (דברי הימים ב ד, ט); רש״י שם: 'והעזרה הגדולה. זו עזרת ישראל'.\nבמודל: לפני השער המזרחי **שש מעלות**. בקצרה — צורתן (בתפריט, תחת ״שיטות ומחלוקות״, במתג 'מעלות השער המזרחי — צורתן'), כשתי השיטות בחמש עשרה המעלות של בית שני (מדות ב, ה: 'לא היו טרוטות, אלא מקפות כחצי גרן עגלה'): לרמב״ם — המעלות אינן ארוכות; כל מעלה חצי עיגול, זו על גבי זו, לפני השער (**ברירת המחדל**); ולרי״ד ולרבינו יהונתן — אורך המעלה כרוחב העזרה, מכותל לכותל, ובמודל כאן לאורך פני החצר. המעלות עצמן, מספרן, צורתן ואורכן בבית ראשון — בחירת מודל.",
            refs: [["מדות א, ד", MI(1, 4)], ["דברי הימים ב ד, ט", V(39, 4, 9)], ["רש״י דברי הימים ב ד, ט", { book: 3662, index: 141 }], ["מלכים א ו, לו", V(10, 6, 36)], ["מדות ב, ה", MI(2, 5)], ["פירוש המשניות לרמב״ם מדות ב, ה", { book: 573, index: 25 }], ["פסקי הרי״ד סוכה נג.", { book: 7576, index: 355 }], ["רבינו יהונתן סוכה נא:", { book: 7576, index: 353 }], ["המאירי מדות ב, ה", { book: 6033, index: 35 }]] },
          { t: "גנת הוורדים — מחוץ לשער המערב", feature: (ctx.shared.features || {})["roseGarden"] || null, tg: [-163, -27, 25], cam: [-192, -12, 58], info: "**הברייתא** (בבא קמא פב:), בדברים שנאמרו בירושלים: ״ואין עושין בה גנות ופרדסות – חוץ מגנות וורדין שהיו מימות נביאים הראשונים״; וכן **הרמב״ם** (בית הבחירה ז, יד): ״ואין מקימין בה אילנות חוץ מגנת ורדים שהיתה שם מימות נביאים הראשונים״.\nמקומה לא נתפרש. **תוספות יום טוב** (מידות א, ג), על שם ״שער קיפונוס״: ״ובשלטי הגבורים פ״ג חשב שהוא לשון יון, וענינו עבודת הגן, שאפשר שהיה שם גן של ורדים מחוץ להר הבית״; **תפארת ישראל** (יכין, מידות א, כה): ״קיפונוס מן המערב, אפשר שנקרא קופינוס, ע״ש שהיה שם אחורי ק״ק גנת וורדין שנקרא כך בלשון יון, ועשוהו שם לכבוד הק״ק שהיה לפניו במזרח... וי״א שנקרא כך ע״ש אותו שהתנדב לבנותו״.\n״מימות נביאים הראשונים״ — ולכן גם בבית ראשון. במודל: שכבה כבויה, שנפתחת במקום הזה — גן ורדים קטן מחוץ לשער המערב של החצר הגדולה, כמו בבית שני (שם הוא מחוץ לשער קיפונוס). אין מקור למקומו בימי בית ראשון — בחירת מודל, והמקום מוצג לאישור.", refs: [["בבא קמא פב:", {"book": 122, "index": 3124}], ["רמב״ם בית הבחירה ז, יד", {"book": 337, "index": 124}], ["תוספות יום טוב מידות א, ג", {"book": 948, "index": 30}], ["יכין מידות א, כה", {"book": 819, "index": 52}]] },   // ROSES_B2 (fix-b2, 22.11.2026 - the user's decision 77)
          // GATEKEEPERS_137 - 1.3.7 (the user, 11.11.2026: "מתג חדש אפשרות ב"; "ב"): the gatekeepers' watches of I Chr 26 at the Mishnah's
          // places (30-courts.js, ctx.shared.gatekeepers). The place switches them on and they stay on (timed: false) until the pill on
          // the model, or "החזר הכל", switches them off. Every quotation as read in the user's library (qa/fs/LIB_1111.md).
          { t: "משמרות השוערים (דברי הימים א כו)", tg: [103, 0, 82.5], cam: [103, 700, 215],
            feature: { key: "gatekeepers", timed: false, isOn: () => !!(ctx.shared.gatekeepers && ctx.shared.gatekeepers.on),
              on: () => { if (ctx.shared.gatekeepers) ctx.shared.gatekeepers.set(true); }, off: () => { if (ctx.shared.gatekeepers) ctx.shared.gatekeepers.set(false); } },
            tourThen: [{ pos: [0, 250, 150], target: [0, 0, 0] }, { pos: [330, 170, 150], target: [225, 0, 0] }],
            info: "הפסוקים (דברי הימים א כו, יב–יח), בסדר המשמרות שבימי דוד: ״לאלה מחלקות השערים לראשי הגברים משמרות לעמת אחיהם לשרת בבית ה׳״; ״ויפילו גורלות כקטן כגדול לבית אבותם לשער ושער״. רש״י: ״למי יבוא שער זה ולמי שער זה, למזרח למערב לצפון לדרום, וכן לכל שערים שבעזרה״. רד״ק: הגורל — ״לא לדעת אי זה מהם קודם, אלא איזה מהם לשער מזרח, ואי זה מהם לשער מערב ודרום וצפון״.\nמי עלה בגורל: ״ויפל הגורל מזרחה לשלמיהו וזכריהו בנו יועץ בשכל הפילו גורלות ויצא גורלו צפונה״; ״לעבד אדם נגבה ולבניו בית האספים״; ״לשפים ולחסה למערב עם שער שלכת במסלה העולה משמר לעמת משמר״.\nוהמניין: ״למזרח הלוים ששה לצפונה ליום ארבעה לנגבה ליום ארבעה ולאספים שנים שנים. לפרבר למערב ארבעה למסלה שנים לפרבר״.\nבגמרא (תמיד כז.) למדים מן הפסוק את מקומות המשנה (מדות א, א): ״והלוים בעשרים ואחד מקום. חמשה, על חמשה שערי הר הבית. ארבעה, על ארבע פנותיו מתוכו. חמשה, על חמשה שערי העזרה. ארבעה, על ארבע פנותיה מבחוץ. ואחד בלשכת הקרבן, ואחד בלשכת הפרכת, ואחד לאחורי בית הכפרת״. והקשו: ״הני עשרים וארבעה הוו!״ — ותירץ אביי: ״לאספים – שנים״, ו״היאך דפרבר – חד הוה, ואחרינא, בצוותא הוא דאזיל ויתיב גביה – משום דקאי אבראי״. ״ואיבעית אימא: לעולם עשרים וארבעה, כדכתיב. תלתא מינייהו – דכהנים, ועשרין וחד – דלוים״.\n**הרא״ש** (תמיד כז.) מפרש כל מספר שבפסוק. במזרח: ״שנים בשני פנות הר הבית ואחד על שער מזרח… וכן לעזרת נשים בשתי פינות ואחד בשער נקנור״. בצפון: ״אחד בשער הטדי בהר הבית. ושנים בב' שערי עזרה… ואחד בלשכת הקרבן או בלשכת הפרוכת״. בדרום: ״שני' בשני שערי חולדה בהר הבית ושנים בשני שערי עזרה״ — והשער האמצעי שבצפון ושבדרום בלא שומר: ״תרי מינייהו לא בעי שימור. לפי שכל אחד באמצע השניי' היה״. במערב: ״שנים לפנות הר הבית וב' לפנות העזרה״.\nבמודל — מתג, כבוי כברירת מחדל: עשרים ואחד הלויים במקומות המשנה, כחלוקת הרא״ש לרוחות. החצר הגדולה היא כנגד ״הר הבית״, החצר הפנימית כנגד ״העזרה״, והחצר החיצונה כנגד עזרת הנשים. שמונה־עשר עומדים במקומות שיש במודל. שלושה בגוון חיוור ובמקום משוער, ועליהם ״מקומו בבית ראשון לא נתפרש״: השער השני שבדרום (במודל שער אחד בכל צד), לשכת הקרבן ולשכת הפרוכת. אחרי ארבע הרוחות נשארו במשנה שלושה מקומות — שער המערב, אחורי בית הכפורת והלשכה האחרת — כנגד ״ולאספים שנים״ ו״לפרבר״ שבפסוק; הרא״ש לא פירש איזה מהם כנגד מה. שלושת מקומות הכהנים שבמשנה (בית אבטינס, בית הניצוץ ובית המוקד) אינם במודל של בית ראשון. מקומו המדויק של כל לוי, הדמויות, העיגולים וקרני האור — בחירת מודל.\nבקצרה — **הרמב״ם** (בית הבחירה ח, ח) מונה את חמשת שערי העזרה אחרת: ״ועל חמשה שערי העזרה חוץ לעזרה שהרי הכהנים שומרים על שער המוקד ועל שער הניצוץ״; במודל של בית ראשון אין שערים אלה, ולכן לא צויר לפיו. **האספים:** רש״י — ״מקום ששמו אסופים״; רד״ק — ״והיה זה הבית לדרום העזרה מבחוץ״; רבנו תם (בפירוש הרא״ש) — ״לאסופים סופי הדלתות״; רבנו גרשום — ״ב' קיטוניות שנתוספו על הבנין״; המאירי — ״ואספים הוא שם לשכה… ופרבר הוא שם לשכה גם כן״. **הפרבר:** ״כמאן דאמר כלפי בר״ (תמיד כז.). **המניין:** לרבנו תם הלויים שומרים ״בכ״א מקומות מלבד ג' מקומות ששומרים שם עם הכהנים״.",
            refs: [["דברי הימים א כו, יג", V(38, 26, 13)], ["דברי הימים א כו, יז", V(38, 26, 17)], ["רש״י דברי הימים א כו, יג", { book: 3664, index: 841 }], ["רד״ק דברי הימים א כו, יג", { book: 3521, index: 686 }], ["רד״ק דברי הימים א כו, טו", { book: 3521, index: 688 }], ["תמיד כז.", { book: 138, index: 29 }], ["הרא״ש, תמיד כז.", { book: 2224, index: 50 }], ["המפרש, תמיד כז.", { book: 2105, index: 70 }], ["רבנו גרשום, תמיד כז.", { book: 2101, index: 26 }], ["מדות א, א", MI(1, 1)], ["רמב״ם בית הבחירה ח, ח", RB(8, 8)], ["המאירי מדות א, א", { book: 6033, index: 6 }]] },
          // 1.0.1-K (K.6.5, Yossi): לשכת הגזית (30-courts.js). 1.0.1-L (L.21, the user: "רמבם", "לאורך", "הבא את שיטת התוספות יו"ט והמכילתא",
          // "גם בבית ראשון"): in the NORTH, east part of the north wall opposite the altar, lengthwise, half in / half out (courts.md FOR-UI);
          // the camera: from inside, high over the court half, west of the court door, looking down at the lots' ring, the line of the wall and the seats
          { t: "לשכת הגזית", action: () => openPill20("crt-gazit-roof"), tg: () => gazitTop().tg, cam: () => gazitTop().cam,   // 1.3.0: from above, the roof open (was view lishkatHaGazit, the low view from the court - the presentation keeps it)
            info: "לשכת הגזית — בצפון: 'שלש שבצפון: לשכת העץ, לשכת הגולה, לשכת הגזית' (יומא יט.; ראיית רב פפא שם עומדת רק בנוסח זה).\nהרמב״ם (בית הבחירה ה, יז): 'והשלש שבצפון לשכת הגזית. לשכת הגולה. לשכת העץ. לשכת הגזית שבה סנהדרי גדולה יושבת. וחציה היה קדש וחציה היה חל. ולה שני פתחים אחד לקדש ואחד לחל ובחצי של חל היו הסנהדרין יושבין'.\nתוספות יום טוב (מדות ה, ג): 'ונראה בעיני שגירסת הספר נשתבשה' — ובמשנה הנדפסת (מדות ה, ד): 'שבדרום, לשכת העץ, לשכת הגולה, לשכת הגזית'.\nמקומה — בחלקו המזרחי של הכותל הצפוני, מול המזבח: ציור התוספות יום טוב 'שבצפון סמוכה למזרח לשכת הגזית'; תפארת ישראל 'בזוית צפונית מזרחית של עזרת ישראל'; מכילתא 'נמצינו למדין שסנהדרין בצד מזבח'; תוספות רי״ד 'סמוכה למזבח ופתוחה למזבח'.\nבגמרא: 'לשכת הגזית כמין בסילקי גדולה היתה, פייס במזרחה, וזקן יושב במערבה' (יומא כה.; רש״י: 'בית גבוה שעל עלייה'), ואביי שם: 'שמע מינה לשכת הגזית חציה בקדש וחציה בחול, ושמע מינה שני פתחים היו לה, אחד פתוח בקדש, ואחד פתוח בחול' — לכן **היא עומדת על קו חומת החצר הפנימית הצפונית, חלקה בחצר וחלקה בחוץ**.\nחלוקתה במודל — מזרח ומערב, כלשון הגמרא וכמאירי (יומא כה.): הכהנים 'מתקבצים בחציה של קדש שהיה בצד מזרחה של לשכה', 'וזקן מזקני הסנהדרין יושב בחציה של חול לצד מערבה של לשכה'. פס נחושת ברצפה, מצפון לדרום, מסמן את הגבול. בקצרה — **תפארת ישראל** (צורת בית המקדש): 'בנויה חציה בדרום בקודש וחציה בצפון בחול', והסנהדרין 'פניהם לדרום ואחוריהן לצפון'.\nהפתחים כחק נתן: 'שהפתח הפתוח לחול היה פתוח לצד צפון סמוך למערב והפתח הפתוח לקדש היה פתוח לצד דרום סמוך למזרח', ומן הפתח החיצון מעלות: 'היו מעלות שעליה עולין וממנה יורדין לחול' (תוספות יום טוב ה, ד).\nבפנים: הסנהדרין בחצי המערבי, חצי החול: 'סנהדרי גדולה היתה של שבעים ואחד' (סנהדרין א, ו), 'כחצי גרן עגלה, כדי שיהו רואין זה את זה' (ד, ג) — **שבעים ואחד מושבים בשורה אחת, כחצי גורן**, פניהם למזרח, אל חצי הקודש; כיוון פניהם לשיטת המאירי — בחירת מודל. מקום הפייס ('פייס במזרחה') אינו מצויר בבית ראשון: הפייס — תקנה ('התקינו שלא יהו תורמין את המזבח אלא בפיס', יומא ב, ב), ולא נמצא מקור שנהג בבית ראשון. רש״י (סנהדרין לו:): 'בעגולה היו יושבין כדי שיהו כולן רואין זה את זה, לפי שאם היו יושבין בשורה אין פני הראשונים רואין זה את זה'.\nגם בבית ראשון: רש״י (דברי הימים ב לד, כב) 'כי לשכה אחת היתה לה לחולדה, סמוכה ללשכת הגזית'; מהרש״א (בבא בתרא צא:) 'כי במלכותו נתמנה סנהדרי גדולה לישב בלשכת הגזית'. וכך בתרשים הספר 'מקרא מפורש' (עמ' ב–ג, לשיטת רש״י): על החומה הצפונית, לאורכה, חציה בפנים וחציה בחוץ, ממערב לים.\nבמודל: אין מידות במקורות — מידותיה (כ־24 על 22), מקומה המדויק בין השער לים, והמעלות — בחירת מודל. **המושבים קטנים ממידת אדם**, כדי ששבעים ואחד ישבו בשורה אחת בתוך הלשכה: שורה אחת במידת אדם צריכה חצי עיגול שרדיוסו כעשרים ושלוש אמות. על כל מושב דיין, והנשיא באמצע; ושני סופרי הדיינים עומדים לפניהם, אחד מימין ואחד משמאל (סנהדרין ד, ג). בקצרה — שלוש שורות התלמידים (סנהדרין ד, ד): לרש״י אף הן כעגולה, וליד רמה שורות פשוטות — בתפריט, תחת ״שיטות ומחלוקות״.\nהדמויות: הדיינים — בגלימה שחורה ובכיפה; הזקן לבן סמוך לאמצע השורה, אפור בהמשכה ושחור־חום בקצותיה — על פי 'ושאר השבעים יושבין לפניו כפי שניהם וכפי מעלתם' (רמב״ם, סנהדרין א, ג). התלמידים שלפניהם — בלי זקן, פניהם אל הדיינים. שני הסופרים — עומדים, ולוח בידם. צורת הדמויות, לבושן וצבעי הזקנים — בחירת מודל.",
            refs: [["רמב״ם סנהדרין א, ג", { book: 375, index: 5 }], ["יומא יט.", P(107, "יט.")], ["רמב״ם בית הבחירה ה, יז", RB(5, 17)], ["תוספות יום טוב מדות ה, ג", { book: 948, index: 194 }], ["מדות ה, ד", MI(5, 4)], ["צורת בית המקדש להתוספות יום טוב", { book: 6028, index: 42 }], ["צורת בית המקדש להתפארת ישראל", { book: 6029, index: 65 }], ["מכילתא בחדש יא", { book: 285, index: 1474 }], ["תוספות רי״ד יומא כה.", { book: 2109, index: 76 }], ["יומא כה.", P(107, "כה.")], ["חק נתן על מדות", { book: 6026, index: 116 }], ["תוספות יום טוב מדות ה, ד", { book: 948, index: 208 }], ["משנה סנהדרין א, ו", MN(73, 1, 6)], ["משנה סנהדרין ד, ג", MN(73, 4, 3)], ["רש״י סנהדרין לו:", { book: 2180, index: 1777 }], ["רש״י דברי הימים ב לד, כב", { book: 3662, index: 1065 }], ["מהרש״א בבא בתרא צא:", { book: 2845, index: 313 }], ["המאירי יומא כה.", { book: 2199, index: 228 }], ["משנה יומא ב, ב", MN(55, 2, 2)]] },
          // 1.0.1-L (L.68, the user: "מול השולחנות והטבעות שבבית שני... למה לא הוספת אותם גם בבית ראשון? - תוסיף"): the Second Temple's
          // slaughter place north of the altar, a model choice ("השלמות"); the texts and the refs from courts-2.md FOR-UI (every quote DB-checked)
          { t: "בית המטבחים", view: "slaughterPlace",
            info: "בית המטבחים של בית שני, בצפון המזבח — השלמה למודל מן המקורות על בית שני.\nבתורה: 'ושחט אתו על ירך המזבח צפנה' (ויקרא א, יא; רש״י: 'על ירך המזבח. על צד המזבח'); 'איזהו צפון — מקיר של מזבח צפוני ועד כותל העזרה, וכנגד כל המזבח כולו צפון, דברי רבי יוסי ברבי יהודה' (יומא לו.).\nהטבעות: 'וטבעות היו לצפונו של מזבח, ששה סדרים של ארבע ארבע, ויש אומרים, ארבעה של שש שש, שעליהן שוחטין את הקדשים' (מדות ג, ה) — תיקנן יוחנן כהן גדול: 'עמד והתקין להם טבעות בקרקע' (סוטה מח.; רש״י: 'טבעות - להכניס צואר בהמה לתוכו'); ברטנורא: 'והיו קבועות ברצפה עשויות כמין קשת שהיו מכניסים בהן צואר בהמה בשעת שחיטה ונועצים ראש הטבעת בארץ'. 'של שחר היה נשחט על קרן צפונית מערבית, על טבעת שניה. של בין הערבים היה נשחט על קרן מזרחית צפונית, על טבעת שניה' (תמיד ד, א; יומא סב:; רש״י: 'לא בטבעת שאצל המזבח אלא בשניה לה המשוכה לצד צפון').\nהשולחנות: 'שלשה עשר שלחנות היו במקדש, שמונה של שיש בבית המטבחים, שעליהן מדיחין את הקרבים' (שקלים ו, ד) — **שתי שורות של ארבעה מצפון לדרום** כרש״י (יומא טז:: 'נתונות ד' בראש ארבע נמצאו ד' זו אצל זו ברוחב') וכציור הספר; תפארת ישראל: 'עמדו ח׳ שולחנות של שיש, בב׳ שורות מצפון לדרום. וכל שורה של ד’ ד’'.\nהננסין: 'בית המטבחים היה לצפונו של מזבח, ועליו שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין. ומפשיטין על שלחנות של שיש שבין העמודים' (מדות ג, ה; תמיד ג, ה) — שתי שורות של ארבעה וכציור הספר (תפארת ישראל: 'שמונה עמודים ננסין עומדים בצפון המזבח בד׳ שורות מצפון לדרום, וכל שורה של ב’ ב'. ורחוקים מחומת צפון של עזרה ח' אמות'), עמודי אבן נמוכים (רש״י: 'עמודים נמוכין התקועין בקרקע'), עליהם 'חתיכות מרבעות של ארז' (ברטנורא) ובהן האונקליות 'זו למעלה מזו... לתלות בהמה גדולה או קטנה', במזרח בצפון ובדרום ולא במערב, 'שלא יהפכו המפשיטים אחוריהן לקדש הקדשים' (ראבי״ה בתוספות יום טוב).\nהמרחקים כמדות ה, ב: 'מן המזבח לטבעות שמנה אמות, מקום הטבעות עשרים וארבע, מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע. מן הננסין לכתל העזרה שמנה אמות' — שמונה אמות פנויות מן המזבח, מקום הטבעות עשרים וארבע, ארבע עד אמצע השולחנות וארבע מהם לננסין (כסף משנה על הרמב״ם בית הבחירה ה, יד), ושמונה מן השורה האחרונה של הננסין עד כותל העזרה. בין שתי השורות שבע אמות (בבית שני 'בית המטבחים י״ב אמות ומחצה' — רמב״ם ה, יג; כאן מן המזבח לכותל חמישים וחמש אמות), ופני לשכת הגזית עומדים בתוך שמונה האמות האחרונות, כציור הספר.\nבקצרה — עוד שיטה: יש שהעמידו את הננסין בשורה אחת — הראבי״ה בתוספות יום טוב 'אלא כל דממזרח למערב עמודים ח'. שלחנות שמנה', והגר״א 'כי שמונה ננסין היו. נמצא היו ז' אוירים וכנגד כל אויר היה שולחן'.\nבמודל: כל המקורות על בית שני; מידות הטבעות, השולחנות, הננסין והאונקליות — בחירת מודל. ראו גם 'בית המטבחים — מקרוב'.",
            refs: [["ויקרא א, יא", V(3, 1, 11)], ["רש״י ויקרא א, יא", { book: 3694, index: 57 }], ["יומא לו.", P(107, "לו.")], ["מדות ג, ה", MI(3, 5)], ["מדות ה, ב", MI(5, 2)], ["משנה תמיד ד, א", MN(88, 4, 1)], ["משנה תמיד ג, ה", MN(88, 3, 5)], ["משנה שקלים ו, ד", { book: 54, index: 41 }], ["יומא טז:", P(107, "טז:")], ["רש״י יומא טז:", { book: 2157, index: 519 }], ["יומא סב:", P(107, "סב:")], ["רש״י יומא סב:", { book: 2157, index: 2322 }], ["סוטה מח.", P(119, "מח.")], ["רש״י סוטה מח.", { book: 2172, index: 2370 }], ["ברטנורא מדות ג, ה", { book: 643, index: 144 }], ["תוספות יום טוב מדות ג, ה", { book: 948, index: 132 }], ["תוספות יום טוב מדות ה, ב", { book: 948, index: 191 }], ["רמב״ם בית הבחירה ה, יג", RB(5, 13)], ["רמב״ם בית הבחירה ה, יד", RB(5, 14)], ["רמב״ם בית הבחירה ה, טו", RB(5, 15)], ["תפארת ישראל (יכין) מדות ג, ה", { book: 819, index: 421 }], ["צורת בית המקדש להתפארת ישראל — הננסין", { book: 6029, index: 99 }], ["צורת בית המקדש להתפארת ישראל — השולחנות", { book: 6029, index: 101 }], ["באורי הגר״א על מדות ה, ב", { book: 7509, index: 67 }]] },
          { t: "בית המטבחים — מקרוב", view: "slaughterPlaceClose",
            info: "שולחנות השיש: 'שמונה של שיש בבית המטבחים, שעליהן מדיחין את הקרבים' (שקלים ו, ד) — שיש, 'לפי שהשיש מקרר ומצנן ושומר הבשר שלא יסריח' (ברטנורא).\nהננסין: 'שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין' (מדות ג, ה) — האונקליות 'כעין מזלגות', 'זו למעלה מזו' (ברטנורא), בשלושה סדרים בגובה 1.7, 2.6 ו־3.5 אמות, בצד מזרח, צפון ודרום ולא במערב (ראבי״ה בתוספות יום טוב); ולפניהם הטבעות, 'כמין קשת' (ברטנורא).\nבמודל: מידותיהם — בחירת מודל; כל המקורות על בית שני.",
            refs: [["משנה שקלים ו, ד", { book: 54, index: 41 }], ["מדות ג, ה", MI(3, 5)], ["ברטנורא מדות ג, ה", { book: 643, index: 144 }], ["תוספות יום טוב מדות ג, ה", { book: 948, index: 132 }], ["מדות ה, ב", MI(5, 2)]] },
          { t: "המעלות אל הבית (האוטם)", tg: [22, 10, 0], cam: [45, 26, -35],   // 1.2.2 (the scan): from the north-east - with the altar in the south its top and fire filled the old view from z 30
            info: "במודל: **שתים עשרה מעלות מחצר הכהנים אל האולם, והבית עומד על אוטם של שש אמות** — על פי מדות ג, ו ו־ד, ו; מלבי״ם (מלכים א ו, ח) מזכיר יסוד של שש אמות מתחת לבית. במלכים אין מפלסים — בחירת מודל.",
            refs: [["מדות ג, ו", MI(3, 6)], ["מדות ד, ו", MI(4, 6)], ["מלבי״ם מלכים א ו, ח", V(10, 6, 8)]] }
        ]],
        ["המזבח וכלי הנחושת", [
          { t: "מזבח הנחושת", view: "mizbeach", key: "mizbeach" },
          // 1.2.0 (the user): does the altar block the doorway? the view from the house's doorway down the axis, per the reading of the row
          // 1.2.3 (the user: "קו ציר הבית - מה זה ולמה אין לו כפתור?"): the line itself, for 15 seconds, from the far east view
          { t: "קו ציר הבית — כנגד פתח ההיכל, ומקום המזבח", view: "altarPlaceView",
            feature: { key: "altarAxis", isOn: () => !!(ctx.shared.altarAxis && ctx.shared.altarAxis.get()),
              on: () => { if (ctx.shared.altarAxis) ctx.shared.altarAxis.set(true); }, off: () => { if (ctx.shared.altarAxis) ctx.shared.altarAxis.set(false); } },
            info: "קו מצויר על רצפת העזרה, מפתח ההיכל מזרחה — ציר הבית.\nהמחלוקת (יומא טז.; זבחים סג.): לרבי אליעזר בן יעקב 'כוליה מזבח בדרום קאי' — המזבח כולו מדרום לקו, והפתח פנוי; לרבי יוסי 'כוליה מזבח בצפון קאי' — כולו מצפונו; לרבי יהודה המזבח ממוצע — הקו עובר באמצעו, וגוף המזבח והכבש חוסמים את מראה הפתח.\nבמודל: הקו מוצג לחמש עשרה שניות; השיטה נבחרת במתג 'מקום המזבח' שבתפריט, תחת ״שיטות ומחלוקות״. הקו עצמו — עזר למודל, לא חלק מן הבניין.",
            refs: [["יומא טז.", P(107, "טז.")], ["זבחים סג.", P(130, "סג.")], ["רמב״ם בית הבחירה ה, יג", RB(5, 13)]] },
          { t: "מפתח ההיכל אל המזבח — האם המזבח חוסם את הפתח", view: "altarFromDoor",
            info: "המבט מפתח הבית מזרחה, לאורך ציר הבית, אל המזבח והכבש.\nבקצרה — השיטות: לפי רבי יהודה (ממוצע) גוף המזבח והכבש עומדים בקו ישר כנגד הפתח וחוסמים את מראהו; לפי רבי אליעזר בן יעקב (כולו בדרום) הפתח פנוי וגוף המזבח מתחיל בקו הציר; לפי רבי יוסי (כולו בצפון) הכבש הוא שנמשך אל מול הפתח.\nבמודל: החלפת השיטה — במתג 'מקום המזבח' שבתפריט, תחת ״שיטות ומחלוקות״ (ובכרטיס זה).",
            refs: [["יומא טז.", P(107, "טז.")], ["זבחים סג.", P(130, "סג.")]] },
          // 1.0.1-K review (ui-1 / cross-3): the camera stood by לשכת הגזית (30-courts.js, x 59..89, z 50..85, 22 high and its lantern)
          // and looked through its walls and roofs; now inside the court WEST of it, south-west of the ramp (40-altar.js: x 41.5..57.5,
          // z 10..42, rising to the altar's top at 16) - ray-tested clear to the target, fade on and off, both placements of the Sea;
          // model choice
          // NOTE 13 (the function review, F2-08): the two places of the ramp follow the altar when its place is changed (as the altar's
          // own views do): the altar's shift from the default, added to the eye and its target
          { t: "הכבש", tg: () => [55, 12, 28 + altarShift()], cam: () => [40.5, 32, 62 + altarShift()],
            info: "הכבש עולה אל המזבח מדרומו, כי אסור לעלות במעלות (״ולא תעלה במעלת על מזבחי״, שמות כ, כג).\nבמודל: מידותיו, **שלושים ושתיים על שש עשרה**, על פי מדות ג, ג כמוסכמה; במלכים ובדברי הימים אין כבש.\n**הרבובה — למה שימשה**: 'ורבובה היתה לו במערבו, ששם היו נותנים פסולי חטאת העוף' (מדות ג, ג); הרמב״ם (בית הבחירה ב, יד): 'וחלון היתה במערבו של כבש אמה על אמה ורבובה היתה נקראת. שבה נותנין פסולי חטאת העוף עד שתעבר צורתה ותצא לבית השרפה'.\nבקצרה — מקומה: לרמב״ם — חלון בגוף הכבש, ולר׳ שמעיה 'כעין ארובה חקוקה בכבש במערבו'; לרש״י (פסחים לד., כפי שהביא הבועז) — ברצפת העזרה, בקרן שבין הכבש למזבח; והראב״ד: 'לא כי אלא החלון לבד והרבובה לבד'. במודל — חלון בצד המערבי של הכבש, כרמב״ם. כל זה נאמר על בית שני; לבית ראשון אין לה מקור מאומת.",
            refs: [["דברי הימים ב ד, א", V(39, 4, 1)], ["מדות ג, ג", MI(3, 3)], ["רמב״ם בית הבחירה ב, יד", RB(2, 14)], ["ר׳ שמעיה מדות ג, ג", { book: 645, index: 94 }], ["בועז מדות ג", { book: 1329, index: 15 }], ["כסף משנה בית הבחירה ב, יד (הראב״ד)", { book: 4260, index: 109 }]] },
          // RAMP_WAYS_211 (1.4.4): the ways on the ramp (40-altar.js, the feature "rampWays") - Yoma 4:5
          { t: "עולים במזרח ויורדים במערב — הכבש", tg: () => [55, 12.5, 30 + altarShift()], cam: () => [76, 25, 50 + altarShift()],
            feature: (ctx.shared.features || {}).rampWays || null,
            info: "לשון המשנה (יומא ד, ה): 'בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו, והיום כהן גדול עולה באמצע ויורד באמצע'.\nבמודל: על פני הכבש — חיצים כחולים במחצית המזרחית, כלפי מעלה; חיצים כתומים במחצית המערבית, כלפי מטה; וחיצים זהובים באמצע, למעלה ולמטה — של הכהן הגדול ביום הכיפורים, כתנא קמא. המשנה מדברת על המקדש שבימיה; רוחב כל מסלול והסימון — בחירת מודל.\nבקצרה — המחלוקת: 'רבי יהודה אומר, לעולם כהן גדול עולה באמצע ויורד באמצע' (שם) — לדבריו, המסלול האמצעי של הכהן הגדול בכל ימות השנה. במודל — כתנא קמא.",
            refs: [["משנה יומא ד, ה", MN(55, 4, 5)]] },
          // 1.0.1-H: one place for the Sea; its two placements (Rashi / Radak) are chosen in the opinions table, not here
          { t: "הים של שלמה", view: "yam", key: "yam" },
          // 1.0.1-K (K.3): the oxen close (flyPoints.yamOxen, follows ctx.shared.seaPlacement)
          { t: "שנים עשר הבקר", view: "yamOxen",
            info: "הפסוק: 'עמד על שני עשר בקר שלשה פנים צפונה ושלשה פנים ימה ושלשה פנים נגבה ושלשה פנים מזרחה והים עליהם מלמעלה וכל אחריהם ביתה' (מלכים א ז, כה; דברי הימים ב ד, ד).\nרש״י: 'אל תחת הים היו אחוריהם פונים'. מצודת דוד: 'אחוריו של זה מול אחוריו של זה'. רלב״ג: 'והנה היו פני הבקר בחוץ נראים ואחוריהם היו נסתרים תחת הים'.\nבמודל, כציור הספר: **חציו הקדמי של כל שור יוצא מתחת לים** — הצוואר, החזה והרגליים הקדמיות בקו דופן הים, והחוטם כשתי אמות מחוץ לדופן — וראשו ראש שור מובהק: מצח רחב ושטוח, חוטם מרובע, אוזניים לצדדים וקרניים קצרות ועבות. גודל השוורים וצורתם — בחירת מודל.\nבקצרה — מקום הים (צפון־מזרח לרש״י, דרום־מזרח לרד״ק) — בתפריט, תחת ״שיטות ומחלוקות״.\n**לא היה בבית השני** — ״ואת עמודי הנחשת אשר לבית ה׳ ואת המכנות ואת ים הנחשת אשר בבית ה׳ שברו כשדים״ (ירמיה נב, יז); ובמסכת מידות, שבה מתואר הבית השני, אינם.",
            refs: [["ירמיה נב, יז", {"book": 13, "index": 1399}], ["מלכים א ז, כה", V(10, 7, 25)], ["ז, מד", V(10, 7, 44)], ["דברי הימים ב ד, ד", V(39, 4, 4)], ["רש״י ז, כה", V(10, 7, 25)]] },
          // 1.0.1-L (L.74, the user: "הכיור בין שתי השורות! של המכונות"; L.77 the book p. לח; vessels-2.md): Moses' laver in the middle column, between the two rows
          // of five; flyPoints.kiyorMoshe (45-vessels.js), with a fallback of the same camera
          { t: "כיור משה", view: "kiyorMoshe", tg: [rowX, 6, kz], cam: [rowX + 16, 26, kz],   // 1.2.2 (the scan): higher, so that the near bases of the two rows do not fill the frame
            info: "כיור משה עומד באמצע, בין שתי שורות המכונות: 'חמשה מימין כיור של משה וחמשה משמאל כיור משה' (ברייתא דמלאכת המשכן יב).\nהפסוק: 'ויעש כיורים עשרה ויתן חמשה מימין וחמשה משמאול' (דברי הימים ב ד, ו) — רש״י: 'ויתן חמשה מימין. לכיור של משה'; רד״ק (שם): 'מימין כיור משה ומשמאלו'.\nבמשנה: 'הכיור היה בין האולם ולמזבח, ומשוך כלפי הדרום' (מדות ג, ו). ובמשכן: 'ועשית כיור נחשת וכנו נחשת לרחצה ונתת אתו בין אהל מועד ובין המזבח' (שמות ל, יח); רש״י שם: 'ועומד כנגד אויר שבין המזבח והמשכן', 'משוך קמעא כלפי הדרום'.\nובו שני ברזים: 'בן קטין עשה שנים עשר דד לכיור, שלא היו לו אלא שנים' (משנה יומא ג, י) — תוספת של בית שני.\nוכן בילקוט שמעוני (נ״ך, רמז קפה): ״וכך קבע עשרה כיורות חמשה מימין כיור של משה וחמשה משמאל״.\nבמודל: כיור משה באמצע, בין שתי השורות, כברייתא וכילקוט; המרחקים — " + nf(rowX - ulamE) + " אמות מזרחה מחזית האולם ו־" + nf(kz) + " אמות דרומה מציר הבית — בחירת מודל, כציור הספר.",
            refs: [["מדות ג, ו", MI(3, 6)], ["ברייתא דמלאכת המשכן יב", { book: 240, index: 2876 }], ["דברי הימים ב ד, ו", V(39, 4, 6)], ["רש״י שם", { book: 3662, index: 129 }], ["רד״ק מלכים א ז, לט", { book: 3540, index: 505 }], ["שמות ל, יח", V(2, 30, 18)], ["רש״י שמות ל, יח", { book: 3692, index: 2237 }], ["משנה יומא ג, י", MN(55, 3, 10)], ["ילקוט שמעוני נ״ך קפה", { book: 3059, index: 956 }]] },   // fix-d: the Yalkut
          // 1.0.1-L (L.40, L.64, L.77; vessels.json FOR-UI): the block of 2 x 5, the purpose, the pills (L.51: the panel places for the demo and
          // the explode are gone - the pills on the base do it)
          { t: "עשר המכונות והכיורות", view: "mechonot",
            info: "המכונות (מלכים א ז, כז–לז): 'ארבע באמה ארך המכונה האחת וארבע באמה רחבה ושלש באמה קומתה' — רש״י: אמה וחצי קומת האופן ואמה וחצי גובה המכונה, 'האמה גבה היתה מרבעת, אבל חצי האמה היתה עגלה'. על כל מכונה כן וכיור של 'ארבעים בת' (ז, לח).\nמקומן: 'ויתן את המכנות חמש על כתף הבית מימין וחמש על כתף הבית משמאלו' (ז, לט); רש״י ז, לט: 'על כתף הבית. כנגד כתף הבית הימנית'. כולן במקום אחד, שתי שורות של חמש וכיור משה ביניהן — 'ויתן חמשה מימין. לכיור של משה' (רש״י דברי הימים ב ד, ו), 'מימין כיור משה ומשמאלו' (רד״ק שם). המקורות אומרים מימין לכיור ומשמאלו, ושתי השורות הן ציור הספר: במודל, כציור 'מקרא מפורש' (עמ' לח) וכמפתו (עמ' ב–ג) — מדרום לציר הבית, מול אגף האולם הדרומי, בינו לבין הכבש: השורה הצפונית בין האגף לכבש, והדרומית מעט מדרום להם.\nתפקיד המכונה — מושב הכיור: 'המכונה היא מושב הכיור' (רד״ק ז, כז). הכיורות לשני דברים: קידוש ידים ורגלים — 'לרחצה בהם. קדוש ידים ורגלים' (רש״י דברי הימים ב ד, ו); 'והכיורים היו לרחוץ מהם הכהנים ידיהם ורגליהם ולהדיח בהם מעשה העולה' (רד״ק ז, לט); והדחת העולה — 'את מעשה העולה ידיחו בם' (דברי הימים ב ד, ו).\nהאופנים — 'ב׳ לפנים ב׳ לאחור, כאלו ישאו אותה' (מצודת דוד ז, ל); רש״י (ז, לז), בשם בעל צורת הבית: 'ומעשה האופנים כמעשה אופן המרכבה, אופן בתוך אופן, למען יוכל להוליכם אל אשר יהיה הרוח והרצון להוליכם, שמה יוליכם מבלי שיצטרך להפכם אנה ואנה'.\nבמודל — ההדגמה (הכפתור 'הבא את הכיור לקידוש ידים ורגלים ולהדחת העולה' שעל המכונה שבשורה הצפונית): המכונה עוצרת תחילה בין האולם למזבח, ליד הכבש, לקידוש הכהנים — 'ורחצו אהרן ובניו ממנו את ידיהם ואת רגליהם' (שמות ל, יט). אחר כך היא נוסעת לשלחנות השיש שבבית המטבחים — 'שעליהן מדיחין את הקרבים' (שקלים ו, ד); 'וקרבו וכרעיו ירחץ במים' (ויקרא א, ט). ואז היא חוזרת. **לאן הוליכום** — רש״י (ז, לז): 'אל אשר יהיה הרוח והרצון להוליכם' — בלי מקום קבוע; המקום, הדרך והמים בהדגמה — בחירת מודל. הכפתור השני מפרק אותה לחלקיה. ראו 'המכונות מקרוב'.\n**לא היה בבית השני** — ״ואת עמודי הנחשת אשר לבית ה׳ ואת המכנות ואת ים הנחשת אשר בבית ה׳ שברו כשדים״ (ירמיה נב, יז); ובמסכת מידות, שבה מתואר הבית השני, אינם.",
            refs: [["ירמיה נב, יז", {"book": 13, "index": 1399}], ["מלכים א ז, כז", V(10, 7, 27)], ["ז, ל", V(10, 7, 30)], ["ז, לז (בעל צורת הבית)", V(10, 7, 37)], ["ז, לח", V(10, 7, 38)], ["ז, לט", V(10, 7, 39)], ["דברי הימים ב ד, ו", V(39, 4, 6)], ["ד, יד", V(39, 4, 14)], ["שמות ל, יט", V(2, 30, 19)], ["ויקרא א, ט", V(3, 1, 9)], ["משנה שקלים ו, ד", MN(54, 6, 4)]] },
          // 1.0.1-K (K.3, the user: "לא מצליחים לראות את המכונות ופעולתם היטב - אין לשם גישה"): the base close, its operation, taken apart
          // (1.0.1-K review, vessels-3: the close view parks a running demonstration - it frames the base's home spot)
          // 1.0.1-L (L.61, L.63, L.65, L.66, L.62; vessels-2.md): three frames a side, the flat decorations, the capital as the user describes it, the wheels, 40 bat
          { t: "המכונות מקרוב", view: "mechonaClose", action: () => feat.park(),
            info: "מכונה אחת מקרוב (מלכים א ז, כז–לח, ופירוש רש״י).\nהאופנים — 'וקומת האופן האחד אמה וחצי האמה' (ז, לב): בכל פינה אופן גדול עומד, ההולך קדימה ואחור, וגלגל קטן שוכב, המסובב אותו לצדדים — 'אופן בתוך האופן שתי וערב' (רש״י ז, לג), כציור הספר (עמ' לז).\nגוף המכונה — 'מסגרת להם ומסגרת בין השלבים' (ז, כח): למטה 'מחיצה נמוכה, מקפת וסוגרת את המכונה מכל ארבעת הפאות' (מצודת דוד), ממנה עולים השלבים — 'כעין שליבות סלם, כמין מקלות נחשת זקופין על המסגרות התחתונה' (רש״י) — וביניהם 'מסגרות קבועות משליבה לשליבה': שלוש מסגרות בין השלבים בכל צד, כביאור הגר״א.\nהציורים — דקים ושטוחים (בחירת מודל); ועל הליות רש״י ז, כט: 'מרדדין, כמין רדוד טס דק, ואין בולטין בעביו, ולא חקוקים בשקוע'. 'אריות בקר וכרובים' (ז, כט) — ארי ובקר בשורה העליונה, כרובים מתחתם וליות חבוקות ביניהם ('ליות, כמין זכר ונקבה מחברין זה בזה', רש״י); על המסגרות התחתונות ועל הנסרים — 'כרובים אריות ותמרת' (ז, לו); על הכתפות — כרובים.\nהכותרת — 'גג המכונה עשוי כמין כובע משפע מכל צדדיו', ובאמצעה 'נקב עגל אמה וחצי אמה רחב בעגול, וסביב אותו נקב כמין הקף מחצה, חצי אמה גבה סביב' (רש״י ז, לא): הוא 'פי הכותרת', ועליו מקלעות — 'צורת פרחים'; 'והכן מנח על אותו הקף, ושולי הכן תחובין בתוך פי ההקף, ולמעלה הימנו הוא בולט אמה'. הכתפות 'בולטות למעלה מן הנסרים בזויות הכן' (רש״י ז, ל).\nהכיור — 'ארבעים בת יכיל הכיור האחד ארבע באמה הכיור האחד' (ז, לח): 'ארבעים בת שהם מאה ועשרים סאין, שהוא שיעור ג' מקואות' (מלבי״ם), 'ט' פעמים אמה על אמה ברום אמה' (רלב״ג); רוחבו מבפנים אמה וחצי ורביע — 'אם היה כולו עגול' (מלבי״ם ז, כח); למלבי״ם עצמו, שהתחתונה מרובעת, זו המידה מבחוץ. עליו שני ברזים: 'כעין דוד ולה דדים המריקים מים' (מצודת ציון דברי הימים ב ד, ו); צורתם כציור הספר.\nבמודל: **42 בת עד השפה**, ולחשבון הגמרא, שהמרובע יתר על העגול רביע, 40.3. סך הכל שבע אמות עם הכיור. מקום האופנים בתוך ריבוע המכונה, עובי הדופן, רוחב ריבוע הכן וצורות הציורים — בחירת מודל.\n**לא היה בבית השני** — ״ואת עמודי הנחשת אשר לבית ה׳ ואת המכנות ואת ים הנחשת אשר בבית ה׳ שברו כשדים״ (ירמיה נב, יז); ובמסכת מידות, שבה מתואר הבית השני, אינם.",
            refs: [["ירמיה נב, יז", {"book": 13, "index": 1399}], ["מלכים א ז, כח", V(10, 7, 28)], ["ז, כט", V(10, 7, 29)], ["ז, ל", V(10, 7, 30)], ["ז, לא", V(10, 7, 31)], ["ז, לב", V(10, 7, 32)], ["ז, לג", V(10, 7, 33)], ["ז, לו", V(10, 7, 36)], ["ז, לח", V(10, 7, 38)], ["מלבי״ם ז, לח", { book: 3394, index: 406 }], ["רלב״ג ז, לח", { book: 3645, index: 292 }]] },
          // 1.0.1-L (L.51, the user: "למה צריך כפתור פעולת המכונה והמכונה בפירוק בתפריט? לא מספיק הכפתור על המכונה?"): the K.3 places
          // "פעולת המכונה" and "המכונה בפירוק" are gone - the two pills on the base run the demonstration and take it apart; the wheels' text
          // ("אופן בתוך אופן", the book's small lying wheel, בעל צורת הבית's rods) lives on in the label "אופן בתוך אופן (רש״י ז, לג)" and in
          // "השלמות" ("המכונות — האופנים, הכיור וההדגמה")
          // 1.0.1-L (L.58): the in-doorway camera of K.1 stays as a place; the grid's "יכין ובועז" is the far view (yachinBoazFull)
          { t: "יכין ובועז — מבט מפתח האולם", view: "yachinBoaz", key: "yachinBoaz" },
          // 1.0.1-L (L.45, the user: "כפתור יכין ובועז אמור להראותם בשלמותם"; L.58 "תשאיר סגור"): on the axis the open doors hide most of both pillars
          // (the passage between the leaves is 9.3), but from the side ONE whole pillar stands in the doorway: the camera in the court, 15.5 off the
          // axis on the far side, looks through the passage at the shaft's near face (ray-tested; model choice)
          { t: "יכין — מבעד לפתח, לכל גובהו", cam: () => [37, 24, -15.5], tg: () => [pil.x + 1.69, 22.5, pil.z - 1.24],
            info: "הפסוק: 'ויקם את העמוד הימני ויקרא את שמו יכין' (מלכים א ז, כא) — 'בפאת הדרומי' (מצודת דוד).\nבמודל: המבט מן החצר, מצפון לציר, בעד פתח האולם ובין דלתותיו הפתוחות, והאולם סגור: העמוד כולו, מן הרצפה ועד ראש הכותרת — **עשרים ואחת אמה**, כמעט כגובה הפתח (עשרים ושתיים) — וכך נראה גודלו. מקום המבט — בחירת מודל; שני העמודים יחד, בלי להסיר דבר, אינם נראים שלמים מנקודה אחת.\n**לא היה בבית השני** — ״ואת עמודי הנחשת אשר לבית ה׳ ואת המכנות ואת ים הנחשת אשר בבית ה׳ שברו כשדים״ (ירמיה נב, יז); ובמסכת מידות, שבה מתואר הבית השני, אינם.",
            refs: [["ירמיה נב, יז", {"book": 13, "index": 1399}], ["מלכים א ז, כא", V(10, 7, 21)], ["ז, טו", V(10, 7, 15)], ["ז, טז", V(10, 7, 16)], ["דברי הימים ב ג, יז", V(39, 3, 17)]] },
          { t: "בועז — מבעד לפתח, לכל גובהו", cam: () => [37, 24, 15.5], tg: () => [pil.x + 1.69, 22.5, -pil.z + 1.24],
            info: "הפסוק: 'ויקם את העמוד השמאלי ויקרא את שמו בעז' (מלכים א ז, כא).\nבמודל: המבט מן החצר, מדרום לציר, בעד פתח האולם ובין דלתותיו הפתוחות, והאולם סגור: העמוד כולו, מן הרצפה ועד ראש הכותרת — **עשרים ואחת אמה**, כמעט כגובה הפתח (עשרים ושתיים) — וכך נראה גודלו. מקום המבט — בחירת מודל.\n**לא היה בבית השני** — ״ואת עמודי הנחשת אשר לבית ה׳ ואת המכנות ואת ים הנחשת אשר בבית ה׳ שברו כשדים״ (ירמיה נב, יז); ובמסכת מידות, שבה מתואר הבית השני, אינם.",
            refs: [["ירמיה נב, יז", {"book": 13, "index": 1399}], ["מלכים א ז, כא", V(10, 7, 21)], ["ז, טו", V(10, 7, 15)], ["ז, טז", V(10, 7, 16)], ["דברי הימים ב ג, יז", V(39, 3, 17)]] },
          // 1.0.1-L (verify-heichal.md FOR-UI 4): the far view's twin: Boaz whole from the south-east (the grid's "יכין ובועז" shows Yachin); the label בועז opens this text
          { t: "בועז — מרחוק", view: "boazFar",
            info: ui_YB_BODY + "\nבמודל: המבט מרחוק, מן החצר, מדרום־מזרח, והאולם סגור. בעד פתח האולם (עשר על עשרים ושתיים) ובין דלתותיו הפתוחות נראה בועז בשלמותו, מן הרצפה ועד ראש הכותרת — **עשרים ואחת אמה** — כנגד חזית האולם, המעלות והמזבח, כדי שייראה גודלו. שני העמודים יחד אינם נראים בשלמותם מבחוץ. גררו את המבט סביב הפתח אל הצפון־מזרח — ונראה יכין. מקום המבט — בחירת מודל.",
            refs: ui_REFS.yachinBoaz },
          { t: "כותרת העמוד — שבכה, רימונים ושושנים", view: "yachinBoazCapital",
            info: "הפסוק: 'חמש אמות קומת הכתרת האחת' (מלכים א ז, טז).\nרש״י (ז, יח): 'כמין שני אגנים היתה כל אחת, אגן התחתון בית קבולה למעלה, והוא קרוי גלה... העליון כפוי על התחתון', 'נמצא רחבה במקום הדבק... והוא קרוי בטן', 'והאמה החמישית, היא כותרת קטנה למעלה מן הגדולה'.\nבמודל, כציור הספר: הגולה התחתונה — שתי אמות, ועליה שושנים; על הבטן שני טורי רימונים, 'מאה רמונים בטור, חרוזים בשרשרות' (רש״י ז, מב; 'והרמונים מאתים', ז, כ), 'והרמונים מכסים את מקום הדבק' (רש״י ירמיהו נב, כב); השבכה — 'דומה כמין כפה' (רש״י ז, יז), 'שבעה לולבין היה להקף אחד', 'וגדילים היו להם כמעשה שרשראות'; ועל ראשה הכותרת הקטנה, אמה. 'וקומת הכתרת שלש אמות ושבכה ורמנים על הכתרת סביב' (מלכים ב כה, יז) — הכיפה עם הכותרת הקטנה. העמוד תחוב בכותרת שתי אמות (רש״י ז, טז).\nבקצרה — המחלוקות: רש״י (ז, טז) מביא גם ששתי האמות התחתונות 'היו שוות לעמוד, שלא היו בהן צורה'; הספר והמודל הולכים אחרי רש״י (ז, יח) בגולה מצוירת שושנים. שיטה שנייה — מלבי״ם על 'מעשה שושן' (ז, יט): שבכה ארוגה מנחושת, שרשרות ורימונים תלויים, ושושן מצויר על הכותל — במתג 'כותרות יכין ובועז' בתפריט, תחת ״שיטות ומחלוקות״.\n**לא היה בבית השני** — ״ואת עמודי הנחשת אשר לבית ה׳ ואת המכנות ואת ים הנחשת אשר בבית ה׳ שברו כשדים״ (ירמיה נב, יז); ובמסכת מידות, שבה מתואר הבית השני, אינם.",
            refs: [["ירמיה נב, יז", {"book": 13, "index": 1399}], ["מלכים א ז, טז", V(10, 7, 16)], ["ז, יז", V(10, 7, 17)], ["ז, יח", V(10, 7, 18)], ["ז, כ", V(10, 7, 20)], ["ז, מב", V(10, 7, 42)], ["ירמיהו נב, כב", V(13, 52, 22)], ["מלכים ב כה, יז", V(11, 25, 17)]] }
        ]],
        ["הבית מבחוץ", [
          // 1.0.1-K (K.2.4): the ulam (flyPoints.ulamInside). 1.0.1-L (L.44): from the front; L.59 the doorway and its doors have their own place
          { t: "האולם ובית החליפות", view: "ulamInside",
            info: "הפסוק: 'והאולם על פני היכל הבית עשרים אמה ארכו על פני רחב הבית עשר באמה רחבו' (מלכים א ו, ג).\nבית החליפות: לפי רש״י (יומא לו.) האולם רחב מן הבית חמש עשרה אמה מכל צד, ושם גנזו את הסכינים — ולכן **חזית האולם במודל שמונים וארבע אמות**: גוף הבית עם התאים ועוד חמש עשרה אמה מכל צד (מדות ד, ז: 'האולם עודף עליו חמש עשרה אמה מן הצפון וחמש עשרה אמה מן הדרום').\nכתלי האולם שלושה נדבכי גזית ונדבך ארזים — 'ולאלם הבית' (ז, יב) כפירוש מצודת דוד ('כי כולם בנה בשלשה טורים גזית'), רלב״ג, מלבי״ם ורד״ק; רש״י שם מתאר את הדגם בלבד.\nבמודל: המבט מן החזית, מול הפתח; פתחו — עשר על עשרים ושתיים — ושתי דלתותיו: ראו 'פתח האולם ודלתותיו'.",
            refs: [["מלכים א ו, ג", V(10, 6, 3)], ["יומא לו.", P(107, "לו.")], ["מדות ד, ז", MI(4, 7)], ["מלכים א ז, יב", V(10, 7, 12)]] },
          // 1.0.1-L (L.59, the user: "רוחב 10 גובה 22"; heichal-door.md): the doorway and its two open cedar doors - the camera from the court,
          // north-east of the axis and above the altar's reach, looking into the doorway at the south leaf folded in its reveal (ray-tested); the eye above its
          // target (verify-heichal.md FOR-UI 7: from below the orbit limit lifts the eye), far enough for the whole doorway, threshold to lintel, in the frame
          { t: "פתח האולם ודלתותיו", tg: () => [ulamDoor.x[1], (ulamDoor.y[0] + ulamDoor.y[1]) / 2, -3], cam: () => [ulamDoor.x[1] + 35.5, ulamDoor.y[0] + 21, -14],
            info: "פתח האולם — עשר על עשרים ושתיים, בחירת מודל: אין מקור למידות פתח האולם בבית ראשון. הכתוב מודד רק את האולם — 'עשרים אמה ארכו על פני רחב הבית עשר באמה רחבו' (מלכים א ו, ג); 'פתחו של אולם, גבהו ארבעים אמה, ורחבו עשרים אמה' (מדות ג, ז) ו'חוץ משל אולם' (מדות ב, ג) הם בית שני.\nהדלתות: בבית ראשון היו דלתות באולם — 'גם סגרו דלתות האולם ויכבו את הנרות' (דברי הימים ב כט, ז), מלבי״ם שם: 'ואח״כ סגרו דלתות האולם'; והן עמדו פתוחות ביום — המאירי (יומא נד.): 'ואע״פ ששערים של עץ היו שם מ״מ לא היו נועלים אותם ביום ופורסים הפרוכת לפניהם' — הפרוכת שהוא מזכיר לא נבנתה.\nבמודל: **שתי דלתות ארז, פתוחות ומקופלות אל תוך עובי הפתח** כדלתות ההיכל — 'החיצונות נפתחות לתוך הפתח לכסות עביו של כתל' (מדות ד, א). **ראש הפתח קשת**: רש״י (מלכים א ז, ה), על 'וכל הפתחים והמזוזות רבעים שקף': 'רבועין היו כשאר פתחי בתים, ולא עשויין כפה כעין פתחי אולם'. ראש הקשת בגובה עשרים ושתיים, תחילתה חמש אמות מתחתיו, והדלתות מגיעות עד תחילת הקשת — בחירת מודל; מעל הקשת קורת המשקוף. ארז ולא זהב — באולם אין ציפוי זהב (רש״י ומצודות על דברי הימים ב ג, ד); צירי הנחושת, עובי הדלת (שליש אמה) ולוח אחד לכל דלת — בחירת מודל. הדלתות נעלמות עם חזית האולם בכפתור 'פתח את האולם'.",
            refs: [["מלכים א ו, ג", V(10, 6, 3)], ["מדות ג, ז", MI(3, 7)], ["מדות ב, ג", MI(2, 3)], ["מדות ד, א", MI(4, 1)], ["דברי הימים ב כט, ז", V(39, 29, 7)], ["יומא נד.", P(107, "נד.")], ["מלכים א ז, ה", V(10, 7, 5)], ["רש״י מלכים א ז, ה", { book: 3673, index: 329 }], ["דברי הימים ב ג, ד", V(39, 3, 4)]] },
          // 1.3.5 (the user, 22:12: "פשפשים וכו להוסיף"): the wickets of Beit HaChalifot (50-heichal.js, the group "ulamWickets")
          { t: "פשפשי בית החליפות", tg: [-3.5, 16.5, 42], cam: [-19, 25, 57],
            info: "בגמרא (זבחים נה:): 'רבי יוסי ברבי יהודה אומר: שני פשפשין היו בבית החליפות, וגובהן שמנה; כדי להכשיר את העזרה כולה לאכילת קדשי קדשים, ולשחיטת קדשים קלים'.\nרש״י: 'ובאותן שני כתלים היו שני פתחים קטנים', 'ופתוחין למערב'; ועל הצדדים: 'דפתח להו בקרן זוית — של אולם, מקצת הפתח פונה לצפון ומקצתו למערב, וכן בדרום'; 'שהן פתחים קטנים, ואין משמשין כניסה ויציאה'.\nבמודל: פשפש גבוה שמונה אמות בקרן הזווית המערבית של כל אחד משני אגפי האולם (בית החליפות) — מקצתו בכותל המערבי ומקצתו בכותל הצד — בגובה רצפת האולם, מצויר על פני הכותל. רש״י מתאר שם את אולם בית שני (אחת עשרה אמה); העתקת הפשפשים לבית ראשון, ורוחבם — בחירת מודל. המבט: אל הפשפש הדרומי, מדרום־מערב. בשיטת הרמב״ם לאולם (בליטה לאורך הבית) אינם מוצגים.",
            refs: [["זבחים נה:", { book: 130, index: 1920 }], ["רש״י זבחים נה:", { book: 2191, index: 2692 }], ["יומא לו.", P(107, "לו.")], ["מדות ד, ז", MI(4, 7)]] },
          // 1.0.1-L (L.72, the user: "תוסיף את שיטת ר' יוסי בר' יהודה שהיו עוד 2 שולחנות... הוסף בכפתור נפרד"; heichal-door.md): the place
          // switches the reading on (ctx.shared.ulamTables "ryby") for 15 s (L.27) and flies to the tables; the row of the opinions table keeps it
          { t: "שולחנות האולם — ר׳ יוסי בר׳ יהודה", view: "ulamTables",   // 1.1.0: the tables are always shown (no feature to switch on)
            info: "שני שולחנות באולם, לפני פתח ההיכל.\nבגמרא: 'רבי יוסי ברבי יהודה אומר: לא היו מסדרין אלא על של משה, אלא מה אני מקיים ״ואת השלחנות אשר עליהם לחם הפנים זהב״? אלו שלשה שלחנות שהיו במקדש: שנים שהיו באולם מבפנים לפתח הבית, אחד של כסף ואחד של זהב' (מנחות צט.) — ולדבריו עמדו בבית שלמה (דברי הימים ב ד, יט: 'ואת השלחנות ועליהם לחם הפנים').\nרש״י: 'אצל פתח ההיכל אחד של כסף ואחד של זהב והאי דקרי הכא כסף ובמתניתין שייש משום דשייש לבן ככסף'; 'בכניסתו מניחו על של כסף וכשמגיע להיכל מסדר על של משה שמצופה זהב הרי עלייה ולא מורידין לכך ביציאתו מניחו על של זהב'.\nהמשנה (שקלים ו, ד; מנחות יא, ז): 'ושנים באולם מבפנים על פתח הבית, אחד של שיש ואחד של זהב, על של שיש נותנין לחם הפנים בכניסתו, ועל של זהב ביציאתו, שמעלין בקדש ולא מורידין', וכן הרמב״ם (בית הבחירה ג, טז).\nבמודל: שני שולחנות במידת שולחן לחם הפנים (שמות כה, כג), בתוך האולם סמוך לפתח ההיכל משני צדי המעבר — **הכסף בצפון והזהב בדרום**: בבית שני — תפארת ישראל (צורת בית המקדש, בבית שני): ״שני שולחנות עומדים מבפנים באולם, א׳ מימין וא׳ משמאל לפתח. בימיני של שיש נותנין לחם הפנים קודם שיכניסום להיכל. ובשמאלי של זהב, שהוא בימין היוצא, נותנין לחם הפנים כשיוציאום מההיכל״ — ימין הנכנס מערבה הוא צפון; בבית ראשון — כמותו. על השולחן שבצפון — שתים עשרה החלות, בשני סדרים של שש, ברגע שהן נכנסות: 'בכניסתו מניחו על של כסף' (רש״י), 'על של שיש נותנין לחם הפנים בכניסתו' (שקלים ו, ד); הרגע הזה — בחירת מודל. הכפתור מראה אותם וחוזר לבד אחרי 15 שניות; לבחירה קבועה — המתג 'שני השולחנות שבאולם' בתפריט, תחת ״שיטות ומחלוקות״ (שם גם המשנה: שיש וזהב).",
            refs: [["מנחות צט.", P(131, "צט.")], ["דברי הימים ב ד, יט", V(39, 4, 19)], ["משנה שקלים ו, ד", MN(54, 6, 4)], ["משנה מנחות יא, ז", MN(81, 11, 7)], ["רמב״ם בית הבחירה ג, טז", RB(3, 16)], ["שמות כה, כג", V(2, 25, 23)], ["צורת בית המקדש לתפארת ישראל", { book: 6029, index: 126 }]] },   // fix-d: the side - Tiferet Yisrael
          { t: "הבית (בית ה׳)", tg: [-25, 24, 27.2], cam: [90, 80, 150], // 1.0.1: was "ההיכל" - that name is the kodesh (I Kings 6:17, the user); the whole house is "בית ה׳" (the 3D label too)
            info: "הפסוק: 'והבית אשר בנה המלך שלמה לה׳ ששים אמה ארכו ועשרים רחבו ושלשים אמה קומתו' (מלכים א ו, ב) — מידות הפנים.\n'ההיכל' בפסוקים הוא חלל ארבעים האמה שבתוך הבית, שבו המנורות ('הבית הוא ההיכל לפני', ו, יז); הבית כולו — 'בית ה׳'.\nהקירות אבן שלמה מסע (ו, ז), והבית סגור מכל צדדיו; סביבו מדרום, ממערב ומצפון שלוש קומות התאים, וכותל הבית נכנס אמה בכל קומה — 'מגרעות' (ו, ו).\nבמודל: **שבע אמות עוביו בקומה התחתונה, שש בתיכונה, חמש בעליונה וארבע מעל גג התאים** — חשבון רש״י כפי שמצייר הספר (במדות ד, ז, בבית שני — שש).",
            refs: [["מלכים א ו, ב", V(10, 6, 2)], ["ו, ו", V(10, 6, 6)], ["ו, ז", V(10, 6, 7)], ["רש״י ו, ו", V(10, 6, 6)], ["מדות ד, ז", MI(4, 7)]] },
          { t: "חלוני שקופים אטומים", tg: [-35, 34, 14.5], cam: [-20, 40, 52],   // the window band y 32.75..35.25 on the house wall's face z 14, over the chambers' roof (y 30)
            info: "הפסוק: 'ויעש לבית חלוני שקפים אטומים' (מלכים א ו, ד).\nרש״י ומנחות פו:: **פתוחים (רחבים) מבחוץ ואטומים (צרים) מבפנים**, שלא כחלונות רגילים, להראות שאין הבית צריך לאורה.\nמקומם — מעל היציעים: אברבנאל (מלכים א ו, ה): 'שעד חמש עשרה אמות מהכותל עשה היציעים ומשם ומעלה לא נעשה דבר, בעבור שהיה פנוי לעשות שמה החלונים שקופים אטומים'.\nבמודל: ברצועה שמעל גג היציע, כאברבנאל; מספרם אינו במקורות — שישה בכל צד, לאורך ההיכל (בחירת מודל; ראו 'השלמות').",
            refs: [["מלכים א ו, ד", V(10, 6, 4)], ["מנחות פו:", P(131, "פו:")], ["אברבנאל מלכים א ו, ה", { book: 3574, index: 321 }]] },   // fix-d: the Abarbanel - the place
          // 1.2.0 (the user): the three layers of the ceiling by name, after the book (figs. 14-15) and Rashi 6:9; the house opened shows them in section
          { t: "בית דילפא — בין תקרת הגבים לשדרות", tg: [-3, 44, 0], cam: [26, 47.5, 6], layer: "aliyot",   // 1.2.1 (the user): the aliyot reading at once;
            // 1.2.3 (the user: "ממזרח", "להיסגר אוטו לאחר 15 שניות"): the SECTION from the east (ctx.sectionCut: the house's east wall and the
            // ulam's front off, the ceilings kept) as a 15-second feature; the eye east of the house at the ceilings' east end: the gold גבים,
            // the two open amot of בית דילפא and the cedar שדרות, with their labels, the opened aliyot above
            feature: { key: "houseSection", isOn: () => !!(ctx.ui && ctx.ui.sectionOn && ctx.ui.sectionOn()),
              on: () => { try { setCutaway(false); setSection(true); if (ctx.shared.aliyotOpen) ctx.shared.aliyotOpen.set(true); } catch (_) {} },
              off: () => { try { setSection(false); if (ctx.shared.aliyotOpen) ctx.shared.aliyotOpen.set(false); } catch (_) {} } },
            info: "הפסוק: 'ויספן את הבית גבים ושדרת בארזים' (מלכים א ו, ט) — שתי תקרות.\nהגבים — התחתונה, לנוי: רש״י — 'נסרים ארוגים נאים כמין צורה' (בשם רבי מנחם), ולדעתו: 'לבנים חלולים, והם כחצי קנה עגל' (רעפים); מצודת דוד — 'תקרה חקוקה ומצוירת גבים, לנוי ולפאר'. מעל ההיכל תקרת הגבים קמורה — רש״י (דברי הימים ב ג, ז): 'שהגג היה כמו ספינה וערבה הפוכה, שכן מנהג לקרות את הקרוי עגל כעין ספינה'.\nהשדרות — העליונה: ארזים סדורים זה בצד זה 'לדריסת הרגל' (רש״י) — רצפת העלייה. ביניהן חלל של שתי אמות, 'בית דילפא' (רמב״ם בית הבחירה ד, ג, שהובא במלבי״ם): שם נוטף הגשם, ולא לתקרת ההיכל.\nבמודל: הגבים כיור מצויר ומצופה זהב. גובה תחילת הקימור (עשרים וארבע אמות מן הרצפה, מעל החלונות) — בחירת מודל; **ראש הקמרון בשלושים אמה**. כך מעל ההיכל, וכך מעל כל אחת משתי העליות. לראות: הכפתור ״פתח את העליות״ שעל המודל — חתך ממזרח לאורך הבית, והתקרות חתוכות בקצן המזרחי.",
            refs: [["מלכים א ו, ט", V(10, 6, 9)], ["רש״י שם", { book: 3673, index: 232 }], ["מצודת דוד שם", { book: 3345, index: 432 }], ["רש״י דברי הימים ב ג, ז", { book: 3662, index: 81 }], ["רמב״ם בית הבחירה ד, ג", RB(4, 3)], ["דברי הימים ב ג, ט", V(39, 3, 9)]] },
          { t: "גג הבית ותקרותיו", tg: [-30, 46, 0], cam: [40, 92, 62],
            // 1.2.2 (the scan): the roof of the 30-amah reading - after "בית דילפא" the eye stood inside the open aliyot; the layer, the section and the cutaway go off
            action: () => { try { setLayer("aliyot", false); if (ctx.shared.aliyotOpen) ctx.shared.aliyotOpen.set(false); setSection(false); setCutaway(false); } catch (_) {} },
            info: "הפסוק: 'ויספן את הבית גבים ושדרת בארזים' (מלכים א ו, ט) — תקרה כפולה.\nה'גבים' למטה (כיור מצויר ומצופה זהב; מעל ההיכל קמורה, 'כמו ספינה וערבה הפוכה' — רש״י דברי הימים ב ג, ז), חלל 'בית דילפא' (שתי אמות; הרמב״ם בית הבחירה ד, במלבי״ם), וה'שדרות' למעלה — ארזים זה בצד זה, רצפת העלייה (רש״י).\nמעליה, בשיטת 120 האמה, שתי העליות (המתג 'גובה הבית'). **תקרת קודש הקדשים נמוכה מתקרת ההיכל** (רש״י ו, כ), ומעליה עלייה מצופה זהב (דברי הימים ב ג, ט).",
            refs: [["מלכים א ו, ט", V(10, 6, 9)], ["ו, כ", V(10, 6, 20)], ["רש״י דברי הימים ב ג, ז", { book: 3662, index: 81 }], ["דברי הימים ב ג, ט", V(39, 3, 9)], ["רמב״ם בית הבחירה ד, ג", RB(4, 3)]] },
          { t: "קודש הקדשים מבחוץ", view: "heichalWest",
            info: "הדביר בירכתי הבית במערב: 'עשרים אמה ארך ועשרים אמה רחב ועשרים אמה קומתו' (מלכים א ו, כ).\nמבחוץ סובבים אותו תאי היציע של המערב, ומעליו עליית קודש הקדשים — **תקרתו נמוכה מתקרת ההיכל** (רש״י ו, כ).",
            refs: [["מלכים א ו, כ", V(10, 6, 20)], ["ו, טז", V(10, 6, 16)]] },
          // 1.3.5 (the user, 22:12: "פשפשים וכו להוסיף"): the lul behind the Kaporet (50-heichal.js, ctx.shared.lul)
          { t: "הלול שאחורי בית הכפורת", tg: [-80.38, 21.1, -1.38], cam: [-94, 32, 3],   // SCAN2_FIX (scan 2, item 2): from over the court's west wall, the whole lul (2 x 8) and its label in the free middle
            info: "בגמרא (זבחים נה:): 'אחורי בית הכפורת מאי? תא שמע, דאמר רמי בר רב יהודה אמר רב: לול קטן היה אחורי בית הכפורת, גבוה שמונה אמות; כדי להכשיר את העזרה לאכילת קדשי קדשים, ולשחיטת קדשים קלים. והיינו דכתיב: שנים לפרבר'. הפסוק (דברי הימים א כו, יח) — במשמרות השוערים; רש״י: 'וקאמר שני שומרים העמידו לבר, והיינו לאותו לול'.\nרש״י: 'לול — כמין חלון פתוח מן התא שאחורי בית הכפרת לאויר העזרה'.\nהרא״ש (תמיד כז.): 'לשכה אחת היתה במערב, והיה לול קטן בכותל מערבי פתוח מן קדש הקדשים לאותה לשכה, והלשכה היתה פתוחה לעזרה כנגד הלול, להכשיר אחורי הכפורת לשחיטת קדשים'.\nכפתור ופרח (בבית שני): ״ואין לתמוה על זה הלול, כי לא היה לפי הנראה בכותל קדש הקדשים עצמו... ואם כן יהיה זה הלול בכותל התא״ — כרש״י.\nבקצרה — רש״י וכפתור ופרח: חלון מן התא אל אוויר העזרה. הרא״ש: לול מקודש הקדשים אל הלשכה, והלשכה פתוחה לעזרה כנגדו. במודל מצוירים שניהם, זה כנגד זה.\nבמודל: פתח בכותל המערבי של הדביר אל התא האמצעי שבמערב, וכנגדו פתח בכותל התא אל החצר — שניהם גבוהים שמונה אמות, מגובה רצפת הדביר שבמערבו. רוחבם (שתי אמות) ומקומם בגובה — בחירת מודל.",
            refs: [["זבחים נה:", { book: 130, index: 1924 }], ["רש״י זבחים נה:", { book: 2191, index: 2702 }], ["הרא״ש, תמיד כז.", { book: 2224, index: 48 }], ["דברי הימים א כו, יח", V(38, 26, 18)], ["כפתור ופרח פרק ו", { book: 7576, index: 243 }]] }
        ]],
        // 1.0.1-L (L.43, the user: "הכפתור... צריך להיות בתפריט היציע באופן ברור"): the yatzia has its own group - the closed chambers, the
        // SECTION (its camera turns to the cut: flyPoints.yatziaSection, square-on - heichal.json; the feature goes off by itself after 15 s,
        // L.27, and 50-heichal.js's set(false) then takes the camera out of the closed chambers), and the chambers' door
        ["היציע — התאים", [
          { t: "היציע והתאים", view: "heichalSouth", key: "heichalSouth" },
          { t: "חתך היציע", view: "yatziaSection", cardSide: "left",   // the cut stands where the card beside the panel would hide it for its 15 seconds
            feature: { key: "yatziaSection", isOn: () => !!(ctx.shared.yatziaSection && ctx.shared.yatziaSection.on),
              on: () => feat.section(), off: () => { const s = ctx.shared.yatziaSection; if (s && typeof s.set === "function") s.set(false); } },
            info: "הפסוק: 'היציע התחתנה חמש באמה רחבה והתיכנה שש באמה רחבה והשלישית שבע באמה רחבה כי מגרעות נתן לבית סביב חוצה לבלתי אחז בקירות הבית' (מלכים א ו, ו).\nרש״י: 'קומת התא חמש אמות, וכשעולה כתל ההיכל חמש אמות, גורע את עביו, וכנס בו אמה לפנים, והניח על אותה כניסה ראשי קורות גג עלית התא, שהיא קרקעית לאמצעית', ומסיים: 'נמצאת אמצעית רחבה מן התחתונה אמה, והעליונה רחבה מן התיכונה אמה'; וכל קומה חמש אמות — 'הרי גבהן חמש עשרה אמות, לבד עבי התקרה' (רש״י ו, י).\nמצודת דוד: 'וכן פחתו אמה בכלות חמשה עשר אמות, להניח על כניסת האמה קורות תקרת השלישים'.\nבמודל — בחתך, מול פניו: כל קומה בצבע משלה — התחתונה כחול, התיכונה ירוק, השלישית כתום, והכותל שמעל גג התאים סגול — רצועת כותל הבית והתא שלידה באותו צבע: **כותל 7 ותא 5, כותל 6 ותא 6, כותל 5 ותא 7**; מה שהכותל נכנס — התא מתרחב, וכותל התא (חמש אמות, 'וכתל התא חמש', מדות ד, ז) עולה ישר. המגרעות, אמה בכל קומה, בצהוב, וראשי קורות הארז מונחים עליהן. החתך עובר בקצהו המזרחי של התא האמצעי שבדרום, ומאחוריו נראים הלולים. הכפתור מסובב את המבט אל החתך, והחתך נסגר לבד אחרי 15 שניות (או ב'הסתר את החתך' שעל המודל); הצבעים והמקרא — בחירת מודל; עובי הקורות, אמה — בחירת מודל.",
            refs: [["מלכים א ו, ו", V(10, 6, 6)], ["ו, י", V(10, 6, 10)], ["רש״י ו, ו", V(10, 6, 6)], ["רש״י ו, י", V(10, 6, 10)], ["מדות ד, ז", MI(4, 7)]] },
          // 1.0.1-K (K.2): the chambers' only outside door, from the terrace (flyPoints.yatziaDoor; the 1.0.1 target z 26 is inside the new wall)
          { t: "פתח התאים והלולים", view: "yatziaDoor",
            info: "הפסוק: 'פתח הצלע התיכנה אל כתף הבית הימנית ובלולים יעלו על התיכנה ומן התיכנה אל השלשים' (מלכים א ו, ח).\nרש״י והתרגום: 'שבחמש תאים שבדרום היה לה פתח אל החוץ בשורה התחתונה', 'ודרך אותו פתח נכנסים לכלם'. רד״ק ומצודות: הקומה התיכונה.\nלכל תא שלושה פתחים — 'אחד לתא מן הימין, ואחד לתא מן השמאל, ואחד לתא שעל גביו' (רש״י ממדות ד, ג). לולים — 'בנין עמוד אבנים עשוי מעלות מעלות, וההולך בהן דומה כמקיף סביבות עמוד' (רש״י).\nבמודל: מעל הפתח רצועת ראשי קורות הגג, כציור הספר; מידות הפתח (שתיים וחצי על שלוש וחצי) — בחירת מודל.",
            refs: [["מלכים א ו, ח", V(10, 6, 8)], ["רש״י ו, ח", { book: 3673, index: 226 }], ["מדות ד, ג", MI(4, 3)]] },   // 1.3.4: Rashi's own line (was the verse's)
          // 1.3.4: the walk up the lulim (50-heichal.js ctx.shared.lulimDemo; a button by the door too)
          { t: "הליכה בלולים — הדגמה", action: () => { const L = ctx.shared.lulimDemo; if (typeof L === "function") L(); },
            info: "לשון הכתוב (מלכים א ו, ח): ״פתח הצלע התיכנה אל כתף הבית הימנית, ובלולים יעלו על התיכנה, ומן התיכנה אל השלשים״.\n**רש״י:** ״שאחד מן התחתונים שבכותל דרומי, היה לו פתח אל החוץ, ודרך אותו פתח נכנסים לכולם״; ״בלולים — תרגם יונתן: מסבתא... והוא בנין עמוד אבנים עשוי מעלות מעלות, וההולך בהן דומה כמקיף סביבות עמוד, ועולין בו כמה וכמה אמות גבוה, ואין צריך לשפע כשאר סלם, כי הקיפו הוא שפוע״; ״אל השלשים — כמו אל השלישים״.\nההדגמה: בגובה העיניים — מן החצר, דרך הפתח שבתא האמצעי של השורה התחתונה בדרום, עד הלולים. בעלייה נפתח חתך היציע, והעין עולה בלולים עצמם, סביב העמוד, אחרי העולה, המסומן באור בצבע צף: סיבוב אחד אל הקומה האמצעית, וסיבוב נוסף אל השלישית. בסוף העין יוצאת אל החתך, והחתך נסגר.\nבקצרה — ״הצלע התיכנה״: לרש״י ולתרגום — האמצעי בחמשת התאים שבדרום, בשורה התחתונה (כך במודל); לרד״ק ולמצודות — הקומה התיכונה. ההדגמה בשיטת רש״י ליציע (ברירת המחדל); בשיטת הרמב״ם (המתג ״צורת היציע״) הלולים אינם מצוירים, וההדגמה מחזירה לשיטת רש״י.\nמקום העמוד בתוך התא, מספר המעלות וגובה העין — בחירת מודל.",
            refs: [["מלכים א ו, ח", V(10, 6, 8)], ["רש״י ו, ח", { book: 3673, index: 226 }], ["רש״י ו, ח — בלולים", { book: 3673, index: 228 }]] }
        ]],
        ["הבית מבפנים", [
          { t: "פתח ההיכל ודלתותיו", view: "heichalDoor",
            tourThen: [{ cam: [-20, 22, -7], tg: [-0.5, 21, 2] }, { cam: [-30, 23, 5], tg: [-0.5, 22, 0] }],   // TOUR_FIX_137: the doorway and its doors from inside
            // 1.0.1-H review (sources): "שני צלעים" = two boards is MALBIM's (Rashi/Targum: two pivots); "גלילים" per Radak/Metzudot/Ralbag is a
            // painted design on both faces. 1.0.1-K (review Q2-2, checked in the library): "הפותות" (7:50) = the pivots for the Targum (as Radak
            // reads it) and Radak; for Ralbag and Metzudat Zion the socket the pivot enters (Kelim 11:2 "והפותה שתחת הציר"); for Rashi keys
            info: "הפסוק: 'וכן עשה לפתח ההיכל מזוזות עצי שמן מאת רבעית' (מלכים א ו, לג) — מזוזות מרובעות (רש״י, תרגום). 'ושתי דלתות עצי ברושים, שני צלעים הדלת האחת גלילים' (ו, לד): כל דלת כחצי רוחב הפתח (רש״י).\n'שני צלעים' — לפי התרגום ורש״י שני צירים לכל דלת, 'ציר העליון וציר התחתון', ו'גלילים' — 'סגלגלין', עגולים; לפי מלבי״ם — 'שני לוחות'; לפי רד״ק, מצודות ורלב״ג — שני צדי הדלת מצוירים 'מעשה גלילים' (מצודות: 'אופנים'; רלב״ג: 'גלילים ועמודים') — ציור זה לא נבנה.\nהדלתות מגולפות כרובים, תמורות ופטורי ציצים ומצופות זהב 'מישר על המחקה' (ו, לה) — הגילוף במודל כטקסטורה על שני פני כל לוח.\n'והפתות לדלתות הבית' (ז, נ): לרש״י — מפתחות ('מפתחות, שמעתי. שמפתחין בהם את המנעול'), וכך **ברירת המחדל במודל: מפתח של זהב במנעול הדלת הצפונית**; לתרגום ולרד״ק — צירי הדלתות; לרלב״ג ולמצודת ציון — מה שהציר נכנס בו ('והפותה שתחת הציר', משנה כלים יא, ב). הצירים של זהב שבמודל — לשני הפירושים האחרונים; הבחירה — במתג 'הפותות' שבתפריט, תחת ״שיטות ומחלוקות״.\nבמודל: כל דלת שני לוחות (כמלבי״ם), מקופלים אל דפנות הפתח כדי שהמעבר יהיה פנוי; מידות הפתח — בחירת מודל.",
            refs: [["מלכים א ו, לג", V(10, 6, 33)], ["ו, לד", V(10, 6, 34)], ["רש״י ו, לד", V(10, 6, 34)], ["ו, לה", V(10, 6, 35)], ["ז, נ", V(10, 7, 50)], ["משנה כלים יא, ב", MN(91, 11, 2)]] },
          // 1.3.3 (the user's list): the doors shut, the key of gold turns (Rashi's reading of "והפתות"), and they open with the sound of heavy
          // doors - ctx.shared.heichalDoors (55-interior.js), which flies to its own camera
          { t: "פתיחת דלתות ההיכל — הדגמה", action: () => { const D = ctx.shared.heichalDoors; if (D && typeof D.demo === "function") D.demo(true); },
            info: "ההדגמה: שתי הדלתות סגורות על הפתח, ומפתח של זהב מסתובב במנעול הדלת הצפונית — ״והפתות לדלתות הבית הפנימי לקדש הקדשים לדלתי הבית להיכל זהב״ (מלכים א ז, נ). אחר כך הדלתות נפתחות לאט לתוך הבית, עם קול של דלת כבדה.\nרש״י: ״והפתות. מפתחות, שמעתי. שמפתחין בהם את המנעול״.\nהצירים: ״ושתי דלתות עצי ברושים שני צלעים הדלת האחת גלילים ושני קלעים הדלת השנית גלילים״ (מלכים א ו, לד); רש״י: ״שני צלעים. תרגם יונתן: תרין צירין, ציר העליון, וציר התחתון״ — הדלתות סובבות על צירים.\nבמודל: **המפתח מוצג רק בשיטת רש״י** (המתג ״הפותות״ שבתפריט, תחת ״שיטות ומחלוקות״). דלתות הדביר אינן נסגרות בהדגמה: הן עמדו פתוחות, ועליהן הפרוכת (רש״י ורד״ק בדברי הימים ב ג, יד — בכרטיס ״פתח הדביר״). הקול נוצר בתוסף עצמו, בלי קובץ; מקום המנעול, צורת המפתח והזמנים — בחירת מודל.",
            refs: [["מלכים א ז, נ", V(10, 7, 50)], ["רש״י ז, נ", { book: 3673, index: 468 }], ["מלכים א ו, לד", V(10, 6, 34)], ["רש״י ו, לד", { book: 3673, index: 300 }]] },
          { t: "ההיכל", view: "kodesh", key: "kodesh" }, // 1.0.1: "ההיכל" is this room (I Kings 6:17, the user)
          // 1.3.5 (the user, of the kuntres "בגדרי ודיני צורת הבית": "חובה לשנות"; "צריך מתג ומבט שיראה את זה"): THE SLOPING FLOOR, shown - the house
          // cut along its length (the live section, z 0) for the feature's 15 seconds, the eye in the south; 55-interior.js builds the slope
          { t: "שיפוע רצפת הבית", tg: [-33, 23, 0], cam: [-33, 24, 58],
            // SECTION_HOLD_205 (1.3.8): no 15-second timer of the panel on this one (timed: false) - the section's own clock closes it, and
            // that clock waits while the eye stands in the cut half (90-entry.js); another place closes it at once (closeAuto)
            feature: { key: "houseSlopeView", timed: false, isOn: () => !!(ctx.shared.section && ctx.shared.section.on),
              on: () => { try { setCutaway(false); ctx.shared.sectionFor("z", 0, 15000); } catch (_) {} },
              off: () => { try { if (ctx.shared.closeAuto) ctx.shared.closeAuto(); } catch (_) {} } },
            info: "רש״י (מנחות צט.): 'כתלמיד היושב לפני רבו — נמוך הימנו, כך אותם של שלמה נמוכין משל משה, דבית המקדש היה משופע, ולצד מערב מגביה יותר'; 'ומיתתי ליה פורתא — מושיבם לצד מזרח במקום נמוך'.\nולעומתו — הרמב״ם (בית הבחירה ו, ד): 'והאולם וההיכל כלו בשוה'; כפתור ופרח: 'והאולם וההיכל הכל שוה ובמישור'; תורת העולה (חלק א, פרק ז): 'עד שהגיעו לאולם שהיה עם ההיכל בשוה במישור ההר'.\nבמודל — שתי שיטות (בתפריט, תחת ״שיטות ומחלוקות״: ״רצפת ההיכל — משופעת או שטוחה״): **ברירת המחדל בבית ראשון — משופעת**, כרש״י: רצפת ההיכל והדביר עולה מן הפתח אל המערב ארבע אמות, והכלים, הארון והכרובים עומדים עליה; או שטוחה, כרמב״ם. שיעור השיפוע לא נתפרש — בחירת מודל. בלחיצה כאן הבית נחתך לאורכו ל־15 שניות, והמבט מן הדרום.",
            refs: [["מנחות צט.", P(131, "צט.")], ["רש״י מנחות צט.", { book: 2186, index: 4703 }], ["רמב״ם בית הבחירה ו, ד", { book: 337, index: 97 }], ["כפתור ופרח פרק ו", { book: 7576, index: 244 }], ["תורת העולה א, ז", { book: 3167, index: 298 }]] },   // SLOPE2_D (fix-d, 145)
          // 1.0.1-K (K.5): the carvings redrawn after the book - the default look of every wall and door
          { t: "גילופי הקירות — כרובים, תמורות, פטורי ציצים, פקעים", view: "carvings",
            info: "הפסוקים: 'ואת כל קירות הבית מסב קלע פתוחי מקלעות כרובים ותמרת ופטורי צצים מלפנים ולחיצון' (מלכים א ו, כט) — רש״י: 'לבית הכפרת הפנימי ולהיכל החיצון'; 'וארז אל הבית פנימה מקלעת פקעים ופטורי צצים' (ו, יח); 'ויעל עליו תמרים ושרשרת' (דברי הימים ב ג, ה).\nהמפרשים: מקלעת — 'קלוע היה בציורי קליעות' (רש״י ו, יח), ציור 'כעין שרשרת' הממלא את המקום 'בין ציור לציור כדי שלא יהיה חלק בינתים' (רש״י דברי הימים ב ג, ה); פטורי — 'לשון חבלים', ציצים — 'לשון פרחים' (רש״י), 'פתוחים דמות ציצים ופרחים' (רד״ק); פקעים — 'כמין כפתורים' (רש״י; תרגום: 'ביעין'); תמרות — 'צורת תמרים' (רד״ק); השרשרות — 'צורת שלשלאות' (רש״י); והכרובים בפני ילד — 'תבנית ילדים וילדות' (רש״י דברי הימים ב ג, י).\nהזהב: 'שוקע בו במקום החקק, ובולט על הבליטה' (רש״י ו, לב), ורד״ק (ו, כט): 'מפותחים לא שהיו בולטין' — הצורות חלקות ושוות לפני הקיר, והרקע הקלוע וקווי המתאר חקוקים.\nבמודל, כציור הספר: בכל שורה של עשר אמות — חבל שזור, זוגות כרובים בגלימות ארוכות בלי ידיים תחת קשת כנפיהם ושושנים ביניהם, פקע, שושנים ושלוש שרשרות תלויות, ודקל גבוה בין כל שני זוגות; **שלוש שורות בהיכל, שתיים בדביר ושתיים על כל דלת**. הספר עצמו מציין שסדר העיטורים להמחשה בלבד — הסידור והגדלים בחירת מודל. זה מראה הקירות כברירת מחדל; השכבות שמתחת לזהב — בכפתור 'הצג את שכבות הקיר והרצפה'.",
            refs: [["מלכים א ו, כט", V(10, 6, 29)], ["ו, יח", V(10, 6, 18)], ["ו, לב", V(10, 6, 32)], ["ו, לה", V(10, 6, 35)], ["דברי הימים ב ג, ה", V(39, 3, 5)], ["חגיגה יג:", P(114, "יג:")]] },
          // 1.0.1-K (K.5.3, the addendum D): the wall and floor layers - an OPTION; the default stays all gold. 1.0.1-L (L.14 / L.31; interior.md):
          // the window near the entrance ("קח את זה קצת יותר לכיוון פתח ההיכל"), sharp carved cedar; the place switches it on for 15 s (L.27)
          { t: "שכבות הקיר והרצפה — אבן, ארז וזהב", view: "wallLayers",
            feature: { key: "wallLayers", isOn: () => !!(ctx.shared.wallLayers && ctx.shared.wallLayers.on),
              on: () => feat.wallLayers(), off: () => { const w = ctx.shared.wallLayers; if (w && typeof w.set === "function") w.set(false); } },
            info: "הבית — 'אבן שלמה מסע נבנה' (מלכים א ו, ז); קירותיו מבפנים 'בצלעות ארזים מקרקע הבית עד קירות הספן' (ו, טו), מגולפים — 'וארז אל הבית פנימה מקלעת פקעים ופטורי צצים הכל ארז אין אבן נראה' (ו, יח) — ומצופים זהב (ו, כא–כב).\nלמה הארז? רש״י (ו, טו): 'קירות ארז אצל קיר האבן, כדי לטוח עליו זהב... ואי אפשר לטוח זהב על גבי האבנים, כי אם בעצים ובמסמרות'.\nהרצפה: אבן, עליה 'צלעות ברושים' (ו, טו), ועליהן זהב — 'ואת קרקע הבית צפה זהב לפנימה ולחיצון' (ו, ל; רש״י: 'לבית הכפרת ולהיכל'; מצודת דוד: 'על רצפת צלעות הברושים').\nבמודל — אפשרות תצוגה בלבד, כציור הספר: חלון מדורג בקיר הצפוני של ההיכל, סמוך לפתח ההיכל, וברצפה שלפניו — הזהב נחתך במדרגות, הארז המגולף מתחתיו (לוחות ארז זקופים, אמה רוחבם, והגילוף חקוק בהם) ואבן הבית מאחוריו. **בבית עצמו הכל זהב** — 'הכל ארז אין אבן נראה' (ו, יח), 'ואת כל הבית צפה זהב' (ו, כב) — וכך המודל כברירת מחדל. הכפתור פותח את החלון וחוזר לבד אחרי 15 שניות; 'הצג את שכבות הקיר והרצפה' שעל הקיר משאיר אותו פתוח. מקום החלון, מדרגותיו ועובי השכבות — בחירת מודל.",
            refs: [["מלכים א ו, ז", V(10, 6, 7)], ["ו, טו", V(10, 6, 15)], ["ו, יח", V(10, 6, 18)], ["ו, כא", V(10, 6, 21)], ["ו, כב", V(10, 6, 22)], ["ו, ל", V(10, 6, 30)]] },
          { t: "רצפת הבית — ברושים מצופים זהב", tg: [-21, 12.1, 3], cam: [-9, 16.5, 7.5],   // inside the closed kodesh (x -3.5..-43.5, |z| < 10), looking down at the floor
            info: "הפסוקים: 'ויצף את קרקע הבית בצלעות ברושים' (מלכים א ו, טו); 'ואת קרקע הבית צפה זהב לפנימה ולחיצון' (ו, ל). רש״י: 'לבית הכפרת ולהיכל'; מצודת דוד: 'על רצפת צלעות הברושים'.\nבמודל: **רצפת ההיכל והדביר זהב על לוחות ברוש**, אמה רוחב כל לוח לאורך הבית, והחריצים ביניהם נראים קלות — בחירת מודל. השכבות עצמן (אבן, ברוש וזהב) — בכפתור 'הצג את שכבות הקיר והרצפה' שבהיכל.\nבקצרה — עוד שיטות: מלבי״ם (דברי הימים ב ג, ה) כותב שרצפת הדביר הייתה זהב בלי ברושים, ורלב״ג מפרש את 'צלעות' הרצפה כקורות — לא נבנו.",
            refs: [["מלכים א ו, טו", V(10, 6, 15)], ["ו, ל", V(10, 6, 30)], ["דברי הימים ב ג, ה", V(39, 3, 5)]] },
          // 1.3.5 (the user, 22:12: "פשפשים וכו להוסיף"): the slab of the sotah's dust (55-interior.js)
          { t: "טבלת השיש — עפר הסוטה", tg: [-7, 12.35, -7.4], cam: [-4.4, 15.2, -3.6],
            info: "לשון המשנה (סוטה ב, ב): 'נכנס להיכל ופנה לימינו, ומקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה. וכשהוא מגביהה, נוטל עפר מתחתיה ונותן כדי שיראה על המים'.\nרש״י (סוטה טו:): 'טבעת קבועה בה — לאחזה בטבעתה ולהגביהה מבין הרצפה, שהיא כולה באבני שיש'.\nבמודל: טבלה של אמה על אמה ובה טבעת, ברצפת ההיכל, לימין הנכנס — בצפון, סמוך לפתח. רש״י מתאר רצפה של אבני שיש; כאן רצפת הבית ברושים מצופים זהב (מלכים א ו, טו; ו, ל).\nעפר מקרקע ההיכל — גם בבית ראשון: בגמרא (סוטה טו:–טז.): ״׳בקרקע המשכן׳, איסי בן יהודה אומר: להביא קרקע שילה נוב וגבעון ובית עולמים״. הטבלה עצמה — במשנה, בבית שני; מקומה המדויק וצורת הטבעת — בחירת מודל.",
            refs: [["משנה סוטה ב, ב", { book: 67, index: 13 }], ["רש״י סוטה טו:", { book: 2172, index: 851 }], ["סוטה טו:", { book: 119, index: 576 }], ["סוטה טז.", { book: 119, index: 578 }], ["מלכים א ו, טו", V(10, 6, 15)], ["ו, ל", V(10, 6, 30)]] },   // fix-d (26): Sotah 15b-16a, "ובית עולמים"
          // 1.0.1-H: one place for the vessels' arrangement; the two layouts and the lighting opinions are chosen in the opinions table
          { t: "סידור הכלים — עשר המנורות ועשרה השולחנות (מנחות צח:–צט.)", tg: [-34, 16, 0], cam: [-14, 36, 4],
            info: "בגמרא — מנחות צח:: רבי — השולחנות והמנורות מזרח ומערב (אורכם לאורך הבית); רבי אלעזר ברבי שמעון — צפון ודרום.\nהמוסכם: כולם בחצי הפנימי של ההיכל, השולחנות בצפון והמנורות בדרום — 'של משה באמצע, חמשה מימינו, וחמשה משמאלו' (צח:); לרבי שולחן משה ומנורתו בראש השורות, 'כתלמיד היושב לפני רבו' (צט.).\nרלב״ג: המנורות משוכות מערבה מן השולחנות — 'ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות' (מלכים א ז, מט), וכציור הספר; השיעור, אמה אחת — בחירת מודל.\nבקצרה — עוד מחלוקת: מנחות צט. — לתנא קמא הדליקו וסידרו לחם רק בשל משה, ולרבי אלעזר בן שמוע — בכולן. את השיטה בוחרים בתפריט, תחת ״שיטות ומחלוקות״.",
            refs: [["רלב״ג ז, מט", { book: 3645, index: 312 }], ["מנחות צח:", P(131, "צח:")], ["מנחות צט.", P(131, "צט.")], ["רמב״ם בית הבחירה ג, יב", RB(3, 12)], ["מלכים א ז, מט", V(10, 7, 49)]] },
          // 1.0.1-L (L.70, L.71, L.73; interior.md): Moses' menorah between 5 and 5, every cup / knob / flower of the Mishkan's menorah
          // (22 / 11 / 9), the stone of three steps before each menorah, the menorot one amah west of the tables
          { t: "מנורת משה ועשר המנורות", view: "menorot",
            info: "הפסוק: 'ואת המנרות חמש מימין וחמש משמאול לפני הדביר זהב סגור' (מלכים א ז, מט; דברי הימים ב ד, ז).\nמקומן: לפי מנחות צח: ורש״י — 'של משה באמצע, חמשה מימינה, וחמשה משמאלה', וכולן בדרום ההיכל, בחצי הפנימי. לרבי — מנורת משה בראש שתי השורות של חמש, ראשה מול האוויר שביניהן ('כתלמיד היושב לפני רבו', מנחות צט.); לר׳ אלעזר בר׳ שמעון — שתי אמות ומחצה מכותל צפון (תוספות מנחות צח:), וארכו לאורך הבית (מאירי יומא נא:).\nצורתן: גובה המנורה שלוש אמות — 'גובהה של מנורה שמנה עשר טפחים' (מנחות כח:) — וכל אחת עם כל גביעיה, כפתוריה ופרחיה כמנורת המשכן (שמות כה, לא–לו): 'הרגלים והפרח שלשה טפחים, וטפחיים חלק, וטפח שבו גביע וכפתור ופרח, וטפחיים חלק, וטפח כפתור. ושני קנים יוצאין ממנו, אחד אילך ואחד אילך, ונמשכין ועולין כנגד גובהה של מנורה' — וכן השניים הבאים — 'נשתיירו שם שלשה טפחים שבהן שלשה גביעין וכפתור ופרח'; 'ונמצאו גביעין עשרים ושנים, כפתורים אחד עשר, פרחים תשעה' (מנחות כח:). הפרח שבקנה האמצעי למטה — רש״י (שמות כה, לה): 'הרגלים והפרח שלשה טפחים – הוא הפרח האמור בירך, שנאמר עד ירכה עד פרחה'; והפרח שבכל קנה — 'כפתר ופרח. היה לכל קנה וקנה' (רש״י כה, לג); הקנים נמשכים ועולים ישר, כציור הספר.\nהאבן: לפני כל מנורה אבן של שלוש מעלות — 'ואבן היתה לפני המנורה ובה שלש מעלות, שעליה הכהן עומד ומטיב את הנרות' (משנה תמיד ג, ט; רמב״ם בית הבחירה ג, יא) — מלשון 'העלאה' שבתורה: רש״י (במדבר ח, ב): 'ועוד דרשו רבותינו מכאן שמעלה היתה לפני המנורה, שעליה הכהן עומד ומטיב (ספרי)'; ברטנורא: 'ובה שלש מעלות. כנגד שלש העלאות שכתובות במנורה, בהעלתך את הנרות, והעלה את נרתיה, להעלת נר תמיד' — השלישית בתצוה (שמות כז, כ). צד האבן — מעשי למלך (על הרמב״ם ג, יא), לנרות מזרח ומערב: 'א\"כ אבן זה לצד צפון הי' עומד דמנורה בדרום ושולחן בצפון ע\"כ אבן זה הי' עומד בצפון המנורה'; ובשם היעב\"ץ שם, לנרות צפון ודרום: 'א\"כ אבן זו לצד מערב המנורה עומדת'.\nרלב״ג: המנורות משוכות מערבה מן השולחנות — 'הנה מפני שהשולחנות הם גם כן לפני הדביר ולא זכר זה אלא במנורות ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות' (מלכים א ז, מט), וכציור הספר.\nפי הנרות: לרבי, שהנרות ממזרח למערב (ברירת המחדל) — כציור הרמב״ם בפירוש המשנה (תמיד ג, ט): ״ופיות כל הנרות לצד מערב זה לאחור זה״. לר׳ אלעזר בר׳ שמעון, שהנרות מצפון לדרום — ״מלמד שהיו מצדדין פניהם כלפי נר אמצעי״ (מנחות צח:), ורש״י שם: ״אמצעי שפי הפתילה כלפי מערב ושאר הפתילות מצודדות פיהן כלפי האמצעי״. צורת פי הנר — בחירת מודל.\nבמודל: **האבן לרבי צפונית למנורה (וכציור הספר), לר׳ אלעזר בר׳ שמעון מערבית לה**. השיעור שהמנורות משוכות, אמה אחת, מידות האבן וצורת העיטורים — בחירת מודל.",
            refs: [["מעשי למלך ג, יא", { book: 4304, index: 89 }], ["רלב״ג ז, מט", { book: 3645, index: 312 }], ["מלכים א ז, מט", V(10, 7, 49)], ["דברי הימים ב ד, ז", V(39, 4, 7)], ["פירוש המשניות לרמב״ם תמיד ג, ט", { book: 575, index: 40 }], ["רש״י מנחות צח:", { book: 2186, index: 4687 }], ["מנחות צח:", P(131, "צח:")], ["מנחות צט.", P(131, "צט.")], ["מנחות כח:", P(131, "כח:")], ["שמות כה, לא", V(2, 25, 31)], ["רש״י שמות כה, לה", V(2, 25, 35)], ["משנה תמיד ג, ט", MN(88, 3, 9)], ["רמב״ם בית הבחירה ג, יא", RB(3, 11)], ["ג, י", RB(3, 10)], ["רש״י במדבר ח, ב", { book: 3693, index: 382 }], ["שמות כז, כ", V(2, 27, 20)], ["יומא לג:", P(107, "לג:")]] },
          // 1.0.1-K (K.4; the user: "שלחנות, חייבים תיקון משמעותי"): the tables rebuilt - the row (flyPoints.shulchanot) and Moses' table close.
          // 1.0.1-L (L.46, the user: "למיטב ידיעתי הם היו כשלחן משה"; L.70): all ten in the FORM of Moses' table; Moses' table at the rows' head
          // for Rabbi per Menachot 99a (the user: "כגמרא, בראש השורות"), in the middle of the columns for R. Elazar b. R. Shimon
          { t: "שולחן משה ועשרה השולחנות", view: "shulchanot",
            info: "הפסוק: 'ויעש שלחנות עשרה וינח בהיכל חמשה מימין וחמשה משמאול' (דברי הימים ב ד, ח; מלכים א ז, מח).\nמקומם: לפי מנחות צח: — 'של משה באמצע, חמשה מימינו, וחמשה משמאלו' (רש״י: 'חמשה מימינו - בדרומו וחמשה משמאלו בצפונו וכולן בצפון ההיכל'). לרבי (מזרח ומערב) הגמרא (צט.) עצמה דוחה אמצע ממש — אין מקום לשתי שורות ושולחן ביניהן ברוחב עשר אמות — ומשיבה: 'מי סברת שלחן דמשה בהדייהו הוה יתיב? לא, דמידלי ליה, ומנח ליה, ומיתתי להו לדידהו פורתא, כתלמיד היושב לפני רבו' (רש״י: 'משוך לצד מערב וראשו מכוון כנגד אויר שבין שתי השורות'). לר׳ אלעזר בר׳ שמעון (צפון ודרום) — 'בשלמא למאן דאמר צפון ודרום, שפיר': שולחן משה בין שני הטורים ובאמצע אורכם.\nבמודל, כגמרא: **שולחן משה בראש שתי השורות של חמש**, ראשו מול האוויר שביניהן. כל אחד מעשרת השולחנות בתבנית שולחן משה — הסניפין, הקנים והבזיכין על כולם (כציור הספר) — 'אמתים ארכו ואמה רחבו ואמה וחצי קמתו' (שמות כה, כג), ומסגרת טפח עם זר זהב (כה, כד–כה); מידות שולחנות שלמה אינן בפסוקים — בחירת מודל.\nהלחם — שתי מערכות של שש חלות (ויקרא כד, ו) — על שולחן משה תמיד, ועל עשרת השולחנות רק לרבי אלעזר בן שמוע (מנחות צט.: 'על כולם היו מסדרין'; ורש״י שם: 'פעמים בזה פעמים בזה' — במודל על כולם יחד); לתנא קמא הם עומדים בלא לחם (בתפריט, תחת ״שיטות ומחלוקות״). ראו 'שולחן משה מקרוב'.",
            refs: [["דברי הימים ב ד, ח", V(39, 4, 8)], ["מלכים א ז, מח", V(10, 7, 48)], ["שמות כה, כג", V(2, 25, 23)], ["מנחות צח:", P(131, "צח:")], ["מנחות צט.", P(131, "צט.")], ["ויקרא כד, ו", V(3, 24, 6)]] },
          { t: "שולחן משה מקרוב — הלחם, הסניפין והקנים", view: "shulchanMoshe",
            info: "השולחן — 'אמתים ארכו ואמה רחבו ואמה וחצי קמתו' (שמות כה, כג; רש״י: 'גבה רגליו עם עבי השלחן'), ו'מסגרת טפח סביב' עם 'זר זהב' (כה, כד–כה); רש״י מביא שתי דעות במסגרת, והספר מצייר אותה מתחת לדף — 'ודף השלחן שוכב על אותה מסגרת'.\nהלחם — 'שתים מערכות שש המערכת' (ויקרא כד, ו); 'לחם הפנים, ארכן עשרה ורחבן חמשה, וקרנותיו שבע אצבעות' (משנה מנחות יא, ד), צורתו — במחלוקת: 'רבי חנינא אמר: כמין תיבה פרוצה. רבי יוחנן אמר: כמין ספינה רוקדת' (מנחות צד:; המתג 'צורת לחם הפנים'). רבי מאיר (משנה יא, ה): 'השלחן ארכו שנים עשר ורחבו ששה... נותן ארכו כנגד רחבו של שלחן, וכופל טפחים מכאן וטפחים מכאן וטפחים רוח באמצע' (ולרבי יהודה שם: 'השלחן, ארכו עשרה, ורחבו חמשה... וכופל טפחים ומחצה מכאן וטפחים ומחצה מכאן, נמצא ארכו ממלא כל רחבו של שלחן'); ושם אבא שאול: 'שם היו נותנין שני בזיכי לבונה של לחם הפנים'.\nהסניפין והקנים: 'ארבעה סניפין של זהב היו שם, מפצלין מראשיהן... שנים לסדר זה ושנים לסדר זה. ועשרים ושמנה קנים, כחצי קנה חלול' (משנה יא, ו). רש״י: הסניפין 'עומדין בארץ וגבוהים עד למעלה מן השלחן הרבה, כנגד גבה מערכת הלחם, ומפצלים חמשה פצולים' (רש״י שמות כה, כט); ובגמרא: 'לדברי האומר כמין ספינה רוקדת — סניפין על גבי שלחן מונחין, לדברי האומר כמין תיבה פרוצה — סניפין על גבי קרקע מונחין' (מנחות צד:). הקנים שלושה תחת כל חלה ושניים תחת העליונה — 'התחתונה אינה צריכה כל עיקר' (מנחות צז.).\nבמודל: צורת החלות ומקום הסניפין — לפי המתג 'צורת לחם הפנים' (ברירת המחדל: רבי יוחנן — ספינה רוקדת, והסניפין על השולחן); צורת הסניפין, הבזיכין והקנים — כציור הספר, בחירת מודל; **כל אחד מעשרת השולחנות בתבנית זו** (הלחם — לפי המתג 'הדלקת המנורות וסידור הלחם'). המבט לאורך השולחן מקצהו.",
            refs: [["שמות כה, כג", V(2, 25, 23)], ["כה, כה", V(2, 25, 25)], ["כה, כט", V(2, 25, 29)], ["ויקרא כד, ו", V(3, 24, 6)], ["משנה מנחות יא, ד", MN(81, 11, 4)], ["יא, ה", MN(81, 11, 5)], ["יא, ו", MN(81, 11, 6)], ["מנחות צד:", P(131, "צד:")], ["מנחות צז.", P(131, "צז.")]] },
          // 1.0.1-K (K.4 / K.5): the golden altar (flyPoints.incenseAltar follows the kodesh layout), its smoke and its layers. 1.0.1-L (L.13 the
          // height ONE amah, the horns within it; L.52 / L.69 the place: the sources in interior.md ANSWERS, the user's decision "יותר קרוב
          // לאולם מיד אחרי השולחנות והמנורות")
          { t: "מזבח הזהב", view: "incenseAltar",
            tourThen: [{ cam: [-23.5, 16.2, 3.2], tg: [-28, 14.6, 0] }],   // TOUR_FIX_137: the whole altar
            // 1.3.7: the button "שכבות מזבח הזהב" merged into this one (UI_MERGE) - its feature opens from here: the layers for 15 seconds
            feature: { key: "incenseAltar.layers", isOn: () => !!(ctx.shared.incenseAltar && ctx.shared.incenseAltar.layers && ctx.shared.incenseAltar.layers.on),
              on: () => feat.altarLayers(), off: () => { const a = ctx.shared.incenseAltar; if (a && a.layers && typeof a.layers.set === "function") a.layers.set(false); } },
            info: "הפסוקים: 'ויצף מזבח ארז' (מלכים א ו, כ) — רש״י: 'הוא מזבח הקטרת'; 'וכל המזבח אשר לדביר צפה זהב' (ו, כב); 'את מזבח הזהב' (ז, מח).\nהמפרשים: מצודת דוד (ו, כ) — 'ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב'; רלב״ג (ו, כב) — 'צפה מזבח הקטרת באבנים וצפהו עצי ארז כמו שעשה בקירות הבית... ואחר כן צפה אותם זהב'; רד״ק — 'ואפשר שהיה מאבנים'.\nמידתו — 'אמה על אמה' (רמב״ם בית הבחירה ג, יז) ו'אמתים קמתו' (שמות ל, ב): 'ממנו קרנתיו' — הקרנות בתוך האמתיים, וזר הזהב סביב גגו (ל, ג; רש״י: 'סימן הוא לכתר כהנה'). הגובה — הר המוריה (על הרמב״ם שם): 'יש לתמוה למה לא כתב גובה קומתו שהיו ב׳ אמות כמבואר בזבחים נ״ט ב׳' (זבחים נט:: 'ורבי יוסי, כי גמר גזירה שוה – בגובהה הוא דגמיר'). צורת הקרנות והזר — בחירת מודל.\nורוחבו — שתי שיטות (בתפריט, תחת ״שיטות ומחלוקות״: ״מזבח הזהב — רוחבו״): אמה על אמה, כרמב״ם (ברירת המחדל); או שתיים על שתיים, כגר״א שמביא הר המוריה — 'וא״כ היה ב׳ אמות ארכו (ורחבו איני יודע כמה... משמע דהיה ב׳ על ב׳ וצ״ע)'.\nמקומו: במשכן נמסר מרחק — רש״י (שמות כו, לה): 'המזבח והשלחן והמנורה משוכים מן הפתח לצד מערב עשר אמות'; ברייתא דמלאכת המשכן: 'מן הקרשים שבמערב עד הפרוכת עשר אמות, מן הפרוכת עד השלחן חמש אמות, מן השלחן עד מזבח הזהב חמש אמות, ממזבח הזהב עד העמודים שבמזרח עשר אמות'. בבית לא נמסרה מידה במספרים: בין השולחן למנורה, מחצי הבית ולפנים ומשוך קמעא כלפי חוץ — 'וכי עייל להיכל — במזבח פגע ברישא... מזבח ממוצע ועומד באמצע ומשוך כלפי חוץ קימעא' (יומא לג:; רש״י: 'כלפי חוץ - כלפי מזרח לצד פתח ההיכל'); הרמב״ם: 'והוא נתון בהיכל מכון בין הצפון לדרום משוך בין השלחן והמנורה לחוץ. ושלשתן היו מנחין משליש ההיכל ולפנים כנגד הפרכת' (רמב״ם ג, יז). ולמה 'המזבח אשר לדביר'? רד״ק (ו, כב): 'סמך המזבח לדביר ואף על פי שלא היה בתוכו אלא בהיכל... ומזבח הקטרת ממוצע ביניהם ומשוך קמעא כלפי חוץ וזה מכוון כנגד פתח הדביר'.\nבמודל: **על ציר הבית, מיד מזרחית לשורות השולחנות והמנורות** (לרבי אמה מקצה השורות, לר׳ אלעזר בר׳ שמעון שלושת רבעי אמה — בחירת מודל). עליו גחלים, ועשן הקטורת עולה ישר עד התקרה — 'מתמר ועולה כמקל' (יומא לח.), 'עד שמגיע לשמי קורה' (יומא נג.), 'כתימרות עשן' (שיר השירים ג, ו; רש״י: 'על שם ענן הקטרת שהיה מתמר מעל מזבח הפנימי'); מוצג תמיד, כי הקטירו בכל בוקר ובין הערביים (שמות ל, ז–ח); עוביו — בחירת מודל. 'הצג את שכבות המזבח' שלפניו מראה את האבן, הארז והזהב.",
            refs: [["רש״י שמות כו, לה", { book: 3692, index: 1890 }], ["ברייתא דמלאכת המשכן א, יט", { book: 240, index: 2844 }], ["מלכים א ו, כ", V(10, 6, 20)], ["ו, כב", V(10, 6, 22)], ["רד״ק ו, כב", V(10, 6, 22)], ["ז, מח", V(10, 7, 48)], ["רמב״ם בית הבחירה ג, יז", RB(3, 17)], ["שמות ל, ב", V(2, 30, 2)], ["הר המוריה בית הבחירה ג, יז", { book: 5474, index: 167 }], ["זבחים נט:", { book: 130, index: 2049 }], ["ל, ג", V(2, 30, 3)], ["ל, ז", V(2, 30, 7)], ["יומא לג:", P(107, "לג:")], ["מנחות צח:", P(131, "צח:")], ["יומא לח.", P(107, "לח.")], ["יומא נג.", P(107, "נג.")], ["שיר השירים ג, ו", V(31, 3, 6)]] },
          { t: "שכבות מזבח הזהב — אבן, ארז וזהב", view: "incenseAltar",
            feature: { key: "incenseAltar.layers", isOn: () => !!(ctx.shared.incenseAltar && ctx.shared.incenseAltar.layers && ctx.shared.incenseAltar.layers.on),
              on: () => feat.altarLayers(), off: () => { const a = ctx.shared.incenseAltar; if (a && a.layers && typeof a.layers.set === "function") a.layers.set(false); } },
            info: "מזבח הזהב בשכבותיו, כקירות הבית.\nמצודת דוד (ו, כ): 'ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב, והיה אם כן מעשה המזבח דומה למעשה קירות הבית'. רלב״ג (ו, כב): 'צפה מזבח הקטרת באבנים וצפהו עצי ארז כמו שעשה בקירות הבית'. רד״ק (ו, כ): 'ואפשר שהיה מאבנים', והתרגום: 'נסרין דארזא'. והזהב — 'וכל המזבח אשר לדביר צפה זהב' (ו, כב), 'בכל ששת השטחים' (מצודת דוד).\nבמודל — אפשרות תצוגה בלבד: הזהב של מחצית הצד הדרומי העליונה מוסר, ונראים לוחות הארז ודרכם לב האבן; צורת החתך — בחירת מודל. הכפתור פותח את השכבות וחוזר לבד אחרי 15 שניות; 'הצג את שכבות המזבח' שעל המודל משאיר אותן פתוחות.",
            refs: [["מלכים א ו, כ", V(10, 6, 20)], ["ו, כב", V(10, 6, 22)]] },
          { t: "רתוקות הזהב", tg: [-43, 24, 0], cam: [-30, 26, 8], // target just before the traksin's kodesh face (x -43.5), outside the inKK box
            info: "הפסוק: 'ויעבר ברתיקות זהב לפני הדביר' (מלכים א ו, כא).\nרש״י, רד״ק ומצודת דוד: **בריחים של שלשלאות זהב על פני כותל אמה טרקסין** (וכן 'שרשרות בדביר', דברי הימים ב ג, טז). מלבי״ם: הרתוקות קבועות באבנים מתחת לציפוי.\nבמודל: מספרן וגובהן — בחירת מודל.",
            refs: [["מלכים א ו, כא", V(10, 6, 21)], ["דברי הימים ב ג, טז", V(39, 3, 16)]] },
          { t: "אמה טרקסין", view: "traksinTop", // 1.0.1-H: the wall above the doorway, from the heichal (the user: "חסר אמה טרקסין מעל פתח הדביר")
            // 1.0.1-H review (sources): "אגב תקרה ומעזיבה" is on Bava Batra 3b, the height and "שית פושכי" on 3a (checked in the library);
            // 1.0.1-K (review Q2-1): Yoma 52a quoted with R. Natan and the Gemara's conclusion, not Rabina's rejected premise
            info: "המחיצה בין ההיכל לדביר: 'ויבן את עשרים אמה מירכתי הבית בצלעות ארזים' (מלכים א ו, טז).\nאמה טרקסין — יומא נא:–נב.: 'אמה טרקסין, לא הכריעו בו חכמים אי כלפנים אי כלחוץ' (רבי נתן) — והספק בקדושתה, שלמסקנת הגמרא 'לא מהני עשרין ולא מהני ארבעין' (נב.). בבבא בתרא ג.: 'אמה טרקסין דהואי גבוה תלתין אמהתא ולא הוה פותיא אלא שית פושכי' — עובייה אמה וגובהה שלושים (וכן רש״י), ובג:: 'אגב תקרה ומעזיבה הוה קאי'. כולה מצופה זהב (רד״ק ו, כא) ומגולפת כשאר הקירות (ו, כט).\nבמודל: **שלושה חלקים מלאים** — שני העמודים שמצדי הפתח והחלק שמעל הפתח עד התקרה (מגובה 12 עד 30 מרצפת הבית) — והדוגמה נמשכת ביניהם.\n**מקום האמה — שתי שיטות** (המתג ״אמה טרקסין״): רש״י (מלכים א ו, כ): ״ולפני הדביר. לפנים מאותה מחצה, חלל של עשרים ארך, ושל עשרים רחב״; ובפסוק טז: ״מבית לדביר. לפנים ממחצת אמה טרקסין, המפסקת בין ארבעים לעשרים, ואותה מחצה קרויה דביר״. ובגמרא (יומא נב.): ״ודילמא לא מהני עשרין ולא מהני ארבעין, וחללא קא חשיב, כותלים לא קא חשיב״. — הדביר עשרים שלמות והאמה נוספת (**ברירת המחדל**). הרמב״ם (בית הבחירה ד, ב): ״בבית ראשון היה כתל מבדיל בין הקדש ובין קדש הקדשים עביו אמה. וכיון שבנו הבית שני נסתפק להם אם עבי הכתל היה ממדת הקדש או ממדת קדש הקדשים״ — האמה בתוך ששים אמות הבית; ובגמרא (יומא נב.): ״ולא ידעינן אמה טרקסין אי מהני עשרים, ואי מהני ארבעים״. — במודל נלקחה האמה מן הדביר, תשע עשרה חלל — בחירת מודל.\n\n**לא היה בבית השני** — ״במקדש שני כיון דלא הואי אמה טרקסין, ובמקדש ראשון הוא דהואי... ועבוד שתי פרוכת״ (יומא נא:)." + UI_BARAITA.c,   // QUOTES_Q: יומא נב. (107:1326): 'ארבעים'; רמב״ם בית הבחירה ד, ב (337:63): 'הקדש', 'קדש הקדשים'; רמב״ם בית הבחירה ד, ב (337:63)
            refs: [["יומא נא:", {"book": 107, "index": 1317}], ["מלכים א ו, טז", V(10, 6, 16)], ["ו, כא", V(10, 6, 21)], ["יומא נא:", P(107, "נא:")], ["יומא נב.", { book: 107, index: 1325 }], ["בבא בתרא ג.", P(124, "ג.")], ["בבא בתרא ג:", P(124, "ג:")], ["רש״י מלכים א ו, כ", { book: 3673, index: 261 }], ["רש״י ו, טז", { book: 3673, index: 246 }], ["יומא נב. (חללא קא חשיב)", { book: 107, index: 1327 }], ["רמב״ם בית הבחירה ד, ב", { book: 337, index: 63 }]] },   // QUOTES_Q: יומא נב.: המובאות מנב. (רבי נתן, 'ולא ידעינן', 'ודילמא') בשורות 1325-1327 באוצריא, לא בתחילת הדף (1323)
          // 1.2.0 (the user): the view centred on the doorway; the place hides the incense smoke for 15 s (it stood before the curtain) and, in
          // Rashi's first reading, lights the five sides of the posts and the lintel (ctx.shared.devirPentEdges) for those 15 s
          { t: "פתח הדביר (מזוזות חמישית) — שני ביאורי רש״י", view: "devirDoor", key: "devirDoor",
            feature: { key: "devirDoorView",
              isOn: () => !!(ctx.shared.incenseSmoke && ctx.shared.incenseSmoke.on === false),
              on: () => { const S = ctx.shared.incenseSmoke, E = ctx.shared.devirPentEdges; if (S) S.set(false); if (E) E.set(true); },
              off: () => { const S = ctx.shared.incenseSmoke, E = ctx.shared.devirPentEdges; if (S) S.set(true); if (E) E.set(false); } } },
          // 1.0.1-K (K.4; the user: "על הפרוכת איור נשרים מצד ההיכל ואריות מצד קה"ק"): two faces; flyPoints.parochet / parochetDevir
          // 1.0.1-L (L.54 the staves press out; L.55 the lions right to left, the eagles' heads to the left - interior.md)
          { t: "הפרוכת", view: "parochet",
            info: "הפסוק: 'ויעש את הפרכת תכלת וארגמן וכרמיל ובוץ ויעל עליו כרובים' (דברי הימים ב ג, יד).\nרש״י ורד״ק: אף שהיו דלתות לפתח הדביר נתלתה פרוכת; לפי רד״ק הדלתות עמדו פתוחות מפני בדי הארון. ראשי הבדים דוחקים בפרוכת ובולטים ממנה: 'ויארכו הבדים ויראו ראשי הבדים מן הקדש על פני הדביר ולא יראו החוצה' (מלכים א ח, ח) — 'דוחקין ובולטין ויוצאין בפרוכת, ונראין כשני דדי אשה' (יומא נד.; מנחות צח:).\nפרוכת אחת בלבד בבית ראשון — הרמב״ם (בית הבחירה ד, ב): ״אבל במקדש ראשון לא היתה שם אלא פרכת אחת בלבד שנאמר (שמות כו לג) והבדילה הפרכת לכם״.\nשני פניה אינם דומים: רש״י (שמות כו, א) — 'פרצוף אחד מכאן ופרצוף אחד מכאן — ארי מצד זה ונשר מצד זה'; רש״י (שמות כו, לא) — 'והציורין שמשני עבריה אינן דומין זה לזה'; יומא עב: — 'חושב — מעשה אורג, לפיכך שני פרצופות'. מצודת דוד (דברי הימים ב ג, יד): 'צייר עליו כרובים במעשה רוקם'.\nבמודל: **שורות נשרים פרושי כנפיים בצד ההיכל**, ראשם לימין הצופה, **ושורות אריות מהלכים מימין לשמאל בצד הדביר**, על אריג של תכלת, ארגמן, תולעת ושש כציור הספר; איזה צד לאיזו דמות וכיוונן — בחירת מודל.\nראש הפרוכת כפוף מעט: בגמרא (סוכה ז:), על 'וסכות על הארון את הפרוכת' שבמשכן: 'ורבנן? ההוא דניכוף ביה פורתא, דמחזי כסכך'; רש״י: 'ליכוף בה — למעלה פורתא, כעין גג יעשה ממקצתה'. במודל: **ראש הפרוכת נוטה מעט אל הדביר**, תחת משקוף הפתח; העתקת הדבר מפרוכת המשכן, ושיעור הכפיפה — בחירת מודל.",
            refs: [["דברי הימים ב ג, יד", V(39, 3, 14)], ["שמות כו, א", V(2, 26, 1)], ["שמות כו, לא", V(2, 26, 31)], ["יומא עב:", P(107, "עב:")], ["מלכים א ח, ח", V(10, 8, 8)], ["יומא נד.", P(107, "נד.")], ["מנחות צח:", P(131, "צח:")], ["סוכה ז:", { book: 108, index: 189 }], ["רש״י סוכה ז:", { book: 2163, index: 263 }], ["רמב״ם בית הבחירה ד, ב", { book: 337, index: 63 }]] },   // fix-d (298): one parochet - the Rambam
          { t: "הפרוכת מצד הדביר — האריות", view: "parochetDevir",
            info: "פניה המערביים של הפרוכת, מתוך הדביר: אריות מהלכים מימין לשמאל.\nרש״י: 'ארי מצד זה ונשר מצד זה' (רש״י שמות כו, א); 'והציורין שמשני עבריה אינן דומין זה לזה' (רש״י שמות כו, לא).\nבמודל: שני הבדים לוחצים על הפרוכת ונראים מן ההיכל (מלכים א ח, ח). **קודש הקדשים מכוסה בענן**; המבט מבקש להסיר אותו.",
            refs: [["שמות כו, א", V(2, 26, 1)], ["שמות כו, לא", V(2, 26, 31)], ["מלכים א ח, ח", V(10, 8, 8)]] },
          // 1.0.1-K (K.4 / K.5, the addendum B): the cherubim after the book - robes to the floor, no arms, bird wings across the devir
          // (review Q2-3: Abaye's challenge on BB 99a is the model's reading; Q2-4: the baraita reads "ומצודדים פניהם")
          // 1.0.1-L (L.30, the user: "כנפי הכרובים, מאוזן (תצוגה שוכבת) ולא מאונך"; L.35 "פרצופי הכרובים נוראים" - interior.md): the wings in a
          // horizontal plane under the heads, the kaporet's cherubim with their wings raised, the new faces
          { t: "קודש הקדשים — הדביר", view: "kodeshHakodashim", key: "kodeshHakodashim",
            tourThen: [{ cam: [-45.3, 17.5, 0], tg: [-58, 20, 0] }] },   // TOUR_FIX_137: from its doorway, facing the ark   // 1.1.0: was the grid's view
          { t: "הכרובים", view: "cherubim",
            info: "הפסוק: 'ויעש בדביר שני כרובים עצי שמן עשר אמות קומתו' (מלכים א ו, כג–כח): כנף חמש אמות, 'עשר אמות מקצות כנפיו ועד קצות כנפיו', 'ותגע כנף האחד בקיר וכנף הכרוב השני נגעת בקיר השני וכנפיהם אל תוך הבית נגעת כנף אל כנף' (ו, כז), ומצופים זהב (ו, כח). 'מעשה צעצעים' (דברי הימים ב ג, י) — רש״י: 'תבנית ילדים וילדות עשה לכרובים, כרביא'; 'והם עמדים על רגליהם ופניהם לבית' (ג, יג).\nהכנפיים: פרושות במישור אחד מאוזן, שוכבות, סוכה על הארון — 'כי הכרובים פרשים כנפים אל מקום הארון ויסכו הכרבים על הארון ועל בדיו מלמעלה' (ח, ז); רש״י (דברי הימים ב ג, יג): 'והיו כנפי הכרובים מטין מן הכותל וסוככין על הכפרת ועל הארון בכנפיהם' — ובמודל מתחת לראשים (בחירת מודל), קצותיהן נוגעות בקירות וזו בזו. ואילו כרובי הכפורת שעל הארון — כנפיהם עולות מן הכתפיים מעל ראשיהם ונמשכות בקשת עד אמצע הכפורת, וקצותיהן נוגעים זה בזה (הנגיעה — כציור הספר): 'והיו הכרבים פרשי כנפים למעלה סככים בכנפיהם על הכפרת' (שמות כה, כ), רש״י: 'שלא תעשה כנפיהם שוכבים אלא פרושים וגבוהים למעלה אצל ראשיהם, שיהא עשרה טפחים בחלל שבין הכנפים לכפרת' (סוכה ה:).\nהפנים — פני ילד: 'דמות פרצוף תינוק להם' (רש״י שמות כה, יח), 'מאי כרוב? אמר רבי אבהו: כרביא, שכן בבבל קורין לינוקא רביא' (חגיגה יג:) — ראש סגלגל עם סנטר ולחיים, אף ישר, עיניים שקדיות בעפעפיים, פה קטן סגור וקו שיער, כולו זהב, כציור הספר.\nחז״ל: 'כרובים — בנס הן עומדין' (בבא בתרא צט.; רש״י ו, כד: 'וגוף הכרובים אינו מן המדה ועומד בנס'); ושם מקשה אביי: 'ודלמא בולטין כתרנגולין הוו קיימי' — גופם תחת כנפיהם (רשב״ם), וכך רד״ק (ו, כז): 'גופות הכרובים תחת הכנפים הם ואין צריך להיותם עומדת בנס' — וכך נבנה המודל.\nבמודל, כציור הספר: **דמות גבוהה וחלקה של זהב, לבושה עד הקרקע, בלי ידיים** (אין להן זכר בפסוקים).\nבקצרה — פניהם, שלוש דעות בתפריט, תחת ״שיטות ומחלוקות״: רש״י (ג, יג) — ראשם כפוף ופונה זה אל זה; רד״ק ומצודות — לבית, מזרחה; בבא בתרא צט. — 'ומצודדים פניהם כתלמיד הנפטר מרבו'.",
            refs: [["מלכים א ו, כג", V(10, 6, 23)], ["ו, כד", V(10, 6, 24)], ["ו, כז", V(10, 6, 27)], ["ו, כח", V(10, 6, 28)], ["ח, ז", V(10, 8, 7)], ["דברי הימים ב ג, י", V(39, 3, 10)], ["ג, יג", V(39, 3, 13)], ["שמות כה, יח", V(2, 25, 18)], ["שמות כה, כ", V(2, 25, 20)], ["סוכה ה:", P(108, "ה:")], ["בבא בתרא צט.", P(124, "צט.")], ["מגילה י:", P(112, "י:")], ["חגיגה יג:", P(114, "יג:")]] },
          { t: "הארון ובדיו", tg: () => [arkX() + 2, 14, 0], cam: () => [arkX() + 9.5, 18, 4], // the ark at x -58.5, the staffs east of it
            info: "הפסוק: 'ויבאו הכהנים את ארון ברית ה׳ אל מקומו אל דביר הבית אל קדש הקדשים אל תחת כנפי הכרובים' (מלכים א ח, ו).\nהבדים ארוכים וראשיהם נראים מן הקודש — 'ויארכו הבדים ויראו ראשי הבדים מן הקדש על פני הדביר ולא יראו החוצה' (ח, ח): דוחקים בפרוכת ובולטים ממנה, 'ונראין כשני דדי אשה' (יומא נד.).\nרש״י (ו, כג): **הארון מונח ארכו לרוחב הבית ובדיו מזרח ומערב** (יומא נד.).\nמקום הארון בקודש הקדשים — מחלוקת: הירושלמי (בבא בתרא ו, ב): 'ארון עומד באמצע וחולק הבית עשר אמות לכל רוח'; רש״י (יומא כא.): 'ארון שעשה משה יש לו עשר אמות אויר לכל רוח כשניתן באמצע בית הכפורת'. ולעומתם — הרמב״ם (בית הבחירה ד, א): 'אבן היתה בקדש הקדשים במערבו שעליה היה הארון מנח'; וכן רשב״ם (בבא בתרא צט.): 'כשניתן בבית קדשי הקדשים שעשה שלמה שהוא כ׳ על כ׳ יש לו עשר אמות ריוח לכל רוח ורוח לימינו ולשמאלו הרי עשרים בלא ארון ולפניו כ׳ עד הדביר'. ולריצב״א, כפי שמביא המעשי למלך (על הרמב״ם שם): 'אבל מקום הארון ששכינה שם... הי׳ במזרח בית קד״ק'.\nבמודל — שתי שיטות (בתפריט, תחת ״שיטות ומחלוקות״: ״מקום הארון בקודש הקדשים״): **ברירת המחדל — באמצע**, כירושלמי וכרש״י, עשר אמות לכל רוח; או **צמוד לכותל המערב**, כרמב״ם וכרשב״ם — רלב״ג (דברי הימים ב ג, י): 'והנה היו הכרובים עומדים על רגליהם לשני צדדי הארון והיו אחוריהם דבקים לקיר המערבי שבקדש הקדשים ופניהם היו לצד הבית'. אבן השתייה תחת הארון, והכרובים הגדולים עם הארון — 'ויסכו הכרבים על הארון ועל בדיו מלמעלה' (מלכים א ח, ז); הבדים — מכותל המערב ועד הפרוכת, בשתי השיטות.\n\n**לא היה בבית השני** — ״משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת״ (יומא ה, ב)." + UI_BARAITA.a,
            refs: [["יומא ה, ב", {"book": 55, "index": 39}], ["מלכים א ח, ו", V(10, 8, 6)], ["ח, ח", V(10, 8, 8)], ["רש״י ו, כג", V(10, 6, 23)], ["יומא נד.", P(107, "נד.")], ["ירושלמי בבא בתרא ו, ב", { book: 172, index: 187 }], ["רש״י יומא כא.", { book: 2157, index: 711 }], ["רמב״ם בית הבחירה ד, א", RB(4, 1)], ["רשב״ם בבא בתרא צט.", { book: 1959, index: 3439 }], ["מעשי למלך בית הבחירה ד, א", { book: 4304, index: 303 }], ["רלב״ג דברי הימים ב ג, י", { book: 3639, index: 63 }]] },   // ARK_PLACE_D (fix-d, 131, 137)
          // 1.0.1-L (L.56, the user: "אבן השתיה היתה בבית ראשון?" - interior.md ANSWERS): yes - the ark stood on it; it is bared only when the ark is gone
          { t: "אבן השתייה", tg: () => [arkX(), 12.4, 0], cam: () => [arkX() + 5.5, 14.6, 2.6], // under the ark, x -58.5; 1.2.0: the ark lifted for 15 s (feature arkLift)
            feature: { key: "arkLift", isOn: () => !!(ctx.shared.arkLift && ctx.shared.arkLift.get()),
              on: () => { if (ctx.shared.arkLift) ctx.shared.arkLift.set(true); },
              off: () => { if (ctx.shared.arkLift) ctx.shared.arkLift.set(false); } },
            info: "הייתה בבית ראשון, והארון מונח עליה.\nהמשנה (יומא ה, ב): 'משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת, גבוהה מן הארץ שלש אצבעות, ועליה היה נותן' — 'מימות נביאים ראשונים': רש״י (יומא נג:) 'דוד ושמואל'.\nרמב״ם (בית הבחירה ד, א): 'אבן היתה בקדש הקדשים במערבו שעליה היה הארון מנח. ולפניו צנצנת המן ומטה אהרן'.\nתוספתא יומא (ב, יד): 'אבן היתה שם מימות נביאים הראשנים ושתיה נקרית, גבוהה מן הארץ שלש אצבעות, שמתחלה היה עליה ארון נתון. משניטל הארון, עליה היו מקטירין קטרת שלפני לפנים'; יומא נד:: 'ושתיה היתה נקראת. תנא: שממנה הושתת העולם'.\nבמודל: **האבן, שלוש אצבעות גובהה, והארון עליה** — באמצע קודש הקדשים (הירושלמי ורש״י) או צמודה לכותל המערב (הרמב״ם, ״במערבו״), לפי המתג ״מקום הארון בקודש הקדשים״; המבט מרים את הארון לרגע כדי להראות אותה. אינה נזכרת במלכים.\nהיכן נגנז הארון — " + UI_BARAITA.b,
            refs: [["משנה יומא ה, ב", MN(55, 5, 2)], ["יומא נג:", P(107, "נג:")], ["יומא נד.", P(107, "נד.")], ["רמב״ם בית הבחירה ד, א", RB(4, 1)]] },
          // 1.2.2 (the scan): the gold-lined room over the devir (50-heichal.js sec. 8: the devir's ceiling at 20, the room y 33..42) had no button
          { t: "עליית קודש הקדשים — מעל הדביר", tg: [-60, 36, -3], cam: [-47, 38, 6],
            info: "מעל הדביר חדר ריק מצופה זהב: 'ועשרים אמה קומתו' (מלכים א ו, כ) — רש״י: 'ועשרים אמה קומתו. כלומר, עלית של בית קדשי הקדשים, נמוכה משל היכל' — תקרת הדביר בגובה עשרים, ומעליה עד תקרת ההיכל עלייה; 'והעליות חפה זהב' (דברי הימים ב ג, ט).\nבקצרה — גובה קודש הקדשים (בתפריט, תחת ״שיטות ומחלוקות״, במתג 'גובה קודש הקדשים'): לרש״י — עשרים אמה, ועלייתו מעליו (**ברירת המחדל**); לגמרא (בבא בתרא צח:: 'כי קא חשיב – משפת כרובים ולמעלה') ולתוספות — שלושים אמה, כהיכל, ואין שם עלייה נמוכה; לרד״ק — שלושים, ועשר האמות העליונות מחופות אבן יקרה. בבית שני היו לולים פתוחים מן העלייה אל הדביר, ובהם שלשלו את האומנים בתיבות לתיקונו (מדות ד, ה; פסחים כו.).\nבמודל: חדר סגור, לצפייה; הכניסה אליו אינה מתוארת בכתוב.",
            refs: [["מלכים א ו, כ", V(10, 6, 20)], ["רש״י ו, כ", { book: 3673, index: 262 }], ["דברי הימים ב ג, ט", V(39, 3, 9)], ["בבא בתרא צח:", { book: 124, index: 2324 }], ["תוספות בבא בתרא צח:", { book: 1923, index: 1051 }], ["רד״ק ו, כ", { book: 3540, index: 369 }], ["מדות ד, ה", MI(4, 5)]] },
        ]],
        ["בית שלמה", [
          // 1.0.1-K (K.6): the forest house per the book (Rashi, the default) and the second reading; review Q2-5: Ralbag credited only with
          // what is his (the rows across, 15 to a row, the 45 = the beams on the pillars). 1.0.1-K review: Rashi 7:4 quoted as the library
          // prints it, "שלשה מרישין זה אצל (צריך לומר: לסוף) זה" (it read "זה לסוף זה")
          // 1.0.1-L (L.20; palace.md): THREE readings - Rashi (the book), Malbim and Ralbag, Metzudat David; Rashi 7:2-7:6 quoted in the
          // library's spelling (לארך, כלן, מחפין, קרוי, הספון, לרחב - the K texts had the plene forms)
          { t: "בית יער הלבנון", tg: [103, 5, 520], cam: [225, 70, 650], layer: "palace",
            info: "הפסוק: 'ויבן את בית יער הלבנון מאה אמה ארכו וחמשים אמה רחבו ושלשים אמה קומתו על ארבעה טורי עמודי ארזים וכרתות ארזים על העמודים' (מלכים א ז, ב–ה). **שלוש שיטות במודל** (בתפריט, תחת ״שיטות ומחלוקות״).\nלרש״י, כפי שמצייר הספר (ברירת המחדל): 'לארך הבית היה טור עמודים בקרקע, והכרותות מעמוד לעמוד' (ז, ב); עליהן רצפת הקומה העליונה, שכתליה ארוגים מעמודים — 'כלן פתחים וחלונות' (ז, ג), 'ומחפין היו הפתחים בנסרים דקין' (ז, ה); מעליהם ארבעים וחמישה נסרי הספון, חמישה עשר לכל חלל (ז, ג); ובסוף הבית קרוי שני של נסרים קטנים על מרישין קטנים, 'שלשה מרישין זה אצל (צריך לומר: לסוף) זה' (ז, ד).\nלמלבי״ם ולרלב״ג — הטורים לרוחב הבית: 'העמודים היו נתונים לרוחב הבית וחולקים את אורך הבית לג' חלקים' (מלבי״ם ז, ב), 'חמשה עשר עמודים היו בטור האחד' (רלב״ג ז, ג), כתלים לאורכו ובהם חלונות 'מכוונים נגד חלונות של צד הארך השני' (מלבי״ם ז, ד), והארבעים וחמישה הם לרלב״ג הכרותות שעל העמודים.\nלמצודת דוד — אף הוא טורים לרוחב, 'אבל לאורך הבית היה כתלים ממש, כדרך הבנין' (ז, ב), ועל הכרותות 'השכיבו צלעות ונסרים... ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה' (ז, ג) — 45 לוחות, 'ל״ג אמות ושליש אמה' על 'ג׳ אמות ושליש אמה'; שלוש שורות חלונות 'מכוונות זו מול זו' (ז, ד), ושלושה פתחים מרובעים בכל כותל ארוך 'וכל השלשה היו זה מול זה' (ז, ה).\nבתוכו מאתיים צינה ושלוש מאות מגן זהב (י, טז–יז) וכלי זהב סגור (י, כא). מספרי המודל — בלוח 'השלמות'.",
            refs: [["מלכים א ז, ב", V(10, 7, 2)], ["ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["ז, ה", V(10, 7, 5)], ["ז, ו", V(10, 7, 6)], ["רש״י ז, ג", V(10, 7, 3)], ["מצודת דוד ז, ב", V(10, 7, 2)], ["מלבי״ם ז, ב", V(10, 7, 2)], ["רלב״ג ז, ג", V(10, 7, 3)], ["י, טז", V(10, 10, 16)]] },
          { t: "פנים בית יער הלבנון — המגינים, הצינות והכלים", view: "forestInside", layer: "palace",   // follows the reading (60-palace.js forestHouse.set)
            info: (PN.shields || "הפסוק: מאתיים צינה ושלוש מאות מגן של זהב שחוט, 'ויתנם המלך בית יער הלבנון' (מלכים א י, טז–יז), וכלי זהב סגור (י, כא).") + "\nבמודל: המבט מתוך הבית — בשיטת רש״י לאורך האולם האמצעי של הקומה העליונה, כציור הספר (שם המגינים בקומה העליונה); בשיטות מלבי״ם ורלב״ג ומצודת דוד — לרוחב החלל האמצעי, בין טורי העמודים. 'וכל כלי בית יער הלבנון זהב סגור' (י, כא).",
            refs: [["מלכים א י, טז", V(10, 10, 16)], ["י, יז", V(10, 10, 17)], ["י, כא", V(10, 10, 21)]] },
          // 1.0.1-K review (palace-courts-5): "הסר את הנסרים" removes only the 45 boards and the thin boards (60-palace.js); in Rashi's
          // reading that shows the עבים (7:6), the small beams with their ledges (7:4) and the upper storey - his כרותות (7:2) lie under the
          // upper floor; in the second reading it removes the boards and the stone roof and shows the כרותות on the pillars (Ralbag 7:3).
          // The 1.0.1-K text "הכרותות = מרישים (רד״ק; רש״י ז, ו)" mixed Radak's כרותות with Rashi's עבים; 7:4 quoted as printed in the DB
          { t: "קירוי בית יער הלבנון — הכרותות, 45 הנסרים והנסרים הדקים", view: "forestRoof", layer: "palace",
            info: "הפסוקים: 'וספן בארז ממעל על הצלעות אשר על העמודים ארבעים וחמשה חמשה עשר הטור' (מלכים א ז, ג), 'ושקפים שלשה טורים ומחזה אל מחזה שלש פעמים' (ז, ד).\nרש״י: 'ארבעים וחמשה נסרים היו הספון, שלשה טורי נסרים... חמשה עשר נסרים הטור... ארכן לרחב שבין טור לטור, ורחבן לארך הבית', ועוד: 'כי רחב של חמשה עשר נסרים, לא קרה את הבית בכל ארכו... ועשה אצלו לקרות הבית קרוי של נסרים קטנים, נתונים על מרישין קטנים... שלשה מרישין זה אצל (צריך לומר: לסוף) זה, ושקופין משני צדיהן, כעין משקוף שהדלת שוקף בו'. לרש״י הכרותות הן הקורות שעל העמודים התחתונים — 'והכרותות מעמוד לעמוד' (ז, ב) — ועליהן, כציור הספר, רצפת הקומה העליונה; והעב — באולם העמודים בלבד, ואינו נראה (ז, ו). לרד״ק הכרותות עצמן 'הנקראים מרישי׳ בדברי רז״ל' (ז, ב).\nבמודל, כציור הספר: כרותה אחת מעמוד לעמוד, זו בסוף זו; **הנסרים הגדולים חמש אמות רוחב כל אחד** (שבעים וחמש מתוך המאה); ובשאר הבית שתים עשרה שורות של מרישים קטנים, מריש אחד לכל חלל, 'קצה מול קצה'.\nהכפתור 'הסר את הנסרים' שעל הגג מסיר את 45 הנסרים ואת הנסרים הדקים, ונראים מתחתם המרישין הקטנים ושקופיהם והקומה העליונה; הכרותות נשארות מתחת לרצפתה. בשיטת מלבי״ם ורלב״ג (בתפריט, תחת ״שיטות ומחלוקות״) הוא מסיר את 45 הלוחות ואת גג האבן, ונראות הכרותות שעל העמודים — 'והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה' (רלב״ג ז, ג); בשיטת מצודת דוד — את 45 לוחות הארז של התקרה, ונראות הצלעות שעל הכרותות: 'השכיבו צלעות ונסרים, להיות מחיצות הבית ממעל, ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה' (מצודת דוד ז, ג). עובי הנסרים ורוחבם — בחירת מודל.\nעוד ביאור, שאינו מצויר — התוספות יום טוב (״פירוש פרשיות סתומות במלכים״, בסוף ספרו צורת בית המקדש): הכרותות ״כמו משקוף שעל המזוזות״, ״ואפשר נמי... כמו יתד ארך המחבר שני עמודים״; ״ועל אלו המחיצות העליונות קרוי ארז ארבעים וחמשה ארזים, חלקים בג׳ חלקים לג׳ חללים שבין הארבעה טורים, ונתונים בכל חלל ט״ו מהם... לכך נתן בסופן ארזים קצרים, נתונים ארכן לארך הבית״.",
            refs: [["מלכים א ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["רש״י ז, ב", V(10, 7, 2)], ["רש״י ז, ד", V(10, 7, 4)], ["רש״י ז, ו", V(10, 7, 6)], ["רד״ק ז, ב", V(10, 7, 2)], ["רלב״ג ז, ג", V(10, 7, 3)], ["מצודת דוד ז, ג", V(10, 7, 3)], ["צורת בית המקדש לתוי״ט — פרשיות סתומות", { book: 3190, index: 596 }], ["שם — הקירוי", { book: 3190, index: 600 }]] },   // fix-d (530, 555): the TYT, for information
          // 1.0.1-L (L.48, the user: "עיין בספר ולפי"ז תבין את העב"; verify-palace Follow-ups §2): the two 7:6 places fly to the palace module's
          // fly points forestAv / forestAlam, which it re-aims per reading (no hard-coded cameras: under "mzd" the K cameras showed the house)
          { t: "העמודים והעב — 'ועמדים ועב על פניהם'", view: "forestAv", layer: "palace",
            info: "הפסוק: 'ואולם על פניהם ועמדים ועב על פניהם' (מלכים א ז, ו).\nרש״י: 'אולם גבוה עשה על כל הבית'; 'ועל כרותות ארזים שעל העמודים התחתונים, הציב על (צריך לומר: עוד) עמודים אחרים, ומרישין מעמוד לעמוד, העמודים לארג בהן צלעות מזה לזה, והעבים לקרוי העליה, עב היא מריש, כמו ששנינו והעבים אלו המרישין'. בסוף הגג, במקום שלא כיסו 45 הנסרים, אין עבים, והכל דק: 'נתונים על מרישין קטנים... מטור כרותות ארזים אל טור, שלשה מרישין זה אצל (צריך לומר: לסוף) זה, ושקופין משני צדיהן' (רש״י ז, ד).\nמלבי״ם ורלב״ג: 'לפני הבית והאולם היה עוד אולם ולפני האולם השני היו עמודים ועב על פניהם היינו מריש שהוא עץ עב' (מלבי״ם ז, ו) — שורת עמודים לפני האולם השני ועליהם המריש.\nמצודת דוד: 'לפני פתחי האולם הזה, עמדו עמודים תקועים בארץ, וממעל להם עץ עב לחברם יחד' (ז, ו).\nבמודל, כרש״י: 'ועמדים' — עמודי קירות הקומה העליונה; 'ועב' — באולם העמודים בלבד, ואינו נראה במודל. המבט הולך אחרי השיטה שנבחרה בתפריט, תחת ״שיטות ומחלוקות״; מידות המרישים — בחירת מודל.",
            refs: [["מלכים א ז, ו", V(10, 7, 6)], ["רש״י ז, ו", V(10, 7, 6)], ["רש״י ז, ד", V(10, 7, 4)], ["מלבי״ם ז, ו", V(10, 7, 6)], ["מצודת דוד ז, ו", V(10, 7, 6)]] },
          { t: "אולם העמודים", view: "forestAlam", layer: "palace",
            info: "הפסוק: 'ואת אולם העמודים עשה חמשים אמה ארכו ושלשים אמה רחבו ואולם על פניהם ועמדים ועב על פניהם' (מלכים א ז, ו).\nרש״י: 'אולם עשה לפני העמודים האלה, מבוא לבית, חמשים אמה ארכו, לרחבו של בית שהיה חמשים אמה, ושלשים רחבו לפני ארך משך הבית' — במודל, כציור הספר, **אולם כניסה נמוך בקצה הבית**, ולפניו 'אולם על פניהם — אולם גבוה'; גובה שני האולמות ומידות האולם הגבוה — בחירת מודל.\nמלבי״ם ורלב״ג: אולם העמודים גבוה כעמודים — 'גבהו כגבהם' (רלב״ג ז, ו) — טורי עמודי ארז בתוכו, ולפניו אולם שני, ולפניו 'עמודים ועב על פניהם, היינו מריש שהוא עץ עב' (מלבי״ם); המבט מתוכו.\nמצודת דוד: 'עשה אולם עומד על עמודי ארזים... נסמך לבית היער לפני פתחים, וכדרך בית שער, ועמד ארכו לאורך הבית, להיות מול כל שלשת הפתחים' (ז, ו) — אולם לאורך צלעו הארוכה של הבית, מול שלושת פתחיו.\nבמודל: המבט הולך אחרי השיטה שנבחרה. על 'ועמדים ועב על פניהם' — בהמשך הכרטיס.",
            refs: [["מלכים א ז, ו", V(10, 7, 6)], ["רש״י ז, ו", V(10, 7, 6)], ["רלב״ג ז, ו", V(10, 7, 6)], ["מלבי״ם ז, ו", V(10, 7, 6)], ["מצודת דוד ז, ו", V(10, 7, 6)]] },
          // 1.0.1-K (K.6): inside the throne hall (flyPoints.throne) and the king's house (flyPoints.kingsHouse); the garden. 1.0.1-L (L.57, L.78,
          // L.81; palace.md / palace-2.md): the throne per Kings in four midrashic versions (the row "כסא שלמה — לפי איזה מדרש"), its own
          // place, and the king's ascent (an animation with its own duration - exempt from the 15-s rule)
          { t: "אולם הכסא ואולם המשפט", view: "throneHall", layer: "palace",
            info: "הפסוק: 'ואולם הכסא אשר ישפט שם אלם המשפט עשה וספון בארז מהקרקע עד הקרקע' (מלכים א ז, ז) — אולם שבו כיסא המלך למשפט, ורצפתו ארז מקיר לקיר (רש״י, רד״ק). מצודות ומלבי״ם: אולם המשפט לפני אולם הכסא.\nבתוכו כסא שלמה (י, יח–כ) — ראו 'כסא שלמה' ו'עליית המלך לכסא', והמתג 'כסא שלמה — לפי איזה מדרש' בתפריט, תחת ״שיטות ומחלוקות״.\nבמודל: הכפתור 'הסר את גגות אולם הכסא' שעל הגג מראה אותו מלמעלה.",
            refs: [["מלכים א ז, ז", V(10, 7, 7)], ["י, יח", V(10, 10, 18)], ["י, יט", V(10, 10, 19)], ["י, כ", V(10, 10, 20)], ["דברי הימים ב ט, יח", V(39, 9, 18)]] },
          { t: "כסא שלמה", view: "throne", layer: "palace",
            info: (PN.throne || "הפסוק (מלכים א י, יח–כ; דברי הימים ב ט, יז–יט): 'ויעש המלך כסא שן גדול ויצפהו זהב מופז. שש מעלות לכסה וראש עגל לכסה מאחריו וידת מזה ומזה אל מקום השבת ושנים אריות עמדים אצל הידות. ושנים עשר אריים עמדים שם על שש המעלות מזה ומזה לא נעשה כן לכל ממלכות'.\nבמודל: המידות — בחירת מודל.") + (PN.throneVersions ? "\n**ארבע גרסאות במודל** — הפסוקים ומפרשיהם בלבד (ברירת המחדל), תרגום שני, אסתר רבה עם פנים אחרים ואבא גוריון, ובית המדרש ב — במתג 'כסא שלמה — לפי איזה מדרש' בתפריט, תחת ״שיטות ומחלוקות״; עליית המלך אל הכסא — בכפתור שעל הכסא ובמקום 'עליית המלך לכסא'." : ""),
            refs: TH_REFS.pesukim },
          { t: "עליית המלך לכסא", view: "throneSteps", layer: "palace",
            feature: { key: "throne.ascent", timed: false, isOn: () => !!(ctx.shared.throne && ctx.shared.throne.ascent && ctx.shared.throne.ascent.running),
              on: () => { const tv = ctx.shared.throneVersion, a = ctx.shared.throne && ctx.shared.throne.ascent; if (tv && typeof tv.set === "function" && tv.current === "pesukim") { tv.set("estherRabbah"); if (throneRow) throneRow.mark("estherRabbah"); ctx.shared.throneAuto = true; } if (a && typeof a.start === "function" && !a.running) a.start(); },
              off: () => { const a = ctx.shared.throne && ctx.shared.throne.ascent; if (a && typeof a.reset === "function") a.reset(); else if (a && typeof a.stop === "function") a.stop(); },
              // THRONE_BACK_211 (the function review, F2-05): the place itself moved the row "כסא שלמה" from the verses to a midrash (the
              // verses have no ascent) - and left it there: every later place showed the midrash's throne, which the reader never chose.
              // When the place is left, the reading goes back - unless the reader picked a reading himself meanwhile (the row's onPick).
              leave: () => { const tv = ctx.shared.throneVersion; if (ctx.shared.throneAuto && tv && typeof tv.set === "function" && tv.current === "estherRabbah") { tv.set("pesukim"); if (throneRow) throneRow.mark("pesukim"); } ctx.shared.throneAuto = false; } },
            info: (PN.throneAscent ? PN.throneAscent :"עליית המלך אל הכסא (המלך בלבוש מלכות): בכל מעלה חוזר גלגל המנגנון שבצד המעלה, והארי פושט את ידו והנשר את כנפו לקראת העולה, זה אחר זה; בראש — על פי המדרש של הגרסה שנבחרה. 'שש מעלות לכסה' (מלכים א י, יט).") + "\nבמודל: הכפתור מפעיל את ההדגמה לפי הגרסה שנבחרה בתפריט, תחת ״שיטות ומחלוקות״; **בגרסת הפסוקים אין מנגנון ואין עלייה**, ולכן הוא עובר תחילה לגרסת אסתר רבה. היא נמשכת עד סופה ואינה נסגרת לבד; 'עצור את העלייה' שעל הכסא מחזיר הכל למקומו.",
            refs: [["מלכים א י, יט", V(10, 10, 19)], ["י, כ", V(10, 10, 20)], ["דברי הימים ב ט, יח", V(39, 9, 18)], ["מדרש אבא גוריון א", { book: 274, index: 6 }], ["אסתר רבה א, יב", { book: 264, index: 25 }], ["פנים אחרים נוסח ב", { book: 274, index: 116 }], ["תרגום שני לאסתר א, ב", { book: 3237, index: 13 }], ["תרגום שני — עדי השקר", { book: 3237, index: 17 }], ["בית המדרש ב (דמות כסא שלמה)", { book: 7924, index: 8 }], ["בן יהוידע על סנהדרין קו:", { book: 2546, index: 778 }], ["סנהדרין קו:", { book: 125, index: 4140 }]] },
          // 1.0.1-L (L.33, the user: "בית המלך היה בחצר אחרת לגמרי! ולא בתוך חצר בית יער הלבנון"; "בית בת פרעה בתוך חצר בית יער הלבנון"; L.22
          // "בלי בריכה" - palace.md): the king's own walled court, the garden without the pool, בית בת פרעה in the great court
          { t: "בית המלך", view: "kingsHouse", layer: "palace",
            info: "הפסוק: 'וביתו אשר ישב שם חצר האחרת מבית לאולם כמעשה הזה היה' (מלכים א ז, ח) — בית מגורי המלך בחצר משלו, החצר האחרת — 'לפנים מן אולם של בית יער הלבנון' (רש״י), בנוי באותו מעשה.\n" + (PN.kingsHouse || "המידות והחדרים — בחירת מודל.") + "\nבמודל: המבט מתוך חדר האוכל; 'הסר את גגות בית המלך' שעל הגג מראה את כל החדרים מלמעלה. ראו 'החצר האחרת — חצר בית המלך'.",
            refs: [["מלכים א ז, ח", V(10, 7, 8)], ["רש״י ז, ח", V(10, 7, 8)], ["י, ה", V(10, 10, 5)], ["י, כא", V(10, 10, 21)], ["שיר השירים ג, ז", V(31, 3, 7)]] },
          { t: "החצר האחרת — חצר בית המלך", view: "otherCourt", layer: "palace",
            info: PN.otherCourt || "הפסוק: 'וביתו אשר ישב שם חצר האחרת מבית לאולם כמעשה הזה היה' (מלכים א ז, ח).\nרש״י: 'מבית לאולם. לפנים מן אולם של בית יער הלבנון'. רד״ק: 'החצר האחרת שהיתה לבית הזה והיא החצר שהיתה מבפנים לאולם'.\nבמודל: **חצר משלו לבית המלך, מוקפת חומה וסגורה**, מאחורי בית יער הלבנון ומחוץ לחצר הגדולה, כציור הספר; בתוכה הגן. מידותיה — בחירת מודל.",
            refs: [["מלכים א ז, ח", V(10, 7, 8)], ["רש״י ז, ח", V(10, 7, 8)], ["רד״ק ז, ח", V(10, 7, 8)], ["מצודת דוד ז, ח", V(10, 7, 8)], ["ז, יב", V(10, 7, 12)], ["מלכים א י, ה", V(10, 10, 5)]] },
          { t: "הגן", view: "garden", layer: "palace",
            info: PN.garden || "הגן בחצר האחרת, לפני בית המלך: 'עשיתי לי גנות ופרדסים ונטעתי בהם עץ כל פרי' (קהלת ב, ה).\nבמודל: מקומו בחצר הזו, הערוגות והעצים — בחירת מודל; בלי בריכה.",
            refs: [["קהלת ב, ה", V(32, 2, 5)], ["מלבי״ם מלכים א ז, ח", V(10, 7, 8)]] },
          { t: "בית בת פרעה", view: "pharaohDaughter", layer: "palace",
            info: PN.pharaohDaughter || "הפסוק: 'ובית יעשה לבת פרעה אשר לקח שלמה כאולם הזה' (מלכים א ז, ח) — בית לבת פרעה באותו מעשה, ולא בבית המלך: 'לא תשב אשה לי בבית דויד' (דברי הימים ב ח, יא).\nבמודל: בחצר הגדולה — חצר בית יער הלבנון. מקומו — בחירת מודל.",
            refs: [["מלכים א ז, ח", V(10, 7, 8)], ["רש״י ז, ח", V(10, 7, 8)], ["דברי הימים ב ח, יא", V(39, 8, 11)], ["ז, א", V(10, 7, 1)]] },
          { t: "החצר הגדולה", view: "palace", layer: "palace",
            info: "הפסוק: 'וחצר הגדולה סביב שלשה טורים גזית וטור כרתת ארזים' (מלכים א ז, יב) — חומה באותו דגם של חצר המקדש.\nבמודל: **החצר הגדולה מקיפה את בית יער הלבנון, את אולמיו ואת בית בת פרעה** (כציור הספר); בית המלך — בחצר האחרת שלו, מחוצה לה.\nבקצרה — המחלוקת: מצודות, רלב״ג ומלבי״ם על ז, יב מקיפים בה גם את בית המלך — לא נבנה כך, כציור הספר.\nהבניינים: כולם אבני גזית מגוררות, ויסודם אבני עשר ואבני שמונה (ז, ט–יא) — במודל נדבך יסוד גלוי, בחירת מודל (רש״י: היסוד שבתוך הקרקע; רד״ק בשם חז״ל: איצטוניות בולטות מבפנים).\nמקום הארמון — דרומית לבית ה׳ ונמוך ממנו, שעולים ממנו אל הבית (מלכים א י, ה; ירמיהו כו, י) — ראו 'החצר הגדולה'.",
            refs: [["מלכים א ז, יב", V(10, 7, 12)], ["ז, ט", V(10, 7, 9)], ["ז, י", V(10, 7, 10)], ["י, ה", V(10, 10, 5)], ["ירמיהו כו, י", V(13, 26, 10)]] },
          // 1.0.1 (FIXES E.3 / F.3): 60-palace.js's 20 steps (x 103, z 352.5 -> 342.5, y -10 -> 0) and the landing to the Temple's south gate;
          // the camera stands in the gap between the two walls (z 335..352.5), east of the flight, and looks west along it
          { t: "המעלות מבית המלך אל בית ה׳", tg: [103, -3, 345], cam: [142, 12, 346], layer: "palace",
            info: "הפסוקים: 'ועלתו אשר יעלה בית ה׳' (מלכים א י, ה; דברי הימים ב ט, ד: 'ועליתו') — מלכת שבא ראתה את עלייתו של שלמה מביתו אל בית ה׳; 'ויעלו מבית המלך בית ה׳' (ירמיהו כו, י); 'וירידו את המלך מבית ה׳ ויבואו דרך שער הרצים בית המלך' (מלכים ב יא, יט).\nצורת העלייה — מחלוקת: רש״י (דברי הימים ב ט, יא): 'מסלות. מדרגות; ובמלכים (מלכים א י:יב) כתיב ״מסעד״, כדרך שעושין לעולין בדרך מעלות ומדרגות'; ושם (ט, ד): 'ועליתו. מסלות עליותיו אשר יעלה עליהם מביתו לבית ה׳'. ולעומתו — רלב״ג (מלכים א י, יב): 'שבעליה אשר יעלה בה בית ה׳ מבית המלך עשה כדמות מעקה מעצי האלמוגים שיסמך האדם בהם במסלתו בזאת העליה... כי לא היו בהם מעלות לא בכבש המזבח ולא בעליות אשר יעלו בהם אל היציעים'; המלבי״ם (י, יא): 'עליתו שהיה עולה בה לבית ה׳... לפי שהיתה כולה מעצי אלמגים'; אברבנאל: 'העלייה אשר עשה מביתו אל בית השם מעצי אלמוגים', 'והמסעד הנזכר כאן היה העלייה'. ורד״ק (י, יב): 'מסעד. ובדברי הימים מסלות ופירושו עמודים לסמיכת התקרות'.\nבמודל — שתי שיטות (בתפריט, תחת ״שיטות ומחלוקות״: ״העלייה מבית המלך אל בית ה׳״): **ברירת המחדל — מדרגות אבן**, כרש״י: עשרים מעלות (עשר אמות) משער הארמון הצפוני אל השער הדרומי של החצר הגדולה; או **עלייה משופעת מעצי אלמוגים, בלי מעלות, ובה מעקה**, כרלב״ג, כמלבי״ם וכאברבנאל. מספר המעלות, השיפוע, המרחק, המעקה וגוון האלמוגים (עץ אדמדם) — בחירת מודל.",
            refs: [["מלכים א י, ה", V(10, 10, 5)], ["דברי הימים ב ט, ד", V(39, 9, 4)], ["ירמיהו כו, י", V(13, 26, 10)], ["מלכים ב יא, יט", V(11, 11, 19)], ["רש״י דברי הימים ב ט, יא", { book: 3662, index: 335 }], ["רלב״ג מלכים א י, יב", { book: 3645, index: 443 }], ["מלבי״ם מלכים א י, יא", { book: 3394, index: 612 }], ["אברבנאל מלכים א ג, ז", { book: 3574, index: 224 }]] }   // ASCENT2_D (fix-d, 142)
        ]]
      ];
      // 1.0.0: "השלמות מחז״ל ובחירות מודל" - one entry per thing that is NOT in the verses, with its source or "בחירת מודל"
      // (the First Temple counterpart of the 1.0.19 CORRECTIONS group). STANDING RULE (DEV_NOTES 6): add an entry here for every
      // completion from Chazal or model choice that enters the model. 1.0.1-K (K.9b item 3): every model choice of this round is here.
      const hwT = Array.isArray(CO.HOUSE_WALL) && CO.HOUSE_WALL.length === 4 ? CO.HOUSE_WALL : [7, 6, 5, 4];   // the house wall per story (K.2)
      const yH = (ctx.shared.heichal && ctx.shared.heichal.yatzia) || {};
      const yDoor = Array.isArray(yH.door) ? yH.door : [2.5, 3.5];
      const ulamHalf = ctx.shared.heichal && typeof ctx.shared.heichal.ulamZ === "number" ? ctx.shared.heichal.ulamZ : 42;
      const EXTRAS = [
        { t: "מידות החצרות (מדות ה, א; ב, א)", tg: [60, 5, 40], cam: [300, 220, 250],
          info: "במלכים ובדברי הימים אין מידות לחצרות.\nבמודל: **חצר הכהנים 187 על 135 אמה** כמדות ה, א, **והחצר הגדולה 500 על 500** כהר הבית במדות ב, א — מוסכמה למודל. החצר החיצונה 135 על 135 והמפלסים — בחירת מודל.",
          refs: [["מדות ה, א", MI(5, 1)], ["מדות ב, א", MI(2, 1)], ["מלכים א ו, לו", V(10, 6, 36)]] },
        // 1.0.1-K (K.2): the house wall after Rashi's calculation as the book draws it (it was 6 throughout, after Middot 4:7)
        { t: "עובי הקירות — כותל הבית " + hwT.join(", ") + " (רש״י ו, ו, כציור הספר)", view: "heichalFront",
          info: "עובי הקירות אינו בפסוקים.\nבמודל: כותל הבית נבנה כחשבון רש״י (מלכים א ו, ו) כפי שמצייר הספר: " + hwT[0] + " אמות בקומה התחתונה של התאים, " + hwT[1] + " בתיכונה, " + hwT[2] + " בעליונה ו־" + hwT[3] + " מעל גג התאים — בכל קומה הוא נכנס אמה, 'כי מגרעות נתן לבית סביב חוצה לבלתי אחז בקירות הבית' (ו, ו). פני הכותל מבפנים ישרים, והמדרגות בחוץ.\nבמשנת מדות (ד, ז), בבית שני, כותל ההיכל שש. כותל התא חמש — 'וכתל התא חמש' (מדות ד, ז); כותל האולם שש — רש״י בסנהדרין ק. ('וכותל האולם שש'). בחירת מודל.",
          refs: [["מלכים א ו, ו", V(10, 6, 6)], ["רש״י ו, ו", V(10, 6, 6)], ["מדות ד, ז", MI(4, 7)], ["רש״י סנהדרין ק.", P(125, "ק.")]] },
        { t: "38 תאים (רש״י ו, ו ממדות ד, ג)", view: "heichalSouth",
          info: "מספר התאים אינו במלכים.\nרש״י (ו, ו) מביא את משנת מדות ד, ג: **שלושים ושמונה תאים** — חמישה עשר בצפון, חמישה עשר בדרום ושמונה במערב, ולכל תא שלושה פתחים (רש״י ו, ח: 'אחד לתא מן הימין, ואחד לתא מן השמאל, ואחד לתא שעל גביו').\nבמודל: חלוקת התאים לאורך, המחיצה שבין השורה הארוכה לשורת המערב ועובי המחיצות — בחירת מודל.",
          refs: [["רש״י מלכים א ו, ו", V(10, 6, 6)], ["רש״י ו, ח", V(10, 6, 8)], ["מדות ד, ג", MI(4, 3)]] },
        // 1.0.1-K (K.2): the chambers' beams, doors and stair
        { t: "קורות היציע, פתחיו והלולים", view: "yatziaDoor",
          info: "בפסוקים: רוחב התאים וגובהם (מלכים א ו, ו; ו, י), המגרעות, הפתח בכתף הימנית והלולים (ו, ח).\nבחירות מודל: קורות הארז של התקרות ושל הגג אמה עוביין, זו בצד זו, ולכן גג התאים בגובה שלושים; קורות הרצפה כלות בפני כותל התא מבפנים, כציור הספר; הפתח החיצוני " + nf(yDoor[0]) + " על " + nf(yDoor[1]) + ", פתחי המחיצות שתיים על ארבע והפתחים שבתקרות שתיים על שתיים; הלולים — עמוד ובו עשרים וארבע מעלות סביבו מגובה 12 עד 24; ואין מעקה על הגג (כציור הספר).\nחתך היציע — בקצהו המזרחי של התא האמצעי שבדרום — הוא כלי צפייה בלבד; הצבעים והמקרא שעליו — בחירת מודל.",
          refs: [["מלכים א ו, ו", V(10, 6, 6)], ["ו, ח", V(10, 6, 8)], ["ו, י", V(10, 6, 10)]] },
        { t: "גובה האולם", view: "heichalFront",
          info: "במלכים אין גובה לאולם. 'והגבה מאה ועשרים' (דברי הימים ב ג, ד) נאמר על האולם.\nבקצרה — המחלוקת: רד״ק — האולם לבדו 120 (דעתו העיקרית); רש״י — שלושים עד התקרה ועוד תשעים אמה של עליות.\nבמודל: **אולם בגובה הבית, שלושים**, והעליות במתג 'גובה הבית' שבתפריט, תחת ״שיטות ומחלוקות״ — בחירת מודל.",
          refs: [["דברי הימים ב ג, ד", V(39, 3, 4)], ["מלכים א ו, ג", V(10, 6, 3)]] },
        { t: "פתחי ההיכל והדביר (מידות)", view: "heichalDoor",
          info: "מידות הפתחים אינן בשום מקור.\nבמודל: פתח ההיכל עשר על עשרים (כיחס פתח ההיכל של בית שני, מדות ד, א); פתח הדביר שש על שתים עשרה — רחב ממרווח בדי הארון כדי ששני הבדים ידחקו בפרוכת (רש״י ו, כג; ח, ח). פתח האולם, עשר על עשרים ושתיים — בחירת מודל — ובו שתי דלתות ארז פתוחות (דברי הימים ב כט, ז); ראש הפתח קשת (רש״י ז, ה: 'ולא עשויין כפה כעין פתחי אולם'), לוח אחד לכל דלת וצירי נחושת — בחירת מודל; הפרוכת שהמאירי מזכיר (יומא נד.) לא נבנתה.",
          refs: [["מדות ד, א", MI(4, 1)], ["מלכים א ו, לא", V(10, 6, 31)], ["ו, לג", V(10, 6, 33)], ["דברי הימים ב כט, ז", V(39, 29, 7)], ["מלבי״ם שם", { book: 3364, index: 810 }], ["מדות ג, ז", MI(3, 7)], ["מאירי יומא נד.", { book: 2199, index: 480 }]] },
        { t: "הכבש והקרנות", view: "mizbeach",
          info: "דברי הימים ב ד, א נותן למזבח הנחושת רק אורך, רוחב וגובה.\nהשלמת מודל: הכבש מדרום ('לא תעלה במעלות', שמות כ; מידותיו כמדות ג, ג), ארבע הקרנות (כמזבח הנחושת שבמשכן, שמות כז) והשפה שבראש המזבח. הכרכוב הוא הסובב, כרבי יוסי ברבי יהודה (זבחים סב.).",
          refs: [["דברי הימים ב ד, א", V(39, 4, 1)], ["מדות ג, ג", MI(3, 3)], ["מדות ג, א", MI(3, 1)], ["זבחים סב.", { book: 130, index: 2109 }]] },   // 1.0.2 add-on: the band became the sovev
        { t: "מקום המזבח (מדות ה, א)", tg: [55, 12, 0], cam: [65.5, 110, 40],
          info: "מקום המזבח בחצר אינו נתון במלכים. במשנה, בבית שני: 'בין האולם ולמזבח עשרים ושתים אמה' (מדות ה, א).\nבמודל: על ציר הבית; **גוף המזבח עשרים ושש אמה וחצי מזרחה מן האולם**, ויסודו עשרים וארבע אמה וחצי — וכך יש בין האולם לכבש מקום למכונות שבדרום ('ויתן את המכנות חמש על כתף הבית מימין וחמש על כתף הבית משמאלו', מלכים א ז, לט). בחירת מודל.",
          refs: [["מדות ה, א", MI(5, 1)], ["מלכים א ז, לט", V(10, 7, 39)], ["מדות ג, ו", MI(3, 6)], ["דברי הימים ב ד, א", V(39, 4, 1)]] },
        { t: "האוטם והמעלות", tg: [21, 10, 0], cam: [52, 26, 30],
          info: "במלכים אין מפלסים.\nבמשנה, בבית שני: 'האטם שש אמות' (מדות ד, ו). ולבית ראשון — המלבי״ם (מלכים א ו, ח): 'וי״ל שבית של שלמה היה ג״כ גובה היסוד שש אמות כמו בבית השני כמבואר במס׳ מדות'.\nבמודל: הבית הוגבה על אוטם של שש אמות, כמלבי״ם, עם שתים עשרה מעלות מחצר הכהנים לאולם (מדות ג, ו) ושתים עשרה מעלות מן החצר הגדולה לחצר הכהנים — המעלות שבין החצרות בחירת מודל.",
          refs: [["מדות ד, ו", MI(4, 6)], ["מלבי״ם מלכים א ו, ח", { book: 3394, index: 262 }], ["מדות ג, ו", MI(3, 6)], ["מלכים א ו, ח", V(10, 6, 8)]] },   // fix-d (129 א): the otem stays; the Malbim's words and Middot 4:6
        // 1.0.1-L (L.62; vessels-2.md): the capacity
        { t: "צורת הים (עירובין יד:)", view: "yam",
          info: "הפסוקים: 'עגל סביב... וקו שלשים באמה יסב אתו' (מלכים א ז, כג), 'אלפים בת יכיל' (ז, כו) לעומת 'שלשת אלפים' (דברי הימים ב ד, ה).\nבגמרא — עירובין יד: מיישבת: 'שלש אמות תחתונות מרובעות, ושתים עליונות עגולות' — וכך רש״י, רד״ק, מצודות, רלב״ג ומלבי״ם. הקיבולת: 'ים שעשה שלמה היה מחזיק מאה וחמשים מקוה טהרה' (שם): עשר על עשר ברום שלוש — 300 אמה מעוקבת, ושתי העליונות העגולות — 150 לחשבון הגמרא; סך הכל 450 = 150 מקוואות = 6,000 סאה = 2,000 בת (רש״י שם: 'ו' אלפים סאין - שהן ק״נ מקואות').\nבמודל: באגן, עשר על עשר, דופן טפח, **פני המים ב־450 אמה מעוקבת (2,000 בת)**. באמה של 48 ס״מ — 49,766 ליטר; ולפי 7.34 ליטר לסאה, כספר 'מדות ומשקולות' — 44,040 ליטר, והן אותן 450 אמה. השוורים — שלושה לכל רוח, פניהם לחוץ ואחוריהם אל תחת הים (ז, כה); ראו 'שנים עשר הבקר'.",
          refs: [["עירובין יד:", P(105, "יד:")], ["עירובין יד.", P(105, "יד.")], ["מלכים א ז, כג", V(10, 7, 23)], ["ז, כו", V(10, 7, 26)], ["דברי הימים ב ד, ה", V(39, 4, 5)]] },
        // 1.0.1-K (K.3): the oxen
        { t: "שנים עשר הבקר — צורתם וגודלם", view: "yamOxen",
          info: "הפסוקים נותנים את מספר הבקר, את פניהם לחוץ ואת אחוריהם 'ביתה' (מלכים א ז, כה), ולא את גודלם וצורתם.\nבמודל, כציור הספר: שוורים מוצקים, שלושה לכל רוח, **חציים הקדמי מחוץ לים** — הרגליים הקדמיות בקו הדופן והחוטם כשתי אמות מחוץ לה — ואחוריהם נפגשים תחת מרכז הים; גבם נושק לתחתית הים; הראש מוטה מעט מטה כבספר. כל המידות — בחירת מודל.",
          refs: [["מלכים א ז, כה", V(10, 7, 25)], ["דברי הימים ב ד, ד", V(39, 4, 4)]] },
        // review UI-H2-7: the Sea's switch is a row of the opinions table now
        { t: "מקום הים (רש״י / רד״ק)", cam: uiSeaCam, tg: uiSeaTg,
          info: "הפסוק: 'ואת הים נתן מכתף הבית הימנית קדמה ממול נגב' (מלכים א ז, לט).\nרש״י: 'משוך מצד דרום לצד צפון, וזה קדמה מול נגב, מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה'.\nבקצרה — המחלוקת: מצודת דוד — 'משוך כלפי מקצוע מזרחית דרומית שבעזרת כהנים'; רד״ק — 'נתן הים בעזרה לצד דרום משוך כלפי מזרח'; רלב״ג — 'הים היה לפאת מזרחי דרומי שבחצר הכהנים'; רש״י (דברי הימים ב ד, י) — 'רחק אותו מן המזרח מן כנגד הפתח לדרומה של עזרה, לפי שאין כבוד ונאה שיהו מטבילין כנגד פתח האולם'.\nבמודל: שני המקומות — בוחרים במתג 'מקום הים' שבתפריט, תחת ״שיטות ומחלוקות״; **ברירת המחדל: רש״י**, כציור הספר ומפתו — בקרן המזרחית הצפונית, ממזרח לצפון בית המטבחים, מול הננסין — ממזרח להם. המקורות אומרים 'מקצוע' ולא מרחק: ציר הים " + nf(courtE - seaXm) + " אמות מן הכתלים, ונשאר מעבר סביב ראשי הבקר ובינם לבין לשכת הגזית — בחירת מודל.",
          refs: [["מלכים א ז, לט", V(10, 7, 39)], ["דברי הימים ב ד, י", V(39, 4, 10)]] },
        { t: "העליות (רש״י דה״י ג, ד)", view: "aliyot", layer: "aliyot",
          info: "הפסוק: 'והגבה מאה ועשרים' (דברי הימים ב ג, ד).\nרש״י: שלושים אמה עד תקרת העלייה הראשונה, 'ומעליה לעליה עד גג העליון תשעים אמות'. רד״ק (כדעה שנייה): 'ג' עליות גבהן תשעים אמה'. בבא בתרא ג. משווה את גובה הבית (שלושים) לבית שני ואינה מזכירה 120.\nבמודל: מספר הקומות וחלוקתן — בחירת מודל (המתג 'גובה הבית' בתפריט, תחת ״שיטות ומחלוקות״).",
          refs: [["דברי הימים ב ג, ד", V(39, 3, 4)], ["בבא בתרא ג.", P(124, "ג.")]] },
        { t: "בית החליפות (רש״י יומא לו.)", tg: [18, 20, 33], cam: [70, 40, 70],
          info: "רש״י (יומא לו.): 'בית החליפות' — האולם היה רחב מן ההיכל חמש עשרה אמה מכל צד, ובשני הצדדים גנזו שם את הסכינים (חליפות). רש״י בסנהדרין ק. מונה כך גם בבית ראשון.\nבמודל: גוש האולם נמשך חמש עשרה אמה מעבר לגוף הבית עם התאים, ולכן חזיתו " + nf(2 * ulamHalf) + " אמות; הפתח מן האולם אל כל כנף (שלוש על שבע) והחלונות לסכינים — בחירת מודל.",
          refs: [["יומא לו.", P(107, "לו.")], ["מלכים א ו, ג", V(10, 6, 3)], ["רש״י סנהדרין ק.", P(125, "ק.")]] },
        { t: "מקום בית שלמה", view: "palace", layer: "palace", // 1.0.1 (FIXES E.2 / F.5): the basis from 60-palace.js (ctx.shared.palaceBasis) or ui_PALACE_BASIS
          info: "מלכים א ז, א–יב מתאר את בתי המלך ואינו נותן את מקומם ביחס למקדש (רלב״ג רק משער שבית יער הלבנון היה קרוב למקדש).\n" + palaceBasis + " מידות הבניינים שאינן בפסוק — בחירת מודל.",
          refs: [["מלכים א י, ה", V(10, 10, 5)], ["מלכים א ח, א", V(10, 8, 1)], ["ירמיהו כו, י", V(13, 26, 10)], ["ירמיהו כב, א", V(13, 22, 1)], ["מלכים ב יא, יט", V(11, 11, 19)], ["מלכים א ז, א", V(10, 7, 1)]] },
        // 1.0.1 (FIXES A.2 / A.4 / F.5): the viewing openings are tools, not architecture; 1.0.1-K: only by the buttons on the model
        { t: "פתיחת הבית, התאים והאולם — כלי צפייה בלבד", view: "heichalSouth",
          info: "הבית סגור מכל צדדיו, והתאים סגורים מכל צד — 'ויבן על קיר הבית יציע סביב' (מלכים א ו, ה) — ופתחם היחיד מבחוץ בכתף הבית הימנית (ו, ח); וחזית האולם סגורה מלבד פתחו.\nבמודל: הכפתורים שעל המודל עצמו — 'פתח את הבית', 'הסר את קירות היציע', 'פתח את האולם', 'הצג חתך של היציע (רש״י)', וכן שכבות הקיר ושכבות המזבח — מסירים או חותכים חלקים כדי להראות את הפנים: **כלי צפייה בלבד, לא חלק מן הבניין**. שום מבט אינו פותח אותם מעצמו, ו'↺ החזר הכל' סוגר הכל.",
          refs: [["מלכים א ו, ה", V(10, 6, 5)], ["ו, ח", V(10, 6, 8)], ["ז, כא", V(10, 7, 21)]] },
        // ---- the model choices the integrator required (STANDING RULE above); the numbers come from the model where it shares them ----
        { t: "גובה חומות החצרות (20 אמה)", tg: [93.5, 16, 0], cam: [150, 36, 40], // the inner court's east wall and gate (30-courts.js CRT_WALL_H 20)
          info: "במקורות אין גובה לחומות החצרות.\nבמודל: **חומת החצר הגדולה וחומת חצר הכהנים בגובה עשרים אמה**, כך שמשקופי השערים, עשרים אמה כמדות ב, ג, חותמים את ראש החומה; עובי החומות חמש.\nחומת חצר הכהנים — ״שלשה טורי גזית וטור כרתת ארזים״ (מלכים א ו, לו), חמישה מחזורים עד ראשה. חומת החצר הגדולה — חומה רגילה של אבני גזית.\nחומת החצר החיצונה נמוכה, ארבע אמות, וגם היא חומה רגילה, בלי נדבך ארז — כי לא נמצא מקור לנדבך ארז בחצר החיצונה.\nהגבהים — בחירת מודל.",
          refs: [["מלכים א ו, לו", V(10, 6, 36)], ["מדות ב, ג", MI(2, 3)]] },
        { t: "שערי החצר הגדולה ומעלותיהן", view: "eastGate", // SPEC 3 / 20-mount.js: N/S gates at x 103 (mid-side), E/W on z 0, 56 steps of 0.5 from the ground (-28)
          info: "במלכים אין מספר לשערי החצר הגדולה ואין מקום.\nבמודל: **שער אחד בכל צד** — הצפוני והדרומי באמצע הצלע, המזרחי והמערבי על ציר הבית — כך ששלושת השערים המזרחיים (החצר הגדולה, החצר החיצונה, חצר הכהנים) עומדים בקו אחד — וכרלב״ג (מלכים א ו, לא): 'כי היתה החמשית לדביר והרביעי׳ להיכל והשלישית לפתח האולם והשנית לחצר הכהני׳ והראשונה לעזרה הגדולה' (וכן אברבנאל שם); אל כל שער עולות מן הקרקע 56 מעלות של חצי אמה. דלתותיהם — עץ; דלתות הנחושת (דברי הימים ב ד, ט) — בשערי החצר הפנימית, כרש״י שם. בחירת מודל.",
          refs: [["דברי הימים ב ד, ט", V(39, 4, 9)], ["מלכים א ז, יב", V(10, 7, 12)], ["רלב״ג מלכים א ו, לא", { book: 3645, index: 194 }], ["אברבנאל מלכים א ו, לא", { book: 3574, index: 355 }]] },   // fix-d (25, 35)
        { t: "העמוד — במה ועמוד במבוא", tg: () => oci("עמוד", OCI_FB.amud), cam: () => ociCam("עמוד", OCI_FB.amud, 24),
          info: "הפסוקים אומרים שהמלך עמד 'על העמוד כמשפט' (מלכים ב יא, יד; כג, ג), 'במבוא' (דברי הימים ב כג, יג), ואינם מתארים אותו.\nבמה — רש״י (דברי הימים ב כג, יג): 'עומד המלך או הדוכוס במקום גבוה כדי שיוכלו לראותו', מבימת שלמה (דברי הימים ב ו, יג); רש״י (מלכים ב יא, יד): 'הוא מעמד המלך בבית ה׳'; מצודת דוד: 'על מקום מיוחד למלך לעמוד שם'; התרגום: 'אסטונא'. ועמוד שהמלך עומד לידו — רד״ק (מלכים ב יא, יד): 'עומד על העמוד. פי׳ סמוך לעמוד וכן וזבחת עליו סמוך לו'; ובדברי הימים (ב לד, לא): 'רוצ׳ לומ׳ שעמד על רגליו סמוך לעמוד'. רלב״ג (מלכים ב יא, יד): 'עומד על העמוד. ר״ל אצל העמוד'.\nבמודל — שתי שיטות (בתפריט, תחת ״שיטות ומחלוקות״: ״העמוד — מקום המלך״). **ברירת המחדל — במה**, כרש״י, מצודת דוד והתרגום: במה עגולה של אבן, ארבע אמות רוחבה ואמה גובהה, עם שתי מעלות, ועליה עמוד קצר. **עמוד שהמלך עומד לידו**, כרד״ק ורלב״ג: עמוד אבן לבדו על רצפת החצר, שש אמות גובהו. שניהם בחצר החיצונה, סמוך למעלות שער חצר הכהנים ממזרח — 'במבוא'. צורת הבמה והעמוד, גובהם ומקומם המדויק — בחירת מודל.",
          refs: [["מלכים ב יא, יד", V(11, 11, 14)], ["מלכים ב כג, ג", V(11, 23, 3)], ["דברי הימים ב כג, יג", V(39, 23, 13)], ["דברי הימים ב ו, יג", V(39, 6, 13)], ["רש״י דברי הימים ב כג, יג", { book: 3662, index: 709 }], ["רש״י מלכים ב יא, יד", { book: 3680, index: 418 }], ["מצודת דוד מלכים ב יא, יד", { book: 3335, index: 722 }], ["רד״ק מלכים ב יא, יד", { book: 3542, index: 573 }], ["רלב״ג מלכים ב יא, יד", { book: 3644, index: 366 }], ["רד״ק דברי הימים ב לד, לא", { book: 3522, index: 541 }]] },   // AMUD2_D (fix-d, 132)
        // 1.0.1-L (L.77; the numbers from the model): the block of bases, Moses' laver, the Sea in the corner
        // 1.0.1-L (Part 7, U4, "כנ״ל מקום הכיורות צריך להיות מרחוק יותר"): the whole block and what is round it, from high and far (model choice)
        { t: "מקום הכיורות והים", cam: [84, 112, 108], tg: [36, 6, 36],
          info: "במקורות אין מרחקים לכלי הנחושת.\nבמודל — המכונות, כציור 'מקרא מפורש' (עמ' לח) ומפתו (עמ' ב–ג): גוש אחד, שתי שורות של חמש, מזרחה למערב, וכיור משה ביניהן, בתוך הרצועה שבין קו כותל ההיכל הימני לכותל העזרה הימני, בין אגף האולם הדרומי לכבש. השורות " + nf(blkRows[0]) + " ו־" + nf(blkRows[1]) + " אמות מציר הבית, " + nf(Math.abs(blkCols[1] - blkCols[0])) + " אמות בין מכונה למכונה (בין האגף לכבש 23 אמות בלבד, ולכן השורה הצפונית ביניהם והדרומית מעט מדרום להם). הים בקרן מזרחית צפונית (רש״י ז, לט), ממזרח לצפון בית המטבחים, ציר הים " + nf(courtE - seaXm) + " אמות מן הכתלים; בשיטה השנייה בקרן מזרחית דרומית. בחירת מודל.",
          refs: [["מלכים א ז, לט", V(10, 7, 39)], ["דברי הימים ב ד, ו", V(39, 4, 6)], ["ד, י", V(39, 4, 10)]] },
        // 1.0.1-K (K.3): the bases
        { t: "המכונות — האופנים, הכיור והכן", view: "mechonaClose",
          info: "בפסוקים ובפירוש רש״י: המכונה ארבע על ארבע ושלוש קומתה, האופנים אמה וחצי, הכותרת ופיה, הכן והכיור של ארבע (מלכים א ז, כז–לח).\nבחירות מודל: האופנים בתוך ריבוע המכונה, בשפתה ובנחושת כהה כדי שייראו (הספר מצייר אותם בפינות, בולטים; בנסיעה לצפון ולדרום החישוקים יוצאים מעט מן הריבוע); 'אופן בתוך אופן' כציור הספר (עמ' לז) ובביאורו לרש״י — גלגל קטן שוכב המסובב את האופן הגדול לצדדים סביב מקל היורד מן המכונה, והגדול הולך קדימה ואחור (לרש״י הידות הן ציר הגלגל, ולבעל צורת הבית — מקלות התחובים בזוגות אופנים); חלוקת גוף המכונה בין המסגרת, הלוחות, הנסרים והכותרת.\nהכיור: 1.9 אמות רוחבו מבחוץ, אמה וחצי ורביע מבפנים — 'אם היה כולו עגול, היה מחזיק בחללו...' (מלבי״ם ז, כח); למלבי״ם עצמו, שהתחתונה מרובעת, זו המידה מבחוץ; 1.9 מבחוץ בחירת מודל, כדי להכיל ארבעים בת; עובי הדופן, רוחב ריבוע הכן (2.2) ועובי מחיצת פי הכותרת (0.1); הכיור בגובה ארבע — כמצודת דוד ומלבי״ם (רלב״ג מפרש את הארבע כרוחבו); ומידת ההרמה בפירוק.",
          refs: [["מלכים א ז, כז", V(10, 7, 27)], ["ז, לב", V(10, 7, 32)], ["ז, לא", V(10, 7, 31)], ["ז, לח", V(10, 7, 38)]] },
        // 1.0.1-L (L.61, L.63; vessels-2.md)
        { t: "המכונות — שלוש מסגרות בכל צד והציורים", view: "mechonaClose",
          info: "במודל: **שלוש מסגרות בין השלבים בכל צד, כביאור הגר״א**. הציורים דקים ושטוחים (בחירת מודל).\nרש״י: על הליות — 'ואין בולטין בעביו, ולא חקוקים בשקוע' (ז, כט); על המסגרות התחתונות והנסרים — 'פתח וחקק' (ז, לו).\nצורתם — ארי ובקר זה מול זה, ומתחתם כרובים וליות חבוקות — כציור הספר (עמ' לד), בחירת מודל.",
          refs: [["מלכים א ז, כח", V(10, 7, 28)], ["ז, כט", V(10, 7, 29)], ["ז, לו", V(10, 7, 36)]] },
        // 1.0.1-L (L.9, L.10, L.40; vessels.json FOR-UI): the taps, Moses' laver without the spouts, the demonstration
        { t: "ברזי הכיורות", view: "mechonaClose",
          info: "ברזי הכיורות — לכיורות דדים: 'כעין דוד ולה דדים המריקים מים' (מצודת ציון דברי הימים ב ד, ו).\nבמודל: שני ברזים לכל כיור, צורתם ומקומם לאורך השורות — כציור הספר (עמ' לח), בחירת מודל. הצינור ארוך מעט מן הציור, כדי שמי ההדגמה ירדו לרצפה מחוץ לגוף המכונה. בחירת מודל.",
          refs: [["מלכים א ז, לח", V(10, 7, 38)], ["דברי הימים ב ד, ו", V(39, 4, 6)]] },
        { t: "כיור משה — שני הברזים", view: "kiyorMoshe", tg: [rowX, 9, kz], cam: [rowX + 18, 19, kz],
          info: "לכיור משה שני ברזים: 'בן קטין עשה שנים עשר דד לכיור, שלא היו לו אלא שנים' (משנה יומא ג, י) — לפני בן קטין היו לכיור שניים בלבד, ושנים עשר הדדים הם תוספת של בית שני.\nבמודל: צורת הברזים, גובהם וצדיהם, צורת הכיור ומקומו בין שתי שורות המכונות — בחירת מודל, כציור הספר.",
          refs: [["משנה יומא ג, י", MN(55, 3, 10)], ["שמות ל, יח", V(2, 30, 18)]] },
        { t: "הדגמת המכונה — המסלול והמים", view: "mechonaDemo",
          info: "**לאן הוליכו את המכונות** — רש״י (מלכים א ז, לז), בשם בעל צורת הבית: 'למען יוכל להוליכם אל אשר יהיה הרוח והרצון להוליכם' — בלי מקום קבוע.\nבמודל — ההדגמה (הכפתור שעל המכונה שבשורה הצפונית): היא עוצרת תחילה בין האולם למזבח, ליד הכבש, לקידוש ידים ורגלים — 'ורחצו אהרן ובניו ממנו את ידיהם ואת רגליהם' (שמות ל, יט); אחר כך היא נוסעת לשלחנות השיש שבבית המטבחים — 'שעליהן מדיחין את הקרבים' (שקלים ו, ד), 'וקרבו וכרעיו ירחץ במים' (ויקרא א, ט) — ומי הכיור יורדים מן הברז — 'מן מימי הכיור ידיחו קרבי העולה' (רש״י דברי הימים ב ד, ו) — וחוזרת. לפני כל שינוי כיוון הגלגלים הקטנים מסובבים את הגדולים, וגוף המכונה אינו מסתובב. המסלול, התחנות והמים — בחירת מודל על פי המקורות.",
          refs: [["דברי הימים ב ד, ו", V(39, 4, 6)], ["שמות ל, יט", V(2, 30, 19)], ["משנה שקלים ו, ד", MN(54, 6, 4)], ["ויקרא א, ט", V(3, 1, 9)], ["מלכים א ז, ל", V(10, 7, 30)]] },
        // 1.0.1-K (K.1): Yachin and Boaz - review UI-H2 / K.1: the 1.0.1 centres (5.5, 6.9) were Radak's capital; now as close to the wall as the doorposts allow
        { t: "מקום יכין ובועז בתוך האולם", view: "yachinBoaz",
          info: "העמודים עומדים בתוך האולם, מימין ומשמאל לפתח ההיכל — רש״י (מלכים א ז, טו: 'שהעמיד באולם'), רד״ק ומצודות על דברי הימים ב ג, טו; מלבי״ם לבדו מעמידם בחוץ.\nרש״י (ירמיהו נב, כג): 'העמידם שלמה באולם סמוך לכותל ההיכל, והכותל מכסה ארבע רמונים מכל טור' — ולכן הם צמודים ככל האפשר.\nבמודל: מרכזיהם " + nf(pil.x - houseE) + " אמות לפני כותל ההיכל ו־" + nf(pil.z) + " אמות מן הציר לכל צד, והכותרת שתי מאיות אמה בלבד מקירות הצד של האולם וממזוזות פתח ההיכל. לגעת בכותל לא יכלו — בין מזוזת פתח ההיכל לכותל הצדדי של האולם יש ארבע אמות בלבד, והכותרת רחבה כחמש אמות ושלושה חומשים. בחירת מודל.",
          refs: [["רש״י מלכים א ז, טו", V(10, 7, 15)], ["רש״י ירמיהו נב, כג", V(13, 52, 23)], ["דברי הימים ב ג, טו", V(39, 3, 15)], ["מלכים א ז, כא", V(10, 7, 21)]] },
        { t: "צורת כותרות יכין ובועז (רש״י ז, יח, כציור הספר)", view: "yachinBoazCapital",
          info: "הפסוקים נותנים את גובה העמוד והכותרת, השבכה, השושן ומאתיים רימונים.\nבמודל — הצורה כרש״י (ז, טז–יח) וכציור הספר: העמוד חלול, ארבע אמות עוביו, תחוב בכותרת שתי אמות (**סך הכל עשרים ואחת**); הכותרת שני אגנים — הגולה התחתונה מצוירת שושנים, הבטן ועליה שני טורי רימונים על שרשרות, השבכה ככיפה קלועה, וכותרת קטנה של אמה בראשה.\nבקצרה — המחלוקות: רש״י (ז, טז, ממשנת ארבעים ותשע מידות; וכן רד״ק ומצודות) מביא ששתי האמות התחתונות 'היו שוות לעמוד, שלא היו בהן צורה' — הספר והמודל עושים אותן אגן מצויר, כרש״י ז, יח. רד״ק ומצודות תוחבים את העמוד בכותרת חצי אמה בלבד (עשרים ושתיים וחצי). מלבי״ם מעמיד את העמודים בחוץ, ושיטתו לכותרת — במתג 'כותרות יכין ובועז' בתפריט, תחת ״שיטות ומחלוקות״ (צורת הרשת, הרימונים והציור בחירת מודל; בשיטה זו העמודים עומדים לפני האולם (ז, כא), והשושן מצויר על חזיתו). רלב״ג — עמודים קטנים עולים מן השבכה.\nמידות הקימורים, גודל הרימונים והשושנים ומספר השושנים — בחירת מודל.",
          refs: [["מלכים א ז, טו", V(10, 7, 15)], ["ז, טז", V(10, 7, 16)], ["ז, יח", V(10, 7, 18)], ["ז, כ", V(10, 7, 20)], ["ירמיהו נב, כא", V(13, 52, 21)]] },
        { t: "חלוני ההיכל: שישה בכל צד", tg: [-35, 34, 14.5], cam: [-20, 40, 52], // 50-heichal.js WIN_X: 6 per side along the kodesh, on the house wall above the chambers' roof (the user's sheet, item 16)
          info: "הפסוק: 'ויעש לבית חלוני שקפים אטומים' (מלכים א ו, ד) — בפסוק אין מספר ואין מקום. צורתם רחבה מבחוץ וצרה מבפנים (רש״י; מנחות פו:).\nבמודל: **שישה חלונות בכל צד**, צפון ודרום, לאורך ההיכל בלבד, ברצועה שמעל גג היציע (מלבי״ם), וכן אברבנאל (מלכים א ו, ה): 'שעד חמש עשרה אמות מהכותל עשה היציעים ומשם ומעלה לא נעשה דבר, בעבור שהיה פנוי לעשות שמה החלונים שקופים אטומים'; אין חלונות בדביר ובכותל המערב. המספר — בחירת מודל.",
          refs: [["מלכים א ו, ד", V(10, 6, 4)], ["מנחות פו:", P(131, "פו:")], ["אברבנאל מלכים א ו, ה", { book: 3574, index: 321 }]] },   // fix-d: the Abarbanel - the place
        { t: "פריסת העליות על הבית והאולם בלבד", view: "aliyot", layer: "aliyot", // 50-heichal.js aliyot layer: x -67.5..18.5, z +-14, not over the wings (SPEC 6)
          info: "רש״י (דברי הימים ב ג, ד) אינו אומר על מה עמדו העליות.\nבמודל: העליות בנויות על הבית ועל האולם בלבד — מן הכותל המערבי עד חזית האולם, ברוחב כותלי הבית העליונים — ולא על כנפי בית החליפות; **שתי עליות, זו על גב זו, עד גובה 120 אמה** מרצפת הבית, כאיור הספר. בחירת מודל.",
          refs: [["דברי הימים ב ג, ד", V(39, 3, 4)], ["מלכים א ו, ג", V(10, 6, 3)]] },
        // ---- 1.0.1-H: the second round of the user's corrections (FIXES-1.0.1-H.md); 1.0.1-K: K.4 / K.5 ----
        { t: "דוגמת הגילופים (ו, יח; ו, כט)", view: "carvings",
          info: "הפסוקים נותנים את מיני הגילוף — מקלעת, כרובים, תמורות, פטורי ציצים ופקעים — ולא את סידורם וגודלם.\nבמודל, כציור הספר (שהוא עצמו מציין שסדר העיטורים להמחשה בלבד): משבצת אחת של חמש אמות רוחב ועשר גובה היא שורה — חבל שזור בתחתיתה, זוג כרובים בגובה שלוש אמות ושליש תחת קשת כנפיהם, שושנים בשלשות, פקע כביצה, שלוש שרשרות תלויות ודקל בגובה שבע אמות ושליש בין כל שני זוגות; שלוש שורות בהיכל (שלושים אמה), שתיים בדביר (עשרים) ושתיים על כל דלת. הדוגמה נמשכת על פני כל הקירות, אמה טרקסין והדלתות בלי תפר. בחירת מודל.",
          refs: [["מלכים א ו, כט", V(10, 6, 29)], ["ו, יח", V(10, 6, 18)], ["ו, לה", V(10, 6, 35)]] },
        // 1.0.1-K (K.5.3 / the addendum D): an option, the default all gold
        { t: "שכבות הקיר והרצפה — תצוגה בלבד", view: "wallLayers",
          info: "הפסוקים מונים אבן, ארז וזהב בקירות, ואבן, ברושים וזהב ברצפה (מלכים א ו, ז; ו, טו; ו, יח; ו, כא–כב; ו, ל) — ובבית עצמו 'הכל ארז אין אבן נראה', והכל זהב.\nבמודל: החלון המדורג שבקיר הצפוני של ההיכל, סמוך לפתח ההיכל (שתים עשרה אמות רוחבו וארבע עשרה גובהו), וברצפה שלפניו — כציור הספר — הוא **אפשרות תצוגה** בכפתור 'הצג את שכבות הקיר והרצפה'; מקומו, מדרגותיו, צבע הארז ולוחותיו הזקופים (אמה רוחב כל לוח) ועובי השכבות (ארז 0.15 בקיר; ברוש 0.04 ברצפה) — בחירת מודל. רצפת הזהב על לוחות ברוש, אמה רוחב כל לוח לאורך הבית — בחירת מודל.",
          refs: [["מלכים א ו, טו", V(10, 6, 15)], ["ו, יח", V(10, 6, 18)], ["ו, ל", V(10, 6, 30)]] },
        // 1.0.1-K (K.4): the tables
        { t: "השולחנות — מידותיהם והלחם", view: "shulchanMoshe",
          info: "מידות עשרת השולחנות של שלמה אינן בפסוקים.\nבמודל: כל אחד בתבנית שולחן משה ובמידתו — שתי אמות על אמה ואמה וחצי גובה (שמות כה, כג), אורכו לאורך הבית (משנה מנחות יא, ו: 'כל הכלים שהיו במקדש, ארכן לארכו של בית'). המסגרת מתחת לדף, כדעה השנייה ברש״י וכציור הספר. הסניפין, הקנים והבזיכין על כולם; הלחם — על שולחן משה תמיד, ועל העשרה רק לרבי אלעזר בן שמוע — לתנא קמא הם עומדים בלא לחם.\nמקום שולחן משה: לרבי בראש שתי השורות — 'כתלמיד היושב לפני רבו' (מנחות צט.) — חצי אמה מערבה מקצה השורות (בחירת מודל); לר׳ אלעזר בר׳ שמעון — שתי אמות ומחצה מכותל צפון (תוספות מנחות צח:), וארכו לאורך הבית (מאירי יומא נא:).\nרוחב הסניפין כרוחב המערכה וחמשת פיצוליהם, צורת הבזיכין ועובי דפנות הלחם — כציור הספר, בחירת מודל; הבזיכין שעל השולחנות שבלא לחם — בלי לבונה.",
          refs: [["שמות כה, כג", V(2, 25, 23)], ["משנה מנחות יא, ו", MN(81, 11, 6)], ["מנחות צט.", P(131, "צט.")], ["מנחות צח:", P(131, "צח:")]] },
        // 1.0.1-L (L.71, L.73; interior.md): the menorot
        { t: "המנורות — משיכתן, המעלות והעיטורים", view: "menorot",
          info: "רלב״ג: המנורות משוכות מערבה מן השולחנות — 'הנה מפני שהשולחנות הם גם כן לפני הדביר ולא זכר זה אלא במנורות ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות' (מלכים א ז, מט), וכציור הספר; השיעור, אמה אחת — בחירת מודל. ובמקורות גם 'ומנורה בדרום משוכה מן הכותל שתי אמות ומחצה' (יומא לג:) ו'נכח השלחן' (רש״י: 'זה בצד זה').\nמנורת משה — לרבי בראש שורות המנורות, ולר׳ אלעזר בר׳ שמעון באמצע הטורים (מנחות צח:–צט.).\nהאבן: אבן של שלוש מעלות לפני כל מנורה (משנה תמיד ג, ט): 'ואבן זו היתה של שיש טהור, ויותר נאה מן הזהב, וגובהה ח׳ טפחים ומחצה, וארכה ט׳ טפחים' (ילקוט מעם לועז, במדבר) — שלוש מעלות שוות; רוחבה — בחירת מודל. צדה: **לרבי צפונית למנורה, לר׳ אלעזר בר׳ שמעון מערבית לה** (מעשי למלך על הרמב״ם ג, יא).\nהעיטורים: הגביעים, הכפתורים והפרחים (עשרים ושניים, אחד עשר ותשעה — מנחות כח:) לפי הטפחים שבברייתא; צורתם — 'כמין כוסות אלכסנדריים', 'כמין תפוחי הכרתיים', 'כמין פרחי העמודין'. הקנים — רש״י (שמות כה, לב): 'לכאן ולכאן באלכסון, נמשכים ועולין עד כנגד גבהה של מנורה', וישרים כציור הספר. העיטורים 'משקדים' — 'מצירים היו' (רש״י כה, לג), 'והכל משקדים כמו שקדים בעשיתן' (רמב״ם ג, ב). בטפח השישי הגביע על הקנה, הכפתור והפרח בצדיו — כציור הספר. הבסיס ועובי הקנים — בחירת מודל.",
          refs: [["רש״י שמות כה, לב", { book: 3692, index: 1793 }], ["רש״י שמות כה, לג", { book: 3692, index: 1795 }], ["רמב״ם ג, ב", { book: 337, index: 44 }], ["מעשי למלך ג, יא", { book: 4304, index: 89 }], ["רלב״ג ז, מט", { book: 3645, index: 312 }], ["יומא לג:", P(107, "לג:")], ["מנחות כח:", P(131, "כח:")], ["מנחות צח:", P(131, "צח:")], ["משנה תמיד ג, ט", MN(88, 3, 9)], ["רמב״ם בית הבחירה ג, י", RB(3, 10)], ["ג, יא", RB(3, 11)]] },
        // 1.0.1-K (K.4 / K.5): the golden altar
        { t: "מזבח הזהב — גובהו, מקומו, קרנותיו, שכבותיו ועשן הקטורת", view: "incenseAltar",
          info: "מזבח הקטורת של שלמה הוא 'אמה על אמה' (רמב״ם בית הבחירה ג, יז); (ולגר״א, כפי שמביא הר המוריה — שתיים על שתיים; בתפריט, ״מזבח הזהב — רוחבו״); גובהו בפסוקי מלכים אינו נתון; הר המוריה (על הרמב״ם שם): 'יש לתמוה למה לא כתב גובה קומתו שהיו ב׳ אמות כמבואר בזבחים נ״ט ב׳'.\nבמודל: כמזבח משה — 'ואמתים קמתו' (שמות ל, ב) — ו'ממנו קרנתיו': הקרנות בתוך האמתיים, טפח גובהן; זר הזהב (ל, ג) מעקה סביב גגו, טפח מתחת לראשי הקרנות — בחירת מודל.\nמקומו: על ציר הבית, מיד מזרחית לשורות השולחנות והמנורות — בחירת מודל; במקורות: בין השולחן למנורה, מחצי הבית ולפנים ומשוך קמעא כלפי חוץ (יומא לג:; מנחות צח:; רמב״ם שם), ובבית לא נמסרה מידה במספרים (במשכן: עשר אמות מן הפתח — רש״י שמות כו, לה) — הרווח מן השורות — אמתיים ורבע לרבי, ושתי אמות לר׳ אלעזר בר׳ שמעון — כדי שיהיה מעבר בין השולחנות ובין המזבח, כתירוץ רש״י (יומא נא:): ״שאין המזבח מכוון כנגד השולחן, אלא משוך קימעא כלפי חוץ״. ״קימעא״ — בלי מידה; המידה בחירת מודל.\nשכבותיו — אבן, ארז וזהב (מצודת דוד ו, כ; רלב״ג ו, כב) — בכפתור 'הצג את שכבות המזבח'. עשן הקטורת — עמוד ישר עד התקרה מעל שבע גחלים (יומא לח.; נג.) — מוצג תמיד (שמות ל, ז–ח); עוביו וצבעו — בחירת מודל.",
          refs: [["רש״י שמות כו, לה", { book: 3692, index: 1890 }], ["רמב״ם בית הבחירה ג, יז", RB(3, 17)], ["שמות ל, ב", V(2, 30, 2)], ["הר המוריה בית הבחירה ג, יז", { book: 5474, index: 167 }], ["זבחים נט:", { book: 130, index: 2049 }], ["שמות ל, ז", V(2, 30, 7)], ["יומא לג:", P(107, "לג:")], ["מנחות צח:", P(131, "צח:")], ["יומא לח.", P(107, "לח.")]] },
        // 1.0.1-K (K.4): the parochet
        { t: "הפרוכת — נשרים לצד ההיכל ואריות לצד הדביר", view: "parochet",
          info: "רש״י: 'ארי מצד זה ונשר מצד זה' (רש״י שמות כו, א) — ואיזה צד לאיזו דמות אינו נאמר.\nבמודל: **הנשרים לצד ההיכל והאריות לצד הדביר**, והאריות מהלכים מימין לשמאל, והנשרים ראשם לימין הצופה — בחירת מודל. האריג — תכלת, ארגמן, תולעת ושש — וסידור הדמויות בשורות, כציור הספר (חזרה כל ארבע אמות), וצורת הנשר והארי — בחירת מודל. הפרוכת תלויה בשתי שיטות פתח הדביר.",
          refs: [["שמות כו, א", V(2, 26, 1)], ["שמות כו, לא", V(2, 26, 31)], ["דברי הימים ב ג, יד", V(39, 3, 14)]] },
        // review Q2-3 / Q2-4: the Gemara's wording ("בנס הן עומדין", Abaye's challenge, "ומצודדים")
        { t: "גוף הכרובים — 'בנס הן עומדין' (בבא בתרא צט.)", view: "cherubim",
          info: "הפסוק: 'עשר אמות מקצות כנפיו ועד קצות כנפיו' (מלכים א ו, כד) לשני הכרובים — עשרים אמה, כל רוחב הדביר (ו, כז).\nבגמרא: 'אמר רבנאי אמר שמואל: כרובים — בנס הן עומדין' (בבא בתרא צט.; ושם: 'מקום ארון וכרובים אינו מן המדה'; ובמגילה י:: 'מקום ארון אינו מן המדה... ארון גופיה היכא הוה קאי? אלא לאו שמע מינה בנס היה עומד'). ושם מקשה אביי: 'ודלמא בולטין כתרנגולין הוו קיימי' — גופם תחת כנפיהם (רשב״ם) — ועוד קושיות אחריה.\nרש״י (ו, כד): 'וגוף הכרובים אינו מן המדה ועומד בנס'; רש״י בדברי הימים (ג, יא): לפי הפשט גופן בולט מן הכנפיים 'כעוף זה שפורש כנפיו'. רד״ק (ו, כז): הגוף תחת הכנפיים ואין צורך בנס.\nבמודל: **מודל אינו יכול להראות נס** — הגוף נבנה תחת הכנפיים, כקושיית אביי וכרד״ק, ושורש כל כנף בכתף, והכנפיים שוכבות במישור מאוזן אחד מתחת לראשים, וקצותיהן נוגעות בקירות וזו בזו — בחירת מודל.",
          refs: [["בבא בתרא צט.", P(124, "צט.")], ["מגילה י:", P(112, "י:")], ["רש״י מלכים א ו, כד", V(10, 6, 24)], ["רש״י דברי הימים ב ג, יא", V(39, 3, 11)], ["רד״ק מלכים א ו, כז", V(10, 6, 27)]] },
        // 1.0.1-K (K.4 / K.5 after the book p07L; the user: "את הכרובים עשית בצורה לא צנועה... לא מבואר שהיו להם ידיים")
        { t: "תבנית הכרובים ופניהם", view: "cherubim",
          info: "הפסוקים נותנים גובה עשר אמות, כנפיים של חמש, עמידה על הרגליים ו'פניהם לבית'; 'מעשה צעצעים' — תבנית ילדים (רש״י דברי הימים ב ג, י; 'כרביא', חגיגה יג:).\nבמודל — תבנית הדמות כציור הספר: דמות גבוהה וחלקה, לבושה ארוכה עד הקרקע בקפלים, בלי ידיים (אין להן זכר בפסוקים), ראש קטן ופני ילד, וכנפיים חלקות, כל כנף גוף אחד, היוצאות מן הכתפיים ושוכבות במישור מאוזן אחד מתחת לראשים, סוכה על הארון ('ויסכו הכרבים על הארון ועל בדיו מלמעלה', מלכים א ח, ז) — בחירת מודל. פני הילד: ראש סגלגל עם סנטר ולחיים, אף ישר, עיניים שקדיות בעפעפיים, פה קטן סגור וקו שיער — הכל זהב, כציור הספר.\nכרובי הכפורת שעל הארון — כנפיהם עולות מן הכתפיים מעל ראשיהם ונמשכות בקשת עד אמצע הכפורת, וקצותיהן נוגעים זה בזה (הנגיעה — כציור הספר): 'פרשי כנפים למעלה' (שמות כה, כ), רש״י: 'שלא תעשה כנפיהם שוכבים אלא פרושים וגבוהים למעלה אצל ראשיהם, שיהא עשרה טפחים בחלל שבין הכנפים לכפרת'. צורת הכנף ותווי הפנים — בחירת מודל.\nבמדרש — ילקוט שמעוני (נ״ך, רמז קפה): ״מעשה צעצועים שהם מטללים בכתרים״, ״והם עומדים על רגליהם כאות למ״ך. ופניהם לבית״. רלב״ג (דברי הימים ב ג, י): ״מעשה צעצועים. פירשו בזה בצורת נערים קטנים״; רשב״ם (בבא בתרא צט.): ״לשון צעצעים כלומר תינוקות״. הכתרים שבמדרש — אינם מצוירים.\nבקצרה — פניהם, שלוש דעות בתפריט, תחת ״שיטות ומחלוקות״: רש״י (ג, יג) — ראשם כפוף ופונה זה אל זה; רד״ק ומצודות — פניהם לבית, מזרחה; בבא בתרא צט. — 'ומצודדים פניהם כתלמיד הנפטר מרבו'. **ברירת המחדל — רש״י.**",
          refs: [["דברי הימים ב ג, י", V(39, 3, 10)], ["ג, יג", V(39, 3, 13)], ["חגיגה יג:", P(114, "יג:")], ["בבא בתרא צט.", P(124, "צט.")], ["ילקוט שמעוני נ״ך קפה", { book: 3059, index: 956 }], ["רלב״ג דברי הימים ב ג, י", { book: 3639, index: 63 }], ["רשב״ם בבא בתרא צט.", { book: 1959, index: 3454 }]] },   // fix-d (367, 368)
        { t: "פתח הדביר — שני ביאורי רש״י ל'מזוזות חמישית'", view: "devirDoor",
          info: "רש״י (מלכים א ו, לא) מביא שני ביאורים:\n(א) 'ואני אומר, מזוזות חמישית, חמשה צלעות היו למזוזות, ולא היתה מרבעת, ואינו מדבר לא במפתן ולא במשקוף' — **ברירת המחדל**: מזוזות מחומשות, צלע אחת כעובי הכותל והקודקוד אל הפתח, ומעליהן משקוף זהב בחתך המזוזות, כציור הספר (רד״ק: 'האיל הוא הסף העליון... וכן האיל'; רלב״ג: 'שהאיל והוא הסף אשר על הפתח'; מלבי״ם: 'האיל ר״ל המשקוף' — בחירת מודל).\n(ב) 'המפתן האחד והמזוזות מכאן ומכאן שתים הרי שלש, והמשקוף שעליו עשוי כשתים — כזה, כך שמעתי' — מפתן, שתי מזוזות מרובעות ומשקוף משתי קורות המוטות זו על זו כשער הטדי (מדות ב, ג); צורת הציור האבוד 'כזה' היא בחירת מודל.\nבמודל: רוחב הפתח שש אמות וגובהו שתים עשרה — בחירת מודל (רחב ממרווח בדי הארון, רש״י ו, כג).",
          refs: [["רש״י מלכים א ו, לא", V(10, 6, 31)], ["מלכים א ו, לא", V(10, 6, 31)], ["מדות ב, ג", MI(2, 3)]] },
        { t: "אמה טרקסין — שלושה חלקים", view: "traksinTop",
          info: "אמה טרקסין (יומא נא:; רש״י מלכים א ו, טז).\nבמודל: **שלושה חלקים מלאים** — שני עמודי הכותל שמצדי פתח הדביר (לכל ביאור של רש״י עמודים משלו, כי קצותיהם הולכים אחרי המזוזות) והחלק שמעל הפתח עד תקרת ההיכל, 18 אמות (מגובה 12 עד 30), ודוגמת הגילוף נמשכת ביניהם. כך החלק שמעל הפתח נראה בבירור משני הצדדים.",
          refs: [["מלכים א ו, טז", V(10, 6, 16)], ["יומא נא:", P(107, "נא:")], ["בבא בתרא ג.", P(124, "ג.")]] },
        // 1.0.1-K (K.6; review Q2-5): the model numbers of the readings of בית יער הלבנון, Ralbag credited only with what is his. 1.0.1-L (L.20, L.48; palace.md): three readings
        // FOREST_CARD_S1 (scan 1, finding 16): the small beams and thin boards as the model builds them since 1.2.7 (60-palace.js: four lines
        // of three beams across the house, three thin boards end to end along it; the card said twelve lines and sixteen boards - 1.2.1's)
        { t: "בית יער הלבנון — שלוש שיטות (רש״י / מלבי״ם ורלב״ג / מצודת דוד)", view: "forestUpper", layer: "palace",
          info: "מלכים א ז, ב–ו אינו אומר לאן פונים טורי העמודים, מהם 'הצלעות', מהם 'השקופים' ומהם 'עמודים ועב'. **שלוש שיטות במודל**, רש״י כברירת מחדל (בתפריט, תחת ״שיטות ומחלוקות״).\nבחירות מודל בשיטת רש״י, כציור הספר: עשרים ותשעה עמודים בטור, שתיים על שתיים, צפופים; הקומה התחתונה עשר אמות והעליונה שמונה עשרה וחצי (עם הכרותות והרצפה — שלושים); ארבעים ושמונה קורות בכל קיר עליון ומקום הפתחים והחלונות; הנסרים הגדולים חמש אמות רוחבם (שבעים וחמש מתוך המאה); על עשרים וחמש האמות הנותרות — ארבע שורות מרישין קטנים לרוחב הבית, שלושה בכל שורה, קצה מול קצה (רוחב 0.4, עובי 0.3), ועליהם נסרים דקים לאורך הבית, ממריש למריש — שלושה בכל טור; כותלי אבן בקצוות, כבספר; אולם העמודים נמוך, שתים עשרה אמה, והאולם הגבוה שלפניו חמישים על חמש עשרה וגובהו ארבעים.\nבשיטת מלבי״ם ורלב״ג: עובי הכתלים שלוש, מקום החלונות והפתחים, לוח הגג מאבן, האולם השני (חמישים על עשר) ושורת העמודים שלפניו.\nבשיטת מצודת דוד: אולם העמודים בצד המזרחי, חמישה עשר עמודים בטור (עמוד תחת כל לוח), גובה העמודים עשרים ושש, מידות הכרותות והצלעות, מקום הפתחים (באמצע ועשרים ואחת אמה לכל צד, כדי שיעמדו שלושתם מול האולם), שתים עשרה חלונות בכל שורה, גובה האולם שש עשרה וחצי ושורת העמודים והעב (חמישה עמודים בגובה עשר).\nצורת המגינים והכלים ומקומם — כציור הספר ('להמחשה בלבד'), בחירת מודל.",
          refs: [["מלכים א ז, ב", V(10, 7, 2)], ["ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["ז, ו", V(10, 7, 6)], ["רש״י ז, ו", V(10, 7, 6)], ["מלבי״ם ז, ב", V(10, 7, 2)], ["רלב״ג ז, ג", V(10, 7, 3)], ["מצודת דוד ז, ב", V(10, 7, 2)]] },
        // 1.0.1-K review (palace-courts-5): what the button removes and what each reading then shows (60-palace.js: rashiBoards45 +
        // rashiThinBoards; metzudotBoards45 + the roof slab and its two fascia beams)
        { t: "הסרת הנסרים — כלי צפייה בלבד", view: "forestRoof", layer: "palace",
          info: "הכפתור 'הסר את הנסרים' שעל גג בית יער הלבנון הוא **כלי צפייה בלבד, לא חלק מן הבניין** (כמו 'פתח את הבית' ו'פתח את האולם'), והמבט עצמו אינו מסיר דבר.\nבשיטת רש״י (ברירת המחדל): הוא מסיר את 45 נסרי הסיפון ואת הנסרים הדקים (מלכים א ז, ג–ד עם רש״י), ונראים מתחתם המרישין הקטנים ושקופיהם (רש״י ז, ד) והקומה העליונה; הכרותות, 'מעמוד לעמוד' על העמודים התחתונים (רש״י ז, ב), נשארות מתחת לרצפת הקומה העליונה.\nבשיטת מלבי״ם ורלב״ג: הוא מסיר את 45 הלוחות ואת גג האבן, ונראות הכרותות שעל העמודים — 'והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה' (רלב״ג ז, ג).\nבשיטת מצודת דוד: את 45 לוחות הארז, ונראות הצלעות והכרותות (מצודת דוד ז, ג). מה מוסר בכל שיטה — בחירת מודל.",
          refs: [["מלכים א ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["רש״י ז, ב", V(10, 7, 2)], ["רש״י ז, ו", V(10, 7, 6)], ["רלב״ג ז, ג", V(10, 7, 3)]] },
        // 1.0.1-K (K.6): the king's house, the garden, the throne
        { t: "בית המלך והגן — ריהוט ומידות", view: "kingsHouse", layer: "palace",
          info: "הפסוקים מזכירים את בית המלך (מלכים א ז, ח), את 'מאכל שלחנו ומושב עבדיו ומעמד משרתו' (י, ה) ואת כלי הזהב (י, כא); קהלת מזכיר גנות ופרדסים (ב, ה).\nבחירות מודל: בית המלך שמונים על שלושים, ארבעה חדרים — חדר אוכל, אולם כניסה בעמודי ארז, חדר משכב וחדר ישיבה — הריהוט, השטיחים והמנורות, הדלת הצפונית אל המעלות; הגן — שתי ערוגות ובהן שלושים ושישה עצי פרי, והדרך ביניהן — בחצר האחרת, בלי בריכה.",
          refs: [["מלכים א ז, ח", V(10, 7, 8)], ["י, ה", V(10, 10, 5)], ["י, כא", V(10, 10, 21)], ["קהלת ב, ה", V(32, 2, 5)]] },
        // 1.0.1-L (L.33; palace.md): the two courts and בית בת פרעה
        { t: "החצר האחרת ובית בת פרעה — מקומן ומידותיהן", view: "otherCourt", layer: "palace",
          info: "הפסוקים: 'וביתו אשר ישב שם חצר האחרת מבית לאולם' (מלכים א ז, ח); 'וחצר הגדולה סביב' (ז, יב).\nבחירות מודל, כציור הספר: **בית המלך בחצר נפרדת, ובית בת פרעה בתוך חצר בית יער הלבנון**; החצר הגדולה — חומתה הצפונית שלוש עשרה אמה וחצי מבית יער הלבנון ושער בה; דרך של אחת עשרה אמה בין שתי החצרות; החצר האחרת מאה וארבעים על שבעים ותשע וחצי, חומתה שתיים עוביה ושמונה גובהה, שני שערים של שמונה על שבע; מעקה נמוך בשולי המדרגה; בית בת פרעה שלושים על חמישים וגובהו עשרים, בחצר הגדולה, ממערב לאולם העמודים, ופתחו אל בית יער הלבנון (בספר: 'לא נתבאר ברש״י היכן מקום בית זה ביחס לבתים האחרים').\nבקצרה — המחלוקת: רלב״ג ומצודת דוד על ז, יב מקיפים בחצר הגדולה גם את בית המלך ('אשר היה מסבב כל בתי המלך') — לא נבנה כך.",
          refs: [["מלכים א ז, ח", V(10, 7, 8)], ["ז, יב", V(10, 7, 12)], ["מלכים א י, ה", V(10, 10, 5)], ["דברי הימים ב ח, יא", V(39, 8, 11)]] },
        // 1.0.1-L (L.57, L.78-L.81; palace-2.md): the throne's versions and what is only text
        { t: "כסא שלמה — הגרסאות", view: "throne", layer: "palace",
          info: "הפסוקים (מלכים א י, יח–כ; דברי הימים ב ט, יז–יט) נותנים כסא שן מצופה זהב, שש מעלות, ראש עגול, ידות, שני אריות אצל הידות ושנים עשר על המעלות; רש״י מפנה: 'וכל צורת הכסא מפרשת באגדת מגלת אסתר'.\nכל השאר מן המדרשים, והמודל מציג כל מדרש בגרסה משלו — המתג 'כסא שלמה — לפי איזה מדרש': הפסוקים ומפרשיהם (ברירת המחדל, בלי מנגנון ובלי עלייה); תרגום שני לאסתר; אסתר רבה עם פנים אחרים ואבא גוריון; ובית המדרש ב.\nבחירות מודל: מידות הכסא וצורת כל החיות (גופים פשוטים, כאמה אורכם), הכבש (שש על שלוש), סוכת הגפנים, מקום העמודים והתמרים, הארון ליד המושב, מקום התנין, צבעי האבנים, זמני העלייה והרעש; 'הארי של שמאל' — המזרחי (המלך פניו לדרום).\nבטקסט בלבד: בנות הים, שבעים ושניים האריות והנשרים של תרגום שני (בנויים שנים עשר ושנים עשר), האבות והחסידים שעל המנורה, פנים המנגנון, והכרוז שעל המעלות; **והמלך עצמו אינו בנוי** — מקומו בעלייה ניכר ממה שהכסא עושה.\nועוד: 'ראש עגול' למצודת דוד ולאברבנאל — כיפה מלמעלה ('כעין כיפת כובע', 'שהיה מכסה מלמעלה') — לא נבנה. המנגנון: בן יהוידע על סנהדרין קו: — ראו 'עליית המלך לכסא'.",
          refs: TH_REFS.pesukim.concat(TH_REFS.estherRabbah.slice(0, 3), TH_REFS.targumSheni.slice(0, 1), TH_REFS.beitHamidrash.slice(0, 1)) },
        // 1.0.1-K (integration): the marble floor of the inner court
        { t: "רצפת השיש בחצר הכהנים", tg: [64, 6.1, -42], cam: [86, 14, -30],
          info: "שהרצפה הייתה שיש — מרש״י על 'ואבני שיש לרב' (דברי הימים א כט, ב): 'לעמודים ושלחנות ולרצפה'; הפסוק אינו אומר איזו רצפה.\nבמודל: **רצפת חצר הכהנים כולה, בין כתליה, לוחות שיש לבנים** של שלוש על שלוש אמות, והרצועה שמתחת לחומה ומחוצה לה — אבן. מקום השיש וגודל הלוחות — בחירת מודל.",
          refs: [["דברי הימים א כט, ב", V(38, 29, 2)]] },
        // 1.0.1-K (K.6.5): לשכת הגזית - all Second-Temple sources
        { t: "לשכת הגזית — מקורות מבית שני", view: "lishkatHaGazit",
          info: "כל מקורות לשכת הגזית — יומא (יט.; כה.), הרמב״ם (בית הבחירה ה, יז), משנת מדות (ה, ד), משנת סנהדרין (א, ו; ד, ג) ומשנת תמיד — מדברים בבית שני; בספר מלכים אין זכר ללשכה (לבית ראשון: רש״י דברי הימים ב לד, כב; מהרש״א בבא בתרא צא:).\nלכן היא כולה **בחירת מודל**: בצפון כיומא (יט.) וכרמב״ם (בית הבחירה ה, יז) — ולא כמשנת מדות הנדפסת (ה, ד: 'שבדרום') — בחלקו המזרחי של החומה מול המזבח, בין השער הצפוני לים; לאורך החומה, כעשרים וארבע על תשע עשרה וגובהה עשרים ושתיים, כתלי גזית ('והיתה עשויה גזית לכבודם של הסנהדרין' — תוספות יום טוב), רצפתה כולה בגובה החצר ('שהלשכה היתה קרקעיתה שוה' — שם), וקומה מוגבהת על הגג ('כמין בסילקי גדולה'; רש״י: 'בית גבוה שעל עלייה'), שני פתחים — ומן הפתח החיצון שתים עשרה מעלות אל החצר הגדולה — ושבעים ואחד מושבים בשורה אחת, כחצי גורן, בחצי החול שבמערב (כמאירי); מקום הפייס אינו מצויר בבית ראשון. שלוש שורות התלמידים (סנהדרין ד, ד) — לפני הדיינים, לפי רש״י או יד רמה (בתפריט, תחת ״שיטות ומחלוקות״), ושני הסופרים עומדים לפניהם.",
          refs: [["יומא יט.", P(107, "יט.")], ["רמב״ם בית הבחירה ה, יז", RB(5, 17)], ["מדות ה, ד", MI(5, 4)], ["יומא כה.", P(107, "כה.")], ["תוספות יום טוב מדות ה, ד", { book: 948, index: 208 }]] },
        // 1.0.1-L (L.68; courts-2.md FOR-UI §2): the slaughter place, a Second Temple completion
        { t: "בית המטבחים — הטבעות, השולחנות והננסין (מקורות מבית שני)", view: "slaughterPlace",
          info: "בספר מלכים אין זכר לטבעות, לשולחנות ולננסין; כולם במשנת מדות (ג, ה; ה, ב), תמיד (ג, ה; ד, א) ושקלים (ו, ד), ואת הטבעות תיקן יוחנן כהן גדול (סוטה מח.).\nבמודל — השלמה מבית שני, בצפון המזבח, מולו: שמונה אמות מן המזבח, מקום הטבעות עשרים וארבע (שש שורות של ארבע, ארבע אמות בין טבעת לטבעת), ארבע אמות עד אמצע השולחנות — שמונה שולחנות שיש בשתי שורות מצפון לדרום — וארבע מהם לננסין: שמונה עמודי אבן נמוכים בשתי שורות של ארבעה, שבע אמות ביניהן, ועליהם חתיכות ארז מרובעות עם שלושה סדרי אונקליות ברזל (1.7, 2.6, 3.5 אמות מן הרצפה) בצד מזרח, צפון ודרום; ושמונה אמות מן השורה האחרונה עד כותל העזרה; פני לשכת הגזית בתוך שמונה האמות האלה, כציור הספר.\nבחירות מודל: צורת הטבעות (קשת נחושת, 1.1 על 0.55) ומרחקן לרוחב, גודל השולחנות (2 על 1, גובה 1.5 — כמידות שולחן לחם הפנים), גובה הננסין עם הארז (4: אבן 1.4 וארז 2.6) וגובהי האונקליות: אין לכך מספר במקורות, אלא 'הרבה פחות מקומת איש המפשיט' (יכין מדות ג, ה), והמספרים כבמודל בית המקדש השני. בבית שני היה מקום הננסין שתים עשרה אמה ומחצה (רמב״ם בית הבחירה ה, יג); כאן שבע, כי החצר קצרה.",
          refs: [["מדות ג, ה", MI(3, 5)], ["מדות ה, ב", MI(5, 2)], ["משנה שקלים ו, ד", MN(54, 6, 4)], ["משנה תמיד ד, א", MN(88, 4, 1)], ["סוטה מח.", P(119, "מח.")], ["רמב״ם בית הבחירה ה, יג", RB(5, 13)], ["צורת בית המקדש להתפארת ישראל", { book: 6029, index: 99 }]] },
        // 1.0.1-L (L.72; heichal-door.md): the two tables in the ulam
        { t: "שני השולחנות שבאולם — צורתם ומקומם", view: "ulamTables",
          info: "במודל: שני שולחנות פשוטים במידת שולחן לחם הפנים, שתי אמות על אמה וגובה אמה וחצי (שמות כה, כג) — דף, ארבע רגליים ומסגרת — בחירת מודל.\nמקומם: בתוך האולם, משני צדי המעבר לפני פתח ההיכל — 'אצל פתח ההיכל' (רש״י מנחות צט.). הצד — **הכסף (למשנה: השיש) בצפון והזהב בדרום**: בבית שני — תפארת ישראל (צורת בית המקדש, בבית שני): ״שני שולחנות עומדים מבפנים באולם, א׳ מימין וא׳ משמאל לפתח. בימיני של שיש נותנין לחם הפנים קודם שיכניסום להיכל. ובשמאלי של זהב, שהוא בימין היוצא, נותנין לחם הפנים כשיוציאום מההיכל״ — ימין הנכנס מערבה הוא צפון; בבית ראשון — כמותו. מוסתרים כברירת מחדל; בוחרים במתג 'שני השולחנות שבאולם'.",
          refs: [["מנחות צט.", P(131, "צט.")], ["משנה מנחות יא, ז", MN(81, 11, 7)], ["שמות כה, כג", V(2, 25, 23)]] }
      ];
      PLACES.push(["השלמות מחז״ל ובחירות מודל", EXTRAS]);
      // 1.0.1-L (L.88; part5-kelim.md FOR-UI 1): the exhibit of 57-kelim.js, for looking at: no 15 seconds (timed: false); the text comes from the module
      if (ctx.shared.kelim) {
        const gK = PLACES.find((g) => g[0] === "המזבח וכלי הנחושת");
        if (gK) gK[1].push({ t: "כלי הבית — סוף פרק ז", cam: [-68, 44, -72], tg: [-68, 4, -118],   // the whole stand between the card and the panel (the pill and the presentation: flyPoints.kelim)
          
          feature: { key: "kelim", timed: false, isOn: () => !!(ctx.shared.kelim && ctx.shared.kelim.on),
            on: () => ctx.shared.kelim.set(true), off: () => ctx.shared.kelim.set(false) },
          info: ctx.shared.kelim.info, refs: ctx.shared.kelim.refs });
      }
      // 1.0.2 (item 7, the user: "מעולה"): השיתין beside the altar's place - ctx.shared.shitin (40-altar.js: its title, text and sources; the text
      // says it is a completion from the Mishnah); its fly point is the module's (flyPoints[shitin.fly]); no contract or no fly point, no button
      {
        const shi = ctx.shared.shitin;
        const gM = PLACES.find((g) => g[0] === "המזבח וכלי הנחושת");
        if (gM && shi && shi.info && shi.fly) {
          const at = gM[1].findIndex((it) => it.t === "מזבח הנחושת");
          gM[1].splice(at >= 0 ? at + 1 : gM[1].length, 0, { t: String(shi.title || "השיתין"), view: String(shi.fly), info: String(shi.info), refs: Array.isArray(shi.refs) ? shi.refs : [] });
          // 1.0.2 (fix, DEV_NOTES rule 6): a completion from the Mishnah is also listed in "השלמות" - merged into the altar group's button
          // (UI_MERGE below, as לשכת הגזית), so one place keeps one button; the same text, so the kept card does not repeat it
          EXTRAS.push({ t: "השיתין — השלמה מן המשנה", view: String(shi.fly), info: String(shi.info), refs: Array.isArray(shi.refs) ? shi.refs : [] });
        }
      }
      // 1.0.2 add-on (DEV_NOTES rule 6, the review): the yesod, the sovev and the red line (ctx.shared.altarProfile) and the two small ramps
      // (ctx.shared.altarRamps), 40-altar.js - completions from the Mishnah and the Gemara with model choices in their texts. The profile: a
      // place after "השיתין" (as the shitin) and an item in "השלמות" merged into it (UI_MERGE); the ramps: an item in "השלמות" with both
      // readings' texts, and the row's chips on its card (UI_OPS_P). The words and sources are the module's; no contract, nothing.
      {
        const fpOk = (k) => typeof k === "string" && ctx.shared.flyPoints && ctx.shared.flyPoints[k] ? k : "mizbeach";
        const joinRefs = (lists) => {
          const out = [], seen = new Set();
          for (const l of lists) for (const r of Array.isArray(l) ? l : []) if (Array.isArray(r) && !seen.has(r[0])) { seen.add(r[0]); out.push(r); }
          return out;
        };
        const AP = ctx.shared.altarProfile;
        const gM = PLACES.find((g) => g[0] === "המזבח וכלי הנחושת");
        if (gM && AP && AP.yesod && AP.sovev && AP.redLine) {
          const parts = [AP.yesod, AP.sovev, AP.redLine];
          const info = parts.map((p) => String(p.info || "")).join(" "), refs = joinRefs(parts.map((p) => p.refs));
          let at = gM[1].findIndex((it) => it.t === "השיתין");
          if (at < 0) at = gM[1].findIndex((it) => it.t === "מזבח הנחושת");
          gM[1].splice(at >= 0 ? at + 1 : gM[1].length, 0, { t: "היסוד, הסובב וחוט הסיקרא", view: fpOk("mizbeachSW"), info, refs });
          EXTRAS.push({ t: "היסוד, הסובב וחוט הסיקרא — השלמה מן המשנה", view: fpOk("mizbeachSW"), info, refs });
        }
        // 1.3.3 (the user: "הוספת את מדידת אמות המזבח לבית ראשון?"): the altar's measures drawn - ctx.shared.altarMeasures (40-altar.js): a frame
        // round every step with its number of amot, by the reading of the row "מידות המזבח"; 15 s (the rule), from the north-east above
        const AMs = ctx.shared.altarMeasures;
        if (gM && AMs && typeof AMs.set === "function") {
          let at = gM[1].findIndex((it) => it.t === "היסוד, הסובב וחוט הסיקרא");
          if (at < 0) at = gM[1].findIndex((it) => it.t === "מזבח הנחושת");
          gM[1].splice(at >= 0 ? at + 1 : gM[1].length, 0, { t: "מידות המזבח — קווי האמות", view: fpOk("mizbeachMeasures"),
            feature: { key: "altarMeasures", timed: false, isOn: () => AMs.get(), on: () => AMs.set(true), off: () => AMs.set(false) },   // MEASURES_211: while the place shows
            info: String(AMs.info || "") + "\nבמודל: קו לכל מידה, בגובהו ובצבע משלו, ולצד המזבח לוחית לכל קו במסגרת בצבעו — זו מעל זו, כסדר המדרגות. הקווים מוצגים כל זמן שהמקום הזה מוצג; השיטה נבחרת במתג ״מידות המזבח״ שבתפריט, תחת ״שיטות ומחלוקות״ (ובכרטיס זה).",
            refs: Array.isArray(AMs.refs) ? AMs.refs : [] });
        }
        // 1.3.3 (the user: "לסמן בלבד את מקום הלויים"): the Levites' place east of the altar, a marking on the floor - ctx.shared.leviimPlace
        // (40-altar.js); 15 s, as the axis line
        const LV = ctx.shared.leviimPlace;
        if (gM && LV && typeof LV.set === "function") {
          let at = gM[1].findIndex((it) => it.t === "מידות המזבח — קווי האמות");
          if (at < 0) at = gM[1].findIndex((it) => it.t === "מזבח הנחושת");
          gM[1].splice(at >= 0 ? at + 1 : gM[1].length, 0, { t: "מקום הלויים המשוררים", view: fpOk("leviim"),
            feature: { key: "leviimPlace", isOn: () => LV.get(), on: () => LV.set(true), off: () => LV.set(false) },
            info: String(LV.info || "") + " הסימון מוצג לחמש עשרה שניות.", refs: Array.isArray(LV.refs) ? LV.refs : [] });
        }
        // KARKOV_A2 (fix-a2; the user's decision 3): the karkov on the sovev's band (ctx.shared.karkov, 40-altar.js)
        if (ctx.shared.karkov) opRow({
          id: "altarKarkov", short: "הכרכוב — פרחים וציצים במזבח", cardFly: true,
          chips: { rabbi: "רבי: כיור", none: "ר׳ יוסי בר״י: הסובב" },
          cap: "הכרכוב (כיור) של המזבח",
          refs: [["זבחים סב.", { book: 130, index: 2109 }], ["רש״י זבחים סב.", { book: 2191, index: 2969 }], ["רש״י זבחים סב. (תרי הוו)", { book: 2191, index: 2982 }], ["יכין מידות ג, ד", { book: 819, index: 321 }]],
          options: [["rabbi", "רבי — ״זה כיור״: פרחים וציצים", "**הגמרא** (זבחים סב.): ״איזהו כרכוב? רבי אומר: זה כיור, רבי יוסי ברבי יהודה אומר: זה הסובב״; ובסוף הסוגיא: ״תרי הוו; חד לנוי, וחד לכהנים דלא נשתרקו״.\n**רש״י** (שם): ״ציורים של פרחים וציצים וקלעים סביב למזבח כמו סיידו וכיירו״; ״זה כיור — ציורים סביב למעלה מאמצעו״.\n**בבית ראשון — על פס הסובב:** רש״י (זבחים סב.), על מזבח משה: ״סביב הקיר משעלה שש אמות גובה... היקף הבליטה קטנה חוגרתו סביב לנוי, וזהו סובב וכיור דאפליגו ביה רבי ור׳ יוסי בר׳ יהודה״.\n**במודל:** פרחים וציצים לסירוגין על פס הסובב, באמה העליונה שמעל חוט הסיקרא, בארבע הרוחות, מחומר המזבח (לפי ״מראה המזבח״); לא מתחת לראש הכבש. צורתם, גודלם והמרווח ביניהם — בחירת מודל."],
            ["none", "רבי יוסי ברבי יהודה — ״זה הסובב״: בלי ציורים", "**רבי יוסי ברבי יהודה** (זבחים סב.): ״זה הסובב״ — הכרכוב שבפסוק הוא הסובב, ואין ציורים.\n**הרמב״ם** אינו מזכיר כיור במזבח (תמה עליו תפארת ישראל, יכין מידות ג, ד: ״ותמהני שהשמיטו הרמב״ם, והרי קיי״ל כרבי מחברו״).\n**במודל:** בלי פרחים וציצים."]],
          current: "rabbi",
          onPick: (k) => { const K = ctx.shared.karkov; if (K && typeof K.set === "function") K.set(k); },
          fly: () => { const fp = resolveFp("mizbeach"); if (fp) fly(fp.pos, fp.target); }   // MENU_149_D: flyView (buildUI.sp) is not in scope here - the row's view threw
        });
        // 1.3.3 (the user: "ספלים — להוסיף בשיטות"): the libation bowls by the south-west horn - ctx.shared.sfalim (40-altar.js), a completion
        // from the Mishnah as the shitin; the holes' two readings are the row "ספלי הניסוך" (its chips on this card)
        const SF = ctx.shared.sfalim;
        if (gM && SF && typeof SF.set === "function") {
          let at = gM[1].findIndex((it) => it.t === "השיתין");
          if (at < 0) at = gM[1].findIndex((it) => it.t === "מזבח הנחושת");
          gM[1].splice(at >= 0 ? at + 1 : gM[1].length, 0, { t: "ספלי הניסוך — השלמה מן המשנה", view: fpOk("sfalim"),
            info: "לשון המשנה (סוכה ד, ט): ״עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם. רבי יהודה אומר, של סיד היו, אלא שהיו משחרין פניהם מפני היין. ומנקבין כמין שני חטמין דקין, אחד מעבה ואחד דק, כדי שיהו שניהם כלין בבת אחת. מערבי של מים, מזרחי של יין״.\n"
              + "ברטנורא (סוכה ד, ט): ״הספלים היו נתונים אצל הקרן סמוכים זה לזה, זה לפני זה, אחד לצד מערב ואחד לפנים ממנו, דהינו למזרח״.\n"
              + "תפארת ישראל (סוכה ד, ט): ״ופנה לשמאלו דסמוך לקרן דרומית מערבית היו הספלין שבהן מנסכין״.\n"
              + "בקצרה — המחלוקת: צורת הנקבים. לרש״י ולברטנורא — חוטם יוצא מכל ספל, והנסכים יורדים על גג המזבח, ומשם בנקב שבמזבח לשיתין. לתוספות — הנקבים בתחתית הספלים, והנסכים יורדים מהם ישר לשיתין. הפירוט — במתג ״ספלי הניסוך״ שבתפריט, תחת ״שיטות ומחלוקות״.\n"
              + "במודל: המשנה מתארת את בית שני, והספלים נבנו כאן כהשלמה מן המשנה, כמו השיתין שלידם. שני ספלי כסף בראש המזבח, ליד הקרן הדרומית־מערבית: המערבי למים והמזרחי ליין. גודלם ומקומם המדויק — בחירת מודל.",
            refs: [["משנה סוכה ד, ט", { book: 56, index: 48 }], ["ברטנורא סוכה ד, ט", { book: 588, index: 227 }], ["תפארת ישראל סוכה ד, ט", { book: 772, index: 477 }], ["רש״י סוכה מח:", { book: 2163, index: 2274 }], ["תוספות סוכה מח:", { book: 1903, index: 504 }], ["סוכה מח:", ui_P(108, "מח:")]] });
        }
        const ar = ctx.shared.altarRamps;
        if (ar && ar.info && ar.info.rashi) {
          const keys = Array.isArray(ar.keys) ? ar.keys : ["rashi", "tosafot"];
          EXTRAS.push({ t: "הכבשים הקטנים — השלמה מן הגמרא", view: fpOk(ar.fly),
            info: keys.map((k) => String(ar.info[k] || "")).filter(Boolean).join(" "),
            refs: joinRefs(keys.map((k) => ar.refs && ar.refs[k])) });
        }
      }
      // 1.0.1-L (L.85; part5-house.md FOR-UI 3): flies to the ark and explains; the inside opens only from the pill on the ark, never automatically
      if (ctx.shared.arkInside) {
        const gA = PLACES.find((g) => g[0] === "הבית מבפנים");
        // 1.3.3 (the user: "הצגת הארון במצגת צריך שיפתח לבד ללא לחיצה"): in the presentation the slide of this place opens the ark by itself
        // (tourFeature: the tour switches ctx.shared.arkInside on for the slide and back when it is left); in the panel the pill opens it, as before
        if (gA) gA[1].push({ t: "מה שבתוך הארון", view: "arkInside", tourFeature: "arkInside", info: UI_ARK_TXT + " הכפתור שעל הארון פותח אותו; במצגת הוא נפתח לבד.", refs: UI_ARK_REFS });
      }
      // 1.4.1 (ARK_GATES_208, the user, 12.11.2026): the demonstration "דבקו שערים" (58-ark.js ctx.shared.arkGates; a button by the devir's doorway too)
      if (ctx.shared.arkGates && typeof ctx.shared.arkGates.demo === "function") {
        const gA2 = PLACES.find((g) => g[0] === "הבית מבפנים");
        if (gA2) gA2[1].push({ t: "הכנסת הארון — ״דבקו שערים״ (הדגמה)", action: () => ctx.shared.arkGates.demo(),
          info: "הגמרא (שבת ל.): ״כשבנה שלמה את בית המקדש, ביקש להכניס ארון לבית קדשי הקדשים. דבקו שערים זה בזה. אמר שלמה עשרים וארבעה רננות, ולא נענה. פתח ואמר: ׳שאו שערים ראשיכם והנשאו פתחי עולם ויבא מלך הכבוד׳. רהטו בתריה למיבלעיה, אמרו: ׳מי הוא זה מלך הכבוד׳. אמר להו: ׳ה׳ עזוז וגבור׳. חזר ואמר: ׳שאו שערים ראשיכם ושאו פתחי עולם ויבא מלך הכבוד מי הוא זה מלך הכבוד ה׳ צבאות הוא מלך הכבוד סלה׳, ולא נענה. כיון שאמר: ׳ה׳ אלהים אל תשב פני משיחך זכרה לחסדי דוד עבדך׳, מיד נענה״.\n**רש״י** (שם): ״דבקו שערים — של בית קדשי הקדשים״; ״כ״ד רננות — רנה תפילה תחינה כתובים בתפילת שלמה עד כ״ד״; ״רהטו שערים בתריה למבלעיה — סברי דעל עצמו אמר מלך הכבוד״. ״שאו שערים״ — תהלים כד, ז–י.\n**הפסוקים:** ״ויבאו הכהנים את ארון ברית ה׳ אל מקומו אל דביר הבית אל קדש הקדשים אל תחת כנפי הכרובים״ (מלכים א ח, ו); ״ויארכו הבדים ויראו ראשי הבדים מן הקדש על פני הדביר ולא יראו החוצה״ (ח, ח); ״ויהי בצאת הכהנים מן הקדש והענן מלא את בית ה׳״ (ח, י).\n**היציאה מקודש הקדשים:** אחרי שהניחו את הארון, הכהנים יוצאים לאחוריהם — פניהם אל קודש הקדשים, ואחוריהם אל ההיכל. הרמב״ם (בית הבחירה ז, ד): ״כל שהשלים עבודה ונסתלק לו אינו יוצא ואחוריו להיכל, אלא מהלך אחורנית מעט מעט ומהלך בנחת על צדו עד שיצא מן העזרה״; וכן בכהן הגדול ביום הכיפורים (עבודת יום הכפורים ד, א): ״והוא מהלך אחורנית מעט מעט, פניו לקדש ואחוריו להיכל, עד שיצא מן הפרכת״. ובגמרא (יומא נג.): ״וכן כהנים בעבודתן... כשהן נפטרין — לא היו מחזירין פניהן והולכין״.\n**הנושאים:** ״ומנא לן דבארבעה הוו דרו להו? דכתיב ׳ונסעו הקהתים׳ – תרי, ׳נשאי המקדש׳ – נמי תרי״, ושנים מהלכים בין הבדים: ״תרי גברי באמתא ופלגא לא מסתגי להו״ (מנחות צח:).\n**שלמה:** ״כי עשה שלמה כיור נחשת ויתנהו בתוך העזרה חמש אמות ארכו וחמש אמות רחבו ואמות שלוש קומתו ויעמד עליו ויברך על ברכיו נגד כל קהל ישראל ויפרש כפיו השמימה״ (דברי הימים ב ו, יג). מקומו — כרלב״ג (מלכים א ח, כב): ״אחשוב שהיה עומד בעזרה גדולה שהיא עזרת ישראל... והבאור הראשון הוא יותר נכון״; ורש״י (דברי הימים ב ד, ט): ״והעזרה הגדולה. זו עזרת ישראל״. צורתו ומידתו — כמלבי״ם (דברי הימים ב ו, יג): ״ומ״ש חמש אמות ארכו היינו מן האמצע, כי היה למעלה עגול ולמטה מרובע, והיה המרובע נחלק לשתים, ממקום שבא העגול עד קצהו, והיו חמש אמות לכל צד״ — עשר על עשר. ואינו אחת המכונות: המכונה ״ארבע באמה ארך... וארבע באמה רחבה״ (מלכים א ז, כז), והן עמדו ״על כתף הבית״ (ז, לט). כורע כל התפילה: ״המלך — כיון שכרע שוב אינו זוקף, שנאמר ׳ויהי ככלות שלמה להתפלל וגו׳ קם מלפני מזבח ה׳ מכרע על ברכיו׳״ (ברכות לד:); הרלב״ג (מלכים א ח, נד): ״שהמלך כרע על ברכיו מהתחלת תפלתו עד כלותו אותם״.\n**בקצרה —** האברבנאל (מלכים א ח, כב): ״שבא בחצר הכהנים לפני מזבח הנחשת״ — ולא בעזרת ישראל.\n**במודל:** הזמנים, מקומות המבט, אורך הבדים בשעת הנשיאה, מקום הכיור — בחצר החיצונה, מול השער המזרחי של החצר הפנימית, ליד ״העמוד״ של המלך (מלכים ב כג, ג; ורש״י בדברי הימים ב כג, יג מדמה אותו לכיור הזה), גובה החלק המרובע והחלק העגול, צורת הענן ובגדי המלך (״בלבוש מלכות תכלת וחור ועטרת זהב גדולה ותכריך בוץ וארגמן״, אסתר ח, טו) — בחירת מודל. כלי ההיכל אינם מוצגים בזמן ההדגמה, כי הם עומדים בדרך הארון; הפרוכת אינה תלויה בזמן ההדגמה, וחוזרת בסופה. אם קודש הקדשים מכוסה בענן — לפני ההדגמה תופיע השאלה הרגילה.",
          refs: [["שבת ל.", { book: 104, index: 624 }], ["רש״י שבת ל.", { book: 2156, index: 1417 }], ["תהלים כד, ז–י", { book: 28, index: 346 }], ["מלכים א ח, ו", V(10, 8, 6)], ["ח, ח", V(10, 8, 8)], ["ח, י", V(10, 8, 10)], ["ח, נד", V(10, 8, 54)],
            ["דברי הימים ב ו, יג", V(39, 6, 13)], ["ו, מב", V(39, 6, 42)], ["מנחות צח:", { book: 131, index: 3502 }], ["ברכות לד:", { book: 103, index: 1647 }], ["אברבנאל מלכים א ח, כב", { book: 3574, index: 484 }], ["רלב״ג מלכים א ח, כב", { book: 3645, index: 350 }], ["רש״י דברי הימים ב ד, ט", { book: 3662, index: 141 }], ["רש״י דברי הימים ב כג, יג", { book: 3662, index: 709 }], ["מלכים א ז, כז", { book: 10, index: 251 }], ["ז, לט", { book: 10, index: 263 }],
            ["רלב״ג מלכים א ח, נד", { book: 3645, index: 386 }], ["מלבי״ם דברי הימים ב ו, יג", { book: 3364, index: 147 }],
            ["רמב״ם בית הבחירה ז, ד", { book: 337, index: 114 }], ["רמב״ם עבודת יום הכפורים ד, א", { book: 342, index: 32 }], ["יומא נג.", { book: 107, index: 1375 }]] });   // EXIT_BACK_304
      }
      // 1.0.1-L (Part 7, U3, the user: "בתפריט יש מלא כפתורים שנמצאים בלפחות שתי קטגוריות, החלט מה הכפתור הרלוונטי ביותר למקומו ומחק את המיקום המיותר"):
      // a button that went to the same place as another in a second group is gone: the kept button's card now carries its text and links,
      // and ctx.ui.places() still lists it (noButton), so the presentation keeps its slide; ctx.ui.placeButton(old title) is the kept button.
      const UI_MERGE = {
        // 1.3.5 (the user: "בדיקה שאין כפולות"): the inner court had two buttons with one view since 1.3.3 (its zone's place, and the view) - one now
        "חצר הכהנים": "החצר הפנימית — חצר הכהנים",
        "38 תאים (רש״י ו, ו ממדות ד, ג)": "היציע והתאים",
        "פתיחת הבית, התאים והאולם — כלי צפייה בלבד": "היציע והתאים",
        "קורות היציע, פתחיו והלולים": "פתח התאים והלולים",
        "גובה האולם": "הבית (בית ה׳)",
        "פתחי ההיכל והדביר (מידות)": "פתח ההיכל ודלתותיו",
        "הכבש והקרנות": "מזבח הנחושת",
        "האוטם והמעלות": "המעלות אל הבית (האוטם)",
        "צורת הים (עירובין יד:)": "הים של שלמה",
        "שנים עשר הבקר — צורתם וגודלם": "שנים עשר הבקר",
        "פריסת העליות על הבית והאולם בלבד": "העליות (רש״י דה״י ג, ד)",
        "מקום בית שלמה": "החצר הגדולה",
        "שערי החצר הגדולה ומעלותיהן": "השער המזרחי",
        "העמוד — במה ועמוד במבוא": "העמוד — מקום המלך",
        "המכונות — האופנים, הכיור והכן": "המכונות מקרוב",
        "המכונות — שלוש מסגרות בכל צד והציורים": "המכונות מקרוב",
        "ברזי הכיורות": "המכונות מקרוב",
        "כיור משה — שני הברזים": "כיור משה",
        "מקום יכין ובועז בתוך האולם": "יכין ובועז — מבט מפתח האולם",
        "צורת כותרות יכין ובועז (רש״י ז, יח, כציור הספר)": "כותרת העמוד — שבכה, רימונים ושושנים",
        "חלוני ההיכל: שישה בכל צד": "חלוני שקופים אטומים",
        "דוגמת הגילופים (ו, יח; ו, כט)": "גילופי הקירות — כרובים, תמורות, פטורי ציצים, פקעים",
        "שכבות הקיר והרצפה — תצוגה בלבד": "שכבות הקיר והרצפה — אבן, ארז וזהב",
        "השולחנות — מידותיהם והלחם": "שולחן משה מקרוב — הלחם, הסניפין והקנים",
        "המנורות — משיכתן, המעלות והעיטורים": "מנורת משה ועשר המנורות",
        "מזבח הזהב — גובהו, מקומו, קרנותיו, שכבותיו ועשן הקטורת": "מזבח הזהב",
        "הפרוכת — נשרים לצד ההיכל ואריות לצד הדביר": "הפרוכת",
        // 1.3.7 (the user: "ה. לאחד את עמודים ועב לאולם העמודים ואת שכבות למזבח הזהב"): two pairs of buttons that stood before one camera
        "העמודים והעב — 'ועמדים ועב על פניהם'": "אולם העמודים",
        // 1.3.8 (VIEWFIX_138; the user, 12.11.2026: "אל תשכח לאחד כרטיסים. יש כאלה שלא מציגים כלום"): the upper chamber over the devir - an empty room - is told in the devir's own card
        "עליית קודש הקדשים — מעל הדביר": "קודש הקדשים — הדביר",
        "שכבות מזבח הזהב — אבן, ארז וזהב": "מזבח הזהב",
        "גוף הכרובים — 'בנס הן עומדין' (בבא בתרא צט.)": "הכרובים",
        "תבנית הכרובים ופניהם": "הכרובים",
        "פתח הדביר — שני ביאורי רש״י ל'מזוזות חמישית'": "פתח הדביר (מזוזות חמישית) — שני ביאורי רש״י",
        "אמה טרקסין — שלושה חלקים": "אמה טרקסין",
        "הסרת הנסרים — כלי צפייה בלבד": "קירוי בית יער הלבנון — הכרותות, 45 הנסרים והנסרים הדקים",
        "בית המלך והגן — ריהוט ומידות": "בית המלך",
        "החצר האחרת ובית בת פרעה — מקומן ומידותיהן": "החצר האחרת — חצר בית המלך",
        "כסא שלמה — הגרסאות": "כסא שלמה",
        "רצפת השיש בחצר הכהנים": "רצפת חצר הכהנים — שיש",
        "לשכת הגזית — מקורות מבית שני": "לשכת הגזית",
        "השיתין — השלמה מן המשנה": "השיתין",   // 1.0.2 (rule 6; only when 40-altar.js gives ctx.shared.shitin)
        "היסוד, הסובב וחוט הסיקרא — השלמה מן המשנה": "היסוד, הסובב וחוט הסיקרא",   // 1.0.2 add-on (only with ctx.shared.altarProfile)
        "בית המטבחים — הטבעות, השולחנות והננסין (מקורות מבית שני)": "בית המטבחים — מקרוב",
        "שני השולחנות שבאולם — צורתם ומקומם": "שולחנות האולם — ר׳ יוסי בר׳ יהודה",
        // 1.1.0 (the user: no doubles): the last of "השלמות" go to their subjects; the group is gone when it is empty
        "מידות החצרות (מדות ה, א; ב, א)": "הר הבית והחצר הגדולה",
        ["עובי הקירות — כותל הבית " + hwT.join(", ") + " (רש״י ו, ו, כציור הספר)"]: "חתך היציע",
        "מקום המזבח (מדות ה, א)": "מזבח הנחושת",
        "מקום הים (רש״י / רד״ק)": "הים של שלמה",
        "בית החליפות (רש״י יומא לו.)": "האולם ובית החליפות",
        "גובה חומות החצרות (20 אמה)": "הר הבית והחצר הגדולה",
        "מקום הכיורות והים": "עשר המכונות והכיורות",
        "הדגמת המכונה — המסלול והמים": "המכונות מקרוב",
        "בית יער הלבנון — שלוש שיטות (רש״י / מלבי״ם ורלב״ג / מצודת דוד)": "בית יער הלבנון",
        "הכבשים הקטנים — השלמה מן הגמרא": "הכבש"
      };
      // 1.1.0: "העליות" is a subject of the house, not a completion: it moves after "גג הבית ותקרותיו"
      {
        const ex = PLACES.find((g) => g[0] === "השלמות מחז״ל ובחירות מודל"), ho = PLACES.find((g) => g[0] === "הבית מבחוץ");
        const i = ex ? ex[1].findIndex((it) => it.t === "העליות (רש״י דה״י ג, ד)") : -1;
        if (i >= 0 && ho) {
          const it = ex[1].splice(i, 1)[0];
          const j = ho[1].findIndex((x) => x.t === "גג הבית ותקרותיו");
          ho[1].splice(j >= 0 ? j + 1 : ho[1].length, 0, it);
        }
      }
      // 1.3.4 (the user: "בסדר התפריט תנסה לסדר את המתגים שלא יהיה קפיצות משמעותיות במצלמה"): a group in a walking order - the eye goes
      // on to the next place nearby (the presentation, which follows the panel's order, too). An entry is a title or the start of one; a
      // title not listed keeps its place after the listed ones.
      {
        const ORDER = {
          // MENU_149_D (below): the groups and the places in them along one route from outside in
          "הר הבית והחצרות": ["הר הבית והחצר הגדולה", "משמרות השוערים", "השער המזרחי", "ארון יהוידע שבשער — לתקלין עתיקין", "החצר החיצונה", "לשכות החצר החיצונה", "שתי הסנהדראות הקטנות",
            "העמוד — מקום המלך", "החצר הפנימית — חצר הכהנים", "חצר הכהנים", "בר שורא", "שערי חצר הכהנים", "רצפת חצר הכהנים", "לשכת הגזית", "בית המטבחים", "בית המטבחים — מקרוב",
            "ארון יהוידע אצל המזבח — לתקלין חדתין"],
          // 1.3.5 (the user: "סידורם לפי מצלמה, שלא יהיה קפיצות, כולל הדברים החדשים"); MENU_149_D: from the court's east - the axis seen from
          // the east, the Levites' place east of the altar, the Sea and its oxen in the north, the altar and what is on it, its south-west
          // corner and the ramp in the south, the laver and the bases, the view from the house's door, the pillars
          "המזבח וכלי הנחושת": ["קו ציר הבית", "מקום הלויים המשוררים", "הים של שלמה", "שנים עשר הבקר", "מזבח הנחושת", "מידות המזבח", "היסוד, הסובב וחוט הסיקרא", "השיתין",
            "הכבש", "עולים במזרח ויורדים במערב — הכבש", "כיור משה", "עשר המכונות והכיורות", "המכונות מקרוב", "מפתח ההיכל אל המזבח", "יכין ובועז — מבט מפתח האולם",
            "יכין — מבעד לפתח", "בועז — מבעד לפתח", "בועז — מרחוק", "כותרת העמוד"],
          "הבית מבחוץ": ["המעלות אל הבית", "האולם ובית החליפות", "פתח האולם ודלתותיו", "שולחנות האולם", "פשפשי בית החליפות", "הבית (בית ה׳)", "חלוני שקופים אטומים", "בית דילפא",
            "גג הבית ותקרותיו", "העליות", "הלול שאחורי בית הכפורת", "קודש הקדשים מבחוץ", "גנת הוורדים"],
          "הבית מבפנים": ["פתח ההיכל ודלתותיו", "פתיחת דלתות ההיכל", "ההיכל", "טבלת השיש", "גילופי הקירות", "שכבות הקיר והרצפה", "רצפת הבית", "מזבח הזהב",
            "שכבות מזבח הזהב", "סידור הכלים", "מנורת משה", "שולחן משה ועשרה", "שולחן משה מקרוב", "רתוקות הזהב", "אמה טרקסין", "פתח הדביר", "הפרוכת",
            "הפרוכת מצד הדביר", "קודש הקדשים — הדביר", "הכרובים", "הארון ובדיו", "מה שבתוך הארון", "אבן השתייה", "עליית קודש הקדשים", "הכנסת הארון", "שיפוע רצפת הבית",
            "כלי הבית"],
          // MENU_149_D: from the far end of the palace's great court toward the house - the forest house, the halls, the house of Pharaoh's
          // daughter, the other court, the garden, the king's house, and his ascent to the house of the Lord (the next group, the mount)
          "בית שלמה": ["החצר הגדולה", "בית יער הלבנון", "פנים בית יער הלבנון", "קירוי בית יער הלבנון", "העמודים והעב", "אולם העמודים",
            "אולם הכסא ואולם המשפט", "כסא שלמה", "עליית המלך לכסא", "בית בת פרעה", "החצר האחרת", "הגן", "בית המלך", "המעלות מבית המלך"],
          "השלמות מחז״ל ובחירות מודל": ["מידות החצרות", "גובה חומות החצרות", "שערי החצר הגדולה", "העמוד — במה", "רצפת השיש בחצר הכהנים",
            "לשכת הגזית — מקורות", "בית המטבחים — הטבעות", "הכבש והקרנות", "מקום המזבח", "השיתין", "היסוד, הסובב", "הכבשים הקטנים",
            "מקום הכיורות והים", "כיור משה — שני הברזים", "המכונות — האופנים", "המכונות — שלוש מסגרות", "ברזי הכיורות", "הדגמת המכונה",
            "צורת הים", "שנים עשר הבקר — צורתם", "מקום הים", "האוטם והמעלות", "מקום יכין ובועז", "צורת כותרות יכין ובועז", "שני השולחנות שבאולם",
            "בית החליפות", "גובה האולם", "עובי הקירות", "חלוני ההיכל", "פריסת העליות", "38 תאים", "קורות היציע", "פתיחת הבית, התאים והאולם",
            "פתחי ההיכל והדביר", "דוגמת הגילופים", "שכבות הקיר והרצפה — תצוגה", "מזבח הזהב — גובהו", "השולחנות — מידותיהם", "המנורות — משיכתן",
            "הפרוכת — נשרים", "פתח הדביר — שני ביאורי", "אמה טרקסין — שלושה חלקים", "גוף הכרובים", "תבנית הכרובים", "מקום בית שלמה",
            "בית יער הלבנון — שלוש שיטות", "הסרת הנסרים", "כסא שלמה — הגרסאות", "החצר האחרת ובית בת פרעה", "בית המלך והגן"]
        };
        // MENU_149_D (fix-d, 22.11.2026 - the user's decision 149 ג, the coordinator's execution): ONE ROUTE FROM OUTSIDE IN, as in the
        // Second Temple's panel - from the City of David up to the palace, by "המעלות מבית המלך אל בית ה׳" to the mount, its east gate,
        // the outer court, the inner court, the altar, the house from outside, the cells, inside, the devir. Three places move to where the
        // eye passes them: the steps to the house (האוטם) open "הבית מבחוץ", the rose garden west of the house closes it, and the vessels of
        // the house close the inside. CITY_RE - the places of the City of David (agent C's layer: עיר דוד, המלוא, the spring, קברי בית דוד,
        // גן המלך): a group of them goes before "בית שלמה", and such a place in another group goes to the head of "בית שלמה" - so that
        // places added later find their spot by themselves. KEEP THIS BLOCK THE LAST WORD ON THE ORDER of the places (after every insertion).
        const CITY_RE = /עיר דוד|המלוא|מעי?ין(?! עיטם)|שילוח|גיחון|קברי בית דוד|גן המלך|המצודה/;
        const grpOf = (n) => PLACES.find((g) => g[0] === n);
        const moveTo = (title, to) => {
          const dst = grpOf(to);
          if (!dst) return;
          for (const g of PLACES) {
            if (g === dst) continue;
            const k = g[1].findIndex((it) => it && String(it.t).startsWith(title));
            if (k >= 0) { dst[1].push(g[1].splice(k, 1)[0]); return; }
          }
        };
        moveTo("המעלות אל הבית", "הבית מבחוץ");
        moveTo("גנת הוורדים", "הבית מבחוץ");
        moveTo("כלי הבית", "הבית מבפנים");
        for (const g of PLACES) {
          const want = ORDER[g[0]];
          if (!want) continue;
          const left = g[1].slice(), out = [];
          for (const w of want) {
            let k = left.findIndex((it) => it.t === w);
            if (k < 0) k = left.findIndex((it) => String(it.t).startsWith(w));
            if (k < 0) { console.warn("[ui.js] order: no place " + w); continue; }
            out.push(left.splice(k, 1)[0]);
          }
          g[1] = out.concat(left);
        }
        // MERGE fix-c into release (b2): the PARALLELS_C places go in here - after the walking ORDER (as agent C placed them, "after the
        // ORDER above") and before the CITY_RE / RANK sort below, which stays the last word on the order (MENU_149_D, FIX-COORD)
        // PARALLELS_C (fix-c, 22.11.2026 - the user, the "same place" list, 09:38: "לבצע"): THE FIRST TEMPLE'S COUNTERPARTS OF PLACES THAT ONLY
        // THE SECOND TEMPLE HAD - each place put into its group after a place that stands near it (after the ORDER above), and linked to the
        // Second Temple's place by UI_SAME_PAIRS (shared/70-ui.js, the block SAME_PAIRS_C). The models of the new things: 59-parallels.js.
        // Every quotation as read in the user's library (book, line).
        {
          const parAt = (gname, afterT, items) => {
            const gp = PLACES.find((q) => q[0] === gname);
            if (!gp) return;
            let at = gp[1].findIndex((it) => it.t === afterT);
            if (at < 0) at = gp[1].findIndex((it) => String(it.t).startsWith(afterT));
            gp[1].splice(at >= 0 ? at + 1 : gp[1].length, 0, ...items.filter(Boolean));
          };
          const parFeat = (key) => (ctx.shared.features || {})[key] || null;
          // ----- the Temple Mount: the shoe's law, the three gates' names, the synagogue and the house of study -----
          parAt("הר הבית והחצרות", "הר הבית והחצר הגדולה", [
            { t: "דין המנעל בהר הבית", tg: [353, 12, 0], cam: [412, 27, 34], noFade: true,
              info: "לשון המשנה (ברכות ט, ה): ״לא יקל אדם את ראשו כנגד שער המזרח, שהוא מכון כנגד בית קדשי הקדשים. לא יכנס להר הבית במקלו, ובמנעלו, ובפנדתו, ובאבק שעל רגליו, ולא יעשנו קפנדריא, ורקיקה מקל וחמר״.\n**הגמרא** (ברכות סב:): ״ורקיקה מקל וחומר ממנעל: ומה מנעל, שאין בו דרך בזיון, אמרה תורה: ׳של נעליך מעל רגליך׳. רקיקה, שהיא דרך בזיון — לא כל שכן?!״\n**הרמב״ם** (בית הבחירה ז, א–ב): ״מצות עשה ליראה מן המקדש, שנאמר ׳ומקדשי תיראו׳״; ״ואי זו היא יראתו, לא יכנס אדם להר הבית במקלו או במנעל שברגליו או באפנדתו או באבק שעל רגליו או במעות הצרורין לו בסדינו״.\nבמודל: המבט אל השער המזרחי של החצר הגדולה, ״כנגד שער המזרח״. הר הבית של בית ראשון הוא במודל החצר הגדולה (ראו ״הר הבית והחצר הגדולה״).",
              refs: [["ברכות ט, ה", { book: 40, index: 66 }], ["ברכות סב:", { book: 103, index: 2803 }], ["רמב״ם בית הבחירה ז, א", { book: 337, index: 111 }], ["רמב״ם בית הבחירה ז, ב", { book: 337, index: 112 }]] }
          ]);
          parAt("הר הבית והחצרות", "השער המזרחי", [
            { t: "השער המערבי — שער קיפונוס", tg: [-150, 11, 0], cam: [-207, 19, -22], noFade: true,
              info: "לשון המשנה (מידות א, ג): ״קיפונוס מן המערב, משמש כניסה ויציאה״.\n**תוספות יום טוב** (מידות א, ג): ״קיפונוס. לא ידעתי לו טעם. ובשלטי הגבורים פ״ג חשב שהוא לשון יון. וענינו עבודת הגן שאפשר שהיה שם גן של ורדים מחוץ להר הבית״.\n**תפארת ישראל** (יכין, מידות א, כה): ״קיפונוס מן המערב אפשר שנקרא קופינוס, ע״ש שהיה שם אחורי ק״ק גנת וורדין שנקרא כך בלשון יון... וי״א שנקרא כך ע״ש אותו שהתנדב לבנותו״. וגנות הוורדים — ״שהיו מימות נביאים הראשונים״ (בבא קמא פב:).\nבמודל: בפסוקים אין מספר לשערי החצר הגדולה ואין להם שמות, ובמודל שער אחד בכל צד. השם שבמשנה — שנאמרה בימי הבית השני — נקרא כאן על השער המערבי: בחירת מודל. המעלות שמחוץ לשער — בחירת מודל.",
              refs: [["מידות א, ג", { book: 89, index: 4 }], ["תוספות יום טוב מידות א, ג", { book: 948, index: 30 }], ["יכין מידות א, כה", { book: 819, index: 52 }], ["בבא קמא פב:", { book: 122, index: 3124 }]] },
            { t: "השער הצפוני — שער טדי", tg: [103, 11, -170], cam: [121, 20, -229], noFade: true,
              info: "לשון המשנה (מידות א, ג): ״טדי מן הצפון, לא היה משמש כלום״; ובשערי הבית (ב, ג): ״כל השערים שהיו שם, היו להן שקופות, חוץ משער טדי, שהיו שם שתי אבנים מטות זו על גב זו״.\n**תפארת ישראל** (יכין, מידות א, כו): ״טדי מן הצפון נקרא טדי, שהוא תרגום של סוד והצנע, מדעשוי שער זה למי שנכנס או יוצא בהצנע, כבעל קרי כשיצא״.\nבמודל: שער אחד בכל צד, והשם שבמשנה — שנאמרה בימי הבית השני — נקרא כאן על השער הצפוני: בחירת מודל. במקום משקוף — ״שתי אבנים מטות זו על גב זו״, כבבית השני: כמין גג משולש בגובה ארבע אמות, והמשולש שביניהן פתוח; הדלתות מסתיימות באלכסון תחת האבנים — בחירת מודל.",
              refs: [["מידות א, ג", { book: 89, index: 4 }], ["מידות ב, ג", { book: 89, index: 14 }], ["יכין מידות א, כו", { book: 819, index: 54 }]] },
            { t: "השער הדרומי — שער חולדה", tg: [103, 11, 334], cam: [86, 30, 398], noFade: true,
              info: "לשון המשנה (מידות א, ג): ״שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״.\n**תוספות יום טוב** (מידות א, ג): ״ושמם זה יתכן לומר שעל שם חולדה הנביאה נקראו כן... והיא יושבת בירושלים במשנה. היינו בתוך שער זה שהוא משנה ששנים הם ברוח זו״ (מלכים ב כב, יד).\n**תפארת ישראל** (יכין, מידות א, כד): ״ונקראין שערי חולדה, שבמקדש ראשון היתה חולדה הנביאה רגילה לקרוא שם נבואותיה באזני רוב העם הנכנסים ויוצאין שם״.\nבמודל: בבית ראשון שער אחד בדרום (במשנה — שניים), ומחוצה לו המעלות מבית המלך אל בית ה׳; שמו — כשם שבמשנה, בלשון יחיד: בחירת מודל.",
              refs: [["מידות א, ג", { book: 89, index: 4 }], ["תוספות יום טוב מידות א, ג", { book: 948, index: 29 }], ["יכין מידות א, כד", { book: 819, index: 50 }], ["מלכים ב כב, יד", { book: 11, index: 648 }]] },
            { t: "בית הכנסת שבהר הבית", tg: [161, 5, 110], cam: [190, 32, 168], noFade: true,
              info: "לשון המשנה (יומא ז, א): ״בא לו כהן גדול לקרות... חזן הכנסת נוטל ספר תורה ונותנו לראש הכנסת, וראש הכנסת נותנו לסגן, והסגן נותנו לכהן גדול, וכהן גדול עומד ומקבל וקורא עומד״.\n**רש״י** (יומא סח:): ״בית הכנסת — היה סמוך לעזרה בהר הבית״.\nהמשנה נאמרה בימי הבית השני. במודל של בית ראשון — מבנה סמלי באותו מקום כמו בבית השני: בית פשוט בחצר הגדולה, מדרום לחצר החיצונה, ופתחו פונה אל החצרות; 24 על 16, גבוה 13, ושורת חלונות גבוהה בכתליו. מקומו, מידותיו וצורתו — בחירת מודל.",
              refs: [["יומא ז, א", { book: 55, index: 55 }], ["רש״י יומא סח:", { book: 2157, index: 2562 }]] },
            { t: "בית המדרש שבהר הבית", tg: [40, 2, 114], cam: [40, 38, 88], noFade: true,
              info: "**התוספתא** (חגיגה ב, ד): ״היו יושבין מתמיד של שחר עד תמיד של בין הערבים ובשבתות ובימים טובים נכנסין לבית המדרש שבהר הבית״.\n**הגמרא** (סנהדרין פח:): ״אלו ואלו באין ללשכת הגזית, ששם יושבין מתמיד של שחר עד תמיד של בין הערבים. ובשבתות ובימים טובים, יושבין בחיל״ — שתי גרסאות: בבית המדרש שבהר הבית, או בחיל.\nהמקורות מדברים בימי הבית השני. במודל של בית ראשון — מבנה סמלי באותו מקום כמו בבית השני: בית פשוט בחצר הגדולה, מדרום לחצר הפנימית; 20 על 14, גבוה 11. מקומו, גודלו וצורתו — בחירת מודל.\nבפנים: ספסלים ושולחנות לתלמידים, ארונות ספרים לאורך הקירות, ומקום מיוחד לראש הישיבה — כסא מכובד על במה, ולפניו שולחן עיון. כל אלה, וכן הגג הפתוח (קורות בלבד) שדרכו רואים את הפנים, הם בחירת מודל, בלי מקור.",
              refs: [["תוספתא חגיגה ב, ד", { book: 200, index: 17 }], ["סנהדרין פח:", { book: 125, index: 3449 }], ["סנהדרין פח: — בחיל", { book: 125, index: 3450 }]] }
          ]);
          // ----- between the ulam and the altar (its zone on the floor, 15 s) -----
          parAt("הר הבית והחצרות", "המעלות אל הבית (האוטם)", [
            { t: "בין האולם ולמזבח", feature: parFeat("zoneUlamAltar"), tg: [31, 6, 0], cam: [72, 96, 1],
              info: "הפסוק (יואל ב, יז): ״בין האולם ולמזבח יבכו הכהנים משרתי ה׳״.\nלשון המשנה (כלים א, ט): ״בין האולם ולמזבח מקדש ממנה, שאין בעלי מומין ופרועי ראש נכנסים לשם״; וכן הרמב״ם (בית הבחירה ז, כ): ״בין האולם ולמזבח מקדש ממנה שאין בעלי מומין ופרועי ראש וקרועי בגדים נכנסין לשם״.\nבבית השני: ״בין האולם ולמזבח עשרים ושתים אמה״ (מידות ה, א).\nבמודל: הרצועה שבין חזית האולם ליסוד המזבח, לכל רוחב החצר, מסומנת על הרצפה לחמש עשרה שניות; בה שתים עשרה המעלות אל האולם. בבית ראשון המזבח רחוק מן האולם עשרים ושש אמות וחצי — עשרים וארבע וחצי עד היסוד, ובמזבח של רבי יוסי עשרים ושתיים וחצי — כדי שיהיה מקום למכונות: בחירת מודל. הרצועה לכל רוחב החצר — כברירת המחדל בבית השני; בחירת מודל.",   // QUOTES_Q: רמב״ם בית הבחירה ז, כ (337:130): 'מקדש'; משנה כלים א, ט (91:10): 'מקדש'
              refs: [["יואל ב, יז", { book: 16, index: 39 }], ["כלים א, ט", { book: 91, index: 10 }], ["רמב״ם בית הבחירה ז, כ", { book: 337, index: 130 }], ["מידות ה, א", { book: 89, index: 36 }]] }
          ]);
          // ----- the altar: the portions, the Tosafot's small ramps, the two tables, the three firepans -----
          const parTables = () => { const R = ctx.shared.rampTables; return R ? R.marble : [39.6, 23.6]; };
          const parPans = () => (typeof ctx.shared.machtotAt === "function" ? ctx.shared.machtotAt() : [37.4, 6, 24.8]);
          const arT = ctx.shared.altarRamps;
          parAt("המזבח וכלי הנחושת", "מזבח הנחושת", [
            { t: "חלקי יהודה ובנימין — הרצועה שבדרום המזבח", feature: parFeat("tribes"), tg: [62, 6, 12], cam: [92, 182, 104],
              info: "**הברייתא** (יומא יב.): ״מה היה בחלקו של יהודה — הר הבית, הלשכות והעזרות. ומה היה בחלקו של בנימין — אולם והיכל ובית קדשי הקדשים, ורצועה היתה יוצאה מחלקו של יהודה ונכנסת לחלקו של בנימין, ובה היה מזבח בנוי״.\n**רש״י** שם: ״צד המזרחי רוחב הר הבית עזרת נשים כולה ועזרת ישראל כולה י״א אמה של מקום רגלי דריסת הכהנים... ושם המזבח מתחיל משם ולמערב בחלקו של בנימין אלא שבמקום מושב המזבח יוצאה רצועה מחלקו של יהודה ונכנסה לקרן מזרחית דרומית״.\n**בזבחים** (נג:): ״לפי שלא היתה בחלקו של טורף. דאמר רב שמואל בר רב יצחק: מזבח אוכל בחלקו של יהודה אמה״; רש״י שם: ״אמה במזרחו אמה בדרומו״.\n**בבית ראשון** — שתי שיטות, כמתג ״יסוד המזבח בדרום — ומקום המזבח״ שבשיטות ומחלוקות:\n• **תוספות** (זבחים סא:; ברירת המחדל): ״ובבית ראשון היה להם יסוד לדרום שהיה משוך בחלקו של טורף חוץ מרוח מזרחית שלא נשתנה שהיה בלא יסוד (עד) חלקו של יהודה כמו בבית שני״. במודל: האמה שבמזרח המזבח בחלקו של יהודה, והיסוד הדרומי בחלקו של בנימין; הרצועה — מדרום ליסוד, שלוש אמות ממנו (ארבע האמות שהוסיפו בני הגולה בדרום, פחות האמה שהמזבח אוכל בחלקו של יהודה): בחירת מודל.\n• **רבנו תם** (שם): ״דמסתמא בבית ראשון לא היה יסוד לקרן דרומית מזרחית לפי שלא היה בחלקו של טורף״ — ויסוד בית ראשון היה כיסוד בית שני. במודל: כבבית השני — האמה שבמזרח והאמה שבדרום בחלקו של יהודה, והרצועה מאמתו הדרומית של המזבח.\n**במודל**: בזהב — חלקו של יהודה: החצר שממזרח לקו כותל המזבח המזרחי, והחצר החיצונה (צדו המזרחי של הר הבית — בתווית בלבד). בכחול — חלקו של בנימין. בזהב כהה — הרצועה, עד כותל החצר הדרומי; ובצד המזבח רצועות זהב צרות — האמה שבמזרח (ולרבנו תם — גם שבדרום). עד היכן הרצועה מגיעה בדרום — המקורות אינם אומרים: בחירת מודל. הצבעים — בחירת מודל.",
              refs: [["יומא יב.", { book: 107, index: 256 }], ["רש״י יומא יב.", { book: 2157, index: 332 }], ["זבחים נג:", { book: 130, index: 1866 }], ["רש״י זבחים נג: — האמה", { book: 2191, index: 2586 }], ["רש״י זבחים נג: — הרצועה", { book: 2191, index: 2587 }], ["תוספות זבחים סא:", { book: 1936, index: 659 }]] }
          ]);
          parAt("המזבח וכלי הנחושת", "עולים במזרח ויורדים במערב — הכבש", [
            arT && arT.info && arT.info.tosafot ? { t: "הכבשים הקטנים — תוספות", view: "mizbeachRamps",
              action: () => { const r = OPS_BY_ID["altarRamps"]; if (r) { r.mark("tosafot"); try { r.onPick("tosafot"); } catch (_) {} } else if (typeof arT.set === "function") arT.set("tosafot"); },
              info: String(arT.info.tosafot) + "\nבמקום הזה המתג ״הכבשים הקטנים״ עובר לשיטת התוספות; שיטת רש״י — במתג, או בכרטיס ״הכבש״.",
              refs: (arT.refs && arT.refs.tosafot) || [] } : null,
            { t: "שולחן החלבים — שני השולחנות שבמערב הכבש", tg: () => { const p = parTables(); return [p[0] + 0.4, 7.2, p[1] + 1.1]; }, cam: () => { const p = parTables(); return [p[0] - 5.2, 11.8, p[1] - 6.2]; },
              info: "לשון המשנה (תמיד ז, ג): ״ושני כהנים עומדים על שלחן החלבים ושתי חצוצרות של כסף בידם, תקעו והריעו ותקעו״; (שקלים ו, ד): ״ושנים במערב הכבש, אחד של שיש ואחד של כסף על של שיש היו נותנים את האברים, על של כסף כלי שרת״.\n**הרמב״ם** (בית הבחירה ב, טו): ״ושני שלחנות היו במערב הכבש אחד של שיש שנותנין עליו את האיברים ואחד של כסף שנותנין עליו כלי השרת״; ובפירוש המשנה (תמיד ז, ג): ״ואחד של שיש נותנין עליו האברים והוא שלחן החלבים הנזכר כאן״.\n**ברטנורא** (תמיד ז, ג): ״שתי שלחנות היו במערבו של כבש, אחד שלחן של כסף שבו נותנין כלי שרת, ואחד שלחן של שיש שבו נותנים האברין, והוא נקרא שלחן החלבים״.\n**הראב״ד** (מובא במלאכת שלמה, תמיד ז, ג): ״שהרי במערבו של כבש היה השלחן היינו בקרן מערבית דרומית״.\n**הרמב״ם** (תמידין ומוספין ו, ו): ״כשהיו נותנין היין למנסך. היו שני כהנים עומדין על שלחן החלבים ושתי חצוצרות בידן״.\nהמשנה מתארת את הבית השני; בבית ראשון — השלמה מן המשנה.\nבמודל: שני השלחנות במערב הכבש, סמוך לקרן המערבית־הדרומית של המזבח — כדברי הראב״ד; שלחן השיש קרוב לקרן, ושלחן הכסף אחריו; ממערב לכבש היורד ליסוד ולטבלא של השיתין, שלא יחסמו את הדרך. הם הולכים עם המזבח במתג ״מקום המזבח״. מידותיהם, גובהם (אמה וחצי) ומקומם המדויק — בחירת מודל.",
              refs: [["תמיד ז, ג", { book: 88, index: 40 }], ["שקלים ו, ד", { book: 54, index: 41 }], ["רמב״ם בית הבחירה ב, טו", { book: 337, index: 38 }], ["פירוש המשניות לרמב״ם תמיד ז, ג", { book: 575, index: 78 }], ["ברטנורא תמיד ז, ג", { book: 634, index: 242 }], ["מלאכת שלמה תמיד ז, ג (הראב״ד)", { book: 1202, index: 319 }], ["רמב״ם תמידין ומוספין ו, ו", { book: 344, index: 92 }]] },
            { t: "שלוש המחתות — בכל יום וביום הכיפורים", feature: parFeat("machtot"), tg: () => { const p = parPans(); return [p[0] + 0.3, p[1] + 0.9, p[2]]; }, cam: () => { const p = parPans(); return [p[0] - 5.6, p[1] + 2.6, p[2] + 0.4]; },
              info: "לשון המשנה (יומא ד, ד): ״בכל יום היה חותה בשל כסף ומערה בתוך של זהב, והיום חותה בשל זהב ובה היה מכניס. בכל יום חותה בשל ארבעת קבין ומערה בתוך של שלשת קבין, והיום חותה בשל שלשת קבין, ובה היה מכניס... בכל יום היתה כבדה, והיום קלה. בכל יום היתה ידה קצרה, והיום ארכה. בכל יום היה זהבה ירוק, והיום אדם, דברי רבי מנחם״.\nהגמרא (יומא מד:): ״תנא, בכל יום היתה גלדה עבה, והיום רך. בכל יום היתה קצרה, והיום ארוכה. מאי טעמא — כדי שתהא זרועו של כהן גדול מסייעתו״; ״תנא, בכל יום לא היה לה ניאשתיק, והיום היה לה ניאשתיק. דברי בן הסגן״ — ״טבעת בראשה שמקשקש ומשמיע קול״ (רש״י).\nבקצרה — ״ניאשתיק״: לרש״י — טבעת בראשה, המשמיעה קול; לריב״א שבתוספות, על פי הירושלמי — ״כעין נרתק של עור היה עשוי סביב ידה של מחתה לאחוז בה שלא יכווה״; ולמאירי — ״ענין בסיס״, שתשב המחתה על שוליה. במודל — כרש״י.\nבקצרה — המחלוקת: ״רבי יוסי אומר, בכל יום חותה בשל סאה ומערה בתוך של שלשת קבין״ (יומא ד, ד); ובברייתא (יומא מד:): ״רבי ישמעאל בנו של רבי יוחנן בן ברוקה אומר: בשל קביים היה מכניס״. במודל — כתנא קמא.\nהמשנה והגמרא מתארות את הבית השני; בבית ראשון — השוואה בלבד.\nבמודל (רק כדי להשוות): שלוש המחתות זו בצד זו, על רצפת החצר, ממערב לשני השלחנות שבקרן המזבח הדרומית מערבית — של כסף (ארבעת קבין); של זהב ירוק (שלשת קבין, דופנה עבה וידה קצרה); ושל יום הכיפורים — זהב אדום, דופנה דקה, ידה ארוכה, ובראשה טבעת. מידותיהן, צורתן ומקומן — בחירת מודל; וכן ייחוס ״כבדה״ ו״ידה קצרה״ למחתת הזהב של כל יום, ולא לשל כסף.",
              refs: [["יומא ד, ד", { book: 55, index: 34 }], ["יומא מד:", { book: 107, index: 1129 }], ["יומא מד: (ניאשתיק)", { book: 107, index: 1130 }], ["רש״י יומא מד:", { book: 2157, index: 1718 }], ["תוספות יומא מד:", { book: 1908, index: 359 }], ["מאירי יומא מד:", { book: 2199, index: 399 }], ["יומא מד: (בשל קביים)", { book: 107, index: 1127 }]] }
          ]);
          const parAltarDz = () => { const A = ctx.shared.altarPlace; return A && A.dz && A.current in A.dz ? A.dz[A.current] + (A.extra || 0) : 10; };
          parAt("הר הבית והחצרות", "בית המדרש שבהר הבית", [
            { t: "הליכת עולה רגל — בגובה העיניים (ברטנורא)", action: () => { const P = ctx.shared.pilgrimWalk; if (P && typeof P.start === "function") P.start(); },
              info: "לשון המשנה (מידות ב, ב): ״כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל, חוץ ממי שארעו דבר, שהוא מקיף לשמאל. מה לך מקיף לשמאל, שאני אבל, השוכן בבית הזה ינחמך. שאני מנדה, השוכן בבית הזה יתן בלבם ויקרבוך, דברי רבי מאיר״.\n**ברטנורא** (שם): ״נכנסים דרך ימין ומקיפין דרך שמאל. כגון הנכנסים דרך שערי חלדה שהן מן הימין, מקיפין דרך שער הטדי״.\nהסדר לקוח מן המשנה, שנאמרה בימי הבית השני.\nבהדגמה: הליכה בגובה העיניים, לפי המבנה של בית ראשון במודל — שער אחד בכל צד של החצר הגדולה, ואין עזרת נשים: מן המעלות שלפני השער הדרומי נכנסים בשער — ״שער חולדה״ — פונים לימין (מזרחה) לאורך דרום החצר הגדולה, צפונה לאורך המזרח — מול החצר החיצונה והשער המזרחי — מערבה לאורך הצפון, ויוצאים בשער הצפוני — ״שער טדי״. הדרך והקצב — בחירת מודל.",   // QUOTES_Q: מידות ב, ב (89:13): 'מנדה'
              refs: [["מידות ב, ב", { book: 89, index: 13 }], ["ברטנורא מידות ב, ב", { book: 643, index: 64 }]] }
          ]);
          // ----- the City of David and the Millo (decisions 150-153; 59-parallels.js, section 12): the layer "irDavid", off by default -----
          if (ctx.shared.irDavid && ctx.shared.millo) {
            const MA = () => ctx.shared.millo.at();
            parAt("בית שלמה", "בית בת פרעה", [
              { t: "המלוא — סמוך לבית בת פרעה", layer: "irDavid", noFade: true, tg: () => { const p = MA(); return [p[0] + 2, p[1] + 3, p[2]]; }, cam: () => { const p = MA(); return [p[0] - 40, p[1] + 34, p[2] + 46]; },
                action: () => { if (ctx.shared.irDavid) ctx.shared.irDavid.set(true); },
                info: "**הפסוקים:** ״וישב דוד במצדה ויקרא־לה עיר דוד ויבן דוד סביב מן־המלוא וביתה״ (שמואל ב ה, ט); ״אך בת־פרעה עלתה מעיר דוד אל־ביתה אשר בנה־לה אז בנה את־המלוא״ (מלכים א ט, כד); ״שלמה בנה את־המלוא סגר את־פרץ עיר דוד אביו״ (שם יא, כז); ״ויבן העיר מסביב מן־המלוא ועד־הסביב״ (דברי הימים א יא, ח); ובימי חזקיהו: ״ויחזק את־המלוא עיר דויד״ (דברי הימים ב לב, ה).\n" +
                  "**מה המלוא — שתי שיטות (במתג ״צורת המלוא״):** **רחבה פנויה** — רד״ק (שמואל ב ה, ט): ״מקום סמוך לחומה ואותו המקום היתה רחבה להאסף העם שם לפיכך נקרא מלוא״; ספר השרשים לרד״ק (מלא): ״והוא מקום בירושלם סמוך לחומה מבפנים, ולא היה בנוי אלא היה רחבה שנאספים שם״; מצודת דוד (שם): ״כי סמוך להחומה הניח מקום פנוי להיות מוכן להאסף שם מרבית אנשים״; מלבי״ם (שם): ״המלוא היתה חוץ למצודה ששם היו העם מתקבצים״; רלב״ג (מלכים א ט, טו): ״והוא המקום שהיו נאספים שם ישראל״; אברבנאל (שם): ״שהוא היה מקום רחב ויפה סמוך לציון, ששם היו מתקבצים ישראל לעשות שמחות״. **תל עפר בתוך חומה נמוכה** — רש״י (שמואל ב ה, ט): ״הקף חומה נמוכה, וממלאין אותה עפר, וגבה התל באמצע, ומשפע והולך לכל רוח, הוא קרוי מלוא, ועליו בנה דוד בתים, ואותו המלוא היה סביב למצודה״. ושיטה שלישית, שלא צוירה: רלב״ג (שמואל ב ה, ט): ״ואחשב שחפרו סביבה לחזק העיר ההיא ומלאו החפירה המים... ולזה נקרא המקום ההוא מלוא״.\n" +
                  "**לפני שלמה ואחריו (במתג ״המלוא — לפני שלמה או אחריו״):** רש״י (מלכים א ט, כד): ״לבנות לתוכו בתים, לעבדיה ולשפחותיה, וזה שהוכיחו ירבעם: אביך הניחו פרוץ לעולי רגלים, ואתה בנית אותו לעשות אנגריא לבת פרעה״; ושם: ״כי אביו הניחו לפרש בו עולי רגלים אהלים, אלא שבת פרעה עלתה אל ביתה, והמלוא סמוך לאותו בית, אז בנה את המלוא״. בגמרא (סנהדרין קא:): ״אמר לו: דוד אביך פרץ פרצות בחומה כדי שיעלו ישראל לרגל, ואתה גדרת אותם כדי לעשות אנגריא לבת פרעה״; רש״י שם: ״המלוא אחת מן הפרצות גדר ומלאו לכותל החומה ובנה שם מגדל לבת פרעה ולאנשים שעובדין לה״. מלבי״ם (מלכים א ט, כד): ״ולצורך ביתה בנה את המלוא (שהיה מקום פתוח רחב ידים) להיות מוגדר בשבילה לצניעות ובתים לעבדיה ומשרתיה״.\n" +
                  "**במודל:** שכבת ״עיר דוד והמלוא״, כבויה כברירת מחדל. מקום המלוא — מחוץ לחומת המצודה ובתוך חומת העיר, צמוד לחומת העיר מבפנים (ספר השרשים: ״סמוך לחומה מבפנים״; רש״י: ״סביב למצודה״), סמוך לבית בת פרעה (מצודת דוד מלכים א ט, כד: ״שהיה סמוך לביתה״) — על הקרקע שליד טרסת בית המלך; מקומו ומידתו — בחירת מודל. לפני שלמה — רחבה פנויה (או התל) ובה אהלי עולי רגלים, ובשיטת רש״י גם בתי דוד שעל התל; אחרי שלמה — רחבה מגודרת ובה בתים לעבדיה (או בתים על התל, ומגדל לבת פרעה בשיטת רש״י). הדמויות — עולי רגלים, גברים. צורת הבתים, האהלים והמגדל — בחירת מודל. חומת העיר והפרצה — יצוירו עם העיר.",
                refs: [["שמואל ב ה, ט", { book: 9, index: 124 }], ["מלכים א ט, כד", { book: 10, index: 367 }], ["מלכים א יא, כז", { book: 10, index: 429 }], ["דברי הימים א יא, ח", { book: 38, index: 440 }], ["דברי הימים ב לב, ה", { book: 39, index: 718 }],
                  ["רש״י שמואל ב ה, ט", { book: 3688, index: 113 }], ["רד״ק שמואל ב ה, ט", { book: 3541, index: 200 }], ["ספר השרשים, מלא", { book: 6063, index: 2110 }], ["מצודת דוד שמואל ב ה, ט", { book: 3329, index: 259 }], ["מלבי״ם שמואל ב ה, ט", { book: 3390, index: 202 }],
                  ["רלב״ג שמואל ב ה, ט", { book: 3643, index: 74 }], ["רלב״ג מלכים א ט, טו", { book: 3645, index: 408 }], ["אברבנאל מלכים א ט, טו", { book: 3574, index: 534 }], ["רש״י מלכים א ט, כד", { book: 3673, index: 579 }], ["מצודת דוד מלכים א ט, כד", { book: 3345, index: 889 }],
                  ["מלבי״ם מלכים א ט, כד", { book: 3394, index: 580 }], ["סנהדרין קא:", { book: 125, index: 3958 }], ["רש״י סנהדרין קא:", { book: 2180, index: 5595 }], ["רש״י מלכים א יא, כז", { book: 3673, index: 657 }]] },
              // MERGE fix-f (b2): the target on the ridge's surface (its ground there -13.2) - at -20 it lay under the city's ground, and the line from
              // the camera went into the ground just before it (the check of the views: 3 points; now 0)
              { t: "עיר דוד", layer: "irDavid", noFade: true, tg: [105, -13, 820], cam: [-60, 90, 640], action: () => { if (ctx.shared.irDavid) ctx.shared.irDavid.set(true); },
                info: "**הפסוקים:** ״וילכד דוד את מצדת ציון היא עיר דוד״ (שמואל ב ה, ז); ״וישב דוד במצדה ויקרא־לה עיר דוד ויבן דוד סביב מן־המלוא וביתה״ (שם ט); ״להעלות את־ארון ברית־יהוה מעיר דוד היא ציון״ (מלכים א ח, א); ״אך בת־פרעה עלתה מעיר דוד אל־ביתה״ (שם ט, כד); ״ועד־המעלות היורדות מעיר דויד״ (נחמיה ג, טו).\n" +
                  "**מקומה — למטה מן המקדש ומבית המלך, ולמעלה מן הגיחון:** אברבנאל (מלכים א א, לח): ״כלם ירדו מציון עיר דוד שהיה שם בגבוה העיר אל גיחון שהיה בשפל ההר״; רלב״ג (נחמיה ג, טו): ״הנה מציון שהיא עיר דוד היו יורדות מעלות עד חומת ירושלים״.\n" +
                  "**שיטות אחרות במקומה (לא צוירו):** רד״ק (תהלים מח, ג): ״כי ציון בצפון ירושלים״, וכן אבן עזרא, מצודת דוד ומאירי שם; מלבי״ם (נחמיה ג, יד): ״ונודע כי מצודת ציון עיר דוד ובית שלמה מלוא ובית מלוא, היה במורד הר ציון במזרחו״; ובמדרש תדשא (כב): ״בראשונה היתה ירושלים שתי עיירות, אחת היתה עליונה ואחת היתה תחתונה״.\n" +
                  "**החומה:** ״שלמה בנה את־המלוא סגר את־פרץ עיר דוד אביו״ (מלכים א יא, כז); מלבי״ם (דברי הימים א יא, ח): ״וגם ירושלים לא היתה מוקפת עד ימי שלמה״; רלב״ג (דברי הימים ב לב, ה): ״ידוע כי סביב עיר דוד היתה חומה וחוץ מן החומה היה רחוב שהיו מתקבצים בו ולזה נקרא מלוא״. ובימי חזקיהו — ״ולחוצה החומה אחרת״ (דברי הימים ב לב, ה) — במתג הזמן.\n" +
                  "**למה נבנתה החומה — לקדש את העיר:** רלב״ג (מלכים א ג, א): ״הנה היה ראוי לבנות חומה סביב ירושלם לקדש מה שבתוכה כי הרבה מן הקדשים לא היו נאכלים כי אם לפנים מן החומה אחר שנבנה בית ה' שם כמו הענין במעשר שני ובבכורי' ופסח ובכורות ומה שדומה להם״.\n" +
                  "**גן המלך:** ״ואת חומת ברכת השלח לגן־המלך״ (נחמיה ג, טו); מלבי״ם (שם): ״והגן והברכה היו תוך חומת העיר״. ובדין ירושלים: ״ואין עושין בה גנות ופרדסות – חוץ מגנות וורדין שהיו מימות נביאים הראשונים״ (בבא קמא פב:; רמב״ם בית הבחירה ז, יד). הגן בתוך חומת חצר המלך, שהוחרג מן האיסור — ביאור, ולא נמצא לו מקור מפורש.\n" +
                  "**קברי בית דוד — מחוץ לחומת העיר, סמוכים לה, ליד ברכת השלח:** ״ואת חומת ברכת השלח לגן־המלך״ (נחמיה ג, טו); ״עד־נגד קברי דויד ועד־הברכה העשויה״ (שם טז). ובדין: ״ואין מקימין בה קברות חוץ מקברי בית דוד וקבר חלדה שהיו בה מימות נביאים הראשונים״ (רמב״ם בית הבחירה ז, יד). והרדב״ז שם: ״והלא קברי בית דוד וקבר חולדה אינם בתוך ירושלים והיכי שייך למימר חוץ. והנכון בזה שבכל סביבות ירושלים לא היו מניחים קברות סמוכות לעיר משום אוכלי טהרות, וקברי בית דוד וקבר חולדה סמוכות היו והיינו דתניא חוץ״.\n" +
                  "**המחילה:** בתוספתא (בבא בתרא א, ז): ״והלא קבר בית דוד וקבר חולדה הנביאה היו בירושלים ולא נגע בהן אדם מעולם אמר להם משם ראיה מחילה היתה להן והיתה מוציאה טומאה לנחל קדרון״; ובירושלמי (נזיר ט, ג): ״מחילה היה שם ומשם היתה טומאה מקדדת ויוצאה לנחל קדרון״; ובאבות דרבי נתן (לה): ״מחילה היתה שם שהיתה מוציאה הטומאה לנחל קדרון״. ולרדב״ז (בית הבחירה ז, יג) המחילה נאמרה על קבר חולדה בלבד: ״תדע שהרי קברי מלכות בית דוד לא מצינו שיהיה להם מחילות״ — ולכן לא צוירה מחילה.\n" +
                  "**שיטה אחרת במקום הקברים (לא צוירה):** מלבי״ם (נחמיה ג, טז): ״נגד קברי בית דוד שהיו במרום הר ציון״.\n" +
                  "**המשנה** (מלכים ב כב, יד: ״והיא יושבת בירושלם במשנה״): תרגום יונתן: ״בבית אולפנא״ — בית מדרש; וכן רש״י ורד״ק. ויש שפותרים ברש״י: ״בין שתי החומות, שהיא משנה לעיר״ — במצב ״בימי חזקיהו״, בתווית בין החומות.\n" +
                  "**דיני ירושלים בצורת העיר:** בתים בלי זיזין וגזוזטראות לרשות הרבים, בלי גנות ואילנות (חוץ מגנת הוורדים), בלי אשפות וכבשונות, ובלי קברים חוץ מקברי בית דוד (בבא קמא פב:; רמב״ם בית הבחירה ז, יד).\n" +
                  "**במודל:** שכבה פשוטה, כבויה כברירת מחדל: העיר מדרום לטרסת בית המלך ונמוכה ממנה, על רכס שיורד דרומה, בטרסות שהבתים והסמטאות הולכים לאורכן; מחוץ לחומה — מדרונות אל שני עמקים: הגיא ממערב והנחל ממזרח, הנפגשים מדרום לעיר (הדרך היורדת אל המעיין — על כתף הגיא, בין החומה לעמק); חומה סביבה, ובה בימי דוד פרצה ליד המלוא; מצודת ציון ומגדל דוד — במתג ״מצודת ציון״; בית דוד; אהל הארון (לפני שלמה); בפינה הדרומית־מערבית — ברכת השלח בתוך החומה, והמעלות היורדות אליה מן העיר, גן המלך מוקף חומה; ומחוץ לחומה, למטה — המעיין והתעלה הבנויה שיוצאת ממנו אל הברכה (״מי השלח ההלכים לאט״, ישעיהו ח, ו), וקברי בית דוד סמוכים לחומה (פתח חצוב בסלע המדרון, ולידו גולל; בלי מחילה). מידות העיר, גובה הרכס והטרסות, קו החומה, צורת המצודה, הגן והקברים, צורת הבתים ומקומם — בחירת מודל. עומק הגיא והנחל — כעשרים אמה מתחת לשאר הקרקע, כדי שהעיר תיראה רכס בולט גם מרחוק — אין לו מקור, והוא בחירת מודל לטובת המראה.",
                refs: [["שמואל ב ה, ז", { book: 9, index: 122 }], ["שמואל ב ה, ט", { book: 9, index: 124 }], ["מלכים א ח, א", { book: 10, index: 277 }], ["מלכים א ט, כד", { book: 10, index: 367 }], ["נחמיה ג, טו", { book: 37, index: 49 }],
                  ["אברבנאל מלכים א א, לח", { book: 3574, index: 116 }], ["רלב״ג נחמיה ג, טו", { book: 3635, index: 56 }], ["רד״ק תהלים מח, ג", { book: 3523, index: 2372 }], ["מלבי״ם נחמיה ג, יד", { book: 3370, index: 85 }], ["מדרש תדשא כב", { book: 7715, index: 148 }],
                  ["מלכים א יא, כז", { book: 10, index: 429 }], ["מלבי״ם דברי הימים א יא, ח", { book: 3372, index: 546 }], ["רלב״ג דברי הימים ב לב, ה", { book: 3639, index: 423 }], ["נחמיה ג, טז", { book: 37, index: 50 }], ["מלבי״ם נחמיה ג, טז", { book: 3370, index: 87 }],
                  ["בבא קמא פב:", { book: 122, index: 3124 }], ["רמב״ם בית הבחירה ז, יד", { book: 337, index: 124 }],
                  ["רדב״ז בית הבחירה ז, יד", { book: 5308, index: 135 }], ["רדב״ז בית הבחירה ז, יג", { book: 5308, index: 130 }], ["תוספתא בבא בתרא א, ז", { book: 210, index: 8 }], ["ירושלמי נזיר ט, ג", { book: 166, index: 354 }],
                  ["אבות דרבי נתן לה", { book: 1851, index: 223 }], ["רלב״ג מלכים א ג, א", { book: 3645, index: 99 }], ["ישעיהו ח, ו", { book: 12, index: 167 }]] }
            ]);
          }
          // ----- the thirteen shofarot (item 22; decision 112 ג: a switch of its own, off by default; 59-parallels.js, section 11) -----
          // SHOFAROT_VIEW_N1: the eye stood at x 97, east of the court's east wall (the row is at x 80, its mouths to the west), and saw the wall (faded, as a glass) in front of the boxes; now from the west, inside the court, at the row's middle: the wall behind them
          parAt("הר הבית והחצרות", "ארון יהוידע שבשער — לתקלין עתיקין", [
            { t: "שלושה עשר השופרות — מתג", tg: [80, 7, -23], cam: [58, 16, -23], feature: parFeat("shofarot13"),
              info: "**המשנה** (שקלים ו, ה): ״שלשה עשר שופרות היו במקדש, וכתוב עליהם, תקלין חדתין ותקלין עתיקין, קנין וגוזלי עולה, עצים, ולבונה, זהב לכפרת. ששה, לנדבה״; ושם (ו, ו): ״זה מדרש דרש יהוידע כהן גדול״.\n" +
                "**המלבי״ם** (מלכים ב יב, י), על ״ויקח יהוידע הכהן ארון אחד״: ״ומבואר בפ\"ו דשקלים כי י\"ג שופרות היו במקדש וכתוב עליהם תקלין חדתין תקלין עתיקין קינים וגוזלים עולות עצים ולבונה וכו', וי\"ל שרמז זה במ\"ש ארון אחד... (וי\"ל שרמז שכל הי\"ג ארונות נקראו בשם ארון אחד שאחד מספרו י\"ג...)״.\n" +
                "**הירושלמי** (שקלים ו, ד): ״אמר רבי יוחנן. על ידי שהנדבה מרובה ריבו לה שופרות הרבה. [שנאמר] וככלותם הביאו לפני המלך ויהוידע וגו׳״.\n" +
                "**ברטנורא** (שקלים ב, א): ״שופרות. תבות שפיהן צר למעלה, כעין שופר שפיו צר מלמעלה והולך ומרחיב, כדי שלא יוכלו לטל מהן כלום. כההיא דכתיב ביהוידע... ויקב חר בדלתו. והיו עומדים בעזרה״; ושם (ו, א): ״תבות צרות מלמעלה ורחבות מלמטה עקמות כעין שופר״.\n" +
                "**במודל:** המשנה נאמרה בימי הבית השני; בבית ראשון השופרות מוצגים במתג נפרד, כבוי כברירת מחדל, כרמז המלבי״ם. מקומם — בעזרה, ליד ארון יהוידע הפנימי, ״אצל המזבח מימין בבוא איש בית ה׳״ (מלכים ב יב, י): מצפון לציר, בימין הנכנס מן המזרח. צורתם כבבית השני; מקומם, מידתם והמתכת — בחירת מודל.",
              refs: [["שקלים ו, ה", { book: 54, index: 42 }], ["שקלים ו, ו", { book: 54, index: 43 }], ["מלבי״ם מלכים ב יב, י", { book: 3379, index: 449 }], ["ירושלמי שקלים ו, ד", { book: 154, index: 215 }],
                ["ברטנורא שקלים ב, א", { book: 593, index: 56 }], ["ברטנורא שקלים ו, א", { book: 593, index: 213 }]] }
          ]);
          // ----- the spring of the Shiloach and the water's libation (items 10, 11; 59-parallels.js, sections 9-10): only when the spring has its
          // place in this house (SPRING_C there - the user's answer to question 117); until then neither place appears -----
          {
            const SH1 = ctx.shared.shiloach1, C = SH1 && SH1.place;
            if (C) {
              const yw = C.yaw || 0, cs = Math.cos(yw), sn = Math.sin(yw), Wl = (lx, lz) => [C.x + lx * cs + lz * sn, C.z - lx * sn + lz * cs];
              const gy = () => { const S = ctx.shared.shiloachSpring1; return S ? S.gy : -52; };
              parAt("הר הבית והחצרות", "הליכת עולה רגל — בגובה העיניים (ברטנורא)", [
                { t: "מעיין השילוח", tg: () => { const q = Wl(1.5, 1.6); return [q[0], gy() + 2.5, q[1]]; }, cam: () => { const q = Wl(10.5, -35.4); return [q[0], gy() + 9, q[1]]; }, noFade: true,
                  info: "**בימי הבית הראשון** — הפסוק (מלכים א א, לג): ״והורדתם אתו אל־גחון״; רש״י שם: ״אל גחון. הוא מעין השלוח, מכאן שאין מושחין את המלכים אלא על המעין, סימן שתמשך מלכותו״; ובתרגום יונתן: ״ותחתון יתיה לשילוחא״. ושם (מה): ״ויעלו משם שמחים״.\n" +
                    "ומנשה (דברי הימים ב לג, יד): ״בנה חומה חיצונה לעיר־דויד מערבה לגיחון בנחל״. הפסוק (ישעיהו ח, ו): ״יען כי מאס העם הזה את מי השלח ההלכים לאט״; ויחזקיהו (שם לב, ל): ״סתם את־מוצא מימי גיחון העליון ויישרם למטה־מערבה לעיר דויד״; ובימי נחמיה (נחמיה ג, טו): ״ואת חומת ברכת השלח לגן־המלך״.\n" +
                    "**המשנה** (סוכה ד, ט): ״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח״; ובשבת (שם, י): ״היה ממלא מערב שבת חבית של זהב שאינה מקדשת, מן השלוח, ומניחה בלשכה״.\n" +
                    "**הירושלמי** (סוכה ה, ו): ״תני. רבן שמעון בן גמליאל אומר. שילוח היה מוציא מים כאיסר. אמרו. נרחיבנו וירבו מימיו. הרחיבוהו ונתמעטו מימיו. חזרו וגדרוהו וחזר לכמות שהיה״.\n" +
                    "**מקומו — במערב, למטה מעיר דוד:** מלבי״ם (דברי הימים ב לג, יד): ״מערבה לגיחון. הוא בצד מערב ירושלים״; ושם (לב, ל): ״מערבה. כי ברכת השלח היה בצד מערב כמבואר בנחמיה ג׳״; ועל נחמיה (ג): ״וקרוב לו למזרחו בתוך החומה היו מי השלוח שנקרא ג״כ בריכת המלך״. וחזקיהו הטה את המים: רד״ק (דברי הימים ב לב, ל): ״ישרם והעבירם למטה מן הארץ על ידי חלונות לצד מערב לעיר דוד״; רלב״ג (שם): ״ועשה תחבולה שהביא אותם המים למטה דרך חריצין תחת הקרקע לפאת מערב לעיר דוד״. מקום המוצא העליון לפני חזקיהו — לא נאמר.\n" +
                    "**במודל:** המעיין ליד הפינה הדרומית־מערבית של עיר דוד, למטה מן העיר — המוצא מחוץ לחומה, והמים יורדים אל ברכת השלח שבתוך החומה (כמלבי״ם) — בחירת מודל. צורתו — הבנייה של הבית השני, אחת לשני הבתים: צוק כתום־חום ובתחתיתו פתח קטן, המים יוצאים בקול גדול ״כאיסר״ ונופלים במפל לבן צר אל בריכה טבעית שבין סלעים, ובה קצף ומערבולת; שרכים ושיחים, כמו בחלמיש (עמ׳ 13). הכהן ממלא מן הגדה, לצד המפל.\n" +
                    "**התעלה אל ברכת השלח:** מן הבריכה הטבעית יוצאת תעלה פתוחה, צרה ורדודה ובנויה מאבן, והמים זורמים בה לאט אל ברכת השלח — כמו בפסוק: ״יען כי מאס העם הזה את מי השלח ההלכים לאט״ (ישעיהו ח, ו). במקום שהיא פוגשת את חומת עיר דוד יש בחומה פתח קטן. צורתה המדויקת ומסלולה — בחירת מודל.\n" +
                    "צורת הצוק, המפל, הבריכות והצמחייה — בחירת מודל.",
                  refs: [["מלכים א א, לג", { book: 10, index: 34 }], ["רש״י מלכים א א, לג", { book: 3673, index: 39 }], ["תרגום יונתן מלכים א א, לג", { book: 3206, index: 34 }], ["מלכים א א, מה", { book: 10, index: 46 }],
                    ["דברי הימים ב לג, יד", { book: 39, index: 761 }], ["מלבי״ם דברי הימים ב לג, יד", { book: 3364, index: 971 }], ["מלבי״ם דברי הימים ב לב, ל", { book: 3364, index: 958 }], ["מלבי״ם נחמיה ג", { book: 3370, index: 85 }], ["רד״ק דברי הימים ב לב, ל", { book: 3522, index: 507 }], ["רלב״ג דברי הימים ב לב, ל", { book: 3639, index: 434 }], ["ישעיהו ח, ו", { book: 12, index: 167 }], ["דברי הימים ב לב, ל", { book: 39, index: 743 }], ["נחמיה ג, טו", { book: 37, index: 49 }], ["סוכה ד, ט", { book: 56, index: 48 }],
                    ["סוכה ד, י", { book: 56, index: 49 }], ["ירושלמי סוכה ה, ו", { book: 156, index: 244 }]] },
                { t: "ניסוך המים מן השילוח — הדגמה", action: () => { const D = ctx.shared.shiloachDemo1; if (D && typeof D.start === "function") D.start(); },
                  info: "**המשנה** (סוכה ד, ט): ״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו. עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם... מערבי של מים, מזרחי של יין... ולמנסך אומרים לו, הגבה ידך״.\n" +
                    "**הפתיחה** (סוכה ה, ד): ״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן. קרא הגבר, תקעו והריעו ותקעו... היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח. הגיעו לשער היוצא ממזרח, הפכו פניהן למערב״.\n" +
                    "**שער המים** (מדות א, ד): ״שבדרום, שער הדלק. שני לו, שער הבכורות. שלישי לו, שער המים״; ושם (ב, ו): ״ולמה נקרא שמו שער המים. שבו מכניסין צלוחית של מים של נסוך בחג״.\n" +
                    "**בשעת הניסוך** (תמיד ז, ג): ״הסגן עומד על הקרן והסודרים בידו, ושני כהנים עומדים על שלחן החלבים ושתי חצוצרות של כסף בידם, תקעו והריעו ותקעו... והניף הסגן בסודרין... ודברו הלוים בשיר״; ״ובשנים עשר יום בשנה החליל מכה לפני המזבח... ובשמונת ימי החג״ (ערכין ב, ג). והלויים — ״עמדים מזרח למזבח״ (דברי הימים ב ה, יב).\n" +
                    "**בבית ראשון:** הסדר הוא סדר המשנה, שנאמרה בימי הבית השני. בהדגמה הוא מותאם לבניין של בית ראשון, שאין בו עזרת נשים ושערי חולדה — בחירת מודל: ״השער העליון״ — השער המזרחי של החצר הפנימית; ״השער היוצא מזרח״ — השער המזרחי של החצר החיצונה; ״שער המים״ — השלישי משערי הדרום של החצר הפנימית, כסדר מדות א, ד; הדרך — מן העזרה דרך שער המערב של החצר הגדולה, במעלות אל הנחל ודרומה אל המעין (שבפינה הדרומית־מערבית של עיר דוד, לפי מלבי״ם), וחזרה בשער המים. הלפידים, הלילה והחזרה לפני עלות השחר — כפי שהובא בחלמיש. הדרך, הזמנים ומקומות הדמויות — בחירת מודל; ההליכה מחוץ לחצר מואצת.\n" +
                    "**הניסוך בבית ראשון:** לא צוירו ספלים — רש״י (זבחים סא:): ״ובימי שלמה היה כמין בור כרוי אצל המזבח באותה זוית לירד הנסכים בתוכו ויורדין מן המזבח ולרצפה ושותתין שם״; המשנה נאמרה על בית שני. לכן בהדגמה הכהן שופך בראש המזבח בקרן הדרומית־מערבית, והמים יורדים מן המזבח לרצפה ואל הבור. דרך המים על המזבח — בחירת מודל.",
                  refs: [["סוכה ד, ט", { book: 56, index: 48 }], ["סוכה ה, ד", { book: 56, index: 54 }], ["מדות א, ד", { book: 89, index: 5 }], ["מדות ב, ו", { book: 89, index: 17 }],
                    ["תמיד ז, ג", { book: 88, index: 40 }], ["ערכין ב, ג", { book: 84, index: 9 }], ["דברי הימים ב ה, יב", { book: 39, index: 91 }], ["רש״י זבחים סא:", { book: 2191, index: 2950 }]] }
              ]);
            }
          }
          parAt("המזבח וכלי הנחושת", "שלוש המחתות — בכל יום וביום הכיפורים", [
            { t: "מצות ערבה — הדגמה", feature: parFeat("aravah"), tg: () => { const z = parAltarDz(); return [55, 12, z]; }, cam: () => { const z = parAltarDz(); return [24, 34, -24 + z]; },
              info: "לשון המשנה (סוכה ד, ה): ״מצות ערבה כיצד, מקום היה למטה מירושלים, ונקרא מוצא. יורדין לשם ומלקטין משם מרביות של ערבה, ובאין וזוקפין אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח. תקעו והריעו ותקעו. בכל יום מקיפין את המזבח פעם אחת, ואומרים, אנא ה׳ הושיעה נא, אנא ה׳ הצליחה נא... ואותו היום מקיפין את המזבח שבע פעמים״.\n**הגמרא** (סוכה מה.): ״תנא: רבות, וארוכות, וגבוהות אחת עשרה אמה, כדי שיהו גוחות על המזבח אמה. אמר מרימר משום מר זוטרא: שמע מינה על היסוד מנח להו״.\n**בשבת** (סוכה ד, ו): ״אלא שהיו מלקטין אותן מערב שבת ומניחים אותן בגיגיות של זהב, כדי שלא יכמשו״; **רש״י** (סוכה מה.): ״גיגיות — קונ״ש של זהב מלאות מים״; **ברטנורא**: ״כלים של זהב מלאים מים, כדי שלא יכמשו עליהן״; **הרמב״ם** (שופר וסוכה ולולב ז, כב): ״מביאין אותה מערב שבת למקדש ומניחין אותה בגגיות של זהב כדי שלא יכמשו העלין, ולמחר זוקפין אותה על גבי המזבח״.\n**מפי הגר״ח קניבסקי**, כפי שהובא בחלמיש (״אלחנן וחיים שמחים בירושלים״, רשימת המקורות, על עמ׳ 25): ״יש ערבות רבות שממלאות את צדי המזבח, ולא מעטות״; ״הערבות צריכות להיות מנחות ישירות על היסוד ולא בתוך כלי, וכנראה היו לערבות גזעים עבים, וכך עמדו על היסוד״; ״הערבות מנחות רק במקום שיש יסוד, וזה נקרא ׳להקיף את המזבח׳״. ושם (על עמ׳ 30): ״מהגמרא משמע שהיו הרבה ערבות מסביב למזבח, אולם כאמור הן עמדו רק במקום שהיה יסוד, וזה נקרא ׳מסביב׳״; ועורכי חלמיש הוסיפו שם: ״שאולי לא כסו ממזרח, וכן מדרום, כדי לא להסתיר את הקרבת הקרבנות והנסוך לישראלים שעמדו במזרח ובדרום, מצד שער המים״.\nהסדר לקוח מן המשנה, שנאמרה בימי הבית השני.\nבמודל של בית ראשון: ערבות רבות, עבות בתחתיתן, עומדות על יסוד מזבח הנחושת — לאורך הצפון והמערב, כבבית השני — גבוהות אחת עשרה אמה, וראשיהן כפופים על גבי המזבח. לשיטת התוספות היה בבית ראשון יסוד גם בדרום (ראו ״חלקי יהודה ובנימין״); שם עומד הכבש, ולא הוצבו שם ערבות — בחירת מודל. ההולכים מקיפים את המזבח ואת הכבש, ממזרח לעשר המכונות ולשני השלחנות; מי מקיף — לפי השיטה ״הקפת המזבח בערבה — כהנים בלבד, או גם ישראל״ שבשיטות ומחלוקות (ברירת המחדל: הכהנים לבדם, ובידם בד ערבה). יום חול של החג — בלי גיגיות; בלי תפילין. מספר הערבות וצורתן, הדרך שבה מקיפים, כיוון ההליכה, מספר ההולכים וקצבם — בחירת מודל. הערבות וההולכים זזים עם המזבח במתג ״מקום המזבח״.",
              refs: [["סוכה ד, ה", {"book": 56, "index": 44}], ["סוכה ד, ו", {"book": 56, "index": 45}], ["סוכה מה.", {"book": 108, "index": 1165}], ["סוכה מה. — על היסוד", {"book": 108, "index": 1166}], ["רש״י סוכה מה.", {"book": 2163, "index": 2085}], ["ברטנורא סוכה ד, ו", {"book": 588, "index": 207}], ["רמב״ם שופר וסוכה ולולב ז, כב", {"book": 314, "index": 118}], ["תוספתא סוכה ג, ב", {"book": 195, "index": 27}]] }
          ]);
          // ----- the house from outside: the windows of Beit HaChalifot -----
          parAt("הבית מבחוץ", "פשפשי בית החליפות", [
            { t: "בית החליפות — חלונות הסכינים", view: "chalifotWindows", action: () => openPill20("ui-ulam"),
              info: "לשון המשנה (מידות ד, ז): ״האולם עודף עליו חמש עשרה אמה מן הצפון, וחמש עשרה אמה מן הדרום, והוא היה נקרא בית החליפות, ששם גונזים את הסכינים״.\nוהמשנה (סוכה ה, ח): ״בלגה לעולם חולקת בדרום, וטבעתה קבועה, וחלונה סתומה״. **רש״י** שם: ״וחלונה סתומה — חלונות היו בבית החליפות בעובי כותלי התאים שבצפונו של היכל ששם גונזין את סכיניהן כדתנן במסכת מדות (פ״ד משנה ז) וסתמו חלונה של בילגה״.\n**עשרים וארבע המשמרות** — מימי דוד: ״ויצא הגורל הראשון ליהויריב... לבלגה חמשה עשר... למעזיהו ארבעה ועשרים״ (דברי הימים א כד, ז–יח).\n**חלונה של בלגה — פתוח כאן.** הגמרא (סוכה נו:): ״מעשה במרים בת בילגה שהמירה דתה... כשנכנסו יוונים להיכל... וכששמעו חכמים בדבר, קבעו את טבעתה וסתמו את חלונה. ויש אומרים: משמרתו שוהה לבא״ — לטעם הראשון בימי יוונים, בבית השני; לטעם השני לא נתפרש מתי.\nבמודל: עשרים וארבעה חלונות — חלון לכל משמר — באגף הצפוני של בית החליפות, על כותלו המערבי, הכותל שכנגד התאים; בשלוש שורות של שמונה, ובכל אחד שתי סכינים; כולם פתוחים. כדי לראותם, חזית האולם וגגו מוסרים לעשרים שניות (כמו ״פתח את האולם״). גודלם, גובהם ומקומם — בחירת מודל.",
              refs: [["מידות ד, ז", { book: 89, index: 34 }], ["סוכה ה, ח", { book: 56, index: 58 }], ["רש״י סוכה נו.", { book: 2163, index: 2731 }], ["דברי הימים א כד, ז", { book: 38, index: 795 }], ["דברי הימים א כד, יד", { book: 38, index: 802 }], ["דברי הימים א כד, יח", { book: 38, index: 806 }], ["סוכה נו:", { book: 108, index: 1467 }], ["סוכה נו: — ויש אומרים", { book: 108, index: 1468 }]] }
          ]);
        }
        {
          const isCity = (g) => CITY_RE.test(g[0]);
          const sh = grpOf("בית שלמה");
          if (sh) {
            const lift = [];
            for (const g of PLACES) {
              if (g === sh || isCity(g) || g[0] === "השלמות מחז״ל ובחירות מודל") continue;
              for (let k = 0; k < g[1].length; k++) if (g[1][k] && CITY_RE.test(String(g[1][k].t))) lift.push(g[1].splice(k--, 1)[0]);
            }
            const own = sh[1].filter((it) => it && CITY_RE.test(String(it.t)));
            // MERGE fix-c (b2): the place "עיר דוד" (agent C's overview of the city) heads them - the menu starts with the City of David,
            // then its spring and the libation, then the Millo beside the palace (the route up to the house of the king)
            const head = lift.concat(own), kc = head.findIndex((it) => /^עיר דוד/.test(String(it.t)));
            if (kc > 0) head.unshift(head.splice(kc, 1)[0]);
            sh[1] = head.concat(sh[1].filter((it) => !(it && CITY_RE.test(String(it.t)))));
          }
          const RANK = ["בית שלמה", "הר הבית והחצרות", "המזבח וכלי הנחושת", "הבית מבחוץ", "היציע — התאים", "הבית מבפנים"];
          const at = new Map(PLACES.map((g, i) => [g, i]));
          const rank = (g) => (isCity(g) ? -1 : RANK.indexOf(g[0]) >= 0 ? RANK.indexOf(g[0]) : 100 + at.get(g));
          PLACES.sort((x, y) => rank(x) - rank(y) || at.get(x) - at.get(y));
        }
      }
      // the grid's views that repeated a place: the place stays, in its group (ui_VIEWS keeps them for the presentation and the labels)
      // TOUR_FIX_137: the place's title is "החצר החיצונה (החצר החדשה)" since 1.0.1 - under the old one the view never folded into it
      const UI_VIEW_HOME = { newCourt: "החצר החיצונה (החצר החדשה)", azarah: "חצר הכהנים", mizbeach: "מזבח הנחושת", yam: "הים של שלמה", mechonot: "עשר המכונות והכיורות",
        heichalSouth: "היציע והתאים", ulamInside: "האולם ובית החליפות", heichalDoor: "פתח ההיכל ודלתותיו", kodesh: "ההיכל", devirDoor: "פתח הדביר (מזוזות חמישית) — שני ביאורי רש״י",
        aliyot: "העליות (רש״י דה״י ג, ד)", palace: "החצר הגדולה",
        // 1.1.0 (the user: no doubles): the last three of the grid too - the grid keeps "מבט כללי" alone
        heichalFront: "הבית (בית ה׳)", yachinBoazFull: "יכין ובועז — מבט מפתח האולם", kodeshHakodashim: "קודש הקדשים — הדביר" };
//@@end buildUI.after-PLACES
//@@begin buildUI.after-b
              // DEMO_FLY_301 (the user, 18.11.2026: "ואני גם לב שכנראה בעוד הדגמות"): a pill whose own switch leaves the view where it is
              // (pressed on the model, one stands by it already - the witnesses' scene) started from this group ran out of sight, wherever
              // the camera was (from the opening view: 570 amot away). From the group it flies to its place's view (d.fly, a fly point)
              if (d.fly) { const f = resolveFp(d.fly); if (f) fly(f.pos, f.target); }
//@@end buildUI.after-b
//@@begin buildUI.after-box
              refs: it.key ? ui_REFS[it.key] || [] : it.refs || [], layer: it.layer || null, feature: it.feature ? it.feature.key : it.tourFeature || null, item: it });   // 1.3.3: tourFeature - switched on by the presentation only
//@@end buildUI.after-box
//@@begin buildUI.after-tgt
              // 1.0.1-K: no automatic removal - a place only flies (and, when it is one, shows its own model feature)
              if (pos && tgt) fly(pos, tgt);
              // PLACE_NOFADE_211 (the user, 15.11.2026, of the place "בר שורא": "לא מציג כלום" - the wall it stands by was see-through):
              // a place whose subject is a wall itself holds the fading while it shows (ctx.shared.fadeHold, as the readings' rows)
              if (pos && tgt && it.noFade && ctx.shared.fadeHold) { try { ctx.shared.fadeHold.set(tgt); } catch (_) {} }
//@@end buildUI.after-tgt
//@@begin buildUI.after-tgt-2
            refs: it.key ? ui_REFS[it.key] || [] : it.refs || [], layer: it.layer || null, feature: it.feature ? it.feature.key : it.tourFeature || null, item: it });   // 1.3.3: tourFeature - switched on by the presentation only
//@@end buildUI.after-tgt-2
//@@begin openCard
        ui_fillRich(cardBody, t.key ? ui_INFO[t.key] || "" : t.text || "", srcLinker(rs), 1700);   // 1.0.2 (A): the brackets open their sources; 1.3.3: rich; FOLD_211
//@@end openCard
//@@begin buildUI.DIM
        // 1.0.1-K: the explanations of the labels that are parts of something (the yatzia section's measures, the layers of the wall, of the
        // floor and of the golden altar, the parts of the base, the rooms of the king's house) - each its own text and sources
        const DIM = {
          wall: { title: "עובי כותל הבית", info: "כותל הבית בחתך: **שבע אמות עוביו בקומה התחתונה של התאים, שש בתיכונה, חמש בעליונה וארבע מעל גג התאים**.\nרש״י (מלכים א ו, ו): 'וכשעולה כתל ההיכל חמש אמות, גורע את עביו, וכנס בו אמה לפנים, והניח על אותה כניסה ראשי קורות גג עלית התא, שהיא קרקעית לאמצעית, וכשעולה עשר, כנס אמה'.\nמצודת דוד: 'וכן פחתו אמה בכלות חמשה עשר אמות, להניח על כניסת האמה קורות תקרת השלישים'.\nכך מצייר הספר; במשנת מדות (ד, ז), בבית שני — שש.",
            refs: [["מלכים א ו, ו", V(10, 6, 6)], ["רש״י ו, ו", V(10, 6, 6)], ["מדות ד, ז", MI(4, 7)]] },
          width: { title: "רוחב התא", info: "רוחב התאים: 'היציע התחתנה חמש באמה רחבה והתיכנה שש באמה רחבה והשלישית שבע באמה רחבה כי מגרעות נתן לבית סביב חוצה לבלתי אחז בקירות הבית' (מלכים א ו, ו).\nכותל הבית נכנס אמה בכל קומה, וכותל התא החיצוני עולה ישר — ולכן **כל קומה רחבה מזו שמתחתיה אמה**.",
            refs: [["מלכים א ו, ו", V(10, 6, 6)], ["רש״י ו, ו", V(10, 6, 6)]] },
          height: { title: "גובה הקומה", info: "גובה כל קומה: 'ויבן את היציע על כל הבית חמש אמות קומתו' (מלכים א ו, י) — רש״י: 'הרי גבהן חמש עשרה אמות, לבד עבי התקרה'.\nבמודל: בין קומה לקומה קורות ארז, אמה עובין (בחירת מודל).",
            refs: [["מלכים א ו, י", V(10, 6, 10)], ["רש״י ו, י", V(10, 6, 10)]] },
          // 1.3.4: the Rambam's measures in the section (50-heichal.js sec. 4b, layer yatziaDimsRb)
          rbStrip: { title: "הרצועות לשיטת הרמב״ם", info: "לשון המשנה (מדות ד, ז): ״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״.\n**פירוש המשניות לרמב״ם** (מדות ד, ג): ״כותל המסיבה וכותל התא וכותל ההיכל לא היה כותל סתום אלא שני כותלים וביניהם הרחקה״.\nבמודל — מידות המשנה (של בית שני) על בית ראשון, כמו בספר ״מקרא מפורש״: שישה כתלים דקים של אמה, וביניהם חמש הרצועות. **הרצועות שוות בכל הקומות — ההבדלים, חמש, שש ושבע, ביציעים שבחוץ.**",
            refs: [["מדות ד, ז", MI(4, 7)], ["פירוש המשניות לרמב״ם מדות ד, ג", { book: 573, index: 51 }]] },
          rbGallery: { title: "היציעים לשיטת הרמב״ם", info: "לשון המשנה (מדות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״.\n**פירוש המשניות לרמב״ם** (מדות ד, ד): ״היציע. הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית״.\nבמודל: היציעים מחוץ לכותל המסבה — **חמש, שש ושבע**; הרובד של שש הוא רצפת האמצעית, ושל שבע — רצפת העליונה. מעקה נמוך על כל שפה — בחירת מודל.",
            refs: [["מדות ד, ד", MI(4, 4)], ["פירוש המשניות לרמב״ם מדות ד, ד", { book: 573, index: 53 }]] },
          ta: { info: "כותל התאים החיצוני — חמש אמות: 'וכתל התא חמש' (משנת מדות ד, ז, בבית שני; כציור הספר — בחירת מודל לבית ראשון).\nעליו מונחים ראשי קורות הגג, ורצועתם נראית בראש הכותל מבחוץ.",
            refs: [["מדות ד, ז", MI(4, 7)]] }
        };
        const dimOf = (l) => {
          if (l.dim && DIM[l.dim]) return DIM[l.dim];   // 1.0.1-L: 50-heichal.js names each measure (wall / width / height / ta)
          const z = Math.abs(l.z || 0);
          return l.layer === "yatziaDims" || (l.layers && l.layers.indexOf("yatziaDims") >= 0) ? (z <= 15.5 ? DIM.wall : z < 19.5 ? DIM.width : DIM.height) : null;
        };
        const ARK_L = (refs) => ({ info: UI_ARK_TXT, refs, title: "מה שבתוך הארון" });
        const LABEL_MAP = {
          // 1.0.1-L (L.85; part5-house.md FOR-UI 2)
          "שני לחות האבנים (ח, ט)": ARK_L([["מלכים א ח, ט", V(10, 8, 9)]]),
          "תחתיהם: שברי הלוחות (מנחות צט.)": ARK_L([["מנחות צט.", { book: 131, index: 3535 }], ["רש״י בבא בתרא יד:", { book: 2178, index: 585 }]]),
          "השם וכל כינויו (בבא בתרא יד:)": ARK_L([["בבא בתרא יד:", { book: 124, index: 381 }]]),
          "ספר התורה (בבא בתרא יד.)": ARK_L([["בבא בתרא יד.", { book: 124, index: 369 }]]),
          "הארגז (שמואל א ו, ח)": ARK_L([["שמואל א ו, ח", { book: 8, index: 133 }], ["יומא נב:", { book: 107, index: 1344 }]]),
          "העמודים (בבא בתרא יד.)": ARK_L([["בבא בתרא יד.", P(124, "יד.")], ["בבא בתרא יד:", P(124, "יד:")]]),
          "צנצנת המן (שמות טז, לג)": ARK_L([["שמות טז, לג", V(2, 16, 33)], ["רש״י שם", V(2, 16, 33)]]),
          "צלוחית שמן המשחה (יומא נב:)": ARK_L([["יומא נב:", { book: 107, index: 1344 }]]),
          "מקל אהרן ושקדיה ופרחיה (יומא נב:)": ARK_L([["יומא נב:", { book: 107, index: 1344 }], ["במדבר יז, כג", V(4, 17, 23)], ["במדבר יז, כה", V(4, 17, 25)]]),
          "לשכות (ירמיה לה, ד; לו, י)": { p: "לשכות החצר החיצונה" },
          // 1.3.5 (the full scan: "labels without sources"): the three layers of the ceilings, and the two verses of the doors' demonstration
          "תקרה קמורה — ״כמו ספינה וערבה הפוכה״ (רש״י)": { p: "בית דילפא — בין תקרת הגבים לשדרות" },
          "בית דילפא — חלל שתי אמות בין התקרות": { p: "בית דילפא — בין תקרת הגבים לשדרות" },
          "שדרות בארזים — ארזים זה בצד זה, רצפת העלייה (רש״י ו, ט)": { p: "בית דילפא — בין תקרת הגבים לשדרות" },
          "״והפתות לדלתות הבית... זהב״ — רש״י: ״מפתחות... שמפתחין בהם את המנעול״ (מלכים א ז, נ)": { p: "פתיחת דלתות ההיכל — הדגמה" },
          "״ושתי דלתות עצי ברושים שני צלעים הדלת האחת גלילים״ (מלכים א ו, לד)": { p: "פתיחת דלתות ההיכל — הדגמה" },
          "העמוד (מלכים ב יא, יד)": { p: "העמוד — מקום המלך" },
          // 1.3.5: the wickets, the lul and the sotah's slab
          "פשפש בית החליפות — בקרן זווית, גבוה שמונה": { p: "פשפשי בית החליפות" }, "לול קטן אחורי בית הכפורת — גבוה שמונה אמות (זבחים נה:)": { p: "הלול שאחורי בית הכפורת" },
          "טבלא של שיש וטבעת — עפר הסוטה": { p: "טבלת השיש — עפר הסוטה" },
          // 1.3.7 (LABELS_ROUND_137): the two halves of the Gazit hall (GAZIT_MEIRI_137)
          "חצי החול — במערב": { p: "לשכת הגזית" },
          "חצי הקודש — במזרח": { p: "לשכת הגזית" },
          // 1.3.7 (LABELS_DEVIR_HEIGHT_137): the labels of the two readings of a devir thirty amot high
          "קודש הקדשים — שלושים אמה, כהיכל (בבא בתרא צח:)": { p: "קודש הקדשים — הדביר" },
          "עשר האמות העליונות — אבן יקרה (רד״ק ו, כ)": { p: "קודש הקדשים — הדביר" },
          // 1.3.5: the lesser courts, and the names inside Lishkat HaGazit
          "בר שורא — חומה קטנה לפנים מן החומה (רש״י פסחים פו.)": { p: "בר שורא — חומה קטנה לפנים מן החומה" },
          "סנהדרי קטנה — על פתח העזרה (סנהדרין יא, ב)": { p: "שתי הסנהדראות הקטנות" }, "סנהדרי קטנה — על פתח הר הבית (סנהדרין יא, ב; רש״י)": { p: "שתי הסנהדראות הקטנות" }, "סנהדרי קטנה — על פתח הר הבית, בשער המזרחי (סנהדרין יא, ב)": { p: "שתי הסנהדראות הקטנות" },
          "הסנהדרין הגדולה — שבעים ואחד בשורה אחת, כחצי גורן": { p: "לשכת הגזית" }, "הנשיא": { p: "לשכת הגזית" }, "סופרי הדיינין": { p: "לשכת הגזית" }, "שלוש שורות של תלמידי חכמים": { p: "לשכת הגזית" },
          "ארון יהוידע שבשער — לתקלין עתיקין (דברי הימים ב כד, ח; מלבי״ם)": { p: "ארון יהוידע שבשער — לתקלין עתיקין" },
          "ארון יהוידע אצל המזבח — לתקלין חדתין (מלכים ב יב, י; מלבי״ם)": { p: "ארון יהוידע אצל המזבח — לתקלין חדתין" },
          "הר הבית": { p: "הר הבית והחצר הגדולה" },   // 1.0.1-K (K.9b item 1): the view left the grid; the place stays
          "החצר הגדולה": (l) => (l.layer === "palace" || (l.layers && l.layers.indexOf("palace") >= 0) ? { p: "החצר הגדולה" } : { p: "הר הבית והחצר הגדולה" }),
          "החצר החיצונה": { v: "newCourt" },
          "החצר החיצונה (החצר החדשה)": { v: "newCourt" },
          "השער המזרחי של החצר החיצונה": { v: "newCourt" },
          "השער המזרחי": (l) => ((l.x || 0) < 200 ? { p: "שערי חצר הכהנים" } : { p: "השער המזרחי" }),   // the inner court's east gate (x 99.5) / the great court's (x 362): the place
          "השער הצפוני — שער טדי": { p: "השער הצפוני — שער טדי" },   // NAMES_C (fix-c): the labels carry the names of Middot 1:3; each gate has its place
          "השער הדרומי — שער חולדה": { p: "השער הדרומי — שער חולדה" },
          "השער המערבי — שער קיפונוס": { p: "השער המערבי — שער קיפונוס" },
          "החצר הפנימית (חצר הכהנים ועזרת ישראל)": { v: "azarah" },
          "שער צפוני א": { p: "שערי חצר הכהנים" }, "שער צפוני ב": { p: "שערי חצר הכהנים" }, "שער צפוני ג": { p: "שערי חצר הכהנים" },
          "שער דרומי א": { p: "שערי חצר הכהנים" }, "שער דרומי ב": { p: "שערי חצר הכהנים" }, "שער דרומי ג": { p: "שערי חצר הכהנים" },
          "לשכת הגזית (יומא יט.; רמב״ם בית הבחירה ה, יז; יומא כה.)": { p: "לשכת הגזית" },   // 1.0.1-L (L.21)
          // 1.0.1-L (L.68): the slaughter place (30-courts.js)
          "בית המטבחים — הטבעות (מדות ג, ה; ה, ב; תמיד ד, א)": { p: "בית המטבחים" },
          "שלחנות השיש (שקלים ו, ד; מדות ג, ה)": { p: "בית המטבחים" },
          "הננסין (מדות ג, ה; תמיד ג, ה)": { p: "בית המטבחים" },
          "מזבח הנחושת": { v: "mizbeach" },
          "הכבש": { p: "הכבש" },
          "הים של שלמה": { v: "yam" },
          "כיור משה": { p: "כיור משה" },
          "המכונות והכיורות": { p: "עשר המכונות והכיורות" },
          // the parts of the moving base (45-vessels.js, layer "mechonaParts")
          "הכיור (ז, לח)": { info: "הפסוק: 'ויעש עשרה כירות נחשת ארבעים בת יכיל הכיור האחד ארבע באמה הכיור האחד כיור אחד על המכונה האחת לעשר המכנות' (מלכים א ז, לח).\nמצודת דוד: 'הכיור האחד — גבהו של הכיור'. מלבי״ם: ארבע אמות בגובה, ורוחבו 'אמה וחצי ורביע'.\nבמודל: **הכיור עומד בכן** (כציור הספר). רלב״ג מפרש את הארבע כרוחבו — לא נבנה.",
            refs: [["מלכים א ז, לח", V(10, 7, 38)]] },
          "הכן (ז, כט; ז, לא)": { info: "הכן: 'ופיהו מבית לכתרת ומעלה באמה' (מלכים א ז, לא).\nרש״י: 'פיהו של כן, יוצא מתוך פיהו של כותרת, ועולה למעלה אמה גבה'.\nבמודל: שוליו העגולים תחובים בפי הכותרת, ועליונו מרובע, והכיור יושב בו.",
            refs: [["מלכים א ז, לא", V(10, 7, 31)], ["ז, כט", V(10, 7, 29)]] },
          "פי הכותרת (ז, לא)": { info: "הפסוק: 'ופיה עגל מעשה כן אמה וחצי האמה וגם על פיה מקלעות' (מלכים א ז, לא); 'ובראש המכונה חצי האמה קומה עגל סביב' (ז, לה).\nרש״י: באמצע הכותרת 'נקב עגל אמה וחצי אמה רחב בעגול, וסביב אותו נקב כמין הקף מחצה, חצי אמה גבה', ו'מקלעות — צורת פרחים'.",
            refs: [["מלכים א ז, לא", V(10, 7, 31)], ["ז, לה", V(10, 7, 35)]] },
          "הכתפות (ז, ל; ז, לד)": { info: "הפסוקים: 'וארבע כתפות אל ארבע פנות המכנה האחת מן המכנה כתפיה' (מלכים א ז, לד); 'כתפת להם מתחת לכיר הכתפות יצקות' (ז, ל).\nרש״י: 'בולטות למעלה מן הנסרים בזויות הכן. ותחת הכיור היושב על הכן, היו הכתפות יצוקות'.\nבמודל, כציור הספר: הן עולות מפינות המכונה עד תחתית הכן.",
            refs: [["מלכים א ז, ל", V(10, 7, 30)], ["ז, לד", V(10, 7, 34)]] },
          "הכותרת — גג המכונה (רש״י ז, לא)": { info: "רש״י (מלכים א ז, לא): 'והכותרת היא גג המכונה עשוי כמין כובע משפע מכל צדדיו, ובאמצע נקבעת נקב עגל'.\nגוף המכונה עם גגה — 'האמה גבה היתה מרבעת' (רש״י ז, כז).",
            refs: [["מלכים א ז, לא", V(10, 7, 31)], ["ז, כז", V(10, 7, 27)]] },
          "המסגרות והשלבים (ז, כח–כט)": { info: "הפסוקים: 'וזה מעשה המכונה מסגרת להם ומסגרת בין השלבים' (מלכים א ז, כח), 'ועל המסגרות אשר בין השלבים אריות בקר וכרובים' (ז, כט); 'וסרני נחשת' (ז, ל) — רש״י: 'הם הנסרים העליונים מול המסגרות'.\nבמודל: **שלוש מסגרות בין השלבים בכל צד, כביאור הגר״א**; הציורים דקים ושטוחים (בחירת מודל; על הליות רש״י ז, כט: 'ואין בולטין בעביו, ולא חקוקים בשקוע', ועל המסגרות התחתונות והנסרים רש״י ז, לו: 'פתח וחקק') — ארי ובקר למעלה, כרובים וליות מתחתם; ועל המסגרת התחתונה ועל הנסרים כרובים, אריות ותמרות (ז, לו) — כציור הספר.",
            refs: [["מלכים א ז, כח", V(10, 7, 28)], ["ז, כט", V(10, 7, 29)], ["ז, ל", V(10, 7, 30)], ["ז, לו", V(10, 7, 36)]] },
          // 1.0.1-K review (vessels-4): the lying wheel is the book's (model choice), not בעל צורת הבית's; the ידות per Rashi = the axle
          "אופן בתוך אופן (רש״י ז, לג)": { info: "הפסוקים: 'ומעשה האופנים כמעשה אופן המרכבה ידותם וגביהם וחשקיהם וחשריהם הכל מוצק' (מלכים א ז, לג) — רש״י: 'תרגם יונתן: כעובד גלגלי מרכבה, אופן בתוך האופן שתי וערב'; 'וקומת האופן האחד אמה וחצי האמה' (ז, לב).\nהידות — לרש״י הציר: 'הוא עץ התחוב באופנים, וקורין איישי״ל (ציר של גלגל)' (ז, לב); רש״י (ז, לז), בשם בעל צורת הבית: 'ומעשה האופנים כמעשה אופן המרכבה, אופן בתוך אופן, למען יוכל להוליכם אל אשר יהיה הרוח והרצון להוליכם, שמה יוליכם מבלי שיצטרך להפכם אנה ואנה'; ושם — מקלות התחובים כל אחד בשני אופנים, ממזרח למערב ומצפון לדרום, 'ואלו המקלות קראם הכתוב ידות'.\nהמלבי״ם (ז, לג), על חלקי האופן: 'א. ידותם שהוא העץ או הברזל התקוע בחלל האופן הקטן האמצעי שעליו יתגלגל הגלגל, ב. גביהם הוא האופן הקטן עצמו שהוא מתגלגל על גב היד, ג. חשקיהם הוא הגלגל הגדול החצון שהוא הסובב על הארץ, ד. חשריהם שהם הקנים שמחברים האופן הקטן הפנימי עם האופן החצון'.\nולאן הוליכום — רש״י שם: 'אל אשר יהיה הרוח והרצון להוליכם'.\nבמודל, כציור הספר (עמ' לז) ובביאורו לרש״י: **בכל אופן גלגל קטן שוכב המסובב את האופן הגדול העומד לצדדים**, סביב מקל היורד מן המכונה, והאופן הגדול הולך קדימה ואחור — כך ביאר הספר את דברי רש״י 'אופן בתוך האופן שתי וערב'.",
            refs: [["מלכים א ז, לב (ורש״י שם)", V(10, 7, 32)], ["ז, לג", V(10, 7, 33)], ["רש״י ז, לז (בשם בעל צורת הבית)", { book: 3673, index: 441 }], ["מלבי״ם ז, לג", { book: 3394, index: 396 }]] },   // fix-d (146): Rashi 7:37 (was the verse), the Malbim
          "בית ה׳": { p: "הבית (בית ה׳)" },
          "האולם": { v: "ulamInside" },
          "בית החליפות": { p: "בית החליפות (רש״י יומא לו.)" },
          "קודש הקדשים": { v: "kodeshHakodashim" },
          "היציע (התאים)": { v: "heichalSouth" },
          "פתח התאים": { p: "פתח התאים והלולים" },
          "לולים": { p: "פתח התאים והלולים" },
          "חלוני שקופים אטומים": { p: "חלוני שקופים אטומים" },
          "האוטם": { p: "המעלות אל הבית (האוטם)" },
          // the measures of the yatzia section (50-heichal.js, layer "yatziaDims"): by their place in the section
          "7": (l) => dimOf(l), "6": (l) => dimOf(l), "5": (l) => dimOf(l), "4": (l) => dimOf(l),
          // 1.3.4: the Rambam's measures in the section (layer "yatziaDimsRb")
          "3": (l) => dimOf(l), "כותל ההיכל": DIM.rbStrip, "התא": DIM.rbStrip, "כותל התא": DIM.rbStrip, "המסבה": DIM.rbStrip, "כותל המסבה": DIM.rbStrip,
          "יציע 5": DIM.rbGallery, "יציע 6": DIM.rbGallery, "יציע 7": DIM.rbGallery, "רובד 6": DIM.rbGallery, "רובד 7": DIM.rbGallery,
          "כותל התא 5": DIM.ta,
          "חתך היציע לשיטת רש״י (מלכים א ו, ו)": { p: "חתך היציע" },
          // 1.0.1-L (L.42): the section's legend (50-heichal.js)
          "התחתונה: כותל 7 · תא 5": { p: "חתך היציע" },
          "התיכונה: כותל 6 · תא 6": { p: "חתך היציע" },
          "השלישית: כותל 5 · תא 7": { p: "חתך היציע" },
          "בצהוב — המגרעות: הכותל נכנס אמה בכל קומה": { p: "חתך היציע" },
          "רש״י: נמצאת אמצעית רחבה מן התחתונה אמה": { p: "חתך היציע" },
          // 1.0.1-L (L.72): the two tables in the ulam (50-heichal.js)
          "שולחן הכסף (מנחות צט.)": { p: "שולחנות האולם — ר׳ יוסי בר׳ יהודה" },
          "שולחן השיש (שקלים ו, ד)": { p: "שולחנות האולם — ר׳ יוסי בר׳ יהודה" },
          "שולחן הזהב (מנחות צט.)": { p: "שולחנות האולם — ר׳ יוסי בר׳ יהודה" },
          "יכין": { v: "yachinBoazFull" },
          "בועז": { p: "בועז — מרחוק" },
          "מנורת משה": { p: "מנורת משה ועשר המנורות" },
          "עשר המנורות": { p: "מנורת משה ועשר המנורות" },
          "אבן שלוש המעלות (תמיד ג, ט)": { p: "מנורת משה ועשר המנורות" },   // 1.0.1-L (L.71)
          "שולחן משה": { p: "שולחן משה מקרוב — הלחם, הסניפין והקנים" },
          "עשרה השולחנות": { p: "שולחן משה ועשרה השולחנות" },
          "מזבח הזהב": { p: "מזבח הזהב" },
          // the layers of the golden altar (55-interior.js, layer "altarLayers")
          "אבן": { info: "לב מזבח הזהב — אבן.\nמצודת דוד (מלכים א ו, כ): 'ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב, והיה אם כן מעשה המזבח דומה למעשה קירות הבית'. רד״ק: 'ואפשר שהיה מאבנים'.",
            refs: [["מלכים א ו, כ", V(10, 6, 20)]] },
          "ארז": { info: "הפסוק: 'ויצף מזבח ארז' (מלכים א ו, כ); התרגום: 'נסרין דארזא'.\nרלב״ג (ו, כב): 'צפה מזבח הקטרת באבנים וצפהו עצי ארז כמו שעשה בקירות הבית'.",
            refs: [["מלכים א ו, כ", V(10, 6, 20)], ["ו, כב", V(10, 6, 22)]] },
          "זהב": { info: "הפסוק: 'וכל המזבח אשר לדביר צפה זהב' (מלכים א ו, כב) — מצודת דוד: 'בכל ששת השטחים'; ולכן נקרא 'מזבח הזהב' (ז, מח).",
            refs: [["מלכים א ו, כב", V(10, 6, 22)], ["ז, מח", V(10, 7, 48)]] },
          // the layers of the wall and the floor (55-interior.js, layer "wallLayers")
          "אבן (ו, ז)": { info: "הפסוק: 'והבית בהבנתו אבן שלמה מסע נבנה' (מלכים א ו, ז) — קירות הבית ורצפתו אבן; מבפנים היא מכוסה כולה: 'הכל ארז אין אבן נראה' (ו, יח).",
            refs: [["מלכים א ו, ז", V(10, 6, 7)], ["ו, יח", V(10, 6, 18)]] },
          "ארז מגולף (ו, טו; ו, יח)": { info: "הפסוקים: 'ויבן את קירות הבית מביתה בצלעות ארזים מקרקע הבית עד קירות הספן' (מלכים א ו, טו), 'וארז אל הבית פנימה מקלעת פקעים ופטורי צצים' (ו, יח).\nרש״י (ו, טו): 'קירות ארז אצל קיר האבן, כדי לטוח עליו זהב... ואי אפשר לטוח זהב על גבי האבנים, כי אם בעצים ובמסמרות'. הגילוף בארז, והזהב שוקע בו.",
            refs: [["מלכים א ו, טו", V(10, 6, 15)], ["ו, יח", V(10, 6, 18)]] },
          "זהב (ו, כא–כב)": { info: "הפסוקים: 'ויצף שלמה את הבית מפנימה זהב סגור' (מלכים א ו, כא), 'ואת כל הבית צפה זהב עד תם כל הבית' (ו, כב).\nרש״י (ו, לב): 'להיות שוקע בו במקום החקק, ובולט על הבליטה' — הזהב מרודד על הגילוף.",
            refs: [["מלכים א ו, כא", V(10, 6, 21)], ["ו, כב", V(10, 6, 22)], ["ו, לב", V(10, 6, 32)]] },
          "ברושים (ו, טו)": { info: "הפסוק: 'ויצף את קרקע הבית בצלעות ברושים' (מלכים א ו, טו) — לוחות ברוש על רצפת האבן, ועליהם הזהב (ו, ל).",
            refs: [["מלכים א ו, טו", V(10, 6, 15)], ["ו, ל", V(10, 6, 30)]] },
          "זהב (ו, ל)": { info: "הפסוק: 'ואת קרקע הבית צפה זהב לפנימה ולחיצון' (מלכים א ו, ל).\nרש״י: 'לבית הכפרת ולהיכל'. מצודת דוד: 'על רצפת צלעות הברושים'.",
            refs: [["מלכים א ו, ל", V(10, 6, 30)]] },
          "ההיכל": { v: "kodesh" },
          "פתח ההיכל (מזוזות רבועות)": { p: "פתח ההיכל ודלתותיו" },
          "רתוקות הזהב": { p: "רתוקות הזהב" },
          "אמה טרקסין": { p: "אמה טרקסין" },
          "פתוחי מקלעות כרובים ותמרות ופטורי ציצים (ו, כט)": { p: "גילופי הקירות — כרובים, תמורות, פטורי ציצים, פקעים" },
          "פתח הדביר (מזוזות חמישית)": { v: "devirDoor" },
          "הפרוכת": { p: "הפרוכת" },
          "הכרובים": { p: "הכרובים" },
          "הארון ובדיו": { p: "הארון ובדיו" },
          "אבן השתייה": { p: "אבן השתייה" },
          "אולם המשפט": { p: "אולם הכסא ואולם המשפט" },
          "אולם הכסא": { p: "אולם הכסא ואולם המשפט" },
          "כסא שלמה": { p: "כסא שלמה" },
          "אולם העמודים": { p: "אולם העמודים" },
          "החצר האחרת — חצר בית המלך (מלכים א ז, ח)": { p: "החצר האחרת — חצר בית המלך" },   // 1.0.1-L (L.33)
          "שער החצר האחרת": { p: "החצר האחרת — חצר בית המלך" },
          "בית המלך": { p: "בית המלך" },
          "בית המלך — חדר האוכל (מלכים א י, ה)": { p: "בית המלך" },
          "בית המלך — חדר המשכב (שיר השירים ג, ז)": { info: "הפסוק: 'הנה מטתו שלשלמה ששים גברים סביב לה מגברי ישראל' (שיר השירים ג, ז); בית המלך — 'דירה גמורה, לאכל שם ולשכב שם' (רש״י מלכים א ז, ח).\nבמודל: חדר המשכב, מקומו וריהוטו — בחירת מודל.",
            refs: [["שיר השירים ג, ז", V(31, 3, 7)], ["מלכים א ז, ח", V(10, 7, 8)]] },
          "הגן (קהלת ב, ה)": { p: "הגן" },   // 1.0.1-L (L.22)
          "בית בת פרעה": { p: "בית בת פרעה" },
          "בית שלמה": { v: "palace" },
          "בית יער הלבנון — המגינים והצינות (מלכים א י, טז–יז)": { p: "פנים בית יער הלבנון — המגינים, הצינות והכלים" },
          "בית יער הלבנון — טורי העמודים והכרותות (רש״י ז, ב)": { p: "בית יער הלבנון" }
        };
        // labels whose text starts with these words (the long labels of the layers and of the forest house)
        const LABEL_PREFIX = [
          ["העליות", { v: "aliyot" }],
          // release (the merge, 22.11.2026): the two labels of Rashi's reading of Jehoiada's chest - the cards of its two places, which give it
          ["ארון יהוידע — ״ויתנהו", { p: "ארון יהוידע שבשער — לתקלין עתיקין" }],
          ["ארון יהוידע — ״אצל המזבח", { p: "ארון יהוידע אצל המזבח — לתקלין חדתין" }],
          // 1.3.4: the hooks' words (the button "האונקליות") and the courts' zones (1.3.3) - their places' cards
          ["״ואנקליות של ברזל", { p: "בית המטבחים — מקרוב" }],
          ["החצר הפנימית — חצר הכהנים (", { p: "החצר הפנימית — חצר הכהנים" }],
          ["החצר הגדולה — העזרה הגדולה", { p: "הר הבית והחצר הגדולה" }],
          ["החצר החיצונה", { p: "החצר החיצונה (החצר החדשה)" }],
          ["התאים לשיטת הרמב״ם", { p: "היציע והתאים" }],
          ["היציעים — חמש, שש ושבע", { p: "היציע והתאים" }],
          ["רבובה", { p: "הכבש" }],
          ["תקרת הגבים", { p: "גג הבית ותקרותיו" }],
          ["קו ציר הבית", { p: "קו ציר הבית — כנגד פתח ההיכל, ומקום המזבח" }],
          ["האולם לשיטת הרמב", { info: "לשיטת הרמב״ם (הלכות בית הבחירה ד), כפי שביארו הכסף משנה ותוספות יום טוב (מדות ד, ז): **בליטת האולם נמשכת בצפון ובדרום לכל אורך הבית**, 'עד מקצוע המערבית', ולא רק בחזית; בצד מערב אין בליטה (הלכות בית הבחירה ד, ד).\nבמודל: ברירת המחדל כרש״י (יומא לו.) — הבליטה בחזית בלבד, 'בית החליפות'. בוחרים בתפריט, תחת ״שיטות ומחלוקות״.",
            refs: [["רמב״ם בית הבחירה פרק ד", RB(4, 0)], ["מדות ד, ז", MI(4, 7)], ["יומא לו.", P(107, "לו.")]] }],
          ["המעלות מבית המלך", { p: "המעלות מבית המלך אל בית ה׳" }],
          ["העלייה מבית המלך", { p: "המעלות מבית המלך אל בית ה׳" }],   // ASCENT2_D: the almug ramp's label (check.sh: "labels without sources")
          ["בית יער הלבנון", { p: "בית יער הלבנון" }],
          ["העמודים והעב", { p: "העמודים והעב — 'ועמדים ועב על פניהם'" }],
          ["״ואולם על פניהם״", { p: "העמודים והעב — 'ועמדים ועב על פניהם'" }],
          ["45 נסרי הסיפון", { p: "קירוי בית יער הלבנון — הכרותות, 45 הנסרים והנסרים הדקים" }],
          ["קירוי הנסרים הדקים", { p: "קירוי בית יער הלבנון — הכרותות, 45 הנסרים והנסרים הדקים" }],
          // 1.0.1-L (L.20, L.48): the forest house's new labels (60-palace.js)
          ["״ועמדים״", { p: "העמודים והעב — 'ועמדים ועב על פניהם'" }],
          ["״ועב״", { p: "העמודים והעב — 'ועמדים ועב על פניהם'" }],
          ["שלושה פתחים בכל כותל", { p: "בית יער הלבנון" }],
          ["שלוש שורות חלונות", { p: "בית יער הלבנון" }],
          ["המרישין הקטנים", { p: "קירוי בית יער הלבנון — הכרותות, 45 הנסרים והנסרים הדקים" }],
          ["הכרותות על העמודים", { p: "קירוי בית יער הלבנון — הכרותות, 45 הנסרים והנסרים הדקים" }],
          ["45 לוחות הארז", { p: "קירוי בית יער הלבנון — הכרותות, 45 הנסרים והנסרים הדקים" }],
          // 1.0.1-L (L.40, L.64): the demonstration's two labels (45-vessels.js)
          ["הדחת קרבי העולה", { p: "עשר המכונות והכיורות" }],
          ["קידוש ידים ורגלים", { p: "עשר המכונות והכיורות" }],
          // 1.0.1-L (L.81): the throne's shared labels (60-palace.js); the labels of one version carry that version's text (labelTarget)
          ["גלגלי המנגנון", { p: "עליית המלך לכסא" }],
          ["הארון וספר התורה", { p: "עליית המלך לכסא" }],
          ["התנין של כסף", { p: "עליית המלך לכסא" }],
          ["שבעים כסאות הזקנים", { p: "כסא שלמה" }],
          ["ספלי הניסוך — מים (מערבי) ויין (מזרחי)", { p: "ספלי הניסוך — השלמה מן המשנה" }],
          ["מפתח של זהב — ״והפתות״ (רש״י: מפתחות)", { p: "פתח ההיכל ודלתותיו" }],
          ["ציר של זהב — ״והפתות״", { p: "פתח ההיכל ודלתותיו" }],   // 1.3.6   // 1.3.3
          // PARALLELS_C (fix-c): the labels of 59-parallels.js - their places' cards
          ["בית הכנסת שבהר הבית", { p: "בית הכנסת שבהר הבית" }], ["בית המדרש שבהר הבית", { p: "בית המדרש שבהר הבית" }],
          ["שלחן של שיש — שלחן החלבים", { p: "שולחן החלבים — שני השולחנות שבמערב הכבש" }], ["שלחן של כסף — לכלי שרת", { p: "שולחן החלבים — שני השולחנות שבמערב הכבש" }],
          ["1 · בכל יום — של כסף", { p: "שלוש המחתות — בכל יום וביום הכיפורים" }], ["2 · בכל יום — של זהב", { p: "שלוש המחתות — בכל יום וביום הכיפורים" }],
          ["3 · ביום הכיפורים — זהב אדום", { p: "שלוש המחתות — בכל יום וביום הכיפורים" }],
          ["חלקו של יהודה", { p: "חלקי יהודה ובנימין — הרצועה שבדרום המזבח" }], ["חלקו של בנימין", { p: "חלקי יהודה ובנימין — הרצועה שבדרום המזבח" }],
          ["הרצועה — מחלקו של יהודה", { p: "חלקי יהודה ובנימין — הרצועה שבדרום המזבח" }], ["״מזבח אוכל בחלקו של יהודה אמה״", { p: "חלקי יהודה ובנימין — הרצועה שבדרום המזבח" }],
          ["הר הבית — צדו המזרחי בחלקו של יהודה", { p: "חלקי יהודה ובנימין — הרצועה שבדרום המזבח" }],
          ["בית החליפות — ״ששם גונזים את הסכינים״", { p: "בית החליפות — חלונות הסכינים" }],
          ["מעיין השילוח", { p: "מעיין השילוח" }]   // only with the spring (59-parallels.js, SPRING_C)
          , ["שלשה עשר שופרות", { p: "שלושה עשר השופרות — מתג" }]
          , ["״ובאין וזוקפין אותן", { p: "מצות ערבה — הדגמה" }], ["הערבות על היסוד בלבד", { p: "מצות ערבה — הדגמה" }], ["״בכל יום מקיפין את המזבח", { p: "מצות ערבה — הדגמה" }]
          , ["המלוא — ", { p: "המלוא — סמוך לבית בת פרעה" }], ["אהלי עולי הרגלים", { p: "המלוא — סמוך לבית בת פרעה" }], ["בתים לעבדיה", { p: "המלוא — סמוך לבית בת פרעה" }], ["מגדל לבת פרעה", { p: "המלוא — סמוך לבית בת פרעה" }], ["עיר דוד", { p: "עיר דוד" }], ["מצודת ציון", { p: "עיר דוד" }], ["מגדל דוד", { p: "עיר דוד" }], ["״המעלות היורדות מעיר", { p: "עיר דוד" }], ["בית דוד", { p: "עיר דוד" }], ["אהל הארון — עד", { p: "עיר דוד" }], ["הפרצה — ״פרץ", { p: "המלוא — סמוך לבית בת פרעה" }], ["״ולחוצה החומה", { p: "עיר דוד" }], ["גן המלך", { p: "עיר דוד" }], ["קברי בית דוד", { p: "עיר דוד" }], ["ברכת השלח —", { p: "מעיין השילוח" }], ["המשנה — לשיטת", { p: "עיר דוד" }]
        ];
        // the target of a label: {key} for setInfo(key) or {text, refs}; null when the label has no explanation
        const labelTarget = (l) => {
          if (!l || !l.text) return null;
          if (l.info) return { text: l.info, refs: l.refs || [], title: l.title || "" };   // 1.3.3: l.title - what a bare number measures
          // 1.0.2 (item 7): the label "השיתין" of 40-altar.js opens ctx.shared.shitin's text (nothing when the contract is missing)
//@@end buildUI.DIM
//@@begin labelTarget
          if (!m && l.layer === "gatekeepers") m = { p: "משמרות השוערים (דברי הימים א כו)" };   // 1.3.7 (LABELS_ROUND_137): every label of the layer
          // 1.0.1-L (L.81): a label of ONE version of the throne (its layers) opens that version's text and sources
//@@end labelTarget
//@@begin buildUI.sp
        const sp = ctx.shared.seaPlacement, kl = ctx.shared.kodeshLayout, ko = ctx.shared.kodeshOpinion;
        const dd = ctx.shared.devirDoor, cpz = ctx.shared.cherubPose, fh = ctx.shared.forestHouse;
        // 1.0.1-K: the rows fly only - they never open the house or anything else
        const flyView = (key) => {
          const fp = resolveFp(key);
          if (fp) fly(fp.pos, fp.target);
        };
        // 1. the height of the house: 30 (I Kings 6:2) or 120 with the upper storeys (II Chr 3:4 with Rashi) - the layer "aliyot"
        const aliyotRow = opRow({
          id: "aliyot", short: "גובה הבית", cardFly: true, chips: { base: "שלושים אמה", aliyot: "מאה ועשרים, עם העליות" },   // 1.0.2 (item 4)
          cap: "גובה הבית",
          refs: [["מלכים א ו, ב", V(10, 6, 2)], ["דברי הימים ב ג, ד", V(39, 3, 4)], ["רש״י שם", V(39, 3, 4)], ["בבא בתרא ג.", P(124, "ג.")]],
          options: [
            ["base", "שלושים אמה", "הפסוק: 'ושלשים אמה קומתו' (מלכים א ו, ב) — גובה הבית שלושים אמה; בבא בתרא ג. משווה את גובה הבית לבית שני ואינה מזכירה מאה ועשרים.\nבמודל: זה המודל הבסיסי — **הבית והאולם בגובה שלושים**."],
            ["aliyot", "מאה ועשרים — עם העליות", "הפסוק: 'והגבה מאה ועשרים' (דברי הימים ב ג, ד).\nרש״י: שלושים אמה עד תקרת העלייה הראשונה 'ומעליה לעליה עד גג העליון תשעים אמות'. רד״ק (כדעה שנייה): 'ג' עליות גבהן תשעים אמה'.\nבמודל: **שתי עליות, זו על גב זו, על הבית ועל האולם עד 120 אמה** (כאיור הספר); כל עלייה סגורה בשלוש השכבות — גבים, בית דילפא ושדרות בארזים. מעל קודש הקדשים הכול נמוך בעשר אמות — 'עליית בית קודש הקדשים היתה נמוכה משל היכל י' אמות' (מצודת דוד ו, כ ע״פ רש״י; בשתי השיטות האחרות שבמתג 'גובה קודש הקדשים' העליות שוות): העלייה הראשונה שמעליו עומדת על תקרת הדביר עצמה (גבים, בית דילפא ושדרות, 32–36), רצפתה ותקרתה נמוכות בעשר, והגג מדורג. חלוקת הגובה — בחירת מודל."]
          ],
          current: ctx.layers.aliyot && ctx.layers.aliyot.visible ? "aliyot" : "base",
          onPick: (k) => setLayer("aliyot", k === "aliyot"),
          fly: (k) => flyView(k === "aliyot" ? "aliyot" : "heichalFront"),
          disabled: !ctx.layers.aliyot
        });
        layerMarks.aliyot = (on) => aliyotRow.mark(on ? "aliyot" : "base");
        // 2. the ulam: Rashi's בית החליפות wings or the Rambam's reading - the layer "ulamRambam"
        const ulamRow = opRow({
          id: "ulamRambam", short: "האולם", cardFly: true, chips: { rashi: "רש״י", rambam: "רמב״ם" },
          cap: "האולם ובית החליפות",
          refs: [["מלכים א ו, ג", V(10, 6, 3)], ["יומא לו.", P(107, "לו.")], ["רמב״ם בית הבחירה פרק ד", RB(4, 0)], ["מדות ד, ז", MI(4, 7)]],
          options: [
            ["rashi", "רש״י — בית החליפות", "רש״י (יומא לו.): האולם היה רחב מן ההיכל חמש עשרה אמה מכל צד, ובשני הצדדים 'בית החליפות' — שם גנזו את הסכינים; וכך רש״י בסנהדרין ק. גם לבית ראשון.\nבמודל: **ברירת המחדל — הבליטה בחזית בלבד**."],
            ["rambam", "הרמב״ם — בליטת האולם", "לשיטת הרמב״ם (הלכות בית הבחירה ד, ה), כפי שהבינו בו הכסף משנה ותוספות יום טוב (מדות ד, ז): **בליטת האולם נמשכת בצפון ובדרום לכל אורך הבית**, 'עד מקצוע המערבית', ולא רק בחזית. בצד מערב אין בליטה: החשבון ממערב למזרח הוא מאה אמה בלעדיה (שם ד, ד).\nבקצרה — עוד שיטות: לחם שמים (שם) מפרש שגם לרמב״ם העודף הוא רק כנגד האולם, והראב״ד חולק על הכותל. הצרות לצד מערב 'מטין הבנין מעט' (פירוש המשנה, מדות ד, ז) אינה במודל, כי לא נמסרה לה מידה.\nבמודל: השכבה מוסיפה את הבליטה על המודל."]
          ],
          current: ctx.layers.ulamRambam && ctx.layers.ulamRambam.visible ? "rambam" : "rashi",
          onPick: (k) => {
            // 1.3.4: the Rambam's ulam projection and his yatzia fill the same strip beside the house - one at a time (model choice)
            const yrd = ctx.shared.yatziaReading;
            if (k === "rambam" && yrd && yrd.mode === "rambam") yrd.set("rashi");
            setLayer("ulamRambam", k === "rambam");
          },
          fly: (k) => { if (k === "rambam") fly([60, 60, 130], [-35, 25, 30]); else flyView("heichalFront"); },
          disabled: !ctx.layers.ulamRambam
        });
        layerMarks.ulamRambam = (on) => ulamRow.mark(on ? "rambam" : "rashi");
        // 1.3.5 (the user, 22:12: "להוסיף מתג לאולם"): the ulam's ceiling - a vault (Rashi, the default) or none (the Tosafot RID);
        // ctx.shared.ulamCeiling (50-heichal.js; its set() calls applyHidden)
        if (ctx.shared.ulamCeiling) opRow({
          id: "ulamCeiling", short: "תקרת האולם", cardFly: true, chips: { vault: "רש״י: כיפה", none: "תוספות רי״ד: בלי תקרה" },
          cap: "תקרת האולם",
          refs: [["מלכים א ו, ג", V(10, 6, 3)], ["רש״י מלכים א ז, ה", { book: 3673, index: 329 }], ["רש״י יומא נב.", { book: 2157, index: 1959 }], ["תוספות רי״ד יומא נב.", { book: 2109, index: 159 }]],
          options: [
            ["vault", "כיפה — רש״י", "רש״י (יומא נב., ד״ה כותל אולם), על אולם בית שני: 'כותל החיצון, למטה רוחב היסוד והאסקופה, ולמעלה מגובה כיפת הפתח — עובי החומה שעולה עד ק׳ אמה, לבד רוחב כיפת החלל שהיא י״א אמה'. ובתוספות רי״ד שם: 'ומשמע מדבריו שאותן י״א אמה שהיו בין האולם ובין ההיכל כיפה היתה עליהם'. ועל פתח האולם — רש״י (מלכים א ז, ה): 'רבועין היו כשאר פתחי בתים, ולא עשויין כפה כעין פתחי אולם'.\nבמודל (**ברירת המחדל**): כיפה על עשר האמות של חלל האולם, וראש פתח האולם קשת. העתקת דברי רש״י מבית שני, גובה הכיפות וצורתן — בחירת מודל."],
            ["none", "בלי תקרה — תוספות רי״ד", "תוספות רי״ד (יומא נב.), על דברי רש״י, באולם בית שני: 'ואינו נראה לי, אלא האולם לא הי׳ אלא כותל אחד שאורכו מאה אמה ועוביו ה׳ אמות, ופתח הי׳ באמצעו ארבעים אמה גובהו ועשרים אמה רחבו, ובינו ובין ההיכל הי׳ אויר מגולה, ולא הי׳ שם תקרה ולא כיפה'.\nבמודל: אין תקרה ואין גג מעל האולם ובית החליפות — כותל האולם עומד, והאוויר שבינו לבין ההיכל מגולה. העתקת דבריו לבית ראשון — בחירת מודל."]
          ],
          current: ctx.shared.ulamCeiling.mode,
          onPick: (k) => { ctx.shared.ulamCeiling.set(k); },
          fly: (k) => { if (k === "none") fly([48, 95, 36], [7.5, 44, 0]); else fly([10.6, 13.6, 9.2], [8, 37, -6]); }
        });
        // 2b. 1.3.4 (the user: "המלצה 1"): the yatzia - Rashi's chambers (the book's, the default) or the Rambam's long cells and galleries
        // (ctx.shared.yatziaReading, 50-heichal.js sec. 4b); its onChange keeps the row in step when the section or the ulam's row changes it
        const yrd = ctx.shared.yatziaReading;
        const yatziaRow = opRow({
          id: "yatziaShape", short: "צורת היציע", cardFly: true, chips: { rashi: "רש״י: תאים, והכותל נגרע", rambam: "הרמב״ם: תאים ארוכים ויציעים בחוץ" },
          cap: "צורת היציע והתאים",
          refs: [["מלכים א ו, ו", V(10, 6, 6)], ["רש״י שם", V(10, 6, 6)], ["מדות ד, ג", MI(4, 3)], ["מדות ד, ד", MI(4, 4)], ["מדות ד, ז", MI(4, 7)]],
          options: [
            ["rashi", "רש״י — תאים, וכותל הבית נגרע במגרעות (כספר)", "הפסוק (מלכים א ו, ו): ״היציע התחתנה חמש באמה רחבה, והתיכנה שש באמה רחבה, והשלישית שבע באמה רחבה, כי מגרעות נתן לבית סביב חוצה, לבלתי אחז בקירות הבית״.\nרש״י: ״קומת התא חמש אמות, וכשעולה כתל ההיכל חמש אמות, גורע את עביו, וכנס בו אמה לפנים, והניח על אותה כניסה ראשי קורות גג עלית התא״; ״נמצאת אמצעית רחבה מן התחתונה אמה, והעליונה רחבה מן התיכונה אמה״.\nבמודל — **כספר, ברירת המחדל**: שלושים ושמונה תאים בשלוש קומות; כותל הבית נגרע אמה בכל קומה — שבע, שש וחמש — וראשי קורות הארז מונחים על המגרעות. ״חתך היציע״ מראה את החשבון."],
            ["rambam", "הרמב״ם — רצועות של תאים ארוכים, והיציעים מחוץ להן", "המשנה (מדות ד, ד): ״התחתונה, חמש, ורבד שש. והאמצעית, שש, ורבד שבע. והעליונה, שבע״.\nפירוש המשניות לרמב״ם (ד, ד): ״היציע. הם הגזוזטראות המקיפות להיכל מבחוץ, והיתה גזוזטרא אמצעית יותר רחבה מן התחתונה, והעליונה יותר רחבה מן האמצעית, כדי שלא יהא אפשר להדבק בכותל, והוא מה שנאמר כי מגרעות נתן לבית״; ועל התאים (ד, ג): ״לא היה כותל סתום אלא שני כותלים וביניהם הרחקה״.\nבמודל — **כמו בספר ״מקרא מפורש״ ובבית שני**: בצפון ובדרום חמש רצועות — כותל ההיכל, התא, כותל התא, המסבה וכותל המסבה — וכל רצועה תא ארוך בכל קומה; במערב שלוש, ובקומה העליונה שתיים; והיציעים מחוץ לכותל המסבה, חמש, שש ושבע. המידות — מדות ד, ז (״כתל המסבה חמש, והמסבה שלש, כתל התא חמש, והתא שש, כתל ההיכל שש״): מידות הבית השני, והחלתן על הבית הראשון — בחירת מודל; וכן עובי הכתלים הדקים (אמה) ומקום הפתחים.\nבליטת האולם לשיטת הרמב״ם (״האולם ובית החליפות״) תופסת את אותה רצועה שליד הבית, ולכן במודל מוצגת כל אחת לבדה."]
          ],
          current: yrd && yrd.mode || "rashi",
          onPick: (k) => {
            if (!yrd) return;
            if (k === "rambam" && ctx.layers.ulamRambam && ctx.layers.ulamRambam.visible) setLayer("ulamRambam", false);
            yrd.set(k);
          },
          fly: (k) => { if (k === "rambam") fly([30, 70, 120], [-42, 16, 24]); else flyView("heichalSouth"); },
          disabled: !(yrd && typeof yrd.set === "function")
        });
        if (yrd) yrd.onChange = (m) => yatziaRow.mark(m);
        // 1.0.1-L (L.60, the user: "עיין בפירוש המלבים למעשה שושן (פס' יט) והוסף זאת כאופצי'"): the capitals of Yachin and Boaz - ctx.shared.pillarCapital (50-heichal.js)
        const pcap = ctx.shared.pillarCapital;
        opRow({
          id: "pillarCapital", short: "הכותרות", cardFly: true, chips: { rashi: "רש״י", malbim: "מלבי״ם" },
          cap: "כותרות יכין ובועז",
          refs: [["מלכים א ז, טו", V(10, 7, 15)], ["ז, יט", V(10, 7, 19)], ["ז, כב", V(10, 7, 22)], ["מלבי״ם ז, יז", V(10, 7, 17)], ["מלבי״ם ז, יט", V(10, 7, 19)], ["מלבי״ם ז, כ", V(10, 7, 20)]],
          options: [
            ["rashi", "רש״י", (placeItemByT["כותרת העמוד — שבכה, רימונים ושושנים"] || {}).info || "רש״י (ז, יח): 'כמין שני אגנים' — כציור הספר. ברירת המחדל."],
            ["malbim", "מלבי״ם", "מלבי״ם: הכותרת יושבת על ראש העמוד ו'נחלק לשתי גולות' (ז, טז) — התחתונה שתי אמות, העליונה שלוש 'ככובע על ראש העמוד' (ז, כ); 'חציו העליון היה מכוסה בשבכה שהוא לבוש ממעשה רשת, ארוג מנחושת, ותחת השבכה היה גדילים מעשה שרשרות, והיו שבעה שרשרות לכל כותרת... ובסוף השרשרות היו תלוים שני טורי רמונים שהיה ראשם תלוי בשרשרות וסופם מכסה את הגולה התחתונה' (ז, יז), 'מאה רמונים בכל טור' (ז, כ).\nראש העמוד עצמו 'נעשה בראשו כמעשה שושן' (ז, כב; ז, טו: 'הקיש בקורנס ועשה על שפת כל א' מעשה שושן ונתארך חצי אמה'); ופסוק יט — כותרת מצוירת: 'שהיה שושן מצויר על כותל האולם במקום שהגיעו לשם ראשי העמודים היינו י״ח אמות בגובה הכותל של האולם והיה ארכו ורחבו וגבהו של הכותרת המצויר בכותל ד' אמות'.\nבמודל, בשיטה זו: **העמודים עומדים לפני האולם** — 'שהקים אותם לפני האולם וסמוך לו' (ז, כא) — והשושן מצויר על חזית האולם לצד הפתח, בגובה ראשי העמודים. צורת הרשת, הרמונים והציור, ובסיסי האבן שהעמודים עומדים עליהם מעל המעלות כדי שראשיהם יגיעו לשמונה עשרה אמה בכותל האולם — בחירת מודל."]
          ],
          current: pcap && pcap.current || "rashi",
          onPick: (k) => { if (pcap && typeof pcap.set === "function") pcap.set(k); },
          fly: () => flyView("yachinBoazCapital"),   // resolved after set(): 50-heichal.js re-aims this fly point per reading
          disabled: !(pcap && typeof pcap.set === "function")
        });
        // 1.0.1-L (L.72, the user: "הוסף בכפתור נפרד כחלק משיטות נוספות"): the two tables in the ulam - ctx.shared.ulamTables (50-heichal.js); a choice here
        // is the user's own: it cancels the place's 15-second timer (L.27)
        const utab = ctx.shared.ulamTables;
        ulamTablesRow = opRow({
          id: "ulamTables", short: "שולחנות האולם", cardFly: true, chips: { ryby: "ר׳ יוסי בר׳ יהודה", mishnah: "המשנה" },
          cap: "שולחנות האולם",
          refs: [["מנחות צט.", P(131, "צט.")], ["משנה שקלים ו, ד", MN(54, 6, 4)], ["משנה מנחות יא, ז", MN(81, 11, 7)], ["רמב״ם בית הבחירה ג, טז", RB(3, 16)]],
          options: [
            // 1.1.0 (the user): the reading "בלי שולחנות" is gone - it was wrong
            ["ryby", "רבי יוסי ברבי יהודה — כסף וזהב", "בגמרא: 'רבי יוסי ברבי יהודה אומר: לא היו מסדרין אלא על של משה, אלא מה אני מקיים ״ואת השלחנות אשר עליהם לחם הפנים זהב״? אלו שלשה שלחנות שהיו במקדש: שנים שהיו באולם מבפנים לפתח הבית, אחד של כסף ואחד של זהב' (מנחות צט.).\nרש״י: 'אצל פתח ההיכל אחד של כסף ואחד של זהב והאי דקרי הכא כסף ובמתניתין שייש משום דשייש לבן ככסף'; 'בכניסתו מניחו על של כסף וכשמגיע להיכל מסדר על של משה שמצופה זהב הרי עלייה ולא מורידין לכך ביציאתו מניחו על של זהב'.\nבמודל: שני שולחנות במידת שולחן לחם הפנים (שמות כה, כג), בתוך האולם סמוך לפתח ההיכל משני צדי המעבר — **הכסף בצפון והזהב בדרום** (בחירת מודל על פי 'המכניסים עומדים בצפון... המוציאין עומדים בדרום', מנחות יא, ז); על שולחן הכסף — שתים עשרה החלות בכניסתן."],
            ["mishnah", "המשנה — שיש וזהב", "המשנה: 'ושנים באולם מבפנים על פתח הבית, אחד של שיש ואחד של זהב, על של שיש נותנין לחם הפנים בכניסתו, ועל של זהב ביציאתו, שמעלין בקדש ולא מורידין' (שקלים ו, ד).\nרמב״ם: 'ושני שלחנות היו באולם מבפנים על פתח הבית. אחד של שיש נותנין עליו לחם הפנים בכניסתו. ואחד של זהב נותנין עליו לחם ביציאתו' (בית הבחירה ג, טז). ברטנורא: 'על פתח הבית. אצל פתח ההיכל בכניסתו'.\nבמודל: **על שולחן השיש — שתים עשרה החלות בכניסתן**."]
          ],
          current: utab && utab.current || "ryby",
          onPick: (k) => { autoOff.cancel("ulamTables"); if (utab && typeof utab.set === "function") utab.set(k); },
          fly: () => flyView("ulamTables"),
          disabled: !(utab && typeof utab.set === "function")
        });
        // SHOWBREAD_SHAPE_211 (1.4.4; the user, 15.11.2026 08:38: "א: כן ברירת מחדל כר״י"): the loaves' shape on every table - ctx.shared.breadShape
        // (55-interior.js int_boatLoaf / int_breadShape): R. Yochanan's boat (the default; the posts on the table) or R. Chanina's open box (the posts on the floor)
        {
          const bsh = ctx.shared.breadShape;
          const BR = [["מנחות צד:", { book: 131, index: 3364 }], ["מנחות צד: (הסניפין)", { book: 131, index: 3369 }], ["מנחות צה.", { book: 131, index: 3372 }],
            ["מנחות צה. (תניא כמאן)", { book: 131, index: 3373 }], ["רש״י מנחות צד: (תיבה)", { book: 2186, index: 4469 }], ["רש״י מנחות צד: (ספינה)", { book: 2186, index: 4470 }],
            ["רש״י מנחות צה.", { book: 2186, index: 4490 }], ["כסף משנה תמידין ה, ט", { book: 4261, index: 187 }], ["לחם משנה תמידין ה, ט", { book: 4030, index: 95 }]];
          opRow({
            id: "breadShape", short: "צורת לחם הפנים", cardFly: true, chips: { boat: "רבי יוחנן", box: "רבי חנינא" },
            cap: "צורת לחם הפנים",
            refs: BR,
            options: [
              ["boat", "רבי יוחנן — כמין ספינה רוקדת", "הגמרא (מנחות צד:): 'רבי חנינא אמר: כמין תיבה פרוצה. רבי יוחנן אמר: כמין ספינה רוקדת'.\nרש״י: 'אין לה שוליים אלא מלמעלה רחבה ומלמטה כלה והולכת עד כאצבע... וב׳ ראשיה חדין והולכין וגבוהין למעלה'. ופיה — 'אימא: ופיה דומה כמין טבלא מרובעת' (מנחות צה.); רש״י: 'השוליים עשויין כספינה'.\nהסניפין: 'לדברי האומר כמין ספינה רוקדת — סניפין על גבי שלחן מונחין' (מנחות צד:). 'תניא כמאן דאמר כמין ספינה רוקדת, דתניא: ארבעה סניפין של זהב היו שם... שסומכין בהן את הלחם, שהוא דומה כמין ספינה רוקדת' (מנחות צה.).\nבמודל (ברירת המחדל): כל חלה — פיה מרובע, דפנותיה משתפעות עד שוליים צרים כאצבע, ושני ראשיה משופעים ועולים; הסניפין עומדים על השולחן, והקנים תחת השוליים. מידות השיפוע והעלייה — בחירת מודל."],
              ["box", "רבי חנינא — כמין תיבה פרוצה", "הגמרא (מנחות צד:): 'רבי חנינא אמר: כמין תיבה פרוצה'. רש״י: 'שניטל כיסויה ושתי דופנותיה זו כנגד זו כך הלחם היו לו ב׳ דפנות ושוליים רחבים'.\nהסניפין: 'לדברי האומר כמין תיבה פרוצה — סניפין על גבי קרקע מונחין' (מנחות צד:).\nהרמב״ם כתב 'כל חלה מהן מרובעת' — כסף משנה: 'משמע שפסק כר׳ חנינא וצריך טעם למה דהא בגמרא קאמר דתניא כוותיה דר״י', ויישב: 'ואפשר שטעמו משום דר' חנינא עדיף מר״י וקשיש מיניה'; לחם משנה: 'נראה דפסק כמ״ד כמין תיבה פרוצה... וצ״ע'.\nבמודל: כל חלה — שוליים רחבים ושתי דפנות זקופות, וקרנותיה כפופות פנימה; הסניפין עומדים על הרצפה."]
            ],
            current: bsh && bsh.mode || "boat",
            onPick: (k) => { if (bsh && typeof bsh.set === "function") bsh.set(k); },
            fly: () => flyView("shulchanMoshe"),
            disabled: !(bsh && typeof bsh.set === "function")
          });
        }
        // 1.0.2 (item 8, the user: "מצוין"): the look of the bronze altar - ctx.shared.altarLook (40-altar.js): stone (the default; Deut 27:6, the
        // Rambam Beit HaBechira 1:13) or Abarbanel on I Kings 8:64, "מצופה נחשת". The words and the sources are the module's; no contract, no row.
        {
          const al = ctx.shared.altarLook;
          const alOpts = al && Array.isArray(al.options) ? al.options.filter((o) => o && o.key) : [];
          if (al && typeof al.set === "function" && alOpts.length > 1) {
            const alInfo = al.info || {}, alRefs = al.refs || {};
            const rs = [], seen = new Set();
            for (const o of alOpts) for (const r of Array.isArray(alRefs[o.key]) ? alRefs[o.key] : []) if (r && !seen.has(r[0])) { seen.add(r[0]); rs.push(r); }
            let cur = null;
            try { cur = typeof al.get === "function" ? al.get() : al.current; } catch (_) { cur = null; }
            opRow({
              id: "altarLook", short: "מראה המזבח",
              cap: "מראה המזבח",
              refs: rs,
              options: alOpts.map((o) => [o.key, String(o.label || o.key), String(alInfo[o.key] || ""), Array.isArray(alRefs[o.key]) ? alRefs[o.key] : null]),
              current: alOpts.some((o) => o.key === cur) ? cur : alOpts.some((o) => o.key === "stone") ? "stone" : alOpts[0].key,
              onPick: (k) => { al.set(k); },
              fly: () => flyView("mizbeach")
            });
          }
        }
        // 1.0.2 (the altar's yesod, sovev and small ramps, 40-altar.js): ctx.shared.altarRamps = { title, get(), set(key), options [{key, label}],
        // info {rashi, tosafot}, refs {rashi, tosafot} } - the two small ramps by Rashi (the default) or by Tosafot (Zevachim 61b-62b); the row
        // stands next to "מראה המזבח", in the same way: the words and the sources are the module's; no contract (or one reading), no row
        {
          const ar = ctx.shared.altarRamps;
          const arOpts = ar && Array.isArray(ar.options) ? ar.options.filter((o) => o && o.key) : [];
          if (ar && typeof ar.set === "function" && arOpts.length > 1) {
            const arInfo = ar.info || {}, arRefs = ar.refs || {};
            const rs = [], seen = new Set();
            for (const o of arOpts) for (const r of Array.isArray(arRefs[o.key]) ? arRefs[o.key] : []) if (Array.isArray(r) && !seen.has(r[0])) { seen.add(r[0]); rs.push(r); }
            let cur = null;
            try { cur = typeof ar.get === "function" ? ar.get() : ar.current; } catch (_) { cur = null; }
            opRow({
              id: "altarRamps", short: "הכבשים הקטנים",
              cap: String(ar.title || "הכבשים הקטנים"),
              refs: rs,
              options: arOpts.map((o) => [o.key, String(o.label || o.key), String(arInfo[o.key] || ""), Array.isArray(arRefs[o.key]) ? arRefs[o.key] : null]),
              current: arOpts.some((o) => o.key === cur) ? cur : arOpts.some((o) => o.key === "rashi") ? "rashi" : arOpts[0].key,
              onPick: (k) => { ar.set(k); },
              fly: () => flyView(typeof ar.fly === "string" && ctx.shared.flyPoints && ctx.shared.flyPoints[ar.fly] ? ar.fly : "mizbeach")
            });
          }
        }
        opRow({   // PARALLELS_C (fix-c): the row of the Second Temple's ARAVAH_B2 (sh71) - the circuit in this house's demonstration (59-parallels.js)
          id: "c1", short: "הקפת המזבח בערבה — כהנים בלבד, או גם ישראל", cardFly: true,
          cap: "הקפת המזבח בערבה — כהנים בלבד, או גם ישראל",
          refs: [["סוכה ד, ה", {"book": 56, "index": 44}], ["סוכה מג:", {"book": 108, "index": 1131}], ["רש״י סוכה מג:", {"book": 2163, "index": 2025}], ["תוספות סוכה מג:", {"book": 1903, "index": 452}], ["סוכה מד.", {"book": 108, "index": 1144}], ["כלים א, ח", {"book": 91, "index": 9}], ["כלים א, ט", {"book": 91, "index": 10}], ["ריטב״א סוכה מג:", {"book": 1938, "index": 589}], ["מאירי סוכה מג:", {"book": 2195, "index": 506}], ["ר״ן סוכה כא:", {"book": 2259, "index": 590}], ["ביאור הגר״א אורח חיים תרס, א", {"book": 3816, "index": 12919}], ["אור זרוע ח״ב שטו", {"book": 3930, "index": 3793}]],
          options: [["o0", "רש״י ורוב הראשונים — הכהנים לבדם מקיפים", "לשון המשנה (סוכה ד, ה): ״בכל יום מקיפין את המזבח פעם אחת, ואומרים, אנא ה׳ הושיעה נא, אנא ה׳ הצליחה נא... ואותו היום מקיפין את המזבח שבע פעמים״.\n**רש״י** (סוכה מג:): ״והביאום הכהנים וזקפום כו׳ — אבל ישראל לא היה נכנס בין האולם ולמזבח, ומדקתני חיבוט ערבה מכלל דביד נוטלין אותה ומנענעים ומקיפין בה הכהנים את המזבח ברגליהם, ואחר כך זוקפין אותה״.\n**התוספות** (שם): ״אלא הכהנים מקיפין בה את המזבח כדפי׳ בקונטרס, דישראל אין יכולין להקיף, כדתנן פ״ק דכלים, דאין ישראל נכנס בין האולם ולמזבח״. וכן **הריטב״א**, **המאירי** ו**הר״ן** שם; ו**הגר״א** (ביאור הגר״א, אורח חיים תרס, א): ״ואין ההקפה בבהמ״ק אלא בכהנים, דאין זר נכנס בין אולם למזבח״.\n**המשנה** (כלים א, ח–ט): ״עזרת הכהנים מקדשת ממנה, שאין ישראל נכנסים לשם אלא בשעת צרכיהם, לסמיכה לשחיטה ולתנופה. בין האולם ולמזבח מקדש ממנה, שאין בעלי מומין ופרועי ראש נכנסים לשם״; ו**ריש לקיש** (סוכה מד.): ״כהנים בעלי מומין נכנסין בין האולם ולמזבח, כדי לצאת בערבה״.\nבמודל (ברירת המחדל): כהנים בבגדי לבן מקיפים את המזבח ואת הכבש — גם בין האולם ולמזבח — ובידם בד ערבה. ההדגמה: ״מצות ערבה — הדגמה״ שבמקומות.", [["רש״י סוכה מג:", {"book": 2163, "index": 2025}], ["תוספות סוכה מג:", {"book": 1903, "index": 452}], ["כלים א, ט", {"book": 91, "index": 10}]]],   // QUOTES_Q: משנה כלים א, ח (91:9): 'מקדשת'; משנה כלים א, ט (91:10): 'מקדש'
            ["o1", "האור זרוע בשם הירושלמי — גם ישראל מקיפים", "**האור זרוע** (חלק ב, סימן שטו): ״ומצאתי סמך למנהגנו, דאמר בירושלמי בשמעתין: כיצד סדר הקפה? כל ישראל גדולים וקטנים נוטלים את לולביהן בידיהן ימנית ואתרוגיהן בידיהן השמאלית, ומקיפין הקפה אחת... ונראה בעיני דלא פליגי ירוש׳ וגמ׳ דידן, אלא תרוייהו ס״ל שהיתה הקפה בישראל, והיו ישראל נכנסין בין האולם ולמזבח ומקיפין, והיא הראיה מרשב״ל, דכהן בעל מום זר הוא לענין זה, שאסור ליכנס כל השנה בין האולם ולמזבח, עתה מות׳ בעבור מצות הקפ׳״.\nאת לשון הירושלמי שהביא — לא מצאתי בתלמוד הירושלמי שבספרייה. **הגר״א** (ביאור הגר״א, אורח חיים תרס, א) כתב שמנהג ההקפה מובא באגדה (ילקוט תהלים), ״אבל צ״ע שם שאמר סדר ההקפה כל ישראל גדולים כו׳. ואין ההקפה בבהמ״ק אלא בכהנים, דאין זר נכנס בין אולם למזבח, וכמ״ש בהדיא בפ״ד דסוכה״.\nבמודל: עם הכהנים מקיפים גם ישראלים בבגדיהם — לולב בימינם ואתרוג בשמאלם, כלשון הירושלמי שהביא האור זרוע.", [["אור זרוע ח״ב שטו", {"book": 3930, "index": 3793}], ["ביאור הגר״א אורח חיים תרס, א", {"book": 3816, "index": 12919}]]]],
          current: "o0",
          onPick: (k) => { const A = ctx.shared.aravah; if (A && typeof A.setCircuit === "function") A.setCircuit(k === "o1" ? "all" : "priests"); const F = (ctx.shared.features || {}).aravah; if (F && !F.isOn()) F.on(); },
          fly: () => { const A = ctx.shared.altarPlace, dz = A && A.dz && A.current in A.dz ? A.dz[A.current] + (A.extra || 0) : 10; fly([24, 34, -24 + dz], [55, 12, dz]); }
        });
        // PARALLELS_C (fix-c, decisions 151 א, 152 א): the Millo's two rows (59-parallels.js, section 12) - its time and its form
        if (ctx.shared.millo) {
          const ML2 = ctx.shared.millo, mFly = () => { if (ctx.shared.irDavid) ctx.shared.irDavid.set(true); setLayer("irDavid", true); const p = ML2.at(); fly([p[0] - 40, p[1] + 34, p[2] + 46], [p[0] + 2, p[1] + 3, p[2]]); };
          opRow({
            id: "c2", short: "עיר דוד והמלוא — לפני שלמה, אחריו, או בימי חזקיהו", cardFly: true, cap: "עיר דוד והמלוא — לפני שלמה, אחריו, או בימי חזקיהו",
            refs: [["מלכים א ט, כד", { book: 10, index: 367 }], ["רש״י מלכים א ט, כד", { book: 3673, index: 579 }], ["מלכים א יא, כז", { book: 10, index: 429 }], ["סנהדרין קא:", { book: 125, index: 3958 }], ["מלבי״ם מלכים א ט, כד", { book: 3394, index: 580 }], ["דברי הימים ב לב, ה", { book: 39, index: 718 }], ["מצודת דוד דברי הימים ב לב, ה", { book: 3318, index: 1617 }], ["ישעיהו כב, יא", { book: 12, index: 431 }], ["רש״י ישעיהו כב, יא", { book: 3686, index: 1417 }], ["אברבנאל ישעיהו כב, יא", { book: 3566, index: 744 }], ["מלבי״ם דברי הימים ב לב, ה", { book: 3364, index: 936 }]],
            options: [["after", "אחרי שלמה — בתים לעבדיה ולשפחותיה, והפרצה נסגרה", "רש״י (מלכים א ט, כד): ״לבנות לתוכו בתים, לעבדיה ולשפחותיה״; מלבי״ם (שם): ״להיות מוגדר בשבילה לצניעות ובתים לעבדיה ומשרתיה״; ״שלמה בנה את־המלוא סגר את־פרץ עיר דוד אביו״ (מלכים א יא, כז). ובשיטת רש״י — גם המגדל: ״ובנה שם מגדל לבת פרעה ולאנשים שעובדין לה״ (רש״י סנהדרין קא:)."],
              ["before", "לפני שלמה — פנוי, פרוץ לעולי רגלים, ואהליהם", "רש״י (מלכים א ט, כד): ״אביך הניחו פרוץ לעולי רגלים״; ״כי אביו הניחו לפרש בו עולי רגלים אהלים״; בגמרא (סנהדרין קא:): ״דוד אביך פרץ פרצות בחומה כדי שיעלו ישראל לרגל״. ובשיטת רש״י — על התל בתי דוד: ״ועליו בנה דוד בתים״ (רש״י שמואל ב ה, ט). ובעיר — אהל הארון, עד שהועלה למקדש: ״להעלות את־ארון ברית־יהוה מעיר דוד״ (מלכים א ח, א)."],
              ["hezekiah", "בימי חזקיהו — חומה כפולה ומקוה בין החומות", "״ויבן את־כל־החומה הפרוצה ויעל על־המגדלות ולחוצה החומה אחרת ויחזק את־המלוא עיר דויד״ (דברי הימים ב לב, ה); מצודת דוד שם: ״ולחוצה. מן החומה ההיא בנה עוד חומה אחרת וחיזק פרצות המלוא שהיתה בעיר דוד״. ״ומקוה עשיתם בין החמתים למי הברכה הישנה״ (ישעיהו כב, יא); רש״י: ״החומות כפולות: חיל וחומה, ובין מי הברכה הישנה״; אברבנאל: ״ואותו מקוה עשו בין החומות, כי היו לירושלם שתי חומות״. ולמלבי״ם (דברי הימים ב לב, ה) החומה הכפולה בצפון ירושלים: ״הוא בצפון ירושלים ששם פרץ יואש משער אפרים עד שער הפינה, ושם בנה חומה כפולה״ — לא צויר. במודל: החומה האחרת ממערב לעיר, ליד המלוא, והמקוה ביניהן — בחירת מודל."]],
            current: ML2.time, onPick: (k) => { ML2.setTime(k); }, fly: mFly
          });
          opRow({
            id: "c3", short: "צורת המלוא — רחבה פנויה, או תל עפר (רש״י)", cardFly: true, cap: "צורת המלוא",
            refs: [["רד״ק שמואל ב ה, ט", { book: 3541, index: 200 }], ["ספר השרשים, מלא", { book: 6063, index: 2110 }], ["רש״י שמואל ב ה, ט", { book: 3688, index: 113 }], ["רש״י מלכים א ט, טו", { book: 3673, index: 565 }], ["רלב״ג שמואל ב ה, ט", { book: 3643, index: 74 }]],
            options: [["plaza", "רחבה פנויה לאסיפת העם — רד״ק, ספר השרשים, מצודות, מלבי״ם, רלב״ג, אברבנאל", "רד״ק (שמואל ב ה, ט): ״מקום סמוך לחומה ואותו המקום היתה רחבה להאסף העם שם לפיכך נקרא מלוא״; ספר השרשים: ״והוא מקום בירושלם סמוך לחומה מבפנים, ולא היה בנוי אלא היה רחבה שנאספים שם״."],
              ["tel", "תל עפר בתוך חומה נמוכה — רש״י", "רש״י (שמואל ב ה, ט): ״הקף חומה נמוכה, וממלאין אותה עפר, וגבה התל באמצע, ומשפע והולך לכל רוח, הוא קרוי מלוא, ועליו בנה דוד בתים״; ובמלכים א ט, טו: ״על שם שמקף חומה נמוכה, ומלאו לתוכה עפר״. (ולרלב״ג, שמואל ב ה, ט — חפיר מלא מים: ״ומלאו החפירה המים״; לא צויר.)"]],
            current: ML2.form, onPick: (k) => { ML2.setForm(k); }, fly: mFly
          });
          opRow({
            id: "c4", short: "מצודת ציון — מבצר נפרד, או העיר כולה (רש״י)", cardFly: true, cap: "מצודת ציון",
            refs: [["שמואל ב ה, ז", { book: 9, index: 122 }], ["מצודת דוד שמואל ב ה, ז", { book: 3329, index: 252 }], ["אברבנאל שמואל ב ה, ז", { book: 3577, index: 125 }], ["מלבי״ם שמואל ב ה, ז", { book: 3390, index: 198 }], ["רש״י שמואל ב ה, ו", { book: 3688, index: 103 }],
              ["רש״י שיר השירים ד, ד", { book: 3659, index: 208 }], ["מצודת דוד שיר השירים ד, ד", { book: 3316, index: 122 }]],
            options: [["sep", "מבצר נפרד בחלק העליון של העיר — מצודת דוד, אברבנאל, מלבי״ם", "מצודת דוד (שמואל ב ה, ז): ״מצודת ציון. שם מבצר חזק, סמוך למקום יבוס״; אברבנאל (שם): ״ואחרי שלכד דוד המצודה השתדל ללכוד עוד את העיר שהיתה גם כן חזקה מאד והיתה נבדלת מהמבצר״; מלבי״ם (שם): ״הלך לצד השני ששם המצודה ולכד את מצודת ציון״. ובה המגדל — רש״י (שיר השירים ד, ד): ״״כמגדל דוד״, הוא מצודת ציון שהוא מקום חזק ועופל ומבצר״; ״כך מנהג השרים לתלות מגניהם ושלטיהם בכתלי המגדלים״; מצודת דוד (שם): ״כי לפי רוב הגובה היה נראה למרחוק״."],
              ["rashi", "העיר כולה מצודה — רש״י", "רש״י (שמואל ב ה, ו): ״מצודת ציון נקראה יבוס״ — העיר היבוסית עצמה היא המצודה. במודל: חומת העיר במגדלים, ומגדל דוד בראש העיר."]],
            current: ML2.fortress, onPick: (k) => { ML2.setFortress(k); }, fly: () => { if (ctx.shared.irDavid) ctx.shared.irDavid.set(true); setLayer("irDavid", true); fly([20, 70, 640], [126, -10, 740]); }
          });
        }
        // 1.3.5 (the user, 22:12: "אפשרות 3"): the air between the ramp and the altar - ctx.shared.rampGap (40-altar.js)
        {
          const rg = ctx.shared.rampGap;
          if (rg && typeof rg.set === "function") opRow({
            id: "rampGap", short: "הרווח שבין הכבש למזבח", cardFly: true, chips: { hair: "כחוט השערה", tosafot: "תוספות: גדול וניכר", chaim: "רבינו חיים" },
            cap: "הרווח שבין הכבש למזבח",
            refs: [["זבחים סב:", { book: 130, index: 2125 }], ["רש״י זבחים סב:", { book: 2191, index: 3021 }], ["רש״י שמות כז, ה", { book: 3692, index: 1912 }], ["רמב״ם בית הבחירה ב, יג", { book: 337, index: 36 }], ["תוספות זבחים סב:", { book: 1936, index: 663 }], ["תוספות זבחים פז:", { book: 1936, index: 949 }], ["תוספות זבחים סא:", { book: 1936, index: 659 }]],
            options: [
              ["hair", "כחוט השערה — רש״י והרמב״ם", "בגמרא (זבחים סב:): 'אויר יש בין כבש למזבח?' — 'מה דם בזריקה, אף בשר בזריקה'. רש״י (שמות כז, ה): 'והכבש היה בדרום המזבח, מבדל מן המזבח מלא חוט השערה'. הרמב״ם (בית הבחירה ב, יג): 'ואויר מעט היה מפסיק בין הכבש למזבח, כדי לתן האיברים למזבח בזריקה'.\nבמודל (**ברירת המחדל**): ראש הכבש מגיע עד המזבח, ורווח דק מפסיק ביניהם."],
              ["tosafot", "תוספות — אויר גדול וניכר", "תוספות (זבחים סב:, ד״ה אויר קרקע מפסיקו): 'קרקע לאו דוקא, שהיה פורח אמה על יסוד ואמה על סובב; ובלאו קרא היה צריך אויר, משום שנאמר סביב כדבסמוך, אלא דסגי במשהו; אבל הכא בעינן אויר גדול וניכר'.\nבמודל: רווח של חצי אמה בראש הכבש, כולו מעל הסובב. שיעורו לא נתפרש — בחירת מודל."],
              ["chaim", "רבינו חיים — אויר קרקע", "תוספות (זבחים פז:, ד״ה אויר יש בין כבש למזבח): 'מיהו אין נראה לרבינו חיים, שהרי יש אויר מפסיק יותר מכדי אמה סובב, כדי שיהא אויר קרקע מפסיקו, כדאמרינן לעיל: מה דם אויר קרקע מפסיקו, אף בשר אויר קרקע מפסיקו'. ורש״י שם (סב:): 'הרצפה מפסיק בינו למזבח'.\nבבית ראשון היה יסוד גם בדרום — תוספות (זבחים סא:): 'היה להם יסוד לדרום שהיה משוך בחלקו של טורף'. לכן במודל ראש הכבש רחוק מן המזבח **שתי אמות ורבע**: אמת הסובב, אמת היסוד, ורבע אמה שבה נראית הרצפה. רגל הכבש במקומה. שיעור הרווח, והאופן שבו הוא מתיישב עם 'פורח אמה על יסוד ואמה על סובב' — בחירת מודל."]
            ],
            current: rg.mode,
            onPick: (k) => { rg.set(k); },
            fly: () => flyView("rampGap")
          });
        }
        // 1.2.0 (the user): the place of the altar in the court - ctx.shared.altarPlace (40-altar.js): R. Eliezer b. Yaakov (south, the
        // default, as the Rambam rules) / R. Yose (north) / R. Yehuda (the middle). The texts are the user's own summary (in the module).
        {
          const ap = ctx.shared.altarPlace;
          if (ap && typeof ap.set === "function" && Array.isArray(ap.keys)) {
            opRow({
              id: "altarPlace", short: "מקום המזבח", cardFly: true, chips: { south: "ראב״י: בדרום", north: "ר׳ יוסי: בצפון", middle: "ר׳ יהודה: באמצע" },
              cap: "מקום המזבח בעזרה",
              refs: [["יומא טז.", P(107, "טז.")], ["זבחים סג.", P(130, "סג.")], ["זבחים נח:", P(130, "נח:")], ["רמב״ם בית הבחירה ה, יג", RB(5, 13)]],
              options: ap.keys.map((k) => [k, String(ap.names[k] || k), String(ap.lead || "") + " " + String(ap.info[k] || ""), null]),
              current: ap.current || "south",
              onPick: (k) => { ap.set(k); },
              fly: () => {   // 1.2.2 (the user: "מרחוק יותר - שיהיה ברור איזה צד"): from the east, high, down the house's axis; the axis drawn for 15 s
                flyView("altarPlaceView");
                const ax = ctx.shared.altarAxis;
                if (ax) {
                  ax.set(true);
                  clearTimeout(ax.tmr);
                  ax.tmr = setTimeout(() => ax.set(false), 15000);
                }
              }
            });
          }
        }
        // 1.3.7 (a remark sent on to the user, 11.11.2026; the user: "2. אפשרות ב"): R. TAM'S READING - the yesod on the altar's south and
        // the altar's place - ctx.shared.altarRTam (40-altar.js). Every quote is from the user's library (Zevachim 53b: book 130, line
        // 1865; Middot 3:1: book 89, line 19; Tosafot Zevachim 61b: book 1936, line 654, the whole dibur).
        {
          const rt = ctx.shared.altarRTam;
          if (rt && typeof rt.set === "function") {
            const RT_LEAD = "בגמרא (זבחים נג:): ״וקרן מזרחית דרומית לא היה לה יסוד. מאי טעמא? אמר רבי אלעזר: לפי שלא היתה בחלקו של טורף״. ובמשנה (מדות ג, א), על מזבח בית שני: ״וכשעלו בני הגולה, הוסיפו עליו ארבע אמות מן הדרום וארבע אמות מן המערב, כמין גמא״; ״והיסוד היה מהלך על פני כל הצפון ועל פני כל המערב, ואוכל בדרום אמה אחת, ובמזרח אמה אחת״.\nהשאלה: כיצד היה היסוד בדרומו של מזבח בית ראשון, והיכן עמד המזבח ביחס למזבח בית שני.";
            opRow({
              id: "altarRTam", short: "היסוד בדרום", cardFly: true, chips: { tosafot: "תוספות: יסוד בדרום", rtam: "רבינו תם: בלי יסוד בדרום" },
              cap: "יסוד המזבח בדרום — ומקום המזבח",
              refs: [["זבחים נג:", { book: 130, index: 1865 }], ["מדות ג, א", { book: 89, index: 19 }], ["זבחים סא:", { book: 130, index: 2096 }], ["תוספות זבחים סא:", { book: 1936, index: 659 }], ["רש״י זבחים סא:", { book: 2191, index: 2952 }]],
              options: [
                ["tosafot", "מסקנת התוספות — יסוד גם בדרום", RT_LEAD + "\nהתוספות (זבחים סא:), במסקנתם, כגירסת הספרים ״דרום ומערב״: ״ובבית ראשון היה להם יסוד לדרום שהיה משוך בחלקו של טורף חוץ מרוח מזרחית שלא נשתנה שהיה בלא יסוד (עד) חלקו של יהודה כמו בבית שני״.\nבמודל (ברירת המחדל): **היסוד מהלך בצפון, במערב ובדרום**; במזרח — אמה אחת בלבד, בקרן הצפונית־מזרחית.", null],
                ["rtam", "רבינו תם — בלי יסוד בדרום, והמזבח ארבע אמות לדרום", RT_LEAD + "\nרבינו תם, בתוספות (זבחים סא:): ״וקשה לר״ת דא״כ היה המזבח ד׳ אמות בחלקו של יהודה דמסתמא בבית ראשון לא היה יסוד לקרן דרומית מזרחית לפי שלא היה בחלקו של טורף... ואם בבית שני הוסיפו בדרום א״כ בנו בחלקו של יהודה וגרס ר״ת מן הצפון מן המערב״.\nלגירסתו נוספו ארבע האמות בצפון ובמערב, ולא בדרום. התוספות מקשים על גירסה זו — מן השיתין שבדרום, ומן הלול שבמערבו של כבש — ומסיקים כגירסת הספרים.\nבמודל: **היסוד בצפון ובמערב, ״ואוכל בדרום אמה אחת, ובמזרח אמה אחת״**, כבבית שני; **המזבח כולו, עם הכבש, ארבע אמות לדרום** ממקומו שבברירת המחדל (שלגירסתו נוספו ארבע האמות בצפונו); הכבש הקטן שליסוד יורד אל אמת היסוד שבקרן המערבית־דרומית, והכבש הגדול אינו פורח על יסוד. מקום האמה שבדרום ומהלך הכבש הקטן — בחירת מודל.", null]
              ],
              current: rt.current || "tosafot",
              onPick: (k) => { rt.set(k); },
              fly: () => {   // the house's axis drawn for 15 s, as the row "מקום המזבח": the altar's north face against it
                flyView("mizbeachSE");
                const ax = ctx.shared.altarAxis;
                if (ax) {
                  ax.set(true);
                  clearTimeout(ax.tmr);
                  ax.tmr = setTimeout(() => ax.set(false), 15000);
                }
              }
            });
          }
        }
        // 1.3.0 (the opinions table, as in the Second Temple model 1.8.0): the number of pyres on the altar - ctx.shared.maarachot
        // (40-altar.js). The texts are the Second Temple model's (every quote checked there); the last line is ours.
        // 1.3.2 (the user, on the Second Temple model: "יוה״כ בכל השיטות! הוא רק מפחית את מנין המערכות ולא מגדיל"): two rows - the Tannaim
        // (every day), and Yom Kippur, one more pyre for whichever Tanna is chosen (Mishnah Yoma 4:6); each row keeps the other's choice
        {
          const mc = ctx.shared.maarachot;
          if (mc && typeof mc.set === "function") {
            const MC = { yose: 3, yehuda: 2, meir: 4 };
            opRow({
              id: "maarachot", short: "מניין המערכות", cardFly: true,
              chips: { yose: "רבי יוסי: שלוש", yehuda: "רבי יהודה: שתיים", meir: "רבי מאיר: ארבע" },
              cap: "מניין המערכות",
              refs: [["יומא ד, ו", { book: 55, index: 36 }], ["יומא מה.", { book: 107, index: 1139 }], ["תמיד ב, ד", { book: 88, index: 10 }], ["רמב״ם תמידין ומוספין ב, ד", { book: 344, index: 19 }]],
              options: [
              ["yose", "רבי יוסי — שלוש", "לשון המשנה (תמיד ב, ד): ״סדר המערכה גדולה מזרחה, וחזיתה מזרחה, וראשי הגזרין הפנימים היו נוגעים בתפוח. ורוח היה בין הגזרין, שהיו מציתין את האליתא משם״; (יומא ד, ו): ״בכל יום היו שם ארבע מערכות, והיום חמש, דברי רבי מאיר. רבי יוסי אומר, בכל יום שלש, והיום ארבע. רבי יהודה אומר, בכל יום שתים, והיום שלש״.\nברטנורא (תמיד ב, ד): שלוש מערכות בכל יום — הגדולה, ששורפים עליה את התמיד; השנייה, של קטורת, שנוטלים ממנה גחלים במחתה; והשלישית לקיום האש — ״והאש על המזבח תוקד בו״; ״חזיתה מזרחה״ — פתחה וחלונה לצד מזרח של המזבח, ו״אליתא״ — חריות וקיסמים דקים להצית. כרבי יוסי פסק הרמב״ם (תמידין ומוספין ב, ד).\nבמודל: **שלוש מערכות**; בחירת מודל במקומן ובגודלן.\nבבית ראשון: הפסוקים אינם מונים את המערכות; כאן הן מצוירות כדברי התנאים במשנה, כבמודל בית שני — בחירת מודל.", null],
              ["yehuda", "רבי יהודה — שתיים", "״רבי יהודה אומר, בכל יום שתים, והיום שלש״ (יומא מה.): מערכה גדולה ומערכה שנייה של קטורת בלבד. במודל: המערכה השלישית נעלמת.\nבבית ראשון: הפסוקים אינם מונים את המערכות; כאן הן מצוירות כדברי התנאים במשנה, כבמודל בית שני — בחירת מודל.", null],
              ["meir", "רבי מאיר — ארבע", "״בכל יום היו שם ארבע מערכות והיום חמש, דברי רבי מאיר״ (יומא מה.): בנוסף לשלוש — מערכה לאיברים ופדרים שלא נתעכלו מבערב. במודל: מערכה רביעית בצד דרום־מזרח.\nבבית ראשון: הפסוקים אינם מונים את המערכות; כאן הן מצוירות כדברי התנאים במשנה, כבמודל בית שני — בחירת מודל.", null],
              ],
              current: "yose",
              onPick: (k) => { mc.set(MC[k] || 3, !!mc.yk); },
              fly: () => flyView("mizbeachTop")
            });
            opRow({
              id: "maarachotYK", short: "המערכות ביום הכיפורים", cardFly: true,
              chips: { daily: "בכל יום", yk: "יום הכיפורים — מערכה נוספת" },
              cap: "המערכות ביום הכיפורים",
              refs: [["יומא ד, ו", { book: 55, index: 36 }], ["יומא מה.", { book: 107, index: 1139 }], ["רש״י יומא מה.", { book: 2157, index: 1728 }]],
              options: [
                ["daily", "בכל יום", "במודל: בכל יום — כמניין התנא שנבחר במתג ״מניין המערכות״: רבי יוסי שלוש, רבי יהודה שתיים, רבי מאיר ארבע (יומא ד, ו).", null],
                ["yk", "יום הכיפורים — מערכה נוספת", "לשון המשנה (יומא ד, ו): ״בכל יום היו שם ארבע מערכות, והיום חמש, דברי רבי מאיר. רבי יוסי אומר, בכל יום שלש, והיום ארבע. רבי יהודה אומר, בכל יום שתים, והיום שלש״.\nבכל השיטות ביום הכיפורים מוסיפים מערכה אחת: לרבי יהודה שלוש, לרבי יוסי ארבע, לרבי מאיר חמש. ובברייתא (יומא מה.): ״ואחת שמוסיפין בו ביום״. רש״י (יומא מה.): ״ליטול ממנה גחלים לקטורת של לפני ולפנים״.\nבמודל: המערכה הנוספת נוספת על מניין התנא שנבחר במתג ״מניין המערכות״, בצפון־מזרח הגג; מקומה וגודלה — בחירת מודל.", null]
              ],
              current: "daily",
              onPick: (k) => { mc.set(mc.count || 3, k === "yk"); },
              fly: () => flyView("mizbeachTop")
            });
          }
        }
        // 1.3.2 (the user: "תוסיף שיטת ר' יוסי"): the altar's measures - the verse's 20 x 20 (the default) or R. Yose's 28 x 28 receding to the
        // place of the pyre, 20 x 20 - ctx.shared.altarYose (40-altar.js)
        {
          const ay = ctx.shared.altarYose;
          if (ay && typeof ay.set === "function") {
            opRow({
              id: "altarYose", short: "מידות המזבח", cardFly: true,
              chips: { chronicles: "דברי הימים: עשרים", yose: "רבי יוסי: עשרים ושמונה" },
              cap: "מידות המזבח",
              refs: [["דברי הימים ב ד, א", V(39, 4, 1)], ["מדות ג, א", MI(3, 1)], ["רש״י זבחים נט:", { book: 2191, index: 2866 }], ["רש״י זבחים סא:", { book: 2191, index: 2952 }]],   // QUOTES_Q: רש״י זבחים נט: 'יסוד וסובב לא היו ממעטין...' בשורה 2866 באוצריא (2871 = 'שפיר קא״ר יוסי')
              options: [
                ["chronicles", "דברי הימים — עשרים על עשרים", "״ויעש מזבח נחשת עשרים אמה ארכו ועשרים אמה רחבו ועשר אמות קומתו״ (דברי הימים ב ד, א).\nבמודל: גוף המזבח עשרים על עשרים וגובהו עשר, והיסוד והסובב סביבו — כרש״י (זבחים נט:): ״יסוד וסובב לא היו ממעטין בארכו ורחבו לפי שמקיפין ובולטין סביביו״. בחירת מודל.", null],
                ["yose", "רבי יוסי — עשרים ושמונה", "לשון המשנה (מדות ג, א): ״אמר רבי יוסי, מתחלה לא היה אלא שמנה ועשרים על שמנה ועשרים, כונס ועולה במדה זו, עד שנמצא מקום המערכה עשרים על עשרים״. רש״י (זבחים סא:): ״בתחילה בימי שלמה לא היה אלא כ״ח כונס ועולה יסוד וסובב ומקום קרנות ומקום הילוך עד שהיה מקום המערכה כ׳ על כ׳״; ושם (נט:): ״ובמזבח שעשה שלמה היה מקום המערכה כ׳ על כ׳ לרבי יוסי״. כלומר העשרים שבפסוק — מקום המערכה.\nבמודל: היסוד עשרים ושמונה, הכותל שעד הסובב עשרים ושש, ומעליו עשרים וארבע עד הגג; הקרנות ומקום הילוך רגלי הכהנים סביב מקום המערכה, עשרים על עשרים. מרכזו כמזבח של הפסוק, והכבש זז עמו שתי אמות לדרום — בחירת מודל.", null]
              ],
              current: ay.current || "chronicles",
              // 1.3.3: the reading's measures drawn for 15 s (ctx.shared.altarMeasures), from the measures' view
              onPick: (k) => {
                ay.set(k);
                const AMs = ctx.shared.altarMeasures;
                if (AMs && typeof AMs.set === "function") {   // MEASURES_211: the frames stay while the reading shows (no 15 seconds), and go when another place or row comes
                  const FM = { key: "altarMeasures", timed: false, isOn: () => AMs.get(), on: () => AMs.set(true), off: () => AMs.set(false) };
                  try { const was = !!FM.isOn(); autoOff.run(FM); if (!was) leaveFeat = FM; } catch (_) {}
                }
              },
              fly: () => flyView(ctx.shared.flyPoints && ctx.shared.flyPoints.mizbeachMeasures ? "mizbeachMeasures" : "mizbeach")
            });
          }
        }
        // 1.3.3 (the user: "ספלים — להוסיף בשיטות"): the holes of the libation bowls - ctx.shared.sfalim (40-altar.js), as the Second Temple plugin
        {
          const sf = ctx.shared.sfalim;
          if (sf && typeof sf.set === "function") {
            opRow({
              id: "sfalim", short: "ספלי הניסוך", cardFly: true,
              chips: { rashi: "רש״י: חוטם", tosafot: "תוספות: נקב בתחתית" },
              cap: "ספלי הניסוך",
              refs: [["משנה סוכה ד, ט", { book: 56, index: 48 }], ["רש״י סוכה מח:", { book: 2163, index: 2274 }], ["תוספות סוכה מח:", { book: 1903, index: 504 }], ["ברטנורא סוכה ד, ט", { book: 588, index: 224 }]],
              options: [
                ["rashi", "רש״י וברטנורא — חוטם, ונקב בגג המזבח", "רש״י (סוכה מח:): ״חוטם אחד בספל ונקב אחד בחוטמו והכהן מערה בפי הספלים והנסכים מקלחין ויורדין דרך החוטמין על גב המזבח ובמזבח היה נקב שבו המים והיין יורדין לשיתין של מזבח״. וכן הברטנורא (סוכה ד, ט).\nבמודל: חוטם קטן יוצא מכל ספל לדרום, ונקב בגג המזבח מולו.", null],
                ["tosafot", "תוספות — נקב בתחתית הספל", "תוספות (סוכה מח:): ״וזו תימה גדולה מנין לו כל אותו הענין שמחוטם של הספלים מקלח על גג המזבח ומשם לנקב המזבח ומשם לשיתין דלמא הוא דמנקב הספלים יורדין לשיתין כמין שני נקבי החוטם ולא שהיה בולט כמין חוטם״.\nבמודל: נקב בתחתית כל ספל, והנסכים יורדים ממנו ישר לשיתין.", null]
              ],
              current: sf.current || "rashi",
              onPick: (k) => { sf.set(k); },
              fly: () => flyView(ctx.shared.flyPoints && ctx.shared.flyPoints.sfalim ? "sfalim" : "mizbeach")
            });
          }
        }
        // SCALE_FIG_A2 (fix-a2; the user's decision 23): a priest for scale, 3.54 amot (ctx.shared.scaleFigure, 58-ark.js)
        if (ctx.shared.scaleFigure) opRow({
          id: "scaleFigure", short: "דמות לקנה מידה — כהן בגובה אדם", cardFly: false,
          chips: { off: "בלי", on: "כהן — 170 ס״מ" },
          cap: "דמות לקנה מידה",
          refs: [["עירובין מח.", { book: 105, index: 1782 }]],
          options: [["off", "בלי", "המודל בלי דמות לקנה מידה."],
            ["on", "כהן לקנה מידה — 170 ס״מ", "**דמות לקנה מידה:** כהן אחד בבגדיו, וגובהו 170 ס״מ — גובה אדם ממוצע — באמה של 48 ס״מ: 3.54 אמות (כשלוש אמות ושלושה טפחים ורבע, בטפח של 8 ס״מ). בחירת מודל.\n**היכן הוא עומד:** על הרצפה, מעט מימין למה שמביטים בו, ופניו אל העין; כשהמבט זז — הוא הולך איתו. בחירת מודל.\n**לעניין המקום שאדם תופס** (עירובין מח.): ״וכמה תחתיו? גופו שלש אמות, ואמה כדי לפשוט ידיו ורגליו — דברי רבי מאיר״."]],
          current: "off",
          onPick: (k) => { const F = ctx.shared.scaleFigure; if (F && typeof F.set === "function") F.set(k === "on"); }
        });
        // HP_RISHON_A2 (fix-a2; the user's decision 70 b): a priest in his four garments and the high priest in his eight (58-ark.js)
        // HP_KIT_A2: the common priest's avnet in it - of wool and linen (Rebbi; the Rambam - the default) or of linen (Rabbi Elazar b. R.
        // Shimon), Yoma 12b; the ephod and the mitznefet - the two rows after it (both houses, the same pair: shared/frag/hp-kit.js)
        const pgOn = () => { try { const r = OPS_BY_ID.priestGarments, P = ctx.shared.priestGarments; if (r && r.cur === "off" && P) { P.set(true); r.mark("on"); } } catch (_) {} };
        // KIDDUSH_RYOSE_A2 (the user's decision 82 c): the reading of kiddush for the washing priest by the base (45-vessels.js kiddAt) - the
        // Tanna Kamma and the Rambam, or Rabbi Yose b. R. Yehuda with his fellow holding him (as the Second Temple's morning service)
        if (ctx.shared.mechona) opRow({
          id: "kidReading", short: "קידוש ידיים ורגליים — תנא קמא או רבי יוסי ברבי יהודה", cardFly: false,
          chips: { tk: "תנא קמא", ryose: "רבי יוסי בר״י" },
          cap: "קידוש ידיים ורגליים",
          refs: [["זבחים יט:", { book: 130, index: 754 }], ["זבחים יט: — וחבירו מסייעו", { book: 130, index: 755 }], ["רמב״ם ביאת המקדש ה, טז", { book: 340, index: 93 }]],
          options: [["tk", "תנא קמא והרמב״ם — יד ימין על רגל ימין ויד שמאל על רגל שמאל", "**זבחים יט:** ״תנו רבנן: כיצד מצות קידוש? מניח ידו הימנית על גבי רגלו הימנית, וידו השמאלית על גבי רגלו השמאלית, ומקדש״; והרמב״ם (ביאת המקדש ה, טז): ״ושוחה ומקדש״.\nבמודל: בהדגמת המכונה, הכהן שוחה, כפות ידיו שטוחות על גב כפות רגליו, והזרם מן הברז נופל על גב הידיים ומשם על הרגליים."],
            ["ryose", "רבי יוסי ברבי יהודה — ידיים זו על זו ורגליים זו על זו, וחבירו מסייעו", "**זבחים יט:** ״רבי יוסי ברבי יהודה אומר: מניח שתי ידיו זו על גב זו, ועל גבי שתי רגליו זו על גבי זו, ומקדש. אמרו לו: הפלגתה, אי אפשר לעשות כן״; ״אמר רב יוסף: וחבירו מסייעו״.\nבמודל: הכהן עומד על רגל שמאל, רגל ימין מונחת על גבה, כף יד שמאל על גב רגל ימין וכף יד ימין על גבה; וחבירו עומד מימינו ותומך בו. איזו רגל למעלה ואיזו יד, ומקום החבר — בחירת מודל."]],
          current: "tk",
          onPick: (k) => { ctx.shared.kidReading = k === "ryose" ? "ryose" : "tk"; }
        });
        // AVNET_ONE_A2 (the user's decision, via the coordinator): one switch for the common priest's avnet - all the priests and the pair of
        // "בגדי הכהנים" together (58-ark.js ctx.shared.priestBelt), as the Second Temple's row "אבנטו של כהן הדיוט"
        if (ctx.shared.priestBelt) opRow({
          id: "priestBelt", short: "אבנטו של כהן הדיוט — כלאים או בוץ", cardFly: false,
          chips: { kilayim: "כלאים", butz: "בוץ" },
          cap: "אבנטו של כהן הדיוט",
          refs: [["יומא יב:", { book: 107, index: 270 }], ["רמב״ם כלי המקדש ח, א", { book: 338, index: 123 }], ["רמב״ם כלי המקדש ח, ב", { book: 338, index: 124 }]],
          options: [["kilayim", "רבי והרמב״ם — של כלאים", "**יומא יב:** ״אבנטו של כהן גדול ביום הכפורים — דברי הכל של בוץ. בשאר ימות השנה — דברי הכל של כלאים. לא נחלקו אלא באבנטו של כהן הדיוט בין בשאר ימות השנה, בין ביום הכפורים. שרבי אומר: של כלאים, ורבי אלעזר ברבי שמעון אומר: של בוץ״.\n**הרמב״ם** (כלי המקדש ח, א) כרבי: ״וארבעתן של פשתן לבנים וחוטן כפול ששה. והאבנט לבדו רקום בצמר״; (ח, ב): ״ואבנטו של כהן גדול מעשה רוקם הוא והוא דומה במעשיו לאבנט כהן הדיוט״.\nבמודל: אבנט כל הכהנים צבוע, ארוג מן המינים יחד. אבנט הכהן הגדול — תמיד של כלאים."],
            ["butz", "רבי אלעזר ברבי שמעון — של בוץ", "**יומא יב:** ״לא נחלקו אלא באבנטו של כהן הדיוט... שרבי אומר: של כלאים, ורבי אלעזר ברבי שמעון אומר: של בוץ״.\nבמודל: אבנט כל הכהנים לבן, של פשתן. אבנט הכהן הגדול — של כלאים: ״בשאר ימות השנה — דברי הכל של כלאים״ (שם)."]],
          current: "kilayim",
          onPick: (k) => { const B = ctx.shared.priestBelt; if (B && typeof B.set === "function") B.set(k); }
        });
        if (ctx.shared.priestGarments) opRow({
          id: "priestGarments", short: "בגדי הכהנים — כהן הדיוט וכהן גדול", cardFly: false,
          chips: { off: "בלי", on: "להציג" },
          cap: "בגדי הכהנים",
          refs: [["שמות כח, ד", { book: 2, index: 790 }], ["שמות כח, לא", { book: 2, index: 817 }], ["שמות כח, לו", { book: 2, index: 822 }], ["שמות כח, לט", { book: 2, index: 825 }], ["יומא יב:", { book: 107, index: 270 }], ["רמב״ם כלי המקדש ח, א", { book: 338, index: 123 }], ["רמב״ם כלי המקדש ח, ב", { book: 338, index: 124 }], ["רמב״ם כלי המקדש ט, א", { book: 338, index: 143 }], ["רמב״ם כלי המקדש ט, ג", { book: 338, index: 145 }], ["רמב״ם כלי המקדש ט, ד", { book: 338, index: 146 }], ["רמב״ם כלי המקדש ט, ו", { book: 338, index: 148 }], ["רמב״ם כלי המקדש ט, ט", { book: 338, index: 151 }]],
          options: [["off", "בלי", "בלי הדמויות."],
            ["on", "כהן הדיוט וכהן גדול", "הפסוק (שמות כח, ד): ״ואלה הבגדים אשר יעשו חשן ואפוד ומעיל וכתנת תשבץ מצנפת ואבנט״.\n**הרמב״ם** (כלי המקדש ח, א–ב): ״בגדי כהנה שלשה מינים. בגדי כהן הדיוט. ובגדי זהב. ובגדי לבן. בגדי כהן הדיוט הם ארבעה כלים״; ״בגדי זהב הן בגדי כהן גדול והם שמנה כלים. הארבעה של כל כהן. ומעיל ואפוד וחשן וציץ״.\n**המעיל** (ט, ג–ד): ״המעיל כלו תכלת... ואין לו בית יד, אלא נחלק לשתי כנפים מסוף הגרון עד למטה״; ובשוליו רמונים של תכלת וארגמן ותולעת שני, ״ומביא שנים ושבעים זוגים ובהם שנים ושבעים ענבולים, הכל זהב״.\n**האפוד** (ט, ט): ״רחבו כרחב גבו של אדם מכתף לכתף. וארכו מכנגד אצילי הידים מאחוריו עד הרגלים״, וחשב האפוד חוגר אותו; ובכתפותיו שתי אבני השהם.\n**החשן** (ט, ו): ״ארכו אמה ורחבו זרת וכופלו לשנים, נמצא זרת על זרת מרבע. וקובע בו ארבעה טורים של אבן״.\n**הציץ** (ט, א): ״טס של זהב רחב שתי אצבעות ומקיף מאזן לאזן״ — על המצח, ומעליו, בין הציץ למצנפת, התפילין (זבחים יט.).\n**אבנטו של כהן הדיוט** (יומא יב:): ״לא נחלקו אלא באבנטו של כהן הדיוט... שרבי אומר: של כלאים, ורבי אלעזר ברבי שמעון אומר: של בוץ״. הרמב״ם (כלי המקדש ח, א) כרבי: ״וארבעתן של פשתן לבנים וחוטן כפול ששה. והאבנט לבדו רקום בצמר״. ואבנט הכהן הגדול — ״בשאר ימות השנה — דברי הכל של כלאים״ (יומא יב:).\nבמודל: אבנט כהן הדיוט — לפי השורה ״אבנטו של כהן הדיוט״ (כלאים או בוץ), והוא משנה את כל הכהנים יחד; אבנט הכהן הגדול — תמיד של כלאים.\n" + "**המצנפת** — ״ועשית מצנפת שש״ (שמות כח, לט): לבנה, ופתילי התכלת שעל הציץ קשורים עליה. צורתה, וצורת האפוד — לפי השורות ״אפוד הכהן הגדול״ ו״מצנפת הכהן הגדול״.\nבמודל: בין האולם למזבח — מימין כהן הדיוט (כתונת, מכנסים, אבנט, מגבעת), ומשמאל כהן גדול בשמונה בגדים. " + "הצבעים, המידות וצבעי האבנים — בחירת מודל."]],
          current: "off",
          onPick: (k) => { const P = ctx.shared.priestGarments; if (P && typeof P.set === "function") { P.set(k !== "off"); } if (k !== "off") fly([44.5, 9.5, 20.5], [37, 8.2, 14]); }
        });
        if (ctx.shared.priestGarments) opRow({
          id: "hpEphod", short: "אפוד הכהן הגדול — רש״י או הרמב״ם", cardFly: false,
          chips: { rashi: "רש״י", rambam: "הרמב״ם" },
          cap: "אפוד הכהן הגדול",
          refs: [["רש״י שמות כח, ו", { book: 3692, index: 1963 }], ["רש״י שמות כח, כו", { book: 3692, index: 2020 }], ["רמב״ם כלי המקדש ט, ט", { book: 338, index: 151 }]],
          options: [["rashi", "רש״י — רחב מגבו, וקצותיו לפניו", "**רש״י** (שמות כח, ו): ״האפוד עשוי כמין סינר של נשים רוכבות סוסים, וחוגר אותו מאחוריו כנגד לבו למטה מאציליו, רחבו כמדת רחב גבו של אדם ויותר, ומגיע עד עקביו״; ובפסוק כו: ״שחשב האפוד חוגרו הכהן ונקפל הסינר לפני הכהן על מתניו, וקצת כרסו מכאן ומכאן עד כנגד קצות החשן״.\nבמודל: האפוד מקיף את הגב ואת הצדדים, וקצותיו לפניו, תחת קצות החשן. רוחבו המדויק — בחירת מודל.\n**הכתפות** — ממין האפוד, ועל כל כתף ״אבן שהם מרבע משקע בבית של זהב״, ושתי עבותות זהב — ״והם הנקראים שרשרות״ (הרמב״ם, כלי המקדש ט, ט)."],
            ["rambam", "הרמב״ם — כרוחב הגב בלבד", "**הרמב״ם** (כלי המקדש ט, ט): ״האפוד רחבו כרחב גבו של אדם מכתף לכתף. וארכו מכנגד אצילי הידים מאחוריו עד הרגלים. ויש לו כמו שתי ידות יוצאות ממנו באריג לכאן ולכאן שחוגרין אותו בהם והם הנקראין חשב האפוד״.\nבמודל: האפוד מאחוריו בלבד, מכתף לכתף.\n**הכתפות** — ממין האפוד, ועל כל כתף ״אבן שהם מרבע משקע בבית של זהב״, ושתי עבותות זהב — ״והם הנקראים שרשרות״ (שם)."]],
          current: "rashi",
          onPick: (k) => { const P = ctx.shared.priestGarments; if (P && typeof P.reading === "function") { P.reading({ ephod: k }); pgOn(); fly([39.5, 9.2, 19.5], [37, 8.4, 15.4]); } }
        });
        if (ctx.shared.priestGarments) opRow({
          id: "hpMitz", short: "מצנפת הכהן הגדול — רש״י או הרמב״ן", cardFly: false,
          chips: { rashi: "רש״י", ramban: "הרמב״ן" },
          cap: "מצנפת הכהן הגדול",
          refs: [["שמות כח, לט", { book: 2, index: 825 }], ["רש״י שמות כח, ד", { book: 3692, index: 1957 }], ["רש״י שמות כח, לז", { book: 3692, index: 2050 }], ["רמב״ן שמות כח, לא", { book: 3627, index: 709 }], ["רמב״ן שמות כח, לז", { book: 3627, index: 713 }], ["רמב״ן שמות כט, ז", { book: 3627, index: 721 }], ["רמב״ם כלי המקדש ח, ב", { book: 338, index: 124 }], ["רמב״ם כלי המקדש ט, ב", { book: 338, index: 144 }]],
          options: [["rashi", "רש״י — כמין כפת כובע, למעלה בגובה הראש", "״ועשית מצנפת שש״ (שמות כח, לט) — לבנה.\n**רש״י** (שמות כח, ד): ״מצנפת. כמין כפת כובע״; (כח, לז): ״למדנו שהמצנפת למעלה בגבה הראש ואינה עמקה לכנס בה כל הראש עד המצח, והציץ מלמטה, והפתילים היו בנקבים ותלויין בו בשני ראשים ובאמצעו... וקושר ראשי הפתילים מאחורי הערף שלשתן״.\nבמודל: המצנפת לבנה, והשערות נראות בין הציץ למצנפת — ושם התפילין; שלושה פתילי תכלת, האמצעי עובר על גבי המצנפת."],
            ["ramban", "הרמב״ן — צניף שצונף בו את ראשו", "״ועשית מצנפת שש״ (שמות כח, לט) — לבנה.\n**הרמב״ן** (שמות כח, לא): ״והרי הוא כעין צניף שצונף בו את ראשו, מגלגל ומחזיר מגלגל ומחזיר סביב ראשו כפל על כפל״. ושם (כח, לז): ״והיתה הצניפה בגבה שבראש כנגד המוח האמצעי, והוא מכסה בה כל הראש כנגד אחוריו... אבל מאזן לאזן מאחוריו כנגד כל הערף תהיה המצנפת, והפתיל שנקשר בו יבא עליה״. ושם (כט, ז): ״אבל הנכון שהיתה הצניפה סביב סביב ואמצע הראש מגלה ועליו יצק השמן״.\nוכן **הרמב״ם** (כלי המקדש ח, ב): ״אלא שכהן גדול צונף בה כמי שלופף על השבר״.\nופתיל התכלת של הציץ, כלשון הרמב״ם (ט, ב): ״ופתיל תכלת למטה ממנו נכנס מנקב לנקב כדי שיהיה נקשר בפתיל כנגד הערף״.\nבמודל: הכריכות לבנות, כרוכות סביב הראש וצמודות לו. מלפנים הן מתחילות למעלה, מעל פס השער שבו התפילין, ולא על המצח; ומאחור הן יורדות בשיפוע ומכסות את אחורי הראש עד העורף, מאוזן לאוזן. אמצע הראש מגולה, ורואים בו את השער. פתיל התכלת יוצא מקצות הציץ, עובר מאחורי האוזניים ונקשר על המצנפת כנגד העורף. רצועת התפילין של ראש עוברת מתחת למצנפת, והקשר שלה בעורף מתחת לבד. גובה העטרה, עובי הכריכות וגודל הפתח — בחירת מודל."]],   // QUOTES_Q: רמב״ם כלי המקדש ט, ב (338:144): 'הערף'
          current: "rashi",
          onPick: (k) => { const P = ctx.shared.priestGarments; if (P && typeof P.reading === "function") { P.reading({ mitz: k }); pgOn(); fly([38.6, 10.4, 17.2], [37, 9.8, 15.4]); } }
        });
        // 1.3.3 (the user: "להוסיף שיטת ברירת מחדל לפותות כרש״י"): "והפתות... זהב" (7:50) - ctx.shared.potot (55-interior.js)
        {
          const pt = ctx.shared.potot;
          if (pt && typeof pt.set === "function") {
            opRow({
              id: "potot", short: "הפותות", cardFly: true,
              chips: { rashi: "רש״י: מפתחות", pivots: "תרגום ורד״ק: צירים" },
              cap: "הפותות — ״והפתות... זהב״",
              refs: [["מלכים א ז, נ", ui_V(10, 7, 50)], ["רש״י ז, נ", { book: 3673, index: 468 }], ["רלב״ג ז, נ", { book: 3645, index: 320 }]],
              options: [
                ["rashi", "רש״י — מפתחות של זהב", "״והפתות לדלתות הבית הפנימי לקדש הקדשים לדלתי הבית להיכל זהב״ (מלכים א ז, נ). רש״י: ״והפתות. מפתחות, שמעתי. שמפתחין בהם את המנעול״.\nבמודל: מפתח של זהב במנעול הדלת הצפונית של ההיכל, וכן בדלת הצפונית של הדביר. מקום המנעול, צורת המפתח וגודלו — בחירת מודל.", null],
                ["pivots", "תרגום ורד״ק — הצירים; רלב״ג — מקום הציר", "לתרגום ולרד״ק ״הפתות״ הם צירי הדלתות. רלב״ג: ״והפותות לדלתות הבית. ר״ל מה שיכנס ציר הדלת בו שהוא מחובר לדלת, הנה זה היה בדביר ובהיכל מזהב״; וכן מצודת ציון — המקום שבו מוצבים הצירים.\nבמודל: הצירים העגולים של זהב, בראש כל דלת ובתחתיתה. המפתחות אינם מוצגים.", null]
              ],
              current: pt.current || "rashi",
              onPick: (k) => { pt.set(k); },
              // 1.3.6: close to the key (Rashi) or to the lower pivot (the Targum and Radak) - the general view of the doorway showed neither
              fly: (k) => {
                const v = typeof pt.view === "function" ? pt.view(k) : null;
                if (v && v.pos && v.target) fly(v.pos, v.target);
                else flyView(ctx.shared.flyPoints && ctx.shared.flyPoints.heichalDoor ? "heichalDoor" : "kodesh");
              }
            });
          }
        }
        // 1.2.0 (the user): what lay in the ark and how - ctx.shared.arkLayout (55-interior.js): R. Meir / R. Yehuda, Bava Batra 14a-b
        // ARK_PLACE_D (fix-d, 22.11.2026 - the user's decisions 131 ג and 137): the ark's place in the devir - ctx.shared.arkPlace (55-interior.js)
        if (ctx.shared.arkPlace) opRow({
          id: "d3", short: "מקום הארון", cardFly: true, chips: { middle: "באמצע — ירושלמי ורש״י", west: "צמוד למערב — הרמב״ם" },
          cap: "מקום הארון בקודש הקדשים",
          refs: [["ירושלמי בבא בתרא ו, ב", { book: 172, index: 187 }], ["רש״י יומא כא.", { book: 2157, index: 711 }], ["רמב״ם בית הבחירה ד, א", RB(4, 1)], ["רשב״ם בבא בתרא צט.", { book: 1959, index: 3439 }], ["מעשי למלך בית הבחירה ד, א", { book: 4304, index: 303 }], ["רלב״ג דברי הימים ב ג, י", { book: 3639, index: 63 }], ["מלכים א ח, ז", V(10, 8, 7)]],
          options: [
            ["middle", "באמצע — הירושלמי ורש״י", "הירושלמי (בבא בתרא ו, ב): 'ארון עומד באמצע וחולק הבית עשר אמות לכל רוח'; רש״י (יומא כא.): 'ארון שעשה משה יש לו עשר אמות אויר לכל רוח כשניתן באמצע בית הכפורת'.\nבמודל (ברירת המחדל): הארון ואבן השתייה באמצע קודש הקדשים, עשר אמות לכל רוח; הכרובים הגדולים משני צדיו, וכנפיהם מכותל לכותל מעליו (מלכים א ח, ז); הבדים מכותל המערב ועד הפרוכת."],
            ["west", "צמוד לכותל המערב — הרמב״ם כרשב״ם", "הרמב״ם (בית הבחירה ד, א): 'אבן היתה בקדש הקדשים במערבו שעליה היה הארון מנח'; וכן רשב״ם (בבא בתרא צט.): 'כשניתן בבית קדשי הקדשים שעשה שלמה שהוא כ׳ על כ׳ יש לו עשר אמות ריוח לכל רוח ורוח לימינו ולשמאלו הרי עשרים בלא ארון ולפניו כ׳ עד הדביר'.\nרלב״ג (דברי הימים ב ג, י): 'והנה היו הכרובים עומדים על רגליהם לשני צדדי הארון והיו אחוריהם דבקים לקיר המערבי שבקדש הקדשים ופניהם היו לצד הבית'.\nבמודל: אבן השתייה נוגעת בכותל המערב, והארון עליה; הכרובים משני צדיו, אחוריהם אל הכותל, כרלב״ג. הבדים — כבשיטה הראשונה.\nולריצב״א, כפי שמביא המעשי למלך (על הרמב״ם שם): 'אבל מקום הארון ששכינה שם... הי׳ במזרח בית קד״ק' — שיטה שלישית, שאינה מצוירת."]
          ],
          current: ctx.shared.arkPlace.current === "west" ? "west" : "middle",
          onPick: (k) => { ctx.shared.arkPlace.set(k); },
          fly: () => { const x = typeof ctx.shared.arkX === "number" ? ctx.shared.arkX : -54; fly([x + 10.5, 19, 4.5], [x + 1, 14, 0]); }
        });
        {
          const al = ctx.shared.arkLayout;
          if (al && typeof al.set === "function" && Array.isArray(al.keys)) {
            opRow({
              id: "arkLayout", short: "מה שבארון", cardFly: true, chips: { meir: "רבי מאיר", yehuda: "רבי יהודה" },
              cap: "מה היה מונח בארון",
              refs: [["בבא בתרא יד.", P(124, "יד.")], ["בבא בתרא יד:", P(124, "יד:")], ["מלכים א ח, ט", V(10, 8, 9)], ["דברים לא, כו", { book: 5, index: 890 }]],
              options: al.keys.map((k) => [k, String(al.names[k] || k), String(al.info[k] || ""), null]),
              current: al.current || "meir",
              onPick: (k) => { al.set(k); },
              // NOTE 11 (the function review, F2-04): both chips flew to one eye over the closed cover - R. Meir's scroll is inside the
              // ark, R. Yehuda's chest stood at the picture's top edge. Now the row opens the ark for its while (as a chamber's place opens
              // its roof) and looks from a little further east and higher, the chest beside the ark inside the frame
              fly: () => { try { if (typeof openPill20 === "function") openPill20("arkInside"); } catch (_) {} if (ctx.shared.flyPoints && ctx.shared.flyPoints.arkInside) fly([(typeof ctx.shared.arkX === "number" ? ctx.shared.arkX : -58.5) + 4.7, 18.6, 2.2], [(typeof ctx.shared.arkX === "number" ? ctx.shared.arkX : -58.5) + 0.2, 12.8, 0.1]); else flyView("kodeshHakodashim"); }   // ARK_PLACE_D: from the ark's place
            });
          }
        }
        // 3. the place of the Sea (I Kings 7:39)
        // YEHOYADA_ONE_211 (the sources review, S4-18; the user, 15.11.2026 18:12 "להוסיף מתג לרשי", 18:21 "2. ארון יהיודע"): the Malbim's two
        // chests (the default, as until now) or Rashi's one. Rashi (II Chr 24:8; 3662:739-740; II Kings 12:10; 3680:446) does not say in
        // one place where the one chest stood - each verse has its own word. The user decided (15.11.2026 23:23, "ארון יהוידע לרשי תעשה איפה
        // שהתקלין חדתין של המלבים"): Rashi's one chest stands where the Malbim's chest for the new coins stands - by the altar, as the verse
        // in Kings and Rashi there. The option "בשער" was taken out (20-mount.js still knows the mode "gate"; nothing picks it).
        {
          const yh = ctx.shared.yehoyada;
          const RQ = "רש״י (דברי הימים ב כד, ח): ״ויעשו ארון אחד. ובמלכים כתיב ויקב חור בדלתו; על ידי אותו חור היו זורקין בארון ההקדשות ולא לפתוח הדלת, פן יבא רמאי ויגנוב ממנו״ — הארון שבדברי הימים הוא הארון שבמלכים.\nמקומו: בדברי הימים — ״ויתנהו בשער בית ה׳ חוצה״, ורש״י: ״כדי שיוכלו לבא אליו כל נדיב לב לתת בו את תרומת ה׳״; ובמלכים (ב יב, י) — ״ויתן אתו אצל המזבח מימין בבוא איש בית ה׳״, ורש״י: ״אצל המזבח. בעזרה״. איך מתיישבים שני המקומות בארון אחד — רש״י לא פירש שם.\n";
          opRow({
            id: "yehoyadaChests", short: "ארון יהוידע",
            cap: "ארון יהוידע — שניים או אחד",
            refs: [["מלכים ב יב, י", V(11, 12, 10)], ["דברי הימים ב כד, ח", V(39, 24, 8)], ["רש״י דברי הימים ב כד, ח", { book: 3662, index: 739 }], ["רש״י מלכים ב יב, י", { book: 3680, index: 446 }], ["מלבי״ם מלכים ב יב, י", { book: 3379, index: 449 }], ["מלבי״ם דברי הימים ב כד, ח", { book: 3364, index: 652 }]],
            options: [
              ["two", "מלבי״ם — שני ארונות", "המלבי״ם: שני ארונות היו — האחד שבמלכים (ב יב, י), ״ויתן אתו אצל המזבח מימין בבוא איש בית ה׳״, והאחר שבדברי הימים (ב כד, ח), ״ויתנהו בשער בית ה׳ חוצה״. לשונו — בכרטיסי שני המקומות, ״ארון יהוידע אצל המזבח״ ו״ארון יהוידע שבשער״.\nבמודל — ברירת המחדל: שני הארונות. הם מוצגים כשבוחרים באחד משני המקומות, או בכפתור שעל המודל; צורת הארון ומקומו המדויק — בחירת מודל."],
              ["altar", "רש״י — ארון אחד, אצל המזבח", RQ + "במודל, באפשרות זו: ארון אחד, אצל המזבח, בעזרה — כלשון מלכים (ב יב, י), ורש״י שם: ״אצל המזבח. בעזרה״. הוא עומד במקום שבו עומד, לשיטת המלבי״ם, הארון ״לתקלין חדתין״. ההכרעה כלשון מלכים, ולא כלשון דברי הימים — בחירת מודל."]
            ],
            current: "two",
            onPick: (k) => { if (yh && typeof yh.setMode === "function") { yh.setMode(k); yh.set(true); } },
            fly: (k) => { try { if (k === "altar") fly([80.5, 12.5, 1.5], [70, 6.7, -8]); else { const t = oci("ארון", OCI_FB.aron), c = ociCam("ארון", OCI_FB.aron, 14); fly(c, t); } } catch (_) {} },
            disabled: !(yh && typeof yh.setMode === "function")
          });
        }
        seaRow = opRow({
          id: "seaPlacement", short: "מקום הים", cardFly: true, chips: { rashi: "רש״י: מזרחית צפונית", radak: "רד״ק ומצודות: מזרחית דרומית" },
          cap: "מקום הים",
          refs: [["מלכים א ז, לט", V(10, 7, 39)], ["רש״י שם", V(10, 7, 39)], ["דברי הימים ב ד, י", V(39, 4, 10)]],
          options: [
            ["rashi", "רש״י — קרן מזרחית צפונית", "הפסוק: 'ואת הים נתן מכתף הבית הימנית קדמה ממול נגב' (מלכים א ז, לט).\nרש״י: 'משוך מצד דרום לצד צפון, וזה קדמה מול נגב, מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה'.\nבמודל: **בקרן המזרחית הצפונית של העזרה**, ממזרח לצפון בית המטבחים, כציור 'מקרא מפורש' ומפתו, מול הננסין — ממזרח להם. ברירת המחדל."],
            ["radak", "רד״ק ומצודות — קרן מזרחית דרומית", "מצודת דוד (ז, לט): 'משוך כלפי מקצוע מזרחית דרומית שבעזרת כהנים'. רד״ק: 'נתן הים בעזרה לצד דרום משוך כלפי מזרח'. רלב״ג: 'הים היה לפאת מזרחי דרומי שבחצר הכהנים'.\nרש״י (דברי הימים ב ד, י): 'רחק אותו מן המזרח מן כנגד הפתח לדרומה של עזרה, לפי שאין כבוד ונאה שיהו מטבילין כנגד פתח האולם'.\nבמודל: **בקרן המזרחית הדרומית**."]
          ],
          current: sp && sp.current || "rashi",
          onPick: pickSea,
          fly: () => fly(uiSeaCam(), uiSeaTg()),   // 1.0.1-L (Part 7, U4): from above, both readings
          disabled: !(sp && typeof sp.set === "function")
        });
        // 4. the arrangement of the tables and the menorot (Menachot 98b)
        layoutRow = opRow({
          id: "kodeshLayout", short: "סידור הכלים", chips: { rabbi: "רבי — מזרח ומערב", rashbash: "ר׳ אלעזר בר״ש: צפון ודרום" },
          cap: "סידור השולחנות והמנורות",
          refs: [["רלב״ג ז, מט", { book: 3645, index: 312 }], ["מנחות צח:", P(131, "צח:")], ["מנחות צט.", P(131, "צט.")], ["רמב״ם בית הבחירה ג, יב", RB(3, 12)]],
          options: [
            ["rabbi", "רבי — מזרח ומערב", "בגמרא — מנחות צח:: רבי אומר — השולחנות (והמנורות) מונחים מזרח ומערב, כלומר אורכם לאורך הבית. כולם בחצי הפנימי של ההיכל, השולחנות בצפון והמנורות בדרום, של משה באמצע — בשתי שורות של חמישה (צט.), ושולחן משה משוך מערבה 'כתלמיד היושב לפני רבו'. הרמב״ם (בית הבחירה ג, יב) פוסק כך לשולחן.\nרלב״ג: המנורות משוכות מערבה מן השולחנות — 'הנה מפני שהשולחנות הם גם כן לפני הדביר ולא זכר זה אלא במנורות ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות' (מלכים א ז, מט), וכציור הספר.\nבמודל: **שולחן משה ומנורת משה בראש השורות**, ראשם מול האוויר שבין החמישה לחמישה (מנחות צט.; רש״י: 'משוך לצד מערב וראשו מכוון כנגד אויר שבין שתי השורות') — כגמרא. השיעור שהמנורות משוכות, אמה אחת — בחירת מודל. ברירת המחדל."],
            ["rashbash", "רבי אלעזר ברבי שמעון — צפון ודרום", "בגמרא — מנחות צח:: רבי אלעזר ברבי שמעון אומר — צפון ודרום, כלומר אורך השולחנות לרוחב הבית, כארון.\nהתוספות: שני טורים של חמישה מכותל צפון עד אמצע הבית ושולחן משה ביניהם — 'שתי אמות ומחצה ממנו לשורה החיצונה ושתי אמות ומחצה ממנו לשורה הפנימית ומשוך מכותל צפוני שתי אמות ומחצה' (תוספות מנחות צח:), וארכו לאורך הבית — 'ששלחן משה הכל מודים בו שארכו לאורך הבית ורחבו לרחב הבית' (מאירי יומא נא:).\nרלב״ג: המנורות משוכות מערבה מן השולחנות — 'הנה מפני שהשולחנות הם גם כן לפני הדביר ולא זכר זה אלא במנורות ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות' (מלכים א ז, מט), וכציור הספר.\nבמודל: **המנורות כנגדם בדרום, וקניהן צפון ודרום**; השיעור, אמה אחת — בחירת מודל."]
          ],
          current: kl && kl.current || "rabbi",
          onPick: pickLayout,
          fly: () => { fly([-14, 36, 4], [-34, 16, 0]); },   // inside the closed kodesh (x -43.5..-3.5, |z| < 10, y 12..42)
          disabled: !(kl && typeof kl.set === "function")
        });
        // 5. lighting and the bread (Menachot 99a)
        opinionRow = opRow({
          id: "kodeshOpinion", short: "הדלקה וסידור הלחם", chips: { tk: "תנא קמא: בשל משה", rebs: "רבי אלעזר בן שמוע — בכולן" },
          cap: "הדלקת המנורות וסידור הלחם",
          refs: [["מנחות צט.", P(131, "צט.")], ["מלכים א ז, מט", V(10, 7, 49)], ["רד״ק שם", V(10, 7, 49)], ["רש״י מנחות צט. (על כולן)", { book: 2186, index: 4706 }]],
          options: [
            ["tk", "תנא קמא — בשל משה בלבד", "בגמרא — מנחות צט.: 'עשר מנורות עשה שלמה ולא היו מדליקין אלא בשל משה'; וכך על השולחנות: 'לא היו מסדרין אלא על של משה' (רבי יוסי ברבי יהודה).\nבמודל: **דולקת רק מנורת משה, והלחם רק על שולחנו**; עשרת השולחנות עומדים בלא לחם — כולם בתבנית שולחן משה, עם הסניפין, הקנים והבזיכין (כציור הספר). ברירת המחדל."],
            ["rebs", "רבי אלעזר בן שמוע — בכולן", "בגמרא — מנחות צט.: רבי אלעזר בן שמוע אומר — 'על כולם היו מסדרין... ובכולן היו מדליקין'; כך גם רד״ק (מלכים א ז, מט) כפשט הפסוקים.\nרש״י (מנחות צט.): 'על כולן היו מסדרין — פעמים בזה פעמים בזה' — כלומר, לא על כולם בבת אחת, אלא פעם על שולחן זה ופעם על שולחן אחר.\nבמודל: **כל אחת עשרה המנורות דולקות, והלחם על כל השולחנות** — כולם יחד."]
          ],
          current: ko && ko.current || "tk",
          onPick: pickOpinion,
          fly: () => flyView("menorot"),
          disabled: !(ko && typeof ko.set === "function")
        });
        // ALTAR2_D (fix-d, 22.11.2026 - the user's decision 141 ב): the golden altar's width - ctx.shared.goldAltarSize (55-interior.js)
        if (ctx.shared.goldAltarSize) opRow({
          id: "d2", short: "מזבח הזהב — רוחבו", cardFly: true, chips: { rambam: "אמה על אמה — הרמב״ם", gra: "שתיים על שתיים — הגר״א" },
          cap: "מזבח הזהב — רוחבו",
          refs: [["רמב״ם בית הבחירה ג, יז", RB(3, 17)], ["הר המוריה בית הבחירה ג, יז", { book: 5474, index: 167 }], ["שמות ל, ב", V(2, 30, 2)], ["מלכים א ו, כ", V(10, 6, 20)]],
          options: [
            ["rambam", "אמה על אמה — הרמב״ם", "הרמב״ם (בית הבחירה ג, יז): 'מזבח הקטרת היה מרבע אמה על אמה'.\nבמודל (ברירת המחדל): אמה על אמה, וגובהו שתי אמות — 'ואמתים קמתו' (שמות ל, ב)."],
            ["gra", "שתיים על שתיים — הגר״א", "הר המוריה (על הרמב״ם שם), בשם הגר״א על מלכים א ו, כ: 'והגר״א כתב שם שהוסיף עוד אמה יעו״ש וא״כ היה ב׳ אמות ארכו (ורחבו איני יודע כמה ולכאורה מראייתו שהביא דהמקדש היה כפול ממשכן משמע דהיה ב׳ על ב׳ וצ״ע) וזה שלא כדברי רבינו וצ״ע'. פירוש הגר״א על מלכים עצמו אינו בספרייה.\nבמודל: שתי אמות על שתי אמות — והרוחב אינו ודאי, כלשון הר המוריה ״ורחבו איני יודע כמה... וצ״ע״; הגובה שתי אמות, כבשיטה הראשונה. הקרנות והזר גדלים עם המזבח — בחירת מודל."]
          ],
          current: ctx.shared.goldAltarSize.current,
          onPick: (k) => { ctx.shared.goldAltarSize.set(k); },
          fly: () => flyView("incenseAltar")
        });
        // TRAKSIN_130_D (fix-d, 22.11.2026 - the user's decision 130 א): the amah traksin - besides the twenty or inside the sixty -
        // ctx.shared.traksin (55-interior.js); its default (Rashi) is set at the end of the panel's building (buildUI.after-tg)
        if (ctx.shared.traksin) opRow({
          id: "d6", short: "אמה טרקסין", cardFly: true, chips: { rashi: "נוספת — רש״י", rambam: "מתוך הששים — הרמב״ם" },
          cap: "אמה טרקסין — נוספת על עשרים הדביר, או מתוך ששים אמות הבית",
          refs: [["מלכים א ו, כ", V(10, 6, 20)], ["רש״י ו, כ", { book: 3673, index: 261 }], ["רש״י ו, טז", { book: 3673, index: 246 }], ["יומא נב.", { book: 107, index: 1326 }], ["יומא נב. (חללא קא חשיב)", { book: 107, index: 1327 }], ["רמב״ם בית הבחירה ד, ב", { book: 337, index: 63 }]],
          options: [
            ["rashi", "רש״י — הדביר עשרים שלמות, והאמה נוספת", "רש״י (מלכים א ו, כ): ״ולפני הדביר. לפנים מאותה מחצה, חלל של עשרים ארך, ושל עשרים רחב״; ובפסוק טז: ״מבית לדביר. לפנים ממחצת אמה טרקסין, המפסקת בין ארבעים לעשרים, ואותה מחצה קרויה דביר״. ובגמרא (יומא נב.): ״ודילמא לא מהני עשרין ולא מהני ארבעין, וחללא קא חשיב, כותלים לא קא חשיב״.\nבמודל (ברירת המחדל): ההיכל ארבעים, אמה טרקסין, והדביר עשרים שלמות — אורך הבית מבפנים שישים ואחת; כותל המערב וכל מה שממערב לדביר (התאים, הלולים, הגג והעליות) זזים אמה מערבה."],
            ["rambam", "הרמב״ם — האמה מתוך ששים אמות הבית", "הרמב״ם (בית הבחירה ד, ב): ״בבית ראשון היה כתל מבדיל בין הקדש ובין קדש הקדשים עביו אמה. וכיון שבנו הבית שני נסתפק להם אם עבי הכתל היה ממדת הקדש או ממדת קדש הקדשים״ — האמה בתוך ששים אמות הבית; ובגמרא (יומא נב.): ״ולא ידעינן אמה טרקסין אי מהני עשרים, ואי מהני ארבעים״.\nבמודל: האמה נלקחה מן הדביר (תשע עשרה אמות חלל) — מאיזה משני החדרים נלקחה הוא ספק, והבחירה בדביר — בחירת מודל."]   // QUOTES_Q: יומא נב. (107:1326): 'ארבעים'; רמב״ם בית הבחירה ד, ב (337:63): 'הקדש', 'קדש הקדשים'; רמב״ם בית הבחירה ד, ב (337:63)
          ],
          current: "rashi",   // set so at the end of the building (buildUI.after-tg)
          onPick: (k) => { ctx.shared.traksin.set(k); },
          fly: () => { try { setCutaway(false); ctx.shared.sectionFor("z", 0, 15000); } catch (_) {} fly([-48, 26, 62], [-48, 22, 0]); }
        });
        // SLOPE2_D (fix-d, 22.11.2026 - the user's decision 145 א): the house's floor - ctx.shared.floorSlope (55-interior.js)
        if (ctx.shared.floorSlope) opRow({
          id: "d5", short: "רצפת ההיכל", cardFly: true, chips: { rashi: "משופעת — רש״י", rambam: "שטוחה — הרמב״ם" },
          cap: "רצפת ההיכל — משופעת או שטוחה",
          refs: [["מנחות צט.", P(131, "צט.")], ["רש״י מנחות צט.", { book: 2186, index: 4703 }], ["רמב״ם בית הבחירה ו, ד", { book: 337, index: 97 }], ["כפתור ופרח פרק ו", { book: 7576, index: 244 }], ["תורת העולה א, ז", { book: 3167, index: 298 }]],
          options: [
            ["rashi", "משופעת — רש״י", "רש״י (מנחות צט.): 'כתלמיד היושב לפני רבו — נמוך הימנו, כך אותם של שלמה נמוכין משל משה, דבית המקדש היה משופע ולצד מערב מגביה יותר'.\nבמודל (ברירת המחדל בבית ראשון): רצפת ההיכל והדביר עולה מן הפתח אל המערב ארבע אמות, והכלים, הארון והכרובים עומדים עליה; פתח הדביר עולה עם הרצפה. שיעור השיפוע — בחירת מודל."],
            ["rambam", "שטוחה — הרמב״ם", "הרמב״ם (בית הבחירה ו, ד): 'והאולם וההיכל כלו בשוה'; כפתור ופרח: 'והאולם וההיכל הכל שוה ובמישור'; תורת העולה (חלק א, פרק ז): 'עד שהגיעו לאולם שהיה עם ההיכל בשוה במישור ההר'.\nבמודל: רצפת ההיכל והדביר שטוחה, בגובה הפתח; פתח הדביר יורד עמה."]
          ],
          current: ctx.shared.floorSlope.current,
          onPick: (k) => { ctx.shared.floorSlope.set(k); },
          fly: () => { try { setCutaway(false); ctx.shared.sectionFor("z", 0, 15000); } catch (_) {} fly([-33, 24, 58], [-33, 23, 0]); }
        });
        // 6. the devir doorway: Rashi's two explanations of "מזוזות חמישית" (I Kings 6:31) - ctx.shared.devirDoor (55-interior.js)
        opRow({
          id: "devirDoor", short: "פתח הדביר", chips: { pent: "רש״י: חמש צלעות", five: "רש״י: מפתן, מזוזות ומשקוף" },
          cap: "פתח הדביר",
          refs: [["מלכים א ו, לא", V(10, 6, 31)], ["רש״י שם", V(10, 6, 31)], ["רד״ק שם", V(10, 6, 31)], ["מדות ב, ג", MI(2, 3)]],
          options: [
            ["pent", "רש״י, ״ואני אומר״ — חמש צלעות", "רש״י: 'ואני אומר, מזוזות חמישית, חמשה צלעות היו למזוזות, ולא היתה מרבעת, ואינו מדבר לא במפתן ולא במשקוף, שלא מצינו מפתן ומשקוף קרויין אילים'.\nבמודל: **מזוזות מחומשות** — צלע אחת כעובי הכותל והקודקוד שכנגדה אל הפתח — ומעליהן משקוף זהב בחתך המזוזות, כציור הספר: רד״ק: 'האיל הוא הסף העליון... וכן האיל'; רלב״ג: 'שהאיל והוא הסף אשר על הפתח'; מלבי״ם: 'האיל ר״ל המשקוף'; רש״י אינו מדבר בו — המשקוף בחירת מודל. ברירת המחדל."],
            ["five", "רש״י, ״כך שמעתי״ — מפתן, מזוזות ומשקוף", "רש״י: 'המפתן האחד, והמזוזות מכאן ומכאן שתים, הרי שלש, והמשקוף שעליו עשוי כשתים — כזה; כך שמעתי'.\nבמודל: **מפתן, שתי מזוזות מרובעות, ומשקוף משתי קורות** המוטות זו על זו מעל הפתח (כשער הטדי, 'שתי אבנים מטות זו על גב זו', מדות ב, ג) — צורת הציור האבוד 'כזה' היא בחירת מודל.\nבקצרה — עוד שיטות: רד״ק — 'חמש צלעות זו לפנים מזו'; רלב״ג ומלבי״ם — הפתח החמישי שבמקדש."]
          ],
          current: dd && dd.current || "pent",
          onPick: (k) => { if (dd && typeof dd.set === "function") dd.set(k); },
          // 1.3.5 (the full scan: the eye ended inside the cloud, at the doorway itself): as the place - centred before the doorway, the
          // incense smoke off and the five sides lit for 15 s
          fly: () => {
            const it = placeItemByT["פתח הדביר (מזוזות חמישית) — שני ביאורי רש״י"];
            if (it && it.feature) { try { autoOff.run(it.feature); } catch (_) {} }
            flyView("devirDoor");
          },
          disabled: !(dd && typeof dd.set === "function")
        });
        // 7. the faces of the cherubim (II Chr 3:13; Bava Batra 99a) - ctx.shared.cherubPose (55-interior.js)
        opRow({
          id: "cherubPose", short: "פני הכרובים", chips: { rashi: "רש״י", radak: "רד״ק ומצודות", tzidud: "בבא בתרא: מצדדין" },
          cap: "פני הכרובים",
          refs: [["דברי הימים ב ג, יג", V(39, 3, 13)], ["רש״י שם", V(39, 3, 13)], ["רד״ק מלכים א ו, כז", V(10, 6, 27)], ["בבא בתרא צט.", P(124, "צט.")]],
          options: [
            ["rashi", "רש״י — ראשם כפוף זה אל זה", "רש״י (דברי הימים ב ג, יג): 'ופניהם לבית — לפנים, שלא היו ראשיהם זקופים שנראה כמביטין לחוץ, אלא ראשם היה כפוף ומביטין לפניהם... פונים היו ראשם זה כנגד זה, וגם ראשיהם כפופים לבית כלפי פנים'.\nבמודל: **הגוף פונה מזרחה, הראש מוטה אל הכרוב השני וכפוף**. ברירת המחדל."],
            ["radak", "רד״ק ומצודות — פניהם מזרחה", "רד״ק (מלכים א ו, כז): 'כי פניהם כנגד ההיכל, כמו שאומר בדברי הימים ופניהם לבית'; וכן מצודת דוד על דברי הימים ב ג, יג.\nבמודל: **פנים ישרות אל ההיכל, מזרחה**."],
            ["tzidud", "בבא בתרא — מצדדין פניהם", "בגמרא — בבא בתרא צט.: 'ולמאן דאמר ״ופניהם לבית״, הא כתיב: ״ופניהם איש אל אחיו״! דמצדדי אצדודי – דתניא, אונקלוס הגר אמר: כרובים – ״מעשה צעצעים״ הן, ומצודדים פניהם כתלמיד הנפטר מרבו'.\nבמודל: **הראשים מוטים כמחצית הדרך זה אל זה**."]
          ],
          current: cpz && cpz.current || "rashi",
          onPick: (k) => { if (cpz && typeof cpz.set === "function") cpz.set(k); },
          fly: () => flyView("cherubim"),
          disabled: !(cpz && typeof cpz.set === "function")
        });
        // 1.0.1-L (A5, A6): בית המטבחים, its three layouts - ctx.shared.slaughterLayout (30-courts.js), the words from verify-part5-court.md FOR-UI 1
        {
          const sl = ctx.shared.slaughterLayout, slNames = (sl && sl.names) || {};
          opRow({
            id: "slaughterLayout", short: "בית המטבחים", chips: { book: "כציור הספר", meiri: "המאירי", raavyah: "הראבי״ה", gra: "הגר״א" },   // SLAUGHTER_SPLIT_211: the Ra'avyah's and the Gra's readings apart (one option, "oneRow", until 1.4.3)
            cap: "בית המטבחים",
            refs: [["מדות ג, ה", ui_MI(3, 5)]],
            options: [
              ["book", slNames.book || "כציור הספר — חתיכת ארז על כל עמוד", "ברטנורא: על כל עמוד חתיכת ארז — 'ורביעין של ארז. חתיכות מרבעות של ארז היו על העמודים' (ברטנורא מדות ג, ה), ובה האונקליות.\nבמודל: **שתי שורות**, כציור הספר — 'בד׳ שורות מצפון לדרום, וכל שורה של ב’ ב'' (צורת בית המקדש לתפארת ישראל).", [["ברטנורא מדות ג, ה", { book: 643, index: 146 }], ["צורת בית המקדש", { book: 6029, index: 99 }]]],
              ["meiri", slNames.meiri || "המאירי — קורות מעמוד לעמוד", "המאירי: 'רביעים של ארז ר”ל כעין קורות קצרות באים מעמוד לעמוד', ושלושת הסדרים: 'ר”ל על כל אחד מן הרביעים והם בשני הצדדים ושטח התחתון' (מאירי על מדות ג, ה). וכן 'קורות של ארז. על גביהן. מזו לזו' (קובץ שיטות קמאי על תמיד).\nועמוד האבן נמוך הרבה מקומת אדם — יכין (מידות ג, נד): 'שמנה עמודים ננסין ר״ל עמודי אבן שנמוכין כננסין, הרבה פחות מקומת איש המפשיט'; רבינו שמעיה (מידות ג, ה): 'ח׳ עמודים ננסים קצרים ולא גבוהים'.\nבמודל: עמוד אבן נמוך, אמה וארבעה חומשים (כבשיטת הספר), והקורות עליו לאורך שתי השורות — בחירת מודל.", [["מאירי על מדות ג, ה", { book: 6033, index: 50 }], ["קובץ שיטות קמאי על תמיד", { book: 7582, index: 1040 }], ["יכין מדות ג, נד", { book: 819, index: 421 }], ["רבינו שמעיה מדות ג, ה", { book: 645, index: 106 }]]],   // MEIRI_LOW_D (fix-d, 143)
              ["raavyah", slNames.raavyah || "הראבי״ה — שורה אחת ממזרח למערב, והשולחנות לפניה", "הראבי״ה: 'ונראה שלא היו העמודים וכן השלחנות. מסודרים זה אצל זה. ארבע שורות של ב' ב' מסודרין זה אחר זה. כזה. אלא כל דממזרח למערב עמודים ח'. שלחנות שמנה' (ראבי״ה בתוספות יום טוב מדות ג, ה).\nהרש״ש: 'להראבי״ה משמע דהעמודים הי' בסדר אחד ממזרח למערב וכן השלחנות לפניהם' (רש״ש מדות ג, ה).\nבמודל: **שמונה העמודים בשורה אחת ממזרח למערב, ושמונה השולחנות בשורה משלהם לפניהם** — ארבע אמות מן הטבעות וארבע מן העמודים ('מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע', מדות ה, ב). המרחק שבין עמוד לעמוד וגודל השולחנות — בחירת מודל.", [["תוספות יום טוב מדות ג, ה", { book: 948, index: 133 }], ["רש״ש מדות ג, ה", { book: 750, index: 51 }], ["מדות ה, ב", { book: 89, index: 37 }]]],
              ["gra", slNames.gra || "הגר״א — שורה אחת מצפון לדרום, שולחן בין עמוד לעמוד", "הגר״א: 'כי שמונה ננסין היו. נמצא היו ז' אוירים וכנגד כל אויר היה שולחן הרי ז' שולחנות ושולחן הח' הי' עמוד אצל הננס שבקצה מבחוץ ואות' השולחן היה ד' אמות וכל השולחנות היו עומדים בשורה אחת... הרי מן מקום שהתחילו השולחנות עד שהתחילו הננסין ד' אמות דהיינו כאורך השולחן' (ביאור הגר״א מדות ה, ב).\nבמודל: **שורה אחת מצפון לדרום** — תחילה, לצד הטבעות, השולחן השמיני, שאורכו ארבע אמות; ואחריו עמוד, שולחן, עמוד — עד שמונה אמות מכותל העזרה ('מן הננסין לכתל העזרה שמנה אמות', מדות ה, ב). במודל זה נותרו לשורה תשע אמות וחצי, ולכן העמודים דקים והשולחנות שביניהם קצרים; והיא עומדת ממערב ללשכת הגזית. מקום השורה, רוחב השולחנות והצד שבו האונקליות — בחירת מודל.", [["ביאור הגר״א מדות", { book: 7509, index: 67 }], ["מדות ה, ב", { book: 89, index: 37 }]]]
            ],
            current: sl && sl.current || "book",
            onPick: (k) => { if (sl && typeof sl.set === "function") sl.set(k); if (typeof ctx.shared.onkliot === "function") ctx.shared.onkliot(true, true); },   // 1.3.4: the hooks lit
            fly: () => { if (sl && sl.current === "gra") fly([30, 16, -50], [46.5, 8.2, -53]); else flyView("slaughterPlaceClose"); },   // SLAUGHTER_SPLIT_211: the Gra's row runs north-south, west of the hall of hewn stone - from the west
            disabled: !(sl && typeof sl.set === "function")
          });
        }
        // 1.3.5 (the user, 22:08: "את השינויים בלשכת הגזית תעתיק גם לבית ראשון"): the three rows of students before the Sanhedrin - round as
        // the judges' row (Rashi, the default) or straight (the Yad Ramah); ctx.shared.sanhedrinRows (30-courts.js). The row opens the
        // hall's roof for 20 s (the place's own way) - there is nothing to see under it.
        if (ctx.shared.sanhedrinRows) opRow({
          id: "sanhedrinRows", short: "שורות התלמידים", cardFly: true, chips: { round: "רש״י: כעגולה", straight: "יד רמה: פשוטות" },
          cap: "שורות התלמידים שלפני הסנהדרין",
          refs: [["משנה סנהדרין ד, ג", MN(73, 4, 3)], ["משנה סנהדרין ד, ד", MN(73, 4, 4)], ["רש״י סנהדרין לו:", { book: 2180, index: 1777 }], ["רש״י סנהדרין לז.", { book: 2180, index: 1782 }], ["יד רמה סנהדרין לו:", { book: 1957, index: 564 }]],
          options: [
            ["round", "רש״י — אף הן כעגולה", "לשון המשנה (סנהדרין ד, ד): 'ושלש שורות של תלמידי חכמים יושבין לפניהם, כל אחד ואחד מכיר את מקומו'. רש״י (לז.): 'ושלש שורות — כל אחת כמנין סנהדרי עשרים ושלשה'; 'יושבין לפניהן — אף הן כעגולה, אלא שהגדולים יושבין על הספסלין והתלמידים על הקרקע'.\nבמודל (**ברירת המחדל**): שלוש שורות של עשרים ושלושה, כחצי גורן, לפנים משורת הדיינים, יושבים על הקרקע. הרווח שבין השורות — בחירת מודל."],
            ["straight", "יד רמה — שורות פשוטות", "יד רמה (סנהדרין לו:): 'והני שלש שורות של תלמידים משמע דשורות פשוטות היו ולא בעיגול, חדא מדלא קתני בהו עגולות כדקתני גבי סנהדרי'; 'כלומר שעומדין בשורה אחת בשוה זה בצד זה, ואע״פ שלא היו רואין זה את זה לא אכפת לן, מאחר שרואין פני הסנהדרין והסנהדרין רואין את פניהם'.\nבמודל: שלוש שורות ישרות של עשרים ושלושה, זו אחר זו, לפני הדיינים."]
          ],
          current: ctx.shared.sanhedrinRows.mode,
          onPick: (k) => { ctx.shared.sanhedrinRows.set(k); },
          fly: () => { openPill20("crt-gazit-roof"); const t = gazitTop(); fly(t.cam, t.tg); }
        });
        // AMUD2_D (fix-d, 22.11.2026 - the user's decision 132): the king's pillar - a platform (Rashi, the Metzudot, the Targum) or a pillar he
        // stood beside (the Radak, the Ralbag); ctx.shared.amudKing (20-mount.js)
        if (ctx.shared.amudKing) opRow({
          id: "d1", short: "העמוד — מקום המלך", cardFly: true, chips: { bima: "במה — רש״י", side: "עמוד בצדו — רד״ק ורלב״ג" },
          cap: "העמוד — מקום המלך",
          refs: [["מלכים ב יא, יד", V(11, 11, 14)], ["מלכים ב כג, ג", V(11, 23, 3)], ["דברי הימים ב כג, יג", V(39, 23, 13)], ["דברי הימים ב ו, יג", V(39, 6, 13)], ["רש״י דברי הימים ב כג, יג", { book: 3662, index: 709 }], ["רש״י מלכים ב יא, יד", { book: 3680, index: 418 }], ["מצודת דוד מלכים ב יא, יד", { book: 3335, index: 722 }], ["רד״ק מלכים ב יא, יד", { book: 3542, index: 573 }], ["רלב״ג מלכים ב יא, יד", { book: 3644, index: 366 }], ["רד״ק דברי הימים ב לד, לא", { book: 3522, index: 541 }]],
          options: [
            ["bima", "במה — רש״י, מצודות ותרגום", "הפסוק: 'והנה המלך עמד על העמוד כמשפט' (מלכים ב יא, יד).\nרש״י (דברי הימים ב כג, יג): 'ועד היום מנהג כשמועדים יחד, עומד המלך או הדוכוס במקום גבוה כדי שיוכלו לראותו'; (מלכים ב יא, יד): 'הוא מעמד המלך בבית ה׳'. מצודת דוד: 'על מקום מיוחד למלך לעמוד שם'. התרגום: 'אסטונא'.\nבמודל (ברירת המחדל): במה עגולה של אבן, ארבע אמות רוחבה ואמה גובהה, עם שתי מעלות, ועליה עמוד קצר. צורתה ומידותיה — בחירת מודל."],
            ["side", "עמוד שהמלך עומד לידו — רד״ק ורלב״ג", "הפסוק: 'והנה המלך עמד על העמוד כמשפט' (מלכים ב יא, יד).\nרד״ק (מלכים ב יא, יד): 'עומד על העמוד. פי׳ סמוך לעמוד וכן וזבחת עליו סמוך לו'; ובדברי הימים (ב לד, לא): 'רוצ׳ לומ׳ שעמד על רגליו סמוך לעמוד'. רלב״ג (מלכים ב יא, יד): 'עומד על העמוד. ר״ל אצל העמוד'.\nבמודל: עמוד אבן לבדו על רצפת החצר, ובלי במה. צורת העמוד וגובהו (שש אמות) — בחירת מודל."]
          ],
          current: ctx.shared.amudKing.current,
          onPick: (k) => { ctx.shared.amudKing.set(k); },
          fly: () => { const p = oci("עמוד", OCI_FB.amud), c = ociCam("עמוד", OCI_FB.amud, 24); if (p && c) fly(c, p); }
        });
        // 1.3.7 (as the Second Temple model 1.9.5; the user: "9. מקומן אפשרות ג"): the place of the lesser court "על פתח הר הבית" -
        // ctx.shared.lesserPlace (30-courts.js). Every quote from the user's library (Sanhedrin 11:2: book 73, line 78; Rashi 86b:
        // book 2180, line 4632; Rambam Sanhedrin 1:3: book 375, line 5; Meiri 17a: book 2214, line 190).
        if (ctx.shared.lesserPlace) {
          const LP_M = "לשון המשנה (סנהדרין יא, ב): 'שלשה בתי דינין היו שם, אחד יושב על פתח הר הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית'.\n";
          const lpFly = (k) => { openPill20("crt-lesser-roofs"); const L = ctx.shared.lesserCourts || {}, p = (k === "mount" ? L.mount : L.har) || L.azarah || [114, 3, -15]; fly([p[0], p[1] + 31, p[2] + 24], [p[0], p[1] + 2, p[2]]); };
          opRow({
            id: "lesserPlace", short: "מקום הסנהדראות הקטנות", cardFly: true, chips: { rashi: "רש״י: אצל שער החצר החיצונה", mount: "כפשט המשנה: אצל שער הר הבית" },
            cap: "מקום שתי הסנהדראות הקטנות",
            refs: [["משנה סנהדרין יא, ב", { book: 73, index: 78 }], ["רש״י סנהדרין פו:", { book: 2180, index: 4632 }], ["רמב״ם סנהדרין א, ג", { book: 375, index: 5 }], ["מאירי סנהדרין יז.", { book: 2214, index: 190 }]],
            options: [
              ["rashi", "רש״י — אצל השער המזרחי של החצר החיצונה", LP_M + "רש״י (פו:): 'אחד יושב על פתח הר הבית — הוא שער המזרחי שלפנים מן החיל לפני עזרת נשים'; 'ואחד יושב למעלה הימנו — כשעברו עזרת נשים ובאין לפני עזרת ישראל'.\nבמודל (**ברירת המחדל**): בית הדין שעל פתח הר הבית — בלשכה מחוץ לשער המזרחי של החצר החיצונה, מצפון למעלותיו; ובית הדין שעל פתח העזרה — בלשכה שבתוך החצר החיצונה, לפני השער המזרחי של חצר הכהנים, מצפון לדרך אל השער. המשנה ורש״י מדברים בלשון בית שני; העתקת הדבר לחצרות בית ראשון, ומקומן המדויק של הלשכות — בחירת מודל.", null],
              ["mount", "כפשט המשנה — אצל שער הר הבית", LP_M + "הרמב״ם (סנהדרין א, ג): 'ועוד מעמידין שני בתי דינין של עשרים ושלשה עשרים ושלשה אחד על פתח העזרה ואחד על פתח הר הבית'. המאירי (סנהדרין יז.): 'וסנהדרי קטנה היו בירושלים שנים אחד על פתח העזרה ואחד על פתח הר הבית'.\nבשיטה זו 'פתח הר הבית' כפשוטו — אצל שער הר הבית עצמו, ולא כפירוש רש״י. וכך במפורש שערי תורת בבל (סנהדרין פו:): 'אלא שמה ששנינו ״אחד יושב על פתח הר הבית״ היינו מבפנים, וזהו שאמרו בתוס׳ וירוש׳ ״אחד בהר הבית״'. ובתוספתא (סנהדרין ז, א): 'ושני בתי דינין של ג׳ היו בירושלים אחד בהר הבית ואחד בחיל'; ובירושלמי (סנהדרין פרק א): 'ושני בתי דינין של שלשה שלשה היו יושבין אחד בחיל ואחד בהר הבית'. — בתוספתא ובירושלמי מדובר בבתי דין **של שלשה**, וברמב״ם — של עשרים ושלשה.\nבמודל: בית הדין **בלשכה שבתוך הר הבית, אצל השער המזרחי**, מצפון לדרך. איזה משערי הר הבית — לא נתפרש במשנה; בחירת מודל. בית הדין שעל פתח העזרה נשאר לפני שער חצר הכהנים. מקומן המדויק של הלשכות — בחירת מודל.", [["משנה סנהדרין יא, ב", { book: 73, index: 78 }], ["רמב״ם סנהדרין א, ג", { book: 375, index: 5 }], ["מאירי סנהדרין יז.", { book: 2214, index: 190 }], ["שערי תורת בבל סנהדרין פו:", { book: 2590, index: 123 }], ["תוספתא סנהדרין ז, א", { book: 211, index: 43 }], ["ירושלמי סנהדרין פרק א", { book: 173, index: 97 }]]]   // UNVERIFIED_S1 (finding 17: "מי שפירש כך במפורש — לא אומת בספרייה" replaced by the sources found in Otzaria - 2590:123, 211:43, 173:97)
            ],
            current: ctx.shared.lesserPlace.mode,
            onPick: (k) => { ctx.shared.lesserPlace.set(k); },
            fly: lpFly
          });
        }
        // 1.3.7 (the user, 11.11.2026 17:11: "מעלות שתי קריאות רמבם ברירת מחדל"; 17:13: "בבית ראשון, תעשה גם שתי שיטות"): the east
        // gate's steps in the two readings of the Second Temple's fifteen - ctx.shared.eastSteps (30-courts.js). Every quote from the
        // user's library, read there on 11.11.2026: Middot 2:5 (book 89, line 16), the Rambam's commentary (573, line 25), the Rid and
        // R. Yehonatan (7576, lines 355, 353), the Meiri (6033, line 35).
        if (ctx.shared.eastSteps) {
          const ES_M = "לשון המשנה על חמש עשרה המעלות של בית שני (מדות ב, ה): 'וחמש עשרה מעלות עולות מתוכה לעזרת ישראל... לא היו טרוטות, אלא מקפות כחצי גרן עגלה'.\n";
          const esFly = (k) => { const E = ctx.shared.eastSteps, x = E.x, y = E.y; if (k === "rid") fly([x + 52, y + 34, 46], [x + 1, y + 1, 0]); else fly([x + 21, y + 13, 15], [x + 2.5, y + 1.5, 0]); };
          opRow({
            id: "eastSteps", short: "מעלות השער המזרחי", cardFly: true, chips: { rambam: "הרמב״ם: חצאי עיגולים", rid: "הרי״ד: מעלות ארוכות" },
            cap: "מעלות השער המזרחי — צורתן",
            refs: [["מדות ב, ה", MI(2, 5)], ["פירוש המשניות לרמב״ם מדות ב, ה", { book: 573, index: 25 }], ["פסקי הרי״ד סוכה נג.", { book: 7576, index: 355 }], ["רבינו יהונתן סוכה נא:", { book: 7576, index: 353 }], ["המאירי מדות ב, ה", { book: 6033, index: 35 }]],
            options: [
              ["rambam", "הרמב״ם — כל מעלה חצי עיגול, לפני השער", ES_M + "הרמב״ם (פירוש המשניות, מדות ב, ה): 'שמעלות עזרת נשים לא היו ארוכים כשאר המעלות כמו שהוא מפורסם היום מצורת המדרגות אלא היתה כל מעלה כמו חצי עגולה עד שתהא כל מעלה חצי גורן כזה' (הציור שבמקום זה אינו בנוסח שבספרייה), 'ולפיכך היתה צורת המעלה כמי שלקח קצת אצטבא ונתן אותה על המעלה עד שמשלים צורת הסולם וזה אי אפשר לציירו בפשוט אבל יובן בקירוב'.\nבמודל (**ברירת המחדל**): שש מעלות לפני השער המזרחי של חצר הכהנים — שישה חצאי עיגולים, כל אחד מונח על זה שמתחתיו; העליון הוא הקטן, וכל מעלה שמתחתיו רחבה ממנו בחצי אמה. רדיוס המעלה העליונה חמש אמות ומחצה — רוחב השער וחצי אמה מכל צד — ושל התחתונה שמונה. הדברים נאמרו על מעלות בית שני; המעלות בבית ראשון, מספרן, צורתן ומידותיהן — בחירת מודל."],
              ["rid", "הרי״ד ורבינו יהונתן — מעלות ארוכות", ES_M + "פסקי הרי״ד (סוכה נג.): 'וכל מעלה היתה גבוהה חצי אמה ורחבה חצי אמה כדתנן במידות... ואורך המעלה היה קל\"ה אמה כרוחב העזרה מכותל לכותל'. רבינו יהונתן מלוניל (סוכה נא:): 'אורך המעלה כרוחב העזרה, ורוחב המעלה חצי אמה ורומה חצי אמה'.\nהמאירי (מדות ב, ה): 'מוקפות כחצי גורן, שהתחתונה קצרה, והשניה עודפת לה משני קצותיה, וכן שלישית לשניה'.\nהרי״ד ורבינו יהונתן כתבו את אורך המעלות ולא את צורתן; המאירי כתב את צורתן ולא את אורכן. בשיטה זו הן מצוירות יחד.\nבמודל: שש מעלות ישרות לאורך פני חצר הכהנים, בין שתי הלשכות המערביות של החצר החיצונה — העליונה מאה ושלוש עשרה אמה. התחתונה היא הקצרה, וכל מעלה שמעליה עודפת עליה משני קצותיה; קצות המעלות על קשת — כחצי גורן. הדברים נאמרו על מעלות בית שני; המעלות בבית ראשון, מספרן, צורתן ואורכן — בחירת מודל."]
            ],
            current: ctx.shared.eastSteps.mode,
            onPick: (k) => { ctx.shared.eastSteps.set(k); },
            fly: esFly
          });
        }
        // 1.3.7 (the user, 11.11.2026 17:52 "להוסיף שיטה", 18:09 "תוסיף רד"ק"): the height of the Holy of Holies - three readings,
        // ctx.shared.devirHeight (50-heichal.js). Every quote from the user's library, read there on 11.11.2026: Rashi I Kings 6:20
        // (book 3673, line 262), Metzudat David (3345, line 458), Bava Batra 98b (124, line 2324), the Tosafot there (1923, line
        // 1051), the Radak (3540, line 369), Lechem Shamayim on Yoma 5:1 (1094, lines 219, 221).
        if (ctx.shared.devirHeight) {
          const DH_V = "הפסוקים: 'והבית אשר בנה המלך שלמה לה׳ ששים אמה ארכו ועשרים רחבו ושלשים אמה קומתו' (מלכים א ו, ב); 'ולפני הדביר עשרים אמה ארך ועשרים אמה רחב ועשרים אמה קומתו' (ו, כ).\n";
          opRow({
            id: "devirHeight", short: "גובה קודש הקדשים", cardFly: true, chips: { rashi: "רש״י: עשרים", tosafot: "הגמרא והתוספות: שלושים", radak: "רד״ק: שלושים, עשר מהן אבן יקרה" },
            cap: "גובה קודש הקדשים",
            refs: [["מלכים א ו, ב", V(10, 6, 2)], ["ו, כ", V(10, 6, 20)], ["רש״י ו, כ", { book: 3673, index: 262 }], ["מצודת דוד ו, כ", { book: 3345, index: 458 }], ["בבא בתרא צח:", { book: 124, index: 2324 }], ["תוספות בבא בתרא צח:", { book: 1923, index: 1051 }], ["רד״ק ו, כ", { book: 3540, index: 369 }], ["לחם שמים יומא ה, א", { book: 1094, index: 219 }]],
            options: [
              ["rashi", "רש״י — עשרים אמה, ועלייתו נמוכה משל ההיכל", DH_V + "רש״י (ו, כ): 'ועשרים אמה קומתו. כלומר, עלית של בית קדשי הקדשים, נמוכה משל היכל'. מצודת דוד: 'כי ההיכל לבד היתה שלשים אמה, אבל עליית בית קודש הקדשים היתה נמוכה משל היכל י׳ אמות'.\nהיעב״ץ (לחם שמים, יומא ה, א) מקיים את דברי רש״י: 'הרי בבירור שדעתו ז״ל שזהו תכלית גובה העלייה. וכן להיכל תכלית גבהו עם עלייתו שלשים אמה. ואין עוד בגובה ההיכל והדביר בבנין בית ראשון'.\nבמודל (**ברירת המחדל**): תקרת קודש הקדשים בגובה עשרים אמה, ומעליה עלייתו — חדר מצופה זהב ('והעליות חפה זהב', דברי הימים ב ג, ט) — עד תקרת הבית. בשיטת 'מאה ועשרים' שבמתג 'גובה הבית', עליות קודש הקדשים נמוכות בעשר אמות מעליות ההיכל."],
              ["tosafot", "הגמרא והתוספות — שלושים אמה, כהיכל", DH_V + "הגמרא (בבא בתרא צח:): 'רבי חנינא נפק לקרייתא, רמו ליה קראי אהדדי... אמר להו: כי קא חשיב – משפת כרובים ולמעלה'. התוספות שם: 'בפירוש מקרא פרש״י דתקרה דעליית היכל היתה גבוהה משל קדשי הקדשים עשר אמות ולא עיין כאן'. וכן הביא מצודת דוד (ו, כ): 'ורבותינו ז״ל אמרו (בבבא בתרא צח ב): שחושב כאן משפת כרובים ולמעלה, שהיו קומתן י׳ אמות'.\nבמודל: קודש הקדשים שלושים אמה, כהיכל; תקרתו בגובה תקרת ההיכל, ואין תקרה בגובה עשרים. כתליו מצופים זהב עד התקרה ('ואת כל הבית צפה זהב עד תם כל הבית', ו, כב). בשיטת 'מאה ועשרים' עליות קודש הקדשים שוות לעליות ההיכל. גם עשר האמות העליונות מצוירות כעשרים שתחתיהן — אותם כרובים, תמרות ופטורי ציצים, עד התקרה."],
              ["radak", "רד״ק — שלושים אמה; עשר העליונות אבן יקרה", DH_V + "רד״ק (ו, כ): 'ואם נאמר שהדביר היה שפל מן ההיכל הלא כשאמר מדת הבית ששים ארכו הדביר בכלל וגם כן כשאמר ושלשים אמה קומתו הדביר בכלל ויש מפרשים מה שאמר ועשרים אמה קומתו מה שהיה מצופה זהב... כי עשרים אמה בגובה צפה הקירות זהב והעשר אמות העליונות צפה באבן יקרה בלשם שבו ושוהם וספיר ודומיהם מן האבנים הטובות וזהו שאמר בדברי הימים ויצף את הבית אבן יקרה וזה לתפארת... וזהו הפירוש הנכון'.\nבמודל: קודש הקדשים שלושים אמה; עשרים האמות התחתונות של כתליו מצופות זהב, ועשר העליונות מחופות אבן יקרה — לוחות גדולים ומלוטשים של אבנים טובות, כחיפוי של קיר (לא אבנים משובצות). גוני האבנים, גודל הלוחות וסידורם — בחירת מודל. בשיטת 'מאה ועשרים' עליות קודש הקדשים שוות לעליות ההיכל."]
            ],
            current: ctx.shared.devirHeight.mode,
            onPick: (k) => { ctx.shared.devirHeight.set(k); },
            fly: () => fly([-46.3, 19.5, 6], [-60, 30.5, -4])   // one eye for the three readings, its target under the ceiling at 20
          });
        }
        // 8. the House of the Forest of Lebanon (I Kings 7:2-6) - ctx.shared.forestHouse (60-palace.js)
        opRow({
          id: "forestHouse", short: "בית יער הלבנון", cardFly: true, chips: { rashi: "רש״י", metzudot: "מלבי״ם ורלב״ג", mzd: "מצודת דוד" },
          cap: "בית יער הלבנון",
          refs: [["מלכים א ז, ב", V(10, 7, 2)], ["ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["ז, ו", V(10, 7, 6)], ["רש״י ז, ו", V(10, 7, 6)], ["מלבי״ם ז, ב", V(10, 7, 2)], ["רלב״ג ז, ג", V(10, 7, 3)], ["מצודת דוד ז, ב", V(10, 7, 2)]],
          options: [
            ["rashi", "רש״י", "רש״י: 'לארך הבית היה טור עמודים בקרקע, והכרותות מעמוד לעמוד' (ז, ב); על הכרותות 'מחצות עליונות... כלן פתחים וחלונות' ועליהן 45 נסרי הספון, חמישה עשר לכל חלל (ז, ג); 'ושקפים' — 'קרוי של נסרים קטנים, נתונים על מרישין קטנים' (ז, ד); 'ועל כרותות ארזים שעל העמודים התחתונים, הציב על (צריך לומר: עוד) עמודים אחרים, ומרישין מעמוד לעמוד, העמודים לארג בהן צלעות מזה לזה, והעבים לקרוי העליה, עב היא מריש' (ז, ו).\nבמודל, כציור הספר: **ארבעה טורים צפופים לאורך**, הכרותות מעמוד לעמוד, רצפת הקומה העליונה, קירות עליונים ארוגים מעמודים עם פתחים וחלונות, 45 הנסרים, ובסוף הגג מרישין קטנים ועליהם הנסרים הדקים; העב — באולם העמודים בלבד, ואינו נראה; אולם העמודים — 'מבוא לבית' נמוך, ולפניו 'ואולם על פניהם' — 'אולם גבוה עשה על כל הבית'. ברירת המחדל."],
            ["metzudot", "מלבי״ם ורלב״ג", "מלבי״ם: 'העמודים היו נתונים לרוחב הבית וחולקים את אורך הבית לג' חלקים' (ז, ב); 'חלונות של צד הארך מזה מכוונים נגד חלונות של צד הארך השני' (ז, ד); 'הפתחים היו בצד רוחב הבית' (ז, ה); 'לפני הבית והאולם היה עוד אולם ולפני האולם השני היו עמודים ועב על פניהם היינו מריש שהוא עץ עב' (ז, ו).\nרלב״ג: 'חמשה עשר עמודים היו בטור האחד', 'והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה' (ז, ג); אולם העמודים 'גבהו כגבהם' (ז, ו).\nבמודל: **ארבעה טורים לרוחב**, כתלי גזית עם חלונות, 45 הלוחות וגג; אולם העמודים גבוה כעמודים, לפניו אולם שני ולפניו שורת עמודים ועב."],
            ["mzd", "מצודת דוד", "מצודת דוד: 'והשורות ההם עמדו לרוחב הבית, והיה נחלק להם האורך לשלשה חלקים שווים, אבל לאורך הבית היה כתלים ממש, כדרך הבנין' (ז, ב); 'ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה' — 'היה אורך כל לוח ל״ג אמות ושליש אמה, ורוחב הלוחות לרוחב הבית, והיה רוחב כל לוח ג׳ אמות ושליש אמה' (ז, ג); 'עשו שלשה שורות חלונות, זה למעלה מזה' — 'מכוונות זו מול זו' (ז, ד); 'יתכן שהיו שלשה פתחים בכותל מזה, ושלשה בכותל מזה, והחלון מלמעלן, וכל השלשה היו זה מול זה' (ז, ה); 'עשה אולם עומד על עמודי ארזים', 'נסמך לבית היער לפני פתחים, וכדרך בית שער, ועמד ארכו לאורך הבית, להיות מול כל שלשת הפתחים', ו'לפני פתחי האולם הזה, עמדו עמודים תקועים בארץ, וממעל להם עץ עב לחברם יחד' (ז, ו).\nבמודל: **ארבעה טורים לרוחב, כתלי גזית לאורך** ובהם שלוש שורות חלונות זו מול זו ושלושה פתחים מרובעים בכל כותל; אולם העמודים לאורך הצלע המזרחית, מול שלושת הפתחים, ולפניו העמודים והעץ העב. (את ציורו הוא מזכיר, 'ועיין בתחילת קונטרס בנין הבית ובצורה' — אינו בספרייה; המודל לפי דבריו בלבד.)"]
          ],
          current: fh && fh.current || "rashi",
          onPick: (k) => { setLayer("palace", true); if (fh && typeof fh.set === "function") fh.set(k); },
          // 1.0.1-L (L.91, the user: "בית יער הלבנון הבאנר מציג את הבית במקום את אולם העמודים"): the reading's own hall, in each of the three (60-palace.js re-aims it)
          fly: () => { setLayer("palace", true); flyView("forestAlam"); },
          disabled: !(fh && typeof fh.set === "function")
        });
        // ASCENT2_D (fix-d, 22.11.2026 - the user's decision 142 א): the ascent from the king's house - ctx.shared.palaceAscent (60-palace.js)
        if (ctx.shared.palaceAscent) opRow({
          id: "d4", short: "העלייה מבית המלך", cardFly: true, chips: { stairs: "מדרגות — רש״י", almug: "אלמוגים ומעקה — רלב״ג" },
          cap: "העלייה מבית המלך אל בית ה׳",
          refs: [["מלכים א י, ה", V(10, 10, 5)], ["מלכים א י, יב", V(10, 10, 12)], ["דברי הימים ב ט, ד", V(39, 9, 4)], ["דברי הימים ב ט, יא", V(39, 9, 11)], ["רש״י דברי הימים ב ט, יא", { book: 3662, index: 335 }], ["רש״י דברי הימים ב ט, ד", { book: 3662, index: 328 }], ["רלב״ג מלכים א י, יב", { book: 3645, index: 443 }], ["מלבי״ם מלכים א י, יא", { book: 3394, index: 612 }], ["אברבנאל מלכים א ג, ז", { book: 3574, index: 224 }], ["אברבנאל — המסעד", { book: 3574, index: 555 }], ["רד״ק מלכים א י, יב", { book: 3540, index: 666 }]],
          options: [
            ["stairs", "מדרגות אבן — רש״י", "רש״י (דברי הימים ב ט, יא): 'מסלות. מדרגות; ובמלכים (מלכים א י:יב) כתיב ״מסעד״, כדרך שעושין לעולין בדרך מעלות ומדרגות'; ושם (ט, ד): 'ועליתו. מסלות עליותיו אשר יעלה עליהם מביתו לבית ה׳'.\nבמודל (ברירת המחדל): דרך אבן ועשרים מעלות (עשר אמות) משער הארמון הצפוני אל השער הדרומי של החצר הגדולה. מספר המעלות והמרחק — בחירת מודל."],
            ["almug", "עלייה משופעת מעצי אלמוגים, עם מעקה — רלב״ג, מלבי״ם, אברבנאל", "רלב״ג (מלכים א י, יב): 'שבעליה אשר יעלה בה בית ה׳ מבית המלך עשה כדמות מעקה מעצי האלמוגים שיסמך האדם בהם במסלתו בזאת העליה... כי לא היו בהם מעלות לא בכבש המזבח ולא בעליות אשר יעלו בהם אל היציעים'.\nהמלבי״ם (י, יא): 'עליתו שהיה עולה בה לבית ה׳... לפי שהיתה כולה מעצי אלמגים'; אברבנאל: 'העלייה אשר עשה מביתו אל בית השם מעצי אלמוגים', 'והמסעד הנזכר כאן היה העלייה'.\nבמודל: עלייה משופעת בלי מעלות, כולה מעצי אלמוגים, ומעקה משני צדיה, עד משטח קצר לפני השער. השיפוע, המעקה וגוון האלמוגים (עץ אדמדם) — בחירת מודל."]
          ],
          current: ctx.shared.palaceAscent.current,
          onPick: (k) => { setLayer("palace", true); ctx.shared.palaceAscent.set(k); },
          fly: () => { setLayer("palace", true); fly([142, 12, 346], [103, -3, 345]); }
        });
        // 9. Solomon's throne (L.57, L.81, the user: "צור כפתור לכל דעה סותרת"): ctx.shared.throneVersion (60-palace.js), each option in the midrash's own words
        const tver = ctx.shared.throneVersion;
        const tvNames = (tver && tver.names) || {};
        const tvNotes = PN.throneVersions || {};
        throneRow = opRow({
          id: "throneVersion", short: "כסא שלמה",
          cap: "כסא שלמה",
          refs: TH_V.slice(0, 4),
          // 1.0.1-L: the user: the midrash's name on screen is "בית המדרש ב" (a source's link may keep the book's title), whatever the module's list says
          options: ["pesukim", "targumSheni", "estherRabbah", "beitHamidrash"].map((k) => [k, k === "beitHamidrash" ? "בית המדרש ב" : tvNames[k] || k, tvNotes[k] || "", TH_REFS[k]]),
          current: tver && tver.current || "pesukim",
          onPick: (k) => { ctx.shared.throneAuto = false; setLayer("palace", true); if (tver && typeof tver.set === "function") tver.set(k); },   // THRONE_BACK_211: the reader's own choice stays
          fly: () => { setLayer("palace", true); flyView("throne"); },
          disabled: !(tver && typeof tver.set === "function")
//@@end buildUI.sp
//@@begin buildUI.after-tvNotes-note
      // 1.3.5 (the user: "איחוד מתגים וסידורם לפי מצלמה, שלא יהיה קפיצות, כולל הדברים החדשים"): THE TABLE'S ROWS IN THE ORDER OF ONE WALK -
      // from the east of the court (the sea, the Chamber of Hewn Stone, the slaughter place) to the altar, the house from outside, the
      // ulam, the heichal and the devir, and last the king's house: the rows of one place stand together, and the camera of the table
      // (and of the presentation of the readings, 75-tour.js, which goes by this order) does not jump back and forth. A row that is not
      // in the list keeps its place after the listed ones.
      // (the walk order of 1.3.5 lives on inside the groups: OPS_GROUPS_303 below)
      // OPS_GROUPS_303 (the user, 18.11.2026: "שימת המחלוקות מאוד ארוכה, הייתי מציע לחלק אותה לקטגוריות כגון <הר הבית> <עזרת נשים>
      // <לשכות העזרה> <המזבח> וכו'. ע"י כך זה יהיה מסודר יותר ויהיה קל יותר לשימוש"; on the groups proposed: "החלוקה מצוינת תתחיל
      // לעבוד עליה"; a numbering of סימנים and סעיפים: "לא מעניין - בשביל זה יש חיפוש"): THE TABLE IN GROUPS BY PLACE, from outside in.
      // Each group is a closed <details> inside #tm-ops, its title with the number of its rows; inside a group the rows of one place
      // stand together (the order of one walk, 1.3.5). OPS (the readings of the presentation, 75-tour.js) goes by the same order, and
      // every row knows its group (row.group - the line above a reading's slide). A row that no group lists (one added later) is not
      // lost: it stands after the groups, in "עוד". A row of a card only (row.cardOnly) keeps its place in OPS and is not counted.
//@@end buildUI.after-tvNotes-note
//@@begin buildUI.after-GROUPS
          // MENU_149_D (fix-d - the user's decision 149 ג): the groups along the route of the places (from outside in); the first one takes
          // agent C's rows of the City of David by their words, whatever their ids (none yet - an empty group is not shown)
          ["עיר דוד", OPS.filter((r) => r && r.id && /עיר דוד|המלוא|מעי?ין(?! עיטם)|שילוח|גיחון|קברי בית דוד|גן המלך|המצודה/.test(String(r.cap || "") + " " + String(r.short || ""))).map((r) => r.id)],
          ["בית שלמה", ["forestHouse", "throneVersion", "c2", "c3", "c4", "d4"]],
          ["הר הבית והחצרות", ["lesserPlace", "yehoyadaChests", "d1", "eastSteps", "sanhedrinRows", "slaughterLayout"]],
          ["המזבח וכלי הנחושת", ["altarPlace", "seaPlacement", "altarLook", "altarYose", "maarachot", "maarachotYK", "altarKarkov", "altarRTam", "rampGap", "altarRamps", "c1"]],
          ["הבית מבחוץ והיציע", ["ulamRambam", "aliyot", "pillarCapital", "ulamTables", "ulamCeiling", "yatziaShape"]],
          ["הבית מבפנים", ["potot", "d2", "kodeshLayout", "kodeshOpinion", "breadShape", "d6", "devirDoor", "devirHeight", "d3", "cherubPose", "arkLayout", "d5"]],
          ["הכהנים", ["scaleFigure", "priestBelt", "priestGarments", "hpEphod", "hpMitz", "kidReading"]]
//@@end buildUI.after-GROUPS
//@@begin buildUI.after-note-code
        // 1.0.1-L: the pills of this round; what a PLACE switches on goes off by itself (L.27), what a pill switches on stays
        note.textContent = "פתיחה לצפייה (הבית, היציע, האולם, הנסרים, החתכים והשכבות) — בכפתורים שעל המודל עצמו. מה שנפתח מכפתור בלוח חוזר לבד אחרי 15 שניות; ״↺ החזר הכל״ מחזיר את המבט ואת כל המתגים.";   // 1.1.0: short (the long list of the pills is gone from the tree)
//@@end buildUI.after-note-code
//@@begin buildUI.secLay
      // ===== layers =====
      const secLay = document.createElement("div");
      secLay.className = "sec";
      secLay.textContent = "שכבות";
      panel.appendChild(secLay);
      {
        const g = ctx.layers.palace;
        // the row starts as the layer does: 1.0.1 (FIXES E.1 / F.3) 60-palace.js builds the palace VISIBLE, so "בית שלמה" starts checked
        layerRows.palace = toggleRow("בית שלמה", !!(g && g.visible), (on) => setLayer("palace", on),
          { disabled: !g, src: [["מלכים א ז, א", V(10, 7, 1)], ["ז, יב", V(10, 7, 12)], ["י, ה", V(10, 10, 5)], ["ירמיהו כו, י", V(13, 26, 10)]], srcLabel: "מלכים א ז, א–יב; מקומו: " });
      }
      // PARALLELS_C (fix-c, 22.11.2026 - the user's decision 153 א): the City of David, a simple layer, off (59-parallels.js, section 12)
      if (ctx.layers.irDavid && ctx.shared.irDavid) layerRows.irDavid = toggleRow("עיר דוד והמלוא", false, (on) => { ctx.shared.irDavid.set(on); setLayer("irDavid", on); },
        { src: [["שמואל ב ה, ט", { book: 9, index: 124 }], ["מלכים א ט, כד", { book: 10, index: 367 }], ["מלכים א יא, כז", { book: 10, index: 429 }]], srcLabel: "שמואל ב ה, ט" });
      const units = document.createElement("div");
      units.id = "tm-units";
      units.textContent = "המידות באמות. יחידה אחת במודל = אמה אחת. לחיצה על מבט, מקום או שיטה פותחת את ההסבר ומקורותיו בכרטיס ליד התפריט (✕ או Esc סוגר). מה שאינו בפסוקים מסומן בהסברים ובלוח ״השלמות״; המחלוקות — בתפריט, תחת ״שיטות ומחלוקות״.";
//@@end buildUI.secLay
//@@begin credit
            cr.appendChild(document.createTextNode("הודפס מתוך תוסף ״בית ראשון״ לאוצריא — "));
            const a = document.createElement("a");
            a.href = "otzaria://open/plugin/com.beit-hamikdash.rishon-3d-model";
//@@end credit
//@@begin build.raw
          const raw = tb && typeof tb.__raw === "string" ? tb.__raw.trim() : null;   // 1.3.3: the card's own text - its paragraphs and bold
//@@end build.raw
//@@begin fileName
        const fileName = () => ("בית ראשון" + (curName() ? " - " + curName() : "")).replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
//@@end fileName
//@@begin context
//@@end context
//@@begin buildUI.after-rb-note
        // 1.2.9 (from the Second Temple plugin 1.6.0, stage 6): walk mode (90-entry.js ent_walkModeSet) and the live section (ent_sectionSet).
        // The section's slider spans 160 amot around the point looked at (the site is ~700 long - a slider over all of it would be too coarse);
        // it is re-centred whenever the section is switched on or its axis changes, so the cut starts where the eye looks.
//@@end buildUI.after-rb-note
//@@begin buildUI.after-rb-note-2
          // 1.3.3: the pills' frame() lives in another block (the pills); a call to it from here threw a ReferenceError after the switch was made
//@@end buildUI.after-rb-note-2
//@@begin stepDist
          lsSet("tm1.fade.dist", fs.dist);
//@@end stepDist
//@@begin buildUI.after-i
          lsSet("tm1.fade.on", fs.on ? "1" : "0");
          lsSet("tm1.fade.hide", fs.hide ? "1" : "0");
//@@end buildUI.after-i
//@@begin buildUI.after-reg
          title: "קודש הקדשים מכוסה בענן מפני כבוד המקום — 'והענן מלא את בית ה׳' (מלכים א ח, י–יא). הסרת הענן מבקשת אישור; הענן חוזר כשמתרחקים, או בלחיצה על 'החזר את הענן'.",
//@@end buildUI.after-reg
//@@begin buildUI.after-reg-2
          id: "ui-house", label: "פתח את הבית", labelOn: "סגור את הבית", removal: true, maxDist: 200,
          title: "פותח את הבית לצפייה בפנים: מסיר את הקיר הדרומי, את הגג ואת החלקים שבצד הדרום. כלי צפייה בלבד — הבית סגור מכל צדדיו (מלכים א ו, ב–י); המבטים שבפנים מצולמים מתוך הבית הסגור.",
//@@end buildUI.after-reg-2
//@@begin anchor
            if (ctx.shared.section && ctx.shared.section.on) return null;   // 1.3.5 (as the Second Temple plugin 1.9.1): the section already shows the inside
//@@end anchor
//@@begin title
          // 1.3.4 (the user: "כפתור פתח את היציע גם לשיטת רמבם חסר"): in the Rambam's reading the button takes away his outer wall and the
          // thin walls between the strips (50-heichal.js sec. 4b puts them in ctx.yatziaCut), and sits outside his galleries
          get title() {
            return ctx.shared.yatziaReading && ctx.shared.yatziaReading.mode === "rambam"
              ? "מסיר את כותל המסבה ואת הגג (בדרום, בצפון ובמערב): מן הצד נראית הרצועה החיצונה בשלוש הקומות, ומלמעלה — חמש הרצועות והכתלים הדקים שביניהן — לשיטת הרמב״ם: ״שני כותלים וביניהם הרחקה״. כלי צפייה בלבד."
              : "מסיר את הכתלים החיצוניים של התאים (בדרום, בצפון ובמערב) כדי לראות את שלוש הקומות — חמש, שש ושבע אמות — והקורות הנחות על המגרעות; הגג נשאר. כלי צפייה בלבד: 'ויבן על קיר הבית יציע סביב' (מלכים א ו, ה–י).";
          },
          anchor: () => {
            const rb = !!(ctx.shared.yatziaReading && ctx.shared.yatziaReading.mode === "rambam");
            const TM = ctx.shared.traksin && typeof ctx.shared.traksin.map === "function" ? ctx.shared.traksin.map : (x) => x;   // TRAKSIN_130_D: the west face by the amah traksin
            const a = anchorPt("yatziaSouth"), c = camP(), zf = rb ? 42.8 : Math.abs(a[2]), xw = TM(rb ? xYW - 7.5 : xYW);
            const side = c.z > zf - 1 ? 0 : c.z < -(zf - 1) ? 1 : c.x < xw + 1 ? 2 : -1;
            if (side < 0) return null;
            const p = yatziaPts[side];   // reused arrays: no allocation per frame
            p[0] = side === 2 ? xw - 0.5 : a[0];
//@@end title
//@@begin buildUI.REVEAL
        const REVEAL = {
//@@end buildUI.REVEAL
//@@begin cam
          "ui-house": { cam: () => ({ pos: [-30, 100, 50], target: [-30, 14, -1] }) },                          // from the south and above: over the chambers' roof, into the opened house
          "ui-yatzia": { cam: () => ({ pos: [-112, 36, 66], target: [-52, 20, 16] }) },                         // from the south-west: the south and the west chambers without their walls
          "ui-ulam": { cam: () => ({ pos: [62, 34, 16], target: [8, 23, 0] }) },                                // from the east, over the altar: יכין ובועז and the door of the heichal
          // the user's own example: from above. The roof's height follows the reading (fp forestRoof)
          "ui-boards": { cam: () => { const t = resolveFp("forestRoof").target; return { pos: [t[0] - 8, t[1] + 128, t[2] + 40], target: [t[0], t[1] - 6, t[2] - 3] }; } },
          "hei-yatzia-section": { own: true },
          "hei-aliyot-open": { own: true },   // 1.2.3: its set() flies to aliyotSection (from the east); the timer closes it and the view returns
          wallLayers: { fp: "wallLayers" },
          incenseAltarLayers: { fp: "incenseAltar" },
          arkInside: { fp: "arkInside" },
          kelim: { fp: "kelim" },
          mechonaDemo: { own: true },
          mechonaExplode: { fp: "mechonaParts" },
          palaceKingRoofs: { cam: () => ({ pos: [103, 78, 446], target: [103, -8, 384.5] }) },                  // from above and the south of its court: x 63..143, z 369.5..399.5
          palacePharaohRoof: { cam: () => ({ pos: [18, 62, 628], target: [50, -8, 585] }) },                    // from above, south-west: x 35..65, z 560..610
          palaceThroneRoofs: { cam: () => ({ pos: [166, 66, 626.5], target: [166, -8, 572.5] }) },                  // from above and the south: the halls x 141..191, z 560..610
          "crt-gazit-roof": { cam: () => ({ pos: [67.9, 70, -41.5], target: [59.9, 8, -67.5] }) },             // 1.0.1-L ("תוסיף כפתור פתיחת הגג בלשכות"): from above, into לשכת הגזית
          // 1.0.1-L (last check): further back: from 87 amot each of the pair stood half under the card and the panel
          // 1.3.5: the outer court's four chambers stand in its corners - each pill's view is from above into its own chamber, from the court's side
          "mnt-lishka-roofs-nw": { cam: () => ({ pos: [113.5, 47, -46.5], target: [104.5, 5, -61.5] }) },
          "mnt-lishka-roofs-ne": { cam: () => ({ pos: [212.5, 47, -46.5], target: [221.5, 5, -61.5] }) },
          "mnt-lishka-roofs-sw": { cam: () => ({ pos: [113.5, 47, 46.5], target: [104.5, 5, 61.5] }) },
          "mnt-lishka-roofs-se": { cam: () => ({ pos: [212.5, 47, 46.5], target: [221.5, 5, 61.5] }) },
          palaceThroneAscent: { own: true },
          palaceThroneWitnesses: { own: true }
//@@end cam
//@@begin buildUI.ROOF_PILLS
        // 1.0.1-L (the user: "כל קירוי שנפתח צריך להיסגר אחרי 30 שניות"): a roof opened by its pill closes by itself after 30 s, and the view returns
        const ROOF_PILLS = new Set(["ui-house", "ui-ulam", "ui-boards", "palaceKingRoofs", "palacePharaohRoof", "palaceThroneRoofs", "crt-gazit-roof", "mnt-lishka-roofs-nw", "mnt-lishka-roofs-ne", "mnt-lishka-roofs-sw", "mnt-lishka-roofs-se",
          "hei-aliyot-open"]);   // 1.2.3 (the user: "צריך להיסגר אוטו... כמו כל הקירויים שנפתחים")
//@@end buildUI.ROOF_PILLS
//@@begin pillFor-note
            // 1.3.4 (the user: "בלחיצה על כל מתג הוא חייב לבטל את ההדגמות"): a pill stops every other running demonstration first (its own
            // still toggles); the throne's mute (keepDemos) controls the running scene and leaves it
//@@end pillFor-note
//@@begin place
          // 1.3.5: a button over something that stands on the house's sloping floor rises with it (55-interior.js, ctx.shared.houseSlope)
          {
            const S = ctx.shared.houseSlope;
            if (S && typeof S.at === "function" && typeof S.hw === "number" && a[0] <= S.x0 && a[0] >= S.x1 && Math.abs(a[2]) <= S.hw && a[1] <= S.floor + 13) a = [a[0], a[1] + S.at(a[0]), a[2]];
          }
//@@end place
//@@begin buildUI.after-first
          try {   // 1.2.9: the live section and walk mode go off too
//@@end buildUI.after-first
//@@begin buildUI.after-S
            if (ctx.shared.navRepaint) ctx.shared.navRepaint();
//@@end buildUI.after-S
//@@begin frame
          if ((ctx.shared.section && ctx.shared.section.on) || (ctx.shared.walkMode && ctx.shared.walkMode.on)) anyOn = true;   // 1.2.9
//@@end frame
//@@begin buildUI.after-rr
        ctx.shared.__pillsFrame = frame;   // 1.3.3: for the nav box (walk mode, the live section), which is in another block
//@@end buildUI.after-rr
//@@begin buildUI.after-tg
      // TRAKSIN_130_D (fix-d - the user's decision 130 א): the amah traksin's default, Rashi's - set here, when the modules, the labels and
      // the places are all built (the switch moves them all); the places' cameras and the fallback fly points are given to it
      try {
        const TK = ctx.shared.traksin;
        if (TK && typeof TK.set === "function") {
          TK.placeItems = () => { const a = []; for (const g of PLACES) for (const it of g[1]) a.push(it); return a; };
          TK.fallbacks = () => ui_FP;
          TK.set("rashi");
          const r6 = OPS.find((r) => r && r.id === "d6");
          if (r6 && typeof r6.mark === "function") r6.mark("rashi");
        }
      } catch (e) { console.error("[ui.js] traksin", e); }
      // ===== 1.3.5 (the user's rule: every card mentions its disputes briefly, "בקצרה"; the comparison of the two houses, 10.11.2026: in
      // the Second Temple plugin every card with readings carries such a paragraph, here 29 cards with chips of readings had none): the
      // paragraph is made from the rows whose chips the card shows - each row's name and its readings' own names as the table writes
      // them, the one the model stands on marked - and put after the card's first paragraph. A card that has its own "בקצרה" is left
      // as it is. The words are the table's own: nothing is decided here. The presentation's slides take the same texts.
      {
        const shortOf = (rows) => {
          const line = (r) => r.options.map((o) => String(o[1]).replace(/[.;:\s]+$/, "") + (o[0] === r.cur ? " (ברירת המחדל)" : "")).join("; ") + ".";
          if (rows.length === 1) return "בקצרה — השיטות בכרטיס זה (״" + rows[0].cap + "״; הפירוט — במתגים שבכרטיס ובתפריט, תחת ״שיטות ומחלוקות״): " + line(rows[0]);
          return "בקצרה — השיטות בכרטיס זה (הפירוט — במתגים שבכרטיס ובתפריט, תחת ״שיטות ומחלוקות״):\n" + rows.map((r) => "• **" + r.cap + ":** " + line(r)).join("\n");
        };
        const withShort = (text, rows) => {
          const t = String(text || "");
          if (!rows.length || !t || t.indexOf("בקצרה") >= 0 || /^\s*</.test(t)) return t;
          const i = t.indexOf("\n"), blk = shortOf(rows);
          return i < 0 ? t + "\n" + blk : t.slice(0, i) + "\n" + blk + t.slice(i);
        };
        const doneKeys = {};
        for (const p of placeList) {
          const it = p.item;
          if (!it) continue;
          let rows = [];
          try { rows = opsLive(opsFor({ view: it.key || null, title: it.t })); } catch (_) { rows = []; }
          if (!rows.length) continue;
          if (it.key) {
            if (!doneKeys[it.key]) {
              doneKeys[it.key] = true;
              if (ui_INFO[it.key]) ui_INFO[it.key] = withShort(ui_INFO[it.key], rows);
            }
            if (ui_INFO[it.key]) p.info = ui_INFO[it.key];
          } else if (it.info) {
            it.info = withShort(it.info, rows);
            p.info = it.info;
          }
        }
      }
      // 1.0.1-H: the UI's API for the presentation (75-tour.js): the views in order with their buttons, texts and sources, the opinions
      // table rows (OPS: cap, refs, options [[key, label, info]], onPick, mark, cur, fly, disabled), the info box, the source links, the
      // cloud confirmation state, the panel
//@@end buildUI.after-tg
//@@begin askCloud
        // ARK_GATES_208 (58-ark.js): the demonstration "דבקו שערים" asks the devir's question itself before it starts
        askCloud: (onYes, onNo) => askRemoveCloud(onYes, onNo),
        // 1.0.1-K (K.9a): the cloud dialog answered from outside ("ביטול" / closed with no answer), the custom tooltips, the removals,
        // the on-model buttons' registry and "↺ החזר הכל", the wall fade, the camera steps of the nav buttons / keys / compass
//@@end askCloud
//@@begin goReading
          if (r.ch) tmToast((r.book === 10 ? "מלכים א " : "דברי הימים ב ") + ui_heNum(r.ch) + (r.v ? ", " + ui_heNum(r.v) : ""));
//@@end goReading
//@@begin buildUI.NEWS_KEY
        const NEWS_KEY = "tm1.news.seen";
//@@end buildUI.NEWS_KEY
