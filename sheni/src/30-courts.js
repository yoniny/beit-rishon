  // plugin/js/courts.js
  //@@include hand
  //@@include strap
  //@@include face
  //@@include people-kit
  async function build2(ctx2) {
    const { H: H2, M: M2 } = ctx2;
    const HP = Math.PI / 2;
    const g = new Group();
    g.name = "courts";
    // 1.2.0: the roofs of the chambers, of בית המוקד and of the gates have their own list and pill (the heichal's cutaway stays the heichal's)
    ctx2.lishkotCut = [];
    {
      const MB = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
      let on = false;
      MB.push({
        id: "crt-lishkot-roofs", label: "פתח את הלשכות", labelOn: "סגור את הלשכות", removal: true, maxDist: 500,
        title: "מסיר את גגות הלשכות, בית המוקד והשערים שסביב העזרה כדי לראות את פנים הלשכות. כלי צפייה בלבד.",
        anchor: () => (ctx2.camera && ctx2.camera.position.z < 0 ? [-18, 36.5, -67.5] : [2, 28.5, 67.5]),   // the dome of בית המוקד (north) or the roof of לשכת הפרוה (south)
        get: () => on,
        set: (v) => { on = !!v; for (const m of ctx2.lishkotCut) m.visible = !on; },
        under: () => !!(ctx2.shared.camUnder && ctx2.shared.camUnder(ctx2.lishkotCut))   // 1.9.2: not closed over the eye (the user's recording)
      });
    }
    ctx2.root.add(g);
    const lbl = (text, x, y, z, size = 3) => ctx2.labels.push({ text, x, y, z, size });
    const water = M2.marble.clone();
    water.color = new Color(4156814);
    water.roughness = 0.25;
    const clay = M2.plaster.clone();
    clay.color = new Color(11569512);
    const goldDoor = M2.gold.clone();
    const ember = new MeshStandardMaterial({ color: 2363398, emissive: 16734744, emissiveIntensity: 1.6, roughness: 0.9 });
    // RAILS_211 (the user, 14.11.2026: "כל המדרגות שהיו מהר הבית לעזרה להוסיף מעקה ולכתוב בחירת מודל"): a bronze rail on both sides of
    // every straight flight from the mount up to the courts - built in the flight's own frame (H2.stairs: rising along +x, its width
    // along z): posts on the steps, and a sloped handrail over them. The rails are not in the sources - a model choice (so the label)
    const railMat = M2.bronze;
    // The posts never move independently: retain every post but submit one instance batch per flight/landing.
    // One immutable geometry is shared; the original posts neither cast nor receive shadows.
    const railPostGeo = new BoxGeometry(0.1, 1.35, 0.1);
    const addRailPosts = (parent, positions) => {
      if (!positions.length) return;
      const batch = new InstancedMesh(railPostGeo, railMat, positions.length), mm = new Matrix4();
      positions.forEach((p, i) => batch.setMatrixAt(i, mm.makeTranslation(p[0], p[1], p[2])));
      batch.computeBoundingSphere();
      parent.add(batch);
    };
    const stairRail = (gS, o) => {
      const tread = o.tread || 0.75, n = o.steps, rise = o.totalRise / n, L = n * tread, HH = 1.35;
      const hAt = (x) => Math.min(n, Math.floor(x / tread) + 1) * rise;
      const posts = [];
      for (const zs of [-1, 1]) {
        const zz = zs * (o.width / 2 - 0.12);
        const np = Math.max(2, Math.round(L / 3) + 1);
        for (let i = 0; i < np; i++) {
          const x = 0.12 + (L - 0.24) * i / (np - 1), b = hAt(x);
          posts.push([x, b + HH / 2, zz]);
        }
        const x0 = 0.12, x1 = L - 0.12, y0 = hAt(x0) + HH, y1 = hAt(x1) + HH;
        const len = Math.hypot(x1 - x0, y1 - y0);
        const rail = new Mesh(new BoxGeometry(len, 0.11, 0.13), railMat);
        rail.position.set((x0 + x1) / 2, (y0 + y1) / 2, zz);
        rail.rotation.z = Math.atan2(y1 - y0, x1 - x0);
        gS.add(rail);
      }
      addRailPosts(gS, posts);
      return gS;
    };
    const stairsR = (parent, o) => stairRail(H2.stairs(parent, o), o);
    // 1.3.0 (the user): the podium of the women's court ends under its east wall (x 231). The twelve steps (Middot 2:3 "לפנים ממנו
    // החיל, עשר אמות. ושתים עשרה מעלות היו שם") are INSIDE the chel, which is at the mount's level: the Bartenura ("כדי לעלות משם לעזרת
    // נשים"), the Rambam's commentary ("היה אדם עולה מקרקע החיל י"ב מעלות"), the Rosh ("בחיל"), the Meiri, Tiferet Yisrael (four amot
    // level, six of steps). 1.9.1 (the user: "להסיר את המתג הלא נכון"): the other drawn reading of 1.3.0-1.9.0 - the steps outside the
    // soreg and the chel at the court's level - had no source and is gone; ctx2.shared.stepsPlace stays (always "inside") for the chel's zone.
    // 1.9.1 (the user: "לשכת המצורעין אני רוצה לראות בור מים 40 סאה"): the podium and the pave have a hole for the pit in the lepers'
    // chamber (PIT, below); boxHole = a box with a rectangular shaft through it (four boxes around the shaft)
    const PIT = { x: 113.5, z: -47.5, w: 1.6 };
    const boxHole = (parent, w, h, d, mat, cx, y, cz, hx, hz, hw, hd) => {
      const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2, a0 = hx - hw / 2, a1 = hx + hw / 2, b0 = hz - hd / 2, b1 = hz + hd / 2;
      const piece = (px0, px1, pz0, pz1) => { if (px1 - px0 > 1e-3 && pz1 - pz0 > 1e-3) H2.box(parent, px1 - px0, h, pz1 - pz0, mat, (px0 + px1) / 2, y, (pz0 + pz1) / 2); };
      piece(x0, a0, z0, z1); piece(a1, x1, z0, z1); piece(a0, a1, z0, b0); piece(a0, a1, b1, z1);
    };
    boxHole(g, 137.5, LV.EZN - 0.15, 140, M2.stone, (CO.eznW + CO.eznE + 2.5) / 2, 0, 0, PIT.x, PIT.z, PIT.w, PIT.w);   // CHEL_211: to the walls' outer faces (z ±70; 155 until 2.0.1)
    // 1.9.1: a box with several rectangular shafts through it ({x, z, w, d} each): strips along x between the holes' edges, each cut in z
    const boxHoles = (parent, w, h, d, mat, cx, y, cz, holes) => {
      const made = [];   // 1.9.5: the pieces, for the reading of the floor's marble (ctx2.herodFloor)
      const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;
      const X = Array.from(new Set([x0, x1].concat(...holes.map((H) => [H.x - H.w / 2, H.x + H.w / 2]).map((p) => p.map((v) => Math.max(x0, Math.min(x1, v))))))).sort((a, b) => a - b);
      for (let i = 0; i + 1 < X.length; i++) {
        const a = X[i], b = X[i + 1];
        if (b - a < 1e-3) continue;
        const mid = (a + b) / 2;
        const zs = holes.filter((H) => Math.abs(mid - H.x) < H.w / 2).map((H) => [H.z - H.d / 2, H.z + H.d / 2]).sort((p, q) => p[0] - q[0]);
        let zc = z0;
        for (const [h0, h1] of zs) { if (h0 - zc > 1e-3) made.push(H2.box(parent, b - a, h, h0 - zc, mat, mid, y, (zc + h0) / 2)); zc = Math.max(zc, h1); }
        if (z1 - zc > 1e-3) made.push(H2.box(parent, b - a, h, z1 - zc, mat, mid, y, (zc + z1) / 2));
      }
      return made;
    };
    // MESIBAH_303: the pieces of a box cut round a hole (boxHoles) - their texture as the whole box's (BoxGeometry's faces in amot, as
    // uvWorldBox; the box's extent x0..x1, y0..y1, z0..z1; the group unmoved)
    const uvLike = (m, x0, x1, y0, y1, z0, z1) => {
      const p = m.geometry.attributes.position, n = m.geometry.attributes.normal, uv = m.geometry.attributes.uv, o = m.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i) + o.x, y = p.getY(i) + o.y, z = p.getZ(i) + o.z, nx = n.getX(i), ny = n.getY(i), nz = n.getZ(i);
        if (nx > 0.5) uv.setXY(i, z1 - z, y - y0); else if (nx < -0.5) uv.setXY(i, z - z0, y - y0);
        else if (ny > 0.5) uv.setXY(i, x - x0, z1 - z); else if (ny < -0.5) uv.setXY(i, x - x0, z - z0);
        else if (nz > 0.5) uv.setXY(i, x - x0, y - y0); else uv.setXY(i, x1 - x, y - y0);
      }
      uv.needsUpdate = true;
    };
    // CHAMBERS_EAST_N2 (fix-n2, 23.11.2026 - the user's decision, on the Rambam, Beit HaBechirah 5:17, book 337 line 92: "שמונה לשכות היו בעזרת
    // ישראל. שלש בצפון. ושלש בדרום"): the three chambers of the south - the salt, the Parvah, the Madichin - and the two of the Nikanor
    // gate stand in the court of Israel (x 82.5..91, in the east, by its wall) and not opposite the altar (x 39.5..71.5), as until now (the
    // Parvah x 47..61 and the Madichin x 27..41, on the south wall). Tiferet Yisrael, Tzurat Beit HaMikdash (6029 line 71): "וג' לשכות היו
    // לעומתן במקצוע דרום של עזרת ישראל. וגם הן היה קצת מרווחן בעזרת כהנים" - so each of the three reaches a little into the priests' court
    // (to x 77 - five and a half amot; the salt chamber, three, as before). They stand in one column from the south wall northward: the
    // salt (z 55..65), the Parvah (45..55), an alley six amot wide with the mesibah's stair (39.4..45), the Madichin (29.4..39.4). The
    // Madichin's pit, MPIT, moves with it (x 84.5, 2.4 south of the room's middle, as it was). The places, the sizes and the order in the
    // column - model choices.
    const MPIT = { x: 84.5, z: 36.8, w: 3.2, d: 2.2 };
    const PARH = { x: 79.75, z: 50, w: 5.5, d: 10 };   // the priests' pave open under the part of the Parvah in the priests' court (as SALTH, below)
    const MADH = { x: 79.75, z: 34.4, w: 5.5, d: 10 };   // ... and of the Madichin
    // 1.9.1 (the mukhni): the laver's well - through the court's podium and pave (40-altar.js lines it and hangs the laver over it)
    const KPIT = ctx2.shared.KPIT = { x: 22, z: 61.4, w: 6.4, d: 6.4 };   // KIYOR_A2 (fix-a2; decision 59): the laver's well 4.4 south (z 57 until then) - its base stands north of it (40-altar.js)
    // KLI_DEEP_211 (the user, 15.11.2026 18:21: "1. להעמיק"): the instruments' chambers run WEST from their opening in the women's court,
    // through the line of the court's east wall and under the floor of the court of Israel (x 82.5..93.5) - "ולשכות היו תחת עזרת ישראל,
    // ופתוחות לעזרת הנשים" (Middot 2:6; 89:17); R. Shemaya (645:78): "מחילות תחתיה". The podium and the fill under the wall are cut for
    // them (KDEEP: x 82.5..102.5, nine wide at z ±24); the rooms, their ceilings and their fittings - below, at the gate's two chambers.
    const KDEEP = { x0: 82.5, x1: 102.5, d: 9, z: 24 };
    // SALT_144_D: the shaft of the salt chamber's tunnel (x 70.5..82.5, z 56.5..64.5) - filled in the default reading (SALT_144_D below)
    const SALT_T = { x: 76.5, z: 60.5, w: 12, d: 8 };
    boxHoles(g, 189.5, LV.AZ - 0.15, 140, M2.stone, (CO.azW - 2.5 + CO.azE) / 2, 0, 0, [KPIT, SALT_T, MPIT].concat([-1, 1].map((sz) => ({ x: (KDEEP.x0 + CO.azE) / 2, z: sz * KDEEP.z, w: CO.azE - KDEEP.x0, d: KDEEP.d }))));   // the court's podium; CHEL_211: to the walls' outer faces (x -96, z ±70)
    ctx2.shared.stepsPlace = { mode: "inside", set() {} };
    stairsR(g, { width: 14, totalRise: 6, steps: 12, dir: "W", x: 237, y: 0, z: 0, tread: 0.5 });   // inside the chel (x 231..237); RAILS_211
    ctx2.labels.push({ text: "מעקות במדרגות — בחירת מודל", x: 236, y: 4.2, z: -8.6, size: 1.1 });
    H2.box(g, 189.5, 0.15, 2.5, M2.pave, -1.25, 13.35, -68.75);   // CHEL_211: under the walls only
    H2.box(g, 189.5, 0.15, 2.5, M2.pave, -1.25, 13.35, 68.75);
    H2.box(g, 2.5, 0.15, 135, M2.pave, -94.75, 13.35, 0);
    H2.box(g, 135, 0.15, 2.5, M2.paveFine, 161, 5.85, -68.75);
    H2.box(g, 135, 0.15, 2.5, M2.paveFine, 161, 5.85, 68.75);
    boxHole(g, 135, 0.15, 135, M2.paveFine, 161, 5.85, 0, PIT.x, PIT.z, PIT.w, PIT.w);
    // 1.9.5 (the user, 11.11.2026: "להסיר את שיטת הקירות, ולהעביר לרצפה"): the pieces of THE AZARAH'S FLOOR - the court of Israel's strip
    // and the priests' court's slab - are kept in ctx2.herodFloor: the reading "שיש בשלושה גוונים ברצפת העזרה" of the row "בניין הורדוס"
    // gives them its marble (50-heichal.js, ctx2.shared.herod). Their top faces are mapped by their place in the court (u = x, v = z),
    // so that the marble's bands run on from piece to piece.
    const herodFloor = boxHoles(g, 11, 0.15, 135, M2.paveFine, 88, 13.35, 0, [MPIT]);   // CHAMBERS_EAST_N2: open for the Madichin's pit
    // 1.9.1 (the user: "לשכת המדיחין — בור מים להדחה"): the pave has a hole for the rinsing pit in the Madichin (MPIT; the room's floor too)
    // 1.9.3 (the user, of the kuntres, point 18: "לשכת הדוכן (חזו״א) כשיטה"): the priests' court's podium has a recess opposite the altar
    // (CIH: x 76.5..82.5, z -7..25 - the altar's 32 in its default place), closed by a plug in the default reading - see THE DUCHAN'S
    // CHAMBER below
    const CIH = { x: 79.5, z: 9, w: 6, d: 32 };
    // GAZIT_FLOOR_B2 (fix-b2, 22.11.2026 - the user's decision 75): the Gazit hall's floor is the court of Israel's (13.5) - so the priests'
    // court's slab is open under the hall's part in the court (x 69..82.5, z -67.5..-56; the hall itself - below)
    const GZH = { x: 80.25, z: -61.75, w: 4.5, d: 11.5 };   // NORTH_CHAMBERS_N2: the hall now stands x 76..91 (67..91 until now) - its floor, 13.5, shows through the priests' slab only from x 78 to 82.5
    // SALT_144_D: so too under the salt chamber's part in the priests' court (x 79.5..82.5, z 55..65; closed in the tunnel's reading)
    const SALTH = { x: 81, z: 60, w: 3, d: 10 };
    herodFloor.push(...boxHoles(g, 176, 2.65, 135, M2.pave, -5.5, 13.35, 0, [KPIT, CIH, GZH, SALTH, PARH, MADH]));
    const ciPlug = H2.box(g, CIH.w, 2.65, CIH.d, M2.pave, CIH.x, 13.35, CIH.z);
    herodFloor.push(ciPlug);
    for (const m of herodFloor) {
      const uv = m.geometry.attributes.uv, ps = m.geometry.attributes.position, nr = m.geometry.attributes.normal;
      for (let i = 0; i < uv.count; i++) if (nr.getY(i) > 0.5) uv.setXY(i, ps.getX(i) + m.position.x, ps.getZ(i) + m.position.z);
      uv.needsUpdate = true;
    }
    ctx2.herodFloor = herodFloor;
    // 1.3.0 (the user): the women's court has ONE gate, in the east (Middot 2:5-6, Rambam 5:7-8: no north or south gate is named; the Mishnah
    // counts the gates of the court, 1:4, and of the mount, 1:3); the north and south gates with their 12 steps are Josephus' description
    // (Wars 5.5.2) - drawn, but off by default, in the group ctx2.layers.eznGatesJosephus (the opinions table switches it)
    const eznJ = new Group(), eznC = new Group();
    g.add(eznJ);
    g.add(eznC);
    eznJ.visible = false;
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.eznGatesJosephus = eznJ;
    ctx2.shared.eznGates = { josephus: false, set(on) { this.josephus = !!on; eznJ.visible = !!on; eznC.visible = !on; if (ctx2.layers.soregChazal) ctx2.layers.soregChazal.visible = !on; } };
    stairsR(eznJ, { width: 14, totalRise: 6, steps: 12, dir: "S", x: 161, y: 0, z: -76, tread: 0.5 });   // CHEL_211: inside the chel, up to the wall's face
    stairsR(eznJ, { width: 14, totalRise: 6, steps: 12, dir: "N", x: 161, y: 0, z: 76, tread: 0.5 });
    // CHEL_211 (the user, 14.11.2026, of the soreg that stood 2.5 amot before the courts' podium: "נראלי שהסורג הוצמד מדי לחיל" - and of
    // the readings offered: "תעשה כברטנורא" - Bartenura Middot 2:3: "לפנים מן הסורג היה מקום פנוי עשר אמות, והוא נקרא חיל"): the courts'
    // podiums end at the walls' outer faces (z ±70, x -96 / 231; until 2.0.1 they ran 7.5 amot into the chel), and THE WHOLE CHEL is
    // open, at the mount's level - ten amot between the soreg and the walls. The gates of the court stand 13.5 amot over it: before
    // each a landing against the wall and a flight of 27 steps down ALONG the wall, inside the chel ("כל המעלות שהיו שם, רום מעלה חצי
    // אמה ושלחה חצי אמה", 2:3) - four amot wide, six left clear beside it; in the south they go down eastwards, in the north westwards
    // (Beit HaMoked stands east of them). The steps of the side gates are not described in the Mishnah: their place, width and
    // direction are model choices (said in the chel's card). Until 2.0.1: 12 steps outside the soreg, a landing, 15 steps to the podium.
    // RAIL_CORNER_S1 (scan 1, finding 8): a corner post is built once - two sides of one landing that meet share it, and a reading's rail
    // (g7 / g13r, below) that ends on a post of the court's own rails (g - always shown) uses that post. Until now each side built its own,
    // one inside the other (six such pairs, at the landings' corners).
    const railPostsG = new Set();
    const platRail = (parent, x0, x1, z0, z1, y, sides) => {   // a bronze rail on the named edges ("n" = z0, "s" = z1, "w" = x0, "e" = x1) of a landing
      const HH = 1.35;
      const posts = new Set(), positions = [];
      const run = (ax, a0, a1, fixed) => {
        const len = a1 - a0, n = Math.max(1, Math.round(len / 3));
        for (let i = 0; i <= n; i++) {
          const t = a0 + 0.12 + (len - 0.24) * i / n, px = ax === "x" ? t : fixed, pz = ax === "x" ? fixed : t, k = px.toFixed(2) + "," + y.toFixed(2) + "," + pz.toFixed(2);
          if (posts.has(k) || (parent !== g && railPostsG.has(k))) continue;
          posts.add(k);
          if (parent === g) railPostsG.add(k);
          positions.push([px, y + HH / 2, pz]);
        }
        const r = new Mesh(new BoxGeometry(ax === "x" ? len : 0.13, 0.11, ax === "x" ? 0.13 : len), railMat);
        r.position.set(ax === "x" ? (a0 + a1) / 2 : fixed, y + HH, ax === "x" ? fixed : (a0 + a1) / 2);
        parent.add(r);
      };
      for (const sd of sides) {
        if (sd === "n") run("x", x0, x1, z0 + 0.12); else if (sd === "s") run("x", x0, x1, z1 - 0.12);
        else if (sd === "w") run("z", z0, z1, x0 + 0.12); else if (sd === "e") run("z", z0, z1, x1 - 0.12);
      }
      addRailPosts(parent, positions);
    };
    // a landing before a gate (centre gx, on the side s of the court) and its flight along the wall: dx = 1 down eastwards, -1 westwards
    const chelFlight = (parent, gx, s, dx, o = {}) => {
      const wL = o.landW || 12, dp = o.depth || 4, top = o.top || 13.5, zf = o.zFace || 70, n = Math.round(top / 0.5);
      const za = zf * s, zb = (zf + dp) * s, z0 = Math.min(za, zb), z1 = Math.max(za, zb), zc = (z0 + z1) / 2;
      H2.box(parent, wL, top, dp, M2.stoneSmooth, gx, 0, zc);
      platRail(parent, gx - wL / 2, gx + wL / 2, z0, z1, top, [s < 0 ? "n" : "s"].concat(o.endRail === false ? [] : [dx > 0 ? "w" : "e"]));
      stairsR(parent, { width: dp, totalRise: top, steps: n, dir: dx > 0 ? "W" : "E", x: gx + dx * (wL / 2 + n * 0.5), y: 0, z: zc, tread: 0.5 });
    };
    for (const gx of [-78, -48, -18]) for (const s of [-1, 1]) {   // 1.3.0: the approaches follow the gates (Rambam 5:4, the western part)
      if (gx === -18 && s < 0) continue;   // 1.8.0: Beit HaMoked's own gate to the chel - by the house, below
      const joined = (gx === -78 && s > 0) || (gx === -48 && s < 0);   // a small gate's landing joins this one's free end in the readings of thirteen gates
      chelFlight(g, gx, s, s > 0 ? 1 : -1, { endRail: !joined });
      // GATE_STEPS_A2 (fix-a2; the user's decision 79, 22.11.2026): the last two and a half amot inside the gate - a step of one amah and
      // three of half an amah, as the Rambam, Beit HaBechirah 6:3 (337:96): "ועולה ממנו לעזרת הכהנים במעלה גבוהה אמה ועליה דוכן יש בו
      // שלש מעלות. רום כל מעלה חצי אמה". Until now five steps of half an amah. The amah step's tread (an amah) - a model choice.
      H2.stairs(g, { width: 10, totalRise: 1, steps: 1, dir: s < 0 ? "S" : "N", x: gx, y: 13.5, z: 70 * s, tread: 1 });   // (no rail on one step)
      stairsR(g, { width: 10, totalRise: 1.5, steps: 3, dir: s < 0 ? "S" : "N", x: gx, y: 14.5, z: 69 * s, tread: 0.5 });
    }
    // 1.4.0 (the user, the reviewer's note 2): the step of one amah and the duchan's three steps run the WHOLE width of the court (135),
    // as Tiferet Yisrael draws them (the Mishnah, 2:6, gives them no length); until 1.3.0 they were 60 wide
    const duchanDef = new Group();   // 1.9.3: the default reading's step and duchan, in a group of their own (hidden in the Chazon Ish's)
    g.add(duchanDef);
    // DUCHAN_GAP_A2 (fix-a2, 22.11.2026; found walking in walk mode - the eye went down into a ditch and into the priests' court): since
    // 1.1.0 (the treads cut to half an amah, their east end left at x 87) the duchan's top step ended at x 85.5, three amot short of
    // the priests' court (its face x 82.5), and between them lay a ditch two and a half amot deep. The Rambam, Beit HaBechirah 6:3, 6:6
    // (337, lines 96, 99): "ועולה ממנו לעזרת הכהנים במעלה גבוהה אמה ועליה דוכן יש בו שלש מעלות. רום כל מעלה חצי אמה ושלחה חצי אמה";
    // "ועל הדוכן העולה מעזרת ישראל לעזרת הכהנים". So the step and the duchan stand against the priests' court: the step x 84..85, the
    // three steps x 82.5..84 (the court of Israel's floor x 85..93.5).
    // DUCHAN_GAZIT_A2 (agent B2's request, the user's decision 75 - the floor of לשכת הגזית down to 13.5): in the north the step and the
    // duchan end at the south face of the chamber (z -54) - they do not stand out inside it; in the south - to the court's wall (67.5)
    // SALT_144_D (fix-d, 22.11.2026 - the user's decision 144 א): in the south they end at the north face of לשכת המלח (z 55; until now
    // to the court's wall, 67.5); in the reading of the tunnel (SALT_144_D below) a piece of them runs on to z 59.3, before its opening
    // CHAMBERS_EAST_N2 (fix-n2): the chambers now stand in the court of Israel (x 82..91.5) and the step and the duchan stop at their faces:
    // the Pinchas chamber (z -28.5..-19.5), the chavitin makers' (19.5..28.5) and the Madichin (29.4..39.4) - the step runs in two pieces,
    // z -54..-28.5 and -19.5..19.5 (between the two chambers of the gate - the way to the gate), and south of the Madichin not at all
    // (the alley of the mesibah, the Parvah's door opens onto it)
    const DUCH = { z0: -54, z1: 55 };
    DUCH.segs = [[-54, -28.5], [-19.5, 19.5]];
    DUCH.w = DUCH.z1 - DUCH.z0; DUCH.z = (DUCH.z0 + DUCH.z1) / 2;
    ctx2.shared.duchanSpan = DUCH;
    for (const [dz0, dz1] of DUCH.segs) {
      H2.stairs(duchanDef, { width: dz1 - dz0, totalRise: 1, steps: 1, dir: "W", x: 85, y: 13.5, z: (dz0 + dz1) / 2, tread: 1 });
      H2.stairs(duchanDef, { width: dz1 - dz0, totalRise: 1.5, steps: 3, dir: "W", x: 84, y: 14.5, z: (dz0 + dz1) / 2, tread: 0.5 });   // 1.1.0: tread 0.5 (Rambam Beit HaBechirah 6:3)
    }
    {
      const st = new Group();   // SALT_144_D: z 55..59.3 - shown by ctx2.shared.saltChamber in the tunnel's reading
      st.name = "duchanSaltStub";
      st.visible = false;
      duchanDef.add(st);
      H2.stairs(st, { width: 4.3, totalRise: 1, steps: 1, dir: "W", x: 85, y: 13.5, z: 57.15, tread: 1 });
      H2.stairs(st, { width: 4.3, totalRise: 1.5, steps: 3, dir: "W", x: 84, y: 14.5, z: 57.15, tread: 0.5 });
      ctx2.shared.duchanSaltStub = st;
    }
    // 1.9.3 (the user, of the kuntres, point 18: "לשכת הדוכן (חזו״א) כשיטה"): THE DUCHAN'S CHAMBER - the Chazon Ish on Middot 2:6 (OC Moed;
    // book 5849, lines 6087-6088): "נראה דהמעלה היתה כעין לשכה כנוסה בזקיפת ההר של עזרת כהנים, שהרי עזרת כהנים גבוהה מעזרת ישראל ב' אמות
    // ומחצה על פני כל המזרח מדרום לצפון, וכנגד המזבח נכנסה לשכה, ארכה כנגד אורך המזבח ורחבה לא אתפרש... ובה בנוי כעין בימה לעלות הלוים
    // לדוכן... וכן היו מעלות בנויות בה לעלות לעזרת כהנים, והלשכה הלזו היתה רצפה שלה גבוה אמה מעזרת ישראל... והיו בלשכה ג' מעלות של חצי
    // חצי אמה לעלות ממנה לעזרת כהנים, ומעלות אלו לא נתפרשו באיזה רוח היו"; "והכניסה ללשכת הדוכן היתה ממזרח מעזרת ישראל... ומסתבר דהיתה
    // מעלה חצי אמה לעלות ללשכת הדוכן". So, in this reading (ctx2.shared.duchanReading.set("chazonIsh")): the step and the duchan of the
    // default are gone and the court of Israel is level up to the podium's face (x 82.5, two and a half amot high the whole width);
    // opposite the altar the recess CIH is open - its floor an amah over the court of Israel (14.5), a step of half an amah before it,
    // a bima for the Levites against its west face (16 long, 2 deep, an amah and a half high) with three steps before it, and at its two
    // ends three steps of half an amah up to the priests' court. The chamber's width (6), the bima and the places of the steps - model
    // choices. It stands opposite the altar's DEFAULT place (it does not follow the readings of the altar's place).
    const duchanCI = new Group();
    duchanCI.name = "duchanChazonIsh";
    duchanCI.visible = false;
    g.add(duchanCI);
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.duchanChazonIsh = duchanCI;
    {
      const x0 = CIH.x - CIH.w / 2, x1 = CIH.x + CIH.w / 2, z0 = CIH.z - CIH.d / 2, z1 = CIH.z + CIH.d / 2;   // 76.5, 82.5, -7, 25
      H2.box(duchanCI, CIH.w, 1.15, CIH.d, M2.paveFine, CIH.x, 13.35, CIH.z);                  // the chamber's floor, top 14.5
      H2.box(duchanCI, 0.5, 0.5, 19.5 - z0, M2.stoneSmooth, x1 + 0.25, 13.5, (z0 + 19.5) / 2);   // the step of half an amah before it, in the court of Israel (CHAMBERS_EAST_N2: to z 19.5 - from there the chavitin makers' chamber stands against the recess's face)
      H2.box(duchanCI, 2, 1.5, 16, M2.stoneSmooth, x0 + 1, 14.5, CIH.z);                      // the bima, against the west face
      H2.stairs(duchanCI, { width: 16, totalRise: 1.5, steps: 3, dir: "W", x: x0 + 3.5, y: 14.5, z: CIH.z, tread: 0.5 });
      for (const zc of [z0 + 2, z1 - 2]) H2.stairs(duchanCI, { width: 4, totalRise: 1.5, steps: 3, dir: "W", x: x0 + 1.5, y: 14.5, z: zc, tread: 0.5 });   // up to the priests' court
      for (const sg of [-1, 1]) H2.box(duchanCI, 3.02, 2.5, 1, M2.stoneSmooth, 84.01, 13.5, 64.5 * sg).name = "barShura";   // bar shura runs on to the podium's face
      ctx2.labels.push(
        { text: "לשכת הדוכן — כנוסה בעזרת הכהנים, רצפתה אמה מעל עזרת ישראל (חזון איש)", x: CIH.x, y: 19.6, z: CIH.z, size: 1.6, layer: "duchanChazonIsh" },
        { text: "הדוכן — בימה ללויים", x: x0 + 1, y: 17.6, z: CIH.z, size: 1.1, layer: "duchanChazonIsh" },
        { text: "שלוש מעלות לעזרת הכהנים", x: x0 + 0.8, y: 17.6, z: z0 + 2, size: 1, layer: "duchanChazonIsh" },
        { text: "מעלה של חצי אמה — הכניסה ממזרח", x: x1 + 0.6, y: 15.4, z: z1 - 6, size: 1, layer: "duchanChazonIsh" });
    }
    // PISPASIN_COURTS_N2 (fix-n2, 23.11.2026 - the user's decision, on Middot 2:6, book 89 line 17): the row "הדוכן ומעלות עזרת הכהנים" has
    // a third reading, the first Tanna's: "וראשי פספסין מבדילין בין עזרת ישראל לעזרת הכהנים" and no more - no step of an amah and no
    // duchan (those are R. Eliezer ben Yaakov's: "מעלה היתה שם, וגבוהה אמה, והדוכן נתון עליה, ובה שלש מעלות של חצי חצי אמה. נמצאת עזרת
    // הכהנים גבוהה מעזרת ישראל שתי אמות ומחצה"). The pispasin themselves (beam-ends or a low lattice - the row "ראשי פספסין") stand in every
    // reading. In this one the step and the duchan are gone; the priests' court's height over the court of Israel is as in the others
    // (the whole inner court is built on it) - the Mishnah does not give it for the first Tanna: the user's decision, 23.11.2026: they are
    // level (see the slab below).
    const duchanTanna = new Group();
    duchanTanna.name = "duchanTanna";
    duchanTanna.visible = false;
    g.add(duchanTanna);
    // NORTH_CHAMBERS_N2 (the user's decision, 23.11.2026): in the first Tanna's reading the priests' court is as high as the court of
    // Israel - no height between them. The model builds the whole inner court on 16, so here the court of Israel's FREE floor is raised
    // to 16 (a slab over it, 13.5..16, from the priests' podium's edge to the east wall); the chambers and the Gazit hall in it keep
    // their own floors (their footprints are left open - the figures in them stand where they stood).
    {
      const LVL = new Group();
      LVL.name = "israelLevel";
      duchanTanna.add(LVL);
      for (const [z0, z1] of [[-54, -28.9], [-19.1, 19.1], [39.8, 44.6]]) H2.box(LVL, 8.5, 2.5, z1 - z0, M2.pave, 86.75, 13.5, (z0 + z1) / 2);
    }
    // ISRAEL_LIFT_N2 (fix-n2, 23.11.2026): in this reading everything that stands on the court of Israel's floor rises with it (2.5): the
    // chambers (the Pinchas, the chavitin makers', the Madichin, the Parvah, the salt), the Gazit hall and what stands on the free floor
    // (the shofar chests, the low partitions between the chambers). Found by their places when the reading is set (the court's group
    // `g`, its direct children); the figures of the demonstrations read ctx2.shared.israelLift() for their floor (55-tamid.js, 55-payis.js).
    // Not lifted: the Golah and the Etz (the priests' court's floor, 16), the foundations (they end at 13.5).
    let liftNow = 0;
    const liftBoxes = [[81.8, 91.9, -29.2, -18.8], [81.8, 91.9, 18.8, 29.2], [76.2, 91.9, 28.8, 40.2], [76.2, 91.9, 44.2, 55.8], [78.6, 91.9, 54.2, 66], [75.8, 91.9, -80.8, -53.2]];
    const liftBox = new Box3(), liftTmp = new Box3();
    const liftIsrael = (to) => {
      if (to === liftNow) return;
      const dy = to - liftNow; liftNow = to;
      for (const o of g.children) {
        if (o.userData.israelLifted === undefined) {
          o.userData.israelLifted = false;
          try {
            liftBox.setFromObject(o);
            if (o.isMesh || o.isGroup || o.isInstancedMesh) {
              const b = liftBox;
              const inRoom = liftBoxes.some(([x0, x1, z0, z1]) => b.min.x >= x0 && b.max.x <= x1 && b.min.z >= z0 && b.max.z <= z1);
              const onStrip = b.min.x >= 82.4 && b.max.x <= 91.9 && b.min.y >= 13.3 && b.min.y <= 13.8;
              o.userData.israelLifted = (inRoom || onStrip) && b.max.y > 13.7 && b.min.y > 13.2 && !o.userData.noLift;
            }
          } catch (_) {}
        }
        if (o.userData.israelLifted) o.position.y += dy;
      }
      if (ctx2.requestRender) ctx2.requestRender();
    };
    ctx2.shared.israelLift = () => liftNow;
    ctx2.layers.duchanDefault = duchanDef;
    ctx2.layers.duchanTanna = duchanTanna;
    ctx2.labels.push(
      { text: "דוכן הלויים", x: 83.5, y: 19.5, z: 0, size: 2.5, layer: "duchanDefault" },
      { text: "ראשי פספסין מבדילין בלבד — אין מעלה ואין דוכן (תנא קמא)", x: 83.5, y: 19.5, z: 0, size: 1.6, layer: "duchanTanna" });
    ctx2.shared.duchanReading = {
      mode: "mishnah",
      set(m) {
        this.mode = m === "chazonIsh" ? "chazonIsh" : m === "tanna" ? "tanna" : "mishnah";
        const ci = this.mode === "chazonIsh", tn = this.mode === "tanna";
        duchanCI.visible = ci; duchanDef.visible = !ci && !tn; duchanTanna.visible = tn; ciPlug.visible = !ci;
        liftIsrael(tn ? 2.5 : 0);
        if ((ci || tn) && ctx2.layers.zoneDuchan) ctx2.layers.zoneDuchan.visible = false;
        if (ctx2.requestRender) ctx2.requestRender();
        return this.mode;
      }
    };
    // 1.4.0 (the user, the reviewer's notes 7-8): the court's parts by their holiness (Kelim 1:8-9; Middot 5:1) - labels and places
    lbl("החיל — עשר אמות", 161, 3.6, -75, 2.2);
    lbl("עזרת ישראל — י״א אמה", 88, 16.5, 25, 2.2);
    lbl("עזרת כהנים — י״א אמה", 77, 19, 25, 2.2);
    lbl("בין האולם ולמזבח — כ״ב אמה", 28.5, 19.5, -30, 2.2);
    // (the label "דוכן הלויים", over the steps (x 82.5..85), is in the layer of the default reading - above, PISPASIN_COURTS_N2)
    {
      const guards = new Group();
      guards.visible = false;
      g.add(guards);
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.guards = guards;
      // GUARDS_FAR_195 (the presentations' scan, 11.11.2026: from the place's own camera, high over the mount, no post could be made
      // out - figures of two cubits, wood on stone): over every post a disc - gold for the priests', red-brown for the Levites' -
      // that grows with the camera's distance (as the First Temple's gatekeepers do), so that the whole mount's view shows where they stand
      const FAR = [], mFarK = new MeshBasicMaterial({ color: 0xe2a400 }), mFarL = new MeshBasicMaterial({ color: 0xa8452a }), gFar = new CylinderGeometry(1.5, 1.5, 0.3, 20);
      const guardSpots = [[], []];
      const post = (x, y, z, kohen) => {
        guardSpots[kohen ? 0 : 1].push([x, y, z]);
        const d = new Mesh(gFar, kohen ? mFarK : mFarL);
        d.position.set(x, y + 5.4, z);
        guards.add(d);
        FAR.push(d);
      };
      if (ctx2.animated) ctx2.animated.push(() => {
        if (!guards.visible) return;
        const cp = ctx2.camera.position;
        for (const d of FAR) { const k = Math.min(5, Math.max(1, cp.distanceTo(d.position) / 110)); d.scale.set(k, 1, k); }
      });
      // the priests' three (Middot 1:1): בית אבטינס (over the Water Gate, Yoma 19a), בית הניצוץ (the upper room over the gate), בית המוקד
      post(-18, 40.5, 67.5, true); post(-78, 40.5, -67.5, true); post(-18, 45.3, -67.5, true);
      // the Levites' twenty-one: on the five gates of the mount (1:3), four inner corners of the mount, five gates of the court (Rambam 8:5:
      // the five that are not the priests'), four outer corners of the court, and one in each of לשכת הקרבן, לשכת הפרוכת, אחורי בית הכפורת
      for (const [x, z] of [[CO.harE, 0], [CO.harW, 0], [-4, CO.harN], [-30, CO.harS], [60, CO.harS]]) post(x, 20.5, z, false);
      for (const [x, z] of [[CO.harE - 4, CO.harN + 4], [CO.harE - 4, CO.harS - 4], [CO.harW + 4, CO.harN + 4], [CO.harW + 4, CO.harS - 4]]) post(x, 0, z, false);
      for (const [x, z] of [[-48, -67.5], [-78, 67.5], [-48, 67.5], [-18, 67.5], [93.5, 0]]) post(x, 40.5, z, false);
      for (const [x, z, y] of [[CO.azE + 3, CO.azN - 6, 0], [CO.azE + 3, CO.azS + 6, 0], [CO.azW - 6, CO.azN - 6, 0], [CO.azW - 6, CO.azS + 6, 0]]) post(x, y, z, false);   // CHEL_211: on the chel's floor (they stood on the podium's ledge)
      post(-48, 13.5, -62, false); post(-30, 13.5, -45, false); post(-92, 13.5, 0, false);   // לשכת הקרבן, לשכת הפרוכת (places: model choices), אחורי בית הכפורת
      // Only the marker bodies/heads are static: batch those by material, keeping each distance-scaled disc in FAR above.
      for (const [rTop, rBottom, height, bottom] of [[0.9, 1.1, 3.6, 0], [0.5, 0.5, 0.9, 3.6]]) {
        const geo = H2.uvWorld(new CylinderGeometry(rTop, rBottom, height, 10), 2 * Math.PI * Math.max(rTop, rBottom), height);
        [M2.gold, M2.cedar].forEach((material, kind) => {
          const im = new InstancedMesh(geo, material, guardSpots[kind].length), mm = new Matrix4();
          guardSpots[kind].forEach(([x, y, z], i) => im.setMatrixAt(i, mm.makeTranslation(x, y + bottom + height / 2, z)));
          im.castShadow = im.receiveShadow = true;
          im.computeBoundingSphere();
          guards.add(im);
        });
      }
      ctx2.shared.features = ctx2.shared.features || {};
      ctx2.shared.features.guards = { key: "guards", isOn: () => guards.visible, on: () => { guards.visible = true; }, off: () => { guards.visible = false; } };
      ctx2.labels.push({ text: "שלושה משמרות כהנים (זהב) ועשרים ואחד לויים (עץ)", x: 93.5, y: 46, z: 0, size: 1.8, layer: "guards" });
    }
    // ===== MEMUNIM_211 (the user, 15.11.2026: "הממונים שבמקדש לא מציג כלום"; 01:53: "הממונים עדדין לא מציג כלום"): THE FIFTEEN
    // OFFICERS of Shekalim 5:1 (book 54, line 31), each a man at his place, a disc over him (it grows with the eye's distance, as
    // the guards') and two plates - his number and office (read from the whole court's view) and, from near, his name. All in
    // ctx2.layers.memunim, shown by the place's feature (ctx2.shared.features.memunim, not timed).
    // WHO THEY ARE - by the source, as the user ruled for the showbread's makers (03:15: "אנו תמיד נצמדים למקורות"; 03:16:
    // "לווים לא היו בבגדי כהונה"):
    //  PRIESTS (gold; the hat and the sash): the house of Avtinas - "ומן בני הכהנים רקחי המרקחת לבשמים" (I Chr 9:30; book 38,
    //   line 402); Matitya ben Shmuel over the lots - as the appointed one of the lots demo (not said in so many words);
    //  LEVITES (red-brown; a plain robe): Ben Gever over the locking of the gates - the doors are the gatekeepers', "שהלך לסייע
    //   בהגפת דלתות ... שאתה מן המשוררים ולא מן המשוערים" (Arakhin 11b; book 134, line 368); Ben Arza over the cymbal and Hugras
    //   ben Levi over the song - on the duchan, "והקיש בן ארזא בצלצל, ודברו הלוים בשיר" (Tamid 7:3; book 88, line 40); the house
    //   of Garmu (I Chr 9:32) - the baker of LECHEM_211 is their man, no second figure;
    //  THE REST (blue-grey; a plain robe of a third colour): their tribe is not said (Petachya "זה מרדכי" - the Mishnah's words).
    // THE PLACES: where a chamber is named for the office the man stands in it or by it - the seals in Beit HaMoked (Tamid 3:3
    // "לשכת החותמות"), the libations by the chamber of oil ("שם היו נותנין יין ושמן", Middot 2:5), the lots in the hall of hewn
    // stone, the bird-offerings by the thirteen chests, the cisterns by the Golah chamber's ("שם היה בור קבוע", Middot 5:4), the
    // song and the cymbal on the duchan, the incense in Avtinas' upper room, the curtains at the model's "לשכת הפרוכת" (Middot
    // 1:1), the garments in Pinchas' chamber (Middot 1:4). The physician, the herald, the gates' officer and Ben Bevai - no place
    // is written: MODEL CHOICES, as are every man's exact spot, face and dress (the card says so).
    {
      const MG = new Group();
      MG.name = "memunim";
      MG.visible = false;
      g.add(MG);
      ctx2.layers.memunim = MG;
      const HPI = Math.PI / 2;
      // [number plate, name plate, kind (k priest / l Levite / i Israelite / p not said), x, z, the floor there, yaw, the beard's tone (-1: no figure), the plate's shift [dx, dy, dz]]
      // TRIBES4_211 (the review, S1-02; the user, 15.11.2026 18:12: "לא נתפרש 4"): Matityah b. Shmuel (3), Ben Gever (8), Beit Garmu (12) and Beit
      // Avtinas (13) were coloured by JOINING sources, none of which says their tribe (and Middot 1:9 "ונעל הכהן מבפנים" stands against the
      // Levite of the gates) - they go back to "not said" (blue plate, plain dress); the sources stay in the card as a hint only.
      const OFF = [
        ["1 · יוחנן בן פנחס — החותמות", "יוחנן בן פנחס — על החותמות", "p", -11.0, -68.4, 16, 0, 1, [0, 0, -10]],
        ["2 · אחיה — הנסכים", "אחיה — על הנסכים", "p", 120, 47.5, 6, HPI, 2, [0, 0, 0]],
        ["3 · מתתיה בן שמואל — הפייסות", "מתתיה בן שמואל — על הפיסות", "p", 84, -60.2, 16, Math.PI, 0, [0, 0, 0]],   // the hall's east half, by its door ("פייס במזרחה", Yoma 25a)
        ["4 · פתחיה — הקינין", "פתחיה (הוא מרדכי) — על הקינין", "i", 84.2, -7.2, 13.5, Math.PI, 0, [-14, 0, -10]],
        ["5 · בן אחיה — חולי מעיים", "בן אחיה — על חולי מעיים", "k", -13, -53.6, 16, 0, 1, [6, 0, 10]],
        ["6 · נחוניא — השיחין", "נחוניא — חופר שיחין", "p", 65.0, -52.4, 16, Math.PI, 2, [-6, 0, 6]],   // before the Golah chamber's door
        ["7 · גביני — הכרוז", "גביני — כרוז", "k", -15.5, -78.9, 13.5, 0, 2, [0, 0, -9]],   // GEVINI_211: before Beit HaMoked's gate to the chel, his face to it ("לפני שער בית המוקד הסגור", the Yachin on Tamid 3:8); the Rosh's gate - below
        ["8 · בן גבר — נעילת שערים", "בן גבר — על נעילת שערים", "p", 90.4, 3.6, 13.5, 0, 1, [12, 0, 12]],   // in Nikanor's gate, his face to its southern leaf
        ["9 · בן בבי — הפקיע", "בן בבי — על הפקיע", "k", 150, -22, 6, HPI, 1, [0, 0, 0]],
        ["10 · בן ארזה — הצלצל", "בן ארזה — על הצלצל", "l", 86.0, 1.6, 16, -HPI, 1, [-14, 0, 12]],
        ["11 · הגרס בן לוי — השיר", "הגרס בן לוי — על השיר", "l", 86.0, -1.6, 16, -HPI, 0, [-16, 0, 0]],
        ["12 · בית גרמו — לחם הפנים", "בית גרמו — על מעשה לחם הפנים", "p", -8.15, -60.65, 16, 0, -1, [10, 0, 0]],
        ["13 · בית אבטינס — הקטורת", "בית אבטינס — על מעשה הקטורת", "p", -18, 67.5, 40.9, 0, 1, [0, 0, 0]],
        ["14 · אלעזר — הפרוכות", "אלעזר — על הפרוכות", "p", -27.5, -45, 16, HPI, 0, [-10, 0, 6]],
        ["15 · פנחס — המלבוש", "פנחס — על המלבוש", "k", 100.4, -24, 13.5, -HPI, 1, [14, 0, -6]]   // OFFICER15_211 (the refuter, R-13): on HIS chamber's floor (13.5) - the chamber was raised over the instruments' chamber and he had stayed below, among the lyres
      ];
      const RIM = { k: "#e2a400", l: "#c0552f", i: "#3f9a55", p: "#6f93c4" }, ROBES = { k: 0xf1ede2, l: 0x8f8468, i: 0x6b5a3e, p: 0x56606e };
      const mDisc = { k: new MeshBasicMaterial({ color: 0xe2a400 }), l: new MeshBasicMaterial({ color: 0xa8452a }), i: new MeshBasicMaterial({ color: 0x3f9a55 }), p: new MeshBasicMaterial({ color: 0x5f84b8 }) };
      const gDisc = new CylinderGeometry(1.1, 1.1, 0.25, 20), DISCS = [], RODS = [], ROD_OF = [], LBL = [];
      for (const [num, name, kind, x, z, fl, , , sh] of OFF) {
        // NOTE 8 (U-55): the plate seen from above carries the name too ("1 · יוחנן בן פנחס — החותמות"), a little smaller for its length
        const a = { text: num, x: x + sh[0], y: fl + 9.5 + sh[1], z: z + sh[2], size: 2.1, box: true, rim: RIM[kind], onTop: true, far: 1500, layer: "memunim" };
        const b = { text: name, x, y: fl + 4.9, z, size: 1.15, far: 130, layer: "memunim" };
        ctx2.labels.push(a, b);
        LBL.push([a, b]);
      }
      ctx2.labels.push({ text: "חמישה עשר הממונים — זהב: כהנים · אדום: לויים · ירוק: ישראל · כחול: לא נתפרש שבטם", x: 62, y: 24, z: -106, size: 2.3, box: true, onTop: true, far: 1500, layer: "memunim" });   // north of the court: at the top of the place's picture, clear of the plates
      let built = false, makeMan = null;
      const build = () => {
        built = true;
        const PP = tm_people(ctx2), fy = ctx2.shared.floorY;
        makeMan = (i) => {
          const [, , kind, x, z, fl, yaw, tone] = OFF[i];
          let y = typeof fy === "function" ? fy(x, fl + 2.2, z) : NaN;
          if (!(isFinite(y) && Math.abs(y - fl) < 1.2)) y = fl;
          if (tone >= 0) PP.crowd(MG, [[x, z, yaw]], { y, s: 1.5, pose: "stand", kind: kind === "k" ? "kohen" : kind === "l" ? "levi" : "worker", robe: ROBES[kind], tone: () => tone, name: "memuneh" + (i + 1) });
          return y;
        };
        OFF.forEach(([, , kind, x, z, fl], i) => {
          const y = makeMan(i);
          const d = new Mesh(gDisc, mDisc[kind]);
          d.position.set(x, y + 6.6, z);
          d.userData.noPick = true;
          MG.add(d);
          DISCS.push(d);
          // a plate that stands aside (where the men are close together) is tied to its man's disc by a thin rod of the same colour
          const sh = OFF[i][8];
          if (sh[0] || sh[2]) {
            const a = new Vector3(x, y + 6.6, z), b = new Vector3(x + sh[0], fl + 9.5 + sh[1], z + sh[2]), v = b.clone().sub(a), L = v.length();
            const rod = new Mesh(new CylinderGeometry(0.1, 0.1, L, 6), mDisc[kind]);
            rod.position.copy(a).addScaledVector(v, 0.5);
            rod.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), v.normalize());
            rod.userData.noPick = true;
            MG.add(rod);
            RODS.push(rod);
            ROD_OF[i] = rod;
          }
        });
        // GEVINI_211: the herald follows the reading of Beit HaMoked's gates (set before the officers were first shown, too)
        const mgts = ctx2.shared.mokedGates;
        if (mgts) {
          if (mgts.mode === "adjacent") gevPlace("adjacent");
          if (!mgts.__gevini) {
            const o = mgts.set;
            mgts.set = function (m) { const r = o.call(this, m); gevPlace(r); return r; };
            mgts.__gevini = true;
          }
        }
      };
      // GEVINI_211 (2.0.2; the user, 15.11.2026 09:55: "גביני כהן"): the Bartenura on Tamid 3:8 - "כהן ששמו גביני, שהיה מכריז בכל
      // בקר בבית המקדש"; the Yachin there - "מכריז בכל בוקר בהר הבית לפני שער בית המוקד הסגור". So he stands before the house's gate to
      // the chel, on its landing, his face to the gate (until 2.0.1 - a model choice - in the court of Israel, east of the duchan). In
      // the Rosh's second explanation (ctx2.shared.mokedGates "adjacent") that gate is in the east wall, and he stands on ITS landing,
      // his face to it (west). His spot on each landing - a model choice.
      const GEV_I = 6, GEV = { opposite: [-15.5, -78.9, 13.5, 0, [0, 0, -9]], adjacent: [1.4, -73.3, 13.5, -HPI, [9, 0, -5]] };
      let gevAt = "opposite";
      function gevPlace(mode) {
        const m = mode === "adjacent" ? "adjacent" : "opposite";
        if (m === gevAt) return;
        gevAt = m;
        const [x, z, fl, yaw, sh] = GEV[m], row = OFF[GEV_I];
        row[3] = x; row[4] = z; row[5] = fl; row[6] = yaw; row[8] = sh;
        const [a, b] = LBL[GEV_I], olds = [[a.x, a.y, a.z], [b.x, b.y, b.z]];
        a.x = x + sh[0]; a.y = fl + 9.5 + sh[1]; a.z = z + sh[2];
        b.x = x; b.y = fl + 4.9; b.z = z;
        let lg = null;
        try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        if (lg) [a, b].forEach((l, k) => {
          const [ox, oy, oz] = olds[k];
          for (const spr of lg.children) {
            const mine = (spr.userData && spr.userData.label === l) || (Math.abs(spr.position.x - ox) < 1e-3 && Math.abs(spr.position.y - oy) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3);
            if (mine) { spr.position.set(l.x, l.y, l.z); break; }
          }
        });
        if (!built) return;
        for (const c of MG.children.filter((c) => c.name === "memuneh" + (GEV_I + 1))) MG.remove(c);
        const y = makeMan(GEV_I);
        DISCS[GEV_I].position.set(x, y + 6.6, z);
        const old = ROD_OF[GEV_I];
        if (old) { MG.remove(old); const j = RODS.indexOf(old); if (j >= 0) RODS.splice(j, 1); ROD_OF[GEV_I] = null; }
        if (sh[0] || sh[2]) {
          const p = new Vector3(x, y + 6.6, z), q = new Vector3(x + sh[0], fl + 9.5 + sh[1], z + sh[2]), v = q.clone().sub(p), L = v.length();
          const rod = new Mesh(new CylinderGeometry(0.1, 0.1, L, 6), mDisc[row[2]]);
          rod.position.copy(p).addScaledVector(v, 0.5);
          rod.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), v.normalize());
          rod.userData.noPick = true;
          MG.add(rod);
          RODS.push(rod);
          ROD_OF[GEV_I] = rod;
        }
      }
      if (ctx2.animated) ctx2.animated.push(() => {
        if (!MG.visible) return;
        const cp = ctx2.camera.position;
        for (const d of DISCS) { const k = Math.min(4.5, Math.max(1, cp.distanceTo(d.position) / 90)); d.scale.set(k, 1, k); }
        for (const r of RODS) { const k = Math.min(5, Math.max(1, cp.distanceTo(r.position) / 60)); r.scale.set(k, 1, k); }
      });
      ctx2.shared.features = ctx2.shared.features || {};
      ctx2.shared.features.memunim = { key: "memunim", timed: false, isOn: () => MG.visible, on: () => { if (!built) build(); MG.visible = true; }, off: () => { MG.visible = false; } };
    }
    // 1.3.0 (the user): the north and south walls of the women's court rise to the height of the court's walls (top y 40).
    // 1.9.1 (the user: "החזר את גובה עזרת נשים"): the EAST wall is high like them. Until 1.9.0 it was low, in four readings of Middot 2:4
    // ("חוץ מכותל המזרחי"), but every commentator found in the library (Rashi Yoma 16a, the Rambam 6:5 and his commentary, the Bartenura,
    // the Meiri, Tiferet Yisrael, the Chok Natan, the Piskei Tosafot) speaks of the Mount's eastern wall over the Shushan gate - the
    // readings are drawn there now (20-mount.js, ctx2.shared.eastWall); no source was found for a low wall of the women's court.
    // 1.9.1 (the user: "ר' שמעיה צייר"): Rabbenu Shemaya (Middot 2:4) - the low wall is "הכותל המזרחי של החיל שהיה נמוך כעשר אמות";
    // the chel is a wall to him, "עשר אמות רחבה מן הסורג לחיל" (2:3) - in this model's layout that is the line of the women's court's
    // east wall, so his reading draws THAT wall ten amot high, the gate standing as a gatehouse 23 high (model choice). Switched by the
    // eastern wall's row (ctx2.shared.eastWall in 20-mount.js calls ctx2.shared.eznEastWall).
    const eznEHigh = new Group(), eznELow = new Group();
    g.add(eznEHigh); g.add(eznELow);
    eznELow.visible = false;
    H2.wall(eznEHigh, { axis: "z", length: 135, height: 34, thickness: 5, mat: M2.stone, cx: 228.5, cz: 0, y: 6, openings: [{ center: 0, width: 10, height: 20 }] });   // 1.1.0: rectangular + stone lintel (Middot 2:3 "שקופות")
    H2.occ(H2.box(eznEHigh, 5.4, 0.9, 137, M2.stoneLight, 228.5, 40, 0));
    H2.crenellate(eznEHigh, { x1: 228.5, z1: -64, x2: 228.5, z2: 64, y: 40.9, mat: M2.stoneLight });
    for (const [z0, z1, h, gate] of [[-67.5, -10, 10, false], [10, 67.5, 10, false], [-10, 10, 23, true]]) {
      const len = z1 - z0, cz = (z0 + z1) / 2;
      H2.wall(eznELow, { axis: "z", length: len, height: h, thickness: 5, mat: M2.stone, cx: 228.5, cz, y: 6, openings: gate ? [{ center: cz, width: 10, height: 20 }] : [] });
      H2.occ(H2.box(eznELow, 5.4, 0.9, len + 1, M2.stoneLight, 228.5, 6 + h, cz));
      H2.crenellate(eznELow, { x1: 228.5, z1: z0 + 1, x2: 228.5, z2: z1 - 1, y: 6.9 + h, mat: M2.stoneLight });
    }
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.ewShemayaEzn = eznELow;
    ctx2.labels.push({ text: "כותל החיל המזרחי כעשר אמות — רבינו שמעיה", x: 234, y: 20, z: 34, size: 2.2, layer: "ewShemayaEzn" });
    ctx2.shared.eznEastWall = (low) => { eznEHigh.visible = !low; eznELow.visible = !!low; };
    // 1.9.5 (a remark sent on to the user, 11.11.2026: "מעל שער שושן היתה עלי' עם אמות מידה"; the user: "את עלייה עם אמות המידה ב'
    // שיטות"; his file of sources of 16:31, and "ב" - the room over the women's court's gate): SHUSHAN HABIRAH AND THE TWO MEASURING
    // RODS - Kelim 17:9 (book 91, line 150): "ושתי אמות היה בשושן הבירה, אחת על קרן מזרחית צפונית ואחת על קרן מזרחית דרומית. שעל קרן
    // מזרחית צפונית היתה יתרה על של משה חצי אצבע. שעל קרן מזרחית דרומית היתה יתרה עליה חצי אצבע, נמצאת יתרה על של משה אצבע".
    // TWO READINGS (ctx2.shared.shushanRods.set; the row "שושן הבירה ושתי האמות"):
    //  "rambam" (the default) - the Rambam's commentary there (558, line 293): "שבשער מזרחית משערי הר הבית היתה צורת שושן הבירה ולזה
    //   יקראו שער שושן הבירה... ומזה השער יאמרו ושתי אמות היו בשושן הבירה" (and on Middot 1:3 - 573, line 6; the Bartenura there - 643,
    //   line 17): the two rods at the Shushan gate, on the east faces of its two jambs; no room;
    //  "rashi" - Rashi Menachot 98a (2186, line 4648) "חדר אחד היה בנוי על שער המזרחי של עזרה ומצוייר כתבנית שושן הבירה", Rashi Pesachim
    //   86a (2162, line 4141) "בית הבנוי על גובה השער", the Bartenura on Kelim 17:9 (627, line 1141), Tosafot Pesachim 86a (1905, line
    //   910) "אחת משערי העזרה היה": a room on the wall's top over the eastern gate of the women's court (the Rashash, Pesachim 86a -
    //   2492, line 718: "ובציורי הרמב"ם בסוף מדות בטבלא א' אות ה' מצוייר בשער עזרת נשים"; the user's choice), the rods inside it, on its
    //   east wall, by its north-east and south-east corners.
    // A rod: Moses' amah of six handbreadths = twenty-four fingers; the north-eastern one half a finger more, the south-eastern a finger
    // more. The rods' look, their plates, their height on the jambs, the room's place on the wall's top, its size and door - model
    // choices. Shushan's picture is not drawn.
    {
      const A1 = 1, FNG = A1 / 24;
      // UPRIGHT_D (fix-d, 22.11.2026 - the user's decision 136 א, and the coordinator's review): the rods are free-standing UPRIGHT
      // RODS of gold, each on a small stone stand, one in the north-eastern corner and one in the south-eastern, in both readings -
      // Rabbenu Gershom (Menachot 98a, in the Kovetz Shitot Kamai, book 7577 line 32573): "ב' מדות של אמות. ב' קנים. היו בשושן הבירה...
      // אחת. היתה זקופה באותה לשכה על קרן מזרחית צפונית ואחת על קרן וכו'"; Rabbenu Chananel (Pesachim 86a, 7577 line 32575): "מדת ב'
      // אמות של כסף או של זהב כגון שרביט"; the Riban (7577 line 32480): "אחת בקרן מזרחית צפונית ואחת בקרן מזרחית דרומית". (Until now
      // they lay along the wall on marble plates.) Gold rather than silver, the stands and their height - model choices.
      const rodMat = M2.gold || M2.gateGold || M2.bronze;
      const rod = (grp, x, z, len, standH) => {   // a stand 0.6 x 0.6 x standH on the floor (y 0 of grp), the rod upright on it, a knob at each end
        H2.box(grp, 0.6, standH, 0.6, M2.stoneSmooth, x, 0, z);
        const r = new Mesh(new CylinderGeometry(0.035, 0.035, len, 10), rodMat);
        r.position.set(x, standH + len / 2, z);
        r.castShadow = true;
        grp.add(r);
        for (const yy of [standH, standH + len]) {
          const k = new Mesh(new SphereGeometry(0.06, 10, 8), rodMat);
          k.position.set(x, yy, z);
          grp.add(k);
        }
      };
      // the Rambam's: on the Shushan gate's jambs (20-mount.js gateTrim: they stand at z +-5.9, their east faces 3.3 east of the wall's line)
      const gR = new Group();
      gR.name = "shushanRodsGate";
      g.add(gR);
      const XJ = CO.harE + 3.3;
      // UPRIGHT_D: at the gateway's two eastern corners - the jambs (20-mount.js gateTrim) run z +-5..+-6.8, their east faces at XJ; the
      // stands on the parah's way before the gate (10 wide, its top at the sill), against the jambs' faces by the opening's edges
      const RC = 5 - 0.6, RS = 1.2;
      rod(gR, XJ + 0.4, -RC, A1 + FNG / 2, RS);   // the north-eastern corner
      rod(gR, XJ + 0.4, RC, A1 + FNG, RS);        // the south-eastern
      // Rashi's: the room on the wall's top over the women's court's east gate (the wall's cap ends at y 40.9; its merlons, 1.5 high,
      // are inside the room's floor slab)
      const gT = new Group();
      gT.name = "shushanRoom";
      gT.visible = false;
      gT.position.y = 40.9;
      g.add(gT);
      const RX = 228.5, RW = 9, RL = 16, RH = 7, WT = 0.8, FL = 1.6;   // 9 (east-west) x 16 (north-south) outside, 7 high inside
      H2.box(gT, RW, FL, RL, M2.stoneLight, RX, 0, 0);                                                                    // the floor
      H2.box(gT, WT, RH, RL, M2.stone, RX + RW / 2 - WT / 2, FL, 0);                                                      // the east wall
      for (const sg of [-1, 1]) H2.box(gT, RW - 2 * WT, RH, WT, M2.stone, RX, FL, sg * (RL / 2 - WT / 2));                // north, south
      for (const sg of [-1, 1]) H2.box(gT, WT, RH, RL / 2 - 1.5, M2.stone, RX - RW / 2 + WT / 2, FL, sg * (1.5 + (RL / 2 - 1.5) / 2));   // the west wall, a door 3 wide in its middle
      H2.box(gT, WT, RH - 4.5, 3, M2.stone, RX - RW / 2 + WT / 2, FL + 4.5, 0);
      const roof = H2.box(gT, RW + 0.6, 0.6, RL + 0.6, M2.stoneLight, RX, FL + RH, 0);
      ctx2.lishkotCut.push(roof);
      const xin = RX + RW / 2 - WT, zc = RL / 2 - WT - 0.4;   // the east wall's inner face; UPRIGHT_D: the rods stand in the room's corners
      {
        const fl = new Group();
        fl.position.y = FL;
        gT.add(fl);
        rod(fl, xin - 0.4, -zc, A1 + FNG / 2, 1.2);
        rod(fl, xin - 0.4, zc, A1 + FNG, 1.2);
      }
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.shushanRodsGate = gR; ctx2.layers.shushanRoom = gT;
      const n0 = ctx2.labels.length;
      ctx2.labels.push(
        { text: "שתי האמות שבשושן הבירה (כלים יז, ט)", x: XJ + 1, y: 8.2, z: 0, size: 1.1, layer: "shushanRodsGate" },
        { text: "אמה יתרה חצי אצבע — קרן מזרחית צפונית", x: XJ + 0.4, y: 3.0, z: -RC, size: 0.6, layer: "shushanRodsGate" },
        { text: "אמה יתרה אצבע — קרן מזרחית דרומית", x: XJ + 0.4, y: 3.0, z: RC, size: 0.6, layer: "shushanRodsGate" }
      );
      const n1 = ctx2.labels.length;
      ctx2.labels.push(
        { text: "שושן הבירה — חדר על גבי השער (רש״י)", x: RX, y: 40.9 + FL + RH + 2.6, z: 0, size: 1.8, layer: "shushanRoom" },
        { text: "אמה יתרה חצי אצבע — קרן מזרחית צפונית", x: xin - 0.4, y: 40.9 + FL + 3.0, z: -zc, size: 0.6, layer: "shushanRoom" },
        { text: "אמה יתרה אצבע — קרן מזרחית דרומית", x: xin - 0.4, y: 40.9 + FL + 3.0, z: zc, size: 0.6, layer: "shushanRoom" }
      );
      const roomLbl = ctx2.labels.slice(n1);
      ctx2.shared.shushanRods = {
        mode: "rambam", low: false, base: 40.9,
        set(m) {
          this.mode = m === "rashi" ? "rashi" : "rambam";
          gR.visible = this.mode === "rambam";
          gT.visible = this.mode === "rashi";
          return this.mode;
        },
        place(low) {   // Rabbenu Shemaya's low wall: the gate stands as a gatehouse 23 high, and the room on it
          const y = low ? 29.9 : 40.9, d = y - gT.position.y;
          this.low = !!low; this.base = y;
          if (!d) return;
          gT.position.y = y;
          for (const l of roomLbl) moveLbl(l, 0, d, 0);
        }
      };
      const ew0 = ctx2.shared.eznEastWall;
      ctx2.shared.eznEastWall = (low) => { ew0(low); ctx2.shared.shushanRods.place(!!low); };
    }
    // 1.9.3 (the Rosh's chambers, below): the long walls in groups of their own - eznJW / eznCW the whole walls (Josephus' with a gate,
    // Chazal's closed), eznRJ / eznRC the Rosh's: the middle stretch only (x 131..191), the chambers' forty amot open at both ends
    const eznJW = new Group(), eznCW = new Group(), eznRJ = new Group(), eznRC = new Group(), eznTopDef = new Group();
    eznJ.add(eznJW); eznJ.add(eznRJ); eznC.add(eznCW); eznC.add(eznRC); g.add(eznTopDef);
    eznRJ.visible = eznRC.visible = false;
    for (const s of [-1, 1]) {
      H2.wall(eznJW, {   // Josephus: with a gate in the middle of each long wall
        axis: "x",
        length: 139.5,
        height: 34,
        thickness: 5,
        mat: M2.stone,
        cx: 160.75,
        cz: 67.5 * s,
        y: 6,
        openings: [{ center: 0.25, width: 10, height: 20 }]   // 1.1.0: rectangular + stone lintel (Middot 2:3)
      });
      H2.wall(eznCW, { axis: "x", length: 139.5, height: 34, thickness: 5, mat: M2.stone, cx: 160.75, cz: 67.5 * s, y: 6, openings: [] });   // Chazal: closed
      H2.wall(eznRJ, { axis: "x", length: 60, height: 34, thickness: 5, mat: M2.stone, cx: 161, cz: 67.5 * s, y: 6, openings: [{ center: 0, width: 10, height: 20 }] });
      H2.wall(eznRC, { axis: "x", length: 60, height: 34, thickness: 5, mat: M2.stone, cx: 161, cz: 67.5 * s, y: 6, openings: [] });
    }
    // 1.1.0: the stone lintels (shkufot) of the Ezrat Nashim gates, 20 amot above their threshold (y 6)
    H2.occ(H2.box(g, 6.2, 1.8, 13.6, M2.stoneLight, 228.5, 26, 0));
    for (const s of [-1, 1]) H2.occ(H2.box(eznJ, 13.6, 1.8, 6.2, M2.stoneLight, 161, 26, 67.5 * s));
    H2.occ(H2.box(eznTopDef, 141, 0.9, 5.4, M2.stoneLight, 160.75, 40, -67.5));   // 1.3.0: the long walls are high (top y 40, Middot 2:4)
    H2.occ(H2.box(eznTopDef, 141, 0.9, 5.4, M2.stoneLight, 160.75, 40, 67.5));
    H2.crenellate(eznTopDef, { x1: 95, z1: -67.5, x2: 229, z2: -67.5, y: 40.9, mat: M2.stoneLight });
    H2.crenellate(eznTopDef, { x1: 95, z1: 67.5, x2: 229, z2: 67.5, y: 40.9, mat: M2.stoneLight });
    lbl("שער עזרת נשים", 233, 29.5, 0, 3.5);   // 1.1.0: was "השער העליון" (no source for that name here)
    // 1.9.1 (the user: "שער מזרחי תכתוב שער התחתון לרמבם"): Rambam, Klei HaMikdash 7:6 "שער התחתון והוא שער עזרת נשים... שער העליון
    // הוא שער נקנור ולמה נקרא שער עליון לפי שהוא למעלה מעזרת נשים"; the Mishnah, Sukkah 5:4-5; the Bartenura there; Kaftor VaFerach
    lbl("״השער התחתון״ — לרמב״ם", 233, 34.5, 0, 2);   // LABEL_PAIRS_S1 (finding 5): five over the gate's name (it was three: from afar the two lay on each other)
    lbl("עזרת נשים", 161, 9, 40, 4);
    const chambers = [
      { x0: 188.5, z0: 27.5, xw: 188.5, name: "לשכת הנזירים", prop: "fire" },
      { x0: 188.5, z0: -67.5, xw: 188.5, name: "לשכת העצים", prop: "wood" },
      { x0: 93.5, z0: -67.5, xw: 133.5, name: "לשכת המצורעים", prop: "mikveh" },
      { x0: 93.5, z0: 27.5, xw: 133.5, name: "לשכת שמנים", prop: "jars" }
    ];
    // 1.9.3 (the Rosh's chambers, below): the partitions of the default (the chambers INSIDE the corners) in eznChIn; each chamber's
    // contents in a group of its own (eznProps), which moves out with the chamber, and its labels (eznLbl) with it
    const eznChIn = new Group(), eznProps = {}, eznLbl = {}, gCourts = g;
    g.add(eznChIn);
    const moveLbl = (l, dx, dy, dz) => {   // a label that moves with a reading - its sprite too
      if (!l) return;
      const o = [l.x, l.y, l.z];
      l.x += dx; l.y += dy; l.z += dz;
      let lg = null;
      try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
      if (lg) for (const spr of lg.children) {
        if ((spr.userData && spr.userData.label === l) || (Math.abs(spr.position.x - o[0]) < 1e-3 && Math.abs(spr.position.y - o[1]) < 1e-3 && Math.abs(spr.position.z - o[2]) < 1e-3)) { spr.position.set(l.x, l.y, l.z); break; }
      }
    };
    // OIL_DOORS_B2 (fix-b2, 22.11.2026 - the user's decision 78, after question 78): THE CHAMBER OF THE OILS HAS TWO DOORS, ONE OPPOSITE THE
    // OTHER - "חוץ מלשכת היין ושמן שיש להם שני פתחים זו כנגד זו. אבא שאול היה קורא אותה לשכת בית שמניא" (the Tosefta, Yoma 1:3; 194:4): a
    // door in its NORTH wall, to the women's court, and opposite it a door in its SOUTH wall - the court's outer wall - to the chel, with
    // twelve steps down to the chel's floor. Its door in the east wall (until now) is closed, and its shelves leave an aisle from door to
    // door (OIL_SHELVES_210, below). The doors' places, size and the steps - model choices. In the Rosh's reading (the chambers outside)
    // the chamber is open to the court on its north side, and its south door is not drawn.
    const OILX = 123.25;   // the aisle's middle (x 121..125.5)
    for (const c of chambers) {
      const cx = c.x0 + 20, cz = c.z0 + 20, zPlain = c.z0 > 0 ? 27.5 : -27.5, oil = c.prop === "jars";
      H2.wall(eznChIn, {
        axis: "z",
        length: 40,
        height: 12,
        thickness: 2.5,
        mat: M2.stoneLight,
        cx: c.xw,
        cz,
        y: 6,
        openings: oil ? [] : [{ center: 0, width: 6, height: 9 }]   // 1.1.0: rectangular (Middot 2:3: every opening had a lintel), was arched; OIL_DOORS_B2: none in the oil chamber's east wall
      });
      if (!oil) H2.box(eznChIn, 3.2, 0.9, 8.4, M2.stoneSmooth, c.xw, 15, cz);   // its lintel
      if (!oil) H2.box(eznChIn, 40, 12, 2.5, M2.stoneLight, cx, 6, zPlain);
      else {
        // OIL_DOORS_B2: the north wall with its door (4.5 wide, 9 high), its lintel; the south door through the court's wall (5 thick) -
        // drawn on its two faces - and the twelve steps outside it, down to the chel
        H2.wall(eznChIn, { axis: "x", length: 40, height: 12, thickness: 2.5, mat: M2.stoneLight, cx, cz: zPlain, y: 6, openings: [{ center: OILX - cx, width: 4.5, height: 9 }] });
        H2.box(eznChIn, 6.2, 0.9, 3.2, M2.stoneSmooth, OILX, 15, zPlain);
        const dk = new MeshBasicMaterial({ color: 0x15100b });
        for (const [zf, ry] of [[64.98, Math.PI], [70.02, 0]]) {
          const d = new Mesh(new PlaneGeometry(4.5, 9), dk); d.position.set(OILX, 10.5, zf); d.rotation.y = ry; d.userData.noPick = true; eznChIn.add(d);
        }
        for (const zf of [64.9, 70.1]) for (const sd of [-1, 1]) H2.box(eznChIn, 0.5, 9.4, 0.25, M2.stoneSmooth, OILX + sd * 2.5, 6, zf);
        for (const zf of [64.9, 70.1]) H2.box(eznChIn, 5.5, 0.6, 0.25, M2.stoneSmooth, OILX, 15, zf);
        stairsR(eznChIn, { width: 4.5, totalRise: 6, steps: 12, dir: "N", x: OILX, y: 0, z: 76, tread: 0.5 });
        ctx2.layers.eznChIn = eznChIn;
        ctx2.labels.push({ text: "״שני פתחים זו כנגד זו״ — לשכת בית שמניא (תוספתא יומא א, ג)", x: OILX, y: 17.4, z: 29, size: 1.2, layer: "eznChIn" }, { text: "הפתח השני — אל החיל", x: OILX, y: 17, z: 71.5, size: 1.2, layer: "eznChIn" });
      }
      const g = new Group();   // 1.9.3: the chamber's own group - everything below is built into it (the court's group is gCourts)
      gCourts.add(g);
      eznProps[c.name] = g;
      const l0 = ctx2.labels.length;
      lbl(c.name, cx, 20, cz, 3);
      if (c.prop === "wood") lbl("לרמב״ם — ״לשכת דיר העצים״", cx, 16.2, cz, 1.6);   // LABEL_PAIRS_S1 (finding 5): 3.8 under the chamber's name (it was 2.6: the two lay on each other)
      // DIR_ETZIM_211 (stage ב, point 15; the user: V): Rambam BHB 5:8 (337:83)
      if (c.prop === "fire") {
        // 1.9.1 (the user: "לשכת הנזירים... צריכה יותר אלמנטים קשורים"): Middot 2:5 "ששם הנזירים מבשלין את שלמיהן, ומגלחין את שערן,
        // ומשלחים תחת הדוד"; the Bartenura: the hair is burnt "באש שתחת היורה שמבשלים בה את השלמים, ככתוב ונתן על האש אשר תחת זבח השלמים"
        // (Numbers 6:18). A hearth (a stone ring, embers, logs and the altar's live flames - 40-altar.js, ctx2.shared.nazirFire), the pot
        // standing over it on three stones, locks of hair on the embers, and by the wall a stool with a razor. Sizes - model choices.
        H2.ring(g, 1.5, 0.32, M2.stoneSmooth, cx, 6.25, cz);
        H2.cyl(g, 1.3, 1.3, 0.22, ember, cx, 6.02, cz);
        for (let i = 0; i < 5; i++) { const lg = H2.cyl(g, 0.16, 0.16, 2.2, M2.cedar, cx, 4.98 + (i % 2) * 0.32, cz); lg.rotation.z = HP; lg.rotation.y = i * 0.63; }
        for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3; H2.box(g, 0.55, 1.35, 0.55, M2.stoneSmooth, cx + Math.cos(a) * 1.25, 6, cz + Math.sin(a) * 1.25); }
        H2.lathe(g, [[0, 0], [0.75, 0.05], [1.1, 0.45], [1.18, 1.0], [1.05, 1.45], [0.9, 1.55], [1.0, 1.62]], M2.bronze, cx, 7.35, cz);   // the pot
        H2.cyl(g, 0.86, 0.86, 0.06, new MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.6 }), cx, 8.75, cz);   // the broth and the meat
        // 1.9.1: the locks were under the pot and did not show - now larger and lighter, between the three stones at the hearth's edge (in
        // the fire, "תחת הדוד"), and a few more on the floor by the stool, where they shave
        const hairMat = new MeshStandardMaterial({ color: 0x5c3b22, roughness: 0.95, emissive: 0x1a0d05 });
        const tuftAt = (x, y, z, r, k) => { const tuft = new Mesh(new SphereGeometry(0.42 * k, 12, 7), hairMat); tuft.scale.set(1.6, 0.45, 1.0); tuft.position.set(x, y, z); tuft.rotation.y = r; tuft.castShadow = true; g.add(tuft); };
        for (const [a, rr, r] of [[Math.PI / 3, 1.45, 0.3], [Math.PI, 1.5, -0.5], [5 * Math.PI / 3, 1.45, 1.1], [0.5, 1.7, 0.7], [3.6, 1.65, -1.2]]) tuftAt(cx + Math.cos(a) * rr, 6.32, cz + Math.sin(a) * rr, r, 1);
        for (const [dx, dz, r] of [[5.1, -4.1, 0.4], [6.8, -4.0, -0.8], [6.0, -3.6, 1.3]]) tuftAt(cx + dx, 6.08, cz + dz, r, 0.9);
        ctx2.shared.nazirFire = { x: cx, y: 6.25, z: cz };
        const fl = new PointLight(16748608, 9, 24, 2);
        fl.position.set(cx, 7.4, cz);
        g.add(fl);
        ctx2.animated.push((t) => {
          fl.intensity = 8.5 + Math.sin(t * 0.011) * 2 + Math.sin(t * 0.043) * 1.1;
        });
        H2.box(g, 1.2, 1.0, 1.2, M2.stoneSmooth, cx + 6, 6, cz - 5);   // the stool
        // (the razor: NEZIRIM_211 - in the hands of the one who cuts the hair, below; until 2.0.1 it lay on the stool)
        lbl("הדוד — ״מבשלין את שלמיהן״", cx, 11.5, cz, 1.3);
        lbl("השיער — ״ומשלחים תחת הדוד״", cx + 1.5, 7.6, cz + 2.4, 1.1);
        lbl("תער — ״ומגלחין את שערן״", cx + 6, 10.4, cz - 5, 1.1);
        // NEZIRIM_211 (the user, 15.11.2026: more of what was done in the Nazirites' chamber): MEN - a Nazirite seated on the stool, his
        // hair being cut, and the one who cuts it standing behind him ("ומגלחין את שערן"); two by the pot, their faces to the fire
        // ("מבשלין את שלמיהן... ומשלחים תחת הדוד"); THE BASKET OF THE UNLEAVENED LOAVES that the Nazirite brings with the ram of his
        // peace-offering (Numbers 6:15, 6:19 - loaves and wafers; the verse's words are to be read in the user's library before they
        // are quoted in the card) on a low table; and a heap of logs for the fire. Plain men, not priests: the Nazirite is an
        // Israelite, and who cut the hair is not written. Their look and number, the table, the basket's form - model choices.
        {
          const PN = tm_people(ctx2), ROBES = [0x7b6a52, 0x5f6b7a, 0x8a7d5c, 0x6d5a4a];
          const toFire = (x, z) => Math.atan2(cx - x, cz - z);
          const sx = cx + 6, sz = cz - 5, ys = toFire(sx, sz);
          PN.crowd(g, [[sx, sz, ys]], { y: 7.0, s: 1.4, pose: "bench", seat: 1.0, kind: "worker", robe: ROBES[0], tone: () => 3, shadow: true, fwd: 0.3, name: "nazir-seated", exact: true });
          const bx = sx - Math.sin(ys) * 1.05, bz = sz - Math.cos(ys) * 1.05;
          PN.crowd(g, [[bx, bz, ys]], { y: 6, s: 1.4, pose: "stand", kind: "worker", robe: ROBES[1], tone: () => 2, shadow: true, name: "nazir-barber" });
          { const rz = H2.box(g, 0.1, 0.03, 0.42, M2.bronze, bx + Math.sin(ys) * 0.5 + Math.cos(ys) * 0.12, 8.02, bz + Math.cos(ys) * 0.5 - Math.sin(ys) * 0.12); rz.rotation.y = ys; }   // the razor, in his hand
          const by = [[cx - 2.7, cz + 0.6], [cx + 0.4, cz - 2.8]];
          PN.crowd(g, by.map(([x, z]) => [x, z, toFire(x, z)]), { y: 6, s: 1.4, pose: "stand", kind: "worker", robe: ROBES[2], tone: (i) => 2 + i, shadow: true, name: "nazir-pot", exact: true });
          // NAZIR_LOCKS_211 (the user, 15.11.2026 08:25: "הנזיר צריך להיות עם ממש הרבה שיער, כמו רסטות"): THE NAZIRITES' HAIR, uncut all the
          // days of the vow ("תער לא יעבור על ראשו... גדל פרע שער ראשו", Numbers 6:5) - long thick locks from under the kippah, down the back
          // and over the shoulders: the one seated before the razor and the two by the pot. Their number, length and form - model choices.
          // One merged mesh a man (his own frame: the head at HY, the face to +z), seen within 70 amot.
          {
            const HR = [0.128, 0.16, 0.14];
            let seed = 7321;
            const rr = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
            const cr = (P, u) => {   // Catmull-Rom through the control points, u 0..1
              const n = P.length - 1, f = Math.min(n - 1e-6, Math.max(0, u * n)), i = Math.floor(f), t = f - i;
              const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)], t2 = t * t, t3 = t2 * t;
              return [0, 1, 2].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3));
            };
            const tube = (P, r0, ph) => {   // a lock: rings of 6 along the curve, its thickness knotted and thinning to the end
              const N = 15, M = 6, pos = [], idx = [];
              let prevN = null;
              for (let i = 0; i <= N; i++) {
                const u = i / N, c = cr(P, u), c2 = cr(P, Math.min(1, u + 0.02)), c1 = cr(P, Math.max(0, u - 0.02));
                let tx = c2[0] - c1[0], ty = c2[1] - c1[1], tz = c2[2] - c1[2];
                const tl = Math.hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
                let ax = prevN ? prevN[0] : 1, ay = prevN ? prevN[1] : 0, az = prevN ? prevN[2] : 0;
                const dt = ax * tx + ay * ty + az * tz; ax -= dt * tx; ay -= dt * ty; az -= dt * tz;
                let al = Math.hypot(ax, ay, az);
                if (al < 1e-3) { ax = 0; ay = 0; az = 1; const d2 = az * tz; ax -= d2 * tx; ay -= d2 * ty; az -= d2 * tz; al = Math.hypot(ax, ay, az) || 1; }
                ax /= al; ay /= al; az /= al;
                prevN = [ax, ay, az];
                const bx = ty * az - tz * ay, by2 = tz * ax - tx * az, bz = tx * ay - ty * ax;
                const r = (r0 * (1 + 0.3 * Math.sin(14 * u + ph)) * (1 - 0.3 * u) + 0.004) * (i === N ? 0.45 : 1);   // knotted, as locks matted by themselves
                for (let k = 0; k < M; k++) { const a = (k / M) * Math.PI * 2, ca = Math.cos(a) * r, sa = Math.sin(a) * r; pos.push(c[0] + ax * ca + bx * sa, c[1] + ay * ca + by2 * sa, c[2] + az * ca + bz * sa); }
                if (i > 0) for (let k = 0; k < M; k++) { const a0 = (i - 1) * M + k, a1 = (i - 1) * M + (k + 1) % M, b0 = i * M + k, b1 = i * M + (k + 1) % M; idx.push(a0, b0, a1, a1, b0, b1); }
              }
              const geo = new BufferGeometry();
              geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
              geo.setIndex(idx);
              geo.computeVertexNormals();
              return geo;
            };
            const locksGeo = (HY) => {
              const parts = [];
              const row = (th, n, from, to) => { for (let i = 0; i < n; i++) { const ph = from + (to - from) * ((i + 0.5) / n) + (rr() - 0.5) * 0.08; parts.push([th + (rr() - 0.5) * 0.06, ph]); parts.push([th, -ph]); } };
              row(1.08, 9, 0.85, Math.PI);           // under the kippah's rim, from the temples round the back
              row(1.38, 7, 1.25, Math.PI);           // the second row, lower
              row(1.72, 4, 1.9, Math.PI);            // the nape
              const out = [];
              for (const [th, ph] of parts) {
                const dx = Math.sin(th) * Math.sin(ph), dy = Math.cos(th), dz = Math.sin(th) * Math.cos(ph), q = 1.04;
                const R = [HR[0] * q * dx, HY + HR[1] * q * dy, HR[2] * q * dz];
                const P1 = [R[0] + dx * 0.04, R[1] + dy * 0.03 - 0.015, R[2] + dz * 0.04];
                const aph = Math.abs(ph), sd = Math.sign(Math.sin(ph)) || 1;
                let xh, zh, L;
                if (aph >= 1.95) { xh = Math.sin(ph) * 0.17; zh = -0.19 - 0.03 * Math.abs(Math.cos(ph)); L = 0.72 + rr() * 0.12; }        // down the back
                else if (aph >= 1.3) { xh = sd * (0.205 + rr() * 0.02); zh = -0.165; L = 0.6 + rr() * 0.1; }                             // behind the shoulder
                else { xh = sd * (0.18 + rr() * 0.025); zh = 0.17 + rr() * 0.02; L = 0.5 + rr() * 0.1; }                                   // over the shoulder, before the chest
                const P2 = [P1[0] + (xh - P1[0]) * 0.55, HY - 0.16, P1[2] + (zh - P1[2]) * 0.65];
                const P3 = [xh, HY - 0.31, zh];
                const w = rr() * 6;
                const P4 = [xh * 1.06 + 0.012 * Math.sin(w), HY - 0.31 - L * 0.45, zh + (zh < 0 ? -0.012 : 0.01)];
                const P5 = [xh * 1.12 + 0.015 * Math.sin(w + 2), HY - 0.31 - L * 0.8, zh + (zh < 0 ? -0.02 : 0.016)];
                const P6 = [xh * 1.14 + 0.012 * Math.sin(w + 4), HY - 0.31 - L, zh + (zh < 0 ? -0.024 : 0.02)];
                out.push(tube([R, P1, P2, P3, P4, P5, P6], 0.031 + rr() * 0.008, rr() * 6));
              }
              return mergeGeometries(out);
            };
            const LK = new Group();
            LK.name = "nazirLocks";
            g.add(LK);
            const HAIRC = [0x3a2a1d, 0x2b2119, 0x5a3a22];
            const put = (x, y, z, yaw, seated, k) => {
              const m = new Mesh(locksGeo(2.075 - (seated ? 0.96 : 0)), new MeshStandardMaterial({ color: HAIRC[k % HAIRC.length], roughness: 0.96, metalness: 0 }));
              m.position.set(x, y, z);
              m.rotation.y = yaw;
              m.scale.setScalar(1.4);
              m.castShadow = true;
              m.userData.noPick = true;
              LK.add(m);
            };
            put(sx + Math.sin(ys) * 0.3, 7.0, sz + Math.cos(ys) * 0.3, ys, true, 0);
            by.forEach(([x, z], i) => put(x, 6, z, toFire(x, z), false, i + 1));
            const LKC = new Vector3(cx, 8, cz), LKW = new Vector3();
            ctx2.animated.push(() => { const c = ctx2.camera; if (!c) return; LKW.copy(LKC); g.localToWorld(LKW); const v = c.position.distanceTo(LKW) < 70; if (LK.visible !== v) LK.visible = v; });
          }
          // the low table and the basket on it: thick round loaves ("חלות") and thin wafers ("רקיקים")
          const tx = cx - 6.5, tz = cz - 5.5, wick = new MeshStandardMaterial({ color: 0xa8843f, roughness: 0.95 }), bread = new MeshStandardMaterial({ color: 0xdcbd84, roughness: 0.9 }), wafer = new MeshStandardMaterial({ color: 0xead3a0, roughness: 0.9 });
          H2.box(g, 2.0, 0.12, 1.3, M2.cedar, tx, 6.9, tz);
          for (const [dx, dz] of [[-0.85, -0.5], [0.85, -0.5], [-0.85, 0.5], [0.85, 0.5]]) H2.box(g, 0.12, 0.9, 0.12, M2.cedar, tx + dx, 6, tz + dz);
          H2.lathe(g, [[0, 0], [0.5, 0], [0.62, 0.12], [0.7, 0.34], [0.66, 0.36], [0.56, 0.1], [0, 0.06]], wick, tx - 0.25, 7.02, tz, 18);
          for (let i = 0; i < 5; i++) { const a = i * 1.26, m = H2.cyl(g, 0.2, 0.2, 0.07, bread, tx - 0.25 + Math.cos(a) * 0.26, 7.12 + i * 0.045, tz + Math.sin(a) * 0.26, 14); m.rotation.z = 0.12 * Math.cos(a); m.rotation.x = 0.12 * Math.sin(a); }
          for (let i = 0; i < 4; i++) H2.cyl(g, 0.24, 0.24, 0.02, wafer, tx + 0.62, 7.035 + i * 0.024, tz + 0.1 + (i % 2) * 0.05, 14);
          lbl("סל המצות — חלות ורקיקים (במדבר ו, טו)", tx, 8.7, tz, 1.1);
          // the logs for the fire, by the south wall
          for (let i = 0; i < 9; i++) { const row = i < 4 ? 0 : i < 7 ? 1 : 2, k = i < 4 ? i : i < 7 ? i - 4 : i - 7; const lg = H2.cyl(g, 0.17, 0.17, 2.4, M2.cedar, cx + 4.6 + (k + row * 0.5) * 0.36, 6.17 + row * 0.3, cz + 7.5, 8); lg.rotation.x = HP; }
        }
      } else if (c.prop === "wood") {
        // 1.9.3 (the user, of the kuntres, point 14: "כן"): THE FLOOR-STONE UNLIKE ITS FELLOWS - Mishnah Shekalim 6:2 "מעשה בכהן אחד שהיה
        // מתעסק, וראה הרצפה שהיא משנה מחברותיה... וידעו ביחוד ששם הארון נגנז" (54, line 39); Yoma 54a "ארון בלשכת דיר העצים היה גנוז"
        // (107, line 1403). One paving stone of another hue, a little raised; where in the chamber - a model choice.
        H2.box(g, 1.6, 0.07, 1.6, new MeshStandardMaterial({ color: 0xb9a184, roughness: 0.85 }), cx + 8, 6, cz - 9);
        lbl("רצפה משונה מחברותיה (יומא נד.)", cx + 8, 7.8, cz - 9, 0.9);
        // WOOD_PILES_210 (the user, 14.11.2026: "את לשכת העצים תמלא ממש בעצים מסודרים בערמות ובגדלים שונים"): Middot 2:5 "מזרחית צפונית,
        // היא היתה לשכת העצים, ששם הכהנים בעלי מומין מתליעין העצים. וכל עץ שנמצא בו תולעת, פסול מעל גבי המזבח" (89, line 16). Fourteen
        // piles (until 2.0.0 two): great stacks of logs, middle and small ones, and small crossed stacks of cut wood; each row of a stack
        // one log shorter. The woods - "כל העצים כשרין למערכה, חוץ משל זית ושל גפן. אבל באלו רגילין, במרביות של תאנה ושל אגוז ושל עץ
        // שמן" (Tamid 2:3; 88, line 9): three barks, one InstancedMesh each. An aisle from the door across the chamber, and the odd floor-
        // stone, stay clear. The piles' number, sizes and places, and which wood is in which - model choices.
        {
          const unitLog = new CylinderGeometry(1, 1, 1, 7);
          unitLog.rotateZ(HP);   // along x; a log along z turns by its yaw
          const WOODS = [new MeshStandardMaterial({ color: 0x8b8379, roughness: 0.95 }), new MeshStandardMaterial({ color: 0x5c4434, roughness: 0.9 }),
            new MeshStandardMaterial({ color: 0x9a7650, roughness: 0.9 })];   // fig (grey), walnut (dark), the oil tree (light)
          const L = [[], [], []];   // per wood: [x, y, z, length, radius, yaw]
          const stack = (wood, x, z, yaw, len, r, base, rows) => {   // a stack: rows of logs, each one log fewer
            const c0 = Math.cos(yaw), s0 = Math.sin(yaw), gap = r * 2.05;
            for (let row = 0; row < rows; row++) for (let i = 0; i < base - row; i++) {
              const off = (i - (base - row - 1) / 2) * gap;   // across the logs
              L[wood].push([x - s0 * off, 6 + r + row * r * 1.75, z - c0 * off, len * (0.94 + ((i * 7 + row * 3) % 5) * 0.03), r, yaw]);
            }
          };
          const crib = (wood, x, z, len, r, layers) => {   // cut wood, crossed layer on layer
            for (let k = 0; k < layers; k++) for (let i = 0; i < 5; i++) {
              const off = (i - 2) * (len / 5), y = 6 + r + k * r * 2;
              if (k % 2) L[wood].push([x + off, y, z, len, r, HP]); else L[wood].push([x, y, z + off, len, r, 0]);
            }
          };
          const N0 = cz - 13, S0 = cz + 13;   // the piles' rows north and south of the aisle (the door at cz - 3 .. cz + 3)
          stack(0, cx - 12, N0, 0, 6.5, 0.36, 9, 7);  stack(1, cx - 3, N0, 0, 4.6, 0.3, 8, 6);  crib(2, cx + 2.5, N0 - 1, 1.7, 0.11, 8);
          stack(2, cx + 14, N0 - 0.5, 0, 6.5, 0.36, 9, 7);  stack(1, cx + 3, cz - 7.5, 0, 3, 0.22, 7, 5);  crib(0, cx + 15, cz - 7, 1.7, 0.11, 7);
          stack(0, cx - 16, cz - 7, HP, 4.6, 0.3, 8, 6);
          stack(0, cx - 12, S0, 0, 6.5, 0.36, 9, 7);  stack(1, cx - 2.5, S0, 0, 6.5, 0.36, 9, 7);  stack(2, cx + 6.5, S0, 0, 4.6, 0.3, 8, 6);
          stack(2, cx + 14, S0, 0, 6.5, 0.36, 9, 7);  stack(0, cx - 9.5, cz + 7, 0, 3, 0.22, 7, 5);  crib(1, cx + 1.5, cz + 7, 1.7, 0.11, 8);
          stack(2, cx + 10.5, cz + 6.7, 0, 3, 0.22, 7, 5);
          // ...and more, so the chamber is full: the aisle's east end, and the gaps between the rows
          stack(1, cx + 13, cz, HP, 6.5, 0.36, 9, 7);  stack(0, cx + 5, cz, 0, 4.6, 0.3, 8, 6);  stack(2, cx - 9.5, cz - 8, 0, 3, 0.22, 7, 5);
          crib(1, cx - 3, cz - 7, 1.7, 0.11, 8);  stack(1, cx - 5, cz + 7, 0, 3, 0.22, 7, 5);  crib(2, cx + 6.3, cz + 7, 1.7, 0.11, 7);
          stack(0, cx + 15.1, cz + 6, HP, 4.6, 0.3, 8, 6);
          const mm = new Matrix4(), qq = new Quaternion(), vs = new Vector3(), vp = new Vector3(), yAx = new Vector3(0, 1, 0);
          L.forEach((list, w) => {
            if (!list.length) return;
            const im = new InstancedMesh(unitLog, WOODS[w], list.length);
            list.forEach((l, i) => { mm.compose(vp.set(l[0], l[1], l[2]), qq.setFromAxisAngle(yAx, l[5]), vs.set(l[3], l[4], l[4])); im.setMatrixAt(i, mm); });
            im.instanceMatrix.needsUpdate = true;
            im.castShadow = im.receiveShadow = true;
            im.computeBoundingSphere();
            g.add(im);
          });
          lbl("ערמות העצים — תאנה, אגוז ועץ שמן (תמיד ב, ג)", cx, 13, cz + 10, 1.1);
        }
      } else if (c.prop === "mikveh") {
        // 1.9.1 (the user: "לשכת המצורעין אני רוצה לראות בור מים 40 סאה"): the bath is the measure of the Gemara - "אמה על אמה ברום שלש
        // אמות. ושיערו חכמים מי מקוה ארבעים סאה" (Eruvin 4b; Yoma 31a; Pesachim 109b): a shaft 1 x 1, three amot deep, sunk through the
        // court's pave and podium (the hole: PIT, boxHole above), lined with stone, its water 0.3 below the floor; a stone rim round it.
        // Until 1.9.0 an 8 x 8 bath whose water lay hidden under the pave. Its place in the chamber - model choice.
        const px = PIT.x, pz = PIT.z, iw = 1, wt = (PIT.w - iw) / 2;
        H2.box(g, PIT.w, 0.1, PIT.w, M2.stoneSmooth, px, 2.9, pz);
        for (const s2 of [-1, 1]) {
          H2.box(g, PIT.w, 3, wt, M2.stoneSmooth, px, 3, pz + s2 * (iw / 2 + wt / 2));
          H2.box(g, wt, 3, iw, M2.stoneSmooth, px + s2 * (iw / 2 + wt / 2), 3, pz);
        }
        H2.box(g, iw, 2.7, iw, water, px, 3, pz);
        for (const s2 of [-1, 1]) {
          H2.box(g, PIT.w + 0.6, 0.25, 0.3, M2.stoneSmooth, px, 6, pz + s2 * (PIT.w / 2 + 0.15));
          H2.box(g, 0.3, 0.25, PIT.w, M2.stoneSmooth, px + s2 * (PIT.w / 2 + 0.15), 6, pz);
        }
        // LEPERS_BATH_211 (stage ב, point 25; the user: V): the bath IN A BUILDING - the chamber itself is open to the sky ("ולא היו
        // מקורות", Middot 2:5), so round the pit stands a small roofed house of stone, five and a half amot square and seven and a half
        // high, its doorway to the east (to the chamber's door) with a cedar leaf ajar; inside, a stone bench by the west wall with a
        // folded cloth, and a wooden ladder down the pit. Its roof goes with the chambers' roofs (ctx2.lishkotCut), so the view of the
        // chamber looks in. All in the chamber's group - it moves out with it in the Rosh's reading. The house, its size, the bench and
        // the ladder - model choices (the card says so).
        {
          const HS = 2.8, T = 0.6, HH = 7.5, Y0 = 6;
          for (const s2 of [-1, 1]) H2.wall(g, { axis: "x", length: HS * 2, height: HH, thickness: T, mat: M2.stoneLight, cx: px, cz: pz + s2 * (HS - T / 2), y: Y0 });
          H2.wall(g, { axis: "z", length: HS * 2 - T * 2, height: HH, thickness: T, mat: M2.stoneLight, cx: px - (HS - T / 2), cz: pz, y: Y0 });
          H2.wall(g, { axis: "z", length: HS * 2 - T * 2, height: HH, thickness: T, mat: M2.stoneLight, cx: px + (HS - T / 2), cz: pz, y: Y0, openings: [{ center: 0, width: 1.8, height: 5 }] });
          const lf = H2.box(g, 0.14, 4.9, 1.7, M2.cedar, 0, Y0, 0), hx = px + HS - T - 0.08, hz = pz - 0.9, a = 1.0;   // the leaf, hinged at the north jamb
          lf.position.x = hx - Math.sin(a) * 0.85; lf.position.z = hz + Math.cos(a) * 0.85; lf.rotation.y = -a;
          const rf = H2.box(g, HS * 2 + 0.6, 0.45, HS * 2 + 0.6, M2.stoneSmooth, px, Y0 + HH, pz);   // the roof
          ctx2.lishkotCut.push(rf);
          H2.box(g, 0.9, 0.8, 2.6, M2.stoneSmooth, px - HS + T + 0.45, Y0, pz);                        // the bench
          H2.box(g, 0.7, 0.08, 0.9, new MeshStandardMaterial({ color: 0xf2ecdc, roughness: 0.9, emissive: 0x302b22 }), px - HS + T + 0.45, Y0 + 0.8, pz - 0.6);   // a folded cloth
          for (const s3 of [-1, 1]) H2.box(g, 0.08, 3.65, 0.08, M2.cedar, px - 0.38, 3, pz + s3 * 0.3);   // the ladder's rails, from the pit's floor
          for (let k = 0; k < 6; k++) H2.box(g, 0.06, 0.06, 0.6, M2.cedar, px - 0.38, 3.4 + k * 0.5, pz);
          ctx2.labels.push({ text: "בור מים — ארבעים סאה", x: px, y: Y0 + HH + 1.2, z: pz, size: 1.0 });   // over the house, roof or no roof
        }
      } else if (c.prop === "jars") {
        // 1.9.1 (the user: "לשכת... השמנים צריכה יותר אלמנטים קשורים"): Middot 2:5 (Abba Shaul) "שם היו נותנין יין ושמן". The wine "לא
        // היו כונסים אותו בחצבים גדולים, אלא בחביות קטנות. ואינו ממלא את החביות עד פיהם, כדי שיהא ריחו נודף" (Menachot 8:7) - small jars, the
        // wine below their mouths; and on a stone table the seven liquid measures, "שבע מדות של לח היו במקדש. הין, וחצי ההין, ושלישית
        // ההין, ורביעית ההין, לג, וחצי לג, ורביעית לג" (Menachot 9:2) - their place here is a model choice, sizes by volume.
        // OIL_SHELVES_210 (the user, 14.11.2026: "צייר את לשכת השמנים מחדש מלא מדפים מלאים בכדי שמן"): the four big jars in the middle are
        // gone; wooden shelves along the walls (the east wall beside the door) and three free-standing ones, five tiers each, full of
        // oil jugs - one InstancedMesh (~1,400 jugs, ~56 triangles each, no shadows), drawn only within 130 amot of the chamber (from
        // further a jug is less than a pixel); the shelves themselves - one InstancedMesh of boards and posts. The aisle from the door
        // to the west wall, the wine and the measures stay clear. The shelves' measures, their number and the jugs' form - model choices.
        const smallJar = new LatheGeometry(
          [[0, 0], [0.42, 0.05], [0.6, 0.45], [0.6, 0.85], [0.38, 1.2], [0.24, 1.35], [0.3, 1.5]].map((p) => new Vector2(p[0], p[1])),
          16
        );
        const wineMat = new MeshStandardMaterial({ color: 0x5a0d18, roughness: 0.25 });
        for (let i = 0; i < 6; i++) {   // the wine - six small jars in a row, the wine not up to their mouths
          const j = new Mesh(smallJar, clay);
          j.position.set(cx - 7 + i * 1.5, 6, cz + 6.5);
          j.castShadow = j.receiveShadow = true;
          g.add(j);
          H2.cyl(g, 0.2, 0.2, 0.03, wineMat, cx - 7 + i * 1.5, 7.18, cz + 6.5);
        }
        const TX = cx + 0.5, TZ = cz + 2.6;   // OIL_DOORS_B2: the measures' table out of the aisle (cx + 5, cz + 5.6 until now)
        H2.box(g, 6.4, 1.1, 1.6, M2.stoneSmooth, TX, 6, TZ);   // the measures' table
        const MEAS = [[1], [1 / 2], [1 / 3], [1 / 4], [1 / 12], [1 / 24], [1 / 48]];
        MEAS.forEach(([v], i) => {
          const k = Math.cbrt(v), r = 0.34 * k, h = 0.7 * k;
          H2.lathe(g, [[0, 0], [r, 0], [r, h], [r * 0.92, h]], M2.bronze, TX - 2.65 + i * 0.85, 7.1, TZ, 14);
        });
        {
          const X0 = c.x0, Z0 = c.z0;   // the chamber's corner (93.5, 27.5); inside: x 96..132.2, z 28.8..65
          // [along "x" | "z", from, to, the other coordinate, depth, sides (1 | 2), the facing (+1 | -1: where the jugs' row stands), tiers]
          // OIL_DOORS_B2: the aisle now runs from the north door to the south door (x 121..125.5): the racks along the north and the south
          // walls and the free-standing ones stop short of it, and the east wall's rack runs whole (its door is closed)
          const A0 = OILX - 2.6 - X0, A1 = OILX + 2.6 - X0;
          const RACKS = [
            ["z", Z0 + 3, Z0 + 36, X0 + 3.7, 1.4, 1, 1, 5], ["x", X0 + 5.5, X0 + A0, Z0 + 2.4, 1.4, 1, 1, 5], ["x", X0 + A1, X0 + 37, Z0 + 2.4, 1.4, 1, 1, 5],
            ["x", X0 + 5.5, X0 + A0, Z0 + 36.6, 1.4, 1, -1, 5], ["x", X0 + A1, X0 + 37, Z0 + 36.6, 1.4, 1, -1, 5],
            ["z", Z0 + 4.5, Z0 + 34.5, X0 + 37.8, 1.4, 1, -1, 5],
            ["x", X0 + 7.5, X0 + A0 - 0.5, Z0 + 7.7, 2, 2, 0, 4], ["x", X0 + 7.5, X0 + A0 - 0.5, Z0 + 12.7, 2, 2, 0, 4], ["x", X0 + 7.5, X0 + A0 - 0.5, Z0 + 32.1, 2, 2, 0, 4]
          ];
          const TIER = 1.4, BOARD = 0.1, STEP = 0.8;
          const boards = [], jugs = [];
          let q = 21011;
          const rnd = () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; };
          RACKS.forEach(([ax, a0, a1, o, dep, sides, face, tiers], ri) => {
            const len = a1 - a0, mid = (a0 + a1) / 2;
            const at = (u, v) => (ax === "x" ? [u, v] : [v, u]);   // (along, across) -> (x, z)
            for (let t = 0; t < tiers; t++) {
              const y = 6.05 + t * TIER;
              const [bx, bz] = at(mid, o);
              boards.push([bx, y, bz, ax === "x" ? len : dep, BOARD, ax === "x" ? dep : len]);
              const rows = sides === 2 ? [-0.45, 0.45] : [0];
              for (const r of rows) for (let u = a0 + 0.45; u < a1 - 0.3; u += STEP) {
                if (rnd() < 0.08) continue;   // a jug taken
                const [jx, jz] = at(u + (rnd() - 0.5) * 0.12, o + r + (rnd() - 0.5) * 0.08);
                jugs.push([jx, y + BOARD, jz, 0.9 + rnd() * 0.22, rnd() * Math.PI * 2, ri]);
              }
            }
            const H = 6.05 + tiers * TIER - 0.4;
            for (let u = a0; u <= a1 + 0.01; u += Math.max(3, len / Math.max(1, Math.round(len / 4)))) for (const sd of [-1, 1]) {
              const [px, pz] = at(u, o + sd * (dep / 2 - 0.08));
              boards.push([px, 6, pz, 0.16, H - 6, 0.16]);
            }
          });
          const unitBox = new BoxGeometry(1, 1, 1);
          unitBox.translate(0, 0.5, 0);
          // JUG_COLOR_211 (the user, 14.11.2026: "כדי השמן לא בצבע המדפים, יוצר בלבול"): the shelves of a dark wood and the jugs of a pale
          // buff clay - one is told from the other at a glance (both colours a model choice)
          const shelfMat = M2.cedar.clone();
          shelfMat.color.setHex(0x6a4a36);
          const bm = new InstancedMesh(unitBox, shelfMat, boards.length);
          const mm = new Matrix4(), qq = new Quaternion(), vs = new Vector3(), vp = new Vector3();
          boards.forEach((b, i) => { mm.compose(vp.set(b[0], b[1], b[2]), qq.identity(), vs.set(b[3], b[4], b[5])); bm.setMatrixAt(i, mm); });
          bm.instanceMatrix.needsUpdate = true;
          bm.castShadow = bm.receiveShadow = true;
          g.add(bm);
          // the jugs: per shelf two InstancedMeshes - a finer jug within 35 amot, a plainer one to 130 amot, none beyond - so that only
          // the shelves in the eye's frame are drawn, and from afar a jug costs a few triangles (2.0.1 measured: +28,000 at most from
          // the court, +45,000 inside the chamber)
          const jugHi = new LatheGeometry([[0.001, 0], [0.24, 0.04], [0.3, 0.32], [0.24, 0.62], [0.14, 0.86]].map((p) => new Vector2(p[0], p[1])), 6);
          const jugLo = new LatheGeometry([[0.001, 0], [0.3, 0.3], [0.14, 0.86]].map((p) => new Vector2(p[0], p[1])), 5);
          const jugMat = clay.clone(), tint = new Color(), yAx = new Vector3(0, 1, 0), sets = [];
          jugMat.color.setHex(0xffffff);   // JUG_COLOR_211: the colour is the jugs' own (the instance tints), not the plaster's
          const byRack = new Map();
          for (const j of jugs) { if (!byRack.has(j[5])) byRack.set(j[5], []); byRack.get(j[5]).push(j); }
          for (const list of byRack.values()) {
            const hi = new InstancedMesh(jugHi, jugMat, list.length), lo = new InstancedMesh(jugLo, jugMat, list.length);
            list.forEach((j, i) => {
              mm.compose(vp.set(j[0], j[1], j[2]), qq.setFromAxisAngle(yAx, j[4]), vs.set(j[3], j[3], j[3]));
              hi.setMatrixAt(i, mm); lo.setMatrixAt(i, mm);
              tint.setHSL(0.09 + rnd() * 0.03, 0.2 + rnd() * 0.12, 0.74 + rnd() * 0.08);   // JUG_COLOR_211: pale buff clay
              hi.setColorAt(i, tint); lo.setColorAt(i, tint);
            });
            for (const im of [hi, lo]) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.computeBoundingSphere(); g.add(im); }
            sets.push([hi, lo]);
          }
          let lod = -1;
          if (ctx2.animated) ctx2.animated.push(() => {
            const cp = ctx2.camera && ctx2.camera.position;
            if (!cp) return;
            const dz = cp.z - (cz + g.position.z), dx = cp.x - cx, d2 = dx * dx + dz * dz + (cp.y - 8) * (cp.y - 8);
            const k = d2 < 35 * 35 ? 0 : d2 < 130 * 130 ? 1 : 2;
            if (k === lod) return;
            lod = k;
            for (const [hi, lo] of sets) { hi.visible = k === 0; lo.visible = k === 1; }
          });
        }
        lbl("״שם היו נותנין יין ושמן״", cx, 12, cz, 1.4);
        lbl("חביות קטנות של יין — ״ואינו ממלא את החביות עד פיהם״", cx - 3.3, 8.8, cz + 6.5, 1.0);
        lbl("מדפים מלאים כדי שמן", cx, 13.2, cz - 10.2, 1.2);
        lbl("שבע מדות של לח — הין עד רביעית לג", cx + 0.5, 8.7, cz + 2.6, 1.0);   // OIL_DOORS_B2: over the table's new place
      }
      eznLbl[c.name] = ctx2.labels.slice(l0);
    }
    // 1.9.3 (the user, 10.11.2026 22:44: "לבנות עכשיו"): THE FOUR CHAMBERS OUTSIDE - the Rosh on Middot 2:5 (book 6035, line 32): "ד' לשכות
    // בד' מקצעות. מבחוץ כזה [his drawing: the court an I, a chamber at each end of its two bars] ... ולא היו מקורות בבית שני". The
    // default stays Tosafot Yom Tov's (book 948, line 81): "פירוש במקצעותיה שבפנים... ראיתי תמונה אחת על צורת בית שני... ושם הושמו אלו
    // הד' חצרות קטורות בד' המקצעות שמבחוץ לעזרה זו, ואינו כך". In the Rosh's reading (ctx2.shared.eznChambers.set("outside")): the
    // partitions inside the corners are gone; the long north and south walls are open for forty amot at each end, and each chamber
    // stands out beyond them, forty by forty (wall centre to wall centre, as inside): an outer wall and two side walls as high as the
    // court's, no roof, its floor at the court's level (over the chel's strip and thirty amot beyond it), open to the court along its
    // whole side. Each chamber's contents move out with it (the Nazirites' fire and its flames, the wood, the bath - a new shaft in
    // the new floor, the old one closed - and the jars). That they stand out to the north and the south (the kuntres' reading of the
    // drawing), the walls' height, and the chel and the soreg round them (not drawn anew) - model choices.
    const eznRosh = new Group();
    eznRosh.name = "eznChambersRosh";
    eznRosh.visible = false;
    g.add(eznRosh);
    {
      const wallR = (o) => H2.wall(eznRosh, Object.assign({ height: 34.15, thickness: 5, mat: M2.stone, y: 5.85, openings: [] }, o));   // from the podium's top (the paving is 0.15 thick, between the walls)
      const cap = (w, d, x, z) => H2.box(eznRosh, w, 0.9, d, M2.stoneLight, x, 40, z);
      for (const s of [-1, 1]) {
        cap(60.4, 5.4, 161, 67.5 * s);                                                // over the middle stretch of the long wall
        H2.crenellate(eznRosh, { x1: 133, z1: 67.5 * s, x2: 189, z2: 67.5 * s, y: 40.9, mat: M2.stoneLight });
        for (const [xa, xo, xi] of [[188.5, 228.5, 188.5], [93.5, 93.5, 133.5]]) {    // xa - the chamber's low x; xo / xi - its outer / inner side wall
          wallR({ axis: "x", length: 45, cx: xa + 20, cz: 107.5 * s });               // the outer wall, corner to corner
          wallR({ axis: "z", length: 35, cx: xi, cz: 87.5 * s });                     // the inner side wall, from the long wall's stretch
          wallR({ axis: "z", length: 37.5, cx: xo, cz: 86.25 * s });                  // the outer side wall, from the court's corner
          cap(45.4, 5.4, xa + 20, 107.5 * s);
          cap(5.4, 35, xi, 87.5 * s);
          cap(5.4, 36.2, xo, 86.9 * s);
          H2.crenellate(eznRosh, { x1: xa - 1, z1: 107.5 * s, x2: xa + 41, z2: 107.5 * s, y: 40.9, mat: M2.stoneLight });
          // the floor: a podium up to the court's level from the chel's edge out, its paving between the walls; the bath's shaft in the north-west one
          const holes = xa < 100 && s < 0 ? [{ x: PIT.x, z: PIT.z - 40, w: PIT.w, d: PIT.w }] : [];
          boxHoles(eznRosh, 45, 5.85, 40, M2.stone, xa + 20, 0, 90 * s, holes);   // CHEL_211: from the wall's face (z 70; 77.5 until 2.0.1)
          boxHoles(eznRosh, 35, 0.15, 35, M2.paveFine, xa + 20, 5.85, 87.5 * s, holes);
        }
      }
      H2.box(eznRosh, PIT.w, 0.15, PIT.w, M2.paveFine, PIT.x, 5.85, PIT.z);            // the old shaft's mouth, closed
      for (const [x, z] of [[208.5, -100], [113.5, -100], [208.5, 100], [113.5, 100]]) ctx2.labels.push({ text: "לשכה — מבחוץ, כציור הרא״ש", x, y: 44, z, size: 2, layer: "eznChambersRosh" });
    }
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.eznChambersRosh = eznRosh;
    ctx2.shared.eznChambers = {
      mode: "inside",
      dz(name) { const c = chambers.find((k) => k.name === name); return this.mode === "outside" && c ? (c.z0 > 0 ? 40 : -40) : 0; },
      set(m) {
        this.mode = m === "outside" ? "outside" : "inside";
        const out = this.mode === "outside";
        eznRosh.visible = out; eznChIn.visible = !out; eznTopDef.visible = !out;
        eznJW.visible = eznCW.visible = !out; eznRJ.visible = eznRC.visible = out;
        for (const c of chambers) {
          const d = out ? (c.z0 > 0 ? 40 : -40) : 0, grp = eznProps[c.name], was = grp.position.z;
          if (d === was) continue;
          grp.position.z = d;
          for (const l of eznLbl[c.name] || []) moveLbl(l, 0, 0, d - was);
          if (c.prop === "fire") { const F = ctx2.shared.nazirFire; if (F && F.flames) for (const fm of F.flames) fm.position.z += d - was; }
        }
        return this.mode;
      }
    };
    // SIMCHA_304 (the user, 19.11.2026 19:33: "זיזים קבועים תמיד הדגמה רק במתג"): the gallery that stood here always - cedar boards at
    // y 13.65 with a lattice screen over them, on twelve corbels in the north and south walls and six in the east (y 13.05), no source
    // for their height or the screen - is gone. In its place (63-simcha, SIMCHA_304): the corbels at the walls' mid-height, always -
    // "חלק בלי בליטה באמצע גובהן", "תקרה בולטת מאמצע גובה כתליה" (the Tiferet Yisrael, Middot 2:5, 819:241-243) - and the planks
    // with the railing on them only in the demonstration: "שהניחו קרשים עם מעקה סביב על הזיזין שיוצאין מהחומות סביב" (Sukkah 5:2, 772:516)
    // 1.3.0 (the user; Rambam Beit HaBechirah 5:4 "הסמוכין למערב", Middot 1:4-5 read from the west): the six gates in the WESTERN part of the
    // long walls, 30 amot apart; in the north the third gate is בית המוקד itself (Middot 1:5 "שלישי לו בית המוקד", 1:7: its door to the court)
    const gN = [["שער הניצוץ", -78], ["שער הקרבן", -48]];
    const gS = [["שער הדלק", -78], ["שער הבכורות", -48], ["שער המים", -18]];
    const MOKED_X = -18;   // the house of the hearth, straddling the north wall: its door to the court = the third gate
    const ops = (xs) => xs.map(([, x]) => ({ center: x, width: 10, height: 20 }));   // 1.1.0: rectangular with a lintel (Middot 2:3), was arched
    // 1.8.0 (the user: "שער העליון — מה מצויר ומה לא, ולמה לא מצויר"): the THIRTEEN gates of Abba Yose ben Chanan (Middot 2:6; Shekalim 6:3
    // "שערים דרומיים סמוכין למערב, שער העליון... ולעמתן בצפון סמוכין למערב... ושנים במערב שלא היה להן שם") as a drawn reading. Tosafot
    // (Ketubot 106a, quoted by the Tosafot Yom Tov on Shekalim 6:3): "לכולי עלמא י״ג שערים היו, ז׳ גדולים וו׳ קטנים" - the Mishnah's seven are
    // the great ones; the six small: Nikanor's two wickets (drawn), the Upper Gate in the south and a fourth gate in the north, both west of
    // the first great gate, and the two in the west wall (the TYT there: "וקטנים היו ולא היו משמשין כלום אלא לעת הצורך הגדול"). A small gate
    // is drawn as the wickets, 4 x 8 (model choice); its place in the wall - model choice. ctx2.shared.gates13 swaps the walls: g7 / g13.
    const g7 = new Group(), g13 = new Group(), g13r = new Group();
    g.add(g7);
    g.add(g13);
    g.add(g13r);
    g13.visible = false;
    g13r.visible = false;
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.gates7 = g7;
    ctx2.layers.gates13 = g13;
    ctx2.layers.gates13r = g13r;
    const SMALL_X = -88, SMALL_Z = [-20, 20];   // the small gates: the Upper Gate west of the first great gate (S); the two in the west wall
    // 1.8.2 (the user: "לגבי השמות תחפש במקורות איך היה הסדר"): in the NORTH the first from the west is a great gate - Chok Natan (Middot
    // 1:4, book 6026): "שער הניצוץ הוא סמוך למערב והוא שער יכניה דתני אבא יוסי בן חנן... דהא חשיב סמוך לו שער הקרבן"; Tiferet Yisrael
    // (Yachin Middot 2:6, book 819) the same, and further: "ונ"ל עוד שזהו [שער הנשים] שער קטן דלא חשיב ליה תנא לעיל... ושער השיר דקחשיב
    // תנא הכא, נ"ל דהוא שער בית המוקד... היה שער הנשים בין שער הקרבן לשער המוקד" - and he rejects the reverse ("אבל אי"ל דשער המוקד הוא
    // שער הנשים, ושער השיר היה למזרח משער המוקד, והוא היה השער הקטן"). So Abba Yose's north, from the west: יכניה = הניצוץ (-78), הקרבן
    // (-48), הנשים - the small gate (x -36: 5 amot clear of the Korban gate's opening and 6 of Beit HaMoked's west wall, x -30; model choice
    // in that span), השיר = בית המוקד (-18). The small gate west of the Nitzotz (x -88, until 1.8.1) is gone: Yechonya is "סמוכין למערב".
    const NASHIM_X = -38.5;   // MOKED_WIDE_211: two and a half amot west of its place until 2.0.1 (-36): midway between the Korban gate's opening (x -43) and the wider house (-34)
    // 1.9.1 (the user: "שער השיר - גם כדחיית התפא״י"): the reading Tiferet Yisrael rejects ("אבל אי"ל דשער המוקד הוא שער הנשים, ושער השיר
    // היה למזרח משער המוקד, והוא היה השער הקטן"; the Rosh: "שער השיר... היה סמוך לבית המטבחים") - a third set of walls, g13r: the small
    // gate east of Beit HaMoked, at x 4 (between the house, x -6, and the Golah chamber, x 13 - model choice), none at x -36.
    const SHIR_R_X = 4;
    const small = (c) => ({ center: c, width: 4, height: 8 });
    // 1.9.1 (the user: "בית המוקד - החומה שמעליו מסתירה"): the north wall in two pieces around Beit HaMoked's hall (its opening, 22 wide,
    // 24 high); the strip over the hall (y 37.5..40), its cornice and battlements are pieces of their own in the chambers' pill
    // (ctx2.lishkotCut) - the place opens them with the roofs, and the hall is seen from above
    const MW0 = MOKED_X - 15, MW1 = MOKED_X + 15;   // MOKED_WIDE_211: the hall 30 wide (22 until 2.0.1)
    const wallPart = (grp, x0, x1, opsW) => H2.wall(grp, { axis: "x", length: x1 - x0, height: 26.5, thickness: 5, mat: M2.stone, cx: (x0 + x1) / 2, cz: -67.5, y: 13.5,
      openings: opsW.filter((o) => o.center > x0 && o.center < x1).map((o) => Object.assign({}, o, { center: o.center - (x0 + x1) / 2 })) });
    // WEST2_D (fix-d, 22.11.2026 - the user's decision 147 א): "ושנים במערב שלא היה להם שם" - two readings, the row "שני השערים שבמערב"
    // (ctx2.shared.westGates.set("tyt" | "kaftor")). "tyt" (the default, as until now) - the Tosafot Yom Tov, Tzurat Beit HaMikdash 12:7
    // (book 3190 line 116): "הכי נמי במערב סבירא ליה שהיו עוד שני שערים שאין להם שם. ולאחורי הכפרת היו, ולא שער אולם והיכל, שהוא דחק
    // גדול" - two small gates in the court's west wall, behind the house. "kaftor" - the Kaftor vaFerach, as the TYT quotes him on Shekalim
    // 6:3 (893 line 149): "שעל שער האולם ושער ההיכל הוא דקאמר" - no gate in the west wall; the gates of the ulam and of the heichal are "the
    // two in the west", marked by labels and discs. Each group of thirteen gates keeps both west walls (WEST_T / WEST_K).
    const WEST_T = new Map(), WEST_K = new Map();
    for (const [grp, extra, extraN] of [[g7, false, null], [g13, true, NASHIM_X], [g13r, true, SHIR_R_X]]) {
      const opsN = ops(gN).concat([{ center: 79, width: 20, height: 16 }, { center: 65.5, width: 2, height: 9.5 }], extraN != null ? [small(extraN)] : []);   // 1.9.5 THREE_CHAMBERS_195: the hall in the north-east (centre 60, 22 wide until 1.9.4) and the wood chamber's door to the Hel
      wallPart(grp, -96, MW0 - 1, opsN);   // ROVDIN_NICHES_N2: ends at the hall's west wall's OUTER face (-34): the hall's own wall (one amah, with the niches cut into it) stands there - until now the two overlapped
      wallPart(grp, MW1 + 1, 96, opsN);   // 1.8.0: the wall is open over בית המוקד's hall (its own walls close it)
      H2.wall(grp, { axis: "x", length: 192, height: 26.5, thickness: 5, mat: M2.stone, cx: 0, cz: 67.5, y: 13.5, openings: ops(gS).concat(extra ? [small(SMALL_X)] : []) });
      if (!extra) H2.wall(grp, { axis: "z", length: 135, height: 26.5, thickness: 5, mat: M2.stone, cx: -93.5, cz: 0, y: 13.5, openings: [] });
      else {   // WEST2_D
        const wt = new Group(), wk = new Group();
        wt.name = "westGatesTyt"; wk.name = "westGatesKaftor"; wk.visible = false;
        grp.add(wt, wk);
        WEST_T.set(grp, wt); WEST_K.set(grp, wk);
        H2.wall(wt, { axis: "z", length: 135, height: 26.5, thickness: 5, mat: M2.stone, cx: -93.5, cz: 0, y: 13.5, openings: SMALL_Z.map(small) });
        H2.wall(wk, { axis: "z", length: 135, height: 26.5, thickness: 5, mat: M2.stone, cx: -93.5, cz: 0, y: 13.5, openings: [] });
      }
    }
    // MOKED_VAULT_A2 (the user's decision 26: "החומה נקטעת מעל בית המוקד"): the court's wall is broken over the hall - its vault rises
    // in the gap and is seen from without. (Until now a bridge of wall, 2.5 high, with its coping and battlements, ran over it.)
    // CHEL_211: the small gates' landings in the chel. The Upper Gate (x -88) - a landing joined to the first south gate's; the north's
    // small gate of Tiferet Yisrael (x -36) - joined to the Korban gate's; the rejected reading's (x 4) - a landing and a flight of its
    // own; the two of the west - a landing each and a flight along the west wall. In the reading of seven gates the two great gates'
    // landings are closed by a rail at that end.
    platRail(g7, -84, -72, 70, 74, 13.5, ["w"]);
    platRail(g7, -54, -42, -74, -70, 13.5, ["e"]);
    platRail(g13r, -54, -42, -74, -70, 13.5, ["e"]);
    for (const grp of [g13, g13r]) {
      H2.box(grp, 7, 13.5, 4, M2.stoneSmooth, -87.5, 0, 72);
      platRail(grp, -91, -84, 70, 74, 13.5, ["s", "w"]);
      for (const z of SMALL_Z) {
        const sg = Math.sign(z), wt = WEST_T.get(grp);   // WEST2_D: the TYT's west gates' landings and flights
        H2.box(wt, 4, 13.5, 6, M2.stoneSmooth, -98, 0, z);
        platRail(wt, -100, -96, z - 3, z + 3, 13.5, ["w", sg > 0 ? "n" : "s"]);
        stairsR(wt, { width: 4, totalRise: 13.5, steps: 27, dir: sg > 0 ? "N" : "S", x: -98, y: 0, z: z + sg * 16.5, tread: 0.5 });
      }
    }
    H2.box(g13, 8.5, 13.5, 4, M2.stoneSmooth, -37.75, 0, -72);
    platRail(g13, -42, -33.5, -74, -70, 13.5, ["n", "e"]);
    chelFlight(g13r, SHIR_R_X, -1, 1, { landW: 6 });
    for (const [grp, nx] of [[g13, NASHIM_X], [g13r, SHIR_R_X]]) {
      for (const s of [-1, 1]) {
        const sx = s < 0 ? nx : SMALL_X;
        H2.occ(H2.box(grp, 5.6, 0.9, 6.2, M2.stoneLight, sx, 21.5, 67.5 * s));
        H2.doors(grp, { axis: "x", cx: sx, cz: 67.5 * s, y: 13.5, width: 4, height: 8, inward: -s, mat: M2.gateGold, open: 1.1, inset: 2, thick: 0.3 });
      }
      for (const z of SMALL_Z) {
        const wt = WEST_T.get(grp);   // WEST2_D
        H2.occ(H2.box(wt, 6.2, 0.9, 5.6, M2.stoneLight, -93.5, 21.5, z));
        H2.doors(wt, { axis: "z", cx: -93.5, cz: z, y: 13.5, width: 4, height: 8, inward: 1, mat: M2.gateGold, open: 0, inset: 2, thick: 0.3 });
      }
    }
    ctx2.labels.push(
      { text: "שער העליון — שער קטן (אבא יוסי בן חנן)", x: SMALL_X, y: 24.5, z: 71, size: 1.6, layer: "gates13" },
      { text: "שער הנשים — שער קטן (תפארת ישראל)", x: NASHIM_X, y: 26, z: -71, size: 2.6, layer: "gates13" },
      // Abba Yose ben Chanan's names on the north's great gates (Chok Natan, Tiferet Yisrael), under the names of Middot
      { text: "לאבא יוסי בן חנן: שער יכניה", x: -78, y: 31, z: -71, size: 2, layer: "gates13" },
      { text: "לאבא יוסי בן חנן: שער הקרבן", x: -48, y: 31, z: -71, size: 2, layer: "gates13" },
      { text: "לאבא יוסי בן חנן: שער השיר (תפארת ישראל)", x: MOKED_X, y: 31, z: -56, size: 1.6, layer: "gates13" },   // by its gate to the court (the counted one)
      { text: "שני שערים במערב שלא היה להם שם", x: -97, y: 24.5, z: 0, size: 1.6, layers: ["gates13", "westTyt"] },
      // 1.9.1: the rejected reading (g13r)
      { text: "שער העליון — שער קטן (אבא יוסי בן חנן)", x: SMALL_X, y: 24.5, z: 71, size: 1.6, layer: "gates13r" },
      { text: "שער השיר — שער קטן למזרח בית המוקד (האפשרות שתפארת ישראל דוחה)", x: SHIR_R_X, y: 26, z: -71, size: 2.6, layer: "gates13r" },
      { text: "לאבא יוסי בן חנן: שער יכניה", x: -78, y: 31, z: -71, size: 2, layer: "gates13r" },
      { text: "לאבא יוסי בן חנן: שער הקרבן", x: -48, y: 31, z: -71, size: 2, layer: "gates13r" },
      { text: "לאבא יוסי בן חנן: שער הנשים — בית המוקד (האפשרות הנדחית)", x: MOKED_X, y: 31, z: -56, size: 1.6, layer: "gates13r" },
      { text: "שני שערים במערב שלא היה להם שם", x: -97, y: 24.5, z: 0, size: 1.6, layers: ["gates13r", "westTyt"] },
      // WEST2_D: the Kaftor vaFerach's reading - the ulam's gate (its east face x 17.5) and the heichal's (x -4.5, inside the ulam)
      { text: "כפתור ופרח: ״שנים במערב״ — שער האולם", x: 19, y: 66, z: 0, size: 2.2, layers: ["gates13", "westKaftor"] },
      { text: "כפתור ופרח: ״שנים במערב״ — שער ההיכל", x: -3, y: 45, z: 0, size: 1.6, layers: ["gates13", "westKaftor"] },
      { text: "כפתור ופרח: ״שנים במערב״ — שער האולם", x: 19, y: 66, z: 0, size: 2.2, layers: ["gates13r", "westKaftor"] },
      { text: "כפתור ופרח: ״שנים במערב״ — שער ההיכל", x: -3, y: 45, z: 0, size: 1.6, layers: ["gates13r", "westKaftor"] }
    );
    {   // WEST2_D: the switch; two empty groups stand for the two readings in the labels' layers
      const fT = new Group(), fK = new Group();
      fK.visible = false;
      g.add(fT, fK);
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.westTyt = fT; ctx2.layers.westKaftor = fK;
      ctx2.shared.westGates = {
        mode: "tyt",
        set(m) {
          this.mode = m === "kaftor" ? "kaftor" : "tyt";
          const k = this.mode === "kaftor";
          for (const w of WEST_T.values()) w.visible = !k;
          for (const w of WEST_K.values()) w.visible = k;
          fT.visible = !k; fK.visible = k;
          if (ctx2.requestRender) ctx2.requestRender();
          return this.mode;
        }
      };
    }
    // GATES_FAR_205 b: the names that the readings give differently are 2.6 high (the others 2)
    // GATES_FAR_205 (the user, 12.11.2026: "שערי בית המקדש עפ"י המבטים לא מצליחים להבין את המח'" - from the row's own view, over the whole
    // court, a small gate of four amot could not be made out): in the readings of thirteen gates a disc stands over every gate - gold
    // over the seven great ones, red over the six small ones - and grows with the camera's distance (as the guards' discs,
    // GUARDS_FAR_195). A sign of the model, said in the row's card.
    {
      const FARG = [], mG = new MeshBasicMaterial({ color: 0xe2a400 }), mS = new MeshBasicMaterial({ color: 0xc23b22 }), gD = new CylinderGeometry(2, 2, 0.4, 24);
      const disc = (grp, x, z, small) => { const d = new Mesh(gD, small ? mS : mG); d.position.set(x, 48, z); d.userData.noPick = true; grp.add(d); FARG.push(d); };
      for (const [grp, nx] of [[g13, NASHIM_X], [g13r, SHIR_R_X]]) {
        for (const [, x] of gN) disc(grp, x, -67.5, false);
        disc(grp, MOKED_X, -56, false);                       // the hearth house's gate to the court - the third of the north
        for (const [, x] of gS) disc(grp, x, 67.5, false);
        disc(grp, 93.5, 0, false);                            // Nikanor
        disc(grp, 93.5, -12, true); disc(grp, 93.5, 12, true);   // its two wickets
        disc(grp, SMALL_X, 67.5, true);                       // the Upper Gate
        disc(grp, nx, -67.5, true);                           // the small gate of the north (its place by the reading)
        for (const z of SMALL_Z) disc(WEST_T.get(grp), -93.5, z, true);   // the two of the west (WEST2_D: the TYT's)
        disc(WEST_K.get(grp), 19, 64, true);                  // WEST2_D: the Kaftor vaFerach's - over the ulam's gate,
        { const d = FARG[FARG.length - 1]; d.position.set(19, 64, 0); }
        disc(WEST_K.get(grp), -3, 43.5, true);                //   and over the heichal's (inside the ulam)
        { const d = FARG[FARG.length - 1]; d.position.set(-3, 43.5, 0); }
      }
      if (ctx2.animated) ctx2.animated.push(() => {
        if (!g13.visible && !g13r.visible) return;
        const cp = ctx2.camera.position;
        for (const d of FARG) { const k = Math.min(4.5, Math.max(1, cp.distanceTo(d.position) / 110)); d.scale.set(k, 1, k); }
      });
      // the hearth house's name by Abba Yose also over its north face (its label by the gate to the court is hidden from the north)
      ctx2.labels.push({ text: "לאבא יוסי בן חנן: שער השיר (תפארת ישראל)", x: MOKED_X, y: 51, z: -79, size: 2.6, layer: "gates13" },
        { text: "לאבא יוסי בן חנן: שער הנשים — בית המוקד (האפשרות הנדחית)", x: MOKED_X, y: 51, z: -79, size: 2.6, layer: "gates13r" });
    }
    // the Rambam (5:5): "ושער זה הוא הנקרא שער העליון והוא שער ניקנור" - a label on Nikanor's gate, shown by the same row
    const upN = new Group();
    upN.visible = false;
    g.add(upN);
    ctx2.layers.upperNikanor = upN;
    ctx2.labels.push({ text: "״שער העליון״ — כך קורא הרמב״ם לשער ניקנור", x: 100, y: 44, z: 0, size: 1.8, layer: "upperNikanor" });
    ctx2.shared.gates13 = { mode: "seven", set(m) { this.mode = ["thirteen", "thirteenR", "nikanor"].includes(m) ? m : "seven"; g13.visible = this.mode === "thirteen"; g13r.visible = this.mode === "thirteenR"; g7.visible = !g13.visible && !g13r.visible; upN.visible = this.mode === "nikanor"; } };
    boxHoles(g, 5, 7.5, 135, M2.stone, 93.5, 6, 0, [-1, 1].map((sz) => ({ x: 93.5, z: sz * KDEEP.z, w: 5, d: KDEEP.d })));   // KLI_DEEP_211: the instruments' chambers pass under the wall
    H2.wall(g, { axis: "z", length: 135, height: 26.5, thickness: 5, mat: M2.stone, cx: 93.5, cz: 0, y: 13.5, openings: [
      { center: 0, width: 10, height: 20 },
      // Nikanor (1.1.0: rectangular, Middot 2:3)
      { center: -12, width: 4, height: 8 },
      // pishpeshin (Middot 2:6; their size is a model choice)
      { center: 12, width: 4, height: 8 },
      // KLI_SHIR_211: the doors of the gate's two chambers through the wall, from the court of Israel (the chambers stand on its floor, over
      // the instruments' chambers - Middot 2:6; the user's place); as the rooms' own doors, 3.6 by 7 - model choices
      { center: -24, width: 3.6, height: 7 },
      { center: 24, width: 3.6, height: 7 }
    ] });
    // 1.9.3 (the user, of the kuntres, point 9: "רש״י — תעשה לפיו ותשנה (לא כשיטה)"; 20:29 "כן"): BAR SHURA - Pesachim 86a "משכחת לה בבר
    // שורא... שורא ובר שורא" (106 line 2736); Rashi (2162 line 4148): "חומה קטנה לפנים מן החומה גדולה, והיא נמוכה ושוה לקרקע גובה העזרה,
    // שקרקע העזרה הולך וגבוה ועולה במעלות"; Tosafot Yom Tov, Middot 2:3 (948 line 69): "כלומר שראשה תהא שוה לקרקע העזרה... והיה זה לדעתי
    // לחזוק הקרקע שלא יפול העפר ממנה". ONE low wall against the court's wall on its inside, its top at the level of the priests' court's
    // floor (16): in the court of Israel (floor 13.5) it stands two and a half amot high - along the east wall (broken at the Nikanor
    // gate and its two wickets) and along the north and south walls down to the duchan's steps; in the priests' court its top is level
    // with the floor and nothing of it is seen, so nothing is drawn there. One amah thick - a model choice.
    {
      const bs = (x0, x1, z0, z1) => { const m = H2.box(g, x1 - x0, 2.5, z1 - z0, M2.stoneSmooth, (x0 + x1) / 2, 13.5, (z0 + z1) / 2); m.name = "barShura"; return m; };
      for (const [z0, z1] of [[-65, -28.5], [-19.5, -14.6], [-9.4, -5.6], [5.6, 9.4], [14.6, 19.5], [28.5, 65]]) bs(90, 91, z0, z1);   // CHAMBERS_EAST_N2: broken where the two chambers of the gate stand against the wall (z -28.5..-19.5, 19.5..28.5); KLI_SHIR_211: at the doors (z +-24) until now
      for (const sg of [-1, 1]) bs(85.02, 90, sg < 0 ? -65 : 64, sg < 0 ? -64 : 65);   // DUCHAN_GAP_A2: to the step's east face (x 85)
      lbl("בר שורא — חומה קטנה לפנים מן החומה (רש״י פסחים פו.)", 89.4, 17.6, 38, 1.2);
    }
    // 1.1.0: the stone lintels (shkufot, Middot 2:3) of the six north/south Azara gates (threshold y 13.5 -> lintel at 33.5), of the
    // Nikanor gate and of its two pishpeshin
    for (const [, x] of gN) H2.occ(H2.box(g, 13.6, 1.8, 6.2, M2.stoneLight, x, 33.5, -67.5));
    for (const [, x] of gS) H2.occ(H2.box(g, 13.6, 1.8, 6.2, M2.stoneLight, x, 33.5, 67.5));
    H2.occ(H2.box(g, 6.2, 1.8, 13.6, M2.stoneLight, 93.5, 33.5, 0));
    for (const z of [-12, 12]) H2.occ(H2.box(g, 6.2, 0.9, 5.6, M2.stoneLight, 93.5, 21.5, z));
    gN.forEach(([n, x]) => lbl(n, x, 35.5, -70.5, 3.2));
    gS.forEach(([n, x]) => lbl(n, x, 35.5, 70.5, 3.2));
    H2.occ(H2.box(g, MW0 + 97, 0.9, 6.5, M2.stoneLight, (MW0 - 97) / 2, 40, -67.5));   // 1.9.1: west and east of Beit HaMoked's strip
    H2.occ(H2.box(g, 97 - MW1, 0.9, 6.5, M2.stoneLight, (MW1 + 97) / 2, 40, -67.5));
    for (const xw of [MW0 - 0.5, MW1 + 0.5]) H2.box(g, 1, 2.5, 5, M2.stone, xw, 37.5, -67.5);   // ROVDIN_NICHES_N2: the court wall now ends at the hall's outer face - closes the gap over the hall's end walls (37.5..40)
    H2.occ(H2.box(g, 194, 0.9, 6.5, M2.stoneLight, 0, 40, 67.5));
    H2.occ(H2.box(g, 6.5, 0.9, 137, M2.stoneLight, -93.5, 40, 0));
    H2.occ(H2.box(g, 6.5, 0.9, 137, M2.stoneLight, 93.5, 40, 0));
    H2.crenellate(g, { x1: -94, z1: -67.5, x2: MW0 - 0.5, z2: -67.5, y: 40.9, mat: M2.stoneLight });
    H2.crenellate(g, { x1: MW1 + 0.5, z1: -67.5, x2: 94, z2: -67.5, y: 40.9, mat: M2.stoneLight });
    H2.crenellate(g, { x1: -94, z1: 67.5, x2: 94, z2: 67.5, y: 40.9, mat: M2.stoneLight });
    H2.crenellate(g, { x1: -93.5, z1: -64, x2: -93.5, z2: 64, y: 40.9, mat: M2.stoneLight });
    H2.crenellate(g, { x1: 93.5, z1: -64, x2: 93.5, z2: 64, y: 40.9, mat: M2.stoneLight });
    H2.box(g, 2.4, 22, 2.4, M2.stoneLight, 96.4, 13.5, -6.8);
    H2.box(g, 2.4, 22, 2.4, M2.stoneLight, 96.4, 13.5, 6.8);
    H2.box(g, 4.6, 2.8, 19, M2.stoneLight, 95.6, 34.2, 0);
    H2.box(g, 5.6, 1, 21.5, M2.stoneLight, 95.6, 37, 0);
    lbl("שער ניקנור", 100, 39.5, 0, 4);
    // 1.5.0: THE DOORS. The six north / south gates and the women's-court gate - gold leaves (Middot 2:3); Nikanor's - bronze that yellows
    // like gold (2:3 "מפני שנחשתן מצהיב"; Yoma 38a: Nikanor's doors, saved from the sea). The wickets of Nikanor: leaves too, smaller. The
    // leaves stand ajar into the court (an angle - model choice), so the gate reads as a gate and the way through stays open (GATE_K: the
    // women's-court gate's two leaves too, below - until now 0.3 off shut).
    for (const [, x] of gN) H2.doors(g, { axis: "x", cx: x, cz: -67.5, y: 13.5, width: 10, height: 20, inward: 1, mat: M2.gateGold, open: 1.1, inset: 2 });
    for (const [, x] of gS) H2.doors(g, { axis: "x", cx: x, cz: 67.5, y: 13.5, width: 10, height: 20, inward: -1, mat: M2.gateGold, open: 1.1, inset: 2 });
    // 1.9.5 (a remark sent on to the user, 11.11.2026: "לפי הדגם דלתות שער ניקנור סותמות את העזרה"): the two leaves stood open into the
    // court of Israel - four of its eleven amot. Now they stand open in the gate's own thickness, each leaf (five amot) against a side
    // of the passage (five amot deep) - as the heichal's outer doors, "נפתחות לתוך הפתח לכסות עביו של כתל" (Middot 4:1). For Nikanor's
    // gate no source tells the way its doors opened: a model choice.
    H2.doors(g, { axis: "z", cx: 93.5, cz: 0, y: 13.5, width: 10, height: 20, inward: -1, mat: M2.nikanorBronze, open: Math.PI / 2, inset: -2.45 });
    for (const z of [-12, 12]) H2.doors(g, { axis: "z", cx: 93.5, cz: z, y: 13.5, width: 4, height: 8, inward: -1, mat: M2.nikanorBronze, open: z < 0 ? 1.1 : 0.0, inset: 2, thick: 0.3 });
    lbl("דלתות ניקנור — נחושת שמצהיבה כזהב", 97, 24, 0, 1.2);
    // MEZUZAH_211 (stage ב, point 19; the user: V): "כל השערים שהיו שם לא היה להם מזוזה, חוץ משער ניקנור, שלפנים ממנו לשכת פרהדרין" (Yoma
    // 11a, 107:222). On the northern post - the right of one who comes in westward - in the outer tefach of the way in, at the start of the
    // opening's upper third, upright; its case, size and that it is upright: model choices.
    {
      const mzM = new MeshStandardMaterial({ color: 0x7a5a32, roughness: 0.55, metalness: 0.25 });
      const mz = new Mesh(new BoxGeometry(0.1, 0.45, 0.08), mzM);
      mz.position.set(97.4, 13.5 + 20 * 2 / 3, -5.6 + 0.04);
      mz.userData.noPick = true;
      g.add(mz);
      ctx2.labels.push({ text: "מזוזה — מכל השערים, רק בשער ניקנור (יומא יא.)", x: 97.6, y: 13.5 + 20 * 2 / 3 + 1.0, z: -4.6, size: 0.75, far: 110 });
    }
    // 1.9.3 (the user: "המדרגות שבשער המזרחי של עזרת כהנים... עגולות (זה שייך גם לבית שני)" - they were round already; checked again
    // against the sources): the tread is HALF an amah - "כל המעלות שהיו שם, רום מעלה חצי אמה, ושלחה חצי אמה, חוץ משל אולם" (Middot
    // 2:3), and the Rambam on these fifteen: "רום כל מעלה חצי אמה ושלחה חצי אמה" (Beit HaBechirah 6:2). Until 1.9.2 each step was a
    // whole amah deep (radii 24..10), and the top one, 10 in radius, ended short of the two wickets (z +-10..14): now the top one is
    // 15 in radius (the gate and both wickets stand on it), and each one below it half an amah more - the lowest 22 (model choice).
    // 1.9.3 (the user, of the kuntres, point 1: "לשנות"): THE FIFTEEN STEPS AS THE MEIRI describes them (Middot 2:5; 6033, line 35):
    // "ולא היו טרוטות, ר"ל מסודרות ומשוכות על רוחב אחד כשאר המעלות, אלא מוקפות כחצי גורן, שהתחתונה קצרה, והשניה עודפת לה משני
    // קצותיה, וכן שלישית לשניה, וכלם על סדר זה, עד שכשהיו כלם מסודרות בסדר זה היתה צורתם דומה להקף של חצי גורן". So the lowest step
    // is the SHORTEST and each one above it longer at both its ends: arcs one within the other, open to the women's court (the
    // kuntres draws them so - an arc that swells toward the gate), not the half-discs of 1.9.2, whose lowest step was the longest.
    // Fifteen slabs half an amah thick, each the terrace before the gate (x 96..116, z -17.5..17.5) with a half-round bite out of
    // its east side, centred (116, 0): the lowest bite 10 in radius, each one above it half an amah more (tread half an amah,
    // Middot 2:3) - the top one leaves the terrace, three amot deep at the gate, wide enough for the gate and its two wickets.
    // The lowest radius, the terrace's depth and width - model choices.
    // 1.9.5 (the user, 11.11.2026 16:06: "יוצא היום שאין הבדל בין המאירי לראש במעלות של שער ניקנור... צריך לאחד אותם. כבר אין שתי
    // שיטות"; 16:31: "רחב במעלות"): ONE DRAWING OF THE FIFTEEN STEPS. In the user's library the Meiri (6033, line 35) gives the shape -
    // "התחתונה קצרה והשניה עודפת לה משני קצותיה וכן שלישית לשניה" - and no length; the Rid (7576, line 355) and R. Yehonatan (line
    // 353) give the length - "ואורך המעלה היה קל"ה אמה כרוחב העזרה מכותל לכותל" - and no shape; the Rosh (6035, line 32): "אלא מוקפות
    // כחצי גורן עגולה. כזו". So: straight steps along the court's west wall, half an amah high and deep (Middot 2:3), the top one as
    // long as the free width and each one below it shorter at both its ends, the ends on an arc - "כחצי גורן". THE FREE WIDTH: with the
    // four chambers inside the court's corners (the default, Tosafot Yom Tov) the two small chambers of Nikanor's gate (z +-19.5..28.5)
    // stand between the gate and the corner chambers, so the steps run between them - 39 amot; with the chambers outside (the Rosh;
    // ctx2.shared.eznChambers) - from wall to wall, 135, and the two small chambers stand in them (no step is drawn inside those two,
    // nor before their doors). The arc (through the two ends of the top step, 7.5 deep - the steps' whole run) and so the lowest step's
    // length, and the steps being straight - model choices. The two drawings of 1.9.3 / 1.9.4 (the round terrace by the gate, "המאירי";
    // the half discs, "הרא״ש — כציורו") are gone, and with them the row "חמש עשרה המעלות — צורתן" of the opinions table.
    const steps15In = new Group(), steps15Out = new Group();
    steps15In.name = "steps15In"; steps15Out.name = "steps15Out";
    steps15Out.visible = false;
    g.add(steps15In); g.add(steps15Out);
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.steps15In = steps15In; ctx2.layers.steps15Out = steps15Out;
    {
      const XW = 96, C0 = 19.5, C1 = 28.5;   // the west wall's face; the two small chambers of the gate stand at z +-C0..C1
      const build = (grp, HZ) => {
        const RR = (HZ * HZ + 7.5 * 7.5) / 15;   // the arc: its chord the free width, its depth the steps' run
        for (let k = 1; k <= 15; k++) {
          const d = 0.5 * (15 - k), half = Math.sqrt(Math.max(0, RR * RR - (RR - 7.5 + d) * (RR - 7.5 + d))), dep = 0.5 * (16 - k);
          const seg = (z0, z1) => {   // solid down to the court's floor, so that no step hangs over the one below it
            const st = H2.box(grp, dep, 0.5 * k, z1 - z0, M2.stoneSmooth, XW + dep / 2, 6, (z0 + z1) / 2);
            st.castShadow = st.receiveShadow = true;
          };
          seg(-Math.min(half, C0), Math.min(half, C0));
          if (half > C1 + 0.01) { seg(C1, half); seg(-half, -C1); }
        }
      };
      build(steps15In, C0);
      build(steps15Out, 67.5);
    }
    ctx2.labels.push({ text: "חמש עשרה המעלות — כחצי גורן", x: 104, y: 16.5, z: 0, size: 1.6 });
    // 1.9.5, later the same day (the user, 11.11.2026 17:11: "מעלות שתי קריאות רמבם ברירת מחדל"): TWO READINGS OF THE FIFTEEN STEPS.
    // The Rambam's commentary on Middot 2:5 (the user's library, book 573, line 25) stands against the Rid's length: "שמעלות עזרת נשים
    // לא היו ארוכים כשאר המעלות כמו שהוא מפורסם היום מצורת המדרגות אלא היתה כל מעלה כמו חצי עגולה עד שתהא כל מעלה חצי גורן כזה [a
    // drawing] ולפיכך היתה צורת המעלה כמי שלקח קצת אצטבא ונתן אותה על המעלה עד שמשלים צורת הסולם". So the row "חמש עשרה המעלות —
    // צורתן" is back in the opinions table (rows_200.py, part 9):
    //   "rambam" (THE DEFAULT) - the group steps15Round: fifteen half discs lying one on the other before Nikanor's gate, each half an
    //     amah high (Middot 2:3; Beit HaBechirah 6:2), the top one 15 in radius (the gate and its two wickets, z +-10..14, stand on
    //     it) and each one below it half an amah more - the lowest 22; the five lowest are cut at z +-19.5, where the walls of the two
    //     small chambers of the gate stand. The radii and the cut - model choices. (These are the half discs the model had until 1.9.2
    //     and again in 1.9.4 under "הרא״ש — כציורו"; there they ran into the two small chambers.)
    //   "rid" - the wide steps above (steps15In / steps15Out by the place of the four chambers): the Rid and R. Yehonatan's length
    //     with the Meiri's shape.
    const steps15Round = new Group();
    steps15Round.name = "steps15Round";
    g.add(steps15Round);
    ctx2.layers.steps15Round = steps15Round;
    for (let k = 1; k <= 15; k++) {
      const R = 22 - (k - 1) * 0.5, zc = Math.min(R, 19.5), uc = Math.sqrt(Math.max(0, R * R - zc * zc)), a = Math.asin(zc / R);
      const sh = new Shape();   // in the shape's plane: x = the model's x - 96 (east of the wall's face), y = the model's -z
      sh.moveTo(0, -zc);
      if (uc > 0.001) sh.lineTo(uc, -zc);
      sh.absarc(0, 0, R, -a, a, false);
      sh.lineTo(0, zc);
      sh.lineTo(0, -zc);
      const geo = new ExtrudeGeometry(sh, { depth: 0.5, bevelEnabled: false, curveSegments: 48 });
      geo.rotateX(-Math.PI / 2);   // the extrusion rises: the slab stands on y 0..0.5
      const st = new Mesh(geo, M2.stoneSmooth);
      st.position.set(96, 6 + (k - 1) * 0.5, 0);
      st.castShadow = st.receiveShadow = true;
      steps15Round.add(st);
    }
    steps15In.visible = false;
    ctx2.shared.steps15 = {
      mode: "rambam",
      set(m) { this.mode = m === "rid" ? "rid" : "rambam"; this.sync(); return this.mode; },
      sync() {   // the wide steps' length follows the place of the four chambers (ctx2.shared.eznChambers, above)
        const rid = this.mode === "rid", out = !!(ctx2.shared.eznChambers && ctx2.shared.eznChambers.mode === "outside");
        steps15Round.visible = !rid;
        steps15Out.visible = rid && out; steps15In.visible = rid && !out;
        return out;
      }
    };
    {
      const E = ctx2.shared.eznChambers, set0 = E.set;
      E.set = function (m) { const r = set0.call(this, m); ctx2.shared.steps15.sync(); return r; };
    }
    const leafGeo = H2.uvWorldBox(new BoxGeometry(0.35, 19, 4.9), 0.35, 19, 4.9);
    leafGeo.translate(0, 9.5, 2.45);
    const Lm = [];
    const leaf = (x, y, z, a) => {
      const m = new Matrix4().makeRotationY(a);
      m.setPosition(x, y, z);
      Lm.push(m);
    };
    // 1.9.3: until now twelve more leaves stood here at x -40, 0 and 40 - where the court's gates were before 1.3.0 - buried in the
    // solid walls, and showed as ghost doors whenever a wall faded before the camera; they are gone. The four leaves of Josephus' side
    // gates of the women's court were in the walls too in Chazal's reading (the default): now they are in his layer (eznJ), below
    // GATE_K (fix-k, 23.11.2026; the coordinator, after the ox's walk of the first fruits: the two leaves stood 0.3 off shut - a gap of 0.64
    // amah between them, and every procession walked through them): open as the court's other gates (open 1.1), the way 5.6 amot wide
    leaf(228.5, 6, -5, -1.1);
    leaf(228.5, 6, 5, Math.PI + 1.1);
    const goldLeaves = new InstancedMesh(leafGeo, goldDoor, Lm.length);
    Lm.forEach((m, i) => goldLeaves.setMatrixAt(i, m));
    goldLeaves.instanceMatrix.needsUpdate = true;
    goldLeaves.castShadow = goldLeaves.receiveShadow = true;
    g.add(goldLeaves);
    {
      const Jm = [];
      for (const [x, z, a] of [[156, -67.5, HP - 0.35], [166, -67.5, -HP + 0.35], [156, 67.5, HP + 0.35], [166, 67.5, -HP - 0.35]]) { const m = new Matrix4().makeRotationY(a); m.setPosition(x, 6, z); Jm.push(m); }
      const jLeaves = new InstancedMesh(leafGeo, goldDoor, Jm.length);
      Jm.forEach((m, i) => jLeaves.setMatrixAt(i, m));
      jLeaves.instanceMatrix.needsUpdate = true;
      jLeaves.castShadow = jLeaves.receiveShadow = true;
      eznJ.add(jLeaves);
    }
    const bz = (geo, x, z, a) => {
      const m = new Mesh(geo, M2.bronze);
      m.position.set(x, 13.5, z);
      m.rotation.y = a;
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    };
    // NIKANOR_LEAVES_215: two bronze leaves stood here almost shut across the passage of Nikanor's gate (x 94.8, 22 degrees open), and two
    // across its wickets - left over from before the gate's own doors (H2.doors above, open in the gate's thickness since 1.9.5, as the
    // user asked: "לפי הדגם דלתות שער ניקנור סותמות את העזרה"). Found 16.11.2026 when the Levites of the morning demo walked through them.
    // They are gone; the gate's doors and its wickets are the ones above.
    void bz;
    // 1.5.0 (the user: "כל הלשכות - אייר למה היו משמשות"): a chamber is a HOLLOW room - a floor, three walls, a court-side wall with a door
    // (a cedar leaf ajar), a roof that "פתח את הלשכות" removes, and furniture that shows its use (the furnishers below; model choices).
    // (cx, cz) the room's centre, (w, d, h) its size, y0 its floor, door = {dx, dz}: the unit normal of the wall that holds the door.
    const cedarDark = M2.cedar.clone(); cedarDark.color.multiplyScalar(0.8);
    const room = (cx, cz, w, d, h, y0, door, name, ly, furnish, opts) => {
      const T = 1.2, DW = (opts && opts.doorW) || 3.6, DH = 7;   // KLI_SHIR_211: opts.doorW (a wider opening), opts.noLeaf, opts.noRoof
      const doors = Array.isArray(door) ? door : door ? [door] : [];   // 1.9.1: a room may have more than one door (המדיחין - to the mesibah)
      const fh = opts && opts.floorHole;   // 1.9.1: a pit in the floor (המדיחין)
      if (fh) boxHole(g, w, 0.3, d, M2.marble, cx, y0, cz, fh.x, fh.z, fh.w, fh.d);
      else H2.box(g, w, 0.3, d, M2.marble, cx, y0, cz);
      const sideWall = (nx, nz) => {   // the wall whose outer normal is (nx, nz)
        const along = nx ? d : w;
        const wx = cx + nx * (w / 2 - T / 2), wz = cz + nz * (d / 2 - T / 2);
        const dro = doors.find((dr) => dr.dx === nx && dr.dz === nz);
        if (dro) {
          const dof = dro.off || 0;   // CHAMBERS_EAST_N2: the door's middle, off the wall's middle (along the wall)
          for (const [a0, a1] of [[-along / 2, dof - DW / 2], [dof + DW / 2, along / 2]]) {
            const segW = a1 - a0, ctr = (a0 + a1) / 2;
            if (segW > 1e-3) H2.box(g, nx ? T : segW, h, nx ? segW : T, M2.stoneLight, wx + (nx ? 0 : ctr), y0, wz + (nx ? ctr : 0));
          }
          if (h - DH > 0.01) H2.box(g, nx ? T : DW, h - DH, nx ? DW : T, M2.stoneLight, wx + (nx ? 0 : dof), y0 + DH, wz + (nx ? dof : 0));                 // over the door
          if (opts && opts.noLeaf) return;
          const leafGeo = H2.uvWorldBox(new BoxGeometry(nx ? 0.25 : DW * 0.92, DH - 0.2, nx ? DW * 0.92 : 0.25), nx ? 0.25 : DW * 0.92, DH - 0.2, nx ? DW * 0.92 : 0.25);
          leafGeo.translate(nx ? 0 : DW * 0.46, (DH - 0.2) / 2, nx ? DW * 0.46 : 0);   // hinged at one jamb
          const leaf = new Mesh(leafGeo, cedarDark);
          leaf.position.set(wx - nx * (T / 2 + 0.15) - (nx ? 0 : DW / 2) + (nx ? 0 : dof), y0 + 0.3, wz - nz * (T / 2 + 0.15) - (nx ? DW / 2 : 0) + (nx ? dof : 0));
          leaf.rotation.y = (nx ? -nx : nz) * 0.6;   // ajar, into the room
          leaf.castShadow = leaf.receiveShadow = true;
          g.add(leaf);
        } else {
          H2.box(g, nx ? T : along, h, nx ? along : T, M2.stoneLight, wx, y0, wz);
        }
      };
      sideWall(1, 0); sideWall(-1, 0); sideWall(0, 1); sideWall(0, -1);
      const roof = opts && opts.noRoof ? null : H2.box(g, w + 1.4, 0.7, d + 1.4, M2.stoneSmooth, cx, y0 + h, cz);
      if (roof) ctx2.lishkotCut.push(roof);
      if (name) lbl(name, cx, ly || y0 + h + 3, cz, 3);
      if (furnish) furnish(cx, cz, y0 + 0.3, roof);
      return roof;
    };
    // CHAMBERS_EAST_N2: what build() adds to g (and the labels it adds) is turned by th about the vertical through (cx, cz) - a chamber furnished
    // with its door in the west wall, set with its door toward the gate (the two chambers of the Nikanor gate)
    const rotated = (cx, cz, th, build) => {
      const n0 = g.children.length, l0 = ctx2.labels.length;
      const r = build();
      const pg = new Group();
      pg.position.set(cx, 0, cz); pg.rotation.y = th;
      for (const o of g.children.slice(n0)) { g.remove(o); o.position.x -= cx; o.position.z -= cz; pg.add(o); }
      g.add(pg);
      const c = Math.cos(th), sn = Math.sin(th);
      for (let i = l0; i < ctx2.labels.length; i++) {
        const L = ctx2.labels[i];
        if (L && typeof L.x === "number" && typeof L.z === "number") { const dx = L.x - cx, dz = L.z - cz; L.x = cx + dx * c + dz * sn; L.z = cz - dx * sn + dz * c; }
      }
      return r;
    };
    // the six chambers "בעזרה" (Middot 5:3) stand INSIDE the court, against its long walls (until 1.4.0 the solid blocks straddled the wall;
    // a hollow room cannot - the wall would cut through it): their outer face at the wall's inner face (z +-65)
    // 1.9.1: the chambers stand on the floor of the court where they are - the priests' court (LV.KOH, 16; the pave over the podium, 13.35..16,
    // runs under them). Until 1.9.0 their floor was at 13.5, under that pave: every piece of furniture below 2.2 amot (the salting tubs,
    // the marble tables, the sacks, most of the salt) was buried in it and the mesibah's first steps with them. extraDoors - more doors
    const annex = (x, side, w, d, h, name, ly, furnish, extraDoors, opts) => room(x, side * (65 - d / 2), w, d, h, LV.KOH, [{ dx: 0, dz: -side }].concat(extraDoors || []), name, ly, furnish, opts);
    // ---- the furnishers (1.5.0)
    const whiteMat = new MeshStandardMaterial({ color: 0xf6f6f2, roughness: 1 });
    const hideMat = new MeshStandardMaterial({ color: 0x9a6b3c, roughness: 0.95 });
    const clothMat = new MeshStandardMaterial({ color: 0x7d93b5, roughness: 0.9 });
    // 1.9.1: the linen and the sacks / loaves glow a little (emissive) - they lie at the bottom of rooms 13-20 high, in the walls' shade
    const linenMat = new MeshStandardMaterial({ color: 0xf2ecdc, roughness: 0.9, emissive: 0x302b22 });
    const sackMat = new MeshStandardMaterial({ color: 0xb79a6a, roughness: 1, emissive: 0x2a1f10 });
    const darkMat = new MeshStandardMaterial({ color: 0x2a2622, roughness: 1 });
    // FILL_211 (stage ב, point 40; the user: "אכן למלא אבל עם מחשבה עמוקה ומלאה... אני רוצה ביצוע"): one standing figure at work in a
    // chamber (tm_people; its size and turn exact) - the figures, their places and what they hold: model choices (the cards say so)
    const fig211 = (x, z, yaw, y, kind, robe, s = 1.4, tone = 1, name = "chamberWorker") => { try { tm_people(ctx2).crowd(g, [[x, z, yaw]], { y, s, pose: "stand", kind, robe, tone: () => tone, exact: true, name }); } catch (_) {} };
    const ahead211 = (x, z, yaw, d) => [x + Math.sin(yaw) * d, z + Math.cos(yaw) * d];   // a point d in front of a figure
    const wheelAt = (wx, wy, wz, r, px = 1.45) => {   // 1.9.5: px - the posts' distance from the middle   // a wooden wheel standing on two posts, its axle along x (as the laver's mukhni)
      const wheel = new Mesh(new TorusGeometry(r, 0.12, 8, 28), M2.cedar);
      wheel.geometry.rotateY(HP); wheel.position.set(wx, wy, wz); wheel.castShadow = true; g.add(wheel);
      for (const rot of [0, Math.PI / 4, HP, Math.PI * 0.75]) {
        const geo = H2.uvWorldBox(new BoxGeometry(0.12, r * 2, 0.12), 0.12, r * 2, 0.12); geo.rotateX(rot);
        const sp = new Mesh(geo, M2.cedar); sp.position.set(wx, wy, wz); g.add(sp);
      }
      const axL = 3.2 * px / 1.45, axle = H2.cyl(g, 0.09, 0.09, axL, M2.cedar, wx, wy - axL / 2, wz); axle.rotation.z = HP;   // (cyl: y is the bottom - the centre lands at wy)
      for (const sx of [-1, 1]) H2.box(g, 0.35, wy - 13.8, 0.35, M2.cedar, wx + sx * px, 13.8, wz);
    };
    const F_GOLAH = (cx, cz, y, roof, k = 1) => {   // "בור קבוע והגלגל נתון עליו, ומשם מספיקים מים לכל העזרה" (Middot 5:4); 1.9.5: k - its size (1 until 1.9.4)
      const wh = k < 1 ? 4.2 : 5.2;   // the wheel's height over the floor
      H2.ring(g, 2.2 * k, 0.55 * k, M2.stoneSmooth, cx, y + 0.3 * k, cz);
      H2.cyl(g, 1.75 * k, 1.75 * k, 0.9, darkMat, cx, y - 0.45, cz);
      H2.cyl(g, 1.7 * k, 1.7 * k, 0.1, water, cx, y - 0.05, cz);
      wheelAt(cx, y + wh, cz, 1.4 * k, 1.45 * k);
      H2.cyl(g, 0.04, 0.04, wh - 1, cedarDark, cx + 1.2 * k, y + 1, cz);   // the rope, from the bucket to the wheel
      H2.cyl(g, 0.45 * Math.sqrt(k), 0.38 * Math.sqrt(k), 0.7, M2.bronze, cx + 1.2 * k, y + 0.35, cz);   // the bucket
      lbl("בור הגולה והגלגל", cx, y + wh + 3.4, cz, k < 1 ? 1.1 : 1.3);
    };
    const F_MELACH = (cx0, cz, y, roof, k = 1) => {   // "שם היו נותנים מלח לקרבן" (5:3) - a heap of salt and sacks
      // SALT_144_D: k - the spots along x drawn together about the middle (the room in the court of Israel's corner is 11.5 long, not 14)
      const XK = (x) => cx0 + (x - cx0) * k;
      // 1.9.1 (the user: "לשכת המלח - תוסיף ערמת מלח"): the heap was white on the white marble floor and hardly showed - now a large heap
      // of coarse, slightly grey salt with a glint, and a smaller one beside it
      const saltMat = new MeshStandardMaterial({ color: 0xe3e7ea, roughness: 0.45, metalness: 0.05, emissive: 0x1a1d20 });
      const cone = new Mesh(new ConeGeometry(3.2, 3.1, 28, 3), saltMat); cone.position.set(XK(cx0 - 1.8), y + 1.55, cz - 0.4); cone.castShadow = cone.receiveShadow = true; g.add(cone);
      const cone2 = new Mesh(new ConeGeometry(1.6, 1.5, 22, 2), saltMat); cone2.position.set(XK(cx0 + 1.4), y + 0.75, cz + 2.4); cone2.castShadow = cone2.receiveShadow = true; g.add(cone2);
      for (const [dx, dz, r] of [[3.2, -2.2, 0.3], [3.9, 0.3, -0.2], [3, 2.6, 0.5]]) { const sk = H2.box(g, 1.3, 1.5, 1, sackMat, XK(cx0 + dx), y, cz + dz); sk.rotation.y = r; }
      H2.box(g, 1.6, 0.5, 1.6, M2.cedar, XK(cx0 - 4.8), y, cz + 2.6);   // 1.8.0: in the 10-deep room
      lbl("ערמת המלח — ״שם היו נותנים מלח לקרבן״", cx0, y + 5.4, cz, 1.5);
      // FILL_211: a priest fills a bowl from the heap, and on a marble table by the north-west corner bowls of salt stand ready - to be
      // taken to the ramp, where the limbs were salted ("הלכו ונתנום מחצי הכבש ולמטה במערבו, ומלחום", Tamid 4:3)
      {
        const yw = Math.atan2(-2.7, 1.3), [bx, bz] = ahead211(XK(cx0 + 0.9), cz - 1.7, yw, 0.5);
        fig211(XK(cx0 + 0.9), cz - 1.7, yw, y, "kohen", 0xf1ede2, 1.4, 1, "saltPriest");
        const bowl = (x, yy, z) => { H2.cyl(g, 0.3, 0.2, 0.16, M2.bronze, x, yy, z, 14); H2.cyl(g, 0.24, 0.24, 0.04, saltMat, x, yy + 0.14, z, 14); };
        bowl(bx, y + 1.2, bz);
        H2.box(g, 2.2, 0.15, 1, M2.marble, XK(cx0 - 4.7), y + 1.05, cz - 3.1); for (const lx of [-0.95, 0.95]) for (const lz of [-0.4, 0.4]) H2.box(g, 0.14, 1.05, 0.14, M2.marble, XK(cx0 - 4.7) + lx, y, cz - 3.1 + lz);
        for (const dx of [-0.7, 0, 0.7]) bowl(XK(cx0 - 4.7) + dx, y + 1.2, cz - 3.1);
      }
    };
    const F_PARVAH = (cx, cz, y, roof) => {   // "שם היו מולחין עורות קדשים, ועל גגה היה בית הטבילה לכהן גדול ביום הכיפורים" (5:3)
      H2.box(g, 10, 0.3, 0.3, M2.cedar, cx, y + 6, cz - 2);   // the rail, hides hanging from it
      for (let i = 0; i < 4; i++) { const hd = H2.box(g, 1.9, 4.2, 0.12, hideMat, cx - 3.6 + i * 2.4, y + 1.8, cz - 2); hd.rotation.y = (i % 2) * 0.12 - 0.06; }
      for (const dx of [-2.6, 2.6]) H2.box(g, 3, 0.9, 2, M2.stoneSmooth, cx + dx, y, cz + 2.4);   // salting tubs
      H2.box(g, 2.6, 0.12, 1.6, whiteMat, cx - 2.6, y + 0.9, cz + 2.4);
      // FILL_211: on the east tub a hide spread out and salted, a priest at it, and a basket of salt beside him
      {
        H2.box(g, 2.4, 0.06, 1.5, hideMat, cx + 2.6, y + 0.9, cz + 2.4);
        H2.box(g, 1.3, 0.03, 0.9, whiteMat, cx + 2.3, y + 0.96, cz + 2.3);
        fig211(cx + 2.6, cz + 0.7, 0, y, "kohen", 0xf1ede2, 1.4, 2, "parvahPriest");
        H2.cyl(g, 0.45, 0.38, 0.7, M2.cedar, cx + 4.8, y, cz + 1, 12);
        H2.cyl(g, 0.4, 0.4, 0.05, whiteMat, cx + 4.8, y + 0.68, cz + 1, 12);
      }
      // the bath on the roof (Middot 5:3 "ועל גגה היה בית הטבילה לכהן גדול ביום הכפורים"). 1.9.1 (the user: "לשכת הפרוה... ובניית מקוה"):
      // a real bath - a stone tank built up on the roof, hollow, its water 3 amot deep ("אמה על אמה ברום שלש אמות", Eruvin 4b - the least;
      // drawn 2.4 x 2.4 inside, model choice), steps up to its rim outside and down into the water inside; and the linen sheet between him and
      // the people in the court ("הביאוהו לבית הפרוה, ובקדש היתה. פרסו סדין של בוץ בינו לבין העם", Yoma 3:6)
      const ry = roof.position.y + 0.7;
      const IW = 2.4, WT = 0.6, OW = IW + 2 * WT, TH = 3.4;
      H2.box(g, OW, 0.2, OW, M2.stoneLight, cx, ry, cz);
      for (const s2 of [-1, 1]) {
        H2.box(g, OW, TH, WT, M2.stoneLight, cx, ry, cz + s2 * (IW / 2 + WT / 2));
        H2.box(g, WT, TH, IW, M2.stoneLight, cx + s2 * (IW / 2 + WT / 2), ry, cz);
      }
      const wat = H2.box(g, IW, 3, IW, water, cx, ry + 0.2, cz);
      for (let i = 0; i < 6; i++) H2.box(g, 0.4, TH - 0.2 - i * 0.5, 0.9, M2.stoneSmooth, cx + IW / 2 - 0.2 - i * 0.4, ry + 0.2, cz + IW / 2 - 0.45);   // the steps down into the water
      H2.stairs(g, { width: 1.4, totalRise: TH, steps: 7, dir: "W", x: cx + OW / 2 + 3.5, y: ry, z: cz + 0.6, tread: 0.5 });   // up to the rim, from the east
      {
        const sheetMat = new MeshStandardMaterial({ color: 0xf6f1e4, roughness: 1, transparent: true, opacity: 0.55, side: DoubleSide, depthWrite: false });
        const zS = cz - OW / 2 - 0.7;
        for (const dx of [-3, 3]) H2.box(g, 0.14, 5.2, 0.14, M2.cedar, cx + dx, ry, zS);
        const sheet = new Mesh(new PlaneGeometry(6, 4.4), sheetMat);
        sheet.position.set(cx, ry + 2.8, zS);
        sheet.userData.noPick = true;
        g.add(sheet);
        lbl("סדין של בוץ — ״פרסו סדין של בוץ בינו לבין העם״", cx, ry + 6.4, zS - 0.5, 1.1);
      }
      // 1.9.1 (the user: "גם את גג הטבילה אפשר לעשות שקוף משהו"): the Parvah's roof - the floor of the high priest's bath - is half-clear
      // and stays (no longer in the chambers' pill), so the bath on it and the room under it are both seen
      { const k = ctx2.lishkotCut.indexOf(roof); if (k >= 0) ctx2.lishkotCut.splice(k, 1); }
      roof.material = roof.material.clone();
      roof.material.transparent = true; roof.material.opacity = 0.38; roof.material.depthWrite = false;
      roof.castShadow = false;
      lbl("בית הטבילה שעל הגג — לכהן גדול ביום הכיפורים", cx + 1, ry + 4.4, cz + 1.5, 1.2);
      lbl("מולחין עורות קדשים", cx, y + 8.2, cz, 1.3);
    };
    const F_MADICHIN = (cx, cz, y) => {   // "שם היו מדיחין קרבי הקדשים" (5:3); Tamid 4:2 "והכרס מדיחין אותה בבית מדיחין כל צרכה"
      // 1.9.1 (the user: "לשכת המדיחין — בור מים להדחה, ופתח למסיבה לפרוה"): a stone-lined pit of water in the floor (MPIT: 2.4 x 1.4 inside,
      // its water 0.7 under the floor), a rim round it, a ladle and a pail; the two marble tables kept clear of the door to the mesibah (east).
      // The pit, its size and the water's way to it - model choice
      for (const dx of [-3.2, 2.6]) { H2.box(g, 4, 0.25, 2, M2.marble, cx + dx, y + 1.2, cz - 2.6); for (const lx of [-1.7, 1.7]) for (const lz of [-0.8, 0.8]) H2.box(g, 0.2, 1.2, 0.2, M2.marble, cx + dx + lx, y, cz - 2.6 + lz); }
      const px = MPIT.x, pz = MPIT.z, iw = MPIT.w - 0.8, id = MPIT.d - 0.8, bot = y - 2.4;
      H2.box(g, MPIT.w, 0.2, MPIT.d, M2.stoneSmooth, px, bot - 0.2, pz);
      H2.box(g, MPIT.w, bot - 0.2, MPIT.d, M2.stone, px, 0, pz);   // CHAMBERS_EAST_N2: the room stands on the court of Israel's floor now - the podium's shaft under the pit is filled
      for (const s2 of [-1, 1]) {
        H2.box(g, MPIT.w, y - bot, 0.4, M2.stoneSmooth, px, bot, pz + s2 * (id / 2 + 0.2));
        H2.box(g, 0.4, y - bot, id, M2.stoneSmooth, px + s2 * (iw / 2 + 0.2), bot, pz);
        H2.box(g, MPIT.w + 0.5, 0.25, 0.3, M2.stoneSmooth, px, y, pz + s2 * (MPIT.d / 2 + 0.15));
        H2.box(g, 0.3, 0.25, MPIT.d, M2.stoneSmooth, px + s2 * (MPIT.w / 2 + 0.15), y, pz);
      }
      H2.box(g, iw, 1.7, id, water, px, bot, pz);
      H2.cyl(g, 0.4, 0.32, 0.6, M2.bronze, px - 2.3, y, pz + 0.3, 12);                 // the pail
      H2.box(g, 1.4, 0.06, 0.12, M2.cedar, px + 1.9, y + 0.28, pz - 0.8);              // the ladle's handle
      H2.cyl(g, 0.22, 0.18, 0.18, M2.bronze, px + 1.15, y + 0.2, pz - 0.8, 10);
      lbl("בור מים — מדיחין קרבי קדשים", px, y + 4.6, pz, 1.3);
      // FILL_211: a priest at the pit's north rim washes the rumen - "והכרס מדיחין אותה בבית מדיחין כל צרכה" (Tamid 4:2; the innards
      // were washed on the marble tables between the pillars, by the slaughter place - not here)
      {
        fig211(px - 0.4, pz - MPIT.d / 2 - 1.2, 0, y, "kohen", 0xf1ede2, 1.4, 1, "madichinPriest");
        const organM = new MeshStandardMaterial({ color: 0xc9a08c, roughness: 0.75 });
        const k1 = new Mesh(new SphereGeometry(1, 14, 10), organM); k1.scale.set(0.42, 0.26, 0.32); k1.position.set(px - 0.4, y + 1.05, pz - MPIT.d / 2 - 0.62); g.add(k1);
        const k2 = new Mesh(new SphereGeometry(1, 12, 8), organM); k2.scale.set(0.26, 0.2, 0.22); k2.position.set(px - 0.12, y + 0.98, pz - MPIT.d / 2 - 0.5); g.add(k2);
        ctx2.labels.push({ text: "״והכרס מדיחין אותה בבית מדיחין כל צרכה״ (תמיד ד, ב)", x: px - 0.4, y: y + 3.6, z: pz - MPIT.d / 2 - 0.9, size: 0.9, far: 140 });
      }
      lbl("פתח למסיבה — לגג בית הפרוה", cx + 6.2, y + 8.4, cz, 1.1);
    };
    const F_ETZ = (cx, cz, y) => {   // the high priest's dwelling (Yoma 10a: a mezuzah, "שהיה בה בית דירה לכהן גדול")
      H2.box(g, 4.2, 1, 2.2, M2.cedar, cx - 12, y, cz);
      H2.box(g, 4, 0.5, 2, clothMat, cx - 12, y + 1, cz);
      H2.box(g, 1, 0.5, 2, linenMat, cx - 10.4, y + 1.5, cz);                     // the pillow
      H2.box(g, 3, 0.2, 1.8, M2.cedar, cx, y + 1.6, cz); for (const lx of [-1.3, 1.3]) for (const lz of [-0.7, 0.7]) H2.box(g, 0.18, 1.6, 0.18, M2.cedar, cx + lx, y, cz + lz);
      for (const dx of [-2.6, 2.6]) H2.box(g, 1, 1, 1, M2.cedar, cx + dx, y, cz + 1.8);   // stools
      H2.box(g, 3, 2.6, 1.4, cedarDark, cx + 12, y, cz);                                 // a chest
      lbl("דירת כהן גדול בשבעת הימים", cx, y + 7, cz, 1.3);
    };
    // 1.9.1 (the user: "למה לא רואים את פנים לשכת פנחס המלביש ולשכת עושי חביתין?"): each chamber has its own place, seen from straight
    // above with the roofs open, and its furniture is larger and lighter, to read at the bottom of a room 19.5 high
    const F_PINCHAS = (cx, cz, y) => {   // "לשכת פנחס המלביש" - the priestly garments (Shekalim 5:1 "פנחס על המלבוש"; Bartenura there: he
      // dressed the priests and kept the garments "בלשכות העשויות לכך"); the four garments of a common priest - tunic, breeches, belt, hat
      // KLI_SHIR_211: the door is now in the WEST wall (to the court; 2.0.1 and before - the east wall, to the women's court): the cupboard
      // stands against the east wall, clear of the windows' panel on the north side (its length 4.6, until 2.0.1 6.4 against the west wall), and
      // the rail of the hanging tunics runs east-west along the south side - the way in from the door stays free
      const shelfX = cx + 2.7, CZ = cz + 0.8, CL = 4.6;   // PINCHAS_195: in the room, its back on the wall's inner face (cx + 3.3), not inside the wall
      // PINCHAS_195 (the presentations' scan, 11.11.2026: the cupboard was one solid box, and the garments on its shelves were inside
      // it - never seen): the cupboard is a back and two sides, open to the room and from above
      const cupDark = new MeshStandardMaterial({ color: 0x4a2f1d, roughness: 0.9 });   // dark, so that the white garments are seen against it
      H2.box(g, 0.14, 4.2, CL, cupDark, shelfX + 0.53, y, CZ);
      for (const ez of [-CL / 2 + 0.06, CL / 2 - 0.06]) H2.box(g, 1.2, 4.2, 0.12, cupDark, shelfX, y, CZ + ez);
      for (const sy of [0.9, 1.9, 2.9, 3.9]) H2.box(g, 1.3, 0.12, CL + 0.1, M2.cedar, shelfX - 0.05, y + sy, CZ);
      for (let i = 0; i < 4; i++) for (const sy of [0.98, 1.98]) H2.box(g, 0.9, 0.35, 1, linenMat, shelfX - 0.1, y + sy, CZ - 1.75 + i * 1.17);   // folded tunics and breeches
      for (let i = 0; i < 5; i++) H2.cyl(g, 0.32, 0.36, 0.42, linenMat, shelfX - 0.1, y + 2.98, CZ - 1.84 + i * 0.92, 12);                       // the hats
      const beltCols = [0x3b5fa8, 0x8a2f6b, 0xb3262e, 0xf2ecdc];   // the belts in colours - a model choice (whether a common priest's belt was of kilayim is a dispute, Yoma 12b; not drawn as a reading)
      for (let i = 0; i < 5; i++) {
        const bm = new MeshStandardMaterial({ color: beltCols[i % 4], roughness: 0.9 });
        H2.box(g, 0.9, 0.12, 0.8, bm, shelfX - 0.1, y + 3.98, CZ - 1.84 + i * 0.92);
      }
      const RZ = cz + 2.75 * Math.sign(cz || 1) * -1;   // the rail's line: along the room's side away from the windows (the south side for this room)
      // (the room's west 2.5 amot, x < cx - 2, are inside the court's east wall - 5 thick, x 91..96: nothing stands there)
      H2.box(g, 3.0, 0.25, 0.25, M2.cedar, cx - 0.1, y + 5.2, RZ);                          // the rail, the tunics hanging from it
      for (const lx of [-1.4, 1.4]) H2.box(g, 0.25, 5.2, 0.25, M2.cedar, cx - 0.1 + lx, y, RZ);
      for (let i = 0; i < 3; i++) H2.box(g, 0.85, 3.8, 0.2, linenMat, cx - 1.0 + i * 0.9, y + 1.3, RZ);
      lbl("בגדי כהונה — כתונת, מכנסים, אבנט ומגבעת", cx, y + 9, cz, 0.85);   // NOTE 9 (U-57, 1): smaller - the walls cut it at both ends
      // PINCHAS_WINDOWS_211 (stage ב, point 38; the user: V, "+ table with a white garment"): the Rambam, Klei HaMikdash 8:8-9 (338:130-131):
      // "וששה ותשעים חלון היו במקדש להניח בהן הבגדים ארבעה חלונות לכל משמר. ושם כל משמר כתוב על חלונותיו. וכלן סתומות... כל המכנסים
      // בחלון אחד וכתוב עליו מכנסים. וכל האבנטים בחלון אחד וכתוב עליו אבנט. וכן המצנפות כלן בחלון אחד. והכתנות כלן בחלון אחד". Their
      // place (the review, S2-01): the Tiferet Yisrael puts them IN THIS CHAMBER - "שהיה שם צ״ו ארגזים תוך הכותלים... ד׳ ארגזים לכל משמר
      // ומשמר" (Tzurat Beit HaMikdash, siman 20; 6029:51); the Rosh (2224:267) and the Raavad (in Melechet Shlomo, 1202:242) - "בלשכת
      // הגזית בחומה". The model follows the Tiferet Yisrael; on the north wall, the windows' size and the watches' names as written
      // (the order of the lots, I Chronicles 24:7-18, 38:795-806) - model choices. By the door, a table with a white tunic folded on it.
      {
        const W24 = ["יהויריב", "ידעיה", "חרם", "שערים", "מלכיה", "מימן", "הקוץ", "אביה", "ישוע", "שכניהו", "אלישיב", "יקים", "חפה", "ישבאב", "בלגה", "אמר", "חזיר", "הפצץ", "פתחיה", "יחזקאל", "יכין", "גמול", "דליהו", "מעזיהו"];
        ctx2.shared.watches24 = W24;   // WINDOW_NAMES_H: the one list of the watches' names (also the knives' windows, 50-heichal.js)
        const KINDS = ["מכנסים", "כתונת", "מצנפת", "אבנט"];
        const cv = document.createElement("canvas"); cv.width = 1536; cv.height = 1024;
        const c2 = cv.getContext("2d");
        c2.fillStyle = "#cdbb98"; c2.fillRect(0, 0, 1536, 1024);
        c2.direction = "rtl"; c2.textAlign = "center"; c2.textBaseline = "middle";
        for (let i = 0; i < 24; i++) {
          const col = 5 - (i % 6), row = Math.floor(i / 6), gx = col * 256, gy = row * 256;   // right to left, as the lots' order is read
          c2.fillStyle = "#3a2a14"; c2.font = "bold 40px 'David','Frank Ruhl Libre','Times New Roman',serif";
          c2.fillText(W24[i], gx + 128, gy + 32);
          for (let k = 0; k < 4; k++) {
            const dx = gx + 18 + (1 - (k % 2)) * 116, dy = gy + 62 + Math.floor(k / 2) * 94;
            // WINDOWS_OPEN_211 (the review, S2-16; the user, 15.11.2026 18:12: "7. א"): the Rambam goes on (KH 8:8, 338:130) - "וכשיכנסו
            // אנשי משמר לעבודה בשבת שלהן פותחין חלונותיהן כל ימי שבתן ונוטלין הכלים. וכשיצאו מחזירין הבגדים לחלונותיהן וסותמין": the four
            // windows of ONE watch stand open - the first, Yehoyariv (which watch - a model choice): the hollow, the white garments in
            // it, and its door swung aside
            if (i === 0) {
              c2.fillStyle = "#24160a"; c2.fillRect(dx, dy, 104, 84);                                   // the open window's hollow
              c2.fillStyle = "#f3efe4"; c2.fillRect(dx + 14, dy + 42, 76, 34);                          // the folded garments in it
              c2.strokeStyle = "#b9b19b"; c2.lineWidth = 2; c2.strokeRect(dx + 14, dy + 42, 76, 34);
              c2.beginPath(); c2.moveTo(dx + 14, dy + 59); c2.lineTo(dx + 90, dy + 59); c2.stroke();
              c2.fillStyle = "#8a5a34"; c2.fillRect(dx - 9, dy - 2, 11, 88);                            // its door, swung open - seen from its edge
              c2.strokeStyle = "#2c1c0c"; c2.lineWidth = 4; c2.strokeRect(dx + 2, dy + 2, 100, 80);
              c2.fillStyle = "#f0e2b4"; c2.font = "bold 24px 'David','Frank Ruhl Libre','Times New Roman',serif";
              c2.fillText(KINDS[k], dx + 52, dy + 24);
              continue;
            }
            c2.fillStyle = "#6b4426"; c2.fillRect(dx, dy, 104, 84);          // the closed window's door
            c2.strokeStyle = "#2c1c0c"; c2.lineWidth = 4; c2.strokeRect(dx + 2, dy + 2, 100, 80);
            c2.fillStyle = "#e8d8a8"; c2.font = "bold 24px 'David','Frank Ruhl Libre','Times New Roman',serif";
            c2.fillText(KINDS[k], dx + 52, dy + 30);
            c2.fillStyle = "#c9a23a"; c2.beginPath(); c2.arc(dx + 52, dy + 62, 6, 0, Math.PI * 2); c2.fill();   // the knob
          }
        }
        const tx = new CanvasTexture(cv);
        tx.colorSpace = SRGBColorSpace;
        tx.anisotropy = 4;
        const pw = 6.0, ph = 4.0;
        const panel = new Mesh(new PlaneGeometry(pw, ph), new MeshStandardMaterial({ map: tx, roughness: 0.85 }));
        panel.position.set(cx + 0.9, y + 5.9 + ph / 2, cz - 2.2);   // before the north side's inner face (a block stands there 1 amah into the room), facing the room (+z)
        panel.userData.noPick = true;
        g.add(panel);
        H2.box(g, pw + 0.3, 0.18, 0.2, M2.cedar, cx + 0.9, y + 5.75, cz - 2.13);         // a ledge under the windows
        lbl("ששה ותשעים חלון — ארבעה לכל משמר (רמב״ם כלי המקדש ח, ח–ט)", cx, y + 11.2, cz - 1.6, 0.8);   // NOTE 9: the window's edge cut its first words
        ctx2.labels[ctx2.labels.length - 1].far = 60;   // LABEL_PAIRS_S1 (scan 1, finding 5): a caption of the room's inside - not from afar, where it lay on the chamber's own name (ten views)
        // the table by the door (KLI_SHIR_211: the door west - the table east of the way in, under the windows), a white tunic folded on it
        const tX = cx - 0.1, tZ = cz - 1.5;
        H2.box(g, 1.7, 0.12, 1.1, M2.cedar, tX, y + 1.35, tZ);
        for (const [lx, lz] of [[-0.7, -0.42], [0.7, -0.42], [-0.7, 0.42], [0.7, 0.42]]) H2.box(g, 0.12, 1.35, 0.12, M2.cedar, tX + lx, y, tZ + lz);
        H2.box(g, 1.0, 0.16, 0.75, linenMat, tX, y + 1.47, tZ);
        H2.box(g, 0.8, 0.1, 0.6, linenMat, tX + 0.05, y + 1.63, tZ - 0.02);
      }
    };
    const F_CHAVITIN = (cx, cz, y) => {   // "לשכת עושי חביתין" - the high priest's daily meal offering (Tamid 1:3; Menachot 4:5), "על מחבת בשמן
      // תעשה" (Bartenura Middot 1:4); Tiferet Yisrael there: in it they kneaded and baked the twelve loaves - half in the morning, half at dusk
      // CHAVITIN_211 (stage ב, point 39; the user: "תעשה גם צורת טגון"): Menachot 50b (131:1746) "חביתי כהן גדול, כיצד עושין אותן? רבי
      // חייא בר אבא אמר רבי יוחנן: אופה, ואחר כך מטגנה. רבי אסי אמר רבי חנינא: מטגנה, ואחר כך אופה". The oven stands open - hollow,
      // embers at its bottom and a loaf stuck to its inner wall (until 2.0.1 a solid drum with a dark lid) - and by the west wall a stove
      // of bricks with the pan (מחבת) of oil and a loaf frying in it; the numbers over them and the maker's place follow the reading
      // (ctx2.shared.chavitinOrder.set("bake" | "fry"); layers chavBake / chavFry). The maker - a PRIEST (CHAVITIN_KOHEN_211, below;
      // until the review of 15.11.2026 a Levite, after I Chronicles 9:31). The stove, the pan and the figure's place: model choices. (The
      // south strip of this room, z > cz + 2.25, is taken by the north partition of the women's court's corner chamber - nothing stands
      // there.) KLI_SHIR_211: the room on the Israelite court's floor, its door WEST (to the court) - the stove by the EAST wall, its fire's
      // mouth to the room (west), the table and the loaves along the north side, the way in from the door free (until 2.0.1: the door east,
      // the stove by the west wall)
      {
        const ovX = cx + 1.75, ovZ = cz - 1.7;   // (the room's west 2.5 amot, x < cx - 2, are inside the court's east wall: nothing stands there)
        const ovG = new CylinderGeometry(1.3, 1.5, 2.2, 28, 1, true); ovG.translate(0, 1.1, 0);
        const ovOut = new Mesh(ovG, clay); ovOut.position.set(ovX, y, ovZ); ovOut.castShadow = ovOut.receiveShadow = true; g.add(ovOut);   // the oven's outer face
        const inMat = new MeshStandardMaterial({ color: 0x6b4428, roughness: 1, side: BackSide });
        const inG = new CylinderGeometry(1.02, 1.2, 2.2, 28, 1, true); inG.translate(0, 1.1, 0);
        const ovIn = new Mesh(inG, inMat); ovIn.position.set(ovX, y, ovZ); ovIn.receiveShadow = true; g.add(ovIn);                    // its inner face
        const rimG = new RingGeometry(1.02, 1.3, 28); rimG.rotateX(-Math.PI / 2);
        const rimM = new Mesh(rimG, clay); rimM.position.set(ovX, y + 2.2, ovZ); g.add(rimM);                                             // its lip
        const emb = new Mesh(new CircleGeometry(1.15, 24), new MeshStandardMaterial({ color: 0x3a1a0c, emissive: 0xb8440f, emissiveIntensity: 0.9, roughness: 1 }));
        emb.geometry.rotateX(-Math.PI / 2); emb.position.set(ovX, y + 0.35, ovZ); g.add(emb);                                           // the embers at its bottom
        // a loaf on the inner wall - on the side away from the room's south (where the eye comes from), so that it shows over the lip
        const lw = new Mesh(new CylinderGeometry(0.36, 0.36, 0.07, 14), sackMat);
        lw.geometry.rotateX(Math.PI / 2);
        const ang = Math.atan2(0.35, -0.94);   // its direction from the oven's middle: north, a little east
        lw.position.set(ovX + Math.sin(ang) * 1.04, y + 1.45, ovZ + Math.cos(ang) * 1.04); lw.rotation.y = ang; g.add(lw);
        const sx = cx + 2.55, sz = cz + 1.3, brick = M2.stone || clay;
        H2.box(g, 1.1, 1.2, 1.1, brick, sx, y, sz);                                          // the stove
        H2.box(g, 0.05, 0.32, 0.75, darkMat, sx - 0.56, y + 0.28, sz);                       // its fire's mouth, to the room
        const fireM = new MeshBasicMaterial({ color: 0xff7a1a });
        const fm = new Mesh(new BoxGeometry(0.06, 0.2, 0.6), fireM); fm.position.set(sx - 0.59, y + 0.44, sz); g.add(fm);
        const panM = M2.bronze || darkMat;
        H2.cyl(g, 0.55, 0.48, 0.2, panM, sx, y + 1.2, sz, 18);                                // the pan
        const oil = new Mesh(new CylinderGeometry(0.5, 0.5, 0.02, 18), new MeshStandardMaterial({ color: 0xc9a227, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85 }));
        oil.position.set(sx, y + 1.37, sz); g.add(oil);
        H2.cyl(g, 0.32, 0.32, 0.07, sackMat, sx, y + 1.37, sz, 12);                          // a loaf in the oil
        H2.box(g, 0.6, 0.06, 0.12, panM, sx - 0.85, y + 1.37, sz);                            // the handle, to the maker
        const chavBake = new Group(), chavFry = new Group();
        chavFry.visible = false;
        g.add(chavBake, chavFry);
        ctx2.layers = ctx2.layers || {};
        ctx2.layers.chavBake = chavBake; ctx2.layers.chavFry = chavFry;
        try {
          const PPc = tm_people(ctx2);
          // CHAVITIN_KOHEN_211 (the review, S2-02; the user, 15.11.2026 18:12: "כהן וציין בכרטיס לד.הימים"): the makers are PRIESTS - the
          // Mefaresh on Tamid 28a (2105:144), of "העמידו עושי חבתים": "מאותן כהנים עושי חביתים"; the Levite of I Chronicles 9:31
          // ("ומתתיה מן הלוים... באמונה על מעשה החבתים") is the one appointed over the work - both are said in the card. Until this fix: a Levite.
          PPc.crowd(chavBake, [[cx - 0.3, cz - 0.7, Math.atan2(ovX - cx + 0.3, ovZ - cz + 0.7)]], { y, s: 1.4, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => 1, name: "chavitinMaker" });
          PPc.crowd(chavFry, [[sx - 1.3, sz - 1.0, Math.atan2(1.3, 1.0)]], { y, s: 1.4, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => 1, name: "chavitinMaker" });
        } catch (_) {}
        ctx2.labels.push({ text: "1 · אפייה", x: ovX, y: y + 5.6, z: ovZ, size: 0.6, box: true, rim: "#c98a3c", layer: "chavBake" },
          { text: "2 · טיגון במחבת", x: sx - 1.5, y: y + 3.9, z: sz, size: 0.6, box: true, rim: "#c98a3c", layer: "chavBake" },
          { text: "1 · טיגון במחבת", x: sx - 1.5, y: y + 3.9, z: sz, size: 0.6, box: true, rim: "#3f9a55", layer: "chavFry" },
          { text: "2 · אפייה", x: ovX, y: y + 5.6, z: ovZ, size: 0.6, box: true, rim: "#3f9a55", layer: "chavFry" });
        ctx2.shared.chavitinOrder = { mode: "bake", set(m) { this.mode = m === "fry" ? "fry" : "bake"; chavBake.visible = this.mode === "bake"; chavFry.visible = this.mode === "fry"; return this.mode; } };
      }
      // the marble table and the twelve loaves (KLI_SHIR_211: along the north side, west of the oven - three piles of four; until 2.0.1 a longer
      // table across the room's south part, the loaves in two rows)
      H2.box(g, 2.0, 0.2, 1.4, M2.marble, cx - 0.9, y + 1.3, cz - 2.45); for (const lx of [-0.82, 0.82]) for (const lz of [-0.55, 0.55]) H2.box(g, 0.18, 1.3, 0.18, M2.marble, cx - 0.9 + lx, y, cz - 2.45 + lz);
      for (let i = 0; i < 12; i++) H2.cyl(g, 0.3, 0.3, 0.1, sackMat, cx - 0.9 + (Math.floor(i / 4) - 1) * 0.63, y + 1.5 + (i % 4) * 0.1, cz - 2.45, 12);   // the twelve loaves
      H2.cyl(g, 0.35, 0.5, 1.2, clay, cx - 0.4, y, cz + 1.75, 12);                          // the oil jar
      H2.cyl(g, 0.6, 0.7, 1.3, sackMat, cx + 0.9, y, cz + 1.55, 10);                         // the flour
      lbl("חביתי כהן גדול — שתים עשרה חלות על מחבת", cx, y + 13, cz, 1.2);   // CHAVITIN_211: 13 over the floor (9 until 2.0.1) - over the eye of the views inside
      ctx2.labels[ctx2.labels.length - 1].far = 60;   // LABEL_PAIRS_S1 (finding 5): as the windows' caption in לשכת פנחס המלביש - not from afar (ten views)
    };
    // KLI_SHIR_211: the chamber of the instruments under each of the gate's chambers (Middot 2:6 "ששם הלוים נותנים כנורות ונבלים ומצלתים
    // וכל כלי שיר"): lyres hanging on pegs along the west wall, harps standing by the side toward the steps, cymbals on a table, and a Levite
    // putting a lyre in its place. The room's strip toward the women's court's corner chamber (|z| > |cz| + 2.25) is taken by its partition
    // (as in the chambers above). The instruments' forms and numbers - model choices (the lyre as the morning demo's, 55-tamid.js)
    const strMat = new MeshStandardMaterial({ color: 0xece2c6, roughness: 0.6 });
    const lyreG = () => {   // a kinor: a sound box, two arms and a yoke, seven strings; its face toward +x
      const k = new Group();
      const bx = new Mesh(new BoxGeometry(0.12, 0.45, 0.52), M2.cedar); bx.position.y = 0.22; k.add(bx);
      for (const sgn of [-1, 1]) { const a = new Mesh(new CylinderGeometry(0.028, 0.034, 0.74, 6), M2.cedar); a.position.set(0, 0.8, sgn * 0.25); a.rotation.x = sgn * 0.14; k.add(a); }
      const yk = new Mesh(new CylinderGeometry(0.026, 0.026, 0.68, 6), M2.cedar); yk.rotation.x = HP; yk.position.y = 1.15; k.add(yk);
      for (let i = 0; i < 7; i++) { const st = new Mesh(new BoxGeometry(0.006, 0.7, 0.006), strMat); st.position.set(0.065, 0.8, -0.18 + i * 0.06); k.add(st); }
      return k;
    };
    const harpG = () => {   // a nevel - larger: an upright pillar, a sound box along its foot, a neck from the pillar's head down to the box's end, ten strings
      const k = new Group();
      const pil = new Mesh(new CylinderGeometry(0.05, 0.06, 1.9, 8), M2.cedar); pil.position.set(0, 0.95, 0); k.add(pil);
      const box = new Mesh(new BoxGeometry(0.22, 0.26, 1.0), M2.cedar); box.position.set(0, 0.13, 0.5); k.add(box);
      const nk = new Mesh(new CylinderGeometry(0.04, 0.05, 1.32, 8), M2.cedar); nk.position.set(0, 1.35, 0.5); nk.rotation.x = Math.atan2(1.0, -0.9); k.add(nk);
      for (let i = 0; i < 10; i++) { const zz = 0.08 + i * 0.09, top = 1.9 - (zz / 1.0) * 0.9, len = top - 0.26; const st = new Mesh(new BoxGeometry(0.006, len, 0.006), strMat); st.position.set(0, 0.26 + len / 2, zz); k.add(st); }
      return k;
    };
    // LOAD_211 (stage ג, the load time): many small pieces of one material baked into one mesh - the instruments were ~90 pieces a room
    const bake211 = (tmp, parent) => {
      tmp.updateMatrixWorld(true);
      const byMat = new Map();
      tmp.traverse((o) => { if (o.isMesh) { const k = o.material; if (!byMat.has(k)) byMat.set(k, []); byMat.get(k).push(o.geometry.clone().applyMatrix4(o.matrixWorld)); } });
      for (const [mat, list] of byMat) { const m = new Mesh(mergeGeometries(list), mat); m.castShadow = m.receiveShadow = true; m.userData.noPick = true; parent.add(m); }
    };
    const F_KLISHIR = (cx, cz, y) => {
      const sg = Math.sign(cz) || 1, inZ = (f) => cz - sg * f;   // inZ(f): f amot from the room's middle toward the steps
      // KLI_DEEP_211: the room is twenty long now (x 82.5..102.5) - its west end under the floor of the court of Israel. The lyres hang at
      // that end, their faces to the opening; the harps stand in the deep part, by the long wall on the steps' side; the cymbals' table
      // stays by the opening (the strip |z| > |cz| + 2.25 there is taken by the corner chamber's partition); the Levite at the pegs.
      const xW = KDEEP.x0 + 1.2, xE = KDEEP.x1;   // the west wall's inner face; the opening
      const tmp = new Group();   // LOAD_211: the instruments are built here and baked into two meshes (wood, strings)
      // MALBEN_B2 (fix-b2, 22.11.2026 - the user's decision 30): instead of the pegs on the wall, "מלבני בני לוי" (Kelim 18:3, 91:162 -
      // "ומלבני בני לוי טהורין"); the Rambam's commentary there (558:316): "עץ מרובע ארוך מורכב על שני נצבים (על זאת הצורה) יתלו בו הלוים
      // מיני הכלים אשר יאמר עליהן השיר בכל יום". A square beam on two uprights, standing along the west wall; the lyres hang from it on
      // short hooks. Its length, height and distance from the wall - model choices.
      const xM = xW + 0.55;
      for (const sd of [-1, 1]) H2.box(g, 0.2, 3.2, 0.2, M2.cedar, xM, y, cz + sd * 2.95);         // the two uprights ("שני נצבים")
      H2.box(g, 0.22, 0.22, 6.3, M2.cedar, xM, y + 2.98, cz);                                    // the long square beam ("עץ מרובע ארוך")
      for (let i = 0; i < 6; i++) {
        const z = cz - 2.125 + i * 0.85;
        H2.box(g, 0.05, 0.12, 0.05, M2.bronze, xM, y + 2.86, z);                               // a hook
        const k = lyreG(); k.position.set(xM, y + 1.7, z); k.rotation.z = -0.03; tmp.add(k);
      }
      lbl("מלבן בני לוי — ״עץ מרובע ארוך מורכב על שני נצבים״ (רמב״ם, פירוש המשניות כלים יח, ג)", xM + 0.6, y + 4.3, cz, 0.75);
      for (const dx of [4.2, 7.0]) { const k = harpG(); k.position.set(xW + dx, y, inZ(2.3)); k.rotation.y = sg > 0 ? 0 : Math.PI; tmp.add(k); }   // two harps by the long wall on the steps' side
      bake211(tmp, g);
      // a table with the cymbals - two pairs - by the opening
      const tX = xE - 2.9, tZ = inZ(-1.0);
      H2.box(g, 1.6, 0.12, 1.0, M2.cedar, tX, y + 1.2, tZ);
      for (const [lx, lz] of [[-0.68, -0.38], [0.68, -0.38], [-0.68, 0.38], [0.68, 0.38]]) H2.box(g, 0.1, 1.2, 0.1, M2.cedar, tX + lx, y, tZ + lz);
      for (const [ox, oz] of [[-0.42, -0.18], [-0.1, 0.2], [0.3, -0.16], [0.5, 0.22]]) {
        H2.cyl(g, 0.2, 0.2, 0.03, M2.bronze, tX + ox, y + 1.33, tZ + oz, 18);
        const boss = new Mesh(new SphereGeometry(0.045, 8, 6), M2.bronze); boss.position.set(tX + ox, y + 1.37, tZ + oz); g.add(boss);
      }
      fig211(xW + 1.7, inZ(0.4), -HP, y, "levi", 0x8f8468, 1.4, 1, "klishirLevite");   // facing the pegs
    };
    // 1.8.0 (the user: "בית המוקד — למה השער לא מצויר?"): THE TWO GATES of the house (Middot 1:7 "שנים שערים היו לבית המוקד, אחד פתוח
    // לחיל ואחד פתוח לעזרה"), each a gate as the others - 10 wide, 20 high ("כל הפתחים והשערים שהיו שם גבהן עשרים אמה ורחבן עשר אמות", 2:3) -
    // with gold leaves ajar; in a leaf of the court's gate R. Yehuda's wicket ("זה שהיה פתוח לעזרה, פשפש קטן היה לו, שבו נכנסין לבלש את
    // העזרה"; Tiferet Yisrael: "פתח קטן היה בתוך דלת הגדול של השער"). Until 1.7.1 two small cedar panels stood for them.
    ctx2.labels.push({ text: "שער לחיל", x: MOKED_X, y: 35, z: -79, size: 2, layer: "mokedDef" }, { text: "שער לחיל — בכותל המזרחי (הרא״ש)", x: -3.6, y: 26.5, z: -73.3, size: 1.5, layer: "mokedRosh" });
    lbl("שער לעזרה — השער השלישי", MOKED_X, 37.5, -56, 2);   // 1.3.0: Middot 1:5 "שלישי לו בית המוקד"
    // 1.4.0 (the user, "להוסיף הכל"): בית המוקד hollow - its four walls (the box 24 x 20, 15 high, on the wall line z -67.5), the roof (into the
    // chambers' pill), the four chambers in its corners "כקיטוניות פתוחות לטרקלין" (Middot 1:6; Tamid 3:3 - south-west the lambs, south-east
    // the showbread's makers, north-east the altar's stones the Hasmoneans hid, north-west the way down to the bath), the stone benches,
    // "רובדין של אבן" (1:8), round the walls, where the elders slept, and the marble tablet with the ring and the chain of the keys (1:9)
    {
      // 1.8.0: 24 high (model choice; 15 until 1.7.1), so that its gates are 20 high as all the gates; the corner rooms 6 x 6 (7 until 1.7.1),
      // clear of the gates; the hall is open across the court's wall-line, and "ראשי פספסין מבדילין בין קדש לחל" (1:6; Bartenura: "ראשי
      // קורות יוצאים מן הכתל עד המקום שהוא קדש") - beam-ends out of its east and west walls on the line (model choice: the wall's inner face)
      // MOKED_WIDE_211 (the user, 15.11.2026: "נראה לי שצריך להגדיל את כל לשכות בית המוקד, תבדוק אם אפשרי"; of the three ways shown to
      // him: "ב"): the house 32 wide (24 until 2.0.1; no source gives its measure or the chambers' - "בית גדול היה", Middot 1:8), and
      // each chamber nine and a half by six and a half inside (six by six), six high, WITH A CEILING OF ITS OWN (the user: "כל
      // הלשכות בבית המוקד היו מקורות"; the Yachin on 1:8: "בית המוקד היה מקורה עם גג עגול" - and the chambers are rooms within it,
      // "כקיטונות פתוחות לטרקלין"). The southern chambers end at the court wall's inner face (z -65) and the northern ones at its
      // outer face (-70): the two "בקדש" are wholly within the court, and the strip between the pairs is the wall's own five amot.
      // FLOOR_211 - ONE FLOOR: until 2.0.1 the court's pave (y 16) ran into the house's southern half while the hall, its gates,
      // its benches and its hearth stood at 13.5 - half of the hearth and of every southern thing was under the pave. Nothing
      // parts the holy half from the other but the beam-ends ("וראשי פספסין מבדילין בין קדש לחל", 1:6), so the hall is one floor,
      // at the court's own level (16); five steps inside the gate to the chel - and inside the Rosh's eastern gate - come up to
      // it from the landing's 13.5. Model choices, all of these.
      const X = MOKED_X, Z = -67.5, W = 32, D = 20, Hh = 24, RMX = 4.75, RMZ = 3.25, CHH = 6, FL = LV.KOH;
      const chC = (sx, sz) => [X + sx * (W / 2 - 1 - RMX), Z + sz * (D / 2 - 1 - RMZ)];   // a chamber's middle: (X ± 10.25, Z ± 5.75)
      for (const sz of [-1, 1]) H2.wall(g, { axis: "x", length: W, height: Hh, thickness: 1, mat: M2.stoneLight, cx: X, cz: Z + sz * (D / 2 - 0.5), y: 13.5, openings: [{ center: 0, width: 10, height: sz > 0 ? 22.5 : 20 }] });   // FLOOR_211: the court's gate stands on the floor, 16 to 36
      // 1.9.3 (the user, 21:41: "אפשרות 2"): THE ROSH'S SECOND EXPLANATION of the two gates (Tamid 26b; 2224, line 34): "ותו גבי הדדי הוה
      // קיימי - אותו הפתוח לעזרה היה עומד אצל קרן מזרחית צפונית, ואותו שפתוח להר הבית היה בחציו של כותל מזרחי, מיד שמתחיל החיל, היו
      // סמוכין זה לזה" - a reading beside his first ("מכוונים היו שערים זה כנגד זה", the default): the gate to the chel in the EAST
      // wall, just north of the court's wall (z -75.8..-70.8; five wide and ten high - a model choice), the north doorway walled up,
      // and the north-east chamber six and a half amot further west (it stood where the gate opens). The gate to the court stays in
      // the south wall (the library's text has "קרן מזרחית צפונית"; the kuntres reads "דרומית" - not decided here).
      // ctx2.shared.mokedGates.set("opposite" | "adjacent"); ctx2.layers.mokedDef / mokedRosh.
      const mokedDef = new Group(), mokedRosh = new Group();
      mokedRosh.visible = false;
      g.add(mokedDef); g.add(mokedRosh);
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.mokedDef = mokedDef; ctx2.layers.mokedRosh = mokedRosh;
      ctx2.shared.mokedGates = { mode: "opposite", set(m) { this.mode = m === "adjacent" ? "adjacent" : "opposite"; mokedDef.visible = this.mode === "opposite"; mokedRosh.visible = this.mode === "adjacent"; return this.mode; } };
      // CHEL_211: the house's outer part stands in the chel on a base of its own, down to the mount's floor; before its gate to the chel
      // ("אחד פתוח לחיל", 1:7) a landing, and a flight of 27 steps down eastwards along the house's north face (2.3 wide: the soreg
      // stands 2.5 amot from the wall there). The Rosh's second explanation (the gate in the east wall): a landing east of it and a
      // flight down eastwards along the court's wall. Model choices, as the other gates' steps.
      // MESIBAH_303: the mouth of the way down to the bath (the north-west chamber) goes through the base as well - the base in pieces
      // round it, its stone's texture as one
      { const [hx, hz] = chC(-1, -1); for (const m of boxHoles(g, W, 13.5, 7.5, M2.stone, X, 0, -73.75, [{ x: hx, z: hz, w: 3.5, d: 3.5 }])) uvLike(m, X - W / 2, X + W / 2, 0, 13.5, -77.5, -70); }
      {
        const z0 = -79.8, z1 = Z - D / 2;
        H2.box(mokedDef, 12, 13.5, z1 - z0, M2.stoneSmooth, X, 0, (z0 + z1) / 2);
        platRail(mokedDef, X - 6, X + 6, z0, z1, 13.5, ["n", "w"]);
        stairsR(mokedDef, { width: z1 - z0, totalRise: 13.5, steps: 27, dir: "W", x: X + 6 + 13.5, y: 0, z: (z0 + z1) / 2, tread: 0.5 });
        H2.box(mokedRosh, 5, 13.5, 5, M2.stoneSmooth, X + W / 2 + 2.5, 0, -73.3);
        platRail(mokedRosh, X + W / 2, X + W / 2 + 5, -75.8, -70.8, 13.5, ["n"]);
        stairsR(mokedRosh, { width: 5, totalRise: 13.5, steps: 27, dir: "W", x: X + W / 2 + 5 + 13.5, y: 0, z: -73.3, tread: 0.5 });
      }
      // FLOOR_211: the northern half's floor, level with the court's pave (which is the southern half's) - less the stairwell inside
      // the gate to the chel, the stairwell inside the Rosh's eastern gate (in his reading only) and the mouth of the way down in
      // the north-west chamber; five steps of half an amah in each stairwell
      {
        const [nwx, nwz] = chC(-1, -1);
        const RG = { x: X + W / 2 - 1 - 1.25, z: -73.3, w: 2.5, d: 5 };   // inside the Rosh's gate (z -75.8..-70.8)
        boxHoles(g, W - 2, FL - 13.5, D / 2 - 1, M2.pave, X, 13.5, Z - (D / 2 - 1) / 2, [{ x: X, z: Z - D / 2 + 1 + 1.25, w: 10, d: 2.5 }, { x: nwx, z: nwz, w: 3.5, d: 3.5 }, RG]);
        H2.box(mokedDef, RG.w, FL - 13.5, RG.d, M2.pave, RG.x, 13.5, RG.z);   // the default reading: no gate there - the floor is whole
        for (let k = 0; k < 5; k++) {
          H2.box(g, 10, 0.5 * (k + 1), 0.5, M2.stoneSmooth, X, 13.5, Z - D / 2 + 1 + 0.25 + 0.5 * k);
          H2.box(mokedRosh, 0.5, 0.5 * (k + 1), RG.d, M2.stoneSmooth, X + W / 2 - 1 - 0.25 - 0.5 * k, 13.5, RG.z);
        }
      }
      // ROVDIN_NICHES_N2 (the user's decision, 23.11.2026, on the Mefaresh): the bed-niches are CUT INTO the end walls (0.7 deep in the wall's one
      // amah), in the northern half of the hall only (the half built in the chel: z -70..-67.5 - "אותו בית המוקד שבנוי בחול היה מוקף רובדין",
      // 2105:10), two levels, one bed in each. In the other reading (the Rosh's) the niches are filled back with stone (ctx2 rovdin group below).
      const NZ0 = -69.8, NZ1 = -67.7, NY0 = [FL + 1.6, FL + 4.4], NH = 1.5, NDEP = 0.7;
      const carvedWall = (xc, innerSign, za, zb, parts) => {   // a wall one amah thick, centred on xc, z za..zb, the niches cut in its inner face (the side `innerSign`: +1 = the +x face)
        const xi = xc + innerSign * 0.5;                       // the inner face
        const put = (mat) => (x0, x1, y0, y1, z0, z1) => { if (x1 - x0 > 1e-6 && y1 - y0 > 1e-6 && z1 - z0 > 1e-6) H2.box(parts, x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, y0, (z0 + z1) / 2); };
        const w = put(M2.stoneLight), y0 = 13.5, y1 = 13.5 + Hh;
        const xm = xi - innerSign * NDEP, xe = xi - innerSign;   // the niches' bottom, and the wall's outer face
        const xa = Math.min(xi, xm), xb = Math.max(xi, xm);                               // the front layer (the niches' depth)
        w(Math.min(xm, xe), Math.max(xm, xe), y0, y1, za, zb);                           // the back layer, whole
        w(xa, xb, y0, y1, za, NZ0); w(xa, xb, y0, y1, NZ1, zb);                           // the front layer, round the niches' columns
        w(xa, xb, y0, NY0[0], NZ0, NZ1);
        w(xa, xb, NY0[0] + NH, NY0[1], NZ0, NZ1);
        w(xa, xb, NY0[1] + NH, y1, NZ0, NZ1);
      };
      carvedWall(X - (W / 2 - 0.5), 1, Z - D / 2, Z + D / 2, g);                           // the west wall
      {
        const XE = X + W / 2 - 0.5;                                                           // the east wall, in pieces round the Rosh's gate
        carvedWall(XE, -1, -70.8, -57.5, g);                                                  // z -70.8..-57.5 (the niches cut in)
        H2.box(g, 1, Hh, 1.7, M2.stoneLight, XE, 13.5, -76.65);                               // z -77.5..-75.8
        H2.box(g, 1, Hh - 10, 5, M2.stoneLight, XE, 23.5, -73.3);                             // over the gate
        H2.box(mokedDef, 1, 10, 5, M2.stoneLight, XE, 13.5, -73.3);                           // the default: no gate there
        H2.doors(mokedRosh, { axis: "z", cx: XE, cz: -73.3, y: 13.5, width: 5, height: 10, inward: 1, mat: M2.gateGold, open: 0.7, inset: 0.3 });   // FLOOR_211: its leaves open outward, over the landing (the steps are inside)
        H2.box(mokedRosh, 1.4, 0.8, 6.4, M2.stoneSmooth, XE, 23.5, -73.3);                    // its lintel
        H2.box(mokedRosh, 10, 20, 1, M2.stoneLight, X, 13.5, Z - D / 2 + 0.5);                // the north doorway walled up
      }
      // MOKED_VAULT_A2 (the user's decision 26): "ובית המוקד כיפה" (Tamid 1:1, 88:2) - the Bartenura (634:7): "בנין של בית המוקד לא
      // היתה עליה אלא כפה, ארקוולט"ו בלע"ז, עשויה בארץ"; the Yachin, Middot 1 (819:110): "בית המוקד היה מקורה עם גג עגול" - a vault
      // over the hall (its axis along the hall's length, a segment of a circle: five amot of rise over its twenty), the court's wall
      // broken over it, so that the vault is seen from without. Until now a flat roof with a small dome on a drum. Its rise and its
      // thickness - model choices.
      const VR = 5, VS = D / 2 + 0.7, VRad = (VS * VS + VR * VR) / (2 * VR), VA = Math.asin(VS / VRad), VC = 13.5 + Hh - (VRad - VR);
      const roof = H2.box(g, W + 1.4, 0.5, D + 1.4, M2.stoneSmooth, X, 13.5 + Hh - 0.5, Z);   // the springing course round the top of the walls
      ctx2.lishkotCut.push(roof);
      {
        const vg = new CylinderGeometry(VRad, VRad, W + 1.4, 40, 1, true, -VA, 2 * VA);
        vg.rotateZ(-Math.PI / 2); vg.rotateX(-Math.PI / 2);   // its axis along x; the arc up (+y), across z
        const vm = M2.stoneSmooth.clone(); vm.side = DoubleSide;
        const vault = new Mesh(vg, vm); vault.position.set(X, VC, Z); vault.castShadow = vault.receiveShadow = true; g.add(vault);
        const sh = new Shape(); sh.moveTo(-VS, 0);
        for (let i = 0; i <= 24; i++) { const a = -VA + (2 * VA * i) / 24; sh.lineTo(VRad * Math.sin(a), VC + VRad * Math.cos(a) - (13.5 + Hh)); }
        sh.lineTo(-VS, 0);
        const ends = [-1, 1].map((sx) => { const m = new Mesh(new ShapeGeometry(sh), vm); m.rotation.y = HP; m.position.set(X + sx * (W / 2 + 0.7), 13.5 + Hh, Z); g.add(m); return m; });   // the two lunettes
        ctx2.lishkotCut.push(vault, ...ends);
        ctx2.shared.mokedVault = { top: 13.5 + Hh + VR, x: X, z: Z };
      }
      for (const sz of [-1, 1]) H2.occ(H2.box(g, 12, 1, 1.4, M2.stoneSmooth, X, sz > 0 ? 36 : 33.5, Z + sz * (D / 2 - 0.5)));   // the lintels
      const courtGate = H2.doors(g, { axis: "x", cx: X, cz: Z + D / 2 - 0.5, y: FL, width: 10, height: 20, inward: 1, mat: M2.gateGold, open: 1.0, inset: 0.6 });    // to the court
      H2.doors(mokedDef, { axis: "x", cx: X, cz: Z - D / 2 + 0.5, y: 13.5, width: 10, height: 20, inward: -1, mat: M2.gateGold, open: 0.25, inset: 0.6 }); // to the chel (the default reading)
      {   // R. Yehuda's wicket "בתוך דלת הגדול של השער" (Tiferet Yisrael): a small door in one leaf of the court gate, 1.8 x 3.8 (model choice)
        const wk = new MeshStandardMaterial({ color: 0x8a6420, metalness: 0.6, roughness: 0.4 });
        const leaf = courtGate.children[1];
        if (leaf) { const wm = new Mesh(new BoxGeometry(1.8, 3.8, 0.52), wk); wm.position.set(2.45, 2.1, 0); wm.castShadow = true; leaf.add(wm); }
        lbl("פשפש קטן — רבי יהודה (מידות א, ז)", X + 4, 22.1, Z + D / 2 + 3, 0.9);
      }
      // PISPASIN_A2 (the user's decisions 57, 64): "וראשי פספסין מבדילין בין קדש לחל" (Middot 1:6) - a switch,
      // ctx2.shared.pispasin.set("bartenura" | "rambam"): the Bartenura (643:36) "ראשי קורות יוצאים מן הכתל עד המקום שהוא קדש" - beam-ends
      // out of the east and west walls on the line (as until now); the Rambam's commentary (573:10) "עשו בקרקעיתם ממעל שבכות להבדיל
      // קרקע השתים של הקדש מקרקע שתים של חול... פשפש הוא דבר קטן מפסיק מנוקב נקבים קטנים" - a low lattice on the floor along the line.
      // The same switch between the court of Israel and the priests' (Middot 2:6; the Bartenura 643:99) - below, PIS.israel. The beams'
      // number, the lattice's height and its making - model choices.
      const PIS = ctx2.shared.pispasin = ctx2.shared.pispasin || { mode: "bartenura", B: [], R: [], set(m) { this.mode = m === "rambam" ? "rambam" : "bartenura"; for (const o of this.B) o.visible = this.mode === "bartenura"; for (const o of this.R) o.visible = this.mode === "rambam"; return this.mode; } };
      {
        const pB = new Group(), pR = new Group();
        g.add(pB); g.add(pR); PIS.B.push(pB); PIS.R.push(pR); pR.visible = false;
        for (const sx of [-1, 1]) for (const y of [17.5, 20, 22.5, 25, 28, 31]) H2.box(pB, 1.6, 0.45, 0.45, M2.cedar, X + sx * (W / 2 - 1.8), y, -65.2);   // ראשי פספסין
        const lat = (parent, x0, x1, z, y0, h) => {   // a low lattice along x at z: rails and a close row of slats, crossed
          const L = x1 - x0, cx = (x0 + x1) / 2;
          H2.box(parent, L, 0.08, 0.12, M2.cedar, cx, y0 + h - 0.08, z); H2.box(parent, L, 0.08, 0.12, M2.cedar, cx, y0, z);
          const n = Math.floor(L / 0.25), sg = new BoxGeometry(0.05, h * 1.25, 0.05), im = new InstancedMesh(sg, M2.cedar, 2 * n), m4 = new Matrix4(), qq = new Quaternion(), e = new Euler(), ps = new Vector3(), one = new Vector3(1, 1, 1);
          for (let i = 0; i < n; i++) for (const k of [0, 1]) { e.set(0, 0, k ? 0.6 : -0.6); qq.setFromEuler(e); m4.compose(ps.set(x0 + (i + 0.5) * (L / n), y0 + h / 2, z), qq, one); im.setMatrixAt(2 * i + k, m4); }
          im.castShadow = true; parent.add(im);
        };
        lat(pR, X - W / 2 + 1, X - 5, -65.2, FL, 0.55); lat(pR, X + 5, X + W / 2 - 1, -65.2, FL, 0.55);   // across the hall, apart from the way between the gates (model choice)
        PIS.lat = lat;
        // ... and between the court of Israel and the priests' (the user's decision 64; Middot 2:6 "וראשי פספסין מבדילין בין עזרת ישראל
        // לעזרת הכהנים"; the Bartenura 643:99 "ראשי קורות בולטים ויוצאים מן הכתל להבדיל בין עזרת ישראל לעזרת כהנים"): on the line x 85,
        // beam-ends out of the south wall and out of the face of the hall of hewn stone in the north (z -54); or the low lattice on the floor
        // along it (the Rambam). (The step and the duchan of R. Eliezer b. Yaakov stand there as before.)
        {
          const iB = new Group(), iR = new Group();
          g.add(iB); g.add(iR); PIS.B.push(iB); PIS.R.push(iR); iR.visible = false;
          for (const [zw, sz] of [[-54, 1], [65, -1]]) for (const y of [18, 20.5, 23, 25.5, 28.5, 31.5]) H2.box(iB, 0.45, 0.45, 1.6, M2.cedar, 85, y, zw + sz * 0.8);
          const sub = new Group(); sub.rotation.y = HP; sub.position.set(85.25, 0, 0); iR.add(sub);
          lat(sub, -65, 54, 0, 13.5, 0.5);   // local x -> the world's -z: z -54 .. 65
          const PI = { info: "**ראשי פספסין** (מידות ב, ו): ״וראשי פספסין מבדילין בין עזרת ישראל לעזרת הכהנים״. ברטנורא: ״ראשי קורות בולטים ויוצאים מן הכתל להבדיל בין עזרת ישראל לעזרת כהנים״; ולפירוש המשניות לרמב״ם — שבכה נמוכה ברצפה (ראו בבית המוקד). המתג — בתפריט, ״ראשי פספסין — קורות או שבכה ברצפה״.", refs: [["מידות ב, ו", { book: 89, index: 17 }], ["ברטנורא מידות ב, ו", { book: 643, index: 99 }], ["פירוש המשניות לרמב״ם מידות א, ו", { book: 573, index: 10 }]] };
          ctx2.labels.push(Object.assign({ text: "ראשי פספסין — בין עזרת ישראל לעזרת כהנים (ברטנורא מידות ב, ו)", x: 85, y: 33, z: 60, size: 1.1, layer: "pisIB" }, PI),
            Object.assign({ text: "פשפש — שבכה ברצפה בין עזרת ישראל לעזרת כהנים (הרמב״ם)", x: 86.5, y: 15.6, z: 40, size: 1.0, layer: "pisIR" }, PI));
          ctx2.layers.pisIB = iB; ctx2.layers.pisIR = iR;
        }
        const PM = { info: "**ראשי פספסין** (מידות א, ו): ״וראשי פספסין מבדילין בין קדש לחל״. ברטנורא: ״ראשי קורות יוצאים מן הכתל עד המקום שהוא קדש״; פירוש המשניות לרמב״ם: ״עשו בקרקעיתם ממעל שבכות להבדיל קרקע השתים של הקדש מקרקע שתים של חול״. המתג — בתפריט, ״ראשי פספסין — קורות או שבכה ברצפה״.", refs: [["מידות א, ו", { book: 89, index: 7 }], ["ברטנורא מידות א, ו", { book: 643, index: 36 }], ["פירוש המשניות לרמב״ם מידות א, ו", { book: 573, index: 10 }]] };
        ctx2.labels.push(Object.assign({ text: "ראשי פספסין — מכאן לדרום קודש, לצפון חול", x: X, y: 32.5, z: -65.2, size: 1.1, layer: "pisB" }, PM),
          Object.assign({ text: "פשפש — שבכה ברצפה, מכאן לדרום קודש (פירוש המשניות לרמב״ם)", x: X, y: FL + 2.2, z: -65.2, size: 1.0, layer: "pisR" }, PM));
        ctx2.layers = ctx2.layers || {}; ctx2.layers.pisB = pB; ctx2.layers.pisR = pR;
      }
      lbl("בית המוקד", X, 13.5 + Hh + 7.5, Z, 3);
      const CH = [[-1, 1, "לשכת טלאי קרבן"], [1, 1, "לשכת עושי לחם הפנים"], [1, -1, "לשכת אבני המזבח שגנזו בני חשמונאי"], [-1, -1, "הירידה לבית הטבילה"]];
      const chCeil = [];
      for (const [sx, sz, name] of CH) {
        const [cx, cz] = chC(sx, sz);
        const NE = sx > 0 && sz < 0;   // 1.9.3: the north-east chamber stands in each reading's own group (the Rosh's gate opens where it stood)
        for (const [par, dx] of NE ? [[mokedDef, 0], [mokedRosh, -6.5]] : [[g, 0]]) {
          // MOKED_WIDE_211: the wall to the hall's middle (along x) with the doorway in it, a step and a half from the aisle's side;
          // the wall to the aisle (along z); the ceiling
          const wz = cz - sz * (RMZ + 0.2), xd = cx + dx - sx * (RMX - 1.5), wl = 2 * RMX + (dx ? 0.8 : 0.4), wc = cx + dx - (dx ? 0 : sx * 0.2);
          H2.wall(par, { axis: "x", length: wl, height: CHH, thickness: 0.4, mat: M2.stoneSmooth, cx: wc, cz: wz, y: FL, openings: [{ center: xd - wc, width: 1.8, height: 4 }] });
          H2.box(par, 0.4, CHH, 2 * RMZ, M2.stoneSmooth, cx + dx - sx * (RMX + 0.2), FL, cz);
          if (dx) H2.box(par, 0.4, CHH, 2 * RMZ, M2.stoneSmooth, cx + dx + sx * (RMX + 0.2), FL, cz);   // moved off the east wall: a wall of its own there
          H2.box(par, 0.12, 3.9, 1.7, M2.cedar, xd - sx * 0.96, FL, wz - sz * 1.05);   // its door, standing open into the hall
          const cl = H2.occ(H2.box(par, 2 * RMX + 0.8, 0.3, 2 * RMZ + 0.6, M2.cedar, cx + dx, FL + CHH, cz - sz * 0.1));
          ctx2.lishkotCut.push(cl);
          chCeil.push(cl);
          // the name over the ceiling, toward the hall's middle
          if (NE) ctx2.labels.push({ text: name, x: cx + dx - sx * 1.6, y: FL + CHH + 1.3, z: cz - sz * 2.6, size: 1.1, layer: dx ? "mokedRosh" : "mokedDef" });
          else lbl(name, cx - sx * 1.6, FL + CHH + 1.3, cz - sz * 2.6, 1.1);
        }
      }
      // MOKED_TAMID_210 (the user, 14.11.2026: "יש לשכת חותמות טלאים וכל אלו שהיו בסמוך?"; "הו"א של גמרא לעולם לא תהיה במודל";
      // "אפשרות 2 צריכה להיות"; "תעשה שתי שיטות בלשכות ואת המאירי תדחף בכרטיס שיטה ב"): over each chamber's name in Middot (1:6), its
      // name in Tamid 3:3 - "וארבע לשכות היו שם, אחת לשכת הטלאים, ואחת לשכת החותמות, ואחת לשכת בית המוקד, ואחת לשכה שהיו עושין בה לחם
      // הפנים" (88, line 15) - by the Gemara's answer (Yoma 17a-b: "מר קא חשיב דרך ימין, ומר קא חשיב דרך שמאל"; "במערבית דרומית הואי").
      // The south-west and the south-east are agreed; the two northern ones by the reading (ctx2.shared.mokedTamid.set("a" | "b");
      // ctx2.layers.mokedTamidA / mokedTamidB - groups of labels only):
      //  a (the default) - Rashi (Yoma 17b; 2157, line 533), Tosafot Rid (2109, line 50), the Ritva (1940, line 214): the north-east is
      //    "לשכת בית המוקד", the north-west "לשכת החותמות";
      //  b - the Bartenura (Middot 1:6; 643, line 39), the Meiri on Middot (6033, line 16), the Yachin (Tamid 3:3; 818, line 252), the
      //    Mefaresh (2105, line 247): the reverse.
      // The north-east chamber stands in each gates' reading at its own place (above): its labels belong to both layers (`layers`).
      {
        const tamA = new Group(), tamB = new Group();
        tamB.visible = false;
        g.add(tamA); g.add(tamB);
        ctx2.layers.mokedTamidA = tamA; ctx2.layers.mokedTamidB = tamB;
        ctx2.shared.mokedTamid = { mode: "a", set(m) { this.mode = m === "b" ? "b" : "a"; tamA.visible = this.mode === "a"; tamB.visible = this.mode === "b"; return this.mode; } };
        const TAM = "במשנת תמיד: ";
        for (const [sx, sz] of [[-1, 1], [1, 1], [1, -1], [-1, -1]]) {
          const [cx, cz] = chC(sx, sz);
          // over the Middot name and 1.4 toward the hall's middle - from above the two do not cover one another
          if (sz > 0) { lbl(TAM + (sx < 0 ? "לשכת הטלאים" : "לשכה שהיו עושין בה לחם הפנים"), cx - sx * 1.6, FL + CHH + 2.5, cz - sz * 1.4, 0.85); continue; }
          const nA = sx > 0 ? "לשכת בית המוקד" : "לשכת החותמות", nB = sx > 0 ? "לשכת החותמות" : "לשכת בית המוקד";
          for (const [gate, dx] of sx > 0 ? [["mokedDef", 0], ["mokedRosh", -6.5]] : [[null, 0]]) {
            for (const [tl, nm] of [["mokedTamidA", nA], ["mokedTamidB", nB]]) {
              ctx2.labels.push({ text: TAM + nm, x: cx + dx - sx * 1.6, y: FL + CHH + 2.5, z: cz - sz * 1.4, size: 0.85, layers: gate ? [gate, tl] : [tl] });
            }
          }
        }
        // NAMES_DEMO_211 (the user, 14.11.2026, of the row "שמות הלשכות שבבית המוקד" - he marked it important: the names are small,
        // and from the row's far view the two readings look the same): picking a reading SHOWS it - the eye goes round the house
        // chamber by chamber, a large plate with the chamber's name of that reading over each (the two northern names, which the
        // readings exchange, rimmed red; the two agreed ones gold), and ends on the far view with the four plates together; they
        // stay a while and go. ctx2.shared.mokedTamid.show(mode): set + the round. Not while a presentation runs (it has its own
        // eye - the four plates are just shown); a touch of the mouse on the picture stops the round where it is.
        // ctx2.layers.mokedNm0..3 - flags for the plates only.
        const NMG = [0, 1, 2, 3].map((i) => { const q = new Group(); q.visible = false; g.add(q); ctx2.layers["mokedNm" + i] = q; return q; });
        const ORDER = [[-1, 1], [1, 1], [1, -1], [-1, -1]];   // south-west, south-east, north-east, north-west (Middot's order)
        ORDER.forEach(([sx, sz], i) => {
          const [cx, cz] = chC(sx, sz), y = FL + CHH + 6.5;
          if (sz > 0) { ctx2.labels.push({ text: sx < 0 ? "לשכת הטלאים" : "לשכת עושי לחם הפנים", x: cx, y, z: cz, size: 3, box: true, rim: "#e2a400", onTop: true, far: 500, layers: ["mokedNm" + i] }); return; }
          const nA = sx > 0 ? "לשכת בית המוקד" : "לשכת החותמות", nB = sx > 0 ? "לשכת החותמות" : "לשכת בית המוקד";
          for (const [gate, dx] of sx > 0 ? [["mokedDef", 0], ["mokedRosh", -6.5]] : [[null, 0]]) for (const [tl, nm] of [["mokedTamidA", nA], ["mokedTamidB", nB]]) {
            ctx2.labels.push({ text: nm, x: cx + dx, y, z: cz, size: 3, box: true, rim: "#e0562f", onTop: true, far: 500, layers: gate ? ["mokedNm" + i, gate, tl] : ["mokedNm" + i, tl] });
          }
        });
        const RUNN = { id: 0, timers: [] };
        const stopRound = (hide) => { RUNN.id++; for (const t of RUNN.timers) clearTimeout(t); RUNN.timers.length = 0; if (hide) for (const q of NMG) q.visible = false; };
        ctx2.shared.mokedTamid.stopRound = () => stopRound(true);
        // MOKED_ROUND_STOP_211 (the function review, F1-05): the round was outside "every switch first stops the demonstrations" - a place
        // or "מבט כללי" chosen in its first 15 seconds was taken back to Beit HaMoked four or five times. It is registered now.
        (ctx2.shared.demoStops || (ctx2.shared.demoStops = [])).push({ id: "moked-names", running: () => RUNN.timers.length > 0, stop: () => stopRound(true) });
        ctx2.shared.mokedTamid.show = function (m) {
          this.set(m);
          stopRound(true);
          let touring = false;
          try { const T = ctx2.shared.tour; touring = !!(T && typeof T.state === "function" && T.state().running); } catch (_) {}
          if (touring || typeof ctx2.flyTo !== "function") { for (const q of NMG) q.visible = true; RUNN.timers.push(setTimeout(() => stopRound(true), 14000)); return this.mode; }
          const id = RUNN.id, rosh = !!(ctx2.shared.mokedGates && ctx2.shared.mokedGates.mode === "adjacent");
          const at = (ms, fn) => RUNN.timers.push(setTimeout(() => { if (RUNN.id === id) fn(); }, ms));
          const STEP = 3400, T0 = 1900;   // the row's own flight to the far view comes first
          ORDER.forEach(([sx, sz], i) => at(T0 + i * STEP, () => {
            const [cx0, cz] = chC(sx, sz), cx = cx0 + (rosh && sx > 0 && sz < 0 ? -6.5 : 0);
            NMG.forEach((q, k) => { q.visible = k === i; });
            ctx2.flyTo([cx, FL + 30, cz + 6], [cx, FL + 2, cz], 1300);
          }));
          at(T0 + 4 * STEP, () => { for (const q of NMG) q.visible = true; ctx2.flyTo([X, FL + 44, Z + 22], [X, FL + 1, Z - 0.5], 1700); });
          at(T0 + 4 * STEP + 16000, () => stopRound(true));
          return this.mode;
        };
        // CHOTAMOT_211 (the user, 15.11.2026 01:00: "מה עם לשכת החותמות שבה גונזין את האבנים"): THE SEALS, in the chamber that is
        // "לשכת החותמות" by the names' reading - the north-west (reading a) or the north-east, beside the altar's stones (reading b):
        // "ארבעה חותמות היו במקדש, וכתוב עליהן, עגל, זכר, גדי, חוטא" (Shekalim 5:3; book 54, line 33) - four trays on a table by the
        // wall, in each a few tokens, its word over it. Ben Azzai's five ("וארמית כתוב עליהן ... חוטא דל, וחוטא עשיר") are told in
        // the card, not drawn. MODEL CHOICES: the table, the trays, the tokens' look (clay discs), their place in the room.
        {
          const clayS = new MeshStandardMaterial({ color: 0xb98a5e, roughness: 0.9 }), trayM = new MeshStandardMaterial({ color: 0x6a4a30, roughness: 0.85 });
          const WORDS = ["עגל", "זכר", "גדי", "חוטא"];
          const sealsAt = (par, tx, tz, lay) => {
            H2.box(par, 0.9, 0.1, 3.0, M2.cedar, tx, FL + 1.2, tz);
            for (const sx2 of [-1, 1]) for (const sz2 of [-1, 1]) H2.box(par, 0.1, 1.2, 0.1, M2.cedar, tx + sx2 * 0.36, FL, tz + sz2 * 1.38);
            WORDS.forEach((w, i) => {
              const z = tz - 1.05 + i * 0.7;
              H2.box(par, 0.62, 0.05, 0.5, trayM, tx, FL + 1.3, z);
              for (let k = 0; k < 7; k++) H2.cyl(par, 0.085, 0.085, 0.03, clayS, tx - 0.16 + (k % 3) * 0.16, FL + 1.35 + Math.floor(k / 3) * 0.03, z - 0.1 + ((k * 2) % 3) * 0.1, 10);
              ctx2.labels.push({ text: w, x: tx, y: FL + 1.95, z, size: 0.42, far: 34, layers: lay });
            });
            ctx2.labels.push({ text: "ארבעה חותמות — עגל, זכר, גדי, חוטא (שקלים ה, ג)", x: tx, y: FL + 3.3, z: tz, size: 0.72, layers: lay });
          };
          const [nwX, nwZ] = chC(-1, -1), [neX, neZ] = chC(1, -1);
          const sA = new Group();
          tamA.add(sA);
          sealsAt(sA, nwX - RMX + 0.6, nwZ, ["mokedTamidA"]);
          for (const [gate, dx] of [[mokedDef, 0], [mokedRosh, -6.5]]) {
            const sB = new Group();
            Object.defineProperty(sB, "visible", { get: () => gate.visible, set: () => {} });
            tamB.add(sB);
            sealsAt(sB, neX + dx + RMX - 0.6, neZ, ["mokedTamidB", gate === mokedDef ? "mokedDef" : "mokedRosh"]);
          }
        }
        setTimeout(() => {   // (the controls are made after the courts)
          const c2 = ctx2.controls;
          if (c2 && typeof c2.addEventListener === "function") c2.addEventListener("start", () => { if (RUNN.timers.length) { stopRound(false); RUNN.timers.push(setTimeout(() => stopRound(true), 9000)); } });
        }, 0);
      }
      // LAMBS_210 (the user, 14.11.2026: "את לשכת טלאים תמלא בטלאים מכל הגדלים"; the outside review: the four chambers stood empty): in
      // the south-west chamber, "לשכת טלאי קרבן", ten lambs of every size, some lying - "אין פוחתין מששה טלאים המבקרין בלשכת הטלאים...
      // ומוסיפין עד לעולם" (Arachin 2:5; 84, line 11). The lamb is the demonstration's (55-tamid.js: the body 0.6 x 0.58 x 1.1, at 0.72),
      // made of a few shared pieces; a lamb is "בן שנתו", so the sizes go from a young one to a yearling (0.72 .. 1.18). In the north-east
      // chamber, "בה גנזו בני חשמונאי את אבני המזבח ששקצום מלכי יון" (Middot 1:6): a heap of whole stones, unhewn ("אבנים שלמות", Middot
      // 3:4), in each gates' reading at that chamber's own place. Their number, places, poses and sizes - model choices.
      {
        const SW = chC(-1, 1);   // the lambs' chamber (MOKED_WIDE_211: its middle (-28.25, -61.75); its doorway in the north wall, at x -25)
        // the south chambers stand where the court's floor (y 16, LV.KOH) runs into the house - their floor as seen is 16, not the hall's 13.5
        const LAMB_FLOOR = 16;
        // LAMBS_211 (the user, 14.11.2026: "לשכת הטלאים - א: עם גדרות (אלו טלאים מבוקרים לא יכולים לטייל) ב: יותר אמיתיים"): every lamb
        // is one mesh of merged pieces with their own colours - a woolly body (a lumpy shell), a neck, a long head with a darker muzzle,
        // drooping ears, legs with dark hooves (folded under when lying), a short tail - and the lambs stand in two pens of dark wood
        // (posts, two rails and crossed braces, as the picture he sent), a passage left by the door, straw on the floor. The pens,
        // their number and the straw - model choices ("המבקרין בלשכת הטלאים", Arachin 2:5: the inspected ones kept apart)
        // LAMB_211 (the user, later that evening: "את הטלאים עשית ציוריים מדי, אני רוצה אותם ממש אמיתיים"): the lambs are the kit's
        // (10-core.js lambKit - the animal's own build, its fleece, its head and its jointed legs), in four poses - standing, looking
        // aside, its head down to the straw, and lying on its folded legs; all the lambs of a pose are one instanced mesh
        const LK = H2.lambKit(), lambAt = { stand: [], look: [], graze: [], lie: [] };
        const lamb = (x, z, yaw, k, pose) => { lambAt[pose].push([x, z, yaw, k]); };
        const [lx0, lz0] = SW;
        // the pens: a passage along the north (the door's side), and two pens behind a fence, parted by another
        {
          const penMat = M2.cedar.clone();
          penMat.color.setHex(0x5a4332);
          const FZ = lz0 - RMZ + 1.75, X0p = lx0 - RMX + 0.15, X1p = lx0 + RMX - 0.15, Z1p = lz0 + RMZ - 0.15, DX = lx0 + 0.1;   // MOKED_WIDE_211: the pens fill the wider room
          const fence = (ax, fixed, f0, f1) => {
            const len = f1 - f0, n = Math.max(1, Math.round(len / 1.15)), step = len / n;
            for (let i = 0; i <= n; i++) {
              const t = f0 + i * step;
              if (ax === "x") H2.box(g, 0.11, 0.95, 0.11, penMat, t, LAMB_FLOOR, fixed); else H2.box(g, 0.11, 0.95, 0.11, penMat, fixed, LAMB_FLOOR, t);
            }
            for (const ry of [0.28, 0.78]) {
              if (ax === "x") H2.box(g, len, 0.08, 0.06, penMat, (f0 + f1) / 2, LAMB_FLOOR + ry, fixed); else H2.box(g, 0.06, 0.08, len, penMat, fixed, LAMB_FLOOR + ry, (f0 + f1) / 2);
            }
            for (let i = 0; i < n; i++) for (const sg of [1, -1]) {   // the crossed braces of each panel
              const t = f0 + (i + 0.5) * step, br = H2.box(g, ax === "x" ? Math.hypot(step, 0.5) : 0.05, 0.06, ax === "x" ? 0.05 : Math.hypot(step, 0.5), penMat, ax === "x" ? t : fixed, LAMB_FLOOR + 0.5, ax === "x" ? fixed : t);
              br.rotation[ax === "x" ? "z" : "x"] = sg * Math.atan2(0.5, step);
            }
          };
          fence("x", FZ, X0p, X1p);
          fence("z", DX, FZ, Z1p);
          const straw = new MeshStandardMaterial({ color: 0xc8a75c, roughness: 1 });
          H2.box(g, X1p - X0p, 0.04, Z1p - FZ, straw, lx0, LAMB_FLOOR, (FZ + Z1p) / 2);
        }
        // five lambs in each pen, of every size from a young one to a yearling ("בן שנה")
        // MOKED_WIDE_211: fourteen in the wider pens (ten until 2.0.1) - "ומוסיפין עד לעולם"
        [[-3.9, 2.4, 0.5, 1.1, "stand"], [-2.6, 2.6, -1.3, 0.84, "lie"], [-3.6, 0.5, 2.7, 1.0, "graze"], [-1.6, -0.5, -0.4, 0.78, "look"], [-2.4, 1.3, 1.1, 0.92, "lie"],
         [-0.9, 2.3, 2.0, 0.86, "stand"], [-1.0, 0.7, 0.3, 0.8, "graze"], [1.4, 2.5, 2.4, 1.06, "look"], [3.9, 1.1, -2.3, 0.98, "stand"], [1.2, -0.5, 0.25, 0.74, "graze"],
         [2.6, 1.5, 3.0, 0.88, "lie"], [3.6, -0.6, -0.9, 1.02, "stand"], [2.3, 2.7, 1.2, 0.9, "lie"], [4.0, 2.6, -2.0, 0.82, "look"]]
          .forEach(([dx, dz, yaw, k, ps]) => lamb(lx0 + dx, lz0 + dz, yaw, k, ps));
        {
          const mm = new Matrix4(), qq = new Quaternion(), ee = new Euler(), vp = new Vector3(), vs = new Vector3();
          for (const ps of Object.keys(lambAt)) {
            const list = lambAt[ps];
            if (!list.length) continue;
            const im = new InstancedMesh(LK.pose(ps), LK.mat, list.length);
            const tc = new Color();
            list.forEach(([x, z, yaw, k], i) => { ee.set(0, yaw, 0); qq.setFromEuler(ee); mm.compose(vp.set(x, LAMB_FLOOR, z), qq, vs.setScalar(k)); im.setMatrixAt(i, mm);
              const tv = 0.9 + 0.1 * Math.abs(Math.sin(x * 12.9 + z * 78.2)); im.setColorAt(i, tc.setRGB(tv, tv * 0.985, tv * 0.955)); });   // each lamb its own shade of white
            im.instanceMatrix.needsUpdate = true;
            im.castShadow = true;
            im.frustumCulled = false;
            g.add(im);
          }
        }
        lbl("טלאים מבוקרים — ״אין פוחתין מששה״ (ערכין ב, ה)", lx0, 18.6, lz0 + 1.8, 0.8);
        // the altar's stones, in the north-east chamber of each gates' reading
        const NEc = chC(1, -1);
        const rock = new IcosahedronGeometry(1, 0), stoneMat = M2.stone.clone();
        stoneMat.color.offsetHSL(0, 0, -0.06);
        let q = 1606;
        const rnd = () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; };
        const heap = [];
        for (let i = 0; i < 26; i++) {   // MOKED_WIDE_211: a larger heap in the larger room (fourteen stones until 2.0.1)
          const layer = i < 14 ? 0 : i < 22 ? 1 : 2, a = rnd() * Math.PI * 2, rr = layer === 0 ? 0.6 + rnd() * 2.3 : layer === 1 ? rnd() * 1.6 : rnd() * 0.6;
          heap.push([Math.cos(a) * rr, 0.42 + layer * 0.62, Math.sin(a) * rr, 0.45 + rnd() * 0.3, 0.32 + rnd() * 0.18, 0.4 + rnd() * 0.3, rnd() * 3, rnd() * 3]);
        }
        for (const [par, dx] of [[mokedDef, 0], [mokedRosh, -6.5]]) {
          for (const h of heap) {
            const m = new Mesh(rock, stoneMat);
            m.position.set(NEc[0] + dx + 0.3 + h[0], FL + h[1], NEc[1] - 0.3 + h[2]);
            m.scale.set(h[3], h[4], h[5]); m.rotation.set(h[6], h[7], 0);
            m.castShadow = m.receiveShadow = true;
            par.add(m);
          }
        }
      }
      // ROVDIN_A2 (the user's decision 58): "מקף רובדין של אבן, וזקני בית אב ישנים שם" (Middot 1:8) - a switch,
      // ctx2.shared.rovdin.set("rosh" | "mefaresh"): the Rosh (2224:9) "אצטבאות חתיכות של אבני גזית בולטות מן החומה זו למעלה מזו ועליהם
      // היו ישנים" and the Tiferet Yisrael (819:114) "כעין מדריגות" - stone steps along the walls (as until now); the Mefaresh, Tamid 25b-26b
      // (2105:9-10, 57) "שמן הרובדין היו עולין ע״ג מטותיהן שהיו בתוך כניסת החומה כעין מטות" - "ישנים בתוך כניסת החומה" - recesses in the
      // wall, like beds, and the stones standing out below them, by which one goes up to them. Their number and measures - model choices.
      {
        const rR = new Group(), rM = new Group(), rRne = new Group();
        g.add(rR); g.add(rM); rM.visible = false; mokedDef.add(rRne);   // rRne: the north-east corner's - it stands where the default reading's chamber stands
        // ROVDIN_SHAPES_N2 (fix-n2, 23.11.2026 - the user: "לא ניכר הבדל כלל" between the two readings): they differ in the SHAPE now.
        //   the Rosh, the Bartenura, the Rambam and the Tiferet Yisrael - "אצטבאות" one on another, each shorter than the one under it,
        //   "כעין מדריגות": on each end wall, in the free stretch between the corner chambers (five amot), five whole-length terraces (a
        //   stone stair up the wall, four and a half amot deep at the foot, five amot high); and - the user's decision, after the Tiferet
        //   Yisrael (819:114): "ונ״ל שפתחי הד׳ לשכות היו מבינות גובה האצטבאות הנ״ל, באופן שרווח הלשכות בעצמן היה תחת רובדי האצטבאות,
        //   והאצטבאות היו גגי הלשכות" - on each corner chamber's roof (six amot) three more terraces rise against the long wall;
        //   the Mefaresh - no terrace: bed-niches cut into the end walls ("בתוך כניסת החומה כעין מטות"), in the northern half only, two levels,
        //   a mattress and a pillow in each, and under each a stone standing out of the wall ("שמן הרובדין היו עולין ע"ג מטותיהן").
        // Their number, sizes and the niches' depth - model choices.
        const clothM = new MeshStandardMaterial({ color: 0xd9ccac, roughness: 0.95 }), pillowM = new MeshStandardMaterial({ color: 0xf0e8d4, roughness: 0.95 });
        const zc = (NZ0 + NZ1) / 2;
        for (const sx of [-1, 1]) {
          const wallX = X + sx * (W / 2 - 1);   // the end wall's inner face
          const at = (d) => wallX - sx * d / 2;   // the centre of a block d deep, standing on the wall
          for (let k = 0; k < 5; k++) H2.box(rR, 4.5 - 0.9 * k, 1, 4.8, M2.stoneSmooth, at(4.5 - 0.9 * k), FL + k, Z);
          for (const y0 of NY0) {
            H2.box(rR, NDEP, NH, NZ1 - NZ0, M2.stoneLight, wallX + sx * NDEP / 2, y0, zc);                  // the niche filled back (the Rosh's reading)
            H2.box(rM, 1.1, 0.7, 1.4, M2.stoneSmooth, at(1.1), y0 - 1.2, zc);                               // the stone that stands out of the wall, under the bed
            H2.box(rM, 0.62, 0.2, NZ1 - NZ0 - 0.1, clothM, wallX + sx * (NDEP / 2 + 0.02), y0, zc);        // the mattress, in the niche
            H2.box(rM, 0.3, 0.14, 0.7, pillowM, wallX + sx * 0.3, y0 + 0.2, zc + 0.6);                       // the pillow
          }
          H2.box(rM, 1.9, 0.8, 1.4, M2.stoneSmooth, at(1.9), FL, zc);                                       // the stone to go up by from the floor
        }
        for (const [sx2, sz2] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {   // the corner chambers' roofs: three terraces against the long wall
          const [cx, cz] = chC(sx2, sz2), par = (sx2 > 0 && sz2 < 0) ? rRne : rR, wz = Z + sz2 * (D / 2 - 1);
          for (let k = 0; k < 3; k++) H2.box(par, 2 * RMX, 1, 2.4 - 0.8 * k, M2.stoneSmooth, cx, FL + CHH + 0.3 + k, wz - sz2 * (2.4 - 0.8 * k) / 2);
        }
        ctx2.shared.rovdin = { mode: "rosh", set(m) { this.mode = m === "mefaresh" ? "mefaresh" : "rosh"; rR.visible = rRne.visible = this.mode === "rosh"; rM.visible = this.mode === "mefaresh"; return this.mode; } };
        ctx2.layers = ctx2.layers || {}; ctx2.layers.rovdinR = rR; ctx2.layers.rovdinM = rM;
        const RV = { info: "**רובדין של אבן** (מידות א, ח): ״מקף רובדין של אבן, וזקני בית אב ישנים שם״. להרא״ש, לברטנורא, לרמב״ם ולתפארת ישראל — אצטבאות של אבן זו על גבי זו, כעין מדריגות; למפרש — גומחות בכותל כעין מטות, ואבנים בולטות מן הכותל לעלות אליהן. המתג — בתפריט, ״רובדין של אבן בבית המוקד״.", refs: [["מידות א, ח", { book: 89, index: 9 }], ["פירוש הרא״ש תמיד כה:", { book: 2224, index: 9 }], ["המפרש תמיד כה:", { book: 2105, index: 9 }]] };   // QUOTES_Q: מידות א, ח (89:9): 'מקף' בלי ו׳
        ctx2.labels.push(Object.assign({ text: "רובדין של אבן — זקני בית אב ישנים שם", x: X, y: FL + 3.5, z: Z, size: 1.2, layer: "rovdinR" }, RV),
          Object.assign({ text: "רובדין — גומחות בכותל ואבנים לעלות אליהן (המפרש)", x: X, y: FL + 6.2, z: Z, size: 1.1, layer: "rovdinM" }, RV));
        // ROVDIN_SEE_S2 (fix-s2, 23.11.2026 - the user's decision 199 ב): A VIEWING SWITCH, not a reading - the pill "כל הרובדין" on בית
        // המוקד: its dome and the chambers' roofs off (the pill "פתח את הלשכות"), and the hall's own tall walls and gates as glass, so that
        // the benches of both walls are seen together, in each reading; again - all back (the roofs only if it opened them). The hall's
        // pieces are found by their bounds: inside its plan (its gates' open leaves too), ten amot high or more (the corner chambers' low walls stay)
        {
          let on = false, saved = null, openedRoofs = false;
          const glassOf = new Map();
          const hallParts = () => {
            const out = [], bb = new Box3();
            g.updateMatrixWorld(true);
            g.traverse((o) => {
              if (!(o.isMesh || o.isInstancedMesh) || !o.material || Array.isArray(o.material)) return;
              try { bb.setFromObject(o); } catch (_) { return; }
              if (bb.isEmpty() || bb.max.y - bb.min.y < 10 || bb.max.y < FL + 10 || bb.min.y < 13) return;   // (not the base under its outer part)
              const cx = (bb.min.x + bb.max.x) / 2, cz = (bb.min.z + bb.max.z) / 2;   // inside its plan - its gates' open leaves too
              if (Math.abs(cx - X) > W / 2 + 6 || Math.abs(cz - Z) > D / 2 + 6 || bb.max.x - bb.min.x > W + 4 || bb.max.z - bb.min.z > D + 4) return;
              out.push(o);
            });
            return out;
          };
          const MBr = ctx2.shared.modelButtons || (ctx2.shared.modelButtons = []);
          const roofsPill = () => MBr.find((b) => b && b.id === "crt-lishkot-roofs") || null;
          MBr.push({
            id: "moked-rovdin", label: "כל הרובדין", labelOn: "החזר את בית המוקד", removal: true, maxDist: 160,
            title: "מראה את כל הרובדין שבבית המוקד יחד: הכיפה וגגות הלשכות מוסרים, וכותלי האולם הגבוהים ושעריו שקופים. בכל אחת משתי השיטות. כלי צפייה בלבד.",
            anchor: () => [X, FL + 4.5, Z + D / 2 + 1.5],
            get: () => on,
            set: (v) => {
              v = !!v;
              if (v === on) return;
              on = v;
              const R = roofsPill();
              if (on) {
                if (R && !R.get()) { R.set(true); openedRoofs = true; } else openedRoofs = false;
                saved = [];
                for (const o of hallParts()) {
                  let gm = glassOf.get(o.material);
                  if (!gm) { gm = o.material.clone(); gm.transparent = true; gm.opacity = 0.2; gm.depthWrite = false; glassOf.set(o.material, gm); }
                  saved.push([o, o.material, o.castShadow]);
                  o.material = gm; o.castShadow = false;
                }
              } else {
                for (const [o, m, cs] of saved || []) { o.material = m; o.castShadow = cs; }
                saved = null;
                if (R && openedRoofs && R.get()) R.set(false);
                openedRoofs = false;
              }
              if (ctx2.requestRender) ctx2.requestRender();
            }
          });
        }
      }
      // 1.5.0 (the user: "צייר את פנים בית המוקד"): the hearth - "בית המוקד" is named for the great fire kept there, by which the priests warmed
      // themselves (Tamid 1:1 with the Rambam's commentary; Shabbat 20a): a stone ring, logs and a flame in the middle of the hall; and in the
      // north-west chamber the steps going down to the bath (Tamid 1:1 "ומסיבה היתה תחת הבירה... ויורד וטובל")
      {
        H2.ring(g, 2.4, 0.35, M2.stoneSmooth, X, FL + 0.25, Z);
        H2.cyl(g, 2.1, 2.1, 0.3, ember, X, FL + 0.1, Z);
        for (let i = 0; i < 6; i++) { const lg = H2.cyl(g, 0.22, 0.22, 3, M2.cedar, X, FL - 0.95 + (i % 2) * 0.45, Z); lg.rotation.z = HP; lg.rotation.y = i * 0.52; }
        // 1.9.1 (the user: "בבית המוקד כדאי לעשות אש אמיתית"): the two cones are gone - the hearth burns with the altar's live flames (the
        // shader of 40-altar.js, made there for this place: ctx2.shared.mokedFire = { x, y, z }); the light flickers as before
        ctx2.shared.mokedFire = { x: X, y: FL + 0.4, z: Z };
        const light = new PointLight(16748608, 14, 30, 2); light.position.set(X, FL + 3.5, Z); g.add(light);
        ctx2.animated.push((t) => { light.intensity = 13 + Math.sin(t * 0.013) * 3 + Math.sin(t * 0.041) * 1.5; });
        lbl("המוקד — אש גדולה להתחמם בה", X, FL + 6, Z + 3, 1.1);
        // ===== MESIBAH_303 (the user, 18.11.2026: "תפרסם רק אחרי המסיבה ובית הטבילה" - the plan he took): THE WAY DOWN TO THE BATH.
        // Tamid 1:1 (book 88, line 2): "ארע קרי לאחד מהן, יוצא והולך לו במסבה ההולכת תחת הבירה, והנרות דולקין מכאן ומכאן, עד שהוא מגיע
        // לבית הטבילה. ומדורה היתה שם, ובית כסא של כבוד... ירד וטבל, עלה ונסתפג ונתחמם כנגד המדורה"; Middot 1:6 (89, line 7): "צפונית
        // מערבית, בה יורדים לבית הטבילה". The Mefaresh on Tamid 26a (book 2105, lines 17-22): the mesibah - "עמוד של בנין שעולין ויורדין בו
        // ע"י גלגול"; its one end open to the chamber of Beit HaMoked, the other "חוץ לעזרה אל מקום הטבילה"; "ולכך עשו מחילה דמחילות לא
        // נתקדשו"; the lamps "במחילה כדי להאיר לו"; the fire "במחילה סמוך לבית הטבילה"; on 26b (line 44), of the bath over the water gate:
        // "כמין חקיקה אמה על אמה ברום שלש אמות". So: from the mouth in the north-west chamber's floor a winding stair round a pillar, down to
        // a tunnel's floor seven amot under the mount's; the tunnel south, under the house's holy half, and west along the court's
        // north-west, under its west wall and the chel, to the bath - a room, and in it a pool of an amah by an amah, three deep, with steps
        // down into it; a lamp on each side every four amot; the fire in a niche on the south side by the bath, the toilet opposite, its
        // door open ("פתוח, יודע שאין שם אדם"). The light under the ground is drawn into the surfaces (the lamps' and the fire's - vertex
        // colours on plain materials): no light is added to the scene. ctx2.shared.tevilaWay - for the demonstration (50-heichal.js,
        // MESIBAH_DEMO); ctx2.shared.features.mesibahSee - the way seen through the ground (an x-ray: each piece's twin is drawn only where
        // the ground hides it). The course, the depth, the breadth (2) and the height (4), the rooms, the lamps' and the fire's form -
        // model choices. (The mouth's hole goes through the floor, the house's base and the mount's floor: FLOOR_211 above, 20-mount.js.)
        {
          const [MX, MZ] = chC(-1, -1);                                   // the north-west chamber's middle: the mouth (-28.25, -73.25)
          const YF = -7, YC = -3, YR = -2.5, SH = 1.74, COLR = 0.35, NST = 45, RISE = 0.5;   // the floors and ceilings; the stair's half-breadth (in the mouth's 1.75), pillar, steps
          const root = new Group();
          root.name = "tevilaWay";
          g.add(root);
          const noRay = () => {};
          // ---- the lamps and the fire first: every surface's light is drawn from them
          const LAMPS = [];
          const lamp = (wx, y, wz, nx, nz) => LAMPS.push({ wx, y, wz, nx, nz });
          for (const z of [-69.5, -65.5, -61.5]) { lamp(MX - 1, YF + 2.2, z, 1, 0); lamp(MX + 1, YF + 2.2, z, -1, 0); }   // the tunnel, south
          for (let x = -31.25; x > -96; x -= 4) { lamp(x, YF + 2.2, -59, 0, 1); lamp(x, YF + 2.2, -57, 0, -1); }      // and west
          for (const k of [9, 15, 21, 27, 33, 39]) { const e = (k - 9) % 12 === 0; lamp(e ? MX + SH : MX - SH, 17.95 - RISE * k, MZ, e ? -1 : 1, 0); }   // the stair: every half turn
          lamp(MX + SH, -4.3, MZ, -1, 0);                                 // at the stair's foot, by its last step (east)
          lamp(-103.2, YF + 2.4, -61.2, 0, 1); lamp(-101.2, YF + 2.4, -54.8, 0, -1); lamp(-98, YF + 2.4, -60.5, -1, 0);   // the bath
          lamp(-97.6, YF + 2.2, -60.6, 1, 0);                             // the toilet
          for (const L of LAMPS) L.f = [L.wx + L.nx * 0.24, L.y + 0.07, L.wz + L.nz * 0.24];   // the flame, at the lamp's nozzle
          const FIRE = { x: -96.6, z: -56.3 };
          const LIT = LAMPS.map((L) => [L.f[0], L.f[1] + 0.06, L.f[2], 0.8, 1.05]).concat([[FIRE.x, YF + 0.8, FIRE.z, 2.2, 2.0]]);   // [x, y, z, strength, reach]
          const AMB = [0.022, 0.022, 0.028];
          const inShaft = (x, z) => Math.abs(x - MX) < SH + 0.05 && Math.abs(z - MZ) < SH + 0.05;
          const shade = (x, y, z, nx, ny, nz) => {
            let r = AMB[0], gg = AMB[1], b = AMB[2];
            if (inShaft(x, z) && y > 6) { const k = Math.min(1, (y - 6) / 10), d = 0.32 * k * k * k; r += d; gg += d * 0.97; b += d * 0.92; }   // the day, from the chamber above
            for (const L of LIT) {
              const dx = L[0] - x, dy = L[1] - y, dz = L[2] - z, d2 = dx * dx + dy * dy + dz * dz;
              if (d2 > 49) continue;
              const d = Math.sqrt(d2) || 1e-4, ndl = (nx * dx + ny * dy + nz * dz) / d;
              if (ndl <= 0) continue;
              const f = L[3] * (0.25 + 0.75 * ndl) * Math.exp(-d2 / (2 * L[4] * L[4]));   // a pool of light round each flame
              r += f; gg += f * 0.74; b += f * 0.46;
            }
            return [Math.min(1.15, r), Math.min(1.05, gg), Math.min(0.9, b)];
          };
          // ---- the surfaces: in buffers by material, each face cut to half an amah (that its light is smooth)
          const mWall = new MeshBasicMaterial({ map: M2.stoneSmooth.map, vertexColors: true });
          const mFloor = new MeshBasicMaterial({ map: M2.stone.map, vertexColors: true });
          const BUF = new Map();
          const buf = (m) => { let b = BUF.get(m); if (!b) { b = { pos: [], col: [], uv: [], idx: [] }; BUF.set(m, b); } return b; };
          const put = (B, p, n, u, v) => {
            B.pos.push(p[0], p[1], p[2]);
            const c = shade(p[0], p[1], p[2], n[0], n[1], n[2]);
            B.col.push(c[0], c[1], c[2]);
            B.uv.push(u, v);
            return B.pos.length / 3 - 1;
          };
          // a rectangle on the plane ax = v, over [u0, u1] x [w0, w1] of the other two (x: z, y; y: x, z; z: x, y), facing sg along ax
          const WALLS = [];   // (for the walk: the walls' solid slabs, below)
          const rect = (m, ax, v, u0, u1, w0, w1, sg) => {
            if (u1 - u0 < 1e-4 || w1 - w0 < 1e-4) return;
            if (ax !== "y") WALLS.push([ax, v, u0, u1, w0, w1, sg]);
            const B = buf(m), nu = Math.max(1, Math.ceil((u1 - u0) / 0.5 - 1e-6)), nw = Math.max(1, Math.ceil((w1 - w0) / (ax === "y" ? 0.5 : 0.6) - 1e-6));
            const n = ax === "x" ? [sg, 0, 0] : ax === "y" ? [0, sg, 0] : [0, 0, sg], i0 = B.pos.length / 3;
            for (let j = 0; j <= nw; j++) for (let i = 0; i <= nu; i++) {
              const u = u0 + (u1 - u0) * i / nu, w = w0 + (w1 - w0) * j / nw;
              put(B, ax === "x" ? [v, w, u] : ax === "y" ? [u, v, w] : [u, w, v], n, u, w);
            }
            const flip = sg !== (ax === "z" ? 1 : -1);
            for (let j = 0; j < nw; j++) for (let i = 0; i < nu; i++) {
              const a = i0 + j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
              if (flip) B.idx.push(a, d, b, a, c, d); else B.idx.push(a, b, d, a, d, c);
            }
          };
          // four points of one plane, wound to face n
          const quad4 = (m, P, n, uvs) => {
            const B = buf(m);
            const e1 = [P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]], e2 = [P[2][0] - P[0][0], P[2][1] - P[0][1], P[2][2] - P[0][2]];
            const cx = e1[1] * e2[2] - e1[2] * e2[1], cy = e1[2] * e2[0] - e1[0] * e2[2], cz = e1[0] * e2[1] - e1[1] * e2[0];
            const k = P.map((p, i) => put(B, p, n, uvs[i][0], uvs[i][1]));
            if (cx * n[0] + cy * n[1] + cz * n[2] >= 0) B.idx.push(k[0], k[1], k[2], k[0], k[2], k[3]); else B.idx.push(k[0], k[2], k[1], k[0], k[3], k[2]);
          };
          // ---- the rooms: boxes in plan, one floor (YF), each its ceiling; the walls where a room meets the rock or a lower ceiling
          const ROOMS = [
            { x0: MX - SH, x1: MX + SH, z0: MZ - SH, z1: MZ + SH, c: FL, open: true },   // the stair's shaft, open to the chamber
            { x0: MX - 1, x1: MX + 1, z0: MZ + SH, z1: -57, c: YC },                      // the tunnel, south, under the house's holy half
            { x0: -98, x1: MX + 1, z0: -59, z1: -57, c: YC },                              // and west, along the court's north-west, under its west wall and the chel
            { x0: -97.6, x1: -95.6, z0: -57, z1: -55.6, c: YC },                          // the fire's niche
            { x0: -97.6, x1: -95.4, z0: -61.7, z1: -59.3, c: YC },                        // the toilet
            { x0: -97.1, x1: -95.9, z0: -59.3, z1: -59, c: YF + 3.3 },                    // its doorway
            { x0: -104.4, x1: -98, z0: -61.2, z1: -54.8, c: YR }                          // the bath
          ];
          const POOL = { x0: -104.4, x1: -100.4, z0: -58.5, z1: -57.5 };
          const r3 = (v) => Math.round(v * 1000) / 1000;
          const cutsOf = (a0, a1, extra) => Array.from(new Set(ROOMS.map((r) => r[a0]).concat(ROOMS.map((r) => r[a1]), extra).map(r3))).sort((p, q) => p - q);
          const XS = cutsOf("x0", "x1", [POOL.x0, POOL.x1]), ZS = cutsOf("z0", "z1", [POOL.z0, POOL.z1]);
          const CELL = XS.slice(1).map((_, i) => ZS.slice(1).map((__, j) => {
            const xm = (XS[i] + XS[i + 1]) / 2, zm = (ZS[j] + ZS[j + 1]) / 2, rs = ROOMS.filter((r) => xm > r.x0 && xm < r.x1 && zm > r.z0 && zm < r.z1);
            if (!rs.length) return null;
            return { c: Math.max(...rs.map((r) => r.c)), open: rs.some((r) => r.open), pool: xm > POOL.x0 && xm < POOL.x1 && zm > POOL.z0 && zm < POOL.z1 };
          }));
          const cellAt = (i, j) => (i < 0 || j < 0 || i >= XS.length - 1 || j >= ZS.length - 1 ? null : CELL[i][j]);
          for (let i = 0; i + 1 < XS.length; i++) for (let j = 0; j + 1 < ZS.length; j++) {
            const C = CELL[i][j];
            if (!C) continue;
            const x0 = XS[i], x1 = XS[i + 1], z0 = ZS[j], z1 = ZS[j + 1];
            if (!C.pool) rect(mFloor, "y", YF, x0, x1, z0, z1, 1);
            if (!C.open) rect(mWall, "y", C.c, x0, x1, z0, z1, -1);
            for (const [di, dj, ax, v, sg] of [[-1, 0, "x", x0, 1], [1, 0, "x", x1, -1], [0, -1, "z", z0, 1], [0, 1, "z", z1, -1]]) {
              const nb = cellAt(i + di, j + dj), bot = !nb ? YF : nb.c < C.c - 1e-4 ? nb.c : null;
              if (bot === null) continue;
              if (ax === "x") rect(mWall, "x", v, z0, z1, bot, C.c, sg); else rect(mWall, "z", v, x0, x1, bot, C.c, sg);
            }
          }
          // ---- the pool: five steps down from the east (half an amah each, risers of 0.525), then its floor, an amah and a half long -
          // the water 3 deep over an amah by an amah ("ברום שלש אמות"), its face just under the room's floor
          const PB = YF - 3.15, RP = 0.525;
          {
            let xe = POOL.x1;
            for (let i = 0; i < 5; i++) {
              const xw = xe - 0.5, top = YF - RP * (i + 1);
              rect(mFloor, "y", top, xw, xe, POOL.z0, POOL.z1, 1);
              rect(mWall, "x", xe, POOL.z0, POOL.z1, top, YF - RP * i, -1);
              rect(mWall, "z", POOL.z0, xw, xe, top, YF, 1);
              rect(mWall, "z", POOL.z1, xw, xe, top, YF, -1);
              xe = xw;
            }
            rect(mFloor, "y", PB, POOL.x0, xe, POOL.z0, POOL.z1, 1);
            rect(mWall, "x", xe, POOL.z0, POOL.z1, PB, YF - RP * 5, -1);
            rect(mWall, "z", POOL.z0, POOL.x0, xe, PB, YF, 1);
            rect(mWall, "z", POOL.z1, POOL.x0, xe, PB, YF, -1);
            rect(mWall, "x", POOL.x0, POOL.z0, POOL.z1, PB, YF, 1);
          }
          // ---- the stair: 45 steps of half an amah round the pillar (30 degrees each, going down sunwise: in from the south edge of the
          // mouth westward, out at the foot on the east side southward - to the tunnel); each a slab from the pillar to the shaft's walls
          const D2R = Math.PI / 180;
          const onSq = (a) => { const s = Math.sin(a), c = Math.cos(a), t = SH / Math.max(Math.abs(s), Math.abs(c)); return [MX + t * s, MZ + t * c]; };
          const onCol = (a) => [MX + COLR * Math.sin(a), MZ + COLR * Math.cos(a)];
          for (let k = 0; k < NST; k++) {
            const a0 = -(k + 1) * 30, a1 = -k * 30, top = FL - RISE * (k + 1), bot = top - RISE;
            const A = [a0, a0 + 10, a0 + 20, a1];
            for (let c = 45 - 90 * 20; c < 400; c += 90) if (c > a0 + 1e-6 && c < a1 - 1e-6) A.push(c);   // a corner of the square within the step
            A.sort((p, q) => p - q);
            const R = A.map((d) => d * D2R);
            for (let q = 0; q + 1 < R.length; q++) {
              const i0 = onCol(R[q]), i1 = onCol(R[q + 1]), o0 = onSq(R[q]), o1 = onSq(R[q + 1]);
              for (const [y, n] of [[top, [0, 1, 0]], [bot, [0, -1, 0]]]) {
                quad4(mFloor, [[i0[0], y, i0[1]], [o0[0], y, o0[1]], [o1[0], y, o1[1]], [i1[0], y, i1[1]]], n, [[i0[0], i0[1]], [o0[0], o0[1]], [o1[0], o1[1]], [i1[0], i1[1]]]);
              }
            }
            for (const [d, sg] of [[a0, -1], [a1, 1]]) {   // its two ends: the riser (toward the step below) and the end under the step above
              const r = d * D2R, i0 = onCol(r), o0 = onSq(r), n = [sg * Math.cos(r), 0, -sg * Math.sin(r)], L = Math.hypot(o0[0] - i0[0], o0[1] - i0[1]);
              quad4(mWall, [[i0[0], bot, i0[1]], [o0[0], bot, o0[1]], [o0[0], top, o0[1]], [i0[0], top, i0[1]]], n, [[0, bot], [L, bot], [L, top], [0, top]]);
            }
          }
          // the toilet's seat: a stone bench along its north wall, its hole dark
          {
            const sx0 = -97.35, sx1 = -95.65, sz0 = -61.7, sz1 = -61.05, sy = YF + 0.9;
            rect(mWall, "y", sy, sx0, sx1, sz0, sz1, 1);
            rect(mWall, "z", sz1, sx0, sx1, YF, sy, 1);
            rect(mWall, "x", sx0, sz0, sz1, YF, sy, -1);
            rect(mWall, "x", sx1, sz0, sz1, YF, sy, 1);
          }
          let floorMesh = null;   // the floors and the treads: solid for the walk (90-entry.js ent_solids) - one walks down the stair and along the way
          for (const [m, B] of BUF) {
            const geo = new BufferGeometry();
            geo.setAttribute("position", new Float32BufferAttribute(B.pos, 3));
            geo.setAttribute("color", new Float32BufferAttribute(B.col, 3));
            geo.setAttribute("uv", new Float32BufferAttribute(B.uv, 2));
            geo.setIndex(B.idx);
            geo.computeBoundingSphere();
            const mesh = new Mesh(geo, m);
            if (m === mFloor) floorMesh = mesh;
            root.add(mesh);
          }
          // ---- the pillar, round, from the tunnel's floor to the chamber's floor
          {
            const H = FL + 0.04 - YF, cg = new CylinderGeometry(COLR, COLR, H, 16, Math.ceil(H / 0.6), true);
            cg.translate(MX, YF + H / 2, MZ);
            const p = cg.attributes.position, nr = cg.attributes.normal, uv = cg.attributes.uv, col = new Float32Array(p.count * 3);
            for (let i = 0; i < p.count; i++) {
              col.set(shade(p.getX(i), p.getY(i), p.getZ(i), nr.getX(i), nr.getY(i), nr.getZ(i)), i * 3);
              uv.setXY(i, uv.getX(i) * 2.2, uv.getY(i) * H);
            }
            cg.setAttribute("color", new Float32BufferAttribute(col, 3));
            root.add(new Mesh(cg, mWall));
            const cap = new Mesh(new CircleGeometry(COLR, 16).rotateX(-HP), new MeshBasicMaterial({ map: M2.stoneSmooth.map, color: 0xa39a88 }));
            cap.position.set(MX, FL + 0.04, MZ);
            root.add(cap);
          }
          // ---- the water, and a ring on it (the demonstration's)
          const water = new Mesh(new PlaneGeometry(POOL.x1 - POOL.x0, POOL.z1 - POOL.z0).rotateX(-HP), new MeshBasicMaterial({ color: 0x2a4c58, transparent: true, opacity: 0.72, depthWrite: false }));
          water.position.set((POOL.x0 + POOL.x1) / 2, YF - 0.15, (POOL.z0 + POOL.z1) / 2);
          water.renderOrder = 3;
          root.add(water);
          const ripple = new Mesh(new RingGeometry(0.16, 0.24, 28).rotateX(-HP), new MeshBasicMaterial({ color: 0xcfe6ee, transparent: true, opacity: 0, depthWrite: false }));
          ripple.position.set(POOL.x0 + 0.75, YF - 0.14, (POOL.z0 + POOL.z1) / 2);
          ripple.visible = false;
          ripple.renderOrder = 4;
          root.add(ripple);
          // ---- the lamps: a stone shelf on the wall, a clay lamp on it, its flame; a glow round each flame
          const m4 = new Matrix4(), q4 = new Quaternion(), qI = new Quaternion(), s3 = new Vector3(), v3 = new Vector3(), YAX = new Vector3(0, 1, 0);
          const nL = LAMPS.length;
          const shelfI = new InstancedMesh(uvWorldBox(new BoxGeometry(0.3, 0.07, 0.24), 0.3, 0.07, 0.24), new MeshBasicMaterial({ color: 0x9c876a, map: M2.stoneSmooth.map }), nL);
          const bodyG = new SphereGeometry(0.1, 10, 6);
          bodyG.scale(1, 0.48, 1.35);
          const bodyI = new InstancedMesh(bodyG, new MeshBasicMaterial({ color: 0x9a5a34 }), nL);
          const flameG = new ConeGeometry(0.03, 0.11, 7);
          flameG.translate(0, 0.055, 0);
          const flameI = new InstancedMesh(flameG, new MeshBasicMaterial({ color: 0xffd27a }), nL);
          LAMPS.forEach((L, i) => {
            q4.setFromAxisAngle(YAX, Math.atan2(L.nx, L.nz));
            shelfI.setMatrixAt(i, m4.compose(v3.set(L.wx + L.nx * 0.12, L.y - 0.035, L.wz + L.nz * 0.12), q4, s3.set(1, 1, 1)));
            bodyI.setMatrixAt(i, m4.compose(v3.set(L.wx + L.nx * 0.13, L.y + 0.045, L.wz + L.nz * 0.13), q4, s3.set(1, 1, 1)));
            flameI.setMatrixAt(i, m4.compose(v3.set(L.f[0], L.f[1], L.f[2]), qI, s3.set(1, 1, 1)));
          });
          for (const I of [shelfI, bodyI, flameI]) { I.computeBoundingSphere(); root.add(I); }
          const glowTex = (() => {
            const c = document.createElement("canvas");
            c.width = c.height = 64;
            const x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
            gr.addColorStop(0, "rgba(255,226,160,1)");
            gr.addColorStop(0.22, "rgba(255,176,80,0.55)");
            gr.addColorStop(1, "rgba(255,120,30,0)");
            x.fillStyle = gr;
            x.fillRect(0, 0, 64, 64);
            return new CanvasTexture(c);
          })();
          const glows = [0, 1, 2].map((s) => {
            const pts = [];
            LAMPS.forEach((L, i) => { if (i % 3 === s) pts.push(L.f[0], L.f[1] + 0.05, L.f[2]); });
            const geo = new BufferGeometry();
            geo.setAttribute("position", new Float32BufferAttribute(pts, 3));
            const P = new Points(geo, new PointsMaterial({ size: 1.3, map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending, color: 0xffb060, opacity: 0.8 }));
            P.renderOrder = 5;
            root.add(P);
            return P;
          });
          // ---- the fire: a ring of stones, the embers, the logs; its flames are the altar's (40-altar.js, ctx2.shared.tevilaFire)
          {
            const stI = new InstancedMesh(new BoxGeometry(0.26, 0.2, 0.2), new MeshBasicMaterial({ color: 0x6a5c4e, map: M2.stoneSmooth.map }), 9);
            for (let i = 0; i < 9; i++) {
              const a = i / 9 * Math.PI * 2;
              q4.setFromAxisAngle(YAX, a);
              stI.setMatrixAt(i, m4.compose(v3.set(FIRE.x + Math.sin(a) * 0.55, YF + 0.1, FIRE.z + Math.cos(a) * 0.55), q4, s3.set(1, 1, 1)));
            }
            stI.computeBoundingSphere();
            root.add(stI);
            const emb = new Mesh(new CylinderGeometry(0.45, 0.48, 0.06, 16), new MeshBasicMaterial({ color: 0xff5a14 }));
            emb.position.set(FIRE.x, YF + 0.03, FIRE.z);
            root.add(emb);
            const logM = new MeshBasicMaterial({ color: 0x3a2414 });
            for (let i = 0; i < 4; i++) {
              const lg = new Mesh(new CylinderGeometry(0.06, 0.07, 0.85, 7), logM);
              lg.position.set(FIRE.x, YF + 0.12 + (i % 2) * 0.09, FIRE.z);
              lg.rotation.set(0, i * Math.PI / 4, HP, "YXZ");
              root.add(lg);
            }
            ctx2.shared.tevilaFire = { x: FIRE.x, y: YF + 0.14, z: FIRE.z };
            const fg = new BufferGeometry();
            fg.setAttribute("position", new Float32BufferAttribute([FIRE.x, YF + 0.75, FIRE.z], 3));
            const fp = new Points(fg, new PointsMaterial({ size: 5, map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending, color: 0xff8a3a, opacity: 0.85 }));
            fp.renderOrder = 5;
            root.add(fp);
            glows.push(fp);
          }
          // ---- the toilet: its seat's hole; its door, standing open into it
          {
            const hole = new Mesh(new CircleGeometry(0.17, 18).rotateX(-HP), new MeshBasicMaterial({ color: 0x0d0b09 }));
            hole.scale.set(1, 1, 0.75);
            hole.position.set(-96.5, YF + 0.905, -61.4);
            root.add(hole);
          }
          const door = new Group();
          door.position.set(-95.9, YF, -59.3);
          door.rotation.y = -1.75;
          root.add(door);
          {
            const leaf = new Mesh(uvWorldBox(new BoxGeometry(1.18, 3.25, 0.08), 1.18, 3.25, 0.08), new MeshBasicMaterial({ map: M2.cedar.map, color: 0x9a7650 }));
            leaf.position.set(-0.6, 1.625, -0.05);
            door.add(leaf);
            const ring = new Mesh(new TorusGeometry(0.07, 0.016, 6, 14), new MeshBasicMaterial({ color: 0x6e5a32 }));
            ring.position.set(-1.0, 1.55, -0.12);
            door.add(ring);
          }
          // ---- the towel ("ונסתפג"), on a peg on the bath's north wall by the pool; and its twin for the priest's hand
          const towelM = new MeshBasicMaterial({ color: 0xd9d2c2, map: TEX.plaster.map });
          const towel = new Mesh(new BoxGeometry(0.5, 0.85, 0.03), towelM);
          towel.position.set(-100.9, YF + 2.3 - 0.47, -61.17);
          root.add(towel);
          {
            const peg = new Mesh(new CylinderGeometry(0.025, 0.025, 0.14, 6).rotateX(HP), new MeshBasicMaterial({ color: 0x5a3e24 }));
            peg.position.set(-100.9, YF + 2.32, -61.13);
            root.add(peg);
          }
          const towelProp = new Mesh(new BoxGeometry(0.42, 0.8, 0.03).translate(0, -0.38, 0), towelM);
          towelProp.userData.noPick = true;
          // ---- the names, seen with the ground made clear (the layer "mesibahSee")
          const seeFlag = new Group();
          seeFlag.visible = false;
          ctx2.layers.mesibahSee = seeFlag;
          for (const [text, x, y, z] of [["המסבה — ״עמוד של בנין שעולין ויורדין בו ע״י גלגול״ (המפרש)", MX, 2, MZ - 2.6],
                                         ["המחילה — ״והנרות דולקין מכאן ומכאן״", -62, -1.2, -58],
                                         ["המדורה — ״ונתחמם כנגד המדורה״", FIRE.x, -2.4, -54.6],
                                         ["בית כסא של כבוד — פתוח: ״יודע שאין שם אדם״", -96.5, -1.2, -62.6],
                                         ["בית הטבילה — אמה על אמה, ברום שלש אמות", -102.4, -0.6, -58]]) {
            ctx2.labels.push({ text, x, y, z, size: 1.05, layer: "mesibahSee", onTop: true });
          }
          // ---- the x-ray: a twin of every piece, drawn only where something is in front of it (GreaterDepth), lighter
          const XR = [], xrMats = new Map();
          const xrOf = (m) => {
            let x = xrMats.get(m);
            if (!x) {
              x = m.clone();
              x.transparent = true;
              x.opacity = (m.transparent ? m.opacity : 1) * (m.blending === AdditiveBlending ? 0.9 : 0.55);
              x.depthWrite = false;
              x.depthTest = true;
              x.depthFunc = GreaterDepth;
              xrMats.set(m, x);
            }
            return x;
          };
          const pieces = [];
          root.traverse((o) => { if ((o.isMesh || o.isPoints) && o !== towelProp) pieces.push(o); });
          for (const o of pieces) {
            o.castShadow = o.receiveShadow = false;
            if (o !== floorMesh) { o.userData.noPick = true; o.raycast = noRay; }
            let t;
            if (o.isInstancedMesh) { t = new InstancedMesh(o.geometry, xrOf(o.material), o.count); t.instanceMatrix = o.instanceMatrix; t.boundingSphere = o.boundingSphere; }
            else if (o.isPoints) t = new Points(o.geometry, xrOf(o.material));
            else t = new Mesh(o.geometry, xrOf(o.material));
            t.visible = false;
            t.renderOrder = 30 + (o.renderOrder || 0);
            t.raycast = noRay;
            t.userData.noPick = true;
            t.castShadow = t.receiveShadow = false;
            o.add(t);
            XR.push(t);
          }
          // the walls, solid for the walk (90-entry.js ent_solids: the eye in the walking mode keeps to the way) - thin slabs behind them,
          // drawn neither in colour nor in depth; under the mount's floor only (above it its own pieces bound the mouth)
          {
            const parts = [];
            for (const [ax, v, u0, u1, w0, w1, sg] of WALLS) {
              const y1 = Math.min(w1, -1.5);
              if (y1 - w0 < 0.05) continue;
              const L = u1 - u0, c = (u0 + u1) / 2, off = v - sg * 0.06;
              const bg = ax === "x" ? new BoxGeometry(0.12, y1 - w0, L) : new BoxGeometry(L, y1 - w0, 0.12);
              bg.translate(ax === "x" ? off : c, (w0 + y1) / 2, ax === "x" ? c : off);
              parts.push(bg);
            }
            const cm = new Mesh(mergeGeometries(parts), new MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
            cm.name = "tevilaWalls";
            cm.castShadow = cm.receiveShadow = false;
            root.add(cm);
          }
          // the flames flicker (each its own way); the glows breathe, in three sets
          const PH = LAMPS.map((_, i) => [((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1, ((Math.sin(i * 78.233) * 12543.123) % 1 + 1) % 1]);
          let seeOn = false;
          // far from the way (and not seen through, nor walked) it is not drawn at all: nothing of it can be seen from there
          const BB = { x0: -106, x1: -24, y0: -11, y1: 17, z0: -77, z1: -53 };
          ctx2.animated.push((t) => {
            const cam = ctx2.camera;
            if (cam) {
              const p = cam.position, dx = Math.max(BB.x0 - p.x, 0, p.x - BB.x1), dy = Math.max(BB.y0 - p.y, 0, p.y - BB.y1), dz = Math.max(BB.z0 - p.z, 0, p.z - BB.z1);
              const want = dx * dx + dy * dy + dz * dz < 150 * 150 || seeOn || !!(ctx2.shared.tevilaDemo && ctx2.shared.tevilaDemo.on);
              if (root.visible !== want) root.visible = want;
            }
            if (!root.visible) return;
            const s = t * 0.001;
            LAMPS.forEach((L, i) => {
              const a = PH[i][0] * 6.283, b = PH[i][1] * 6.283, k = 1 + 0.2 * Math.sin(s * (7 + 3 * PH[i][0]) + a) + 0.1 * Math.sin(s * (17 + 5 * PH[i][1]) + b);
              flameI.setMatrixAt(i, m4.compose(v3.set(L.f[0], L.f[1], L.f[2]), qI, s3.set(1.05 - 0.1 * k, k, 1.05 - 0.1 * k)));
            });
            flameI.instanceMatrix.needsUpdate = true;
            glows.forEach((P, i) => { P.material.opacity = (i === 3 ? 0.78 : 0.72) + 0.12 * Math.sin(s * (5.3 + i * 1.7) + i * 2.1) + 0.06 * Math.sin(s * (13.1 + i) + i); });
          });
          // ---- the feature: the way seen through the ground (the place "המסיבה ובית הטבילה", 70-ui.js - on while it shows)
          const setSee = (v) => { seeOn = !!v; seeFlag.visible = seeOn; for (const t of XR) t.visible = seeOn; };
          ctx2.shared.features = ctx2.shared.features || {};
          ctx2.shared.features.mesibahSee = { key: "mesibahSee", timed: false, isOn: () => seeOn, on: () => setSee(true), off: () => setSee(false) };
          const FS = ctx2.shared.features.mesibahSee;
          ctx2.shared.mesibahSee = { set: (v) => (v ? FS.on() : FS.off()), get on() { return seeOn; } };   // the presentation's way (75-tour.js featureOf)
          // ---- for the demonstration (50-heichal.js MESIBAH_DEMO)
          ctx2.shared.tevilaWay = {
            MX, MZ, YF, YC, YR, FL, SH, NST, RISE, COLR, POOL, PB, RP, WATER: YF - 0.15, FIRE,
            TOWEL: [towel.position.x, towel.position.y, towel.position.z],
            stepTop: (k) => FL - RISE * (k + 1),
            towel, towelProp, ripple, door, root,
            see: (v) => setSee(v),
            get seeOn() { return seeOn; }
          };
        }
      }
      // the marble tablet with its ring, in the floor by the north-west chamber (the keys under it, 1:9)
      // KEY_SLAB_211 (stage ב; the user, 14.11.2026 22:22: the sleeping in Beit HaMoked and the key - into the demo as well): "ומקום היה
      // שם, אמה על אמה, וטבלא של שיש וטבעת היתה קבועה בה, ושלשלת שהמפתחות היו תלויות בה. הגיע זמן הנעילה, הגביה את הטבלא בטבעת ונטל
      // את המפתחות מן השלשלת... גמר מלנעול, החזיר את המפתחות לשלשלת ואת הטבלא למקומה, נתן כסותו עליה, ישן לו" (Middot 1:9; book 89,
      // line 10). Under the tablet the place of an amah by an amah (a dark hollow) with the chain and the keys on it - "נלע"ד שזה המקום היו
      // שמורים בתוכו שלשלת המפתחות ומכוסה המקום בטבלא של שיש" (Melechet Shlomo there; book 1210, line 44). ctx2.shared.mokedSlab.pose(v,
      // keys): the morning demo (55-tamid.js) lifts the tablet by its ring - its south edge stays on the floor - and takes the key (Tamid
      // 1:3 "נטל את המפתח"; Melechet Shlomo there, book 1202, line 31: "מתחת הטבלא של שיש"). The chain's and the keys' form - model choices.
      {
        const SX = X - 2, SZ = Z - 3, sg = new Group(), hinge = new Group(), keysG = new Group();
        sg.name = "mokedSlab";
        g.add(sg);
        const pit = new Mesh(new BoxGeometry(0.96, 0.02, 0.96), darkMat);
        pit.position.set(SX, FL + 0.011, SZ);
        sg.add(pit);
        keysG.position.set(SX, FL + 0.03, SZ);
        sg.add(keysG);
        const linkG = new TorusGeometry(0.035, 0.009, 6, 12);
        for (let i = 0; i < 7; i++) { const l = new Mesh(linkG, M2.bronze); l.position.set(0, 0, -0.42 + i * 0.055); l.rotation.y = i % 2 ? HP : 0; keysG.add(l); }
        const kr = new Mesh(new TorusGeometry(0.06, 0.011, 8, 20), M2.bronze);
        kr.rotation.x = HP;
        kr.position.set(0, 0, 0.0);
        keysG.add(kr);
        const shaftG = new CylinderGeometry(0.012, 0.012, 0.28, 6), bitG = new BoxGeometry(0.05, 0.012, 0.05), bowG = new TorusGeometry(0.03, 0.009, 6, 12);
        [-0.55, 0.15, 0.85].forEach((an) => {
          const k = new Group();
          const sh = new Mesh(shaftG, M2.bronze); sh.rotation.x = HP; sh.position.z = 0.2; k.add(sh);
          const bit = new Mesh(bitG, M2.bronze); bit.position.set(0.03, 0, 0.32); k.add(bit);
          const bow = new Mesh(bowG, M2.bronze); bow.rotation.x = HP; bow.position.z = 0.06; k.add(bow);
          k.rotation.y = an;
          keysG.add(k);
        });
        hinge.position.set(SX, FL + 0.02, SZ + 0.5);
        sg.add(hinge);
        const tab = new Mesh(uvWorldBox(new BoxGeometry(1, 0.08, 1), 1, 0.08, 1), M2.marble);
        tab.position.set(0, 0.04, -0.5);
        tab.castShadow = tab.receiveShadow = true;
        hinge.add(tab);
        const rg = new Mesh(new TorusGeometry(0.18, 0.04, 10, 28), M2.bronze);
        rg.rotation.x = HP;
        rg.position.set(0, 0.12, -0.5);
        hinge.add(rg);
        ctx2.shared.mokedSlab = { x: SX, z: SZ, y: FL, pose(v, keys = true) { hinge.rotation.x = 1.15 * Math.min(1, Math.max(0, v)); keysG.visible = !!keys; } };
      }
      lbl("טבלא של שיש וטבעת — המפתחות", X - 2, FL + 1.7, Z - 3, 0.9);
      // LECHEM_211 (the user, 15.11.2026: "לשכת עושי לחם הפנים — חפש עכשיו מקורות וצייר את תוכה"; of the three ways shown to him:
      // "אפשרות 3" - a switch): THE CHAMBER OF THE SHOWBREAD'S MAKERS, the south-east room (Middot 1:6; Tamid 3:3; the Bartenura:
      // "בית גרמו היו עושים לחם הפנים שם"). What was done in it - two readings (ctx2.shared.lechemMakers.set("bake" | "knead");
      // ctx2.layers.lechemKnead):
      //  "bake" (the default): "לישתן ועריכתן בחוץ, ואפיתן בפנים" (Menachot 11:2; the Rambam, Temidin uMusafin 5:7) - the chamber,
      //   in the house's holy half, is for the baking: "וסמוכה לעזרה ונמצאת שהיתה מקודשת, אתיא כמ"ד אפייתן בפנים" (Tosafot Yom
      //   Tov, Middot 1:6; book 948, line 47);
      //  "knead": "שם לשין ואופין אותן במקום הקודש" (the Yachin there; book 819, line 98), as R. Yehuda's "כל מעשיהם בפנים" - the
      //   trough, the eleven sieves ("ולחם הפנים באחת עשרה", Menachot 6:7), the flour and the water as well, and a second man.
      // In both: THE OVEN, of metal ("תנור של מקדש – של מתכת היה", Zevachim 95b), heated from inside ("מסיקין מבפנים ואופין
      // מבפנים", Yoma 38a), two loaves in it at once ("ונאפה שנים שנים", Menachot 11:1), each in its mould - "כמין כוורת היה לה
      // בתנור" (Menachot 95a), "מנוקב ככוורת של קנים שישלוט האור בכולו" (Tosafot there); THE THREE MOULDS, of gold (the Rambam
      // 5:8): the first with the dough in it, the oven's, and the third, in which the loaf is set when it is drawn out "כדי שלא
      // תתקלקל" (Menachot 94a); ten loaves ready on a board and the two in the oven - twelve (the Rambam 5:2) - each "כמין תיבה
      // פרוצה" as on the table (45-vessels.js: five tefachim by six, its two ends two tefachim up; the Rambam 5:9); a baker
      // drawing a loaf out with his peel. THE MEN ARE LEVITES, of the sons of Kehat (the user, 15.11.2026, 03:15, with the sources:
      // "תעשה כך - אנו תמיד נצמדים למקורות"; 03:16: "לווים לא היו בבגדי כהונה"): "ומן בני הקהתי מן אחיהם על לחם המערכת להכין שבת
      // שבת" (I Chr 9:32; book 38, line 404); "בית גרמו היו עושין מעשה לחם הפנים ... נוטלין שכרן מתרומת הלשכה" (Tosefta Shekalim
      // 2:6; book 193, line 16); the Bartenura, Middot 1:6. That the house of Garmu themselves were Levites is not written in so
      // many words - it is the verse and the Bartenura put together, and the card says so. Their dress: a plain robe and a plain
      // cap, no hat and no sash - a model choice (no source was found for a Levite's dress at his work). MODEL CHOICES: the places of all these in the room, the oven's size and look (which
      // metal is not said), the board, the table, the wood, the men, their number and their dress.
      {
        const [bx, bz] = chC(1, 1);   // (-7.75, -61.75): inside x -12.5..-3, z -65..-58.5; the doorway in the north wall, at x -11
        const LG = new Group(), KN = new Group();
        LG.name = "lechemChamber"; KN.name = "lechemKnead";
        KN.visible = false;
        g.add(LG); g.add(KN);
        ctx2.layers.lechemKnead = KN;
        ctx2.shared.lechemMakers = { mode: "bake", set(m) { this.mode = m === "knead" ? "knead" : "bake"; KN.visible = this.mode === "knead"; return this.mode; } };
        const TEF = 1 / 6;
        const gold = new MeshStandardMaterial({ color: 0xd9a72e, metalness: 0.85, roughness: 0.32 });
        const metal = new MeshStandardMaterial({ color: 0x6a4a30, metalness: 0.75, roughness: 0.5, side: DoubleSide });
        const crust = new MeshStandardMaterial({ color: 0xc98a3c, roughness: 0.85 }), dough = new MeshStandardMaterial({ color: 0xead9b0, roughness: 0.95 });
        const clay = new MeshStandardMaterial({ color: 0xb07a52, roughness: 0.9 }), flour = new MeshStandardMaterial({ color: 0xf4efe2, roughness: 1 });
        const wood = M2.cedar;
        const loafGeo = (() => {   // one loaf: the floor five tefachim by six, the two ends two tefachim up
          const parts = [], bb = (w, h, d, x, y, z) => { const q = new BoxGeometry(w, h, d); q.translate(x, y + h / 2, z); parts.push(q); };
          const LX = 2.5 * TEF, LZ = 0.5, LT = 0.5 * TEF, LH = 2 * TEF;
          bb(2 * LX, LT, 2 * LZ, 0, 0, 0);
          for (const s of [-1, 1]) bb(2 * LX, LH, LT, 0, 0, s * (LZ - LT / 2));
          return mergeGeometries(parts);
        })();
        // SHOWBREAD_SHAPE_211: R. Yochanan's loaf (45-vessels.js int_boatLoaf), the default - every loaf here follows the row
        // "צורת לחם הפנים" (int_breadShape: the moulds stay open boxes - their form for R. Yochanan is not written: a model choice)
        const loafGeoB = int_boatLoaf(2.5 * TEF, 0.46, TEF / 8, 2 * TEF, 0.4 * TEF, 0.8 * TEF), BSH = int_breadShape(ctx2);
        crust.side = dough.side = DoubleSide;
        const loaf = (par, mat, x, y, z, ry) => { const m = new Mesh(loafGeo, mat); m.position.set(x, y, z); if (ry) m.rotation.y = ry; m.castShadow = m.receiveShadow = true; par.add(m); BSH.shaped(m, loafGeo, loafGeoB); return m; };
        const holesTex = (() => {   // the oven's mould: gold pierced like a basket
          const cv = document.createElement("canvas");
          cv.width = cv.height = 64;
          const c = cv.getContext("2d");
          c.fillStyle = "#d9a72e"; c.fillRect(0, 0, 64, 64);
          c.fillStyle = "#3a2608";
          for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.beginPath(); c.arc(8 + i * 16, 8 + j * 16, 3.6, 0, Math.PI * 2); c.fill(); }
          const tx = new CanvasTexture(cv);
          tx.wrapS = tx.wrapT = RepeatWrapping; tx.repeat.set(3, 2); tx.colorSpace = SRGBColorSpace;
          return tx;
        })();
        const pierced = new MeshStandardMaterial({ color: 0xffffff, map: holesTex, metalness: 0.6, roughness: 0.4 });
        const mould = (par, mat, x, y, z, ry) => {   // an open box a little larger than the loaf
          const grp = new Group(), W2 = 2.5 * TEF + 0.06, Z2 = 0.5 + 0.06, Hm = 2 * TEF + 0.06, T = 0.035;
          const add = (w, h, d, px, py, pz) => { const m = new Mesh(new BoxGeometry(w, h, d), mat); m.position.set(px, py + h / 2, pz); m.castShadow = true; grp.add(m); };
          add(2 * W2, T, 2 * Z2, 0, -T, 0);
          for (const s of [-1, 1]) { add(2 * W2, Hm, T, 0, 0, s * Z2); add(T, Hm, 2 * Z2, s * W2, 0, 0); }
          grp.position.set(x, y, z);
          if (ry) grp.rotation.y = ry;
          par.add(grp);
          return grp;
        };
        // THE OVEN in the south-east corner: a wide vessel of metal, its mouth up, on a stone footing; coals within, the stoking
        // hole at its foot, and the two loaves in their pierced moulds side by side in its mouth
        const ox = bx + 2.6, oz = bz + 1.1, OY = FL + 0.3;
        H2.cyl(LG, 2.0, 2.05, 0.3, M2.stoneSmooth, ox, FL, oz, 28);
        H2.lathe(LG, [[1.85, 0], [1.62, 2.3], [1.42, 2.3], [1.5, 0.45], [0, 0.45]], metal, ox, OY, oz, 32);
        H2.cyl(LG, 1.45, 1.45, 0.08, ember, ox, OY + 0.46, oz, 24);
        { const hole = new Mesh(new BoxGeometry(0.12, 0.5, 0.62), darkMat); hole.position.set(ox - 1.78, OY + 0.32, oz); LG.add(hole); }
        ctx2.shared.ovenFire = { x: ox, y: OY + 0.5, z: oz };
        for (const s of [-1, 1]) { mould(LG, pierced, ox + s * 0.5, OY + 1.25, oz, 0); loaf(LG, crust, ox + s * 0.5, OY + 1.25, oz, 0); }
        // the table by the north wall: the first mould, the loaf in it still dough, and the third, with the loaf drawn out
        const tx0 = bx + 0.5, tz0 = bz - 2.5;
        H2.box(LG, 3.8, 0.12, 1.2, wood, tx0, FL + 1.4, tz0);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) H2.box(LG, 0.14, 1.4, 0.14, wood, tx0 + sx * 1.75, FL, tz0 + sz * 0.45);
        mould(LG, gold, tx0 - 1.1, FL + 1.56, tz0, HP); loaf(LG, dough, tx0 - 1.1, FL + 1.56, tz0, HP);
        mould(LG, gold, tx0 + 1.1, FL + 1.56, tz0, HP); loaf(LG, crust, tx0 + 1.1, FL + 1.56, tz0, HP);
        // the board by the west wall: ten loaves ready, five on each shelf
        const sx0 = bx - RMX + 0.7, sz0 = bz + 0.7;
        for (const yy of [1.15, 2.35]) {
          H2.box(LG, 1.2, 0.1, 4.8, wood, sx0, FL + yy, sz0);
          for (let i = 0; i < 5; i++) loaf(LG, crust, sx0, FL + yy + 0.1, sz0 - 1.8 + i * 0.9, HP);
        }
        for (const dz of [-2.3, 0, 2.3]) for (const dxp of [-0.5, 0.5]) H2.box(LG, 0.12, 2.35, 0.12, wood, sx0 + dxp, FL, sz0 + dz);
        // the wood by the south wall
        for (let i = 0; i < 6; i++) { const lg2 = H2.cyl(LG, 0.13, 0.13, 1.6, wood, bx - 1.0 + (i % 3) * 0.3, FL - 0.67 + Math.floor(i / 3) * 0.26, bz + 2.8, 8); lg2.rotation.z = HP; }
        // the baker at the oven, his face to it, drawing a loaf out on his peel ("כשהוא רודה")
        const PPK = tm_people(ctx2), ROBE = 0x8f8468;   // LECHEM_LEVI_211: the Levites' plain robe (the colour - a model choice)
        PPK.crowd(LG, [[ox - 3.0, oz, HP]], { y: FL, s: 1.5, pose: "stand", kind: "levi", robe: ROBE, tone: () => 1, name: "lechemBaker" });
        {
          const p0 = [ox - 2.55, FL + 2.12], p1 = [ox - 0.55, FL + 2.86], len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
          const pole = new Mesh(new BoxGeometry(len, 0.06, 0.06), wood);
          pole.position.set((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, oz); pole.rotation.z = ang; LG.add(pole);
          const pad = new Mesh(new BoxGeometry(1.05, 0.04, 0.9), wood);
          pad.position.set(p1[0] + 0.5, p1[1] + 0.02, oz); LG.add(pad);
          loaf(LG, crust, p1[0] + 0.5, p1[1] + 0.05, oz, HP);
        }
        lbl("תנור של מתכת — שתי חלות בבת אחת", ox - 1.2, FL + 3.7, oz - 1.2, 0.66);   // NOTE 6 (U-48, 2): above the oven's rim, which cut it
        // OVEN_LABEL_S1 (scan 1, finding 4): low over the oven's mouth and a little to its west (it stood 7.6 over the floor and 1.5 to the south,
        // beside the eye of the place's view - large, at the window's edge, its first words out of the picture; checked in pictures, 960 x 600)
        lbl("שלושה דפוסים של זהב — לבצק, לתנור ולחלה שנרדתה", tx0, FL + 2.5, tz0 + 0.9, 0.62);
        lbl("עשר חלות מוכנות, ושתיים בתנור", sx0 + 1.5, FL + 3.6, sz0 + 0.4, 0.62);
        // ---- the kneading (the Yachin's words; R. Yehuda): the trough and the dough, the kneader, the flour and the warm water, and
        // the eleven sieves on the south wall
        {
          const kx = bx - 2.3, kz = bz - 0.1;
          H2.box(KN, 0.9, 0.12, 1.9, wood, kx, FL + 0.95, kz);
          for (const s of [-1, 1]) { H2.box(KN, 0.9, 0.36, 0.08, wood, kx, FL + 1.07, kz + s * 0.91); H2.box(KN, 0.08, 0.36, 1.9, wood, kx + s * 0.41, FL + 1.07, kz); }
          for (const sx of [-1, 1]) for (const sz of [-1, 1]) H2.box(KN, 0.12, 0.95, 0.12, wood, kx + sx * 0.33, FL, kz + sz * 0.8);
          { const dg = new Mesh(new SphereGeometry(1, 14, 8), dough); dg.scale.set(0.3, 0.16, 0.62); dg.position.set(kx, FL + 1.2, kz); KN.add(dg); }
          PPK.crowd(KN, [[kx + 1.15, kz, -HP]], { y: FL, s: 1.5, pose: "stand", kind: "levi", robe: ROBE, tone: () => 2, name: "lechemKneader" });
          for (const [jx, jz, top] of [[bx - 2.5, bz + 1.5, flour], [bx - 1.6, bz + 2.0, null]]) {   // a jar of fine flour, a jar of warm water
            H2.lathe(KN, [[0.22, 0], [0.4, 0.45], [0.42, 0.9], [0.3, 1.2], [0.33, 1.3]], clay, jx, FL, jz, 16);
            if (top) H2.cyl(KN, 0.3, 0.3, 0.05, top, jx, FL + 1.18, jz, 14);
          }
          const ring1 = new TorusGeometry(0.4, 0.035, 6, 20), net = new MeshStandardMaterial({ color: 0xcdbb94, roughness: 1, transparent: true, opacity: 0.55, side: DoubleSide });
          const disc = new CircleGeometry(0.39, 20);
          let n = 0;
          for (const [yy, cnt, x0] of [[2.7, 4, bx - 3.3], [3.75, 4, bx - 3.3], [4.8, 3, bx - 2.8]]) for (let i = 0; i < cnt; i++, n++) {
            const sv = new Mesh(ring1, wood), dc = new Mesh(disc, net);
            sv.position.set(x0 + i * 0.98, FL + yy, bz + RMZ - 0.07); dc.position.copy(sv.position);
            KN.add(sv); KN.add(dc);
          }
          ctx2.labels.push({ text: "עריבה — הלישה (יכין; רבי יהודה: ״כל מעשיהם בפנים״)", x: kx + 0.3, y: FL + 3.3, z: kz, size: 0.75, layers: ["lechemKnead"] },
            { text: "אחת עשרה נפות (מנחות ו, ז)", x: bx - 1.9, y: FL + 5.5, z: bz + RMZ - 0.5, size: 0.75, layers: ["lechemKnead"] });
        }
      }
    }
    // (MOKED_VAULT_A2: the drum and the small dome on the flat roof (1.8.0) are gone - the hall's own vault, above)
    // 1.8.0: the four corner blocks of the solid house (until 1.3.0) removed - they stood inside the corner rooms
    // 1.9.5 (THREE_CHAMBERS_195): the Golah chamber stood here alone until 1.9.4 (annex at x 20, 14 x 14.5), with a second, unlabelled
    // well outside the wall at (32, -74) - both gone: the chamber is part of the one building of the three chambers, below
    // ===== 1.0.21: Lishkat HaGazit (Middot 5:4) - a hollow hall instead of a solid block.
    // Sources: Middot 5:4 (the Great Sanhedrin sat there); Yoma 25a (half in the holy, half in the unconsecrated; two doors, one to each; "like a large basilica");
    // Bartenura on Middot 5:4 (they sat in the unconsecrated half - no sitting in the Azara except kings of David's house); Sanhedrin 1:6 (71);
    // Sanhedrin 4:3 (half a threshing-floor so that they see each other; two judges' scribes stand before them, one right one left).
    // MODEL CHOICES (no source): hall size 22x16 inside, wall thickness 2, floor at 16, tier heights, 5 rows, door places and sizes, figures.
    {
      // GAZIT_FLOOR_B2 (fix-b2, 22.11.2026 - the user's decision 75): the hall's floor at 13.5 - the court of Israel's level - and 27 steps
      // of half an amah up to it from the chel, as the booklet "אלחנן וחיים עולים לירושלים" draws it (D188); until now 16 (the priests'
      // court) and 32 steps. Its door to the holy moves east with it, over the court of Israel (x 87..89.5, still in the hall's east half,
      // the Meiri's), so that it opens on a floor of its own height. (The payis demonstration reads the floor - ctx2.shared.gazitFloor.)
      const stone = M2.stoneLight, FY = 13.5;
      ctx2.shared.gazitFloor = FY;
      const wb = (x0, x1, y0, y1, z0, z1, mat = stone) => H2.box(g, x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, y0, (z0 + z1) / 2);
      // 1.9.3: the hall reaches north to the soreg's line (z -80) - the unconsecrated half 10.5 deep, for the one row of 71
      // ===== 1.9.5 (THREE_CHAMBERS_195; the user, 11.11.2026: "אפשרות א" - the three chambers joined under one level roof; "את לשכת
      // הגזית תעביר כדברי הבועז. ברור שתעשה כך"; his rule: "אנו לא עושים נגד ראשונים"). THE THREE CHAMBERS ARE ONE BUILDING IN THE
      // COURT'S NORTH-EAST, x 61.8..91: the hall in the east (outer x 67..91, until 1.9.4 x 47..73), the two chambers behind it, in the
      // west (the block after this one). The texts (the user's library, read 11.11.2026):
      // - the Boaz on Middot 5 (1329, line 26): "ואותן ג' הלשכות היה מקצת מהן בעזרת ישראל, ומקצת מהן בעזרת כהנים. ויהיה איך שיהיה היה
      //   לכה"פ קצת מג' לשכות ההן בעזרת ישראל"; "ובצדה למערב לשכה שלכה"פ היה רחבה ד' אמות, מלבד עובי כותלים שמפסיק בין גזית
      //   לפלהדרין". So the hall takes the court of Israel's eleven amot (x 82.5..91, over the duchan's steps) and the priests' eleven
      //   (71.5..82.5), and the building ends ten amot further west, east of the slaughter-place's pillars (x 60.5).
      // - the Yachin (819, line 679): "שלשכת הגזית היתה במזרח להב' לשכות האחרות, והיה ארכה מצפון לדרום, כאורך לשכת עץ ולשכת גולה
      //   מצפון לדרום יחד... לשכת עץ וגזית על כרחך שהיו סמוכין לכותל צפוני של עזרה... פתוחין לחול". So the hall is LONG NORTH-SOUTH
      //   now: 20 by 22 inside (22 by 18.5, long east-west, until 1.9.4), its south face in one line with the Golah chamber's.
      // - the Tosafot Yom Tov (948, line 208): "ראוי לשומה גדולה הרבה יותר משתי האחרות שאצלה... שהמקום שהיא בנויה בו בחול היה ג"כ
      //   גבוה כגובה העזרה... אבל במקום שפתוחה היא לחול היו מעלות שעליה עולין וממנה יורדין לחול. שהוא נמוך".
      // - Yoma 25a (107, line 580): "פייס במזרחה, וזקן יושב במערבה"; the Meiri (2199, line 229): "שחציה... בצד המערב פתוח לחול
      //   וחציה שבמזרח פתוח במקום קדש": the door to the Hel stays in the WEST end.
      // GAZIT_MEIRI_195 (the user's decision, 11.11.2026 21:15, on the question put to him - "ב"): THE HALL IS DIVIDED EAST | WEST, as
      // the Gemara's words and the Meiri's (2199, lines 228-229): "מתקבצים בחציה של קדש שהיה בצד מזרחה של לשכה... וזקן מזקני
      // הסנהדרין יושב בחציה של חול לצד מערבה של לשכה"; "שחציה הבנוי במקום קדש ר"ל בצד המערב פתוח לחול וחציה שבמזרח פתוח במקום
      // קדש". So: the seventy-one sit in the WEST half (x 69..79) and face east; the lottery's place is the EAST half (79..89);
      // the door to the Hel in the west (as it was); the door to the Azara in the east half of the south wall; the bronze strip in the
      // floor runs north-south on the hall's middle line (x 79). (Until this change, in the 1.9.5 working build only, the hall was
      // divided by the court wall's line: the row in the north part, the Tosafot Yeshanim's "חציה בנויה בקדש וחציה בנויה בחול".)
      const HX0 = 76, HX1 = 91, HZS = -54;   // NORTH_CHAMBERS_N2: x 76..91 (67..91 until now) - see the block below   // the hall's outer faces: west, east (the court's east wall's inner face) and south; north -79.6, as before
      wb(HX0 + 2, HX1 - 2, 13.5, FY + 0.02, -78, HZS - 2, M2.pave); // floor (flush with the court of the priests; a hair above the duchan's top step, which runs under it)
      wb(HX0, HX1, 13.5, 29.5, -79.6, -78); // north wall (towards the Hel)
      wb(HX1 - 2, HX1, 13.5, 29.5, -78, HZS - 2); // east end
      // west end with the door to the Hel (z -77..-74, 7.5 high) - five steps down outside, to the Hel's pavement
      wb(HX0, HX0 + 2, 13.5, 29.5, -78, -77);
      wb(HX0, HX0 + 2, 13.5, 29.5, -74, HZS - 2);
      wb(HX0, HX0 + 2, 13.5, FY, -77, -74);
      wb(HX0, HX0 + 2, 23.5, 29.5, -77, -74);
      stairsR(g, { width: 3, totalRise: FY, steps: Math.round(FY / 0.5), dir: "E", x: HX0 - FY, y: 0, z: -75.5, tread: 0.5 });   // CHEL_211: down westwards along the wall, to the chel's floor - GAZIT_FLOOR_B2: 27 steps (32 until now) (five steps to the podium's ledge until 2.0.1); the Tosafot Yom Tov: "ובפתחה לחול מעלות"
      // south wall with the door to the Azara (between two pillars of the colonnade, in the court of the priests)
      const KD0 = 87.0, KD1 = 89.5;   // GAZIT_MEIRI_195: in the hall's EAST half; GAZIT_FLOOR_B2: over the court of Israel, at the new floor's height (79.75..82.25 - over the priests' podium - until now)
      wb(HX0, KD0, 13.5, 29.5, HZS - 2, HZS);
      wb(KD1, HX1, 13.5, 29.5, HZS - 2, HZS);
      wb(KD0, KD1, 13.5, FY, HZS - 2, HZS);
      wb(KD0, KD1, 23.5, 29.5, HZS - 2, HZS);
      // ONE LEVEL ROOF FOR THE THREE: Middot 5:4 (89, line 39) "וגג שלשתן שוה"; Rashi, Yoma 19a (2157, line 596): "קירוי אחד
      // לשלשתן"; the Yachin (819, line 681): "שאלו הג' לשכות לא היתה אחת גבוה מחבירתה". The hall's gable (until 1.9.4) is gone; this
      // slab and the two chambers' (below) are one level and one stone.
      const ceil = wb(HX0 - 0.8, HX1 + 0.8, 29.5, 30.4, -80.2, HZS + 0.7, M2.stoneSmooth);
      ctx2.lishkotCut.push(ceil);
      // the hall reaches the soreg's line, 2.1 amot past the podium's edge (z -77.5): a foundation under that part, down to the
      // mount's floor (until 1.9.4 its north wall hung in the air there)
      wb(HX0, HX1, 0, 13.5, -79.6, -70, M2.stone);   // CHEL_211: under the whole outer part (the podium ends at the wall's face)
      // the line between the holy (east) and the unconsecrated (west) - a bronze strip in the floor, on the hall's middle line (GAZIT_MEIRI_195)
      wb(83.38, 83.62, FY + 0.02, FY + 0.06, -78, HZS - 2, M2.bronze);
      // --- 1.9.3 (the user, of the kuntres, point 12: "כן להגדיל"; 21:30: "תקטין את הדיינים"): THE SEVENTY-ONE IN ONE ROW - Sanhedrin 4:3
      // "סנהדרין היתה כחצי גרן עגלה, כדי שיהו רואין זה את זה" (73, line 26); Rashi 36b (2180, line 1777): "בעגולה היו יושבין כדי שיהו כולן
      // רואין זה את זה, לפי שאם היו יושבין בשורה אין פני הראשונים רואין זה את זה". Until 1.9.2 they sat in five tiers. Now one row on one
      // bench, half an oval in the unconsecrated half (the hall cannot grow past the soreg, so the row is close and the figures small -
      // a model choice). THE THREE ROWS OF STUDENTS (4:4 "ושלש שורות של תלמידי חכמים יושבין לפניהם"), 23 each (Rashi 37a, line 1781) -
      // two readings, ctx2.shared.sanhedrinRows.set("round" | "straight"): Rashi 37a (line 1782) "אף הן כעגולה, אלא שהגדולים יושבין על
      // הספסלין והתלמידים על הקרקע" - the default; the Yad Ramah (1957, line 564) "שורות פשוטות היו ולא בעיגול".
      // GAZIT_MEIRI_195: the half oval opens EAST - its ends on the line x = CX (just west of the middle line), its back to the west
      // wall; EA = its half-length north-south, EB = its depth westwards. North of its end a way two amot wide is left along the
      // north wall, from the door to the Hel (west end, z -77..-74) into the hall
      const CX = 83.5, CZ = -67, EA = 8.6, EB = 4.8;   // NORTH_CHAMBERS_N2: the hall is 15 wide (24 until now) - the half oval is shallower (EB 4.8, was 8.7), its back on the west wall
      const PPG = tm_people(ctx2);   // PEOPLE_KIT_204: sitting men in black robes and kippot (until 2.0.3: pegs with a ball for a head)
      // n points evenly spaced by length on the half-oval (a, b), from t0 to t1 (radians; 0 = north end, PI = south end; PI / 2 = the west point)
      const ovalPts = (a, b, n, t0, t1) => {
        const N = 720, acc = [0];
        let px = a * Math.cos(t0), pz = b * Math.sin(t0);
        for (let i = 1; i <= N; i++) { const t = t0 + (t1 - t0) * i / N, x = a * Math.cos(t), z = b * Math.sin(t); acc.push(acc[i - 1] + Math.hypot(x - px, z - pz)); px = x; pz = z; }
        const out = [];
        for (let k = 0, j = 0; k < n; k++) {
          const want = acc[N] * (k + 0.5) / n;
          while (j < N && acc[j + 1] < want) j++;
          const t = t0 + (t1 - t0) * (j + (want - acc[j]) / Math.max(1e-9, acc[j + 1] - acc[j])) / N;
          out.push([CX - b * Math.sin(t), CZ - a * Math.cos(t)]);
        }
        return out;
      };
      {   // the judges' bench: half an oval ring, 0.45 high
        const sh = new Shape();
        sh.absellipse(0, 0, EA + 0.45, EB + 0.45, 0, Math.PI, false, 0);
        sh.lineTo(-(EA - 0.4), 0);
        sh.absellipse(0, 0, EA - 0.4, EB - 0.4, Math.PI, 0, true, 0);
        sh.lineTo(EA + 0.45, 0);
        const geo = new ExtrudeGeometry(sh, { depth: 0.45, bevelEnabled: false, curveSegments: 48 });
        geo.rotateX(-Math.PI / 2);
        geo.rotateY(Math.PI / 2);   // GAZIT_MEIRI_195: the bulge to the west (it was to the north)
        const bench = new Mesh(geo, M2.cedar);
        bench.position.set(CX, FY, CZ);
        bench.castShadow = bench.receiveShadow = true;
        g.add(bench);
      }
      // PEOPLE_KIT_204: the seventy-one, each one's face to the row's inner side; the Nasi in the middle (a little larger); the beards
      // white by him, grey further and black-brown at the row's two ends ("יושבין לפניו כפי שניהם וכפי מעלתם", the Rambam, Sanhedrin 1:3)
      PPG.crowd(g, PPG.facing(ovalPts(EA, EB, 71, 0, Math.PI), [CX, CZ], false), { y: FY + 0.45, s: 0.62, pose: "bench", seat: 0.45, kind: "judge", tone: PPG.age(71), big: 35, shadow: true, fwd: 0.22 });
      const fi = 71;
      const stRound = new Group(), stStraight = new Group();
      stStraight.visible = false;
      g.add(stRound); g.add(stStraight);
      // the students sit on the ground, their faces to the judges ("יושבין לפניהם"): no beards, a kippah and peyot (the user, 01:42)
      PPG.crowd(stRound, [[7.0, 3.9], [5.95, 3.05], [4.9, 2.2]].flatMap(([a, b]) => PPG.facing(ovalPts(a, b, 23, 0.1 * Math.PI, 0.9 * Math.PI), [CX, CZ], true)), { y: FY, s: 0.58, pose: "ground", kind: "student", shadow: true });
      PPG.crowd(stStraight, [1.7, 3.0, 4.3].flatMap((dx) => Array.from({ length: 23 }, (_, i) => [CX - dx, CZ - 6.6 + i * 0.6, -Math.PI / 2])), { y: FY, s: 0.58, pose: "ground", kind: "student", shadow: true });
      ctx2.shared.sanhedrinRows = { mode: "round", set(m) { this.mode = m === "straight" ? "straight" : "round"; stRound.visible = this.mode === "round"; stStraight.visible = this.mode === "straight"; return this.mode; } };
      // the two scribes of the judges stand in front of them, one at the right and one at the left (Sanhedrin 4:3)
      PPG.crowd(g, [-2.4, 2.4].map((sx) => [CX - 0.7, CZ + sx, -Math.PI / 2]), { y: FY, s: 0.62, pose: "stand", kind: "scribe", tone: () => 1, shadow: true });   // PEOPLE_KIT_204: their faces to the judges, a tablet in the hand ("וכותבין")
      lbl("הסנהדרין הגדולה — שבעים ואחד בשורה אחת, כחצי גורן", CX - 2.8, 22.5, CZ, 1.8);
      lbl("הנשיא", CX - EB - 0.2, 19.2, CZ, 1.1);
      lbl("סופרי הדיינין", CX - 0.7, 19.6, CZ, 1);
      lbl("שלוש שורות של תלמידי חכמים", CX - 3.3, 18.4, CZ + 3.4, 1);
      lbl("חצי החול — במערב", 80.5, 17.4, HZS - 3.4, 1.2);      // GAZIT_MEIRI_195 (one label "גבול קודש | חול" on the old east-west line before)
      lbl("חצי הקודש — במזרח", 86.3, 17.4, HZS - 3.4, 1.2);
      lbl("פתח לקודש", (KD0 + KD1) / 2, 25, HZS + 0.1, 1.5);
      lbl("פתח לחול", HX0 - 0.2, 25, -75.5, 1.5);
      lbl("מקום הפייס", 86.3, 19, CZ, 1.2);
      ctx2.shared.sanhedrin = { seats: fi };
    }
    // ===== 1.9.5 (THREE_CHAMBERS_195): THE TWO CHAMBERS BEHIND THE HALL - west of it, x 61.8..67, INSIDE the court (z -65..-54), under
    // the hall's roof level. Middot 5:4 (89, line 39): "לשכת העץ... אבא שאול אומר, לשכת כהן גדול, והיא היתה אחורי שתיהן, וגג שלשתן
    // שוה"; Rashi, Yoma 19a (2157, lines 595-596): "אחורי שתיהן - ללשכת הגולה וללשכת הגזית", "וגג שלשתן שוה - קירוי אחד לשלשתן".
    // The Tosafot Yom Tov (948, line 205), in the name of the Shiltei HaGiborim: "שלשכת הגזית היתה במזרח לפני שתיהם שלשכת הגולה ולשכת
    // העץ היו בנוין אחורי לשכת הגזית בשוה. והיתה לשכת הגולה לדרום של גזית ולשכת העץ בצפון של גזית. ונמצאת אומר שלשכת העץ אחורי דגזית
    // ממש שהרי במערב שלה היא. וגם היא אחורי דגולה שהגולה היא בדרום. ונמצא שלשכת העץ אחוריה לצפון".
    // THE WOOD CHAMBER (north, z -65..-60.2, against the court's wall): until 1.9.4 it stood OUTSIDE the wall. Tosafot, Yoma 8b (1908,
    // line 68): "ללשכת פרהדרין שהיתה בנויה בקודש ואפילו את"ל שהיתה פתוחה לחול"; the Tosafot Rid, Yoma 25a (2109, line 76): "דבתוך העזרה
    // קיימא"; the Tosafot Yom Tov (948, line 204): "שאע"פ שהיתה בנויה בקדש היתה פתוחה לחול... ולא היה לזו פתח כלל אל הקדש משא"כ לשכת
    // הגזית דלקמן. והיו לה מעלות אשר יעלו עליה מן החול שהיא נמוך ממקומה של הלשכה שהיא בעזרה". So: built inside the court, ITS ONLY
    // DOOR NORTH, through the court's wall, to the Hel, and five steps in the wall's thickness, up from the Hel's pavement (13.5) to
    // the chamber's floor (16). THE GOLAH CHAMBER (south, z -59.2..-55.2): its door south, to the court ("ומשם מספיקים מים לכל העזרה").
    // Their width inside, 4 - the Boaz (1329, line 26): "לשכה שלכה"פ היה רחבה ד' אמות". MODEL CHOICES: their lengths, the doors'
    // places in their walls, the furniture, the well's size.
    {
      const X0 = 70.8, X1 = 76, T = 1.2, TOP = 29.5, DH = 7, FYK = LV.KOH, ZS = -54;
      const ix0 = X0 + T, icx = (ix0 + X1) / 2;   // inside x 63..67
      const wb = (x0, x1, y0, y1, z0, z1, mat = M2.stoneLight) => H2.box(g, x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, y0, (z0 + z1) / 2);
      const leaf = (w, x, y, z, rot) => {   // a door leaf ajar in a wall along x, hinged at its west jamb (as the other chambers')
        const geo = H2.uvWorldBox(new BoxGeometry(w, DH - 0.2, 0.25), w, DH - 0.2, 0.25);
        geo.translate(w / 2, (DH - 0.2) / 2, 0);
        const m = new Mesh(geo, cedarDark);
        m.position.set(x, y, z); m.rotation.y = rot; m.castShadow = m.receiveShadow = true; g.add(m);
      };
      // the two rooms are four amot wide and 13.5 high: with the roofs open (ctx2.lishkotCut - the chambers' pill and the places' views)
      // their walls are open too, above the doors' height, so that the floor is seen from above (the eye cannot stand at the zenith)
      const wb2 = (x0, x1, z0, z1) => { wb(x0, x1, FYK, FYK + DH, z0, z1); ctx2.lishkotCut.push(wb(x0, x1, FYK + DH, TOP, z0, z1)); };
      wb2(X0, ix0, -65, ZS);                                                 // the west wall of both
      wb2(ix0, X1, -60.2, -59.2);                                            // the wall between the two
      const ceilW = wb(X0 - 0.7, 75.2, 29.5, 30.4, -65, ZS + 0.7, M2.stoneSmooth);   // their roof - the hall's level and stone
      ctx2.lishkotCut.push(ceilW);
      // --- the wood chamber
      H2.box(g, X1 - ix0, 0.3, 4.8, M2.marble, icx, FYK, -62.6);
      H2.stairs(g, { width: 2, totalRise: 2.5, steps: 5, dir: "S", x: 74.5, y: 13.5, z: -70, tread: 0.5 });   // in the court wall's thickness
      leaf(1.84, 73.5, FYK + 0.3, -64.85, -0.6);
      H2.box(g, 3.9, 1, 2, M2.cedar, icx, FYK + 0.3, -61.3);                 // the bed, along the south wall
      H2.box(g, 3.7, 0.5, 1.8, clothMat, icx, FYK + 1.3, -61.3);
      H2.box(g, 0.9, 0.5, 1.8, linenMat, ix0 + 0.6, FYK + 1.8, -61.3);       // the pillow
      H2.box(g, 1.2, 1.6, 1, cedarDark, ix0 + 0.7, FYK + 0.3, -64.4);        // a chest
      H2.box(g, 0.8, 0.8, 0.8, M2.cedar, X1 - 0.6, FYK + 0.3, -63.2);        // a stool
      lbl("דירת כהן גדול בשבעת הימים", icx, FYK + 7.3, -62.6, 1.1);
      lbl("לשכת העץ — לשכת כהן גדול (פרהדרין)", icx, 42.8, -67.5, 2);   // over the court's wall, beside the room: over the room itself it would hide it from above
      lbl("פתח לשכת העץ — אל החיל", 74.5, 25, -70.2, 1.2);
      // FILL_211: THE MEZUZAH - "כל הלשכות שהיו במקדש לא היו להן מזוזה, חוץ מלשכת פרהדרין, שהיה בה בית דירה לכהן גדול" (Yoma 10a,
      // 107:208): on the western post of its door - the right of one who comes in from the Hel - in the way's outer tefach, at the
      // start of the opening's upper third (the door in the court's wall: x 64.5..66.5, 9.5 high from the Hel's floor); and an elder
      // reads before the high priest - "מסרו לו זקנים מזקני בית דין, וקורין לפניו בסדר היום" (Yoma 1:3, 107:383) - in the seven days
      // he is in this chamber ("שבעת ימים קודם יום הכפורים מפרישין כהן גדול מביתו ללשכת פרהדרין", Yoma 4a). The case, the figures and
      // their places: model choices.
      {
        const mzM = new MeshStandardMaterial({ color: 0x7a5a32, roughness: 0.55, metalness: 0.25 });
        const mz = new Mesh(new BoxGeometry(0.08, 0.45, 0.1), mzM);
        mz.position.set(73.5 + 0.04, 13.5 + 9.5 * 2 / 3, -69.55);
        mz.userData.noPick = true;
        g.add(mz);
        ctx2.labels.push({ text: "מזוזה — לשכת פרהדרין, ״שהיה בה בית דירה לכהן גדול״ (יומא י.)", x: 73.3, y: 13.5 + 9.5 * 2 / 3 + 1.1, z: -70.6, size: 0.75, far: 110 });
        const yE = Math.PI / 2, yH = -Math.PI / 2;
        fig211(72.75, -63.15, yE, FYK + 0.3, "judge", 0x45444c, 1.35, 0, "elderReader");
        fig211(74.55, -62.95, yH, FYK + 0.3, "worker", 0x2c3f66, 1.4, 1, "highPriestPrivate");
        const [sx, sz] = ahead211(72.75, -63.15, yE, 0.42), parch = new MeshStandardMaterial({ color: 0xeadfc4, roughness: 0.9 });
        for (const dz of [-0.17, 0.17]) H2.cyl(g, 0.06, 0.06, 0.46, M2.cedar, sx, FYK + 0.3 + 1.12, sz + dz, 8);
        H2.box(g, 0.02, 0.38, 0.32, parch, sx, FYK + 0.3 + 1.16, sz);
        ctx2.labels.push({ text: "״וקורין לפניו בסדר היום״ (יומא א, ג)", x: 73.6, y: FYK + 4.4, z: -63.0, size: 0.8, far: 120 });
      }
      // --- the Golah chamber
      H2.box(g, X1 - ix0, 0.3, 4, M2.marble, icx, FYK, -57.2);
      wb2(ix0, icx - 1.2, -55.2, ZS);                                        // south wall, with the door to the court
      wb2(icx + 1.2, X1, -55.2, ZS);
      ctx2.lishkotCut.push(wb(icx - 1.2, icx + 1.2, FYK + DH, TOP, -55.2, ZS));
      leaf(2.2, icx - 1.2, FYK + 0.3, -55.35, 0.6);
      F_GOLAH(icx, -57.2, FYK + 0.3, null, 0.62);
      lbl("לשכת הגולה ובור הגולה", icx, 31.8, -51.6, 2);   // before the room's door, for the same reason
    }
    // 1.9.3 (the user, of the kuntres, point 13: "כן"): THE TWO LESSER COURTS - Sanhedrin 11:2 "שלשה בתי דינין היו שם, אחד יושב על פתח הר
    // הבית, ואחד יושב על פתח העזרה, ואחד יושב בלשכת הגזית" (73, line 78); Rashi 86b (2180, lines 4632-4633): "על פתח הר הבית - הוא שער
    // המזרחי שלפנים מן החיל לפני עזרת נשים", "ואחד יושב למעלה הימנו - כשעברו עזרת נשים ובאין לפני עזרת ישראל". Until 1.9.4: twenty-three
    // on an open bench three amot in radius, one in the chel by the women's court's east gate and one on the terrace before Nikanor's gate.
    // 1.9.5 (remarks sent on to the user, 11.11.2026: "הסנהדרין לא יכלה לשבת בחוץ בצורה פתוחה גם משום כבודם וגם כיון שבקבלת העדות הם צריכים
    // להוציא כולם החוצה ולהשאר לבדם / וכן מקומם לא הי' בפתח עז"נ אלא בפתח הר הבית / וכן היו שם ג' שורות... / ועוד שעיגול ישיבת הדיינים
    // צריך להיות יותר מעשר אמות"; the user: "9. מקומן אפשרות ג. לבנות לשכה להגדיל ולהוסיף"): each court sits in A CLOSED CHAMBER (walls,
    // a door, a roof that goes with the chambers' roofs - lishkotCut), its half circle fifteen amot across (twenty-three seats of an
    // amah), two scribes standing before the judges (Sanhedrin 4:3) and THE THREE ROWS of students before them (4:4) in the reading of
    // the row "שורות התלמידים שלפני הסנהדרין" (Rashi 37a: round, on the ground; the Yad Ramah: straight). THE PLACE - two readings
    // (ctx2.shared.lesserPlace, the row "מקום שתי הסנהדראות הקטנות"): "rashi" (the default) - the court "על פתח הר הבית" by the women's
    // court's east gate, as Rashi; "mount" - by the Temple Mount's eastern gate (Shushan), as the Mishnah's plain words (the Rambam,
    // Sanhedrin 1:3: "אחד על פתח העזרה ואחד על פתח הר הבית"). The court "על פתח העזרה" stands before Nikanor's gate in both. The
    // chambers' exact places, their size, walls, doors and the figures - model choices (the cards say so).
    {
      const PPL = tm_people(ctx2);   // PEOPLE_KIT_204: the same figures as the Great Sanhedrin's
      const R = 7.5, WT = 1, WH2 = 7, HX = R + 0.45 + 0.6, ZB = -(R + 0.45 + 0.6), ZF = 2.65;   // the room inside: x -HX..HX, z ZB..ZF (the half circle's centre at 0, its open side to +z, the door there)
      const arcPts = (r, n, a0, a1) => Array.from({ length: n }, (_, i) => { const a = a0 + (a1 - a0) * (i + 0.5) / n; return [r * Math.cos(a), -r * Math.sin(a)]; });
      const rounds = [], straights = [];
      const lesserChamber = (cx, y, cz, name) => {
        const lg2 = new Group();
        lg2.position.set(cx, y, cz);
        g.add(lg2);
        // the judges' bench - half a ring - and the twenty-three on it
        const sh = new Shape();
        sh.absarc(0, 0, R + 0.42, 0, Math.PI, false); sh.lineTo(-(R - 0.42), 0); sh.absarc(0, 0, R - 0.42, Math.PI, 0, true); sh.lineTo(R + 0.42, 0);
        const geo = new ExtrudeGeometry(sh, { depth: 0.45, bevelEnabled: false, curveSegments: 32 });
        geo.rotateX(-Math.PI / 2);   // the shape's y is the model's -z (the arc to the back wall); the bench rises 0.45 from the floor
        const bench = new Mesh(geo, M2.cedar);
        bench.position.set(0, 0, 0);
        bench.castShadow = bench.receiveShadow = true;
        lg2.add(bench);
        PPL.crowd(lg2, PPL.facing(arcPts(R, 23, 0, Math.PI), [0, 0], false), { y: 0.45, s: 0.7, pose: "bench", seat: 0.45, kind: "judge", tone: PPL.age(23), big: 11, shadow: true, fwd: 0.2 });
        // the two scribes, standing before them, one at the right and one at the left (Sanhedrin 4:3)
        PPL.crowd(lg2, [[-2.2, 1.3, Math.PI], [2.2, 1.3, Math.PI]], { y: 0, s: 0.7, pose: "stand", kind: "scribe", tone: () => 1, shadow: true });
        // the three rows of students (4:4): round, on the ground (Rashi 37a) / straight (the Yad Ramah)
        const stR = new Group(), stS = new Group();
        stS.visible = false;
        lg2.add(stR); lg2.add(stS);
        PPL.crowd(stR, [6.15, 4.95, 3.75].flatMap((r) => PPL.facing(arcPts(r, 23, 0.07 * Math.PI, 0.93 * Math.PI), [0, 0], true)), { y: 0, s: 0.6, pose: "ground", kind: "student", shadow: true });
        PPL.crowd(stS, [1.3, 2.5, 3.7].flatMap((dz) => Array.from({ length: 23 }, (_, i) => [-5.5 + i * 0.5, -dz, Math.PI])), { y: 0, s: 0.6, pose: "ground", kind: "student", shadow: true });
        rounds.push(stR); straights.push(stS);
        // the chamber: three whole walls, the front one with its door (3 wide, 5 high), and the roof
        const xo = HX + WT, w = 2 * xo, zc = (ZB + ZF) / 2, d = ZF - ZB;
        H2.box(lg2, w, WH2, WT, M2.stone, 0, 0, ZB - WT / 2);
        for (const sx of [-1, 1]) H2.box(lg2, WT, WH2, d, M2.stone, sx * (HX + WT / 2), 0, zc);
        for (const sx of [-1, 1]) H2.box(lg2, xo - 1.5, WH2, WT, M2.stone, sx * (1.5 + (xo - 1.5) / 2), 0, ZF + WT / 2);
        H2.box(lg2, 3, WH2 - 5, WT, M2.stone, 0, 5, ZF + WT / 2);
        H2.box(lg2, 3.6, 0.5, WT + 0.3, M2.stoneLight, 0, 5, ZF + WT / 2);                       // the lintel
        H2.box(lg2, w, 0.08, d + 2 * WT, M2.paveFine, 0, 0, zc);                                // the floor
        const roof = H2.box(lg2, w + 0.6, 0.6, d + 2 * WT + 0.6, M2.stoneLight, 0, WH2, zc);
        ctx2.lishkotCut.push(roof);
        lbl(name, cx, y + WH2 + 2.2, cz + zc, 1.5);
        return lg2;
      };
      const zO = -7.9 - (ZF + WT);   // the origin's z of a chamber whose front wall's outer face stands at z -7.9, north of the way to the gate
      // before Nikanor's gate ("על פתח העזרה"): on the women's court's floor, north-east of the fifteen steps, its door to the south
      lesserChamber(117 + HX + WT, LV.EZN, -27.5 - (ZB - WT), "סנהדרי קטנה — על פתח העזרה (סנהדרין יא, ב)");
      // "על פתח הר הבית": Rashi's - by the women's court's east gate, outside the soreg, north of the way in; the plain reading's - inside the Shushan gate
      const lA = lesserChamber(242 + HX + WT, 0, zO, "סנהדרי קטנה — על פתח הר הבית (סנהדרין יא, ב; רש״י)");
      const lAL = ctx2.labels[ctx2.labels.length - 1];
      const lM = lesserChamber(332.2 - HX - WT, 0, zO, "סנהדרי קטנה — על פתח הר הבית, בשער המזרחי (סנהדרין יא, ב)");
      const lML = ctx2.labels[ctx2.labels.length - 1];
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.lesserRashi = lA; ctx2.layers.lesserMount = lM;
      lAL.layer = "lesserRashi"; lML.layer = "lesserMount";
      lM.visible = false;
      ctx2.shared.lesserPlace = { mode: "rashi", set(m) { this.mode = m === "mount" ? "mount" : "rashi"; lA.visible = this.mode === "rashi"; lM.visible = this.mode === "mount"; return this.mode; } };
      // the students' rows follow the row of the Great Sanhedrin's (ctx2.shared.sanhedrinRows, above)
      const SR = ctx2.shared.sanhedrinRows;
      if (SR) {
        const set0 = SR.set.bind(SR);
        SR.set = (m) => { const r = set0(m); for (const x of rounds) x.visible = r === "round"; for (const x of straights) x.visible = r === "straight"; return r; };
      }
    }
    // 1.9.5 (THREE_CHAMBERS_195): the hall's gable (until 1.9.4) is gone - "וגג שלשתן שוה", one level roof for the three chambers
    // 1.9.5: pillars before the hall's south face (z -54) - GAZIT_MEIRI_195: five, four amot apart (six, 3.6 apart, before), the
    // door to the court (now in the hall's east half) between the third and the fourth; the two east ones stand past the priests'
    // podium (x 82.5) - a base under each
    const pilA = new InstancedMesh(H2.uvWorldBox(new BoxGeometry(1, 11.5, 1), 1, 11.5, 1), M2.marble, 3);
    for (const x of [86]) H2.box(g, 1, 2.5, 1, M2.marble, x, 13.5, -53.7);
    [78, 82, 86].forEach((x, i) => {
      const m = new Matrix4();
      m.makeTranslation(x, 21.75, -53.7);
      pilA.setMatrixAt(i, m);
    });
    // 1.9.5: the pilasters of the hall's two ends (until 1.9.4) are gone - the west end is the chambers' and the door's, the east end
    // stands against the court's east wall
    for (const p of [pilA]) {
      p.instanceMatrix.needsUpdate = true;
      p.castShadow = p.receiveShadow = true;
      g.add(p);
    }
    lbl("לשכת הגזית — מושב הסנהדרין", 83.5, 33.5, -67.5, 3);
    // 1.5.0 (the user: "לסדר גם לפי תוי"ט"): the three southern chambers in the EASTERN part of the south wall (the gates are in the western
    // part, Rambam 5:4), in the Tosafot Yom Tov's order (Middot 5:3 "המלח - ממזרח למערב קחשיב"): from the east - the salt, the Parvah, the
    // washers; the spots along the wall are model choices. Until 1.4.0 they stood the other way round, with the salt between the gates.
    // 1.8.0 (the user: "הכבש הגדול מתנגש עם הלשכות — זה מכוון?" - it was not): the rooms 10 deep (18 until 1.7.1), z 55..65 - by Middot 5:2
    // and the Rambam's reckoning (5:15) the ramp's foot is 55.1 here, ten amot from the wall's inner face; their depth is not in the sources
    // SALT_144_D (fix-d, 22.11.2026 - the user's decision 144 א, with the coordinator's execution): לשכת המלח - TWO READINGS, the row
    // "לשכת המלח — חדר או מחילה" (ctx2.shared.saltChamber.set("room" | "tunnel")). Until now a room in the priests' court, x 67..81.
    // "room" (the default) - Tiferet Yisrael, Tzurat Beit HaMikdash (book 6029 line 71): "וג' לשכות היו לעומתן במקצוע דרום של עזרת ישראל.
    // וגם הן היה קצת מרווחן בעזרת כהנים. דהיינו בזוית של דרומית מזרחית של עזרת ישראל, היה לשכת המלח"; Yachin, Middot 5 (819 line 663):
    // "דבקצה זוית מזרחית דרומית של עזרת ישראל, היה לשכת המלח"; the TYT's Tzurat (6028 line 39) "שבדרום סמוכה למזרח לשכת המלח" and on
    // Middot 5:3 (948 line 195), after the drawing of the Rambam's commentary. A room from the east wall's inner face (x 91) westward to
    // x 79.5 - three amot of it in the priests' court - ten deep (z 55..65), its floor the court of Israel's (as לשכת הגזית in the north;
    // the priests' court's pave is open under its part there, SALTH), its roof level with the others'; the duchan ends at its north face.
    // "tunnel" - Tzurat Beit Sheni (6030 line 28): "לשכת המלח מחילה תחת עזרת כהנים ופתחו פתוח לעזרת ישראל": a low opening in the
    // priests' court's face toward the court of Israel (x 82.5, z 59.3..61.7, 1.9 high), eight steps down westward, and the tunnel under
    // the priests' court's floor (x 70.5..80.5, z 56.5..64.5, its floor 9.5, its ceiling the court's pave); the duchan runs on to the
    // opening (z 59.3), five amot short of the south wall - in this reading only. The sizes and the places of both - model choices.
    {
      const roomG = new Group(), tunG = new Group();
      roomG.name = "saltRoom"; tunG.name = "saltTunnel";
      tunG.visible = false;
      g.add(roomG, tunG);
      ctx2.layers.saltRoom = roomG; ctx2.layers.saltTunnel = tunG;
      const into = (grp, build) => {   // what build() adds to g, and the labels it adds, go to grp (its layer)
        const n0 = g.children.length, l0 = ctx2.labels.length;
        build();
        for (const o of g.children.slice(n0)) grp.add(o);
        for (let i = l0; i < ctx2.labels.length; i++) if (!ctx2.labels[i].layer && !ctx2.labels[i].layers) ctx2.labels[i].layer = grp.name;
      };
      // the room
      into(roomG, () => room(85.25, 60, 11.5, 10, 16, LV.AZ, [{ dx: 0, dz: -1 }], "לשכת המלח", 0, (cx, cz, y, roof) => F_MELACH(cx, cz, y, roof, 0.72), { doorW: 3 }));
      H2.box(roomG, SALT_T.w, LV.AZ - 0.15, SALT_T.d, M2.stone, SALT_T.x, 0, SALT_T.z);   // the podium whole under it (the tunnel's shaft filled)
      // the tunnel
      H2.box(tunG, SALT_T.w, 9.2, SALT_T.d, M2.stone, SALT_T.x, 0, SALT_T.z);              // the fill under its floor
      into(tunG, () => room(75.5, 60.5, 10, 8, LV.AZ - 0.15 - 9.2, 9.2, [{ dx: 1, dz: 0 }], null, 0, null, { noRoof: true, noLeaf: true, doorW: 2.4 }));
      for (const [z0, z1] of [[56.5, 59.3], [61.7, 64.5]]) H2.box(tunG, 2, LV.AZ - 0.15 - 9.2, z1 - z0, M2.stoneLight, 81.5, 9.2, (z0 + z1) / 2);   // the passage's sides
      H2.stairs(tunG, { width: 2.4, totalRise: 4, steps: 8, dir: "E", x: 78.5, y: 9.5, z: 60.5, tread: 0.5 });   // down from the court of Israel (13.5)
      const plug = boxHoles(tunG, SALTH.w, 2.65, SALTH.d, M2.pave, SALTH.x, 13.35, SALTH.z, [{ x: 81.5, z: 60.5, w: 2, d: 2.4 }]);   // the priests' court's pave, whole but the opening
      plug.push(H2.box(tunG, 2, 0.6, 2.4, M2.pave, 81.5, 15.4, 60.5));                     // over the opening
      for (const m of plug) {   // their top faces mapped by their place in the court, as the pave's (ctx2.herodFloor)
        const uv = m.geometry.attributes.uv, ps = m.geometry.attributes.position, nr = m.geometry.attributes.normal;
        for (let i = 0; i < uv.count; i++) if (nr.getY(i) > 0.5) uv.setXY(i, ps.getX(i) + m.position.x, ps.getZ(i) + m.position.z);
        uv.needsUpdate = true;
      }
      {
        const saltMat = new MeshStandardMaterial({ color: 0xe3e7ea, roughness: 0.45, metalness: 0.05, emissive: 0x1a1d20 });
        const cone = new Mesh(new ConeGeometry(2.4, 2.6, 24, 2), saltMat);
        cone.position.set(74.5, 9.5 + 1.3, 60.5);
        cone.castShadow = cone.receiveShadow = true;
        tunG.add(cone);
        for (const [x, z, r] of [[77.6, 58, 0.3], [77.8, 63, -0.2]]) { const sk = H2.box(tunG, 1.3, 1.5, 1, sackMat, x, 9.5, z); sk.rotation.y = r; }
      }
      ctx2.labels.push(
        { text: "לשכת המלח — מחילה תחת עזרת כהנים, ופתחה לעזרת ישראל (צורת בית שני)", x: 86, y: 21, z: 60.5, size: 2, layer: "saltTunnel" },
        { text: "פתח המחילה", x: 83.2, y: 16.6, z: 60.5, size: 1.1, layer: "saltTunnel" },
        { text: "המחילה — מתחת לרצפת עזרת כהנים", x: 75.5, y: 12.4, z: 60.5, size: 1.2, layer: "saltTunnel" });
      ctx2.shared.saltChamber = {
        mode: "room",
        set(m) {
          this.mode = m === "tunnel" ? "tunnel" : "room";
          const t = this.mode === "tunnel";
          roomG.visible = !t; tunG.visible = t;
          if (ctx2.shared.duchanSaltStub) ctx2.shared.duchanSaltStub.visible = t;
          if (ctx2.requestRender) ctx2.requestRender();
          return this.mode;
        }
      };
    }
    // CHAMBERS_EAST_N2: the Parvah (x 77..91, z 45..55; floor 13.5, roof as before - 30; door north, onto the alley) and the Madichin (x 77..91,
    // z 29.4..39.4; roof 29.5 as before; the door to the mesibah in its south wall, near the east end - the pit and the tables are clear of it).
    // Until now both stood on the priests' court's floor (16), opposite the altar and the ramp - the Parvah x 47..61 and the Madichin x 27..41.
    room(84, 50, 14, 10, 16.5, LV.AZ, [{ dx: 0, dz: -1 }], "לשכת הפרוה", 0, F_PARVAH);
    room(84, 34.4, 14, 10, 16, LV.AZ, [{ dx: 0, dz: 1, off: 4.2 }], "לשכת המדיחין", 0, F_MADICHIN, { floorHole: MPIT });
    // the mesibah from לשכת המדיחין up to the roof of בית הפרוה (Middot 5:3 "ומשם מסבה עולה לגג בית הפרוה"). 1.8.0: as the Bartenura - "בנין
    // אבנים מעלות מגלגלות וסובבות לעלות לגג בית הפרוה" - a winding stair of stone in the gap between the two rooms (x 41..47), up to the
    // Parvah's roof (28.2); until 1.7.1 a straight flight along the rooms' face, which crossed the ramp's foot. Its radius - model choice.
    {
      // 1.9.1 (the user: "לשכת המדיחין — פתח למסיבה לפרוה"; Middot 5:3 "לשכת המדיחין... ומשם מסבה עולה לגג בית הפרוה"): the stair begins
      // at the door in the Madichin's east wall (its first step points west, to the door) and ends at the Parvah's roof (its last step points
      // east, to the landing): 31 steps, two and a half turns, from the court's floor (16) to the roof (30.7)
      // CHAMBERS_EAST_N2: the stair stands in the alley between the two rooms (x 88.2, z 42.2): its first step to the door in the Madichin's
      // south wall (north), its last to the Parvah's roof (south) - 43 steps, three and a half turns, from the court of Israel's floor (13.5)
      // to the roof (30.7), each 0.4 high (31 steps from 16 until now)
      const SX = 88.2, SZ = 42.2, PER = 12, Y0 = LV.AZ, YT = 30.7, N = 43, RISE = (YT - Y0) / N, A0 = Math.PI / 2;
      const stairG = new Group();   // 1.9.2: the steps, the posts and the handrail - instanced at the end (93 pieces -> 4 draws)
      g.add(stairG);
      H2.cyl(g, 0.45, 0.45, YT - Y0 + 0.7, M2.stoneSmooth, SX, Y0, SZ, 12);
      for (let i = 0; i < N; i++) {
        const a = A0 + i * Math.PI * 2 / PER;
        const st = H2.box(stairG, 2.4, RISE, 1.05, M2.stoneSmooth, SX, Y0 + i * RISE, SZ);
        st.geometry.translate(1.45, 0, 0);
        st.rotation.y = a;
      }
      H2.box(g, 2.2, 0.7, 3.2, M2.stoneSmooth, SX, YT - 0.7, SZ + 2.6);   // the landing to the Parvah's roof
      // 1.9.1 (the user: "את המדרגות בלשכת הפרוה, כדאי לעשות עם מעקה וכדו, הם נראות ממש מפחיד"): a railing on the stair's outer edge -
      // a post on every step and a handrail from post to post (cedar; height 1.1 - model choice), and two posts on the landing
      {
        const RR = 2.55, RH = 1.1, rail = M2.cedar, tops = [];
        for (let i = 0; i < N; i++) {
          const a = A0 + i * Math.PI * 2 / PER, x = SX + Math.cos(a) * RR, z = SZ - Math.sin(a) * RR, y = Y0 + (i + 1) * RISE;
          H2.box(stairG, 0.12, RH, 0.12, rail, x, y, z);
          tops.push(new Vector3(x, y + RH, z));
        }
        const up = new Vector3(0, 1, 0);
        for (let i = 0; i + 1 < tops.length; i++) {
          const a = tops[i], b = tops[i + 1], len = a.distanceTo(b);
          const seg = new Mesh(new CylinderGeometry(0.07, 0.07, len, 6), rail);
          seg.position.copy(a).add(b).multiplyScalar(0.5);
          seg.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize());
          seg.castShadow = true;
          stairG.add(seg);
        }
        for (const dx of [-1.05, 1.05]) H2.box(g, 0.12, 0.12, 3.2, rail, SX + dx, YT + RH - 0.06, SZ + 2.6);
        H2.instancify(stairG);   // 1.9.2
      }
      lbl("מסיבה לגג בית הפרוה", SX, YT + 3, SZ - 1, 1.3);
    }
    // 1.5.0 (the user's decision ה-3): לשכת בית אבטינס - the high priest's second chamber, in the south, over the Water Gate (Yoma 19a: "שתי
    // לשכות היו לו לכהן גדול... אחת בצפון ואחת בדרום"; "ובצד לשכתו" - the first immersion of Yom Kippur was on the Water Gate beside it,
    // Yoma 19a, 31a; Boaz on Middot 1:2: both were upper rooms on the gate). An upper room on the wall over the gate (x -18), where the house of
    // Avtinas compounded the incense (Yoma 38a) - a mortar and jars inside; the bath beside it on the wall. Sizes - model choices.
    room(-18, 67.5, 12, 9, 8, 40, { dx: 1, dz: 0 }, "עליית בית אבטינס — מפטמי הקטורת", 51.5, (cx, cz, y) => {
      H2.cyl(g, 0.7, 0.5, 0.9, M2.stoneSmooth, cx - 2, y, cz); const pst = H2.cyl(g, 0.08, 0.08, 1.4, M2.cedar, cx - 1.8, y + 0.5, cz); pst.rotation.z = 0.5;
      for (const [dx, dz] of [[1.5, -2.5], [2.6, -1.2], [2.2, 1.8]]) H2.cyl(g, 0.45, 0.35, 1.1, clay, cx + dx, y, cz + dz);
      // FILL_211: one of the house of Avtinas at the mortar ("בית אבטינס על מעשה הקטרת", Shekalim 5:1; priests - "ומן בני הכהנים רקחי
      // המרקחת לבשמים", I Chr 9:30), and by the door the young guards - "בית אבטינס ובית הניצוץ היו עליות, והרובים שומרים שם" (Tamid
      // 1:1; the Rosh there: "ילדים... שלא הגיעו לעבודה והם זריזים לעלות בעליות")
      fig211(cx - 2, cz - 1.15, 0, y, "kohen", 0xf1ede2, 1.4, 2, "avtinasMaker");
      fig211(cx + 3.8, cz + 2.8, -Math.PI / 2, y, "student", 0xd9cfb8, 1.15, 3, "roveh");
      fig211(cx + 3.6, cz - 2.7, -Math.PI / 2, y, "student", 0xcfc4a8, 1.15, 3, "roveh");
      ctx2.labels.push({ text: "״והרובים שומרים שם״ (תמיד א, א)", x: cx + 3.7, y: y + 5.8, z: cz, size: 0.8, far: 140 });
    });
    H2.ring(g, 2.1, 0.5, M2.stoneSmooth, -30, 40.3, 67.5);   // the bath on the Water Gate, beside the chamber (Yoma 31a)
    H2.cyl(g, 1.6, 1.6, 0.12, water, -30, 40.2, 67.5);
    lbl("בית הטבילה שעל גבי שער המים — הטבילה הראשונה ביום הכיפורים", -30, 43.5, 67.5, 1.1);
    // 1.4.0: לשכת העץ - the wood chamber, "לשכת כהן גדול... אחורי שתיהן, וגג שלשתן שוה" (Middot 5:4): behind the two northern chambers,
    // outside the court's wall, its roof level with theirs; the high priest's chamber (Abba Shaul) = לשכת פרהדרין (Yoma 1:1; Yoma 19a)
    {
      // 1.5.0: hollow, its door to the chel (Tosafot Yom Tov 5:4: it must open to the chel, for one sits in it), furnished as a dwelling
      // 1.9.5 (THREE_CHAMBERS_195): until 1.9.4 a room of its own, 40 x 10, north of the hall and OUTSIDE the court's wall (z -88.5..
      // -78.5: past the podium's edge and the soreg's line; its roof at 27, lower than the other two). Now inside the court, the
      // north-west part of the one building - see there.
    }
    // 1.4.0: the two chambers of the Nikanor gate (Middot 1:4: "אחת לשכת פנחס המלביש ואחת לשכת עושי חביתין"), one at each side of the gate, in the east wall's line
    // KLI_SHIR_211 (the user, 15.11.2026 13:32: "לשכת כלי שיר בשני הצדדים מתחת לשתי הלשכות פנחס/חביתין בהתאמה"): "ולשכות היו תחת עזרת
    // ישראל, ופתוחות לעזרת הנשים, ששם הלוים נותנים כנורות ונבלים ומצלתים וכל כלי שיר" (Middot 2:6; book 89, line 17). Under each of the
    // gate's two chambers a chamber of the instruments, on the women's court's floor, open to it (east) by a wide opening (F_KLISHIR); the
    // two chambers above stand on the Israelite court's floor (LV.AZ), their doors to the court (west) - the patrol of Tamid 1:3 meets
    // "למקום בית עושי חבתים" inside the court. Until 2.0.1 the two stood on the women's court's floor, 19.5 high, their doors east.
    // Their place under the two (the user's), the opening's width, the instruments' number and form - model choices.
    for (const [sz, name] of [[-1, "לשכת פנחס המלביש"], [1, "לשכת עושי חביתין"]]) {
      // CHAMBERS_EAST_N2 (the user's decision, on the Rambam 5:17: "ושתי לשכות אחרות היו שם בעזרת ישראל. אחת מימין שער מזרחי... ואחד
      // משמאלו"): the two stand in the court of Israel, against the east wall, x 82.5..91.5 - not in the women's court (x 93.5..102.5, as
      // until now); the door in the wall toward the gate (they were furnished with the door west): the Pinchas chamber's (north) in its
      // south wall, the chavitin makers' (south) in its north wall - the way between them, z -19.5..19.5, leads to the gate
      rotated(87, sz * 24, sz < 0 ? HP : -HP, () => room(87, sz * 24, 9, 9, 12, LV.AZ, { dx: -1, dz: 0 }, name, 28, sz < 0 ? F_PINCHAS : F_CHAVITIN));
      // KLI_DEEP_211: twenty long (it was nine, all of it east of the court's wall), 0.4 lower than the court's floor - its ceiling is
      // two slabs: under the floor strip of the court of Israel (top 13.35, the strip lies on it), and under the wall's doorway and the
      // chamber above (top 13.5). The depth (to the duchan's line, x 82.5) - model choice.
      room((KDEEP.x0 + KDEEP.x1) / 2, sz * KDEEP.z, KDEEP.x1 - KDEEP.x0, KDEEP.d, LV.AZ - LV.EZN - 0.4, LV.EZN, { dx: 1, dz: 0 }, null, 0, F_KLISHIR, { noRoof: true, noLeaf: true, doorW: 5.4 });
      H2.box(g, CO.azE - KDEEP.x0, 0.25, KDEEP.d, M2.stone, (KDEEP.x0 + CO.azE) / 2, LV.AZ - 0.4, sz * KDEEP.z);
      H2.box(g, KDEEP.x1 - CO.azE, 0.4, KDEEP.d, M2.stone, (CO.azE + KDEEP.x1) / 2, LV.AZ - 0.4, sz * KDEEP.z);
      // (the label: short, and out in the women's court - the long one, at the wall, reached into the chamber above: U-57)
      lbl("לשכת כלי השיר (מידות ב, ו)", 108.5, LV.AZ + 0.4, sz * 24, 1.0);
    }
    // 1.4.0: the upper room over the Nitzotz gate (Middot 1:5 "כמין אכסדרה היה ועליה בנויה על גביו... ופתח היה לו לחיל") and its door to the chel
    {
      // 1.9.3 (the full scan: the place looks down into the chamber with its roof off, and saw the top of a solid block): a hollow
      // room as the other chambers (room(): floor, walls, the door to the chel with its leaf, the roof in lishkotCut), and in it the
      // guards' benches and a lamp stand - "שהכהנים שומרים מלמעלה" (Middot 1:5); the furniture - model choices. Until 1.9.2 a solid
      // block 14 x 7.5 x 10 with a roof slab and a door leaf on its north face.
      room(-78, -67.5, 14, 10, 7.5, 40.5, { dx: 0, dz: -1 }, null, 0, (cx, cz, y) => {
        H2.box(g, 9, 1, 1.5, M2.cedar, cx, y, cz + 2.9);            // a bench along the court side
        H2.box(g, 1.5, 1, 4.5, M2.cedar, cx - 4.9, y, cz - 0.4);    // and one along the west wall
        H2.cyl(g, 0.14, 0.24, 2.4, M2.cedar, cx + 4.6, y, cz + 2.6);   // a lamp stand
        H2.cyl(g, 0.34, 0.2, 0.3, clay, cx + 4.6, y + 2.4, cz + 2.6);
      });
      H2.box(g, 3, 6, 0.35, M2.cedar, -70, 13.5, -74.9);   // the gate's own door to the chel, beside it (model choice)
      lbl("עליית שער הניצוץ — הכהנים שומרים מלמעלה", -78, 51, -67.5, 1.5);
    }
    // 1.5.0 (the user: "לא ברור איפה העזרה, גם לא עזרת ישראל וגם לא עזרת כהנים"): ZONES - a translucent patch and a bright frame on the floor,
    // lit for 15 s by its place (ctx2.shared.features), each with its label (layer = the zone's key). The measures: Middot 5:1 from the east -
    // the Israelites' court 11, the priests' 11, the altar 32, between the ulam and the altar 22, the house 100, behind it 11 = 187; north to
    // south 135. The women's court 135 x 135 (2:5). The chel: the 10 amot between the soreg and the walls (2:3) - in 20-mount.js.
    {
      ctx2.layers = ctx2.layers || {};
      ctx2.shared.features = ctx2.shared.features || {};
      const zone = (key, x0, x1, z0, z1, y, color, text, size) => {
        const grp = new Group();
        grp.visible = false;
        grp.name = key;
        const pm = new MeshBasicMaterial({ color, transparent: true, opacity: 0.32, depthWrite: false });
        const patch = new Mesh(new BoxGeometry(x1 - x0, 0.04, z1 - z0), pm);
        patch.position.set((x0 + x1) / 2, y + 0.06, (z0 + z1) / 2);
        patch.userData.noPick = true;
        grp.add(patch);
        const fm = new MeshBasicMaterial({ color });
        const bar = (w, d, x, z) => { const b = new Mesh(new BoxGeometry(w, 0.22, d), fm); b.position.set(x, y + 0.11, z); b.userData.noPick = true; grp.add(b); };
        bar(x1 - x0, 0.5, (x0 + x1) / 2, z0); bar(x1 - x0, 0.5, (x0 + x1) / 2, z1); bar(0.5, z1 - z0, x0, (z0 + z1) / 2); bar(0.5, z1 - z0, x1, (z0 + z1) / 2);
        g.add(grp);
        ctx2.layers[key] = grp;
        ctx2.shared.features[key] = { key, isOn: () => grp.visible, on: () => { grp.visible = true; }, off: () => { grp.visible = false; } };
        ctx2.labels.push({ text, x: (x0 + x1) / 2, y: y + 2.5, z: (z0 + z1) / 2, size: size || 3, layer: key });
      };
      zone("zoneAzarah", -93.5, 93.5, -67.5, 67.5, 13.5, 0x3aa0ff, "העזרה — 187 על 135 (מידות ה, א)", 4);
      zone("zoneYisrael", 82.5, 93.5, -67.5, 67.5, 13.5, 0x4ad17a, "עזרת ישראל — 11 אמה", 2.2);
      zone("zoneKohanim", 71.5, 82.5, -67.5, 67.5, 16, 0xffb13a, "עזרת כהנים — 11 אמה", 2.2);
      zone("zoneUlamAltar", 17.5, 39.5, -67.5, 67.5, 16, 0xff5a5a, "בין האולם ולמזבח — 22 אמה", 2.2);
      // 1.9.3 (the user, of the kuntres, point 4, with the page he sent: "תעתיק כטקסט לסעיף"): THE OTHER READING OF ITS WIDTH - the Tosafot of
      // R. Yitzchak HaLavan on Yoma 21a (his edition, p. 43-44): on the festival Israel went to the eleven amot behind the Kaporet "דרך
      // חלל [שבין] המזבח לכותל עזרה עד שהיו מגיעין לאולם, ושוב דרך חלל שבין אולם לכותל עזרה... אבל בחלל האולם למזבח ודאי לא היו
      // ניכנסין" - so the holier strip is only what lies between the two; with the Mefaresh on Tamid 28a "הכי הוא דאסור ליכנס בין אולם
      // לכבש, דכבש הוא כמזבח לכל דבר" (2105, line 148): opposite the altar and the ramp. ctx2.shared.ulamAltarZone.set("wide" | "narrow");
      // the narrow patch is fitted to where the altar stands (ctx2.shared.altarPlace) each time it is shown.
      {
        const wide = ctx2.layers.zoneUlamAltar;
        const narrow = new Group();
        narrow.visible = false;
        narrow.name = "zoneUlamAltarNarrow";
        const pm = new MeshBasicMaterial({ color: 0xff5a5a, transparent: true, opacity: 0.32, depthWrite: false }), fm = new MeshBasicMaterial({ color: 0xff5a5a });
        const patch = new Mesh(new BoxGeometry(22, 0.04, 1), pm);
        patch.userData.noPick = true;
        narrow.add(patch);
        const bars = [0, 1, 2, 3].map(() => { const b = new Mesh(new BoxGeometry(1, 0.22, 1), fm); b.userData.noPick = true; narrow.add(b); return b; });
        g.add(narrow);
        ctx2.layers.zoneUlamAltarNarrow = narrow;
        const nl = { text: "בין האולם ולמזבח — כנגד המזבח והכבש (ר״י הלבן)", x: 30, y: 24, z: 24, size: 1.8, layer: "zoneUlamAltarNarrow" };
        ctx2.labels.push(nl);
        const fit = () => {
          const P = ctx2.shared.altarPlace, dz = P && P.dz && typeof P.dz[P.current] === "number" ? P.dz[P.current] : 12.5;
          const z0 = -19.5 + dz, z1 = 42.6 + dz, zc = (z0 + z1) / 2, L = z1 - z0;
          patch.scale.set(1, 1, L); patch.position.set(28.5, 16.06, zc);
          bars[0].scale.set(22, 1, 0.5); bars[0].position.set(28.5, 16.11, z0);
          bars[1].scale.set(22, 1, 0.5); bars[1].position.set(28.5, 16.11, z1);
          bars[2].scale.set(0.5, 1, L); bars[2].position.set(17.5, 16.11, zc);
          bars[3].scale.set(0.5, 1, L); bars[3].position.set(39.5, 16.11, zc);
          nl.z = zc;
        };
        let mode = "wide", on = false;
        const apply = () => { if (mode === "narrow") fit(); wide.visible = on && mode === "wide"; narrow.visible = on && mode === "narrow"; };
        ctx2.shared.features.zoneUlamAltar = { key: "zoneUlamAltar", isOn: () => on, on: () => { on = true; apply(); }, off: () => { on = false; apply(); } };
        ctx2.shared.ulamAltarZone = { get mode() { return mode; }, set(m) { mode = m === "narrow" ? "narrow" : "wide"; apply(); return mode; } };
      }
      zone("zoneEzn", 93.5, 228.5, -67.5, 67.5, 6, 0xc07aff, "עזרת נשים — 135 על 135 (מידות ב, ה)", 4);
      // 1.9.1 (the user: "דוכן הלויים — מבט מלמעלה"): the duchan glows on its steps for 15 s - a pale amber volume over the step of one amah
      // and the three half-amah steps (x 82.5..85 - DUCHAN_GAP_A2; until then 85.5..88), its edges in a stronger line
      {
        const grp = new Group();
        grp.visible = false;
        grp.name = "zoneDuchan";
        const pm = new MeshBasicMaterial({ color: 0xffc94a, transparent: true, opacity: 0.38, depthWrite: false });
        const steps = [[84, 85, 13.5, 14.5], [83.5, 84, 13.5, 15], [83, 83.5, 13.5, 15.5], [82.5, 83, 13.5, 16]];   // [x0, x1, y0, y1]
        for (const [dz0, dz1] of DUCH.segs) for (const [x0, x1, y0, y1] of steps) {   // CHAMBERS_EAST_N2: the pieces of the step
          const m = new Mesh(new BoxGeometry(x1 - x0 + 0.04, y1 - y0 + 0.06, dz1 - dz0), pm);   // DUCHAN_GAZIT_A2
          m.position.set((x0 + x1) / 2, (y0 + y1) / 2 + 0.03, (dz0 + dz1) / 2);
          m.userData.noPick = true;
          grp.add(m);
        }
        const fm = new MeshBasicMaterial({ color: 0xffa21a });
        for (const [dz0, dz1] of DUCH.segs) for (const [x, y] of [[85, 14.55], [82.5, 16.05]]) { const b = new Mesh(new BoxGeometry(0.25, 0.22, dz1 - dz0), fm); b.position.set(x, y, (dz0 + dz1) / 2); b.userData.noPick = true; grp.add(b); }
        g.add(grp);
        ctx2.layers.zoneDuchan = grp;
        ctx2.shared.features.zoneDuchan = { key: "zoneDuchan", isOn: () => grp.visible, on: () => { grp.visible = true; }, off: () => { grp.visible = false; } };
        ctx2.labels.push({ text: "דוכן הלויים — מעלה של אמה ושלוש מעלות של חצי אמה", x: 83.5, y: 19.5, z: 0, size: 2, layer: "zoneDuchan" });   // CHAMBERS_EAST_N2: z 0 (30 until now - inside the Madichin)
      }
    }
    // ===== FIX-B2 (22.11.2026): THE GATES' PALMS, THE RAMPS FOR THE BEASTS, THE OIL CHAMBER'S SECOND DOOR, THE BLEMISHED PRIESTS =====
    {
      const noPickAll = (o) => { o.traverse((m) => { if (m.isMesh) m.userData.noPick = true; }); return o; };
      const bakeTo = (tmp, parent) => {   // (as bake211: the pieces of one material in one mesh)
        tmp.updateMatrixWorld(true);
        const byMat = new Map();
        tmp.traverse((o) => { if (o.isMesh) { const k = o.material; if (!byMat.has(k)) byMat.set(k, []); byMat.get(k).push(o.geometry.clone().applyMatrix4(o.matrixWorld)); } });
        for (const [mat, list] of byMat) { const m = new Mesh(mergeGeometries(list), mat); m.castShadow = true; m.receiveShadow = true; m.userData.noPick = true; parent.add(m); }
      };
      // ---- PALMS_B2 (the user's decision 33 - an approved exception to the rule that Ezekiel's vision is not a source for the Second
      // Temple): "וְאֶל־אַיִל תִּמֹרִים" (Ezekiel 40:16, 14:1069), on the posts of the gates of the courts - the user: "ולא נראה שהיה שינוי".
      // On the outer face of each gate of the court and of the women's court's gate: on either side of the opening, a flat pilaster with
      // a palm in low relief - its trunk and its crown of fronds, gilded as the gates' leaves ("כל השערים שהיו שם נשתנו להיות של זהב חוץ
      // משערי נקנור", Middot 2:3). Which gates (not the Mount's five, not Beit HaMoked's door), the palm's form, its size, the gilding -
      // model choices. A layer of its own (gatePalms), on by default.
      const palmG = new Group(); palmG.name = "gatePalms"; g.add(palmG); ctx2.layers.gatePalms = palmG;
      {
        const tmp = new Group();
        const palm = (axis, face, out, u, y0, h) => {   // axis: the wall's direction; face: its outer face (z or x); out: +1/-1 outward
          const P = new Group();
          const put = (m, uu, vv, ww) => { if (axis === "x") m.position.set(uu, vv, face + out * ww); else m.position.set(face + out * ww, vv, uu); P.add(m); return m; };
          put(new Mesh(new BoxGeometry(axis === "x" ? 1.1 : 0.3, h, axis === "x" ? 0.3 : 1.1), M2.stoneSmooth), u, y0 + h / 2, 0.15);
          const trunkTop = y0 + h - 3.6;
          for (let y = y0 + 0.6, i = 0; y < trunkTop - 0.2; y += 1.3, i++) {
            const seg = new Mesh(new CylinderGeometry(0.19, 0.24, 1.25, 8, 1, false, 0, Math.PI), M2.gold);
            seg.rotation.y = axis === "x" ? (out > 0 ? -Math.PI / 2 : Math.PI / 2) : (out > 0 ? 0 : Math.PI);
            put(seg, u, y + 0.62, 0.3);
          }
          for (let k = 0; k < 9; k++) {   // the crown: nine fronds fanning in the wall's plane, drooping at the sides
            const a = (k - 4) / 4 * 1.25, len = 2.3 - Math.abs(k - 4) * 0.12;
            const fr = new Mesh(new BoxGeometry(axis === "x" ? 0.16 : 0.06, len, axis === "x" ? 0.06 : 0.16), M2.gold);
            const cu = Math.sin(a) * len / 2, cv = Math.cos(a) * len / 2;
            put(fr, u + cu * 1.05, trunkTop + cv - Math.abs(Math.sin(a)) * 0.35, 0.36);
            if (axis === "x") fr.rotation.z = -a; else fr.rotation.x = a;
          }
          tmp.add(P);
        };
        const GATES = [];
        for (const gx of [-78, -48, -18]) GATES.push(["x", 70.0, 1, gx, 13.5, 20, 5.0]);    // the south: the Delek, the Bechorot, the Water
        for (const gx of [-78, -48]) GATES.push(["x", -70.0, -1, gx, 13.5, 20, 5.0]);       // the north: the Nitzotz, the Korban
        GATES.push(["z", 97.9, 1, 0, 13.5, 20.7, 5.6]);                                     // Nikanor's (toward the women's court)
        GATES.push(["z", 231.0, 1, 0, 6, 20, 5.0]);                                         // the women's court's gate (to the chel)
        for (const [axis, face, out, mid, y0, h, half] of GATES) for (const sd of [-1, 1]) palm(axis, face, out, mid + sd * (half + 0.75), y0, h);
        bakeTo(tmp, palmG);
        ctx2.labels.push({ text: "״וְאֶל־אַיִל תִּמֹרִים״ (יחזקאל מ, טז) — תמרים בפתחי השערים", x: -48, y: 36.5, z: 72.5, size: 1.4, layer: "gatePalms" });
        ctx2.labels.push({ text: "תמרים — ״וְאֶל־אַיִל תִּמֹרִים״ (יחזקאל מ, טז)", x: 233, y: 29.5, z: -9, size: 1.3, layer: "gatePalms" });
      }
      // ---- RAMPS_B2 (the user's decision 41: "לכאורה מחויב המציאות"): A RAMP FOR THE BEASTS at the gate of the firstborn (the south) and
      // at the gate of the offering (the north) - "בשער הבכורות בדרום ובשער הקרבן בצפון היו כבשים, כדי להעלות את הבהמות" (the booklet
      // "אלחנן וחיים עולים לירושלים", its list of sources, D113 - from Rav Chaim Kanievsky; drawn there as a winding ramp beside the
      // stairs). Here: beside each gate's flight, on the chel's outer strip, a ramp in two runs with a round turn between them - from the
      // chel's floor up to the gate's landing (13.5) - on piers, so that one may pass under it to the flight's foot; a low parapet.
      // Its form, its slope (1 in 4), its width, the piers and where it stands - model choices (to be shown to the user).
      const rampG = new Group(); rampG.name = "animalRamps"; g.add(rampG); ctx2.layers.animalRamps = rampG;
      {
        const tmp = new Group(), RISE = 13.5, RUN = 27, W1 = 2.8;
        const deck = (x0, y0, x1, y1, z0, z1) => {   // a sloping deck along x, from (x0, y0) to (x1, y1), between z0 and z1
          const L = Math.hypot(x1 - x0, y1 - y0), m = new Mesh(new BoxGeometry(L, 0.5, Math.abs(z1 - z0)), M2.stoneSmooth);
          m.position.set((x0 + x1) / 2, (y0 + y1) / 2 - 0.25, (z0 + z1) / 2); m.rotation.z = Math.atan2(y1 - y0, x1 - x0); tmp.add(m);
          const par = (z) => { const p = new Mesh(new BoxGeometry(L, 0.8, 0.22), M2.stoneLight); p.position.set((x0 + x1) / 2, (y0 + y1) / 2 + 0.4, z); p.rotation.z = m.rotation.z; tmp.add(p); };
          return par;
        };
        const pier = (x, yTop, z) => { if (yTop < 0.6) return; const p = new Mesh(new BoxGeometry(0.8, yTop, 0.8), M2.stone); p.position.set(x, yTop / 2, z); tmp.add(p); };
        for (const s of [1, -1]) {   // s: +1 the south (the Bechorot), -1 the north (the Korban); the flight runs dx (the south: east, the north: west)
          const gx = -48, dx = s > 0 ? 1 : -1, xa = gx + dx * 1, xb = xa + dx * RUN;
          const z1a = 74.2 * s, z1b = 77.0 * s, z2a = 77.2 * s, z2b = 80.0 * s;
          const y = (x, top, bot) => top + (bot - top) * Math.abs(x - xa) / RUN;
          const p1 = deck(xa, RISE, xb, RISE / 2, z1a, z1b);   // the upper run: from the landing, along the flight
          p1(z1b + 0.11 * s);
          const p2 = deck(xb, RISE / 2, xa, 0, z2a, z2b);      // the lower run: back to the chel's floor
          p2(z2b - 0.11 * s);
          // the turn: a flat landing, half round, at the runs' far end
          const tz = (z1a + z2b) / 2, tr = Math.abs(z2b - z1a) / 2;
          const tb = new Mesh(new CylinderGeometry(tr, tr, 0.5, 24, 1, false, dx > 0 ? 0 : Math.PI, Math.PI), M2.stoneSmooth);
          tb.position.set(xb, RISE / 2 - 0.25, tz); tmp.add(tb);
          const tw = new Mesh(new CylinderGeometry(tr + 0.05, tr + 0.05, 0.8, 24, 1, true, dx > 0 ? 0 : Math.PI, Math.PI), M2.stoneLight);
          tw.position.set(xb, RISE / 2 + 0.4, tz); tmp.add(tw);
          pier(xb + dx * tr * 0.55, RISE / 2 - 0.5, tz);
          for (let k = 1; k * 4.5 < RUN; k++) {
            const x = xa + dx * k * 4.5;
            pier(x, y(x, RISE, RISE / 2) - 0.5, (z1a + z1b) / 2);
            pier(x, y(x, 0, RISE / 2) - 0.5, (z2a + z2b) / 2);
          }
        }
        bakeTo(tmp, rampG);
        for (const s of [1, -1]) ctx2.labels.push({ text: "כבש לבהמות — מפי הגר״ח קניבסקי, כפי שהובא בחלמיש", x: -48 + (s > 0 ? 1 : -1) * 22, y: 16, z: 77 * s, size: 1.3, layer: "animalRamps" });
      }
      // (OIL_DOORS_B2 - the oil chamber's second door, the user's decision 81: held - question 78 to the user, 22.11.2026 02:3x)
      // ---- WOODWORMS_B2 (the user's decision 85): "מזרחית צפונית, היא היתה לשכת העצים, ששם הכהנים בעלי מומין מתליעין העצים. וכל עץ שנמצא
      // בו תולעת, פסול מעל גבי המזבח" (Middot 2:5, 89:16); the Bartenura (643:91): "מסירין העצים שנמצא בהן תולעת"; the Yachin (819:235):
      // "בודקין העצים, להסיר כל עץ שהתליע". Three priests in the aisle by the door - one seated on a log, one standing, one crouching by a
      // small heap - each with a log in his hands. Their clothes: no source was found (they do no service) - their own clothes (the user's
      // decision 68 (2): "בגדי חול"); the kit's kind "levi" - the clothes of the figure's own colour, the kippah set back and, on a weekday,
      // the tefillin of the head and of the arm, as the Levites' (no priestly garments - the user's decision 67; fix-a2's kit). The heap and
      // the places - model choices.
      {
        const O = eznProps["לשכת העצים"] || g, PW = tm_people(ctx2);
        const logM = M2.cedar;
        const log = (x, y, z, yaw, len = 1.5, r = 0.13) => { const m = new Mesh(new CylinderGeometry(r, r * 1.08, len, 8), logM); m.rotation.z = HP; m.rotation.y = yaw; m.position.set(x, y, z); m.castShadow = true; m.userData.noPick = true; O.add(m); return m; };
        const ahead = (x, z, yaw, d) => [x + Math.sin(yaw) * d, z + Math.cos(yaw) * d];
        const HX = 193.4, HZ = -47.6;                                                  // the heap being checked
        for (const [dx, dy, dz, a] of [[0, 0.14, 0, 0.3], [0.1, 0.14, 0.32, 0.2], [-0.1, 0.14, -0.32, 0.45], [0.05, 0.4, 0.15, 0.1], [0, 0.4, -0.18, 0.5]]) log(HX + dx, 6 + dy, HZ + dz, a);
        const toHeap = (x, z) => Math.atan2(HX - x, HZ - z);
        const A = [196.2, -45.3], B = [196.4, -49.9], C = [191.2, -49.2];
        const ya = toHeap(A[0], A[1]), yb = toHeap(B[0], B[1]), yc = toHeap(C[0], C[1]);
        // MUMIN_W (agent W, the user's decision 214: "אתה חייב לעשות מום, כמו שתום עין, שבור רגל וכד', אחרת איך יבינו שהם בעלי מום?"):
        // each of the three has one blemish of the verse's (Leviticus 21:18-20, 3:639-641) - seen plainly, decent and not frightening:
        // the seated one "שבר רגל" (21:19) - his right leg stretched forward, bound in white linen over two splints, a staff leaning on
        // his left shoulder; the standing one "גבן" (21:20) - his back bent and a hump on its upper part (his robe over it); the
        // crouching one "עור" (21:18) - blind in one eye: his right eye's lid half down over a clouded white eye, the other open. No
        // patch over the eye (a later sign). Which blemish to whom, and their forms - model choices. Each one's extras in his own frame (the
        // crowd's matrix), shown with his near level (the staff and the binding with the mid one too)
        const MUM = { s: 1.4 };
        const figM = (near) => { const m = new Matrix4(); near.children[0].getMatrixAt(0, m); return m; };
        const mumGroup = (near, m, mid) => {   // a group in the figure's frame: in the near level, and (mid) a copy in the mid level
          const G = new Group();
          G.matrixAutoUpdate = false;
          G.matrix.copy(m);
          near.add(G);
          if (mid) { const G2 = G.clone(); near.userData.crowd.lod.mid.add(G2); return [G, G2]; }
          return [G];
        };
        const mumMesh = (geo, mat) => { const x = new Mesh(geo, mat); x.castShadow = false; x.receiveShadow = true; x.userData.noPick = true; return x; };
        // ---- (1) THE SEATED ONE: "או איש אשר יהיה בו שבר רגל" (21:19)
        const LEG = -1;   // his right leg
        log(A[0], 6.35, A[1], ya, 1.2, 0.2);                                       // the log he sits on
        // his log lies across his left knee (on the bent leg's thigh), his left hand on it (until now it hung before his chest)
        const KL = { c: [0.16, 0.2 + 0.13 / 1.4 + 0.006, 0.27], r: 0.13 / 1.4, len: 1.3 / 1.4 };
        const HL = { H: [0.13, KL.c[1] + 0.165, KL.c[2] - 0.055], W: [0.15, KL.c[1] + 0.19, KL.c[2] - 0.067], rx: 0.2 };   // (the hand's place on the log: fitted to its form, its palm and fingers on the log, nothing within it)
        const nA = PW.crowd(O, [[A[0], A[1], ya]], { y: 6.7, s: 1.4, pose: "bench", seat: 0.7, kind: "levi", robe: 0x6b5a3e, tone: () => 2, shadow: true, fwd: 0.3, name: "woodworm-seated", exact: true, mum: { key: "legR|logL", legOut: LEG, hand: { 1: HL } } });
        { const p = new Vector3(...KL.c).applyMatrix4(figM(nA)); log(p.x, p.y, p.z, ya, 1.3); }
        {
          const LL = PW.legLine(0.7 / 1.4), xc = LEG * LL.x, TAU = Math.PI * 2;
          const P = (d, a, r) => { const q = LL.at(d); return [xc + Math.cos(a) * r, q[0] + LL.up[0] * Math.sin(a) * r, q[1] + LL.up[1] * Math.sin(a) * r]; };   // a: 0 outward-left (+x), pi/2 up the leg's front
          const gridG = (ni, nj, fn) => {
            const pos = [], col = [], idx = [];
            for (let j = 0; j <= nj; j++) for (let i = 0; i <= ni; i++) { const r = fn(i, j); pos.push(r[0], r[1], r[2]); col.push(r[3], r[3], r[3]); }
            for (let j = 0; j < nj; j++) for (let i = 0; i < ni; i++) { const a = j * (ni + 1) + i, b = a + 1, c = a + ni + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
            const q = new BufferGeometry();
            q.setAttribute("position", new Float32BufferAttribute(pos, 3));
            q.setAttribute("color", new Float32BufferAttribute(col, 3));
            q.setIndex(idx);
            q.computeVertexNormals();
            return q;
          };
          // the binding: white linen wound round from the knee (within the robe's hem) to the ankle, each turn over the one before it
          const D0 = 0.38, D1 = 0.865, rB = (d) => 0.049 - 0.011 * Math.max(0, Math.min(1, (d - 0.5) / 0.36)) + 0.004 * Math.exp(-Math.pow((d - 0.56) / 0.07, 2));
          const wind = gridG(24, 40, (i, j) => {
            const a = (i / 24) * TAU, d = D0 + (D1 - D0) * (j / 40), t = ((a / TAU + (d - D0) / 0.052) % 1 + 1) % 1, r = rB(d) + 0.0034 * t;
            const p = P(d, i === 24 ? 0 : a, r);
            return [p[0], p[1], p[2], 0.8 + 0.2 * t];
          });
          const linen = new MeshStandardMaterial({ color: 0xf1ece0, vertexColors: true, roughness: 0.92 });
          // the splints: two boards along the shin - one on its outer side, one before it - and three bands of the linen round them
          const wood = new MeshStandardMaterial({ color: 0x9c7a52, roughness: 0.85, side: DoubleSide });
          const board = (a0) => {   // a closed board: its four long faces and its two ends
            const r0 = rB(0.56) + 0.0046, w = 0.034, th = 0.011, c = [[-1, 0], [1, 0], [1, 1], [-1, 1]], pos = [], idx = [];
            for (const d of [0.43, 0.835]) for (const [u, h] of c) pos.push(...P(d, a0 + (u * w / 2) / r0, r0 + h * th));
            for (let k = 0; k < 4; k++) { const a = k, b = (k + 1) % 4; idx.push(a, b, 4 + a, b, 4 + b, 4 + a); }
            idx.push(0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7);
            const q = new BufferGeometry();
            q.setAttribute("position", new Float32BufferAttribute(pos, 3));
            q.setIndex(idx);
            return q.toNonIndexed();
          };
          const aOut = LEG > 0 ? 0 : Math.PI;   // the boards: one on the shin's outer side (a 0 is +x - for the right leg the outer side is at pi), one before it
          const boards = [aOut, Math.PI / 2].map((a0) => { const q = board(a0); q.computeVertexNormals(); return q; });
          const bandAt = (dm) => gridG(36, 3, (i, j) => {
            const a = (i / 36) * TAU, d = dm + (j / 3 - 0.5) * 0.026;
            let r = rB(d) + 0.0038;
            for (const a0 of [aOut, Math.PI / 2]) { const da = Math.atan2(Math.sin(a - a0), Math.cos(a - a0)); r = Math.max(r, rB(0.56) + 0.0046 + 0.011 + 0.0028 - 0.06 * Math.max(0, Math.abs(da) - 0.36)); }
            const p = P(d, a, r + 0.0012 * Math.sin(Math.PI * j / 3));
            return [p[0], p[1], p[2], 0.86 + 0.1 * Math.sin(Math.PI * j / 3)];
          });
          const bands = [0.49, 0.635, 0.78].map(bandAt);
          // the foot: its heel on the floor at the leg's end, the toes up and forward; in a shoe as the other foot's
          const fa = -LL.ga + 1.22, fd = [Math.sin(fa), Math.cos(fa)], fn = [-Math.cos(fa), Math.sin(fa)];   // (y, z): the foot's way, its sole's normal
          const ank = LL.at(LL.len), ext = Math.hypot(0.1 * fd[0], 0.034 * fn[0]);
          const foot = new SphereGeometry(1, 10, 6);
          foot.scale(0.052, 0.034, 0.1);
          foot.rotateX(-fa);
          const fz = ank[1] + fd[1] * 0.035, fy = -0.5 + 0.003 + ext;
          foot.translate(xc, fy, fz);
          const shoeM = new MeshStandardMaterial({ color: 0x2f2a26, roughness: 0.9 });
          // the staff: a plain stick, from the floor at his left leaning on his left shoulder
          const sF = [0.5, -0.5 + 0.004, 0.1], sC = [0.362, 0.62, 0.02], sd0 = [sC[0] - sF[0], sC[1] - sF[1], sC[2] - sF[2]], sl = Math.hypot(...sd0), SL = 1.52;
          const stick = new CylinderGeometry(0.019, 0.022, SL, 8, 6);
          { const pp = stick.attributes.position; for (let i = 0; i < pp.count; i++) { const y = pp.getY(i); pp.setX(i, pp.getX(i) + 0.006 * Math.sin(y * 4.1)); pp.setZ(i, pp.getZ(i) + 0.005 * Math.sin(y * 2.7 + 1)); } stick.computeVertexNormals(); }
          stick.translate(0, SL / 2, 0);
          stick.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), new Vector3(sd0[0] / sl, sd0[1] / sl, sd0[2] / sl)));
          stick.translate(sF[0], sF[1], sF[2]);
          const staffM = new MeshStandardMaterial({ color: 0x6e5236, roughness: 0.88 });
          for (const G of mumGroup(nA, figM(nA), true)) {
            G.add(mumMesh(wind, linen));
            for (const b of boards) G.add(mumMesh(b, wood));
            for (const b of bands) G.add(mumMesh(b, linen));
            G.add(mumMesh(foot, shoeM));
            G.add(mumMesh(stick, staffM));
          }
          MUM.leg = { LL, xc, foot: [xc, fy, fz], ext, stick: [sF, sd0.map((v) => v / sl), SL] };
        }
        // ---- (2) THE STANDING ONE: "או גבן" (21:20) - the upper back rounded forward (from the waist to the shoulders), the neck lifted
        // back a little (the face forward, to the log in his hands), and a hump on the upper back under the robe
        const bend = (y, z, y0, y1, th) => {
          if (y <= y0) return [y, z];
          const k = th / (y1 - y0), r = 1 / k, t = k * (Math.min(y, y1) - y0), ov = Math.max(0, y - y1), c = Math.cos(t), sn = Math.sin(t);
          return [y0 + (r - z) * sn + ov * c, r - (r - z) * c + ov * sn];
        };
        const sst = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
        const gaben = (v) => {
          let y = v[1], z = v[2];
          z -= 0.085 * Math.exp(-0.5 * Math.pow((y - 1.6) / 0.09, 2)) * Math.exp(-0.5 * Math.pow(v[0] / 0.12, 2)) * sst(-0.02, -0.12, z);   // the hump
          [y, z] = bend(y, z, 1.84, 1.93, -0.3);    // the neck back
          [y, z] = bend(y, z, 1.28, 1.8, 0.62);     // the back bent
          v[1] = y; v[2] = z;
        };
        const nB = PW.crowd(O, [[B[0], B[1], yb]], { y: 6, s: 1.4, pose: "stand", kind: "levi", robe: 0x4a4f5a, tone: () => 1, shadow: true, name: "woodworm-standing", exact: true, mum: { key: "gaben", warp: gaben } });
        { const v = [0, 2.0 / 1.4, 0.5 / 1.4]; gaben(v); const p = new Vector3(v[0], v[1], v[2]).applyMatrix4(figM(nB)); log(p.x, p.y, p.z, yb, 1.4); MUM.gaben = { log: [p.x, p.y, p.z] }; }   // his log where his hands now are
        // ---- (3) THE CROUCHING ONE: "איש עור" (21:18) - blind in his right eye (the coordinator's note on draft 1: shut, it was a wink):
        // the upper lid down to its half, under it the eye white and clouded - the iris and the pupil a milky grey-white, no dark spot -
        // and the brow on that side a little lower. The face's own texture, copied and painted over at that eye, on a patch over it (its
        // edge under the skin: the same texture there, no seam), the lowered lid a little raised over the eye; the brow lowered with the
        // skin and the hair round it (the kit's warp)
        const HYC = 2.075 - 0.96;   // the head's middle (a sitting figure's)
        const droop = (v) => {   // the right brow (-x) down a little, its outer end more
          const x = v[0], y = v[1] - HYC, z = v[2];
          if (x > -0.008 || z < 0.06) return;
          const w = sst(0.008, 0.03, -x) * Math.exp(-0.5 * Math.pow((y - 0.027) / 0.011, 2)) * sst(0.06, 0.1, z);
          v[1] -= 0.0045 * w * (0.45 + 0.55 * sst(0.02, 0.07, -x));
        };
        const nC = PW.crowd(O, [[C[0], C[1], yc]], { y: 6, s: 1.4, pose: "ground", kind: "levi", robe: 0x5c4a3a, tone: () => 3, shadow: true, name: "woodworm-crouching", exact: true, mum: { key: "eyeR", warp: droop } });
        { const [hx, hz] = ahead(C[0], C[1], yc, 0.6); log(hx, 6.75, hz, yc, 1.2); }
        {
          const F = tm_face(), ES = -1, TAU = Math.PI * 2;   // his right eye (-x)
          const lidUp = (u) => F.EY + 0.0015 * u + 0.0077 * Math.pow(Math.max(0, 1 - u * u), 0.72) * (1 - 0.14 * u);   // (face.js's)
          const lidLo = (u) => F.EY + 0.0015 * u - 0.0051 * Math.pow(Math.max(0, 1 - u * u), 1.05) * (1 + 0.16 * u);
          const T = (u) => ES * (F.TE + u * F.WT), cl = (u) => Math.max(-1, Math.min(1, u));
          const yM = (u) => lidLo(cl(u)) + 0.5 * (lidUp(cl(u)) - lidLo(cl(u)));   // the lowered lid's margin: half the eye
          // the texture: face.js's skin, copied, and this eye painted over
          const src = F.tex.skin.image, cv = document.createElement("canvas");
          cv.width = src.width; cv.height = src.height;
          const c = cv.getContext("2d");
          c.drawImage(src, 0, 0);
          const PX = (th, y) => { const t = F.uvOf(th, y); return [t[0] * cv.width, (1 - t[1]) * cv.height]; };
          const path = (fn, n) => { c.beginPath(); for (let k = 0; k <= n; k++) { const [th, y] = fn(k / n), p = PX(th, y); if (k) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); } };
          const lerp = (a, b2, t) => a + (b2 - a) * t;
          let sk = [0, 0, 0];   // the lid's own skin: as it is above the eye, under the brow
          for (let k = 0; k < 5; k++) { const p = PX(T(-0.4 + 0.2 * k), lidUp(-0.4 + 0.2 * k) + 0.008), d = c.getImageData(p[0] | 0, p[1] | 0, 1, 1).data; sk = sk.map((v, i) => v + d[i] / 5); }
          const rgb = (m, a) => "rgba(" + sk.map((v) => Math.round(Math.min(255, v * m))).join(",") + "," + (a == null ? 1 : a) + ")";
          c.save();
          path((t) => (t <= 0.5 ? [T(lerp(-1, 1, t * 2)), lidUp(lerp(-1, 1, t * 2))] : [T(lerp(1, -1, t * 2 - 1)), lidLo(lerp(1, -1, t * 2 - 1))]), 64);
          c.clip();
          const [ix, iy] = PX(T(0), F.EY + 0.0012), rx = Math.abs(PX(T(0) + ES * 0.0079 / 0.128, 0)[0] - PX(T(0), 0)[0]);
          const g1 = c.createRadialGradient(ix, iy, 0, ix, iy, rx * 2.6);   // the white, dull
          g1.addColorStop(0, "rgb(222,221,214)"); g1.addColorStop(1, "rgb(196,190,180)");
          c.fillStyle = g1; c.fillRect(ix - rx * 4, iy - rx * 3, rx * 8, rx * 6);
          const g2 = c.createRadialGradient(ix, iy, 0, ix, iy, rx * 1.05);   // the iris and the pupil clouded: milky grey-white, no dark spot
          g2.addColorStop(0, "rgba(236,238,236,0.95)"); g2.addColorStop(0.4, "rgba(200,207,212,0.95)"); g2.addColorStop(0.78, "rgba(150,163,173,0.9)"); g2.addColorStop(0.92, "rgba(140,153,164,0.65)"); g2.addColorStop(1, "rgba(140,153,164,0)");
          c.fillStyle = g2; c.beginPath(); c.arc(ix, iy, rx * 1.1, 0, TAU); c.fill();
          c.restore();
          // the lowered upper lid: the skin from the eye's top down to its half, a little darker toward its margin; under it a shade
          const top = (u) => lidUp(cl(u)) + 0.0011;
          path((t) => (t <= 0.5 ? [T(lerp(-1.02, 1.02, t * 2)), top(lerp(-1.02, 1.02, t * 2))] : [T(lerp(1.02, -1.02, t * 2 - 1)), yM(lerp(1.02, -1.02, t * 2 - 1))]), 64);
          const [, y0] = PX(0, F.EY + 0.0077 + 0.0011), [, y1] = PX(0, yM(0));
          const g3 = c.createLinearGradient(0, y0, 0, y1);
          g3.addColorStop(0, rgb(1)); g3.addColorStop(0.7, rgb(0.95)); g3.addColorStop(1, rgb(0.84));
          c.fillStyle = g3; c.fill();
          c.save();   // the shade the lid casts on the eye under it
          path((t) => (t <= 0.5 ? [T(lerp(-1, 1, t * 2)), yM(lerp(-1, 1, t * 2))] : [T(lerp(1, -1, t * 2 - 1)), lidLo(lerp(1, -1, t * 2 - 1))]), 64);
          c.clip();
          c.strokeStyle = "rgba(70,44,30,0.4)"; c.lineWidth = 3;
          path((t) => [T(lerp(-1, 1, t)), yM(lerp(-1, 1, t)) - 0.0006], 32); c.stroke();
          c.restore();
          c.lineCap = "round";
          c.strokeStyle = "rgba(38,22,14,0.95)"; c.lineWidth = 2.4;   // the lashes on the lowered margin
          path((t) => [T(lerp(-0.92, 1, t)), yM(lerp(-0.92, 1, t)) + 0.0002], 32); c.stroke();
          const tex = new CanvasTexture(cv);
          tex.colorSpace = F.tex.skin.colorSpace; tex.anisotropy = 4; tex.flipY = F.tex.skin.flipY;
          // the patch: over the eye and its lids, the face's own form a little out from it, the lowered lid raised a little more
          const UM = 1.32, YC = 0.001, YH = 0.0128, NI = 48, NJ = 14;
          const pos = [], uv = [], idx = [];
          for (let j = 0; j <= NJ; j++) for (let i = 0; i <= NI; i++) {
            const rho = j / NJ, a = (i / NI) * TAU, u = UM * rho * Math.cos(a), y = YC + YH * rho * Math.sin(a) * (Math.sin(a) > 0 ? 1.06 : 0.94);
            const th = T(u), lidK = sst(yM(u) - 0.0004, yM(u) + 0.0005, y) * (1 - sst(0.9, 1.1, Math.abs(u))) * (1 - sst(lidUp(cl(u)) + 0.001, lidUp(cl(u)) + 0.0045, y));
            const off = 0.0011 + 0.0006 * lidK - 0.0018 * sst(0.45, 1, rho), R = F.skinR(th, y, "face", true) + off;   // (from rho 0.78 out it sinks under the skin - there hi's skin is lo's)
            const v = [Math.sin(th) * R, y + HYC, Math.cos(th) * R];
            droop(v);
            pos.push(v[0], v[1], v[2]);
            const t = F.uvOf(th, y);
            uv.push(t[0], t[1]);
          }
          for (let j = 0; j < NJ; j++) for (let i = 0; i < NI; i++) { const a = j * (NI + 1) + i, b = a + 1, c2 = a + NI + 1, d = c2 + 1; if (ES < 0) idx.push(a, b, c2, b, d, c2); else idx.push(a, c2, b, b, c2, d); }   // (outward: the right eye's grid is mirrored)
          const lid = new BufferGeometry();
          lid.setAttribute("position", new Float32BufferAttribute(pos, 3));
          lid.setAttribute("uv", new Float32BufferAttribute(uv, 2));
          lid.setIndex(idx);
          lid.computeVertexNormals();
          const lidM = new MeshStandardMaterial({ color: 0xf3e7dc, map: tex, roughness: 0.8 });   // the crowd's first skin (SKINS[1]), as his head's
          for (const G of mumGroup(nC, figM(nC), false)) G.add(mumMesh(lid, lidM));
          MUM.eye = { side: ES };
        }
        ctx2.shared.mumimW = MUM;
        const l0 = ctx2.labels.length;
        lbl("כהנים בעלי מומין מתליעין העצים (מידות ב, ה)", HX + 1.5, 11.2, HZ, 1.3);
        if (eznLbl["לשכת העצים"]) eznLbl["לשכת העצים"].push(...ctx2.labels.slice(l0));
      }
    }
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    Object.assign(ctx2.shared.flyPoints, {
      ezratNashim: { pos: [240, 85, 125], target: [160, 6, 0] },
      nikanor: { pos: [190, 35, 40], target: [93, 22, 0] },
      azarah: { pos: [150, 105, 150], target: [20, 15, 0] }
    });
  }

