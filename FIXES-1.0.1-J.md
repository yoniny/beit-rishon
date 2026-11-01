# Fix round 1.0.1, part J — the user's third list (28.10.2026)

The user's words (Hebrew, verbatim):
1. "יכין ובועז לא היו נראים כך כלל עיין בתמונות שהבאתי לך" — Yachin and Boaz did not look like this at all; look at the pictures I brought.
2. "הבאנר של המצגת מסתיר את כל התצוגה שקול לשנות לו מיקום; הוסף כפתור 1) של מצגת רציפה 2) מצגת לפי סדר הפס' במלכים" — (the integrator).
3. "ראשי הבקר יותר בולטים החוצה ויותר הבלטה שזהו ראש בקר" — the oxen heads must protrude further and read clearly as ox heads.
4. "לא מצליחים לראות את המכונות ופעולתם היטב - אין לשם גישה" — the bases and how they worked cannot be seen well; there is no access.

"The pictures" = the illustrated book "מקרא מפורש — איורי בית המקדש הראשון" (it states it follows Rashi). Rendered pages (view them with
the Read tool; they are images): SCR = C:\Users\x1\AppData\Local\Temp\claude\C--Users-x1-AppData-Roaming-Claude-scratch-workspaces-6cc20f1e-776f-4297-b95a-bf0558e72515-48a5e90a-221b-4185-bd62-4df70efb9058-scratch-2026-10-26-9aa69f\5cde0745-88eb-454f-928a-5b900122f33d\scratchpad
- SCR\user-docs\pdf\zoom\p14L.png — the whole pillar with its measures; p15R.png — the capital close up (labels: שבכה, רימונים, שושנים,
  "2 אמות הגולה התחתונה", "2 אמות הכותרת העליונה", "אמה אחת הכותרת הקטנה", "4 אמות הכותרת הגדולה", "5 אמות הכותרת יחד",
  "3 אמות — חלקי הכותרת המצופים בשבכה"); p15L.png — the two pillars inside the ulam beside the heichal doors; p16R.png (top) — "ועל
  ראש העמודים מעשה שושן": the top half amah of the shaft's wall thin like a lily, the shaft hollow.
- SCR\user-docs\pdf\zoom\p16L.png and p16R.png (bottom) — the Sea on twelve oxen.
- SCR\user-docs\pdf\zoom\p17R.png, p17L.png (measures), p18R.png (panels: lion, ox, cherubim), p18L.png (the body), p19R.png ("the laver
  rests in the כן and the כן in the base" - an exploded view), p19L.png (the wheel: "אופן בתוך אופן", ידות, גבים, חישוקים, חישורים, and
  Rashi's explanation: a small lying wheel turns the big standing one, so the base goes in every direction without turning its body).
All the verses and commentaries (I Kings 7:13-51, Targum, Rashi, Radak, Metzudat David/Zion, Ralbag, Malbim; II Chr 3:15-17, 4:2-6,
4:12-16 with Rashi, Metzudot, Malbim; Jer 52:17-23; II Kings 25:13-17), fetched from the Otzaria library: SCR\src-hiram.txt.

Conventions: SPEC.md §1 (a source comment for every dimension; "model choice" where none; the book is "the illustrated book מקרא מפורש
(the user's reference)" - cite it as a model-choice basis, never as a source of halacha), §2 coordinates (1 = 1 amah, +x east, +z south,
y up; inner court floor LV.AZ 6, house floor LV.HEI 12). Helpers in src/10-core.js: H.box(parent,w,h,d,mat,x,y,z) (y = bottom),
H.cyl, H.lathe, H.ring, makeTex/worldTex/std (canvas textures with bump), M.bronze. Keep `node --check` clean and `node tools/check.mjs`
(run from bayit1 after `node tools/assemble.mjs`) without PROBLEM lines. Headless harness pattern for numbers: SCR\run-interior.cjs,
SCR\review-h2\interior-geometry\check.cjs (DOM stub; concatenate 00-lib + 10-core + your module; root.updateMatrixWorld(true)).

## J.1 — Yachin and Boaz (src/50-heichal.js, section 7 only; also its header notes, labels, flyPoint, ctx.shared.heichal.pillars)
Rebuild the two pillars to look like the book, with Rashi's numbers:
- Shaft: diameter 4 (7:15 "וחוט שתים עשרה אמה" — Rashi: 4 across, hollow, 4 fingers thick, Jer 52:21), 18 high (7:15), its TOP 2 AMOT
  INSIDE the capital (Rashi 7:16 "והעמוד תחוב בכותרת שתי אמות") -> total height 21 (the book: "גובה כל העמוד עם הכותרת — 21 אמות").
  So the shaft is y 12..30 and the capital y 28..33. A smooth polished copper shaft (the book).
- Capital 5 (7:16): (a) the lower part, 2 amot (y 28..30) — the book's "גולה התחתונה" — a band a little wider than the shaft (the book
  ~1.27 x the shaft: diameter ~5.1) covered with rows of lily/rose flowers in relief ("שושנים" in the book; 7:19, 7:22 "מעשה שושן");
  (b) at its top edge the "belly" (Rashi 7:18 "רחבה במקום הדבק... והוא קרוי בטן") with TWO ROWS of pomegranates, 100 per row (7:20
  "והרמנים מאתים טרים סביב"; Radak 7:20; Jer 52:23), threaded on chains (Rashi 7:18, 7:20 "מחורזים בשלשלת"; II Chr 3:16) — the widest
  part, diameter ~5.7; (c) the upper part, 2 amot (y 30..32) — a DOME (Rashi 7:17 "כמין כיפה"; Metzudot 7:20 "ככיפת כובע") covered with
  the network (שבכה) woven of seven palm-frond strands (Rashi 7:17 "שבעה לולבין היה להקף אחד") — a woven/braided relief texture as in the
  book; (d) on top the small capital, 1 amah (y 32..33): a ball ~1.1 across with the same weave (the book "אמה אחת הכותרת הקטנה"; Radak
  7:18, 7:20: "אפשר שגם על ראש הרמונים היו כותרות אחרות", "היו כותרות אחרות מלעיל"). The book's legend: the dome and the ball are the
  "3 amot covered with the network" of II Kings 25:17 ("וקומת הכתרת שלש אמה והשבכה ורמנים על הכתרת סביב").
  DEV notes to keep in the comments: Rashi and Metzudot have the lower 2 amot of the capital flush with the shaft and plain ("שוות לעמוד,
  שלא היו בהן צורה") — the book (the user's reference) draws a decorated band, followed here as a model choice; Radak and Metzudot put the
  lily work of 7:19 (4 amot) on the top surface; Malbim paints it on the ulam wall and puts the pillars outside the ulam; Ralbag: two
  "stones" with columns rising from the network. The 1.0.0/1.0.1 capital (Radak's half amah, a bulging belly to 34.5) is replaced.
- Placement: inside the ulam, right (south, Yachin) and left (north, Boaz) of the heichal doorway (7:21; Rashi 7:15). Move the centres so
  the capital (radius ~2.85) clears the heichal doorposts and lintel on the house wall's east face (x 2.5..3.5, posts z +-5..6 y 12..32,
  lintel y 32..33 z -6..6), the ulam side walls (z +-10), the ulam front wall (x 12.5) and the opened doors; about x 6.6, z +-6.9 (check).
- Materials: warm polished copper like the book (clone M.bronze, adjust color/roughness); the weave and the flowers darker in the cuts.
- Labels "יכין" / "בועז" just above the capitals; ctx.shared.heichal.pillars = {x, z, topY: 33}; the flyPoint "yachinBoaz" re-aimed at
  the new pillars (keep the camera OUTSIDE the ulam: it looks in through the opened front wall, ctx.ulamCut); add a flyPoint
  "yachinBoazCapital" = a close view of one capital from inside the ulam (cutaway on), and push one label per capital part? (no — keep the
  label count low; the UI explains the parts).
- Performance: instance the repeated parts (pomegranates, flowers, chain links); total extra triangles for both pillars <= ~60k.
- Verify (headless, numbers in the report): heights (shaft top 30, capital 28..33), diameters, 200 pomegranates per capital in two rows,
  no overlaps > 0.02 with the doorway posts/lintel, the walls, the ulam ceiling (y 42), the doors, the threshold.

## J.2 — the Sea's oxen and the bases (src/45-vessels.js; src/10-core.js only for CO.seaX if the oxen need room)
### Oxen (I Kings 7:25, 7:44; II Chr 4:4; the book p16)
- The heads protrude clearly beyond the basin: the muzzle about 2 amot beyond the basin's outer wall (was 1.1), the neck, chest and
  forelegs standing at the basin's edge line so the front halves are seen (the book), and the head unmistakably an ox: broad flat forehead,
  squared muzzle with nostrils, eyes, ears out to the sides, long horns curving out and up, a dewlap. Three per side, facing out,
  hindquarters inward ("וכל אחריהם ביתה"). A slightly darker bronze than the basin (as now).
- Clearances (both placements, Rashi NE z -36 / Radak SE z +36): the row of bases (x 25..29, |z| 6..30.05) and Moses' laver (x 27, z 0),
  the ulam steps (x <= 24.5, |z| <= 12), the altar (x 39.5..59.5, |z| <= 10) and its ramp on the south (x 41.5..57.5, z 10..42), the inner
  court walls (|z| 67.5). If the east-facing oxen of the south placement would enter the ramp, move the Sea west by changing CO.seaX in
  10-core.js (keep >= 1 amah from the bases and the steps; update the comments there and in 45-vessels.js; vsl_layout reads CO.seaX).
### The bases (I Kings 7:27-37 with Rashi, incl. "פירוש מבעל צורת הבית" printed after Rashi 7:37; Metzudot; the book p17-p19)
- Body 4 x 4 (7:27); wheels 1.5 (7:32); the square amah y 1.5..2.5 and the round half amah of the mouth (Rashi 7:27, 7:31, 7:35);
  total with the laver 7 (the book). Corner posts; upright bars (שלבים — Rashi 7:28 "כעין שליבות סולם, מקלות נחושת זקופין"); panels
  between them (מסגרות) with reliefs of lions, oxen and cherubim (7:29, 7:36; the book p18R) — draw them as a relief texture (canvas with
  bump), not boxes; the upper boards (סרנים = נסרים, Rashi 7:30) as a band; "לויות מעשה מורד" (7:29) as a thin applied band.
- The כותרת = the roof "כמין כובע משופע מכל צדדיו" (Rashi 7:31) up to the mouth; the mouth: a round opening 1.5 across with a rim 0.5
  high (Rashi 7:31; 7:35), flowers on it ("מקלעות — צורת פרחים", Rashi 7:31); the כן: its round bottom sunk in the mouth, its top a square
  block rising 1 amah (Rashi 7:31 "ולמעלה הימנו הוא בולט אמה"; Metzudot 7:30 "עליונית הכן היה מרובע"); the four כתפות from the corners up
  to under the כן and the laver (7:30, 7:34; Rashi 7:30; the book).
- The laver: a tall cylinder 4 HIGH (Metzudat David 7:38 "גבהו של הכיור"; the book "4 אמות גובה הכיור"), diameter ~1.75 (Malbim: 1 3/4),
  standing in the כן, water at its top (40 bat, 7:38). DEV note: Ralbag reads the 4 as the diameter (the 1.0.0 bowl) — not built now.
- THE WHEELS — "אופן בתוך אופן" (Rashi 7:33 "כעובד גלגלי מרכבה, אופן בתוך האופן שתי וערב"; בעל צורת הבית: "למען יוכל להוליכם אל אשר
  יהיה הרוח והרצון להוליכם... מבלי שיצטרך להפכם"; the book p19L: a small lying wheel at the top of the big standing wheel's fork, on the
  axle-post "ידות" coming down from the base, so the big wheel can turn to any direction): each wheel = a big spoked wheel 1.5 high (rim
  חישוק, spokes חישורים, hub גב) in a fork whose top is a small horizontal ring/wheel turning about a vertical post (ידות) under the base's
  corner. Build the nine resting bases instanced (performance); build ONE base (the outermost north one, z -28) as a separate Group with
  separate parts so it can move.
- THE OPERATION (the user: "פעולתם"): `ctx.shared.mechona = { demo: { start(), stop(), running }, explode: { set(on), on } }`.
  demo: the movable base leaves its place along a back-and-forth path in the free court area east of the row (choose and VERIFY a path
  that never meets the other bases, the Sea (Rashi's placement at z -36 and its oxen), the steps or the altar): at every change of
  direction the four forks first swivel to the new direction (about 0.7 s, the small wheels turning), then the base translates while the
  big wheels spin by distance / radius; the BODY NEVER ROTATES; it returns to its place at the end and loops while running; hook the
  animation into ctx.animated (use the `t` it receives; no setInterval). explode: animate the laver up by ~2.5 and the כן up by ~1.2 above
  the movable base (and back), showing "הכיור מונח בכן, והכן מונח במכונה" (the book p19R). Parts labels: create a layer group
  `ctx.layers.mechonaParts` (visible = false; empty Group added to the vessels group is fine) and push labels with `layer: "mechonaParts"`
  placed around the movable base: "הכיור (ז, לח)", "הכן (ז, כט; ז, לא)", "פי הכותרת (ז, לא)", "הכותרת — גג המכונה (רש״י ז, לא)",
  "הכתפות (ז, ל; ז, לד)", "המסגרות והשלבים (ז, כח–כט)", "אופן בתוך אופן (רש״י ז, לג)" — size ~0.9-1.2, close to their parts (they must
  follow the base when it moves: expose `ctx.shared.mechona.partLabels` = the label objects and update their x/y/z each frame; the UI moves
  the sprites by matching the objects, see how 55-interior.js moveLabels does it — or simpler: keep the labels only for the resting pose
  and hide the layer while the demo runs).
- Fly points: `mechonaClose` (one base from ~9 amot, eye height ~5 above the court floor), `mechonaDemo` (the demo path from the
  north-east, above), keep `mechonot`.
- Performance: the nine instanced bases + the movable one must not add more than ~150 draw calls; check the triangle count.
- Verify (headless, numbers): the base 4 x 4, heights (wheels 1.5, body to 2.5, mouth rim 3.0, כן top 4.0, laver top ~7.5?), the ox
  extents for both placements against every obstacle above, the demo path's clearance at every step (sample the path), the explode, and
  that ctx.shared.mechona works (start/stop/explode) without errors.

## J.3 — the integrator (not for the agents): the presentation banner and the two new presentation modes; the UI places for the bases
(close view, the operation, the exploded view with the parts' layer), the new Yachin & Boaz texts, the oxen text; LABEL_MAP entries for
the new labels; DEV_NOTES / SPEC / the Hebrew sheet; the review round.
