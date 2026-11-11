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
  //   - L.85: arkInside is a removal, which stays by its pill; 1.3.3 (the user: "הצגת הארון במצגת צריך שיפתח לבד ללא לחיצה"): the slides of the ark
  //     (the place "מה שבתוך הארון", its tourFeature, and 8:6-9) open it by themselves, and it closes when the slide is left. A31: one slide per version, the
  //     ascent and then the witnesses. A32: the throne's long texts are short here (tour_SHORT); the whole text stays in the panel's card.
  //   - 1.0.2: the box starts 5 px below the fixed top bar of index.html (--topbar-h: 56 px, 44 px in a narrow window), as it did below the old 47 px header.
  var tour_PHONE_MQ = "(max-width:639px)";
  var tour_CSS = `
/* 1.1.0: #tm-tour-btn is a bar button (index.html header.topbar .tm-topbtn, via ctx.ui.topbarAdd); the menu hangs under the bar's
   button row (#tm-topbtns is position:relative), at its start edge (right, RTL), where the presentation button is */
#tm-tour-menu{position:absolute;top:calc(100% + 6px);right:0;left:auto;z-index:33;width:min(282px,calc(100vw - 20px));display:none;flex-direction:column;gap:5px;
  padding:7px;box-sizing:border-box;direction:rtl;text-align:right;background:rgba(12,16,24,.95);border:1px solid rgba(201,168,76,.55);
  border-radius:11px;backdrop-filter:blur(8px);box-shadow:0 8px 26px rgba(0,0,0,.5);font:13px 'Segoe UI',Arial,sans-serif;color:#e8dcae}
#tm-tour-menu .mh{font-size:11px;color:#b9ac82;padding:0 3px 1px}
#tm-tour-menu button{display:block;width:100%;text-align:right;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.3);
  border-radius:8px;padding:7px 9px;color:#e8dcae;cursor:pointer;font:inherit;direction:rtl}
#tm-tour-menu button:hover,#tm-tour-menu button:focus-visible{background:rgba(201,168,76,.26);outline:none}
#tm-tour-menu button b{display:block;color:#f3dc9a;font-size:13.5px;font-weight:700}
#tm-tour-menu button span{display:block;font-size:11.5px;color:#b9ac82;margin-top:2px;line-height:1.45}
#tm-tour-box{position:fixed;left:12px;top:calc(var(--topbar-h, 56px) + 5px);bottom:76px;width:min(300px,34vw);z-index:29;display:none;flex-direction:column;
  box-sizing:border-box;direction:rtl;text-align:right;background:rgba(12,16,24,.9);border:1px solid rgba(201,168,76,.55);border-radius:12px;
  overflow:hidden;backdrop-filter:blur(8px);color:#e8dcae;font:13px 'Segoe UI',Arial,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.45)}
#tm-tour-box .hd{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px 2px;font-size:11px;color:#b9ac82;flex:none}
#tm-tour-box .hd .part{color:#c9a84c;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
#tm-tour-box .hd .num{direction:ltr;unicode-bidi:isolate;white-space:nowrap;font-variant-numeric:tabular-nums}
#tm-tour-box .ttl{padding:3px 12px 0;font-size:16px;font-weight:700;color:#f3dc9a;line-height:1.35;flex:none}
#tm-tour-box .sub{padding:1px 12px 0;font-size:11.5px;color:#c9b98a;flex:none}
#tm-tour-box .wait{display:none;margin:6px 12px 0;padding:5px 8px;border-radius:7px;background:rgba(255,207,110,.12);
  border:1px solid rgba(255,207,110,.35);color:#ffcf6e;font-size:12px;line-height:1.45;flex:none}
#tm-tour-box .body{position:relative;flex:1 1 auto;min-height:0;overflow-y:auto;padding:8px 12px 6px;overscroll-behavior:contain}
#tm-tour-box .vs{font-family:var(--font-main,'Frank Ruhl Libre','David',serif),'David','Times New Roman',serif;font-size:17.5px;line-height:1.9;
  color:#f6ead0;margin-bottom:8px;padding-bottom:7px;border-bottom:1px solid rgba(201,168,76,.22)}
#tm-tour-box .vs:empty{display:none}
#tm-tour-box .vs .v{margin:0 0 3px}
#tm-tour-box .vs .vn{color:#c9a84c;font:600 12px 'Segoe UI',Arial,sans-serif;margin-left:5px;vertical-align:2px}
#tm-tour-box .vs .kt{color:#9a8f6c;font-size:.8em}
#tm-tour-box .txt{line-height:1.65}
#tm-tour-box .src{margin-top:8px;font-size:11px;color:#b9ac82;line-height:1.5}
#tm-tour-box .src a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;
  background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-tour-box .src a:hover{background:rgba(201,168,76,.3)}
#tm-tour-box .caps{margin-top:6px}
#tm-tour-box .caps:empty{display:none}
#tm-tour-box .caps .cap{margin:0 0 6px;padding:4px 8px;border-right:3px solid rgba(201,168,76,.3);border-radius:4px;line-height:1.6;color:#a89c78;
  font-family:var(--font-main,'Frank Ruhl Libre','David',serif),'David','Times New Roman',serif;font-size:14px}
#tm-tour-box .caps .cap.now{color:#f6ead0;border-right-color:#f3dc9a;background:rgba(201,168,76,.13)}
#tm-tour-box .bubw{display:none;position:relative;flex:none;flex-direction:column;min-height:0;max-height:34%;margin:7px 10px 13px}
#tm-tour-box .bubw.on{display:flex}
#tm-tour-box .bubw::before,#tm-tour-box .bubw::after{content:"";position:absolute;right:26px;width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent}
#tm-tour-box .bubw::before{bottom:-10px;border-top:10px solid #7fb4ee}
#tm-tour-box .bubw::after{bottom:-8px;border-top:9px solid #14304f}
#tm-tour-box .bub{flex:0 1 auto;min-height:0;overflow-y:auto;box-sizing:border-box;padding:7px 10px 8px;border-radius:14px;background:#14304f;
  border:1px solid #7fb4ee;color:#e4f0ff;font-size:12px;line-height:1.55;box-shadow:0 2px 10px rgba(0,0,0,.35)}
#tm-tour-box .bub .m{display:inline-block;margin-left:6px;padding:0 8px;border-radius:9px;background:#7fb4ee;color:#0b1a2c;font-weight:700;font-size:11.5px;line-height:1.55}
#tm-tour-box .bub .bt{margin-top:5px;font-weight:600}
#tm-tour-box .bub .bq{color:#cfe2fa;font-family:var(--font-main,'Frank Ruhl Libre','David',serif),'David','Times New Roman',serif;font-size:13px}
#tm-tour-box .bub .br{margin-top:4px;font-size:11px}
#tm-tour-box .bub .br a{display:inline-block;color:#e4f0ff;margin:2px 0 2px 5px;padding:1px 7px;border:1px solid rgba(127,180,238,.6);border-radius:6px;
  background:rgba(127,180,238,.16);text-decoration:none;cursor:pointer}
#tm-tour-box .bub .br a:hover{background:rgba(127,180,238,.34)}
#tm-tour-box .prog{height:3px;background:rgba(201,168,76,.18);flex:none}
#tm-tour-box .prog .bar{height:100%;width:0;background:#c9a84c}
#tm-tour-box .ctl{display:flex;gap:5px;padding:7px 10px 4px;flex:none}
#tm-tour-box .ctl button{flex:1 1 0;min-width:0;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.4);color:#e8dcae;
  border-radius:7px;padding:5px 2px;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer;white-space:nowrap;overflow:hidden}
#tm-tour-box .ctl button:hover{background:rgba(201,168,76,.3)}
#tm-tour-box .ctl button:disabled{opacity:.4;cursor:default}
#tm-tour-box .ctl2{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:2px 12px 8px;font-size:11px;color:#b9ac82;flex:none}
#tm-tour-box .spd{display:flex;align-items:center;white-space:nowrap}
#tm-tour-box .spd select{background:#141a26;color:#e8dcae;border:1px solid rgba(201,168,76,.4);border-radius:6px;
  font:11.5px 'Segoe UI',Arial,sans-serif;padding:1px 3px;margin-right:4px}
#tm-tour-box .ctl .spd{flex:none;font-size:11px;color:#b9ac82}
#tm-tour-box .ctl .spd .k{display:none}
#tm-tour-box .ctl .spd select{margin-right:0;padding:4px 2px;font-size:12px}
body.tm-measuring #tm-tour-box{bottom:96px}
@media(hover:none){#tm-tour-box .ctl2 .esc{display:none}}
@media(min-width:640px) and (max-width:881px){#tm-tour-box .ctl{gap:3px;padding-left:6px;padding-right:6px}#tm-tour-box .ctl button{padding:5px 1px;font-size:11px}}
@media${tour_PHONE_MQ}{
  #tm-tour-box{left:8px;right:8px;top:auto;bottom:66px;width:auto;max-height:min(40vh,calc(50vh - 70px))}
  body.tm-measuring #tm-tour-box{bottom:96px;max-height:min(40vh,calc(50vh - 100px))}
  #tm-tour-box .vs{font-size:16px;line-height:1.75}
  #tm-tour-box .ttl{font-size:14.5px}
  #tm-tour-box .hd{padding-top:6px}
  #tm-tour-box .wait{margin:4px 12px 0;padding:2px 8px;font-size:11.5px;line-height:1.35}
  #tm-tour-box .body{padding:6px 12px 4px}
  #tm-tour-box .ctl{padding:6px 8px}
  #tm-tour-box .ctl2{display:none}
  #tm-tour-box .bubw{max-height:none;margin:8px 0 14px}
  #tm-tour-box .caps .cap{font-size:13.5px}
}
`;
  var tour_MODES = [
    { key: "topics", label: "לפי הנושאים", desc: "כל המבטים וכל המקומות לפי סדר הלוח, כסא שלמה לפי כל מדרש, ובסוף ממש הקריאות הנוספות של טבלת 'שיטות ומחלוקות'." },
    { key: "continuous", label: "רציפה", desc: "אותן שקופיות ברצף, כשבע שניות לכל אחת (עליית המלך לכסא — כאורכה), בתנועה איטית ובלולאה עד לעצירה." },
    { key: "verses", label: "לפי סדר הפסוקים במלכים", desc: "מלכים א ו–ז; ח, א–יא; ח, סב–סו; י, יח–כ — הפסוקים המנוקדים, כל אחד במקומו במודל, עם רש״י והמפרשים." }
  ];
  var tour_DWELL = 7000;        // the continuous mode: ms per slide (the brief: ~7 s; model choice)
  // 1.0.1-L (L.78-L.81): a slide with a timeline (the king's ascent, the witnesses' scene): seconds before it starts (the camera arrives: the
  // UI's fly is 1.6 s) and at rest after it, for reading the last caption (model choices)
  var tour_ANIM_LEAD = 2;
  var tour_ANIM_TAIL = 2.5;
  // 1.0.1-L (L.50): the group of a view that no place of the panel flies to (a fragment of the group's name; else the previous view's group)
  var tour_VIEW_GROUP = { heichalFront: "מבחוץ", heichalSouth: "היציע", ulamInside: "מבחוץ", yachinBoazFull: "מבחוץ", yachinBoaz: "מבחוץ", heichalDoor: "מבפנים", kodesh: "מבפנים", devirDoor: "מבפנים", kodeshHakodashim: "מבפנים", palace: "שלמה" };
  // ... and the views that open their group even though a later place flies to them: the overview of the palace (the place "החצר הגדולה" uses it)
  var tour_VIEW_OPENS = { palace: true };
  // ... and a place's fly point that belongs to a view of the grid with another camera: the far view of Yachin and Boaz (L.58) opens the places of the
  // pillars, the view of the Holy of Holies those inside it
  var tour_VIEW_ALIAS = { yachinBoaz: "yachinBoazFull", cherubim: "kodeshHakodashim" };
  var tour_ORBIT = 12 * Math.PI / 180;   // the continuous mode's orbit on exterior slides: 12 degrees (the brief: +-12, alternating sides; model choice)
  // the view of a devir slide when the cloud dialog is answered "ביטול": the parochet from the heichal (K.4), else the devir doorway, the heichal
  var tour_OUT = [{ fp: "parochet" }, { fp: "devirDoor" }, { fp: "kodesh" }];
  // The pointed text of I Kings 6:1-38, 7:1-51, 8:1-11, 8:62-66 as printed in the Otzaria library (book 10; generated from its text, nothing
  // retyped). "(...)" = ketiv, "[...]" = qere.
  var tour_VERSES = {
    "6:1": "וַיְהִי בִשְׁמוֹנִים שָׁנָה וְאַרְבַּע מֵאוֹת שָׁנָה לְצֵאת בְּנֵי־יִשְׂרָאֵל מֵאֶרֶץ־מִצְרַיִם בַּשָּׁנָה הָרְבִיעִית בְּחֹדֶשׁ זִו הוּא הַחֹדֶשׁ הַשֵּׁנִי לִמְלֹךְ שְׁלֹמֹה עַל־יִשְׂרָאֵל וַיִּבֶן הַבַּיִת לַיהֹוָה",
    "6:2": "וְהַבַּיִת אֲשֶׁר בָּנָה הַמֶּלֶךְ שְׁלֹמֹה לַיהֹוָה שִׁשִּׁים־אַמָּה אׇרְכּוֹ וְעֶשְׂרִים רׇחְבּוֹ וּשְׁלֹשִׁים אַמָּה קוֹמָתוֹ",
    "6:3": "וְהָאוּלָם עַל־פְּנֵי הֵיכַל הַבַּיִת עֶשְׂרִים אַמָּה אׇרְכּוֹ עַל־פְּנֵי רֹחַב הַבָּיִת עֶשֶׂר בָּאַמָּה רׇחְבּוֹ עַל־פְּנֵי הַבָּיִת",
    "6:4": "וַיַּעַשׂ לַבָּיִת חַלּוֹנֵי שְׁקֻפִים אֲטוּמִים",
    "6:5": "וַיִּבֶן עַל־קִיר הַבַּיִת (יצוע) [יָצִיעַ] סָבִיב אֶת־קִירוֹת הַבַּיִת סָבִיב לַהֵיכָל וְלַדְּבִיר וַיַּעַשׂ צְלָעוֹת סָבִיב",
    "6:6": "(היצוע) [הַיָּצִיעַ] הַתַּחְתֹּנָה חָמֵשׁ בָּאַמָּה רׇחְבָּהּ וְהַתִּיכֹנָה שֵׁשׁ בָּאַמָּה רׇחְבָּהּ וְהַשְּׁלִישִׁית שֶׁבַע בָּאַמָּה רׇחְבָּהּ כִּי מִגְרָעוֹת נָתַן לַבַּיִת סָבִיב חוּצָה לְבִלְתִּי אֲחֹז בְּקִירוֹת־הַבָּיִת",
    "6:7": "וְהַבַּיִת בְּהִבָּנֹתוֹ אֶבֶן־שְׁלֵמָה מַסָּע נִבְנָה וּמַקָּבוֹת וְהַגַּרְזֶן כׇּל־כְּלִי בַרְזֶל לֹא־נִשְׁמַע בַּבַּיִת בְּהִבָּנֹתוֹ",
    "6:8": "פֶּתַח הַצֵּלָע הַתִּיכֹנָה אֶל־כֶּתֶף הַבַּיִת הַיְמָנִית וּבְלוּלִּים יַעֲלוּ עַל־הַתִּיכֹנָה וּמִן־הַתִּיכֹנָה אֶל־הַשְּׁלִשִׁים",
    "6:9": "וַיִּבֶן אֶת־הַבַּיִת וַיְכַלֵּהוּ וַיִּסְפֹּן אֶת־הַבַּיִת גֵּבִים וּשְׂדֵרֹת בָּאֲרָזִים",
    "6:10": "וַיִּבֶן אֶת־[הַיָּצִיעַ] (היצוע) עַל־כׇּל־הַבַּיִת חָמֵשׁ אַמּוֹת קוֹמָתוֹ וַיֶּאֱחֹז אֶת־הַבַּיִת בַּעֲצֵי אֲרָזִים",
    "6:11": "וַיְהִי דְּבַר־יְהֹוָה אֶל־שְׁלֹמֹה לֵאמֹר",
    "6:12": "הַבַּיִת הַזֶּה אֲשֶׁר־אַתָּה בֹנֶה אִם־תֵּלֵךְ בְּחֻקֹּתַי וְאֶת־מִשְׁפָּטַי תַּעֲשֶׂה וְשָׁמַרְתָּ אֶת־כׇּל־מִצְוֺתַי לָלֶכֶת בָּהֶם וַהֲקִמֹתִי אֶת־דְּבָרִי אִתָּךְ אֲשֶׁר דִּבַּרְתִּי אֶל־דָּוִד אָבִיךָ",
    "6:13": "וְשָׁכַנְתִּי בְּתוֹךְ בְּנֵי יִשְׂרָאֵל וְלֹא אֶעֱזֹב אֶת־עַמִּי יִשְׂרָאֵל",
    "6:14": "וַיִּבֶן שְׁלֹמֹה אֶת־הַבַּיִת וַיְכַלֵּהוּ",
    "6:15": "וַיִּבֶן אֶת־קִירוֹת הַבַּיִת מִבַּיְתָה בְּצַלְעוֹת אֲרָזִים מִקַּרְקַע הַבַּיִת עַד־קִירוֹת הַסִּפֻּן צִפָּה עֵץ מִבָּיִת וַיְצַף אֶת־קַרְקַע הַבַּיִת בְּצַלְעוֹת בְּרוֹשִׁים",
    "6:16": "וַיִּבֶן אֶת־עֶשְׂרִים אַמָּה (מירכותי) [מִיַּרְכְּתֵי] הַבַּיִת בְּצַלְעוֹת אֲרָזִים מִן־הַקַּרְקַע עַד־הַקִּירוֹת וַיִּבֶן לוֹ מִבַּיִת לִדְבִיר לְקֹדֶשׁ הַקֳּדָשִׁים",
    "6:17": "וְאַרְבָּעִים בָּאַמָּה הָיָה הַבָּיִת הוּא הַהֵיכָל לִפְנָי",
    "6:18": "וְאֶרֶז אֶל־הַבַּיִת פְּנִימָה מִקְלַעַת פְּקָעִים וּפְטוּרֵי צִצִּים הַכֹּל אֶרֶז אֵין אֶבֶן נִרְאָה",
    "6:19": "וּדְבִיר בְּתוֹךְ־הַבַּיִת מִפְּנִימָה הֵכִין לְתִתֵּן שָׁם אֶת־אֲרוֹן בְּרִית יְהֹוָה",
    "6:20": "וְלִפְנֵי הַדְּבִיר עֶשְׂרִים אַמָּה אֹרֶךְ וְעֶשְׂרִים אַמָּה רֹחַב וְעֶשְׂרִים אַמָּה קוֹמָתוֹ וַיְצַפֵּהוּ זָהָב סָגוּר וַיְצַף מִזְבֵּחַ אָרֶז",
    "6:21": "וַיְצַף שְׁלֹמֹה אֶת־הַבַּיִת מִפְּנִימָה זָהָב סָגוּר וַיְעַבֵּר (ברתיקות) [בְּרַתּוּקוֹת] זָהָב לִפְנֵי הַדְּבִיר וַיְצַפֵּהוּ זָהָב",
    "6:22": "וְאֶת־כׇּל־הַבַּיִת צִפָּה זָהָב עַד־תֹּם כׇּל־הַבָּיִת וְכׇל־הַמִּזְבֵּחַ אֲשֶׁר־לַדְּבִיר צִפָּה זָהָב",
    "6:23": "וַיַּעַשׂ בַּדְּבִיר שְׁנֵי כְרוּבִים עֲצֵי־שָׁמֶן עֶשֶׂר אַמּוֹת קוֹמָתוֹ",
    "6:24": "וְחָמֵשׁ אַמּוֹת כְּנַף הַכְּרוּב הָאֶחָת וְחָמֵשׁ אַמּוֹת כְּנַף הַכְּרוּב הַשֵּׁנִית עֶשֶׂר אַמּוֹת מִקְצוֹת כְּנָפָיו וְעַד־קְצוֹת כְּנָפָיו",
    "6:25": "וְעֶשֶׂר בָּאַמָּה הַכְּרוּב הַשֵּׁנִי מִדָּה אַחַת וְקֶצֶב אֶחָד לִשְׁנֵי הַכְּרֻבִים",
    "6:26": "קוֹמַת הַכְּרוּב הָאֶחָד עֶשֶׂר בָּאַמָּה וְכֵן הַכְּרוּב הַשֵּׁנִי",
    "6:27": "וַיִּתֵּן אֶת־הַכְּרוּבִים בְּתוֹךְ הַבַּיִת הַפְּנִימִי וַיִּפְרְשׂוּ אֶת־כַּנְפֵי הַכְּרֻבִים וַתִּגַּע כְּנַף־הָאֶחָד בַּקִּיר וּכְנַף הַכְּרוּב הַשֵּׁנִי נֹגַעַת בַּקִּיר הַשֵּׁנִי וְכַנְפֵיהֶם אֶל־תּוֹךְ הַבַּיִת נֹגְעֹת כָּנָף אֶל־כָּנָף",
    "6:28": "וַיְצַף אֶת־הַכְּרוּבִים זָהָב",
    "6:29": "וְאֵת כׇּל־קִירוֹת הַבַּיִת מֵסַב קָלַע פִּתּוּחֵי מִקְלְעוֹת כְּרוּבִים וְתִמֹרֹת וּפְטוּרֵי צִצִּים מִלִּפְנִים וְלַחִיצוֹן",
    "6:30": "וְאֶת־קַרְקַע הַבַּיִת צִפָּה זָהָב לִפְנִימָה וְלַחִיצוֹן",
    "6:31": "וְאֵת פֶּתַח הַדְּבִיר עָשָׂה דַּלְתוֹת עֲצֵי־שָׁמֶן הָאַיִל מְזוּזוֹת חֲמִשִׁית",
    "6:32": "וּשְׁתֵּי דַּלְתוֹת עֲצֵי־שֶׁמֶן וְקָלַע עֲלֵיהֶם מִקְלְעוֹת כְּרוּבִים וְתִמֹרֹת וּפְטוּרֵי צִצִּים וְצִפָּה זָהָב וַיָּרֶד עַל־הַכְּרוּבִים וְעַל־הַתִּמֹרוֹת אֶת־הַזָּהָב",
    "6:33": "וְכֵן עָשָׂה לְפֶתַח הַהֵיכָל מְזוּזוֹת עֲצֵי־שָׁמֶן מֵאֵת רְבִעִית",
    "6:34": "וּשְׁתֵּי דַלְתוֹת עֲצֵי בְרוֹשִׁים שְׁנֵי צְלָעִים הַדֶּלֶת הָאַחַת גְּלִילִים וּשְׁנֵי קְלָעִים הַדֶּלֶת הַשֵּׁנִית גְּלִילִים",
    "6:35": "וְקָלַע כְּרוּבִים וְתִמֹרוֹת וּפְטֻרֵי צִצִּים וְצִפָּה זָהָב מְיֻשָּׁר עַל־הַמְּחֻקֶּה",
    "6:36": "וַיִּבֶן אֶת־הֶחָצֵר הַפְּנִימִית שְׁלֹשָׁה טוּרֵי גָזִית וְטוּר כְּרֻתֹת אֲרָזִים",
    "6:37": "בַּשָּׁנָה הָרְבִיעִית יֻסַּד בֵּית יְהֹוָה בְּיֶרַח זִו",
    "6:38": "וּבַשָּׁנָה הָאַחַת עֶשְׂרֵה בְּיֶרַח בּוּל הוּא הַחֹדֶשׁ הַשְּׁמִינִי כָּלָה הַבַּיִת לְכׇל־דְּבָרָיו וּלְכׇל־מִשְׁפָּטָו וַיִּבְנֵהוּ שֶׁבַע שָׁנִים",
    "7:1": "וְאֶת־בֵּיתוֹ בָּנָה שְׁלֹמֹה שְׁלֹשׁ עֶשְׂרֵה שָׁנָה וַיְכַל אֶת־כׇּל־בֵּיתוֹ",
    "7:2": "וַיִּבֶן אֶת־בֵּית יַעַר הַלְּבָנוֹן מֵאָה אַמָּה אׇרְכּוֹ וַחֲמִשִּׁים אַמָּה רׇחְבּוֹ וּשְׁלֹשִׁים אַמָּה קוֹמָתוֹ עַל אַרְבָּעָה טוּרֵי עַמּוּדֵי אֲרָזִים וּכְרֻתוֹת אֲרָזִים עַל־הָעַמּוּדִים",
    "7:3": "וְסָפֻן בָּאֶרֶז מִמַּעַל עַל־הַצְּלָעוֹת אֲשֶׁר עַל־הָעַמּוּדִים אַרְבָּעִים וַחֲמִשָּׁה חֲמִשָּׁה עָשָׂר הַטּוּר",
    "7:4": "וּשְׁקֻפִים שְׁלֹשָׁה טוּרִים וּמֶחֱזָה אֶל־מֶחֱזָה שָׁלֹשׁ פְּעָמִים",
    "7:5": "וְכׇל־הַפְּתָחִים וְהַמְּזוּזוֹת רְבֻעִים שָׁקֶף וּמוּל מֶחֱזָה אֶל־מֶחֱזָה שָׁלֹשׁ פְּעָמִים",
    "7:6": "וְאֵת אוּלָם הָעַמּוּדִים עָשָׂה חֲמִשִּׁים אַמָּה אׇרְכּוֹ וּשְׁלֹשִׁים אַמָּה רׇחְבּוֹ וְאוּלָם עַל־פְּנֵיהֶם וְעַמֻּדִים וְעָב עַל־פְּנֵיהֶם",
    "7:7": "וְאוּלָם הַכִּסֵּא אֲשֶׁר יִשְׁפׇּט־שָׁם אֻלָם הַמִּשְׁפָּט עָשָׂה וְסָפוּן בָּאֶרֶז מֵהַקַּרְקַע עַד־הַקַּרְקָע",
    "7:8": "וּבֵיתוֹ אֲשֶׁר־יֵשֶׁב שָׁם חָצֵר הָאַחֶרֶת מִבֵּית לָאוּלָם כַּמַּעֲשֶׂה הַזֶּה הָיָה וּבַיִת יַעֲשֶׂה לְבַת־פַּרְעֹה אֲשֶׁר לָקַח שְׁלֹמֹה כָּאוּלָם הַזֶּה",
    "7:9": "כׇּל־אֵלֶּה אֲבָנִים יְקָרֹת כְּמִדּוֹת גָּזִית מְגֹרָרוֹת בַּמְּגֵרָה מִבַּיִת וּמִחוּץ וּמִמַּסָּד עַד־הַטְּפָחוֹת וּמִחוּץ עַד־הֶחָצֵר הַגְּדוֹלָה",
    "7:10": "וּמְיֻסָּד אֲבָנִים יְקָרוֹת אֲבָנִים גְּדֹלוֹת אַבְנֵי עֶשֶׂר אַמּוֹת וְאַבְנֵי שְׁמֹנֶה אַמּוֹת",
    "7:11": "וּמִלְמַעְלָה אֲבָנִים יְקָרוֹת כְּמִדּוֹת גָּזִית וָאָרֶז",
    "7:12": "וְחָצֵר הַגְּדוֹלָה סָבִיב שְׁלֹשָׁה טוּרִים גָּזִית וְטוּר כְּרֻתֹת אֲרָזִים וְלַחֲצַר בֵּית־יְהֹוָה הַפְּנִימִית וּלְאֻלָם הַבָּיִת",
    "7:13": "וַיִּשְׁלַח הַמֶּלֶךְ שְׁלֹמֹה וַיִּקַּח אֶת־חִירָם מִצֹּר",
    "7:14": "בֶּן־אִשָּׁה אַלְמָנָה הוּא מִמַּטֵּה נַפְתָּלִי וְאָבִיו אִישׁ־צֹרִי חֹרֵשׁ נְחֹשֶׁת וַיִּמָּלֵא אֶת־הַחׇכְמָה וְאֶת־הַתְּבוּנָה וְאֶת־הַדַּעַת לַעֲשׂוֹת כׇּל־מְלָאכָה בַּנְּחֹשֶׁת וַיָּבוֹא אֶל־הַמֶּלֶךְ שְׁלֹמֹה וַיַּעַשׂ אֶת־כׇּל־מְלַאכְתּוֹ",
    "7:15": "וַיָּצַר אֶת־שְׁנֵי הָעַמּוּדִים נְחֹשֶׁת שְׁמֹנֶה עֶשְׂרֵה אַמָּה קוֹמַת הָעַמּוּד הָאֶחָד וְחוּט שְׁתֵּים־עֶשְׂרֵה אַמָּה יָסֹב אֶת־הָעַמּוּד הַשֵּׁנִי",
    "7:16": "וּשְׁתֵּי כֹתָרֹת עָשָׂה לָתֵת עַל־רָאשֵׁי הָעַמּוּדִים מֻצַק נְחֹשֶׁת חָמֵשׁ אַמּוֹת קוֹמַת הַכֹּתֶרֶת הָאֶחָת וְחָמֵשׁ אַמּוֹת קוֹמַת הַכֹּתֶרֶת הַשֵּׁנִית",
    "7:17": "שְׂבָכִים מַעֲשֵׂה שְׂבָכָה גְּדִלִים מַעֲשֵׂה שַׁרְשְׁרוֹת לַכֹּתָרֹת אֲשֶׁר עַל־רֹאשׁ הָעַמּוּדִים שִׁבְעָה לַכֹּתֶרֶת הָאֶחָת וְשִׁבְעָה לַכֹּתֶרֶת הַשֵּׁנִית",
    "7:18": "וַיַּעַשׂ אֶת־הָעַמּוּדִים וּשְׁנֵי טוּרִים סָבִיב עַל־הַשְּׂבָכָה הָאֶחָת לְכַסּוֹת אֶת־הַכֹּתָרֹת אֲשֶׁר עַל־רֹאשׁ הָרִמֹּנִים וְכֵן עָשָׂה לַכֹּתֶרֶת הַשֵּׁנִית",
    "7:19": "וְכֹתָרֹת אֲשֶׁר עַל־רֹאשׁ הָעַמּוּדִים מַעֲשֵׂה שׁוּשַׁן בָּאוּלָם אַרְבַּע אַמּוֹת",
    "7:20": "וְכֹתָרֹת עַל־שְׁנֵי הָעַמּוּדִים גַּם־מִמַּעַל מִלְּעֻמַּת הַבֶּטֶן אֲשֶׁר לְעֵבֶר (שבכה) [הַשְּׂבָכָה] וְהָרִמּוֹנִים מָאתַיִם טֻרִים סָבִיב עַל הַכֹּתֶרֶת הַשֵּׁנִית",
    "7:21": "וַיָּקֶם אֶת־הָעַמֻּדִים לְאֻלָם הַהֵיכָל וַיָּקֶם אֶת־הָעַמּוּד הַיְמָנִי וַיִּקְרָא אֶת־שְׁמוֹ יָכִין וַיָּקֶם אֶת־הָעַמּוּד הַשְּׂמָאלִי וַיִּקְרָא אֶת־שְׁמוֹ בֹּעַז",
    "7:22": "וְעַל רֹאשׁ הָעַמּוּדִים מַעֲשֵׂה שׁוֹשָׁן וַתִּתֹּם מְלֶאכֶת הָעַמּוּדִים",
    "7:23": "וַיַּעַשׂ אֶת־הַיָּם מוּצָק עֶשֶׂר בָּאַמָּה מִשְּׂפָתוֹ עַד־שְׂפָתוֹ עָגֹל סָבִיב וְחָמֵשׁ בָּאַמָּה קוֹמָתוֹ (וקוה) [וְקָו] שְׁלֹשִׁים בָּאַמָּה יָסֹב אֹתוֹ סָבִיב",
    "7:24": "וּפְקָעִים מִתַּחַת לִשְׂפָתוֹ סָבִיב סֹבְבִים אֹתוֹ עֶשֶׂר בָּאַמָּה מַקִּפִים אֶת־הַיָּם סָבִיב שְׁנֵי טוּרִים הַפְּקָעִים יְצֻקִים בִּיצֻקָתוֹ",
    "7:25": "עֹמֵד עַל־שְׁנֵי עָשָׂר בָּקָר שְׁלֹשָׁה פֹנִים צָפוֹנָה וּשְׁלֹשָׁה פֹנִים יָמָּה וּשְׁלֹשָׁה פֹּנִים נֶגְבָּה וּשְׁלֹשָׁה פֹּנִים מִזְרָחָה וְהַיָּם עֲלֵיהֶם מִלְמָעְלָה וְכׇל־אֲחֹרֵיהֶם בָּיְתָה",
    "7:26": "וְעׇבְיוֹ טֶפַח וּשְׂפָתוֹ כְּמַעֲשֵׂה שְׂפַת־כּוֹס פֶּרַח שׁוֹשָׁן אַלְפַּיִם בַּת יָכִיל",
    "7:27": "וַיַּעַשׂ אֶת־הַמְּכֹנוֹת עֶשֶׂר נְחֹשֶׁת אַרְבַּע בָּאַמָּה אֹרֶךְ הַמְּכוֹנָה הָאֶחָת וְאַרְבַּע בָּאַמָּה רׇחְבָּהּ וְשָׁלֹשׁ בָּאַמָּה קוֹמָתָהּ",
    "7:28": "וְזֶה מַעֲשֵׂה הַמְּכוֹנָה מִסְגְּרֹת לָהֶם וּמִסְגְּרֹת בֵּין הַשְׁלַבִּים",
    "7:29": "וְעַל־הַמִּסְגְּרוֹת אֲשֶׁר בֵּין הַשְׁלַבִּים אֲרָיוֹת בָּקָר וּכְרוּבִים וְעַל־הַשְׁלַבִּים כֵּן מִמָּעַל וּמִתַּחַת לַאֲרָיוֹת וְלַבָּקָר לֹיוֹת מַעֲשֵׂה מוֹרָד",
    "7:30": "וְאַרְבָּעָה אוֹפַנֵּי נְחֹשֶׁת לַמְּכוֹנָה הָאַחַת וְסַרְנֵי נְחֹשֶׁת וְאַרְבָּעָה פַעֲמֹתָיו כְּתֵפֹת לָהֶם מִתַּחַת לַכִּיֹּר הַכְּתֵפוֹת יְצֻקוֹת מֵעֵבֶר אִישׁ לֹיוֹת",
    "7:31": "וּפִיהוּ מִבֵּית לַכֹּתֶרֶת וָמַעְלָה בָּאַמָּה וּפִיהָ עָגֹל מַעֲשֵׂה־כֵן אַמָּה וַחֲצִי הָאַמָּה וְגַם־עַל־פִּיהָ מִקְלָעוֹת וּמִסְגְּרֹתֵיהֶם מְרֻבָּעוֹת לֹא עֲגֻלּוֹת",
    "7:32": "וְאַרְבַּעַת הָאוֹפַנִּים לְמִתַּחַת לַמִּסְגְּרוֹת וִידוֹת הָאוֹפַנִּים בַּמְּכוֹנָה וְקוֹמַת הָאוֹפַן הָאֶחָד אַמָּה וַחֲצִי הָאַמָּה",
    "7:33": "וּמַעֲשֵׂה הָאוֹפַנִּים כְּמַעֲשֵׂה אוֹפַן הַמֶּרְכָּבָה יְדוֹתָם וְגַבֵּיהֶם וְחִשֻּׁקֵיהֶם וְחִשֻּׁרֵיהֶם הַכֹּל מוּצָק",
    "7:34": "וְאַרְבַּע כְּתֵפוֹת אֶל אַרְבַּע פִּנּוֹת הַמְּכֹנָה הָאֶחָת מִן־הַמְּכֹנָה כְּתֵפֶיהָ",
    "7:35": "וּבְרֹאשׁ הַמְּכוֹנָה חֲצִי הָאַמָּה קוֹמָה עָגֹל סָבִיב וְעַל רֹאשׁ הַמְּכֹנָה יְדֹתֶיהָ וּמִסְגְּרֹתֶיהָ מִמֶּנָּה",
    "7:36": "וַיְפַתַּח עַל־הַלֻּחֹת יְדֹתֶיהָ וְעַל (ומסגרתיה) [מִסְגְּרֹתֶיהָ] כְּרוּבִים אֲרָיוֹת וְתִמֹרֹת כְּמַעַר־אִישׁ וְלֹיוֹת סָבִיב",
    "7:37": "כָּזֹאת עָשָׂה אֵת עֶשֶׂר הַמְּכֹנוֹת מוּצָק אֶחָד מִדָּה אַחַת קֶצֶב אֶחָד לְכֻלָּהְנָה",
    "7:38": "וַיַּעַשׂ עֲשָׂרָה כִיֹּרוֹת נְחֹשֶׁת אַרְבָּעִים בַּת יָכִיל הַכִּיּוֹר הָאֶחָד אַרְבַּע בָּאַמָּה הַכִּיּוֹר הָאֶחָד כִּיּוֹר אֶחָד עַל־הַמְּכוֹנָה הָאַחַת לְעֶשֶׂר הַמְּכֹנוֹת",
    "7:39": "וַיִּתֵּן אֶת־הַמְּכֹנוֹת חָמֵשׁ עַל־כֶּתֶף הַבַּיִת מִיָּמִין וְחָמֵשׁ עַל־כֶּתֶף הַבַּיִת מִשְּׂמֹאלוֹ וְאֶת־הַיָּם נָתַן מִכֶּתֶף הַבַּיִת הַיְמָנִית קֵדְמָה מִמּוּל נֶגֶב",
    "7:40": "וַיַּעַשׂ חִירוֹם אֶת־הַכִּיֹּרוֹת וְאֶת־הַיָּעִים וְאֶת־הַמִּזְרָקוֹת וַיְכַל חִירָם לַעֲשׂוֹת אֶת־כׇּל־הַמְּלָאכָה אֲשֶׁר עָשָׂה לַמֶּלֶךְ שְׁלֹמֹה בֵּית יְהֹוָה",
    "7:41": "עַמֻּדִים שְׁנַיִם וְגֻלֹּת הַכֹּתָרֹת אֲשֶׁר־עַל־רֹאשׁ הָעַמּוּדִים שְׁתָּיִם וְהַשְּׂבָכוֹת שְׁתַּיִם לְכַסּוֹת אֶת־שְׁתֵּי גֻּלּוֹת הַכֹּתָרֹת אֲשֶׁר עַל־רֹאשׁ הָעַמּוּדִים",
    "7:42": "וְאֶת־הָרִמֹּנִים אַרְבַּע מֵאוֹת לִשְׁתֵּי הַשְּׂבָכוֹת שְׁנֵי־טוּרִים רִמֹּנִים לַשְּׂבָכָה הָאֶחָת לְכַסּוֹת אֶת־שְׁתֵּי גֻּלּוֹת הַכֹּתָרֹת אֲשֶׁר עַל־פְּנֵי הָעַמּוּדִים",
    "7:43": "וְאֶת־הַמְּכֹנוֹת עָשֶׂר וְאֶת־הַכִּיֹּרֹת עֲשָׂרָה עַל־הַמְּכֹנוֹת",
    "7:44": "וְאֶת־הַיָּם הָאֶחָד וְאֶת־הַבָּקָר שְׁנֵים־עָשָׂר תַּחַת הַיָּם",
    "7:45": "וְאֶת־הַסִּירוֹת וְאֶת־הַיָּעִים וְאֶת־הַמִּזְרָקוֹת וְאֵת כׇּל־הַכֵּלִים (האהל) [הָאֵלֶּה] אֲשֶׁר עָשָׂה חִירָם לַמֶּלֶךְ שְׁלֹמֹה בֵּית יְהֹוָה נְחֹשֶׁת מְמֹרָט",
    "7:46": "בְּכִכַּר הַיַּרְדֵּן יְצָקָם הַמֶּלֶךְ בְּמַעֲבֵה הָאֲדָמָה בֵּין סֻכּוֹת וּבֵין צָרְתָן",
    "7:47": "וַיַּנַּח שְׁלֹמֹה אֶת־כׇּל־הַכֵּלִים מֵרֹב מְאֹד מְאֹד לֹא נֶחְקַר מִשְׁקַל הַנְּחֹשֶׁת",
    "7:48": "וַיַּעַשׂ שְׁלֹמֹה אֵת כׇּל־הַכֵּלִים אֲשֶׁר בֵּית יְהֹוָה אֵת מִזְבַּח הַזָּהָב וְאֶת־הַשֻּׁלְחָן אֲשֶׁר עָלָיו לֶחֶם הַפָּנִים זָהָב",
    "7:49": "וְאֶת־הַמְּנֹרוֹת חָמֵשׁ מִיָּמִין וְחָמֵשׁ מִשְּׂמֹאול לִפְנֵי הַדְּבִיר זָהָב סָגוּר וְהַפֶּרַח וְהַנֵּרֹת וְהַמֶּלְקַחַיִם זָהָב",
    "7:50": "וְהַסִּפּוֹת וְהַמְזַמְּרוֹת וְהַמִּזְרָקוֹת וְהַכַּפּוֹת וְהַמַּחְתּוֹת זָהָב סָגוּר וְהַפֹּתוֹת לְדַלְתוֹת הַבַּיִת הַפְּנִימִי לְקֹדֶשׁ הַקֳּדָשִׁים לְדַלְתֵי הַבַּיִת לַהֵיכָל זָהָב",
    "7:51": "וַתִּשְׁלַם כׇּל־הַמְּלָאכָה אֲשֶׁר עָשָׂה הַמֶּלֶךְ שְׁלֹמֹה בֵּית יְהֹוָה וַיָּבֵא שְׁלֹמֹה אֶת־קׇדְשֵׁי דָּוִד אָבִיו אֶת־הַכֶּסֶף וְאֶת־הַזָּהָב וְאֶת־הַכֵּלִים נָתַן בְּאֹצְרוֹת בֵּית יְהֹוָה",
    "8:1": "אָז יַקְהֵל שְׁלֹמֹה אֶת־זִקְנֵי יִשְׂרָאֵל אֶת־כׇּל־רָאשֵׁי הַמַּטּוֹת נְשִׂיאֵי הָאָבוֹת לִבְנֵי יִשְׂרָאֵל אֶל־הַמֶּלֶךְ שְׁלֹמֹה יְרוּשָׁלָ͏ִם לְהַעֲלוֹת אֶת־אֲרוֹן בְּרִית־יְהֹוָה מֵעִיר דָּוִד הִיא צִיּוֹן",
    "8:2": "וַיִּקָּהֲלוּ אֶל־הַמֶּלֶךְ שְׁלֹמֹה כׇּל־אִישׁ יִשְׂרָאֵל בְּיֶרַח הָאֵתָנִים בֶּחָג הוּא הַחֹדֶשׁ הַשְּׁבִיעִי",
    "8:3": "וַיָּבֹאוּ כֹּל זִקְנֵי יִשְׂרָאֵל וַיִּשְׂאוּ הַכֹּהֲנִים אֶת־הָאָרוֹן",
    "8:4": "וַיַּעֲלוּ אֶת־אֲרוֹן יְהֹוָה וְאֶת־אֹהֶל מוֹעֵד וְאֶת־כׇּל־כְּלֵי הַקֹּדֶשׁ אֲשֶׁר בָּאֹהֶל וַיַּעֲלוּ אֹתָם הַכֹּהֲנִים וְהַלְוִיִּם",
    "8:5": "וְהַמֶּלֶךְ שְׁלֹמֹה וְכׇל־עֲדַת יִשְׂרָאֵל הַנּוֹעָדִים עָלָיו אִתּוֹ לִפְנֵי הָאָרוֹן מְזַבְּחִים צֹאן וּבָקָר אֲשֶׁר לֹא־יִסָּפְרוּ וְלֹא יִמָּנוּ מֵרֹב",
    "8:6": "וַיָּבִאוּ הַכֹּהֲנִים אֶת־אֲרוֹן בְּרִית־יְהֹוָה אֶל־מְקוֹמוֹ אֶל־דְּבִיר הַבַּיִת אֶל־קֹדֶשׁ הַקֳּדָשִׁים אֶל־תַּחַת כַּנְפֵי הַכְּרוּבִים",
    "8:7": "כִּי הַכְּרוּבִים פֹּרְשִׂים כְּנָפַיִם אֶל־מְקוֹם הָאָרוֹן וַיָּסֹכּוּ הַכְּרֻבִים עַל־הָאָרוֹן וְעַל־בַּדָּיו מִלְמָעְלָה",
    "8:8": "וַיַּאֲרִכוּ הַבַּדִּים וַיֵּרָאוּ רָאשֵׁי הַבַּדִּים מִן־הַקֹּדֶשׁ עַל־פְּנֵי הַדְּבִיר וְלֹא יֵרָאוּ הַחוּצָה וַיִּהְיוּ שָׁם עַד הַיּוֹם הַזֶּה",
    "8:9": "אֵין בָּאָרוֹן רַק שְׁנֵי לֻחוֹת הָאֲבָנִים אֲשֶׁר הִנִּחַ שָׁם מֹשֶׁה בְּחֹרֵב אֲשֶׁר כָּרַת יְהֹוָה עִם־בְּנֵי יִשְׂרָאֵל בְּצֵאתָם מֵאֶרֶץ מִצְרָיִם",
    "8:10": "וַיְהִי בְּצֵאת הַכֹּהֲנִים מִן־הַקֹּדֶשׁ וְהֶעָנָן מָלֵא אֶת־בֵּית יְהֹוָה",
    "8:11": "וְלֹא־יָכְלוּ הַכֹּהֲנִים לַעֲמֹד לְשָׁרֵת מִפְּנֵי הֶעָנָן כִּי־מָלֵא כְבוֹד־יְהֹוָה אֶת־בֵּית יְהֹוָה",
    "8:62": "וְהַמֶּלֶךְ וְכׇל־יִשְׂרָאֵל עִמּוֹ זֹבְחִים זֶבַח לִפְנֵי יְהֹוָה",
    "8:63": "וַיִּזְבַּח שְׁלֹמֹה אֵת זֶבַח הַשְּׁלָמִים אֲשֶׁר זָבַח לַיהֹוָה בָּקָר עֶשְׂרִים וּשְׁנַיִם אֶלֶף וְצֹאן מֵאָה וְעֶשְׂרִים אָלֶף וַיַּחְנְכוּ אֶת־בֵּית יְהֹוָה הַמֶּלֶךְ וְכׇל־בְּנֵי יִשְׂרָאֵל",
    "8:64": "בַּיּוֹם הַהוּא קִדַּשׁ הַמֶּלֶךְ אֶת־תּוֹךְ הֶחָצֵר אֲשֶׁר לִפְנֵי בֵית־יְהֹוָה כִּי־עָשָׂה שָׁם אֶת־הָעֹלָה וְאֶת־הַמִּנְחָה וְאֵת חֶלְבֵי הַשְּׁלָמִים כִּי־מִזְבַּח הַנְּחֹשֶׁת אֲשֶׁר לִפְנֵי יְהֹוָה קָטֹן מֵהָכִיל אֶת־הָעֹלָה וְאֶת־הַמִּנְחָה וְאֵת חֶלְבֵי הַשְּׁלָמִים",
    "8:65": "וַיַּעַשׂ שְׁלֹמֹה בָעֵת־הַהִיא אֶת־הֶחָג וְכׇל־יִשְׂרָאֵל עִמּוֹ קָהָל גָּדוֹל מִלְּבוֹא חֲמָת עַד־נַחַל מִצְרַיִם לִפְנֵי יְהֹוָה אֱלֹהֵינוּ שִׁבְעַת יָמִים וְשִׁבְעַת יָמִים אַרְבָּעָה עָשָׂר יוֹם",
    "8:66": "בַּיּוֹם הַשְּׁמִינִי שִׁלַּח אֶת־הָעָם וַיְבָרְכוּ אֶת־הַמֶּלֶךְ וַיֵּלְכוּ לְאׇהֳלֵיהֶם שְׂמֵחִים וְטוֹבֵי לֵב עַל כׇּל־הַטּוֹבָה אֲשֶׁר עָשָׂה יְהֹוָה לְדָוִד עַבְדּוֹ וּלְיִשְׂרָאֵל עַמּוֹ",
    // 1.0.1-L (L.80): the throne, the same transformation of book 10, lines 390-392 (checked: it gives all 105 verses above letter for letter)
    "10:18": "וַיַּעַשׂ הַמֶּלֶךְ כִּסֵּא־שֵׁן גָּדוֹל וַיְצַפֵּהוּ זָהָב מוּפָז",
    "10:19": "שֵׁשׁ מַעֲלוֹת לַכִּסֵּה וְרֹאשׁ־עָגֹל לַכִּסֵּה מֵאַחֲרָיו וְיָדֹת מִזֶּה וּמִזֶּה אֶל־מְקוֹם הַשָּׁבֶת וּשְׁנַיִם אֲרָיוֹת עֹמְדִים אֵצֶל הַיָּדוֹת",
    "10:20": "וּשְׁנֵים עָשָׂר אֲרָיִים עֹמְדִים שָׁם עַל־שֵׁשׁ הַמַּעֲלוֹת מִזֶּה וּמִזֶּה לֹא־נַעֲשָׂה כֵן לְכׇל־מַמְלָכוֹת"
  };
  // 1.0.1-L (L.78-L.81): the throne's slides. pesukim = the default version's text (the verses with Rashi first, then Radak, Metzudat David, Ralbag,
  // Malbim, Abarbanel; every quotation from the Otzaria library: 3673:610-613, 3540:683, 3345:939, 944, 3645:462, 3394:624, 3574:563, 3318:493), the
  // topics mode's plain slide and the verse slide of 10:18-20; lead / leadW = the few words before a timeline's captions (the captions themselves,
  // the midrash's own words, are ctx.shared.throne.script / witnessScript of 60-palace.js); refs = the slide's source links
  var tour_THRONE = {
    // 1.0.1-L (A32, "לקצר"): short enough to be read in the slide's time; every commentator's words stay in the card of the place "כסא שלמה"
    pesukim: "רש״י: 'שש מעלות. מדרגות לעלות בו, וראש הכסא היה עגל, מקום מושב המלך'; 'ושנים אריות. של זהב, וכל צורת הכסא מפרשת באגדת מגלת אסתר'. רד״ק: 'במקום ישיבתו היו ידות מזה ומזה לסמיכות זרועותיו והיו צורות אריות עומדות אצל הידות'. רלב״ג: 'ולזה היו שם ארבעה עשר אריות'. במודל, בגרסה זו: הגוף הרחב ושש המעלות לפניו, הכבש, המושב העגול, הגב והידות, ההדום, שנים עשר אריות על המעלות ושניים אצל הידות — בלי נשרים, חיות, כסאות ומנגנון, שהם מן המדרש, ולכן אין כאן עלייה. הראש העגול כרש״י, מלבי״ם ורלב״ג; כיפת הכובע של מצודת דוד ואברבנאל לא נבנתה. המידות — בחירת מודל.",
    lead: {
      targumSheni: "עליית המלך לכסא לפי תרגום שני (אסתר א, ב), בלשון התרגום ובתרגום עברי, ואחריה עדי השקר. השור מרים את המלך ממעלה למעלה, הנשרים מושיבים אותו, הנשר הגדול מניח את הכתר, והאריות מזלפים בשמים. במודל עולה צללית בלבד, בלי דמות המלך. על פי המדרש; זמני התנועות וצורתן — בחירת מודל.",
      estherRabbah: "עליית המלך לכסא לפי אסתר רבה (א, יב) עם מדרש פנים אחרים (נוסח ב) ומדרש אבא גוריון, המסכימים בעיקר המעשה, ואחריה עדי השקר. בכל מעלה חוזר גלגל המנגנון, והארי פושט יד והנשר כנף לסירוגין; מאחורי המושב השרביט והיונה ובפיה העטרה. במודל עולה צללית בלבד, בלי דמות המלך. על פי המדרש; זמני התנועות וצורתן — בחירת מודל.",
      // 1.0.1-L: the user: the midrash's name on screen is "בית המדרש ב"; the ascent shows a covered foot climbing (60-palace.js)
      beitHamidrash: "עליית המלך לכסא לפי בית המדרש ב (ילינק; בספרייה בילקוט מדרשים), ואחריה עדי השקר. בידי האריות לוחות כתב, ובכל מעלה המלך אומר פסוק מתהלים יט; תנין של כסף מושיב אותו, והארי של שמאל מניח את העטרה על ראשו. במודל עולה צללית בלבד, בלי דמות המלך. על פי המדרש; זמני התנועות וצורתן — בחירת מודל."
    },
    leadW: "עדי השקר: כשעולים עדים להעיד לפני המלך, גלגלי המנגנון סובבים וכל החיות שבכסא נעות ומרעישות, להפחיד את העדים שיעידו אמת. הדברים בלשון המדרש:",
    refs: {
      pesukim: [["מלכים א י, יח", ["V", 10, 10, 18]], ["דברי הימים ב ט, יז", ["V", 39, 9, 17]], ["רש״י י, יט", ["L", 3673, 610]], ["רד״ק י, יט", ["L", 3540, 683]], ["מצודת דוד י, יט", ["L", 3345, 939]], ["רלב״ג י, יט", ["L", 3645, 462]], ["מלבי״ם י, יט", ["L", 3394, 624]], ["אברבנאל י, יח", ["L", 3574, 563]], ["מצודת דוד דברי הימים ב ט, יח", ["L", 3318, 493]]],
      targumSheni: [["תרגום שני לאסתר א, ב", ["L", 3237, 14]], ["מלכים א י, יח", ["V", 10, 10, 18]], ["רש״י דברי הימים ב ט, יט", ["L", 3662, 354]]],
      estherRabbah: [["אסתר רבה א, יב", ["L", 264, 25]], ["פנים אחרים נוסח ב", ["L", 274, 116]], ["מדרש אבא גוריון", ["L", 5844, 5]], ["במדבר רבה יב, יז", ["L", 259, 222]], ["מלכים א י, יח", ["V", 10, 10, 18]]],
      beitHamidrash: [["בית המדרש ב (דמות כסא שלמה)", ["L", 7924, 8]], ["ענין כסא שלמה", ["L", 7958, 4]], ["מלכים א י, יח", ["V", 10, 10, 18]]]
    }
  };
  // 1.0.1-L (A32): the places whose whole text cannot be read in a slide's time (45 s at most); the quotes are cut from the panel's own text, which stays in its card
  var tour_SHORT = {
    "כסא שלמה": "כסא שלמה (מלכים א י, יח–כ; דברי הימים ב ט, יז–יט): ״ויעש המלך כסא שן גדול ויצפהו זהב מופז. שש מעלות לכסה וראש עגל לכסה מאחריו וידת מזה ומזה אל מקום השבת ושנים אריות עמדים אצל הידות. ושנים עשר אריים עמדים שם על שש המעלות מזה ומזה״. רש״י: ״וכל צורת הכסא מפרשת באגדת מגלת אסתר״. על פי המדרש: על כל מעלה שני אריות ושני נשרים, ״אריא לקבל נשרא ונשרא לקבל אריא״ (תרגום שני לאסתר א, ב), ובאמצע כל מעלה זוג חיות רובצות זו מול זו. הכסא מוצג בארבע גרסאות: הפסוקים ומפרשיהם (ברירת המחדל), תרגום שני, אסתר רבה עם פנים אחרים ואבא גוריון, ובית המדרש ב. המידות, צורת החיות ומקום הכסאות — בחירת מודל. הפירוט המלא בכרטיס המקום שבלוח.",
    "עליית המלך לכסא": "עליית המלך לכסא: במודל עולה צללית בלבד, בלי פנים ובלי תווי דמות. בכל מעלה חוזר גלגל המנגנון, והארי פושט את ידו והנשר את כנפו לקראת העולה, לסירוגין: ״עלה במעלה הראשונה והארי פושט לו יד, ובשניה נשר פושט לו יד״ (אסתר רבה א, יב). בראש הכסא: ״הנשרים פורשים גפיהם, ועולים במנגנין, והיו מכסין למעלה על ראשו של מלך״ (פנים אחרים). עדי השקר: ״ולמה לחטוף לבם של עדים, בשביל שיעידו אמת״ (פנים אחרים). כל מדרש ועלייתו בשקופיות הבאות. זמני העלייה וצורת התנועות — בחירת מודל. הפירוט המלא בכרטיס המקום שבלוח.",
    "כסא שלמה — הגרסאות": "הפסוקים נותנים כסא שן מצופה זהב, שש מעלות, ראש עגול, ידות, שני אריות אצל הידות ושנים עשר על המעלות; רש״י מפנה: 'וכל צורת הכסא מפרשת באגדת מגלת אסתר'. כל השאר מן המדרשים, והמודל מציג כל מדרש בגרסה משלו: הפסוקים ומפרשיהם (ברירת המחדל, בלי מנגנון ובלי עלייה); תרגום שני לאסתר; אסתר רבה עם פנים אחרים ואבא גוריון; ובית המדרש ב. המידות, צורת החיות וזמני העלייה — בחירת מודל. הפירוט המלא בכרטיס המקום שבלוח."
  };
  // 1.0.1-L (L.88): the exhibit's slides. The stand's own axis (x -60; flyPoints.kelim stands 5 east of it to clear the panel, which is closed here); same line of sight, moved 5 west
  var tour_KELIM_GO = [{ pos: [-60, 21, -78], target: [-60, 4.5, -120], f: "kelim" }, { fp: "kelim", f: "kelim" }];
  // 1.0.1-L (L.80, the user: "זהו מקור לכאו' לכך שהכל פעל עפ"י חשמל - ציין זאת כבועה בתוך המצגת"): the inference, marked "לכאורה" and apart from the quotation, is
  // never the Ben Ish Chai's own statement: he speaks of the tower in the air and not of the throne; his words: בן יהוידע על סנהדרין קו: (book 2546, line 778,
  // letter for letter); the Gemara's line "ארבע מאה בעיי בעו דואג ואחיתופל במגדל הפורח באויר": book 125, line 4140
  var tour_BUBBLE = {
    mark: "לכאורה",
    inference: "מכאן מקור לכך שהכל פעל על פי חשמל. דברי הבן יהוידע עצמם עוסקים במגדל הפורח באויר ולא בכסא, והמסקנה אינה בלשונו.",
    quote: "בן יהוידע (סנהדרין קו:): 'אך נראה כי מה שנמצא בזמן הזה מגדל פורח באויר... העשוי ומתוקן על פי חכמה נפלאה... הנה בודאי היה מצוי ביד הראשונים... אלא שאחר כך נשתכחה חכמה של המגדל הזה וחזר ונתחדש על ידי חכמי אירופא'",
    refs: [["בן יהוידע על סנהדרין קו:", ["L", 2546, 778]], ["סנהדרין קו:", ["L", 125, 4140, "Sanhedrin.106b"]]]
  };
  // The verse slides (mode 3). d = { v: [chapter, first verse, last verse], t: title, go: candidates, x: the explanation (Rashi first; every
  // quotation as printed in the Otzaria library), xf?: a sentence added while the slide's model feature is on, r?: more sources
  // [label, ["V", book, chapter, verse] | ["P", book, page] | ["MI", chapter, mishnah] | ["MN", book, chapter, mishnah] | ["RB", chapter, halacha] | ["L", book, line]],
  // lay?: a layer the slide needs, out?: candidates outside the devir (the cloud confirmation was answered "ביטול"), then?: { go, at (part of the
  // slide), dur } or a list of them: further cameras, nofly?: keep the camera, compl?: a completion that stands on these verses (their text is not
  // repeated), bubble?: the Ben Yehoyada's bubble (L.80) }.
  // candidate = { fp: fly point key } | { place: the title of a place of the panel }, with f?: a model feature switched on with it, lay?: a layer.
  var tour_KINGS = [
    { v: [6, 2, 2], t: "מידות הבית", go: [{ place: "הבית (בית ה׳)" }, { fp: "heichalFront" }],
      x: "'ששים אמה ארכו' — 'ההיכל והדביר יחד' (רש״י): ארבעים אמה ההיכל ועשרים הדביר (רד״ק; ו, טז–יז); 'ועשרים רחבו ושלשים אמה קומתו'.",
      r: [["דברי הימים ב ג, ג", ["V", 39, 3, 3]]] },
    { v: [6, 3, 3], t: "האולם", go: [{ fp: "ulamInside" }, { place: "האולם ובית החליפות" }, { fp: "heichalFront" }],
      x: "'והאולם על פני היכל הבית' — 'לפני ההיכל בכניסתו' (רש״י); 'עשרים אמה ארכו על פני רחב הבית' — 'ארך האולם לרחבו של ההיכל מן הצפון לדרום', כי 'כל מדה היתרה קרויה ארך' (רש״י); ועשר אמות רחבו, ממזרח למערב. המבט מן החזית, והאולם סגור: באמצע חזיתו הפתח — עשר על עשרים ושתיים, בחירת מודל, כי אין בבית ראשון מקור למידותיו — ובו שתי דלתות ארז פתוחות, מקופלות אל תוך עובי הפתח: 'גם סגרו דלתות האולם ויכבו את הנרות' (דברי הימים ב כט, ז). הכפתור שעל המודל פותח אותו לגמרי, לצפייה בלבד.",
      r: [["דברי הימים ב ג, ד", ["V", 39, 3, 4]], ["דברי הימים ב כט, ז", ["L", 39, 633, "II_Chronicles.29.7"]]] },
    { v: [6, 4, 4], t: "חלוני שקופים אטומים", go: [{ place: "חלוני שקופים אטומים" }, { fp: "heichalSouth" }],
      x: "רש״י בשם רבותינו: 'פתוחים מבחוץ ואטומים מבפנים, קצרים מבפנים, שלא כדרך שאר חלונות... העשויות למאור, להראות שאינו צריך לאורה' (מנחות פו:). מספרם ומקומם — בחירת מודל (לוח 'השלמות').",
      r: [["מנחות פו:", ["P", 131, "פו:"]]] },
    { v: [6, 5, 5], t: "היציע סביב הבית", go: [{ fp: "heichalSouth" }, { place: "היציע והתאים" }],
      x: "'ויבן על קיר הבית יציע סביב' — 'סמוך לקיר הבית'; יציע, תא וצלע — 'שלשה שמות יש לה' (רש״י), ו'עשה צלעות מבחוץ, לדרום ולמערב ולצפון', כנגד ההיכל והדביר (רש״י). מבחוץ התאים סגורים בכותל, ופתחם היחיד בדרום (ו, ח).",
      r: [["מדות ד, ג", ["MI", 4, 3]]] },
    { v: [6, 6, 6], t: "חמש, שש, שבע — חשבון רש״י", go: [{ fp: "yatziaSection", f: "yatziaSection" }, { fp: "heichalSouth" }],
      x: "רש״י: 'קומת התא חמש אמות, וכשעולה כתל ההיכל חמש אמות, גורע את עביו, וכנס בו אמה לפנים, והניח על אותה כניסה ראשי קורות גג עלית התא, שהיא קרקעית לאמצעית' — לכן התחתונה חמש, התיכונה שש והשלישית שבע: 'נמצאת אמצעית רחבה מן התחתונה אמה, והעליונה רחבה מן התיכונה אמה'; 'לבלתי אחז בקירות הבית — שלא לדבק ראשי הקורות דרך נקבים בקירות הבית' (רש״י).",
      xf: "בחתך, מול פניו, כל קומה בצבע משלה: כותל 7 ותא 5, כותל 6 ותא 6, כותל 5 ותא 7, וכותל 4 מעל גג התאים; המגרעות בצהוב וראשי קורות הארז מונחים עליהן, וכותל התא עולה ישר. הצבעים והמקרא — בחירת מודל.",
      r: [["מדות ד, ג", ["MI", 4, 3]], ["מדות ד, ז", ["MI", 4, 7]]] },
    { v: [6, 8, 8], t: "פתח התאים והלולים", go: [{ place: "הליכה בלולים — הדגמה", act: true }, { place: "פתח התאים והלולים" }, { fp: "heichalSouth" }],   // 1.3.5: the walk in the lulim, as its place
      x: "רש״י (ותרגום 'מציעתא'): 'שבחמש תאים שבדרום היה לה פתח אל החוץ בשורה התחתונה' — התא האמצעי, 'ודרך אותו פתח נכנסים לכלם'; לכל תא שלושה פתחים (מדות ד, ג). לולים — 'בנין עמוד אבנים עשוי מעלות מעלות, וההולך בהן דומה כמקיף סביבות עמוד' (רש״י). רד״ק ומצודות: הפתח בקומה התיכונה.",
      r: [["מדות ד, ג", ["MI", 4, 3]]] },
    // 1.2.2: first the section along the length (the feature houseSection: the south wall off, the ceilings cut at the edge - גבים, בית דילפא,
    // שדרות - and the aliyot opened), then the roof from above as before
    { v: [6, 9, 10], t: "הספון וגג הבית", go: [{ place: "בית דילפא — בין תקרת הגבים לשדרות", f: "houseSection", lay: "aliyot" }, { place: "גג הבית ותקרותיו" }, { fp: "heichalFront" }],
      xf: "בתצוגה: חתך לאורך הבית, ממזרח — תקרת הגבים (מעל ההיכל קמורה), חלל בית דילפא והשדרות חתוכים בקצה המזרחי, ומעליהם רצפת העלייה.",
      x: "'גבים ושדרת' — 'שתי תקראות, אחת עשויה לנוי מלמטה, ואחת של לוחי ארזים מלמעלה', 'לדריסת הרגל, כשעולין לראות בבדק הבית' (רש״י). 'שהגג היה כמו ספינה וערבה הפוכה, שכן מנהג לקרות את הקרוי עגל כעין ספינה' (רש״י דברי הימים ב ג, ז) — ולכן תקרת ההיכל קמורה. 'חמש אמות קומתו — של כל אחד ואחד, הרי גבהן חמש עשרה אמות, לבד עבי התקרה'; 'ויאחז את הבית — הוא כסוי הגג העליון' (רש״י); לרד״ק ולמצודות — קורות התקרות שהונחו על המגרעות." },
    { v: [6, 15, 15], t: "קירות הארז על האבן, רצפת הברושים", go: [{ fp: "wallLayers", f: "wallLayers" }, { fp: "kodesh" }],
      x: "'ויבן את קירות הבית מביתה בצלעות ארזים' — 'קירות ארז אצל קיר האבן, כדי לטוח עליו זהב... ואי אפשר לטוח זהב על גבי האבנים, כי אם בעצים ובמסמרות' (רש״י); 'שלא תראה אבן הקיר' (רד״ק). 'ויצף את קרקע הבית בצלעות ברושים' — 'הרצפה כלה' (רש״י).",
      xf: "בתצוגה, בחלון שעל הקיר הצפוני סמוך לפתח ההיכל: השכבות חשופות במדרגות — בקיר אבן, ארז מגולף (לוחות זקופים, והגילוף חקוק בהם) וזהב, וברצפה אבן, ברושים וזהב." },
    { v: [6, 16, 16], t: "אמה טרקסין והדביר", go: [{ fp: "traksinTop" }, { place: "אמה טרקסין" }, { fp: "devirDoor" }, { fp: "kodesh" }],
      x: "'ויבן את עשרים אמה מירכתי הבית' — 'העשרים שבסוף הבית, הן של בית הכפרת' (רש״י), וגם הם מחופים ארז 'עד הקירות — עד התקרה'; 'מבית לדביר — לפנים ממחצת אמה טרקסין, המפסקת בין ארבעים לעשרים' (רש״י; יומא נא:).",
      r: [["יומא נא:", ["P", 107, "נא:"]]] },
    { v: [6, 17, 18], t: "ההיכל — 'הכל ארז אין אבן נראה'", go: [{ fp: "kodesh" }],
      x: "'הוא ההיכל לפני' — 'לפני הדביר לצד החוץ' (רש״י): ארבעים אמה. 'וארז אל הבית פנימה מקלעת פקעים ופטורי צצים' — פקעים 'כמין כפתורים' (רש״י; תרגום: 'ביעין'), ופטורי צצים — 'חבלים ופרחים' (רש״י); 'הכל ארז אין אבן נראה'." },
    { v: [6, 19, 20], t: "הדביר — קודש הקדשים", go: [{ fp: "kodeshHakodashim" }], out: tour_OUT,
      x: "'ודביר בתוך הבית מפנימה הכין לתתן שם את ארון ברית ה׳'. 'ולפני הדביר — לפנים מאותה מחצה, חלל של עשרים ארך, ושל עשרים רחב'; 'ועשרים אמה קומתו' — 'עלית של בית קדשי הקדשים, נמוכה משל היכל' (רש״י); 'ויצפהו זהב סגור'.",
      r: [["דברי הימים ב ג, ח", ["V", 39, 3, 8]]] },
    { v: [6, 21, 21], t: "רתוקות הזהב", go: [{ place: "רתוקות הזהב" }, { fp: "devirDoor" }],
      x: "'ויעבר ברתוקות זהב לפני הדביר' — 'ויעבר — לשון בריחים', 'ברתוקות — שלשלאות' (רש״י); רד״ק: בריחי זהב בכותל שלפני הדביר, 'במקום שהיה בו משכן הפרכת'.",
      r: [["דברי הימים ב ג, טז", ["V", 39, 3, 16]]] },
    { v: [6, 22, 22], t: "מזבח הזהב — אבן, ארז וזהב", go: [{ fp: "incenseAltar", f: "altarLayers" }, { fp: "incenseAltar" }, { place: "מזבח הזהב" }, { fp: "kodesh" }],
      x: "'וכל המזבח אשר לדביר צפה זהב' — מזבח הקטורת ('ויצף מזבח ארז — הוא מזבח הקטרת', רש״י ו, כ); מצודות: 'ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב', 'בכל ששת השטחים'. 'אשר לדביר' — 'מכוון כנגד פתח הדביר', בין השולחן למנורה, 'ומשוך קמעא כלפי חוץ' (רד״ק). במודל: 'מזבח הקטרת היה מרבע אמה על אמה' (רמב״ם בית הבחירה ג, יז), וגובהו אמה — בחירת מודל — והקרנות ממנו ('ממנו קרנתיו', שמות ל, ב); מקומו על ציר הבית, מיד מזרחית לשורות השולחנות והמנורות — גם זו בחירת מודל; ועליו עמוד עשן הקטורת.",
      xf: "בתצוגה: פינת המזבח חתוכה במדרגות — אבן, ארז וזהב.",
      r: [["מלכים א ו, כ", ["V", 10, 6, 20]], ["רד״ק ו, כב", ["V", 10, 6, 22]], ["רמב״ם בית הבחירה ג, יז", ["RB", 3, 17]], ["שמות ל, ב", ["V", 2, 30, 2]]] },
    { v: [6, 23, 28], t: "הכרובים — עשר אמות, כנפיים של חמש; כנף נוגעת בקיר וכנף נוגעת בכנף", go: [{ fp: "cherubim" }, { fp: "kodeshHakodashim" }], out: tour_OUT,
      x: "שני כרובים 'עצי שמן' — 'דאעי זיתא' (תרגום, רש״י), עשר אמות קומת כל אחד, 'ורגליהם בקרקע עומדים, אחד מצפון לארון, ואחד מן הדרום' (רש״י); חמש אמות כל כנף ועשר מקצות כנפיו ועד קצות כנפיו. 'וגוף הכרובים אינו מן המדה, ועומד בנס' (רש״י ו, כד; בבא בתרא צט.). פניהם, כציור הספר, פני ילד: 'תבנית ילדים וילדות עשה לכרובים, כרביא' (רש״י דברי הימים ב ג, י). 'ותגע כנף האחד בקיר' — הצפוני, 'וכנף הכרוב השני נגעת בקיר' — הדרומי, 'סוככים על הארון ועל בדיו'; 'וכנפיהם אל תוך הבית — וראשי הכנפים אשר באמצע הבית', 'נגעת כנף אל כנף — שכל חלל הבית עשרים' (רש״י). 'ויצף את הכרובים זהב'. במודל ארבע הכנפיים שוכבות במישור אחד, אופקי, בגובה הכתפיים ומתחת לראשים — חופה על הארון: 'ויסכו הכרבים על הארון ועל בדיו מלמעלה' (ח, ז), 'והיו כנפי הכרובים מטין מן הכותל וסוככין על הכפרת ועל הארון בכנפיהם' (רש״י דברי הימים ב ג, יג).",
      r: [["בבא בתרא צט.", ["P", 124, "צט."]], ["דברי הימים ב ג, י", ["V", 39, 3, 10]], ["חגיגה יג:", ["P", 114, "יג:"]], ["דברי הימים ב ג, יא", ["V", 39, 3, 11]], ["ג, יג", ["V", 39, 3, 13]], ["מלכים א ח, ז", ["V", 10, 8, 7]]] },
    { v: [6, 29, 29], t: "הגילופים — כרובים, תמרות ופטורי צצים", go: [{ fp: "carvings" }, { fp: "kodesh" }],
      x: "'ואת כל קירות הבית מסב קלע פתוחי מקלעות כרובים ותמרת ופטורי צצים' — 'חקוקי צורת כרובים ודקלים וחבלים ופרחים', 'מלפנים ולחיצון — לבית הכפרת הפנימי, ולהיכל החיצון' (רש״י); רד״ק: 'ציורים כרובים מפותחים לא שהיו בולטין'.",
      r: [["חגיגה יג:", ["P", 114, "יג:"]]] },
    { v: [6, 30, 30], t: "רצפת הזהב", go: [{ fp: "wallLayers", f: "wallLayers" }, { fp: "kodesh" }],
      x: "'ואת קרקע הבית צפה זהב לפנימה ולחיצון' — 'לבית הכפרת ולהיכל' (רש״י); 'על רצפת צלעות הברושים' (מצודות; ו, טו).",
      xf: "בתצוגה: שכבות הרצפה — אבן, ברושים וזהב." },
    { v: [6, 31, 32], t: "פתח הדביר ודלתותיו", go: [{ fp: "devirDoor" }],
      x: "'האיל מזוזות חמשית' — שני ביאורים ברש״י: 'כך שמעתי' — מפתן, שתי מזוזות, 'והמשקוף שעליו עשוי כשתים'; 'ואני אומר' — 'חמשה צלעות היו למזוזות, ולא היתה מרבעת' (ברירת המחדל במודל; השני — בטבלת 'שיטות ומחלוקות'). על הדלתות 'וירד על הכרובים' — 'היה מרדד הזהב טסין דקין לשקען בפתוחי הצורות' (רש״י). מעל הפתח משקוף בחתך המזוזות, כציור הספר — בחירת מודל: רש״י כותב 'ואינו מדבר לא במפתן ולא במשקוף', ואצל האחרים האיל הוא המשקוף: 'האיל הוא הסף העליון' (רד״ק), 'שהאיל והוא הסף אשר על הפתח' (רלב״ג)." },
    { v: [6, 33, 35], t: "פתח ההיכל ודלתות הברושים", go: [{ place: "פתיחת דלתות ההיכל — הדגמה", act: true }, { fp: "heichalDoor" }],   // 1.3.5: the doors open and fold - 6:34 "שני צלעים הדלת האחת גלילים"
      x: "'מאת רבעית' — 'מזוזות ההיכל היו רבועות' (רש״י, תרגום); 'ושתי דלתות עצי ברושים' — 'כל אחת כדי חצי רחב הפתח', 'שני צלעים' — 'תרין צירין, ציר העליון, וציר התחתון' (רש״י בשם התרגום); 'מישר על המחקה' — הזהב 'שוקע במקום שקועו, ובולט במקום בליטתו' (רש״י)." },
    { v: [6, 36, 36], t: "החצר הפנימית", go: [{ place: "החצר הפנימית — חצר הכהנים", act: true }, { fp: "azarah" }],   // 1.3.5: its zone lit on the floor, as its place
      x: "'ויבן את החצר הפנימית שלשה טורי גזית וטור כרתת ארזים' — 'היא עזרת הכהנים ועזרת ישראל', 'פנימית, לפי שהיתה לפנים מעזרת נשים' (רש״י); מצודות: שלוש שורות גזית ועליהן שורה של ארזים, 'וכסדר הזה בנה אותו עד כלות גבהי הכתלים'." },
    // 1.0.1-L (L.21; courts.md FOR-UI §6): no verse names the chamber: a completion, marked as such; flyPoints.lishkatHaGazit
    { v: [6, 36, 36], compl: true, t: "לשכת הגזית — בצפון החצר", go: [{ place: "לשכת הגזית", act: true }, { fp: "lishkatHaGazit" }, { fp: "azarah" }],   // 1.3.5: from above, its roof open, as its place
      x: "במלכים אין זכר ללשכת הגזית: השלמה מן המשנה והגמרא, וגם בבית ראשון: 'כי לשכה אחת היתה לה לחולדה, סמוכה ללשכת הגזית' (רש״י דברי הימים ב לד, כב). בצפון: 'שלש שבצפון: לשכת העץ, לשכת הגולה, לשכת הגזית' (יומא יט.), 'והשלש שבצפון לשכת הגזית. לשכת הגולה. לשכת העץ' (רמב״ם בית הבחירה ה, יז) — ובמשנה הנדפסת (מדות ה, ד) 'שבדרום'. בחלקו המזרחי של הכותל, מול המזבח: 'שבצפון סמוכה למזרח לשכת הגזית' (ציור תוספות יום טוב), 'נמצינו למדין שסנהדרין בצד מזבח' (מכילתא). לאורך הכותל, חציה בחצר וחציה מחוצה לה, כתרשים הספר: 'שמע מינה לשכת הגזית חציה בקדש וחציה בחול, ושמע מינה שני פתחים היו לה' (יומא כה.). מידותיה ומקומה המדויק — בחירת מודל.",
      r: [["יומא יט.", ["P", 107, "יט."]], ["רמב״ם בית הבחירה ה, יז", ["RB", 5, 17]], ["מדות ה, ד", ["MI", 5, 4]], ["יומא כה.", ["P", 107, "כה."]], ["צורת בית המקדש לתוספות יום טוב", ["L", 6028, 42]], ["מכילתא בחדש יא", ["L", 285, 1474]], ["רש״י דברי הימים ב לד, כב", ["L", 3662, 1065]]] },
    { v: [7, 1, 1], t: "בית שלמה — שלוש עשרה שנה", lay: "palace", go: [{ fp: "palace" }],
      x: "'ואת ביתו בנה שלמה שלש עשרה שנה' — 'שבמלאכת גבוה נזדרז, ובשלו נתעצל, ובשבחו ספר הכתוב' (רש״י). מקום הארמון אינו בפסוקים: במודל מדרום לבית ה׳ ונמוך ממנו — ראו 'החצר הגדולה'." },
    { v: [7, 2, 2], t: "בית יער הלבנון", lay: "palace", go: [{ place: "בית יער הלבנון" }, { fp: "forestUpper" }, { fp: "palace" }],
      x: "מאה אמה ארכו, חמישים רחבו ושלושים קומתו, 'על ארבעה טורי עמודי ארזים': 'לארך הבית היה טור עמודים בקרקע, והכרותות מעמוד לעמוד' (רש״י); 'בית מקרת מלכיא' (תרגום) — בית קיץ (רד״ק, מצודות). שלוש קריאות בטבלת 'שיטות ומחלוקות': רש״י כציור הספר (ברירת המחדל); מלבי״ם ורלב״ג — 'העמודים היו נתונים לרוחב הבית וחולקים את אורך הבית לג׳ חלקים' (מלבי״ם); ומצודת דוד — 'והשורות ההם עמדו לרוחב הבית', 'אבל לאורך הבית היה כתלים ממש'." },
    { v: [7, 3, 3], t: "ארבעים וחמישה נסרי הספון", lay: "palace", go: [{ fp: "forestRoof" }, { place: "בית יער הלבנון" }, { fp: "palace" }],
      x: "'וספן בארז ממעל על הצלעות' — הצלעות הן 'מחצות עליונות שעל הכרותות... כלן פתחים וחלונות', ועליהן 'ארבעים וחמשה נסרים היו הספון, שלשה טורי נסרים... חמשה עשר נסרים הטור... ארכן לרחב שבין טור לטור, ורחבן לארך הבית' (רש״י)." },
    { v: [7, 4, 5], t: "השקופים והפתחים", lay: "palace", go: [{ fp: "forestUpper" }, { place: "בית יער הלבנון" }, { fp: "palace" }],
      x: "'ושקפים' — קירוי נוסף, 'כי רחב של חמשה עשר נסרים, לא קרה את הבית בכל ארכו', של 'נסרים קטנים, נתונים על מרישין קטנים'; 'רבעים שקף' — הפתחים מרובעים, 'ולא עשויין כפה' (רש״י). רד״ק ומצודות: שלוש שורות חלונות — 'החלונות מכותל מזה, מול החלונות מכותל מזה' (מצודות)." },
    // 1.0.1-L (L.48, verify-palace Follow-ups §2): flyPoints.forestAlam / forestAv, which the palace module re-aims per reading, before the place titles
    { v: [7, 6, 6], t: "אולם העמודים — 'ועמדים ועב על פניהם'", lay: "palace", go: [{ fp: "forestAlam" }, { place: "אולם העמודים" }, { fp: "forestUpper" }, { fp: "palace" }],
      // 1.0.1-L (L.91, A24, the user: "אין עב בגג, העב הוא רק באולם העמודים וממילא לא תראה אותו, והכל דק"): the whole slide on the hall; the stop at forestAv is gone
      x: "'אולם עשה לפני העמודים האלה, מבוא לבית' (רש״י): חמישים אמה ארכו לרוחב הבית ושלושים רחבו. 'ואולם על פניהם — אולם גבוה עשה על כל הבית'; 'ועמדים ועב על פניהם — ...עמודים אחרים, ומרישין מעמוד לעמוד... עב היא מריש' (רש״י): העב הוא כאן, באולם העמודים בלבד, ואינו נראה; בסוף גג הבית אין עבים, אלא 'נסרים קטנים, נתונים על מרישין קטנים' (רש״י ז, ד). מלבי״ם: 'ולפני האולם השני היו עמודים ועב על פניהם, היינו מריש שהוא עץ עב'; מצודת דוד: לפני פתחי האולם 'עמדו עמודים תקועים בארץ, וממעל להם עץ עב'.",
      r: [["רש״י ז, ד", ["L", 3673, 324]]] },
    { v: [7, 7, 7], t: "אולם הכסא ואולם המשפט", lay: "palace", go: [{ fp: "throneHall" }, { fp: "throne" }, { place: "אולם הכסא ואולם המשפט" }, { fp: "palace" }],
      x: "'ואולם הכסא אשר ישפט שם' — ולפניו 'אולם המשפט, שיעמדו שם הבאים למשפט, עד אשר יקראו לבוא לפני המלך' (מצודות; רד״ק); 'וספון בארז מהקרקע עד הקרקע' — הרצפה בארזים, 'מיסוד כתל זה, ועד יסוד כתל זה' (רש״י, תרגום). הכסא — 'כסא שן גדול', שש מעלות ושנים עשר אריות — בשקופית של י, יח–כ, בסוף המצגת.",
      r: [["מלכים א י, יח", ["V", 10, 10, 18]]] },
    // 1.0.1-L (L.33): the king's house in its OWN walled court, בית בת פרעה inside the great court (the user's words; the book p13)
    { v: [7, 8, 8], t: "בית המלך בחצר האחרת, ובית בת פרעה", lay: "palace", go: [{ fp: "otherCourt" }, { fp: "kingsHouse" }, { place: "בית המלך" }, { fp: "palace" }],
      then: [{ go: [{ fp: "kingsHouse" }, { place: "בית המלך" }], at: 0.35, dur: 2500 }, { go: [{ fp: "pharaohDaughter" }, { place: "בית בת פרעה" }], at: 0.7, dur: 3000 }],
      x: "'וביתו אשר ישב שם' — 'דירה גמורה, לאכל שם ולשכב שם' (רש״י); 'חצר האחרת מבית לאולם' — 'לפנים מן אולם של בית יער הלבנון' (רש״י): חצר לעצמה, מוקפת חומה, מאחורי בית יער הלבנון ומחוץ לחצר הגדולה — כציור הספר ('מאחורי בית יער הלבנון, בתוך חצר אחרת, בנה את ביתו לאכול ולשתות שם'); ובתוכה בית המלך והגן שלפניו. 'ובית יעשה לבת פרעה... כאולם הזה' — 'כמעשה אולם הזה' (רש״י): לא בחצר המלך — 'לא תשב אשה לי בבית דויד' (דברי הימים ב ח, יא) — אלא בחצר בית יער הלבנון, בחירת מודל; מקומו אינו מפורש ('לא נתבאר ברש״י', הספר). פרטי הבית ועיטוריו — בחירת מודל.",
      r: [["דברי הימים ב ח, יא", ["L", 39, 171, "II_Chronicles.8.11"]]] },
    { v: [7, 9, 12], t: "האבנים היקרות והחצר הגדולה", lay: "palace", go: [{ place: "החצר הגדולה" }, { fp: "palace" }],
      x: "'אבנים יקרת כמדות גזית מגררות במגרה' — חלקות 'משני עבריהן' (מצודות), 'וממסד עד הטפחות' — 'מן היסוד עד שמי הקורה' (רש״י), והיסוד אבני עשר ואבני שמונה. 'וחצר הגדולה סביב שלשה טורים גזית וטור כרתת ארזים' — 'שלשה נדבכין של אבנים, ונדבך של עץ עליהם' (רש״י); 'ולחצר בית ה׳ הפנימית ולאלם הבית' — 'וכן בנה את האולם אשר לפני ההיכל' (מצודות). במודל החצר הגדולה מקיפה את בית יער הלבנון, אולמותיו ובית בת פרעה; החצר האחרת של המלך מחוץ לה — כציור הספר (ולמצודת דוד ורלב״ג שם גם בית המלך בתוכה)." },
    // 1.0.1-K review (tour-9): the verse's own words, 'בן אשה אלמנה הוא ממטה נפתלי' (Otzaria book 10, line 238: "בן־אשה אלמנה הוא ממטה
    // נפתלי"); the quotation had dropped 'הוא', as only Malbim's paraphrase does
    { v: [7, 15, 16], t: "יכין ובועז — העמודים", go: [{ fp: "yachinBoazFull" }, { fp: "yachinBoaz" }, { place: "יכין ובועז — מבט מפתח האולם" }, { fp: "heichalFront" }],
      then: { go: [{ fp: "boazFar" }, { fp: "yachinBoaz" }], at: 0.5, dur: 3000 },
      x: "שני עמודי נחושת 'שהעמיד באולם' (רש״י), שמונה עשרה אמה קומת העמוד, 'וחוט שתים עשרה אמה' — 'ארבע אמות על ארבע אמות עגל... ועביו ארבע אצבעות, והוא חלול' (רש״י, מירמיהו נב, כא). כותרת של חמש אמות, 'והעמוד תחוב בכותרת שתי אמות' (רש״י ז, טז). מקומם — 'העמידם שלמה באולם סמוך לכותל ההיכל' (רש״י ירמיהו נב, כג): במודל קרובים אליו ככל שהכותרת מאפשרת. המבט מרחוק, מן החצר, והאולם סגור: בעד פתח האולם ובין דלתותיו הפתוחות נראה יכין בשלמותו, מן הרצפה ועד ראש הכותרת — עשרים ואחת אמה — כדי שייראה גודלו, ואחר כך, מן הדרום־מזרח, בועז. שני העמודים יחד אינם נראים בשלמותם מבחוץ: הם עומדים בתוך האולם משני צדי הפתח, והפתח רוחבו עשר.",
      r: [["ירמיהו נב, כא", ["V", 13, 52, 21]], ["רש״י ירמיהו נב, כג", ["L", 3675, 2204]], ["דברי הימים ב ג, טו", ["V", 39, 3, 15]]] },
    { v: [7, 17, 20], t: "הכותרת — שבכה, רמונים ושושן", go: [{ fp: "yachinBoazCapital" }, { fp: "yachinBoazFull" }, { fp: "yachinBoaz" }, { place: "יכין ובועז — מבט מפתח האולם" }],
      x: "הכותרת 'כמין שני אגנים' (רש״י): התחתון, 'גלה', בית קבולו למעלה, והעליון, 'שבכה', 'כפוי על התחתון' — 'דומה כמין כפה' — ומקיפים אותו 'שבעה לולבין' של דקל; 'נמצא רחבה במקום הדבק... והוא קרוי בטן'. סביב הבטן 'שתי טורים' של רמונים, מאתיים, 'מחרזים בשלשלת' (רש״י). קריאה אחרת — מלבי״ם, בטבלת 'שיטות ומחלוקות': 'שכל עמוד בעצמו נעשה בראשו כמעשה שושן' (ז, כב), ו'שהיה שושן מצויר על כותל האולם במקום שהגיעו לשם ראשי העמודים' (ז, יט).",
      r: [["ז, יח", ["V", 10, 7, 18]], ["ז, כ", ["V", 10, 7, 20]], ["דברי הימים ב ג, טז", ["V", 39, 3, 16]], ["מלבי״ם ז, יט", ["V", 10, 7, 19]]] },
    { v: [7, 21, 22], t: "יכין ובועז — מקומם ושמותיהם", go: [{ fp: "yachinBoazFull" }, { fp: "yachinBoaz" }, { place: "יכין ובועז — מבט מפתח האולם" }],
      then: { go: [{ fp: "boazFar" }, { fp: "yachinBoaz" }], at: 0.5, dur: 3000 },
      x: "'ויקם את העמדים לאלם ההיכל' — 'באולם שלפני ההיכל'; הימני — 'אשר בפאת הדרומי' — יכין, 'לסימן טוב שיכון הבית לעד', והשמאלי — 'אשר בפאת הצפוני' — בעז, 'בו עז' (מצודות; רד״ק). 'ועל ראש העמודים מעשה שושן' — 'חצי אמה בראש כל אחד היה כתלו דק כשושן' (רש״י). המבט מן החצר, והאולם סגור: בעד פתחו נראה יכין בשלמותו, ואחר כך, מן הדרום־מזרח, בועז. שני העמודים יחד אינם נראים בשלמותם מבחוץ, שהם עומדים בתוך האולם משני צדי הפתח." },
    { v: [7, 23, 26], t: "הים", go: [{ fp: "yam" }],
      x: "'עשר באמה משפתו עד שפתו... וחמש באמה קומתו' — 'שלש תחתונות מרבעות, ושתים עליונות עגלות' (רש״י, מעירובין יד:); 'ופקעים מתחת לשפתו' — 'וצורת ביעין' (רש״י בשם התרגום); עומד על שנים עשר בקר, שלושה לכל רוח, 'וכל אחריהם ביתה'; 'אלפים בת יכיל' — 'חמשים ומאה מקוה טהרה' (רש״י). החשבון, וכך במודל: עשר על עשר ברום שלוש — שלוש מאות אמה מעוקבת; שתי העליונות העגולות — מאה וחמישים לחשבון הגמרא; יחד ארבע מאות וחמישים אמה, שהן 150 מקוואות, 6,000 סאה ו־2,000 בת. מקומו — בקרן המזרחית הצפונית של החצר, כרש״י ('מקצוע מזרחית צפונית', ז, לט) וכמפת הספר, ממזרח לצפון בית המטבחים, מול הננסין ושולחנות השיש; לרד״ק ולמצודות בקרן המזרחית הדרומית — בטבלת 'שיטות ומחלוקות'.",
      r: [["עירובין יד:", ["P", 105, "יד:"]], ["דברי הימים ב ד, ב", ["V", 39, 4, 2]], ["רש״י ז, לט", ["L", 3673, 446]]] },
    // 1.0.1-L (L.61, L.63-L.67, L.77): the bases as vessels-2 rebuilt them; no reference to the places L.51 removed: their fly points and the demo feature
    { v: [7, 27, 29], t: "המכונות — הגוף והמסגרות", go: [{ fp: "mechonaClose" }, { fp: "mechonot" }],
      x: "ארבע באמה אורך ורוחב, 'ושלש באמה קומתה — של מכונה, לבד קומת האופן' (רש״י); 'מסגרות בין השלבים' — 'שהשלבים הללו כעין שליבות סלם, כמין מקלות נחשת זקופין על המסגרות התחתונה', 'מסגרות קבועות משליבה לשליבה' (רש״י ז, כח): הלוחות שבין המקלות העומדים. במודל שלוש מסגרות בין השלבים בכל צד, כביאור הגר״א. על המסגרות 'אריות בקר וכרובים' — אריות ובקר בשורה העליונה וכרובים למטה — וביניהם 'ליות מעשה מורד': 'ליות, כמין זכר ונקבה מחברין זה בזה', 'מרדדין, כמין רדוד טס דק, ואין בולטין בעביו, ולא חקוקים בשקוע' (רש״י ז, כט) — הכל ציור דק על הנחושת." },
    // 1.0.1-L (L.93): the panel is closed now, so the route uses the whole width beside the banner: at 1280 x 800, with the lens shift, its start (34.5, 33) falls at screen x about 385 and the
    // rinsing stop (43, -46) at about 1195, the marble tables beside it in the frame (the banner ends at 312); the camera here and in baseSlides is on the route's middle, z -8 (flyPoints.mechonaDemo: [66,78,-3] -> [34,8,-3] would put the stop off the screen)
    { v: [7, 30, 33], t: "האופנים — 'אופן בתוך אופן'", go: [{ pos: [70, 88, -8], target: [34, 8, -8], f: "mechonaDemo" }, { fp: "mechonaDemo", f: "mechonaDemo" }, { fp: "mechonaClose", f: "mechonaDemo" }, { fp: "mechonaClose" }, { fp: "mechonot" }],
      x: "'וארבעה אופני נחשת' — 'שנים לפניה ושנים לאחריה' (רש״י), 'וקומת האופן האחד אמה וחצי האמה'; 'כמעשה אופן המרכבה' — 'אופן בתוך האופן שתי וערב' (רש״י בשם התרגום), 'למען יוכל להוליכם... מבלי שיצטרך להפכם' (פירוש בעל צורת הבית, אחרי רש״י ז, לז); ידות, גבים, חשוקים וחשורים — 'הכל מוצק'.",
      xf: "בהדגמה המכונה עוצרת תחילה בין האולם למזבח, ליד הכבש, לקידוש הכהנים — 'ורחצו אהרן ובניו ממנו את ידיהם ואת רגליהם' (שמות ל, יט) — ואחר כך נוסעת אל שולחנות השיש שבבית המטבחים, להדחת העולה: 'שעליהן מדיחין את הקרבים' (שקלים ו, ד), 'וקרבו וכרעיו ירחץ במים' (ויקרא א, ט); ואז חוזרת. בכל פינה הגלגל הקטן השוכב מסובב את הגדול לצדדים, והגדול הולך קדימה ואחור; גוף המכונה אינו מסתובב (הספר עמ׳ לז). לאן הוליכום אין מקור מפורש: המקום, הדרך והמים — בחירת מודל.",
      r: [["רש״י ז, לז", ["V", 10, 7, 37]], ["דברי הימים ב ד, ו", ["V", 39, 4, 6]], ["שמות ל, יט", ["V", 2, 30, 19]], ["משנה שקלים ו, ד", ["L", 54, 41, "Mishnah_Shekalim.6.4"]], ["ויקרא א, ט", ["L", 3, 10, "Leviticus.1.9"]]] },
    { v: [7, 34, 37], t: "הכתפות, הכן ופי הכותרת", go: [{ fp: "mechonaParts", f: "mechonaExplode", lay: "mechonaParts" }, { fp: "mechonaClose", f: "mechonaExplode", lay: "mechonaParts" }, { fp: "mechonaClose" }, { fp: "mechonot" }],
      x: "'וארבע כתפות אל ארבע פנות המכנה' — יוצאות מן הכן ביציקה אחת, 'והכתפות מחזיקות לכיור שלא יפל למטה לתוך הכן' (רש״י ז, ל, בנוסח 'ספרים אחרים'). הכותרת מרובעת — 'גג המכונה' — ובאמצעה 'נקב עגל אמה וחצי אמה רחב בעגול, וסביב אותו נקב כמין הקף מחצה, חצי אמה גבה סביב', 'והוא קרוי פי הכותרת', ועליו 'צורת פרחים'; 'והכן מנח על אותו הקף, ושולי הכן תחובין בתוך פי ההקף, ולמעלה הימנו הוא בולט אמה' (רש״י ז, לא). 'ויפתח על הלחת ידתיה ועל מסגרתיה כרובים אריות ותמרת' (ז, לו): על הלוחות ועל המסגרת התחתונה אריות, כרובים ודקלים, ועל הכתפות כרובים. 'כזאת עשה את עשר המכנות — מוצק אחד מדה אחת קצב אחד'.",
      xf: "בתצוגה: הכיור והכן מורמים מן המכונה, להראות כיצד הם מונחים זה בזה.",
      r: [["ז, ל", ["V", 10, 7, 30]], ["ז, לא", ["V", 10, 7, 31]], ["ז, לו", ["V", 10, 7, 36]]] },
    { v: [7, 38, 39], t: "הכיורות ומקום הים", go: [{ place: "מקום הכיורות והים" }, { fp: "mechonot" }],
      then: [{ go: [{ fp: "kiyorMoshe" }, { fp: "mechonot" }], at: 0.4, dur: 2500 }, { go: [{ fp: "yam" }], at: 0.75, dur: 3000 }],
      x: "עשרה כיורות, 'ארבעים בת יכיל הכיור האחד' — 'ארבעים בת שהם מאה ועשרים סאין, שהוא שיעור ג׳ מקואות' (מלבי״ם), 'ארבע באמה הכיור האחד' — 'גבהו של הכיור' (מצודות); רוחבו מבפנים אמה וחצי ורביע — 'אם היה כולו עגול' (מלבי״ם ז, כח); למלבי״ם עצמו, שהתחתונה מרובעת, זו המידה מבחוץ. ובמודל 42 בת עד השפה, ולחשבון הגמרא, שהמרובע יתר על העגול רביע, 40.3. לשם מה: 'לרחצה בהם את מעשה העולה ידיחו בם' (דברי הימים ב ד, ו; רש״י שם: 'לרחצה בהם. קדוש ידים ורגלים', 'מן מימי הכיור ידיחו קרבי העולה'), 'והכיורים היו לרחוץ מהם הכהנים ידיהם ורגליהם ולהדיח בהם מעשה העולה' (רד״ק ז, לט). בכיורות שני ברזים: 'כעין דוד ולה דדים המריקים מים' (מצודת ציון דברי הימים ב ד, ו); צורתם כציור הספר; ודדי בן קטין (יומא ג, י) — בית שני, ולא נבנו; ובכיור משה שניים בלבד, 'שלא היו לו אלא שנים' (שם). מקומן: 'חמש על כתף הבית מימין וחמש על כתף הבית משמאלו' — 'מימין כיור משה ומשמאלו' (רד״ק דברי הימים ב ד, ו), ורש״י: 'על כתף הבית. כנגד כתף הבית הימנית'; 'חמשה מימין כיור של משה וחמשה משמאל כיור משה' (ברייתא דמלאכת המשכן יב). במודל, כציור הספר ומפתו: כל העשר במקום אחד, שתי שורות של חמש מדרום לציר הבית, מול אגף האולם הדרומי, בינו לבין הכבש: השורה הצפונית בין האגף לכבש, והדרומית מעט מדרום להם — וכיור משה באמצע, בין השורות. 'ואת הים נתן מכתף הבית הימנית קדמה ממול נגב' — 'מקצוע מזרחית צפונית' (רש״י); לרד״ק ולמצודות — דרום־מזרח.",
      r: [["דברי הימים ב ד, ו", ["V", 39, 4, 6]], ["רש״י דברי הימים ב ד, ו", ["L", 3662, 129]], ["רד״ק ז, לט", ["L", 3540, 505]], ["רד״ק דברי הימים ב ד, ו", ["L", 3522, 88]], ["רש״י ז, לט", ["L", 3673, 445]], ["מלבי״ם ז, כח", ["L", 3394, 386]], ["ברייתא דמלאכת המשכן יב", ["L", 240, 2876]], ["מלבי״ם ז, לח", ["L", 3394, 406]], ["משנה יומא ג, י", ["L", 55, 28, "Mishnah_Yoma.3.10"]]] },
    { v: [7, 48, 48], t: "מזבח הזהב והשולחנות", go: [{ fp: "shulchanot" }, { fp: "kodesh" }],
      x: "'את מזבח הזהב ואת השלחן אשר עליו לחם הפנים זהב' — 'השלחן' שם כלל, כי עשרה שולחנות עשה (רד״ק ומצודות, מדברי הימים ב ד, ח): חמישה מימין שולחן משה וחמישה משמאלו, וכולם בצפון (רד״ק ז, מט; מנחות צח:). במודל כל העשרה בצורת שולחן משה, כציור הספר — הסניפין, הקנים והבזיכין — והלחם לפי השורה שבטבלת 'שיטות ומחלוקות'. שולחן משה בראש השורות, כגמרא: 'מי סברת שלחן דמשה בהדייהו הוה יתיב? לא, דמידלי ליה, ומנח ליה, ומיתתי להו לדידהו פורתא, כתלמיד היושב לפני רבו' (מנחות צט.) — 'משוך לצד מערב וראשו מכוון כנגד אויר שבין שתי השורות' (רש״י שם). ומזבח הזהב — מיד מזרחית לשורות, בחירת מודל.",
      r: [["דברי הימים ב ד, ח", ["V", 39, 4, 8]], ["מנחות צח:", ["P", 131, "צח:"]], ["מנחות צט.", ["P", 131, "צט."]], ["רש״י מנחות צט.", ["L", 2186, 4702]]] },
    { v: [7, 49, 49], t: "המנורות", go: [{ fp: "menorot" }, { fp: "kodesh" }], then: { go: tour_KELIM_GO, at: 0.65, dur: 3000 },
      xf: "בתצוגה, בשורה האמצעית: הפרח, הנר ובו השמן והפתילה, והמלקחים.",
      x: "'חמש מימין וחמש משמאול לפני הדביר' — 'אי אפשר לומר חמש מימין הפתח וחמש משמאל הפתח... אלא של משה באמצע, חמש מימינה, וחמש משמאלה' (רש״י) — וכולן בדרום; 'והנרת — בזיכין שנותנין בהן השמן והפתילה', 'והמלקחים — שמרימים בהן את הפתילה מתוך השמן' (רש״י). בכל מנורה כמנורת המשכן: 'ונמצאו גביעין עשרים ושנים, כפתורים אחד עשר, פרחים תשעה' (מנחות כח:); ולפני כל מנורה 'ובה שלש מעלות, שעליה הכהן עומד ומטיב את הנרות' (משנה תמיד ג, ט). והמנורות משוכות מערבה מן השולחנות, כציור הספר: 'ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות' (רלב״ג); שיעור האמה — בחירת מודל.",
      r: [["דברי הימים ב ד, ז", ["V", 39, 4, 7]], ["מנחות צח:", ["P", 131, "צח:"]], ["מנחות כח:", ["L", 131, 1005, "Menachot.28b"]], ["משנה תמיד ג, ט", ["L", 88, 21, "Mishnah_Tamid.3.9"]], ["רמב״ם בית הבחירה ג, יא", ["RB", 3, 11]], ["רלב״ג ז, מט", ["L", 3645, 312]]] },
    { v: [7, 50, 50], t: "כלי השרת והפותות", go: tour_KELIM_GO.concat([{ fp: "heichalDoor" }, { fp: "kodesh" }]),
      xf: "בתצוגה: לרש״י הספות כלי זמר, ולרד״ק ולרלב״ג כעין כדים, ושניהם מוצגים; המגריפה כציור הספר, דוגמה לכלי שיר שהיה במקדש; המזרק, הכף והמחתה; ולרש״י הפתות מפתחות, ולרד״ק צירי הדלתות, וגם הם שניהם מוצגים.",
      x: "'והספות והמזמרות והמזרקות והכפות והמחתות זהב סגור' — 'והכפות — לבזיכי לבונה', 'והמחתות — לחתות בהן... גחלים להוליך ממזבח החיצון למזבח הפנימי' (רש״י); 'והפתות לדלתות הבית הפנימי... לדלתי הבית להיכל' — לרש״י מפתחות; לתרגום ולרד״ק צירי הדלתות." },
    // 1.0.1-L (L.88): all the vessels together; marked as a completion, no verse repeated. Its text and links are the exhibit's own (verseSlides)
    { v: [7, 40, 50], compl: true, kelim: true, t: "כלי הבית — סוף פרק ז", go: tour_KELIM_GO, x: "" },
    { v: [8, 1, 5], t: "העלאת הארון מעיר דוד", lay: "palace", go: [{ place: "המעלות מבית המלך אל בית ה׳" }, { fp: "palace" }],
      then: { go: [{ fp: "heichalFront" }], at: 0.45, dur: 3500 },
      x: "'בירח האתנים בחג הוא החדש השביעי' — תשרי (רש״י בשם התרגום) — הקהיל שלמה את זקני ישראל 'להעלות את ארון ברית ה׳ מעיר דוד היא ציון' — 'שנתנו שם דוד כשהביאו מבית עובד אדום' (רש״י); הכהנים נשאו את הארון, והלוים את אהל מועד — 'וגנזו שלמה' (רש״י ח, ד). המבט עולה מן הדרום — מצד עיר דוד ובית המלך — אל הבית.",
      r: [["ח, ב", ["V", 10, 8, 2]], ["ח, ד", ["V", 10, 8, 4]], ["דברי הימים ב ה, ב", ["V", 39, 5, 2]]] },
    { v: [8, 6, 9], t: "הארון אל תחת כנפי הכרובים", go: [{ place: "הארון ובדיו", f: "arkInside" }, { fp: "kodeshHakodashim", f: "arkInside" }],   // 1.3.3 (the user): the ark opens by itself - 8:9 "אין בארון רק שני לחות האבנים"
      // "ביטול": from the heichal, low, at the two bulges of the staffs in the parochet (55-interior.js: x -43.4, y ~12.9, z +-1.4) - 8:8
      // "ויראו ראשי הבדים מן הקדש על פני הדביר"; camera = model choice
      out: [{ pos: [-38.2, 15, 2.8], target: [-43.4, 13.2, 0] }, { fp: "parochet" }, { place: "הפרוכת" }, { fp: "devirDoor" }],
      x: "'אל דביר הבית אל קדש הקדשים אל תחת כנפי הכרובים' — 'אותן שעשה שלמה העומדים על רגליהם בקרקע' (רש״י); 'ויארכו הבדים ויראו ראשי הבדים מן הקדש' — 'דוחקין ובולטין' בפרכת 'כעין שני דדי אשה', 'ולא יראו החוצה' (רש״י; יומא נד.) — במודל שתי הבליטות נראות מן ההיכל; 'אין בארון רק שני לחות האבנים'. על הכפורת כרובי משה, כנפיהם למעלה מראשיהם: 'והיו הכרבים פרשי כנפים למעלה' (שמות כה, כ), 'שלא תעשה כנפיהם שוכבים אלא פרושים וגבוהים למעלה אצל ראשיהם' (רש״י שם).",
      r: [["ח, ח", ["V", 10, 8, 8]], ["יומא נד.", ["P", 107, "נד."]], ["שמות כה, כ", ["V", 2, 25, 20]]] },
    { v: [8, 10, 11], t: "והענן מלא את בית ה׳", go: [{ fp: "kodesh", f: "cloud" }, { fp: "devirDoor", f: "cloud" }, { fp: "kodesh" }],
      x: "'ויהי בצאת הכהנים מן הקדש והענן מלא את בית ה׳' — 'הכהנים שנשאו הארון בדביר, כשיצאו שרתה שכינה בהיכל' (רש״י); 'ולא יכלו הכהנים לעמד לשרת מפני הענן' — 'בהיכל ובעזרה' (מצודות). במודל הענן מכסה את קודש הקדשים.",
      r: [["דברי הימים ב ה, יד", ["V", 39, 5, 14]]] },
    { v: [8, 62, 66], t: "חנוכת הבית", go: [{ fp: "mizbeach" }, { fp: "azarah" }],
      x: "'ביום ההוא קדש המלך את תוך החצר... כי מזבח הנחשת... קטן מהכיל' — רש״י מביא מחלוקת (זבחים נט.–נט:): לרבי יהודה 'דברים ככתבן' — קידש את רצפת העזרה להקטיר עליה; לרבי יוסי — 'שקבע בו מזבח של אבנים מחבר ברצפה'. ואחר כך 'שבעת ימים ושבעת ימים' — 'של חנוך' ו'חג הסכות' (רש״י).",
      r: [["ח, סד", ["V", 10, 8, 64]], ["זבחים נט:", ["P", 130, "נט:"]], ["ח, סה", ["V", 10, 8, 65]]] },
    // 1.0.1-L (L.68; courts-2.md FOR-UI §5): no verse names it: a completion from the Second Temple, marked as such; flyPoints.slaughterPlace
    { v: [8, 62, 66], compl: true, t: "בית המטבחים — השלמה מבית שני", go: [{ fp: "slaughterPlace" }, { place: "בית המטבחים" }, { fp: "mizbeach" }],
      x: "בספר מלכים אין זכר לטבעות, לשולחנות ולננסין: כל המקורות על בית שני, והם נוספו כאן כהשלמה, בצפון המזבח וממערב לים שבקרן. בתורה: 'ושחט אתו על ירך המזבח צפנה' (ויקרא א, יא; רש״י: 'על ירך המזבח. על צד המזבח'). הטבעות: 'וטבעות היו לצפונו של מזבח, ששה סדרים של ארבע ארבע' (מדות ג, ה). השולחנות: 'שמונה של שיש בבית המטבחים, שעליהן מדיחין את הקרבים' (שקלים ו, ד). הננסין: 'ועליו שמנה עמודים ננסין, ורביעין של ארז על גביהן, ואנקליות של ברזל היו קבועין בהם' (מדות ג, ה). התמיד: 'של שחר היה נשחט על קרן צפונית מערבית, על טבעת שניה' (תמיד ד, א). המרחקים: 'מן המזבח לטבעות שמנה אמות, מקום הטבעות עשרים וארבע, מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע' (מדות ה, ב). מידות הטבעות, השולחנות והננסין — בחירת מודל; השולחנות והננסין בשתי שורות, כציור הספר.",
      r: [["מדות ג, ה", ["MI", 3, 5]], ["מדות ה, ב", ["MI", 5, 2]], ["משנה שקלים ו, ד", ["L", 54, 41, "Mishnah_Shekalim.6.4"]], ["משנה תמיד ד, א", ["MN", 88, 4, 1]], ["ויקרא א, יא", ["L", 3, 12, "Leviticus.1.11"]], ["רש״י ויקרא א, יא", ["L", 3694, 57]]] },
    // 1.0.1-L (L.80; brief: the default version's text and the bubble): the throne; "pesukim" has no ascent (nothing in the verses moves): a plain slide
    { v: [10, 18, 20], t: "כסא שלמה", lay: "palace", bubble: true, go: [{ fp: "throne" }, { place: "כסא שלמה" }, { fp: "palace" }],
      then: { go: [{ fp: "throneSteps" }, { place: "עליית המלך לכסא" }], at: 0.5, dur: 3000 },
      x: tour_THRONE.pesukim + " צורת הכסא לפי המדרשים ועליית המלך לפי כל מדרש — במצגת 'לפי הנושאים'; ובלוח: השורה 'כסא שלמה' בטבלת 'שיטות ומחלוקות', והכפתור שעל הכסא.",
      r: tour_THRONE.refs.pesukim.slice(1).concat([["תרגום שני לאסתר א, ב", ["L", 3237, 14]]]) }
  ];
  // Hebrew numerals 1..99 (15 = טו, 16 = טז)
  function tour_heb(n) {
    if (n === 15) return "טו";
    if (n === 16) return "טז";
    const T = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"], O = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    return (T[Math.floor(n / 10)] || "") + (O[n % 10] || "");
  }
  // a source spec -> the UI's ref ({book, index} from ui_V / ui_P / ui_MI / ui_MN / ui_RB of 70-ui.js);
  // 1.0.1-L: ["L", book, line, sef?] = a line of the Otzaria library named directly (commentaries and pages the UI's tables do not hold)
  function tour_ref(sp) {
    try {
      if (sp[0] === "L") return { book: sp[1], index: sp[2] };
      if (sp[0] === "V") {
        if (typeof ui_V === "function") return ui_V(sp[1], sp[2], sp[3]);
        return null;
      }
      if (sp[0] === "P" && typeof ui_P === "function") return ui_P(sp[1], sp[2]);
      if (sp[0] === "MI") return typeof ui_MI === "function" ? ui_MI(sp[1], sp[2]) : null;
      if (sp[0] === "MN" && typeof ui_MN === "function") return ui_MN(sp[1], sp[2], sp[3]);
      if (sp[0] === "RB" && typeof ui_RB === "function") return ui_RB(sp[1], sp[2]);
    } catch (_) {
    }
    return null;
  }
  async function buildTour(ctx) {
    try {
      const U = ctx.ui;
      if (!U || !Array.isArray(U.views)) return;   // the UI did not load: no presentation
      if (!Array.isArray(ctx.animated)) ctx.animated = [];
      if (!ctx.shared) ctx.shared = {};
      const style = document.createElement("style");
      style.textContent = tour_CSS;
      document.head.appendChild(style);
      const CO = ctx.CO || {};
      const fnc = (f) => typeof f === "function";
      const call = (f, ...a) => {
        try {
          return fnc(f) ? f(...a) : undefined;
        } catch (_) {
          return undefined;
        }
      };
      const fin3 = (a) => Array.isArray(a) && a.length >= 3 && isFinite(a[0]) && isFinite(a[1]) && isFinite(a[2]);
      const now = () => performance.now();
      const inside = (node, el) => {
        for (let n = node; n && el; n = n.parentNode) if (n === el) return true;
        return false;
      };
      // ---- the UI's API (70-ui.js ctx.ui), each call guarded ----
      const confirmOpen = () => !!call(U.confirmOpen);
      const cloudOn = () => !!call(U.cloudOn);
      const resolveFp = (key) => {
        const f = call(U.resolveFp, key);
        return f && fin3(f.pos) && fin3(f.target) ? f : null;
      };
      const fly = (pos, target, dur) => {
        if (fnc(U.fly)) call(U.fly, pos, target, dur);
        else call(ctx.flyTo, pos, target, dur);
      };
      const setInfo = (key, custom) => call(U.setInfo, key, custom);
      // 1.0.1-L (L.34): the floating explanation card of the panel (ctx.ui.card)
      const closeXCard = () => {
        const c = U.card;
        if (!c || !fnc(c.close)) return;
        try {
          c.close();
        } catch (_) {
        }
      };
      const layerOn = (name) => !!(ctx.layers && ctx.layers[name] && ctx.layers[name].visible);
      const setLayer = (name, on) => {
        if (fnc(U.setLayer)) call(U.setLayer, name, !!on);
        else if (ctx.layers && ctx.layers[name]) ctx.layers[name].visible = !!on;
      };
      const cfEl = () => document.getElementById("tm-confirm");
      // a pending Holy-of-Holies confirmation is answered "ביטול" (its fly is dropped)
      const cancelConfirm = () => {
        if (!confirmOpen()) return;
        if (fnc(U.cancelConfirm)) return void call(U.cancelConfirm);
        const c = cfEl(), n = c && fnc(c.querySelector) ? c.querySelector(".n") : null;
        if (n && fnc(n.click)) n.click();
        else call(U.closeConfirm);
      };
      // the devir and its aliyah, as the UI's cloud test ("inKK": x -66..CO.xDevirE, |z| < 12, y 14..44)
      const KK_E = typeof CO.xDevirE === "number" ? CO.xDevirE : -44.5;
      const inDevir = (p) => fin3(p) && p[0] > -66 && p[0] < KK_E && p[2] > -12 && p[2] < 12 && p[1] > 14 && p[1] < 44;
      // ---- model features a slide switches on for itself (each undone when the slide is left); a missing one is skipped ----
      const onOff = (o) => (o && fnc(o.set) ? { on: () => !!o.on, set: (v) => o.set(!!v) } : null);
      const FEATURES = {
        yatziaSection: () => onOff(ctx.shared.yatziaSection),
        wallLayers: () => onOff(ctx.shared.wallLayers),
        altarLayers: () => onOff(ctx.shared.incenseAltar && ctx.shared.incenseAltar.layers),
        mechonaExplode: () => onOff(ctx.shared.mechona && ctx.shared.mechona.explode),
        mechonaDemo: () => {
          const d = ctx.shared.mechona && ctx.shared.mechona.demo;
          if (!d || !fnc(d.start) || !fnc(d.stop)) return null;
          // 1.0.1-K review (vessels-2 / tour-4): the slide's undo (off) parks the base AT ONCE - demo.reset(), "at once back in its place (for
          // the presentation)" (45-vessels.js) - also after the user's own "עצור" (then it drives home): stop() let it finish its round
          // at three times the speed, still driving for seconds into 7:34-37, which takes it apart and looks at its empty place
          const off = () => {
            if (fnc(d.reset)) {
              if (d.home !== true) d.reset();
            } else if (d.running) d.stop();
          };
          // 1.0.1-L (vessels-2 FOR-UI; a round is 48.6 s now, first the priests' washing, then the rinsing): the continuous mode's short slide
          // starts two seconds before the rinsing beside the marble tables (the purpose, L.40), the other modes from the start
          const on = () => {
            if (mode.key === "continuous" && fnc(d.seek) && Array.isArray(d.pourAt)) d.seek(d.pourAt[0] - 2);
            d.start();
          };
          return { on: () => !!d.running, set: (v) => (v ? on() : off()), off };
        },
        // 8:10-11: the cloud is put back over the devir and LEFT there (no undo): the UI itself returns it whenever the camera leaves the
        // devir, and switching it off again would reset that return (setCloud(false) clears its "seen near" state)
        cloud: () => (fnc(U.setCloud) && fnc(U.cloudOn) ? { on: cloudOn, set: (v) => (v ? U.setCloud(true) : undefined) } : null),
        // 1.0.1-L (L.72): R. Yose b. R. Yehuda's two tables in the ulam, the place "שולחנות האולם" (a switch of readings: "none" = hidden)
        ulamTables: () => {
          const o = ctx.shared.ulamTables;
          return o && fnc(o.set) ? { on: () => true, set: () => true } : null;   // 1.1.0: the tables are always shown (no "none")
        },
        // 1.2.2: the section along the length (70-ui.js setSection: the house's south wall off, the ceilings kept) with the aliyot opened
        houseSection: () => {
          const ao = ctx.shared.aliyotOpen;
          if (!fnc(U.setSection) || !fnc(U.sectionOn) || !ao || !fnc(ao.set)) return null;
          return {
            on: () => !!U.sectionOn(),
            set: (v) => {
              if (v) { if (fnc(U.setCutaway)) U.setCutaway(false); U.setSection(true); ao.set(true); }
              else { U.setSection(false); ao.set(false); }
            }
          };
        }
      };
      // 1.0.1-L (L.50): the feature a place of the panel switches on: its name in ctx.ui.places() (the ctx.shared key) -> the tour's FEATURES;
      // any other key of ctx.shared with set() and on (or current / keys) works too, and a missing one is skipped
      const FEAT_ALIAS = { incenseAltar: "altarLayers", "incenseAltar.layers": "altarLayers", "mechona.demo": "mechonaDemo", "mechona.explode": "mechonaExplode", section: "yatziaSection", demo: "mechonaDemo", explode: "mechonaExplode" };
      const featureOf = (name) => {
        const k = FEAT_ALIAS[name] || name;
        if (FEATURES[k]) return FEATURES[k]();
        const o = ctx.shared[k];
        if (!o || !fnc(o.set)) return null;
        if (Array.isArray(o.keys) && o.keys.length > 1) return { on: () => o.current !== o.keys[0], set: (v) => o.set(v ? o.keys[1] : o.keys[0]) };
        return onOff(o);
      };
      const hasFeature = (name) => !!featureOf(name);
      const featureOn = (rt, name) => {
        const F = featureOf(name);
        if (!F) return false;
        try {
          if (!F.on()) {
            F.set(true);
            rt.undo.push(() => {
              try {
                if (fnc(F.off)) F.off();   // the feature's own way back (the base's demo: parked at once)
                else if (F.on()) F.set(false);
              } catch (_) {
              }
            });
          }
          return true;
        } catch (_) {
          return false;
        }
      };
      // 1.0.1-K review (vessels-2 / tour-4): a slide that takes the base apart (7:34-37) starts from a parked base - a demo still running
      // (the user's own) is parked at once and started again when the slide is left (this undo is pushed before the explode's, so it runs
      // after it: the parts go down in 1.1 s while the base waits its first 1.2 s); a base driving home after "עצור" is parked at once
      const parkBase = (rt) => {
        const d = ctx.shared.mechona && ctx.shared.mechona.demo;
        if (!d || !fnc(d.reset) || d.home === true) return;
        const was = !!d.running;
        try {
          d.reset();
        } catch (_) {
          return;
        }
        if (was && fnc(d.start)) {
          rt.undo.push(() => {
            try {
              if (!d.running) d.start();
            } catch (_) {
            }
          });
        }
      };
      const layerNeed = (rt, name) => {
        if (!name || !ctx.layers || !ctx.layers[name] || layerOn(name)) return;
        setLayer(name, true);
        rt.undo.push(() => setLayer(name, false));
      };
      // 1.0.1-K review (tour-1 / cross-2 / interior-2): the layer groups that a feature's own set() drives, together with its meshes and its
      // "on" (50-heichal.js: the yatzia section -> yatziaDims; 55-interior.js: the wall layers -> wallLayers, the altar's layers ->
      // altarLayers; the base taken apart -> mechonaParts, its parts' labels). The tour never writes them raw: at the end the features go
      // back through their own set() (OWN_FEAT), and the parts' labels follow the explode; the other layers are restored as before
      // 1.0.1-L: + yatziaWhole (the section's set), mechonaPurpose and mechonaWash (the demonstration), the ulam tables' groups (ulamTables.set), forestBoards (a
      // palace hook keeps it equal to the boards) and the throne's version groups (throneVersion.set)
      const OWNED = new Set(["yatziaDims", "yatziaWhole", "wallLayers", "altarLayers", "mechonaParts", "mechonaPurpose", "mechonaWash", "ulamTables", "ulamTablesRyby", "ulamTablesMishnah", "forestBoards", "kelim", "arkInside", "arkLid"]);
      const OWN_FEAT = ["yatziaSection", "wallLayers", "altarLayers", "mechonaExplode", "kelim", "arkInside"];   // (1.0.1-L: kelim, arkInside: a press of their pills during the tour)
      const layerVis = () => Object.keys(ctx.layers || {}).filter((n) => !OWNED.has(n) && n.indexOf("throne") !== 0).map((n) => [n, layerOn(n)]);
      const featState = (k) => {
        try {
          const F = featureOf(k);
          return F ? !!F.on() : null;
        } catch (_) {
          return null;
        }
      };
      // 1.0.1-K review (tour-8): the panel's "סיבוב איטי" through the UI - ctx.ui.autoRotate {get(): its checkbox, set(on): the checkbox and
      // controls.autoRotate together}, so the box shows what really turns; without it (an older ui.js) controls.autoRotate directly
      const autoRot = () => (U.autoRotate && fnc(U.autoRotate.get) && fnc(U.autoRotate.set) ? U.autoRotate : null);
      // ---- the user's rule: the tour never opens a removal by itself. If a navigation call of the UI still opens one (an older ui.js:
      // the automatic cutaway / openings of the views and rows), it is undone at once - by the UI's own "automatic" switches, by the
      // on-model buttons that flipped, and as the last resort on the meshes of the hide-list ----
      const HIDE = () => [["cut", ctx.cutaway], ["yatzia", ctx.yatziaCut], ["ulam", ctx.ulamCut], ["boards", ctx.forestBoardsCut]];
      const anyHidden = (a) => Array.isArray(a) && a.some((m) => m && m.visible === false);
      const mbList = () => (Array.isArray(ctx.shared.modelButtons) ? ctx.shared.modelButtons : []);
      // 1.3.6 / 1.9.4 (the user, 11.11.2026: "למה הוא מציג במצגת בהתחלה את החתך פתוח לא קשור למקום"; "החתך נשאר פתוח לאורך כל המצגת"): the
      // presentation starts from the model's regular state. Every viewing tool the viewer left on - the on-model buttons (the house or
      // the galleries opened, a section of the galleries, roofs, a demonstration), the live section and the walk - goes off when it
      // starts, and what is not a demonstration comes back when it ends (restore), as the rows and the layers do. Not touched: the
      // cloud (the devir's slides ask about it themselves) and a button that only mutes (keepDemos).
      const toolsOff = () => {
        const back = [];
        for (const b of mbList().slice()) {
          try {
            if (!b || !fnc(b.get) || !fnc(b.set) || b.keepDemos || b.id === "ui-cloud" || !b.get()) continue;
            b.set(false);
            if (!b.get() && !/^עצור/.test(String(b.labelOn || "")) && !/demo/i.test(String(b.id || ""))) back.push(() => { if (!b.get()) b.set(true); });
          } catch (_) {
          }
        }
        try {
          const S = ctx.shared.section;
          if (S && S.on && fnc(S.set)) {
            const ax = S.axis, v = S.v;
            S.set(false, ax, v);
            back.push(() => { if (!S.on) S.set(true, ax, v); });
          }
          const w = ctx.shared.walkMode;
          if (w && w.on && fnc(w.set)) w.set(false);
          if (fnc(ctx.shared.navRepaint)) ctx.shared.navRepaint();
        } catch (_) {
        }
        return back;
      };
      const snapOpen = () => {
        const o = { mb: mbList().map((b) => !!(b && fnc(b.get) && call(b.get))) };
        for (const [k, a] of HIDE()) o[k] = anyHidden(a);
        return o;
      };
      const keepClosed = (before) => {
        let opened = false;
        for (const [k, a] of HIDE()) {
          if (before[k] || !anyHidden(a)) continue;
          opened = true;
          if (k === "cut") call(U.applyCut, false);
          else call(U.applyOpen, k, false);
        }
        if (!opened) return;
        mbList().forEach((b, i) => {
          if (b && fnc(b.get) && fnc(b.set) && !before.mb[i] && call(b.get)) call(b.set, false);
        });
        for (const [k, a] of HIDE()) if (!before[k] && anyHidden(a)) for (const m of a) if (m) m.visible = true;
      };
      // ---- targets: a fly point (ctx.ui.resolveFp: the module's, the Sea's placement, or the UI's fallback), a place of the panel by title
      // (its view, or its cam / tg), or an explicit camera ----
      const camOf = (c) => {
        if (!c) return null;
        if (c.fp) {
          const f = resolveFp(c.fp);
          return f ? { pos: f.pos.slice(0, 3), target: f.target.slice(0, 3), layer: null } : null;
        }
        if (c.place) {
          const it = call(U.place, c.place);
          if (!it) return null;
          const f = it.view ? resolveFp(it.view) : null;
          const pos = f ? f.pos : fnc(it.cam) ? call(it.cam) : it.cam;
          const target = f ? f.target : fnc(it.tg) ? call(it.tg) : it.tg;
          return fin3(pos) && fin3(target) ? { pos: pos.slice(0, 3), target: target.slice(0, 3), layer: it.layer || null } : null;
        }
        return fin3(c.pos) && fin3(c.target) ? { pos: c.pos.slice(0, 3), target: c.target.slice(0, 3), layer: null } : null;
      };
      const pick = (list) => {
        for (const c of Array.isArray(list) ? list : []) {
          if (c.f && !hasFeature(c.f)) continue;   // a candidate tied to a feature the model does not have
          const cam = camOf(c);
          if (cam) return { c, cam };
          // 1.3.5 / 1.9.3: a place shown by its action alone (a walk that leads the eye itself) has no camera of its own
          if (c.place && c.act && placeAct(placeByTitle(c.place))) return { c, cam: { pos: null, target: null, layer: null } };
        }
        return null;
      };
      // ---- exterior test of the continuous mode's orbit: the camera >= 35 from its target and nothing above it within 150 amot ----
      let roofList = null;
      const roofs = () => {
        if (roofList) return roofList;
        roofList = [];
        if (ctx.root && fnc(ctx.root.traverse)) {
          ctx.root.traverse((o) => {
            if (!o.isMesh || o.isInstancedMesh || !o.geometry) return;
            const pa = o.geometry.attributes && o.geometry.attributes.position;
            if (pa && pa.count > 30000) return;   // the terrain: always below
            roofList.push(o);
          });
        }
        return roofList;
      };
      const upRay = new Raycaster(), UP = new Vector3(0, 1, 0), P0 = new Vector3();
      const shown = (o) => {
        for (; o; o = o.parent) if (o.visible === false) return false;
        return true;
      };
      const outdoors = (pos, target) => {
        if (!fin3(pos) || !fin3(target)) return false;
        if (Math.hypot(pos[0] - target[0], pos[1] - target[1], pos[2] - target[2]) < 35) return false;
        try {
          P0.set(pos[0], pos[1], pos[2]);
          upRay.set(P0, UP);
          upRay.near = 0;
          upRay.far = 150;
          for (const h of upRay.intersectObjects(roofs(), false)) if (shown(h.object)) return false;
        } catch (_) {
          return false;
        }
        return true;
      };
      // ---- the opinions table (rows of ctx.ui.opinions: options [[key, label, info, refs]], onPick, mark, cur, fly) ----
      const rowsOf = () => (Array.isArray(U.opinions) ? U.opinions : []).filter((r) => r && !r.disabled && Array.isArray(r.options) && r.options.length > 1 && fnc(r.onPick));
      const setRow = (row, key) => {
        if (!row || row.cur === key) return;
        call(row.onPick, key);
        call(row.mark, key);
      };
      // 1.0.1-L (L.81): the throne's versions: the row "כסא שלמה — לפי איזה מדרש" of the opinions table (70-ui.js), when it is there
      const isThroneRow = (r) => r.options.some((o) => o[0] === "targumSheni");
      const throneRow = () => rowsOf().find(isThroneRow) || null;
      // ---- the slides ----
      const vRange = (v) => tour_heb(v[0]) + ", " + tour_heb(v[1]) + (v[2] > v[1] ? "–" + tour_heb(v[2]) : "");
      // 1.0.1-L (L.50): the panel's places in its order: ctx.ui.places() (one entry per place button: title, group, view, fp, info, refs, layer,
      // feature, item), or by the older API (placeTitles + place: no groups, the camera from the item)
      const placesOf = () => {
        let list = null;
        if (fnc(U.places)) list = call(U.places);
        if (Array.isArray(list) && list.length) return list.filter((p) => p && p.title);
        const titles = call(U.placeTitles);
        if (!Array.isArray(titles)) return [];
        const out = [];
        for (const t of titles) {
          const it = call(U.place, t);
          if (!it) continue;
          out.push({ title: t, group: it.group || "", view: it.view || null, fp: null, info: it.key ? (U.info && U.info[it.key]) || "" : it.info || "",
            refs: it.key ? (U.refs && U.refs[it.key]) || [] : it.refs || [], layer: it.layer || null, feature: it.feature || null, item: it });
        }
        return out;
      };
      const camKey = (p) => p.fp || p.view || (p.item && p.item.view) || null;
      const isExtras = (g) => !!g && g.indexOf("השלמות") >= 0;   // the group "השלמות": its entries repeat the views' cameras and are not their home
      // the feature a place's slide needs: the panel's word for it, and a fly point that is only right with its feature on (the section's camera
      // stands inside the closed chambers while the section is off: 50-heichal.js) - when the panel's list does not name them
      const NEED_FEAT = { yatziaSection: "yatziaSection", wallLayers: "wallLayers" };
      const placeFeat = (p) => {
        if (p.feature && hasFeature(p.feature)) return p.feature;
        const k = camKey(p);
        return k && NEED_FEAT[k] ? NEED_FEAT[k] : null;
      };
      // a place's slide: its fly point / view, else its own camera, else (only a text) its group's view; with its feature when it has one
      // (1.0.1-L: 57-kelim.js gives its links as specs, ["V", 10, 7, 40]: resolved here)
      const linkRefs = (rs) => (rs || []).map(([l, r]) => [l, Array.isArray(r) ? tour_ref(r) : r]).filter((x) => x[1]);
      // 1.3.5 / 1.9.3 (the user: "בדוק שכל הטכני באמת נמצא בשני הבתים כולל עדכון כרטיסים ומצגות"; the full scan of 10.11.2026): A PLACE'S
      // SLIDE DOES WHAT THE PLACE'S BUTTON DOES - its own feature (pf: a zone lit on the floor, the altar's frames - a feature object of
      // the panel, { isOn, on, off }, that is not one of the tour's named FEATURES) and its action (act: the roof opened to look down
      // into a chamber, the cells' section, a demonstration). What the action opens is held until the slide is left (the engine's
      // ctx.shared.holdAuto / closeAuto), a demonstration runs to its end before the next slide, and a place whose action is all it has
      // (a walk that leads the eye itself) is not flown to. Until now such slides only flew: a closed roof seen from above, or the
      // group's general view instead of the walk. A verse's slide shows a place so by a candidate { place, act: true }.
      const placeOwnFeat = (p) => {
        const F = p && p.item && p.item.feature;
        if (!F || !fnc(F.on) || !fnc(F.isOn) || F.timed === false) return null;   // (an animation with its own end: the throne's slides)
        if (p.feature && hasFeature(p.feature)) return null;                       // one of the tour's own features: switched on by its name
        return F;
      };
      const placeAct = (p) => (p && p.item && fnc(p.item.action) ? p.item.action : null);
      const placeOwnCam = (p) => !!(p && (p.fp || (p.item && (p.item.view || p.item.cam || p.item.tg))));
      const placeByTitle = (t) => placesOf().find((x) => x.title === t) || null;
      const demoRunning = () => {
        const L = ctx.shared.demoStops;
        if (!Array.isArray(L)) return false;
        for (const d of L) {
          try {
            if (d && fnc(d.running) && d.running()) return true;
          } catch (_) {
          }
        }
        return false;
      };
      const runPlace = (rt, s, res) => {
        let pf = s.pf || null, act = s.act || null;
        if (s.actOnly) rt.actOnly = true;
        if (res && res.c && res.c.place && res.c.act) {
          const p = placeByTitle(res.c.place);
          if (p) {
            pf = pf || placeOwnFeat(p);
            act = act || placeAct(p);
            if (act && !placeOwnCam(p)) rt.actOnly = true;
          }
        }
        if (pf && !rt.feat) {
          try {
            if (!pf.isOn()) {
              pf.on();
              rt.undo.push(() => {
                try {
                  if (fnc(pf.off) && pf.isOn()) pf.off();
                } catch (_) {
                }
              });
            }
          } catch (_) {
          }
        }
        if (act) {
          const rows0 = rowsOf().map((r) => [r, r.cur]);
          rt.undo.push(() => {
            call(ctx.shared.stopDemos);
            for (const [r, k] of rows0) if (r.cur !== k) setRow(r, k);   // (a place may pick a reading: the small ramps' two places)
          });
          call(act);
          rt.act = true;
        }
      };
      const placeSlide = (p, groupCam) => {
        const f = placeFeat(p), k = camKey(p), go = f === "kelim" ? tour_KELIM_GO.slice() : [];   // 1.0.1-L (L.88): the panel's own camera there is for the card beside its panel
        if (k) go.push(f ? { fp: k, f } : { fp: k });
        go.push(f ? { place: p.title, f } : { place: p.title });
        if (groupCam) go.push({ fp: groupCam });
        return { kind: "place", part: 0, group: p.group || "", title: p.title, text: tour_SHORT[p.title] || p.info || "", refs: linkRefs(p.refs), go, lay: p.layer || null, out: tour_OUT,
          pf: placeOwnFeat(p), act: placeAct(p), actOnly: !!(placeAct(p) && !placeOwnCam(p)),   // 1.3.5 / 1.9.3
          bubble: p.title === "כסא שלמה" || p.title === "עליית המלך לכסא" || k === "throneSteps" };
      };
      const viewSlide = (v, group) => ({ kind: "view", part: 0, group: group || "", key: v.key, title: v.label, text: (U.info && U.info[v.key]) || "", refs: (U.refs && U.refs[v.key]) || [],
        go: [{ fp: v.key }], lay: v.layer || null, out: tour_OUT });
      // the base's demonstration and its parts: L.51 took their places out of the panel (the pills on the base do them), and the presentation
      // still shows them, after the close view of the base: the pill's own words as the slide's title, its explanation as the text
      const baseSlides = (group) => {
        const out = [];
        for (const [id, feat, go, lay, what] of [
          ["mechonaDemo", "mechonaDemo", [{ pos: [70, 88, -8], target: [34, 8, -8], f: "mechonaDemo" }, { fp: "mechonaDemo", f: "mechonaDemo" }, { fp: "mechonaClose", f: "mechonaDemo" }, { fp: "mechonot" }], null, "המכונה בפעולה"],
          ["mechonaExplode", "mechonaExplode", [{ fp: "mechonaParts", f: "mechonaExplode", lay: "mechonaParts" }, { fp: "mechonaClose", f: "mechonaExplode", lay: "mechonaParts" }, { fp: "mechonot" }], null, "המכונה לחלקיה"]
        ]) {
          const b = mbList().find((x) => x && x.id === id);
          if (!b || !hasFeature(feat)) continue;
          // (the pill's title ends by telling what a further click does; in a slide nothing is clicked, and leaving the slide reassembles the base)
          out.push({ kind: "place", part: 0, group: group || "", title: what + " — ״" + b.label + "״", text: (b.title || "").replace(/\s*לחיצה נוספת[^.]*\.\s*$/, ""), refs: [["מלכים א ז, כז", tour_ref(["V", 10, 7, 27])], ["ז, לג", tour_ref(["V", 10, 7, 33])], ["דברי הימים ב ד, ו", tour_ref(["V", 39, 4, 6])]].filter((x) => x[1]),
            go, lay, out: tour_OUT });
        }
        return out;
      };
      // 1.0.1-L (L.78-L.81): one slide per version of the throne, then each midrash's witnesses' scene; "pesukim" (no ascent) a plain slide with the verses
      const throneSlides = (group) => {
        const tv = ctx.shared.throneVersion, th = ctx.shared.throne;
        if (!tv || !Array.isArray(tv.keys) || !fnc(tv.set)) return [];
        const out = [], names = tv.names || {}, T = tour_THRONE;
        for (const key of tv.keys) {
          const name = key === "beitHamidrash" ? "בית המדרש ב" : names[key] || key, cap = th && th.script && th.script[key], cw = th && th.witnessScript && th.witnessScript[key];   // 1.0.1-L: the user: its name on screen, whatever the module's list says
          const asc = !!(th && th.ascent && fnc(th.ascent.start) && Array.isArray(cap) && cap.length);
          const common = { kind: "throne", part: 0, group: group || "", ver: key, sub: "מלכים א י, יח–כ", lay: "palace", out: tour_OUT, bubble: true, refs: (T.refs[key] || T.refs.pesukim).map(([l, sp]) => [l, tour_ref(sp)]).filter((x) => x[1]) };
          if (key === "pesukim" || !asc) {
            const verses = [], kv = [18, 19, 20];
            let letters = 0;
            if (key === "pesukim") for (const v of kv) { const t = tour_VERSES["10:" + v] || ""; verses.push([v, t]); letters += t.replace(/[^א-ת]/g, "").length; }
            out.push(Object.assign({}, common, { title: "כסא שלמה — לפי " + name, text: key === "pesukim" ? T.pesukim : T.lead[key] || "", go: [{ fp: "throne" }, { fp: "throneSteps" }, { fp: "palace" }], then: [{ go: [{ fp: "throneSteps" }], at: 0.5, dur: 3000 }], verses, letters, anim: null }));
            continue;
          }
          // 1.0.1-L (A31, "תאחד"): one slide per version: the ascent, and on the same slide the witnesses with their captions (beginAnim, animStep)
          const wit = !!(th.witnesses && fnc(th.witnesses.start) && Array.isArray(cw) && cw.length);
          out.push(Object.assign({}, common, { title: "כסא שלמה — לפי " + name, text: T.lead[key] || "", go: [{ fp: "throneSteps" }, { fp: "throne" }, { fp: "palace" }], anim: "ascent", animW: wit, goW: [{ fp: "throne" }, { fp: "throneSteps" }, { fp: "palace" }] }));
        }
        return out;
      };
      // L.50: the whole panel. The opening view; then group by group its places in their order, each grid view of the group right before the first
      // place that flies to it (a place that only repeats the view's text IS that slide); a view no place flies to, and an overview, opens its
      // group; the group "השלמות" is the panel's last and holds no view. After the throne's own places, its versions; at the VERY END the readings
      const topicSlides = () => {
        const out = [];
        const views = (Array.isArray(U.views) ? U.views : []).filter((v) => v && v.key && v.key !== "aliyot" && resolveFp(v.key));   // "העליות" is the row "גובה הבית" of the opinions table: shown with the readings
        const byKey = {};
        for (const v of views) byKey[v.key] = v;
        const places = placesOf();
        const groups = [];
        for (const p of places) if (groups.indexOf(p.group || "") < 0) groups.push(p.group || "");
        const viewKeyOf = (k) => (k && !byKey[k] && tour_VIEW_ALIAS[k] ? tour_VIEW_ALIAS[k] : k);
        const home = {};
        for (const p of places) {
          const k = viewKeyOf(camKey(p));
          if (k && byKey[k] && !isExtras(p.group) && !(k in home)) home[k] = p.group || "";
        }
        const opens = {};
        let prev = groups.filter((g) => !isExtras(g))[0];
        for (const v of views) {
          if (v.key === "__general") continue;
          if (!(v.key in home)) {
            const hint = tour_VIEW_GROUP[v.key], g = hint ? groups.find((x) => x.indexOf(hint) >= 0) : undefined;
            home[v.key] = g !== undefined ? g : prev;
            opens[v.key] = true;
          }
          if (tour_VIEW_OPENS[v.key]) opens[v.key] = true;
          prev = home[v.key];
        }
        const done = {};
        const viewSlideOf = {};   // 1.3.5 / 1.9.3: a place folded into its view's slide gives it its feature and its action
        const emitView = (v, g) => {
          if (done[v.key]) return;
          done[v.key] = true;
          const vs = viewSlide(v, g);
          viewSlideOf[v.key] = vs;
          out.push(vs);
        };
        if (byKey.__general) emitView(byKey.__general, "");
        // (an older ui.js gives no groups: the grid first, in its order, then the places)
        if (groups.length <= 1) for (const v of views) emitView(v, "");
        let throneAt = -1;
        for (const g of groups) {
          const gv = views.filter((v) => home[v.key] === g && v.key !== "__general");
          const groupCam = gv.length ? gv[0].key : null;
          for (const v of gv) if (opens[v.key]) emitView(v, g);
          for (const p of places) {
            if ((p.group || "") !== g) continue;
            const k = camKey(p), vk = viewKeyOf(k), v = vk && !isExtras(g) && home[vk] === g ? byKey[vk] : null;
            let fold = false;
            if (v) {
              for (const w of gv) {
                emitView(w, g);
                if (w === v) break;
              }
              fold = vk === k && ((p.item && p.item.key === k) || !p.info || p.info === (U.info && U.info[k]));
            }
            if (!fold) out.push(placeSlide(p, groupCam));
            else if (v && viewSlideOf[v.key]) {
              const vs = viewSlideOf[v.key];
              if (!vs.act) vs.act = placeAct(p);
              if (!vs.pf) vs.pf = placeOwnFeat(p);
            }
            if (k === "mechonaClose" && !isExtras(g) && !done.__base) {
              done.__base = true;
              for (const s of baseSlides(g)) out.push(s);
            }
            if (k === "throne" || k === "throneSteps") { if (!isExtras(g)) throneAt = out.length; }
          }
          for (const v of gv) emitView(v, g);
        }
        for (const v of views) emitView(v, "");   // (no places, or a view of no group: in the grid's order)
        // the throne's versions after its own places (else after the palace's overview, else at the end of the places)
        if (throneAt < 0) {
          for (let i = out.length - 1; i >= 0; i--) if (out[i].key === "palace") { throneAt = i + 1; break; }
        }
        const ts = throneSlides(throneAt >= 0 ? out[throneAt - 1].group : "");
        if (ts.length) out.splice(throneAt >= 0 ? throneAt : out.length, 0, ...ts);
        for (const row of rowsOf()) {
          if (ts.length && isThroneRow(row)) continue;   // its readings are the version slides above
          // 1.3.5 / 1.9.3 (the full scan: a row that stands by default on a reading that is not its first - its first reading had no
          // slide, and the row was left on it after its slides): the reading the row stands on is the one gone back to, and every other
          // reading has its slide
          const def = row.cur != null && row.options.some((o) => o[0] === row.cur) ? row.cur : row.options[0][0];
          for (const [key, label, info, infoRefs] of row.options.filter((o) => o[0] !== def)) {
            out.push({ kind: "opinion", part: 1, row, key, def, title: label, sub: row.cap, text: info || "", refs: infoRefs || row.refs || [],
              out: tour_OUT });
          }
        }
        return out;
      };
      const verseSlides = () => tour_KINGS.filter((d) => !d.kelim || ctx.shared.kelim).map((d) => {
        const verses = [];
        let letters = 0;
        // (a completion slide, d.compl: no verse of its own; the slide says on which verses it stands)
        if (!d.compl) {
          for (let v = d.v[1]; v <= d.v[2]; v++) {
            const t = tour_VERSES[d.v[0] + ":" + v] || "";
            verses.push([v, t]);
            letters += t.replace(/[^א-ת]/g, "").length;
          }
        }
        const refs = d.compl ? [] : [["מלכים א " + vRange(d.v), tour_ref(["V", 10, d.v[0], d.v[1]])]];
        for (const [label, sp] of d.r || []) {
          const ref = tour_ref(sp);
          if (ref && !refs.some((x) => x[0] === label)) refs.push([label, ref]);
        }
        if (d.kelim) for (const r of linkRefs(ctx.shared.kelim.refs)) refs.push(r);
        return { kind: "verse", part: 2, d, ch: d.v[0], title: d.t, sub: (d.compl ? "השלמה — על מלכים א " : "מלכים א ") + vRange(d.v), text: d.kelim ? ctx.shared.kelim.info : d.x, xf: d.xf || "", refs: refs.filter((x) => x[1]),
          go: d.go || [], lay: d.lay || null, out: d.out || tour_OUT, nofly: !!d.nofly, then: d.then ? [].concat(d.then) : null, verses, letters, bubble: !!d.bubble };
      });
      // ---- the DOM ----
      const mk = (tag, cls, txt, parent) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (txt != null) e.textContent = txt;
        if (parent) parent.appendChild(e);
        return e;
      };
      const tip = (el, text) => {
        el.title = text;
        if (fnc(el.setAttribute)) el.setAttribute("data-tip", text);   // for the UI's custom tooltips (K.9a), when it reads them
        if (fnc(U.tip)) call(U.tip, el, text);
        else if (fnc(U.tooltip)) call(U.tooltip, el, text);
      };
      // 1.1.0: the button goes into the top bar (70-ui.js ctx.ui.topbarAdd: order 10 = first), the menu under the bar's button row
      const btn = mk("button", null, "▶ מצגת", null);
      btn.id = "tm-tour-btn";
      btn.type = "button";
      if (fnc(U.topbarAdd)) call(U.topbarAdd, btn, 10, "play", "מצגת");
      else document.body.appendChild(btn);
      tip(btn, "מצגת: בחירה בין מצגת לפי הנושאים, מצגת רציפה, או מצגת לפי סדר הפסוקים במלכים");
      const menu = mk("div", null, null, btn.parentNode && btn.parentNode.id === "tm-topbtns" ? btn.parentNode : document.body);
      menu.id = "tm-tour-menu";
      mk("div", "mh", "מצגת — בחר את סוג המצגת:", menu);
      for (const M of tour_MODES) {
        const b = mk("button", null, null, menu);
        b.type = "button";
        mk("b", null, M.label, b);
        mk("span", null, M.desc, b);   // (no tooltip: the item already shows its description)
        b.addEventListener("click", () => {
          if (!confirmOpen()) start(M.key);
        });
      }
      const box = mk("div", null, null, document.body);
      box.id = "tm-tour-box";
      const hd = mk("div", "hd", null, box);
      const elPart = mk("span", "part", "", hd), elNum = mk("span", "num", "", hd);
      const elTtl = mk("div", "ttl", "", box), elSub = mk("div", "sub", "", box), elWait = mk("div", "wait", "", box);
      const body = mk("div", "body", null, box);
      // 1.0.1-L: elCaps = the captions of a timeline (the king's ascent, the witnesses), added one by one at their times
      const elVs = mk("div", "vs", null, body), elTxt = mk("div", "txt", "", body), elCaps = mk("div", "caps", null, body), elSrc = mk("div", "src", "", body);
      // 1.0.1-L (L.80): the bubble on the throne slides - in the banner under the scrolling text, always seen (on a phone it scrolls with the text:
      // placeBubble): the marker "לכאורה", the USER'S inference, the Ben Yehoyada's own words and their links
      const bubW = mk("div", "bubw", null, box);
      const elBub = mk("div", "bub", null, bubW);
      elBub.setAttribute("role", "note");
      {
        mk("div", "bq", tour_BUBBLE.quote, elBub);   // his words first, the inference apart from them
        const bt = mk("div", "bt", null, elBub);
        mk("span", "m", tour_BUBBLE.mark, bt);
        bt.appendChild(document.createTextNode(tour_BUBBLE.inference));
        if (fnc(U.refLinks)) call(U.refLinks, mk("div", "br", null, elBub), tour_BUBBLE.refs.map(([l, sp]) => [l, tour_ref(sp)]).filter((x) => x[1]));
      }
      const progEl = mk("div", "prog", null, box);
      const bar = mk("div", "bar", null, progEl);
      const ctl = mk("div", "ctl", null, box);
      const bPrev = mk("button", "prev", "→ הקודם", ctl), bPause = mk("button", "pause", "⏸ השהה", ctl);
      const bNext = mk("button", "next", "הבא ←", ctl), bStop = mk("button", "stop", "✕ סיום", ctl);
      for (const b of [bPrev, bPause, bNext, bStop]) b.type = "button";
      tip(bPrev, "לשקופית הקודמת");
      tip(bPause, "השהיית המצגת או המשכתה");
      tip(bNext, "לשקופית הבאה");
      tip(bStop, "סיום המצגת: הקריאות, השכבות והמתגים חוזרים למה שהיו לפניה (Esc)");
      const ctl2 = mk("div", "ctl2", null, box);
      // 1.0.1-K review (tour-7): the speed's label (.spd, its word "קצב" in a span) moves into the controls row on a phone (placeSpeed)
      const spdLab = mk("label", "spd", null, ctl2);
      mk("span", "k", "קצב", spdLab);
      const spd = mk("select", null, null, spdLab);
      const SPEEDS = [["איטי", 1.5], ["רגיל", 1], ["מהיר", 0.6]];
      for (const [lab, k] of SPEEDS) {
        const o = mk("option", null, lab, spd);
        o.value = String(k);
      }
      tip(spdLab, "קצב המצגת: זמן ההצגה של כל שקופית");
      mk("span", "esc", "Esc — סיום", ctl2);
      // a mouse click does not leave the focus on the tour's buttons (Enter / Space then cannot act on them behind the cloud dialog)
      for (const b of [btn, bPrev, bPause, bNext, bStop]) b.addEventListener("mousedown", (e) => e.preventDefault());
      // ---- the state ----
      let mode = tour_MODES[0], slides = [], idx = -1, running = false, paused = false, ended = false, round = 1;
      let elapsed = 0, total = 1, lastT = 0, idleUntil = 0, cfSeenAt = -1e9, progAt = 0, waitTxt = "", menuOpen = false, orbitSide = 1;
      let cur = null, saved = null;
      // 1.0.1-L: the cloud dialog was answered "ביטול" in this run: the next devir slides do not ask again, they use their views from outside
      let cloudDenied = false;
      // 1.0.1-K review (tour-6): the pointers that are down now (pointerId; pressed on the model, the nav row, the pills or the panel - not
      // on the tour's own elements or the dialog): the continuous mode holds while any is down and 8 s after the last is lifted
      const downPtrs = new Set();
      // the speed the user chose ("קצב", remembered in localStorage) and the speed of the running tour (start(mode, {speed}) may override it
      // for that run only: tests)
      let userSpeed = 1;
      try {
        const k = parseFloat(localStorage.getItem("tm-tour-speed"));
        if (SPEEDS.some((s) => s[1] === k)) userSpeed = k;
      } catch (_) {
      }
      let speed = userSpeed;
      spd.value = String(userSpeed);
      const slideMs = (s) => {
        // 1.0.1-L: a slide with a timeline dwells for it, in every mode (the speed scales the timeline too: animStep)
        const a = cur && cur.s === s ? cur.anim : null;
        if (a) return (tour_ANIM_LEAD + a.whole + tour_ANIM_TAIL) * 1000 * speed;
        if (mode.key === "continuous") return tour_DWELL * speed;
        // (1.0.1-L: with the sentence the slide adds while its feature is on: 7:30-33 then lasts for most of the demonstration's round)
        const n = (s.text || "").length + (cur && cur.s === s && cur.feat && s.xf ? s.xf.length + 1 : 0);
        if (s.kind === "verse" || s.letters) return Math.max(10000, Math.min(60000, 3000 + 55 * n + 70 * (s.letters || 0))) * speed;
        return Math.max(9000, Math.min(45000, 2500 + 55 * n)) * speed;
      };
      const setBtn = () => {
        if (fnc(U.setTopBtn)) call(U.setTopBtn, btn, running ? "stop" : "play", running ? "עצור" : "מצגת");
        else btn.textContent = running ? "■ עצור" : "▶ מצגת";
        btn.classList.toggle("on", running);
        tip(btn, running ? "עצירת המצגת (Esc)" : "מצגת: בחירה בין מצגת לפי הנושאים, מצגת רציפה, או מצגת לפי סדר הפסוקים במלכים");
      };
      const openMenu = (on) => {
        menuOpen = !!on;
        menu.style.display = menuOpen ? "flex" : "none";
        btn.classList.toggle("open", menuOpen);
      };
      const setPaused = (p) => {
        paused = !!p;
        if (!paused) idleUntil = 0;
        bPause.textContent = paused ? "▶ המשך" : "⏸ השהה";
        showWait();
      };
      const showWait = () => {
        let t = "";
        if (running) {
          if (confirmOpen()) t = "ממתין לתשובה בחלון קודש הקדשים…";
          else if (paused) t = "המצגת מושהית.";
          else if (mode.key === "continuous" && idleUntil > now()) t = "המצגת ממשיכה מעצמה בעוד " + Math.max(1, Math.ceil((idleUntil - now()) / 1000)) + " שניות.";
          else if (cur && cur.outside) t = "קודש הקדשים מכוסה בענן — המבט מחוצה לו.";
        }
        if (t === waitTxt) return;
        waitTxt = t;
        elWait.textContent = t;
        elWait.style.display = t ? "block" : "none";
        if (cur && cur.anim && cur.anim.last) showCaption(cur.anim, cur.anim.last);   // 1.0.1-L: (the notice line takes the text's height: the caption stays in view)
      };
      // the banner stays above the compass and the nav row at the bottom left (#tm-compass, #tm-nav of 70-ui.js), whatever their height
      // (on a phone the nav row wraps to two lines): bottom = max(76 / 66 by CSS, their top + 8); on a phone the sheet's height is then
      // capped so that it never reaches the centre of the view. Measured on every slide, on resize and once a second while running.
      const fitBox = () => {
        const H = window.innerHeight || 0;
        let top = Infinity;
        for (const id of ["tm-nav", "tm-compass"]) {
          const e = document.getElementById(id);
          const r = e && fnc(e.getBoundingClientRect) ? e.getBoundingClientRect() : null;
          if (r && r.height > 0 && r.top > H / 2 && r.top < top) top = r.top;   // (only a row at the bottom counts)
        }
        let need = isFinite(top) ? Math.ceil(H - top + 8) : 0;
        if (document.body && document.body.classList && document.body.classList.contains("tm-measuring")) need = Math.max(need, 96);   // UX3
        box.style.bottom = need > (narrow() ? 66 : 76) ? need + "px" : "";
        box.style.maxHeight = narrow() && need > 66 ? Math.max(120, Math.floor(Math.min(0.4 * H, H / 2 - need - 4))) + "px" : "";
        placeSpeed();
        placeBubble();
        viewShift();
      };
      // 1.0.1-L (L.93): the panel is closed, and the banner stands on the left: the view's centre moves to the middle of the free space, so that what a slide looks at stands
      // beside the banner. A lens shift (setViewOffset): no camera, target or ray changes, the pills and the labels follow it. Measured with fitBox; if the viewer reopens the
      // panel, the middle between the two. On a phone, where the banner is a bottom sheet, the shift is upward
      let shiftKey = "";
      const viewShift = () => {
        const c = ctx.camera;
        if (!c || !fnc(c.setViewOffset) || !fnc(c.clearViewOffset)) return;
        const W = window.innerWidth || 0, H = window.innerHeight || 0;
        let dx = 0, dy = 0;
        if (running && W > 0 && H > 0 && fnc(box.getBoundingClientRect)) {
          const r = box.getBoundingClientRect();
          if (narrow()) {
            // 1.0.1-L: on a phone the sheet covers the lower half, and the view's centre fell on its edge (the throne's steps, the ascent itself, behind it): the centre goes up to the middle of the space above the sheet (in steps of 24 px, so that a slide's text of another length does not move the view)
            if (r && r.height > 0 && r.top > 0) dy = Math.round(Math.max(0, Math.min(0.3 * H, (H - r.top - 48) / 2)) / 24) * 24;
          } else {
            const p = panelOpen() && fnc(U.panel.getBoundingClientRect) ? U.panel.getBoundingClientRect() : null;
            if (r && r.width > 0) dx = Math.round((r.right + (p && p.width > 0 ? p.left : W) - W) / 2);
          }
        }
        const k = dx || dy ? W + "x" + H + ":" + dx + ":" + dy : "";
        if (k === shiftKey) return;
        shiftKey = k;
        if (dx || dy) c.setViewOffset(W, H, -dx, dy, W, H);
        else c.clearViewOffset();
      };
      // 1.0.1-L (L.80): the bubble's place: a strip of its own under the text; on a phone (the sheet is low) at the end of the scrolling text
      const placeBubble = () => {
        const home = narrow() ? body : box;
        if (bubW.parentNode === home) return;
        if (home === box && fnc(box.insertBefore)) box.insertBefore(bubW, progEl);
        else home.appendChild(bubW);
      };
      // 1.0.1-K review (tour-7): on a phone the speed choice sits at the end of the controls row (the row under it is not shown there, for
      // the text's height); on a wider window it goes back before the "Esc" hint. Moved only when the side changes
      const placeSpeed = () => {
        const home = narrow() ? ctl : ctl2;
        if (spdLab.parentNode === home) return;
        if (home === ctl2 && fnc(ctl2.insertBefore)) ctl2.insertBefore(spdLab, ctl2.firstChild);
        else home.appendChild(spdLab);
      };
      window.addEventListener("resize", () => {
        if (box.style.display !== "none") fitBox();
      });
      let fitAt = 0;
      const partLabel = (s) => {
        if (mode.key === "continuous") return "מצגת רציפה · סבב " + round;
        if (s.kind === "verse") return "לפי סדר הפסוקים · מלכים א " + tour_heb(s.ch);
        return "לפי הנושאים · " + (s.part ? "שיטות נוספות" : s.group || "מבטים");   // 1.0.1-L: the panel's group
      };
      const renderVerses = (list) => {
        elVs.textContent = "";
        for (const [v, txt] of list || []) {
          const p = mk("div", "v", null, elVs);
          mk("span", "vn", tour_heb(v), p);
          // ketiv "(...)" small and grey, qere "[...]" in the text, as printed in Otzaria
          for (const part of String(txt).split(/(\([^)]*\)|\[[^\]]*\])/)) {
            if (!part) continue;
            if (part[0] === "(") tip(mk("span", "kt", part, p), "כתיב");
            else if (part[0] === "[") tip(mk("span", "qr", part.slice(1, -1), p), "קרי");
            else p.appendChild(document.createTextNode(part));
          }
        }
      };
      // 1.0.1-L (L.89, "כל הסוגריים של מקורות תקטין יותר"): the helper of 70-ui.js: a source in parentheses, outside a quote, in a smaller font; the letters do not change
      const fillSrc = (el, text) => {
        const h = fnc(U.smallSources) ? call(U.smallSources, text) : null;
        if (typeof h === "string") el.innerHTML = h;
        else el.textContent = text;
      };
      const slideText = (s, rt) => s.text + (rt && rt.feat && s.xf ? (s.text ? " " : "") + s.xf : "");
      const render = (s, rt) => {
        elPart.textContent = partLabel(s);
        elNum.textContent = (idx + 1) + " / " + slides.length;
        fillSrc(elTtl, s.title);
        elSub.textContent = s.sub || "";
        elSub.style.display = s.sub ? "" : "none";
        renderVerses(s.verses && s.verses.length ? s.verses : null);
        fillSrc(elTxt, slideText(s, rt));
        elCaps.textContent = "";
        bubW.classList.toggle("on", !!s.bubble);
        elSrc.textContent = "";
        if (s.refs && s.refs.length && fnc(U.refLinks)) {
          elSrc.appendChild(document.createTextNode("מקורות: "));
          call(U.refLinks, elSrc, s.refs);
        }
        bPrev.disabled = idx <= 0 && mode.key !== "continuous";
        bNext.disabled = false;
        bNext.textContent = idx === slides.length - 1 && mode.key !== "continuous" ? "לסיכום ←" : "הבא ←";
        bPause.textContent = paused ? "▶ המשך" : "⏸ השהה";
        bStop.textContent = "✕ סיום";
        bar.style.width = "0%";
        body.scrollTop = 0;
        showWait();
        fitBox();
      };
      // ---- entering and leaving a slide ----
      const leave = () => {
        const rt = cur;
        cur = null;
        if (!rt) return;
        for (let k = rt.undo.length - 1; k >= 0; k--) {
          try {
            rt.undo[k]();
          } catch (_) {
          }
        }
      };
      const flyRes = (res, dur) => {
        const before = snapOpen();
        fly(res.cam.pos, res.cam.target, dur);
        keepClosed(before);
      };
      // 1.0.1-L (L.81): a version of the throne for this slide (through its row of the opinions table when it is there, so the panel shows it);
      // it goes back when the slide is left
      const versionFor = (rt, key) => {
        const tv = ctx.shared.throneVersion;
        if (!tv || !fnc(tv.set) || tv.current === key) return;
        const row = throneRow(), was = tv.current;
        rt.lv = layerVis();   // (tour-5: a row's onPick may switch the palace layer)
        rt.undo.push(() => {
          for (const [n, v] of rt.lv) if (layerOn(n) !== v) setLayer(n, v);
        });
        if (row) setRow(row, key);
        else call(tv.set, key);
        rt.undo.push(() => {
          if (row) setRow(row, was);
          else call(tv.set, was);
        });
        rt.lv = rt.lv.filter(([n, v]) => layerOn(n) !== v);
      };
      // 1.0.1-L (L.78-L.81): starts the slide's timeline. The tour drives it (animStep: seek per frame), so its clock is the slide's: frozen while the
      // tour is paused, held or hidden, scaled by the speed. Null-safe: no API or no script for this version = a plain slide
      const beginAnim = (rt) => {
        const s = rt.s, th = ctx.shared.throne;
        if (!s.anim || !th) return;
        const wit = s.anim === "witnesses", api = wit ? th.witnesses : th.ascent, scr = wit ? th.witnessScript : th.script;
        const caps = scr && scr[s.ver];
        if (!api || !fnc(api.start)) return;
        let ok = false;
        try {
          ok = wit ? api.start() : api.start(s.ver);
        } catch (_) {
        }
        if (!ok) return;
        const dur = typeof api.duration === "number" && api.duration > 0 ? api.duration : 0;
        rt.anim = { api, dur, whole: dur, base: 0, next: null, caps: Array.isArray(caps) ? caps : [], i: 0, last: null, done: false, scrolled: false };
        // 1.0.1-L (A31): the witnesses follow on the same slide, after a moment for the camera (animStep)
        if (s.animW && th.witnesses && fnc(th.witnesses.start)) {
          const w = th.witnesses, wc = th.witnessScript && th.witnessScript[s.ver], wd = typeof w.duration === "number" && w.duration > 0 ? w.duration : 0;
          if (wd > 0) {
            rt.anim.next = { api: w, dur: wd, caps: Array.isArray(wc) ? wc : [] };
            rt.anim.whole += tour_ANIM_LEAD + wd;
            rt.undo.push(() => {
              try {
                if (fnc(w.reset)) w.reset();
              } catch (_) {
              }
            });
          }
        }
        rt.undo.push(() => {
          try {
            if (fnc(api.reset)) api.reset();
          } catch (_) {
          }
        });
        total = slideMs(s);
      };
      // the newest caption stays in view, unless the reader scrolled the text himself
      const showCaption = (a, e) => {
        const top = e.offsetTop, h = e.offsetHeight, ch = body.clientHeight;
        if (!a.scrolled && ch > 0 && isFinite(top + h)) body.scrollTop = Math.max(0, top + h - ch + 8);
      };
      const addCaption = (a, c) => {
        if (a.last) a.last.classList.remove("now");
        const e = mk("div", "cap now", null, elCaps);
        fillSrc(e, c.text);   // (L.89: the bracket after the midrash's quote; the helper leaves the quote's own words)
        a.last = e;
        showCaption(a, e);
      };
      // per frame, also while held (the same moment again: the timeline stays frozen); no allocation but the caption's element when one appears
      const animStep = (rt) => {
        const a = rt.anim;
        if (!a || a.done) return;
        const at = elapsed / (1000 * speed) - tour_ANIM_LEAD - a.base, sec = at > 0 ? at : 0;   // (at < 0: the camera is still on its way)
        while (a.i < a.caps.length && a.caps[a.i].t <= at) addCaption(a, a.caps[a.i++]);
        if (sec >= a.dur) {
          try {
            if (fnc(a.api.reset)) a.api.reset();
          } catch (_) {
          }
          // 1.0.1-L (A31): from the ascent to the witnesses on the same slide: their lead as a caption, the throne's view, their timeline after the same lead time
          const n = a.next;
          if (n) {
            a.next = null;
            a.base += tour_ANIM_LEAD + a.dur;
            a.api = n.api;
            a.dur = n.dur;
            a.caps = n.caps;
            a.i = 0;
            addCaption(a, { text: tour_THRONE.leadW });
            let ok = false;
            try {
              ok = n.api.start();
            } catch (_) {
            }
            if (ok) {
              const r2 = pick(rt.s.goW);
              if (r2) flyRes(r2);
              return;
            }
          }
          a.done = true;   // everything returns to rest; the last caption stays until the slide ends
          return;
        }
        try {
          if (fnc(a.api.seek)) a.api.seek(sec);
        } catch (_) {
        }
      };
      // returns false when the slide is skipped (the continuous mode, the devir under the cloud); its switches are then undone by leave()
      const enter = () => {
        const s = slides[idx];
        const rt = { s, undo: [], feat: false, devirNav: false, asked: false, orbit: null, thenI: 0, lv: null, anim: null, outside: false, act: false, actOnly: false };
        cur = rt;
        // 1.3.5 / 1.9.3: what this slide's place or reading opens for a while (a roof, a section) stays until the slide is left
        call(ctx.shared.holdAuto, true);
        rt.undo.push(() => {
          call(ctx.shared.holdAuto, false);
          call(ctx.shared.closeAuto);
        });
        if (s.kind === "opinion") {
          // 1.0.1-K review (tour-5): a reading's own calls may switch a layer that is not its own - the forest house's onPick and fly
          // turn the palace layer on, and so does its undo, onPick(def) (70-ui.js): the layers are recorded first, and those that the
          // slide's own calls changed (rt.lv, narrowed after the row's fly below) are put back after the row's undo (pushed first, so it
          // runs last). In "רציפה" the palace stayed on from the second round. A feature's own group is not among them (OWNED)
          rt.lv = layerVis();
          rt.undo.push(() => {
            for (const [n, v] of rt.lv) if (layerOn(n) !== v) setLayer(n, v);
          });
          // 1.3.5 / 1.9.3: a reading may move another row with it (the names of the north gates show the thirteen gates) - the other rows
          // go back after this row's own way back (pushed first, so it runs after it)
          const rows0 = rowsOf().filter((r) => r !== s.row).map((r) => [r, r.cur]);
          rt.undo.push(() => {
            for (const [r, k] of rows0) if (r.cur !== k) setRow(r, k);
          });
          setRow(s.row, s.key);
          rt.undo.push(() => setRow(s.row, s.def));
        }
        if (s.ver) versionFor(rt, s.ver);   // 1.0.1-L: before the camera is chosen (a version may re-aim the throne's fly points)
        if (s.lay) layerNeed(rt, s.lay);
        let res = null;
        if (s.kind !== "opinion" && !s.nofly) {
          res = pick(s.go) || pick([{ fp: "__general" }]);   // a missing target: the general view, never an error
          if (res) {
            rt.devirNav = inDevir(res.cam.pos) || inDevir(res.cam.target);
            if (mode.key === "continuous" && rt.devirNav && cloudOn()) return false;
            // 1.0.1-L: after a "ביטול" in this run no second dialog: the slide's view from outside the devir
            if (rt.devirNav && cloudDenied && cloudOn()) {
              const r2 = pick(s.out);
              if (r2) {
                res = r2;
                rt.devirNav = false;
                rt.outside = true;
              }
            }
            if (res.c.f === "mechonaExplode") parkBase(rt);   // 1.0.1-K review (vessels-2 / tour-4): taken apart in its place
            if (res.c.f) rt.feat = featureOn(rt, res.c.f);
            if (rt.feat && s.xf) total = slideMs(s);
            if (res.c.lay) layerNeed(rt, res.c.lay);
            if (res.cam.layer) layerNeed(rt, res.cam.layer);
          }
        }
        render(s, rt);
        // 1.0.1-L (L.34): the UI's info box became the floating card, which stays closed while the tour runs: its text is the banner's own
        if (!U.card) {
          if (s.kind === "view") setInfo(s.key);
          else setInfo("__place", { text: elTxt.textContent, refs: s.refs || [] });
        }
        if (s.kind === "opinion") {
          const before = snapOpen();
          if (fnc(s.row.fly)) call(s.row.fly, s.key);
          keepClosed(before);
          rt.lv = rt.lv.filter(([n, v]) => layerOn(n) !== v);   // (tour-5) only the layers this slide's own calls changed
          if (confirmOpen()) {
            rt.devirNav = true;
            if (mode.key === "continuous") {
              cancelConfirm();
              return false;
            }
            if (cloudDenied) {   // 1.0.1-L: no second dialog in this run
              cancelConfirm();
              rt.devirNav = false;
              rt.outside = true;
              const r2 = pick(s.out);
              if (r2) flyRes(r2);
            }
          }
        } else {
          runPlace(rt, s, res);   // 1.3.5 / 1.9.3: the place's own feature and action, as its button (before its flight, as there)
          if (res && !rt.actOnly) flyRes(res);
        }
        if (s.anim) beginAnim(rt);
        if (mode.key === "continuous" && !rt.devirNav && !s.nofly && !rt.actOnly) {
          rt.orbit = { start: 1800, amp: tour_ORBIT * orbitSide, applied: 0, begun: false, dead: false };
          orbitSide = -orbitSide;
        }
        return true;
      };
      // the slide's further cameras (8:1-5: from the south up to the house; 1.0.1-L: a list, each at its part of the slide)
      const thenStep = (rt) => {
        const th = rt.s.then;
        if (!th || rt.thenI >= th.length || elapsed < total * th[rt.thenI].at) return;
        const t = th[rt.thenI++];
        const r2 = pick(t.go);
        if (!r2) return;
        // 1.0.1-L (L.88): a stop may switch its feature on, for the rest of the slide; the slide's added sentence comes with it
        if (r2.c.f && !rt.feat && featureOn(rt, r2.c.f)) {
          rt.feat = true;
          if (rt.s.xf) {
            fillSrc(elTxt, slideText(rt.s, rt));
            const t1 = slideMs(rt.s);
            if (t1 > total) total = t1;
          }
        }
        flyRes(r2, t.dur);
      };
      // the continuous mode's orbit: eased from 0 to +-12 degrees about the vertical through the target, over the rest of the slide
      const orbitStep = (rt) => {
        const o = rt.orbit;
        if (!o || o.dead || elapsed < o.start) return;
        const cam = ctx.camera, oc = ctx.controls;
        if (!cam || !oc || !oc.target) {
          o.dead = true;
          return;
        }
        const p = cam.position, tg = oc.target;
        if (!o.begun) {
          if (!outdoors([p.x, p.y, p.z], [tg.x, tg.y, tg.z])) {
            o.dead = true;
            return;
          }
          o.begun = true;
        }
        const k = Math.min(1, (elapsed - o.start) / Math.max(1, total - o.start));
        const th = o.amp * (1 - Math.cos(Math.PI * k)) / 2, d = th - o.applied;
        if (Math.abs(d) < 1e-7) return;
        o.applied = th;
        const ox = p.x - tg.x, oz = p.z - tg.z, c = Math.cos(d), sn = Math.sin(d);
        p.x = tg.x + ox * c + oz * sn;
        p.z = tg.z - ox * sn + oz * c;
        cam.lookAt(tg);
      };
      const go = (i, dir) => {
        dir = dir < 0 ? -1 : 1;
        cancelConfirm();   // a pending dialog of the slide that is left: its fly must not land on the next slide
        // 1.0.1-K review (tour-2): the card of a clicked label (70-ui.js, K.9b) is closed on every slide change, as the UI's views and
        // places do - in "רציפה" the tour moves on by itself and the card stayed over the next views with the old label's text
        call(U.closeCard);
        closeXCard();
        leave();
        const N = slides.length;
        let wrapped = false;
        for (let k = 0; k < N; k++) {
          let j = i + k * dir;
          if (mode.key === "continuous") {
            if (j >= N && !wrapped) {
              round++;   // the loop starts again
              wrapped = true;
            }
            j = ((j % N) + N) % N;
          } else if (j < 0 || j >= N) break;
          idx = j;
          elapsed = 0;
          total = slideMs(slides[j]);
          if (enter()) return true;
          leave();   // skipped: undo what it switched on
        }
        return false;
      };
      // ---- the pre-tour state, restored at the end ----
      // 1.0.1-K review (tour-1 / cross-2 / interior-2): the layers but for a feature's own groups (OWNED), and the features themselves
      // (OWN_FEAT, null = not in the model) with the parts' labels of the base taken apart
      const snapshot = () => ({
        rows: rowsOf().map((r) => [r, r.cur]),
        layers: layerVis(),
        feats: OWN_FEAT.map((k) => [k, featState(k)]),
        parts: layerOn("mechonaParts"),
        ver: ctx.shared.throneVersion ? ctx.shared.throneVersion.current : null,   // 1.0.1-L: (also when the panel has no row for it)
        auto: false,
        panel: false
      });
      const restore = () => {
        const sv = saved;
        saved = null;
        if (!sv) return;
        for (const [row, key] of sv.rows) setRow(row, key);
        const tvr = ctx.shared.throneVersion;
        if (sv.ver && tvr && tvr.current !== sv.ver && fnc(tvr.set)) call(tvr.set, sv.ver);
        for (const [n, vis] of sv.layers) if (ctx.layers[n] && layerOn(n) !== vis) setLayer(n, vis);
        // 1.0.1-K review (tour-1 / cross-2 / interior-2): a feature the user switched during the tour (its pill, "↺ החזר הכל") goes back
        // as it was before the tour through its own set(), which moves its meshes, its "on" and its group together - the raw restore of
        // the group left the measures, the layers' labels or the parts' labels without their feature (or over the closed model)
        for (const [k, on] of sv.feats) {
          if (on === null || featState(k) === on) continue;
          try {
            featureOf(k).set(on);
          } catch (_) {
          }
        }
        // 1.3.6 / 1.9.4: the viewing tools that were on before the presentation come back (toolsOff)
        for (const f of sv.tools || []) {
          try {
            f();
          } catch (_) {
          }
        }
        // the parts' labels go with the base taken apart: as before the tour while it is apart
        const parts = sv.parts && featState("mechonaExplode") === true;
        if (ctx.layers.mechonaParts && layerOn("mechonaParts") !== parts) setLayer("mechonaParts", parts);
        // tour-8: on again only if it was on before the tour and nobody switched it back on meanwhile
        if (sv.auto) {
          const ar = autoRot();
          if (ar) {
            if (!call(ar.get)) call(ar.set, true);
          } else if (ctx.controls && !ctx.controls.autoRotate) ctx.controls.autoRotate = true;
        }
        // 1.0.1-L (L.93): the panel as it was before the presentation, whatever the viewer did with the burger meanwhile
        if (U.panel && U.burger && fnc(U.burger.click) && panelOpen() !== sv.panel) U.burger.click();
      };
      // 1.0.1-K review (tour-7): the same rule as the CSS (tour_PHONE_MQ), one MediaQueryList made once
      let phoneMQ = null;
      try {
        if (fnc(window.matchMedia)) phoneMQ = window.matchMedia(tour_PHONE_MQ);
      } catch (_) {
      }
      const narrow = () => (phoneMQ && typeof phoneMQ.matches === "boolean" ? phoneMQ.matches : (window.innerWidth || 1024) < 640);
      const panelOpen = () => !!(U.panel && U.panel.style.display !== "none");
      const start = (key, opts) => {
        if (confirmOpen()) return false;
        if (running) finish(true);
        const M = tour_MODES.find((m) => m.key === key) || tour_MODES[typeof key === "number" ? key : 0] || tour_MODES[0];
        mode = M;
        speed = opts && opts.speed > 0 ? opts.speed : userSpeed;
        slides = M.key === "verses" ? verseSlides() : topicSlides();
        openMenu(false);
        if (!slides.length) return false;
        // 1.0.1-L (L.34 / L.27): the explanation card closes and stays closed; a place's 15-second timer no longer runs - a slide's feature is the
        // tour's alone, and what such a timer would have switched off goes back now (before the snapshot, so the end does not bring it back)
        closeXCard();
        if (U.autoOff) {
          call(U.autoOff.flush);
          call(U.autoOff.cancel);
        }
        if (fnc(ctx.shared.closeAuto)) call(ctx.shared.closeAuto);   // (1.9.4: what a place or a row opened for a while, the Second Temple's timers)
        const tools = toolsOff();   // 1.3.6 / 1.9.4: before the snapshot, so that the features among them are "off" in it
        saved = snapshot();
        saved.tools = tools;
        cloudDenied = false;
        for (const [r] of saved.rows) setRow(r, r.options[0][0]);   // the model in its default readings (Rashi first)
        {
          const tvs = ctx.shared.throneVersion;   // (L.81: the throne too, also when the panel has no row for it)
          if (tvs && Array.isArray(tvs.keys) && tvs.keys.length && tvs.current !== tvs.keys[0] && fnc(tvs.set)) call(tvs.set, tvs.keys[0]);
        }
        // the tour moves the camera itself: "סיבוב איטי" off while it runs (1.0.1-K review tour-8: through the UI's checkbox when it can)
        const ar = autoRot();
        if (ar ? !!call(ar.get) : !!(ctx.controls && ctx.controls.autoRotate)) {
          if (ar) call(ar.set, false);
          else ctx.controls.autoRotate = false;
          saved.auto = true;
        }
        // 1.0.1-L (L.93, the user: "אני רוצה שבזמן הצפיה התפריט מצד ימין יסגר לצד לגמרי כדי לתת מרחב יותר לתצוגה"): in every mode, as the burger closes it; the burger stays
        saved.panel = panelOpen();
        if (saved.panel && U.burger && fnc(U.burger.click)) U.burger.click();
        running = true;
        ended = false;
        paused = false;
        idleUntil = 0;
        downPtrs.clear();
        round = 1;
        orbitSide = 1;
        roofList = null;
        cfSeenAt = -1e9;
        box.style.display = "flex";
        setBtn();
        idx = -1;
        go(0, 1);   // (closes the label's card: tour-2)
        return true;
      };
      // 1.0.1-K review (tour-3): the hidden banner keeps no focus (a focused speed <select> would go on taking the arrow keys)
      const hideBox = () => {
        const ae = document.activeElement;
        if (ae && inside(ae, box) && fnc(ae.blur)) ae.blur();
        box.style.display = "none";
      };
      const showEnd = () => {
        elPart.textContent = mode.key === "verses" ? "לפי סדר הפסוקים" : "לפי הנושאים";
        elNum.textContent = "";
        elTtl.textContent = "סוף המצגת";
        elSub.style.display = "none";
        elVs.textContent = "";
        elTxt.textContent = "השיטות, השכבות והמתגים שהיו לפני המצגת הוחזרו, וחזרנו למבט הכללי. אפשר להמשיך לבד בלוח הבקרה, או להתחיל שוב.";
        elCaps.textContent = "";
        bubW.classList.remove("on");
        elSrc.textContent = "";
        waitTxt = "";
        elWait.style.display = "none";
        bPrev.disabled = true;
        bPause.textContent = "▶ התחל שוב";
        bNext.textContent = "—";
        bNext.disabled = true;
        bStop.textContent = "✕ סגור";
        bar.style.width = "100%";
      };
      const finish = (close) => {
        if (!running) {
          if (close) hideBox();
          return;
        }
        cancelConfirm();
        call(U.closeCard);   // 1.0.1-K review (tour-2): the label's card does not outlive the tour either
        leave();
        restore();
        running = false;
        viewShift();   // 1.0.1-L (L.93): the lens back to the centre
        paused = false;
        idleUntil = 0;
        downPtrs.clear();
        idx = -1;
        setBtn();
        if (close) {
          hideBox();
          return;
        }
        ended = true;
        showEnd();
        const g = resolveFp("__general");
        if (g) flyRes({ cam: { pos: g.pos, target: g.target } });
        if (!U.card) setInfo("__general");   // (1.0.1-L: the floating card does not open by itself)
      };
      const next = () => {
        if (!running) return;
        if (idx + 1 < slides.length || mode.key === "continuous") go(idx + 1, 1);
        else finish(false);
      };
      const prev = () => {
        if (!running) return;
        if (idx > 0) go(idx - 1, -1);
        else if (mode.key === "continuous") go(slides.length - 1, -1);
      };
      const setSpeed = (k) => {
        if (!(k > 0)) return;
        const frac = total > 0 ? elapsed / total : 0;
        speed = userSpeed = k;
        spd.value = String(k);
        try {
          localStorage.setItem("tm-tour-speed", String(k));
        } catch (_) {
        }
        if (running && slides[idx]) {
          total = slideMs(slides[idx]);
          elapsed = frac * total;
        }
      };
      // the user looks around: the continuous mode holds 8 s after the last interaction, the other modes pause until "המשך"
      const userInteract = () => {
        if (!running) return;
        if (mode.key === "continuous" && !paused) {
          idleUntil = now() + 8000;
          if (cur && cur.orbit) cur.orbit.dead = true;
          showWait();
        } else setPaused(true);
      };
      // 1.0.1-K review (tour-6): the continuous mode's hold is kept 8 s ahead while a pointer is down or drags (no allocation: per frame)
      const holdOn = () => {
        if (running && mode.key === "continuous" && !paused) idleUntil = Math.max(idleUntil, now() + 8000);
      };
      // ---- the controls ----
      btn.addEventListener("click", () => {
        if (confirmOpen()) return;
        if (running) finish(true);
        else openMenu(!menuOpen);
      });
      bPrev.addEventListener("click", () => {
        if (confirmOpen()) return;
        setPaused(false);
        prev();
      });
      bNext.addEventListener("click", () => {
        if (confirmOpen()) return;
        setPaused(false);
        next();
      });
      bPause.addEventListener("click", () => {
        if (confirmOpen()) return;
        if (!running) {
          start(mode.key);
          return;
        }
        setPaused(!paused);
      });
      bStop.addEventListener("click", () => {
        if (confirmOpen()) return;
        finish(true);
      });
      // 1.0.1-K review (tour-3): after a choice the select gives the focus back - Chromium leaves it there after a mouse pick, and then Esc
      // did not end the tour and the arrow keys changed (and stored) the speed instead of turning the view
      spd.addEventListener("change", () => {
        setSpeed(parseFloat(spd.value));
        if (fnc(spd.blur)) spd.blur();
      });
      // F1 / UX2: a source link opened from the banner (Otzaria takes the reader away): pause. Capture phase - the link's own handler
      // (openSource) stops the click's propagation (1.0.1-L: the bubble's links too)
      for (const host of [elSrc, elBub]) {
        host.addEventListener("click", (e) => {
          if (!running) return;
          for (let n = e.target; n && n !== host; n = n.parentNode) {
            if (n.tagName && String(n.tagName).toUpperCase() === "A") {
              setPaused(true);
              return;
            }
          }
        }, true);
      }
      // 1.0.1-L: the reader scrolls the text himself: a new caption no longer scrolls it away
      for (const ev of ["wheel", "pointerdown", "touchstart"]) {
        body.addEventListener(ev, () => {
          if (cur && cur.anim) cur.anim.scrolled = true;
        }, { passive: true });
      }
      // F4 / UX6: any pointer on the model, the nav buttons, the model's pills or the panel = the user takes over; the wheel outside the
      // banner and the panel too. Not the tour's own elements, not the cloud dialog; synthetic pointer events (90-entry.js) are ignored
      document.addEventListener("pointerdown", (e) => {
        const t = e.target;
        if (menuOpen && !inside(t, menu) && !inside(t, btn)) openMenu(false);
        if (!running || e.__tmSynthetic) return;
        if (inside(t, box) || inside(t, btn) || inside(t, menu) || inside(t, cfEl())) return;
        downPtrs.add(e.pointerId);   // tour-6: held while it is down
        userInteract();
      }, true);
      // 1.0.1-K review (tour-6): "רציפה" counted only the press, so a drag or a nav button held longer than 8 s (they repeat every 40 ms
      // with no new events) flew to the next slide mid-gesture. Now the tour holds while any pointer is down and 8 s after the last is
      // lifted; a move with a button pressed refreshes the hold too. Synthetic events of 90-entry.js's pointer safety never start or
      // refresh a hold - a synthetic release (a lost release it ends) only clears its pointer, as a move with no button pressed, the
      // window's blur and a hidden document do: a lost release never holds the tour for good
      const ptrUp = (e) => {
        if (!downPtrs.delete(e.pointerId)) return;
        if (!e.__tmSynthetic) holdOn();
      };
      document.addEventListener("pointerup", ptrUp, true);
      document.addEventListener("pointercancel", ptrUp, true);
      document.addEventListener("pointermove", (e) => {
        if (!running) return;
        if (!e.buttons) {
          if (downPtrs.size) downPtrs.delete(e.pointerId);   // not pressed any more (released outside the page)
          return;
        }
        if (e.__tmSynthetic || mode.key !== "continuous" || paused) return;
        const t = e.target;
        if (inside(t, box) || inside(t, btn) || inside(t, menu) || inside(t, cfEl())) return;
        holdOn();
      }, { capture: true, passive: true });
      const ptrsLost = () => {
        if (!downPtrs.size) return;
        downPtrs.clear();
        holdOn();
      };
      window.addEventListener("blur", ptrsLost);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) ptrsLost();
      });
      document.addEventListener("wheel", (e) => {
        if (!running) return;
        const t = e.target;
        if (inside(t, box) || inside(t, menu) || (U.panel && inside(t, U.panel))) return;
        userInteract();
      }, { capture: true, passive: true });
      // keys: Esc closes the menu / answers the cloud dialog ("ביטול") / ends the tour; the arrows and the zoom keys turn the view -> the user
      // takes over. Nothing else is taken while the focus is in an input, a select or the side panel; no key is prevented
      window.addEventListener("keydown", (e) => {
        const ae = document.activeElement;
        const tag = ae && ae.tagName ? String(ae.tagName).toUpperCase() : "";
        const cf = confirmOpen();
        if (e.key === "Escape" || e.key === "Esc") {
          // 1.0.1-K review (tour-3): Esc BEFORE the focus test - with the focus on a side-panel button or checkbox, or on the banner's speed
          // <select> (Chromium leaves the focus on what the mouse clicked), the banner's "Esc — סיום" did nothing. Esc has no use there;
          // only a field one types in (none in the UI today) keeps its own Esc
          if (tag === "TEXTAREA" || (ae && ae.isContentEditable) ||
            (tag === "INPUT" && !/^(checkbox|radio|button|submit|reset|range|color|file|image)$/i.test(String(ae.type || "text")))) return;
          if (menuOpen) return void openMenu(false);
          if (cf) {
            if (running) cancelConfirm();
            return;
          }
          // the dialog was open at the last frame and is closed now: its own Esc handler (if ui.js has one) closed it during this very key
          // press - the tour goes on (a person's next key comes much later than 80 ms)
          if (now() - cfSeenAt < 80) return;
          // 1.0.1-L (L.34): an explanation card the user opened during a pause: this Esc closes the card (70-ui.js), not the tour
          if (running && U.card && fnc(U.card.isOpen) && U.card.isOpen()) return;
          if (running) finish(true);
          else if (box.style.display !== "none") hideBox();
          return;
        }
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (ae && ae.isContentEditable) || (U.panel && inside(ae, U.panel))) return;
        if (!running || cf) return;
        if (/^(Arrow(Up|Down|Left|Right)|PageUp|PageDown|\+|-|=)$/.test(e.key || "")) userInteract();
      }, true);
      // ---- the clock: a ctx.animated hook (no interval), frozen while paused, held, waiting for the dialog or hidden ----
      ctx.animated.push(function(t) {
        const tn = typeof t === "number" && isFinite(t) ? t : now();
        const dt = lastT ? Math.min(500, Math.max(0, tn - lastT)) : 0;
        lastT = tn;
        if (!running) return;
        const cf = confirmOpen();
        if (cf) cfSeenAt = now();
        const rt = cur;
        if (rt && rt.devirNav) {
          if (cf) rt.asked = true;
          else if (rt.asked) {
            // the confirmation was answered: "ביטול" (the cloud still covers the devir) -> the slide's view from outside the devir
            rt.asked = false;
            if (cloudOn()) {
              cloudDenied = true;   // 1.0.1-L: not asked again in this run
              const r2 = pick(rt.s.out);
              if (r2) flyRes(r2);
            }
          }
        }
        const hidden = typeof document !== "undefined" && document.hidden;
        if (downPtrs.size) holdOn();   // tour-6: a pointer is still down (a long drag, a nav button held)
        const hold = paused || cf || hidden || (mode.key === "continuous" && now() < idleUntil);
        showWait();
        if (tn - fitAt > 1000) {
          fitAt = tn;
          fitBox();   // the nav row may change (e.g. "החזר הכל" appears when a removal is on)
        }
        // 1.0.1-L (L.34): the explanation card stays closed while the tour runs; while the user himself paused it, a card he opened from the
        // panel may stay beside the panel (on a phone it would lie over the banner: closed)
        if (U.card && fnc(U.card.isOpen) && U.card.isOpen() && (!paused || narrow())) closeXCard();
        if (!hold) elapsed += dt;
        if (rt) animStep(rt);   // 1.0.1-L: (held too: the timeline stays at the same moment)
        if (hold) return;
        if (rt) {
          thenStep(rt);
          if (!(rt.act && demoRunning())) orbitStep(rt);   // 1.3.5 / 1.9.3: a demonstration leads the eye itself
        }
        if (tn - progAt > 120 || elapsed >= total) {
          progAt = tn;
          bar.style.width = Math.min(100, elapsed / total * 100).toFixed(1) + "%";
        }
        if (elapsed >= total) {
          // 1.3.5 / 1.9.3: a demonstration that the slide started runs to its end first (two minutes more at most)
          if (rt && rt.act && elapsed < total + 120000 * speed && demoRunning()) return;
          next();
        }
      });
      setBtn();
      openMenu(false);
      // ---- the API (tests, the integrator) ----
      const state = () => ({ running, paused, ended, mode: mode.key, idx, total: slides.length, title: slides[idx] ? slides[idx].title : "",
        waiting: confirmOpen(), idle: !!(running && mode.key === "continuous" && now() < idleUntil), round, speed, elapsed, slideMs: total });
      for (const k of ["running", "paused", "ended", "mode", "idx", "total", "title", "waiting", "idle", "round", "speed"]) {
        Object.defineProperty(state, k, { get: () => state()[k], enumerable: true });
      }
      // each slide's resolved target, without moving anything (for tests): fp / place, the feature, whether a fallback was used
      const plan = (key) => {
        const M = tour_MODES.find((m) => m.key === key) || tour_MODES[0];
        const list = M.key === "verses" ? verseSlides() : topicSlides();
        return list.map((s, i) => {
          const base = { n: i + 1, kind: s.kind, title: s.title, sub: s.sub || "", group: s.group || "", part: s.part, bubble: !!s.bubble, ver: s.ver || null, anim: s.anim ? s.anim + (s.animW ? "+witnesses" : "") : null, chars: (s.text || "").length, refs: (s.refs || []).length };
          if (s.nofly) return Object.assign(base, { target: "nofly" });
          if (s.kind === "opinion") return Object.assign(base, { target: "row.fly(" + s.key + ")" });
          const r = pick(s.go);
          if (!r) return Object.assign(base, { target: "MISSING -> __general" });
          const c = r.c;
          return Object.assign(base, { target: c.fp ? "fp:" + c.fp : c.place ? "place:" + c.place : "pos", feature: c.f || null, layer: s.lay || c.lay || r.cam.layer || null,
            fallback: s.go.indexOf(c) > 0, pos: r.cam.pos, at: r.cam.target, devir: inDevir(r.cam.pos) || inDevir(r.cam.target) });
        });
      };
      ctx.shared.tour = {
        modes: tour_MODES.map((m) => ({ key: m.key, label: m.label, desc: m.desc })),
        start: (m, opts) => start(m, opts),
        stop: () => finish(true),
        next,
        prev,
        // 1.0.1-L: to a slide by its index, and to a moment of its timeline in seconds (tests, the integrator's pictures)
        goto: (i) => (running && i >= 0 && i < slides.length ? go(i, 1) : false),
        seek: (sec) => {
          if (!running || !cur || !cur.anim || !(sec >= 0)) return false;
          elapsed = (sec + tour_ANIM_LEAD) * 1000 * speed;
          return true;
        },
        pause: (p) => setPaused(p === undefined ? true : !!p),
        setSpeed,
        state,
        plan,
        get slides() {
          return slides;
        }
      };
    } catch (e) {
      if (typeof console !== "undefined") console.error("[tour.js]", e);
    }
  }
