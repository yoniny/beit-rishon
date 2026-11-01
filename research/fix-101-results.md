
# report 
Both checks pass (`node --check` OK; `tools/check.mjs`: "OK: no blocking problems" — the two WARN lines about layers `ulamRambam`/`palace` are pre-existing and unrelated to this file).

## Report — section B, `C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1\src\55-interior.js`

**Changed**

1. **B.1 — heichal doors folded fully back.** New constants in the door block: `HX = CO.xHouseE - 0.2` (= 2.3, the pivot axis 0.2 inside the east face) and `DZ = INT_HEI_DOOR_W / 2 - 0.4` (= 4.6, the leaf's centre plane). Both hinge groups now sit at `(2.3, F, ±4.6)` with `hinge.rotation.y = 0` and `fold.rotation.y = 0` (was `∓0.35` / `±0.25`), so each leaf's two boards (2.5 wide each, 0.33 thick) lie flat along the reveal, parallel to x, inside the wall thickness: x -2.7..2.3 (within -3.5..2.5). With the reliefs (0.215 proud of each face) the leaf occupies z ±4.385..4.815, leaving 8.77 of the 10-wide passage clear at full height. Carvings (discs, cherubim, palms), goldLeaf/goldRelief materials and the four gold pivots are kept; the pivots moved to the new axis `(2.3, y, ±4.6)` (top and bottom). Comments carry the source/model-choice notes and a "1.0.1" note quoting the user's complaint.
2. **B.2 — label rename.** `ctx.labels` entry `"הקודש"` (x -23.5, y 40.5, z 0, size 3.5) → `"ההיכל (הקודש)"`, same position/size. `"קודש הקדשים"` unchanged.
3. **B.3 — passage audit (x -3.5..2.5, z ±5, y 12..32).** Verified, no code change needed: the doorposts are at x 2.5..3.5, z ±5..6 and the lintel at x 2.5..3.5, y 32..33 (east face only); the ulam cedar courses are at x 2.50..2.58 and z ±6..10 (full width only at y ≥ 35); the kodesh floor/skins end at x -3.5 (east skin x -3.7..-3.5 with the 10×20 opening); all vessels are at x ≤ -30.5. The only things inside the passage are the two folded leaves along the reveals, as B.1 requires. (50-heichal.js's east wall is a plain `H.wall` with the 10×20 opening — nothing of it enters the passage either.)

**Skipped:** nothing from section B.

**For the integrator**
- No new `ctx` fields; section B names none. `ctx.shared.flyPoints` keys (`kodesh`, `kodeshHakodashim`, `menorot`, `shulchanot`, `heichalDoor`, `devirDoor`) and their values are unchanged; `ctx.cutaway` contents unchanged.
- The only label-text change is `"הקודש"` → `"ההיכל (הקודש)"`. The UI's own view/place titles `"הקודש"` (70-ui.js lines 74 and 1052) are section F and 

# report 
Both checks pass (`node --check` OK; `tools/check.mjs`: "OK: no blocking problems" — the two `WARN: UI never references layer ...` lines are the checker's pre-existing heuristic, since 70-ui.js reaches the layers through its `LAYER_ROWS` table / `ctx.layers[name]`, not a `layers.palace` literal). File stays UTF-8, no BOM, LF endings.

## Report — `C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1\src\60-palace.js` (section E applied in full)

**E.1 — layer visible by default**
- `g.visible = true` in `buildPalace` (was `false`), with a comment. The UI's existing `toggleRow(text, !!(g && g.visible), ...)` therefore starts the "בית שלמה" checkbox checked with no UI change needed.

**E.2 — placement basis**
- Header comment rewritten: placement kept (north wall 20 amot south of the Temple's great-court wall, terrace floor y = -10, axis x = 103), basis now stated: I Kings 10:5 "ועלתו אשר יעלה בית ה'" (with the parallel II Chr 9:4 "ועליתו" = the ascent), II Kings 11:19 "ויורידו את המלך מבית ה' ויבאו דרך שער הרצים בית המלך", Jer 26:10 "ויעלו מבית המלך בית ה'", Jer 22:1 "רד בית מלך יהודה", I Kings 8:1 "מעיר דוד היא ציון" (the city below/south of the Temple); the 20-amah gap and the 10-amah drop (20 steps) are marked model choices.
- New field **`ctx.shared.palaceBasis`** (Hebrew string, same content, with the verse references inline) for the UI's palace INFO / "השלמות".

**E.3 — the way up to the Temple**
- Geometry unchanged in extent (causeway x 95..111, z 335..352.5, y -30..-10; 20 steps of 0.5 from y -10 at z 352.5 to y 0 at z 342.5; landing z 335..342.5). The landing is now a stone body (y -10..-0.04, `M.stoneSmooth`) plus a 0.1-thick `M.pave` slab on top (top still at y 0.06, i.e. the existing hair above `LV.HAR`, still under the gate threshold at 0.18), so it reads as a stone-paved way continuing the terrace paving to the Temple's south gate. Visible by default with the layer.
- Label renamed: `"המעלות אל הר הבית"` (x 112, y 4, z 346, size 2.5) → **`"המעלות מבית המלך אל בית ה׳ (מלכים א י, ה)"`** at x 103, y 8, z 343.75, size 6 (shows from the palace overview camera ~530 amot away; a size-6 label is shown up to 700). Pushed as before via `lbl()` → `ctx.labels` with `layer: "palace"` and into `ctx.shared.palaceLabels`.

**Skipped**: nothing from section E. Materials, flyPoint `palace` (`pos [400,170,760], target [103,-5,520]`), all other labels and 

# report 
Smoke test clean: no block was skipped, no occluders added by the new items (44 after buildMount, all pre-existing), all new meshes lie inside the court and clear of the inner court's east-gate steps and the gate piers (the one "collision" reported is the steps mesh matching its own box).

## Report: 20-mount.js, FIXES-1.0.1 section D

File: `C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1\src\20-mount.js` (untouched copy: `C:\Users\x1\AppData\Local\Temp\claude\C--Users-x1-AppData-Roaming-Claude-scratch-workspaces-6cc20f1e-776f-4297-b95a-bf0558e72515-48a5e90a-221b-4185-bd62-4df70efb9058-scratch-2026-10-26-9aa69f\5cde0745-88eb-454f-928a-5b900122f33d\scratchpad\20-mount.js.bak`)

**Changed**

- D.1 rename: 3D label `"עזרת נשים"` → `"החצר החיצונה"` (same position x 161, y 13, z 22, size 4); header, constants, section comments and the `console.warn` text now say "outer court (החצר החיצונה)". Rashi's term עזרת נשים remains only in source-citation comments. Keys `newCourt` (flyPoint), `shared.newCourt`, `gates.newCourtE` unchanged; `shared.newCourt` gained `name: "החצר החיצונה"`.
- D.2.a לשכות: 4 chambers (2 per side) against the inside of the north/south low walls, each 12 (x) × 10 (z) × 8 (y): stone walls 1 thick, 7.5 high, cedar roof slab 0.5 (top y 11, 4 above the low wall), doorway 2.5 × 4 toward the court (H.wall, `occlude:false`), stone threshold, cedar door leaf 2.3 × 3.7 standing open ~70° into the chamber. Centres x 133 and 193; z ±56.5..66.5 (back wall flush on the low wall's inner face ±66.5). Labels: `"לשכות (ירמיה לה, ד; לו, י)"` once per side at (163, 15, ±61.5), size 3.5. New constant `MNT_LISHKA`.
- D.2.b העמוד: round platform r 2 (4 across) × 1 high at (106, 3, 8), pillar base/shaft/capital r 0.6, 3 high (y 4.3..7.3, top 7.65), 2 steps (rise 0.98) on the east side x 107.6..108.6. Clear of the east-gate steps (x 98.5..101.5, z ±6). Label `"העמוד (מלכים ב יא, יד)"` at (106, 14, 8), size 3. Constant `MNT_AMUD`.
- D.2.c donation chest: cedar (tinted 0x9A6A3C) 1.2 (x) × 1.2 (y) × 2 (z) at (224, 3, 7): body 1.0 + lid 0.2 with a dark slot 0.12 × 1.2, two bronze bands. Clear of the gate piers (z ±5..6.5, x 227.2..229.8). Label `"ארון הנדבות (דברי הימים ב כד, ח)"` at (224, 8, 7), size 2.5. Constant `MNT_ARON`.
- D.2.d gate name: new label `"השער המזרחי של החצר החיצונה"` at (234.5, 12, 0), size 3.5; `gates.newCourtE` gained `name: "השער המזרחי

# review  ok=true
60-palace.js passes review; section E is implemented in full and nothing else changed. (1) node --check OK; no import/export; `async function buildPalace(` exactly once; tools/check.mjs "OK: no blocking problems" (its two WARN lines are the literal-string heuristic — 70-ui.js reaches layers via LAYER_ROWS/ctx.layers[name]); UTF-8, no BOM, no CR. I also executed buildPalace(ctx) under node with the real 00-lib.js + 10-core.js and DOM stubs (harness at C:\Users\x1\AppData\Local\Temp\claude\C--User


# report 
Both checks pass (`node --check` OK; `tools/check.mjs`: "OK: no blocking problems" — the two `WARN: UI never references layer ulamRambam/palace` lines are pre-existing: the UI reaches those layers through the `LAYER_ROWS` loop, not by literal name). The only remaining "עזרת נשים" in the file is inside the Rashi quote the FIXES prescribe.

## Report — `70-ui.js` (section F), file: `C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1\src\70-ui.js`

**F.1 Renames / texts / refs**
- Views: `heichalFront` "ההיכל" → "הבית מבחוץ"; `kodesh` "הקודש" → "ההיכל (הקודש)"; `newCourt` "עזרת נשים" → "החצר החיצונה" (keys unchanged).
- Places: "עזרת נשים (החצר החדשה)" → "החצר החיצונה" (new info incl. the gate name and II Kings 15:35 "שער בית ה׳ העליון"); group "הבית מבפנים": "הקודש" → "ההיכל (הקודש)"; the exterior place "ההיכל" → "הבית (בית ה׳)" (not literally "הבית מבחוץ" because that is already the group's title; info now says "ההיכל" = the kodesh per I Kings 6:17, the whole house = "בית ה׳").
- INFO `kodesh` now starts with the prescribed sentence; INFO `newCourt` = the prescribed text + "גודלה ומפלסה — בחירת מודל"; `heichalFront` starts "בית ה׳ מבחוץ"; `heichalSouth`/`yachinBoaz` got one sentence saying the view removes the wall for viewing only.
- Three new place items in "הר הבית והחצרות": "לשכות החצר החיצונה" (Jer 35:4, 36:10 → V(13,35,4)/V(13,36,10); II Kings 23:11 string), "העמוד — מקום המלך" ("II_Kings.11.14", "II_Kings.23.3", II Chr 23:13 → V(39,23,13)), "ארון הנדבות שבשער" (V(39,24,8), "II_Kings.12.10"). Positions are read at click time from `ctx.shared.outerCourtItems` (matched by name fragment "לשכ" / "עמוד" / "ארון"; `x,y,z`), fallback FIXES D.2 positions: chambers [161, y+4, -61.5], pillar [106, y+1.2, 8], chest [224, y+0.6, 7] with y = `ctx.shared.newCourt.y` (3). Camera = item + N amot toward the court centre (55 / 24 / 14) and 0.55·N higher.
- `ui_BASE`: 39 adds `23: 485, 24: 507`; 13 adds `22: 530, 26: 652, 35: 912, 36: 932` (from refmap.json). II Kings refs are Sefaria strings (open on Sefaria, as `ui_sefToOtz` returns null for them). `ui_REFS.newCourt` dropped II Chr 20:5 (20-mount.js dropped that identification); `ui_REFS.palace` adds I Kings 10:5, 8:1, Jer 26:10, 22:1, "II_Kings.11.19". EXTRAS texts "מידות החצרות", "גובה חומות", "שערי החצר הגדולה" now say "החצר החיצונה".

**F.2 Toggles**: new checkboxes "פתח את התאים (היציע) לצפייה" (`ctx.yatz

# review  ok=true
Reviewed C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1\src\55-interior.js against FIXES-1.0.1.md section B. Verdict: OK, no blockers or majors.

(1) Integrity: `node --check` passes; no import/export/require; `async function buildInterior(ctx)` defined exactly once; `tools/check.mjs` reports "OK: no blocking problems" (the two WARN lines are about layers in the UI, unrelated). An ac
- [minor] 50-heichal.js (section A, not the reviewed module) — label line 531, f: Not a defect of 55-interior.js, but relevant to its B.2 rename: 50-heichal.js has not received section A yet (exterior label is still "ההיכל" instead of "בית ה׳", yachinBoaz is still the old inside-the-hall flyPoint, no ctx.yatziaCut / ctx.ulamCut, house/ulam walls still registered as occluders — 13

# report 
Report for section C (45-vessels.js, `buildVessels` kept)

File changed: C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1\src\45-vessels.js (only this file; `plugin/`, `10-core.js`, `70-ui.js` untouched).

C.1 Sea placement
- New top-level constant `VSL_SEA_Z = 36` (with a source/model-choice comment). `rashi` = {x 35, z -36}, `radak` = {x 35, z +36}; x still comes from `vsl_layout(CO).seaX` (CO.seaX 35). The fallback `seaPlacement` in `buildVessels` uses the same ±36.
- Label "הים של שלמה" now starts at (35, 18.1, -36) (y = AZ 6 + floor 3.6 + 5 + 3.5) and `set()` moves it with the group as before. `flyPoint()` keeps the SPEC formula, so it now gives rashi {pos [75, 30, 4], target [35, 12, -36]}, radak {pos [75, 30, 76], target [35, 12, 36]}. `flyPoints.yam` updated the same way.
- 1.0.0 DEV note about the "shoulder line" rewritten; ROW POSITION comment corrected (oxen no longer meet the lavers' rims).

C.2 Oxen (`vsl_oxGeometry` rebuilt, constants `VSL_OX_BACK 3.6`, `VSL_OX_FRONT 2.75`, `VSL_OX_PROTRUDE 1.1`)
- Body 2.8 long x 1.3 wide (barrel + spheroid chest/rump), back at 3.6 = basin floor (`B = VSL_OX_BACK`, was 3; knobs, water, shoulder plate, lathe all follow B). Belly at 1.6, legs 2.2 cylinders giving ~1.7 clear under the belly. Head held low with horns (tips at local 2.22, 3.48, ±0.68); muzzle tip 2.75 before the body centre.
- Placement: `D = HO + 1.1 - 2.75 = 3.52` from the axis; rumps end 2.12 from the axis (tails 1.96), so the twelve hindquarters meet under the centre; LAT 1.5 (0.2 between flanks, 0.14 between neighbours' horn tips).
- Oxen bronze: 0x835429, roughness 0.48 (basin 0xa26f2e / 0.38) — reads as separate figures.
- Measured with the real three.js bundle (merged geometry, 12 instances, both placements): world x 28.74..41.26, z ±(29.74..42.26), y 0..3.6 above the court; 1840 triangles per ox. Highest point under the floor slab = the back (inside the slab, as intended), neck top 3.38 < slab bottom 3.43.

Deviation to note (guard x ≥ 29.3): protrusion was trimmed from the asked 1.2 to 1.1 so the EAST tips stay at 41.26 ≤ 41.3 (ramp at 41.5 is clear by 0.23, verified visually in the radak placement). The WEST tips are at 28.74, i.e. 0.56 past the 29.3 line, but there is no contact: the bases' row ends at z ±30.05 and the nearest ox flank is at z ±33.8 (3.8 amot apart; the south/north trios at z ∓29.74 are 3.8 east of the row's

# report 
All checks pass: `node --check` OK, `node tools/check.mjs` OK (only the two pre-existing WARNs about layers the UI never references), and the node smoke build of the module runs without warnings. Final report:

**File:** `C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1\src\50-heichal.js` — `async function buildHeichal(ctx)` kept; section A applied completely.

**A.1 – no occluders.** Zero `H.occ` registrations remain in the module (runtime check: `H.OCC.length === 0` after the build). East wall `H.wall` → `occlude: false`; N/S/W house walls, ta walls and the ulamRambam blocks are plain `H.box`; `bandWall` lost its `H.occ` + invisible proxy walls + `fadeWith`; windows are plain instanced meshes (`sideUpper` removed); `hei_holeWall`'s default `occlude` is now `false` (so the upper side walls and the aliyot-layer walls are opaque too).

**A.2 – `ctx.yatziaCut`** (3 meshes, no longer in `ctx.cutaway`): south ta wall x -79.5..-3.5, y 12..28.5, z 21..26 (with the 2.5×4 doorway at x -36.5); south roof strip (cedar) x -74.5..-3.5, y 28..28.5, z 14..21; south parapet x -79.5..-3.5, y 28.5..29, z 25..26. South ulam-wing walls NOT included: the wing sits at x 2.5..18.5, east of the chambers' east end (x -3.5), so it never covers them from the south.

**A.3 – Rashi's three stories (new numbers).** Floors `SY = [12, 17.5, 23]`, clear tops `ST = [17, 22.5, 28]`; cedar slabs 0.5: 17..17.5 over z 15..21 and 22.5..23 over z 14..21 (west pieces x -74.5..-68.5 / -67.5, z ±21); cedar roof 28..28.5 (z 14..21; west x -74.5..-67.5, z ±14); stone parapet 0.5 high × 1 thick at 28.5..29 on the ta walls' outer edge; ta walls to 28.5 (`TAH` 16.5). House wall bands: 12..17 six thick (z ±16), 17..22.5 five (±15), 22.5..46 four (±14, windows cut at 29.75..32.25, band y 29..33 unchanged); west wall -69.5 / -68.5 / -67.5 with the same bands. Partitions now one piece per story (5/6/7 wide × 5 high: y 12..17, 17.5..22.5, 23..28), 24 N/S + 5 west, doorway 2×4 each; 38 chambers unchanged. Hatches (dark 2×2) on the slab tops at 17.53 / 23.03. לולים: column r 0.6, y 12..28 at (-33.5, 18.5); 24 steps (12 per turn) rising 11 from the floor of story 1 (12) to the floor of story 3 (23) (1.0.0 had 36 steps to 27) through REAL stairwell openings in both slabs, x -35.9..-31.1, z 16.1..21, built by a new module-private helper `hei_slab` (slab as up to 4 boxes around the hole). Note: the stai

# review  ok=true
20-mount.js passes: node --check OK, no import/export, async function buildMount(ctx) defined once, tools/check.mjs reports no blocking problems, and a stub run of the module with only the SPEC-listed bare names (Group, Mesh, BoxGeometry, PlaneGeometry, BufferAttribute, MeshStandardMaterial, mergeGeometries) executed every new block without a skip, so no undefined identifiers. Section D is fully implemented with the specified numbers: D.1 label "החצר החיצונה" at (161,13,22) size 4 with keys newC
- [minor] 30-courts.js lines 70 and 89 (comments only): Two comments in the neighbouring module still call the court "the women's court" ("from the women's court floor", "from the women's court, looking west"). FIXES D.1 asks for the comments to be renamed too, but lists 30-courts.js as optional ("only if a label needs it") and it has no label to rename,

# review  ok=true
70-ui.js (C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1\src\70-ui.js) implements every item of FIXES section F; no blockers or majors, two minor notes. (1) node --check passes; tools/check.mjs: "OK: no blocking problems" (the two layer WARNs are the known LAYER_ROWS-loop false positives); no import/export; `async function buildUI(` exactly once; a tokenizer-based scope scan finds no
- [minor] 70-ui.js line 1111 (PLACES group "הבית מבחוץ", item formerly "ההיכל"): FIXES F.1 says "place titles likewise", i.e. the exterior place should follow the view rename to "הבית מבחוץ"; the author renamed it to "הבית (בית ה׳)" instead, because the group is already titled "הבית מבחוץ". The user's actual requirement ("ההיכל" is no longer used for the exterior) is met and the
- [minor] 70-ui.js lines 944-945 (resolveFp, last-resort fallback for the "yam" : The last-resort Sea fly point uses CO.seaZ / CO.seaZRashi (±26 in the unchanged 10-core.js) while 45-vessels.js now places the Sea at z ±36 (FIXES C.1). It is only reached if 45-vessels registered neither seaPlacement.flyPoint() nor flyPoints.yam (both are registered today), so it has no effect on t

# review  ok=true
Section C in 45-vessels.js is implemented and verified; no blockers or majors. (1) `node --check` passes; no import/export; `async function buildVessels(` defined exactly once; `node tools/check.mjs` reports "OK: no blocking problems" with only the two pre-existing layer WARNs. Beyond a static scan I executed the module under node with the real three.js prefix (00-lib.js) plus the box/lathe/uvWorld helpers and CO/LV copied verbatim from 10-core.js: buildVessels ran with zero console errors/warni
- [minor] 45-vessels.js line 45 (VSL_OX_PROTRUDE) and lines 126-130: FIXES C.2 asks for heads protruding 1.2 beyond the basin wall and for no ox part at x < 29.3 or x > 41.3. Built: protrusion 1.1; measured world extents x 28.737..41.263, so the WEST trio's muzzles/horns (462 vertices) cross the 29.3 line by 0.56 while the east tips hold 41.3 (ramp clearance 0.237 in
- [minor] 45-vessels.js lines 134-136 (comment on D): The comment says "the twelve hindquarters meet under the centre of the basin", but with the 2.8-long body and the heads protruding, the rumps end 2.12 from the axis (tails 1.96), leaving a ~4.2 x 4.2 empty square under the centre. All hindquarters do point inward (I Kings 7:25 "אחוריהם ביתה" holds);
- [minor] 70-ui.js line 255 (fallback CO object) and line 944 (resolveFp fallbac: These still carry the 1.0.0 Sea z of +-26. Harmless at runtime: verified that 70-ui.js resolveFp() reads seaPlacement.flyPoint() first and falls back to flyPoints.yam before touching CO.seaZ, and no other module reads seaZ; but the constants and the SPEC text are now inconsistent with the model (the

# review  ok=true
Reviewed C:\Users\x1\AppData\Roaming\Claude\scratch-workspaces\6cc20f1e-776f-4297-b95a-bf0558e72515\48a5e90a-221b-4185-bd62-4df70efb9058\scratch-2026-10-26-9aa69f\bayit1\src\50-heichal.js against FIXES-1.0.1 section A, SPEC 1-2 and 10-core.js. (1) node --check OK, no import/export, exactly one `async function buildHeichal(ctx)`, tools/check.mjs OK (only the two pre-existing UI-layer WARNs); a scratch-assembled full bundle also passes node --check. I built the module with the REAL three.js (00-li
- [minor] 50-heichal.js lines 394-401 (ulam ceilings c1/c2 and the ulam roof), h: The ulam ceilings (y 42..43, 45..46) and the ulam roof (x -3.5..18.5, y 46..47.5, z +-41) were moved OUT of ctx.cutaway and now live only in ctx.ulamCut. FIXES A.4 only asked to ADD them to ulamCut, SPEC 6 says 'Push all ceilings/roof slabs into ctx.cutaway', and FIXES A.2 says the general cutaway '
- [minor] 50-heichal.js lines 244-247 (lulHole) and the hei_slab calls at line 2: FIXES A.3 words the stairwell as 'real 2x2 openings in the slabs'; the implemented stairwell is 4.8 x 4.9 (x -35.9..-31.1, z 16.1..21). The deviation is geometrically forced (r 0.6 column + 1.7-long steps need a ~4.6 well; verified: all 24 step instances lie inside the hole, union x -35.8..-31.2, z 
