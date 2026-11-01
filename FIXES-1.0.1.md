# Fix round 1.0.1 — the user's corrections after installing 1.0.0

Read SPEC.md first (conventions, helpers, coordinates). Then apply ONLY the items for your module below. Keep every source comment
rule (SPEC §1). Bump nothing in manifest/DEV_NOTES (the integrator does that). Run `node --check` on your file(s) when done.

## A. The chambers (תאים / יציע) — 50-heichal.js
The user: "התאים צריכים סגירה גם מבחוץ + תוספת לפתיחה בשביל צפיה" and "התאים צריכים להיות כפי שיטת רש"י 3 קומות – מדויק!".
What he saw: from outside, the yatzia and house walls turn transparent (the fade loop makes every occluder between the camera and the
orbit target translucent, and the audit round registered the house/ulam/yatzia walls as occluders), so the chambers look open.
1. The house, the ulam block (hall, wings, front wall), the east wall and the yatzia (ta) walls must NOT be occluders: remove their
   `H.occ(...)` registrations and the invisible proxy walls (keep `occlude:false` on H.wall calls). Only the court walls (20-mount/30-courts)
   fade. The windows' `fadeWith` is then meaningless: leave the windows as plain meshes (no occ).
2. Add a dedicated opening for viewing: collect into `ctx.yatziaCut = []` the meshes that hide the chambers from the SOUTH: the south ta
   wall (the H.wall at z = 26 with the outside doorway), the south strip of the yatzia roof slab and its parapet, and the south ulam
   wing's west/south walls only if they cover the chambers' east end (probably not — check). Do NOT put them in `ctx.cutaway` any more
   (the general "חתך פנים" keeps removing the south HOUSE walls and roofs as before). The UI will toggle `ctx.yatziaCut` with a
   checkbox "פתח את התאים (היציע) לצפייה" and switch it on for the view "היציע".
3. Make the three stories exactly Rashi's (I Kings 6:6, 6:8, 6:10 with Rashi; Middot 4:3 via Rashi for the 38 chambers), measured
   from the house floor LV.HEI = 12: story 1 clear height 5 (y 12..17), cedar floor slab 0.5 (y 17..17.5) resting on the first ledge;
   story 2 clear 5 (17.5..22.5), slab 22.5..23 on the second ledge; story 3 clear 5 (23..28); roof slab 28..28.5 (cedar) + stone parapet
   0.5. House wall thickness: 6 from y 12 to 17 (outer face z ±16), 5 from 17 to 22.5 (±15), 4 from 22.5 up (±14) — the ledges are at
   y 17 and 22.5 (Rashi: "כשעולה כתל ההיכל חמש אמות... כנס בו אמה"). Chamber clear widths 5 / 6 / 7 follow. The ta wall (5 thick) rises to
   28.5 at z ±26 / x -79.5. Keep 38 chambers (5+5+5 north, 5+5+5 south, 3+3+2 west), partitions 1 thick, the doorways between chambers
   (2 wide x 4 high: one into the right neighbour, one into the left, one hatch 2x2 in the floor to the chamber above — Rashi on 6:8),
   the outside doorway in the MIDDLE south chamber of the lowest story (2.5 x 4 at x ≈ -36.5, z = 26 face) and the לולים spiral stair
   inside it (a stone column with instanced wedge/step boxes winding up through real 2x2 openings in the slabs above it: cut the slab
   with H.wall-like boxes or build each slab as 2 boxes leaving the hole). Windows stay above the yatzia roof (y 29..33), kodesh only, 6 per
   side. Update `ctx.shared.heichal` if you expose story heights.
4. Yachin & Boaz must be viewable whole: add `ctx.ulamCut = []` holding the ulam FRONT wall pieces (all bands of the x 12.5..18.5 wall
   across z ±41, its jambs/lintel trim) and the ulam roof/ceiling slabs over the hall and wings; the UI toggles it (checkbox "פתח את
   האולם לצפייה") and switches it on for the view "יכין ובועז". Set the flyPoint `yachinBoaz` to a camera OUTSIDE the ulam looking in:
   `{ pos: [44, 24, 6], target: [5.5, 22, 0] }` so both pillars (y 12..34.5) are in frame when the front wall is removed.
5. Labels: the big exterior label "ההיכל" (x -30, y 56, z -18) → "בית ה׳" (the whole house); keep "האולם", "קודש הקדשים" etc.
   (The interior label "ההיכל" for the kodesh is in 55-interior.js.)

## B. The entrance to the kodesh — 55-interior.js
The user: "יש בעיה בכניסה לתוך ההיכל (אגב ההיכל זה איפה שהמנורות ולא החלק החיצוני יותר)".
1. The two cypress doors of the heichal doorway (10 wide) currently stand folded ~70° INTO the opening and narrow the passage. Fold
   each leaf fully back: both boards of each leaf lie flat against the reveal of the opening (parallel to x, at z ≈ ±4.6, inside the
   6-thick wall, x -3.5..2.5), leaving the whole 10 x 20 passage clear. Keep the carvings/gold and the pivots.
2. Rename the interior label "הקודש" (x -25) → "ההיכל (הקודש)". Keep "קודש הקדשים".
3. Nothing may protrude into the passage x -3.5..2.5, z ±5, y 12..32 (check posts/lintel/trim: they sit on the east face only).

## C. The Sea and its oxen — 45-vessels.js
The user: "צריך להראות קצת יותר את צמדי הבקר מתחת לים של שלמה".
1. Move both Sea placements to z ±36 (`rashi` z -36, `radak` z +36; x stays 35) so there is room around it (the bases' outermost base
   ends at z ±30; the court wall is at ±67.5; the altar ramp is at x ≥ 41.5). Update the label and `flyPoint()` accordingly.
2. Make the 12 oxen clearly visible: body 2.8 long x 1.3 wide, back height 3.6 (basin floor at 3.6 above the court floor), heads with
   horns protruding 1.2 beyond the basin's outer wall, legs 1.6 long, 3 per side with their hindquarters meeting under the centre
   (I Kings 7:25 "וכל אחוריהם ביתה"); a slightly darker bronze than the basin so they read as separate figures. Verify no part of an ox
   crosses x < 29.3 (the bases row ends at x 29) or x > 41.3 (the ramp starts at 41.5).
3. Keep everything else (square lower part, round upper part, knobs, water).

## D. The outer court — 20-mount.js (+ 30-courts.js only if a label needs it)
The user: rename "החצר החדשה / עזרת נשים" to "החצר החיצונה", and it was not empty: "היו בה שימושים, הוסף".
1. Rename the 3D label to "החצר החיצונה" and the comments; keep the keys `newCourt`, `shared.newCourt`, `gates.newCourtE` unchanged.
2. Add to the court, with labels and source comments (sources outside Kings I 6-7 are allowed here because the user asked):
   a. לשכות (chambers) along the inside of the court's north and south low walls: two per side, each 12 x 10 x 8, stone with a cedar
      roof and a door toward the court — Jer 35:4 "לשכת בני חנן... אשר אצל לשכת השרים אשר ממעל ללשכת מעשיהו", Jer 36:10 "בלשכת גמריהו...
      בחצר העליון פתח שער בית ה' החדש", II Kings 23:11 "לשכת נתן מלך הסריס"; label "לשכות (ירמיה לה, ד; לו, י)".
   b. "העמוד" — the king's standing place at the entrance to the inner court (II Kings 11:14 "המלך עומד על העמוד כמשפט"; 23:3): a
      round stone platform 4 across x 1 high with a short pillar, just east of the inner court's east gate steps (x ≈ 104, z 0 → put it at
      x 106, z 8 so the steps stay clear); label "העמוד (מלכים ב יא, יד)".
   c. The donation chest at the gate (II Chr 24:8 "ויעשו ארון אחד ויתנהו בשער בית ה' חוצה"; II Kings 12:10): a cedar chest 2 x 1.2 x 1.2
      with a lid slot beside the court's east gate inside (x 224, z 7); label "ארון הנדבות (דברי הימים ב כד, ח)".
   d. Name the court's gate "השער המזרחי של החצר החיצונה"; mention in a comment II Kings 15:35 "שער בית ה' העליון" (Yotam) as the name
      tradition gives the upper gate (not modeled separately).
3. Expose `ctx.shared.outerCourtItems = [{name, x, y, z}]` for the UI.

## E. The palace — 60-palace.js
The user: "מה עם בית שלמה? למה הוא לא מוצג כחלק מהר הבית ולפי מה החלטת באיזה מיקום הוא היה."
1. The layer starts VISIBLE (`ctx.layers.palace.visible = true`); the UI checkbox will reflect it.
2. Keep the placement (south of the Temple's great court, lower by 10) but write the basis in the header comment and in
   `ctx.shared.palaceBasis` (a Hebrew string the UI shows): the palace was below the Temple and one went UP from it to the house of the
   LORD — I Kings 10:5 "ועלתו אשר יעלה בית ה'", II Kings 11:19 "ויבאו דרך שער הרצים בית המלך", Jer 26:10 "ויעלו מבית המלך בית ה'", Jer 22:1
   "רד בית מלך יהודה"; and the city (עיר דוד) lay south of the Temple: I Kings 8:1 the ark is brought UP "מעיר דוד היא ציון" to the house.
   Hence: adjacent on the south, on a lower terrace — the exact distance (20 amot) and the 10-amah drop are model choices.
3. Add a short stone-paved way with the existing 20 steps from the palace's north gate up to the Temple's south gate (already built;
   make sure it is visible by default and labelled "המעלות מבית המלך אל בית ה׳ (מלכים א י, ה)").

## F. The panel — 70-ui.js
1. Renames: view "ההיכל" (exterior, key heichalFront) → "הבית מבחוץ"; view "הקודש" (key kodesh) → "ההיכל (הקודש)"; place titles likewise;
   the group "הבית מבפנים" items: "הקודש" → "ההיכל (הקודש)". INFO text for kodesh: start with "ההיכל הוא הקודש, ארבעים אמה (מלכים א ו, יז),
   ובו המנורות, השולחנות ומזבח הזהב". View "החצר החדשה"/"עזרת נשים" → "החצר החיצונה"; place title "החצר החיצונה"; INFO: "החצר
   החיצונה: לפנים ממנה חצר הכהנים (רש״י מלכים א ו, לו: 'לפנים מעזרת נשים'). בה לשכות (ירמיה לה, ד; לו, י), 'העמוד' שעליו עמד המלך
   (מלכים ב יא, יד; כג, ג) וארון הנדבות שבשער (דברי הימים ב כד, ח)." Add place items for the three (read positions from
   `ctx.shared.outerCourtItems`), with refs: Jeremiah = Otzaria book 13 (BASE from src/refmap.json: add chapters 35 and 36), II Kings =
   book 11 (NOT in refmap.json — use Sefaria string refs "II_Kings.11.14", "II_Kings.23.3", "II_Kings.15.35", "II_Kings.12.10"), II Chr 24:8
   via V(39, 24, 8) — add BASE[39][24] from refmap.json (24: 507).
2. Toggles (section "תצוגה"): add "פתח את התאים (היציע) לצפייה" → toggles visibility of every mesh in `ctx.yatziaCut`; add "פתח את
   האולם לצפייה" → `ctx.ulamCut`. The view "היציע" switches the first on (and off again when another non-yatzia view is chosen, like
   autoCut); the view "יכין ובועז" switches the second on likewise. Both default off. Keep the general "חתך פנים" as is.
3. Palace: the checkbox "בית שלמה" starts checked (layer visible by default); INFO/places for the palace add the placement basis
   (`ctx.shared.palaceBasis`) and refs: I Kings 10:5 (V(10,10,5)), I Kings 8:1 (V(10,8,1)), Jer 26:10 and 22:1 via book 13 (add chapters 22
   and 26 to BASE[13] from refmap.json), II Kings 11:19 via Sefaria string.
4. The place "יכין ובועז" and the view use the new flyPoint (outside the ulam, with the ulam opened).
5. "השלמות" group: add "מקום בית שלמה" (sources above, distance/drop model choice), "פתיחת התאים והאולם היא כלי צפייה בלבד".
6. EXTRAS / fade: nothing else. Keep the compass fix.

## G. Integrator (not for agents)
- manifest version 1.0.1; DEV_NOTES changelog 1.0.1; header.txt line; sheet item 8 (החצר החיצונה) and the new items; assemble, test, package.
