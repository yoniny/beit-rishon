  // 1.0.1-L Part 7 (1.11.2026 evening): the climber is a silhouette; every paw and wing reaches the very middle; the throne and judgment halls moved parallel to בית בת פרעה (group thG, THDX 63, THDZ -49.5); both court walls are 7:12's three courses and a cedar course; 17 amot of bare ground between the courts; brown boards; forestAlam diagonal in all readings.
  // ===== בית שלמה — Solomon's palace (I Kings 7:1-12; 10:5, 10:16-21), layer ctx.layers.palace (VISIBLE by default since 1.0.1; the UI checkbox toggles it) =====
  // Sources: the verses give measures only for בית יער הלבנון (100 x 50 x 30, I Kings 7:2) and אולם העמודים (50 x 30, 7:6);
  // everything else is from the commentators (Rashi, Radak, Metzudot, Malbim, Ralbag on I Kings 7:1-12 and 10:5-21, see
  // research/research-part1-short.md, topic "ארמון שלמה") or a model choice. The throne: I Kings 10:18-20. The visual reference for the
  // Rashi reading is the book (the user's reference) "מקרא מפורש — איורי בית המקדש הראשון", pages 18-25 (its pp. כ-כה: p10-p13 of the PDF);
  // the book is the basis of model choices, never a halachic source.
  // PLACEMENT (1.0.1; the same basis is exposed in Hebrew as ctx.shared.palaceBasis for the UI). No verse measures the distance, but
  // the verses do say that the king's house stood BELOW the house of the LORD and that one went UP from it to the Temple:
  // I Kings 10:5 "ועלתו אשר יעלה בית ה'" (the queen of Sheba saw his ascent to the house; the parallel II Chr 9:4 reads "ועליתו"),
  // II Kings 11:19 "וירידו את המלך מבית ה' ויבואו דרך שער הרצים בית המלך" (1.0.1-L: spelled as the library prints it), Jer 26:10
  // "ויעלו מבית המלך בית ה'", Jer 22:1 "רד בית מלך
  // יהודה"; and the city (עיר דוד, on the south of the Temple Mount) lay below the Temple: the ark is brought UP "מעיר דוד היא ציון"
  // to the house (I Kings 8:1). Hence the palace stands adjacent to the Temple's great court on the SOUTH, on a lower terrace, with
  // the stair of 20 steps from its north gate up to the Temple's south gate (so also the book מקרא מפורש, which draws it south of
  // the Temple). Model choices: the exact gap (its north wall 20 amot south of the court's south wall), the drop of 10 amot (floor
  // y = -10, 20 steps of 0.5), the north-south axis, the public entrance from the south (the city side), the king's house at the
  // north end nearest the Temple. Order of the halls from the south (Metzudot and Malbim on 7:7-8): אולם המשפט,
  // אולם הכסא, [7:6: עמודים ועב / אולם על פניהם], אולם העמודים, בית יער הלבנון - all in the great court -, and behind it (1.0.1-L),
  // outside the great court, החצר האחרת - the king's own walled court with בית המלך and the garden; בית בת פרעה stays in the great court.
  // 1.0.1 (FIXES H.5): בית יער הלבנון is built in TWO switchable readings, each complete in its own Group (section 5); THREE since 1.0.1-L.
  // 1.0.1-K (FIXES K.6, the user's fourth and fifth lists, 28.10.2026):
  //  - the Rashi reading rebuilt after the book (pp. יח-כב): four rows of 29 close-set posts along the house, the כרתות from post to post
  //    (ONE beam per span, end to end), the floor of the upper storey (the book: "גג הקומה התחתונה, שהוא רצפת הקומה העליונה"), upper walls
  //    "woven" of close-set logs with square windows and doorways lined with thin boards, the עבים on them, the 45 big boards (5 wide: 75
  //    of the 100, as the book draws) and the second roofing whose small beams are ONE per space, the three of a line end to end (1.0.1
  //    cut every small beam into 3 pieces - wrong per Rashi 7:4 "שלשה מרישין זה אצל (צריך לומר: לסוף) זה" and the book "קצה מול קצה");
  //    stone end walls.
  //  - 7:6 in both readings: Rashi per the book (p13R) - אולם העמודים a low entrance hall and "ואולם על פניהם" a HIGH hall before it
  //    ("אולם גבוה"); the second reading per Malbim - a second ulam before אולם העמודים and the pillars with the עב before that one.
  //  - the 200 צינות and 300 מגנים of 10:16-17 and the gold vessels of 10:21 inside בית יער הלבנון (both readings; the book p12R).
  //  - בית המלך furnished (10:5; 7:8 Rashi "לאכל שם ולשכב שם"), the garden and the pool (Kohelet 2:5-6), lamps, carpets, cedar plank
  //    floors (7:7), a better throne (10:18-20); the forest house + אולם העמודים moved 10 amot north (the other court 60 deep, not 70) to
  //    make room for 7:6; nothing of the palace is in ctx.cutaway any more (that list opens the HOUSE); two on-model buttons remove the
  //    roofs of the king's house and of the throne hall; ctx.shared.anchors.forestRoof; fly points forestInside, throne, kingsHouse.
  //  - review fixes (1.0.1-K): the two roof pills on the halls' east parapets, clear of the halls' names; the plank floors' bed 0.16 (no face
  //    shared with the other court's paving under בית בת פרעה); the king's dais to x 72 (the table's legs on it); the gate jambs 0.02 into
  //    the openings; in Rashi's reading the small beams and their ledges are no longer in ctx.forestBoardsCut; the windows of the second
  //    reading quote Metzudat David's own words on 7:4 ("מכוונות זו מול זו").
  // 1.0.1-L (FIXES-1.0.1-L.md, the user's answers of 29.10.2026):
  //  - L.20 (the user: "תוסיף"): a THIRD reading of בית יער הלבנון, Metzudat David's own (group forestMzd, key "mzd", section 7c): four rows
  //    of 15 cedar posts ACROSS the house and real stone walls along it (7:2), a כרותה on each row, the צלעות laid from row to row and on
  //    them the 45 cedar boards, each 33 1/3 x 3 1/3 - his own numbers (7:3), three rows of windows in each long wall, window opposite window
  //    (7:4), three square doorways in each long wall, one in each third, with square posts and a small window over each (7:5), and
  //    אולם העמודים along the long side before the three doorways, "וכדרך בית שער", with the pillars and the עב before its openings (7:6).
  //    The second reading ("metzudot", section 7a) now carries only Malbim and Ralbag (its name "מלבי״ם ורלב״ג"; its geometry is unchanged,
  //    its credits and labels are). forestHouse.set(key) also aims the fly points forestRoof, forestUpper, forestAlam and forestAv.
  //  - L.22 (the user: "בלי בריכה"): the garden without the pool; its label "הגן (קהלת ב, ה)", fly point garden.
  //  - L.33 (the user: "בית המלך היה בחצר אחרת לגמרי! ולא בתוך חצר בית יער הלבנון"; and "בית בת פרעה בתוך חצר בית יער הלבנון"):
  //    as the book draws it (p13: "חצר הגדולה" round the forest house and its halls, "חצר אחרת" with "ביתו" a separate enclosure), the
  //    great court's wall (7:12) no longer runs round the whole terrace: its north wall stands at z 443..446 (section 2), and החצר האחרת is
  //    the king's OWN court OUTSIDE it, walled all round in hewn stone (section 8), behind בית יער הלבנון across a lane 11 wide; its south
  //    gate faces the great court's north gate and the forest house's middle north doorway ("מבית לאולם" - Rashi "לפנים מן אולם של בית
  //    יער הלבנון"), its north gate opens onto the stair up to the Temple (Rashi 10:5 "דרך מבוא שהכין מביתו לבית המקדש"); inside it בית
  //    המלך (in place) and the garden before it (Malbim "החצר שלפני בית המלך"). A low parapet runs along the terrace's edges outside both
  //    courts. בית בת פרעה stays in the great court (section 10), west of אולם העמודים (II Chr 8:11 "לא תשב אשה לי בבית דויד"), with its
  //    own roof pill; the king's pill opens only his house.
  //  - L.48 (the user: "בהצגת אולם העמודים למצודות, הוא מציג את בית יער הלבנון במקום את אולם העמודים - אגב עיין בספר ולפי"ז תבין את העב"):
  //    the fly point forestAlam shows אולם העמודים itself in each reading (Rashi: the low hall from the east; Malbim and Ralbag: from the east
  //    along an aisle, its stone wall faded; Metzudat David: his hall along the long side); in Rashi's reading the עב is what the book draws and names at
  //    the end of the roof (p11R "הניחו עצים עבים [אך לא רחבים מדאי] הנקראים 'מריש' מעמוד לעמוד"): the beams of the second roofing,
  //    now thick (0.6 x 1.0) and resting on the log tops, standing over the roof between the thin boards; the wall plates that 1.0.1-K
  //    called "the עבים" are removed (the logs rise to the house's 30); labels "״ועמדים״" / "״ועב״" apart; forestAv (Rashi) looks at the
  //    עבים; the targets of forestRoof / forestUpper and of the palace overview lie outside the buildings (clear rays).
  //  - L.57 (the user: "לגבי כסא שלמה עיין במלכים וכן בקבצים המצורפים", "הבא בעצמך עוד מקורות לכסא שלמה"): the throne rebuilt after I Kings
  //    10:18-20, II Chr 9:17-19 with Rashi (who sends to the aggadah of Esther / Targum Sheni), Metzudat David, Ralbag, Malbim, and על פי
  //    המדרש (Targum Sheni on Esther 1:2, Esther Rabbah 1:12, Bamidbar Rabbah 12:17, Abba Gorion, Panim Acherim): the broad body and the
  //    round raised seat-place, the seat with its round-headed back, the arm-staves, 2 lions by the arms, on every step 2 lions and 2 eagles
  //    (the inner two stretching a paw / a wing toward the one who climbs, sides changing from step to step) and a lying pair of
  //    creatures facing each other (ox-lion, wolf-lamb, leopard-kid, eagle-peacock, cat-rooster, hawk-bird), precious stones on the risers,
  //    the sceptre behind the seat with the dove holding the crown over the head ("נוגע ואינו נוגע"), the footstool (Malbim) and the golden
  //    ramp before the steps (Metzudat David on II Chr 9:18 "כבש מזהב"), two golden seats for
  //    the High Priest and his deputy and seventy for the elders; figure builders pal_fig, pal_lionStandGeo, pal_eagleGeo, pal_beastGeo,
  //    pal_chairGeo; fly point throneSteps; ctx.shared.throne; palaceNotes.throne rewritten with the sources. (Since L.81 the midrashic parts of this
  //    list belong to the versions below; the default shows the verses and their commentators alone.)
  //  - L.78-L.81 (the user: "בכסא - תן כפתור מצגת מיוחד המציג את עליית המלך (ללא המלך עצמו) לכסא...", "הוסף זאת לכסא שלמה, השתמש במקור
  //    כדי להוסיף ידע", "פה יש את כל המדרשים על כסא שלמה, צור כפתור לכל דעה סותרת וכן מצגת לכל אחד מהם"): the throne in FOUR versions,
  //    ctx.shared.throneVersion.set("pesukim" | "targumSheni" | "estherRabbah" | "beitHamidrash") - the verses with their commentators
  //    alone (the default), Targum Sheni (the lions facing the eagles, the lying pairs, the menorah, the dove with the hawk, the 24 vines,
  //    the great eagle with the crown), Esther Rabbah with Panim Acherim and Abba Gorion (the paw and the wing per step, the sceptre with
  //    the dove and the crown, two lions of their own on the first step with the marble pillars on their heads and the vines, the hollow lions
  //    of spices, the palms with ivory peacocks), Beit HaMidrash II (exactly twelve lions with the inscribed tablets and twelve eagles, the
  //    pillars on the two lions by the arms, the palms with ivory peacocks, the spice vessels, the five pairs with the bear and the deer, the
  //    seventy chairs each with two small lions and two eagles, the crown by the left lion); the three midrashic versions share the cog-wheels
  //    at the steps' sides, the ark with the scroll beside the seat, the silver dragon and ONE instanced set of the seventy seats. The king's ascent (a pill on the
  //    throne, no king figure: the wheel of each step turns, the paw / the wing stretch alternately, the dove brings the scroll to the lap,
  //    the crown, the spices, each version by its own midrash) and the witnesses' scene (the wheels turn, every creature cries out) are
  //    timelines in one ctx.animated hook with captions per moment (ctx.shared.throne.script / witnessScript); palaceNotes.throneVersions
  //    and throneAscent (with the Ben Yehoyada on Sanhedrin 106b for the UI's bubble). Figure builders pal_lionPawGeo, pal_lionTabletGeo,
  //    pal_tabletTex, pal_eagleWingGeo, pal_gearGeo, pal_scrollGeos, pal_crownGeo, pal_menorahGeo, pal_vineVaultGeo, pal_vineArcGeo,
  //    pal_palmGeos, pal_dragonGeo; the lion and eagle builders take `omit` for the moving limbs; pal_beastGeo adds "bear" and "deer".
  //  - round-K leftovers: the labels that name the boards are also on the layer ctx.layers.forestBoards, so they go with the boards (a
  //    per-frame check keeps that layer equal to the boards' own visibility); the roof pills' comment (only the throne hall's pill is 23.5
  //    from its name); Rashi's words quoted in the library's spelling (לארך, כלן, מחפין, כפה, לארג, לקרוי, אצל (צריך לומר: לסוף)).
  // Contracts: ctx.layers.forestRashi / forestMetzudot / forestMzd (the groups), ctx.layers.forestBoards (the labels that name the boards),
  // ctx.shared.forestHouse {current, keys ["rashi", "metzudot", "mzd"], names, set(key)}, ctx.forestBoardsCut (the removable roofing of the
  // three readings), labels with `layers: ["palace", <variant>]` (plus "forestBoards" on those that name the boards), ctx.shared.flyPoints
  // (palace, forestRoof, forestUpper, forestInside, forestAlam, forestAv - these follow the reading -, throne, throneSteps, kingsHouse,
  // garden, otherCourt, pharaohDaughter), ctx.shared.forestHouseNotes / palaceNotes (Hebrew; keys kingsHouse, otherCourt, garden,
  // pharaohDaughter, throne, shields, alamAlPeneihem), ctx.shared.palaceCourts (greatCourt, lane, otherCourt, kingsHouse, garden,
  // pharaohDaughter: footprints for the UI), ctx.shared.throne (the throne's measures and the six pairs), ctx.shared.modelButtons
  // (palaceKingRoofs, palacePharaohRoof, palaceThroneRoofs), ctx.shared.anchors.forestRoof.
  // Local research coordinates: X = world x - 13 (0..180), research y -> world z = 669.5 - y (y grows northward).
  var PAL_Y = -10;   // palace floor: 10 amot below the Temple's great court (model choice)
  var PAL_X = 103;   // palace axis = world x of research X 90 (also the axis of the Temple's south gate); all buildings centred on it
  function pal_wz(y) { return 669.5 - y; }   // research y (0 at the inner face of the south court wall) -> world z
  function pal_wx(X) { return 13 + X; }      // research X -> world x

  // The geometry of a wall with rectangular holes anywhere (H.wall only cuts openings that start at the floor): an extruded shape
  // whose origin is the wall's bottom centre, built in the x-y plane; an axis "z" wall must be turned by +90 degrees about y
  // (rotation.y = PI / 2) by the caller, which is why its hole offsets are mirrored here. holes: [{c, b, w, h}] where c is the offset
  // of the hole centre along the wall from the wall centre (+x for axis "x", +z for axis "z"), b the bottom of the hole above the
  // wall bottom. (1.0.1 H.5: split out of pal_wall so the forest house's partitions can instance one holed panel.)
  function pal_wallGeo({ axis = "x", length, height, thickness = 3, holes = [] }) {
    const shape = new Shape();
    shape.moveTo(-length / 2, 0);
    shape.lineTo(length / 2, 0);
    shape.lineTo(length / 2, height);
    shape.lineTo(-length / 2, height);
    shape.closePath();
    for (const o of holes) {
      const lc = axis === "z" ? -(o.c || 0) : (o.c || 0); // the shape's +x maps to world -z after the 90-degree turn
      const x0 = lc - o.w / 2, x1 = lc + o.w / 2, y0 = o.b || 0, y1 = (o.b || 0) + o.h;
      const p = new Path();
      p.moveTo(x0, y0);
      p.lineTo(x1, y0);
      p.lineTo(x1, y1);
      p.lineTo(x0, y1);
      p.closePath();
      shape.holes.push(p);
    }
    const geo = new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 1 });
    geo.translate(0, 0, -thickness / 2);
    return geo;
  }

  // A wall mesh with rectangular holes anywhere (see pal_wallGeo for axis / holes). x,z = wall centre, y = wall bottom.
  function pal_wall(ctx, parent, { axis = "x", length, height, thickness = 3, mat, cx = 0, cz = 0, y = 0, holes = [], occlude = true }) {
    const m = new Mesh(pal_wallGeo({ axis, length, height, thickness, holes }), mat || ctx.M.stone);
    if (axis === "z") m.rotation.y = Math.PI / 2;
    m.position.set(cx, y, cz);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    if (occlude) ctx.H.occ(m);
    return m;
  }

  // The palace court wall (I Kings 7:12 "וחצר הגדולה סביב שלשה טורים גזית וטור כרתת ארזים"; Rashi on 7:12: three courses of stone
  // and a course of wood on them, repeating): stacked bands of 3 stone courses (3 high) + 1 cedar course (1 high). A gate (model
  // choice: 10 wide x 8 high) splits the bands below its top into a left and a right box; the band above it is the flat lintel.
  // gate.c = offset of the gate centre along the wall (+x for axis "x", +z for axis "z"). Returns the boxes; all fade together.
  let PAL_WALL_CEDAR = null;   // the walls' cedar course (one material)
  function pal_bandWall(ctx, parent, { axis = "x", length, cx = 0, cz = 0, y = 0, height = 10, thickness = 3, gate = null, name = "courtWall" }) {
    const { H, M } = ctx;
    // 1.0.1-L (Part 7, P5, the user: "החומה צריך להיות בה כרותות ארזים"): exactly as I Kings 7:12 "שלשה טורים גזית וטור כרתת ארזים" with Rashi "החומה עשויה שלשה נדבכין של אבנים, ונדבך של עץ עליהם":
    // three courses of hewn stone, told apart by their shade, and on them one course of brown cedar beams, 0.15 proud of the stone on each side so that it reads from afar (the heights: model choice)
    if (!PAL_WALL_CEDAR) { PAL_WALL_CEDAR = M.cedar.clone(); PAL_WALL_CEDAR.color.set(0xC08A52); }
    const CH = height * 0.16, SH = (height - CH) / 3;
    const pattern = [[SH, M.stone, 0], [SH, M.stoneLight, 0], [SH, M.stone, 0], [CH, PAL_WALL_CEDAR, 0.3]];
    const pieces = [];
    let first = null, yy = 0, i = 0;
    while (i < pattern.length) {
      const [bh, mat, proud] = pattern[i];
      const thk = thickness + proud;
      const segs = [];
      if (gate && yy < gate.h - 1e-6) {
        segs.push([-length / 2, gate.c - gate.w / 2]);
        segs.push([gate.c + gate.w / 2, length / 2]);
      } else segs.push([-length / 2, length / 2]);
      for (const [a, b] of segs) {
        const len = b - a, mid = (a + b) / 2;
        if (len <= 1e-6) continue;
        const m = axis === "x"
          ? H.box(parent, len, bh, thk, mat, cx + mid, y + yy, cz)
          : H.box(parent, thk, bh, len, mat, cx, y + yy, cz + mid);
        m.name = proud ? name + "Cedar" : name;
        H.occ(m);
        if (first) m.userData.fadeWith = first;
        else first = m;
        pieces.push(m);
      }
      yy += bh;
      i++;
    }
    return pieces;
  }

  // Instanced geometries: items = [{x, y, z, rx?, ry?, rz?, s?, sx?, sy?, sz?}] with y = the CENTRE of the geometry; s = a uniform
  // scale, sx / sy / sz = per-axis scales (1.0.1-K: rotation about all axes and scaling, for the logs, the shields and the trees).
  // shadow = castShadow (1.0.1-K: off for the furnishing inside closed buildings - the sun never reaches it, the shadow pass is saved).
  function pal_instanced(parent, geo, mat, items, shadow = true) {
    const inst = new InstancedMesh(geo, mat, items.length);
    const m4 = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), sc = new Vector3();
    items.forEach((it, i) => {
      e.set(it.rx || 0, it.ry || 0, it.rz || 0);
      q.setFromEuler(e);
      p.set(it.x, it.y, it.z);
      const s = it.s || 1;
      sc.set(s * (it.sx || 1), s * (it.sy || 1), s * (it.sz || 1));
      m4.compose(p, q, sc);
      inst.setMatrixAt(i, m4);
    });
    inst.instanceMatrix.needsUpdate = true;
    inst.castShadow = !!shadow;
    inst.receiveShadow = true;
    parent.add(inst);
    return inst;
  }

  // [a, b] minus the intervals `cuts` -> the remaining runs (longer than 0.05)
  function pal_subtract(a, b, cuts) {
    let runs = [[a, b]];
    for (const [lo, hi] of cuts || []) {
      const next = [];
      for (const [ra, rb] of runs) {
        if (hi <= ra || lo >= rb) {
          next.push([ra, rb]);
          continue;
        }
        if (lo > ra) next.push([ra, lo]);
        if (hi < rb) next.push([hi, rb]);
      }
      runs = next;
    }
    return runs.filter(([ra, rb]) => rb - ra > 0.05);
  }

  // n positions spread evenly over the free runs `segs` (each run gets a share proportional to its length; inside a run the items are
  // centred in equal slots) - used to hang exactly 300 מגנים and stand exactly 200 צינות (I Kings 10:16-17) between the openings
  function pal_spread(segs, n) {
    const total = segs.reduce((s, [a, b]) => s + (b - a), 0);
    if (n <= 0 || total <= 0) return [];
    const raw = segs.map(([a, b]) => (b - a) / total * n);
    const cnt = raw.map((v) => Math.floor(v));
    const left = n - cnt.reduce((s, v) => s + v, 0);
    const order = raw.map((v, i) => [v - Math.floor(v), i]).sort((p, q) => q[0] - p[0]);
    for (let j = 0; j < left; j++) cnt[order[j % order.length][1]]++;
    const out = [];
    segs.forEach(([a, b], i) => {
      for (let k = 0; k < cnt[i]; k++) out.push(a + (k + 0.5) * (b - a) / cnt[i]);
    });
    return out;
  }

  // The level of the terrain built by 20-mount.js under a footprint x0..x1, z0..z1: the highest terrain height on a 3 x 5 grid over
  // it, rounded so that floorY - result is a whole number of 0.5 steps (at least one). 1.0.1-K (load speed): the height is read from
  // the terrain's own vertex grid (a PlaneGeometry: two planar triangles per cell, the same surface a ray would hit) instead of 15
  // rays through its ~97,000 triangles; the rays remain the fallback for any other terrain. Falls back to ctx.shared.groundY
  // (MNT_GROUND_Y, -28) when the mount or the terrain is missing, so the palace never depends on the mount module being there.
  function pal_groundLevel(ctx, x0, x1, z0, z1, floorY) {
    const fallback = ctx.shared && ctx.shared.groundY != null ? ctx.shared.groundY : -28;
    try {
      const mount = ctx.root.getObjectByName("mount");
      if (!mount) return fallback;
      mount.updateMatrixWorld(true);
      let terrain = null;
      mount.traverse((o) => {
        if (!terrain && o.isMesh && o.geometry && o.geometry.type === "PlaneGeometry" && o.geometry.parameters) terrain = o;
      });
      let heightAt = null;
      if (terrain) {
        const prm = terrain.geometry.parameters, pos = terrain.geometry.attributes.position;
        const nx = prm.widthSegments, nz = prm.heightSegments, cell = prm.width / nx, W1 = nx + 1;
        if (pos && pos.count === (nx + 1) * (nz + 1) && Math.abs(prm.height / nz - cell) < 1e-6) {
          const inv = new Matrix4().copy(terrain.matrixWorld).invert();
          const gx0 = pos.getX(0), gz0 = pos.getZ(0), v = new Vector3();
          heightAt = (wx, wz) => {
            v.set(wx, 0, wz).applyMatrix4(inv);
            const fx = (v.x - gx0) / cell, fz = (v.z - gz0) / cell;
            const ix = Math.floor(fx), iz = Math.floor(fz);
            if (ix < 0 || iz < 0 || ix >= nx || iz >= nz) return null;
            const u = fx - ix, w = fz - iz;
            const hA = pos.getY(iz * W1 + ix), hB = pos.getY((iz + 1) * W1 + ix), hC = pos.getY((iz + 1) * W1 + ix + 1), hD = pos.getY(iz * W1 + ix + 1);
            const yl = u + w <= 1 ? hA + u * (hD - hA) + w * (hB - hA) : hC + (1 - u) * (hB - hC) + (1 - w) * (hD - hC);   // PlaneGeometry's faces (a,b,d) and (b,c,d)
            return v.set(v.x, yl, v.z).applyMatrix4(terrain.matrixWorld).y;
          };
        }
      }
      if (!heightAt) {
        const rc = new Raycaster(), down = new Vector3(0, -1, 0);
        heightAt = (wx, wz) => {
          rc.set(new Vector3(wx, 500, wz), down);
          const hits = rc.intersectObject(mount, true).filter((h) => h.point.y < floorY);
          return hits.length ? hits[0].point.y : null;
        };
      }
      let top = -Infinity;
      for (let i = 0; i <= 2; i++) for (let j = 0; j <= 4; j++) {
        const hy = heightAt(x0 + (x1 - x0) * i / 2, z0 + (z1 - z0) * j / 4);
        if (hy != null && hy < floorY) top = Math.max(top, hy);
      }
      if (!isFinite(top)) return fallback;
      return floorY - Math.max(1, Math.floor((floorY - top - 0.15) / 0.5)) * 0.5;
    } catch (e) {
      console.warn("[palace] terrain sampling failed, using ctx.shared.groundY", e);
      return fallback;
    }
  }

  // ---- geometry factories (1.0.1-K) ----
  // A log of the forest house's upper walls: a cylinder of radius 1 and height 1 (scaled per instance), its side UVs turned so the
  // cedar texture's grain runs ALONG the log (u = along: one tile per log however long, v = around)
  function pal_logGeo(segs = 12) {
    const geo = new CylinderGeometry(1, 1, 1, segs, 1, false);
    const uv = geo.attributes.uv, nrm = geo.attributes.normal;
    for (let i = 0; i < uv.count; i++) {
      if (Math.abs(nrm.getY(i)) > 0.5) continue;   // the end discs keep their planar UVs
      const u = uv.getX(i), v = uv.getY(i);
      uv.setXY(i, v * 8, u * 2 * Math.PI);
    }
    uv.needsUpdate = true;
    return geo;
  }
  // A standing lion (I Kings 10:19-20 "ושנים אריות עמדים... ושנים עשר אריים עמדים"; Ralbag 10:19: each faces the front of the throne),
  // facing +x, standing on y = 0, about 1.65 long and 1.2 high at scale 1 (the form: model choice)
  function pal_lionGeo() {
    const parts = [];
    const add = (geo, x, y, z, sx = 1, sy = 1, sz = 1, rz = 0) => {
      geo.scale(sx, sy, sz);
      if (rz) geo.rotateZ(rz);
      geo.translate(x, y, z);
      parts.push(geo);
    };
    add(new SphereGeometry(0.5, 9, 6), 0, 0.62, 0, 1.15, 0.58, 0.5);        // body
    add(new SphereGeometry(0.36, 9, 6), 0.4, 0.82, 0, 0.75, 1.0, 1.0);       // the chest under the mane
    const mane = new TorusGeometry(0.25, 0.11, 6, 14);                         // the mane: a ring round the face, read from the front
    mane.rotateY(Math.PI / 2);
    mane.translate(0.66, 1.0, 0);
    parts.push(mane);
    add(new SphereGeometry(0.2, 9, 6), 0.72, 1.0, 0);                        // head
    add(new BoxGeometry(0.2, 0.14, 0.18), 0.9, 0.93, 0);                     // muzzle
    for (const ez of [-0.13, 0.13]) add(new SphereGeometry(0.06, 5, 4), 0.68, 1.22, ez);   // ears
    for (const lx of [-0.36, 0.36]) for (const lz of [-0.15, 0.15]) add(new CylinderGeometry(0.08, 0.07, 0.44, 6), lx, 0.22, lz);
    add(new CylinderGeometry(0.03, 0.025, 0.62, 5), -0.72, 0.8, 0, 1, 1, 1, 0.75);   // tail
    return mergeGeometries(parts);
  }
  // A round shield (מגן; Malbim on 10:16-17 "והמגן מרוח א'", the book: "מגינים רגילים המגינים רק מלפנים"): 1.44 across, a shallow
  // dome with a boss (form and size: model choice), its back at x = 0 and its face toward +x
  function pal_shieldGeo() {
    const rim = new CylinderGeometry(0.56, 0.72, 0.12, 12, 1, true);   // open: no back (it hangs against the wall) - 52 triangles in all
    rim.translate(0, 0.06, 0);
    const face = new CircleGeometry(0.56, 12);
    face.rotateX(-Math.PI / 2);
    face.translate(0, 0.12, 0);
    const boss = new ConeGeometry(0.17, 0.16, 8, 1, true);
    boss.translate(0, 0.2, 0);
    const geo = mergeGeometries([rim, face, boss]);
    geo.rotateZ(-Math.PI / 2);
    return geo;
  }
  // A צינה (Rashi on 10:16 "מקפת את האדם משלשה רוחותיו"; Metzudat Zion "יקיף כל הגוף"; the book p12R: tall curved shields standing
  // along the walls): a half-cylinder shell 1.6 across and 3 high (taller than the shoulders; model choice), its open side at x = 0
  // and its face toward +x, with a boss; standing on y = 0
  function pal_tzinaGeo() {
    const shell = new CylinderGeometry(0.8, 0.8, 3, 12, 1, true, 0, Math.PI);
    shell.translate(0, 1.5, 0);
    const boss = new ConeGeometry(0.16, 0.18, 8);
    boss.rotateZ(-Math.PI / 2);
    boss.translate(0.89, 1.75, 0);
    return mergeGeometries([shell, boss]);
  }
  // Gold vessels (10:21 "וכל כלי בית יער הלבנון זהב סגור"; "וכל כלי משקה המלך שלמה זהב"): a jug, a goblet, a bowl and a plate (lathe
  // profiles in amot; their forms: model choice, as the book "צורת הכלים והמגינים להמחשה בלבד")
  function pal_vesselGeos() {
    const L = (pts) => new LatheGeometry(pts.map(([r, y]) => new Vector2(r, y)), 8);
    return {
      jug: L([[0, 0], [0.16, 0], [0.24, 0.12], [0.27, 0.36], [0.2, 0.6], [0.09, 0.74], [0.09, 0.88], [0.15, 0.96]]),
      goblet: L([[0, 0], [0.15, 0], [0.13, 0.04], [0.035, 0.1], [0.035, 0.3], [0.13, 0.38], [0.18, 0.56]]),
      bowl: L([[0, 0], [0.2, 0], [0.33, 0.1], [0.4, 0.22]]),
      plate: L([[0, 0], [0.3, 0], [0.46, 0.05], [0.5, 0.08]])
    };
  }
  // An oil lampstand (model choice: no source describes the palace lamps): a bronze stand 3.6 high and its flame
  function pal_lampGeos() {
    const base = new CylinderGeometry(0.12, 0.45, 0.3, 10);
    base.translate(0, 0.15, 0);
    const pole = new CylinderGeometry(0.05, 0.06, 3.1, 6);
    pole.translate(0, 1.85, 0);
    const bowl = new CylinderGeometry(0.3, 0.12, 0.2, 10);
    bowl.translate(0, 3.5, 0);
    const flame = new ConeGeometry(0.09, 0.32, 6);
    flame.translate(0, 3.76, 0);
    return { stand: mergeGeometries([base, pole, bowl]), flame };
  }
  // ---- 1.0.1-L (FIXES L.57): the golden figures of Solomon's throne - the lions of the verse (I Kings 10:19-20) and the creatures of the
  // midrash (Targum Sheni on Esther 1:2, to which Rashi refers on II Chr 9:19; Esther Rabbah 1:12; Midrash Abba Gorion; Panim Acherim).
  // Their forms are model choices: simple solids merged into one geometry per figure, every figure facing +x (its right side is +z) and
  // standing or lying on y = 0, about 1 amah long; all of them gold ("דדהבא" - Targum Sheni) ----
  // pal_fig(): a small builder of merged solids (indexed position / normal / uv - every solid used here is indexed, so they merge as
  // they are; load speed: the unit spheres are made once per resolution and cloned, PAL_SPHERES)
  var PAL_SPHERES = new Map();
  function pal_fig(lo = false) {   // 1.0.1-L (L.81): lo = low-resolution solids (the 280 small figures on the elders' chairs)
    const parts = [];
    const v = new Vector3(), up = new Vector3(0, 1, 0), q = new Quaternion();
    const put = (geo) => {
      for (const k of Object.keys(geo.attributes)) if (k !== "position" && k !== "normal" && k !== "uv") geo.deleteAttribute(k);
      parts.push(geo.index ? geo : geo.setIndex([...Array(geo.attributes.position.count).keys()]));
    };
    const sphere = (ws, hs) => {
      const key = ws * 100 + hs;
      if (!PAL_SPHERES.has(key)) PAL_SPHERES.set(key, new SphereGeometry(1, ws, hs));
      return PAL_SPHERES.get(key).clone();
    };
    const api = {
      // an ellipsoid of radii a, b, c at (x, y, z), turned rz about z, then rx about x, then ry about y
      ell(a, b, c, x, y, z, rz = 0, rx = 0, ry = 0, ws = lo ? 5 : 8, hs = lo ? 3 : 6) {
        const g = sphere(ws, hs);
        g.scale(a, b, c);
        if (rz) g.rotateZ(rz);
        if (rx) g.rotateX(rx);
        if (ry) g.rotateY(ry);
        g.translate(x, y, z);
        put(g);
        return api;
      },
      // a tapered rod from (ax, ay, az), radius r0, to (bx, by, bz), radius r1
      rod(r0, r1, ax, ay, az, bx, by, bz, n = lo ? 4 : 6) {
        v.set(bx - ax, by - ay, bz - az);
        const L = v.length();
        const g = new CylinderGeometry(r1, r0, L, n, 1);
        q.setFromUnitVectors(up, v.normalize());
        g.applyQuaternion(q);
        g.translate((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
        put(g);
        return api;
      },
      // a rod through several points (a curved tail, a horn)
      path(r0, r1, pts, n = lo ? 4 : 6) {
        for (let i = 0; i + 1 < pts.length; i++) {
          const ra = r0 + (r1 - r0) * i / (pts.length - 1), rb = r0 + (r1 - r0) * (i + 1) / (pts.length - 1);
          api.rod(ra, rb, ...pts[i], ...pts[i + 1], n);
          if (i > 0) api.ell(ra, ra, ra, ...pts[i], 0, 0, 0, 5, 3);   // a knuckle at each bend
        }
        return api;
      },
      cone(r, ax, ay, az, bx, by, bz, n = lo ? 4 : 6) { return api.rod(r, 0.002, ax, ay, az, bx, by, bz, n); },
      box(w, h, d, x, y, z, rz = 0) {
        const g = new BoxGeometry(w, h, d);
        if (rz) g.rotateZ(rz);
        g.translate(x, y, z);
        put(g);
        return api;
      },
      add(geo) { put(geo); return api; },
      geo() { return mergeGeometries(parts); }
    };
    return api;
  }
  // a standing lion (10:19-20 "ושנים אריות עמדים... ושנים עשר אריים עמדים"), 1.6 long and 1.15 high; paw = 0, or +1 / -1: that forepaw
  // (right / left) raised and stretched to the side - "והארי פושט לו יד" (Esther Rabbah 1:12), "והארי פושט את ידו של ימין" (Abba Gorion)
  // 1.0.1-L (L.78-L.81): omit = +1 / -1 - that forepaw is left out, a moving part (pal_lionPawGeo) supplies it; lo = low-resolution solids
  function pal_lionStandGeo(paw = 0, omit = 0, lo = false) {
    const f = pal_fig(lo);
    f.ell(0.46, 0.21, 0.19, -0.02, 0.62, 0)                       // body
      .ell(0.25, 0.26, 0.23, 0.3, 0.7, 0)                          // chest and shoulders
      .ell(0.21, 0.31, 0.29, 0.44, 0.87, 0, 0.25)                  // the mane
      .ell(0.15, 0.15, 0.14, 0.57, 0.93, 0)                        // head
      .ell(0.1, 0.08, 0.1, 0.71, 0.87, 0)                          // muzzle
      .ell(0.035, 0.03, 0.04, 0.8, 0.9, 0)                         // nose
      .ell(0.03, 0.025, 0.03, 0.66, 0.99, 0.07).ell(0.03, 0.025, 0.03, 0.66, 0.99, -0.07)   // brows
      .ell(0.045, 0.055, 0.03, 0.5, 1.08, 0.11).ell(0.045, 0.055, 0.03, 0.5, 1.08, -0.11);   // ears
    for (const s of [-1, 1]) {
      if (s === omit) { /* the moving part's leg */ }
      else if (paw !== s) f.rod(0.085, 0.065, 0.32, 0.56, s * 0.12, 0.36, 0.06, s * 0.12).ell(0.085, 0.05, 0.07, 0.4, 0.04, s * 0.12);
      else f.rod(0.085, 0.065, 0.32, 0.62, s * 0.13, 0.5, 0.74, s * 0.38).ell(0.085, 0.06, 0.08, 0.53, 0.75, s * 0.43);   // the stretched paw
      f.rod(0.1, 0.065, -0.32, 0.56, s * 0.11, -0.3, 0.06, s * 0.12).ell(0.085, 0.05, 0.07, -0.26, 0.04, s * 0.12);       // hind legs
    }
    f.path(0.035, 0.025, [[-0.46, 0.7, 0], [-0.66, 0.44, 0], [-0.76, 0.6, 0]]).ell(0.06, 0.08, 0.06, -0.77, 0.67, 0);       // tail and tuft
    return f.geo();
  }
  // a standing eagle (Targum Sheni "תרין עשר נשרין דדהבא"; Abba Gorion "עומדים על רגליהם"), 0.95 high, its wings raised from the
  // shoulders (so it reads as an eagle beside the lions; the pose: model choice); spread = 0, or +1 / -1: that wing (right / left)
  // stretched out level to the side - "ובשניה נשר פושט לו יד" (Esther Rabbah 1:12), "והנשר גפו של שמאל" (Abba Gorion)
  // 1.0.1-L (L.78-L.81): omit = +1 / -1 - that wing is left out, 2 - both; moving parts (pal_eagleWingGeo) supply them; lo = low-resolution solids
  function pal_eagleGeo(spread = 0, omit = 0, lo = false) {
    const f = pal_fig(lo);
    f.ell(0.15, 0.27, 0.15, 0, 0.5, 0, -0.15)                     // body, upright, the breast a little forward
      .ell(0.085, 0.09, 0.08, 0.07, 0.84, 0)                       // head
      .cone(0.042, 0.13, 0.85, 0, 0.25, 0.8, 0)                    // beak
      .ell(0.024, 0.035, 0.022, 0.25, 0.775, 0)                    // its hooked tip
      .ell(0.075, 0.05, 0.07, 0.03, 0.72, 0)                       // the neck ruff
      .ell(0.18, 0.04, 0.12, -0.19, 0.24, 0, 0.5);                 // tail, slanting down
    for (const s of [-1, 1]) {
      f.rod(0.035, 0.028, 0.02, 0.3, s * 0.06, 0.04, 0.04, s * 0.07).ell(0.07, 0.025, 0.05, 0.08, 0.025, s * 0.07);   // legs and talons
      if (omit === 2 || s === omit) continue;   // the moving part's wing (2: both wings)
      // a wing: a flat covert from the shoulder and the primaries beyond it, thin front to back, turned out about x by a1 / a2
      // (raised: the coverts 0.55 and the primaries 0.95 from upright; stretched: 1.3 and 1.5 - nearly level)
      const a1 = s * (spread === s ? 1.3 : 0.55), a2 = s * (spread === s ? 1.5 : 0.95);
      const b1 = 0.22, b2 = 0.2, sy = 0.62, sz = s * 0.12;
      const c1y = sy + b1 * Math.cos(a1), c1z = sz + b1 * Math.sin(a1) * 1;
      const t1y = sy + 2 * b1 * Math.cos(a1), t1z = sz + 2 * b1 * Math.sin(a1);
      // a raised wing is also swept back 0.45 about the vertical, so it shows its breadth from the front and from the side alike
      const sw = spread === s ? 0 : -s * 0.45, th = spread === s ? 0.035 : 0.06;
      f.ell(th, b1, 0.13, -0.04, c1y, c1z, 0, a1, sw).ell(th * 0.8, b2, 0.09, -0.05 - (spread === s ? 0 : 0.12), t1y + b2 * Math.cos(a2) - 0.05, t1z + b2 * Math.sin(a2), 0, a2, sw);
    }
    return f.geo();
  }
  // the creatures lying ("רביע") on the six steps - Targum Sheni on Esther 1:2: "על דרגא קדמיתא רביע תורא דדהבא ולקבליה אריא די דהבא. ועל
  // דרגא תניינא רביע דיבא דדהבא ולקבליה רביע תלה דדהבא. ועל דרגא תליתאה רביע נמרא די דהבא ולקבליה רביע אינקה דדהבא. ועל דרגא רביעאה רביע
  // נשרא דדהבא ולקבליה טווסא דדהבא. ועל דרגא חמישיתא רביע שונרא דדהבא ולקבליה תרנגולא דדהבא. ועל דרגא שתיתאה רביע בר נצא דדהבא ולקבליה
  // ציפר דדהבא" (the pairs of Isaiah 11:6-7). kind: ox, lion, wolf, lamb, leopard, kid, eagle, peacock, cat, rooster, hawk, bird, dove
  function pal_beastGeo(kind) {
    const f = pal_fig();
    // a lying four-footed body: length L, height H, width W; the forelegs stretched forward on the ground, the haunches at the sides
    const lying = (L, H, W) => {
      f.ell(L / 2, H / 2, W / 2, 0, H / 2 + 0.02, 0);
      for (const s of [-1, 1]) {
        f.rod(0.05 * H / 0.4, 0.04 * H / 0.4, L * 0.28, 0.06, s * W * 0.3, L * 0.5 + 0.1, 0.045, s * W * 0.3);
        f.ell(0.06 * H / 0.4, 0.035, 0.05 * H / 0.4, L * 0.5 + 0.13, 0.035, s * W * 0.3);
        f.ell(L * 0.17, H * 0.32, W * 0.2, -L * 0.28, H * 0.38, s * W * 0.38);
      }
    };
    const bird = (bl, bh, bw, by, hx, hy, hr) => {   // a sitting bird: body, head, beak, folded wings, legs hidden under it
      f.ell(bl, bh, bw, 0, by, 0, -0.12).ell(hr, hr * 1.05, hr * 0.92, hx, hy, 0).cone(hr * 0.45, hx + hr * 0.7, hy - hr * 0.1, 0, hx + hr * 1.7, hy - hr * 0.25, 0);
      for (const s of [-1, 1]) f.ell(bl * 0.85, bh * 0.75, 0.035, -bl * 0.15, by + bh * 0.1, s * bw * 0.85, -0.25);
    };
    if (kind === "ox") {
      lying(1.0, 0.5, 0.46);
      f.rod(0.13, 0.11, 0.42, 0.42, 0, 0.56, 0.5, 0)               // neck
        .ell(0.16, 0.14, 0.14, 0.62, 0.52, 0).ell(0.1, 0.09, 0.12, 0.75, 0.45, 0)   // head, muzzle
        .ell(0.06, 0.025, 0.04, 0.57, 0.6, 0.16).ell(0.06, 0.025, 0.04, 0.57, 0.6, -0.16)   // ears
        .path(0.035, 0.012, [[0.62, 0.62, 0.08], [0.63, 0.68, 0.2], [0.68, 0.78, 0.26]]).path(0.035, 0.012, [[0.62, 0.62, -0.08], [0.63, 0.68, -0.2], [0.68, 0.78, -0.26]])   // horns
        .path(0.025, 0.02, [[-0.48, 0.4, 0], [-0.58, 0.2, 0.05], [-0.56, 0.05, 0.12]]);   // tail
    } else if (kind === "lion") {
      lying(0.95, 0.42, 0.38);
      f.ell(0.18, 0.26, 0.23, 0.43, 0.5, 0, 0.2).ell(0.13, 0.13, 0.12, 0.54, 0.56, 0).ell(0.08, 0.065, 0.085, 0.66, 0.51, 0)
        .ell(0.03, 0.04, 0.025, 0.47, 0.7, 0.09).ell(0.03, 0.04, 0.025, 0.47, 0.7, -0.09)
        .path(0.03, 0.022, [[-0.46, 0.22, 0], [-0.7, 0.05, 0.08], [-0.86, 0.05, 0.18]]).ell(0.06, 0.05, 0.06, -0.9, 0.06, 0.2);
    } else if (kind === "wolf") {
      lying(0.95, 0.34, 0.3);
      f.rod(0.09, 0.08, 0.4, 0.3, 0, 0.52, 0.4, 0).ell(0.12, 0.1, 0.1, 0.56, 0.44, 0).cone(0.065, 0.64, 0.42, 0, 0.86, 0.38, 0)
        .cone(0.04, 0.53, 0.51, 0.06, 0.51, 0.67, 0.08).cone(0.04, 0.53, 0.51, -0.06, 0.51, 0.67, -0.08)   // pointed ears
        .ell(0.25, 0.075, 0.075, -0.62, 0.13, 0.04, 0.25);                                                     // bushy tail
    } else if (kind === "lamb") {
      lying(0.72, 0.42, 0.42);
      for (const [x, y, z] of [[0.15, 0.4, 0.1], [-0.05, 0.42, -0.1], [-0.2, 0.38, 0.12], [0.05, 0.36, 0.2], [-0.12, 0.34, -0.2], [0.2, 0.33, -0.17]]) f.ell(0.11, 0.09, 0.11, x, y, z, 0, 0, 0, 7, 5);   // the wool
      f.ell(0.1, 0.11, 0.085, 0.44, 0.44, 0).ell(0.055, 0.05, 0.05, 0.52, 0.4, 0)
        .ell(0.07, 0.02, 0.035, 0.42, 0.47, 0.12, 0, 0, 0.4).ell(0.07, 0.02, 0.035, 0.42, 0.47, -0.12, 0, 0, -0.4);   // drooping ears
    } else if (kind === "leopard") {
      lying(1.05, 0.3, 0.28);
      f.rod(0.08, 0.075, 0.44, 0.24, 0, 0.56, 0.32, 0).ell(0.11, 0.1, 0.1, 0.62, 0.36, 0).ell(0.06, 0.05, 0.06, 0.71, 0.33, 0)
        .ell(0.032, 0.035, 0.025, 0.58, 0.45, 0.06).ell(0.032, 0.035, 0.025, 0.58, 0.45, -0.06)
        .path(0.03, 0.02, [[-0.5, 0.2, 0], [-0.78, 0.07, 0.1], [-0.95, 0.12, 0.24], [-0.98, 0.26, 0.3]]);   // the long tail
      for (const [x, z] of [[0.25, 0.1], [0.05, -0.12], [-0.15, 0.1], [-0.3, -0.06], [0.15, -0.05]]) f.ell(0.035, 0.012, 0.035, x, 0.315, z);   // spots, raised
    } else if (kind === "kid") {
      lying(0.66, 0.34, 0.3);
      f.rod(0.07, 0.06, 0.28, 0.32, 0, 0.38, 0.42, 0).ell(0.095, 0.1, 0.08, 0.42, 0.46, 0).ell(0.06, 0.05, 0.055, 0.5, 0.41, 0)
        .path(0.022, 0.006, [[0.4, 0.54, 0.035], [0.36, 0.62, 0.045], [0.31, 0.66, 0.05]]).path(0.022, 0.006, [[0.4, 0.54, -0.035], [0.36, 0.62, -0.045], [0.31, 0.66, -0.05]])   // short horns
        .cone(0.03, 0.49, 0.37, 0, 0.5, 0.28, 0)                                                                    // beard
        .ell(0.06, 0.02, 0.03, 0.39, 0.49, 0.1, 0, 0, 0.3).ell(0.06, 0.02, 0.03, 0.39, 0.49, -0.1, 0, 0, -0.3)
        .rod(0.02, 0.01, -0.32, 0.3, 0, -0.36, 0.4, 0);                                                             // short tail
    } else if (kind === "cat") {
      lying(0.6, 0.28, 0.24);
      f.ell(0.1, 0.095, 0.095, 0.37, 0.36, 0).ell(0.045, 0.035, 0.05, 0.45, 0.33, 0)
        .cone(0.035, 0.37, 0.43, 0.055, 0.37, 0.53, 0.07).cone(0.035, 0.37, 0.43, -0.055, 0.37, 0.53, -0.07)   // pointed ears
        .path(0.025, 0.018, [[-0.3, 0.12, 0], [-0.38, 0.05, 0.14], [-0.15, 0.03, 0.2], [0.1, 0.04, 0.18]]);   // the tail round the body
    } else if (kind === "eagle" || kind === "hawk") {
      const k = kind === "hawk" ? 0.75 : 1;
      bird(0.2 * k, 0.15 * k, 0.14 * k, 0.17 * k, 0.17 * k, 0.33 * k, 0.075 * k);
      f.ell(0.025 * k, 0.035 * k, 0.022 * k, 0.33 * k, 0.28 * k, 0)                                                // the hooked beak's tip
        .ell(0.17 * k, 0.03 * k, 0.1 * k, -0.24 * k, 0.12 * k, 0, 0.3);                                            // tail
    } else if (kind === "peacock") {
      bird(0.16, 0.13, 0.12, 0.16, 0.2, 0.62, 0.05);
      f.rod(0.04, 0.03, 0.1, 0.24, 0, 0.19, 0.58, 0);                                                                // the long neck
      for (const z of [-0.025, 0, 0.025]) f.rod(0.006, 0.006, 0.19, 0.66, z, 0.17, 0.74, z * 2).ell(0.012, 0.012, 0.012, 0.17, 0.745, z * 2);   // crest
      const fan = new CylinderGeometry(0.5, 0.5, 0.025, 16, 1, false, 0, Math.PI);                                // the tail spread as a fan
      fan.rotateZ(Math.PI / 2);
      fan.translate(-0.16, 0.18, 0);
      f.add(fan);
      for (let i = 0; i < 7; i++) { const a = Math.PI * (i + 0.5) / 7; f.ell(0.015, 0.045, 0.045, -0.145, 0.18 + 0.38 * Math.sin(a), 0.38 * Math.cos(a)); }   // its "eyes"
    } else if (kind === "rooster") {
      bird(0.15, 0.13, 0.11, 0.17, 0.12, 0.4, 0.065);
      f.ell(0.055, 0.035, 0.012, 0.12, 0.48, 0).ell(0.022, 0.03, 0.012, 0.17, 0.33, 0)                             // comb, wattle
        .rod(0.035, 0.04, 0.07, 0.25, 0, 0.11, 0.36, 0);                                                           // neck
      for (const [z, h] of [[0.03, 0.42], [0, 0.48], [-0.03, 0.38]]) f.path(0.03, 0.01, [[-0.1, 0.25, z], [-0.2, h, z * 1.5], [-0.3, h - 0.08, z * 2], [-0.33, h - 0.2, z * 2]]);   // the arched tail
    } else if (kind === "bird") {
      bird(0.11, 0.085, 0.08, 0.1, 0.1, 0.19, 0.05);
      f.ell(0.1, 0.018, 0.05, -0.13, 0.12, 0, 0.3);
    } else if (kind === "bear") {   // 1.0.1-L (L.81): "ברביעית דוב כנגד צבי" (Beit HaMidrash; Abba Gorion "רביעית צבי [וכנגדו] דוב")
      lying(0.95, 0.5, 0.5);
      f.ell(0.19, 0.17, 0.17, 0.5, 0.48, 0).ell(0.1, 0.08, 0.09, 0.66, 0.42, 0)             // head, snout
        .ell(0.05, 0.05, 0.03, 0.46, 0.63, 0.11).ell(0.05, 0.05, 0.03, 0.46, 0.63, -0.11);   // round ears
    } else if (kind === "deer") {   // the צבי: a slender lying body, a long neck and small antlers
      lying(0.8, 0.34, 0.26);
      f.rod(0.07, 0.06, 0.34, 0.3, 0, 0.5, 0.62, 0).ell(0.1, 0.09, 0.075, 0.56, 0.68, 0).ell(0.05, 0.04, 0.045, 0.66, 0.65, 0)   // neck, head, muzzle
        .ell(0.05, 0.02, 0.03, 0.52, 0.74, 0.08, 0, 0, 0.5).ell(0.05, 0.02, 0.03, 0.52, 0.74, -0.08, 0, 0, -0.5);                 // ears
      for (const s of [-1, 1]) f.path(0.02, 0.008, [[0.54, 0.76, s * 0.04], [0.5, 0.92, s * 0.1], [0.44, 1.02, s * 0.16]]).path(0.015, 0.006, [[0.5, 0.92, s * 0.1], [0.56, 1.0, s * 0.14]]);   // antlers
    } else if (kind === "dove") {
      bird(0.14, 0.11, 0.1, 0.12, 0.13, 0.26, 0.06);
      f.ell(0.13, 0.022, 0.08, -0.17, 0.12, 0, 0.25);
    }
    return f.geo();
  }
  // a golden chair, the sitter facing +x (the elders' seats and the two seats beside the throne - Targum Sheni "שבעין כורסוון דדהבא",
  // "ותרתין מותבנין דדהבא"): seat 0.9 x 0.9 at 0.85, a back 1.25 above it with a rounded top, four legs (form: model choice)
  function pal_chairGeo() {
    const f = pal_fig();
    f.box(0.9, 0.1, 0.9, 0, 0.8, 0).box(0.1, 1.15, 0.9, -0.4, 1.425, 0).ell(0.05, 0.12, 0.45, -0.4, 2.0, 0, 0, 0, 0, 8, 4);
    for (const [x, z] of [[0.38, 0.38], [0.38, -0.38], [-0.38, 0.38], [-0.38, -0.38]]) f.box(0.09, 0.75, 0.09, x, 0.375, z);
    for (const z of [-0.42, 0.42]) f.box(0.8, 0.07, 0.07, 0, 1.15, z).box(0.07, 0.3, 0.07, 0.36, 1.0, z);   // arm rests
    return f.geo();
  }

  // ---- 1.0.1-L (FIXES L.78-L.81): the parts of the throne's midrashic versions and of the king's ascent (forms: model choices) ----
  // a lion's stretched forepaw on side s (+1 right / -1 left) as a part of its own, its pivot (the shoulder) at the origin - the moving part
  // of a lion whose body was built with that leg left out; as long as the leg it replaces (0.55), so at rest it stands on the ground
  function pal_lionPawGeo(s) {
    const f = pal_fig();
    f.rod(0.085, 0.065, 0, 0, 0, 0.30, 0.20, s * 0.42).ell(0.085, 0.06, 0.08, 0.33, 0.21, s * 0.46);
    return f.geo();
  }
  // a lion's foreleg holding an inscribed tablet at its end (Beit HaMidrash "וכתב מורשם בידיהם"), built along +x from the shoulder, the tablet's
  // face toward +x (the text is a plane in front of it, see lionAt in buildPalace)
  function pal_lionTabletGeo() {
    const f = pal_fig();
    f.rod(0.085, 0.065, 0, 0, 0, 0.5, 0, 0).ell(0.085, 0.07, 0.08, 0.52, 0, 0).box(0.04, 0.66, 0.54, 0.55, 0.12, 0);
    return f.geo();
  }
  // 1.0.1-L (Targum Sheni "פשיט ידיה"): the ox's foreleg as a part of its own, along +x from its joint; at rest it lies over the leg of the lying body
  function pal_oxLegGeo() {
    const f = pal_fig();
    f.rod(0.0625, 0.05, 0, 0, 0, 0.33, 0, 0).ell(0.075, 0.04, 0.0625, 0.35, 0, 0);
    return f.geo();
  }
  // 1.0.1-L (the user: "הוספת רעש, בעדי שקר?"): the witnesses' noise, generated (no files; the plugin is offline): a low rumble of wheels (brown noise through a low-pass, swelling) and lions' roars (falling sawtooth
  // through a low-pass), moderate volume (peak gain 0.22). The context is made on the first play, which comes from a click; anything missing or refused leaves it silent. muted: the pill "השתק את הרעש"
  const pal_witSound = {
    muted: false, ac: null, nodes: null,
    start() {
      if (this.muted || this.nodes) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ac = this.ac || (this.ac = new AC());
        if (ac.state === "suspended" && ac.resume) ac.resume();
        const t = ac.currentTime, master = ac.createGain();
        master.gain.setValueAtTime(0, t);
        master.gain.linearRampToValueAtTime(0.95, t + 0.2);   // 1.0.1-L (the user: "פקודת הרעש לא מרעישה באמת"): was 0.22 and below 170 Hz
        const comp = ac.createDynamicsCompressor();
        master.connect(comp);
        comp.connect(ac.destination);
        const n = Math.floor(ac.sampleRate * 2), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
        for (let i = 0, last = 0; i < n; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
        const noise = ac.createBufferSource();
        noise.buffer = buf;
        noise.loop = true;
        const lp = ac.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 1400;
        const swell = ac.createGain();
        swell.gain.value = 1.3;
        const lfo = ac.createOscillator(), lfoG = ac.createGain();
        lfo.frequency.value = 2.7;
        lfoG.gain.value = 0.45;
        lfo.connect(lfoG);
        lfoG.connect(swell.gain);
        noise.connect(lp);
        lp.connect(swell);
        swell.connect(master);
        noise.start(t);
        lfo.start(t);
        const srcs = [noise, lfo];
        for (const [at, f0] of [[0.2, 330], [1.5, 260], [2.8, 380], [4.1, 290], [5.3, 350]]) {
          const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
          o.type = "sawtooth";
          o.frequency.setValueAtTime(f0, t + at);
          o.frequency.exponentialRampToValueAtTime(f0 * 0.42, t + at + 1.25);
          f.type = "lowpass";
          f.frequency.value = 2600;
          g.gain.setValueAtTime(0, t + at);
          g.gain.linearRampToValueAtTime(1.0, t + at + 0.12);
          g.gain.exponentialRampToValueAtTime(0.001, t + at + 1.3);
          o.connect(f);
          f.connect(g);
          g.connect(master);
          o.start(t + at);
          o.stop(t + at + 1.35);
          srcs.push(o);
        }
        // 1.0.1-L (the user: "עשה קולות של ציפורים וחיות מרעישות"): eagles' screeches, small birds' chirps, peacocks' calls and an ox's lowing, made here (no files)
        const voice = (type, at, dur, f0, f1, peak, q) => {
          const o = ac.createOscillator(), g = ac.createGain(), bp = ac.createBiquadFilter();
          o.type = type;
          o.frequency.setValueAtTime(f0, t + at);
          o.frequency.exponentialRampToValueAtTime(f1, t + at + dur);
          bp.type = "bandpass";
          bp.frequency.value = (f0 + f1) / 2;
          bp.Q.value = q;
          g.gain.setValueAtTime(0, t + at);
          g.gain.linearRampToValueAtTime(peak, t + at + Math.min(0.04, dur / 4));
          g.gain.exponentialRampToValueAtTime(0.001, t + at + dur);
          o.connect(bp);
          bp.connect(g);
          g.connect(master);
          o.start(t + at);
          o.stop(t + at + dur + 0.02);
          srcs.push(o);
        };
        for (const at of [0.4, 1.9, 3.3, 4.7, 6.0]) { voice("sawtooth", at, 0.55, 2600, 1500, 0.55, 2); voice("square", at + 0.02, 0.5, 3300, 1900, 0.2, 3); }
        for (let i = 0; i < 26; i++) voice("sine", 0.1 + i * 0.26 + Math.random() * 0.1, 0.09, 3200 + Math.random() * 1800, 4600 + Math.random() * 1400, 0.4, 4);
        for (const at of [1.1, 3.9, 5.6]) { voice("sawtooth", at, 0.28, 800, 1450, 0.65, 3); voice("sawtooth", at + 0.3, 0.4, 1450, 950, 0.65, 3); }
        for (const at of [0.8, 3.0, 5.0]) voice("sawtooth", at, 1.1, 150, 105, 0.9, 1.2);
        this.nodes = { master, srcs };
      } catch (e) { this.nodes = null; }
    },
    stop() {
      const nd = this.nodes;
      this.nodes = null;
      if (!nd) return;
      try {
        const t = this.ac.currentTime;
        nd.master.gain.cancelScheduledValues(t);
        nd.master.gain.setValueAtTime(nd.master.gain.value, t);
        nd.master.gain.linearRampToValueAtTime(0, t + 0.15);
        for (const o of nd.srcs) { try { o.stop(t + 0.2); } catch (e) {} }
      } catch (e) {}
    }
  };
  // a grain of spice: a soft round spot (32 x 32)
  function pal_spiceTex() {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 32;
    const c = cv.getContext("2d"), gr = c.createRadialGradient(16, 16, 1, 16, 16, 15);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.55, "rgba(255,255,255,0.9)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = gr;
    c.fillRect(0, 0, 32, 32);
    return new CanvasTexture(cv);
  }
  // the writing on a lion's tablet: a verse on a golden ground (128 x 160), the words wrapped
  function pal_tabletTex(text) {
    const cv = document.createElement("canvas");
    cv.width = 640;   // 1.0.1-L: for the large plate
    cv.height = 420;
    const c = cv.getContext("2d");
    c.fillStyle = "#f8ecc0";
    c.fillRect(0, 0, 640, 420);
    c.strokeStyle = "#7a5a1e";
    c.lineWidth = 14;
    c.strokeRect(10, 10, 620, 400);
    c.fillStyle = "#1c1004";
    c.font = '800 112px "Segoe UI",Arial';
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.direction = "rtl";
    const lines = [];
    let cur = "";
    for (const w of text.split(" ")) {
      const t = cur ? cur + " " + w : w;
      if (cur && c.measureText(t).width > 580) { lines.push(cur); cur = w; } else cur = t;
    }
    if (cur) lines.push(cur);
    lines.forEach((l, i) => c.fillText(l, 320, 210 + (i - (lines.length - 1) / 2) * 130));
    const t = new CanvasTexture(cv);
    t.colorSpace = SRGBColorSpace;
    return t;
  }
  // an eagle's wing on side s, spread nearly level, its pivot (the shoulder) at the origin - the moving part of an eagle built without that wing.
  // 1.0.1-L (L.81): a plate of beaten gold with a curved leading edge and a trailing edge of six feather tips, the coverts and the feathers' ridges raised on its
  // front face, its trailing edge swept back, so it shows its breadth from the front and from the side alike (two ellipsoids read as a rabbit's ears; form: model choice)
  function pal_eagleWingGeo(s) {
    const w = pal_fig();
    const sh = new Shape();
    sh.moveTo(0, -0.03);
    sh.quadraticCurveTo(0.42, -0.1, 0.86, 0);
    const EDGE = [[0.8, 0.1], [0.7, 0.085], [0.72, 0.2], [0.58, 0.16], [0.6, 0.29], [0.46, 0.22], [0.46, 0.34], [0.33, 0.25], [0.31, 0.35], [0.2, 0.25], [0.16, 0.31], [0.04, 0.18]];
    for (const [u, v] of EDGE) sh.lineTo(u, v);
    sh.closePath();
    const plate = new ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: false, curveSegments: 4 });
    plate.translate(0, 0, -0.015);
    w.add(plate);
    const fr = s * 0.016;   // the front face (toward the figure's +x) is +n on the right wing, -n on the left
    w.ell(0.27, 0.085, 0.05, 0.27, 0.035, fr, -0.08);   // the coverts, thick enough that a wing seen edge-on reads as a wing and not a spike
    w.rod(0.04, 0.014, 0.02, -0.025, 0, 0.84, -0.005, 0, 5);   // the arm along the leading edge
    for (let i = 0; i < EDGE.length; i += 2) w.rod(0.013, 0.006, 0.12 + i * 0.045, 0.06, fr, EDGE[i][0] - 0.01, EDGE[i][1] - 0.02, fr, 3);
    const g = w.geo();
    const A = 1.3, SW = 0.28;   // the wing's axis (1.3 from upright, as the limb's stretched direction in eagleAt); the sweep of its trailing edge (at 0.6 the far wing of a figure turned 40 degrees, Targum Sheni's, showed edge-on, a spike)
    const a = new Vector3(0, Math.cos(A), s * Math.sin(A));
    const b = new Vector3(0, -Math.sin(A), s * Math.cos(A)).multiplyScalar(Math.cos(SW)).add(new Vector3(-Math.sin(SW), 0, 0));
    g.applyMatrix4(new Matrix4().makeBasis(a, b, new Vector3().crossVectors(a, b)));
    return g;
  }
  // a cog-wheel of the mechanism ("חוזר הגלגל בתוך המגנון" - Abba Gorion): a disc of radius r with n teeth, its axis along z (facing the hall)
  function pal_gearGeo(r = 0.4, n = 10, t = 0.12) {
    const f = pal_fig();
    const disc = new CylinderGeometry(r, r, t, 24);
    disc.rotateX(Math.PI / 2);
    f.add(disc);
    for (let i = 0; i < n; i++) {
      const g = new BoxGeometry(0.15, 0.16, t);
      g.translate(0, r + 0.06, 0);
      g.rotateZ(i * 2 * Math.PI / n);
      f.add(g);
    }
    f.ell(0.08, 0.08, 0.1, 0, 0, 0, 0, 0, 0, 8, 5);
    return f.geo();
  }
  // the Torah scroll ("ונוטלת ספר תורה"): two golden rollers along x and the parchment between them, centred at the origin; two geometries
  function pal_scrollGeos() {
    const f = pal_fig();
    for (const z of [-0.14, 0.14]) {
      const c = new CylinderGeometry(0.05, 0.05, 0.5, 8);
      c.rotateZ(Math.PI / 2);
      c.translate(0, 0, z);
      f.add(c);
      f.ell(0.07, 0.07, 0.07, 0.25, 0, z, 0, 0, 0, 6, 4).ell(0.07, 0.07, 0.07, -0.25, 0, z, 0, 0, 0, 6, 4);
    }
    return { rollers: f.geo(), parchment: new BoxGeometry(0.42, 0.11, 0.3) };
  }
  // the crown ("ועטרה של זהב"): a lathed band, open, with eight points on its rim, its bottom at y 0
  function pal_crownGeo() {
    const f = pal_fig();
    f.add(new LatheGeometry([[0.17, 0], [0.205, 0], [0.205, 0.16], [0.185, 0.16], [0.17, 0.02], [0.17, 0]].map(([r, y]) => new Vector2(r, y)), 24));
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      f.cone(0.035, 0.19 * Math.cos(a), 0.155, 0.19 * Math.sin(a), 0.19 * Math.cos(a), 0.25, 0.19 * Math.sin(a), 5);
    }
    return f.geo();
  }
  // the menorah on the throne's head (Targum Sheni "ועל מרישי כורסיא קיימא מנרתא דדהבא... שבעת אבהת עלמא... שבעא חסידי עלמא"): a stem
  // 2.3 high with seven branches a side, the bowl of oil on top (בזיכא), the great basin at its foot (אגנתא) and the two sheaves out of it
  function pal_menorahGeo() {
    const f = pal_fig();
    f.rod(0.06, 0.05, 0, 0, 0, 0, 2.3, 0, 8);
    f.ell(0.5, 0.12, 0.5, 0, 0.06, 0, 0, 0, 0, 16, 6);
    for (const s of [-1, 1]) {
      for (let i = 0; i < 7; i++) {
        const h = 0.55 + (6 - i) * 0.22, out = s * (0.22 + i * 0.1);   // the outermost (i = 6) leaves the stem lowest, as a menorah's arms
        f.rod(0.035, 0.03, 0, h, 0, out, h + 0.12, 0, 6).rod(0.03, 0.03, out, h + 0.12, 0, out, 2.3, 0, 6).ell(0.07, 0.05, 0.07, out, 2.34, 0, 0, 0, 0, 7, 4);
      }
      f.rod(0.02, 0.035, s * 0.35, 0.1, 0.1, s * 0.55, 0.75, 0.18, 5).ell(0.06, 0.12, 0.05, s * 0.58, 0.85, 0.2);
    }
    f.ell(0.12, 0.07, 0.12, 0, 2.36, 0, 0, 0, 0, 10, 6);
    return f.geo();
  }
  // 1.0.1-L (L.81): one vine leaf about 0.5 long, hanging from its stalk at the origin along -y, its faces toward +-z, lobed and folded along the midrib; both
  // windings (the solids' gold is one-sided), flat normals and empty uvs, so it merges with the solids (low-resolution ellipsoids read as rows of bright hexagons)
  function pal_vineLeafGeo() {
    const HALF = [[0, 0], [0.1, 0.02], [0.2, -0.06], [0.13, -0.12], [0.25, -0.2], [0.12, -0.26], [0.16, -0.37], [0.05, -0.38], [0, -0.5]];
    const C = [0, -0.22, 0], pos = [];
    const at = (q, sd) => [sd * q[0], q[1], q[0] * 0.35];
    for (const sd of [-1, 1]) for (let i = 0; i + 1 < HALF.length; i++) {
      const u = at(HALF[i], sd), w = at(HALF[i + 1], sd);
      pos.push(...C, ...w, ...u, ...C, ...u, ...w);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute("uv", new BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
    g.computeVertexNormals();
    return g;
  }
  // a leaf of geometry `leaf` on fig f: scale sz, turned rz about z, then rx about x, then ry about y, its stalk at (x, y, z)
  function pal_leafAt(f, leaf, x, y, z, rz, rx, ry, sz) {
    const g = leaf.clone();
    g.scale(sz, sz, sz);
    g.rotateZ(rz);
    g.rotateX(rx);
    g.rotateY(ry);
    g.translate(x, y, z);
    f.add(g);
  }
  // the vines over the seat ("עשרין וארבע גפנין דדהבא דעבדין טיללא למלכא שלמה"): n stems, half on each side of the seat along z0..z1, rising from y 0 at
  // x +-rx and arching over to meet at about height h, a vault open at the front. 1.0.1-L: every stem wanders by its own phase, so they cross each other as vines do,
  // and carries lobed leaves on its upper part, which make the shade, and a cluster of grapes (the form: model choice; parallel stems read as a fence)
  function pal_vineVaultGeo(n, rx, z0, z1, h) {
    const f = pal_fig(), leaf = pal_vineLeafGeo();
    const half = Math.ceil(n / 2);
    const BERRY = [[0, 0, 0], [0.08, -0.03, 0.05], [-0.08, -0.03, -0.05], [-0.03, -0.1, 0.07], [0.05, -0.11, -0.05], [0, -0.18, 0.02], [0.02, -0.25, 0]];
    for (let i = 0; i < n; i++) {
      const s = i % 2 ? 1 : -1, k = Math.floor(i / 2), z = z0 + (z1 - z0) * k / (half - 1);
      const ph = hash(i * 2.9) * 6.28, ph2 = hash(i * 4.1) * 6.28, hi = h * (0.95 + 0.07 * hash(i * 1.3));
      const arch = new CatmullRomCurve3([[s * rx, 0, z], [s * (rx + 0.3), hi * 0.33, z], [s * (rx + 0.42), hi * 0.66, z], [s * rx * 0.62, hi * 0.98, z], [s * 0.1, hi, z]].map((q) => new Vector3(q[0], q[1], q[2])));
      const pts = [];
      for (let j = 0; j <= 9; j++) {
        const t = j / 9, q = arch.getPoint(t), e = Math.min(1, t * 4);   // the root stays where it stands; the wave grows from it
        pts.push(new Vector3(q.x + s * 0.1 * e * Math.sin(t * 10 + ph), q.y, q.z + 0.16 * e * Math.sin(t * 8 + ph2)));
      }
      const curve = new CatmullRomCurve3(pts);
      f.add(new TubeGeometry(curve, 30, 0.04, 5, false));
      for (let j = 0; j < 9; j++) {
        const q = curve.getPoint(0.3 + j * 0.08 + hash(i * 7.3 + j) * 0.03), sd = j % 2 ? 1 : -1;
        pal_leafAt(f, leaf, q.x, q.y - 0.02, q.z + sd * 0.05, sd * (0.2 + 0.5 * hash(i + j * 3.1)), (hash(i * 3.3 + j) - 0.5) * 0.7, (hash(i * 5.1 + j) - 0.5) * 1.6, 0.75 + 0.35 * hash(i * 1.9 + j));
      }
      const g = curve.getPoint(0.5 + 0.35 * hash(i * 9.7));
      for (const [u, c, d] of BERRY) f.ell(0.055, 0.055, 0.055, g.x + u, g.y - 0.1 + c, g.z + d, 0, 0, 0, 5, 3);
    }
    return f.geo();
  }
  // one vine arching from p0 through p1 to p2 (relative points), with leaves along it and a cluster of grapes at its end ("ושני גפנים של זהב
  // עומדות משני צדי הכסא, ומצילות על ראשי העמודים" - Panim Acherim). 1.0.1-L: the stem wanders and the leaves are vine leaves (a bare smooth rod with three flat hexagons read as a stick)
  function pal_vineArcGeo(p0, p1, p2) {
    const f = pal_fig(), leaf = pal_vineLeafGeo();
    const P0 = new Vector3(...p0), P1 = new Vector3(...p1), P2 = new Vector3(...p2);
    const base = new QuadraticBezierCurve3(P0, P1, P2), pts = [];
    for (let j = 0; j <= 8; j++) {
      const t = j / 8, q = base.getPoint(t), e = Math.sin(Math.PI * t);
      pts.push(new Vector3(q.x + 0.24 * e * Math.sin(t * 15), q.y + 0.1 * e * Math.sin(t * 13 + 2), q.z + 0.22 * e * Math.sin(t * 11 + 1)));
    }
    const curve = new CatmullRomCurve3(pts);
    f.add(new TubeGeometry(curve, 30, 0.06, 6, false));
    for (let j = 0; j < 24; j++) {   // smaller, out to both sides of the stem and turned about 45 degrees to it (the stem runs along z: faces toward +-z showed edge-on from the side, pennants on a rod)
      const q = curve.getPoint(0.1 + j * 0.037), sd = j % 2 ? 1 : -1;
      pal_leafAt(f, leaf, q.x, q.y - 0.01, q.z, sd * (0.5 + 0.7 * hash(j * 3.1)), (hash(j * 3.3) - 0.5) * 0.9, sd * 0.8 + (hash(j * 5.1) - 0.5) * 0.9, 0.65 + 0.35 * hash(j * 1.9));
    }
    const BERRY = [[0, 0, 0], [0.1, -0.04, 0.05], [-0.1, -0.04, -0.05], [0.05, -0.12, -0.08], [-0.05, -0.13, 0.08], [0.09, -0.21, 0.02], [-0.08, -0.22, -0.02], [0, -0.3, 0.03], [0.02, -0.38, 0]];
    for (const [u, c, d] of BERRY) f.ell(0.08, 0.08, 0.08, P2.x + u, P2.y - 0.12 + c, P2.z + d, 0, 0, 0, 6, 4);
    return f.geo();
  }
  // a palm tree ("ואילני תמרים" - Panim Acherim, Beit HaMidrash), 3.4 high on y 0: the trunk (with a cluster of dates) and eight fronds; two geometries
  function pal_palmGeos() {
    const t = pal_fig(), l = pal_fig();
    t.rod(0.17, 0.11, 0, 0, 0, 0.08, 3.25, 0, 8);
    for (let k = 0; k < 5; k++) t.ell(0.07, 0.09, 0.07, 0.3 + (k % 2) * 0.08, 2.95 - k * 0.07, 0.1 + (k % 3) * 0.06, 0, 0, 0, 5, 4);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      l.ell(0.95, 0.04, 0.22, 0.08 + 0.72 * Math.cos(a), 3.25 - 0.08, 0.72 * Math.sin(a), -0.38, 0, -a, 6, 3);
    }
    return { trunk: t.geo(), fronds: l.geo() };
  }
  // the silver dragon of the mechanism ("ותנינא דכספא חד במכונוי" - Targum Sheni; "תנין של כסף היה טוען גלגל של כסא" - Beit HaMidrash): a winding
  // body of overlapping rings tapering to the tail, a head with a jaw and horns, spines and four short legs; about 2 long, facing +x (form: model choice)
  function pal_dragonGeo() {
    const f = pal_fig();
    const c = new CatmullRomCurve3([[-1.0, 0.12, 0.1], [-0.62, 0.2, -0.12], [-0.25, 0.14, 0.12], [0.12, 0.27, -0.1], [0.46, 0.2, 0.08], [0.72, 0.32, 0]].map((q) => new Vector3(q[0], q[1], q[2])));
    for (let i = 0; i <= 36; i++) {   // 1.0.1-L: close enough to overlap down to the tail (18 read as a string of beads)
      const t = i / 36, q = c.getPoint(t), r = 0.04 + 0.1 * Math.pow(t, 0.7);
      f.ell(r, r, r, q.x, q.y, q.z, 0, 0, 0, 7, 5);
      if (i % 5 === 2) f.cone(r * 0.5, q.x, q.y + r * 0.8, q.z, q.x - 0.03, q.y + r + 0.09, q.z, 4);
    }
    f.ell(0.2, 0.13, 0.13, 0.86, 0.36, 0).ell(0.11, 0.05, 0.09, 1.05, 0.34, 0).ell(0.1, 0.03, 0.075, 1.0, 0.25, 0);   // head, snout, jaw
    f.cone(0.03, 0.78, 0.46, 0.06, 0.66, 0.68, 0.11).cone(0.03, 0.78, 0.46, -0.06, 0.66, 0.68, -0.11);                // horns
    for (const s of [-1, 1]) {
      f.ell(0.03, 0.022, 0.022, 0.93, 0.42, s * 0.085);                                                                // brows
      f.rod(0.04, 0.03, 0.42, 0.14, s * 0.12, 0.47, 0.02, s * 0.2).rod(0.035, 0.028, -0.3, 0.1, s * 0.1, -0.34, 0.02, s * 0.18);   // legs
    }
    return f.geo();
  }

  // Light sawn cedar for boards, linings and ceilings (1.0.1-K: the book draws the 45 boards pale; 10-core's cedar texture is so dark
  // that a ceiling lit only by the sky's ground colour read black): a 256 canvas with grain lines that wrap, one tile per 6 amot
  function pal_lightWoodTex() {
    const s = 256, cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const c = cv.getContext("2d");
    c.fillStyle = "#d4b388";
    c.fillRect(0, 0, s, s);
    for (let i = 0; i < 40; i++) {
      const y = (i + 0.5) * s / 40 + (hash(i * 3.7) - 0.5) * 3;
      c.strokeStyle = `rgba(${120 + hash(i) * 40 | 0},${80 + hash(i * 2) * 30 | 0},${40 + hash(i * 5) * 20 | 0},${0.16 + hash(i * 7) * 0.22})`;
      c.lineWidth = 0.8 + hash(i * 11) * 1.6;
      c.beginPath();
      c.moveTo(0, y + Math.sin(i) * 1.8);
      for (let x = 16; x <= s; x += 16) c.lineTo(x, y + Math.sin(x / s * Math.PI * 4 + i) * 1.8);
      c.stroke();
    }
    const t = new CanvasTexture(cv);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.colorSpace = SRGBColorSpace;
    t.repeat.set(1 / 6, 1 / 6);
    t.anisotropy = 4;
    return t;
  }
  // The carpets' weave (model choice: purple, blue and crimson - ארגמן, תכלת ושני - in lozenges), drawn once into a 256 canvas and
  // repeated every 3 amot
  function pal_carpetTex() {
    const s = 256, cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const c = cv.getContext("2d");
    c.fillStyle = "#6a1e3c";
    c.fillRect(0, 0, s, s);
    c.strokeStyle = "#2b3d78";
    c.lineWidth = 14;
    for (const [x, y] of [[0, s / 2], [s / 2, 0], [s, s / 2], [s / 2, s]]) {
      c.beginPath();
      c.moveTo(x - s / 2, y);
      c.lineTo(x, y - s / 2);
      c.lineTo(x + s / 2, y);
      c.lineTo(x, y + s / 2);
      c.closePath();
      c.stroke();
    }
    c.fillStyle = "#c8a24a";
    for (const [x, y] of [[s / 2, s / 2], [0, 0], [s, 0], [0, s], [s, s]]) {
      c.beginPath();
      c.arc(x, y, 18, 0, 7);
      c.fill();
    }
    c.fillStyle = "rgba(255,240,220,0.08)";
    for (let i = 0; i < s; i += 4) c.fillRect(0, i, s, 1);
    const t = new CanvasTexture(cv);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.colorSpace = SRGBColorSpace;
    t.repeat.set(1 / 3, 1 / 3);
    t.anisotropy = 4;
    return t;
  }

  async function buildPalace(ctx) {
    const { H, M, CO, LV } = ctx;
    const g = new Group();
    g.name = "palace";
    g.visible = true;           // 1.0.1 (FIXES E.1): the layer starts VISIBLE; the UI checkbox "בית שלמה" reads .visible and toggles it (SPEC 8)
    ctx.root.add(g);
    ctx.layers.palace = g;
    const Y = PAL_Y, X = PAL_X, HP = Math.PI / 2;

    // ---- materials (clones; the First Temple walls are hewn stone, I Kings 7:9-11: "אבנים יקרת כמדות גזית מגררות במגרה") ----
    const cedarFloor = M.cedar.clone();
    cedarFloor.color.set(0xB8865A);                 // cedar flooring, a little lighter than the beams (model choice): the base of deckMat below
    const gold = M.gold.clone();                    // the throne: ivory overlaid with gold (I Kings 10:18)
    const groove = new MeshStandardMaterial({ color: 0x5A4A38, roughness: 1 }); // joints between the big foundation stones
    const sill = M.stoneLight;                      // the foundation course of big stones (I Kings 7:10)
    // light cedar (pal_lightWoodTex): the 45 boards and the boards of the other reading (the book draws them pale), the thin boards and
    // the linings (Rashi 7:4-5; the book: light frames), and every ceiling; a faint warm emissive stands for the light bounced inside a
    // closed hall, so a ceiling never reads black (model choice)
    const lightWood = new MeshStandardMaterial({ map: pal_lightWoodTex(), roughness: 0.82, emissive: 0x2a1a0c, emissiveIntensity: 1 });
    // 1.0.1-L (Part 7, P3, the user: "הנסרים עדיין בהירים"; A23 "כך כתוב בפסוק כרותות ארזים"): every board of the forest house's roof (the 45 and the thin ones), its linings and the plank roofs of the halls are brown cedar; the pale wood stays only on the ceilings seen from inside
    const boardMat = new MeshStandardMaterial({ map: pal_lightWoodTex(), color: 0x8E6240, roughness: 0.85, emissive: 0x140b05, emissiveIntensity: 1 });
    const cedarThin = boardMat;
    const deckMat = cedarFloor.clone();             // the floor of the forest house's upper storey: its underside is the lower storey's ceiling
    deckMat.emissive.set(0x3a2412);
    deckMat.emissiveIntensity = 1;
    // 1.0.1-K gold (FIXES 0.4: one recipe, goldStd of 10-core; never the old brown tint): the shields "זהב שחוט" (10:16-17) and the vessels
    // "זהב סגור" (10:21) polished; DoubleSide because the צינה is a thin shell and the cups are open
    const goldTex = typeof TEX !== "undefined" && TEX && TEX.gold ? TEX.gold : null;
    const mkGold = (extra) => (goldTex && typeof goldStd === "function" ? goldStd(goldTex, extra) : Object.assign(M.gold.clone(), extra || {}));
    const shieldGold = mkGold({ roughness: 0.26, side: DoubleSide });
    const vesselGold = mkGold({ roughness: 0.24, side: DoubleSide });
    const plankMat = M.cedar.clone();
    plankMat.color.set(0xC99868);                   // cedar floor planks (7:7), light (model choice)
    const jointMat = new MeshStandardMaterial({ color: 0x3A2A1C, roughness: 1 });   // the dark bed under the planks: the joints read as lines
    const grass = new MeshStandardMaterial({ color: 0x6A8A3A, roughness: 1 });
    const leaf = new MeshStandardMaterial({ color: 0x4B7A30, roughness: 0.95 });
    const bark = new MeshStandardMaterial({ color: 0x6B4F33, roughness: 1 });
    const flameMat = new MeshStandardMaterial({ color: 0xFFD080, emissive: 0xFF9A2A, emissiveIntensity: 1.8, roughness: 1 });
    const carpetMat = new MeshStandardMaterial({ map: pal_carpetTex(), roughness: 1 });
    const cushion = new MeshStandardMaterial({ color: 0x6E2350, roughness: 0.95 });   // argaman-purple cushions and covers (model choice)
    const VG = pal_vesselGeos(), LG = pal_lampGeos();

    // ---- labels: pushed to ctx.labels with `layer: "palace"` (the layer-label contract of 50-heichal.js and 70-ui.js): the UI
    // builds the sprite, shows it only while ctx.layers.palace is visible, and applies the "תוויות" toggle and the distance scaling
    // to it like to every other label. Sizes: 6 for the halls and courts (the UI shows a size-6 label up to 700 amot, a size-4 one
    // only up to 330, and the palace overview camera stands about 400 away), 8 for the whole, smaller for the details. ----
    const palLabels = [];
    const lbl = (text, x, y, z, size = 4) => {
      const l = { text, x, y, z, size, layer: "palace" };
      palLabels.push(l);
      ctx.labels.push(l);
    };
    // 1.0.1 (FIXES H.5): a label of ONE reading of בית יער הלבנון carries `layers: ["palace", "forestRashi" | "forestMetzudot" |
    // "forestMzd"]` (an array: the UI shows the label only while ALL the listed layers are visible), so it comes and goes with its variant
    // group. 1.0.1-L: `extra` adds a third layer - "forestBoards" for the labels that name the boards (they go when the boards are removed)
    const vlbl = (variant, text, x, y, z, size = 4, extra = null) => {
      const l = { text, x, y, z, size, layers: extra ? ["palace", variant, extra] : ["palace", variant] };
      palLabels.push(l);
      ctx.labels.push(l);
    };

    // ===== 1. the terrace: x 10..196, z 352.5..672.5, y -30..-10 (SPEC 8, model choice), paved top =====
    const TX0 = 10, TX1 = 196, TZ0 = 352.5, TZ1 = 672.5;   // TZ0 = CO.harS + 20: 20 amot south of the Temple's great-court wall
    const TCX = (TX0 + TX1) / 2, TCZ = (TZ0 + TZ1) / 2;    // 103, 512.5
    H.box(g, TX1 - TX0, 20 - 0.3, TZ1 - TZ0, M.stone, TCX, -30, TCZ);   // the stone terrace, y -30..-10.3
    H.box(g, TX1 - TX0, 0.3, TZ1 - TZ0, M.pave, TCX, Y - 0.3, TCZ);     // paving, top at y -10 = the palace floor

    // ===== 2. the great court wall of the palace (I Kings 7:12 "וחצר הגדולה סביב שלשה טורים גזית וטור כרתת ארזים"; Rashi on 7:12
    // "החומה עשויה שלשה נדבכין של אבנים, ונדבך של עץ עליהם"), thickness 3 inside the terrace edge, height 10 (model choice: no measure
    // in any source). 1.0.1-L (FIXES L.33; the user: "בית המלך היה בחצר אחרת לגמרי! ולא בתוך חצר בית יער הלבנון"): the great court -
    // the court of בית יער הלבנון - no longer runs round the whole terrace (1.0.1-K: x 13..193, z 355.5..669.5, the king's court inside
    // it). As the book (the user's reference) draws it on p13 - "חצר הגדולה" round the forest house, its halls and בית בת פרעה, and
    // "חצר אחרת" with "ביתו" a separate walled court standing apart from it - its north wall now stands at z 443..446, 13 amot north of
    // the forest house, with a gate on the axis; beyond it a lane 11 wide and then the king's own court (section 8). The commentators
    // who make the great court surround every house of the king (Ralbag on 7:12 "שהחצר הגדולה אשר בה בית המלך"; Metzudat David there
    // "אשר היה מסבב כל בתי המלך"; Malbim "החומה שהיה סביב כל הבנינים") are not followed here - the user's words and the book are. The
    // inner rectangle is x 13..193, z 446..669.5 =====
    const WT = 3, WH = 10, GW = 10, GH = 2.8 * 3;   // gate 10 wide (SPEC 8) x 8.4 high: the three stone courses (2.8 each); the cedar course over it is the lintel (model choice)
    // 1.0.1-L (Part 7, P5, the user: "לא הפרדת לגמרי את חצר המלך מהחצר הגדולה"): the great court's north wall, z 449..452 (it was 443..446), so that 17 amot of open bare ground
    // lie between the two courts' walls; each court is closed by its own wall, and the only way between them is gate to gate (model choice)
    const GN = 449;
    const wallS = pal_bandWall(ctx, g, { axis: "x", length: TX1 - TX0, cx: TCX, cz: TZ1 - WT / 2, y: Y, height: WH, thickness: WT, gate: { c: 0, w: GW, h: GH } });
    const wallN = pal_bandWall(ctx, g, { axis: "x", length: TX1 - TX0, cx: TCX, cz: GN + WT / 2, y: Y, height: WH, thickness: WT, gate: { c: 0, w: GW, h: GH } });
    pal_bandWall(ctx, g, { axis: "z", length: (TZ1 - WT) - (GN + WT), cx: TX1 - WT / 2, cz: (GN + TZ1) / 2, y: Y, height: WH, thickness: WT });
    pal_bandWall(ctx, g, { axis: "z", length: (TZ1 - WT) - (GN + WT), cx: TX0 + WT / 2, cz: (GN + TZ1) / 2, y: Y, height: WH, thickness: WT });
    // 1.0.1-L (L.33): the terrace's edges outside both courts (the lane and the strips beside the king's court, x 10..33 and 173..196,
    // z 352.5..443) get a low stone parapet, 1.5 high and 1 thick (model choice; a fence where one may fall: Deut 22:8 "ועשית מעקה
    // לגגך"), so the open terrace is not a bare drop
    for (const [w, d, x, z] of [[1, GN - TZ0, TX0 + 0.5, (TZ0 + GN) / 2], [1, GN - TZ0, TX1 - 0.5, (TZ0 + GN) / 2], [22, 1, TX0 + 1 + 11, TZ0 + 0.5], [22, 1, TX1 - 1 - 11, TZ0 + 0.5]]) H.occ(H.box(g, w, 1.5, d, M.stoneLight, x, Y, z)).name = "terraceParapet";

    // 1.0.1-L (Part 7, P5): the terrace outside both courts (the lane between them and the strips beside the king's court) is bare ground, not paving, so that the two courts read as apart (model choice)
    {
      const bare = new MeshStandardMaterial({ color: 0x9C8A68, roughness: 1 });
      for (const [x0, x1, z0, z1] of [[TX0 + 1, TX1 - 1, 432, GN], [TX0 + 1, 33, TZ0 + 1, 432], [173, TX1 - 1, TZ0 + 1, 432]]) { const m = H.box(g, x1 - x0, 0.04, z1 - z0, bare, (x0 + x1) / 2, Y, (z0 + z1) / 2); m.name = "laneGround"; m.castShadow = false; }
    }
    // door leaves (cedar, slightly ajar; model choice - the sources give no doors for the palace gates); parent: the group (1.0.1-K)
    const leaves = (axis, gx, gz, y, w, h, mat, ajar = 0.35, swing = 1, parent = g) => {
      for (const s of [-1, 1]) {
        const leaf2 = new Group();
        const pw = w / 2 - 0.08;
        if (axis === "x") {
          leaf2.position.set(gx + s * w / 2, y, gz);
          H.box(leaf2, pw, h, 0.3, mat, -s * (pw / 2 + 0.04), 0, 0);
        } else {
          leaf2.position.set(gx, y, gz + s * w / 2);
          H.box(leaf2, 0.3, h, pw, mat, 0, 0, -s * (pw / 2 + 0.04));
        }
        leaf2.rotation.y = s * ajar * swing;
        parent.add(leaf2);
      }
    };
    // gate trim: stone jambs, threshold, doors (model choice)
    // 1.0.1-K review (palace-courts-4): each jamb stands 0.02 into the opening (as 20-mount.js's gate portal, eps 0.02), so its inner face
    // no longer lies in the plane of the wall's reveal (the bands end at x 98 / 108) facing the same way; the leaves hang on the jambs' faces
    const JE = 0.02;
    const gateTrim = (gz, fadeRef, swing) => {
      for (const s of [-1, 1]) {
        const j = H.box(g, 1.2, GH, WT + 0.6, M.stoneLight, X + s * (GW / 2 + 0.6 - JE), Y, gz);   // x 96.82..98.02 and 107.98..109.18
        H.occ(j).userData.fadeWith = fadeRef;
      }
      H.box(g, GW + 2.4, 0.15, WT + 0.8, M.stoneSmooth, X, Y, gz);
      leaves("x", X, gz, Y, GW - 2 * JE, GH - 0.4, M.cedar, 0.35, swing);
    };
    gateTrim(TZ1 - WT / 2, wallS[0], -1);   // the south gate: the public entrance from the city (model choice)
    gateTrim(GN + WT / 2, wallN[0], 1);     // the north gate (1.0.1-L: in the new north wall, toward the lane and the king's court; model choice)

    // the approach from the city: a stair from the ground up to the south gate on a stone plinth (model choice; rise 0.5, tread 0.5).
    // The ground south of the platform is 20-mount.js's MNT_GROUND_Y (-28, exposed as ctx.shared.groundY) plus its terrain noise
    // (about -21 at this spot): the plinth top is set on the actual terrain (pal_groundLevel samples it over the plinth's footprint and
    // rounds to whole steps; without a terrain it falls back to ctx.shared.groundY), and the plinth runs 10 below that top so it stays
    // closed where the ground dips; the flight then climbs from the plinth top to the terrace floor and every step is above ground
    const G = pal_groundLevel(ctx, X - 8, X + 8, TZ1, TZ1 + 24, Y);
    const STEPS_S = Math.max(1, Math.round((Y - G) / 0.5)), RUN_S = STEPS_S * 0.5;   // e.g. -21 -> 22 steps, run 11
    H.box(g, 16, 10, RUN_S + 4, M.stone, X, G - 10, TZ1 + (RUN_S + 4) / 2);          // the plinth, 4 amot beyond the first step
    H.stairs(g, { width: 16, totalRise: Y - G, steps: STEPS_S, dir: "N", x: X, y: G, z: TZ1 + RUN_S, tread: 0.5 });

    // the way up from the palace to the Temple (1.0.1, FIXES E.3; the verses that put the king's house BELOW the house of the LORD are
    // in the header: I Kings 10:5 "ועלתו אשר יעלה בית ה'", Jer 26:10 "ויעלו מבית המלך בית ה'", II Kings 11:19): from the north edge of the
    // terrace (z 352.5; 1.0.1-L: the north gate of the king's own court, section 8 - Rashi on 10:5 "דרך מבוא שהכין מביתו לבית המקדש";
    // 1.0.1-K: the great court's north gate, z 352.5..355.5) a stair of 20 steps (model choice, SPEC 8), rise 0.5 (Middot 2:3 convention of the model), from the palace
    // floor (y -10) to LV.HAR (0), then a short stone-paved landing up to the Temple's south gate, all on a stone causeway bridging the
    // 17.5 amot to the Temple's south wall (CO.harS + 2.5 = its south face; the great-court wall is 5 thick, centred on CO.harS).
    // NOTE: 20-mount.js builds the Temple's own south-gate flight at this very spot (56 steps of 0.5, 14 wide: x 96..110, z 335..363,
    // from the ground at -28 up to the platform). The causeway, the stair and the landing are therefore 16 wide (x 95..111) so that
    // flight is enclosed inside them (every palace surface here is at or above the buried steps: landing 0, stair top 342.5 - z,
    // terrace -10 against step tops of 335 - z), and the landing's top stands a hair (0.06) above LV.HAR so it does not share a plane
    // with the top of that flight's last step (no z-fighting; the gate's threshold, 0.18 high, still rises above the landing)
    const NZ = CO.harS + 2.5;
    const STEPS_N = 20, RISE_N = LV.HAR - Y, NW = 16, LIP = 0.06;   // 20 steps x 0.5 = 10
    H.box(g, NW, 20, TZ0 - NZ, M.stone, X, -30, (TZ0 + NZ) / 2);                       // causeway y -30..-10
    H.stairs(g, { width: NW, totalRise: RISE_N, steps: STEPS_N, dir: "N", x: X, y: Y, z: TZ0, tread: 0.5 }); // z 352.5 -> 342.5
    const landZ0 = NZ, landZ1 = TZ0 - STEPS_N * 0.5;   // 335..342.5
    const PAVE_T = 0.1;   // 1.0.1: the paving slab of the landing (model choice); the top stays at LV.HAR + LIP, under the gate's threshold (0.18)
    H.box(g, NW, RISE_N + LIP - PAVE_T, landZ1 - landZ0, M.stoneSmooth, X, Y, (landZ0 + landZ1) / 2);  // the landing's stone body, y -10..-0.04, against the Temple wall
    H.box(g, NW, PAVE_T, landZ1 - landZ0, M.pave, X, LV.HAR + LIP - PAVE_T, (landZ0 + landZ1) / 2);    // the stone-paved way, top at y 0.06 (the hair, see the NOTE), the terrace's paving
    // 1.0.1: the label names the way (FIXES E.3); size 6 so it shows from the palace overview camera (about 530 away: the UI shows a
    // size-6 label up to 700 amot, see the label note above); y 8 keeps it under 20-mount's "השער הדרומי" (y 28)
    lbl("המעלות מבית המלך אל בית ה׳ (מלכים א י, ה)", X, 8, (landZ0 + TZ0) / 2, 6);   // x 103, z 343.75: over the landing and the stair top

    // ===== shared building parts =====
    const grooves = new Map();   // parent Group -> joints of its big foundation stones (instanced per group at the end; 1.0.1 H.5: the
    //                              forest house's course belongs to its variant group, so its joints are instanced there too)
    // a visible foundation course of big stones, 10 and 8 amot long, 2 high, protruding 0.3 around a building's base
    // (I Kings 7:10 "ומיסד אבנים יקרות אבנים גדלות אבני עשר אמות ואבני שמנה אמות"; the course height is a model choice).
    // Shown as a visible course so the 10/8 stones can be seen - a model choice that follows neither reading: Rashi on 7:10 puts
    // the big stones in the buried foundation ("והיסוד שבתוך הקרקע היה של אבנים גדולות יותר ממדות גזית"), and Radak quoting Chazal
    // has them as ledges (איצטוניות) protruding inward ("בולטות מבפנים לבית") - DEV note; the UI's החצר הגדולה text says so.
    // The course runs only under walls that exist (sides: an open colonnade side gets no fence) and is interrupted at every doorway
    // that starts at the floor: doors = {N, S, E, W: [[lo, hi], ...]} are the door intervals in world x (north/south strips) or
    // world z (east/west strips), so no slab crosses a door; the joints are placed inside the remaining runs only
    // parent (1.0.1 H.5) = the Group that receives the course (the palace group, or a variant group of the forest house)
    const foundation = (parent, x0, x1, z0, z1, sides = { N: 1, S: 1, E: 1, W: 1 }, doors = {}) => {
      const p = 0.3, h = 2;
      if (!grooves.has(parent)) grooves.set(parent, []);
      const jlist = grooves.get(parent);
      const joints = (len) => {                       // joints every 10 / 8 amot (alternating) along a face, measured from its start
        const out = [];
        let d = 10, i = 0;
        for (let s = 10; s < len - 0.5; s += d, i++) {
          out.push(s);
          d = i % 2 === 0 ? 8 : 10;
        }
        return out;
      };
      const inside = (runs, v) => runs.some(([ra, rb]) => v > ra + 0.3 && v < rb - 0.3);
      // north / south strips (the full width plus the corners), then the east / west strips between them
      for (const [on, zc, zf, cuts] of [[sides.N, z0 - p / 2, z0 - p, doors.N], [sides.S, z1 + p / 2, z1 + p, doors.S]]) {
        if (!on) continue;
        const runs = pal_subtract(x0 - p, x1 + p, cuts);
        for (const [a, b] of runs) H.box(parent, b - a, h, p, sill, (a + b) / 2, Y, zc).name = "foundationCourse";
        for (const s of joints(x1 - x0)) if (inside(runs, x0 + s)) jlist.push({ x: x0 + s, y: Y + h / 2, z: zf, ry: 0 });
      }
      for (const [on, xc, xf, cuts] of [[sides.W, x0 - p / 2, x0 - p, doors.W], [sides.E, x1 + p / 2, x1 + p, doors.E]]) {
        if (!on) continue;
        const runs = pal_subtract(z0, z1, cuts);
        for (const [a, b] of runs) H.box(parent, p, h, b - a, sill, xc, Y, (a + b) / 2).name = "foundationCourse";
        for (const s of joints(z1 - z0)) if (inside(runs, z0 + s)) jlist.push({ x: xf, y: Y + h / 2, z: z0 + s, ry: HP });
      }
    };

    // instanced boxes of several sizes: items [{x, y (= bottom), z, w, h, d, ry?}] grouped by size, one InstancedMesh per size with
    // world-scaled UVs (1.0.1-K: the beams, the deck, the boards, the linings and the furniture)
    const boxes = (parent, mat, items, shadow = true, name = null) => {
      const by = new Map();
      for (const it of items) {
        const k = it.w.toFixed(3) + "|" + it.h.toFixed(3) + "|" + it.d.toFixed(3);
        if (!by.has(k)) by.set(k, []);
        by.get(k).push(it);
      }
      const out = [];
      for (const list of by.values()) {
        const { w, h, d } = list[0];
        const m = pal_instanced(parent, H.uvWorldBox(new BoxGeometry(w, h, d), w, h, d), mat, list.map((it) => ({ x: it.x, y: it.y + h / 2, z: it.z, ry: it.ry || 0 })), shadow);
        if (name) m.name = name;
        out.push(m);
      }
      return out;
    };
    // a cedar plank floor (7:7 "וספון בארז מהקרקע עד הקרקע", Rashi "מחפה קרקע הרצפה בארזים"; the book p12L draws the planks "מצד
    // לצד"): a dark bed and planks about 1 wide x 0.1 with 0.04 joints running along x, top at Y + 0.25 like the 1.0.1 floor slab.
    // 1.0.1-K review (palace-courts-2): the bed is 0.16 high (was 0.15), so its top, seen in the joints, stands 0.01 above the paving of
    // the other court (top Y + 0.15), which runs under בית בת פרעה - no coplanar faces; the planks' bottom lies 0.01 inside it (model choice).
    // 1.0.1-L: that paving now runs under בית המלך (the king's court, section 8); בית בת פרעה stands on the terrace's paving (top Y)
    const planks = (parent, xa, xb, za, zb) => {
      H.box(parent, xb - xa, 0.16, zb - za, jointMat, (xa + xb) / 2, Y, (za + zb) / 2).castShadow = false;
      const n = Math.max(1, Math.round(zb - za)), w = (zb - za) / n, L = xb - xa;
      const items = [];
      for (let i = 0; i < n; i++) items.push({ x: (xa + xb) / 2, y: Y + 0.2, z: za + w * (i + 0.5) });
      const m = pal_instanced(parent, H.uvWorldBox(new BoxGeometry(L, 0.1, w - 0.04), L, 0.1, w - 0.04), plankMat, items, false);
      m.name = "cedarPlanks";
      return m;
    };
    // a table: a top 0.15 thick and four legs (more when long), y = the floor under it (model choice for every table in the palace)
    const table = (list, cx, y, cz, lx, lz, h) => {
      list.push({ x: cx, y: y + h - 0.15, z: cz, w: lx, h: 0.15, d: lz });
      const nx = lx > 8 ? 3 : 2, nz = lz > 8 ? 3 : 2;
      for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
        if (i > 0 && i < nx - 1 && j > 0 && j < nz - 1) continue;
        list.push({ x: cx - lx / 2 + 0.3 + i * (lx - 0.6) / (nx - 1), y, z: cz - lz / 2 + 0.3 + j * (lz - 0.6) / (nz - 1), w: 0.25, h: h - 0.15, d: 0.25 });
      }
    };
    // vessels on a table top: n along the table's long axis, alternating sides (the types cycle; model choice)
    const VTYPES = ["jug", "goblet", "bowl", "goblet", "plate", "goblet"];
    const vessels = { jug: new Map(), goblet: new Map(), bowl: new Map(), plate: new Map() };   // type -> parent -> items
    const putVessels = (parent, cx, y, cz, along, len, n, spread = 0.45) => {
      for (let i = 0; i < n; i++) {
        const t = VTYPES[i % VTYPES.length];
        const off = -len / 2 + (i + 0.5) * len / n, side = (i % 2 ? 1 : -1) * spread;
        const it = along === "z" ? { x: cx + side, y, z: cz + off } : { x: cx + off, y, z: cz + side };
        if (!vessels[t].has(parent)) vessels[t].set(parent, []);
        vessels[t].get(parent).push(it);
      }
    };
    const lamps = [];   // {x, y, z}: lampstands (model choice), instanced at the end
    const carpets = []; // {x, y, z, w, d}: carpets 0.04 thick (model choice)

    // A stone hall: walls t thick inside the footprint x0..x1, z0..z1 (z0 = north), wall height = roofAt + 2 (the roof slab, 1 thick,
    // sits at roofAt inside the walls, and the walls rise 1 above it as a parapet: model choice). sides = which walls exist.
    // holes per side (see pal_wall); floor: null = the terrace paving, "planks" = a cedar plank floor (1.0.1-K), or a material.
    // 1.0.1-K: nothing goes to ctx.cutaway (that list opens the Temple's HOUSE); the roof and the ceiling go to roofList when given
    // (the on-model roof buttons of section 12); fascia: {N, S} false = no fascia beam on that open side (the side is closed by a
    // neighbour); foundSides = the sides that get the foundation course (default: the walls that exist).
    // parent (1.0.1 H.5) = the Group that receives every piece (default: the palace group; a variant group for the forest house).
    // Returns {N, S, E, W, roof, ceil, fasciaS, fasciaN, floor} - the pieces that exist.
    const hall = ({ parent = g, x0, x1, z0, z1, t = 3, h = 20, roofAt = null, sides = { N: 1, S: 1, E: 1, W: 1 }, holes = {}, floor = null, roofMat = M.stoneLight, ceiling = true, found = true, foundSides = null, fascia = {}, roofList = null, roofWood = false }) => {
      const rA = roofAt == null ? h : roofAt;
      const wallH = rA + 2;
      const zA = sides.N ? z0 + t : z0, zB = sides.S ? z1 - t : z1;
      const xA = sides.W ? x0 + t : x0, xB = sides.E ? x1 - t : x1;
      const W = {};
      if (sides.N) W.N = pal_wall(ctx, parent, { axis: "x", length: x1 - x0, height: wallH, thickness: t, mat: M.stone, cx: (x0 + x1) / 2, cz: z0 + t / 2, y: Y, holes: holes.N || [] });
      if (sides.S) W.S = pal_wall(ctx, parent, { axis: "x", length: x1 - x0, height: wallH, thickness: t, mat: M.stone, cx: (x0 + x1) / 2, cz: z1 - t / 2, y: Y, holes: holes.S || [] });
      if (sides.E) W.E = pal_wall(ctx, parent, { axis: "z", length: zB - zA, height: wallH, thickness: t, mat: M.stone, cx: x1 - t / 2, cz: (zA + zB) / 2, y: Y, holes: holes.E || [] });
      if (sides.W) W.W = pal_wall(ctx, parent, { axis: "z", length: zB - zA, height: wallH, thickness: t, mat: M.stone, cx: x0 + t / 2, cz: (zA + zB) / 2, y: Y, holes: holes.W || [] });
      if (floor === "planks") W.floor = planks(parent, xA, xB, zA, zB);
      else if (floor) W.floor = H.box(parent, xB - xA, 0.25, zB - zA, floor, (xA + xB) / 2, Y, (zA + zB) / 2);
      // roof: a flat slab inside the walls (model choice) with a cedar ceiling under it (I Kings 7:3 "וספן בארז ממעל" for בית יער
      // הלבנון; 7:11 "ומלמעלה... וארז" with Metzudat David "כל הבנינים האלה, כיסה התקרה בארז" for the other halls)
      W.roof = H.box(parent, xB - xA, 1, zB - zA, roofWood ? jointMat : roofMat, (xA + xB) / 2, Y + rA, (zA + zB) / 2);
      // 1.0.1-L (A23, the user: "בהחלט, כך כתוב בפסוק כרותות ארזים"; the book p13R): the slab is a dark bed and on it brown cedar planks 1 wide, the joints showing, as the plank floors
      if (roofWood) {
        const nP = Math.max(1, Math.round(zB - zA)), wP = (zB - zA) / nP, LP = xB - xA, pl = [];
        for (let i = 0; i < nP; i++) pl.push({ x: (xA + xB) / 2, y: Y + rA + 1.05, z: zA + wP * (i + 0.5) });
        W.roofPlanks = pal_instanced(parent, H.uvWorldBox(new BoxGeometry(LP, 0.1, wP - 0.06), LP, 0.1, wP - 0.06), boardMat, pl, false);
        W.roofPlanks.name = "cedarRoofPlanks";
        if (roofList) roofList.push(W.roofPlanks);
      }
      // fascia beams on open sides (model choice): 1.5 x 1.2, hung under the roof slab (top at Y + rA), 0.1 proud of the open edge so
      // its outer face shares no plane with the ends of the ceiling or of the beams; fascia.S / .N = false: none (the side is closed by
      // a neighbour), a number: how far it stands proud (0 where a neighbour's roof abuts). 1.0.1-K: the ceiling stops at the fascias
      // (in 1.0.1 its 0.2 ends lay inside them)
      const fpS = !sides.S && fascia.S !== false ? (typeof fascia.S === "number" ? fascia.S : 0.1) : null;
      const fpN = !sides.N && fascia.N !== false ? (typeof fascia.N === "number" ? fascia.N : 0.1) : null;
      const cz0 = zA + (fpN != null ? 1.2 - fpN : 0), cz1 = zB - (fpS != null ? 1.2 - fpS : 0);
      if (ceiling) W.ceil = H.box(parent, xB - xA, 0.2, cz1 - cz0, lightWood, (xA + xB) / 2, Y + rA - 0.2, (cz0 + cz1) / 2);
      if (fpS != null) W.fasciaS = H.box(parent, xB - xA, 1.5, 1.2, M.cedar, (xA + xB) / 2, Y + rA - 1.5, zB - 0.6 + fpS);
      if (fpN != null) W.fasciaN = H.box(parent, xB - xA, 1.5, 1.2, M.cedar, (xA + xB) / 2, Y + rA - 1.5, zA + 0.6 - fpN);
      if (roofList) {
        roofList.push(W.roof);
        if (W.ceil) roofList.push(W.ceil);
      }
      if (found) {
        // doorways (holes starting below the course top) as world intervals: pal_wall's hole centre c is an offset from the wall centre
        // along world +x (north/south walls) or world +z (east/west walls)
        const dv = (list, c0) => (list || []).filter((o) => (o.b || 0) < 2).map((o) => [c0 + (o.c || 0) - o.w / 2, c0 + (o.c || 0) + o.w / 2]);
        const cxm = (x0 + x1) / 2, czm = (zA + zB) / 2;
        foundation(parent, x0, x1, z0, z1, foundSides || sides, { N: dv(holes.N, cxm), S: dv(holes.S, cxm), E: dv(holes.E, czm), W: dv(holes.W, czm) });
      }
      return W;
    };
    const roofSets = { throne: [], king: [], pharaoh: [] };   // the roofs and ceilings the on-model buttons remove (section 12; 1.0.1-L: בית בת פרעה apart)

    // pillars 2.5 x 2.5 of cedar (I Kings 7:2 "עמודי ארזים"); two heights, instanced
    const P20 = [];   // {x, z}
    const pillarGeo = (hh, pw = 2.5) => H.uvWorldBox(new BoxGeometry(pw, hh, pw), pw, hh, pw);
    // small windows 2 x 2 with the sill at b (model choice - the sources give no windows for these halls; only בית יער הלבנון has
    // windows, I Kings 7:4-5); win3: 2 x 3 (the king's house, 1.0.1-K)
    const win2 = (cs, b = 12) => cs.map((c) => ({ c, b, w: 2, h: 2 }));
    const win3 = (cs, b = 9) => cs.map((c) => ({ c, b, w: 2, h: 3 }));

    // ===== 1.0.1-L (Part 7, P4, the user: "תזיז את אולם הכסא והמשפט למקביל לבית בת פרעה (לא רואים את אולם העמודים)"; the book p13R; this overrides his earlier A22): the two halls, the throne and all it
    // carries stand parallel to בית בת פרעה on the forest house's other long side: 13 amot off the house's line as she is (x 65 | 78..128 | 141), her z 560..610, 2 amot inside the great court's east wall.
    // Sections 3, 4 and the throne keep their own numbers (x 78..128, z 609.5..659.5) inside the group thG, moved by THDX, THDZ; labels, anchors and fly points add the offset.
    // Now x 141..191, z 560..610. Metzudat David's hall (x 131..161, z 484.5..534.5) and its עב row (x 166) end 25.5 north of it: no collision in any reading =====
    const THDX = 63, THDZ = -49.5;
    const thG = new Group();
    thG.name = "throneHalls";
    thG.position.set(THDX, 0, THDZ);
    g.add(thG);
    const thLbl = (text, x, y, z, size) => lbl(text, x + THDX, y, z + THDZ, size);
    // ===== 3. אולם המשפט (I Kings 7:7; Metzudot: outside the throne hall, where litigants wait; Radak: a gate-house before the
    // throne hall; Malbim: the Sanhedrin sat there): 50 x 20 x 20 high, research y 10..30, open to the south (model choice),
    // cedar floor wall to wall (7:7 "וספון בארז מהקרקע עד הקרקע", Rashi, Radak, Metzudot) - planks (1.0.1-K, the book p12L) =====
    const BX0 = pal_wx(65), BX1 = pal_wx(115);   // 78..128: all the big buildings are 50 wide, centred on the axis
    const jZ0 = pal_wz(30), jZ1 = pal_wz(10);    // 639.5..659.5 (the throne hall's south wall is the north side)
    hall({ parent: thG, x0: BX0, x1: BX1, z0: jZ0, z1: jZ1, h: 20, sides: { N: 0, S: 0, E: 1, W: 1 }, floor: "planks", roofList: roofSets.throne, roofWood: true, fascia: { N: false } });   // its north side is the throne hall's south wall
    for (const dx of [-15, -5, 5, 15]) P20.push({ x: X + dx + THDX, z: jZ1 - 1.25 + THDZ });   // the open south side: 4 cedar pillars every 10 (model choice)
    thLbl("אולם המשפט", X, Y + 25, (jZ0 + jZ1) / 2, 6);

    // ===== 4. אולם הכסא (I Kings 7:7 "ואולם הכסא אשר ישפט שם"): 50 x 30 x 20, research y 30..60, cedar plank floor (7:7; the book
    // p12L); the throne against the north wall centre facing south, to the people entering (model choice); door to the judgment hall
    // 6 x 10 and two side doors 4 x 8 in the north wall (model choice) =====
    const kZ0 = pal_wz(60), kZ1 = pal_wz(30);    // 609.5..639.5
    hall({
      parent: thG, x0: BX0, x1: BX1, z0: kZ0, z1: kZ1, h: 20, floor: "planks", roofList: roofSets.throne, roofWood: true,
      holes: {
        S: [{ c: 0, b: 0, w: 6, h: 10 }],
        N: [{ c: -18, b: 0, w: 4, h: 8 }, { c: 18, b: 0, w: 4, h: 8 }],
        E: win2([-10, 0, 10]), W: win2([-10, 0, 10])
      }
    });
    thLbl("אולם הכסא", X, Y + 25, (kZ0 + kZ1) / 2, 6);
    for (const [lx, lz] of [[BX0 + 4.5, kZ0 + 6], [BX1 - 4.5, kZ0 + 6], [BX0 + 4.5, kZ1 - 6], [BX1 - 4.5, kZ1 - 6]]) lamps.push({ x: lx + THDX, y: Y + 0.25, z: lz + THDZ });
    // ===== the throne (rebuilt in 1.0.1-L, FIXES L.57; the user: "לגבי כסא שלמה עיין במלכים וכן בקבצים המצורפים", "הבא בעצמך עוד מקורות
    // לכסא שלמה"; FOUR switchable versions, the king's ascent and the witnesses' scene since FIXES L.78-L.81, the user: "פה יש את כל
    // המדרשים על כסא שלמה, צור כפתור לכל דעה סותרת וכן מצגת לכל אחד מהם") =====
    // The verses: I Kings 10:18-20 "ויעש המלך כסא שן גדול ויצפהו זהב מופז. שש מעלות לכסה וראש עגל לכסה מאחריו וידת מזה ומזה אל מקום השבת
    // ושנים אריות עמדים אצל הידות. ושנים עשר אריים עמדים שם על שש המעלות מזה ומזה לא נעשה כן לכל ממלכות"; II Chr 9:18 adds "וכבש בזהב לכסא
    // מאחזים". Rashi on 10:19: "שש מעלות. מדרגות לעלות בו, וראש הכסא היה עגל, מקום מושב המלך"; "מאחריו. תקון הכסא היה רחב, והמעלות היו לצד
    // פניו, ולצד רחבה לצד אחריו היה המושב גבוה מן הכסא מקום עגל"; "וידת מזה ומזה. לסמך זרועותיו עליהם, כמין מקלות זהב מפאה לפאה, פשוטין
    // לימין ולשמאל"; "ושנים אריות. של זהב, וכל צורת הכסא מפרשת באגדת מגלת אסתר" - and on II Chr 9:19 "וכל צורת הכסא וצורת החיות שבכסא
    // מפרש בתרגום של מגלת אסתר". Metzudat David on 10:20 "ששה מזה, וששה מזה"; Ralbag on 10:19 the lions at both ends of every step "לצד פני
    // הכסא"; Malbim on 10:19 the back "עגול מאחריו כמדת גופו וראשו לסמוך עליו גבו"; Malbim on II Chr 9:17 "שהיה הדום הרגל ג"כ מזהב"; Abarbanel
    // on 10:18-20 (the library's 3574:563) "והיו גם כן שתי ידות מפה ומפה לכסא, כמו זרועות להסמך בהם בידים בעת הישיבה, והיו שני אריות בשתי
    // הידות, (כ) ועוד היו בכל מעלה משני צדדיה שני אריות, באופן שהיו שני אריות מלמעלה ושנים עשר אריות בכל המעלות".
    // Rashi sends to the aggadah of Esther: the midrashim differ, so (1.0.1-L, FIXES L.81) the throne is built in FOUR versions that share the
    // base and differ in what the midrash adds, ctx.shared.throneVersion.set(key):
    //  - "pesukim" (the default): the verses and the commentators only - the base, 12 lions six a side and 2 at the arms, nothing else;
    //  - "targumSheni" (Targum Sheni on Esther 1:2, the library's 3237:14-17 in Aramaic): "קיימין עלוהי תרין עשר ארייון דדהבא ולקבליהון תרין
    //    עשר נשרין דדהבא אריא לקבל נשרא ונשרא לקבל אריא מכוונין אילין לקביל אילין" - 12 eagles facing the 12 lions; the lying pairs of the six
    //    steps (ox-lion, wolf-lamb, leopard-kid, eagle-peacock, cat-rooster, "בר נצא"-bird); "ועל ריש כורסיא קיימא יונה דדהבא אחידא בר נצא
    //    בידה"; the menorah "ועל מרישי כורסיא קיימא מנרתא דדהבא" with seven branches a side (the seven fathers, the seven pious), its bowl
    //    and basin and the two sheaves; two seats "חד לכהנא רבא וחד לסגן כהניא"; "שבעין כורסוון דדהבא" for the Sanhedrin; "עשרין וארבע גפנין
    //    דדהבא דעבדין טיללא למלכא שלמה"; "ותנינא דכספא חד במכונוי"; the precious stones "מקובע באבני בורלא ומשקע באבני שישא ומקבעין זמרגזין
    //    וכודכדנין בירולין ומיגליין"; the "בנת ימא" by his ears are text only;
    //  - "estherRabbah" (Esther Rabbah 1:12 with Panim Acherim נוסח ב and Abba Gorion, which agree in the main - Abba Gorion adds a silver peacock that seats him, a lion that crowns him and pairs on the steps, text only; the library's 264:25, 274:116, 274:6):
    //    "עלה במעלה הראשונה והארי פושט לו יד, ובשניה נשר פושט לו יד" with the sides changing (Abba Gorion "והארי, פושט את ידו של ימין, והנשר
    //    גפו של שמאל... והנשר פושט גפו של ימין, והארי ידו של שמאל"); "ובמקום השבת שרביט הזהב מאחוריו, ויונה נתונה בראשו ועטרה של זהב בפיה,
    //    כדי שיהא המלך יושב בשבת ועטרה של זהב נוגע ואינו נוגע" (so too Bamidbar Rabbah 12:17 and Pesikta deRav Kahana 1:7); Panim Acherim:
    //    "ושני עמודים של שיש היו עומדים על ראש האריות, ושני גפנים של זהב עומדות משני צדי הכסא, ומצילות על ראשי העמודים, ושני אריות של זהב
    //    חלולים היו עומדות כנגד הראשון, והיו מלאים כל מיני בשמים, שהיו זולפים בשמים, כשהיה המלך שלמה עולה", the two seats and the seventy,
    //    the steps "מכובשת באבנים טובות ומרגליות... לבנות ירקרקות ואדמדמות";
    //  - "beitHamidrash" (Jellinek's Beit HaMidrash II, "דמות כסא שלמה", the library's 7924:8-9): the 12 lions "פורשות למעלה ידיהם וכתב
    //    מורשם בידיהם" ("לא תכירו פנים במשפט", "לא תקח שוחד", "ודל לא תהדר בריבו"); the stones "לבנות מכורכמות, ויש בהן זכוכית לבן וטובה";
    //    "ואילני תמרים מיפות את הכסא ומרוקמים בבגדי שש, והיו טווסין של שן מכוונים כנגד כנפי נשרים. ושני עמודים של שש על ראשי האריות, ושני
    //    אבנים של זהב היו על שני צידי הכסא, והיו מלאים מכל מיני בשמים. ושתי קתדראות של זהב משני צדי הכסא, אחת לגד הנביא ואחת לנתן הנביא.
    //    ושבעים קתדראות של זהב לשבעים זקנים ויושבין בהן. ועל כל קתדרא וקתדרא שני אריות ושני נשרים, ומכוונים אחד כנגד אחד"; the pairs of
    //    five steps (ox-lion, wolf-lamb, leopard-kid, bear-deer, eagle-bird); "תנין של כסף היה טוען גלגל של כסא"; "ויונה של זהב היתה עומדת
    //    בין העמודים ופותחת לו הארון"; "והארי של שמאל פושט ידו ונוטל העטרה".
    // The three midrashic versions share (group throneMidrash): the cog-wheels of the mechanism at the steps' sides ("חוזר הגלגל בתוך
    // המגנון" - Abba Gorion; "חוזר גלגל של מנגנון" - Panim Acherim), the ark with the Torah scroll on the seat-place beside the seat (the brief,
    // L.78; "ופתחא ארונא ונסבא סיפרא דאורייתא" - Targum Sheni; "ופותחת לו הארון" - Beit HaMidrash), the silver dragon in the mechanism, the two
    // seats beside the throne and the seventy golden seats of the elders (ONE instanced set).
    // The ascent (FIXES L.78, the user: "תן כפתור מצגת מיוחד המציג את עליית המלך (ללא המלך עצמו) לכסא... ובסוף כולל הבאת ס"ת לתוך חיקו")
    // and the witnesses' scene (L.79, Targum Sheni "הוו מנגניא פקעין גלגילא חזרין תורין געיין אריותא נהמין...") are timelines evaluated
    // in ONE ctx.animated hook (no per-frame allocation): each version has its own script of tracks and captions (ctx.shared.throne.script).
    // Every size, form and place is a model choice. Layout (world): the body x 97..109, z 612.5..617.1, 3 high on the plank floor (YT = the
    // floor's top, Y + 0.25); the six steps x 98..108, tread 1.4, rise 0.5, z 617.1..625.5; the round seat-place r 1.75 at z 614.7; the
    // seat (top YT + 4.45), the back with its round head (top YT + 6.3), the arm-staves, the footstool and, before the first step, the
    // golden ramp (Metzudat David on II Chr 9:18 "קודם שעשו על המעלות היה עשוי כבש מזהב"; Metzudat Zion "עשוי כעין גשר משופע").
    let thrAPI = null;   // the throne's versions / ascent / witnesses API; the pills and ctx.shared.throne (section 12) use it
    const thrInfoLabels = [];   // the labels of the base and of "pesukim": they carry their own explanation (l.info, set with the notes in section 12)
    try {
      // 1.0.1-L (Part 7, P4): within this block g is the moved group and every position is in its frame; the labels add the offset
      const g = thG, lbl = thLbl;
      const SW = 10, ST = 1.4, SR = 0.5, BD = 4.6, BW = 12;
      const bZ0 = kZ0 + 3, bZ1 = bZ0 + BD;           // the body: z 612.5 .. 617.1
      const zF = bZ1 + 6 * ST;                        // the front edge of the first step: z 625.5
      const YT = Y + 0.25, top = YT + 6 * SR;         // the floor's top; the body's top = the sixth step's top (YT + 3)
      const stepY = (k) => YT + k * SR, stepZ = (k) => zF - (k - 0.5) * ST;   // the top and the tread's middle of step k (1..6)
      // ---- materials of the versions (model choices) ----
      const silver = new MeshStandardMaterial({ color: 0xE8EBF0, metalness: 0.45, roughness: 0.32, emissive: 0x3a3d44, emissiveIntensity: 0.6 });   // "תנין של כסף" (at higher metalness it read black in the closed hall)
      const ivory = new MeshStandardMaterial({ color: 0xF2EADB, roughness: 0.55 });                         // "טווסין של שן"
      const marble = new MeshStandardMaterial({ color: 0xE9E3D8, roughness: 0.6 });                         // "עמודים של שיש"
      const linen = new MeshStandardMaterial({ color: 0xF7F3EA, roughness: 0.9 });                          // "בגדי שש לבן"
      const frondMat = new MeshStandardMaterial({ color: 0x4F8034, roughness: 0.9, emissive: 0x20361A, emissiveIntensity: 0.9 });   // 1.0.1-L: with the plain leaf green their undersides read black
      const spiceMat = new PointsMaterial({ map: pal_spiceTex(), color: 0xFFE9A8, size: 0.2, transparent: true, opacity: 0.95, depthWrite: false, alphaTest: 0.05 });   // round golden grains (bare points read as white squares)
      const hiMat = new MeshBasicMaterial({ color: 0xFFE27A, transparent: true, opacity: 0.55, depthWrite: false });
      const gemMats = {
        pearl: new MeshStandardMaterial({ color: 0xF2EEE4, roughness: 0.22, metalness: 0.05 }),
        emerald: new MeshStandardMaterial({ color: 0x1E8C55, roughness: 0.18, metalness: 0.1, emissive: 0x0B3D24, emissiveIntensity: 0.6 }),
        carbuncle: new MeshStandardMaterial({ color: 0xB3152E, roughness: 0.18, metalness: 0.1, emissive: 0x420812, emissiveIntensity: 0.6 }),
        beryl: new MeshStandardMaterial({ color: 0x3FB8AF, roughness: 0.2, metalness: 0.1, emissive: 0x0E3A38, emissiveIntensity: 0.5 }),
        saffron: new MeshStandardMaterial({ color: 0xE2A72E, roughness: 0.25, metalness: 0.1, emissive: 0x4A3208, emissiveIntensity: 0.5 }),
        glass: new MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.8, emissive: 0xCFE2F2, emissiveIntensity: 0.55 })   // 1.0.1-L: clear and pale (plain, over the gold it read as dull grey)
      };
      // ---- the base of every version ----
      H.box(g, BW, top - YT, BD, gold, X, YT, (bZ0 + bZ1) / 2).name = "throneBody";
      for (let k = 1; k <= 6; k++) H.box(g, SW, k * SR, ST, gold, X, YT, stepZ(k)).name = "throneStep";
      const zD = bZ0 + 2.2, DR = 1.75, DH = 0.6;      // the round seat-place (Rashi): centre z 614.7
      const drum = new Mesh(new CylinderGeometry(DR, DR, DH, 40), gold);
      drum.position.set(X, top + DH / 2, zD);
      drum.castShadow = drum.receiveShadow = true;
      drum.name = "throneSeatPlace";
      g.add(drum);
      const sTop = top + DH + 0.85;                   // the seat's top, YT + 4.45
      H.box(g, 1.9, 0.85, 1.3, gold, X, top + DH, zD + 0.1).name = "throneSeat";
      // the back, its head round (Malbim above; Targum Jonathan on 10:19 "וריש סגלגל לכורסיא מאחרוהי"; Ralbag "והיה ראש עגול בלוח ההוא"):
      // 1.9 wide, 0.9 straight and a half round of 0.95 above, 0.22 thick, behind the seat
      const bs = new Shape();
      bs.moveTo(-0.95, 0);
      bs.lineTo(0.95, 0);
      bs.lineTo(0.95, 0.9);
      bs.absarc(0, 0.9, 0.95, 0, Math.PI, false);
      bs.lineTo(-0.95, 0);
      const back = new Mesh(new ExtrudeGeometry(bs, { depth: 0.22, bevelEnabled: false, curveSegments: 16 }), gold);
      back.position.set(X, sTop, zD + 0.1 - 0.65 - 0.22);   // its front face at z 614.15, against the seat's back
      back.castShadow = true;
      back.name = "throneBack";
      g.add(back);
      const backTop = sTop + 0.9 + 0.95;              // the round head's top, YT + 6.3
      // the arms (Rashi "כמין מקלות זהב מפאה לפאה, פשוטין לימין ולשמאל"; Metzudat David "כעין זרועות, יצא אצל מקום הישיבה להשען בהם") - a
      // golden staff on each side at elbow height on a post, a knob at its front - and the footstool (Malbim on II Chr 9:17), merged
      const fit = pal_fig();
      for (const s of [-1, 1]) {
        fit.rod(0.07, 0.07, X + s * 1.05, sTop + 0.6, zD - 0.55, X + s * 1.05, sTop + 0.6, zD + 0.8, 10)
          .ell(0.11, 0.11, 0.11, X + s * 1.05, sTop + 0.6, zD + 0.85, 0, 0, 0, 10, 7)
          .rod(0.06, 0.06, X + s * 1.05, sTop - 0.85, zD + 0.7, X + s * 1.05, sTop + 0.6, zD + 0.7, 8);
      }
      fit.box(1.3, 0.3, 0.6, X, top + DH + 0.15, zD + 1.3);   // the footstool (Malbim on II Chr 9:17 "שהיה הדום הרגל ג"כ מזהב")
      const fitMesh = new Mesh(fit.geo(), gold);
      fitMesh.castShadow = true;
      fitMesh.name = "throneFittings";
      g.add(fitMesh);
      // 1.0.1-L (L.57, II Chr 9:18 "וכבש בזהב לכסא מאחזים" with its commentators): Rashi there explains only the steps and the arms; Metzudat
      // David "קודם שעשו על המעלות היה עשוי כבש מזהב ודרך בו עלה המעלות לשבת על הכסא", Metzudat Zion "וכבש. עשוי כעין גשר משופע" - a golden
      // ramp before the first step; Malbim reads the footstool (above), Ralbag the plating that joins the steps to the throne ("נאחזות לכסא
      // בזהב"). Built after Metzudat David: a low golden wedge RW wide and RL long rising from the floor to the first step's top (its size: model
      // choice); the first riser's gems behind it are left out
      const RW = 6, RL = 3;
      const rs = new Shape();
      rs.moveTo(0, 0);
      rs.lineTo(0, SR);
      rs.lineTo(RL, 0);
      rs.closePath();
      const rampGeo = new ExtrudeGeometry(rs, { depth: RW, bevelEnabled: false, curveSegments: 1 });
      rampGeo.rotateY(-HP);                           // the shape's x (the slope) along world +z, the extrusion along world -x
      rampGeo.translate(X + RW / 2, YT, zF);          // the high edge against the first step's front (z 625.5), the toe at z 628.5
      const ramp = new Mesh(rampGeo, gold);
      ramp.castShadow = ramp.receiveShadow = true;
      ramp.name = "throneRamp";
      g.add(ramp);
      lbl("כסא שלמה", X, Y + 9.5, zD, 2.5);

      // ---- the version groups (ctx.layers.throne<Key>; labels with layers ["palace", "throne<Key>"]) and the shared midrash group ----
      const VKEYS = ["pesukim", "targumSheni", "estherRabbah", "beitHamidrash"];
      const VNAMES = { pesukim: "הפסוקים ומפרשיהם", targumSheni: "תרגום שני לאסתר", estherRabbah: "אסתר רבה, פנים אחרים ואבא גוריון", beitHamidrash: "בית המדרש ב" };
      const LAYER = { pesukim: "thronePesukim", targumSheni: "throneTargumSheni", estherRabbah: "throneEstherRabbah", beitHamidrash: "throneBeitHamidrash" };
      const VG = {};
      for (const k of VKEYS) {
        const grp = new Group();
        grp.name = "throne_" + k;
        grp.visible = k === "pesukim";
        g.add(grp);
        ctx.layers[LAYER[k]] = grp;
        VG[k] = grp;
      }
      const midr = new Group();
      midr.name = "throneMidrash";
      midr.visible = false;
      g.add(midr);
      ctx.layers.throneMidrash = midr;
      const tlbl = (key, text, x, y, z, size = 2.2) => {
        const l = { text, x: x + THDX, y, z: z + THDZ, size, layers: ["palace", key === "midrash" ? "throneMidrash" : LAYER[key]] };
        palLabels.push(l);
        ctx.labels.push(l);
      };
      // ---- figure geometries (made once, on first use, shared by the versions) and the placing helpers ----
      const geoCache = {};
      const once = (key, make) => geoCache[key] || (geoCache[key] = make());
      const gLion = (paw) => once("lion" + paw, () => pal_lionStandGeo(0, paw));     // paw +1 / -1: that foreleg left out, a moving limb supplies it
      const beastGeo = (kind) => once("beast_" + kind, () => pal_beastGeo(kind));
      const put = (grp, geo, mat, x, y, z, ry, s, name) => {
        const m = new Mesh(geo, mat);
        m.position.set(x, y, z);
        m.rotation.y = ry;
        m.scale.setScalar(s);
        m.castShadow = true;
        m.name = name;
        grp.add(m);
        return m;
      };
      // a moving limb (a paw, a wing): a child of the figure's own mesh at its joint, so it follows every move and turn of the body; the
      // inner Group's quaternion slides between the rest pose and the stretched pose, set(u) with u 0 (rest) .. 1 (stretched)
      const V_A = new Vector3(), V_B = new Vector3();
      const mkLimb = (body, geo, mat, pivot, dirBuilt, dirRest, dirOut, name) => {
        const joint = new Group();
        joint.position.set(pivot[0], pivot[1], pivot[2]);
        const inner = new Group();
        const m = new Mesh(geo, mat);
        m.castShadow = true;
        m.name = name;
        // 1.0.1-L (A27, the user: "ידים עד אמצע הכסא, צריך שהמלך ישען עליהם"): between inner and the mesh a chain turn - stretch along the limb's own axis - turn back, so reach() can lengthen it
        const axis = new Vector3(dirBuilt[0], dirBuilt[1], dirBuilt[2]).normalize();
        const toX = new Group(), st = new Group(), back = new Group();
        back.quaternion.setFromUnitVectors(axis, V_B.set(1, 0, 0));   // Part 7: the mesh is turned first (its axis onto x), stretched, turned back; the other way round only a limb perpendicular to x stretched true
        toX.quaternion.copy(back.quaternion).invert();
        inner.add(toX);
        toX.add(st);
        st.add(back);
        back.add(m);
        joint.add(inner);
        body.add(joint);
        let LEN = 0.01;
        { const pa = geo.attributes.position; for (let i = 0; i < pa.count; i++) LEN = Math.max(LEN, pa.getX(i) * axis.x + pa.getY(i) * axis.y + pa.getZ(i) * axis.z); }
        const qT = new Quaternion(), vT = new Vector3();
        const qRest = new Quaternion().setFromUnitVectors(V_A.set(...dirBuilt).normalize(), V_B.set(...dirRest).normalize());
        const qOut = new Quaternion().setFromUnitVectors(V_A.set(...dirBuilt).normalize(), V_B.set(...dirOut).normalize());
        inner.quaternion.copy(qRest);
        const part = { inner, u: 0, LEN, mesh: m, set: (u) => { part.u = u; st.scale.x = 1; inner.quaternion.slerpQuaternions(qRest, qOut, u); },
          // reach(u, x, y, z): u 0 = at rest, u 1 = the limb's tip exactly at the world point (x, y, z); the figure itself does not move (allocates nothing)
          reach: (u, wx, wy, wz) => {
            const c = Math.cos(body.rotation.y), sn = Math.sin(body.rotation.y), sc = body.scale.x, dx = wx - body.position.x, dz = wz - body.position.z;
            vT.set((dx * c - dz * sn) / sc - pivot[0], (wy - body.position.y) / sc - pivot[1], (dx * sn + dz * c) / sc - pivot[2]);
            const len = vT.length();
            qT.setFromUnitVectors(axis, vT.multiplyScalar(1 / len));
            inner.quaternion.copy(qRest).slerp(qT, u);
            st.scale.x = 1 + (len / LEN - 1) * u;
            part.u = u;
          } };
        return part;
      };
      // a lion standing at (x, y, z), turned ry, scale s. paw = +1 / -1: that forepaw is a moving limb, a leg at rest and stretched to the side
      // (+z of the figure = its right); tabMat: instead it holds an inscribed tablet before its chest and raises it (Beit HaMidrash)
      const lionAt = (grp, x, y, z, ry, s, paw = 0, tabMat = null, name = "lion") => {
        const body = put(grp, gLion(paw), gold, x, y, z, ry, s, name);
        const fig = { body, paw: null, home: [x, y, z], ry };
        if (paw) {
          const out = [0.30, 0.20, paw * 0.42];
          fig.paw = mkLimb(body, once("paw" + paw, () => pal_lionPawGeo(paw)), gold, [0.32, 0.62, paw * 0.13], out, [0.04, -0.5, 0], out, name + "Paw");
        }
        if (tabMat) {
          // 1.0.1-L (the user: "הצגת האיסורים צריכה להיות מובלטת וגדולה יותר"): a plate 2.6 x 1.7 that the lion raises over its head, facing the hall, while the king reads; small before its chest at rest
          const tb = new Group();
          const plate = new Mesh(once("tabletPlate", () => new BoxGeometry(2.6, 1.7, 0.08)), gold);
          plate.castShadow = true;
          plate.name = "lionTablet";
          const pl = new Mesh(once("tabletPlane", () => new PlaneGeometry(2.42, 1.59)), tabMat);
          pl.position.z = 0.05;
          pl.name = "lionTabletText";
          tb.add(plate, pl);
          grp.add(tb);
          const rest = [x, y + 0.5, z + 0.62], up = [x, y + 2.4, z + 0.7];
          tb.position.set(rest[0], rest[1], rest[2]);
          tb.scale.setScalar(0.2);
          fig.tablet = { set: (v) => { tb.position.set(rest[0] + (up[0] - rest[0]) * v, rest[1] + (up[1] - rest[1]) * v, rest[2] + (up[2] - rest[2]) * v); tb.scale.setScalar(0.2 + 0.8 * v); }, hand: [up[0], up[1] - 0.8, up[2]], group: tb };
        }
        return fig;
      };
      // an eagle standing at (x, y, z), turned ry, scale s: both wings are moving limbs, raised at rest and spread level when stretched
      const eagleAt = (grp, x, y, z, ry, s, name = "eagle") => {
        const body = put(grp, once("eagleBody", () => pal_eagleGeo(0, 2)), gold, x, y, z, ry, s, name);
        const wing = (side) => {
          const out = [0, Math.cos(1.3), side * Math.sin(1.3)];
          return mkLimb(body, once("wing" + side, () => pal_eagleWingGeo(side)), gold, [-0.04, 0.62, side * 0.12], out, [0, Math.cos(0.72), side * Math.sin(0.72)], out, name + "Wing");
        };
        return { body, R: wing(1), L: wing(-1), home: [x, y, z], ry };
      };
      // the lying pairs on the steps: the first named on the right (east), facing west; the second on the left, facing east (model choice)
      const pairsAt = (grp, PAIRS) => {
        const out = [];
        PAIRS.forEach(([e, w], i) => {
          const k = i + 1;
          out.push(put(grp, beastGeo(e), gold, X + 2.05, stepY(k), stepZ(k), Math.PI, 1, "beast_" + e), put(grp, beastGeo(w), gold, X - 2.05, stepY(k), stepZ(k), 0, 1, "beast_" + w));
        });
        return out;
      };
      // precious stones on the risers (the first riser's behind the ramp left out): nine a riser, the palette's materials in turn
      const gemsAt = (grp, palette) => {
        const lists = palette.map(() => []);
        for (let k = 1; k <= 6; k++) for (let i = 0; i < 9; i++) {
          if (k === 1 && Math.abs(i - 4) < RW / 2 + 0.2) continue;
          lists[(i + k) % palette.length].push({ x: X - 4 + i, y: YT + (k - 0.5) * SR, z: zF - (k - 1) * ST, sz: 0.45 });
        }
        const gemGeo = once("gem", () => new SphereGeometry(0.12, 8, 5));
        lists.forEach((list, ci) => { if (list.length) pal_instanced(grp, gemGeo, gemMats[palette[ci]], list, false).name = "throneGems"; });
      };
      // two marble pillars on two lions' heads, h high, r 0.2, with a golden capital (model choice); returns the capital's top
      const pillarsAt = (grp, dx, z, y0, h) => {
        const geo = new CylinderGeometry(0.2, 0.24, h, 12);
        geo.translate(0, h / 2, 0);
        const cap = new CylinderGeometry(0.34, 0.26, 0.18, 12);
        cap.translate(0, h + 0.09, 0);
        for (const s of [-1, 1]) {
          put(grp, geo, marble, X + s * dx, y0, z, 0, 1, "thronePillar");
          put(grp, cap, gold, X + s * dx, y0, z, 0, 1, "thronePillarCap");
        }
        return y0 + h + 0.18;
      };
      // two palm trees beside the steps, their trunks wrapped in white linen, an ivory peacock on each facing the throne, its eagles' wings
      // (Panim Acherim "ואילני תמרים היו מקיפין לכסא, מכוסין בבגדי שש לבן, ועל ראשיהם טווסין של שן מכוונים כנגד גפי נשרים"; Beit HaMidrash
      // "ואילני תמרים מיפות את הכסא ומרוקמים בבגדי שש, והיו טווסין של שן מכוונים כנגד כנפי נשרים"; two of them and their place: model choice)
      const palmsAt = (grp, d) => {
        const pg = once("palm", () => pal_palmGeos());
        const lin = once("palmLinen", () => { const c = new CylinderGeometry(0.21, 0.25, 2.3, 10); c.translate(0.02, 1.25, 0); return c; });
        d.peacocks = [];
        for (const s of [-1, 1]) {
          const px = X + s * 7.4, pz = 621.5;
          put(grp, pg.trunk, M.cedar, px, YT, pz, 0, 1, "thronePalm");
          put(grp, pg.fronds, frondMat, px, YT, pz, 0, 1, "thronePalmFronds");
          put(grp, lin, linen, px, YT, pz, 0, 1, "thronePalmLinen");
          d.peacocks.push(put(grp, beastGeo("peacock"), ivory, px + 0.08, YT + 3.3, pz, s > 0 ? Math.PI : 0, 1.1, "thronePeacock"));
        }
      };
      const backZ = zD + 0.1 - 0.65 - 0.11;           // the middle of the back's thickness, z 614.04
      const zHead = zD + 0.1;                         // over the seat: the place of a seated head, z 614.8
      // 1.0.1-L (A27 "the eagles' wings meet over the seat"): twelve eagles in three rows of four, spread, each wing's tip on its neighbour's (half-span EW at scale 0.85; two tips meet at the very middle)
      const EW = 0.806, canopy = (rows, y) => { const o = []; for (const dz of rows) for (const n of [-3, -1, 1, 3]) o.push([X + n * EW, y, zHead + dz]); return o; };
      const slot = (a, rx, rz, y) => [X + rx * Math.cos(a), y, zHead + rz * Math.sin(a)];   // a place on a ring over the head (a from the east toward the hall)

      // ---- the shared midrash parts ----
      // the cog-wheels of the mechanism ("חוזר הגלגל בתוך המגנון" - Abba Gorion; "חוזר גלגל של מנגנון" - Panim Acherim): one a step a side, beside
      // the step's end at its front edge, each on a short axle from the step, facing the hall so it reads as a toothed wheel (model choice)
      const gearGeo = pal_gearGeo(0.4, 10, 0.12);
      const gearY = (k) => stepY(k) + 0.05, gearZ = (k) => zF - (k - 1) * ST - 0.3, GEAR_X = SW / 2 + 0.56;
      const gears = [];   // [k][side] side 0 = west, 1 = east
      const axles = pal_fig();
      for (let k = 1; k <= 6; k++) {
        gears.push([put(midr, gearGeo, gold, X - GEAR_X, gearY(k), gearZ(k), 0, 1, "throneGear"), put(midr, gearGeo, gold, X + GEAR_X, gearY(k), gearZ(k), 0, 1, "throneGear")]);
        for (const s of [-1, 1]) axles.rod(0.05, 0.05, X + s * (SW / 2 - 0.02), gearY(k), gearZ(k), X + s * GEAR_X, gearY(k), gearZ(k), 6);
      }
      put(midr, axles.geo(), gold, 0, 0, 0, 0, 1, "throneGearAxles");
      // the ark with the Torah scroll, open box and hinged lid, on the round seat-place at the seat's right hand (west), beside the seat as the
      // brief (L.78) asks, so it is in the frame of both throne views (Targum Sheni "ופתחא ארונא ונסבא סיפרא דאורייתא"; Panim Acherim "ופותחת
      // הארון ולוקחת ס"ת"; Beit HaMidrash "ופותחת לו הארון ונוטלת ספר תורה"; its size and place: model choice)
      const ARK = { x: X - 1.4, y: top + DH, z: zD, w: 0.66, h: 0.4, d: 0.44 };
      {
        const a = pal_fig(), W2 = ARK.w / 2, D2 = ARK.d / 2;
        a.box(ARK.w, 0.04, ARK.d, 0, 0.02, 0).box(ARK.w, ARK.h, 0.04, 0, ARK.h / 2, -D2 + 0.02).box(ARK.w, ARK.h, 0.04, 0, ARK.h / 2, D2 - 0.02).box(0.04, ARK.h, ARK.d, -W2 + 0.02, ARK.h / 2, 0).box(0.04, ARK.h, ARK.d, W2 - 0.02, ARK.h / 2, 0);
        put(midr, a.geo(), gold, ARK.x, ARK.y, ARK.z, 0, 1, "throneArk");
      }
      const lid = new Group();
      lid.position.set(ARK.x, ARK.y + ARK.h, ARK.z - ARK.d / 2);
      const lidMesh = new Mesh(new BoxGeometry(ARK.w + 0.04, 0.05, ARK.d + 0.04), gold);
      lidMesh.position.set(0, 0.025, ARK.d / 2);
      lidMesh.castShadow = true;
      lidMesh.name = "throneArkLid";
      lid.add(lidMesh);
      midr.add(lid);
      const scroll = new Group();
      {
        const sg = pal_scrollGeos();
        scroll.add(new Mesh(sg.rollers, vesselGold), new Mesh(sg.parchment, linen));
        scroll.scale.setScalar(1.05);
      }
      scroll.name = "throneScroll";
      midr.add(scroll);
      const SCR_HOME = [ARK.x, ARK.y + 0.13, ARK.z], SCR_LAP = [X, sTop + 0.075, zD + 0.35];   // in the ark; on the seat, the king's lap ("לתוך חיקו"; "על ברכיו"; "בידוי")
      scroll.position.set(SCR_HOME[0], SCR_HOME[1], SCR_HOME[2]);
      // the silver dragon in the mechanism ("ותנינא דכספא חד במכונוי"; "תנין של כסף היה טוען גלגל של כסא"), on the body's top at its east end,
      // with its wheel before it (model choice)
      const dragon = put(midr, pal_dragonGeo(), silver, X + 4.7, top, 613.3, Math.PI, 1, "throneDragon");   // across the body's back, its head toward the seat (end-on, facing the hall, it read as a pipe)
      const dragonGear = put(midr, gearGeo, silver, X + 5.2, top + 0.55, 615.2, 0, 1, "throneDragonGear");
      // the seats (על פי המדרש): two beside the throne (Targum Sheni "חד לכהנא רבא וחד לסגן כהניא"; Beit HaMidrash "אחת לגד הנביא ואחת
      // לנתן הנביא") and seventy for the elders, 35 a side in two rows along the hall facing its middle - ONE instanced set for every version
      const chairGeo = pal_chairGeo();
      const seats = [];
      for (const s of [-1, 1]) {
        for (let i = 0; i < 18; i++) seats.push({ x: X + s * 14.5, y: Y + 0.25, z: 616.2 + i * 1.15, ry: s < 0 ? 0 : Math.PI });
        for (let i = 0; i < 17; i++) seats.push({ x: X + s * 17.5, y: Y + 0.25, z: 616.775 + i * 1.15, ry: s < 0 ? 0 : Math.PI });
      }
      for (const s of [-1, 1]) seats.push({ x: X + s * 8, y: Y + 0.25, z: bZ1 + 1.2, ry: -HP, s: 1.3 });
      pal_instanced(midr, chairGeo, gold, seats).name = "throneSeats";
      // the active step's glow (one mesh moved by the timeline; model choice) and the spice sprays
      const hi = new Mesh(new BoxGeometry(SW + 0.2, 0.03, ST), hiMat);
      hi.visible = false;
      hi.position.set(X, stepY(1) + 0.02, stepZ(1));
      hi.name = "throneStepGlow";
      midr.add(hi);
      // 1.0.1-L (Part 7, P1, the user: "צללית דווקא נשמע מאוד טוב"): what climbs is a SILHOUETTE: one translucent robed figure, no face, no features, the feet covered by the robe, about 3.9 amot tall (model choice), hidden unless an ascent runs.
      // It slides up the middle of the steps tread by tread with a small bob (no walking rig), leans on the stretched paw and wing at HAND_Y above the tread, and is seated at the top; origin: standing, the tread under it; seated, the seat's top
      const silMat = new MeshBasicMaterial({ color: 0x2A1F45, transparent: true, opacity: 0.52, depthWrite: false });
      const silS = pal_fig(), silH = pal_fig();
      silS.rod(0.72, 0.36, 0, 0, 0, 0, 3.05, 0, 20).ell(0.46, 0.2, 0.3, 0, 3.0, 0, 0, 0, 0, 14, 8).ell(0.29, 0.36, 0.3, 0, 3.48, 0, 0, 0, 0, 14, 10);
      for (const e of [-1, 1]) silS.rod(0.13, 0.11, e * 0.42, 2.95, 0, e * 0.62, 1.6, 0.06, 8);
      silH.rod(0.62, 0.34, 0, 0, 0, 0, 1.75, 0, 18).ell(0.44, 0.2, 0.3, 0, 1.72, 0, 0, 0, 0, 14, 8).ell(0.28, 0.34, 0.28, 0, 2.06, 0.02, 0, 0, 0, 14, 10);
      for (const e of [-1, 1]) silH.rod(0.2, 0.17, e * 0.26, 0.28, 0.05, e * 0.26, 0.28, 1.0, 10).rod(0.17, 0.2, e * 0.26, 0.28, 1.0, e * 0.26, -0.55, 1.12, 10).rod(0.12, 0.1, e * 0.42, 1.68, 0, e * 0.36, 0.72, 0.72, 8);
      const sil = new Group();
      sil.name = "throneClimber";
      const silStand = new Mesh(silS.geo(), silMat), silSeat = new Mesh(silH.geo(), silMat);
      silStand.name = "throneSilhouette"; silSeat.name = "throneSilhouetteSeated";
      silStand.renderOrder = silSeat.renderOrder = 5;
      silSeat.visible = false;
      sil.add(silStand, silSeat);
      sil.visible = false;
      midr.add(sil);
      const FOOT_Z = 0.2, HAND_Y = 1.5, silAt = (k) => [X, stepY(k), stepZ(k) + FOOT_Z], handAt = (k) => [X, stepY(k) + HAND_Y, stepZ(k) + FOOT_Z];   // the hand: the very middle of the step, where he stands
      const silStart = [X, YT + 0.25, zF + 1.2], silFront = [X, top + DH, zD + 1.25], silSeated = [X, sTop, zHead];
      // the scroll's end per version: on the knees or in the hands
      const SCR_KNEES = [X, sTop + 0.52, zHead + 0.72], SCR_HANDS = [X, sTop + 0.82, zHead + 0.74];
      const mkSpray = (grp, n, x, y, z, dx, dz) => {
        const geo = new BufferGeometry();
        const pos = new Float32Array(n * 3);
        geo.setAttribute("position", new BufferAttribute(pos, 3));
        const pts = new Points(geo, spiceMat);
        pts.visible = false;
        pts.frustumCulled = false;
        pts.name = "throneSpices";
        grp.add(pts);
        const seed = new Float32Array(n * 3), phase = new Float32Array(n);
        for (let i = 0; i < n; i++) { seed[3 * i] = hash(i * 1.7) - 0.5; seed[3 * i + 1] = 0.6 + 0.4 * hash(i * 2.3); seed[3 * i + 2] = hash(i * 3.1) - 0.5; phase[i] = hash(i * 5.3); }
        const sp = { pts, n };
        sp.tick = (t) => {
          for (let i = 0; i < n; i++) {
            const tau = (t * 0.9 + phase[i]) % 1;
            pos[3 * i] = x + (dx * 1.6 + seed[3 * i] * 0.8) * tau;
            pos[3 * i + 1] = y + seed[3 * i + 1] * 2.4 * tau * (1 - tau) - 0.66 * tau;   // up and down again, ending just above the ground under the mouth
            pos[3 * i + 2] = z + (dz * 1.6 + seed[3 * i + 2] * 0.8) * tau;
          }
          geo.attributes.position.needsUpdate = true;
        };
        return sp;
      };

      // ---- version "pesukim": the base, 12 lions on the steps (10:20, six a side) and 2 by the arms, all facing the hall (Ralbag) ----
      const Vd = { pesukim: {}, targumSheni: {}, estherRabbah: {}, beitHamidrash: {} };   // per version: the movable figures and parts
      {
        const items = [];
        for (let k = 1; k <= 6; k++) for (const e of [-1, 1]) items.push({ x: X + e * 3.9, y: stepY(k), z: stepZ(k), ry: -HP, s: 0.72 });
        for (const e of [-1, 1]) items.push({ x: X + e * 2.75, y: top, z: zD + 0.5, ry: -HP, s: 0.72 });
        pal_instanced(VG.pesukim, gLion(0), gold, items).name = "lion";
      }
      // ---- the timelines: tracks {a, b, f(u, t)} evaluated in one hook, in order; on one object they stand in the order of their times; f(0) is
      // the phase's rest, f(1) its end; a reset runs the f(0)s backward, so the earliest track of an object has the last word ----
      const EASE = (u) => u * u * (3 - 2 * u);
      const anim = { running: false, mode: null, t0: 0, tracks: null, states: null, dur: 0, frozenAt: 0, lastT: 0 };
      const evalAt = (tracks, states, t) => {
        for (let i = 0; i < tracks.length; i++) {
          const tr = tracks[i];
          if (t < tr.a) { if (states[i] !== 0) { tr.f(0, t); states[i] = 0; } }
          else if (t >= tr.b) { if (states[i] !== 2) { tr.f(1, t); states[i] = 2; } }
          else { tr.f(EASE((t - tr.a) / (tr.b - tr.a)), t); states[i] = 1; }
        }
      };
      const resetTracks = (tracks, states) => { for (let i = tracks.length - 1; i >= 0; i--) { tracks[i].f(0, 0); states[i] = 0; } };
      const T = { // track factories (closures over preallocated values; nothing is allocated when they run)
        gear(k, a, b, turns = 2) { const gl = gears[k - 1][0], gr = gears[k - 1][1]; return { a, b, f: (u) => { gl.rotation.z = u * turns * 2 * Math.PI; gr.rotation.z = -u * turns * 2 * Math.PI; } }; },
        allGears(a, b, turns = 3) { return { a, b, f: (u) => { for (let k = 0; k < 6; k++) { gears[k][0].rotation.z = u * turns * 2 * Math.PI; gears[k][1].rotation.z = -u * turns * 2 * Math.PI; } } }; },
        glow(k, a, b) { const y = stepY(k) + 0.02, z = stepZ(k); return { a, b, f: (u) => { hi.position.set(X, y, z); hi.visible = u > 0 && u < 1; } }; },
        pulse(part, a, b) { return { a, b, f: (u) => part.set(Math.sin(Math.PI * u)) }; },              // out and back within the phase
        curve(part, a, b, v0, v1) { return { a, b, f: (u) => part.set(v0 + (v1 - v0) * u) }; },           // from one pose to another
        move(obj, p0, p1, a, b, arc = 0) { return { a, b, f: (u) => obj.position.set(p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u + arc * 4 * u * (1 - u), p0[2] + (p1[2] - p0[2]) * u) }; },
        turn(obj, r0, r1, a, b) { const TAU = 2 * Math.PI, d = (((r1 - r0 + Math.PI) % TAU) + TAU) % TAU - Math.PI; return { a, b, f: (u) => { obj.rotation.y = r0 + d * u; } }; },   // the short way round
        rock(obj, ax, amp, freq, a, b) { return { a, b, f: (u, t) => { obj.rotation[ax] = u > 0 && u < 1 ? amp * Math.sin(t * freq) : 0; } }; },
        bob(obj, y0, amp, freq, a, b) { return { a, b, f: (u, t) => { obj.position.y = y0 + (u > 0 && u < 1 ? amp * (0.5 + 0.5 * Math.sin(t * freq)) : 0); } }; },
        flap(part, a, b, freq = 14) { return { a, b, f: (u, t) => part.set(u > 0 && u < 1 ? 0.5 + 0.5 * Math.sin(t * freq) : 0) }; },
        spin(obj, a, b, turns) { return { a, b, f: (u) => { obj.rotation.z = u * turns * 2 * Math.PI; } }; },
        lid(a, b, open) { return { a, b, f: (u) => { lid.rotation.x = -1.7 * (open ? u : 1 - u); } }; },
        reachTo(part, a, b, p) { return { a, b, f: (u) => part.reach(u, p[0], p[1], p[2]) }; },        // the limb goes out to the world point p
        reachBack(part, a, b, p) { return { a, b, f: (u) => part.reach(1 - u, p[0], p[1], p[2]) }; },  // and returns
        follow(part, obj, dy, a, b) { return { a, b, f: () => part.reach(1, obj.position.x, obj.position.y + dy, obj.position.z) }; },   // stays on a moving object
        tablet(fig, a, b, up) { return { a, b, f: (u) => fig.tablet.set(up ? u : 1 - u) }; },
        silOn(a, b) { return { a, b, f: (u) => { sil.visible = u > 0 && u < 1; } }; },
        // from the front of the seat onto it: f(0) leaves the position to the climb's moves
        sit(a, b) { return { a, b, f: (u) => { silSeat.visible = u > 0; silStand.visible = !(u > 0); if (u > 0) sil.position.set(silFront[0] + (silSeated[0] - silFront[0]) * u, silFront[1] + (silSeated[1] - silFront[1]) * u, silFront[2] + (silSeated[2] - silFront[2]) * u); } }; },
        spray(sp, a, b) { return { a, b, f: (u, t) => { if (u > 0 && u < 1) { sp.pts.visible = true; sp.tick(t); } else sp.pts.visible = false; } }; }
      };
      // the dove brings the scroll: from its place to over the ark, the lid opens, it comes down, carries the scroll to the seat and flies back;
      // at the script's end the scroll returns to the ark and the lid closes (the times: t0 start, the whole about 10 s; tEnd the closing)
      const doveScroll = (tr, dove, home, t0, tEnd, arc, P = SCR_LAP) => {
        const over = [ARK.x, ARK.y + 1.05, ARK.z], low = [SCR_HOME[0], SCR_HOME[1] + 0.32, SCR_HOME[2]], lap = [P[0], P[1] + 0.32, P[2]];
        const carry = { a: t0 + 4, b: t0 + 6.5, f: (u) => {
          const x = SCR_HOME[0] + (P[0] - SCR_HOME[0]) * u, y = SCR_HOME[1] + (P[1] - SCR_HOME[1]) * u + 0.9 * 4 * u * (1 - u), z = SCR_HOME[2] + (P[2] - SCR_HOME[2]) * u;
          dove.position.set(x, y + 0.32, z);
          scroll.position.set(x, y, z);
        } };
        tr.push(T.move(dove, home, over, t0, t0 + 2.5, arc), T.lid(t0 + 2.5, t0 + 3.5, true), T.move(dove, over, low, t0 + 3.5, t0 + 4), carry, T.move(dove, lap, home, t0 + 7.5, t0 + 10, arc * 0.6));
        tr.push(T.move(scroll, P, SCR_HOME, tEnd - 1.6, tEnd - 0.5, 0.6), T.lid(tEnd - 0.5, tEnd, false));
      };
      // a figure flies to a place and spreads its wings (an eagle), turning to face the hall; back to its own place and pose
      const flyOut = (tr, fig, p0, p1, a, b, arc = 0.8) => {
        tr.push(T.move(fig.body, p0, p1, a, b, arc));
        if (fig.ry !== -HP && p0 === fig.home) tr.push(T.turn(fig.body, fig.ry, -HP, a, b));
        if (fig.R && p0 === fig.home) tr.push(T.curve(fig.R, a, a + 0.8, 0, 1), T.curve(fig.L, a, a + 0.8, 0, 1));
      };
      const flyBack = (tr, fig, p0, a, b) => {
        tr.push(T.move(fig.body, p0, fig.home, a, b, 0.5));
        if (fig.ry !== -HP) tr.push(T.turn(fig.body, -HP, fig.ry, a, b));
        if (fig.R) tr.push(T.curve(fig.R, b - 0.6, b, 1, 0), T.curve(fig.L, b - 0.6, b, 1, 0));
      };
      // the witnesses' scene of a version: every wheel turns, the dragon rocks, the lions rock, the eagles lift and beat their wings, the
      // lying creatures and the peacocks stir (the sources speak of voices: "קול" is shown as movement; model choice)
      const witnessTracks = (d) => {
        const w = [T.allGears(0, 7, 4), T.rock(dragon, "z", 0.2, 22, 0, 7), T.spin(dragonGear, 0, 7, 4)];
        for (const key of ["lions", "armLions", "hollowLions", "pillarLions"]) if (d[key]) for (const f of d[key]) w.push(T.rock(f.body, "x", 0.16, 17, 0, 7));
        for (const e of d.eagles) w.push(T.bob(e.body, e.home[1], 0.2, 13, 0, 7), T.flap(e.R, 0, 7, 15), T.flap(e.L, 0, 7, 15));
        if (d.beasts) for (const m of d.beasts) w.push(T.rock(m, "x", 0.14, 11, 0, 7));
        if (d.peacocks) for (const m of d.peacocks) w.push(T.rock(m, "x", 0.2, 12, 0, 7));
        return w;
      };
      const SCRIPTS = {};
      // ---- the labels of the versions: short, in two columns on the wall behind the throne, off the figures and off the throne's two views (a label
      // standing by what it names, nearer the camera, took half the frame); the sources are in the UI's texts. Pushed now, as data for the UI ----
      // 1.0.1-L: z 613.8, the west column a little further out and the east one a little in: a sprite turns to the camera, and at z 613 the far end of a long label went behind
      // the wall (its face at z 612.5) in the throneSteps view; the west column's row 3 ran under the pill; the east column's long labels must stay inside that view's frame
      const LX = 9.2, LXW = 10.6, ROW = [top + 5.35, top + 4.4, top + 3.45, top + 2.45, top + 1.45], LZ = 613.8, LS = 1.2;
      const col = (key, side, row, text) => tlbl(key, text, X + side * (side < 0 ? LXW : LX), ROW[row], LZ, LS);
      lbl("״וכבש בזהב״ — הכבש שלפני המעלות (דברי הימים ב ט, יח)", X - LXW, ROW[4], LZ, LS);
      col("pesukim", 1, 0, "״ושנים עשר אריים עמדים שם״ (מלכים א י, כ)");
      col("pesukim", 1, 1, "״ושנים אריות עמדים אצל הידות״ (י, יט)");
      col("pesukim", -1, 0, "״מקום עגל״ — מושב המלך (רש״י)");
      col("pesukim", -1, 1, "״וראש עגל לכסה מאחריו״ — גב עגול בראשו (מלבי״ם)");
      col("pesukim", -1, 2, "״וידת מזה ומזה״ — הידות (רש״י)");
      thrInfoLabels.push(...palLabels.slice(-6));
      col("midrash", 1, 4, "גלגלי המנגנון");
      col("midrash", 1, 3, "התנין של כסף");
      col("midrash", -1, 3, "הארון וספר התורה");
      tlbl("midrash", "שבעים כסאות הזקנים", X - 16, Y + 4.5, 626, 1.4);
      col("targumSheni", -1, 0, "המנורה ושבעת קניה מכל צד");
      col("targumSheni", -1, 1, "היונה האוחזת נשר");
      col("targumSheni", -1, 2, "כסאות הכהן הגדול והסגן");
      col("targumSheni", 1, 0, "עשרים וארבע גפני הזהב");
      col("targumSheni", 1, 1, "הנשר הגדול והכתר");
      col("targumSheni", 1, 2, "אריה מול נשר (תרגום שני)");
      col("estherRabbah", -1, 0, "השרביט, היונה והעטרה — ״נוגע ואינו נוגע״");
      col("estherRabbah", -1, 1, "עמודי השיש וגפני הזהב");
      col("estherRabbah", -1, 2, "כסאות הכהן הגדול והסגן");
      col("estherRabbah", 1, 0, "״והארי פושט לו יד, ובשניה נשר פושט לו יד״");
      col("estherRabbah", 1, 1, "האריות החלולים המזלפים בשמים");
      col("estherRabbah", 1, 2, "אילני התמרים וטווסי השן");
      col("beitHamidrash", -1, 0, "עמודי השיש על ראשי האריות");
      col("beitHamidrash", -1, 1, "אילני התמרים וטווסי השן");
      col("beitHamidrash", -1, 2, "כסאות גד הנביא ונתן הנביא");   // 1.0.1-L: the source's words here, "אחת לגד הנביא ואחת לנתן הנביא" ("גד החוזה" is Abba Gorion's)
      col("beitHamidrash", 1, 0, "לוחות הכתב בידי האריות");
      col("beitHamidrash", 1, 1, "העטרה — ״והארי של שמאל פושט ידו״");
      col("beitHamidrash", 1, 2, "כלי הבשמים");
      // the captions of every version's ascent and witnesses' scene (static data for ctx.shared.throne.script / witnessScript), the
      // midrash's words as each thing happens - letter for letter the library's (Targum Sheni in Aramaic, the user's Hebrew beside it)
      const CAP = {
        targumSheni: [
          { t: 0, text: "״ומשים ית ריגלא על דרגא קדמיתא תורא דדהבא. פשיט ידיה על דרגא תיניינא״ (תרגום שני לאסתר א, ב) — וכשהיה מניח את רגלו על המדרגה הראשונה, שור הזהב היה מרים אותו למדרגה השנייה" },
          { t: 2, text: "״והוון אריותא זחלין בוסמנין במסקיה מלכא שלמה למיתב על כורסיה״ — והיו האריות מזלפים בשמים בעלייתו של המלך שלמה לשבת על כסאו" },
          { t: 4, text: "״ומן תיניינא לתליתאה״ — ומהשנייה לשלישית" },
          { t: 8, text: "״מן תליתאה לרביעיתא״ — מהשלישית לרביעית" },
          { t: 12, text: "״ומן רביעיתא לחמישיתא״ — מהרביעית לחמישית" },
          { t: 16, text: "״ומן חמישיתא לשתיתאה״ — ומהחמישית לשישית" },
          { t: 24, text: "״ומן שתיתאה נחתין נשרין וחטפין יתיה ומסקין ומותבין יתיה על ריש כורסייה״ — ומהשישית היו יורדים נשרים וחוטפים אותו, מעלים ומושיבים אותו על ראש הכסא" },
          { t: 30, text: "״הוה הדר גישרא רבא ונטיב כיסרא דמלכותא ויהיב ית כיסרא ברישיה דמלכא שלמה״ — היה חוזר הנשר הגדול ונוטל את כתר המלכות ומניח אותו על ראשו של המלך שלמה" },
          { t: 35.5, text: "״ומבתר כן הוה תנינא רבא מפקע במנגנון״ — ולאחר מכן היה התנין הגדול מרעיש במנגנון" },
          { t: 37.5, text: "״והוון אריוון ונשרין סלקין במנגנון ומטללין על ריש מלכא שלמה״ — האריות והנשרים היו עולים במנגנון ומצלים על ראשו של המלך" },
          { t: 41, text: "״ויונא דדהבא הוה נחתא מן עמודא ופתחא ארונא ונסבא סיפרא דאורייתא ויהבה ליה בידוי דמלכא שלמה״ — ויונת הזהב הייתה יורדת מן העמוד, פותחת את הארון ונוטלת ספר תורה, ונותנת אותו בידיו של המלך שלמה" },
          { t: 49, text: "״למקיימא מה דאמר משה ותהי עימיה ויהא קרי ביה כל יומי חיוהי בדיל דיסגון יומי חיוהי על מלכותיה הוא ובנוהי ביני ישראל״" }
        ],
        estherRabbah: [
          { t: 0, text: "״עלה במעלה הראשונה והארי פושט לו יד״ (אסתר רבה א, יב); ״ארי פושט ידו על ימין, הנשר פושט ידו על שמאל, והמלך נשען עליהם ועולה״ (פנים אחרים); ״עלה במעלה ראשונה, הכרוז מכריז ואומר לו (דברים יז, יז): לא ירבה לו נשים״ (אסתר רבה)" },
          { t: 6, text: "״ובשניה נשר פושט לו יד״ (אסתר רבה א, יב); ״והנשר פושט גפו של ימין, והארי ידו של שמאל, והמלך נשען עליהם ועולה״ (מדרש אבא גוריון); ״בשניה מכריז (דברים יז, טז): לא ירבה לו סוסים״" },
          { t: 12, text: "״כך היה עושה על כל מעלה ומעלה״ (פנים אחרים); ״בשלישית מכריז (דברים יז, יז): וכסף וזהב לא ירבה לו״ (אסתר רבה)" },
          { t: 18, text: "״ברביעית לא תטה משפט״ (אסתר רבה)" },
          { t: 24, text: "״בחמישית לא תכיר פנים״ (אסתר רבה)" },
          { t: 30, text: "״בששית לא תקח שחד״ (אסתר רבה); ״ושני אריות של זהב חלולים... מלאים כל מיני בשמים, שהיו זולפים בשמים, כשהיה המלך שלמה עולה״ (פנים אחרים)" },
          { t: 36, text: "״אל מקום השבת, כך מקבלין אותו, ובמקום השבת שרביט הזהב מאחוריו, ויונה נתונה בראשו ועטרה של זהב בפיה, כדי שיהא המלך יושב בשבת ועטרה של זהב נוגע ואינו נוגע״ (אסתר רבה א, יב); ״וכשהיה עולה לראש הכסא, הנשרים פורשים גפיהם, ועולים במנגנין, והיו מכסין למעלה על ראשו של מלך״ (פנים אחרים)" },
          { t: 39, text: "״ויונה של זהב יורדת מן העמוד במנגנין, ופותחת הארון ולוקחת ס\"ת, ונותנת לתוך ידו של מלך״ (פנים אחרים)" },
          { t: 47, text: "״לקיים מה שנאמר והיתה עמו וקרא בו כל ימי חייו״ (פנים אחרים)" }
        ],
        beitHamidrash: [
          { t: 0, text: "״כיון שהמלך שלמה דורס לעלות במעלה ראשונה, היו אריות שבו פורשות למעלה ידיהם וכתב מורשם בידיהם, ולא היה עולה במעלה שניה עד שהיה קורא הכתובים שהיו מורשמין״ (בית המדרש ב)" },
          { t: 1.5, text: "״כשהמלך הופך פניו לצד ימינו היה רואה את הכתב שהיה ביד הארי של ימין, ומה כתוב בו, לא תכירו פנים במשפט (דברים א, יז), והופך פניו לצד שמאלו והיה כתוב בו לא תקח שוחד (שם טז, יט). וכן בכל האריות היה כתוב בהן מענינים אלו של משפט, כגון ודל לא תהדר בריבו (שמות כג, ג) וכיוצא בו״" },
          { t: 4, text: "״נותן רגלו על מעלה ראשונה, והיה הגלגל חוזר, והארי פושט ידו של ימין והנשר כנפו של שמאל והמלך נשען עליהן״; ״על מעלה ראשונה אומר, תורת ה' תמימה״" },
          { t: 7, text: "״ועל מעלה שניה הגלגל חוזר, והנשר פושט כנפו של ימין וארי פושט ידו של שמאל והמלך נשען עליהן ועולה למעלה שלישית, וכן כולן״; ״בשניה עדות ה' נאמנה״" },
          { t: 14, text: "״בשלישית פקודי ה' ישרים״" },
          { t: 21, text: "״ברביעית מצות ה' ברה״" },
          { t: 28, text: "״בחמישית יראת ה' טהורה״" },
          { t: 35, text: "״בששית משפטי ה' אמת (תהלים יט, ח - י), ואחר כך יושב המלך שלמה״" },
          { t: 42, text: "״וכשעלה כל המעלות תנין של כסף היה טוען גלגל של כסא וכופין למלך שלמה ומושיבין אותו על הכסא״" },
          { t: 45, text: "״ומיד פושטין הנשרים את כנפיהם ועולין בגלגל של כסא, והיו מוסבין למעלה מראשו״" },
          { t: 48, text: "״ויונה של זהב היתה עומדת בין העמודים ופותחת לו הארון ונוטלת ספר תורה ונותנה אותו על ברכיו, לקיים מה שנאמר (דברים יז, יט) והיתה עמו וקרא בו כל ימי חייו״" },
          { t: 57, text: "״והארי של שמאל פושט ידו ונוטל העטרה ונותנה על ראש המלך״" },
          { t: 61, text: "״והעומדים אומרים, תקום מלכות בית דוד לעולם״" }
        ]
      };
      const WCAP = {
        targumSheni: [
          { t: 0, text: "״וכד הוון עלין סהדיא דיסהדון קדם מלכא שלמה הוו מנגניא פקעין גלגילא חזרין תורין געיין אריותא נהמין דיבין חטפין אימרין פעיין גימרין בעדן יונקין בכיין שונרין טייסן טווסיין מייללין תרנוגלין מקרקרין בני נצין מחטפין ציפרין מייללין למחטף לבהון דסהדיא דלא יסהדון סהדותא דשיקרא״ (תרגום שני לאסתר א, ב)" },
          { t: 4, text: "״והוון סהדיא אמרין בלבהון נסהד סהדות דקושטא ואי לא בגינן עלמא מתעקר״ — והיו העדים אומרים בליבם: נעיד עדות אמת, ואם לא — בגללנו העולם ייחרב" }
        ],
        estherRabbah: [
          { t: 0, text: "״וכשמעלים את העד לפני שלמה, היו מנגנות פוקעים, גלגלות חוזרים, אריות נוהמין, נשרים פורחין, טווסין רצין, ולמה לחטוף לבם של עדים, בשביל שיעידו אמת״ (מדרש פנים אחרים נוסח ב)" }
        ],
        beitHamidrash: [
          { t: 0, text: "״וכשהם מביאין את העדים להעיד לפני המלך, היו הגלגלים של כסא חוזרין, ואריות נוהמין, ונשרים פורחין, וטווסין מצפצפין, וכל כך למה, כדי לחטוף את העדים בלבם כדי להעיד אמת״ (בית המדרש ב)" }
        ]
      };
      // -- the verses only: no mechanism, no ascent (the pills are not shown in this version) --
      SCRIPTS.pesukim = { duration: 0, tracks: [], states: new Int8Array(0), captions: [], witnesses: { duration: 0, tracks: [], states: new Int8Array(0), captions: [] } };
      // the three midrashic versions are built on FIRST USE (load speed, FIXES K 0.6); ensure(key) builds one once; a version that fails to build
      // (a warning) stays empty and plays nothing
      const VBUILD = {}, built = { pesukim: true };
      VBUILD.targumSheni = () => {
        // ---- version "targumSheni" (Targum Sheni on Esther 1:2) ----
        const d = Vd.targumSheni, grp = VG.targumSheni;
        // 12 lions at the steps' ends and 12 eagles before them, each lion facing its eagle: "אריא לקבל נשרא ונשרא לקבל אריא מכוונין אילין
        // לקביל אילין" (each pair turned 40 degrees toward the hall, so the figures show their breadth from the hall: model choice)
        const TURN = 0.7;
        d.lions = []; d.eagles = [];
        for (let k = 1; k <= 6; k++) for (const e of [-1, 1]) {
          d.lions.push(lionAt(grp, X + e * 4.5, stepY(k), stepZ(k), e > 0 ? Math.PI + TURN : -TURN, 0.7, -e));   // 1.0.1-L (Part 7, P2): the forepaw on the hall's side is a moving limb, as in the other versions
          d.eagles.push(eagleAt(grp, X + e * 3.55, stepY(k), stepZ(k), e > 0 ? -TURN : Math.PI + TURN, 0.85));
        }
        d.armLions = [-1, 1].map((e) => lionAt(grp, X + e * 2.75, top, zD + 0.5, -HP, 0.72));
        d.beasts = pairsAt(grp, [["ox", "lion"], ["wolf", "lamb"], ["leopard", "kid"], ["eagle", "peacock"], ["cat", "rooster"], ["eagle", "bird"]]);   // 1.0.1-L (A25, "נשר"): the sixth pair's "בר נצא" as the Hebrew translation: an eagle
        gemsAt(grp, ["pearl", "emerald", "carbuncle", "beryl"]);
        // on the throne's head the menorah (seven branches a side, the bowl, the basin, the two sheaves) and on its base the dove holding the
        // young hawk ("ועל ריש כורסיא קיימא יונה דדהבא אחידא בר נצא בידה"; "ויונא דדהבא הוה נחתא מן עמודא" - the menorah's stem is read as the
        // pillar: model choice); the twenty-four golden vines as a vault over the seat, open at the front; the crown on a stand and the great
        // eagle, which takes it to the king's head ("הוה הדר גישרא רבא ונטיב כיסרא דמלכותא ויהיב ית כיסרא ברישיה דמלכא שלמה")
        put(grp, pal_menorahGeo(), gold, X, backTop - 0.05, backZ, 0, 0.8, "throneMenorah");   // top 1.1 under the name "כסא שלמה", under the vines' ridge
        d.doveHome = [X, backTop + 0.1, backZ + 0.2];
        d.dove = put(grp, beastGeo("dove"), gold, d.doveHome[0], d.doveHome[1], d.doveHome[2], -HP, 0.9, "throneDove");
        // 1.0.1-L: the bird in its hand is a child of the dove, so it goes where the dove goes ("אחידא בר נצא בידה"; an eagle, as the Hebrew translation "האוחזת נשר בידה"; A25)
        { const held = new Mesh(beastGeo("eagle"), gold); held.position.set(0.3, -0.02, 0); held.scale.setScalar(0.35); held.castShadow = true; held.name = "throneHeldEagle"; d.dove.add(held); }
        put(grp, pal_vineVaultGeo(24, 3.3, 613.1, 616.7, 5.4), gold, X, top, 0, 0, 1, "throneVines");
        d.greatEagle = eagleAt(grp, X + 1.9, top, 613.1, -HP, 1.2, "throneGreatEagle");
        d.crownHome = [X + 1.9, top, 613.75]; d.crownHead = [X, sTop + 2.4, zHead];   // 1.0.1-L: at the great eagle's feet, no stand (the midrash has none); on the head's very place (throne.head)
        d.crown = put(grp, pal_crownGeo(), vesselGold, d.crownHome[0], d.crownHome[1], d.crownHome[2], 0, 1, "throneCrown");
        const sprW = mkSpray(grp, 50, X - 2.75, top + 0.63, 615.75, 0.35, 1), sprE = mkSpray(grp, 50, X + 2.75, top + 0.63, 615.75, -0.35, 1);

        // -- the ascent, 1.0.1-L (Part 7, P2, the user: "עשית שם שטויות"), line by line against the midrash (the library's 3237:15): "ומשים ית ריגלא על דרגא קדמיתא תורא דדהבא. פשיט ידיה על דרגא תיניינא": he stands on the first step and the golden ox, lying
        // there, stretches its foreleg to him, to the very middle, and raises him to the second, staying where it lies; "ומן תיניינא לתליתאה מן תליתאה לרביעיתא ומן רביעיתא לחמישיתא ומן חמישיתא לשתיתאה": the midrash names no other agent, and the leg of one ox across six steps
        // would be absurd, so on each further step (model choice, stated in the report) that step's lion and eagle, each on its own place, stretch paw and wing to the middle and raise him. No animal leaves its step in the climb. No wheels here (this midrash has none in the climb); the spices while he goes up ("במסקיה... למיתב על כורסיה") --
        const tr = [], SP = 4, tSeize = 6 * SP;
        const ox = d.beasts[0], oxLeg = mkLimb(ox, once("oxLeg", () => pal_oxLegGeo()), gold, [0.28, 0.06, 0.138], [1, 0, 0], [1, -0.05, 0], [1, 0, 0], "oxLeg");
        d.oxLeg = oxLeg;
        tr.push(T.silOn(0, 1e6), T.move(sil, silStart, silAt(1), 0, 0.9, 0.2));
        for (let k = 1; k <= 6; k++) tr.push(T.glow(k, (k - 1) * SP, k * SP));
        for (let k = 1; k <= 6; k++) {
          const a = (k - 1) * SP, h = handAt(k), next = k < 6 ? handAt(k + 1) : h, li = (k - 1) * 2, oddE = k % 2 === 1;
          // step k's limbs: step 1 the ox; then the lion on one side and the eagle on the other, by turns; the eagle's wing is the one on the hall's side
          const parts = k === 1 ? [oxLeg] : [d.lions[li + (oddE ? 1 : 0)].paw, oddE ? d.eagles[li].L : d.eagles[li + 1].R];
          for (const p of parts) {
            tr.push(T.reachTo(p, a + 0.9, a + 3, h));
            if (k < 6) tr.push(T.follow(p, sil, HAND_Y, a + 4, a + 5.2), T.reachBack(p, a + 5.2, a + 6, next));
            else tr.push(T.reachBack(p, tSeize, tSeize + 1.2, h));
          }
          if (k < 6) tr.push(T.move(sil, silAt(k), silAt(k + 1), a + 4, a + 5.2, 0.3));
        }
        // "ומן שתיתאה נחתין נשרין וחטפין יתיה ומסקין ומותבין יתיה על ריש כורסייה": the midrash's own words: two eagles come to his shoulders on the sixth step, tip to tip, and carry him to the seat; he sits
        const E6W = d.eagles[10], E6E = d.eagles[11], yGrip = stepY(6) + 2.15, zGrip = stepZ(6) + FOOT_Z;
        const gripW = [X - EW, yGrip, zGrip], gripE = [X + EW, yGrip, zGrip], seatW = [X - EW, sTop + 1.6, zD + 1.25], seatE = [X + EW, sTop + 1.6, zD + 1.25];
        flyOut(tr, E6W, E6W.home, gripW, tSeize + 1.2, tSeize + 2.6, 1.0);
        flyOut(tr, E6E, E6E.home, gripE, tSeize + 1.2, tSeize + 2.6, 1.0);
        tr.push(T.move(sil, silAt(6), silFront, tSeize + 2.8, tSeize + 4.2, 0.5), T.move(E6W.body, gripW, seatW, tSeize + 2.8, tSeize + 4.2, 0.5), T.move(E6E.body, gripE, seatE, tSeize + 2.8, tSeize + 4.2, 0.5), T.sit(tSeize + 4.2, tSeize + 5.2));
        // "הוה הדר גישרא רבא ונטיב כיסרא דמלכותא ויהיב ית כיסרא ברישיה דמלכא שלמה": the great eagle takes the crown and sets it on the place of the head, then returns
        const GE = d.greatEagle, t0 = tSeize + 6, GEc = [d.crownHome[0], d.crownHome[1] + 0.22, d.crownHome[2]], GEh = [d.crownHead[0], d.crownHead[1] + 0.22, d.crownHead[2] - 0.05];
        tr.push(T.curve(GE.R, t0, t0 + 0.7, 0, 1), T.curve(GE.L, t0, t0 + 0.7, 0, 1), T.move(GE.body, GE.home, GEc, t0, t0 + 1, 0.5), T.move(GE.body, GEc, GEh, t0 + 1, t0 + 3.5, 1.2), T.move(d.crown, d.crownHome, d.crownHead, t0 + 1, t0 + 3.5, 1.2), T.move(GE.body, GEh, GE.home, t0 + 3.5, t0 + 5.5, 1.0), T.curve(GE.R, t0 + 4.5, t0 + 5.5, 1, 0), T.curve(GE.L, t0 + 4.5, t0 + 5.5, 1, 0));
        // "ומבתר כן הוה תנינא רבא מפקע במנגנון"
        const tD = t0 + 5.5, tR = tD + 2, tDove = tR + 3.5, tBack = tDove + 10.5;
        tr.push(T.rock(dragon, "z", 0.22, 20, tD, tR), T.spin(dragonGear, tD, tR, 3), T.allGears(tD, tDove, 4));
        // "והוון אריוון ונשרין סלקין במנגנון ומטללין על ריש מלכא שלמה": ALL the lions and eagles of the steps (the midrash names no few): the eagles in three rows under the vines, wing tip to wing tip, the lions on a half ring before them
        const yR = sTop + 2.95, eS = canopy([0.05, 0.9, 1.75], yR), lS = d.lions.map((l, i) => slot(Math.PI * (i + 0.5) / 12, 4.8, 3.6, yR));
        d.eagles.forEach((e, i) => { if (e === E6W || e === E6E) tr.push(T.move(e.body, e === E6W ? seatW : seatE, eS[i], tR, tDove)); else flyOut(tr, e, e.home, eS[i], tR, tDove); });
        d.lions.forEach((l, i) => flyOut(tr, l, l.home, lS[i], tR, tDove));
        doveScroll(tr, d.dove, d.doveHome, tDove, tBack + 2.1, 0.6, SCR_HANDS);   // "ויהבה ליה בידוי"; "ויונא דדהבא הוה נחתא מן עמודא ופתחא ארונא ונסבא סיפרא דאורייתא ויהבה ליה בידוי דמלכא שלמה"
        tr.push(T.spray(sprW, 0.5, tSeize + 5.2), T.spray(sprE, 0.5, tSeize + 5.2));   // "והוון אריותא זחלין בוסמנין במסקיה מלכא שלמה למיתב על כורסיה": until he sits, and not after
        d.eagles.forEach((e, i) => flyBack(tr, e, eS[i], tBack, tBack + 2));
        d.lions.forEach((l, i) => flyBack(tr, l, lS[i], tBack, tBack + 2));
        tr.push(T.move(d.crown, d.crownHead, d.crownHome, tBack, tBack + 2, 0.8));
        SCRIPTS.targumSheni = { duration: tBack + 2.5, tracks: tr, states: new Int8Array(tr.length), captions: CAP.targumSheni };
        const w = witnessTracks(d);   // "וכד הוון עלין סהדיא דיסהדון קדם מלכא שלמה הוו מנגניא פקעין גלגילא חזרין תורין געיין אריותא נהמין..."
        SCRIPTS.targumSheni.witnesses = { duration: 7, tracks: w, states: new Int8Array(w.length), captions: WCAP.targumSheni };
      };
      VBUILD.estherRabbah = () => {
        // ---- version "estherRabbah" (Esther Rabbah 1:12, Panim Acherim נוסח ב, Abba Gorion) ----
        const d = Vd.estherRabbah, grp = VG.estherRabbah;
        // on every step two lions and two eagles ("ועל כל דרך ודרך שני אריות ושני נשרים עומדים על רגליהם, זה כנגד זה" - Abba Gorion), all facing the
        // hall: on the odd steps a lion on the right (east) inside and an eagle on the left inside, on the even steps the other way; the inner two
        // stretch their right paw / left wing, or right wing / left paw, toward the one who climbs. No lying pairs in these midrashim's text of
        // the throne's description here, so the figures stand nearer the way up (model choice)
        d.lions = []; d.eagles = []; d.stepParts = [null];
        const IN = 2.6, OUT = 3.6;
        for (let k = 1; k <= 6; k++) {
          const odd = k % 2 === 1, sp = {};
          for (const e of [-1, 1]) {
            const innerIsLion = odd ? e > 0 : e < 0;
            if (innerIsLion) {
              const li = lionAt(grp, X + e * IN, stepY(k), stepZ(k), -HP, 0.7, e);
              d.lions.push(li); sp.paw = li.paw;
              d.eagles.push(eagleAt(grp, X + e * OUT, stepY(k), stepZ(k), -HP, 0.85));
            } else {
              const eg = eagleAt(grp, X + e * IN, stepY(k), stepZ(k), -HP, 0.85);
              d.eagles.push(eg); sp.wing = e > 0 ? eg.R : eg.L;
              d.lions.push(lionAt(grp, X + e * OUT, stepY(k), stepZ(k), -HP, 0.7));
            }
          }
          d.stepParts.push(sp);
        }
        d.armLions = [-1, 1].map((e) => lionAt(grp, X + e * 2.75, top, zD + 0.5, -HP, 0.72));
        gemsAt(grp, ["pearl", "emerald", "carbuncle", "glass"]);   // "לבנות ירקרקות ואדמדמות, ויש בהם בזכוכית טובה קריסטאלי" (Panim Acherim)
        // the sceptre behind the seat with the dove on its end and the crown hanging from its beak over the place of the head: "ובמקום השבת
        // שרביט הזהב מאחוריו, ויונה נתונה בראשו ועטרה של זהב בפיה, כדי שיהא המלך יושב בשבת ועטרה של זהב נוגע ואינו נוגע" - they stay there
        // 1.0.1-L: the crown stays at the height of the head, on a short link under the beak, and the sceptre's end with the dove stands above it (level with it, the crown hid the dove from the hall)
        // 1.0.1-L (A27): the crown on the very place of the head (throne.head, y sTop + 2.4, z zHead)
        const crY = sTop + 2.4, scY = crY + 0.2, scZ = zD - 0.95, dvZ = zD - 0.32;
        const sc = pal_fig();
        sc.rod(0.07, 0.07, X, top + DH, scZ, X, scY, scZ, 10).rod(0.06, 0.06, X, scY, scZ, X, scY, dvZ + 0.06, 10).ell(0.09, 0.09, 0.09, X, scY, scZ, 0, 0, 0, 8, 6);
        sc.rod(0.014, 0.014, X, scY + 0.3, dvZ + 0.232, X, crY + 0.16, dvZ + 0.232, 5);   // the link from the beak's tip (the dove's scale 1: y 0.245, x 0.232) to the crown's rim
        put(grp, sc.geo(), gold, 0, 0, 0, 0, 1, "throneSceptre");
        put(grp, beastGeo("dove"), gold, X, scY + 0.06, dvZ, -HP, 1, "throneSceptreDove");
        put(grp, pal_crownGeo(), vesselGold, X, crY, dvZ + 0.42, 0, 1, "throneCrown");
        // Panim Acherim: "ושני אריות של זהב היו עומדים על מעלה ראשונה, ושני עמודים של שיש היו עומדים על ראש האריות, ושני גפנים של זהב עומדות משני צדי
        // הכסא, ומצילות על ראשי העמודים, ושני אריות של זהב חלולים היו עומדות כנגד הראשון, והיו מלאים כל מיני בשמים, שהיו זולפים בשמים, כשהיה המלך שלמה
        // עולה": two lions of their own at the first step's ends with the pillars on their heads, two vines from the body's sides over the capitals,
        // the two hollow lions on the floor beside the first step, sprinkling; on the west capital the dove that comes down "מן העמוד"
        const PX = 4.6, PZ = stepZ(1), PY = stepY(1) + 1.17 * 0.7;
        d.pillarLions = [-1, 1].map((e) => lionAt(grp, X + e * PX, stepY(1), PZ, -HP, 0.7));
        const pTop = pillarsAt(grp, PX, PZ, PY, 3.2);
        for (const s of [-1, 1]) put(grp, pal_vineArcGeo([s * 5.75, 0, 616.5 - zD], [s * 6.3, pTop - top + 2.0, 620.5 - zD], [s * PX, pTop - top + 0.8, PZ - zD]), gold, X, top, zD, 0, 1, "throneVine");
        d.hollowLions = [-1, 1].map((e) => lionAt(grp, X + e * 7, YT, zF - 1, -HP, 0.8));
        const sprW = mkSpray(grp, 50, X - 7, YT + 0.72, zF - 0.3, 0.45, 1), sprE = mkSpray(grp, 50, X + 7, YT + 0.72, zF - 0.3, -0.45, 1);
        palmsAt(grp, d);
        d.doveHome = [X - PX, pTop, PZ];
        d.dove = put(grp, beastGeo("dove"), gold, d.doveHome[0], d.doveHome[1], d.doveHome[2], -HP, 1, "throneDove");

        // -- the ascent, 1.0.1-L (the user: "צריך להיות יותר איטית הושטת הידים (זכור! ידים עד אמצע הכסא, צריך שהמלך ישען עליהם)"): 6 s a step: the foot on the step, the wheel, the paw and the wing go out slowly, 2.6 s, to the very middle where
        // the foot stands, and stay 1.2 s while he leans ("והמלך נשען עליהם"), and return; no figure leaves its place in the climb --
        const tr = [], SP = 6, tTop = 6 * SP;
        tr.push(T.silOn(0, 1e6));
        for (let k = 1; k <= 6; k++) {
          const a = (k - 1) * SP, sp = d.stepParts[k], h = handAt(k);
          // 1.0.1-L (the user: "הידים ... צריכות להיות לפני עליית הצללית ולא לאחריה"): the wheel and the limbs first, then the climb on them
          tr.push(T.gear(k, a, a + 2.1), T.glow(k, a, a + SP), T.move(sil, k === 1 ? silStart : silAt(k - 1), silAt(k), a + 2.8, a + 3.8, 0.3));
          tr.push(T.reachTo(sp.paw, a, a + 2.6, h), T.reachTo(sp.wing, a, a + 2.6, h), T.reachBack(sp.paw, a + 4.8, a + 6, h), T.reachBack(sp.wing, a + 4.8, a + 6, h));
        }
        // 1.0.1-L (the user: "כל הכרזת האיסורים, מה עם לא ירבה לו נשים"): the herald's words at each step, large, as Esther Rabbah 1:12 "עלה במעלה ראשונה, הכרוז מכריז ואומר לו"
        ["לא ירבה לו נשים", "לא ירבה לו סוסים", "וכסף וזהב לא ירבה לו", "לא תטה משפט", "לא תכיר פנים", "לא תקח שחד"].forEach((txt, i) => {
          const cv = document.createElement("canvas");
          cv.width = 1024;
          cv.height = 200;
          const c2 = cv.getContext("2d");
          c2.fillStyle = "rgba(20,14,6,0.86)";
          c2.fillRect(0, 0, 1024, 200);
          c2.strokeStyle = "#e6c766";
          c2.lineWidth = 6;
          c2.strokeRect(5, 5, 1014, 190);
          c2.fillStyle = "#f6e08a";
          c2.font = "bold 104px 'David','Frank Ruhl Libre','Times New Roman',serif";
          c2.textAlign = "center";
          c2.textBaseline = "middle";
          c2.direction = "rtl";
          c2.fillText(txt, 512, 104);
          const tex = new CanvasTexture(cv);
          tex.colorSpace = SRGBColorSpace;
          const board = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
          board.scale.set(8, 1.56, 1);
          const hp = handAt(i + 1);
          board.position.set(X, hp[1] + 3.1, hp[2]);
          board.renderOrder = 30;
          board.userData.noPick = true;
          board.visible = false;
          board.name = "throneHerald";
          grp.add(board);
          tr.push({ a: i * SP, b: (i + 1) * SP - 0.1, f: (u) => { board.visible = u > 0 && u < 1; } });
        });
        tr.push(T.move(sil, silAt(6), silFront, tTop, tTop + 1.2, 0.5), T.sit(tTop + 1.2, tTop + 2.2));
        tr.push(T.spray(sprW, 0.5, tTop + 0.5), T.spray(sprE, 0.5, tTop + 0.5));   // "שהיו זולפים בשמים, כשהיה המלך שלמה עולה"
        // "הנשרים פורשים גפיהם, ועולים במנגנין, והיו מכסין למעלה על ראשו של מלך": all the twelve, wing tip to wing tip over the seat (A27)
        const up = d.eagles, slots = canopy([-0.85, 0, 0.85], sTop + 3.15);
        up.forEach((e, i) => flyOut(tr, e, e.home, slots[i], tTop + 1, tTop + 3.5));
        doveScroll(tr, d.dove, d.doveHome, tTop + 3.5, tTop + 15.2, 1.2, SCR_HANDS);   // "ויונה של זהב יורדת מן העמוד במנגנין, ופותחת הארון ולוקחת ס"ת, ונותנת לתוך ידו של מלך"
        up.forEach((e, i) => flyBack(tr, e, slots[i], tTop + 13.5, tTop + 15));
        SCRIPTS.estherRabbah = { duration: 51.5, tracks: tr, states: new Int8Array(tr.length), captions: CAP.estherRabbah };
        const w = witnessTracks(d);   // "היו מנגנות פוקעים, גלגלות חוזרים, אריות נוהמין, נשרים פורחין, טווסין רצין"
        SCRIPTS.estherRabbah.witnesses = { duration: 7, tracks: w, states: new Int8Array(w.length), captions: WCAP.estherRabbah };
      };
      VBUILD.beitHamidrash = () => {
        // ---- version "beitHamidrash" (Jellinek's Beit HaMidrash II, "דמות כסא שלמה") ----
        const d = Vd.beitHamidrash, grp = VG.beitHamidrash;
        // exactly twelve lions ("ושנים עשר אריות יש בו, על כל מעלה ומעלה יש בו שני אריות"), at the steps' ends, each holding an inscribed tablet in the
        // paw toward the way up ("היו אריות שבו פורשות למעלה ידיהם וכתב מורשם בידיהם"): on the right "לא תכירו פנים במשפט", on the left "לא תקח שוחד"
        // and among them "ודל לא תהדר בריבו" ("וכן בכל האריות היה כתוב בהן מענינים אלו של משפט"; which verse on which step above the first: model
        // choice); inside them on every step an eagle, whose wing toward the way up is the one that stretches ("והארי פושט ידו של ימין והנשר כנפו של שמאל")
        const VERSES = ["לא תכירו פנים במשפט", "לא תקח שוחד", "ודל לא תהדר בריבו"];
        const tabMats = VERSES.map((v) => ((tx) => new MeshStandardMaterial({ map: tx, emissive: 0xffffff, emissiveMap: tx, emissiveIntensity: 0.55, roughness: 0.7 }))(pal_tabletTex(v)));
        d.lions = []; d.eagles = []; d.stepFigs = [null];
        for (let k = 1; k <= 6; k++) {
          const odd = k % 2 === 1;
          const lE = lionAt(grp, X + 4.5, stepY(k), stepZ(k), -HP, 0.7, 1, tabMats[odd ? 0 : 2]), lW = lionAt(grp, X - 4.5, stepY(k), stepZ(k), -HP, 0.7, -1, tabMats[odd ? 1 : 0]);
          const eE = eagleAt(grp, X + 3.55, stepY(k), stepZ(k) - 0.2, -HP, 0.85), eW = eagleAt(grp, X - 3.55, stepY(k), stepZ(k) - 0.2, -HP, 0.85);   // 1.0.1-L: 0.2 back, so the lion's long arm passes before the eagle
          d.lions.push(lW, lE); d.eagles.push(eW, eE);
          d.stepFigs.push({ lE, lW, wing: odd ? eW.L : eE.R });
        }
        // the two lions by the arms (the verse), and on their heads the two marble pillars ("ושני עמודים של שש על ראשי האריות" - no step is named here;
        // model choice), so the dove on the back's top stands between them ("ויונה של זהב היתה עומדת בין העמודים"); the left lion's paw takes the crown
        // from its stand ("והארי של שמאל פושט ידו ונוטל העטרה ונותנה על ראש המלך"; the king's left = the east as he faces the hall)
        const armL = lionAt(grp, X + 2.75, top, zD + 0.5, -HP, 0.72, -1);
        d.armLions = [lionAt(grp, X - 2.75, top, zD + 0.5, -HP, 0.72), armL];
        pillarsAt(grp, 2.75, zD + 0.5, top + 1.17 * 0.72, 2.9);
        d.crownHome = [X + 3.45, top + 0.75, 615.6]; d.crownHead = [X, sTop + 2.4, zHead];   // on a low stand within reach of the east arm lion's left paw (model choice)
        d.crown = put(grp, pal_crownGeo(), vesselGold, d.crownHome[0], d.crownHome[1], d.crownHome[2], 0, 1, "throneCrown");
        H.box(grp, 0.5, 0.75, 0.5, gold, X + 3.45, top, 615.6).name = "throneCrownStand";
        d.beasts = pairsAt(grp, [["ox", "lion"], ["wolf", "lamb"], ["leopard", "kid"], ["bear", "deer"], ["eagle", "bird"]]);
        gemsAt(grp, ["pearl", "saffron", "glass"]);
        palmsAt(grp, d);
        // "ושני אבנים של זהב היו על שני צידי הכסא, והיו מלאים מכל מיני בשמים": two golden vessels on the body's top (their form and place: model choice)
        const vg = once("spiceBowl", () => pal_vesselGeos().bowl);
        for (const s of [-1, 1]) put(grp, vg, vesselGold, X + s * 4.3, top, 616.3, 0, 1.4, "throneSpiceVessel");
        d.doveHome = [X, backTop, backZ];
        d.dove = put(grp, beastGeo("dove"), gold, d.doveHome[0], d.doveHome[1], d.doveHome[2], -HP, 1, "throneDove");
        // "ועל כל קתדרא וקתדרא שני אריות ושני נשרים, ומכוונים אחד כנגד אחד, ועומדין על רגליהן": two small lions on the arm-rests and two eagles on the back's top
        // of every chair of the seventy, facing each other (instanced, low-resolution solids; their size: model choice)
        const rotY = (lx, lz, ry) => [lx * Math.cos(ry) + lz * Math.sin(ry), -lx * Math.sin(ry) + lz * Math.cos(ry)];
        const ml = [], me = [];
        for (let i = 0; i < 70; i++) {
          const c = seats[i], cr = c.ry;
          for (const s of [-1, 1]) {
            const [lx, lz] = rotY(0.1, s * 0.42, cr), [ex, ez] = rotY(-0.4, s * 0.3, cr);
            ml.push({ x: c.x + lx, y: c.y + 1.19, z: c.z + lz, ry: cr - s * HP, s: 0.2 });
            me.push({ x: c.x + ex, y: c.y + 2.08, z: c.z + ez, ry: cr - s * HP, s: 0.2 });
          }
        }
        pal_instanced(grp, pal_lionStandGeo(0, 0, true), gold, ml, false).name = "throneChairLions";
        pal_instanced(grp, pal_eagleGeo(0, 0, true), gold, me, false).name = "throneChairEagles";

        // -- the ascent: before each step the two lions of that step raise their tablets and he reads; then the wheel turns, the lion on that step's
        // side stretches its paw to him and the eagle on the other side its wing ("והיה הגלגל חוזר, והארי פושט ידו של ימין והנשר כנפו של שמאל... ועל מעלה
        // שניה הגלגל חוזר, והנשר פושט כנפו של ימין וארי פושט ידו של שמאל") --
        // 1.0.1-L: 7 s a step: the foot comes to the step and the two lions raise their large plates over their heads, facing the hall, and hold them while he reads (2.2 s); the plates come down; then the wheel, and the paw and the wing go to the very middle
        const tr = [], SP = 7, tTop = 6 * SP;
        tr.push(T.silOn(0, 1e6));
        for (let k = 1; k <= 6; k++) {
          const a = (k - 1) * SP, f = d.stepFigs[k], odd = k % 2 === 1, D = odd ? f.lE : f.lW, h = handAt(k);
          tr.push(T.move(sil, k === 1 ? silStart : silAt(k - 1), silAt(k), a + 5.5, a + 6.4, 0.3), T.glow(k, a, a + SP));   // 1.0.1-L: the climb comes after the tablets and the limbs
          for (const l of [f.lE, f.lW]) tr.push(T.tablet(l, a, a + 1, true), T.reachTo(l.paw, a, a + 1, l.tablet.hand), T.tablet(l, a + 3.2, a + 4, false), T.reachBack(l.paw, a + 3.2, a + 4, l.tablet.hand));
          tr.push(T.gear(k, a + 4, a + 6), T.reachTo(D.paw, a + 4, a + 5.4, h), T.reachTo(f.wing, a + 4, a + 5.4, h), T.reachBack(D.paw, a + 6.4, a + 7, h), T.reachBack(f.wing, a + 6.4, a + 7, h));
        }
        tr.push(T.move(sil, silAt(6), silFront, tTop, tTop + 2, 0.5), T.sit(tTop + 2, tTop + 3), T.rock(dragon, "z", 0.22, 20, tTop, tTop + 3), T.spin(dragonGear, tTop, tTop + 3, 3));   // "תנין של כסף היה טוען גלגל של כסא וכופין למלך שלמה ומושיבין אותו על הכסא"
        // "ומיד פושטין הנשרים את כנפיהם ועולין בגלגל של כסא, והיו מוסבין למעלה מראשו": the twelve eagles, wing tip to wing tip over the seat (A27)
        const tE = tTop + 3, slots = canopy([-0.85, 0, 0.85], sTop + 3.15);
        d.eagles.forEach((e, i) => flyOut(tr, e, e.home, slots[i], tE, tE + 3));
        doveScroll(tr, d.dove, d.doveHome, tE + 3, tE + 19.7, 0.5, SCR_KNEES);   // "ופותחת לו הארון ונוטלת ספר תורה ונותנה אותו על ברכיו"
        // "והארי של שמאל פושט ידו ונוטל העטרה ונותנה על ראש המלך": his paw goes to the crown and carries it to the very place of the head (A27), then returns
        const tC = tE + 12, cH = [d.crownHome[0], d.crownHome[1] + 0.05, d.crownHome[2]], cT = [d.crownHead[0], d.crownHead[1] + 0.05, d.crownHead[2]];
        tr.push(T.reachTo(armL.paw, tC, tC + 1, cH), T.move(d.crown, d.crownHome, d.crownHead, tC + 1, tC + 3.5, 1.2), T.follow(armL.paw, d.crown, 0.05, tC + 1, tC + 3.5), T.reachBack(armL.paw, tC + 3.5, tC + 5, cT));
        d.eagles.forEach((e, i) => flyBack(tr, e, slots[i], tE + 18, tE + 19.5));
        tr.push(T.move(d.crown, d.crownHead, d.crownHome, tE + 18, tE + 19.5, 0.8));
        SCRIPTS.beitHamidrash = { duration: 65, tracks: tr, states: new Int8Array(tr.length), captions: CAP.beitHamidrash };
        const w = witnessTracks(d);   // "היו הגלגלים של כסא חוזרין, ואריות נוהמין, ונשרים פורחין, וטווסין מצפצפין"
        SCRIPTS.beitHamidrash.witnesses = { duration: 7, tracks: w, states: new Int8Array(w.length), captions: WCAP.beitHamidrash };
      };
      const ensure = (key) => {
        if (built[key]) return;
        built[key] = true;
        try {
          VBUILD[key]();
        } catch (e) {
          console.warn("[palace] throne version " + key + " skipped", e);
          SCRIPTS[key] = SCRIPTS.pesukim;
        }
      };

      // ---- the switch, the ascent and the witnesses' scene (ctx.shared.throneVersion / ctx.shared.throne, section 12) ----
      const stopAll = () => {
        pal_witSound.stop();
        if (anim.tracks) resetTracks(anim.tracks, anim.states);
        anim.running = false; anim.tracks = null; anim.mode = null; anim.lastT = 0;
      };
      const throneVersion = {
        current: "pesukim", keys: VKEYS.slice(), names: VNAMES,
        set: (key) => {
          if (!VG[key]) return false;
          ensure(key);
          stopAll();
          for (const k of VKEYS) VG[k].visible = k === key;
          midr.visible = key !== "pesukim";
          throneVersion.current = key;
          return true;
        }
      };
      const scriptOf = (mode) => (mode === "witnesses" ? SCRIPTS[throneVersion.current].witnesses : SCRIPTS[throneVersion.current]);
      const play = (mode) => {
        const S = scriptOf(mode);
        if (!S || !S.tracks.length) return false;
        stopAll();
        anim.mode = mode; anim.tracks = S.tracks; anim.states = S.states; anim.dur = S.duration;
        anim.t0 = performance.now();
        anim.running = true;
        if (mode === "witnesses") pal_witSound.start();   // 1.0.1-L (the user: "הוספת רעש, בעדי שקר?")
        return true;
      };
      // seek(sec): the scene at that moment; if the script is running it goes on from there. The presentation calls it every frame: going forward
      // the tracks go on from where they are, only a jump back starts again from the rest
      const seekTo = (mode, sec) => {
        const S = scriptOf(mode);
        if (!S || !S.tracks.length) return;
        if (anim.mode !== mode) { stopAll(); anim.mode = mode; anim.tracks = S.tracks; anim.states = S.states; anim.dur = S.duration; }
        const t = Math.max(0, Math.min(sec, anim.dur - 0.001));
        anim.t0 = performance.now() - t * 1000;
        anim.frozenAt = t;
        if (t < anim.lastT - 0.1) resetTracks(anim.tracks, anim.states);   // (a hair back is the clock of the hook against the caller's: no reset every frame)
        evalAt(anim.tracks, anim.states, t);
        anim.lastT = t;
      };
      const elapsedOf = (mode) => (anim.mode !== mode ? 0 : anim.running ? (performance.now() - anim.t0) / 1000 : anim.frozenAt);
      const freeze = (mode) => { if (anim.mode === mode && anim.running) { pal_witSound.stop(); anim.frozenAt = (performance.now() - anim.t0) / 1000; anim.running = false; } };
      const ascent = {
        get running() { return anim.running && anim.mode === "ascent"; },
        get version() { return throneVersion.current; },
        get duration() { return SCRIPTS[throneVersion.current].duration; },
        start: (version) => { if (version && version !== throneVersion.current) throneVersion.set(version); return play("ascent"); },
        stop: () => freeze("ascent"),                                  // holds the moment (seek or start goes on)
        reset: () => { if (anim.mode === "ascent") stopAll(); },
        seek: (sec) => seekTo("ascent", sec),
        elapsed: () => elapsedOf("ascent")
      };
      const witnesses = {
        get running() { return anim.running && anim.mode === "witnesses"; },
        get duration() { return SCRIPTS[throneVersion.current].witnesses.duration; },
        start: () => play("witnesses"),
        stop: () => freeze("witnesses"),
        reset: () => { if (anim.mode === "witnesses") stopAll(); },
        seek: (sec) => seekTo("witnesses", sec),
        elapsed: () => elapsedOf("witnesses")
      };
      // the one per-frame hook: the clock, the tracks; at the end everything returns to rest ("then everything returns to rest")
      if (Array.isArray(ctx.animated)) ctx.animated.push(() => {
        if (!anim.running) return;
        const t = (performance.now() - anim.t0) / 1000;
        if (t >= anim.dur) { stopAll(); return; }
        evalAt(anim.tracks, anim.states, t);
        anim.lastT = t;
      });
      const script = {}, witnessScript = {};
      for (const k of VKEYS) { script[k] = CAP[k] || []; witnessScript[k] = WCAP[k] || []; }
      thrAPI = { throneVersion, ascent, witnesses, script, witnessScript, VNAMES,
        shared: { body: [X - BW / 2 + THDX, X + BW / 2 + THDX, bZ0 + THDZ, bZ1 + THDZ], steps: [X - SW / 2 + THDX, X + SW / 2 + THDX, bZ1 + THDZ, zF + THDZ], ramp: [X - RW / 2 + THDX, X + RW / 2 + THDX, zF + THDZ, zF + RL + THDZ], ark: [ARK.x + THDX, ARK.y, ARK.z + THDZ], top, seatTop: sTop, head: [X + THDX, sTop + 2.4, zHead + THDZ], elders: 70,
          pairs: { targumSheni: [["ox", "lion"], ["wolf", "lamb"], ["leopard", "kid"], ["eagle", "peacock"], ["cat", "rooster"], ["eagle", "bird"]], beitHamidrash: [["ox", "lion"], ["wolf", "lamb"], ["leopard", "kid"], ["bear", "deer"], ["eagle", "bird"]] } },
        anchors: { ascent: [X - 6 + THDX, top + 2.2, 614 + THDZ], witnesses: [X + 6 + THDX, top + 2.2, 614 + THDZ] } };
    } catch (e) {
      console.warn("[palace] throne skipped", e);
    }

    // ===== 5. the readings of בית יער הלבנון (1.0.1, FIXES H.5; three since 1.0.1-L): the variant groups =====
    // The house of the forest (with 7:6) is built once per reading, each complete in its own Group inside the palace group, and the UI
    // switches between them through ctx.shared.forestHouse.set(key) (shared data at the end): "rashi" (the DEFAULT, the user's first
    // authority) = Rashi on I Kings 7:2-6 as the book draws it, section 7b; "metzudot" = Malbim and Ralbag, section 7a (1.0.1-L: Metzudat
    // David left it for his own reading); "mzd" = Metzudat David, section 7c (1.0.1-L, FIXES L.20).
    // ctx.layers.forestRashi / forestMetzudot / forestMzd are the groups (the UI's label loop shows a label with `layers: ["palace",
    // <variant>]` only while both are visible). ctx.forestBoardsCut lists the meshes of the roofing of EVERY variant that the UI hides on
    // request (off = visible) so that the beams and the halls are seen from above.
    const forestRashi = new Group();
    forestRashi.name = "forestRashi";
    forestRashi.visible = true;
    g.add(forestRashi);
    const forestMetzudot = new Group();
    forestMetzudot.name = "forestMetzudot";
    forestMetzudot.visible = false;
    g.add(forestMetzudot);
    const forestMzd = new Group();
    forestMzd.name = "forestMzd";
    forestMzd.visible = false;
    g.add(forestMzd);
    ctx.layers.forestRashi = forestRashi;
    ctx.layers.forestMetzudot = forestMetzudot;
    ctx.layers.forestMzd = forestMzd;
    // 1.0.1-L (round-K leftover): the labels that NAME the boards ("45 נסרי הסיפון", "קירוי הנסרים הדקים על המרישין", "45 לוחות הארז")
    // also carry the layer "forestBoards" - an empty Group, visible by default - so they go with the boards when "הסר את הנסרים" removes
    // them (they floated over nothing). 70-ui.js's boards pill sets it, and a per-frame check in section 12 keeps it equal to the boards'
    // own visibility whoever hides them (the pill, "↺ החזר הכל", the presentation's restore)
    const forestBoards = new Group();
    forestBoards.name = "forestBoards";
    forestBoards.visible = true;
    g.add(forestBoards);
    ctx.layers.forestBoards = forestBoards;
    ctx.forestBoardsCut = [];
    const boardsCut = (m) => {
      for (const x of Array.isArray(m) ? m : [m]) ctx.forestBoardsCut.push(x);
      return m;
    };

    // 1.0.1-K: the forest house and אולם העמודים stand 10 amot further north than in 1.0.1 (research y 110..210 and 80..110; החצר
    // האחרת is 60 deep instead of 70) so that the 20 amot between אולם העמודים and אולם הכסא (research y 60..80) hold 7:6 - "ואולם על
    // פניהם" and "ועמדים ועב על פניהם" - in both readings
    const fZ0 = pal_wz(210), fZ1 = pal_wz(110);   // 459.5..559.5: the forest house
    const fCZ = (fZ0 + fZ1) / 2;                  // 509.5
    const aZ0 = fZ1, aZ1 = pal_wz(80);            // 559.5..589.5: אולם העמודים
    // the floor of the forest house: paving over the 50 x 100 (the very slab hall() built in 1.0.0; model choice), shared
    H.box(g, BX1 - BX0, 0.25, fZ1 - fZ0, M.paveFine, X, Y, fCZ).name = "forestFloor";
    // shields, vessels and tables of both readings (I Kings 10:16-17 "ויעש המלך שלמה מאתים צנה זהב שחוט... ושלש מאות מגנים זהב
    // שחוט... ויתנם המלך בית יער הלבנון"; 10:21 "וכל כלי בית יער הלבנון זהב סגור"; the book p12R: the צינות standing along the walls,
    // the round shields hung on them, a table with gold vessels in the middle; "צורת הכלים והמגינים להמחשה בלבד" - the forms are model
    // choices, the counts are the verses'). Collected per variant here, instanced at the end of 7b
    const shields = new Map(), tzinot = new Map();   // parent -> items
    const addTo = (map, parent, it) => {
      if (!map.has(parent)) map.set(parent, []);
      map.get(parent).push(it);
    };
    const furnRashi = [], furnMetz = [], furnMzd = [];   // cedar tables of the three readings (1.0.1-L: furnMzd)

    // ----- 7a. the reading of MALBIM and RALBAG (group forestMetzudot, key "metzudot"; hidden by default) -----
    // 1.0.1-L (FIXES L.20): this reading carries only what Malbim and Ralbag say - Metzudat David's own layout is the third reading (7c);
    // its geometry is that of 1.0.1-K. The long stone walls stand OUTSIDE the clear (x 75..78 and 128..131), so Ralbag's row of 15
    // pillars across the 50 is fully visible. Long walls (east, west) hewn stone 3 thick (Malbim on 7:4 "משני צדדי האורך היה בנין של אבני
    // גזית"); the short sides (south, north) are the pillar rows with three square doorways each (Malbim on 7:5 "הפתחים היו בצד רוחב
    // הבית... והיה שלש פעמים שהיה שלשה פתחים בכל טור"; square, not arched: Rashi 7:5 "רבועין היו... ולא עשויין כפה", Radak). Four rows
    // of pillars ACROSS the house (Malbim on 7:2 "העמודים היו נתונים לרוחב הבית וחולקים את אורך הבית לג' חלקים"; Ralbag on 7:2 "שעמודי
    // הארזים היו כלם לרחב הבית"), 15 pillars per row 2.5 x 2.5 every 3 1/3, 30 high, 30 clear between the rows (Ralbag on 7:3 "חמשה עשר
    // עמודים היו בטור האחד... עובי העמודים... שתי אמות וחצי... בין טור וטור שלשים אמה והיה גובה העמודים שלשים אמה"); the 45 (7:3) are
    // Ralbag's beams on the pillars, 15 per bay ("והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה"), and on them Malbim's ceiling of
    // 15 boards per bay (Malbim on 7:3 "שהיו נסרים חמשה עשר בכל טור ומסודרים לרוחב הבית, עד שבחמשים אמה היו ט"ו נסרים"); three rows of
    // windows in each long wall, window opposite window (Malbim on 7:4 "ג' חלונות זה ע"ז בגובה וכן היה שלשה בצד הארך זה אצל זה... ר"ל
    // חלונות של צד הארך מזה מכוונים נגד חלונות של צד הארך השני"). The verse's 30 (7:2) is taken as the pillar height (Ralbag); the beams,
    // boards, roof slab and parapet above it are a model choice (the walls top at 33.5, the roof at 32.5).
    const FW = 3;                                 // long walls 3 thick (Malbim; model value; also the long walls of 7c)
    const fX0 = BX0 - FW, fX1 = BX1 + FW;         // 75..131: the walls outside the 50 clear (78..128), see the note above
    // windows in the long walls: 3 rows at heights 8, 16, 24 (model choice), three per bay, 3 x 3, window opposite window (Malbim on 7:4,
    // above: "ג' חלונות זה ע"ז בגובה וכן היה שלשה בצד הארך זה אצל זה"; Radak 7:4 "והיו חלון כנגד חלון" - 1.0.1-K review: "חלון מול
    // חלון", quoted here before as Metzudot's, is in none of the commentaries on Kings) -> 27 per wall; offsets from the south end as in 1.0.1
    const fWin = [];
    for (const yb of [8, 16, 24]) for (const off of [7.5, 17.5, 27.5, 40, 50, 60, 72.5, 82.5, 92.5]) fWin.push({ c: (fZ1 - off) - fCZ, b: yb, w: 3, h: 3 });
    const FROOF = 31.5;                           // pillars 30 + beams 1 + boards 0.5 -> the roof slab (model choice: "גג שטוח")
    const fh = hall({
      parent: forestMetzudot, x0: fX0, x1: fX1, z0: fZ0, z1: fZ1, t: FW, h: 30, roofAt: FROOF, sides: { N: 0, S: 0, E: 1, W: 1 },
      holes: { E: fWin, W: fWin }, floor: null, roofMat: M.stoneLight, ceiling: false,   // the 45 boards are its ceiling; the floor is the shared slab
      fascia: { S: 0 }                            // flush on the south, where אולם העמודים' roof abuts (1.0.1: 0.1 inside it)
    });
    fh.roof.name = "metzudotRoofSlab";
    fh.fasciaS.name = "metzudotFasciaS";
    fh.fasciaN.name = "metzudotFasciaN";
    // "הטפחות" (I Kings 7:9; Radak: the stones on which the beam ends rest protrude a tefach from the wall inside and outside): a ledge
    // at the top of each long wall under the beams
    H.box(forestMetzudot, FW + 0.34, 0.4, fZ1 - fZ0, M.stoneLight, fX0 + FW / 2, Y + 29.6, fCZ).name = "metzudotTefachot";   // set into the wall, 0.17 proud of each face
    H.box(forestMetzudot, FW + 0.34, 0.4, fZ1 - fZ0, M.stoneLight, fX1 - FW / 2, Y + 29.6, fCZ).name = "metzudotTefachot";
    // the four rows (Ralbag: 30 clear between the rows)
    const rowZ = [fZ1 - 1.25, fZ1 - 33.75, fZ0 + 33.75, fZ0 + 1.25];   // 558.25, 525.75, 493.25, 460.75
    const pillarX = [];
    for (let k = 0; k < 15; k++) pillarX.push(pal_wx(65 + 5 / 3 + k * 10 / 3));         // 79.67 .. 126.33 (research X 66.67 .. 113.33), all 15 inside the clear 78..128
    const DOOR_K = [3, 7, 11];                    // the three doorways of each short side sit on the pillar grid (model choice): each
    // replaces three pillars, so the two END rows keep only 6 of their 15 pillars; Ralbag's 15 is seen in the two middle rows and in
    // the 15 beams / 15 boards of every bay
    const skip = new Set();
    for (const k of DOOR_K) { skip.add(k - 1); skip.add(k); skip.add(k + 1); }
    const mP30 = [];
    for (let r = 0; r < 4; r++) {
      const end = r === 0 || r === 3;
      for (let k = 0; k < 15; k++) {
        if (end && skip.has(k)) continue;
        mP30.push({ x: pillarX[k], y: Y + 15, z: rowZ[r] });
      }
    }
    pal_instanced(forestMetzudot, pillarGeo(30), M.cedar, mP30).name = "metzudotPillars";
    // the doorway panels of the short sides: a plastered infill panel 10.83 wide (three pillar pitches) between the cedar pillars,
    // with the doorway 5 x 10, a straight lintel, square posts (Rashi, Radak, Metzudot on 7:5) and three small windows 2 x 2 stacked
    // above it (Malbim on 7:4-5: "ארבעה משקופים" - the door's and three windows'); 1.2 thick, set back inside the 2.5 pillar row
    const panelW = 3 * 10 / 3 + 10 / 3 - 2.5;     // 10.83
    for (const r of [0, 3]) for (const k of DOOR_K) {
      pal_wall(ctx, forestMetzudot, {
        axis: "x", length: panelW, height: 30, thickness: 1.2, mat: M.plaster, cx: pillarX[k], cz: rowZ[r], y: Y,
        holes: [{ c: 0, b: 0, w: 5, h: 10 }, { c: 0, b: 12, w: 2, h: 2 }, { c: 0, b: 16, w: 2, h: 2 }, { c: 0, b: 20, w: 2, h: 2 }],
        occlude: false
      });
    }
    // the 45 כרתות ארזים (7:2-3; Ralbag): 15 cedar beams per bay between the rows, resting on the pillars (y 30..31), 2.5 x 1 x 32.5
    const beams = [], boards = [];
    for (let b = 0; b < 3; b++) {
      const zc = (rowZ[b] + rowZ[b + 1]) / 2;
      for (let k = 0; k < 15; k++) {
        beams.push({ x: pillarX[k], y: Y + 30.5, z: zc });
        boards.push({ x: pillarX[k], y: Y + 31.25, z: zc });
      }
    }
    pal_instanced(forestMetzudot, H.uvWorldBox(new BoxGeometry(2.5, 1, 32.5), 2.5, 1, 32.5), M.cedar, beams).name = "metzudotBeams";
    // the ceiling of cedar boards seen from below, 15 per bay, each 3 1/3 wide (Malbim on 7:3: 15 boards across the 50), 0.5 thick
    const metzBoards45 = boardsCut(pal_instanced(forestMetzudot, H.uvWorldBox(new BoxGeometry(10 / 3 - 0.12, 0.5, 30), 10 / 3 - 0.12, 0.5, 30), boardMat, boards));
    metzBoards45.name = "metzudotBoards45";
    // the removable roofing of this reading (ctx.forestBoardsCut): its 45 boards, the stone roof slab and the two fascia beams
    boardsCut([fh.roof, fh.fasciaS, fh.fasciaN]);
    vlbl("forestMetzudot", "בית יער הלבנון (מלבי״ם ורלב״ג)", X, Y + 42, fCZ, 6);   // 1.0.1-L: was "(מצודות ומלבי״ם)"
    // shields of this reading (one storey): 300 מגנים in three rows on the inner faces of the two long walls (heights 5, 13.5, 21.5,
    // between the window rows), 100 צינות standing along those walls and 100 along both faces of the two middle pillar rows (all
    // between the pillars' ends; model choice); 6 tables with 12 vessels, two in each bay
    {
      const rowCuts = rowZ.map((z) => [z - 1.6, z + 1.6]);
      const free = pal_subtract(fZ0 + 0.4, fZ1 - 0.4, rowCuts);
      for (const [fx, dir] of [[BX0, 1], [BX1, -1]]) {
        for (const z of pal_spread(free, 50)) addTo(tzinot, forestMetzudot, { x: fx + dir * 0.05, y: Y, z, ry: dir > 0 ? 0 : Math.PI });
        for (const hh of [5, 13.5, 21.5]) for (const z of pal_spread(free, 50)) addTo(shields, forestMetzudot, { x: fx + dir * 0.02, y: Y + hh, z, ry: dir > 0 ? 0 : Math.PI });
      }
      for (const r of [1, 2]) for (const s of [-1, 1]) for (const x of pal_spread([[BX0 + 2.2, BX1 - 2.2]], 25)) addTo(tzinot, forestMetzudot, { x, y: Y, z: rowZ[r] + s * 1.3, ry: s > 0 ? -HP : HP });
      for (let b = 0; b < 3; b++) {
        const zc = (rowZ[b] + rowZ[b + 1]) / 2;
        for (const tx of [96, 110]) {
          table(furnMetz, tx, Y + 0.25, zc, 2.5, 12, 1.5);
          putVessels(forestMetzudot, tx, Y + 1.75, zc, "z", 11, 12);
        }
      }
      vlbl("forestMetzudot", "בית יער הלבנון — המגינים והצינות (מלכים א י, טז–יז)", X, Y + 18, fCZ, 2.5);
    }
    // אולם העמודים in this reading (I Kings 7:6 "ואת אולם העמודים עשה חמשים אמה ארכו ושלשים אמה רחבו"): 50 (x) x 30 (z), 30 high
    // (Ralbag on 7:6: "גבהו כגבהם" - as high as the pillars), attached to the SHORT south side of the house (Malbim, Ralbag; Metzudat
    // David's along the LONG side, before the three doorways - "ועמד ארכו לאורך הבית, להיות מול כל שלשת הפתחים" - is built in his own
    // reading since 1.0.1-L, 7c), roofed, cedar pillars 2.5 x 2.5 every 10 inside, hewn-stone side walls; no fascia beams (1.0.1-K): on the north the house's own fascia
    // covers the joint (1.0.1 had the two interpenetrating), on the south the beam over the first row is the edge (1.0.1's fascia lay
    // over the pillar tops and that beam)
    hall({ parent: forestMetzudot, x0: BX0, x1: BX1, z0: aZ0, z1: aZ1, h: 30, roofAt: 31, sides: { N: 0, S: 0, E: 1, W: 1 }, holes: { E: win2([-10, 0, 10], 20), W: win2([-10, 0, 10], 20) }, fascia: { N: false, S: false } });
    {
      const hp = [];
      for (const rz of [aZ1 - 1.25, aZ1 - 11.25, aZ1 - 21.25]) {             // 3 rows every 10 (model choice), the first on the open south edge
        for (const dx of [-20, -10, 0, 10, 20]) hp.push({ x: X + dx, y: Y + 15, z: rz });
        H.box(forestMetzudot, 44, 0.8, 2.5, M.cedar, X, Y + 30, rz);         // a beam 0.8 high over each row, under the ceiling (model choice)
      }
      pal_instanced(forestMetzudot, pillarGeo(30), M.cedar, hp).name = "metzudotHallPillars";
    }
    vlbl("forestMetzudot", "אולם העמודים", X, Y + 37, (aZ0 + aZ1) / 2, 6);
    // 7:6 in this reading = MALBIM: "ואולם על פניהם - לפני הבית והאולם היה עוד אולם; ולפני האולם השני היו עמודים ועב על פניהם, היינו
    // מריש שהוא עץ עב, כמ"ש חז"ל העבים הם המרישים" (and on 7:8 his order: "בית יער הלבנון ולפניו אולם העמודים ועוד אולם לפניו ולפני
    // כולם עמודים ועב על פניהם ולפניו כסא המשפט"). Pillars with the עב are also Radak's ("ועוד היו עמודים אחרים על פניהם ועוד עב על
    // פניהם, ועב הוא עץ עב וגדול הוא הנקרא מריש") and Ralbag's ("והיו בו עמודים וכרותות ארז עבה היתה על פניהם" - in אולם העמודים
    // itself); Metzudat David's stand before the doorways of his אולם העמודים along the long side (1.0.1-L: built in his reading, 7c).
    // The second ulam: 50 x 10 x 20 (model choice), stone side walls, roofed,
    // open front and back, research y 70..80; the colonnade 4 amot before it (research y 66): 6 cedar pillars 2.5 x 2.5 every 10,
    // 20 high, and on them the עב 2.5 x 2.5 along the whole width, no roof (spacing and sizes: model choice; geometry of 1.0.0)
    const suZ0 = aZ1, suZ1 = aZ1 + 10;            // 589.5..599.5
    hall({ parent: forestMetzudot, x0: BX0, x1: BX1, z0: suZ0, z1: suZ1, h: 20, sides: { N: 0, S: 0, E: 1, W: 1 }, holes: { E: win2([0], 12), W: win2([0], 12) }, fascia: { N: 0 } });
    vlbl("forestMetzudot", "״ואולם על פניהם״ — אולם שני (מלבי״ם ז, ו)", X, Y + 26, (suZ0 + suZ1) / 2, 3.5);
    const abZ = suZ1 + 4;                         // 603.5
    const abPillars = [];
    for (let dx = -25; dx <= 25.01; dx += 10) abPillars.push({ x: X + dx, y: Y + 10, z: abZ });
    pal_instanced(forestMetzudot, pillarGeo(20), M.cedar, abPillars).name = "metzudotAvPillars";
    H.box(forestMetzudot, 52.5, 2.5, 2.5, M.cedar, X, Y + 20, abZ).name = "metzudotAv";   // the עב
    vlbl("forestMetzudot", "העמודים והעב — לפני האולם השני (מלבי״ם ז, ו)", X, Y + 30, abZ, 3.5);   // 1.0.1-L: was "(מלבי״ם; מצודות ז, ו)"

    // ----- 7b. the reading of RASHI as the book draws it (group forestRashi, the DEFAULT; rebuilt in 1.0.1-K) -----
    // Rashi on 7:2 "וכרתות ארזים. קורות ארזים, לארך הבית היה טור עמודים בקרקע, והכרותות מעמוד לעמוד"; on 7:3 "וספן בארז. קרוי עליה
    // מלמעלה" and "על הצלעת. מחצות עליונות שעל הכרותות, ארבעה מחצות זה אל זה ברחב, משוכים לארך הבית, כלן פתחים וחלונות, כי בית הקיץ
    // הוא עשוי לאויר, ועל אותן מחצות קרוי הספון, ארבעים וחמשה נסרים היו הספון, שלשה טורי נסרים (לשלשה חללים), שבין ארבע טורי
    // העמודים, חמשה עשר נסרים הטור... ארכן לרחב שבין טור לטור, ורחבן לארך הבית זה אצל זה"; on 7:4 "ועוד עשה קרוי... כי רחב של חמשה
    // עשר נסרים, לא קרה את הבית בכל ארכו... קרוי של נסרים קטנים, נתונים על מרישין קטנים הנותרים (צריך לומר: הנתונים) מטור כרותות ארזים
    // אל טור, שלשה מרישין זה אצל (צריך לומר: לסוף) זה, ושקופין משני צדיהן... ועל אותן שקופין, ראשי הנסרים הקטנים נתונים בו, ארכן של
    // נסרים קטנים, כנגד רחבן של נסרים גדולים"; "ומחזה אל מחזה. ראשי נסרים של שקוף זה, למול (ראשי) נסרים של (שקוף) זה"; on 7:5 "שסתם
    // מקירת מלכים עשוי פתחים פתחים, מפני האויר, ולכך קראו בית יער, שדומה ליער" and "ומחפין היו הפתחים בנסרים דקין רבועין היו כשאר פתחי
    // בתים, ולא עשויין כפה"; on 7:6 "ועמדים ועב על פניהם. ועל כרותות ארזים שעל העמודים התחתונים, הציב על (צריך לומר: עוד) עמודים
    // אחרים, ומרישין מעמוד לעמוד, העמודים לארג בהן צלעות מזה לזה, והעבים לקרוי העליה, עב היא מריש" (1.0.1-L: letter for letter as the
    // library prints them; 1.0.1-K quoted plene spellings - לאורך, כולן, ומחופין, כיפה, לארוג, לקירוי - and corrected readings without
    // the library's brackets).
    // The book (pp. יח-כב: p10R, p10L, p11R, p11L, p12R): "הקומה התחתונה היתה בנויה מארבע שורות של עמודים העומדים בשורה לאורך הבית...
    // [כל חלק 16.6 אמה]" - four rows of CLOSE-SET posts; "גג הקומה התחתונה, שהוא רצפת הקומה העליונה... הארזים היו מונחים מעמוד לעמוד";
    // "על גג הקומה התחתונה היו עמודים נוספים, שמהם נארגו קירות הקומה העליונה. קירות אלו מלאים בפתחים וחלונות מרובעים" - the upper
    // walls are rows of close-set logs with square windows in two staggered rows; the roof = three bands of 15 big boards over most of
    // the length and, at the end, "שלש שורות מרישים, אחד כנגד השני... המרישים מקבילים אחד מול השני [קצה מול קצה]" with small boards on
    // them "ההולכים מ'מריש' ל'מריש'"; "החלק העליון של הפתחים [המשקוף], היה מצופה בנסרי עץ דקים"; stone walls close the two short
    // ends (pp. יח-כא, and the stone end wall inside the upper hall on p. כב); "בבית יער הלבנון [בקומה העליונה] הונחו חמש מאות מגינים".
    // Measures (model choices where the sources give none; the verse gives 100 x 50 x 30): the 100 is overall (end walls included);
    // the four rows at x 79 / 94.67 / 111.33 / 127 (the outer rows flush with the 50, the inner ones at its thirds: the book's "16.6");
    // posts 2 x 2 (the book's slender posts), 29 per row; heights 10 (posts) + 1 (כרתות) + 0.5 (the upper floor) + 18.5 (the logs) = 30
    // (the book draws the lower storey about a third of the height); logs 2 thick, 48 per row; big boards 5 wide.
    // 1.0.1-L (FIXES L.48, the user: "עיין בספר ולפי"ז תבין את העב"): the עב of 7:6 is what the book (p11R, page כ) draws and names at the
    // end of the roof: "ולכן השלימו את התקרה בקירוי נוסף: הניחו עצים עבים [אך לא רחבים מדאי] הנקראים 'מריש' מעמוד לעמוד [והם שימשו רק
    // לתמיכת הגג שיונח עליהם, כמבואר להלן]", "המרישים הם מרובעים [כמו שמשקוף מרובע, כך גם זה מרובע]", "המרישים מקבילים אחד מול השני
    // [קצה מול קצה]" - Rashi on 7:6 "ומרישין מעמוד לעמוד... והעבים לקרוי העליה, עב היא מריש" read with Rashi on 7:4 "נתונים על מרישין
    // קטנים... מטור כרותות ארזים אל טור": the thick beams that lie across from the posts of one row to the posts of the next and carry the
    // second roofing. 1.0.1-K had built "the עבים" as plates 2 x 1 along the tops of the log walls (8 pieces of 12) - not in the book, which
    // shows the log ends at the top of the walls with the beams lying on them (p11R): those plates are gone, the logs rise 1 more (18.5),
    // the 45 boards lie on the log tops as before (y 20..20.5), and the end beams are the עבים - thick (1.0 deep) but not wide (0.6), square
    // cut, resting on the log tops and standing 0.5 over the roof between the thin boards, so they are seen from above (section below).
    const ET = 2;                                    // the stone end walls (the book), 2 thick, inside the 100
    const zIn0 = fZ0 + ET, zIn1 = fZ1 - ET;          // 461.5 .. 557.5: the 96 between them
    const RX = [BX0 + 1, BX0 + 50 / 3, BX0 + 100 / 3, BX1 - 1];   // 79, 94.667, 111.333, 127: the four rows
    const SPX = [[BX0, RX[1]], [RX[1], RX[2]], [RX[2], BX1]];       // the three spaces as thirds of the 50 (the book: 16.6 each)
    const PW = 2;                                    // posts and logs 2 thick
    const LOW_H = 10, BEAM_H = 1, DECK_T = 0.5, WALL_H = 18.5;   // 1.0.1-L: the logs 18.5 (17.5 + the 1 of the removed wall plates)
    const yBeam = Y + LOW_H, yDeck = yBeam + BEAM_H, yUp = yDeck + DECK_T, yRoof = yUp + WALL_H;   // world y 0, 1, 1.5, 20 (the house's 30)
    // the stone end walls (the book; I Kings 7:9 "כל אלה אבנים יקרת כמדות גזית") with three doorways each in the lower storey, one per
    // space, 5 x 8 (model choice): from אולם העמודים into the house on the south (Rashi 7:6 "מבוא לבית") and on the north out to the
    // great court, the middle one facing the gate of החצר האחרת (1.0.1-L: the other court no longer adjoins the house, section 8)
    const endDoors = [-50 / 3, 0, 50 / 3].map((c) => ({ c, b: 0, w: 5, h: 8 }));
    for (const zc of [fZ0 + ET / 2, fZ1 - ET / 2]) pal_wall(ctx, forestRashi, { axis: "x", length: BX1 - BX0, height: yRoof - Y, thickness: ET, mat: M.stone, cx: X, cz: zc, y: Y, holes: endDoors }).name = "rashiEndWall";
    // the lower storey: "על ארבעה טורי עמודי ארזים" (7:2), 29 posts per row, evenly spaced between the end walls (pitch 3.31, gap 1.31)
    const N_LOW = 29, pLow = (zIn1 - zIn0) / N_LOW;
    const zLow = [];
    for (let k = 0; k < N_LOW; k++) zLow.push(zIn0 + pLow * (k + 0.5));
    const lowItems = [];
    for (const x of RX) for (const z of zLow) lowItems.push({ x, y: Y + LOW_H / 2, z });
    pal_instanced(forestRashi, pillarGeo(LOW_H, PW), M.cedar, lowItems).name = "rashiPillarsLower";
    // the כרתות (Rashi "והכרותות מעמוד לעמוד"): ONE cedar beam per span along each row, end to end, the joints over the posts' centres
    // (the two end beams reach into the end walls' faces), 2 wide x 1 high, y 0..1
    const kB = [zIn0].concat(zLow.slice(1, -1), [zIn1]);
    const beamItems = [];
    for (const x of RX) for (let k = 0; k + 1 < kB.length; k++) beamItems.push({ x, y: yBeam, z: (kB[k] + kB[k + 1]) / 2, w: PW, h: BEAM_H, d: kB[k + 1] - kB[k] - 0.03 });
    boxes(forestRashi, M.cedar, beamItems, true, "rashiKerutot");
    // the floor of the upper storey (the book: "גג הקומה התחתונה, שהוא רצפת הקומה העליונה... מעמוד לעמוד"): cedar planks across the
    // spaces on the כרתות, ONE per space over each line of posts, the three of a line end to end; 0.5 thick, y 1..1.5
    const deckItems = [];
    for (const z of zLow) for (const [xa, xb] of SPX) deckItems.push({ x: (xa + xb) / 2, y: yDeck, z, w: xb - xa - 0.03, h: DECK_T, d: pLow - 0.03 });
    boxes(forestRashi, deckMat, deckItems, true, "rashiUpperFloor");
    // the upper walls (Rashi 7:3 "מחצות עליונות שעל הכרותות... כלן פתחים וחלונות"; 7:6 "העמודים לארג בהן צלעות"; the book: close-set
    // logs): 48 logs 2 thick per row, 17.5 high (y 1.5..19). Openings (in logs; model choice after the book's drawing): the two outer
    // walls have 6 lower windows 4 x 3 (sill 3.5 above the floor) and 6 upper windows 2 x 3.5 (sill 10), staggered; the two inner walls
    // (between the three halls of the upper storey) have 4 doorways 4 x 7 and windows 2 x 3 / 4 x 3 at sill 10. Every opening is square
    // (Rashi 7:5) and lined with thin boards 0.15 thick (Rashi 7:5 "ומחפין היו הפתחים בנסרים דקין"; the book: the lintel lined)
    const N_LOG = 48, pLog = (zIn1 - zIn0) / N_LOG;  // 2
    const OUT = [3, 11, 19, 27, 35, 43].map((k0) => ({ k0, n: 2, b: 3.5, h: 3 })).concat([5, 13, 21, 26, 34, 42].map((k0) => ({ k0, n: 1, b: 10, h: 3.5 })));
    const IN = [5, 17, 29, 41].map((k0) => ({ k0, n: 2, b: 0, h: 7 })).concat([{ k0: 11, n: 1, b: 10, h: 3 }, { k0: 23, n: 2, b: 10, h: 3 }, { k0: 36, n: 1, b: 10, h: 3 }]);
    const logItems = [], frameItems = [];
    const LT = 0.15, LD = PW + 0.1;
    RX.forEach((x, r) => {
      const ops = r === 0 || r === 3 ? OUT : IN;
      for (let k = 0; k < N_LOG; k++) {
        const zc = zIn0 + pLog * (k + 0.5);
        const cuts = ops.filter((o) => k >= o.k0 && k < o.k0 + o.n).map((o) => [o.b, o.b + o.h]);
        for (const [a, b] of pal_subtract(0, WALL_H, cuts)) logItems.push({ x, y: yUp + (a + b) / 2, z: zc, sy: b - a });
      }
      for (const o of ops) {
        const za = zIn0 + pLog * o.k0, zb = zIn0 + pLog * (o.k0 + o.n), ya = yUp + o.b, yb = ya + o.h;
        const jy0 = o.b > 0 ? ya + LT : ya;
        for (const zj of [za + LT / 2, zb - LT / 2]) frameItems.push({ x, y: jy0, z: zj, w: LD, h: yb - LT - jy0, d: LT });
        frameItems.push({ x, y: yb - LT, z: (za + zb) / 2, w: LD, h: LT, d: zb - za });
        if (o.b > 0) frameItems.push({ x, y: ya, z: (za + zb) / 2, w: LD, h: LT, d: zb - za });
      }
    });
    pal_instanced(forestRashi, pal_logGeo(10), M.cedar, logItems).name = "rashiLogs";
    boxes(forestRashi, cedarThin, frameItems, false, "rashiLining");
    // (1.0.1-L, L.48: the wall plates 2 x 1 that 1.0.1-K put on the log walls as "the עבים", y 19..20, are removed - see above)
    // the ceiling = the 45 big boards (7:3 "ארבעים וחמשה חמשה עשר הטור"; Rashi: 15 per space, each board's length across the space,
    // their widths side by side along the house): 3 x 15 boards 16.67 long x 5 wide (model choice: the book draws them over three
    // quarters of the length) x 0.5 thick, from the south end: y 20..20.5, z 484.5..559.5, the three of a line end to end
    const BOARD_W = 5, BOARD_T = 0.5;
    const bigItems = [];
    for (const [xa, xb] of SPX) for (let i = 0; i < 15; i++) bigItems.push({ x: (xa + xb) / 2, y: yRoof, z: fZ1 - BOARD_W * (i + 0.5), w: xb - xa - 0.03, h: BOARD_T, d: BOARD_W - 0.03 });
    const zBoardsN = fZ1 - 15 * BOARD_W;             // 484.5: the north edge of the 45 boards
    const rashiBoards45 = boardsCut(boxes(forestRashi, boardMat, bigItems, true, "rashiBoards45"));
    // the second roofing (Rashi 7:4 "שקופים") over the remaining 25 (z 459.5..484.5): no thick wood at all (Part 7, P3, the user: "לא היה שם עב כלל!")
    // 1.0.1-L (A24, the user: "יש לך טעות, אין עב בגג, העב הוא רק באולם העמודים וממילא לא תראה אותו, והכל דק"), which replaces the thick beams above: thin beams (Rashi 7:4 "נתונים על מרישין קטנים") 0.4 x 0.3, y 20..20.3, thin
    // ledges 0.12 x 0.1 flush with their tops ("ושקופין משני צדיהן"), and the thin boards lying on them as the book's p11L, one dark cedar surface, top 20.5 flush with the 45 boards; each board runs from beam to beam
    // 1.2.3 (the user: "הנסרים הדקים צריכים להיות 3 בשורה (סה"כ עומדים על 4 מרישים)"): FOUR lines of small beams over the 25 amot (one beam per
    // space in each line, Rashi's "שלשה מרישין זה לסוף זה"), and between two lines a row of THREE thin boards side by side, each from beam to
    // beam - as the book draws it (1.2.1 had 12 lines and 16 boards to a row)
    // 1.2.6 (the user: "3 בכל שורה"): ONE board to a space in each row - three across the house's width in every row, each the width of its
    // space, from beam to beam; and paler than the 45 boards
    // 1.2.7 (the user, with the book's fig. 37 / 39 and Rashi 7:4 "נתונים על מרישין קטנים... שלשה מרישין זה לסוף זה"): over the last 25 amot FOUR
    // lines of small beams ACROSS the house, each line three beams end to end (one to a space, "אחד כנגד השני"), with their ledges ("ושקופין
    // משני צדיהן"); on them the thin boards ALONG the house - each from beam to beam, three to a row end to end ("3 בכל שורה, סה"כ עומדים על
    // 4 מרישים"), narrow (TB_W 2.5), side by side across each space, and PALE against the dark 45 (the user: the book's pale 45 are wrong).
    const SB = 0.4, SB_H = 0.3, SB_N = 4, LEDGE = 0.12, TB_T = 0.2, TB_W = 2.5;
    const sbP = (zBoardsN - fZ0 - SB) / (SB_N - 1);  // 8.2 between the lines
    const sbItems = [], ledgeItems = [], thinItems = [];
    for (let j = 0; j < SB_N; j++) {
      const zb = fZ0 + SB / 2 + j * sbP;
      for (const [xa, xb] of SPX) {
        const L = xb - xa, xc = (xa + xb) / 2;
        sbItems.push({ x: xc, y: yRoof, z: zb, w: L - 0.03, h: SB_H, d: SB });
        if (j > 0) ledgeItems.push({ x: xc, y: yRoof + 0.2, z: zb - SB / 2 - LEDGE / 2, w: L - 0.03, h: 0.1, d: LEDGE });
        if (j < SB_N - 1) {
          ledgeItems.push({ x: xc, y: yRoof + 0.2, z: zb + SB / 2 + LEDGE / 2, w: L - 0.03, h: 0.1, d: LEDGE });
          const zA = j === 0 ? zb - SB / 2 : zb, zB = j === SB_N - 2 ? zb + sbP + SB / 2 : zb + sbP;   // from beam to beam
          const n = Math.round(L / TB_W), w = L / n;
          for (let i = 0; i < n; i++) thinItems.push({ x: xa + w * (i + 0.5), y: yRoof + 0.3, z: (zA + zB) / 2, w: w - 0.06, h: TB_T, d: zB - zA - 0.04 });
        }
      }
    }
    // 1.0.1-K review (palace-courts-5): the removable roofing of this reading (ctx.forestBoardsCut) is the 45 boards and the thin boards
    // only - the thin beams and their ledges (שקופין) stay, so "הסר את הנסרים" shows the beams under the boards
    boxes(forestRashi, M.cedar, sbItems, true, "rashiSmallBeams");
    boxes(forestRashi, M.cedar, ledgeItems, false, "rashiLedges");
    const thinBoardMat = boardMat.clone();   // 1.0.1-L (the user: "דוקא הנסרים הדקים שעל המרישים צריכים להיות יותר בהירים")
    thinBoardMat.color.set(0xF3E4C2);   // 1.2.6: paler still (the user: "צריכים להיות בהירים")
    boardsCut(boxes(forestRashi, thinBoardMat, thinItems, true, "rashiThinBoards"));
    // the visible foundation course (7:10) under the long sides and the north end (the south end abuts אולם העמודים)
    foundation(forestRashi, BX0, BX1, fZ0, fZ1, { N: 1, S: 0, E: 1, W: 1 }, { N: endDoors.map((o) => [X + o.c - o.w / 2, X + o.c + o.w / 2]) });
    vlbl("forestRashi", "בית יער הלבנון (רש״י)", X, Y + 42, fCZ, 6);
    vlbl("forestRashi", "בית יער הלבנון — טורי העמודים והכרותות (רש״י ז, ב)", BX0 - 5, Y + 5, fCZ - 20, 3.5);         // west side, the lower storey
    // 1.0.1-L (L.48): "ועמדים" and "ועב" named apart - the posts of the upper walls on the east side (it read "העמודים והעב — קירות הקומה
    // העליונה (רש״י ז, ו)"), the עבים over the north end of the roof (not on the boards' layer: the beams stay when the boards go)
    vlbl("forestRashi", "״ועמדים״ — עמודי קירות הקומה העליונה (רש״י ז, ו)", BX1 + 5, yUp + 9, fCZ + 20, 3.5);           // east side, the upper storey
    vlbl("forestRashi", "המרישין הקטנים — ״נתונים על מרישין קטנים״ (רש״י ז, ד)", BX1 + 4, yRoof + 2.5, fZ0 + 12, 3.5);   // 1.0.1-L (A24)
    vlbl("forestRashi", "״ועב״ — באולם העמודים בלבד, ואינו נראה (ז, ו)", BX1 + 5, Y + 15, 575, 3.5);   // 1.0.1-L (A24): the word and its label belong to the hall (7:6 "ועמדים ועב על פניהם")
    // 1.0.1-L (round-K leftover): the two labels that name the boards are also on the layer "forestBoards" - they go with the boards
    vlbl("forestRashi", "45 נסרי הסיפון (מלכים א ז, ג)", X, yRoof + 3, (zBoardsN + fZ1) / 2, 3.5, "forestBoards");
    vlbl("forestRashi", "קירוי הנסרים הדקים על המרישין — ״שקופים״ (רש״י ז, ד)", X - 6, yRoof + 5, (fZ0 + zBoardsN) / 2 + 3, 3.5, "forestBoards");
    // the three halls of the upper storey (the book p12R: "בבית יער הלבנון [בקומה העליונה] הונחו חמש מאות מגינים"): on each of the six
    // long faces two rows of 25 round shields (heights 8.25 / 8.5 and 15.25 above the floor, clear of the windows and doorways) = 300,
    // and the צינות standing on the floor along them, 34 on each outer face and 33 on each inner face (clear of the doorways) = 200;
    // two cedar tables 2.5 x 12 with 12 gold vessels in the middle of each hall (model choice after the book)
    {
      const halls3 = [[RX[0] + PW / 2, RX[1] - PW / 2], [RX[1] + PW / 2, RX[2] - PW / 2], [RX[2] + PW / 2, RX[3] - PW / 2]];
      const faces = [
        { x: halls3[0][0], dir: 1, ops: OUT, nT: 34 }, { x: halls3[0][1], dir: -1, ops: IN, nT: 33 },
        { x: halls3[1][0], dir: 1, ops: IN, nT: 33 }, { x: halls3[1][1], dir: -1, ops: IN, nT: 33 },
        { x: halls3[2][0], dir: 1, ops: IN, nT: 33 }, { x: halls3[2][1], dir: -1, ops: OUT, nT: 34 }
      ];
      const freeAt = (ops, h0, h1, margin) => pal_subtract(zIn0 + 0.5, zIn1 - 0.5, ops.filter((o) => o.b < h1 && o.b + o.h > h0).map((o) => [zIn0 + pLog * o.k0 - margin, zIn0 + pLog * (o.k0 + o.n) + margin]));
      for (const f of faces) {
        for (const z of pal_spread(freeAt(f.ops, 0, 3.2, 0.9), f.nT)) addTo(tzinot, forestRashi, { x: f.x + f.dir * 0.05, y: yUp, z, ry: f.dir > 0 ? 0 : Math.PI });
        for (const hh of f.ops === OUT ? [8.25, 15.25] : [8.5, 15.25]) for (const z of pal_spread(freeAt(f.ops, hh - 0.8, hh + 0.8, 0.8), 25)) addTo(shields, forestRashi, { x: f.x + f.dir * 0.02, y: yUp + hh, z, ry: f.dir > 0 ? 0 : Math.PI });
      }
      for (const [xa, xb] of halls3) for (const tz of [486, 532]) {
        table(furnRashi, (xa + xb) / 2, yUp, tz, 2.5, 12, 1.5);
        putVessels(forestRashi, (xa + xb) / 2, yUp + 1.5, tz, "z", 11, 12);
      }
      vlbl("forestRashi", "בית יער הלבנון — המגינים והצינות (מלכים א י, טז–יז)", X, yUp + 12, fCZ, 2.5);
    }
    // אולם העמודים in this reading (Rashi 7:6 "אולם עשה לפני העמודים האלה, מבוא לבית, חמשים אמה ארכו, לרחבו של בית... ושלשים רחבו";
    // the book p13R: a LOW stone hall with small windows and a flat wooden roof between the house and the high ulam): 50 x 30, 12 high
    // (model choice after the book), stone side walls with 3 small windows each, a cedar roof; inside, 12 cedar posts 2 x 2 in 3 rows
    // of 4, the axis left free (model choice); its north side is the house's south end wall, its south side the high ulam's north wall
    hall({ parent: forestRashi, x0: BX0, x1: BX1, z0: aZ0, z1: aZ1, h: 12, sides: { N: 0, S: 0, E: 1, W: 1 }, holes: { E: win2([-10, 0, 10], 7), W: win2([-10, 0, 10], 7) }, roofMat: M.cedar, fascia: { N: false, S: false } });
    {
      const hp = [];
      for (const rz of [aZ1 - 5, aZ1 - 15, aZ1 - 25]) for (const dx of [-18, -6, 6, 18]) hp.push({ x: X + dx, y: Y + 5.9, z: rz });
      pal_instanced(forestRashi, pillarGeo(11.8, PW), M.cedar, hp).name = "rashiHallPillars";
    }
    vlbl("forestRashi", "אולם העמודים", X, Y + 18, (aZ0 + aZ1) / 2, 6);
    // "ואולם על פניהם" (7:6) in this reading: Rashi "אולם גבוה עשה על כל הבית" - built as the book draws it (p13R "אולם על פניהם"; p13L
    // "ואולם על פניהם - אולם גבוה על כל הבית"): a HIGH stone hall before אולם העמודים, across the whole width of the house, with tall
    // narrow windows high up, a door at the bottom of its front and a flat roof. Measures: model choice - 50 wide, 15 deep (the room
    // left before אולם הכסא; 5 amot of passage remain), 40 high (higher than the house's 30, as the book draws). [Rashi's words may also
    // be read as the upper storey "over the whole house" - the 1.0.1 reading; the model follows the book.]
    const tuZ0 = aZ1, tuZ1 = aZ1 + 15;           // 589.5..604.5
    const tall = (cs, b) => cs.map((c) => ({ c, b, w: 2, h: 7 }));
    hall({
      parent: forestRashi, x0: BX0, x1: BX1, z0: tuZ0, z1: tuZ1, h: 40, roofMat: M.cedar, foundSides: { N: 0, S: 1, E: 1, W: 1 },
      holes: { S: [{ c: 0, b: 0, w: 6, h: 11 }].concat(tall([-18, -9, 9, 18], 27)), N: [{ c: 0, b: 0, w: 10, h: 10 }], E: tall([0], 27), W: tall([0], 27) }
    });
    leaves("x", X, tuZ1 - 1.5, Y, 6, 10.6, M.cedar, 0.5, 1, forestRashi);
    vlbl("forestRashi", "״ואולם על פניהם״ — אולם גבוה (רש״י ז, ו)", X, Y + 47, (tuZ0 + tuZ1) / 2, 4);

    // ----- 7c. the reading of METZUDAT DAVID (group forestMzd, key "mzd"; hidden by default) - 1.0.1-L, FIXES L.20 (the user: "תוסיף") -----
    // Metzudat David on I Kings 7:2-6, letter for letter as the Otzaria library prints it:
    //  7:2 "כי לפי רוב העמודים שעמדו בה, היה נראה כיער המרובה באילנות... ועשויה היא בחלונות מרובים, להכניס שם האויר"; "והשורות ההם עמדו
    //      לרוחב הבית, והיה נחלק להם האורך לשלשה חלקים שווים, אבל לאורך הבית היה כתלים ממש, כדרך הבנין" - four rows ACROSS the house, at the
    //      two ends and at the thirds, and real walls along it (the short ends are the end rows of posts: he names walls only along the
    //      length); "וכרותות ארזים. ארזים מחוטבים, השכיבו על העמודים ההם, לחברם יחד לבל יהיו זזים ממקום עמדם" - one hewn cedar beam laid on
    //      each row, across the width.
    //  7:3 "כי על העמודים ועל קירות הארזים המחברם יחד, השכיבו צלעות ונסרים, להיות מחיצות הבית ממעל, ועל הצלעות ההם הניחו לוחות ארז, להיות
    //      לתקרה [ואמר על העמודים, ולא זכר כרותות הארזים, על כי העמודים היו העיקר לסבול משא הצלעות]" - the צלעות lie over the posts (the
    //      posts bear them), from row to row, and the cedar boards on them; "והניחו אורך הלוחות לאורך הבית, אם כן היה אורך כל לוח ל״ג אמות
    //      ושליש אמה, ורוחב הלוחות לרוחב הבית, והיה רוחב כל לוח ג׳ אמות ושליש אמה" - his own numbers: 3 x 15 boards, 33 1/3 x 3 1/3.
    //  7:4 "בהכתלים שעמדו באורך הבית, עשו שלשה שורות חלונות, זה למעלה מזה, בקומת הכותל"; "שהחלונות היו מכוונות זו מול זו, רצה לומר:
    //      החלונות מכותל מזה, מול החלונות מכותל מזה".
    //  7:5 "חללי הפתחים שפתחו בהכתלים ההם היו מרובעים, כי המשקופים היו מיושרים, לא עגולים"; "הם עמודי המזוזות, היו מרובעים בני ארבע
    //      צלעות"; "גם חלון הקטן העשוי ממעל להפתח, היתה רבוע"; "יתכן שהיו שלשה פתחים בכותל מזה, ושלשה בכותל מזה, והחלון מלמעלן, וכל השלשה
    //      היו זה מול זה, והיה אם כן בכל חלק שבחלק העמודים, פתח אחד מזה, ופתח אחד מזה" - the doorways are in the LONG walls, one in each
    //      third, opposite each other.
    //  7:6 "לבית יער הלבנון, עשה אולם עומד על עמודי ארזים, יהיה ארכו חמשים אמה ורחבו שלשים אמה"; "שעמוד נסמך לבית היער לפני פתחים,
    //      וכדרך בית שער, ועמד ארכו לאורך הבית, להיות מול כל שלשת הפתחים שבשלשת חלקי הבית" - along the long side before the three doorways,
    //      so all three stand within its 50; "לפני פתחי האולם הזה, עמדו עמודים תקועים בארץ, וממעל להם עץ עב לחברם יחד, לבל יהיו זזים
    //      ממקומם והיה עשוי לנוי ולפאר, או להיות כעין מחיצה ולשמירה".
    // He refers to his own drawing ("ועיין בתחילת קונטרס בנין הבית ובצורה", 7:6), which is not in the library: the layout follows his words
    // only. Model choices: the side of אולם העמודים (the east, the side the palace views look from); 15 posts to a row (one under the middle
    // of each board; "רוב העמודים"), 2 x 2 x 26; the כרותות 1.96 x 1.5; the צלעות 1.2 x 2 over every post line; the boards 0.5 thick (26 +
    // 1.5 + 2 + 0.5 = the verse's 30); the long walls 3 thick outside the 50 clear and 31 high (as in 7a); the doorways 3.5 x 9 at the middle
    // and 21 amot to each side (inside their thirds and within the hall's 50), their square posts and straight lintel 0.6 thick, the small
    // windows over them 2 x 2; the windows 2.5 x 3 in rows with the sills at 4, 11.5 and 19.5, 12 to a row; the hall 16.5 high (under the
    // third row of windows) on 12 cedar pillars with stone ends; the עב row 5 amot before the hall's openings (5 posts 10 high, the עב 2.5).
    const MZ_ROW = [fZ0 + 1, fZ0 + 100 / 3, fZ0 + 200 / 3, fZ1 - 1];      // z 460.5, 492.83, 526.17, 558.5: the four rows (the end rows flush)
    const MZ_PX = [];
    for (let k = 0; k < 15; k++) MZ_PX.push(BX0 + 5 / 3 + k * 10 / 3);   // x 79.67 .. 126.33: one post under the middle of each board
    const MZ_POST = 26, MZ_KER = 1.5, MZ_TZ = 2, MZ_BRD = 0.5;           // heights: 26 + 1.5 + 2 + 0.5 = 30 (7:2 "ושלשים אמה קומתו")
    const mzKerY = Y + MZ_POST, mzTzY = mzKerY + MZ_KER, mzBrdY = mzTzY + MZ_TZ;   // world y 16, 17.5, 19.5; the boards' top at 20
    const MZ_DOOR = [-21, 0, 21], MZ_DW = 3.5, MZ_DH = 9;                // the doorways: offsets from the middle (fCZ), 3.5 x 9
    const MZ_HALL = { x0: fX1, x1: fX1 + 30, z0: fCZ - 25, z1: fCZ + 25, t: 1.5, h: 16.5 };   // אולם העמודים: x 131..161, z 484.5..534.5
    const MZ_HP = [0, 1, 2, 3].map((k) => MZ_HALL.z0 + MZ_HALL.t + 8.8 + k * 9.8);         // its pillars' z 494.8 .. 524.2 (openings 7.8)
    const MZ_OPEN = [0, 1, 2, 3, 4].map((k) => MZ_HALL.z0 + MZ_HALL.t + 3.9 + k * 9.8);     // the middles of its five openings 489.9 .. 529.1
    const MZ_AV_X = MZ_HALL.x1 + 5;                                      // the עב row: 5 amot before the hall's openings, x 166
    let mzdBoards45 = null;
    {
      // the long walls (hewn stone, 7:9-11), 3 thick, 31 high: the three doorways, the small window over each (2 x 2, sill 10.5) and the
      // three rows of windows (2.5 x 3, sills 4, 11.5, 19.5) at the same places in both walls ("מכוונות זו מול זו"), clear of the
      // doorways, of the rows' end posts and (on the east) of the hall's stone ends
      const winZ = [5.5, 11, 27, 32, 37, 42].flatMap((d) => [-d, d]);
      const holes = MZ_DOOR.map((c) => ({ c, b: 0, w: MZ_DW, h: MZ_DH }))
        .concat(MZ_DOOR.map((c) => ({ c, b: 10.5, w: 2, h: 2 })))
        .concat([4, 11.5, 19.5].flatMap((b) => winZ.map((c) => ({ c, b, w: 2.5, h: 3 }))));
      for (const xc of [fX0 + FW / 2, fX1 - FW / 2]) pal_wall(ctx, forestMzd, { axis: "z", length: fZ1 - fZ0, height: 31, thickness: FW, mat: M.stone, cx: xc, cz: fCZ, y: Y, holes }).name = "mzdLongWall";
      // the doorposts "מרובעים בני ארבע צלעות" and the straight lintel ("המשקופים היו מיושרים", 7:5): 0.6 square, on the walls' outer faces
      const posts = [];
      for (const [xf, s] of [[fX0, -1], [fX1, 1]]) for (const c of MZ_DOOR) {
        const zc = fCZ + c, xo = xf + s * 0.3;
        for (const e of [-1, 1]) posts.push({ x: xo, y: Y, z: zc + e * (MZ_DW / 2 + 0.3), w: 0.6, h: MZ_DH, d: 0.6 });
        posts.push({ x: xo, y: Y + MZ_DH, z: zc, w: 0.6, h: 0.6, d: MZ_DW + 1.2 });
      }
      boxes(forestMzd, M.stoneLight, posts, true, "mzdDoorPosts");
      // the foundation course (7:10) under the long walls, broken at the west doorways with their posts and, on the east, under the hall
      foundation(forestMzd, fX0, fX1, fZ0, fZ1, { N: 0, S: 0, E: 1, W: 1 }, { W: MZ_DOOR.map((c) => [fCZ + c - MZ_DW / 2 - 0.6, fCZ + c + MZ_DW / 2 + 0.6]), E: [[MZ_HALL.z0 - 0.3, MZ_HALL.z1 + 0.3]] });
      // the posts (7:2 "על ארבעה טורי עמודי ארזים"): 4 rows of 15, y -10..16
      const pItems = [];
      for (const z of MZ_ROW) for (const x of MZ_PX) pItems.push({ x, y: Y + MZ_POST / 2, z });
      pal_instanced(forestMzd, pillarGeo(MZ_POST, 2), M.cedar, pItems).name = "mzdPosts";
      // the כרותות ("השכיבו על העמודים ההם, לחברם יחד"): one hewn beam on each row across the width, its ends 1.5 into the walls; 1.96 deep,
      // so no face lies in the plane of a post's face or of the walls' ends
      boxes(forestMzd, M.cedar, MZ_ROW.map((z) => ({ x: X, y: mzKerY, z, w: fX1 - fX0 - 3, h: MZ_KER, d: 1.96 })), true, "mzdKerutot");
      // the צלעות ("השכיבו צלעות... העמודים היו העיקר לסבול משא הצלעות"): over every post line from row to row, 1.2 x 2, the three of a line
      // end to end over the middle rows (as the boards above them), lighter cedar than the כרותות so the two layers read apart
      const kz = [fZ0, MZ_ROW[1], MZ_ROW[2], fZ1], tzl = [];
      for (let b = 0; b < 3; b++) for (const x of MZ_PX) tzl.push({ x, y: mzTzY, z: (kz[b] + kz[b + 1]) / 2, w: 1.2, h: MZ_TZ, d: kz[b + 1] - kz[b] - 0.03 });
      boxes(forestMzd, cedarFloor, tzl, true, "mzdTzelaot");
      // the 45 boards ("ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה"): 3 x 15, 33 1/3 x 3 1/3 x 0.5, the three of a line end to end over
      // the rows; the roof of this reading, removable (ctx.forestBoardsCut)
      const bd = [];
      for (let b = 0; b < 3; b++) for (const x of MZ_PX) bd.push({ x, y: mzBrdY, z: fZ0 + (b + 0.5) * 100 / 3, w: 10 / 3 - 0.03, h: MZ_BRD, d: 100 / 3 - 0.03 });
      mzdBoards45 = boardsCut(boxes(forestMzd, boardMat, bd, true, "mzdBoards45"));
      // אולם העמודים (7:6): x 131..161 against the east wall, z 484.5..534.5, a cedar roof on cedar pillars ("עומד על עמודי ארזים"), the
      // two ends stone with two small windows ("וכדרך בית שער"), the front open on its pillars: five openings 7.8 wide, before the doorways
      hall({ parent: forestMzd, x0: MZ_HALL.x0, x1: MZ_HALL.x1, z0: MZ_HALL.z0, z1: MZ_HALL.z1, t: MZ_HALL.t, h: MZ_HALL.h, roofAt: MZ_HALL.h, sides: { N: 1, S: 1, E: 0, W: 0 }, holes: { N: win2([-8, 8], 9), S: win2([-8, 8], 9) }, roofMat: M.cedar });
      const hp = [], hb = [];
      for (const hx of [141, 151, MZ_HALL.x1 - 1]) {                         // three rows of four, 2 x 2, the last on the open front
        for (const z of MZ_HP) hp.push({ x: hx, y: Y + 7.55, z });
        hb.push({ x: hx, y: Y + 15.1, z: (MZ_HALL.z0 + MZ_HALL.z1) / 2, w: 2, h: 1.2, d: MZ_HALL.z1 - MZ_HALL.z0 - 2 * MZ_HALL.t });   // a beam under the ceiling
      }
      pal_instanced(forestMzd, pillarGeo(15.1, 2), M.cedar, hp).name = "mzdHallPillars";
      boxes(forestMzd, M.cedar, hb, true, "mzdHallBeams");
      // "ועמודים ועב על פניהם": 5 cedar posts 2 x 2 before the five openings, set 0.3 into the paving ("תקועים בארץ"), 10 high, and on them
      // the עב, 2.5 x 2.5, joining them ("עץ עב לחברם יחד")
      pal_instanced(forestMzd, pillarGeo(10.3, 2), M.cedar, MZ_OPEN.map((z) => ({ x: MZ_AV_X, y: Y + 4.85, z }))).name = "mzdAvPosts";
      H.box(forestMzd, 2.5, 2.5, MZ_OPEN[4] - MZ_OPEN[0] + 4.5, M.cedar, MZ_AV_X, Y + 10, fCZ).name = "mzdAv";
      // the furnishing (10:16-17, 10:21; as in 7a): 300 מגנים in three rows on the inner faces of the long walls (between the window rows,
      // the lowest row clear of the doorways), 100 צינות along those walls and 100 along both faces of the two middle rows, 6 tables
      const rowCuts = MZ_ROW.map((z) => [z - 1.6, z + 1.6]);
      const doorCuts = MZ_DOOR.map((c) => [fCZ + c - MZ_DW / 2 - 0.9, fCZ + c + MZ_DW / 2 + 0.9]);
      const free = pal_subtract(fZ0 + 0.4, fZ1 - 0.4, rowCuts), freeLow = pal_subtract(fZ0 + 0.4, fZ1 - 0.4, rowCuts.concat(doorCuts));
      for (const [fx, dir] of [[BX0, 1], [BX1, -1]]) {
        for (const z of pal_spread(freeLow, 50)) addTo(tzinot, forestMzd, { x: fx + dir * 0.05, y: Y, z, ry: dir > 0 ? 0 : Math.PI });
        for (const hh of [8.75, 16.75, 24.5]) for (const z of pal_spread(hh < 10 ? freeLow : free, 50)) addTo(shields, forestMzd, { x: fx + dir * 0.02, y: Y + hh, z, ry: dir > 0 ? 0 : Math.PI });
      }
      for (const r of [1, 2]) for (const s of [-1, 1]) for (const x of pal_spread([[BX0 + 2.2, BX1 - 2.2]], 25)) addTo(tzinot, forestMzd, { x, y: Y, z: MZ_ROW[r] + s * 1.3, ry: s > 0 ? -HP : HP });
      for (let b = 0; b < 3; b++) for (const tx of [96, 110]) {
        const zc = fZ0 + (b + 0.5) * 100 / 3;
        table(furnMzd, tx, Y + 0.25, zc, 2.5, 12, 1.5);
        putVessels(forestMzd, tx, Y + 1.75, zc, "z", 11, 12);
      }
      // labels (layers ["palace", "forestMzd"]; the boards' label also "forestBoards")
      vlbl("forestMzd", "בית יער הלבנון (מצודת דוד)", X, Y + 42, fCZ, 6);
      vlbl("forestMzd", "אולם העמודים", (MZ_HALL.x0 + MZ_HALL.x1) / 2, Y + 25, fCZ, 6);
      vlbl("forestMzd", "העמודים והעב — לפני פתחי האולם (מצודת דוד ז, ו)", MZ_AV_X, Y + 16, fCZ, 3.5);
      vlbl("forestMzd", "שלושה פתחים בכל כותל, זה מול זה (מצודת דוד ז, ה)", fX0 - 3, Y + 13, fCZ - 21, 3);
      vlbl("forestMzd", "שלוש שורות חלונות, ״מכוונות זו מול זו״ (מצודת דוד ז, ד)", fX0 - 3, Y + 25, fCZ + 21, 3);
      vlbl("forestMzd", "הכרותות על העמודים, והצלעות עליהן (מצודת דוד ז, ב–ג)", X, Y + 27, fZ1 + 4, 3);
      vlbl("forestMzd", "45 לוחות הארז של התקרה (מצודת דוד ז, ג)", X, Y + 33, fCZ - 20, 3.5, "forestBoards");
      vlbl("forestMzd", "בית יער הלבנון — המגינים והצינות (מלכים א י, טז–יז)", X, Y + 18, fCZ, 2.5);
    }

    // ----- the furnishing of the three readings, instanced -----
    const shieldGeo = pal_shieldGeo(), tzinaGeo = pal_tzinaGeo();
    for (const [parent, list] of shields) pal_instanced(parent, shieldGeo, shieldGold, list, false).name = "maginim";
    for (const [parent, list] of tzinot) pal_instanced(parent, tzinaGeo, shieldGold, list, false).name = "tzinot";
    boxes(forestRashi, M.cedar, furnRashi, false, "forestTables");
    boxes(forestMetzudot, M.cedar, furnMetz, false, "forestTables");
    boxes(forestMzd, M.cedar, furnMzd, false, "forestTables");

    // ===== 8. החצר האחרת - the king's own court (rebuilt in 1.0.1-L, FIXES L.33; the user: "בית המלך היה בחצר אחרת לגמרי! ולא בתוך
    // חצר בית יער הלבנון") =====
    // I Kings 7:8 "וביתו אשר ישב שם חצר האחרת מבית לאולם כמעשה הזה היה"; Rashi "מבית לאולם. לפנים מן אולם של בית יער הלבנון"; Radak "ואומר
    // כי החצר האחרת שהיתה לבית הזה והיא החצר שהיתה מבפנים לאולם"; Metzudat David "אשר עמדה בחצר האחרת, מבפנים לאולם המשפט, בדרך הכניסה מן
    // החוץ אל מקום בתי המלוכה"; Ralbag "הוא החצר האחרת שהיא מבפני' לאולם אשר בנה שם ביתו"; Malbim "וגם חצר האחרת ר"ל החצר שלפני בית המלך"
    // and "בית המלך והחצר שלפניו היה מבית לאולם ופנימי לו... בית המלך ולפניו חצר הגדולה שלו ולפניו בית יער הלבנון"; the book (p13) draws
    // it as a court walled on its own, standing apart from the great court: "מאחורי בית יער הלבנון, בתוך חצר אחרת, בנה את ביתו לאכול
    // ולשתות שם". So the other court is the king's own court, behind (north of) בית יער הלבנון and OUTSIDE the great court (whose north wall
    // is at z 443..446, section 2), walled all round, בית המלך at its back (section 9, in place) and the garden before it; a lane 11 wide
    // (z 432..443) and the strips of the terrace beside it (x 10..33 and 173..196) separate it from the great court, as the open ground
    // between the two enclosures of the book. בית בת פרעה stays in the great court (section 10). 1.0.1-K's court (x 33..173, z
    // 399.5..459.5: a low wall 6 high that ran into the forest house's walls, the king's house on its north side, בית בת פרעה in its east
    // wing, the forest house's north doorways opening into it) is gone, with the two infill pieces of the Rashi reading.
    // The wall: hewn stone (Radak on 7:9 "כל אלה הבתים שזכר שבנה בית ה' וביתו ובית המשפט בית בת פרעה וחצרותיהם כלם היו בנויים באבנים
    // יקרות"; Metzudat David there "אבל החצר הגדולה עצמה בנה בבנין אחר" - the stone-and-cedar courses of 7:12 belong to the great court),
    // 2 thick and 8 high, outer x 33..173, z 352.5..432 (its north wall on the terrace's north edge), the clear x 35..171, z 354.5..430
    // (model choice). Its south gate, on the axis, faces the great court's north gate across the lane and the middle north doorway of
    // בית יער הלבנון beyond it - the court lies further in than the hall ("מבית לאולם"); its north gate opens onto the stair up to the
    // Temple - the king's own way from his house (Rashi on 10:5 "דרך מבוא שהכין מביתו לבית המקדש"); both 8 x 7 with stone jambs, a
    // threshold and cedar leaves ajar (model choice). The court paved (stone, as in 1.0.1-K; Radak and Ralbag on 7:8 make the court itself
    // "כמעשה אולם המשפט", Ralbag "שהיה ספון בארז כל הקרקע אשר שם" - DEV note)
    const OC = { x0: 33, x1: 173, z0: TZ0, z1: 432, t: 2, h: 8, gw: 8, gh: 8 * 0.84 };   // 1.0.1-L (Part 7, P5): the gate's height = the three stone courses; the cedar course is its lintel
    const ocIn = { x0: OC.x0 + OC.t, x1: OC.x1 - OC.t, z0: OC.z0 + OC.t, z1: OC.z1 - OC.t };   // the clear: x 35..171, z 354.5..430
    H.box(g, ocIn.x1 - ocIn.x0, 0.15, ocIn.z1 - ocIn.z0, M.paveFine, (ocIn.x0 + ocIn.x1) / 2, Y, (ocIn.z0 + ocIn.z1) / 2).name = "otherCourtPaving";
    {
      // the north and south walls run the full width (they cover the corners); the east and west walls stand between them
      // 1.0.1-L (Part 7, P5, the user: "החומה צריך להיות בה כרותות ארזים"): this wall too as 7:12, three courses of hewn stone and a course of cedar
      for (const zc of [OC.z0 + OC.t / 2, OC.z1 - OC.t / 2]) pal_bandWall(ctx, g, { axis: "x", length: OC.x1 - OC.x0, height: OC.h, thickness: OC.t, cx: X, cz: zc, y: Y, gate: { c: 0, w: OC.gw, h: OC.gh }, name: "otherCourtWall" });
      for (const xc of [OC.x0 + OC.t / 2, OC.x1 - OC.t / 2]) pal_bandWall(ctx, g, { axis: "z", length: ocIn.z1 - ocIn.z0, height: OC.h, thickness: OC.t, cx: xc, cz: (ocIn.z0 + ocIn.z1) / 2, y: Y, name: "otherCourtWall" });
      // the gates: jambs 0.8 wide, 0.3 proud of the faces and 0.02 into the opening (as the palace gates, JE), a threshold 0.2 high, the
      // leaves hung on the jambs' faces and ajar into the court; the wall above the opening (y 7..8) is the lintel. The north gate stands
      // on the terrace's edge at the foot of the stair: its jambs and threshold are proud of the inner face only (the stair's first step
      // is outside)
      for (const [gz, swing, out] of [[OC.z1 - OC.t / 2, -1, 1], [OC.z0 + OC.t / 2, 1, 0]]) {
        const jd = out ? OC.t + 0.6 : OC.t + 0.3, tdp = out ? OC.t + 0.8 : OC.t + 0.4, jz = out ? gz : gz + 0.15, tz = out ? gz : gz + 0.2;
        for (const s of [-1, 1]) H.box(g, 0.8, OC.gh, jd, M.stoneLight, X + s * (OC.gw / 2 + 0.4 - JE), Y, jz).name = "otherCourtGateJamb";
        H.box(g, OC.gw + 2, 0.2, tdp, M.stoneSmooth, X, Y, tz).name = "otherCourtThreshold";
        leaves("x", X, gz, Y + 0.2, OC.gw - 2 * JE, OC.gh - 0.5, M.cedar, 0.35, swing);
      }
      // the paved way from the middle north doorway of בית יער הלבנון to the king's door: across the great court's strip to its north gate
      // (z 446.4..459.2, short of the forest house's foundation course), across the lane between the two thresholds (z 432.4..442.6), and
      // inside the court from its south gate to the king's door (on the paving, z 399.8..429.6)
      H.box(g, 6, 0.06, 459.2 - (GN + WT + 0.4), M.stoneSmooth, X, Y, (GN + WT + 0.4 + 459.2) / 2).name = "otherCourtWay";
      H.box(g, 6, 0.06, (GN - 0.4) - (OC.z1 + 0.4), M.stoneSmooth, X, Y, (GN - 0.4 + OC.z1 + 0.4) / 2).name = "otherCourtWay";
      H.box(g, 6, 0.06, (OC.z1 - OC.t - 0.4) - 399.8, M.stoneSmooth, X, Y + 0.15, (OC.z1 - OC.t - 0.4 + 399.8) / 2).name = "otherCourtWay";
      lbl("החצר האחרת — חצר בית המלך (מלכים א ז, ח)", ocIn.x0 + 20, Y + 13, 416, 6);   // 1.0.1-L: was "החצר האחרת" at x 47, z 429.5
      lbl("שער החצר האחרת", X, Y + 10.5, OC.z1 + 1, 3);                                      // over its south gate, on the lane's side
      lbl("החצר הגדולה", TX1 - 22, Y + 6, GN + 6, 6);   // 1.0.1-L: the great court named again by its new north wall (the first label is at its south end)
    }
    // the garden (1.0.1-K; Kohelet 2:5 "עשיתי לי גנות ופרדסים ונטעתי בהם עץ כל פרי" - Solomon's gardens; its place in this court, the
    // beds and the trees: model choice): two planted beds of fruit trees on both sides of the paved way from the gate to the king's house.
    // 1.0.1-L (FIXES L.22, the user: "בלי בריכה"): the pool of 1.0.1-K (24 x 12 on the axis, after Kohelet 2:6 "עשיתי לי ברכות מים") and
    // its rim are removed. 1.0.1-L (L.33): the garden is in the king's court, before his house (Malbim "החצר שלפני בית המלך"): the beds
    // z 402.5..427 (between the house's foundation course, z 399.8, and the court's south wall, 430), symmetric about the axis now that
    // בית בת פרעה is not in this court (x 37..88.5 and 117.5..169; 1.0.1-K: 37..88.5 and 117.5..135, z 403.5..455.5); 18 trees in each,
    // 6 x 3 (1.0.1-K: 36 + 12)
    {
      const GZ0 = 402.5, GZ1 = 427, GZC = (GZ0 + GZ1) / 2;   // 414.75
      for (const [a, b] of [[37, 88.5], [117.5, 169]]) H.box(g, b - a, 0.3, GZ1 - GZ0, grass, (a + b) / 2, Y, GZC).receiveShadow = true;
      const trunks = [], crowns = [];
      const tree = (x, z, i) => {
        const s = 0.85 + 0.3 * hash(i * 7.3 + 1);   // 10-core's value noise: sizes 0.85..1.15 (model choice)
        trunks.push({ x, y: Y + 0.3 + 1.6 * s, z, s });
        crowns.push({ x, y: Y + 0.3 + 4.4 * s, z, s, ry: i });
      };
      let ti = 0;
      for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) {   // the crowns (r up to 2.42) stay inside the beds' z (406.5 - 2.42 > 402.5, 422 + 2.42 < 427)
        tree(41 + i * 9.3, 406.5 + j * 7.75, ti++);
        tree(165 - i * 9.3, 406.5 + j * 7.75, ti++);
      }
      const trunkGeo = new CylinderGeometry(0.22, 0.32, 3.2, 6);
      pal_instanced(g, trunkGeo, bark, trunks).name = "gardenTrunks";
      pal_instanced(g, new IcosahedronGeometry(2.1, 1), leaf, crowns).name = "gardenCrowns";
      lbl("הגן (קהלת ב, ה)", X, Y + 6, GZC, 4);   // 1.0.1-L: was "הגן והבריכה (קהלת ב, ה–ו)" over the pool (z 429.5); now over the way between the beds
    }
    const KX0 = 63, KX1 = 143, KZ0 = pal_wz(300), KZ1 = pal_wz(270);   // the king's house (section 9): x 63..143, z 369.5..399.5

    // ===== 9. בית המלך (I Kings 7:8 "וביתו אשר ישב שם... כמעשה הזה היה"; Rashi: "דירה גמורה, לאכל שם ולשכב שם"; Ralbag: "שישב שם
    // תמיד ויאכל וישתה וישכב בו... ספון בארז כל הקרקע"; Metzudat David: "כמעשה אולם המשפט, ספון בארז כמותו"; Malbim: "מיוחד למושבו
    // ודירתו לאכול ולשתות"). 1.0.1-K (the user: "בית המלך ריק מדי, תפאר אותו"): 80 (x) x 30 (z) x 20, research y 270..300, at the back
    // (north) of the other court (1.0.1-L: inside its own walls, section 8; the house itself did not move), a door to the court (south)
    // and a door toward the north gate (Rashi on 10:5 "ועלתו אשר יעלה בית ה' - דרך
    // מבוא שהכין מביתו לבית המקדש"), a cedar plank floor and a cedar ceiling; four rooms (model choice): a dining hall (10:5 "ומאכל
    // שלחנו ומושב עבדיו ומעמד משרתו"; Malbim: "ומושב עבדיו הם האוכלים על שולחן המלך שהיה מושבם בסדר לפי מדרגתם... ומעמד משרתיו...
    // כל אחד היה לו מעמד מיוחד"; 10:21 "וכל כלי משקה המלך שלמה זהב"), an entrance hall with cedar columns (7:2 "עמודי ארזים" as the
    // style), the bedchamber (Rashi 7:8 "ולשכב שם"; Song 3:7 "הנה מטתו שלשלמה") and a sitting room; lamps and carpets. Every room,
    // size and piece of furniture is a model choice. =====
    const KC = (KX0 + KX1) / 2;                   // 103
    const kWin = [-33, -25, -17, 12, 18, 27, 33]; // windows 2 x 3 on both long walls (offsets from x 103), none in the entrance hall
    hall({
      x0: KX0, x1: KX1, z0: KZ0, z1: KZ1, h: 20, floor: "planks", roofList: roofSets.king, roofWood: true,
      holes: { S: [{ c: 0, b: 0, w: 5, h: 10 }].concat(win3(kWin)), N: [{ c: 0, b: 0, w: 5, h: 10 }].concat(win3(kWin)), E: win3([-6, 6]), W: win3([-6, 6]) }
    });
    leaves("x", KC, KZ1 - 1.5, Y, 5, 9.6, M.cedar, 0.5, 1);
    leaves("x", KC, KZ0 + 1.5, Y, 5, 9.6, M.cedar, 0.5, -1);
    // the paved way from the north door to the stair up to the Temple (Rashi 10:5). 1.0.1-L (L.33): on the court's paving from the
    // house's foundation course to the threshold of the court's north gate, which stands at the stair's foot (z 354.9..369.2); 1.0.1-K:
    // one strip on the terrace to the great court's north gate, z 355.5..369.5
    H.box(g, 6, 0.06, (KZ0 - 0.3) - (OC.z0 + OC.t + 0.4), M.stoneSmooth, KC, Y + 0.15, (KZ0 - 0.3 + OC.z0 + OC.t + 0.4) / 2).name = "kingsWay";
    const kIn0 = KZ0 + 3, kIn1 = KZ1 - 3, FL = Y + 0.25;   // the clear z 372.5..396.5; the floor's top
    // the partitions: hewn stone 1.5 thick to the ceiling, a doorway 4 x 8 in each (x 95, 111, 126)
    for (const px of [95, 111, 126]) pal_wall(ctx, g, { axis: "z", length: kIn1 - kIn0, height: 19.8, thickness: 1.5, mat: M.stoneSmooth, cx: px, cz: (kIn0 + kIn1) / 2, y: Y, holes: [{ c: 0, b: 0, w: 4, h: 8 }], occlude: false }).name = "kingPartition";
    const kFurn = [], kGold = [], kCushion = [];
    // the dining hall (x 66..94.25): the king's table on a dais at the head, his gold chair, two long tables with benches for "his
    // servants" (Malbim: seated by rank), gold vessels (10:21), a carpet between the tables, four lamps
    // 1.0.1-K review (palace-courts-3): the dais x 66..72 (it ended at 71, so the table's east legs, x 71.08..71.33, stood 0.5 in the air)
    kFurn.push({ x: 69, y: FL, z: 384.5, w: 6, h: 0.5, d: 12 });                   // the dais (model choice)
    table(kFurn, 70.5, FL + 0.5, 384.5, 2, 7, 1.5);                                // the king's table (x 69.5..71.5, all four legs on the dais)
    kGold.push({ x: 67.4, y: FL + 0.5, z: 384.5, w: 1.4, h: 1.0, d: 1.4 }, { x: 66.6, y: FL + 0.5, z: 384.5, w: 0.2, h: 2.8, d: 1.4 });    // the king's chair: seat, back
    putVessels(g, 70.5, FL + 2.0, 384.5, "z", 6, 5, 0.35);
    for (const tz of [379.5, 389.5]) {
      table(kFurn, 83, FL, tz, 18, 2.5, 1.5);
      for (const s of [-1, 1]) kFurn.push({ x: 83, y: FL, z: tz + s * 2.05, w: 18, h: 0.9, d: 0.8 });   // benches
      putVessels(g, 83, FL + 1.5, tz, "x", 16, 16, 0.55);
    }
    carpets.push({ x: 82.5, y: FL, z: 384.5, w: 20, d: 2.6 });
    for (const [lx, lz] of [[68, 374.8], [68, 394.2], [92.6, 374.8], [92.6, 394.2]]) lamps.push({ x: lx, y: FL, z: lz });
    lbl("בית המלך — חדר האוכל (מלכים א י, ה)", 83, Y + 9, 384.5, 2.2);
    // the entrance hall (x 95.75..110.25): two rows of three cedar columns, a carpet runner from door to door, four lamps
    H.colonnade(g, [99.25, 106.75].flatMap((cx) => [378.5, 384.5, 390.5].map((cz) => ({ x: cx, y: FL, z: cz }))), { height: 19.55, rShaft: 0.55, mat: M.cedar, style: "doric" }).name = "kingColumns";
    carpets.push({ x: KC, y: FL, z: 384.5, w: 3, d: 23 });
    for (const [lx, lz] of [[97, 374.2], [109, 374.2], [97, 394.8], [109, 394.8]]) lamps.push({ x: lx, y: FL, z: lz });
    // the bedchamber (x 111.75..125.25): the bed (cedar frame, a gold head-board, a purple cover; Song 3:7), a chest, a carpet, lamps
    kFurn.push({ x: 118.5, y: FL, z: 376.5, w: 5, h: 1.2, d: 7 });                  // the bed frame, its head at the north wall
    kCushion.push({ x: 118.5, y: FL + 1.2, z: 376.75, w: 4.8, h: 0.35, d: 6.5 });  // the cover
    kGold.push({ x: 118.5, y: FL, z: 372.85, w: 5.2, h: 3.2, d: 0.3 });            // the head-board
    kFurn.push({ x: 113.6, y: FL, z: 393.6, w: 2.5, h: 1.6, d: 1.6 });             // a chest
    carpets.push({ x: 118.5, y: FL, z: 385.5, w: 9, d: 6 });
    for (const [lx, lz] of [[113.3, 374.2], [123.7, 374.2]]) lamps.push({ x: lx, y: FL, z: lz });
    lbl("בית המלך — חדר המשכב (שיר השירים ג, ז)", 118.5, Y + 9, 384.5, 2.2);
    // the sitting room (x 126.75..140): two couches with purple cushions, a low table with vessels, a carpet, lamps
    for (const cz of [378, 391]) {
      kFurn.push({ x: 138.3, y: FL, z: cz, w: 2.2, h: 1.0, d: 6 });
      kCushion.push({ x: 138.3, y: FL + 1.0, z: cz, w: 2.0, h: 0.3, d: 5.8 });
    }
    table(kFurn, 134, FL + 0.04, 384.5, 2, 3, 1.0);                               // on the carpet
    putVessels(g, 134, FL + 1.04, 384.5, "z", 2.4, 3, 0.3);
    carpets.push({ x: 132.5, y: FL, z: 384.5, w: 8, d: 9 });
    for (const [lx, lz] of [[128.2, 374.2], [128.2, 394.8]]) lamps.push({ x: lx, y: FL, z: lz });
    lbl("בית המלך", KC, Y + 25, (KZ0 + KZ1) / 2, 6);

    // ===== 10. בית בת פרעה (I Kings 7:8 "ובית יעשה לבת פרעה אשר לקח שלמה כאולם הזה"; Rashi "עלה בלבו לעשות בית לבת פרעה", "כמעשה
    // אולם הזה"; Radak: made like the judgment hall; Ralbag: "כל קרקעו ספון בארז"; Malbim "ואחרי גמר הבנינים התחיל לעשות בית לבת פרעה"):
    // 30 (x) x 50 (z) x 20, the same style; a cedar plank floor, a carpet and two lamps (1.0.1-K, model choice).
    // 1.0.1-L (FIXES L.33, the user: "בית בת פרעה בתוך חצר בית יער הלבנון"): no longer in the king's court (1.0.1-K: its east wing, x
    // 138..168, z 404.5..454.5) but in the court of בית יער הלבנון - the great court about the forest house - apart from the king's
    // house (II Chr 8:11 "כי אמר לא תשב אשה לי בבית דויד"). Its place is not given ("לא נתבאר ברש"י היכן מקום בית זה ביחס לבתים האחרים" -
    // the book, p13, which draws it beside בית יער הלבנון near the end where the halls are): model choice x 35..65, z 560..610, west of
    // אולם העמודים and the high hall of 7:6 (12.7 amot from their foundation course), so it hides none of the forest house's long west
    // wall (the doorways and windows of the second and third readings); its door in its north wall, toward the forest house
    const pX0 = 35, pX1 = 65, pZ0 = 560, pZ1 = 610;
    hall({
      x0: pX0, x1: pX1, z0: pZ0, z1: pZ1, h: 20, floor: "planks", roofList: roofSets.pharaoh, roofWood: true,
      holes: { N: [{ c: 0, b: 0, w: 4, h: 8 }].concat(win2([-9, 9])), S: win2([-8, 8]), E: win2([-15, 0, 15]), W: win2([-15, 0, 15]) }
    });
    leaves("x", (pX0 + pX1) / 2, pZ0 + 1.5, Y, 4, 7.6, M.cedar, 0.5, -1);   // ajar outward (north), as the king's north door
    carpets.push({ x: (pX0 + pX1) / 2, y: FL, z: (pZ0 + pZ1) / 2 + 2, w: 12, d: 20 });
    for (const lx of [pX0 + 6, pX1 - 6]) lamps.push({ x: lx, y: FL, z: pZ1 - 6 });
    lbl("בית בת פרעה", (pX0 + pX1) / 2, Y + 25, (pZ0 + pZ1) / 2, 6);

    // ===== 11. the instanced furnishing, pillars of the shared buildings and the foundation joints =====
    boxes(g, M.cedar, kFurn, false, "kingFurniture");
    boxes(g, gold, kGold, false, "kingGold");
    boxes(g, cushion, kCushion, false, "kingCushions");
    for (const t of Object.keys(vessels)) for (const [parent, list] of vessels[t]) pal_instanced(parent, VG[t], vesselGold, list, false).name = "vessels_" + t;
    if (lamps.length) {
      pal_instanced(g, LG.stand, M.bronze, lamps.map((p) => ({ x: p.x, y: p.y, z: p.z })), false).name = "lampStands";
      pal_instanced(g, LG.flame, flameMat, lamps.map((p) => ({ x: p.x, y: p.y, z: p.z })), false).name = "lampFlames";
    }
    for (const c of carpets) {
      const m = H.box(g, c.w, 0.04, c.d, carpetMat, c.x, c.y, c.z);
      m.castShadow = false;
      m.name = "carpet";
    }
    pal_instanced(g, pillarGeo(20), M.cedar, P20.map((p) => ({ x: p.x, y: Y + 10, z: p.z })));
    try {
      for (const [parent, list] of grooves) if (list.length) pal_instanced(parent, new BoxGeometry(0.14, 1.6, 0.14), groove, list).name = "foundationJoints";
    } catch (e) {
      console.warn("[palace] foundation joints skipped", e);
    }

    // ===== labels of the courts and the whole =====
    lbl("בית שלמה", X, 40, TCZ, 8);
    lbl("החצר הגדולה", X - 45, Y + 6, pal_wz(20), 6);

    // ===== 12. shared data: fly points, the switch, buttons, anchors, notes =====
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    // SPEC 8; 1.0.1-L: the target over the terrace's middle and over the roofs (it was [103, -5, 520], inside the forest house)
    ctx.shared.flyPoints.palace = { pos: [400, 170, 760], target: [103, 25, TCZ] };
    ctx.shared.palaceLabels = palLabels;     // the palace labels (text, x, y, z, size) for the UI, if it wants them
    ctx.shared.palaceBounds = { x0: TX0, x1: TX1, z0: TZ0, z1: TZ1, floorY: Y };
    // 1.0.1 (FIXES E.2): the basis of the placement, in Hebrew, for the UI (palace INFO / "השלמות"); the sources are in the header comment
    // (I Kings 10:5 with II Chr 9:4, II Kings 11:19, Jer 26:10, Jer 22:1, I Kings 8:1); the 20 amot and the 10-amah drop are model choices.
    // 1.0.1-L: II Kings 11:19 spelled as the library prints it ("וירידו... ויבואו"; it read "ויורידו... ויבאו"); L.33: the stair now
    // starts at the north gate of the king's own court (Rashi on 10:5)
    ctx.shared.palaceBasis = "מקום בית שלמה אינו נמסר בפסוקים, אך מן הכתובים עולה שבית המלך עמד למטה מבית ה׳ ועלו ממנו אל הבית: ״ועלתו אשר יעלה בית ה׳״ (מלכים א י, ה; ובמקבילה בדברי הימים ב ט, ד: ״ועליתו״ — העלייה), ״וירידו את המלך מבית ה׳ ויבואו דרך שער הרצים בית המלך״ (מלכים ב יא, יט), ״ויעלו מבית המלך בית ה׳״ (ירמיה כו, י), ״רד בית מלך יהודה״ (ירמיה כב, א). והעיר, עיר דוד, שכנה מדרום למקדש ולמטה ממנו: את הארון העלו ״מעיר דוד היא ציון״ אל הבית (מלכים א ח, א). לפיכך הועמד הארמון צמוד לחצר הגדולה של המקדש מדרומה, על מדרגה נמוכה ממנה, ומעלות עולות מן השער הצפוני של חצר בית המלך אל השער הדרומי של הר הבית — ״דרך מבוא שהכין מביתו לבית המקדש, שהיה עולה בו לבית ה׳״ (רש״י מלכים א י, ה). המרחק המדויק (20 אמה בין החומות) והפרש הגובה (10 אמות, 20 מעלות) — בחירת מודל.";

    // fly points (1.0.1-K): every interior one is a camera INSIDE the closed building with a clear line to its target
    // inside אולם הכסא, from its south door, a little higher, framing the whole throne (1.0.1-L, L.57: the old target now lies inside the
    // new throne's back); throneSteps - close before the steps at the eye of one
    // standing on the floor: the lions and eagles, the pairs lying on the steps, the seat, the sceptre with the dove and the crown
    ctx.shared.flyPoints.throne = { pos: [X + THDX, Y + 8, kZ1 - 3.5 + THDZ], target: [X + THDX, Y + 3, kZ0 + 9.5 + THDZ] };   // 1.0.1-L (the user: the ascent is shown "מבחוץ ולא מבפנים"): inside the hall
    ctx.shared.flyPoints.throneHall = { pos: [208, 18, 640], target: [166, -4, 585] };   // 1.0.1-L ("בכל האולמות התצוגה צריכה להיות יותר מרוחקת"): the hall as a whole   // the whole throne in the frame (1.0.1-K: [X, Y + 6.5, kZ1 - 4.5] -> [X, Y + 4.5, kZ0 + 4.5])
    ctx.shared.flyPoints.throneSteps = { pos: [X + 2.2 + THDX, Y + 4.4, kZ1 - 5.5 + THDZ], target: [X + THDX, Y + 3.6, kZ0 + 9 + THDZ] };
    // inside the dining hall, toward the king's table (1.0.1-L, L.33: the house stayed where it was - the camera and its ray stand)
    ctx.shared.flyPoints.kingsHouse = { pos: [91.5, Y + 6, 392.5], target: [69, Y + 3, 384.5] };
    // 1.0.1-L (FIXES L.22, L.33): the garden in the king's court, from high over the lane before its south gate, along the way between the
    // beds toward his door (for the UI's place of the garden; the 1.0.1-K camera looked over the roof of בית בת פרעה, which left the court)
    ctx.shared.flyPoints.garden = { pos: [X, 26, 446], target: [X, Y + 2, 406] };
    // 1.0.1-L (FIXES L.33): החצר האחרת from the east, high: the king's court with its own wall and gates, the garden and בית המלך, the lane
    // and the great court's north wall with its gate, the forest house's north end beyond them
    ctx.shared.flyPoints.otherCourt = { pos: [205, 85, 420], target: [100, Y + 2, 410] };
    // 1.0.1-L (FIXES L.33): בית בת פרעה from the north-west, in the great court beside אולם העמודים and the forest house: its door (north
    // wall) and the forest house it faces; the target 3 amot before the door (a clear ray; it was inside the house)
    ctx.shared.flyPoints.pharaohDaughter = { pos: [0, 34, 520], target: [(pX0 + pX1) / 2, Y + 5, pZ0 - 3] };
    // the footprints of the courts and houses that L.33 changed (world x / z; for the UI's places and the presentation): the great court
    // (its north wall z 443..446), the lane between the two courts, the king's own court outside it, his house, the garden, בית בת פרעה
    ctx.shared.palaceCourts = {
      greatCourt: { x0: TX0, x1: TX1, z0: GN, z1: TZ1, clear: [TX0 + WT, TX1 - WT, GN + WT, TZ1 - WT], wallH: WH, gates: { north: [X, GN + WT / 2], south: [X, TZ1 - WT / 2] } },
      lane: { x0: TX0, x1: TX1, z0: OC.z1, z1: GN },
      otherCourt: { x0: OC.x0, x1: OC.x1, z0: OC.z0, z1: OC.z1, clear: [ocIn.x0, ocIn.x1, ocIn.z0, ocIn.z1], wallH: OC.h, gates: { south: [X, OC.z1 - OC.t / 2], north: [X, OC.z0 + OC.t / 2] } },
      kingsHouse: { x0: KX0, x1: KX1, z0: KZ0, z1: KZ1 },
      garden: { z0: 402.5, z1: 427, beds: [[37, 88.5], [117.5, 169]] },
      pharaohDaughter: { x0: pX0, x1: pX1, z0: pZ0, z1: pZ1, door: [(pX0 + pX1) / 2, pZ0] },
      throneHalls: { x0: BX0 + THDX, x1: BX1 + THDX, z0: kZ0 + THDZ, z1: jZ1 + THDZ, throneHall: [kZ0 + THDZ, kZ1 + THDZ], judgmentHall: [jZ0 + THDZ, jZ1 + THDZ] }
    };
    // The fly points of בית יער הלבנון follow the reading: forestHouse.set copies the reading's entry into ctx.shared.flyPoints (1.0.1-K:
    // forestInside only; 1.0.1-L, FIXES L.20: all five). forestInside - inside the house (the book p12R; Rashi: along the middle hall of
    // the upper storey; the others: across the middle bay from the east wall toward the west wall's shields); forestRoof - the roofing
    // from the west, above the terrace; forestUpper - the long east side from the south-east (Rashi: the upper storey's walls; Metzudat
    // David: his אולם העמודים along that side and the עב before it); forestAlam - אולם העמודים itself; forestAv - "ועמדים ועב על פניהם"
    // (Rashi: the upper storey's posts and the עבים over the end of the roof; Malbim: the row before the second ulam - the camera the UI
    // used; Metzudat David: the row before his hall). Each camera stands in the open or inside its closed building, its ray to the target
    // clear (checked headless with each reading's group shown alone).
    // 1.0.1-L (FIXES L.48, the user: "בהצגת אולם העמודים למצודות, הוא מציג את בית יער הלבנון במקום את אולם העמודים"): forestAlam shows the
    // hall itself in every reading - Rashi: the LOW hall from the east-south-east, between the house's end wall and the high hall (the book
    // p13; the first round-L camera, 24 off and 10 above its roof, showed little but the roof); Malbim and Ralbag: from the east along an aisle, its stone wall faded, the
    // rows of pillars running away from the camera (a camera inside it, across it from its south-east corner, showed mostly the near pillars; it is as high as the house - Ralbag "גבהו כגבהם" - so from outside it reads as
    // the house; the 1.0.1-K camera stood beside the house, z 548; the first round-L camera, inside, looked along one aisle and showed two pillars);
    // Metzudat David: his hall along the long side, from the south-east. Rashi's forestAv looks at the עבים over the north end of the roof (it repeated forestUpper). The targets of forestRoof
    // and forestUpper now lie on the outside of the roof or the wall they look at (1.0.1-K: inside the house, behind it)
    // 1.0.1-L (last check, picture): Rashi's camera stood at 155, -0.5, 541, close beside the house's corner, and showed ghost walls and a pillar across the frame; now from the south-east, the hall whole and on a diagonal, through its fading wall
    // 1.2.3 (the user: "תשנה את אולם העמודים"): Rashi's low hall seen from INSIDE, standing in the aisle between its northern and middle rows of
    // posts at the east end (z 569.5, between the rows at 564.5 and 574.5), looking west along the rows to the west wall and its windows -
    // the 1.0.1-L camera stood outside, at ground level, and saw the hall through its fading east wall
    const FP_ALAM_RASHI = { pos: [119, Y + 5.5, 569.5], target: [82, Y + 3.5, 569.5] }, FP_ALAM_METZ = { pos: [155.4, -0.6, 663.8], target: [96, -6, 572] }, FP_ALAM_MZD = { pos: [206.2, 5.8, 576.4], target: [146, -4, 505] };
    const FP_FOREST = {
      forestInside: {
        rashi: { pos: [X, yUp + 5, zIn1 - 4], target: [X, yUp + 3.5, zIn0 + 8] },
        metzudot: { pos: [BX1 - 3, Y + 6, (rowZ[1] + rowZ[2]) / 2], target: [BX0 + 2, Y + 4.5, (rowZ[1] + rowZ[2]) / 2] },
        mzd: { pos: [BX1 - 3, Y + 6, fCZ + 8], target: [BX0 + 2, Y + 4.5, fCZ + 8] }        // the middle third, 6 south of its doorways
      },
      forestRoof: {
        rashi: { pos: [52, 52, fCZ], target: [X, yRoof + 1, fCZ] },                             // just over the 45 boards (top 20.5)
        metzudot: { pos: [52, 52, fCZ], target: [X, Y + FROOF + 1.5, fCZ] },                    // just over the stone roof slab (top 22.5)
        mzd: { pos: [52, 52, fCZ], target: [X, mzBrdY + MZ_BRD + 0.5, fCZ] }                    // just over the 45 boards (top 20)
      },
      forestUpper: {
        rashi: { pos: [168, 26, 600], target: [BX1 + 1.5, 8, 528] },                            // 1.5 off the east log wall's face
        metzudot: { pos: [168, 26, 600], target: [fX1 + 1.5, 8, 530] },                         // 1.5 off the east stone wall
        mzd: { pos: [192, 30, 572], target: [MZ_HALL.x1, Y + 10, fCZ] }                       // the hall's middle opening, over the עב
      },
      forestAlam: {
        // 1.0.1-L (Part 7, P6, the user: "צפיית אולם העמודים צריכה להיות מזווית אלכסונית ולא מקבילה"): a diagonal in every reading, the ray clear now that the throne hall has moved. Rashi: from the north-east through the gap between the house and the throne hall, under the low hall's roof, its east wall fading, along the rows of pillars
        rashi: FP_ALAM_RASHI,
        metzudot: FP_ALAM_METZ,   // from the south-east, through the open south side of the second ulam and under the hall's roof, across its rows of pillars; (it was)     // 1.0.1-L: from the east, along the aisle between its two inner rows of pillars: its stone wall fades (the near rays of the fade loop), the rows run away from the camera, the second ulam on the left and the house's end on the right (the camera inside the hall, across it from its south-east corner, showed mostly the near pillars)
        mzd: FP_ALAM_MZD     // from the south-east: its five openings on their pillars and the עב row before them
      },
      forestAv: {
        rashi: FP_ALAM_RASHI,     // 1.0.1-L (A24): the עב is in the hall, so this view is the hall's (forestAlam)
        metzudot: { pos: [181.5, 25.4, 607.6], target: [110, 2, 606] },
        mzd: { pos: [190, 6, 545], target: [MZ_AV_X + 4, Y + 11, fCZ] }                       // just before the עב, from the south-east
      }
    };
    for (const k of Object.keys(FP_FOREST)) ctx.shared.flyPoints[k] = { pos: FP_FOREST[k].rashi.pos.slice(), target: FP_FOREST[k].rashi.target.slice() };
    const forestGroups = { rashi: forestRashi, metzudot: forestMetzudot, mzd: forestMzd };
    const forestHouse = {
      current: "rashi",
      keys: ["rashi", "metzudot", "mzd"],
      // Hebrew names of the readings, for the UI's switch (1.0.1-L: the second reading is Malbim and Ralbag's, the third Metzudat David's)
      names: { rashi: "רש״י", metzudot: "מלבי״ם ורלב״ג", mzd: "מצודת דוד" },
      set: null
    };
    forestHouse.set = (key) => {   // shows the group of `key`, hides the others and aims the reading's fly points into it; an unknown key changes nothing and returns false
      if (!forestGroups[key]) return false;
      for (const k of forestHouse.keys) forestGroups[k].visible = k === key;
      forestHouse.current = key;
      for (const k of Object.keys(FP_FOREST)) {   // the same fly-point objects, new arrays (a click, not a frame)
        const fp = ctx.shared.flyPoints[k], src = FP_FOREST[k][key];
        fp.pos = src.pos.slice();
        fp.target = src.target.slice();
      }
      return true;
    };
    ctx.shared.forestHouse = forestHouse;
    // the anchor of the UI's "הסר את הנסרים" button (FIXES K 0.5b): over the roof's middle, above the roofs of all three readings (Rashi's
    // boards top at y 20.5, Malbim and Ralbag's roof slab at 22.5, Metzudat David's boards at 20 with the parapet at 21)
    ctx.shared.anchors = ctx.shared.anchors || {};
    ctx.shared.anchors.forestRoof = [X, Y + 33.5, fCZ];
    // 1.0.1-L (round-K leftover): the layer of the labels that name the boards follows the boards of the reading shown - one boolean per
    // frame, no allocation (70-ui.js's boards pill also sets it, so it is right on the frame of the click)
    const boardsOf = { rashi: rashiBoards45[0], metzudot: metzBoards45, mzd: mzdBoards45 && mzdBoards45[0] };
    if (Array.isArray(ctx.animated)) {
      ctx.animated.push(() => {
        const m = boardsOf[forestHouse.current];
        const v = !m || m.visible !== false;
        if (forestBoards.visible !== v) forestBoards.visible = v;
      });
    }
    // three on-model buttons (FIXES K 0.5b; two in 1.0.1-K, the third since 1.0.1-L) that remove roofs of the palace - nothing is hidden
    // at build time
    ctx.shared.modelButtons = ctx.shared.modelButtons || [];
    const roofButton = (id, label, labelOn, title, anchor, list) => {
      const st = { off: false };
      ctx.shared.modelButtons.push({
        id, label, labelOn, title, anchor, maxDist: 150, layer: "palace",
        get: () => st.off,
        set: (on) => {
          st.off = !!on;
          for (const m of list) m.visible = !st.off;
        }
      });
    };
    // 1.0.1-K review (palace-courts-1): the pills stood 1 amah under the halls' names ("בית המלך", "אולם הכסא" at Y + 25 over the middle),
    // covered them and took their clicks; each is now anchored on its hall's EAST parapet (the wall's middle, 0.8 above its top Y + 22),
    // the side the usual views look from (the places of בית יער הלבנון and אולם העמודים), 2.2 under its hall's name: the throne hall's
    // 23.5 east and 6.5 north of "אולם הכסא" (24.5 from it; a little north, away from "אולם המשפט"); the king's 38.5 east of "בית המלך"
    // (1.0.1-K: 7.5 further south, toward בית בת פרעה, whose roof it also opened - 39.3 from the name). 1.0.1-L (round-K leftover): this
    // comment gave "23.5 amot from the name" for both. 1.0.1-L (L.33): the king's pill opens only his house now (בית בת פרעה is not in
    // his court) and stands at the middle of his east parapet; בית בת פרעה has its own pill on its SOUTH parapet, 23.5 south of its name -
    // the side its place (flyPoints.pharaohDaughter, from the south-west) looks from. Positions: model choice, checked on screen
    roofButton("palaceKingRoofs", "הסר את גג בית המלך", "החזר את גג בית המלך",
      "מסיר את הגג והתקרה של בית המלך, כדי לראות מלמעלה את החדרים ואת הריהוט (חלוקת החדרים והריהוט — בחירת מודל; מלכים א ז, ח; י, ה). התקרות ספונות ארז: מלכים א ז, יא ומצודת דוד שם ״כל הבנינים האלה, כיסה התקרה בארז״.",
      [KX1 - 1.5, Y + 22.8, (KZ0 + KZ1) / 2], roofSets.king);               // x 141.5, y 12.8, z 384.5
    roofButton("palacePharaohRoof", "הסר את גג בית בת פרעה", "החזר את גג בית בת פרעה",
      "מסיר את הגג והתקרה של בית בת פרעה, כדי לראות מלמעלה את רצפת הארז, השטיח והמנורות (״ובית יעשה לבת פרעה אשר לקח שלמה כאולם הזה״ — מלכים א ז, ח; רלב״ג: ״שהיה כל קרקעו ספון בארז״; השטיח והמנורות — בחירת מודל).",
      [(pX0 + pX1) / 2, Y + 22.8, pZ1 - 1.5], roofSets.pharaoh);           // x 50, y 12.8, z 608.5
    roofButton("palaceThroneRoofs", "הסר את גגות אולם הכסא", "החזר את גגות אולם הכסא",
      "מסיר את הגג והתקרה של אולם הכסא ושל אולם המשפט, כדי לראות מלמעלה את כסא שלמה (מלכים א י, יח–כ) ואת רצפת הארז (מלכים א ז, ז ״וספון בארז מהקרקע עד הקרקע״).",
      [BX1 - 1.5 + THDX, Y + 22.8, (kZ0 + kZ1) / 2 - 6.5 + THDZ], roofSets.throne);       // x 189.5, y 12.8, z 568.5
    // 1.0.1-L (FIXES L.78-L.81): the throne's versions, the king's ascent and the witnesses' scene (section 4), for the UI and the tour:
    // ctx.shared.throneVersion {current, keys, names, set(key)}; ctx.shared.throne {ascent {start(version?), stop(), reset(), seek(sec),
    // running, duration, version, elapsed()}, witnesses {start(), stop(), reset(), seek(sec), running, duration}, script[version] =
    // [{t, text}] (the midrash's words as each thing happens), witnessScript[version], the measures}. Two on-model pills on the throne
    // (hidden in "pesukim", whose anchor returns null): the ascent (set(true) plays the current version's script and flies to throneSteps
    // through ctx.ui.fly when present; set(false) resets) and the witnesses' scene. Features, not removals (the UI's 15-second rule does
    // not apply to a pill); at the end of a script everything returns to rest by itself
    if (thrAPI) {
      ctx.shared.throneVersion = thrAPI.throneVersion;
      ctx.shared.throne = Object.assign({}, thrAPI.shared, { ascent: thrAPI.ascent, witnesses: thrAPI.witnesses, script: thrAPI.script, witnessScript: thrAPI.witnessScript, versions: thrAPI.throneVersion.keys.slice(), names: thrAPI.VNAMES });
      const thrFly = (key) => {
        const f = ctx.shared.flyPoints && ctx.shared.flyPoints[key];
        const fly = ctx.ui && typeof ctx.ui.fly === "function" ? ctx.ui.fly : typeof ctx.flyTo === "function" ? ctx.flyTo : null;
        if (f && fly) fly(f.pos, f.target);
      };
      const A1 = thrAPI.anchors.ascent, A2 = thrAPI.anchors.witnesses;
      ctx.shared.modelButtons.push({
        id: "palaceThroneAscent", label: "הצג את עליית המלך לכסא", labelOn: "עצור את העלייה", maxDist: 150, layer: "palace",
        title: "מציג את עליית המלך לכסא (בצללית בלבד) לפי המדרש שנבחר בטבלת השיטות: בכל מעלה חוזר גלגל המנגנון — ״חוזר הגלגל בתוך המגנון״ (מדרש אבא גוריון) — והארי פושט את ידו והנשר את כנפו לקראת העולה, ״והארי, פושט את ידו של ימין, והנשר גפו של שמאל... והנשר פושט גפו של ימין, והארי ידו של שמאל״ (אבא גוריון; אסתר רבה א, יב ״עלה במעלה הראשונה והארי פושט לו יד, ובשניה נשר פושט לו יד״); ובסוף יונת הזהב פותחת את הארון ומביאה את ספר התורה אל חיקו של המלך — ״ויונה של זהב יורדת מן העמוד במנגנין, ופותחת הארון ולוקחת ס״ת, ונותנת לתוך ידו של מלך״ (פנים אחרים). לתרגום שני: השור מרים אותו ממעלה למעלה, הנשרים מושיבים אותו, הנשר הגדול מניח את הכתר, והאריות מזלפים בשמים. בסוף הכל חוזר למנוחה.",
        anchor: () => (thrAPI.throneVersion.current === "pesukim" ? null : A1),
        get: () => thrAPI.ascent.running,
        set: (on) => { if (on) { if (thrAPI.ascent.start()) thrFly("throneSteps"); } else thrAPI.ascent.reset(); }
      });
      ctx.shared.modelButtons.push({
        id: "palaceThroneMute", label: "השתק את הרעש", labelOn: "השמע את הרעש", maxDist: 150, layer: "palace",
        title: "משתיק את רעש עדי השקר או מחזיר אותו. הרעש נשמע רק בעת הסצנה.",
        anchor: () => (thrAPI.witnesses.running ? [A2[0], A2[1] - 1.3, A2[2]] : null),   // only while the scene runs, under its own pill
        get: () => pal_witSound.muted,
        set: (on) => { pal_witSound.muted = !!on; if (on) pal_witSound.stop(); else if (thrAPI.witnesses.running) pal_witSound.start(); }
      });
      ctx.shared.modelButtons.push({
        id: "palaceThroneWitnesses", label: "עדי שקר — הכסא מרעיש", labelOn: "עצור את הרעש", maxDist: 150, layer: "palace",
        title: "כשעולים עדים להעיד לפני המלך, גלגלי המנגנון מסתובבים וכל החיות שבכסא נוהמות ומנפנפות — ״וכד הוון עלין סהדיא דיסהדון קדם מלכא שלמה הוו מנגניא פקעין גלגילא חזרין תורין געיין אריותא נהמין... למחטף לבהון דסהדיא דלא יסהדון סהדותא דשיקרא״ (תרגום שני לאסתר א, ב); ״היו מנגנות פוקעים, גלגלות חוזרים, אריות נוהמין, נשרים פורחין, טווסין רצין, ולמה לחטוף לבם של עדים, בשביל שיעידו אמת״ (פנים אחרים). כמה שניות, ואז הכל חוזר למנוחה.",
        anchor: () => (thrAPI.throneVersion.current === "pesukim" ? null : A2),
        get: () => thrAPI.witnesses.running,
        set: (on) => { if (on) { thrAPI.witnesses.start(); } else thrAPI.witnesses.reset(); }   // 1.0.1-L (the user): the view stays where it is
      });
    }
    // what each variant shows and which numbers are model choices (Hebrew; the integrator puts it in the UI and in DEV_NOTES)
    // (1.0.1-K review, palace-courts-6: the windows now quote Metzudat David's own words on 7:4, "מכוונות זו מול זו")
    ctx.shared.forestHouseNotes = "בית יער הלבנון (מלכים א ז, ב–ו) מוצג בשלוש קריאות, ועוברים ביניהן בטבלת השיטות. לשיטת רש״י (ברירת המחדל), כפי שמצייר אותה הספר ׳מקרא מפורש׳: ארבעה טורי עמודי ארזים צפופים לאורך הבית (״לארך הבית היה טור עמודים בקרקע, והכרותות מעמוד לעמוד״ — רש״י ז, ב), על כל טור כרותות מעמוד לעמוד, ועליהן רצפת הקומה העליונה (״גג הקומה התחתונה, שהוא רצפת הקומה העליונה״ — מקרא מפורש); הקומה העליונה — ״ועמדים״: עמודים נוספים שמהם נארגו קירותיה, ״כלן פתחים וחלונות״ מרובעים ומחופים נסרים דקים (רש״י ז, ג; ז, ה; ז, ו); עליהם ארבעים וחמישה נסרי הספון, חמישה עשר לכל חלל, ארכם לרחב שבין טור לטור ורחבם לארך הבית; ומכיוון שלא כיסו את מאה האמות — בסוף הבית קירוי שני, והכל דק: ״קרוי של נסרים קטנים, נתונים על מרישין קטנים״ — מטור לטור, ״שלשה מרישין זה אצל (צריך לומר: לסוף) זה״ (מריש אחד לכל חלל, קצה מול קצה), ״ושקופין משני צדיהן״ (רש״י ז, ד), והנסרים מונחים עליהם כציור הספר. העב — באולם העמודים בלבד (״ועמדים ועב על פניהם״, ז, ו), ואינו נראה במודל. אולם העמודים — ״מבוא לבית״ נמוך לפני הבית, ו״אולם על פניהם״ — ״אולם גבוה עשה על כל הבית״ (רש״י ז, ו) — בניין גבוה לפני אולם העמודים, כציור הספר. לשיטת מלבי״ם ורלב״ג: ״העמודים היו נתונים לרוחב הבית וחולקים את אורך הבית לג׳ חלקים״ (מלבי״ם ז, ב); ״משני צדדי האורך היה בנין של אבני גזית״ ובו שלושה טורי חלונות, ״חלונות של צד הארך מזה מכוונים נגד חלונות של צד הארך השני״ (מלבי״ם ז, ד); ״הפתחים היו בצד רוחב הבית״, שלושה בכל טור (מלבי״ם ז, ה); חמישה עשר נסרים לכל שליש (מלבי״ם ז, ג); לרלב״ג — חמישה עשר עמודים בטור, והארבעים וחמישה הם ״כרותות הארזים אשר על העמודים״ (רלב״ג ז, ג), ואולם העמודים ״גבהו כגבהם״ (רלב״ג ז, ו); ״לפני הבית והאולם היה עוד אולם ולפני האולם השני היו עמודים ועב על פניהם היינו מריש שהוא עץ עב״ (מלבי״ם ז, ו). לשיטת מצודת דוד: ״והשורות ההם עמדו לרוחב הבית... אבל לאורך הבית היה כתלים ממש, כדרך הבנין״ (ז, ב); על כל טור כרותה — ״השכיבו על העמודים ההם, לחברם יחד״ (ז, ב); ועליהם ״השכיבו צלעות ונסרים... ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה״ — ארבעים וחמישה לוחות, ״אורך כל לוח ל״ג אמות ושליש אמה... והיה רוחב כל לוח ג׳ אמות ושליש אמה״ (ז, ג); בכתלי האורך שלוש שורות חלונות ״זה למעלה מזה״, ״מכוונות זו מול זו״ (ז, ד); בכל כותל שלושה פתחים מרובעים — ״בכל חלק שבחלק העמודים, פתח אחד מזה, ופתח אחד מזה״ — ועל כל פתח ״חלון הקטן העשוי ממעל להפתח״ (ז, ה); אולם העמודים ״עומד על עמודי ארזים״, ״נסמך לבית היער לפני פתחים, וכדרך בית שער, ועמד ארכו לאורך הבית, להיות מול כל שלשת הפתחים״, ולפני פתחיו ״עמודים תקועים בארץ, וממעל להם עץ עב לחברם יחד״ (ז, ו). בכל הקריאות: מאתיים צינה ושלוש מאות מגן זהב (מלכים א י, טז–יז; רש״י: ״צנה — מקפת את האדם משלשה רוחותיו״) וכלי זהב סגור (י, כא) על שולחנות. בחירות מודל בקריאת רש״י: 29 עמודים בטור (2 על 2), גובה הקומה התחתונה 10 והעליונה 18.5 (עם הכרותות והרצפה — 30), 48 קורות בכל קיר עליון, מקום הפתחים והחלונות ומידותיהם, רוחב הנסרים הגדולים 5 אמות (75 מתוך 100), ארבע שורות מרישין קטנים לרוחב הבית (שלושה בכל שורה, זה לסוף זה; רוחב 0.4, עובי 0.3), ועליהם הנסרים הדקים לאורך הבית, ממריש למריש — שלושה בכל טור, רוחב 2.5, בהירים — כציור הספר ורש״י ז, ד, כותלי האבן בקצוות (כציור הספר), גובה אולם העמודים 12 ומידות האולם הגבוה (50 על 15, גובה 40). בקריאת מלבי״ם ורלב״ג: עובי הכתלים 3, מקום החלונות והפתחים, לוח הגג מאבן, מידות האולם השני (50 על 10) ושורת העמודים. בקריאת מצודת דוד: אולם העמודים בצד המזרחי, חמישה עשר עמודים בטור (עמוד תחת כל לוח), גובה העמודים 26 ומידות הכרותות והצלעות (הצלעות מטור לטור על העמודים), מקום הפתחים (באמצע ו־21 אמה לכל צד, כדי שיעמדו שלושתם מול האולם) ומידותיהם, 12 חלונות בכל שורה, גובה האולם 16.5 ושורת העמודים והעב (5 עמודים בגובה 10). צורת המגינים והכלים ומקומם — להמחשה. בכל הקריאות אפשר להסיר את הנסרים והגג (כפתור על המבנה) ולראות את המרישים, העמודים והאולמות.";
    ctx.shared.palaceNotes = {
      kingsHouse: "בית המלך: ״וביתו אשר ישב שם חצר האחרת מבית לאולם״ (מלכים א ז, ח) — ״דירה גמורה, לאכל שם ולשכב שם״ (רש״י). הוא עומד בחצר משלו, החצר האחרת, ״לפנים מן אולם של בית יער הלבנון״ (רש״י) — ראו ׳החצר האחרת׳; ״ומאכל שלחנו ומושב עבדיו ומעמד משרתו״ (י, ה; מלבי״ם: ״ומושב עבדיו הם האוכלים על שולחן המלך שהיה מושבם בסדר לפי מדרגתם״); ״וכל כלי משקה המלך שלמה זהב״ (י, כא); ״הנה מטתו שלשלמה״ (שיר השירים ג, ז); הדלת הצפונית אל המעלות — ״דרך מבוא שהכין מביתו לבית המקדש״ (רש״י י, ה). בחירות מודל: גודל הבית (80 על 30), ארבעת החדרים (חדר אוכל, אולם כניסה בעמודי ארז, חדר משכב, חדר ישיבה), הריהוט, השטיחים והמנורות, הרצפה והתקרה מארז (ז, ז; ז, יא).",
      // 1.0.1-L (FIXES L.33): the other court as the king's own walled court, and בית בת פרעה outside it (for the UI's places and texts)
      otherCourt: "החצר האחרת — חצר בית המלך: ״וביתו אשר ישב שם חצר האחרת מבית לאולם כמעשה הזה היה״ (מלכים א ז, ח). רש״י: ״מבית לאולם. לפנים מן אולם של בית יער הלבנון״; רד״ק: ״החצר האחרת שהיתה לבית הזה והיא החצר שהיתה מבפנים לאולם״; מצודת דוד: ״אשר עמדה בחצר האחרת, מבפנים לאולם המשפט, בדרך הכניסה מן החוץ אל מקום בתי המלוכה״; רלב״ג: ״הוא החצר האחרת שהיא מבפני׳ לאולם אשר בנה שם ביתו״; מלבי״ם: ״וגם חצר האחרת ר״ל החצר שלפני בית המלך״. ובספר ׳מקרא מפורש׳: ״מאחורי בית יער הלבנון, בתוך חצר אחרת, בנה את ביתו לאכול ולשתות שם״, והספר מצייר אותה חצר מוקפת חומה לעצמה, עומדת לבדה מחוץ לחצר הגדולה. לכן במודל החצר האחרת היא חצר נפרדת לגמרי: חומה משלה, מאחורי בית יער הלבנון ומחוץ לחומת החצר הגדולה, ובין שתי החצרות קרקע פנויה, והמעבר ביניהן בשערים בלבד; בתוכה בית המלך והגן שלפניו. שערה הדרומי מול שער החצר הגדולה ומול הפתח האמצעי שבצפון בית יער הלבנון — החצר לפנים מן האולם (״מבית לאולם״); ושערה הצפוני פתוח אל המעלות העולות לבית ה׳ — ״דרך מבוא שהכין מביתו לבית המקדש, שהיה עולה בו לבית ה׳״ (רש״י י, ה). שתי החומות בנויות במודל ״שלשה טורים גזית וטור כרתת ארזים״ (ז, יב) — ״החומה עשויה שלשה נדבכין של אבנים, ונדבך של עץ עליהם״ (רש״י שם). החצר הגדולה מקיפה במודל את בית יער הלבנון ואולמותיו, את בית בת פרעה ואת אולם הכסא והמשפט. [רלב״ג (ז, יב) כתב ״שהחצר הגדולה אשר בה בית המלך״, ומצודת דוד שם: ״אשר היה מסבב כל בתי המלך״ — לדבריהם גם בית המלך בתוך החצר הגדולה; המודל הולך אחר ציור הספר.] בחירות מודל: מידות החצר (140 על 79.5 אמה), גובה החומה (8) ועוביה (2), השערים, הריצוף, הקרקע הפנויה שבין החצרות (17 אמה) והמעקה הנמוך בשולי המדרגה שמחוץ לשתי החצרות.",
      pharaohDaughter: "בית בת פרעה: ״ובית יעשה לבת פרעה אשר לקח שלמה כאולם הזה״ (מלכים א ז, ח) — ״עלה בלבו לעשות בית לבת פרעה״, ״כמעשה אולם הזה״ (רש״י); ״הבית אשר עשה לבת פרעה, היה גם כן כאולם המשפט״ (מצודת דוד); ״שהיה כל קרקעו ספון בארז״ (רלב״ג); ״ואחרי גמר הבנינים התחיל לעשות בית לבת פרעה״ (מלבי״ם). ביתה לבדו, לא בבית המלך: ״ואת בת פרעה העלה שלמה מעיר דויד לבית אשר בנה לה כי אמר לא תשב אשה לי בבית דויד מלך ישראל״ (דברי הימים ב ח, יא). מקומו אינו מפורש — ״לא נתבאר ברש״י היכן מקום בית זה ביחס לבתים האחרים״ (׳מקרא מפורש׳, שמציירו סמוך לבית יער הלבנון); במודל הוא עומד בחצר בית יער הלבנון — בחצר הגדולה, ממערב לאולם העמודים, מחוץ לחצר האחרת של המלך — ופתחו פונה אל בית יער הלבנון. בחירות מודל: מקומו, מידותיו (30 על 50, גובה 20), הפתח, השטיח והמנורות.",
      garden: "הגן בחצר האחרת, לפני בית המלך (מלבי״ם: ״החצר שלפני בית המלך״): ״עשיתי לי גנות ופרדסים ונטעתי בהם עץ כל פרי״ (קהלת ב, ה). מקומו בחצר הזו, הערוגות והעצים — בחירת מודל.",
      throne: "כסא שלמה (מלכים א י, יח–כ; דברי הימים ב ט, יז–יט): ״ויעש המלך כסא שן גדול ויצפהו זהב מופז. שש מעלות לכסה וראש עגל לכסה מאחריו וידת מזה ומזה אל מקום השבת ושנים אריות עמדים אצל הידות. ושנים עשר אריים עמדים שם על שש המעלות מזה ומזה״. רש״י: ״תקון הכסא היה רחב, והמעלות היו לצד פניו, ולצד רחבה לצד אחריו היה המושב גבוה מן הכסא מקום עגל״; הידות — ״כמין מקלות זהב מפאה לפאה, פשוטין לימין ולשמאל״; ״וכל צורת הכסא מפרשת באגדת מגלת אסתר״ (ובדברי הימים: ״וכל צורת הכסא וצורת החיות שבכסא מפרש בתרגום של מגלת אסתר״). מצודת דוד: האריות ״ששה מזה, וששה מזה״; רלב״ג: האריות פונים ״לצד פני הכסא״; מלבי״ם: הגב ״עגול מאחריו כמדת גופו וראשו״, וההדום — ״שהיה הדום הרגל ג״כ מזהב״. אברבנאל (י, יח–כ): ״ושהיו ששה מעלות לכסא וראש עגול שהיה מכסה מלמעלה, ואותו ראש היה אחוז מאחרי הכסא, והיו גם כן שתי ידות מפה ומפה לכסא, כמו זרועות להסמך בהם בידים בעת הישיבה, והיו שני אריות בשתי הידות, (כ) ועוד היו בכל מעלה משני צדדיה שני אריות, באופן שהיו שני אריות מלמעלה ושנים עשר אריות בכל המעלות״; ובטעמו: ״והיה ראשו עגול להעיר על השמים... והיו לו שתי ידות, לרמוז שהמשפט יהיה על פי התורה, אם התורה שבכתב ואם התורה שבעל פה, והיו שם אריות, להגיד שנביאי ישראל וחכמיה מפרשי התורה מאריות גברו בחכמתה, והיו לכסא שש מעלות ושני אריות בכל מעלה, להעיר על שנים עשר השבטים״. [ב״ראש עגול״ — במודל כרש״י: ״המושב גבוה מן הכסא מקום עגל״ (הבמה העגולה), וגב הכסא עגול בראשו כמלבי״ם וכרלב״ג (״והיה ראש עגול בלוח ההוא באמצעו״; תרגום יונתן ״וריש סגלגל״); מצודת דוד ואברבנאל קוראים אחרת — ״יצא ממעל היושב מכסה עגולה, כעין כיפת כובע״ (מצודת דוד), ״ראש עגול שהיה מכסה מלמעלה״ (אברבנאל) — ולא נבנה.] ״וכבש בזהב לכסא מאחזים״ (דברי הימים ב ט, יח): מצודת דוד — ״קודם שעשו על המעלות היה עשוי כבש מזהב ודרך בו עלה המעלות לשבת על הכסא״ (מצודת ציון: ״עשוי כעין גשר משופע״) — כבש הזהב הנמוך שלפני המעלה הראשונה; רלב״ג — ״שכל מדרגה ומדרגה ממעלות הכסא היו נאחזות לכסא בזהב שהם מצופות בו״; מלבי״ם — ההדום. על פי המדרש, כהפניית רש״י: על כל מעלה שני אריות ושני נשרים — ״אריא לקבל נשרא ונשרא לקבל אריא״ (תרגום שני לאסתר א, ב), ״והארי, פושט את ידו של ימין, והנשר גפו של שמאל... והנשר פושט גפו של ימין, והארי ידו של שמאל״ (מדרש אבא גוריון); באמצע כל מעלה זוג חיות רובצות זו מול זו (תרגום שני): שור וארי, זאב וטלה, נמר וגדי, נשר וטווס, חתול ותרנגול, נץ וציפור (ובאבא גוריון ברביעית ״צבי [וכנגדו] דוב״ ובחמישית ״נשר [וכנגדו] יונה״); המעלות משובצות אבנים טובות ומרגליות, ״לבנות ירקרקות ואדמדמות״ (פנים אחרים); ״שרביט הזהב מאחוריו, ויונה נתונה בראשו ועטרה של זהב בפיה, כדי שיהא המלך יושב בשבת ועטרה של זהב נוגע ואינו נוגע״ (אסתר רבה א, יב, כנוסח הספרייה; וכן במדבר רבה יב, יז: ״שרביט של זהב נתון נתלה מאחריו ויונה בראשו, ועטרה של זהב בפי יונה, ויושב תחתיה בשבת, נוגעת ואינה נוגעת״, ופסיקתא דרב כהנא א, ז: ״שרביט של זהב נתלה לו מאחוריו ויונה בראשו ועטרה של זהב בפי יונה והוא יושב תחתיה בשבת, ונוגעת ואינה נוגעת״); שני כסאות זהב, ״חד לכהנא רבא וחד לסגן כהניא״, ושבעים כסאות לזקני הסנהדרין, ״הוו יתבין מן ימינא דכרסיא ומן סמאליה״ (תרגום שני; ״ושבעים קתידראות היו באולם הכסא״ — ענין כסא שלמה). ועוד במדרש: הכרוז על כל מעלה — ״לא ירבה לו נשים״, ״לא ירבה לו סוסים״, ״וכסף וזהב לא ירבה לו״, ״לא תטה משפט״, ״לא תכיר פנים״, ״לא תקח שחד״ (אסתר רבה; במדבר רבה; פסיקתא דרב כהנא; ובדברים רבה ה, ו רשימה אחרת) — קול, ולכן רק בכיתובי העלייה (מתנות כהונה: ״ובכל בו מצאתי כי הכתובים הללו היו נרשמים בידי האריות שסביב הכסא וזהו ענין הכרוז״ — כלוחות הכתב שבבית המדרש ב; מהרז״ו: ״יתכן שפי' שנעשה הכסא במלאכת אלהות שהיה הכרוז יוצא מעצמו״). המנורה, הגפנים, התמרים והטווסים, עמודי השיש, המנגנון, והיונה הפותחת את הארון ונותנת ספר תורה בידי המלך — נבנו בגרסאות של המדרשים. המידות, צורת החיות ומקום הכסאות — בחירת מודל. הכסא מוצג בארבע גרסאות — הפסוקים ומפרשיהם (ברירת המחדל), תרגום שני, אסתר רבה עם פנים אחרים ואבא גוריון, ובית המדרש ב — ועוברים ביניהן בטבלת השיטות; ראו ׳כסא שלמה — הגרסאות׳ ו׳עליית המלך לכסא׳.",
      // 1.0.1-L (FIXES L.81): what each version of the throne shows, with its sources (the UI's opinion row and the places)
      throneVersions: {
        pesukim: "לפי הפסוקים ומפרשיהם בלבד (ברירת המחדל): גוף הכסא הרחב ושש המעלות לפניו, המושב הגבוה העגול מאחור (רש״י: ״תקון הכסא היה רחב, והמעלות היו לצד פניו, ולצד רחבה לצד אחריו היה המושב גבוה מן הכסא מקום עגל״), הגב העגול בראשו (מלבי״ם: ״עגול מאחריו כמדת גופו וראשו לסמוך עליו גבו״; רלב״ג: ״והיה ראש עגול בלוח ההוא באמצעו״), הידות — ״כמין מקלות זהב מפאה לפאה, פשוטין לימין ולשמאל״ (רש״י), שני אריות אצל הידות (רד״ק: ״והיו צורות אריות עומדות אצל הידות״) ושנים עשר אריות על שש המעלות, ״ששה מזה, וששה מזה״ (מצודת דוד), פניהם ״לצד פני הכסא״ (רלב״ג); אברבנאל: ״ועוד היו בכל מעלה משני צדדיה שני אריות, באופן שהיו שני אריות מלמעלה ושנים עשר אריות בכל המעלות״; ההדום (מלבי״ם על דברי הימים ב ט, יז ״שהיה הדום הרגל ג״כ מזהב״) והכבש — ״קודם שעשו על המעלות היה עשוי כבש מזהב ודרך בו עלה המעלות לשבת על הכסא״ (מצודת דוד שם, יח). בלי נשרים, חיות, אבנים, שרביט, כסאות ומנגנון — אלו מן המדרש, ואינם בגרסה זו; לכן אין בה גם עלייה.",
        targumSheni: "לפי תרגום שני לאסתר א, ב (נוסח הספרייה, בארמית; לצדו תרגום עברי): ״קיימין עלוהי תרין עשר ארייון דדהבא ולקבליהון תרין עשר נשרין דדהבא אריא לקבל נשרא ונשרא לקבל אריא מכוונין אילין לקביל אילין. ידיה דאריא דדהבא דימינא לקביל גפי דנשרא די דהבא דשמאליה״ — שנים עשר אריות ומולם שנים עשר נשרים, אריה מול נשר; ״וסכום אריותא שבעין ותרין ודנישרן שבעין ותרין״ — סך הכל שבעים ושניים (בטקסט בלבד). על המעלות זוגות רובצים: ״על דרגא קדמיתא רביע תורא דדהבא ולקבליה אריא די דהבא. ועל דרגא תניינא רביע דיבא דדהבא ולקבליה רביע תלה דדהבא. ועל דרגא תליתאה רביע נמרא די דהבא ולקבליה רביע אינקה דדהבא. ועל דרגא רביעאה רביע נשרא דדהבא ולקבליה טווסא דדהבא. ועל דרגא חמישיתא רביע שונרא דדהבא ולקבליה תרנגולא דדהבא. ועל דרגא שתיתאה רביע בר נצא דדהבא ולקבליה ציפר דדהבא״ (שור ואריה, זאב וטלה, נמר וגדי, נשר וטווס, חתול ותרנגול, נשר וציפור — ״בר נצא״, כתרגום העברי); ״ועל ריש כורסיא קיימא יונה דדהבא אחידא בר נצא בידה״ — היונה האוחזת נשר (כתרגום העברי) בראש הכסא; המנורה: ״ועל מרישי כורסיא קיימא מנרתא דדהבא... וקיימין לקביל סטרא דמנרתא שבעין קנין דדהבא דציירין עליהון שבעת אבהת עלמא... ולקבל סיטרא תיניינא דמנרתא קיימין קנין אחרנין דציירין עליהון שבעא חסידי עלמא״ (לכאורה שבעה קנים מכל צד), ״ועל ראשי מנרתא קביעא בזיכא דמליא מישחא דזיתא דכיא... ותחות מיניה קביעא אגנתא רבתא דדהבא... ותרתין שובלין דדהבא נפקן מן אגנתא״; ״ותרתין מותבנין דדהבא חד לכהנא רבא וחד לסגן כהניא. ועל מריש כרסייא קביעין שבעין כורסוון דדהבא דעליהון יתבן שבעין סנהדרין״ (במודל שבעים הכסאות עומדים באולם מימין הכסא ומשמאלו — ״וכל סביא הוו יתבין מן ימינא דכרסיא ומן סמאליה״ — ולא על ראש הכסא); ״עשרין וארבע גפנין דדהבא דעבדין טיללא למלכא שלמה״ — סוכת גפנים מעל המושב; ״ותנינא דכספא חד במכונוי״ — התנין של כסף; האבנים: ״מקובע באבני בורלא ומשקע באבני שישא ומקבעין זמרגזין וכודכדנין בירולין ומיגליין״. ״ותרתין בנת ימא יתבן מן תרתין אודנין דמלכא שלמה דלא יתדעזע״, ״וכד בעי מלכא שלמה למיזל לכל אתר דהוא צבי כורסיא במכונוי אזיל תחותוהי״ — בטקסט בלבד. צורת החיות, המנורה, הגפנים ומקומם — בחירת מודל.",
        estherRabbah: "לפי אסתר רבה א, יב עם מדרש פנים אחרים (נוסח ב) ומדרש אבא גוריון, המסכימים בעיקר המעשה: ״וידות מזה ומזה, עלה במעלה הראשונה והארי פושט לו יד, ובשניה נשר פושט לו יד, אל מקום השבת, כך מקבלין אותו, ובמקום השבת שרביט הזהב מאחוריו, ויונה נתונה בראשו ועטרה של זהב בפיה, כדי שיהא המלך יושב בשבת ועטרה של זהב נוגע ואינו נוגע״ (אסתר רבה, כנוסח הספרייה; וכן במדבר רבה יב, יז ופסיקתא דרב כהנא א, ז) — מהרז״ו שם: ״דורש שהידות היו של האריות והנשרים שהיו שם שהם הושיטו לו ידיהם וקבלוהו וזהו אל מקום השבת״; ״וראש עגל לכסה מאחריו, אמר רבי אחא כהדא קדירתא דדרגיש״ (אסתר רבה) — מתנות כהונה: ״ואותן מטות היו להם בראשם עגול כמין קדירה וכן עשה שלמה בכסאו״, והוא ראש הגב העגול שבמודל; ״ועל כל דרך ודרך שני אריות ושני נשרים עומדים על רגליהם, זה כנגד זה... והארי, פושט את ידו של ימין, והנשר גפו של שמאל... והנשר פושט גפו של ימין, והארי ידו של שמאל״ (אבא גוריון); ״ושני אריות של זהב היו עומדים על מעלה ראשונה, ושני עמודים של שיש היו עומדים על ראש האריות, ושני גפנים של זהב עומדות משני צדי הכסא, ומצילות על ראשי העמודים, ושני אריות של זהב חלולים היו עומדות כנגד הראשון, והיו מלאים כל מיני בשמים, שהיו זולפים בשמים, כשהיה המלך שלמה עולה, ושני קתדראות של זהב היו משני צדדי הכסא, אחד לכהן גדול ואחד לסגן, (נ״א אחד לגד החוזה ואחד לנתן הנביא), ושבעים קתדראות מקיפין לכסא של שבעים זקנים סנהדרי ישראל״ (פנים אחרים); האבנים: ״וכל מעלה ומעלה... מכובשת באבנים טובות ומרגליות... לבנות ירקרקות ואדמדמות, ויש בהם בזכוכית טובה קריסטאלי״ (פנים אחרים); התנין: ״פקע תנין של כסף, שהיה חוזר בתוך המנגנון״ (פנים אחרים). ועוד בפנים אחרים: ״ואילני תמרים היו מקיפין לכסא, מכוסין בבגדי שש לבן, ועל ראשיהם טווסין של שן מכוונים כנגד גפי נשרים״. במודל: בכל מעלה שני אריות ושני נשרים, והפנימיים פושטים יד וכנף לעולה לסירוגין; השרביט עם היונה והעטרה, והם נשארים במקומם; שני אריות נוספים בקצות המעלה הראשונה ועל ראשיהם עמודי השיש, וגפני הזהב המצלות על ראשי העמודים; על העמוד המערבי היונה היורדת ״מן העמוד״ אל הארון; שני האריות החלולים על הרצפה בצדי המעלה הראשונה, המזלפים בשמים בעלייה (״כנגד הראשון״ — ״מעלה ראשונה״, פירוש שלום ואמת על פנים אחרים); שני אילני תמרים עטופים פשתן לבן וטווסי שן עליהם (״ועל ראשיהם״ — ״על ראשי האילנות״, שם); שני הכסאות ושבעים כסאות הזקנים; אבנים לבנות, ירוקות ואדומות וזכוכית. אין כאן זוגות חיות על המעלות (בפנים אחרים אין, ובאבא גוריון יש רשימה משלו). באבא גוריון עוד, בטקסט בלבד: ״והיה טווס של כסף טען במגנון למלך ומושיבו על הכסא״, ״וארי פושט ידו, ונוטל העטרה ונותנה על ראשו״. ועוד באסתר רבה שם, בטקסט בלבד: ״שהיה עשוי כטירכי מרכבתו של מי שאמר והיה העולם״; שש המעלות ״כנגד ששה רקיעים״, ״כנגד שש ארצות״, ״כנגד ששה סדרי משנה״, ״כנגד ששת ימי בראשית״, ״כנגד שש אמהות״, ״כנגד שש מצוות שהמלך הוא מוזהר עליהם״; וסופו של הכסא: ״אמר רבי אלעזר ברבי יוסי אני ראיתי שבריו ברומי״. צורת החיות, מספר התמרים ומקומם — בחירת מודל.",
        beitHamidrash: "לפי בית המדרש ב (ילינק; בספרייה בילקוט מדרשים, בלי מספרי ההערות): ״ושנים עשר אריות יש בו, על כל מעלה ומעלה יש בו שני אריות. כיצד, כיון שהמלך שלמה דורס לעלות במעלה ראשונה, היו אריות שבו פורשות למעלה ידיהם וכתב מורשם בידיהם, ולא היה עולה במעלה שניה עד שהיה קורא הכתובים שהיו מורשמין. ומה היה בהן, כשהמלך הופך פניו לצד ימינו היה רואה את הכתב שהיה ביד הארי של ימין, ומה כתוב בו, לא תכירו פנים במשפט (דברים א, יז), והופך פניו לצד שמאלו והיה כתוב בו לא תקח שוחד (שם טז, יט). וכן בכל האריות היה כתוב בהן מענינים אלו של משפט, כגון ודל לא תהדר בריבו (שמות כג, ג)״; ״וכל מעלה ומעלה היתה מכובשת מאבנים טובות ומרגליות, ויש בהן אבנים יקרות לבנות מכורכמות, ויש בהן זכוכית לבן וטובה, ואילני תמרים מיפות את הכסא ומרוקמים בבגדי שש, והיו טווסין של שן מכוונים כנגד כנפי נשרים. ושני עמודים של שש על ראשי האריות, ושני אבנים של זהב היו על שני צידי הכסא, והיו מלאים מכל מיני בשמים. ושתי קתדראות של זהב משני צדי הכסא, אחת לגד הנביא ואחת לנתן הנביא. ושבעים קתדראות של זהב לשבעים זקנים ויושבין בהן. ועל כל קתדרא וקתדרא שני אריות ושני נשרים, ומכוונים אחד כנגד אחד, ועומדין על רגליהן״; הזוגות: ״במעלה הראשונה השור כנגד הארי, בשניה הזאב כנגד הטלה, בשלישית נמר כנגד גדי, ברביעית דוב כנגד צבי, בחמישית נשר כנגד [יונה, בששית נץ וכנגדו] צפור״ (במודל: חמישה זוגות, בחמישית נשר וציפור); ״תנין של כסף היה טוען גלגל של כסא״; ״ויונה של זהב היתה עומדת בין העמודים ופותחת לו הארון״; ״והארי של שמאל פושט ידו ונוטל העטרה״. במודל: בדיוק שנים עשר אריות, שניים בכל מעלה, ולוחות הכתב בידיהם (ועליהם שלושת הפסוקים שבמקור), ולפניהם שנים עשר נשרים; שני האריות שאצל הידות ועל ראשיהם עמודי השיש — המקור אינו מפרש על אילו אריות, וכך עומדת היונה שעל ראש גב הכסא ״בין העמודים״; אבנים לבנות, כרכומיות וזכוכית; שני אילני תמרים עטופים פשתן לבן וטווסי שן עליהם; שני כלי בשמים של זהב; כסאות גד הנביא ונתן הנביא; שבעים כסאות ועל כל אחד שני אריות ושני נשרים קטנים; הארון ליד המושב, בין שני העמודים; העטרה ליד הארי של שמאל; והתנין. צורת החיות ומקומן, ואיזה פסוק על איזה לוח מעבר למעלה הראשונה — בחירת מודל.",
      },
      // 1.0.1-L (FIXES L.78-L.80): the king's ascent, the witnesses' scene and the Ben Yehoyada for the presentation's bubble
      throneAscent: "עליית המלך לכסא (כפתור על הכסא; המלך מוצג בצללית בלבד, בלי פנים ובלי תווי דמות): בכל מעלה חוזר גלגל המנגנון שבצד המעלה — ״חוזר הגלגל בתוך המגנון״ (מדרש אבא גוריון), ״חוזר גלגל של מנגנון״ (פנים אחרים) — והארי פושט את ידו והנשר את כנפו לקראת העולה, לסירוגין: ״והארי, פושט את ידו של ימין, והנשר גפו של שמאל, והמלך נשען עליהם, ועולה למעלה השנייה, עמד על המעלה, וגלגל חוזר, והנשר פושט גפו של ימין, והארי ידו של שמאל, והמלך נשען עליהם ועולה, וכן לכל מעלה ומעלה״ (אבא גוריון); ״עלה במעלה הראשונה והארי פושט לו יד, ובשניה נשר פושט לו יד״ (אסתר רבה א, יב) — ״כל זה נעשה בחכמת ומלאכת המשקולות״ (יפה ענף שם), ״שהיה עשוי בסיגנון שבעלותו שם על מעלה הראשונה הארי פושט לו יד ובשניה נשר עד ו' המעלות״ (עץ יוסף שם), ״היינו מנגנון שלו תחבולות מלאכתו מנהג של מלאכת האופנים והגלגלים שהיו מתגלגלים ופושטים ידיהם והמלך שלמה היה נשען עליהם כשהיה עולה לכסא״ (פירוש שלום ואמת על פנים אחרים). בראש הכסא: ״הנשרים פורשים גפיהם, ועולים במנגנין, והיו מכסין למעלה על ראשו של מלך, ויונה של זהב יורדת מן העמוד במנגנין, ופותחת הארון ולוקחת ס״ת, ונותנת לתוך ידו של מלך, לקיים מה שנאמר והיתה עמו וקרא בו כל ימי חייו״ (פנים אחרים); ״ונותנה אותו על ברכיו״ (בית המדרש ב). לתרגום שני: ״ומשים ית ריגלא על דרגא קדמיתא תורא דדהבא. פשיט ידיה על דרגא תיניינא ומן תיניינא לתליתאה... ומן שתיתאה נחתין נשרין וחטפין יתיה ומסקין ומותבין יתיה על ריש כורסייה״, ״הוה הדר גישרא רבא ונטיב כיסרא דמלכותא ויהיב ית כיסרא ברישיה דמלכא שלמה ומבתר כן הוה תנינא רבא מפקע במנגנון. והוון אריוון ונשרין סלקין במנגנון ומטללין על ריש מלכא שלמה. ויונא דדהבא הוה נחתא מן עמודא ופתחא ארונא ונסבא סיפרא דאורייתא ויהבה ליה בידוי דמלכא שלמה״, ״והוון אריותא זחלין בוסמנין במסקיה מלכא שלמה למיתב על כורסיה״ — השור פושט את ידו ממקומו ומרים ממעלה למעלה, הנשרים מושיבים, הנשר הגדול מניח את הכתר, התנין מרעיש, האריות והנשרים מצלים, היונה מביאה את ספר התורה, והאריות מזלפים בשמים. לבית המדרש ב: האריות פורשים את לוחות הכתב, המלך קורא בכל מעלה פסוק — ״על מעלה ראשונה אומר, תורת ה' תמימה, בשניה עדות ה' נאמנה, בשלישית פקודי ה' ישרים, ברביעית מצות ה' ברה, בחמישית יראת ה' טהורה, בששית משפטי ה' אמת״ — ״תנין של כסף היה טוען גלגל של כסא וכופין למלך שלמה ומושיבין אותו על הכסא, ומיד פושטין הנשרים את כנפיהם... ויונה של זהב... ונוטלת ספר תורה ונותנה אותו על ברכיו... והארי של שמאל פושט ידו ונוטל העטרה ונותנה על ראש המלך, והעומדים אומרים, תקום מלכות בית דוד לעולם״. עדי שקר (כפתור שני): ״וכד הוון עלין סהדיא דיסהדון קדם מלכא שלמה הוו מנגניא פקעין גלגילא חזרין תורין געיין אריותא נהמין דיבין חטפין אימרין פעיין גימרין בעדן יונקין בכיין שונרין טייסן טווסיין מייללין תרנוגלין מקרקרין בני נצין מחטפין ציפרין מייללין למחטף לבהון דסהדיא דלא יסהדון סהדותא דשיקרא. והוון סהדיא אמרין בלבהון נסהד סהדות דקושטא ואי לא בגינן עלמא מתעקר״ (תרגום שני); ״וכשמעלים את העד לפני שלמה, היו מנגנות פוקעים, גלגלות חוזרים, אריות נוהמין, נשרים פורחין, טווסין רצין, ולמה לחטוף לבם של עדים, בשביל שיעידו אמת״ (פנים אחרים); ״היו הגלגלים של כסא חוזרין, ואריות נוהמין, ונשרים פורחין, וטווסין מצפצפין, וכל כך למה, כדי לחטוף את העדים בלבם כדי להעיד אמת״ (בית המדרש ב). המנגנון — בועה למצגת: בניהו בן יהוידע (הבן איש חי) על סנהדרין קו: (נוסח הספרייה): ״ואני אומר אין מדברים בהלכות מרובות בדבר הנעשה על ידי נס או בשם אך נראה כי מה שנמצא בזמן הזה מגדל פורח באויר שקורין (מרכב אל הוו\"א) העשוי ומתוקן על פי חכמה נפלאה אף על פי שזה נתחדש מכמה שנים הנה בודאי היה מצוי ביד הראשונים קודם זמן דואג ואחיתופל וגם אחריהם ואפשר שהיה גם כן בדורות התנאים אלא שאחר כך נשתכחה חכמה של המגדל הזה וחזר ונתחדש על ידי חכמי אירופא״ — ולכאורה מכאן, שגם מנגנון הכסא פעל בכוח נסתר כעין חשמל. זמני העלייה והרעש, הגלגלים, הזוהר על המעלה, הצללית, אורך היד והכנף, צורת התנועות והבשמים, ומקום הארון ליד המושב — בחירת מודל. העלייה מוצגת בלי דמות המלך: רק רגל מכוסה עולה מעלה מעלה באמצע, וכל חיה נשארת במקומה ורק ידה או כנפה נמשכת עד אמצע המעלה, ששם המלך נשען עליהן. בעדי השקר נשמע רעש, והכפתור ״השתק את הרעש״ משתיק אותו.",
      shields: "מאתיים צינה (״מקפת את האדם משלשה רוחותיו״ — רש״י י, טז) ושלוש מאות מגן (״המגן מרוח א׳״ — מלבי״ם) של זהב שחוט, ״ויתנם המלך בית יער הלבנון״ (י, טז–יז), וכלי זהב סגור (י, כא). המספרים — מן הפסוק; צורתם, מידותיהם ומקומם על הקירות — בחירת מודל לפי ציור ׳מקרא מפורש׳ (שם: ״צורת הכלים והמגינים להמחשה בלבד״).",
      alamAlPeneihem: "״ואולם על פניהם ועמדים ועב על פניהם״ (מלכים א ז, ו). רש״י: ״אולם גבוה עשה על כל הבית״; ועל ״ועמדים ועב על פניהם״: ״ועל כרותות ארזים שעל העמודים התחתונים, הציב על (צריך לומר: עוד) עמודים אחרים, ומרישין מעמוד לעמוד... עב היא מריש״; במודל, כציור ׳מקרא מפורש׳: ״ואולם על פניהם״ — בניין גבוה לפני אולם העמודים; ״ועמדים״ — עמודי קירות הקומה העליונה; ״ועב״ — באולם העמודים בלבד, ואינו נראה במודל; בסוף הגג אין עבים, אלא ״נסרים קטנים, נתונים על מרישין קטנים״ (רש״י ז, ד). רד״ק: אולם העמודים הוא בית שער שקירויו כמין כיפה, ולפניו עוד עמודים ועב (״עץ עב וגדול הוא הנקרא מריש״). רלב״ג: ״ואולם על פניהם״ הוא אולם העמודים עצמו, ״והיו בו עמודים וכרותות ארז עבה היתה על פניהם״. מלבי״ם: ״לפני הבית והאולם היה עוד אולם ולפני האולם השני היו עמודים ועב על פניהם היינו מריש שהוא עץ עב״ — כך נבנתה קריאת מלבי״ם ורלב״ג במודל. מצודת דוד: אולם העמודים ״נסמך לבית היער לפני פתחים, וכדרך בית שער, ועמד ארכו לאורך הבית, להיות מול כל שלשת הפתחים שבשלשת חלקי הבית״, ו״לפני פתחי האולם הזה, עמדו עמודים תקועים בארץ, וממעל להם עץ עב לחברם יחד... לנוי ולפאר, או להיות כעין מחיצה ולשמירה״ — כך נבנתה קריאתו במודל (הקריאה השלישית)."
    };
    for (const l of thrInfoLabels) l.info = ctx.shared.palaceNotes.throneVersions.pesukim;
  }
