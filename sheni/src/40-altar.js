  // plugin/js/altar.js
  function slopedSlab(parent, H2, mat, x, w, z1, y1, z2, y2, th = 0.65) {
    const run = z2 - z1, drop = y2 - y1, len = Math.hypot(run, drop);
    const geo = H2.uvWorldBox(new BoxGeometry(w, th, len), w, th, len);
    const m = new Mesh(geo, mat);
    const r = -Math.asin(drop / len);
    m.rotation.x = r;
    m.position.set(x, (y1 + y2) / 2 - th / 2 * Math.cos(r), (z1 + z2) / 2);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  async function build3(ctx2) {
    const { H: H2, M: M2 } = ctx2;
    const g = new Group();
    g.name = "altar";
    ctx2.root.add(g);
    // 1.3.0: everything that is THE ALTAR - its body, yesod and sovev, the ramps, the pyres and the fire, the rubuva and the two tables by
    // the ramp - sits in `mv`, which ctx2.shared.altarPlace moves north or south (the Tannaim's dispute, below); the laver, the rings and
    // the slaughter place stay in `g` (the court's furniture)
    const mv = new Group();
    g.add(mv);
    const F = LV.KOH;
    const ACX = 55.5, ACZ = -3.5;
    const TOP = F + 9;
    const AS = M2.altarStone;
    // 1.9.1 (the user: "לר׳ יוסי כל המזבח היה יותר קטן ולא רק למעלה - צריך לעשות הקטנה ממשית של המזבח בשיטה זו"): the body is built by
    // buildBody for a base of W - the Mishnah's 32 (body32, the default) and R. Yose's first altar of 28 (body28; Middot 3:1 "בתחלה היה שמנה
    // ועשרים על שמנה ועשרים, כונס ועולה במדה זו, עד שנמצא מקום המערכה עשרים על עשרים. כשעלו בני הגולה הוסיפו עליו ארבע אמות מן הדרום
    // וארבע אמות מן המערב, כמין גאם"): its north and east faces are the present altar's, so the north-east corner (x 71.5, z -19.5) is
    // fixed and the rest recedes by the same steps - yesod 1, sovev 5 up and 1 in, horns and the priests' walk 1 each. ctx2.shared.
    // altarMeasures.set("yose") swaps the bodies and moves with it the ramps (2 east, 4 north), the libation bowls (4 east, 4 north) and
    // the pyres (scaled into the 20 x 20, below)
    const YESOD_LEVI_MAT = AS.clone();   // YESOD_211
    YESOD_LEVI_MAT.color.setRGB(0.86, 0.66, 0.6);
    const SOVEV_MAT = AS.clone();   // SOVEV_211
    SOVEV_MAT.color.multiplyScalar(1.16);
    const sikra = M2.plaster.clone();
    sikra.color.set(9318179);
    const bandY = F + 4.925;
    const holeMat = new MeshBasicMaterial({ color: 1315081 });
    // KARKOV_A2 (fix-a2, 22.11.2026; the user's decisions 1-2): THE KARKOV OF BEAUTY - flowers and buds standing out of the wall, white
    // as the altar ("ומלבנים אותן", Middot 3:4), in the upper amah under the sovev's roof, above the red line. Zevachim 62a (130:2109,
    // 2112): "איזהו כרכוב? רבי אומר: זה כיור, רבי יוסי ברבי יהודה אומר: זה הסובב"; "תרי הוו; חד לנוי, וחד לכהנים דלא נשתרקו"; Rashi
    // (2191:2969-2970) "ציורים של פרחים וציצים וקלעים סביב למזבח"; "ציורים סביב למעלה מאמצעו"; Yachin, Middot 3:4 (819:321): "ובאמה
    // העליונה שבגובה הסובב למעלה מחוט הסקרא היו מצויירים פרחים וציצים בולטים מהקיר סביב"; 3:17 (819:347) "ו' טפחים למטה מגג הסובב,
    // שבאותן ו' טפחים היה כיור". Two readings - ctx2.shared.karkov.set("rabbi" | "none"): Rabbi (the default), or without (R. Yose b.
    // R. Yehuda: "זה הסובב"; the Rambam does not mention it). Not under the ramp's head (the south face, where the ramp floats).
    const KARKOV_MAT = M2.plaster.clone();
    KARKOV_MAT.color.setRGB(0.97, 0.96, 0.92);
    // KARKOV_A2: the flowers and buds of the karkov - instanced, one mesh for the flowers and one for the buds, along faces
    // [[x0, z0, x1, z1, nx, nz] ...] (nx, nz - the face's outward normal), at the height yc, skipping the x ranges in `skip` on faces
    // whose normal is +z (the ramp's place); a molding above and below (y0, y1). Their size and spacing - model choices.
    const karkovBand = (parent, faces, y0, y1, mat, skip) => {
      // KARKOV_BIG_A2 (the user: "יותר בולט וגדול"): the flowers and buds 1.4 times as large, standing out 2.6 times as far, a little
      // farther apart (0.62); the moldings above and below thicker - model choices
      const yc = (y0 + y1) / 2, sc = Math.min(1, (y1 - y0) / 0.6) * 1.4, D = 2.6 / 1.4;
      const petal = (k) => { const q = new SphereGeometry(1, 7, 5); q.scale(0.065 * sc, 0.11 * sc, 0.035 * sc * D); q.translate(0, 0.1 * sc, 0.02 * sc * D); q.rotateZ(k * Math.PI * 2 / 5); return q; };
      const ctr = new SphereGeometry(1, 9, 6); ctr.scale(0.06 * sc, 0.06 * sc, 0.05 * sc * D); ctr.translate(0, 0, 0.035 * sc * D);
      const gFlower = mergeGeometries([ctr, petal(0), petal(1), petal(2), petal(3), petal(4)].map((q) => { q.deleteAttribute("uv"); return q; }));
      const bud = new SphereGeometry(1, 8, 6); bud.scale(0.05 * sc, 0.12 * sc, 0.045 * sc * D); bud.translate(0, 0.02 * sc, 0.03 * sc * D);
      const leaf = (s) => { const q = new SphereGeometry(1, 6, 4); q.scale(0.03 * sc, 0.08 * sc, 0.02 * sc * D); q.rotateZ(s * 0.8); q.translate(s * 0.05 * sc, -0.07 * sc, 0.015 * sc * D); return q; };
      const gBud = mergeGeometries([bud, leaf(-1), leaf(1)].map((q) => { q.deleteAttribute("uv"); return q; }));
      const pts = [];
      for (const [x0, z0, x1, z1, nx, nz] of faces) {
        const L = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(L / 0.62);
        for (let i = 0; i < n; i++) {
          const u = (i + 0.5) / n, x = x0 + (x1 - x0) * u, z = z0 + (z1 - z0) * u;
          if (nz > 0.5 && skip && skip.some(([a, b]) => x > a && x < b)) continue;
          pts.push([x + nx * 0.005, z + nz * 0.005, Math.atan2(nx, nz), i % 2]);
        }
      }
      const m4 = new Matrix4(), q4 = new Quaternion(), up = new Vector3(0, 1, 0), one = new Vector3(1, 1, 1), ps = new Vector3();
      for (const kind of [0, 1]) {
        const list = pts.filter((p) => p[3] === kind), im = new InstancedMesh(kind ? gBud : gFlower, mat, list.length);
        list.forEach(([x, z, yaw], i) => { q4.setFromAxisAngle(up, yaw); m4.compose(ps.set(x, yc, z), q4, one); im.setMatrixAt(i, m4); });
        im.instanceMatrix.needsUpdate = true;
        im.castShadow = false; im.receiveShadow = true; im.userData.noPick = true;
        parent.add(im);
      }
      for (const [x0, z0, x1, z1, nx, nz] of faces) for (const y of [y0, y1 - 0.04]) {   // the moldings
        const L = Math.hypot(x1 - x0, z1 - z0), b = new Mesh(new BoxGeometry(Math.abs(nx) > 0.5 ? 0.12 : L + 0.24, 0.06, Math.abs(nx) > 0.5 ? L + 0.24 : 0.12), mat);
        b.position.set((x0 + x1) / 2 + nx * 0.06, y + 0.03, (z0 + z1) / 2 + nz * 0.06);
        b.userData.noPick = true;
        parent.add(b);
      }
    };
    // HORNS_A2 (fix-a2, 22.11.2026; the user's decisions 47, 49, 80): THE HORNS HOLLOW, a square opening at the top as the booklet
    // draws it - the Rambam, Beit HaBechirah 2:8 (337:31): "וְאַרְבַּע הַקְּרָנוֹת חֲלוּלוֹת הָיוּ מִתּוֹכָן". Four walls (a sixth of an amah thick,
    // a model choice) and the hollow dark within them, half the horn deep. A group whose origin is at the altar's top; height h
    // over it (and 0.1 sunk into it).
    const hornHollow = (parent, mat, x, y, z, h, inner) => {
      const hg = new Group(), T = 0.34, W = 1, H = h + 0.1;   // SUDAR_A2: the mouth a third of the horn (0.32), as the booklet draws it (0.68 until now) - the deputy stands on its rim
      hg.position.set(x, y, z);
      for (const [w, d, ox, oz] of [[W, T, 0, -(W - T) / 2], [W, T, 0, (W - T) / 2], [T, W - 2 * T, -(W - T) / 2, 0], [T, W - 2 * T, (W - T) / 2, 0]]) {
        const m = new Mesh(new BoxGeometry(w, H, d), mat);
        m.position.set(ox, H / 2 - 0.1, oz);
        m.castShadow = m.receiveShadow = true;
        hg.add(m);
      }
      const din = h * 0.55, lin = new Mesh(new BoxGeometry(W - 2 * T - 0.004, din, W - 2 * T - 0.004), inner);   // the hollow: its walls and floor dark (seen from within)
      lin.material = inner.userData.back || (inner.userData.back = Object.assign(inner.clone(), { side: BackSide }));
      lin.position.y = h - din / 2 - 0.004;
      hg.add(lin);
      parent.add(hg);
      return hg;
    };
    const hornInner = new MeshStandardMaterial({ color: 0x2a2018, roughness: 1 });
    const buildBody = (grp, W) => {
      const x0 = 71.5 - W, z1 = -19.5 + W, cx = 71.5 - W / 2, cz = -19.5 + W / 2;
      H2.box(grp, W, 1, 1, AS, cx, F, -19);                              // the yesod along the north
      H2.box(grp, 1, 1, W - 1, AS, x0 + 0.5, F, (-18.5 + z1) / 2);        // and along the west
      H2.box(grp, 1, 1, 1, AS, x0 + 1.5, F, z1 - 0.5);                   // "ואוכל בדרום אמה אחת"
      H2.box(grp, 1, 1, 1, AS, 71, F, -18);                              // "ובמזרח אמה אחת"
      // Rambam, Hilchot Beit HaBechirah 2:11 (= Middot 3:2): in the south-west corner there were two thin holes (nekavim).
      // The exact spot inside the corner is not specified in the sources; modeled as two small dark openings on the corner of the yesod.
      // 1.9.5 (a remark sent on to the user, 11.11.2026: "ברמב"ם משמע שהם היו על היסוד ממש"; the user: "מקבל את הצעתך"): they stood on
      // the yesod's corner since 1.0, but a fifth of an amah across and unnamed - nobody saw them. Now each a dark round mouth in a pale
      // rim, a third of an amah across (still "דקין"), side by side on the corner's top, and a label over them (SHITIN_LABEL, below).
      for (const hx of [x0 + 0.27, x0 + 0.74]) {
        H2.cyl(grp, 0.23, 0.23, 0.03, M2.stoneLight, hx, F + 1.0, z1 - 0.45, 20);
        H2.cyl(grp, 0.16, 0.16, 0.04, holeMat, hx, F + 1.0, z1 - 0.45, 20);
      }
      H2.box(grp, W - 2, 6, W - 2, AS, cx, F, cz);
      // SOVEV_211 (the user, 14.11.2026: "סובב עבה יותר וברור"): the sovev's walk is its own slab - a third of an amah thick, standing a
      // little out of the faces below it, and paler than the altar's stones - so that the step reads at once. Its measures stay the
      // Mishnah's ("עלה חמש אמות וכנס אמה, זהו הסובב", Middot 3:1); the slab's thickness and colour - a model choice
      H2.box(grp, W - 2 + 0.32, 0.34, W - 2 + 0.32, SOVEV_MAT, cx, F + 5.68, cz);
      {   // KARKOV_A2: on the four faces of the wall below the sovev (x0 + 1 .. 70.5, z -18.5 .. z1 - 1), between the red line and the sovev's slab
        const kg = new Group(), xa = x0 + 1, xb = 70.5, za = -18.5, zb = z1 - 1, rx = W === 32 ? 0 : 2;
        kg.name = "karkov";
        karkovBand(kg, [[xa, za, xb, za, 0, -1], [xa, zb, xb, zb, 0, 1], [xa, za, xa, zb, -1, 0], [xb, za, xb, zb, 1, 0]], F + 5.09, F + 5.68, KARKOV_MAT, [[47.3 + rx, 63.7 + rx]]);
        grp.add(kg);
        (buildBody.karkov || (buildBody.karkov = [])).push(kg);
      }
      H2.box(grp, W - 4, 3.1, W - 4, AS, cx, F + 5.9, cz);
      // HORNS_A2: hollow, and their height by the reading of the altar's measures (hornsFit, below)
      for (const hx of [x0 + 2.5, 69]) for (const hz of [-17, z1 - 2.5])
        (buildBody.horns || (buildBody.horns = [])).push(hornHollow(grp, AS, hx, F + 9, hz, 1, hornInner));
      H2.box(grp, W - 1.76, 0.15, 0.12, sikra, cx, bandY, -18.53);
      H2.box(grp, W - 1.76, 0.15, 0.12, sikra, cx, bandY, z1 - 0.97);
      H2.box(grp, 0.12, 0.15, W - 1.8, sikra, x0 + 0.97, bandY, cz);
      H2.box(grp, 0.12, 0.15, W - 1.8, sikra, 70.53, bandY, cz);
      // 1.9.3 (the user, of the kuntres, point 8: "כך עשית לא?" - it was in the card's words only): THE SLAB OF THE SHIT - Middot 3:3
      // "למטה ברצפה באותה הקרן, מקום היה שם אמה על אמה, וטבלא של שיש, וטבעת היתה קבועה בה, שבו יורדין לשית ומנקין אותו" (89, line 21).
      // Drawn as the keys' slab of Beit HaMoked (30-courts.js): a marble tablet of an amah with a bronze ring, in the floor by the
      // south-west corner, west of the end of the path to the yesod (between the path and the ramp it stood in the ramp's shadow). The
      // exact spot by the corner - a model choice.
      H2.box(grp, 1.12, 0.03, 1.12, holeMat, x0 - 0.5, F, z1 + 0.8);
      // SHITIN_OPEN_420 (the user, 24.11.2026, of the amah's mouth: "הצורה המטופשת הזו מיותרת! תעשה שבכל לחיצה על מתג זה תפתח הטבלה ויראו
      // מים!"): the slab and its ring are lifted and laid beside the place, and the water is seen in it (ctx2.shared.shitinSlab.set(open))
      { const sl = H2.box(grp, 1, 0.08, 1, M2.marble, x0 - 0.5, F, z1 + 0.8), rg = H2.ring(grp, 0.18, 0.04, M2.bronze, x0 - 0.5, F + 0.12, z1 + 0.8);
        const wM = tm_water(new MeshStandardMaterial({ color: 0x3f86b8, roughness: 0.08, metalness: 0.1, emissive: 0x0e2a40, emissiveIntensity: 0.6 }), { mode: "flow", flow: [0.55, 0.55], scale: 0.25 });   // WATER_420; AMAH_FLOW_420: running into the amah (south-east, its way under the court), not standing
        const wt = new Mesh(new BoxGeometry(0.96, 0.02, 0.96), wM); wt.position.set(x0 - 0.5, F + 0.035, z1 + 0.8); wt.visible = false; wt.userData.noPick = true; grp.add(wt);
        const L = ctx2.shared.shitinSlabs = ctx2.shared.shitinSlabs || [];
        L.push({ sl, rg, wt, x: x0 - 0.5, z: z1 + 0.8, ry: rg && rg.position ? rg.position.y : F + 0.12 });
        ctx2.shared.shitinSlab = { open: false, set(v) { this.open = !!v; for (const q of ctx2.shared.shitinSlabs) { const dx = this.open ? -1.35 : 0; if (q.sl) q.sl.position.x = q.x + dx; if (q.rg) q.rg.position.x = q.x + dx; q.wt.visible = this.open; } } }; }
      // 1.9.3 (the user, of the kuntres' author's note 8: "להוסיף כשיטה אחרי שיש מקור"): LEVI'S READING - Zevachim 54a "מאי לא היה לה
      // יסוד? רב אמר: בבנין, לוי אמר: בדמים" (130, line 1872); Rashi "לוי אומר בדמים - יסוד היה על פני כל המזרח אבל לא נותנין דמים בחלקו
      // של יהודה" (2191, line 2599). The yesod runs on along the east and the south as well (the south - under the ramp's head, which
      // floats over it); hidden for Rav (the default). ctx2.shared.yesodLevi.set(on).
      const levi = new Group();
      levi.visible = false;
      grp.add(levi);
      // YESOD_211 (decision 1 of the user, 14.11.2026: "לא להסיר מתג" - the review: "אין הבדל נראה"): Levi's yesod in Yehudah's portion is
      // of a darker, reddish stone - built, but not for the blood ("אבל לא נותנין דמים בחלקו של יהודה") - so that the two readings are told
      // apart at a glance; and each reading has its own label at the south-east corner (below). The tint - a model choice
      H2.box(levi, 1, 1, W - 3, YESOD_LEVI_MAT, 71, F, (z1 - 18.5) / 2);            // along the east, from the amah of the north-east corner
      H2.box(levi, W - 2, 1, 1, YESOD_LEVI_MAT, cx + 1, F, z1 - 0.5);               // along the south, from the amah of the south-west corner
      (buildBody.levi || (buildBody.levi = [])).push(levi);
      // 1.9.3 (the user, of the kuntres' author's note 9: "תעשה, חיבור תעשה ותכתוב מודל"): THE YESOD - A RECEPTACLE. Rashi on Shemot
      // 29:12 (3692, line 2101): "אל יסוד המזבח - כמין בליטת בית קבול עשוי לו סביב סביב, לאחר שעלה אמה מן הארץ" - a low rim on the
      // outer edge of the yesod's top, wherever there is a yesod (Levi's too). And where there is none - Rashi, Zevachim 54a (2191,
      // line 2597): "למעלה מג' דלאו קרקע הוא, עשוי כמין בליטה קטנה כנגד אותה הקרן לקבל בה דם עולת העוף שלא יפול לארץ; וקיר מזבח
      // מיקרי, אבל יסוד לא מיקרי" - a small ledge above three handbreadths (half an amah), round the south-east corner; it runs on
      // along the south to the amah of yesod in the south-west corner, where the two holes are (the run to the holes is the kuntres'
      // author's, not in the sources - a model choice, and so are the rim's and the ledge's measures). Hidden in Levi's reading.
      const RIM = 0.14, RT = 0.1;
      H2.box(grp, W, RIM, RT, AS, cx, F + 1, -19.5 + RT / 2);                        // the north edge
      H2.box(grp, RT, RIM, W, AS, x0 + RT / 2, F + 1, cz);                           // the west edge
      const rav = new Group();
      grp.add(rav);
      H2.box(rav, 2, RIM, RT, AS, x0 + 1, F + 1, z1 - RT / 2);                       // the amah in the south: its south edge and its end
      H2.box(rav, RT, RIM, 1, AS, x0 + 2 - RT / 2, F + 1, z1 - 0.5);
      H2.box(rav, RT, RIM, 2, AS, 71.5 - RT / 2, F + 1, -18.5);                      // the amah in the east: its east edge and its end
      H2.box(rav, 1, RIM, RT, AS, 71, F + 1, -17.5 - RT / 2);
      H2.box(levi, RT, RIM, W, AS, 71.5 - RT / 2, F + 1, cz);                        // Levi's: the east and the south edges
      H2.box(levi, W, RIM, RT, AS, cx, F + 1, z1 - RT / 2);
      const LW = 0.3, LY = F + 0.5, LH = 0.12;
      H2.box(rav, 29 - (W === 32 ? 0 : 4), LH, LW, AS, (x0 + 2 + 70.5) / 2, LY, z1 - 1 + LW / 2);   // the ledge along the south face (z1 - 1), from the south-west amah to the corner
      H2.box(rav, LW, LH, 3 + LW, AS, 70.5 + LW / 2, LY, z1 - 1 - 1.5 + LW / 2);     // and round the corner, three amot of the east face
      H2.box(rav, 29 - (W === 32 ? 0 : 4) + LW, 0.08, 0.06, AS, (x0 + 2 + 70.5 + LW) / 2, LY + LH, z1 - 1 + LW - 0.03);   // its rim
      H2.box(rav, 0.06, 0.08, 3 + LW, AS, 70.5 + LW - 0.03, LY + LH, z1 - 1 - 1.5 + LW / 2);
      (buildBody.rav || (buildBody.rav = [])).push(rav);
      if (W === 32) ctx2.labels.push({ text: "בליטה קטנה לקבל דם עולת העוף (רש״י זבחים נד.)", x: 72.6, y: F + 2.2, z: z1 - 1.5, size: 1, layer: "altarBody32", moveWithAltar: true },
        { text: "היסוד — כמין בליטת בית קיבול (רש״י שמות כט, יב)", x: x0 - 1.2, y: F + 2.6, z: -8, size: 1, layer: "altarBody32", moveWithAltar: true });
    };
    const body32 = new Group(), body28 = new Group();
    body28.visible = false;
    mv.add(body32);
    mv.add(body28);
    buildBody(body32, 32);
    buildBody(body28, 28);
    ctx2.shared.__horns = buildBody.horns;   // HORNS_A2 (tests)
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.altarBody32 = body32;
    ctx2.layers.altarBody28 = body28;
    // YESOD_211: two empty groups - the labels of each reading follow them (a label with `layers` shows only when all are visible)
    const yRavL = new Group(), yLevL = new Group();
    yLevL.visible = false;
    mv.add(yRavL, yLevL);
    ctx2.layers.yesodRavL = yRavL;
    ctx2.layers.yesodLevL = yLevL;
    ctx2.labels.push(
      { text: "כאן אין יסוד — רב: ״בבנין״ (זבחים נד.)", x: 73.2, y: F + 0.9, z: 16.4, size: 1.25, layers: ["altarBody32", "yesodRavL"], moveWithAltar: true },
      { text: "יסוד בחלקו של יהודה — לוי: ״בדמים״, אין נותנים עליו דם (זבחים נד.)", x: 73.2, y: F + 0.9, z: 16.4, size: 1.25, layers: ["altarBody32", "yesodLevL"], moveWithAltar: true }
    );
    // KARKOV_A2: the reading's switch, and the label's group
    const karkovL = new Group();
    mv.add(karkovL);
    ctx2.layers.karkovL = karkovL;
    ctx2.labels.push({ text: "כרכוב — פרחים וציצים (רבי: ״זה כיור״, זבחים סב.)", x: 73.4, y: F + 5.4, z: -2, size: 1.1, layers: ["altarBody32", "karkovL"], moveWithAltar: true,
      info: "**הכרכוב** (זבחים סב.): ״איזהו כרכוב? רבי אומר: זה כיור, רבי יוסי ברבי יהודה אומר: זה הסובב״. רש״י: ״זה כיור — ציורים סביב למעלה מאמצעו״. במודל — כרבי: פרחים וציצים בולטים, לבנים, באמה העליונה שמעל חוט הסיקרא; ובתפריט, תחת ״שיטות ומחלוקות״ — ״הכרכוב — פרחים וציצים במזבח״. גודלם והמרווח ביניהם — בחירת מודל.",
      refs: [["זבחים סב.", { book: 130, index: 2109 }], ["רש״י זבחים סב.", { book: 2191, index: 2970 }]] });
    ctx2.shared.karkov = { mode: "rabbi", set(m) { this.mode = m === "none" ? "none" : "rabbi"; const on = this.mode === "rabbi"; for (const g of buildBody.karkov || []) g.visible = on; karkovL.visible = on; return this.mode; } };
    ctx2.shared.yesodLevi = { on: false, set(v) { this.on = !!v; for (const g of buildBody.levi || []) g.visible = this.on; for (const g of buildBody.rav || []) g.visible = !this.on; yRavL.visible = !this.on; yLevL.visible = this.on; return this.on; } };   // 1.9.3; YESOD_211
    // ===== 1.0.21: ramps rebuilt as solid wedges (the old small ramps were thin slabs standing on posts).
    // Main ramp: Middot 3:3 (32 x 16, south of the altar); it rises 9 amot to the top of the altar; its top is NOT joined to the altar ("a little air",
    // Rambam Beit HaBechira 2:13; Zevachim 62b) and its upper 2 amot float over the entry of the yesod and the soveiv (Rashi Zevachim 62b), hence 62 and not 64 (Middot 5:2).
    // Small ramps: "two small ramps go out of the ramp, by them they turn to the yesod and to the soveiv, and they are separated from the altar by a hair" (Rav Yehuda, Zevachim 62b).
    //  Rashi (62b d"h shnei kvashim): the one to the soveiv goes out on the EAST of the ramp (right) and rises diagonally to the soveiv; the one to the yesod goes out on the WEST (left) to the southern yesod.
    //  Tosafot (Zevachim 64a d"h yoter): there was also a ramp in the west to the soveiv (so that one could turn to the soveiv there too) -> a third small ramp (switch in the panel).
    // MODEL CHOICES: exact start/length/width of the small ramps (width 3, slope 1:3), the hair gap (0.05).
    // 1.3.0 (the user, after the reviewer's notes; Rashi Zevachim 62b, Rambam Beit HaBechirah 2:14 "שני כבשים קטנים יוצאים ממנו"): the small
    // ramps LEAVE THE BIG RAMP - their lower end sits on its surface (h0 = the big ramp's height there), never on the floor. The ramp to the
    // yesod runs DIAGONALLY from the big ramp's west side to the one amah of yesod in the south-west corner (Middot 3:1 "אוכל בדרום אמה אחת";
    // the drawings of Tosafot Yom Tov and Tiferet Yisrael), since the yesod does not run along the south. MODEL CHOICES: widths, slopes,
    // the branching points (the east ramp from the point where the big ramp is 2.7 high, Tosafot's third ramp from 5.2, the yesod path from
    // the big ramp's foot), the hair gap (0.05).
    const RAMP_H = (z) => 9 * (42.6 - z) / 32;   // the big ramp's height at z (its foot z 42.6, its top z 10.6 at 9)
    const wedge = (xa, xb, zTop, zBot, h, grp, h0) => {
      const sh = new Shape();
      sh.moveTo(0, 0);
      sh.lineTo(zBot - zTop, 0);
      if (h0 > 0) sh.lineTo(zBot - zTop, h0);
      sh.lineTo(0, h);
      sh.closePath();
      const geo = new ExtrudeGeometry(sh, { depth: xb - xa, bevelEnabled: false });
      geo.rotateY(-Math.PI / 2);
      geo.translate(xb, F, zTop);
      const m = new Mesh(geo, AS);
      m.castShadow = m.receiveShadow = true;
      (grp || mv).add(m);
      return m;
    };
    // a sloped strip from (x1, z1, h1) to (x2, z2, h2), w wide, solid down to the floor (the diagonal path to the yesod)
    const strip = (x1, z1, h1, x2, z2, h2, w, grp) => {
      const L = Math.hypot(x2 - x1, z2 - z1);
      const sh = new Shape();
      sh.moveTo(0, 0);
      sh.lineTo(L, 0);
      sh.lineTo(L, h2);
      sh.lineTo(0, h1);
      sh.closePath();
      const geo = new ExtrudeGeometry(sh, { depth: w, bevelEnabled: false });
      geo.translate(0, 0, -w / 2);
      const m = new Mesh(geo, AS);
      m.position.set(x1, F, z1);
      m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      m.castShadow = m.receiveShadow = true;
      (grp || mv).add(m);
      return m;
    };
    // 1.9.1: the ramps in their own group (rampG), which R. Yose's first altar moves 2 east and 4 north - the big ramp stays in the middle of
    // the altar's south face and reaches it as before (ctx2.shared.altarMeasures)
    const rampG = new Group();
    mv.add(rampG);
    // 1.9.3 (the user, 10.11.2026: "הוסף שיטות לרווח: תוס', ר' חיים בתוס'"; "תעשה אמה ורבע"): THE AIR BETWEEN THE RAMP AND THE ALTAR - three
    // readings, each a whole wedge of its own (no seam), switched by ctx2.shared.rampGap.set("hair" | "tosafot" | "chaim"):
    //  "hair" (the default, as before): "מבדל מן המזבח מלא חוט השערה" (Rashi Shemot 27:5; 3692 line 1912), "ואויר מעט" (Rambam 2:13);
    //  "tosafot" (Zevachim 62b d"h אויר קרקע; 1936 line 663): "קרקע לאו דוקא... אבל הכא בעינן אויר גדול וניכר" - half an amah, over the sovev
    //   (the measure - a model choice);
    //  "chaim" (Tosafot Zevachim 87b; 1936 line 949): "יש אויר מפסיק יותר מכדי אמה סובב, כדי שיהא אויר קרקע מפסיקו" - an amah and a
    //   quarter (the user's measure). The foot stays in its place and the slope is the same: the head only ends earlier (a little lower).
    // The altar's upper face is at z 10.5 (ACZ + 14).
    // RAMP_WAYS_211 (stage ב, point 6; the user: "מעולה"): Yoma 4:5 (55:35) - "בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו, והיום
    // כהן גדול עולה באמצע ויורד באמצע". Chevrons on the big ramp's face: blue up the east lane, orange down the west lane, gold up and
    // down the middle (Yom Kippur), with their labels; shown only while the place is chosen (the feature "rampWays"). In rampG, so they
    // go with the altar's place and R. Yose's first altar. The lanes' breadth and the marks: model choices.
    {
      const WG = new Group();
      WG.name = "rampWays";
      WG.visible = false;
      rampG.add(WG);
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.rampWays = WG;
      const slope = Math.atan2(9, 32);
      const chev = (col) => {   // a flat chevron, its point toward +z (down the ramp), 1.6 wide and 1.1 long
        const sh = new Shape();
        // NOTE 5 (the understandability review, U-47): a chevron alone did not tell which way it points, seen along the slope - an
        // arrow with a shaft now (the same point, the same size)
        sh.moveTo(0, -0.75); sh.lineTo(0.75, 0.0); sh.lineTo(0.28, 0.0); sh.lineTo(0.28, 0.85); sh.lineTo(-0.28, 0.85); sh.lineTo(-0.28, 0.0); sh.lineTo(-0.75, 0.0); sh.lineTo(0, -0.75);
        const geo = new ShapeGeometry(sh);
        geo.rotateX(-Math.PI / 2);   // lying flat: the shape's y -> the world's z
        return { geo, mat: new MeshBasicMaterial({ color: col, transparent: true, opacity: 0.88, depthWrite: false, side: DoubleSide }) };
      };
      const lane = (x, col, up, zs) => {
        const k = chev(col);
        for (const z of zs) {
          const m = new Mesh(k.geo, k.mat);
          m.position.set(x, F + RAMP_H(z) + 0.06, z);
          m.rotation.set(slope, up ? Math.PI : 0, 0, "XYZ");   // the turn in its own plane first (the shape points +z: down), then the slope
          m.renderOrder = 7;
          m.userData.noPick = true;
          WG.add(m);
        }
      };
      lane(ACX + 4.5, 0x2f7fe0, true, [38.5, 33, 27.5, 22, 16.5]);
      lane(ACX - 4.5, 0xf08a1c, false, [38.5, 33, 27.5, 22, 16.5]);
      lane(ACX - 0.9, 0xe2b13c, true, [36, 28, 20]);
      lane(ACX + 0.9, 0xe2b13c, false, [32, 24, 16]);
      // NOTE 5 (U-47): the three labels one above the other over the middle of the ramp (two were cut by the card, which stands on the
      // window's left, or by the window's edge), each in its lane's colour
      ctx2.labels.push({ text: "״כהנים עולים במזרחו של כבש״", x: ACX, y: F + RAMP_H(23) + 6.2, z: 23, size: 1.1, box: true, rim: "#2f7fe0", layer: "rampWays", moveWithAltar: true },
        { text: "״ויורדין במערבו״", x: ACX, y: F + RAMP_H(23) + 4.6, z: 23, size: 1.1, box: true, rim: "#f08a1c", layer: "rampWays", moveWithAltar: true },
        { text: "״והיום כהן גדול עולה באמצע ויורד באמצע״ (יומא ד, ה)", x: ACX, y: F + RAMP_H(23) + 3.0, z: 23, size: 1.1, box: true, rim: "#e2b13c", layer: "rampWays", moveWithAltar: true });
      ctx2.shared.features = ctx2.shared.features || {};
      ctx2.shared.features.rampWays = { key: "rampWays", timed: false, isOn: () => WG.visible, on: () => { WG.visible = true; }, off: () => { WG.visible = false; } };
    }
    // LUL_A2 (the user's decision 60): THE LITTLE LUL - "לול קטן היה בין כבש למזבח במערבו של כבש, ואחת לשבעים שנה פרחי כהונה יורדין
    // לשם, ומלקטין משם יין קרוש" (Sukkah 49a, 108:1263); Rashi there (2163:2318): "ולול היה באותו אויר במערבו של כבש, בשמונה אמות
    // מערבית של כבש... ואותו חלל שהנסכים יורדין לתוכו... ומוקף ארבע מחיצות עד קרקעיתו". A small opening in the floor with its lid,
    // against the altar's base (z 12.5), at the ramp's west side - where it can be seen (Rashi places it in the air between them, in the
    // ramp's western half). Its size and the lid - model choices. In rampG: it goes with the altar's place.
    {
      const LG = new Group();
      LG.position.set(ACX - 8.6, F, 13.0);
      rampG.add(LG);
      H2.box(LG, 1.1, 0.06, 1.1, M2.stoneSmooth, 0, 0, 0);                                       // its curb
      const hole = new Mesh(new BoxGeometry(0.7, 0.03, 0.7), new MeshStandardMaterial({ color: 0x120c08, roughness: 1 })); hole.position.y = 0.05; LG.add(hole);
      const lid = new Mesh(new BoxGeometry(0.66, 0.05, 0.66), M2.bronze); lid.position.set(0.12, 0.09, 0.08); lid.rotation.y = 0.18; lid.castShadow = true; LG.add(lid);   // the lid, a little aside
      const rg = new Mesh(new TorusGeometry(0.08, 0.018, 6, 12), M2.bronze); rg.rotation.x = Math.PI / 2; rg.position.set(0.12, 0.12, 0.08); LG.add(rg);
      ctx2.labels.push({ text: "הלול הקטן — ״לול קטן היה בין כבש למזבח במערבו של כבש״ (סוכה מט.)", x: ACX - 8.6, y: F + 1.6, z: 13.4, size: 1.0, moveWithAltar: true,
        info: "**הלול הקטן** (סוכה מט.): ״אמר רבי אלעזר בר צדוק: לול קטן היה בין כבש למזבח במערבו של כבש, ואחת לשבעים שנה פרחי כהונה יורדין לשם, ומלקטין משם יין קרוש״.\n**רש״י** (שם): ״ולול היה באותו אויר במערבו של כבש, בשמונה אמות מערבית של כבש... ואותו חלל שהנסכים יורדין לתוכו... ומוקף ארבע מחיצות עד קרקעיתו״.\nבמודל: פתח קטן ומכוסה ברצפה, צמוד ליסוד המזבח, במערב הכבש — במקום שנראה מן העזרה (לרש״י — באויר שבין הכבש למזבח, בחציו המערבי של הכבש). גודלו והמכסה — בחירת מודל.",
        refs: [["סוכה מט.", { book: 108, index: 1263 }], ["רש״י סוכה מט.", { book: 2163, index: 2318 }]] });
    }
    // SALT_A2 (the user's decision 51): THE SALT - "בשלשה מקומות המלח נתונה: בלשכת המלח, ועל גבי הכבש, ובראשו של מזבח... על גבי הכבש
    // – ששם מולחים את האברים, בראשו של מזבח – ששם מולחין הקומץ והלבונה והקטורת... ועולת העוף" (Menachot 21b, 131:727; the Rambam,
    // Issurei HaMizbeach 5:13, 339:80) - a heap of salt on the ramp's west half, by its top, and one on the altar's top by its south
    // edge; and "בוזקין מלח על גבי כבש בשביל שלא יחליקו" (Eruvin 104a, 105:3801) - a little salt strewn on the ramp's face. The heaps'
    // size and places - model choices. In rampG (the ramp's) and mv (the top's): they go with the altar's place.
    {
      const SM = new MeshStandardMaterial({ color: 0xf4f2ec, roughness: 0.75 });
      // SALT_HEAP_A2 (the user on picture 29: "ערמה גדולה ועבה. נראה לי שגם לא כל כך מסודר כמו שעשית"): a big, thick heap, not neat - a
      // lumpy mound, its rim uneven, a smaller lump or two leaning on it and loose grains round its foot; white with a little grey. Its
      // size (about two and a half amot across, more than an amah high) and its form - model choices.
      const SMH = new MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.9, flatShading: true });
      const heap = (parent, x, y, z, r, seed0 = 1) => {
        let sd = seed0 * 7919 + 13;
        const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
        const g = new Group();
        g.position.set(x, y, z);
        parent.add(g);
        const mound = (R, H, cx, cz) => {
          const geo = new SphereGeometry(1, 44, 14, 0, Math.PI * 2, 0, Math.PI / 2), P = geo.attributes.position, col = [];
          const ph = [rnd() * 6.3, rnd() * 6.3, rnd() * 6.3], lumps = Array.from({ length: 9 }, () => [rnd() * 6.3, 0.25 + rnd() * 0.6, 0.12 + rnd() * 0.2, 0.08 + rnd() * 0.12]);
          const c0 = new Color(0xf7f6f1), c1 = new Color(0xc6c4bd), c = new Color();
          for (let i = 0; i < P.count; i++) {
            const vx = P.getX(i), vy = P.getY(i), vz = P.getZ(i), a = Math.atan2(vx, vz), k = Math.hypot(vx, vz);
            const rim = 1 + 0.16 * Math.sin(3 * a + ph[0]) + 0.09 * Math.sin(5 * a + ph[1]) + 0.05 * Math.sin(11 * a + ph[2]);   // the uneven foot
            let up = vy;
            for (const [la, lr, lw, lh] of lumps) { const da = Math.atan2(Math.sin(a - la), Math.cos(a - la)), d = Math.hypot(da * k, k - lr); up += lh * Math.exp(-(d * d) / (lw * lw)) * (vy > 0.02 ? 1 : 0); }
            const n = 0.035 * (Math.sin(vx * 17 + vz * 11) + Math.sin(vz * 23 - vx * 7));   // its face rough
            P.setXYZ(i, cx + vx * R * rim * (1 + n), Math.max(0, up * H * (1 + n * 2)), cz + vz * R * rim * (1 + n));
            c.copy(c0).lerp(c1, Math.max(0, Math.min(1, 0.35 + 3 * n + 0.25 * (rnd() - 0.5))) * 0.55);
            col.push(c.r, c.g, c.b);
          }
          geo.setAttribute("color", new Float32BufferAttribute(col, 3));
          geo.computeVertexNormals();
          const m = new Mesh(geo, SMH); m.castShadow = true; m.receiveShadow = true; g.add(m);
        };
        mound(r, r * 0.82, 0, 0);
        mound(r * 0.45, r * 0.42, r * 0.82, -r * 0.35);
        mound(r * 0.3, r * 0.22, -r * 0.7, r * 0.6);
        // loose grains round its foot
        const gg = new IcosahedronGeometry(0.045, 0), NG = 90, gm = new InstancedMesh(gg, SM, NG), m4 = new Matrix4(), ps = new Vector3(), sc = new Vector3(), q = new Quaternion(), e = new Euler();
        for (let i = 0; i < NG; i++) { const a = rnd() * 6.283, d = r * (1.05 + rnd() * 0.55), s2 = 0.6 + rnd() * 1.2; m4.compose(ps.set(Math.sin(a) * d, 0.015, Math.cos(a) * d), q.setFromEuler(e.set(rnd() * 3, rnd() * 3, rnd() * 3)), sc.set(s2, s2 * 0.7, s2)); gm.setMatrixAt(i, m4); }
        gm.userData.noPick = true;
        g.add(gm);
        return g;
      };
      const slope = Math.atan2(9, 32);
      const onR = (x, z, r) => { const m = heap(rampG, x, F + RAMP_H(z), z, r, 3); m.rotation.x = slope; return m; };
      onR(ACX - 6.6, 14.4, 1.15);                                                 // the limbs' salt, on the ramp's west half by its top
      heap(mv, ACX - 4.3, F + 9, 6.9, 1.25, 5);                                   // on the altar's top, by its south edge
      // strewn on the face, the length of the ramp: a scatter of small grains (one instanced mesh)
      const gg = new SphereGeometry(0.035, 4, 3), N = 260, grains = new InstancedMesh(gg, SM, N), m4 = new Matrix4(), ps = new Vector3(), one = new Vector3(1, 1, 1), q0 = new Quaternion();
      let seed = 7;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      for (let i = 0; i < N; i++) { const z = 12 + rnd() * 30, x = ACX - 7.5 + rnd() * 15; m4.compose(ps.set(x, F + RAMP_H(z) + 0.02, z), q0, one); grains.setMatrixAt(i, m4); }
      grains.userData.noPick = true;
      rampG.add(grains);
      const saltInfo = "**המלח** (מנחות כא:): ״נמצאת אתה אומר, בשלשה מקומות המלח נתונה: בלשכת המלח, ועל גבי הכבש, ובראשו של מזבח. בלשכת המלח – ששם מולחין עורות קדשים, על גבי הכבש – ששם מולחים את האברים, בראשו של מזבח – ששם מולחין הקומץ והלבונה והקטורת, ומנחת כהנים ומנחת כהן משיח ומנחת נסכים, ועולת העוף״; וכן ברמב״ם (איסורי המזבח ה, יג).\nועוד (עירובין קד.): ״בוזקין מלח על גבי כבש בשביל שלא יחליקו״ — ובגמרא: ״בהולכת עצים למערכה, דלאו עבודה היא״.\nבמודל: ערמת מלח על הכבש, בחציו המערבי סמוך לראשו; ערמה בראש המזבח, סמוך לשפתו הדרומית; ומעט מלח פזור על פני הכבש. גודל הערמות ומקומן — בחירת מודל.";
      const saltRefs = [["מנחות כא:", { book: 131, index: 727 }], ["רמב״ם איסורי המזבח ה, יג", { book: 339, index: 80 }], ["עירובין קד.", { book: 105, index: 3801 }], ["עירובין קד. — בהולכת עצים", { book: 105, index: 3807 }]];
      ctx2.labels.push({ text: "מלח — ״על גבי הכבש, ששם מולחים את האברים״ (מנחות כא:)", x: ACX - 6.6, y: F + RAMP_H(14.4) + 2.1, z: 14.4, size: 0.9, moveWithAltar: true, info: saltInfo, refs: saltRefs },
        { text: "מלח — ״ובראשו של מזבח״ (מנחות כא:)", x: ACX - 4.3, y: F + 10.9, z: 7.0, size: 0.9, moveWithAltar: true, info: saltInfo, refs: saltRefs });
    }
    const RAMP_HEADS = { hair: 10.6, tosafot: 11.0, chaim: 11.75 };
    // 1.9.3 (the user, of the kuntres, point 10: "חריצין"): THE THREE ROVDIN - R. Hai Gaon (Beit Yosef OC 123; 3900 line 2000): "ובין כבש
    // למזבח היו שלש רובדין של אבן, ויורד בהם ג' פסיעות על עקב"; Binyan Tzion 12 (5791 line 51): one where the ramp floats over the sovev,
    // one where it floats over the yesod, one over the ground. The kuntres: three grooves near the ramp's head, which leave three rovdin
    // at its end, joined at their side to the ramp's middle; the kohanim walk over them. On the EAST half of the head (the kuntres'
    // drawing), from the ramp's middle to its east edge: 0.4, 1.4 and 2.4 from the head - in the default reading over the sovev's
    // place (z 11), over the yesod's place (12) and over the ground (13).
    // 1.9.5 (the user, 11.11.2026 16:48: "אפשר להנכיח את החריצים ללא הדגשה? - א"כ תעשה"): REAL GROOVES, NO PAINT. Until 1.9.4 they were
    // three dark boxes sunk in the head; now each reading's ramp is built of its two halves - the west one whole, the east one on a
    // profile with three notches (0.2 wide, half an amah deep, their walls square to the slope) - merged into one mesh of the ramp's
    // own stone, so the grooves are seen by their own walls and what light falls in them. Their width and depth - model choices.
    const ROV_AT = [0.4, 1.4, 2.4], ROV_W = 0.2, ROV_D = 0.5;
    // RAMP_STEPS_211 (the user, 15.11.2026: "איך יכול להיות שהכבש מופרד מהמזבח רק בחלק העליון ולא ברובו כפי שצריך?"; his choice of the
    // ways offered: "ראש מדורג עם רווח כפי שכתוב"): until now each ramp was one wedge down to the floor, its lower part sunk in the
    // sovev and the yesod - the air showed above the sovev only. Now THE HEAD IS CUT IN STEPS, as the altar's own shape, and the air
    // runs between them all the way down: "נמצא פורח אמה על יסוד ואמה על סובב" (Zevachim 62b; book 130, line 2131); Rashi (Zevachim
    // 54a; book 2191, line 2605): "ראש הכבש פורח ועולה על שתי אמות של כניסת היסוד וסובב"; and for Rav, with no yesod in the south,
    // "אימא כנגד אמה יסוד, ועל אמה סובב" (54a) - the ramp floats over the yesod's PLACE all the same, so the lowest step is cut in
    // every reading. The head (o.zU, by the reading) faces the altar's upper body; from the sovev down (o.yS) the ramp stands back
    // to the sovev's edge (o.zM); from the yesod's height down (o.yY) - to the yesod's line (o.zL). The air below the head is a
    // hair's ("אלא דסגי במשהו", the Tosafot there). The shape under the head - a model choice.
    const wedgeGrooved = (xa, xm, xb, zTop, zBot, h, grp, o) => {
      const L = zBot - zTop, th = Math.atan2(h, L), ct = Math.cos(th), st = Math.sin(th), H = (u) => h * (1 - u / L);
      const uM = o ? Math.max(0, o.zM - zTop) : 0, uL = o ? Math.max(uM, o.zL - zTop) : 0;
      const half = (x0, x1, cut) => {
        const sh = new Shape();
        sh.moveTo(uL, 0);
        sh.lineTo(L, 0);
        if (cut) for (const u of ROV_AT.slice().sort((p, q) => q - p)) {   // from the foot up to the head: the lower lip, down, across, up, the upper lip
          const bx = u + ct * ROV_W / 2, by = H(u) - st * ROV_W / 2, ax = u - ct * ROV_W / 2, ay = H(u) + st * ROV_W / 2;
          sh.lineTo(bx, by);
          sh.lineTo(bx - st * ROV_D, by - ct * ROV_D);
          sh.lineTo(ax - st * ROV_D, ay - ct * ROV_D);
          sh.lineTo(ax, ay);
        }
        sh.lineTo(0, h);
        if (o) {   // RAMP_STEPS_211: down the head to the sovev's height, back to the sovev's edge, down to the yesod's height, back to its line
          if (uM > 1e-3) { sh.lineTo(0, o.yS); sh.lineTo(uM, o.yS); }
          if (uL > uM + 1e-3) { sh.lineTo(uM, o.yY); sh.lineTo(uL, o.yY); }
        }
        sh.closePath();
        const geo = new ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false });
        // the stone's pattern runs on across the two halves: the side walls' v is 1 - (the way from the half's east end), so each half
        // adds its east end's distance from the whole ramp's
        const uv = geo.attributes.uv, sg = geo.groups && geo.groups[1];
        if (uv && sg && xb - x1 > 1e-6) { for (let i = sg.start; i < sg.start + sg.count; i++) uv.setY(i, uv.getY(i) - (xb - x1)); uv.needsUpdate = true; }
        geo.rotateY(-Math.PI / 2);
        geo.translate(x1, F, zTop);
        return geo;
      };
      const ga = half(xa, xm, false), gb = half(xm, xb, true);
      ga.clearGroups(); gb.clearGroups();
      const m = new Mesh(mergeGeometries([ga, gb]), AS);
      m.castShadow = m.receiveShadow = true;
      (grp || mv).add(m);
      return m;
    };
    const rampMain = {};
    // (the sovev's slab stands 0.16 out of the face under it and its top is 6.02; the rim of the yesod's top is 1.14 - the steps clear both by a hair, 0.1)
    for (const k in RAMP_HEADS) {
      const zU = RAMP_HEADS[k], zM = Math.max(11.76, zU), zL = Math.max(12.6, zM);
      rampMain[k] = wedgeGrooved(47.5, 55.5, 63.5, zU, 42.6, RAMP_H(zU), rampG, { zM, zL, yS: 6.12, yY: 1.25 });
      rampMain[k].name = "rampMain_" + k;
      rampMain[k].visible = k === "hair";
    }
    ctx2.labels.push({ text: "שלושה רובדין — חריצים בראש הכבש (רב האי גאון)", x: 60, y: F + 11.4, z: 12.4, size: 1.1, layer: "altarBody32", moveWithAltar: true });
    // 1.9.4 (the user, 11.11.2026: "הכבש של תוספות בבית ראשון נראה לי יותר מציאותי מאשר בבית שני"): the air of the Tosafot's reading was
    // built and not seen, so the cleft (z 10.5..11, over the sovev) was painted dark inside. 1.9.5 (the user: "ללא הדגשה"): the paint
    // is gone - the cleft is real (the ramp's head ends half an amah before the altar, down to the sovev) and is seen as it is.
    ctx2.shared.rampGap = { mode: "hair", set(m) { this.mode = Object.prototype.hasOwnProperty.call(RAMP_HEADS, m) ? m : "hair"; for (const k in rampMain) rampMain[k].visible = k === this.mode; return this.mode; } };
    // SMALL_RAMPS3_211 (the user, 15.11.2026 09:03-09:08, of the booklet's picture: "מתחיל מהשליש כרשי, פונה אלכסונית ומשם מתחבר
    // לסובב (מאז שמשתפע אין יותר חיבור לכבש הגדול - יש שם רוח מלא)"; "אותו רעיון שעשית עם הכבש מן היסוד"; "הכבש צריך להיות ממש המשך
    // לסובב"): THE RAMP TO THE SOVEV leaves the big ramp's side at its lower THIRD - Rashi (Zevachim 62b; 2191 line 3022): "ויוצא ומתחיל
    // בשפולו של כבש ונמשך ועולה באלכסון עד שמגיע לסובב" - its top there flush with the big ramp's walk; from there it turns away
    // DIAGONALLY and rises gently, the air open down to the floor between it and the big ramp, and its head is cut along the sovev's
    // edge, at the sovev's own height - the sovev's walk goes on into it - a hair from the altar ("ומובדלין מן המזבח מלא נימא", 62b; the
    // big ramp's own head floats over the yesod's place, and so does this one's). Built as a profile in (z, height), stood up over x and
    // then pushed sideways in proportion to its way along (sheared): its ends stay square to the altar. Its width (2.2) and how far it
    // turns - model choices; R. Yose's first altar is smaller, so its ramps turn less (each altar has its own, in sovR.yose).
    const zPrism = (xa, xb, pts, grp) => {
      const sh = new Shape();
      sh.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
      sh.closePath();
      const geo = new ExtrudeGeometry(sh, { depth: xb - xa, bevelEnabled: false });
      geo.rotateY(-Math.PI / 2);
      geo.translate(xb, F, 0);
      const m = new Mesh(geo, AS);
      m.castShadow = m.receiveShadow = true;
      grp.add(m);
      return m;
    };
    const shearX = (m, zFar, zNear, dx) => {   // every point pushed in x by dx * (its way from zFar to zNear)
      const p = m.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + dx * Math.max(0, Math.min(1.2, (zFar - p.getZ(i)) / (zFar - zNear))));
      p.needsUpdate = true;
      m.geometry.computeVertexNormals();
      m.geometry.computeBoundingBox();
      m.geometry.computeBoundingSphere();
      return m;
    };
    const ZT = 42.6 - 32 / 3, HT = RAMP_H(ZT);       // the big ramp's lower third (31.93, 3.0 up)
    const SZE = 11.69, SHE = 6.02, SZL = 12.6, SYY = 1.25, SRW2 = 2.2;   // the head: by the sovev slab's edge (11.66), its top (6.02); over the yesod's place
    // SMALL_RAMPS4_211 (the user, 09:32-09:34: "צריך לחבר יותר לכבש שלא תהיה קפיצה של הכהן"; "החיבור צריך להיות רק בחלק הצמוד לכבש"):
    // from the third the small ramp runs ALONG the big ramp's side for 4 amot (to ZJ), one with it - its top at the big ramp's own
    // height, no step: the priest walks over anywhere along it - and only from ZJ does it turn away, the air between them. Two pieces
    // (the second sheared from ZJ), so that each one's faces stay flat. The 4 amot - a model choice.
    const ZJ = ZT - 4, HJ = RAMP_H(ZJ);
    const SOV_P1 = [[ZJ, 0], [ZT, 0], [ZT, HT], [ZJ, HJ]];
    const SOV_P2 = [[SZL, 0], [ZJ, 0], [ZJ, HJ], [SZE, SHE], [SZE, SYY], [SZL, SYY]];
    const sovRamp = (xa, xb, dx, grp) => { zPrism(xa, xb, SOV_P1, grp); return shearX(zPrism(xa, xb, SOV_P2, grp), ZJ, SZE, dx); };
    const SOV_DX = { def: 4.6, yose: 2.6 };          // how far the head turns (R. Yose's sovev ends 2 amot short on each side)
    const sovR = { def: new Group(), yose: new Group() };
    sovR.yose.visible = false;
    rampG.add(sovR.def); rampG.add(sovR.yose);
    for (const k of ["def", "yose"]) sovRamp(63.49, 63.49 + SRW2, SOV_DX[k], sovR[k]);   // east of the big ramp (Rashi; and Tosafot)
    // 1.8.1 (the user: "הכבש ליסוד לא מחובר לכלום"): it began at the ramp's very foot, at the floor, and rose to the yesod - a loose plank.
    // Rashi (Zevachim 62b): "והפונה ליסוד יוצא למערבו... ומתחיל לצאת בשיפולו של כבש רחוק מן המזבח כדי שיהא נוח לשפע ולירד ליסוד" - it
    // leaves the lower part of the big ramp, far from the altar, and slopes DOWN gently to the yesod. Now: out of the big ramp's west side where
    // the ramp is 1.7 high (z 36.5; its top flush with the ramp's there), down to the yesod's one amah in the south-west corner (height 1), a
    // hair short of it ("ומובדלין מן המזבח מלא נימא"). Width 1.4 - model choice (g13: was 1.8, off the tables).
    // 1.9.1 (the user: "מה זה? איך הוא קשור לכבש ולמה הוא נראה כך?"): a walk, not a wall - its top a lighter paving with a kerb on each
    // side, so that it reads as the path it is; R. Yose's altar has its own path (strip28), to its own corner of the yesod
    // 1.9.2 (the user: "כבש ליסוד — אפשר" - to make it stand out): its paving warm and a little lit, its kerbs dark, its name on a plate
    const pathMat = new MeshStandardMaterial({ color: 0xe3b866, roughness: 0.8, emissive: 0x3a2508, emissiveIntensity: 0.6 });
    const kerbMat = new MeshStandardMaterial({ color: 0x5a4a38, roughness: 0.9 });
    const yesodPath = (x1, z1, h1, x2, z2, h2, grp) => {
      strip(x1, z1, h1, x2, z2, h2, 1.4, grp);
      const L = Math.hypot(x2 - x1, z2 - z1), ang = Math.atan2(z2 - z1, x2 - x1), slope = Math.atan2(h2 - h1, L);
      for (const off of [-0.8, 0, 0.8]) {   // the paving (middle) and the two kerbs
        const w = off ? 0.2 : 1.4, hh = off ? 0.25 : 0.04;
        const m = new Mesh(new BoxGeometry(L, hh, w), off ? kerbMat : pathMat);
        const nx = -Math.sin(ang) * off, nz = Math.cos(ang) * off;
        m.position.set((x1 + x2) / 2 + nx, F + (h1 + h2) / 2 + hh / 2, (z1 + z2) / 2 + nz);
        m.rotation.set(0, -ang, slope, "YXZ");
        m.castShadow = m.receiveShadow = true;
        grp.add(m);
      }
    };
    const path32 = new Group(), path28 = new Group();
    path28.visible = false;
    mv.add(path32);
    mv.add(path28);
    const path32D = new Group(), path32T = new Group(), path28D = new Group(), path28T = new Group();
    path32T.visible = path28T.visible = false;
    path32.add(path32D); path32.add(path32T); path28.add(path28D); path28.add(path28T);
    yesodPath(47.9, 36.5, RAMP_H(36.5), 40.9, 12.6, 1, path32D);
    yesodPath(49.9, 32.5, RAMP_H(36.5), 44.9, 8.6, 1, path28D);
    // SMALL_RAMPS3_211: in Tosafot's reading the third ramp (to the sovev, on the big ramp's west side) and the walk to the yesod are ONE
    // WIDE RAMP - the Tosafot Yom Tov (Zevachim 6:3; 945 line 183): "שאותו כבש עצמו היה רחב ומקצת ממנו מוגבה ועולה עד על הסובב גם כן";
    // the Lechem Shamayim (Beit HaBechirah 2:14; 5069 line 31): the left ramp to the sovev "לירידה, שבו יורדין מן המזבח להוליך בו שירים
    // ליסוד דרומי", and the one to the yesod beside it "קטן ונמוך ביותר, לפי גובהו של יסוד בלבד". So the walk to the yesod runs outside
    // the third ramp, along it, from the same third of the big ramp down to the yesod's south-west corner (in mv's frame; R. Yose's to his)
    // SMALL_RAMPS4_211: along the third ramp's attached piece, then along its turn - two lengths, a little past the bend each (no notch)
    const pathAlong = (x0, z0, xe, ze, grp) => {
      const zj = z0 - (ZT - ZJ), L1 = z0 - zj, L2 = Math.hypot(xe - x0, zj - ze), hj = HT + (1 - HT) * L1 / (L1 + L2), k = 0.45;
      const ux = (xe - x0) / L2, uz = (ze - zj) / L2, sl = (1 - HT) / (L1 + L2);
      yesodPath(x0, z0, HT, x0, zj - k, hj + k * sl, grp);
      yesodPath(x0 - ux * k, zj - uz * k, hj - k * sl, xe, ze, 1, grp);
    };
    { const f = (ZJ - 12.6) / (ZJ - SZE);   // the third ramp's push at the yesod's line (z 12.6): the walk keeps beside it
      pathAlong(47.51 - SRW2 - 0.9, ZT, 47.51 - SRW2 - 0.9 - SOV_DX.def * f, 12.6, path32T);
      pathAlong(47.51 - SRW2 - 0.9 + 2, ZT - 4, 47.51 - SRW2 - 0.9 + 2 - SOV_DX.yose * f, 8.6, path28T); }
    ctx2.layers.altarPath32 = path32;
    ctx2.layers.altarPath28 = path28;
    const ramp3 = new Group();
    ramp3.visible = false;
    rampG.add(ramp3);
    // SMALL_RAMPS3_211: Tosafot's third ramp - the eastern one's twin on the west, from the same third, turning west to the sovev
    const sov3 = { def: new Group(), yose: new Group() };
    sov3.yose.visible = false;
    ramp3.add(sov3.def); ramp3.add(sov3.yose);
    for (const k of ["def", "yose"]) sovRamp(47.51 - SRW2, 47.51, -SOV_DX[k], sov3[k]);
    ctx2.layers.altarRamp3 = ramp3;
    ctx2.shared.__smallRampsY = (y) => { sovR.def.visible = sov3.def.visible = !y; sovR.yose.visible = sov3.yose.visible = !!y; };
    const rubD = new Group(), rubT = new Group();   // the rubuva: in the big ramp's west face - and, with the third ramp there, in that ramp's
    rubT.visible = false;
    rampG.add(rubD); rampG.add(rubT);
    ctx2.shared.ramps = { tosafot: false, set(on) { this.tosafot = !!on; ramp3.visible = !!on; path32D.visible = path28D.visible = !on; path32T.visible = path28T.visible = !!on; rubD.visible = !on; rubT.visible = !!on; } };   // SMALL_RAMPS3_211: with the third ramp the window is south of it (rubT)
    // the labels: each by its own piece, one set for each altar (the layers of the bodies)
    ctx2.labels.push({ text: "כבש לסובב", x: 66.9, y: F + 6.8, z: 21.8, size: 1.5, layer: "altarBody32" },   // SMALL_RAMPS3_211: over the ramp's middle
      { text: "כבש לסובב — לתוספות", x: 44.1, y: F + 6.8, z: 21.8, size: 1.5, layers: ["altarBody32", "altarRamp3"], moveWithAltar: true }, { text: "כבש לסובב — לתוספות", x: 47.1, y: F + 6.8, z: 17.8, size: 1.5, layers: ["altarBody28", "altarRamp3"], moveWithAltar: true }, { text: "כבש ליסוד — לרש״י (זבחים סב:)", x: 42.8, y: F + 3.6, z: 19, size: 1.5, layer: "altarBody32", box: true },
      { text: "כבש לסובב", x: 67.9, y: F + 6.8, z: 17.8, size: 1.5, layer: "altarBody28" }, { text: "כבש ליסוד — לרש״י (זבחים סב:)", x: 46.2, y: F + 3.6, z: 15, size: 1.5, layer: "altarBody28", box: true });
    // 1.8.0 (the user: "טבלא מרובעת לא משתנה כלום באיור"): the Ra'avad's tapuach (below) is a square table one amah high in the middle of the
    // top, and the pyres stand on it - so everything that sits on the top (the logs, the gezirin, the flames, the lights, the smoke, the glow,
    // the coals and the round heap) is built into topG, which ctx2.shared.tapuach lifted by one amah (until 1.9.4; see 1.9.5 below).
    // mv.add is redirected to topG while those pieces are made (three windows); the libation bowls and the measure lines stay in mv.
    const topG = new Group();
    mv.add(topG);
    // 1.9.5 (the user, 11.11.2026 17:51, of the Ra'avad's tapuach: "צריך לשנות"): TWO SETS OF PYRES in topG - pyresK, the pyres of the
    // round heap's reading (as before: the logs, the gezirin and their flames), and pyresR, the Ra'avad's (built below, by his table):
    // the pyres stand BESIDE his table, not on it, so topG is no longer lifted. The lights, the smoke, the sparks, the glow and the
    // coals stay single and follow the great pyre of the reading (FXP, ctx2.shared.tapuach).
    const pyresK = new Group(), pyresR = new Group();
    pyresK.name = "pyresKri"; pyresR.name = "pyresRaavad";
    pyresR.visible = false;
    topG.add(pyresK); topG.add(pyresR);
    const toTop = (on, tgt) => { if (on) mv.add = function (...o) { return (tgt || topG).add(...o); }; else delete mv.add; };
    toTop(true, pyresK);
    const logs = [];
    const addPyre = (cx, cz, len, r, layers, list) => {
      list = list || logs;
      for (let l = 0; l < layers; l++) {
        const n = l === layers - 1 ? 2 : 3, alongX = l % 2 === 0;
        for (let i = 0; i < n; i++) {
          const off = (i - (n - 1) / 2) * len * 0.3;
          list.push({
            x: cx + (alongX ? 0 : off),
            z: cz + (alongX ? off : 0),
            y: TOP + r + l * r * 1.9,
            alongX,
            len: len * (0.9 + 0.1 * ((i + l) % 2)),
            r
          });
        }
      }
    };
    // ===== 1.0.26: the three pyres RESIZED to a natural look (the 1.0.23 great pyre, 9.7 x 18 x 4 amot, was too big).
    // GREAT PYRE (maarachah gedolah): Tamid 2:4 - east side, face east, inner ends touch the tapuach. No source gives its size (Yoma 45a: "according to the need of the korbanot"). MODEL CHOICE: 4.5 x 8 amot, 6 layers = 3 amot high (~2.2 x 3.8 x 1.4 m).
    // KETORET PYRE (second): Yoma 43b / Meiri: wood estimated to yield "5 seah of coals" (8 on Shabbat). Calculation IN AMOT (so it does not depend on which amah/seah pair is used):
    //  Rav Chaim Naeh: amah 48 cm, seah ~7.2 L -> seah = 0.065 amah^3; Chazon Ish: amah 57.6 cm, seah 14.4 L -> seah = 0.075 amah^3. 5 seah of coals = 0.33-0.38 amah^3.
    //  Assumption (mine, not a source): coals ~ 1/4 of the wood stack volume -> stack ~ 1.3-1.5 amah^3. MODEL: 1.5 x 1.5 x 0.7 amot = ~1.5 amah^3. (Shabbat: 8 seah, x1.6, not drawn.)
    // KEEPING-THE-FIRE PYRE (third, R' Yose, Yoma 45a): no size in the sources ("anywhere on the altar"). Since it is what keeps a good fire burning at all times (Yossi's reasoning) it was made BIGGER than the ketoret pyre: 2.4 x 2.4 x 1 amot (~5.5 amah^3). MODEL CHOICE.
    // THE TWO GEZIRIN (1.0.31: now on TOP of the pyre, to be seen) (Tamid 2:4; Rosh Tamid 29a: large smoothed splits; Rashi Yoma 22b / Bartenura: two long splits; Torah Temima: 1 amah x 1 amah; the inner ends touch the tapuach with a gap between them from which the fire is lit): drawn as two beams 1 x 1 amah, length = the whole depth of the great pyre, at the bottom, with a 1 amah gap. The 1x1 size is from Yossi's research (not checked by me); the placement (bottom of the pyre, east-west) is a MODEL CHOICE.
    // 1.9.3 (the user, of the kuntres "בגדרי ודיני צורת הבית", point 20: "תשנה לפי מה שכתב"): THE GREAT PYRE STANDS IN THE SOUTH-EAST -
    // the Rambam, Temidin uMusafin 2:7 "מסדרה במזרח המזבח... וראשי הגזרים הפנימיים היו נוגעין בדשן שבאמצע המזבח" (344, line 22); the
    // Mefaresh on Tamid 31b "ומקום המערכה במזרח המזבח אצל מזרחו של כבש ורחב המערכה אינו תופס עד חצי המזבח שהרי התפוח באמצע המזבח"
    // (2105, line 308). Until now in the east at the middle (z = ACZ); now its middle 4.5 south of the altar's (GP.cz), by the east of the
    // ramp's head, its north-west corner in the heap's side. How far south - a model choice.
    const GP = { x0: 59.7, x1: 64.2, hz: 4, lay: 6, R: 0.25, cz: ACZ + 4.5 };
    const GEZ_X = GP.x0 + 0.8 + 1.05 * 1.5;   // GEZIRIN_DEFAULT_195: between the second and the third log of the pyre's top layer (62.075)
    const FXP = { x0: GP.x0, x1: GP.x1, top: 3 };   // 1.9.5: where the great pyre of the chosen reading stands (x) and how high it is - the smoke and the sparks rise from it
    {
      const PX0 = GP.x0, PX1 = GP.x1, PZ0 = GP.cz - GP.hz, PZ1 = GP.cz + GP.hz, R = GP.R, LAY = GP.lay;
      for (let l = 0; l < LAY; l++) {
        const y = TOP + R + l * R * 2, top = l > 3 ? 1 : 0;
        if (l % 2 === 0) {
          for (let z = PZ0 + 0.5; z <= PZ1 - 0.5 + 1e-6; z += 1) logs.push({ x: (PX0 + PX1) / 2, z, y, alongX: true, len: PX1 - PX0 - top, r: R });
        } else {
          for (let x = PX0 + 0.8; x <= PX1 - 0.5 + 1e-6; x += 1.05) logs.push({ x, z: GP.cz, y, alongX: false, len: PZ1 - PZ0 - 2 * top, r: R });
        }
      }
      // GEZIRIN_DEFAULT_195 - 1.9.5 (the user, 11.11.2026, 22:00, asked whether the default reading's two gezirin stay two long beams
      // while the Gemara and the Rambam give their measure: "מה שכתוב במקורות הוא הנכון"). The Gemara (Zevachim 62b; the user's
      // library, book 130, line 2117): "גזירין שעשה משה – אורכן אמה, ורוחבן אמה, ועוביין כמחק גודש סאה"; R. Yirmeya there: "באמה
      // גדומה"; the Rambam (Issurei Mizbeach 7:3; book 339, line 100): "וכמותן עושין לדורות". So: two flat boards an amah by an
      // amah, a little short (0.94), as in the Ra'avad's reading since RAAVAD_PILE2 - no longer two beams 4.5 long and an amah
      // thick (1.0.31). They lie on TOP of the great pyre, bridging two of its upper logs, an amah between them. Their thickness
      // (0.1), their place on the pyre and the space between them - model choices.
      for (const dz of [-1, 1]) H2.box(mv, 0.94, 0.1, 0.94, M2.cedar, GEZ_X, TOP + LAY * R * 2, GP.cz + dz);
    }
    addPyre(46, 5, 1.5, 0.09, 4);                   // the second pyre, for the incense (Yoma 45a); 1.8.0: (45.2, 6) -> (46, 5), inside the Ra'avad's table
    // 1.4.0 (the user, the reviewer's note 3): the NUMBER of pyres - Mishnah Yoma 4:6: R. Meir four every day and five on Yom Kippur;
    // R. Yose three and four; R. Yehuda two and three. The Rambam (Temidin uMusafin 2:4) rules like R. Yose - the default. The third
    // (keeping the fire), the fourth (R. Meir: the limbs and fats not consumed, Yoma 45a) and the Yom Kippur one (the coals of the incense
    // of the Holy of Holies) are their own instanced meshes, shown by ctx2.shared.maarachot (the opinions table). Places: model choices.
    const logs3 = [], logs4 = [], logsYK = [];
    addPyre(46, -11, 2.4, 0.12, 4, logs3);         // the third pyre, keeping the fire (R. Yose); 1.8.0: x 45.2 -> 46
    addPyre(61.5, -9.5, 1.4, 0.09, 3, logs4);      // R. Meir's fourth; 1.9.3: (65, 5.5) -> the north-east quarter (the great pyre is in the south-east now)
    addPyre(65.5, -11, 1.4, 0.09, 3, logsYK);      // Yom Kippur's extra pyre, by the north-east; 1.8.0: (66, -12) -> (65.5, -11)
    const instLogs = (list) => {
      const geo = new CylinderGeometry(1, 1, 1, 8);
      const inst = new InstancedMesh(geo, M2.cedar, list.length);
      const m42 = new Matrix4(), q = new Quaternion(), e = new Euler();
      const p = new Vector3(), s = new Vector3();
      list.forEach((L, i) => {
        e.set(L.alongX ? 0 : Math.PI / 2, 0, L.alongX ? Math.PI / 2 : 0);
        q.setFromEuler(e);
        p.set(L.x, L.y, L.z);
        s.set(L.r, L.len, L.r);
        m42.compose(p, q, s);
        inst.setMatrixAt(i, m42);
      });
      inst.castShadow = inst.receiveShadow = true;
      mv.add(inst);
      return inst;
    };
    const pyreLogsK = instLogs(logs);   // NIGHT_COALS_304: kept - not seen in the night of the morning's service
    const pyre3 = instLogs(logs3), pyre4 = instLogs(logs4), pyreYK = instLogs(logsYK);
    pyre4.visible = false;
    pyreYK.visible = false;
    const flames = [];
    // ===== 1.0.28: REALISTIC FIRE. Each flame is a camera-facing quad (billboard) with a noise shader (no textures, works offline):
    // the tongue shape is bent and eaten away by scrolling fractal noise, colour runs from deep red at the edge through orange to a pale-yellow core. Additive blending.
    // Tuning: FIRE.speed (flicker speed), FIRE.heat (brightness). Sparks, glow and the straight smoke column are below.
    const FIRE = { speed: 1, heat: 0.65 };
    const flameVS = "uniform vec2 uSize; varying vec2 vUv; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(0.0,0.0,0.0,1.0); mv.xy += position.xy * uSize; gl_Position = projectionMatrix * mv; }";
    const flameFS = [
      "varying vec2 vUv; uniform float uTime; uniform float uSeed; uniform float uOp;",
      "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }",
      "float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);",
      "  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }",
      "float fbm(vec2 p){ return noise(p)*0.5 + noise(p*2.03)*0.25 + noise(p*4.1)*0.125 + noise(p*8.3)*0.0625; }",
      "void main(){",
      "  vec2 q = vec2(vUv.x - 0.5, vUv.y); float t = uTime + uSeed * 0.37;",
      "  float n1 = fbm(vec2(q.x*2.6, q.y*1.8 - t*1.35) + uSeed);",
      "  float n2 = fbm(vec2(q.x*5.5 + 3.1, q.y*3.6 - t*2.6) + uSeed*1.7);",
      "  float sway = (n1 - 0.5) * 0.9 * q.y * q.y * 2.2;",
      "  float xw = (q.x + sway) * (1.0 + q.y * 2.4);",
      "  float body = 1.0 - smoothstep(0.0, 0.42 - 0.18*q.y, abs(xw));",
      "  float h = q.y + (n2 - 0.5) * 0.55 * (0.3 + q.y);",
      "  float top = 1.0 - smoothstep(0.30, 0.98, h);",
      "  float a = body * top;",
      "  a *= 0.75 + 0.5 * n2;",
      "  a = clamp(a * smoothstep(0.0, 0.10, q.y), 0.0, 1.0);",
      "  float heat = a * (1.15 - q.y * 0.75);",
      "  vec3 col = mix(vec3(0.55,0.05,0.0), vec3(1.0,0.38,0.04), smoothstep(0.08,0.45,heat));",
      "  col = mix(col, vec3(1.0,0.72,0.18), smoothstep(0.38,0.75,heat));",
      "  col = mix(col, vec3(1.0,0.93,0.65), smoothstep(0.72,1.05,heat));",
      "  gl_FragColor = vec4(col, pow(a, 1.25) * uOp);",
      "}"
    ].join("\n");
    const flameGeo = new PlaneGeometry(1, 1);
    flameGeo.translate(0, 0.5, 0);
    const addFlame = (x, y, z, r, h, color, op, parent) => {   // 1.9.1: parent - another group than the altar's (mv)
      const mat = new ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uSeed: { value: flames.length * 7.31 }, uOp: { value: op * FIRE.heat }, uSize: { value: new Vector2(r * 2.6, h * 1.35) } },
        vertexShader: flameVS,
        fragmentShader: flameFS,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        fog: false
      });
      const m = new Mesh(flameGeo, mat);
      m.position.set(x, y, z);
      m.castShadow = false;
      m.frustumCulled = false;
      m.renderOrder = 2;
      m.userData.op = op;
      m.userData.w = r * 2.6;
      m.userData.h = h * 1.35;
      (parent || mv).add(m);
      flames.push(m);
      return m;
    };
    // LIVE_FIRE_304: the same live fire for the other modules - the torches of the rejoicing of the water-drawing and the golden lamps'
    // cups (63-simcha); the flame stands on (x, y, z) in `parent`, r its half-breadth, h its height (amot), op its strength
    ctx2.shared.liveFlame = (parent, x, y, z, r, h, op) => addFlame(x, y, z, r, h, 16758832, op == null ? 0.9 : op, parent);
    // 1.9.1 (the user: "בבית המוקד כדאי לעשות אש אמיתית"): the same live flames on the hearth of Beit HaMoked (30-courts.js gives its
    // place, ctx2.shared.mokedFire) and under the Nazirites' pot (ctx2.shared.nazirFire); in g, not in mv - they do not move with the altar
    for (const [F, list] of [[ctx2.shared.mokedFire, [[0, 0, 0.95, 2.7, 0.85], [0.7, 0.45, 0.65, 1.9, 0.8], [-0.65, -0.4, 0.7, 2.1, 0.8], [0.25, -0.7, 0.5, 1.5, 0.75], [-0.3, 0.75, 0.55, 1.6, 0.75]]],
                             [ctx2.shared.nazirFire, [[0, 0, 0.75, 1.6, 0.8], [0.55, 0.3, 0.5, 1.2, 0.75], [-0.5, -0.3, 0.5, 1.3, 0.75]]],
                             [ctx2.shared.ovenFire, [[0, 0.75, 0.3, 0.6, 0.7], [0.1, -0.8, 0.3, 0.6, 0.7], [-1.0, 0, 0.28, 0.55, 0.65], [1.05, 0.1, 0.28, 0.55, 0.65]]], [ctx2.shared.tevilaFire, [[0, 0, 0.55, 1.45, 0.95], [0.25, 0.15, 0.38, 1.05, 0.85], [-0.22, -0.14, 0.4, 1.15, 0.85]]]]) {   // LECHEM_211: low flames round the two moulds in the showbread's oven (30-courts.js)
      if (!F) continue;
      list.forEach(([dx, dz, r, h, op], i) => (F.flames || (F.flames = [])).push(addFlame(F.x + dx, F.y, F.z + dz, r, h, [16742942, 16758832, 16769162][i % 3], op, g)));   // 1.9.3: kept - the Nazirites' fire moves with its chamber (30-courts.js, eznChambers)
    }
    const GPF_FROM = flames.length;   // NIGHT_COALS_304
    {
      // 1.0.23: flames spread over the whole great pyre (top of the logs at y ~ 29)
      const fx = [60.7, 62.0, 63.3], fz = [GP.cz - 3.2, GP.cz - 1.6, GP.cz, GP.cz + 1.6, GP.cz + 3.2];
      let fi = 0;
      for (const x of fx) for (const z of fz) {
        const k = fi % 3;
        addFlame(x + (fi % 2 ? 0.2 : -0.15), TOP + 2.7, z + (k - 1) * 0.15, 0.75 - k * 0.1, 3.0 - k * 0.5, [16742942, 16758832, 16769162][k], 0.78 + k * 0.06);
        fi++;
      }
    }
    addFlame(46, TOP + 0.3, 5, 0.6, 1.6, 16758832, 0.8);
    const GPF = flames.slice(GPF_FROM);   // NIGHT_COALS_304: the great pyre's fifteen flames and the second pyre's one
    const flame3 = addFlame(46, TOP + 0.4, -11, 0.95, 2.4, 16742942, 0.8);
    toTop(false);
    {
      // 1.4.0 (the user): THE TWO BOWLS of the libations (Sukkah 48a-b; Rambam Temidin uMusafin 10): on the top by the south-west horn, on its
      // south side (Tiferet Yisrael, Tamid 7:3) - the western for the water, the eastern for the wine, of silver (R. Yehuda: of lime), "pierced
      // like two thin nostrils", the wine's wider. Two readings of the holes (ctx2.shared.sfalim): "rashi" (Rashi, Bartenura) - a spout out of
      // each bowl, the libation runs on the top to a hole that leads to the shitin; "tosafot" (Tosafot, Rosh, Ritva, Meiri) - the holes in the
      // bowls' bottoms, straight down to the shitin. Sizes and the exact spot: model choices.
      // SFALIM_303 (the user, 18.11.2026: "תעשה את שניהם" - the proposal he took): the bowls fixed in lime in both readings - Tosafot's answer
      // "דספלים היו קבועים בסיד" (Tosafot Yom Tov, Sukkah 4:9) and Tiferet Yisrael's "מחוברין בסיד במזבח"; set 0.35 east, clear of the
      // south-west horn (x 41.5..42.5, z 9.5..10.5 - the western bowl's rim stood in it); Rashi's reading: each spout long and plain, sloping
      // down toward its hole in the top, the holes wider and ringed; Tosafot's: the holes in the bowls' bottoms, and the wine's bowl with a
      // thick bottom (the Mishnah's "אחד מעבה ואחד דק"); under the corner the shitin (Rashi, Sukkah 49a: "חלל שתחת המזבח כנגד מקום הנסכים"),
      // and the ways down to them of the reading shown - seen when the corner is drawn as glass (SFSEE, below; the place "ספלי הניסוך").
      // Sizes, the hollow's measures and depth: model choices.
      const bowlPts = [[0.02, 0], [0.22, 0], [0.3, 0.1], [0.34, 0.28], [0.3, 0.36]];
      const sil = new MeshStandardMaterial({ color: 0xE8E8EC, metalness: 0.8, roughness: 0.3, side: DoubleSide });   // SFALIM_303: two-sided - from above, the bowl's inside and bottom were not drawn
      const BX = [43.05, 43.95], BZ = 9.4;   // SFALIM_303: was 42.7 and 43.6
      const sfG = new Group();   // 1.9.1: the bowls and their holes - R. Yose's first altar moves them to its own south-west horn
      mv.add(sfG);
      ctx2.shared.__sfG = sfG;
      for (const x of BX) H2.lathe(sfG, bowlPts, sil, x, TOP + 0.05, BZ, 16);
      // SFALIM_303: the lime round each bowl's foot - a ring, open in the middle (a whole cylinder's top covered the bowl's floor and the
      // hole in it): its top from the bowl's side out, then down to the top of the altar
      const lime = new MeshStandardMaterial({ color: 0xEEEADF, roughness: 0.95, metalness: 0, side: DoubleSide });
      const limeGeo = new LatheGeometry([new Vector2(0.27, 0.12), new Vector2(0.31, 0.12), new Vector2(0.41, 0)], 20);
      for (const x of BX) {
        const m = new Mesh(limeGeo, lime);
        m.position.set(x, TOP, BZ);
        m.castShadow = m.receiveShadow = true;
        sfG.add(m);
      }
      const sfR = new Group(), sfT = new Group();
      sfG.add(sfR);
      sfG.add(sfT);
      sfT.visible = false;
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.sfalimRashi = sfR;
      ctx2.layers.sfalimTosafot = sfT;
      const dark = new MeshBasicMaterial({ color: 0x120e08 });
      // the ways down of each reading (shown only with the glass corner, SFSEE): from the hole to the top of the shitin, the bottom of the
      // court's floor slab (30-courts.js: the slab is 2.65 thick)
      const DOWN = F - 2.65;
      const wayM = new MeshBasicMaterial({ color: 0x2b1f13 });
      const wayR = new Group(), wayT = new Group();
      wayR.visible = wayT.visible = false;
      sfR.add(wayR);
      sfT.add(wayT);
      const way = (grp, x, z, r, yTop) => { const m = H2.cyl(grp, r, r, yTop - DOWN, wayM, x, DOWN, z, 14); m.castShadow = m.receiveShadow = false; return m; };
      // Rashi: "חוטם אחד בספל ונקב אחד בחוטמו... ויורדין דרך החוטמין על גב המזבח, ובמזבח היה נקב שבו המים והיין יורדין לשיתין". The spout
      // leaves the bowl's south wall a little above its floor and slopes down; the hole in the top lies a little beyond its mouth, where the
      // libation falls. A hole for each (the user, 18.11.2026: "כוונת רשי היא נקב אחד לכל סוג אחד למים ואחד ליין ולכן אין מח' בינו לבין
      // התפאי" - Tiferet Yisrael on Middot 3:1: two holes from the top to the shitin); ONE_HOLE (one for both, the two spouts turned to it)
      // is kept for the other reading of Rashi's "נקב"
      const ONE_HOLE = false;
      const HZ = BZ + 0.69;   // SPOUT_SHORT_441 (the user 26.11.2026, "ב" - the spouts shorter and turned more down): the hole just beyond the shorter spout's mouth (0.86 until then)
      const rimM = new MeshStandardMaterial({ color: 0xD8D0BF, roughness: 0.85, metalness: 0 });
      const holes = ONE_HOLE ? [[(BX[0] + BX[1]) / 2, HZ, 0.1]] : BX.map((x, i) => [x, HZ, i ? 0.09 : 0.07]);   // the wine's hole the wider
      for (const [hx, hz, hr] of holes) {
        H2.cyl(sfR, hr + 0.045, hr + 0.045, 0.012, rimM, hx, TOP, hz, 20);
        H2.cyl(sfR, hr, hr, 0.016, dark, hx, TOP, hz, 20);
        way(wayR, hx, hz, hr * 0.92, TOP);
      }
      const UP = new Vector3(0, 1, 0);
      BX.forEach((x, i) => {
        const hole = ONE_HOLE ? holes[0] : holes[i];
        const h = new Vector3(hole[0] - x, 0, hole[1] - BZ);
        const dh = h.length();
        h.normalize();
        const tilt = 0.35, y0 = TOP + 0.05 + 0.13, r0 = 0.27, len = (dh - r0 - 0.06) / Math.cos(tilt);   // SPOUT_SHORT_441: 0.36 out and 0.13 down (was 0.2 rad, 0.47 out)
        const d = new Vector3(h.x * Math.cos(tilt), -Math.sin(tilt), h.z * Math.cos(tilt));
        const rB = i ? 0.075 : 0.055, rT = i ? 0.058 : 0.042;   // the wine's spout the thicker ("נקב היין עבה ושל המים דק", Bartenura)
        const sp = new Mesh(new CylinderGeometry(rT, rB, len, 14), sil);
        sp.quaternion.setFromUnitVectors(UP, d);
        sp.position.set(x + h.x * r0, y0, BZ + h.z * r0).addScaledVector(d, len / 2);
        sp.castShadow = sp.receiveShadow = true;
        sfR.add(sp);
        const mouth = new Mesh(new CylinderGeometry(rT * 0.62, rT * 0.62, 0.012, 12), dark);   // "ונקב אחד בחוטמו"
        mouth.quaternion.copy(sp.quaternion);
        mouth.position.set(x + h.x * r0, y0, BZ + h.z * r0).addScaledVector(d, len + 0.004);
        sfR.add(mouth);
      });
      // Tosafot (Sukkah 48b; 1903, lines 504-505): "דלמא הוא דמנקב הספלים יורדין לשיתין כמין שני נקבי החוטם ולא שהיה בולט כמין חוטם" -
      // the holes in the bowls' bottoms, straight down; and "אחד מעובה ואחד דק": "ולשון מעובה משמע ששולי הספל היו עבים ומתוך כך אין
      // המשקה ממהר לצאת" - one bowl's bottom thick, the holes alike. Which bowl Tosafot do not say: THICK - the water's, as the water is the
      // one that runs out fast ("שהמים ממהרים לצאת", Rashi 48b, from the Gemara's "חמרא סמיך מיא קליש"), or the wine's - asked of the
      // user, 18.11.2026
      const THICK = 0;   // the index in BX: 0 the water's (western), 1 the wine's (eastern)
      BX.forEach((x, i) => {
        let floorY = TOP + 0.05;
        if (i === THICK) {
          const thick = 0.09;
          H2.cyl(sfT, 0.288, 0.216, thick, sil, x, TOP + 0.05, BZ, 20);   // the thick bottom: fills the bowl's foot
          floorY += thick;
        }
        const hr = 0.045;
        H2.cyl(sfT, hr, hr, 0.008, dark, x, floorY, BZ, 16);
        way(wayT, x, BZ, hr, TOP + 0.05);
        // Tosafot's "ושמא כמין בליטת חוטם היה עשוי על הנקב שלא יפול עליו דבר לסותמו" (the user, 18.11.2026: "ב", "ובספל" - drawn, over
        // the bowl's hole): a small silver hood like a nose over it, open to the south - the drink runs in under it, and what falls from
        // above does not stop the hole. Its form - a model choice
        const nose = new Mesh(new SphereGeometry(0.075, 12, 6, Math.PI, Math.PI, 0, Math.PI / 2), sil);
        nose.scale.set(1, 0.85, 1.35);
        nose.position.set(x, floorY, BZ + 0.035);
        nose.castShadow = true;
        sfT.add(nose);
      });
      ctx2.shared.sfalim = { mode: "rashi", set(m) { this.mode = m === "tosafot" ? "tosafot" : "rashi"; sfR.visible = this.mode === "rashi"; sfT.visible = this.mode === "tosafot"; } };
      ctx2.labels.push({ text: "ספלי הניסוך — מים (מערבי) ויין (מזרחי)", x: 43.5, y: TOP + 1.1, z: 9.4, size: 0.8, layer: "altarBody32" },
        { text: "ספלי הניסוך — מים (מערבי) ויין (מזרחי)", x: 47.5, y: TOP + 1.1, z: 5.4, size: 0.8, layer: "altarBody28" });
      const SHITIN_SEE = "השיתין — ״חלל שתחת המזבח כנגד מקום הנסכים״ (רש״י סוכה מט.)";   // apart from the yesod's "שני הנקבים... והן הנקראין שיתין" (SHITIN_LABEL, below: the Rambam's name for the yesod's two holes)
      // drawn on top (l.onTop): it stands in the hollow, and the stone round the glass would hide most of it
      const SHI = { info: "השיתין — ״חלל שתחת המזבח כנגד מקום הנסכים״ (רש״י סוכה מט.). הפירוט בכרטיס ספלי הניסוך.", refs: [["רש״י סוכה מט.", { book: 2163, index: 2307 }]] };   // (the label's own source - it had none)
      ctx2.labels.push(Object.assign({ text: SHITIN_SEE, x: 43.8, y: F - 5.6, z: 9.6, size: 0.62, layers: ["sfalimSee", "altarBody32"], moveWithAltar: true, onTop: true }, SHI),
        Object.assign({ text: SHITIN_SEE, x: 47.8, y: F - 5.6, z: 5.6, size: 0.62, layers: ["sfalimSee", "altarBody28"], moveWithAltar: true, onTop: true }, SHI));
      // SFALIM_303: SFSEE - THE CORNER AS GLASS (ctx2.shared.features.sfalimSee; the place "ספלי הניסוך", 70-ui.js - on while it shows).
      // A box round the south-west corner, from under the shitin to over the horn (C, in sfG's frame: R. Yose's altar and the Tannaim's
      // places move it with the bowls). Every plain box of the altar and of the court's floor that meets it is drawn with a clone of its
      // material that leaves the box out (LULHOLE's way, 50-heichal.js). Inside the box, built anew each time from those boxes: the glass -
      // only the outer surface of their union (a face, or the part of it, that lies against another box is not drawn: nine faces lay one
      // over another under the bowls, and the glass came out all but opaque) - with its edges; and on the box's own faces, where they lie in
      // stone, the cut, facing into the box: from outside the near ones are not seen, the far ones are the cut stone - and under the
      // floor's slab the hollow's dark walls. The ways down of the reading shown go from the holes to the hollow.
      const SFSEE = (() => {
        const C = { x0: 40.7, x1: 45.3, y0: F - 7, y1: TOP + 1.3, z0: 8.3, z1: 12.3 };
        const outP = [];
        for (let k = 0; k < 6; k++) outP.push(new Plane(new Vector3(1, 0, 0), 1e7));
        const seeW = new Group();
        seeW.name = "sfalimSee";
        seeW.visible = false;
        ctx2.root.add(seeW);
        const flag = new Group();   // the layer of the shitin's label
        flag.visible = false;
        ctx2.layers.sfalimSee = flag;
        const ghostM = new MeshBasicMaterial({ color: 0xF1E9D6, transparent: true, opacity: 0.15, depthWrite: false, side: DoubleSide });
        const edgeM = new LineBasicMaterial({ color: 0x5e4a2e, transparent: true, opacity: 0.8, depthWrite: false });
        const pitM = new MeshBasicMaterial({ vertexColors: true });
        const clones = new Map();
        const Cw = new Box3(), tmp = new Vector3();
        const noRay = () => {};
        let on = false, paused = false, live = [];
        const setPlanes = () => {
          ctx2.root.updateMatrixWorld(true);
          Cw.min.copy(sfG.localToWorld(tmp.set(C.x0, C.y0, C.z0)));
          Cw.max.copy(sfG.localToWorld(tmp.set(C.x1, C.y1, C.z1)));
          const n = [[-1, 0, 0, Cw.min.x], [1, 0, 0, -Cw.max.x], [0, -1, 0, Cw.min.y], [0, 1, 0, -Cw.max.y], [0, 0, -1, Cw.min.z], [0, 0, 1, -Cw.max.z]];
          n.forEach(([a, b, c, d], k) => {
            outP[k].normal.set(a, b, c);
            outP[k].constant = d;
          });
        };
        // the boxes that meet C: plain boxes of the altar and of the courts, opaque, shown, not the bowls' own
        const cands = () => {
          const out = [];
          for (const top of ctx2.root.children) {
            if (top.name !== "altar" && top.name !== "courts") continue;
            top.traverse((o) => {
              if (!o.isMesh || o.isInstancedMesh || !o.geometry || o.geometry.type !== "BoxGeometry" || Array.isArray(o.material)) return;
              for (let p = o; p; p = p.parent) if (p === sfG || !p.visible) return;
              const m = o.material;
              if (!m || m.transparent || !(m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial)) return;
              if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
              const b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld), e = 1e-3;
              if (b.max.x <= Cw.min.x + e || b.min.x >= Cw.max.x - e || b.max.y <= Cw.min.y + e || b.min.y >= Cw.max.y - e || b.max.z <= Cw.min.z + e || b.min.z >= Cw.max.z - e) return;
              out.push([o, b]);
            });
          }
          return out;
        };
        const cutOf = (m) => {
          const orig = m.userData && m.userData.__sfseeOrig ? m.userData.__sfseeOrig : m;
          let c = clones.get(orig);
          if (!c) {
            c = orig.clone();
            c.clippingPlanes = outP;
            c.clipIntersection = true;
            c.userData = Object.assign({}, orig.userData, { __sfseeOrig: orig });
            clones.set(orig, c);
          }
          return c;
        };
        // quads on axis-aligned planes: axis a ("x" | "y" | "z") at v, over [u0, u1] x [w0, w1] of the other two (x: z, y; y: x, z; z: x, y),
        // facing sign sg along a; texture coordinates in amot (as uvWorldBox)
        const OTHER = { x: ["z", "y"], y: ["x", "z"], z: ["x", "y"] };
        const quads = () => ({ pos: [], nrm: [], uv: [], col: [] });
        const PT = (a, v, u, w) => (a === "x" ? [v, w, u] : a === "y" ? [u, v, w] : [u, w, v]);
        const quad = (q, a, v, u0, u1, w0, w1, sg, colY) => {
          const c = [PT(a, v, u0, w0), PT(a, v, u1, w0), PT(a, v, u1, w1), PT(a, v, u0, w1)], t = [[u0, w0], [u1, w0], [u1, w1], [u0, w1]];
          const nat = a === "z" ? 1 : -1, n = a === "x" ? [sg, 0, 0] : a === "y" ? [0, sg, 0] : [0, 0, sg];
          for (const k of sg === nat ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]) {
            q.pos.push(...c[k]);
            q.nrm.push(...n);
            q.uv.push(...t[k]);
            if (colY) q.col.push(...colY(c[k][1]));
          }
        };
        const mesh = (q, mat) => {
          const g = new BufferGeometry();
          g.setAttribute("position", new Float32BufferAttribute(q.pos, 3));
          g.setAttribute("normal", new Float32BufferAttribute(q.nrm, 3));
          g.setAttribute("uv", new Float32BufferAttribute(q.uv, 2));
          if (q.col.length) g.setAttribute("color", new Float32BufferAttribute(q.col, 3));
          const m = new Mesh(g, mat);
          m.castShadow = m.receiveShadow = false;
          m.raycast = noRay;
          m.userData.noPick = true;
          m.userData.__sfseeOwn = true;
          seeW.add(m);
          return m;
        };
        // the cuts of [lo, hi] along axis ax by the boxes' sides, sorted
        const cuts = (boxes, ax, lo, hi, skip) => {
          const t = [lo, hi];
          boxes.forEach((o, i) => {
            if (i === skip) return;
            for (const x of [o.min[ax], o.max[ax]]) if (x > lo + 1e-4 && x < hi - 1e-4) t.push(x);
          });
          return Array.from(new Set(t.map((x) => Math.round(x * 1e4) / 1e4))).sort((x, y) => x - y);
        };
        const inBox = (o, p) => p.x > o.min.x + 1e-4 && p.x < o.max.x - 1e-4 && p.y > o.min.y + 1e-4 && p.y < o.max.y - 1e-4 && p.z > o.min.z + 1e-4 && p.z < o.max.z - 1e-4;
        const pitCol = (y) => {   // the hollow's walls: dark brown under the slab, black at the bottom
          const t = Math.max(0, Math.min(1, (y - Cw.min.y) / Math.max(0.01, DOWN - Cw.min.y))), k = t * t;
          return [0.015 + 0.2 * k, 0.011 + 0.15 * k, 0.008 + 0.1 * k];
        };
        const build = (list) => {
          const boxes = list.map((x) => x[1]), mats = list.map((x) => x[2]), pit = boxes.map((b) => b.max.y <= DOWN + 0.05);   // the courts' fill: the hollow
          const P = new Vector3(), G = quads(), E = [];
          // the glass: each face of each box, inside C, cell by cell between the other boxes' sides; a cell is drawn when the point just
          // outside it lies in no other box; its edges where the next cell of the face is not drawn (or the face ends)
          boxes.forEach((b, i) => {
            if (pit[i]) return;
            for (const a of ["x", "y", "z"]) for (const s of [-1, 1]) {
              const v = s > 0 ? b.max[a] : b.min[a];
              if (v <= Cw.min[a] + 1e-4 || v >= Cw.max[a] - 1e-4) continue;
              const [ua, wa] = OTHER[a];
              const u0 = Math.max(b.min[ua], Cw.min[ua]), u1 = Math.min(b.max[ua], Cw.max[ua]), w0 = Math.max(b.min[wa], Cw.min[wa]), w1 = Math.min(b.max[wa], Cw.max[wa]);
              if (u1 - u0 < 1e-3 || w1 - w0 < 1e-3) continue;
              const us = cuts(boxes, ua, u0, u1, i), ws = cuts(boxes, wa, w0, w1, i);
              const ex = us.slice(1).map((_, j) => ws.slice(1).map((__, k) => {
                P[a] = v + s * 0.003;
                P[ua] = (us[j] + us[j + 1]) / 2;
                P[wa] = (ws[k] + ws[k + 1]) / 2;
                return !boxes.some((o, m) => m !== i && inBox(o, P));
              }));
              const X = (j, k) => j >= 0 && k >= 0 && j < ex.length && k < ex[0].length && ex[j][k];
              for (let j = 0; j < ex.length; j++) for (let k = 0; k < ex[0].length; k++) {
                if (!ex[j][k]) continue;
                quad(G, a, v, us[j], us[j + 1], ws[k], ws[k + 1], s);
                if (!X(j - 1, k)) E.push(PT(a, v, us[j], ws[k]), PT(a, v, us[j], ws[k + 1]));
                if (!X(j + 1, k)) E.push(PT(a, v, us[j + 1], ws[k]), PT(a, v, us[j + 1], ws[k + 1]));
                if (!X(j, k - 1)) E.push(PT(a, v, us[j], ws[k]), PT(a, v, us[j + 1], ws[k]));
                if (!X(j, k + 1)) E.push(PT(a, v, us[j], ws[k + 1]), PT(a, v, us[j + 1], ws[k + 1]));
              }
            }
          });
          if (G.pos.length) mesh(G, ghostM).renderOrder = 3;
          if (E.length) {
            const eg = new BufferGeometry();
            eg.setAttribute("position", new Float32BufferAttribute(E.flat(), 3));
            const el = new LineSegments(eg, edgeM);
            el.raycast = noRay;
            el.userData.noPick = true;
            el.userData.__sfseeOwn = true;
            el.renderOrder = 4;
            seeW.add(el);
          }
          // the cut: on each face of C, the boxes that cross it, cell by cell; a cell takes the smallest box that holds it (the sovev's
          // slab over the body), so that no two plates lie one on another
          const byMat = new Map(), PQ = quads();
          for (const [a, v, s] of [["x", Cw.min.x, 1], ["x", Cw.max.x, -1], ["z", Cw.min.z, 1], ["z", Cw.max.z, -1], ["y", Cw.min.y, 1], ["y", Cw.max.y, -1]]) {
            const cross = [];
            boxes.forEach((o, i) => { if (o.min[a] < v - 1e-4 && o.max[a] > v + 1e-4) cross.push(i); });
            if (!cross.length) continue;
            const [ua, wa] = OTHER[a];
            const sub = cross.map((i) => boxes[i]);
            const us = cuts(sub, ua, Cw.min[ua], Cw.max[ua], -1), ws = cuts(sub, wa, Cw.min[wa], Cw.max[wa], -1);
            for (let j = 0; j + 1 < us.length; j++) for (let k = 0; k + 1 < ws.length; k++) {
              P[a] = v;
              P[ua] = (us[j] + us[j + 1]) / 2;
              P[wa] = (ws[k] + ws[k + 1]) / 2;
              let best = -1, bv = Infinity;
              for (const i of cross) {
                const o = boxes[i];
                if (!(P[ua] > o.min[ua] && P[ua] < o.max[ua] && P[wa] > o.min[wa] && P[wa] < o.max[wa])) continue;
                const vol = (o.max.x - o.min.x) * (o.max.y - o.min.y) * (o.max.z - o.min.z);
                if (vol < bv) { bv = vol; best = i; }
              }
              if (best < 0) continue;
              if (pit[best]) quad(PQ, a, v, us[j], us[j + 1], ws[k], ws[k + 1], s, pitCol);
              else {
                if (!byMat.has(mats[best])) byMat.set(mats[best], quads());
                quad(byMat.get(mats[best]), a, v, us[j], us[j + 1], ws[k], ws[k + 1], s);
              }
            }
          }
          for (const [m, q] of byMat) mesh(q, m);
          if (PQ.pos.length) mesh(PQ, pitM);
        };
        const show = () => {
          setPlanes();
          for (const c of clones.values()) { c.clippingPlanes = outP; c.clipIntersection = true; }   // after a section (it gives null back)
          ghostM.side = DoubleSide;
          if (ctx2.renderer && !ctx2.renderer.localClippingEnabled) ctx2.renderer.localClippingEnabled = true;
          const list = [];
          for (const [o, b] of cands()) {
            const m = o.material;
            live.push([o, m]);
            o.material = cutOf(m);
            list.push([o, b, o.material.userData.__sfseeOrig]);
          }
          build(list);
          seeW.visible = flag.visible = wayR.visible = wayT.visible = true;
        };
        const hide = () => {
          for (const [o, m] of live) if (o.material && o.material.userData && o.material.userData.__sfseeOrig) o.material = m;
          live = [];
          for (const c of seeW.children.slice()) {
            seeW.remove(c);
            if (c.userData.__sfseeOwn && c.geometry) c.geometry.dispose();
          }
          seeW.visible = flag.visible = wayR.visible = wayT.visible = false;
        };
        // a section (90-entry.js) gives every material its own plane and takes it back as null: while it is on the corner is whole
        ctx2.animated.push(() => {
          if (!on) return;
          const S = ctx2.shared.section;
          if (S && S.on) { if (!paused) { paused = true; hide(); } return; }
          if (paused) { paused = false; show(); }
        });
        // the programs, compiled with the rest at load (the renderer's compile walks the hidden objects too): the glass, the edges, the
        // hollow's walls and the cut clone of each material the corner meets now (the 32 body; R. Yose's is of the same materials)
        if (ctx2.renderer) ctx2.renderer.localClippingEnabled = true;
        {
          const warm = new Group();
          warm.name = "sfalimSeeWarm";
          warm.visible = false;
          ctx2.root.add(warm);
          setPlanes();
          const tg = new BoxGeometry(0.01, 0.01, 0.01);
          for (const [o] of cands()) warm.add(new Mesh(tg, cutOf(o.material)));
          warm.add(new Mesh(tg, ghostM));
          warm.add(new LineSegments(new EdgesGeometry(tg), edgeM));
          const pg = new BoxGeometry(0.01, 0.01, 0.01);
          pg.setAttribute("color", new Float32BufferAttribute(new Float32Array(pg.attributes.position.count * 3), 3));
          warm.add(new Mesh(pg, pitM));
        }
        ctx2.shared.features = ctx2.shared.features || {};
        ctx2.shared.features.sfalimSee = { key: "sfalimSee", timed: false, isOn: () => on,
          on: () => { if (on) return; on = true; paused = false; show(); },
          off: () => { if (!on) return; on = false; paused = false; hide(); } };
        // ctx.shared.sfalimSee: refresh() after the bowls moved; set(v) / on - the presentation's way to a place's feature (75-tour.js featureOf)
        const FS = ctx2.shared.features.sfalimSee;
        return { refresh: () => { if (on && !paused) { hide(); show(); } }, set: (v) => (v ? FS.on() : FS.off()), get on() { return on; } };
      })();
      ctx2.shared.sfalimSee = SFSEE;
    }
    {
      // 1.5.0 (the user: "להציג את כל המידות מה-32 ועד 28 וכן לשאר השיטות"): THE ALTAR'S MEASURES as thin frames, each at its own
      // height (Middot 3:1): 32 x 32 the base; "עלה אמה וכנס אמה - זה היסוד" 30 x 30 at +1; "עלה חמש וכנס אמה - זה הסובב" 28 x 28 at +6;
      // on the top "מקום הקרנות אמה מזה ואמה מזה" 26 x 26 and "מקום הילוך רגלי הכהנים" 24 x 24 = the place of the pyres; and in orange, at
      // the floor, the former altar of the First Temple - 28 x 28 aligned to the north-east, the exiles added 4 in the south and 4 in the
      // west "like a gamma" (R. Yose, Middot 3:1; Zevachim 61b). Shown 15 s by the place "מידות המזבח" (feature altar28).
      // 1.8.1 (the user: "מידות המזבח: א: אין את השיטות השניות; ב: ליד כל קו צריך להיות מספר האמות, בתוך המודל"): every frame carries its
      // number, and the readings of the measures are drawn (ctx2.shared.altarMeasures, the opinions table): the Mishnah's (above); Rashi's
      // and the Rambam's, by Kelim 17:10 ("חוץ מהקרן והסובב והיסוד" - their amah is of five handbreadths; the Tosafot Yom Tov on Middot 3:1):
      // Rashi - only the sovev's recess is of five, so 32, 30, 28 + 2t, 26 + 2t, 24 + 2t; the Rambam (Beit HaBechirah 2:7) - the yesod's and
      // the sovev's recesses of five, "נמצא רחב שלשים אמה ושני טפחים... שמונה ועשרים אמה וארבעה טפחים... עשרים וארבע אמות וארבעה טפחים";
      // the Ra'avad there - "הארבעה טפחים הם כניסת הקרנות מדפני המזבח": the horns stand two handbreadths in from the edge, so 26 and 24
      // exactly; and R. Yose's first altar, "שמנה ועשרים על שמנה ועשרים, כונס ועולה במדה זו, עד שנמצא מקום המערכה עשרים על עשרים", in the
      // north-east of the 32 (the exiles added in the south and the west). The frames stand at the model's surfaces (the Rambam's heights -
      // 58 handbreadths in all, 2:6 - are told on the card). The place "מידות המזבח" shows the chosen reading for 15 s; the table keeps it.
      const outline = new Group();
      outline.visible = false;
      mv.add(outline);
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.altar28 = outline;
      const T6 = 1 / 6;   // a handbreadth
      // MEASURES_211 (the user, 15.11.2026, of the top's picture with twenty plates one over another: "אתה נורמלי?"; "התצוגה צריכה להיות
      // מן הצד מתוך העזרה כדי להבין את הפערים - אגב הסמנים הצבעוניים בבית ראשון יותר ברורים מבית שני"): every step's frame in its OWN
      // strong colour (the First Temple plugin's five), a little thicker, just outside the step's edge; ONE plate to a step (there
      // were four, one on every side - twenty in all), its rim in the frame's colour and the step's name on it in small letters. The
      // five plates stand where the eye can read them (measLayout below, while the frames show): from the side - a ladder, one over
      // another in the steps' own order, beside the altar's corner seen on the right; from above - two lines along the side at the
      // foot of the picture.
      const COL = [0x1e40af, 0x047857, 0xbe185d, 0x6d28d9, 0xc2410c];
      const RIM = ["#6f9bff", "#22c08a", "#f562a6", "#b08cff", "#ff9648"];
      const STEP = ["הבסיס", "מעל היסוד", "מעל הסובב", "בין הקרנות", "מקום המערכה"];
      const YS = [F + 0.05, F + 1.05, F + 6.05, TOP + 0.08, TOP + 0.08];
      const amot = (w) => { const a = Math.floor(w + 1e-6), t = Math.round((w - a) * 6); return a + " אמה" + (t ? " ו־" + t + " טפחים" : ""); };
      const READ = {
        mishnah: [32, 30, 28, 26, 24],
        rashi: [32, 30, 28 + 2 * T6, 26 + 2 * T6, 24 + 2 * T6],
        rambam: [32, 30 + 2 * T6, 28 + 4 * T6, 26 + 4 * T6, 24 + 4 * T6],
        raavad: [32, 30 + 2 * T6, 28 + 4 * T6, 26, 24],
        yose: [28, 26, 24, 22, 20]
      };
      const groups = {}, MEAS = {};
      for (const key of Object.keys(READ)) {
        const grp = new Group();
        grp.visible = key === "mishnah";
        outline.add(grp);
        groups[key] = grp;
        MEAS[key] = [];
        ctx2.layers["altarM_" + key] = grp;
        // R. Yose's altar sits in the north-east of the 32 (its east and north faces are the present altar's)
        const cx = key === "yose" ? ACX + 2 : ACX, cz = key === "yose" ? ACZ - 2 : ACZ;
        READ[key].forEach((w, i) => {
          const half = w / 2, y = YS[i] + (key === "yose" ? 0.02 : 0), th = i < 3 ? 0.4 : 0.35, o = half + th / 2;
          const lm = new MeshBasicMaterial({ color: COL[i] });
          const bar = (bw, bd, x, z) => { const b = new Mesh(new BoxGeometry(bw, 0.06, bd), lm); b.position.set(x, y, z); b.userData.noPick = true; grp.add(b); };
          bar(w + 2 * th, th, cx, cz - o); bar(w + 2 * th, th, cx, cz + o);
          bar(th, w, cx - o, cz); bar(th, w, cx + o, cz);
          const rec = { text: amot(w) + " (" + STEP[i] + ")", x: cx + half + 4, y: y + 1.5 + i * 1.6, z: cz - half - 4, size: 2.6, box: true, rim: RIM[i], onTop: true,
            layers: ["altarM_" + key, "altar28"], moveWithAltar: true };
          ctx2.labels.push(rec);
          MEAS[key].push(rec);
        });
      }
      // measLayout - MEAS_SCREEN_211 (the user, 15.11.2026, of the plates seen from above: "שים לב לבריחה של הכרטיסיות" - they stood at the
      // picture's foot, under the bar; and of the ladder beside the altar: "זה עדיף, רק יותר צמוד למזבח"): the plates of the reading that
      // shows stand in a ladder - the lowest step's at the bottom - set every frame IN THE PICTURE'S OWN MEASURES: close beside the altar's
      // outline on the right (on the left when the right has no room), its foot at the outline's foot, and always inside the part of the
      // picture that nothing covers - the places' panel, the card, the bar at the top and the row of buttons at the bottom (freeRect).
      // When the altar fills the picture the ladder stands at the free part's edge, over the altar's side.
      {
        const v0 = new Vector3(), v1 = new Vector3(), mR = new Vector3(), mU = new Vector3();
        let lg = null;
        const sprOf = (l) => {
          if (l.__spr && l.__spr.parent) return l.__spr;
          if (!lg) { try { lg = ctx2.root.getObjectByName("labels") || (ctx2.scene ? ctx2.scene.getObjectByName("labels") : null); } catch (_) { lg = null; } }
          if (!lg) return null;
          for (const s of lg.children) if (s.userData && s.userData.label === l) { l.__spr = s; return s; }
          return null;
        };
        let fr = { x0: -0.97, x1: 0.97, y0: -0.97, y1: 0.97 }, frAt = -1e9, frameN = 0;
        const freeRect = () => {   // the free part of the picture, in the camera's own -1..1 (read now and then)
          frameN++;
          if (frameN - frAt < 20) return fr;
          frAt = frameN;
          let x0 = -1, x1 = 1, y0 = -1, y1 = 1;
          try {
            const el = ctx2.renderer ? ctx2.renderer.domElement : document.querySelector("canvas"), r = el.getBoundingClientRect();
            const nx = (px) => ((px - r.left) / Math.max(1, r.width)) * 2 - 1, ny = (py) => 1 - ((py - r.top) / Math.max(1, r.height)) * 2;
            const seen = (e) => {
              if (!e) return null;
              const cs = getComputedStyle(e);
              if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return null;
              const q = e.getBoundingClientRect();
              if (q.width < 20 || q.height < 12 || q.right <= r.left || q.left >= r.right || q.bottom <= r.top || q.top >= r.bottom) return null;
              return q;
            };
            for (const id of ["tm-xcard", "tm-panel"]) {   // the sides
              const q = seen(document.getElementById(id));
              if (!q || q.width > r.width * 0.7) continue;   // (a phone's sheet spans the width: not a side)
              if ((q.left + q.right) / 2 < r.left + r.width / 2) x0 = Math.max(x0, nx(q.right)); else x1 = Math.min(x1, nx(q.left));
            }
            const top = seen(document.querySelector("header.topbar"));
            if (top) y1 = Math.min(y1, ny(top.bottom));
            for (const id of ["tm-nav", "tm-compass", "tm-measure-out"]) {   // the foot
              const q = seen(document.getElementById(id));
              if (q && q.top > r.top + r.height * 0.5) y0 = Math.max(y0, ny(q.top));
            }
          } catch (_) {}
          x0 += 0.02; x1 -= 0.02; y0 += 0.03; y1 -= 0.03;
          if (x1 - x0 < 0.3) { x0 = -0.97; x1 = 0.97; }
          if (y1 - y0 < 0.3) { y0 = -0.97; y1 = 0.97; }
          fr = { x0, x1, y0, y1 };
          return fr;
        };
        ctx2.animated.push(() => {
          if (!(outline.visible)) return;
          const cam = ctx2.camera;
          if (!cam) return;
          let L = null, key = null, cx = 0, cz = 0;
          { const AM = ctx2.shared.altarMeasures; key = AM && AM.mode in MEAS ? AM.mode : "mishnah"; if (groups[key].visible) L = MEAS[key]; }
          if (!L || !L.length) return;
          const S = L.map(sprOf);
          if (S.some((s) => !s)) return;
          cx = (key === "yose" ? ACX + 2 : ACX) + mv.position.x; cz = (key === "yose" ? ACZ - 2 : ACZ) + mv.position.z;
          const W0 = READ[key][0], yF = F, yT = TOP;
          // the altar's outline in the picture, and its depth
          let sx0 = 1e9, sx1 = -1e9, sy0 = 1e9, sy1 = -1e9;
          for (const dx of [-1, 1]) for (const dz of [-1, 1]) for (const yy of [yF, yT + 1]) {
            v0.set(cx + dx * W0 / 2, yy, cz + dz * W0 / 2).project(cam);
            if (!(v0.z > -1 && v0.z < 1)) continue;
            if (v0.x < sx0) sx0 = v0.x;
            if (v0.x > sx1) sx1 = v0.x;
            if (v0.y < sy0) sy0 = v0.y;
            if (v0.y > sy1) sy1 = v0.y;
          }
          if (sx0 > sx1) return;
          v0.set(cx, yF + 5, cz).project(cam);
          const zc = v0.z, c0x = v0.x, c0y = v0.y;
          if (!(zc > -1 && zc < 1)) return;
          // a plate's size in the picture, at the altar's depth
          let h = 0, wid = 0;
          for (const s of S) { if (s.scale.y > h) h = s.scale.y; if (s.scale.x > wid) wid = s.scale.x; }
          mR.setFromMatrixColumn(cam.matrixWorld, 0);
          mU.setFromMatrixColumn(cam.matrixWorld, 1);
          v1.set(cx, yF + 5, cz).addScaledVector(mR, wid).project(cam);
          const wN = Math.abs(v1.x - c0x);
          v1.set(cx, yF + 5, cz).addScaledVector(mU, h).project(cam);
          const hN = Math.abs(v1.y - c0y);
          v1.set(cx, yF + 5, cz).addScaledVector(mR, 0.3).project(cam);
          const gN = Math.abs(v1.x - c0x);
          if (!(wN > 0 && hN > 0) || !isFinite(wN + hN)) return;
          const R = freeRect(), n = L.length;
          let stepN = 1.1 * hN;
          const room = R.y1 - R.y0 - hN;
          if (n > 1 && stepN * (n - 1) > room) stepN = Math.max(0.55 * hN, room / (n - 1));
          // the side: close on the right of the outline; on the left when the right has no room; else at the edge of the free part that
          // it passes least
          const xr = sx1 + gN + wN / 2, xl = sx0 - gN - wN / 2;
          let xN;
          if (xr + wN / 2 <= R.x1) xN = Math.max(xr, R.x0 + wN / 2);
          else if (xl - wN / 2 >= R.x0) xN = Math.min(xl, R.x1 - wN / 2);
          else xN = xr + wN / 2 - R.x1 <= R.x0 - (xl - wN / 2) ? R.x1 - wN / 2 : R.x0 + wN / 2;
          // the height: the lowest plate at the outline's foot, the whole ladder inside the free part
          let yb = Math.max(sy0 + hN / 2, R.y0 + hN / 2);
          if (yb + stepN * (n - 1) + hN / 2 > R.y1) yb = R.y1 - hN / 2 - stepN * (n - 1);
          if (yb < R.y0 + hN / 2) yb = R.y0 + hN / 2;
          for (let i = 0; i < n; i++) {
            v1.set(xN, yb + i * stepN, zc).unproject(cam);
            S[i].position.copy(v1);
            L[i].x = v1.x; L[i].y = v1.y; L[i].z = v1.z;
          }
        });
      }
      // 1.9.1: "yose" is drawn as an altar, not only as frames: the body of 28 (buildBody), its ramps 2 east and 4 north (rampG), its path to
      // the yesod (path28), the bowls at its own south-west horn (4 east, 4 north), and the pyres - everything on the top (topG) and the
      // Ra'avad's table - scaled by 5/6 about the north-east corner of the place of the pyres (67.5, -15.5), so the 24 x 24 becomes the
      // 20 x 20 ("עד שנמצא מקום המערכה עשרים על עשרים"; the user: "לר׳ יוסי המערכות היו בתוך הסימון")
      const yoseFit = (o, on) => {
        if (!o) return;
        const k = on ? 5 / 6 : 1;
        o.scale.x = k; o.scale.z = k;
        o.position.x = on ? 67.5 * (1 - k) : 0;
        o.position.z = on ? -15.5 * (1 - k) : 0;
        o.updateMatrixWorld(true);
      };
      ctx2.shared.altarMeasures = { mode: "mishnah", set(k) {
        this.mode = k in READ ? k : "mishnah";
        for (const key of Object.keys(groups)) groups[key].visible = key === this.mode;
        outline.visible = true;
        const y = this.mode === "yose";
        body32.visible = path32.visible = !y;
        body28.visible = path28.visible = y;
        rampG.position.set(y ? 2 : 0, 0, y ? -4 : 0);
        if (ctx2.shared.__smallRampsY) ctx2.shared.__smallRampsY(y);   // SMALL_RAMPS3_211
        if (ctx2.shared.__sfG) ctx2.shared.__sfG.position.set(y ? 4 : 0, 0, y ? -4 : 0);
        if (ctx2.shared.sfalimSee) ctx2.shared.sfalimSee.refresh();   // SFALIM_303: the glass corner with the bowls
        yoseFit(topG, y);
        yoseFit(ctx2.layers.tapuachRaavad, y);
        // HORNS_A2 (the user's decision 49): the horn's height by the reading - five handbreadths in the Rambam's (2:8, and Kelim 17:10
        // "אמות הקרן... בנות חמשה טפחים"); an amah of six in the others (the Mishnah's plain amah)
        const hh = this.mode === "rambam" ? 5 / 6 : 1;
        for (const h of buildBody.horns || []) h.scale.y = (hh + 0.1) / 1.1;
      } };
      ctx2.shared.features = ctx2.shared.features || {};
      // MEASURES_211: timed false - the frames stay as long as the place or the reading shows (they used to go after 15 seconds, in the
      // middle of the reading); another place or reading puts them back (70-ui.js placeLeave)
      ctx2.shared.features.altar28 = { key: "altar28", timed: false, isOn: () => outline.visible, on: () => { outline.visible = true; }, off: () => { outline.visible = false; } };
      ctx2.labels.push(
        { text: "המזבח של רבי יוסי — 28 על 28, ומקום המערכה 20 על 20; בני הגולה הוסיפו 4 בדרום ו־4 במערב", x: ACX - 8, y: F + 1.2, z: ACZ + 15, size: 1, layers: ["altarM_yose", "altar28"], moveWithAltar: true }
      );
    }
    // 1.9.2 (the user: "ברירת מחדל למערכה ר' מאיר ביום רגיל"): R. Meir's four by default (was R. Yose's three), set at once below
    // 1.9.3 (the user, of the kuntres' "וקיימא לן כרבי יוסי שהיו שלוש מערכות": "צודק תשנה"): R. YOSE'S THREE the default again - the
    // Rambam, Temidin uMusafin 2:4 "שלש מערכות של אש עושין בראש המזבח בכל יום" (344, line 19)
    ctx2.shared.maarachot = {
      count: 3, yk: false,
      set(count, yk) {
        this.count = Math.max(2, Math.min(4, +count || 3));
        this.yk = !!yk;
        pyre3.visible = this.count >= 3;
        if (flame3) flame3.visible = this.count >= 3;
        pyre4.visible = this.count >= 4;
        pyreYK.visible = this.yk;
        const RS = ctx2.shared.__pyresR;   // 1.9.5: the same pyres of the Ra'avad's reading
        if (RS) { RS.p3.visible = RS.f3.visible = this.count >= 3; RS.p4.visible = this.count >= 4; RS.pYK.visible = this.yk; }
      },
      get() { return { count: this.count, yk: this.yk }; }
    };
    ctx2.shared.maarachot.set(3, false);
    toTop(true);   // 1.8.0: window 2 - the lights, the smoke, the sparks, the glow, the coals and the round heap ride on topG
    const fireLight = new PointLight(16751165, 34, 90, 1.8);
    fireLight.position.set(62, 30.8, GP.cz);
    mv.add(fireLight);
    const emberLight = new PointLight(16747056, 6, 22, 1.8);
    emberLight.position.set(46, TOP + 1.8, -11);
    mv.add(emberLight);
    const smokeTexture = (() => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 128;
      const c = cv.getContext("2d");
      const grad = c.createRadialGradient(64, 64, 6, 64, 64, 62);
      grad.addColorStop(0, "rgba(140,140,140,0.5)");
      grad.addColorStop(0.55, "rgba(140,140,140,0.22)");
      grad.addColorStop(1, "rgba(140,140,140,0)");
      c.fillStyle = grad;
      c.fillRect(0, 0, 128, 128);
      return new CanvasTexture(cv);
    })();
    const smoke = [];
    for (let i = 0; i < 40; i++) {
      const sp = new Sprite(new SpriteMaterial({
        map: smokeTexture,
        color: 9079434,
        transparent: true,
        opacity: 0.15,
        depthWrite: false
      }));
      sp.renderOrder = 3;
      mv.add(sp);
      smoke.push(sp);
    }
    // SMOKE_COLUMN_A2 (fix-a2, 22.11.2026; the user: "לא פגש עשן עד היום" - the column of smoke of the great pyre; the incense's smoke
    // is seen): the faint sprites below - a fifth opaque, grey on the pale sky, spread over the whole height - were not seen. Now THE
    // COLUMN: a strip that turns to the eye about its own upright axis, its smoke drawn by a noise that rises, thick at the pyre and
    // thinning upward, three amot wide and widening a little; the sprites rise thick over the pyre into it. Its shade follows the
    // light of the sky (the fog's colour - dark at night), and at its foot the fire lights it. Straight: Yoma 21a (107:456) "ועשן
    // המערכה, אפילו כל הרוחות שבעולם באות ומנשבות בו — אין מזיזות אותו ממקומו"; Avot 5:5 (78:84) "ולא נצחה הרוח את עמוד העשן"; and
    // the smoke rises from the fire that men bring, Yoma 21b (107:465-466) "כי קא אמרינן — בדהדיוט". (״מתמר ועולה כמקל״ is said of the
    // incense's smoke - Yoma 38a, 53a.) Its height, width and shade - model choices.
    const SMK = { H: 220, W0: 3.2, W1: 11, OP: 0.9, DAYLUM: 0.84 };
    const smokeColumn = (() => {
      const geo = new PlaneGeometry(1, 1, 1, 40);
      geo.translate(0.5, 0.5, 0);   // uv = position: x 0..1 across, y 0..1 up
      const vs = [
        "uniform float uH; uniform float uW0; uniform float uW1; varying vec2 vUv;",
        "void main(){",
        "  vUv = uv;",
        "  vec4 base = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);",
        "  vec3 toCam = cameraPosition - base.xyz; toCam.y = 0.0;",
        "  float L = length(toCam);",
        "  vec3 right = L > 1e-4 ? vec3(toCam.z, 0.0, -toCam.x) / L : vec3(1.0, 0.0, 0.0);",
        "  float w = mix(uW0, uW1, pow(uv.y, 1.4));",
        "  vec3 wp = base.xyz + right * (uv.x - 0.5) * w + vec3(0.0, uv.y * uH, 0.0);",
        "  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);",
        "}"
      ].join("\n");
      const fs = [
        "varying vec2 vUv; uniform float uTime; uniform float uOp; uniform float uDay; uniform float uFire;",
        "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }",
        "float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);",
        "  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }",
        "float fbm(vec2 p){ return noise(p)*0.5 + noise(p*2.03)*0.25 + noise(p*4.1)*0.125 + noise(p*8.3)*0.0625; }",
        "void main(){",
        "  float x = vUv.x - 0.5, y = vUv.y;",
        "  float n = fbm(vec2(x * 3.0 + 7.0, y * 24.0 - uTime * 0.5));",
        "  float n2 = fbm(vec2(x * 7.0 + 1.3, y * 60.0 - uTime * 1.2));",
        "  float xs = x + (n - 0.5) * 0.16;",
        "  float a = exp(-xs * xs * 12.0) * (0.55 + 0.6 * n) * (0.8 + 0.4 * n2);",
        "  a *= smoothstep(0.0, 0.02, y) * pow(1.0 - y, 1.1);",
        "  vec3 col = vec3(0.30 + 0.24 * n) * mix(0.16, 1.0, uDay);",
        "  col += vec3(1.0, 0.42, 0.10) * uFire * (1.0 - smoothstep(0.0, 0.05, y)) * (0.35 + 0.4 * (1.0 - uDay));",
        "  gl_FragColor = vec4(col, clamp(a * uOp, 0.0, 1.0));",
        "}"
      ].join("\n");
      const mat = new ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uOp: { value: SMK.OP }, uDay: { value: 1 }, uFire: { value: 1 }, uH: { value: SMK.H }, uW0: { value: SMK.W0 }, uW1: { value: SMK.W1 } },
        vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false, side: DoubleSide, fog: false
      });
      const m = new Mesh(geo, mat);
      m.name = "smokeColumn";
      m.frustumCulled = false;
      m.castShadow = m.receiveShadow = false;
      m.renderOrder = 2;
      m.userData.noPick = true;
      m.userData.noFade = true;
      return m;
    })();
    const smokeDay = () => {   // 0 at night .. 1 by day: the fog's colour against the day's (55-tamid.js and the lots' demo darken it)
      const f = (ctx2.scene || {}).fog;
      if (!f || !f.color) return 1;
      const c = f.color, lum = 0.3 * c.r + 0.59 * c.g + 0.11 * c.b;
      return Math.max(0, Math.min(1, lum / SMK.DAYLUM));
    };
    mv.add(smokeColumn);
    // ===== 1.0.28: SPARKS rising from the great pyre (CPU particles, additive) + a soft orange GLOW over it.
    const PCX = (GP.x0 + GP.x1) / 2, SPARKS = 90;
    const sparkTex = (() => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 64;
      const c = cv.getContext("2d");
      const gr = c.createRadialGradient(32, 32, 0, 32, 32, 31);
      gr.addColorStop(0, "rgba(255,255,255,1)");
      gr.addColorStop(0.35, "rgba(255,255,255,0.55)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = gr;
      c.fillRect(0, 0, 64, 64);
      return new CanvasTexture(cv);
    })();
    const sparkPos = new Float32Array(SPARKS * 3), sparkCol = new Float32Array(SPARKS * 3);
    const sparkVel = new Float32Array(SPARKS * 3), sparkAge = new Float32Array(SPARKS), sparkLife = new Float32Array(SPARKS);
    const respawnSpark = (i, initial) => {
      sparkPos[i * 3] = FXP.x0 + 0.4 + Math.random() * (FXP.x1 - FXP.x0 - 0.8);
      sparkPos[i * 3 + 1] = TOP + FXP.top + 0.6 + Math.random() * 0.6;
      sparkPos[i * 3 + 2] = GP.cz + (Math.random() - 0.5) * 2 * (GP.hz - 0.5);
      sparkVel[i * 3] = (Math.random() - 0.5) * 0.8;
      sparkVel[i * 3 + 1] = 2.2 + Math.random() * 3.2;
      sparkVel[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      sparkLife[i] = 1.2 + Math.random() * 2.2;
      sparkAge[i] = initial ? Math.random() * sparkLife[i] : 0;
    };
    for (let i = 0; i < SPARKS; i++) respawnSpark(i, true);
    const sparkGeo = new BufferGeometry();
    sparkGeo.setAttribute("position", new BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute("color", new BufferAttribute(sparkCol, 3));
    const sparksMesh = new Points(sparkGeo, new PointsMaterial({
      size: 0.28, map: sparkTex, vertexColors: true, transparent: true, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true, fog: false
    }));
    sparksMesh.frustumCulled = false;
    sparksMesh.renderOrder = 4;
    mv.add(sparksMesh);
    const glow = new Sprite(new SpriteMaterial({ map: sparkTex, color: 16739072, transparent: true, opacity: 0.35, depthWrite: false, blending: AdditiveBlending, fog: false }));
    glow.position.set(PCX, TOP + 3.4, GP.cz);
    glow.scale.set(11, 8, 1);
    glow.renderOrder = 1;
    mv.add(glow);
    // 1.0.31: glowing COALS in the 1-amah gap between the two gezirin (where the fire is lit) - a flickering orange plane
    const coals = new Mesh(new PlaneGeometry(1.5, 0.9), new MeshBasicMaterial({ color: 16730120, transparent: true, opacity: 0.8, blending: AdditiveBlending, depthWrite: false, fog: false }));
    coals.rotation.x = -Math.PI / 2;
    coals.position.set(GEZ_X, TOP + 3.05, GP.cz);   // GEZIRIN_DEFAULT_195: between the two boards (until 1.9.4 a strip along the two beams)
    coals.renderOrder = 1;
    mv.add(coals);
    // COALS3D_211 (stage ב; the user: "גחלים אמיתיות על המזבח"): glowing coals as bodies - a low mound in the gap between the two gezirin
    // (where the fire is lit), a bed by the great pyre's south-west foot (whence the terumah is taken "מן המאוכלות הפנימיות", Tamid 1:4),
    // and embers round its foot; two materials flicker apart. Hidden with the plane in the Ra'avad's reading (ctx2.shared.tapuach.set).
    // Their number, size and places - model choices
    {
      const c3 = new Group();
      c3.name = "coals3d";
      mv.add(c3);
      const cG = new IcosahedronGeometry(1, 0);
      const cm1 = new MeshStandardMaterial({ color: 0x3a1206, emissive: 0xff5a10, emissiveIntensity: 1.4, roughness: 1 });
      const cm2 = new MeshStandardMaterial({ color: 0x2a0d05, emissive: 0xc8360a, emissiveIntensity: 1.0, roughness: 1 });
      let seed = 911;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const spots = [];
      const bed = (cx, cz, rx, rz, y, n, s0, s1, heap) => {
        for (let i = 0; i < n; i++) {
          const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()), x = cx + Math.cos(a) * rx * r, z = cz + Math.sin(a) * rz * r;
          spots.push([x, y + (1 - r * r) * heap + rnd() * 0.03, z, s0 + rnd() * (s1 - s0)]);
        }
      };
      bed(GEZ_X, GP.cz, 0.6, 0.36, TOP + 3.03, 46, 0.05, 0.085, 0.13);        // the mound between the gezirin
      bed(GP.x0 - 0.55, GP.cz + GP.hz - 0.4, 0.62, 0.55, TOP + 0.03, 44, 0.06, 0.1, 0.12);   // the bed by the south-west foot
      for (let i = 0; i < 40; i++) {                                          // embers round the foot
        const u = rnd(), side = Math.floor(rnd() * 4);
        const x = side < 2 ? GP.x0 - 0.2 + u * (GP.x1 - GP.x0 + 0.4) : side === 2 ? GP.x0 - 0.25 : GP.x1 + 0.25;
        const z = side === 0 ? GP.cz - GP.hz - 0.2 : side === 1 ? GP.cz + GP.hz + 0.2 : GP.cz - GP.hz + u * 2 * GP.hz;
        spots.push([x + (rnd() - 0.5) * 0.2, TOP + 0.03, z + (rnd() - 0.5) * 0.2, 0.04 + rnd() * 0.05]);
      }
      const halves = [[], []];
      spots.forEach((p, i) => halves[i % 2].push(p));
      const m4 = new Matrix4(), q4 = new Quaternion(), e4 = new Euler(), v4 = new Vector3(), s4 = new Vector3();
      halves.forEach((list, h) => {
        const im = new InstancedMesh(cG, h ? cm2 : cm1, list.length);
        list.forEach((p, i) => { e4.set(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28); q4.setFromEuler(e4); v4.set(p[0], p[1] + p[3] * 0.6, p[2]); s4.set(p[3] * 1.3, p[3] * 0.75, p[3]); m4.compose(v4, q4, s4); im.setMatrixAt(i, m4); });
        im.userData.noPick = true;
        c3.add(im);
      });
      ctx2.animated.push((t) => { cm1.emissiveIntensity = 1.25 + 0.35 * Math.sin(t * 0.0071) * Math.sin(t * 0.0031 + 1); cm2.emissiveIntensity = 0.9 + 0.3 * Math.sin(t * 0.0093 + 2); });
      ctx2.shared.__coals3d = c3;
    }
    // NIGHT_COALS_304 (the user, 19.11.2026 19:24: "ערמת גחלים כפי שהצעת"): THE END OF THE NIGHT ON THE ALTAR - for the morning's
    // service (55-tamid.js: from its start until the great pyre is laid). The logs of the great and the second pyre are not seen; a heap
    // of glowing coals in grey ash where the great pyre stands, a small one where the second stands; the great pyre's flames come down
    // onto the heap, lower; the sparks, the smoke and the glow rise from it. "אלא מהלך לאור המערכה" (Tamid 1:4); "וחותה מן הגחלים
    // שנתאכלו בלב האש" (the Rambam, Temidin 2:12); "שבתחלה פינה את הגחלים שנתהוו מהעצים של המערכה אילך ואילך" (the Tiferet Yisrael,
    // Tamid 1, 818:122). The heaps' size and form, the flames' height - model choices. set(k): 1 the night, 0 the model as it was
    {
      // NIGHT_RAAVAD_304: both readings of the tapuach - the heaps where the reading's pyres stand; the fire as the reading has it
      const cG = new IcosahedronGeometry(1, 0);
      const hot = new MeshStandardMaterial({ color: 0x3a1206, emissive: 0xff5a10, emissiveIntensity: 1.5, roughness: 1 });
      const warm = new MeshStandardMaterial({ color: 0x2a0d05, emissive: 0xc8360a, emissiveIntensity: 1.0, roughness: 1 });
      const ash = new MeshStandardMaterial({ color: 0x8a8580, roughness: 1 });
      let seed = 3041;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const parent = (ctx2.shared.__coals3d && ctx2.shared.__coals3d.parent) || mv;
      // a set of heaps: [centre x, centre z, half-sizes x / z, height, pieces, a piece's least and greatest size]; ash on the rim, the glow
      // in the heart
      const mkHeaps = (name, specs) => {
        const G = new Group();
        G.name = name;
        G.visible = false;
        const lists = [[], [], []];
        for (const [cx, cz, rx, rz, h, n, s0, s1] of specs) {
          for (let i = 0; i < n; i++) {
            const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()), x = cx + Math.cos(a) * rx * r, z = cz + Math.sin(a) * rz * r;
            const y = TOP + 0.03 + (1 - r * r) * h * (0.75 + rnd() * 0.25);
            const k = r > 0.82 ? (rnd() < 0.7 ? 2 : 1) : r > 0.55 ? (rnd() < 0.35 ? 2 : 1) : (rnd() < 0.6 ? 0 : 1);
            lists[k].push([x, y, z, s0 + rnd() * (s1 - s0)]);
          }
        }
        const m4 = new Matrix4(), q4 = new Quaternion(), e4 = new Euler(), v4 = new Vector3(), s4 = new Vector3();
        lists.forEach((list, k) => {
          if (!list.length) return;
          const im = new InstancedMesh(cG, [hot, warm, ash][k], list.length);
          list.forEach((q, i) => { e4.set(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28); q4.setFromEuler(e4); v4.set(q[0], q[1], q[2]); s4.set(q[3] * 1.3, q[3] * 0.7, q[3]); m4.compose(v4, q4, s4); im.setMatrixAt(i, m4); });
          im.userData.noPick = true;
          im.receiveShadow = true;
          G.add(im);
        });
        parent.add(G);
        return G;
      };
      const NH = mkHeaps("nightCoals", [
        [(GP.x0 + GP.x1) / 2, GP.cz, 1.75, 3.1, 0.55, 300, 0.07, 0.15],   // where the great pyre stands (4.5 x 8)
        [GP.x0 - 0.2, GP.cz + GP.hz - 0.6, 0.75, 0.6, 0.28, 50, 0.06, 0.11],   // its south-west foot - the inner coals, whence the terumah
        [46, 5, 0.62, 0.55, 0.24, 46, 0.05, 0.1]]);   // the second pyre (addPyre(46, 5, ...))
      let NHR = null;   // the Ra'avad's reading: by his table (ctx2.shared.__pyresR, built below), made when first needed
      const heapsR = (RS) => NHR || (NHR = mkHeaps("nightCoalsRaavad", [
        [RS.xe, GP.cz, 0.42, GP.hz - 0.3, 0.42, 150, 0.06, 0.12],   // his great pyre, in the amah round the table
        [RS.xw, 5, 0.55, 0.6, 0.22, 40, 0.05, 0.1]]));   // his second
      ctx2.animated.push((t) => { if (!NH.visible && !(NHR && NHR.visible)) return; hot.emissiveIntensity = 1.35 + 0.4 * Math.sin(t * 0.0068) * Math.sin(t * 0.0029 + 1); warm.emissiveIntensity = 0.85 + 0.3 * Math.sin(t * 0.0091 + 2); });
      // the heap goes down onto the altar's top as k falls (scaled about the top, not about the ground)
      const flat = (H, k) => { const sc = Math.max(0.05, k); H.visible = k > 0.01; H.scale.y = sc; H.position.y = TOP * (1 - sc); };
      let B = null;   // the reading's fire as it is when the night begins (tapuach.set gives each reading its own)
      ctx2.shared.altarNight = {
        k: 0,
        set(k) {
          k = Math.max(0, Math.min(1, +k || 0));
          if (Math.abs(k - this.k) < 1e-4) return;
          const T = ctx2.shared.tapuach, RS = ctx2.shared.__pyresR;
          if (!B) B = { rv: !!(T && T.mode === "raavad" && RS && RS.night), top: FXP.top, gy: glow.position.y, op: glow.material.opacity, sx: glow.scale.x, sy: glow.scale.y, fl: fireLight.position.y };
          this.k = k;
          const night = k > 0.5, R = B.rv ? RS.night : null;
          if (R) {
            R.logs.visible = !night;
            R.coals.visible = !night;
            for (const g of R.gez) g.visible = !night;
            flat(heapsR(RS), k);
          } else {
            pyreLogsK.visible = !night;
            coals.visible = !night;   // the plane between the gezirin, on the pyre's top
            if (ctx2.shared.__coals3d) ctx2.shared.__coals3d.visible = !night;
            flat(NH, k);
          }
          for (const f of R ? R.fl : GPF) {
            const u = f.userData;
            if (u.ny0 == null) { u.ny0 = f.position.y; u.nh0 = u.h; }
            f.position.y = u.ny0 + (TOP + 0.3 - u.ny0) * k;
            u.h = u.nh0 * (1 - 0.62 * k);
          }
          FXP.top = B.top + (0.55 - B.top) * k;
          glow.position.y = B.gy + (TOP + 1.0 - B.gy) * k;
          glow.material.opacity = B.op * (1 - 0.25 * k);
          glow.scale.set(B.sx * (1 - 0.3 * k), B.sy * (1 - 0.45 * k), 1);
          fireLight.position.y = B.fl - 2.2 * k;
          if (k < 1e-4) {   // the night over: the reading's own fire, as tapuach.set makes it (also if the reading was changed meanwhile)
            B = null;
            if (T && typeof T.set === "function") T.set(T.mode);
          }
        }
      };
    }
    let lastT = 0;
    {
      // 1.0.24: the TAPUACH (תפוח) made a real, visible heap. Tamid 2:2: \"ותפוח היה באמצע המזבח\" - the ash heap in the middle of the altar (Rambam commentary: a round heap
      // of ash, called tapuach because it looks like an apple; Tiferet Yisrael: \"כרי גדול של אפר, עגול\"). The great pyre touches it (Tamid 2:4).
      // MODEL CHOICES: round dome, radius 4.5 and height 2.2 amot (\"300 kor\" is hyperbole, Rambam), the ash black (the user, 10.11.2026).
      // OTHER OPINION (Ra'avad, Temidin 2:7, as quoted in Tosafot Yom Tov / Melechet Shlomo): a square platform 1 amah high, 22x22 amot, completing the 10 amot height - NOT drawn (see shitot).
      // 1.9.3 (the user, 10.11.2026: "התפוח שעל המזבח צריך להיות כעין אפר (אותה הצורה רק החומר והצבע משתנים)"): THE ASH - the heap kept
      // its shape; its material is ash - BLACK since 19:03 the same day ("האפר צריך להיות כדשן שחור"), see inside: drawn once on a
      // canvas (a fixed seed - the same heap at every load), the same picture as its bump, no shine. Until now a plain light grey.
      const ashMat = (() => {
        // 10.11.2026 (the user, 19:03: "האפר צריך להיות כדשן שחור"): BLACK ASH. One drawing made twice, of the same seed - the picture in
        // black (a black ground, darker and lighter patches, black grains with a few pale flecks, bits of charcoal), and the relief in the
        // former grey, so the grains stand where they are seen. Shape and measures untouched.
        let seed = 0;
        const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
        const draw = (black) => {
          const cv = document.createElement("canvas");
          cv.width = cv.height = 256;
          const c2 = cv.getContext("2d");
          seed = 20261110;
          const col = (v, a) => "rgba(" + v + "," + Math.max(0, v - (black ? 1 : 3)) + "," + Math.max(0, v - (black ? 2 : 9)) + "," + a + ")";
          c2.fillStyle = black ? "#232120" : "#8f8b84";
          c2.fillRect(0, 0, 256, 256);
          for (let i = 0; i < 90; i++) {   // soft patches, lighter and darker
            const x = rnd() * 256, y = rnd() * 256, r = 14 + rnd() * 34, k = rnd();
            const v = Math.round(black ? 10 + k * 46 : 104 + k * 92);
            const gr = c2.createRadialGradient(x, y, 0, x, y, r);
            gr.addColorStop(0, col(v, 0.5));
            gr.addColorStop(1, col(v, 0));
            c2.fillStyle = gr;
            c2.fillRect(x - r, y - r, 2 * r, 2 * r);
          }
          for (let i = 0; i < 5200; i++) {   // the grains
            const k = rnd(), s = 0.6 + rnd() * 1.7;
            const v = Math.round(black ? (k > 0.93 ? 78 + (k - 0.93) * 700 : 5 + k * 58) : 70 + k * 150);
            c2.fillStyle = col(v, (0.35 + rnd() * 0.5).toFixed(2));
            c2.fillRect(rnd() * 256, rnd() * 256, s, s);
          }
          for (let i = 0; i < 130; i++) {   // bits of charcoal
            const s = 1 + rnd() * 2.6, a = rnd(), b = rnd(), d = rnd();
            c2.fillStyle = black ? "rgba(" + Math.round(2 + a * 10) + "," + Math.round(2 + b * 9) + "," + Math.round(2 + d * 8) + ",0.95)"
              : "rgba(" + Math.round(28 + a * 26) + "," + Math.round(26 + b * 22) + "," + Math.round(24 + d * 20) + ",0.9)";
            c2.fillRect(rnd() * 256, rnd() * 256, s, s * (0.6 + rnd() * 0.9));
          }
          return cv;
        };
        const tex = new CanvasTexture(draw(true));
        tex.colorSpace = SRGBColorSpace;
        tex.wrapS = tex.wrapT = RepeatWrapping;
        tex.repeat.set(5, 2);
        tex.anisotropy = 4;
        const bump = new CanvasTexture(draw(false));
        bump.wrapS = bump.wrapT = RepeatWrapping;
        bump.repeat.set(5, 2);
        return new MeshStandardMaterial({ color: 0xffffff, map: tex, bumpMap: bump, bumpScale: 0.5, roughness: 1, metalness: 0 });
      })();
      const geo = new SphereGeometry(1, 40, 14, 0, Math.PI * 2, 0, Math.PI / 2);
      geo.scale(4.5, 3, 4.5);
      const m = new Mesh(geo, ashMat);
      m.position.set(ACX, TOP, ACZ);
      m.castShadow = m.receiveShadow = true;
      mv.add(m);
      ctx2.labels.push({ text: "התפוח", x: ACX, y: TOP + 4.2, z: ACZ, size: 1.6 });
      toTop(false);
      // 1.8.0 (the user): THE RA'AVAD'S TAPUACH, drawn (Hasagot, Temidin uMusafin 2; quoted by the Melechet Shlomo on Tamid 2:2, checked in
      // the library): "עליו" and not "בו" - "שהיה שם טבלא מרובעת גבוה אמה והיא כ״ב אמה על כ״ב אמה ואותה אמה היתה השלמת עשר אמות לגובה
      // המזבח והיא נקראת תפוח ע״ש שהיתה גבוהה על כל סביביו ואפשר שהיתה אותה הטבלא קצוצת קרנות כעין עגולה כדי להרחיב מקום המערכה".
      // Drawn: a table of the altar's stone, 22 x 22 x 1 in the middle of the top, its corners cut 2 amot ("קצוצת קרנות"), the ash laid on it.
      // (Until 1.9.4 the pyres stood on it and topG went up one amah - against the Ra'avad's own words; see pyresR below.)
      const sh = new Shape();
      const H = 11, C = 2;
      sh.moveTo(-H + C, -H); sh.lineTo(H - C, -H); sh.lineTo(H, -H + C); sh.lineTo(H, H - C); sh.lineTo(H - C, H); sh.lineTo(-H + C, H); sh.lineTo(-H, H - C); sh.lineTo(-H, -H + C); sh.closePath();
      const tg = new ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false });
      tg.rotateX(-Math.PI / 2);
      const table = new Group();
      table.visible = false;
      mv.add(table);
      const slab = new Mesh(tg, AS);
      slab.position.set(ACX, TOP, ACZ);
      slab.castShadow = slab.receiveShadow = true;
      table.add(slab);
      // 1.9.3: the flat layer of ash on the table - the same ash, its picture stretched to the table's own measures (a shape's
      // picture runs by amot, and at the heap's repeat it shrank to a fine net of dots)
      const ashFlat = ashMat.clone();
      ashFlat.map = ashMat.map.clone();
      ashFlat.bumpMap = ashMat.bumpMap.clone();
      for (const t of [ashFlat.map, ashFlat.bumpMap]) { t.repeat.set(0.13, 0.13); t.needsUpdate = true; }
      // TAPUACH_211 (the user, 15.11.2026, of the top's picture: "הטבלא מכסה את כל המערכה, ואיך בדיוק היו מקטירים?"): the ash lay over
      // 0.82 of the table - from above the whole top was one black square, and the fire a thin line at its edge, as if the table had
      // swallowed the place of the pyres. Now the table shows as what it is - the altar's own stone - and the ash is a heap in its
      // MIDDLE with a round bed about it; and the amah round the table, where the Ra'avad's pyres lie (the Lechem Mishneh on Temidin
      // 2:7, book 4030, line 26: "הניח אמה מכל צד כדי שישימו שם גזרי המערכה שהם אמה על אמה"), is marked by a band of soot.
      const ashTop = new Mesh(new CircleGeometry(5.6, 48), ashFlat);
      ashTop.rotation.x = -Math.PI / 2;
      ashTop.position.set(ACX, TOP + 1.01, ACZ);
      table.add(ashTop);
      const heap = new Mesh(new SphereGeometry(1, 32, 10, 0, Math.PI * 2, 0, Math.PI / 2), ashMat);
      heap.scale.set(4, 1.5, 4);
      heap.position.set(ACX, TOP + 1, ACZ);
      table.add(heap);
      {
        const band = new Shape();
        band.moveTo(-12, -12); band.lineTo(12, -12); band.lineTo(12, 12); band.lineTo(-12, 12); band.closePath();
        const hole = new Path();
        hole.moveTo(-H + C, -H); hole.lineTo(-H, -H + C); hole.lineTo(-H, H - C); hole.lineTo(-H + C, H); hole.lineTo(H - C, H); hole.lineTo(H, H - C); hole.lineTo(H, -H + C); hole.lineTo(H - C, -H); hole.closePath();
        band.holes.push(hole);
        const soot = new Mesh(new ShapeGeometry(band), new MeshStandardMaterial({ color: 0x40362c, roughness: 1, transparent: true, opacity: 0.5, depthWrite: false }));
        soot.rotation.x = -Math.PI / 2;
        soot.position.set(ACX, TOP + 0.02, ACZ);
        soot.userData.noPick = true;
        table.add(soot);
      }
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.tapuachRaavad = table;
      ctx2.labels.push({ text: "התפוח לראב״ד — טבלה כ״ב על כ״ב, גבוהה אמה", x: ACX, y: TOP + 3.2, z: ACZ + 9, size: 1.2, layer: "tapuachRaavad" },
        { text: "מקום המערכה לראב״ד — האמה שסביב הטבלה, והגזרים בה ממזרח למערב", x: ACX + 11.5, y: TOP + 2.4, z: ACZ - 7.5, size: 1.1, layer: "tapuachRaavad", moveWithAltar: true },
        { text: "קרן הטבלה קצוצה — ״ואפשר שהיתה אותה הטבלא קצוצת קרנות... כדי להרויח מקום המערכה״ (ראב״ד)", x: ACX + 10, y: TOP + 2.9, z: ACZ - 10.4, size: 1, layer: "tapuachRaavad", moveWithAltar: true });
      // 1.9.5 (the user, 11.11.2026 17:51: "צריך לשנות"): THE RA'AVAD'S PYRES STAND BESIDE HIS TABLE. His words (Hasagot, Temidin
      // uMusafin 2:7; the user's library, book 5256, line 7): "שלא יהיו הגזרים הולכין צפון ודרום אלא מזרח ומערב והיינו ראשי הגזרים
      // הפנימים נוגעין בתפוח ולא בא להוסיף אלא שיהיו נוגעים בתפוח שלא ירחיקו מהלך רגלי הכהנים שהיה אמה שלא יקרעו ולא ישרפו
      // בגדיהם"; and the table's corners are cut "כדי להרויח מקום המערכה". So: the table is 22 x 22 in the place of the pyres, 24 x 24
      // (Middot 3:1) - an amah is left round it, inside the kohanim's walk; the logs are an amah long ("גזירין שעשה משה - אורכן אמה",
      // Zevachim 62b; book 130, line 2117) and lie EAST-WEST in that amah, their inner ends on the table's face; the walk stays free.
      //   the great pyre - in the east ("סדר המערכה גדולה מזרחה", Tamid 2:4), along the table's east face, where it stood (z -3..5);
      //   the second, for the incense - in the west, four amot north of the south-west horn (Tamid 2:5);
      //   the third (R. Yose), R. Meir's fourth and Yom Kippur's - in the west and the east amah, opposite their old places.
      // The logs are piled as pipes (each row in the grooves of the one under it), four rows the great pyre. The length of each pyre
      // along the side, the places of the others, the pile and its height - model choices.
      {
        const XE = ACX + 11.5, XW = ACX - 11.5;   // the middle of the amah east / west of the table (x 67 / 44)
        // RAAVAD_PILE2 - 1.9.5, second drawing (the user, 18:31, of the pipes and the two cubes: "אתה בטוח שלזה התכוון הראב"ד? זה נראה
        // יותר כמו, לא יודע מה"). What his words give stays: the logs lie EAST-WEST, their inner heads on the table, and they keep out
        // of the kohanim's amah. The pile is drawn as SPLIT WOOD: billets an amah long, a little short (Zevachim 62b "באמה גדומה";
        // Rashi there, book 2191, line 2998: "קצרה שלא יצאו חוץ למערכה ויעכבו הכהנים מלהקיף"), side by side with a space between them
        // (Tamid 2:4 "ורוח היה בין הגזרין, שהיו מציתין את האליתא משם"), two layers. THE TWO GEZIRIN on the great pyre by the Gemara's
        // measure (Zevachim 62b, book 130, line 2117: "אורכן אמה, ורוחבן אמה, ועוביין כמחק גודש סאה"; the Rambam, Issurei Mizbeach
        // 7:3, book 339, line 100: "וכמותן עושין לדורות"): two flat boards an amah by an amah - not cubes. The number of the billets,
        // their thickness, the two layers and the boards' thickness (0.1) - model choices.
        let bN = 0;
        const hsh = (n) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
        const pile = (list, xc, zc, half, layers, wd) => {
          const pitch = wd * 1.75, n = Math.max(1, Math.round(2 * half / pitch)), sgn = xc > ACX ? 1 : -1;
          const face = xc - sgn * 0.5;   // the table's face on that side: the billets' inner heads stand on it
          for (let l = 0; l < layers; l++) {
            for (let i = 0; i < n; i++) {
              const k = ++bN, len = 0.9 + hsh(k + 0.3) * 0.06, th = wd * (0.68 + hsh(k) * 0.26);
              list.push({ x: face + sgn * (len / 2 + (l ? hsh(k + 0.1) * 0.03 : 0)), y: TOP + l * wd * 0.8 + th / 2,
                z: zc - half + pitch / 2 + i * pitch + (hsh(k + 0.2) - 0.5) * 0.06, len, w: wd * (0.8 + hsh(k + 0.4) * 0.3), t: th,
                roll: (hsh(k + 0.5) - 0.5) * 0.16, yaw: (hsh(k + 0.6) - 0.5) * 0.05 });
            }
          }
          return TOP + (layers - 1) * wd * 0.8 + wd * 0.95;   // the pile's top
        };
        const instLogsB = (list) => {
          const inst = new InstancedMesh(new BoxGeometry(1, 1, 1), M2.cedar, list.length);
          const m42 = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), sc = new Vector3();
          list.forEach((L, i) => {
            e.set(L.roll, L.yaw, 0);
            q.setFromEuler(e);
            p.set(L.x, L.y, L.z);
            sc.set(L.len, L.t, L.w);
            m42.compose(p, q, sc);
            inst.setMatrixAt(i, m42);
          });
          inst.castShadow = inst.receiveShadow = true;
          mv.add(inst);
          return inst;
        };
        toTop(true, pyresR);
        const lR = [], l3 = [], l4 = [], lYK = [];
        const gTop = pile(lR, XE, GP.cz, GP.hz, 3, 0.32);   // TAPUACH_211: three layers (two read as a single thin line)
        pile(lR, XW, 5, 0.75, 2, 0.16);                        // the second pyre, for the incense
        pile(l3, XW, -11, 1.2, 2, 0.22);                       // the third, keeping the fire (R. Yose)
        pile(l4, XE, -9.5, 0.7, 2, 0.16);                      // R. Meir's fourth
        pile(lYK, XE, -12, 0.7, 2, 0.16);                      // Yom Kippur's
        const pRK = instLogsB(lR);   // NIGHT_RAAVAD_304: his great and second pyre - not seen at night (altarNight)
        const p3 = instLogsB(l3), p4 = instLogsB(l4), pYK = instLogsB(lYK);
        // the two gezirin on the great pyre, an amah between them (the place of the lighting), and the coals in it
        const gzR = [-1, 1].map((dz) => H2.box(mv, 0.94, 0.1, 0.94, M2.cedar, XE - 0.5 + 0.47, gTop, GP.cz + dz));   // NIGHT_RAAVAD_304
        const coalsR = new Mesh(new PlaneGeometry(1, 0.9), coals.material);
        coalsR.rotation.x = -Math.PI / 2;
        coalsR.position.set(XE, gTop + 0.05, GP.cz);
        coalsR.renderOrder = 1;
        mv.add(coalsR);
        const fR0 = flames.length;   // NIGHT_RAAVAD_304
        [GP.cz - 3.2, GP.cz - 1.6, GP.cz, GP.cz + 1.6, GP.cz + 3.2].forEach((z, i) => {
          const k = i % 3;
          addFlame(XE + (i % 2 ? 0.12 : -0.1), gTop - 0.2, z, 0.7 - k * 0.08, 2.8 - k * 0.4, [16742942, 16758832, 16769162][k], 0.78 + k * 0.06);
        });
        addFlame(XW, TOP + 0.3, 5, 0.6, 1.6, 16758832, 0.8);
        const fR = flames.slice(fR0);   // NIGHT_RAAVAD_304: his great pyre's five flames and his second's one
        const f3 = addFlame(XW, TOP + 0.4, -11, 0.95, 2.4, 16742942, 0.8);
        toTop(false);
        ctx2.shared.__pyresR = { p3, f3, p4, pYK, top: gTop - TOP, xe: XE, xw: XW, night: { logs: pRK, gez: gzR, coals: coalsR, fl: fR } };
      }
      ctx2.shared.tapuach = {
        mode: "kri",
        set(k) {
          this.mode = k === "raavad" ? "raavad" : "kri";
          const on = this.mode === "raavad", RS = ctx2.shared.__pyresR;
          table.visible = on; m.visible = !on;
          pyresK.visible = !on; pyresR.visible = on;
          // the fire's light, glow, coals, sparks and smoke follow the great pyre of the reading
          FXP.x0 = on ? RS.xe - 0.5 : GP.x0; FXP.x1 = on ? RS.xe + 0.5 : GP.x1; FXP.top = on ? RS.top : 3;
          const px = (FXP.x0 + FXP.x1) / 2;
          fireLight.position.set(on ? px : 62, on ? TOP + RS.top + 3.4 : 30.8, GP.cz);
          glow.position.set(px, TOP + FXP.top + 0.4, GP.cz);
          glow.scale.set(on ? 7 : 11, on ? 6.5 : 8, 1);
          coals.visible = !on;
          if (ctx2.shared.__coals3d) ctx2.shared.__coals3d.visible = !on;   // COALS3D_211
          emberLight.position.x = on ? RS.xw : 46;
          ctx2.shared.maarachot.set(ctx2.shared.maarachot.count, ctx2.shared.maarachot.yk);
        }
      };
      ctx2.shared.tapuach.heap = m;   // TAMID_PORT_207 (55-tamid.js): the round heap, raised by the morning's ash
    }
    // 1.5.0 (the user: the laver was buried inside the ulam's steps, which run the whole width of the ulam since 1.4.0): the laver south of the
    // steps' edge (z 50) - still "בין האולם ולמזבח ומשוך כלפי הדרום" (Middot 3:6) in the 22-amah strip; the exact spot is a model choice
    const KX = 22, KZ = 57;   // west of לשכת המדיחין (x 27..41, inside the court since 1.5.0), south of the ulam's steps (z 50)
    // 1.9.1 (the user: "מוכני — לעשות"; Yoma 3:10 "ואף הוא עשה מוכני לכיור, שלא יהיו מימיו נפסלין בלינה"; the Bartenura there: "מוכני -
    // גלגל לשקעו בבור, שיהיו מימיו מחוברים בבור ולא יפסלו בלינה"; Tiferet Yisrael (Middot 3:6): "הבאר שמעליה היה הכיור תלוי בגלגל"): the
    // laver HANGS over its well on the wheel - no base. The well (KPIT, cut through the court's pave and podium in 30-courts.js) is
    // lined with stone, its water 0.8 under the floor; a winch over it - two cedar posts, an axle along x, the wheel at its east end, four
    // ropes to the laver's rim. ctx2.shared.mukhni.demo(): the evening - the wheel turns and the laver sinks under the water; the night;
    // the morning - "קול העץ שעשה בן קטין מוכני לכיור, והן אומרים הגיע עת" (Tamid 1:4), and it rises. Sizes, the winch and the well's
    // depth - model choices.
    const KPIT = ctx2.shared.KPIT || { x: KX, z: KZ, w: 6.4, d: 6.4 };
    {
      const bot = 10.3, top = F, wt = 0.5, iw = KPIT.w - 2 * wt;
      H2.box(g, KPIT.w, 0.2, KPIT.d, M2.stoneSmooth, KPIT.x, bot - 0.2, KPIT.z);
      for (const s2 of [-1, 1]) {
        H2.box(g, KPIT.w, top - bot, wt, M2.stoneSmooth, KPIT.x, bot, KPIT.z + s2 * (iw / 2 + wt / 2));
        H2.box(g, wt, top - bot, iw, M2.stoneSmooth, KPIT.x + s2 * (iw / 2 + wt / 2), bot, KPIT.z);
        H2.box(g, KPIT.w + 0.6, 0.3, 0.3, M2.stoneSmooth, KPIT.x, top, KPIT.z + s2 * (KPIT.d / 2 + 0.15));
        H2.box(g, 0.3, 0.3, KPIT.d, M2.stoneSmooth, KPIT.x + s2 * (KPIT.w / 2 + 0.15), top, KPIT.z);
      }
      const wm = tm_water(new MeshStandardMaterial({ color: 0x2f6f86, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.62, depthWrite: false }), { scale: 0.6 });   // WATER_420
      const surf = new Mesh(new BoxGeometry(iw, 0.04, iw), wm);
      surf.position.set(KPIT.x, top - 0.8, KPIT.z);
      surf.renderOrder = 4;
      g.add(surf);
      const deep = new Mesh(new BoxGeometry(iw, top - 0.8 - bot, iw), new MeshStandardMaterial({ color: 0x163a48, roughness: 0.3, transparent: true, opacity: 0.35, depthWrite: false }));
      deep.position.set(KPIT.x, (top - 0.8 + bot) / 2, KPIT.z);
      g.add(deep);
    }
    // ===== KIYOR_A2 (fix-a2, 22.11.2026; the user's decisions 40, 43, 57-60, 73, 81): THE LAVER, ITS BASE, THE WELL'S LID AND BEN KATIN'S
    // MACHINE, as the booklet "חלמיש" draws them (the user: "כחוברת").
    //  * The laver - "כמין דוד גדולה ולה דדים" (Rashi, Shemot 30:18): a great kettle, its belly round. Its size - a switch (decision 73;
    //    ctx2.shared.kiyorSize): Tosafot Yom Tov, Yoma 3:10 (898:110): its round twelve (against the twelve spouts), across four - the
    //    default (decision 81: "במקום הבור חסרו מן המעלות"); or round nine, across three; or as until now, across five and a quarter (a
    //    model choice). The base, the well, the lid and the priests' spots follow the size.
    //  * The twelve spouts (decision 60) as the Melechet Shlomo (1151:128): one upper spout and eleven under it; a small tap in each (a
    //    model choice). The upper one toward the east.
    //  * The base (decision 43) - the second answer of Tosafot, Zevachim 22a (1936:254): "כעין יורה כפוייה על פיה ונפחתו שוליה" (the Piskei Tosafot 2090:24: "כפויה על פיהו נפחתו"), as R.
    //    Chaim Kanievsky explains it in the booklet: "כחבית על גבי חבית" - a cauldron upside down, its bottom cut away, the laver standing
    //    on it. It stands BESIDE the well (decision 59).
    //  * The well, covered by day with a lid and no fence round it (decision 40: "מכסה לבור, בלי גדר"; Rashi, Sukkah 48b: "שהיו משקעין
    //    אותו מבערב בבור"). Its form (square, as it was) and the number of the ropes - "מה שיותר יפה": model choices.
    //  * Ben Katin's machine (decision 57): a crane - a post, an arm that turns round it, the rope over two pulleys to a drum at the
    //    post's foot - and on the drum a TOOTHED WHEEL with a tongue of wood that knocks on its teeth: "קול דפיקת שיני הגלגל" (Tiferet
    //    Yisrael, Tamid 3, 818:330), "קול העץ שעשה בן קטין מוכני לכיור" (Tamid 1:4). The arm lifts the laver off its base, swings it over
    //    the well and lowers it into the water in the evening; in the morning back onto the base (decision 59).
    // ctx2.shared.mukhni = { demo(), stop(), pose(d, ph) } (d 0 .. 5.6: 0 the laver on its base, 5.6 in the well); ctx2.shared.kiyorSize =
    // { mode, set("d4" | "d3" | "d525") }; ctx2.shared.kiyorInfo() -> { R, H, foot, spouts: [{ p: [x, y, z], a (its angle), upper }] }.
    const PITX = KPIT.x, PITZ = KPIT.z, KZK = 54.7;   // the base's place: north of the well (the well moved south for it, 30-courts.js)
    const KEN_H = 2.3, KR0 = 2.625;                  // the base's height (KIYOR_CHALAMISH_A2: 1.45 until then - tall, as drawn); the laver's own radius (across 5.25) - the size scales it
    const kiyorG = new Group();   // the laver, its water and its twelve spouts - lifted, swung and lowered together
    g.add(kiyorG);
    const bowlG = new Group();    // the laver in its own frame (its foot at 0), scaled by the size
    kiyorG.add(bowlG);
    // KIYOR_CHALAMISH_A2 (the user, on picture 15: "נראה לא טוב" - to be as the booklet draws it, A-11 / B-02 / B-11 / B-22): a great
    // copper barrel with FACES (twelve - one to each spout), not a round pot; a band of round ribs under the shoulder, a domed lid with a
    // knob and a ring (the rope takes it there), the row of taps round it; it stands on a tall ribbed base - "חבית על גבי חבית". The
    // colour, the faces, the lid and the ribs - as the booklet: model choices.
    const HB = 1.5, LAVER_H = 2.62 * HB, LAVER_TOP = LAVER_H + 1.3;   // the body taller than its breadth, as drawn (HB); its height; the ring on the lid's knob (the rope's hook)
    const copperM = tm_copper(0xb4602c, 0.36, { metalness: 0.62 });   // COPPER_C (fix-c): the book's copper, shared/frag/copper.js (until now 0xb4602c)
    const copperD = tm_copper(0x8e4520, 0.45, { metalness: 0.55 });   // COPPER_C: the darker parts, in the same hue (until now 0x8e4520)
    // a body of revolution whose round is shaped by rf(angle) (faces, ribs): prof [[r, y], ...], nU segments round
    const revG = (prof, nU, rf) => {
      const pos = [], uv = [], idx = [], nV = prof.length;
      for (let v = 0; v < nV; v++) for (let u = 0; u <= nU; u++) {
        const th = (u / nU) * Math.PI * 2, r = prof[v][0] * rf(th, v);
        pos.push(Math.sin(th) * r, prof[v][1], Math.cos(th) * r); uv.push(u / nU, v / (nV - 1));
      }
      for (let v = 0; v < nV - 1; v++) for (let u = 0; u < nU; u++) { const a = v * (nU + 1) + u, b = a + nU + 1; idx.push(a, a + 1, b, a + 1, b + 1, b); }
      const ge = new BufferGeometry(); ge.setAttribute("position", new Float32BufferAttribute(pos, 3)); ge.setAttribute("uv", new Float32BufferAttribute(uv, 2)); ge.setIndex(idx); ge.computeVertexNormals();
      return ge;
    };
    const FACE12 = (th) => { const k = Math.PI / 6, d = ((th % k) + k) % k - k / 2; return Math.cos(k / 2) / Math.cos(d); };   // a twelve-sided round, a face toward each spout
    {
      const prof = [[0.01, 0], [1.9, 0], [2.18, 0.07], [2.42, 0.22], [2.54, 0.45], [2.6, 0.8], [2.62, 1.3], [2.6, 1.85], [2.52, 2.2], [2.36, 2.45], [2.22, 2.6], [2.2, 2.62]];   // nearly straight, rounded below and above (as drawn)
      const body = new Mesh(revG(prof.map(([r, y]) => [r, y * HB]), 96, (th) => FACE12(th)), copperM); body.castShadow = body.receiveShadow = true; bowlG.add(body);
      // the band under the lid: round ribs side by side (the booklet's "beads")
      const gr = new SphereGeometry(1, 8, 6); gr.scale(0.11, 0.17, 0.08);
      const ribs = new InstancedMesh(gr, copperD, 60), m4r = new Matrix4(), qr = new Quaternion(), er = new Euler(), pr = new Vector3(), sr = new Vector3(1, 1, 1);
      for (let k = 0; k < 60; k++) { const a = (k * Math.PI * 2) / 60; er.set(0, a, 0); qr.setFromEuler(er); pr.set(Math.sin(a) * 2.25, LAVER_H + 0.15, Math.cos(a) * 2.25); m4r.compose(pr, qr, sr); ribs.setMatrixAt(k, m4r); }
      bowlG.add(ribs);
      const L0 = LAVER_H - 2.62;
      bowlG.add(new Mesh(revG([[2.24, 2.6], [2.34, 2.62], [2.34, 2.66], [2.24, 2.68]].map(([r, y]) => [r, y + L0]), 48, () => 1), copperD));
      bowlG.add(new Mesh(revG([[2.24, 2.86], [2.36, 2.88], [2.36, 2.94], [2.2, 2.96]].map(([r, y]) => [r, y + L0]), 48, () => 1), copperD));
      // the lid: a low dome, a knob and its ring
      const lid = new Mesh(revG([[2.22, 2.94], [2.05, 3.05], [1.7, 3.25], [1.15, 3.42], [0.55, 3.5], [0.3, 3.55], [0.26, 3.62], [0.4, 3.72], [0.36, 3.8], [0.01, 3.82]].map(([r, y]) => [r, y + L0]), 48, () => 1), copperM);
      lid.castShadow = true; bowlG.add(lid);
      const ring = new Mesh(new TorusGeometry(0.17, 0.045, 6, 14), copperD); ring.position.y = LAVER_H + 1.25; bowlG.add(ring);
      // the belly's two dark seams, as drawn
      for (const [y, r] of [[0.4 * HB, 2.53], [2.08 * HB, 2.58]]) bowlG.add(new Mesh(revG([[r, y - 0.03], [r + 0.03, y], [r, y + 0.03]], 96, (th) => FACE12(th)), copperD));
    }
    // the spouts: eleven lower ones round the belly (y 1.0), the upper one above them toward the east (y 2.25), each in the middle of a
    // face; a short pipe out and a little down, its tap a small handle across it (brass)
    const SPOUTS = [];
    {
      const gs = new CylinderGeometry(0.06, 0.085, 0.5, 8); gs.rotateX(Math.PI / 2); gs.translate(0, 0, 0.25);
      const gd = new CylinderGeometry(0.05, 0.06, 0.18, 8); gd.translate(0, -0.08, 0.48);
      const gt = new CylinderGeometry(0.028, 0.028, 0.24, 6); gt.translate(0, 0.12, 0.3);
      const gk = new BoxGeometry(0.24, 0.045, 0.045); gk.translate(0, 0.25, 0.3);
      const geo = mergeGeometries([gs, gd, gt, gk].map((q) => { q.deleteAttribute("uv"); return q; }));
      const inst = new InstancedMesh(geo, new MeshStandardMaterial({ color: 0xc89a3c, roughness: 0.3, metalness: 0.85 }), 12);
      const m42 = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(1, 1, 1);
      for (let i = 0; i < 12; i++) {
        const upper = i === 0, a = upper ? Math.PI / 2 : Math.PI / 2 + (i * Math.PI * 2) / 12;   // the upper toward +x (east); the eleven in the other faces
        const y = upper ? 2.25 * HB : 1.0 * HB, r = upper ? 2.42 : 2.5;
        e.set(0.12, a, 0, "YXZ");
        q.setFromEuler(e);
        p.set(Math.sin(a) * r, y, Math.cos(a) * r);
        m42.compose(p, q, s);
        inst.setMatrixAt(i, m42);
        SPOUTS.push({ a, y, r, upper });
      }
      inst.castShadow = true;
      bowlG.add(inst);
    }
    // SPOUT_211_K (fix-k, 23.11.2026 - the user's decision 211 b, via the coordinator: "בבית שני מנמיכים את הדדים לגובה המותניים, בערך
    // 1.5 אמות מעל רצפת עזרת כהנים, כבחירת מודל"; until now the mouths 3.16 over the floor, the upper one 4.58 - over the head of a man
    // stooping at them): from each spout's mouth a short copper pipe down beside the laver and its base, and at its foot a bend outward
    // and a nozzle - the water comes out there, PIPE_Y over the court's floor, level and outward (kiyorInfo: the mouths). The laver, its
    // base, the well and the machine are as they were; the pipes are the laver's and go with it into the well. Their form and height -
    // a model choice (the card: "גובה הדדים — בחירת מודל")
    const PIPE_Y = 1.5, PIPE_RB = 0.12, PIPE_NZ = 0.07;   // over the floor (amot); the bend's radius and the nozzle's length (the laver's own units)
    const pipeTop = (o) => ({ r: o.r + 0.456, y: o.y - 0.226 });   // the spout's own nozzle's foot (gd, turned down 0.12 with the spout)
    const pipeFoot = (s) => (PIPE_Y - (KEN_H - 0.15)) / s;          // the pipe's foot in the laver's own frame (its foot on the base at F + KEN_H - 0.15)
    const pipeMouth = (o, s) => ({ r: pipeTop(o).r + PIPE_RB + PIPE_NZ, y: pipeFoot(s) });
    const pipeI = new InstancedMesh((() => { const q = new CylinderGeometry(0.042, 0.042, 1, 8, 1, true); q.translate(0, -0.5, 0); q.deleteAttribute("uv"); return q; })(), copperM, 12);
    const bendI = new InstancedMesh((() => {
      // a quarter ring from straight down to level outward (+z), centre (0, RB, RB) - the torus' plane (x, y) turned onto (z, y) - then the nozzle
      const t = new TorusGeometry(PIPE_RB, 0.042, 6, 8, Math.PI / 2); t.applyMatrix4(new Matrix4().makeBasis(new Vector3(0, 0, -1), new Vector3(0, -1, 0), new Vector3(-1, 0, 0))); t.translate(0, PIPE_RB, PIPE_RB);
      const n = new CylinderGeometry(0.046, 0.038, PIPE_NZ, 8, 1, true); n.rotateX(Math.PI / 2); n.translate(0, 0, PIPE_RB + PIPE_NZ / 2);
      return mergeGeometries([t, n].map((q) => { q.deleteAttribute("uv"); return q; }));
    })(), copperM, 12);
    pipeI.castShadow = bendI.castShadow = true;
    pipeI.name = "kiyorPipes"; bendI.name = "kiyorPipeMouths";
    bowlG.add(pipeI, bendI);
    const pipesAt = (s) => {   // (the size changes the laver's scale - the pipes' feet stay PIPE_Y over the floor)
      const m4 = new Matrix4(), qq = new Quaternion(), pp = new Vector3(), sc = new Vector3();
      SPOUTS.forEach((o, i) => {
        const T = pipeTop(o), yb = pipeFoot(s), L = Math.max(0.01, T.y - (yb + PIPE_RB));
        qq.setFromAxisAngle(new Vector3(0, 1, 0), o.a);
        pp.set(Math.sin(o.a) * T.r, T.y, Math.cos(o.a) * T.r); sc.set(1, L, 1); m4.compose(pp, qq, sc); pipeI.setMatrixAt(i, m4);
        pp.set(Math.sin(o.a) * T.r, yb, Math.cos(o.a) * T.r); sc.set(1, 1, 1); m4.compose(pp, qq, sc); bendI.setMatrixAt(i, m4);
      });
      pipeI.instanceMatrix.needsUpdate = bendI.instanceMatrix.needsUpdate = true;
      pipeI.computeBoundingSphere(); bendI.computeBoundingSphere();
    };
    // MOCHANI_RAMBAM_211 (the user, 15.11.2026 23:45: "תוסיף את זה כמתג שיטה לכיור"): the Rambam's מוכני - "עשה כלי סביב לכיור, והיו בו
    // המים תמיד, והיו שותתין מאותו כלי לכיור כדי הצורך ראשון ראשון, ואותו הכלי היה נקרא מוכני" (his commentary on Yoma 3, quoted by the
    // Kesef Mishneh, Beit HaBechirah 3:18, 4260:166), "כלי על הכיור להיות מלא מים, והיה סביב לכיור" (on Tamid 1:4, 575:10), "ומוכני עשו לו
    // שיהיו בה המים תמיד, והיא חול" (Beit HaBechirah 3:18, 337:60); the Kesef Mishneh: "כלי עגול כגלגל סביבות הכיור, שהיה הכיור משוקע
    // בתוכו". A round trough about the laver's upper part, open above, with its water, and one short pipe from it over the laver's rim. It
    // goes with the laver (the Even HaAzel, 4466:45: "שהי' כלי סביב ושהיו משקעין אותו הכלי"). Its form, size, height and material: model
    // choice. Shown only when the row "המוכני של הכיור" stands on the Rambam (ctx.shared.mochani.set).
    const mochR = new Group();
    mochR.visible = false;
    bowlG.add(mochR);
    {
      const cm = tm_copper(0x8c5a3c, 0.45, { metalness: 0.45 }); cm.side = DoubleSide;   // COPPER_C (fix-c): the Rambam's mochani, a copper vessel - the book's copper (until now 0x8c5a3c)
      H2.lathe(mochR, [[2.72, 3.05], [2.72, 1.85], [3.35, 1.85], [3.35, 3.05], [3.25, 3.05], [3.25, 1.95], [2.82, 1.95], [2.82, 3.05], [2.72, 3.05]], cm, 0, 0, 0, 48);
      const ring = new Mesh(new RingGeometry(2.82, 3.25, 48), tm_water(new MeshStandardMaterial({ color: 3104873, roughness: 0.15, metalness: 0.1, side: DoubleSide }), { scale: 0.35 }));   // WATER_420
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 2.8;
      mochR.add(ring);
      const pipe = new Mesh(new CylinderGeometry(0.06, 0.06, 0.75, 10), cm);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(-2.47, 2.98, 0);
      mochR.add(pipe);
      const noz = new Mesh(new CylinderGeometry(0.05, 0.075, 0.22, 10), cm);
      noz.position.set(-2.12, 2.87, 0);
      mochR.add(noz);
    }
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.mochaniRambam = mochR;
    ctx2.shared.mochani = {
      mode: "rashi",
      set(m) { this.mode = m === "rambam" ? "rambam" : "rashi"; mochR.visible = this.mode === "rambam"; return this.mode; }
    };
    // the base (KIYOR_CHALAMISH_A2): tall, ribbed and faced like a barrel - "חבית על גבי חבית" - its top holding the laver's foot; scaled
    // with the laver in x and z
    const kenG = new Group();
    kenG.position.set(KX, F, KZK);
    g.add(kenG);
    {
      const RIB = (th, v) => (v >= 4 && v <= 9 ? 1 + 0.06 * Math.pow(Math.abs(Math.cos(th * 12)), 0.6) : 1) * FACE12(th);   // twenty-four staves standing out
      const prof = [[0.01, 0], [1.66, 0], [1.72, 0.1], [1.6, 0.2], [1.62, 0.3], [1.7, 0.65], [1.76, 1.05], [1.76, 1.45], [1.7, 1.8], [1.62, 2.04], [1.6, 2.1], [1.72, 2.16], [1.72, 2.26], [1.42, KEN_H], [0.01, KEN_H]];
      const b = new Mesh(revG(prof, 192, RIB), copperM); b.castShadow = b.receiveShadow = true; kenG.add(b);
      kenG.add(new Mesh(revG([[1.62, 0.22], [1.7, 0.25], [1.62, 0.28]], 48, () => FACE12(0.3)), copperD));
    }
    // the well's mouth and lid (KIYOR_CHALAMISH_A2, as drawn in B-02 / B-11): a stone slab over the curb with a round mouth, and a round
    // lid of cedar boards with two battens and an iron ring; it slides off to the west in the evening (the demonstration)
    const MOUTH = 2.85;
    {
      const sh = new Shape(); const hw = KPIT.w / 2 + 0.3, hd = KPIT.d / 2 + 0.3;
      sh.moveTo(-hw, -hd); sh.lineTo(hw, -hd); sh.lineTo(hw, hd); sh.lineTo(-hw, hd); sh.lineTo(-hw, -hd);
      const hole = new Path(); hole.absarc(0, 0, MOUTH, 0, Math.PI * 2, true); sh.holes.push(hole);
      const sg = new ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: false, curveSegments: 40 }); sg.rotateX(-Math.PI / 2);
      const slab = new Mesh(sg, M2.stoneSmooth); slab.position.set(PITX, F, PITZ); slab.castShadow = slab.receiveShadow = true; g.add(slab);
    }
    const lidG = new Group();
    g.add(lidG);
    {
      const LR = MOUTH + 0.25;
      const disk = new Mesh(new CylinderGeometry(LR, LR, 0.14, 40), M2.cedar); disk.position.y = 0.07; disk.castShadow = disk.receiveShadow = true; lidG.add(disk);
      for (let i = -2; i <= 2; i++) { const sl = new Mesh(new BoxGeometry(0.03, 0.02, 2 * Math.sqrt(LR * LR - (i * LR / 3) ** 2) - 0.1), new MeshStandardMaterial({ color: 0x4a2e18, roughness: 1 })); sl.position.set(i * LR / 3 + LR / 6, 0.145, 0); lidG.add(sl); }   // the boards' joints
      for (const dx of [-LR / 2.2, LR / 2.2]) { const c = new Mesh(new BoxGeometry(0.24, 0.07, 2 * Math.sqrt(LR * LR - dx * dx) - 0.3), M2.cedar); c.position.set(dx, 0.175, 0); lidG.add(c); }
      const rg = new Mesh(new TorusGeometry(0.22, 0.035, 6, 16), M2.bronze); rg.rotation.x = Math.PI / 2; rg.position.set(0, 0.22, 0); lidG.add(rg);
    }
    const LID0 = new Vector3(PITX, F + 0.3, PITZ), LID1 = new Vector3(PITX - KPIT.w - 0.6, F, PITZ + 0.6);
    lidG.position.copy(LID0);
    // the crane (KIYOR_CHALAMISH_A2: "מסגרת עץ כמו גרדום, עם גלגלות, גלגלי שיניים וידית" - B-02, B-11, B-22): two cedar posts with a cap,
    // on the line between the base and the well, west of them; the arm, with its brace, turns on the cap (decision 59) - a pulley at its
    // root and one at its end; between the posts a windlass at the height of a man's hands - the drum with the rope wound on it, a
    // TOOTHED WHEEL on its south end with a wooden tongue knocking on its teeth (decision 57: "קול דפיקת שיני הגלגל"), and a crank on its
    // north end. Measures and the wheels' colour (as drawn) - model choices.
    const AY = F + 9.4, PSX = KX - 4.6, PSZ = (KZK + PITZ) / 2;
    const ARM = Math.hypot(KX - PSX, KZK - PSZ);
    const angTo = (x, z) => Math.atan2(-(z - PSZ), x - PSX);
    const TH_K = angTo(KX, KZK), TH_P = angTo(PITX, PITZ);
    const pulMat = new MeshStandardMaterial({ color: 0x9c8cb0, roughness: 0.55 });
    const WY = F + 2.7, PZ = 0.55;   // the windlass's axle (along z); the posts at PSZ +-PZ
    {
      for (const sz of [-1, 1]) {
        H2.box(g, 0.4, AY - F - 0.2, 0.36, M2.cedar, PSX, F, PSZ + sz * PZ);
        H2.box(g, 2.2, 0.32, 0.4, M2.cedar, PSX, F, PSZ + sz * PZ);                          // its foot
        const st = new Mesh(new BoxGeometry(0.2, 1.3, 0.2), M2.cedar); st.position.set(PSX + 0.65, F + 0.5, PSZ + sz * PZ); st.rotation.z = 0.75; st.castShadow = true; g.add(st);
        const st2 = st.clone(); st2.position.x = PSX - 0.65; st2.rotation.z = -0.75; g.add(st2);
      }
      H2.box(g, 0.5, 0.36, 2 * PZ + 0.7, M2.cedar, PSX, AY - 0.56, PSZ);                    // the cap
      H2.box(g, 0.3, 0.26, 2 * PZ + 0.36, M2.cedar, PSX, WY + 1.25, PSZ);                   // a cross bar over the windlass
      H2.box(g, 2.4, 0.3, 2.4, M2.stoneSmooth, PSX, F - 0.1, PSZ);
    }
    const armG = new Group();
    armG.position.set(PSX, AY, PSZ);
    g.add(armG);
    {
      const arm = new Mesh(new BoxGeometry(ARM + 0.9, 0.36, 0.32), M2.cedar); arm.position.set(ARM / 2 + 0.05, 0, 0); arm.castShadow = true; armG.add(arm);
      const collar = new Mesh(new CylinderGeometry(0.34, 0.34, 0.5, 12), M2.cedar); collar.position.y = -0.38; armG.add(collar);
      const br2 = new Mesh(new BoxGeometry(2.5, 0.22, 0.22), M2.cedar); br2.position.set(0.95, -0.85, 0); br2.rotation.z = 0.72; br2.castShadow = true; armG.add(br2);
      for (const x of [0.25, ARM]) {
        const pl = new Mesh(new CylinderGeometry(0.44, 0.44, 0.16, 20), pulMat); pl.rotation.x = Math.PI / 2; pl.position.set(x, 0.42, 0); armG.add(pl);
        const hub = new Mesh(new CylinderGeometry(0.1, 0.1, 0.24, 10), M2.cedar); hub.rotation.x = Math.PI / 2; hub.position.set(x, 0.42, 0); armG.add(hub);
        for (const sz of [-1, 1]) { const ch = new Mesh(new BoxGeometry(0.5, 0.5, 0.06), M2.cedar); ch.position.set(x, 0.3, sz * 0.13); armG.add(ch); }   // its cheeks
      }
    }
    // the windlass: wheelG turns about the axle (z)
    const drumG = new Group();
    drumG.position.set(PSX, WY, PSZ);
    g.add(drumG);
    const wheelG = new Group();
    drumG.add(wheelG);
    {
      const ax = new Mesh(new CylinderGeometry(0.07, 0.07, 2 * PZ + 1.3, 8), M2.cedar); ax.rotation.x = Math.PI / 2; wheelG.add(ax);
      const drum = new Mesh(new CylinderGeometry(0.3, 0.3, 2 * PZ - 0.42, 14), M2.cedar); drum.rotation.x = Math.PI / 2; wheelG.add(drum);
      const coilM = new MeshStandardMaterial({ color: 0x8a6a3e, roughness: 1 });
      for (let k = 0; k < 7; k++) { const c = new Mesh(new TorusGeometry(0.34, 0.045, 6, 16), coilM); c.position.z = -PZ + 0.3 + k * ((2 * PZ - 0.6) / 6); wheelG.add(c); }   // the rope wound on it
      // the toothed wheel (south, outside the post) and its teeth
      const GZ = PZ + 0.38;
      const gw = new Mesh(new CylinderGeometry(0.62, 0.62, 0.16, 28), M2.gold); gw.rotation.x = Math.PI / 2; gw.position.z = GZ; wheelG.add(gw);   // GEAR_GOLD_441 (the user 25.11.2026: "צבע גלגל השינים במוכני - זהב"): the toothed wheel and its teeth golden
      const tg = new BoxGeometry(0.14, 0.2, 0.16), ti = new InstancedMesh(tg, M2.gold, 20), m4t = new Matrix4(), qt = new Quaternion(), et = new Euler(), pt = new Vector3(), st = new Vector3(1, 1, 1);
      for (let k = 0; k < 20; k++) { const a = (k * Math.PI * 2) / 20; et.set(0, 0, a); qt.setFromEuler(et); pt.set(-Math.sin(a) * 0.7, Math.cos(a) * 0.7, GZ); m4t.compose(pt, qt, st); ti.setMatrixAt(k, m4t); }
      wheelG.add(ti);
      // the crank (north, outside the post): its arm and handle
      const CZ = -PZ - 0.36;
      const ca = new Mesh(new BoxGeometry(0.12, 0.75, 0.1), M2.cedar); ca.position.set(0, -0.33, CZ); wheelG.add(ca);
      const ch = new Mesh(new CylinderGeometry(0.055, 0.055, 0.42, 8), new MeshStandardMaterial({ color: 0x3a2a20, roughness: 0.8 })); ch.rotation.x = Math.PI / 2; ch.position.set(0, -0.68, CZ - 0.2); wheelG.add(ch);
    }
    const tongue = new Group();   // pivoted on the post over the toothed wheel; its tip rides the teeth
    tongue.position.set(PSX, WY + 1.08, PSZ + PZ + 0.38);
    g.add(tongue);
    { const t = new Mesh(new BoxGeometry(0.1, 0.42, 0.12), M2.cedar); t.position.y = -0.17; t.rotation.z = 0.25; tongue.add(t); const pv = new Mesh(new BoxGeometry(0.16, 0.16, 0.3), M2.cedar); pv.position.z = -0.12; tongue.add(pv); }
    // the rope: up from the drum to the post's head, along the arm, and down from its end to the laver's four chains
    const ropeMat = new MeshStandardMaterial({ color: 0x8a6a3e, roughness: 1 });
    const mkRope = (r) => { const m = new Mesh(new CylinderGeometry(r, r, 1, 6), ropeMat); g.add(m); return m; };
    const ropeUp = mkRope(0.045), ropeArm = mkRope(0.045), ropeDown = mkRope(0.045), chains = [0, 1, 2, 3].map(() => mkRope(0.03));
    const UPV = new Vector3(0, 1, 0), pa = new Vector3(), pb = new Vector3();
    const span = (m, a, b) => { const L = Math.max(0.05, a.distanceTo(b)); m.scale.set(1, L, 1); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(UPV, pb.copy(b).sub(a).normalize()); };
    // the size (decision 73 / 81)
    const SIZES = { d4: 4, d3: 3, d525: 5.25 };
    const K = { s: 4 / 5.25, th: TH_K, foot: F + KEN_H - 0.15, d: 0 };
    const place = () => {
      const x = PSX + Math.cos(K.th) * ARM, z = PSZ - Math.sin(K.th) * ARM;
      kiyorG.position.set(0, 0, 0);
      bowlG.position.set(x, K.foot, z);
      bowlG.scale.setScalar(K.s);
      armG.rotation.y = K.th;
      // KIYOR_CHALAMISH_A2: the rope from the drum up between the posts to the root pulley, along the arm, over the end pulley and down
      // to the ring on the lid's knob (one rope, as drawn; the four chains are gone)
      const hook = K.foot + (LAVER_TOP + 0.1) * K.s, rx = PSX + Math.cos(K.th) * 0.25, rz = PSZ - Math.sin(K.th) * 0.25;
      span(ropeUp, pa.set(PSX + 0.3, WY, PSZ), pb.set(rx + 0.3 * Math.cos(K.th + Math.PI / 2) * 0, AY + 0.42, rz).clone());
      span(ropeArm, new Vector3(rx, AY + 0.86, rz), new Vector3(x, AY + 0.86, z));
      span(ropeDown, new Vector3(x + Math.cos(K.th) * 0.44, AY + 0.42, z - Math.sin(K.th) * 0.44), new Vector3(x, hook, z));
      chains.forEach((c) => { c.visible = false; });
    };
    ctx2.shared.kiyorSize = {
      mode: "d4",
      set(m) {
        this.mode = SIZES[m] ? m : "d4";
        K.s = SIZES[this.mode] / 5.25;
        pipesAt(K.s);   // SPOUT_211_K
        kenG.scale.set(K.s * 1.1, 1, K.s * 1.1);   // its mouth (1.36) holds the laver's foot (1.7 of the laver's own size)
        place();
        return this.mode;
      }
    };
    ctx2.shared.kiyorInfo = () => {   // the laver as it stands ON ITS BASE (the priests' spots are by it there)
      const c = { x: KX, z: KZK }, s = K.s, foot = F + KEN_H - 0.15;
      return { R: KR0 * s, H: LAVER_H * s, foot, x: c.x, z: c.z, onBase: K.d < 0.01,
        // SPOUT_211_K: the water's mouth - the nozzle at the pipe's foot, PIPE_Y over the floor (until now the spout's own, (o.r + 0.6, o.y - 0.18))
        spouts: SPOUTS.map((o) => { const M = pipeMouth(o, s), rr = M.r * s; return { a: o.a, upper: o.upper, p: [c.x + Math.sin(o.a) * rr, foot + M.y * s, c.z + Math.cos(o.a) * rr] }; }) };
    };
    // the way from the base to the well: u 0..1 - lift (0..0.15), swing (0.15..0.45), lower into the water (0.45..1)
    const DROP = 5.6, LIFT = 1.2;
    const setDrop = (d) => {
      const u = Math.max(0, Math.min(1, d / DROP)), base = F + KEN_H - 0.15, sunk = F - 1.0 - (LAVER_H + 0.3) * K.s;
      K.d = d;
      if (u <= 0.15) { K.th = TH_K; K.foot = base + LIFT * (u / 0.15); }
      else if (u <= 0.45) { const v = (u - 0.15) / 0.3, w = 0.5 - 0.5 * Math.cos(Math.PI * v); K.th = TH_K + (TH_P - TH_K) * w; K.foot = base + LIFT; }
      else { const v = (u - 0.45) / 0.55; K.th = TH_P; K.foot = base + LIFT + (sunk - base - LIFT) * v; }
      place();
      // the wheel winds by the rope's length; the tongue knocks on each tooth
      const ang = (K.foot - base) / 0.34;
      wheelG.rotation.z = ang;
      tongue.rotation.z = -0.16 * (((Math.abs(ang) * 20) / (Math.PI * 2)) % 1);
      // the lid: off while the laver is not on its base
      const lo = Math.min(1, u / 0.06);
      lidG.position.lerpVectors(LID0, LID1, lo);
      lidG.position.y = lo > 0 && lo < 1 ? F + 0.3 + 0.25 * Math.sin(Math.PI * lo) : lo >= 1 ? F + 0.02 : F + 0.3;
    };
    ctx2.shared.kiyorSize.set("d4");   // decision 81: across four - the default
    setDrop(0);
    // the demonstration's captions (layers mukhniEve / mukhniNight / mukhniMorning)
    const capG = { eve: new Group(), night: new Group(), morning: new Group() };
    for (const k of Object.keys(capG)) { capG[k].visible = false; g.add(capG[k]); }
    ctx2.layers.mukhniEve = capG.eve; ctx2.layers.mukhniNight = capG.night; ctx2.layers.mukhniMorning = capG.morning;
    ctx2.labels.push(
      { text: "בערב: מסירים את המכסה, והזרוע מרימה את הכיור מן הכן ומשקיעה אותו בבור — ״שלא יהיו מימיו נפסלין בלינה״ (יומא ג, י)", x: KX, y: F + 10.6, z: PSZ, size: 1.3, layer: "mukhniEve", info: "הכיור והמוכני — הפירוט בכרטיס של הכיור.", refs: [["יומא ג, י", "Mishnah_Yoma.3.10"]] },
      { text: "בלילה: מי הכיור מחוברים במי הבור", x: KX, y: F + 10.6, z: PSZ, size: 1.3, layer: "mukhniNight" },
      { text: "בבוקר: ״קול העץ שעשה בן קטין מוכני לכיור, והן אומרים הגיע עת״ (תמיד א, ד) — הכיור עולה וחוזר אל הכן", x: KX, y: F + 10.6, z: PSZ, size: 1.3, layer: "mukhniMorning", info: "הכיור והמוכני — הפירוט בכרטיס של הכיור.", refs: [["תמיד א, ד", "Mishnah_Tamid.1.4"]] },
      { text: "המוכני — גלגל השיניים ולשון העץ", x: PSX, y: F + 4.2, z: PSZ - 1.2, size: 1.1, info: "המוכני — ״גלגל שתלוי בו הכיור בחבל, ועל ידו משקעין הכיור להבאר שתחת הכיור״ (יכין תמיד פרק א, אות נז); ״וכשמעלין או מורידין אותו להבאר, היה קול דפיקת שיני הגלגל נשמע עד יריחו״ (יכין תמיד פרק ג, אות סא). הפירוט בכרטיס הכיור.", refs: [["יכין תמיד פרק א, אות נז", { book: 818, index: 116 }], ["יכין תמיד פרק ג, אות סא", { book: 818, index: 330 }]] },
      { text: "הכן — ״כעין יורה כפוייה על פיה״ (תוספות זבחים כב.)", x: KX + 2.6, y: F + 1.0, z: KZK - 2.4, size: 0.9, info: "הכיור והמוכני — הפירוט בכרטיס של הכיור.", refs: [["תוספות זבחים כב.", { book: 1936, index: 254 }]] },
      { text: "הבור — ביום מכוסה, בלי גדר", x: PITX + 1.5, y: F + 1.0, z: PITZ + 2.2, size: 0.9, info: "הבור שתחת הכיור — ״להבאר שתחת הכיור״ (יכין תמיד פרק א, אות נז). המכסה, והיותו בלי גדר — בחירת מודל; הפירוט בכרטיס הכיור.", refs: [["יכין תמיד פרק א, אות נז", { book: 818, index: 116 }]] }
    );
    ctx2.labels.push({ text: "המוכני לרמב״ם — כלי סביב הכיור, ובו המים (בית הבחירה ג, יח)", x: KX - 1, y: F + 6.2, z: KZK, size: 1.0, layer: "mochaniRambam" });
    const T_DOWN = 7000, T_NIGHT = 2500, T_UP = 7000, T_PRE = 1500;
    const M = ctx2.shared.mukhni = {
      t0: -1, drop: 0, held: -1,
      demo() { this.held = -1; this.t0 = performance.now(); },
      // MUKHNI_PAUSE_G16: the demonstration pauses, resumes from the same second and restarts (the pause bar, shared/90-entry.js, shows only for an entry that has pause())
      pause() { if (this.t0 >= 0 && this.held < 0) this.held = performance.now(); },
      resume() { if (this.t0 >= 0 && this.held >= 0) { this.t0 += performance.now() - this.held; this.held = -1; } },
      paused() { return this.held >= 0; },
      stop() { this.held = -1; this.t0 = -1; setDrop(0); this.drop = 0; for (const k of Object.keys(capG)) capG[k].visible = false; },
      pose(d, ph) { this.held = -1; this.t0 = -1; setDrop(d); this.drop = d; for (const k of Object.keys(capG)) capG[k].visible = k === ph; }   // a still frame (checks, the tour)
    };
    // MUKHNI_EXEDRA_452 (the user 26.11.2026, a picture: "הדגמה המוכני נתקע באכסדרה"): in the Bartenura's reading of the court's exedras
    // (columns and a covering) the covering passes between the demonstration's eye and the laver - while it runs, the exedras are put out
    // of sight, and come back as they were when it ends (as the chambers' open fronts do, 30-courts.js crt-south-front)
    { let exOff = false;
      const exSet = (off) => { for (const nm of ["exedraRambam", "exedraBartenura"]) { const o = ctx2.root && ctx2.root.getObjectByName(nm); if (!o) continue;
        if (off) { o.userData.mkVis = o.visible; o.visible = false; } else if (o.userData.mkVis !== undefined) { o.visible = o.userData.mkVis; delete o.userData.mkVis; } } };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { const want = M.t0 >= 0; if (want !== exOff) { exOff = want; exSet(want); } }); }
    (ctx2.shared.demoStops || (ctx2.shared.demoStops = [])).push({ id: "alt-mukhni-demo", running: () => M.t0 >= 0, stop: () => M.stop(),
      pause: () => M.pause(), resume: () => M.resume(), paused: () => M.paused(), restart: () => M.demo() });   // 1.9.2; MUKHNI_PAUSE_G16
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    // KIYOR_VIEW_S2 (the user: "מבט לא נכון. לדעתי צריך מהכיוון השני, לראות גם את הכיור וגם את המוכני"): from the south-west - the toothed
    // wheel (on the windlass's south side), the well and the laver all seen; until now from the north-east, the wheel behind the laver
    // MUKHNI_TOP_N4 (the user, 24.11.2026: "מבט יותר מלמעלה, שיראו את כל הכיור ואת כל המוכני - גלגל, גלגלת, עמודים, חבל"): from the north-west and high above, the whole
    // laver at its base and in the well, and the wheel, its posts and the rope in one frame
    ctx2.shared.flyPoints.mukhniDemo = { pos: [KX + 14, F + 10.5, KZK - 7.2], target: [KX - 1.5, F + 4, KZK + 0.8] };   // KIYOR_SIDE_420 (the user 24.11.2026: "כיור לא מלמעלה - לא יראו את הכיור!"): from the south-east, a little above - the laver whole, the windlass and the well's cover
    {
      const MB = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
      const anc = [PSX, AY + 2.4, PSZ];
      MB.push({
        id: "alt-mukhni-demo", label: "הדגמה: הכיור יורד לבור ועולה", labelOn: "עצור את ההדגמה", maxDist: 120,
        title: "המוכני של בן קטין: בערב מסירים את מכסה הבור, והזרוע מרימה את הכיור מן הכן ומשקיעה אותו בבור, ״שלא יהיו מימיו נפסלין בלינה״ (יומא ג, י); בבוקר הוא עולה וחוזר אל הכן. צורת המכונה, הבור ומספר החבלים — בחירת מודל.",
        anchor: () => anc,
        get: () => M.t0 >= 0,
        set: (on) => {
          if (!on) { M.stop(); return; }
          M.demo();
          const f = ctx2.shared.flyPoints.mukhniDemo, fly = ctx2.ui && typeof ctx2.ui.fly === "function" ? ctx2.ui.fly : null;
          if (fly) fly(f.pos, f.target);
        }
      });
    }
    ctx2.animated.push(() => {
      if (M.t0 < 0 || M.held >= 0) return;
      const e = (performance.now() - M.t0) / (ctx2.shared.demoSlow || 1.5);
      let d = 0, ph = "eve";
      if (e < T_PRE) { d = 0; ph = "eve"; }
      else if (e < T_PRE + T_DOWN) { const u = (e - T_PRE) / T_DOWN; d = DROP * u; ph = "eve"; }
      else if (e < T_PRE + T_DOWN + T_NIGHT) { d = DROP; ph = "night"; }
      else if (e < T_PRE + T_DOWN + T_NIGHT + T_UP) { const u = (e - T_PRE - T_DOWN - T_NIGHT) / T_UP; d = DROP * (1 - u); ph = "morning"; }
      else if (e < T_PRE + T_DOWN + T_NIGHT + T_UP + 3000) { d = 0; ph = "morning"; }
      else { M.stop(); return; }
      // SOUNDS_300: Ben Katin's wooden wheel as each motion begins, and a splash as the laver goes into the water and comes out
      try {
        const SH = ctx2.shared, slow = SH.demoSlow || 1.5, TU = T_PRE + T_DOWN + T_NIGHT, wetD = DROP * (0.45 + 0.55 * ((F + KEN_H - 0.15 + LIFT) - (F - 0.8)) / ((F + KEN_H - 0.15 + LIFT) - (F - 1.1 - LAVER_H * K.s)));
        if (M.sndT0 !== M.t0) { M.sndT0 = M.t0; M.sndE = null; }
        const e0 = M.sndE;
        M.sndE = e;
        if (e0 != null && e > e0 && e - e0 < 1000 && typeof SH.sfx === "function") {
          if (e0 < T_PRE && e >= T_PRE) SH.sfx("wheel", { dur: T_DOWN * slow / 1000 });
          if (e0 < TU && e >= TU) SH.sfx("wheel", { dur: T_UP * slow / 1000 });
          if ((M.drop < wetD && d >= wetD) || (M.drop > wetD && d <= wetD)) SH.sfx("water", { dur: 1.2 });
        }
      } catch (_) {}
      M.drop = d;
      setDrop(d);
      for (const k of Object.keys(capG)) capG[k].visible = k === ph;
    });
    let ringsInst = null;   // 1.9.2: the 24 rings' instance (R. Yose's single row, the place switch below)
    {
      // 1.0.31: the 24 slaughter rings (Middot 3:5) STAND upright (the ring's plane is vertical), buried in the ground at the bottom with most of the ring above ground;
      // the animal's head is put through the ring. Before 1.0.31 they lay flat (rotateX) - wrong. Ring: inner radius 0.5 amah, tube 0.09; ~20% of the ring is below the floor.
      const geo = new TorusGeometry(0.5, 0.09, 8, 24);
      const inst = new InstancedMesh(geo, M2.bronze, 24);
      const m42 = new Matrix4();
      // RINGS_305 (the user, 20.11.2026 01:25 / 01:30): the arrangement - "ששה סדרים של ארבע ארבע" (the first Tanna, the default: six
      // rows north-south, four rings in each - each order one row, as Rabbeinu Shemaya: "היו הטבעות בשורה אחת ובכל סדר ארבעה טבעות") or
      // "ויש אומרים, ארבעה של שש שש" (four rows of six) - both in the rings' 24 amot (Middot 5:2; 1.5.0: z -39..-15, 8 from the altar
      // at -7, Rambam 5:14-15); the row "סידור הטבעות" (sh62). R. Yose's place (the switch below) keeps its single row of six.
      let ringsMode = "six4", ringsOne = false;
      const ringsApply = () => {
        const zero = new Matrix4().makeScale(0, 0, 0);
        let k = 0;
        if (ringsOne) { for (let i = 0; i < 24; i++) { if (i < 6) { m42.makeTranslation(42 + i * 4, F + 0.35, -42); inst.setMatrixAt(k++, m42); } else inst.setMatrixAt(k++, zero); } }
        else if (ringsMode === "four6") { for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) { m42.makeTranslation(42 + i * 20 / 3, F + 0.35, -17 - j * 4); inst.setMatrixAt(k++, m42); } }
        else { for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { m42.makeTranslation(42 + i * 4, F + 0.35, -18 - j * 6); inst.setMatrixAt(k++, m42); } }
        inst.instanceMatrix.needsUpdate = true;
        inst.computeBoundingSphere();
      };
      ringsApply();
      ctx2.shared.ringsLayout = {
        get current() { return ringsMode; },
        set(m) { ringsMode = m === "four6" ? "four6" : "six4"; ringsApply(); return ringsMode; },
        one(b) { ringsOne = !!b; ringsApply(); }
      };
      inst.castShadow = inst.receiveShadow = true;
      g.add(inst);
      ringsInst = inst;
    }
    // 1.9.2: the tables, the pillars, their beams and hooks in one group - R. Yose's reading moves it north with his single row of rings
    const slaughterG = new Group();
    slaughterG.name = "slaughter-place";
    g.add(slaughterG);
    const colXs = [43.5, 49, 54.5, 60];
    const tbl2 = new Group();   // 1.9.2: the eight tables in two rows (the Ra'avyah's and the Gra's single row has its own, below)
    slaughterG.add(tbl2);
    {
      const slab = H2.uvWorldBox(new BoxGeometry(2, 0.25, 1.5), 2, 0.25, 1.5);
      slab.translate(0, 0.875, 0);
      const leg = H2.uvWorldBox(new BoxGeometry(0.18, 0.75, 0.18), 0.18, 0.75, 0.18);
      leg.translate(0, 0.375, 0);
      const slabs = new InstancedMesh(slab, M2.marble, 8);
      const legs = new InstancedMesh(leg, M2.marble, 32);
      const m42 = new Matrix4();
      let a = 0, b = 0;
      for (const tz of [-41.5, -44.5]) for (const tx of colXs) {   // 1.5.0: the tables' place -47..-39 (Rambam 5:14)
        m42.makeTranslation(tx, F, tz);
        slabs.setMatrixAt(a++, m42);
        for (const sx of [-0.8, 0.8]) for (const sz of [-0.55, 0.55]) {
          m42.makeTranslation(tx + sx, F, tz + sz);
          legs.setMatrixAt(b++, m42);
        }
      }
      slabs.castShadow = slabs.receiveShadow = true;
      legs.castShadow = legs.receiveShadow = true;
      tbl2.add(slabs);
      tbl2.add(legs);
    }
    const nanZs = [-52.5, -55.5];
    // 1.9.2 (the user: "תוסיף כפתור לאונקליות ו3 השיטות שיש בבית ראשון"): THE PILLARS AND THEIR HOOKS in the three layouts of the First
    // Temple plugin (its 30-courts.js, CRT_SLAUGHTER), one switch - ctx2.shared.slaughterLayout, the row "בית המטבחים" of the opinions table
    // (each quote checked in the library):
    //   "bartenura" (the default) - a squared piece of cedar on each pillar (Bartenura on Middot 3:5: "חתיכות מרובעות של ארז היו על
    //      העמודים"), the iron hooks in it in three rows one above the other; on its east, north and south faces and none on the west (the
    //      Ra'avyah in Tosafot Yom Tov there);
    //   "meiri" - short cedar beams from pillar to pillar along each row (the Meiri on Middot 3:5: "כעין קורות קצרות באים מעמוד לעמוד"),
    //      the hooks "בשני הצדדים ושטח התחתון";
    //   "oneRow" - the Ra'avyah ("אלא כל דממזרח למערב עמודים ח'. שלחנות שמנה") and the Gra on Middot 5:2 ("נמצא היו ז' אוירים וכנגד כל
    //      אויר היה שולחן... ושולחן הח' הי' עמוד אצל הננס שבקצה מבחוץ"): eight pillars in one east-west row, a table in each gap and the
    //      eighth beyond the east end.
    // Until 1.9.2: round pillars four high, one long beam over each row and hooks on both (the user's original plugin). Now: stone 1.4 and
    // cedar 2.6, the hooks at 1.7 / 2.6 / 3.5 as before; the Meiri's stone 3.4 and beam 0.6; the row's spacing (2.5), its tables (1 x 2) and
    // which end has the eighth - model choices, as in the First Temple plugin.
    {
      // ONKLIOT_211 (the user, 14.11.2026: "להפוך את צבע אונקליות לברזל"; "אונקליות שמם הוא ננסים (האונקליות הן המתלים)"): the hooks
      // are of grey iron ("ואנקליות של ברזל", Middot 3:5) - until 2.0.1 a dark tone of the bronze, which read as bronze - and a little
      // thicker, that they be seen; the pillars are named "ננסין" and the hooks "אונקליות", each by its own label (below)
      // ONK_MARK_211 (the user, 15.11.2026, in בית שני: "האונקליות לא השתנו" - the hooks were grey, but the button's marking painted them
      // gold-yellow for its 15 seconds, and that is what he saw): the iron itself darker and more of a metal, and the marking in the
      // iron's own tones - a slow glint between dark iron and bright steel (the hook below), no gold
      const iron = new MeshStandardMaterial({ color: 0x4f545c, roughness: 0.45, metalness: 0.55 });
      const glowM = new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.97, depthTest: false, depthWrite: false });
      const lay = {};
      for (const k of ["bartenura", "meiri", "raavyah", "gra"]) {
        lay[k] = new Group();
        lay[k].name = "slaughterLayout-" + k;
        lay[k].visible = k === "bartenura";
        slaughterG.add(lay[k]);
      }
      const glows = [];
      const m4 = new Matrix4();
      const inst = (geo, mat, places, parent, shadow = true, hooks = false) => {
        const mk = (m2) => {
          const im = new InstancedMesh(geo, m2, places.length);
          places.forEach((p2, i2) => { m4.makeTranslation(p2[0], p2[1], p2[2]); im.setMatrixAt(i2, m4); });
          im.instanceMatrix.needsUpdate = true;
          parent.add(im);
          return im;
        };
        const im = mk(mat);
        im.castShadow = shadow;
        im.receiveShadow = true;
        if (hooks) { const tw = mk(glowM); tw.renderOrder = 30; tw.visible = false; glows.push(tw); }   // its floating colour (the button)
        return im;
      };
      // the hooks of a squared cedar piece: a rod out of the east, north and south faces at each height, its tip turned up
      const rodL = 0.34, tipL = 0.24, hr = 0.05, postW = 0.8, HY = [1.7, 2.6, 3.5];   // ONKLIOT_211: hr 0.05 (0.035)
      const hookParts = [];
      for (const [dx, dz] of [[1, 0], [0, -1], [0, 1]]) for (const hy of HY) {
        const rod = new CylinderGeometry(hr, hr, rodL, 8);
        if (dx) rod.rotateZ(Math.PI / 2); else rod.rotateX(Math.PI / 2);
        rod.translate(dx * (postW / 2 + rodL / 2 - 0.02), hy, dz * (postW / 2 + rodL / 2 - 0.02));
        hookParts.push(rod, new CylinderGeometry(hr, hr, tipL, 8).translate(dx * (postW / 2 + rodL - 0.02), hy + tipL / 2 - hr, dz * (postW / 2 + rodL - 0.02)));
      }
      const hookGeo = mergeGeometries(hookParts);
      const lowStone = H2.uvWorld(new CylinderGeometry(0.46, 0.52, 1.4, 12), 3, 1.4).translate(0, 0.7, 0);
      const post = H2.uvWorldBox(new BoxGeometry(postW, 2.6, postW), postW, 2.6, postW).translate(0, 1.4 + 1.3, 0);
      // "bartenura": the two rows as before
      const pillarAt = [];
      for (const nz of nanZs) for (const nx of colXs) pillarAt.push([nx, F, nz]);
      inst(lowStone, M2.stoneSmooth, pillarAt, lay.bartenura);
      inst(post, M2.cedar, pillarAt, lay.bartenura);
      inst(hookGeo, iron, pillarAt, lay.bartenura, false, true);
      // "meiri": the same places, a taller stone, a short beam from pillar to pillar along each row, three hooks a span on each side and under it
      {
        // MEIRI_LOW_D (fix-d, 22.11.2026 - the user's decision 143 א): the stone LOW, far under a man's height, as the Bartenura's (1.4) -
        // the Yachin on Middot 3:5 (819:421) "הרבה פחות מקומת איש המפשיט"; Rabbenu Shemaya (645:106) "קצרים ולא גבוהים"; the beams and
        // their hooks on it, as the Meiri says. (Until now 3.4.)
        const by = 1.4, bh = 0.6, bw = 0.6, span = colXs[1] - colXs[0];
        inst(H2.uvWorld(new CylinderGeometry(0.35, 0.42, by, 12), 2.5, by).translate(0, by / 2, 0), M2.stoneSmooth, pillarAt, lay.meiri);
        const beamAt = [], beamHookAt = [];
        for (const nz of nanZs) for (let i = 0; i + 1 < colXs.length; i++) {
          beamAt.push([colXs[i] + span / 2, F, nz]);
          for (let k = 1; k <= 3; k++) beamHookAt.push([colXs[i] + k * span / 4, F, nz]);
        }
        inst(H2.uvWorldBox(new BoxGeometry(span - 0.04, bh, bw), span - 0.04, bh, bw).translate(0, by + bh / 2, 0), M2.cedar, beamAt, lay.meiri);
        const parts = [];
        for (const dz of [-1, 1]) {
          const hy = by + bh / 2;
          parts.push(new CylinderGeometry(hr, hr, rodL, 8).rotateX(Math.PI / 2).translate(0, hy, dz * (bw / 2 + rodL / 2 - 0.02)));
          parts.push(new CylinderGeometry(hr, hr, tipL, 8).translate(0, hy + tipL / 2 - hr, dz * (bw / 2 + rodL - 0.02)));
        }
        parts.push(new CylinderGeometry(hr, hr, rodL, 8).translate(0, by - rodL / 2 + 0.02, 0));
        parts.push(new CylinderGeometry(hr, hr, tipL, 8).rotateX(Math.PI / 2).translate(0, by - rodL + 0.02, tipL / 2));
        inst(mergeGeometries(parts), iron, beamHookAt, lay.meiri, false, true);
      }
      // SLAUGHTER_SPLIT_211 (the user, 14-15.11.2026: the row's option "הראבי״ה והגר״א — שורה אחת" joined two readings that are not one;
      // his answers: split them; the Gra's row - "צפון דרום"). Until 2.0.1 one layout ("oneRow") stood for both.
      // "raavyah" - the Ra'avyah in Tosafot Yom Tov, Middot 3:5 (book 948, line 133): "ונראה שלא היו העמודים וכן השלחנות מסודרים זה
      //   אצל זה, ארבע שורות של ב' ב' ... אלא כל דממזרח למערב עמודים ח'. שלחנות שמנה"; the Rashash there (book 750, lines 50-51):
      //   "להראבי"ה משמע דהעמודים הי' בסדר אחד ממזרח למערב וכן השלחנות לפניהם" (and he reads "שבין הטבעות ולעמודים"). So: eight
      //   pillars in one east-west row (2.5 apart, centred on x 51.75), and the eight tables in a row of their own before them - south
      //   of them, toward the rings - four amot from the rings and four from the pillars (Middot 5:2 "מן הטבעות לשלחנות ארבע, מן השלחנות ולננסין ארבע").
      // "gra" - the Gra on Middot 5:2 (book 7509, line 67): "כי שמונה ננסין היו. נמצא היו ז' אוירים וכנגד כל אויר היה שולחן הרי ז'
      //   שולחנות ושולחן הח' הי' עמוד אצל הננס שבקצה מבחוץ ואות' השולחן היה ד' אמות וכל השולחנות היו עומדים בשורה אחת ... הרי מן
      //   מקום שהתחילו השולחנות עד שהתחילו הננסין ד' אמות דהיינו כאורך השולחן". So: ONE ROW NORTH-SOUTH - the eighth table, four amot
      //   long, first (four amot from the rings' place, z -43..-47), then pillar, table, pillar ... the last pillar's north face eight amot
      //   from the court's wall (5:2 "מן הננסין לכותל העזרה שמונה").
      // MODEL CHOICES: the rows' place across the court (x 51.75), the tables' breadth, the small tables' length (what the gaps leave),
      // the hooks' faces in the Gra's row (east and west - the faces the tables leave free).
      {
        // the reckoning (Middot 5:2): the rings' place ends at z -39; four amot on the tables (z -43..-45); four amot on the pillars
        // (their south face at -49). (The priests' ways of the two demonstrations run there - they show the usual layout, SLAUGHTER_HOLD_211.)
        const rowX = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => 51.75 + (i - 3.5) * 2.5), RZ = -49.4;
        const rowAt = rowX.map((x) => [x, F, RZ]);
        inst(lowStone, M2.stoneSmooth, rowAt, lay.raavyah);
        inst(post, M2.cedar, rowAt, lay.raavyah);
        inst(hookGeo, iron, rowAt, lay.raavyah, false, true);
        const tParts = [H2.uvWorldBox(new BoxGeometry(1, 0.25, 2), 1, 0.25, 2).translate(0, 0.875, 0)];
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) tParts.push(H2.uvWorldBox(new BoxGeometry(0.16, 0.75, 0.16), 0.16, 0.75, 0.16).translate(sx * 0.37, 0.375, sz * 0.82));
        inst(mergeGeometries(tParts), M2.marble, rowX.map((x) => [x, F, -44]), lay.raavyah);   // their north edge four amot south of the pillars' south face, their south edge four north of the rings' place
      }
      {
        // The reckoning (Middot 5:2, as the Gra reads it): the rings' place ends at z -39; four amot on, at -43, the tables begin -
        // the eighth table, four amot long, to -47; there the pillars begin, and their row ends eight amot from the wall (-59.5):
        // twelve and a half amot (the Rambam's "בית המטבחים י"ב אמות ומחצה", Beit HaBechirah 5:13) for eight pillars and the seven
        // tables between them - so the pillars are slim here (half an amah) and the seven tables short (model choices)
        const GX = 51.75, Z0 = -43, PW = 0.5, ZP0 = Z0 - 4 - PW / 2, ZP1 = -67.5 + 8 + PW / 2, STEP = (ZP0 - ZP1) / 7;   // the pillars' centres from -47.25 down to -59.25
        const colAt = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [GX, F, ZP0 - i * STEP]);
        inst(H2.uvWorld(new CylinderGeometry(0.29, 0.33, 1.4, 12), 2, 1.4).translate(0, 0.7, 0), M2.stoneSmooth, colAt, lay.gra);
        inst(H2.uvWorldBox(new BoxGeometry(PW, 2.6, PW), PW, 2.6, PW).translate(0, 1.4 + 1.3, 0), M2.cedar, colAt, lay.gra);
        const ewParts = [];
        for (const dx of [-1, 1]) for (const hy of HY) {
          ewParts.push(new CylinderGeometry(hr, hr, rodL, 8).rotateZ(Math.PI / 2).translate(dx * (PW / 2 + rodL / 2 - 0.02), hy, 0));
          ewParts.push(new CylinderGeometry(hr, hr, tipL, 8).translate(dx * (PW / 2 + rodL - 0.02), hy + tipL / 2 - hr, 0));
        }
        inst(mergeGeometries(ewParts), iron, colAt, lay.gra, false, true);
        const tl = Math.max(0.6, STEP - 0.66 - 0.12);   // a small table: what is left between two pillars' stones
        const small = [H2.uvWorldBox(new BoxGeometry(1.2, 0.2, tl), 1.2, 0.2, tl).translate(0, 0.9, 0)];
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) small.push(H2.uvWorldBox(new BoxGeometry(0.12, 0.8, 0.12), 0.12, 0.8, 0.12).translate(sx * 0.5, 0.4, sz * (tl / 2 - 0.08)));
        inst(mergeGeometries(small), M2.marble, [0, 1, 2, 3, 4, 5, 6].map((i) => [GX, F, ZP0 - (i + 0.5) * STEP]), lay.gra);
        const big = [H2.uvWorldBox(new BoxGeometry(1.2, 0.25, 4), 1.2, 0.25, 4).translate(0, 0.875, 0)];
        for (const sx of [-1, 1]) for (const sz of [-1, 0, 1]) big.push(H2.uvWorldBox(new BoxGeometry(0.16, 0.75, 0.16), 0.16, 0.75, 0.16).translate(sx * 0.47, 0.375, sz * 1.8));
        inst(mergeGeometries(big), M2.marble, [[GX, F, Z0 - 2]], lay.gra);
      }
      ctx2.shared.slaughterLayout = {
        current: "bartenura",
        keys: ["bartenura", "meiri", "raavyah", "gra"],
        set(k) {
          if (!lay[k]) return this.current;
          this.current = k;
          for (const q of this.keys) lay[q].visible = q === k;
          tbl2.visible = k === "bartenura" || k === "meiri";   // the Ra'avyah's and the Gra's rows have their own tables
          return k;
        }
      };
      // 1.9.2 (the user: "תוסיף כפתור לאונקליות"): THE BUTTON "האונקליות" by the pillars - the eye comes close and the hooks of the layout
      // shown are lit in a floating colour for 15 s, with the Mishnah's words (Middot 3:5)
      const lg = new Group();
      lg.visible = false;
      g.add(lg);
      ctx2.layers.onkGlow = lg;
      const nameL = new Group();   // the place's name - off while the hooks are lit (it stood over them in the close view)
      g.add(nameL);
      ctx2.layers.slaughterLbl = nameL;
      ctx2.labels.push({ text: "״ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין״ (מידות ג, ה)", x: 51.75, y: F + 6.6, z: -50.5, size: 1.1, layers: ["onkGlow"] });
      ctx2.labels.push(   // ONKLIOT_211: the two names, each on its own thing
        { text: "עמודים ננסין", x: 62.6, y: F + 5.2, z: -54, size: 1.5, layers: ["slaughterLbl"] },
        { text: "ננסין — העמודים הנמוכים", x: 51.75, y: F + 0.5, z: -51.4, size: 0.8, layers: ["onkGlow"] },
        { text: "אונקליות — ווים של ברזל", x: 51.75, y: F + 4.9, z: -52.5, size: 0.8, layers: ["onkGlow"] });
      const ON = { on: false, timer: null };
      const glowSet = (on) => { ON.on = !!on; for (const t of glows) t.visible = ON.on; lg.visible = ON.on; nameL.visible = !ON.on; };
      // ONK_BLACK_242 (the user, 24.11.2026: no blinking of the hooks in any layout; the marking always black): the glint removed, the material fixed black
      ctx2.shared.onkliot = (on) => {
        clearTimeout(ON.timer);
        glowSet(on !== false);
        if (!ON.on) return;
        const z0 = slaughterG.position.z;
        // from the south, over the tables: all the pillars (SLAUGHTER_SPLIT_211: the Gra's row, which runs north-south, from the east)
        if (typeof ctx2.flyTo === "function") {
          if (ctx2.shared.slaughterLayout.current === "gra") ctx2.flyTo([70, F + 11, -50 + z0], [51.75, F + 2.2, -50.5 + z0], 1600);
          else ctx2.flyTo([51.75, F + 10, -36.5 + z0], [51.75, F + 2.5, -54 + z0], 1600);
        }
        // ONK_TIMER_211 (the function review, F1-01): through the UI's autoOff when it is there, so that the next place, chip or view ends it
        const AO = ctx2.ui && ctx2.ui.autoOff;
        if (AO && typeof AO.arm === "function") AO.arm("onkliot", () => glowSet(false)); else ON.timer = setTimeout(() => glowSet(false), 15000);
      };
      const MB = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
      MB.push({
        id: "alt-onkliot", label: "האונקליות", labelOn: "כבה את הסימון", maxDist: 70,
        title: "״ואנקליות של ברזל היו קבועין בהם, ושלשה סדרים היו לכל אחד ואחד, שבהם תולין״ (מידות ג, ה) — המבט מתקרב, והאונקליות מסומנות בצבע צף ל־15 שניות, בשיטה שנבחרה במתג ״בית המטבחים — העמודים והאונקליות״.",
        anchor: () => null,   // ONKLIOT_PILL_461 (the user 26.11.2026: "אונקליות כפתור לא רלוונטי תסיר"): no pill on the model; the place and the menu keep it
        get: () => ON.on,
        set: (on) => ctx2.shared.onkliot(!!on)
      });
    }
    // Rambam 2:14 (rubuva): a window 1x1 amah in the west side of the ramp. Its height along the ramp is not specified.
    // 1.9.1 (the user, on the path to the yesod and the label "רבובה" over it: "מה זה?"): it was at the floor, at z 33 - behind the path
    // to the yesod, which runs along the ramp's west side there. Now at z 29, its sill 2 above the floor - over the path (1.5 high there)
    // and under the ramp's walk (3.8): seen from the court and reached over the path. In rampG (it goes with the ramp)
    {
      const darkMat = new MeshBasicMaterial({ color: 985864 });
      H2.box(rubD, 0.1, 1.5, 1.5, M2.stoneLight, 47.46, F + 1.75, 29);
      H2.box(rubD, 0.1, 1, 1, darkMat, 47.4, F + 2, 29);
      H2.box(rubT, 0.1, 1.5, 1.5, M2.stoneLight, 47.46, F + 0.65, 34.4);   // SMALL_RAMPS3_211: south of the third ramp, under the big ramp's walk (2.3 there)   // (SMALL_RAMPS_211's window on the third ramp - unused since SMALL_RAMPS2_211) west face - the window in its own
      H2.box(rubT, 0.1, 1, 1, darkMat, 47.4, F + 0.9, 34.4);
    }
    ctx2.layers.altarRubD = rubD;   // SMALL_RAMPS3_211: the window's label goes with the window of the reading
    ctx2.layers.altarRubT = rubT;
    ctx2.labels.push({ text: "רבובה", x: 46.6, y: F + 4.6, z: 29, size: 1.6, layers: ["altarBody32", "altarRubD"] }, { text: "רבובה", x: 48.6, y: F + 4.6, z: 25, size: 1.6, layers: ["altarBody28", "altarRubD"] },
      { text: "רבובה", x: 46.4, y: F + 3.3, z: 34.4, size: 1.6, layers: ["altarBody32", "altarRubT"] }, { text: "רבובה", x: 48.4, y: F + 3.3, z: 30.4, size: 1.6, layers: ["altarBody28", "altarRubT"] });
    // SHITIN_LABEL_205 (the user, 12.11.2026: "שיתין הכיתובית שם מסתירה אותם"): the two labels stood an amah and a half over the holes and the
    // slab and covered them from the place's own view - now higher and smaller (3.4 and 4.4 over the floor, 0.62)
    ctx2.labels.push({ text: "טבלא של שיש וטבעת — יורדין לשית", x: 39, y: F + 3.4, z: 13.3, size: 0.62, layer: "altarBody32" }, { text: "טבלא של שיש וטבעת — יורדין לשית", x: 43, y: F + 3.4, z: 9.3, size: 0.62, layer: "altarBody28" });   // 1.9.3
    const SHITIN_LABEL = "שני הנקבים שבקרן היסוד — ״והן הנקראין שיתין״";   // 1.9.5 (Rambam Beit HaBechirah 2:11; Middot 3:2)
    ctx2.labels.push({ text: SHITIN_LABEL, x: 40, y: F + 4.4, z: 12.05, size: 0.62, layer: "altarBody32", moveWithAltar: true }, { text: SHITIN_LABEL, x: 44, y: F + 4.4, z: 8.05, size: 0.62, layer: "altarBody28", moveWithAltar: true });
    // SHULCHAN_210 (the user, 14.11.2026: "תוסיף גם שלחנות החלבים - חפש מקור לכך איפה היו ומתי"; "שלחן החלבים - מקובלת הצעתך"): the two
    // tables WEST OF THE RAMP (Shekalim 6:4 "ושנים במערב הכבש, אחד של שיש ואחד של כסף על של שיש היו נותנים את האברים, על של כסף כלי
    // שרת"; Rambam Beit HaBechirah 2:15), the marble one being "שלחן החלבים" of Tamid 7:3 (the Rambam's commentary there; the Bartenura),
    // BY THE SOUTH-WEST CORNER of the altar, as the Ra'avad (Melechet Shlomo, Tamid 7:3; 1202, line 319): "שהרי במערבו של כבש היה השלחן
    // היינו בקרן מערבית דרומית" (until 2.0.0 they stood by the ramp's foot, with no source). In rampG, so R. Yose's first altar moves them
    // with the ramps (2 east, 4 north). West of the path to the yesod (Rashi's small ramp), which shuts off the corner between the ramp and
    // the altar, and clear of the walks of the demonstration (55-tamid.js: the nodes CSW, CSW_N and STB_*); the marble one nearer the corner.
    // 1.2 x 1.6, an amah and a half high ("שהוא גבוה" - the Rosh, Tamid 33b; the measures and the exact spot - model choices).
    // ctx2.shared.rampTables = { marble: [x, z], silver: [x, z], top } in mv's frame (the Mishnah's altar) - for the demonstration.
    {
      const silver = M2.bronze.clone();
      silver.emissiveIntensity = 0;   // COPPER_C: not the copper's warm glow (M.bronze is now tm_copper)
      silver.color.set(13421772);
      silver.metalness = 0.9;
      silver.roughness = 0.3;
      const TW = 1.2, TD = 1.6, LEG = 1.25, TT = 0.25;
      const tabG = new Group(); rampG.add(tabG);   // TABLES_TOS_441: the two tables in a group of their own (moved in Tosafot's reading, below)
      const mkTable = (mat, tx, tz) => {
        H2.box(tabG, TW, TT, TD, mat, tx, F + LEG, tz);
        for (const lx of [-1, 1]) for (const lz of [-1, 1]) H2.box(tabG, 0.16, LEG, 0.16, mat, tx + lx * (TW / 2 - 0.12), F, tz + lz * (TD / 2 - 0.12));
      };
      const MB = [40, 16], SV = [40, 18.2];
      mkTable(M2.marble, MB[0], MB[1]);
      mkTable(silver, SV[0], SV[1]);
      ctx2.shared.rampTables = { marble: MB, silver: SV, top: LEG + TT };
      // TABLES_TOS_441 (the user 26.11.2026: "חלבים - השלחן נתקע בכבש"): in Tosafot's reading of the small ramps the walk to the yesod runs
      // outside the third ramp, further west (SMALL_RAMPS3_211), right over the marble table (its paving x 39.9..42.8 where the table stands,
      // x 39.4..40.6). There the two tables stand 1.8 amot further west, clear of it - still west of the ramp, by the altar's south-west corner
      // (the Ra'avad). The demonstration reads their place from rampTables (moved with them). The shift - a model choice
      { const R0 = ctx2.shared.ramps, set0 = R0 && R0.set; if (R0 && set0) R0.set = function (on) { set0.call(this, on); const dx = on ? -1.8 : 0; tabG.position.x = dx; MB[0] = 40 + dx; SV[0] = 40 + dx; }; }
      for (const [lay, ox, oz] of [["altarBody32", 0, 0], ["altarBody28", 2, -4]]) {
        // (TABLES_TOS_441: the labels stay over the default place) over the label of the path to the yesod (x 42.8, F + 3.6), which stands beside them
        ctx2.labels.push({ text: "שלחן של שיש — שלחן החלבים", x: MB[0] + ox - 0.8, y: F + 5.6, z: MB[1] + oz, size: 0.9, layer: lay, moveWithAltar: true },
          { text: "שלחן של כסף — לכלי שרת", x: SV[0] + ox - 0.8, y: F + 4.8, z: SV[1] + oz, size: 0.9, layer: lay, moveWithAltar: true });
      }
    }
    ctx2.labels.push(
      { text: "המזבח", x: ACX, y: F + 18, z: ACZ, size: 5 },
      { text: "הכבש", x: ACX, y: F + 11, z: 28, size: 3 },
      { text: "הכיור", x: KX, y: F + 6.4, z: KZK, size: 2.2 },   // KIYOR_A2: over the laver on its base
      { text: "בית המטבחים", x: 52, y: F + 10, z: -50, size: 3.5, layers: ["slaughterLbl"] },   // 1.9.2: hidden while the hooks are lit
      { text: "הטבעות", x: 52, y: F + 4.5, z: -27, size: 2.5 }
    );
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    // 1.9.1 (the user: "גם תצוגת המזבח לא תיקנת"): from the east and above, the whole altar and its ramp, over the court's east wall and
    // clear of the chambers on the south (the old view stood south of the court and the chambers hid the ramp); the place's shift is added below
    ctx2.shared.flyPoints.mizbeach = { pos: [108, 72, 45.5], target: [52, 17, 11.5] };
    // ===== 1.3.0 (the user, after the reviewer's note 4): THE PLACE OF THE ALTAR in the court's 135 amot north-south. The model follows the
    // measures of Middot 5:2 (and Rambam Beit HaBechirah 5:13-16): from the north wall 8 + 4 + 4 + 24 + 8 = 48 to the altar, the altar 32,
    // the ramp 32, and "the rest" 23 to the south wall - the body straddles the house's axis, 19.5 north of it and 12.5 south (ACZ -3.5).
    // The Tannaim (Zevachim 58a-59a; Yoma 16a) dispute it: R. Yose - "כוליה מזבח בצפון קאי"; R. Yehuda - "ממוצע ועומד באמצע העזרה";
    // and "כוליה מזבח בדרום" (Zevachim 58b-59a; Yoma 16a ties the Mishnah's measures to R. Eliezer b. Yaakov). Each reading moves `mv`
    // (the altar, its ramps, fire and tables), the labels of those pieces and the fly point; the laver, rings and slaughter place stay.
    {
      const MOVE_TEXTS = new Set(["המזבח", "הכבש", "כבש לסובב", "כבש ליסוד", "טבלא של שיש וטבעת — יורדין לשית", "כבש ליסוד — לרש״י (זבחים סב:)", "התפוח", "רבובה", "32 הבסיס · 30 מעל היסוד · 28 מעל הסובב · 26 בין הקרנות · 24 מקום המערכה (מידות ג, א)", "המזבח הקודם — 28 על 28; בני הגולה הוסיפו 4 בדרום ו־4 במערב (רבי יוסי)", "ספלי הניסוך — מים (מערבי) ויין (מזרחי)", "התפוח לראב״ד — טבלה כ״ב על כ״ב, גבוהה אמה"]);
      const mine = ctx2.labels.filter((l) => MOVE_TEXTS.has(l.text) || l.moveWithAltar);   // 1.8.1: the measures' numbers too
      const base = mine.map((l) => l.z);
      const fp0 = { pos: ctx2.shared.flyPoints.mizbeach.pos.slice(), target: ctx2.shared.flyPoints.mizbeach.target.slice() };
      const PLACE = {
        current: "middot",
        keys: ["middot", "rashi", "middle", "north"],
        // 1.5.0 (the user, after my error: 48 ignored "the rest" - the posts' and tables' places): the body's north face 60.5 from the north
        // wall (Rambam 5:15 "מכותל צפוני של עזרה עד כותל המזבח ששים ומחצה"; Yoma 16b "רובא דמזבח בדרום") -> centre z +9 (dz 12.5);
        // Rashi Yoma 16b: 62.5 -> +11; R. Yehuda: centred on the axis; R. Yose: the whole body north of the axis
        dz: { middot: 12.5, rashi: 14.5, middle: -ACZ, north: -16 - ACZ },
        set(key) {
          if (!(key in this.dz)) return false;
          this.current = key;
          const dz = this.dz[key];
          mv.position.z = dz;
          mv.updateMatrixWorld(true);
          if (ctx2.shared.sfalimSee) ctx2.shared.sfalimSee.refresh();   // SFALIM_303: the glass corner with the altar
          let lg = null;
          try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
          mine.forEach((l, i) => {
            const oz = l.z;
            l.z = base[i] + dz;
            if (lg) for (const spr of lg.children) {
              if (spr.userData && spr.userData.label === l) { spr.position.z = l.z; break; }
              if (Math.abs(spr.position.x - l.x) < 1e-3 && Math.abs(spr.position.y - l.y) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3) { spr.position.z = l.z; break; }
            }
          });
          const f = ctx2.shared.flyPoints.mizbeach;
          f.pos = [fp0.pos[0], fp0.pos[1], fp0.pos[2] + dz];
          f.target = [fp0.target[0], fp0.target[1], fp0.target[2] + dz];
          // 1.9.2 (the user: "טבעות לר' יוסי שורה אחת בלבד"): for R. Yose, whose whole altar is in the north (Zevachim 58a "כוליה מזבח בצפון
          // קאי"), the 24 amot of rings have no room - one row of six, 8 amot from the altar's north face (-32) as the Mishnah's distance
          // (z -42), and the tables and the pillars after it, five amot further north (model choices: no source gives his slaughter place).
          // R. Yehuda's and the other readings keep the place as drawn (no source moves it).
          if (ringsInst) {
            const one = key === "north";
            if (ctx2.shared.ringsLayout) ctx2.shared.ringsLayout.one(one);   // RINGS_305: R. Yose's row and the arrangement together
            slaughterG.position.z = one ? -5 : 0;
            const rl = ctx2.labels.find((l) => l.text === "הטבעות");
            if (rl) {
              const oz = rl.z;
              rl.z = one ? -42 : -27;
              if (lg) for (const spr of lg.children) {
                if ((spr.userData && spr.userData.label === rl) || (Math.abs(spr.position.x - rl.x) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3 && Math.abs(spr.position.y - rl.y) < 1e-3)) { spr.position.z = rl.z; break; }
              }
            }
          }
          return true;
        },
        get() { return this.current; }
      };
      ctx2.shared.altarPlace = PLACE;
      PLACE.set("middot");
    }
    ctx2.animated.push((t) => {
      const s = t * 1e-3;
      for (let i = 0; i < flames.length; i++) {
        const f = flames[i];
        const n = Math.sin(s * 9.1 + i * 2.3) * 0.6 + Math.sin(s * 15.7 + i * 4.1) * 0.4;
        const u = f.material.uniforms;
        u.uTime.value = s * FIRE.speed;
        u.uSize.value.set(f.userData.w * (1 + 0.06 * Math.sin(s * 12.3 + i * 3.1)), f.userData.h * (1 + 0.15 * n));
        u.uOp.value = f.userData.op * FIRE.heat * (0.85 + 0.15 * n);
      }
      fireLight.intensity = 33 + 6 * Math.sin(s * 9.7) + 3 * Math.sin(s * 22.3 + 1.3);
      emberLight.intensity = 5.5 + 1.4 * Math.sin(s * 7.3);
      // 1.0.28: the smoke is now a STRAIGHT column rising far into the sky (almost no sideways drift); it widens slowly and fades near the top.
      // SMOKE_COLUMN_A2: the column above carries it up; the sprites rise thick over the pyre (the lowest 26 amot) into the column's foot
      const sday = smokeDay(), sx = (FXP.x0 + FXP.x1) / 2, sy = TOP + FXP.top + 1.0;
      smokeColumn.position.set(sx, sy, GP.cz);
      { const u = smokeColumn.material.uniforms; u.uTime.value = s; u.uDay.value = sday; }
      const sg = 0.33 + 0.25 * sday;
      for (let i = 0; i < smoke.length; i++) {
        const sp = smoke[i];
        const p = (s * 0.09 + i / smoke.length) % 1;
        sp.position.set(sx + Math.sin(s * 0.7 + i * 1.7) * 0.25 * (0.4 + p), sy + 0.4 + p * 26, GP.cz + Math.cos(s * 0.6 + i * 2.3) * 0.25 * (0.4 + p));
        const sc2 = 2.2 + p * 3.4;
        sp.scale.set(sc2, sc2, 1);
        sp.material.color.setRGB(sg, sg, sg);
        sp.material.opacity = 0.42 * Math.min(1, p / 0.06) * Math.pow(1 - p, 1.2);
      }
      const dt = lastT ? Math.min(0.1, s - lastT) : 0.016;
      lastT = s;
      for (let i = 0; i < SPARKS; i++) {
        sparkAge[i] += dt;
        if (sparkAge[i] >= sparkLife[i]) respawnSpark(i, false);
        sparkVel[i * 3] += (Math.random() - 0.5) * 2.2 * dt;
        sparkVel[i * 3 + 2] += (Math.random() - 0.5) * 2.2 * dt;
        sparkPos[i * 3] += sparkVel[i * 3] * dt;
        sparkPos[i * 3 + 1] += sparkVel[i * 3 + 1] * dt;
        sparkPos[i * 3 + 2] += sparkVel[i * 3 + 2] * dt;
        const k = Math.pow(1 - sparkAge[i] / sparkLife[i], 1.3) * (0.7 + 0.3 * Math.sin(s * 30 + i * 5.1));
        sparkCol[i * 3] = 1 * k;
        sparkCol[i * 3 + 1] = 0.55 * k;
        sparkCol[i * 3 + 2] = 0.12 * k;
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.color.needsUpdate = true;
      coals.material.opacity = 0.65 + 0.2 * Math.sin(s * 6.1) + 0.1 * Math.sin(s * 13.7 + 1.3);
      glow.material.opacity = 0.32 + 0.08 * Math.sin(s * 8.3) + 0.04 * Math.sin(s * 19.1);
    });
  }

