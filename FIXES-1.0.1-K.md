# Fix round 1.0.1, part K — the user's fourth and fifth lists (28.10.2026)

ROOT = C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1
SCR  = C:\Users\x1\AppData\Local\Temp\claude\C--Users-x1-AppData-Roaming-Claude-scratch-workspaces-6cc20f1e-776f-4297-b95a-bf0558e72515-48a5e90a-221b-4185-bd62-4df70efb9058-scratch-2026-10-26-9aa69f\5cde0745-88eb-454f-928a-5b900122f33d\scratchpad
TR   = C:\Users\x1\.claude\projects\C--Users-x1-AppData-Roaming-Claude-scratch-workspaces-6cc20f1e-776f-4297-b95a-bf0558e72515-48a5e90a-221b-4185-bd62-4df70efb9058-scratch-2026-10-26-9aa69f\5cde0745-88eb-454f-928a-5b900122f33d\tool-results\b68x6v3fx.txt
       (the last review's findings: sources Q2-1..7 and UI-H2-1..9 lines 78-171, controls-pointer lines 172-211, texture H2-CARVE-1..7 lines 212-267)
WF   = C:\Users\x1\.claude\projects\C--Users-x1-AppData-Roaming-Claude-scratch-workspaces-6cc20f1e-776f-4297-b95a-bf0558e72515-48a5e90a-221b-4185-bd62-4df70efb9058-scratch-2026-10-26-9aa69f\5cde0745-88eb-454f-928a-5b900122f33d\subagents\workflows

THE BOOK (the user's visual reference, "מקרא מפורש — איורי בית המקדש הראשון"; it follows Rashi): SCR\user-docs\pdf\illustrations.pdf
(27 pages), full spreads SCR\user-docs\pdf\pages\p01.png..p27.png, half pages SCR\user-docs\pdf\zoom\p04L.png..p20R.png, and crops made
today in the same zoom folder: p01_rashi_general.png + p01_tower.png (the GENERAL VIEW of the house per Rashi), p04L_section.png (the yatzia
section with its measures), p06_layers.png (the wall and floor layers), p09_parochet.png, p21L_table.png. More crops: `python -I` with
`import pymupdf` (doc[i].get_pixmap(matrix=pymupdf.Matrix(z,z), clip=pymupdf.Rect(...))). They are images: look at them with the Read tool.
Page map: p01 general views (Rashi top, Rambam bottom); p02 the courts' plan; p03 heights of the house and the aliyot; p04R ulam, windows,
the chambers' plan (5 per long side, 3 on the west); p04L the yatzia section per Rashi; p05R the chambers with their OUTER WALLS REMOVED;
p05L the chambers' entrance seen from outside (walls closed); p06R the roof (גבים, בית דילפא, שדרות ארזים); p06L the wall and floor layers;
p07L cherubim; p07R incense altar; p08L/p08R carvings; p09R devir doorway (two Rashi readings) + parochet; p10-p12 the forest house (p12R
its interior with shields and vessels; p12L the throne hall's cedar floor); p13R general view of Solomon's houses; p14-p15 Yachin and Boaz;
p16 the Sea; p17-p19 the bases; p20 placement of the bases and of the Sea; p21R bronze vessels; p21L the table.

SOURCES fetched from the Otzaria library (verses + Targum, Rashi, Radak, Metzudot, Ralbag, Malbim): SCR\src-hiram.txt (7:13-51, bronze),
SCR\src-cherub.txt, SCR\src-carve.txt, SCR\src-devir.txt, SCR\src-palace.txt, SCR\src-yatzia.txt (6:5-10), SCR\src-K.txt (6:15-22,
6:29-30, 7:48, II Chr 3:14, Ex 26:1/31, Ex 30:1-3, II Kings 11:14, 23:3, II Chr 23:13, Yoma 19a/25a/72b, Middot 5:4, Tamid),
SCR\src-table.txt (Ex 25:23-30 + Rashi, II Chr 4:8, Mishnah Menachot 11, Menachot 94b-97a), SCR\kings-verses.json (I Kings 6:1-38,
7:1-51, 8:1-11, 8:62-66, pointed). The DB: C:\Users\x1\AppData\Roaming\otzaria\books\seforim.db (node:sqlite + the zstd dictionary;
example scripts SCR\q9.mjs..q13.mjs; strip nikud before matching; run node from C:\Users\x1 — the long cwd breaks node).

## The user's words (Hebrew, verbatim; the meaning after the dash)
1. "לא חיפית את היציעים מצד החיצוני של הבית - הוסף כפתור להסרה ולא הסרה אוט'" — cover the yatzia on the outside; a removal button,
   never an automatic removal.
2. "היציעים כברירת מחדל לא מוצגים כשטית רש"י והחישוב של 7, 6 ו 5 עם הקורות המשמשות לתקרה" — by default the yatzia must show Rashi's
   calculation (7, 6, 5) with the beams that serve as the ceilings.
3. "האולם לא נח להצגה צריך הצגתו צריכה להיות כברירת מחדל מלמעלה ורק עם הסיבוב להוריד" — show the ulam from above by default; the user
   lowers the view by rotating.
4. "כברירת מחדל ההיכל צריך להיות סגור מכל צדדיו ורק עם כפתור להסרה" — the house is closed on all sides by default; it opens only by a button.
5. "כשאני מתכוון כפתור להסרה - הכפתור צריך להיות על המיצג ולא בתוכן הענינים (כרעיון קה"ק והענן)" — removal buttons sit ON THE MODEL
   (like the cloud button over the devir), not in the side panel.
6. "תנסה לעשות את איורי ההיכל וקה"ק יותר מדויקים" — more accurate carvings in the heichal and the devir.
7. "רצפת העזרה צריכה להיות ברוש מצופה זהב" — the floor: cypress overlaid with gold. The verses speak of the HOUSE floor (6:15 "ויצף את
   קרקע הבית בצלעות ברושים"; 6:30 "ואת קרקע הבית צפה זהב לפנימה ולחיצון", Rashi "לבית הכפרת ולהיכל"): build that; the integrator asks
   the user about the court.
8. "הוסף אופצי להצגה של כל השכבות של ההיכל (אבן עץ ארז, וזהב) וכן במזבח הקטורת שמשום מה שכחת בכלל לעשות אותו - אם יש לך שאלה כתוב לי" —
   an option to show the layers of the heichal (stone, cedar, gold) and of the incense altar (which "was forgotten").
9. "על הפרוכת איור נשרים מצד ההיכל ואריות מצד קה"ק" — the parochet: eagles on the heichal side, lions on the devir side.
10. "והעב על פניהם צריך דיוק" — 7:6 "ועמדים ועב על פניהם" needs precision.
11. "למה יש את השער המזרחי כתקריב גם בבית וגם בהר הבית - תשאיר רק בהר הבית"; today: "במבט כללי כפתור הר הבית ושער המזרחי מיותרים הם
    נמצאים כבר בהר הבית" — remove the "הר הבית" and "השער המזרחי" buttons from the views grid (they stay as places under "הר הבית").
12. "באר מהו העמוד שהוספת" — explain "העמוד".
13. "כפתור שולחן משה מוביל בכלל להצגת האיורים" — the "שולחן משה" button flies to the carvings.
14. "מזבח הזהב (הקטורת) אינו מוצג אצלך כזהב".
15. "את הכרובים עשית בצורה לא צנועה, והכנפיים מאוזן ולא לרוחב / לא מבואר שהיו להם ידיים, אגב תסתכל על האיור ממקרא מפורש" — the
    cherubim: immodest; the wings horizontal instead of across; no source for hands; follow the book.
16. "בית המלך ריק מדי תפאר אותו סתם" — the king's house is too empty: embellish it.
17. "בריחוף על כפתורי המצפן צריך להיות הסבר מה הם עושים" — hover explanations on the compass and the nav buttons.
18. "אם בנית את המצגת מחדש פשוט צריך להזיז את באנר ההסבר מאמצע העמוד"; "את באנר המצגת תעשה יותר מאורך ולא מלבן מאוזן" — the
    presentation's banner out of the middle, and TALL rather than a horizontal rectangle.
19. Yossi (co-author; the user: do it): "לשכת הגזית; שהחומות יהיו שקופות לא לגמרי, שיאחזו שיש חומה. להוסיף כפתור טשטוש וחסימת חומות.
    וכן להוסיף כפתור להגדיל את המרחק של הטשטוש."
20. "תוסיף אופציה להגדלת זום או להקטנה באמצעות שתי אצבעות על עכבר על לפטופ" — two-finger zoom on a laptop touchpad.
21. "שפר מהירות טעינה של עלית התוסף" — a faster load.
22. "כל צבעי קירות ההיכל הדלתות ובקיצור כל מה שצריך להיות זהב יותר דומה לחום ולא לזהב תקן זאת" — gold looks brown (see 0.4).
23. Today: "כדי לראות איך נראים היציעים המחופים אתה צריך לחפש את מבט הכללי של הבית ולא להשתמש בתמונה של היציעים כשהקירות מוסרים" — the
    covered yatzia look like the book's GENERAL VIEW, not like p05R (walls removed).
24. Today: "שלחנות, חייבים תיקון משמעותי" — the tables need a significant fix (now they look like chairs).
25. Still open from part J (read ROOT\FIXES-1.0.1-J.md; it is part of this round): Yachin and Boaz per the book; the oxen's heads; the
    bases and their operation.

## 0. Shared rules for every track
0.1 FILES. Each track edits ONLY its own files (named in its section). 10-core.js is shared: K.2 may edit the house/yatzia constants in CO,
    K.3 only CO.seaX, K.9a only the texture section (draw functions, makeTex, TEX). Re-read 10-core.js right before every edit and touch
    only your lines. Nobody edits another track's module; use the contracts in 0.5 and say in your report what you need from others.
    Module-level names carry your module's prefix (hei_, vsl_, int_, pal_, crt_, tour_, ui_) — tools/check.mjs flags collisions.
0.2 CONVENTIONS (SPEC.md §1-2, plugin\DEV_NOTES.md): a source comment on every dimension; "model choice" where there is none; the book is
    cited as "the book (the user's reference)" — the basis of a model choice, never a halachic source; Rashi first; Ezekiel is NOT a
    source (the user rejected it). 1 unit = 1 amah, +x east, +z south, y up; court floor LV.AZ 6, house floor LV.HEI 12. Helpers (10-core):
    H.box(parent,w,h,d,mat,x,y,z) (y = bottom), H.cyl, H.lathe, H.ring, H.wall, H.occ, H.uvWorldBox, makeTex/worldTex/std, goldStd, M.*.
0.3 TESTING. Do NOT use the Browser pane (it is the integrator's) and NOT ports 8765/8766. Numbers and overlaps: headless node harnesses
    (DOM stub; concatenate 00-lib + 10-core + your module; examples SCR\run-heichal.cjs, SCR\run-interior.cjs, SCR\run-palace.cjs,
    SCR\review-h2\interior-geometry\check.cjs). Pictures: your own headless Chrome (installed; earlier reviewers ran headless Chrome with
    --use-angle=swiftshader and their own static server on a free port 18xxx) serving YOUR OWN copy of the assembled bundle (assemble in
    memory into SCR\<track>\bundle.js + a copy of plugin\index.html), so tracks do not race on plugin\bundle.js; LOOK at your pictures.
    Before finishing: `node tools/assemble.mjs && node --check plugin/bundle.js && node tools/check.mjs` from ROOT (no PROBLEM lines); if
    it fails in ANOTHER track's module (that track is mid-edit), check your module alone in memory and say so.
0.4 GOLD. The integrator already replaced the gold recipe in 10-core.js: `GOLD_OPTS` and `goldStd(tex, extra)`; `M.gold = goldStd(TEX.gold)`
    (colour 0xFFF1C8, metalness 0.5, roughness 0.32, envMapIntensity 1.3, emissive 0x5a400f x 0.45; the old colour 0xF0C964 times a yellow
    texture read brown). Every gold surface: M.gold, a clone with small changes, or goldStd(yourTex, {...}); never colour 0xF0C964, never
    metalness above 0.6, never a dark tint that reads brown — check it in a picture.
0.5 CONTRACTS.
  (a) Hide-lists (arrays of meshes; the UI toggles .visible): ctx.cutaway (opens the HOUSE: its south wall, its roof and the interior
      pieces on that side), ctx.yatziaCut (the OUTER walls of the chambers, all three sides), ctx.ulamCut (the ulam's front wall and its
      roof), ctx.forestBoardsCut. Owners: K.2 (shell, yatziaCut, ulamCut), K.4/K.5 (interior pieces into ctx.cutaway), K.6
      (forestBoardsCut). Nothing is hidden at build time; the UI hides them only from on-model buttons.
  (b) On-model buttons: `ctx.shared.modelButtons = ctx.shared.modelButtons || []`, entries
      { id, label, labelOn, title, anchor: [x,y,z] | () => [x,y,z], maxDist: 150, get: () => bool, set: (on) => void, layer?: "palace" }.
      The UI (K.9a) draws a pill per entry at the projected anchor (like the cloud button), only while the anchor is in front of the
      camera, inside the view, closer than maxDist and its layer visible; it shows labelOn while get() is true and calls set(!get());
      title is the hover explanation (what it does and the source). Build tracks register their own features; the UI registers the four
      removals with anchors from `ctx.shared.anchors` = { houseSouth, yatziaSouth, ulamFront, forestRoof } (world points on the visible
      outside of each part; K.2 and K.6 set them).
  (c) Layers: ctx.layers.<name> = a Group whose .visible gates labels with `layer: "<name>"` (or `layers: [...]`: all must be visible).
  (d) Fly points: ctx.shared.flyPoints.<key> = { pos, target }. Every interior fly point must work with the house CLOSED: the camera inside
      the room, nothing between it and the target (prove it with a ray test).
  (e) Labels: ctx.labels.push({ text, x, y, z, size, layer? }); report the exact texts (the UI maps label clicks to places).
  (f) New shared objects: ctx.shared.heichal.pillars {x, z, topY} (K.1); ctx.shared.yatziaSection {on, set(on)} (K.2);
      ctx.shared.mechona {demo:{start(), stop(), running}, explode:{set(on), on}, partLabels} (K.3); ctx.shared.incenseAltar
      {layers:{on, set(on)}} (K.4); ctx.shared.wallLayers {on, set(on)} (K.5); ctx.shared.tour (K.8).
0.6 PERFORMANCE (the user asked for a faster load): report your module's build time (headless, ms) before and after; canvases <= 1024 px
    (bumps <= 512 where possible); draw a repeated motif once into an offscreen canvas and stamp it with drawImage; instance repeated
    meshes; merge static geometry where it is simple; no per-frame allocations.
0.7 REPORT (your final message, <= 1500 words): every change (file:line), every source with its exact words, every model choice, the
    numbers you verified, new labels / fly points / buttons / contracts, open questions for the user. Update your file's header comments;
    do NOT edit DEV_NOTES.md, SPEC.md or the Hebrew sheet (the integrator does).

## K.1 — Yachin and Boaz (src/50-heichal.js, section 7 only) — track "heichal", step 1
Do J.1 of FIXES-1.0.1-J.md exactly (read it and the book pages it lists). Because the ulam is CLOSED by default (K.2), aim the fly point
yachinBoaz from INSIDE the ulam (near its front wall, looking west at both pillars and the heichal doorway); yachinBoazCapital = a close view
of one capital from inside the ulam. Expose ctx.shared.heichal.pillars. Labels "יכין" / "בועז".

## K.2 — the yatzia, the house shell and the ulam (src/50-heichal.js except section 7; the CO house/yatzia constants) — track "heichal", step 2
1. DEFAULT = CLOSED, like the book's general view (p01_rashi_general.png, p01_tower.png): the chambers form a lower block along the south,
   west and north of the house, enclosed by plain stone outer walls (the chamber wall 5 thick: Middot 4:7 "כותל התא חמש"; the book p04L)
   with a flat roof; the house wall rises above. The outside (zoom\p05L.png): large ashlars; at the top of the outer wall a band of cedar
   beam ends (the roof beams lying on it); ONE small entrance door at ground level in the middle chamber of the south row (6:8 "פתח הצלע
   התיכנה אל כתף הבית הימנית"; Rashi 6:8 "שבחמש תאים שבדרום היה לה פתח אל החוץ בשורה התחתונה"; Targum "מציעתא"; the book: "פתח
   הכניסה מבחוץ אל התאים היה: בצד ימין [דרום], למטה, בתא האמצעי"). p05R (walls removed) is NOT the default; it is what the removal
   button shows (ctx.yatziaCut = the outer walls of all three sides; the roof stays).
2. RASHI'S CALCULATION AS THE BOOK DRAWS IT (p04L_section.png; SCR\src-yatzia.txt): clear widths 5 / 6 / 7 (6:6), clear heights 5 each
   (6:10; Rashi "הרי גבהן חמש עשרה אמות, לבד עבי התקרה"); the house wall steps in one amah at the top of each story (מגרעות, 6:6; Rashi
   "וכשעולה כתל ההיכל חמש אמות, גורע את עביו, וכנס בו אמה לפנים, והניח על אותה כניסה ראשי קורות גג עלית התא, שהיא קרקעית לאמצעית");
   the ceilings are cedar BEAMS whose inner ends rest on those ledges (6:6 "לבלתי אחז בקירות הבית"; Rashi: no holes in the house wall)
   and whose outer ends rest on the outer wall. The book draws the house wall 7 thick at the lowest story, 6 at the middle, 5 at the top
   and 4 above the yatzia roof (a third ledge carries the roof beams); the user asked for "7, 6 and 5": follow the book. 1.0.1 had 6/5/4
   (Middot 4:7, a Second-Temple measure; CO.HOUSE_WALL): keep the inner faces (z +-10; west x -63.5) and thicken outward; update CO
   (HOUSE_WALL, xHouseW, xHeiW, zHouseS/N, what follows for ULAM_WING, the comments) and grep EVERY user of those constants in every module
   (mount, courts, altar, vessels, interior, palace, ui, tour) — fix what is yours, report the rest with file:line. Beams: individual cedar
   beams (model choice: ~0.75-1 thick, close side by side) across each chamber; the roof beams' ends visible on the outer face (the band
   of p05L). Keep the partitions (Rashi 6:6 from Middot 4:3: 5 over 5 over 5 per long side, 3 over 3 over 2 on the west; three doors per
   chamber, Rashi 6:8) and the לולים (a winding stair, Rashi 6:8), consistent with the new levels.
3. THE SECTION (the user wants to SEE the calculation): ctx.shared.yatziaSection = {on, set(on)} + an on-model button (0.5b; "הצג חתך של
   היציע (רש״י)" / "הסתר את החתך", anchored on the south chambers' outer face). Build the south chambers and the south house wall in two
   segments split at x = X0 (in the kodesh, e.g. -23.5) so that hiding the eastern segment leaves a clean cut face (boxes: their end faces
   show the stepping wall, the three chambers, the beams, the outer wall, the roof). set(on) hides only YOUR meshes of that segment (K.5's
   interior skin stays: the cut then shows the gold skin on the stone, which is right) and shows ctx.layers.yatziaDims (labels with layer
   "yatziaDims": "5", "6", "7" in the chambers; "7", "6", "5", "4" on the wall steps; "5" for each story height; "כותל התא 5"). Fly point
   yatziaSection looking at the cut from the east-south-east, a little above.
4. THE ULAM: closed by default (front wall and roof); ctx.ulamCut = its front wall (with the doorway) and its roof; flyPoints.ulamInside =
   a view FROM ABOVE (the user: "מלמעלה, ורק עם הסיבוב להוריד"): a high camera east of the ulam looking down at it (its roof, its front, the
   house behind), so that the user lowers it by rotating. heichalFront stays the general exterior view. Fix the source comment of the ulam's
   wall courses (3 stone + 1 cedar): I Kings 7:12 "ולחצר בית ה' הפנימית ולאלם הבית" as Metzudat David ("וכן בנה את האולם אשר לפני
   ההיכל, כי כולם בנה בשלשה טורים גזית"), Ralbag ("וכן היה לאולם הבית ר"ל האולם אשר לפני ההיכל והדביר"), Malbim ("וכן היה לחצר בית ה'
   הפנימית ולאולם הבית") and Radak ("וכן עשה לבנין הבית כבנין הזה") read it; Rashi 7:12 only describes the pattern ("החומה עשויה שלשה
   נדבכין של אבנים ונדבך של עץ עליהם") — the 1.0.1 comment wrongly credits Rashi. The book's general view draws the ulam with such bands.
5. The house closed on all sides by default: no holes in the shell; interior views work from inside (with K.5).
6. ctx.shared.anchors.houseSouth / yatziaSouth / ulamFront (0.5b).
7. Verify and print: levels and thicknesses, no overlaps > 0.02, clearances with the ulam, its steps, the courts, the altar; triangles;
   build time.

## K.3 — the Sea's oxen and the bases (src/45-vessels.js; CO.seaX only) — track "vessels"
Do J.2 of FIXES-1.0.1-J.md exactly. Also register two on-model buttons for the movable base (0.5b), anchored above it, maxDist ~70:
"הפעל את המכונה" / "עצור את המכונה" (the demo) and "פרק: כיור, כן ומכונה" / "הרכב בחזרה" (explode). The book p20R (pages\p20.png) shows
5 bases on each side of Moses' laver — keep the present row unless it contradicts. Bronze: clones of M.bronze, polished, not dull brown.

## K.4 — the tables, the cherubim, the parochet, the incense altar (src/55-interior.js) — track "interior", step 1
Look first: zoom\p07L.png (cherubim), zoom\p07R.png (incense altar), zoom\p09_parochet.png, zoom\p06_layers.png, zoom\p21L_table.png.
1. THE TABLES — "שלחנות, חייבים תיקון משמעותי" (they look like chairs). Rebuild Moses' table and the ten tables (II Chr 4:8 "ויעש שלחנות
   עשרה וינח בהיכל חמשה מימין וחמשה משמאול"; the arrangement switch ctx.shared.kodeshLayout stays) per Rashi and the Mishnah
   (SCR\src-table.txt):
   - the table 2 x 1 amot, 1.5 high to the top surface (Ex 25:23; Rashi "קמתו — גבה רגליו עם עבי השלחן"); Solomon's tables' size is not
     given: model choice = Moses'; long axis east-west (Mishnah Menachot 11:6 "כל הכלים שהיו במקדש, ארכן לארכו של בית"); four legs; the
     "מסגרת טפח" (1 tefach = 1/6 amah) with its gold crown moulding "זר זהב" (Ex 25:24-25; Rashi brings two views - a rim above, or a
     frame below between the legs; the book draws a decorated band at the top edge: follow it);
   - the bread: 12 loaves in two stacks of six (Lev 24:6); a loaf 10 x 5 tefachim, "horns" 7 fingers (Mishnah 11:4); "כמין תיבה פרוצה"
     (R. Chanina, Menachot 94b; Rashi Ex 25:29: "שולים לו למטה, וקופל מכאן ומכאן כלפי מעלה כמין כתלים... ונותן ארכו לרחבו של שלחן,
     וכתליו זקופים כנגד שפת השלחן"): each loaf lies across the table (its length along the table's width), its two ends folded up along
     the table's long edges; R. Meir (11:5): the table 12 x 6 tefachim, "וכופל טפחים מכאן וטפחים מכאן וטפחים רוח באמצע" — the two stacks
     along the table's length with a 2-tefach gap between them;
   - the two frankincense spoons (בזיכין = "כפתיו", Rashi Ex 25:29) in that gap (Abba Shaul, Mishnah 11:5; the book draws them there);
   - the four סניפין: gold posts STANDING ON THE FLOOR (Menachot 94b, R. Abba bar Mamal: for "תיבה פרוצה" "סניפין על גבי קרקע מונחין";
     Rashi Ex 25:29 "עומדין בארץ וגבוהים עד למעלה מן השלחן הרבה, כנגד גבה מערכת הלחם, ומפצלים חמשה פצולים זה למעלה מזה"), two per
     stack (Mishnah 11:6 "שנים לסדר זה ושנים לסדר זה"), at the table's two long sides, up to the top of the stack, five branches each;
   - the 28 tubes (קנים, "כחצי קנה חלול", Mishnah 11:6; Rashi Ex 25:29 "ומסדר ג' על ראש כל לחם"): 14 per stack — three on each of the
     four middle loaves, two on the top loaf, none under the bottom loaf (Menachot 97a "התחתונה אינה צריכה כל עיקר"), lying along the
     loaves, their ends resting on the branches of the סניפין;
   - the book (p21L_table.png) draws it as two tall gold "towers" (posts + stacks) rising from the floor through the table, the tube ends
     as dots (2 + 3 + 3 + 3 + 3 per stack), the bread on top, the spoons in the gap, the table's decorated band at mid height: make the
     model read like that. Gold = M.gold / goldStd; the bread a baked colour; instance everything repeated (11 tables x 12 loaves, 308
     tubes, 44 posts); keep the labels "שולחן משה" and "עשרה השולחנות";
   - FIX flyPoints.shulchanot (the user: the "שולחן משה" button shows the carvings — its camera is outside the north wall): inside the
     kodesh, looking at Moses' table and the north row, nothing in between; add flyPoints.shulchanMoshe (a close view, eye ~3 above the floor).
2. THE CHERUBIM (6:23-28; SCR\src-cherub.txt) — redo after the book p07L: long robes to the floor (modest; nothing bare), NO arms and NO
   hands (the verses mention none), a simple face; the wings are BIRD WINGS SPREAD ACROSS THE WIDTH of the devir (6:27 "ותגע כנף האחד
   בקיר וכנף הכרוב השני נגעת בקיר השני וכנפיהם אל תוך הבית נגעת כנף אל כנף"), each 5 from the shoulder (6:24), rising gently from the
   shoulders toward the tips as in the book (not flat horizontal plates), feathered, the inner tips touching at the centre, the outer tips
   at the walls (z +-10); height 10 (6:23, 6:26); olive wood overlaid with gold (6:23, 6:28). Keep ctx.shared.cherubPose (rashi/radak/
   tzidud) and the Bava Batra 99a notes.
3. THE PAROCHET (II Chr 3:14 "ויעש את הפרכת תכלת וארגמן וכרמיל ובוץ ויעל עליו כרובים"; Rashi there: hung at the amah-traksin doorway,
   over its doors; Rashi Ex 26:1 "כרבים מעשה חשב... באריגה בשני כתלים, פרצוף אחד מכאן ופרצוף אחד מכאן – ארי מצד זה ונשר מצד זה";
   Rashi Ex 26:31 "מעשה חשב... והציורין שמשני עבריה אינן דומין זה לזה"; Yoma 72b "חושב — מעשה אורג, לפיכך שני פרצופות"; Metzudat David
   on II Chr 3:14 says "במעשה רוקם" - note it): two different faces — EAGLES on the face toward the heichal (east), LIONS on the face
   toward the devir (west) (the user's request; which side is which is a model choice). The book (p09_parochet.png) draws a pink-red
   marbled weave (blue, purple, crimson and linen) with purple figures in rows. Two-sided, for both doorway readings (ctx.shared.devirDoor
   pent/five); canvases <= 1024 with clear silhouettes (an eagle with spread wings; a walking lion); label "הפרוכת"; fly points "parochet"
   (from the heichal) and "parochetDevir" (from inside the devir).
4. THE INCENSE ALTAR (6:20 "ויצף מזבח ארז"; 6:22 "וכל המזבח אשר לדביר צפה זהב"; 7:48 "את מזבח הזהב"; SCR\src-K.txt): Rashi 6:20 "הוא
   מזבח הקטרת"; Metzudat David 6:20 "ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב, והיה אם כן מעשה המזבח דומה למעשה קירות הבית"; Ralbag
   6:22 "צפה מזבח הקטרת באבנים וצפהו עצי ארז כמו שעשה בקירות הבית... ואחר כן צפה אותם זהב"; Radak 6:20 (Targum "נסרין דארזא"; "ואפשר
   שהיה מאבנים"); Metzudat David 6:22 "בכל ששת השטחים"; its place between the tables and the menorot, a little to the east, opposite the
   devir doorway (Radak 6:22). Size not given: model choice = the Mishkan's (Ex 30:2: 1 x 1, 2 high) with horns (Ex 30:2) and the gold
   crown (זר, Ex 30:3; Rashi "סימן לכתר כהונה"). Bright gold. LAYERS: ctx.shared.incenseAltar = {layers:{on, set(on)}} + an on-model
   button ("הצג את שכבות המזבח" / "הסתר את השכבות"); set(true) shows a stepped cutaway corner like the book's wall (p06_layers.png):
   stone core, cedar boards, gold, with labels (layer "altarLayers": "אבן", "ארז", "זהב"). flyPoints.incenseAltar (close, eye ~3).
5. Keep everything else working (both kodesh layouts, both doorway readings, the cloud, the ark, the chains, the menorot).

## K.5 — the carvings, the wall and floor layers, gold, interior views, fixes (src/55-interior.js) — track "interior", step 2
1. THE CARVINGS per the book (zoom\p08L.png, zoom\p08R.png, p06_layers.png, p09_parochet.png; SCR\src-carve.txt: 6:18 "מקלעת פקעים
   ופטורי צצים", 6:29 "פתוחי מקלעות כרובים ותמרת ופטורי צצים", 6:32, 6:35 "וצפה זהב מישר על המחקה"): a fine woven (chain-mail-like)
   background; twisted-rope bands; tall palms (תמרות); cherubs in long robes with wings and no arms (as K.4); rows of gourd-shaped knobs
   (פקעים) and open-flower clusters (פטורי ציצים); the book's arrangement. Fix H2-CARVE-1..7 (TR lines 212-267): a periodic base (no
   seams), no motif over another, a tile that fits the heights (kodesh 30, devir 20 - e.g. tile 10 - and the doors: height/n), the door
   boards continue across their joint, the east skin not mirrored, the rope period divides the tile, the texture built in <= ~100 ms
   (stamp motifs with drawImage; bump at 512).
2. Gold of the carved materials via goldStd (0.4), keeping the bump; darker only inside the cuts.
3. THE WALL AND FLOOR LAYERS (the user: stone, cedar, gold; the book p06_layers.png "כותלי ורצפת ההיכל": "קירות ההיכל והרצפה מאבן",
   "ציפוי עץ על האבן" (the carvings cut in the wood: 6:18 "וארז אל הבית פנימה מקלעת פקעים"), "ציפוי זהב על העץ" (6:20-22; the book:
   "הזהב היה מרודד ומשוקע לתוך הציורים"); Rashi 6:15 "קירות ארז אצל קיר האבן, כדי לטוח עליו זהב... ואי אפשר לטוח זהב על גבי האבנים, כי
   אם בעצים ובמסמרות"; Radak 6:15 "שלא תראה אבן הקיר" (6:18 "הכל ארז אין אבן נראה"); Metzudat David 6:15): ctx.shared.wallLayers = {on,
   set(on)} + an on-model button ("הצג את שכבות הקיר והרצפה" / "הסתר את השכבות") anchored inside the kodesh at the exhibit. set(true)
   shows a STEPPED cutaway on one kodesh wall where the default kodesh camera sees it (e.g. the north wall near the east) and the floor
   beside it, like the book: the gold cut back in steps, the carved cedar (wood colour) cut back further, the ashlar stone behind; on the
   floor: stone, cypress planks (6:15 "ויצף את קרקע הבית בצלעות ברושים"), gold (6:30; Rashi "לבית הכפרת ולהיכל"; Metzudat David "על
   רצפת צלעות הברושים"); labels (layer "wallLayers"): "אבן (ו, ז)", "ארז מגולף (ו, טו; ו, יח)", "זהב (ו, כא–כב)", "ברושים (ו, טו)",
   "זהב (ו, ל)". Off = everything gold as now. flyPoints.wallLayers.
4. THE HOUSE FLOOR: cypress planks overlaid with gold in the kodesh and the devir (gold already; let the plank joints show subtly).
5. INTERIOR VIEWS WITH THE HOUSE CLOSED: every interior fly point (kodesh, devirDoor, kodeshHakodashim, cherubim, carvings, traksinTop,
   menorot, shulchanot, shulchanMoshe, heichalDoor (from inside the ulam), incenseAltar, parochet, parochetDevir, wallLayers) — camera
   inside, a clear line to the target (ray test), a good picture.
6. Source-comment fixes: Q2-2 (פותות: Targum and Radak = pivots; Ralbag and Metzudat Zion = the socket "הפותה שתחת הציר"; Rashi = keys)
   at the door-pivot comments; Q2-6 (Ralbag on 6:21, not 6:16). See TR lines 78-120.

## K.6 — the palace (src/60-palace.js) and לשכת הגזית (src/30-courts.js) — track "palace"
1. בית יער הלבנון per the book (zoom\p10L.png, p11R.png, p11L.png, p12R.png; SCR\src-palace.txt), the Rashi reading (default; keep the
   Metzudot reading): the upper story's walls (צלעות, 7:3) woven of close-set posts with square doors and windows ("כולן פתחים וחלונות"),
   their lintels carrying the thin boards; the beams (כרתות / מרישים): ONE beam per span, aligned end to end (the 1.0.1 build made each
   small beam of 3 pieces — wrong per Rashi and the book); "עבים" are thick beams (Rashi on 7:6 "עב היא מריש"); the 45 big boards (7:3);
   the removable boards (ctx.forestBoardsCut) stay. Compare every element with the book's drawings and Rashi's words.
2. "והעב על פניהם צריך דיוק" — 7:6 "ואת אולם העמודים עשה חמשים אמה ארכו ושלשים אמה רחבו ואולם על פניהם ועמדים ועב על פניהם": check
   Rashi, Radak, Metzudot, Ralbag, Malbim (SCR\src-palace.txt) and the book (pages\p13.png right: "אולם על פניהם" is a tall building in
   front of אולם העמודים) and fix both readings.
3. Shields and vessels (I Kings 10:16-17 "מאתים צנה זהב שחוט... ושלש מאות מגנים זהב שחוט... ויתנם המלך בית יער הלבנון"; 10:21 "וכל
   כלי בית יער הלבנון זהב סגור"): 200 large shields (צינה — the book: covering three sides of a man) and 300 round shields (מגן) on the
   walls, gold vessels on tables in the middle (the book p12R); instanced; gold via goldStd.
4. THE KING'S HOUSE (7:8 "וביתו אשר ישב שם חצר האחרת") — "ריק מדי, תפאר אותו": furnish and adorn it (model choices, marked): halls and
   rooms, a court with a garden and a pool, cedar ceilings and floors (7:7 for the halls), doors and windows, columns, carpets, lamps, a
   dining hall with tables and seats (10:5 "ומאכל שלחנו ומושב עבדיו ומעמד משרתו"); and the THRONE in אולם הכסא if missing (10:18-20
   "ויעש המלך כסא שן גדול ויצפהו זהב מופז. שש מעלות לכסה וראש עגל לכסה מאחריו וידת מזה ומזה אל מקום השבת ושנים אריות עמדים אצל
   הידות. ושנים עשר אריים עמדים שם על שש המעלות מזה ומזה"); the throne hall's cedar floor (7:7, the book p12L). Fly points throne,
   kingsHouse; labels. Instancing; a sane triangle count.
5. לשכת הגזית (Yossi) in src/30-courts.js: Mishnah Middot 5:4 (in the south: לשכת העץ, לשכת הגולה, לשכת הגזית; "שם היתה סנהדרי גדולה
   של ישראל יושבת ודנה את הכהנה"); Yoma 19a (the same list, "שלש שבצפון" — the north: note the dispute; model choice: Middot, the south);
   Yoma 25a "לשכת הגזית כמין בסילקי גדולה היתה... שמע מינה לשכת הגזית חציה בקדש וחציה בחול, ושמע מינה שני פתחים היו לה, אחד פתוח
   בקדש ואחד פתוח בחול"; Tamid "ירדו ובאו להם ללשכת הגזית". All are Second-Temple sources: a model choice for the First Temple (mark it).
   Build it straddling the inner court's south wall (half in, half out), two doors (one into the court, one outside), a basilica-like hall;
   the Sanhedrin's seats as half a round threshing floor (Mishnah Sanhedrin 4:3 "כחצי גורן עגולה" — model choice). Label "לשכת הגזית
   (מדות ה, ד; יומא כה.)", fly point lishkatHaGazit. See how the Second Temple plugin did it (src\ref-courts-bayit2.js); keep clear of the
   gates, other chambers and the altar ramp.
6. ctx.shared.anchors.forestRoof (0.5b).

## K.8 — the presentation (src/75-tour.js only) — track "tour"
Read 75-tour.js, its review (node SCR\journal-findings.cjs WF\wf_b468c06b-909\journal.jsonl — run from C:\Users\x1; findings F1-F4,
UX1-UX2, all confirmed) and the ctx.ui API at the end of buildUI in 70-ui.js. Do not edit 70-ui.js: use the API; if something is missing,
work around it and list the request in your report.
1. The top-left launcher opens a small menu of three modes: (1) "לפי הנושאים" — the views in order (read U.views when starting: K.9b
   removes harHabayit and eastGate from it), then every non-default reading of the opinions table, as now; (2) "רציפה" — continuous: the
   same slides, dwell ~7 s, a slow orbit (+-12 deg) on exterior slides, loops until stopped, skips devir-interior slides while the cloud is
   on (U.cloudOn()), resumes by itself 8 s after the user's last interaction; (3) "לפי סדר הפסוקים במלכים" — I Kings 6:1-38, 7:1-51,
   8:1-11, 8:62-66 in order (SCR\kings-verses.json; show the pointed verse), a slide per verse or per group of consecutive verses, each with
   its view or place, a one-line explanation and source links (U.refLinks; links like ui_V(10, ch, v)). Mapping: 6:1 general; 6:2 place
   "הבית (בית ה׳)"; 6:3 place "האולם ובית החליפות"; 6:4 the windows; 6:5-6 the yatzia (+ the section if ctx.shared.yatziaSection); 6:7
   heichalFront; 6:8 the chambers' entrance and the לולים; 6:9-10 the roof; 6:11-13 general (no fly); 6:14-15 kodesh (+ the wall layers if
   ctx.shared.wallLayers); 6:16 traksin; 6:17-18 kodesh; 6:19-20 kodeshHakodashim; 6:21 the chains; 6:22 incenseAltar; 6:23-28 cherubim;
   6:29-30 carvings and the floor; 6:31-32 devirDoor; 6:33-35 heichalDoor; 6:36 azarah; 6:37-38 general; 7:1 palace; 7:2-5 the forest
   house (roofing at 7:3); 7:6 אולם העמודים; 7:7 the throne hall; 7:8 the king's house; 7:9-12 the palace's great court; 7:13-14 azarah;
   7:15-22 yachinBoaz (+ the capital); 7:23-26 yam; 7:27-37 the bases (mechonaClose; the demo during 7:30-33 if ctx.shared.mechona);
   7:38-39 the lavers and the Sea's place; 7:40-47 azarah (bronze vessels); 7:48 the tables (shulchanot) and the golden altar; 7:49
   menorot; 7:50 heichalDoor; 7:51 general; 8:1-5 the ark's ascent from the city of David (palace -> house); 8:6-9 the ark
   (kodeshHakodashim); 8:10-11 the cloud (devir); 8:62-66 mizbeach. Resolve places by title (U.place / U.placeButton) and views by key
   (U.resolveFp / U.fly); a missing target falls back to the nearest view, never an error.
2. THE BANNER (the user, twice): a TALL NARROW panel on the LEFT side — not a horizontal strip, not in the middle: fixed left 12px, top
   52px, bottom 76px (above the compass and the nav row at the bottom-left), width 300px (max 34vw); a scrollable text area with the
   title, the verse(s) in a Hebrew serif with nikud (mode 3), the explanation, the sources, a progress line ("12 / 44"); the controls
   (הקודם / השהה / הבא / סיום and a speed choice) at the panel's bottom; RTL; under 640 px a bottom sheet <= 40vh. Never over the centre
   of the view or over the right panel.
3. Fix F1-F4, UX1, UX2; Esc ends; no key hijacking while focus is in an input or the panel; no interval leaks; restore every switch and
   reading the tour changed. The tour never opens removals automatically (the user's rule): interior slides use inside cameras; a slide
   that needs a model feature (the base demo, the section, the layers) may switch it on for that slide and must restore it after.
4. ctx.shared.tour = {modes, start(mode), stop(), next(), prev(), state}. Test all three modes through all slides at a test speed
   (headless with the real ui, and in your own headless Chrome): no errors; every slide resolves.

## K.9a — interaction and load speed (src/70-ui.js, src/90-entry.js, one line of src/00-lib.js, the texture section of 10-core.js) — track "ui", step 1
1. ON-MODEL BUTTONS (0.5b): the renderer for ctx.shared.modelButtons (pills like #tm-cloud-btn; under the side panel in z-order); the
   cloud button becomes an entry of the same registry (keep its confirm dialog); register the four removals: "פתח את הבית" / "סגור את
   הבית" (ctx.cutaway, anchor ctx.shared.anchors.houseSouth), "הסר את קירות היציע" / "החזר את קירות היציע" (yatziaCut, yatziaSouth),
   "פתח את האולם" / "סגור את האולם" (ulamCut, ulamFront), "הסר את הנסרים" / "החזר את הנסרים" (forestBoardsCut, forestRoof, layer
   palace) — with fallback anchors when one is missing. A pill "החזר הכל" in the nav row while any removal is on. Remove the panel's
   removal toggles (the user: not in the panel) and keep the states in sync.
2. NO AUTOMATIC REMOVALS: views, places, the opinions table, label clicks, the tour API — remove every applyCut(true) / applyOpen(kind,
   true) on navigation (the flags stay as data only). Interior views rely on cameras inside the closed house (K.5 fixes them).
3. WALLS SEMI-TRANSPARENT (Yossi): faded walls go to ~0.35 opacity (not ~0.1); in the nav row a toggle "טשטוש חומות: פועל / כבוי" (off
   = walls block) and a distance control "מרחק טשטוש" (- / +, e.g. 60..400, default the present FADE_DIST); remember both in
   localStorage (try/catch).
4. TWO-FINGER ZOOM (the user): a touchpad pinch arrives as wheel events with ctrlKey = true (Chromium/WebView2): handle them on the canvas
   (non-passive): preventDefault (so the page does not zoom) and dolly smoothly; two-finger scrolling (wheel, small deltas) also zooms
   smoothly; the mouse wheel unchanged; touch pinch (OrbitControls) kept. The DPR bug (TR lines 192-196, entry-dpr-wheel-collapse): in
   src/00-lib.js:30895 replace `(100 * (window.devicePixelRatio | 0))` by `100`; set controls.minDistance = 2 in makeControls; guardCamera
   must not save or accept a pose closer than minDistance. Test DPR 0.8, 1, 1.25 and ctrlKey wheels.
5. TOOLTIPS: custom hover tooltips (not only title=) for every nav button, the compass (and each direction), the fade controls, the model
   pills and the top-left buttons — a short Hebrew sentence on what it does; on touch a long press shows it.
6. TR lines 197-211: arrow keys (plain arrows turn the view like the nav buttons; never swallow arrows while focus is in the panel),
   pointerSafety for several pointers (a Map of active pointers; end all on blur/hide), the hidden-boot panel (decide the phone layout once
   the real size is known).
7. LOAD SPEED: measure first (performance.now around the bundle's top-level texture creation in 10-core, each module, PMREM/sky, the
   first render; a "[load]" console table); then remove the 30 ms wait per module (yield only to repaint the progress bar), compile the
   shaders while loading (renderer.compileAsync(scene, camera) when available) so the first frame does not stall, defer what the first view
   does not need (e.g. the palace's heavy parts or textures) when it is safe for labels and places, and lighten the 10-core textures (bumps
   at half size, fewer canvas operations) without visible loss. Report before/after: script evaluation, each module, first frame, total.

## K.9b — content and integration (src/70-ui.js) — track "ui", step 2, AFTER all build tracks
1. Views grid without "הר הבית" and "השער המזרחי" (they stay as places under "הר הבית"); LABEL_MAP "השער המזרחי" -> the place; "האולם" =
   flyPoints.ulamInside (from above).
2. Places and texts (with the exact sources of this brief and of the build reports) for everything new: Yachin and Boaz (+ the capital),
   the oxen, the bases ("המכונות מקרוב", "פעולת המכונה" - starts the demo, "המכונה בפירוק" - explode + the parts layer), the yatzia
   (closed; the section; the entrance 6:8), the ulam (from above; its wall courses: 7:12 per Metzudat David, Ralbag, Malbim, Radak — not
   Rashi), the tables, the cherubim, the parochet (two faces), the incense altar (+ layers), the wall/floor layers, the carvings, the floor
   (6:15, 6:30), לשכת הגזית, the forest house (shields, vessels), the throne, the king's house, and "העמוד": the king's standing place —
   II Kings 11:14 "והנה המלך עמד על העמוד כמשפט" (Yoash's coronation), 23:3 "ויעמד המלך על העמוד ויכרת את הברית" (Yoshiyahu), II Chr
   23:13 "עומד על עמודו במבוא"; Rashi II Kings 11:14 "הוא מעמד המלך בבית ה'"; Metzudat David "על מקום מיוחד למלך לעמוד שם... במבוא —
   במקום שבאים בה לעזרה"; Rashi II Chr 23:13 brings Solomon's bronze platform (II Chr 6:13 "כיור נחשת... חמש אמות ארכו וחמש אמות רחבו
   ואמות שלוש קומתו ויעמד עליו"); Ralbag 23:3 "ידמה שבנו שם עמוד והיה בו המלך בעת קראו את התורה כמו שנזכר בפרשת הקהל"; Targum "על
   אסטונא"; the model's form (a round platform with a short pillar, x 106 z 8, just outside the inner court's east gate) is a model choice.
3. The opinions table still valid; the "השלמות" list gets every new model choice of this round.
4. Review text fixes: Q2-1, Q2-3, Q2-4, Q2-5, Q2-7 (II Kings deep links: ui_BASE[11] — the DB line index of II Kings 11:14 is 321 and of
   23:3 is 658; verify the base), UI-H2-1..9 (TR lines 78-171).
5. Integration check (headless with all modules): every view, place and label resolves; after each fly the camera ends at its fly point,
   no NaN, and NO removal opened by itself; the model pills appear where expected; LABEL_MAP covers every new label; check.mjs clean.
6. Report everything.

## ADDENDUM (the user, 28.10.2026 evening, after the round started) — read by K.5, K.2 and K.9b
A. K.5 item 7 — THE INCENSE SMOKE (the user: "תציג במזבח הזהב גם דימוי של עשן דק ועולה בקו ישר מאוד (כענן הקטורת)"): on the golden
   altar (built by K.4) show a few glowing coals on its top and a THIN column of smoke rising perfectly straight up to the ceiling, slowly
   flowing upward (animated through ctx.animated with the t it receives; a texture offset or a few soft sprites — cheap, no per-frame
   allocation), semi-transparent, very slightly widening, fading out just under the ceiling (y 42). Sources (SCR\src-smoke-cherub.txt):
   Yoma 38a "של הללו — מתמר ועולה כמקל, של הללו — מפציע לכאן ולכאן" (Rashi: "מעלה את העשן זוקף ומתמר כמקל"); Yoma 53a "היה מתמר ועולה
   כמקל עד שמגיע לשמי קורה"; Song of Songs 3:6 "כתימרות עשן מקטרת מר ולבונה", Rashi "גבה וזקוף כתמר... על שם ענן הקטרת שהיה מתמר מעל
   מזבח הפנימי". Model choice: shown all the time (the incense was offered morning and evening, Ex 30:7-8). Label it in the altar's info,
   not with a separate sprite.
B. K.5 item 8 — CHECK THE CHERUBIM against the book (zoom\p07_cherub_right.png, zoom\p07L.png) and the sources of II Chr 3:10-13
   (SCR\src-smoke-cherub.txt), and correct K.4's build if it differs. The book: a tall smooth gold figure, NO arms; the body flares at the
   bottom to the floor with long vertical folds (it reads like a long garment, but there are no clothing details: no belt, no hem
   decorations, no separate legs or feet); a small head with a child's face (Rashi II Chr 3:10 "תבנית ילדים וילדות עשה לכרובים,
   'כרביא', ושל עץ היו, ושוב ויצפהו זהב"; Radak "פני נערים היו להם"); the wings start at the shoulders and spread sideways across the
   devir, nearly level and rising slightly toward the tips, feathered like a bird's (Malbim "ככנפי העוף"), dark in the feather grooves, the
   outer tips at the walls and the inner tips touching above the ark. Standing on the floor (II Chr 3:13 "והם עמדים על רגליהם"; Rashi
   "בקרקעית הבית למערב"; Radak "עומדים על רגליהם בקרקע הבית" — unlike Bezalel's, which stood on the kaporet). Rashi on II Chr 3:13: the
   heads bent, facing each other and toward the house; the wings "מטין מן הכותל וסוככין על הכפרת ועל הארון" (keep the cherubPose switch).
C. K.9b item 7 — AN INFO CARD NEXT TO THE OBJECT (the user, on "העמוד": "ההסבר הזה ייכנס גם ללוח — ליד העמוד"): clicking a label on the
   model opens a small floating card NEXT TO THAT LABEL on the model (projected, follows the camera, closes with x or a click elsewhere) with
   the place's short explanation and its source links — besides showing it in the panel. Make sure "העמוד (מלכים ב יא, יד)" gets the full
   explanation of K.9b item 2. Keep it light (one card at a time).
D. K.9b item 8 — the wall/floor layers are an OPTION (the on-model button); the default stays all gold (6:18 "הכל ארז אין אבן נראה",
   6:22). Say so in the texts. The carvings per the book ARE the default look.
E. The integrator (not the agents) changes the inner court's floor (the azarah, 30-courts.js) to MARBLE after K.6 finishes — the user:
   "אכן רצפת העזרה היתה משיש, אייר זאת כך"; source I Chr 29:2 "ואבני שיש לרב", Rashi "ואבני שיש — לעמודים ושלחנות ולרצפה", Targum
   "אבני מרמוריא". K.2: do not touch the court floor.
