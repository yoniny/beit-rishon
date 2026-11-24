  // ===== 20-mount.js: the mount, the great court (החצר הגדולה) and the outer court (החצר החיצונה) =====
  // Builds: terrain, the 500 x 500 platform with its foundation walls, the great court wall (bands of 3 stone courses + 1 cedar
  // course) with four gates (plain wooden doors - DOORS_WOOD_D) and exterior steps, and the outer court east of the inner court with its uses (1.0.1):
  // chambers (לשכות), the king's "עמוד" and the donation chest.
  // Sources used in this file:
  //   The outer court itself is only IMPLIED by the sources: Rashi on I Kings 6:36 "החצר הפנימית - קורא אותה פנימית לפי שהיתה לפנים
  //   מעזרת נשים" (an "inner" court implies an outer one). Its 500 x 500 is Middot 2:1 (user decision; Kings gives no measure for it).
  //   I Kings 7:12  "וחצר הגדולה סביב שלשה טורים גזית וטור כרתת ארזים ולחצר בית ה' הפנימית ולאלם הבית" - NOTE: per the chosen commentators
  //   "וחצר הגדולה" there is the wall around the KING'S houses (Metzudat David [562] "אשר היה מסבב כל בתי המלך"; Malbim [354]; Ralbag [236]),
  //   and the verse applies the 3 + 1 pattern to the Temple's INNER court and to the ulam (30-courts.js, 50-heichal.js). Rashi on 7:12
  //   "החומה עשויה שלשה נדבכין של אבנים ונדבך של עץ עליהם" and Metzudat David on 7:12 "וכמו כן עד כלות גובה הכתלים" describe that pattern;
  //   the outer court wall here repeats it BY ANALOGY ("באותו דגם", model choice - the user's decision sheet item 8), not as a verse citation.
  //   II Chr 4:9  "ויעש חצר הכהנים והעזרה הגדולה ודלתות לעזרה ודלתותיהם צפה נחשת" - Rashi there [141]: "והעזרה הגדולה - זו עזרת ישראל", i.e.
  //   the bronze doors are the inner court's alone (DOORS_WOOD_D, the user's decision 140 א: the great court's doors are plain wood).
  //   II Chr 20:5 "לפני החצר החדשה" is NOT used for the outer court: Rashi (Pesachim 92a [4454], Zevachim 32b [1559]) identifies
  //   "החצר החדשה" with הר הבית. The outer court rests on Rashi on I Kings 6:36 alone (Rashi's own term for it is "עזרת נשים"); its name
  //   in the model is "החצר החיצונה" (1.0.1, the user's correction; the key "newCourt" is kept for the consumers).
  //   1.0.1 - the uses of the outer court (the user: "היו בה שימושים, הוסף"; sources outside I Kings 6-7 are allowed here at his request):
  //   Jer 35:4 "לשכת בני חנן... אשר אצל לשכת השרים אשר ממעל ללשכת מעשיהו", Jer 36:10 "בלשכת גמריהו... בחצר העליון פתח שער בית ה' החדש",
  //   II Kings 23:11 "לשכת נתן מלך הסריס" (chambers in the court); II Kings 11:14 "המלך עמד על העמוד כמשפט", II Kings 23:3 (the king's
  //   "עמוד" at the entrance to the inner court); II Chr 24:8 "ויעשו ארון אחד ויתנהו בשער בית ה' חוצה", II Kings 12:10 (the donation
  //   chest at the gate); II Kings 15:35 "הוא בנה את שער בית ה' העליון" (Yotam's upper gate - a name only, not modeled separately).
  // Everything that is not in a verse is marked "model choice". The helpers mnt_bandWall / mnt_gatePortal are shared with 30-courts.js.
  var MNT_GROUND_Y = -28;       // model choice (as the Second Temple model 1.0.19): the natural ground around the platform
  var MNT_WALL_T = 5;           // model choice: thickness of the great court wall (no measure in the sources)
  var MNT_WALL_H = 20;          // model choice: height of the great court wall = 5 bands of (3 stone courses + 1 cedar course)
  var MNT_STONE_BAND = 3;       // I Kings 7:12 / 6:36 "שלשה טורים גזית": three stone courses of 1 amah (course height: model choice; Radak on I Kings 7:9 [432]
                                // gives the standard גזית course as 5 tefachim, and Bava Batra 3a [41] ties the house's stones to that measure - the research's alternative is a 3 x 0.83 + cedar cycle)
  var MNT_CEDAR_BAND = 1;       // I Kings 7:12 "וטור כרתת ארזים": one course of cedar beams, 1 amah (model choice)
  var MNT_GATE_W = 10;          // model choice: gate openings 10 wide x 20 high with a flat stone lintel (as the 1.0.19 Har HaBayit gates after Middot 2:3)
  var MNT_GATE_H = 20;
  var MNT_EW_GATE_Z = 0;        // model choice (SPEC 3): the east and west gates stand on the house axis (z = 0), so the three east gates (great court ->
                                // outer court -> inner court) line up (as the 1.0.19 Shushan / Kiponus gates). The platform's own middle would be z 82.5.
  var MNT_NS_GATE_X = 103;      // model choice (SPEC 3): the north and south gates in the middle of their sides, (harW + harE) / 2 = 103
  var MNT_WC_SIZE = 135;        // model choice: the outer court (החצר החיצונה) is 135 x 135 (as wide as the inner court); no measure in the sources
  var MNT_WC_Y = 3;             // model choice: the outer court floor 3 above the platform = 6 steps of 0.5 (Middot 2:3 pattern of steps)
  var MNT_WC_WALL_T = 2;        // model choice: the outer court low wall 2 thick
  var MNT_WC_WALL_H = 4;        // model choice: 4 high = 3 stone courses of 1 + 1 cedar course (the I Kings 6:36 / 7:12 pattern, repeated here by analogy)
  var MNT_STEP = 0.5;           // tread 0.5, rise 0.5 (SPEC 1, after Middot 2:3 "רום מעלה חצי אמה ושלחה חצי אמה")
  // 1.0.1 - the uses of the outer court (FIXES-1.0.1 section D): the sources name the things but give no measures, so every number is a model choice
  // 1.3.5 (the user: "תעביר את הלשכות בבית ראשון ל4 הפינות במקום באמצע"): X - the two chambers of each side stand in the court's corners,
  // against the inner court's podium (x 98.5) and against the low east wall (its inner face x 227.5); until 1.3.4 at x 133 and 193
  var MNT_LISHKA = { L: 12, D: 10, H: 8, T: 1, ROOF: 0.5, DOOR_W: 2.5, DOOR_H: 4, X: [104.5, 221.5] }; // לשכות (Jer 35:4; 36:10; II Kings 23:11): 12 along the low wall x 10 deep
                                // x 8 high (7.5 of stone wall + a 0.5 cedar roof slab), walls 1 thick, a door 2.5 x 4 toward the court; two per side, centred at
                                // x 133 / 193 (symmetric about the court's middle x 163, 28.5 from each end of the court's inside x 98.5..227.5)
  var MNT_AMUD = { x: 106, z: 8, r: 2, h: 1, pr: 0.6, ph: 3 }; // "העמוד" (II Kings 11:14; 23:3): a round stone platform 4 across (r 2) x 1 high with a short pillar
                                // (r 0.6, 3 high), just east of the inner court's east gate steps (30-courts.js: x 98.5..101.5, z +-6) - at x 106, z 8 the steps stay clear
  var MNT_ARON = { x: 224, z: 7, l: 2, w: 1.2, h: 1.2 };
  var MNT_ARON_IN = { x: 70, z: -8 };   // YEHOYADA_208: the inner chest - in the inner court, 5 east of the altar's east face (x 65), 8 north of the axis (model choice) // the donation chest (II Chr 24:8; II Kings 12:10): cedar, 2 long (along z) x 1.2 x 1.2, inside the outer
                                // court beside its east gate (the gate piers stand at z +-5..+-6.5, x 227.2..229.8; the low wall's inner face is x 227.5)

  function mnt_hash(n) { // the same value noise as 10-core's hash(), kept private so the terrain does not depend on it
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  // Stone for the court walls: M.stone draws 3-amah courses (tile 15 / 5 rows) - to show "שלשה טורים גזית" as three 1-amah courses
  // inside a 3-amah band, the ashlar texture is re-tiled to 5 amot per tile (look only, model choice). Falls back to M.stone.
  var mnt_courseStoneMat = null;
  function mnt_courseStone(M2) {
    if (mnt_courseStoneMat) return mnt_courseStoneMat;
    try {
      const mat = M2.stone.clone();
      const retile = (t) => {
        const c = t.clone();
        c.repeat.set(1 / 5, 1 / 5);
        c.needsUpdate = true;
        return c;
      };
      if (M2.stone.map) mat.map = retile(M2.stone.map);
      if (M2.stone.bumpMap) mat.bumpMap = retile(M2.stone.bumpMap);
      mnt_courseStoneMat = mat;
    } catch (_) {
      mnt_courseStoneMat = M2.stone;
    }
    return mnt_courseStoneMat;
  }

  // One box of a course band, in world coordinates. axis "x": the wall runs east-west (length along x) at z = cz;
  // axis "z": the wall runs north-south (length along z) at x = cx. r0..r1 = the run along the wall, measured from the wall's centre.
  function mnt_bandBox(axis, r0, r1, y0, h, t, cx, cz, H2) {
    const len = r1 - r0, mid = (r0 + r1) / 2;
    const alongX = axis === "x";
    const w = alongX ? len : t, d = alongX ? t : len;
    const geo = H2.uvWorldBox(new BoxGeometry(w, h, d), w, h, d);
    geo.translate(alongX ? cx + mid : cx, y0 + h / 2, alongX ? cz : cz + mid);
    return geo;
  }

  // A wall of stacked courses (I Kings 7:12; Rashi: "שלשה נדבכין של אבנים ונדבך של עץ עליהם"; Metzudat David: "וכמו כן עד כלות גובה
  // הכתלים"): a stone band `stoneH` high (= 3 courses of 1 amah) then a cedar band `cedarH` high, repeated from y up to y + height.
  // `openings` = [{center, width}] measured along the wall from its centre (for axis "z" the centre is a true +z offset; this differs from
  // H.wall, where a "z" wall is rotated and the offset is negated). An opening cuts through ALL bands (full height).
  // Built as ONE merged mesh per material so a whole side fades together: both are registered with H.occ, the cedar fades with the stone.
  // Returns { stone, cedar } (either may be null for a degenerate wall).
  function mnt_bandWall(parent, { axis = "x", length, height, thickness = 5, cx = 0, cz = 0, y = 0, openings = [], stoneH = 3, cedarH = 1, stoneMat, cedarMat, H: H2, occlude = true }) {
    const cuts = openings.map((op) => [(op.center || 0) - op.width / 2, (op.center || 0) + op.width / 2]).sort((a, b) => a[0] - b[0]);
    const runs = [];
    let a = -length / 2;
    for (const [c0, c1] of cuts) {
      if (c0 - a > 0.01) runs.push([a, c0]);
      a = Math.max(a, c1);
    }
    if (length / 2 - a > 0.01) runs.push([a, length / 2]);
    const stoneGeos = [], cedarGeos = [];
    let y0 = 0;
    while (y0 < height - 1e-6) {
      const sh = Math.min(stoneH, height - y0);
      for (const r of runs) stoneGeos.push(mnt_bandBox(axis, r[0], r[1], y0, sh, thickness, cx, cz, H2));
      y0 += sh;
      if (y0 >= height - 1e-6) break;
      const ch = Math.min(cedarH, height - y0);
      for (const r of runs) cedarGeos.push(mnt_bandBox(axis, r[0], r[1], y0, ch, thickness, cx, cz, H2));
      y0 += ch;
    }
    const mk = (geos, mat) => {
      if (!geos.length) return null;
      const m = new Mesh(mergeGeometries(geos), mat);
      m.position.y = y;
      m.castShadow = m.receiveShadow = true;
      parent.add(m);
      return m;
    };
    const stone = mk(stoneGeos, stoneMat), cedar = mk(cedarGeos, cedarMat);
    if (occlude) {
      if (stone) H2.occ(stone);
      if (cedar) {
        H2.occ(cedar);
        if (stone) cedar.userData.fadeWith = stone;
      }
    }
    return { stone, cedar };
  }

  // A gate portal in the style of the 1.0.19 Har HaBayit gates (Middot 2:3: a square opening with a flat stone lintel, "שקוף"):
  // two square jambs reaching the top of the lintel, the lintel directly over the opening, a threshold, and two door leaves hung on the
  // jambs, slightly ajar. The opening is cut by the wall itself (mnt_bandWall openings) - here only the frame and the doors are built,
  // so the portal may rise above a lower wall. `inward` = +1 swings the leaves toward +z (axis "x") / toward -x (axis "z"), -1 the other way.
  // Every piece is registered with H.occ and fades with `fadeWith` (the wall's stone mesh). Returns the two leaf Groups.
  // TADI_C (fix-c, 22.11.2026 - the user's decision 116 ב: "שער טדי בבית ראשון — שתי אבנים מוטות זו על גב זו, כבבית שני"): `tadi` (axis "x")
  // - no flat lintel: Middot 2:3 "חוץ משל טדי, ששם שתי אבנים מוטות זו על גב זו" - two stones leaning on each other over the opening, an
  // inverted V 4 high, each lying on its edge from the jamb's top (+-openW/2, openH) up to the apex (as the Second Temple's 20-mount.js,
  // 1.0.19), the triangle between them open; the jambs reach the opening's top; the two leaves end aslant under the stones, as there
  // (1.9.5; no source - a model choice). In the First Temple the names and the forms of the Mount's gates are the Mishnah's, said of
  // the Second Temple's Mount - a model choice (the card says so).
  function mnt_gatePortal(parent, { axis = "x", gx = 0, gz = 0, y = 0, T = 5, openW = 10, openH = 20, doorH = 20, doorMat, inward = 1, fadeWith = null, tadi = false, M: M2, H: H2 }) {
    const tr = (m) => {
      if (fadeWith) H2.occ(m).userData.fadeWith = fadeWith;
      return m;
    };
    const eps = 0.02; // model choice: a hair's offset so no face of the frame shares a plane with a same-facing face of the wall or of another frame piece (no z-fighting)
    const jw = 1.8, jh = openH + 1.8 - eps, jd = T + 1.6; // 1.0.19 values: jambs 1.8 wide, 0.8 proud of each wall face, reaching (eps under) the top of the 1.8-high stone lintel
    const jOff = openW / 2 + jw / 2 - eps, lw = openW + 2 * jw; // the jamb face stands eps proud of the wall's reveal; the lintel (openW + 3.6) overhangs the jambs by eps
    const ld = T + 1.2, td = T + 1.4; // 1.0.19 values (model choice): the lintel 0.6 proud of each wall face, the threshold 0.7
    const GH = 4, TH = 1.0;   // TADI_C: the leaning stones (the Second Temple's values)
    if (axis === "x" && tadi) {
      for (const s of [-1, 1]) tr(H2.box(parent, jw, openH, jd, M2.stoneLight, gx + s * jOff, y, gz));   // the jambs to the opening's top
      const ang = Math.atan2(GH, openW / 2), edgeL = Math.hypot(openW / 2, GH);
      for (const s of [-1, 1]) {
        const st = tr(H2.box(parent, edgeL + 0.6, TH, ld, M2.stoneLight, 0, 0, 0));
        st.position.set(gx + s * (openW / 4 + Math.sin(ang) * TH / 2), y + openH + GH / 2 + Math.cos(ang) * TH / 2, gz);
        st.rotation.z = -s * ang;
      }
      tr(H2.box(parent, openW + jw, 0.18, td, M2.stoneSmooth, gx, y, gz));
    } else if (axis === "x") {
      for (const s of [-1, 1]) tr(H2.box(parent, jw, jh, jd, M2.stoneLight, gx + s * jOff, y, gz));
      tr(H2.box(parent, lw, 1.8, ld, M2.stoneLight, gx, y + openH, gz));      // flat stone lintel 1.8 high (1.0.19 value) directly on the opening
      tr(H2.box(parent, openW + jw, 0.18, td, M2.stoneSmooth, gx, y, gz));    // threshold 0.18 high (1.0.19 value), its ends inside the jambs
    } else {
      for (const s of [-1, 1]) tr(H2.box(parent, jd, jh, jw, M2.stoneLight, gx, y, gz + s * jOff));
      tr(H2.box(parent, ld, 1.8, lw, M2.stoneLight, gx, y + openH, gz));
      tr(H2.box(parent, td, 0.18, openW + jw, M2.stoneSmooth, gx, y, gz));
    }
    const pw = openW / 2 - 0.2; // each leaf = half the opening (as Rashi on I Kings 6:34 for the house doors), less a hinge gap
    const lt = 0.4; // leaf thickness 0.4 (1.0.19 value, model choice)
    const leaves = [];
    for (const s of [-1, 1]) {
      const leaf = new Group();
      const ajar = s === 1 ? 0.38 : 0.2; // 1.0.19 values (model choice): the two leaves stand ajar at different angles, as if just pushed open
      if (axis === "x" && tadi) {   // TADI_C: the leaf's head aslant, from the jamb (doorH) up toward the apex, under the stones
        leaf.position.set(gx + s * openW / 2, y, gz);
        const h0 = doorH - 0.15, h1 = doorH - 0.15 + GH * ((pw + 0.05) / (openW / 2)), sh = new Shape();
        sh.moveTo(-s * 0.05, 0); sh.lineTo(-s * (pw + 0.05), 0); sh.lineTo(-s * (pw + 0.05), h1); sh.lineTo(-s * 0.05, h0); sh.closePath();
        const geo = new ExtrudeGeometry(sh, { depth: lt, bevelEnabled: false });
        geo.translate(0, 0, -lt / 2);
        const m = new Mesh(geo, doorMat);
        m.castShadow = m.receiveShadow = true;
        leaf.add(m);
        tr(m);
      } else if (axis === "x") {
        leaf.position.set(gx + s * openW / 2, y, gz);
        tr(H2.box(leaf, pw, doorH, lt, doorMat, -s * (pw / 2 + 0.05), 0, 0));
      } else {
        leaf.position.set(gx, y, gz + s * openW / 2);
        tr(H2.box(leaf, lt, doorH, pw, doorMat, 0, 0, -s * (pw / 2 + 0.05)));
      }
      leaf.rotation.y = s * ajar * inward;
      parent.add(leaf);
      leaves.push(leaf);
    }
    return leaves;
  }

  //@@include rose-garden
  // SHILOACH_KIT_B2: tm_shiloach (shared/frag/shiloach.js) - the spring of the Shiloach, one build for both houses; brought in here so the
  // First Temple's build reads it (its caller in this house - agent C's src/59-parallels.js; until then it is not called here)
  //@@include shiloach
  async function buildMount(ctx) {
    const M2 = ctx.M, H2 = ctx.H, CO2 = ctx.CO, LV2 = ctx.LV;
    const g = new Group();
    g.name = "mount";
    ctx.root.add(g);
    const CX = (CO2.harW + CO2.harE) / 2; // 103: centre of the 500 x 500 platform (Middot 2:1 placement: x -147..353)
    const CZ = (CO2.harN + CO2.harS) / 2; // 82.5: z -167.5..332.5 (most open space on the south, Middot 2:1)
    const T = MNT_WALL_T, WH = MNT_WALL_H, GROUND_Y = MNT_GROUND_Y;
    const stoneC = mnt_courseStone(M2);
    const lbl = (text, x, y, z, size) => ctx.labels.push({ text, x, y, z, size });

    // ---------- terrain (copied from the Second Temple model 1.0.19): flat at GROUND_Y around the platform, hills further out ----------
    const sm = (a, b, x) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    const vn = (x, z) => {
      const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
      const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
      const r = (i, j) => mnt_hash((ix + i) * 157.3 + (iz + j) * 113.9);
      return (r(0, 0) * (1 - u) + r(1, 0) * u) * (1 - v) + (r(0, 1) * (1 - u) + r(1, 1) * u) * v;
    };
    const fbm = (x, z) => vn(x, z) * 0.55 + vn(x * 2.1, z * 2.1) * 0.28 + vn(x * 4.3, z * 4.3) * 0.17;
    const bump = (x, z, cx, cz, rx, rz, amp) => amp * Math.exp(-(((x - cx) / rx) ** 2) - ((z - cz) / rz) ** 2);
    const rectDist = (x, z) => Math.hypot(Math.max(CO2.harW - x, x - CO2.harE, 0), Math.max(CO2.harN - z, z - CO2.harS, 0));
    // TERRAIN_211 (as the Second Temple's 20-mount.js; the user, 14.11.2026: the mountain's shape): the mount on its ridge - the ground falls
    // away from the walls' feet (level for 35 amot, where the stairs stand) into the Kidron on the east (32 lower, 150 amot from the wall)
    // and into the valley on the west; level on the north and on the south (the palace). Depths, widths and places - model choices
    const valley = (x, z) => {
      let v = 0;
      if (x > CO2.harE) v += 32 * Math.exp(-((((x - CO2.harE) - 150) / 85) ** 2));
      // (no slope on the south here: Solomon's palace stands there on its terrace - 60-palace.js reads the ground under it)
      // VALLEYS_188: faded in over the first 5 amot west of the wall's line (until now a step of 2 amot along x = harW south of the mount,
      // hidden by the terrain's 23.6-amot cells - the valleys' small cells would draw it; no vertex of the terrain's grid lies in those 5 amot)
      if (x < CO2.harW) v += 24 * Math.exp(-((((CO2.harW - x) - 110) / 70) ** 2)) * sm(0, 5, CO2.harW - x);
      return v;
    };
    const terrainH0 = (x, z) => {
      const d = rectDist(x, z);
      const ramp = sm(70, 380, d);
      let h = bump(x, z, 1100, 30, 460, 950, 190) + bump(x, z, -700, 620, 420, 330, 130) + bump(x, z, -560, -760, 460, 380, 100) + bump(x, z, 220, 1350, 560, 320, 130) + bump(x, z, 380, -1380, 620, 360, 120);
      h += (fbm(x * 3e-3, z * 3e-3) - 0.5) * 120 + (fbm(x * 0.012, z * 0.012) - 0.5) * 22;
      const rim = sm(1500, 2500, Math.hypot(x - CX, z - CZ)) * 260;
      return GROUND_Y + ramp * Math.max(h * 0.2, -5) + rim * 0.15 * ramp - sm(35, 100, d) * valley(x, z);
    };
    // VALLEYS_188 (fix-f, 22.11.2026 - the coordinator's task 188: "להעמיק את הקרקע סביב עיר דוד... את הגיא ממערב ואת הנחל (קדרון)
    // ממזרח, כך שעיר דוד תיראה באמת כרכס בולט, גם ממערב ומרחוק"): until now the ground round the City of David lay 20 to 27 under the
    // mount's top, and the city's spine (-11 by the king's terrace, under it, down to about -21 at its tip) stood only about ten amot over
    // it. Now a valley runs west of the city (the gai) and one east of it (the nachal), meeting south of its tip: each along its axis
    // (VAL.W / VAL.E), its floor at a fixed height going down southward (floor: [z, y] - about 20 under the old ground), its far bank a
    // long, low bell curve from the floor's edge; on the city's side the ground goes down over VAL_BANK amot from the nearest thing that
    // keeps its ground. NOT CARVED (mask): the city itself - inside
    // its wall's outline and a few amot out (its wall and towers; in the north-west, Hezekiah's other wall 14 out and the pool between the
    // two walls - 59-parallels.js), the king's terrace with its stairs (60-palace.js), the spring with the way's end and the water's way
    // into the city, and the way of the water-drawing procession down to the spring (its ground as before; the valley beside it).
    // The depths, the widths and the axes - no source gives them: a model choice for the look (the city on its ridge).
    const VAL = {
      city: [[0, 690], [210, 690], [222, 770], [210, 859.6], [165, 950], [105, 1010], [45, 950], [-5, 859.6], [-12, 770]],   // = 59-parallels.js POLY (IR_C: N 690, W 0, E 210, tip [105, 1010])
      W: { axis: [[-172, 470], [-134, 560], [-108, 700], [-101, 860], [-90, 970], [-34, 1068], [105, 1132], [110, 1250], [112, 1460]], z0: 470, z1: 640,
        floor: [[470, -32], [700, -46], [900, -49], [1060, -51], [1132, -52], [1210, -40], [1300, -22], [1400, -9], [1460, -3]], fw: 10, near: 45, far: 90, city: -1 },
      E: { axis: [[310, 590], [302, 700], [298, 780], [288, 870], [256, 975], [190, 1082], [105, 1132], [110, 1250], [112, 1460]], z0: 590, z1: 720,
        floor: [[590, -38], [700, -48], [900, -50], [1060, -51], [1132, -52], [1210, -40], [1300, -22], [1400, -9], [1460, -3]], fw: 10, near: 45, far: 110, city: 1 },
      // south of the tip the two meet (105, 1132) and go on southward as one, its floor going up the hill there, its banks narrower
      terrace: [10, 196, 352.5, 697],   // the king's terrace (60-palace.js TX0..TX1, TZ0..TZ1) and its stairs down southward (to TZ1 + 24)
      spring: [[[14, 972], [-14, 952]], [[14, 972], [50, 930]]],   // the spring (59-parallels.js SPRING_C) - to the way's end, and to the pool of the Shiloach
      path: [[-165, 345], [-110, 400], [-60, 560], [-36, 720], [-30, 860], [-14, 952]]   // the procession's way (59-parallels.js valley())
    };
    const val_sstep = (u) => { const v = Math.max(0, Math.min(1, u)); return v * v * (3 - 2 * v); };
    // the nearest point of a polyline (closed: a polygon): VN = { d, ex, ez, cr (the side: the cross product's sign) } - one object, filled
    // again by each call (read it before the next call); val_dist - the distance alone. (No allocations: they run some 100,000 times.)
    const VN = { d: 0, ex: 0, ez: 0, cr: 0 };
    const val_near = (x, z, P, closed) => {
      let bd = Infinity, bx2 = x, bz2 = z, bc = 0;
      const n = P.length, m = closed ? n : n - 1;
      for (let i = 0; i < m; i++) {
        const A = P[i], B = P[(i + 1) % n], ax = A[0], az = A[1], vx = B[0] - ax, vz = B[1] - az;
        let t = ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz); t = t < 0 ? 0 : t > 1 ? 1 : t;
        const qx = ax + vx * t, qz = az + vz * t, d2 = (x - qx) * (x - qx) + (z - qz) * (z - qz);
        if (d2 < bd) { bd = d2; bx2 = qx; bz2 = qz; bc = vx * (z - az) - vz * (x - ax); }
      }
      VN.d = Math.sqrt(bd); VN.ex = bx2; VN.ez = bz2; VN.cr = Math.sign(bc);
      return VN;
    };
    const val_dist = (x, z, P) => {
      let bd = Infinity;
      for (let i = 0; i < P.length - 1; i++) {
        const A = P[i], B = P[i + 1], ax = A[0], az = A[1], vx = B[0] - ax, vz = B[1] - az;
        let t = ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz); t = t < 0 ? 0 : t > 1 ? 1 : t;
        const dx = x - ax - vx * t, dz = z - az - vz * t, d2 = dx * dx + dz * dz;
        if (d2 < bd) bd = d2;
      }
      return Math.sqrt(bd);
    };
    const val_in = (x, z, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const xi = P[i][0], zi = P[i][1], xj = P[j][0], zj = P[j][1]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
    const val_lerp = (T, z) => { if (z <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (z <= T[i][0]) { const z0 = T[i - 1][0], y0 = T[i - 1][1]; return y0 + (T[i][1] - y0) * (z - z0) / (T[i][0] - z0); } return T[T.length - 1][1]; };
    const val_one = (V, x, z, h0) => {   // one valley's carving at (x, z), over the old ground h0
      // (the floor's height, the weight and the far bank's width go by the point's own z, not by its nearest point on the axis: on the
      // inner side of a bend the nearest point jumps from one stretch to the next, and the ground would jump with it)
      const w = val_sstep((z - V.z0) / (V.z1 - V.z0)) * (1 - val_sstep((z - 1400) / 60));
      if (w <= 0) return 0;
      const N = val_near(x, z, V.axis, false), r = N.d - V.fw, bw = N.cr * V.city > 0 ? V.near : V.far + (60 - V.far) * val_sstep((z - 1060) / 80), p = r <= 0 ? 1 : Math.exp(-((r / bw) ** 2));
      return Math.max(0, h0 - val_lerp(V.floor, z)) * p * w;
    };
    // the mask: by the distance from the nearest thing that keeps its ground (the city with its margin, the terrace, the spring, the way);
    // the ground goes down from there to the valley's floor over VAL_BANK amot (one smooth step - no cliff where two ramps meet)
    const VAL_BANK = 60;
    const val_mask = (x, z) => {   // 0 where the ground stays as it was, 1 where the valleys are carved in full
      if (val_in(x, z, VAL.city)) return 0;
      const E = val_near(x, z, VAL.city, true), hz = (1 - val_sstep((E.ex - 25) / 30)) * (1 - val_sstep((E.ez - 862) / 16));   // the north-west: Hezekiah's wall
      let d = E.d - (4 + 15 * hz);
      const T = VAL.terrace, tx = Math.max(T[0] - x, x - T[1], 0), tz = Math.max(T[2] - z, z - T[3], 0);
      d = Math.min(d, Math.sqrt(tx * tx + tz * tz) - 8);
      d = Math.min(d, val_dist(x, z, VAL.spring[0]) - 18, val_dist(x, z, VAL.spring[1]) - 18);
      d = Math.min(d, val_dist(x, z, VAL.path) - 7);
      return val_sstep(d / VAL_BANK);
    };
    const valCarve = (x, z, h0) => {
      if (z < 440 || z > 1460 || x < -420 || x > 640) return 0;
      const c = Math.max(val_one(VAL.W, x, z, h0), val_one(VAL.E, x, z, h0));
      return c > 0.005 ? c * val_mask(x, z) : 0;
    };
    const terrainH = (x, z) => { const h0 = terrainH0(x, z); return h0 - valCarve(x, z, h0); };
    ctx.shared.terrainH = terrainH;   // CITY_C (fix-c, 22.11.2026): the ground's height, for the City of David's ridge (59-parallels.js)
    ctx.shared.valleys188 = { VAL, carve: (x, z) => valCarve(x, z, terrainH0(x, z)), mask: val_mask, terrainH0 };   // for the checks (VALLEYS_188)
    try {
      const SIZE = 5200, SEG = 220;
      const geo = new PlaneGeometry(SIZE, SIZE, SEG, SEG);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
      const colAt = (x, z, h, out, o) => {
        const k = 0.86 + fbm(x * 0.02, z * 0.02) * 0.2, up = sm(-20, 160, h - GROUND_Y);
        out[o] = Math.min(1, k * (0.93 - up * 0.03));
        out[o + 1] = Math.min(1, k * (0.94 - up * 0.03));
        out[o + 2] = Math.min(1, k * (0.84 - up * 0.04));
      };
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) + CX, z = pos.getZ(i) + CZ, h = terrainH(x, z);
        pos.setXYZ(i, x, h, z);
        colAt(x, z, h, col, i * 3);
      }
      geo.setAttribute("color", new BufferAttribute(col, 3));
      geo.attributes.uv.array.forEach((v, i, arr) => arr[i] = v * SIZE);
      geo.computeVertexNormals();
      const tm = M2.ground.clone();
      tm.vertexColors = true;
      tm.color.set(15527123);
      const terrain = new Mesh(geo, tm);
      tm_terrainRaycast(terrain, SEG, SEG);
      terrain.receiveShadow = true;
      g.add(terrain);
      // VALLEYS_188: the terrain's cells are 23.6 amot - too coarse for the valleys' banks (the drawn ground would stand amot off the
      // height that the city's wall and the things by it are built on). Every cell where the valleys carve is cut out of the terrain
      // (its vertices stay: 60-palace.js reads them) and drawn again in VAL_SUB x VAL_SUB small cells (about 5.9 amot), in blocks of
      // 8 x 8 cells (each its own mesh - a downward ray tests one block, not all). The small cells' vertices on an edge shared with a
      // cell that was not cut lie on that edge's straight line, with its colour and normal - no crack, no seam.
      // Built AFTER the load, in the model's frames: a few rows of small cells in each frame (up to about 12 ms), then the cut and the
      // blocks in one frame; until then the terrain's own cells show the valleys (their vertices are on the carved ground). So the load
      // is not made longer (the small grid's heights are some 36,000 points: about 140 ms if done at once).
      try {
        const RK = [0.76, 0.65, 0.5], FLc = [0.7, 0.71, 0.52];   // the valleys' colours (below)
        const VAL_SUB = 4, cell = SIZE / SEG, W1 = SEG + 1, ox = CX - SIZE / 2, oz = CZ - SIZE / 2, fc = cell / VAL_SUB;
        const ix0 = Math.max(0, Math.floor((-430 - ox) / cell)), ix1 = Math.min(SEG - 1, Math.ceil((650 - ox) / cell));
        const iz0 = Math.max(0, Math.floor((430 - oz) / cell)), iz1 = Math.min(SEG - 1, Math.ceil((1470 - oz) / cell));
        const NX = (ix1 - ix0 + 1) * VAL_SUB + 1, NZ = (iz1 - iz0 + 1) * VAL_SUB + 1;
        const FH = new Float32Array(NX * NZ), FC = new Float32Array(NX * NZ);   // the small grid: height, carving
        const rowOf = (j) => { for (let i = 0; i < NX; i++) { const x = ox + ix0 * cell + i * fc, z = oz + iz0 * cell + j * fc, h0 = terrainH0(x, z), c = valCarve(x, z, h0); FH[j * NX + i] = h0 - c; FC[j * NX + i] = c; } };
        const finish = () => {
          const CW = ix1 - ix0 + 1, CHn = iz1 - iz0 + 1, cut = new Uint8Array(CW * CHn);
          for (let cj = 0; cj < CHn; cj++) for (let ci = 0; ci < CW; ci++) {
            let mx = 0;
            for (let b = 0; b <= VAL_SUB; b++) for (let a = 0; a <= VAL_SUB; a++) mx = Math.max(mx, FC[(cj * VAL_SUB + b) * NX + ci * VAL_SUB + a]);
            if (mx > 0.02) cut[cj * CW + ci] = 1;
          }
          const isCut = (ci, cj) => ci >= 0 && cj >= 0 && ci < CW && cj < CHn && cut[cj * CW + ci] === 1;
          let nCut = 0; for (const v of cut) nCut += v;
          if (nCut) {
            // the terrain without the cut cells
            const idx = geo.index.array, keep = [];
            for (let iy = 0; iy < SEG; iy++) for (let ix = 0; ix < SEG; ix++) {
              const ci = ix - ix0, cj = iy - iz0;
              if (isCut(ci, cj)) continue;
              const o = (iy * SEG + ix) * 6; for (let k = 0; k < 6; k++) keep.push(idx[o + k]);
            }
            geo.setIndex(keep);
            // the small grid's vertices on an edge between a cut cell and one that was not: on the coarse edge's line
            const nrm = geo.attributes.normal, CV = (ix, iy) => iy * W1 + ix;
            const FN = new Float32Array(NX * NZ * 3), FCol = new Float32Array(NX * NZ * 3), fixed = new Uint8Array(NX * NZ);
            const onCoarse = (i, j) => {   // a small vertex on a coarse edge whose two cells are not both cut -> the coarse edge's line
              const a = i % VAL_SUB, b = j % VAL_SUB, ci = Math.floor(i / VAL_SUB), cj = Math.floor(j / VAL_SUB);
              if (a !== 0 && b !== 0) return null;
              let A, B, t;
              if (a === 0 && b === 0) {   // a coarse vertex: fixed if any of its four cells is not cut
                if (isCut(ci - 1, cj - 1) && isCut(ci, cj - 1) && isCut(ci - 1, cj) && isCut(ci, cj)) return null;
                A = B = CV(ix0 + ci, iz0 + cj); t = 0;
              } else if (a === 0) {   // on a vertical coarse edge (along z): cells (ci-1, cj) and (ci, cj)
                if (isCut(ci - 1, cj) && isCut(ci, cj)) return null;
                A = CV(ix0 + ci, iz0 + cj); B = CV(ix0 + ci, iz0 + cj + 1); t = b / VAL_SUB;
              } else {   // on a horizontal coarse edge (along x): cells (ci, cj-1) and (ci, cj)
                if (isCut(ci, cj - 1) && isCut(ci, cj)) return null;
                A = CV(ix0 + ci, iz0 + cj); B = CV(ix0 + ci + 1, iz0 + cj); t = a / VAL_SUB;
              }
              return [A, B, t];
            };
            for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
              const k = j * NX + i, x = ox + ix0 * cell + i * fc, z = oz + iz0 * cell + j * fc, e = onCoarse(i, j);
              if (e) {
                const [A, B, t] = e; fixed[k] = 1;
                FH[k] = pos.getY(A) * (1 - t) + pos.getY(B) * t;
                for (let q = 0; q < 3; q++) { FCol[k * 3 + q] = col[A * 3 + q] * (1 - t) + col[B * 3 + q] * t; FN[k * 3 + q] = nrm.array[A * 3 + q] * (1 - t) + nrm.array[B * 3 + q] * t; }
              } else colAt(x, z, FH[k], FCol, k * 3);
            }
            for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {   // the normals of the free vertices: from the small grid's heights
              const k = j * NX + i; if (fixed[k]) continue;
              const x = ox + ix0 * cell + i * fc, z = oz + iz0 * cell + j * fc;
              const hx0 = FH[j * NX + Math.max(0, i - 1)], hx1 = FH[j * NX + Math.min(NX - 1, i + 1)], hz0 = FH[Math.max(0, j - 1) * NX + i], hz1 = FH[Math.min(NZ - 1, j + 1) * NX + i];
              const dx = (hx1 - hx0) / (fc * ((i > 0 && i < NX - 1) ? 2 : 1)), dz = (hz1 - hz0) / (fc * ((j > 0 && j < NZ - 1) ? 2 : 1)), L = Math.hypot(dx, 1, dz);
              FN[k * 3] = -dx / L; FN[k * 3 + 1] = 1 / L; FN[k * 3 + 2] = -dz / L;
              // the valleys' colour (so their shape reads from afar): a little darker with the depth, and the steep banks toward the colour of
              // earth and rock; nothing where nothing was carved (the cells' edges keep the terrain's own colour)
              // the floor - toward a dull olive-brown (earth that holds water), the banks - toward earth and rock
              const cv = FC[k], kk = 0.86 + fbm(x * 0.02, z * 0.02) * 0.2, sl = Math.hypot(dx, dz);
              const st = val_sstep((sl - 0.18) / 0.35) * 0.55 * val_sstep(cv / 4), fl = val_sstep((cv - 6) / 10) * (1 - val_sstep((sl - 0.08) / 0.2)) * 0.42;
              const dk = 1 - 0.12 * val_sstep(cv / 16);
              for (let q = 0; q < 3; q++) FCol[k * 3 + q] = (FCol[k * 3 + q] * (1 - st - fl) + RK[q] * kk * st + FLc[q] * kk * fl) * dk;
            }
            const BLK = 8, fineG = new Group(); fineG.name = "terrainFine188"; g.add(fineG);
            for (let bj = 0; bj < CHn; bj += BLK) for (let bi = 0; bi < CW; bi += BLK) {
              const map = new Map(), P = [], N = [], C = [], U = [], I = [];
              const vid = (i, j) => {
                const k = j * NX + i; let v = map.get(k);
                if (v === undefined) {
                  v = P.length / 3; map.set(k, v);
                  const x = ox + ix0 * cell + i * fc, z = oz + iz0 * cell + j * fc;
                  P.push(x, FH[k], z); N.push(FN[k * 3], FN[k * 3 + 1], FN[k * 3 + 2]); C.push(FCol[k * 3], FCol[k * 3 + 1], FCol[k * 3 + 2]); U.push(x - ox, SIZE - (z - oz));
                }
                return v;
              };
              for (let cj = bj; cj < Math.min(CHn, bj + BLK); cj++) for (let ci = bi; ci < Math.min(CW, bi + BLK); ci++) {
                if (!isCut(ci, cj)) continue;
                for (let b = 0; b < VAL_SUB; b++) for (let a = 0; a < VAL_SUB; a++) {
                  const i = ci * VAL_SUB + a, j = cj * VAL_SUB + b;
                  const va = vid(i, j), vb = vid(i, j + 1), vc = vid(i + 1, j + 1), vd = vid(i + 1, j);   // as PlaneGeometry's faces: (a, b, d), (b, c, d)
                  I.push(va, vb, vd, vb, vc, vd);
                }
              }
              if (!I.length) continue;
              const fg = new BufferGeometry();
              fg.setAttribute("position", new BufferAttribute(new Float32Array(P), 3));
              fg.setAttribute("normal", new BufferAttribute(new Float32Array(N), 3));
              fg.setAttribute("color", new BufferAttribute(new Float32Array(C), 3));
              fg.setAttribute("uv", new BufferAttribute(new Float32Array(U), 2));
              fg.setIndex(I);
              fg.computeBoundingSphere();
              const fm = new Mesh(fg, tm); fm.receiveShadow = true; fm.name = "terrainFine188"; fineG.add(fm);
            }
            ctx.shared.valleys188.cells = nCut;
          }
        };
        const ST = { j: 0, done: false, ms: 0, frames: 0 };
        ctx.shared.valleys188.state = ST;   // { j: the rows done, done, ms: the build's own time, frames }
        ctx.animated.push(() => {
          if (ST.done) return;
          const t0 = performance.now();
          for (let n = 0; ST.j < NZ && n < 48 && (n === 0 || performance.now() - t0 < 12); n++) rowOf(ST.j++);
          ST.frames++;
          if (ST.j >= NZ) { ST.done = true; try { finish(); } catch (e) { console.warn("[mount] valleys' fine ground:", e && e.message); } }
          ST.ms += performance.now() - t0;
        });
      } catch (e) { console.warn("[mount] valleys' fine ground skipped:", e && e.message); }
    } catch (e) {
      console.warn("[mount] terrain skipped:", e);
    }
    // ROSES_B2 (fix-b2, 22.11.2026 - the user's decision 77 of 02:27: "שכבה כבויה גם בבית ראשון; מקום — צילום לאישור"): the rose garden
    // outside the west gate (shared/frag/rose-garden.js), on the place's feature "גנת הוורדים — מחוץ לשער המערב"
    try {
      const RG = tm_roseGarden(ctx, { x0: -177, x1: -149.6, z0: 12, z1: 38, ground: terrainH, open: "n", wall: "e", name: "roseGarden",
        info: "**הברייתא** (בבא קמא פב:): ״ואין עושין בה גנות ופרדסות — חוץ מגנות וורדין שהיו מימות נביאים הראשונים״; **הרמב״ם** (בית הבחירה ז, יד): ״ואין מקימין בה אילנות חוץ מגנת ורדים שהיתה שם מימות נביאים הראשונים״. מקומה לא נתפרש; תוספות יום טוב (מידות א, ג) ותפארת ישראל (יכין, מידות א, כה) מפרשים כך את שם ״שער קיפונוס״ שבמערב. מקומה, גודלה וצורתה — בחירת מודל.",   // QUOTES_Q: רמב״ם בית הבחירה ז, יד (337:124): 'מקימין', 'מגנת'
        refs: [["בבא קמא פב:", { book: 122, index: 3124 }], ["רמב״ם בית הבחירה ז, יד", { book: 337, index: 124 }], ["תוספות יום טוב מידות א, ג", { book: 948, index: 30 }], ["יכין מידות א, כה", { book: 819, index: 52 }]] });
      ctx.shared.features = ctx.shared.features || {};
      ctx.shared.features.roseGarden = { key: "roseGarden", timed: false, isOn: () => RG.visible, on: () => { RG.visible = true; }, off: () => { RG.visible = false; } };
    } catch (e) { console.warn("[mount] rose garden skipped", e && e.message); }

    // ---------- the platform: 500 x 500 (Middot 2:1), paved, top at LV.HAR = 0; foundation walls below ground (model choice) ----------
    H2.box(g, CO2.HAR, 1.5, CO2.HAR, M2.pave, CX, LV2.HAR - 1.5, CZ);
    const fndN = H2.occ(H2.box(g, CO2.HAR + T, 30, T, M2.stone, CX, GROUND_Y - 2, CO2.harN)); // y -30..0, under the wall line
    const fndS = H2.occ(H2.box(g, CO2.HAR + T, 30, T, M2.stone, CX, GROUND_Y - 2, CO2.harS));
    const fndE = H2.occ(H2.box(g, T, 30, CO2.HAR - T, M2.stone, CO2.harE, GROUND_Y - 2, CZ));
    const fndW = H2.occ(H2.box(g, T, 30, CO2.HAR - T, M2.stone, CO2.harW, GROUND_Y - 2, CZ));

    // ---------- the great court wall: the 3 + 1 pattern of I Kings 7:12 "שלשה טורים גזית וטור כרתת ארזים", repeated here BY ANALOGY ----------
    // 7:12 gives the pattern for the king's great court (Metzudat David, Malbim, Ralbag: the wall around all the king's houses), for the
    // Temple's inner court and for the ulam - not for this outer court, which the sources only imply (Rashi 6:36 "לפנים מעזרת נשים").
    // Rashi 7:12: "החומה עשויה שלשה נדבכין של אבנים ונדבך של עץ עליהם"; Metzudat David: repeated "עד כלות גובה הכתלים".
    // Bands of 3 stone courses (3 high) + 1 cedar course (1 high), thickness 5, height 20 - all model choice ("באותו דגם", decision sheet
    // item 8). The wall straddles the platform edge (centre lines x = harW / harE, z = harN / harS, as 1.0.19). One gate per side (model
    // choice: Kings gives no number of gates for this court; the gate names are not in the sources): north / south in the middle of the
    // side (x 103), east / west on the house axis (z 0) so the three east gates line up (SPEC 3).
    const gE = { x: CO2.harE, z: MNT_EW_GATE_Z }, gW = { x: CO2.harW, z: MNT_EW_GATE_Z };
    const gN = { x: MNT_NS_GATE_X, z: CO2.harN }, gS = { x: MNT_NS_GATE_X, z: CO2.harS };
    // WALL_PLAIN_C (fix-c, 22.11.2026 - the user, 12:33: "לשנות לחומה רגילה"): the great court's wall is a plain wall of hewn stone, its
    // height and place as before. "שלשה טורים גזית וטור כרתת ארזים" is said of the king's court (I Kings 7:12; Metzudat David 3345:562 "אשר
    // היה מסבב כל בתי המלך"; Ralbag 3645:236 "שהחצר הגדולה אשר בה בית המלך") and of the inner court (6:36) - not of this wall. (Until now
    // it was banded "as the king's court", a model choice.) One course band the wall's whole height = no cedar course.
    const bandOpts = { height: WH, thickness: T, y: LV2.HAR, stoneH: WH, cedarH: 0, stoneMat: stoneC, cedarMat: M2.cedar, H: H2 };
    const wallN = mnt_bandWall(g, Object.assign({ axis: "x", length: CO2.HAR + T, cx: CX, cz: CO2.harN, openings: [{ center: gN.x - CX, width: MNT_GATE_W }] }, bandOpts));
    const wallS = mnt_bandWall(g, Object.assign({ axis: "x", length: CO2.HAR + T, cx: CX, cz: CO2.harS, openings: [{ center: gS.x - CX, width: MNT_GATE_W }] }, bandOpts));
    const wallE = mnt_bandWall(g, Object.assign({ axis: "z", length: CO2.HAR - T, cx: CO2.harE, cz: CZ, openings: [{ center: gE.z - CZ, width: MNT_GATE_W }] }, bandOpts));
    const wallW = mnt_bandWall(g, Object.assign({ axis: "z", length: CO2.HAR - T, cx: CO2.harW, cz: CZ, openings: [{ center: gW.z - CZ, width: MNT_GATE_W }] }, bandOpts));
    // the foundations fade together with their wall (1.0.19)
    fndN.userData.fadeWith = wallN.stone;
    fndS.userData.fadeWith = wallS.stone;
    fndE.userData.fadeWith = wallE.stone;
    fndW.userData.fadeWith = wallW.stone;

    // ---------- the four gates: square opening 10 x 20 with a flat stone lintel (model choice, as 1.0.19 / Middot 2:3); ----------
    // doors of cedar overlaid with bronze after II Chr 4:9 "ודלתות לעזרה ודלתותיהם צפה נחשת" - per Rashi there "העזרה הגדולה - זו עזרת ישראל",
    // so the verse speaks of the inner court's doors (30-courts.js); here the same doors by analogy (model choice); door height = the opening (model choice)
    // DOORS_WOOD_D (fix-d, 22.11.2026 - the user's decision 140 א): the great court's gates have PLAIN DOORS of wood (model choice); the
    // bronze-overlaid doors are the inner court's alone (30-courts.js) - II Chr 4:9 "והעזרה הגדולה ודלתות לעזרה ודלתותיהם צפה נחשת":
    // Rashi there (book 3662 line 141) "והעזרה הגדולה. זו עזרת ישראל", the Ralbag (3639:78), the Metzudat David (3318:183), the Radak
    // (3522:96); Rashi on I Kings 6:36 (3673:307) "החצר הפנימית. היא עזרת הכהנים ועזרת ישראל". (Until now bronze here too, by analogy.)
    const portal = { T, openW: MNT_GATE_W, openH: MNT_GATE_H, doorH: MNT_GATE_H, doorMat: M2.cedar, M: M2, H: H2, y: LV2.HAR };
    mnt_gatePortal(g, Object.assign({ axis: "z", gx: gE.x, gz: gE.z, inward: 1, fadeWith: wallE.stone }, portal));
    mnt_gatePortal(g, Object.assign({ axis: "x", gx: gN.x, gz: gN.z, inward: 1, fadeWith: wallN.stone, tadi: true }, portal));   // TADI_C (116 ב): Tadi - two leaning stones
    mnt_gatePortal(g, Object.assign({ axis: "x", gx: gS.x, gz: gS.z, inward: -1, fadeWith: wallS.stone }, portal));
    mnt_gatePortal(g, Object.assign({ axis: "z", gx: gW.x, gz: gW.z, inward: -1, fadeWith: wallW.stone }, portal));

    // ---------- exterior steps from the ground up to the platform at each gate (model choice) ----------
    // SPEC 3: a flight of 56 steps of the model's 0.5 / 0.5 step from the ground (GROUND_Y -28, as 1.0.19) up to the platform (rise 28),
    // so the flight really reaches the ground.
    const STEPS = Math.round(-GROUND_Y / MNT_STEP), RUN = STEPS * MNT_STEP; // 56 steps, run 28
    const SW = 14; // model choice: flight width 14 (as the 1.0.19 Shushan gate steps)
    H2.stairs(g, { width: SW, totalRise: -GROUND_Y, steps: STEPS, dir: "W", x: CO2.harE + T / 2 + RUN, y: GROUND_Y, z: gE.z, tread: MNT_STEP });
    H2.stairs(g, { width: SW, totalRise: -GROUND_Y, steps: STEPS, dir: "E", x: CO2.harW - T / 2 - RUN, y: GROUND_Y, z: gW.z, tread: MNT_STEP });
    H2.stairs(g, { width: SW, totalRise: -GROUND_Y, steps: STEPS, dir: "S", x: gN.x, y: GROUND_Y, z: CO2.harN - T / 2 - RUN, tread: MNT_STEP });
    H2.stairs(g, { width: SW, totalRise: -GROUND_Y, steps: STEPS, dir: "N", x: gS.x, y: GROUND_Y, z: CO2.harS + T / 2 + RUN, tread: MNT_STEP });

    // ---------- the outer court (החצר החיצונה) ----------
    // Source: Rashi on I Kings 6:36 "קורא אותה פנימית לפי שהיתה לפנים מעזרת נשים" (the only mention; Rashi's term is "עזרת נשים"; the model
    // calls it "החצר החיצונה" - 1.0.1, the user's correction; the keys newCourt / shared.newCourt / gates.newCourtE are kept).
    // NOT "החצר החדשה" of II Chr 20:5: Rashi identifies that court with הר הבית (Pesachim 92a "חצר החדשה - הר הבית וקרי לה חדשה מפני
    // שחידשו והוסיפו על קדושתו"; Zevachim 32b "נכח החצר החדשה - הר הבית שחידשו בה בהלכותיה"), and Rashi has no comment on II Chr 20:5
    // (Metzudat David there: "אולי תקנו אותה וחדשו הבנין"). The earlier identification outer court = new court was a model choice, now dropped.
    // No measure in the sources (all model choice): 135 x 135 east of the inner court (x 93.5..228.5, z +-67.5), floor 3 above the
    // platform (6 steps), paved, enclosed by a low wall 4 high (a plain stone wall - OUTER_PLAIN_C below; until 22.11.2026 banded as 6:36) 2 thick,
    // with an open gate 10 wide in the middle of its east side (named "השער המזרחי של החצר החיצונה", 1.0.1). The chambers, the king's עמוד and
    // the donation chest (1.0.1) are built after the gate; no gallery. Its west side is the inner court's podium
    // (3 above this floor) and wall; the 6 steps from here up to the inner court's east gate are built in 30-courts.js.
    const WC = { x0: CO2.azE, x1: CO2.azE + MNT_WC_SIZE, z0: -MNT_WC_SIZE / 2, z1: MNT_WC_SIZE / 2, y: MNT_WC_Y, t: MNT_WC_WALL_T, h: MNT_WC_WALL_H };
    const wcPodW = CO2.azE + 5;         // 98.5: the inner court podium's east face (30-courts.js: podium x -98.5..98.5)
    const wcPodE = WC.x1 + WC.t / 2;    // 229.5: outer face of the low east wall
    const wcDepth = MNT_WC_SIZE + WC.t; // z -68.5..68.5: the podium reaches under the low north / south walls
    H2.box(g, wcPodE - WC.x0, WC.y - 0.15, wcDepth, M2.stone, (WC.x0 + wcPodE) / 2, LV2.HAR, 0);     // podium y 0..2.85 (overlaps into the inner podium, hidden)
    H2.box(g, wcPodE - WC.x0, 0.15, wcDepth, M2.paveFine, (WC.x0 + wcPodE) / 2, WC.y - 0.15, 0);     // paving, top at 3
    // OUTER_PLAIN_C (fix-c, 22.11.2026 - the user's 172 b): the outer court's low wall is a plain wall of hewn stone, as the great court's
    // (WALL_PLAIN_C) - no source was found for a cedar course in this court; "שלשה טורי גזית וטור כרתת ארזים" is said of the inner court
    // (I Kings 6:36, 10:221 - 30-courts.js keeps it) and of the king's court (7:12). One course band the wall's whole height = no cedar course.
    const wcOpts = { height: WC.h, thickness: WC.t, y: WC.y, stoneH: WC.h, cedarH: 0, stoneMat: stoneC, cedarMat: M2.cedar, H: H2 };
    const wcPierD = 1.5; // model choice: the gate piers are 1.5 deep along the wall (1.5 x 5 x 2.6)
    mnt_bandWall(g, Object.assign({ axis: "x", length: wcPodE - wcPodW, cx: (wcPodW + wcPodE) / 2, cz: WC.z0 }, wcOpts)); // north low wall, x 98.5..229.5 (covers the corner)
    mnt_bandWall(g, Object.assign({ axis: "x", length: wcPodE - wcPodW, cx: (wcPodW + wcPodE) / 2, cz: WC.z1 }, wcOpts)); // south low wall
    // east low wall: 133 long (z +-66.5), between the inner faces of the north / south walls so no corner is built twice; its opening is
    // 13 wide (10 + the two piers) so the piers fill it edge to edge and the clear gateway stays 10 (no face shared with the wall's reveals)
    const wcE = mnt_bandWall(g, Object.assign({ axis: "z", length: wcDepth - 2 * WC.t, cx: WC.x1, cz: 0, openings: [{ center: 0, width: MNT_GATE_W + 2 * wcPierD }] }, wcOpts));
    try {
      // the gate: an open gateway between two stone piers (1.5 x 5 x 2.6, model choice) with a threshold; no doors in the sources for this court
      for (const s of [-1, 1]) H2.occ(H2.box(g, WC.t + 0.6, WC.h + 1, wcPierD, M2.stoneLight, WC.x1, WC.y, s * (MNT_GATE_W / 2 + wcPierD / 2))).userData.fadeWith = wcE.stone; // piers z +-5..+-6.5
      H2.box(g, WC.t + 0.4, 0.18, MNT_GATE_W, M2.stoneSmooth, WC.x1, WC.y, 0); // threshold 0.18 high (1.0.19 value) between the piers
    } catch (e) {
      console.warn("[mount] outer court gate trim skipped:", e);
    }
    // 6 steps (3 rise) from the platform up to the outer court gate (model choice), dir W, bottom at x 232.5; flight width 12 (model choice: a little wider than the 10-wide gate)
    H2.stairs(g, { width: 12, totalRise: WC.y - LV2.HAR, steps: 6, dir: "W", x: wcPodE + 6 * MNT_STEP, y: LV2.HAR, z: 0, tread: MNT_STEP });

    // ---------- the uses of the outer court (1.0.1, FIXES D.2: the user - "היו בה שימושים, הוסף") ----------
    // The sources name things that stood in this court but give no measures or places; every number below is a model choice (MNT_LISHKA,
    // MNT_AMUD, MNT_ARON at the top of the file). None of them is an occluder: like the house's chambers (FIXES A) they must stay closed
    // from outside, and they are small and far from the house, so they never hide it. Each block fails soft.
    const outerItems = []; // -> ctx.shared.outerCourtItems: [{key, name, x, y, z, cam}] for the UI's place items (cam = a suggested camera position)
    const ocItem = (key, name, x, y, z, cam) => outerItems.push({ key, name, x, y, z, cam });
    const zWallIn = MNT_WC_SIZE / 2 - WC.t / 2; // 66.5: the inner face of the north / south low walls (z -+66.5)
    // a. לשכות (chambers) along the inside of the north and south low walls - Jer 35:4 "לשכת בני חנן בן יגדליהו איש האלהים אשר אצל לשכת
    //    השרים אשר ממעל ללשכת מעשיהו בן שלם שמר הסף", Jer 36:10 "בלשכת גמריהו בן שפן הספר בחצר העליון פתח שער בית ה' החדש", II Kings 23:11
    //    "לשכת נתן מלך הסריס אשר בפרורים". Two per side (Jer 35:4 names chambers one above another, "ממעל" - the stacking is not modeled),
    //    each 12 x 10 x 8: stone walls 1 thick and 7.5 high, a cedar roof slab 0.5 (top at y 11, 4 above the low wall), a doorway 2.5 x 4
    //    toward the court with a cedar door leaf standing open and a stone threshold. The back wall stands flush against the low wall's
    //    inner face (z -+66.5; opposite-facing coplanar faces, no z-fighting). Built with occlude false / plain boxes (see above).
    try {
      const LK = MNT_LISHKA;
      const wallH = LK.H - LK.ROOF; // 7.5: stone up to y 10.5, the roof slab to y 11 (= floor 3 + 8)
      const doorMat = M2.cedar.clone();
      doorMat.color.set(0xA07040); // a darker cedar for the door leaves (SPEC 1 tint; model choice)
      // 1.0.1-L (the user: "תוסיף כפתור פתיחת הגג בלשכות"): the four roofs in one group, lifted only by the pills on the chambers (a viewing tool)
      const lishkaRoofs = new Group();
      lishkaRoofs.name = "lishkaRoofs";
      g.add(lishkaRoofs);
      for (const s of [-1, 1]) { // -1 north, +1 south
        const zBack = s * (zWallIn - LK.T / 2);     // -+66: centre of the back wall (z -+65.5..66.5)
        const zFront = s * (zWallIn - LK.D + LK.T / 2); // -+57: centre of the front wall (z -+56.5..57.5), 10 from the low wall's face
        const zMid = s * (zWallIn - LK.D / 2);       // -+61.5: centre of the chamber
        for (const cx of LK.X) {
          H2.box(g, LK.L, wallH, LK.T, M2.stone, cx, WC.y, zBack);                                           // back wall 12 x 7.5 x 1
          for (const sx of [-1, 1]) H2.box(g, LK.T, wallH, LK.D - 2 * LK.T, M2.stone, cx + sx * (LK.L - LK.T) / 2, WC.y, zMid); // side walls 1 x 7.5 x 8 at x cx -+5.5
          H2.wall(g, { axis: "x", length: LK.L, height: wallH, thickness: LK.T, mat: M2.stone, cx, cz: zFront, y: WC.y,
            openings: [{ center: 0, width: LK.DOOR_W, height: LK.DOOR_H }], occlude: false });              // front wall 12 x 7.5 x 1 with the doorway 2.5 x 4 (model choice: a man's door)
          H2.box(lishkaRoofs, LK.L, LK.ROOF, LK.D, M2.cedar, cx, WC.y + wallH, zMid);                                 // cedar roof slab 12 x 0.5 x 10 (y 10.5..11)
          H2.box(g, LK.DOOR_W - 0.1, 0.18, LK.T + 0.4, M2.stoneSmooth, cx, WC.y, zFront);                   // threshold 0.18 high (1.0.19 value), 0.2 proud of each face, 0.05 inside each reveal
          // the door leaf: 2.3 x 3.7 x 0.15 of cedar (model choice: 0.1 under the opening's width on each side, 0.2 above the threshold, 0.1 under
          // the lintel), hung on the west jamb and standing open into the chamber at ~70 deg (model choice). rotation.y = -s * 1.22: for the
          // north chamber the leaf swings toward -z (into the chamber), for the south chamber toward +z.
          const leaf = new Group();
          leaf.position.set(cx - LK.DOOR_W / 2 + 0.05, WC.y + 0.2, zFront);
          H2.box(leaf, LK.DOOR_W - 0.2, LK.DOOR_H - 0.3, 0.15, doorMat, (LK.DOOR_W - 0.2) / 2, 0, 0);
          leaf.rotation.y = -s * 1.22;
          g.add(leaf);
        }
        // 1.3.5 (the chambers in the four corners): a label and a pill on each chamber (until 1.3.4 one of each per side, between its two
        // chambers); every pill lifts all four roofs, and the camera goes to look down into its own chamber, from the court's side
        ctx.shared.modelButtons = ctx.shared.modelButtons || [];
        for (const cx of LK.X) {
          const west = cx < (LK.X[0] + LK.X[1]) / 2;
          lbl("לשכות (ירמיה לה, ד; לו, י)", cx, WC.y + LK.H + 4, zMid, 3);
          ctx.shared.modelButtons.push({
            id: "mnt-lishka-roofs-" + (s < 0 ? "n" : "s") + (west ? "w" : "e"),
            label: "פתח את גג הלשכות",
            labelOn: "החזר את הגג",
            title: "מסיר לרגע את גגות הארז של ארבע הלשכות, לצפייה בלבד, ומעביר את המבט מלמעלה אל תוך הלשכה.",
            anchor: [cx, WC.y + LK.H + 1.5, zMid],
            maxDist: 120,
            get: () => !lishkaRoofs.visible,
            under: () => !!(ctx.shared.camUnder && ctx.shared.camUnder(lishkaRoofs.children.length ? lishkaRoofs.children : [lishkaRoofs])),   // 1.3.4: not closed over the eye
            set: (on) => {
              lishkaRoofs.visible = !on;
              if (on) {
                const fly = ctx.ui && typeof ctx.ui.fly === "function" ? ctx.ui.fly : typeof ctx.flyTo === "function" ? ctx.flyTo : null;
                if (fly) fly([cx + (west ? 9 : -9), WC.y + 44, zMid - s * 15], [cx, WC.y + 2, zMid]);
              }
            }
          });
        }
      }
      // 1.3.5: the place item is the court's middle - its view is from above, over the whole court with the four chambers in its corners
      ocItem("lishkot", "לשכות (ירמיה לה, ד; לו, י)", (WC.x0 + WC.x1) / 2, WC.y + LK.H / 2, 0, [180, 150, 44]);
    } catch (e) {
      console.warn("[mount] outer court chambers skipped:", e);
    }
    // b. "העמוד" - the king's standing place at the entrance to the inner court: II Kings 11:14 "והנה המלך עמד על העמוד כמשפט" (Yoash),
    //    II Kings 23:3 "ויעמד המלך על העמוד ויכרת את הברית" (Yoshiyahu); II Chr 23:13 "עמד על עמודו במבוא". Modeled (MNT_AMUD, model choice)
    //    as a round stone platform 4 across x 1 high (2 steps of 0.5 on its east side) carrying a short pillar 1.2 thick x 3 high with a base
    //    and a capital, at x 106, z 8: just east of the inner court's east gate steps (x 98.5..101.5, z +-6), which stay clear.
    try {
      const A = MNT_AMUD;
      // AMUD2_D (fix-d, 22.11.2026 - the user's decision 132): TWO READINGS, a row of the opinions table (ctx.shared.amudKing.set("bima" |
      // "side")). "bima" (the default, as until now) - Rashi on II Chr 23:13 (book 3662 line 709) "עומד המלך או הדוכוס במקום גבוה כדי שיוכלו
      // לראותו", Rashi on II Kings 11:14 (3680 line 418) "הוא מעמד המלך בבית ה'", Metzudat David there (3335 line 722) "על מקום מיוחד למלך
      // לעמוד שם", the Targum "אסטונא": the platform with the short pillar on it. "side" - the Radak on II Kings 11:14 (3542 line 573) "פי'
      // סמוך לעמוד", the Ralbag there (3644 line 366) "ר"ל אצל העמוד", the Radak on II Chr 34:31 (3522 line 541) "שעמד על רגליו סמוך לעמוד":
      // a free-standing pillar on the court's floor, the king standing by it; its form and height (six amot, r 0.75) - model choices.
      const gB = new Group(), gS = new Group();
      gB.name = "amudBima"; gS.name = "amudSide"; gS.visible = false;
      g.add(gB, gS);
      H2.cyl(gB, A.r, A.r, A.h, M2.stoneLight, A.x, WC.y, A.z, 40);                                           // platform r 2, 1 high (y 3..4)
      H2.cyl(gB, A.pr + 0.3, A.pr + 0.4, 0.3, M2.stoneSmooth, A.x, WC.y + A.h, A.z, 24);                       // base of the pillar 0.3 high (y 4..4.3), r 0.9 / 1.0
      H2.cyl(gB, A.pr, A.pr, A.ph, M2.stoneSmooth, A.x, WC.y + A.h + 0.3, A.z, 24);                            // the pillar r 0.6, 3 high (y 4.3..7.3)
      H2.cyl(gB, A.pr + 0.4, A.pr + 0.1, 0.35, M2.stoneSmooth, A.x, WC.y + A.h + 0.3 + A.ph, A.z, 24);         // capital 0.35 high (y 7.3..7.65), r 1.0 / 0.7
      // 2 steps on the east side, dir W, flight width 2; total rise 0.98 (= 1 less eps, so the top tread never shares the platform's top plane);
      // bottom at x 108.6: the flight x 107.6..108.6 runs 0.4 into the platform's round edge (x 108 at z 8), so there is no gap at its corners
      H2.stairs(gB, { width: 2, totalRise: A.h - 0.02, steps: 2, dir: "W", x: A.x + A.r + 0.6, y: WC.y, z: A.z, tread: MNT_STEP });
      // the "side" reading: a plinth, the shaft and a capital (six amot in all)
      H2.box(gS, 2.2, 0.5, 2.2, M2.stoneLight, A.x, WC.y, A.z);                                              // plinth 0.5 (y 3..3.5)
      H2.cyl(gS, 1.0, 1.05, 0.4, M2.stoneSmooth, A.x, WC.y + 0.5, A.z, 24);                                  // base 0.4
      H2.cyl(gS, 0.75, 0.75, 4.6, M2.stoneSmooth, A.x, WC.y + 0.9, A.z, 24);                                 // the shaft 4.6
      H2.cyl(gS, 1.15, 0.8, 0.5, M2.stoneSmooth, A.x, WC.y + 5.5, A.z, 24);                                  // capital 0.5 (top y 9)
      ctx.layers = ctx.layers || {};
      ctx.layers.amudBima = gB; ctx.layers.amudSide = gS;
      lbl("העמוד (מלכים ב יא, יד)", A.x, WC.y + 11, A.z, 3);
      ocItem("amud", "העמוד (מלכים ב יא, יד)", A.x, WC.y + A.h + 1.5, A.z, [124, 13, 24]); // cam from the east-south-east, the inner court's east gate behind
      ctx.shared.amudKing = {
        current: "bima", keys: ["bima", "side"],
        set(k) {
          this.current = k === "side" ? "side" : "bima";
          gB.visible = this.current === "bima";
          gS.visible = this.current === "side";
          if (ctx.requestRender) ctx.requestRender();
          return this.current;
        }
      };
    } catch (e) {
      console.warn("[mount] outer court amud skipped:", e);
    }
    // c. The donation chest at the gate - II Chr 24:8 "ויאמר המלך ויעשו ארון אחד ויתנהו בשער בית ה' חוצה"; II Kings 12:10 "ויקח יהוידע הכהן
    //    ארון אחד ויקב חר בדלתו ויתן אתו אצל המזבח מימין בבוא איש בית ה'" (the hole bored in its lid = the slot). Modeled (MNT_ARON, model
    //    choice) as a cedar chest 2 x 1.2 x 1.2 (long side along z) with two bronze bands and a lid with a slot, inside the outer court
    //    beside its east gate at x 224, z 7 (clear of the gate piers z +-5..+-6.5 and of the 10-wide gateway).
    // YEHOYADA_208 (the user, 12.11.2026 21:41: "אתה צריך להוסיף את ארון יהוידע, אבל זה יהיה מתג, זה לא כברירת מחדל. כי יהוידע היה
    // אחרי שלמה המלך הרבה בבית ראשון"; 22:32 "3. כמלבים"; 22:49 the inner one "בעזרת ישראל"): BOTH CHESTS, AS THE MALBIM - not two
    // readings but two chests at once: on II Kings 12:10 "ופה נזכר הארון של תקלין חדתין, וזה ניתן בפנים", and the one of Chronicles "לתקלין
    // עתיקין... וזה נתנו בחוץ"; on II Chr 24:8 the inner one "לשם נדרים ונדבות החדשים", the outer "מתקלין עתיקין... שזה הולך כולו לבדק
    // הבית". The inner: "ויתן אתו אצל המזבח מימין בבוא איש בית ה׳" (II Kings 12:10) - Rashi "אצל המזבח - בעזרה"; "מימין ביאת
    // האנשים"; Metzudat David "בימין הבא אל הבית, לא בימין היוצא" - so: in the inner court's east part (חצר הכהנים ועזרת ישראל, Rashi
    // on I Kings 6:36: one court here), 5 amot east of the altar and 8 north of the axis, on the right of him who comes in from the east
    // gate (the spot: model choice). The outer: "ויתנהו בשער בית ה׳ חוצה" (II Chr 24:8) - the chest that stood by the outer court's east gate
    // since 1.0.x. One switch (ctx.shared.yehoyada; a place and a pill), OFF by default; the label layer "yehoyada".
    try {
      const R = MNT_ARON;
      const yh = new Group();
      yh.name = "yehoyada";
      yh.visible = false;
      g.add(yh);
      ctx.layers.yehoyada = yh;
      const chestMat = M2.cedar.clone();
      chestMat.color.set(0x9A6A3C); // a warmer, darker cedar than the court's wall bands (model choice)
      const slotMat = new MeshStandardMaterial({ color: 0x1A1410, roughness: 0.95, metalness: 0 });
      const lidH = 0.2, bodyH = R.h - lidH; // body 1.0 + lid 0.2 = 1.2 high
      // a cedar chest 2 x 1.2 x 1.2 (its long side along z), two bronze bands, a lid with the slot (II Kings 12:10 "ויקב חר בדלתו";
      // Ralbag: "והיה בדלת שהיא מכסה הארון כדי שלא יוכל אחד לקחת ממנו בזולת פתיחת הארון")
      // YEHOYADA_ONE_211 (the sources review, S4-18; the user, 15.11.2026 18:12 "להוסיף מתג לרשי", 18:21 "2. ארון יהיודע"): a switch -
      // the Malbim's two chests (the default, as until now), or ONE chest, as Rashi on II Chr 24:8 (3662:739): "ויעשו ארון אחד. ובמלכים
      // כתיב ויקב חור בדלתו". Where the one chest stands Rashi does not say in one place: on Chronicles (3662:740) "ויתנהו בשער בית ה׳
      // חוצה. כדי שיוכלו לבא אליו כל נדיב לב", on Kings (3680:446) "אצל המזבח. בעזרה" - so two modes, "gate" and "altar", each a verse
      // (which of them the switch offers - the user's to say; 70-ui.js). The two chests are two groups; the labels go by flag layers.
      const yhOut = new Group(), yhIn = new Group(), fM = new Group(), fRG = new Group(), fRA = new Group();
      fRG.visible = fRA.visible = false;
      for (const q of [yhOut, yhIn, fM, fRG, fRA]) yh.add(q);
      ctx.layers.yehoyadaMalbim = fM; ctx.layers.yehoyadaRashiGate = fRG; ctx.layers.yehoyadaRashiAltar = fRA;
      const chest = (par, x, y, z) => {
        H2.box(par, R.w, bodyH, R.l, chestMat, x, y, z);                                                 // body 1.2 x 1.0 x 2
        H2.box(par, R.w + 0.1, lidH, R.l + 0.1, chestMat, x, y + bodyH, z);                               // lid 1.3 x 0.2 x 2.1, 0.05 proud all round
        H2.box(par, 0.12, 0.03, R.l * 0.6, slotMat, x, y + R.h, z);                                       // the slot: 0.12 x 1.2, a hair above the lid
        for (const yb of [0.3, 0.75]) H2.box(par, R.w + 0.06, 0.14, R.l + 0.06, M2.bronze, x, y + yb, z); // 2 bronze bands, 0.14 high, 0.03 proud (model choice)
      };
      chest(yhOut, R.x, WC.y, R.z);
      ctx.labels.push({ text: "ארון יהוידע שבשער — לתקלין עתיקין (דברי הימים ב כד, ח; מלבי״ם)", x: R.x, y: WC.y + 3.0, z: R.z, size: 1.0, layers: ["yehoyada", "yehoyadaMalbim"] });
      ctx.labels.push({ text: "ארון יהוידע — ״ויתנהו בשער בית ה׳ חוצה״ (דברי הימים ב כד, ח; לרש״י — ארון אחד)", x: R.x, y: WC.y + 3.0, z: R.z, size: 1.0, layers: ["yehoyada", "yehoyadaRashiGate"] });
      ocItem("aronNedavot", "ארון יהוידע שבשער (דברי הימים ב כד, ח)", R.x, WC.y + R.h / 2, R.z, [216, 8, 13]); // cam from the west-south-west, the gate behind
      const YI = MNT_ARON_IN;
      chest(yhIn, YI.x, LV.AZ, YI.z);
      ctx.labels.push({ text: "ארון יהוידע אצל המזבח — לתקלין חדתין (מלכים ב יב, י; מלבי״ם)", x: YI.x, y: LV.AZ + 4.6, z: YI.z, size: 2.2, layers: ["yehoyada", "yehoyadaMalbim"] });
      ctx.labels.push({ text: "ארון יהוידע — ״אצל המזבח מימין״ (מלכים ב יב, י; לרש״י — ארון אחד)", x: YI.x, y: LV.AZ + 4.6, z: YI.z, size: 2.2, layers: ["yehoyada", "yehoyadaRashiAltar"] });
      ctx.shared.yehoyada = { get on() { return yh.visible; }, set(v) { yh.visible = !!v; return yh.visible; }, inner: [YI.x, LV.AZ, YI.z], outer: [R.x, WC.y, R.z],
        mode: "two",   // YEHOYADA_ONE_211: "two" (the Malbim), "gate" / "altar" (Rashi's one chest, by the verse of Chronicles / of Kings)
        setMode(m) { this.mode = m === "gate" || m === "altar" ? m : "two"; yhOut.visible = this.mode !== "altar"; yhIn.visible = this.mode !== "gate";
          fM.visible = this.mode === "two"; fRG.visible = this.mode === "gate"; fRA.visible = this.mode === "altar"; return this.mode; } };
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({
        id: "mnt-yehoyada",
        label: "הצג את ארון יהוידע (בימי יואש)",
        labelOn: "הסתר את ארון יהוידע",
        title: "שני ארונות, כמלבי״ם: אחד אצל המזבח — ״ויתן אתו אצל המזבח מימין בבוא איש בית ה׳״ (מלכים ב יב, י), ואחד בשער — ״ויתנהו בשער בית ה׳ חוצה״ (דברי הימים ב כד, ח). בימי שלמה עוד לא היו — לכן אינם מוצגים כברירת מחדל.",
        anchor: [YI.x, LV.AZ + 3.2, YI.z],
        maxDist: 140,
        get: () => yh.visible,
        set: (on) => { yh.visible = !!on; }
      });
    } catch (e) {
      console.warn("[mount] the chests of Yehoyada skipped:", e);
    }
    // d. The court's gate is named "השער המזרחי של החצר החיצונה" (label below; ctx.shared.gates.newCourtE.name). Tradition also names an
    //    upper gate of the house, "שער בית ה' העליון" built by Yotam (II Kings 15:35), and "שער בית ה' החדש" in "החצר העליון" (Jer 36:10) - names
    //    only, with no measure or place in the sources: not modeled separately (model choice).

    // ---------- labels ----------
    lbl("הר הבית", CX, 55, 230, 8);
    lbl("החצר הגדולה", CX, 26, 160, 6);
    lbl("החצר החיצונה", (WC.x0 + WC.x1) / 2, 13, 22, 4); // 1.0.1 (the user): "החצר החיצונה"; Rashi on I Kings 6:36 calls it עזרת נשים; not "החצר החדשה" (Rashi Pesachim 92a: that is הר הבית)
    lbl("השער המזרחי של החצר החיצונה", WC.x1 + 6, WC.y + 9, 0, 3.5); // the court's gate (1.0.1, D.2.d); "שער בית ה' העליון" of II Kings 15:35 (Yotam) is a name only, not modeled separately
    lbl("השער המזרחי", CO2.harE + 9, 28, gE.z, 5);
    lbl("השער הצפוני — שער טדי", gN.x, 28, CO2.harN - 9, 5);   // NAMES_C (fix-c, 22.11.2026; the user: "לבצע"): the names of Middot 1:3 - a model choice in this house
    lbl("השער הדרומי — שער חולדה", gS.x, 28, CO2.harS + 9, 5);
    lbl("השער המערבי — שער קיפונוס", CO2.harW - 9, 28, gW.z, 5);

    // ---------- fly points and shared data ----------
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    Object.assign(ctx.shared.flyPoints, {
      harHabayit: { pos: [720, 320, 520], target: [100, 10, 80] },
      eastGate: { pos: [CO2.harE + 150, 35, gE.z], target: [CO2.harE, 14, gE.z] }, // the great court's east gate, from outside
      newCourt: { pos: [280, 72, 128], target: [(WC.x0 + WC.x1) / 2, WC.y + 1, 0] } // the outer court (החצר החיצונה); the key "newCourt" is kept: it is the id used by 30-courts.js and 70-ui.js
    });
    ctx.shared.newCourt = { x0: WC.x0, x1: WC.x1, z0: WC.z0, z1: WC.z1, y: WC.y, gate: { x: WC.x1, z: 0 }, name: "החצר החיצונה" }; // = החצר החיצונה (key name kept for the consumers)
    ctx.shared.gates = Object.assign(ctx.shared.gates || {}, { greatE: gE, greatW: gW, greatN: gN, greatS: gS, newCourtE: { x: WC.x1, z: 0, name: "השער המזרחי של החצר החיצונה" } });
    ctx.shared.outerCourtItems = outerItems; // 1.0.1 (FIXES D.3): [{key, name, x, y, z, cam}] - the chambers (north pair), the עמוד and the donation chest, for the UI's place items
    ctx.shared.groundY = GROUND_Y;
  }
