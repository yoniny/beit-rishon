  // =============================================================================================================
  // 50-heichal.js - the First Temple house seen from OUTSIDE (buildHeichal):
  //   האוטם (6-amah base) + the 12 steps, the ulam (אולם) with its two wings (בית החליפות), Yachin & Boaz inside the ulam,
  //   the house walls (stepped: מגרעות), the yatzia (יציע: 38 chambers in 3 stories, their cedar beams, לולים), the windows (חלוני
  //   שקופים אטומים), the double ceiling and the roof, the lower ceiling of the devir; the optional layers "עליות" (ctx.layers.aliyot),
  //   "אולם לשיטת הרמב"ם" (ctx.layers.ulamRambam) and the measures of the yatzia section (ctx.layers.yatziaDims). The inside of the house
  //   (doors, gold skins, vessels) is built by 55-interior.js; this module only leaves the heichal doorway (10 x 20) open in the east wall.
  // 1.0.1 (FIXES-1.0.1 A): nothing built here is an occluder - the house, the ulam block and the chambers stay opaque and only the court
  //   walls (20-mount / 30-courts) fade.
  // 1.0.1-K (K.1, the user: "יכין ובועז לא היו נראים כך כלל"): Yachin and Boaz (section 7) rebuilt after Rashi and the book (the user's
  //   reference): a shaft 4 x 18 sunk 2 amot into a capital of 5 (Rashi 7:16: the whole pillar 21); the capital as two basins (Rashi
  //   7:18) - roses on the lower, the belly with 2 rows of 100 pomegranates on chains, the woven dome (7 palm-frond bands, Rashi 7:17) -
  //   and the small capital on top (Rashi 7:18); centres x 6.3, z +-7, as close to the house wall as the doorposts allow (Rashi on Jer
  //   52:23 "סמוך לכותל ההיכל"); instanced (7 draw calls, ~43k triangles); fly points yachinBoaz (in the ulam's front doorway) and
  //   yachinBoazCapital (inside the hall) work with the ulam closed; labels "יכין" / "בועז" at y 33.5; ctx.shared.heichal.pillars.
  // 1.0.1-K (K.2; the user: "לא חיפית את היציעים מצד החיצוני של הבית", "היציעים כברירת מחדל לא מוצגים כשטית רש"י והחישוב של 7, 6 ו 5 עם
  //   הקורות המשמשות לתקרה", "האולם ... מלמעלה", "כברירת מחדל ההיכל צריך להיות סגור מכל צדדיו ורק עם כפתור להסרה"): the yatzia as the book
  //   draws Rashi (pp. ג, ו-ט: the section, the plan, the chambers with and without their outer walls, the door): the house wall 7 / 6 / 5
  //   thick at the three stories and 4 above the chambers' roof (CO.HOUSE_WALL; the inner faces stay, the outer faces z +-17/16/15/14, west
  //   x -70.5..-67.5), the chambers 5 / 6 / 7 wide and 5 high (6:6, 6:10), their ceilings and roof single cedar BEAMS 1 thick lying on the
  //   ledges at 17, 23 and 29 (Rashi 6:6; Metzudat David: the third ledge carries the roof) and on the chamber wall (5 thick: z +-22..27,
  //   x -80.5..-75.5; CO.zHouseS 27, CO.xHeiW -80.5); CLOSED by default - plain ashlar outer walls, the band of roof-beam ends at their top,
  //   one door (6:8) - and opened only by on-model buttons: ctx.yatziaCut = the three outer walls (the roof stays), the SECTION
  //   ctx.shared.yatziaSection (pill "הצג חתך של היציע (רש״י)": the south chambers and the south house wall are built in two segments split
  //   at x -23.5; the eastern one hides and ctx.layers.yatziaDims shows the measures; 1.0.1-K review: its cut faces are in the hide-lists
  //   of their walls - the house wall's in ctx.cutaway, the chamber wall's in ctx.yatziaCut); 38 distinct chambers (a partition where each
  //   long run meets the west run). The ulam block follows the house body: z +-42 (CO.ULAM_WING 15, Middot 4:7); its own walls stay 6
  //   (CO.ULAM_WALL); the wings' back walls (the east wall beyond the house body) now carry the ulam's courses too; fly point ulamInside =
  //   the ulam FROM ABOVE; its wall courses credited to Metzudat David, Ralbag, Malbim and Radak on 7:12 (Rashi there gives only the
  //   pattern). ctx.cutaway = the HOUSE only (its south wall, ceilings, roof) - the ulam has ctx.ulamCut. ctx.shared.anchors. The walls are
  //   boxes with world-aligned uv that meet face to face (no inner faces: no seam lines; hei_boxGeo), the roofs have a 0.3 cornice, the
  //   hidden "עליות" layer is built when first shown (FIXES K 0.6); no overlaps > 0.02 (headless check, K.2 report).
  // 1.0.1-L (FIXES L.6; the user: "תנסה להצמיד ככל האפשר"): Yachin and Boaz pressed as close to the house wall as the doorposts and the
  //   side walls allow - centres x 6.08, z +-7.17 (were 6.3, +-7): 0.02 from the side walls and from the doorposts' corners (ideal surfaces),
  //   0.77 from the wall (was 0.99); the labels, ctx.shared.heichal.pillars and yachinBoazCapital follow (section 7).
  // 1.0.1-L (FIXES L.41-L.45): "הבית מבחוץ" (heichalFront) frames the whole house from the south-east above, as the book's general view
  //   (L.41); the yatzia SECTION rebuilt to teach Rashi's 5 / 6 / 7 at a glance (L.42): the cut moved to x -30.5 (the 3rd south chamber,
  //   with its לולים and door behind the cut, as the book p04L), one colour per story for the wall's band and its chamber, the ledges
  //   yellow under the beams' ends, the measures on one line per story and a legend in the verse's words; the section's pill flies the
  //   camera square-on to the cut and closing it takes the camera out of the closed chambers (L.43); "האולם" (ulamInside) from the front on
  //   the axis, the whole front upright with its doorway (L.44); flyPoints.yachinBoazFull / boazFar = the far views with the ulam CLOSED, the
  //   doorway framing one whole pillar against the whole front (L.45, L.58); the לולים 0.5 west; the door's label in the layer "yatziaWhole"
  //   (hidden while the section is on).
  // 1.0.1-L (FIXES L.59; the user's decision "רוחב 10 גובה 22"): the ulam's front doorway 10 x 22 (was 10 x 20; a model choice - no source
  //   gives the First Temple's ulam doorway a size), its head a flat lintel beam (y 34..35, the jambs' light stone) and TWO CEDAR DOORS
  //   standing open, folded back into the doorway along its reveal like the house's own doors (II Chr 29:7 "גם סגרו דלתות האולם ויכבו
  //   את-הנרות"; Meiri on Yoma 54a: open by day); the doors and their bronze pivots are in ctx.ulamCut; ctx.shared.anchors.ulamFront
  //   1.5 higher; ctx.shared.heichal.ulamDoor (section 6).
  // 1.0.1-L (FIXES L.60; the user: "עיין בפירוש המלבים למעשה שושן (פס' יט) והוסף זאת כאופצי'"): Malbim's reading of the capitals as a
  //   second, switchable reading - ctx.shared.pillarCapital = { current "rashi", keys ["rashi", "malbim"], names, set } (section 7, the
  //   group "yb-malbim", hidden by default): the shaft's head beaten into a lily (7:15, 7:22), the capital of 5 ON the head in two גולות -
  //   the lower 2 under a fringe of 200 pomegranates hanging from seven chains, the upper 3 a closed hat in a copper net (7:16-18, 7:20) -
  //   and 7:19's lily capital PAINTED on the wall at the pillars' head height, 4 x 4; yachinBoazCapital is re-aimed per reading and the
  //   labels יכין / בועז rise with the taller capital.
  // 1.0.1-L (FIXES L.72; the user: "תוסיף את שיטת ר' יוסי בר' יהודה שהיו עוד 2 שולחנות אחד מכסף... ו-1 זהב... הוסף בכפתור נפרד"): the
  //   two tables inside the ulam before the house's doorway (Menachot 99a; Shekalim 6:4 / Menachot 11:7 with marble; Rambam 3:16) -
  //   section 6b, hidden by default, ctx.shared.ulamTables = { current "none", keys ["none", "ryby", "mishnah"], names, set }; the fly
  //   point ulamTables; the layers ulamTables / ulamTablesRyby / ulamTablesMishnah gate their labels (not user options).
  // 1.0.1-L (the verifier of round L): Malbim's hanging pomegranates faced inward (their lathe's profile ran downward) and his lily rim is 1 high (7:22), the close view of his capital and
  //   the doorway view per reading (FP_CAP, FP_YB), the far views yachinBoazFull / boazFar (L.58), the ulam's view from x 84 (the whole front), heichalWest's target outside the chambers,
  //   the doors' leaves 0.02 from the jambs and their pivots joined to leaf and frame, the jambs and lintel one mesh (no seam at the joint), the tables' labels inside their view, three misquoted comments.
  // Coordinates: 1 unit = 1 amah, +x east (front), +z south (right), y up; house floor LV.HEI = 12, inner court LV.AZ = 6.
  // 1.0.1-L (A14): under the reading "malbim" of pillarCapital the pillars stand before the ulam (sec. 7, sec. 12); Rashi's default is untouched.
  // DEV notes (disputes not modelled here): Malbim alone puts Yachin and Boaz OUTSIDE, in front of the ulam (7:21 "לפני האולם וסמוך לו")
  //   - not modelled (1.0.1-L, L.60: his capitals and his painted lily of 7:19 ARE the option "malbim" of ctx.shared.pillarCapital, with
  //   the pillars kept inside the ulam, so the lily is painted on the wall they stand by here); Radak and Metzudot sink the shaft only half an amah into the capital (total 22.5 - the 1.0.0 /
  //   1.0.1 build; more in section 7); Radak and Metzudot read "הצלע התיכונה" (6:8) as the MIDDLE STORY (here the middle chamber of the lowest row, after
  //   Rashi and the Targum); Rashi on II Chr 3:7 and Radak on 6:9 describe a vaulted ceiling ("כספינה הפוכה", "כמין כיפה") - flat here;
  //   Malbim on II Chr 3:4: the ulam had no ceiling at all up to 120 - not modelled; Radak's main view (II Chr 3:4): only the ulam is
  //   120 high - not modelled (the "עליות" layer follows Rashi there: 30 + 90 over the whole house); Middot 4:7 (the Second Temple) has the
  //   house wall 6 throughout (the 1.0.1 build) - here the book's 7 / 6 / 5 / 4; Radak on 7:12 says "וכן עשה לבנין הבית כבנין הזה" - read
  //   here with the others as the ulam's courses, but the words may mean the whole house, and the book's general view (p. א) draws the house
  //   banded too: the house walls stay plain hewn stone (6:7 "אבן שלמה מסע") - a question for the user. The ulam's doorway (1.0.1-L,
  //   L.59): Rashi on 7:5 "ולא עשויין כפה כעין פתחי אולם" pictures an arched head - flat here, as the book's general view; the curtain
  //   before its open doors (Meiri on Yoma 54a; Yoma 54a "ואחת לפתחו של אולם") is not built; Middot 3:7 (40 x 20) and 2:3 "חוץ משל
  //   אולם" (no doors) are the Second Temple.
  // =============================================================================================================
  var HEI_STAIR_W = 24; // width of the 12 steps up to the ulam (model choice; spec 6). The steps end at x 24.5 (z +-12); the laver / bases
                        // row of 45-vessels.js (vsl_layout) stands at CO.kiyorX / CO.mechX = 27, 0.5 east of the lowest step; the Sea
                        // stands in the court's corner (1.0.1-L, CO.seaX 80).
  function hei_m4(x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const m = new Matrix4();
    m.compose(new Vector3(x, y, z), new Quaternion().setFromEuler(new Euler(rx, ry, rz)), new Vector3(sx, sy, sz));
    return m;
  }
  function hei_inst(parent, geo, mat, mats, shadows = true) {
    const im = new InstancedMesh(geo, mat, mats.length);
    mats.forEach((mm, i) => im.setMatrixAt(i, mm));
    im.castShadow = shadows;
    im.receiveShadow = shadows;
    parent.add(im);
    return im;
  }
  // 1.0.1-K (K.2): WORLD-ALIGNED uv. H.box restarts the texture at every box's corner, so a wall built of pieces (the stepped bands, the
  // two segments of the section, the piers of a door) showed seams; here u / v are world amot (the textures repeat every 1 / tile), so the
  // ashlar courses run on across the pieces. hei_worldUV maps a geometry that is already in world coordinates (flat normals): faces +-z ->
  // (x, y + v0), faces +-x -> (-z, y + v0), top / bottom -> (x, -z). v0 sets where the courses start (the stone texture has a course every
  // 3 amot from v = 0).
  function hei_worldUV(geo, v0 = 0) {
    const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (ay >= ax && ay >= az) uv.setXY(i, x, -z);
      else if (ax >= az) uv.setXY(i, -z, y + v0);
      else uv.setXY(i, x, y + v0);
    }
    uv.needsUpdate = true;
    return geo;
  }
  // Axis-aligned boxes merged into ONE geometry (one draw call per list). A box: { x0, x1, y0, y1, z0, z1, uv?, v0?, tone?, endTone?, skip? } -
  // uv "wall" (default): as hei_worldUV; "beamX" / "beamZ": a beam along x / z - the grain (the texture's u) runs along the beam on its four
  // long faces, the end faces show (across, y); tone: a vertex colour for the whole beam (the material needs vertexColors), the two end
  // faces tone * endTone (so that the ends of beams lying side by side read as separate beams).
  // 1.0.1-K: NO INNER FACES. Where two boxes of the list share a whole face (the same rectangle, facing each other) both faces are dropped,
  // and skip ("px,nx,py,ny,pz,nz": the faces at x1, x0, y1, y0, z1, z0) drops faces that lie against another mesh. An inner face that ends
  // on a seam of two coplanar outer faces draws a dashed line along the seam (seen in the headless pictures at the section's cut, the door's
  // head and the corners), so the walls are built of boxes that meet face to face. share = false skips that test (boxes that never touch:
  // the beams). Written straight into typed arrays (FIXES K 0.6: the beams are ~530 boxes).
  var HEI_FACES = ["px", "nx", "py", "ny", "pz", "nz"];
  var HEI_FN = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  // the four corners of face f, counter-clockwise seen from outside: indices into [x0, x1] / [y0, y1] / [z0, z1] (0 = min, 1 = max)
  var HEI_FQ = [
    [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]], [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]], [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]],
    [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]]
  ];
  function hei_boxGeo(boxes, share = true) {
    const n = boxes.length, keep = new Uint8Array(n * 6);
    const rk = (v) => Math.round(v * 1e4);
    const keyOf = (b, f) => (f < 2 ? "x" + rk(f ? b.x0 : b.x1) + "|" + rk(b.y0) + "|" + rk(b.y1) + "|" + rk(b.z0) + "|" + rk(b.z1)
      : f < 4 ? "y" + rk(f === 3 ? b.y0 : b.y1) + "|" + rk(b.x0) + "|" + rk(b.x1) + "|" + rk(b.z0) + "|" + rk(b.z1)
      : "z" + rk(f === 5 ? b.z0 : b.z1) + "|" + rk(b.x0) + "|" + rk(b.x1) + "|" + rk(b.y0) + "|" + rk(b.y1));
    for (let i = 0; i < n; i++) for (let f = 0; f < 6; f++) keep[i * 6 + f] = !boxes[i].skip || boxes[i].skip.indexOf(HEI_FACES[f]) < 0 ? 1 : 0;
    if (share) {                                                 // a face is dropped where another box's opposite face lies on it
      const keys = new Array(n * 6), seen = new Map();
      for (let i = 0; i < n; i++) for (let f = 0; f < 6; f++) if (keep[i * 6 + f]) {
        const k = keyOf(boxes[i], f);
        keys[i * 6 + f] = k;
        seen.set(k, (seen.get(k) || 0) | (f & 1 ? 2 : 1));
      }
      for (let i = 0; i < n * 6; i++) if (keep[i] && seen.get(keys[i]) & (i & 1 ? 1 : 2)) keep[i] = 0;
    }
    let nf = 0;
    for (let i = 0; i < n * 6; i++) nf += keep[i];
    const withCol = boxes.some((b) => b.tone != null);
    const pos = new Float32Array(nf * 12), nrm = new Float32Array(nf * 12), uv = new Float32Array(nf * 8), col = withCol ? new Float32Array(nf * 12) : null;
    const idx = nf * 4 > 65535 ? new Uint32Array(nf * 6) : new Uint16Array(nf * 6);
    const X = [0, 0], Y = [0, 0], Z = [0, 0];
    let q = 0;                                                   // faces written
    for (let i = 0; i < n; i++) {
      const b = boxes[i], mode = b.uv || "wall", v0 = b.v0 || 0;
      const t = b.tone != null ? b.tone : 1, te = t * (b.endTone != null ? b.endTone : 1);
      X[0] = b.x0; X[1] = b.x1; Y[0] = b.y0; Y[1] = b.y1; Z[0] = b.z0; Z[1] = b.z1;
      for (let f = 0; f < 6; f++) {
        if (!keep[i * 6 + f]) continue;
        const fn = HEI_FN[f], nx = fn[0], ny = fn[1], nz = fn[2], end = (mode === "beamX" && nx !== 0) || (mode === "beamZ" && nz !== 0), c = end ? te : t;
        for (let v = 0; v < 4; v++) {
          const cq = HEI_FQ[f][v], x = X[cq[0]], y = Y[cq[1]], z = Z[cq[2]], p = q * 4 + v;
          pos[p * 3] = x; pos[p * 3 + 1] = y; pos[p * 3 + 2] = z;
          nrm[p * 3] = nx; nrm[p * 3 + 1] = ny; nrm[p * 3 + 2] = nz;
          let u, w;
          if (mode === "beamZ") { u = nz !== 0 ? x : z; w = ny !== 0 ? x : y; }
          else if (mode === "beamX") { u = nx !== 0 ? z : x; w = ny !== 0 ? z : y; }
          else if (ny !== 0) { u = x; w = -z; }
          else { u = nx !== 0 ? -z : x; w = y + v0; }
          uv[p * 2] = u; uv[p * 2 + 1] = w;
          if (col) { col[p * 3] = c; col[p * 3 + 1] = c * 0.97; col[p * 3 + 2] = c * 0.94; }
        }
        const base = q * 4, o = q * 6;
        idx[o] = base; idx[o + 1] = base + 1; idx[o + 2] = base + 2; idx[o + 3] = base; idx[o + 4] = base + 2; idx[o + 5] = base + 3;
        q++;
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("normal", new BufferAttribute(nrm, 3));
    geo.setAttribute("uv", new BufferAttribute(uv, 2));
    if (col) geo.setAttribute("color", new BufferAttribute(col, 3));
    geo.setIndex(new BufferAttribute(idx, 1));
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    return geo;
  }
  // a mesh of merged boxes; userData.boxes keeps the boxes for the headless overlap checks (FIXES K 0.3)
  function hei_boxMesh(parent, boxes, mat, name, share = true) {
    const m = new Mesh(hei_boxGeo(boxes, share), mat);
    m.castShadow = m.receiveShadow = true;
    if (name) m.name = name;
    m.userData.boxes = boxes.map((b) => [b.x0, b.x1, b.y0, b.y1, b.z0, b.z1]);
    parent.add(m);
    return m;
  }
  // A wall slab with rectangular holes at ANY height (H.wall only cuts door-like openings that start at the floor), in WORLD coordinates
  // with world-aligned uv (1.0.1-K). axis "x": the wall runs along x (cx = centre x, cz = its plane); axis "z": runs along z. holes: [{c, b,
  // w, h}] with c = offset of the hole centre along the wall from the wall's centre (world sign), b = hole bottom above y.
  // occlude defaults to false since 1.0.1 (fix A.1): no wall of the house is an occluder.
  function hei_holeWallGeo({ axis = "x", length, height, thickness = 4, cx = 0, cz = 0, y = 0, holes = [], v0 = 0 }) {
    const shape = new Shape();
    shape.moveTo(-length / 2, 0);
    shape.lineTo(length / 2, 0);
    shape.lineTo(length / 2, height);
    shape.lineTo(-length / 2, height);
    shape.closePath();
    for (const o of holes) {
      const c = axis === "z" ? -(o.c || 0) : o.c || 0; // an axis-"z" wall is turned +90 deg about y: local +x = world -z
      const w2 = o.w / 2, b = o.b || 0, t = b + o.h;
      const p = new Path();
      p.moveTo(c - w2, b);
      p.lineTo(c + w2, b);
      p.lineTo(c + w2, t);
      p.lineTo(c - w2, t);
      p.closePath();
      shape.holes.push(p);
    }
    const geo = new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 4 });
    geo.translate(0, 0, -thickness / 2);
    if (axis === "z") geo.rotateY(Math.PI / 2);
    geo.translate(cx, y, cz);
    return hei_worldUV(geo, v0);
  }
  function hei_holeWall(H, parent, opts) {
    const m = new Mesh(hei_holeWallGeo(opts), opts.mat);
    m.castShadow = m.receiveShadow = true;
    const a = opts.axis === "z", L2 = opts.length / 2, T2 = (opts.thickness || 4) / 2, cx = opts.cx || 0, cz = opts.cz || 0, y = opts.y || 0;
    m.userData.boxes = [a ? [cx - T2, cx + T2, y, y + opts.height, cz - L2, cz + L2] : [cx - L2, cx + L2, y, y + opts.height, cz - T2, cz + T2]];
    m.userData.holeT = a ? "x" : "z";                                     // the axis of the wall's thickness
    m.userData.holes = (opts.holes || []).map((o) => {                    // the openings, for the same checks (what stands in a doorway is no overlap)
      const c = o.c || 0, b = y + (o.b || 0);
      return a ? [cx - T2, cx + T2, b, b + o.h, cz + c - o.w / 2, cz + c + o.w / 2] : [cx + c - o.w / 2, cx + c + o.w / 2, b, b + o.h, cz - T2, cz + T2];
    });
    parent.add(m);
    if (opts.occlude) H.occ(m);
    return m;
  }
  // Splayed window reveal (I Kings 6:4, Rashi / Menachot 86b: wide outside, narrow inside): four trapezoid faces from an outer
  // rectangle ow x oh (local z = 0) to an inner rectangle iw x ih (local z = -depth), normals pointing INTO the opening.
  function hei_splayGeo(THREE, ow, oh, iw, ih, depth) {
    const o = [[-ow / 2, -oh / 2, 0], [ow / 2, -oh / 2, 0], [ow / 2, oh / 2, 0], [-ow / 2, oh / 2, 0]];
    const n = [[-iw / 2, -ih / 2, -depth], [iw / 2, -ih / 2, -depth], [iw / 2, ih / 2, -depth], [-iw / 2, ih / 2, -depth]];
    const quads = [[o[0], o[1], n[1], n[0]], [o[3], n[3], n[2], o[2]], [o[0], n[0], n[3], o[3]], [o[1], o[2], n[2], n[1]]];
    const pos = [], uv = [];
    const tuv = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]];
    for (const q of quads) {
      const tri = [q[0], q[1], q[2], q[0], q[2], q[3]];
      for (let i = 0; i < 6; i++) {
        pos.push(tri[i][0], tri[i][1], tri[i][2]);
        uv.push(tuv[i][0] * ow, tuv[i][1] * depth);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
    g.computeVertexNormals();
    return g;
  }
  async function buildHeichal(ctx) {
    const { H, M, CO, LV } = ctx;
    const g = new Group();
    g.name = "heichal";
    ctx.root.add(g);
    const cut = [];                   // -> ctx.cutaway (the UI's "פתח את הבית"): the south HOUSE wall, its windows, the house ceilings and roof
    const sec = [];                   // 1.2.2 -> ctx.sectionCut (the UI's section, "פתח את העליות" / "בית דילפא"); 1.2.3: seen from the EAST (the user) -
                                      // the house's east wall (with the ulam, ctx.ulamCut, hidden by the UI with it); the ceilings stay, cut at their east end
    ctx.yatziaCut = [];               // the three OUTER walls of the chambers (the UI's "הסר את קירות היציע"; the roof stays: the book p. ח)
    ctx.ulamCut = [];                 // the ulam's front wall with its doorway trim, its ceilings and its roof (the UI's "פתח את האולם")
    // ---- levels and coordinates (10-core.js) ----
    const F = LV.HEI;                 // 12: the house floor (6 above the inner court: 12 steps, Middot 3:6 as a model choice)
    const AZ = LV.AZ;                 // 6: the inner court
    const E = CO.xUlamE;              // 18.5: outer face of the ulam front wall (ulam wall 6: Rashi on Sanhedrin 100a "וכותל האולם שש")
    const UI = CO.xUlamIn;            // 12.5: inner face of the ulam front wall
    const HE = CO.xHouseE;            // 2.5: east face of the house wall (ulam hall 10 deep, I Kings 6:3 "עשר באמה רחבו")
    const KE = CO.xKodeshE;           // -3.5: inner face of the east wall
    const DE = CO.xDevirE;            // -44.5: east face of the devir (amah traksin 1, Yoma 51b / Bava Batra 3a)
    const DW = CO.xDevirW;            // -63.5: inner face of the west wall (kodesh 40 + traksin 1 + devir 19: I Kings 6:17, 6:20)
    const HW = CO.xHouseW;            // -70.5: outer face of the west wall at the lowest story (7 thick)
    const YW = CO.xHeiW;              // -80.5: outer face of the west chamber wall (house wall 7 + chamber 5 + chamber wall 5)
    const ZT = CO.zHouseS;            // 27: outer face of the north / south chamber walls (10 + 7 + 5 + 5)
    const ZW = ZT + CO.ULAM_WING;     // 42: the ulam block is 15 wider than the house body on each side (Middot 4:7 "האולם עודף עליו חמש
                                      // עשרה אמה מן הצפון וחמש עשרה אמה מן הדרום, והוא היה נקרא בית החליפות"; Rashi on Yoma 36a)
    const HH = CO.HOUSE_H;            // 30: inner height of the house (I Kings 6:2 "ושלשים אמה קומתו")
    const CEIL = F + HH;              // 42: the lower ceiling
    const TOP = CEIL + 4;             // 46: top of the walls: lower ceiling 1 + air "בית דילפא" 2 + upper ceiling 1 (Rambam quoted by Malbim on 6:9)
    const ROOF = TOP + 1.5;           // 47.5: top of the stone roof slab (model choice)
    const WT = CO.HOUSE_WALL;         // [7, 6, 5, 4]: the house wall at the three stories of the chambers and above their roof (sec. 3)
    const EWT = HE - KE;              // 6: the EAST wall of the house (between the ulam and the kodesh; no chambers there): Middot 4:7 "כתל ההיכל שש"
    const UWT = CO.ULAM_WALL;         // 6: the ulam's own walls - its hall's side walls and the wings' outer walls (model choice = its front wall)
    const YH = CO.YATZIA_H;           // 5: the CLEAR height of each story of the chambers (I Kings 6:10 "חמש אמות קומתו", Rashi "של כל אחד ואחד")
    const BT = CO.YATZIA_BEAM;        // 1: the cedar beams of the chambers' ceilings and roof (model choice after the book; Rashi 6:10 "לבד עבי התקרה")
    const BW = BT - 0.06;             // 0.94: a beam's width - the beams lie side by side, 1 apart (a 0.06 joint between them: model choice)
    const SY = [F, F + YH + BT, F + 2 * (YH + BT)];   // 12, 18, 24: the floor of each story = 5 clear + a beam 1 (Rashi 6:6, 6:10)
    const ST = SY.map((y) => y + YH); // 17, 23, 29: the top of each story's clear height = the three ledges (מגרעות) of the house wall
    const YROOF = ST[2];              // 29: the roof beams of the chambers lie on the third ledge and on the chamber walls (29..30)
    const YRT = YROOF + BT;           // 30: the top of the chambers' roof (12 + 5 + 1 + 5 + 1 + 5 + 1: "חמש עשרה אמות, לבד עבי התקרה", Rashi 6:10)
    const WY = [F, ST[0], ST[1], ST[2], TOP];   // 12, 17, 23, 29, 46: the bands of the house wall - 7, 6, 5 and 4 thick (sec. 3)
    const TA = CO.TA_WALL;            // 5: the chamber wall, כותל התא (Middot 4:7 "וכתל התא חמש"; the book p. ו)
    const TA_IN = ZT - TA;            // 22: inner face of the north / south chamber walls
    const XW_IN = YW + TA;            // -75.5: inner face of the west chamber wall
    const wx = WT.map((t) => DW - t); // -70.5, -69.5, -68.5, -67.5: outer face of the west wall per band
    const zOut = (k) => 10 + WT[Math.min(k, WT.length - 1)];   // 17, 16, 15, 14: outer face (abs z) of the north / south house wall per band
    // the cut of the yatzia section (sec. 4, 11). 1.0.1-L (L.42; was -23.5, mid-kodesh in the 4th south chamber, where the camera had
    // only 20 amot before the house's east wall at x -3.5 - too close to see the three stories whole, square-on): -30.5 = 0.2 west of the
    // east end of the 3rd south chamber (x -42.7..-30.3, sec. 4), on a joint of the beams (they lie every 1 amah from x -69.5 / -68.5 /
    // -67.5), so the three floors are cut clean, the whole 3rd chamber - with the לולים and the outside door - stands behind the cut (the
    // book p04L draws the לולים in its section), and the camera has 26.5 amot of the opened segment in front of the cut (model choice)
    const X0 = -30.5;
    if (HW !== wx[0] || YW !== HW - CO.YATZIA_W[0] - TA || ZT !== zOut(0) + CO.YATZIA_W[0] + TA) {
      console.warn("[heichal] CO.xHouseW / xHeiW / zHouseS do not match CO.HOUSE_WALL, YATZIA_W and TA_WALL:", HW, YW, ZT);
    }
    const dark = new MeshStandardMaterial({ color: 0x2a241c, roughness: 1, metalness: 0 });
    const bandWall = (parent, { axis, from, to, fixed, thickness, y0, y1, opening = null, skipFrom = false, skipTo = false, extraSkip = "", into = null }) => {
      // I Kings 7:12 "וחצר הגדולה סביב שלשה טורים גזית וטור כרתת ארזים ולחצר בית ה' הפנימית ולאלם הבית": the ulam's walls built like the
      // great court's wall - so Metzudat David ("וכמו הבנין אשר בנה לחצר בית ה' האמור למעלה, וכן בנה את האולם אשר לפני ההיכל, כי כולם בנה
      // בשלשה טורים גזית"), Ralbag ("וכן היה לאולם הבית ר"ל האולם אשר לפני ההיכל והדביר"), Malbim ("וכן היה לחצר בית ה' הפנימית ולאולם
      // הבית") and Radak ("וכן עשה לבנין הבית כבנין הזה") read the verse (Targum "ולאולמא דביתא"); Rashi on 7:12 describes the pattern only
      // ("החומה עשויה שלשה נדבכין של אבנים, ונדבך של עץ עליהם") - the 1.0.1 comment credited him wrongly. Metzudat David: "שלש שורות זו על גב
      // זו, ועליהם שורה הרביעית היה מארזים... וכמו כן עד כלות גובה הכתלים": 3 courses of hewn stone (3 high) + 1 course of cedar (1 high),
      // repeating from the floor; the course heights are a model choice (the book's general view draws the ulam banded so).
      // 1.0.1-K: one mesh of stone and one of cedar per wall (merged boxes, world-aligned uv along the wall; each stone course shows one row
      // of ashlars). The courses lie face to face: a course's top is dropped where the course above covers it, its bottom where it sits on
      // a course (all but the course over an opening, split at the opening's edges so that only its part over the opening keeps a bottom);
      // skipFrom / skipTo drop the end faces that lie against another wall. An opening's top must be a course boundary. Plain opaque meshes
      // (fix A.1), returned for the cut lists.
      const parts = { s: [], c: [] };
      const fromCode = axis === "z" ? "nz" : "nx", toCode = axis === "z" ? "pz" : "px";
      const oL = opening ? opening.center - opening.width / 2 : 0, oR = opening ? opening.center + opening.width / 2 : 0;
      const place = (a, b, p, q, cedar, vBase, bottomShows) => {
        if (q - p < 1e-3 || b - a < 1e-3) return;
        const bx = axis === "z" ? { x0: fixed - thickness / 2, x1: fixed + thickness / 2, z0: p, z1: q } : { x0: p, x1: q, z0: fixed - thickness / 2, z1: fixed + thickness / 2 };
        const skip = [b < y1 - 1e-6 ? "py" : "", bottomShows ? "" : "ny", skipFrom && Math.abs(p - from) < 1e-6 ? fromCode : "",
          skipTo && Math.abs(q - to) < 1e-6 ? toCode : "", extraSkip].filter(Boolean).join(",");
        parts[cedar ? "c" : "s"].push(Object.assign(bx, { y0: a, y1: b, v0: -vBase, skip }));
      };
      let y = y0;
      while (y < y1 - 1e-6) {
        const rel = y - F, k = Math.floor(rel / 4 + 1e-9), ph = rel - 4 * k;
        const cedarBand = ph >= 3 - 1e-9;
        const bandBot = F + 4 * k + (cedarBand ? 3 : 0);
        const top = Math.min(y1, F + 4 * k + (cedarBand ? 4 : 3));
        if (opening && y < opening.top - 1e-6) {
          place(y, top, from, oL, cedarBand, bandBot, false);
          place(y, top, oR, to, cedarBand, bandBot, false);
        } else if (opening && Math.abs(y - opening.top) < 1e-6) {
          place(y, top, from, oL, cedarBand, bandBot, false);
          place(y, top, oL, oR, cedarBand, bandBot, true);      // the head of the opening
          place(y, top, oR, to, cedarBand, bandBot, false);
        } else place(y, top, from, to, cedarBand, bandBot, false);
        y = top;
      }
      if (into) {                                               // collect into one stone and one cedar list (several walls -> 2 draw calls)
        into.s.push(...parts.s);
        into.c.push(...parts.c);
        return [];
      }
      const out = [];
      if (parts.s.length) out.push(hei_boxMesh(parent, parts.s, M.stone, "ulam-stone"));
      if (parts.c.length) out.push(hei_boxMesh(parent, parts.c, M.cedar, "ulam-cedar"));
      return out;
    };
    const ulamWalls = { s: [], c: [] };                         // the ulam block's walls that stay (all but the front wall)
    const layerLabel = (grp, text, x, y, z, size, extra) => {
      // a label that belongs to an optional layer (SPEC 6 contract): pushed to ctx.labels with `layer` = the key of its ctx.layers
      // group (the group names are exactly "aliyot" / "ulamRambam" / "yatziaDims"); 70-ui.js shows it only while that layer is visible,
      // and the "תוויות" toggle and the distance scaling apply to it like to every other label (a sprite built inside the group would skip both).
      // 1.0.1-L: extra fields (the yatzia section's labels carry dim: what they measure, for the UI's explanations)
      ctx.labels.push(Object.assign({ text, x, y, z, size, layer: grp.name }, extra || {}));
    };
    // the EAST segment of the south side (x -30.5..-3.5; 1.0.1-L: was -23.5..-3.5): the south house wall, its four windows, the south chamber wall, the chambers'
    // beams and partitions there - hidden by the yatzia section (ctx.shared.yatziaSection, sec. 11) as a group, so the UI's hide-lists (which
    // set .visible on the meshes themselves) never fight with it
    const segE = new Group();
    segE.name = "yatziaSectionEast";
    g.add(segE);
    // the cut faces at x -30.5 (the house wall's steps and the chamber wall), shown only with the section: while the eastern segment stands
    // there they would be inner faces (sec. 4); each is also in the hide-list of its wall (sec. 3; 1.0.1-K review)
    const secCaps = new Group();
    secCaps.name = "yatziaSectionCaps";
    secCaps.visible = false;
    g.add(secCaps);

    // ============================================================ 1. האוטם and the steps ============================================================
    // Solid base under the whole house incl. the ulam block and the wings: x -80.5..18.5, z +-42, y 6..12
    // (Middot 4:6 "האטם שש אמות" as a convention; Malbim on I Kings 6:8 mentions a 6-amah base; the book p. ג "האוטם 6 אמות").
    hei_boxMesh(g, [{ x0: YW, x1: E, y0: AZ, y1: F, z0: -ZW, z1: ZW }], M.stone, "otem");
    // 12 steps (rise 0.5, tread 0.5) from the inner court (y 6) at x 24.5 up to the ulam floor (y 12) at x 18.5: Middot 3:6 applied as a model choice
    H.stairs(g, { width: HEI_STAIR_W, totalRise: F - AZ, steps: 12, dir: "W", x: E + 6, y: AZ, z: 0, tread: 0.5, mat: M.stoneSmooth });

    // ============================================================ 2. the east wall of the house ============================================================
    // x -3.5..2.5 (6 thick: Middot 4:7, Rashi Sanhedrin 100a "כותל מזרח שש"; no chambers along it, so it does not step), spanning the whole
    // ulam block z +-42 (it closes the chamber runs and the wings on the west), y 12..46, with the heichal doorway 10 wide x 20 high (model
    // choice after Middot 4:1; 55-interior.js dresses it with posts and doors). Opaque (1.0.1 fix A.1).
    // 1.0.1-K: the middle, z +-27 (the house body), is plain hewn stone like the house walls; the two outer parts, z +-27..+-42, are the back
    // walls of the wings - the ulam block - and carry the ulam's courses (7:12, see bandWall) like the rest of the block, as the book's general
    // view draws the ulam banded all round (1.0.1 had them plain, so the block's side faces showed a plain strip). Boxes face to face.
    {
      const DH = F + 20;                                                    // the heichal doorway: z +-5, y 12..32
      const eb = (y0, y1, z0, z1) => ({ x0: KE, x1: HE, y0, y1, z0, z1, v0: 2,
        skip: [y0 === F ? "ny" : "", z0 === -ZT ? "nz" : "", z1 === ZT ? "pz" : ""].filter(Boolean).join(",") });
      sec.push(hei_boxMesh(g, [eb(F, DH, -ZT, -5), eb(DH, TOP, -ZT, -5), eb(DH, TOP, -5, 5), eb(F, DH, 5, ZT), eb(DH, TOP, 5, ZT)], M.stone, "house-wall-e"));   // 1.2.3: the section (ctx.sectionCut)
      for (const s of [-1, 1]) {
        // z 27..36 and 36..42 (the part beside the wing's outer wall has no east face of its own: the wall lies against it)
        const pick = (a, b) => (s > 0 ? [a, b] : [-b, -a]);
        const [a0, a1] = pick(ZT, ZW - UWT), [b0, b1] = pick(ZW - UWT, ZW);
        bandWall(g, { axis: "z", from: a0, to: a1, fixed: (KE + HE) / 2, thickness: EWT, y0: F, y1: TOP, skipFrom: true, skipTo: true, into: ulamWalls });
        bandWall(g, { axis: "z", from: b0, to: b1, fixed: (KE + HE) / 2, thickness: EWT, y0: F, y1: TOP, skipFrom: s > 0, skipTo: s < 0, extraSkip: "px", into: ulamWalls });
      }
    }

    // ============================================================ 3. the house walls (north, south, west) ============================================================
    // Plain hewn stone (I Kings 6:7 "אבן שלמה מסע", 7:9-11), stepped after Rashi on 6:6 ("קומת התא חמש אמות, וכשעולה כתל ההיכל חמש אמות,
    // גורע את עביו, וכנס בו אמה לפנים, והניח על אותה כניסה ראשי קורות גג עלית התא, שהיא קרקעית לאמצעית, וכשעולה עשר, כנס אמה") as the book
    // draws it (the user's reference, pp. ג, ו: "7 / 6 / 5 אמות", and 4 above the chambers' roof): 7 thick from the floor 12 to the first
    // ledge at 17, 6 up to the second ledge at 23, 5 up to the third ledge at 29 (Metzudat David 6:6 "וכן פחתו אמה בכלות חמשה עשר אמות,
    // להניח על כניסת האמה קורות תקרת השלישים"; Radak 6:5, on "יציע סביב" - 1.0.1-K review: not 6:6, Radak has no entry there - "הנה
    // קיר הבית בעליונה היה צר ממה שהיה למטה בתחתונה שתי אמות") and 4 above it, up to the top of the walls at 46. The ledges stand 6
    // (not 5) apart because each story's ceiling has its own thickness (Rashi 6:10 "הרי גבהן חמש עשרה אמות, לבד עבי התקרה"). The inner
    // faces stay (z +-10, west x -63.5); the outer faces are z +-17 / 16 / 15 / 14 and west x -70.5 / -69.5 / -68.5 / -67.5. 1.0.1 had 6 / 5 / 4 (Middot 4:7, a Second-Temple measure). The courses: world-aligned, every 3 amot
    // from y 13 (so that the top course ends at 46). Boxes face to face (hei_boxGeo): the north and south walls take the corners, the west
    // wall lies between them (z +-10), the band above the chambers' roof is a grid of boxes round the windows. The south wall is in the
    // general cutaway, in two segments split at X0 (the section, sec. 4); the west wall's south end gets its own face (in ctx.interiorOnly,
    // which 70-ui.js shows only while the house is opened) since the south wall's corner covers it otherwise.
    // 6 windows per side (the user's sheet, item 16: model choice - no number in the sources) spaced evenly along the KODESH only,
    // x -43.5..-3.5 (bays of 6.67: centres -40.2, -33.5, -26.8, -20.2, -13.5, -6.8), in the 4-thick band above the chambers' roof; none in
    // the devir and none in the west wall: model choice, no source for devir windows (SPEC 6; research part 3 "החלונות")
    const WIN_X = [0, 1, 2, 3, 4, 5].map((i) => CO.xKodeshW + (i + 0.5) * (CO.xKodeshE - CO.xKodeshW) / 6);
    const WIN_Y = 34;                                     // centre of the window band y 32.75..35.25, above the chambers' roof (30) (model choice)
    const WIN_OW = 3, WIN_OH = 2.5, WIN_IW = 1, WIN_IH = 1; // outside 3 x 2.5, inside 1 x 1 (Rashi on 6:4: "פתוחים מבחוץ ואטומים מבפנים")
    const ROW4 = [WY[3], WIN_Y - WIN_OH / 2, WIN_Y + WIN_OH / 2, TOP];    // the band above the roof in rows: under, beside and over the windows
    const rowsOf = (k) => (k < 3 ? [[WY[k], WY[k + 1]]] : [[ROW4[0], ROW4[1]], [ROW4[1], ROW4[2]], [ROW4[2], ROW4[3]]]);
    const zsOf = (s, k) => (s > 0 ? [10, 10 + WT[k]] : [-10 - WT[k], -10]);
    const sk = (...codes) => codes.filter(Boolean).join(",");
    // band k of a long side between xa and xb (band 3: a grid round the windows); dropA / dropB drop the end faces at xa / xb
    const bandBoxes = (s, k, xa, xb, dropA, dropB) => {
      const [z0, z1] = zsOf(s, k), xs = [xa];
      if (k === 3) for (const x of WIN_X) if (x > xa + 1e-6 && x < xb - 1e-6) xs.push(x - WIN_OW / 2, x + WIN_OW / 2);
      xs.push(xb);
      const out = [];
      for (let i = 0; i + 1 < xs.length; i++) rowsOf(k).forEach(([y0, y1], r) => {
        if (k === 3 && i % 2 === 1 && r === 1) return;                      // a window
        out.push({ x0: xs[i], x1: xs[i + 1], y0, y1, z0, z1, v0: 2, skip: sk(r === 0 && "ny", i === 0 && dropA && "nx", i + 2 === xs.length && dropB && "px") });
      });
      return out;
    };
    // the corner of a long side (x -70.5..-63.5 at band 0 ...) and the west wall between the corners (z -10..10)
    const cornerBoxes = (s, k, drop) => {
      const [z0, z1] = zsOf(s, k);
      return rowsOf(k).map(([y0, y1], r) => ({ x0: DW - WT[k], x1: DW, y0, y1, z0, z1, v0: 2, skip: sk(r === 0 && "ny", drop) }));
    };
    const westBoxes = (k) => rowsOf(k).map(([y0, y1], r) => ({ x0: DW - WT[k], x1: DW, y0, y1, z0: -10, z1: 10, v0: 2, skip: sk(r === 0 && "ny", "pz") }));
    const NW = [], SWEST = [], SEAST = [];
    for (let k = 0; k < 4; k++) {
      NW.push(...bandBoxes(-1, k, DW, KE, false, true), ...cornerBoxes(-1, k), ...westBoxes(k));   // its east end lies against the east wall
      SWEST.push(...bandBoxes(1, k, DW, X0, false, true), ...cornerBoxes(1, k, "nz"));           // its corner's north face lies against the west wall
      SEAST.push(...bandBoxes(1, k, X0, KE, true, true));
    }
    hei_boxMesh(g, NW, M.stone, "house-wall-nw");
    cut.push(hei_boxMesh(g, SWEST, M.stone, "house-wall-s"), hei_boxMesh(segE, SEAST, M.stone, "house-wall-s-east"));   // "פתח את הבית" removes the SOUTH wall
    {
      // the west wall's south end (z 10), seen only while the south wall is off (ctx.interiorOnly: 70-ui.js shows these only with the cutaway on)
      const wc = hei_boxMesh(g, WT.map((t, k) => ({ x0: DW - t, x1: DW, y0: WY[k], y1: WY[k + 1], z0: 10, z1: 10, v0: 2, skip: "px,nx,py,ny,nz" })), M.stone, "house-wall-w-cap");
      wc.visible = false;
      (ctx.interiorOnly = ctx.interiorOnly || []).push(wc);
      // the section's cut faces at x -30.5: the house wall's steps 7 / 6 / 5 / 4 and the chamber wall.
      // 1.0.1-K review: two meshes, each in the hide-list of the wall it closes - the house wall's steps go with the south wall into the
      // cutaway ("פתח את הבית"), the chamber wall's with the chamber walls into ctx.yatziaCut ("הסר את קירות היציע") - so that no cut face
      // stays standing after its wall was removed; secCaps still shows both only with the section (the group gates the section, the mesh the
      // removal: 70-ui.js applyHidden sets .visible on the meshes of its lists only)
      cut.push(hei_boxMesh(secCaps, WT.map((t, k) => ({ x0: X0, x1: X0, y0: WY[k], y1: WY[k + 1], z0: 10, z1: 10 + t, v0: 2, skip: "nx,py,ny,pz,nz" })),
        M.stone, "yatzia-section-caps-house"));
      ctx.yatziaCut.push(hei_boxMesh(secCaps, [{ x0: X0, x1: X0, y0: F, y1: YROOF, z0: TA_IN, z1: ZT, v0: 1, skip: "nx,py,ny,pz,nz" }],
        M.stone, "yatzia-section-caps-ta"));
    }

    // ============================================================ 4. the yatzia (היציע): 38 chambers (התאים) ============================================================
    // I Kings 6:5-10 with Rashi (quoting Middot 4:3): three stories of chambers around the north, west and south - NOT the east and not
    // around the ulam (Malbim on 6:5); 38 chambers: 15 north (5 per story), 15 south, 8 west (3 + 3 + 2) (Rashi 6:6 "חמשה עשר בצפון, חמשה
    // על גבי חמשה, וחמשה על גביהן, וכן בדרום, ושמונה במערב, שלשה על גבי שלשה, ושנים על גביהם"). Each story 5 high (6:10) and 5 / 6 / 7
    // wide (6:6 "היציע התחתנה חמש באמה רחבה והתיכנה שש באמה רחבה והשלישית שבע באמה רחבה"; Middot 4:4): z 17..22, 16..22, 15..22 - the
    // chamber wall is plumb, the house wall steps (sec. 3): "נמצאת אמצעית רחבה מן התחתונה אמה, והעליונה רחבה מן התיכונה אמה" (Rashi 6:6).
    // THE CEILINGS ARE BEAMS (Rashi 6:6 "והניח על אותה כניסה ראשי קורות גג עלית התא"; Targum 6:6 "למהוי רישי שריתא ניחין על זיזיא ולא
    // יהוין שריתא מעברן בכתלי ביתא"; Metzudat David 6:10 "והם קורות התקרות אשר הונחו על המגרעות"; Ralbag 6:10 "בעצי ארזים שעליהם היתה
    // התקרה והם היו מונחים על המגרעות"): single cedar beams, 1 thick (model choice after the book's sections, pp. ג, ו), 0.94 wide and 1
    // apart, ACROSS each chamber - their inner ends lie on the ledge, not in holes (6:6 "לבלתי אחז בקירות הבית"; Rashi "שלא לדבק ראשי הקורות
    // דרך נקבים בקירות הבית, שקלקול החומה הוא"); the floor beams of stories 2 and 3 end at the chamber wall's inner face, as the book's
    // sections draw them (the chamber wall is not the house wall: it may hold them - model choice); the roof beams lie on the third ledge
    // and on the chamber wall, their ends make the band of beam ends at the top of the outer face (the book p. ט). Stories 12..17, beams
    // 17..18, 18..23, beams 23..24, 24..29, roof beams 29..30. No parapet (the book).
    // THE CHAMBER WALL (כותל התא): 5 thick (Middot 4:7 "וכתל התא חמש"; the book p. ו), plain ashlars (the book p. ט), y 12..29, z +-22..27 and
    // x -80.5..-75.5 - the chambers "לא היו פתוחים אל החוץ" (Rashi 6:8) except ONE door at ground level in the middle chamber of the south
    // row (6:8 "פתח הצלע התיכנה אל כתף הבית הימנית"; Rashi "שבחמש תאים שבדרום היה לה פתח אל החוץ בשורה התחתונה... ודרך אותו פתח נכנסים
    // לכלם"; Targum "תרעא דמחיצתא ארעיתא פתיח לעבר ביתא מימינא"; the book p. ט: "בצד ימין [דרום], למטה, בתא האמצעי"), 2.5 x 3.5 (model
    // choice: the book's small, almost square door). The three chamber walls are ctx.yatziaCut (the book p. ח draws the chambers without them).
    // Partitions 1 thick (model choice): 4 per long run (chambers 12.4) and one at each corner where a long run meets the west run (so the 38
    // chambers are distinct), 2 / 2 / 1 on the west run; each with a doorway 2 x 4 and every chamber a hatch 2 x 2 to the one above (Rashi
    // 6:8 from Middot 4:3: "שלשה פתחים היו לכל אחד... אחד לתא מן הימין, ואחד לתא מן השמאל, ואחד לתא שעל גביו").
    // THE SECTION (FIXES K.2.3): the south chambers, their beams and partitions, the south chamber wall and the south house wall are built in
    // two segments split at X0 = -30.5 (1.0.1-L; was -23.5); ctx.shared.yatziaSection.set(true) hides the eastern one (55-interior's gold skin stays) and shows the
    // measures (ctx.layers.yatziaDims). Nothing here is an occluder (fix A.1).
    const nCh = 5, PT = 1;                                                  // 5 chambers per run, partitions 1 thick (model choice)
    const RUN0 = HW + PT;                                                   // -69.5: the long runs start east of the corner partition (x -70.5..-69.5)
    const chL = ((KE - RUN0) - (nCh - 1) * PT) / nCh;                       // 12.4: the chambers along the run x -69.5..-3.5 (= 66)
    const partX = [HW + PT / 2], chCX = [];                                 // the corner partition (centre -70), then the four of the run
    for (let i = 1; i < nCh; i++) partX.push(RUN0 + i * chL + (i - 0.5) * PT); // -56.6, -43.2, -29.8, -16.4
    for (let i = 0; i < nCh; i++) chCX.push(RUN0 + i * (chL + PT) + chL / 2);  // -63.3, -49.9, -36.5, -23.1, -9.7
    const TA_DOOR_X = chCX[2];                                              // -36.5: the outside door - the middle chamber of the lowest south row
    const DOOR_W = 2.5, DOOR_H = 3.5;                                       // the outside door (model choice after the book p. ט)
    const LUL_X = chCX[2] + 2.5, LUL_Z = (zOut(0) + TA_IN) / 2;             // the לולים column: 2.5 east of that chamber's centre, mid-depth of story 1 (z 17..22): -34, 19.5 - model choice
                                                                            // (1.0.1-L, L.42: was 3 east; 0.5 west, its stairwell x -36.4..-31.6 leaves the floor beams next to the section's cut whole)
    const LUL_R = 0.6 + 1.7;                                                // 2.3: column r 0.6 + steps 1.7 long (model choice)
    const WELL = { x0: LUL_X - LUL_R - 0.1, x1: LUL_X + LUL_R + 0.1, z0: LUL_Z - LUL_R - 0.1 };   // the stairwell through the floors above it:
                                                                            // x -36.4..-31.6 from z 17.1 to the chamber wall - the real opening to the story above (6:8)
    // ---- the chamber walls (ctx.yatziaCut): west (with both corners), north, and south in two segments with the door in the western one;
    //      every piece in two courses of boxes (y 12..15.5 and 15.5..29, the door's height) so that the door's piers and head, the corners
    //      and the courses meet face to face; y 12..29, ashlar courses every 3 from 14 (the top course ends under the roof beams) ----
    {
      const DX0 = TA_DOOR_X - DOOR_W / 2, DX1 = TA_DOOR_X + DOOR_W / 2, L1 = F + DOOR_H;
      const BOTH = [[F, L1], [L1, YROOF]], UP = [[L1, YROOF]];
      const ow = (x0, x1, z0, z1, rows, drop) => rows.map(([y0, y1]) => ({ x0, x1, y0, y1, z0, z1, v0: 1, skip: sk(y0 === F && "ny", drop) }));
      ctx.yatziaCut.push(
        hei_boxMesh(g, [
          ...ow(YW, XW_IN, -ZT, -TA_IN, BOTH), ...ow(YW, XW_IN, -TA_IN, TA_IN, BOTH), ...ow(YW, XW_IN, TA_IN, ZT, BOTH),   // west
          ...ow(XW_IN, KE, -ZT, -TA_IN, BOTH, "px"),                                                                         // north (to the east wall)
          ...ow(XW_IN, DX0, TA_IN, ZT, BOTH), ...ow(DX0, DX1, TA_IN, ZT, UP), ...ow(DX1, X0, TA_IN, ZT, BOTH, "px")           // south, the door
        ], M.stone, "yatzia-walls"),
        hei_boxMesh(segE, ow(X0, KE, TA_IN, ZT, BOTH, "nx,px"), M.stone, "yatzia-wall-s-east")
      );
    }
    // ---- the cedar beams: the floors of stories 2 and 3 (k = 1, 2) and the roof (k = 3) ----
    // The long runs: beams along z from the wall's face above the ledge (z 16 / 15 / 14) to the chamber wall (22) - the roof beams on over it
    // to its outer face (27) - laid every 1 amah from the west wall's face at that height (x -69.5 / -68.5 / -67.5) to the east wall (-3.5).
    // The west run: beams along x from the west chamber wall (x -75.5; the roof's from its outer face -80.5) to the ledge, every 1 amah
    // over z +-22 (the roof +-27): the corners lie in the west run. Over the stairwell the beams of the two floors are stubs on the ledge.
    {
      const beams = { main: [], east: [] };
      let bn = 0;
      const tone = () => 0.84 + 0.2 * hash(++bn * 1.37 + 0.71);            // each beam a slightly different cedar (model choice)
      for (let k = 1; k <= 3; k++) {
        const y0 = ST[k - 1], zi = zOut(k), zo = k === 3 ? ZT : TA_IN;
        for (const s of [-1, 1]) for (let x = wx[k]; x + BW <= KE + 1e-6; x += 1) {
          const zb = s > 0 && k < 3 && x + BW > WELL.x0 && x < WELL.x1 ? WELL.z0 : zo;
          (s > 0 && x >= X0 - 1e-6 ? beams.east : beams.main).push({
            x0: x, x1: x + BW, y0, y1: y0 + BT, z0: s > 0 ? zi : -zb, z1: s > 0 ? zb : -zi, uv: "beamZ", tone: tone(), endTone: 0.7
          });
        }
        const xa = k === 3 ? YW : XW_IN, zl = k === 3 ? ZT : TA_IN;
        for (let z = -zl; z + BW <= zl + 1e-6; z += 1) {
          beams.main.push({ x0: xa, x1: wx[k], y0, y1: y0 + BT, z0: z, z1: z + BW, uv: "beamX", tone: tone(), endTone: 0.7 });
        }
      }
      const beamMat = M.cedar.clone();
      beamMat.vertexColors = true;
      hei_boxMesh(g, beams.main, beamMat, "yatzia-beams", false);           // beams never touch (the 0.06 joints): no shared-face test
      hei_boxMesh(segE, beams.east, beamMat, "yatzia-beams-east", false);
    }
    // ---- the partitions, each with a doorway 2 x 4 in its middle (model choice): five boxes face to face (beside the door below and above
    //      its head, the head), merged into one mesh per segment; their ends stay (seen when the chamber walls or the house wall are off) ----
    const wCh = (2 * TA_IN - 2 * PT) / 3;                                   // 14: the west run z -22..22 (the corners included): 3 chambers on stories 1-2
    {
      const DW2 = 1, DH2 = 4;                                               // the doorway: 2 wide, 4 high
      const parts = { main: [], east: [] };
      // a partition across a run: along "z" (the long runs) or "x" (the west run), from a to b, its middle plane at c, on story k
      const partition = (list, along, a, b, c, k) => {
        const y0 = SY[k], yd = y0 + DH2, y1 = y0 + YH, m = (a + b) / 2;
        const box = (p, q, ya, yb) => {
          const o = along === "z" ? { x0: c - PT / 2, x1: c + PT / 2, z0: p, z1: q } : { x0: p, x1: q, z0: c - PT / 2, z1: c + PT / 2 };
          return Object.assign(o, { y0: ya, y1: yb, v0: 1, skip: sk(ya === y0 && "ny", yb === y1 && "py") });
        };
        list.push(box(a, m - DW2, y0, yd), box(a, m - DW2, yd, y1), box(m - DW2, m + DW2, yd, y1), box(m + DW2, b, y0, yd), box(m + DW2, b, yd, y1));
      };
      // the long runs: the corner partition and the four between the chambers, one piece per story, 5 / 6 / 7 long between the house wall and
      // the chamber wall, 5 high between the floors (they stand on the beams and carry the beams above: no top or bottom face)
      for (const s of [-1, 1]) for (const px of partX) for (let k = 0; k < 3; k++) {
        const a = s > 0 ? zOut(k) : -TA_IN, b = s > 0 ? TA_IN : -zOut(k);
        partition(parts[s > 0 && px > X0 ? "east" : "main"], "z", a, b, px, k);
      }
      // the west run: 3 chambers of 14 on the lower two stories, 2 of 21.5 on the top one; 5 / 6 / 7 long between the west chamber wall
      // (x -75.5) and the house wall (x -70.5 / -69.5 / -68.5)
      const wPartZ = [-TA_IN + wCh + PT / 2, TA_IN - wCh - PT / 2];         // -7.5, 7.5
      for (let k = 0; k < 3; k++) for (const pz of k < 2 ? wPartZ : [0]) partition(parts.main, "x", XW_IN, wx[k], pz, k);
      hei_boxMesh(g, parts.main, M.stone, "yatzia-partitions");
      hei_boxMesh(segE, parts.east, M.stone, "yatzia-partitions-east");
    }
    // לולים (Rashi on 6:8: "בנין עמוד אבנים עשוי מעלות מעלות, וההולך בהן דומה כמקיף סביבות עמוד"; 6:8 "ובלולים יעלו על התיכנה ומן
    // התיכנה אל השלשים"; Targum "ובמסבתא סלקין מן ארעיתא לעיליתא"): a stone column r 0.6 (y 12..29, up to the roof beams - model choice) in
    // the middle chamber of the lowest south row (the one with the outside door), with 24 instanced steps 1.7 long (12 per turn, 2 turns -
    // model choice) rising 12 from the floor of story 1 (12) to the floor of story 3 (24) through the stairwell of the two floors above it
    H.cyl(g, 0.6, 0.6, YROOF - F, M.stoneSmooth, LUL_X, F, LUL_Z, 16);
    {
      const stepG = H.uvWorldBox(new BoxGeometry(1.7, 0.22, 0.8), 1.7, 0.22, 0.8);
      stepG.translate(1.45, 0, 0);
      const N = 24, rise = (SY[2] - F) / N, mats = [];                      // 0.5 per step
      for (let i = 0; i < N; i++) mats.push(hei_m4(LUL_X, F + (i + 1) * rise - 0.11, LUL_Z, 0, -i * Math.PI / 6, 0));
      hei_inst(g, stepG, M.stoneSmooth, mats);
    }
    // hatches (the opening "to the chamber above", Rashi on 6:8): dark 2 x 2 plates on the beams at y 18 and 24, 3 west of each chamber's
    // centre (model choice: clear of the doorways and of the section's cut); the לולים chamber has the stairwell instead
    {
      const hm = { main: [], east: [] };
      for (const s of [-1, 1]) for (const k of [1, 2]) {
        const y = ST[k - 1] + BT + 0.03, zc = s * (zOut(k - 1) + TA_IN) / 2;   // over the chamber below: z 19.5 / 19
        for (let i = 0; i < nCh; i++) {
          if (s > 0 && i === 2) continue;
          const x = chCX[i] - 3;
          (s > 0 && x > X0 ? hm.east : hm.main).push(hei_m4(x, y, zc));
        }
      }
      for (const z of [-(wCh + PT), 0, wCh + PT]) hm.main.push(hei_m4((wx[0] + XW_IN) / 2, ST[0] + BT + 0.03, z));   // west run, stories 1 -> 2
      for (const z of [-12, 12]) hm.main.push(hei_m4((wx[1] + XW_IN) / 2, ST[1] + BT + 0.03, z));                    // stories 2 -> 3 (two above three)
      const hg = new BoxGeometry(2, 0.06, 2);
      hei_inst(g, hg, dark, hm.main, false);
      hei_inst(segE, hg, dark, hm.east, false);
    }

    // ============================================================ 5. the windows (חלוני שקופים אטומים) ============================================================
    // I Kings 6:4 with Rashi (Menachot 86b): "פתוחים מבחוץ ואטומים מבפנים, קצרים מבפנים, שלא כדרך שאר חלונות אחרות העשויות למאור, להראות שאינו צריך לאורה":
    // splayed reveals from 3 x 2.5 outside to 1 x 1 inside the 4-thick upper wall, with a dark inner square (the book p. ו draws one so).
    try {
      const splayG = hei_splayGeo(ctx.THREE, WIN_OW, WIN_OH, WIN_IW, WIN_IH, WT[3] - 0.1);
      const splayMat = M.stoneLight.clone();
      splayMat.side = DoubleSide;
      const backMat = new MeshStandardMaterial({ color: 0x1b1712, roughness: 1, metalness: 0, side: DoubleSide });
      const backG = new PlaneGeometry(WIN_IW, WIN_IH);
      for (const s of [-1, 1]) for (const [xa, xb, parent] of s > 0 ? [[DW, X0, g], [X0, KE, segE]] : [[DW, KE, g]]) {
        const sm = [], bm = [];
        for (const x of WIN_X) {
          if (x < xa || x > xb) continue;
          const m = hei_m4(x, WIN_Y, s * zOut(3), 0, s > 0 ? 0 : Math.PI, 0);
          sm.push(m);
          bm.push(m.clone().multiply(new Matrix4().makeTranslation(0, 0, -(WT[3] - 0.12))));
        }
        // plain meshes (1.0.1 fix A.1); the south side goes with the south wall into the general cutaway
        const a = hei_inst(parent, splayG, splayMat, sm, false);
        const b = hei_inst(parent, backG, backMat, bm, false);
        if (s > 0) cut.push(a, b);
      }
    } catch (e) {
      console.warn("[heichal] window splays skipped:", e && e.message);
      for (const s of [-1, 1]) {
        const bm = WIN_X.map((x) => hei_m4(x, WIN_Y, s * (zOut(3) - WT[3] + 0.1)));
        const b = hei_inst(g, new BoxGeometry(WIN_IW, WIN_IH, 0.2), dark, bm, false);
        if (s > 0) cut.push(b);
      }
    }

    // ============================================================ 6. the ulam (האולם) and בית החליפות ============================================================
    // I Kings 6:3: "והאולם על פני היכל הבית עשרים אמה ארכו על פני רחב הבית עשר באמה רחבו" - the hall 20 (z +-10) x 10 deep (x 2.5..12.5);
    // 30 high (y 12..42) as the house (model choice: Kings gives no height; the 120 of II Chr 3:4 is the "עליות" layer). Its walls 6 thick
    // (Rashi on Sanhedrin 100a; CO.ULAM_WALL). The front wall x 12.5..18.5 spans the whole block z +-42 (Middot 4:7 "האולם עודף עליו חמש עשרה
    // אמה מן הצפון וחמש עשרה אמה מן הדרום, והוא היה נקרא בית החליפות, ששם גונזים את הסכינים"; Rashi on Yoma 36a: the wings) with the entrance
    // 10 x 22 under a flat lintel and two cedar doors standing open (1.0.1-L, L.59: was 10 x 20 without doors; see below).
    // 1.0.1-K (K.2): CLOSED by default; ctx.ulamCut = the front wall with its jambs, lintel and doors, the ceilings and the roof (the UI's
    // on-model "פתח את האולם"); none of it is in ctx.cutaway (the house). The doorway stays open (z +-5, y 12..34 between the jambs and
    // under the lintel): the fly point yachinBoaz (K.1) stands in it; the threshold stays.
    // 1.0.1-L (FIXES L.59; the user's decision after the source search: "רוחב 10 גובה 22"): the clear doorway UD_W x UD_H = 10 x 22.
    //   SIZE - a model choice: Kings measures only the ulam (6:3 "עשרים אמה ארכו על-פני רחב הבית עשר באמה רחבו"); Middot 3:7 "פתחו של
    //   אולם, גבהו ארבעים אמה, ורחבו עשרים אמה" and 2:3 "כל הפתחים והשערים שהיו שם, גבהן עשרים אמה, ורחבן עשר אמות, חוץ משל אולם" describe
    //   the Second Temple (40 would not fit the ulam, 30 high); the ברייתא דמלאכת המשכן ch. 5 "כפתחו של חצר כך פתחו של אולם" (20 wide)
    //   names no Temple. DOORS - the First Temple's ulam had them: II Chr 29:7 "גם סגרו דלתות האולם ויכבו את-הנרות" (Hezekiah's days;
    //   Malbim there "ואח"כ סגרו דלתות האולם"), unlike the Second Temple's (Middot 2:3 "כל הפתחים שהיו שם, היו להן דלתות, חוץ משל אולם";
    //   Rambam Beit HaBechira 4:8 "ולא היה לו שערים"). They stand OPEN by day: Meiri on Yoma 54a "ואע"פ ששערים של עץ היו שם מ"מ לא היו
    //   נועלים אותם ביום ופורסים הפרוכת לפניהם" (wood - cedar here, a model choice: the ulam has no gold, Rashi and Metzudot on II Chr 3:4;
    //   his curtain is NOT built - DEV note, with Yoma 54a "אחת לפתחו של היכל, ואחת לפתחו של אולם" and Rashi there "וכי היכי דבמקדש שני
    //   היו פרוכות כנגד הפתחים הכי נמי במקדש ראשון"). Each leaf is folded back into the doorway along its reveal, as the house's own
    //   doors (55-interior.js) and as Middot 4:1 describes the heichal's outer doors - "החיצונות נפתחות לתוך הפתח לכסות עביו של כתל":
    //   5 wide = half the opening, 0.33 thick, turning on a pivot 0.2 inside the outer face (model choices), so the whole 10 x 22 passage stays
    //   clear and the leaves lie flat along the jambs, 0.02 from them (x 13.3..18.3, |z| 4.65..4.98; 1.0.1-L, verifier: the house's doors' 0.4
    //   left 8.87 between the leaves and cut the views of the pillars through the doorway, L.58: now 9.3), far from
    //   Yachin and Boaz (x 6.08, capital radius 2.81: ~4.4 away) and from the steps (x >= 18.5). HEAD - a flat lintel (the book's general
    //   view, p. א; Rashi on 7:5 "רבועין היו כשאר פתחי בתים, ולא עשויין כפה כעין פתחי אולם" pictures an arch - DEV note, not built): a
    //   beam 1 high (y 34..35, up to the course boundary at 35, so the cedar course 35..36 runs on over it) in the jambs' light stone, 0.3
    //   proud of both faces like them (the K build had a plate 1.2 high on the front only, over the wall's course at 32).
    const UD_W = 10, UD_H = 22;                                 // the clear doorway (model choice, L.59; was 10 x 20)
    const UD_JAMB = 1.2, UD_LINTEL = 1;                         // the jambs' width in the opening and the lintel's height (model choice)
    const UD_T = 0.33, UD_LW = UD_W / 2, UD_LH = UD_H - 0.9;    // a leaf: thickness, width (half the opening), height (0.45 free at foot and head)
    const UD_HX = E - 0.2, UD_DZ = UD_W / 2 - 0.185;            // the pivot axis: x 18.3, z +-4.815 (the leaf's outer face 0.02 from the jamb)
    ctx.ulamCut.push(...bandWall(g, { axis: "z", from: -ZW, to: ZW, fixed: (UI + E) / 2, thickness: E - UI, y0: F, y1: TOP, opening: { center: 0, width: UD_W + 2 * UD_JAMB, top: F + UD_H + UD_LINTEL } }));
    // gate trim (after the 1.0.19 gateTrim): stone jambs 1.2 wide in the opening (z +-5..6.2, the clear doorway z +-5), 22 high, 0.3 proud
    // of both faces of the wall; the lintel beam over them (y 34..35, 12.4 wide, 0.3 proud of both faces); a threshold 0.12 high
    // 1.0.1-L (verifier): the jambs and the lintel as one mesh of boxes face to face (hei_boxGeo drops the faces between them), as the house's walls since K.2: three H.box meshes
    // left a dashed line along the joint at y 34 (their inner faces); -2 draw calls
    {
      const fx0 = UI - 0.3, fx1 = E + 0.3, fy1 = F + UD_H, fy2 = fy1 + UD_LINTEL, zi = UD_W / 2, zo = zi + UD_JAMB;
      const fb = (y0, y1, z0, z1) => ({ x0: fx0, x1: fx1, y0, y1, z0, z1 });
      ctx.ulamCut.push(hei_boxMesh(g, [fb(F, fy1, -zo, -zi), fb(F, fy1, zi, zo), fb(fy1, fy2, -zo, -zi), fb(fy1, fy2, -zi, zi), fb(fy1, fy2, zi, zo)], M.stoneLight, "ulam-door-frame"));
    }
    H.box(g, E - UI + 0.3, 0.12, UD_W, M.stoneSmooth, (UI + E + 0.3) / 2, F, 0);
    // the two cedar doors (1.0.1-L, L.59; sources above): each leaf a board 5 x 21.1 x 0.33 under a hinge group at its pivot (x 18.3, z +-4.815),
    // rotation 0 = folded back along the reveal, x 13.3..18.3 (a closed leaf would turn -s * 90 deg to the axis); its foot 0.45 over the floor
    // and its head 0.45 under the lintel, so the bronze pivots (r 0.14; vsl_bronze - a model choice: 7:50 gives gold pivots to the
    // house's doors only) fill the gaps - from the threshold to the leaf below, from the leaf to the lintel above - as one instanced mesh; the cedar's grain
    // runs upright (uvWorldBox's u / v swapped on the upright faces). All of it in ctx.ulamCut: the doors go with the front wall.
    {
      const upright = (geo) => {
        const uv = geo.attributes.uv, n = geo.attributes.normal;
        for (let i = 0; i < uv.count; i++) if (Math.abs(n.getY(i)) < 0.5) uv.setXY(i, uv.getY(i), uv.getX(i));
        uv.needsUpdate = true;
        return geo;
      };
      const pivots = [];
      for (const s of [-1, 1]) {
        const hinge = new Group();
        hinge.name = "ulam-door-hinge";
        hinge.position.set(UD_HX, F, s * UD_DZ);
        hinge.rotation.y = 0;
        g.add(hinge);
        const leaf = H.box(hinge, UD_LW, UD_LH, UD_T, M.cedar, -UD_LW / 2, 0.45, 0);
        leaf.name = "ulam-door";
        upright(leaf.geometry);
        ctx.ulamCut.push(leaf);
        // 1.0.1-L (verifier): each pivot joins the leaf to the frame - y 12.12..12.45 (threshold to foot), 33.55..34 (head to lintel); they stood free, 0.03 from the leaf and the upper one 0.12 under the lintel
        pivots.push(hei_m4(UD_HX, F + 0.285, s * UD_DZ, 0, 0, 0, 1, 0.33 / 0.3, 1), hei_m4(UD_HX, F + UD_H - 0.225, s * UD_DZ, 0, 0, 0, 1, 0.45 / 0.3, 1));
      }
      const bronze = typeof vsl_bronze === "function" ? vsl_bronze(M, 0xad733a, 0.32) : M.bronze;
      const pv = hei_inst(g, new CylinderGeometry(0.14, 0.14, 0.3, 10), bronze, pivots, false);
      pv.name = "ulam-door-pivots";
      ctx.ulamCut.push(pv);
    }
    for (const s of [-1, 1]) {
      // the hall's side walls z +-10..+-16 (6 thick), x 2.5..12.5, with a doorway 3 x 7 into the wing (model choice: Rashi says the wings
      // "join the ulam from both sides"; its head on a course boundary); the wing room beyond it: z +-16..+-36, x 2.5..12.5, closed by the
      // wing's outer wall 6 thick at z +-36..+-42, the east wall of the house on the west and the front wall on the east. Not in any cut list.
      // Their west faces lie against the east wall (dropped).
      bandWall(g, { axis: "x", from: HE, to: UI, fixed: s * (10 + UWT / 2), thickness: UWT, y0: F, y1: TOP, opening: { center: (HE + UI) / 2, width: 3, top: F + 7 }, skipFrom: true, into: ulamWalls });
      bandWall(g, { axis: "x", from: HE, to: UI, fixed: s * (ZW - UWT / 2), thickness: UWT, y0: F, y1: TOP, skipFrom: true, into: ulamWalls });
    }
    hei_boxMesh(g, ulamWalls.s, M.stone, "ulam-walls-stone");     // the wings' back walls (sec. 2), the hall's side walls, the wings' outer walls
    hei_boxMesh(g, ulamWalls.c, M.cedar, "ulam-walls-cedar");
    // niches for the knives (model choice: 12 per wing, 1 x 1) on the wing's west and east faces
    {
      const nm = [];
      for (const s of [-1, 1]) for (let i = 0; i < 6; i++) {
        const z = s * (18 + i * 3);
        nm.push(hei_m4(HE + 0.1, F + 3.5, z), hei_m4(UI - 0.1, F + 3.5, z));
      }
      hei_inst(g, new BoxGeometry(0.2, 1, 1), dark, nm, false);
    }
    // paving of the hall, the two doorways and the wings, between the walls (stone: no gold in the ulam - Rashi, Metzudot, Ralbag on
    // II Chr 3:4; Malbim disagrees - DEV note); a skin 0.02 thin on the אוטם, so that what stands on the floor (Yachin and Boaz, the
    // heichal doorposts of 55-interior.js) stands in it no deeper than 0.02
    {
      const pv = (x0, x1, z0, z1) => ({ x0, x1, y0: F, y1: F + 0.02, z0, z1 });
      const dw0 = (HE + UI) / 2 - 1.5, dw1 = (HE + UI) / 2 + 1.5, zw = 10 + UWT, zr = ZW - UWT;
      hei_boxMesh(g, [pv(HE, UI, -10, 10), pv(dw0, dw1, -zw, -10), pv(dw0, dw1, 10, zw), pv(HE, UI, -zr, -zw), pv(HE, UI, zw, zr)], M.stoneSmooth, "ulam-paving");
    }
    // the ceilings (cedar, 30 above the floor; between the walls: the hall and the two wings) and the stone roof over the whole ulam block,
    // the same double ceiling + slab as the house (sec. 8), with a cornice 0.3 proud on the east, north and south and over the house's
    // upper walls (model choice: so that the walls' tops and the roof's edge do not meet in one plane); they open with the front wall (ctx.ulamCut)
    {
      const zw = 10 + UWT, zr = ZW - UWT;
      const ceil = (y) => hei_boxMesh(g, [{ x0: HE, x1: UI, y0: y, y1: y + 1, z0: -10, z1: 10 }, { x0: HE, x1: UI, y0: y, y1: y + 1, z0: -zr, z1: -zw },
        { x0: HE, x1: UI, y0: y, y1: y + 1, z0: zw, z1: zr }], M.cedar, "ulam-ceiling");
      ctx.ulamCut.push(ceil(CEIL), ceil(CEIL + 3), hei_boxMesh(g, [{ x0: KE - 0.3, x1: E + 0.3, y0: TOP, y1: ROOF, z0: -ZW - 0.3, z1: ZW + 0.3 }], M.stone, "ulam-roof"));
    }

    // ============================================================ 6b. the two tables in the ulam (1.0.1-L, L.72) ============================================================
    // The user: "תוסיף את שיטת ר' יוסי בר' יהודה שהיו עוד 2 שולחנות אחד מכסף לשים עליו את לחם הפנים לפני עריכתו על השלחן ו-1 זהב לאחר
    // הורדתו מן השולחן - הוסף בכפתור נפרד כחלק משיטות נוספות". Menachot 99a: "רבי יוסי ברבי יהודה אומר: לא היו מסדרין אלא על של משה, אלא מה
    // אני מקיים ״ואת השלחנות אשר עליהם לחם הפנים זהב״? אלו שלשה שלחנות שהיו במקדש: שנים שהיו באולם מבפנים לפתח הבית, אחד של כסף ואחד של
    // זהב" - he reads them out of Solomon's vessels (II Chr 4:19 "ואת השלחנות ועליהם לחם הפנים"; I Kings 7:48 "ואת השלחן אשר עליו לחם הפנים
    // זהב"), so they stood in the First Temple; Rashi there: "שנים שהיו באולם מבפנים - אצל פתח ההיכל אחד של כסף ואחד של זהב והאי דקרי הכא כסף
    // ובמתניתין שייש משום דשייש לבן ככסף", and on their use: "בכניסתו מניחו על של כסף וכשמגיע להיכל מסדר על של משה שמצופה זהב הרי עלייה ולא
    // מורידין לכך ביציאתו מניחו על של זהב". The Mishnah has marble for the first: Shekalim 6:4 "ושנים באולם מבפנים על פתח הבית, אחד של שיש
    // ואחד של זהב, על של שיש נותנין לחם הפנים בכניסתו, ועל של זהב ביציאתו, שמעלין בקדש ולא מורידין" (= Menachot 11:7); Rambam Beit HaBechira
    // 3:16 "ושני שלחנות היו באולם מבפנים על פתח הבית. אחד של שיש נותנין עליו לחם הפנים בכניסתו. ואחד של זהב נותנין עליו לחם ביציאתו. שמעלין
    // בקדש ולא מורידין"; Bartenura on Menachot 11:7 "על פתח הבית. אצל פתח ההיכל בכניסתו".
    // MODEL: hidden by default; ctx.shared.ulamTables = { current "none", keys ["none", "ryby", "mishnah"], names, set } - "ryby" = R. Yose b.
    // R. Yehuda's silver + gold (the user's request), "mishnah" = the Mishnah's marble + gold (the same place; Rashi: the marble is white
    // like silver). Each the size of the showbread table, 2 x 1 x 1.5 (Ex 25:23 "אמתים ארכו ואמה רחבו ואמה וחצי קמתו"; a plain table - a top
    // 0.12 thick, four legs and an apron: model choice), inside the ulam right before the house's doorway ("אצל פתח ההיכל"), one on each
    // side of the passage with its length along it: x 3.7..5.7 (0.2 east of the doorposts' faces, x 3.5), |z| 3.3..4.3 - 0.87 from the
    // pillars' shafts (|z| 5.17), 6.6 amot of passage left between them; the entry table (silver / marble) on the NORTH, the exit table
    // (gold) on the SOUTH (model choice after Menachot 11:7 "המכניסים עומדים בצפון... המוציאין עומדים בדרום"). Silver: a clone of
    // M.bronze (model choice); gold: M.gold; marble: M.marble. The north table is one mesh whose material follows the reading. Layers
    // (not user options): ulamTables = the tables' group (both readings), ulamTablesRyby / ulamTablesMishnah = empty groups gating the
    // north table's two labels. The fly point ulamTables (sec. 12) looks at both from inside the ulam.
    {
      // silver on the recipe of GOLD_OPTS (10-core.js): a light colour, metalness 0.5 so the diffuse light counts and a faint cool emissive -
      // with metalness 0.9 the table read dark grey inside the closed ulam (headless picture), as the old gold read brown
      const silver = M.bronze.clone();
      silver.color.set(0xf4f6f8);
      silver.metalness = 0.5;
      silver.roughness = 0.3;
      silver.envMapIntensity = 1.3;
      silver.emissive.set(0x40444a);
      silver.emissiveIntensity = 0.45;
      const TB_L = 2, TB_W = 1, TB_H = 1.5, TB_X0 = HE + 1.2, TB_Z = 3.8;   // x 3.7..5.7, centres z -+3.8
      const gT = new Group();
      gT.name = "ulamTables";
      gT.visible = true;   // 1.1.0 (the user): the tables are always there - "בלי שולחנות" was wrong
      g.add(gT);
      ctx.layers.ulamTables = gT;
      const gRy = new Group(), gMi = new Group();               // label gates
      gRy.name = "ulamTablesRyby";
      gMi.name = "ulamTablesMishnah";
      gRy.visible = true;
      gMi.visible = false;
      g.add(gRy, gMi);
      ctx.layers.ulamTablesRyby = gRy;
      ctx.layers.ulamTablesMishnah = gMi;
      const table = (name, mat, z) => {
        const x0 = TB_X0, x1 = TB_X0 + TB_L, z0 = z - TB_W / 2, z1 = z + TB_W / 2, yT = F + TB_H, yP = F + 0.02;   // on the paving skin (0.02)
        const b = [{ x0, x1, y0: yT - 0.12, y1: yT, z0, z1 }];
        for (const [lx, lz] of [[x0 + 0.08, z0 + 0.08], [x1 - 0.23, z0 + 0.08], [x0 + 0.08, z1 - 0.23], [x1 - 0.23, z1 - 0.23]]) b.push({ x0: lx, x1: lx + 0.15, y0: yP, y1: yT - 0.12, z0: lz, z1: lz + 0.15 });
        for (const az of [z0 + 0.08, z1 - 0.14]) b.push({ x0: x0 + 0.23, x1: x1 - 0.23, y0: yT - 0.4, y1: yT - 0.12, z0: az, z1: az + 0.06 });
        return hei_boxMesh(gT, b, mat, name, true);
      };
      const tEntry = table("ulam-table-entry", silver, -TB_Z);  // north: silver (ryby) or marble (mishnah)
      table("ulam-table-gold", M.gold, TB_Z);                   // south: gold in both readings
      const lx = TB_X0 + TB_L / 2, ly = F + TB_H + 0.9;
      // 1.0.1-L (verifier): size 1 (was 1.4): the two labels are 7.6 apart and seen from 7.8 amot, at 1.4 the frame of flyPoints.ulamTables cut both ("לחן הכסף")
      ctx.labels.push(
        { text: "שולחן הכסף (מנחות צט.)", x: lx, y: ly, z: -TB_Z, size: 1, layers: ["ulamTables", "ulamTablesRyby"] },
        { text: "שולחן השיש (שקלים ו, ד)", x: lx, y: ly, z: -TB_Z, size: 1, layers: ["ulamTables", "ulamTablesMishnah"] },
        { text: "שולחן הזהב (מנחות צט.)", x: lx, y: ly, z: TB_Z, size: 1, layer: "ulamTables" }
      );
      const ulamTables = {
        current: "ryby",   // 1.1.0: no "none" any more
        keys: ["ryby", "mishnah"],
        names: { ryby: "רבי יוסי ברבי יהודה — כסף וזהב", mishnah: "המשנה — שיש וזהב" },
        set: null
      };
      ulamTables.set = (key) => {                               // an unknown key changes nothing and returns false
        if (ulamTables.keys.indexOf(key) < 0) return false;
        ulamTables.current = key;
        gT.visible = true;
        gRy.visible = key === "ryby";
        gMi.visible = key === "mishnah";
        tEntry.material = key === "mishnah" ? M.marble : silver;
        return true;
      };
      ctx.shared.ulamTables = ulamTables;
    }

    // ============================================================ 7. Yachin and Boaz (יכין ובועז) ============================================================
    // 1.0.1-K (FIXES J.1 / K.1; the user: "יכין ובועז לא היו נראים כך כלל עיין בתמונות שהבאתי לך"): rebuilt after the book (the user's
    // reference "מקרא מפורש", pp. כז-ל: the pillar with its measures, the capital close up, the two pillars in the ulam, "מעשה שושן") with
    // Rashi's numbers. Sources: I Kings 7:15-22, 7:41-42; II Chr 3:15-17, 4:12-13; Jer 52:21-23; II Kings 25:17.
    // PLACE - inside the ulam (Rashi 7:15 "שהעמיד באולם"; Rashi II Chr 3:17 "על פתח ההיכל בחוץ באולם"; Metzudat David II Chr 3:15 "בחלל
    //   האולם"), right and left of the heichal doorway (II Chr 3:17 "אחד מימין ואחד מהשמאול", Rashi there "הפתח"); Yachin = the right =
    //   south (Metzudat David 7:21 "אשר בפאת הדרומי"; Ralbag), Boaz = north. Rashi on Jer 52:23: "העמידם שלמה באולם סמוך לכותל ההיכל,
    //   והכותל מכסה ארבע רמונים מכל טור" (so 96 of each 100 are seen, "רוחה"; Metzudat David there "כי העמודים עמדו סמוכים לכותל"):
    //   the pillars stand as close to the house wall (its east face x 2.5) as the heichal doorposts of 55-interior.js (x 2.5..3.5,
    //   z +-5..6, y 12..32; lintel y 32..33) and the hall's side walls (z +-10) let the capital stand. It cannot touch the wall here: only
    //   4 amot lie between the doorpost and the side wall, and the capital is 5.62 across (its pomegranates, radius 2.81 at y 30).
    //   1.0.1-L (FIXES L.6; the user: "תנסה להצמיד ככל האפשר"): the closest place, with 0.02 left between the capital's ideal surface
    //   (radius 2.81; the meshes are polygons inside it, so their gaps are a little larger) and both the side wall and the doorpost:
    //   z = 10 - 2.81 - 0.02 = 7.17, then x = 3.5 + sqrt(2.83^2 - (7.17 - 6)^2) = 6.077 -> 6.08 (the doorpost's corner x 3.5, z 6). The
    //   capital is then 0.77 from the wall (was 0.99 at x 6.3, z 7). Every other neighbour is farther: the cedar strips on the wall
    //   (x 2.58) ~0.9, the lintel ~1, the folded doors ~1.6 (headless, mesh to mesh: the round-L report).
    // SHAFT - 7:15 "שמנה עשרה אמה קומת העמוד האחד וחוט שתים עשרה אמה יסב": Rashi "ארבע אמות על ארבע אמות עגול... ועביו ארבע אצבעות,
    //   והוא חלול" (Jer 52:21 "ועביו ארבע אצבעות נבוב"): diameter 4, 18 high; its top 2 amot stand INSIDE the capital (Rashi 7:16 "והעמוד
    //   תחוב בכותרת שתי אמות"), so the shaft is y 12..30, the capital y 28..33 and the whole pillar 21 (the book: "גובה כל העמוד עם
    //   הכותרת - 21 אמות"). Rashi 7:22 "חצי אמה בראש כל אחד היה כתלו דק כשושן" (the book p. ל) is inside the capital: not built. A smooth
    //   polished copper tube (the book), open at both ends (they stand on the floor and inside the capital).
    // CAPITAL 5 (7:16 "חמש אמות קומת הכתרת") after Rashi 7:18 - "כמין שני אגנים היתה כל אחת, אגן התחתון בית קבולה למעלה, והוא קרוי
    //   'גלה'... העליון כפוי על התחתון, בית קבולו למטה, והיא קרויה 'שבכה'... נמצא רחבה במקום הדבק, ומשפעת ועולה, ומשפעת ויורדת, והוא
    //   קרוי בטן... וגבה שתי האגנות האלה ארבע אמות... והאמה החמישית, היא כותרת קטנה למעלה מן הגדולה" - and the book's drawing:
    //   (a) y 28..30 the lower basin (גלה; the book "2 אמות הגולה התחתונה"): a bowl from radius 2.06 to 2.66 covered with 3 rows of 26
    //       roses in relief (Rashi 7:18 "מצירות היו בם כמין פרחי שושנים"; 7:19 "מעשה שושן... ארבע אמות"; the book: "שושנים");
    //   (b) y 30 the belly (בטן, 7:20; Targum "דבקא"), diameter 5.32, with TWO ROWS of 100 pomegranates (7:18 "ושני טורים סביב על
    //       השבכה"; 7:20 "והרמנים מאתים"; 7:42 "שני טורים רמנים לשבכה האחת"; Rashi 7:42 "מאה רמונים בטור, חרוזים בשרשרות"; Jer 52:23
    //       "כל הרמונים מאה על השבכה סביב") threaded on chains (Rashi 7:20 "מחורזים בשלשלת"; II Chr 3:16 "ויתן בשרשרות"). Rashi on
    //       Jer 52:22: the closed chain slides down the network "עד מקום דבק השבכה וכותרת, שהיא הבטן הרחב שבכותרת, ושם עומדת; והרמונים
    //       מכסים את מקום הדבק" - the lower row on the joint (y 30), the upper one on the network's skirt (y 30.42) as the book draws them;
    //       pomegranates 0.16 across with a crown (100 fill the ring: model choice), outer diameter 5.62 (the book ~5.7);
    //   (c) y 30..32 the upper basin = the network (שבכה), a DOME (Rashi 7:17 "דומה כמין כפה"; Rashi II Kings 25:17 "כמין כובע";
    //       Metzudat David 7:20 "ככיפת כובע") woven of palm fronds (Rashi 7:17 "צורות של לולבי דקל... וגדילים היו להם כמעשה שרשראות",
    //       "שבעה לולבין היה להקף אחד"; Metzudat Zion "גדלים - קלועים ושזורים"): 7 braided bands round the dome, each a herringbone of
    //       3 rows of slanted strips, parted by twisted cords - the book's weave (canvas texture + bump, darker in the cuts);
    //   (d) y 32..33 the small capital (Rashi 7:18 "כותרת קטנה למעלה מן הגדולה"; Radak 7:18, 7:20 "היו כותרות אחרות מלעיל"; the book
    //       "אמה אחת הכותרת הקטנה"): a ball 1.1 across with the same weave, sunk 0.1 into the dome's top.
    //   The book's legend: 4 = the two basins ("הכותרת הגדולה"), 5 with the ball, 3 = the parts covered by the network (dome + ball:
    //   II Kings 25:17 "וקומת הכתרת שלש אמות ושבכה ורמנים על הכתרת סביב").
    // DEV notes: Rashi 7:16 (with Radak and Metzudot there, after the Mishnah of 49 Middot) has the lower 2 amot of the capital "שוות
    //   לעמוד, שלא היו בהן צורה" and only the upper 3 bulging; Rashi's own 7:18 (both basins "מצירות היו בם כמין פרחי שושנים") and the book
    //   draw the lower basin wider and decorated - followed here. Radak and Metzudot (7:15) sink the shaft half an amah (total 22.5: the
    //   1.0.0/1.0.1 build) and put the lily work of 7:19 on the top surface ("השטח הרואה את הכיפה"); Malbim sets the pillars outside, in
    //   front of the ulam (7:21), and paints the lily on the ulam wall (7:19); Ralbag: rows of small columns rising from the network
    //   (7:18-19) and a diameter of "שלש אמות וארבע חמישיות" (7:15); Radak and Malbim on 7:20: 96 + 4 of each row face different sides.
    // Performance (FIXES 0.6): every part is instanced (shafts, basins, domes, balls: 2 each; 156 roses, 400 pomegranates, 4 chains) -
    //   7 draw calls, ~43k triangles; one 1024 canvas (+ a 512 bump) holds the weave of the dome and of the ball and the rose, each motif
    //   drawn once into a small canvas and stamped with drawImage.
    const PX = 6.08, PZ = 7.17;                                 // the centres (x, +-z): see PLACE above (1.0.1-L, L.6: were 6.3, 7)
    const YB_SH1 = F + 18;                                      // 30: the top of the shaft (7:15), inside the capital
    const YB_C0 = YB_SH1 - 2;                                   // 28: the capital's foot - the shaft enters it 2 amot (Rashi 7:16)
    const YB_BELLY = YB_C0 + 2;                                 // 30: the joint of the two basins, the belly (Rashi 7:18; the book 2 + 2)
    const YB_TOP = YB_C0 + 5;                                   // 33: the top of the small capital = 12 + 21 (the book "21 אמות")
    const YB = { shaftR: 2, footR: 2.06, bellyR: 2.66, domeH: 2, ballR: 0.55, pomR: 0.08, rMax: 0, rows: [] };  // radii: model choice after the book
    let ybGroup = null;                                         // 1.0.1-L (A14): the whole group of the pillars, moved out before the ulam in Malbim's reading (sec. 12)
    let ybRashiCap = [], ybMalbim = null;                       // 1.0.1-L (L.60): Rashi's capital meshes and Malbim's group, switched in sec. 12
    {
      const gYB = new Group();
      gYB.name = "yachinBoaz";
      ybGroup = gYB;
      g.add(gYB);
      const SIDES = [1, -1];                                    // +1 Yachin (south, z +7.17), -1 Boaz (north, z -7.17)
      // ---- the profiles (radius, height above the capital's foot y 28 / above the belly y 30) ----
      // (a) the lower basin, "בית קבולה למעלה": r = 2.06 + 0.6 (1 - (1 - s)^2) over y 28..30 (s = 0..1) - a bowl that meets the belly
      //     upright (model choice after the book's outline); a narrow ring closes it onto the shaft (r 2) at its foot
      const basinR = (s) => YB.footR + (YB.bellyR - YB.footR) * (1 - (1 - s) * (1 - s));
      const basinPts = [[YB.shaftR, 0]];
      for (let i = 0; i <= 10; i++) basinPts.push([basinR(i / 10), 2 * i / 10]);
      // (c) the dome, "כפוי על התחתון": a half ellipse (radius 2.66, height 2: the book's flattened dome), sampled at equal arc length so
      //     that the weave keeps its size (the texture's v runs along the arc)
      const domeRadiusAt = (h) => YB.bellyR * Math.sqrt(Math.max(0, 1 - (h / YB.domeH) * (h / YB.domeH)));
      const domeT = [], NT = 400;
      for (let i = 0, L = 0, px = YB.bellyR, py = 0; i <= NT; i++) {
        const t = i / NT * Math.PI / 2, x = YB.bellyR * Math.cos(t), y = YB.domeH * Math.sin(t);
        L += Math.hypot(x - px, y - py);
        domeT.push([L, x, y]);
        px = x;
        py = y;
      }
      const domeLen = domeT[NT][0];                             // 3.67 amot of arc from the belly to the top
      const domeAt = (v) => {                                   // the profile point at arc fraction v (0 = the belly, 1 = the top)
        const L = v * domeLen;
        let k = 1;
        while (k < NT && domeT[k][0] < L) k++;
        const a = domeT[k - 1], b = domeT[k], f = (L - a[0]) / Math.max(1e-9, b[0] - a[0]);
        return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
      };
      const DOME_N = 20, domePts = [];
      for (let i = 0; i <= DOME_N; i++) domePts.push(i === DOME_N ? [0, YB.domeH] : domeAt(i / DOME_N));
      // (d) the ball: a half circle from its lower pole to its upper pole (equal angles = equal arc); its centre 32.45, top 33
      const BALL_N = 12, ballPts = [];
      for (let i = 0; i <= BALL_N; i++) {
        const a = -Math.PI / 2 + i / BALL_N * Math.PI;
        ballPts.push([i === 0 || i === BALL_N ? 0 : YB.ballR * Math.cos(a), YB.ballR * Math.sin(a)]);
      }
      const ballY = YB_TOP - YB.ballR;                          // 32.45: the ball sinks 0.1 into the dome's top (y 32)
      // ---- the weave atlas (map 1024 x 1024, bump 512 x 512): rows 0..640 = the dome (its top at row 0; 4 tiles round it), rows
      //      640..896 = the ball (2 tiles round it), rows 896..1024 = the rose (128 x 128 at the left). Built in a try: without a canvas the
      //      capital keeps plain copper materials.
      const ATL = { dome: [0.375, 1], ball: [0.125, 0.375], domeTiles: 4, ballTiles: 2, rose: 0.125 };
      let atlasMap = null, atlasBump = null;
      try {
        const MW = 1024, BW2 = 512, K = BW2 / MW;
        const mk = (w, h) => {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h || w;
          return c;
        };
        const cv = mk(MW), bv = mk(BW2), cx = cv.getContext("2d"), bx = bv.getContext("2d");
        cx.fillStyle = "#4b220d";                               // the cuts: dark copper
        cx.fillRect(0, 0, MW, MW);
        bx.fillStyle = "#000";
        bx.fillRect(0, 0, BW2, BW2);
        // one strip of the weave (a palm-frond strip with its fibres, 2.1 : 1, 45 degrees - the book), drawn once per slant into a canvas
        // 2 cells wide and 1 row high (a cell = 0.12 across x 0.153 high on the dome), for colour and for bump; stamped centred on its cell
        const CELL_W = 0.12, ROW_H = 0.153, BAR_L = 0.146, BAR_W = 0.07;
        const strip = (slant, bump) => {
          const SW = 128, SH = 64, sc = mk(SW, SH), s2 = sc.getContext("2d");
          s2.translate(SW / 2, SH / 2);
          s2.scale(SW / 2 / CELL_W, SH / ROW_H);
          s2.rotate(slant * Math.PI / 4);
          const gr = s2.createLinearGradient(0, -BAR_W / 2, 0, BAR_W / 2);   // across the strip: the lit edge -> the shaded edge
          if (bump) {
            gr.addColorStop(0, "#808080");
            gr.addColorStop(0.4, "#ffffff");
            gr.addColorStop(1, "#5a5a5a");
          } else {
            gr.addColorStop(0, "#f7c393");
            gr.addColorStop(0.4, "#dc8c55");
            gr.addColorStop(1, "#8e4519");
          }
          s2.fillStyle = gr;
          s2.fillRect(-BAR_L / 2, -BAR_W / 2, BAR_L, BAR_W);
          s2.strokeStyle = bump ? "rgba(0,0,0,0.3)" : "rgba(80,32,10,0.5)";   // the fibres along the strip
          s2.lineWidth = 0.004;
          for (const f of [-0.22, 0, 0.22]) {
            s2.beginPath();
            s2.moveTo(-BAR_L / 2, f * BAR_W);
            s2.lineTo(BAR_L / 2, f * BAR_W);
            s2.stroke();
          }
          return sc;
        };
        const ST = { c: [strip(1, false), strip(-1, false)], b: [strip(1, true), strip(-1, true)] };
        // a twisted cord between the bands ("וגדילים היו להם כמעשה שרשראות", Rashi 7:17): short slanted lobes in two tones
        const cord = (y0, h, n) => {
          const cw = MW / n;
          for (const [c2, k] of [[cx, 1], [bx, K]]) {
            c2.fillStyle = k === 1 ? "#3a1806" : "#1c1c1c";
            c2.fillRect(0, y0 * k, MW * k, h * k);
            for (let i = 0; i < n; i++) {
              const xx = i * cw * k, yy = y0 * k, ww = cw * k, hh = h * k;
              c2.fillStyle = k === 1 ? (i % 2 ? "#c46d37" : "#eaa26a") : "#d8d8d8";
              c2.beginPath();
              c2.moveTo(xx, yy + hh);
              c2.lineTo(xx + ww * 0.6, yy + hh);
              c2.lineTo(xx + ww * 1.1, yy);
              c2.lineTo(xx + ww * 0.5, yy);
              c2.closePath();
              c2.fill();
            }
          }
        };
        // a woven region: nb bands between canvas rows yTop..yBot; band k (counted from the lower edge) gets cols(k) columns per tile
        const weave = (yTop, yBot, nb, rows, cols) => {
          const bh = (yBot - yTop) / nb, cordH = Math.max(4, bh * 0.12);
          for (let k = 0; k < nb; k++) {
            const b1 = yBot - k * bh, b0 = b1 - bh, n = cols(k), cw = MW / n, rh = (bh - cordH) / rows;
            for (let j = 0; j < rows; j++) {
              const y = b0 + j * rh, sl = (j + k * rows) % 2;
              for (let i = -1; i < n; i++) {                  // i = -1: the strips that wrap round from the tile's other edge
                cx.drawImage(ST.c[sl], (i - 0.5) * cw, y, 2 * cw, rh);
                bx.drawImage(ST.b[sl], (i - 0.5) * cw * K, y * K, 2 * cw * K, rh * K);
              }
            }
            cord(b1 - cordH, cordH, Math.round(n * 2.2));
          }
        };
        const domeRows = MW * (1 - ATL.dome[0]);                // 640 canvas rows: 7 bands of 3 rows
        weave(0, domeRows, 7, 3, (k) => Math.max(3, Math.round(2 * Math.PI * domeAt((k + 0.5) / 7)[0] / ATL.domeTiles / CELL_W)));
        weave(domeRows, MW * (1 - ATL.ball[0]), 4, 3,        // the ball: 4 bands of 3 rows
          (k) => Math.max(3, Math.round(2 * Math.PI * YB.ballR * Math.sin(Math.PI * (k + 0.5) / 4) / ATL.ballTiles / CELL_W)));
        // the rose (the book's "שושנים"): layered petals round a spiral bud, light at the rims and dark at the bases
        const roseAt = (c2, k, x0, y0, S) => {
          const R = S * 0.47 * k, bump = k !== 1;
          c2.save();
          c2.fillStyle = bump ? "#000" : "#3c1a08";
          c2.fillRect(x0 * k, y0 * k, S * k, S * k);
          c2.translate((x0 + S / 2) * k, (y0 + S / 2) * k);
          for (const [n, rr, off] of [[6, 1, 0], [6, 0.8, 0.5], [5, 0.6, 0.2], [4, 0.42, 0.65], [3, 0.26, 0.1]]) {
            for (let i = 0; i < n; i++) {
              const a = (i + off) / n * Math.PI * 2;
              const gr = c2.createRadialGradient(0, 0, rr * R * 0.15, 0, 0, rr * R);
              if (bump) {
                gr.addColorStop(0, "#202020");
                gr.addColorStop(0.8, "#bdbdbd");
                gr.addColorStop(1, "#ffffff");
              } else {
                gr.addColorStop(0, "#6e300f");
                gr.addColorStop(0.75, "#d88a52");
                gr.addColorStop(1, "#f7c08e");
              }
              c2.fillStyle = gr;
              c2.beginPath();
              c2.ellipse(Math.cos(a) * rr * R * 0.5, Math.sin(a) * rr * R * 0.5, rr * R * 0.55, rr * R * 0.42, a, 0, Math.PI * 2);
              c2.fill();
              c2.strokeStyle = bump ? "rgba(0,0,0,0.7)" : "rgba(58,22,6,0.85)";
              c2.lineWidth = Math.max(1, 1.6 * k);
              c2.stroke();
            }
          }
          c2.strokeStyle = bump ? "rgba(0,0,0,0.8)" : "rgba(60,22,6,0.9)";   // the bud: a spiral
          c2.lineWidth = Math.max(1, 1.8 * k);
          c2.beginPath();
          for (let i = 0; i <= 40; i++) {
            const a = i / 40 * Math.PI * 5, r = (0.02 + 0.2 * i / 40) * R;
            if (i) c2.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            else c2.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          c2.stroke();
          c2.restore();
        };
        const RS = MW * ATL.rose;                               // the rose square: columns 0..128, rows 896..1024
        roseAt(cx, 1, 0, MW - RS, RS);
        roseAt(bx, K, 0, MW - RS, RS);
        atlasMap = new CanvasTexture(cv);
        atlasMap.colorSpace = SRGBColorSpace;
        atlasBump = new CanvasTexture(bv);
        for (const t of [atlasMap, atlasBump]) {
          t.wrapS = RepeatWrapping;
          t.wrapT = ClampToEdgeWrapping;
          t.anisotropy = 8;
        }
      } catch (e) {
        console.warn("[heichal] Yachin and Boaz: weave texture skipped:", e && e.message);
        atlasMap = atlasBump = null;
      }
      // ---- materials: warm polished copper like the book (clones of M.bronze), the cuts darker. Tested in headless pictures: with
      //      M.bronze's metalness 0.95 and a saturated colour the shafts read dark maroon inside the closed ulam (lit by the environment
      //      and the hemisphere only); a light copper colour, metalness 0.75 and a faint warm emissive keep them bright orange-copper ----
      const copper = (hex, rough, extra) => {
        const m = M.bronze.clone();
        m.color.set(hex);
        m.roughness = rough;
        m.metalness = 0.75;
        m.envMapIntensity = 1.4;
        m.emissive.set(0x3a1a0a);
        m.emissiveIntensity = 0.6;
        return Object.assign(m, extra || {});
      };
      const shaftMat = copper(0xf2a477, 0.28);                  // the smooth shaft (the book)
      const capMat = atlasMap                                   // the weave and the roses: the atlas colours, a glow that follows them
        ? copper(0xffffff, 0.36, { map: atlasMap, bumpMap: atlasBump, bumpScale: 2.2, emissiveMap: atlasMap })
        : copper(0xd98a55, 0.4);
      if (atlasMap) {
        capMat.emissive.set(0x6a4030);
        capMat.emissiveIntensity = 1;
      }
      const basinMat = copper(0x8a4a22, 0.5, { metalness: 0.7 });   // the lower basin between the roses (the book: dark)
      basinMat.emissive.set(0x2a1006);
      basinMat.emissiveIntensity = 1;
      const pomMat = copper(0xf5ad80, 0.3);                     // the pomegranates
      const chainMat = copper(0xb06030, 0.42);                  // the chains
      chainMat.emissive.set(0x2a1006);
      // ---- geometry ----
      const remapUV = (geo, tiles, v0, v1) => {                 // a lathe's (u round it, v along the profile) -> its atlas region
        const uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * tiles, v0 + (v1 - v0) * uv.getY(i));
        uv.needsUpdate = true;
        return geo;
      };
      const shaftG = new CylinderGeometry(YB.shaftR, YB.shaftR, YB_SH1 - F, 64, 1, true);   // an open tube, y 12..30
      shaftG.translate(0, (YB_SH1 - F) / 2, 0);
      const basinG = new LatheGeometry(basinPts.map((p) => new Vector2(p[0], p[1])), 72);
      const domeG = remapUV(new LatheGeometry(domePts.map((p) => new Vector2(p[0], p[1])), 96), ATL.domeTiles, ATL.dome[0], ATL.dome[1]);
      const ballG = remapUV(new LatheGeometry(ballPts.map((p) => new Vector2(p[0], p[1])), 32), ATL.ballTiles, ATL.ball[0], ATL.ball[1]);
      // a rose: a low cushion 0.54 across and 0.11 high with six shallow petal lobes (model choice: the relief of the book's roses), its
      // face (+z) out of the basin; the rose picture of the atlas lies on it (planar uv)
      const RR = 0.27, RH = 0.11, RN = 12;
      const roseG = (() => {
        const pos = [0, 0, RH], uvs = [0.5, 0.5], idx = [];
        const rings = [[0.62, 0.72], [1, 0.16], [0.97, -0.03]];  // [radius factor, height factor]; the last ring is sunk into the basin
        for (const [rf, hf] of rings) for (let i = 0; i < RN; i++) {
          const a = i / RN * Math.PI * 2, r = RR * rf * (1 + 0.07 * Math.cos(6 * a));
          pos.push(Math.cos(a) * r, Math.sin(a) * r, RH * hf);
          uvs.push(0.5 + Math.cos(a) * r / (2 * RR * 1.08), 0.5 + Math.sin(a) * r / (2 * RR * 1.08));
        }
        for (let i = 0; i < RN; i++) idx.push(0, 1 + i, 1 + (i + 1) % RN);
        for (let r = 0; r < rings.length - 1; r++) for (let i = 0; i < RN; i++) {
          const a0 = 1 + r * RN + i, a1 = 1 + r * RN + (i + 1) % RN, b0 = a0 + RN, b1 = a1 + RN;
          idx.push(a0, b0, b1, a0, b1, a1);
        }
        const gg = new BufferGeometry();
        gg.setAttribute("position", new Float32BufferAttribute(pos, 3));
        gg.setAttribute("uv", new Float32BufferAttribute(uvs.map((u) => u * ATL.rose), 2));
        gg.setIndex(idx);
        gg.computeVertexNormals();
        return gg;
      })();
      // a pomegranate 0.16 across with its crown on top (model choice: 100 of them fill the ring)
      const pomG = (() => {
        const fruit = new SphereGeometry(YB.pomR, 6, 4);
        const crown = new CylinderGeometry(0.034, 0.018, 0.05, 5, 1, true);
        crown.translate(0, YB.pomR + 0.012, 0);
        return mergeGeometries([fruit, crown]);
      })();
      const chainG = new TorusGeometry(1, 0.0062, 3, 128);      // scaled by its row's radius: a chain ~0.017 thick
      chainG.rotateX(Math.PI / 2);
      // ---- instances ----
      const mShaft = [], mBasin = [], mDome = [], mBall = [], mRose = [], mPom = [], mChain = [];
      const at = (x, y, z) => new Matrix4().makeTranslation(x, y, z);
      const ROSE_ROWS = [[0.2, 0.9, 0], [0.5, 1, 0.5], [0.8, 1, 0]];  // [s on the basin, scale, offset in pitches]: 3 staggered rows
      const ROSE_N = 26;                                        // per row (the book: ~26-28 round the capital)
      const POM_ROWS = [[YB_BELLY, 0], [YB_BELLY + 0.42, 0.5]];    // the two rows [y, offset]: on the joint and on the network's skirt
      const POM_N = 100;                                        // per row (7:20, 7:42; Jer 52:23)
      const xa = new Vector3(), ya = new Vector3(), za = new Vector3();
      for (const s of SIDES) {
        const cz = s * PZ;
        mShaft.push(at(PX, F, cz));
        mBasin.push(at(PX, YB_C0, cz));
        mDome.push(at(PX, YB_BELLY, cz));
        mBall.push(at(PX, ballY, cz));
        for (const [sv, sc, off] of ROSE_ROWS) {
          const r = basinR(sv), y = YB_C0 + 2 * sv, drdy = (YB.bellyR - YB.footR) * (1 - sv), nl = Math.hypot(1, drdy);
          for (let i = 0; i < ROSE_N; i++) {
            const a = (i + off) / ROSE_N * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
            za.set(ca / nl, -drdy / nl, sa / nl);               // the basin's outward normal
            ya.set(ca * drdy / nl, 1 / nl, sa * drdy / nl);     // up along the basin
            xa.crossVectors(ya, za);
            const m = new Matrix4().makeBasis(xa, ya, za).scale(new Vector3(sc, sc, sc));
            m.setPosition(PX + r * ca, y, cz + r * sa);
            mRose.push(m);
          }
        }
        for (const [y, off] of POM_ROWS) {
          const R = domeRadiusAt(y - YB_BELLY) + YB.pomR - 0.01;  // the pomegranate rests on the surface (sunk 0.01)
          for (let i = 0; i < POM_N; i++) {
            const a = (i + off) / POM_N * Math.PI * 2;
            mPom.push(at(PX + R * Math.cos(a), y, cz + R * Math.sin(a)));
          }
          mChain.push(at(PX, y + 0.045, cz).multiply(new Matrix4().makeScale(R, R, R)));
          if (s > 0) YB.rows.push({ y, r: R, n: POM_N });
          YB.rMax = Math.max(YB.rMax, R + YB.pomR);
        }
      }
      const inst = (name, geo, mat, mats, shadow) => {
        const im = hei_inst(gYB, geo, mat, mats, shadow);
        im.receiveShadow = true;
        im.name = name;
        return im;
      };
      inst("yb-shaft", shaftG, shaftMat, mShaft, true);
      ybRashiCap = [inst("yb-basin", basinG, basinMat, mBasin, true), inst("yb-dome", domeG, capMat, mDome, true), inst("yb-ball", ballG, capMat, mBall, true),
        inst("yb-roses", roseG, capMat, mRose, false), inst("yb-pomegranates", pomG, pomMat, mPom, false), inst("yb-chains", chainG, chainMat, mChain, false)];
      // ---- 1.0.1-L (FIXES L.60; the user: "עיין בפירוש המלבים למעשה שושן (פס' יט) והוסף זאת כאופצי'"): MALBIM'S CAPITALS - the second
      //      reading, group "yb-malbim", hidden until ctx.shared.pillarCapital.set("malbim") (sec. 12) hides Rashi's capital (ybRashiCap) and
      //      shows it; the shafts serve both. Malbim on 7:15-22 (every quote checked in the DB):
      //      - the two pillars were cast as one piece of 35 (II Chr 3:15) and parted, and the smith "הקיש בקורנס ועשה על שפת כל א' מעשה
      //        שושן ונתארך חצי אמה" (7:15); 7:22 "שכל עמוד בעצמו נעשה בראשו כמעשה שושן", "הקיש בקורנס ועשה מחצי האמה אורך אמה, וצייר ברדודו
      //        מעשה שושן בראשו" - the shaft's own head beaten out into a lily: the top amah of the shaft flared from r 2 to 2.42 with eight
      //        petal lobes (the flare and the lobes: model choice);
      //      - the capital of 5 stands ON the head (7:16 "לתת על ראשי העמודים"; here y 30..35, the pillar 23 in all) and "הכתר נחלק לשתי
      //        גולות" (7:16): the lower gulah 2 high up to the belly, "קצת למטה מחצי הגוף" (7:20 "הגולה התחתונה היה גובהה שתי אמות ואז
      //        התחילה הגולה העליונה שהיה גובהה שלש אמות"), the upper gulah 3 high "ככובע על ראש העמוד", closed on top ("שהיתה הכותרת גם
      //        ממעל", 7:20; II Kings 25:17 "קומת הכתרת שלש אמות") - a half ellipsoid r 2.5 x 3 (model choice);
      //      - the net over the upper half: 7:17 "חציו העליון היה מכוסה בשבכה שהוא לבוש ממעשה רשת, ארוג מנחושת" - a diamond net of copper
      //        cords drawn once (256 px) and repeated round the hat;
      //      - seven chains per capital hanging from the net's lower edge over the joint: 7:17 "ותחת השבכה היה גדילים מעשה שרשרות, והיו
      //        שבעה שרשרות לכל כותרת, והיה התחלת השרשרות על השבכה בסופה לכסות ההפסק בין שני הגולות" - seven cords y 31..32;
      //      - at their ends two rows of pomegranates hanging by their heads from two chain rings, their bodies over the lower gulah: 7:17
      //        "ובסוף השרשרות היו תלוים שני טורי רמונים שהיה ראשם תלוי בשרשרות וסופם מכסה את הגולה התחתונה", 7:18 "השרשרות דבוקים לראש
      //        הרמונים וגוף הרמונים תלוים למטה על הגולה התחתונה", 7:20 "מאה רמונים בכל טור" - 2 x 100 teardrops 0.15 x 0.8 (model choice),
      //        the rings at y 31.6 and 31.05, the second row half a pitch round;
      //      - 7:19 is a THIRD capital, painted on the wall where the pillars' heads reach: "ר"ל שהיה שושן מצויר על כותל האולם במקום שהגיעו
      //        לשם ראשי העמודים היינו י"ח אמות בגובה הכותל של האולם והיה ארכו ורחבו וגבהו של הכותרת המצויר בכותל ד' אמות" - a lily capital
      //        painted 4 x 4 (canvas, transparent ground) on the house's east wall - the wall the pillars stand by in this model (Malbim
      //        himself stands them before the ulam, 7:21 - DEV note) - from the head's height y 30 up to 34, centred on each pillar
      //        (z +-5.17..9.17; the doorpost and the lintel of 55-interior.js stand before its inner edge, its cedar strips at x 2.58 behind
      //        the plane at x 2.6). Behind the real capital it shows beside it from the side and from above, as in his picture.
      //      Materials as Rashi's (copper); +6 instanced meshes and 2 painting instances when shown.
      //      1.0.1-L (A14, his decision "אם לא מסובך מדי"): in this reading the pillars STAND BEFORE THE ULAM as Malbim 7:21 "שהקים אותם לפני האולם וסמוך לו": set("malbim") moves the
      //      whole group 16 east (E - HE: x 22.08, the hat 1.08 from the front wall) and the painted lily lies on the ulam's FRONT, at the heads' height y 30..34. The doorway (|z| 5, jambs to 6.2)
      //      takes its width, so the lily stands beside it (z +-8.25). The steps run under them (x 18.5..24.5, y 12..6): so that the heads keep "י"ח אמות בגובה הכותל של האולם" from the
      //      ulam's floor each shaft stands on a stone pier from the court's floor up to the floor's level (x 18.5..24.25, |z| 5..9.34), between them the middle of the steps: model choice.
      {
        const gM = new Group();
        gM.name = "yb-malbim";
        gM.visible = false;
        gYB.add(gM);
        ybMalbim = gM;
        for (const s of [-1, 1]) H.box(gM, PX + 2.17 - HE, F - LV.AZ, 4.34, M.stoneSmooth, (PX + 2.17 + HE) / 2, LV.AZ, s * PZ).name = "yb-m-pier";   // A14: local x HE..PX + 2.17 = world 18.5..24.25
        // 1.0.1-L (verifier): the rim 1 high, not 0.5 - the half amah that was beaten out BECAME an amah, and the lily is drawn on it: Malbim 7:22 "הקיש בקורנס ועשה מחצי האמה אורך אמה, וצייר ברדודו מעשה שושן בראשו"
        const MB = { rimR: 2.42, rimH: 1, bellyR: 2.5, lowH: 2, hatH: 3 };
        const Y_RIM = YB_SH1 - MB.rimH, Y_CAP = YB_SH1, Y_BELLY = YB_SH1 + MB.lowH;      // 29, 30, 32 (the top 35)
        const rimPts = [];                                      // (a) the lily rim of the shaft's head
        for (let i = 0; i <= 6; i++) { const s = i / 6; rimPts.push([YB.shaftR + (MB.rimR - YB.shaftR) * s * s, MB.rimH * s]); }
        const rimG = new LatheGeometry(rimPts.map((p) => new Vector2(p[0], p[1])), 64);
        {
          const p = rimG.attributes.position;
          for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.hypot(x, z);
            if (r <= YB.shaftR + 1e-6) continue;
            const f = 1 + 0.08 * Math.max(0, Math.cos(8 * Math.atan2(z, x))) * (y / MB.rimH);   // eight petal lobes, growing toward the rim
            p.setXYZ(i, x * f, y, z * f);
          }
          rimG.computeVertexNormals();
        }
        const lowR = (s) => YB.shaftR + (MB.bellyR - YB.shaftR) * (1 - (1 - s) * (1 - s));   // (b) the lower gulah's profile, 2 high
        const lowPts = [];
        for (let i = 0; i <= 10; i++) lowPts.push([lowR(i / 10), MB.lowH * i / 10]);
        const lowG = new LatheGeometry(lowPts.map((p) => new Vector2(p[0], p[1])), 72);
        const hatPts = [];                                      // (c) the hat: a closed half ellipsoid r 2.5 x 3
        for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI / 2; hatPts.push([i === 16 ? 0 : MB.bellyR * Math.cos(a), MB.hatH * Math.sin(a)]); }
        const hatG = new LatheGeometry(hatPts.map((p) => new Vector2(p[0], p[1])), 72);
        { const uv = hatG.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 24, uv.getY(i) * 6); uv.needsUpdate = true; }   // the net's mesh ~0.65 amah (24 tiles round, 6 up: model choice; 8 x 3 read as hoops in the pictures)
        let netMat = copper(0xc9733a, 0.42);                    // (d) the net (a plain copper if there is no canvas)
        try {
          const c = document.createElement("canvas");
          c.width = c.height = 256;
          const q = c.getContext("2d");
          q.fillStyle = "#6a3214";
          q.fillRect(0, 0, 256, 256);
          q.lineCap = "round";
          for (const [col, w] of [["#3a1806", 14], ["#e8a066", 9], ["#f7c898", 3]]) {   // a cord: dark edge, copper body, a bright ridge
            q.strokeStyle = col;
            q.lineWidth = w;
            q.beginPath();
            for (let k = -1; k <= 1; k++) {                     // both diagonals, continued past the edges so the tile repeats seamlessly
              q.moveTo(k * 256, 0); q.lineTo(k * 256 + 256, 256);
              q.moveTo(k * 256 + 256, 0); q.lineTo(k * 256, 256);
            }
            q.stroke();
          }
          const tx = new CanvasTexture(c);
          tx.colorSpace = SRGBColorSpace;
          tx.wrapS = tx.wrapT = RepeatWrapping;
          tx.anisotropy = 8;
          netMat = copper(0xffffff, 0.4, { map: tx, emissiveMap: tx });
          netMat.emissive.set(0x6a4030);
          netMat.emissiveIntensity = 0.9;
        } catch (e) {
          console.warn("[heichal] Malbim's net texture skipped:", e && e.message);
        }
        const cordG = new CylinderGeometry(0.035, 0.035, 1, 6); // (e) a hanging chain: a thin cord one amah long
        // (g) a hanging pomegranate. 1.0.1-L (verifier): the profile runs from the foot up, as every lathe here - from the head down its faces looked inward (drawn inside out with a FrontSide material)
        const hpomG = new LatheGeometry([[0, -0.8], [0.02, -0.76], [0.045, -0.68], [0.07, -0.5], [0.075, -0.25], [0.05, -0.05], [0, 0]].map((p) => new Vector2(p[0], p[1])), 8);
        const mRim = [], mLow = [], mHat = [], mCord = [], mRing = [], mHPom = [];
        const ROWS_M = [[Y_BELLY - 0.4, 0], [Y_BELLY - 0.95, 0.5]];   // the rings the two rows hang from: y 31.6 and 31.05 (bodies to 30.8 / 30.25)
        for (const s of SIDES) {
          const cz = s * PZ;
          mRim.push(at(PX, Y_RIM, cz));
          mLow.push(at(PX, Y_CAP, cz));
          mHat.push(at(PX, Y_BELLY, cz));
          for (let k = 0; k < 7; k++) {
            const a = (k + 0.25) / 7 * Math.PI * 2, r = MB.bellyR + 0.06;
            mCord.push(at(PX + r * Math.cos(a), Y_BELLY - 0.5, cz + r * Math.sin(a)));
          }
          for (const [y, off] of ROWS_M) {
            const R = lowR((y - Y_CAP) / MB.lowH) + 0.1;        // just outside the gulah's surface at the ring's height
            for (let i = 0; i < POM_N; i++) {
              const a = (i + off) / POM_N * Math.PI * 2;
              mHPom.push(at(PX + R * Math.cos(a), y, cz + R * Math.sin(a)));
            }
            mRing.push(at(PX, y, cz).multiply(new Matrix4().makeScale(R, R, R)));
          }
        }
        const instM = (name, geo, mat, mats, shadow) => {
          const im = hei_inst(gM, geo, mat, mats, shadow);
          im.receiveShadow = true;
          im.name = name;
          return im;
        };
        instM("yb-m-rim", rimG, shaftMat, mRim, true);
        instM("yb-m-lower", lowG, basinMat, mLow, true);
        instM("yb-m-hat", hatG, netMat, mHat, true);
        instM("yb-m-cords", cordG, chainMat, mCord, false);
        instM("yb-m-rings", chainG, chainMat, mRing, false);
        instM("yb-m-pomegranates", hpomG, pomMat, mHPom, false);
        try {                                                   // (h) the painted lily capital of 7:19
          const c = document.createElement("canvas");
          c.width = c.height = 256;
          const q = c.getContext("2d");
          q.clearRect(0, 0, 256, 256);
          q.lineJoin = "round";
          q.lineWidth = 5;
          q.strokeStyle = "#4b220d";
          const fill = (cx2, cy2, r) => {
            const gr = q.createRadialGradient(cx2, cy2, r * 0.1, cx2, cy2, r);
            gr.addColorStop(0, "#f3b07a");
            gr.addColorStop(0.7, "#c9733a");
            gr.addColorStop(1, "#8e4519");
            return gr;
          };
          q.fillStyle = fill(128, 190, 110);                    // the cup (the calyx) from the base up to the petals' row
          q.beginPath();
          q.moveTo(86, 240); q.quadraticCurveTo(64, 180, 36, 134); q.lineTo(220, 134); q.quadraticCurveTo(192, 180, 170, 240); q.closePath();
          q.fill(); q.stroke();
          const petals = [[46, 88, 18, 22], [78, 118, 73, 8], [108, 148, 128, 2], [138, 178, 183, 8], [168, 210, 238, 22]];   // [base x0, x1, tip x, tip y]
          for (const [b0, b1, tx2, ty] of petals) {
            q.fillStyle = fill((b0 + b1) / 2, 90, 80);
            q.beginPath();
            q.moveTo(b0, 134); q.quadraticCurveTo(tx2 - (b1 - b0) * 0.9, (134 + ty) / 2, tx2, ty); q.quadraticCurveTo(tx2 + (b1 - b0) * 0.9, (134 + ty) / 2, b1, 134); q.closePath();
            q.fill(); q.stroke();
            q.beginPath(); q.moveTo((b0 + b1) / 2, 134); q.lineTo(tx2, ty + 10); q.stroke();   // the midrib
          }
          q.fillStyle = fill(128, 116, 18);                     // the bud
          q.beginPath(); q.ellipse(128, 116, 15, 20, 0, 0, Math.PI * 2); q.fill(); q.stroke();
          const tx = new CanvasTexture(c);
          tx.colorSpace = SRGBColorSpace;
          tx.anisotropy = 8;
          const paintMat = new MeshStandardMaterial({ map: tx, transparent: true, roughness: 0.85, metalness: 0.05, emissive: 0x2a1408, emissiveIntensity: 0.35, side: FrontSide, depthWrite: false });
          const pg = new PlaneGeometry(4, 4);
          pg.rotateY(Math.PI / 2);                              // its face toward +x, into the ulam
          const pm = hei_inst(gM, pg, paintMat, SIDES.map((s) => at(HE + 0.1, Y_CAP + 2, s * 8.25)), false);   // A14: x + 16 = the ulam's front (18.6), beside the doorway's jamb
          pm.name = "yb-m-painting";
          pm.castShadow = pm.receiveShadow = false;
        } catch (e) {
          console.warn("[heichal] Malbim's painted lily skipped:", e && e.message);
        }
      }
    }

    // ============================================================ 8. ceilings and the roof of the house ============================================================
    // Double ceiling (Rashi on 6:9-10; Rambam quoted by Malbim on 6:9): the lower decorated ceiling 1 (y 42..43), the air space
    // "בית דילפא" 2, the upper cedar ceiling 1 (45..46); a stone roof slab 46..47.5 over the 4-thick upper walls, x -67.5..-3.5, z +-14 (model
    // choice, no parapet - see spec: the "עליות" layer sits on it). The gold underside of the lower ceiling: 6:22 "ואת כל הבית צפה זהב עד
    // תם כל הבית" - Metzudat David there: "בא לומר שהכל חפה, ואף התקרה שלא הוזכר למעלה" (also the devir aliyah, II Chr 3:9); 1.0.1-K: the
    // gold undersides lie between 55-interior's gold skins (z +-9.8, x -63.4..-3.7) and on both sides of the amah traksin (x -44.5..-43.5,
    // which rises to the ceiling), not over their tops.
    // 1.2.0 (the user, after the book "נתיבות המקרא" p. 10-11, figs. 14-17; Rashi 6:9): the house ceiling is TWO ceilings - the lower, the
    // "גבים", for beauty: a carved and painted ceiling (Metzudot: "גומות גומות חקוקות לנוי"; the book: wood, decorated and gold-plated),
    // then "בית דילפא", two amot of air, then the "שדרות בארזים", cedars side by side, "לדריסת הרגל" - the floor of the aliyah (Rashi).
    // The same three layers close each aliyah (the layer "aliyot" below). The coffers: a gold map with recessed ovals (hei_cofferGold).
    const hei_cofferGold = (() => {
      const draw = (c, sz) => {
        c.fillStyle = "#d8b14e";
        c.fillRect(0, 0, sz, sz);
        const g2 = c.createLinearGradient(0, 0, sz, sz);
        g2.addColorStop(0, "rgba(255,240,190,.25)");
        g2.addColorStop(1, "rgba(120,80,10,.25)");
        c.fillStyle = g2;
        c.fillRect(0, 0, sz, sz);
        // 1.2.3 (the user: "כל הגבים צריכים להיות עמוקים יותר"): each pit drawn as a deep recess - a dark wall of the recess on the upper-left,
        // a lit floor toward the lower-right, a bright rim - and a steep bump (bumpScale 3.6, was 1.2)
        for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) {
          const cx = sz * (0.25 + 0.5 * k), cy = sz * (0.25 + 0.5 * r), rx = sz * 0.2, ry = sz * 0.15;
          const g3 = c.createRadialGradient(cx - rx * 0.35, cy - ry * 0.35, rx * 0.1, cx, cy, rx);
          g3.addColorStop(0, "#5a3d0a");
          g3.addColorStop(0.55, "#8a6016");
          g3.addColorStop(1, "#4a3208");
          c.fillStyle = g3;
          c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); c.fill();
          c.fillStyle = "#c99a3a";
          c.beginPath(); c.ellipse(cx + rx * 0.12, cy + ry * 0.16, rx * 0.62, ry * 0.56, 0, 0, Math.PI * 2); c.fill();
          c.strokeStyle = "#fff0b0";
          c.lineWidth = sz * 0.014;
          c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); c.stroke();
        }
      };
      const bump = (c, sz) => {
        c.fillStyle = "#ffffff";
        c.fillRect(0, 0, sz, sz);
        for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) {
          const cx = sz * (0.25 + 0.5 * k), cy = sz * (0.25 + 0.5 * r);
          const gr = c.createRadialGradient(cx, cy, sz * 0.02, cx, cy, sz * 0.2);
          gr.addColorStop(0, "#202020");
          gr.addColorStop(0.8, "#303030");
          gr.addColorStop(1, "#ffffff");
          c.fillStyle = gr;
          c.beginPath(); c.ellipse(cx, cy, sz * 0.19, sz * 0.14, 0, 0, Math.PI * 2); c.fill();
        }
      };
      return goldStd(worldTex(makeTex(512, draw, { bump, bumpSize: 512 }), 4), { roughness: 0.34, bumpScale: 3.6 });
    })();
    let houseRoofProxy = null;   // the cutaway toggles this stand-in; the real roof follows it AND the aliyot layer (hidden while the aliyot stand on the cedars)
    {
      // 1.2.4 (the user: "העליה עצמה אמורה להיות יותר נמוכה בי' אמות"): the ceilings in two pieces, over the devir (DW..DE) and over the kodesh
      // (DE..KE) - in the aliyot reading the pieces over the devir go (ctx.aliyotHide, 70-ui.js applyHidden): there the first aliyah's
      // floor is the devir's own ceiling set (32..36), ten amot under the heichal's (sec. 9)
      const c1w = H.box(g, DE - DW, 1, 20, M.gold, (DE + DW) / 2, CEIL, 0);   // 1.2.3 (the user: "תקרת הגבים היתה מזהב"): the slab gold, not cedar
      c1w.name = "house-ceiling-gavim-w";
      const c1 = H.box(g, KE - DE, 1, 20, M.gold, (KE + DE) / 2, CEIL, 0);
      c1.name = "house-ceiling-gavim";
      const goldW = hei_boxMesh(g, [{ x0: DW + 0.1, x1: DE, y0: CEIL - 0.05, y1: CEIL, z0: -9.8, z1: 9.8 }], hei_cofferGold, "house-ceiling-gold-w");
      const gold = hei_boxMesh(g, [{ x0: CO.xKodeshW, x1: KE - 0.2, y0: CEIL - 0.05, y1: CEIL, z0: -9.8, z1: 9.8 }], hei_cofferGold, "house-ceiling-gold");
      const c2w = H.box(g, DE - DW, 1, 20, M.cedar, (DE + DW) / 2, CEIL + 3, 0);
      c2w.name = "house-ceiling-sdeirot-w";
      const c2 = H.box(g, KE - DE, 1, 20, M.cedar, (KE + DE) / 2, CEIL + 3, 0);
      c2.name = "house-ceiling-sdeirot";
      const aliyotHide = (ctx.aliyotHide = ctx.aliyotHide || []);
      aliyotHide.push(c1w, goldW, c2w);
      // (1.2.2 filled the two amot of בית דילפא with a dark box; 1.2.3 (the user: "לא השארת 2 אמות בין הגבים לארזים"): the gap is left open - from the
      // section's east end one looks into it, the gold top of the גבים below and the cedars above)
      const roof = hei_boxMesh(g, [{ x0: wx[3] - 0.3, x1: KE - 0.3, y0: TOP, y1: ROOF, z0: -zOut(3) - 0.3, z1: zOut(3) + 0.3 }], M.stone, "house-roof");
      houseRoofProxy = new Object3D();
      houseRoofProxy.name = "house-roof-proxy";
      houseRoofProxy.userData.real = roof;
      cut.push(c1w, c1, goldW, gold, c2w, c2, houseRoofProxy);
      // the three layers named at the EAST end of the ceilings (1.2.3: the section is seen from the east, "פתח את העליות" / "בית דילפא")
      ctx.labels.push(
        { text: "תקרת הגבים — כיור מצויר ומצופה זהב (מלכים א ו, ט; מצודות: גומות לנוי)", x: KE + 0.8, y: CEIL + 0.3, z: 0, size: 1.3 },
        { text: "בית דילפא — חלל שתי אמות בין התקרות", x: KE + 0.8, y: CEIL + 2, z: 0, size: 1.3 },
        { text: "שדרות בארזים — ארזים זה בצד זה, רצפת העלייה (רש״י ו, ט)", x: KE + 0.8, y: CEIL + 3.7, z: 0, size: 1.3 }
      );
      // over the devir only: a ceiling at 20 (I Kings 6:20 "עשרים אמה קומתו", Rashi: "עלית של בית קדשי הקדשים, נמוכה משל היכל"; Chazal in
      // Bava Batra 98b-99a measure the 20 from the cherubim's wing-line - DEV note) with a gold underside (II Chr 3:9 "והעליות חפה זהב");
      // the room above it (y 33..42) is the devir's עלייה: empty, gold-lined.
      const dc = H.box(g, DE - DW, 1, 20, M.gold, (DE + DW) / 2, F + CO.DEVIR_H, 0);   // 1.2.4: the devir's גבים slab gold (as the house's)
      const dg = H.box(g, DE - (DW + 0.2), 0.05, 19.6, hei_cofferGold, (DE + DW + 0.2) / 2, F + CO.DEVIR_H - 0.05, 0);   // 1.2.3: the devir's גבים (the user)
      const dt = H.box(g, DE - DW, 0.05, 20, M.gold, (DE + DW) / 2, F + CO.DEVIR_H + 1, 0);
      cut.push(dc, dg, dt);
      const aY = F + CO.DEVIR_H + 1.05, aH = CEIL - 0.05 - aY;               // the aliyah's gold lining: on its floor (dt), under the gold ceiling
      for (const s of [-1, 1]) {
        const sk = H.box(g, DE - DW, aH, 0.1, M.gold, (DE + DW) / 2, aY, s * 9.95);
        if (s > 0) cut.push(sk);
        aliyotHide.push(sk);   // 1.2.4: in the aliyot reading the room over the devir is the first aliyah's west part, lined by the layer itself
      }
      aliyotHide.push(H.box(g, 0.1, aH, 19.8, M.gold, DW + 0.05, aY, 0));
    }

    // ============================================================ 9. layer "עליות" (ctx.layers.aliyot) ============================================================
    // II Chr 3:4 "והגבה מאה ועשרים" per Rashi there: 30 up to the first ceiling and another 90 of upper stories up to the top roof = 120
    // (Radak's second reading: "ג' עליות גבהן תשעים אמה"; the number of stories, 3, follows Radak; the heights of the stories and the
    // ceilings are a model choice). Built over the house + the ulam hall: x -67.5..18.5, z +-14 (the upper walls of the house are 4
    // thick with their outer face at +-14, so the stories continue them), from the roof slab (47.5) up to 12 + 120 = 132.
    // 1.2.0 (the user: "בדיוק כמו בספר" - figs. 16-17 of "נתיבות המקרא"): TWO aliyot over the house (Rashi on II Chr 3:4: 30 to the first
    // ceiling, 90 above it to the top roof - 120), one on the other, each closed by the same three layers as the house - גבים, בית דילפא,
    // שדרות - and the top שדרות the roof. Model choice: the two of equal height (39 each; the three ceiling sets 4 thick); on the house's
    // cedars (the stone roof slab of the 30-amah reading is hidden while the layer shows). Inside: gold (II Chr 3:9 "והעליות חפה זהב").
    // They served as the treasuries where the Mishkan and its vessels were stored (Abarbanel on I Kings 8; Metzudat David 8:4) - the card.
    // The pill "פתח את העליות" takes the south wall off (the book's fig. 17: the interior in section).
    {
      const gA = new Group();
      gA.name = "aliyot";
      gA.visible = false;
      g.add(gA);
      ctx.layers.aliyot = gA;
      const A0 = TOP, AT = F + 120;                            // 46 .. 132: on the house's cedars, up to 120 over the floor
      const ax0 = wx[3], ax1 = E, acx = (ax0 + ax1) / 2;       // -67.5 .. 18.5
      layerLabel(gA, "העליות: הבית כולו 120 אמה (דברי הימים ב ג, ד לפי רש\"י)", acx, AT + 4, 0, 5);
      let aliyotBuilt = false;
      const open = { on: false, walls: [] };
      const buildAliyot = () => {
       if (aliyotBuilt) return;
       aliyotBuilt = true;
       try {
        // 1.2.4 (the user, Metzudat David on 6:20 after Rashi: "עליית בית קודש הקדשים היתה נמוכה משל היכל י' אמות"; "רק בקריאה של העליות"):
        // over the devir (x ax0 .. CO.xDevirE) the block is TEN AMOT LOWER - the first storey's ceiling set at 75..79 (the heichal's at
        // 85..89), the second storey 79..118 with its set at 118..122, the roof 122 against 132: a step seen from outside; the gold slabs
        // at the step close the first storey's ceiling drop (75..89) and the top (118..132). In the 30-amah reading nothing changes.
        const xS = CO.xDevirE;                                 // -44.5: the devir's east face - the step
        // 1.2.4 (the user: "העליה עצמה אמורה להיות יותר נמוכה בי' אמות"): over the devir the whole first storey is ten lower - its floor on the
        // devir's own ceiling set (the גבים 32..33, בית דילפא 33..35, the שדרות 35..36, built here), 36..75, the second 79..118, the roof 122; the
        // house's ceiling pieces over the devir and the gold room of the 30-amah reading are hidden while the layer shows (ctx.aliyotHide)
        const DEV_TOP = F + CO.DEVIR_H + 4;                    // 36
        const PARTS = [
          { x0: ax0, x1: xS, SB: [DEV_TOP, 79], SC: [75, 118], AT: AT - 10, west: true },
          { x0: xS, x1: ax1, SB: [A0, 89], SC: [85, 128], AT, east: true }
        ];
        H.box(gA, DE - DW, 1, 20, M.cedar, (DE + DW) / 2, DEV_TOP - 1, 0).name = "devir-sdeirot";   // the devir's שדרות: the first aliyah's floor over it
        layerLabel(gA, "תקרת הדביר — גבים, בית דילפא ושדרות; רצפת העלייה שמעליו (מצודת דוד ו, כ)", DE + 0.8, DEV_TOP - 2, 0, 1.2);
        const inW = 2 * 10;                                    // interior z +-10
        const WT4 = WT[3];                                     // 4
        const HOLE_X = [acx - 30, acx, acx + 30];              // the small windows' x (-54.5, -24.5, 5.5), 2 x 2, per side per story
        for (const P of PARTS) {
          const cx = (P.x0 + P.x1) / 2, len = P.x1 - P.x0;
          for (const s of [-1, 1]) {
            const holes = [];
            for (const sb of P.SB) for (const hx of HOLE_X) if (hx > P.x0 + 2 && hx < P.x1 - 2) holes.push({ c: hx - cx, b: sb + 10 - A0, w: 2, h: 2 });
            hei_holeWall(H, gA, { axis: "x", length: len, height: P.AT - A0, thickness: WT4, mat: M.stone, cx, cz: s * (10 + WT4 / 2), y: A0, holes, v0: 2 });
          }
          // 1.2.3 (the user: "המבט של העליות יהיה ממזרח"): "פתח את העליות" takes the EAST wall off - the two storeys seen along the house's length
          if (P.east || P.west) {
            const wx0 = P.east ? P.x1 - WT4 / 2 : P.x0 + WT4 / 2;
            const holes = P.SB.map((sb) => ({ c: 0, b: sb + 10 - A0, w: 2, h: 2 }));
            const wall = hei_holeWall(H, gA, { axis: "z", length: inW, height: P.AT - A0, thickness: WT4, mat: M.stone, cx: wx0, cz: 0, y: A0, holes, v0: 2 });
            if (P.east && wall) open.walls.push(wall);
          }
          const ix0 = P.west ? P.x0 + WT4 : P.x0, ix1 = P.east ? P.x1 - WT4 : P.x1, iL = ix1 - ix0, icx = (ix0 + ix1) / 2;   // the part's interior in x
          for (let i = 0; i < 2; i++) {
            const y0 = P.SB[i], y1 = P.SC[i];
            H.box(gA, iL, 1, inW, M.gold, icx, y1, 0).name = "aliyah-gavim";              // the גבים: a gold slab (1.2.3; was cedar), its underside the coffered gold
            H.box(gA, iL - 0.2, 0.05, inW - 0.2, hei_cofferGold, icx, y1 - 0.05, 0).name = "aliyah-gavim-gold";
            H.box(gA, iL, 1, inW, M.cedar, icx, y1 + 3, 0).name = "aliyah-sdeirot";       // the שדרות: the cedars - the floor of the next story / the roof; between them the two amot of בית דילפא, open
            for (const s of [-1, 1]) H.box(gA, iL, y1 - y0, 0.1, M.gold, icx, y0, s * 9.95);   // the gold on the walls (II Chr 3:9)
            if (P.east) {
              const skE = H.box(gA, 0.1, y1 - y0, inW, M.gold, P.x1 - WT4 - 0.05, y0, 0);   // the east lining goes with the east wall (1.2.3)
              open.walls.push(skE);
              layerLabel(gA, (i === 0 ? "עלייה א׳" : "עלייה ב׳") + " — אוצר בית האלקים (אברבנאל מלכים א ח)", acx, y0 + 20, 0, 3.2);
              layerLabel(gA, "גבים · בית דילפא · שדרות בארזים", P.x1 - WT4 + 0.8, y1 + 2, 0, 1.2);   // at the east end (1.2.3)
            }
            if (P.west) H.box(gA, 0.1, y1 - y0, inW, M.gold, P.x0 + WT4 + 0.05, y0, 0);
          }
          for (const s of [-1, 1]) H.box(gA, len, 1.5, 1, M.stoneLight, cx, P.AT, s * (10 + WT4 - 0.5)); // a parapet on the roof
          if (P.east) H.box(gA, 1, 1.5, 2 * (10 + WT4) - 2, M.stoneLight, P.x1 - 0.5, P.AT, 0);
          if (P.west) H.box(gA, 1, 1.5, 2 * (10 + WT4) - 2, M.stoneLight, P.x0 + 0.5, P.AT, 0);
        }
        // the step itself (1.2.4): the east part's end wall above the lower roof (x xS..xS+4, y 122..132), its parapet, and inside the two
        // gold slabs that close the ceiling drops at x = xS - the first storey's (75..89) and the second's (118..128)
        H.box(gA, WT4, AT - (AT - 10), 2 * (10 + WT4), M.stone, xS + WT4 / 2, AT - 10, 0).name = "aliyot-step-wall";
        H.box(gA, 1, 1.5, 2 * (10 + WT4) - 2, M.stoneLight, xS + 0.5, AT, 0);
        H.box(gA, 1, 89 - 75, inW, M.gold, xS, 75, 0).name = "aliyot-step-1";
        H.box(gA, 1, 128 - 118, inW, M.gold, xS, 118, 0).name = "aliyot-step-2";
        layerLabel(gA, "עליית קודש הקדשים נמוכה בעשר אמות (מצודת דוד ו, כ ע״פ רש״י)", xS - 12, AT - 10 + 4, -16, 2.2);
        gA.updateMatrixWorld(true);
        if (open.on) for (const w of open.walls) w.visible = false;
       } catch (e) {
        console.warn("[heichal] aliyot layer:", e && e.message);
       }
      };
      ctx.shared.aliyotOpen = {
        get: () => open.on,
        set: (on) => {
          open.on = !!on;
          if (!aliyotBuilt && gA.visible) buildAliyot();
          for (const w of open.walls) w.visible = !open.on;
        }
      };
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({
        id: "hei-aliyot-open",
        label: "פתח את העליות",
        labelOn: "סגור את העליות",
        title: "מסיר את הכותל הדרומי של העליות ומראה את פנים שתי העליות: רצפת הארזים (ה״שדרות״), ציפוי הזהב, ומעל כל עלייה תקרת הגבים, בית דילפא והשדרות (כאיור הספר).",
        layer: "aliyot",
        anchor: () => [18.9, 90, 0],   // 1.2.3: on the east face
        maxDist: 300,
        get: () => open.on,
        set: (on) => {
          ctx.shared.aliyotOpen.set(on);
          // 1.2.2 (the user: "לאורך ולא לרוחב הבית כמו בספר"): the house's SECTION (ctx.sectionCut: its south wall off, the ceilings kept, cut at
          // the south edge - the three layers over the heichal and over each aliyah), not the cutaway (1.2.1), which took the ceilings off
          try {
            if (ctx.ui && typeof ctx.ui.setSection === "function") {
              if (on && typeof ctx.ui.setCutaway === "function") ctx.ui.setCutaway(false);
              ctx.ui.setSection(!!on);
            }
          } catch (_) {}
          if (on) heiFly("aliyotSection");
        }
      });
      gA.userData.build = buildAliyot;                         // for a caller that needs the geometry at once (headless checks)
      let roofWas = null;
      (ctx.animated = ctx.animated || []).push(() => {
        if (!aliyotBuilt && gA.visible) buildAliyot();
        // the stone roof slab: as the cutaway left its proxy, and never while the aliyot stand on the cedars
        if (houseRoofProxy && houseRoofProxy.userData.real) {
          const want = houseRoofProxy.visible && !gA.visible;
          if (want !== roofWas) { roofWas = want; houseRoofProxy.userData.real.visible = want; }
        }
      });
    }

    // ============================================================ 10. layer "אולם לשיטת הרמב"ם" (ctx.layers.ulamRambam) ============================================================
    // Rambam Beit HaBechira 4 with Kesef Mishneh and Tosafot Yom Tov on Middot 4:7 (as quoted in the user's file): the ulam's extra width
    // continues along the whole house to the west corner. Two side blocks z +-27..+-42, x -80.5..-3.5 (joining the wings at the east
    // wall), as high as the ulam block, with a flat roof and a few windows (model choice).
    {
      const gR = new Group();
      gR.name = "ulamRambam";
      gR.visible = false;
      g.add(gR);
      ctx.layers.ulamRambam = gR;
      try {
        const wm = [];
        for (const s of [-1, 1]) {
          H.box(gR, KE - YW, TOP - F, ZW - ZT, M.stone, (KE + YW) / 2, F, s * (ZT + ZW) / 2); // opaque (fix A.1: no house wall is an occluder)
          H.box(gR, KE - 0.3 - YW, ROOF - TOP, ZW - ZT, M.stone, (KE - 0.3 + YW) / 2, TOP, s * (ZT + ZW) / 2);   // clear of the ulam roof's cornice
          for (const x of [-70, -56, -42, -28, -14]) wm.push(hei_m4(x, WIN_Y, s * (ZW + 0.05)));
        }
        hei_inst(gR, new BoxGeometry(1.5, 2, 0.12), dark, wm, false);
        layerLabel(gR, "האולם לשיטת הרמב\"ם: הבליטה נמשכת לכל אורך הבית", -40, ROOF + 5, ZW + 3, 4);
      } catch (e) {
        console.warn("[heichal] ulamRambam layer:", e && e.message);
      }
    }

    // ============================================================ 11. the yatzia section's measures (ctx.layers.yatziaDims) ============================================================
    // 1.0.1-K (K.2.3; the user: "היציעים ... כשטית רש"י והחישוב של 7, 6 ו 5 עם הקורות המשמשות לתקרה" - he wants to SEE the calculation): blue
    // measures like the book's section (p. ו, "מידות התאים וצורתם לשיטת רש"י"), shown only with the section: the house wall 7 / 6 / 5 and 4
    // (sec. 3), the chambers 5 / 6 / 7 (6:6), each story 5 high (6:10), the chamber wall 5 (Middot 4:7).
    // 1.0.1-L (FIXES L.42; the user: "חתך התאים ביציע לא מלמד מספיק על רוחב משתנה בין הקומות כדברי רש"י, צריך שינוי וחשיבה מקורית, עיין
    //   בספר כדי ללמוד משם"): rebuilt to TEACH Rashi 6:6 at a glance. The book (p04L) cuts once through the three stories and looks at the cut
    //   square-on, the measures of the wall and of the chamber side by side; here, besides (all model choices):
    //   - ONE COLOUR PER STORY for the wall's band and the chamber beside it - the lowest blue, the middle green, the top orange, the wall
    //     above the chambers' roof violet: a tint on the cut face of the band, a lighter fill with a frame in the chamber's opening (the
    //     לולים and the door stay seen through it), the measures in a darker shade of the same colour - so the eye pairs "wall 7 - chamber
    //     5", "6 - 6", "5 - 7": what the wall loses at each story the chamber gains, the chamber wall (כותל התא) standing plumb;
    //   - THE LEDGES (מגרעות, 1 amah each, at 17, 23 and 29) as yellow bars under the ends of the beams that lie on them (Rashi 6:6 "וכנס בו
    //     אמה לפנים, והניח על אותה כניסה ראשי קורות גג עלית התא, שהיא קרקעית לאמצעית"); the beam next to the cut is seen whole from the
    //     wall's step to the chamber wall;
    //   - the measures of a story on one line (y +1 over its floor), their numbers in one row above it; each story's height (6:10) beside
    //     its arrow inside the chamber; at the side a legend: the title, the ledges, Rashi's words ("נמצאת אמצעית רחבה מן התחתונה אמה",
    //     Rashi 6:6) and each story as the verse names it with its wall and chamber;
    //   - the cut and the camera: sec. 3 (X0) and flyPoints.yatziaSection (square-on, sec. 12).
    //   Unlit (toneMapped off): the tints and fills are two transparent instanced quad lists, the measures, frames and ledges one instanced
    //   list of bars and one of arrowheads (per-instance colours: 4 draw calls); the numbers and the legend are labels of the layer
    //   "yatziaDims" (each with dim: "wall" | "width" | "height" | "ta" | "legend" | "title" for the UI's explanations).
    const gD = new Group();
    gD.name = "yatziaDims";
    gD.visible = false;
    g.add(gD);
    ctx.layers.yatziaDims = gD;
    {
      const XT = X0 + 0.03, XD = X0 + 0.06, AH = 0.5, LW = 0.08, FW = 0.1;   // the tints / the measures just east of the cut face (x -30.5)
      const COL = [0x2f7dff, 0x1fb85f, 0xff8a1f, 0xa47cff];      // the stories' colours: the lowest, the middle, the top, the wall above the roof
      const INK = [0x0b45b5, 0x0b7a37, 0xc04f06, 0x6435cc];      // their measures and frames (darker shades of the same)
      const LEDGE = 0xffd21a, SLATE = 0x2f3a4c;                   // the ledges; the chamber wall's measure
      const q0 = new Quaternion();
      const tints = [], fills = [], bars = [], heads = [];        // [matrix, colour]
      const quad = (list, z0, z1, y0, y1, col) => list.push([new Matrix4().compose(new Vector3(XT, (y0 + y1) / 2, (z0 + z1) / 2), q0, new Vector3(1, y1 - y0, z1 - z0)), col]);
      const barZ = (y, za, zb, col, w) => bars.push([new Matrix4().compose(new Vector3(XD, y, (za + zb) / 2), q0, new Vector3(w || LW, w || LW, zb - za)), col]);
      const barY = (z, ya, yb, col, w) => bars.push([new Matrix4().compose(new Vector3(XD, (ya + yb) / 2, z), q0, new Vector3(w || LW, yb - ya, w || LW)), col]);
      const dimZ = (y, za, zb, col) => {                        // a horizontal measure, arrowheads at its two ends
        barZ(y, za + AH - 0.05, zb - AH + 0.05, col);
        heads.push([hei_m4(XD, y, za + AH / 2, -Math.PI / 2, 0, 0), col], [hei_m4(XD, y, zb - AH / 2, Math.PI / 2, 0, 0), col]);
      };
      const dimY = (z, ya, yb, col) => {                        // a vertical measure
        barY(z, ya + AH - 0.05, yb - AH + 0.05, col);
        heads.push([hei_m4(XD, ya + AH / 2, z, Math.PI, 0, 0), col], [hei_m4(XD, yb - AH / 2, z, 0, 0, 0), col]);
      };
      const frameQ = (z0, z1, y0, y1, col) => {                 // a frame just inside the edges of a chamber's opening
        barZ(y0 + FW / 2, z0, z1, col, FW);
        barZ(y1 - FW / 2, z0, z1, col, FW);
        barY(z0 + FW / 2, y0 + FW, y1 - FW, col, FW);
        barY(z1 - FW / 2, y0 + FW, y1 - FW, col, FW);
      };
      // the numbers 1 amah east of the cut (a label is a sprite turned to the camera: closer to the cut face it dips into the stone)
      const lab = (text, y, z, size, dim) => layerLabel(gD, text, X0 + 1, y, z, size, { dim });
      const AY = SY.map((y) => y + 1);                           // 13, 19, 25: the measures of each story, on one line
      const NY = SY.map((y) => y + 2.35);                        // 14.35, 20.35, 26.35: their numbers, in one row
      const VZ = TA_IN - 0.55;                                   // 21.45: the story's height, near the chamber wall
      const W = [0, 1, 2].map((k) => TA_IN - zOut(k));           // 5, 6, 7 (6:6)
      for (let k = 0; k < 3; k++) {
        quad(tints, 10, zOut(k), WY[k], WY[k + 1], COL[k]);      // the wall's band: 7 / 6 / 5 thick
        quad(fills, zOut(k), TA_IN, SY[k], ST[k], COL[k]);        // the chamber's opening: 5 / 6 / 7 wide, 5 high
        frameQ(zOut(k), TA_IN, SY[k], ST[k], INK[k]);
        dimZ(AY[k], 10, zOut(k), INK[k]);                         // the house wall
        dimZ(AY[k], zOut(k), TA_IN, INK[k]);                      // the chamber
        dimY(VZ, SY[k], ST[k], INK[k]);                           // the story's height
        barZ(ST[k], zOut(k + 1), zOut(k), LEDGE, 0.18);           // the ledge the beams of the story above lie on (1 amah)
        lab(String(WT[k]), NY[k], (10 + zOut(k)) / 2, 2.6, "wall");
        lab(String(W[k]), NY[k], (zOut(k) + TA_IN) / 2 - 0.4, 2.6, "width");
        lab(String(ST[k] - SY[k]), ST[k] - 1.25, VZ - 0.75, 2.1, "height");     // beside the upper end of its arrow, inside the chamber
      }
      quad(tints, 10, zOut(3), WY[3], TOP, COL[3]);              // the wall above the chambers' roof: 4
      dimZ(YRT + 1, 10, zOut(3), INK[3]);
      lab(String(WT[3]), YRT + 2.35, (10 + zOut(3)) / 2, 2.6, "wall");
      dimZ(AY[0], TA_IN, ZT, SLATE);                             // the chamber wall: 5
      lab("כותל התא " + (ZT - TA_IN), NY[0], (TA_IN + ZT) / 2 + 0.2, 1.8, "ta");
      // the legend beside the section (outside the chamber wall, over the court): the verse's three stories, then Rashi's conclusion;
      // the title on top (its text is the UI's key for the place "חתך היציע")
      // (all inside the section view's frame, y 11.2..34.8, and above the nav row at its bottom left)
      const ZL = ZT + 5.8;
      const NAME = ["התחתונה", "התיכונה", "השלישית"];             // 6:6 "היציע התחתנה ... והתיכנה ... והשלישית" (plene)
      for (let k = 0; k < 3; k++) lab(NAME[k] + ": כותל " + WT[k] + " · תא " + W[k], (SY[k] + ST[k]) / 2, ZL, 2, "legend");
      lab("חתך היציע לשיטת רש״י (מלכים א ו, ו)", YRT + 2.1, ZL - 0.6, 2.3, "title");
      lab("בצהוב — המגרעות: הכותל נכנס אמה בכל קומה", YRT + 0.55, ZL, 1.75, "legend");
      lab("רש״י: נמצאת אמצעית רחבה מן התחתונה אמה", YRT - 0.95, ZL, 1.75, "legend");
      try {
        const col = new Color();
        const inst = (geo, mat, list, name) => {
          const im = new InstancedMesh(geo, mat, list.length);
          list.forEach(([m, c], i) => {
            im.setMatrixAt(i, m);
            im.setColorAt(i, col.setHex(c));
          });
          im.instanceMatrix.needsUpdate = true;
          if (im.instanceColor) im.instanceColor.needsUpdate = true;
          im.castShadow = im.receiveShadow = false;
          im.name = name;
          gD.add(im);
          return im;
        };
        const quadG = new PlaneGeometry(1, 1).rotateY(Math.PI / 2);   // a unit quad in the cut plane, facing east (+x)
        const veil = (opacity) => new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity, depthWrite: false, toneMapped: false, side: DoubleSide });
        inst(quadG, veil(0.36), tints, "yatzia-section-tints");
        inst(quadG, veil(0.2), fills, "yatzia-section-fills");
        const inkMat = new MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
        inst(new BoxGeometry(1, 1, 1), inkMat, bars, "yatzia-dims-lines");
        inst(new ConeGeometry(0.17, AH, 10), inkMat, heads, "yatzia-dims-heads");
      } catch (e) {
        console.warn("[heichal] yatzia measures:", e && e.message);
      }
    }

    // ============================================================ 12. labels, fly points, the section, on-model anchors, shared data ============================================================
    // 1.0.1-L (L.42): the door's label stands 6 amot behind the section's cut, just outside the chamber wall - the section's view showed it
    // half hidden by the cut face ("התאים" floating beside the legend). It is in a layer group that is visible except while the section is on
    // (ysec.set); the UI and the presentation see an ordinary layer (it is never switched by them)
    const gW = new Group();
    gW.name = "yatziaWhole";
    g.add(gW);
    ctx.layers.yatziaWhole = gW;
    // the three labels over the house sit at z -18, north of the "עליות" layer's upper walls (z +-14, y 47.5..132), so they stay
    // visible when that layer is on (at z 0 they were inside its first story). 1.0.1 (fix A.5): the big exterior label is "בית ה׳"
    // (the whole house); "ההיכל (הקודש)" is the interior label of 55-interior.js
    // 1.0.1-K: יכין / בועז just above the capitals (top 33; section 7), low enough to be seen from the view yachinBoaz under the front
    // doorway's lintel; 1.0.1-L (L.60): ctx.shared.pillarCapital.set moves them to 35.5 over Malbim's capital (and back)
    const ybLabels = [{ text: "יכין", x: PX, y: YB_TOP + 0.5, z: PZ, size: 2.5 }, { text: "בועז", x: PX, y: YB_TOP + 0.5, z: -PZ, size: 2.5 }];
    ctx.labels.push(
      { text: "בית ה׳", x: -20, y: 56, z: -18, size: 7 },   // 1.0.1-L (verifier): 10 east of x -30, where the view "הבית מבחוץ" (L.41) drew it over the label "קודש הקדשים"
      { text: "האולם", x: (HE + UI) / 2, y: 52, z: -18, size: 4 },
      { text: "בית החליפות", x: (HE + UI) / 2, y: 51, z: 30, size: 3 },
      { text: "בית החליפות", x: (HE + UI) / 2, y: 51, z: -30, size: 3 },
      { text: "קודש הקדשים", x: (DE + DW) / 2, y: 52, z: -18, size: 3.5 },
      { text: "היציע (התאים)", x: -52, y: YRT + 2.5, z: ZT + 2, size: 3 },             // over the chambers' south wall (y 12..30)
      { text: "פתח התאים", x: TA_DOOR_X, y: F + DOOR_H + 2, z: ZT + 1.5, size: 2.2, layer: "yatziaWhole" },     // over the door (y 12..15.5); hidden with the section
      { text: "לולים", x: LUL_X, y: YRT + 1.5, z: LUL_Z, size: 2.2 },                     // over the roof, above the stair
      { text: "חלוני שקופים אטומים", x: -35, y: WIN_Y + 4, z: zOut(3) + 3, size: 2.5 },
      { text: "האוטם", x: 22, y: 10, z: -14, size: 2.5 },
      ...ybLabels                                                   // יכין / בועז (below; 1.0.1-L: they rise with Malbim's taller capital)
    );
    // 1.0.1-L (L.60): the close view of Yachin's capital per reading - Rashi's from inside the hall at the capital's centre (K.1); Malbim's
    // from under the ceiling (y 42), in the hall's north part, looking down south-west past the hat at the lily painted on the wall behind it
    // (the target 0.4 before the painting): the hat with its net and its label on the left, the lily beside it, the doorway's lintel below. From
    // everywhere inside the hall the real capital hides part of the 4 x 4 painting behind it, as in Malbim's own picture. Verifier: chosen by ray tests
    // over 144 eyes and pictures: it sees 22 of 28 sample points of the figure; the eye before it ([8.5, 36.5, 2]) saw 15, with the label over the
    // heichal's doorway (9 amot wide, 5 from that eye) across 18% of the frame
    const FP_CAP = {
      rashi: { pos: [19.5, 32.5, -4.5], target: [PX, 30.5, PZ] },   // 1.2.0 (the user: the eye stood inside the capital): from the ulam's doorway, 16 away
      malbim: { pos: [31, 37, 26], target: [19.5, 32, 9.5] }   // A14: from outside and from the south, so that the hat with its net stands beside the lily on the ulam's front and does not hide it
    };
    // 1.0.1-L (verifier): the view from the doorway per reading - Rashi's eye 0.5 higher than K.1's, so that the label over the heichal's doorway
    // (y 34.5) clears the header bar; Malbim's capital is 2 taller, so the eye 2 higher (still under the lintel, y 34): his hats and their labels in the frame
    const FP_YB = {
      rashi: { pos: [18.4, 30.1, 0], target: [HE, 29.5, 0] },
      malbim: { pos: [50, 33, 0], target: [18.6, 28, 0] }             // A14: from the court, the two pillars before the front
    };
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    Object.assign(ctx.shared.flyPoints, {
      // 1.0.1-L (L.72): the two tables before the house's doorway, from inside the ulam on its axis (the eye 1 before the front wall's inner
      // face x 12.5, 6.2 above the floor, looking 31 deg down at the doorway's foot between the tables; the pillars' shafts frame the view)
      ulamTables: { pos: [11.5, 18.2, 0], target: [4.7, 13.6, 0] },
      // 1.0.1-L (FIXES L.41; the user: "כפתור הבית מבחוץ לא ממש מציג את הבית"): the whole house from the south-east above (azimuth 40 deg from
      // the east toward the south, 36 deg down), as the book's general view (p. א): the ulam's front with its doorway, the south side with
      // the closed yatzia and the house rising over it, the base and the steps - centred, the house's outline filling 65% x 81% of the view
      // (68% x 85% with the steps; the old [130, 55, 45] looked low at the ulam's front, which hid the house behind it: its box filled 50% x 49%). Compared in
      // headless pictures with azimuths 30 / 36 / 50 and 32-40 deg (50: the ulam's south wing filled the view, the doorway unseen). The target
      // is the visible point at the view's centre - the top of the ulam's front, 0.1 in front of its roof's cornice - so the ray is clear
      heichalFront: { pos: [75.3, 100.2, 78], target: [18.86, 46.62, 30.65] },
      heichalSouth: { pos: [-25, 55, 95], target: [-38, 21, 27] },        // 1.0.1-K: higher, inside the court - the chambers' south wall and the house over it
      // 1.0.1-L (FIXES L.44; the user: "באולם במקום שיציג מלמעלה שיציג בצורה רגילה, אך שתהיה אפשרות לראות את פתח האולם מבלי להסיר את
      // הקירות"): the ulam FROM THE FRONT on the house's axis, 65.6 amot east of its doorway (x 84, in the court beyond the bronze altar; verifier: from x 78 the top corners of the front fell outside the frame):
      // its whole front - 84 wide with בית החליפות - upright and square, the doorway (10 x 22 since L.59, its two cedar doors folded back
      // into its reveal, so from the axis they show their edges) in the middle with the heichal's doorway seen through it, the steps below; the front stays closed ("פתח את האולם" on the model still
      // opens it fully). The eye at y 44 looks 16 deg down: the controls cannot look up (polar limit 0.495 pi), and a lower eye on the
      // axis has the altar's label ("מזבח הנחושת", x 49.5, y 25) right over the doorway (a level eye at y 26: headless picture); from y 44
      // it falls on the steps below the threshold. The altar (top 16) and its fire stay below the line to the threshold (y 27.1 at the
      // altar's centre). Candidates compared in headless pictures: level at y 26 east of the altar, off-axis from the south-east, over the
      // altar's west edge (only the doorway fits) - model choice. The target stands in the doorway (x 18.4, inside its opening z +-5)
      ulamInside: { pos: [84, 44, 0], target: [18.4, 25.5, 0] },
      // 1.0.1-K (K.1): the ulam is CLOSED by default and nothing opens by itself. A whole pillar (21 high) cannot fit the 48-degree view from
      // anywhere inside the 10-deep hall (it needs ~24 amot of distance), so yachinBoaz stands in the ulam's own front doorway (its outer plane
      // x 18.4; the opening z +-5, y 12..34 of section 6 - 1.0.1-L, L.59: 22 high, its open leaves 4.65 to each side of the eye), eye 30.1 (FP_YB), looking west, level, at both capitals, the shafts and the heichal doorway
      // between them - the book's composition (p. כט); yachinBoazCapital is a close view of Yachin's capital from inside the hall. Both: the
      // eye above the target (the controls' polar limit 0.495 pi), inside no mesh, a clear ray to the target (headless ray test, K.1 report).
      yachinBoaz: { pos: FP_YB.rashi.pos.slice(), target: FP_YB.rashi.target.slice() },   // re-aimed by ctx.shared.pillarCapital.set
      yachinBoazCapital: { pos: FP_CAP.rashi.pos.slice(), target: FP_CAP.rashi.target.slice() },   // re-aimed by ctx.shared.pillarCapital.set (L.60)
      // 1.0.1-L (FIXES L.45 / L.58; the user: "כפתור יכין ובועז אמור להראותם בשלמותם", then "תשאיר סגור אולי תרחיק מאוד את המבט כדי שיראה מרחוק
      // הגודל כולו (סה"כ הרבה מההבנה היא בגודל)"; the doorway "רוחב 10 גובה 22"): the FAR views from the court, the ulam CLOSED - nothing opens by
      // itself. The pillars stand at z +-7.17 (shafts |z| 5.17..9.17) behind a doorway 10 wide, so no eye sees both whole: on the axis only their
      // inner edges show (x 37: 0.9 of the 4-amah shaft; x 46: 0.5, and the doorway only then fits the frame; beyond x ~78: nothing). 35 deg off
      // the axis the doorway frames ONE pillar whole, base to capital, standing in its 22-amah opening against the whole front, the steps and the altar - the
      // size at a glance (verifier; pictures compared): yachinBoazFull = Yachin, from the north-east (x 74: farther east the court's big label, at x 70 z -48, stands before the
      // camera); boazFar = Boaz, from the south-east, farther back (the whole front in the view).
      // Each target stands in the doorway on the line of sight (the eye to the pillar's centre at y 23), so the orbit turns round the doorway: dragging the view
      // swings from one pillar to the other; the pill "פתח את האולם" is in the view (with the front off, both stand whole on the axis: the view ulamInside; from here the hall's side wall hides part of the far one).
      // Was [37, 23.8, 0] -> [6.08, 23.1, 0], meant for the front open
      yachinBoazFull: { pos: [74, 32, -40], target: [18.4, 24.63, -1.39] },
      boazFar: { pos: [84, 34, 47], target: [18.4, 24.74, 1.4] },
      // 1.0.1-L (FIXES L.43; the user: "כשאתה לוחץ על חתך ... המסך מסתובב להראות את זה ולא את מה שהוא מראה היום מבט מזווית שונה"): the
      // section SQUARE-ON, as the book's p04L: the camera in the opened eastern segment (0.5 west of the house's east wall, x -3.5), 26.5
      // amot from the cut (x -30.5), looking due west (0.6 higher than its target: the controls' polar limit 0.495 pi, i.e. 1.3 deg); the
      // view (48 deg) shows y 11.2..34.8 - the three stories, the roof and the wall's 4 above it - and z 2..40: the house wall's cut on the
      // right, the chambers, the chamber wall and the legend over the court on the left. With the section on only (sec. 11).
      yatziaSection: { pos: [-4, 23.6, 21], target: [X0, 23, 21] },
      // 1.0.1-K: the chambers' only outside door (6:8) seen from the terrace of the אוטם, as the book's p. ט (the band of beam ends above)
      yatziaDoor: { pos: [-29, 18, 44], target: [-36.5, 16, 27] },   // 1.2.2: lower and nearer - the door was a small hole at the frame's foot
      aliyot: { pos: [260, 150, 220], target: [-25, 70, 0] },
      aliyotSection: { pos: [170, 84, 0], target: [-25, 72, 0] },   // 1.2.3 (the user: "ממזרח ולא מאף כיוון אחר"): from the east, along the house's length, the whole 120 in the frame
      // 1.0.1-L (verifier): the target stood inside the closed chambers (x -70: the ray met the chamber wall at 135.5 of its 147.4); now 0.1 before that wall's outer face (x -80.5)
      heichalWest: { pos: [-200, 60, -60], target: [-80.6, 25, 0] }
    });
    // ---- 1.0.1-L (FIXES L.60): the reading of the capitals - ctx.shared.pillarCapital = { current, keys, names, set } (the shape of
    // ctx.shared.forestHouse): set("malbim") hides Rashi's capital meshes and shows the group "yb-malbim" (sec. 7), re-aims
    // flyPoints.yachinBoazCapital (the same object, new arrays), lifts the labels יכין / בועז to 0.5 over the taller capital (35) - the UI's
    // sprites hold a reference to the label entries (userData.label) - and notes the reading in ctx.shared.heichal.pillars.reading ----
    const pillarCapital = {
      current: "rashi",
      keys: ["rashi", "malbim"],
      names: { rashi: "רש״י", malbim: "מלבי״ם" },
      set: null
    };
    pillarCapital.set = (key) => {                              // an unknown key changes nothing and returns false
      if (!FP_CAP[key] || !ybMalbim) return false;
      const mal = key === "malbim";
      for (const m of ybRashiCap) m.visible = !mal;
      ybMalbim.visible = mal;
      pillarCapital.current = key;
      const fp = ctx.shared.flyPoints.yachinBoazCapital, src = FP_CAP[key];
      fp.pos = src.pos.slice();
      fp.target = src.target.slice();
      const fy = ctx.shared.flyPoints.yachinBoaz;
      fy.pos = FP_YB[key].pos.slice();
      fy.target = FP_YB[key].target.slice();
      const y = (mal ? YB_SH1 + 5 : YB_TOP) + 0.5, YB_OUT = E - HE, lx = PX + (mal ? YB_OUT : 0);   // A14: Malbim 7:21 "לפני האולם וסמוך לו"
      if (ybGroup) ybGroup.position.x = mal ? YB_OUT : 0;
      for (const l of ybLabels) { l.y = y; l.x = lx; }
      const sc = ctx.scene || (ctx.root && ctx.root.parent), grp = sc && sc.getObjectByName ? sc.getObjectByName("labels") : null;
      if (grp) for (const s of grp.children) if (s.userData && ybLabels.indexOf(s.userData.label) >= 0) { s.position.y = y; s.position.x = lx; }
      if (ctx.shared.heichal && ctx.shared.heichal.pillars) { ctx.shared.heichal.pillars.reading = key; ctx.shared.heichal.pillars.x = lx; }
      return true;
    };
    ctx.shared.pillarCapital = pillarCapital;
    // ---- the yatzia section (FIXES K 0.5f): ctx.shared.yatziaSection = { on, set(on) }, and its own pill on the model (0.5b) ----
    // 1.0.1-L (FIXES L.43): the pill that switches the section ON also turns the camera to it, square-on (flyPoints.yatziaSection, through
    // ctx.ui.fly - the UI's fly, which asks before entering the devir - or ctx.flyTo); the place "חתך היציע" flies there by its own view and
    // the presentation by its slide. Switching the section OFF while the camera stands in the opened segment - its view - would leave the
    // camera inside the closed chambers (by the pill, "↺ החזר הכל", the presentation or the UI's timer): set(false) then flies it out to the
    // chambers' south view (flyPoints.heichalSouth), also within 2.5 s of the pill's own fly (the camera still on its way in). No per-frame work.
    const heiFly = (key) => {
      const f = ctx.shared.flyPoints && ctx.shared.flyPoints[key];
      const fly = ctx.ui && typeof ctx.ui.fly === "function" ? ctx.ui.fly : typeof ctx.flyTo === "function" ? ctx.flyTo : null;
      if (f && fly) fly(f.pos, f.target);
    };
    let ysecFlewAt = -1e9;
    // the opened segment (x -30.5..-3.5): the chambers and the house wall up to the chambers' roof, and the house wall's upper band above it
    const inSeg = (p) => p.x > X0 - 0.5 && p.x < KE + 0.05 && p.z > 9.5 &&
      ((p.z < ZT + 0.5 && p.y > F - 0.5 && p.y < YRT + 0.5) || (p.z < zOut(3) + 0.5 && p.y > F - 0.5 && p.y < TOP + 2));
    const ysec = {
      on: false,
      x0: X0,
      set(on) {
        const was = ysec.on;
        ysec.on = !!on;
        segE.visible = !ysec.on;                                // only this module's eastern segment (55-interior's gold skin stays)
        secCaps.visible = ysec.on;                              // the cut faces
        gD.visible = ysec.on;                                   // the measures (and their labels: layer "yatziaDims")
        gW.visible = !ysec.on;                                  // the door's label (layer "yatziaWhole", above)
        if (was && !ysec.on && ctx.camera && ctx.camera.position && (inSeg(ctx.camera.position) || performance.now() - ysecFlewAt < 2500)) heiFly("heichalSouth");
      }
    };
    ctx.shared.yatziaSection = ysec;
    ctx.shared.modelButtons = ctx.shared.modelButtons || [];
    // the pill: on the south chamber wall west of the cut while the section is off; with it on, over the cut's top by the chamber wall, where
    // the section's own view sees it (1.0.1-L; the old place, behind the cut face, was hidden from that view)
    const ANCH_OFF = [X0 - 3, SY[1] + 6.5, ZT + 0.5], ANCH_ON = [X0 + 0.5, YRT + 0.8, TA_IN + 1.5];
    ctx.shared.modelButtons.push({
      id: "hei-yatzia-section",
      label: "הצג חתך של היציע (רש״י)",
      labelOn: "הסתר את החתך",
      title: "חותך את התאים שבדרום ואת כותל הבית ומסובב את המבט אל החתך: כותל הבית נכנס אמה בכל קומה — שבע, שש וחמש, וארבע מעל גג התאים — " +
        "וראשי קורות הארז מונחים על המגרעות (בצהוב), ולכן התאים חמש, שש ושבע אמות, וכל קומה חמש אמות (מלכים א ו, ו; ו, י). כל קומה בצבע משלה. כלי צפייה בלבד.",
      anchor: () => (ysec.on ? ANCH_ON : ANCH_OFF),
      maxDist: 150,
      get: () => ysec.on,
      set: (on) => {
        ysec.set(on);
        if (ysec.on) {
          ysecFlewAt = performance.now();
          heiFly("yatziaSection");
        }
      }
    });
    // ---- the anchors of the UI's removal pills (FIXES K 0.5b): points on the visible outside of each part ----
    ctx.shared.anchors = ctx.shared.anchors || {};
    Object.assign(ctx.shared.anchors, {
      houseSouth: [-30, 39, zOut(3) + 0.5],                     // the house's south face above the chambers' roof (y 30..46), between two windows
      yatziaSouth: [-52, SY[1] + 2.5, ZT + 0.5],                // the chambers' south wall at its middle story (the UI mirrors it to the north / west)
      ulamFront: [E + 0.5, F + 26.5, 0]                         // the ulam's front above its doorway (12..34) and lintel (to 35): 1.0.1-L (L.59), was F + 25
    });
    ctx.shared.heichal = {
      // 1.0.1-L (L.59): the ulam's front doorway - the clear opening 10 x 22 (y 12..34, z +-5) between the jambs (x 12.2..18.8), the lintel
      // beam over it, the two cedar leaves folded back along the reveal (open: true; a closed leaf would turn -s * 90 deg about its pivot)
      ulamDoor: { w: UD_W, h: UD_H, x: [UI, E], y: [F, F + UD_H], lintelY: [F + UD_H, F + UD_H + UD_LINTEL], jambW: UD_JAMB,
        leaf: { w: UD_LW, h: UD_LH, t: UD_T, pivotX: UD_HX, pivotZ: UD_DZ, x: [UD_HX - UD_LW, UD_HX], open: true } },
      ulamFloorY: F, ceilingY: CEIL, roofTopY: ROOF, ulamZ: ZW, pillars: { x: PX, z: PZ, topY: YB_TOP, shaftR: YB.shaftR, shaftTopY: YB_SH1, capitalY: [YB_C0, YB_TOP], bellyY: YB_BELLY, capitalR: YB.rMax, pomegranateRows: YB.rows,
        // 1.0.1-L (L.60): the numbers above are Rashi's (the default); the reading shown and Malbim's numbers
        reading: "rashi", readings: { rashi: { topY: YB_TOP, capitalY: [YB_C0, YB_TOP], capitalR: YB.rMax }, malbim: { topY: YB_SH1 + 5, capitalY: [YB_SH1, YB_SH1 + 5], capitalR: 2.655, x: PX + E - HE, painting: { x: E + 0.1, y: [YB_SH1, YB_SH1 + 4], z: [6.25, 10.25] } } } },
      // 1.0.1-L (L.72): the two tables in the ulam (sec. 6b): x 3.7..5.7, the entry table at z -3.8 (north), the gold at +3.8, 2 x 1 x 1.5
      ulamTables: { x: [HE + 1.2, HE + 3.2], z: 3.8, size: [2, 1, 1.5] },
      // the yatzia after Rashi as the book draws it (1.0.1-K, K.2): floors 12 / 18 / 24 (clear 5 each), cedar beams 1 thick on the ledges at
      // 17, 23 and 29 (the roof beams 29..30), the chamber walls 5 thick to 29 (outer faces z +-27, x -80.5); house wall 7 / 6 / 5 / 4 (outer
      // faces z +-17 / 16 / 15 / 14); clear widths 5 / 6 / 7 (I Kings 6:6, 6:10 with Rashi); the outside door at x -36.5 (6:8), the לולים
      // column at x -34, z 19.5; the section's cut at x -30.5 (1.0.1-L: were -33.5 and -23.5)
      yatzia: {
        floorY: SY.slice(), topY: ST.slice(), beam: BT, ledgeY: ST.slice(), roofY: YROOF, roofTopY: YRT, taTopY: YROOF, taZ: [TA_IN, ZT], taX: [YW, XW_IN],
        wallT: WT.slice(), clearW: CO.YATZIA_W.slice(), doorX: TA_DOOR_X, door: [DOOR_W, DOOR_H], lulim: { x: LUL_X, z: LUL_Z, topY: SY[2] }, sectionX: X0,
        windowsY: [WIN_Y - WIN_OH / 2, WIN_Y + WIN_OH / 2]
      }
    };
    for (const m of cut) ctx.cutaway.push(m);
    ctx.sectionCut = sec;   // 1.2.2
  }
