# FIXES-1.0.1-L — the user's answers of 29.10.2026 (round L)

The user (a melamed) answered the open questions of round K on 29.10.2026. This brief turns the answers into work. It builds on
`FIXES-1.0.1-K.md` (§0 = shared rules and contracts — read it; everything there still holds) and on the round-K review fixes
(reports in SCR\fixK-reports.txt). The user confirmed my restatement of the answers ("כן, תתחיל").

Paths: ROOT = `C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1`;
SCR = `C:\Users\x1\AppData\Local\Temp\claude\C--Users-x1-AppData-Roaming-Claude-scratch-workspaces-6cc20f1e-776f-4297-b95a-bf0558e72515-48a5e90a-221b-4185-bd62-4df70efb9058-scratch-2026-10-26-9aa69f\5cde0745-88eb-454f-928a-5b900122f33d\scratchpad`.
The book = "מקרא מפורש — איורי בית המקדש הראשון" (follows Rashi; the visual basis of model choices, never a source): page crops in
`SCR\user-docs\pdf\zoom\` (p16–p20 = the Sea and the bases, p21L the table, p06_layers the wall layers, p07 the cherubim, p12–p13 the
palace) and full pages in `SCR\user-docs\pdf\`. Fetched commentaries: `SCR\src-hiram.txt`, `src-palace.txt`, `src-table.txt`,
`src-K.txt`, `q16.out` (the Sea's place, all commentaries on I Kings 7:39 and II Chr 4:10), `q17.out` (Yoma 19a on the chambers).
Otzaria DB: `C:\Users\x1\AppData\Roaming\otzaria\books\seforim.db` (node:sqlite; zstd with the dictionary in table zstd_dict; working
code in `SCR\q15.mjs` / `q16.mjs`). Every quote must be the source's exact words, checked in the DB.

## The user's answers (verbatim) and what they mean

Unchanged (keep as built): 1 "חלקה" (the house walls plain stone), 2 "נכון" (yatzia beams 1 thick, roof at 30), 3 "נגמרות בו" (floor
beams end at the chamber wall), 4 "84" (ulam front), 5 "עם שושנים" (lower capital with roses), 12 "מתחת" (cherub wings under the head),
15 "תמיד" (smoke always), 16 "על ברושים" (devir floor gold on cypress), 18 "מוטות" (the lintel), 19 "כמו בספר" (7:6), 23 "מן ההיכל"
(the cloud slide), 24–26 "כן", "כן", "מצוין" (the card, the compass letters, the cloud pill), 28 "נוח מאוד" (two-finger zoom).
Names (done by the integrator): the First Temple plugin's name is "בית ראשון"; the Second Temple plugin was renamed "הדמית בית שני" (1.0.20).

**L.6 Yachin and Boaz — "תנסה להצמיד ככל האפשר".** Move both pillars as close to the house wall as the geometry allows. Today: centres
x 6.3, z ±7; the capital's widest radius 2.81 (y 30, the pomegranates); clearances: doorposts 0.182, side walls 0.201, house wall 0.99,
lintel 1.165. The heichal doorposts (1 × 1, standing 1 amah proud of the wall's east face x 2.5, 55-interior.js) are what stops them.
Optimise (x, z) per pillar: smallest distance to the wall with ≥ 0.02 clearance from the doorposts, the lintel, the folded doors, the
side walls (|z| 10) and the cedar strips; then report the final gaps. Keep the source comment (Rashi on Jer 52:23 "העמידם שלמה באולם
סמוך לכותל ההיכל"). Update the fly points yachinBoaz / yachinBoazCapital (clear rays), the labels, `ctx.shared.heichal.pillars`.

**L.7 The Sea — "כרש"י ובספר".** The Sea stands in the CORNER of the inner court ("מקצוע"), as the book draws it (p20): north-east for
Rashi on I Kings 7:39 (the default reading): "מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה"; south-east for the
second reading (Metzudat David 7:39 "משוך כלפי מקצוע מזרחית דרומית שבעזרת כהנים"; Radak "נתן הים בעזרה לצד דרום משוך כלפי מזרח";
Ralbag "לפאת מזרחי דרומי שבחצר הכהנים"; Rashi on II Chr 4:10 "רחק אותו מן המזרח מן כנגד הפתח לדרומה של עזרה, לפי שאין כבוד ונאה
שיהו מטבילין כנגד פתח האולם"). Look at p20 for the exact place and copy it as far as the court allows. It must clear: the court walls
(inner faces x 91, z ±65) with room to walk around, the east gate (x 93.5, z 0) and the north / south gates at x 40 with their
portals, the altar (x 39.5..59.5, z ±10) and its ramp (x 41.5..57.5, z 10..42), the bases and the demo path, and לשכת הגזית, which
moves to the NORTH wall west of the western north gate (L.21) so the north-east corner is free. Update `CO.seaX / seaZ / seaZRashi`
in 10-core.js (only that line), `VSL_SEA_Z` / `vsl_layout`, `seaPlacement.set`, the fly points `yam` / `yamOxen` (both readings,
clear rays, the camera inside no solid and outside the ramp for a few orbit steps), and the label.

**L.8 The wheels of the bases — "בתוך, רק שיראו ברור".** Keep the wheels inside the 4 × 4, but make them clearly visible from the
views "המכונות" and "המכונות מקרוב" and the court views: e.g. put each wheel's outer face at the footprint's edge, make the rims and
spokes read (thickness, a darker or brighter bronze than the body), and make sure the low frame and the ליות do not hide them. Pictures.

**L.9 Taps for the lavers — "תוסיף".** Add the taps as the book draws them (p17–p19: look at their number, place and shape). There is
no source: a model choice "כציור הספר". Bronze (vsl_bronze), instanced, also on the moving base (it follows the demo and the explode).

**L.10 The 12 spouts of Moses' laver — "תסיר".** Remove them (בן קטין's twelve spouts, Mishnah Yoma 3:10, are Second Temple).

**L.11 The ten tables for the Tanna Kamma — "עם סניפים וקנים".** Under the Tanna Kamma the ten tables carry their סניפין and קנים
without bread (Moses' table keeps its bread; for R. Elazar ben Shamua all have bread, as now). Mishnah Menachot 11:6 "ארבעה סניפין של
זהב היו שם מפוצלין מראשיהן"; 28 קנים. Make them read as an empty frame for the bread (the K.4 note: without bread they looked like
chair backs - fix that look, e.g. the tubes resting across the posts' branches at the loaves' heights). Both layouts, pictures.

**L.13 The golden altar — "אמה".** Its height is ONE amah: 1 × 1 × 1 (Rambam Beit HaBechira 3:17 gives "אמה על אמה"; the height is
the user's decision). As in Ex 30:2 ("ממנו קרנתיו") the horns are part of the altar: the horns' tops at 1 amah above the floor, the
crown rail at the roof's edge. Update the coals and the smoke's start, the layers exhibit (stone / cedar / gold) and its pill anchor
(preallocated), the labels, the fly point `incenseAltar` (eye height) in both layouts.

**L.14 The wall / floor layers window — "שיראה ברור".** Make the exhibit clearly visible: a larger window with clearer steps, a strong
colour contrast between stone, carved cedar and gold (and cypress / gold on the floor), readable labels, and a fly point `wallLayers`
that frames it frontally. Compare with the book (p06_layers). It stays an option (default all gold).

**L.17 The carvings — "תראה אם מספיק ברור כשזה חלק".** Check at 1280 × 800 from the views "ההיכל", the carvings place, "קודש
הקדשים" and the doors whether the flat figures (cherubim, palms, flowers, knobs, chains) are clear. If not, make them clearer while
keeping them flat (Rashi 6:32, Radak 6:29): stronger cut outlines, more contrast between the figures and the woven ground, a little
shading inside the figures. Before / after pictures for the user.

**L.20 בית יער הלבנון — Metzudat David's reading — "תוסיף".** Add Metzudat David's own reading of I Kings 7:2–6 as a THIRD reading.
Read his words on 7:2, 7:3, 7:4, 7:5, 7:6 in the DB (and `SCR\src-palace.txt`); K.6's note: in his reading אולם העמודים stands along
the house's long side opposite its openings, the doorways are in the long walls, the windows "מכוונות זו מול זו", "עמודים תקועים בארץ
וממעל להם עץ עב". Split the current second reading so it carries only what Malbim and Ralbag say (its name becomes "מלבי״ם ורלב״ג"),
and the new reading carries what Metzudat David says. Contract: `ctx.shared.forestHouse.keys = ["rashi", "metzudot", "mzd"]`, names
{rashi: "רש״י (כאיורי ׳מקרא מפורש׳)", metzudot: "מלבי״ם ורלב״ג", mzd: "מצודת דוד"}; a layer group `forestMzd`; its labels with
`layers: ["palace", "forestMzd"]`; its boards in `ctx.forestBoardsCut`; `forestHouse.set("mzd")` aims flyPoints.forestInside /
forestRoof / forestUpper into it; `ctx.shared.forestHouseNotes` covers all three.

**L.21 לשכת הגזית — "בצפון".** Move the chamber to the north wall of the inner court (Yoma 19a — check the words in q17.out / the DB;
Middot 5:4 puts it in the south). Place: west of the western north gate, x about −89..−59, straddling the north wall (z −67.5): the
court half z −65..−50, the outer half outside; mirror everything (the court door now in its south wall, the outside door in its north
wall with 12 steps down to the north, the seats on the outer = north half, the line of the court wall across the floor, the lantern).
Clear of the north gate at x −40 (its portal and stair x −46..−34), the house and its yatzia (z −27), the marble floor ring.
Update `ctx.shared.lishkatHaGazit`, the fly point, the label, and the 30-courts.js header (Middot vs Yoma 19a; the model now follows
Yoma 19a by the user's decision).

**L.22 The king's garden — "בלי בריכה".** Remove the pool; keep the garden. Update its label ("הגן (קהלת ב, ה)") and palaceNotes.garden.

**L.27 Places that switch a feature on — "תן לזה 15 שניות ויחזור אוטו".** When a PLACE in the panel switches a feature on (the yatzia
section, the wall layers, the altar layers, the base's demo, the exploded base with its part labels), the feature switches itself off
15 seconds later. If the user presses that feature's own pill in the meantime, the timer is cancelled and the user's state stays. The
on-model pills themselves are not timed. Say it in the place's text ("חוזר לבד אחרי 15 שניות"). The tour is not affected (it restores
per slide). No per-frame allocation (a single timestamp per feature checked in an existing hook, or setTimeout).

## Integration follow-ups from the round-K review fixes
- `.tm-pill` (z-index 29) draws over the tour banner `#tm-tour-box` (also 29): give the pills a lower z-index than the banner (and
  check the side panel 30, the tooltip, the label card, the cloud dialog).
- 70-ui.js CSS `@media(max-width:640px){#tm-nav .tm-grp .cap{display:none}}` vs its JS `innerWidth < 640`: use 639px, one rule.
- The fix verifiers confirmed every round-K review finding fixed, with no regressions. Small leftovers for this round:
  - 45-vessels.js ~1118: a stale comment still names the UI's removed hook "partsAuto" (it is now explodeWas, and it only hides the
    part labels when the explode goes off) - vessels-heichal.
  - 55-interior.js ~1434: the comment says the rashbash shulchanot camera is 1.8 from the nearest part; it is 0.88 (the north devir
    doorpost's east face, behind the camera) - interior.
  - 60-palace.js ~1288-1292: the comment gives "23.5 amot from the name" for both roof pills; that holds only for the throne hall (the
    king's pill is 38.5 east and 7.5 south of "בית המלך") - palace-courts.
  - Labels that name the boards ("45 נסרי הסיפון", "קירוי הנסרים הדקים על המרישין — ״שקופים״" and the like) float over nothing while
    "הסר את הנסרים" is on: 60-palace.js puts them on a new layer group `ctx.layers.forestBoards` (visible by default; their `layers`
    become [..., "forestBoards"]), and 70-ui.js's boards pill (ui-boards) also sets `ctx.layers.forestBoards.visible = !on`.
  - 70-ui.js: the Rashi quotes on 7:2-7:4 in the forest-house places use plene spelling (רוחב, קירה, קירוי, צידיהן, הסיפון, לרוחב,
    לאורך) where the DB has רחב, קרה, קרוי, צדיהן, הספון, לרחב, לארך: quote the DB's spelling exactly.

## (was deferred, now decided - see Part 3) L.21 (לשכת הגזית)
The user asked for a full search of the sources on where לשכת הגזית stood (running in parallel). L.21 is NOT part of this run: the
palace-courts group leaves לשכת הגזית where it is (south) and the UI keeps its texts. A later step will place it per the search and the
user's decision. Until then the Sea's north-east corner (L.7) must stay free of the chamber's possible place: it will be west of the
western north gate (x -89..-59) or stay in the south.


## Added 29.10.2026 evening (the user's new messages, verbatim) - part of this round

**L.30 The cherubim's wings — "כנפי הכרובים, מאוזן (תצוגה שוכבת) ולא מאונך".** Solomon's two cherubim: turn the wings from a
vertical plane (facing the house) into a HORIZONTAL plane, spread flat ("lying") across the devir at about shoulder height, the
feathers fanning out horizontally; the outer tips still touch the walls and the inner tips each other (I Kings 6:27 "ויפרשו את כנפי
הכרבים ותגע כנף האחד בקיר... וכנפיהם אל תוך הבית נגעת כנף אל כנף"), all four wings in one horizontal canopy; they stay under the heads
(the user kept "מתחת"). Moses' small cherubim on the kaporet: their wings also lie in a horizontal plane, but raised above their heads
over the kaporet (Ex 25:20 "פרשי כנפים למעלה"; Rashi "פרושים וגבוהים למעלה אצל ראשיהם"). Pictures from the devir views; the cloud
must still cover them by default; no clash with the ark, the kaporet, the staves, the walls.

**L.31 The cedar in the wall layers — "העץ בשכבות ההיכל לא מספיק מחודד".** In the layers exhibit (L.14) the carved cedar layer must
read sharply: a clearly visible step of cedar between the stone and the gold, with crisp edges, a distinct cedar colour and plank
joints, and its carving clearly cut (the carving is in the cedar: 6:18 "וארז אל הבית פנימה מקלעת פקעים ופטורי צצים", 6:29), so that
stone / carved cedar / gold read at a glance from the fly point wallLayers. The user, next message: "קח את זה קצת יותר לכיוון פתח
ההיכל כדי שיראה יותר ברור" - move the whole window (wall and floor parts) east along the north wall, toward the heichal's entrance
(the doorway at x -3.5), so it is seen clearly from the entrance and from the default heichal view; keep it clear of the tables of
both layouts, the menorot, the chains and the doors; re-aim the fly point wallLayers and the pill anchor.

**L.32 The devir doorway — "פתח הדביר אין משקוף עליון".** Add an upper lintel (משקוף) to the devir doorway, as the book draws it
(p08R: a gold beam across the top of the opening). Sources: Radak 6:31 "האיל הוא הסף העליון והמזוזות הם אשר מפה ומפה אשר הסף סמוך
עליהם... שהיתה המזוזה חמש צלעות זו לפנים מזו וכן המזוזה האחרת וכן האיל"; Ralbag "האיל והוא הסף אשר על הפתח"; Malbim "האיל ר"ל
המשקוף"; Rashi ("ואני אומר... ואינו מדבר לא במפתן ולא במשקוף") does not deny a lintel, the verse only speaks of the posts. In
Rashi's default reading (pent) the lintel is a model choice in the posts' material (carved gold), its profile matching the pentagonal
posts; in the second reading ("כך שמעתי") the two-beam lintel "עשוי כשתים" already is the lintel - check that it reads as one. The
parochet and the doors must still fit; the fly points devirDoor / parochet keep clear rays.

**L.33 The king's house — "בית המלך היה בחצר אחרת לגמרי! ולא בתוך חצר בית יער הלבנון".** The king's house must stand in its OWN
court, clearly separate from the court of בית יער הלבנון: I Kings 7:8 "וביתו אשר ישב שם חצר האחרת מבית לאולם"; Rashi "מבית לאולם -
לפנים מן אולם של בית יער הלבנון"; Radak "החצר האחרת שהיתה לבית הזה והיא החצר שהיתה מבפנים לאולם"; Metzudat David "אשר עמדה בחצר
האחרת, מבפנים לאולם המשפט, בדרך הכניסה מן החוץ אל מקום בתי המלוכה"; Ralbag "הוא החצר האחרת שהיא מבפני' לאולם אשר בנה שם ביתו";
Malbim "בית המלך והחצר שלפניו היה מבית לאולם ופנימי לו" (7:12 "וחצר הגדולה סביב" surrounds all the king's buildings). Give the
other court its own full enclosing wall and gate (reached from inside the hall, "מבית לאולם"), so that the forest house is visibly
outside it and the king's house (with the garden without a pool) is inside it. בית בת פרעה is NOT in the king's court: the user's
next message, verbatim: "בית בת פרעה בתוך חצר בית יער הלבנון" - Pharaoh's daughter's house stands inside the court of בית יער הלבנון
(7:8 "ובית יעשה לבת פרעה אשר לקח שלמה כאולם הזה" - built like the hall; its place is the user's decision; II Chr 8:11 "לא תשב
אשה לי בבית דויד" - apart from the king's house). Look at the book's palace
pages (p12-p13) and follow them where they show it. Update labels, the fly point kingsHouse, the roof pill anchor, palaceNotes.

**L.34 The panel — "יש בעיה שכל פעם שלוחצים על הר הבית הוא פותח הסבר ואז צריך לגלול כדי למצוא את יתר הכפתורים".** When a view,
place, group or opinion row is clicked, its explanation must not push the panel's buttons down. Solution (model of the label card the
user approved): the explanation opens in a floating card BESIDE the panel (over the model, next to the panel's edge), with a ✕, its
own scroll, and the source links; the panel's lists never move; a new choice replaces the card's content; Esc or ✕ closes it; on a
phone it is a bottom sheet above the nav row; the presentation's banner and the label card must not overlap it (one card at a time:
opening one closes the other). Check that every place, view, group header and opinion row still shows its text and links.


**L.35 The cherubim's faces — "פרצופי הכרובים נוראים".** Redo the faces of the cherubim (Solomon's two and Moses' two, and check the
cherubim in the carvings too): the current head (a sphere with two dark dots for eyes, a small ball for a nose) looks bad. Make a calm,
dignified child's face as the book draws it (p07_cherub_right.png, p07L.png): an oval head with a chin and cheeks, a straight nose
ridge, softly cut almond eyes with lids, a small closed mouth, a clear hairline, all in the same gold, modelled in the geometry and/or
a face texture with a bump map so the features read in gold under the devir's light - no cartoon features, no black dots. Sources:
Rashi on II Chr 3:10 "תבנית ילדים וילדות"; Rashi Ex 25:18 "דמות פרצוף תינוק"; Chagigah 13b "כרביא". Pictures close up and from the
devir views, compared with the book, before and after; the three face poses (cherubPose) must still work.

## Part 3 — the user's messages of 29.10.2026, ~19:00 (verbatim quotes; all part of this round)

**L.21 לשכת הגזית — NO LONGER DEFERRED.** The full source search is in SCR\gazit\answer.md (75 verified quotes). The user decided:
"רמבם" / "לאורך" / "הבא את שיטת התוספות יו"ט והמכילתא" / "גם בבית ראשון". So: in the NORTH (Rambam Beit HaBechira 5:17 "והשלש
שבצפון לשכת הגזית. לשכת הגולה. לשכת העץ"; Yoma 19a "שלש שבצפון: לשכת העץ, לשכת הגולה, לשכת הגזית"); on the EAST part of the north
wall, opposite the altar - Tosafot Yom Tov's drawing "שבצפון סמוכה למזרח לשכת הגזית" and the Mechilta "נמצינו למדין שסנהדרין בצד
מזבח" (Tosafot Rid "סמוכה למזבח ופתוחה למזבח"); LENGTHWISE ("לאורך"): its long side along the wall, the line of the court wall running
along its length so that half is in the court and half outside (Yoma 25a "חציה בקדש וחציה בחול, ושמע מינה שני פתחים היו לה"; Tiferet
Yisrael "בנויה חציה בדרום בקודש וחציה בצפון בחול"); and it is in the FIRST Temple too (Rashi on II Chr 34:22 "כי לשכה אחת היתה לה
לחולדה, סמוכה ללשכת הגזית"; Maharsha on Bava Batra 91b "כי במלכותו נתמנה סנהדרי גדולה לישב בלשכת הגזית"). Room: between the eastern
north gate (x 40, its portal and stair to about x 46) and the Sea in the north-east corner (now about x 80, z -54; 45-vessels.js
vsl_layout moves the Sea if the chamber overlaps x 69..91 - keep clear by at least 1 amah) - about 22-25 amot along the wall; the depth
across the wall is a model choice (if the seats need room, the outer half may go further north). Doors (Chok Natan, so that Yoma 25a
"פייס במזרחה, וזקן יושב במערבה" holds): the holy door into the court in the chamber's south wall toward the EAST, the profane door in
its north wall toward the WEST with steps down (Tosafot Yom Tov "היו מעלות שעליה עולין וממנה יורדין לחול"); the lots (פייס) in the
inner half toward the east, the Sanhedrin's 71 seats in a half circle in the outer half toward the west. The label cites Yoma 19a +
Rambam 5:17 for the side and Yoma 25a for the halves. Groups: courts (30-courts.js) + the UI texts.

**L.40 The bases' purpose — "מה היה תפקידה של המכונה? תחפש, ודאי שתפקידה לא היה ללכת ולחזור סתם".** Search the sources for what the
bases and their wheels were FOR (II Chr 4:6 "ויעש כיורים עשרה... לרחצה בהם את מעשה העולה ידיחו בם, והים לרחצה לכהנים בו"; I Kings
7:27-39 with Rashi, Radak, Metzudot, Ralbag, Malbim, בעל צורת הבית; Rashi on II Chr 4:6; the Talmud and midrash if they speak of the
מכונות; the book p17-p19) and make the demonstration SHOW that purpose (e.g. the base carries its laver to where the burnt offering's
parts are rinsed, near the altar / the slaughter place on its north, stops there and returns; or to the Sea to be filled - whatever
the sources say), with the pill's title and the texts quoting the sources. Write a short Hebrew answer with exact quotes for the user.
Group: vessels.

**L.41 "הבית מבחוץ" — "כפתור הבית מבחוץ לא ממש מציג את הבית".** The view "הבית מבחוץ" must show the whole house well (as the book's
general view p01): the house, the ulam and the closed yatzia, framed fully and large. Groups: heichal (its fly point) + UI.

**L.42 The yatzia section — "חתך התאים ביציע לא מלמד מספיק על רוחב משתנה בין הקומות כדברי רש"י, צריך שינוי וחשיבה מקורית, עיין בספר
כדי ללמוד משם".** Rethink the section so it TEACHES Rashi's calculation at a glance: the chambers 5 / 6 / 7 wide on the three stories
because the house wall steps in 1 amah at each story (7 / 6 / 5, and 4 above), the beams resting on the ledges. Study how the book
teaches it (p04L section, p04R, p05) and do better than now: e.g. a full-height cut through all three stories seen square-on, the
three chambers coloured or shaded differently with their widths written on them, the wall's steps and the ledges highlighted, the
beams' ends visible on the ledges, measures that line up. Group: heichal.

**L.43 The section button — "הכפתור שנמצא בצילום מסך, צריך להיות בתפריט היציע באופן ברור (היינו כשאתה לוחץ על חתך תוכ"ד הצגת היציע
המסך מסתובב להראות את זה ולא את מה שהוא מראה היום מבט מזווית שונה)".** (The screenshot shows the panel button "חתך היציע — חשבון
רש״י (7, 6, 5)" and the section.) (a) When the section is switched on - by its pill on the model or by that place - the camera turns
to the section view (flyPoints.yatziaSection, square-on to the cut, the view of the screenshot), not another angle. (b) The section's
button must be clearly in the yatzia's part of the panel (with "היציע"). Groups: heichal (the pill's set also flies the camera through
ctx.ui.fly when present; the fly point) + UI (the panel).

**L.44 The ulam view — "באולם במקום שיציג מלמעלה שיציג בצורה רגילה, אך שתהיה אפשרות לראות את פתח האולם מבלי להסיר את הקירות (תשאיר
אפשרות לפתיחה מלאה)".** The view "האולם" from the front at normal eye height (not from above), showing the ulam's front and its
doorway; the full opening stays as the existing pill "פתח את האולם". Groups: heichal (flyPoints.ulamInside) + UI.

**L.45 Yachin and Boaz — "כפתור יכין ובועז אמור להראותם בשלמותם".** The view "יכין ובועז" must show both pillars WHOLE (base to top).
Inside the 10-deep hall no camera can frame a 21-amah pillar. The integrator is asking the user how (open the ulam's front while the
view is shown, or not); until then the heichal group adds a fly point that frames both whole pillars when the ulam's front is open
(flyPoints.yachinBoazFull) and keeps yachinBoaz; the UI group follows the decision in L.58 below.

**L.46 The tables — "השולחנות, אתה נורמלי? עשית אותם כשולחנות רגילים, מאין לך? למיטב ידיעתי הם היו כשלחן משה".** All ten tables
have exactly the FORM of Moses' table (the book p21L): the two tall gold towers of posts (סניפין) with the tubes, the crown, the spoons -
not plain tables. Bread follows the opinion row as before (Tanna Kamma: bread only on Moses' table; R. Elazar ben Shamua: on all).
This replaces L.11's wording. Both layouts. Group: interior.

**L.47 A darker wall — "הקיר השמאלי בהיכל קצת יותר כהה משאר הקירות - תקן".** In the heichal the left wall (looking west from the
entrance: the south wall) renders darker than the others. Find why (light direction, normals, a mirrored or flipped bump, a different
material clone, the env map) and make all the walls read equally. Group: interior.

**L.48 אולם העמודים in the second reading — "בהצגת אולם העמודים למצודות, הוא מציג את בית יער הלבנון במקום את אולם העמודים - אגב עיין
בספר ולפי"ז תבין את העב".** The place / fly point for אולם העמודים in the Metzudot reading (and in every reading) must show אולם
העמודים itself. And study the book's palace pages (p12-p13 and around) to understand the "עב" (7:6 "ועמדים ועב על פניהם") and build it
as the book shows. Groups: palace (fly points per reading) + UI (the place).

**L.49 Rotation speed — "מהירות הסיבוב במודל 360 הוא מהיר מדי כברירת מחדל - האט אותו, וסיבוב איטי השאר כך".** The free rotation
(drag; OrbitControls rotateSpeed 0.9 in 90-entry.js, and the ⟲ ⟳ buttons / arrow keys' step) is too fast by default: slow it clearly
(e.g. rotateSpeed about 0.5, the buttons' step and repeat slower). "סיבוב איטי" (autoRotateSpeed 0.4) stays as it is. Group: UI.

**L.50 The presentation — "אני רוצה שהמצגת תכלול גם תקריבים (בעצם את כל הכפתורים האפשריים בתוסף - שיטות נוספות בסוף ממש)".** The
presentation (topics and continuous modes) goes through EVERY view and EVERY place of the panel (the close-ups too), in panel order,
and only at the very end the other readings of the opinions table. Group: UI (75-tour.js).

**L.51 The bases' places — "למה צריך כפתור פעולת המכונה והמכונה בפירוק בתפריט? לא מספיק הכפתור על המכונה?".** Remove the panel
places "פעולת המכונה" and "המכונה בפירוק" (the pills on the base do it); keep "המכונות מקרוב". Group: UI.

**L.52 The golden altar's place — "מזבח הזהב היה מקומו ליד הפרוכת, או ליד פתח ההיכל?".** Search the sources (Ex 30:6 "ונתתה אתו לפני
הפרכת", 40:5, 40:26 with Rashi; Yoma 33b and Menachot 98b-99a on its place; Rambam Beit HaBechira 3:17; I Kings 6:20, 6:22 "וכל
המזבח אשר לדביר" with Rashi, Radak, Metzudot; 7:48), write the answer for the user with exact quotes, and place the altar accordingly
in both layouts (Rashi / the Rambam first; mark what is a model choice). Group: interior.

**L.53 The smoke — "עבה קצת עשן הקטורת שיהיה יותר ברור".** Thicken the incense column somewhat so it reads clearly (still straight,
"כמקל"). Group: interior.

**L.54 The staves — "הבלט את בדי הארון כך שיראו בולטים מהפרוכת".** Make the two staves' ends press out of the parochet clearly, seen
from the heichal (I Kings 8:8 "ויראו ראשי הבדים מן הקדש על פני הדביר ולא יראו החוצה"; Yoma 54a "דוחקין ובולטין בפרוכת ונראין כשני
דדי אשה"). Group: interior.

**L.55 The lions — "האריות מימין לשמאל ולא שמאל לימין".** On the parochet's devir face the lions must face / walk from right to left
(now they face to the right). Check the eagles' direction too and report it. Group: interior.

**L.56 The foundation stone — "אבן השתיה היתה בבית ראשון?".** Search the sources (Mishnah Yoma 5:2 "משניטל הארון אבן היתה שם מימות
נביאים ראשונים ושתיה היתה נקראת"; Yoma 53b-54b; Rambam Beit HaBechira 4:1; Rashi; Tosefta) and write the answer for the user; keep or
change the model accordingly (the ark on the stone). Group: interior.

**L.57 Solomon's throne — "לגבי כסא שלמה עיין במלכים וכן בקבצים המצורפים" and "הבא בעצמך עוד מקורות לכסא שלמה".** Rebuild the throne
after I Kings 10:18-20 and II Chr 9:17-19 with their commentators, the user's attached sources (pages rendered as pictures in
SCR\throne\: er-p1..3.png = Midrash Esther Rabbah on the throne, pa-p1..2.png = "פנים אחרים", docx-image1..3.png = "כסא שלמה עפ"י
המדרש"; read them as images), AND every other source you find in the Otzaria library (Targum Sheni on Esther 1:2, Esther Rabbah 1:12,
Midrash Panim Acherim, Yalkut Shimoni, Bamidbar Rabbah, Pesikta, Abarbanel and others - search "כסא שלמה", "כסאו של שלמה", the six
steps and their creatures). Build what the sources describe (the six steps and the creatures on them, the round top, the arms, the
lions; the midrash's details where they can be modelled, marked "על פי המדרש"); write a short Hebrew summary with exact quotes for the
user. Group: palace.

**L.59 The ulam doorway — the user's decision (30.10.2026, after the source search in SCR\ulamdoor\): "רוחב 10 גובה 22".** The ulam's
front doorway stays 10 wide and becomes 22 high (was 20): a model choice - no source gives the First Temple's ulam doorway a size
(Middot 3:7 "פתחו של אולם, גבהו ארבעים אמה, ורחבו עשרים אמה" and 2:3 "חוץ משל אולם" describe the Second Temple; the ברייתא דמלאכת
המשכן ch. 5 "כפתחו של חצר כך פתחו של אולם" gives a width of 20 with no Temple named). ADD two cedar doors to it, standing open by
default (folded back against the front wall, as the house's own doors): II Chr 29:7 "גם סגרו דלתות האולם ויכבו את הנרות" (Hezekiah's
days - the First Temple's ulam had doors); Malbim there "ואח"כ סגרו דלתות האולם"; Meiri on Yoma 54a "ואע"פ ששערים של עץ היו שם מ"מ לא
היו נועלים אותם ביום ופורסים הפרוכת לפניהם" (no curtain is built - DEV note). The head of the doorway stays a flat lintel (the book's
general view; Rashi on 7:5 "ולא עשויין כפה כעין פתחי אולם" speaks of an arch - DEV note, not built). Keep everything that depends on the
doorway in step: ctx.ulamCut (the doors belong to it - they go away with the front wall), the lintel plate, the jambs, the fly points
yachinBoaz (stands in the doorway) and ulamInside (L.44, from the front), ctx.shared.anchors.ulamFront (above the doorway), the
labels "יכין" / "בועז" if the lintel now hides them, the two doors' clearance from Yachin and Boaz and from the steps. Group: heichal-door
(50-heichal.js only, after the heichal group finished) + UI texts (the view text of "האולם": the doorway 10 x 22, a model choice; the
doors with II Chr 29:7).

**L.58 (the integrator's note) Yachin and Boaz decision.** The user, verbatim: "תשאיר סגור אולי תרחיק מאוד את המבט כדי שיראה מרחוק
הגודל כולו (סה"כ הרבה מההבנה היא בגודל)". So: NO automatic opening of the ulam for this view. The view "יכין ובועז" becomes a FAR view
from the court in front of the ulam that conveys the whole size (the pillars against the ulam and the house, people-scale), through the
ulam's doorway as far as it shows them; the close view of the capital (yachinBoazCapital) stays as a place. The ulam doorway is 10 wide
(12.4 with the jambs) x 20 high now, so from outside it hides most of both pillars (they stand at z +-7); the integrator asked the user
whether to widen it as Middot 3:7 ("פתחו של אולם גבהו ארבעים אמה ורחבו עשרים אמה"; Middot 2:3 "חוץ משל אולם"); do NOT change the
doorway in this round - the integrator will do it afterwards if the user agrees. The UI uses the heichal group's far fly point.

## Part 4 — the user's messages of 31.10.2026 (verbatim quotes; all part of this round)

The user wrote (verbatim): "א: עיין בפירוש המלבים למעשה שושן (פס' יט) והוסף זאת כאופצי' / ב: במסגרות שבין השלבים (אתה יודע מה זה? - פרט) היו 3
מכל צד - ביאור הגר"א / ג: הים של שלמה צריך להכיל 2000 בת - 6000 סאין = 44040 ליטר - תכנן אותו בגודל כזה (כוונתי היא שלא יהיה קטן
מדי) / ד: צייר על המסגרות שבין השלבים אריות כרובים ובקרים (אריות ובקרים בשורה עליונה, וכרובים למטה - ליות (חבוקים זה בזה) הכל דק ולא
בולט/שקוע; על המסגרות התחתונות וכן על הנסרים - אריות כרובים ודקלים; על הכתפות כרובים; על פי הכותרת פרחים / ה: המכונות נועדו גם
לקידוש ידים ורגלים של הכהנים / ו: הכותרת היתה מרובעת ובאמצעיתה נקב ברוחב אמה וחצי בעגול וסביב הנקב כמין מחיצה בגובה חצי אמה וברוחב
אמה וחצי ועליה היו ציורי הפרחים (וזה קרוי פי הכותרת) והכן מונח על ההיקף הנ"ל ושולי הכן תחובים גובהו של הכן הבולט היה אמה / באופנים
היה גלגל קטן וגלגל גדול, הקטן הסתובב לצדדים והגדול הלך קדימה ואחור - עיין בספר / כל כיור היה בגודל 40 בת (40 איפות = 880 ליטר) /
חשוב מאוד! המכונות היו כולן במקום אחד 5 מצד ימין (בין כותל ההיכל הימני לכותל העזרה הימני) ו-5 בשמאל על אותו הדרך / הים של שלמה היה
בקרן מזרחית צפונית מול השולחנות והטבעות שבבית שני (אגב למה לא הוספת אותם גם בבית ראשון? - תוסיף) / מזבח הזהב היה יותר קרוב לאולם מיד
אחרי השולחנות והמנורות / שלחן ומנורת משה היו בין 5 ל-5 (מנורות ושלחנות בהתאמה) / תוסיף לכל המנורות 3 מעלות כביאור הפס' בתצוה /
תוסיף את שיטת ר' יוסי בר' יהודה שהיו עוד 2 שולחנות אחד מכסף לשים עליו את לחם הפנים לפני עריכתו על השלחן ו-1 זהב לאחר הורדתו מן
השולחן - הוסף בכפתור נפרד כחלק משיטות נוספות / המנורות בצד דרום ומשוכות קצת יותר לצד קה"ק מהשלחנות ולכל מנורה בקנה היה פרח וכן
בקנה האמצעי למטה - עיין בספר / תוסיף את כל הגביעים הכפתורים והפרחים שהיו במשכן (פר' תצוה)".

**L.60 Malbim on "מעשה שושן" (I Kings 7:19) as an OPTION** — group heichal-door (50-heichal.js) + UI (an opinion row). Read Malbim
on 7:19 (and 7:22, 7:16-18 as needed) in the DB and build his reading of the capitals' lily-work as a second reading of Yachin and
Boaz's capitals, switchable like the other disputes (ctx.shared.<key> = {current: "rashi", keys: ["rashi", "malbim"], set}); the
default stays Rashi as built. Quote Malbim exactly in the row's text (for the UI).

**L.61 The frames between the rungs: three on each side (the Gra)** — group vessels (45-vessels.js). I Kings 7:28 "וזה מעשה המכונה
מסגרת להם ומסגרות בין השלבים"; 7:29 "ועל המסגרות אשר בין השלבים אריות בקר וכרובים ועל השלבים כן ממעל ומתחת לאריות ולבקר ליות מעשה
מורד"; Rashi 7:28 (the שלבים are like the rungs of a ladder - upright bronze rods standing on the base's edge, "כמין מקלות נחשת זקופין";
the מסגרות are the panels between them). The user: by the Gra's commentary (ביאור הגר"א - find it in the DB: the Gra on Kings or on
the Mishnah; if it is not in the library, say so and ask) there were THREE frames (panels) on each side of the base. Build each side of
the body with three panels between the rungs, and say in the report what a "מסגרת בין השלבים" is (the user asked to have it explained).

**L.62 The Sea's volume** — group vessels. The user: the Sea must hold 2,000 bat = 6,000 seah = 44,040 litres - "שלא יהיה קטן מדי".
I Kings 7:26 "אלפים בת יכיל"; 7:23 "עשר באמה משפתו עד שפתו... וחמש באמה קומתו"; Eruvin 14b (Rashi 7:23: the lower three amot square,
the upper two round - "שלש תחתונות מרבעות ושתים עליונות עגלות", 150 mikvaot). Check the model's basin against the verse and the
Gemara: 10 across, 5 high, the lower 3 amot a 10 x 10 square, the upper 2 round, the wall a tefach (7:26 "ועביו טפח"); compute its
capacity in amah³ and in litres (state the amah you use - 48 cm - and the bat) and show that it holds 2,000 bat; if the model's basin
is smaller than the verse's (or shallow, or without the square lower part), fix it. Likewise each laver holds 40 bat (7:38 "ארבעים
בת יכיל הכיור האחד"; the user: 40 bat = 880 litres): check the laver's bowl (now about 1.75 across, 4 deep) and size it so it holds
40 bat, as large as the base allows. Report the numbers to the user.

**L.63 The decorations of the bases** — group vessels. All drawn THIN and flat ("הכל דק ולא בולט/שקוע": texture lines, no relief):
on the frames between the rungs - lions and oxen in the upper row, cherubim below them, with ליות (wreaths, "חבוקים זה בזה",
intertwined) - 7:29; on the lower frames (the low frame, 7:28 "מסגרת להם") and on the boards (the ליות/"לחת", 7:36) - lions, cherubim
and palms (7:36 "ויפתח על הלחת ידתיה ועל מסגרתיה כרובים אריות ותמרת כמער איש וליות סביב"); on the shoulders (כתפות) - cherubim; on
the mouth of the capital (פי הכותרת) - flowers (7:31 "מקלעות", Rashi "צורת פרחים"). Compare with the book p17-p18.

**L.64 The bases also for the priests' washing of hands and feet** — group vessels + UI texts. Radak on 7:39: "והכיורים היו לרחוץ מהם
הכהנים ידיהם ורגליהם ולהדיח בהם מעשה העולה כמו שאומר בדברי הימים" (check the words in the DB; II Chr 4:6). The demonstration and the
pill's title / the texts say both purposes; if the demonstration can show a second station (a priest's washing place by the altar's
ramp) without clutter, add it; else the texts.

**L.65 The capital of the base, as the user describes it** — group vessels. Build it exactly so: the כותרת is SQUARE (the base's
roof); in its middle a ROUND hole 1.5 amot across; around the hole a rim like a low partition, 0.5 high and 1.5 wide (that is "פי
הכותרת"), carrying the flower drawings; the כן (the laver's stand) rests on that rim with its bottom inserted into the hole; the כן
protrudes 1 amah above it. Sources: I Kings 7:31 "ופיהו מבית לכתרת ומעלה באמה ופיה עגל מעשה כן אמה וחצי האמה וגם על פיה מקלעות
ומסגרתיהם מרבעות לא עגלות" with Rashi (the earlier build quotes him: "ושולי הכן תחובין... ולמעלה הימנו הוא בולט אמה"), Radak,
Metzudat David; the book p17-p19. Mark what is a model choice.

**L.66 The wheels** — group vessels. The user: "באופנים היה גלגל קטן וגלגל גדול, הקטן הסתובב לצדדים והגדול הלך קדימה ואחור - עיין
בספר". Check the K.3 build against this and the book (p19L): the small (lying) wheel turns sideways to steer, the big (standing)
wheel rolls forward and back; the demonstration must show exactly that; fix anything that differs.

**L.67 THE BASES' PLACE ("חשוב מאוד!")** — group vessels (+ UI texts, fly points). All ten bases stand in one place: FIVE on the
right (south), in the strip between the house's south wall and the court's south wall, and FIVE on the left (north), in the strip
between the house's north wall and the court's north wall - not in two rows before the ulam as now. I Kings 7:39 "ויתן את המכנות חמש
על כתף הבית מימין וחמש על כתף הבית משמאלו"; Rashi "על כתף הבית - כנגד כתף הבית הימנית"; Ralbag (q16.out) "הרצון בבית ההיכל ובמה שבין
הכותל הדרומי וכותל העזרה שם ה' כיורות והה' הנשארים שם במה שבין הכותל הצפוני מן ההיכל וכותל העזרה"; Radak "מימין הבית וכן משמאלו
משמאל הבית". Place each row of five along the house (x along the kodesh, the row's exact x and its distance from the house wall - a
model choice; keep clear of the yatzia, the court walls, the north / south gates and their stairs, לשכת הגזית on the north wall (x
about 48..68) and the Sea in the north-east corner), Moses' laver stays before the ulam. Rebuild the demonstration's route from the new
home (the north row) to the altar's north side and back; update every fly point (mechonot, mechonaClose, mechonaParts, mechonaDemo),
the labels, the pills' anchors, ctx.shared.mechona.home, and ctx.CO (mechX / mechZ in 10-core.js - ONLY those two) if other modules
read them (grep). Report the final coordinates.

**L.68 The rings and the tables of the slaughter place (בית המטבחים), north of the altar** — group courts-2 (30-courts.js; read
...\L-reports\courts.md first - the courts builder's finished work on לשכת הגזית - and keep clear of it, of the Sea in the north-east
corner at x 80 z -54, of the altar x 39.5..59.5 z ±10 and its ramp, and of the new north row of bases). The user: the Sea stood in the
north-east corner "מול השולחנות והטבעות שבבית שני" - and "למה לא הוספת אותם גם בבית ראשון? - תוסיף": add, north of the altar, the
slaughter place of the Second Temple as a model choice for the First Temple ("השלמות"): the 24 rings in six rows of four (Middot 3:5
"וטבעות היו לצפונו של מזבח, ששה סדרים של ארבע ארבע"; Middot 5:2; Tamid 4:1 "הרביעי" and Yoma 62b - check), the eight marble tables
(Shekalim 6:4 "שמונה שלחנות של שיש... שעליהן מדיחין את הקרבים"; Middot 3:5), and the eight short pillars with the cedar beams and the
iron hooks for flaying (Middot 3:5 "ושמונה עמודים ננסין, ורביעין של ארז על גביהן, ואונקליות של ברזל היו קבועין בהם, ושלשה סדרים היה
לכל אחד ואחד, שבהן תולין ומפשיטין"), with the dimensions of Middot 5:2 (the rings' place 24 amot north of the altar: "מן המזבח
ולטבעות עשרים וארבע... מן הטבעות ולשלחנות ארבע, מן השלחנות ולננסין ארבע") - check all these quotes in the DB. Labels, a place and
fly point (slaughterPlace), the sources in the file header.

**L.69 The golden altar's place** — group interior. The user decided: "מזבח הזהב היה יותר קרוב לאולם מיד אחרי השולחנות והמנורות" -
the altar stands nearer the ulam (east), immediately east of the rows of the tables and the menorot, on the house's axis (the Mishkan:
Ex 30:6 "לפני הפרכת"; Yoma 33b "מזבח ממוצע ועומד באמצע ומשוך כלפי חוץ קימעא"; Rambam Beit HaBechira 3:17 "משוך בין השלחן והמנורה
לחוץ" - quote them, and state that where the ten tables and menorot stand the altar comes right after them toward the entrance - the
user's decision). Both layouts; re-aim the fly points, the smoke, the layers pill.

**L.70 Moses' table and menorah between 5 and 5** — group interior. The user: "שלחן ומנורת משה היו בין 5 ל-5": Moses' table in the
middle of the row of ten tables (five east of it, five west), Moses' menorah in the middle of the row of ten menorot. Source: Menachot
98b-99a (the arrangement "חמשה מימין... וחמשה משמאל... ושל משה באמצע" - find and quote the exact words; the tables along the house per
Rabbi, across per R. Elazar b. R. Shimon - keep the two layouts, each with Moses' in the middle).

**L.71 Three steps before every menorah** — group interior. The user: "תוסיף לכל המנורות 3 מעלות כביאור הפס' בתצוה". Mishnah Tamid
3:9 "ואבן היתה לפני המנורה ובה שלש מעלות שעליה הכהן עומד ומטיב את הנרות" (check), and the commentary on the verse in Tetzaveh (Ex
27:20-21 / 30:7-8 "בהיטיבו את הנרת" - Rashi or another: find the one that mentions the steps and quote it). Build a stone with three
steps before each of the eleven menorot (the side the priest stands on: east / toward the entrance - a model choice unless a source
says), sized to the menorah (the Mishkan's menorah is 3 amot high per Menachot 28b "גובהה של מנורה שמונה עשר טפחים" - check).

**L.72 R. Yose b. R. Yehuda's two tables in the ulam** — group heichal-door (50-heichal.js, the ulam's interior) + UI (a separate
opinion row "שיטות נוספות"). The user: "תוסיף את שיטת ר' יוסי בר' יהודה שהיו עוד 2 שולחנות אחד מכסף לשים עליו את לחם הפנים לפני
עריכתו על השלחן ו-1 זהב לאחר הורדתו מן השולחן - הוסף בכפתור נפרד". Mishnah Shekalim 6:4 / Menachot 11:7 "שני שלחנות היו באולם מבפנים
על פתח הבית, אחד של שיש ואחד של זהב; על של שיש נותנין לחם הפנים בכניסתו, ועל של זהב ביציאתו" and the baraita with R. Yose b. R. Yehuda
in Menachot 99b (silver instead of marble?) - find the exact words; build the two tables inside the ulam by the house's doorway, hidden
by default, shown by the switch (ctx.shared.ulamTables = {current: "none", keys: ["none", "ryby"], set}); one is silver (a new material
clone), one gold; both the size of the showbread table (2 x 1 x 1.5). Rambam Beit HaBechira 3:16 mentions them too - quote.

**L.73 The menorot: south, pulled toward the devir; the flowers; all the cups, knobs and flowers** — group interior. (a) The ten
menorot stand on the south side and are pulled a little more toward the Holy of Holies (west) than the tables ("המנורות בצד דרום
ומשוכות קצת יותר לצד קה"ק מהשלחנות") - find the source (Yoma 33b; Menachot 98b; the Rambam; the book) and quote it, else mark the
offset as the user's decision; (b) each menorah has the flower on its stem ("בקנה היה פרח") and the flower on the middle stem BELOW
("וכן בקנה האמצעי למטה") - as the book draws it (look at the book's menorah pages) and per Rashi on Ex 25:31-34 (the lowest flower on
the central shaft, Menachot 28b "שלשה פרחים... ופרח למטה"); (c) build on EVERY menorah all the Mishkan menorah's cups, knobs and
flowers: Ex 25:31-36 (22 cups, 11 knobs, 9 flowers - Menachot 28b "גביעים עשרים ושנים, כפתורים אחד עשר, פרחים תשעה"), the cups
"משוקדים", the knobs "כמין תפוחי כרתים", three cups on each of the six branches with a knob and a flower, four cups on the central
shaft with its knobs and flowers, a knob under each pair of branches (Rashi 25:31-35) - quote Rashi; the seven lamps on top. Keep the
menorah 3 amot high and its draw calls low (one instanced geometry for all eleven).

**L.74 Moses' laver among the bases** — group vessels-2. The user (31.10, 23:20, verbatim): "גם כיור משה בין המכונות". Moses' laver
does NOT stay before the ulam: it stands among the bases. Radak on 7:39 reads the verse as right and left of Moses' laver ("או יהיה
פירוש מימין כיור שעשה משה ומשמאלו"). Model choice until the user says otherwise: put it in the SOUTH row (the right side, "ימין"),
in the middle of that row, with bases on both sides of it, at the same distance from the house wall as the bases; keep its label,
fly point and the texts ("כיור משה"; Ex 30:18; II Chr 4:6 with Rashi) in step; say in the report exactly where it stands and that the
alternative (the north row, or the axis) is one line to change.

**L.75 The Sea's place — "עד היום הים לא היה במקומו הנכון - בדוק שוב"** — group vessels-2. The user has not yet seen the round-L
build (plugin/bundle.js still holds the round-K Sea at x 34, z -40). Re-check the new place against the words: Rashi on I Kings 7:39
"מקצוע מזרחית צפונית, כנגד האויר שבין כתל צפוני של בית לצד כתל העזרה" (the north-east corner, in line with the open strip between
the house's north wall, z -27, and the court's north wall, z -65), and the user's "בקרן מזרחית צפונית מול השולחנות והטבעות" (opposite
the slaughter place, which courts-2 builds north of the altar at Middot 5:2's distances - its rings about z -34, tables -38, pillars
-42, directly north of the altar x 39.5..59.5): the Sea stands EAST of the slaughter place, in the corner, its z within the strip and
roughly opposite the tables and rings; also the book p20. Adjust x / z if needed (keep the 1-amah clearance from לשכת הגזית and the
walk-round space), give the final coordinates with a picture from above showing the Sea, the slaughter place, the altar and the
chamber together, and the same for the second reading (south-east).

**L.76 CORRECTION of L.67 and L.74 (the user, 31.10 23:40, verbatim: "הכיור בין שתי השורות! של המכונות (היינו בין ה-5 ל-5)").** The
ten bases stand in ONE LINE ACROSS the court (north-south), east of the house before the ulam - not along the house's sides: five on
the south, spaced evenly from the line of the house's south wall (z 27) to the court's south wall (z 65), five on the north likewise;
Moses' laver on the house's axis (z 0) in the same line, between the two groups of five (Radak on 7:39 "מימין כיור שעשה משה
ומשמאלו"; Rashi "כנגד כתף הבית הימנית"; the user: "5 מצד ימין (בין כותל ההיכל הימני לכותל העזרה הימני) ו-5 בשמאל"). The line's x is
a model choice (x 27 as now, east of the ulam steps, unless a clearance forces otherwise). The demonstration's home is a base of the
north group. courts-2 keeps the slaughter place east of x 31. Group: vessels-2 (+ UI texts and fly points).


**L.77 FINAL layout of the bases and Moses' laver (the user, 31.10 23:55: "עיין בספר - כיונתי אותך לתמונה הרצויה" = the book's page לח,
SCR\user-docs\pdf\zoom\p20R.png; replaces L.67, L.74 and L.76).** The book draws all ten bases in ONE block of two rows of five,
with Moses' laver in the middle between the rows ("חמש מכונות מימין הכיור של משה רבינו", "חמש מכונות משמאל הכיור של משה רבינו";
caption: "חמשה מימין הכיור של משה וחמשה משמאלו (ברייתא דמלאכת המשכן יב א; עזרת כהנים מדות פ"ג מ"ו)" - verify in the DB), in the
strip beside the house (the house's wall on one side, the court's wall with its gates behind, the altar's corner in front). Model: the
SOUTH strip between the ulam's south wing (z 42) / the house's south wall (z 27) and the court's south wall (z 65), at the strip's east
end near the altar - about x 2..26, z 44..61; nothing before the ulam or in the north strip. Group: vessels-2 (+ UI texts, fly points).


**L.78 The king's ascent to the throne — an animation with its own button (the user, 1.11.2026 00:40, verbatim: "בכסא - תן כפתור
מצגת מיוחד המציג את עליית המלך (ללא המלך עצמו) לכסא וכך עולים ע"י גלגלי שניים האריות והנשרים לקראתו (כמתואר במדרש) והינה בסוף כולל
הבאת ס"ת לתוך חיקו").** Group: palace (60-palace.js; after the palace verifier has finished - the palace builder is resumed for this) +
UI (a tour slide, the texts). Build on the throne of L.57: an on-model pill on the throne ("הצג את עליית המלך לכסא" / "עצור את
העלייה") that plays the ascent WITHOUT a figure of the king: the climber's position is shown only by what the throne does. For each of
the six steps in turn (about 3 s a step): the cog-wheel mechanism of that step turns (visible golden toothed wheels at the steps' sides,
"חוזר הגלגל בתוך המנגנון" - Midrash Abba Gorion 1 and Panim Acherim נוסח ב, in the DB; quote exactly), and the lion of that step
stretches its paw and the eagle its wing toward the climber - alternating sides step by step: "והארי פושט את ידו של ימין, והנשר גפו של
שמאל... והנשר פושט גפו של ימין, והארי ידו של שמאל" (Abba Gorion; Esther Rabbah 1:12 "עלה במעלה הראשונה והארי פושט לו יד, ובשניה נשר
פושט לו יד"); when the climber reaches the seat, the dove on the sceptre (Esther Rabbah / Bamidbar Rabbah 12:17: the crown "נוגע ואינו
נוגע") comes down, takes the Torah scroll from the ark beside the throne and brings it into the king's lap ("לתוך חיקו" - find the exact
midrash words for the dove bringing the scroll: Panim Acherim / Abba Gorion / "ענין כסא שלמה" - the palace report notes "היונה הפותחת
את הארון"), i.e. lays it on the seat; then everything returns to rest. Needs: the step figures' paws / wings as separately pivoted parts
(keep the merged static bodies; add the moving parts), the cog-wheels, a small golden ark with a scroll beside the seat (Esther Rabbah /
the midrash on the ark - quote), the dove's flight path, a soft highlight on the active step. Contract: ctx.shared.throne.ascent =
{start(), stop(), reset(), seek(sec), running, duration}; the pill's set(true) starts it and flies the camera to throneSteps through
ctx.ui.fly when present; set(false) resets; no per-frame allocation (the timeline evaluated in one ctx.animated hook); it is a feature
(not a removal): the UI's 15-second rule does not apply to a pill, and the presentation's verse slide for I Kings 10:18-20 plays it
(the UI group adds the slide and the place "עליית המלך לכסא", and restores it after the slide). Pictures of four moments; the midrash
words in the pill's title and in palaceNotes.throneAscent for the UI.


**L.79 Solomon's throne — more from Targum Sheni (the user, 1.11.2026: "הוסף זאת לכסא שלמה, השתמש במקור כדי להוסיף ידע"; he sent a
page of the Hebrew translation of תרגום שני, Esther 1:2, printed תרצ"ח, SCR\..\images\3.webp).** Group: palace (texts + the ascent
animation of L.78) + UI (the texts). The passage, in the translation's words (quote the ARAMAIC of תרגום שני from the Otzaria DB -
"תרגום שני" on Esther 1:2 - exactly, and give the user's translation beside it): "מימינו ומשמאלו לשפט את העם, והיה אם באו עדי שקר לענות
שקר באחיהם, היו גלגלי המנגנון מתגלגלים ומסתובבים, השורים היו גועים, האריות היו נוהמים, הזאבים היו מיללים, הכבשים פעו, הנמרים נהמו,
הגמלים נאנקו, החתולים נהגו, ויבבו התכים וקראו התרנגולים ושרקו הנצים וצפצפו הצפרים - והיה קול רעש ושאון והמיה ושאגה ויללה. אז תהיה
חתת אלהים על העדים ואמרו בלבבם: נרחיקה-נא מדבר שקר, פן נאבד ונכחד מעל פני הארץ. ובעלות המלך שלמה לשבת על כסא מלכותו, אשר כמוהו לא
נעשה בכל הממלכות, היו האריות מזלפים לפניו כל מיני בשמים וימלא ריחם הטוב את מלא כל אולם הכסא." Add to the throne: (a) in the texts
(palaceNotes.throne / throneAscent): the elders on the king's right and left judging the people; the false witnesses - the mechanism's
wheels turn and all the creatures cry out, and the witnesses fear and retreat from false testimony; the lions sprinkling spices before
the king as he goes up, filling the hall with scent; (b) in the ascent animation (L.78): when the climber sits, the lions at the arms
sprinkle a fine mist of spice (a short golden spray / particles, no per-frame allocation) - "היו האריות מזלפים לפניו כל מיני בשמים";
and a SECOND short scene selectable from the same pill's menu or as a second pill "עדי שקר" (model choice: one pill with two scenes if
the registry allows a title per state, else two pills): the wheels turn and all the creatures of the steps move (heads lift, wings
flap, mouths open) for a few seconds - "קול רעש ושאון" shown visually; (c) the hollow lions with spices (Abba Gorion) may now be built
as these sprinkling lions. Everything marked "על פי תרגום שני".

**L.80 A "bubble" in the presentation: the Benayahu on the mechanism (the user, verbatim: "זהו מקור לכאו' לכך שהכל פעל עפ"י חשמל -
ציין זאת כבועה בתוך המצגת").** Group: UI (75-tour.js: the throne slide of I Kings 10:18-20 and the topics-mode slide of the throne;
70-ui.js: the place "כסא שלמה" / "עליית המלך לכסא" info). The user's source: ספר בניהו בן יהוידע (the Ben Ish Chai) on Sanhedrin
106b: "אך נראה כי מה שנמצא בזמן הזה מגדל פורח באויר שקורין (מרכב אל הוו"א) העשוי ומתוקן ע"פ חכמה נפלאה, אע"פ שזה נתחדש מכמה שנים, הנה
בודאי היה מצוי ביד הראשונים קודם זמן דואג ואחתופל וגם אחריהם, ואפשר שהיה ג"כ בדורות התנאים אלא שאח"כ נשתכחה חכמה של המגדל הזה
וחזר ונתחדש ע"י חכמי אירופא..." (check whether "בניהו בן יהוידע" is in the Otzaria DB and quote it from there; else quote the user's
text and say so). Show it as a callout bubble in the banner on the throne / ascent slides (a visually distinct box, "בועה"), worded as
the USER's inference, e.g.: "הערה: בניהו בן יהוידע (סנהדרין קו:) כותב שחכמות נפלאות כ'מגדל הפורח באויר' היו מצויות בידי הראשונים
ונשתכחו — ולכאורה מכאן שגם מנגנון הכסא פעל בכוח נסתר כעין חשמל", with the quote and a deep link to Sanhedrin 106b (book 125; find the
page's line) and to the Benayahu if in the library.


**L.81 Solomon's throne — a button for every differing midrashic version, and an ascent presentation for each (the user, 1.11.2026
01:15, verbatim: "פה יש את כל המדרשים על כסא שלמה, צור כפתור לכל דעה סותרת וכן מצגת לכל אחד מהם").** Group: palace (60-palace.js) +
UI (opinion rows + tour slides). The user's collection of the midrashim is SCR\throne2\midrashim.txt (without nikud; midrashim-nikud.txt
with it): Esther Rabbah 1:12, Midrash Panim Acherim נוסח ב, "בית המדרש ב" (Jellinek's Beit HaMidrash, part II - the fuller text is in
SCR\throne2\bm2-p1.txt..bm2-p3.txt and the page images bm2-p1..3.png, from the user's PDF "כסא שלמה בית המדרש ב"), Targum Sheni on
Esther 1:2 in a Hebrew translation, and the Ben Yehoyada (L.80). Quote each from the Otzaria DB where it is there (תרגום שני 3237 /
7421 in Aramaic; אסתר רבה; פנים אחרים; "ענין כסא שלמה" / "דמות כסא שלמה" in ילקוט מדרשים = the Beit HaMidrash texts; בן יהוידע על
סנהדרין 2546), else from the user's file (say so). This subsumes L.78 and L.79: build ONE throne switch
`ctx.shared.throneVersion = { current: "pesukim", keys: ["pesukim", "targumSheni", "estherRabbah", "beitHamidrash"], names: {...}, set(key) }`
whose readings share the base of L.57 (the body, six steps, the 12 lions six a side, the two lions at the arms, the arms, the round
top, the ramp of II Chr 9:18) and differ in what the midrash adds:
- **"pesukim" (default):** the verses with Rashi, Radak, Metzudat David, Ralbag, Malbim and Targum Jonathan only - no midrashic figures
  (the current L.57 extras move out of this reading).
- **"targumSheni":** 12 golden EAGLES facing the 12 lions ("אריה מול נשר ונשר מול אריה", the lion's right paw toward the eagle's left
  wing); on each step a lying pair: 1 ox / lion, 2 wolf / lamb, 3 leopard / kid, 4 eagle / peacock, 5 cat / rooster, 6 eagle / bird; on
  the top a golden dove holding a hawk; a golden MENORAH rising from the throne's head with seven branches on one side (the seven fathers
  of the world) and seven on the other (the seven pious), its oil bowl, the two golden sheaves; two seats for the High Priest and his
  deputy; seventy golden seats for the Sanhedrin at the throne's head; twenty-four golden vines shading the king; the silver dragon in
  the mechanism; the "בנות ים" by his ears - text only. ASCENT: the ox of the first step lifts the climber to the second, and so on to
  the sixth; the eagles come down, seize him and seat him on the top; the great eagle takes the crown and sets it on his head; the
  dragon roars in the mechanism; the lions and eagles rise and shade his head; the golden dove comes down from the pillar, opens the ark
  and gives the Torah scroll into his hands; the lions sprinkle spices; and the WITNESSES scene (L.79).
- **"estherRabbah" (= Esther Rabbah 1:12 + Panim Acherim נוסח ב + Abba Gorion, which agree):** at each step the lion stretches a paw and
  the eagle a wing, alternating sides; the golden SCEPTRE behind the seat with the dove on it and the crown in its beak, "נוגע ואינו
  נוגע"; two golden vines at the sides shading the pillars' heads; two hollow golden lions full of spices that trickle as he goes up;
  the seats of the High Priest and the deputy and the seventy; the steps paved with precious stones. ASCENT: per step the paw / wing
  alternately ("ארי פושט ידו והנשר גפו של שמאל... נשר פורס גפו של ימין וארי ידו של שמאל"); on the top the eagles spread their wings over
  his head; the golden dove comes down from the pillar in the mechanism, opens the ark, takes the scroll and gives it into the king's
  hand ("והיתה עמו וקרא בו כל ימי חייו"); the witnesses scene (Panim Acherim: "מנגנאות פוקעין, גלגלין חוזרין, אריות נוהמין, נשרין
  פורחין, טווסין רצין").
- **"beitHamidrash":** the 12 lions hold inscribed tablets with the verses of justice ("לא תכירו פנים במשפט", "לא תקח שוחד", "ודל לא
  תהדר בריבו"...) which the king reads before each step; the steps paved with precious stones, crocus-coloured stones and clear glass;
  palm trees decorating the throne, draped in white linen, with ivory peacocks facing the eagles' wings; two marble pillars standing on
  the lions' heads; two golden spice vessels at the sides; two seats for Gad the seer and Nathan the prophet; seventy seats for the
  elders, each with two lions and two eagles facing each other; the pairs on the steps: 1 ox / lion, 2 wolf / lamb, 3 leopard / kid,
  4 bear / deer, 5 eagle / bird; the ark between the pillars. ASCENT: the king reads the lions' tablets; per step the wheel turns, the
  lion's paw / the eagle's wing alternately; at the top the silver dragon loads the throne's wheel, bends him and seats him; the eagles
  rise and shade his head; the golden dove between the pillars opens the ark and lays the Torah scroll on his knees; the LEFT lion takes
  the crown and sets it on his head; the attendants say "תקום מלכות בית דוד לעולם"; at each step he reads a verse of Psalm 19 ("תורת ה'
  תמימה"...; show the verse as a caption in the presentation); the witnesses scene (wheels turn, lions roar, eagles fly, peacocks chirp).
Contracts: set(key) shows that version's figure groups and hides the others, re-aims flyPoints.throne / throneSteps if needed, and
resets any running ascent; `ctx.shared.throne.ascent = {start(version?), stop(), reset(), seek(sec), running, duration, version}` plays
the CURRENT version's script (L.78's pill "הצג את עליית המלך לכסא" plays it; in "pesukim" the pill is hidden or plays a plain climb with
the lions only - say which); `ctx.shared.throne.witnesses = {start, stop, reset}` (L.79) for the three midrashic versions; captions per
moment in `ctx.shared.throne.script[version]` = [{t, text}] so the UI / tour can show the midrash's words as each thing happens; no
per-frame allocation; everything "על פי" its source; the hall must hold the seventy seats of every version (one instanced set reused).
Pictures: each version at rest and four moments of its ascent. The UI: an opinion row "כסא שלמה — לפי איזה מדרש" with the four options
(the midrash's own words in each), the places "כסא שלמה" / "עליית המלך לכסא", and in the presentation (topics mode) one slide per
version playing its ascent with the captions, then the witnesses scene; the Ben Yehoyada bubble (L.80) on them.


## Groups and file ownership (each group edits ONLY its files)
- **vessels-heichal:** 45-vessels.js, 50-heichal.js, and in 10-core.js ONLY the CO line with seaX / seaZ / seaZRashi — L.6, L.7, L.8, L.9, L.10.
- **interior:** 55-interior.js — L.11, L.13, L.14, L.17, L.30, L.31, L.32, L.35.
- **palace-courts:** 60-palace.js, 30-courts.js — L.20, L.22, L.33 (L.21 deferred, see above), the palace leftovers.
- **ui-tour:** 70-ui.js, 75-tour.js (90-entry.js only if needed) — runs AFTER the three groups above, with their reports: L.27; every
  text, place, view text, opinion row (the forest house gets its third option with Metzudat David's words; the Sea's row text with the
  sources of L.7), "השלמות" entry, LABEL_MAP entry and tour text that the changes affect (the Sea in the corner, the pillars, the taps,
  no spouts, the tables, the altar of one amah, the layers window, the carvings, the forest house's three readings, לשכת הגזית in the
  north per Yoma 19a, the garden without a pool); the UI's CO / pillar fallbacks; the follow-ups above. Re-run all views, places, opinion
  buttons and the three tour modes headless: no NaN, no automatic removal, clear rays, no console errors.

Shared rules (FIXES-1.0.1-K §0): a source comment for every dimension or "model choice"; no automatic removals; options default off;
one gold recipe; no per-frame allocations; fly points with clear rays and the house closed; Rashi first; never Ezekiel. Work safely in
parallel: build your own bundle (`node tools/assemble.mjs <your folder>\bundle.js`, run from ROOT), never write plugin/bundle.js, do
not use ports 8765/8766 or the Browser pane, use your own server on a port above 18000 and stop it, delete temporary Chrome profiles.
Mark each change with a short "1.0.1-L: ..." comment where a reader needs the reason, and add a line to your files' header comments.
