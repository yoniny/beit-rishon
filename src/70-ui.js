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
  var ui_ICONS = {
    play: ['<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>'],
    stop: ['<rect x="6.5" y="6.5" width="11" height="11" rx="1.5" fill="currentColor" stroke="none"/>'],
    help: ['<circle cx="12" cy="12" r="9.2"/>', '<path d="M15.6 8.4l-2.3 6-6 2.3 2.3-6z" fill="currentColor" stroke="none"/>'],
    print: ['<path d="M7 9V4h10v5"/>', '<path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/>', '<path d="M7 14h10v6H7z"/>'],
    report: ['<path d="M5 21V4"/>', '<path d="M5 4h13l-2.5 4.5L18 13H5"/>'],
    news: ['<path d="M12 3.5l2.1 5.6 5.6 2.1-5.6 2.1L12 19l-2.1-5.7-5.6-2.1 5.6-2.1z" fill="currentColor" stroke="none"/>']
  };
  function ui_topIcon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = (ui_ICONS[name] || ui_ICONS.help).join("");
    return svg;
  }
  function ui_setTopBtn(el, icon, label) {
    const svg = el.querySelector("svg");
    if (icon) {
      const n = ui_topIcon(icon);
      if (svg) el.replaceChild(n, svg);
      else el.insertBefore(n, el.firstChild);
    }
    const sp = el.querySelector(".lbl");
    if (label != null) {
      if (sp) sp.textContent = label;
      else {
        const s2 = document.createElement("span");
        s2.className = "lbl";
        s2.textContent = label;
        el.appendChild(s2);
      }
    }
  }
  var ui_barCache = { w: -1, h: 56 };
  function ui_barH() {
    const w = window.innerWidth;
    if (w !== ui_barCache.w) {
      const b = document.querySelector("header.topbar");
      const h = b ? b.offsetHeight : 0;
      if (h) ui_barCache = { w, h };
      else return 56;
    }
    return ui_barCache.h;
  }
  function ui_srcIs(body) {
    if (!body || body.length > 70 || /[\u0591-\u05C7]/.test(body) || /[()]/.test(body)) return false;
    if (/^עמ['׳]\s?[א-ת]/.test(body)) return true;           // the book's page
    if (/'|(?:^|\s)["״]|["״](?:$|[\s,;.:])/.test(body)) return false;   // a quote inside: its words stay as they are
    if (UI_SRC_NAME.test(body)) return true;
    // chapter and verse ("ז, לח"), a daf ("צט.", "לג:"): letters that are a Hebrew number, so that "אבן, ברוש וזהב" is not taken for a source
    return /(?:^|\s)(?=[א-ת])[קרשת]?[יכלמנסעפצ]?[א-ט]?,\s?(?=[א-ת])[קרשת]?[יכלמנסעפצ]?[א-ט]?(?:$|[\s,;–-])/.test(body) || /(?:^|\s)(?=[א-ת])[קרשת]?[יכלמנסעפצ]?[א-ט]?[.:](?:$|[\s,;–-])/.test(body);
  }
  function ui_srcRuns(text) {
    const s = String(text == null ? "" : text), out = [];
    let q = "", from = 0;
    const edge = (c) => c === "" || /[\s(\[—–:,;.\-]/.test(c);
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === "'" || c === '"' || c === "״") {
        const p = i ? s[i - 1] : "", n = i + 1 < s.length ? s[i + 1] : "";
        if (q) { if (c === q && p !== " " && (n === "" || /[\s.,;:)\]—–?!]/.test(n))) q = ""; }
        // an opening: at a word's edge, or after one prefix letter (ו'נכח השלחן')
        else if ((edge(p) || (p !== "" && "ובלכשמה".indexOf(p) >= 0 && edge(i > 1 ? s[i - 2] : ""))) && n !== "" && n !== " ") q = c;
        continue;
      }
      if (c !== "(" || q) continue;
      const e = s.indexOf(")", i + 1);
      if (e < 0 || e - i > 72 || !ui_srcIs(s.slice(i + 1, e))) continue;
      if (i > from) out.push({ t: s.slice(from, i), s: false });
      out.push({ t: s.slice(i, e + 1), s: true, i });   // 1.0.2 (A): i = where the bracket stands in the text (the book named before it)
      from = e + 1;
      i = e;
    }
    if (from < s.length) out.push({ t: s.slice(from), s: false });
    return out;
  }
  // 1.0.2 (A): link(run, text) -> an element for a source's bracket (span.tm-src with links inside it) or null (a plain bracket); only the cards pass it
  function ui_fillSrc(el, text, link) {
    el.textContent = "";
    const full = String(text == null ? "" : text);
    for (const r of ui_srcRuns(full)) {
      if (!r.s) { el.appendChild(document.createTextNode(r.t)); continue; }
      let ln = null;
      if (typeof link === "function") {
        try { ln = link(r, full); } catch (_) { ln = null; }
      }
      if (ln) { el.appendChild(ln); continue; }
      const sp = document.createElement("span");
      sp.className = "tm-src";
      sp.textContent = r.t;
      el.appendChild(sp);
    }
  }
  // 1.1.0 (the user: "תסיר מקורות מעץ התפריט - שישארו רק בכרטיסים"): a label for the tree - the source brackets out (ui_srcRuns), the
  // dashes and spaces that led to them tidied; the full title stays on the item (the card, the presentation, the search)
  function ui_stripSrc(text) {
    const runs = ui_srcRuns(text);
    if (!runs.some((r) => r.s)) return String(text == null ? "" : text);
    let t = runs.filter((r) => !r.s).map((r) => r.t).join("");
    t = t.replace(/\s+/g, " ").replace(/\s*[—–-]\s*$/, "").replace(/^\s*[—–-]\s*/, "").replace(/\s+([,;:.])/g, "$1").replace(/[,;:]\s*$/, "").trim();
    return t || String(text);
  }
  function ui_smallSources(text) {
    const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return ui_srcRuns(text).map((r) => (r.s ? '<span class="tm-src">' + esc(r.t) + "</span>" : esc(r.t))).join("");
  }
  // the label's text on a 2D canvas: the bracket in a clearly smaller font (28 of 48 px), so that a long label takes less of the view.
  // ui_labelText(c, text, font, fontSmall) measures and returns { w, draw(c, right, y) }, drawn from the right edge, right to left.
  function ui_labelText(c, text, font, fontSmall) {
    const runs = ui_srcRuns(text);
    let w = 0;
    for (const r of runs) {
      c.font = r.s ? fontSmall : font;
      r.w = c.measureText(r.t).width;
      w += r.w;
    }
    return {
      w,
      draw(c2, right, y) {
        c2.textAlign = "right";
        c2.textBaseline = "middle";
        c2.direction = "rtl";
        let x = right;
        for (const r of runs) {
          c2.font = r.s ? fontSmall : font;
          c2.fillStyle = "rgba(0,0,0,.85)";
          for (const o of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) c2.fillText(r.t, x + o[0], y + o[1]);
          c2.fillStyle = "#f3dc9a";
          c2.fillText(r.t, x, y);
          x -= r.w;
        }
      }
    };
  }
  // 1.0.1-L (L.85; part5-house.md FOR-UI 3): the card of the ark's inside
  var UI_ARK_TXT = "מה שבתוך הארון. 'אין בארון רק שני לחות האבנים אשר הנח שם משה בחרב' (מלכים א ח, ט). בגמרא: 'מאי אין בארון רק? מיעוט אחר מיעוט; ואין מיעוט אחר מיעוט אלא לרבות – ספר תורה שמונח בארון' (בבא בתרא יד., דברי רבי מאיר). הלוחות 'ארכן ששה, ורחבן ששה, ועביין שלשה; מונחות כנגד ארכו של ארון', ו'נשתיירו שם שני טפחים, שבהן ספר תורה מונח'. 'מלמד שהלוחות ושברי לוחות מונחין בארון' (מנחות צט.) — רש״י: 'תחת הלוחות' (בבא בתרא יד:). 'מלמד, שהשם וכל כינויו מונחין בארון' (שם). רבי יהודה חולק: 'מצד הוא מונח, ולא בתוכו', על הארגז (שם יד.). רד״ק: 'זה ראייה כי לא היו בארון לא שברי לוחות ולא ס\"ת'. מחוץ לארון: העמודים, 'עמודין היכא הוו קיימי? מבראי' (שם יד:), ו'צנצנת המן, וצלוחית שמן המשחה, ומקלו של אהרן ושקדיה ופרחיה, וארגז ששגרו פלשתים' (יומא נב:). סידור הדברים וצורתם — כציור הספר; הצבע, לשון הדברות על הלוחות וגודל הכלים שמחוץ לארון — בחירת מודל.";
  function ui_makeLabelSprite(text, size) {
    const font = '600 48px "Segoe UI", Arial', fontSmall = '600 28px "Segoe UI", Arial';
    const pad = 26;
    const cv = document.createElement("canvas");
    let c = cv.getContext("2d");
    const lt = ui_labelText(c, text, font, fontSmall);
    const tw = Math.max(8, Math.ceil(lt.w));
    cv.width = tw + pad * 2;
    cv.height = 48 + pad * 2;
    c = cv.getContext("2d");
    lt.draw(c, cv.width - pad, cv.height / 2);
    const tex = new CanvasTexture(cv);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const spr = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthTest: true, depthWrite: false }));
    const hAmot = (size || 4) * cv.height / 48;
    spr.scale.set(hAmot * cv.width / cv.height, hAmot, 1);
    return spr;
  }
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
    a: "ברייתא דמלאכת המשכן (פרק ז): 'מנין אתה אומר שכיון שהכניסו הכהנים את הארון, האריכו הבדים, הגיעו לפרכת ונגעו בפתח — לפיכך לא ננעלו דלתות בית קדשי הקדשים מעולם, שנאמר ויאריכו הבדים. אי אפשר לומר לא יראו, שכבר נאמר ויראו; ואי אפשר לומר ויראו, שכבר נאמר לא (ו)יראו — היו בולטין לפרכת ונראין בהיכל כשני דדי אשה. ומנין שהאריכו מבפנים? שנאמר ולא יראו החוצה — למדנו שהאריכו מבפנים. ומנין שהאריכו מבחוץ? שנאמר ויראו ראשי הבדים. ומנין אתה אומר שכשם שנמתחו הבדים כך נמתחו כנפי הכרובים, וכסו את הארון וחפו את הבית מלמעלה? שנאמר ויסכו הכרובים.' — במודל הבדים נמשכים גם מערבה, עד הכותל.",
    b: "ברייתא דמלאכת המשכן (פרק ז): 'היכן היה נתון? רבי יהודה בן לקיש אומר: במקומו, בבית קדשי הקדשים, שנאמר ויהיו שם עד היום הזה. וחכמים אומרים: בלשכת דיר העצים. רבי אליעזר אומר: לבבל ירד, שנאמר לא יותר דבר אמר ה׳ — אין דבר אלא דברות שבו. רבי אומר: יאשיה גנזו, שנאמר ויאמר אל הלוים — אמר: לא ירד עמהם לבבל, שתעלו אותו בכתף.'",
    c: "ברייתא דמלאכת המשכן (פרק ז): 'בית קדשי הקדשים שעשה לו שלמה היה לו כותל, פתח ודלתות, שנאמר ויעש דלתות להיכל ולקדש. אבל בבנין האחרון לא עשה שם כותל, אלא שני פסין היו שם, וארכו של כל אחד אמה ומחצה, ושתי פרכות של זהב היו שם פרוסות עליהן מלמעלה — והיה נקרא מקום הטרקסין.'"
  };
  var ui_FP = {
    harHabayit: { pos: [720, 320, 520], target: [100, 10, 80] },
    eastGate: { pos: [503, 35, 0], target: [353, 14, 0] },             // great court east gate, from outside (CO.harE 353; 20-mount.js)
    newCourt: { pos: [280, 72, 128], target: [161, 4, 0] },            // the outer court (החצר החיצונה, 1.0.1 name; the key stays) x 93.5..228.5
    azarah: { pos: [150, 105, 150], target: [20, 15, 0] },
    innerEastGate: { pos: [168, 27, 42], target: [95.5, 14, 0] },
    mizbeach: { pos: [115, 52, 72], target: [49.5, 16, 0] },
    altarFromDoor: { pos: [20.5, 21, 0], target: [60, 12, 0] },   // 1.2.0: from the ulam's doorway down the axis to the altar
    lishkatHaGazit: { pos: [44, 17, -40], target: [62, 9, -64] },   // 1.0.1-L (verify-courts.md): 30-courts.js's three fly points
    slaughterPlace: { pos: [66, 52, -2], target: [58, 7, -36] },
    slaughterPlaceClose: { pos: [52, 12.5, -31], target: [49.5, 9, -44] },
    mechonot: { pos: [50, 30, 14], target: [29, 8, 39] },               // 1.0.1-L (L.77): the block of 2 x 5 before the ulam's south wing (45-vessels.js)
    heichalFront: { pos: [75.3, 100.2, 78], target: [18.86, 46.62, 30.65] },   // 1.0.1-L (L.41): the whole house from the south-east above, as the book's general view
    heichalSouth: { pos: [-25, 55, 95], target: [-38, 21, 27] },        // 1.0.1-K (K.2): the closed chambers' south wall and the house over it
    ulamInside: { pos: [84, 44, 0], target: [18.4, 25.5, 0] },          // 1.0.1-L (L.44; verify-heichal.md): the ulam from the FRONT, its doorway in the middle (was from above)
    yatziaSection: { pos: [-4, 23.6, 21], target: [-30.5, 23, 21] },   // 1.0.1-L (L.43): square-on to the cut (use only with the section on)
    yachinBoaz: { pos: [18.4, 30.1, 0], target: [2.5, 29.5, 0] },       // 1.0.1-K (K.1): in the ulam's own front doorway, the ulam closed (Rashi's capital; pillarCapital.set re-aims it)
    yachinBoazFull: { pos: [74, 32, -40], target: [18.4, 24.63, -1.39] },   // 1.0.1-L (L.45 / L.58; verify-heichal.md): far, from the north-east: the doorway frames Yachin whole
    boazFar: { pos: [84, 34, 47], target: [18.4, 24.74, 1.4] },         // 1.0.1-L (verify-heichal.md): Boaz whole, from the south-east, farther back
    aliyot: { pos: [260, 150, 220], target: [-25, 70, 0] },
    heichalWest: { pos: [-200, 60, -60], target: [-80.6, 25, 0] },      // 1.0.1-L (verify-heichal.md): the old target stood inside the closed chambers
    kodesh: { pos: [-8, 34, 0], target: [-28, 24, 0] },
    kodeshHakodashim: { pos: [-46, 30, 6], target: [-56, 22, 0] },
    menorot: { pos: [-32, 20.5, -1], target: [-42, 15, 5] },            // 1.0.1-L: the menorot one amah west of the tables (interior.md)
    shulchanot: { pos: [-32, 21.5, 1.4], target: [-41, 15, -4.6] },     // (it stood outside the north wall: the user's "שולחן משה" showed the carvings)
    shulchanMoshe: { pos: [-36.2, 15.8, -5.15], target: [-40, 14.45, -5.25] },   // 1.0.1-L: along Moses' table from its east end
    incenseAltar: { pos: [-25.5, 15, 2.1], target: [-28, 12.75, 0.55] },         // 1.0.1-L (L.69): the altar 1 x 1 x 1 east of the rows (Rabbi's layout)
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
    55: { 3: 18, 5: 37 },                                                    // 1.0.1-L: Mishnah Yoma 3:10 = 28 (Ben Katin's spouts), 5:2 = 39 (the foundation stone)
    54: { 6: 37 },                                                           // 1.0.1-L: Mishnah Shekalim 6:4 = 41 (the thirteen tables)
    31: { 3: 37 },                                                           // 1.0.1-K: Song of Songs 3:6-7
    32: { 2: 20 },                                                           // 1.0.1-K: Kohelet 2:5-6 (the garden)
    39: { 1: 1, 2: 20, 3: 38, 4: 56, 5: 79, 6: 94, 7: 137, 8: 160, 9: 179, 10: 211, 11: 231, 12: 255, 13: 272, 14: 296, 15: 311, 16: 331, 17: 346, 18: 366, 19: 401, 20: 413, 21: 451, 22: 472, 23: 485, 24: 507, 25: 535, 26: 564, 27: 588, 28: 598, 29: 626, 30: 663, 31: 691, 32: 713, 33: 747, 34: 773, 35: 807, 36: 835 },  // 1.0.1: 23 (II Chr 23:13 "על עמודו"), 24 (II Chr 24:8 the chest); 1.0.1-K: 6 (6:13); 1.0.1-L (read in the DB): 8 (8:11 "לא תשב אשה לי" = 171), 29 (29:7 "דלתות האולם" = 633), 34 (34:22 חולדה = 795); 1.0.2: all 36 chapters (the DB), the old entries unchanged
    38: { 29: 942 },                                                         // 1.0.1-K (integration): I Chr 29:2 = 944 ("ואבני שיש לרב", the court floor)
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
    107: { "טז:": 360, "יט.": 403, "כא:": 462, "כה.": 577, "לג:": 793, "לו.": 850, "לח.": 899, "נא:": 1312, "נב.": 1323, "נג.": 1353, "נג:": 1379, "נד.": 1397, "סב:": 1619, "עב:": 1948 },   // 1.0.1-L: 16b, 33b (the altar's place), 62b
    105: { "יד.": 449, "יד:": 473 },
    119: { "מח.": 1648 },                              // 1.0.1-L: Sotah 48a (Yochanan the high priest's rings)
    124: { "ג.": 27, "ג:": 52, "יד.": 361, "יד:": 377, "צט.": 2327 },          // 1.0.1-H: Bava Batra 99a (the cherubim "בנס הן עומדין", "מצדדי אצדודי")
    125: { "ק.": 3894, "קו:": 4129 },                  // 1.0.1-K: Sanhedrin 100a (Rashi: the ulam's wall 6); 1.0.1-L: 106b (the Ben Yehoyada on the throne's mechanism)
    130: { "נט:": 2043, "ס.": 2054, "סא:": 2089, "סב.": 2101 },
    114: { "יג:": 386 },                               // 1.0.1-H: Chagigah 13b ("מאי כרוב - כרביא")
    108: { "ה:": 114 },                                // 1.0.1-H: Sukkah 5b (the same)
    112: { "י:": 355 }                                 // 1.0.1-H: Megillah 10b ("מקום ארון אינו מן המדה... בנס היה עומד")
  };
  // 1.0.1-L (Part 7, U2): no other site: every source opens in Otzaria only (the table of Sefaria names and every URL built from it are gone)
  function ui_gematria(s) {
    const V = { "א": 1, "ב": 2, "ג": 3, "ד": 4, "ה": 5, "ו": 6, "ז": 7, "ח": 8, "ט": 9, "י": 10, "כ": 20, "ל": 30, "מ": 40, "נ": 50, "ס": 60, "ע": 70, "פ": 80, "צ": 90, "ק": 100, "ר": 200, "ש": 300, "ת": 400 };
    let n = 0;
    for (const ch of s) n += V[ch] || 0;
    return n;
  }
  // V(book, chapter, verse) -> Tanach verse; P(book, "צח:") -> Talmud page; MI(ch, m) -> Mishnah Middot; RB(ch, h) -> Rambam Beit HaBechira (h = 0: chapter heading)
  function ui_V(book, ch, v) {
    const base = ui_BASE[book] && ui_BASE[book][ch];
    return { book, index: base == null ? null : base + v };
  }
  function ui_P(book, page) {
    const idx = ui_PAGES[book] && ui_PAGES[book][page];
    return { book, index: idx == null ? null : idx };
  }
  function ui_MI(ch, m) {
    return { book: 89, index: ui_BASE[89][ch] + (m || 0) };
  }
  function ui_RB(ch, h) {
    return { book: 337, index: ui_BASE[337][ch] + (h || 0) };
  }
  // 1.0.1-K: MN(book, ch, m) -> a Mishnah of another tractate (Sanhedrin 73, Menachot 81, Tamid 88, Kelim 91), like MI for Middot
  function ui_MN(book, ch, m) {
    const base = ui_BASE[book] && ui_BASE[book][ch];
    return { book, index: base == null ? null : base + (m || 0) };
  }
  // A plain Sefaria-style string ref ("Mishnah_Middot.4.7", "I_Kings.6.6") -> Otzaria position, when the book is known.
  function ui_sefToOtz(ref) {
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
  var UI_SRC_NUM = /^[קרשת]{0,2}(?:[יכלמנסעפצ]?[א-ט]?|טו|טז)$/;
  function ui_srcNorm(s) {
    return String(s || "").replace(/[֑-ׇ]/g, "").replace(/[״"]/g, '"').replace(/[׳']/g, "'").replace(/\s+/g, " ").replace(/^[\s,;]+|[\s,;]+$/g, "");
  }
  // "ז, טו–כב" -> "ז, טו"; "ו–ז" stays (no verse: it is not read)
  function ui_srcNoRange(s) {
    return s.replace(/(,\s?[א-ת"']{1,5})\s*[–-]\s*[א-ת"']{1,5}$/, "$1").replace(/([א-ת"']{1,5}[.:])\s*[–-]\s*[א-ת"']{1,5}[.:]?$/, "$1");
  }
  function ui_srcNum(t) {
    const s = String(t || "").replace(/["']/g, "");
    return s && UI_SRC_NUM.test(s) ? ui_gematria(s) : 0;
  }
  // the last Tanach book named at the head of a bracket in text before `pos` (a bracket with a quote counts too: it names its book), or null
  function ui_srcLastBook(text, pos) {
    const s = ui_srcNorm(String(text || "").slice(0, Math.max(0, pos || 0)));
    const re = /\((?:(?:רש"י|רד"ק|מצודת דוד|מצודת ציון|מצודות|מלבי"ם|רלב"ג|תרגום יונתן|תרגום|ראו|וראו)\s+)?(מלכים א|מלכים ב|דברי הימים א|דברי הימים ב|דה"י א|דה"י ב|ירמיהו|ירמיה|שמות|ויקרא|במדבר|שיר השירים|קהלת)\s/g;
    let m, last = null;
    while ((m = re.exec(s))) last = UI_SRC_TN[m[1]] || null;
    return last;
  }
  // one part (normalized, its range end dropped) -> { book, index } or null; bareBook = the book of a bare "ז, כו" (null: not read)
  function ui_srcParse(p, bareBook) {
    const tal = /^(.+?) ([א-ת"']{1,5}[.:])$/.exec(p);
    if (tal && UI_SRC_TAL[tal[1]]) {
      const b = UI_SRC_TAL[tal[1]], pg = tal[2].replace(/["']/g, "");
      const idx = ui_PAGES[b] && ui_PAGES[b][pg];
      return idx == null ? null : { book: b, index: idx };
    }
    const m = /^(?:(.+?) )?([א-ת"']{1,5}), ?([א-ת"']{1,5})$/.exec(p);
    if (!m) return null;
    const ch = ui_srcNum(m[2]), v = ui_srcNum(m[3]);
    if (!ch || !v) return null;
    let book = null;
    const name = m[1] || "";
    if (!name) book = bareBook;
    else if (UI_SRC_TN[name]) book = UI_SRC_TN[name];
    else if (UI_SRC_MI[name]) book = UI_SRC_MI[name];
    else {
      for (const pre of UI_SRC_PRE) {
        if (name === pre) { book = bareBook; break; }
        if (name.indexOf(pre + " ") === 0) { book = UI_SRC_TN[name.slice(pre.length + 1)] || null; break; }
      }
    }
    const B = book != null && ui_BASE[book];
    if (!B || B[ch] == null) return null;
    const idx = B[ch] + v;
    if (B[ch + 1] != null && idx >= B[ch + 1]) return null;   // past the chapter's end (books 10 and 39 have all their chapters)
    return { book, index: idx };
  }
  // ===== 1.0.2 (item 2): opening the plugin from the books (the reader's button "open-beit-rishon", openPlugin: true, shown in I Kings
  // and II Chronicles only). Otzaria opens the page and delivers reader.toolbar_item_clicked with the reading position (api.md: itemId,
  // currentBook = the title, currentBookId, currentId = the numeric id, currentIndex = the line, currentRef); plugin.page_opened's param is
  // read the same way when it carries a position. The listeners are set when the script runs - the event may come while the model loads -
  // and the position waits in ui_bookQueue until buildUI is done and the loading screen is gone (ui_bookGo is set at buildUI's end). =====
  var UI_BOOK_ITEM = "open-beit-rishon";
  var ui_bookQueue = [];
  var ui_bookGo = null;
  var ui_bootVersion = "";   // payload.plugin.version of plugin.boot (for the report, item 1)
  // the reading ranges -> the panel's button: p = a place title, v = a view key (the grid's own buttons); [chapter, from verse, to verse].
  // The first range that holds the verse wins (the narrow ones first); verse 0 = the chapter's heading line. Built from the verses
  // themselves (each one read in the DB); where a verse names something narrower than its range it has its own line (marked).
  var ui_READ = {
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
    ]
  };
  // a book given as a number, "10", "id:10", a title ("מלכים א", "דברי הימים ב", with or without its marks) or an object holding one of them
  function ui_bookOf(b) {
    if (b == null) return null;
    if (typeof b === "object") {
      for (const k of ["id", "bookId", "currentId", "bookUid", "title", "name", "currentBook"]) {
        const r = ui_bookOf(b[k]);
        if (r) return r;
      }
      return null;
    }
    if (typeof b === "number") return b === 10 || b === 39 ? b : null;
    const s = String(b).trim();
    const n = /^(?:id:)?(\d+)$/.exec(s);
    if (n) return ui_bookOf(+n[1]);
    const t = s.replace(/[֑-ׇ]/g, "").replace(/[׳״'"]/g, "").replace(/[\s,_-]+/g, " ").trim();
    if (/^מלכים א$|^I Kings$/i.test(t)) return 10;
    if (/^(?:דברי הימים ב|דהי ב|II Chronicles)$/i.test(t)) return 39;
    return null;
  }
  // line index -> { ch, v } by ui_BASE (the largest chapter base not after the line; v 0 = the heading line)
  function ui_lineToVerse(book, index) {
    const B = ui_BASE[book];
    if (!B || !(index >= 0)) return null;
    let ch = 0;
    for (const k of Object.keys(B)) if (B[k] <= index && (!ch || B[k] > B[ch])) ch = +k;
    return ch ? { ch, v: index - B[ch] } : null;
  }
  // a reference string ("מלכים א, ז, כג" as the DB's heRef, or "מלכים א פרק ז") -> { ch, v } (v 0 = the chapter only)
  function ui_refToVerse(ref) {
    const s = String(ref || "").replace(/[֑-ׇ]/g, "").replace(/[׳״'"]/g, "");
    const p = /פרק\s+([א-ת]{1,3})(?:\s*,?\s*(?:פסוק\s+)?([א-ת]{1,3}))?\s*$/.exec(s);
    const m = p || /,\s*([א-ת]{1,3})\s*,\s*([א-ת]{1,3})\s*$/.exec(s);
    if (!m) return null;
    const ch = ui_gematria(m[1]), v = m[2] ? ui_gematria(m[2]) : 0;
    return ch > 0 ? { ch, v } : null;
  }
  // a number in Hebrew letters (15 = ט״ו, 16 = ט״ז) for the toast
  function ui_heNum(n) {
    const L = [[400, "ת"], [300, "ש"], [200, "ר"], [100, "ק"], [90, "צ"], [80, "פ"], [70, "ע"], [60, "ס"], [50, "נ"], [40, "מ"], [30, "ל"], [20, "כ"], [10, "י"], [9, "ט"], [8, "ח"], [7, "ז"], [6, "ו"], [5, "ה"], [4, "ד"], [3, "ג"], [2, "ב"], [1, "א"]];
    let s = "";
    for (const [v, c] of L) while (n >= v) { if (n === 15 || n === 16) { s += n === 15 ? "טו" : "טז"; n = 0; break; } s += c; n -= v; }
    return s.length > 1 ? s.slice(0, -1) + "״" + s.slice(-1) : s + "׳";
  }
  // the reading position of an event -> { book, ch, v } or null (another book, another button, nothing readable)
  function ui_readingOf(d) {
    if (!d || typeof d !== "object") return null;
    if (d.itemId && d.itemId !== UI_BOOK_ITEM) return null;
    let book = null;
    for (const k of ["currentId", "currentBookId", "currentBook", "bookId", "book", "id", "bookUid", "title"]) {
      book = ui_bookOf(d[k]);
      if (book) break;
    }
    if (!book) return null;
    const ix = [d.currentIndex, d.index, d.lineIndex].map((x) => (typeof x === "string" && /^\d+$/.test(x) ? +x : x)).find((x) => typeof x === "number" && isFinite(x));
    const cv = ix != null ? ui_lineToVerse(book, ix) : ui_refToVerse(d.currentRef || d.ref);
    return cv ? { book, ch: cv.ch, v: cv.v } : { book, ch: 0, v: 0 };
  }
  function ui_bookEvent(d) {
    const r = ui_readingOf(d);
    if (!r) return;
    if (ui_bookGo) {
      try { ui_bookGo(r); } catch (_) {}
    } else {
      ui_bookQueue.push(r);
      if (ui_bookQueue.length > 4) ui_bookQueue.shift();
    }
  }
  try {
    if (typeof window !== "undefined" && window.Otzaria && typeof window.Otzaria.on === "function") {
      window.Otzaria.on("reader.toolbar_item_clicked", (d) => ui_bookEvent(d));
      window.Otzaria.on("plugin.page_opened", (d) => { if (d && d.param && typeof d.param === "object") ui_bookEvent(d.param); });
      window.Otzaria.on("plugin.boot", (p) => { ui_bootVersion = (p && p.plugin && p.plugin.version) || ui_bootVersion; });
    }
  } catch (_) {
  }
  // ===== explanation texts of the views (Hebrew, verse reference first; wording after research/*.md) =====
  // 1.0.1-L: the pillars' text is shared by the far view "יכין ובועז" (yachinBoazFull, L.58) and the in-doorway place (yachinBoaz)
  var ui_YB_BODY = "יכין ובועז (מלכים א ז, טו–כב): עמודי נחושת — 'שמנה עשרה אמה קומת העמוד האחד וחוט שתים עשרה אמה יסב' — עגולים, ארבע אמות עוביים, 'והוא חלול' (רש״י), ודופנם ארבע אצבעות (ירמיהו נב, כא: 'ועביו ארבע אצבעות נבוב'). על כל עמוד כותרת של חמש אמות (ז, טז), והעמוד תחוב בה שתי אמות (רש״י), ולכן גובה כל העמוד עם הכותרת עשרים ואחת אמה, כציור הספר. הכותרת — 'כמין שני אגנים' (רש״י ז, יח): הגולה מצוירת שושנים, הבטן ועליה שני טורי רימונים, 'מאה רמונים בטור, חרוזים בשרשרות' (רש״י ז, מב), השבכה 'כמין כפה' הקלועה משבעה לולבים (רש״י ז, יז), וכותרת קטנה בראשה; קריאת מלבי״ם לכותרת — בטבלת 'שיטות ומחלוקות'. מקומם — 'שהעמיד באולם' (רש״י ז, טו), יכין מימין, 'בפאת הדרומי' (מצודת דוד ז, כא), ובועז משמאל — 'העמידם שלמה באולם סמוך לכותל ההיכל' (רש״י ירמיהו נב, כג): צמודים לכותל ככל שהכותרת מניחה (ראו 'יכין ובועז — מבט מפתח האולם').";
  var ui_INFO = {
    __general: "בית המקדש הראשון שבנה שלמה: הבית שישים אמה אורך, עשרים רוחב ושלושים גובה (מלכים א ו, ב), ולפניו האולם. בחצר הכהנים מזבח הנחושת, הים והמכונות, וסביב הכול החצר הגדולה. מה שאינו בפסוקים הושלם מחז״ל ומן המפרשים ומסומן בלוח 'השלמות'.",
    harHabayit: "העזרה הגדולה (דברי הימים ב ד, ט) מקיפה את הבית ואת חצר הכהנים; חומתה נבנתה בדגם חצר המלך וחצר בית ה' הפנימית — שלושה טורי גזית וטור כרותות ארזים (מלכים א ז, יב) — בחירת מודל. דלתותיה מצופות נחושת (דברי הימים ב ד, ט). גודלה חמש מאות על חמש מאות אמה — על פי מסכת מדות (ב, א), כי בפסוקים אין מידה.",
    eastGate: "השער המזרחי של החצר הגדולה, מול פתח הבית. דלתות השערים היו מצופות נחושת (דברי הימים ב ד, ט). מספר השערים ושמותיהם אינם בפסוקים — שער אחד בכל צד הוא בחירת מודל.",
    newCourt: "החצר החיצונה: לפנים ממנה חצר הכהנים (רש״י מלכים א ו, לו: 'לפנים מעזרת נשים'). בה לשכות (ירמיה לה, ד; לו, י), 'העמוד' שעליו עמד המלך (מלכים ב יא, יד; כג, ג) וארון הנדבות שבשער (דברי הימים ב כד, ח). גודלה ומפלסה — בחירת מודל.",
    azarah: "חצר הכהנים — 'החצר הפנימית' (מלכים א ו, לו): שלושה טורי גזית וטור כרותות ארזים. מידותיה (187 על 135) ושבעת שעריה — על פי מסכת מדות (ה, א; א, ד), כי במלכים אין מידה לחצר. רצפתה לוחות שיש — 'ואבני שיש לרב' (דברי הימים א כט, ב), ורש״י שם: 'לעמודים ושלחנות ולרצפה'. בה מזבח הנחושת ובצפונו בית המטבחים (השלמה מבית שני); הים בקרן המזרחית הצפונית (רש״י), ועשר המכונות וכיור משה בגוש אחד מדרום לציר הבית, מול אגף האולם הדרומי; ולשכת הגזית על החומה הצפונית, בין השער הצפוני לים.",
    mizbeach: "מזבח הנחושת (דברי הימים ב ד, א): עשרים אמה אורך, עשרים רוחב ועשר גובה. הכבש מדרום ('לא תעלה במעלות', שמות כ; מידותיו כמדות ג, ג) והקרנות (כמזבח המשכן, שמות כז; מדות ג, א) — השלמת מודל. סביבו היסוד, הסובב וחוט הסיקרא, כמשנה (מדות ג, א; זבחים סב.), והכבש 'פורח אמה על יסוד ואמה על סובב' (זבחים סב:) — השלמה.",
    // 1.0.1-L (L.7 / L.75, the user: "כרש\"י ובספר"; vessels.json): the Sea in the inner court's CORNER, north-east for Rashi (the default)
    yam: "הים (מלכים א ז, כג–כו): עשר אמות משפה אל שפה, חמש אמות קומתו, 'ועביו טפח' ו'אלפים בת יכיל' (ז, כו) — ובמודל 450 אמה מעוקבת, ראו 'צורת הים' בהמשך — ועומד על שנים עשר בקר — פניהם לחוץ ואחוריהם 'ביתה' (ז, כה). שלוש אמותיו התחתונות מרובעות ושתיים העליונות עגולות (עירובין יד:). מקומו — במקצוע, בקרן העזרה: 'ואת הים נתן מכתף הבית הימנית קדמה ממול נגב' (ז, לט); רש״י: 'מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה' — ברירת המחדל, כציור הספר ומפתו, ממזרח לצפון בית המטבחים; לרד״ק, מצודות ורלב״ג ולרש״י על דברי הימים ב ד, י — במקצוע המזרחית־דרומית (השורה 'מקום הים' בטבלת 'שיטות ומחלוקות'). ציר הים 11 אמות מן הכתלים — בחירת מודל: המקורות אומרים 'מקצוע' ולא מרחק.",
    // 1.0.1-K (K.3): the bases rebuilt after Rashi, "בעל צורת הבית" and the book. 1.0.1-L (L.40, L.64, L.77; vessels.json): ALL TEN in one
    // block of 2 x 5 south of the house with Moses' laver between the rows (the book p. לח), their purpose, the pills (L.51: no panel places)
    mechonot: "עשר המכונות (מלכים א ז, כז–לט): 'ארבע באמה ארך המכונה האחת וארבע באמה רחבה ושלש באמה קומתה'; על כל אחת כן וכיור של ארבעים בת. כולן במקום אחד, שתי שורות של חמש וכיור משה ביניהן: 'ויתן חמשה מימין. לכיור של משה' (רש״י דברי הימים ב ד, ו); 'מימין כיור משה ומשמאלו' (רד״ק דברי הימים ב ד, ו), ושתי השורות כציור 'מקרא מפורש' (עמ' לח) וכמפתו (עמ' ב–ג): מדרום לציר הבית, מול אגף האולם הדרומי, בינו לבין הכבש: השורה הצפונית בין האגף לכבש, והדרומית מעט מדרום להם. תפקידן: 'את מעשה העולה ידיחו בם' (דברי הימים ב ד, ו) וקידוש ידיהם ורגליהם של הכהנים — 'לרחצה בהם. קדוש ידים ורגלים' (רש״י שם); 'והכיורים היו לרחוץ מהם הכהנים ידיהם ורגליהם ולהדיח בהם מעשה העולה' (רד״ק ז, לט). על המכונה שבשורה הצפונית שני כפתורים: 'הבא את הכיור לקידוש ידים ורגלים ולהדחת העולה' ו'פרק: כיור, כן ומכונה'; ובלוח 'המזבח וכלי הנחושת': 'המכונות מקרוב'.",
    // 1.0.1-K (K.2): the house closed on all sides, the chambers' block, the ulam 84 wide and its courses (7:12, not Rashi). 1.0.1-L (L.41):
    // the camera from the south-east above, as the book's general view; L.59 the doorway 10 x 22 with its open doors
    heichalFront: "בית ה׳ מבחוץ (מלכים א ו, ב–ג): שישים אמה אורך, עשרים רוחב ושלושים גובה מבפנים; האולם על פניו — עשרים אמה על עשר. הבית סגור מכל צדדיו, וסביבו מדרום, ממערב ומצפון גוש התאים הנמוך של היציע — כותליו החיצוניים אבן, וראשי קורות הגג בראשם — וכותל הבית עולה מעליו, כציור הכללי בספר. חזית האולם, עם בית החליפות משני צדיו (רש״י יומא לו.), שמונים וארבע אמות; פתחו עשר על עשרים ושתיים (בחירת מודל) ובו שתי דלתות ארז פתוחות — 'גם סגרו דלתות האולם' (דברי הימים ב כט, ז); כתליו שלושה נדבכי גזית ונדבך ארזים — 'ולאלם הבית' (ז, יב) כפירוש מצודת דוד, רלב״ג, מלבי״ם ורד״ק. המבט מדרום־מזרח ומלמעלה, כציור הכללי בספר. על המודל: 'פתח את הבית', 'פתח את האולם' — כלי צפייה בלבד.",
    heichalSouth: "היציע (מלכים א ו, ה–י): שלוש קומות של תאים סביב הבית, מדרום, ממערב ומצפון. כברירת מחדל הוא סגור, כציור הכללי בספר: כותל התאים החיצוני אבן, חמש אמות עוביו ('וכתל התא חמש', מדות ד, ז), ובראשו רצועת ראשי קורות הגג; ופתח אחד מבחוץ — 'שבחמש תאים שבדרום היה לה פתח אל החוץ בשורה התחתונה' (רש״י ו, ח). חשבון רש״י (ו, ו; ו, י): התאים חמש, שש ושבע אמות רוחבם וחמש אמות גובה כל קומה, כי כותל הבית נכנס אמה בכל קומה — שבע, שש וחמש, וארבע מעל גג התאים — וקורות הארז מונחות על המגרעות, 'לבלתי אחז בקירות הבית'. בלוח 'היציע': 'חתך היציע' מסובב את המבט אל החתך ומראה את החשבון במידות, כל קומה בצבע משלה (וחוזר לבד אחרי 15 שניות); על המודל: 'הצג חתך של היציע (רש״י)' עושה זאת גם הוא, ו'הסר את קירות היציע' מסיר את הכתלים החיצוניים (הגג נשאר) — לצפייה בלבד.",
    // 1.0.1-L (L.44 the view from the front; L.59 the doorway 10 x 22, a model choice, with two open cedar doors - heichal-door.md)
    ulamInside: "האולם (מלכים א ו, ג): 'עשרים אמה ארכו על פני רחב הבית עשר באמה רחבו' — לפני ההיכל. המבט מן החזית, מול פתח האולם: חזיתו כולה ופתחו באמצע — ובעדו נראה פתח ההיכל — בלי להסיר דבר; ומשני צדיו בית החליפות, חמש עשרה אמה מכל צד (רש״י יומא לו.), כך שחזיתו שמונים וארבע אמות. פתחו — עשר על עשרים ושתיים, בחירת מודל (אין מקור למידות פתח האולם בבית ראשון; 'פתחו של אולם, גבהו ארבעים אמה, ורחבו עשרים אמה', מדות ג, ז, הוא בית שני) — ושתי דלתות ארז פתוחות, מקופלות אל תוך עובי הפתח: 'גם סגרו דלתות האולם ויכבו את הנרות' (דברי הימים ב כט, ז); המאירי (יומא נד.): 'ואע״פ ששערים של עץ היו שם מ״מ לא היו נועלים אותם ביום ופורסים הפרוכת לפניהם' — הפרוכת לא נבנתה; המשקוף ישר כציור הספר. כתליו שלושה נדבכי גזית ונדבך ארזים — 'ולאלם הבית' (ז, יב) כפירוש מצודת דוד ('כי כולם בנה בשלשה טורים גזית'), רלב״ג, מלבי״ם ורד״ק; רש״י שם מתאר את הדגם בלבד ('החומה עשויה שלשה נדבכין של אבנים, ונדבך של עץ עליהם'). בתוכו, משני צדי פתח ההיכל, יכין ובועז (רש״י ז, טו). אין בו ציפוי זהב (רש״י ומצודות על דברי הימים ב ג, ד). 'פתח את האולם' שעל המודל מסיר את חזיתו ואת גגו — לפתיחה מלאה, לצפייה בלבד.",
    // 1.0.1-K (K.1): after Rashi and the book - the whole pillar 21, the two basins, Rashi on Jer 52:23. 1.0.1-L (L.6, L.58): the far view
    // through the doorway is the grid's "יכין ובועז" (yachinBoazFull); the in-doorway camera stays as a place
    yachinBoaz: ui_YB_BODY + " המבט מפתח האולם, והאולם סגור; 'פתח את האולם' שעל המודל מסיר את חזיתו ואת גגו לצפייה בלבד. ראו 'כותרת העמוד' בלוח.",
    // (L.58, verify-heichal.md: the ulam stays closed; the camera far from the north-east, where the doorway frames Yachin whole; Boaz by dragging, or the place "בועז — מרחוק")
    yachinBoazFull: ui_YB_BODY + " המבט מרחוק, מן החצר, והאולם סגור: בעד פתח האולם (עשר על עשרים ושתיים) ובין דלתותיו הפתוחות נראה יכין בשלמותו, מן הרצפה ועד ראש הכותרת — עשרים ואחת אמה — כנגד חזית האולם, המעלות והמזבח, כדי שייראה גודלו. שני העמודים יחד אינם נראים בשלמותם מבחוץ: הם עומדים בתוך האולם משני צדי הפתח, והפתח רוחבו עשר. גררו את המבט סביב הפתח אל הדרום־מזרח — ונראה בועז. 'פתח את האולם' שעל המודל מסיר את חזיתו ואת גגו, לצפייה בלבד; אז נראים שניהם בשלמותם במבט 'האולם'. ראו גם 'יכין ובועז — מבט מפתח האולם' ו'כותרת העמוד' בלוח.",
    heichalDoor: "פתח ההיכל (מלכים א ו, לג–לה): מזוזות עצי שמן מרובעות ('מאת רבעית' — רש״י ותרגום), ושתי דלתות ברושים מגולפות כרובים, תמורות ופרחים ומצופות זהב. מידות הפתח (עשר על עשרים) — בחירת מודל.",
    // 1.0.1-K (K.5, the addendum D): the carvings after the book are the default look; the layers are an option; the floor; the smoke
    kodesh: "ההיכל: ארבעים אמה (מלכים א ו, יז), ובו המנורות, השולחנות ומזבח הזהב — 'הבית הוא ההיכל לפני' (ו, יז): החלל שלפני הדביר, ולא הבית כולו. הקירות ארז מגולף ומצופה זהב — 'הכל ארז אין אבן נראה' (ו, יח) — והרצפה ברושים מצופים זהב (ו, טו; ו, ל). הגילופים: 'פתוחי מקלעות כרובים ותמורות ופטורי ציצים' (ו, כט) ו'מקלעת פקעים ופטורי ציצים' (ו, יח) — לפי רש״י: כרובים, דקלים, חבלים ופרחים, והפקעים 'כמין כפתורים' (תרגום: ביצים); רד״ק: מפותחים ולא בולטים. במודל, כציור הספר: רקע קלוע דק, חבל שזור, זוגות כרובים בגלימות ארוכות בלי ידיים ובפני ילד ('כרביא', חגיגה יג:), דקלים גבוהים, פקעים, שושנים ושרשרות — שורה כל עשר אמות, והזהב שוקע בחקק (רש״י ו, לב). זה מראה הבית; שכבות האבן והארז שמתחת לזהב — אפשרות תצוגה בכפתור 'הצג את שכבות הקיר והרצפה' שעל הקיר הצפוני, סמוך לפתח. מנורת משה ועשר המנורות בדרום — כל אחת עם גביעיה, כפתוריה ופרחיה ואבן של שלוש מעלות לפניה; שולחן משה ועשרה השולחנות בצפון, כולם בתבנית שולחן משה; ומזבח הזהב, אמה על אמה על אמה, מיד מזרחית לשורות, ועליו עשן הקטורת (ז, מח–מט; מנחות צח:).",
    devirDoor: "'ואת פתח הדביר עשה דלתות עצי שמן האיל מזוזות חמשית' (מלכים א ו, לא). שני ביאורים ברש״י, ושניהם במודל (טבלת 'שיטות ומחלוקות'): (א) 'ואני אומר' — חמש צלעות היו למזוזות ולא היו מרובעות, ואין הכתוב מדבר במפתן ובמשקוף (ברירת המחדל) — ומעל הפתח משקוף של זהב בחתך המזוזות המחומשות, כציור הספר: רד״ק 'האיל הוא הסף העליון... וכן האיל', רלב״ג 'שהאיל והוא הסף אשר על הפתח', מלבי״ם 'האיל ר״ל המשקוף' (רש״י אינו שולל משקוף) — בחירת מודל; (ב) 'כך שמעתי' — חמישה חלקי מסגרת: המפתן, שתי המזוזות והמשקוף העשוי כשניים. רד״ק: חמש מדרגות זו לפנים מזו; רלב״ג ומלבי״ם: 'חמישית' — הפתח החמישי שבמקדש. הדלתות עצי שמן מגולפות ומצופות זהב (ו, לב), עומדות פתוחות (רד״ק), ועליהן הפרוכת (דברי הימים ב ג, יד). מידות הפתח — בחירת מודל.",
    kodeshHakodashim: "הדביר — קודש הקדשים (מלכים א ו, יט–כ): עשרים אמה אורך, עשרים רוחב ועשרים גובה, כולו זהב, וקירותיו מגולפים כהיכל (ו, כט 'מלפנים'). שני הכרובים: עצי שמן מצופים זהב, עשר אמות קומתם, חמש אמות כל כנף — כנף נוגעת בקיר וכנף נוגעת בכנף חברו (ו, כג–כח; דברי הימים ב ג, י–יג); 'מעשה צעצעים' — תבנית ילדים (רש״י), 'והם עמדים על רגליהם ופניהם לבית'; במודל, כציור הספר — לבושים עד הקרקע, בלי ידיים, פני ילד ('כרביא'), וארבע הכנפיים פרושות במישור אחד מאוזן, שוכבות לרוחב הדביר מתחת לראשים כסוכה על הארון — 'כי הכרובים פרשים כנפים אל מקום הארון ויסכו הכרבים על הארון ועל בדיו מלמעלה' (ח, ז). חז״ל: 'כרובים — בנס הן עומדין' — ארבע הכנפיים ממלאות את כל עשרים האמה ואין מקום לגופם (בבא בתרא צט.; רש״י מלכים א ו, כד: 'וגוף הכרובים אינו מן המדה ועומד בנס'); ושם מקשה אביי: 'ודלמא בולטין כתרנגולין הוו קיימי' — גופם תחת כנפיהם, וכך רד״ק (ו, כז) — וכך נבנה המודל. הארון ובדיו (ח, ו–ח) על אבן השתייה (יומא נג:). קודש הקדשים מכוסה בענן; 'הסר ענן' שעליו מבקש אישור.",
    aliyot: "'והגובה מאה ועשרים' (דברי הימים ב ג, ד): לפי רש״י — שלושים אמה עד תקרת העלייה הראשונה ועוד תשעים אמה של עליות עד הגג העליון. רד״ק (כדעה שנייה): 'ג' עליות גבהן תשעים אמה'. במודל שתי עליות, זו על גב זו, וכל אחת סגורה בתקרת הגבים, בית דילפא ושדרות בארזים — כאיור הספר (חלוקת הגובה — בחירת מודל). למה שימשו? לגניזת אהל מועד וכליו: 'והיו הכהנים נושאים הארון והלויים נושאים אהל מועד, והכלים אשר עשה משה במדבר ואהל מועד גנזו באוצרות בית האלקים, והם העליות שהיו ממעל לדביר ולהיכל' (אברבנאל מלכים א ח); וכן מצודת דוד (מלכים א ח, ד): אהל מועד וכליו הועלו להיגנז בבית. הכפתור שעל העליות פותח את הכותל הדרומי ומראה את פנימן.",
    // 1.0.1-L (L.20, L.22, L.33, L.57, L.81): three readings of the forest house, the king's own court, the garden without the pool, the throne's versions
    palace: "בית שלמה (מלכים א ז, א–יב): בית יער הלבנון (בשלוש קריאות — רש״י כציור הספר; מלבי״ם ורלב״ג; מצודת דוד — בטבלת 'שיטות ומחלוקות'), ובו המגינים והצינות (י, טז–יז); אולם העמודים ו'אולם על פניהם' (ז, ו); אולם הכסא ואולם המשפט עם כסא שלמה (ז, ז; י, יח–כ) — בארבע גרסאות מדרשיות, ועליית המלך אליו; בית המלך בחצר משלו — החצר האחרת, 'מבית לאולם' (ז, ח) — ובה הגן (קהלת ב, ה; בלי בריכה); בית בת פרעה בחצר הגדולה, חצר בית יער הלבנון; והחצר הגדולה סביב (ז, יב)." // 1.0.1: buildUI appends the placement basis (ctx.shared.palaceBasis / ui_PALACE_BASIS); 1.0.1-K: review Q2-5 (Ralbag only with his count)
  };
  // 1.0.1 (FIXES E.2 / F.3): the basis of the palace's placement (south of the Temple's great court, on a lower terrace) - the UI's copy,
  // used when 60-palace.js did not write ctx.shared.palaceBasis. The verses: I Kings 10:5 (II Chr 9:4 "ועליתו"), II Kings 11:19,
  // Jer 26:10, Jer 22:1 (the palace below the house, one goes UP to the house), I Kings 8:1 (the city of David south of the house).
  var ui_PALACE_BASIS = "מקומו: בית המלך עמד למטה מבית ה׳ ועלו ממנו אל הבית — 'ועלתו אשר יעלה בית ה׳' (מלכים א י, ה; דברי הימים ב ט, ד: 'ועליתו'), 'וירידו את המלך מבית ה׳ ויבואו דרך שער הרצים בית המלך' (מלכים ב יא, יט), 'ויעלו מבית המלך בית ה׳' (ירמיהו כו, י), 'רד בית מלך יהודה' (ירמיהו כב, א); והעיר, עיר דוד, הייתה מדרום למקדש — הארון הועלה 'מעיר דוד היא ציון' אל הבית (מלכים א ח, א). לפיכך הארמון במודל צמוד לחצר הגדולה מדרום, על מדרגה נמוכה ממנה; המרחק (עשרים אמה) והירידה (עשר אמות) — בחירת מודל.";
  var ui_REFS = {
    __general: [["מלכים א ו, ב", ui_V(10, 6, 2)], ["דברי הימים ב ג, ג", ui_V(39, 3, 3)]],
    harHabayit: [["דברי הימים ב ד, ט", ui_V(39, 4, 9)], ["מלכים א ז, יב", ui_V(10, 7, 12)], ["מדות ב, א", ui_MI(2, 1)]],
    eastGate: [["דברי הימים ב ד, ט", ui_V(39, 4, 9)], ["מלכים א ז, יב", ui_V(10, 7, 12)]],
    newCourt: [["רש״י מלכים א ו, לו", ui_V(10, 6, 36)], ["ירמיהו לה, ד", ui_V(13, 35, 4)], ["ירמיהו לו, י", ui_V(13, 36, 10)], ["מלכים ב יא, יד", ui_V(11, 11, 14)], ["דברי הימים ב כד, ח", ui_V(39, 24, 8)]], // 1.0.1: the outer court's uses (FIXES D.2); II Chr 20:5 dropped with the "new court" identification (20-mount.js); 1.0.1-K: II Kings in Otzaria (Q2-7)
    azarah: [["מלכים א ו, לו", ui_V(10, 6, 36)], ["מדות ה, א", ui_MI(5, 1)], ["מדות א, ד", ui_MI(1, 4)], ["דברי הימים א כט, ב", ui_V(38, 29, 2)]],
    mizbeach: [["דברי הימים ב ד, א", ui_V(39, 4, 1)], ["מדות ג, ג", ui_MI(3, 3)], ["מדות ג, א", ui_MI(3, 1)],
      ["זבחים סב.", { book: 130, index: 2110 }], ["זבחים סב:", { book: 130, index: 2131 }]],   // 1.0.2 add-on: the yesod and sovev (lines read in the DB)
    yam: [["מלכים א ז, כג", ui_V(10, 7, 23)], ["ז, כו", ui_V(10, 7, 26)], ["עירובין יד:", ui_P(105, "יד:")], ["ז, לט (ורש״י שם)", ui_V(10, 7, 39)], ["דברי הימים ב ד, י", ui_V(39, 4, 10)]],
    mechonot: [["מלכים א ז, כז", ui_V(10, 7, 27)], ["ז, לב", ui_V(10, 7, 32)], ["ז, לג", ui_V(10, 7, 33)], ["ז, לח", ui_V(10, 7, 38)], ["ז, לט", ui_V(10, 7, 39)], ["דברי הימים ב ד, ו", ui_V(39, 4, 6)]],
    heichalFront: [["מלכים א ו, ב", ui_V(10, 6, 2)], ["ו, ג", ui_V(10, 6, 3)], ["ו, ה", ui_V(10, 6, 5)], ["ז, יב", ui_V(10, 7, 12)], ["יומא לו.", ui_P(107, "לו.")], ["מדות ד, ז", ui_MI(4, 7)]],
    heichalSouth: [["מלכים א ו, ה", ui_V(10, 6, 5)], ["ו, ו", ui_V(10, 6, 6)], ["ו, ח", ui_V(10, 6, 8)], ["ו, י", ui_V(10, 6, 10)], ["מדות ד, ג", ui_MI(4, 3)], ["מדות ד, ז", ui_MI(4, 7)]],
    ulamInside: [["מלכים א ו, ג", ui_V(10, 6, 3)], ["ז, יב", ui_V(10, 7, 12)], ["יומא לו.", ui_P(107, "לו.")], ["רש״י ז, טו", ui_V(10, 7, 15)], ["דברי הימים ב ג, ד", ui_V(39, 3, 4)], ["דברי הימים ב כט, ז", ui_V(39, 29, 7)], ["מדות ג, ז", ui_MI(3, 7)], ["מדות ב, ג", ui_MI(2, 3)], ["יומא נד.", ui_P(107, "נד.")]],   // 1.0.1-L (L.59): the doorway and its doors
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
  var ui_PHONE_MAX = 639;
  // 1.0.2: #tm-panel and #tm-xcard start 9 px below the fixed top bar of index.html (--topbar-h: 56 px, 44 px in a narrow window), as below the old 47 px header
  var ui_AUTO_OFF_S = 15;   // 1.0.1-L (L.27): a feature a PLACE switched on goes off by itself after this many seconds
  // 1.0.2 (C): the window "מה חדש" - shown once for this version (ver = manifest.json's version); short plain Hebrew, one line a feature
  var UI_NEWS = {
    ver: "__PLUGIN_VERSION__",   // 1.1.0: tools/build.mjs writes manifest.json's version here
    items: [
      "סיבוב מלא סביב מה שמסתכלים עליו בתוך הבית, גם מאחור ומלמעלה; הקירות והתקרות נעשים שקופים בדרך.",
      "כפתור ״פתח בתוסף בית ראשון״ בספרי מלכים א ודברי הימים ב.",
      "השיתין, ומזבח הנחושת מאבנים או מצופה נחושת עם הכבש (אברבנאל).",
      "היסוד, הסובב וחוט הסיקרא; הכבשים הקטנים — כרש״י או כתוספות.",
      "טשטוש חומות: גם קיר שמסתיר את המקום נעשה שקוף.",
      "השיטות בתוך כרטיסי ההסבר.",
      "המקורות שבסוגריים נפתחים באוצריא בלחיצה.",
      "הדפסה או שמירה כ-PDF, בתחתית הלוח.",
      "סיבוב 360 מעלות בתוך הבית ובכל מקום מקורה.",
      "מבט חופשי למעלה ולמטה בכל מקום, וגובה העין בחצים או ב-Shift עם הגלגלת.",
      "הדגמת המכונה מקרוב.",
      "סרגל הכותרת קבוע, גם בזמן הטעינה.",
      "דיווח על טעות או תקלה מתוך התוסף."
    ]
  };
  // 1.0.6 (the user): what is new by version, newest first - one who saw a version is shown only the versions after it; nothing stored -> all
  var UI_NEWS_VERS = [
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
  ];
  var ui_CSS = `
/* 1.1.0: #tm-burger and the bar's buttons (.tm-topbtn) are styled by index.html (header.topbar); nothing here */
html,body{overscroll-behavior:none}
.tm-src{font-size:.74em;opacity:.8;font-weight:400}
.tm-src a.tm-srcl{color:inherit;text-decoration:none;cursor:pointer}
.tm-src a.tm-srcl:hover{text-decoration:underline}
#tm-panel{position:fixed;top:calc(var(--topbar-h, 56px) + 9px);right:12px;z-index:30;width:218px;max-height:calc(100vh - var(--topbar-h, 56px) - 25px);overflow-y:auto;
  direction:rtl;text-align:right;background:rgba(12,16,24,.82);border:1px solid rgba(201,168,76,.45);
  border-radius:12px;backdrop-filter:blur(8px);color:#e8dcae;
  font:13px 'Segoe UI',Arial,sans-serif;padding:12px 14px;box-sizing:border-box}
#tm-panel .t{font-size:17px;font-weight:600;color:#f3dc9a}
#tm-panel .s{font-size:11px;color:#b9ac82;margin-bottom:8px}
#tm-panel .sec{font-size:12px;font-weight:600;color:#c9a84c;margin:10px 0 5px;
  border-bottom:1px solid rgba(201,168,76,.25);padding-bottom:2px}
#tm-views{display:grid;grid-template-columns:1fr 1fr;gap:5px}
#tm-pl-sec{margin-top:8px}
details.tm-pl{margin-top:6px;border-top:1px solid rgba(201,168,76,.2);padding-top:4px}
details.tm-pl summary{cursor:pointer;font-size:12px;font-weight:600;color:#c9a84c;padding:3px 0}
details.tm-pl>div{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:5px 0}
details.tm-ops-det>div,details.tm-ops-det>div div{display:block;grid-template-columns:none}
details.tm-ops-det>.s{margin:4px 0 2px}
details.tm-pl button,#tm-views button,#tm-panel .tm-opt button{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.32);color:#e8dcae;
  border-radius:6px;padding:5px 3px;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer;position:relative}
details.tm-pl .tm-cnt{position:absolute;left:3px;top:-7px;min-width:17px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:#c9a84c;color:#14110a;font:600 10px/16px 'Segoe UI',Arial,sans-serif;direction:ltr;text-align:center;pointer-events:none}
#tm-views button:hover,details.tm-pl button:hover,#tm-panel .tm-opt button:hover{background:rgba(201,168,76,.28)}
#tm-views.one{grid-template-columns:1fr;margin-bottom:2px}
#tm-views.one button{font-weight:700}
#tm-views button.on,details.tm-pl button.on,#tm-panel .tm-opt button.on{background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.7)}
#tm-panel .tm-opt{margin:7px 0 4px}
#tm-panel .tm-opt .cap{display:block;font-size:11px;color:#b9ac82;margin-bottom:3px}
#tm-panel .tm-opt .bb{display:grid;grid-template-columns:1fr 1fr;gap:5px}
#tm-panel .tm-opt button{font-size:11.5px;padding:4px 3px}
#tm-ops{margin-top:4px;border:1px solid rgba(201,168,76,.3);border-radius:8px;padding:4px 7px 2px;background:rgba(201,168,76,.05)}
#tm-ops .tm-op{padding:5px 0 6px;border-bottom:1px dashed rgba(201,168,76,.22)}
#tm-ops .tm-op:last-child{border-bottom:0}
#tm-ops .tm-op .cap{display:block;font-size:11.5px;font-weight:600;color:#e8dcae;margin-bottom:2px}
#tm-ops .tm-op .src{display:block;font-size:10px;color:#b9ac82;margin-bottom:4px;line-height:1.5}
#tm-ops .tm-op .src a,#tm-panel .tm-src a{color:#f3dc9a;text-decoration:none;border-bottom:1px dotted rgba(243,220,154,.6);margin-left:5px;cursor:pointer}
#tm-ops .tm-op .src a:hover,#tm-panel .tm-src a:hover{color:#fff2c8}
#tm-ops .tm-op .bb{display:grid;grid-template-columns:1fr 1fr;gap:4px}
#tm-ops .tm-op .bb.c3{grid-template-columns:1fr 1fr 1fr}
#tm-ops .tm-op button{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.32);color:#e8dcae;border-radius:6px;padding:4px 3px;font:11px 'Segoe UI',Arial,sans-serif;cursor:pointer;line-height:1.3}
#tm-ops .tm-op button:hover{background:rgba(201,168,76,.28)}
#tm-ops .tm-op button.on{background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.7)}
#tm-ops .tm-op button:disabled{opacity:.45;cursor:default}
#tm-panel label.row{display:flex;align-items:center;gap:7px;margin:5px 0;cursor:pointer;user-select:none;flex-wrap:wrap}
#tm-panel label.row input{accent-color:#c9a84c;margin:0}
#tm-panel label.row input:disabled+span{color:#7d7560}
#tm-panel label.row .tm-src{font-size:10px;color:#b9ac82;flex-basis:100%;margin-right:19px;line-height:1.4}
#tm-units{margin-top:8px;font-size:10.5px;line-height:1.5;color:#b9ad84}
#tm-foot{margin-top:8px;font-size:10px;color:#9a8f6c;text-align:center}
#tm-nav{position:fixed;bottom:14px;left:78px;z-index:30;display:flex;gap:4px;align-items:center;flex-wrap:wrap;max-width:calc(100vw - 96px);direction:ltr}
#tm-nav button{width:26px;height:26px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(12,16,24,.75);color:#e8dcae;font-size:14px;line-height:1;cursor:pointer;backdrop-filter:blur(6px);touch-action:none;user-select:none;-webkit-user-select:none}
#tm-nav button:hover{background:rgba(201,168,76,.28)}
#tm-nav button.on{background:rgba(201,168,76,.55);color:#14110a}
#tm-nav .sp{width:5px}
#tm-nav button.tm-txt{width:auto;padding:0 9px;border-radius:13px;font:11.5px 'Segoe UI',Arial,sans-serif;direction:rtl;white-space:nowrap}
#tm-nav .tm-grp{display:flex;align-items:center;gap:3px;height:26px;padding:0 3px 0 6px;border:1px solid rgba(201,168,76,.45);border-radius:13px;background:rgba(12,16,24,.75);backdrop-filter:blur(6px);direction:rtl;color:#e8dcae;font:11.5px 'Segoe UI',Arial,sans-serif;white-space:nowrap}
#tm-nav .tm-grp button{width:20px;height:20px;font-size:13px;border-color:rgba(201,168,76,.35)}
#tm-nav .tm-grp .v{min-width:44px;text-align:center;color:#f3dc9a}
#tm-nav .tm-grp.off{opacity:.55}
#tm-nav #tm-reset-all{display:none;background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.8)}
#tm-nav #tm-reset-all:hover{background:rgba(201,168,76,.6)}
.tm-pill{position:fixed;z-index:28;display:none;left:0;top:0;transform:translate(-50%,-50%);padding:4px 11px;border-radius:14px;border:1px solid rgba(201,168,76,.6);background:rgba(12,16,24,.84);color:#f3dc9a;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer;white-space:nowrap;direction:rtl;box-shadow:0 2px 8px rgba(0,0,0,.35);user-select:none;-webkit-user-select:none}
.tm-pill:hover{background:rgba(201,168,76,.35)}
.tm-pill.on{background:rgba(201,168,76,.62);color:#14110a;border-color:rgba(255,236,170,.85)}
#tm-tip{position:fixed;z-index:120;display:none;max-width:280px;padding:6px 10px;border-radius:8px;border:1px solid rgba(201,168,76,.6);background:rgba(12,16,24,.95);color:#efe3b8;font:12px/1.5 'Segoe UI',Arial,sans-serif;direction:rtl;text-align:right;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,.45);white-space:normal}
#tm-measure-out{position:fixed;bottom:52px;left:50%;transform:translateX(-50%);z-index:31;background:rgba(12,16,24,.9);border:1px solid rgba(201,168,76,.5);color:#f3dc9a;padding:6px 12px;border-radius:8px;font-size:12px;display:none;direction:rtl;text-align:center;pointer-events:none;max-width:92vw}
body.tm-measuring canvas{cursor:crosshair}
#tm-confirm{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;direction:rtl}
#tm-confirm .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:16px 18px;max-width:340px;color:#e8dcae;text-align:center;line-height:1.6}
#tm-confirm .t{font-weight:700;color:#f3dc9a;margin-bottom:6px}
#tm-confirm .b{display:flex;gap:8px;justify-content:center;margin-top:12px}
#tm-confirm button{padding:6px 14px;border-radius:8px;border:1px solid rgba(201,168,76,.55);background:rgba(201,168,76,.18);color:#f3dc9a;cursor:pointer;font-size:13px}
#tm-confirm button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-compass{position:fixed;bottom:10px;left:12px;z-index:30;width:58px;height:58px;border-radius:50%;box-sizing:border-box;
  background:rgba(12,16,24,.75);border:1px solid rgba(201,168,76,.45);backdrop-filter:blur(6px);user-select:none;-webkit-user-select:none}
#tm-rotor{position:absolute;left:0;top:0;width:56px;height:56px;will-change:transform;pointer-events:none}
#tm-rotor .a{position:absolute;left:28px;top:28px;transform:translate(-50%,-62%);color:#e2544a;font-size:13px;line-height:1}
#tm-rotor .d{position:absolute;width:19px;height:19px;margin:-9.5px 0 0 -9.5px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font:600 10px 'Segoe UI',Arial,sans-serif;color:#e8dcae;cursor:pointer;pointer-events:auto;line-height:1}
#tm-rotor .d:hover{background:rgba(201,168,76,.4);color:#fff2c8}
#tm-rotor .d.n{color:#ff8a7e}
#tm-card{position:fixed;z-index:29;display:none;flex-direction:column;left:0;top:0;width:min(320px,86vw);max-height:46vh;overflow:hidden;box-sizing:border-box;padding:7px 10px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.65);background:rgba(12,16,24,.94);color:#e8dcae;font:12px/1.55 'Segoe UI',Arial,sans-serif;direction:rtl;text-align:right;box-shadow:0 4px 16px rgba(0,0,0,.5);backdrop-filter:blur(6px)}
#tm-card .h{flex:none;display:flex;align-items:flex-start;gap:6px;margin-bottom:4px}
#tm-card .tt{flex:1;font-weight:700;color:#f3dc9a;font-size:12.5px}
#tm-card .x{flex:none;width:20px;height:20px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;font-size:11px;line-height:1;cursor:pointer}
#tm-card .x:hover{background:rgba(201,168,76,.35)}
#tm-card .b{flex:1 1 auto;min-height:0;overflow-y:auto;white-space:normal;padding-left:4px}
#tm-card .r{flex:none;margin-top:5px;padding-top:4px;border-top:1px solid rgba(201,168,76,.25);font-size:11px}
#tm-card .r a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-card .r a:hover{background:rgba(201,168,76,.3)}
#tm-panel .tm-src.row-src{display:block;font-size:10px;color:#b9ac82;margin:-3px 19px 6px 0;line-height:1.4;cursor:default}
#tm-xcard{position:fixed;z-index:29;display:none;flex-direction:column;top:calc(var(--topbar-h, 56px) + 9px);right:242px;width:min(320px,86vw);max-height:calc(100vh - var(--topbar-h, 56px) - 93px);overflow:hidden;box-sizing:border-box;padding:8px 11px 9px;border-radius:10px;border:1px solid rgba(201,168,76,.65);background:rgba(12,16,24,.94);color:#e8dcae;font:12.5px/1.6 'Segoe UI',Arial,sans-serif;direction:rtl;text-align:right;box-shadow:0 4px 16px rgba(0,0,0,.5);backdrop-filter:blur(6px)}
#tm-xcard .h{flex:none;display:flex;align-items:flex-start;gap:6px;margin-bottom:4px}
#tm-xcard .tt{flex:1;font-weight:700;color:#f3dc9a;font-size:13px;line-height:1.4}
#tm-xcard .x{flex:none;width:22px;height:22px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;font-size:12px;line-height:1;cursor:pointer}
#tm-xcard .x:hover{background:rgba(201,168,76,.35)}
#tm-search-wrap{position:sticky;top:0;z-index:2;margin:0 0 6px;padding:2px 0 4px;background:inherit}
#tm-search{width:100%;box-sizing:border-box;height:28px;padding:0 8px;border-radius:8px;border:1px solid rgba(201,168,76,.55);background:rgba(12,16,24,.9);color:#f3dc9a;font:13px 'Segoe UI',Arial,sans-serif;direction:rtl;outline:none}
#tm-search:focus{border-color:#f3dc9a;box-shadow:0 0 0 1px rgba(243,220,154,.4)}
#tm-search-none{display:none;padding:6px 2px;font-size:12px;color:#d9cfa8}
#tm-xcard.min .b,#tm-xcard.min .r{display:none}
#tm-xcard.min .h{margin-bottom:0}
#tm-xcard.min .tt{cursor:pointer}
#tm-xcard .b{flex:1 1 auto;min-height:0;overflow-y:auto;white-space:normal;padding-left:4px;color:#ddd2a8;overscroll-behavior:contain}
#tm-xcard .r{flex:none;margin-top:6px;padding-top:5px;border-top:1px solid rgba(201,168,76,.25);font-size:11px;max-height:120px;overflow-y:auto}
#tm-xcard .r a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:3px 8px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-xcard .r a:hover{background:rgba(201,168,76,.3)}
#tm-xcard .b{white-space:pre-line}
#tm-xcard .o,#tm-card .o{flex:none;margin-top:5px;padding-top:4px;border-top:1px solid rgba(201,168,76,.25);font-size:11px;line-height:1.5;color:#b9ac82}
#tm-xcard.min .o{display:none}
#tm-xcard .o .g,#tm-card .o .g{display:block}
#tm-xcard .o .k,#tm-card .o .k{margin-left:3px}
#tm-xcard .o a,#tm-card .o a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-xcard .o a:hover,#tm-card .o a:hover{background:rgba(201,168,76,.3)}
#tm-xcard .o a.on,#tm-card .o a.on{background:rgba(201,168,76,.5);color:#14110a;border-color:rgba(255,236,170,.85);cursor:default}
#tm-news li.v{list-style:none;font-weight:700;color:#f3dc9a;margin:7px 0 2px}
#tm-report,#tm-printdlg,#tm-news,#tm-help{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;direction:rtl}
#tm-printdlg .box,#tm-news .box,#tm-help .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:12px 14px;width:min(320px,90vw);box-sizing:border-box;color:#e8dcae;font:12.5px/1.5 'Segoe UI',Arial,sans-serif;text-align:right}
#tm-printdlg .t,#tm-news .t,#tm-help .t{font-weight:700;color:#f3dc9a;margin-bottom:6px;font-size:13.5px}
#tm-printdlg .b,#tm-news .b,#tm-help .b{display:flex;gap:8px;margin-top:10px}
#tm-printdlg .b button,#tm-news .b button,#tm-help .b button{flex:1;padding:5px 6px;border-radius:7px;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;cursor:pointer;font:12px 'Segoe UI',Arial,sans-serif}
#tm-printdlg .b button.y,#tm-news .b button.y,#tm-help .b button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-printdlg .b button:disabled{opacity:.5;cursor:default}
#tm-news,#tm-help{background:rgba(0,0,0,.35)}
#tm-news .box,#tm-help .box{width:min(340px,90vw);max-height:calc(100vh - var(--topbar-h, 56px) - 40px);overflow-y:auto}
#tm-help .box{width:min(400px,92vw)}
#tm-help h4{margin:9px 0 3px;font-size:12.5px;color:#f3dc9a}
#tm-help h4:first-of-type{margin-top:2px}
#tm-help ul{margin:0;padding:0 16px 0 0;list-style:disc}
#tm-help li{margin:2px 0}
#tm-help kbd{font:11px Consolas,'Segoe UI',monospace;background:rgba(255,255,255,.08);border:1px solid rgba(201,168,76,.35);border-radius:4px;padding:0 4px}
#tm-news ul{margin:2px 0 0;padding:0 16px 0 0;list-style:disc}
#tm-news li{margin:2px 0}
#tm-print{display:none}
@media print{
  @page{size:A4 landscape;margin:10mm}
  html,body{background:#fff !important;color:#000 !important;width:auto !important;height:auto !important;overflow:visible !important}
  body>*:not(#tm-print){display:none !important}
  #tm-print{display:block !important;direction:rtl;text-align:right;color:#000;font:11pt/1.5 'Segoe UI',Arial,sans-serif}
  #tm-print h1{font-size:15pt;font-weight:700;margin:0 0 3mm}
  #tm-print img{display:block;max-width:100%;max-height:150mm;margin:0 auto 4mm;object-fit:contain}
  #tm-print .tt{font-size:12pt;font-weight:700;margin:0 0 1mm}
  #tm-print .tx{white-space:pre-line}
  #tm-print .tm-src{font-size:.8em;opacity:1}
  #tm-print .cr{font-size:9pt;color:#555;margin:1mm 0 0}
  #tm-print .pg2{break-before:page;page-break-before:always}
  #tm-print .rs a{color:#000}
  #tm-print .rs{margin-top:2mm;font-size:9.5pt;color:#333}
}
#tm-report .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:12px 14px;width:min(340px,90vw);box-sizing:border-box;color:#e8dcae;font:12.5px/1.5 'Segoe UI',Arial,sans-serif;text-align:right}
#tm-report .t{font-weight:700;color:#f3dc9a;margin-bottom:6px;font-size:13.5px}
#tm-report .ty{display:flex;gap:5px;margin-bottom:7px}
#tm-report .ty button,#tm-report .b button{flex:1;padding:5px 6px;border-radius:7px;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;cursor:pointer;font:12px 'Segoe UI',Arial,sans-serif}
#tm-report .ty button.on{background:rgba(201,168,76,.45);color:#fff2c8;border-color:rgba(201,168,76,.8)}
#tm-report textarea{width:100%;box-sizing:border-box;height:110px;resize:vertical;padding:6px 8px;border-radius:7px;border:1px solid rgba(201,168,76,.5);background:rgba(12,16,24,.9);color:#f3dc9a;font:12.5px/1.5 'Segoe UI',Arial,sans-serif;direction:rtl;outline:none}
#tm-report textarea:focus{border-color:#f3dc9a}
#tm-report .n{font-size:10.5px;color:#9a8f6c;margin:4px 0 0}
#tm-report .b{display:flex;gap:8px;margin-top:9px}
#tm-report .b button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-report .b button:disabled{opacity:.5;cursor:default}
#tm-panel,#tm-card .b,#tm-xcard .b,#tm-xcard .r,#tm-tour-box .body,#tm-tour-box .bub{scrollbar-width:thin;scrollbar-color:rgba(201,168,76,.5) transparent}
@media(max-width:${ui_PHONE_MAX}px){#tm-nav .tm-grp .cap{display:none}
  #tm-xcard{left:8px;right:8px;top:auto;bottom:76px;width:auto;max-height:min(42vh,calc(50vh - 60px))}
  #tm-xcard .r{max-height:66px}
  #tm-panel{max-height:calc(100vh - 132px)}}
`;
  async function buildUI(ctx) {
    try {
      const uiGroup = new Group();
      uiGroup.name = "ui";
      if (ctx.root && ctx.root.add) ctx.root.add(uiGroup);
      if (!Array.isArray(ctx.animated)) ctx.animated = [];
      if (!ctx.shared) ctx.shared = {};
      if (!ctx.layers) ctx.layers = {};
      // fallback = the 10-core.js CO values (used only if ctx.CO is missing): 1.0.1-L the Sea in the court's CORNER x 80, z -54 (Rashi) /
      // +54 (L.7), the block of bases round x 30 in the rows z 33 / 45 with Moses' laver between them at z 39 (L.77; vessels-2.md), the house wall 7 / 6 / 5 / 4 (K.2)
      const CO = ctx.CO || { seaX: 80, seaZ: 54, seaZRashi: -54, kiyorX: 30, mechX: 30, mechZ: [33, 45], xUlamE: 18.5, xHouseE: 2.5, HOUSE_WALL: [7, 6, 5, 4], zHouseS: 27, xHeiW: -80.5 };
      const LVL = ctx.LV || { HAR: 0, AZ: 6, HEI: 12 };
      // 1.0.1-L: the one phone rule (ui_PHONE_MAX; the CSS media rule is built from the same number)
      const isPhone = (w) => (w == null ? window.innerWidth || 0 : w) <= ui_PHONE_MAX;
      // The four hide-lists (FIXES-1.0.1-K.md 0.5a), all CLOSED by default and opened ONLY by their on-model buttons (1.0.1-K: no view,
      // place, table row, label or presentation call opens them): ctx.cutaway (the house: its south wall, roof and the interior pieces on
      // that side), ctx.yatziaCut (the chambers' outer walls, all three sides), ctx.ulamCut (the ulam's front wall and roof),
      // ctx.forestBoardsCut (60-palace.js: the boards of the roofing of בית יער הלבנון, to show the beams). Any list may be missing.
      let cutOn = false;
      let yatziaOpen = false, ulamOpen = false;
      let boardsOff = false;
      const layerRows = {};
      const cutList = (a) => Array.isArray(a) ? a : [];
      // one pass sets the visibility of every object of the four "hide" lists, so an object listed in two of them stays hidden while
      // either switch is on and comes back only when both are off
      const applyHidden = function() {
        const hide = new Set();
        if (cutOn) for (const m of cutList(ctx.cutaway)) hide.add(m);
        if (yatziaOpen) for (const m of cutList(ctx.yatziaCut)) hide.add(m);
        if (ulamOpen) for (const m of cutList(ctx.ulamCut)) hide.add(m);
        if (boardsOff) for (const m of cutList(ctx.forestBoardsCut)) hide.add(m);
        for (const list of [ctx.cutaway, ctx.yatziaCut, ctx.ulamCut, ctx.forestBoardsCut]) {
          for (const m of cutList(list)) if (m) m.visible = !hide.has(m);
        }
        for (const m of cutList(ctx.interiorOnly)) {
          if (m) m.visible = cutOn;
        }
      };
      // (the on-model pills read the state through get() every frame, so nothing else has to be kept in sync)
      const setCutaway = function(on) {
        cutOn = !!on;
        applyHidden();
      };
      const setYatziaCut = function(on) {
        yatziaOpen = !!on;
        applyHidden();
      };
      const setUlamCut = function(on) {
        ulamOpen = !!on;
        applyHidden();
      };
      const setBoardsOff = function(on) {
        boardsOff = !!on;
        applyHidden();
        // 1.0.1-L (K review follow-up): the labels that name the boards go with them (60-palace.js's layer group; its per-frame hook keeps it in step whoever hides them)
        if (ctx.layers && ctx.layers.forestBoards) ctx.layers.forestBoards.visible = !boardsOff;
      };
      // Optional layers (ctx.layers.aliyot / ulamRambam / palace): Groups built by the other modules with visible=false.
      const layerMarks = {};   // 1.0.1-H: layers that are chosen in the opinions table (aliyot, ulamRambam) mark their row there
      const setLayer = function(name, on) {
        const g = ctx.layers && ctx.layers[name];
        if (g) g.visible = !!on;
        const row = layerRows[name];
        if (row) row.checked = !!on;
        if (typeof layerMarks[name] === "function") {
          try {
            layerMarks[name](!!on);
          } catch (_) {
          }
        }
        return !!g;
      };
      // ===== labels =====
      const labelGroup = new Group();
      labelGroup.name = "labels";
      // the engine's sprite maker (makeLabelSprite2 in 90-entry.js) when it is in scope; ui_makeLabelSprite is the fallback copy
      const mkLabel = typeof makeLabelSprite2 === "function" ? makeLabelSprite2 : ui_makeLabelSprite;
      for (const l of Array.isArray(ctx.labels) ? ctx.labels : []) {
        try {
          if (!l || !l.text) continue;
          const spr = mkLabel(String(l.text), l.size);
          spr.position.set(l.x || 0, l.y || 0, l.z || 0);
          // CONTRACT (no position heuristic): a label that belongs to an optional layer carries an explicit
          // {layer: "aliyot" | "ulamRambam" | "palace"} = the key of its ctx.layers group, and is shown only while that layer is
          // on. 50-heichal.js pushes its layer labels here (with the layer field); 60-palace.js still builds its labels as sprites
          // inside its own layer group (with its own scaling loop) and pushes to ctx.labels only as a fallback, so the "תוויות"
          // toggle does not reach them. Every other label - e.g. 20-mount's "השער הדרומי" at z 341.5,
          // or a future high label - is an ordinary label and stays visible.
          // 1.0.1-H: a label may belong to SEVERAL layers at once (`layers: ["palace", "forestRashi"]`, 60-palace.js: the labels of a
          // reading of בית יער הלבנון) - it is shown only while every listed layer group is visible
          spr.userData.layers = Array.isArray(l.layers) ? l.layers.slice() : l.layer ? [l.layer] : null;
          spr.userData.label = l;   // 1.0.1-H: a click on the label shows its explanation and sources (see "labels -> sources" below)
          labelGroup.add(spr);
        } catch (_) {
        }
      }
      uiGroup.add(labelGroup);
      for (const spr of labelGroup.children) spr.userData.base = spr.scale.clone();
      ctx.animated.push(function() {
        const cp = ctx.camera.position;
        for (const spr of labelGroup.children) {
          const d = cp.distanceTo(spr.position);
          const sz = spr.userData.base.y;
          const k = Math.min(1.5, Math.max(0.3, d / 170));
          spr.scale.set(spr.userData.base.x * k, spr.userData.base.y * k, 1);
          let vis = d < (sz > 18 ? 1800 : sz > 11 ? 700 : 330);
          const lays = spr.userData.layers;
          if (vis && lays) {
            for (const lay of lays) {
              const g = ctx.layers[lay];
              if (!g || !g.visible) { vis = false; break; }
            }
          }
          spr.visible = vis;
        }
      });
      // ===== occluder fade loop (1.0.19) =====
      // 1.0.1-K (Yossi: "שהחומות יהיו שקופות לא לגמרי, שיאחזו שיש חומה. להוסיף כפתור טשטוש וחסימת חומות. וכן להוסיף כפתור להגדיל את המרחק
      // של הטשטוש"): a blocking wall fades to UI_FADE_OPACITY (0.35; it was 0.1, the wall all but vanished); the fade can be switched off
      // (walls block) and its distance changed (fadeState.dist, 60..400 amot, default 120 = the 1.0.19 FADE_DIST) from the nav row; both
      // are remembered per viewer (localStorage, wrapped: the page works the same without it)
      const UI_FADE_OPACITY = 0.35;
      const UI_FADE_STOPS = [60, 80, 100, 120, 150, 200, 250, 300, 400];
      const lsGet = (k) => {
        try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (_) { return null; }
      };
      const lsSet = (k, v) => {
        try { if (window.localStorage) window.localStorage.setItem(k, String(v)); } catch (_) {}
      };
      if (!ctx.shared.fadeState) ctx.shared.fadeState = { on: true, dist: 120 };
      {
        const fs0 = ctx.shared.fadeState, sOn = lsGet("tm1.fade.on"), sDist = +lsGet("tm1.fade.dist");
        if (sOn === "0" || sOn === "1") fs0.on = sOn === "1";
        fs0.hide = !!fs0.on && lsGet("tm1.fade.hide") === "1";   // 1.0.2 (D): the second mode "טשטוש: גם קיר מסתיר" (default off: the fade as before)
        fs0.dist = UI_FADE_STOPS.indexOf(sDist) >= 0 ? sDist : typeof fs0.dist === "number" ? fs0.dist : 120;
      }
      {
        const OCCL = ctx.H && Array.isArray(ctx.H.OCC) ? ctx.H.OCC : [], ray = new Raycaster(), fs = ctx.shared.fadeState;
        const dir = new Vector3(), right = new Vector3(), upv = new Vector3(), to = new Vector3(), dd = new Vector3();
        // 1.0.1-K (K.9b; K.6's report: ghost walls inside the throne hall, the king's house and לשכת הגזית): under a roof - an interior
        // view - the rays around the target (+-20 / +-16) and the "near" rays along the view (through the target, up to the fade distance)
        // hit the room's OWN walls and faded them; there only the direct line from the camera to its target clears what blocks it. "Under a
        // roof" = a ray straight up from the camera meets a visible, solid part of the model within 60 amot (the model's large meshes -
        // plain, or instanced with up to 2000 copies, e.g. the 45 boards of בית יער הלבנון - cached for 4 s; the sky, the terrain and the
        // cloud are not part of the test).
        const OFFS5 = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]], OFFS1 = [[0, 0]], OFFS0 = [];
        const upRay = new Raycaster(), UPV = new Vector3(0, 1, 0);
        let roofT = null, roofAt = -1e9;
        const roofList = () => {
          const now = performance.now();
          if (roofT && now - roofAt < 4000) return roofT;
          roofAt = now;
          roofT = [];
          const bb = new Box3(), sz = new Vector3();
          if (ctx.root && typeof ctx.root.traverse === "function") {
            ctx.root.traverse((o) => {
              if (!o.isMesh || !o.geometry) return;
              for (let p = o; p; p = p.parent) if (p.name === "tm-kk-cloud") return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (pa && pa.count > 30000) return;   // the terrain
              if (o.isInstancedMesh) {
                if (o.count > 2000 || typeof o.computeBoundingBox !== "function") return;
                if (!o.boundingBox) o.computeBoundingBox();
                bb.copy(o.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
              } else {
                if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
                bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
              }
              if (Math.max(sz.x, sz.z) < 6) return;
              roofT.push(o);
            });
          }
          return roofT;
        };
        const underRoof = (cam) => {
          upRay.set(cam, UPV);
          upRay.near = 0;
          upRay.far = 60;
          for (const h of upRay.intersectObjects(roofList(), false)) {
            let vis = true;
            for (let p = h.object; p; p = p.parent) if (p.visible === false) { vis = false; break; }
            if (!vis) continue;
            const m = Array.isArray(h.object.material) ? h.object.material[0] : h.object.material;
            if (m && (m.visible === false || (m.transparent && m.opacity < 0.5))) continue;
            return true;
          }
          return false;
        };
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
        const HIDE_PASS_FLAT = 0.06;
        let hideT = null, hideAt = -1e9;
        const hidePair = new Map(), hideBlocked = new Set(), hideHits = [], HID = [], hideFlat = new Set(), hideSmall = new Set(), hideDeep = new Set();
        const hideBB = new Box3(), hideSz = new Vector3(), hideN = new Vector3();
        const hideTo = (o) => (hideDeep.has(o) ? HIDE_PASS_FLAT : UI_FADE_OPACITY);   // 1.0.4: how far a hidden mesh fades
        const hideList = () => {
          const now = performance.now();
          if (hideT && now - hideAt < 5000) return hideT;
          hideAt = now;
          const occS = new Set(OCCL), out = [], stems = new Map();
          hidePair.clear();
          hideFlat.clear();
          hideSmall.clear();
          for (const top of ctx.root && Array.isArray(ctx.root.children) ? ctx.root.children : []) {
            if (HIDE_GROUPS.indexOf(top.name) < 0) continue;
            top.traverse((o) => {
              // 1.0.4: an instanced mesh of up to HIDE_INST copies too (Yachin and Boaz in the ulam, whose shafts stopped the orbit round the ulam's tables:
              // the two fade together); not the forest house's 45 columns
              if (!o.isMesh || (o.isInstancedMesh && !(o.count <= HIDE_INST && typeof o.computeBoundingBox === "function")) || !o.geometry || occS.has(o) || o.userData.noPick) return;
              for (let p = o; p; p = p.parent) if (p.name === "tm-kk-cloud") return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (!pa || pa.count > 30000) return;
              if (o.isInstancedMesh) {
                if (!o.boundingBox) o.computeBoundingBox();
                hideBB.copy(o.boundingBox);
              } else {
                if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
                hideBB.copy(o.geometry.boundingBox);
              }
              hideBB.applyMatrix4(o.matrixWorld).getSize(hideSz);
              const hz = Math.max(hideSz.x, hideSz.z), flat = hideSz.y < 0.15 * hz;
              // 1.0.4: for the pass also what is 4 high but narrower than 5 (1 at least): the devir's door leaves, which hid Moses' menorah from the devir,
              // a cherub, the parochet
              const small = !flat && hideSz.y >= 4 && hz < 5 && hz >= 1;
              if ((hz < 5 && !small) || (!flat && hideSz.y < 4)) return;
              out.push(o);
              o.userData.tmPass = true;   // 1.0.4: 90-entry.js lets the camera through it round a thing one flew to
              if (flat) hideFlat.add(o);   // 1.0.4: a ceiling, a roof, a floor: the pass only
              if (small) hideSmall.add(o);   // 1.0.4: the pass only
              const sm = /^(.+)-(?:stone|cedar)$/.exec(o.name || "");
              if (sm) {
                const k = (o.parent ? o.parent.uuid : "") + "|" + sm[1];
                if (!stems.has(k)) stems.set(k, []);
                stems.get(k).push(o);
              }
            });
          }
          for (const g of stems.values()) if (g.length > 1) for (const o of g) hidePair.set(o, g);
          hideT = out;
          return out;
        };
        const hideShown = (o) => {
          for (let p = o; p; p = p.parent) if (p.visible === false) return false;
          return true;
        };
        const hideStart = (m) => {
          const ud = m.userData, orig = m.material;
          let clone = ud.tmHideClone;
          if (!clone || ud.tmHideOrig !== orig) {
            clone = Array.isArray(orig) ? orig.map((x) => x.clone()) : orig.clone();
            ud.tmHideClone = clone;
            ud.tmHideOrig = orig;
          }
          const base = Array.isArray(orig) ? orig.map((x) => (typeof x.opacity === "number" ? x.opacity : 1)) : typeof orig.opacity === "number" ? orig.opacity : 1;
          for (const c of Array.isArray(clone) ? clone : [clone]) {
            c.transparent = true;
            c.depthWrite = false;
            c.needsUpdate = true;
          }
          m.material = clone;
          const st = { m, orig, clone, base, cur: 1, tgt: 1 };
          ud.fade = st;
          HID.push(st);
          return st;
        };
        const hideHas = (m) => {
          for (let i = 0; i < HID.length; i++) if (HID[i].m === m) return HID[i];
          return null;
        };
        const hideDrop = (i) => {
          const st = HID[i];
          if (st.m.userData.fade === st) delete st.m.userData.fade;
          HID[i] = HID[HID.length - 1];
          HID.pop();
        };
        let last = -1e9;
        ctx.animated.push(function(t) {
          if (t - last > 140) {
            last = t;
            const blocked = new Set();
            hideBlocked.clear();
            hideDeep.clear();
            const FADE_DIST = typeof fs.dist === "number" && fs.dist > 0 ? fs.dist : 120;   // a wall fades only within this many amot of the camera
            if (fs.on) {
              const cam = ctx.camera.position, tg = ctx.controls.target;
              let inside = false;
              try { inside = underRoof(cam); } catch (_) { inside = false; }
              dir.subVectors(tg, cam).normalize();
              right.crossVectors(dir, ctx.camera.up).normalize();
              upv.crossVectors(right, dir).normalize();
              for (const [ox, oy] of inside ? OFFS1 : OFFS5) {
                to.copy(tg).addScaledVector(right, ox * 20).addScaledVector(upv, oy * 16);
                dd.subVectors(to, cam);
                const L = dd.length();
                ray.set(cam, dd.normalize());
                ray.near = 0;
                // 1.0.1-K review (ui-3): 3 amot short of the target (was 1): with a far "מרחק טשטוש" these rays reach the target, and the
                // face of the wall it stands in faded with them (the eastGate view at 400: the gate's own wall); 3 = model choice
                ray.far = Math.min(L - 3, FADE_DIST);
                for (const h of ray.intersectObjects(OCCL, false)) blocked.add(h.object);
              }
              // 1.0.16: a wall right in front of the camera (within NEAR amot along the view direction) fades too,
              // even when the orbit target is on this side of it / on the wall itself (e.g. close to a gate).
              // 1.0.1-K: not under a roof (see above)
              // 1.0.1-K review (ui-3): NEAR keeps the 1.0.19 reach (120) at most - these rays go on past the target on purpose (a wall
              // the target stands on), so NEAR = FADE_DIST (up to 400) ghosted the walls far behind the target (eastGate at 400: a third
              // of the screen); a larger distance now lengthens only the rays toward the target above
              const NEAR = Math.min(FADE_DIST, 120);
              for (const [ox, oy] of inside ? OFFS0 : OFFS5) {
                to.copy(cam).addScaledVector(dir, NEAR).addScaledVector(right, ox * 8).addScaledVector(upv, oy * 6);
                dd.subVectors(to, cam);
                ray.set(cam, dd.normalize());
                ray.near = 0;
                ray.far = NEAR + 2;
                for (const h of ray.intersectObjects(OCCL, false)) blocked.add(h.object);
              }
              // 1.0.2 (D): the building's walls that hide the target (see above); 1.0.4: and the pass (see above)
              let pass = false;
              try { pass = typeof ctx.camPass === "function" && !!ctx.camPass() && typeof ctx.camPassHit === "function"; } catch (_) { pass = false; }
              if (fs.hide || pass) {
                const list = hideList();
                for (const [ox, oy] of inside ? OFFS1 : OFFS5) {
                  to.copy(tg).addScaledVector(right, ox * 1.5).addScaledVector(upv, oy * 1.5);
                  dd.subVectors(to, cam);
                  const far = Math.min(dd.length() - (pass ? HIDE_PASS_SHORT : 2), FADE_DIST);
                  if (!(far > 0.5)) continue;
                  ray.set(cam, dd.normalize());
                  ray.near = 0;
                  ray.far = far;
                  hideHits.length = 0;
                  ray.intersectObjects(list, false, hideHits);
                  for (const h of hideHits) {
                    const o = h.object;
                    if (hideBlocked.has(o) || !hideShown(o)) continue;
                    if (pass) {
                      if (!ctx.camPassHit(h, ray.ray.direction)) continue;   // a floor under the target
                    } else if (hideFlat.has(o) || hideSmall.has(o)) continue;
                    else if (h.face) {
                      hideN.copy(h.face.normal).transformDirection(o.matrixWorld);
                      if (Math.abs(hideN.y) > 0.7) continue;
                    }
                    hideBlocked.add(o);
                    if (pass && hideFlat.has(o)) hideDeep.add(o);
                    const pr = hidePair.get(o);
                    if (pr) for (const q of pr) hideBlocked.add(q);
                  }
                }
                hideHits.length = 0;
              }
            }
            for (const m of OCCL) m.userData.fade.tgt = blocked.has(m) ? UI_FADE_OPACITY : 1;
            for (const m of OCCL) {
              const fw = m.userData.fadeWith;
              if (fw && blocked.has(fw)) m.userData.fade.tgt = UI_FADE_OPACITY;
            }
            for (let i = 0; i < HID.length; i++) HID[i].tgt = hideBlocked.has(HID[i].m) ? hideTo(HID[i].m) : 1;
            for (const o of hideBlocked) if (!hideHas(o)) hideStart(o).tgt = hideTo(o);
          }
          // 1.0.2 (D): the building's walls toward their target; whole again -> the shared material back
          for (let i = HID.length - 1; i >= 0; i--) {
            const st = HID[i];
            if (st.m.material !== st.clone) {   // another module changed the material meanwhile: it wins
              hideDrop(i);
              continue;
            }
            if (Math.abs(st.cur - st.tgt) < 4e-3) {
              if (st.tgt >= 1) {
                st.m.material = st.orig;
                hideDrop(i);
              }
              continue;
            }
            st.cur += (st.tgt - st.cur) * 0.2;
            if (Array.isArray(st.clone)) for (let k = 0; k < st.clone.length; k++) st.clone[k].opacity = st.base[k] * st.cur;
            else st.clone.opacity = st.base * st.cur;
          }
          for (const m of OCCL) {
            const f = m.userData.fade;
            if (Math.abs(f.cur - f.tgt) < 4e-3) continue;
            f.cur += (f.tgt - f.cur) * 0.2;
            const mat = m.material, tr = f.cur < 0.99;
            if (mat.transparent !== tr) {
              mat.transparent = tr;
              mat.depthWrite = !tr;
              mat.needsUpdate = true;
            }
            mat.opacity = f.cur;
          }
        });
      }
      window.__TM_CTX = ctx; // debug hook for DEV/tests (labels, camera, controls)
      setCutaway(false);
      // ===== panel =====
      const style = document.createElement("style");
      style.textContent = ui_CSS;
      document.head.appendChild(style);
      // 1.1.0: the burger lives in the top bar of index.html (header.topbar .tb-start); created here only if the page has none
      let burger = document.getElementById("tm-burger");
      if (!burger) {
        burger = document.createElement("button");
        burger.id = "tm-burger";
        burger.type = "button";
        burger.title = "הצג/הסתר לוח בקרה";
        document.body.appendChild(burger);
      }
      burger.textContent = "✕";
      const panel = document.createElement("div");
      panel.id = "tm-panel";
      document.body.appendChild(panel);
      const title = document.createElement("div");
      title.className = "t";
      title.textContent = "בית המקדש הראשון";
      const sub = document.createElement("div");
      sub.className = "s";
      sub.textContent = "מלכים א ו–ז · דברי הימים ב ג–ד · חז״ל ומפרשים";
      panel.appendChild(title);
      panel.appendChild(sub);
      burger.addEventListener("click", () => {
        const hidden = panel.style.display === "none";
        panel.style.display = hidden ? "" : "none";
        burger.textContent = hidden ? "✕" : "☰";
      });
      // the phone layout (panel closed) is decided once the real window size is known: a page booted in a hidden tab sees innerWidth 0
      // and 1.0.1 took that for a phone (review ui-zero-width-boot-hides-panel) - then the decision waits for a resize or the next ticks
      {
        let decided = false, iv = null;
        const decide = () => {
          if (decided) return;
          const w = window.innerWidth || 0;
          if (w < 2) return;
          decided = true;
          window.removeEventListener("resize", decide);
          if (iv) clearInterval(iv);
          if (isPhone(w)) {
            panel.style.display = "none";
            burger.textContent = "☰";
          }
        };
        decide();
        if (!decided) {
          window.addEventListener("resize", decide);
          iv = setInterval(decide, 400);
        }
      }
      const hidePanelOnPhone = () => {
        if (isPhone()) {
          panel.style.display = "none";
          burger.textContent = "☰";
        }
      };
      // 1.0.1-H (the user: "הוסף מקורות להכל"): a row may carry its sources - opts.src = [[label, ref], ...] - shown as small links under it
      // (refLinks is defined with the Otzaria opener below; the rows are built after it)
      const toggleRow = function(text, checked, onChange, opts) {
        const lab = document.createElement("label");
        lab.className = "row";
        const inp = document.createElement("input");
        inp.type = "checkbox";
        inp.checked = !!checked;
        if (opts && opts.disabled) {
          inp.disabled = true;
          lab.title = opts.title || "השכבה לא נטענה";
        }
        inp.addEventListener("change", () => {
          try {
            onChange(inp.checked);
          } catch (_) {
          }
        });
        const span = document.createElement("span");
        span.textContent = text;
        lab.appendChild(inp);
        lab.appendChild(span);
        panel.appendChild(lab);
        // 1.0.1-K (review UI-H2-3): the sources go AFTER the label, not inside it - a click on their caption toggled the checkbox
        if (false && opts && Array.isArray(opts.src) && opts.src.length) {   // 1.1.0: no sources in the tree (they stay in the cards)
          const s = document.createElement("div");
          s.className = "tm-src row-src";
          s.appendChild(document.createTextNode(opts.srcLabel || "מקור: "));
          refLinks(s, opts.src);
          panel.appendChild(s);
        }
        return inp;
      };
      // (1.0.1-H: the 1.0.0 two-button rows `optRow` were replaced by the opinions table below)
      // 1.0.1-H: the opinions table (the user: "את השיטות תנסה להכניס לתוך מסגרת מסודרת"): one row per dispute - the subject, its sources as
      // links, and the readings as buttons (2 or 3); picking one calls onPick(key), marks the button, shows the reading's explanation in the
      // info box and, when the row has `fly`, flies to the spot. Rows whose model switch is missing are shown disabled.
      // row = { cap, refs, options: [[key, label, info, infoRefs?]], current, onPick, fly?: () => void, disabled? }; returns { mark }
      const opsBox = document.createElement("div");
      opsBox.id = "tm-ops";
      // 1.0.1-H: every row is also kept in OPS (with row.mark and row.cur = the key now shown) for the presentation (75-tour.js, ctx.ui)
      const OPS = [];
      // 1.0.2 (item 4): a row with an id (the ctx.shared key of its switch) is found by the cards' chips: OPS_BY_ID[id]; row.short = its
      // name in a card with two rows, row.chips = { key: the chip's short label }, row.cardFly = a chip also flies (the subject moves)
      const OPS_BY_ID = {};
      const opRow = function(row) {
        OPS.push(row);
        if (row.id) OPS_BY_ID[row.id] = row;
        row.cur = row.current;
        const box = document.createElement("div");
        box.className = "tm-op";
        const cap = document.createElement("span");
        cap.className = "cap";
        cap.textContent = ui_stripSrc(row.cap);   // 1.1.0: no sources in the tree (they are on the card's chips)
        box.appendChild(cap);
        // 1.1.0 (the user): no sources in the tree - the row's refs stay on the card of its subject (the chips) and in the presentation
        const bb = document.createElement("div");
        bb.className = "bb" + (row.options.length === 3 ? " c3" : "");   // 1.0.1-L: three in a row; two and four in two columns
        const bts = [];
        const mark = (key) => {
          row.cur = key;
          for (const b of bts) b.el.classList.toggle("on", b.key === key);
          chipsRefresh();   // 1.0.2 (item 4): an open card's chips follow the table, whoever marked it
        };
        row.mark = mark;
        for (const [key, label, info, infoRefs] of row.options) {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = ui_stripSrc(label);   // 1.1.0: no sources in the tree
          if (b.textContent !== label) b.title = label;
          if (row.disabled) b.disabled = true;
          b.addEventListener("click", () => {
            mark(key);
            try {
              row.onPick(key);
            } catch (_) {
            }
            // 1.0.1-L (L.34): the reading's explanation opens in the floating card beside the panel (K.9b scrolled the panel to its foot)
            if (info) setInfo("__place", { text: info, refs: infoRefs || row.refs || [] }, { title: row.cap + " — " + label, anchor: b, row });   // 1.0.2: the card's chips = this row
            if (typeof row.fly === "function") {
              try {
                row.fly(key);
              } catch (_) {
              }
              // 1.0.1-K (review UI-H2-2): the row flew elsewhere - the view or place it left is no longer marked
              for (const o of btns) o.classList.remove("on");
              for (const o of placeBtns) o.classList.remove("on");
            }
            hidePanelOnPhone();
          });
          bb.appendChild(b);
          bts.push({ key, el: b });
        }
        box.appendChild(bb);
        opsBox.appendChild(box);
        mark(row.current);
        return { mark };
      };
      let chipsRefresh = () => {};   // 1.0.2 (item 4): set with the cards' chips below
      // ===== 1.0.1-L (L.34, the user: "כל פעם שלוחצים על הר הבית הוא פותח הסבר ואז צריך לגלול כדי למצוא את יתר הכפתורים"; "כן, כרטיס צף"):
      // the floating EXPLANATION CARD #tm-xcard. Until 1.0.1-K the explanation of a view / place / reading was written into #tm-info at the
      // panel's foot and the panel was scrolled to it, so the buttons went out of view. Now the panel holds the buttons only; the explanation
      // opens in a card BESIDE the panel (over the model, next to the panel's edge, its top at the height of the clicked button), with a ✕,
      // its own scroll and the source links; a new choice replaces its content; Esc or ✕ closes it; on a phone it is a bottom sheet above the
      // nav row (CSS). One card at a time: opening it closes the label's card (openCard closes this one), and the presentation closes it when
      // it starts (ctx.ui.card.close). setInfo keeps its old signature and fills the card (ctx.ui.setInfo). =====
      let closeLabelCard = () => {};   // the label's card (set below, where it is built)
      const xcard = document.createElement("div");
      xcard.id = "tm-xcard";
      xcard.setAttribute("role", "dialog");
      xcard.setAttribute("aria-label", "הסבר ומקורות");
      const xHead = document.createElement("div");
      xHead.className = "h";
      const xTitle = document.createElement("span");
      xTitle.className = "tt";
      const xClose = document.createElement("button");
      xClose.type = "button";
      xClose.className = "x";
      xClose.textContent = "✕";
      xClose.title = "סגור את ההסבר (Esc)";
      // 1.0.1-L (the user, on the card over the Sea: "הבועה הזו חוסמת את המסך"): the card opens at the window's left edge, clear of the subject in the
      // middle, and ▾ folds it to its title; the fold stays for the next places, until it is opened again or the card is closed
      const xMin = document.createElement("button");
      xMin.type = "button";
      xMin.className = "x";
      const setXMin = (on) => {
        xcard.classList.toggle("min", !!on);
        xMin.textContent = on ? "▴" : "▾";
        xMin.title = on ? "פתח את ההסבר" : "קפל את ההסבר, כדי לראות את המודל";
      };
      setXMin(false);
      const toggleXMin = (e) => {
        e.stopPropagation();
        setXMin(!xcard.classList.contains("min"));
        placeXCard();
      };
      xMin.addEventListener("click", toggleXMin);
      xTitle.addEventListener("click", (e) => { if (xcard.classList.contains("min")) toggleXMin(e); });
      xHead.appendChild(xTitle);
      xHead.appendChild(xMin);
      xHead.appendChild(xClose);
      const xBody = document.createElement("div");
      xBody.className = "b";
      const xRefs = document.createElement("div");
      xRefs.className = "r";
      const xOps = document.createElement("div");   // 1.0.2 (item 4): "שיטות:" and the chips, when the subject has opinions
      xOps.className = "o";
      xOps.style.display = "none";
      xcard.appendChild(xHead);
      xcard.appendChild(xBody);
      xcard.appendChild(xRefs);
      xcard.appendChild(xOps);
      document.body.appendChild(xcard);
      let xOpen = false, xAnchor = null, xSide = null, xOpsIds = null, xRow = null;
      // ===== 1.0.2 (item 4, the user: "מעולה"): the other opinions inside the card. A card whose subject has rows in "שיטות ומחלוקות" ends with
      // "שיטות:" and one small chip per reading (the style of the card's source chips), the current one marked; a chip does what the row's
      // button does - row.mark (the table in step) and row.onPick - and a row whose subject moves with the reading (row.cardFly: the Sea's
      // corner, the height of the house, the ulam, the pillars, the forest house, the ulam's tables) flies like the row. The card stays open
      // and its chips follow; a card opened from the table itself shows the new reading's explanation. Subject -> rows: UI_OPS_V by view key,
      // UI_OPS_P by place title, UI_OPS_L by a label's text or layer (model choice: the rows that the subject's own text or picture shows). =====
      const UI_OPS_V = {
        heichalFront: ["aliyot", "ulamRambam"], aliyot: ["aliyot"],
        ulamInside: ["ulamRambam", "ulamTables"], ulamTables: ["ulamTables"],
        yachinBoaz: ["pillarCapital"], yachinBoazFull: ["pillarCapital"], boazFar: ["pillarCapital"], yachinBoazCapital: ["pillarCapital"],
        yam: ["seaPlacement"], yamOxen: ["seaPlacement"],
        kodesh: ["kodeshLayout", "kodeshOpinion"], menorot: ["kodeshLayout", "kodeshOpinion"], shulchanot: ["kodeshLayout", "kodeshOpinion"],
        shulchanMoshe: ["kodeshLayout", "kodeshOpinion"],
        devirDoor: ["devirDoor"], cherubim: ["cherubPose"],
        slaughterPlace: ["slaughterLayout"], slaughterPlaceClose: ["slaughterLayout"],
        forestInside: ["forestHouse"], forestRoof: ["forestHouse"], forestAv: ["forestHouse"], forestAlam: ["forestHouse"], forestUpper: ["forestHouse"],
        throne: ["throneVersion"], throneSteps: ["throneVersion"],
        mizbeach: ["altarLook", "altarRamps"]   // 1.0.2: the small ramps (ctx.shared.altarRamps; no row, no chips)
      };
      const UI_OPS_P = {
        "הבית (בית ה׳)": ["aliyot"], "גג הבית ותקרותיו": ["aliyot"], "העליות (רש״י דה״י ג, ד)": ["aliyot"],
        "יכין — מבעד לפתח, לכל גובהו": ["pillarCapital"], "בועז — מבעד לפתח, לכל גובהו": ["pillarCapital"],
        "סידור הכלים — עשר המנורות ועשרה השולחנות (מנחות צח:–צט.)": ["kodeshLayout", "kodeshOpinion"],
        "בית יער הלבנון": ["forestHouse"],
        // 1.0.2 (fix): the completions whose whole subject is a row of the table
        "מקום הים (רש״י / רד״ק)": ["seaPlacement"], "בית החליפות (רש״י יומא לו.)": ["ulamRambam"],
        "בית יער הלבנון — שלוש קריאות (רש״י / מלבי״ם ורלב״ג / מצודת דוד)": ["forestHouse"],
        "הכבשים הקטנים — השלמה מן הגמרא": ["altarRamps"]   // 1.0.2 add-on
      };
      const UI_OPS_L = [
        [/^(?:יכין|בועז)/, ["pillarCapital"]],
        [/^(?:הים(?:\s|$)|ים של שלמה)/, ["seaPlacement"]],
        [/^מזבח הנחושת/, ["altarLook", "altarRamps"]],
        [/^(?:היסוד|הסובב|הכבשים הקטנים|כבש קטן|שני כבשים קטנים)/, ["altarRamps"]],   // 1.0.2: the labels of 40-altar.js's yesod / sovev / ramps, if it gives them
        [/^בית יער הלבנון/, ["forestHouse"]],
        [/^כסא שלמה/, ["throneVersion"]]
      ];
      const UI_OPS_LAYER = { thronePesukim: "throneVersion", throneTargumSheni: "throneVersion", throneEstherRabbah: "throneVersion", throneBeitHamidrash: "throneVersion",
        forestRashi: "forestHouse", forestMetzudot: "forestHouse", forestMzd: "forestHouse", aliyot: "aliyot", ulamRambam: "ulamRambam" };
      // subj = { view?, title?, label?, layers? } -> the row ids (kept unfiltered: the rows are built after the places and the labels)
      const opsFor = (subj) => {
        const ids = [];
        const add = (a) => { for (const id of a || []) if (ids.indexOf(id) < 0) ids.push(id); };
        if (!subj) return ids;
        if (subj.view) add(UI_OPS_V[subj.view]);
        if (subj.title) {
          add(UI_OPS_P[subj.title]);
          const it = placeItemByT[subj.title];
          if (it) { add(UI_OPS_V[it.view]); add(UI_OPS_V[it.key]); }
        }
        if (subj.label) for (const [re, a] of UI_OPS_L) if (re.test(subj.label)) add(a);
        for (const lay of subj.layers || []) if (UI_OPS_LAYER[lay]) add([UI_OPS_LAYER[lay]]);
        return ids;
      };
      // the rows now present (an id or a row object), each once; a disabled row (its switch missing) shows no chips
      const opsLive = (ids) => {
        const out = [];
        for (const id of Array.isArray(ids) ? ids : []) {
          const r = id && typeof id === "object" ? id : OPS_BY_ID[id];
          if (r && !r.disabled && Array.isArray(r.options) && r.options.length > 1 && out.indexOf(r) < 0) out.push(r);
        }
        return out;
      };
      // a chip's words: row.chips[key], else the reading's label up to its colon, without a closing bracket
      const opsChip = (row, key) => {
        if (row.chips && row.chips[key]) return row.chips[key];
        const o = row.options.find((x) => x[0] === key);
        let s = String(o ? o[1] : key);
        const i = s.indexOf(":");
        if (i > 0 && i < 40) s = s.slice(0, i);
        s = s.replace(/\s*\([^()]*\)\s*$/, "").trim();
        return s.length > 34 ? s.slice(0, 32) + "…" : s;
      };
      const pickFromCard = (row, key) => {
        row.mark(key);
        try {
          row.onPick(key);
        } catch (_) {
        }
        if (row.cardFly && typeof row.fly === "function") {
          try {
            row.fly(key);
          } catch (_) {
          }
          for (const o of btns) o.classList.remove("on");
          for (const o of placeBtns) o.classList.remove("on");
        }
      };
      // writes the chips of the rows `ids` into host; false (and host hidden) when there is none. onPicked(row, key) after a chip's switch
      const renderChips = (host, ids, onPicked) => {
        host.textContent = "";
        const rows = opsLive(ids);
        host.style.display = rows.length ? "" : "none";
        if (!rows.length) return false;
        host.appendChild(document.createTextNode("שיטות: "));
        for (const row of rows) {
          const g = document.createElement("span");
          if (rows.length > 1) {
            g.className = "g";
            const k = document.createElement("span");
            k.className = "k";
            k.textContent = (row.short || "") + (row.short ? ":" : "");
            g.appendChild(k);
          }
          for (const [key, label] of row.options) {
            const a = document.createElement("a");
            a.href = "#";
            a.setAttribute("role", "button");
            const on = row.cur === key;
            a.className = on ? "on" : "";
            a.setAttribute("aria-pressed", on ? "true" : "false");
            ui_fillSrc(a, opsChip(row, key));
            a.title = String(label || "");
            a.addEventListener("click", (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              if (row.cur === key) return;
              pickFromCard(row, key);
              if (onPicked) onPicked(row, key);
            });
            g.appendChild(a);
          }
          host.appendChild(g);
        }
        return true;
      };
      // the panel's card: a card opened from the table (xRow) shows the new reading's explanation, as the table's button does
      const xChipPicked = (row, key) => {
        if (xRow !== row) return;
        const o = row.options.find((x) => x[0] === key);
        if (o && o[2]) setInfo("__place", { text: o[2], refs: o[3] || row.refs || [] }, { title: row.cap + " — " + o[1], anchor: xAnchor, side: xSide, row });
      };
      // the card's place: beside the panel's edge (right of the panel when it is shown, else at the window's edge), its top at the clicked
      // button's top, clamped so that it stays inside the window above the nav row; a phone uses the CSS bottom sheet (no inline top)
      const placeXCard = () => {
        if (!xOpen) return;
        const W = window.innerWidth || 0, H = window.innerHeight || 0;
        if (isPhone(W)) {
          // the bottom sheet, just above the nav row and the compass (the row wraps on a phone: its real top is measured)
          xcard.style.right = "";
          xcard.style.left = "";
          xcard.style.top = "";
          xcard.style.width = "";
          let edge = H - 70;
          for (const id of ["tm-nav", "tm-compass"]) {
            const el = document.getElementById(id);
            const r = el && typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : null;
            if (r && r.height && r.top < edge) edge = r.top;
          }
          xcard.style.bottom = (H - edge + (document.body.classList.contains("tm-measuring") ? 34 : 6)).toFixed(0) + "px";
          return;
        }
        xcard.style.bottom = "";
        const shown = panel.style.display !== "none", rightGap = shown ? 242 : 12;
        // the presentation's banner on the left (a card opened while it is paused) is never overlapped: the card narrows in a small window
        const tb = document.getElementById("tm-tour-box");
        const tr = tb && typeof tb.getBoundingClientRect === "function" ? tb.getBoundingClientRect() : null;
        const atLeft = !(tr && tr.width);   // 1.0.1-L: every card at the window's left edge, so that the subject in the middle stays clear; beside the panel only while the presentation's banner holds the left
        xcard.style.left = atLeft ? "12px" : "";
        xcard.style.right = atLeft ? "auto" : rightGap + "px";
        xcard.style.width = tr && tr.width ? Math.max(180, Math.min(340, W - rightGap - tr.right - 8)).toFixed(0) + "px" : "";
        const barH = ui_barH();   // 1.0.2: 9 px below the bar, as #tm-panel (the old 56 sat flush against the 56 px bar)
        let top = barH + 9;
        if (!atLeft && xAnchor && xAnchor.isConnected !== false && typeof xAnchor.getBoundingClientRect === "function") {
          const r = xAnchor.getBoundingClientRect();
          if (r && r.height) top = r.top - 6;
        }
        const h = xcard.offsetHeight || 200;
        top = Math.max(barH + 9, Math.min(H - h - 64, top));
        xcard.style.top = top.toFixed(0) + "px";
      };
      const xcardClose = () => {
        if (!xOpen) return;
        xOpen = false;
        xAnchor = null;
        xSide = null;
        xOpsIds = null;
        xRow = null;
        setXMin(false);
        xcard.style.display = "none";
      };
      // open(title, content, refs, anchor, side, ops?, row?): the content is plain text, or HTML when it starts with a tag (ctx.ui.card); refs = [[label, ref], ...]
      // become links; 1.0.2: ops = the rows whose chips end the card (ids or rows; none from ctx.ui.card.open), row = the table's row that opened it
      const xcardOpen = (title, text, refs, anchor, side, ops, row) => {
        closeLabelCard();   // one card at a time
        ui_fillSrc(xTitle, String(title || ""));   // 1.0.1-L (L.89)
        if (/^\s*</.test(String(text || ""))) xBody.innerHTML = String(text);
        else ui_fillSrc(xBody, String(text || ""), srcLinker(refs));   // 1.0.2 (A): the brackets open their sources
        xRefs.textContent = "";
        const rs = Array.isArray(refs) ? refs : [];
        if (rs.length) {
          xRefs.appendChild(document.createTextNode("למקור: "));
          refLinks(xRefs, rs);
        }
        xRefs.style.display = rs.length ? "" : "none";
        xOpsIds = Array.isArray(ops) && ops.length ? ops : null;
        xRow = row || null;
        renderChips(xOps, xOpsIds, xChipPicked);
        xAnchor = anchor || null;
        xSide = side || null;
        xOpen = true;
        xcard.style.display = "flex";
        xBody.scrollTop = 0;
        xRefs.scrollTop = 0;
        placeXCard();
      };
      xClose.addEventListener("click", (e) => {
        e.stopPropagation();
        xcardClose();
      });
      window.addEventListener("resize", placeXCard);
      // the panel came or went: the card moves to the panel's edge; on a phone the open panel covers the sheet, so the sheet closes
      burger.addEventListener("click", () => {
        if (isPhone() && panel.style.display !== "none") xcardClose();
        else placeXCard();
      });
      window.addEventListener("keydown", (e) => {
        if (e.defaultPrevented || (e.key !== "Escape" && e.key !== "Esc")) return;
        const had = xOpen;
        xcardClose();
        closeLabelCard();   // (the label's card closes with Esc too)
        if (had) e.preventDefault();
      });
      // ----- 1.0.1-L (L.27, the user: "תן לזה 15 שניות ויחזור אוטו"): a feature a PLACE switched on goes off by itself after ui_AUTO_OFF_S seconds,
      // with a small countdown on the place's button. One setTimeout + one 1 s interval per armed feature, nothing per frame. The feature's own
      // pill or opinion row cancels the timer and the user's state stays; a feature the user switched on by its pill is never armed; the pills
      // themselves are not timed; "↺ החזר הכל" and the presentation cancel the timers (ctx.ui.autoOff); an animation with its own duration is
      // exempt (feature.timed === false: the king's ascent). -----
      const AUTO = new Map();   // feature key -> { off, left, badge, timer, tick }
      const autoClear = (key) => {
        const a = AUTO.get(key);
        if (!a) return false;
        clearTimeout(a.timer);
        clearInterval(a.tick);
        if (a.badge && a.badge.parentNode) a.badge.parentNode.removeChild(a.badge);
        AUTO.delete(key);
        return true;
      };
      const autoOff = {
        seconds: ui_AUTO_OFF_S,
        arm: (key, off, btn) => {
          autoClear(key);
          const a = { off, left: ui_AUTO_OFF_S, badge: null, timer: 0, tick: 0 };
          if (btn) {
            a.badge = document.createElement("span");
            a.badge.className = "tm-cnt";
            a.badge.textContent = String(a.left);
            btn.appendChild(a.badge);
          }
          a.tick = setInterval(() => {
            a.left = Math.max(0, a.left - 1);
            if (a.badge) a.badge.textContent = String(a.left);
          }, 1000);
          a.timer = setTimeout(() => {
            autoClear(key);
            try { off(); } catch (_) {}
          }, ui_AUTO_OFF_S * 1000);
          AUTO.set(key, a);
        },
        // cancel(key): that feature's timer, cancel(): every timer; the features stay as they are
        cancel: (key) => {
          if (key != null) return autoClear(key);
          for (const k of Array.from(AUTO.keys())) autoClear(k);
          return true;
        },
        pending: () => Array.from(AUTO.keys()),   // the features now waiting for their timer (their ctx.shared keys)
        // the place's click: its feature on; a timer unless the user had it on by its own pill, or it is an animation with its own end
        run: (F, btn) => {
          if (!F || typeof F.on !== "function") return;
          const armed = AUTO.has(F.key), was = !!F.isOn();
          if (!was) F.on();
          if (F.timed !== false && typeof F.off === "function" && (!was || armed)) autoOff.arm(F.key, F.off, btn);
        },
        // "↺ החזר הכל": what the timers would have switched off goes back now, and no timer stays
        flush: () => {
          for (const [k, a] of Array.from(AUTO.entries())) {
            autoClear(k);
            try { a.off(); } catch (_) {}
          }
        }
      };
      // ----- Otzaria: open a source at book id + line index (reader.openBook, permission "reader.open"); 1.0.1-L (Part 7, U2): Otzaria only, no other site -----
      const tmToast = (msg) => {
        const t = document.getElementById("toast");
        if (!t) return;
        t.textContent = msg;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 6000);
      };
      const errText = (res) => {
        if (res && res.error) return (res.error.code || "") + (res.error.message ? " – " + res.error.message : "");
        return "no result (" + JSON.stringify(res) + ")";
      };
      const okRes = (res) => !!res && res.success !== false && res.data !== false && res.data !== null && res.data !== undefined;
      const callT = (method, params, ms) => Promise.race([
        window.Otzaria.call(method, params),
        new Promise((resolve) => setTimeout(() => resolve({ success: false, error: { code: "timeout", message: method + " >" + (ms || 5000) + "ms" } }), ms || 5000))
      ]);
      // After a successful open, make sure the book's tab is the active one (the API docs do not promise that it is).
      const focusBook = async (book) => {
        try {
          const st = await callT("reader.getCurrentState", {}, 3000);
          const d = st && st.data;
          if (!d || !Array.isArray(d.openTabs)) return;
          if (d.currentId === book || d.currentBookUid === "id:" + book) return;
          const i = d.openTabs.findIndex((t) => t && !t.isSelf && (t.id === book || t.bookUid === "id:" + book));
          if (i >= 0) await callT("reader.activateTab", { index: i }, 3000);
        } catch (_) {
        }
      };
      // Open by bookUid+index (1.0.10 of the Second Temple plugin opened by numeric id and got data:false); the identifier
      // that worked is cached per book. Fallback: library.getBookMetadata gives the bookUid.
      const bookIdf = {};
      const openAt = async (book, index) => {
        const tries = [];
        if (bookIdf[book]) tries.push(bookIdf[book]);
        tries.push({ bookUid: "id:" + book }, { id: book, type: "text" }, { id: book, source: "library" });
        let last = "";
        for (const idf of tries) {
          const res = await callT("reader.openBook", Object.assign({}, idf, { index }));
          if (okRes(res)) {
            bookIdf[book] = idf;
            return "";
          }
          last = JSON.stringify(idf) + ": " + errText(res);
        }
        const md = await callT("library.getBookMetadata", { id: book });
        const d = md && md.data;
        if (d && (d.bookUid || d.bookId)) {
          const idf = d.bookUid ? { bookUid: d.bookUid } : { bookId: d.bookId };
          const res = await callT("reader.openBook", Object.assign({}, idf, { index }));
          if (okRes(res)) {
            bookIdf[book] = idf;
            return "";
          }
          last = "metadata " + JSON.stringify(idf) + ": " + errText(res);
        } else {
          last += " | getBookMetadata: " + errText(md);
        }
        return last;
      };
      // ref = {book, index} (from ui_V / ui_P / ui_MI / ui_RB / ui_MN) or a string the old tables used ("I_Kings.6.6")
      // 1.0.1-L (Part 7, U2, the user: "כל קישורי המקורות בבאנרי המידע חייבים להיות לתוכנת אוצריא ולא לספריא"): outside Otzaria, as in the shared
      // link, a click names the source and says where it opens; it never goes to another site.
      const UI_OTZ_NOTE = " — המקור נפתח בתוכנת אוצריא";
      const openSource = async (ev, label, ref) => {
        ev.preventDefault();
        ev.stopPropagation();
        let target = null;
        if (ref && typeof ref === "object" && ref.book && ref.index !== null && ref.index !== undefined) target = ref;
        else if (typeof ref === "string") target = ui_sefToOtz(ref);
        if (typeof window.Otzaria === "undefined" || !window.Otzaria.call || !target) {
          if (target) {
            // 1.0.1-L (the user: "לחצתי על מקור לפתיחה באוצריא והוא לא נפתח"): outside the plugin, Otzaria's own link: otzaria://open/book/<id>?index=<line>
            tmToast("פותח באוצריא: " + label + " (רק כשאוצריא מותקנת במחשב)");
            try {
              const go = document.createElement("a");
              go.href = "otzaria://open/book/" + encodeURIComponent(target.book) + "?index=" + encodeURIComponent(target.index);
              go.style.display = "none";
              document.body.appendChild(go);
              go.click();
              go.remove();
            } catch (_) {}
            return;
          }
          tmToast(label + UI_OTZ_NOTE);
          return;
        }
        let lastErr = "";
        tmToast("פותח באוצריא: " + label + "...");
        try {
          lastErr = await openAt(target.book, target.index);
          if (!lastErr) {
            await focusBook(target.book);
            tmToast("נפתח באוצריא: " + label);
            return;
          }
        } catch (e) {
          lastErr = "exception: " + (e && e.message ? e.message : e);
        }
        tmToast("פתיחה באוצריא נכשלה: " + label + " (" + lastErr + ")");
      };
      // source links appended to any element (1.0.1-H: used by the info box, the opinions table and the toggle rows)
      // 1.0.1-L: 57-kelim.js gives its links as specs, ["V", 10, 7, 40] / ["L", book, line]: unresolved, the place's and the vessels' links opened nothing
      const refOf = (ref0) => !Array.isArray(ref0) ? ref0 : ref0[0] === "V" ? ui_V(ref0[1], ref0[2], ref0[3]) : ref0[0] === "L" ? { book: ref0[1], index: ref0[2] } : "";
      const refLinks = (host, rs) => {
        for (const [label, ref0] of rs) {
          const ref = refOf(ref0);
          const a = document.createElement("a");
          a.href = "#";
          a.__ref = ref;   // 1.0.1-L (Part 7, U2): no address of another site; the click opens Otzaria
          a.addEventListener("click", (ev) => openSource(ev, label, ref));
          a.textContent = label;
          host.appendChild(a);
        }
      };
      // 1.0.2 (A): the linker of a card's text (ui_fillSrc's third argument) for the card's refs rs: each part of a source's bracket that
      // resolves (ui_srcParse above: the label first) becomes a link that opens it exactly as its chip does (openSource: Otzaria, or the
      // otzaria:// link outside it); the bracket keeps its small style (span.tm-src) and its words; nothing resolves -> null (a plain bracket)
      const srcLinker = (rs) => {
        const labels = [];
        let firstBook = null;
        (Array.isArray(rs) ? rs : []).forEach((r, k) => {
          if (!Array.isArray(r) || r.length < 2) return;
          const ref = refOf(r[1]);
          const t = ref && typeof ref === "object" ? ref : typeof ref === "string" ? ui_sefToOtz(ref) : null;
          if (!t || !t.book || t.index == null) return;
          labels.push({ n: ui_srcNorm(r[0]), label: String(r[0]), ref });
          if (k === 0 && UI_SRC_TN_IDS.indexOf(t.book) >= 0) firstBook = t.book;   // the card's first ref only
        });
        const byLabel = (n) => {
          for (const L of labels) if (L.n === n) return L;
          return null;
        };
        const resolve = (body, bare) => {
          const n = ui_srcNorm(body), nr = ui_srcNoRange(n);
          let L = byLabel(n) || byLabel(nr);
          if (!L) {
            for (const pre of UI_SRC_PRE) {
              if (n.indexOf(pre + " ") !== 0) continue;
              const rest = n.slice(pre.length + 1);
              L = byLabel(rest) || byLabel(ui_srcNoRange(rest));
              break;
            }
          }
          if (L) return { label: L.label, ref: L.ref };
          const t = ui_srcParse(nr, bare);
          return t ? { label: body.trim(), ref: t } : null;
        };
        return (run, full) => {
          const inner = run.t.slice(1, -1);
          const lb = ui_srcLastBook(full, run.i);
          const bare = firstBook != null && lb === firstBook ? firstBook : null;
          const sp = document.createElement("span");
          sp.className = "tm-src";
          sp.appendChild(document.createTextNode("("));
          let any = false;
          inner.split(";").forEach((raw, k) => {
            if (k) sp.appendChild(document.createTextNode(";"));
            const body = raw.trim();
            const lead = raw.slice(0, raw.indexOf(body)), trail = raw.slice(raw.indexOf(body) + body.length);
            if (lead) sp.appendChild(document.createTextNode(lead));
            const hit = body ? resolve(body, bare) : null;
            if (hit) {
              const a = document.createElement("a");
              a.href = "#";
              a.className = "tm-srcl";
              a.__ref = hit.ref;
              a.textContent = body;
              a.addEventListener("click", (ev) => openSource(ev, hit.label, hit.ref));
              sp.appendChild(a);
              any = true;
            } else if (body) sp.appendChild(document.createTextNode(body));
            if (trail) sp.appendChild(document.createTextNode(trail));
          });
          sp.appendChild(document.createTextNode(")"));
          return any ? sp : null;
        };
      };
      // 1.0.1-L (L.34): setInfo(key | "__place", custom?, opts?) opens the explanation card: the text of the view `key` (ui_INFO / ui_REFS) or
      // the custom {text, refs}; opts.title (else the view's label), opts.anchor = the clicked button (the card's top follows it)
      const setInfo = (key, custom, opts) => {
        const text = custom ? custom.text : ui_INFO[key] || ui_INFO.__general;
        const rs = custom ? custom.refs || [] : ui_REFS[key] || ui_REFS.__general || [];
        let title = opts && opts.title;
        if (!title) {
          const v = ui_VIEWS.find((vv) => vv.key === key);
          title = v ? v.label : key === "__general" ? "מבט כללי" : "";
        }
        // 1.0.2 (item 4): the card's opinions - the table's own row, opts.ops, or the subject's rows by its view key and title
        const row = opts && opts.row ? opts.row : null;
        const ops = row ? [row] : opts && Array.isArray(opts.ops) ? opts.ops : opsFor({ view: key !== "__place" ? key : null, title: opts && opts.title });
        xcardOpen(title, text, rs, opts && opts.anchor, opts && opts.side, ops, row);
      };
      // 1.0.1 (FIXES E.2 / F.3): the basis of the palace's placement, written by 60-palace.js (ctx.shared.palaceBasis, a Hebrew string)
      // or the UI's copy; appended once to the "בית שלמה" view text and used by the "מקום בית שלמה" entry of the EXTRAS
      const palaceBasis = (ctx.shared && typeof ctx.shared.palaceBasis === "string" && ctx.shared.palaceBasis.trim()) || ui_PALACE_BASIS;
      if (ui_INFO.palace.indexOf(palaceBasis) < 0) ui_INFO.palace = ui_INFO.palace + " " + palaceBasis;
      // 1.0.1 (FIXES D.3 / F.1): the outer court's items from 20-mount.js, ctx.shared.outerCourtItems = [{name, x, y, z}], matched by a
      // fragment of the (Hebrew) name; the FIXES D.2 positions are the fallback when the module did not register them: the court floor
      // y 3 (ctx.shared.newCourt.y), chambers 8 high inside the north low wall, the king's platform 1 high at x 106 / z 8, the chest
      // 1.2 high at x 224 / z 7
      const ncY = ctx.shared && ctx.shared.newCourt && typeof ctx.shared.newCourt.y === "number" ? ctx.shared.newCourt.y : 3;
      const ncCX = ctx.shared && ctx.shared.newCourt && typeof ctx.shared.newCourt.x0 === "number" && typeof ctx.shared.newCourt.x1 === "number"
        ? (ctx.shared.newCourt.x0 + ctx.shared.newCourt.x1) / 2 : 161; // the court's centre x (93.5..228.5)
      const OCI_FB = { lishkot: [161, ncY + 4, -61.5], amud: [106, ncY + 1.2, 8], aron: [224, ncY + 0.6, 7] };
      const oci = (frag, fb) => {
        const list = ctx.shared && Array.isArray(ctx.shared.outerCourtItems) ? ctx.shared.outerCourtItems : [];
        const it = list.find((o) => o && typeof o.name === "string" && o.name.indexOf(frag) >= 0 && typeof o.x === "number");
        return it ? [it.x, typeof it.y === "number" ? it.y : fb[1], typeof it.z === "number" ? it.z : fb[2]] : fb;
      };
      // the camera for such an item: the module's own (outerCourtItems[i].cam, 20-mount.js 1.0.1-K), else dist amot from it toward the
      // court's centre (so it stays inside the court) and 0.55 dist higher
      const ociCam = (frag, fb, dist) => {
        const list = ctx.shared && Array.isArray(ctx.shared.outerCourtItems) ? ctx.shared.outerCourtItems : [];
        const it = list.find((o) => o && typeof o.name === "string" && o.name.indexOf(frag) >= 0 && Array.isArray(o.cam) && o.cam.length >= 3);
        if (it && isFinite(it.cam[0] + it.cam[1] + it.cam[2])) return it.cam.slice(0, 3);
        const p = oci(frag, fb);
        const dx = ncCX - p[0], dz = 0 - p[2], L = Math.hypot(dx, dz) || 1;
        return [p[0] + dx / L * dist, p[1] + dist * 0.55, p[2] + dz / L * dist];
      };
      // (1.0.1-L: no explanation is shown at the start - the card opens on the first choice; the panel's intro line says what the lists are)
      const secViews = document.createElement("div");
      secViews.className = "sec";
      secViews.textContent = "מבטים";
      // ----- 1.0.1-L (the user: search in all the buttons): a field above the views. It filters every button of the panel by its name, without regard to nikud
      // or to quotation marks; the groups that hold a match open, the rest step aside; an empty field brings everything back as it was. Nothing per frame. -----
      {
        const wrap = document.createElement("div");
        wrap.id = "tm-search-wrap";
        const input = document.createElement("input");
        input.id = "tm-search";
        input.type = "search";
        input.placeholder = "חיפוש בכל הכפתורים...";
        input.setAttribute("aria-label", "חיפוש בכל כפתורי התוסף");
        input.autocomplete = "off";
        const none = document.createElement("div");
        none.id = "tm-search-none";
        none.textContent = "לא נמצא כפתור בשם הזה.";
        wrap.appendChild(input);
        wrap.appendChild(none);
        panel.appendChild(wrap);
        const norm = (t) => String(t || "").replace(/[\u0591-\u05C7]/g, "").replace(/[׳״'"`]/g, "").replace(/[.,:;()\-–—]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
        // 1.0.1-L (last check): the marks are dropped, not spaced ("רדק" finds רד״ק, "מלבים" מלבי״ם). Each word of the query is looked for: "מנורה" finds מנורת and המנורות,
        // "שלחן" שולחן (without ו and י, and without a word's ending, when 3 letters are left); a word of one or two letters is a whole word with its prefixes: "ים" finds הים and והים, not every plural
        const loose = (s) => s.replace(/[וי]/g, "");
        const wordHit = (txt, w) => {
          if (w.length <= 2) return (" " + txt + " ").search(new RegExp(" [והבלמשכ]{0,2}" + w.replace(/[^\p{L}\p{N}]/gu, "") + " ", "u")) >= 0;
          const l = loose(w);
          if (l.length < 3) return txt.includes(w);
          const st = l.replace(/[התםן]$/, "");
          return loose(txt).includes(st.length >= 3 ? st : l);
        };
        const textHit = (t, q) => { const n = norm(t); return q.split(" ").every((w) => wordHit(n, w)); };
        const hit = (el, q) => textHit(el.textContent, q) || textHit(el.title, q);
        // the buttons and the switches' rows; an opinion row's caption finds all its options
        const ITEMS = "button, label";
        const itemHit = (b, q) => { const op = b.closest(".tm-op"), cap = op && op.querySelector(".cap"); return hit(b, q) || (!!cap && hit(cap, q)); };
        let savedTop = 0;
        let saved = null;  // the state before the search: the blocks' display and the groups' open
        const run = () => {
          const q = norm(input.value);
          const kids = Array.from(panel.children).filter((c) => c !== wrap);
          if (!q) {
            if (saved) {
              for (const [el, st] of saved) {
                el.style.display = st.display;
                if (st.open !== undefined) el.open = st.open;
              }
              saved = null;
            }
            for (const b of panel.querySelectorAll(ITEMS)) b.style.display = b.dataset.tmHid ? b.dataset.tmHid === "x" ? "" : b.dataset.tmHid : b.style.display, delete b.dataset.tmHid;
            none.style.display = "none";
            panel.scrollTop = savedTop;
            return;
          }
          if (!saved) {
            savedTop = panel.scrollTop;
            saved = new Map();
            for (const el of Array.from(panel.querySelectorAll("*"))) if (el.tagName === "DETAILS" || el.parentNode === panel) saved.set(el, { display: el.style.display, open: el.tagName === "DETAILS" ? el.open : undefined });
            saved.delete(wrap);
          }
          let total = 0;
          for (const b of panel.querySelectorAll(ITEMS)) {
            if (b.dataset.tmHid === undefined) b.dataset.tmHid = b.style.display || "x";
            const ok = itemHit(b, q);
            b.style.display = ok ? b.dataset.tmHid === "x" ? "" : b.dataset.tmHid : "none";
            if (ok) total++;
          }
          for (const el of kids) {
            const has = (el.tagName === "LABEL" && el.style.display !== "none") || (!!el.querySelector && Array.from(el.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none"));
            el.style.display = has ? (saved.get(el) ? saved.get(el).display : "") : "none";
            if (el.tagName === "DETAILS" && has) el.open = true;
          if (has && el.tagName !== "DETAILS" && el.tagName !== "LABEL") {
            for (const c of Array.from(el.children)) {
              if (!saved.has(c)) saved.set(c, { display: c.style.display });
              if (c.tagName === "BUTTON" || c.tagName === "LABEL") continue;
              const show = Array.from(c.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none");
              c.style.display = show ? saved.get(c).display : "none";
            }
          }
          }
          for (const d of panel.querySelectorAll("details details")) {
            if (Array.from(d.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none")) d.open = true;
          }
          none.style.display = total ? "none" : "block";
        };
        input.addEventListener("input", run);
        // typing in the field never moves the camera or presses the model's keys; Esc clears it
        input.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc") {
            input.value = "";
            run();
          }
        });
        input.addEventListener("keyup", (e) => e.stopPropagation());
      }
      panel.appendChild(secViews);
      const grid = document.createElement("div");
      grid.id = "tm-views";
      panel.appendChild(grid);
      // 1.1.0: after the merges (UI_VIEW_HOME) the grid keeps "מבט כללי" alone - no "מבטים" header, one wide button
      setTimeout(() => {
        if (grid.children.length <= 1) {
          secViews.style.display = "none";
          grid.classList.add("one");
        }
      }, 0);

      // ===== Holy of Holies: cloud + confirmation before it is revealed =====
      const KKF = LVL.HEI;
      const dc = ctx.shared.devirCenter;
      const KKC = dc && typeof dc.x === "number" ? { x: dc.x, y: dc.y, z: dc.z } : { x: -54, y: 22, z: 0 }; // SPEC 7: devir centre
      const cloud = new Group();
      cloud.name = "tm-kk-cloud";
      uiGroup.add(cloud);
      const cloudMat = new MeshLambertMaterial({ color: 15856631, emissive: 5593704, transparent: true, opacity: 0.96 });
      const IcoGeo = (ctx.THREE && ctx.THREE.IcosahedronGeometry) || (typeof IcosahedronGeometry !== "undefined" ? IcosahedronGeometry : null);
      const cloudGeo = IcoGeo ? new IcoGeo(1, 3) : new SphereGeometry(1, 10, 8);
      {
        let seed = 7;
        const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
        // the devir is 20 x 20 x 20 (I Kings 6:20), built 19 clear because the amah traksin is taken from it (user's decision, 10-core.js
        // CO.xDevirE / xDevirW): interior x -63.5..-44.5, z +-10, y 12..32, and its aliyah above (y 33..42).
        // The WHOLE cloud (puff centre + scaled radius + the 0.7 / 0.5 sway of the animation below) stays inside x/z +-9 around
        // the centre and y 13..41, so no puff pokes through the traksin into the kodesh, through the side walls or through the
        // west wall into the ta'im. Smaller puffs than 1.0.19, hence more of them (shared geometry: still cheap).
        const HALF = 9, Y0 = KKF + 1, Y1 = KKF + 29, SWAY = 0.7, SWAY_Y = 0.5;
        for (let i = 0; i < 72; i++) {
          const pf = new Mesh(cloudGeo, cloudMat);
          const r = 3 + rnd() * 2;                              // scaled radius 3.45..5.75 in x/z, 2.7..4.5 in y
          pf.scale.set(r * 1.15, r * 0.9, r * 1.15);
          const sp = Math.max(0, HALF - r * 1.15 - SWAY);       // allowed centre spread in x/z for this puff
          const hy = r * 0.9 + SWAY_Y;                          // vertical half-extent incl. the sway
          pf.position.set(
            KKC.x + (rnd() - 0.5) * 2 * sp,
            Y0 + hy + rnd() * Math.max(0, Y1 - Y0 - 2 * hy),
            KKC.z + (rnd() - 0.5) * 2 * sp
          );
          pf.userData.noPick = true;
          pf.userData.base = pf.position.clone();
          pf.userData.ph = rnd() * 6.28;
          cloud.add(pf);
        }
      }
      let cloudOn = true, cloudTarget = 0.96, cloudSeenNear = false;
      const setCloud = (on) => {
        cloudOn = on;
        cloudTarget = on ? 0.96 : 0;
        if (on) cloud.visible = true;
        else cloudSeenNear = false;
      };
      // A camera position/target inside this box counts as "inside the devir" (1.0.19 logic: fly() tests pos and target).
      // SPEC 9.7 gives x -66..-42, z +-12, y 14..44 - but -42 lies 1.5 amot EAST of the traksin's kodesh face (x -43.5), so every
      // kodesh-side spot in front of the traksin (the chains, the traksin, the parochet, the devir door) would pop the
      // Holy-of-Holies confirmation and not fly on "ביטול". The east bound is therefore the devir's east face, CO.xDevirE
      // (-44.5 = the traksin's devir side): only a camera/target really inside the devir (or its aliyah) asks. Rest as in the SPEC.
      const KK_E = CO && typeof CO.xDevirE === "number" ? CO.xDevirE : -44.5;
      const inKK = (p) => p && p[0] > -66 && p[0] < KK_E && p[2] > -12 && p[2] < 12 && p[1] > 14 && p[1] < 44;
      const cf = document.createElement("div");
      cf.id = "tm-confirm";
      cf.innerHTML = '<div class="box"><div class="t">קודש הקדשים</div><div class="m">קודש הקדשים מכוסה בענן מפני כבוד המקום. להסיר את הענן ולהציג את פנים החדר?</div><div class="b"><button class="y">הסר את הענן</button><button class="n">ביטול</button></div></div>';
      document.body.appendChild(cf);
      let cfYes = null, cfNo = null;
      const closeConfirm = () => {
        cf.style.display = "none";
        cfYes = cfNo = null;
        // 1.0.1-K: the focus given to the dialog's button goes back to the page (else the arrow keys stay blocked on a hidden button)
        try {
          const ae = document.activeElement;
          if (ae && cf.contains && cf.contains(ae) && typeof ae.blur === "function") ae.blur();
        } catch (_) {
        }
      };
      cf.querySelector(".y").addEventListener("click", () => {
        const f = cfYes;
        closeConfirm();
        if (f) f();
      });
      cf.querySelector(".n").addEventListener("click", () => {
        const f = cfNo;
        closeConfirm();
        if (f) f();
      });
      const askRemoveCloud = (onYes, onNo) => {
        cfYes = onYes;
        cfNo = onNo || null;
        cf.style.display = "flex";
        // 1.0.1-K (the presentation's request, review UX1): Enter answers the dialog itself ("הסר את הענן")
        try {
          cf.querySelector(".y").focus();
        } catch (_) {
        }
      };
      // 1.0.1-K: the dialog answered from outside (the presentation): "ביטול" runs the pending "no", closeConfirm drops both
      const cancelConfirm = () => {
        if (cf.style.display !== "flex") return;
        const f = cfNo;
        closeConfirm();
        if (f) f();
      };
      // 1.0.1-K: the cloud's pill is an entry of the on-model buttons' registry (see "on-model buttons" below); this block decides when
      // it is seen (cloudSeen.show) and its size (cloudSeen.scale): when the cloud (or, while it is off, its place) is seen at a
      // reasonable size and nothing solid hides it (1.0.17 / 1.0.19 logic); while it is off the pill offers "☁ החזר את הענן" (the cloud
      // also comes back by itself once the camera has been near it and goes more than 75 amot away, as before)
      const cloudSeen = { show: false, scale: 1 };
      {
        const cv = new Vector3();
        // 1.0.19: the "remove cloud" button must appear only while the cloud is really seen: besides its size on screen we
        // cast a ray from the camera to the cloud centre and hide the button when a visible, not-faded solid is in the way
        // (e.g. standing in the court: the house walls hide the cloud). Throttled; targets are cached for a few seconds.
        const cRay = new Raycaster(), cDir = new Vector3();
        let cTargets = null, cTargetsAt = 0, cFrame = 0, cClear = true;
        const underCloud = (o) => {
          for (; o; o = o.parent) if (o === cloud || o.name === "tm-measure") return true;
          return false;
        };
        const isVis = (o) => {
          for (; o; o = o.parent) if (o.visible === false) return false;
          return true;
        };
        const solidEnough = (o) => {
          const m = Array.isArray(o.material) ? o.material[0] : o.material;
          return !m || m.visible === false || (m.transparent ? m.opacity > 0.5 : true);
        };
        const cloudClear = (cam, d) => {
          const now = performance.now();
          if (!cTargets || now - cTargetsAt > 4000) {
            cTargets = [];
            cTargetsAt = now;
            // 1.0.1-H (performance, the user: "נתקע"): only plain meshes of some size can hide the cloud - the walls, ceilings, roofs and
            // the court walls; instanced meshes (knobs, chains, reliefs, pillars: a raycast tests every instance) and small parts are skipped
            const bb = new Box3(), sz = new Vector3();
            ctx.scene.traverse((o) => {
              if (!o.isMesh || o.isInstancedMesh || !o.geometry || underCloud(o)) return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (pa && pa.count > 30000) return; // skip the terrain: it never hides the cloud
              if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
              bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
              if (Math.max(sz.x, sz.y, sz.z) < 6) return;   // a part smaller than 6 amot in every direction never hides the 30-amah cloud
              cTargets.push(o);
            });
          }
          cDir.set(KKC.x - cam.x, KKC.y - cam.y, KKC.z - cam.z).normalize();
          cRay.set(cam, cDir);
          cRay.near = 0;
          cRay.far = Math.max(1, d - 3);
          for (const h of cRay.intersectObjects(cTargets, false)) {
            if (isVis(h.object) && solidEnough(h.object)) return false;
          }
          return true;
        };
        const kkP = [0, 0, 0];   // 1.0.4: the orbit into the cloud (below)
        let kkAsked = false, kkRel = 0;
        ctx.renderer.domElement.addEventListener("pointerdown", () => { kkRel = Infinity; });
        window.addEventListener("pointerup", () => { if (kkRel === Infinity) kkRel = performance.now(); }, true);
        window.addEventListener("pointercancel", () => { if (kkRel === Infinity) kkRel = performance.now(); }, true);
        ctx.animated.push(function(t) {
          const cam = ctx.camera.position;
          const dist = Math.hypot(cam.x - KKC.x, cam.y - KKC.y, cam.z - KKC.z);
          const k = 0.0004 * t;
          cloud.children.forEach((pf) => {
            const b = pf.userData.base, ph = pf.userData.ph;
            pf.position.set(b.x + Math.sin(k + ph) * 0.7, b.y + Math.cos(k * 0.8 + ph) * 0.5, b.z + Math.sin(k * 0.6 + ph * 1.3) * 0.7);
          });
          if (Math.abs(cloudMat.opacity - cloudTarget) > 4e-3) cloudMat.opacity += (cloudTarget - cloudMat.opacity) * 0.08;
          if (!cloudOn && cloudMat.opacity < 0.03) cloud.visible = false;
          if (!cloudOn) {
            if (dist < 50) cloudSeenNear = true;
            else if (cloudSeenNear && dist > 75) setCloud(true);
          }
          // 1.0.4: the orbit round a thing one flew to (ctx.camPass, 90-entry.js; Moses' menorah stands 1.5 amot before the devir) takes the camera through the
          // devir's wall into the cloud: once the drag is let go (kkRel, 400 ms), the question a flight into the devir asks (askRemoveCloud) - once each time the
          // camera goes in; "ביטול" leaves the cloud, and the camera where it is
          kkP[0] = cam.x;
          kkP[1] = cam.y;
          kkP[2] = cam.z;
          if (!inKK(kkP)) kkAsked = false;
          else if (cloudOn && !kkAsked && cf.style.display !== "flex" && performance.now() - kkRel > 400 && typeof ctx.camPass === "function" && ctx.camPass()) {
            kkAsked = true;
            askRemoveCloud(() => setCloud(false));
          }
          let show = false;
          // 1.0.17: the button appears only while the cloud is actually seen at a reasonable size on screen,
          // and its size is proportional to the cloud's apparent size (clamped).
          // 1.0.1-K: with the cloud off, the pill (then "החזר את הענן") appears where the cloud's would: the devir seen at a reasonable size
          const seenOn = cloudOn && cloud.visible && cloudMat.opacity > 0.3;
          if (seenOn || !cloudOn) {
            cv.set(KKC.x, KKC.y, KKC.z).project(ctx.camera);
            const fovT = Math.tan((ctx.camera.fov || 50) * Math.PI / 360);
            const cloudPx = 30 / (2 * Math.max(1, dist) * fovT) * window.innerHeight; // the cloud is ~30 amot tall
            const onScreen = cv.z < 1 && Math.abs(cv.x) < 0.95 && Math.abs(cv.y) < 0.95 && cloudPx >= 90;
            if (onScreen) {
              if ((cFrame++ & 31) === 0) {   // 1.0.1-H: every 32nd frame (was 8): the ray test is the one periodic cost while the cloud is seen
                try {
                  cClear = cloudClear(cam, dist);
                } catch (_) {
                  cClear = false;
                }
              }
            } else {
              cClear = false;
            }
            if (cClear && onScreen) {
              cloudSeen.scale = Math.min(1.6, Math.max(0.7, cloudPx / 300));
              show = true;
            }
          }
          cloudSeen.show = show;
        });
      }

      // ===== measuring tool: click two points on the model (1.0.17: red line with white outline) =====
      const mGroup = new Group();
      mGroup.name = "tm-measure";
      ctx.scene.add(mGroup);
      const mOut = document.createElement("div");
      mOut.id = "tm-measure-out";
      document.body.appendChild(mOut);
      let mOn = false, mPts = [];
      const mRay = new Raycaster(), mNdc = new Vector2();
      const mClear = () => {
        while (mGroup.children.length) {
          const c = mGroup.children.pop();
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        }
        mPts = [];
      };
      const mSay = (txt) => {
        mOut.textContent = txt;
        mOut.style.display = txt ? "block" : "none";
      };
      const mPick = (ev) => {
        const el = ctx.renderer.domElement, r = el.getBoundingClientRect();
        mNdc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
        mRay.setFromCamera(mNdc, ctx.camera);
        for (const h of mRay.intersectObjects(ctx.root.children, true)) {
          const o = h.object;
          if (o.isSprite || o.isLine || o.isPoints || o.userData.noPick) continue;
          let vis = true;
          for (let p = o; p; p = p.parent) if (!p.visible) {
            vis = false;
            break;
          }
          if (!vis) continue;
          const mt = o.material;
          if (mt && !Array.isArray(mt) && (mt.opacity < 0.5 || mt.visible === false)) continue;
          return h.point.clone();
        }
        return null;
      };
      const M_RED = 0xe53935, M_WHITE = 0xffffff, M_Y = new Vector3(0, 1, 0);
      const mPiece = (geo, color, order, kind, f) => {
        const m = new Mesh(geo, new MeshBasicMaterial({ color, depthTest: false, transparent: true }));
        m.renderOrder = order;
        m.userData.noPick = true;
        m.userData.mk = { kind, f };
        mGroup.add(m);
        return m;
      };
      const mMark = (p) => {
        mPiece(new SphereGeometry(1, 16, 12), M_WHITE, 998, "dot", 0.0085).position.copy(p);
        mPiece(new SphereGeometry(1, 16, 12), M_RED, 999, "dot", 0.006).position.copy(p);
      };
      const mLine = (a, b) => {
        const len = a.distanceTo(b);
        if (len < 1e-6) return;
        const dirv = new Vector3().subVectors(b, a).normalize();
        for (const [col, ord, f] of [[M_WHITE, 996, 0.0045], [M_RED, 997, 0.0028]]) {
          const c = mPiece(new CylinderGeometry(1, 1, 1, 12, 1, true), col, ord, "line", f);
          c.position.copy(a).add(b).multiplyScalar(0.5);
          c.quaternion.setFromUnitVectors(M_Y, dirv);
          c.userData.mk.len = len;
        }
      };
      ctx.animated.push(function() {
        const cp = ctx.camera.position;
        for (const m of mGroup.children) {
          const mk = m.userData.mk;
          if (!mk) continue;
          const r = Math.max(0.02, cp.distanceTo(m.position) * mk.f);
          if (mk.kind === "dot") m.scale.set(r, r, r);
          else m.scale.set(r, mk.len, r);
        }
      });
      const mHint = "מדידה: לחץ על שתי נקודות במודל";
      const mSet = (on) => {
        mOn = on;
        document.body.classList.toggle("tm-measuring", on);
        ctx.renderer.domElement.style.cursor = "";   // 1.0.1-K (review UI-H2-6): a label's hand must not hide the crosshair
        mClear();
        mSay(on ? mHint : "");
        const b = document.getElementById("tm-nav-ruler");
        if (b) b.classList.toggle("on", on);
      };
      {
        const el = ctx.renderer.domElement;
        let down = null;
        el.addEventListener("pointerdown", (e) => {
          down = { x: e.clientX, y: e.clientY, t: performance.now() };
        });
        el.addEventListener("pointerup", (e) => {
          if (e.__tmSynthetic) {   // 1.0.1-H: the release synthesized by 90-entry.js's pointer safety is not a click
            down = null;
            return;
          }
          if (!mOn || !down) return;
          const d = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t;
          down = null;
          if (d > 6 || dt > 600) return;
          const p = mPick(e);
          if (!p) return;
          if (mPts.length >= 2) mClear();
          mPts.push(p);
          mMark(p);
          if (mPts.length === 1) {
            mSay("נקודה ראשונה סומנה — לחץ על נקודה שנייה");
          } else {
            const a = mPts[0], b = mPts[1];
            mLine(a, b);
            const dist = a.distanceTo(b), dh = Math.hypot(b.x - a.x, b.z - a.z), dy = Math.abs(b.y - a.y);
            mSay("מרחק: " + dist.toFixed(2) + " אמות  ·  אופקי " + dh.toFixed(2) + "  ·  גובה " + dy.toFixed(2) + "  (לחיצה נוספת — מדידה חדשה)");
          }
        });
      }
      // ===== flying =====
      const realFly = typeof ctx.flyTo === "function" ? ctx.flyTo : function() {
      };
      const fly = function(pos, tgt, dur) {
        if (cloudOn && (inKK(pos) || inKK(tgt))) {
          askRemoveCloud(() => {
            setCloud(false);
            realFly(pos, tgt, dur);
          });
          return;
        }
        realFly(pos, tgt, dur);
      };
      const fps = ctx.shared && ctx.shared.flyPoints ? ctx.shared.flyPoints : {};
      // The fly point of a key: the module's registration, or (for the Sea) the current placement, or the SPEC fallback.
      const resolveFp = (key) => {
        if (key === "__general") return ui_GENERAL;
        if (key === "yam" || key === "yamOxen") {   // 1.0.1-K: the oxen's view follows the placement too (45-vessels.js oxenFlyPoint)
          const sp = ctx.shared.seaPlacement;
          const fn = sp && (key === "yam" ? sp.flyPoint : sp.oxenFlyPoint);
          if (typeof fn === "function") {
            try {
              const f = fn.call(sp);
              if (f && Array.isArray(f.pos) && Array.isArray(f.target)) return f;
            } catch (_) {
            }
          }
          if (key === "yamOxen") {
            const fo = fps.yamOxen;
            return fo && Array.isArray(fo.pos) && Array.isArray(fo.target) ? fo : null;
          }
          const f0 = fps.yam;
          if (f0 && Array.isArray(f0.pos) && Array.isArray(f0.target)) return f0;
          // 1.0.1-L (L.7): the fallback as 45-vessels.js's flyPoint: from the court's side of the corner (x + 40 would stand outside the east wall)
          const z = sp && sp.current === "radak" ? CO.seaZ : CO.seaZRashi, s = z < 0 ? 1 : -1;
          return { pos: [CO.seaX - 18, LVL.AZ + 30, z + s * 20], target: [CO.seaX - 1, LVL.AZ + 3, z + s] };
        }
        const f = fps[key];
        if (f && Array.isArray(f.pos) && Array.isArray(f.target)) return f;
        return ui_FP[key] || null;
      };
      // 1.0.1-K (the user: "כפתור להסרה ולא הסרה אוט'"; "כברירת מחדל ההיכל צריך להיות סגור מכל צדדיו ורק עם כפתור להסרה"): navigation
      // never opens anything. 1.0.1 opened the cutaway / the chambers / the ulam / the boards automatically for the views and places that
      // carried interior / yatzia / ulam / boards / in; those flags stay in ui_VIEWS and PLACES as data only, the interior views look
      // from cameras inside the closed house (55-interior.js), and the removals are the on-model pills. applyCut / applyOpen stay in
      // ctx.ui as no-ops for older callers.
      const applyCut = function() {};
      const applyOpen = function() {};
      // the removals by id (the pills, "↺ החזר הכל" and ctx.ui.removals use these)
      const REMOVALS = {
        house: { list: () => ctx.cutaway, isOn: () => cutOn, set: (on) => setCutaway(on) },
        yatzia: { list: () => ctx.yatziaCut, isOn: () => yatziaOpen, set: (on) => setYatziaCut(on) },
        ulam: { list: () => ctx.ulamCut, isOn: () => ulamOpen, set: (on) => setUlamCut(on) },
        boards: { list: () => ctx.forestBoardsCut, isOn: () => boardsOff, set: (on) => setBoardsOff(on) }
      };
      // ===== opinion switches shared by the places and the toggles =====
      let seaRow = null, layoutRow = null, opinionRow = null, ulamTablesRow = null, throneRow = null;
      const pickSea = (key) => {
        const sp = ctx.shared.seaPlacement;
        if (sp && typeof sp.set === "function") {
          try {
            sp.set(key);
          } catch (_) {
          }
        }
        if (seaRow) seaRow.mark(key);
      };
      const pickLayout = (key) => {
        const kl = ctx.shared.kodeshLayout;
        if (kl && typeof kl.set === "function") {
          try {
            kl.set(key);
          } catch (_) {
          }
        }
        if (layoutRow) layoutRow.mark(key);
      };
      const pickOpinion = (key) => {
        const ko = ctx.shared.kodeshOpinion;
        if (ko && typeof ko.set === "function") {
          try {
            ko.set(key);
          } catch (_) {
          }
        }
        if (opinionRow) opinionRow.mark(key);
      };
      // the ark line (even shetiya, ark, great cherubim) in the WEST part of the devir: x -58.5 (Rambam Beit HaBechira 4:1 "במערבו"; SPEC 7),
      // read from 55-interior.js (ctx.shared.arkX) so the place targets follow the model
      const arkX = () => (ctx.shared && typeof ctx.shared.arkX === "number" ? ctx.shared.arkX : -58.5);
      // model numbers for the place targets and the EXTRAS texts, read from the model instead of retyped literals: the laver / bases
      // row and the Sea from ctx.CO (10-core.js, SPEC 2), Yachin and Boaz from 50-heichal.js (ctx.shared.heichal.pillars)
      // 1.0.1-L (L.77): the block of bases from the model (45-vessels.js ctx.shared.mechona.block: its columns, its rows, Moses' laver), else from CO
      const blk = (ctx.shared.mechona && ctx.shared.mechona.block) || null;
      const blkLaver = blk && Array.isArray(blk.laver) ? blk.laver : null;
      const rowX = blkLaver ? blkLaver[0] : typeof CO.kiyorX === "number" ? CO.kiyorX : 30;   // Moses' laver, between the two rows of bases
      const kz = blkLaver ? blkLaver[1] : Array.isArray(CO.mechZ) && CO.mechZ.length ? CO.mechZ.reduce((s, v) => s + v, 0) / CO.mechZ.length : 39;
      const blkRows = blk && Array.isArray(blk.rows) && blk.rows.length > 1 ? blk.rows : Array.isArray(CO.mechZ) && CO.mechZ.length > 1 ? CO.mechZ : [33, 45];
      const blkCols = blk && Array.isArray(blk.cols) && blk.cols.length > 1 ? blk.cols : [21, 25.5, 30, 34.5, 39];
      const ulamE = typeof CO.xUlamE === "number" ? CO.xUlamE : 18.5;     // the outer face of the ulam's front wall
      const seaXm = typeof CO.seaX === "number" ? CO.seaX : 80;           // the Sea's axis, in the court's corner (L.7)
      const courtE = ctx.shared.innerCourt && typeof ctx.shared.innerCourt.x1 === "number" ? ctx.shared.innerCourt.x1 : 91;   // the inner face of the court's east wall
      const houseE = typeof CO.xHouseE === "number" ? CO.xHouseE : 2.5;   // east face of the house wall = the hall's west wall
      const pil = (ctx.shared.heichal && ctx.shared.heichal.pillars) || { x: 6.08, z: 7.17 }; // Yachin / Boaz centres (1.0.1-L, L.6: x 6.08, z +-7.17 - the capital 0.02 from the doorposts and the side walls)
      const ulamDoor = (ctx.shared.heichal && ctx.shared.heichal.ulamDoor) || { w: 10, h: 22, x: [12.5, 18.5], y: [12, 34] };   // 1.0.1-L (L.59; heichal-door.md)
      // ===== views grid =====
      const btns = [];
      const placeBtns = [];
      const viewBtnByKey = {};   // 1.0.1-H: for the presentation (ctx.ui.viewButton)
      const placeBtnByT = {}, placeItemByT = {};   // 1.0.1-J: places by title (ctx.ui.placeButton / ctx.ui.place)
      for (const v of ui_VIEWS) {
        if (!resolveFp(v.key)) continue;
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = v.label;
        viewBtnByKey[v.key] = b;
        b.addEventListener("click", () => {
          try {
            if (v.layer) setLayer(v.layer, true);
            // 1.0.1-K: no automatic removal (v.interior / v.yatzia / v.ulam are data only)
            const fp = resolveFp(v.key);
            if (fp) fly(fp.pos, fp.target);
          } catch (_) {
          }
          setInfo(v.key, null, { title: v.label, anchor: b });   // 1.0.1-L (L.34): in the floating card
          hidePanelOnPhone();
          for (const o of btns) o.classList.remove("on");
          for (const o of placeBtns) o.classList.remove("on");
          b.classList.add("on");
          closeCard();   // 1.0.1-K: a new view closes the label's card (defined with the labels below; the click comes after buildUI)
        });
        grid.appendChild(b);
        btns.push(b);
      }
      if (btns.length) btns[0].classList.add("on");
      // ===== places accordion (SPEC 9.5): item = {t, tg, cam, info, refs, layer?, action?, view?, key?} =====
      // tg / cam may be functions (resolved at click time); view = a fly point key (resolveFp); action = a model feature switched on
      // with the place (1.0.1-K: the yatzia section, the wall / altar layers, the base's demo and its exploded view - FEATURES the user
      // asks to see, never one of the four removals; each has its own "off" on the model and in "↺ החזר הכל"). The 1.0.1 flags in /
      // yatzia / ulam / boards are gone: navigation never opens anything (1.0.1-K).
      const V = ui_V, P = ui_P, MI = ui_MI, RB = ui_RB, MN = ui_MN;
      // 1.0.1-L (Part 7, U4, the user: "כפתור מקום הים אמור להראות ממבט מלמעלה את המיקום ולא מקרוב"): from above, the court's corner in the frame; follows the reading.
      // Model choice: the Sea's side comes from its own fly point's target. The panel's width is why the target stands east of the Sea's middle.
      const uiSeaSide = () => {
        const sp = ctx.shared.seaPlacement;
        try { const f = sp && sp.flyPoint && sp.flyPoint(); if (f && f.target) return f.target[2] < 0 ? -1 : 1; } catch (_) {}
        return -1;
      };
      const uiSeaCam = () => { const k = uiSeaSide(); return [66, 118, k * 22]; };
      const uiSeaTg = () => { const k = uiSeaSide(); return [72, 6, k * 48]; };
      // 1.0.1-L (L.85; part5-house.md FOR-UI 2, 3)
      const UI_ARK_REFS = [["מלכים א ח, ט", V(10, 8, 9)], ["רד״ק שם", { book: 3540, index: 544 }], ["רלב״ג שם", { book: 3645, index: 335 }], ["מלבי״ם שם", { book: 3394, index: 445 }], ["בבא בתרא יד.", { book: 124, index: 369 }], ["בבא בתרא יד:", { book: 124, index: 381 }], ["מנחות צט.", { book: 131, index: 3535 }], ["רש״י בבא בתרא יד:", { book: 2178, index: 585 }], ["יומא נב:", { book: 107, index: 1344 }], ["שמואל א ו, ח", { book: 8, index: 133 }], ["שמות טז, לג", V(2, 16, 33)], ["במדבר יז, כג", V(4, 17, 23)]];
      const PN = (ctx.shared && ctx.shared.palaceNotes) || {};          // 60-palace.js's Hebrew notes (K.6), with their sources
      // 1.0.1-L (L.57, L.81; palace-2.md): the sources of the throne and of its versions - the verses, the commentators and the midrashim (book : line in the DB)
      const TH_V = [["מלכים א י, יח", V(10, 10, 18)], ["י, יט", V(10, 10, 19)], ["י, כ", V(10, 10, 20)], ["דברי הימים ב ט, יז", V(39, 9, 17)], ["ט, יח", V(39, 9, 18)], ["ט, יט", V(39, 9, 19)]];
      const TH_REFS = {
        pesukim: TH_V.concat([["רש״י י, יט", { book: 3673, index: 610 }], ["רד״ק י, יט", { book: 3540, index: 683 }], ["מצודת דוד י, יט", { book: 3345, index: 939 }], ["רלב״ג י, יט", { book: 3645, index: 462 }], ["מלבי״ם י, יט", { book: 3394, index: 624 }], ["תרגום יונתן י, יט", { book: 3206, index: 391 }], ["אברבנאל י, יח–כ", { book: 3574, index: 563 }], ["רש״י דברי הימים ב ט, יט", { book: 3662, index: 354 }], ["מצודת דוד דברי הימים ב ט, יח", { book: 3318, index: 493 }]]),
        targumSheni: [["תרגום שני לאסתר א, ב", { book: 3237, index: 13 }], ["מלכים א י, יט", V(10, 10, 19)], ["רש״י דברי הימים ב ט, יט", { book: 3662, index: 354 }]],
        estherRabbah: [["מהרז״ו על אסתר רבה", { book: 3117, index: 76 }], ["מתנות כהונה", { book: 3099, index: 151 }], ["יפה ענף", { book: 3079, index: 120 }], ["עץ יוסף", { book: 3086, index: 290 }], ["אסתר רבה א, יב", { book: 264, index: 25 }], ["פנים אחרים נוסח ב", { book: 274, index: 116 }], ["מדרש אבא גוריון א", { book: 274, index: 6 }], ["במדבר רבה יב, יז", { book: 259, index: 222 }], ["פסיקתא דרב כהנא א, ז", { book: 277, index: 8 }], ["מלכים א י, יט", V(10, 10, 19)]],
        beitHamidrash: [["בית המדרש ב (דמות כסא שלמה)", { book: 7924, index: 8 }], ["ענין כסא שלמה", { book: 7958, index: 4 }], ["מלכים א י, יט", V(10, 10, 19)]]
      };
      const nf = (v) => String(+(+v).toFixed(2));                        // a model number for a text (no float tails)
      const fhCur = () => (ctx.shared.forestHouse && ctx.shared.forestHouse.current) || "rashi";
      const mech = () => (ctx.shared && ctx.shared.mechona) || null;
      // the features of the build tracks (FIXES-1.0.1-K.md 0.5f), each guarded: a missing one only skips its switch
      const feat = {
        section: () => { const s = ctx.shared.yatziaSection; if (s && typeof s.set === "function") s.set(true); },
        wallLayers: () => { const w = ctx.shared.wallLayers; if (w && typeof w.set === "function") w.set(true); },
        altarLayers: () => { const a = ctx.shared.incenseAltar; if (a && a.layers && typeof a.layers.set === "function") a.layers.set(true); },
        // 1.0.1-K review (vessels-3): the base back in its place at once when the demonstration is running (or still driving home; 1.0.1-L: the pills on the base start it):
        // "המכונות מקרוב" frames its home spot (flyPoints.mechonaClose), and after the demonstration the
        // base kept looping round the court, mostly out of the view (headless: 8 amot from home 1 s after the click)
        park: () => { const m = mech(); if (m && m.demo && typeof m.demo.reset === "function" && !m.demo.home) m.demo.reset(); },
      };
      // the parts' labels (layer mechonaParts) belong to the exploded view: they go off when the explode goes OFF, whoever switched it off
      // ("הרכב בחזרה", "↺ החזר הכל", the presentation). 1.0.1-K review (vessels-6): the hook only ever HIDES them, at that moment - they are
      // switched on by the pill itself (45-vessels.js, through ctx.ui.setLayer; 1.0.1-L, L.51: the place "המכונה בפירוק" is gone), so it never fights the pill
      // or a slide that shows them (1.0.1-K hid them only after the place had shown them). No allocation per frame.
      let explodeWas = false;
      ctx.animated.push(function() {
        const m = mech();
        const on = !!(m && m.explode && m.explode.on);
        if (on === explodeWas) return;
        explodeWas = on;
        if (!on && ctx.layers.mechonaParts && ctx.layers.mechonaParts.visible) setLayer("mechonaParts", false);
      });
      const PLACES = [
        ["הר הבית והחצרות", [
          { t: "הר הבית והחצר הגדולה", view: "harHabayit",
            info: "'ויעש חצר הכהנים והעזרה הגדולה' (דברי הימים ב ד, ט): העזרה הגדולה מקיפה את הבית ואת חצר הכהנים. חומתה נבנתה במודל בדגם חצר המלך וחצר בית ה' הפנימית — 'שלשה טורים גזית וטור כרתת ארזים' (מלכים א ז, יב), שלושה נדבכי אבן ונדבך של עץ עליהם (רש״י) — בחירת מודל. דלתותיה מצופות נחושת (דברי הימים ב ד, ט). הגודל, חמש מאות אמה, על פי מדות ב, א; גובה החומה, עשרים אמה — בחירת מודל.",
            refs: [["מלכים א ז, יב", V(10, 7, 12)], ["דברי הימים ב ד, ט", V(39, 4, 9)], ["מדות ב, א", MI(2, 1)]] },
          { t: "השער המזרחי", view: "eastGate",
            info: "השער המזרחי של החצר הגדולה, מול פתח הבית. 'ודלתותיהם צפה נחשת' (דברי הימים ב ד, ט). בפסוקים אין מספר לשערי החצר הגדולה ואין שמות — שער אחד בכל צד (בצפון ובדרום באמצע הצלע, במזרח ובמערב על ציר הבית) ו־56 מעלות אליו מן הקרקע הם בחירת מודל.",
            refs: [["דברי הימים ב ד, ט", V(39, 4, 9)], ["מלכים א ז, יב", V(10, 7, 12)]] },
          { t: "החצר החיצונה", view: "newCourt", // 1.0.1: was "עזרת נשים (החצר החדשה)" (the user); the key newCourt stays
            info: "החצר החיצונה — החצר שלפני חצר הכהנים: רש״י (מלכים א ו, לו) קורא לחצר הכהנים 'הפנימית' לפי שהייתה לפנים מעזרת נשים, כלומר חצר חיצונה לעם לפניה. בה לשכות (ירמיהו לה, ד; לו, י), 'העמוד' שעליו עמד המלך (מלכים ב יא, יד; כג, ג) וארון הנדבות שבשער (דברי הימים ב כד, ח). שערה — 'השער המזרחי של החצר החיצונה'; המסורת קוראת לשער העליון שבנה יותם 'שער בית ה׳ העליון' (מלכים ב טו, לה) — לא נבנה בנפרד. מידותיה, מפלסה וחומתה הנמוכה — בחירת מודל.",
            refs: [["רש״י מלכים א ו, לו", V(10, 6, 36)], ["ירמיהו לה, ד", V(13, 35, 4)], ["מלכים ב יא, יד", V(11, 11, 14)], ["דברי הימים ב כד, ח", V(39, 24, 8)], ["מלכים ב טו, לה", V(11, 15, 35)]] },
          // 1.0.1 (FIXES D.2 / F.1): the outer court's uses; positions (and, since 1.0.1-K, the cameras) from ctx.shared.outerCourtItems (20-mount.js)
          { t: "לשכות החצר החיצונה", tg: () => oci("לשכ", OCI_FB.lishkot), cam: () => ociCam("לשכ", OCI_FB.lishkot, 55),
            info: "לשכות בחצר בית ה׳: 'לשכת בני חנן בן יגדליהו איש האלהים אשר אצל לשכת השרים אשר ממעל ללשכת מעשיהו בן שלם שמר הסף' (ירמיהו לה, ד), 'בלשכת גמריהו בן שפן הספר בחצר העליון פתח שער בית ה׳ החדש' (ירמיהו לו, י), ו'לשכת נתן מלך הסריס' (מלכים ב כג, יא). הפסוקים מעידים על לשכות בחצר ולא על מקומן ומידותיהן: במודל שתיים לאורך כל אחת מן החומות הנמוכות, בצפון ובדרום, שתים עשרה על עשר ושמונה גובה, אבן ותקרת ארז, ופתחן אל החצר — בחירת מודל.",
            refs: [["ירמיהו לה, ד", V(13, 35, 4)], ["ירמיהו לו, י", V(13, 36, 10)], ["מלכים ב כג, יא", V(11, 23, 11)]] },
          // 1.0.1-K (K.9b item 2, the addendum C): "העמוד" - the king's standing place, the full explanation (it is also the label's card)
          { t: "העמוד — מקום המלך", tg: () => oci("עמוד", OCI_FB.amud), cam: () => ociCam("עמוד", OCI_FB.amud, 24),
            info: "'ותרא והנה המלך עמד על העמוד כמשפט' (מלכים ב יא, יד) — ביום המלכת יואש; וכן יאשיהו: 'ויעמד המלך על העמוד ויכרת את הברית לפני ה׳' (מלכים ב כג, ג); ובדברי הימים: 'והנה המלך עומד על עמודו במבוא' (דברי הימים ב כג, יג). רש״י: 'העמוד — הוא מעמד המלך בבית ה׳' (מלכים ב יא, יד), 'מקום מעמד המלך בבית המקדש' (כג, ג); מצודת דוד: 'על מקום מיוחד למלך לעמוד שם, וזהו כמשפט, רצה לומר: כמנהג המלך', ו'במבוא — במקום שבאים בה לעזרה' (דברי הימים ב כג, יג); התרגום: 'על אסטונא'. רש״י בדברי הימים (כג, יג) מביא את בימת הנחושת של שלמה — 'כי עשה שלמה כיור נחשת... ויעמד עליו ויברך על ברכיו' (דברי הימים ב ו, יג: חמש אמות ארכו וחמש רחבו ושלוש קומתו) — ומוסיף: 'ועד היום מנהג כשמועדים יחד, עומד המלך או הדוכוס במקום גבוה כדי שיוכלו לראותו, לשמע את דברו'. רלב״ג (מלכים ב כג, ג): 'ידמה שבנו שם עמוד והיה בו המלך בעת קראו את התורה כמו שנזכר בפרשת הקהל'. במודל: במה עגולה של אבן, ארבע אמות רוחבה ואמה גובהה, ועליה עמוד קצר, בחצר החיצונה סמוך למעלות שער חצר הכהנים ממזרח — 'במבוא'. צורתו ומקומו המדויק — בחירת מודל.",
            refs: [["מלכים ב יא, יד", V(11, 11, 14)], ["מלכים ב כג, ג", V(11, 23, 3)], ["דברי הימים ב כג, יג", V(39, 23, 13)], ["דברי הימים ב ו, יג", V(39, 6, 13)]] },
          { t: "ארון הנדבות שבשער", tg: () => oci("ארון", OCI_FB.aron), cam: () => ociCam("ארון", OCI_FB.aron, 14),
            info: "'ויאמר המלך ויעשו ארון אחד ויתנהו בשער בית ה׳ חוצה' (דברי הימים ב כד, ח) — בימי יואש, לאסוף את 'משאת משה' לבדק הבית; ובמלכים ב יב, י: 'ויקח יהוידע הכהן ארון אחד ויקב חר בדלתו ויתן אתו אצל המזבח מימין בבוא איש בית ה׳'. במודל ארון ארז, שתי אמות על אמה וחומש, וחריץ במכסהו, לפנים משער החצר החיצונה — על פי 'בשער בית ה׳ חוצה'; מידותיו ומקומו המדויק — בחירת מודל.",
            refs: [["דברי הימים ב כד, ח", V(39, 24, 8)], ["מלכים ב יב, י", V(11, 12, 10)]] },
          { t: "חצר הכהנים", view: "azarah", key: "azarah" },
          // 1.0.1-K (integration; the user: "אכן רצפת העזרה היתה משיש, אייר זאת כך"): the court floor in marble (30-courts.js, M.marblePave)
          // 1.0.1-L (vessels.json): the Sea now stands in the north-east corner (x 80, z -54) - the K camera [88, 14, -55] was 2.9 from it; this
          // one looks from the east wall's side across the floor toward the slaughter place, the ray clear (nearest surface 5)
          { t: "רצפת חצר הכהנים — שיש", tg: [64, 6.1, -42], cam: [86, 14, -30],
            info: "'ואבני שיש לרב' (דברי הימים א כט, ב) — רש״י: 'ואבני שיש — לעמודים ושלחנות ולרצפה'; התרגום: 'ואבני מרמוריא'. במודל כל רצפת חצר הכהנים, בין כתליה, לוחות שיש לבנים; גודל הלוחות (שלוש על שלוש אמות) — בחירת מודל. הרצועה שמתחת לחומה ומחוצה לה — אבן.",
            refs: [["דברי הימים א כט, ב (ורש״י שם)", V(38, 29, 2)]] },
          { t: "שערי חצר הכהנים", tg: [0, 14, 67.5], cam: [40, 42, 128],
            info: "שבעה שערים לחצר הכהנים — שלושה בצפון, שלושה בדרום ואחד במזרח — על פי מדות א, ד (מוסכמה למודל; במלכים לא נמנו השערים ולא נקראו בשם). דלתותיהם מצופות נחושת (דברי הימים ב ד, ט).",
            refs: [["מדות א, ד", MI(1, 4)], ["דברי הימים ב ד, ט", V(39, 4, 9)], ["מלכים א ו, לו", V(10, 6, 36)]] },
          // 1.0.1-K (K.6.5, Yossi): לשכת הגזית (30-courts.js). 1.0.1-L (L.21, the user: "רמבם", "לאורך", "הבא את שיטת התוספות יו"ט והמכילתא",
          // "גם בבית ראשון"): in the NORTH, east part of the north wall opposite the altar, lengthwise, half in / half out (courts.md FOR-UI);
          // the camera: from inside, high over the court half, west of the court door, looking down at the lots' ring, the line of the wall and the seats
          { t: "לשכת הגזית", view: "lishkatHaGazit",
            info: "לשכת הגזית — בצפון: 'שלש שבצפון: לשכת העץ, לשכת הגולה, לשכת הגזית' (יומא יט.; ראיית רב פפא שם עומדת רק בנוסח זה), וכן הרמב״ם (בית הבחירה ה, יז): 'והשלש שבצפון לשכת הגזית. לשכת הגולה. לשכת העץ. לשכת הגזית שבה סנהדרי גדולה יושבת. וחציה היה קדש וחציה היה חל. ולה שני פתחים אחד לקדש ואחד לחל ובחצי של חל היו הסנהדרין יושבין'; תוספות יום טוב (מדות ה, ג): 'ונראה בעיני שגירסת הספר נשתבשה' — ובמשנה הנדפסת (מדות ה, ד): 'שבדרום, לשכת העץ, לשכת הגולה, לשכת הגזית'. בחלקו המזרחי של הכותל הצפוני, מול המזבח: ציור התוספות יום טוב 'שבצפון סמוכה למזרח לשכת הגזית'; תפארת ישראל 'בזוית צפונית מזרחית של עזרת ישראל'; מכילתא 'נמצינו למדין שסנהדרין בצד מזבח'; תוספות רי״ד 'סמוכה למזבח ופתוחה למזבח'. 'לשכת הגזית כמין בסילקי גדולה היתה, פייס במזרחה, וזקן יושב במערבה' (יומא כה.; רש״י: 'בית גבוה שעל עלייה'), ואביי שם: 'שמע מינה לשכת הגזית חציה בקדש וחציה בחול, ושמע מינה שני פתחים היו לה, אחד פתוח בקדש, ואחד פתוח בחול' — לכן היא עומדת לאורך חומת החצר הפנימית הצפונית, חציה בחצר וחציה בחוץ (תפארת ישראל: 'בנויה חציה בדרום בקודש וחציה בצפון בחול'), וקו החומה מסומן ברצפתה. הפתחים כחק נתן: 'שהפתח הפתוח לחול היה פתוח לצד צפון סמוך למערב והפתח הפתוח לקדש היה פתוח לצד דרום סמוך למזרח', ומן הפתח החיצון מעלות: 'היו מעלות שעליה עולין וממנה יורדין לחול' (תוספות יום טוב ה, ד). הפייס בחצי הפנימי במזרח — טבעת ברצפה (רש״י: 'קבוצת היקף המפייסין במזרחה היתה'); והסנהדרין בחצי החיצון במערב: 'סנהדרי גדולה היתה של שבעים ואחד' (סנהדרין א, ו), 'כחצי גרן עגלה, כדי שיהו רואין זה את זה' (ד, ג) — שבעים ואחד מושבים בחצי עיגול בארבע שורות, פניהם לדרום (תפארת ישראל: 'פניהם לדרום ואחוריהן לצפון'). גם בבית ראשון: רש״י (דברי הימים ב לד, כב) 'כי לשכה אחת היתה לה לחולדה, סמוכה ללשכת הגזית'; מהרש״א (בבא בתרא צא:) 'כי במלכותו נתמנה סנהדרי גדולה לישב בלשכת הגזית'. וכך בתרשים הספר 'מקרא מפורש' (עמ' ב–ג, לשיטת רש״י): על החומה הצפונית, לאורכה, חציה בפנים וחציה בחוץ, ממערב לים. אין מידות במקורות: מידותיה (כ־24 על 19), מקומה המדויק בין השער לים, שורות המושבים והמעלות — בחירת מודל.",
            refs: [["יומא יט.", P(107, "יט.")], ["רמב״ם בית הבחירה ה, יז", RB(5, 17)], ["תוספות יום טוב מדות ה, ג", { book: 948, index: 194 }], ["מדות ה, ד", MI(5, 4)], ["צורת בית המקדש להתוספות יום טוב", { book: 6028, index: 42 }], ["צורת בית המקדש להתפארת ישראל", { book: 6029, index: 65 }], ["מכילתא בחדש יא", { book: 285, index: 1474 }], ["תוספות רי״ד יומא כה.", { book: 2109, index: 76 }], ["יומא כה.", P(107, "כה.")], ["חק נתן על מדות", { book: 6026, index: 116 }], ["תוספות יום טוב מדות ה, ד", { book: 948, index: 208 }], ["משנה סנהדרין א, ו", MN(73, 1, 6)], ["משנה סנהדרין ד, ג", MN(73, 4, 3)], ["רש״י דברי הימים ב לד, כב", { book: 3662, index: 1065 }], ["מהרש״א בבא בתרא צא:", { book: 2845, index: 313 }]] },
          // 1.0.1-L (L.68, the user: "מול השולחנות והטבעות שבבית שני... למה לא הוספת אותם גם בבית ראשון? - תוסיף"): the Second Temple's
          // slaughter place north of the altar, a model choice ("השלמות"); the texts and the refs from courts-2.md FOR-UI (every quote DB-checked)
          { t: "בית המטבחים", view: "slaughterPlace",
            info: "בית המטבחים של בית שני, בצפון המזבח — השלמה למודל מן המקורות על בית שני. בתורה: 'ושחט אתו על ירך המזבח צפנה' (ויקרא א, יא; רש״י: 'על ירך המזבח. על צד המזבח'); 'איזהו צפון — מקיר של מזבח צפוני ועד כותל העזרה, וכנגד כל המזבח כולו צפון, דברי רבי יוסי ברבי יהודה' (יומא לו.). הטבעות: 'וטבעות היו לצפונו של מזבח, ששה סדרים של ארבע ארבע, ויש אומרים, ארבעה של שש שש, שעליהן שוחטין את הקדשים' (מדות ג, ה) — תיקנן יוחנן כהן גדול: 'עמד והתקין להם טבעות בקרקע' (סוטה מח.; רש״י: 'טבעות - להכניס צואר בהמה לתוכו'); ברטנורא: 'והיו קבועות ברצפה עשויות כמין קשת שהיו מכניסים בהן צואר בהמה בשעת שחיטה ונועצים ראש הטבעת בארץ'. 'של שחר היה נשחט על קרן צפונית מערבית, על טבעת שניה. של בין הערבים היה נשחט על קרן מזרחית צפונית, על טבעת שניה' (תמיד ד, א; יומא סב:; רש״י: 'לא בטבעת שאצל המזבח אלא בשניה לה המשוכה לצד צפון'). השולחנות: 'שלשה עשר שלחנות היו במקדש, שמונה של שיש בבית המטבחים, שעליהן מדיחין את הקרבים' (שקלים ו, ד) — שתי שורות של ארבעה מצפון לדרום כרש״י (יומא טז:: 'נתונות ד' בראש ארבע נמצאו ד' זו אצל זו ברוחב') וכציור הספר; תפארת ישראל: 'עמדו ח׳ שולחנות של שיש, בב׳ שורות מצפון לדרום. וכל שורה של ד’ ד’'. הננסין: 'בית המטבחים היה לצפונו של מזבח, ועליו שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין. ומפשיטין על שלחנות של שיש שבין העמודים' (מדות ג, ה; תמיד ג, ה) — שתי שורות של ארבעה וכציור הספר (תפארת ישראל: 'שמונה עמודים ננסין עומדים בצפון המזבח בד׳ שורות מצפון לדרום, וכל שורה של ב’ ב'. ורחוקים מחומת צפון של עזרה ח' אמות'), עמודי אבן נמוכים (רש״י: 'עמודים נמוכין התקועין בקרקע'), עליהם 'חתיכות מרבעות של ארז' (ברטנורא) ובהן האונקליות 'זו למעלה מזו... לתלות בהמה גדולה או קטנה', במזרח בצפון ובדרום ולא במערב, 'שלא יהפכו המפשיטים אחוריהן לקדש הקדשים' (ראבי״ה בתוספות יום טוב). המרחקים כמדות ה, ב: 'מן המזבח לטבעות שמנה אמות, מקום הטבעות עשרים וארבע, מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע. מן הננסין לכתל העזרה שמנה אמות' — שמונה אמות פנויות מן המזבח, מקום הטבעות עשרים וארבע, ארבע עד אמצע השולחנות וארבע מהם לננסין (כסף משנה על הרמב״ם בית הבחירה ה, יד), ושמונה מן השורה האחרונה של הננסין עד כותל העזרה. בין שתי השורות שבע אמות (בבית שני 'בית המטבחים י״ב אמות ומחצה' — רמב״ם ה, יג; כאן מן המזבח לכותל חמישים וחמש אמות), ופני לשכת הגזית עומדים בתוך שמונה האמות האחרונות, כציור הספר. ויש שהעמידו את הננסין בשורה אחת: הראבי״ה בתוספות יום טוב 'אלא כל דממזרח למערב עמודים ח'. שלחנות שמנה', והגר״א 'כי שמונה ננסין היו. נמצא היו ז' אוירים וכנגד כל אויר היה שולחן'. כל המקורות על בית שני; מידות הטבעות, השולחנות, הננסין והאונקליות — בחירת מודל. ראו גם 'בית המטבחים — מקרוב'.",
            refs: [["ויקרא א, יא", V(3, 1, 11)], ["רש״י ויקרא א, יא", { book: 3694, index: 57 }], ["יומא לו.", P(107, "לו.")], ["מדות ג, ה", MI(3, 5)], ["מדות ה, ב", MI(5, 2)], ["משנה תמיד ד, א", MN(88, 4, 1)], ["משנה תמיד ג, ה", MN(88, 3, 5)], ["משנה שקלים ו, ד", { book: 54, index: 41 }], ["יומא טז:", P(107, "טז:")], ["רש״י יומא טז:", { book: 2157, index: 519 }], ["יומא סב:", P(107, "סב:")], ["רש״י יומא סב:", { book: 2157, index: 2322 }], ["סוטה מח.", P(119, "מח.")], ["רש״י סוטה מח.", { book: 2172, index: 2370 }], ["ברטנורא מדות ג, ה", { book: 643, index: 144 }], ["תוספות יום טוב מדות ג, ה", { book: 948, index: 132 }], ["תוספות יום טוב מדות ה, ב", { book: 948, index: 191 }], ["רמב״ם בית הבחירה ה, יג", RB(5, 13)], ["רמב״ם בית הבחירה ה, יד", RB(5, 14)], ["רמב״ם בית הבחירה ה, טו", RB(5, 15)], ["תפארת ישראל (יכין) מדות ג, ה", { book: 819, index: 421 }], ["צורת בית המקדש להתפארת ישראל — הננסין", { book: 6029, index: 99 }], ["צורת בית המקדש להתפארת ישראל — השולחנות", { book: 6029, index: 101 }], ["באורי הגר״א על מדות ה, ב", { book: 7509, index: 67 }]] },
          { t: "בית המטבחים — מקרוב", view: "slaughterPlaceClose",
            info: "שולחנות השיש והננסין מקרוב: 'שמונה של שיש בבית המטבחים, שעליהן מדיחין את הקרבים' (שקלים ו, ד) — שיש, 'לפי שהשיש מקרר ומצנן ושומר הבשר שלא יסריח' (ברטנורא); 'שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין' (מדות ג, ה) — האונקליות 'כעין מזלגות', 'זו למעלה מזו' (ברטנורא), בשלושה סדרים בגובה 1.7, 2.6 ו־3.5 אמות, בצד מזרח, צפון ודרום ולא במערב (ראבי״ה בתוספות יום טוב); ולפניהם הטבעות, 'כמין קשת' (ברטנורא). מידותיהם — בחירת מודל; כל המקורות על בית שני.",
            refs: [["משנה שקלים ו, ד", { book: 54, index: 41 }], ["מדות ג, ה", MI(3, 5)], ["ברטנורא מדות ג, ה", { book: 643, index: 144 }], ["תוספות יום טוב מדות ג, ה", { book: 948, index: 132 }], ["מדות ה, ב", MI(5, 2)]] },
          { t: "המעלות אל הבית (האוטם)", tg: [21, 10, 0], cam: [52, 26, 30],
            info: "שתים עשרה מעלות מחצר הכהנים אל האולם, והבית עומד על אוטם של שש אמות — על פי מדות ג, ו ו־ד, ו; מלבי״ם (מלכים א ו, ח) מזכיר יסוד של שש אמות מתחת לבית. במלכים אין מפלסים — בחירת מודל.",
            refs: [["מדות ג, ו", MI(3, 6)], ["מדות ד, ו", MI(4, 6)], ["מלבי״ם מלכים א ו, ח", V(10, 6, 8)]] }
        ]],
        ["המזבח וכלי הנחושת", [
          { t: "מזבח הנחושת", view: "mizbeach", key: "mizbeach" },
          // 1.2.0 (the user): does the altar block the doorway? the view from the house's doorway down the axis, per the reading of the row
          { t: "מפתח ההיכל אל המזבח — האם המזבח חוסם את הפתח", view: "altarFromDoor",
            info: "המבט מפתח הבית מזרחה, לאורך ציר הבית, אל המזבח והכבש. לפי רבי יהודה (ממוצע) גוף המזבח והכבש עומדים בקו ישר כנגד הפתח וחוסמים את מראהו; לפי רבי אליעזר בן יעקב (כולו בדרום) הפתח פנוי וגוף המזבח מתחיל בקו הציר; לפי רבי יוסי (כולו בצפון) הכבש הוא שנמשך אל מול הפתח. החלפת השיטה — בשורה 'מקום המזבח' שבטבלת השיטות (ובכרטיס זה).",
            refs: [["יומא טז.", P(107, "טז.")], ["זבחים סג.", P(130, "סג.")]] },
          // 1.0.1-K review (ui-1 / cross-3): the camera stood by לשכת הגזית (30-courts.js, x 59..89, z 50..85, 22 high and its lantern)
          // and looked through its walls and roofs; now inside the court WEST of it, south-west of the ramp (40-altar.js: x 41.5..57.5,
          // z 10..42, rising to the altar's top at 16) - ray-tested clear to the target, fade on and off, both placements of the Sea;
          // model choice
          { t: "הכבש", tg: [49.5, 12, 28], cam: [35, 32, 62],
            info: "הכבש עולה אל המזבח מדרומו, כי אסור לעלות במעלות ('ולא תעלה במעלת על מזבחי', שמות כ). מידותיו, שלושים ושתיים על שש עשרה, על פי מדות ג, ג כמוסכמה; במלכים ובדברי הימים אין כבש.",
            refs: [["דברי הימים ב ד, א", V(39, 4, 1)], ["מדות ג, ג", MI(3, 3)]] },
          // 1.0.1-H: one place for the Sea; its two placements (Rashi / Radak) are chosen in the opinions table, not here
          { t: "הים של שלמה", view: "yam", key: "yam" },
          // 1.0.1-K (K.3): the oxen close (flyPoints.yamOxen, follows ctx.shared.seaPlacement)
          { t: "שנים עשר הבקר", view: "yamOxen",
            info: "'עמד על שני עשר בקר שלשה פנים צפונה ושלשה פנים ימה ושלשה פנים נגבה ושלשה פנים מזרחה והים עליהם מלמעלה וכל אחריהם ביתה' (מלכים א ז, כה; דברי הימים ב ד, ד). רש״י: 'אל תחת הים היו אחוריהם פונים'; מצודת דוד: 'אחוריו של זה מול אחוריו של זה'; רלב״ג: 'והנה היו פני הבקר בחוץ נראים ואחוריהם היו נסתרים תחת הים'. במודל, כציור הספר: חציו הקדמי של כל שור יוצא מתחת לים — הצוואר, החזה והרגליים הקדמיות בקו דופן הים, והחוטם כשתי אמות מחוץ לדופן — וראשו ראש שור מובהק: מצח רחב ושטוח, חוטם מרובע, אוזניים לצדדים וקרניים קצרות ועבות. גודל השוורים וצורתם — בחירת מודל. מקום הים (צפון־מזרח לרש״י, דרום־מזרח לרד״ק) — בטבלת 'שיטות ומחלוקות'.",
            refs: [["מלכים א ז, כה", V(10, 7, 25)], ["ז, מד", V(10, 7, 44)], ["דברי הימים ב ד, ד", V(39, 4, 4)], ["רש״י ז, כה", V(10, 7, 25)]] },
          // 1.0.1-L (L.74, the user: "הכיור בין שתי השורות! של המכונות"; L.77 the book p. לח; vessels-2.md): Moses' laver in the middle column, between the two rows
          // of five; flyPoints.kiyorMoshe (45-vessels.js), with a fallback of the same camera
          { t: "כיור משה", view: "kiyorMoshe", tg: [rowX, 9, kz], cam: [rowX + 18, 19, kz],
            info: "כיור משה עומד באמצע, בין שתי שורות המכונות: 'חמשה מימין כיור של משה וחמשה משמאל כיור משה' (ברייתא דמלאכת המשכן יב). 'ויעש כיורים עשרה ויתן חמשה מימין וחמשה משמאול' (דברי הימים ב ד, ו) — רש״י: 'ויתן חמשה מימין. לכיור של משה'; רד״ק (שם): 'מימין כיור משה ומשמאלו'. ובמשנה: 'הכיור היה בין האולם ולמזבח, ומשוך כלפי הדרום' (מדות ג, ו). ובמשכן: 'ועשית כיור נחשת וכנו נחשת לרחצה ונתת אתו בין אהל מועד ובין המזבח' (שמות ל, יח); רש״י שם: 'ועומד כנגד אויר שבין המזבח והמשכן', 'משוך קמעא כלפי הדרום'. ובו שני ברזים: 'בן קטין עשה שנים עשר דד לכיור, שלא היו לו אלא שנים' (משנה יומא ג, י) — תוספת של בית שני. במודל: " + nf(rowX - ulamE) + " אמות מזרחה מחזית האולם ו־" + nf(kz) + " אמות דרומה מציר הבית — בחירת מודל, כציור הספר.",
            refs: [["מדות ג, ו", MI(3, 6)], ["ברייתא דמלאכת המשכן יב", { book: 240, index: 2876 }], ["דברי הימים ב ד, ו", V(39, 4, 6)], ["רש״י שם", { book: 3662, index: 129 }], ["רד״ק מלכים א ז, לט", { book: 3540, index: 505 }], ["שמות ל, יח", V(2, 30, 18)], ["רש״י שמות ל, יח", { book: 3692, index: 2237 }], ["משנה יומא ג, י", MN(55, 3, 10)]] },
          // 1.0.1-L (L.40, L.64, L.77; vessels.json FOR-UI): the block of 2 x 5, the purpose, the pills (L.51: the panel places for the demo and
          // the explode are gone - the pills on the base do it)
          { t: "עשר המכונות והכיורות", view: "mechonot",
            info: "המכונות (מלכים א ז, כז–לז): 'ארבע באמה ארך המכונה האחת וארבע באמה רחבה ושלש באמה קומתה' — רש״י: אמה וחצי קומת האופן ואמה וחצי גובה המכונה, 'האמה גבה היתה מרבעת, אבל חצי האמה היתה עגלה'. על כל מכונה כן וכיור של 'ארבעים בת' (ז, לח). מקומן: 'ויתן את המכנות חמש על כתף הבית מימין וחמש על כתף הבית משמאלו' (ז, לט) — במודל, כציור 'מקרא מפורש' (עמ' לח) וכמפתו (עמ' ב–ג): כולן במקום אחד, שתי שורות של חמש וכיור משה ביניהן — 'ויתן חמשה מימין. לכיור של משה' (רש״י דברי הימים ב ד, ו), 'מימין כיור משה ומשמאלו' (רד״ק שם); ורש״י ז, לט: 'על כתף הבית. כנגד כתף הבית הימנית'. המקורות אומרים מימין לכיור ומשמאלו, ושתי השורות הן ציור הספר — מדרום לציר הבית, מול אגף האולם הדרומי, בינו לבין הכבש: השורה הצפונית בין האגף לכבש, והדרומית מעט מדרום להם. תפקיד המכונה: מושב הכיור: 'המכונה היא מושב הכיור' (רד״ק ז, כז). הכיורות לשני דברים. קידוש ידים ורגלים: 'לרחצה בהם. קדוש ידים ורגלים' (רש״י דברי הימים ב ד, ו); 'והכיורים היו לרחוץ מהם הכהנים ידיהם ורגליהם ולהדיח בהם מעשה העולה' (רד״ק ז, לט). והדחת העולה: 'את מעשה העולה ידיחו בם' (דברי הימים ב ד, ו). האופנים — 'ב׳ לפנים ב׳ לאחור, כאלו ישאו אותה' (מצודת דוד ז, ל); בעל צורת הבית: 'אופן בתוך אופן, למען יוכל להוליכם אל אשר יהיה הרוח והרצון להוליכם, שמה יוליכם מבלי שיצטרך להפכם אנה ואנה'. בהדגמה (הכפתור 'הבא את הכיור לקידוש ידים ורגלים ולהדחת העולה' שעל המכונה שבשורה הצפונית) המכונה עוצרת תחילה בין האולם למזבח, ליד הכבש, לקידוש הכהנים: 'ורחצו אהרן ובניו ממנו את ידיהם ואת רגליהם' (שמות ל, יט). אחר כך היא נוסעת לשלחנות השיש שבבית המטבחים: 'שעליהן מדיחין את הקרבים' (שקלים ו, ד); 'וקרבו וכרעיו ירחץ במים' (ויקרא א, ט). ואז היא חוזרת. לאן הוליכום אין מקור מפורש: המקום, הדרך והמים הם בחירת מודל. הכפתור השני מפרק אותה לחלקיה. ראו 'המכונות מקרוב'.",
            refs: [["מלכים א ז, כז", V(10, 7, 27)], ["ז, ל", V(10, 7, 30)], ["ז, לז (בעל צורת הבית)", V(10, 7, 37)], ["ז, לח", V(10, 7, 38)], ["ז, לט", V(10, 7, 39)], ["דברי הימים ב ד, ו", V(39, 4, 6)], ["ד, יד", V(39, 4, 14)], ["שמות ל, יט", V(2, 30, 19)], ["ויקרא א, ט", V(3, 1, 9)], ["משנה שקלים ו, ד", MN(54, 6, 4)]] },
          // 1.0.1-K (K.3, the user: "לא מצליחים לראות את המכונות ופעולתם היטב - אין לשם גישה"): the base close, its operation, taken apart
          // (1.0.1-K review, vessels-3: the close view parks a running demonstration - it frames the base's home spot)
          // 1.0.1-L (L.61, L.63, L.65, L.66, L.62; vessels-2.md): three frames a side, the flat decorations, the capital as the user describes it, the wheels, 40 bat
          { t: "המכונות מקרוב", view: "mechonaClose", action: () => feat.park(),
            info: "מכונה אחת מקרוב (מלכים א ז, כז–לח, ופירוש רש״י). האופנים — 'וקומת האופן האחד אמה וחצי האמה' (ז, לב): בכל פינה אופן גדול עומד, ההולך קדימה ואחור, וגלגל קטן שוכב, המסובב אותו לצדדים — 'אופן בתוך האופן שתי וערב' (רש״י ז, לג), כציור הספר (עמ' לז). גוף המכונה — 'מסגרת להם ומסגרת בין השלבים' (ז, כח): למטה 'מחיצה נמוכה, מקפת וסוגרת את המכונה מכל ארבעת הפאות' (מצודת דוד), ממנה עולים השלבים — 'כעין שליבות סלם, כמין מקלות נחשת זקופין על המסגרות התחתונה' (רש״י) — וביניהם 'מסגרות קבועות משליבה לשליבה': שלוש מסגרות בין השלבים בכל צד, כביאור הגר״א. עליהן הציורים, דקים ושטוחים (בחירת מודל), ועל הליות רש״י ז, כט: 'מרדדין, כמין רדוד טס דק, ואין בולטין בעביו, ולא חקוקים בשקוע': 'אריות בקר וכרובים' (ז, כט) — ארי ובקר בשורה העליונה, כרובים מתחתם וליות חבוקות ביניהם ('ליות, כמין זכר ונקבה מחברין זה בזה', רש״י); על המסגרות התחתונות ועל הנסרים — 'כרובים אריות ותמרת' (ז, לו); על הכתפות — כרובים. הכותרת — 'גג המכונה עשוי כמין כובע משפע מכל צדדיו', ובאמצעה 'נקב עגל אמה וחצי אמה רחב בעגול, וסביב אותו נקב כמין הקף מחצה, חצי אמה גבה סביב' (רש״י ז, לא): הוא 'פי הכותרת', ועליו מקלעות — 'צורת פרחים'; 'והכן מנח על אותו הקף, ושולי הכן תחובין בתוך פי ההקף, ולמעלה הימנו הוא בולט אמה'. הכתפות 'בולטות למעלה מן הנסרים בזויות הכן' (רש״י ז, ל). והכיור — 'ארבעים בת יכיל הכיור האחד ארבע באמה הכיור האחד' (ז, לח): 'ארבעים בת שהם מאה ועשרים סאין, שהוא שיעור ג' מקואות' (מלבי״ם), 'ט' פעמים אמה על אמה ברום אמה' (רלב״ג); רוחבו מבפנים אמה וחצי ורביע — 'אם היה כולו עגול' (מלבי״ם ז, כח); למלבי״ם עצמו, שהתחתונה מרובעת, זו המידה מבחוץ. ובמודל 42 בת עד השפה, ולחשבון הגמרא, שהמרובע יתר על העגול רביע, 40.3. עליו שני ברזים: 'כעין דוד ולה דדים המריקים מים' (מצודת ציון דברי הימים ב ד, ו); צורתם כציור הספר. סך הכל שבע אמות עם הכיור. מקום האופנים בתוך ריבוע המכונה, עובי הדופן, רוחב ריבוע הכן וצורות הציורים — בחירת מודל.",
            refs: [["מלכים א ז, כח", V(10, 7, 28)], ["ז, כט", V(10, 7, 29)], ["ז, ל", V(10, 7, 30)], ["ז, לא", V(10, 7, 31)], ["ז, לב", V(10, 7, 32)], ["ז, לג", V(10, 7, 33)], ["ז, לו", V(10, 7, 36)], ["ז, לח", V(10, 7, 38)], ["מלבי״ם ז, לח", { book: 3394, index: 406 }], ["רלב״ג ז, לח", { book: 3645, index: 292 }]] },
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
            info: "'ויקם את העמוד הימני ויקרא את שמו יכין' (מלכים א ז, כא) — 'בפאת הדרומי' (מצודת דוד). המבט מן החצר, מצפון לציר, בעד פתח האולם ובין דלתותיו הפתוחות, והאולם סגור: העמוד כולו, מן הרצפה ועד ראש הכותרת — עשרים ואחת אמה, כמעט כגובה הפתח (עשרים ושתיים) — וכך נראה גודלו. מקום המבט — בחירת מודל; שני העמודים יחד, בלי להסיר דבר, אינם נראים שלמים מנקודה אחת.",
            refs: [["מלכים א ז, כא", V(10, 7, 21)], ["ז, טו", V(10, 7, 15)], ["ז, טז", V(10, 7, 16)], ["דברי הימים ב ג, יז", V(39, 3, 17)]] },
          { t: "בועז — מבעד לפתח, לכל גובהו", cam: () => [37, 24, 15.5], tg: () => [pil.x + 1.69, 22.5, -pil.z + 1.24],
            info: "'ויקם את העמוד השמאלי ויקרא את שמו בעז' (מלכים א ז, כא). המבט מן החצר, מדרום לציר, בעד פתח האולם ובין דלתותיו הפתוחות, והאולם סגור: העמוד כולו, מן הרצפה ועד ראש הכותרת — עשרים ואחת אמה, כמעט כגובה הפתח (עשרים ושתיים) — וכך נראה גודלו. מקום המבט — בחירת מודל.",
            refs: [["מלכים א ז, כא", V(10, 7, 21)], ["ז, טו", V(10, 7, 15)], ["ז, טז", V(10, 7, 16)], ["דברי הימים ב ג, יז", V(39, 3, 17)]] },
          // 1.0.1-L (verify-heichal.md FOR-UI 4): the far view's twin: Boaz whole from the south-east (the grid's "יכין ובועז" shows Yachin); the label בועז opens this text
          { t: "בועז — מרחוק", view: "boazFar",
            info: ui_YB_BODY + " המבט מרחוק, מן החצר, מדרום־מזרח, והאולם סגור: בעד פתח האולם (עשר על עשרים ושתיים) ובין דלתותיו הפתוחות נראה בועז בשלמותו, מן הרצפה ועד ראש הכותרת — עשרים ואחת אמה — כנגד חזית האולם, המעלות והמזבח, כדי שייראה גודלו. שני העמודים יחד אינם נראים בשלמותם מבחוץ. גררו את המבט סביב הפתח אל הצפון־מזרח — ונראה יכין. מקום המבט — בחירת מודל.",
            refs: ui_REFS.yachinBoaz },
          { t: "כותרת העמוד — שבכה, רימונים ושושנים", view: "yachinBoazCapital",
            info: "'חמש אמות קומת הכתרת האחת' (מלכים א ז, טז). רש״י (ז, יח): 'כמין שני אגנים היתה כל אחת, אגן התחתון בית קבולה למעלה, והוא קרוי גלה... העליון כפוי על התחתון', 'נמצא רחבה במקום הדבק... והוא קרוי בטן', 'והאמה החמישית, היא כותרת קטנה למעלה מן הגדולה'. במודל, כציור הספר: הגולה התחתונה — שתי אמות, ועליה שושנים; על הבטן שני טורי רימונים, 'מאה רמונים בטור, חרוזים בשרשרות' (רש״י ז, מב; 'והרמונים מאתים', ז, כ), 'והרמונים מכסים את מקום הדבק' (רש״י ירמיהו נב, כב); השבכה — 'דומה כמין כפה' (רש״י ז, יז), 'שבעה לולבין היה להקף אחד', 'וגדילים היו להם כמעשה שרשראות'; ועל ראשה הכותרת הקטנה, אמה. 'וקומת הכתרת שלש אמות ושבכה ורמנים על הכתרת סביב' (מלכים ב כה, יז) — הכיפה עם הכותרת הקטנה. רש״י (ז, טז) מביא גם ששתי האמות התחתונות 'היו שוות לעמוד, שלא היו בהן צורה'; הספר והמודל הולכים אחרי רש״י (ז, יח) בגולה מצוירת שושנים. העמוד תחוב בכותרת שתי אמות (רש״י ז, טז). קריאה שנייה — מלבי״ם על 'מעשה שושן' (ז, יט): שבכה ארוגה מנחושת, שרשרות ורימונים תלויים, ושושן מצויר על הכותל — בשורה 'כותרות יכין ובועז' בטבלת 'שיטות ומחלוקות'.",
            refs: [["מלכים א ז, טז", V(10, 7, 16)], ["ז, יז", V(10, 7, 17)], ["ז, יח", V(10, 7, 18)], ["ז, כ", V(10, 7, 20)], ["ז, מב", V(10, 7, 42)], ["ירמיהו נב, כב", V(13, 52, 22)], ["מלכים ב כה, יז", V(11, 25, 17)]] }
        ]],
        ["הבית מבחוץ", [
          // 1.0.1-K (K.2.4): the ulam (flyPoints.ulamInside). 1.0.1-L (L.44): from the front; L.59 the doorway and its doors have their own place
          { t: "האולם ובית החליפות", view: "ulamInside",
            info: "'והאולם על פני היכל הבית עשרים אמה ארכו על פני רחב הבית עשר באמה רחבו' (מלכים א ו, ג). בית החליפות: לפי רש״י (יומא לו.) האולם רחב מן הבית חמש עשרה אמה מכל צד, ושם גנזו את הסכינים — וחזית האולם במודל שמונים וארבע אמות, גוף הבית עם התאים ועוד חמש עשרה אמה מכל צד (מדות ד, ז: 'האולם עודף עליו חמש עשרה אמה מן הצפון וחמש עשרה אמה מן הדרום'). כתלי האולם שלושה נדבכי גזית ונדבך ארזים — 'ולאלם הבית' (ז, יב) כפירוש מצודת דוד ('כי כולם בנה בשלשה טורים גזית'), רלב״ג, מלבי״ם ורד״ק; רש״י שם מתאר את הדגם בלבד. המבט מן החזית, מול הפתח; פתחו — עשר על עשרים ושתיים — ושתי דלתותיו: ראו 'פתח האולם ודלתותיו'.",
            refs: [["מלכים א ו, ג", V(10, 6, 3)], ["יומא לו.", P(107, "לו.")], ["מדות ד, ז", MI(4, 7)], ["מלכים א ז, יב", V(10, 7, 12)]] },
          // 1.0.1-L (L.59, the user: "רוחב 10 גובה 22"; heichal-door.md): the doorway and its two open cedar doors - the camera from the court,
          // north-east of the axis and above the altar's reach, looking into the doorway at the south leaf folded in its reveal (ray-tested); the eye above its
          // target (verify-heichal.md FOR-UI 7: from below the orbit limit lifts the eye), far enough for the whole doorway, threshold to lintel, in the frame
          { t: "פתח האולם ודלתותיו", tg: () => [ulamDoor.x[1], (ulamDoor.y[0] + ulamDoor.y[1]) / 2, -3], cam: () => [ulamDoor.x[1] + 35.5, ulamDoor.y[0] + 21, -14],
            info: "פתח האולם — עשר על עשרים ושתיים, בחירת מודל: אין מקור למידות פתח האולם בבית ראשון; הכתוב מודד רק את האולם — 'עשרים אמה ארכו על פני רחב הבית עשר באמה רחבו' (מלכים א ו, ג); 'פתחו של אולם, גבהו ארבעים אמה, ורחבו עשרים אמה' (מדות ג, ז) ו'חוץ משל אולם' (מדות ב, ג) הם בית שני. בו שתי דלתות ארז, פתוחות ומקופלות אל תוך עובי הפתח כדלתות ההיכל — 'החיצונות נפתחות לתוך הפתח לכסות עביו של כתל' (מדות ד, א) — שכן לבית ראשון היו דלתות באולם: 'גם סגרו דלתות האולם ויכבו את הנרות' (דברי הימים ב כט, ז), מלבי״ם שם: 'ואח״כ סגרו דלתות האולם'; והן עמדו פתוחות ביום — המאירי (יומא נד.): 'ואע״פ ששערים של עץ היו שם מ״מ לא היו נועלים אותם ביום ופורסים הפרוכת לפניהם' — הפרוכת שהוא מזכיר לא נבנתה. ראש הפתח משקוף ישר כציור הכללי בספר (רש״י ז, ה מתאר פתח אולם 'עשויין כפה' — לא נבנה). ארז ולא זהב — באולם אין ציפוי זהב (רש״י ומצודות על דברי הימים ב ג, ד); צירי הנחושת, עובי הדלת (שליש אמה) ולוח אחד לכל דלת — בחירת מודל. הדלתות נעלמות עם חזית האולם בכפתור 'פתח את האולם'.",
            refs: [["מלכים א ו, ג", V(10, 6, 3)], ["מדות ג, ז", MI(3, 7)], ["מדות ב, ג", MI(2, 3)], ["מדות ד, א", MI(4, 1)], ["דברי הימים ב כט, ז", V(39, 29, 7)], ["יומא נד.", P(107, "נד.")], ["רש״י מלכים א ז, ה", V(10, 7, 5)], ["דברי הימים ב ג, ד", V(39, 3, 4)]] },
          // 1.0.1-L (L.72, the user: "תוסיף את שיטת ר' יוסי בר' יהודה שהיו עוד 2 שולחנות... הוסף בכפתור נפרד"; heichal-door.md): the place
          // switches the reading on (ctx.shared.ulamTables "ryby") for 15 s (L.27) and flies to the tables; the row of the opinions table keeps it
          { t: "שולחנות האולם — ר׳ יוסי בר׳ יהודה", view: "ulamTables",   // 1.1.0: the tables are always shown (no feature to switch on)
            info: "שני שולחנות באולם, לפני פתח ההיכל: 'רבי יוסי ברבי יהודה אומר: לא היו מסדרין אלא על של משה, אלא מה אני מקיים ״ואת השלחנות אשר עליהם לחם הפנים זהב״? אלו שלשה שלחנות שהיו במקדש: שנים שהיו באולם מבפנים לפתח הבית, אחד של כסף ואחד של זהב' (מנחות צט.) — ולדבריו עמדו בבית שלמה (דברי הימים ב ד, יט: 'ואת השלחנות ועליהם לחם הפנים'). רש״י: 'אצל פתח ההיכל אחד של כסף ואחד של זהב והאי דקרי הכא כסף ובמתניתין שייש משום דשייש לבן ככסף'; 'בכניסתו מניחו על של כסף וכשמגיע להיכל מסדר על של משה שמצופה זהב הרי עלייה ולא מורידין לכך ביציאתו מניחו על של זהב'. המשנה (שקלים ו, ד; מנחות יא, ז): 'ושנים באולם מבפנים על פתח הבית, אחד של שיש ואחד של זהב, על של שיש נותנין לחם הפנים בכניסתו, ועל של זהב ביציאתו, שמעלין בקדש ולא מורידין', וכן הרמב״ם (בית הבחירה ג, טז). במודל: שני שולחנות במידת שולחן לחם הפנים (שמות כה, כג), בתוך האולם סמוך לפתח ההיכל משני צדי המעבר — הכסף בצפון והזהב בדרום, בחירת מודל על פי 'המכניסים עומדים בצפון... המוציאין עומדים בדרום' (מנחות יא, ז). הכפתור מראה אותם וחוזר לבד אחרי 15 שניות; לבחירה קבועה — השורה 'שני השולחנות שבאולם' בטבלת 'שיטות ומחלוקות' (שם גם המשנה: שיש וזהב).",
            refs: [["מנחות צט.", P(131, "צט.")], ["דברי הימים ב ד, יט", V(39, 4, 19)], ["משנה שקלים ו, ד", MN(54, 6, 4)], ["משנה מנחות יא, ז", MN(81, 11, 7)], ["רמב״ם בית הבחירה ג, טז", RB(3, 16)], ["שמות כה, כג", V(2, 25, 23)]] },
          { t: "הבית (בית ה׳)", tg: [-25, 24, 27.2], cam: [90, 80, 150], // 1.0.1: was "ההיכל" - that name is the kodesh (I Kings 6:17, the user); the whole house is "בית ה׳" (the 3D label too)
            info: "'והבית אשר בנה המלך שלמה לה׳ ששים אמה ארכו ועשרים רחבו ושלשים אמה קומתו' (מלכים א ו, ב) — מידות הפנים. 'ההיכל' בפסוקים הוא חלל ארבעים האמה שבתוך הבית, שבו המנורות ('הבית הוא ההיכל לפני', ו, יז); הבית כולו — 'בית ה׳'. הקירות אבן שלמה מסע (ו, ז), והבית סגור מכל צדדיו; סביבו מדרום, ממערב ומצפון שלוש קומות התאים, וכותל הבית נכנס אמה בכל קומה — 'מגרעות' (ו, ו): שבע אמות עוביו בקומה התחתונה, שש בתיכונה, חמש בעליונה וארבע מעל גג התאים — חשבון רש״י כפי שמצייר הספר (במדות ד, ז, בבית שני — שש).",
            refs: [["מלכים א ו, ב", V(10, 6, 2)], ["ו, ו", V(10, 6, 6)], ["ו, ז", V(10, 6, 7)], ["רש״י ו, ו", V(10, 6, 6)], ["מדות ד, ז", MI(4, 7)]] },
          { t: "חלוני שקופים אטומים", tg: [-35, 34, 14.5], cam: [-20, 40, 52],   // the window band y 32.75..35.25 on the house wall's face z 14, over the chambers' roof (y 30)
            info: "'ויעש לבית חלוני שקפים אטמים' (מלכים א ו, ד): לפי רש״י ומנחות פו: — פתוחים (רחבים) מבחוץ ואטומים (צרים) מבפנים, שלא כחלונות רגילים, להראות שאין הבית צריך לאורה. מספרם ומקומם אינם במקורות — במודל שישה בכל צד, לאורך ההיכל, מעל גג היציע (בחירת מודל; ראו 'השלמות').",
            refs: [["מלכים א ו, ד", V(10, 6, 4)], ["מנחות פו:", P(131, "פו:")]] },
          // 1.2.0 (the user): the three layers of the ceiling by name, after the book (figs. 14-15) and Rashi 6:9; the house opened shows them in section
          { t: "בית דילפא — בין תקרת הגבים לשדרות", tg: [-25, 44, 9], cam: [8, 52, 40],
            info: "'ויספן את הבית גבים ושדרת בארזים' (מלכים א ו, ט) — שתי תקרות: התחתונה, ה'גבים', לנוי — רש״י: 'כמין לבנים חלולות' (רעפים) או נסרים ארוגים נאים; מצודות: 'גומות גומות חקוקות לנוי' — במודל כיור מצויר ומצופה זהב; והעליונה, ה'שדרות', ארזים סדורים זה בצד זה 'לדריסת הרגל' (רש״י) — רצפת העלייה. ביניהן חלל של שתי אמות, 'בית דילפא' (רמב״ם בית הבחירה ד, ג, שהובא במלבי״ם): שם נוטף הגשם, ולא לתקרת ההיכל. כך מעל ההיכל, וכך מעל כל אחת משתי העליות. לראות: הכפתור ״פתח את הבית״ שעל המודל, או ״פתח את העליות״.",
            refs: [["מלכים א ו, ט", V(10, 6, 9)], ["רש״י שם", V(10, 6, 9)], ["מצודת ציון שם", V(10, 6, 9)], ["רמב״ם בית הבחירה ד, ג", RB(4, 3)], ["דברי הימים ב ג, ט", V(39, 3, 9)]] },
          { t: "גג הבית ותקרותיו", tg: [-30, 46, 0], cam: [40, 92, 62],
            info: "'ויספן את הבית גבים ושדרת בארזים' (מלכים א ו, ט): תקרה כפולה — ה'גבים' למטה (כיור מצויר ומצופה זהב, אמה), חלל 'בית דילפא' (שתי אמות; הרמב״ם בית הבחירה ד, במלבי״ם), וה'שדרות' למעלה — ארזים זה בצד זה, רצפת העלייה (רש״י). מעליה, בקריאת 120 האמה, שתי העליות (השורה 'גובה הבית'). תקרת קודש הקדשים נמוכה מתקרת ההיכל (רש״י ו, כ), ומעליה עלייה מצופה זהב (דברי הימים ב ג, ט).",
            refs: [["מלכים א ו, ט", V(10, 6, 9)], ["ו, כ", V(10, 6, 20)], ["דברי הימים ב ג, ט", V(39, 3, 9)], ["רמב״ם בית הבחירה ד, ג", RB(4, 3)]] },
          { t: "קודש הקדשים מבחוץ", view: "heichalWest",
            info: "הדביר בירכתי הבית במערב: 'עשרים אמה ארך ועשרים אמה רחב ועשרים אמה קומתו' (מלכים א ו, כ). מבחוץ סובבים אותו תאי היציע של המערב, ומעליו עליית קודש הקדשים — תקרתו נמוכה מתקרת ההיכל (רש״י ו, כ).",
            refs: [["מלכים א ו, כ", V(10, 6, 20)], ["ו, טז", V(10, 6, 16)]] }
        ]],
        // 1.0.1-L (L.43, the user: "הכפתור... צריך להיות בתפריט היציע באופן ברור"): the yatzia has its own group - the closed chambers, the
        // SECTION (its camera turns to the cut: flyPoints.yatziaSection, square-on - heichal.json; the feature goes off by itself after 15 s,
        // L.27, and 50-heichal.js's set(false) then takes the camera out of the closed chambers), and the chambers' door
        ["היציע — התאים", [
          { t: "היציע והתאים", view: "heichalSouth", key: "heichalSouth" },
          { t: "חתך היציע", view: "yatziaSection", cardSide: "left",   // the cut stands where the card beside the panel would hide it for its 15 seconds
            feature: { key: "yatziaSection", isOn: () => !!(ctx.shared.yatziaSection && ctx.shared.yatziaSection.on),
              on: () => feat.section(), off: () => { const s = ctx.shared.yatziaSection; if (s && typeof s.set === "function") s.set(false); } },
            info: "'היציע התחתנה חמש באמה רחבה והתיכנה שש באמה רחבה והשלישית שבע באמה רחבה כי מגרעות נתן לבית סביב חוצה לבלתי אחז בקירות הבית' (מלכים א ו, ו). רש״י: 'קומת התא חמש אמות, וכשעולה כתל ההיכל חמש אמות, גורע את עביו, וכנס בו אמה לפנים, והניח על אותה כניסה ראשי קורות גג עלית התא, שהיא קרקעית לאמצעית', ומסיים: 'נמצאת אמצעית רחבה מן התחתונה אמה, והעליונה רחבה מן התיכונה אמה'; וכל קומה חמש אמות — 'הרי גבהן חמש עשרה אמות, לבד עבי התקרה' (רש״י ו, י). מצודת דוד: 'וכן פחתו אמה בכלות חמשה עשר אמות, להניח על כניסת האמה קורות תקרת השלישים'. בחתך, מול פניו: כל קומה בצבע משלה — התחתונה כחול, התיכונה ירוק, השלישית כתום, והכותל שמעל גג התאים סגול — רצועת כותל הבית והתא שלידה באותו צבע: כותל 7 ותא 5, כותל 6 ותא 6, כותל 5 ותא 7; מה שהכותל נכנס — התא מתרחב, וכותל התא (חמש אמות, 'וכתל התא חמש', מדות ד, ז) עולה ישר. המגרעות, אמה בכל קומה, בצהוב, וראשי קורות הארז מונחים עליהן. החתך עובר בקצהו המזרחי של התא האמצעי שבדרום, ומאחוריו נראים הלולים. הכפתור מסובב את המבט אל החתך, והחתך נסגר לבד אחרי 15 שניות (או ב'הסתר את החתך' שעל המודל); הצבעים והמקרא — בחירת מודל; עובי הקורות, אמה — בחירת מודל.",
            refs: [["מלכים א ו, ו", V(10, 6, 6)], ["ו, י", V(10, 6, 10)], ["רש״י ו, ו", V(10, 6, 6)], ["רש״י ו, י", V(10, 6, 10)], ["מדות ד, ז", MI(4, 7)]] },
          // 1.0.1-K (K.2): the chambers' only outside door, from the terrace (flyPoints.yatziaDoor; the 1.0.1 target z 26 is inside the new wall)
          { t: "פתח התאים והלולים", view: "yatziaDoor",
            info: "'פתח הצלע התיכנה אל כתף הבית הימנית ובלולים יעלו על התיכנה ומן התיכנה אל השלשים' (מלכים א ו, ח): לפי רש״י והתרגום — 'שבחמש תאים שבדרום היה לה פתח אל החוץ בשורה התחתונה', 'ודרך אותו פתח נכנסים לכלם'; רד״ק ומצודות: הקומה התיכונה. לכל תא שלושה פתחים — 'אחד לתא מן הימין, ואחד לתא מן השמאל, ואחד לתא שעל גביו' (רש״י ממדות ד, ג). לולים — 'בנין עמוד אבנים עשוי מעלות מעלות, וההולך בהן דומה כמקיף סביבות עמוד' (רש״י). מעל הפתח רצועת ראשי קורות הגג, כציור הספר; מידות הפתח (שתיים וחצי על שלוש וחצי) — בחירת מודל.",
            refs: [["מלכים א ו, ח", V(10, 6, 8)], ["רש״י ו, ח", V(10, 6, 8)], ["מדות ד, ג", MI(4, 3)]] }
        ]],
        ["הבית מבפנים", [
          { t: "פתח ההיכל ודלתותיו", view: "heichalDoor",
            // 1.0.1-H review (sources): "שני צלעים" = two boards is MALBIM's (Rashi/Targum: two pivots); "גלילים" per Radak/Metzudot/Ralbag is a
            // painted design on both faces. 1.0.1-K (review Q2-2, checked in the library): "הפותות" (7:50) = the pivots for the Targum (as Radak
            // reads it) and Radak; for Ralbag and Metzudat Zion the socket the pivot enters (Kelim 11:2 "והפותה שתחת הציר"); for Rashi keys
            info: "'וכן עשה לפתח ההיכל מזוזות עצי שמן מאת רבעית' (מלכים א ו, לג) — מזוזות מרובעות (רש״י, תרגום). 'ושתי דלתות עצי ברושים, שני צלעים הדלת האחת גלילים' (ו, לד): כל דלת כחצי רוחב הפתח (רש״י). 'שני צלעים' — לפי התרגום ורש״י שני צירים לכל דלת, 'ציר העליון וציר התחתון', ו'גלילים' — 'סגלגלין', עגולים; לפי מלבי״ם — 'שני לוחות'; לפי רד״ק, מצודות ורלב״ג — שני צדי הדלת מצוירים 'מעשה גלילים' (מצודות: 'אופנים'; רלב״ג: 'גלילים ועמודים') — ציור זה לא נבנה. הדלתות מגולפות כרובים, תמורות ופטורי ציצים ומצופות זהב 'מישר על המחקה' (ו, לה) — הגילוף במודל כטקסטורה על שני פני כל לוח. 'והפתות לדלתות הבית' (ז, נ): לתרגום ולרד״ק — צירי הדלתות; לרלב״ג ולמצודת ציון — מה שהציר נכנס בו ('והפותה שתחת הציר', משנה כלים יא, ב); לרש״י — מפתחות. הגלילים של זהב שבמודל מתאימים לשני הפירושים הראשונים. במודל כל דלת שני לוחות (כמלבי״ם), מקופלים אל דפנות הפתח כדי שהמעבר יהיה פנוי, ומידות הפתח — בחירת מודל.",
            refs: [["מלכים א ו, לג", V(10, 6, 33)], ["ו, לד", V(10, 6, 34)], ["רש״י ו, לד", V(10, 6, 34)], ["ו, לה", V(10, 6, 35)], ["ז, נ", V(10, 7, 50)], ["משנה כלים יא, ב", MN(91, 11, 2)]] },
          { t: "ההיכל", view: "kodesh", key: "kodesh" }, // 1.0.1: "ההיכל" is this room (I Kings 6:17, the user)
          // 1.0.1-K (K.5): the carvings redrawn after the book - the default look of every wall and door
          { t: "גילופי הקירות — כרובים, תמורות, פטורי ציצים, פקעים", view: "carvings",
            info: "'ואת כל קירות הבית מסב קלע פתוחי מקלעות כרובים ותמרת ופטורי צצים מלפנים ולחיצון' (מלכים א ו, כט) — רש״י: 'לבית הכפרת הפנימי ולהיכל החיצון'; 'וארז אל הבית פנימה מקלעת פקעים ופטורי צצים' (ו, יח); 'ויעל עליו תמרים ושרשרת' (דברי הימים ב ג, ה). מקלעת — 'קלוע היה בציורי קליעות' (רש״י ו, יח), ציור 'כעין שרשרת' הממלא את המקום 'בין ציור לציור כדי שלא יהיה חלק בינתים' (רש״י דברי הימים ב ג, ה); פטורי — 'לשון חבלים', ציצים — 'לשון פרחים' (רש״י), 'פתוחים דמות ציצים ופרחים' (רד״ק); פקעים — 'כמין כפתורים' (רש״י; תרגום: 'ביעין'); תמרות — 'צורת תמרים' (רד״ק); השרשרות — 'צורת שלשלאות' (רש״י); והכרובים בפני ילד — 'תבנית ילדים וילדות' (רש״י דברי הימים ב ג, י). הזהב 'שוקע בו במקום החקק, ובולט על הבליטה' (רש״י ו, לב), ורד״ק (ו, כט): 'מפותחים לא שהיו בולטין' — הצורות חלקות ושוות לפני הקיר, והרקע הקלוע וקווי המתאר חקוקים. הסידור, כציור הספר: בכל שורה של עשר אמות — חבל שזור, זוגות כרובים בגלימות ארוכות בלי ידיים תחת קשת כנפיהם ושושנים ביניהם, פקע, שושנים ושלוש שרשרות תלויות, ודקל גבוה בין כל שני זוגות; שלוש שורות בהיכל, שתיים בדביר ושתיים על כל דלת. הספר עצמו מציין שסדר העיטורים להמחשה בלבד — הסידור והגדלים בחירת מודל. זה מראה הקירות כברירת מחדל; השכבות שמתחת לזהב — בכפתור 'הצג את שכבות הקיר והרצפה'.",
            refs: [["מלכים א ו, כט", V(10, 6, 29)], ["ו, יח", V(10, 6, 18)], ["ו, לב", V(10, 6, 32)], ["ו, לה", V(10, 6, 35)], ["דברי הימים ב ג, ה", V(39, 3, 5)], ["חגיגה יג:", P(114, "יג:")]] },
          // 1.0.1-K (K.5.3, the addendum D): the wall and floor layers - an OPTION; the default stays all gold. 1.0.1-L (L.14 / L.31; interior.md):
          // the window near the entrance ("קח את זה קצת יותר לכיוון פתח ההיכל"), sharp carved cedar; the place switches it on for 15 s (L.27)
          { t: "שכבות הקיר והרצפה — אבן, ארז וזהב", view: "wallLayers",
            feature: { key: "wallLayers", isOn: () => !!(ctx.shared.wallLayers && ctx.shared.wallLayers.on),
              on: () => feat.wallLayers(), off: () => { const w = ctx.shared.wallLayers; if (w && typeof w.set === "function") w.set(false); } },
            info: "הבית — 'אבן שלמה מסע נבנה' (מלכים א ו, ז); קירותיו מבפנים 'בצלעות ארזים מקרקע הבית עד קירות הספן' (ו, טו), מגולפים — 'וארז אל הבית פנימה מקלעת פקעים ופטורי צצים הכל ארז אין אבן נראה' (ו, יח) — ומצופים זהב (ו, כא–כב). למה הארז? רש״י (ו, טו): 'קירות ארז אצל קיר האבן, כדי לטוח עליו זהב... ואי אפשר לטוח זהב על גבי האבנים, כי אם בעצים ובמסמרות'. הרצפה: אבן, עליה 'צלעות ברושים' (ו, טו), ועליהן זהב — 'ואת קרקע הבית צפה זהב לפנימה ולחיצון' (ו, ל; רש״י: 'לבית הכפרת ולהיכל'; מצודת דוד: 'על רצפת צלעות הברושים'). זו אפשרות תצוגה בלבד, כציור הספר: חלון מדורג בקיר הצפוני של ההיכל, סמוך לפתח ההיכל, וברצפה שלפניו — הזהב נחתך במדרגות, הארז המגולף מתחתיו (לוחות ארז זקופים, אמה רוחבם, והגילוף חקוק בהם) ואבן הבית מאחוריו. בבית עצמו הכל זהב — 'הכל ארז אין אבן נראה' (ו, יח), 'ואת כל הבית צפה זהב' (ו, כב) — וכך המודל כברירת מחדל. הכפתור פותח את החלון וחוזר לבד אחרי 15 שניות; 'הצג את שכבות הקיר והרצפה' שעל הקיר משאיר אותו פתוח. מקום החלון, מדרגותיו ועובי השכבות — בחירת מודל.",
            refs: [["מלכים א ו, ז", V(10, 6, 7)], ["ו, טו", V(10, 6, 15)], ["ו, יח", V(10, 6, 18)], ["ו, כא", V(10, 6, 21)], ["ו, כב", V(10, 6, 22)], ["ו, ל", V(10, 6, 30)]] },
          { t: "רצפת הבית — ברושים מצופים זהב", tg: [-21, 12.1, 3], cam: [-9, 16.5, 7.5],   // inside the closed kodesh (x -3.5..-43.5, |z| < 10), looking down at the floor
            info: "'ויצף את קרקע הבית בצלעות ברושים' (מלכים א ו, טו); 'ואת קרקע הבית צפה זהב לפנימה ולחיצון' (ו, ל) — רש״י: 'לבית הכפרת ולהיכל'; מצודת דוד: 'על רצפת צלעות הברושים'. במודל רצפת ההיכל והדביר זהב על לוחות ברוש, אמה רוחב כל לוח לאורך הבית, והחריצים ביניהם נראים קלות — בחירת מודל. מלבי״ם (דברי הימים ב ג, ה) כותב שרצפת הדביר הייתה זהב בלי ברושים, ורלב״ג מפרש את 'צלעות' הרצפה כקורות — לא נבנו. השכבות עצמן (אבן, ברוש וזהב) — בכפתור 'הצג את שכבות הקיר והרצפה' שבהיכל.",
            refs: [["מלכים א ו, טו", V(10, 6, 15)], ["ו, ל", V(10, 6, 30)], ["דברי הימים ב ג, ה", V(39, 3, 5)]] },
          // 1.0.1-H: one place for the vessels' arrangement; the two layouts and the lighting opinions are chosen in the opinions table
          { t: "סידור הכלים — עשר המנורות ועשרה השולחנות (מנחות צח:–צט.)", tg: [-34, 16, 0], cam: [-14, 36, 4],
            info: "מנחות צח: — רבי: השולחנות והמנורות מזרח ומערב (אורכם לאורך הבית); רבי אלעזר ברבי שמעון: צפון ודרום. כולם בחצי הפנימי של ההיכל, השולחנות בצפון והמנורות בדרום — 'של משה באמצע, חמשה מימינו, וחמשה משמאלו' (צח:); לרבי שולחן משה ומנורתו בראש השורות, 'כתלמיד היושב לפני רבו' (צט.). המנורות משוכות מערבה מן השולחנות — רלב״ג (מלכים א ז, מט): 'ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות', וכציור הספר; השיעור, אמה אחת — בחירת מודל. ומנחות צט.: לתנא קמא הדליקו וסידרו לחם רק בשל משה, ולרבי אלעזר בן שמוע — בכולן. את הקריאה בוחרים בטבלת 'שיטות ומחלוקות'.",
            refs: [["רלב״ג ז, מט", { book: 3645, index: 312 }], ["מנחות צח:", P(131, "צח:")], ["מנחות צט.", P(131, "צט.")], ["רמב״ם בית הבחירה ג, יב", RB(3, 12)], ["מלכים א ז, מט", V(10, 7, 49)]] },
          // 1.0.1-L (L.70, L.71, L.73; interior.md): Moses' menorah between 5 and 5, every cup / knob / flower of the Mishkan's menorah
          // (22 / 11 / 9), the stone of three steps before each menorah, the menorot one amah west of the tables
          { t: "מנורת משה ועשר המנורות", view: "menorot",
            info: "'ואת המנרות חמש מימין וחמש משמאול לפני הדביר זהב סגור' (מלכים א ז, מט; דברי הימים ב ד, ז). לפי מנחות צח: ורש״י: 'של משה באמצע, חמשה מימינה, וחמשה משמאלה', וכולן בדרום ההיכל, בחצי הפנימי; לרבי — מנורת משה בראש שתי השורות של חמש, ראשה מול האוויר שביניהן ('כתלמיד היושב לפני רבו', מנחות צט.), לר׳ אלעזר בר׳ שמעון — שתי אמות ומחצה מכותל צפון (תוספות מנחות צח:), וארכו לאורך הבית (מאירי יומא נא:). גובה המנורה שלוש אמות — 'גובהה של מנורה שמנה עשר טפחים' (מנחות כח:) — וכל אחת עם כל גביעיה, כפתוריה ופרחיה כמנורת המשכן (שמות כה, לא–לו): 'הרגלים והפרח שלשה טפחים, וטפחיים חלק, וטפח שבו גביע וכפתור ופרח, וטפחיים חלק, וטפח כפתור. ושני קנים יוצאין ממנו, אחד אילך ואחד אילך, ונמשכין ועולין כנגד גובהה של מנורה' — וכן השניים הבאים — 'נשתיירו שם שלשה טפחים שבהן שלשה גביעין וכפתור ופרח'; 'ונמצאו גביעין עשרים ושנים, כפתורים אחד עשר, פרחים תשעה' (מנחות כח:). הפרח שבקנה האמצעי למטה — רש״י (שמות כה, לה): 'הרגלים והפרח שלשה טפחים – הוא הפרח האמור בירך, שנאמר עד ירכה עד פרחה'; והפרח שבכל קנה — 'כפתר ופרח. היה לכל קנה וקנה' (רש״י כה, לג); הקנים נמשכים ועולים ישר, כציור הספר. לפני כל מנורה אבן של שלוש מעלות: 'ואבן היתה לפני המנורה ובה שלש מעלות, שעליה הכהן עומד ומטיב את הנרות' (משנה תמיד ג, ט; רמב״ם בית הבחירה ג, יא) — מלשון 'העלאה' שבתורה: רש״י (במדבר ח, ב): 'ועוד דרשו רבותינו מכאן שמעלה היתה לפני המנורה, שעליה הכהן עומד ומטיב (ספרי)'; ברטנורא: 'ובה שלש מעלות. כנגד שלש העלאות שכתובות במנורה, בהעלתך את הנרות, והעלה את נרתיה, להעלת נר תמיד' — השלישית בתצוה (שמות כז, כ). המנורות משוכות מערבה מן השולחנות — רלב״ג (מלכים א ז, מט): 'הנה מפני שהשולחנות הם גם כן לפני הדביר ולא זכר זה אלא במנורות ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות', וכציור הספר; השיעור, אמה אחת — בחירת מודל. צד האבן — מעשי למלך (על הרמב״ם ג, יא), לנרות מזרח ומערב: 'א\"כ אבן זה לצד צפון הי' עומד דמנורה בדרום ושולחן בצפון ע\"כ אבן זה הי' עומד בצפון המנורה'; ובשם היעב\"ץ שם, לנרות צפון ודרום: 'א\"כ אבן זו לצד מערב המנורה עומדת'. כך במודל: לרבי צפונית למנורה (וכציור הספר), לר׳ אלעזר בר׳ שמעון מערבית לה. מידות האבן וצורת העיטורים — בחירת מודל.",
            refs: [["מעשי למלך ג, יא", { book: 4304, index: 89 }], ["רלב״ג ז, מט", { book: 3645, index: 312 }], ["מלכים א ז, מט", V(10, 7, 49)], ["דברי הימים ב ד, ז", V(39, 4, 7)], ["מנחות צח:", P(131, "צח:")], ["מנחות צט.", P(131, "צט.")], ["מנחות כח:", P(131, "כח:")], ["שמות כה, לא", V(2, 25, 31)], ["רש״י שמות כה, לה", V(2, 25, 35)], ["משנה תמיד ג, ט", MN(88, 3, 9)], ["רמב״ם בית הבחירה ג, יא", RB(3, 11)], ["ג, י", RB(3, 10)], ["רש״י במדבר ח, ב", { book: 3693, index: 382 }], ["שמות כז, כ", V(2, 27, 20)], ["יומא לג:", P(107, "לג:")]] },
          // 1.0.1-K (K.4; the user: "שלחנות, חייבים תיקון משמעותי"): the tables rebuilt - the row (flyPoints.shulchanot) and Moses' table close.
          // 1.0.1-L (L.46, the user: "למיטב ידיעתי הם היו כשלחן משה"; L.70): all ten in the FORM of Moses' table; Moses' table at the rows' head
          // for Rabbi per Menachot 99a (the user: "כגמרא, בראש השורות"), in the middle of the columns for R. Elazar b. R. Shimon
          { t: "שולחן משה ועשרה השולחנות", view: "shulchanot",
            info: "'ויעש שלחנות עשרה וינח בהיכל חמשה מימין וחמשה משמאול' (דברי הימים ב ד, ח; מלכים א ז, מח). לפי מנחות צח: — 'של משה באמצע, חמשה מימינו, וחמשה משמאלו' (רש״י: 'חמשה מימינו - בדרומו וחמשה משמאלו בצפונו וכולן בצפון ההיכל'); לרבי (מזרח ומערב) הגמרא (צט.) עצמה דוחה אמצע ממש — אין מקום לשתי שורות ושולחן ביניהן ברוחב עשר אמות — ומשיבה: 'מי סברת שלחן דמשה בהדייהו הוה יתיב? לא, דמידלי ליה, ומנח ליה, ומיתתי להו לדידהו פורתא, כתלמיד היושב לפני רבו' (רש״י: 'משוך לצד מערב וראשו מכוון כנגד אויר שבין שתי השורות'); כך במודל, כגמרא: שולחן משה בראש שתי השורות של חמש, ראשו מול האוויר שביניהן. לר׳ אלעזר בר׳ שמעון (צפון ודרום) — 'בשלמא למאן דאמר צפון ודרום, שפיר': שולחן משה בין שני הטורים ובאמצע אורכם. כל אחד מעשרת השולחנות בתבנית שולחן משה — הסניפין, הקנים והבזיכין על כולם (כציור הספר) — 'אמתים ארכו ואמה רחבו ואמה וחצי קמתו' (שמות כה, כג), ומסגרת טפח עם זר זהב (כה, כד–כה); מידות שולחנות שלמה אינן בפסוקים — בחירת מודל. הלחם — שתי מערכות של שש חלות (ויקרא כד, ו) — על שולחן משה תמיד, ועל עשרת השולחנות רק לרבי אלעזר בן שמוע (מנחות צט.: 'על כולם היו מסדרין'); לתנא קמא הם עומדים בלא לחם (טבלת 'שיטות ומחלוקות'). ראו 'שולחן משה מקרוב'.",
            refs: [["דברי הימים ב ד, ח", V(39, 4, 8)], ["מלכים א ז, מח", V(10, 7, 48)], ["שמות כה, כג", V(2, 25, 23)], ["מנחות צח:", P(131, "צח:")], ["מנחות צט.", P(131, "צט.")], ["ויקרא כד, ו", V(3, 24, 6)]] },
          { t: "שולחן משה מקרוב — הלחם, הסניפין והקנים", view: "shulchanMoshe",
            info: "השולחן — 'אמתים ארכו ואמה רחבו ואמה וחצי קמתו' (שמות כה, כג; רש״י: 'גבה רגליו עם עבי השלחן'), ו'מסגרת טפח סביב' עם 'זר זהב' (כה, כד–כה); רש״י מביא שתי דעות במסגרת, והספר מצייר אותה מתחת לדף — 'ודף השלחן שוכב על אותה מסגרת'. הלחם — 'שתים מערכות שש המערכת' (ויקרא כד, ו); 'לחם הפנים, ארכן עשרה ורחבן חמשה, וקרנותיו שבע אצבעות' (משנה מנחות יא, ד), 'כמין תיבה פרוצה' (מנחות צד:); רבי מאיר (משנה יא, ה): 'השלחן ארכו שנים עשר ורחבו ששה... נותן ארכו כנגד רחבו של שלחן, וכופל טפחים מכאן וטפחים מכאן וטפחים רוח באמצע'; ושם אבא שאול: 'שם היו נותנין שני בזיכי לבונה של לחם הפנים'. 'ארבעה סניפין של זהב היו שם, מפצלין מראשיהן... שנים לסדר זה ושנים לסדר זה. ועשרים ושמנה קנים, כחצי קנה חלול' (משנה יא, ו): הסניפין 'עומדין בארץ וגבוהים עד למעלה מן השלחן הרבה, כנגד גבה מערכת הלחם, ומפצלים חמשה פצולים' (רש״י שמות כה, כט), והקנים שלושה תחת כל חלה ושניים תחת העליונה — 'התחתונה אינה צריכה כל עיקר' (מנחות צז.). צורת הסניפין, הבזיכין והקנים — כציור הספר, בחירת מודל; כל אחד מעשרת השולחנות בתבנית זו (הלחם — לפי השורה 'הדלקת המנורות וסידור הלחם'). המבט לאורך השולחן מקצהו.",
            refs: [["שמות כה, כג", V(2, 25, 23)], ["כה, כה", V(2, 25, 25)], ["כה, כט", V(2, 25, 29)], ["ויקרא כד, ו", V(3, 24, 6)], ["משנה מנחות יא, ד", MN(81, 11, 4)], ["יא, ה", MN(81, 11, 5)], ["יא, ו", MN(81, 11, 6)], ["מנחות צד:", P(131, "צד:")], ["מנחות צז.", P(131, "צז.")]] },
          // 1.0.1-K (K.4 / K.5): the golden altar (flyPoints.incenseAltar follows the kodesh layout), its smoke and its layers. 1.0.1-L (L.13 the
          // height ONE amah, the horns within it; L.52 / L.69 the place: the sources in interior.md ANSWERS, the user's decision "יותר קרוב
          // לאולם מיד אחרי השולחנות והמנורות")
          { t: "מזבח הזהב", view: "incenseAltar",
            info: "'ויצף מזבח ארז' (מלכים א ו, כ) — רש״י: 'הוא מזבח הקטרת'; 'וכל המזבח אשר לדביר צפה זהב' (ו, כב); 'את מזבח הזהב' (ז, מח). מצודת דוד (ו, כ): 'ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב'; רלב״ג (ו, כב): 'צפה מזבח הקטרת באבנים וצפהו עצי ארז כמו שעשה בקירות הבית... ואחר כן צפה אותם זהב'; רד״ק: 'ואפשר שהיה מאבנים'. מידתו — 'אמה על אמה' (רמב״ם בית הבחירה ג, יז), וגובהו אמה: 'ממנו קרנתיו' (שמות ל, ב) — הקרנות בתוך האמה, וזר הזהב סביב גגו (ל, ג; רש״י: 'סימן הוא לכתר כהנה') — בחירת מודל. מקומו: במשכן נמסר מרחק — רש״י (שמות כו, לה): 'המזבח והשלחן והמנורה משוכים מן הפתח לצד מערב עשר אמות'; ברייתא דמלאכת המשכן: 'מן הקרשים שבמערב עד הפרוכת עשר אמות, מן הפרוכת עד השלחן חמש אמות, מן השלחן עד מזבח הזהב חמש אמות, ממזבח הזהב עד העמודים שבמזרח עשר אמות'. בבית לא נמסרה מידה במספרים: בין השולחן למנורה, מחצי הבית ולפנים ומשוך קמעא כלפי חוץ: 'וכי עייל להיכל — במזבח פגע ברישא... מזבח ממוצע ועומד באמצע ומשוך כלפי חוץ קימעא' (יומא לג:; רש״י: 'כלפי חוץ - כלפי מזרח לצד פתח ההיכל'); 'והוא נתון בהיכל מכון בין הצפון לדרום משוך בין השלחן והמנורה לחוץ. ושלשתן היו מנחין משליש ההיכל ולפנים כנגד הפרכת' (רמב״ם ג, יז); ולמה 'המזבח אשר לדביר'? רד״ק (ו, כב): 'סמך המזבח לדביר ואף על פי שלא היה בתוכו אלא בהיכל... ומזבח הקטרת ממוצע ביניהם ומשוך קמעא כלפי חוץ וזה מכוון כנגד פתח הדביר'. במודל: על ציר הבית, מיד מזרחית לשורות השולחנות והמנורות (לרבי אמה מקצה השורות, לר׳ אלעזר בר׳ שמעון שלושת רבעי אמה — בחירת מודל). עליו גחלים, ועשן הקטורת עולה ישר עד התקרה — 'מתמר ועולה כמקל' (יומא לח.), 'עד שמגיע לשמי קורה' (יומא נג.), 'כתימרות עשן' (שיר השירים ג, ו; רש״י: 'על שם ענן הקטרת שהיה מתמר מעל מזבח הפנימי'); מוצג תמיד, כי הקטירו בכל בוקר ובין הערביים (שמות ל, ז–ח); עוביו — בחירת מודל. 'הצג את שכבות המזבח' שלפניו מראה את האבן, הארז והזהב.",
            refs: [["רש״י שמות כו, לה", { book: 3692, index: 1890 }], ["ברייתא דמלאכת המשכן א, יט", { book: 240, index: 2844 }], ["מלכים א ו, כ", V(10, 6, 20)], ["ו, כב", V(10, 6, 22)], ["רד״ק ו, כב", V(10, 6, 22)], ["ז, מח", V(10, 7, 48)], ["רמב״ם בית הבחירה ג, יז", RB(3, 17)], ["שמות ל, ב", V(2, 30, 2)], ["ל, ג", V(2, 30, 3)], ["ל, ז", V(2, 30, 7)], ["יומא לג:", P(107, "לג:")], ["מנחות צח:", P(131, "צח:")], ["יומא לח.", P(107, "לח.")], ["יומא נג.", P(107, "נג.")], ["שיר השירים ג, ו", V(31, 3, 6)]] },
          { t: "שכבות מזבח הזהב — אבן, ארז וזהב", view: "incenseAltar",
            feature: { key: "incenseAltar.layers", isOn: () => !!(ctx.shared.incenseAltar && ctx.shared.incenseAltar.layers && ctx.shared.incenseAltar.layers.on),
              on: () => feat.altarLayers(), off: () => { const a = ctx.shared.incenseAltar; if (a && a.layers && typeof a.layers.set === "function") a.layers.set(false); } },
            info: "מזבח הזהב בשכבותיו, כקירות הבית: מצודת דוד (ו, כ): 'ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב, והיה אם כן מעשה המזבח דומה למעשה קירות הבית'; רלב״ג (ו, כב): 'צפה מזבח הקטרת באבנים וצפהו עצי ארז כמו שעשה בקירות הבית'; רד״ק (ו, כ): 'ואפשר שהיה מאבנים', והתרגום: 'נסרין דארזא'; והזהב — 'וכל המזבח אשר לדביר צפה זהב' (ו, כב), 'בכל ששת השטחים' (מצודת דוד). זו אפשרות תצוגה בלבד: הזהב של מחצית הצד הדרומי העליונה מוסר, ונראים לוחות הארז ודרכם לב האבן; צורת החתך — בחירת מודל. הכפתור פותח את השכבות וחוזר לבד אחרי 15 שניות; 'הצג את שכבות המזבח' שעל המודל משאיר אותן פתוחות.",
            refs: [["מלכים א ו, כ", V(10, 6, 20)], ["ו, כב", V(10, 6, 22)]] },
          { t: "רתוקות הזהב", tg: [-43, 24, 0], cam: [-30, 26, 8], // target just before the traksin's kodesh face (x -43.5), outside the inKK box
            info: "'ויעבר ברתיקות זהב לפני הדביר' (מלכים א ו, כא): לפי רש״י, רד״ק ומצודת דוד — בריחים של שלשלאות זהב על פני כותל אמה טרקסין (וכן 'שרשרות בדביר', דברי הימים ב ג, טז). מלבי״ם: הרתוקות קבועות באבנים מתחת לציפוי. מספרן וגובהן — בחירת מודל.",
            refs: [["מלכים א ו, כא", V(10, 6, 21)], ["דברי הימים ב ג, טז", V(39, 3, 16)]] },
          { t: "אמה טרקסין", view: "traksinTop", // 1.0.1-H: the wall above the doorway, from the heichal (the user: "חסר אמה טרקסין מעל פתח הדביר")
            // 1.0.1-H review (sources): "אגב תקרה ומעזיבה" is on Bava Batra 3b, the height and "שית פושכי" on 3a (checked in the library);
            // 1.0.1-K (review Q2-1): Yoma 52a quoted with R. Natan and the Gemara's conclusion, not Rabina's rejected premise
            info: "המחיצה בין ההיכל לדביר: 'ויבן את עשרים אמה מירכתי הבית בצלעות ארזים' (מלכים א ו, טז). אמה טרקסין — יומא נא:–נב.: 'אמה טרקסין, לא הכריעו בו חכמים אי כלפנים אי כלחוץ' (רבי נתן) — והספק בקדושתה, שלמסקנת הגמרא 'לא מהני עשרין ולא מהני ארבעין' (נב.); בבבא בתרא ג.: 'אמה טרקסין דהואי גבוה תלתין אמהתא ולא הוה פותיא אלא שית פושכי' — עובייה אמה וגובהה שלושים (וכן רש״י), ובג:: 'אגב תקרה ומעזיבה הוה קאי'. כולה מצופה זהב (רד״ק ו, כא) ומגולפת כשאר הקירות (ו, כט). במודל היא שלושה חלקים מלאים — שני העמודים שמצדי הפתח והחלק שמעל הפתח עד התקרה (מגובה 12 עד 30 מרצפת הבית) — והדוגמה נמשכת ביניהם. האמה נלקחה מן הדביר — בחירת מודל." + " " + UI_BARAITA.c,
            refs: [["מלכים א ו, טז", V(10, 6, 16)], ["ו, כא", V(10, 6, 21)], ["יומא נא:", P(107, "נא:")], ["יומא נב.", P(107, "נב.")], ["בבא בתרא ג.", P(124, "ג.")], ["בבא בתרא ג:", P(124, "ג:")]] },
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
            info: "'ויעש את הפרכת תכלת וארגמן וכרמיל ובוץ ויעל עליו כרובים' (דברי הימים ב ג, יד). רש״י ורד״ק: אף שהיו דלתות לפתח הדביר נתלתה פרוכת; לפי רד״ק הדלתות עמדו פתוחות מפני בדי הארון; ראשי הבדים דוחקים בפרוכת ובולטים ממנה: 'ויארכו הבדים ויראו ראשי הבדים מן הקדש על פני הדביר ולא יראו החוצה' (מלכים א ח, ח) — 'דוחקין ובולטין ויוצאין בפרוכת, ונראין כשני דדי אשה' (יומא נד.; מנחות צח:). שני פניה אינם דומים: רש״י (שמות כו, א): 'פרצוף אחד מכאן ופרצוף אחד מכאן — ארי מצד זה ונשר מצד זה'; רש״י (שמות כו, לא): 'והציורין שמשני עבריה אינן דומין זה לזה'; יומא עב:: 'חושב — מעשה אורג, לפיכך שני פרצופות'. במודל — שורות נשרים פרושי כנפיים בצד ההיכל, ראשם לימין הצופה, ושורות אריות מהלכים מימין לשמאל בצד הדביר, על אריג של תכלת, ארגמן, תולעת ושש כציור הספר; איזה צד לאיזו דמות וכיוונן — בחירת מודל. מצודת דוד (דברי הימים ב ג, יד): 'צייר עליו כרובים במעשה רוקם'.",
            refs: [["דברי הימים ב ג, יד", V(39, 3, 14)], ["שמות כו, א", V(2, 26, 1)], ["שמות כו, לא", V(2, 26, 31)], ["יומא עב:", P(107, "עב:")], ["מלכים א ח, ח", V(10, 8, 8)], ["יומא נד.", P(107, "נד.")], ["מנחות צח:", P(131, "צח:")]] },
          { t: "הפרוכת מצד הדביר — האריות", view: "parochetDevir",
            info: "פניה המערביים של הפרוכת, מתוך הדביר: אריות מהלכים מימין לשמאל — 'ארי מצד זה ונשר מצד זה' (רש״י שמות כו, א); 'והציורין שמשני עבריה אינן דומין זה לזה' (רש״י שמות כו, לא). שני הבדים לוחצים על הפרוכת ונראים מן ההיכל (מלכים א ח, ח). קודש הקדשים מכוסה בענן; המבט מבקש להסיר אותו.",
            refs: [["שמות כו, א", V(2, 26, 1)], ["שמות כו, לא", V(2, 26, 31)], ["מלכים א ח, ח", V(10, 8, 8)]] },
          // 1.0.1-K (K.4 / K.5, the addendum B): the cherubim after the book - robes to the floor, no arms, bird wings across the devir
          // (review Q2-3: Abaye's challenge on BB 99a is the model's reading; Q2-4: the baraita reads "ומצודדים פניהם")
          // 1.0.1-L (L.30, the user: "כנפי הכרובים, מאוזן (תצוגה שוכבת) ולא מאונך"; L.35 "פרצופי הכרובים נוראים" - interior.md): the wings in a
          // horizontal plane under the heads, the kaporet's cherubim with their wings raised, the new faces
          { t: "קודש הקדשים — הדביר", view: "kodeshHakodashim", key: "kodeshHakodashim" },   // 1.1.0: was the grid's view
          { t: "הכרובים", view: "cherubim",
            info: "'ויעש בדביר שני כרובים עצי שמן עשר אמות קומתו' (מלכים א ו, כג–כח): כנף חמש אמות, 'עשר אמות מקצות כנפיו ועד קצות כנפיו', 'ותגע כנף האחד בקיר וכנף הכרוב השני נגעת בקיר השני וכנפיהם אל תוך הבית נגעת כנף אל כנף' (ו, כז), ומצופים זהב (ו, כח). 'מעשה צעצעים' (דברי הימים ב ג, י) — רש״י: 'תבנית ילדים וילדות עשה לכרובים, כרביא'; 'והם עמדים על רגליהם ופניהם לבית' (ג, יג). הכנפיים פרושות במישור אחד מאוזן, שוכבות, סוכה על הארון — 'כי הכרובים פרשים כנפים אל מקום הארון ויסכו הכרבים על הארון ועל בדיו מלמעלה' (ח, ז); רש״י (דברי הימים ב ג, יג): 'והיו כנפי הכרובים מטין מן הכותל וסוככין על הכפרת ועל הארון בכנפיהם' — ובמודל מתחת לראשים (בחירת מודל), קצותיהן נוגעות בקירות וזו בזו. ואילו כרובי הכפורת שעל הארון — כנפיהם עולות מן הכתפיים מעל ראשיהם ונמשכות בקשת עד אמצע הכפורת, וקצותיהן נוגעים זה בזה (הנגיעה — כציור הספר): 'והיו הכרבים פרשי כנפים למעלה סככים בכנפיהם על הכפרת' (שמות כה, כ), רש״י: 'שלא תעשה כנפיהם שוכבים אלא פרושים וגבוהים למעלה אצל ראשיהם, שיהא עשרה טפחים בחלל שבין הכנפים לכפרת' (סוכה ה:). הפנים — פני ילד: 'דמות פרצוף תינוק להם' (רש״י שמות כה, יח), 'מאי כרוב? אמר רבי אבהו: כרביא, שכן בבבל קורין לינוקא רביא' (חגיגה יג:) — ראש סגלגל עם סנטר ולחיים, אף ישר, עיניים שקדיות בעפעפיים, פה קטן סגור וקו שיער, כולו זהב, כציור הספר. במודל, כציור הספר: דמות גבוהה וחלקה של זהב, לבושה עד הקרקע, בלי ידיים (אין להן זכר בפסוקים). חז״ל: 'כרובים — בנס הן עומדין' (בבא בתרא צט.; רש״י ו, כד: 'וגוף הכרובים אינו מן המדה ועומד בנס'); ושם מקשה אביי: 'ודלמא בולטין כתרנגולין הוו קיימי' — גופם תחת כנפיהם (רשב״ם), וכך רד״ק (ו, כז): 'גופות הכרובים תחת הכנפים הם ואין צריך להיותם עומדת בנס' — וכך נבנה המודל. פניהם — שלוש דעות בטבלת 'שיטות ומחלוקות': רש״י (ג, יג) — ראשם כפוף ופונה זה אל זה; רד״ק ומצודות — לבית, מזרחה; בבא בתרא צט. — 'ומצודדים פניהם כתלמיד הנפטר מרבו'.",
            refs: [["מלכים א ו, כג", V(10, 6, 23)], ["ו, כד", V(10, 6, 24)], ["ו, כז", V(10, 6, 27)], ["ו, כח", V(10, 6, 28)], ["ח, ז", V(10, 8, 7)], ["דברי הימים ב ג, י", V(39, 3, 10)], ["ג, יג", V(39, 3, 13)], ["שמות כה, יח", V(2, 25, 18)], ["שמות כה, כ", V(2, 25, 20)], ["סוכה ה:", P(108, "ה:")], ["בבא בתרא צט.", P(124, "צט.")], ["מגילה י:", P(112, "י:")], ["חגיגה יג:", P(114, "יג:")]] },
          { t: "הארון ובדיו", tg: () => [arkX() + 2, 14, 0], cam: () => [arkX() + 9.5, 18, 4], // the ark at x -58.5, the staffs east of it
            info: "'ויבאו הכהנים את ארון ברית ה׳ אל מקומו אל דביר הבית אל קדש הקדשים אל תחת כנפי הכרובים' (מלכים א ח, ו). הבדים ארוכים וראשיהם נראים מן הקודש — 'ויארכו הבדים ויראו ראשי הבדים מן הקדש על פני הדביר ולא יראו החוצה' (ח, ח): דוחקים בפרוכת ובולטים ממנה, 'ונראין כשני דדי אשה' (יומא נד.). לפי רש״י (ו, כג) הארון מונח ארכו לרוחב הבית ובדיו מזרח ומערב (יומא נד.). האבן במערב קודש הקדשים ועליה הארון (רמב״ם בית הבחירה ד, א); חמש אמות מקיר המערב — בחירת מודל. " + UI_BARAITA.a,
            refs: [["מלכים א ח, ו", V(10, 8, 6)], ["ח, ח", V(10, 8, 8)], ["רש״י ו, כג", V(10, 6, 23)], ["יומא נד.", P(107, "נד.")], ["רמב״ם בית הבחירה ד, א", RB(4, 1)]] },
          // 1.0.1-L (L.56, the user: "אבן השתיה היתה בבית ראשון?" - interior.md ANSWERS): yes - the ark stood on it; it is bared only when the ark is gone
          { t: "אבן השתייה", tg: () => [arkX(), 12.4, 0], cam: () => [arkX() + 5.5, 14.6, 2.6], // under the ark, x -58.5; 1.2.0: the ark lifted for 15 s (feature arkLift)
            feature: { key: "arkLift", isOn: () => !!(ctx.shared.arkLift && ctx.shared.arkLift.get()),
              on: () => { if (ctx.shared.arkLift) ctx.shared.arkLift.set(true); },
              off: () => { if (ctx.shared.arkLift) ctx.shared.arkLift.set(false); } },
            info: "הייתה בבית ראשון, והארון מונח עליה. המשנה (יומא ה, ב): 'משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת, גבוהה מן הארץ שלש אצבעות, ועליה היה נותן' — 'מימות נביאים ראשונים': רש״י (יומא נג:) 'דוד ושמואל'; רמב״ם (בית הבחירה ד, א): 'אבן היתה בקדש הקדשים במערבו שעליה היה הארון מנח. ולפניו צנצנת המן ומטה אהרן'; תוספתא יומא (ב, יד): 'אבן היתה שם מימות נביאים הראשנים ושתיה נקרית, גבוהה מן הארץ שלש אצבעות, שמתחלה היה עליה ארון נתון. משניטל הארון, עליה היו מקטירין קטרת שלפני לפנים'; יומא נד:: 'ושתיה היתה נקראת. תנא: שממנה הושתת העולם'. במודל: האבן, שלוש אצבעות גובהה, במערב קודש הקדשים, והארון עליה; המבט מרים את הארון לרגע כדי להראות אותה. אינה נזכרת במלכים. היכן נגנז הארון — " + UI_BARAITA.b,
            refs: [["משנה יומא ה, ב", MN(55, 5, 2)], ["יומא נג:", P(107, "נג:")], ["יומא נד.", P(107, "נד.")], ["רמב״ם בית הבחירה ד, א", RB(4, 1)]] }
        ]],
        ["בית שלמה", [
          // 1.0.1-K (K.6): the forest house per the book (Rashi, the default) and the second reading; review Q2-5: Ralbag credited only with
          // what is his (the rows across, 15 to a row, the 45 = the beams on the pillars). 1.0.1-K review: Rashi 7:4 quoted as the library
          // prints it, "שלשה מרישין זה אצל (צריך לומר: לסוף) זה" (it read "זה לסוף זה")
          // 1.0.1-L (L.20; palace.md): THREE readings - Rashi (the book), Malbim and Ralbag, Metzudat David; Rashi 7:2-7:6 quoted in the
          // library's spelling (לארך, כלן, מחפין, קרוי, הספון, לרחב - the K texts had the plene forms)
          { t: "בית יער הלבנון", tg: [103, 5, 520], cam: [225, 70, 650], layer: "palace",
            info: "'ויבן את בית יער הלבנון מאה אמה ארכו וחמשים אמה רחבו ושלשים אמה קומתו על ארבעה טורי עמודי ארזים וכרתות ארזים על העמודים' (מלכים א ז, ב–ה). שלוש קריאות במודל (טבלת 'שיטות ומחלוקות'). לרש״י, כפי שמצייר הספר (ברירת המחדל): 'לארך הבית היה טור עמודים בקרקע, והכרותות מעמוד לעמוד' (ז, ב); עליהן רצפת הקומה העליונה, שכתליה ארוגים מעמודים — 'כלן פתחים וחלונות' (ז, ג), 'ומחפין היו הפתחים בנסרים דקין' (ז, ה); מעליהם ארבעים וחמישה נסרי הספון, חמישה עשר לכל חלל (ז, ג); ובסוף הבית קרוי שני של נסרים קטנים על מרישין קטנים, 'שלשה מרישין זה אצל (צריך לומר: לסוף) זה' (ז, ד). למלבי״ם ולרלב״ג — הטורים לרוחב הבית: 'העמודים היו נתונים לרוחב הבית וחולקים את אורך הבית לג' חלקים' (מלבי״ם ז, ב), 'חמשה עשר עמודים היו בטור האחד' (רלב״ג ז, ג), כתלים לאורכו ובהם חלונות 'מכוונים נגד חלונות של צד הארך השני' (מלבי״ם ז, ד), והארבעים וחמישה הם לרלב״ג הכרותות שעל העמודים. למצודת דוד — אף הוא טורים לרוחב, 'אבל לאורך הבית היה כתלים ממש, כדרך הבנין' (ז, ב), ועל הכרותות 'השכיבו צלעות ונסרים... ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה' (ז, ג) — 45 לוחות, 'ל״ג אמות ושליש אמה' על 'ג׳ אמות ושליש אמה'; שלוש שורות חלונות 'מכוונות זו מול זו' (ז, ד), ושלושה פתחים מרובעים בכל כותל ארוך 'וכל השלשה היו זה מול זה' (ז, ה). בתוכו מאתיים צינה ושלוש מאות מגן זהב (י, טז–יז) וכלי זהב סגור (י, כא). מספרי המודל — בלוח 'השלמות'.",
            refs: [["מלכים א ז, ב", V(10, 7, 2)], ["ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["ז, ה", V(10, 7, 5)], ["ז, ו", V(10, 7, 6)], ["רש״י ז, ג", V(10, 7, 3)], ["מצודת דוד ז, ב", V(10, 7, 2)], ["מלבי״ם ז, ב", V(10, 7, 2)], ["רלב״ג ז, ג", V(10, 7, 3)], ["י, טז", V(10, 10, 16)]] },
          { t: "פנים בית יער הלבנון — המגינים, הצינות והכלים", view: "forestInside", layer: "palace",   // follows the reading (60-palace.js forestHouse.set)
            info: (PN.shields || "מאתיים צינה ושלוש מאות מגן של זהב שחוט, 'ויתנם המלך בית יער הלבנון' (מלכים א י, טז–יז), וכלי זהב סגור (י, כא).") + " המבט מתוך הבית: בקריאת רש״י — לאורך האולם האמצעי של הקומה העליונה, כציור הספר (שם המגינים בקומה העליונה); בקריאות מלבי״ם ורלב״ג ומצודת דוד — לרוחב החלל האמצעי, בין טורי העמודים. 'וכל כלי בית יער הלבנון זהב סגור' (י, כא).",
            refs: [["מלכים א י, טז", V(10, 10, 16)], ["י, יז", V(10, 10, 17)], ["י, כא", V(10, 10, 21)]] },
          // 1.0.1-K review (palace-courts-5): "הסר את הנסרים" removes only the 45 boards and the thin boards (60-palace.js); in Rashi's
          // reading that shows the עבים (7:6), the small beams with their ledges (7:4) and the upper storey - his כרותות (7:2) lie under the
          // upper floor; in the second reading it removes the boards and the stone roof and shows the כרותות on the pillars (Ralbag 7:3).
          // The 1.0.1-K text "הכרותות = מרישים (רד״ק; רש״י ז, ו)" mixed Radak's כרותות with Rashi's עבים; 7:4 quoted as printed in the DB
          { t: "קירוי בית יער הלבנון — הכרותות, 45 הנסרים והנסרים הדקים", view: "forestRoof", layer: "palace",
            info: "'וספן בארז ממעל על הצלעות אשר על העמודים ארבעים וחמשה חמשה עשר הטור' (מלכים א ז, ג), 'ושקפים שלשה טורים ומחזה אל מחזה שלש פעמים' (ז, ד). רש״י: 'ארבעים וחמשה נסרים היו הספון, שלשה טורי נסרים... חמשה עשר נסרים הטור... ארכן לרחב שבין טור לטור, ורחבן לארך הבית', ועוד: 'כי רחב של חמשה עשר נסרים, לא קרה את הבית בכל ארכו... ועשה אצלו לקרות הבית קרוי של נסרים קטנים, נתונים על מרישין קטנים... שלשה מרישין זה אצל (צריך לומר: לסוף) זה, ושקופין משני צדיהן, כעין משקוף שהדלת שוקף בו'. במודל, כציור הספר: כרותה אחת מעמוד לעמוד, זו בסוף זו; הנסרים הגדולים חמש אמות רוחב כל אחד (שבעים וחמש מתוך המאה); ובשאר הבית שתים עשרה שורות של מרישים קטנים, מריש אחד לכל חלל, 'קצה מול קצה'. לרש״י הכרותות הן הקורות שעל העמודים התחתונים — 'והכרותות מעמוד לעמוד' (ז, ב) — ועליהן, כציור הספר, רצפת הקומה העליונה; והעב — באולם העמודים בלבד, ואינו נראה (ז, ו); לרד״ק הכרותות עצמן 'הנקראים מרישי׳ בדברי רז״ל' (ז, ב). הכפתור 'הסר את הנסרים' שעל הגג מסיר את 45 הנסרים ואת הנסרים הדקים, ונראים מתחתם המרישין הקטנים ושקופיהם והקומה העליונה; הכרותות נשארות מתחת לרצפתה. בקריאת מלבי״ם ורלב״ג (טבלת 'שיטות ומחלוקות') הוא מסיר את 45 הלוחות ואת גג האבן, ונראות הכרותות שעל העמודים — 'והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה' (רלב״ג ז, ג); בקריאת מצודת דוד — את 45 לוחות הארז של התקרה, ונראות הצלעות שעל הכרותות: 'השכיבו צלעות ונסרים, להיות מחיצות הבית ממעל, ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה' (מצודת דוד ז, ג). עובי הנסרים ורוחבם — בחירת מודל.",
            refs: [["מלכים א ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["רש״י ז, ב", V(10, 7, 2)], ["רש״י ז, ד", V(10, 7, 4)], ["רש״י ז, ו", V(10, 7, 6)], ["רד״ק ז, ב", V(10, 7, 2)], ["רלב״ג ז, ג", V(10, 7, 3)], ["מצודת דוד ז, ג", V(10, 7, 3)]] },
          // 1.0.1-L (L.48, the user: "עיין בספר ולפי"ז תבין את העב"; verify-palace Follow-ups §2): the two 7:6 places fly to the palace module's
          // fly points forestAv / forestAlam, which it re-aims per reading (no hard-coded cameras: under "mzd" the K cameras showed the house)
          { t: "העמודים והעב — 'ועמדים ועב על פניהם'", view: "forestAv", layer: "palace",
            info: "'ואולם על פניהם ועמדים ועב על פניהם' (מלכים א ז, ו). רש״י: 'אולם גבוה עשה על כל הבית'; 'ועל כרותות ארזים שעל העמודים התחתונים, הציב על (צריך לומר: עוד) עמודים אחרים, ומרישין מעמוד לעמוד, העמודים לארג בהן צלעות מזה לזה, והעבים לקרוי העליה, עב היא מריש, כמו ששנינו והעבים אלו המרישין'. כך במודל: 'ועמדים' — עמודי קירות הקומה העליונה; 'ועב' — באולם העמודים בלבד, ואינו נראה במודל. בסוף הגג, במקום שלא כיסו 45 הנסרים, אין עבים, והכל דק: 'נתונים על מרישין קטנים... מטור כרותות ארזים אל טור, שלשה מרישין זה אצל (צריך לומר: לסוף) זה, ושקופין משני צדיהן' (רש״י ז, ד). בקריאת מלבי״ם ורלב״ג: 'לפני הבית והאולם היה עוד אולם ולפני האולם השני היו עמודים ועב על פניהם היינו מריש שהוא עץ עב' (מלבי״ם ז, ו) — שורת עמודים לפני האולם השני ועליהם המריש; ולמצודת דוד: 'לפני פתחי האולם הזה, עמדו עמודים תקועים בארץ, וממעל להם עץ עב לחברם יחד' (ז, ו). המבט הולך אחרי הקריאה שנבחרה בטבלת 'שיטות ומחלוקות'; מידות המרישים — בחירת מודל.",
            refs: [["מלכים א ז, ו", V(10, 7, 6)], ["רש״י ז, ו", V(10, 7, 6)], ["רש״י ז, ד", V(10, 7, 4)], ["מלבי״ם ז, ו", V(10, 7, 6)], ["מצודת דוד ז, ו", V(10, 7, 6)]] },
          { t: "אולם העמודים", view: "forestAlam", layer: "palace",
            info: "'ואת אולם העמודים עשה חמשים אמה ארכו ושלשים אמה רחבו ואולם על פניהם ועמדים ועב על פניהם' (מלכים א ז, ו). רש״י: 'אולם עשה לפני העמודים האלה, מבוא לבית, חמשים אמה ארכו, לרחבו של בית שהיה חמשים אמה, ושלשים רחבו לפני ארך משך הבית' — במודל, כציור הספר, אולם כניסה נמוך בקצה הבית, ולפניו 'אולם על פניהם — אולם גבוה'; גובה שני האולמות ומידות האולם הגבוה — בחירת מודל. בקריאת מלבי״ם ורלב״ג: אולם העמודים גבוה כעמודים — 'גבהו כגבהם' (רלב״ג ז, ו) — טורי עמודי ארז בתוכו, ולפניו אולם שני, ולפניו 'עמודים ועב על פניהם, היינו מריש שהוא עץ עב' (מלבי״ם); המבט מתוכו. למצודת דוד: 'עשה אולם עומד על עמודי ארזים... נסמך לבית היער לפני פתחים, וכדרך בית שער, ועמד ארכו לאורך הבית, להיות מול כל שלשת הפתחים' (ז, ו) — אולם לאורך צלעו הארוכה של הבית, מול שלושת פתחיו. המבט הולך אחרי הקריאה שנבחרה. ראו 'העמודים והעב'.",
            refs: [["מלכים א ז, ו", V(10, 7, 6)], ["רש״י ז, ו", V(10, 7, 6)], ["רלב״ג ז, ו", V(10, 7, 6)], ["מלבי״ם ז, ו", V(10, 7, 6)], ["מצודת דוד ז, ו", V(10, 7, 6)]] },
          // 1.0.1-K (K.6): inside the throne hall (flyPoints.throne) and the king's house (flyPoints.kingsHouse); the garden. 1.0.1-L (L.57, L.78,
          // L.81; palace.md / palace-2.md): the throne per Kings in four midrashic versions (the row "כסא שלמה — לפי איזה מדרש"), its own
          // place, and the king's ascent (an animation with its own duration - exempt from the 15-s rule)
          { t: "אולם הכסא ואולם המשפט", view: "throneHall", layer: "palace",
            info: "'ואולם הכסא אשר ישפט שם אלם המשפט עשה וספון בארז מהקרקע עד הקרקע' (מלכים א ז, ז): אולם שבו כיסא המלך למשפט, ורצפתו ארז מקיר לקיר (רש״י, רד״ק). מצודות ומלבי״ם: אולם המשפט לפני אולם הכסא. בתוכו כסא שלמה (י, יח–כ) — ראו 'כסא שלמה' ו'עליית המלך לכסא', והשורה 'כסא שלמה — לפי איזה מדרש' בטבלת 'שיטות ומחלוקות'. הכפתור 'הסר את גגות אולם הכסא' שעל הגג מראה אותו מלמעלה.",
            refs: [["מלכים א ז, ז", V(10, 7, 7)], ["י, יח", V(10, 10, 18)], ["י, יט", V(10, 10, 19)], ["י, כ", V(10, 10, 20)], ["דברי הימים ב ט, יח", V(39, 9, 18)]] },
          { t: "כסא שלמה", view: "throne", layer: "palace",
            info: (PN.throne || "כסא שלמה (מלכים א י, יח–כ; דברי הימים ב ט, יז–יט): 'ויעש המלך כסא שן גדול ויצפהו זהב מופז. שש מעלות לכסה וראש עגל לכסה מאחריו וידת מזה ומזה אל מקום השבת ושנים אריות עמדים אצל הידות. ושנים עשר אריים עמדים שם על שש המעלות מזה ומזה לא נעשה כן לכל ממלכות'. המידות — בחירת מודל.") + (PN.throneVersions ? " ארבע גרסאות במודל — הפסוקים ומפרשיהם בלבד (ברירת המחדל), תרגום שני, אסתר רבה עם פנים אחרים ואבא גוריון, ובית המדרש ב — בשורה 'כסא שלמה — לפי איזה מדרש' בטבלת 'שיטות ומחלוקות'; עליית המלך אל הכסא — בכפתור שעל הכסא ובמקום 'עליית המלך לכסא'." : ""),
            refs: TH_REFS.pesukim },
          { t: "עליית המלך לכסא", view: "throneSteps", layer: "palace",
            feature: { key: "throne.ascent", timed: false, isOn: () => !!(ctx.shared.throne && ctx.shared.throne.ascent && ctx.shared.throne.ascent.running),
              on: () => { const tv = ctx.shared.throneVersion, a = ctx.shared.throne && ctx.shared.throne.ascent; if (tv && typeof tv.set === "function" && tv.current === "pesukim") { tv.set("estherRabbah"); if (throneRow) throneRow.mark("estherRabbah"); } if (a && typeof a.start === "function" && !a.running) a.start(); },
              off: () => { const a = ctx.shared.throne && ctx.shared.throne.ascent; if (a && typeof a.reset === "function") a.reset(); else if (a && typeof a.stop === "function") a.stop(); } },
            info: (PN.throneAscent ? PN.throneAscent.replace("המנגנון — בועה למצגת:", "המנגנון:").replace("בלי דמות המלך — מקומו ניכר ממה שהכסא עושה", "במודל צללית בלבד, בלי דמות המלך") :"עליית המלך אל הכסא (במודל צללית בלבד, בלי דמות המלך): בכל מעלה חוזר גלגל המנגנון שבצד המעלה, והארי פושט את ידו והנשר את כנפו לקראת העולה, זה אחר זה; בראש — על פי המדרש של הגרסה שנבחרה. 'שש מעלות לכסה' (מלכים א י, יט).") + " הכפתור מפעיל את ההדגמה לפי הגרסה שנבחרה בטבלת 'שיטות ומחלוקות'; בגרסת הפסוקים אין מנגנון ואין עלייה, ולכן הוא עובר תחילה לגרסת אסתר רבה. היא נמשכת עד סופה ואינה נסגרת לבד; 'עצור את העלייה' שעל הכסא מחזיר הכל למקומו.",
            refs: [["מלכים א י, יט", V(10, 10, 19)], ["י, כ", V(10, 10, 20)], ["דברי הימים ב ט, יח", V(39, 9, 18)], ["מדרש אבא גוריון א", { book: 274, index: 6 }], ["אסתר רבה א, יב", { book: 264, index: 25 }], ["פנים אחרים נוסח ב", { book: 274, index: 116 }], ["תרגום שני לאסתר א, ב", { book: 3237, index: 13 }], ["בית המדרש ב (דמות כסא שלמה)", { book: 7924, index: 8 }], ["בן יהוידע על סנהדרין קו:", { book: 2546, index: 778 }], ["סנהדרין קו:", { book: 125, index: 4140 }]] },
          // 1.0.1-L (L.33, the user: "בית המלך היה בחצר אחרת לגמרי! ולא בתוך חצר בית יער הלבנון"; "בית בת פרעה בתוך חצר בית יער הלבנון"; L.22
          // "בלי בריכה" - palace.md): the king's own walled court, the garden without the pool, בית בת פרעה in the great court
          { t: "בית המלך", view: "kingsHouse", layer: "palace",
            info: "'וביתו אשר ישב שם חצר האחרת מבית לאולם כמעשה הזה היה' (מלכים א ז, ח): בית מגורי המלך בחצר משלו — החצר האחרת — 'לפנים מן אולם של בית יער הלבנון' (רש״י), בנוי באותו מעשה. " + (PN.kingsHouse || "המידות והחדרים — בחירת מודל.") + " המבט מתוך חדר האוכל; 'הסר את גגות בית המלך' שעל הגג מראה את כל החדרים מלמעלה. ראו 'החצר האחרת — חצר בית המלך'.",
            refs: [["מלכים א ז, ח", V(10, 7, 8)], ["רש״י ז, ח", V(10, 7, 8)], ["י, ה", V(10, 10, 5)], ["י, כא", V(10, 10, 21)], ["שיר השירים ג, ז", V(31, 3, 7)]] },
          { t: "החצר האחרת — חצר בית המלך", view: "otherCourt", layer: "palace",
            info: PN.otherCourt || "'וביתו אשר ישב שם חצר האחרת מבית לאולם כמעשה הזה היה' (מלכים א ז, ח). רש״י: 'מבית לאולם. לפנים מן אולם של בית יער הלבנון'; רד״ק: 'החצר האחרת שהיתה לבית הזה והיא החצר שהיתה מבפנים לאולם'. במודל: חצר משלו לבית המלך, מוקפת חומה וסגורה, מאחורי בית יער הלבנון ומחוץ לחצר הגדולה, כציור הספר; בתוכה הגן. מידותיה — בחירת מודל.",
            refs: [["מלכים א ז, ח", V(10, 7, 8)], ["רש״י ז, ח", V(10, 7, 8)], ["רד״ק ז, ח", V(10, 7, 8)], ["מצודת דוד ז, ח", V(10, 7, 8)], ["ז, יב", V(10, 7, 12)], ["מלכים א י, ה", V(10, 10, 5)]] },
          { t: "הגן", view: "garden", layer: "palace",
            info: PN.garden || "הגן בחצר האחרת, לפני בית המלך: 'עשיתי לי גנות ופרדסים ונטעתי בהם עץ כל פרי' (קהלת ב, ה). מקומו בחצר הזו, הערוגות והעצים — בחירת מודל; בלי בריכה.",
            refs: [["קהלת ב, ה", V(32, 2, 5)], ["מלבי״ם מלכים א ז, ח", V(10, 7, 8)]] },
          { t: "בית בת פרעה", view: "pharaohDaughter", layer: "palace",
            info: PN.pharaohDaughter || "'ובית יעשה לבת פרעה אשר לקח שלמה כאולם הזה' (מלכים א ז, ח): בית לבת פרעה באותו מעשה, בחצר הגדולה — חצר בית יער הלבנון — ולא בבית המלך: 'לא תשב אשה לי בבית דויד' (דברי הימים ב ח, יא). מקומו — בחירת מודל.",
            refs: [["מלכים א ז, ח", V(10, 7, 8)], ["רש״י ז, ח", V(10, 7, 8)], ["דברי הימים ב ח, יא", V(39, 8, 11)], ["ז, א", V(10, 7, 1)]] },
          { t: "החצר הגדולה", view: "palace", layer: "palace",
            info: "'וחצר הגדולה סביב שלשה טורים גזית וטור כרתת ארזים' (מלכים א ז, יב): חומה באותו דגם של חצר המקדש, המקיפה את בית יער הלבנון, את אולמיו ואת בית בת פרעה (כציור הספר); בית המלך — בחצר האחרת שלו, מחוצה לה (מצודות, רלב״ג ומלבי״ם על ז, יב מקיפים בה גם את בית המלך — לא נבנה כך, כציור הספר). כל הבניינים אבני גזית מגוררות, ויסודם אבני עשר ואבני שמונה (ז, ט–יא) — במודל נדבך יסוד גלוי, בחירת מודל (רש״י: היסוד שבתוך הקרקע; רד״ק בשם חז״ל: איצטוניות בולטות מבפנים). מקום הארמון — דרומית לבית ה׳ ונמוך ממנו, שעולים ממנו אל הבית (מלכים א י, ה; ירמיהו כו, י) — ראו 'החצר הגדולה'.",
            refs: [["מלכים א ז, יב", V(10, 7, 12)], ["ז, ט", V(10, 7, 9)], ["ז, י", V(10, 7, 10)], ["י, ה", V(10, 10, 5)], ["ירמיהו כו, י", V(13, 26, 10)]] },
          // 1.0.1 (FIXES E.3 / F.3): 60-palace.js's 20 steps (x 103, z 352.5 -> 342.5, y -10 -> 0) and the landing to the Temple's south gate;
          // the camera stands in the gap between the two walls (z 335..352.5), east of the flight, and looks west along it
          { t: "המעלות מבית המלך אל בית ה׳", tg: [103, -3, 345], cam: [142, 12, 346], layer: "palace",
            info: "'ועלתו אשר יעלה בית ה׳' (מלכים א י, ה; דברי הימים ב ט, ד: 'ועליתו') — מלכת שבא ראתה את עלייתו של שלמה מביתו אל בית ה׳; 'ויעלו מבית המלך בית ה׳' (ירמיהו כו, י); 'וירידו את המלך מבית ה׳ ויבואו דרך שער הרצים בית המלך' (מלכים ב יא, יט). במודל: דרך אבן ועשרים מעלות (עשר אמות) משער הארמון הצפוני אל השער הדרומי של החצר הגדולה — מספר המעלות והמרחק בחירת מודל.",
            refs: [["מלכים א י, ה", V(10, 10, 5)], ["דברי הימים ב ט, ד", V(39, 9, 4)], ["ירמיהו כו, י", V(13, 26, 10)], ["מלכים ב יא, יט", V(11, 11, 19)]] }
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
          info: "במלכים ובדברי הימים אין מידות לחצרות. חצר הכהנים נבנתה 187 על 135 אמה כמדות ה, א, והחצר הגדולה 500 על 500 כהר הבית במדות ב, א — מוסכמה למודל. החצר החיצונה 135 על 135 והמפלסים — בחירת מודל.",
          refs: [["מדות ה, א", MI(5, 1)], ["מדות ב, א", MI(2, 1)], ["מלכים א ו, לו", V(10, 6, 36)]] },
        // 1.0.1-K (K.2): the house wall after Rashi's calculation as the book draws it (it was 6 throughout, after Middot 4:7)
        { t: "עובי הקירות — כותל הבית " + hwT.join(", ") + " (רש״י ו, ו, כציור הספר)", view: "heichalFront",
          info: "עובי הקירות אינו בפסוקים. כותל הבית נבנה כחשבון רש״י (מלכים א ו, ו) כפי שמצייר הספר: " + hwT[0] + " אמות בקומה התחתונה של התאים, " + hwT[1] + " בתיכונה, " + hwT[2] + " בעליונה ו־" + hwT[3] + " מעל גג התאים — בכל קומה הוא נכנס אמה, 'כי מגרעות נתן לבית סביב חוצה לבלתי אחז בקירות הבית' (ו, ו). פני הכותל מבפנים ישרים, והמדרגות בחוץ. במשנת מדות (ד, ז), בבית שני, כותל ההיכל שש. כותל התא חמש — 'וכתל התא חמש' (מדות ד, ז); כותל האולם שש — רש״י בסנהדרין ק. ('וכותל האולם שש'). בחירת מודל.",
          refs: [["מלכים א ו, ו", V(10, 6, 6)], ["רש״י ו, ו", V(10, 6, 6)], ["מדות ד, ז", MI(4, 7)], ["רש״י סנהדרין ק.", P(125, "ק.")]] },
        { t: "38 תאים (רש״י ו, ו ממדות ד, ג)", view: "heichalSouth",
          info: "מספר התאים אינו במלכים. רש״י (ו, ו) מביא את משנת מדות ד, ג: שלושים ושמונה תאים — חמישה עשר בצפון, חמישה עשר בדרום ושמונה במערב, ולכל תא שלושה פתחים (רש״י ו, ח: 'אחד לתא מן הימין, ואחד לתא מן השמאל, ואחד לתא שעל גביו'). חלוקת התאים לאורך, המחיצה שבין השורה הארוכה לשורת המערב ועובי המחיצות — בחירת מודל.",
          refs: [["רש״י מלכים א ו, ו", V(10, 6, 6)], ["רש״י ו, ח", V(10, 6, 8)], ["מדות ד, ג", MI(4, 3)]] },
        // 1.0.1-K (K.2): the chambers' beams, doors and stair
        { t: "קורות היציע, פתחיו והלולים", view: "yatziaDoor",
          info: "בפסוקים: רוחב התאים וגובהם (מלכים א ו, ו; ו, י), המגרעות, הפתח בכתף הימנית והלולים (ו, ח). בחירות מודל: קורות הארז של התקרות ושל הגג אמה עוביין, זו בצד זו, ולכן גג התאים בגובה שלושים; קורות הרצפה כלות בפני כותל התא מבפנים, כציור הספר; הפתח החיצוני " + nf(yDoor[0]) + " על " + nf(yDoor[1]) + ", פתחי המחיצות שתיים על ארבע והפתחים שבתקרות שתיים על שתיים; הלולים — עמוד ובו עשרים וארבע מעלות סביבו מגובה 12 עד 24; ואין מעקה על הגג (כציור הספר). חתך היציע — בקצהו המזרחי של התא האמצעי שבדרום — הוא כלי צפייה בלבד; הצבעים והמקרא שעליו — בחירת מודל.",
          refs: [["מלכים א ו, ו", V(10, 6, 6)], ["ו, ח", V(10, 6, 8)], ["ו, י", V(10, 6, 10)]] },
        { t: "גובה האולם", view: "heichalFront",
          info: "במלכים אין גובה לאולם. 'והגובה מאה ועשרים' (דברי הימים ב ג, ד) נאמר על האולם: רד״ק — האולם לבדו 120 (דעתו העיקרית); רש״י — שלושים עד התקרה ועוד תשעים אמה של עליות. המודל הבסיסי: אולם בגובה הבית, שלושים, והעליות בשורה 'גובה הבית' שבטבלת 'שיטות ומחלוקות' — בחירת מודל.",
          refs: [["דברי הימים ב ג, ד", V(39, 3, 4)], ["מלכים א ו, ג", V(10, 6, 3)]] },
        { t: "פתחי ההיכל והדביר (מידות)", view: "heichalDoor",
          info: "מידות הפתחים אינן בשום מקור. פתח ההיכל נבנה עשר על עשרים (כיחס פתח ההיכל של בית שני, מדות ד, א), פתח הדביר שש על שתים עשרה — רחב ממרווח בדי הארון כדי ששני הבדים ידחקו בפרוכת (רש״י ו, כג; ח, ח). פתח האולם, עשר על עשרים ושתיים — בחירת מודל — ובו שתי דלתות ארז פתוחות (דברי הימים ב כט, ז); משקוף ישר כציור הכללי בספר, לוח אחד לכל דלת וצירי נחושת — בחירת מודל; הפרוכת שהמאירי מזכיר (יומא נד.) לא נבנתה.",
          refs: [["מדות ד, א", MI(4, 1)], ["מלכים א ו, לא", V(10, 6, 31)], ["ו, לג", V(10, 6, 33)], ["דברי הימים ב כט, ז", V(39, 29, 7)], ["מלבי״ם שם", { book: 3364, index: 810 }], ["מדות ג, ז", MI(3, 7)], ["מאירי יומא נד.", { book: 2199, index: 480 }]] },
        { t: "הכבש והקרנות", view: "mizbeach",
          info: "דברי הימים ב ד, א נותן למזבח הנחושת רק אורך, רוחב וגובה. הכבש מדרום ('לא תעלה במעלות', שמות כ; מידותיו כמדות ג, ג), ארבע הקרנות (כמזבח הנחושת שבמשכן, שמות כז) והשפה שבראש המזבח — השלמת מודל. הכרכוב הוא הסובב, כרבי יוסי ברבי יהודה (זבחים סב.).",
          refs: [["דברי הימים ב ד, א", V(39, 4, 1)], ["מדות ג, ג", MI(3, 3)], ["מדות ג, א", MI(3, 1)], ["זבחים סב.", { book: 130, index: 2109 }]] },   // 1.0.2 add-on: the band became the sovev
        { t: "מקום המזבח (מדות ה, א)", tg: [49.5, 12, 0], cam: [60, 110, 40],
          info: "מקום המזבח בחצר אינו נתון במלכים. במודל הוא על ציר הבית; גוף המזבח עשרים ואחת אמה מן האולם, ויסודו תשע עשרה — כסדר מדות ה, א ('בין האולם ולמזבח עשרים ושתים אמה'), בהתאמה למזבח של עשרים אמה. בחירת מודל.",
          refs: [["מדות ה, א", MI(5, 1)], ["מדות ג, ו", MI(3, 6)], ["דברי הימים ב ד, א", V(39, 4, 1)]] },
        { t: "האוטם והמעלות", tg: [21, 10, 0], cam: [52, 26, 30],
          info: "במלכים אין מפלסים. הבית הוגבה על אוטם של שש אמות (מדות ד, ו; מלבי״ם על מלכים א ו, ח מזכיר יסוד כזה), עם שתים עשרה מעלות מחצר הכהנים לאולם (מדות ג, ו) ושתים עשרה מעלות מן החצר הגדולה לחצר הכהנים — בחירת מודל.",
          refs: [["מדות ד, ו", MI(4, 6)], ["מדות ג, ו", MI(3, 6)], ["מלכים א ו, ח", V(10, 6, 8)]] },
        // 1.0.1-L (L.62; vessels-2.md): the capacity
        { t: "צורת הים (עירובין יד:)", view: "yam",
          info: "'עגל סביב... וקו שלשים באמה יסב אתו' (מלכים א ז, כג), 'אלפים בת יכיל' (ז, כו) לעומת 'שלשת אלפים' (דברי הימים ב ד, ה). עירובין יד: מיישבת: 'שלש אמות תחתונות מרובעות, ושתים עליונות עגולות' — וכך רש״י, רד״ק, מצודות, רלב״ג ומלבי״ם. הקיבולת: 'ים שעשה שלמה היה מחזיק מאה וחמשים מקוה טהרה' (שם): עשר על עשר ברום שלוש — 300 אמה מעוקבת, ושתי העליונות העגולות — 150 לחשבון הגמרא; סך הכל 450 = 150 מקוואות = 6,000 סאה = 2,000 בת (רש״י שם: 'ו' אלפים סאין - שהן ק״נ מקואות'). באגן שבמודל, עשר על עשר, דופן טפח, פני המים ב־450 אמה מעוקבת (2,000 בת). באמה של 48 ס״מ — 49,766 ליטר; ולפי 7.34 ליטר לסאה, כספר 'מדות ומשקולות' — 44,040 ליטר, והן אותן 450 אמה. השוורים — שלושה לכל רוח, פניהם לחוץ ואחוריהם אל תחת הים (ז, כה); ראו 'שנים עשר הבקר'.",
          refs: [["עירובין יד:", P(105, "יד:")], ["עירובין יד.", P(105, "יד.")], ["מלכים א ז, כג", V(10, 7, 23)], ["ז, כו", V(10, 7, 26)], ["דברי הימים ב ד, ה", V(39, 4, 5)]] },
        // 1.0.1-K (K.3): the oxen
        { t: "שנים עשר הבקר — צורתם וגודלם", view: "yamOxen",
          info: "הפסוקים נותנים את מספר הבקר, את פניהם לחוץ ואת אחוריהם 'ביתה' (מלכים א ז, כה), ולא את גודלם וצורתם. במודל, כציור הספר: שוורים מוצקים, שלושה לכל רוח, חציים הקדמי מחוץ לים — הרגליים הקדמיות בקו הדופן והחוטם כשתי אמות מחוץ לה — ואחוריהם נפגשים תחת מרכז הים; גבם נושק לתחתית הים; הראש מוטה מעט מטה כבספר. כל המידות — בחירת מודל.",
          refs: [["מלכים א ז, כה", V(10, 7, 25)], ["דברי הימים ב ד, ד", V(39, 4, 4)]] },
        // review UI-H2-7: the Sea's switch is a row of the opinions table now
        { t: "מקום הים (רש״י / רד״ק)", cam: uiSeaCam, tg: uiSeaTg,
          info: "'ואת הים נתן מכתף הבית הימנית קדמה ממול נגב' (מלכים א ז, לט). רש״י: 'משוך מצד דרום לצד צפון, וזה קדמה מול נגב, מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה'. מצודת דוד: 'משוך כלפי מקצוע מזרחית דרומית שבעזרת כהנים'; רד״ק: 'נתן הים בעזרה לצד דרום משוך כלפי מזרח'; רלב״ג: 'הים היה לפאת מזרחי דרומי שבחצר הכהנים'; רש״י (דברי הימים ב ד, י): 'רחק אותו מן המזרח מן כנגד הפתח לדרומה של עזרה, לפי שאין כבוד ונאה שיהו מטבילין כנגד פתח האולם'. שני המקומות במודל — בוחרים בשורה 'מקום הים' שבטבלת 'שיטות ומחלוקות'; ברירת המחדל: רש״י, כציור הספר ומפתו — בקרן המזרחית הצפונית, ממזרח לצפון בית המטבחים, מול השולחנות והטבעות. המקורות אומרים 'מקצוע' ולא מרחק: ציר הים " + nf(courtE - seaXm) + " אמות מן הכתלים, ונשאר מעבר סביב ראשי הבקר ובינם לבין לשכת הגזית — בחירת מודל.",
          refs: [["מלכים א ז, לט", V(10, 7, 39)], ["דברי הימים ב ד, י", V(39, 4, 10)]] },
        { t: "העליות (רש״י דה״י ג, ד)", view: "aliyot", layer: "aliyot",
          info: "'והגובה מאה ועשרים' (דברי הימים ב ג, ד): רש״י — שלושים אמה עד תקרת העלייה הראשונה, 'ומעליה לעליה עד גג העליון תשעים אמות'; רד״ק (כדעה שנייה) — 'ג' עליות גבהן תשעים אמה'. בבא בתרא ג. משווה את גובה הבית (שלושים) לבית שני ואינה מזכירה 120. מספר הקומות וחלוקתן — בחירת מודל (השורה 'גובה הבית' בטבלת 'שיטות ומחלוקות').",
          refs: [["דברי הימים ב ג, ד", V(39, 3, 4)], ["בבא בתרא ג.", P(124, "ג.")]] },
        { t: "בית החליפות (רש״י יומא לו.)", tg: [18, 20, 33], cam: [70, 40, 70],
          info: "רש״י (יומא לו.): 'בית החליפות' — האולם היה רחב מן ההיכל חמש עשרה אמה מכל צד, ובשני הצדדים גנזו שם את הסכינים (חליפות). רש״י בסנהדרין ק. מונה כך גם בבית ראשון. במודל גוש האולם נמשך חמש עשרה אמה מעבר לגוף הבית עם התאים, ולכן חזיתו " + nf(2 * ulamHalf) + " אמות; הפתח מן האולם אל כל כנף (שלוש על שבע) והחלונות לסכינים — בחירת מודל.",
          refs: [["יומא לו.", P(107, "לו.")], ["מלכים א ו, ג", V(10, 6, 3)], ["רש״י סנהדרין ק.", P(125, "ק.")]] },
        { t: "מקום בית שלמה", view: "palace", layer: "palace", // 1.0.1 (FIXES E.2 / F.5): the basis from 60-palace.js (ctx.shared.palaceBasis) or ui_PALACE_BASIS
          info: "מלכים א ז, א–יב מתאר את בתי המלך ואינו נותן את מקומם ביחס למקדש (רלב״ג רק משער שבית יער הלבנון היה קרוב למקדש). " + palaceBasis + " מידות הבניינים שאינן בפסוק — בחירת מודל.",
          refs: [["מלכים א י, ה", V(10, 10, 5)], ["מלכים א ח, א", V(10, 8, 1)], ["ירמיהו כו, י", V(13, 26, 10)], ["ירמיהו כב, א", V(13, 22, 1)], ["מלכים ב יא, יט", V(11, 11, 19)], ["מלכים א ז, א", V(10, 7, 1)]] },
        // 1.0.1 (FIXES A.2 / A.4 / F.5): the viewing openings are tools, not architecture; 1.0.1-K: only by the buttons on the model
        { t: "פתיחת הבית, התאים והאולם — כלי צפייה בלבד", view: "heichalSouth",
          info: "הבית סגור מכל צדדיו, והתאים סגורים מכל צד — 'ויבן על קיר הבית יציע סביב' (מלכים א ו, ה) — ופתחם היחיד מבחוץ בכתף הבית הימנית (ו, ח); וחזית האולם סגורה מלבד פתחו. הכפתורים שעל המודל עצמו — 'פתח את הבית', 'הסר את קירות היציע', 'פתח את האולם', 'הצג חתך של היציע (רש״י)', וכן שכבות הקיר ושכבות המזבח — מסירים או חותכים חלקים כדי להראות את הפנים: כלי צפייה בלבד, לא חלק מן הבניין. שום מבט אינו פותח אותם מעצמו, ו'↺ החזר הכל' סוגר הכל.",
          refs: [["מלכים א ו, ה", V(10, 6, 5)], ["ו, ח", V(10, 6, 8)], ["ז, כא", V(10, 7, 21)]] },
        // ---- the model choices the integrator required (STANDING RULE above); the numbers come from the model where it shares them ----
        { t: "גובה חומות החצרות (20 אמה)", tg: [93.5, 16, 0], cam: [150, 36, 40], // the inner court's east wall and gate (30-courts.js CRT_WALL_H 20)
          info: "במקורות אין גובה לחומות החצרות. חומת החצר הגדולה וחומת חצר הכהנים נבנו במודל בגובה עשרים אמה — חמישה מחזורים של שלושה נדבכי אבן ונדבך ארז (מלכים א ז, יב; ו, לו) — כך שמשקופי השערים, עשרים אמה כמדות ב, ג, חותמים את ראש החומה; עובי החומות חמש. חומת החצר החיצונה נמוכה, ארבע אמות. בחירת מודל.",
          refs: [["מלכים א ז, יב", V(10, 7, 12)], ["מלכים א ו, לו", V(10, 6, 36)], ["מדות ב, ג", MI(2, 3)]] },
        { t: "שערי החצר הגדולה ומעלותיהן", view: "eastGate", // SPEC 3 / 20-mount.js: N/S gates at x 103 (mid-side), E/W on z 0, 56 steps of 0.5 from the ground (-28)
          info: "במלכים אין מספר לשערי החצר הגדולה ואין מקום. במודל שער אחד בכל צד: הצפוני והדרומי באמצע הצלע, המזרחי והמערבי על ציר הבית — כך ששלושת השערים המזרחיים (החצר הגדולה, החצר החיצונה, חצר הכהנים) עומדים בקו אחד; אל כל שער עולות מן הקרקע 56 מעלות של חצי אמה. דלתותיהם מצופות נחושת כדלתות העזרה (דברי הימים ב ד, ט). בחירת מודל.",
          refs: [["דברי הימים ב ד, ט", V(39, 4, 9)], ["מלכים א ז, יב", V(10, 7, 12)]] },
        { t: "העמוד — במה ועמוד במבוא", tg: () => oci("עמוד", OCI_FB.amud), cam: () => ociCam("עמוד", OCI_FB.amud, 24),
          info: "הפסוקים אומרים שהמלך עמד 'על העמוד כמשפט' (מלכים ב יא, יד; כג, ג), 'במבוא' (דברי הימים ב כג, יג), ואינם מתארים אותו. במודל: במה עגולה של אבן, ארבע אמות רוחבה ואמה גובהה, עם שתי מעלות, ועליה עמוד קצר — כעמוד שבו עמד המלך ('אסטונא' בתרגום) וכבמה שעליה עמד המלך לפני העם (רש״י דברי הימים ב כג, יג, מבימת שלמה בדברי הימים ב ו, יג); מקומה בחצר החיצונה, סמוך למעלות שער חצר הכהנים ממזרח. בחירת מודל.",
          refs: [["מלכים ב יא, יד", V(11, 11, 14)], ["דברי הימים ב כג, יג", V(39, 23, 13)], ["דברי הימים ב ו, יג", V(39, 6, 13)]] },
        // 1.0.1-L (L.77; the numbers from the model): the block of bases, Moses' laver, the Sea in the corner
        // 1.0.1-L (Part 7, U4, "כנ״ל מקום הכיורות צריך להיות מרחוק יותר"): the whole block and what is round it, from high and far (model choice)
        { t: "מקום הכיורות והים", cam: [84, 112, 108], tg: [36, 6, 36],
          info: "במקורות אין מרחקים לכלי הנחושת. המכונות, כציור 'מקרא מפורש' (עמ' לח) ומפתו (עמ' ב–ג): גוש אחד, שתי שורות של חמש, מזרחה למערב, וכיור משה ביניהן, בתוך הרצועה שבין קו כותל ההיכל הימני לכותל העזרה הימני, בין אגף האולם הדרומי לכבש. השורות " + nf(blkRows[0]) + " ו־" + nf(blkRows[1]) + " אמות מציר הבית, " + nf(Math.abs(blkCols[1] - blkCols[0])) + " אמות בין מכונה למכונה (בין האגף לכבש 23 אמות בלבד, ולכן השורה הצפונית ביניהם והדרומית מעט מדרום להם). הים בקרן מזרחית צפונית (רש״י ז, לט), ממזרח לצפון בית המטבחים, ציר הים " + nf(courtE - seaXm) + " אמות מן הכתלים; בשיטה השנייה בקרן מזרחית דרומית. בחירת מודל.",
          refs: [["מלכים א ז, לט", V(10, 7, 39)], ["דברי הימים ב ד, ו", V(39, 4, 6)], ["ד, י", V(39, 4, 10)]] },
        // 1.0.1-K (K.3): the bases
        { t: "המכונות — האופנים, הכיור והכן", view: "mechonaClose",
          info: "בפסוקים ובפירוש רש״י: המכונה ארבע על ארבע ושלוש קומתה, האופנים אמה וחצי, הכותרת ופיה, הכן והכיור של ארבע (מלכים א ז, כז–לח). בחירות מודל: האופנים בתוך ריבוע המכונה, בשפתה ובנחושת כהה כדי שייראו (הספר מצייר אותם בפינות, בולטים; בנסיעה לצפון ולדרום החישוקים יוצאים מעט מן הריבוע); 'אופן בתוך אופן' כציור הספר (עמ' לז) ובביאורו לרש״י — גלגל קטן שוכב המסובב את האופן הגדול לצדדים סביב מקל היורד מן המכונה, והגדול הולך קדימה ואחור (לרש״י הידות הן ציר הגלגל, ולבעל צורת הבית — מקלות התחובים בזוגות אופנים); חלוקת גוף המכונה בין המסגרת, הלוחות, הנסרים והכותרת; הכיור 1.9 אמות רוחבו מבחוץ, אמה וחצי ורביע מבפנים — 'אם היה כולו עגול, היה מחזיק בחללו...' (מלבי״ם ז, כח); למלבי״ם עצמו, שהתחתונה מרובעת, זו המידה מבחוץ; 1.9 מבחוץ בחירת מודל, כדי להכיל ארבעים בת; עובי הדופן, רוחב ריבוע הכן (2.2) ועובי מחיצת פי הכותרת (0.1); הכיור בגובה ארבע — כמצודת דוד ומלבי״ם (רלב״ג מפרש את הארבע כרוחבו); ומידת ההרמה בפירוק.",
          refs: [["מלכים א ז, כז", V(10, 7, 27)], ["ז, לב", V(10, 7, 32)], ["ז, לא", V(10, 7, 31)], ["ז, לח", V(10, 7, 38)]] },
        // 1.0.1-L (L.61, L.63; vessels-2.md)
        { t: "המכונות — שלוש מסגרות בכל צד והציורים", view: "mechonaClose",
          info: "שלוש מסגרות בין השלבים בכל צד, כביאור הגר״א. הציורים דקים ושטוחים (בחירת מודל). על הליות רש״י ז, כט: 'ואין בולטין בעביו, ולא חקוקים בשקוע'; על המסגרות התחתונות והנסרים רש״י ז, לו: 'פתח וחקק'. צורתם — ארי ובקר זה מול זה, ומתחתם כרובים וליות חבוקות — כציור הספר (עמ' לד), בחירת מודל.",
          refs: [["מלכים א ז, כח", V(10, 7, 28)], ["ז, כט", V(10, 7, 29)], ["ז, לו", V(10, 7, 36)]] },
        // 1.0.1-L (L.9, L.10, L.40; vessels.json FOR-UI): the taps, Moses' laver without the spouts, the demonstration
        { t: "ברזי הכיורות", view: "mechonaClose",
          info: "ברזי הכיורות — לכיורות דדים: 'כעין דוד ולה דדים המריקים מים' (מצודת ציון דברי הימים ב ד, ו). שני ברזים לכל כיור, צורתם ומקומם לאורך השורות: כציור הספר (עמ' לח), בחירת מודל. הצינור ארוך מעט מן הציור, כדי שמי ההדגמה ירדו לרצפה מחוץ לגוף המכונה. בחירת מודל.",
          refs: [["מלכים א ז, לח", V(10, 7, 38)], ["דברי הימים ב ד, ו", V(39, 4, 6)]] },
        { t: "כיור משה — שני הברזים", view: "kiyorMoshe", tg: [rowX, 9, kz], cam: [rowX + 18, 19, kz],
          info: "לכיור משה שני ברזים: 'בן קטין עשה שנים עשר דד לכיור, שלא היו לו אלא שנים' (משנה יומא ג, י) — לפני בן קטין היו לכיור שניים בלבד, ושנים עשר הדדים הם תוספת של בית שני. צורת הברזים, גובהם וצדיהם, צורת הכיור ומקומו בין שתי שורות המכונות — בחירת מודל, כציור הספר.",
          refs: [["משנה יומא ג, י", MN(55, 3, 10)], ["שמות ל, יח", V(2, 30, 18)]] },
        { t: "הדגמת המכונה — המסלול והמים", view: "mechonaDemo",
          info: "לאן הוליכו את המכונות אין מקור מפורש. בהדגמה (הכפתור שעל המכונה שבשורה הצפונית) היא עוצרת תחילה בין האולם למזבח, ליד הכבש, לקידוש ידים ורגלים: 'ורחצו אהרן ובניו ממנו את ידיהם ואת רגליהם' (שמות ל, יט); אחר כך היא נוסעת לשלחנות השיש שבבית המטבחים: 'שעליהן מדיחין את הקרבים' (שקלים ו, ד), 'וקרבו וכרעיו ירחץ במים' (ויקרא א, ט) — ומי הכיור יורדים מן הברז — 'מן מימי הכיור ידיחו קרבי העולה' (רש״י דברי הימים ב ד, ו) — וחוזרת; לפני כל שינוי כיוון הגלגלים הקטנים מסובבים את הגדולים, וגוף המכונה אינו מסתובב. המסלול, התחנות והמים — בחירת מודל על פי המקורות.",
          refs: [["דברי הימים ב ד, ו", V(39, 4, 6)], ["שמות ל, יט", V(2, 30, 19)], ["משנה שקלים ו, ד", MN(54, 6, 4)], ["ויקרא א, ט", V(3, 1, 9)], ["מלכים א ז, ל", V(10, 7, 30)]] },
        // 1.0.1-K (K.1): Yachin and Boaz - review UI-H2 / K.1: the 1.0.1 centres (5.5, 6.9) were Radak's capital; now as close to the wall as the doorposts allow
        { t: "מקום יכין ובועז בתוך האולם", view: "yachinBoaz",
          info: "העמודים עומדים בתוך האולם, מימין ומשמאל לפתח ההיכל — רש״י (מלכים א ז, טו: 'שהעמיד באולם'), רד״ק ומצודות על דברי הימים ב ג, טו; מלבי״ם לבדו מעמידם בחוץ. רש״י (ירמיהו נב, כג): 'העמידם שלמה באולם סמוך לכותל ההיכל, והכותל מכסה ארבע רמונים מכל טור' — ולכן הם צמודים ככל האפשר: מרכזיהם " + nf(pil.x - houseE) + " אמות לפני כותל ההיכל ו־" + nf(pil.z) + " אמות מן הציר לכל צד, והכותרת שתי מאיות אמה בלבד מקירות הצד של האולם וממזוזות פתח ההיכל. לגעת בכותל לא יכלו — בין מזוזת פתח ההיכל לכותל הצדדי של האולם יש ארבע אמות בלבד, והכותרת רחבה כחמש אמות ושלושה חומשים. בחירת מודל.",
          refs: [["רש״י מלכים א ז, טו", V(10, 7, 15)], ["רש״י ירמיהו נב, כג", V(13, 52, 23)], ["דברי הימים ב ג, טו", V(39, 3, 15)], ["מלכים א ז, כא", V(10, 7, 21)]] },
        { t: "צורת כותרות יכין ובועז (רש״י ז, יח, כציור הספר)", view: "yachinBoazCapital",
          info: "הפסוקים נותנים את גובה העמוד והכותרת, השבכה, השושן ומאתיים רימונים. הצורה — כרש״י (ז, טז–יח) וכציור הספר: העמוד חלול, ארבע אמות עוביו, תחוב בכותרת שתי אמות (סך הכל עשרים ואחת); הכותרת שני אגנים — הגולה התחתונה מצוירת שושנים, הבטן ועליה שני טורי רימונים על שרשרות, השבכה ככיפה קלועה, וכותרת קטנה של אמה בראשה. רש״י (ז, טז, ממשנת ארבעים ותשע מידות; וכן רד״ק ומצודות) מביא ששתי האמות התחתונות 'היו שוות לעמוד, שלא היו בהן צורה' — הספר והמודל עושים אותן אגן מצויר, כרש״י ז, יח. רד״ק ומצודות תוחבים את העמוד בכותרת חצי אמה בלבד (עשרים ושתיים וחצי); מלבי״ם מעמיד את העמודים בחוץ, וקריאתו לכותרת — בשורה 'כותרות יכין ובועז' בטבלת 'שיטות ומחלוקות' (צורת הרשת, הרימונים והציור בחירת מודל; בקריאה זו העמודים עומדים לפני האולם (ז, כא), והשושן מצויר על חזיתו); רלב״ג — עמודים קטנים עולים מן השבכה. מידות הקימורים, גודל הרימונים והשושנים ומספר השושנים — בחירת מודל.",
          refs: [["מלכים א ז, טו", V(10, 7, 15)], ["ז, טז", V(10, 7, 16)], ["ז, יח", V(10, 7, 18)], ["ז, כ", V(10, 7, 20)], ["ירמיהו נב, כא", V(13, 52, 21)]] },
        { t: "חלוני ההיכל: שישה בכל צד", tg: [-35, 34, 14.5], cam: [-20, 40, 52], // 50-heichal.js WIN_X: 6 per side along the kodesh, on the house wall above the chambers' roof (the user's sheet, item 16)
          info: "'ויעש לבית חלוני שקפים אטמים' (מלכים א ו, ד) — בפסוק אין מספר ואין מקום. במודל שישה חלונות בכל צד, צפון ודרום, לאורך ההיכל בלבד, ברצועה שמעל גג היציע (מלבי״ם); אין חלונות בדביר ובכותל המערב. צורתם רחבה מבחוץ וצרה מבפנים (רש״י; מנחות פו:). המספר והמקום — בחירת מודל.",
          refs: [["מלכים א ו, ד", V(10, 6, 4)], ["מנחות פו:", P(131, "פו:")]] },
        { t: "פריסת העליות על הבית והאולם בלבד", view: "aliyot", layer: "aliyot", // 50-heichal.js aliyot layer: x -67.5..18.5, z +-14, not over the wings (SPEC 6)
          info: "רש״י (דברי הימים ב ג, ד) אינו אומר על מה עמדו העליות. במודל הן בנויות על הבית ועל האולם בלבד — מן הכותל המערבי עד חזית האולם, ברוחב כותלי הבית העליונים — ולא על כנפי בית החליפות; שתי עליות, זו על גב זו, עד גובה 120 אמה מרצפת הבית, כאיור הספר. בחירת מודל.",
          refs: [["דברי הימים ב ג, ד", V(39, 3, 4)], ["מלכים א ו, ג", V(10, 6, 3)]] },
        // ---- 1.0.1-H: the second round of the user's corrections (FIXES-1.0.1-H.md); 1.0.1-K: K.4 / K.5 ----
        { t: "דוגמת הגילופים (ו, יח; ו, כט)", view: "carvings",
          info: "הפסוקים נותנים את מיני הגילוף — מקלעת, כרובים, תמורות, פטורי ציצים ופקעים — ולא את סידורם וגודלם. במודל, כציור הספר (שהוא עצמו מציין שסדר העיטורים להמחשה בלבד): משבצת אחת של חמש אמות רוחב ועשר גובה היא שורה — חבל שזור בתחתיתה, זוג כרובים בגובה שלוש אמות ושליש תחת קשת כנפיהם, שושנים בשלשות, פקע כביצה, שלוש שרשרות תלויות ודקל בגובה שבע אמות ושליש בין כל שני זוגות; שלוש שורות בהיכל (שלושים אמה), שתיים בדביר (עשרים) ושתיים על כל דלת. הדוגמה נמשכת על פני כל הקירות, אמה טרקסין והדלתות בלי תפר. בחירת מודל.",
          refs: [["מלכים א ו, כט", V(10, 6, 29)], ["ו, יח", V(10, 6, 18)], ["ו, לה", V(10, 6, 35)]] },
        // 1.0.1-K (K.5.3 / the addendum D): an option, the default all gold
        { t: "שכבות הקיר והרצפה — תצוגה בלבד", view: "wallLayers",
          info: "הפסוקים מונים אבן, ארז וזהב בקירות, ואבן, ברושים וזהב ברצפה (מלכים א ו, ז; ו, טו; ו, יח; ו, כא–כב; ו, ל) — ובבית עצמו 'הכל ארז אין אבן נראה', והכל זהב. החלון המדורג שבקיר הצפוני של ההיכל, סמוך לפתח ההיכל (שתים עשרה אמות רוחבו וארבע עשרה גובהו), וברצפה שלפניו — כציור הספר — הוא אפשרות תצוגה בכפתור 'הצג את שכבות הקיר והרצפה'; מקומו, מדרגותיו, צבע הארז ולוחותיו הזקופים (אמה רוחב כל לוח) ועובי השכבות (ארז 0.15 בקיר; ברוש 0.04 ברצפה) — בחירת מודל. רצפת הזהב על לוחות ברוש, אמה רוחב כל לוח לאורך הבית — בחירת מודל.",
          refs: [["מלכים א ו, טו", V(10, 6, 15)], ["ו, יח", V(10, 6, 18)], ["ו, ל", V(10, 6, 30)]] },
        // 1.0.1-K (K.4): the tables
        { t: "השולחנות — מידותיהם והלחם", view: "shulchanMoshe",
          info: "מידות עשרת השולחנות של שלמה אינן בפסוקים — כל אחד בתבנית שולחן משה ובמידתו, שתי אמות על אמה ואמה וחצי גובה (שמות כה, כג), אורכו לאורך הבית (משנה מנחות יא, ו: 'כל הכלים שהיו במקדש, ארכן לארכו של בית'). המסגרת מתחת לדף, כדעה השנייה ברש״י וכציור הספר. כל אחד כשולחן משה: הסניפין, הקנים והבזיכין על כולם; הלחם — על שולחן משה תמיד, ועל העשרה רק לרבי אלעזר בן שמוע — לתנא קמא הם עומדים בלא לחם. לרבי שולחן משה בראש שתי השורות — 'כתלמיד היושב לפני רבו' (מנחות צט.) — חצי אמה מערבה מקצה השורות (בחירת מודל); לר׳ אלעזר בר׳ שמעון — שתי אמות ומחצה מכותל צפון (תוספות מנחות צח:), וארכו לאורך הבית (מאירי יומא נא:). רוחב הסניפין כרוחב המערכה וחמשת פיצוליהם, צורת הבזיכין ועובי דפנות הלחם — כציור הספר, בחירת מודל; הבזיכין שעל השולחנות שבלא לחם — בלי לבונה.",
          refs: [["שמות כה, כג", V(2, 25, 23)], ["משנה מנחות יא, ו", MN(81, 11, 6)], ["מנחות צט.", P(131, "צט.")], ["מנחות צח:", P(131, "צח:")]] },
        // 1.0.1-L (L.71, L.73; interior.md): the menorot
        { t: "המנורות — משיכתן, המעלות והעיטורים", view: "menorot",
          info: "המנורות משוכות מערבה מן השולחנות — רלב״ג (מלכים א ז, מט): 'הנה מפני שהשולחנות הם גם כן לפני הדביר ולא זכר זה אלא במנורות ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות', וכציור הספר; השיעור, אמה אחת — בחירת מודל. ובמקורות גם 'ומנורה בדרום משוכה מן הכותל שתי אמות ומחצה' (יומא לג:) ו'נכח השלחן' (רש״י: 'זה בצד זה'). מנורת משה — לרבי בראש שורות המנורות, ולר׳ אלעזר בר׳ שמעון באמצע הטורים (מנחות צח:–צט.). אבן של שלוש מעלות לפני כל מנורה (משנה תמיד ג, ט): 'ואבן זו היתה של שיש טהור, ויותר נאה מן הזהב, וגובהה ח׳ טפחים ומחצה, וארכה ט׳ טפחים' (ילקוט מעם לועז, במדבר) — שלוש מעלות שוות; רוחבה — בחירת מודל. צדה: לרבי צפונית למנורה, לר׳ אלעזר בר׳ שמעון מערבית לה (מעשי למלך על הרמב״ם ג, יא). הגביעים, הכפתורים והפרחים (עשרים ושניים, אחד עשר ותשעה — מנחות כח:) לפי הטפחים שבברייתא; צורתם — 'כמין כוסות אלכסנדריים', 'כמין תפוחי הכרתיים', 'כמין פרחי העמודין' — הקנים — רש״י (שמות כה, לב): 'לכאן ולכאן באלכסון, נמשכים ועולין עד כנגד גבהה של מנורה', וישרים כציור הספר. העיטורים 'משקדים' — 'מצירים היו' (רש״י כה, לג), 'והכל משקדים כמו שקדים בעשיתן' (רמב״ם ג, ב). בטפח השישי הגביע על הקנה, הכפתור והפרח בצדיו — כציור הספר. הבסיס ועובי הקנים — בחירת מודל.",
          refs: [["רש״י שמות כה, לב", { book: 3692, index: 1793 }], ["רש״י שמות כה, לג", { book: 3692, index: 1795 }], ["רמב״ם ג, ב", { book: 337, index: 44 }], ["מעשי למלך ג, יא", { book: 4304, index: 89 }], ["רלב״ג ז, מט", { book: 3645, index: 312 }], ["יומא לג:", P(107, "לג:")], ["מנחות כח:", P(131, "כח:")], ["מנחות צח:", P(131, "צח:")], ["משנה תמיד ג, ט", MN(88, 3, 9)], ["רמב״ם בית הבחירה ג, י", RB(3, 10)], ["ג, יא", RB(3, 11)]] },
        // 1.0.1-K (K.4 / K.5): the golden altar
        { t: "מזבח הזהב — גובהו, מקומו, קרנותיו, שכבותיו ועשן הקטורת", view: "incenseAltar",
          info: "מזבח הקטורת של שלמה הוא 'אמה על אמה' (רמב״ם בית הבחירה ג, יז), וגובהו אינו נתון: במודל אמה אחת — בחירת מודל — ו'ממנו קרנתיו' (שמות ל, ב): הקרנות בתוך האמה, טפח גובהן; זר הזהב (ל, ג) מעקה סביב גגו, טפח מתחת לראשי הקרנות — בחירת מודל. מקומו: על ציר הבית, מיד מזרחית לשורות השולחנות והמנורות — בחירת מודל; במקורות: בין השולחן למנורה, מחצי הבית ולפנים ומשוך קמעא כלפי חוץ (יומא לג:; מנחות צח:; רמב״ם שם), ובבית לא נמסרה מידה במספרים (במשכן: עשר אמות מן הפתח — רש״י שמות כו, לה) — הרווח מן השורות (אמה לרבי, שלושת רבעי אמה לר׳ אלעזר בר׳ שמעון) בחירת מודל. שכבותיו — אבן, ארז וזהב (מצודת דוד ו, כ; רלב״ג ו, כב) — בכפתור 'הצג את שכבות המזבח'. עשן הקטורת — עמוד ישר עד התקרה מעל שבע גחלים (יומא לח.; נג.) — מוצג תמיד (שמות ל, ז–ח); עוביו וצבעו — בחירת מודל.",
          refs: [["רש״י שמות כו, לה", { book: 3692, index: 1890 }], ["רמב״ם בית הבחירה ג, יז", RB(3, 17)], ["שמות ל, ב", V(2, 30, 2)], ["שמות ל, ז", V(2, 30, 7)], ["יומא לג:", P(107, "לג:")], ["מנחות צח:", P(131, "צח:")], ["יומא לח.", P(107, "לח.")]] },
        // 1.0.1-K (K.4): the parochet
        { t: "הפרוכת — נשרים לצד ההיכל ואריות לצד הדביר", view: "parochet",
          info: "'ארי מצד זה ונשר מצד זה' (רש״י שמות כו, א) — ואיזה צד לאיזו דמות אינו נאמר: הנשרים לצד ההיכל והאריות לצד הדביר, והאריות מהלכים מימין לשמאל, והנשרים ראשם לימין הצופה — בחירת מודל. האריג — תכלת, ארגמן, תולעת ושש — וסידור הדמויות בשורות, כציור הספר (חזרה כל ארבע אמות), וצורת הנשר והארי — בחירת מודל. הפרוכת תלויה בשתי קריאות פתח הדביר.",
          refs: [["שמות כו, א", V(2, 26, 1)], ["שמות כו, לא", V(2, 26, 31)], ["דברי הימים ב ג, יד", V(39, 3, 14)]] },
        // review Q2-3 / Q2-4: the Gemara's wording ("בנס הן עומדין", Abaye's challenge, "ומצודדים")
        { t: "גוף הכרובים — 'בנס הן עומדין' (בבא בתרא צט.)", view: "cherubim",
          info: "'עשר אמות מקצות כנפיו ועד קצות כנפיו' (מלכים א ו, כד) לשני הכרובים — עשרים אמה, כל רוחב הדביר (ו, כז). 'אמר רבנאי אמר שמואל: כרובים — בנס הן עומדין' (בבא בתרא צט.; ושם: 'מקום ארון וכרובים אינו מן המדה'; ובמגילה י:: 'מקום ארון אינו מן המדה... ארון גופיה היכא הוה קאי? אלא לאו שמע מינה בנס היה עומד'). ושם מקשה אביי: 'ודלמא בולטין כתרנגולין הוו קיימי' — גופם תחת כנפיהם (רשב״ם) — ועוד קושיות אחריה. רש״י (ו, כד): 'וגוף הכרובים אינו מן המדה ועומד בנס'; רש״י בדברי הימים (ג, יא): לפי הפשט גופן בולט מן הכנפיים 'כעוף זה שפורש כנפיו'; רד״ק (ו, כז): הגוף תחת הכנפיים ואין צורך בנס. מודל אינו יכול להראות נס: הגוף נבנה תחת הכנפיים, כקושיית אביי וכרד״ק, ושורש כל כנף בכתף, והכנפיים שוכבות במישור מאוזן אחד מתחת לראשים, וקצותיהן נוגעות בקירות וזו בזו — בחירת מודל.",
          refs: [["בבא בתרא צט.", P(124, "צט.")], ["מגילה י:", P(112, "י:")], ["רש״י מלכים א ו, כד", V(10, 6, 24)], ["רש״י דברי הימים ב ג, יא", V(39, 3, 11)], ["רד״ק מלכים א ו, כז", V(10, 6, 27)]] },
        // 1.0.1-K (K.4 / K.5 after the book p07L; the user: "את הכרובים עשית בצורה לא צנועה... לא מבואר שהיו להם ידיים")
        { t: "תבנית הכרובים ופניהם", view: "cherubim",
          info: "הפסוקים נותנים גובה עשר אמות, כנפיים של חמש, עמידה על הרגליים ו'פניהם לבית'; 'מעשה צעצעים' — תבנית ילדים (רש״י דברי הימים ב ג, י; 'כרביא', חגיגה יג:). תבנית הדמות במודל — כציור הספר: דמות גבוהה וחלקה, לבושה ארוכה עד הקרקע בקפלים, בלי ידיים (אין להן זכר בפסוקים), ראש קטן ופני ילד, וכנפיים חלקות, כל כנף גוף אחד, היוצאות מן הכתפיים ושוכבות במישור מאוזן אחד מתחת לראשים, סוכה על הארון ('ויסכו הכרבים על הארון ועל בדיו מלמעלה', מלכים א ח, ז) — בחירת מודל. פני הילד: ראש סגלגל עם סנטר ולחיים, אף ישר, עיניים שקדיות בעפעפיים, פה קטן סגור וקו שיער — הכל זהב, כציור הספר. כרובי הכפורת שעל הארון — כנפיהם עולות מן הכתפיים מעל ראשיהם ונמשכות בקשת עד אמצע הכפורת, וקצותיהן נוגעים זה בזה (הנגיעה — כציור הספר): 'פרשי כנפים למעלה' (שמות כה, כ), רש״י: 'שלא תעשה כנפיהם שוכבים אלא פרושים וגבוהים למעלה אצל ראשיהם, שיהא עשרה טפחים בחלל שבין הכנפים לכפרת'. צורת הכנף ותווי הפנים — בחירת מודל. פניהם: שלוש דעות בטבלת 'שיטות ומחלוקות' — רש״י (ג, יג): ראשם כפוף ופונה זה אל זה; רד״ק ומצודות: פניהם לבית, מזרחה; בבא בתרא צט.: 'ומצודדים פניהם כתלמיד הנפטר מרבו'. ברירת המחדל — רש״י.",
          refs: [["דברי הימים ב ג, י", V(39, 3, 10)], ["ג, יג", V(39, 3, 13)], ["חגיגה יג:", P(114, "יג:")], ["בבא בתרא צט.", P(124, "צט.")]] },
        { t: "פתח הדביר — שני ביאורי רש״י ל'מזוזות חמישית'", view: "devirDoor",
          info: "רש״י (מלכים א ו, לא) מביא שני ביאורים: 'ואני אומר, מזוזות חמישית, חמשה צלעות היו למזוזות, ולא היתה מרבעת, ואינו מדבר לא במפתן ולא במשקוף' (ברירת המחדל: מזוזות מחומשות, צלע אחת כעובי הכותל והקודקוד אל הפתח, ומעליהן משקוף זהב בחתך המזוזות, כציור הספר — רד״ק: 'האיל הוא הסף העליון... וכן האיל'; רלב״ג: 'שהאיל והוא הסף אשר על הפתח'; מלבי״ם: 'האיל ר״ל המשקוף' — בחירת מודל), ו'המפתן האחד והמזוזות מכאן ומכאן שתים הרי שלש, והמשקוף שעליו עשוי כשתים — כזה, כך שמעתי' (מפתן, שתי מזוזות מרובעות ומשקוף משתי קורות המוטות זו על זו כשער הטדי, מדות ב, ג — צורת הציור האבוד 'כזה' היא בחירת מודל). רוחב הפתח שש אמות וגובהו שתים עשרה — בחירת מודל (רחב ממרווח בדי הארון, רש״י ו, כג).",
          refs: [["רש״י מלכים א ו, לא", V(10, 6, 31)], ["מלכים א ו, לא", V(10, 6, 31)], ["מדות ב, ג", MI(2, 3)]] },
        { t: "אמה טרקסין — שלושה חלקים", view: "traksinTop",
          info: "אמה טרקסין (יומא נא:; רש״י מלכים א ו, טז) נבנתה במודל משלושה חלקים מלאים: שני עמודי הכותל שמצדי פתח הדביר (לכל ביאור של רש״י עמודים משלו, כי קצותיהם הולכים אחרי המזוזות) והחלק שמעל הפתח עד תקרת ההיכל, 18 אמות (מגובה 12 עד 30), ודוגמת הגילוף נמשכת ביניהם. כך החלק שמעל הפתח נראה בבירור משני הצדדים.",
          refs: [["מלכים א ו, טז", V(10, 6, 16)], ["יומא נא:", P(107, "נא:")], ["בבא בתרא ג.", P(124, "ג.")]] },
        // 1.0.1-K (K.6; review Q2-5): the model numbers of the readings of בית יער הלבנון, Ralbag credited only with what is his. 1.0.1-L (L.20, L.48; palace.md): three readings
        { t: "בית יער הלבנון — שלוש קריאות (רש״י / מלבי״ם ורלב״ג / מצודת דוד)", view: "forestUpper", layer: "palace",
          info: "מלכים א ז, ב–ו אינו אומר לאן פונים טורי העמודים, מהם 'הצלעות', מהם 'השקופים' ומהם 'עמודים ועב'. שלוש קריאות במודל, רש״י כברירת מחדל (טבלת 'שיטות ומחלוקות'). בחירות מודל בקריאת רש״י, כציור הספר: עשרים ותשעה עמודים בטור, שתיים על שתיים, צפופים; הקומה התחתונה עשר אמות והעליונה שמונה עשרה וחצי (עם הכרותות והרצפה — שלושים); ארבעים ושמונה קורות בכל קיר עליון ומקום הפתחים והחלונות; הנסרים הגדולים חמש אמות רוחבם (שבעים וחמש מתוך המאה); שתים עשרה שורות מרישין קטנים (רוחב 0.4, עובי 0.3) ושישה עשר נסרים דקים לכל חלל; כותלי אבן בקצוות, כבספר; אולם העמודים נמוך, שתים עשרה אמה, והאולם הגבוה שלפניו חמישים על חמש עשרה וגובהו ארבעים. בקריאת מלבי״ם ורלב״ג: עובי הכתלים שלוש, מקום החלונות והפתחים, לוח הגג מאבן, האולם השני (חמישים על עשר) ושורת העמודים שלפניו. בקריאת מצודת דוד: אולם העמודים בצד המזרחי, חמישה עשר עמודים בטור (עמוד תחת כל לוח), גובה העמודים עשרים ושש, מידות הכרותות והצלעות, מקום הפתחים (באמצע ועשרים ואחת אמה לכל צד, כדי שיעמדו שלושתם מול האולם), שתים עשרה חלונות בכל שורה, גובה האולם שש עשרה וחצי ושורת העמודים והעב (חמישה עמודים בגובה עשר). צורת המגינים והכלים ומקומם — כציור הספר ('להמחשה בלבד'), בחירת מודל.",
          refs: [["מלכים א ז, ב", V(10, 7, 2)], ["ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["ז, ו", V(10, 7, 6)], ["רש״י ז, ו", V(10, 7, 6)], ["מלבי״ם ז, ב", V(10, 7, 2)], ["רלב״ג ז, ג", V(10, 7, 3)], ["מצודת דוד ז, ב", V(10, 7, 2)]] },
        // 1.0.1-K review (palace-courts-5): what the button removes and what each reading then shows (60-palace.js: rashiBoards45 +
        // rashiThinBoards; metzudotBoards45 + the roof slab and its two fascia beams)
        { t: "הסרת הנסרים — כלי צפייה בלבד", view: "forestRoof", layer: "palace",
          info: "הכפתור 'הסר את הנסרים' שעל גג בית יער הלבנון הוא כלי צפייה בלבד, לא חלק מן הבניין (כמו 'פתח את הבית' ו'פתח את האולם'), והמבט עצמו אינו מסיר דבר. בקריאת רש״י (ברירת המחדל) הוא מסיר את 45 נסרי הסיפון ואת הנסרים הדקים (מלכים א ז, ג–ד עם רש״י), ונראים מתחתם המרישין הקטנים ושקופיהם (רש״י ז, ד) והקומה העליונה; הכרותות, 'מעמוד לעמוד' על העמודים התחתונים (רש״י ז, ב), נשארות מתחת לרצפת הקומה העליונה. בקריאת מלבי״ם ורלב״ג הוא מסיר את 45 הלוחות ואת גג האבן, ונראות הכרותות שעל העמודים — 'והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה' (רלב״ג ז, ג); בקריאת מצודת דוד — את 45 לוחות הארז, ונראות הצלעות והכרותות (מצודת דוד ז, ג). מה מוסר בכל קריאה — בחירת מודל.",
          refs: [["מלכים א ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["רש״י ז, ב", V(10, 7, 2)], ["רש״י ז, ו", V(10, 7, 6)], ["רלב״ג ז, ג", V(10, 7, 3)]] },
        // 1.0.1-K (K.6): the king's house, the garden, the throne
        { t: "בית המלך והגן — ריהוט ומידות", view: "kingsHouse", layer: "palace",
          info: "הפסוקים מזכירים את בית המלך (מלכים א ז, ח), את 'מאכל שלחנו ומושב עבדיו ומעמד משרתו' (י, ה) ואת כלי הזהב (י, כא); קהלת מזכיר גנות ופרדסים (ב, ה). בחירות מודל: בית המלך שמונים על שלושים, ארבעה חדרים — חדר אוכל, אולם כניסה בעמודי ארז, חדר משכב וחדר ישיבה — הריהוט, השטיחים והמנורות, הדלת הצפונית אל המעלות; הגן — שתי ערוגות ובהן שלושים ושישה עצי פרי, והדרך ביניהן — בחצר האחרת, בלי בריכה.",
          refs: [["מלכים א ז, ח", V(10, 7, 8)], ["י, ה", V(10, 10, 5)], ["י, כא", V(10, 10, 21)], ["קהלת ב, ה", V(32, 2, 5)]] },
        // 1.0.1-L (L.33; palace.md): the two courts and בית בת פרעה
        { t: "החצר האחרת ובית בת פרעה — מקומן ומידותיהן", view: "otherCourt", layer: "palace",
          info: "'וביתו אשר ישב שם חצר האחרת מבית לאולם' (מלכים א ז, ח); 'וחצר הגדולה סביב' (ז, יב). כציור הספר, בחירות מודל: בית המלך בחצר נפרדת, ובית בת פרעה בתוך חצר בית יער הלבנון; החצר הגדולה — חומתה הצפונית שלוש עשרה אמה וחצי מבית יער הלבנון ושער בה; דרך של אחת עשרה אמה בין שתי החצרות; החצר האחרת מאה וארבעים על שבעים ותשע וחצי, חומתה שתיים עוביה ושמונה גובהה, שני שערים של שמונה על שבע; מעקה נמוך בשולי המדרגה; בית בת פרעה שלושים על חמישים וגובהו עשרים, בחצר הגדולה, ממערב לאולם העמודים, ופתחו אל בית יער הלבנון (בספר: 'לא נתבאר ברש״י היכן מקום בית זה ביחס לבתים האחרים'). רלב״ג ומצודת דוד על ז, יב מקיפים בחצר הגדולה גם את בית המלך ('אשר היה מסבב כל בתי המלך') — לא נבנה כך.",
          refs: [["מלכים א ז, ח", V(10, 7, 8)], ["ז, יב", V(10, 7, 12)], ["מלכים א י, ה", V(10, 10, 5)], ["דברי הימים ב ח, יא", V(39, 8, 11)]] },
        // 1.0.1-L (L.57, L.78-L.81; palace-2.md): the throne's versions and what is only text
        { t: "כסא שלמה — הגרסאות", view: "throne", layer: "palace",
          info: "הפסוקים (מלכים א י, יח–כ; דברי הימים ב ט, יז–יט) נותנים כסא שן מצופה זהב, שש מעלות, ראש עגול, ידות, שני אריות אצל הידות ושנים עשר על המעלות; רש״י מפנה: 'וכל צורת הכסא מפרשת באגדת מגלת אסתר'. כל השאר מן המדרשים, והמודל מציג כל מדרש בגרסה משלו — השורה 'כסא שלמה — לפי איזה מדרש': הפסוקים ומפרשיהם (ברירת המחדל, בלי מנגנון ובלי עלייה); תרגום שני לאסתר; אסתר רבה עם פנים אחרים ואבא גוריון; ובית המדרש ב. בחירות מודל: מידות הכסא וצורת כל החיות (גופים פשוטים, כאמה אורכם), הכבש (שש על שלוש), סוכת הגפנים, מקום העמודים והתמרים, הארון ליד המושב, מקום התנין, צבעי האבנים, זמני העלייה והרעש; 'הארי של שמאל' — המזרחי (המלך פניו לדרום). בטקסט בלבד: בנות הים, שבעים ושניים האריות והנשרים של תרגום שני (בנויים שנים עשר ושנים עשר), האבות והחסידים שעל המנורה, פנים המנגנון, והכרוז שעל המעלות; והמלך עצמו אינו בנוי — מקומו בעלייה ניכר ממה שהכסא עושה. ועוד: 'ראש עגול' למצודת דוד ולאברבנאל — כיפה מלמעלה ('כעין כיפת כובע', 'שהיה מכסה מלמעלה') — לא נבנה. המנגנון: בן יהוידע על סנהדרין קו: — ראו 'עליית המלך לכסא'.",
          refs: TH_REFS.pesukim.concat(TH_REFS.estherRabbah.slice(0, 3), TH_REFS.targumSheni.slice(0, 1), TH_REFS.beitHamidrash.slice(0, 1)) },
        // 1.0.1-K (integration): the marble floor of the inner court
        { t: "רצפת השיש בחצר הכהנים", tg: [64, 6.1, -42], cam: [86, 14, -30],
          info: "שהרצפה הייתה שיש — מרש״י על 'ואבני שיש לרב' (דברי הימים א כט, ב): 'לעמודים ושלחנות ולרצפה'; הפסוק אינו אומר איזו רצפה. במודל: רצפת חצר הכהנים כולה, בין כתליה, לוחות שיש לבנים של שלוש על שלוש אמות, והרצועה שמתחת לחומה ומחוצה לה — אבן. מקום השיש וגודל הלוחות — בחירת מודל.",
          refs: [["דברי הימים א כט, ב", V(38, 29, 2)]] },
        // 1.0.1-K (K.6.5): לשכת הגזית - all Second-Temple sources
        { t: "לשכת הגזית — מקורות מבית שני", view: "lishkatHaGazit",
          info: "כל מקורות לשכת הגזית — יומא (יט.; כה.), הרמב״ם (בית הבחירה ה, יז), משנת מדות (ה, ד), משנת סנהדרין (א, ו; ד, ג) ומשנת תמיד — מדברים בבית שני; בספר מלכים אין זכר ללשכה (לבית ראשון: רש״י דברי הימים ב לד, כב; מהרש״א בבא בתרא צא:). לכן היא כולה בחירת מודל: בצפון כיומא (יט.) וכרמב״ם (בית הבחירה ה, יז) — ולא כמשנת מדות הנדפסת (ה, ד: 'שבדרום') — בחלקו המזרחי של החומה מול המזבח, בין השער הצפוני לים; לאורך החומה, כעשרים וארבע על תשע עשרה וגובהה עשרים ושתיים, כתלי גזית ('והיתה עשויה גזית לכבודם של הסנהדרין' — תוספות יום טוב), רצפתה כולה בגובה החצר ('שהלשכה היתה קרקעיתה שוה' — שם), וקומה מוגבהת על הגג ('כמין בסילקי גדולה'; רש״י: 'בית גבוה שעל עלייה'), שני פתחים — ומן הפתח החיצון שתים עשרה מעלות אל החצר הגדולה — ושבעים ואחד מושבים בחצי עיגול בצד החול, בארבע שורות; טבעת הפייס בחצי שבקודש; שלוש שורות התלמידים (סנהדרין ד, ד) ושני הסופרים לא נבנו.",
          refs: [["יומא יט.", P(107, "יט.")], ["רמב״ם בית הבחירה ה, יז", RB(5, 17)], ["מדות ה, ד", MI(5, 4)], ["יומא כה.", P(107, "כה.")], ["תוספות יום טוב מדות ה, ד", { book: 948, index: 208 }]] },
        // 1.0.1-L (L.68; courts-2.md FOR-UI §2): the slaughter place, a Second Temple completion
        { t: "בית המטבחים — הטבעות, השולחנות והננסין (מקורות מבית שני)", view: "slaughterPlace",
          info: "בספר מלכים אין זכר לטבעות, לשולחנות ולננסין; כולם במשנת מדות (ג, ה; ה, ב), תמיד (ג, ה; ד, א) ושקלים (ו, ד), ואת הטבעות תיקן יוחנן כהן גדול (סוטה מח.). נבנו בצפון המזבח, מולו — השלמה מבית שני: שמונה אמות מן המזבח, מקום הטבעות עשרים וארבע (שש שורות של ארבע, ארבע אמות בין טבעת לטבעת), ארבע אמות עד אמצע השולחנות — שמונה שולחנות שיש בשתי שורות מצפון לדרום — וארבע מהם לננסין: שמונה עמודי אבן נמוכים בשתי שורות של ארבעה, שבע אמות ביניהן, ועליהם חתיכות ארז מרובעות עם שלושה סדרי אונקליות ברזל (1.7, 2.6, 3.5 אמות מן הרצפה) בצד מזרח, צפון ודרום; ושמונה אמות מן השורה האחרונה עד כותל העזרה; פני לשכת הגזית בתוך שמונה האמות האלה, כציור הספר. בחירות מודל: צורת הטבעות (קשת נחושת, 1.1 על 0.55) ומרחקן לרוחב, גודל השולחנות (2 על 1, גובה 1.5 — כמידות שולחן לחם הפנים), גובה הננסין עם הארז (4: אבן 1.4 וארז 2.6) וגובהי האונקליות: אין לכך מספר במקורות, אלא 'הרבה פחות מקומת איש המפשיט' (יכין מדות ג, ה), והמספרים כבמודל בית המקדש השני. בבית שני היה מקום הננסין שתים עשרה אמה ומחצה (רמב״ם בית הבחירה ה, יג); כאן שבע, כי החצר קצרה.",
          refs: [["מדות ג, ה", MI(3, 5)], ["מדות ה, ב", MI(5, 2)], ["משנה שקלים ו, ד", MN(54, 6, 4)], ["משנה תמיד ד, א", MN(88, 4, 1)], ["סוטה מח.", P(119, "מח.")], ["רמב״ם בית הבחירה ה, יג", RB(5, 13)], ["צורת בית המקדש להתפארת ישראל", { book: 6029, index: 99 }]] },
        // 1.0.1-L (L.72; heichal-door.md): the two tables in the ulam
        { t: "שני השולחנות שבאולם — צורתם ומקומם", view: "ulamTables",
          info: "שני שולחנות פשוטים במידת שולחן לחם הפנים, שתי אמות על אמה וגובה אמה וחצי (שמות כה, כג): דף, ארבע רגליים ומסגרת — בחירת מודל. מקומם בתוך האולם, משני צדי המעבר לפני פתח ההיכל — 'אצל פתח ההיכל' (רש״י מנחות צט.). הצד — הכסף (למשנה: השיש) בצפון והזהב בדרום — בחירת מודל על פי 'המכניסים עומדים בצפון, ופניהם לדרום. המוציאין עומדים בדרום, ופניהם לצפון' (משנה מנחות יא, ז). מוסתרים כברירת מחדל; בוחרים בשורה 'שני השולחנות שבאולם'.",
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
        if (gA) gA[1].push({ t: "מה שבתוך הארון", view: "arkInside", info: UI_ARK_TXT + " הכפתור שעל הארון פותח אותו.", refs: UI_ARK_REFS });
      }
      // 1.0.1-L (Part 7, U3, the user: "בתפריט יש מלא כפתורים שנמצאים בלפחות שתי קטגוריות, החלט מה הכפתור הרלוונטי ביותר למקומו ומחק את המיקום המיותר"):
      // a button that went to the same place as another in a second group is gone: the kept button's card now carries its text and links,
      // and ctx.ui.places() still lists it (noButton), so the presentation keeps its slide; ctx.ui.placeButton(old title) is the kept button.
      const UI_MERGE = {
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
        "בית יער הלבנון — שלוש קריאות (רש״י / מלבי״ם ורלב״ג / מצודת דוד)": "בית יער הלבנון",
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
      // the grid's views that repeated a place: the place stays, in its group (ui_VIEWS keeps them for the presentation and the labels)
      const UI_VIEW_HOME = { newCourt: "החצר החיצונה", azarah: "חצר הכהנים", mizbeach: "מזבח הנחושת", yam: "הים של שלמה", mechonot: "עשר המכונות והכיורות",
        heichalSouth: "היציע והתאים", ulamInside: "האולם ובית החליפות", heichalDoor: "פתח ההיכל ודלתותיו", kodesh: "ההיכל", devirDoor: "פתח הדביר (מזוזות חמישית) — שני ביאורי רש״י",
        aliyot: "העליות (רש״י דה״י ג, ד)", palace: "החצר הגדולה",
        // 1.1.0 (the user: no doubles): the last three of the grid too - the grid keeps "מבט כללי" alone
        heichalFront: "הבית (בית ה׳)", yachinBoazFull: "יכין ובועז — מבט מפתח האולם", kodeshHakodashim: "קודש הקדשים — הדביר" };
      {
        const byT = {};
        for (const g of PLACES) for (const it of g[1]) if (!byT[it.t]) byT[it.t] = it;
        // the titles of 60-palace.js / 57-kelim.js may change: a merge whose title is not there is skipped (the button stays), and the check reports it
        for (const dt of Object.keys(UI_MERGE)) {
          const d = byT[dt], k = byT[UI_MERGE[dt]];
          if (!d || !k || d === k) { console.warn("[ui.js] merge skipped: " + dt); continue; }
          d.noButton = true;
          d.mergeInto = k;
          (k.more = k.more || []).push(d);
        }
        for (const key of Object.keys(UI_VIEW_HOME)) {
          const b = viewBtnByKey[key], k = byT[UI_VIEW_HOME[key]];
          if (!b || !k) continue;
          grid.removeChild(b);
          if (k.key !== key && k.view !== key) (k.more = k.more || []).push({ t: "", key });
          else if (k.key !== key && ui_INFO[key] && !k.key && String(k.info || "").indexOf(String(ui_INFO[key]).slice(0, 40)) < 0) (k.more = k.more || []).push({ t: "", key });
        }
      }
      const uiItemText = (it) => String((it.key ? ui_INFO[it.key] : it.info) || "");
      const uiItemRefs = (it) => (it.key ? ui_REFS[it.key] : it.refs) || [];
      // the card of a button that took over others: its text, then each one's under its title; the links without repeats
      const uiMergedCard = (it) => {
        const parts = [uiItemText(it)];
        const refs = uiItemRefs(it).slice(), seen = new Set(refs.map((r) => r[0]));
        for (const d of it.more) {
          const tx = uiItemText(d);
          if (tx && parts.indexOf(tx) < 0) parts.push((d.t ? d.t + ": " : "") + tx);
          for (const r of uiItemRefs(d)) if (!seen.has(r[0])) { seen.add(r[0]); refs.push(r); }
        }
        return { text: parts.filter(Boolean).join("\n\n"), refs };
      };
      // 1.0.1-L (the contract with 75-tour.js): every place button in the panel's order, for ctx.ui.places()
      const placeList = [];
      const viewKeySet = new Set(ui_VIEWS.map((v) => v.key));
      for (const [gname, items] of PLACES) {
        const det = document.createElement("details");
        det.className = "tm-pl";
        const sm = document.createElement("summary");
        sm.textContent = gname;
        det.appendChild(sm);
        const box = document.createElement("div");
        for (const it of items) {
          // 1.0.1-K: a place whose view no module registered (and that has no camera of its own) is left out - no dead button
          if (it.view && !resolveFp(it.view) && !(it.cam && it.tg)) continue;
          if (it.noButton) {   // 1.0.1-L (Part 7, U3): no button of its own; its slide stays
            if (!placeItemByT[it.t]) placeItemByT[it.t] = it;
            placeList.push({ title: it.t, group: gname, view: it.view && viewKeySet.has(it.view) ? it.view : null,
              fp: it.view && resolveFp(it.view) ? it.view : null, info: it.key ? ui_INFO[it.key] || "" : it.info || "",
              refs: it.key ? ui_REFS[it.key] || [] : it.refs || [], layer: it.layer || null, feature: it.feature ? it.feature.key : null, item: it });
            continue;
          }
          const pb = document.createElement("button");
          pb.type = "button";
          pb.textContent = ui_stripSrc(it.t);   // 1.1.0: no sources in the tree
          if (pb.textContent !== it.t) pb.title = it.t;
          pb.addEventListener("click", () => {
            try {
              if (it.layer) setLayer(it.layer, true);
              if (typeof it.action === "function") {
                try {
                  it.action();
                } catch (_) {
                }
              }
              // 1.0.1-L (L.27): the place's model feature on, with its 15 seconds (an animation with its own end runs to it)
              if (it.feature) {
                try {
                  autoOff.run(it.feature, pb);
                } catch (_) {
                }
              }
              const fp0 = it.view ? resolveFp(it.view) : null;
              // tg / cam may be functions resolved at click time (e.g. a place that follows the model's numbers)
              const pos = fp0 ? fp0.pos : typeof it.cam === "function" ? it.cam() : it.cam;
              const tgt = fp0 ? fp0.target : typeof it.tg === "function" ? it.tg() : it.tg;
              // 1.0.1-K: no automatic removal - a place only flies (and, when it is one, shows its own model feature)
              if (pos && tgt) fly(pos, tgt);
            } catch (_) {
            }
            // 1.0.1-L (L.34): the explanation in the floating card beside the panel, at this button's height; the panel's lists stay where they are
            if (it.more) setInfo("__place", uiMergedCard(it), { title: it.t, anchor: pb, side: it.cardSide });   // 1.0.1-L (Part 7, U3)
            else if (it.key) setInfo(it.key, null, { title: it.t, anchor: pb, side: it.cardSide });
            else setInfo("__place", { text: it.info || "", refs: it.refs || [] }, { title: it.t, anchor: pb, side: it.cardSide });
            hidePanelOnPhone();
            for (const o of btns) o.classList.remove("on");
            for (const o of placeBtns) o.classList.remove("on");
            pb.classList.add("on");
          });
          box.appendChild(pb);
          placeBtns.push(pb);
          if (!placeBtnByT[it.t]) { placeBtnByT[it.t] = pb; placeItemByT[it.t] = it; }   // 1.0.1-J: for the presentation (ctx.ui.placeButton)
          placeList.push({ title: it.t, group: gname, view: it.view && viewKeySet.has(it.view) ? it.view : null,
            fp: it.view && resolveFp(it.view) ? it.view : null, info: it.key ? ui_INFO[it.key] || "" : it.info || "",
            refs: it.key ? ui_REFS[it.key] || [] : it.refs || [], layer: it.layer || null, feature: it.feature ? it.feature.key : null, item: it });
        }
        det.appendChild(box);
        if (box.children.length) panel.appendChild(det);   // 1.1.0: a group whose buttons all merged elsewhere is not shown
      }
      for (const dt of Object.keys(UI_MERGE)) {   // 1.0.1-L (Part 7, U3): the old title leads to the kept button
        const d = placeItemByT[dt];
        if (d && d.mergeInto && placeBtnByT[d.mergeInto.t]) placeBtnByT[dt] = placeBtnByT[d.mergeInto.t];
      }
      // ===== 1.0.1-H: labels -> sources (the user: "הוסף מקורות להכל"): a click on a label in the model shows the explanation and the source
      // links of the matching view or place; the cursor turns into a hand over such a label. A label object may also carry
      // its own {info, refs}. LABEL_MAP ties the label texts of the modules (20-mount ... 60-palace) to a view key {v}, a place title {p}
      // (PLACES / EXTRAS above) or its own text {info, refs}; a function entry chooses by the label's position or layer (texts shared).
      // 1.0.1-K (K.9b item 7, the addendum C; the user on "העמוד": "ההסבר הזה ייכנס גם ללוח — ליד העמוד"): the click opens a small
      // card NEXT TO THE LABEL on the model - the explanation and its source links - that follows the camera and closes with its ✕ or a click
      // elsewhere (nothing is allocated per frame). 1.0.1-L (L.34): one card at a time - it and the panel's floating explanation card close
      // each other; the panel's #tm-info box is gone. =====
      // the label's card (built before the label handlers; closeCard is also called by the views and the places through setInfo)
      const card = document.createElement("div");
      card.id = "tm-card";
      card.setAttribute("role", "dialog");
      const cardHead = document.createElement("div");
      cardHead.className = "h";
      const cardTitle = document.createElement("span");
      cardTitle.className = "tt";
      const cardX = document.createElement("button");
      cardX.type = "button";
      cardX.className = "x";
      cardX.textContent = "✕";
      cardX.title = "סגור את ההסבר (Esc)";
      cardHead.appendChild(cardTitle);
      cardHead.appendChild(cardX);
      const cardBody = document.createElement("div");
      cardBody.className = "b";
      const cardRefs = document.createElement("div");
      cardRefs.className = "r";
      const cardOps = document.createElement("div");   // 1.0.2 (item 4): the label's opinions (renderChips above)
      cardOps.className = "o";
      cardOps.style.display = "none";
      card.appendChild(cardHead);
      card.appendChild(cardBody);
      card.appendChild(cardRefs);
      card.appendChild(cardOps);
      document.body.appendChild(card);
      let cardOpsIds = null;
      let cardSpr = null, cardW = 300, cardH = 160, cardShown = false, cardX0 = -1, cardY0 = -1, cardSide = 1;   // side: 1 right of the label, -1 left
      const cardV = new Vector3(), cardC = new Vector3();
      const closeCard = () => {
        cardSpr = null;
        cardShown = false;
        card.style.display = "none";
      };
      closeLabelCard = closeCard;   // 1.0.1-L (L.34): the panel's explanation card closes this one
      cardX.addEventListener("click", (e) => {
        e.stopPropagation();
        closeCard();
      });
      // the card's place: beside the label's projected point (to its left on screen when there is no room on its right), inside the window
      // and left of the side panel; hidden (but kept) while the label is behind the camera, out of the view or hidden itself
      const placeCard = (force) => {
        const spr = cardSpr;
        if (!spr) return;
        let ok = !!spr.parent && spr.visible && labelGroup.visible;
        let x = 0, y = 0, half = 0;
        if (ok) {
          cardC.copy(spr.position).applyMatrix4(ctx.camera.matrixWorldInverse);
          ok = cardC.z < -0.5;
          if (ok) {
            cardV.copy(spr.position).project(ctx.camera);
            ok = Math.abs(cardV.x) < 1.05 && Math.abs(cardV.y) < 1.05;
            const W = window.innerWidth, H = window.innerHeight;
            x = (cardV.x * 0.5 + 0.5) * W;
            y = (-cardV.y * 0.5 + 0.5) * H;
            const pxPerAmah = H / (2 * -cardC.z * Math.tan((ctx.camera.fov || 50) * Math.PI / 360));
            half = Math.min(W * 0.25, spr.scale.x * pxPerAmah * 0.5);
          }
        }
        if (!ok) {
          if (cardShown) { cardShown = false; card.style.display = "none"; }
          return;
        }
        if (!cardShown) { cardShown = true; card.style.display = "flex"; }
        const W = window.innerWidth, H = window.innerHeight;
        const right = panel.style.display !== "none" && !isPhone(W) ? W - 242 : W - 8;
        // beside one end of the label; it keeps its side while that side has room (no jumping from side to side as the view turns)
        const leftR = x + half + 10, leftL = x - half - 10 - cardW;
        const fitsR = leftR + cardW <= right, fitsL = leftL >= 8;
        if (cardSide > 0 ? !fitsR && fitsL : !fitsL && fitsR) cardSide = -cardSide;
        let left = cardSide > 0 ? leftR : leftL;
        left = Math.max(8, Math.min(right - cardW, left));
        let top = y - cardH * 0.35;
        top = Math.max(ui_barH() + 8, Math.min(H - cardH - 60, top));   // 1.0.2: never over the fixed top bar (#tm-card is above it, z 29 > 20)
        if (force || Math.abs(left - cardX0) > 0.5 || Math.abs(top - cardY0) > 0.5) {
          cardX0 = left;
          cardY0 = top;
          card.style.left = left.toFixed(0) + "px";
          card.style.top = top.toFixed(0) + "px";
        }
      };
      const openCard = (spr, t) => {
        xcardClose();   // 1.0.1-L (L.34): one card at a time
        cardSpr = spr;
        cardSide = 1;
        ui_fillSrc(cardTitle, String((spr.userData.label && spr.userData.label.text) || "") + (t.title ? " — " + t.title : ""));   // a bare measure gets its meaning
        const rs = t.key ? ui_REFS[t.key] || [] : t.refs || [];
        ui_fillSrc(cardBody, t.key ? ui_INFO[t.key] || "" : t.text || "", srcLinker(rs));   // 1.0.2 (A): the brackets open their sources
        cardRefs.textContent = "";
        if (rs.length) {
          cardRefs.appendChild(document.createTextNode("למקור: "));
          refLinks(cardRefs, rs);
        }
        cardOpsIds = Array.isArray(t.ops) && t.ops.length ? t.ops : null;   // 1.0.2 (item 4)
        renderChips(cardOps, cardOpsIds);
        card.style.display = "flex";   // a column: the title, the text (scrolls), the source links (always seen)
        cardShown = true;
        card.scrollTop = 0;
        cardBody.scrollTop = 0;
        cardW = card.offsetWidth || 300;   // measured once per opening
        cardH = card.offsetHeight || 160;
        placeCard(true);
      };
      ctx.animated.push(() => { if (cardSpr) placeCard(false); });
      // 1.0.2 (item 4): a row marked anywhere (the table, a chip, the presentation) redraws the open cards' chips; the label's card is measured again
      chipsRefresh = () => {
        if (xOpen && xOpsIds) renderChips(xOps, xOpsIds, xChipPicked);
        if (cardSpr && cardOpsIds) {
          renderChips(cardOps, cardOpsIds);
          cardW = card.offsetWidth || cardW;
          cardH = card.offsetHeight || cardH;
          placeCard(true);
        }
      };
      window.addEventListener("resize", () => {
        if (!cardSpr) return;
        cardW = card.offsetWidth || cardW;
        cardH = card.offsetHeight || cardH;
        placeCard(true);
      });
      // a click anywhere else on the page closes the card (the canvas decides in its own pointerup below: a label opens another card)
      document.addEventListener("click", (e) => {
        if (!cardSpr) return;
        const t = e.target;
        if (t === ctx.renderer.domElement || (t && card.contains && card.contains(t))) return;
        closeCard();
      }, true);
      {
        const placeByT = {};
        for (const [, items] of PLACES) for (const it of items) if (it && it.t && !placeByT[it.t]) placeByT[it.t] = it;
        const viewKeys = new Set(ui_VIEWS.map((v) => v.key));
        // 1.0.1-K: the explanations of the labels that are parts of something (the yatzia section's measures, the layers of the wall, of the
        // floor and of the golden altar, the parts of the base, the rooms of the king's house) - each its own text and sources
        const DIM = {
          wall: { title: "עובי כותל הבית", info: "כותל הבית בחתך: שבע אמות עוביו בקומה התחתונה של התאים, שש בתיכונה, חמש בעליונה וארבע מעל גג התאים. רש״י (מלכים א ו, ו): 'וכשעולה כתל ההיכל חמש אמות, גורע את עביו, וכנס בו אמה לפנים, והניח על אותה כניסה ראשי קורות גג עלית התא, שהיא קרקעית לאמצעית, וכשעולה עשר, כנס אמה'; מצודת דוד: 'וכן פחתו אמה בכלות חמשה עשר אמות, להניח על כניסת האמה קורות תקרת השלישים'. כך מצייר הספר; במשנת מדות (ד, ז), בבית שני — שש.",
            refs: [["מלכים א ו, ו", V(10, 6, 6)], ["רש״י ו, ו", V(10, 6, 6)], ["מדות ד, ז", MI(4, 7)]] },
          width: { title: "רוחב התא", info: "רוחב התאים: 'היציע התחתנה חמש באמה רחבה והתיכנה שש באמה רחבה והשלישית שבע באמה רחבה כי מגרעות נתן לבית סביב חוצה לבלתי אחז בקירות הבית' (מלכים א ו, ו) — כותל הבית נכנס אמה בכל קומה, וכותל התא החיצוני עולה ישר, ולכן כל קומה רחבה מזו שמתחתיה אמה.",
            refs: [["מלכים א ו, ו", V(10, 6, 6)], ["רש״י ו, ו", V(10, 6, 6)]] },
          height: { title: "גובה הקומה", info: "גובה כל קומה: 'ויבן את היציע על כל הבית חמש אמות קומתו' (מלכים א ו, י) — רש״י: 'הרי גבהן חמש עשרה אמות, לבד עבי התקרה'. בין קומה לקומה קורות ארז, אמה עובין (בחירת מודל).",
            refs: [["מלכים א ו, י", V(10, 6, 10)], ["רש״י ו, י", V(10, 6, 10)]] },
          ta: { info: "כותל התאים החיצוני — חמש אמות: 'וכתל התא חמש' (משנת מדות ד, ז, בבית שני; כציור הספר — בחירת מודל לבית ראשון). עליו מונחים ראשי קורות הגג, ורצועתם נראית בראש הכותל מבחוץ.",
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
          "העמוד (מלכים ב יא, יד)": { p: "העמוד — מקום המלך" },
          "ארון הנדבות (דברי הימים ב כד, ח)": { p: "ארון הנדבות שבשער" },
          "הר הבית": { p: "הר הבית והחצר הגדולה" },   // 1.0.1-K (K.9b item 1): the view left the grid; the place stays
          "החצר הגדולה": (l) => (l.layer === "palace" || (l.layers && l.layers.indexOf("palace") >= 0) ? { p: "החצר הגדולה" } : { p: "הר הבית והחצר הגדולה" }),
          "החצר החיצונה": { v: "newCourt" },
          "השער המזרחי של החצר החיצונה": { v: "newCourt" },
          "השער המזרחי": (l) => ((l.x || 0) < 200 ? { p: "שערי חצר הכהנים" } : { p: "השער המזרחי" }),   // the inner court's east gate (x 99.5) / the great court's (x 362): the place
          "השער הצפוני": { p: "שערי החצר הגדולה ומעלותיהן" },
          "השער הדרומי": { p: "שערי החצר הגדולה ומעלותיהן" },
          "השער המערבי": { p: "שערי החצר הגדולה ומעלותיהן" },
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
          "הכיור (ז, לח)": { info: "'ויעש עשרה כירות נחשת ארבעים בת יכיל הכיור האחד ארבע באמה הכיור האחד כיור אחד על המכונה האחת לעשר המכנות' (מלכים א ז, לח). מצודת דוד: 'הכיור האחד — גבהו של הכיור', ומלבי״ם: ארבע אמות בגובה, ורוחבו 'אמה וחצי ורביע'. הכיור עומד בכן (כציור הספר); רלב״ג מפרש את הארבע כרוחבו — לא נבנה.",
            refs: [["מלכים א ז, לח", V(10, 7, 38)]] },
          "הכן (ז, כט; ז, לא)": { info: "הכן: 'ופיהו מבית לכתרת ומעלה באמה' (מלכים א ז, לא) — רש״י: 'פיהו של כן, יוצא מתוך פיהו של כותרת, ועולה למעלה אמה גבה'. שוליו העגולים תחובים בפי הכותרת, ועליונו מרובע, והכיור יושב בו.",
            refs: [["מלכים א ז, לא", V(10, 7, 31)], ["ז, כט", V(10, 7, 29)]] },
          "פי הכותרת (ז, לא)": { info: "'ופיה עגל מעשה כן אמה וחצי האמה וגם על פיה מקלעות' (מלכים א ז, לא) — רש״י: באמצע הכותרת 'נקב עגל אמה וחצי אמה רחב בעגול, וסביב אותו נקב כמין הקף מחצה, חצי אמה גבה', ו'מקלעות — צורת פרחים'; 'ובראש המכונה חצי האמה קומה עגל סביב' (ז, לה).",
            refs: [["מלכים א ז, לא", V(10, 7, 31)], ["ז, לה", V(10, 7, 35)]] },
          "הכתפות (ז, ל; ז, לד)": { info: "'וארבע כתפות אל ארבע פנות המכנה האחת מן המכנה כתפיה' (מלכים א ז, לד); 'כתפת להם מתחת לכיר הכתפות יצקות' (ז, ל) — רש״י: 'בולטות למעלה מן הנסרים בזויות הכן. ותחת הכיור היושב על הכן, היו הכתפות יצוקות'. במודל, כציור הספר, הן עולות מפינות המכונה עד תחתית הכן.",
            refs: [["מלכים א ז, ל", V(10, 7, 30)], ["ז, לד", V(10, 7, 34)]] },
          "הכותרת — גג המכונה (רש״י ז, לא)": { info: "רש״י (מלכים א ז, לא): 'והכותרת היא גג המכונה עשוי כמין כובע משפע מכל צדדיו, ובאמצע נקבעת נקב עגל'. גוף המכונה עם גגה — 'האמה גבה היתה מרבעת' (רש״י ז, כז).",
            refs: [["מלכים א ז, לא", V(10, 7, 31)], ["ז, כז", V(10, 7, 27)]] },
          "המסגרות והשלבים (ז, כח–כט)": { info: "'וזה מעשה המכונה מסגרת להם ומסגרת בין השלבים' (מלכים א ז, כח), 'ועל המסגרות אשר בין השלבים אריות בקר וכרובים' (ז, כט); 'וסרני נחשת' (ז, ל) — רש״י: 'הם הנסרים העליונים מול המסגרות'. שלוש מסגרות בין השלבים בכל צד, כביאור הגר״א; הציורים דקים ושטוחים (בחירת מודל; על הליות רש״י ז, כט: 'ואין בולטין בעביו, ולא חקוקים בשקוע', ועל המסגרות התחתונות והנסרים רש״י ז, לו: 'פתח וחקק') — ארי ובקר למעלה, כרובים וליות מתחתם; ועל המסגרת התחתונה ועל הנסרים כרובים, אריות ותמרות (ז, לו) — כציור הספר.",
            refs: [["מלכים א ז, כח", V(10, 7, 28)], ["ז, כט", V(10, 7, 29)], ["ז, ל", V(10, 7, 30)], ["ז, לו", V(10, 7, 36)]] },
          // 1.0.1-K review (vessels-4): the lying wheel is the book's (model choice), not בעל צורת הבית's; the ידות per Rashi = the axle
          "אופן בתוך אופן (רש״י ז, לג)": { info: "'ומעשה האופנים כמעשה אופן המרכבה ידותם וגביהם וחשקיהם וחשריהם הכל מוצק' (מלכים א ז, לג) — רש״י: 'תרגם יונתן: כעובד גלגלי מרכבה, אופן בתוך האופן שתי וערב'; 'וקומת האופן האחד אמה וחצי האמה' (ז, לב). הידות — לרש״י הציר: 'הוא עץ התחוב באופנים, וקורין איישי״ל (ציר של גלגל)' (ז, לב); לבעל צורת הבית (אחרי רש״י ז, לז) — מקלות התחובים כל אחד בשני אופנים, ממזרח למערב ומצפון לדרום, 'ואלו המקלות קראם הכתוב ידות', כדי להוליך את המכונות לכל רוח 'מבלי שיצטרך להפכם אנה ואנה'. במודל, כציור הספר (עמ' לז) ובביאורו לרש״י: בכל אופן גלגל קטן שוכב המסובב את האופן הגדול העומד לצדדים, סביב מקל היורד מן המכונה, והאופן הגדול הולך קדימה ואחור — בחירת מודל.",
            refs: [["מלכים א ז, לב (ורש״י שם)", V(10, 7, 32)], ["ז, לג", V(10, 7, 33)], ["רש״י ז, לז (בעל צורת הבית)", V(10, 7, 37)]] },
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
          "אבן": { info: "לב מזבח הזהב — אבן: מצודת דוד (מלכים א ו, כ): 'ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב, והיה אם כן מעשה המזבח דומה למעשה קירות הבית'; רד״ק: 'ואפשר שהיה מאבנים'.",
            refs: [["מלכים א ו, כ", V(10, 6, 20)]] },
          "ארז": { info: "'ויצף מזבח ארז' (מלכים א ו, כ); התרגום: 'נסרין דארזא'; רלב״ג (ו, כב): 'צפה מזבח הקטרת באבנים וצפהו עצי ארז כמו שעשה בקירות הבית'.",
            refs: [["מלכים א ו, כ", V(10, 6, 20)], ["ו, כב", V(10, 6, 22)]] },
          "זהב": { info: "'וכל המזבח אשר לדביר צפה זהב' (מלכים א ו, כב) — מצודת דוד: 'בכל ששת השטחים'; ולכן נקרא 'מזבח הזהב' (ז, מח).",
            refs: [["מלכים א ו, כב", V(10, 6, 22)], ["ז, מח", V(10, 7, 48)]] },
          // the layers of the wall and the floor (55-interior.js, layer "wallLayers")
          "אבן (ו, ז)": { info: "'והבית בהבנתו אבן שלמה מסע נבנה' (מלכים א ו, ז) — קירות הבית ורצפתו אבן; מבפנים היא מכוסה כולה: 'הכל ארז אין אבן נראה' (ו, יח).",
            refs: [["מלכים א ו, ז", V(10, 6, 7)], ["ו, יח", V(10, 6, 18)]] },
          "ארז מגולף (ו, טו; ו, יח)": { info: "'ויבן את קירות הבית מביתה בצלעות ארזים מקרקע הבית עד קירות הספן' (מלכים א ו, טו), 'וארז אל הבית פנימה מקלעת פקעים ופטורי צצים' (ו, יח). רש״י (ו, טו): 'קירות ארז אצל קיר האבן, כדי לטוח עליו זהב... ואי אפשר לטוח זהב על גבי האבנים, כי אם בעצים ובמסמרות'. הגילוף בארז, והזהב שוקע בו.",
            refs: [["מלכים א ו, טו", V(10, 6, 15)], ["ו, יח", V(10, 6, 18)]] },
          "זהב (ו, כא–כב)": { info: "'ויצף שלמה את הבית מפנימה זהב סגור' (מלכים א ו, כא), 'ואת כל הבית צפה זהב עד תם כל הבית' (ו, כב). רש״י (ו, לב): 'להיות שוקע בו במקום החקק, ובולט על הבליטה' — הזהב מרודד על הגילוף.",
            refs: [["מלכים א ו, כא", V(10, 6, 21)], ["ו, כב", V(10, 6, 22)], ["ו, לב", V(10, 6, 32)]] },
          "ברושים (ו, טו)": { info: "'ויצף את קרקע הבית בצלעות ברושים' (מלכים א ו, טו) — לוחות ברוש על רצפת האבן, ועליהם הזהב (ו, ל).",
            refs: [["מלכים א ו, טו", V(10, 6, 15)], ["ו, ל", V(10, 6, 30)]] },
          "זהב (ו, ל)": { info: "'ואת קרקע הבית צפה זהב לפנימה ולחיצון' (מלכים א ו, ל) — רש״י: 'לבית הכפרת ולהיכל'; מצודת דוד: 'על רצפת צלעות הברושים'.",
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
          "בית המלך — חדר המשכב (שיר השירים ג, ז)": { info: "'הנה מטתו שלשלמה ששים גברים סביב לה מגברי ישראל' (שיר השירים ג, ז); בית המלך — 'דירה גמורה, לאכל שם ולשכב שם' (רש״י מלכים א ז, ח). חדר המשכב, מקומו וריהוטו — בחירת מודל.",
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
          ["האולם לשיטת הרמב", { info: "לשיטת הרמב״ם (הלכות בית הבחירה ד) כפי שביארו הכסף משנה ותוספות יום טוב (מדות ד, ז): בליטת האולם נמשכת בצפון ובדרום לכל אורך הבית, 'עד מקצוע המערבית', ולא רק בחזית; בצד מערב אין בליטה (הלכות בית הבחירה ד, ד). ברירת המחדל במודל היא כרש״י (יומא לו.) — הבליטה בחזית בלבד, 'בית החליפות'. בוחרים בטבלת 'שיטות ומחלוקות'.",
            refs: [["רמב״ם בית הבחירה פרק ד", RB(4, 0)], ["מדות ד, ז", MI(4, 7)], ["יומא לו.", P(107, "לו.")]] }],
          ["המעלות מבית המלך", { p: "המעלות מבית המלך אל בית ה׳" }],
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
          ["שבעים כסאות הזקנים", { p: "כסא שלמה" }]
        ];
        // the target of a label: {key} for setInfo(key) or {text, refs}; null when the label has no explanation
        const labelTarget = (l) => {
          if (!l || !l.text) return null;
          if (l.info) return { text: l.info, refs: l.refs || [] };
          // 1.0.2 (item 7): the label "השיתין" of 40-altar.js opens ctx.shared.shitin's text (nothing when the contract is missing)
          const shi = ctx.shared.shitin;
          if (/^השיתין/.test(l.text) && shi && shi.info) return { text: shi.info, refs: Array.isArray(shi.refs) ? shi.refs : [] };
          // 1.0.1-L (L.88; part5-kelim.md FOR-UI 3): a vessel's label opens that vessel; the exhibit's titles open the exhibit
          if (l.kelimKey && ctx.shared.kelim) {
            const K = ctx.shared.kelim, itK = K.items.find((x) => x.key === l.kelimKey);
            return itK ? { text: itK.text, refs: itK.refs || [], title: itK.name + " — " + itK.verse } : { text: K.info, refs: K.refs || [], title: K.title || "" };
          }
          let m = Object.prototype.hasOwnProperty.call(LABEL_MAP, l.text) ? LABEL_MAP[l.text] : null;
          // 1.0.1-L (L.81): a label of ONE version of the throne (its layers) opens that version's text and sources
          if (!m && Array.isArray(l.layers)) {
            for (const lay of l.layers) {
              const k = lay === "thronePesukim" ? "pesukim" : lay === "throneTargumSheni" ? "targumSheni" : lay === "throneEstherRabbah" ? "estherRabbah" : lay === "throneBeitHamidrash" ? "beitHamidrash" : null;
              if (k && PN.throneVersions && PN.throneVersions[k]) { m = { info: PN.throneVersions[k], refs: TH_REFS[k] }; break; }
            }
          }
          if (typeof m === "function") m = m(l);
          if (!m) for (const [pre, t] of LABEL_PREFIX) if (l.text.indexOf(pre) === 0) { m = t; break; }
          if (!m) {
            const v = ui_VIEWS.find((vv) => vv.label === l.text);
            if (v) m = { v: v.key };
            else if (placeByT[l.text]) m = { p: l.text };
          }
          if (!m) return null;
          if (m.info) return { text: m.info, refs: m.refs || [], title: m.title || "", subj: { view: m.v || null, title: m.p || null } };
          if (m.v && viewKeys.has(m.v)) return { key: m.v };
          const it = m.p && placeByT[m.p];
          if (!it) return null;
          if (it.info) return { text: it.info, refs: it.refs || [], subj: { title: m.p } };
          if (it.key) return { key: it.key, subj: { title: m.p } };
          if (it.view && viewKeys.has(it.view)) return { key: it.view, subj: { title: m.p } };
          return null;
        };
        // 1.0.2 (item 4): the label's opinions - its view or place (as the panel's card), its own text and its layers (the throne's
        // versions, the forest readings)
        const labelOps = (l, t) => {
          const s = (t && t.subj) || {};
          const lays = Array.isArray(l.layers) ? l.layers : l.layer ? [l.layer] : [];
          return opsFor({ view: (t && t.key) || s.view || null, title: s.title || null, label: l.text, layers: lays });
        };
        for (const spr of labelGroup.children) {
          const t = labelTarget(spr.userData.label);
          if (t) t.ops = labelOps(spr.userData.label, t);
          spr.userData.target = t;
        }
        const missing = labelGroup.children.filter((s) => !s.userData.target).map((s) => s.userData.label && s.userData.label.text);
        if (missing.length) console.warn("[ui.js] labels without sources:", missing.join(" | "));
        const el = ctx.renderer.domElement;
        const lRay = new Raycaster(), lNdc = new Vector2();
        const visibleLabels = () => (labelGroup.visible ? labelGroup.children.filter((s) => s.visible && s.userData.target) : []);
        const pickLabel = (ev, occlusion) => {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return null;
          lNdc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
          lRay.setFromCamera(lNdc, ctx.camera);   // sets lRay.camera, which sprites need
          const hits = lRay.intersectObjects(visibleLabels(), false);
          if (!hits.length) return null;
          const h = hits[0];
          if (occlusion) {
            // 1.0.1-K (review UI-H2-5): the Holy of Holies' cloud hides the labels inside it while it is on (its puffs carry noPick)
            if (cloud.visible && cloudMat.opacity > 0.5) {
              const ch = lRay.intersectObjects(cloud.children, false);
              if (ch.length && ch[0].distance < h.distance - 1) return null;
            }
            // a label behind a wall is hidden by the depth test: ignore it when a visible, opaque mesh is clearly nearer
            for (const m of lRay.intersectObjects(ctx.root.children, true)) {
              const o = m.object;
              if (o.isSprite || o.isLine || o.isPoints || o.userData.noPick) continue;
              let vis = true;
              for (let p = o; p; p = p.parent) if (!p.visible) { vis = false; break; }
              if (!vis) continue;
              const mt = o.material;
              if (mt && !Array.isArray(mt) && (mt.opacity < 0.5 || mt.visible === false)) continue;
              if (m.distance < h.distance - 1) return null;
              break;
            }
          }
          return h.object;
        };
        let lDown = null, lastHover = 0;
        el.addEventListener("pointerdown", (e) => {
          lDown = e.__tmSynthetic ? null : { x: e.clientX, y: e.clientY, t: performance.now() };
        });
        el.addEventListener("pointerup", (e) => {
          if (e.__tmSynthetic || !lDown || mOn) { lDown = null; return; }
          const d = Math.hypot(e.clientX - lDown.x, e.clientY - lDown.y), dt = performance.now() - lDown.t;
          lDown = null;
          if (d > 6 || dt > 600) return;
          let spr = null;
          try { spr = pickLabel(e, true); } catch (_) { spr = null; }
          if (!spr) {
            closeCard();   // a click on the model, not on a label
            return;
          }
          // 1.0.1-L (L.34): the label's own card is the explanation (the panel's info box is gone, and the panel stays as the user left it)
          openCard(spr, spr.userData.target);
        });
        el.addEventListener("pointermove", (e) => {
          if (e.buttons || mOn) return;
          const now = performance.now();
          if (now - lastHover < 120) return;
          lastHover = now;
          let spr = null;
          // 1.0.1-K (review UI-H2-4): the hand only over a label that a click would open (the same occlusion test; it runs only when the
          // pointer is on a label at all)
          try { spr = pickLabel(e, true); } catch (_) { spr = null; }
          el.style.cursor = spr ? "pointer" : "";
        });
      }

      // ===== 1.0.1-H: the opinions table (the user: "את השיטות תנסה להכניס לתוך מסגרת מסודרת יצר בלבול לגמרי") =====
      // Every dispute of the model in ONE place, one row each: the subject, its sources (links), and the readings as buttons. The
      // places accordion no longer carries opinion buttons (one place = one button); the layers "העליות" and "האולם לשיטת הרמב״ם" are
      // rows here too (a view that needs a layer still switches it on, and the row follows through layerMarks).
      // 1.1.0 (the user: no doubles): the table is a closed group like the places' groups - every row is also a chip on its subject's
      // card, so the table is the one place to see ALL the readings together, and it does not sit open under the tree
      const secOps = document.createElement("details");
      secOps.className = "tm-pl tm-ops-det";
      const opsSum = document.createElement("summary");
      opsSum.textContent = "שיטות ומחלוקות — בחירת הקריאה";
      secOps.appendChild(opsSum);
      const opsNote = document.createElement("div");
      opsNote.className = "s";
      opsNote.textContent = "בכל שורה: הנושא והדעות. הלחיצה מחליפה את המודל, מסבירה את הדעה ועפה אליה. המקורות — בכרטיס ההסבר.";
      secOps.appendChild(opsNote);
      secOps.appendChild(opsBox);
      panel.appendChild(secOps);
      {
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
          cap: "גובה הבית — שלושים אמה, או מאה ועשרים עם העליות",
          refs: [["מלכים א ו, ב", V(10, 6, 2)], ["דברי הימים ב ג, ד", V(39, 3, 4)], ["רש״י שם", V(39, 3, 4)], ["בבא בתרא ג.", P(124, "ג.")]],
          options: [
            ["base", "שלושים אמה (מלכים א ו, ב)", "'ושלשים אמה קומתו' (מלכים א ו, ב) — גובה הבית שלושים אמה; בבא בתרא ג. משווה את גובה הבית לבית שני ואינה מזכירה מאה ועשרים. זה המודל הבסיסי: הבית והאולם בגובה שלושים."],
            ["aliyot", "מאה ועשרים — עליות (רש״י דה״י ב ג, ד)", "'והגובה מאה ועשרים' (דברי הימים ב ג, ד): רש״י — שלושים אמה עד תקרת העלייה הראשונה 'ומעליה לעליה עד גג העליון תשעים אמות'; רד״ק (כדעה שנייה): 'ג' עליות גבהן תשעים אמה'. השכבה בונה שתי עליות, זו על גב זו, על הבית ועל האולם עד 120 אמה (כאיור הספר); כל עלייה סגורה בשלוש השכבות — גבים, בית דילפא ושדרות בארזים. חלוקת הגובה — בחירת מודל."]
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
          cap: "האולם — בית החליפות (רש״י) או בליטת האולם לשיטת הרמב״ם",
          refs: [["מלכים א ו, ג", V(10, 6, 3)], ["יומא לו.", P(107, "לו.")], ["רמב״ם בית הבחירה פרק ד", RB(4, 0)], ["מדות ד, ז", MI(4, 7)]],
          options: [
            ["rashi", "רש״י: בית החליפות (יומא לו.)", "רש״י (יומא לו.): האולם היה רחב מן ההיכל חמש עשרה אמה מכל צד, ובשני הצדדים 'בית החליפות' — שם גנזו את הסכינים; וכך רש״י בסנהדרין ק. גם לבית ראשון. ברירת המחדל: הבליטה בחזית בלבד."],
            ["rambam", "רמב״ם (בית הבחירה ד)", "לשיטת הרמב״ם (הלכות בית הבחירה ד, ה), כפי שהבינו בו הכסף משנה ותוספות יום טוב (מדות ד, ז): בליטת האולם נמשכת בצפון ובדרום לכל אורך הבית, 'עד מקצוע המערבית', ולא רק בחזית. בצד מערב אין בליטה: החשבון ממערב למזרח הוא מאה אמה בלעדיה (שם ד, ד). לחם שמים (שם) מפרש שגם לרמב״ם העודף הוא רק כנגד האולם, והראב״ד חולק על הכותל. הצרות לצד מערב 'מטין הבנין מעט' (פירוש המשנה, מדות ד, ז) אינה במודל, כי לא נמסרה לה מידה. השכבה מוסיפה את הבליטה על המודל."]
          ],
          current: ctx.layers.ulamRambam && ctx.layers.ulamRambam.visible ? "rambam" : "rashi",
          onPick: (k) => setLayer("ulamRambam", k === "rambam"),
          fly: (k) => { if (k === "rambam") fly([60, 60, 130], [-35, 25, 30]); else flyView("heichalFront"); },
          disabled: !ctx.layers.ulamRambam
        });
        layerMarks.ulamRambam = (on) => ulamRow.mark(on ? "rambam" : "rashi");
        // 1.0.1-L (L.60, the user: "עיין בפירוש המלבים למעשה שושן (פס' יט) והוסף זאת כאופצי'"): the capitals of Yachin and Boaz - ctx.shared.pillarCapital (50-heichal.js)
        const pcap = ctx.shared.pillarCapital;
        opRow({
          id: "pillarCapital", short: "הכותרות", cardFly: true, chips: { rashi: "רש״י", malbim: "מלבי״ם" },
          cap: "כותרות יכין ובועז — רש״י (כאיורי הספר) או מלבי״ם",
          refs: [["מלכים א ז, טו", V(10, 7, 15)], ["ז, יט", V(10, 7, 19)], ["ז, כב", V(10, 7, 22)], ["מלבי״ם ז, יז", V(10, 7, 17)], ["מלבי״ם ז, יט", V(10, 7, 19)], ["מלבי״ם ז, כ", V(10, 7, 20)]],
          options: [
            ["rashi", "רש״י (כאיורי ׳מקרא מפורש׳)", (placeItemByT["כותרת העמוד — שבכה, רימונים ושושנים"] || {}).info || "רש״י (ז, יח): 'כמין שני אגנים' — כציור הספר. ברירת המחדל."],
            ["malbim", "מלבי״ם: העמודים לפני האולם; שבכה, שרשרות ורמונים תלויים, ושושן מצויר בכותל (ז, יט)", "מלבי״ם: הכותרת יושבת על ראש העמוד ו'נחלק לשתי גולות' (ז, טז) — התחתונה שתי אמות, העליונה שלוש 'ככובע על ראש העמוד' (ז, כ); 'חציו העליון היה מכוסה בשבכה שהוא לבוש ממעשה רשת, ארוג מנחושת, ותחת השבכה היה גדילים מעשה שרשרות, והיו שבעה שרשרות לכל כותרת... ובסוף השרשרות היו תלוים שני טורי רמונים שהיה ראשם תלוי בשרשרות וסופם מכסה את הגולה התחתונה' (ז, יז), 'מאה רמונים בכל טור' (ז, כ); ראש העמוד עצמו 'נעשה בראשו כמעשה שושן' (ז, כב; ז, טו: 'הקיש בקורנס ועשה על שפת כל א' מעשה שושן ונתארך חצי אמה'); ופסוק יט — כותרת מצוירת: 'שהיה שושן מצויר על כותל האולם במקום שהגיעו לשם ראשי העמודים היינו י״ח אמות בגובה הכותל של האולם והיה ארכו ורחבו וגבהו של הכותרת המצויר בכותל ד' אמות'. במודל, בקריאה זו: העמודים עומדים לפני האולם — 'שהקים אותם לפני האולם וסמוך לו' (ז, כא) — והשושן מצויר על חזית האולם לצד הפתח, בגובה ראשי העמודים. צורת הרשת, הרמונים והציור, ובסיסי האבן שהעמודים עומדים עליהם מעל המעלות כדי שראשיהם יגיעו לשמונה עשרה אמה בכותל האולם — בחירת מודל."]
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
          cap: "שני השולחנות שבאולם — ר׳ יוסי בר׳ יהודה",
          refs: [["מנחות צט.", P(131, "צט.")], ["משנה שקלים ו, ד", MN(54, 6, 4)], ["משנה מנחות יא, ז", MN(81, 11, 7)], ["רמב״ם בית הבחירה ג, טז", RB(3, 16)]],
          options: [
            // 1.1.0 (the user): the reading "בלי שולחנות" is gone - it was wrong
            ["ryby", "ר׳ יוסי בר׳ יהודה: כסף וזהב", "'רבי יוסי ברבי יהודה אומר: לא היו מסדרין אלא על של משה, אלא מה אני מקיים ״ואת השלחנות אשר עליהם לחם הפנים זהב״? אלו שלשה שלחנות שהיו במקדש: שנים שהיו באולם מבפנים לפתח הבית, אחד של כסף ואחד של זהב' (מנחות צט.). רש״י: 'אצל פתח ההיכל אחד של כסף ואחד של זהב והאי דקרי הכא כסף ובמתניתין שייש משום דשייש לבן ככסף'; 'בכניסתו מניחו על של כסף וכשמגיע להיכל מסדר על של משה שמצופה זהב הרי עלייה ולא מורידין לכך ביציאתו מניחו על של זהב'. במודל: שני שולחנות במידת שולחן לחם הפנים (שמות כה, כג), בתוך האולם סמוך לפתח ההיכל משני צדי המעבר — הכסף בצפון והזהב בדרום (בחירת מודל על פי 'המכניסים עומדים בצפון... המוציאין עומדים בדרום', מנחות יא, ז)."],
            ["mishnah", "המשנה: שיש וזהב", "'ושנים באולם מבפנים על פתח הבית, אחד של שיש ואחד של זהב, על של שיש נותנין לחם הפנים בכניסתו, ועל של זהב ביציאתו, שמעלין בקדש ולא מורידין' (שקלים ו, ד); רמב״ם: 'ושני שלחנות היו באולם מבפנים על פתח הבית. אחד של שיש נותנין עליו לחם הפנים בכניסתו. ואחד של זהב נותנין עליו לחם ביציאתו' (בית הבחירה ג, טז); ברטנורא: 'על פתח הבית. אצל פתח ההיכל בכניסתו'."]
          ],
          current: utab && utab.current || "ryby",
          onPick: (k) => { autoOff.cancel("ulamTables"); if (utab && typeof utab.set === "function") utab.set(k); },
          fly: () => flyView("ulamTables"),
          disabled: !(utab && typeof utab.set === "function")
        });
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
              cap: "מזבח הנחושת — אבנים או מצופה נחושת",
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
              cap: String(ar.title || "הכבשים הקטנים — רש״י או תוספות"),
              refs: rs,
              options: arOpts.map((o) => [o.key, String(o.label || o.key), String(arInfo[o.key] || ""), Array.isArray(arRefs[o.key]) ? arRefs[o.key] : null]),
              current: arOpts.some((o) => o.key === cur) ? cur : arOpts.some((o) => o.key === "rashi") ? "rashi" : arOpts[0].key,
              onPick: (k) => { ar.set(k); },
              fly: () => flyView(typeof ar.fly === "string" && ctx.shared.flyPoints && ctx.shared.flyPoints[ar.fly] ? ar.fly : "mizbeach")
            });
          }
        }
        // 1.2.0 (the user): the place of the altar in the court - ctx.shared.altarPlace (40-altar.js): R. Eliezer b. Yaakov (south, the
        // default, as the Rambam rules) / R. Yose (north) / R. Yehuda (the middle). The texts are the user's own summary (in the module).
        {
          const ap = ctx.shared.altarPlace;
          if (ap && typeof ap.set === "function" && Array.isArray(ap.keys)) {
            opRow({
              id: "altarPlace", short: "מקום המזבח", cardFly: true, chips: { south: "ראב״י: בדרום", north: "ר׳ יוסי: בצפון", middle: "ר׳ יהודה: באמצע" },
              cap: "מקום המזבח והכבש בעזרה — יומא טז., זבחים סג.",
              refs: [["יומא טז.", P(107, "טז.")], ["זבחים סג.", P(130, "סג.")], ["זבחים נח:", P(130, "נח:")], ["רמב״ם בית הבחירה ה, יג", RB(5, 13)]],
              options: ap.keys.map((k) => [k, String(ap.names[k] || k), String(ap.lead || "") + " " + String(ap.info[k] || ""), null]),
              current: ap.current || "south",
              onPick: (k) => { ap.set(k); },
              fly: () => flyView("altarFromDoor")
            });
          }
        }
        // 1.2.0 (the user): what lay in the ark and how - ctx.shared.arkLayout (55-interior.js): R. Meir / R. Yehuda, Bava Batra 14a-b
        {
          const al = ctx.shared.arkLayout;
          if (al && typeof al.set === "function" && Array.isArray(al.keys)) {
            opRow({
              id: "arkLayout", short: "מה שבארון", cardFly: true, chips: { meir: "רבי מאיר", yehuda: "רבי יהודה" },
              cap: "מה היה מונח בארון ואיך — רבי מאיר ורבי יהודה (בבא בתרא יד.)",
              refs: [["בבא בתרא יד.", P(124, "יד.")], ["בבא בתרא יד:", P(124, "יד:")], ["מלכים א ח, ט", V(10, 8, 9)], ["דברים לא, כו", V(5, 31, 26)]],
              options: al.keys.map((k) => [k, String(al.names[k] || k), String(al.info[k] || ""), null]),
              current: al.current || "meir",
              onPick: (k) => { al.set(k); },
              fly: () => flyView(ctx.shared.flyPoints && ctx.shared.flyPoints.arkInside ? "arkInside" : "kodeshHakodashim")
            });
          }
        }
        // 3. the place of the Sea (I Kings 7:39)
        seaRow = opRow({
          id: "seaPlacement", short: "מקום הים", cardFly: true, chips: { rashi: "רש״י: מזרחית צפונית", radak: "רד״ק ומצודות: מזרחית דרומית" },
          cap: "מקום הים — 'מכתף הבית הימנית קדמה ממול נגב'",
          refs: [["מלכים א ז, לט", V(10, 7, 39)], ["רש״י שם", V(10, 7, 39)], ["דברי הימים ב ד, י", V(39, 4, 10)]],
          options: [
            ["rashi", "רש״י: קרן מזרחית צפונית", "'ואת הים נתן מכתף הבית הימנית קדמה ממול נגב' (מלכים א ז, לט). רש״י: 'משוך מצד דרום לצד צפון, וזה קדמה מול נגב, מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה'. במודל — בקרן המזרחית הצפונית של העזרה, ממזרח לצפון בית המטבחים, כציור 'מקרא מפורש' ומפתו, מול השולחנות והטבעות. ברירת המחדל."],
            ["radak", "רד״ק ומצודות: קרן מזרחית דרומית", "מצודת דוד (ז, לט): 'משוך כלפי מקצוע מזרחית דרומית שבעזרת כהנים'; רד״ק: 'נתן הים בעזרה לצד דרום משוך כלפי מזרח'; רלב״ג: 'הים היה לפאת מזרחי דרומי שבחצר הכהנים'; רש״י (דברי הימים ב ד, י): 'רחק אותו מן המזרח מן כנגד הפתח לדרומה של עזרה, לפי שאין כבוד ונאה שיהו מטבילין כנגד פתח האולם'. במודל — בקרן המזרחית הדרומית."]
          ],
          current: sp && sp.current || "rashi",
          onPick: pickSea,
          fly: () => fly(uiSeaCam(), uiSeaTg()),   // 1.0.1-L (Part 7, U4): from above, both readings
          disabled: !(sp && typeof sp.set === "function")
        });
        // 4. the arrangement of the tables and the menorot (Menachot 98b)
        layoutRow = opRow({
          id: "kodeshLayout", short: "סידור הכלים", chips: { rabbi: "רבי: מזרח ומערב", rashbash: "ר׳ אלעזר בר״ש: צפון ודרום" },
          cap: "סידור השולחנות והמנורות — מזרח ומערב או צפון ודרום",
          refs: [["רלב״ג ז, מט", { book: 3645, index: 312 }], ["מנחות צח:", P(131, "צח:")], ["מנחות צט.", P(131, "צט.")], ["רמב״ם בית הבחירה ג, יב", RB(3, 12)]],
          options: [
            ["rabbi", "רבי: מזרח ומערב", "מנחות צח: — רבי אומר: השולחנות (והמנורות) מונחים מזרח ומערב, כלומר אורכם לאורך הבית. כולם בחצי הפנימי של ההיכל, השולחנות בצפון והמנורות בדרום, של משה באמצע — בשתי שורות של חמישה (צט.), ושולחן משה משוך מערבה 'כתלמיד היושב לפני רבו'. הרמב״ם (בית הבחירה ג, יב) פוסק כך לשולחן. שולחן משה ומנורת משה בראש השורות, ראשם מול האוויר שבין החמישה לחמישה (מנחות צט.; רש״י: 'משוך לצד מערב וראשו מכוון כנגד אויר שבין שתי השורות') — כגמרא. המנורות משוכות מערבה מן השולחנות — רלב״ג (מלכים א ז, מט): 'הנה מפני שהשולחנות הם גם כן לפני הדביר ולא זכר זה אלא במנורות ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות', וכציור הספר; השיעור, אמה אחת — בחירת מודל. ברירת המחדל."],
            ["rashbash", "ר׳ אלעזר בר׳ שמעון: צפון ודרום", "מנחות צח: — רבי אלעזר ברבי שמעון אומר: צפון ודרום, כלומר אורך השולחנות לרוחב הבית, כארון. שני טורים של חמישה מכותל צפון עד אמצע הבית ושולחן משה ביניהם: 'שתי אמות ומחצה ממנו לשורה החיצונה ושתי אמות ומחצה ממנו לשורה הפנימית ומשוך מכותל צפוני שתי אמות ומחצה' (תוספות מנחות צח:), וארכו לאורך הבית — 'ששלחן משה הכל מודים בו שארכו לאורך הבית ורחבו לרחב הבית' (מאירי יומא נא:); המנורות כנגדם בדרום, וקניהן צפון ודרום. המנורות משוכות מערבה מן השולחנות — רלב״ג (מלכים א ז, מט): 'הנה מפני שהשולחנות הם גם כן לפני הדביר ולא זכר זה אלא במנורות ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות', וכציור הספר; השיעור, אמה אחת — בחירת מודל."]
          ],
          current: kl && kl.current || "rabbi",
          onPick: pickLayout,
          fly: () => { fly([-14, 36, 4], [-34, 16, 0]); },   // inside the closed kodesh (x -43.5..-3.5, |z| < 10, y 12..42)
          disabled: !(kl && typeof kl.set === "function")
        });
        // 5. lighting and the bread (Menachot 99a)
        opinionRow = opRow({
          id: "kodeshOpinion", short: "הדלקה וסידור הלחם", chips: { tk: "תנא קמא: בשל משה", rebs: "ר׳ אלעזר בן שמוע: בכולן" },
          cap: "הדלקת המנורות וסידור הלחם — בשל משה בלבד או בכולן",
          refs: [["מנחות צט.", P(131, "צט.")], ["מלכים א ז, מט", V(10, 7, 49)], ["רד״ק שם", V(10, 7, 49)]],
          options: [
            ["tk", "תנא קמא: בשל משה בלבד", "מנחות צט. — 'עשר מנורות עשה שלמה ולא היו מדליקין אלא בשל משה'; וכך על השולחנות: 'לא היו מסדרין אלא על של משה' (רבי יוסי ברבי יהודה). במצב זה דולקת רק מנורת משה, והלחם רק על שולחנו; עשרת השולחנות עומדים בלא לחם — כולם בתבנית שולחן משה, עם הסניפין, הקנים והבזיכין (כציור הספר). ברירת המחדל."],
            ["rebs", "ר׳ אלעזר בן שמוע: בכולן", "מנחות צט. — רבי אלעזר בן שמוע אומר: 'על כולם היו מסדרין... ובכולן היו מדליקין'; כך גם רד״ק (מלכים א ז, מט) כפשט הפסוקים. במצב זה כל אחת עשרה המנורות דולקות, והלחם על כל השולחנות."]
          ],
          current: ko && ko.current || "tk",
          onPick: pickOpinion,
          fly: () => flyView("menorot"),
          disabled: !(ko && typeof ko.set === "function")
        });
        // 6. the devir doorway: Rashi's two explanations of "מזוזות חמישית" (I Kings 6:31) - ctx.shared.devirDoor (55-interior.js)
        opRow({
          id: "devirDoor", short: "פתח הדביר", chips: { pent: "רש״י: חמש צלעות", five: "רש״י: מפתן, מזוזות ומשקוף" },
          cap: "פתח הדביר — 'האיל מזוזות חמשית': שני ביאורי רש״י",
          refs: [["מלכים א ו, לא", V(10, 6, 31)], ["רש״י שם", V(10, 6, 31)], ["רד״ק שם", V(10, 6, 31)], ["מדות ב, ג", MI(2, 3)]],
          options: [
            ["pent", "רש״י 'ואני אומר': חמש צלעות למזוזות", "רש״י: 'ואני אומר, מזוזות חמישית, חמשה צלעות היו למזוזות, ולא היתה מרבעת, ואינו מדבר לא במפתן ולא במשקוף, שלא מצינו מפתן ומשקוף קרויין אילים'. במודל: מזוזות מחומשות — צלע אחת כעובי הכותל והקודקוד שכנגדה אל הפתח — ומעליהן משקוף זהב בחתך המזוזות, כציור הספר: רד״ק: 'האיל הוא הסף העליון... וכן האיל'; רלב״ג: 'שהאיל והוא הסף אשר על הפתח'; מלבי״ם: 'האיל ר״ל המשקוף'; רש״י אינו מדבר בו — המשקוף בחירת מודל. ברירת המחדל."],
            ["five", "רש״י 'כך שמעתי': מפתן, שתי מזוזות ומשקוף כשניים", "רש״י: 'המפתן האחד, והמזוזות מכאן ומכאן שתים, הרי שלש, והמשקוף שעליו עשוי כשתים — כזה; כך שמעתי'. במודל: מפתן, שתי מזוזות מרובעות, ומשקוף משתי קורות המוטות זו על זו מעל הפתח (כשער הטדי, 'שתי אבנים מטות זו על גב זו', מדות ב, ג) — צורת הציור האבוד 'כזה' היא בחירת מודל. רד״ק: 'חמש צלעות זו לפנים מזו'; רלב״ג ומלבי״ם: הפתח החמישי שבמקדש."]
          ],
          current: dd && dd.current || "pent",
          onPick: (k) => { if (dd && typeof dd.set === "function") dd.set(k); },
          fly: () => { fly([-30, 31, 6], [-44, 22, 0]); },   // inside the closed kodesh, looking at the devir doorway
          disabled: !(dd && typeof dd.set === "function")
        });
        // 7. the faces of the cherubim (II Chr 3:13; Bava Batra 99a) - ctx.shared.cherubPose (55-interior.js)
        opRow({
          id: "cherubPose", short: "פני הכרובים", chips: { rashi: "רש״י", radak: "רד״ק ומצודות", tzidud: "בבא בתרא: מצדדין" },
          cap: "פני הכרובים — 'ופניהם לבית' (דברי הימים ב ג, יג)",
          refs: [["דברי הימים ב ג, יג", V(39, 3, 13)], ["רש״י שם", V(39, 3, 13)], ["רד״ק מלכים א ו, כז", V(10, 6, 27)], ["בבא בתרא צט.", P(124, "צט.")]],
          options: [
            ["rashi", "רש״י: ראשם כפוף ופונה זה אל זה", "רש״י (דברי הימים ב ג, יג): 'ופניהם לבית — לפנים, שלא היו ראשיהם זקופים שנראה כמביטין לחוץ, אלא ראשם היה כפוף ומביטין לפניהם... פונים היו ראשם זה כנגד זה, וגם ראשיהם כפופים לבית כלפי פנים'. במודל: הגוף פונה מזרחה, הראש מוטה אל הכרוב השני וכפוף. ברירת המחדל."],
            ["radak", "רד״ק ומצודות: פניהם לבית, מזרחה", "רד״ק (מלכים א ו, כז): 'כי פניהם כנגד ההיכל, כמו שאומר בדברי הימים ופניהם לבית'; וכן מצודת דוד על דברי הימים ב ג, יג. במודל: פנים ישרות אל ההיכל, מזרחה."],
            ["tzidud", "בבא בתרא צט.: מצדדין פניהם", "בבא בתרא צט.: 'ולמאן דאמר ״ופניהם לבית״, הא כתיב: ״ופניהם איש אל אחיו״! דמצדדי אצדודי – דתניא, אונקלוס הגר אמר: כרובים – ״מעשה צעצעים״ הן, ומצודדים פניהם כתלמיד הנפטר מרבו'. במודל: הראשים מוטים כמחצית הדרך זה אל זה."]
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
            id: "slaughterLayout", short: "בית המטבחים", chips: { book: "כציור הספר", meiri: "המאירי", oneRow: "ראבי״ה והגר״א" },
            cap: "בית המטבחים — הננסין והרביעין",
            refs: [["מדות ג, ה", ui_MI(3, 5)]],
            options: [
              ["book", slNames.book || "חתיכת ארז על כל עמוד — כציור הספר", "על כל עמוד חתיכת ארז: 'ורביעין של ארז. חתיכות מרבעות של ארז היו על העמודים' (ברטנורא מדות ג, ה), ובה האונקליות; שתי שורות כציור הספר: 'בד׳ שורות מצפון לדרום, וכל שורה של ב’ ב'' (צורת בית המקדש לתפארת ישראל).", [["ברטנורא מדות ג, ה", { book: 643, index: 146 }], ["צורת בית המקדש", { book: 6029, index: 99 }]]],
              ["meiri", slNames.meiri || "קורות מעמוד לעמוד — המאירי", "'רביעים של ארז ר”ל כעין קורות קצרות באים מעמוד לעמוד', ושלושת הסדרים: 'ר”ל על כל אחד מן הרביעים והם בשני הצדדים ושטח התחתון' (מאירי על מדות ג, ה). וכן 'קורות של ארז. על גביהן. מזו לזו' (קובץ שיטות קמאי על תמיד). הקורות לאורך שתי השורות: בחירת מודל.", [["מאירי על מדות ג, ה", { book: 6033, index: 50 }], ["קובץ שיטות קמאי על תמיד", { book: 7582, index: 1040 }]]],
              ["oneRow", slNames.oneRow || "שורה אחת ממזרח למערב — ראבי״ה והגר״א", "'ונראה שלא היו העמודים וכן השלחנות. מסודרים זה אצל זה. ארבע שורות של ב' ב' מסודרין זה אחר זה. כזה. אלא כל דממזרח למערב עמודים ח'. שלחנות שמנה' (ראבי״ה בתוספות יום טוב מדות ג, ה). ולגר״א: 'כי שמונה ננסין היו. נמצא היו ז' אוירים וכנגד כל אויר היה שולחן הרי ז' שולחנות ושולחן הח' הי' עמוד אצל הננס שבקצה מבחוץ' (ביאור הגר״א מדות ה, ב). במודל שבעה שולחנות בין העמודים והשמיני בקצה המזרחי; המרחקים וגודל השולחנות: בחירת מודל.", [["תוספות יום טוב מדות ג, ה", { book: 948, index: 133 }], ["ביאור הגר״א מדות", { book: 7509, index: 67 }]]]
            ],
            current: sl && sl.current || "book",
            onPick: (k) => { if (sl && typeof sl.set === "function") sl.set(k); },
            fly: () => { flyView("slaughterPlaceClose"); },
            disabled: !(sl && typeof sl.set === "function")
          });
        }
        // 8. the House of the Forest of Lebanon (I Kings 7:2-6) - ctx.shared.forestHouse (60-palace.js)
        opRow({
          id: "forestHouse", short: "בית יער הלבנון", cardFly: true, chips: { rashi: "רש״י", metzudot: "מלבי״ם ורלב״ג", mzd: "מצודת דוד" },
          cap: "בית יער הלבנון — הטורים, הקירוי ו'עמודים ועב' (מלכים א ז, ב–ו)",
          refs: [["מלכים א ז, ב", V(10, 7, 2)], ["ז, ג", V(10, 7, 3)], ["ז, ד", V(10, 7, 4)], ["ז, ו", V(10, 7, 6)], ["רש״י ז, ו", V(10, 7, 6)], ["מלבי״ם ז, ב", V(10, 7, 2)], ["רלב״ג ז, ג", V(10, 7, 3)], ["מצודת דוד ז, ב", V(10, 7, 2)]],
          options: [
            ["rashi", "רש״י (כאיורי ׳מקרא מפורש׳)", "רש״י: 'לארך הבית היה טור עמודים בקרקע, והכרותות מעמוד לעמוד' (ז, ב); על הכרותות 'מחצות עליונות... כלן פתחים וחלונות' ועליהן 45 נסרי הספון, חמישה עשר לכל חלל (ז, ג); 'ושקפים' — 'קרוי של נסרים קטנים, נתונים על מרישין קטנים' (ז, ד); 'ועל כרותות ארזים שעל העמודים התחתונים, הציב על (צריך לומר: עוד) עמודים אחרים, ומרישין מעמוד לעמוד, העמודים לארג בהן צלעות מזה לזה, והעבים לקרוי העליה, עב היא מריש' (ז, ו). במודל, כציור הספר: ארבעה טורים צפופים לאורך, הכרותות מעמוד לעמוד, רצפת הקומה העליונה, קירות עליונים ארוגים מעמודים עם פתחים וחלונות, 45 הנסרים, ובסוף הגג מרישין קטנים ועליהם הנסרים הדקים; העב — באולם העמודים בלבד, ואינו נראה; אולם העמודים — 'מבוא לבית' נמוך, ולפניו 'ואולם על פניהם' — 'אולם גבוה עשה על כל הבית'. ברירת המחדל."],
            ["metzudot", "מלבי״ם ורלב״ג", "מלבי״ם: 'העמודים היו נתונים לרוחב הבית וחולקים את אורך הבית לג' חלקים' (ז, ב); 'חלונות של צד הארך מזה מכוונים נגד חלונות של צד הארך השני' (ז, ד); 'הפתחים היו בצד רוחב הבית' (ז, ה); 'לפני הבית והאולם היה עוד אולם ולפני האולם השני היו עמודים ועב על פניהם היינו מריש שהוא עץ עב' (ז, ו). רלב״ג: 'חמשה עשר עמודים היו בטור האחד', 'והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה' (ז, ג); אולם העמודים 'גבהו כגבהם' (ז, ו). במודל: ארבעה טורים לרוחב, כתלי גזית עם חלונות, 45 הלוחות וגג; אולם העמודים גבוה כעמודים, לפניו אולם שני ולפניו שורת עמודים ועב."],
            ["mzd", "מצודת דוד", "מצודת דוד: 'והשורות ההם עמדו לרוחב הבית, והיה נחלק להם האורך לשלשה חלקים שווים, אבל לאורך הבית היה כתלים ממש, כדרך הבנין' (ז, ב); 'ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה' — 'היה אורך כל לוח ל״ג אמות ושליש אמה, ורוחב הלוחות לרוחב הבית, והיה רוחב כל לוח ג׳ אמות ושליש אמה' (ז, ג); 'עשו שלשה שורות חלונות, זה למעלה מזה' — 'מכוונות זו מול זו' (ז, ד); 'יתכן שהיו שלשה פתחים בכותל מזה, ושלשה בכותל מזה, והחלון מלמעלן, וכל השלשה היו זה מול זה' (ז, ה); 'עשה אולם עומד על עמודי ארזים', 'נסמך לבית היער לפני פתחים, וכדרך בית שער, ועמד ארכו לאורך הבית, להיות מול כל שלשת הפתחים', ו'לפני פתחי האולם הזה, עמדו עמודים תקועים בארץ, וממעל להם עץ עב לחברם יחד' (ז, ו). במודל: ארבעה טורים לרוחב, כתלי גזית לאורך ובהם שלוש שורות חלונות זו מול זו ושלושה פתחים מרובעים בכל כותל; אולם העמודים לאורך הצלע המזרחית, מול שלושת הפתחים, ולפניו העמודים והעץ העב. (את ציורו הוא מזכיר, 'ועיין בתחילת קונטרס בנין הבית ובצורה' — אינו בספרייה; המודל לפי דבריו בלבד.)"]
          ],
          current: fh && fh.current || "rashi",
          onPick: (k) => { setLayer("palace", true); if (fh && typeof fh.set === "function") fh.set(k); },
          // 1.0.1-L (L.91, the user: "בית יער הלבנון הבאנר מציג את הבית במקום את אולם העמודים"): the reading's own hall, in each of the three (60-palace.js re-aims it)
          fly: () => { setLayer("palace", true); flyView("forestAlam"); },
          disabled: !(fh && typeof fh.set === "function")
        });
        // 9. Solomon's throne (L.57, L.81, the user: "צור כפתור לכל דעה סותרת"): ctx.shared.throneVersion (60-palace.js), each option in the midrash's own words
        const tver = ctx.shared.throneVersion;
        const tvNames = (tver && tver.names) || {};
        const tvNotes = PN.throneVersions || {};
        throneRow = opRow({
          id: "throneVersion", short: "כסא שלמה",
          cap: "כסא שלמה — לפי איזה מדרש",
          refs: TH_V.slice(0, 4),
          // 1.0.1-L: the user: the midrash's name on screen is "בית המדרש ב" (a source's link may keep the book's title), whatever the module's list says
          options: ["pesukim", "targumSheni", "estherRabbah", "beitHamidrash"].map((k) => [k, k === "beitHamidrash" ? "בית המדרש ב" : tvNames[k] || k, tvNotes[k] || "", TH_REFS[k]]),
          current: tver && tver.current || "pesukim",
          onPick: (k) => { setLayer("palace", true); if (tver && typeof tver.set === "function") tver.set(k); },
          fly: () => { setLayer("palace", true); flyView("throne"); },
          disabled: !(tver && typeof tver.set === "function")
        });
      }
      // ===== viewing tools (SPEC 9.6; 1.0.1 FIXES F.2; 1.0.1-H: sources on the rows) =====
      // 1.0.1-K: the removal rows (the cutaway, the chambers, the ulam, the boards, the cloud) left the panel for the on-model pills (the
      // user: "הכפתור צריך להיות על המיצג ולא בתוכן הענינים"); the wall fade moved to the nav row. The panel says where they are.
      const secTog = document.createElement("div");
      secTog.className = "sec";
      secTog.textContent = "תצוגה — כלי צפייה (אינם חלק מן הבניין)";
      panel.appendChild(secTog);
      {
        const note = document.createElement("div");
        note.className = "s";
        note.style.lineHeight = "1.5";
        // 1.0.1-L: the pills of this round; what a PLACE switches on goes off by itself (L.27), what a pill switches on stays
        note.textContent = "פתיחה לצפייה (הבית, היציע, האולם, הנסרים, החתכים והשכבות) — בכפתורים שעל המודל עצמו. מה שנפתח מכפתור בלוח חוזר לבד אחרי 15 שניות; ״↺ החזר הכל״ מחזיר את המבט ואת כל המתגים.";   // 1.1.0: short (the long list of the pills is gone from the tree)
        panel.appendChild(note);
      }
      toggleRow("תוויות", true, (on) => {
        labelGroup.visible = on;
      });
      const setAutoRotate = (on) => {
        if (ctx.controls) {
          ctx.controls.autoRotate = !!on;
          ctx.controls.autoRotateSpeed = 0.4;
        }
      };
      // 1.0.1-K review (tour-8): the row's input is kept for ctx.ui.autoRotate (the presentation suspends the rotation through it)
      const autoRotRow = toggleRow("סיבוב איטי", false, setAutoRotate);
      // 1.2.0 (the user): indoors the eye stays in the room while it orbits a vessel (the DEFAULT: to see the menorot from behind, come close
      // with the wheel and drag round them); this row lets the eye pass the walls, which then go see-through (the 1.0.5 way)
      if (ctx.camInside && typeof ctx.camInside.set === "function") {
        toggleRow("מעבר דרך קירות (שקופים)", !ctx.camInside.get(), (on) => ctx.camInside.set(!on));
      }
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
      const units = document.createElement("div");
      units.id = "tm-units";
      units.textContent = "המידות באמות. יחידה אחת במודל = אמה אחת. לחיצה על מבט, מקום או שיטה פותחת את ההסבר ומקורותיו בכרטיס ליד הלוח (✕ או Esc סוגר). מה שאינו בפסוקים מסומן בהסברים ובלוח 'השלמות'; המחלוקות — בטבלת 'שיטות ומחלוקות'.";
      panel.appendChild(units);
      const foot = document.createElement("div");
      foot.id = "tm-foot";
      // 1.1.0: the controls' hint is the "ניווט" dialog of the top bar; the foot only points there
      foot.textContent = "הוראות ניווט (עכבר, מגע, מקלדת) — בכפתור ״ניווט״ שבסרגל העליון";
      foot.style.cursor = "pointer";
      foot.addEventListener("click", () => { const b = document.getElementById("tm-help-btn"); if (b) b.click(); });
      panel.appendChild(foot);
      // 1.1.0: the top bar's buttons are children of #tm-topbtns in index.html's header, in a flex row, ordered by `order`
      // (presentation 10, navigation help 20, print 30, report 40, what's new 50). Each gets an inline SVG icon (ui_topIcon) and its
      // label in a span.lbl (hidden in a narrow window: index.html). No measuring, no polling: the row lays itself out.
      // ctx.ui.topbarAdd is exported for 75-tour.js (the presentation button, built after this module).
      const topbarAdd = (el, order, icon, label) => {
        el.classList.add("tm-topbtn");
        el.dataset.order = String(order == null ? 99 : order);
        if (icon || label) {
          el.textContent = "";
          if (icon) el.appendChild(ui_topIcon(icon));
          if (label) {
            const sp = document.createElement("span");
            sp.className = "lbl";
            sp.textContent = label;
            el.appendChild(sp);
          }
        }
        const nav = document.getElementById("tm-topbtns");
        if (!nav) {
          document.body.appendChild(el);
          return el;
        }
        const o = +el.dataset.order;
        let before = null;
        for (const c of nav.children) {
          if (+c.dataset.order > o) { before = c; break; }
        }
        nav.insertBefore(el, before);
        return el;
      };
      // ===== 1.1.0 (the user): a clear button in the bar with the navigation instructions ("הוראות ניווט") =====
      {
        const hbtn = document.createElement("button");
        hbtn.type = "button";
        hbtn.id = "tm-help-btn";
        hbtn.title = "הוראות ניווט: עכבר, משטח מגע, מגע ומקלדת";
        topbarAdd(hbtn, 20, "help", "ניווט");
        const dlg = document.createElement("div");
        dlg.id = "tm-help";
        dlg.setAttribute("role", "dialog");
        dlg.setAttribute("aria-label", "הוראות ניווט");
        const box = document.createElement("div");
        box.className = "box";
        const t = document.createElement("div");
        t.className = "t";
        t.textContent = "הוראות ניווט במודל";
        box.appendChild(t);
        const sec = (title, items) => {
          const h = document.createElement("h4");
          h.textContent = title;
          box.appendChild(h);
          const ul = document.createElement("ul");
          for (const it of items) {
            const li = document.createElement("li");
            // "<kbd>" marks a key: [[text]]
            const parts = String(it).split(/(\[\[[^\]]+\]\])/);
            for (const p of parts) {
              if (!p) continue;
              const m = /^\[\[([^\]]+)\]\]$/.exec(p);
              if (m) {
                const k = document.createElement("kbd");
                k.textContent = m[1];
                li.appendChild(k);
              } else li.appendChild(document.createTextNode(p));
            }
            ul.appendChild(li);
          }
          box.appendChild(ul);
        };
        sec("עכבר", [
          "גרירה עם הכפתור השמאלי — סיבוב המבט.",
          "גלגלת — התקרבות והתרחקות (זום).",
          "גרירה עם הכפתור הימני — הזזת התמונה הצידה.",
          "[[Shift]] + גלגלת — הגבהה והנמכה של גובה העין."
        ]);
        sec("משטח מגע (לפטופ)", [
          "גרירה באצבע אחת — סיבוב.",
          "שתי אצבעות: צביטה או החלקה למעלה ולמטה — זום.",
          "אם הגלגלת גוללת את הדף במקום לזום: לחץ פעם אחת על המודל (שיקבל את המיקוד), והחזק את הסמן מעל המודל ולא מעל הלוח."
        ]);
        sec("מסך מגע", [
          "אצבע אחת — סיבוב. צביטה — זום. שתי אצבעות יחד — הזזה."
        ]);
        sec("מקלדת", [
          "[[←]] [[→]] — סיבוב ימינה ושמאלה.",
          "[[Shift]] + [[↑]] [[↓]] — הטיית המבט למעלה ולמטה.",
          "[[↑]] [[↓]] או [[PageUp]] [[PageDown]] — הגבהה והנמכה של גובה העין.",
          "[[+]] [[−]] — זום.",
          "[[Esc]] — סגירת כרטיס הסבר."
        ]);
        sec("בתוך הבית", [
          "באולם או בהיכל, כשהמבט רחוק — גרירה מסובבת את המבט במקום, כמי שעומד ומביט סביבו; הגלגלת מתקדמת קדימה ואחורה.",
          "אחרי מעבר לכלי קרוב (המנורות, השולחנות, הכרובים) הגרירה מסובבת סביב הכלי. העין נשארת בתוך החדר: כדי לראות את הכלי מאחור — התקרב אליו בגלגלת וגרור סביבו.",
          "״מעבר דרך קירות״ (בלוח, תצוגה) מרשה לעין לצאת מן החדר; הקירות נעשים שקופים בדרך.",
          "אין עצירות: כל מיצג נראה מכל גובה ומכל מרחק. ״↺ החזר הכל״ בתחתית הלוח מחזיר את המבט הראשון ואת כל המתגים."
        ]);
        const bb = document.createElement("div");
        bb.className = "b";
        const ok = document.createElement("button");
        ok.type = "button";
        ok.className = "y";
        ok.textContent = "סגירה";
        bb.appendChild(ok);
        box.appendChild(bb);
        dlg.appendChild(box);
        document.body.appendChild(dlg);
        const close = () => { dlg.style.display = "none"; };
        ok.addEventListener("click", close);
        dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
        dlg.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc" || e.key === "Enter") close();
        });
        dlg.addEventListener("keyup", (e) => e.stopPropagation());
        hbtn.addEventListener("click", () => {
          dlg.style.display = dlg.style.display === "flex" ? "none" : "flex";
          if (dlg.style.display === "flex") { try { ok.focus({ preventScroll: true }); } catch (_) {} }
        });
      }
      // ===== 1.0.2 (B, printing): one quiet link at the panel's foot, beside "דיווח על טעות או תקלה" (no new button on the model's view).
      // It builds a clean print page #tm-print: the plugin's name and the current place or view (the open card's title, else the marked
      // button), the view as a picture (one frame rendered and the canvas read with toDataURL right after it, in the same task: the
      // drawing buffer is not kept), and, when a card is open, its text (the brackets small) with its sources' names below. @media print
      // (ui_CSS) hides everything else; A4 landscape. Inside Otzaria (api.md): a small choice - ui.print (the system's dialog) or
      // ui.exportPdf ("שמור בשם") - called straight from the button's click (both need the user's own gesture, no permission; no timeout of
      // ours: sdk.md excludes them), with the page size given as parameters (@page is not honoured there). Outside Otzaria: window.print().
      // The print page goes when the print is done or cancelled. =====
      {
        let pg = null, busy = false;
        const PR_OPTS = { pageSize: "a4", orientation: "landscape", marginMm: 10, printBackgrounds: true };
        const inOtz = () => typeof window.Otzaria !== "undefined" && !!window.Otzaria && typeof window.Otzaria.call === "function";
        const drop = () => {
          if (pg) {
            pg.remove();
            pg = null;
          }
        };
        const curName = () => {
          if (xOpen && xTitle.textContent.trim()) return xTitle.textContent.trim();
          if (cardSpr && cardTitle.textContent.trim()) return cardTitle.textContent.trim();
          const on = btns.concat(placeBtns).find((b) => b.classList.contains("on"));
          return on ? on.textContent.replace(/\d+$/, "").trim() : "";
        };
        const build = () => {
          drop();
          let url = "";
          try {
            ctx.renderer.render(ctx.scene, ctx.camera);
            url = ctx.renderer.domElement.toDataURL("image/jpeg", 0.9);
          } catch (e) {
            console.warn("[ui.js] print picture: " + (e && e.message ? e.message : e));
          }
          const name = curName();
          pg = document.createElement("div");
          pg.id = "tm-print";
          const h = document.createElement("h1");
          h.textContent = name || "בית המקדש הראשון";   // 1.1.0 (the user): one title - the place's name (the plugin's name is in the credit)
          pg.appendChild(h);
          if (/^data:image\/(?:jpeg|png)/.test(url) && url.length > 64) {
            const img = document.createElement("img");
            img.alt = name || "בית המקדש הראשון";
            img.src = url;
            pg.appendChild(img);
          }
          const credit = () => {   // 1.1.0 (the user): a link to the plugin in Otzaria
            const cr = document.createElement("div");
            cr.className = "cr";
            cr.appendChild(document.createTextNode("הודפס מתוך תוסף ״בית ראשון״ לאוצריא — "));
            const a = document.createElement("a");
            a.href = "otzaria://open/plugin/com.beit-hamikdash.rishon-3d-model";
            a.textContent = "לפתיחת התוסף באוצריא";
            cr.appendChild(a);
            return cr;
          };
          pg.appendChild(credit());
          const tb = xOpen ? xBody : cardSpr ? cardBody : null, tr = xOpen ? xRefs : cardSpr ? cardRefs : null;
          const body = tb ? String(tb.textContent || "").trim() : "";
          if (body) {
            // 1.0.6 (the user): the card on a page of its own, attached: its title, its text and each source with its link to Otzaria
            const p2 = document.createElement("div");
            p2.className = "pg2";
            const tx = document.createElement("div");
            tx.className = "tx";
            ui_fillSrc(tx, body);   // the brackets small, as in the card
            p2.appendChild(tx);
            const as = tr ? Array.from(tr.querySelectorAll("a")).filter((a) => String(a.textContent || "").trim()) : [];
            if (as.length) {
              const rs = document.createElement("div");
              rs.className = "rs";
              rs.appendChild(document.createTextNode("מקורות: "));
              as.forEach((a, k) => {
                const r = a.__ref, l = document.createElement("a");
                l.textContent = String(a.textContent).trim();
                if (r && r.book != null && r.index != null) l.href = "otzaria://open/book/" + r.book + "?index=" + r.index;
                if (k) rs.appendChild(document.createTextNode(" · "));
                rs.appendChild(l);
              });
              p2.appendChild(rs);
            }
            p2.appendChild(credit());
            pg.appendChild(p2);
          }
          document.body.appendChild(pg);
          return pg;
        };
        const fileName = () => ("בית ראשון" + (curName() ? " - " + curName() : "")).replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
        const plink = document.createElement("button");
        plink.type = "button";
        plink.id = "tm-print-link";
        plink.textContent = "הדפסה";
        plink.title = "הדפסה או שמירה כ-PDF";
        topbarAdd(plink, 30, "print", "הדפסה");
        // inside Otzaria: the choice
        const pdlg = document.createElement("div");
        pdlg.id = "tm-printdlg";
        pdlg.setAttribute("role", "dialog");
        pdlg.setAttribute("aria-label", "הדפסה או שמירה כ-PDF");
        const pbox = document.createElement("div");
        pbox.className = "box";
        const pt = document.createElement("div");
        pt.className = "t";
        pt.textContent = "הדפסה או שמירה כ-PDF";
        const pn = document.createElement("div");
        pn.textContent = "תמונת המבט ושם המקום; וכשהסבר פתוח — גם ההסבר ומקורותיו.";
        const pbb = document.createElement("div");
        pbb.className = "b";
        const bPrint = document.createElement("button");
        bPrint.type = "button";
        bPrint.className = "y";
        bPrint.textContent = "הדפסה";
        const bPdf = document.createElement("button");
        bPdf.type = "button";
        bPdf.textContent = "שמירה כ-PDF";
        const bNo = document.createElement("button");
        bNo.type = "button";
        bNo.textContent = "ביטול";
        pbb.appendChild(bPrint);
        pbb.appendChild(bPdf);
        pbb.appendChild(bNo);
        pbox.appendChild(pt);
        pbox.appendChild(pn);
        pbox.appendChild(pbb);
        pdlg.appendChild(pbox);
        document.body.appendChild(pdlg);
        const closeP = () => {
          pdlg.style.display = "none";
          try { if (pdlg.contains(document.activeElement)) document.activeElement.blur(); } catch (_) {}
          if (!busy) drop();
        };
        // the call is made at once, inside the click (the user's gesture); then the choice closes and the page waits for the answer
        const runOtz = (method, params) => {
          if (busy) return;
          busy = true;
          bPrint.disabled = bPdf.disabled = true;
          let p;
          try {
            p = window.Otzaria.call(method, params);
          } catch (e) {
            p = Promise.resolve({ success: false, error: { message: e && e.message ? e.message : String(e) } });
          }
          pdlg.style.display = "none";
          Promise.resolve(p).then((res) => {
            if (res && res.success === false) {
              const code = res.error ? res.error.code || res.error.message || "" : "";
              if (code) console.warn("[ui.js] " + method + ": " + code);
              tmToast(code === "error.conflict" ? "חלון אחר פתוח כעת, נסו שוב אחריו" : method === "ui.exportPdf" ? "השמירה לא נפתחה, נסו שוב" : "ההדפסה לא נפתחה, נסו שוב");
            } else if (method === "ui.exportPdf" && res && res.data && res.data.saved) {
              tmToast("נשמר" + (res.data.name ? ": " + res.data.name : ""));
            }
          }, (e) => {
            console.warn("[ui.js] " + method + ": " + (e && e.message ? e.message : e));
            tmToast("ההדפסה לא נפתחה, נסו שוב");
          }).then(() => {
            busy = false;
            bPrint.disabled = bPdf.disabled = false;
            drop();
          });
        };
        bPrint.addEventListener("click", () => runOtz("ui.print", Object.assign({ jobName: fileName() }, PR_OPTS)));
        // 1.0.4 (the user's picture): in Otzaria 0.9.98.x ui.exportPdf opens a FOLDER picker and puts fileName into its folder box, which then
        // fails with "Path does not exist" - so no fileName: the person picks a folder and Otzaria names the file
        bPdf.addEventListener("click", () => runOtz("ui.exportPdf", Object.assign({ title: "שמירה כ-PDF" }, PR_OPTS)));
        bNo.addEventListener("click", closeP);
        pdlg.addEventListener("click", (e) => { if (e.target === pdlg) closeP(); });
        pdlg.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc") closeP();
        });
        pdlg.addEventListener("keyup", (e) => e.stopPropagation());
        plink.addEventListener("click", () => {
          if (busy) return;
          if (inOtz()) {
            build();   // the picture of the view as it is now, before the choice covers it
            bPrint.disabled = bPdf.disabled = false;
            pdlg.style.display = "flex";
            try { bPrint.focus(); } catch (_) {}
            return;
          }
          // outside Otzaria: the browser's own print, once the picture is decoded
          const page = build();
          const img = page.querySelector("img");
          let done = false;
          const fin = () => {
            if (done) return;
            done = true;
            window.removeEventListener("afterprint", fin);
            drop();
          };
          const go = () => {
            window.addEventListener("afterprint", fin);
            try { window.print(); } catch (_) {}
            setTimeout(fin, 1000);
          };
          const dec = img && typeof img.decode === "function" ? img.decode().catch(() => {}) : Promise.resolve();
          Promise.race([dec, new Promise((r) => setTimeout(r, 1500))]).then(go);
        });
      }
      // ===== 1.0.2 (item 1, the user: "התוסף בחנות כבר"): a report from inside the plugin. The plugin is in the Otzaria store, so
      // feedback.report (api.md: no permission; Otzaria shows its own confirmation with a preview; returns 'sent' | 'queued' | 'cancelled';
      // details up to 5000 characters; reportType bug | crash | content | other) reaches its developer. One quiet link at the panel's foot opens a
      // small form: the kind, the text and "שלח"; the details get the version, the view or the open card, the camera and the readings now
      // chosen. Outside Otzaria (no window.Otzaria.call: the standalone HTML file, a browser) there is no link. =====
      if (typeof window.Otzaria !== "undefined" && window.Otzaria && typeof window.Otzaria.call === "function") {
        const RT = [["content", "טעות במקור"], ["bug", "תקלה"], ["other", "הצעה"]];
        const link = document.createElement("button");
        link.type = "button";
        link.id = "tm-report-link";
        link.textContent = "דיווח";
        link.title = "דיווח על טעות או תקלה";
        topbarAdd(link, 40, "report", "דיווח");
        const dlg = document.createElement("div");
        dlg.id = "tm-report";
        dlg.setAttribute("role", "dialog");
        dlg.setAttribute("aria-label", "דיווח על טעות או תקלה");
        const box = document.createElement("div");
        box.className = "box";
        const hd = document.createElement("div");
        hd.className = "t";
        hd.textContent = "דיווח על טעות או תקלה";
        const ty = document.createElement("div");
        ty.className = "ty";
        let kind = "content";
        const tyBtns = RT.map(([k, label]) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = label;
          b.addEventListener("click", () => { kind = k; for (const o of tyBtns) o.classList.toggle("on", o === b); });
          ty.appendChild(b);
          return b;
        });
        tyBtns[0].classList.add("on");
        const ta = document.createElement("textarea");
        ta.maxLength = 3500;
        ta.placeholder = "מה לא נכון, ואיפה? (למשל: המקור, המידה או הכפתור)";
        ta.setAttribute("aria-label", "תוכן הדיווח");
        const note = document.createElement("div");
        note.className = "n";
        note.textContent = "יצורפו: גרסת התוסף, המבט או ההסבר הפתוח, והשיטות שנבחרו.";
        const bb = document.createElement("div");
        bb.className = "b";
        const send = document.createElement("button");
        send.type = "button";
        send.className = "y";
        send.textContent = "שלח";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "ביטול";
        bb.appendChild(send);
        bb.appendChild(cancel);
        box.appendChild(hd);
        box.appendChild(ty);
        box.appendChild(ta);
        box.appendChild(note);
        box.appendChild(bb);
        dlg.appendChild(box);
        document.body.appendChild(dlg);
        const closeDlg = () => {
          dlg.style.display = "none";
          try { if (dlg.contains(document.activeElement)) document.activeElement.blur(); } catch (_) {}
        };
        link.addEventListener("click", () => {
          dlg.style.display = "flex";
          send.disabled = false;
          try { ta.focus(); } catch (_) {}
        });
        cancel.addEventListener("click", closeDlg);
        dlg.addEventListener("click", (e) => { if (e.target === dlg) closeDlg(); });
        // typing in the form never turns the model (the arrow keys, + / -) and never reaches the presentation's keys; Esc closes it
        dlg.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc") closeDlg();
        });
        dlg.addEventListener("keyup", (e) => e.stopPropagation());
        // what the report is about, for the developer: the version, the open card or the marked view / place, the camera, the readings
        const context = () => {
          const L = [];
          const verEl = document.getElementById("version");
          const ver = ui_bootVersion || (verEl && verEl.textContent ? verEl.textContent.replace(/^v/, "") : "");
          L.push("גרסה: " + (ver || "לא ידועה"));
          if (xOpen) L.push("הסבר פתוח: " + xTitle.textContent);
          if (cardSpr) L.push("תווית פתוחה: " + cardTitle.textContent);
          const on = btns.concat(placeBtns).find((b) => b.classList.contains("on"));
          if (on) L.push("מבט / מקום: " + on.textContent.replace(/\d+$/, "").trim());
          try {
            const r1 = (v) => [v.x, v.y, v.z].map((n) => Math.round(n * 10) / 10).join(", ");
            L.push("מצלמה: " + r1(ctx.camera.position) + " ← " + r1(ctx.controls.target));
          } catch (_) {}
          const chosen = OPS.filter((r) => !r.disabled && r.cur != null).map((r) => (r.short || r.cap) + ": " + opsChip(r, r.cur));
          if (chosen.length) L.push("שיטות: " + chosen.join(" · "));
          return L.join("\n");
        };
        send.addEventListener("click", async () => {
          const text = ta.value.trim();
          if (!text) {
            tmToast("כתבו מה לדווח");
            try { ta.focus(); } catch (_) {}
            return;
          }
          send.disabled = true;
          const details = (text + "\n\n---\n" + context()).slice(0, 5000);
          let res = null;
          try {
            res = await window.Otzaria.call("feedback.report", { details, reportType: kind });
          } catch (e) {
            res = { success: false, error: { message: e && e.message ? e.message : String(e) } };
          }
          send.disabled = false;
          const st = typeof res === "string" ? res : res && typeof res.data === "string" ? res.data : null;
          if (st === "sent" || st === "queued") {
            tmToast(st === "sent" ? "הדיווח נשלח, תודה" : "יישלח כשיהיה חיבור");
            ta.value = "";
            closeDlg();
          } else if (st === "cancelled") {
            // Otzaria's own dialog was cancelled: the form stays as it was, nothing to say
          } else {
            // 1.0.2 (fix): the screen in plain Hebrew; the code (error.conflict, error.internal ...) goes to the console
            const code = res && res.error ? res.error.code || res.error.message || "" : "";
            if (code) console.warn("[ui.js] feedback.report: " + code);
            tmToast(code === "error.conflict" ? "הדיווח לא נשלח: חלון אישור אחר פתוח" : "הדיווח לא נשלח, נסו שוב מאוחר יותר");
          }
        });
      }
      // ===== 1.0.1-K: custom tooltips (the user: "בריחוף על כפתורי המצפן צריך להיות הסבר מה הם עושים") =====
      // Any element with data-tip - or a title, moved into data-tip on the first hover so the browser's own tooltip does not double it
      // (the presentation's buttons, the burger) - shows its short Hebrew sentence after 350 ms of hover, above it (below it near the
      // top edge), inside the window. On touch a long press (500 ms without moving) shows it for 3 s, and the click that ends that long
      // press is swallowed (a long press asks "what is this?", it does not press).
      const tipEl = document.createElement("div");
      tipEl.id = "tm-tip";
      tipEl.setAttribute("role", "tooltip");
      document.body.appendChild(tipEl);
      const tip = (el, text) => {
        if (!el || !text || typeof el.setAttribute !== "function") return el;
        try {
          el.setAttribute("data-tip", String(text));
          if (el.removeAttribute) el.removeAttribute("title");
          if (String(el.textContent || "").trim().length <= 2) el.setAttribute("aria-label", String(text));   // an icon button
        } catch (_) {}
        return el;
      };
      {
        let tipFor = null, tipTimer = null, hideTimer = null, lpTimer = null, lp = null, swallow = null, swallowT = null;
        const tipTarget = (node) => {
          for (let n = node; n && n.nodeType === 1 && n !== document.body; n = n.parentNode) {
            if (n.hasAttribute && (n.hasAttribute("data-tip") || n.hasAttribute("title"))) return n;
          }
          return null;
        };
        const textOf = (el) => {
          let t = el.getAttribute("data-tip");
          if (!t) {
            const ti = el.getAttribute("title");
            if (ti) {
              el.setAttribute("data-tip", ti);
              el.removeAttribute("title");
              t = ti;
            }
          }
          return t;
        };
        const hideTip = () => {
          clearTimeout(tipTimer);
          clearTimeout(hideTimer);
          tipTimer = hideTimer = null;
          tipEl.style.display = "none";
          tipFor = null;
        };
        const showTip = (el) => {
          const text = el && el.isConnected !== false ? textOf(el) : null;
          if (!text) return;
          ui_fillSrc(tipEl, text);
          tipEl.style.left = "0px";
          tipEl.style.top = "0px";
          tipEl.style.display = "block";
          const r = el.getBoundingClientRect(), tw = tipEl.offsetWidth, th = tipEl.offsetHeight, W = window.innerWidth, H = window.innerHeight;
          const x = Math.max(6, Math.min(W - tw - 6, r.left + r.width / 2 - tw / 2));
          let y = r.top - th - 8;
          if (y < 6) y = Math.min(H - th - 6, r.bottom + 8);
          tipEl.style.left = x.toFixed(0) + "px";
          tipEl.style.top = y.toFixed(0) + "px";
          tipFor = el;
        };
        document.addEventListener("pointerover", (e) => {
          if (e.pointerType === "touch") return;
          const el = tipTarget(e.target);
          if (el === tipFor && el) return;
          hideTip();
          if (!el || !textOf(el)) return;
          tipTimer = setTimeout(() => showTip(el), 350);
        }, true);
        document.addEventListener("pointerout", (e) => {
          if (e.pointerType === "touch") return;
          const el = tipTarget(e.target);
          if (!el) return;
          const to = e.relatedTarget;
          if (to && el.contains && el.contains(to)) return;
          hideTip();
        }, true);
        document.addEventListener("pointerdown", (e) => {
          clearTimeout(lpTimer);
          lp = null;
          // 1.0.1-K review (ui-5): a new press disarms the swallow of an earlier long press - Chromium ends a long touch with a
          // contextmenu / long-tap and NO click, and the flag then ate the user's next real tap on that button
          swallow = null;
          clearTimeout(swallowT);
          if (e.pointerType !== "touch") {
            hideTip();
            return;
          }
          const el = tipTarget(e.target);
          if (!el) return;
          lp = { x: e.clientX, y: e.clientY };
          lpTimer = setTimeout(() => {
            lp = null;
            showTip(el);
            swallow = el;
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hideTip, 3000);
          }, 500);
        }, true);
        document.addEventListener("pointermove", (e) => {
          if (lp && e.pointerType === "touch" && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10) {
            clearTimeout(lpTimer);
            lp = null;
          }
        }, true);
        for (const ev of ["pointerup", "pointercancel"]) {
          document.addEventListener(ev, (e) => {
            if (e.pointerType === "touch") {
              clearTimeout(lpTimer);
              lp = null;
              // the click that ends a long press comes right after its pointerup; if none comes, the swallow ends 400 ms later
              // (1.0.1-K review, ui-5; 400 ms = model choice)
              if (swallow) {
                clearTimeout(swallowT);
                swallowT = setTimeout(() => { swallow = null; }, 400);
              }
            }
          }, true);
        }
        document.addEventListener("click", (e) => {
          const s = swallow;
          swallow = null;
          if (s && s.contains && s.contains(e.target)) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
        window.addEventListener("blur", hideTip);
        document.addEventListener("scroll", hideTip, true);
        tip(burger, "הצג או הסתר את לוח הבקרה (המבטים, המקומות, השיטות והמקורות)");
      }
      // ===== camera steps (the nav buttons, the arrow keys, the compass) =====
      // 1.0.1-L (L.49, the user: "מהירות הסיבוב במודל 360 הוא מהיר מדי כברירת מחדל - האט אותו, וסיבוב איטי השאר כך"): the turn step 0.045 -> 0.025 rad,
      // the tilt step 0.035 -> 0.02 rad and the hold's repeat of the two turn buttons 40 -> 50 ms: 64 -> 29 degrees a second while held (a drag:
      // rotateSpeed 0.9 -> 0.5, 90-entry.js); "סיבוב איטי" (autoRotateSpeed 0.4) is unchanged
      // 1.0.1-L (Part 7, U1): indoors (ctx.camIndoors, 90-entry.js) the buttons and the keys turn the view round the camera's own place, as the drag does
      const orbitBy = (dir) => {
        const cam = ctx.camera, tg = ctx.controls.target;
        if (ctx.camIndoors && ctx.camIndoors()) {
          const dx = tg.x - cam.position.x, dz = tg.z - cam.position.z, a = dir * 0.025, c = Math.cos(a), s2 = Math.sin(a);
          tg.x = cam.position.x + dx * c + dz * s2;
          tg.z = cam.position.z - dx * s2 + dz * c;
          ctx.controls.update();
          return;
        }
        const ox = cam.position.x - tg.x, oz = cam.position.z - tg.z, a = dir * 0.025, c = Math.cos(a), s2 = Math.sin(a);
        cam.position.x = tg.x + ox * c + oz * s2;
        cam.position.z = tg.z - ox * s2 + oz * c;
        ctx.controls.update();
      };
      // 1.0.1-K: up / down - the camera rises or sinks around the target within the controls' polar limits
      const tiltBy = (dir) => {
        const cam = ctx.camera, c = ctx.controls, tg = c.target;
        const off = cam.position.clone().sub(tg);
        if (!(off.length() > 0)) return;
        const sph = new Spherical().setFromVector3(off);
        if (ctx.camIndoors && ctx.camIndoors()) {   // 1.0.1-L (Part 7, U1): the head turns up and down, the camera stays
          sph.phi = Math.max(0.06, Math.min(Math.PI - 0.06, sph.phi - dir * 0.02));
          off.setFromSpherical(sph);
          c.maxPolarAngle = Math.max(c.maxPolarAngle, sph.phi + 1e-4);
          tg.copy(cam.position).sub(off);
          c.update();
          return;
        }
        sph.phi = Math.max(c.minPolarAngle || 0.06, Math.min(c.maxPolarAngle || Math.PI * 0.495, sph.phi - dir * 0.02));
        off.setFromSpherical(sph);
        cam.position.copy(tg).add(off);
        c.update();
      };
      const zoomBy = (f) => {
        const cam = ctx.camera, tg = ctx.controls.target;
        const off = cam.position.clone().sub(tg);
        off.setLength(Math.min(ctx.controls.maxDistance || 2200, Math.max(ctx.controls.minDistance || 2, off.length() * f)));
        cam.position.copy(tg).add(off);
        ctx.controls.update();
      };
      // 1.0.1-K: turn the view to a heading (the compass letters). az = atan2(camera - target) in x / z: 0 = the camera south of the
      // target, looking north (north up on the compass); -PI/2 looking east, PI looking south, PI/2 looking west. Eased over 0.65 s;
      // a drag on the model stops it.
      let turnAnim = null;
      const turnTo = (azT) => {
        const cam = ctx.camera, tg = ctx.controls.target;
        const az0 = Math.atan2(cam.position.x - tg.x, cam.position.z - tg.z);
        let d = azT - az0;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        turnAnim = Math.abs(d) < 1e-3 ? null : { t0: performance.now(), dur: 650, az0, d, look: !!(ctx.camIndoors && ctx.camIndoors()) };
      };
      ctx.renderer.domElement.addEventListener("pointerdown", () => { turnAnim = null; });
      ctx.animated.push(function() {
        if (!turnAnim) return;
        const cam = ctx.camera, tg = ctx.controls.target;
        const k = Math.min(1, (performance.now() - turnAnim.t0) / turnAnim.dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const az = turnAnim.az0 + turnAnim.d * e, rh = Math.hypot(cam.position.x - tg.x, cam.position.z - tg.z);
        if (turnAnim.look) {   // 1.0.1-L (Part 7, U1)
          tg.x = cam.position.x - Math.sin(az) * rh;
          tg.z = cam.position.z - Math.cos(az) * rh;
        } else {
          cam.position.x = tg.x + Math.sin(az) * rh;
          cam.position.z = tg.z + Math.cos(az) * rh;
        }
        cam.lookAt(tg);
        if (k >= 1) turnAnim = null;
      });
      // ===== compass (1.0.1-K: four letters; a click on a letter turns the view toward it) =====
      const compass = document.createElement("div");
      compass.id = "tm-compass";
      tip(compass, "מצפן: החץ האדום והאות צ׳ מראים לאן הצפון במבט הנוכחי. לחיצה על אות מפנה את המבט לכיוון שלה.");
      const rotor = document.createElement("div");
      rotor.id = "tm-rotor";
      const arrow = document.createElement("div");
      arrow.className = "a";
      arrow.textContent = "▲";
      rotor.appendChild(arrow);
      const DIRS = [
        // [letter, name, x, y in the 56 px rotor, the heading to turn to]
        ["צ", "צפון", 28, 9, 0],
        ["מז", "מזרח", 47, 28, -Math.PI / 2],
        ["ד", "דרום", 28, 47, Math.PI],
        ["מע", "מערב", 9, 28, Math.PI / 2]
      ];
      const dirEls = [];
      for (const [letter, name, x, y, az] of DIRS) {
        const d = document.createElement("div");
        d.className = "d" + (letter === "צ" ? " n" : "");
        d.textContent = letter;
        d.style.left = x + "px";
        d.style.top = y + "px";
        d.setAttribute("role", "button");
        tip(d, name + " — לחץ כדי להפנות את המבט " + (name === "צפון" ? "צפונה" : name === "דרום" ? "דרומה" : name === "מזרח" ? "מזרחה (אל פתח הבית)" : "מערבה (אל קודש הקדשים)") + "; הסיבוב סביב מרכז המבט, בלי לשנות את הגובה והמרחק.");
        d.addEventListener("click", (e) => {
          e.stopPropagation();
          turnTo(az);
        });
        rotor.appendChild(d);
        dirEls.push(d);
      }
      compass.appendChild(rotor);
      document.body.appendChild(compass);
      // ===== nav buttons =====
      const nav = document.createElement("div");
      nav.id = "tm-nav";
      let resetAllBtn = null;
      {
        const mk = (txt, ttl, fn, rep) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = txt;
          tip(b, ttl);
          let iv = null;
          const stop = () => {
            if (iv) {
              clearInterval(iv);
              iv = null;
            }
          };
          b.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            stop();
            fn();
            iv = setInterval(fn, rep || 40);
          });
          for (const ev of ["pointerup", "pointerleave", "pointercancel"]) b.addEventListener(ev, stop);
          nav.appendChild(b);
          return b;
        };
        mk("⟲", "סובב את המבט שמאלה סביב מרכזו (החזק להמשך). גם: מקש חץ שמאלה, או גרירה במודל.", () => orbitBy(-1), 50);
        mk("⟳", "סובב את המבט ימינה סביב מרכזו (החזק להמשך). גם: מקש חץ ימינה, או גרירה במודל.", () => orbitBy(1), 50);
        mk("+", "קרב את המבט (החזק להמשך). גם: גלגלת העכבר, צביטה או גלילה בשתי אצבעות על משטח המגע, ומקש +.", () => zoomBy(0.97));
        mk("−", "הרחק את המבט (החזק להמשך). גם: גלגלת העכבר, צביטה או גלילה בשתי אצבעות על משטח המגע, ומקש −.", () => zoomBy(1.03));
        const sp = document.createElement("span");
        sp.className = "sp";
        nav.appendChild(sp);
        const rb = document.createElement("button");
        rb.type = "button";
        rb.id = "tm-nav-ruler";
        rb.textContent = "📏";
        tip(rb, "מדידה באמות: לחץ על שתי נקודות במודל, והמרחק ביניהן יוצג (גם האופקי והגובה). לחיצה נוספת על הכפתור מסיימת.");
        rb.addEventListener("click", () => mSet(!mOn));
        nav.appendChild(rb);
        // 1.0.1-K (Yossi): the wall fade - on / off, and its distance
        const fs = ctx.shared.fadeState;
        const fadeBtn = document.createElement("button");
        fadeBtn.type = "button";
        fadeBtn.id = "tm-fade-toggle";
        fadeBtn.className = "tm-txt";
        // 1.0.2 (D): three states from the same button - "פועל" (the court and mount walls, as before; the default), "גם קיר מסתיר" (also a
        // wall of the house, the ulam, the chambers or the palace that hides what is looked at), "כבוי"; a click goes on to the next
        tip(fadeBtn, "טשטוש חומות: כשחומה עומדת בין המצלמה לבין מה שמביטים בו, היא נעשית שקופה למחצה — ונשארת נראית. לחיצה נוספת: גם קיר מסתיר — גם קיר של הבית, האולם, התאים או הארמון שמסתיר את מה שמביטים בו נעשה שקוף, וחוזר כשאינו מסתיר עוד. לחיצה נוספת: כבוי — החומות חוסמות את המבט כמו במציאות.");
        const grp = document.createElement("span");
        grp.className = "tm-grp";
        // 1.0.1-K review (ui-3): the far setting fades only walls that hide what is looked at (not those behind it) - the text says so
        tip(grp, "מרחק טשטוש: חומה שמסתירה את מה שמביטים בו מיטשטשת רק כשהיא בטווח הזה מן המצלמה (באמות). פחות — רק חומות קרובות; יותר — גם חומות רחוקות.");
        const cap = document.createElement("span");
        cap.className = "cap";
        cap.textContent = "מרחק טשטוש";
        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        tip(minus, "הקטן את מרחק הטשטוש: רק חומות קרובות יותר יהיו שקופות");
        const val = document.createElement("span");
        val.className = "v";
        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        tip(plus, "הגדל את מרחק הטשטוש: גם חומות רחוקות יותר יהיו שקופות כשהן מסתירות");
        grp.appendChild(cap);
        grp.appendChild(plus);
        grp.appendChild(val);
        grp.appendChild(minus);
        const paintFade = () => {
          fadeBtn.textContent = fs.on && fs.hide ? "טשטוש: גם קיר מסתיר" : "טשטוש חומות: " + (fs.on ? "פועל" : "כבוי");
          fadeBtn.classList.toggle("on", !!fs.on);
          val.textContent = fs.dist + " אמה";
          grp.classList.toggle("off", !fs.on);
          minus.disabled = fs.dist <= UI_FADE_STOPS[0];
          plus.disabled = fs.dist >= UI_FADE_STOPS[UI_FADE_STOPS.length - 1];
        };
        const stepDist = (dir) => {
          let i = UI_FADE_STOPS.indexOf(fs.dist);
          if (i < 0) i = UI_FADE_STOPS.findIndex((v) => v >= fs.dist);
          if (i < 0) i = UI_FADE_STOPS.length - 1;
          fs.dist = UI_FADE_STOPS[Math.max(0, Math.min(UI_FADE_STOPS.length - 1, i + dir))];
          lsSet("tm1.fade.dist", fs.dist);
          paintFade();
        };
        fadeBtn.addEventListener("click", () => {
          // פועל -> גם קיר מסתיר -> כבוי -> פועל
          if (fs.on && !fs.hide) fs.hide = true;
          else if (fs.on) { fs.on = false; fs.hide = false; }
          else fs.on = true;
          lsSet("tm1.fade.on", fs.on ? "1" : "0");
          lsSet("tm1.fade.hide", fs.hide ? "1" : "0");
          paintFade();
        });
        minus.addEventListener("click", () => stepDist(-1));
        plus.addEventListener("click", () => stepDist(1));
        paintFade();
        nav.appendChild(fadeBtn);
        nav.appendChild(grp);
        ctx.shared.fadeState.repaint = paintFade;
        // "↺ החזר הכל" - while anything of the on-model buttons is on (see the registry below)
        resetAllBtn = document.createElement("button");
        resetAllBtn.type = "button";
        resetAllBtn.id = "tm-reset-all";
        resetAllBtn.className = "tm-txt";
        resetAllBtn.textContent = "↺ החזר הכל";
        tip(resetAllBtn, "מחזיר את המודל למצבו הרגיל: סוגר את כל מה שנפתח או הוסר בכפתורים שעל המודל (הבית, קירות היציע, האולם, הנסרים, החתך והתצוגות שעל המודל) ומחזיר את הענן.");
        nav.appendChild(resetAllBtn);
        document.body.appendChild(nav);
      }
      if (ctx.camera && ctx.controls && ctx.controls.target) {
        let lastAz = null;
        ctx.animated.push(function() {
          const az = Math.atan2(
            ctx.camera.position.x - ctx.controls.target.x,
            ctx.camera.position.z - ctx.controls.target.z
          );
          // az = the clockwise screen angle of north (+z = south: the camera due south of the target gives 0deg and the "▲" points
          // straight up); the Second Temple's "+ 180" (ref-ui-bayit2.js) turned the needle to the south in this coordinate frame.
          // 1.0.1-K: the letters turn with the rotor and are turned back so they stay upright
          const deg = (az * 180 / Math.PI).toFixed(1);
          if (deg === lastAz) return;
          lastAz = deg;
          rotor.style.transform = "rotate(" + deg + "deg)";
          for (const d of dirEls) d.style.transform = "rotate(" + (-deg) + "deg)";
        });
      }
      // ===== 1.0.1-K: on-model buttons (FIXES-1.0.1-K.md 0.5b; the user: "הכפתור צריך להיות על המיצג ולא בתוכן הענינים") =====
      // Registry ctx.shared.modelButtons: { id, label, labelOn, title, anchor: [x,y,z] | () => [x,y,z] | null, maxDist (150), get, set,
      // layer? | layers? }. A pill is drawn per entry at the projected anchor while the anchor is given (a function may return null =
      // not now), in front of the camera, inside the view, closer than maxDist and its layer(s) visible; it reads labelOn while get() is
      // true and calls set(!get()) on a click; title is its tooltip. Build modules register their own entries (before or after the UI);
      // the UI registers the cloud and the four removals. Overlapping pills are pushed apart vertically. Internal extras (the UI's own
      // entries only): show() - an extra condition, scale() - a size factor.
      const MB = Array.isArray(ctx.shared.modelButtons) ? ctx.shared.modelButtons : (ctx.shared.modelButtons = []);
      {
        const visUp = (o) => {
          for (; o; o = o.parent) if (o.visible === false) return false;
          return true;
        };
        const hwTop = Array.isArray(CO.HOUSE_WALL) && CO.HOUSE_WALL.length ? CO.HOUSE_WALL[CO.HOUSE_WALL.length - 1] : 4;   // the house wall above the chambers' roof
        const HW2 = (typeof CO.HOUSE_W === "number" ? CO.HOUSE_W : 20) / 2;                                                   // the house's inner half width (I Kings 6:2)
        const midX = typeof CO.xKodeshE === "number" && typeof CO.xKodeshW === "number" ? (CO.xKodeshE + CO.xKodeshW) / 2 : -23.5;   // mid-kodesh
        const zYS = typeof CO.zHouseS === "number" ? CO.zHouseS : 27;                                                          // the chambers' south outer face
        const xYW = typeof CO.xHeiW === "number" ? CO.xHeiW : -80.5;                                                            // the chambers' west outer face
        const frT = fps.forestRoof && Array.isArray(fps.forestRoof.target) ? fps.forestRoof.target : [103, 21, 509.5];
        // fallback anchors, used only while ctx.shared.anchors (50-heichal.js / 60-palace.js) lacks the point - on the visible outside
        const ANCH_FB = {
          houseSouth: [midX, LVL.HEI + 26, HW2 + hwTop + 0.5],   // the house's south face above the chambers' roof (y 38)
          yatziaSouth: [midX, LVL.HEI + 7.5, zYS + 0.5],          // the chambers' south outer wall, at its middle storey
          ulamFront: [(typeof CO.xUlamE === "number" ? CO.xUlamE : 18.5) + 0.5, LVL.HEI + 26.5, 0],   // the ulam front above its doorway (1.0.1-L, L.59: 22 high, its lintel to 35; 50-heichal.js anchors.ulamFront y 38.5)
          forestRoof: [frT[0], frT[1] + 2, frT[2]]               // the roof of בית יער הלבנון
        };
        const anchorPt = (name) => {
          const a0 = ctx.shared.anchors && ctx.shared.anchors[name];
          let a = a0;
          try { if (typeof a0 === "function") a = a0(); } catch (_) { a = null; }
          if (Array.isArray(a) && a.length >= 3 && isFinite(a[0] + a[1] + a[2])) return a;
          if (a && typeof a.x === "number" && isFinite(a.x + a.y + a.z)) return [a.x, a.y, a.z];
          return ANCH_FB[name];
        };
        const camP = () => ctx.camera.position;
        const yatziaPts = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];   // the chambers' south / north / west faces
        const has = (list) => cutList(list).length > 0;
        const reg = (b) => {
          if (!MB.some((x) => x && x.id === b.id)) MB.push(b);
        };
        // the cloud (1.0.19's button, now one of the pills; the removal asks first, as before)
        reg({
          id: "ui-cloud", label: "☁ הסר ענן", labelOn: "☁ החזר את הענן", removal: true,
          title: "קודש הקדשים מכוסה בענן מפני כבוד המקום — 'והענן מלא את בית ה׳' (מלכים א ח, י–יא). הסרת הענן מבקשת אישור; הענן חוזר כשמתרחקים, או בלחיצה על 'החזר את הענן'.",
          anchor: [KKC.x, KKC.y, KKC.z], maxDist: 1e9, occlude: false,   // the cloud has its own ray test (cloudSeen)
          get: () => !cloudOn,
          set: (on) => { if (on) askRemoveCloud(() => setCloud(false)); else setCloud(true); },
          show: () => cloudSeen.show, scale: () => cloudSeen.scale
        });
        // the house: its south wall, its roof and the interior pieces on that side (ctx.cutaway) - seen from the south or from above
        if (has(ctx.cutaway)) reg({
          id: "ui-house", label: "פתח את הבית", labelOn: "סגור את הבית", removal: true, maxDist: 200,
          title: "פותח את הבית לצפייה בפנים: מסיר את הקיר הדרומי, את הגג ואת החלקים שבצד הדרום. כלי צפייה בלבד — הבית סגור מכל צדדיו (מלכים א ו, ב–י); המבטים שבפנים מצולמים מתוך הבית הסגור.",
          anchor: () => {
            const a = anchorPt("houseSouth"), c = camP();
            return c.z > a[2] - 1 || c.y > a[1] + 12 ? a : null;
          },
          get: () => cutOn, set: (on) => setCutaway(on)
        });
        // the chambers' outer walls, all three sides (ctx.yatziaCut): the pill sits on the side the camera looks at
        if (has(ctx.yatziaCut)) reg({
          id: "ui-yatzia", label: "הסר את קירות היציע", labelOn: "החזר את קירות היציע", removal: true, maxDist: 200,
          title: "מסיר את הכתלים החיצוניים של התאים (בדרום, בצפון ובמערב) כדי לראות את שלוש הקומות — חמש, שש ושבע אמות — והקורות הנחות על המגרעות; הגג נשאר. כלי צפייה בלבד: 'ויבן על קיר הבית יציע סביב' (מלכים א ו, ה–י).",
          anchor: () => {
            const a = anchorPt("yatziaSouth"), c = camP(), zf = Math.abs(a[2]);
            const side = c.z > zf - 1 ? 0 : c.z < -(zf - 1) ? 1 : c.x < xYW + 1 ? 2 : -1;
            if (side < 0) return null;
            const p = yatziaPts[side];   // reused arrays: no allocation per frame
            p[0] = side === 2 ? xYW - 0.5 : a[0];
            p[1] = a[1];
            p[2] = side === 0 ? zf : side === 1 ? -zf : 0;
            return p;
          },
          get: () => yatziaOpen, set: (on) => setYatziaCut(on)
        });
        // the ulam: its front wall with the doorway, and its roof (ctx.ulamCut) - seen from the east
        if (has(ctx.ulamCut)) reg({
          id: "ui-ulam", label: "פתח את האולם", labelOn: "סגור את האולם", removal: true, maxDist: 150,
          title: "מסיר את חזית האולם ואת גגו כדי לראות את יכין ובועז ואת פתח ההיכל. כלי צפייה בלבד — האולם סגור מלבד פתחו (מלכים א ו, ג; ז, כא).",
          anchor: () => {
            const a = anchorPt("ulamFront"), c = camP();
            return c.x > a[0] - 1 ? a : null;
          },
          get: () => ulamOpen, set: (on) => setUlamCut(on)
        });
        // the boards of the roofing of בית יער הלבנון (ctx.forestBoardsCut) - seen from above, with the palace layer on.
        // 1.0.1-K review (palace-courts-5): the tooltip follows the reading shown (a getter: the renderer reads b.title every frame and
        // re-sets the tip only when it changes; two constant strings, no allocation) - Rashi: without the 45 boards and the thin boards
        // the עבים, the small beams with their ledges and the upper storey are seen, his כרותות stay under the upper floor (60-palace.js
        // y 0..1, the floor 1..1.5); the second reading: without the boards and the stone roof, the כרותות on the pillars
        const BOARDS_TIP = {
          rashi: "מסיר את 45 נסרי הסיפון ואת הנסרים הדקים (מלכים א ז, ג–ד) — ונראים המרישין הקטנים ושקופיהם (רש״י ז, ד) והקומה העליונה; הכרותות שמעמוד לעמוד (רש״י ז, ב) נשארות מתחת לרצפתה. כלי צפייה בלבד.",
          metzudot: "מסיר את 45 הלוחות ואת גג האבן — ונראות הכרותות שעל העמודים: 'והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה' (רלב״ג ז, ג). כלי צפייה בלבד.",
          // 1.0.1-L (L.20; verify-palace Follow-ups §2): the third reading
          mzd: "מסיר את 45 לוחות הארז של התקרה — ונראות הצלעות שמטור לטור והכרותות שעל העמודים: 'השכיבו צלעות ונסרים, להיות מחיצות הבית ממעל, ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה' (מצודת דוד ז, ג). כלי צפייה בלבד."
        };
        if (has(ctx.forestBoardsCut)) reg({
          id: "ui-boards", label: "הסר את הנסרים", labelOn: "החזר את הנסרים", removal: true, maxDist: 150, layer: "palace",
          get title() { return BOARDS_TIP[fhCur()] || BOARDS_TIP.rashi; },
          anchor: () => {
            const a = anchorPt("forestRoof"), c = camP();
            return c.y > a[1] - 2 ? a : null;
          },
          get: () => boardsOff, set: (on) => setBoardsOff(on)
        });
        // 1.0.1-L (L.90, the user: "כל פעם שיש הסרת תצוגה זה אמור להוביל לכך שהמסך יראה את התצוגה עצמה, לדוג' הסרת קירוי המסך אמור לעבור למבט מלמעלה"):
        // a table by pill id: on switching on, the camera flies to a view that shows what was revealed; on switching off it returns to where it was.
        // Only a click on the pill itself does this (revealPress, from pillFor): the presentation calls b.set or the shared objects directly, so
        // it does not fly; a removal stays only by the pill. fp = a fly point; cam() = a camera of this table (each checked in a picture: model
        // choice); own: the module's set() already flies there; the flight back here replaces any flight of its own (the section's to heichalSouth).
        const REVEAL = {
          "ui-cloud": { fp: "kodeshHakodashim" },
          "ui-house": { cam: () => ({ pos: [-30, 100, 50], target: [-30, 14, -1] }) },                          // from the south and above: over the chambers' roof, into the opened house
          "ui-yatzia": { cam: () => ({ pos: [-112, 36, 66], target: [-52, 20, 16] }) },                         // from the south-west: the south and the west chambers without their walls
          "ui-ulam": { cam: () => ({ pos: [62, 34, 16], target: [8, 23, 0] }) },                                // from the east, over the altar: יכין ובועז and the door of the heichal
          // the user's own example: from above. The roof's height follows the reading (fp forestRoof)
          "ui-boards": { cam: () => { const t = resolveFp("forestRoof").target; return { pos: [t[0] - 8, t[1] + 128, t[2] + 40], target: [t[0], t[1] - 6, t[2] - 3] }; } },
          "hei-yatzia-section": { own: true },
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
          "mnt-lishka-roofs-n": { cam: () => ({ pos: [195, 92, -21], target: [163, 5, -61.5] }) },             // from above, into the outer court's northern pair
          "mnt-lishka-roofs-s": { cam: () => ({ pos: [195, 92, 21], target: [163, 5, 61.5] }) },               // the southern pair
          palaceThroneAscent: { own: true },
          palaceThroneWitnesses: { own: true }
        };
        const revealView = (id) => {
          const R = REVEAL[id];
          if (!R) return null;
          if (R.cam) return R.cam();
          return R.fp ? resolveFp(R.fp) : null;
        };
        const revealSaved = new Map();   // pill id -> the camera before it was switched on, in the order of switching
        // 1.0.1-L (the user: "כל קירוי שנפתח צריך להיסגר אחרי 30 שניות"): a roof opened by its pill closes by itself after 30 s, and the view returns
        const ROOF_PILLS = new Set(["ui-house", "ui-ulam", "ui-boards", "palaceKingRoofs", "palacePharaohRoof", "palaceThroneRoofs", "crt-gazit-roof", "mnt-lishka-roofs-n", "mnt-lishka-roofs-s"]);
        const roofTimers = new Map();
        const roofDisarm = (id) => { if (roofTimers.has(id)) { clearTimeout(roofTimers.get(id)); roofTimers.delete(id); } };
        const roofArm = (b) => {
          roofDisarm(b.id);
          if (!ROOF_PILLS.has(b.id)) return;
          roofTimers.set(b.id, setTimeout(() => {
            roofTimers.delete(b.id);
            if (!b.get()) return;
            try { revealPress(b); } catch (err) { console.warn("[ui.js] roof timer " + b.id + ":", err && err.message); }
            frame(true);
          }, 30000));
        };
        const revealGo = (id) => {
          const f = revealView(id);
          if (f) fly(f.pos, f.target);
        };
        const revealPress = (b) => {
          const id = b.id, R = REVEAL[id];
          const pose = { pos: ctx.camera.position.toArray(), target: ctx.controls.target.toArray() };
          const was = !!b.get();
          // the cloud's removal asks first: the flight comes with the answer
          if (id === "ui-cloud" && !was) {
            askRemoveCloud(() => {
              setCloud(false);
              revealSaved.delete(id);
              revealSaved.set(id, pose);
              revealGo(id);
              frame(true);
            });
            return;
          }
          b.set(!was);
          if (!R) return;
          const now = !!b.get();
          if (now && !was) {
            revealSaved.delete(id);
            revealSaved.set(id, pose);
            if (!R.own) revealGo(id);
            roofArm(b);
          } else if (!now && was) {
            roofDisarm(id);
            const back = revealSaved.get(id);
            revealSaved.delete(id);
            if (back) realFly(back.pos, back.target);
          }
        };
        // the renderer
        const PILL_FEATURE = { "hei-yatzia-section": "yatziaSection", wallLayers: "wallLayers", incenseAltarLayers: "incenseAltar.layers", palaceThroneAscent: "throne.ascent" };   // 1.0.1-L (L.27)
        const pills = new Map();   // entry -> { el, text, on, disp, x, y, sc, w, h }
        const pv = new Vector3(), pc = new Vector3();
        const pillFor = (b) => {
          let st = pills.get(b);
          if (st) return st;
          const el = document.createElement("button");
          el.type = "button";
          el.className = "tm-pill";
          if (b.id === "ui-cloud") el.id = "tm-cloud-btn";
          else if (b.id) el.setAttribute("data-mb", String(b.id));
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            // 1.0.1-L (L.27): the feature's own pill cancels the place's 15-second timer; the user's state stays
            if (PILL_FEATURE[b.id]) autoOff.cancel(PILL_FEATURE[b.id]);
            try {
              revealPress(b);   // 1.0.1-L (L.90)
            } catch (err) {
              console.warn("[ui.js] model button " + b.id + ":", err && err.message);
            }
            frame(true);
          });
          document.body.appendChild(el);
          st = { el, text: null, on: null, disp: "none", x: -1, y: -1, sc: 1, w: 80, h: 24, tip: null, occ: null, occAt: 0 };
          pills.set(b, st);
          return st;
        };
        // a pill whose anchor is hidden behind a solid part of the model is not shown either (from the front, the ulam hides the house's
        // south face: no "פתח את הבית" floating on the ulam). A throttled ray test (every 6th frame per pill) against the large plain
        // meshes, as the cloud's; a faded (transparent) wall does not hide; a hit within 1.5 amot of the anchor does not count (an anchor
        // sits on its own face); an entry may opt out with occlude: false
        const oRay = new Raycaster(), oDir = new Vector3();
        let oTargets = null, oTargetsAt = -1e9, frameNo = 0;
        const bigMeshes = () => {
          const now = performance.now();
          if (oTargets && now - oTargetsAt < 4000) return oTargets;
          oTargetsAt = now;
          oTargets = [];
          const bb = new Box3(), sz = new Vector3();
          ctx.scene.traverse((o) => {
            if (!o.isMesh || o.isInstancedMesh || !o.geometry) return;
            for (let p = o; p; p = p.parent) if (p.name === "tm-kk-cloud" || p.name === "tm-measure") return;
            const pa = o.geometry.attributes && o.geometry.attributes.position;
            if (pa && pa.count > 30000) return;   // the terrain
            if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
            bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
            if (Math.max(sz.x, sz.y, sz.z) < 6) return;
            oTargets.push(o);
          });
          return oTargets;
        };
        const occluded = (a) => {
          const cam = ctx.camera.position;
          oDir.set(a[0] - cam.x, a[1] - cam.y, a[2] - cam.z);
          const L = oDir.length();
          if (!(L > 2)) return false;
          oRay.set(cam, oDir.multiplyScalar(1 / L));
          oRay.near = 0;
          oRay.far = L - 1.5;
          for (const hh of oRay.intersectObjects(bigMeshes(), false)) {
            const o = hh.object;
            if (!visUp(o)) continue;
            const m = Array.isArray(o.material) ? o.material[0] : o.material;
            if (m && (m.visible === false || (m.transparent && m.opacity <= 0.5))) continue;
            return true;
          }
          return false;
        };
        const layerVis = (l) => {
          const g = ctx.layers && ctx.layers[l];
          return !!g && visUp(g);
        };
        const scr = [0, 0];   // the screen point of place() (reused)
        const place = (b, st, force) => {
          if (!b || typeof b.get !== "function" || typeof b.set !== "function") return null;
          if (b.layer && !layerVis(b.layer)) return null;
          if (Array.isArray(b.layers)) for (const l of b.layers) if (!layerVis(l)) return null;
          if (typeof b.show === "function" && !b.show()) return null;
          let a = b.anchor;
          if (typeof a === "function") a = a();
          if (!Array.isArray(a) || a.length < 3 || !isFinite(a[0] + a[1] + a[2])) return null;
          const cam = ctx.camera;
          pv.set(a[0], a[1], a[2]);
          if (pv.distanceTo(cam.position) > (typeof b.maxDist === "number" ? b.maxDist : 150)) return null;
          pc.copy(pv).applyMatrix4(cam.matrixWorldInverse);
          if (pc.z > -0.5) return null;                       // behind the camera
          pv.project(cam);
          if (Math.abs(pv.x) > 0.96 || Math.abs(pv.y) > 0.94) return null;   // outside the view
          if (b.occlude !== false) {
            if (force || st.occ == null || frameNo - st.occAt >= 6) {
              st.occ = occluded(a);
              st.occAt = frameNo;
            }
            if (st.occ) return null;
          }
          scr[0] = (pv.x * 0.5 + 0.5) * window.innerWidth;
          scr[1] = (-pv.y * 0.5 + 0.5) * window.innerHeight;
          return scr;
        };
        const resetAll = () => {
          autoOff.flush();   // 1.0.1-L (L.27): what a place switched on goes back now (the tables of the ulam have no pill), and no timer stays
          for (const b of MB.slice()) {
            try {
              if (b && typeof b.get === "function" && typeof b.set === "function" && b.get()) b.set(false);
            } catch (_) {}
          }
          revealSaved.clear();   // 1.0.1-L (L.90)
          frame(true);
        };
        // 1.0.1-L (L.90): the button of the panel returns to where the first of them was switched on; ctx.ui.resetAll (the presentation) does not fly
        resetAllBtn.addEventListener("click", () => {
          const first = revealSaved.values().next().value;
          resetAll();
          if (first) realFly(first.pos, first.target);
        });
        let anyOnShown = null;
        const rects = [];   // the screen rectangles of the pills placed in this frame (a pool, reused every frame)
        const frame = (force) => {
          const cam = ctx.camera;
          cam.updateMatrixWorld();
          frameNo++;
          let nPlaced = 0;
          let anyOn = false;
          for (const b of MB) {
            if (!b || typeof b.get !== "function") continue;
            let on = false;
            try { on = !!b.get(); } catch (_) {}
            if (on) anyOn = true;
            const st = pillFor(b);
            let p = null;
            try { p = place(b, st, force); } catch (_) { p = null; }
            const text = String((on ? b.labelOn || b.label : b.label) || b.id || "");
            if (st.text !== text) {
              st.text = text;
              ui_fillSrc(st.el, text);
              st.w = 0;
            }
            const t = b.title ? String(b.title) : "";
            if (st.tip !== t) {
              st.tip = t;
              if (t) tip(st.el, t);
            }
            if (st.on !== on) {
              st.on = on;
              st.el.classList.toggle("on", on);
            }
            if (!p) {
              if (st.disp !== "none") {
                st.disp = "none";
                st.el.style.display = "none";
              }
              continue;
            }
            if (st.disp !== "block") {
              st.disp = "block";
              st.el.style.display = "block";
            }
            if (!st.w) {
              st.w = st.el.offsetWidth || 8 * text.length + 24;   // measured once per text
              st.h = st.el.offsetHeight || 24;
            }
            const sc = typeof b.scale === "function" ? Math.max(0.5, Math.min(2, +b.scale() || 1)) : 1;
            const w = st.w * sc, h = st.h * sc;
            const x = p[0];
            let y = p[1];
            // push down below any pill already placed that it overlaps (in registration order)
            for (let k = 0; k < 8; k++) {
              let hit = null;
              for (let i = 0; i < nPlaced; i++) {
                const r = rects[i];
                if (Math.abs(r.x - x) * 2 < r.w + w + 4 && Math.abs(r.y - y) * 2 < r.h + h + 4) {
                  hit = r;
                  break;
                }
              }
              if (!hit) break;
              y = hit.y + (hit.h + h) / 2 + 4;
            }
            if (!rects[nPlaced]) rects[nPlaced] = { x: 0, y: 0, w: 0, h: 0 };
            const rr = rects[nPlaced++];
            rr.x = x;
            rr.y = y;
            rr.w = w;
            rr.h = h;
            if (force || Math.abs(st.x - x) > 0.5 || Math.abs(st.y - y) > 0.5 || st.sc !== sc) {
              st.x = x;
              st.y = y;
              st.sc = sc;
              st.el.style.left = x.toFixed(0) + "px";
              st.el.style.top = y.toFixed(0) + "px";
              st.el.style.transform = sc === 1 ? "translate(-50%,-50%)" : "translate(-50%,-50%) scale(" + sc.toFixed(2) + ")";
            }
          }
          // entries taken out of the registry: their pills go
          if (pills.size > MB.length) {
            for (const [b, st] of pills) {
              if (MB.indexOf(b) < 0) {
                st.el.remove();
                pills.delete(b);
              }
            }
          }
          if (anyOn !== anyOnShown) {
            anyOnShown = anyOn;
            resetAllBtn.style.display = anyOn ? "inline-block" : "none";
          }
        };
        ctx.animated.push(() => frame(false));
        ctx.shared.modelButtonsReset = resetAll;
        ctx.shared.revealViews = { ids: Object.keys(REVEAL), view: revealView, own: (id) => !!(REVEAL[id] && REVEAL[id].own) };   // 1.0.1-L (L.90): for the checks
      }
      // ===== 1.0.1-K: the arrow keys (review entry-arrow-keys-pan-and-swallow) =====
      // Left / right turn the view like the nav buttons, up / down raise or lower it, + / - zoom. Only while the focus is on the page, the
      // model or the nav / compass / pills: a focused panel button, the presentation's controls, a link or a form field keep their keys
      // (the panel scrolls with them); nothing happens while the cloud dialog is open; Ctrl / Alt / Meta combinations are the browser's.
      window.addEventListener("keydown", (e) => {
        if (e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey) return;
        const k = e.key;
        const act = k === "ArrowLeft" ? () => orbitBy(-1) : k === "ArrowRight" ? () => orbitBy(1) : k === "ArrowUp" ? () => tiltBy(1)
          : k === "ArrowDown" ? () => tiltBy(-1) : k === "+" || k === "=" ? () => zoomBy(0.94) : k === "-" || k === "_" ? () => zoomBy(1.06) : null;
        if (!act) return;
        if (cf.style.display === "flex") return;
        const ae = document.activeElement;
        const free = !ae || ae === document.body || ae === document.documentElement || ae === ctx.renderer.domElement ||
          !!(ae.closest && ae.closest("#tm-nav, #tm-compass, .tm-pill"));
        if (!free) return;
        const tg = e.target;
        if (tg && tg !== window && tg !== document && tg.nodeType === 1 && tg !== document.body && tg !== document.documentElement && tg !== ctx.renderer.domElement &&
          !(tg.closest && tg.closest("#tm-nav, #tm-compass, .tm-pill"))) return;
        e.preventDefault();
        turnAnim = null;
        act();
      });
      // 1.0.1-H: the UI's API for the presentation (75-tour.js): the views in order with their buttons, texts and sources, the opinions
      // table rows (OPS: cap, refs, options [[key, label, info]], onPick, mark, cur, fly, disabled), the info box, the source links, the
      // cloud confirmation state, the panel
      ctx.ui = {
        topbarAdd,            // 1.1.0: (el, order, icon, label) - a button into the top bar (75-tour.js: the presentation button)
        setTopBtn: ui_setTopBtn,
        views: ui_VIEWS,
        info: ui_INFO,
        refs: ui_REFS,
        viewButton: (key) => viewBtnByKey[key] || null,
        opinions: OPS,
        setInfo,
        refLinks,
        smallSources: ui_smallSources,   // 1.0.1-L (L.89): text -> HTML with the sources' brackets in a smaller font (75-tour.js)
        applyCut,    // 1.0.1-K: no-ops (navigation never opens anything); the removals are ctx.ui.removals / the on-model pills
        applyOpen,
        setLayer,
        fly,
        resolveFp,
        confirmOpen: () => cf.style.display === "flex",
        panel,
        burger,
        // 1.0.1-J: places by title (the place's own click logic: layers, fly, info) and the cloud
        placeButton: (t) => placeBtnByT[t] || null,
        place: (t) => placeItemByT[t] || null,
        placeTitles: () => Object.keys(placeBtnByT),
        // 1.0.1-L (the contract with 75-tour.js, brief-ui-shared.md): every place button in the panel's order: { title, group, view (a key of
        // ui_VIEWS or null), fp (a fly point key or null), info, refs, layer, feature (the ctx.shared key it switches on, or null), item }
        places: () => placeList.slice(),
        // 1.0.1-L (L.34): the floating explanation card: open(title, text or html, refs?, anchorElement?), close(), isOpen()
        card: { open: (title, content, refs, anchor) => xcardOpen(title, content, refs, anchor), close: xcardClose, isOpen: () => xOpen },
        // 1.0.1-L (L.27): the 15-second rule: { seconds, cancel(key?) - the timers go, the features stay, pending() - the features waiting for
        // their timer; arm / run / flush - the panel's own }
        autoOff,
        setCloud: (on) => setCloud(!!on),
        cloudOn: () => cloudOn,
        // 1.0.1-K (K.9a): the cloud dialog answered from outside ("ביטול" / closed with no answer), the custom tooltips, the removals,
        // the on-model buttons' registry and "↺ החזר הכל", the wall fade, the camera steps of the nav buttons / keys / compass
        cancelConfirm,
        closeConfirm,
        tip,
        tooltip: tip,
        modelButtons: MB,
        resetAll: () => { if (typeof ctx.shared.modelButtonsReset === "function") ctx.shared.modelButtonsReset(); },
        removals: {
          ids: () => Object.keys(REMOVALS),
          get: (id) => (id === "cloud" ? !cloudOn : !!(REMOVALS[id] && REMOVALS[id].isOn())),
          set: (id, on) => {
            if (id === "cloud") return void setCloud(!on);
            const R = REMOVALS[id];
            if (R && cutList(R.list()).length) R.set(!!on);
          },
          state: () => {
            const o = { cloud: !cloudOn };
            for (const k of Object.keys(REMOVALS)) o[k] = REMOVALS[k].isOn();
            return o;
          }
        },
        fade: {
          // 1.0.2 (D): hide = the mode "טשטוש: גם קיר מסתיר" (only while on)
          get: () => ({ on: !!ctx.shared.fadeState.on, hide: !!(ctx.shared.fadeState.on && ctx.shared.fadeState.hide), dist: ctx.shared.fadeState.dist, opacity: UI_FADE_OPACITY, stops: UI_FADE_STOPS.slice() }),
          set: (o) => {
            const fs = ctx.shared.fadeState;
            if (o && typeof o.on === "boolean") fs.on = o.on;
            if (o && typeof o.hide === "boolean") {
              fs.hide = o.hide;
              if (o.hide && typeof o.on !== "boolean") fs.on = true;
            }
            if (!fs.on) fs.hide = false;
            if (o && UI_FADE_STOPS.indexOf(o.dist) >= 0) fs.dist = o.dist;
            if (typeof fs.repaint === "function") fs.repaint();
          }
        },
        orbitBy,
        tiltBy,
        zoomBy,
        turnTo,
        // 1.0.1-K (K.9b): the info card next to a clicked label (the addendum C) - closed by the presentation's slides if it wants
        closeCard,   // (1.0.1-L: the label's card; the panel's explanation card is ctx.ui.card)
        cardOpen: () => !!cardSpr,
        // 1.0.1-K review (tour-8): the panel's "סיבוב איטי" - get() = its checkbox, set(on) = the checkbox AND controls.autoRotate together
        // (the box always shows what really turns; setting .checked fires no "change", so the row's handler does not run a second time)
        autoRotate: {
          get: () => !!(autoRotRow && autoRotRow.checked),
          set: (on) => {
            if (autoRotRow) autoRotRow.checked = !!on;
            setAutoRotate(!!on);
          }
        }
      };
      // ===== 1.0.2 (item 2, the user: "תוסיף כפתור בספרים הנ"ל"): the reading position from the book's button (ui_bookEvent at the top of
      // this file) -> ui_READ -> the panel's own button for it (a place by its title, or a view of the grid): the same fly, card and marking
      // as a click on it; a verse outside the table, or a position that cannot be read, gives the general view. It waits for the loading
      // screen (ent_load of 90-entry.js, when it is in scope); a running presentation stops first. A toast names the verse. =====
      {
        const loading = () => typeof ent_load !== "undefined" && !!ent_load && !!ent_load.loading;
        let lastKey = "", lastAt = 0;
        const readTarget = (r) => {
          const at = (v) => { for (const [c, a, b, t] of ui_READ[r.book] || []) if (c === r.ch && v >= a && v <= b) return t; return null; };
          return r.v === 0 ? at(1) || at(0) : at(r.v);   // the chapter's heading line: as its first verse (1.0.2 fix: before the 0-based catch-all ranges)
        };
        const goReading = (r) => {
          const k = r.book + ":" + r.ch + ":" + r.v, now = performance.now();
          if (k === lastKey && now - lastAt < 2000) return;   // the same click told twice (plugin.page_opened and the toolbar event)
          lastKey = k;
          lastAt = now;
          try {
            const T = ctx.shared.tour;
            if (T && typeof T.state === "function" && T.state().running && typeof T.stop === "function") T.stop();
          } catch (_) {
          }
          cancelConfirm();
          const t = r.ch ? readTarget(r) : null;
          const b = (t && t.p ? placeBtnByT[t.p] : t && t.v ? viewBtnByKey[t.v] : null) || viewBtnByKey.__general || null;
          if (b) b.click();
          else {
            fly(ui_GENERAL.pos, ui_GENERAL.target);
            setInfo("__general");
          }
          if (r.ch) tmToast((r.book === 10 ? "מלכים א " : "דברי הימים ב ") + ui_heNum(r.ch) + (r.v ? ", " + ui_heNum(r.v) : ""));
        };
        const whenReady = (r) => {
          let n = 0;
          const tick = () => {
            if (!loading()) return void goReading(r);
            if (++n < 480) setTimeout(tick, 250);   // up to 2 minutes behind the loading screen
          };
          tick();
        };
        ui_bookGo = whenReady;
        const q = ui_bookQueue.splice(0);
        if (q.length) whenReady(q[q.length - 1]);
        ctx.ui.reading = { go: (d) => ui_bookEvent(d), target: (book, ch, v) => readTarget({ book, ch, v }), lineToVerse: ui_lineToVerse };   // for the checks
      }
      // ===== 1.0.2 (C, "מה חדש"): on the first opening of a version that has a list in UI_NEWS, once the model is ready (the loading view
      // gone), a small window with the list and "סגירה"; never while the presentation runs or another window of the plugin is open (it
      // waits). The seen version is remembered at once when it shows: Otzaria's plugin storage (storage.get / storage.set; sdk.md: the
      // permissions plugin.storage.* are given to every plugin since 0.9.97 - none in manifest.json), with localStorage as the fallback and
      // the only store outside Otzaria. Either store saying "seen" is enough. The version: plugin.boot's, else UI_NEWS.ver. =====
      {
        const NEWS_KEY = "tm1.news.seen";
        const inOtz = typeof window.Otzaria !== "undefined" && !!window.Otzaria && typeof window.Otzaria.call === "function";
        const lsSeen = () => lsGet(NEWS_KEY);
        const storeSeen = async () => {
          if (!inOtz) return null;
          try {
            const res = await window.Otzaria.call("storage.get", { key: NEWS_KEY });
            return res && res.success !== false && typeof res.data === "string" ? res.data : null;
          } catch (_) {
            return null;
          }
        };
        const markSeen = (ver) => {
          lsSet(NEWS_KEY, ver);
          const nb0 = document.getElementById("tm-news-btn");   // 1.1.0 (the user): the bar's button goes once the news was seen
          if (nb0 && ver === UI_NEWS.ver) nb0.remove();
          if (inOtz) {
            try {
              Promise.resolve(window.Otzaria.call("storage.set", { key: NEWS_KEY, value: ver })).then((r) => {
                if (r && r.success === false) console.warn("[ui.js] storage.set: " + (r.error ? r.error.code || r.error.message || "" : ""));
              }, () => {});
            } catch (_) {
            }
          }
        };
        let newsSince = null;   // 1.0.6: the version seen before (set by tick), or null
        const show = (ver) => {
          const dlg = document.createElement("div");
          dlg.id = "tm-news";
          dlg.setAttribute("role", "dialog");
          dlg.setAttribute("aria-label", "מה חדש בגרסה " + ver);
          const box = document.createElement("div");
          box.className = "box";
          const t = document.createElement("div");
          t.className = "t";
          const cmpV = (a, b) => {
            const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
            for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
            return 0;
          };
          const known = !!newsSince && UI_NEWS_VERS.some((v) => v[0] === newsSince);
          const vers = UI_NEWS_VERS.filter((v) => cmpV(v[0], ver) <= 0 && (!known || cmpV(v[0], newsSince) > 0));
          t.textContent = known ? "מה חדש בגרסה " + ver : "מה חדש בתוסף";
          const ul = document.createElement("ul");
          for (const [vv, its] of vers) {
            if (vers.length > 1) {
              const lh = document.createElement("li");
              lh.className = "v";
              lh.textContent = "גרסה " + vv;
              ul.appendChild(lh);
            }
            for (const s2 of its) {
              const li = document.createElement("li");
              li.textContent = s2;   // (plain: a small bracket in a short list only looked broken)
              ul.appendChild(li);
            }
          }
          const bb = document.createElement("div");
          bb.className = "b";
          const ok = document.createElement("button");
          ok.type = "button";
          ok.className = "y";
          ok.textContent = "סגירה";
          bb.appendChild(ok);
          box.appendChild(t);
          box.appendChild(ul);
          box.appendChild(bb);
          dlg.appendChild(box);
          document.body.appendChild(dlg);
          const close = () => dlg.remove();
          ok.addEventListener("click", close);
          dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
          dlg.addEventListener("keydown", (e) => {
            e.stopPropagation();
            if (e.key === "Escape" || e.key === "Esc" || e.key === "Enter") close();
          });
          dlg.addEventListener("keyup", (e) => e.stopPropagation());
          dlg.style.display = "flex";
          try { ok.focus({ preventScroll: true }); } catch (_) {}
          markSeen(ver);
        };
        // ready = the loading view gone, no presentation running, no other window of the plugin open
        const ready = () => {
          if (typeof ent_load !== "undefined" && ent_load && ent_load.loading) return false;
          if (document.getElementById("loading")) return false;
          try {
            const T = ctx.shared.tour;
            if (T && typeof T.state === "function" && T.state().running) return false;
          } catch (_) {
          }
          for (const id of ["tm-confirm", "tm-report", "tm-printdlg"]) {
            const el = document.getElementById(id);
            if (el && el.style.display === "flex") return false;
          }
          return true;
        };
        let tries = 0;
        const tick = async () => {
          if (!ready()) {
            if (++tries < 3600) setTimeout(tick, 1000);   // up to an hour (a long presentation)
            return;
          }
          const ver = String(ui_bootVersion || UI_NEWS.ver).replace(/^v/, "");
          if (ver !== UI_NEWS.ver) return;   // a version with no list of its own
          let seen = lsSeen();
          if (seen !== ver) {
            const st = await storeSeen();
            if (st) seen = st;
          }
          if (seen === ver) {
            lsSet(NEWS_KEY, ver);
            return;
          }
          newsSince = seen || null;
          if (!ready()) {   // (the storage's answer took a moment)
            tries = 0;
            setTimeout(tick, 1000);
            return;
          }
          show(ver);
        };
        setTimeout(tick, 800);
        ctx.ui.news = { items: UI_NEWS.items.slice(), ver: UI_NEWS.ver, show: () => show(UI_NEWS.ver) };   // for the checks
        // 1.1.0: "מה חדש" in the top bar - until the news of this version was seen once (markSeen removes it; the user)
        if (lsSeen() !== UI_NEWS.ver) {
          const nb = document.createElement("button");
          nb.type = "button";
          nb.id = "tm-news-btn";
          nb.title = "מה חדש בתוסף, לפי גרסאות";
          topbarAdd(nb, 50, "news", "מה חדש");
          nb.addEventListener("click", () => {
            const open = document.getElementById("tm-news");
            if (open) { open.remove(); return; }
            newsSince = null;
            show(UI_NEWS.ver);
          });
        }
      }
    } catch (e) {
      if (typeof console !== "undefined") console.error("[ui.js]", e);
    }
  }
