  // ===== 20-mount.js: the mount, the great court (החצר הגדולה) and the outer court (החצר החיצונה) =====
  // Builds: terrain, the 500 x 500 platform with its foundation walls, the great court wall (bands of 3 stone courses + 1 cedar
  // course) with four gates, bronze doors and exterior steps, and the outer court east of the inner court with its uses (1.0.1):
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
  //   the bronze doors are the inner court's; the outer court's bronze doors repeat them by analogy (model choice).
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
  var MNT_ARON = { x: 224, z: 7, l: 2, w: 1.2, h: 1.2 }; // the donation chest (II Chr 24:8; II Kings 12:10): cedar, 2 long (along z) x 1.2 x 1.2, inside the outer
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
  function mnt_gatePortal(parent, { axis = "x", gx = 0, gz = 0, y = 0, T = 5, openW = 10, openH = 20, doorH = 20, doorMat, inward = 1, fadeWith = null, M: M2, H: H2 }) {
    const tr = (m) => {
      if (fadeWith) H2.occ(m).userData.fadeWith = fadeWith;
      return m;
    };
    const eps = 0.02; // model choice: a hair's offset so no face of the frame shares a plane with a same-facing face of the wall or of another frame piece (no z-fighting)
    const jw = 1.8, jh = openH + 1.8 - eps, jd = T + 1.6; // 1.0.19 values: jambs 1.8 wide, 0.8 proud of each wall face, reaching (eps under) the top of the 1.8-high stone lintel
    const jOff = openW / 2 + jw / 2 - eps, lw = openW + 2 * jw; // the jamb face stands eps proud of the wall's reveal; the lintel (openW + 3.6) overhangs the jambs by eps
    const ld = T + 1.2, td = T + 1.4; // 1.0.19 values (model choice): the lintel 0.6 proud of each wall face, the threshold 0.7
    if (axis === "x") {
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
      if (axis === "x") {
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

  async function buildMount(ctx) {
    const M2 = ctx.M, H2 = ctx.H, CO2 = ctx.CO, LV2 = ctx.LV;
    const g = new Group();
    g.name = "mount";
    ctx.root.add(g);
    const CX = (CO2.harW + CO2.harE) / 2; // 103: centre of the 500 x 500 platform (Middot 2:1 placement: x -147..353)
    const CZ = (CO2.harN + CO2.harS) / 2; // 82.5: z -167.5..332.5 (most open space on the south, Middot 2:1)
    const T = MNT_WALL_T, WH = MNT_WALL_H, GROUND_Y = MNT_GROUND_Y;
    const stoneC = mnt_courseStone(M2);
    const bronzeDoor = M2.bronze.clone();
    bronzeDoor.roughness = 0.42; // bronze-overlaid doors after II Chr 4:9 "ודלתותיהם צפה נחשת" - said of the inner court (Rashi there: "העזרה הגדולה - זו עזרת ישראל");
                                 // repeated for the outer court's gates by analogy (model choice; big bronze surface, roughness .3-.5)
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
    const terrainH = (x, z) => {
      const d = rectDist(x, z);
      const ramp = sm(70, 380, d);
      let h = bump(x, z, 1100, 30, 460, 950, 190) + bump(x, z, -700, 620, 420, 330, 130) + bump(x, z, -560, -760, 460, 380, 100) + bump(x, z, 220, 1350, 560, 320, 130) + bump(x, z, 380, -1380, 620, 360, 120);
      h += (fbm(x * 3e-3, z * 3e-3) - 0.5) * 120 + (fbm(x * 0.012, z * 0.012) - 0.5) * 22;
      const rim = sm(1500, 2500, Math.hypot(x - CX, z - CZ)) * 260;
      return GROUND_Y + ramp * Math.max(h * 0.2, -5) + rim * 0.15 * ramp;
    };
    try {
      const SIZE = 5200, SEG = 220;
      const geo = new PlaneGeometry(SIZE, SIZE, SEG, SEG);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) + CX, z = pos.getZ(i) + CZ, h = terrainH(x, z);
        pos.setXYZ(i, x, h, z);
        const k = 0.86 + fbm(x * 0.02, z * 0.02) * 0.2, up = sm(-20, 160, h - GROUND_Y);
        col[i * 3] = Math.min(1, k * (0.93 - up * 0.03));
        col[i * 3 + 1] = Math.min(1, k * (0.94 - up * 0.03));
        col[i * 3 + 2] = Math.min(1, k * (0.84 - up * 0.04));
      }
      geo.setAttribute("color", new BufferAttribute(col, 3));
      geo.attributes.uv.array.forEach((v, i, arr) => arr[i] = v * SIZE);
      geo.computeVertexNormals();
      const tm = M2.ground.clone();
      tm.vertexColors = true;
      tm.color.set(15527123);
      const terrain = new Mesh(geo, tm);
      terrain.receiveShadow = true;
      g.add(terrain);
    } catch (e) {
      console.warn("[mount] terrain skipped:", e);
    }

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
    const bandOpts = { height: WH, thickness: T, y: LV2.HAR, stoneH: MNT_STONE_BAND, cedarH: MNT_CEDAR_BAND, stoneMat: stoneC, cedarMat: M2.cedar, H: H2 };
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
    const portal = { T, openW: MNT_GATE_W, openH: MNT_GATE_H, doorH: MNT_GATE_H, doorMat: bronzeDoor, M: M2, H: H2, y: LV2.HAR };
    mnt_gatePortal(g, Object.assign({ axis: "z", gx: gE.x, gz: gE.z, inward: 1, fadeWith: wallE.stone }, portal));
    mnt_gatePortal(g, Object.assign({ axis: "x", gx: gN.x, gz: gN.z, inward: 1, fadeWith: wallN.stone }, portal));
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
    // platform (6 steps), paved, enclosed by a low wall 4 high (3 stone courses of 1 + 1 cedar course, the I Kings 6:36 pattern) 2 thick,
    // with an open gate 10 wide in the middle of its east side (named "השער המזרחי של החצר החיצונה", 1.0.1). The chambers, the king's עמוד and
    // the donation chest (1.0.1) are built after the gate; no gallery. Its west side is the inner court's podium
    // (3 above this floor) and wall; the 6 steps from here up to the inner court's east gate are built in 30-courts.js.
    const WC = { x0: CO2.azE, x1: CO2.azE + MNT_WC_SIZE, z0: -MNT_WC_SIZE / 2, z1: MNT_WC_SIZE / 2, y: MNT_WC_Y, t: MNT_WC_WALL_T, h: MNT_WC_WALL_H };
    const wcPodW = CO2.azE + 5;         // 98.5: the inner court podium's east face (30-courts.js: podium x -98.5..98.5)
    const wcPodE = WC.x1 + WC.t / 2;    // 229.5: outer face of the low east wall
    const wcDepth = MNT_WC_SIZE + WC.t; // z -68.5..68.5: the podium reaches under the low north / south walls
    H2.box(g, wcPodE - WC.x0, WC.y - 0.15, wcDepth, M2.stone, (WC.x0 + wcPodE) / 2, LV2.HAR, 0);     // podium y 0..2.85 (overlaps into the inner podium, hidden)
    H2.box(g, wcPodE - WC.x0, 0.15, wcDepth, M2.paveFine, (WC.x0 + wcPodE) / 2, WC.y - 0.15, 0);     // paving, top at 3
    const wcOpts = { height: WC.h, thickness: WC.t, y: WC.y, stoneH: MNT_STONE_BAND, cedarH: MNT_CEDAR_BAND, stoneMat: stoneC, cedarMat: M2.cedar, H: H2 };
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
      H2.cyl(g, A.r, A.r, A.h, M2.stoneLight, A.x, WC.y, A.z, 40);                                           // platform r 2, 1 high (y 3..4)
      H2.cyl(g, A.pr + 0.3, A.pr + 0.4, 0.3, M2.stoneSmooth, A.x, WC.y + A.h, A.z, 24);                       // base of the pillar 0.3 high (y 4..4.3), r 0.9 / 1.0
      H2.cyl(g, A.pr, A.pr, A.ph, M2.stoneSmooth, A.x, WC.y + A.h + 0.3, A.z, 24);                            // the pillar r 0.6, 3 high (y 4.3..7.3)
      H2.cyl(g, A.pr + 0.4, A.pr + 0.1, 0.35, M2.stoneSmooth, A.x, WC.y + A.h + 0.3 + A.ph, A.z, 24);         // capital 0.35 high (y 7.3..7.65), r 1.0 / 0.7
      // 2 steps on the east side, dir W, flight width 2; total rise 0.98 (= 1 less eps, so the top tread never shares the platform's top plane);
      // bottom at x 108.6: the flight x 107.6..108.6 runs 0.4 into the platform's round edge (x 108 at z 8), so there is no gap at its corners
      H2.stairs(g, { width: 2, totalRise: A.h - 0.02, steps: 2, dir: "W", x: A.x + A.r + 0.6, y: WC.y, z: A.z, tread: MNT_STEP });
      lbl("העמוד (מלכים ב יא, יד)", A.x, WC.y + 11, A.z, 3);
      ocItem("amud", "העמוד (מלכים ב יא, יד)", A.x, WC.y + A.h + 1.5, A.z, [124, 13, 24]); // cam from the east-south-east, the inner court's east gate behind
    } catch (e) {
      console.warn("[mount] outer court amud skipped:", e);
    }
    // c. The donation chest at the gate - II Chr 24:8 "ויאמר המלך ויעשו ארון אחד ויתנהו בשער בית ה' חוצה"; II Kings 12:10 "ויקח יהוידע הכהן
    //    ארון אחד ויקב חר בדלתו ויתן אתו אצל המזבח מימין בבוא איש בית ה'" (the hole bored in its lid = the slot). Modeled (MNT_ARON, model
    //    choice) as a cedar chest 2 x 1.2 x 1.2 (long side along z) with two bronze bands and a lid with a slot, inside the outer court
    //    beside its east gate at x 224, z 7 (clear of the gate piers z +-5..+-6.5 and of the 10-wide gateway).
    try {
      const R = MNT_ARON;
      const chestMat = M2.cedar.clone();
      chestMat.color.set(0x9A6A3C); // a warmer, darker cedar than the court's wall bands (model choice)
      const slotMat = new MeshStandardMaterial({ color: 0x1A1410, roughness: 0.95, metalness: 0 });
      const lidH = 0.2, bodyH = R.h - lidH; // body 1.0 + lid 0.2 = 1.2 high
      H2.box(g, R.w, bodyH, R.l, chestMat, R.x, WC.y, R.z);                                                  // body 1.2 x 1.0 x 2 (y 3..4)
      H2.box(g, R.w + 0.1, lidH, R.l + 0.1, chestMat, R.x, WC.y + bodyH, R.z);                              // lid 1.3 x 0.2 x 2.1, 0.05 proud all round (y 4..4.2)
      H2.box(g, 0.12, 0.03, R.l * 0.6, slotMat, R.x, WC.y + R.h, R.z);                                       // the slot in the lid (II Kings 12:10 "ויקב חר בדלתו"): 0.12 x 1.2, a hair above the lid
      for (const yb of [0.3, 0.75]) H2.box(g, R.w + 0.06, 0.14, R.l + 0.06, M2.bronze, R.x, WC.y + yb, R.z); // 2 bronze bands round the body, 0.14 high, 0.03 proud (model choice)
      lbl("ארון הנדבות (דברי הימים ב כד, ח)", R.x, WC.y + 5, R.z, 2.5);
      ocItem("aronNedavot", "ארון הנדבות (דברי הימים ב כד, ח)", R.x, WC.y + R.h / 2, R.z, [216, 8, 13]); // cam from the west-south-west, the gate behind
    } catch (e) {
      console.warn("[mount] outer court donation chest skipped:", e);
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
    lbl("השער הצפוני", gN.x, 28, CO2.harN - 9, 5);
    lbl("השער הדרומי", gS.x, 28, CO2.harS + 9, 5);
    lbl("השער המערבי", CO2.harW - 9, 28, gW.z, 5);

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
