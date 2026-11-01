# Fix round 1.0.1, part H — the user's second list of corrections (27.10.2026, evening)

Read SPEC.md first (conventions, helpers, coordinates) and the module you edit. Keep every source-comment rule (SPEC §1): a source for every
dimension, "model choice" marked where there is none. Bump nothing in manifest/DEV_NOTES (the integrator does that). `node --check` your file.

The user's words (verbatim, Hebrew):
1. "חסרים האיורים של הקודש פטור ציצים וכו" — the carvings of the heichal walls (open flowers etc.) are missing.
2. "חסר אמה טרקסין מעל פתח הדביר" — the amah traksin is missing above the devir doorway.
3. "הכרובים מאוירים מאוד לא מדויק ציין גם את דברי חזל שבנס היו עומדים" — the cherubim are drawn very inaccurately; cite Chazal that they stood by a miracle.
4. "בקירוי בית יער הלבנון היה הבדל היו 45 נסרים ואז נסרים דקים על גבי מרישים תן אופציה להסרה של זה כדי שיראו את המרישים" — the roofing of
   the House of the Forest: 45 boards and then thin boards on beams; give an option to remove them so the beams are seen.
5. "העמודים והעב לא מדויק" — "the pillars and the av" (I Kings 7:6) are not accurate.
6. "פתח הדביר יש ב' ביאורים ברשי" — the devir doorway: Rashi has two explanations (both must be shown).
7. "בכללי יש בעיה חמורה ב360 מעלות הוא נתקע ולא מסתובב נכון שקול לרנדר מחדש" — rotating around gets stuck / does not rotate right.
8. "את השיטות תנסה להכניס לתוך מסגרת מסודרת יצר בלבול לגמרי" — put the opinions into an orderly framework.
9. "הוסף מקורות להכל" — add sources to everything.

Items 1, 2, 3, 6 → 55-interior.js (the integrator). Item 4, 5 → 60-palace.js (THIS brief, section H.5). Items 7, 8, 9 → 70-ui.js / 90-entry.js (the integrator).

## H.5 — 60-palace.js: בית יער הלבנון after Rashi, as a switchable reading; the boards removable

### The sources (all fetched from the Otzaria library; quote them in the comments)
- I Kings 7:2 "ויבן את בית יער הלבנון מאה אמה ארכו וחמשים אמה רחבו ושלשים אמה קומתו על ארבעה טורי עמודי ארזים וכרתות ארזים על העמודים".
- 7:3 "וספן בארז ממעל על הצלעות אשר על העמודים ארבעים וחמשה חמשה עשר הטור". 7:4 "ושקפים שלשה טורים ומחזה אל מחזה שלש פעמים".
  7:5 "וכל הפתחים והמזוזות רבעים שקף ומול מחזה אל מחזה שלש פעמים". 7:6 "ואת אולם העמודים עשה חמשים אמה ארכו ושלשים אמה רחבו ואולם על
  פניהם ועמדים ועב על פניהם".
- RASHI (the user's first authority; he reads 7:3-6 this way and that is what he asked for):
  - 7:2 "וכרתות ארזים — קורות ארזים; לאורך הבית היה טור עמודים בקרקע, והכרותות מעמוד לעמוד" (the pillar rows run ALONG the house; the beams
    go from pillar to pillar along the row).
  - 7:3 "וספון בארז — קירוי עלייה מלמעלה. על הצלעות — מחיצות עליונות שעל הכרותות, ארבעה מחיצות זה אל זה ברוחב, משוכים לאורך הבית, כולן
    פתחים וחלונות, כי בית הקיץ הוא עשוי לאויר; ועל אותן מחיצות קירוי הסיפון: ארבעים וחמשה נסרים היו הסיפון, שלשה טורי נסרים (לשלשה
    חללים) שבין ארבע טורי העמודים, חמשה עשר נסרים הטור, ארכן לרוחב שבין טור לטור, ורחבן לאורך הבית זה אצל זה."
    (On the beams stand UPPER PARTITIONS, four of them, running along the house, all doorways and windows; on them the ceiling of 45
    boards: three rows of 15 for the three spaces between the four pillar rows, each board's LENGTH spanning the gap between two rows,
    their WIDTHS side by side along the house.)
  - 7:4 "ושקופים שלשה טורים — ועוד עשה קירוי אצל שלשה טורי הנסרים... כי רוחב של חמשה עשר נסרים לא קירה את הבית בכל ארכו שהוא מאה אמה,
    ועשה אצלו לקרות הבית קירוי של נסרים קטנים נתונים על מרישין קטנים הנתונים מטור כרותות ארזים אל טור, שלשה מרישין זה לסוף זה, ושקופין
    משני צידיהן כעין משקוף שהדלת שוקף בו, ועל אותן שקופין ראשי הנסרים הקטנים נתונים; ארכן של נסרים קטנים כנגד רחבן של נסרים גדולים
    שנתן תחילה." "ומחזה אל מחזה — ראשי נסרים של שקוף זה למול ראשי נסרים של שקוף זה."
    (The 15 big boards did not cover the whole 100-amah length; the rest got a SECOND roofing of small thin boards laid on small beams
    that run from one row of beams to the next, three small beams end to end, with rabbets ("שקופים") on both sides in which the ends of
    the small boards sit; the small boards' length runs in the direction of the big boards' width.)
  - 7:5 "רבועים שקף — ומחופין היו הפתחים בנסרים דקין, רבועין היו כשאר פתחי בתים, ולא עשויין כיפה כעין פתחי אולם." "וכל הפתחים והמזוזות —
    שסתם קירת מלכים עשוי פתחים פתחים מפני האויר, ולכך קראו בית יער שדומה ליער."
  - 7:6 "ואת אולם העמודים — אולם עשה לפני העמודים האלה, מבוא לבית, חמשים אמה ארכו לרחבו של בית שהיה חמשים אמה, ושלשים רחבו לפני אורך משך
    הבית". "ואולם על פניהם — אולם גבוה עשה על כל הבית." "ועמודים ועב על פניהם — ועל כרותות ארזים שעל העמודים התחתונים הציב עוד עמודים
    אחרים, ומרישין מעמוד לעמוד; העמודים לארוג בהן צלעות מזה לזה, והעבים לקירוי העלייה. עב היא מריש, כמו ששנינו 'והעבים אלו המרישין'."
    (THE PILLARS AND THE AV ARE THE UPPER TIER OF THE FOREST HOUSE: on the beams over the lower pillars stand further pillars with beams
    (מרישין = עבים) from pillar to pillar; the pillars carry the woven partitions, the עבים carry the roofing of the upper storey. "ואולם
    על פניהם" = a high hall over the whole house = that upper storey.)
- The other readings (already built, keep them as the second variant): Metzudat David 7:2 "והשורות ההם עמדו לרוחב הבית, והיה נחלק להם
  האורך לשלשה חלקים שווים, אבל לאורך הבית היה כתלים ממש"; 7:3 the 45 = ceiling boards, 15 per third, each 33⅓ long and 3⅓ wide; 7:4 three
  rows of windows in the long walls, window opposite window; 7:5 doorways square, posts square; 7:6 "ועמודים ועב על פניהם — לפני פתחי
  האולם הזה עמדו עמודים תקועים בארץ וממעל להם עץ עב לחברם יחד... לנוי ולפאר או להיות כעין מחיצה ולשמירה". Malbim 7:2-6 like Metzudot
  (rows across; 15 boards across the 50, each 3⅓ or with air between; stone walls on the long sides; the pillars-and-av before the second
  hall). Radak 7:2 "ובנה אותו על ארבע טורי עמודי ארזים על ארבע פנות הבית ומעמוד לעמוד כרותות ארזים שהם קורות גדולות הנקראים מרישים";
  7:3 the 45 boards in three rows of 15; 7:4 windows in three walls; 7:6 "ועוד היו עמודים אחרים על פניהם ועוד עב על פניהם, ועב הוא עץ עב
  וגדול הוא הנקרא מריש". Ralbag 7:3 fifteen pillars per row, 3⅓ pitch, pillars 2.5 thick, 30 between rows, 30 high.
  The full texts are in `C:\Users\x1\AppData\Local\Temp\claude\...\scratchpad\src-palace.txt` (the integrator pastes the path in the prompt).

### What to build
1. Two complete, switchable variants of בית יער הלבנון, each in its own Group inside the palace group:
   - `forestRashi` (DEFAULT, visible) — Rashi's reading, new.
   - `forestMetzudot` (hidden by default) — the existing build (rows across the house, long stone walls with the 3 rows of windows, 15
     pillars per row, the three doorways per short side, the 45 boards on the beams, the stone roof slab + parapet) moved into this group
     TOGETHER WITH the existing "עמודים ועב" colonnade in front of אולם העמודים (section 5 of the file), which belongs to the Metzudot
     reading only. Keep its geometry as it is (it was reviewed); only re-parent it. The forest house's 30-high pillars are now instanced
     inside each variant's group (not in the palace-wide P30 list): refactor `hall()` / `pal_wall` calls to take a `parent` argument.
   - Register `ctx.layers.forestRashi = <group>` and `ctx.layers.forestMetzudot = <group>` (the UI's label loop uses them) and
     `ctx.shared.forestHouse = { current: "rashi", keys: ["rashi", "metzudot"], set(key) }` that flips the two groups' `visible`.
   - Everything the two variants share stays directly in the palace group: the terrace, the floor of the house (M.paveFine 50 x 100),
     the foundation course, אולם העמודים (section 6) and all the other buildings. NOTE: in the Rashi variant there is no colonnade in front
     of אולם העמודים (Rashi puts "עמודים ועב" on the forest house), so the hall of pillars is simply reached across the open terrace.
2. The Rashi variant, footprint = the clear 50 x 100 of the current build (x 78..128, z 469.5..569.5, floor Y = -10), total height 30 (7:2):
   - LOWER TIER: four rows of cedar pillars 2.5 x 2.5 running ALONG the house (north-south, Rashi 7:2): two rows on the long edges and two
     dividing the width into three equal spaces: row centres x 79.25, 95.083, 110.917, 126.75 (so the clear between rows is 13.33).
     11 pillars per row, every 10 amot (z 470.75 .. 568.25) — the count per row is a model choice (Rashi gives none). Height 20 (model
     choice: 20 + beams 1 + upper tier 8 + עבים 1 = 30, the verse's height). No stone walls and no doorways: "בית הקיץ עשוי לאויר",
     "פתחים פתחים" (Rashi 7:5) — the ground tier is open between the pillars (model choice following Rashi; the hewn stones of 7:9-12 are
     then the terrace, the foundation course and the other buildings). Keep the visible foundation course around the footprint.
   - BEAMS (כרתות ארזים = מרישים, Rashi 7:2, Radak): on each row a continuous cedar beam 2.5 wide x 1 high running the whole length
     (y 20..21), from pillar to pillar.
   - UPPER TIER = "ועמודים ועב על פניהם" (Rashi 7:6): on each beam, pillars 2.5 x 2.5 x 8 over the lower pillars (y 21..29); on them the
     עבים: beams 2.5 x 1 along each row (y 29..30). Between the upper pillars of every row the woven partitions (צלעות, Rashi 7:3), cedar
     panels 0.4 thick x 8 high (y 21..29) filling each 7.5-amah span, "כולן פתחים וחלונות": in every span a square-headed doorway 3.5 wide x
     5.5 high from the span's floor (y 21) and a window 1.5 x 1.5 on each side of it at y 25.5..27 (model choice: Rashi gives shapes, not
     counts); the openings framed with thin boards 0.15 thick (Rashi 7:5 "מחופין היו הפתחים בנסרים דקין"). Build the panels with pal_wall
     (axis "z", holes). Label the tier "העמודים והעב — העלייה (רש״י ז, ו)" and the whole upper storey "'ואולם על פניהם' — האולם העליון (רש״י)".
   - CEILING of the three spaces = the 45 big boards (7:3): per space 15 cedar boards 0.5 thick (y 30..30.5), each spanning the gap between
     the two rows (length 15.83 along x, resting on the עבים), 4 wide along z (model choice; Rashi: the 15 widths did not reach the full
     100), laid side by side from the SOUTH end: z 569.5 .. 509.5 (60 of the 100). Label "45 נסרי הסיפון (מלכים א ז, ג)".
   - The SECOND ROOFING (Rashi 7:4 "שקופים") over the remaining 40 (z 469.5..509.5) of each space: small cedar beams (מרישין קטנים)
     0.6 x 0.6 spanning the gap between rows (along x, resting on the עבים at y 30..30.6), every 4 amot along z, each made of THREE pieces
     end to end (visible joints: three boxes with 0.03 gaps); on both sides of every small beam a ledge (שקוף) 0.25 x 0.25 at its mid
     height; thin boards 0.2 thick, 4 long (along z, between two small beams) and 0.8 wide, laid side by side on the ledges across the
     gap so that their top is flush with the big boards' top (y 30.5); "מחזה אל מחזה": the ends of the boards of one bay face the ends of
     the next. Label "קירוי הנסרים הדקים על המרישין — 'שקופים' (רש״י ז, ד)". No stone roof slab, no parapet in this variant (model choice).
   - Windows: none in this variant besides the partitions' openings (Rashi reads 7:4 as roofing, not windows).
   - Labels of the Rashi variant: pushed to ctx.labels with `layers: ["palace", "forestRashi"]` (array; the UI shows a label only while
     all listed layers are visible — new contract, the integrator implements it). Metzudot variant labels: `layers: ["palace", "forestMetzudot"]`
     (move the existing "בית יער הלבנון" and "העמודים והעב" labels into their variants; add "העמודים והעב (מצודות ז, ו)" wording there).
     The shared labels keep `layer: "palace"`.
3. The removable boards: `ctx.forestBoardsCut = []` — a hide-list like ctx.yatziaCut (the UI toggles `visible` of every mesh in it; off
   by default means VISIBLE). Push into it: Rashi variant — the 45 big boards, the small beams, the ledges and the thin boards (so that the
   עבים and the upper pillars stay and the beams are seen from above); Metzudot variant — its 45 boards, its stone roof slab and the fascia
   / parapet pieces over the forest house (so its כרתות beams on the pillars are seen). Keep the Metzudot slab also in ctx.cutaway as now.
4. Keep the 15-pillar Metzudot rows, the "פנים בית יער הלבנון" fly target (tg [103, 5, 520], cam [225, 70, 650]) valid for both variants.
   Add `ctx.shared.flyPoints.forestRoof = { pos: [60, 55, 520], target: [103, 30, 520] }` (looking at the roof from the west, above the
   terrace) and `ctx.shared.flyPoints.forestUpper = { pos: [150, 38, 600], target: [103, 25, 540] }` (the upper tier from the south-east).
5. Every new dimension carries its source or "model choice" in a comment. Write at the end of the file, in `ctx.shared.forestHouseNotes`
   (a Hebrew string, 4-8 sentences), what each variant shows and which numbers are model choices — the integrator puts it in the UI and
   DEV_NOTES.
6. Verify with a headless run (the integrator's harness pattern: `node tools/assemble.mjs` then a node script that loads plugin/bundle.js
   with a DOM stub — see tools/check.mjs and the scratchpad's run-*.cjs for how the earlier rounds did it) that: the Rashi variant's
   pillars, beams, partitions, boards and small boards do not intersect each other or the hall of pillars; all boards' tops are at y 20.5
   (world, = Y + 30.5); the Metzudot variant still builds; `set("metzudot")` / `set("rashi")` flip the groups; ctx.forestBoardsCut lists
   only meshes; labels have the `layers` arrays. Report the numbers.

## Status (27.10.2026, late evening) — all nine items built; NOT packaged (the user: wait for more corrections)
- 1 carvings: `int_carvedTex` texture on every skin/door (55-interior.js). 2 traksin: three boxes + `int_uvShift`. 3 cherubim: `buildCherub`, `ctx.shared.cherubPose`,
  Chazal's "בנס הן עומדין" in the UI. 4/5 forest house: Rashi reading (default) + Metzudot reading, `ctx.shared.forestHouse`, `ctx.forestBoardsCut` (60-palace.js, by a
  subagent; deviations from H.5: pitch 9.75, small beams every 3.93, thin boards 3.33 x 0.833, roofing ends at z 569.4, lattice partitions, no floor for the upper tier).
  6 devir doorway: `ctx.shared.devirDoor` pent/five. 7 rotation: 90-entry.js perf/orbit settings + lighter cloud ray test (not reproduced). 8/9 UI: opinions table,
  source links on toggles/layers, places without opinion duplicates, new places and EXTRAS, new deep links. Docs: DEV_NOTES, header.txt, SPEC §9c, the Hebrew sheet (34-42).
- Review: a six-dimension adversarial review workflow was run on the changes (see the session's workflow journal); confirmed findings were fixed before the next package.
