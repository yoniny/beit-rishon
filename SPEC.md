# First Temple (בית המקדש הראשון) 3D plugin — build spec for module authors

Read this whole file before writing a module. The plugin is a sister of the Second Temple plugin ("בית שני", v1.0.19) and reuses its
engine, helpers and UI. Your module is ONE file in `src/` (plain JavaScript, ES2020, no imports/exports, no TypeScript) that is
concatenated into `plugin/bundle.js` by `tools/assemble.mjs`. The order is:
`00-lib.js` (three.js + OrbitControls + Sky etc.) → `10-core.js` (materials, helpers, CO/LV constants) → `20-mount.js` → `30-courts.js`
→ `40-altar.js` → `45-vessels.js` → `50-heichal.js` → `55-interior.js` → `60-palace.js` → `70-ui.js` → `90-entry.js`.
Everything lives inside ONE IIFE, so top-level `var`/`function` names are shared: use unique names (prefix module-private helpers,
e.g. `vsl_`, `hei_`, `pal_`) and define exactly the exported build function named in the table below.

| file | exported function | owner | builds |
|---|---|---|---|
| 20-mount.js | `async function buildMount(ctx)` | agent "mount+courts" | terrain, the 500x500 platform, retaining walls, the great-court wall + 4 gates with steps, the women's court (החצר החדשה) |
| 30-courts.js | `async function buildCourts(ctx)` | agent "mount+courts" | inner court (חצר הכהנים, 187x135): podium, floor, wall, 7 gates with bronze doors, steps |
| 40-altar.js | `async function buildAltar(ctx)` | agent "altar+vessels" | bronze altar 20x20x10 with horns and the south ramp, fire/smoke |
| 45-vessels.js | `async function buildVessels(ctx)` | agent "altar+vessels" | the Sea on 12 oxen (two placements), Moses' laver, 10 bases (מכונות) with 10 lavers |
| 50-heichal.js | `async function buildHeichal(ctx)` | agent "heichal" | the house from outside: אוטם, ulam with בית החליפות wings, Yachin & Boaz, house walls, yatzia (38 chambers, לולים), windows, roofs, optional layers "עליות" and "אולם לשיטת הרמב"ם" |
| 55-interior.js | `async function buildInterior(ctx)` | agent "interior" | inside: heichal doors, kodesh (menorot, tables, golden altar, chains) in two layouts, amah traksin with the devir door + parochet, devir (cherubim, ark, even shetiya) |
| 60-palace.js | `async function buildPalace(ctx)` | agent "palace" | optional layer "בית שלמה" south of the Temple |
| 70-ui.js | `async function buildUI(ctx)` | agent "ui" | panel: views, places, toggles, info + source links (deep links into Otzaria), measuring tool, cloud, compass, nav, "השלמות מחז"ל" group |

`10-core.js` and `90-entry.js` already exist — do not edit them (put new constants at the top of your own file).
Reference implementations of the Second Temple modules are in `src/ref-*-bayit2.js` (v1.0.19). Read the one closest to your module:
it shows the coding style, the helpers, labels, cutaway, flyPoints, fadeWith. Do NOT copy Second Temple geometry (its courts have
chambers, חיל, סורג, a 100-amah-high heichal...). The First Temple is a different building.
Research notes with exact quotes from the sources are in `research/*.md` (Hebrew). Read the parts relevant to your module and use the
exact references in your code comments and (for 70-ui.js) in the explanation texts.

## 1. Conventions
- 1 unit = 1 amah. +x = east = the FRONT of the house (the entrance faces east). +z = south = the RIGHT side of the house
  ("כתף הבית הימנית" = south). -z = north = left. y = up. The house axis is z = 0.
- Levels (`LV`): great court / mount platform `LV.HAR = 0`; inner court `LV.AZ = 6`; house floor `LV.HEI = 12`.
  Steps: tread 0.5, rise 0.5. 12 steps from the great court up to the inner court; 12 steps from the inner court up to the ulam
  (Middot 3:6, applied as a model choice; Kings gives no levels). The 6-amah base under the house is the "אוטם" (Middot 4:6; Malbim on I Kings 6:8).
- Every dimension in code gets a comment with its source, e.g. `// I Kings 6:6`, `// II Chr 4:1`, `// Rashi on I Kings 6:8`,
  `// Middot 4:7`, `// Yoma 51b`, `// Eruvin 14b`, or `// model choice`. Hebrew text in strings is written directly in UTF-8.
- Sources allowed: I Kings 6-8, II Chronicles 3-4, Chazal (Mishnah Middot, Talmud, Rashi, Radak, Metzudot, Malbim, Ralbag, Rambam).
  Ezekiel is NOT a source. Middot describes the Second Temple; it is used only where this spec says so.
- Materials (`ctx.M`): `stone`, `stoneLight`, `stoneSmooth`, `marble`, `gold`, `bronze`, `cedar`, `pave`, `paveFine`, `altarStone`,
  `ground`, `plaster`, `parochet`, `lattice`. Clone and tint for new looks: `const m = ctx.M.cedar.clone(); m.color.set(0xA07040)`.
  Olive wood (עצי שמן) = cedar clone tinted `0xB89A6A`; cypress floor (ברושים) = cedar clone `0xC9A77A`. For big bronze surfaces clone
  `M.bronze` and vary roughness 0.3–0.5. Do NOT use `M.marble` for the First Temple walls (use `M.stone` / `M.stoneLight`: hewn stone).
- Helpers (`ctx.H`, see `10-core.js`): `box(parent,w,h,d,mat,x,y,z)` (y = bottom), `cyl(parent,rTop,rBot,h,mat,x,y,z,seg)` (y = bottom),
  `lathe(parent,[[r,y],...],mat,x,y,z,segs)`, `ring(parent,r,tube,mat,x,y,z,rotX)`,
  `wall(parent,{axis:'x'|'z',length,height,thickness,mat,cx,cz,y,openings:[{center,width,height,arched?,gable?}],occlude})`
  (openings measured along the wall from its centre; `axis:'z'` walls run north-south and `center` is a z offset; no `arched` = square
  opening), `stairs(parent,{width,totalRise,steps,dir:'N'|'S'|'E'|'W',x,y,z,tread,mat})` (dir = direction you walk when climbing;
  x,y,z = bottom of the first step), `columnGeo`, `colonnade(parent,[{x,z,y}],{height,rShaft,mat,style})`, `crenellate` (do not use),
  `occ(mesh)` (registers an occluder that fades when it blocks the view; `mesh.userData.fadeWith = otherMesh` fades it with another),
  `uvWorld`, `uvWorldBox`. Three.js classes are in scope by bare name (`Group`, `Mesh`, `BoxGeometry`, `CylinderGeometry`, `SphereGeometry`,
  `TorusGeometry`, `LatheGeometry`, `ExtrudeGeometry`, `Shape`, `Path`, `InstancedMesh`, `Matrix4`, `Vector2/3`, `Quaternion`, `Euler`,
  `PointLight`, `Color`, `MeshStandardMaterial`, `MeshBasicMaterial`, `Sprite`, `SpriteMaterial`, `CanvasTexture`, `ConeGeometry`,
  `CircleGeometry`, `DodecahedronGeometry`, `IcosahedronGeometry`, `PlaneGeometry`, `BufferAttribute`, `MeshLambertMaterial`, `Raycaster`,
  `mergeGeometries`, `DoubleSide`). `ctx.THREE` also holds all of them.
- `ctx` fields: `root` (add your Group to it), `labels` (push `{text,x,y,z,size}`), `animated` (push `fn(tMillis)`), `cutaway` (push
  meshes hidden when "חתך פנים" is on: roofs, south halves of walls...), `interiorOnly` (shown only in cutaway), `layers` (toggleable groups:
  `ctx.layers.aliyot`, `ctx.layers.ulamRambam`, `ctx.layers.palace`; set `group.visible = false` initially; the UI toggles `.visible`),
  `shared` (free object for cross-module data: `shared.flyPoints`, `shared.seaPlacement`, `shared.kodeshOpinion`, `shared.devirCenter`),
  `flyTo(pos,target)`, `camera`, `controls`, `renderer`, `scene`, `LV`, `CO`, `M`, `H`.
- Keep triangle counts sane: InstancedMesh for repeated items. Whole model < 1.5M triangles.
- The model must also run outside Otzaria (`window.Otzaria` undefined): touch `window.Otzaria` only in 70-ui.js.
- Fail soft: wrap optional decorations in try/catch.

## 2. Coordinates (`ctx.CO`, defined in 10-core.js) — NOTE the ulam wall is 6 (Rashi on Sanhedrin 100a), so `xUlamE = 18.5`
```
azE 93.5, azW -93.5, azN -67.5, azS 67.5, AZ_L 187, AZ_W 135      // inner court, Middot 5:1 (user decision: "כמדות")
harW -147, harE 353, harN -167.5, harS 332.5, HAR 500               // great court 500x500, Middot 2:1 (placement as in Middot 2:1)
xAltarW 39.5, xAltarE 59.5, altarZ 0, ALTAR 20, ALTAR_H 10          // bronze altar, II Chr 4:1; its west face 21 east of the ulam front
xUlamE 18.5   outer face of the ulam front wall (ulam wall 6: Rashi on Sanhedrin 100a "וכותל האולם שש")
xUlamIn 12.5  inner face of the ulam front wall;  xHouseE 2.5 east face of the house wall (ulam 10 deep, I Kings 6:3)
xKodeshE -3.5 (house wall 6, Middot 4:7 and Rashi Sanhedrin 100a "כותל מזרח שש")   xKodeshW -43.5 (kodesh 40, I Kings 6:17)
xDevirE -44.5 (amah traksin 1, Yoma 51b / Bava Batra 3a; taken from the devir side: user decision)   xDevirW -63.5 (devir 19 clear)
xHouseW -69.5 (west wall 6 at the lowest story)   xHeiW -79.5  outer face of the yatzia wall = house wall 6 + yatzia 5 + ta wall 5
HOUSE_W 20, HOUSE_H 30, DEVIR_H 20, ULAM_W 20, ULAM_D 10, ULAM_WALL 6
HOUSE_WALL [6,5,4]  house wall thickness at story 1/2/3 (steps in 1 amah per story: מגרעות, I Kings 6:6 with Rashi)
YATZIA_W [5,6,7] (I Kings 6:6), YATZIA_H 5 per story (I Kings 6:10, Rashi "של כל אחד ואחד"), TA_WALL 5 (Middot 4:7)
zHouseS 26, zHouseN -26  outer faces of the ta walls (10 + 6 + 5 + 5)
ULAM_WING 15  the ulam front extends 15 beyond the house body on each side (בית החליפות, Rashi on Yoma 36a) → ulam block z ±41
seaX 35, seaZ 26 (south-east, Radak/Metzudot/Ralbag/Rashi on II Chr) and seaZ -26 (north-east, Rashi on I Kings 7:39) — toggle
mechX 27, mechZ [8,13,18,23,28] (both signs); kiyorX 27 (Moses' laver on the axis). The row stands 0.5 east of the lowest of the
12 ulam steps (steps x 18.5..24.5, z ±12); the Sea 8 east of the row. (Earlier values 24.5 / 32.5 collided with the steps.)
```
(10-core.js carries exactly these values: `CO.xUlamE 18.5`, `CO.ULAM_WALL 6`, `CO.ULAM_WING 15`, `CO.seaX 35`, `CO.seaZ 26`,
`CO.seaZRashi -26`, `CO.kiyorX 27`, `CO.mechX 27`, `CO.mechZ [8,13,18,23,28]`. Use `ctx.CO` rather than retyping numbers.)

## 3. 20-mount.js — the mount, the great court, the women's court
- Terrain and the 500x500 platform (x -147..353, z -167.5..332.5): copy the approach of `ref-mount-bayit2.js` (terrain mesh, platform
  paving `M.pave`, foundation walls below ground, GROUND_Y = -28). No colonnades, no royal stoa, no crenellations, no Shushan relief.
- The great court wall (I Kings 7:12 "וחצר הגדולה סביב שלשה טורים גזית וטור כרתת ארזים", Rashi: "החומה עשויה שלשה נדבכין של אבנים
  ונדבך של עץ עליהם"; II Chr 4:9 "העזרה הגדולה... ודלתותיהם צפה נחשת"): a wall on the platform edge built from stacked bands:
  3 stone courses (3 high, `M.stone`) then 1 cedar course (1 high, `M.cedar`), repeating; thickness 5, total height 20 (model choice).
  Use `H.wall` for the stone bands where a gate opening is needed (openings 10 wide x 20 high → the opening cuts through all bands:
  simplest is to build each side as 5 segments: stone/cedar bands as boxes left and right of the gate, and a flat stone lintel box
  above the gate). Register the big pieces with `occ` and `fadeWith` so a side fades together.
- Gates: one per side (model choice: Kings gives no number for the great court; the names are not in the sources —
  label them "השער המזרחי", "השער הצפוני", "השער הדרומי", "השער המערבי"): the north/south gates in the middle of the side (x 103),
  the east/west gates on the house axis (z 0) so the three east gates (great court → women's court → inner court) line up.
  Square flat stone lintel (as the 1.0.19 Har HaBayit gates), bronze-overlaid cedar doors (II Chr 4:9), and at each gate an exterior
  flight of 56 steps (0.5/0.5) from the ground (GROUND_Y -28) up to the platform (model choice).
- The women's court "החצר החדשה" (Rashi on I Kings 6:36: "קורא אותה פנימית לפי שהיתה לפנים מעזרת נשים"; II Chr 20:5): a paved court
  135 x 135 east of the inner court, x 93.5..228.5, z ±67.5, at level 3 (6 steps above the platform, model choice), enclosed by a low
  wall 4 high (3 stone courses of 1 + 1 cedar course, I Kings 6:36 pattern), thickness 2, with a gate 10 wide in the middle of its east
  side and 6 steps up to it; from it 6 steps (3 rise) up to the inner court's east gate. NO chambers, no gallery.
- Labels: "הר הבית", "החצר הגדולה", "החצר החדשה (עזרת נשים)", the four gates. flyPoints: `harHabayit` {pos:[720,320,520],target:[100,10,80]},
  `eastGate` (great court east gate, from outside), `newCourt`.

## 4. 30-courts.js — the inner court (חצר הכהנים / החצר הפנימית)
- Podium: stone block 197 x 6 x 145 from y 0 to 6 under the court (x -98.5..98.5, z ±72.5); floor paving `M.pave` at y 6.
- Wall: I Kings 6:36 "שלשה טורי גזית וטור כרתת ארזים" (Rashi 7:12 pattern): bands of 3 stone courses (3 high) + 1 cedar course (1 high),
  thickness 5, height 20 (model choice: the same height as the great court wall, so the 20-high gate lintels cap the crest) on the
  court's edge (centre lines x = ±93.5, z = ±67.5), from y 6. Register with `occ`.
- Gates: 7 (Middot 1:4: 3 north, 3 south, 1 east — convention accepted by the user for the court; the First Temple sources do not name
  them, so label them "שער צפוני א/ב/ג", "שער דרומי א/ב/ג", "השער המזרחי"): north/south gates centred at x = -40, 0, 40, east gate at z = 0.
  Openings 10 wide x 20 high with flat stone lintels (no arches). Doors overlaid with bronze (II Chr 4:9): `M.bronze` leaves slightly ajar.
- Steps: 12 steps (6 rise) outside each north/south gate from LV.HAR to LV.AZ; the east gate: 6 steps from the women's court level 3.
- No דוכן, no court split, no chambers, no בית המוקד.
- Labels: "חצר הכהנים (החצר הפנימית)", gate labels. flyPoints: `azarah` {pos:[150,105,150],target:[20,15,0]}, `innerEastGate`.

## 5. 40-altar.js and 45-vessels.js — the bronze works (Hiram, I Kings 7:13-47)
### Altar (40-altar.js)
- II Chr 4:1: bronze altar 20 x 20 x 10. User decision: BRONZE. Box 20x20x10 at x 39.5..59.5, z -10..10, y 6..16 (`M.bronze` clone,
  roughness .45) with a 0.5 lip at the top, four horns 1x1x1 at the corners (model choice after Ex 27:2), a horizontal band (כרכוב,
  model choice) at y 11. Ramp on the SOUTH (Ex 20:23 "לא תעלה במעלות"; size after Middot 3:3 as a convention): 32 long, 16 wide, from the
  court floor at z 42 up to the altar top at z 10, x 41.5..57.5; material bronze-tinted stone (`M.altarStone` clone 0x8a5a3a). Note in a
  comment that the ramp and horns are model choices. Pyre, logs, flames, smoke, point lights: copy from `ref-altar-bayit2.js` (adapt y).
- Labels: "מזבח הנחושת", "הכבש". flyPoint: `mizbeach` {pos:[115,52,72],target:[49.5,16,0]}.
### The Sea (45-vessels.js)
- I Kings 7:23-26, II Chr 4:2-5. Shape per Eruvin 14b (Rashi, Radak, Metzudot, Ralbag, Malbim agree): the lower 3 amot square (10x10
  inside, walls 1 tefach = 0.17 → outer 10.33), the upper 2 amot round (inner diameter 10), rim flaring out like a lily cup (7:26), floor 1
  tefach. Two rows of knobs (פקעים: "eggs with oxen faces", Radak) around the square part just below the transition (y 2.3 and 2.7 above
  the basin floor, ~80 per row = every half amah: model choice). Water inside (dark blue, roughness .15) at 4.6.
- 12 bronze oxen (3 per side, heads outward, hindquarters meeting inward, 7:25): instanced simple oxen (body ellipsoid 2.2 long, legs,
  head with horns), back height 3 (model choice) → the basin floor at y 6+3 = 9, rim at 14.
- Position — TWO opinions, both built-in; `ctx.shared.seaPlacement = { rashi:{x:35,z:-26}, radak:{x:35,z:26}, current:'rashi', set(key) }`
  moves the whole Sea group + its label. Default 'rashi' (Rashi on I Kings 7:39: north-east, "באויר שבין כותל צפוני של בית לכותל העזרה");
  'radak' = Radak, Metzudat David, Ralbag and Rashi on II Chr 4:10: south-east. The UI shows both choices.
- Label "הים של שלמה". flyPoint: `yam` (computed for the current placement: pos = [x+40, 30, z+40], target [x, 12, z]; expose
  `ctx.shared.seaPlacement.flyPoint()` returning the current one and let the UI call it).
### Moses' laver and the ten bases (45-vessels.js)
- Moses' laver (כיור משה; Rashi on II Chr 4:6, Radak, Metzudot: "חמש מימין וחמש משמאל" = of Moses' laver): on the house axis at
  x 27 (`CO.kiyorX`), z 0: bronze lathe ~3 across, 3 high with 12 spouts (copy the kiyor block from `ref-altar-bayit2.js`).
- 10 bases (מכונות), I Kings 7:27-37 (Rashi, "צורת הבית", Metzudot): each 4 x 4 plan; four bronze wheels 1.5 high (7:30, 7:32) at the
  corners (axles north-south); body y 1.5..2.5 above the floor: a square frame with upright bars (שלבים) and panels between them carrying
  reliefs of lions, oxen and cherubim (7:29) → suggest with small instanced relief boxes; a sloping "hat" from the body edge to the mouth;
  the mouth (פיה) y 2.5..3: a round wall 1.5 across, 0.5 high (7:31, 7:35); the stand (כן) 1.5 high: lower half round inside the mouth,
  upper amah square 1.5x1.5 with 4 shoulders (כתפות, 7:34). Laver (כיור, 7:38): a round bronze bowl 4 across at the rim narrowing to
  ~1.6 at the bottom, 1.3 deep, sitting in the stand; rim at ~4.7 above the floor.
- Placement (7:39 "חמש על כתף הבית מימין וחמש... משמאלו" = right/left of Moses' laver, in the priests' court before the ulam):
  two rows at x = 27 (`CO.mechX`): z = +8, +13, +18, +23, +28 (south) and -8, -13, -18, -23, -28 (north). The Sea stands at x 35
  (`CO.seaX`), z ±26, clear of the row and of the altar (x 39.5).
- Labels: "כיור משה", "המכונות והכיורות" (and on hover nothing). flyPoint: `mechonot` {pos:[70,30,-40],target:[24.5,10,-10]}.
### Yachin and Boaz are built in 50-heichal.js (they stand inside the ulam).

## 6. 50-heichal.js — the house from outside
- אוטם (foundation): solid stone block under the whole house incl. the ulam block and wings: x -79.5..18.5, z ±41, y 6..12 (`M.stone`)
  (Middot 4:6 "האוטם שש אמות" as a convention; Malbim on I Kings 6:8 mentions a 6-amah base). The 12 steps up to the ulam in front:
  width 24 centred on z 0, dir "W", from LV.AZ at x 24.5 to LV.HEI at x 18.5 (tread 0.5).
- ULAM (I Kings 6:3, Rashi): interior hall 20 (z ±10) x 10 deep (x 2.5..12.5), 30 high (model choice: the base model keeps the whole
  building 30 like the house; the 120 is shown by the "עליות" layer). Walls 6 thick: front wall x 12.5..18.5 with the entrance opening
  10 wide x 20 high, flat lintel (model choice: the sources give no door for the ulam); hall side walls z ±10..±16.
  בית החליפות wings (Rashi on Yoma 36a and on Ezekiel 41:14 as quoted in the user's file: the ulam front is wider than the house by 15
  on each side, the wings are 10 deep, there the knives were stored; Rashi on Sanhedrin 100a applies the same counting to Solomon's
  Temple): on each side a wing room 15 wide beyond the house body: block z ±26..±41 (interior z ±27..±35, outer wall 6 at ±35..±41), x 2.5..18.5
  (interior x 2.5..12.5, front wall 12.5..18.5), 30 high; a door from the hall's side wall? No — Rashi says the wings "join the ulam from
  both sides": give each wing a doorway 3 wide x 6 high in the wall between the hall and the wing (z = ±10..±16) — model choice — and a
  row of small square niches (windows for the knives) 1x1 in the wing's inner walls (model choice, 12 per wing). Flat roof at 30 over the
  whole ulam block. Material `M.stone` with cedar courses every 4 amot? NO: the ulam walls follow the court pattern (I Kings 7:12 "ולאלם
  הבית": 3 stone courses + 1 cedar course): build the ulam front as bands (3 stone + 1 cedar) like the court walls. The house walls are
  plain stone (I Kings 6:7, 7:9-11).
- Yachin & Boaz (I Kings 7:15-22, 7:41-42; II Chr 3:15-17; Jer 52:21): INSIDE the ulam hall, right and left of the heichal door (Rashi
  on I Kings 7:15 "שהעמיד באולם", Rashi on II Chr 3:17, Radak, Metzudot; Malbim alone puts them outside — mention only in DEV notes).
  Centres x = 5.5, z = ±6.9 (model choice inside the hall: with the capital's belly d ~6 the pillars then clear the hall side walls at
  z ±10, and the shafts d 4 still clear the 10-wide doorway edge at z ±5); bronze hollow cylinder diameter 4 (circumference 12, Rashi/Metzudot), shaft 18
  from the floor (y 12..30) — 0.5 of it inside the capital (Radak, Metzudot); capital 5: lower 2 flush with the shaft (Rashi 7:16 "שוות
  לעמוד"), upper 3 bulging to diameter ~6 with net work (שבכה, instanced thin torus/lattice look), 7 chains hanging from the top of the net
  to the belly, two rows of pomegranates 100 each (7:20, 7:42) as instanced spheres r 0.17 on rings at the belly, lily top. Total visible
  height 22.5 (shaft 18 with 0.5 inside the capital + capital 5: Radak and Metzudot on 7:15; Rashi on II Chr 3:15: 17.5 each + capital;
  Rashi on 7:16 sinks 2 amot → 21: DEV note). The pillar stands on the ulam floor (world y 12) and tops at world y 34.5, under the ulam
  ceiling at world y 42 (30 high hall) — no conflict. Yachin = south (right, Metzudot/Ralbag: ימין = דרום), Boaz = north. Labels "יכין", "בועז".
- HOUSE walls: hall x -3.5..-63.5 (kodesh + traksin + devir), z ±10 inside, 30 high inside (y 12..42). North/south walls stepped:
  story 0 (y 12..17) thickness 6 (outer face z ±16), story 1 (y 17..22) thickness 5 (±15), story 2 (y 22..27) thickness 4 (±14); above
  27 the wall continues 4 thick up to the roof. West wall stepped the same on x (outer faces -69.5, -68.5, -67.5). East wall (between the
  ulam and the kodesh) 6 thick, x -3.5..2.5, full height, with the heichal doorway 10 wide x 20 high (55-interior.js dresses it). Material
  `M.stone`. Push the SOUTH wall pieces (z > 0) into `ctx.cutaway` so "חתך פנים" opens the house (as the reference does with bodyS).
- YATZIA (I Kings 6:5-10 with Rashi, who quotes Middot 4:3): three stories of chambers around the north, west and south (NOT east, not
  around the ulam: Malbim 6:5); 38 chambers: 15 north (5 per story), 15 south (5 per story), 8 west (3+3+2). Story heights 5 (6:10 Rashi:
  "של כל אחד ואחד"), chamber depths 5/6/7 (6:6: the house wall steps in 1 per story so the chamber widens), outer ta wall 5 thick,
  vertical, at z = ±26 and x = -79.5 (Middot 4:7 "כותל התא חמש"). Floors/ceilings: cedar slabs 0.5 thick resting on the ledges (מגרעות,
  6:6 "לבלתי אחוז בקירות הבית") at y 17, 22, 27 (+ the roof slab at 27.5..28 with a stone parapet 1 high). Partition walls 1 thick (model
  choice) dividing each run into 5 (north/south: run x -69.5..-3.5 = 66 → chambers ≈ 12.4 long) or 3 / 3 / 2 (west: run z ±26 → 3
  chambers of ~16.7; top story 2 of 25). Each chamber has 3 openings (Rashi on 6:8 quoting Middot 4:3): to the chamber on its right, on its
  left, and the one above → small doorways 2 x 4 in the partitions, hatches 2x2 in the floors (suggest with dark boxes).
  Entrance from outside (6:8 "פתח הצלע התיכונה אל כתף הבית הימנית", Rashi and Targum: the MIDDLE chamber of the lowest SOUTH row had the
  door to the outside; Radak/Metzudot: the middle story — DEV note only): a doorway 2.5 wide x 4 high in the south ta wall (z = 26 face)
  at the middle of the south run (x ≈ -36.5), lower story. לולים (spiral stairs, Rashi: "עמוד אבנים עשוי מעלות מעלות... כמקיף סביבות
  עמוד"): inside that middle chamber, a stone column r 0.6 with 36 instanced wedge steps spiralling from y 12 to 27.
  Suggest the chambers' interiors only where visible: the cutaway removes the south ta wall and south house wall (push them to
  `ctx.cutaway`) so the three stories of chambers with their cedar floors and the spiral stairs show.
- WINDOWS (I Kings 6:4 "חלוני שקופים אטומים", Rashi/Menachot 86b: wide outside and narrow inside — "פתוחים מבחוץ ואטומים מבפנים,
  קצרים מבפנים... להראות שאינו צריך לאורה"): on the north and south walls of the KODESH only (x -43.5..-3.5; none in the devir and
  none in the west wall: model choice, no source for devir windows), above the yatzia roof (Malbim), in the band y 29..33 (model
  choice: 6 per side, evenly spaced along the kodesh — the user's sheet says six): each a splayed opening: outside 3 wide x 2.5 high, inside 1 x 1 — build as an
  extruded frustum (trapezoid in plan) cut look: a dark inner box plus four sloped slabs (`M.stoneLight`); register the pieces with
  `H.occ` and `fadeWith` their wall so they fade together with it.
- ROOF: house ceiling at y 42 (= LV.HEI + 30): double ceiling (Rashi on 6:9-10 and Malbim quoting Rambam: lower decorated ceiling 1,
  air space "בית דילפא" 2, upper cedar 1): cedar slab y 42..43 (`M.cedar`, gold underside box 0.05 for the kodesh: 6:22), air, cedar slab
  y 45..46; stone roof slab y 46..47.5 with a parapet 1.5 high and 1 thick around (model choice). Over the devir only: an extra ceiling at
  y 32..33 (I Kings 6:20 with Rashi: "עליית בית קדשי הקדשים נמוכה משל היכל") with a gold underside (II Chr 3:9 "והעליות חפה זהב"); the
  room above it (y 33..42) is the devir's עלייה (empty, gold-tinted interior). Push all ceilings/roof slabs into `ctx.cutaway`.
- Layer "עליות" (`ctx.layers.aliyot`, visible=false): the user's view (Rashi on II Chr 3:4 as quoted in research/research-part1-short.md:
  30 up to the first ceiling and another 90 of upper stories up to the top roof = 120; Radak there: "ג' עליות גבהן תשעים אמה"; the book
  מקרא מפורש draws two). Build over the house walls' footprint INCLUDING the ulam block? Rashi did not say; default: over the house and the
  ulam (x -67.5..18.5, walls at z ±10..±14 — the house walls above y 27 are 4 thick with outer faces at ±14, so the upper stories sit
  exactly on them; not over the wings): from the roof slab at 47.5 up to y = 12 + 120 = 132: three stories separated by double ceilings
  4 thick (1+2+1) — ceilings at 72..76, 100..104, roof 128..132; walls 4 thick `M.stone` with small windows (2x2, three per long side per
  story); interiors gold-tinted (II Chr 3:9). The layer's labels (and the ulamRambam layer's) are pushed to `ctx.labels` with a field
  `layer: 'aliyot' | 'ulamRambam'` so the UI shows them only while the layer is visible and the labels toggle still applies.
  Label "העליות: הבית כולו 120 אמה (דברי הימים ב ג, ד לפי רש"י)" at y 136. The layer's group also contains a tall parapet. When the
  layer is on, the base roof parapet should not stick out: put the base parapet into the same visibility logic — simplest: build the
  parapet into the aliyot layer as "hidden when the layer is on" is impossible; instead build NO parapet on the base roof (just a slab).
- Layer "אולם לשיטת הרמב"ם" (`ctx.layers.ulamRambam`, visible=false): per the user's file (Rambam Beit HaBechira 4, Kesef Mishneh, Tosafot
  Yom Tov on Middot 4:7): the ulam's extra width continues along the whole house to the west corner. Build two side blocks z ±26..±41,
  x -79.5..-3.5, y 12..46 + roof 46..47.5 (`M.stone`, a few windows; the same wall top as the ulam block) that join the wings.
  Label "האולם לשיטת הרמב"ם: הבליטה נמשכת לכל אורך הבית".
- Labels: "ההיכל", "האולם", "בית החליפות" (x2), "קודש הקדשים" (outside, high, over the west end), "היציע (התאים)", "פתח התאים", "לולים",
  "חלוני שקופים אטומים", "האוטם". flyPoints: `heichalFront` {pos:[130,55,45],target:[18,30,0]}, `heichalSouth` {pos:[-20,40,110],target:[-36,20,26]},
  `ulamInside` {pos:[14,24,0],target:[3,20,0]} (interior view inside the ulam looking west at the pillars and the heichal door), `yachinBoaz`
  {pos:[16,26,-9],target:[5.5,24,-2]}, `aliyot` {pos:[260,150,220],target:[-25,70,0]}, `heichalWest` {pos:[-200,60,-60],target:[-70,25,0]}.

## 7. 55-interior.js — inside the house
Coordinates inside the kodesh: x from -3.5 (door plane, east) to -43.5 (traksin, west), z ±10. Research in `research/research-part1-short.md`
(topic "כלי הקודש") gives positions measured from the door westward (x_r) and from the north wall southward (z_r): convert with
`x = -3.5 - x_r`, `z = -10 + z_r`.
- Ulam interior finishes: no gold (Rashi, Metzudot, Ralbag on II Chr 3:4; Malbim disagrees — DEV note): stone + cedar courses.
- פתח ההיכל (I Kings 6:33-35): opening 10 wide x 20 high (model choice) in the east wall (x -3.5..2.5). Doorposts (מזוזות) of olive wood,
  SQUARE section 1x1 (6:33 "מאת רבעית", Rashi, Targum "מרבעין"), standing on the east face of the wall at z ±5..±6, 20 high, with a lintel
  1 high; gold-overlaid. Two doors of cypress (6:34), each 5 wide (Rashi: half the opening), 20 high, 0.33 thick, each made of two boards
  ("שני צלעים", Malbim; Rashi: two hinges per door), hung on the posts, opened westward into the wall thickness and resting on the sides
  of the opening (Radak's four-door reading — DEV note). Round gold hinges (פותות, Targum/Radak/Ralbag; Rashi: keys — DEV note) top and
  bottom. Carvings on both faces: rows of circles ("גלילים", Radak/Metzudot/Ralbag) with cherubim, palms and flowers between, overlaid with
  thin gold "מיושר על המחוקה" (6:35) → `M.gold` plus instanced small relief boxes/discs on the faces.
- Kodesh finishes: floor cypress overlaid with gold (6:15, 6:30), walls cedar carved with cherubim, palms and flowers overlaid with gold
  (6:18, 6:29, 6:22), ceiling gold. Build thin gold skins inside the stone walls (x -3.5..-43.5, z ±10, y 12..42, 0.2 thick) with a carved
  look (instanced relief boxes in bands); push the south skin into `ctx.cutaway`.
- VESSELS in the kodesh (I Kings 7:48-49, II Chr 4:7-8, 4:19-20; Menachot 98b-99a with Rashi — see the research for the exact baraita):
  all vessels in the inner half of the hall (x_r 20..40), tables in the north half, menorot in the south half, golden altar on the axis.
  Two LAYOUTS, both built, visibility toggled by `ctx.shared.kodeshLayout = { current:'rabbi', set(key) }`:
  * 'rabbi' (default; Rabbi: "מזרח ומערב"; Rambam Beit HaBechira 3:12 rules so for the table): tables with their length along x; two rows
    of 5 tables (each 2 x 1, 1.5 high: table height is a model choice; 12 loaves in two stacks of 6): north row centres x_r 27,29,31,33,35
    at z_r 3 → model z -7; second row z_r 6.5 → model z -3.5; Moses' table west of them "כתלמיד לפני רבו": x_r 38, z_r 4.75 → model x -41.5,
    z -5.25. Menorot mirror in the south: rows at model z +7 and +3.5 (same x), Moses' menorah at x -41.5, z +5.25; each menorah's branches
    spread east-west (Rashi 98b). Golden altar (מזבח הזהב): 1 x 1 x 2 (height model choice; Rambam 3:17 "אמה על אמה"), gold over cedar
    (6:20, 6:22; Radak), on the axis at x_r 35.5 → model x -39, z 0 ("משוך קמעא כלפי חוץ", Radak 6:22; Rambam 3:17).
  * 'rashbash' (R. Elazar b. R. Shimon: "צפון ודרום"): tables with length along z, two columns of 5 at x_r 37 and 30 (model x -40.5 and
    -33.5), z_r 0..10 (model z -10..0: centres -9,-7,-5,-3,-1); Moses' table between the columns at x_r 33.5, z_r 3.5 (model x -37, z -6.5);
    menorot mirrored in the south with branches north-south, Moses' menorah at model x -37, z +6.5; golden altar at x_r 32 (model x -35.5), z 0.
  Lighting/bread opinion toggle `ctx.shared.kodeshOpinion = { current:'tk', set(key) }`: 'tk' (Tanna Kamma, Menachot 99a: "לא היו
  מדליקין אלא בשל משה" and "לא היו מסדרין אלא על של משה" — R. Yose b. R. Yehuda says the latter about the tables only) → hide the
  flames of the 10 menorot and the loaves of the 10 tables; 'rebs' (R. Elazar ben Shamua: "בכולן היו מדליקין... על כולן היו מסדרין";
  Radak on 7:49 reads the verses so): all 11 menorot lit and bread on all 11 tables.
  Olive wood (עצי שמן): Targum/Rashi = olive; Ralbag (and Radak as a second reading) = a resinous cedar/pine — use the olive tint, DEV note.
  Menorah build: copy the 7-branch menorah from `ref-heichal-bayit2.js` (mx/mz block, flames instanced, point light only for Moses').
  Table build: copy the table + loaves from the reference. Keep polygon counts low (instanced cups/flames/loaves).
- Chains (רתוקות זהב, 6:21; Rashi, Radak, Metzudot: bars of chains on the face of the traksin wall): 4 horizontal gold chain-bars across
  the east face of the traksin wall at y 14, 20, 26, 32 (model choice), each a thin cylinder 20 long with instanced torus links.
- אמה טרקסין (Rashi on 6:16, 6:19; Yoma 51b; Bava Batra 3a: 1 thick, 30 high; Malbim: stone with gold on it): wall x -43.5..-44.5, z ±10,
  y 12..42, `M.gold` (stone core irrelevant), with the devir doorway.
- פתח הדביר (6:31-32): opening 6 wide x 12 high in the traksin wall (model choice, no measure in the sources; must be wider than the
  distance between the ark's staffs, Rashi 6:23). Doorposts of olive wood with a FIVE-SIDED section (6:31 "האיל מזוזות חמישית", Rashi's own
  view: "חמשה צלעות היו למזוזות ולא היתה מרובעת"; Rashi also quotes "שמעתי": five parts — threshold, two posts, a lintel made as two; Radak:
  five receding steps; DEV note): extrude a regular pentagon 1 across (one side against the wall, the opposite vertex toward the opening),
  12 high, both posts; lintel in two pieces (the "שמעתי" view visible too); threshold 0.2 high with two hinge holes. Two doors of olive
  wood, each 3 wide x 12 high x 0.25, carved cherubim/palms/flowers with gold sunk into the carving (6:32, Rashi), round gold hinges;
  standing OPEN westward (Radak on II Chr 3:14, Rashi on II Chr 3:14: the doors stayed open because of the staffs, and a curtain hung).
- Parochet (II Chr 3:14 "תכלת וארגמן וכרמיל ובוץ... כרובים"; Ralbag says the wall replaced the curtain — DEV note): a curtain 6 wide x
  12 high (`M.parochet`) hanging on the EAST face of the doorway (kodesh side), with two bulges (spheres r 0.3) at y 12+2.6, z ±0.75 where
  the staffs press from behind (Yoma 54a, Rashi on I Kings 8:8 "דוחקין ובולטין כשני דדי אשה").
- DEVIR (קודש הקדשים): interior x -44.5..-63.5, z ±10, y 12..32 (20 high, 6:20), everything gold (6:20-22, 6:30; II Chr 3:8 "לככרים שש
  מאות"): gold floor, wall skins, ceiling underside. The ark stands in the WEST part of the devir (Rambam Beit HaBechira 4:1 "אבן היתה
  בקדש הקדשים במערבו שעליה היה הארון מונח"): centre 5 amot from the west wall → x -58.5, z 0. Even shetiya (Yoma 53b): a flat rock 3 fingers
  high (0.12), ~3 (z) x 2 (x), at x -58.5, z 0. The ark on it (Ex 25:10: 2.5 x 1.5 x 1.5): gold box with the kaporet and two small cherubim;
  its long axis NORTH-SOUTH (Rashi on I Kings 6:23: "ארכו לרוחב הבית"; Rambam 3:12), its two staffs EAST-WEST (Yoma 54a; I Kings 8:8) set
  at the ends of its length (z ≈ ±1.15, Rashi 6:23: two Levites walk between them), ~15 long (model choice) so their east ends press the
  parochet at x -44.5. Two great cherubim (6:23-28; II Chr 3:10-13: "עומדים על רגליהם ופניהם לבית"): olive wood overlaid with gold, 10
  high, standing on the floor at z -5 and z +5, x -58.5 (one north and one south of the ark, Rashi 6:23), FACING EAST, heads slightly
  turned toward each other and bowed (Rashi on II Chr 3:13); wings horizontal at y 12+8: each wing 5 long x 2.2 x 0.15 — the inner wings
  meet at z 0 above the ark (I Kings 8:6 "תחת כנפי הכרובים"), the outer wingtips touch the north/south walls (6:27). Build each cherub:
  body (box 1.2 x 6 x 0.8 + head sphere r 0.6 + simple legs), wings as slabs angled slightly up; `M.gold`.
  Warm PointLight in the devir and one in the kodesh (copy the reference values). Set `ctx.shared.devirCenter = {x:-54, y:22, z:0}`.
- Labels (inside): "הקודש", "קודש הקדשים", "מנורת משה", "עשר המנורות", "שולחן משה", "עשרה השולחנות", "מזבח הזהב", "רתוקות הזהב",
  "אמה טרקסין", "הפרוכת", "הכרובים", "הארון ובדיו", "אבן השתייה", "פתח הדביר (מזוזות חמישית)", "פתח ההיכל (מזוזות רבועות)".
  flyPoints: `kodesh` {pos:[-8,34,0],target:[-28,24,0]}, `kodeshHakodashim` {pos:[-46,30,6],target:[-56,22,0]}, `menorot`
  {pos:[-24,22,14],target:[-36,16,5]}, `shulchanot` {pos:[-24,22,-14],target:[-36,16,-5]}, `heichalDoor` {pos:[9,26,0],target:[-1,22,0]},
  `devirDoor` {pos:[-34,26,0],target:[-44,20,0]}.

## 8. 60-palace.js — בית שלמה (optional layer `ctx.layers.palace`, visible=false)
I Kings 7:1-12 with Rashi, Radak, Metzudot, Malbim, Ralbag (research topic "ארמון שלמה"). No source places the palace; model choice
(following the book מקרא מפורש which draws it below/south of the Temple): SOUTH of the Temple's great court, on its own terrace 10 amot
lower (y = -10), axis north-south, public entrance from the south (the city), the king's house at the north end (nearest the Temple).
Terrace: a stone block x 10..196, z 352.5..672.5, from y -30 to -10 (`M.stone` sides, `M.pave` top). Palace great court wall (7:12,
"החצר הגדולה"): 3 stone courses + 1 cedar course repeating, thickness 3, height 10, around x 13..193, z 355.5..669.5, gate 10 wide in the
south wall centre and a gate in the north wall centre facing the Temple (with 20 steps up to the Temple platform, model choice).
Local coordinates below: X = world x - 13 (0..180), Y_local = world z - 669.5 going NORTH as the research's "y" increases (i.e. research
y → world z = 669.5 - y). All buildings centred on X 90 (world x 103).
- אולם המשפט (outermost, Metzudot/Malbim order): 50 (x) x 20 (z) x 20 high, research y 10–30, cedar floor "מקיר לקיר", open to the south.
- אולם הכסא: 50 x 30 x 20, y 30–60, cedar floor; the throne against the north wall centre facing south (I Kings 10:18-20: ivory
  overlaid with gold, 6 steps, 12 lions — simple gold throne + 6 steps + instanced lions, low priority).
- "עמודים ועב על פניהם" (7:6): a row of cedar pillars 2.5 x 2.5 every 10, 20 high, y 60–70, carrying a thick beam (עב) 2.5, no roof.
- אולם העמודים (7:6): 50 x 30 x 30 high, y 70–100, roofed, cedar pillars 2.5 x 2.5 every 10 inside, stone side walls; attached to the
  SHORT south side of בית יער הלבנון (Rashi, Malbim, Ralbag; Metzudot: long side — DEV note).
- בית יער הלבנון (7:2-5): 50 (x) x 100 (z) x 30 high, y 100–200. Long walls (east, west) hewn stone 3 thick; the short sides (south,
  north) are the pillar rows with three square doorways each (5 x 10, flat lintels; Rashi, Radak, Metzudot: square, not arched) and three
  small windows 2x2 stacked above each doorway (Malbim). Four rows of cedar pillars ACROSS the house (Metzudot, Malbim, Ralbag; Rashi:
  along — DEV note) at y 100–102.5, 132.5–135, 165–167.5, 197.5–200, 15 pillars per row (Ralbag) 2.5 x 2.5, 30 high (centres every 3⅓);
  the 45 are the cedar beams/boards (Rashi, Radak, Metzudot, Malbim: 15 per bay) → 15 cedar beams 30 long per bay between the rows, and a
  ceiling of cedar boards; 3 rows of windows (3 x 3) in each long wall at heights 8, 16, 24, three per bay (27 per wall, "מכוונות זו מול זו" - Metzudat David 7:4; Radak "חלון כנגד חלון",
  Metzudot). Flat roof 30–31.
- החצר האחרת (7:8, Rashi "מבית לאולם"): inner court 140 (x) x 70 (z), y 200–270, low wall 6, stone floor; the three north doorways of
  בית יער הלבנון open into it.
- בית המלך (7:8 "כמעשה הזה"): 50 x 30 x 20, y 270–300, at the north side of the inner court, door to the south; cedar floor, stone.
- בית בת פרעה (7:8 "כאולם הזה"): 30 (x) x 50 (z) x 20, in the east wing of the inner court (research x 125–155, y 205–255), same style.
- Stones (7:9-11): `M.stone`; a visible foundation course of big stones (10 and 8 long, 2 high) at each building's base (model choice).
- Labels: "בית שלמה", "בית יער הלבנון", "אולם העמודים", "אולם הכסא", "אולם המשפט", "העמודים והעב", "בית המלך", "בית בת פרעה", "החצר הגדולה",
  "החצר האחרת". flyPoint: `palace` {pos:[400,170,760],target:[103,-5,520]}.
All of it in one Group → `ctx.layers.palace`.

## 9. 70-ui.js — the panel
Start from `ref-ui-bayit2.js` (v1.0.19) — copy it and adapt. KEEP as-is: label sprites, the occluder fade loop (FADE_DIST 120), the
cutaway logic, burger/panel, views grid, places accordion, toggles, info box with source links, measuring tool (red line), cloud over the
devir with confirmation and the visibility ray test, compass, nav buttons, `window.__TM_CTX`. CHANGE:
1. Title "בית המקדש הראשון", subtitle "מלכים א ו–ז · דברי הימים ב ג–ד · חז"ל ומפרשים".
2. GENERAL view: pos [380,170,230] target [0,25,0]. VIEWS (keys = flyPoints): מבט כללי (__general), הר הבית (harHabayit), השער המזרחי
   (eastGate), החצר החדשה (newCourt), חצר הכהנים (azarah), מזבח הנחושת (mizbeach), הים של שלמה (yam → use `ctx.shared.seaPlacement.flyPoint()`),
   המכונות (mechonot), ההיכל (heichalFront), היציע (heichalSouth), האולם (ulamInside, interior), יכין ובועז (yachinBoaz, interior), פתח ההיכל
   (heichalDoor, interior), הקודש (kodesh, interior), פתח הדביר (devirDoor, interior), קודש הקדשים (kodeshHakodashim, interior), העליות
   (aliyot — also switches the aliyot layer on), בית שלמה (palace — switches the palace layer on).
3. INFO texts (Hebrew, 1–3 short sentences, verse basis in parentheses) for each view. Take wording and references from `research/*.md`.
4. REFS = deep links into Otzaria by book id + line index (DEV_NOTES "איך מוסיפים קישור לאוצריא" explains the mechanism; here books are
   generalised). A ref is `[label, {book, index}]` or `[label, "sefaria_ref"]`. Line index of a verse = BASE[book][chapter] + verse:
   ```
   const BOOKS = { melachim:10, divrei:39, middot:89, menachot:131, yoma:107, eruvin:105, bavaBatra:124, zevachim:130, yirmiyahu:13, rambamBB:337 };
   const BASE = { 10:{6:185,7:224,8:276}, 39:{3:38,4:56,5:79,20:413}, 89:{1:1,2:11,3:18,4:27,5:35}, 13:{52:?}, 337:{1:?,2:?,3:?,4:?,5:?} };  // fill from src/refmap.json
   const PAGES = { 131:{'פו:':?, 'צח.':3478, 'צח:':3501, 'צט.':3524}, 107:{'כא:':?, 'נא:':?, 'נב.':?, 'נג:':?, 'נד.':?}, 105:{'יד.':?, 'יד:':467?}, 124:{'ג.':?, 'ג:':?}, 130:{'נט:':?, 'ס.':?} };  // from refmap.json "pages"
   ```
   Read `src/refmap.json` ONCE while writing the file and paste the numbers as literals (no runtime file reads). Helper `V(book,ch,v)` →
   `{book, index: BASE[book][ch]+v}`; `P(book,page)` → `{book, index: PAGES[book][page]}`; `MI(ch,m)` for Middot.
   `openSource(ev,label,ref)`: if ref is an object → `openAt(book,index)`: tries `reader.openBook` with `{bookUid:"id:"+book, index}`,
   then `{id:book,type:"text"}`, `{id:book,source:"library"}`, then `library.getBookMetadata` fallback (copy `openMiddotAt` logic but
   parameterised by book and with a per-book cache), then `focusBook(book)`; on failure toast + Sefaria fallback URL: for Tanach
   `I_Kings.6.6` / `II_Chronicles.4.1` / `Jeremiah.52.21`, Middot `Mishnah_Middot.4.7`, Talmud `Menachot.98b`, `Yoma.54a`, `Eruvin.14b`,
   `Bava_Batra.3a`, Rambam `Mishneh_Torah,_The_Chosen_Temple.4.3`. Labels in Hebrew: "מלכים א ו, ו", "דברי הימים ב ד, א", "רש"י שם",
   "מנחות צח:", "יומא נד.", "מדות ד, ז". Keep the 5 s timeout and the toasts.
5. PLACES accordion (`[groupName, [items]]`; item = `{t, tg, cam, info, refs, in?, layer?, action?}`; `layer` switches that layer on
   before flying; `action` is a function called before flying, e.g. `() => ctx.shared.seaPlacement.set('radak')`):
   - "הר הבית והחצרות": הר הבית והחצר הגדולה; השער המזרחי; החצר החדשה (עזרת נשים); חצר הכהנים; שערי חצר הכהנים; המעלות אל הבית (האוטם).
   - "המזבח וכלי הנחושת": מזבח הנחושת; הכבש; הים לפי רש"י (צפון־מזרח) [action rashi]; הים לפי רד"ק ומצודות (דרום־מזרח) [action radak];
     כיור משה; עשר המכונות והכיורות; יכין ובועז (in).
   - "הבית מבחוץ": האולם ובית החליפות; ההיכל; היציע והתאים; פתח התאים והלולים; חלוני שקופים אטומים; גג הבית ותקרותיו; העליות עד 120
     [layer aliyot]; האולם לשיטת הרמב"ם [layer ulamRambam]; קודש הקדשים מבחוץ.
   - "הבית מבפנים" (in): פתח ההיכל ודלתותיו; הקודש; סידור הכלים לפי רבי (מזרח ומערב) [action kodeshLayout rabbi]; סידור הכלים לפי רבי
     אלעזר ברבי שמעון (צפון ודרום) [action rashbash]; לפי תנא קמא: רק מנורת משה דולקת [action kodeshOpinion tk]; לפי רבי אלעזר בן שמוע:
     כולן דולקות [action rebs]; מנורת משה ועשר המנורות; שולחן משה ועשרה השולחנות; מזבח הזהב; רתוקות הזהב; אמה טרקסין; פתח הדביר
     (מזוזות חמישית); הפרוכת; הכרובים; הארון ובדיו; אבן השתייה.
   - "בית שלמה" (layer palace): בית יער הלבנון; אולם העמודים; אולם הכסא ואולם המשפט; בית המלך; בית בת פרעה; החצר הגדולה.
   - "השלמות מחז"ל ובחירות מודל" (like the 1.0.19 CORRECTIONS group): one item per thing that is NOT in the verses, with its source or
     "בחירת מודל": מידות החצרות (מדות ה, א; ב, א); עובי הקירות (מדות ד, ז; רש"י סנהדרין ק.); 38 תאים (רש"י ו, ו ממדות ד, ג); גובה האולם;
     פתחי ההיכל והדביר (מידות); הכבש והקרנות; מקום המזבח (מדות ה, א); האוטם והמעלות; צורת הים (עירובין יד:); מקום הים (רש"י / רד"ק);
     העליות (רש"י דה"י ג, ד); בית החליפות (רש"י יומא לו.); מקום בית שלמה.
   Each item: 1–3 short plain Hebrew sentences + refs (verse first, then Rashi/Chazal). Camera: `tg`/`cam` as [x,y,z] in world coordinates.
6. Toggles (section "תצוגה"): חתך פנים; חומות שקופות כשהן חוסמות; תוויות; סיבוב איטי; ענן סביב קודש הקדשים; העליות עד 120 אמה [layer];
   האולם לשיטת הרמב"ם [layer]; בית שלמה [layer]; a two-button row "הים: רש"י | רד"ק"; a two-button row "סידור הכלים: רבי | ראב"ש"; a two-button
   row "הדלקה: תנא קמא | ר' אלעזר בן שמוע". (Style the two-button rows like `#tm-views button`.)
7. Cloud centre from `ctx.shared.devirCenter`; `inKK` box: x -66..-42, z ±12, y 14..44. Keep the 1.0.19 visibility ray test.
8. Units line: "המידות באמות. יחידה אחת במודל = אמה אחת. מקורות: מלכים א ו–ז, דברי הימים ב ג–ד, חז"ל ומפרשים. מה שאינו בפסוקים מסומן בלוח 'השלמות'."
9. Loading: nothing to do (the entry handles stages).

## 9b. Changes of 1.0.1 (the user's corrections; details in FIXES-1.0.1.md — they override the sections above where they differ)
- Only the COURT walls are fade-occluders; the house, ulam and yatzia walls never fade (the chambers are closed from outside).
- Viewing toggles: `ctx.yatziaCut` (south ta wall + south yatzia roof strip) and `ctx.ulamCut` (ulam front wall + ulam roof); the UI
  has checkboxes for both and switches them on for the views "היציע" and "יכין ובועז" (the latter now looks in from the court:
  pos [44,24,6] target [5.5,22,0]).
- Yatzia stories: 5 clear + 0.5 cedar slab each (slabs 17..17.5 and 22.5..23, roof 28..28.5); house wall 6 / 5 / 4 with ledges at 17 and 22.5.
- Heichal doors folded flat into the reveals (passage 10 x 20 clear). "ההיכל" = the kodesh: exterior view "הבית מבחוץ", interior "ההיכל (הקודש)".
- Sea at z ±36 (x 35); oxen 2.8 long, back 3.6, heads 1.2 beyond the basin.
- Outer court "החצר החיצונה" with chambers (Jer 35:4; 36:10; II Kings 23:11), the king's platform "העמוד" (II Kings 11:14; 23:3) and
  the donation chest (II Chr 24:8); `ctx.shared.outerCourtItems`.
- Palace layer visible by default; placement basis `ctx.shared.palaceBasis` (I Kings 10:5; 8:1; Jer 26:10; 22:1; II Kings 11:19).

## 9c. Changes of 1.0.1-H (the user's second list, same evening; details in FIXES-1.0.1-H.md)
- 55-interior.js: `int_carvedTex()` / `int_carvedMat(tile)` — the carved-gold texture (tile 8 amot on walls, 4 on doors) on every skin of
  the heichal and the devir, the traksin and both doors; the 1.0.0 relief boxes are gone. The traksin = three boxes (`trkPiers` per
  doorway reading + the shared part above the doorway, UVs shifted with `int_uvShift` so the pattern continues). Two doorway readings in
  groups `devir-door-pent` / `devir-door-five`, `ctx.shared.devirDoor = {current:"pent", keys, set}`. The cherubim: `buildCherub(s)` groups
  `cherub-north` / `cherub-south` at (ARK_X, F, ±5): feet, legs, a lathe tunic, arms, neck, head (0.78 r, top at 10.05), two extruded
  feathered wings 4.8 / 4.77 long from z ±0.2 inside the body to the wall / the centre; `ctx.shared.cherubPose = {current:"rashi",
  keys:["rashi","radak","tzidud"], set}` rotates the heads. Fly points `carvings`, `cherubim`, `traksinTop`.
- 60-palace.js: בית יער הלבנון in two variant groups `forestRashi` (default) / `forestMetzudot` = `ctx.layers.*`, switched by
  `ctx.shared.forestHouse = {current:"rashi", keys:["rashi","metzudot"], set}`; the Metzudot colonnade "עמודים ועב" belongs to its variant.
  `ctx.forestBoardsCut` = the boards of both variants (hide-list, toggled by the UI). Variant labels use `layers: ["palace", "<variant>"]`.
  Fly points `forestRoof`, `forestUpper`; `ctx.shared.forestHouseNotes` (Hebrew). Numbers: rows x 79.25/95.083/110.917/126.75, 11 pillars
  per row (pitch 9.75), lower tier 20, beams 1, upper tier 8, עבים 1, boards 20..20.5 (world) over z 509.4..569.4, the small beams every
  3.93 with thin boards 3.33 x 0.833 over z 469.5..509.4; partitions 0.4 thick with a 3.5 x 5.5 doorway and 1.5 x 1.5 windows per span.
- 70-ui.js: labels accept `layers` arrays; `ctx.forestBoardsCut` + `applyOpen("boards")`; the opinions table `#tm-ops` (`opRow`) with 8 rows
  (height of the house = aliyot layer, the ulam = ulamRambam layer, the Sea, the vessels' layout, lighting, the devir doorway, the cherubim's
  faces, the forest house), each with source links and per-option explanations; `toggleRow(..., {src})` source links on the viewing tools
  and the palace layer; the places accordion without opinion duplicates; new places (carvings, the vessels' arrangement, the roofing and
  the upper tier of the forest house) and EXTRAS entries; deep links for Bava Batra 99a, Chagigah 13b, Sukkah 5b, Megillah 10b.
- 90-entry.js: `powerPreference: "high-performance"`, pixel ratio <= 1.5, shadow map 2048, `minPolarAngle 0.06`, key events on the controls;
  `viewSize()` never sizes the view below 2 x 2 (a hidden webview tab reports 0 x 0 → NaN camera, NaN drag deltas = the "stuck" orbit),
  `fitToWindow()` on resize + a 500 ms watchdog, `guardCamera()` restores the last finite camera and rebuilds the OrbitControls
  (`makeControls`, also updates `ctx.controls`) when a NaN gets in. `pointerSafety(canvas)`: setPointerCapture/releasePointerCapture never
  throw; a synthetic pointerup (`ev.__tmSynthetic = true`) ends an OrbitControls drag whose release was lost (window pointerup elsewhere,
  a mouse move with buttons 0, lostpointercapture, blur, hidden page). Consumers of canvas clicks must ignore `__tmSynthetic`.
- 70-ui.js labels -> sources: every label sprite gets `userData.target` from `labelTarget(l)` (l.info/l.refs, else `LABEL_MAP[text]`
  ({v: viewKey} | {p: placeTitle} | fn(l)), else `LABEL_PREFIX`, else a view/place with the same text); a click (<6 px, <600 ms, not
  measuring, not synthetic) on a visible, unoccluded label calls setInfo; the cursor is a hand over such a label. A module that adds a label
  must add a LABEL_MAP entry (or give the label {info, refs}); the UI warns "labels without sources" in the console otherwise.
- tools/shots.mjs: a POST sink for page-rendered screenshots (the pane's screenshots fail while the app window is hidden).
- 75-tour.js (new module, `buildTour`, after ui.js in assemble.mjs / check.mjs / the 90-entry MODULES list): the presentation. A button
  `#tm-tour-btn` at the top left (fixed, left 10, top 6; the header gets padding-left 122). Slides: part 1 = every view of ui_VIEWS in
  order except "aliyot" (it is the row "גובה הבית" of the opinions table), the model set to the default readings (options[0] of every row);
  part 2 = every other option of every enabled row of the opinions table, in table order. A view slide clicks the view's button
  (ctx.ui.viewButton); an opinion slide calls row.onPick + row.mark, shows the option text, calls row.fly, and is undone on leaving.
  Caption box `#tm-tour-box` (bottom left, above the compass): part, n / N, title, sub (row caption), text, sources (ctx.ui.refLinks),
  controls (הקודם / השהה / הבא / סיום), progress bar. Reading time 2.5 s + 55 ms per character, clamped 9..45 s; paused by a canvas
  pointerdown or wheel, by a click on a source link; waits while the cloud confirmation is open (ctx.ui.confirmOpen); Esc ends. At the
  end the rows return to the readings saved at the start and the general view is clicked. `ctx.ui` is exposed at the end of buildUI;
  opRow keeps every row in OPS with `row.mark` and `row.cur`.

## 9d. Changes of 1.0.1-K (the user's third list + Yossi's requests; details in FIXES-1.0.1-K.md §0 contracts and K.1–K.9b)
They override the sections above where they differ. The agents' reports (file:line lists) were kept in the session scratchpad.
- Contracts (FIXES-1.0.1-K §0.5): the four hide-lists `ctx.cutaway` / `yatziaCut` / `ulamCut` / `forestBoardsCut` change ONLY through
  on-model buttons. `ctx.shared.modelButtons` = [{id, label, labelOn, title, anchor() -> [x,y,z] | null, maxDist, get(), set(on), layer?,
  occlude?}] drawn by 70-ui.js as `.tm-pill[data-mb=id]` (shown when the anchor is in view, on the visible side, within maxDist, its layer
  visible and not hidden behind a solid mesh - a ray test every 6th frame); the UI's own: ui-cloud, ui-house, ui-yatzia, ui-ulam, ui-boards;
  "↺ החזר הכל" (`ctx.ui.resetAll`). `ctx.shared.anchors` {houseSouth, yatziaSouth, ulamFront, forestRoof}. `ctx.ui.applyCut/applyOpen`
  are no-ops. Views / places / opinion rows / the tour only fly (their old flags stay as data).
- 10-core.js: `CO.HOUSE_WALL` [7,6,5,4], `YATZIA_BEAM` 1, `xHouseW` -70.5, `xHeiW` -80.5, `zHouseS/N` ±27, ulam ±42, `seaX` 34,
  `seaZ` ±40; `GOLD_OPTS` + `goldStd(tex, extra)` (every gold); `M.bronze` 0xb87a3e / metalness 0.75 / emissive; `TEX.marblePave` +
  `M.marblePave` (inner court floor); `makeTex(..., {bumpSize})`, `ashlarBump(rows, drafted, mapSize)` (half-size bumps); TEX.parochet removed.
- 50-heichal.js: the yatzia per Rashi (§K.2), groups `yatziaSectionEast` / `yatziaSectionCaps`, `ctx.shared.yatziaSection` {on, x0,
  set(on)}, layer `yatziaDims`, pill `hei-yatzia-section`, `ctx.shared.heichal.yatzia`, `.pillars` (Yachin and Boaz, §K.1: sub-group
  "yachinBoaz", 7 instanced meshes `yb-*`); fly points heichalSouth, ulamInside (from above), yatziaSection, yatziaDoor, yachinBoaz,
  yachinBoazCapital; the hidden עליות geometry is built when that layer is first shown.
- 45-vessels.js (rewritten): `vsl_bronze`, the oxen (`vsl_oxGeometry`), the bases (`vsl_baseParts`, `vsl_buildMechonot`: 9 instanced +
  1 moving), `ctx.shared.mechona` {demo {start, stop, reset, seek, running, duration, path}, explode {set(on, instant), on}, partLabels,
  group, home, poseAt, timeline}, layer `mechonaParts`, pills mechonaDemo / mechonaExplode; fly points yam, yamOxen, mechonot,
  mechonaClose, mechonaParts, mechonaDemo.
- 55-interior.js: the tables (posts, tubes, "תיבה פרוצה" loaves, spoons), `ctx.shared.incenseAltar` {layers {on, set}} + layer
  `altarLayers` + pill incenseAltarLayers; the smoke (`int_smokeParts`, animated, always on); the parochet's two faces
  (`int_parochetTex`: east eagles, west lions); robed cherubim; the carvings (`int_carveDraw`, cells 5 x 10, world uvs `int_boxUV`);
  `ctx.shared.wallLayers` {on, set} + layer `wallLayers` + pill wallLayers; floor `int_floorTex`; fly points wallLayers, devirDoor,
  traksinTop, carvings, shulchanot, menorot, shulchanMoshe, incenseAltar, parochet, parochetDevir, cherubim.
- 60-palace.js: the forest house per Rashi as the book (section 7b) and Malbim's 7:6 (section 7a), shields / tzinot / vessels, the king's
  house, the garden, the throne; `pal_groundLevel` reads the terrain grid; pills palaceKingRoofs / palaceThroneRoofs; `ctx.shared.palaceNotes`,
  `anchors.forestRoof`; fly points forestInside, throne, kingsHouse, forestRoof, forestUpper.
- 30-courts.js: לשכת הגזית (`CRT_GAZIT`, `crt_holedWall`, `ctx.shared.lishkatHaGazit`, fly point lishkatHaGazit); the court floor in marble
  inside the walls (182 x 130) with four stone strips around it.
- 75-tour.js (rewritten): `ctx.shared.tour` {modes, start(mode, {speed}), stop, next, prev, pause, setSpeed, state, plan, slides}; modes
  "topics" / "continuous" / "verses" (`tour_VERSES` 105 verses from the Otzaria text, `tour_KINGS` 50 slides with fly-point chains);
  the banner left 12, top 52, bottom 76, width min(300px, 34vw), a bottom sheet under 640 px; features switched on per slide and restored.
- 70-ui.js: views grid without harHabayit / eastGate (16 views); places + EXTRAS rewritten (97 entries); LABEL_MAP for all 108 labels;
  the label card (`ctx.ui.closeCard`, `cardOpen`); tooltips (`data-tip`, `ctx.ui.tip`); compass letters; arrow keys (`orbitBy`,
  `tiltBy`, `zoomBy`, `turnTo`); fade toggle and distance (localStorage `tm1.fade.on`, `tm1.fade.dist`, opacity 0.35); deep links
  `ui_BASE` / `ui_PAGES` / `ui_MN` extended (II Kings, Exodus, Leviticus, Song, Kohelet, I Chr 29, II Chr 6, Mishnah Sanhedrin / Menachot /
  Tamid / Kelim, Menachot / Yoma / Sanhedrin pages).
- 90-entry.js: load timing (`window.__loadTimes`, "[load]" table), no rendering while loading, one-frame yields, `compileAsync` (+ shadow
  depth variants), `minDistance` 2, no `listenToKeyEvents`, pointer safety per pointer (Map), two-finger touchpad zoom (ctrl+wheel pinch,
  two-finger slide), `guardCamera` respects minDistance. 00-lib.js:30895 the OrbitControls wheel delta no longer divides by the DPR.

## 9e. Changes of 1.0.1-L (the user's answers and notes of 29.10-1.11.2026; details in FIXES-1.0.1-L.md and plugin/DEV_NOTES.md "סבב ד'")
They override the sections above where they differ.
- Rule kept: removals (house, yatzia walls, ulam, forest boards, cloud, ark) only from on-model pills; options default off. New rules: every removal or reveal pill flies to what it shows and returns when switched off (table below); the presentation's direct `set` does not fly; a place that switches a feature on switches it off after 15 s unless `timed: false` or the feature's own pill was pressed.
- UI contracts: `ctx.ui.places()` -> [{title, group, view, fp, info, refs, layer, feature, item}] in panel order. `ctx.ui.card` {open(title, text|html, refs, anchor), close(), isOpen()}: one floating card beside the panel, its explanations no longer push the lists. `ctx.ui.autoOff` {seconds: 15, arm(key, off, btn), run(F, btn), cancel(key?), flush(), pending()}. `ctx.ui.smallSources(text)` -> HTML with `.tm-src`, outside quotes and nikud only; labels through `ui_labelText` (28 px of 48).
- Removal-view table: `REVEAL` + `revealPress` in 70-ui.js, keyed by pill id; `ctx.shared.revealViews` {ids, view(id), own(id)} for checks. Every new removal pill needs a row. `ctx.ui.resetAll` does not fly and clears the saved poses; the "↺ החזר הכל" button returns to the first saved pose.
- 10-core.js `CO`: the Sea x 80, z -54 (second reading z 54); `kiyorX` 30, `mechX` 30, `mechZ` [33, 45], which now means two rows.
- 30-courts.js: `CRT_GAZIT` on the north wall, x 48..71.8, z -77..-58; `ctx.shared.slaughterPlace`; `ctx.shared.slaughterLayout` {current "book", keys ["book", "meiri", "oneRow"], names, set(key)}; fly points slaughterPlace, slaughterPlaceClose; pillars stone 1.4 + cedar 2.6, hooks 1.7 / 2.6 / 3.5 (the sister plugin's numbers; no source gives a number).
- 45-vessels.js: `ctx.shared.mechona` {home [34.5, 33], block {cols [21, 25.5, 30, 34.5, 39], rows [33, 45], laver [30, 39]}, purposeLabel, washLabel, demo {duration 47.7, path, station [40.75, -46], washStation [34.5, 22], pourAt, washAt}}; layer mechonaWash; the demo pill flies to mechonaDemo. Fly points mechonot, mechonaClose, mechonaParts, mechonaDemo, kiyorMoshe. Three frames between the rungs per side. Taps: `vsl_tapGeometry` on every base's laver, two along the row (model choice after the book); mesh `kiyorMoshe-taps`, two on Moses' laver north and south, 2.46 above the court floor (Mishnah Yoma 3:10).
- 50-heichal.js: pillars x 6.08, z ±7.17; `ctx.shared.pillarCapital` {current "rashi", keys ["rashi", "malbim"], names, set} (under "malbim" the pillars stand before the ulam); `ctx.shared.ulamTables` {current "none", keys ["none", "ryby", "mishnah"], names, set}; `ctx.shared.heichal.ulamDoor` (10 x 22, two cedar doors in `ctx.ulamCut`); `anchors.ulamFront` [19, 38.5, 0]; section cut x -30.5, fly points yatziaSection, heichalFront, ulamInside, yachinBoazFull, ulamTables.
- 55-interior.js: `ctx.shared.arkInside` {on, set(v)}, layers arkInside / arkLid, pill and fly point arkInside; `southFaced(mat)`; golden altar 1 x 1 x 1 at x -28 (Rabbi) / -30.75 (R. Elazar b. R. Shimon); Moses' table x -37.5..-35.5, z -7 lengthwise in the second layout; marble step stones (8.5 x 9 tefachim); meshes cherub-wings, kaporet-cherub-wings replace the feather meshes; `wallLayers` window x -21.5..-9.5, east to west stone, cedar, gold. A20, evening the heichal's light.
- 57-kelim.js (new, listed in tools/assemble.mjs and tools/check.mjs; build call in 90-entry.js): `ctx.shared.kelim` {on, set(v), title, info, refs, existing, items [{key, name, label, verse, metal, text, shape, refs, anchor, fly}]}, layer kelim, labels with `kelimKey`, pill and fly point kelim, centre x -60, z -118; `timed: false`.
- 60-palace.js: `ctx.shared.forestHouse.keys` ["rashi", "metzudot", "mzd"], layers forestMzd, forestBoards; `ctx.shared.throneVersion` {current "pesukim", keys ["pesukim", "targumSheni", "estherRabbah", "beitHamidrash"], names, set(key)}; `ctx.shared.throne` {body, steps, ramp, ark, top, seatTop, head, elders, pairs, ascent {start(version?), stop(), reset(), seek(sec), running, duration, version, elapsed()}, witnesses {start, stop, reset, seek, running, duration, elapsed}, script, witnessScript, versions, names}; layers throne<Version>, throneMidrash; pills palaceThroneAscent, palaceThroneWitnesses, hidden in "pesukim". A23 cedar roofs; A24 no thick עבים at the end of the forest roof in Rashi's reading, the word עב only in אולם העמודים; A25 eagle as Targum Sheni's sixth pair; A26 the "לכאורה" note; A27 measured contacts; the user's request for a covered leg alone to show the climb.
- 75-tour.js: the plan covers every view and place, other readings last; the panel closes through the burger during the tour and returns after; `viewShift` (lens shift, `camera.view` active: use `camera.project`); `tour.plan()` anim "ascent+witnesses", `tour.seek(sec)` runs past the ascent into the witnesses; `tour_SHORT` for the throne's long texts.
- 90-entry.js: `ent_clampView`, `ent_viewInclude` (a flight's target is always allowed), `ent_damp` (140 ms, time based), `controls.maxDistance` 1400; a direct `controls.target.set` beyond the band is pulled back.
- 70-ui.js: the opinion row of `slaughterLayout`, the owners' Part 6 texts, and the raw `ctx.shared.kelim.refs` at about line 2231.
- Testing: SwiftShader draws about one frame in several seconds, so judge motion through `seek`; wrap every headless Chrome in `chrome-slot.cjs run <command>` (L-reports folder; `CHROME_SLOTS`, default 4), in the background, with a short profile path in %TEMP%; older harnesses need 57-kelim.js in their module list.

## 10. Testing (for the integrator)
`node tools/assemble.mjs && node --check plugin/bundle.js`, then `node tools/serve.mjs 8765` and open http://127.0.0.1:8765/ in the browser
pane; check the console; click each view; screenshot.
