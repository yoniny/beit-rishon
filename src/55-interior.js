  // ===== 55-interior.js — inside the house: heichal doors, kodesh finishes and vessels (two layouts), amah traksin with the devir
  // door and the parochet, devir (cherubim, ark, even shetiya). Every dimension carries its source; "model choice" = not in the sources.
  // Coordinates: +x east (front), +z south (right), y up, 1 unit = 1 amah. Kodesh x -3.5..-43.5, z +-10, y 12..42 (I Kings 6:2, 6:17);
  // devir x -44.5..-63.5, y 12..32 (6:20). Research positions (research-part1-short.md, "כלי הקודש"): x_r measured from the heichal
  // door westward, z_r from the north wall southward -> model x = -3.5 - x_r, z = -10 + z_r.
  // 1.0.1-K, step K.4 (FIXES-1.0.1-K.md): (1) THE TABLES rebuilt after Rashi, the Mishnah (Menachot 11) and the book p21L - frame and crown,
  // the bread "כמין תיבה פרוצה" with its horns (R. Meir's fold), two stacks with the spoons between them, four סניפין standing on the floor
  // with five branches, 28 tubes (tableGeo); the R. Elazar b. R. Shimon column no longer enters the north skin. (2) THE CHERUBIM after the
  // book p07L: long robes, no arms, bird wings across the devir (int_robeGeo; the feathers gone in L.84, int_wingLoft); the kaporet's cherubim with raised wings
  // (Ex 25:20, Sukkah 5b). (3) THE PAROCHET: two different woven faces, eagles toward the heichal and lions toward the devir (int_parochetTex).
  // (4) THE INCENSE ALTAR: 1 x 1 x 2 with horns and crown, bright gold, and its LAYERS (stone, cedar, gold) - ctx.shared.incenseAltar.layers,
  // ctx.layers.altarLayers (labels "אבן" / "ארז" / "זהב"), the on-model button "incenseAltarLayers" in ctx.shared.modelButtons. Fly points:
  // shulchanot (fixed: it was outside the north wall), shulchanMoshe, menorot (it was outside the south wall), incenseAltar - all four follow
  // the kodesh layout - and parochet, parochetDevir, cherubim (re-aimed). Contracts: FIXES-1.0.1-K.md 0.5.
  // 1.0.1-K, step K.5: (1) THE CARVINGS redrawn after the book (p08L/R, p07L, p06; int_carveDraw, INT_CARVE_LAYOUT): a woven ground (Rashi
  // 6:18 "קלוע היה בציורי קליעות"; Rashi II Chr 3:5), twisted ropes, pairs of robed cherubim without arms under the arch of their wings,
  // tall palms, egg-knobs, roses and hanging chains - one cell 5 x 10 amot = a register (kodesh 3, devir 2, doors 2), no seam, nothing
  // over anything, world uvs on every carved face (int_boxUV: no mirror, the door boards continue), gold via goldStd; ~3.5x cheaper to draw.
  // (2) THE WALL AND FLOOR LAYERS - an option: ctx.shared.wallLayers {on, set}, ctx.layers.wallLayers (labels "אבן (ו, ז)", "ארז מגולף (ו,
  // טו; ו, יח)", "זהב (ו, כא–כב)", "ברושים (ו, טו)", "זהב (ו, ל)"), the on-model button "wallLayers": a stepped window in the north wall of the
  // kodesh (x -28.5..-19.5) and the floor before it - stone, carved cedar (drawn on first use), gold; cypress on the floor. (3) THE FLOOR:
  // gold over cypress boards, the joints faint (int_floorTex). (4) THE INCENSE SMOKE: coals and a thin straight column to the ceiling
  // (int_smokeParts; Yoma 38a, 53a; Song 3:6 with Rashi). (5) THE CHERUBIM checked against the book (the addendum B): slimmer body, smaller
  // head on a short neck, wings nearer to level, feathers dark in their grooves (gone in L.84). (6) Interior fly points: all inside the
  // closed house with a clear ray (devirDoor, traksinTop, carvings re-aimed; wallLayers new). (7) The east skin of boxes (it was mirrored);
  // the parochet's weave in world uvs and the staffs' swellings smooth; source notes Q2-2 (הפותות) and Q2-6 (Ralbag 6:21).
  // 1.0.1-K review fixes: the ulam's cedar courses on the house's east face are all out of ctx.cutaway (the south ones were in it); the
  // altar-layers pill's anchor fills one array (no per-frame allocation); the incense smoke is never picked nor ray-tested (userData.noPick,
  // int_noRaycast); R. Elazar b. R. Shimon's "shulchanot" camera moved off the smoke column (south-west of Moses' table).
  // 1.0.1-L (FIXES-1.0.1-L.md, group "interior"): L.46 every table in the FORM of Moses' table - towers, tubes and spoons on all eleven, the
  // bread by the opinion row (the first round-L try's thin racks replaced); L.13 the golden altar 1 x 1 x 1 with its horns; L.14 + L.31 the
  // wall / floor layers window larger (12 x 14), stone / carved cedar (upright boards, joints) / gold in strong contrast, moved east toward
  // the entrance (x -21.5..-9.5), a frontal fly point; L.17 the flat carvings clearer (palette, cuts, a cheap inner shading); L.30 the
  // cherubim's wings in a HORIZONTAL plane (Solomon's at the shoulders, Moses' raised over their heads); L.32 a pentagonal lintel over the
  // devir doorway in Rashi's reading; L.35 the cherubim's faces modelled in gold (no dark dots), the carved profiles redrawn; L.47 the south
  // faces reflect the mirrored environment (the left wall no longer darker); L.52 the golden altar's place sourced (placed by L.69 below);
  // L.53 the incense column thicker; L.54 the staffs press out of the parochet; L.55 the lions walk right to left (the
  // eagles look left); L.56 the foundation stone kept under the ark (Rambam 4:1, Tosefta Yoma); the rashbash "shulchanot" note corrected.
  // 1.0.1-L, part 4 (the user's decisions of 31.10.2026): L.69 the golden altar on the axis just EAST of the rows of tables and menorot (the
  // sources quoted at the altar); L.70 Moses' table and menorah between the five and the five (Menachot 98b-99a with Rashi: at the head of
  // the two rows for Rabbi, in the middle of the columns for R. Elazar b. R. Shimon; the book p22); L.71 a stone of three steps before every
  // menorah (Tamid 3:9; Sifrei; Rashi Num 8:2; Rambam 3:11; Bartenura); L.73 the menorot an amah further west than the tables (the user, Ralbag
  // 7:49, the book), and every menorah rebuilt with all the cups, knobs and flowers of Ex 25:31-36 in the Baraita's tefachim (Menachot 28b, Rashi
  // 25:35, Rambam 3:10) - one merged geometry (menorahGeo), instanced; the vessel labels and the layout fly points moved with them.
  // 1.0.1-L, the verifier's fixes: every knob of the menorah visible (8 of the 11 were inside the branches and the shaft), the 6th tefach as the
  // book, flowers with petals, the ornaments "משקדים"; the stones of the steps on the sources' side (north / west, Ma'asei LaMelech); the curtain
  // closes the slit under the pentagonal lintel; the devir's south door leaf and the altar's layer labels; a larger stone window in the altar.
  // 1.0.1-L, part 5 (the user, 1.11.2026): L.84 every cherub's wing is ONE smooth solid (int_wingLoft), no feathers ("את כנפי כרובים אל תעשה כמו נוצות
  // אלא כיחידה אחת ותוודא שנוגעת זו בזו"), the tips really touching; the kaporet's cherubim back to the raised, arched wings of the book (book p. 45);
  // L.85 the ark is hollow, and the on-model pill "arkInside" lifts the kaporet off and shows what the book draws in and by it (book p. 46).
  // Part 6, his decisions: A15 the layers window in the book's order (stone toward the entrance, gold furthest); A16 the eagles' earlier direction; A17 + A18 Moses' table in R. Elazar's layout
  // (Tosafot Menachot 98b, Meiri Yoma 51b; the columns, menorot and altar follow); A19 the stone before each menorah as Yalkut Me'am Lo'ez (marble, 8.5 x 9 tefachim); A20 the east wall, the traksin and the doorposts' light.
  var INT_PENT_SIDE = 1;                                             // devir doorposts: pentagon side = the traksin thickness 1 (research: "אורך צלע 1 אמה")
  var INT_PENT_R = INT_PENT_SIDE / (2 * Math.sin(Math.PI / 5));       // circumradius 0.8507
  var INT_PENT_APO = INT_PENT_R * Math.cos(Math.PI / 5);              // apothem 0.6882
  var INT_PENT_DEPTH = INT_PENT_R + INT_PENT_APO;                     // side-to-opposite-vertex 1.5388
  var INT_DEVIR_CLEAR = 6;                                            // clear width between the post vertices (model choice: no measure in the sources)
  var INT_DEVIR_HOLE = INT_DEVIR_CLEAR + 2 * INT_PENT_DEPTH;          // the hole cut in the traksin: 9.08 (the posts stand in it)
  var INT_DEVIR_DOOR_H = 12;                                          // devir doorway height (model choice)
  var INT_HEI_DOOR_W = 10, INT_HEI_DOOR_H = 20;                       // heichal doorway (model choice: the ratio of the Second Temple's heichal door, Middot 4:1, applied by the user)

  function int_m4(x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const m = new Matrix4();
    m.compose(new Vector3(x, y, z), new Quaternion().setFromEuler(new Euler(rx, ry, rz)), new Vector3(sx, sy, sz));
    return m;
  }
  function int_inst(parent, geo, mat, mats, shadows = true) {
    const im = new InstancedMesh(geo, mat, mats.length);
    mats.forEach((mm, i) => im.setMatrixAt(i, mm));
    im.castShadow = shadows;
    im.receiveShadow = shadows;
    parent.add(im);
    return im;
  }
  // a part of a vessel standing at (tx, ty, tz) and turned by rot about y: local offset (lx, ly, lz) -> world matrix
  function int_part(tx, ty, tz, rot, lx, ly, lz, ry = 0, rx = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const c = Math.cos(rot), s = Math.sin(rot);
    return int_m4(tx + lx * c + lz * s, ty + ly, tz - lx * s + lz * c, rx, rot + ry, rz, sx, sy, sz);
  }
  // 1.0.1-K review (interior-3): a Mesh.raycast that finds nothing, for a mesh that is no surface (the incense smoke)
  function int_noRaycast() {}

  // ===== 1.0.1-K (K.5): the carved gold of the walls and the doors, redrawn after the book (the user's reference, p08L, p08R, p07L, p06;
  // the user: "תנסה לעשות את איורי ההיכל וקה"ק יותר מדויקים") =====
  // I Kings 6:29 "ואת כל קירות הבית מסב קלע פתוחי מקלעות כרובים ותמרת ופטורי צצים מלפנים ולחיצון" (Rashi: "לבית הכפרת הפנימי ולהיכל החיצון" -
  // the devir and the heichal); 6:18 "וארז אל הבית פנימה מקלעת פקעים ופטורי צצים"; 6:32 and 6:35 the same on the doors; II Chr 3:5 "ויעל עליו
  // תמרים ושרשרת", 3:7 "ופתח כרובים על הקירות". The elements, as the commentaries explain them and as the book draws them:
  //  - the woven ground ("מקלעת"): Rashi 6:18 "קלוע היה בציורי קליעות"; Rashi II Chr 3:5 "ושרשרות... היה מציר ציור כעין שרשרת... בין ציור
  //    לציור כדי שלא יהיה חלק בינתים" - a fine chain-like weave fills the space between the figures (the book: "מקלעת - ציורי קליעות");
  //  - the ropes ("פטורי"): Rashi 6:18 "לשון חבלים", 6:29 "חבלים ופרחים" - a twisted rope at the foot of every register (the book: "פטורי - חבלים");
  //  - the flowers ("ציצים"): Rashi "לשון פרחים"; Radak 6:18 "פתוחים דמות ציצים ופרחים"; Metzudat Zion "ציורי פתיחת הפרחים" - open roses in
  //    clusters of three, as the book draws them ("ציצים - פרחים");
  //  - the chains: Targum 6:18 "ואטונין שושנין" (Rashi "צורת שלשלאות"); II Chr 3:5 "ושרשרות" (Metzudat Zion "שלשלאות"; Rashi there, a second
  //    reading: "ממש שרשרות של זהב") - three chains hanging from the upper roses (the book: "שרשראות");
  //  - the palms ("תמרת"): Radak 6:29 "צורת תמרים"; Metzudat Zion "ציורי אילני תמר" (the book: "תמורות - דקלים");
  //  - the knobs ("פקעים"): Rashi 6:18 "כמין כפתורים"; Targum "ביעין" - eggs (Rashi: "חקוק כדמות ביצים עגלים"); Radak and Metzudat Zion
  //    "פקועות שדה" (gourds) - an egg-shaped knob (the book: "פקעים - כדורים");
  //  - the cherubim ("כרובים"): a child's face - "כרביא" (Rashi II Chr 3:10 "תבנית ילדים וילדות"; Metzudat Zion II Chr 3:7 "פרצוף תינוק"); as
  //    the book draws them: two figures in long robes, NO arms (none in the verses), facing each other, their wings rising behind their heads
  //    and meeting above them in an arch.
  // The carving and the gold: Rashi 6:32 "היה מרדד הזהב טסין דקין לשקען בפתוחי הצורות, להיות שוקע בו במקום החקק, ובולט על הבליטה... ויהיו
  // צורות העץ נכרות בזהב"; 6:35 "שוקע במקום שקועו, ובולט במקום בליטתו"; Radak 6:29 "מפותחים לא שהיו בולטין": the figures are smooth and flush
  // with the face, the weave and their outlines cut in - the bump map is lower in the cuts and the colour map darker only there (FIXES K.5.2).
  // MODEL CHOICES, after the book's arrangement (it notes "[סדר העיטורים להמחשה בלבד]"): ONE CELL of 5 x 10 amot = one register: the rope,
  // a pair of cherubim (3.3 high) with three roses between them, a knob above them, the upper roses with their three chains, and a palm
  // (7.3 high: twice the pair, as in the book) between every two pairs. 10 divides both rooms (kodesh 30 = 3 registers, devir 20 = 2) and 5
  // the kodesh's 40 (8 cells), so no figure is cut by a ceiling (review H2-CARVE-3); the doors take the same cell scaled to their height
  // (int_carvedMat). Every carved face gets its uvs from world positions (int_boxUV), so the pattern runs on across the pieces of a wall,
  // across the two boards of a door (H2-CARVE-4) and is never mirrored (H2-CARVE-5). The texture: a 512 x 1024 colour map (102.4 px per
  // amah) and a 256 x 512 bump; the weave is one 16-px cell repeated by a pattern fill, the roses and the chains are drawn once and stamped
  // (drawImage), the base is the weave itself, so the tile has no seam (H2-CARVE-1), and the rope's twist (0.25) divides the 5 (H2-CARVE-6).
  var INT_CARVE_U = 5, INT_CARVE_V = 10;
  // the layout of the cell (amot: u from its left edge, v up from its bottom). Nothing touches anything else (review H2-CARVE-2; the K.5
  // checks rasterize every motif alone through int_carveDraw's `only` and count the shared pixels: none, but the chains hanging from the
  // upper roses). Measured extents (amot): rope v 0.05..0.48; pair u 0.28..3.72, v 0.48..4.21; knob v 4.82..5.48; chains v 6.29..8.98;
  // roses v 0.52..0.91 and 8.95..9.37 (u 1.37..2.62); palm v 0.48..7.32, its crown u 3.1..5.9 (wrapping 0.9 into the next cell).
  // 1.0.1-L (L.17, the user: "תראה אם מספיק ברור כשזה חלק"): checked at 1280 x 800 from "ההיכל", the carvings' place, "קודש הקדשים" and the
  // doors - close by the figures read, but from the room's views the pairs of cherubim melted into the woven ground (the figures' gold was
  // only ~15% lighter than the weave's, the cut around them 0.03 = under a pixel at the mip levels those views use). So, the figures still
  // FLUSH with the face (Rashi 6:32, Radak 6:29): the cut around every figure 0.05 (cut), the wing a broader band with larger feathers (wing),
  // the woven ground darker and the figures lighter (INT_CARVE_PAL.gold), and a little painted shading inside every figure - light on its
  // upper-left edge, shade on its lower-right (shade / glow; the colour maps only, the figure stays flat).
  var INT_CARVE_LAYOUT = {
    cut: 0.05,                                                 // 1.0.1-L: the cut around every figure (K.5: 0.03)
    wing: { cut: 0.27, band: 0.2, scR: 0.08, scOff: 0.115 },   // 1.0.1-L: the wing's outline and band, its feathers' radius / offset (K.5: 0.2, 0.145, 0.062, 0.085)
    shade: 0.035,                                              // 1.0.1-L: the inner shading's band (amot; relief below)
    rope: { v0: 0.06, v1: 0.46, twist: 0.25 },                // 20 twists in the 5 amot of the cell
    pair: { cx: 2.0, fx: 1.15, vb: 0.5, h: 3.3 },             // the cherubim at cx -+ fx, standing on the rope (vb), 3.3 high; the arch u 0.28..3.72
    lowRoses: { u: [1.6, 2.0, 2.4], v: 0.71, r: 0.2 },        // on the rope between the two figures (their hems end at u 1.25 / 2.75)
    knob: { u: 2.0, v: 5.15, rx: 0.24, ry: 0.31 },
    upRoses: { u: [1.58, 2.0, 2.42], v: 9.15, r: 0.2 },
    chains: { u: [1.7, 2.0, 2.3], v0: 6.3, v1: 8.98 },
    palm: { u: 4.5, vb: 0.5, trunk: 5.9, frond: 1.45 }        // trunk to v 6.4, eleven fronds about 1.4 long
  };
  var INT_CARVE_PAL = {
    // the colour maps: gold (the walls and the doors) and cedar (the carved cedar under the gold, shown by the wall-layers exhibit); the bump
    // map: high = the surface, the woven ground lower, the cuts lowest. 1.0.1-L (L.17): the gold's weave darker (gap #ad882e, link #f2d270)
    // and its figures lighter (f0..f2 #d2a53e, #efcc66, #fbe7a2), the cut darker (#5a3a0a); shade / glow = the figures' inner shading.
    // 1.0.1-L (L.14): the cedar a red-brown wood (K.5's pale #dcbc84 read like the stone beside it in the exhibit)
    gold: { gap: "#8f6c22", link: "#dcb95a", linkHi: "rgba(255,236,170,0.55)", f0: "#e2b64a", f1: "#f8d97a", f2: "#fff0bc", cut: "#4a2e06",
      line: "rgba(96,62,10,0.9)", hi: "rgba(255,246,206,0.85)", ropeA: "#f5d878", ropeB: "#86601a",
      shade: "rgba(120,76,10,0.75)", glow: "rgba(255,250,226,0.9)" },
    // 1.0.1-L (L.31): the cedar's figures lighter and its weave darker, so the carving reads cut in the wood (#8a4c2a / #a8663a / #c4844f on
    // #8c5230 before)
    // (resumed round-L try: the first try's #3e200e / #7a4426 ground read almost black beside the gold; now a warm medium cedar - the
    // figures light, the weave a clear red-brown - distinct from the grey stone and the yellow gold at a glance)
    cedar: { gap: "#5a2e14", link: "#9a5a30", linkHi: "rgba(224,164,112,0.45)", f0: "#b8763f", f1: "#d9985a", f2: "#f0bc80", cut: "#2a1208",
      line: "rgba(50,22,8,0.85)", hi: "rgba(250,212,166,0.65)", ropeA: "#d9985a", ropeB: "#5a2e14",
      shade: "rgba(70,30,12,0.6)", glow: "rgba(250,216,172,0.6)" },
    bump: { gap: "#3c3c3c", link: "#8e8e8e", linkHi: "#a4a4a4", f0: "#b6b6b6", f1: "#d4d4d4", f2: "#ececec", cut: "#121212",
      line: "#6c6c6c", hi: "#f4f4f4", ropeA: "#dadada", ropeB: "#4a4a4a" }
  };
  // one weave cell, s px square: two rows of slanted links s/2 apart (the second row offset by half a link) - a link every 0.078 amah, as
  // fine as the book draws the weave next to its figures; every link is drawn with its wrapped copies, so the cell repeats without a seam
  function int_weaveCell(P, s) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const x = cv.getContext("2d");
    x.fillStyle = P.gap;
    x.fillRect(0, 0, s, s);
    const p = s / 2, pts = [];
    for (const [px, py] of [[p / 2, p / 2], [0, p * 1.5]]) for (let ox = -s; ox <= s; ox += p) for (const oy of [-s, 0, s]) pts.push([px + ox, py + oy]);
    for (const [col, k, dx, dy] of [[P.link, 1, 0, 0], [P.linkHi, 0.5, -0.07 * p, -0.05 * p]]) {
      x.fillStyle = col;
      x.beginPath();
      for (const [px, py] of pts) {
        x.moveTo(px + dx + 0.42 * p * k * Math.cos(-0.55), py + dy + 0.42 * p * k * Math.sin(-0.55));   // the ellipse starts there (no joining line)
        x.ellipse(px + dx, py + dy, 0.42 * p * k, 0.2 * p * k, -0.55, 0, Math.PI * 2);
      }
      x.fill();
    }
    return cv;
  }
  // draws the cell on a context W x Hh px at k px per amah with the palette P. `only` (the K.5 checks): draw one motif alone, no ground.
  function int_carveDraw(c, W, Hh, k, P, only) {
    const L = INT_CARVE_LAYOUT, CU = INT_CARVE_U;
    const want = (n) => !only || only === n;
    const mk = (w, h) => { const cv = document.createElement("canvas"); cv.width = Math.max(1, Math.ceil(w)); cv.height = Math.max(1, Math.ceil(h)); return cv; };
    c.setTransform(1, 0, 0, 1, 0, 0);
    if (only) c.clearRect(0, 0, W, Hh);
    else {
      c.fillStyle = c.createPattern(int_weaveCell(P, Math.round(k * 0.15625)), "repeat");   // 16 px (map) / 8 px (bump): 32 links across, 128 rows up
      c.fillRect(0, 0, W, Hh);
    }
    c.setTransform(k, 0, 0, -k, 0, Hh);                // from here on (u, v) in amot, v up
    c.lineJoin = "round";
    c.lineCap = "round";
    const LW = L.cut;                                  // the cut around every figure (1.0.1-L: 0.05, K.5 0.03)
    // the smooth, rounded face of a figure (a gradient across it), then its cut outline. 1.0.1-L (L.17): `build` makes the figure's path (it
    // is made again for each step); where the palette has shade / glow (the colour maps), a little shading inside the figure: clipped to the
    // figure, its own outline is stroked again shifted up-left (so the band falls inside its lower-right edges: the shade) and shifted
    // down-right (inside its upper-left edges: the light), in three soft passes. Cheap - no canvas shadows (the first round-L try blurred
    // a shadow of a 15 x 30-amot shape per figure: the canvas of the live page was reset half-way and the walls rendered dark). The figure
    // itself stays flush (Rashi 6:32, Radak 6:29) - this is colour only.
    const relief = (u0, u1, build) => {
      const gr = c.createLinearGradient(u0, 0, u1, 0);
      gr.addColorStop(0, P.f0); gr.addColorStop(0.3, P.f1); gr.addColorStop(0.55, P.f2); gr.addColorStop(0.8, P.f1); gr.addColorStop(1, P.f0);
      c.fillStyle = gr;
      c.beginPath(); build(); c.fill();
      if (P.shade) {
        c.save();
        c.beginPath(); build(); c.clip();
        for (const [col, s] of [[P.shade, 1], [P.glow, -1]]) for (const f of [1, 0.66, 0.33]) {
          c.save();
          c.translate(-s * L.shade * f, s * L.shade * f);     // shade: up-left (u -, v +); light: down-right
          c.globalAlpha = 0.45;
          c.strokeStyle = col; c.lineWidth = 2 * L.shade * f;
          c.beginPath(); build(); c.stroke();
          c.restore();
        }
        c.restore();
      }
      c.beginPath(); build();
      c.strokeStyle = P.cut;
      c.lineWidth = LW;
      c.stroke();
    };
    const lines = (draw, w, col) => { c.beginPath(); draw(); c.strokeStyle = col || P.line; c.lineWidth = w; c.stroke(); };
    // a motif crossing a side edge of the cell is drawn again on the other side
    const wrapped = (u0, u1, fn) => {
      for (const du of [-CU, 0, CU]) if (u1 + du > 0 && u0 + du < CU) { c.save(); c.translate(du, 0); fn(); c.restore(); }
    };
    // stamps: a motif drawn once in its own canvas (at this canvas's scale) and stamped where it repeats (FIXES K 0.6)
    const stamp = (w, h, draw) => {
      const cv = mk(w * k, h * k), x = cv.getContext("2d");
      x.setTransform(k, 0, 0, -k, 0, h * k);
      x.lineJoin = "round";
      x.lineCap = "round";
      draw(x);
      return cv;
    };
    const put = (cv, u, v, w, h) => {                  // the stamp's centre at (u, v); drawn in canvas pixels (no flip)
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(cv, u * k - cv.width / 2, Hh - v * k - cv.height / 2); c.restore();
    };
    // ---- the rope ("פטורי" - Rashi: "חבלים"): strands at k * twist, so the twist at u and at u + 5 are the same strand ----
    if (want("rope")) {
      const { v0, v1, twist } = L.rope, h = v1 - v0, vm = (v0 + v1) / 2, n = Math.round(CU / twist);
      c.fillStyle = P.ropeB;
      c.fillRect(0, v0, CU, h);
      const ra = h * 0.55, rb = twist * 0.27, rot = 1.05;          // a strand: a long oval slanted 60 deg, the strands side by side = a twist
      c.beginPath();
      for (let i = -1; i <= n + 1; i++) { const u = i * twist; c.moveTo(u + ra * Math.cos(rot), vm + ra * Math.sin(rot)); c.ellipse(u, vm, ra, rb, rot, 0, Math.PI * 2); }
      c.fillStyle = P.ropeA;
      c.fill();
      c.strokeStyle = P.cut;
      c.lineWidth = 0.014;
      c.stroke();
      lines(() => { for (let i = -1; i <= n + 1; i++) { const u = i * twist - rb * 0.3; c.moveTo(u - ra * 0.55 * Math.cos(rot), vm - ra * 0.55 * Math.sin(rot)); c.lineTo(u + ra * 0.5 * Math.cos(rot), vm + ra * 0.5 * Math.sin(rot)); } }, 0.016, P.hi);
      lines(() => { c.moveTo(-0.1, v0); c.lineTo(CU + 0.1, v0); c.moveTo(-0.1, v1); c.lineTo(CU + 0.1, v1); }, 0.02, P.cut);
    }
    // ---- the roses ("ציצים" - open flowers): one rose drawn once, stamped ----
    const rose = (x, r) => {
      const petal = (cx, cy, rr) => { x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * 2); x.fillStyle = P.f1; x.fill(); x.strokeStyle = P.cut; x.lineWidth = LW * 0.8; x.stroke(); };
      for (let i = 0; i < 5; i++) { const a = Math.PI / 2 + i * Math.PI * 2 / 5; petal(r + Math.cos(a) * r * 0.52, r + Math.sin(a) * r * 0.52, r * 0.44); }
      for (let i = 0; i < 5; i++) { const a = Math.PI / 2 + Math.PI / 5 + i * Math.PI * 2 / 5; petal(r + Math.cos(a) * r * 0.26, r + Math.sin(a) * r * 0.26, r * 0.3); }
      x.beginPath(); x.arc(r, r, r * 0.16, 0, Math.PI * 2); x.fillStyle = P.f2; x.fill(); x.strokeStyle = P.cut; x.lineWidth = LW * 0.7; x.stroke();
    };
    if (want("roses")) {
      const R = L.lowRoses.r, cv = stamp(2 * R + 0.06, 2 * R + 0.06, (x) => { x.translate(0.03, 0.03); rose(x, R); });
      for (const u of L.lowRoses.u) put(cv, u, L.lowRoses.v, 2 * R, 2 * R);
      for (const u of L.upRoses.u) put(cv, u, L.upRoses.v, 2 * R, 2 * R);
    }
    // ---- the chains (Targum "אטונין"; II Chr 3:5 "ושרשרות"): one chain drawn once, stamped three times under the upper roses ----
    if (want("chains")) {
      const { v0, v1 } = L.chains, len = v1 - v0, step = 0.085, w = 0.12;
      const cv = stamp(w, len, (x) => {
        x.beginPath();
        for (let v = step / 2, i = 0; v < len; v += step, i++) {
          if (i % 2) { x.moveTo(w / 2, v - 0.045); x.lineTo(w / 2, v + 0.045); }
          else { x.moveTo(w / 2 + 0.034, v); x.ellipse(w / 2, v, 0.034, 0.052, 0, 0, Math.PI * 2); }
        }
        x.strokeStyle = P.cut; x.lineWidth = 0.034; x.stroke();
        x.strokeStyle = P.f2; x.lineWidth = 0.014; x.stroke();
      });
      for (const u of L.chains.u) put(cv, u, (v0 + v1) / 2, w, len);
    }
    // ---- the knob ("פקעים" - "כמין כפתורים", eggs): a rounded egg above the pair ----
    if (want("knob")) {
      const { u, v, rx, ry } = L.knob;
      c.beginPath(); c.ellipse(u, v, rx, ry, 0, 0, Math.PI * 2);
      const gr = c.createRadialGradient(u - rx * 0.35, v + ry * 0.35, rx * 0.1, u, v, ry * 1.05);
      gr.addColorStop(0, P.f2); gr.addColorStop(0.55, P.f1); gr.addColorStop(1, P.f0);
      c.fillStyle = gr; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW; c.stroke();
      lines(() => { c.ellipse(u - rx * 0.32, v + ry * 0.38, rx * 0.22, ry * 0.12, -0.6, 0, Math.PI * 2); }, 0.012, P.hi);
    }
    // ---- the pair of cherubim: the left figure faces right (+u); the right one is its mirror image about the pair's centre ----
    const figure = (x0, vb) => {                       // in the pair's frame (u = 0 at its centre); vb = the hem
      // the wing first: from the back of the shoulder out, up behind the head and over it to the centre, where it meets the other's wing
      const B0 = [x0 - 0.12, vb + 2.55], B1 = [x0 - 0.56, vb + 2.82], B2 = [x0 - 0.5, vb + 3.66], B3 = [x0 + 0.05, vb + 3.6];
      const bez = (t) => { const s = 1 - t; return [s * s * s * B0[0] + 3 * s * s * t * B1[0] + 3 * s * t * t * B2[0] + t * t * t * B3[0], s * s * s * B0[1] + 3 * s * s * t * B1[1] + 3 * s * t * t * B2[1] + t * t * t * B3[1]]; };
      // 1.0.1-L (L.17): the feathers larger and the band broader (L.wing), so the wing reads as a wing from the room's views
      const WG = L.wing;
      c.beginPath();                                   // the feathers along the outer edge of the curl (scallops)
      for (let i = 0; i < 8; i++) {
        const t = 0.1 + i * 0.1, p = bez(t), q = bez(t + 0.01), du = q[0] - p[0], dv = q[1] - p[1], n = Math.hypot(du, dv) || 1;
        const cxp = p[0] - dv / n * WG.scOff, cyp = p[1] + du / n * WG.scOff;
        c.moveTo(cxp + WG.scR, cyp); c.arc(cxp, cyp, WG.scR, 0, Math.PI * 2);
      }
      c.fillStyle = P.f1; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW * 0.8; c.stroke();
      const path = () => { c.moveTo(B0[0], B0[1]); c.bezierCurveTo(B1[0], B1[1], B2[0], B2[1], B3[0], B3[1]); c.lineTo(0, vb + 3.6); };
      lines(path, WG.cut, P.cut);                      // the wing: its cut outline, then the gold band, then the feather lines on it
      lines(path, WG.band, P.f1);
      lines(path, WG.band * 0.35, P.f2);               // 1.0.1-L: a lighter ridge along the band (its rounded face, painted)
      lines(() => { for (let i = 0; i < 9; i++) { const p = bez(0.08 + i * 0.1); c.moveTo(p[0], p[1]); c.lineTo(p[0] + (x0 + 0.05 - p[0]) * 0.15, p[1] + (vb + 3.62 - p[1]) * 0.15); } }, 0.016);
      lines(() => { for (let u = x0 + 0.15; u < -0.02; u += 0.09) { c.moveTo(u, vb + 3.6 - WG.band * 0.42); c.lineTo(u + 0.06, vb + 3.6 + WG.band * 0.42); } }, 0.016);
      // the robe: from the hem (flared) to the neck, no arms
      relief(x0 - 0.42, x0 + 0.4, () => {
        c.moveTo(x0 + 0.4, vb);
        c.quadraticCurveTo(x0 + 0.15, vb + 0.35, x0 + 0.15, vb + 1.5);
        c.lineTo(x0 + 0.13, vb + 2.5);
        c.quadraticCurveTo(x0 + 0.13, vb + 2.76, x0 + 0.06, vb + 2.86);
        c.lineTo(x0 - 0.08, vb + 2.86);
        c.quadraticCurveTo(x0 - 0.17, vb + 2.7, x0 - 0.17, vb + 2.4);
        c.lineTo(x0 - 0.18, vb + 1.5);
        c.quadraticCurveTo(x0 - 0.19, vb + 0.35, x0 - 0.42, vb);
        c.closePath();
      });
      lines(() => {                                    // the long folds of the robe
        c.moveTo(x0 + 0.02, vb + 1.7); c.quadraticCurveTo(x0 + 0.04, vb + 0.7, x0 + 0.17, vb + 0.06);
        c.moveTo(x0 - 0.07, vb + 1.35); c.quadraticCurveTo(x0 - 0.09, vb + 0.6, x0 - 0.22, vb + 0.06);
      }, 0.016);
      // the head: a child's face in profile, the hair a cap over the top and the back. 1.0.1-L (L.35, "פרצופי הכרובים נוראים" - the carved
      // ones checked too): K.5's head was an oval with a triangle nose and a dark dot for the eye; now a drawn profile - forehead, a straight
      // nose, the lips, a rounded chin - an almond eye of two thin lids (no dot) and a cap of hair with its hairline (model choice, as the
      // book's calm faces)
      const hy = vb + 3.05, hx = x0 + 0.02;
      const PROF = [[0, 0.2], [0.13, 0.15], [0.165, 0.06], [0.162, 0.035], [0.207, -0.035], [0.168, -0.058], [0.177, -0.088], [0.161, -0.104],
        [0.17, -0.122], [0.152, -0.168], [0.09, -0.2], [0, -0.19], [-0.085, -0.15], [-0.168, 0], [-0.11, 0.165]];
      const smooth = (pts) => {                          // a closed smooth path through the midpoints of the points
        const m = (k) => { const a = pts[k % pts.length], b = pts[(k + 1) % pts.length]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
        let p = m(pts.length - 1);
        c.moveTo(hx + p[0], hy + p[1]);
        for (let k = 0; k < pts.length; k++) { p = m(k); c.quadraticCurveTo(hx + pts[k][0], hy + pts[k][1], hx + p[0], hy + p[1]); }
        c.closePath();
      };
      relief(hx - 0.17, hx + 0.21, () => smooth(PROF));
      c.beginPath();                                     // the hair: from the hairline over the crown and the back to the nape
      c.moveTo(hx + 0.118, hy + 0.152);
      c.quadraticCurveTo(hx + 0.02, hy + 0.235, hx - 0.115, hy + 0.18);
      c.quadraticCurveTo(hx - 0.205, hy + 0.04, hx - 0.105, hy - 0.16);
      c.quadraticCurveTo(hx - 0.045, hy - 0.06, hx - 0.01, hy + 0.0);
      c.quadraticCurveTo(hx + 0.05, hy + 0.1, hx + 0.118, hy + 0.152);
      c.closePath();
      c.fillStyle = P.f0; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW * 0.7; c.stroke();
      lines(() => { for (let i = 0; i < 4; i++) { const a = Math.PI * (0.5 + i * 0.2); c.moveTo(hx + Math.cos(a) * 0.07, hy + 0.04 + Math.sin(a) * 0.08); c.lineTo(hx + Math.cos(a) * 0.17, hy + 0.04 + Math.sin(a) * 0.17); } }, 0.008);
      lines(() => {                                      // the eye: two thin lids, the upper one curved
        c.moveTo(hx + 0.088, hy + 0.03); c.quadraticCurveTo(hx + 0.115, hy + 0.05, hx + 0.142, hy + 0.028);
        c.moveTo(hx + 0.092, hy + 0.027); c.quadraticCurveTo(hx + 0.118, hy + 0.012, hx + 0.14, hy + 0.024);
      }, 0.009);
      lines(() => { c.moveTo(hx + 0.128, hy + 0.068); c.quadraticCurveTo(hx + 0.142, hy + 0.078, hx + 0.158, hy + 0.066); }, 0.007);   // the brow
      lines(() => { c.moveTo(hx + 0.135, hy - 0.104); c.lineTo(hx + 0.158, hy - 0.104); }, 0.008);   // the closed mouth
    };
    if (want("pair")) {
      const { cx, fx, vb } = L.pair;
      for (const s of [-1, 1]) { c.save(); c.translate(cx, 0); c.scale(s, 1); figure(-fx, vb); c.restore(); }
      lines(() => { c.moveTo(cx, vb + 3.6 - L.wing.band / 2); c.lineTo(cx, vb + 3.6 + L.wing.band / 2); }, 0.022, P.cut);   // where the two wings touch
    }
    // ---- the palm ("תמרת"): a tall trunk with scales, nine fronds, two bunches of dates ----
    const leaf = (x0, y0, cu, cv, tu, tv, w) => {
      const du = tu - x0, dv = tv - y0, n = Math.hypot(du, dv) || 1, nu = -dv / n * w, nv = du / n * w;
      c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(cu + nu, cv + nv, tu, tv); c.quadraticCurveTo(cu - nu, cv - nv, x0, y0); c.closePath();
      c.fillStyle = P.f1; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW * 0.7; c.stroke();
      lines(() => {                                    // the midrib and the leaflets on both sides of it, slanting back to the crown
        c.moveTo(x0, y0); c.quadraticCurveTo(cu, cv, tu, tv);
        for (let t = 0.18; t < 0.95; t += 0.07) {
          const s = 1 - t, bu = s * s * x0 + 2 * s * t * cu + t * t * tu, bv = s * s * y0 + 2 * s * t * cv + t * t * tv, f = 0.9 * (1 - t * 0.55);
          let gu = 2 * s * (cu - x0) + 2 * t * (tu - cu), gv = 2 * s * (cv - y0) + 2 * t * (tv - cv);
          const gn = Math.hypot(gu, gv) || 1;
          gu = gu / gn * w * 0.9; gv = gv / gn * w * 0.9;
          c.moveTo(bu + nu * f - gu, bv + nv * f - gv); c.lineTo(bu, bv); c.lineTo(bu - nu * f - gu, bv - nv * f - gv);
        }
      }, 0.011);
    };
    const palm = () => {
      const { u: pu, vb, trunk, frond } = L.palm, top = vb + trunk;
      relief(pu - 0.17, pu + 0.17, () => {
        c.moveTo(pu - 0.17, vb); c.quadraticCurveTo(pu - 0.11, vb + 2.5, pu - 0.1, top); c.lineTo(pu + 0.1, top); c.quadraticCurveTo(pu + 0.11, vb + 2.5, pu + 0.17, vb); c.closePath();
      });
      lines(() => { for (let v = vb + 0.14; v < top - 0.06; v += 0.16) { const w = 0.15 - 0.055 * (v - vb) / trunk; c.moveTo(pu - w, v + 0.075); c.lineTo(pu, v); c.lineTo(pu + w, v + 0.075); } }, 0.014);
      for (let i = 0; i < 11; i++) {                   // eleven broad fronds arching out from the crown and drooping at their tips
        const a = Math.PI * (-0.1 + 1.2 * i / 10), len = frond - 0.3 * Math.abs(i - 5) / 5, ca = Math.cos(a), sa = Math.sin(a);
        leaf(pu, top, pu + ca * len * 0.5, top + sa * len * 0.5 + 0.3, pu + ca * len, top + sa * len * 0.62 - 0.38 * Math.abs(ca), 0.12);
      }
      c.beginPath();                                   // the dates
      for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { const du = s * (0.16 + (i % 2) * 0.06), dv = -0.12 - Math.floor(i / 2) * 0.07; c.moveTo(pu + du + 0.035, top + dv); c.arc(pu + du, top + dv, 0.035, 0, Math.PI * 2); }
      c.fillStyle = P.f2; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW * 0.5; c.stroke();
    };
    if (want("palm")) wrapped(L.palm.u - L.palm.frond - 0.1, L.palm.u + L.palm.frond + 0.1, palm);
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
  var int_carvedCache = null;
  function int_carvedTex() {
    if (int_carvedCache) return int_carvedCache;
    const mk = (w, h) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; return cv; };
    const W = 512, Hh = 1024, k = W / INT_CARVE_U;    // 102.4 px per amah
    const mc = mk(W, Hh), bc = mk(W / 2, Hh / 2);
    int_carveDraw(mc.getContext("2d"), W, Hh, k, INT_CARVE_PAL.gold);
    int_carveDraw(bc.getContext("2d"), W / 2, Hh / 2, k / 2, INT_CARVE_PAL.bump);
    const map = new CanvasTexture(mc);
    map.wrapS = map.wrapT = RepeatWrapping;
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 8;
    const bumpMap = new CanvasTexture(bc);
    bumpMap.wrapS = bumpMap.wrapT = RepeatWrapping;
    bumpMap.anisotropy = 4;
    int_carvedCache = { map, bumpMap };
    return int_carvedCache;
  }
  // the carved cedar's colour map (the same cell in wood colours): drawn only when the wall-layers exhibit is first shown (load time)
  function int_carvedCedarMap() {
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 1024;
    const c = cv.getContext("2d"), k = 512 / INT_CARVE_U;
    int_carveDraw(c, 512, 1024, k, INT_CARVE_PAL.cedar);
    // 1.0.1-L (L.31, the user: "העץ בשכבות ההיכל לא מספיק מחודד"): the cedar's own boards - upright, from the floor to the ceiling (6:15
    // "ויבן את קירות הבית מביתה בצלעות ארזים מקרקע הבית עד קירות הספן"), 1 amah wide (model choice): a dark joint and a light bevel beside it
    // every amah of the cell (the joints on the cell's edges meet across the seam), so the layer reads as wooden boards, the carving cut in them
    for (let b = 0; b <= INT_CARVE_U; b++) {
      const x = Math.round(b * k);
      c.fillStyle = "rgba(22,9,3,0.92)"; c.fillRect(x - 2, 0, 4, 1024);
      c.fillStyle = "rgba(232,176,126,0.5)"; c.fillRect(x + 2, 0, 2, 1024);
    }
    const t = new CanvasTexture(cv);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }
  // a carved-gold material whose cell spans tileU x tileV amot of the uvs (int_boxUV gives uvs in amot): the walls 5 x 10, the heichal
  // doors 5 x 9.9 (two registers on a 19.8 leaf), the devir doors 3 x 5.9 (two on 11.8; review H2-CARVE-3). Gold via goldStd (FIXES K 0.4).
  function int_carvedMat(tileU, tileV, extra) {
    const t = int_carvedTex();
    const map = t.map.clone(), bump = t.bumpMap.clone();
    map.needsUpdate = true;
    bump.needsUpdate = true;
    map.repeat.set(1 / tileU, 1 / tileV);
    bump.repeat.set(1 / tileU, 1 / tileV);
    return goldStd({ map, bumpMap: bump }, Object.assign({ bumpScale: 1.1 }, extra || {}));
  }
  // uvs from positions: fn(nx, ny, nz, x, y, z) -> [u, v] in amot for every vertex, (x, y, z) = the vertex + (ox, oy, oz) (the mesh's offset
  // in the frame fn works in) - so the carving runs on across the pieces of a wall and the boards of a door, and no face is mirrored
  function int_boxUV(geo, ox, oy, oz, fn) {
    const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      const r = fn(n.getX(i), n.getY(i), n.getZ(i), p.getX(i) + ox, p.getY(i) + oy, p.getZ(i) + oz);
      uv.setXY(i, r[0], r[1]);
    }
    uv.needsUpdate = true;
    return geo;
  }
  // a box between two corners, its uvs by fn (world positions) - pushed to `list` for merging
  function int_uvBox(list, x0, x1, y0, y1, z0, z1, fn) {
    const geo = new BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
    geo.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    int_boxUV(geo, 0, 0, 0, fn);
    list.push(geo);
    return geo;
  }
  // the house floor (6:15 "ויצף את קרקע הבית בצלעות ברושים", 6:30 "ואת קרקע הבית צפה זהב לפנימה ולחיצון"): gold over cypress boards, the
  // joints showing faintly through it (FIXES K.5.4). 512 px = 8 amot; boards 1 amah wide, running east-west (as the book draws the floor,
  // p08R), each 8 long, the ends staggered (width, length: model choice). The board's tone varies a little; the joints are cut in the bump.
  // `wood` = the bare cypress (the wall-layers exhibit): 256 px = 4 amot.
  function int_floorTex(wood) {
    const key = wood ? "cypress" : "floorGold";
    if (int_texCache[key]) return int_texCache[key];
    const S = wood ? 256 : 512, A = wood ? 64 : 64, n = S / A;
    const draw = (c, s, bump) => {
      const q = s / S;
      c.fillStyle = bump ? "#a8a8a8" : wood ? "#a86a3c" : "#ebc65a";
      c.fillRect(0, 0, s, s);
      for (let i = 0; i < n; i++) {
        const t = hash(i * 7.31 + (wood ? 3 : 0)) - 0.5;
        if (!bump) { c.fillStyle = t > 0 ? `rgba(255,248,214,${(t * 0.22).toFixed(3)})` : `rgba(120,80,20,${(-t * 0.16).toFixed(3)})`; c.fillRect(0, i * A * q, s, A * q); }
        if (wood && !bump) for (let g = 0; g < 7; g++) {             // the grain along the board
          c.strokeStyle = `rgba(92,48,20,${(0.12 + hash(i * 13 + g) * 0.16).toFixed(3)})`;
          c.lineWidth = 0.8 + hash(i + g * 3) * 1.4;
          const y0 = (i * A + 6 + hash(i * 5 + g * 11) * (A - 12)) * q;
          c.beginPath();
          for (let x = 0; x <= s; x += 16 * q) { const y = y0 + Math.sin(x / q * 0.03 + g + i) * 1.6 * q; if (x) c.lineTo(x, y); else c.moveTo(x, y); }
          c.stroke();
        }
        c.fillStyle = bump ? "#5a5a5a" : wood ? "rgba(58,30,12,0.8)" : "rgba(128,90,22,0.42)";
        c.fillRect(0, i * A * q, s, Math.max(1, 1.6 * q));           // the long joint
        const e = ((i * 3) % n) * A * q;                             // the end joint, staggered from board to board
        c.fillRect(e, i * A * q, Math.max(1, 1.6 * q), A * q);
      }
    };
    const mkc = (s, bump) => { const cv = document.createElement("canvas"); cv.width = cv.height = s; draw(cv.getContext("2d"), s, bump); const t = new CanvasTexture(cv); t.wrapS = t.wrapT = RepeatWrapping; if (!bump) t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t; };
    const map = mkc(S, false), bumpMap = mkc(S / 2, true);
    const r = 1 / (S / A);
    map.repeat.set(r, r);
    bumpMap.repeat.set(r, r);
    int_texCache[key] = { map, bumpMap };
    return int_texCache[key];
  }

  // ===== 1.0.1-K (K.4): textures and shapes of the tables, the incense altar, the parochet and the cherubim =====
  // Every canvas here is small (<= 1024) and every repeated motif is drawn ONCE into its own canvas and stamped with drawImage (FIXES K 0.6).
  var INT_TEF = 1 / 6;                    // a tefach = 1/6 amah: R. Meir (Mishnah Menachot 11:5) "השלחן ארכו שנים עשר ורחבו ששה" = 2 x 1 amot (Ex 25:23)
  var INT_PAR_TILE = 4;                   // the parochet's woven pattern repeats every 4 x 4 amot (model choice): three rows of three figures ~1.2 amot wide, as large as the book draws them
  var int_texCache = {};
  // a canvas texture of any proportions (makeTex in 10-core.js is square): repeat-wrapped, sRGB colour; the grey bump canvas is optional
  function int_canvasTex(w, h, draw, bumpDraw) {
    const mk = (fn, srgb) => {
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      fn(cv.getContext("2d"), w, h);
      const t = new CanvasTexture(cv);
      t.wrapS = t.wrapT = RepeatWrapping;
      if (srgb) t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    };
    return { map: mk(draw, true), bumpMap: bumpDraw ? mk(bumpDraw, false) : null };
  }
  const int_rep = (t, ru, rv) => { t.map.repeat.set(ru, rv); if (t.bumpMap) t.bumpMap.repeat.set(ru, rv); return t; };
  // the gold crown of the table, "זר זהב... למסגרתו סביב" (Ex 25:24-25): a moulding with rosettes and beads (the motif is a model choice; the
  // book draws an ornate band). 256 x 64 px = four motifs along 0.28 amah of a band 0.07 high.
  function int_crownTex() {
    if (int_texCache.crown) return int_texCache.crown;
    const draw = (c, w, h, bump) => {
      if (bump) { c.fillStyle = "#7a7a7a"; c.fillRect(0, 0, w, h); }
      else {
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#fff3c2"); g.addColorStop(0.45, "#f3d374"); g.addColorStop(1, "#d6a944");
        c.fillStyle = g; c.fillRect(0, 0, w, h);
      }
      const ink = bump ? "#2e2e2e" : "rgba(122,82,18,0.9)", hi = bump ? "#e6e6e6" : "rgba(255,249,222,0.95)";
      c.lineWidth = 1.5;
      for (let k = 0; k < 4; k++) {
        const cx = k * 64 + 32, cy = h / 2;
        for (let p = 0; p < 6; p++) {
          const a = p * Math.PI / 3;
          c.beginPath(); c.ellipse(cx + Math.cos(a) * 9, cy + Math.sin(a) * 9, 8, 4.5, a, 0, Math.PI * 2);
          c.fillStyle = hi; c.fill(); c.strokeStyle = ink; c.stroke();
        }
        c.beginPath(); c.arc(cx, cy, 4.5, 0, Math.PI * 2); c.fillStyle = ink; c.fill();
        for (const s of [-1, 1]) {
          c.beginPath(); c.ellipse(cx + s * 23, cy, 8, 3.6, s * 0.5, 0, Math.PI * 2);
          c.fillStyle = hi; c.fill(); c.strokeStyle = ink; c.stroke();
        }
      }
      c.lineWidth = 1;
      for (let x = 4; x < w; x += 8) for (const y of [5, h - 5]) {
        c.beginPath(); c.arc(x, y, 2.6, 0, Math.PI * 2); c.fillStyle = hi; c.fill(); c.strokeStyle = ink; c.stroke();
      }
    };
    int_texCache.crown = int_rep(int_canvasTex(256, 64, (c, w, h) => draw(c, w, h, false), (c, w, h) => draw(c, w, h, true)), 1 / 0.28, 1 / 0.07);
    return int_texCache.crown;
  }
  // a seamless speckle (spots drawn again across the edges): the baked crust of the shewbread, and the stone core of the incense altar
  function int_speckleTex(key, base, spots, n, rMax) {
    if (int_texCache[key]) return int_texCache[key];
    int_texCache[key] = int_rep(int_canvasTex(128, 128, (c, w, h) => {
      c.fillStyle = base; c.fillRect(0, 0, w, h);
      for (let i = 0; i < n; i++) {
        const x = hash(i * 1.93 + key.length) * w, y = hash(i * 3.71 + key.length) * h, r = 1 + hash(i * 5.37) * rMax;
        c.fillStyle = spots[i % spots.length];
        for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) {
          if (x + ox + r < 0 || x + ox - r > w || y + oy + r < 0 || y + oy - r > h) continue;
          c.beginPath(); c.arc(x + ox, y + oy, r, 0, Math.PI * 2); c.fill();
        }
      }
    }), 2, 2);
    return int_texCache[key];
  }
  // 1.0.1-L (L.14): the hewn stone of the house's wall and floor as the wall-layers exhibit shows it (6:7 "והבית בהבנתו אבן שלמה מסע נבנה"):
  // a grey ashlar - courses 1 amah high, blocks 2 long, staggered (model choice) - in a colour of its own, clearly apart from the red-brown
  // cedar and the gold (the house's own stone, 50-heichal.js, is so light that in the closed house it read near the pale cedar). 256 x 128
  // px = 4 x 2 amot, the blocks' tones repeat with the tile (no seam).
  function int_stoneTex() {
    if (int_texCache.ashlar) return int_texCache.ashlar;
    int_texCache.ashlar = int_rep(int_canvasTex(256, 128, (c, w, h) => {
      const A = 64;
      for (let row = 0; row < 2; row++) for (let k = -1; k < 3; k++) {
        const t = hash(row * 7.3 + (((k % 2) + 2) % 2) * 3.1) - 0.5, v = Math.round(168 + 26 * t);
        c.fillStyle = "rgb(" + v + "," + (v - 4) + "," + (v - 12) + ")";
        c.fillRect(k * 2 * A + (row % 2) * A, row * A, 2 * A, A);
      }
      for (let i = 0; i < 700; i++) {                                     // the tooling and the grain of the stone
        const x = hash(i * 2.17) * w, y = hash(i * 4.33) * h, r = 0.6 + hash(i * 6.1) * 1.6;
        c.fillStyle = hash(i * 8.9) > 0.5 ? "rgba(80,76,70,0.28)" : "rgba(236,232,222,0.3)";
        c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
      }
      c.fillStyle = "#57534c";                                               // the joints (2 px across the tile's edges too)
      for (const y of [-1, A - 1, h - 1]) c.fillRect(0, y, w, 2);
      for (let row = 0; row < 2; row++) for (let k = 0; k <= 2; k++) c.fillRect((2 * k + (row % 2)) * A - 1, row * A, 2, A);
    }), 1 / 4, 1 / 2);
    return int_texCache.ashlar;
  }
  // the cedar boards of the incense altar (6:20 "ויצף מזבח ארז"; Targum "נסרין דארזא"): upright planks of a light, warm wood as the book draws
  // them (p07R); 256 px = 0.6 amah, four planks (model choice)
  function int_plankTex() {
    if (int_texCache.planks) return int_texCache.planks;
    int_texCache.planks = int_rep(int_canvasTex(256, 256, (c, w, h) => {
      for (let k = 0; k < 4; k++) {
        const t = hash(k * 7.7) * 0.12;
        c.fillStyle = "rgb(" + Math.round(214 - 30 * t * 4) + "," + Math.round(152 - 24 * t * 4) + "," + Math.round(86 - 14 * t * 4) + ")";
        c.fillRect(k * 64, 0, 64, h);
        for (let i = 0; i < 14; i++) {                                 // the grain, upright and slightly wavy
          const x0 = k * 64 + 3 + hash(k * 31 + i * 3.3) * 58;
          c.strokeStyle = "rgba(" + (120 + hash(i) * 40 | 0) + "," + (70 + hash(i * 2) * 30 | 0) + ",30," + (0.18 + hash(i * 5 + k) * 0.25).toFixed(2) + ")";
          c.lineWidth = 0.8 + hash(i * 7 + k) * 1.8;
          c.beginPath();
          for (let y = 0; y <= h; y += 16) { const x = x0 + Math.sin(y * 0.045 + i + k) * 2.2; if (y) c.lineTo(x, y); else c.moveTo(x, y); }
          c.stroke();
        }
        c.fillStyle = "rgba(70,38,14,0.75)"; c.fillRect(k * 64, 0, 2, h);   // the joint between planks
      }
    }), 1 / 0.6, 1 / 0.6);
    return int_texCache.planks;
  }
  // 1.0.1-L (verifier of L.73): the almond work of the menorah's cups, knobs and flowers, "משקדים" (Ex 25:33-34; Rashi 25:33 "מצירים היו"; Rambam on
  // Mishnah Menachot 3:7 "מעשה שקדים... עד שיהיה כולו שקדים שקדים"), as the book's hammered ornaments (p22): one almond on the vessels' gold per
  // tile, 14 around and 10 along an ornament's lathe or sphere (the plain parts all sit at uv 0.01, on the tile's ground). Model choice.
  function int_almondTex() {
    if (int_texCache.almond) return int_texCache.almond;
    const draw = (c, w, h, bump) => {
      c.fillStyle = bump ? "#9a9a9a" : "#f0cf6a";
      c.fillRect(0, 0, w, h);
      c.fillStyle = bump ? "#343434" : "rgba(150,100,24,0.5)";
      c.beginPath(); c.ellipse(w / 2, h / 2, w * 0.2, h * 0.34, 0, 0, Math.PI * 2); c.fill();
    };
    int_texCache.almond = int_rep(int_canvasTex(32, 32, (c, w, h) => draw(c, w, h, false), (c, w, h) => draw(c, w, h, true)), 14, 10);
    return int_texCache.almond;
  }
  // the crown of the incense altar, "ועשית לו זר זהב סביב" (Ex 30:3): an open rail of interlaced rings on the rim of its top (the book; the form
  // is a model choice). 256 x 64 px with transparency (alphaTest) = 0.36 amah of a rail 0.09 high.
  function int_fretTex() {
    if (int_texCache.fret) return int_texCache.fret;
    int_texCache.fret = int_rep(int_canvasTex(256, 64, (c, w, h) => {
      c.clearRect(0, 0, w, h);
      c.lineWidth = 7; c.strokeStyle = "#ecc65c";
      for (let k = -1; k <= 8; k++) { c.beginPath(); c.ellipse(k * 32 + 16, 32, 21, 19, 0, 0, Math.PI * 2); c.stroke(); }
      c.lineWidth = 2.4; c.strokeStyle = "#fff4c8";
      for (let k = -1; k <= 8; k++) { c.beginPath(); c.ellipse(k * 32 + 16, 31, 20, 17, 0, Math.PI * 1.12, Math.PI * 1.88); c.stroke(); }
      c.fillStyle = "#ecc65c"; c.fillRect(0, 0, w, 7); c.fillRect(0, h - 7, w, 7);
      c.fillStyle = "#fff4c8"; c.fillRect(0, 1, w, 2);
    }), 1 / 0.36, 1 / 0.09);
    return int_texCache.fret;
  }
  // הפרוכת (II Chr 3:14 "תכלת וארגמן וכרמיל ובוץ ויעל עליו כרובים"): a woven curtain with two DIFFERENT faces - Rashi Ex 26:1 "כרבים מעשה חשב...
  // באריגה בשני כתלים, פרצוף אחד מכאן ופרצוף אחד מכאן – ארי מצד זה ונשר מצד זה"; Rashi Ex 26:31 "והציורין שמשני עבריה אינן דומין זה לזה"; Yoma
  // 72b "חושב — מעשה אורג, לפיכך שני פרצופות" (DEV note: Metzudat David on II Chr 3:14 says "במעשה רוקם", embroidery, which by Yoma 72b would
  // give one face). Which face is which is a model choice (the user): EAGLES on the face toward the heichal, LIONS on the face toward the
  // devir. The colours and the purple figures in rows on a marbled pink-red weave follow the book (p09, the user's reference).
  // Returns { east, west, plain } textures; each face is a 512 px tile of 4 x 4 amot (INT_PAR_TILE).
  function int_parochetTex() {
    if (int_texCache.parochet) return int_texCache.parochet;
    const S = 512, A = S / INT_PAR_TILE;     // 128 px per amah: as fine as the closest view of the curtain needs (perf, FIXES K 0.6)
    const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
    // (1) the marbled weave, drawn once: blue, purple, crimson and linen streaks on a pink-red ground, then the warp and the weft
    const bg = mk(S, S), b = bg.getContext("2d");
    b.fillStyle = "#d66a7c"; b.fillRect(0, 0, S, S);
    const tints = ["178,30,60", "243,166,178", "122,62,142", "62,80,162", "248,240,230"];
    for (let i = 0; i < 200; i++) {
      const x = hash(i * 1.37) * S, y = hash(i * 2.71) * S, rx = 11 + hash(i * 3.13) * 50, ry = 2.5 + hash(i * 4.91) * 7.5, rot = (hash(i * 5.33) - 0.5) * 0.7;
      b.fillStyle = "rgba(" + tints[i % 5] + "," + (0.1 + hash(i * 6.17) * 0.2).toFixed(3) + ")";
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
        const cx = x + ox, cy = y + oy;
        if (cx + rx < 0 || cx - rx > S || cy + rx < 0 || cy - rx > S) continue;
        b.beginPath(); b.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); b.fill();
      }
    }
    b.fillStyle = "rgba(84,16,38,0.08)";
    for (let y = 0; y < S; y += 3) b.fillRect(0, y, S, 1);
    b.fillStyle = "rgba(255,236,240,0.06)";
    for (let x = 0; x < S; x += 3) b.fillRect(x, 0, 1, S);
    const FIG = "#5c2c80", FIG_D = "#3c1858", FIG_L = "#9a6cbc";
    // (2) an eagle with spread wings (frontal, the head in profile, the hooked beak, the fingered primaries, the talons), drawn once on a
    // 320 x 300 canvas
    const eagle = mk(320, 300), e = eagle.getContext("2d");
    e.lineJoin = "round"; e.lineCap = "round"; e.fillStyle = FIG; e.strokeStyle = FIG_D; e.lineWidth = 4;
    for (const s of [-1, 1]) {
      const X = (x) => 160 + s * (x - 160);
      e.beginPath();
      e.moveTo(X(146), 118);                                            // the shoulder
      e.quadraticCurveTo(X(118), 52, X(64), 30);                         // the leading edge up to the wrist
      e.quadraticCurveTo(X(30), 18, X(8), 10);                           // and out to the tip
      for (const [px, py] of [[22, 36], [6, 44], [30, 62], [12, 74], [40, 88], [24, 104], [56, 112], [44, 130], [76, 134], [70, 152], [104, 150], [104, 166], [142, 160]]) e.lineTo(X(px), py);
      e.closePath(); e.fill(); e.stroke();
      e.save(); e.strokeStyle = FIG_L; e.lineWidth = 2.2;                 // the coverts' line and the quills
      e.beginPath(); e.moveTo(X(140), 112); e.quadraticCurveTo(X(110), 70, X(60), 46); e.stroke();
      for (const [x1, y1] of [[24, 40], [30, 66], [42, 92], [58, 116], [78, 138], [104, 154]]) { e.beginPath(); e.moveTo(X(118), 96 + (y1 - 40) * 0.35); e.lineTo(X(x1 + 8), y1 + 2); e.stroke(); }
      e.restore();
    }
    e.beginPath(); e.moveTo(142, 186); e.lineTo(178, 186);                // the tail fan
    for (const [px, py] of [[204, 262], [188, 252], [176, 274], [166, 256], [160, 280], [154, 256], [144, 274], [132, 252], [116, 262]]) e.lineTo(px, py);
    e.closePath(); e.fill(); e.stroke();
    e.beginPath(); e.ellipse(160, 146, 26, 54, 0, 0, Math.PI * 2); e.fill(); e.stroke();   // the body
    for (const s of [-1, 1]) {                                           // the legs and the talons
      e.beginPath(); e.moveTo(160 + s * 12, 190); e.lineTo(160 + s * 22, 222); e.lineWidth = 8; e.strokeStyle = FIG; e.stroke();
      e.lineWidth = 3.5; e.strokeStyle = FIG_D;
      for (const d of [-9, 0, 9]) { e.beginPath(); e.moveTo(160 + s * 22, 222); e.quadraticCurveTo(160 + s * 22 + d, 228, 160 + s * 22 + d * 1.2, 236); e.stroke(); }
    }
    e.lineWidth = 4;
    e.beginPath(); e.ellipse(162, 80, 20, 22, 0, 0, Math.PI * 2); e.fill(); e.stroke();   // the head, turned right
    e.beginPath(); e.moveTo(176, 70); e.quadraticCurveTo(206, 68, 204, 94); e.quadraticCurveTo(196, 84, 180, 90); e.closePath(); e.fill(); e.stroke();   // the hooked beak
    e.fillStyle = FIG_L; e.beginPath(); e.arc(170, 74, 3.8, 0, Math.PI * 2); e.fill();
    e.strokeStyle = FIG_L; e.lineWidth = 2; e.beginPath(); e.moveTo(146, 108); e.quadraticCurveTo(160, 118, 174, 108); e.stroke();   // the ruff
    // (3) a walking lion (side view, facing right): a heavy chest, a great mane, the tail with its tuft; drawn once on a 340 x 240 canvas
    const lion = mk(340, 240), l = lion.getContext("2d");
    l.lineJoin = "round"; l.lineCap = "round"; l.fillStyle = FIG; l.strokeStyle = FIG_D; l.lineWidth = 4;
    const leg = (x0, y0, x1, w0, w1) => {                               // a tapered leg from the body (x0, y0) to the paw at (x1, 206)
      l.beginPath(); l.moveTo(x0 - w0 / 2, y0); l.lineTo(x0 + w0 / 2, y0); l.lineTo(x1 + w1 / 2, 204); l.lineTo(x1 - w1 / 2, 204); l.closePath(); l.fill(); l.stroke();
      l.beginPath(); l.ellipse(x1 + 6, 206, w1 * 0.85, 8, 0, 0, Math.PI * 2); l.fill(); l.stroke();
    };
    leg(92, 118, 72, 30, 18); leg(226, 118, 250, 28, 18);                // the far legs (striding)
    l.beginPath(); l.moveTo(66, 100); l.bezierCurveTo(30, 108, 34, 160, 14, 150); l.lineWidth = 9; l.strokeStyle = FIG; l.stroke();   // the tail
    l.lineWidth = 4; l.strokeStyle = FIG_D;
    l.beginPath(); l.ellipse(14, 146, 11, 15, 0.3, 0, Math.PI * 2); l.fill(); l.stroke();
    l.beginPath();                                                       // the body: the rump, the back, the high shoulders, the chest, the belly
    l.moveTo(64, 96); l.quadraticCurveTo(70, 72, 110, 76); l.quadraticCurveTo(160, 82, 206, 70); l.quadraticCurveTo(246, 74, 248, 120);
    l.quadraticCurveTo(240, 148, 206, 142); l.quadraticCurveTo(150, 136, 104, 144); l.quadraticCurveTo(62, 146, 64, 96); l.closePath(); l.fill(); l.stroke();
    leg(114, 126, 102, 32, 20); leg(210, 126, 222, 32, 20);              // the near legs
    l.beginPath();                                                       // the mane
    for (let k = 0; k <= 30; k++) {
      const a = k / 30 * Math.PI * 2, r = k % 2 ? 58 : 44, px = 250 + Math.cos(a) * r, py = 88 + Math.sin(a) * r * 0.92;
      if (k) l.lineTo(px, py); else l.moveTo(px, py);
    }
    l.closePath(); l.fill(); l.stroke();
    l.beginPath(); l.ellipse(276, 94, 30, 27, 0, 0, Math.PI * 2); l.fill(); l.stroke();    // the head
    l.beginPath(); l.ellipse(306, 106, 20, 15, 0.12, 0, Math.PI * 2); l.fill(); l.stroke(); // the muzzle
    l.beginPath(); l.moveTo(258, 70); l.lineTo(264, 52); l.lineTo(274, 68); l.closePath(); l.fill(); l.stroke();   // the ear
    l.fillStyle = FIG_L; l.beginPath(); l.ellipse(290, 86, 4.5, 3.5, 0, 0, Math.PI * 2); l.fill();   // the eye
    l.strokeStyle = FIG_L; l.lineWidth = 2.2;
    l.beginPath(); l.moveTo(300, 118); l.quadraticCurveTo(310, 124, 322, 114); l.stroke();           // the mouth
    for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; l.beginPath(); l.moveTo(250 + Math.cos(a) * 34, 88 + Math.sin(a) * 32); l.lineTo(250 + Math.cos(a) * 52, 88 + Math.sin(a) * 48); l.stroke(); }
    l.beginPath(); l.moveTo(120, 100); l.quadraticCurveTo(150, 112, 196, 100); l.stroke();          // the ribs' line
    // (4) the two faces: the weave + a regular grid of three rows of three figures per tile (1.33 amot apart, in rows and columns as the
    // book draws them), stamped with drawImage; each figure stays inside its cell, so the tile repeats without seams
    const face = (fig, fw) => {
      const c = mk(S, S), x = c.getContext("2d");
      x.drawImage(bg, 0, 0);
      const w = fw * A, h = w * fig.height / fig.width, step = S / 3;
      for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) x.drawImage(fig, (k + 0.5) * step - w / 2, (r + 0.5) * step - h / 2, w, h);
      return c;
    };
    const tex = (cv) => {
      const t = new CanvasTexture(cv);
      t.wrapS = t.wrapT = RepeatWrapping;
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 8;
      t.repeat.set(1 / INT_PAR_TILE, 1 / INT_PAR_TILE);
      return t;
    };
    // 1.0.1-L (L.55, the user: "האריות מימין לשמאל ולא שמאל לימין"): both figures are drawn above facing right and are stamped MIRRORED, so
    // that on the devir face the lions walk from right to left (seen from the devir: its u = z runs to the viewer's right) - as the book's
    // lions (p09) - and on the heichal face the eagles' heads turn to the left too (u = -z, again to the viewer's right; the eagle is frontal,
    // only its head and beak turn; K.4 turned them right). Model choice for the eagles, by the same rule and the book's birds (p09).
    // 1.0.1-L (A16, his decision): only the lions were asked to turn - the EAGLES back to their earlier direction (K.4's: not mirrored), the note above is history.
    const mirror = (cv) => { const m = mk(cv.width, cv.height), x = m.getContext("2d"); x.translate(cv.width, 0); x.scale(-1, 1); x.drawImage(cv, 0, 0); return m; };
    const small = mk(256, 256);
    small.getContext("2d").drawImage(bg, 0, 0, 256, 256);
    int_texCache.parochet = { east: tex(face(eagle, 1.15)), west: tex(face(mirror(lion), 1.2)), plain: tex(small) };
    return int_texCache.parochet;
  }
  // 1.0.1-L (L.84): one wing as ONE smooth closed solid, lofted through stations. st: [{ c: centre, a: half the chord (vector), n: half the
  // thickness (vector), cam: how far the chord's two edges droop below its middle }]; each ring a lens (rounded edges), the two ends capped
  // flat so that the last ring lies exactly on the plane it is to touch. Vector3s. Model choice: the verses give no shape, the user asks for one piece.
  function int_wingLoft(st, M = 22) {
    const pos = [], uv = [], idx = [], nu = new Vector3();
    let along = 0;
    const ring = (q, sv) => {
      nu.copy(q.n).normalize();
      const al = q.a.length();
      for (let k = 0; k < M; k++) {
        const ph = k / M * Math.PI * 2, ca = Math.cos(ph), sa = Math.sin(ph), dr = -q.cam * ca * ca;
        pos.push(q.c.x + q.a.x * ca + q.n.x * sa + nu.x * dr, q.c.y + q.a.y * ca + q.n.y * sa + nu.y * dr, q.c.z + q.a.z * ca + q.n.z * sa + nu.z * dr);
        uv.push(sv, al * ca);
      }
    };
    st.forEach((q, i) => { if (i) along += q.c.distanceTo(st[i - 1].c); ring(q, along); });
    const T = new Vector3().subVectors(st[1].c, st[0].c), flip = new Vector3().crossVectors(st[0].a, st[0].n).dot(T) < 0;
    const tri = (a, b, c) => { if (flip) idx.push(a, c, b); else idx.push(a, b, c); };
    for (let i = 0; i < st.length - 1; i++) for (let k = 0; k < M; k++) {
      const k2 = (k + 1) % M, a = i * M + k, b = i * M + k2, c = (i + 1) * M + k, d = (i + 1) * M + k2;
      tri(a, b, c); tri(c, b, d);
    }
    for (const [q, sign] of [[st[0], 1], [st[st.length - 1], -1]]) {           // the caps: their own vertices, so that the skin keeps its smooth normals
      const base = pos.length / 3;
      ring(q, 0);
      pos.push(q.c.x, q.c.y, q.c.z);
      uv.push(0, 0);
      for (let k = 0; k < M; k++) { if (sign > 0) tri(base + M, base + k, base + (k + 1) % M); else tri(base + M, base + (k + 1) % M, base + k); }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }
  // Catmull-Rom through evenly spaced values (the wing's outlines and spines)
  function int_crTab(tab, t) {
    const n = tab.length - 1, x = Math.min(t, 1) * n, i = Math.min(Math.floor(x), n - 1), f = x - i;
    const p0 = tab[Math.max(i - 1, 0)], p1 = tab[i], p2 = tab[i + 1], p3 = tab[Math.min(i + 2, n)];
    return 0.5 * (2 * p1 + (p2 - p0) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (3 * p1 - p0 - 3 * p2 + p3) * f * f * f);
  }
  // the cherub's long robe, from the floor to the neck (10 = the whole figure, I Kings 6:23): a lathe with an oval section (0.8 as deep as
  // wide) and soft vertical folds, widening to the hem on the floor (modest, nothing bare; the book p07L draws such a robe). Model choice.
  // 1.0.1-K (K.5, the addendum B: checked against the book p07L / p07_cherub_right): the book's figure is a tall smooth column narrowing
  // steadily from the flared hem up to the shoulders, with long vertical folds and no clothing details - so the waist and the shoulders are
  // slimmer than K.4's (0.6 / 0.71 instead of 0.71 / 0.91: K.4's rounded shoulder read as a bowling pin), the shoulders 0.25 higher (the
  // smaller head sits on a short neck, as in the book), and ten folds running higher up the robe
  function int_robeGeo() {
    const prof = [[0, 0], [1.18, 0], [1.2, 0.05], [1.12, 0.38], [0.98, 1.25], [0.85, 2.45], [0.73, 3.75], [0.64, 5.0], [0.6, 6.0], [0.61, 6.9],
      [0.66, 7.6], [0.71, 8.15], [0.71, 8.5], [0.6, 8.7], [0.4, 8.84], [0.24, 8.9], [0, 8.92]];
    const geo = new LatheGeometry(prof.map((q) => new Vector2(q[0], q[1])), 60);
    geo.rotateY(-Math.PI / 2);                      // the lathe's seam to the back (-x)
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), th = Math.atan2(z, x);
      const a = y < 7.8 ? 0.06 * (1 - y / 7.8) + 0.012 : 0.012;
      const f = 1 + a * Math.cos(10 * th);
      p.setXYZ(i, x * f * 0.8, y, z * f);
    }
    geo.computeVertexNormals();
    return geo;
  }
  // a tube along points pts (Vector3[]) whose radius tapers (radii[]; the last ~0 closes it) - the jug's handle and Aaron's staff (L.85)
  function int_taperTube(pts, radii, seg = 7) {
    const pos = [], nrm = [], uv = [], idx = [];
    const up = new Vector3(0, 1, 0), T = new Vector3(), N = new Vector3(), B = new Vector3(), v = new Vector3();
    for (let i = 0; i < pts.length; i++) {
      T.subVectors(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)]).normalize();
      N.crossVectors(T, Math.abs(T.y) > 0.9 ? new Vector3(1, 0, 0) : up).normalize();
      B.crossVectors(T, N).normalize();
      for (let k = 0; k <= seg; k++) {
        const a = k / seg * Math.PI * 2;
        v.copy(N).multiplyScalar(Math.cos(a)).addScaledVector(B, Math.sin(a));
        pos.push(pts[i].x + v.x * radii[i], pts[i].y + v.y * radii[i], pts[i].z + v.z * radii[i]);
        nrm.push(v.x, v.y, v.z);
        uv.push(k / seg, i / (pts.length - 1));
      }
    }
    for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < seg; k++) {
      const a = i * (seg + 1) + k, b2 = a + seg + 1;
      idx.push(a, a + 1, b2, b2, a + 1, b2 + 1);                       // counter-clockwise seen from outside (the faces look outward)
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    return geo;
  }

  // ===== 1.0.1-L (L.35, the user: "פרצופי הכרובים נוראים"): the cherubim's heads, remade =====
  // K.4/K.5 made the head a ball with two dark dots for eyes and a small ball for a nose. Now, as the book draws the faces (p07L,
  // p07_cherub_right: a calm, elongated child's face under a smooth cap of hair, a straight nose, quiet eyes, a small closed mouth) and as the
  // sources call them - Rashi on II Chr 3:10 "תבנית ילדים וילדות עשה לכרובים, כרביא"; Rashi Ex 25:18 "דמות פרצוף תינוק להם"; Chagigah 13b
  // "כרביא" - a gold head whose features are MODELLED: an egg-shaped skull narrowing to a rounded chin, a brow, shallow eye sockets, full
  // cheeks, a straight nose ridge with a rounded tip, the lips and the chin (int_cherubHeadGeo); almond eyes with their lids, the brows,
  // the line of the closed mouth and the nostrils cut into the gold by a bump map, drawn in a darker gold only (int_cherubFaceTex: no
  // black, no painted dots); the hair a separate cap with a clear hairline across the forehead and down beside the face, its strands
  // grooved (int_cherubHairGeo, int_cherubHairTex). All gold (6:28 "ויצף את הכרובים זהב"). The proportions and every feature: model choices.
  // A sphere-like grid whose columns crowd toward the face (phi = PI, +x): 1.75 deg apart there, 11.5 at the back of the head - fine enough for a
  // nose without a heavy mesh. u = phi / 2PI and v = 1 - theta / PI, as three's SphereGeometry (so the face texture's centre is u 0.5).
  // fn(x, y, z, out) maps the unit sphere's point to the head's local point (the face toward +x).
  function int_headSphere(nPhi, nTheta, fn) {
    const pos = [], uv = [], idx = [], q = new Vector3(), A = 0.35;
    for (let i = 0; i <= nTheta; i++) {
      const th = Math.PI * i / nTheta;
      for (let j = 0; j <= nPhi; j++) {
        const s = -1 + 2 * j / nPhi, ph = Math.PI + Math.PI * (A * s + (1 - A) * s * s * s);
        fn(-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th), q);
        pos.push(q.x, q.y, q.z);
        uv.push(ph / (2 * Math.PI), 1 - i / nTheta);
      }
    }
    for (let i = 0; i < nTheta; i++) for (let j = 0; j < nPhi; j++) {
      const a = i * (nPhi + 1) + j, b = a + nPhi + 1;
      if (i > 0) idx.push(a, b, a + 1);                          // as SphereGeometry: the faces look outward
      if (i < nTheta - 1) idx.push(a + 1, b, b + 1);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }
  // the head's shape: the unit sphere -> an egg 0.9 deep (x), 1.12 high (y), 0.84 wide (z), narrower toward the chin, with the face's relief
  // on its front (Gaussian swellings and hollows along +x; amounts in units of the unit sphere). Also used for the hair (scaled out).
  var INT_HEAD_SC = [0.45, 0.56, 0.42];
  function int_headShape(x, y, z, out, relief) {
    const t = 1 - 0.28 * Math.pow(Math.max(0, -y), 1.5);         // the egg: the jaw narrows to a small chin (a child's face)
    let X = x * t;
    const Z = z * t;
    if (relief && x > 0) {
      const G = (a, s) => Math.exp(-(a * a) / (s * s));
      const ramp = y > 0.22 ? 0 : y > -0.17 ? (0.22 - y) / 0.39 : y > -0.27 ? (y + 0.27) / 0.1 : 0;   // the nose: from the brow to its tip, then under it
      const f = Math.min(1, x / 0.6);                              // the relief on the front only, fading toward the sides
      let d = 0;
      d += 0.14 * ramp * G(z, 0.07 + 0.07 * ramp);                 // the nose ridge, widening to its small rounded tip
      d += 0.04 * G(y - 0.27, 0.08) * G(z, 0.5);                   // the brow
      d -= 0.055 * G(y - 0.13, 0.085) * (G(z - 0.34, 0.14) + G(z + 0.34, 0.14));   // the eye sockets
      d += 0.045 * G(y + 0.2, 0.17) * (G(z - 0.44, 0.18) + G(z + 0.44, 0.18));    // the full cheeks
      d += 0.04 * G(y + 0.43, 0.055) * G(z, 0.16);                 // the lips
      d -= 0.02 * G(y + 0.52, 0.04) * G(z, 0.14);                  // the hollow under the lower lip
      d += 0.045 * G(y + 0.72, 0.11) * G(z, 0.2);                  // the chin
      X += d * f;
    }
    out.set(X * INT_HEAD_SC[0], y * INT_HEAD_SC[1], Z * INT_HEAD_SC[2]);
    return out;
  }
  function int_cherubHeadGeo(nPhi, nTheta) {
    return int_headSphere(nPhi, nTheta, (x, y, z, o) => int_headShape(x, y, z, o, true));
  }
  // the hair: the head's shape 4% larger above the hairline, sunk into the skull below it (a short bevel between: the hair's edge). The
  // hairline (elevation by the angle from the face): across the forehead at 31 deg, down past the temples to below the ears, and to the nape.
  var INT_HAIR_OUT = 1.04;
  function int_hairline(az) {                                     // az: 0 at the face .. PI at the back (radians) -> the elevation (radians)
    const P = [[0, 31], [0.6, 25], [1.0, 6], [1.4, -14], [1.9, -30], [Math.PI, -36]];
    for (let k = 1; k < P.length; k++) if (az <= P[k][0]) {
      const t = (az - P[k - 1][0]) / (P[k][0] - P[k - 1][0]), e = P[k - 1][1] + (P[k][1] - P[k - 1][1]) * (t * t * (3 - 2 * t));
      return e * Math.PI / 180;
    }
    return P[P.length - 1][1] * Math.PI / 180;
  }
  function int_cherubHairGeo(nPhi, nTheta) {
    return int_headSphere(nPhi, nTheta, (x, y, z, o) => {
      const az = Math.acos(Math.max(-1, Math.min(1, x / Math.max(1e-9, Math.hypot(x, z))))), el = Math.asin(Math.max(-1, Math.min(1, y)));
      const h = int_hairline(az), b = 0.075;                       // the bevel: 0.075 rad on either side of the hairline
      const k = el >= h + b ? INT_HAIR_OUT : el <= h - b ? 0.96 : 0.96 + (INT_HAIR_OUT - 0.96) * (el - (h - b)) / (2 * b);
      int_headShape(x, y, z, o, false);
      return o.multiplyScalar(k);
    });
  }
  // the face's colour and bump maps, on the head's uvs (equirectangular: 2.84 px a degree; the face's centre at x 512, the equator at y 256):
  // almond eyes 15 deg wide with their upper and lower lids and a crease above, a quiet iris (a faint ring, no pupil dot), soft brows, the
  // nostrils, the philtrum, the closed lips (a slight bow, no smile). Gold only: the lines a deeper gold, the bump grey.
  function int_cherubFaceTex() {
    if (int_texCache.cherubFace) return int_texCache.cherubFace;
    const W = 1024, Hh = 512, K = W / 360;
    const X = (az) => W / 2 + az * K, Y = (el) => (90 - el) * K;   // degrees -> px (az + : toward u +)
    const draw = (c, bump) => {
      c.fillStyle = bump ? "#808080" : "#f0cf6a";
      c.fillRect(0, 0, W, Hh);
      c.lineCap = "round"; c.lineJoin = "round";
      const line = (pts, w, col) => { c.beginPath(); pts.forEach(([a, e], i) => (i ? c.lineTo(X(a), Y(e)) : c.moveTo(X(a), Y(e)))); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
      const deep = bump ? "#2c2c2c" : "rgba(150,98,24,0.75)", soft = bump ? "#5a5a5a" : "rgba(170,118,34,0.4)", hi = bump ? "#b4b4b4" : "rgba(255,240,190,0.5)";
      for (const s of [-1, 1]) {
        const ax = s * 21, ey = 8;                                     // the eye's centre
        const up = (t) => [ax + s * (t - 0.5) * 16, ey + 3 * Math.sin(Math.PI * t)];     // the upper lid
        const lo = (t) => [ax + s * (t - 0.5) * 16, ey - 1.9 * Math.sin(Math.PI * t)];                         // the lower lid
        const U = [], L2 = [];
        for (let i = 0; i <= 16; i++) { U.push(up(i / 16)); L2.push(lo(i / 16)); }
        // the eyeball: a little lower than the lids (bump), a faint iris ring
        c.beginPath(); U.concat(L2.slice().reverse()).forEach(([a, e], i) => (i ? c.lineTo(X(a), Y(e)) : c.moveTo(X(a), Y(e)))); c.closePath();
        c.fillStyle = bump ? "#6a6a6a" : "#e9c25c"; c.fill();
        c.beginPath(); c.arc(X(ax + s * 0.6), Y(ey + 0.3), 2.3 * K, 0, Math.PI * 2);
        c.strokeStyle = bump ? "#5c5c5c" : "rgba(160,108,30,0.45)"; c.lineWidth = 0.9 * K; c.stroke();
        line(U, 1.1 * K, deep);                                        // the upper lid's edge
        line(L2, 0.6 * K, soft);                                       // the lower lid
        line(U.map(([a, e]) => [a, e + 2.2]).slice(2, 15), 0.8 * K, soft);   // the crease above the lid
        line([[ax - s * 8, 15.5], [ax - s * 1, 17.6], [ax + s * 6, 17.2], [ax + s * 10, 15.2]], 1.5 * K, bump ? "#9c9c9c" : "rgba(176,124,40,0.35)");   // the brow (a soft ridge)
        line([[s * 3.2, -13.2], [s * 5.2, -15.4], [s * 3.4, -16.6]], 0.8 * K, soft);   // the nostril's wing
      }
      line([[0, -17.5], [0, -21.2]], 1.6 * K, bump ? "#727272" : "rgba(186,132,44,0.25)");   // the philtrum
      // the lips: the upper lip's bow, the closed line between the lips, the lower lip's light
      line([[-6.5, -23.4], [-2.4, -22.2], [0, -22.9], [2.4, -22.2], [6.5, -23.4]], 0.8 * K, soft);
      line([[-6.8, -24.3], [-3, -24.7], [0, -24.5], [3, -24.7], [6.8, -24.3]], 1.1 * K, deep);
      line([[-4, -26.4], [0, -26.9], [4, -26.4]], 1.6 * K, hi);
      line([[-7.2, -24.2], [-7.8, -24.6]], 0.8 * K, soft); line([[7.2, -24.2], [7.8, -24.6]], 0.8 * K, soft);   // the mouth's corners
    };
    int_texCache.cherubFace = int_canvasTex(W, Hh, (c) => draw(c, false), (c) => draw(c, true));
    return int_texCache.cherubFace;
  }
  // the hair's grooves: strands from the crown down (equirectangular, 512 x 256; the crown at the top edge), gently waving, with a parting-
  // less smooth fall as the book's cap of hair
  function int_cherubHairTex() {
    if (int_texCache.cherubHair) return int_texCache.cherubHair;
    const W = 512, Hh = 256;
    const draw = (c, bump) => {
      c.fillStyle = bump ? "#7a7a7a" : "#e8c35c";
      c.fillRect(0, 0, W, Hh);
      for (let k = 0; k < 96; k++) {
        const x0 = (k + 0.5) * W / 96, wv = 1.6 + hash(k * 3.7) * 1.8, ph = hash(k * 1.9) * 6.28;
        c.beginPath();
        for (let y = 0; y <= Hh; y += 8) { const x = x0 + wv * Math.sin(y / 34 + ph); if (y) c.lineTo(x, y); else c.moveTo(x, y); }
        c.strokeStyle = bump ? (k % 2 ? "#4a4a4a" : "#5c5c5c") : (k % 2 ? "rgba(150,100,26,0.45)" : "rgba(170,118,36,0.3)");
        c.lineWidth = 1.6;
        c.stroke();
      }
    };
    int_texCache.cherubHair = int_canvasTex(W, Hh, (c) => draw(c, false), (c) => draw(c, true));
    return int_texCache.cherubHair;
  }

  // ===== 1.0.1-K (K.5): the incense smoke over the golden altar (the user: "תציג במזבח הזהב גם דימוי של עשן דק ועולה בקו ישר מאוד (כענן
  // הקטורת)") =====
  // Yoma 38a "של הללו — מתמר ועולה כמקל" (Rashi: "מעלה את העשן זוקף ומתמר כמקל"); Yoma 53a "היה מתמר ועולה כמקל עד שמגיע לשמי קורה"; Song of
  // Songs 3:6 "כתימרות עשן מקטרת מר ולבונה" (Rashi: "גבה וזקוף כתמר... על שם ענן הקטרת שהיה מתמר מעל מזבח הפנימי"); the coals on the altar:
  // Mishnah Tamid 6:2 "מי שזכה במחתה, צבר את הגחלים על גבי המזבח ורדדן בשולי המחתה". MODEL CHOICES: shown all the time (the incense was
  // offered every morning and evening, Ex 30:7-8 "בבקר בבקר... ובהעלת אהרן את הנרת בין הערבים יקטירנה"); a column 0.26 wide over the
  // coals and 0.72 under the ceiling (1.0.1-L, L.53: thicker and denser - more and stronger wisps; K.5 0.12 / 0.42), in a fainter halo,
  // rising perfectly straight from the coals to the ceiling (y 42) and fading out
  // just under it; two planes per altar that turn toward the camera about the vertical; the wisps flow upward by a texture offset (no
  // allocation per frame); seven glowing coals.
  function int_smokeParts() {
    if (int_texCache.smoke) return int_texCache.smoke;
    const mk = (w, h) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; return cv; };
    // the wisps: soft vertical streaks, periodic over the canvas height (whole sine periods), so the texture repeats up the column
    const wc = mk(64, 256), w = wc.getContext("2d");
    w.clearRect(0, 0, 64, 256);
    w.lineCap = "round";
    for (let i = 0; i < 22; i++) {                    // 1.0.1-L (L.53): 22 wisps, stronger (K.5: 14, alpha 0.14..0.46), so the column reads on gold too
      const x0 = 14 + hash(i * 1.7) * 36, A = 1.5 + hash(i * 2.9) * 4, n = 1 + Math.floor(hash(i * 4.1) * 3), ph = hash(i * 5.3) * 6.28;
      w.strokeStyle = "rgba(255,255,255," + (0.22 + hash(i * 7.7) * 0.4).toFixed(3) + ")";
      w.lineWidth = 2.5 + hash(i * 3.1) * 8;
      w.beginPath();
      for (let y = 0; y <= 256; y += 8) { const x = x0 + A * Math.sin(y / 256 * Math.PI * 2 * n + ph); if (y) w.lineTo(x, y); else w.moveTo(x, y); }
      w.stroke();
    }
    for (let i = 0; i < 10; i++) {                     // soft puffs, drawn again across the top and the bottom edges
      const x = 20 + hash(i * 9.1) * 24, y = hash(i * 6.7) * 256, r = 6 + hash(i * 2.2) * 9;
      for (const oy of [-256, 0, 256]) {
        const gr = w.createRadialGradient(x, y + oy, 0, x, y + oy, r);
        gr.addColorStop(0, "rgba(255,255,255,0.45)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        w.fillStyle = gr;
        w.fillRect(x - r, y + oy - r, 2 * r, 2 * r);
      }
    }
    // the fades (the alpha map reads its green channel): soft edges across the column; along it, in over the coals and out over the last
    // tenth, just under the ceiling
    const fc = mk(32, 256), f = fc.getContext("2d"), img = f.createImageData(32, 256);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 32; x++) {
      const u = (x + 0.5) / 32, v = 1 - (y + 0.5) / 256;              // v: 0 over the coals, 1 at the top
      const across = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u - 0.5) * 2, 2)), 1.5);
      const along = Math.min(1, v / 0.015) * Math.min(1, (1 - v) / 0.1) * (1 - 0.25 * v);
      const a = Math.round(255 * across * along), k = (y * 32 + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = a;
      img.data[k + 3] = 255;
    }
    f.putImageData(img, 0, 0);
    const tex = (cv, srgb) => { const t = new CanvasTexture(cv); t.wrapS = ClampToEdgeWrapping; t.wrapT = RepeatWrapping; if (srgb) t.colorSpace = SRGBColorSpace; return t; };
    const coreMap = tex(wc, true), haloMap = coreMap.clone(), fade = tex(fc, false);
    fade.wrapT = ClampToEdgeWrapping;
    coreMap.repeat.set(1, 11);
    haloMap.repeat.set(1, 7);
    haloMap.needsUpdate = true;
    const mat = (map, op) => new MeshBasicMaterial({ map, alphaMap: fade, color: 0xf2f2f6, transparent: true, opacity: op, depthWrite: false, side: DoubleSide });
    int_texCache.smoke = {
      coreMap, haloMap,
      core: mat(coreMap, 0.95), halo: mat(haloMap, 0.42),                // 1.0.1-L (L.53): denser (K.5: 0.8, 0.28)
      coalGeo: new IcosahedronGeometry(0.055, 0),
      coalMat: new MeshBasicMaterial({ color: 0xffffff })                // glowing: unlit, each coal its own colour (setColorAt)
    };
    return int_texCache.smoke;
  }

  async function buildInterior(ctx) {
    const { H, M, CO, LV } = ctx;
    const g = new Group();
    g.name = "interior";
    ctx.root.add(g);
    const cut = [];
    const F = LV.HEI;                       // house floor, y 12
    const FL = F + 0.07;                    // top of the gold floor skin (0.06) + epsilon: the vessels stand here
    const XE = CO.xKodeshE, XW = CO.xKodeshW, XDE = CO.xDevirE, XDW = CO.xDevirW;   // -3.5, -43.5, -44.5, -63.5
    const HW = CO.HOUSE_W / 2;              // 10: half the inner width (I Kings 6:2 "ועשרים רחבו")
    const KH = CO.HOUSE_H;                  // 30: the kodesh height (I Kings 6:2 "ושלשים אמה קומתו")
    const DH = CO.DEVIR_H;                  // 20: the devir height (I Kings 6:20 "ועשרים אמה קומתו"; Rashi: its ceiling lower than the heichal's)
    const xr = (x_r) => XE - x_r;           // research x_r (from the heichal door westward) -> model x
    const zr = (z_r) => -HW + z_r;          // research z_r (from the north wall southward) -> model z
    const ROCK_H = 0.12;                    // even shetiya: three fingers (Yoma 53b)
    const ARK_L = 2.5, ARK_W = 1.5, ARK_H = 1.5;   // Ex 25:10
    const DEVIR_CX = (XDE + XDW) / 2;       // -54: the room's centre (floor, skins, light; the UI's cloud)
    const ARK_X = XDW + 5;                  // -58.5: the ark line in the WEST part of the devir (Rambam Beit HaBechira 4:1 "אבן היתה בקדש
                                            // הקדשים במערבו שעליה היה הארון מנח"); the 5 from the west wall = model choice (SPEC 7)
    const STAFF_Z = ARK_L / 2 + 0.15;       // staffs at the ends of the ark's length (Rashi on I Kings 6:23; Menachot 98b: 2.5 between them)
    const STAFF_Y = F + ROCK_H + ARK_H / 2; // at the ark's mid height
    const STAFF_X0 = XDW;                   // 1.2.0 (the user, after Baraita d'Melechet HaMishkan 7 "ומנין שהאריכו מבפנים? שנאמר ולא יראו החוצה"): the staffs
                                            // were lengthened inward too - their west ends at the west wall itself (x -63.5; was 0.2 inside the ark's west face)
    const STAFF_LEN = XW - STAFF_X0;        // 15.55 (model choice, SPEC 7 "~15"): their east ends reach the parochet's west face (x -43.5) and press it (I Kings 8:8)
    const STAFF_PRESS = 0.3, STAFF_BULGE = 0.28;   // 1.0.1-L (L.54): the staffs 0.3 longer, into the curtain's swelling, 0.28 high (model choices)

    // ---- materials ----
    const olive = M.cedar.clone(); olive.color.set(0xB89A6A);          // עצי שמן = olive (Targum, Rashi on 6:23); Ralbag (and Radak as a 2nd reading): a resinous cedar/pine - DEV note
    // 1.0.1-K (K.5): the carved gold (int_carvedTex above, after the book): on the walls the cell of 5 x 10 amot; on the doors the same cell
    // scaled to their height (review H2-CARVE-3) - the heichal leaves 5 x 19.8 take two registers (the cell 5 x 9.9), the devir leaves
    // 3 x 11.8 two registers (3 x 5.9). The doors' gold "זהב מישר על המחקה" (6:35): the same carving, a little less polished. goldStd (K 0.4).
    const goldCarved = int_carvedMat(INT_CARVE_U, INT_CARVE_V);
    // 1.0.1-L (L.47, the user: "הקיר השמאלי בהיכל קצת יותר כהה משאר הקירות - תקן"): WHY - every material here reflects the scene's environment
    // (90-entry.js: PMREM of three's RoomEnvironment), and that room is lopsided: its large bright panel (light4, 43 x 4.4 x 5.4) hangs on its
    // +z side and only a small dim one (light5, 20 x 2.5 x 2) on its -z side. The house's walls are lined with polished gold (metalness 0.5,
    // envMapIntensity 1.3), so the north wall, which faces south (+z), mirrors the big panel, and the south wall - the LEFT wall seen from the
    // entrance looking west - faces north and mirrors the small one: it renders darker (the lights, the normals and the bump are symmetric).
    // FIX: the south faces get the same environment MIRRORED north-south (a PMREM of RoomEnvironment scaled z -1), so they reflect exactly
    // what the north faces reflect: the two long walls read alike, and nothing else changes (one gold recipe: only the reflected environment
    // differs). Off the load path: the PMREM is made once, the first time the camera comes near the house (the south skins are seen only
    // from inside it), by a check in ctx.animated (no allocation per frame); the same size and blur as the scene's (90-entry.js), so the
    // shader program stays the same. Without a renderer (tests) they keep the scene's environment.
    const southMats = [];
    let envMirrorTried = false;
    const southFaced = (mat) => { const m = mat.clone(); southMats.push(m); return m; };
    const mirrorEnv = () => {
      envMirrorTried = true;
      try {
        if (!(ctx.renderer && typeof PMREMGenerator === "function" && typeof RoomEnvironment === "function")) return;
        const room = new RoomEnvironment();
        room.scale.z = -1;
        room.updateMatrixWorld(true);
        const pm = new PMREMGenerator(ctx.renderer);
        const envMirrorNS = pm.fromScene(room, 0.04).texture;
        pm.dispose();
        room.dispose();
        for (const m of southMats) m.envMap = envMirrorNS;
      } catch (e) { console.warn("[interior] mirrored environment", e); }
    };
    ctx.animated.push(() => {
      if (envMirrorTried) return;
      const c = ctx.camera && ctx.camera.position;
      if (c && c.x > XDW - 12 && c.x < CO.xHouseE + 15 && Math.abs(c.z) < 25 && c.y < F + KH + 25) mirrorEnv();
    });
    const goldCarvedSouth = southFaced(goldCarved);                    // the south skins of the kodesh and the devir
    // 1.0.1-L (A20, the user: "להשוות"): the east wall and the traksin's face stand twice as far from the hall's one ceiling light as the side walls and read darker; the same gold, brighter
    const goldCarvedEnd = goldCarved.clone();
    goldCarvedEnd.name = "goldCarvedEnd";
    goldCarvedEnd.envMapIntensity = 3;                                 // the traksin: read 93.4, now 117 (the side walls 117 and 129; tested 2.4, 3)
    // A20: the two doorposts of the devir alike: the north post's facet toward the middle faces south and mirrored the big panel, near white (the same facet of the south post mirrors the small one)
    const goldPostNorth = southFaced(M.gold);
    const goldCarvedEast = goldCarved.clone();
    goldCarvedEast.name = "goldCarvedEast";
    goldCarvedEast.envMapIntensity = 3;                                // the east wall: read 64.9, now 114 (tested three mixes)
    goldCarvedEast.color.multiplyScalar(2.2);
    goldCarvedEast.emissiveIntensity += 0.25;
    const goldCarvedDoor = int_carvedMat(INT_CARVE_U, INT_HEI_DOOR_H / 2 - 0.1, { roughness: 0.36 });
    const goldCarvedDoorSouth = southFaced(goldCarvedDoor);           // 1.0.1-L (L.47): the south leaf of the heichal's doors
    const goldCarvedDevirDoor = int_carvedMat(3 * INT_CARVE_U / 5, (INT_DEVIR_DOOR_H - 0.2) / 2, { roughness: 0.36 });
    const goldCarvedDevirDoorSouth = southFaced(goldCarvedDevirDoor);  // 1.0.1-L (verifier of L.47): the south leaf of the devir's doors - it read as dark as the south wall had
    // the house floor: gold over cypress boards whose joints show faintly (int_floorTex; 6:15, 6:30 - FIXES K.5.4)
    const goldFloor = goldStd(int_floorTex(false), { roughness: 0.36, bumpScale: 0.5 });
    // 1.0.1-K (K.4): the materials of the rebuilt vessels, the parochet and the cherubim (gold = M.gold or goldStd, FIXES K 0.4)
    const breadMat = std(int_speckleTex("bread", "#a2612d", ["rgba(206,150,84,0.36)", "rgba(196,138,76,0.3)", "rgba(92,48,18,0.38)"], 170, 8), { roughness: 0.78 });   // the baked loaves (a darker crust, as the book draws them)
    const crownMat = goldStd(int_crownTex(), { bumpScale: 0.7, roughness: 0.3 });     // the table's crown (Ex 25:24-25)
    const tubeEndMat = new MeshStandardMaterial({ color: 0x24170c, roughness: 0.9 });      // the dark hollow ends of the tubes
    const incenseMat = new MeshStandardMaterial({ color: 0xf4efe2, roughness: 0.95 });     // the white frankincense ("לבונה זכה", Lev 24:7)
    // the gold of the vessels (tables, menorot, the golden altar, the cherubim; 7:48-49, 6:28): goldStd with a warmer, more saturated colour
    // than M.gold's cream and a little more warm glow, so a gold vessel reads as gold, not cream or brown, in the closed house (compared in
    // pictures: M.gold, 0xFFE7A8, 0xFFE09A, 0xFFD873 - review K.4; the user: "מזבח הזהב אינו מוצג אצלך כזהב")
    const vesselGold = goldStd(TEX.gold, { color: 0xFFDC86, roughness: 0.3, emissive: 0x6b4a10, emissiveIntensity: 0.55 });
    const menorahGold = goldStd(int_almondTex(), { color: 0xFFDC86, roughness: 0.3, emissive: 0x6b4a10, emissiveIntensity: 0.55, bumpScale: 0.06 });   // 1.0.1-L (verifier of L.73): the same gold, its ornaments "משקדים"
    const tableGold = vesselGold;                                                 // the tables and their vessels (I Kings 7:48 "זהב")
    const goldAltar = goldStd(TEX.gold, { color: 0xFFDC86, roughness: 0.26, emissive: 0x6b4a10, emissiveIntensity: 0.55 });   // the golden altar: polished
    const fretMat = goldStd(int_fretTex(), { alphaTest: 0.5, side: DoubleSide, roughness: 0.25 });   // its crown (Ex 30:3)
    const cedarBoards = std(int_plankTex(), { roughness: 0.72 });                 // the altar's cedar boards (6:20), upright planks as the book draws them
    const altarStone = std(int_speckleTex("stone", "#a3a29c", ["rgba(70,70,68,0.45)", "rgba(222,222,216,0.5)", "rgba(120,118,112,0.5)"], 260, 2.6), { roughness: 0.86 });
    const parTex = int_parochetTex();
    const parEast = std({ map: parTex.east }, { roughness: 0.93 }), parWest = std({ map: parTex.west }, { roughness: 0.93 });
    const parPlain = std({ map: parTex.plain }, { roughness: 0.93 });
    const parochetMats = [parEast, parWest, parPlain, parPlain, parPlain, parPlain];   // BoxGeometry faces: +x (toward the heichal), -x (toward the devir), the edges
    const flameMat = new MeshBasicMaterial({ color: 0xFFC85E });
    const smokeParts = int_smokeParts();                                       // 1.0.1-K (K.5): the incense smoke and the coals (int_smokeParts)
    const rockMat = M.stone.clone(); rockMat.color = new Color(0xB9A58C);

    // ---- ulam interior: no gold (Rashi, Metzudot, Ralbag on II Chr 3:4 "ולא האולם"; Malbim: the ulam gilded too - DEV note) ----
    // The hall's own side walls (z +-10..+-16) carry their cedar courses after I Kings 7:12 "ולאלם הבית" (3 stone courses + 1 cedar course)
    // in 50-heichal.js (bandWall: cedar at y 15..16, 19..20, ...), so nothing is added on them here. The ulam's west side is the HOUSE wall,
    // plain hewn stone in 50-heichal.js (6:7); model choice: the cedar courses are continued on its east face (x 2.5) at the same heights
    // for a uniform ulam look - this face is not covered by 7:12.
    // 1.0.1-K review (heichal-2, interior-4): these courses are inside the ulam, so none of them is in ctx.cutaway (since K.2 that list opens
    // the HOUSE only; the ulam has ctx.ulamCut = its front wall and roof, not this face): the strips south of the doorway were still in it,
    // and "פתח את הבית" stripped them from the closed ulam; both sides are now built alike
    // 1.2.3: the section from the east (70-ui.js setSection, ctx.sectionCut) takes the house's east wall off (50-heichal.js) - and with it
    // what hangs on it here: these courses, the doorposts and lintel, the two doors and their pivots, the gold skin round the doorway inside
    const secE = (ctx.sectionCut = ctx.sectionCut || []);
    try {
      for (let y = F + 3; y < F + KH - 1; y += 4) {                                         // y 15, 19, ... 39
        // around the heichal doorway and its posts (z +-6) and lintel (to y 33)
        if (y >= F + INT_HEI_DOOR_H + 1) secE.push(H.box(g, 0.08, 1, 2 * HW, M.cedar, CO.xHouseE + 0.04, y, 0));
        else for (const s of [-1, 1]) secE.push(H.box(g, 0.08, 1, 4, M.cedar, CO.xHouseE + 0.04, y, s * 8));   // z +-6..+-10
      }
    } catch (e) { console.warn("[interior] ulam courses", e); }

    // 1.3.3 (the user: "להוסיף שיטת ברירת מחדל לפותות כרש״י"): THE KEYS OF GOLD - "והפתות לדלתות הבית הפנימי לקדש הקדשים לדלתי הבית להיכל
    // זהב" (7:50); Rashi there (book 3673, line 468): "והפתות. מפתחות, שמעתי. שמפתחין בהם את המנעול" - the default reading of the row
    // "הפותות" (ctx.shared.potot): a key of gold in the lock of the north leaf of each doorway, the heichal's and the devir's (in both of the
    // devir's readings). The other reading - the pivots (the Targum, Radak) or what the pivot enters (Ralbag, book 3645 line 320: "מה שיכנס
    // ציר הדלת בו"; Metzudat Zion) - is the gold pivots built at every leaf, so it only hides the keys. The lock's place (2.2 above the floor,
    // by the leaf's free edge), the key's form and size - model choices. Each key hangs in its leaf's group, so it turns with the leaf.
    const pototKeys = [];
    const pototLayer = new Group();   // gates the key's label
    pototLayer.name = "pototKeys";
    g.add(pototLayer);
    ctx.layers = ctx.layers || {};
    ctx.layers.pototKeys = pototLayer;
    const goldKey = (parent, x, y, z, side) => {   // side +1: out of the leaf's local +z face; -1: out of its -z face
      const k = new Group();
      k.name = "goldKey";
      k.position.set(x, y, z);
      k.scale.z = side;
      parent.add(k);
      const part = (geo, px, py, pz, mat) => { const m = new Mesh(geo, mat || M.gold); m.position.set(px, py, pz); m.castShadow = true; k.add(m); return m; };
      part(new BoxGeometry(0.34, 0.56, 0.04), 0, 0, 0.02);                                              // the lock's plate on the face
      part(new BoxGeometry(0.07, 0.17, 0.01), 0, -0.08, 0.045, new MeshBasicMaterial({ color: 0x1a1206 }));   // the keyhole
      const turn = new Group();   // the shaft and the bow turn in the lock (the demonstration of the doors, below)
      turn.position.set(0, -0.08, 0);
      k.add(turn);
      k.userData.turn = turn;
      const tp = (geo, pz) => { const m = new Mesh(geo, M.gold); m.position.set(0, 0, pz); m.castShadow = true; turn.add(m); return m; };
      tp(new CylinderGeometry(0.035, 0.035, 0.42, 10), 0.25).rotation.x = Math.PI / 2;                 // the shaft, out of the keyhole
      tp(new TorusGeometry(0.14, 0.035, 8, 22), 0.6).rotation.y = Math.PI / 2;                         // the bow, upright, along the shaft
      pototKeys.push(k);
      return k;
    };
    // ---- פתח ההיכל (I Kings 6:33-35): opening 10 x 20 in the east wall (x -3.5..2.5), built by 50-heichal.js ----
    {
      const PX = CO.xHouseE + 0.5;        // the posts stand on the east face of the house wall (x 2.5), 1 thick -> centre x 3
      // doorposts of olive wood, SQUARE section 1x1 (6:33 "מזוזות עצי שמן מאת רבעית"; Targum "מרבעין"; Rashi; Radak: four steps - DEV note),
      // 20 high (= the opening), with a lintel 1 high (model choice); gold-overlaid (II Chr 3:7 "ויחף את הבית... הספים... זהב" - the doorposts;
      // 7:50 "והפתות... זהב" is about the pivots or their sockets, not the posts - see the pivots below)
      for (const s of [-1, 1]) secE.push(H.box(g, 1, INT_HEI_DOOR_H, 1, M.gold, PX, F, s * (INT_HEI_DOOR_W / 2 + 0.5)));   // z +-5..6
      secE.push(H.box(g, 1, 1, INT_HEI_DOOR_W + 2, M.gold, PX, F + INT_HEI_DOOR_H, 0));                                    // lintel y 32..33
      // two doors of cypress (6:34 "שתי דלתות עצי ברושים"), each 5 wide = half the opening (Rashi), 20 high, 0.33 thick (model choice),
      // each made of two boards ("שני צלעים": Malbim; Rashi: two hinges per door), hung on the posts, opened westward into the wall
      // thickness and resting on the sides of the opening (Radak's four-door reading - DEV note). Thin gold straightened over the
      // carving (6:35 "זהב מישר על המחקה"; Malbim) -> gold faces with darker-gold reliefs.
      // 1.0.1 (the user: "יש בעיה בכניסה לתוך ההיכל"): each leaf stands FULLY open - both of its boards folded back flat along the reveal
      // of the opening, parallel to x, inside the 6-thick wall (x -2.7..2.3), so the whole 10 x 20 passage stays clear (model choice).
      const T = 0.33;
      const HX = CO.xHouseE - 0.2;         // 2.3: the pivot axis 0.2 inside the east face of the wall (model choice)
      const DZ = INT_HEI_DOOR_W / 2 - 0.4; // 4.6: the leaf's centre plane 0.4 in from the reveal (z +-5); since 1.0.1-H the leaf is a plain board
                                           // 0.33 thick (the carving is its texture), so it fills z +-4.435..4.765 and 8.87 of the passage stays free (model choice)
      // 1.0.1-H: the carvings "כרובים ותמרות ופטורי ציצים" (6:35) are the carved-gold texture of the leaves (int_carvedTex); the 1.0.0 relief
      // boxes and the "גלילים" discs are gone. 6:34 "שני צלעים הדלת האחת גלילים": Targum and Rashi - "תרין צירין, ציר העליון וציר התחתון",
      // "גלילים. (תרגום:) סגלגלין" (two round pivots per door: the gold pivots below); Malbim - "שני לוחות" (the two boards of each leaf, built);
      // Radak, Metzudot ("אופנים"), Ralbag ("גלילים ועמודים") - both faces of each door painted "מעשה גלילים" - not built (DEV note)
      const heiHinges = [];   // 1.3.3: [hinge, side] for the demonstration of the doors (ctx.shared.heichalDoors below)
      let heiKey = null;
      for (const s of [-1, 1]) {
        const hinge = new Group();
        hinge.position.set(HX, F, s * DZ);
        hinge.rotation.y = 0;              // first board folded fully back (180 deg from closed): flat along the reveal, x -0.2..2.3 (1.0.1, model choice)
        heiHinges.push([hinge, s]);
        hinge.userData.noFade = true;   // 1.3.4 (the user: "הדגמת פתיחת הדלתות לא מראה את פתיחת הדלתות בפועל"): the fade loop made the leaves see-through
        g.add(hinge);                   // whenever the eye looked at them (the key's close-up, the doorway) - the doors are never faded
        secE.push(hinge);   // 1.2.3: the leaf (both boards) goes with the east wall into the section
        const fold = new Group();          // the second board continues westward along the same reveal, x -2.7..-0.2 (1.0.1, model choice)
        fold.position.set(-2.5, 0, 0);
        fold.rotation.y = 0;
        hinge.add(fold);
        if (s < 0) {   // 1.3.3: the key of gold in the lock of the north leaf, by its free edge, out of its face toward the passage
          heiKey = goldKey(fold, -2.2, 2.2, T / 2, 1);
          ctx.labels.push({ text: "מפתח של זהב — ״והפתות״ (רש״י: מפתחות)", x: HX - 4.7, y: F + 3.7, z: s * DZ + 1.1, size: 0.9, layer: "pototKeys" });
        }
        for (const host of [hinge, fold]) {
          // each board 2.5 x 19.8, carved gold on both faces; 1.0.1-L (L.47): the south leaf (its face toward the passage looks north) with the
          // mirrored environment, like the south wall
          const b = H.box(host, 2.5, INT_HEI_DOOR_H - 0.2, T, s > 0 ? goldCarvedDoorSouth : goldCarvedDoor, -1.25, 0.1, 0);
          // 1.0.1-K (K.5, review H2-CARVE-4): the uvs in the leaf's own frame (xi = the distance from the pivot, -5..0 over both boards), so
          // the carving runs on across the joint of the two boards; on the face toward the passage (+z: the north leaf, -z: the south one)
          // the pair of cherubim stands at the joint, in the middle of the leaf, with half a palm at each edge (model choice); not mirrored
          int_boxUV(b.geometry, b.position.x + (host === fold ? -2.5 : 0), b.position.y, 0,
            (nx, ny, nz, x, y) => [nz > 0.5 ? x + 4.5 : nz < -0.5 ? -x - 0.5 : x, y - 0.1]);
        }
        // round gold pivots top and bottom, on the pivot axis (x 2.3, z +-4.6). "והפתות... זהב" (7:50): for the Targum ("מוגלסיא") and Radak the
        // doors' pivots ("והם צירי הדלתות"); for Ralbag and Metzudat Zion the socket the pivot turns in (Ralbag "מה שיכנס ציר הדלת בו";
        // Metzudat Zion "העשויות להציב בהן צירי הדלתות", Kelim 11:2 "הפותה שתחת הציר"); for Rashi keys ("מפתחות, שמעתי") - the gold
        // cylinders fit the first two readings (review Q2-2)
        secE.push(H.cyl(g, 0.14, 0.14, 0.3, M.gold, HX, F, s * DZ, 10));
        secE.push(H.cyl(g, 0.14, 0.14, 0.3, M.gold, HX, F + INT_HEI_DOOR_H - 0.3, s * DZ, 10));
      }
      // 1.3.3 (the user's list: "הדגמת פתיחת דלתות ההיכל", with Rashi's key - "להוסיף שיטת ברירת מחדל לפותות כרש״י"): THE DEMONSTRATION OF THE
      // HEICHAL'S DOORS - the two doors shut across the doorway (each leaf turned a quarter round its pivots), the key of gold turns in the lock
      // of the north door (only in Rashi's reading of "והפתות", ctx.shared.potot), and the doors open slowly into the house, as they stand,
      // with the sound of a heavy door made here (WebAudio, no file). The devir's doors are not closed: they stood open and a curtain hung
      // (Rashi and Radak on II Chr 3:14 - the doorway's card). ctx.shared.heichalDoors = { demo(fly), at(e), stop() }; the place "פתיחת דלתות
      // ההיכל — הדגמה" (70-ui.js). The leaves turn round the pivots they hang on; the folding of the two boards (Malbim) stays as built.
      // Timing and the camera - model choices.
      {
        const SFX = (() => {
          let ac = null;
          const A = () => {
            if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; try { ac = new C(); } catch (_) { return null; } }
            if (ac.state === "suspended") { try { ac.resume(); } catch (_) {} }
            return ac;
          };
          const noise = (a, sec) => { const b = a.createBuffer(1, Math.max(1, Math.floor(a.sampleRate * sec)), a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
          const env = (a, t, peak, att, dec) => { const g2 = a.createGain(); g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(peak, t + att); g2.gain.exponentialRampToValueAtTime(0.0001, t + att + dec); g2.connect(a.destination); return g2; };
          return {
            click(at) { const a = A(); if (!a) return; const t = a.currentTime + (at || 0);
              for (const [dt, f] of [[0, 3400], [0.08, 2300], [0.2, 1800]]) { const s2 = a.createBufferSource(); s2.buffer = noise(a, 0.06); const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = 9; s2.connect(bp); bp.connect(env(a, t + dt, 0.7, 0.003, 0.05)); s2.start(t + dt); } },
            door(at, dur) { const a = A(); if (!a) return; const t = a.currentTime + (at || 0);
              const o = a.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(62, t); o.frequency.linearRampToValueAtTime(88, t + dur * 0.6); o.frequency.linearRampToValueAtTime(70, t + dur);
              const lfo = a.createOscillator(); lfo.frequency.value = 6.5; const lg = a.createGain(); lg.gain.value = 9; lfo.connect(lg); lg.connect(o.frequency);
              const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 420; bp.Q.value = 5;
              const g2 = a.createGain(); g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(0.22, t + 0.4); g2.gain.setValueAtTime(0.22, t + dur - 0.5); g2.gain.exponentialRampToValueAtTime(0.0001, t + dur);
              o.connect(bp); bp.connect(g2); g2.connect(a.destination); o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
              const s2 = a.createBufferSource(); s2.buffer = noise(a, dur + 0.1); const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 140;
              const g3 = a.createGain(); g3.gain.setValueAtTime(0.0001, t); g3.gain.exponentialRampToValueAtTime(0.5, t + 0.5); g3.gain.setValueAtTime(0.5, t + dur - 0.4); g3.gain.exponentialRampToValueAtTime(0.0001, t + dur);
              s2.connect(lp); lp.connect(g3); g3.connect(a.destination); s2.start(t); s2.stop(t + dur + 0.1);
              const th = a.createOscillator(); th.type = "sine"; th.frequency.setValueAtTime(58, t + dur); th.frequency.exponentialRampToValueAtTime(32, t + dur + 0.35);
              th.connect(env(a, t + dur, 0.8, 0.01, 0.5)); th.start(t + dur); th.stop(t + dur + 0.6); }
          };
        })();
        const capG = [new Group(), new Group()];
        capG.forEach((c, i) => { c.visible = false; g.add(c); ctx.layers["heiDoorCap" + i] = c; });
        ctx.labels.push(
          { text: "״והפתות לדלתות הבית... זהב״ — רש״י: ״מפתחות... שמפתחין בהם את המנעול״ (מלכים א ז, נ)", x: HX + 3, y: F + 12, z: -2.5, size: 1.1, layers: ["heiDoorCap0", "pototKeys"] },
          { text: "״ושתי דלתות עצי ברושים שני צלעים הדלת האחת גלילים״ (מלכים א ו, לד)", x: HX + 3, y: F + 12, z: -2.5, size: 1.1, layer: "heiDoorCap1" }
        );
        const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * u));
        const pose = (t) => { for (const [h, s2] of heiHinges) h.rotation.y = (s2 < 0 ? Math.PI / 2 : -Math.PI / 2) * (1 - ease(t)); };   // 0 shut, 1 open
        // 1.3.4 (the Second Temple plugin's round, the user: "לא מספיק ברור איך היתה נדחפת היד כדי לפתוח"): the priest's hand on the key while
        // it turns - a fist on the bow, the wrist and a white linen sleeve back along the shaft (out of the leaf's face, toward the ulam
        // while the leaf is shut), turning with the key; seen only then. The form - a model choice
        const handG = new Group();
        handG.visible = false;
        if (heiKey && heiKey.userData.turn) {
          heiKey.userData.turn.add(handG);
          const skin = new MeshStandardMaterial({ color: 0xc99d7c, roughness: 0.75 }), linen = new MeshStandardMaterial({ color: 0xf1ede2, roughness: 0.92 });
          const hp = (geo, mat, z, rx) => { const m = new Mesh(geo, mat); m.position.set(0, 0, z); if (rx) m.rotation.x = rx; m.castShadow = true; m.userData.noPick = true; handG.add(m); return m; };
          hp(new SphereGeometry(0.1, 14, 10), skin, 0.66).scale.set(1.0, 1.15, 1.2);           // the fist round the bow
          hp(new CylinderGeometry(0.05, 0.055, 0.2, 10), skin, 0.84, Math.PI / 2);              // the wrist
          hp(new CylinderGeometry(0.085, 0.105, 0.8, 14), linen, 1.33, Math.PI / 2);            // the sleeve
        }
        const apply = (e) => {
          const keyOn = !ctx.shared.potot || ctx.shared.potot.current === "rashi";
          if (heiKey && heiKey.userData.turn) heiKey.userData.turn.rotation.z = keyOn ? (Math.PI / 2) * ease((e - 1.0) / 0.8) : 0;
          handG.visible = keyOn && e > 0.3 && e < 2.2;   // 1.3.4: the hand while the key turns
          pose((e - 2.2) / 4.8);
          const stage = e < 2.0 && keyOn ? 0 : e < 9.5 ? 1 : -1;
          capG.forEach((c, i) => (c.visible = i === stage));
        };
        const D = ctx.shared.heichalDoors = {
          t0: -1,
          demo(flyToo) {
            this.t0 = performance.now();
            apply(0);
            const keyOn = !ctx.shared.potot || ctx.shared.potot.current === "rashi";
            const SL = (ctx.shared && ctx.shared.demoSlow) || 1.5;   // 1.3.4 (the user: "כל ההדגמות יותר איטיות"): the motion, the captions and the sound
            if (keyOn) SFX.click(1.1 * SL);
            SFX.door(2.2 * SL, 4.8 * SL);
            if (flyToo && ctx.ui && typeof ctx.ui.fly === "function") {
              // 1.3.4: first close to the key and the hand that turns it, then back to see both doors open
              clearTimeout(D.__wide);
              // 1.3.4: from the steps before the ulam, through its doorway (10 x 22), at the whole heichal doorway; the target stands in the
              // ulam before the shut doors - nothing between it and the eye (the target inside the house pulled the eye to the leaves)
              const wide = () => ctx.ui.fly([25, F + 9.5, 2.5], [3.5, F + 9, 0]);
              if (keyOn && heiKey) {
                const kp = new Vector3();
                heiKey.updateWorldMatrix(true, false);
                heiKey.getWorldPosition(kp);
                ctx.ui.fly([kp.x + 2.6, kp.y + 0.6, kp.z + 1.5], [kp.x, kp.y - 0.1, kp.z]);
                D.__wide = setTimeout(() => { if (D.t0 >= 0) wide(); }, 2300 * SL);
              } else wide();
            }
          },
          at(e) { this.t0 = -1; apply(e); },   // a still frame (checks, the presentation)
          stop() { clearTimeout(this.__wide); this.t0 = -1; pose(1); if (heiKey && heiKey.userData.turn) heiKey.userData.turn.rotation.z = 0; handG.visible = false; capG.forEach((c) => (c.visible = false)); }
        };
        (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({ id: "int-doors-demo", running: () => D.t0 >= 0, stop: () => D.stop() });   // 1.3.4: any switch stops it
        ctx.animated.push(() => {
          if (D.t0 < 0) return;
          const e = (performance.now() - D.t0) / 1000 / ((ctx.shared && ctx.shared.demoSlow) || 1.5);
          apply(e);
          if (e > 10) D.stop();
        });
        // 1.3.3 (the user, of the Second Temple plugin: "כפתור על הכיור להדגמה וכן בכל מקום שיש הדגמה כפתור כמו בבית ראשון"): the doors'
        // demonstration has its button on the model too - over the doorway on the ulam's side, or the kodesh's when the camera is inside
        {
          const MB = Array.isArray(ctx.shared.modelButtons) ? ctx.shared.modelButtons : (ctx.shared.modelButtons = []);
          const aE = [HX + 2.4, F + 21.5, 0], aW = [HX - 7.2, F + 21.5, 0];
          MB.push({
            id: "int-doors-demo", label: "הדגמה: פתיחת דלתות ההיכל", labelOn: "עצור את ההדגמה", maxDist: 90,
            title: "שתי הדלתות סגורות, מפתח של זהב מסתובב במנעול (״והפתות״ — רש״י: מפתחות), והן נפתחות בקול של דלת כבדה (מלכים א ו, לד; ז, נ).",
            anchor: () => (ctx.camera && ctx.camera.position.x < HX - 6 ? aW : aE),
            get: () => D.t0 >= 0,
            set: (on) => { if (on) D.demo(true); else D.stop(); }
          });
        }
      }
    }

    // ---- kodesh finishes (I Kings 6:15, 6:18, 6:21-22, 6:29-30) ----
    // 1.0.1-K (K.5): every carved face takes its uvs from world positions (int_boxUV), seen from the room: the north skin u = x + 43.5, the
    // south skin u = -3.5 - x, the east skin u = z + 10 (now built of boxes: the extruded wall of 1.0.1-H showed the pattern mirrored, review
    // H2-CARVE-5), the west faces u = 10 - z, and v = y - 12 everywhere: the three registers of 10 run from the floor to the ceiling.
    const faceUV = (ox, oz) => (nx, ny, nz, x, y, z) => {
      const v = y - F;
      if (nz > 0.5) return [x - ox, v];
      if (nz < -0.5) return [ox - x, v];
      if (nx < -0.5) return [z - oz, v];
      if (nx > 0.5) return [oz - z, v];
      return [x - ox, z - oz];
    };
    const floorUV = (nx, ny, nz, x, y, z) => [x, z];                  // the floor's boards run east-west (int_floorTex)
    const mergedMesh = (geos, mat, parent, list) => {
      const m = new Mesh(mergeGeometries(geos), mat);
      m.castShadow = m.receiveShadow = true;
      parent.add(m);
      if (list) list.push(m);
      return m;
    };
    const SKIN = 0.2;                       // the skins: carved cedar overlaid with gold, 0.2 thick (model choice)
    // ---- 1.0.1-K (K.5): THE LAYERS OF THE WALL AND THE FLOOR (the user: "הוסף אופציה להצגה של כל השכבות של ההיכל (אבן עץ ארז, וזהב)") ----
    // The house: walls and floor of stone (6:7 "והבית בהבנתו אבן שלמה מסע נבנה"); the walls lined with cedar boards from the floor to the
    // ceiling (6:15 "ויבן את קירות הבית מביתה בצלעות ארזים מקרקע הבית עד קירות הספן"), carved (6:18 "וארז אל הבית פנימה מקלעת פקעים ופטורי
    // צצים הכל ארז אין אבן נראה"; Radak 6:15 "שלא תראה אבן הקיר"), and the cedar overlaid with gold (6:21-22). Why the cedar: Rashi 6:15
    // "קירות ארז אצל קיר האבן, כדי לטוח עליו זהב... ואי אפשר לטוח זהב על גבי האבנים, כי אם בעצים ובמסמרות" (so Metzudat David 6:15; Rashi II
    // Chr 3:5). The floor: stone, cypress boards (6:15 "ויצף את קרקע הבית בצלעות ברושים"; Metzudat David II Chr 3:5 "את קרקע הבית חפה בעצי
    // ברושים") and gold (6:30 "ואת קרקע הבית צפה זהב לפנימה ולחיצון", Rashi "לבית הכפרת ולהיכל"; Metzudat David "על רצפת צלעות הברושים").
    // DEV notes: Malbim (II Chr 3:5): the devir's floor was gold without cypress; Ralbag (II Chr 3:5): the floor's "צלעות" were beams, not
    // boards. The book (p06, "כותלי ורצפת ההיכל") cuts the layers back in steps on one wall and on the floor beside it; so here, as an OPTION
    // (ctx.shared.wallLayers + an on-model button; off = everything gold, 6:18 "אין אבן נראה"): on the north wall of the kodesh, where its
    // default view (flyPoints.kodesh) sees it, a stepped window x -28.5..-19.5, y 12..28 - the gold cut back in steps, the carved cedar cut
    // back further, the house's stone behind - and the floor beside it z -10..-6.4 likewise: stone, cypress, gold. The place, the steps
    // (4 rows of 4 on the wall, of 0.9 on the floor), the cedar 0.15 + gold 0.05 on the wall and the cypress 0.04 + gold 0.02 on the floor
    // (the 0.2 skin and the 0.06 floor): model choices. The cedar shows the same carving (int_carvedCedarMap, drawn on the first use).
    // 1.0.1-L (L.14, the user: "שיראה ברור"): the exhibit rebuilt LARGER, clearer and like the book's (p06_layers): a staircase cut in from the
    // west - the stone in the lower-west part, the carved cedar in a diagonal band 4 amot wide beside it, the gold beyond it - over 12 x 14
    // amot (x WL.x0..WL.x0 + 12, y 12..26: 4 rows of 3.5, the steps 2 amot; K.5: 9 x 16 in narrow steps of 1), and the floor before it in the same
    // staircase (4 rows of 1.2, z -10..-5.2): stone, cypress, gold. A strong contrast: the stone a grey ashlar of its own (int_stoneTex), the
    // cedar a red-brown carved wood (INT_CARVE_PAL.cedar; K.5's pale cedar read like the stone), the gold as on every wall; the cypress boards
    // of the floor orange-brown. The labels sit on their own layers and flyPoints.wallLayers looks at the window frontally (model choices).
    // 1.0.1-L (L.31, the user: "העץ בשכבות ההיכל לא מספיק מחודד", then "קח את זה קצת יותר לכיוון פתח ההיכל כדי שיראה יותר ברור"): the whole
    // window - wall and floor - moved 7 amot EAST toward the heichal's entrance: x -21.5..-9.5 (it was -28.5..-16.5; K.5 -28.5..-19.5). There
    // it stands clear of every vessel (the tables of both layouts stand at x -29.5 and further west, the menorot in the south half), of the
    // chains (on the traksin) and of the doors (folded in the east wall); through the doorway, from the ulam (flyPoints.heichalDoor), its west
    // half (x < -15.5) is in sight. The carved cedar is sharper: its own upright boards, 1 amah wide, with dark joints (int_carvedCedarMap).
    // 1.0.1-L (A15, the user: "כדאי שיהיה ברור יותר"; L.83: the window stays where it is): its ORDER now as the book's exhibit p06_layers, going inward from
    // the heichal's entrance - the stone at the EAST side (toward the entrance), then the cedar, the gold furthest (west); the same staircase mirrored, on the wall and the floor.
    // NOTE: the default heichal view (flyPoints.kodesh, from x -8, high, looking west) has only this window's upper west corner and its pill at the
    // right edge of its frame (1.0.1-L, verifier); the place "שכבות הקיר והרצפה" flies to flyPoints.wallLayers (frontal), the pill only switches the layers.
    // WL: x0 = the window's west edge, w its width, rh the rows' height (wall), fd their depth (floor); per row (from the floor up / from the
    // wall out; A15) the stone runs from the east edge x1 westward by stone[r], the cedar by cedar[r], the gold beyond it, to x0.
    const WL = { x0: -21.5, w: 12, rh: 3.5, stone: [6, 4, 2, 0], cedar: [10, 8, 6, 4], cedarT: 0.15, fd: 1.2, cyT: 0.04, stoneT: 0.01 };
    const wallLayersParts = { plain: [], layers: [] };
    const cedarCarved = (() => {                                       // the carved cedar: its colour map is drawn on the first use
      const cv = document.createElement("canvas");
      cv.width = cv.height = 4;
      const c2 = cv.getContext("2d");
      c2.fillStyle = INT_CARVE_PAL.cedar.f1;
      c2.fillRect(0, 0, 4, 4);
      const ph = new CanvasTexture(cv);
      ph.wrapS = ph.wrapT = RepeatWrapping;
      ph.colorSpace = SRGBColorSpace;
      ph.repeat.set(1 / INT_CARVE_U, 1 / INT_CARVE_V);
      const bump = int_carvedTex().bumpMap.clone();
      bump.needsUpdate = true;
      bump.repeat.set(1 / INT_CARVE_U, 1 / INT_CARVE_V);
      return std({ map: ph, bumpMap: bump }, { roughness: 0.7, bumpScale: 1.1 });
    })();
    const cypressMat = std(int_floorTex(true), { roughness: 0.7, bumpScale: 0.5 });   // the bare cypress boards of the floor (6:15)
    const ashlarMat = std(int_stoneTex(), { roughness: 0.88 });                        // 1.0.1-L (L.14): the stone of the wall and the floor (6:7)
    {
      const north = faceUV(XW, 0), south = faceUV(XE, 0), east = faceUV(0, -HW);
      const x0 = WL.x0, x1 = WL.x0 + WL.w, yTop = F + 4 * WL.rh, zF = -HW + 4 * WL.fd;
      // 1.0.1-L (L.14; A15 mirrored): one row of the staircase - the piece from the window's west edge x0 to x1 - a (none when a reaches it), or (stone) from
      // x1 - a to x1 (none when a is 0)
      const stair = (list, a, y0, y1, z0, z1, fn) => { if (a < WL.w - 1e-6) int_uvBox(list, x0, x1 - a, y0, y1, z0, z1, fn); };
      const stoneRun = (list, a, y0, y1, z0, z1, fn) => { if (a > 1e-6) int_uvBox(list, x1 - a, x1, y0, y1, z0, z1, fn); };
      // the floor: around the exhibit (always), the exhibit plain (layers off), the exhibit in layers (on)
      const fA = [], fOff = [], fSt = [], fCy = [], fGold = [];
      int_uvBox(fA, XW, x0, F, F + 0.06, -HW, HW, floorUV);
      int_uvBox(fA, x1, XE, F, F + 0.06, -HW, HW, floorUV);
      int_uvBox(fA, x0, x1, F, F + 0.06, zF, HW, floorUV);
      mergedMesh(fA, goldFloor, g);                                    // the floor: cypress boards (6:15) overlaid with gold (6:30)
      int_uvBox(fOff, x0, x1, F, F + 0.06, -HW, zF, floorUV);
      mergedMesh(fOff, goldFloor, g, wallLayersParts.plain);
      for (let r = 0; r < 4; r++) {
        const z0 = -HW + r * WL.fd, z1 = z0 + WL.fd;
        stoneRun(fSt, WL.stone[r], F, F + WL.stoneT, z0, z1, floorUV);   // the stone floor (the grey ashlar laid over the house's floor)
        stair(fCy, WL.stone[r], F, F + WL.cyT, z0, z1, floorUV);          // the cypress where the stone does not show
        stair(fGold, WL.cedar[r], F + WL.cyT, F + 0.06, z0, z1, floorUV);  // the gold beyond the cypress step
      }
      mergedMesh(fSt, ashlarMat, g, wallLayersParts.layers);
      mergedMesh(fCy, cypressMat, g, wallLayersParts.layers);
      mergedMesh(fGold, goldFloor, g, wallLayersParts.layers);
      // the north skin: around the exhibit (always), the exhibit plain, the exhibit in layers (stone, cedar, then gold over the cedar)
      const nA = [], nOff = [], nSt = [], nCed = [], nGold = [];
      int_uvBox(nA, XW, x0, F, F + KH, -HW, -HW + SKIN, north);       // north wall skin: cedar carved (6:18, 6:29) and overlaid with gold (6:22)
      int_uvBox(nA, x1, XE, F, F + KH, -HW, -HW + SKIN, north);
      int_uvBox(nA, x0, x1, yTop, F + KH, -HW, -HW + SKIN, north);
      mergedMesh(nA, goldCarved, g);
      int_uvBox(nOff, x0, x1, F, yTop, -HW, -HW + SKIN, north);
      mergedMesh(nOff, goldCarved, g, wallLayersParts.plain);
      for (let r = 0; r < 4; r++) {
        const y0 = F + r * WL.rh, y1 = y0 + WL.rh;
        stoneRun(nSt, WL.stone[r], y0, y1, -HW, -HW + WL.stoneT, north);   // the stone of the wall (the ashlar on the house's wall face)
        stair(nCed, WL.stone[r], y0, y1, -HW, -HW + WL.cedarT, north);
        stair(nGold, WL.cedar[r], y0, y1, -HW + WL.cedarT, -HW + SKIN, north);
      }
      mergedMesh(nSt, ashlarMat, g, wallLayersParts.layers);
      mergedMesh(nCed, cedarCarved, g, wallLayersParts.layers);
      mergedMesh(nGold, goldCarved, g, wallLayersParts.layers);
      for (const m of wallLayersParts.layers) m.visible = false;
      // the south skin (-> cutaway) and the east skin around the heichal doorway (three boxes)
      const sk = [], ek = [];
      int_uvBox(sk, XW, XE, F, F + KH, HW - SKIN, HW, south);
      cut.push(mergedMesh(sk, goldCarvedSouth, g));                     // 1.0.1-L (L.47): the mirrored environment
      int_uvBox(ek, XE - SKIN, XE, F, F + INT_HEI_DOOR_H, -HW, -INT_HEI_DOOR_W / 2, east);
      int_uvBox(ek, XE - SKIN, XE, F, F + INT_HEI_DOOR_H, INT_HEI_DOOR_W / 2, HW, east);
      int_uvBox(ek, XE - SKIN, XE, F + INT_HEI_DOOR_H, F + KH, -HW, HW, east);
      mergedMesh(ek, goldCarvedEast, g, secE);   // 1.2.3: with the east wall into the section
      // (the kodesh ceiling - 1.3.2: vaulted, crown 42, springing 36 - and the devir ceiling at y 32 get their gold undersides in 50-heichal.js: 6:22, II Chr 3:9)
    }
    const wallLayerGroup = new Group();                // gates the labels of the exhibit (layer "wallLayers", FIXES K 0.5c)
    wallLayerGroup.name = "wallLayers";
    wallLayerGroup.visible = false;
    g.add(wallLayerGroup);
    ctx.layers.wallLayers = wallLayerGroup;
    let cedarDrawn = false;
    ctx.shared.wallLayers = {
      on: false,
      set(on) {
        this.on = !!on;
        if (this.on && !cedarDrawn) {                  // the carved cedar's colours, drawn once on the first use (not at load)
          cedarDrawn = true;
          try {
            const t = int_carvedCedarMap(), old = cedarCarved.map;
            t.repeat.copy(old.repeat);
            cedarCarved.map = t;
            old.dispose();
          } catch (e) { console.warn("[interior] cedar map", e); }
        }
        for (const m of wallLayersParts.plain) m.visible = !this.on;
        for (const m of wallLayersParts.layers) m.visible = this.on;
        wallLayerGroup.visible = this.on;
      }
    };
    {
      // the labels 0.9 in front of the wall (FIXES K.5.3: exactly these texts, layer "wallLayers"). 1.0.1-L (L.14): each in the middle of its
      // own layer of the new staircase, side by side (A15: from the east: stone, cedar, gold), none over another in the frontal view
      const zL = -HW + 0.9, X = WL.x0 + WL.w;
      ctx.labels.push(
        { text: "אבן (ו, ז)", x: X - 2.5, y: F + WL.rh * 0.85, z: zL, size: 1.7, layer: "wallLayers" },              // the stone of rows 0-1 (x0..x0+4)
        { text: "ארז מגולף (ו, טו; ו, יח)", x: X - 4, y: F + WL.rh * 2.5, z: zL, size: 1.5, layer: "wallLayers" },   // the cedar of row 2 (x0+2..x0+6)
        { text: "זהב (ו, כא–כב)", x: X - 9.5, y: F + WL.rh * 2.5, z: zL, size: 1.7, layer: "wallLayers" },          // the gold of row 2 (x0+6..x0+12)
        { text: "ברושים (ו, טו)", x: X - 4, y: F + 0.45, z: -HW + WL.fd * 2.5, size: 1.4, layer: "wallLayers" },    // the floor's cypress, row 2
        { text: "זהב (ו, ל)", x: X - 8.5, y: F + 0.45, z: -HW + WL.fd * 3.4, size: 1.4, layer: "wallLayers" }       // the floor's gold, row 3
      );
    }
    ctx.shared.modelButtons = ctx.shared.modelButtons || [];
    ctx.shared.modelButtons.push({
      id: "wallLayers",
      label: "הצג את שכבות הקיר והרצפה",
      labelOn: "הסתר את שכבות הקיר",
      title: "שכבות הקיר והרצפה בחתך מדורג: קיר האבן (מלכים א ו, ז), עליו לוחות ארז מגולפים (ו, טו; ו, יח — 'הכל ארז אין אבן נראה') " +
        "ועליהם ציפוי זהב (ו, כא–כב). רש״י ו, טו: 'קירות ארז אצל קיר האבן, כדי לטוח עליו זהב... ואי אפשר לטוח זהב על גבי האבנים, כי אם " +
        "בעצים ובמסמרות'. הרצפה: אבן, צלעות ברושים (ו, טו) וזהב (ו, ל). החתך להמחשה בלבד — בבית הכל זהב.",
      // before the stepped window. 1.0.1-L (L.31; A15: this part is gold now, the pill stays where the default view finds it): its upper WEST part (x -20.7, y 24.6), clear of the labels in the frontal
      // view - the part of the north wall that the entrance view (flyPoints.heichalDoor, from the ulam) sees through the doorway (x < -15.5)
      anchor: [WL.x0 + 0.8, F + WL.rh * 3.6, -HW + 0.9],
      maxDist: 60,
      get: () => ctx.shared.wallLayers.on,
      set: (on) => ctx.shared.wallLayers.set(on)
    });

    // ---- the vessels of the kodesh (I Kings 7:48-49; II Chr 4:7-8, 4:19-20; Menachot 98b-99a with Rashi) ----
    // Baraita (Menachot 98b): "של משה באמצע, חמש מימינו וחמש משמאלו"; all the tables in the north, all the menorot in the south, all in
    // the inner half of the hall (x_r 20..40, "מחצי הבית ולפנים"; Rambam Beit HaBechira 3:17 "משליש ההיכל ולפנים" = the same 20 amot).
    // Rabbi: the vessels lie east-west ("מזרח ומערב"); R. Elazar b. R. Shimon: north-south ("צפון ודרום"). Gemara 99a: two rows of five,
    // Moses' table drawn west "כתלמיד היושב לפני רבו" (Rashi); 2.5 from the north wall and 2.5 between the rows = a passage for two
    // priests (Rashi 99a, after Menachot 98b on the ark's staffs). Rambam 3:12 rules like Rabbi for the table.
    // 1.0.1-K (K.4): LAMP_R 0.28 -> 0.27 so that, in the north-south layout, the five menorot of a column fit between the last table and the
    // gold skin of the south wall (with 0.28 the end cups went 0.17 into the skin; review K.4)
    const LAMP_R = 0.27;                   // lamp pitch: 7 lamps over ~1.6 amot (the spread is a model choice) so five menorot fit a 10-amah row

    // ---- 1.0.1-K (K.4): THE TABLES, rebuilt (the user: "שלחנות, חייבים תיקון משמעותי" - they looked like chairs) ----
    // The table (Ex 25:23-25 with Rashi; Mishnah Menachot 11:5-6; Menachot 94b-97a with Rashi); Solomon's ten tables (II Chr 4:8 "ויעש שלחנות
    // עשרה וינח בהיכל חמשה מימין וחמשה משמאול") have no measures: model choice = Moses' table. All in the table's own frame: x along its length,
    // z across it, y up from the floor (the layouts turn it: Rabbi east-west - Mishnah Menachot 11:6 "כל הכלים שהיו במקדש, ארכן לארכו של בית").
    //  - 2 x 1 amot (Ex 25:23; R. Meir, Mishnah 11:5: 12 x 6 tefachim; Rambam Beit HaBechira 3:12 "השלחן היה ארכו שנים עשר טפח ורחבו ששה
    //    טפחים. והיה מנח ארכו לארך הבית"; 3:13 the four סניפין), 1.5 to the top surface (Ex 25:23 "ואמה וחצי קמתו"; Rashi "גבה רגליו
    //    עם עבי השלחן"); four legs; the board 0.08 thick and the legs 0.12 square (model choice).
    //  - "מסגרת טפח סביב" (Ex 25:25), a tefach high, with its gold crown "זר זהב" (Ex 25:24-25; Rashi: "הוא זר האמור למעלה... שעל המסגרת היתה").
    //    Rashi brings two views of the frame: "למעלה היתה סביב לשלחן כמו לבזבזין" or "למטה היתה תקועה מרגל לרגל... ודף השלחן שוכב על אותה
    //    מסגרת". The book (p21L, the user's reference) draws a decorated band right under the board - the second view, built here: the frame
    //    from leg to leg under the board, the crown a band of rosettes on it (its pattern: model choice).
    //  - the bread (Lev 24:6: two stacks of six): each loaf 10 x 5 tefachim, its "horns" 7 fingers (Mishnah 11:4); "כמין תיבה פרוצה" (R.
    //    Chanina, Menachot 94b; Rashi there "ושתי דופנותיה זו כנגד זו כך הלחם היו לו ב' דפנות ושוליים רחבים"; Rashi Ex 25:29 "שולים לו למטה, וקופל מכאן ומכאן
    //    כלפי מעלה כמין כתלים... ונותן ארכו לרחבו של שלחן, וכתליו זקופים כנגד שפת השלחן"). R. Meir (11:5): "נותן ארכו כנגד רחבו של שלחן, וכופל
    //    טפחים מכאן וטפחים מכאן וטפחים רוח באמצע" - each loaf lies ACROSS the table (6 tefachim of base + two walls of 2 folded up along the
    //    table's long edges) and the two stacks stand along its length with 2 tefachim of air between them (5 + 2 + 5 = 12). The horns:
    //    Rashi Menachot 96a "שהיה מדביק בצק לכל זוית כעין קרנים"; Gemara 96a "קרנות לגוויה דלחם כייף להו, ולחם עלייהו נח ליה" - at the four
    //    top corners of the walls, bent inward, 7 fingers long, the next loaf resting on them. A loaf every 2 tefachim: the tubes are sunk in
    //    the bread (Menachot 96b "קנים שקועי משקע להו"). The base and walls 0.5 tefach thick: model choice.
    //  - the two frankincense spoons (בזיכין = "כפתיו", Rashi Ex 25:29; Menachot 97a) in the gap between the stacks: Abba Shaul (Mishnah 11:5)
    //    "שם היו נותנין שני בזיכי לבונה"; the book draws them there. Their form (a cup 0.14 across with a ladle, white frankincense): model choice.
    //  - the four סניפין (Mishnah 11:6 "ארבעה סניפין של זהב היו שם, מפצלין מראשיהן... שנים לסדר זה ושנים לסדר זה"): STANDING ON THE FLOOR -
    //    Menachot 94b, R. Abba bar Mamal: for "תיבה פרוצה" "סניפין על גבי קרקע מונחין"; Rashi Ex 25:29 "עומדין בארץ וגבוהים עד למעלה מן השלחן
    //    הרבה, כנגד גבה מערכת הלחם, ומפצלים חמשה פצולים זה למעלה מזה, וראשי הקנים שבין לחם ללחם סמוכין על אותן פצולין"; Rashi Menachot 94b
    //    "העומדים בקרקע ארוכות וגבוהות עד לחם העליון סומכין הלחם שלא ישברו דופנותיו". Two per stack, one at each long side of the table, from
    //    the floor to the top of the stack, each with five branches (ledges under the five rows of tubes). Their width - as wide as the stack -
    //    follows the book, which draws them as two gold "towers" with the stacks between them (model choice).
    //  - the 28 tubes (Mishnah 11:6 "ועשרים ושמנה קנים, כחצי קנה חלול, ארבעה עשר לסדר זה"; Rashi Ex 25:29 "ומסדר ג' על ראש כל לחם, שישב
    //    לחם האחר על גבי אותן הקנים"; Rashi Menachot 94b "ראשו של קנה על דופן זה וראשו (של) אחר על דופן זה"; Menachot 97a "ארבעה חלות צריכות שלשה
    //    שלשה קנים, העליונה – אינה צריכה אלא שנים... התחתונה – אינה צריכה כל עיקר" with Rashi "תחת כל אחת ואחת"; "אחת מכאן ואחת מכאן ואחת
    //    באמצע"): under loaves 2-5 three each, under the top loaf two, none under the bottom one = 14 per stack, lying across the table from
    //    wall to wall and through the posts, so that their hollow ends show on the posts as dots (2 + 3 + 3 + 3 + 3, as the book draws them).
    // 1.0.1-L (L.46, the user: "השולחנות, אתה נורמלי? עשית אותם כשולחנות רגילים, מאין לך? למיטב ידיעתי הם היו כשלחן משה"; it replaces L.11):
    // ALL ELEVEN tables have exactly the form of Moses' table, as the book draws it (p21L) - the frame and crown, the two gold towers of
    // סניפין with their 28 tubes and the tube ends, the two spoons (כפות, Ex 25:29 "וכפתיו") between the towers. Only the bread follows the
    // opinion row, as before: on Moses' table in every reading, on the ten only for R. Elazar ben Shamua (Menachot 99a "על כולם היו מסדרין");
    // for the Tanna Kamma (99a "עשרה שלחנות עשה שלמה, ולא היו מסדרין אלא על של משה") the ten stand without bread, and so without the
    // frankincense in their spoons (it is put "על המערכת", Lev 24:7 - model choice). The first round-L try (L.11) gave the ten a thin
    // stake-and-branch rack instead of the towers: replaced.
    // Everything is instanced per table (a merged geometry x 11): the body (legs, board, frame), the crown; the rig (posts, branches, tubes),
    // the tube ends, the spoons; the bread and the frankincense.
    const TBL_TOP = 1.5, TBL_BOARD = 0.08, TBL_LEG = 0.12;
    const STACK_X = 3.5 * INT_TEF;          // 0.583: a stack's centre (1 tefach of the middle air + half of the loaf's 5)
    const LOAF_X = 2.5 * INT_TEF, LOAF_Z = 0.5, LOAF_T = 0.5 * INT_TEF, LOAF_H = 2 * INT_TEF;   // half-width 0.417 (5 tef.), half-length 0.5 (6 tef.)
    const HORN = 7 / 24;                    // 7 fingers (4 to a tefach)
    const POST_Z = 0.56, POST_T = 0.05, STACK_TOP = TBL_TOP + 6 * LOAF_H;   // the posts' plane; the top of the stacks 3.5 above the floor
    const TUBE_R = 0.03, TUBE_L = 2 * (POST_Z + POST_T / 2);               // the tubes run from the outer face of one post to the other's
    const tableGeo = (() => {
      const box = (arr, w, h, d, x, y, z) => { const b = uvWorldBox(new BoxGeometry(w, h, d), w, h, d); b.translate(x, y + h / 2, z); arr.push(b); };
      const put = (arr, geo, x, y, z) => { const c = geo.clone(); c.translate(x, y, z); arr.push(c); };   // a copy of a part made once
      const body = [], crown = [], rig = [], ends = [], bread = [], spoons = [], incense = [];
      const yB = TBL_TOP - TBL_BOARD, yF = yB - INT_TEF;                  // under the board (1.42), the frame's bottom (1.253)
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(body, TBL_LEG, yB, TBL_LEG, sx * (1 - TBL_LEG / 2), 0, sz * (0.5 - TBL_LEG / 2));
      box(body, 2, TBL_BOARD, 1, 0, yB, 0);
      for (const sz of [-1, 1]) box(body, 2 - 2 * TBL_LEG, INT_TEF, 0.05, 0, yF, sz * 0.475);      // the frame from leg to leg
      for (const sx of [-1, 1]) box(body, 0.05, INT_TEF, 1 - 2 * TBL_LEG, sx * 0.975, yF, 0);
      const cy = yF + (INT_TEF - 0.07) / 2;                                                  // the crown band, 0.07 high, 0.018 proud, around
      for (const sz of [-1, 1]) box(crown, 2.036, 0.07, 0.018, 0, cy, sz * 0.509);
      for (const sx of [-1, 1]) box(crown, 0.018, 0.07, 1, sx * 1.009, cy, 0);
      const loaf = [];                                                                        // one loaf, made once
      box(loaf, 2 * LOAF_X, LOAF_T, 2 * LOAF_Z, 0, 0, 0);
      for (const sz of [-1, 1]) {
        box(loaf, 2 * LOAF_X, LOAF_H, LOAF_T, 0, 0, sz * (LOAF_Z - LOAF_T / 2));                // the walls folded up along the long edges
        for (const hx of [-1, 1]) box(loaf, LOAF_T, 0.055, HORN, hx * (LOAF_X - LOAF_T / 2), LOAF_H - 0.055, sz * (LOAF_Z - LOAF_T - HORN / 2));   // the horns, bent inward
      }
      const loafG = mergeGeometries(loaf);
      const tubeG = new CylinderGeometry(TUBE_R, TUBE_R, TUBE_L, 8, 1, true); tubeG.rotateX(Math.PI / 2);
      const endG = new CircleGeometry(TUBE_R * 0.8, 10), endGb = endG.clone().rotateY(Math.PI);
      const post = [];                                                                        // a post (סניף), floor to the stack's top,
      box(post, 2 * LOAF_X - 0.012, STACK_TOP, POST_T, 0, 0, 0);
      for (let k = 0; k < 5; k++) box(post, 2 * LOAF_X - 0.06, 0.025, 0.03, 0, TBL_TOP + (k + 1) * LOAF_H - TUBE_R - 0.025, -(POST_T / 2 + 0.015));   // with its five branches on the inner face
      const postG = mergeGeometries(post), postGb = postG.clone().rotateY(Math.PI);           // for the +z side / the -z side
      for (const sx of [-1, 1]) {
        const xc = sx * STACK_X;
        for (const sz of [-1, 1]) put(rig, sz > 0 ? postG : postGb, xc, 0, sz * POST_Z);
        for (let i = 0; i < 6; i++) put(bread, loafG, xc, TBL_TOP + i * LOAF_H, 0);              // the six loaves of this stack
        for (let k = 0; k < 5; k++) {                                                           // 3 + 3 + 3 + 3 + 2 tubes
          const y = TBL_TOP + (k + 1) * LOAF_H;
          for (const dx of k < 4 ? [-0.27, 0, 0.27] : [-0.17, 0.17]) {
            put(rig, tubeG, xc + dx, y, 0);
            put(ends, endG, xc + dx, y, TUBE_L / 2 + 0.001);                                    // the hollow ends, dark dots on the posts
            put(ends, endGb, xc + dx, y, -TUBE_L / 2 - 0.001);
          }
        }
      }
      for (const sx of [-1, 1]) {                                                               // the two spoons in the air between the stacks
        const cup = new LatheGeometry([[0, 0], [0.062, 0], [0.07, 0.02], [0.058, 0.08], [0.07, 0.14], [0.066, 0.15], [0.058, 0.15], [0.052, 0.03], [0, 0.03]].map((q) => new Vector2(q[0], q[1])), 14);
        cup.translate(sx * 0.08, TBL_TOP, 0);
        spoons.push(cup);
        const ladle = new CylinderGeometry(0.008, 0.008, 0.24, 6);
        ladle.rotateX(0.32);
        ladle.translate(sx * 0.08, TBL_TOP + 0.16, -0.03);
        spoons.push(ladle);
        const mound = new SphereGeometry(0.052, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);         // "לבונה זכה" (Lev 24:7), white
        mound.scale(1, 0.55, 1);
        mound.translate(sx * 0.08, TBL_TOP + 0.13, 0);
        incense.push(mound);
      }
      const M2 = (a) => mergeGeometries(a);
      return { body: M2(body), crown: M2(crown), rig: M2(rig), ends: M2(ends), bread: M2(bread), spoons: M2(spoons), incense: M2(incense) };
    })();

    // ---- 1.3.3 (the user: "שלחנות באולם יש, רק צריך להוסיף לחם כמו שעשית" - as in the Second Temple plugin): THE TWELVE LOAVES ON THE
    // ULAM'S ENTRY TABLE (north: silver for R. Yose b. R. Yehuda, marble for the Mishnah) - "על של שיש נותנין לחם הפנים בכניסתו" (Shekalim
    // 6:4); Rashi Menachot 99a (book 2186, line 4710) "בכניסתו מניחו על של כסף וכשמגיע להיכל מסדר על של משה". The same loaves as on the
    // tables inside (tableGeo.bread: two stacks of six, their base at TBL_TOP 1.5 - the ulam's tables are 1.5 high too), without the
    // posts and the tubes, which belong to the golden table. The moment shown - the bread on its way in - is a model choice.
    {
      const UT = ctx.shared.ulamTables;
      if (UT && UT.entry && UT.group) {
        const m = new Matrix4().makeTranslation(UT.entry.x, UT.entry.floor + (UT.entry.top - UT.entry.floor - TBL_TOP), UT.entry.z);
        const br = new InstancedMesh(tableGeo.bread, breadMat, 1);
        br.setMatrixAt(0, m);
        br.castShadow = br.receiveShadow = true;
        br.name = "ulam-table-bread";
        UT.group.add(br);
      }
    }
    // ---- 1.0.1-L (L.73, the user: "תוסיף את כל הגביעים הכפתורים והפרחים שהיו במשכן (פר' תצוה)"; "ולכל מנורה בקנה היה פרח וכן בקנה
    // האמצעי למטה - עיין בספר"): THE MENORAH rebuilt with every cup, knob and flower of Ex 25:31-36, after the Baraita of its height -
    // Menachot 28b (Shmuel "משמיה דסבא"), Rashi Ex 25:35, Rambam Beit HaBechira 3:10 - and the book's menorah (p22). Menachot 28b: "גובהה
    // של מנורה שמנה עשר טפחים, הרגלים והפרח שלשה טפחים, וטפחיים חלק, וטפח שבו גביע וכפתור ופרח, וטפחיים חלק, וטפח כפתור. ושני קנים יוצאין
    // ממנו, אחד אילך ואחד אילך, ונמשכין ועולין כנגד גובהה של מנורה, וטפח חלק, וטפח כפתור ושני קנים יוצאין ממנו... וטפח חלק, וטפח כפתור ושני
    // קנים יוצאין ממנו... וטפחיים חלק, נשתיירו שם שלשה טפחים שבהן שלשה גביעין וכפתור ופרח"; "ונמצאו גביעין עשרים ושנים, כפתורים אחד עשר,
    // פרחים תשעה"; their forms: "גביעין... כמין כוסות אלכסנדריים, כפתורים... כמין תפוחי הכרתיים, פרחים... כמין פרחי העמודין". Rashi Ex 25:31:
    // "ירכה - הוא הרגל שלמטה העשוי כמין תבה, ושלשה רגלים יוצאין הימנו ולמטה"; "גביעיה - הן כמין כוסות שעושין מזכוכית, ארכים וקצרים";
    // "כפתריה - כמין תפוחים היו, עגלין סביב, בולטין סביבות הקנה האמצעי"; "ופרחיה - ציורין עשוין בה כמין פרחין"; 25:33 "שלשה גבעים - בולטין
    // מכל קנה וקנה", "כפתר ופרח - היה לכל קנה וקנה"; 25:34 "בגופה של מנורה היו ארבעה גביעים – אחד בולט בה למטה מן הקנים, והשלשה למעלה
    // מן יציאת הקנים"; 25:35 "וכפתר תחת שני הקנים - מתוך הכפתור היו הקנים נמשכים משני צדיה אילך ואילך" and "הרגלים והפרח שלשה טפחים – הוא
    // הפרח האמור בירך, שנאמר עד ירכה עד פרחה" - the lowest flower, on the shaft right above the base: the user's "בקנה האמצעי למטה"; the
    // flower of every branch: "כפתר ופרח היה לכל קנה וקנה" - the user's "בקנה היה פרח".
    // Built in tefachim exactly as the Baraita (18 = 3 amot; MEN_T = 1/6): the base a box with three feet under it (y 0..0.3) and the lowest
    // flower on the shaft (0.3..0.5); 2 plain; the cup, knob and flower of the 6th tefach (0.833..1); 2 plain; the three knobs in the 9th, 11th
    // and 13th tefach (centres 1.417, 1.75, 2.083), from each a pair of branches, the lowest pair outermost, straight ("נמשכין ועולין", as
    // Rashi's tradition and the book draw them; Rashi 25:32 "לכאן ולכאן באלכסון, נמשכים ועולין עד כנגד גבהה של מנורה... התחתון ארך, ושל מעלה קצר
    // הימנו, והעליון קצר הימנו") up to the menorah's height; 2 plain; the three cups, knob and flower of the last three tefachim
    // (2.5..3); on every branch its three cups, knob and flower along its last three tefachim; the seven lamps on top (3..3.16; the flames
    // above them). Count: cups 4 + 6 x 3 = 22, knobs 2 + 3 + 6 = 11, flowers 1 + 2 + 6 = 9. The ornaments' profiles, the base 0.9 x 0.5 x 0.2,
    // the shaft 0.08 and the branches 0.064 thick, the lamps' pitch LAMP_R: model choices. ONE merged geometry, instanced eleven times per
    // layout (one draw call).
    // 1.0.1-L (verifier of L.73): 8 of the 11 knobs were invisible - the knob of each branch (radius 0.045) inside its branch (0.045), those of
    // the 6th and the last tefach of the shaft (0.029, 0.045) inside the shaft (0.055). Now, as the book draws them (p22): thinner branches and
    // shaft, so the ornaments stand out; on the branches and the shaft's top three cups 0.095 long, a round knob and a flower in the 3 tefachim;
    // in the 6th tefach the cup on the shaft with its knob and flower BESIDE it, all in that one tefach ("טפח שבו גביע וכפתור ופרח"), the
    // knob the size of the three that carry the branches (Rambam on Mishnah Menachot 3:7: "ודע שכל הכפתורים שיעור א' לכולן"); the flowers
    // with petals (the book's rosettes; there: "ופרח צורת שושן"; Rambam Beit HaBechira 3:9 "שהן כמין קערה ושפתה כפולה לחוץ"), the lowest one
    // at the foot of the shaft the largest (the book). The almond work on all of them: Ex 25:33-34 "משקדים"; Rashi 25:33 "מצירים היו, כדרך
    // שעושין לכלי כסף וזהב"; Rambam 3:2 "והכל משקדים כמו שקדים בעשיתן" (int_almondTex: the ornaments' uvs, the plain parts on its ground).
    // 1.0.1-L (L.71, the user: "תוסיף לכל המנורות 3 מעלות כביאור הפס' בתצוה"): THE STONE OF THREE STEPS before every menorah - Mishnah Tamid
    // 3:9 "ואבן היתה לפני המנורה ובה שלש מעלות, שעליה הכהן עומד ומטיב את הנרות. והניח את הכוז על מעלה שניה ויצא"; Rambam Beit HaBechira 3:11
    // "ואבן היתה לפני המנורה ובה שלש מעלות שעליה כהן עומד ומיטיב את הנרות ומניח עליה כלי שמנה ומלקחיה ומחתותיה בשעת הטבה"; the steps are
    // read out of the Torah's "העלאה" of the lamps: Sifrei Beha'alotcha "בהעלותך את הנרות עשה לה מעלות", "מכאן אמרו אבן היתה לפני המנורה
    // ובה שלש מעלות שהכהן עומד ומטיב את הנרות"; Rashi Num 8:2 "ועוד דרשו רבותינו מכאן שמעלה היתה לפני המנורה, שעליה הכהן עומד ומטיב (ספרי)";
    // Bartenura Tamid 3:9: "לפי שהמנורה גבוהה שמנה עשר טפחים והיה צריך לעלות למקום גבוה כדי להיטיב את הנרות" and "ובה שלש מעלות. כנגד
    // שלש העלאות שכתובות במנורה, בהעלתך את הנרות, והעלה את נרתיה, להעלת נר תמיד" (the third is Tetzaveh, Ex 27:20 - the user's "ביאור
    // הפס' בתצוה"; on that verse itself: Zevach HaShelamim, "שאחז"ל מכאן שאבן היתה לפני המנורה ובה שלש מעלות"; Be'er Sheva Tamid 30b; Malbim Num
    // 8:3). The stone: 1.2 wide (room for the priest; a stone as wide as the row of lamps, 1.9, joined with its neighbours' into
    // grey benches in the room's views), three steps 0.4 deep and a third high, rising to 1 amah against the base, of the house's hewn stone
    // (M.stone; 1.0.1-L, A19, his decision: now as Yalkut Me'am Lo'ez, Bamidbar: "ואבן זו היתה של שיש טהור, ויותר נאה מן הזהב, וגובהה ח׳ טפחים ומחצה, וארכה ט׳
    // טפחים": marble, 8.5 tefachim high = 1.417, 9 long = 1.5, read as the run of the three steps, three equal rises and treads of 0.5; the 1.2 across: model choice). 1.0.1-L (verifier): ITS SIDE IS IN THE SOURCES - Ma'asei LaMelech on Rambam 3:11: lamps
    // east-west (Rabbi) "א"כ אבן זה לצד צפון הי' עומד... ע"כ אבן זה הי' עומד בצפון המנורה" (so the Tzemach Tzedek, OC part 1, siman 67: standing on it the
    // eastern lamps are on the priest's left); lamps north-south (R. Elazar b. R. Shimon, the Rambam), the Yaavetz there: "א"כ אבן זו לצד
    // מערב המנורה עומדת כי נר האמצעי הוא נקרא נר המערבי מפני שפיו פונה למערב". So: north of the menorah for Rabbi, as the book draws it (p22), and
    // WEST of it for R. Elazar b. R. Shimon (the first round-L try had it east, "toward the entrance"): the same local side in both layouts.
    // One merged geometry, instanced with the menorot.
    const MEN_T = INT_TEF;
    const menorahGeo = (() => {
      const parts = [], steps = [], UPV = new Vector3(0, 1, 0);
      // orn = an ornament (it keeps its uvs: the almond work); the plain parts all sit on the ground of int_almondTex
      const add = (geo, x, y, z, q, orn) => {
        if (!orn) { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.01, 0.01); }
        if (q) geo.applyQuaternion(q);
        geo.translate(x, y, z);
        parts.push(geo);
      };
      const lathe = (prof, seg) => new LatheGeometry(prof.map((p) => new Vector2(p[0], p[1])), seg);
      // the ornaments, each about its own foot at y 0, h high: a cup (a narrow goblet opening upward), a knob (an apple, radius r), a flower (a
      // calyx opening upward, its lip turned out, cut into six petals; s scales its width)
      const cup = (h) => lathe([[0, 0], [0.026, 0], [0.026, h * 0.3], [0.042, h * 0.6], [0.068, h * 0.92], [0.076, h], [0.06, h], [0.034, h * 0.7], [0.018, h * 0.42], [0, h * 0.4]], 10);
      const knob = (h, r) => { const s = new SphereGeometry(1, 12, 8); s.scale(r, h / 2, r); s.translate(0, h / 2, 0); return s; };
      const flower = (h, s = 1) => {
        const f = lathe([[0, 0], [0.04 * s, 0], [0.042 * s, h * 0.4], [0.082 * s, h * 0.8], [0.105 * s, h], [0.09 * s, h], [0.062 * s, h * 0.78], [0.044 * s, h * 0.5], [0, h * 0.48]], 18);
        const p = f.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i), t = Math.min(1, Math.max(0, (y / h - 0.35) / 0.65)), c = Math.cos(6 * Math.atan2(x, z));
          p.setXYZ(i, x * (1 + 0.26 * t * c), y + 0.14 * h * t * (c - 1) / 2, z * (1 + 0.26 * t * c));   // the petals: wider and higher at their tips
        }
        f.computeVertexNormals();
        return f;
      };
      const group3 = (top, up, q) => {                                   // the last three tefachim (0.5) under a lamp: three cups, a knob, a flower
        const at = (d, g) => add(g, top.x - up.x * d, top.y - up.y * d, top.z - up.z * d, q, true);
        for (let i = 0; i < 3; i++) at(0.5 - 0.095 * i, cup(0.095));
        at(0.215, knob(0.125, 0.07));
        at(0.09, flower(0.09));
      };
      for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3 + Math.PI / 2; add(new CylinderGeometry(0.06, 0.075, 0.1, 8), Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.17); }   // the three feet
      add(new BoxGeometry(0.9, 0.2, 0.5), 0, 0.2, 0);                                  // the base "כמין תבה"
      add(flower(0.2, 1.35), 0, 0.3, 0, null, true);                                   // the lowest flower ("עד ירכה עד פרחה"), at the foot of the shaft
      add(new CylinderGeometry(0.04, 0.04, 2.7, 10), 0, 1.65, 0);                      // the shaft, y 0.3..3
      const KNOB_R = MEN_T / 2 * 1.05;                                                 // the knobs of one tefach: the 6th tefach's and the three that carry the branches
      add(cup(MEN_T), 0, 5 * MEN_T, 0, null, true);                                    // the 6th tefach: the cup on the shaft, its knob and its flower beside it (the book)
      add(knob(MEN_T, KNOB_R), -0.12, 5 * MEN_T, 0, null, true);
      { const f6 = flower(0.14, 0.7); f6.rotateZ(-Math.PI / 2); add(f6, 0.035, 5.5 * MEN_T, 0, null, true); }
      group3(new Vector3(0, 3, 0), UPV, null);                                         // the shaft's last three tefachim
      const LAMPX = [3, 2, 1].map((i) => i * LAMP_R);
      [8, 10, 12].forEach((t, k) => {                                                  // the knobs of the 9th, 11th, 13th tefach and their pairs
        const yk = (t + 0.5) * MEN_T;
        add(knob(MEN_T, KNOB_R), 0, yk - MEN_T / 2, 0, null, true);
        for (const sx of [-1, 1]) {
          const root = new Vector3(0, yk, 0), top = new Vector3(sx * LAMPX[k], 3, 0), up = top.clone().sub(root), len = up.length();
          up.normalize();
          const q = new Quaternion().setFromUnitVectors(UPV, up);
          add(new CylinderGeometry(0.032, 0.032, len, 8), (root.x + top.x) / 2, (root.y + top.y) / 2, 0, q);   // the straight branch
          group3(top, up, q);                                                          // its three cups, knob and flower
        }
      });
      for (const dx of [-3, -2, -1, 0, 1, 2, 3]) add(new CylinderGeometry(0.13, 0.08, 0.16, 8), dx * LAMP_R, 3.08, 0);   // the seven lamps ("נרתיה")
      const sbox = (w, h, d, y, z) => { const b = uvWorldBox(new BoxGeometry(w, h, d), w, h, d); b.translate(0, y + h / 2, z); steps.push(b); };
      const ST_R = 8.5 * MEN_T / 3;                                                    // A19: a third of 8.5 tefachim
      sbox(1.2, ST_R, 1.5, 0, -1.05);                                                  // the three steps (L.71; A19): treads 0.5 from z -0.3 outward, 9 tefachim in all
      sbox(1.2, ST_R, 1, ST_R, -0.8);
      sbox(1.2, ST_R, 0.5, 2 * ST_R, -0.55);
      return { body: mergeGeometries(parts), steps: mergeGeometries(steps) };
    })();

    // ---- 1.0.1-K (K.4): מזבח הזהב / מזבח הקטרת, with its LAYERS (the user: "וכן במזבח הקטורת... שכחת בכלל לעשות אותו"; "אינו מוצג אצלך כזהב") ----
    // 6:20 "ויצף מזבח ארז" - Rashi "הוא מזבח הקטרת"; 6:22 "וכל המזבח אשר לדביר צפה זהב"; 7:48 "את מזבח הזהב". Its making: Metzudat David 6:20
    // "ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב, והיה אם כן מעשה המזבח דומה למעשה קירות הבית"; Ralbag 6:22 "צפה מזבח הקטרת באבנים וצפהו עצי
    // ארז כמו שעשה בקירות הבית... ואחר כן צפה אותם זהב"; Radak 6:20 (Targum "וחפא מדבחא נסרין דארזא") "ואפשר שהיה מאבנים"; Metzudat David 6:22
    // "בכל ששת השטחים". Its place: Radak 6:22 "ומזבח הקטרת ממוצע ביניהם ומשוך קמעא כלפי חוץ וזה מכוון כנגד פתח הדביר" (the layouts below). Its
    // size is not given in Kings: 1 x 1 - Rambam Beit HaBechira 3:17 "מזבח הקטרת היה מרבע אמה על אמה... משוך בין השלחן והמנורה לחוץ"; the
    // crown Ex 30:3 "ועשית לו זר זהב סביב" (Rashi "סימן הוא לכתר כהנה") as a rail of rings on the rim of its roof (Ex 30:3 "את גגו", Rashi
    // "זה היה לו גג"; the book p07R); the horns 0.18 square, the cedar 0.12 and the gold 0.03 thick (model choices). 1.0.1-L (L.13, the user:
    // "אמה"): the height is ONE amah - the user's decision (K.4 took the Mishkan's two, Ex 30:2 "ואמתים קמתו"); 1 x 1 x 1 as the book draws it
    // (p07R, nearly a cube), the horns within that amah - Ex 30:2 "ממנו קרנתיו", of one piece with the altar: their tops 1 amah above the
    // floor, the roof a tefach lower (5/6; the horns a tefach high: model choice), the crown on the roof's edge. THE LAYERS (ctx.shared.
    // incenseAltar.layers + an on-model button): the gold of the upper south half is taken off (the cedar boards show, recessed under the gold -
    // the two south horns are cedar), and windows in the cedar boards show the stone core - like the book's cutaway (p07R; and its wall p06).
    // 1.2.8 (the user): the golden altar two amot high - Ex 30:2 "ואמתים קמתו" (was 1, a model choice)
    const ALT_W = 1, ALT_TOP = 2, ALT_HORN_H = INT_TEF, ALT_H = ALT_TOP - ALT_HORN_H, ALT_HORN = 0.18, ALT_CEDAR = 0.12, ALT_GOLD = 0.03;
    const ALT_CUT = 0.3;                    // 1.0.1-L: the layers' cut (K.4: 0.65 of 2) - below it the south half keeps its gold, as the book (p07R)
    const buildIncenseAltar = (parent, ax, az) => {
      const out = { plain: [], layers: [] };
      const hw = ALT_W / 2, hp = hw - ALT_HORN / 2, ci = hw - ALT_GOLD, si = ci - ALT_CEDAR, ct = ALT_H - ALT_GOLD, st = ct - ALT_CEDAR;
      const A = { gAlways: [], gPlain: [], gCut: [], cedar: [], stone: [], fAlways: [], fPlain: [] };
      const box = (arr, w, h, d, x, y, z) => { const b = uvWorldBox(new BoxGeometry(w, h, d), w, h, d); b.translate(ax + x, FL + y + h / 2, az + z); arr.push(b); };
      box(A.gPlain, ALT_W, ALT_H, ALT_W, 0, 0, 0);                                       // the whole altar, gold
      for (const sx of [-1, 1]) {
        box(A.gAlways, ALT_HORN, ALT_HORN_H, ALT_HORN, sx * hp, ALT_H, -hp);               // the north horns (Ex 30:2 "ממנו קרנתיו")
        box(A.gPlain, ALT_HORN, ALT_HORN_H, ALT_HORN, sx * hp, ALT_H, hp);                 // the south horns, gold
        box(A.cedar, ALT_HORN - 0.03, ALT_HORN_H, ALT_HORN - 0.03, sx * hp, ct, hp);       // ... or cedar, in the layers view
      }
      const FH = 0.09, FT = 0.012, FL2 = ALT_W - 2 * ALT_HORN, fz = hw - FT / 2 - 0.004;   // the crown rail between the horns
      box(A.fAlways, FL2, FH, FT, 0, ALT_H, -fz);
      box(A.fPlain, FL2, FH, FT, 0, ALT_H, fz);
      for (const sx of [-1, 1]) {
        box(A.fAlways, FT, FH, FL2 / 2, sx * fz, ALT_H, -FL2 / 4);
        box(A.fPlain, FT, FH, FL2 / 2, sx * fz, ALT_H, FL2 / 4);
      }
      box(A.gCut, ALT_W, ALT_H, hw, 0, 0, -hw / 2);                                      // layers: the gold of the north half,
      box(A.gCut, ALT_W, ALT_CUT, hw, 0, 0, hw / 2);                                     // and of the south half below the cut
      box(A.cedar, 2 * ci, ALT_CEDAR, ci, 0, st, ci / 2);                                // the cedar top board (south half)
      // the windows in the boards show the stone. 1.0.1-L: in the 1-amah altar; (verifier of L.13) the south one larger, nearly the whole board, so that
      // the stone core reads as the book's cutaway (p07R: the block standing in the opened cedar) - the first try's 0.5 x 0.24 hid behind its label
      const wy0 = 0.34, wy1 = 0.655;
      const board = (alongX, fixed) => {                                                 // a board in the cut region with a window
        const lo = alongX ? -ci : 0, hi = alongX ? ci : si, w0 = alongX ? -0.34 : 0.06, w1 = alongX ? 0.34 : 0.29;
        const piece = (a0, a1, y0, y1) => {
          if (alongX) box(A.cedar, a1 - a0, y1 - y0, ALT_CEDAR, (a0 + a1) / 2, y0, fixed);
          else box(A.cedar, ALT_CEDAR, y1 - y0, a1 - a0, fixed, y0, (a0 + a1) / 2);
        };
        piece(lo, w0, ALT_CUT, st); piece(w1, hi, ALT_CUT, st); piece(w0, w1, ALT_CUT, wy0); piece(w0, w1, wy1, st);
      };
      board(true, (si + ci) / 2);                                                        // the south board
      for (const sx of [-1, 1]) board(false, sx * (si + ci) / 2);                        // the east and west boards (their south halves)
      box(A.stone, 2 * si, st - ALT_CUT, si, 0, ALT_CUT, si / 2);                        // the stone core
      const mesh = (geos, mat, list, shadow = true) => {
        const m = new Mesh(mergeGeometries(geos), mat);
        m.castShadow = m.receiveShadow = shadow;
        parent.add(m);
        if (list) list.push(m);
        return m;
      };
      mesh(A.gAlways, goldAltar, null);
      mesh(A.fAlways, fretMat, null, false);
      mesh(A.gPlain, goldAltar, out.plain);
      mesh(A.fPlain, fretMat, out.plain, false);
      mesh(A.gCut, goldAltar, out.layers);
      mesh(A.cedar, cedarBoards, out.layers);
      mesh(A.stone, altarStone, out.layers);
      for (const m of out.layers) m.visible = false;
      return out;
    };

    const layouts = {};
    function buildLayout(key, spec) {
      const lg = new Group();
      lg.name = "kodesh-" + key;
      g.add(lg);
      const out = { key, group: lg, ten: [], flameSets: [], light: null, smoke: [], altar: spec.altar };
      // --- the tables (K.4, see tableGeo above): one instance per table. 1.0.1-L (L.46): the body, the crown, the towers (rig), the tube ends
      // and the spoons on all eleven - every table in the form of Moses' table; the bread and the frankincense on the ten only for R. Elazar
      // ben Shamua (99a), on Moses' table always ---
      const tables = spec.tables.map((t) => Object.assign({ moses: false }, t)).concat([Object.assign({ moses: true }, spec.mosesTable)]);
      const tM = tables.map((t) => int_part(t.x, FL, t.z, t.rot, 0, 0, 0));
      const tenM = tM.filter((m, i) => !tables[i].moses), mosesM = tM.filter((m, i) => tables[i].moses);
      int_inst(lg, tableGeo.body, tableGold, tM);
      int_inst(lg, tableGeo.crown, crownMat, tM, false);
      int_inst(lg, tableGeo.rig, tableGold, tM);
      int_inst(lg, tableGeo.ends, tubeEndMat, tM, false);
      int_inst(lg, tableGeo.spoons, tableGold, tM, false);
      out.ten.push(int_inst(lg, tableGeo.bread, breadMat, tenM, false), int_inst(lg, tableGeo.incense, incenseMat, tenM, false));
      int_inst(lg, tableGeo.bread, breadMat, mosesM, false);           // Moses' table: all opinions (99a "לא היו מסדרין אלא על של משה")
      int_inst(lg, tableGeo.incense, incenseMat, mosesM, false);
      // --- menorot (1.0.1-L, L.73: ONE merged geometry with every cup, knob and flower - menorahGeo above; L.71: the stone of three steps
      // before each one; the flames stay their own instanced mesh, animated below). 3 amot high (Menachot 28b, Rambam 3:10: 18 tefachim);
      // gold (I Kings 7:49) ---
      const flameG = new ConeGeometry(0.08, 0.3, 8);
      flameG.translate(0, 0.15, 0);
      const lampX = [-3, -2, -1, 0, 1, 2, 3].map((i) => i * LAMP_R);
      const menM = [], stepM = [];
      const flamesTen = [], flamesMoses = [], baseTen = [], baseMoses = [];
      const menorot = spec.menorot.map((m) => Object.assign({ moses: false }, m)).concat([Object.assign({ moses: true }, spec.mosesMenorah)]);
      for (const m of menorot) {
        menM.push(int_part(m.x, FL, m.z, m.rot, 0, 0, 0));
        stepM.push(int_part(m.x, FL, m.z, m.rot, 0, 0, 0));              // the steps (L.71): north of it for Rabbi, west of it for R. Elazar b. R. Shimon (Ma'asei LaMelech)
        const c = Math.cos(m.rot), s = Math.sin(m.rot);
        for (const dx of lampX) {                                        // the flames in the seven lamps (the lamps end at 3.16; 1.0.1-L, verifier of L.73: the flames' feet in them - at 3.2 they hovered over the lamps)
          const b = { x: m.x + dx * c, y: FL + 3.14, z: m.z - dx * s, rot: m.rot };
          (m.moses ? baseMoses : baseTen).push(b);
          (m.moses ? flamesMoses : flamesTen).push(int_m4(b.x, b.y, b.z, 0, m.rot, 0));
        }
        if (m.moses) {                                                   // point light only for Moses' menorah (reference values)
          const pl = new PointLight(0xFFC06A, 16, 25, 2);
          pl.position.set(m.x + (m.lightDx || 0), FL + 4.6, m.z);
          lg.add(pl);
          out.light = pl;
        }
      }
      int_inst(lg, menorahGeo.body, menorahGold, menM);
      int_inst(lg, menorahGeo.steps, M.marble, stepM);                  // A19: "של שיש טהור" (Yalkut Me'am Lo'ez)
      const fTen = int_inst(lg, flameG, flameMat, flamesTen, false);      // lit only for R. Elazar ben Shamua ("בכולן היו מדליקין", 99a)
      const fMoses = int_inst(lg, flameG, flameMat, flamesMoses, false);  // Tanna Kamma: "לא היו מדליקין אלא בשל משה" (99a)
      out.ten.push(fTen);
      out.flameSets.push({ inst: fTen, base: baseTen }, { inst: fMoses, base: baseMoses });
      // --- מזבח הזהב (K.4, see buildIncenseAltar above): on the axis, "משוך קמעא כלפי חוץ", opposite the devir door (Radak 6:22; Rambam 3:17) ---
      // 1.0.1-L (L.52, the user: "מזבח הזהב היה מקומו ליד הפרוכת, או ליד פתח ההיכל?"): the sources put it in the inner half of the heichal
      // before the devir - Ex 30:6 "ונתתה אתו לפני הפרכת אשר על ארן העדת" (Rashi: "לפני הכפרת מכון כנגד הארון מבחוץ"); Rambam Beit HaBechira
      // 3:17 "והוא נתון בהיכל מכון בין הצפון לדרום משוך בין השלחן והמנורה לחוץ. ושלשתן היו מנחין משליש ההיכל ולפנים כנגד הפרכת המבדיל בין
      // הקדש ובין קדש הקדשים"; Menachot 98b "מחצי בית ולפנים היו מונחין" (= "משליש הבית" counting the devir: 20 amot from the entrance
      // inward); Rashi Ex 26:35 "ומזבח הזהב נתון כנגד אויר שבין שלחן למנורה משוך קמעא כלפי המזרח, וכלם נתונים מן חצי המשכן ולפנים";
      // Metzudat David 6:22 "אשר לדביר. העומד סמוך להדביר"; Radak 6:22 "וזה מכוון כנגד פתח הדביר". Among the three it stood a little toward the
      // entrance: Yoma 33b "מזבח ממוצע ועומד באמצע ומשוך כלפי חוץ קימעא" (Rashi: "כלפי מזרח לצד פתח ההיכל"), "וכי עייל להיכל — במזבח פגע
      // ברישא". The first round-L try set it just east of Moses' table (x_r 35.5 / 32). 1.0.1-L (L.69), THE USER'S DECISION (31.10.2026):
      // "מזבח הזהב היה יותר קרוב לאולם מיד אחרי השולחנות והמנורות" - the altar stands nearer the ulam, immediately EAST of the rows of the
      // tables and the menorot, on the axis (z 0, opposite the ark and the doorway) - as the book draws it (p22: "מזבח הזהב" at the east end
      // between the two groups), and as Yoma 33b reads of the whole rows: it is the first vessel met from the entrance ("במזבח פגע ברישא"),
      // still "מחצי בית ולפנים" (x_r > 20). Rabbi: x_r 24.5 (x -28; its west face 1 amah east of the tables' east ends at x_r 26); R. Elazar
      // b. R. Shimon: x_r 28.25 (x -31.75; 0.75 east of the tables' east column). The gaps (1 / 0.75): model choices.
      // 1.0.1-L (L.52), the answer in short: NOT by the entrance and not touching the curtain - "לפני הפרכת" (Ex 30:6) tells its LINE, not its
      // distance: Rashi there "שמא תאמר משוך מכנגד הארון לצפון או לדרום, ת"ל לפני הכפרת מכון כנגד הארון מבחוץ"; its depth is the vessels'
      // - in the Mishkan at its middle (Rashi Ex 26:35 "המזבח והשלחן והמנורה משוכים מן הפתח לצד מערב עשר אמות (יומא ל"ג)"; Baraita deMelechet
      // HaMishkan "מן הפרוכת עד השלחן חמש אמות, מן השלחן עד מזבח הזהב חמש אמות, ממזבח הזהב עד העמודים שבמזרח עשר אמות"), in the house
      // "מחצי בית ולפנים" / "משליש הבית ולפנים" (Menachot 98b; Rashi there: "מונחין כל השולחנות ואין אחד מהן בחצי מן החיצון לצד הפתח"; Yerushalmi
      // Shekalim 6:3 "מזבח הזהב היה נתון באמצע הבית חולק את הבית מחציו ולפנים משוך קימעא כלפי הצפון" - DEV note: the Bavli and the Rambam have it
      // on the axis) - and among the three it is nearest the entrance (Yoma 33b). Radak 6:22 on why the verse calls it "המזבח אשר לדביר": "סמך המזבח לדביר
      // ואף על פי שלא היה בתוכו אלא בהיכל... ומזבח הקטרת ממוצע ביניהם ומשוך קמעא כלפי חוץ וזה מכוון כנגד פתח הדביר". Its measured place here
      // (15.5 / 11.75 amot before the curtain, 24.5 / 28.25 from the entrance) follows the user's decision (L.69) and the tables' places
      // (Menachot 99a with Rashi): model choice.
      const ax = spec.altar.x, az = spec.altar.z;
      out.altarParts = buildIncenseAltar(lg, ax, az);
      // 1.0.1-K (K.5): the coals on the altar and the column of the incense smoke rising straight to the ceiling (int_smokeParts above); the
      // coals in a small heap on the middle of the top, in its north half (which keeps its gold when the altar's layers are shown)
      {
        const cm = [];
        for (let i = 0; i < 7; i++) {
          const a = i * 2.39996, r = i ? 0.06 + 0.11 * Math.sqrt(i / 6) : 0, s = 0.75 + hash(i * 3.3 + 1) * 0.5;
          cm.push(int_m4(ax + Math.cos(a) * r, FL + ALT_H + 0.035 * s, az - 0.13 + Math.sin(a) * r * 0.8, hash(i) * 3, hash(i * 2) * 3, 0, s, s * 0.8, s));
        }
        const coals = int_inst(lg, smokeParts.coalGeo, smokeParts.coalMat, cm, false);
        const COAL = [0xff8a2a, 0xe8481a, 0x8a1e08, 0xffa040, 0x3a140a, 0xd0401a, 0x5a1a0a], col = new Color();
        for (let i = 0; i < 7; i++) coals.setColorAt(i, col.setHex(COAL[i]));
        // 1.0.1-L (L.53, the user: "עבה קצת עשן הקטורת שיהיה יותר ברור"): the column thicker - the core 0.26 over the coals widening to 0.72
        // under the ceiling (K.5: 0.12 -> 0.42), the halo 0.6 -> 1.5 (K.5: 0.32 -> 0.95), both denser (int_smokeParts: more and stronger wisps,
        // so it reads against the gold walls too, not only against the curtain); still perfectly straight, "כמקל" (Yoma 38a, 53a)
        const y0 = FL + ALT_H + 0.05, y1 = F + KH - 0.25, ht = y1 - y0;
        for (const [mat, w0, w1] of [[smokeParts.core, 0.26, 0.72], [smokeParts.halo, 0.6, 1.5]]) {
          const geo = new PlaneGeometry(1, ht, 1, 8);
          const p = geo.attributes.position;
          for (let i = 0; i < p.count; i++) { const tt = p.getY(i) / ht + 0.5; p.setX(i, p.getX(i) * (w0 + (w1 - w0) * tt)); }   // widening a little upward
          const m = new Mesh(geo, mat);
          m.position.set(ax, y0 + ht / 2, az - 0.13);
          m.castShadow = m.receiveShadow = false;
          m.renderOrder = 2;
          // 1.0.1-K review (interior-3): the smoke is no surface - the UI's measure tool and label clicks skip it (userData.noPick, the UI's
          // convention, as on the cloud's puffs), and no ray test sees it at all (the pills' and the cloud's occlusion tests, which count an
          // opaque-enough plane of 6 amot or more as a wall): its raycast does nothing
          m.userData.noPick = true;
          m.raycast = int_noRaycast;
          lg.add(m);
          out.smoke.push(m);
        }
      }
      layouts[key] = out;
      return out;
    }
    buildLayout("rabbi", {
      // Rabbi ("מזרח ומערב", Menachot 98b; default): the tables' length along the house (x). Rows at z_r 3 and 6.5 (Gemara 99a: 2.5 from
      // the north wall, 2.5 between the rows), centres x_r 27..35. 1.0.1-L (L.70, the user: "שלחן ומנורת משה היו בין 5 ל-5"): Moses' table
      // BETWEEN the two rows of five - Menachot 98b "אלא, של משה באמצע, חמשה מימינו, וחמשה משמאלו" (Rashi: "חמשה מימינו - בדרומו וחמשה
      // משמאלו בצפונו וכולן בצפון ההיכל") - and, as 99a settles it for this reading, not in their midst but drawn west, its head at the air
      // between the rows: "מי סברת שלחן דמשה בהדייהו הוה יתיב? לא, דמידלי ליה, ומנח ליה, ומיתתי להו לדידהו פורתא, כתלמיד היושב לפני רבו"
      // (Rashi: "שלא יהא מונח ביניהם ממש אלא משוך לצד מערב וראשו מכוון כנגד אויר שבין שתי השורות"; "ומיתתי ליה פורתא - מושיבם לצד מזרח
      // במקום נמוך") - so the book draws it (p22: the five and the five in two rows, Moses' at their head). Now x_r 37.5, z_r 4.75: its head
      // 0.5 west of the rows' ends (K.4: x_r 38; the 0.5: model choice). Menorot mirror the tables in the south (Radak 7:49 "אבל כל המנורות היו גם כן בדרום") with
      // the branches east-west (Rashi 98b: the western lamp = the outer west lamp). 1.0.1-L (L.73a, the user: "המנורות בצד דרום ומשוכות
      // קצת יותר לצד קה"ק מהשלחנות - עיין בספר"): the menorot ONE AMAH further west than the tables (x_r 28..36, Moses' 38.5) - the user's
      // decision, and it has a source (verifier of L.73a): Ralbag on I Kings 7:49 "הנה מפני שהשולחנות הם גם כן לפני הדביר ולא זכר זה אלא במנורות
      // ידענו שהמנורות יותר קרובות מקדש הקדשים מהשולחנות"; so the book (p22). Yoma 33b has the menorah "נכח השלחן" (Rashi there:
      // "זה בצד זה") - DEV note; the amah: model choice. 1.0.1-L (L.69, the user: "מזבח הזהב היה יותר קרוב לאולם מיד אחרי השולחנות
      // והמנורות"): the golden altar on the axis just EAST of the rows, x_r 24.5 - its west face 1 amah east of the tables' east ends (x_r 26)
      // and 2.3 east of the menorot's (the gap: model choice); the sources at the altar in buildLayout.
      tables: [27, 29, 31, 33, 35].flatMap((x_r) => [{ x: xr(x_r), z: zr(3), rot: 0 }, { x: xr(x_r), z: zr(6.5), rot: 0 }]),
      mosesTable: { x: xr(37.5), z: zr(4.75), rot: 0 },
      menorot: [28, 30, 32, 34, 36].flatMap((x_r) => [{ x: xr(x_r), z: zr(17), rot: 0 }, { x: xr(x_r), z: zr(13.5), rot: 0 }]),
      mosesMenorah: { x: xr(38.5), z: zr(15.25), rot: 0, lightDx: 5 },   // A20: its light 5 east of it (x -37): 2.9 from the south post of the devir it read 139.8 against the north post's 93.3, now 105.5 / 94.2
      altar: { x: xr(24.5), z: 0 }
    });
    buildLayout("rashbash", {
      // R. Elazar b. R. Shimon ("צפון ודרום", Menachot 98b): the tables' length across the house (z). Two columns of five at x_r 37 and 30
      // (99a: 2.5 from the west wall, 2.5 between each column and Moses' table), z_r 0..10; Moses' table between them at x_r 33.5 - 99a
      // "בשלמא למאן דאמר צפון ודרום, שפיר" (Rashi: "שורה מערבית משוכה מכותל מערבי שתי אמות ומחצה ואמה רוחב דשולחן ושתי אמות ומחצה בינו
      // ובין השלחן של משה"). 1.0.1-L (L.70): Moses' table in the MIDDLE of the columns' length too, z_r 5.22 (K.4: 3.5) - between the five
      // and the five (DEV note: Tosafot Menachot 98b has it "בין שתי השורות... ומשוך מכותל צפוני שתי אמות ומחצה", as K.4 stood it; Meiri on Yoma
      // 51b "ששלחן משה הכל מודים בו שארכו לאורך הבית" - the user's to decide). Menorot mirrored in the south, branches north-south (the middle
      // lamp faces west, Rashi 98b); 1.0.1-L (L.73a): one amah further west than the tables (x_r 38 and 31; Moses' 34.5, in the middle of the
      // columns' length, z_r 14.99); (L.69) the golden altar east of the columns on the axis, x_r 28.25 (0.75 east of the tables' east column;
      // model choice); the steps of the menorot (L.71) on their WEST side (the Yaavetz in Ma'asei LaMelech; at menorahGeo above).
      // 1.0.1-L (A17 + A18, his decisions): Moses' table as Tosafot Menachot 98b, "ושולחן דמשה בין שתי השורות שתי אמות ומחצה ממנו לשורה החיצונה ושתי אמות ומחצה ממנו לשורה
      // הפנימית ומשוך מכותל צפוני שתי אמות ומחצה" (z_r 2.5..3.5), and LENGTHWISE along the house as the Meiri on Yoma 51b, "ששלחן משה הכל מודים בו שארכו לאורך הבית ורחבו לרחב הבית"
      // (x_r 32..34, rot 0). Its length takes 2 where its breadth took 1, so to keep the 2.5 on both sides the east column moves 1 east (x_r 30 -> 29: from the west wall 2.5 + 1 +
      // 2.5 + 2 + 2.5 + 1 = 11.5), and with it what keeps its distance from it: the menorot's east column and Moses' menorah one amah further west than the tables (x_r 30, 34; L.73a),
      // the golden altar 0.75 east of the column (x_r 27.25; L.69). The notes above give the older places.
      // 1.0.1-K (K.4): five tables of 2 amot fill exactly the 10 amot from the north wall to the axis, but the wall's gold skin takes 0.2 of
      // them - the 1.0.1 tables went 0.2 into the skin - so the column starts 0.02 off the skin (z_r 0.22..10.22) and the five menorot of the
      // south half stand 1.9 apart from z_r 11.19 (their end cups 0.07 off the south skin; were 2 apart from z_r 11, 0.17 into it). Model choice.
      tables: [1.22, 3.22, 5.22, 7.22, 9.22].flatMap((z_r) => [{ x: xr(37), z: zr(z_r), rot: Math.PI / 2 }, { x: xr(29), z: zr(z_r), rot: Math.PI / 2 }]),
      mosesTable: { x: xr(33), z: zr(3), rot: 0 },
      menorot: [11.19, 13.09, 14.99, 16.89, 18.79].flatMap((z_r) => [{ x: xr(38), z: zr(z_r), rot: Math.PI / 2 }, { x: xr(30), z: zr(z_r), rot: Math.PI / 2 }]),
      mosesMenorah: { x: xr(34), z: zr(14.99), rot: Math.PI / 2 },
      altar: { x: xr(27.25), z: 0 }
    });

    // ---- 1.0.1-K (K.4): the layers of the incense altar: ctx.shared.incenseAltar.layers + an on-model button (FIXES K 0.5b, 0.5f) ----
    const altarLayerGroup = new Group();                 // gates the labels "אבן" / "ארז" / "זהב" (layer "altarLayers", FIXES K 0.5c)
    altarLayerGroup.name = "altarLayers";
    altarLayerGroup.visible = false;
    g.add(altarLayerGroup);
    ctx.layers.altarLayers = altarLayerGroup;
    const altarLayers = {
      on: false,
      set(on) {
        this.on = !!on;
        for (const k in layouts) {
          const P = layouts[k].altarParts;
          for (const m of P.plain) m.visible = !this.on;
          for (const m of P.layers) m.visible = this.on;
        }
        altarLayerGroup.visible = this.on;
      }
    };
    ctx.shared.incenseAltar = { layers: altarLayers };

    // labels of the vessels follow the layout (the UI makes one sprite per label; we move ours when the layout changes)
    const altarAt = (k, dx, y, dz) => { const a = layouts[k].altar; return [a.x + dx, FL + y, a.z + dz]; };   // 1.0.1-L (L.69): from the layouts' specs
    const vesselLabels = [
      // 1.0.1-K: "עשר המנורות" / "עשרה השולחנות" stand over the outer row (Rabbi) or the east column (R. Elazar b. R. Shimon), not on the line
      // between the aisle cameras and Moses' vessels, where they covered "מנורת משה" / "שולחן משה"
      // 1.0.1-L (L.70, L.73a): the vessels' new places; "עשר המנורות" of R. Elazar b. R. Shimon over the north end of the east column, out of
      // the menorot camera's way
      { text: "מנורת משה", size: 2, pos: { rabbi: [xr(38.5), FL + 4.6, zr(15.25)], rashbash: [xr(34), FL + 4.6, zr(14.99)] } },
      // 1.0.1-L (L.71): one label on the stone of Moses' menorah (Tamid 3:9): north of it (Rabbi), west of it (R. Elazar b. R. Shimon, where
      // the lamps run north-south)
      { text: "אבן שלוש המעלות (תמיד ג, ט)", size: 1.1, pos: { rabbi: [xr(38.5), FL + 1.7, zr(15.25) - 1.55], rashbash: [xr(34) - 1.55, FL + 1.7, zr(14.99)] } },
      { text: "עשר המנורות", size: 2.2, pos: { rabbi: [xr(32), FL + 6.2, zr(17)], rashbash: [xr(30), FL + 6.2, zr(11.19)] } },
      { text: "שולחן משה", size: 2, pos: { rabbi: [xr(37.5), FL + 4.6, zr(4.75)], rashbash: [xr(33), FL + 4.6, zr(3)] } },
      { text: "עשרה השולחנות", size: 2.2, pos: { rabbi: [xr(31), FL + 6.2, zr(3)], rashbash: [xr(29), FL + 6.2, zr(5.22)] } },
      // 1.0.1-L (L.13): the altar is 1 amah high now - its name 1.4 over the horns (as K.4's over the 2.2), the layer labels on the lower altar
      { text: "מזבח הזהב", size: 2, pos: { rabbi: altarAt("rabbi", 0, ALT_TOP + 1.4, 0), rashbash: altarAt("rashbash", 0, ALT_TOP + 1.4, 0) } },
      // the layers of the altar (shown with its layers): the stone in the south window, the cedar of the south board, the gold of the north half.
      // 1.0.1-L (verifier of L.13): the same places in both layouts - since L.69 both cameras (flyPoints.incenseAltar) look from the south-east, and
      // on the old west side of R. Elazar b. R. Shimon's layout the altar hid "זהב"; "אבן" low on the window's west side, off the stone
      { text: "אבן", size: 0.55, layer: "altarLayers", pos: { rabbi: altarAt("rabbi", -0.42, 0.42, 0.62), rashbash: altarAt("rashbash", -0.42, 0.42, 0.62) } },
      // 1.0.1-L (L.13): over the south edge of the cedar top board, in front of the horns (at 0.86 inside the altar a cedar horn hid it)
      { text: "ארז", size: 0.55, layer: "altarLayers", pos: { rabbi: altarAt("rabbi", 0.3, 1.02, 0.62), rashbash: altarAt("rashbash", 0.3, 1.02, 0.62) } },
      { text: "זהב", size: 0.55, layer: "altarLayers", pos: { rabbi: altarAt("rabbi", 0.62, 0.42, -0.25), rashbash: altarAt("rashbash", 0.62, 0.42, -0.25) } }
    ];
    for (const v of vesselLabels) {
      const p = v.pos.rabbi;
      v.obj = { text: v.text, x: p[0], y: p[1], z: p[2], size: v.size };
      if (v.layer) v.obj.layer = v.layer;
      ctx.labels.push(v.obj);
    }
    function moveLabels(key) {
      try {
        const grp = ctx.root.getObjectByName("labels");
        for (const v of vesselLabels) {
          const p = v.pos[key];
          if (!p) continue;
          if (grp) {
            // the UI keeps the label object on its sprite (userData.label); else: one sprite per label in the order of ctx.labels (labels
            // without text skipped) - find ours and check it is where we left it
            let spr = grp.children.find((s) => s.userData && s.userData.label === v.obj) || null;
            if (!spr) {
              let idx = 0;
              for (const l of ctx.labels) {
                if (!l || !l.text) continue;
                if (l === v.obj) { spr = grp.children[idx]; break; }
                idx++;
              }
              if (spr && !(spr.position && Math.abs(spr.position.x - v.obj.x) < 1e-6 && Math.abs(spr.position.y - v.obj.y) < 1e-6 &&
                Math.abs(spr.position.z - v.obj.z) < 1e-6)) spr = null;
            }
            if (spr) spr.position.set(p[0], p[1], p[2]);
          }
          v.obj.x = p[0]; v.obj.y = p[1]; v.obj.z = p[2];
        }
      } catch (e) { console.warn("[interior] moveLabels", e); }
    }
    // the fly points that follow the layout (FIXES K 0.5d): every camera inside the closed house with a clear line to its target (checked
    // with a ray test, review K.4). 1.0.1 had "shulchanot" and "menorot" outside the north / south wall (the user: the button of "שולחן משה"
    // showed the carvings).
    const FP_BY_LAYOUT = {
      rabbi: {
        shulchanot: { pos: [-29, 23, 3], target: [-41, 15, -4.6] },                 // from above the middle: Moses' table's long side and the two rows (1.2.2: 3 further back, the labels were cut)
        // 1.0.1-L (L.70): Moses' table close, from its EAST END along the aisle between the two rows (eye 3.4 above the floor): the loaves
        // "כמין תיבה פרוצה" are seen between the two towers only from the ends (K.4's south view saw the tower's plate), the table at the head
        // of the aisle "כתלמיד היושב לפני רבו"; the target on the east face of its east stack (x -40)
        shulchanMoshe: { pos: [-36.2, 15.8, -5.15], target: [-40, 14.45, -5.25] },
        menorot: { pos: [-29, 22, -2.5], target: [-42, 15, 5] },                     // the same, mirrored: the menorot's faces (branches east-west); 1.0.1-L: Moses' menorah at x -42; 1.2.2: 3 further back
        // 1.0.1-L (L.13): the altar of one amah from a standing eye (3 above the floor): its roof with the coals, the horns, the crown and
        // the south face (the opened side); K.4 looked at the 2-high altar's mid height. The target 0.05 before its south face (the ray test:
        // a target inside the altar counts as blocked)
        incenseAltar: { pos: [-25.5, 15, 2.1], target: [-28, 12.75, 0.55] }          // 1.0.1-L (L.69): the altar at x -28, just east of the rows
      },
      rashbash: {
        // 1.0.1-K review (interior-5): from above the corridor between the columns, south of Moses' table (1.0.1-K: [-34.6, 20.5, 2]), the camera
        // stood 2.3 from the axis of the incense column (the altar at x -35.5, z 0 in this layout) and looked through it at the table; now from
        // the south-west, over the south end of the west column: Moses' table's long (west) side, its two towers and both columns of tables, no
        // smoke in the frame (projection check), a clear ray to the target (just west of the table, between its סניפין), the camera 0.88 from
        // the nearest part - the PAROCHET's east face (x -43.38, |z| <= 3.45): the camera at x -42.5, z -3 stands right before it, and the
        // curtain is behind the camera, beyond the near plane (1.0.1-L: the round-K comment said 1.8; the round-K verifier measured 0.88 and
        // named the north devir doorpost - its nearest vertex, x -43.19 z -3.59, is 0.91 away) - model choice, checked in a picture. (The
        // skeptic's [-34.4, 20.5, -1.2], also
        // clear of the smoke, stands 4.3 from the label "עשרה השולחנות", which then covers "שולחן משה".)
        shulchanot: { pos: [-42.5, 19.5, -3], target: [-37.7, 13.9, -7] },                  // 1.0.1-L (A17): Moses' table now at x -37.5..-35.5, z -7
        // 1.0.1-L (L.70): Moses' table close, from its SOUTH END (the end toward the axis; its length runs north-south here), eye 3.3 above
        // the floor, between the two columns: the loaves seen between the towers (as in Rabbi's layout); the target on the south face of its
        // south stack (z -3.78)
        // 1.0.1-L (A18): the table lengthwise now: from its EAST END, as in Rabbi's layout, over the east column (the rig's top 15.57), the target on the face of its east stack
        shulchanMoshe: { pos: [-31.3, 17.4, -6.9], target: [-35.5, 14.45, -7] },
        // 1.0.1-L (L.73a): Moses' menorah (x -38, z 4.99) from the south-east above, 0.5 inside the south skin, over the east column (its lamps
        // 15.5, the ray 17.8 there)
        menorot: { pos: [-32.5, 19, 9.3], target: [-37.5, 15, 4.99] },   // A17: Moses' menorah at x -37.5
        // 1.0.1-L (L.69): the altar at x -31.75, east of the columns; from the south-east (the old south-west place is now among the lamps of the
        // east column's first menorah), its opened south face in view
        incenseAltar: { pos: [-28.5, 15.2, 2.3], target: [-30.75, 12.75, 0.55] }    // A17: the altar at x -30.75
      }
    };
    const setLayoutFlyPoints = (key) => {
      const fps = ctx.shared.flyPoints = ctx.shared.flyPoints || {};
      const src = FP_BY_LAYOUT[key];
      for (const k in src) {
        if (!fps[k] || !Array.isArray(fps[k].pos) || !Array.isArray(fps[k].target)) fps[k] = { pos: src[k].pos.slice(), target: src[k].target.slice() };
        else for (let i = 0; i < 3; i++) { fps[k].pos[i] = src[k].pos[i]; fps[k].target[i] = src[k].target[i]; }   // in place: holders of the object follow
      }
    };
    // 1.2.0 (the user): the incense smoke of every layout as one switch - the place "פתח הדביר" hides it for 15 s (70-ui.js)
    ctx.shared.incenseSmoke = {
      on: true,
      set(v) {
        this.on = !!v;
        for (const k in layouts) for (const m of layouts[k].smoke) m.visible = !!v;
      }
    };
    ctx.shared.kodeshLayout = {
      current: "rabbi",
      keys: ["rabbi", "rashbash"],
      set(key) {
        if (!layouts[key]) return;
        this.current = key;
        for (const k in layouts) layouts[k].group.visible = k === key;
        moveLabels(key);
        setLayoutFlyPoints(key);
      }
    };
    ctx.shared.modelButtons = ctx.shared.modelButtons || [];
    // 1.0.1-K review (interior-1): the UI calls anchor() every frame - one array, filled in place (no per-frame allocation)
    const altarAnchor = [0, 0, 0];
    ctx.shared.modelButtons.push({
      id: "incenseAltarLayers",
      label: "הצג את שכבות המזבח",
      labelOn: "הסתר את שכבות המזבח",
      title: "מזבח הזהב בשכבותיו: אבן, עליה לוחות ארז ועליהם ציפוי זהב — 'ויצף מזבח ארז' (מלכים א ו, כ), 'וכל המזבח אשר לדביר צפה זהב' (ו, כב); " +
        "מצודת דוד: 'ועשאו מאבנים, וארז ממעל, ועל הארז צפהו זהב'; רלב״ג ו, כב. הלחיצה מסירה את הזהב מחציו הדרומי העליון ופותחת חלונות בארז",
      anchor: () => {                                    // just east of the altar of the current layout, low (model choice, K.4)
        const a = layouts[ctx.shared.kodeshLayout.current].altar;
        altarAnchor[0] = a.x + 0.9;
        altarAnchor[1] = FL + 0.4;                       // 1.0.1-L (L.13): a little under the mid height of the 1-amah altar (K.4: 0.45 of 2)
        altarAnchor[2] = a.z - 0.2;
        return altarAnchor;
      },
      maxDist: 40,
      get: () => altarLayers.on,
      set: (on) => altarLayers.set(on)
    });
    ctx.shared.kodeshOpinion = {
      current: "tk",
      keys: ["tk", "rebs"],
      // 'tk': Tanna Kamma (Menachot 99a "עשר מנורות עשה שלמה, ולא היו מדליקין אלא בשל משה"; "עשרה שלחנות עשה שלמה, ולא היו מסדרין אלא על של
      // משה" - so R. Yose b. R. Yehuda of the tables)
      // 'rebs': R. Elazar ben Shamua ("על כולם היו מסדרין... ובכולן היו מדליקין"; Radak on 7:49 reads the verses so; DEV note: Rashi there "על
      // כולן היו מסדרין - פעמים בזה פעמים בזה" - one table at a time; the model shows the bread on all eleven, as the user chose)
      // 1.0.1-L (L.46): the ten tables keep the form of Moses' table in both readings; only their bread (and the lamps of the ten menorot)
      // follow the reading
      set(key) {
        if (key !== "tk" && key !== "rebs") return;
        this.current = key;
        for (const k in layouts) for (const m of layouts[k].ten) m.visible = key === "rebs";
      }
    };
    ctx.shared.kodeshLayout.set("rabbi");
    ctx.shared.kodeshOpinion.set("tk");
    {
      const sm = new Matrix4(), sp = new Vector3(), sq = new Quaternion(), se = new Euler(), ss = new Vector3();
      ctx.animated.push((t) => {
        for (const k in layouts) {
          const L = layouts[k];
          if (!L.group.visible) continue;
          for (const fs of L.flameSets) {
            if (!fs.inst.visible) continue;
            for (let i = 0; i < fs.base.length; i++) {
              const b = fs.base[i];
              const s = 1 + 0.28 * Math.sin(t * 0.012 + i * 1.9) * Math.sin(t * 43e-4 + i);
              sp.set(b.x, b.y, b.z);
              se.set(Math.sin(t * 9e-3 + i) * 0.1, b.rot, Math.cos(t * 0.011 + i * 2) * 0.1);
              sq.setFromEuler(se);
              ss.set(1, s, 1);
              fs.inst.setMatrixAt(i, sm.compose(sp, sq, ss));
            }
            fs.inst.instanceMatrix.needsUpdate = true;
          }
          if (L.light) L.light.intensity = 15.5 + 2.2 * Math.sin(t * 0.011) + 1.3 * Math.sin(t * 0.029 + 1);
          // 1.0.1-K (K.5): the smoke's planes turn about the vertical toward the camera (a column seen from any side; no allocation)
          const cam = ctx.camera;
          if (cam && cam.position) {
            const ang = Math.atan2(cam.position.x - L.altar.x, cam.position.z - (L.altar.z - 0.13));
            for (let i = 0; i < L.smoke.length; i++) L.smoke[i].rotation.y = ang;
          }
        }
        // the smoke flows upward (the wisps' texture offsets; shared by both layouts) and the coals glow
        smokeParts.coreMap.offset.y = -((t * 1.6e-4) % 1);
        smokeParts.haloMap.offset.y = -((t * 1.05e-4 + 0.37) % 1);
        const glow = 0.86 + 0.1 * Math.sin(t * 0.0042) + 0.05 * Math.sin(t * 0.0131 + 1.3);
        smokeParts.coalMat.color.setRGB(glow, glow, glow);
      });
    }

    // ---- רתוקות זהב (I Kings 6:21 "ויעבר ברתוקות זהב לפני הדביר"): bars of gold chains across the east face of the traksin wall ----
    // (Rashi "ויעבר. לשון בריחים", "ברתוקות. שלשלאות"; Radak; Metzudat David. Malbim: fixed in the stones under the gold, i.e. not visible - DEV note; Abarbanel
    // in Malbim: a lattice over an open space above a 20-high wall - DEV note). 4 bars at y 14, 20, 26, 32 (number, thickness: model choice);
    // the two lower bars stop at the devir doorway so the parochet hangs free (model choice).
    try {
      const bx = XW + 0.4;   // 0.4 before the traksin's kodesh face (was 0.3: review H2-INT-GEO-4 - the links of the y-26 bar cut 0.115 into the
                             // gable beams of the "five" reading, which stand 0.2 proud; now they clear them by 0.015)
      const linkG = new TorusGeometry(0.17, 0.045, 6, 12);
      const links = [];
      const bar = (y, z1, z2) => {
        const b = new Mesh(new CylinderGeometry(0.09, 0.09, z2 - z1, 8), M.gold);
        b.rotation.x = Math.PI / 2;
        b.position.set(bx, y, (z1 + z2) / 2);
        b.castShadow = true;
        g.add(b);
        let k = 0;
        for (let z = z1 + 0.2; z <= z2 - 0.2 + 1e-6; z += 0.36, k++)
          links.push(k % 2 ? int_m4(bx, y, z, Math.PI / 2, 0, 0) : int_m4(bx, y, z, 0, Math.PI / 2, 0));
      };
      const hz = INT_DEVIR_HOLE / 2 + 0.2;
      for (const y of [F + 2, F + 8]) { bar(y, -HW, -hz); bar(y, hz, HW); }
      for (const y of [F + 14, F + 20]) bar(y, -HW, HW);
      int_inst(g, linkG, M.gold, links, false);
    } catch (e) { console.warn("[interior] chains", e); }

    // ---- אמה טרקסין (Rashi on 6:16, 6:19; Yoma 51b-52a; Bava Batra 3a: 30 high and "שית פושכי" = 1 thick; 3b: it stood only "אגב תקרה
    // ומעזיבה"): stone (Malbim 6:21) or
    // wood (Rashi on II Chr 3:8) under the gold - the whole wall is gold (Radak 6:21), carved like the other walls (6:29 "כל קירות הבית");
    // the devir doorway is cut in it. 1.0.1-H (the user: "חסר אמה טרקסין מעל פתח הדביר"): the wall is now THREE plain boxes - the part above
    // the doorway (shared by both readings of the doorway) and the two piers beside it (built per reading, since their inner edges follow the
    // posts) - instead of one extruded wall with a hole, so that the part above the doorway is a solid, clearly visible piece on both sides,
    // with the carving pattern continued across the three pieces (1.0.1-K: world uvs, faceUV - the kodesh face u = 10 - z, the devir face
    // u = z - 10, v = y - 12). ----
    const TRK_X = (XW + XDE) / 2, TRK_T = XW - XDE;                   // -44 (the wall's centre plane), 1 (6:16 with Rashi: "אמה טרקסין")
    const trkUV = faceUV(0, HW);
    // 1.0.1-L (L.32): the band of the wall right above the doorway (y 24 .. 24 + INT_PENT_DEPTH) is built per reading of the doorway (in
    // trkPiers): in Rashi's reading it holds the lintel, in the other one it is plain wall as before; the shared part starts above it
    const TRK_BAND = INT_PENT_DEPTH;                                // 1.5388: the lintel's height (its pentagon, as the posts')
    {
      const tg = [];                                                // from the band's top (y 25.54) to the kodesh ceiling (y 42)
      int_uvBox(tg, XDE, XW, F + INT_DEVIR_DOOR_H + TRK_BAND, F + KH, -HW, HW, trkUV);
      mergedMesh(tg, goldCarvedEnd, g);
    }
    // the two piers of the traksin beside the doorway, for a hole `holeW` wide, and the band above the doorway with a hole `bandHoleW` wide
    // (0: solid) - one merged mesh per reading of the doorway
    const trkPiers = (parent, holeW, bandHoleW) => {
      const pg = [], y1 = F + INT_DEVIR_DOOR_H, y2 = y1 + TRK_BAND;
      int_uvBox(pg, XDE, XW, F, y1, -HW, -holeW / 2, trkUV);
      int_uvBox(pg, XDE, XW, F, y1, holeW / 2, HW, trkUV);
      if (bandHoleW > 0) {
        int_uvBox(pg, XDE, XW, y1, y2, -HW, -bandHoleW / 2, trkUV);
        int_uvBox(pg, XDE, XW, y1, y2, bandHoleW / 2, HW, trkUV);
      } else int_uvBox(pg, XDE, XW, y1, y2, -HW, HW, trkUV);
      mergedMesh(pg, goldCarvedEnd, parent);
    };

    // ---- פתח הדביר (I Kings 6:31-32): 6 wide x 12 high (model choice; it must be wider than the ark's staffs - Rashi 6:23, Menachot 98b) ----
    // 1.0.1-H (the user: "פתח הדביר יש ב' ביאורים ברש"י"): BOTH of Rashi's explanations of "האיל מזוזות חמשית" (6:31) are built, as two
    // switchable readings (ctx.shared.devirDoor, the UI's opinions table):
    //   "pent" (default) - Rashi's own view, "ואני אומר, מזוזות חמישית, חמשה צלעות היו למזוזות, ולא היתה מרבעת, ואינו מדבר לא במפתן ולא
    //       במשקוף": pentagonal posts (one side = the wall thickness against the wall's end, the opposite vertex toward the opening); no
    //       threshold. 1.0.1-L (L.32, the user: "פתח הדביר אין משקוף עליון"): and a LINTEL over them, of the posts' pentagonal section, as the
    //       book draws a beam over the opening (p08R; Radak, Ralbag, Malbim: "האיל" = the lintel) - a model choice (1.0.1-H: none).
    //   "five" - the reading Rashi heard, "המפתן האחד והמזוזות מכאן ומכאן שתים הרי שלש, והמשקוף שעליו עשוי כשתים - כזה, כך שמעתי": five frame
    //       parts - a threshold, two square posts and a lintel made as two: two beams leaning on each other over the posts (like the Tadi gate's
    //       "שתי אבנים מטות זו על גב זו", Middot 2:3) - the shape of the lost drawing ("כזה") is a model choice; the posts' square section too.
    //   Radak: "חמש צלעות זו לפנים מזו" (five receding steps); Ralbag and Malbim: "the fifth doorway" of the Temple - DEV notes, UI text.
    const DX = TRK_X;
    const devVar = {};
    const buildDevirDoorway = (key) => {
      const vg = new Group();
      vg.name = "devir-door-" + key;
      g.add(vg);
      const pent = key === "pent";
      const holeW = pent ? INT_DEVIR_HOLE : INT_DEVIR_CLEAR + 2;      // 9.08 (the pentagons stand in the hole) / 8 (square posts 1 thick)
      trkPiers(vg, holeW, pent ? INT_DEVIR_HOLE : 0);                // 1.0.1-L (L.32): Rashi's reading - the lintel fills the band's hole
      if (pent) {
        const pentShape = (zJamb, s) => {
          // s = -1: north post (jamb at z < 0, vertex toward +z); s = +1: south post. Shape coords (x, -z), see the rotation below.
          const cz = zJamb - s * INT_PENT_APO;
          const sh = new Shape();
          for (let k = 0; k < 5; k++) {
            const th = (s < 0 ? -Math.PI / 2 : Math.PI / 2) + Math.PI / 5 + k * 2 * Math.PI / 5;
            const px = DX + Math.cos(th) * INT_PENT_R, pz = cz + Math.sin(th) * INT_PENT_R;
            if (k === 0) sh.moveTo(px, -pz); else sh.lineTo(px, -pz);
          }
          sh.closePath();
          return sh;
        };
        // 1.0.1-L (L.32): the posts rise LINT_SEAT more, into the lintel, up to the line of its widest edges (their tops are hidden in it)
        const LINT_SEAT = INT_PENT_R * (1 - Math.sin(Math.PI / 10));   // 0.588: from the lintel's lower vertex up to its widest edges
        for (const s of [-1, 1]) {
          const geo = new ExtrudeGeometry(pentShape(s * INT_DEVIR_HOLE / 2, s), { depth: INT_DEVIR_DOOR_H + LINT_SEAT, bevelEnabled: false });
          geo.rotateX(-Math.PI / 2);      // extrusion -> +y, shape y -> -z (so the shape's -z becomes world z)
          const post = new Mesh(geo, s < 0 ? goldPostNorth : M.gold);   // olive wood (6:31 "מזוזות עצי שמן") overlaid with gold (II Chr 3:7 "הספים... זהב"; 7:50 = the pivots only)
          post.position.set(0, F, 0);
          post.castShadow = post.receiveShadow = true;
          vg.add(post);
        }
        // 1.0.1-L (L.32, the user: "פתח הדביר אין משקוף עליון"): THE LINTEL, as the book draws it (p08R: a gold beam across the top of the
        // opening). Rashi's own reading speaks of the posts only ("ואני אומר, מזוזות חמישית, חמשה צלעות היו למזוזות, ולא היתה מרבעת, ואינו
        // מדבר לא במפתן ולא במשקוף") - he does not deny a lintel, the verse just does not speak of it; the lintel itself is in the verse for
        // Radak ("האיל הוא הסף העליון והמזוזות הם אשר מפה ומפה אשר הסף סמוך עליהם... שהיתה המזוזה חמש צלעות זו לפנים מזו וכן המזוזה
        // האחרת וכן האיל"), Ralbag ("שהאיל והוא הסף אשר על הפתח") and Malbim ("בין האיל ר"ל המשקוף ובין המזוזות"). MODEL CHOICE: a beam in
        // the posts' material (gold over olive wood) whose section is the posts' pentagon (Radak: "וכן האיל"), turned like them - its side of
        // 1 (the wall's thickness) against the wall above it, its vertex toward the opening (down): y 24 .. 25.54, across the whole hole
        // (9.08, between the jambs) and resting on the posts; it stands 0.31 proud of both faces of the wall at its widest, as the posts do.
        // The doorway's clear height stays 12 (the vertex at y 24); the parochet and the doors below it are unchanged.
        {
          const ls = new Shape(), yc = F + INT_DEVIR_DOOR_H + INT_PENT_R;   // the pentagon's centre (x DX, y 24.85)
          for (let k = 0; k < 5; k++) {
            const th = -Math.PI / 2 + k * 2 * Math.PI / 5;               // k 0: the lower vertex; k 2, 3: the top side (against the wall)
            const px = DX + Math.cos(th) * INT_PENT_R, py = yc + Math.sin(th) * INT_PENT_R;
            if (k === 0) ls.moveTo(px, py); else ls.lineTo(px, py);
          }
          ls.closePath();
          const lg = new ExtrudeGeometry(ls, { depth: INT_DEVIR_HOLE, bevelEnabled: false });
          lg.translate(0, 0, -INT_DEVIR_HOLE / 2);                      // along z, from jamb to jamb
          // 1.0.1-L (verifier of L.32): the same gold reflecting less: the beam's upper east face mirrors the room's bright +x panel and read almost white beside the posts
          const lintel = new Mesh(lg, goldStd(TEX.gold, { envMapIntensity: 0.7 }));
          lintel.name = "devir-lintel";
          lintel.castShadow = lintel.receiveShadow = true;
          vg.add(lintel);
          // 1.2.0 (the user: "להדגיש את הצלעות כ-5"): the five sides of the posts and of the lintel as glowing edges - a group the place
          // "פתח הדביר" switches on for 15 s (70-ui.js feature devirDoorView; ctx.shared.devirPentEdges)
          const eg = new Group();
          eg.name = "devir-pent-edges";
          eg.visible = false;
          const edgeMat = new LineBasicMaterial({ color: 0xfff6c0, transparent: true, opacity: 0.95, depthTest: false });
          for (const o of vg.children) {
            if (!o.isMesh || !o.geometry) continue;
            const ln = new LineSegments(new EdgesGeometry(o.geometry, 20), edgeMat);
            ln.position.copy(o.position);
            ln.rotation.copy(o.rotation);
            ln.renderOrder = 5;
            ln.userData.noPick = true;
            ln.raycast = int_noRaycast;
            eg.add(ln);
          }
          vg.add(eg);
          ctx.shared.devirPentEdges = { on: false, set(v) { this.on = !!v; eg.visible = !!v; } };
        }
      } else {
        // square posts 1 x 1 (section: model choice), 0.1 proud of both faces; threshold 0.25 high (model choice; Rashi on 6:34 "חור המפתן"),
        // as deep as the wall (x -44.5..-43.5: review H2-INT-GEO-4 - it no longer runs through the bottom of the parochet)
        for (const s of [-1, 1]) H.box(vg, TRK_T + 0.2, INT_DEVIR_DOOR_H, 1, s < 0 ? goldPostNorth : M.gold, DX, F, s * (INT_DEVIR_CLEAR / 2 + 0.5));
        H.box(vg, TRK_T, 0.25, INT_DEVIR_CLEAR + 2, M.gold, DX, F, 0);
        // the lintel "עשוי כשתים": two beams 0.6 x 1.4 leaning on each other over the posts - a gable: each rises from its post's top (y 24) to
        // the apex 2.2 higher at the centre, 0.2 proud of both wall faces (model choice, see above); they sit on the wall face above the doorway.
        // Review H2-INT-GEO-1: the rotation sign was inverted (the beams formed a V hanging into the doorway) - now +s: the north beam (s -1)
        // rises toward +z, the south one toward -z
        const half = INT_DEVIR_CLEAR / 2 + 1, rise = 2.2, len = Math.hypot(half, rise) + 0.3;
        for (const s of [-1, 1]) {
          const beam = H.box(vg, TRK_T + 0.4, 0.6, len, M.gold, 0, 0, 0);
          beam.position.set(DX, F + INT_DEVIR_DOOR_H + rise / 2 + 0.3, s * half / 2);
          beam.rotation.x = s * Math.atan2(rise, half);
        }
      }
      // two doors of olive wood (6:31 "דלתות עצי שמן"), each 3 wide x 12 high x 0.25 (thickness: model choice), hung on the posts; carved
      // cherubim, palms and flowers with the gold following the carving (6:32; Rashi: "להיות שוקע בו במקום החקק, ובולט על הבליטה") = the carved-gold
      // texture (1.0.1-H); standing OPEN westward: they stayed open because of the ark's staffs and a curtain hung (Radak and Rashi on
      // II Chr 3:14; Rashi on 8:66 - DEV note).
      // The pivot axis per reading (review H2-INT-GEO-3/4, model choice): "pent" - half a leaf thickness off the pentagon's west face, under
      // the wall's soffit (x -44.35, |z| 3.12), so the leaf hangs on its post; "five" - just west of the square post's corner and of the
      // threshold (x -44.66, |z| 3), so the open leaf clears both
      const PIV_X = pent ? DX - 0.35 : DX - 0.66, PIV_Z = pent ? 3.12 : INT_DEVIR_CLEAR / 2;
      for (const s of [-1, 1]) {
        const hinge = new Group();
        hinge.position.set(PIV_X, F, s * PIV_Z);
        hinge.rotation.y = s * 0.26;      // ~105 deg open: past the perpendicular, leaning toward the devir side of the wall (model choice)
        vg.add(hinge);
        const leaf = H.box(hinge, 3, INT_DEVIR_DOOR_H - 0.2, 0.25, s > 0 ? goldCarvedDevirDoorSouth : goldCarvedDevirDoor, -1.5, 0.1, 0);
        if (s < 0) goldKey(hinge, -2.7, 2.2, 0.125, 1);   // 1.3.3: the key of gold in the lock of the north leaf (Rashi on 7:50)
        // 1.0.1-K (K.5): uvs in the leaf's frame (xi -3..0 from the pivot): the cell scaled to 3 x 5.9 (two registers on the 11.8), the pair of
        // cherubim in the middle of the leaf on both faces (model choice), not mirrored
        int_boxUV(leaf.geometry, leaf.position.x, leaf.position.y, 0, (nx, ny, nz, x, y) => [nz > 0.5 ? x + 2.7 : nz < -0.5 ? -x - 0.3 : x, y - 0.1]);
        // round gold pivots top and bottom (Rashi on 6:34: the pivot "נכנס בחור המפתן"); "והפתות" (7:50): pivots for the Targum and Radak,
        // their sockets for Ralbag and Metzudat Zion, keys for Rashi (see the heichal doors; review Q2-2)
        H.cyl(vg, 0.12, 0.12, 0.25, M.gold, PIV_X, F, s * PIV_Z, 10);
        H.cyl(vg, 0.12, 0.12, 0.25, M.gold, PIV_X, F + INT_DEVIR_DOOR_H - 0.25, s * PIV_Z, 10);
      }
      // הפרוכת (II Chr 3:14 "תכלת וארגמן וכרמיל ובוץ ויעל עליו כרובים"), hung on the kodesh (east) face of the doorway, per reading (review
      // H2-INT-GEO-2): "five" - 6 wide, flush with the square posts' inner faces (|z| 3); "pent" - 6.9 wide, its edges tucked behind the
      // pentagons' slanted faces (which stand at |z| 3.36..3.45 in the curtain's plane), so no slit is left beside it (width: model choice).
      // (Rashi and Radak on II Chr 3:14: the doors stayed open and a curtain hung; Ralbag on 6:21: the wall replaced the curtain - "כי עשה שם
      // כותל בין הדביר ובין ההיכל להיות תמורת הפרכת" - DEV note; review Q2-6)
      // 1.0.1-K (K.4, the user: "על הפרוכת איור נשרים מצד ההיכל ואריות מצד קה"ק"): its two faces are woven differently (int_parochetTex):
      // eagles on the +x face (toward the heichal), lions on the -x face (toward the devir); Rashi on II Chr 3:14: hung at the doorway of the
      // amah traksin "אף על פי שהיה בו דלתות תלה עליו"
      // 1.0.1-L (verifier of L.32): in Rashi's reading the curtain rises 0.5 into the lintel. The pentagonal lintel touches y 24 only along its
      // lower vertex, in the wall's middle (x -44); at the curtain's plane its slanted underside is 0.36..0.45 higher, and through that slit, over
      // the 12-high curtain, a camera above y 24 (the view "ההיכל") saw the cloud or the devir behind it, a white line over the curtain.
      // 1.3.5 (the user, of the kuntres, point 26: "עשה כך" - in both houses): THE PAROCHET'S HEAD IS BENT a little toward the Holy of Holies -
      // Sukkah 7b (book 108, line 189) "ורבנן? ההוא דניכוף ביה פורתא, דמחזי כסכך"; Rashi (book 2163, line 263) "ליכוף בה - למעלה פורתא
      // כעין גג יעשה ממקצתה". The curtain stands to 0.7 under the doorway's head, and from there its head leans in under the lintel to
      // the middle of the wall's thickness (0.92 long, 37.5 degrees from upright; its tip 0.03 inside the lintel, so no slit is left
      // over it - in "pent" the standing curtain rose 0.5 into the lintel for that); 5.98 wide - between the posts. How much it bends -
      // a model choice.
      const PAR_BEND0 = INT_DEVIR_DOOR_H - 0.7;
      const parH = PAR_BEND0;
      const par = H.box(vg, 0.12, parH, pent ? 6.9 : INT_DEVIR_CLEAR, parochetMats, XW + 0.06, F, 0);   // x -43.5..-43.38, to the bend
      {
        const run = 0.56, rise = INT_DEVIR_DOOR_H + 0.03 - PAR_BEND0, fl = Math.hypot(run, rise);
        const fg = new BoxGeometry(0.12, fl, 5.98);
        fg.translate(0, fl / 2, 0);
        int_boxUV(fg, 0, PAR_BEND0, 0, (nx, ny, nz, x, y, z) => [nx > 0.5 ? -z : z, y]);   // the weave runs on from the standing curtain
        const flap = new Mesh(fg, parochetMats);
        flap.name = "parochet-head";
        flap.position.set(XW + 0.06, F + PAR_BEND0, 0);
        flap.rotation.z = Math.atan2(run, rise);   // its top toward -x, the devir
        flap.castShadow = flap.receiveShadow = true;
        vg.add(flap);
      }
      // 1.0.1-K (K.5): its weave from world positions (the heichal face u = -z, the devir face u = z, v = y - 12): the same for both readings,
      // symmetric about the doorway's middle, and continued by the swellings of the staffs (below)
      int_boxUV(par.geometry, 0, parH / 2, 0, (nx, ny, nz, x, y, z) => [nx > 0.5 ? -z : z, y]);
      devVar[key] = vg;
      return vg;
    };
    buildDevirDoorway("pent");
    buildDevirDoorway("five");
    ctx.shared.devirDoor = {
      current: "pent",
      keys: ["pent", "five"],
      set(key) {
        if (!devVar[key]) return;
        this.current = key;
        for (const k in devVar) devVar[k].visible = k === key;
      }
    };
    ctx.shared.devirDoor.set("pent");
    // 1.3.3: "הפותות" (7:50) - Rashi's keys (the default) or the pivots / their sockets (the gold pivots, always built)
    ctx.shared.potot = {
      current: "rashi", keys: ["rashi", "pivots"],
      names: { rashi: "רש״י — מפתחות של זהב", pivots: "תרגום ורד״ק — הצירים; רלב״ג — מקום הציר" },
      get() { return this.current; },
      set(k) {
        if (k !== "rashi" && k !== "pivots") return false;
        this.current = k;
        for (const key of pototKeys) key.visible = k === "rashi";
        pototLayer.visible = k === "rashi";
        return true;
      }
    };
    ctx.shared.potot.set("rashi");

    // ---- הפרוכת: the curtain itself is built per doorway reading (buildDevirDoorway above); the bulges of the staffs are shared ----
    {
      // the two staffs press from behind: Yoma 54a "דוחקין ובולטין ויוצאין בפרוכת, ונראין כשני דדי אשה" (Menachot 98b "דוחקין ובולטין
      // בפרוכת, ודומין כמין שני דדי אשה"; Rashi on I Kings 8:8) - 1.0.1-L: the quotes as in the library (K.5 had them shortened)
      // 1.0.1-K (K.5): the cloth swells smoothly - a patch 1 x 1 of the curtain's face pushed out 0.07 at the staff's end and fading to the
      // flat cloth at its rim (a Gaussian; K.4's flattened sphere had a hard rim and read as a pink egg); its weave continues the curtain's
      // (world uvs as the curtain's face: u = -z, v = y - 12) and it is drawn over the face it lies on (polygonOffset; shape: model choice)
      // 1.0.1-L (L.54, the user: "הבלט את בדי הארון כך שיראו בולטים מהפרוכת"; I Kings 8:8 "ויראו ראשי הבדים מן הקדש על פני הדביר ולא
      // יראו החוצה"): the swelling made clear from the heichal - 0.28 high (K.5: 0.07) on a patch 1.6 x 1.6, its radius about 0.5, and the
      // staffs now run 0.3 into it (STAFF_PRESS: their rounded ends inside the swelling, hidden by the cloth) - model choices
      const bulgeMat = parPlain.clone();
      bulgeMat.map = parTex.east;                      // the face toward the heichal: the eagles' weave
      bulgeMat.polygonOffset = true;
      bulgeMat.polygonOffsetFactor = -2;
      bulgeMat.polygonOffsetUnits = -4;
      for (const s of [-1, 1]) {
        const geo = new PlaneGeometry(1.6, 1.6, 28, 28);
        geo.rotateY(Math.PI / 2);                      // its face toward +x (the heichal)
        const p = geo.attributes.position, uv = geo.attributes.uv;
        for (let i = 0; i < p.count; i++) {
          const y = p.getY(i), z = p.getZ(i);
          p.setX(i, STAFF_BULGE * Math.exp(-(y * y + z * z) / 0.0784));   // exp(-r^2 / 0.28^2): 1/e at r 0.28, flat (< 0.001) from r 0.66
          uv.setXY(i, -(s * STAFF_Z + z), STAFF_Y - F + y);
        }
        geo.computeVertexNormals();
        const b = new Mesh(geo, bulgeMat);
        b.position.set(XW + 0.12, STAFF_Y, s * STAFF_Z);
        b.receiveShadow = true;
        g.add(b);
      }
    }

    // ---- הדביר / קודש הקדשים: 20 x 20 x 20 (I Kings 6:20), everything gold (6:20-22, 6:30; II Chr 3:8 "לככרים שש מאות") ----
    {
      const L = XDE - XDW;               // 19 clear (+ the traksin = 20, 6:20)
      const cx = DEVIR_CX;               // -54: the room's centre; the ark, the stone and the cherubim stand on the ark line ARK_X (-58.5)
      // the floor (6:30 "לפנימה ולחיצון"): gold over cypress boards as in the kodesh (DEV note: Malbim on II Chr 3:5 - no cypress in the devir)
      const df = [];
      int_uvBox(df, XDW, XDE, F, F + 0.06, -HW, HW, floorUV);
      mergedMesh(df, goldFloor, g);
      // the skins carved like the heichal's: 6:29 "מלפנים ולחיצון" - Rashi: "לבית הכפרת הפנימי ולהיכל החיצון" (1.0.1-K: world uvs, two
      // registers of 10 from the floor to the ceiling at 20)
      const dn = [], ds = [], dw = [];
      int_uvBox(dn, XDW, XDE, F, F + DH, -HW, -HW + SKIN, faceUV(XDW, 0));   // north skin
      mergedMesh(dn, goldCarved, g);
      int_uvBox(ds, XDW, XDE, F, F + DH, HW - SKIN, HW, faceUV(XDE, 0));     // south skin -> cutaway
      cut.push(mergedMesh(ds, goldCarvedSouth, g));                     // 1.0.1-L (L.47): the mirrored environment
      int_uvBox(dw, XDW, XDW + SKIN, F, F + DH, -HW, HW, faceUV(0, HW));     // west skin (u = 10 - z)
      mergedMesh(dw, goldCarved, g);
      // even shetiya - Mishnah Yoma 5:2 (53b): "משנטל הארון, אבן היתה שם מימות נביאים ראשונים, ושתיה היתה נקראת, גבוהה מן הארץ שלש אצבעות,
      // ועליה היה נותן" - in the west of the devir (Rambam Beit HaBechira 4:1 "אבן היתה בקדש הקדשים במערבו שעליה היה הארון מנח"): a flat rock
      // ~2 (x, east-west) x 3 (z, north-south) (research: "3 על 2"; the irregular outline: model choice), so that the whole footprint of the
      // ark (1.5 x 2.5) rests on it. 1.0.1-L (L.56, the user: "אבן השתיה היתה בבית ראשון?"): YES - the stone is older than the house and the
      // ark stood on it; it was bared only when the ark was taken away: Rashi on the Mishnah "נביאים הראשונים - דוד ושמואל"; Tosefta Yoma
      // 2:14 (Lieberman) "אבן היתה שם מימות נביאים הראשנים ושתיה נקרית, גבוהה מן הארץ שלש אצבעות, שמתחלה היה עליה ארון נתון. משניטל הארון,
      // עליה היו מקטירין קטרת שלפני לפנים"; Yoma 54b "ושתיה היתה נקראת. תנא: שממנה הושתת העולם"; the Gemara 53b on "משניטל": "רבי יהודה
      // (בן לקיש) אומר: ארון במקומו נגנז" (Rambam 4:1: Josiah hid it in the place Solomon had built). So the model keeps the ark ON the stone
      // (its height three fingers = 0.125, ROCK_H 0.12), and the stone is not bared while the ark stands (no incense on it).
      const rockShape = new Shape();
      [[-0.75, -1.5], [0.8, -1.5], [1, -1.2], [1, 1.3], [0.7, 1.5], [-0.8, 1.5], [-1, 1.1], [-1, -1.25]]
        .forEach(([px, pz], i) => i ? rockShape.lineTo(px, -pz) : rockShape.moveTo(px, -pz));   // shape y = -z (as the devir posts below)
      rockShape.closePath();
      const rockGeo = new ExtrudeGeometry(rockShape, { depth: ROCK_H, bevelEnabled: false });
      rockGeo.rotateX(-Math.PI / 2);     // extrusion -> +y (0..ROCK_H)
      const rock = new Mesh(rockGeo, rockMat);
      rock.name = "even-shetiya";
      rock.position.set(ARK_X, F, 0);
      rock.castShadow = rock.receiveShadow = true;
      g.add(rock);
      // the ark (Ex 25:10: 2.5 x 1.5 x 1.5) on it, on the ark line x -58.5 (Rambam 4:1: the stone "במערבו"; 5 from the west wall: model choice),
      // its long axis north-south (Rashi on I Kings 6:23 "שהארון היה נתון ארכו לרחבו של בית"), its staffs east-west at the ends of its length (Rashi there;
      // Menachot 98b: 2.5 between the staffs so that two Levites walk between them; Yoma 54a; I Kings 8:8)
      const ay = F + ROCK_H;
      // 1.0.1-L (L.85): hollow, its walls half a tefach - Bava Batra 14a "צא מהן טפח – חציו לכותל זה וחציו לכותל זה" (the floor the same: model
      // choice). The crown round its top: Ex 25:11 "ועשית עליו זר זהב סביב" (a band under the kaporet; its teeth with the open ark, as the book draws them)
      const ARK_T = 1 / 12;
      H.box(g, ARK_W, ARK_T, ARK_L, vesselGold, ARK_X, ay, 0);
      for (const sd of [-1, 1]) {
        H.box(g, ARK_T, ARK_H - ARK_T, ARK_L, vesselGold, ARK_X + sd * (ARK_W - ARK_T) / 2, ay + ARK_T, 0);
        H.box(g, ARK_W - 2 * ARK_T, ARK_H - ARK_T, ARK_T, vesselGold, ARK_X, ay + ARK_T, sd * (ARK_L - ARK_T) / 2);
        H.box(g, 0.03, 0.12, ARK_L + 0.06, vesselGold, ARK_X + sd * (ARK_W / 2 + 0.015), ay + ARK_H - 0.12, 0);
        H.box(g, ARK_W, 0.12, 0.03, vesselGold, ARK_X, ay + ARK_H - 0.12, sd * (ARK_L / 2 + 0.015));
      }
      const arkLid = new Group();                                       // the kaporet with its cherubim: lifted off by the pill "arkInside" (L.85)
      arkLid.name = "ark-kaporet";
      g.add(arkLid);
      ctx.layers.arkLid = arkLid;                                       // gates the labels "הארון ובדיו" and "אבן השתייה" (with the ark open they cover what is shown)
      H.box(arkLid, ARK_W + 0.1, 0.17, ARK_L + 0.1, vesselGold, ARK_X, ay + ARK_H, 0);    // kaporet (Ex 25:17), a tefach thick (Sukkah 5a)
      // (the two small cherubim of the kaporet are built with the great ones below - 1.0.1-K, K.4)
      // staffs (Ex 25:13-15): STAFF_LEN 15.55 (model choice, SPEC 7 "~15") from STAFF_X0 (-59.05) to the parochet's west face (x -43.5), so
      // that their ends press the curtain (I Kings 8:8 "ויראו ראשי הבדים"; Yoma 54a)
      for (const s of [-1, 1]) {
        // 1.0.1-L (L.54): STAFF_PRESS longer - the east end runs through the curtain (x -43.5..-43.38) into its swelling (tip at x -43.2,
        // the swelling's face 0.06 beyond it; hidden by the cloth on both sides)
        const st = new Mesh(new CylinderGeometry(0.11, 0.11, STAFF_LEN + STAFF_PRESS, 10), vesselGold);
        st.rotation.z = Math.PI / 2;
        st.position.set(STAFF_X0 + (STAFF_LEN + STAFF_PRESS) / 2, STAFF_Y, s * STAFF_Z);
        st.castShadow = true;
        g.add(st);
        for (const dx of [-0.5, 0.5]) {                                   // rings (Ex 25:12)
          const rg = new Mesh(new TorusGeometry(0.18, 0.04, 6, 12), vesselGold);
          rg.rotation.y = Math.PI / 2;
          rg.position.set(ARK_X + dx, STAFF_Y, s * (ARK_L / 2 + 0.03));
          g.add(rg);
        }
      }
      // ---- the cherubim (I Kings 6:23-28; II Chr 3:10-13) - 1.0.1-K (K.4): rebuilt after the book p07L (the user's reference; the user: "את
      // הכרובים עשית בצורה לא צנועה, והכנפיים מאוזן ולא לרוחב / לא מבואר שהיו להם ידיים, אגב תסתכל על האיור ממקרא מפורש") ----
      // What the sources give: olive wood overlaid with gold (6:23 "עצי שמן" - Targum and Rashi "דאעי זיתא"; 6:28 "ויצף את הכרובים זהב"); 10
      // high (6:23 "עשר אמות קומתו", 6:26); each wing 5, ten from wingtip to wingtip (6:24-25); "ויפרשו את כנפי הכרבים ותגע כנף האחד בקיר וכנף
      // הכרוב השני נגעת בקיר השני וכנפיהם אל תוך הבית נגעת כנף אל כנף" (6:27; II Chr 3:11-12; Rashi 6:27: the north wall and the south wall,
      // "וראשי הכנפים אשר באמצע הבית"); "והם עמדים על רגליהם ופניהם לבית" (II Chr 3:13); "מעשה צעצעים" = "תבנית ילדים וילדות עשה לכרובים,
      // כרביא" (Rashi II Chr 3:10; Rashi Ex 25:18 "דמות פרצוף תינוק להם"). The verses mention NO hands: the figures have none (1.0.1-H had
      // arms, hands and a knee-length tunic with bare legs - the user: not modest).
      // THE MIRACLE (the user: "ציין גם את דברי חז"ל שבנס היו עומדים"): the two wing-spans fill the whole 20 amot of the devir, so where did the
      // bodies stand? Bava Batra 99a: "אמר רבנאי אמר שמואל: כרובים - בנס הן עומדין... גופייהו היכא הוו קיימי? אלא שמע מינה בנס הן עומדין"
      // (so Megillah 10b "מקום ארון אינו מן המדה"); Rashi on 6:24: "ממלאות כל חלל עשרים אמה, וגוף הכרובים אינו מן המדה, ועומד בנס"; Rashi on
      // II Chr 3:11: "וגופם – אמרו רבותינו (בבא בתרא צט.): בנס היו עומדין. ולפי פשוטו: נראה לי שהיה גופן בולט מהם כעוף זה שפורש כנפיו". Radak on 6:27: the
      // bodies stood under the wings and no miracle is needed ("גופות הכרובים תחת הכנפים הם ואין צריך להיותם עומדת בנס"). A model cannot show
      // a miracle: the bodies are built UNDER the wings (Radak; Rashi's peshat in Chronicles), each wing root inside the body, so the wingtips
      // still touch the walls and each other and the span is the full width - the UI states Chazal's words.
      // MODEL CHOICES, after the book: a long robe from the shoulders to the floor, widening to the hem, with long folds (int_robeGeo); no arms;
      // a small head with a simple child-like face and a cap of hair (1.0.1-K, K.5: checked against the book and the sources of II Chr 3:10-13
      // (Rashi "תבנית ילדים וילדות... ושל עץ היו, ושוב ויצפהו זהב"; Radak "פני נערים היו להם"; Malbim "ככנפי העוף"; II Chr 3:13 "והם עמדים על
      // רגליהם", Rashi "בקרקעית הבית למערב", Radak "עומדים על רגליהם בקרקע הבית") - the body slimmer, the head smaller, the wings nearer to
      // level). THE WINGS: spread ACROSS the width of the devir (z), from the shoulders; 1.0.1-L (L.84): each ONE smooth solid, no feathers
      // (int_wingLoft below; K.4 to L.30 built them of rows of feathers). 1.0.1-L (L.30, the user:
      // "כנפי הכרובים, מאוזן (תצוגה שוכבת) ולא מאונך"): the four wings now LIE in one horizontal plane at the shoulders, 8.5 above the floor
      // and under the heads (the user kept "מתחת"), their leading edges toward the house, a canopy over the ark (I Kings 8:7 "ויסכו הכרבים על
      // הארון ועל בדיו מלמעלה"; Rashi II Chr 3:13 "והיו כנפי הכרובים מטין מן הכותל וסוככין על הכפרת ועל הארון בכנפיהם") -
      // K.4/K.5 spread them in a vertical plane facing the house. The bodies stand at z +-4.9 on the ark line (Rashi 6:23: one north
      // of the ark and one south of it): each wing reaches 4.9 from its body's axis, so the outer tips touch the gold skin of the side walls
      // (|z| 9.8; L.84: 0.01 into the skin) and the inner tips meet at z 0 (L.84: exactly) - 1.0.1-H stood them at +-5 with the outer wing 0.2 shorter.
      // THE FACES (ctx.shared.cherubPose, the UI's opinions table): "rashi" (default) - Rashi on II Chr 3:13: the bodies face the house (east)
      // but "ראשם היה כפוף ומביטין לפניהם... פונים היו ראשם זה כנגד זה וגם ראשיהם כפופים לבית כלפי פנים" - heads turned toward each other and
      // bowed; "radak" - Radak and Metzudat David on II Chr 3:13: "פניהם לבית" = facing the heichal, east, heads straight; "tzidud" - Bava Batra
      // 99a: "דמצדדי אצדודי... כתלמיד הנפטר מרבו" (Onkelos: "מעשה צעצועים... ומצודדים פניהם") - heads turned half-way toward each other.
      // THE KAPORET'S CHERUBIM (Ex 25:18-20) in the same form, scaled 0.18 (1.8 high): "והיו הכרבים פרשי כנפים למעלה סככים בכנפיהם על הכפרת
      // ופניהם איש אל אחיו אל הכפרת יהיו פני הכרבים"; Rashi Ex 25:20 "שלא תעשה כנפיהם שוכבים אלא פרושים וגבוהים למעלה אצל ראשיהם, שיהא עשרה
      // טפחים בחלל שבין הכנפים לכפרת" (Sukkah 5b "קרייה רחמנא סככה למעלה מעשרה"): standing at the two ends of the kaporet facing each other,
      // heads bowed toward it, the wings raised above the heads and reaching forward over it, their lower edge over the kaporet about 10 tefachim
      // above it (1.0.1 had 0.95-high figures with flat plates for wings). Rashi II Chr 3:13: Moses' cherubim stayed on the kaporet. 1.0.1-L
      // (L.84, the user: "כרובי הארון לא נוגעים זה בזה (תחליף אותם למה שהיה קודם - כמו הספר)"): L.30's level wings of the kaporet are gone. As before
      // L.30 and as the book draws them (p. 45), each wing rises from the shoulder behind the figure, over the head and forward in an arch - and now
      // reaches the middle of the kaporet, the two cherubim's tips touching there.
      const CH_Z = HW / 2 - 0.1;                                          // 4.9
      const KAP_TOP = ay + ARK_H + 0.17;                                  // 13.79: the top of the kaporet
      // 1.0.1-K (K.5, the addendum B): the book's head is SMALL on the tall figure (about 0.7 wide and 0.9 high of the 10), on a short,
      // thinner neck; the hair's top stays at 10 (6:23 "עשר אמות קומתו"). 1.0.1-L (L.35): the head remade - the face modelled and cut in
      // the gold, a cap of hair with a hairline (int_cherubHeadGeo, int_cherubFaceTex, int_cherubHairGeo, int_cherubHairTex above), 0.9 x
      // 1.12 x 0.84 before HEAD_S - K.5's size and place; no dark parts any more (K.4's black eyes and mouth). The kaporet's heads (scale
      // 0.18) on a coarser grid, their bump weaker (three's bump grows as the surface shrinks).
      const robeNeckGeo = (() => { const nk = new CylinderGeometry(0.19, 0.24, 0.36, 14); nk.translate(0, 9.0, 0); return mergeGeometries([int_robeGeo(), nk]); })();
      const HEAD_S = 0.86, HEAD_Y = 9.05, HEAD_C = 10 - INT_HEAD_SC[1] * INT_HAIR_OUT * HEAD_S - HEAD_Y;   // the head turns about the neck (y 9.05)
      const headPart = (geo) => { geo.scale(HEAD_S, HEAD_S, HEAD_S); geo.translate(0, HEAD_C, 0); return geo; };   // built about the skull's centre
      const faceTex = int_cherubFaceTex(), hairTex = int_cherubHairTex();
      const headMats = (bf, bh) => ({
        face: goldStd(faceTex, { color: 0xFFDC86, roughness: 0.34, emissive: 0x6b4a10, emissiveIntensity: 0.55, bumpScale: bf }),
        hair: goldStd(hairTex, { color: 0xFFD47C, roughness: 0.42, emissive: 0x6b4a10, emissiveIntensity: 0.5, bumpScale: bh })
      });
      const HEADS = {
        great: Object.assign({ faceGeo: headPart(int_cherubHeadGeo(84, 64)), hairGeo: headPart(int_cherubHairGeo(84, 64)) }, headMats(0.3, 0.25)),
        small: Object.assign({ faceGeo: headPart(int_cherubHeadGeo(40, 30)), hairGeo: headPart(int_cherubHairGeo(32, 24)) }, headMats(0.05, 0.05))
      };
      // 1.0.1-L (verifier of L.35 / L.47): the south figure's head with the mirrored environment, as the south wall: turned toward the north it mirrored the
      // room's dim panel and read 14% darker than the north figure's (luma 116.8 / 135.4; with this 136.4 / 135.3). The same gold, no new shader program
      for (const h of [HEADS.great, HEADS.small]) { h.faceS = southFaced(h.face); h.hairS = southFaced(h.hair); }
      const figure = (name, x, y, z, k, rotY, parent = g) => {
        const fg = new Group();
        fg.name = name;
        fg.position.set(x, y, z);
        fg.rotation.y = rotY;
        fg.scale.setScalar(k);
        parent.add(fg);
        const body = new Mesh(robeNeckGeo, vesselGold);
        body.castShadow = body.receiveShadow = true;
        fg.add(body);
        const head = new Group();
        head.position.set(0, HEAD_Y, 0);
        fg.add(head);
        const HD = k < 0.5 ? HEADS.small : HEADS.great;
        const face = new Mesh(HD.faceGeo, z > 0 ? HD.faceS : HD.face), hair = new Mesh(HD.hairGeo, z > 0 ? HD.hairS : HD.hair);
        face.castShadow = hair.castShadow = true;
        face.receiveShadow = hair.receiveShadow = true;
        head.add(face, hair);
        return head;
      };
      // 1.0.1-L (L.84, the user: "את כנפי כרובים אל תעשה כמו נוצות אלא כיחידה אחת ותוודא שנוגעת זו בזו"): every wing ONE smooth solid (int_wingLoft).
      // THE GREAT CHERUBIM - level (L.30, "מאוזן"), at the shoulders, 8.5 above the floor, the leading edge toward the house: each root inside the robe,
      // the outline of a spread wing (model choice), the two edges drooping a little below the wing's line. I Kings 6:27 "ותגע כנף האחד בקיר וכנף הכרוב
      // השני נגעת בקיר השני וכנפיהם אל תוך הבית נגעת כנף אל כנף": the inner tips end exactly on z 0, ring on ring; the outer tips end 0.01 inside the
      // wall's gold skin (its face at |z| 9.8). Checked on the vertices (report part5-house).
      const CH_WING_V = 8.5, WING_U0 = 0.3, KAP_Z = 0.85;
      const WING_LE = [0.28, 0.58, 0.7, 0.7, 0.64, 0.56, 0.48, 0.4, 0.3];                // the leading edge (toward the east), t 0 .. 1 of the span
      const WING_TE = [-0.3, -1.3, -1.85, -2.05, -1.95, -1.72, -1.4, -0.98, -0.5];        // the trailing edge
      const wingsGreat = [], wingsKaporet = [];
      const greatWing = (s, dir, U) => {
        const st = [];
        for (let i = 0, N = 40; i <= N; i++) {
          const t = i / N, u = WING_U0 + (U - WING_U0) * t, le = int_crTab(WING_LE, t), te = int_crTab(WING_TE, t);
          st.push({
            c: new Vector3(ARK_X + (le + te) / 2, FL + CH_WING_V, s * CH_Z + dir * u),
            a: new Vector3((le - te) / 2, 0, 0),
            n: new Vector3(0, 0.03 + 0.07 * (1 - t) * (1 - t), 0),
            cam: 0.15 * Math.sin(Math.PI * t)
          });
        }
        wingsGreat.push(int_wingLoft(st));
      };
      // THE KAPORET'S CHERUBIM: Ex 25:20 "פרשי כנפים למעלה סככים בכנפיהם על הכפרת"; Rashi there "שלא תעשה כנפיהם שוכבים אלא פרושים וגבוהים למעלה אצל
      // ראשיהם, שיהא עשרה טפחים בחלל שבין הכנפים לכפרת". The book's form: a broad lobe behind the figure at the shoulder, rising over the head and running
      // forward in a narrowing arch. The spine as [out to the side, above the kaporet, forward from the figure's axis]: the tip at KAP_Z, the middle of
      // the kaporet, on the plane z 0 exactly - so one cherub's tip meets the other's, on both sides of the ark. The numbers: model choices.
      const KW = [[0.06, 1.5, -0.02], [0.16, 1.5, -0.1], [0.26, 1.58, -0.2], [0.32, 1.76, -0.27], [0.33, 1.96, -0.23], [0.31, 2.12, -0.1], [0.28, 2.18, 0.1], [0.26, 2.18, 0.38], [0.245, 2.17, 0.62], [0.24, 2.16, KAP_Z]];
      const KW_H = [0.05, 0.1, 0.15, 0.16, 0.14, 0.1, 0.075, 0.06, 0.045, 0.03];          // half the wing's width along the spine
      const kaporetWing = (s, sx) => {
        const col = (j) => KW.map((q) => q[j]);
        const cx = col(0), cy = col(1), cf = col(2), P = (t) => new Vector3(ARK_X + sx * int_crTab(cx, t), KAP_TOP + int_crTab(cy, t), s * KAP_Z - s * int_crTab(cf, t));
        const st = [], X = new Vector3(1, 0, 0);
        for (let i = 0, N = 44; i <= N; i++) {
          const t = i / N, c = P(t), tan = i === N ? new Vector3(0, 0, -s) : new Vector3().subVectors(P(Math.min(1, t + 0.01)), P(Math.max(0, t - 0.01))).normalize();
          const nn = new Vector3().copy(X).addScaledVector(tan, -X.dot(tan)).normalize();
          const hw = int_crTab(KW_H, t);
          st.push({ c, a: new Vector3().crossVectors(tan, nn).multiplyScalar(hw), n: nn.clone().multiplyScalar(0.006 + 0.012 * (1 - t)), cam: 0 });
        }
        wingsKaporet.push(int_wingLoft(st));
      };
      const cherubHeads = [];
      for (const s of [-1, 1]) {
        cherubHeads.push({ s, head: figure("cherub-" + (s < 0 ? "north" : "south"), ARK_X, FL, s * CH_Z, 1, 0) });
        greatWing(s, s, HW - SKIN - CH_Z + 0.01);                         // the outer wing, into the wall's gold skin by 0.01 (the skin's face at |z| 9.8)
        greatWing(s, -s, CH_Z);                                           // the inner wing, to the middle of the house (z 0)
        // the kaporet's cherub at this end, facing the other (rotation: +x -> toward z 0), head bowed toward the kaporet
        const kh = figure("kaporet-cherub-" + (s < 0 ? "north" : "south"), ARK_X, KAP_TOP, s * KAP_Z, 0.18, s * Math.PI / 2, arkLid);
        kh.rotation.z = -0.42;
        for (const sx of [-1, 1]) kaporetWing(s, sx);
      }
      mergedMesh(wingsGreat, vesselGold, g).name = "cherub-wings";
      mergedMesh(wingsKaporet, vesselGold, arkLid).name = "kaporet-cherub-wings";
      const CHERUB_POSES = {
        rashi: (s) => [0, s * 0.55, -0.32],   // Euler XYZ: the bow (about z) first, then the turn (about y) toward the other cherub (z 0)
        radak: () => [0, 0, 0],
        tzidud: (s) => [0, s * 0.85, 0]
      };
      ctx.shared.cherubPose = {
        current: "rashi",
        keys: ["rashi", "radak", "tzidud"],
        set(key) {
          const f = CHERUB_POSES[key];
          if (!f) return;
          this.current = key;
          for (const { s, head } of cherubHeads) {
            const r = f(s);
            head.rotation.set(r[0], r[1], r[2]);
          }
        }
      };
      ctx.shared.cherubPose.set("rashi");
      // ---- 1.0.1-L (L.85, the user: "תכניס גם מה היה בתוך הארון עפי הספר"): what the book draws on p. 46, "הדברים שבתוך הארון" - the ark open from above, all
      // the measures by Bava Batra 14a, Rabbi Meir ("באמה בת ששה טפחים": a tefach = 1/6, inside 14 x 8 tefachim): ----
      // - the whole tablets, I Kings 8:9 "אין בארון רק שני לחות האבנים": "ארכן ששה, ורחבן ששה, ועביין שלשה; מונחות כנגד ארכו של ארון" - flat, side by side,
      //   from the north wall, 12 tefachim of the ark's length. Blue as in the book (Rashi Ex 34:1 "מחצב סנפירינון"); five letters on each: model choice
      //   after the book (Rashi Song 4:5 "וחמשה דברות על זו וחמשה על זו");
      // - the broken tablets under them: Menachot 99a "מלמד שהלוחות ושברי לוחות מונחין בארון"; Rashi Bava Batra 14b "שברי לוחות שמונחין - תחת הלוחות";
      // - the Torah scroll in the two tefachim left at the south end: "נשתיירו שם שני טפחים, שבהן ספר תורה מונח" (its width two, its length six: "שיעור
      //   ספר תורה בכמה? אמר להן: בגויל – ששה" and "כל שיש בהקיפו שלשה טפחים – יש בו רוחב טפח");
      // - the parchment with the Name: Bava Batra 14b "מלמד, שהשם וכל כינויו מונחין בארון", written as the book writes it;
      // BESIDE the ark, as the book stands them: the silver posts, Rabbi Meir "עמודין היכא הוו קיימי? מבראי" (14a "עמודיו עשה כסף"); and what Yoma 52b lists:
      // "צנצנת המן, וצלוחית שמן המשחה, ומקלו של אהרן ושקדיה ופרחיה, וארגז ששגרו פלשתים" - before the ark (Ex 16:33 "והנח אתו לפני יהוה", Rashi "לפני
      // הארון"; Num 17:25 "לפני העדות"), the chest at its side, to the south (I Sam 6:8 "בארגז מצדו"). Their sizes and places: model choices after the book.
      {
        const open = new Group();
        open.name = "arkInside";
        open.visible = false;
        g.add(open);
        ctx.layers.arkInside = open;
        const TF = 1 / 6, yf = ay + ARK_T;                               // a tefach; the ark's inner floor
        const zN = -ARK_L / 2 + ARK_T;                                   // the inner face of the north wall: -1.1667
        const sapphire = new MeshStandardMaterial({ color: 0x2348b4, roughness: 0.28, metalness: 0.15, emissive: 0x0c1f66, emissiveIntensity: 0.7 });
        const tabletTex = (letters) => int_canvasTex(512, 512, (c, w, h) => {   // 1.0.1-L (the user: "כתוב את הדברות"): the opening words of the ten, not letters
          const gr = c.createLinearGradient(0, 0, w, h);
          gr.addColorStop(0, "#1c3aa6"); gr.addColorStop(0.5, "#3a63d8"); gr.addColorStop(1, "#1a3496");
          c.fillStyle = gr;
          c.fillRect(0, 0, w, h);
          c.fillStyle = "#e8eefc";
          c.font = "bold 60px 'Frank Ruhl Libre', David, 'Times New Roman', serif";
          c.direction = "rtl";
          c.textAlign = "center";
          c.textBaseline = "middle";
          letters.forEach((ch, i) => c.fillText(ch, w / 2, 62 + i * 97));
        }).map;
        const tablet = (zc, letters) => {
          const top = new MeshStandardMaterial({ map: tabletTex(letters), roughness: 0.3, metalness: 0.1, emissive: 0x0c1f66, emissiveIntensity: 0.35 });
          const m = new Mesh(new BoxGeometry(6 * TF, 3 * TF, 6 * TF), [sapphire, sapphire, top, sapphire, sapphire, sapphire]);
          m.position.set(ARK_X, yf + 3 * TF + 1.5 * TF, zc);
          m.rotation.y = Math.PI / 2;                                    // the letters read from the east, their tops to the west
          m.name = "ark-tablet";
          open.add(m);
          tabletsMine.push(m);
        };
        const tabletsMine = [];
        tablet(zN + 3 * TF, ["אנכי ה׳ אלקיך", "לא יהיה לך", "לא תשא", "זכור את יום השבת", "כבד את אביך"]);                   // the first on the viewer's right (north): Hebrew reads from the right
        tablet(zN + 9 * TF, ["לא תרצח", "לא תנאף", "לא תגנב", "לא תענה", "לא תחמד"]);
        // the broken tablets: two layers of shards, three tefachim high, showing a little past the whole tablets' sides
        const shardShape = new Shape();
        [[-0.5, -0.35], [-0.2, -0.5], [0.3, -0.42], [0.5, -0.1], [0.38, 0.4], [-0.05, 0.5], [-0.45, 0.28]].forEach(([px, pz], i) => (i ? shardShape.lineTo(px, pz) : shardShape.moveTo(px, pz)));
        shardShape.closePath();
        const shardGeo = new ExtrudeGeometry(shardShape, { depth: 1, bevelEnabled: false });
        shardGeo.rotateX(-Math.PI / 2);
        const shards = [];
        for (let ly = 0; ly < 2; ly++) for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) {
          const q = ly * 8 + i * 2 + (sd > 0 ? 1 : 0);
          shards.push(int_m4(ARK_X + sd * 0.27, yf + ly * 1.5 * TF, zN + 0.25 + i * 0.5, 0, ((q * 37) % 11 - 5) * 0.05, 0, 0.56, 1.5 * TF - 0.005, 0.5));
        }
        int_inst(open, shardGeo, sapphire, shards).name = "ark-broken-tablets";
        // the Torah scroll, lying across the ark in the two tefachim at the south end
        const parchment = new MeshStandardMaterial({ color: 0xEFE6CC, roughness: 0.75, emissive: 0x3a3424, emissiveIntensity: 0.35 });
        const scroll = new Mesh(new CylinderGeometry(TF, TF, 6 * TF, 28), parchment);
        scroll.rotation.z = Math.PI / 2;
        scroll.position.set(ARK_X, yf + TF, -zN - TF);
        scroll.name = "ark-torah-scroll";
        open.add(scroll);
        // 1.2.0 (the user; Bava Batra 14a-b): TWO readings of what lay in the ark and how - ctx.shared.arkLayout (a row of the opinions table).
        // R. Meir (an amah of six handbreadths; the model so far): the ark 15 x 9 x 9 tefachim; the tablets 6 x 6 x 3 along its length, 12
        //   of the 15, a tefach for the walls, and "נשתיירו שם שני טפחים שבהן ספר תורה מונח" - the scroll INSIDE, at the south end, "מן הצד";
        //   the broken tablets under them (Rav Huna, "יושב הכרובים"); the silver pillars "מבראי" - outside.
        // R. Yehuda (an amah of five): the ark 12.5 x 7.5 x 7.5; the tablets 12 along the length and half a tefach for the walls; across: 6 for
        //   the tablets, a tefach for the silver pillars (Song 3:10 "עמודיו עשה כסף") INSIDE, half for the walls; the scroll NOT inside -
        //   "ארגז ששיגרו פלשתים דורון לאלהי ישראל מונח בצדו... ועליו ספר תורה מונח - מצד הוא מונח ולא בתוכו"; the broken tablets inside
        //   ("אין בארון רק" - לרבות שברי לוחות). In the model the ark's outer size stays (2.5 x 1.5 amot); the tablets grow to 5-tefach amot.
        {
          const TF5 = 0.2;                                                    // a tefach of an amah of five
          const silver = new MeshStandardMaterial({ color: 0xf2f4f6, roughness: 0.28, metalness: 0.75, emissive: 0x30343a, emissiveIntensity: 0.4 });
          const amudim = new Group();
          amudim.name = "ark-amudim";
          for (const dz of [-0.45, 0.45]) {                                  // two silver pillars, in the tefach beside the tablets (the west side)
            const a = new Mesh(new CylinderGeometry(0.055, 0.055, ARK_H - 2 * ARK_T - 0.1, 10), silver);
            a.position.set(ARK_X - ARK_W / 2 + ARK_T + 0.12, yf + (ARK_H - 2 * ARK_T - 0.1) / 2, dz);
            amudim.add(a);
          }
          amudim.visible = false;
          open.add(amudim);
          // the Philistines' chest (I Sam 6:8 "ואת כלי הזהב... תשימו בארגז מצדו") beside the ark, on the west, with the scroll on it
          const argaz = new Group();
          argaz.name = "ark-argaz";
          const chestMat = new MeshStandardMaterial({ color: 0x6b4a2a, roughness: 0.8 });
          const cb = new Mesh(new BoxGeometry(0.9, 0.55, 0.6), chestMat);
          cb.position.set(ARK_X - ARK_W / 2 - 0.62, F + ROCK_H + 0.275, 0);
          cb.castShadow = cb.receiveShadow = true;
          argaz.add(cb);
          const sc2 = new Mesh(new CylinderGeometry(0.17, 0.17, 1.0, 24), parchment);   // the scroll, lying on the chest along z
          sc2.rotation.x = Math.PI / 2;
          sc2.position.set(ARK_X - ARK_W / 2 - 0.62, F + ROCK_H + 0.55 + 0.17, 0);
          argaz.add(sc2);
          argaz.visible = false;
          g.add(argaz);
          const LAYOUT = {
            current: "meir",
            keys: ["meir", "yehuda"],
            names: { meir: "רבי מאיר — ספר התורה בתוך הארון", yehuda: "רבי יהודה — ספר התורה על הארגז שבצדו" },
            info: {
              meir: "רבי מאיר — אמה בת ששה טפחים: **הארון חמישה עשר על תשעה על תשעה טפחים**.\nהלוחות — 'ארכן ששה ורחבן ששה ועביין שלשה' — מונחות לאורכו: שתים עשרה מתוך חמש עשרה, וטפח לשני הכתלים; 'נשתיירו שם שני טפחים שבהן ספר תורה מונח' — ספר התורה בתוך הארון, בקצהו, 'מן הצד'. וברוחב, אחרי הלוחות והכתלים, שני טפחים פנויים 'שלא יהא ספר תורה נכנס ויוצא כשהוא דחוק'.\nשברי הלוחות מונחים בארון (רב הונא: 'יושב הכרובים'); העמודים — 'מבראי', מחוץ לארון (בבא בתרא יד.–יד:).",
              yehuda: "רבי יהודה — אמה בת חמישה טפחים: **הארון שנים עשר וחצי על שבעה וחצי על שבעה וחצי**.\nהלוחות שתים עשרה לאורכו, וחצי טפח לכתלים. ברוחב — שישה ללוחות, טפח לעמודי הכסף שבתוך הארון ('עמודיו עשה כסף', שיר השירים ג, י), וחצי טפח לכתלים.\nספר התורה אינו בארון: 'ארגז ששיגרו פלשתים דורון לאלהי ישראל מונח בצדו... ועליו ספר תורה מונח — מצד הוא מונח ולא בתוכו'; ושברי הלוחות בארון ('אין בארון רק' — לרבות שברי לוחות) (בבא בתרא יד.–יד:).\nבמודל: הארגז ממערב לארון; הלוחות בטפחי אמה בת חמישה."
            },
            set(key) {
              if (!(key in this.info)) return false;
              this.current = key;
              const y5 = key === "yehuda";
              const tf = y5 ? TF5 : TF, k = tf / TF;
              tabletsMine.forEach((m, i) => {
                m.scale.set(k, k, k);
                m.position.set(ARK_X, yf + 3 * TF + 1.5 * tf, zN + (i === 0 ? 3 : 9) * tf);
              });
              scroll.visible = !y5;
              amudim.visible = y5;
              argaz.visible = y5;
              return true;
            }
          };
          ctx.shared.arkLayout = LAYOUT;
        }
        // the parchment, lying over the join of the tablets at their west side
        const cardGeo = new PlaneGeometry(0.56, 0.42, 12, 4);
        cardGeo.rotateX(-Math.PI / 2);
        { const p = cardGeo.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, 0.02 * Math.sin((p.getX(i) / 0.56 + 0.5) * Math.PI)); cardGeo.computeVertexNormals(); }
        const card = new Mesh(cardGeo, new MeshStandardMaterial({
          map: int_canvasTex(320, 236, (c, w, h) => {
            c.fillStyle = "#efe6cc";
            c.fillRect(0, 0, w, h);
            c.fillStyle = "#2a2118";
            c.font = "bold 62px 'Frank Ruhl Libre', David, 'Times New Roman', serif";
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.direction = "rtl";
            c.fillText("השם", w / 2, h * 0.32);
            c.fillText("וכל כינויו", w / 2, h * 0.68);
          }).map,
          side: DoubleSide, roughness: 0.8, emissive: 0x3a3424, emissiveIntensity: 0.35
        }));
        card.position.set(ARK_X - 0.24, yf + 6 * TF + 0.012, zN + 6 * TF);
        card.rotation.y = Math.PI / 2;
        card.name = "ark-name-parchment";
        open.add(card);
        // the crown's teeth round the open ark
        const teeth = [];
        const rimX = ARK_W / 2 - ARK_T / 2, rimZ = ARK_L / 2 - ARK_T / 2, TOOTH = 0.1;
        for (let i = 0, n = Math.round(2 * rimZ / TOOTH); i <= n; i++) for (const sd of [-1, 1]) teeth.push(int_m4(ARK_X + sd * rimX, ay + ARK_H + 0.03, -rimZ + i * 2 * rimZ / n));
        for (let i = 1, n = Math.round(2 * rimX / TOOTH); i < n; i++) for (const sd of [-1, 1]) teeth.push(int_m4(ARK_X - rimX + i * 2 * rimX / n, ay + ARK_H + 0.03, sd * rimZ));
        int_inst(open, new ConeGeometry(0.045, 0.07, 4), vesselGold, teeth, false).name = "ark-crown-teeth";
        // the chest at the ark's south side (clear under the staff)
        H.box(open, 0.9, 0.42, 0.72, vesselGold, ARK_X, FL, 1.98);
        H.box(open, 0.96, 0.07, 0.78, vesselGold, ARK_X, FL + 0.42, 1.98);
        // the silver posts
        const silver = new MeshStandardMaterial({ color: 0xEEF2F6, metalness: 0.55, roughness: 0.3, emissive: 0x6a7076, emissiveIntensity: 0.6 });
        for (const zp of [-0.5, -0.82]) {
          const post = new Mesh(new CylinderGeometry(0.05, 0.05, 0.8, 16), silver);
          post.position.set(-57.15, FL + 0.4, zp);
          post.name = "ark-silver-post";
          open.add(post);
          const cap = new Mesh(new SphereGeometry(0.05, 16, 8), silver);
          cap.position.set(-57.15, FL + 0.8, zp);
          open.add(cap);
        }
        // the jar of manna, Rashi Ex 16:33 "צלוחית של חרס", its lid and foot gold as the book draws them
        const clayPale = new MeshStandardMaterial({ color: 0xD9D2C2, roughness: 0.6, emissive: 0x2c2a24, emissiveIntensity: 0.4 });
        const jar = new Mesh(new LatheGeometry([[0, 0], [0.13, 0], [0.16, 0.05], [0.17, 0.16], [0.16, 0.27], [0, 0.27]].map((q) => new Vector2(q[0], q[1])), 28), clayPale);
        jar.position.set(-57.1, FL + 0.03, 0.02);
        jar.name = "ark-manna-jar";
        open.add(jar);
        const jarFoot = new Mesh(new CylinderGeometry(0.16, 0.17, 0.03, 28), vesselGold);
        jarFoot.position.set(-57.1, FL + 0.015, 0.02);
        const jarLid = new Mesh(new SphereGeometry(0.165, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), vesselGold);
        jarLid.scale.y = 0.42;
        jarLid.position.set(-57.1, FL + 0.3, 0.02);
        open.add(jarFoot, jarLid);
        // the flask of anointing oil: a jug with a spout to the south and a handle to the north, as the book draws it
        const clay = new MeshStandardMaterial({ color: 0xCF9C8B, roughness: 0.55, emissive: 0x33201a, emissiveIntensity: 0.4 });
        const jugGeo = new LatheGeometry([[0, 0], [0.1, 0], [0.13, 0.03], [0.19, 0.16], [0.2, 0.26], [0.15, 0.38], [0.085, 0.46], [0.075, 0.52], [0.1, 0.6], [0.085, 0.605], [0.06, 0.52], [0, 0.5]].map((q) => new Vector2(q[0], q[1])), 32);
        { const p = jugGeo.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y > 0.5) { const a = Math.atan2(p.getX(i), p.getZ(i)), k = 1 + 0.75 * Math.pow(Math.max(0, Math.cos(a)), 6) * (y - 0.5) / 0.1; p.setZ(i, p.getZ(i) * k); } } jugGeo.computeVertexNormals(); }
        const jug = new Mesh(jugGeo, clay);
        jug.name = "ark-oil-flask";
        const jugHandle = new Mesh(int_taperTube([[0.5, -0.07], [0.58, -0.17], [0.54, -0.27], [0.4, -0.28], [0.28, -0.24], [0.2, -0.19]].map((q) => new Vector3(0, q[0], q[1])), [0.02, 0.02, 0.02, 0.02, 0.02, 0.018], 8), clay);
        const jugG = new Group();
        jugG.position.set(-57.2, FL, 0.46);
        jugG.add(jug, jugHandle);
        open.add(jugG);
        // Aaron's staff, lying before them: Num 17:23 "ויצא פרח ויצץ ציץ ויגמל שקדים"; Yoma 52b "ומקלו של אהרן ושקדיה ופרחיה"
        const S0 = new Vector3(-56.62, FL + 0.05, 1.05), S1 = new Vector3(-56.12, FL + 0.035, -0.62), perp = new Vector3(S1.z - S0.z, 0, S0.x - S1.x).normalize();
        const wood = new MeshStandardMaterial({ color: 0x8a5c33, roughness: 0.7, emissive: 0x241608, emissiveIntensity: 0.4 });
        const stPts = [], stRad = [];
        for (let i = 0; i <= 12; i++) { const t = i / 12; stPts.push(new Vector3().lerpVectors(S0, S1, t)); stRad.push(0.045 - 0.018 * t); }
        const staffM = new Mesh(int_taperTube(stPts, stRad, 10), wood);
        staffM.name = "ark-aaron-staff";
        open.add(staffM);
        const petals = [], hearts = [], leaves = [], almonds = [];
        for (let i = 0; i < 13; i++) {
          const t = (i + 0.5) / 13, sd = i % 2 ? 1 : -1, Q = new Vector3().lerpVectors(S0, S1, t), fx = Q.x + perp.x * sd * 0.08, fz = Q.z + perp.z * sd * 0.08, fy = FL + 0.1;
          for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + i; petals.push(int_m4(fx + Math.cos(a) * 0.032, fy, fz - Math.sin(a) * 0.032, 0, a, 0, 0.036, 0.011, 0.024)); }
          hearts.push(int_m4(fx, fy + 0.008, fz, 0, 0, 0, 0.016, 0.012, 0.016));
          for (const k of [-1, 1]) leaves.push(int_m4(Q.x + perp.x * sd * 0.05 + k * 0.05, FL + 0.055, Q.z + perp.z * sd * 0.05 + k * 0.03, 0, i + k, 0, 0.06, 0.008, 0.022));
          if (i % 3 === 1) almonds.push(int_m4(Q.x - perp.x * sd * 0.075, FL + 0.06, Q.z - perp.z * sd * 0.075, 0, i, 0, 0.042, 0.03, 0.028));
        }
        const dot = new SphereGeometry(1, 10, 7);
        int_inst(open, dot, new MeshStandardMaterial({ color: 0xF4C6D2, roughness: 0.6, emissive: 0x4a2a33, emissiveIntensity: 0.5 }), petals, false);
        int_inst(open, dot, new MeshStandardMaterial({ color: 0xE3B13A, roughness: 0.6 }), hearts, false);
        int_inst(open, dot, new MeshStandardMaterial({ color: 0x5C8A3C, roughness: 0.6, emissive: 0x16240c, emissiveIntensity: 0.5 }), leaves, false);
        int_inst(open, dot, new MeshStandardMaterial({ color: 0x9DB86A, roughness: 0.55, emissive: 0x20280f, emissiveIntensity: 0.4 }), almonds, false);
        const LBL = 0.27;
        ctx.labels.push(
          { text: "שני לחות האבנים (ח, ט)", x: ARK_X, y: ay + 0.95, z: -2.45, size: LBL, layer: "arkInside" },
          { text: "תחתיהם: שברי הלוחות (מנחות צט.)", x: ARK_X, y: ay + 0.65, z: -2.6, size: LBL, layer: "arkInside" },
          { text: "השם וכל כינויו (בבא בתרא יד:)", x: ARK_X - 0.62, y: ay + 1.62, z: -0.17, size: LBL, layer: "arkInside" },
          { text: "ספר התורה (בבא בתרא יד.)", x: ARK_X - 0.3, y: ay + 1.6, z: 1.85, size: LBL, layer: "arkInside" },
          { text: "הארגז (שמואל א ו, ח)", x: ARK_X, y: FL + 0.75, z: 2.1, size: LBL, layer: "arkInside" },
          { text: "העמודים (בבא בתרא יד.)", x: -57.1, y: FL + 1, z: -1.05, size: LBL, layer: "arkInside" },
          { text: "צנצנת המן (שמות טז, לג)", x: -56.72, y: FL + 0.42, z: -0.2, size: LBL, layer: "arkInside" },
          { text: "צלוחית שמן המשחה (יומא נב:)", x: -56.95, y: FL + 0.72, z: 0.82, size: LBL, layer: "arkInside" },
          { text: "מקל אהרן ושקדיה ופרחיה (יומא נב:)", x: -55.8, y: FL + 0.2, z: 0.2, size: LBL, layer: "arkInside" }
        );
        ctx.shared.arkInside = {
          on: false,
          set(v) {                                                       // never automatic: only from the pill (and the UI's own slide, which restores it)
            this.on = !!v;
            open.visible = this.on;
            arkLid.visible = !this.on;
          }
        };
        const arkInsideAnchor = [ARK_X + ARK_W / 2 + 0.1, ay + ARK_H * 0.5, 0];
        ctx.shared.modelButtons.push({
          id: "arkInside",
          label: "הצג מה שבתוך הארון",
          labelOn: "הסתר את מה שבתוך הארון",
          title: "הכפורת מוסרת ונראה מה שבתוך הארון: 'אין בארון רק שני לחות האבנים' (מלכים א ח, ט); 'מלמד שהלוחות ושברי לוחות מונחין בארון' (מנחות צט.), 'תחת הלוחות' (רש״י בבא בתרא יד:); " +
            "'ספר תורה שמונח בארון' (בבא בתרא יד., דברי רבי מאיר); 'שהשם וכל כינויו מונחין בארון' (שם יד:). לידו: העמודים ('מבראי', שם יד:), צנצנת המן, צלוחית שמן המשחה, מקל אהרן והארגז (יומא נב:)",
          anchor: arkInsideAnchor,
          maxDist: 40,
          get: () => ctx.shared.arkInside.on,
          set: (on) => ctx.shared.arkInside.set(on)
        });
      }
      const devirLight = new PointLight(0xFFE0A0, 9, 40, 1.8);
      devirLight.position.set(cx, F + DH - 4, 0);
      g.add(devirLight);
      // 1.2.0 (the user: "אבן השתיה - אני רוצה שתציג את האבן"): the place lifts the ark off the stone for 15 s (70-ui.js feature arkLift) - every
      // part that stands on the ark's footprint (the body, the kaporet with its cherubim, the rings, what is inside) goes up 3 amot; the
      // stone, the staffs and the big cherubim stay. The parts are found by their bounds once, when first lifted.
      {
        const LIFT = 3, parts = [];
        let found = false, up = false;
        const bx = new Box3();
        const find = () => {
          found = true;
          for (const o of g.children.concat(ctx.shared.houseSlope && ctx.shared.houseSlope.group ? ctx.shared.houseSlope.group.children : [])) {   // 1.3.5: the sloping floor's group too
            if (o === rock || o.name === "even-shetiya" || o.isLight || o.name === "houseSlope" || o.name === "houseSlopeWedge") continue;
            try { bx.setFromObject(o); } catch (_) { continue; }
            if (bx.isEmpty()) continue;
            if (bx.min.x > ARK_X - 1.6 && bx.max.x < ARK_X + 1.6 && bx.min.z > -1.9 && bx.max.z < 1.9 && bx.min.y > F - 0.05 && bx.max.y < F + 8) parts.push(o);
          }
        };
        ctx.shared.arkLift = {
          get: () => up,
          set: (v) => {
            v = !!v;
            if (v === up) return;
            if (!found) find();
            up = v;
            for (const o of parts) o.position.y += v ? LIFT : -LIFT;
          }
        };
      }
    }
    const kodeshLight = new PointLight(0xFFE0A0, 12, 50, 1.8);          // reference values (ref-heichal-bayit2.js), lowered to our ceiling
    kodeshLight.position.set((XE + XW) / 2, F + KH - 4, 0);
    g.add(kodeshLight);
    ctx.shared.devirCenter = { x: DEVIR_CX, y: F + DH / 2, z: 0 };     // {-54, 22, 0}: used by the UI's cloud
    ctx.shared.arkX = ARK_X;                                            // -58.5: the ark / even shetiya / cherubim line (70-ui.js place targets)

    // ---- labels, fly points, cutaway ----
    ctx.labels.push(
      { text: "ההיכל", x: (XE + XW) / 2, y: F + KH - 1.5, z: 0, size: 3.5 },   // 1.0.1: "ההיכל" = the kodesh itself (the user); the whole house is "בית ה׳" (50-heichal.js)
      { text: "קודש הקדשים", x: DEVIR_CX, y: F + DH - 1.5, z: 0, size: 3.5 },
      { text: "פתח ההיכל (מזוזות רבועות)", x: CO.xHouseE + 1.5, y: F + INT_HEI_DOOR_H + 2.5, z: 0, size: 2.2 },
      { text: "רתוקות הזהב", x: XW + 1.2, y: F + 17, z: -6, size: 1.8 },
      { text: "אמה טרקסין", x: XW + 0.8, y: F + INT_DEVIR_DOOR_H + 4.5, z: 0, size: 2.4 },   // 1.0.1-H: on the wall right above the doorway (y 28.5)
      { text: "פתוחי מקלעות כרובים ותמרות ופטורי ציצים (ו, כט)", x: (XE + XW) / 2, y: F + 22, z: -HW + 1.2, size: 1.6 },   // 1.0.1-H: the carved north wall
      { text: "פתח הדביר (מזוזות חמישית)", x: XW + 1.5, y: F + INT_DEVIR_DOOR_H + 3.2, z: 0, size: 2 },   // 1.0.1-L (verifier of L.32): over the lintel and off the chain bar at y 26, which ran through its letters
      { text: "הפרוכת", x: XW + 1.2, y: F + 9, z: 0, size: 1.8 },
      { text: "הכרובים", x: ARK_X, y: F + 12, z: 0, size: 2.4 },
      { text: "הארון ובדיו", x: ARK_X + 4, y: F + 4, z: 0, size: 1.8, layer: "arkLid" },
      { text: "אבן השתייה", x: ARK_X, y: F + 0.9, z: 2.6, size: 1.4, layer: "arkLid" }
    );
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    // (1.0.1-K, K.4: "shulchanot", "shulchanMoshe", "menorot" and "incenseAltar" follow the kodesh layout - FP_BY_LAYOUT above)
    // 1.0.1-K (K.5, FIXES K.5.5): every interior view works with the house CLOSED - the camera inside the room and nothing between it and
    // its target (ray-tested with all the layouts, readings, bread sets and layers: K.5 checks). devirDoor and traksinTop aimed inside the
    // traksin wall (x -44: their rays ended in the parochet / the wall's face) - now on the faces; carvings moved off the wall-layers
    // exhibit to the east part of the north wall (a palm between two pairs of cherubim); wallLayers is new.
    Object.assign(ctx.shared.flyPoints, {
      kodesh: { pos: [-8, 34, 0], target: [-28, 24, 0] },
      kodeshHakodashim: { pos: [-46, 30, 6], target: [-56, 22, 0] },
      heichalDoor: { pos: [9, 26, 0], target: [-1, 22, 0] },                // from inside the ulam (x 2.5..12.5), between Yachin and Boaz
      // the doorway with its posts and the parochet's face, from the heichal. 1.0.1-L (L.32, L.54): the whole height in the frame - the new
      // lintel at the top (y 24..25.54), the swellings of the staffs at the bottom (y ~12.9); K.5: [-28, 22, 3] -> [-43.3, 19, 0]. From the
      // south-east (z 6.5): the incense column stands on the axis before the curtain (x -39), so from the axis it crossed the curtain's middle;
      // now it crosses its south third (2.3 from the middle at the curtain), and the middle with the swellings and the eagles is clear
      devirDoor: { pos: [-24.5, 20.6, 0], target: [-43.4, 19.2, 0] },   // 1.2.0 (the user): centred on the axis; the smoke is hidden by the place
      // the carved north wall, close: a palm between two pairs of cherubim (the palm at x -14, the pairs at -16.5 and -11.5). 1.0.1-L (L.31):
      // back at K.5's view - the wall-layers window now spans x -21.5..-9.5 around it, but it is an option (default all gold, and a place that
      // switches it on switches it off again, L.27); with the layers on, this view shows the window
      carvings: { pos: [-12, 18.2, 0.5], target: [-14.5, 16.6, -9.8] },
      // from just inside the devir door (between its open leaves). 1.0.1-L (L.30): from above the wings' plane (y 20.6), looking down at the
      // horizontal canopy, the faces, the bodies and the ark (K: [-45.4, 18.4, 2.3] -> [-58.6, 18.6, -0.6], at eye level - level wings seen
      // edge-on); the target just over the meeting of the inner wings
      cherubim: { pos: [-45.6, 26.5, 3.4], target: [-58.8, 20.9, 0] },
      // 1.0.1-L (L.85): the open ark from above and from the east, under the great wings (y 20.5) - steep, so that the scroll on the ark's floor shows
      // over the east wall; the target on the ark's east face, so that the ray is clear with the ark closed too (the UI's L.90 table, pill "arkInside")
      arkInside: { pos: [-56, 17.6, 0.9], target: [-57.6, 12.8, 0.1] },
      traksinTop: { pos: [-30, 36, 3], target: [-43.4, 31, 0] },            // the traksin above the doorway, from the heichal (its face at x -43.5)
      // its eagles, from the heichal (over the golden altar). 1.0.1-L (L.54): a little lower, so that the swellings of the staffs' ends are in
      // the frame with the eagles (K: [-35.5, 18.2, 2.6] -> [-43.4, 17.6, 0])
      parochet: { pos: [-35.5, 17.2, 2.8], target: [-43.4, 16.2, 0] },
      parochetDevir: { pos: [-50.5, 17.6, 2.2], target: [-44, 17.6, 0] },  // 1.0.1-K: its lions, from inside the devir (between the open doors)
      // the stepped window in the north wall and the floor before it - 1.0.1-L (L.14): FRONTALLY, from 0.5 inside the south skin: the whole
      // window (y 12..26) and the floor's staircase (z -10..-5.2) fill the height of the view (vertical field 48 deg, 90-entry.js)
      wallLayers: { pos: [WL.x0 + WL.w / 2, 20.4, HW - SKIN - 0.5], target: [WL.x0 + WL.w / 2, 17.86, -HW] }
    });
    // 1.3.5 (the user, 10.11.2026 22:12: "פשפשים וכו להוסיף"; as in the Second Temple's model): THE SLAB OF THE SOTAH'S DUST - Sotah 2:2
    // (book 67, line 13) "נכנס להיכל ופנה לימינו, ומקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה"; Rashi, Sotah 15b (book
    // 2172, line 851): "לאחזה בטבעתה ולהגביהה מבין הרצפה שהיא כולה באבני שיש". To the right of him who enters = the north: a marble
    // tablet of an amah with a ring, in the floor by the door. Rashi's floor is marble; this house's is gold over cypress (I Kings
    // 6:15, 6:30) - carried over at the user's word; the exact spot - a model choice. Built before the floor's slope (below), so it
    // rises with the floor.
    {
      const sx = XE - 3.5, sz = -7.4;
      H.box(g, 1.14, 0.07, 1.14, new MeshBasicMaterial({ color: 0x15110b }), sx, F, sz).name = "sotahSlabRim";
      H.box(g, 1, 0.11, 1, M.marble, sx, F, sz).name = "sotahSlab";
      H.ring(g, 0.18, 0.04, M.bronze, sx, F + 0.15, sz).name = "sotahRing";
      ctx.labels.push({ text: "טבלא של שיש וטבעת — עפר הסוטה", x: sx, y: F + 1.7, z: sz, size: 0.9 });
    }
    // 1.3.5 (the user, of the kuntres "בגדרי ודיני צורת הבית", point 24 and its author's first note: "חובה לשנות"; "בשניהם"): THE HOUSE'S FLOOR
    // SLOPES UP TO THE WEST - Rashi Menachot 99a "כתלמיד היושב לפני רבו - נמוך הימנו, כך אותם של שלמה נמוכין משל משה, דבית המקדש היה משופע
    // ולצד מערב מגביה יותר" (book 2186, line 4703), "ומיתתי ליה פורתא - מושיבם לצד מזרח במקום נמוך" (line 4704). From the heichal's door
    // (XE) to the devir's west wall (XDW); how much is not stated - 4 amot on the 60 (the user, 20:12: "שיפוע 4 אמות מספיק"; 1.5 was hardly seen), a model choice.
    // HOW: everything of this module that STANDS ON THE FLOOR inside the house - the floor's own skins, the tables, the menorot, the golden
    // altar, the ark with its staffs and their swellings, the cherubim, the stone - moves into one group whose matrix is a shear
    // (y' = y + k (XE - x)): each thing rises by the floor's rise at its place and stands on the slope. What is fixed to the building - the
    // walls' skins, the doors, the parochet, the ceilings - stays (their feet are covered by the rising floor). Found by their bounds: inside
    // the house's inner footprint, the bottom within 1.3 of the floor, no higher than 11.5 (the cherubim are 10). A wedge of the cypress
    // boards fills the room under the gold skin (I Kings 6:15 "ויצף את קרקע הבית בצלעות ברושים").
    {
      const SL = { x0: XE, x1: XDW, rise: 4 };
      const k = SL.rise / (SL.x0 - SL.x1);
      const hr = (x) => SL.rise * Math.max(0, Math.min(1, (SL.x0 - x) / (SL.x0 - SL.x1)));
      const slopeG = new Group();
      slopeG.name = "houseSlope";
      slopeG.matrixAutoUpdate = false;
      slopeG.matrix.set(1, 0, 0, 0, -k, 1, 0, k * SL.x0, 0, 0, 1, 0, 0, 0, 0, 1);
      g.updateMatrixWorld(true);
      const bb = new Box3(), moved = [];
      for (const o of g.children.slice()) {
        if (o.isLight || o.isSprite) continue;
        try { bb.makeEmpty(); bb.setFromObject(o); } catch (_) { continue; }
        if (bb.isEmpty()) continue;
        const inside = bb.max.x <= SL.x0 + 0.6 && bb.min.x >= SL.x1 - 0.6 && bb.min.z >= -HW - 0.3 && bb.max.z <= HW + 0.3;
        const low = bb.min.y >= F - 0.3 && bb.min.y <= F + 1.3 && bb.max.y - bb.min.y <= 11.5;
        // 1.3.5 (the place scan): the two layouts of the heichal's vessels stand on the floor too - their bounds are high (the pillar of
        // smoke over the golden altar reaches the ceiling) - and the great cherubim's wings belong to their bodies
        const named = inside && (/^kodesh-/.test(o.name || "") || o.name === "cherub-wings");
        if (inside && (low || named)) moved.push([o, +(bb.max.x - bb.min.x).toFixed(1), +(bb.max.y - bb.min.y).toFixed(2), +(bb.max.z - bb.min.z).toFixed(1), +((bb.min.x + bb.max.x) / 2).toFixed(1), bb.clone()]);
      }
      // 1.3.5 (the place scan): and what LIES ON a thing that rose rises with it - the ark's cover with its cherubim and the ark's rim
      // (they begin 1.5 over the floor): inside the plan of a risen thing that is not a floor skin, its foot no higher than that thing's head
      {
        const carriers = moved.filter((m) => m[5] && m[2] > 0.5 && m[1] * m[3] < 60 && m[2] <= 11.5);
        const b2 = new Box3();
        for (const o of g.children.slice()) {
          if (o.isLight || o.isSprite || moved.some((m) => m[0] === o)) continue;
          try { b2.makeEmpty(); b2.setFromObject(o); } catch (_) { continue; }
          if (b2.isEmpty() || b2.max.y - b2.min.y > 4) continue;
          const on = carriers.some((m) => b2.min.x >= m[5].min.x - 0.4 && b2.max.x <= m[5].max.x + 0.4 && b2.min.z >= m[5].min.z - 0.4 && b2.max.z <= m[5].max.z + 0.4 && b2.min.y >= m[5].min.y && b2.min.y <= m[5].max.y + 0.4);
          if (on) moved.push([o, +(b2.max.x - b2.min.x).toFixed(1), +(b2.max.y - b2.min.y).toFixed(2), +(b2.max.z - b2.min.z).toFixed(1), +((b2.min.x + b2.max.x) / 2).toFixed(1), null]);
        }
      }
      g.add(slopeG);
      for (const m of moved) slopeG.add(m[0]);
      slopeG.updateMatrixWorld(true);
      // 1.3.5 (the place scan): the gold keys of the devir's doors hang two amot over the floor - they go up with it on their leaves (the
      // doors themselves are fixed to the wall, and the floor covers their feet)
      {
        const wp = new Vector3();
        g.traverse((o) => {
          if (o.name !== "goldKey" || o.userData.slopeUp) return;
          o.getWorldPosition(wp);
          if (wp.x <= SL.x0 && wp.x >= SL.x1 && Math.abs(wp.z) <= HW) { o.position.y += hr(wp.x); o.userData.slopeUp = true; }
        });
      }
      const sh = new Shape();
      const L = SL.x0 - SL.x1;
      sh.moveTo(0, 0); sh.lineTo(-L, 0); sh.lineTo(-L, SL.rise); sh.closePath();
      const wg = new ExtrudeGeometry(sh, { depth: 2 * HW - 0.1, bevelEnabled: false });
      wg.translate(SL.x0, F - 0.02, -(HW - 0.05));
      const wedge = new Mesh(wg, cypressMat);
      wedge.name = "houseSlopeWedge";
      wedge.receiveShadow = true;
      g.add(wedge);
      // the names in the air over what rose: the labels of this module that stand inside the house, low
      for (const l of ctx.labels) {
        if (!l || l.__slope || typeof l.x !== "number" || typeof l.y !== "number") continue;
        if (l.x <= SL.x0 && l.x >= SL.x1 && Math.abs(l.z || 0) <= HW && l.y <= F + 13) { l.y += hr(l.x); l.__slope = true; }
      }
      ctx.shared.houseSlope = { rise: SL.rise, x0: SL.x0, x1: SL.x1, hw: HW, floor: F, at: hr, group: slopeG, moved: moved.map((m) => [m[0].name || m[0].type, m[1], m[2], m[3], m[4]]) };
    }
    for (const m of cut) ctx.cutaway.push(m);
  }
