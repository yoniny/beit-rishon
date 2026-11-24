  // plugin/js/add208.js
  // ===== Beit Sheni 1.9.9 (ADD_208): THE ADDITIONS OF THE "ערכי המקדש" ROUND =====
  // The user, 12.11.2026, on the report on the plugin "ערכי המקדש" (21:14, 21:41): "1. שניהם כמתג" (the golden chandelier: Rashi's lamp and
  // the Rambam's "שמשית"), "2. שים אותה ליד הנברשת" (the golden tablet), "3. אפשרות א'" (the thirteen shofarot in the Azara, by the altar,
  // to the right of one who comes in), "4. לשכת הכלים אפשר בתאים סביב ההיכל", "5. ... מתג לרש"י ורמב"ם, זו שיטה אחת, ומתג לתוספות" (Beit
  // HaEven), "8" (the ulam's courses in the Rambam's reading of the steps), "ב' שתיהן" (a door to the lepers' chamber, in both readings).
  // Every quotation in the cards (tools/cards_208.py, tools/rows_208.py) read in his library. Sizes, materials and exact places that the
  // sources do not give - model choices, said so in the cards.
  //@@include shiloach
  async function buildAdd208(ctx2) {
    const { H: H2, M: M2, LV } = ctx2;
    const SH = ctx2.shared;
    ctx2.layers = ctx2.layers || {};
    const grp = (name, visible) => { const g = new Group(); g.name = name; g.visible = visible !== false; ctx2.root.add(g); ctx2.layers[name] = g; return g; };
    const lbl = (text, x, y, z, size, layer) => ctx2.labels.push(Object.assign({ text, x, y, z, size: size || 1.2 }, layer ? { layer } : {}));
    const mesh = (g, geo, mat, x, y, z) => { const m = new Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    // the first surface under (x, z) from above, or along a ray - the places of the new pieces follow what the other modules built
    const rc = new Raycaster(), V0 = new Vector3(), V1 = new Vector3();
    const solid = (o) => o.isMesh && o.visible !== false && !(o.material && o.material.transparent && o.material.opacity < 0.5);
    let mw = false;
    const castFrom = (from, dir, fallback) => {
      if (!mw) { ctx2.root.updateMatrixWorld(true); mw = true; }   // built this frame: no matrices until updated
      rc.camera = ctx2.camera;   // the labels' sprites need it (TAMID_QA_207)
      rc.set(V0.set(from[0], from[1], from[2]), V1.set(dir[0], dir[1], dir[2]).normalize());
      const hits = rc.intersectObjects(ctx2.root.children, true).filter((h) => { let o = h.object; while (o) { if (o.visible === false) return false; o = o.parent; } return solid(h.object); });
      return hits.length ? hits[0].point.clone() : fallback;
    };
    const groundAt = (x, z, from, fallback) => { const p = castFrom([x, from, z], [0, -1, 0], null); return p ? p.y : fallback; };
    SH.__add208QA = { groundAt, castFrom };   // for the checks

    // ---------- 1+2. HELENE'S CHANDELIER AND TABLET (Yoma 3:10) ----------
    // "הילני אמו עשתה נברשת של זהב על פתחו של היכל. ואף היא עשתה טבלא של זהב שפרשת סוטה כתובה עליה". The chandelier "על פתחו של
    // היכל" - over the Heichal's door (its east face x 1.5, the door z -5..5, y 22..42), in the ulam, above the golden vine (y ~43).
    // Two forms (the opinions row "הנברשת של הילני — צורתה"): Rashi (Yoma 37a "נברשתא - מנורה") and the Bartenura ("נברשת. מנורה") -
    // a hanging lamp (the default); the Rambam (commentary, Yoma 3:10) "כמו שמשית שעושין על פתחי הבתים מזכוכית והיא עשתה אותה מזהב
    // טוב ממורט" - a gold fan over the doorway. The tablet: Tosefta Sotah 2:1 "טבלא של זהב היתה קבועה בכותלו של היכל והיא נראית
    // [מבאולם]" - on the Heichal's front, north of its door (the side, the size and the height - model choices); its letters engraved
    // ("ובחריתה היתה" - the Rambam's responsum 7:2), drawn as rows of marks (what was written on it is disputed - the card).
    const wallX = (castFrom([12, 30, -12.5], [-1, 0, 0], new Vector3(1.5, 30, -12.5))).x;   // the Heichal's front, seen from the ulam
    const lampG = grp("heleneLamp", true), shamG = grp("heleneShamshit", false), tabG = grp("heleneTablet", true);
    {
      const LX = 4.6, LY = 48.6;   // in the ulam, 3 amot before the wall, over the vine
      mesh(lampG, new CylinderGeometry(0.05, 0.05, 9.4, 6), M2.gold, LX, LY + 1.1 + 4.7, 0);   // the chain to the ulam's height
      const bowl = new LatheGeometry([[0, -0.55], [0.35, -0.5], [0.75, -0.25], [0.95, 0.15], [1.0, 0.35], [0.88, 0.4], [0.7, 0.2], [0.3, 0.05], [0.12, 0.6], [0.16, 1.1], [0, 1.15]].map(([r, y]) => new Vector2(r, y)), 28);
      mesh(lampG, bowl, M2.gold, LX, LY, 0);
      const ring = new TorusGeometry(1.45, 0.07, 8, 40);
      const rm = mesh(lampG, ring, M2.gold, LX, LY + 0.25, 0); rm.rotation.x = Math.PI / 2;
      const cup = new LatheGeometry([[0, 0], [0.16, 0.02], [0.28, 0.18], [0.3, 0.3], [0.24, 0.3], [0.12, 0.12], [0, 0.1]].map(([r, y]) => new Vector2(r, y)), 14);
      const arm = new CylinderGeometry(0.04, 0.04, 1.0, 6);
      for (let i = 0; i < 8; i++) {   // eight cups round it (their number - a model choice)
        const a = (i / 8) * Math.PI * 2, cx = Math.cos(a) * 1.45, cz = Math.sin(a) * 1.45;
        mesh(lampG, cup, M2.gold, LX + cx, LY + 0.3, cz);
        const am = mesh(lampG, arm, M2.gold, LX + cx * 0.62, LY + 0.25, cz * 0.62); am.rotation.z = Math.PI / 2; am.rotation.y = -a;
      }
      lbl("הנברשת של הילני — כרש״י וברטנורא: מנורה (יומא ג, י)", LX + 0.5, LY + 3.2, 0, 1.4, "heleneLamp");
    }
    {
      const SY = 46.6, R = 3.4, X = wallX + 0.3;   // the fan over the doorway, on the wall above the vine
      const polished = new MeshStandardMaterial({ color: 0xffe08a, metalness: 0.35, roughness: 0.22, emissive: 0x8a6418, emissiveIntensity: 0.6, side: DoubleSide });
      const fan = new CircleGeometry(R, 40, 0, Math.PI);
      const f = mesh(shamG, fan, polished, X, SY, 0); f.rotation.y = Math.PI / 2;
      const rim = mesh(shamG, new TorusGeometry(R, 0.12, 6, 40, Math.PI), M2.bronze, X + 0.02, SY, 0); rim.rotation.y = Math.PI / 2;
      mesh(shamG, new BoxGeometry(0.14, 0.24, R * 2 + 0.3), M2.bronze, X, SY - 0.12, 0);   // its base line
      const ray = new BoxGeometry(0.08, R * 0.92, 0.16);
      for (let i = 0; i <= 12; i++) {   // the rays of the fan (a model choice)
        const a = (i / 12) * Math.PI, r = mesh(shamG, ray, M2.bronze, X + 0.06, SY + Math.sin(a) * R * 0.5, -Math.cos(a) * R * 0.5);
        r.rotation.x = a - Math.PI / 2;
      }
      const hub = mesh(shamG, new CylinderGeometry(0.7, 0.7, 0.14, 24, 1, false, 0, Math.PI), M2.bronze, X + 0.1, SY, 0);
      hub.rotation.z = Math.PI / 2; hub.rotation.x = -Math.PI / 2;
      lbl("השמשית של הילני — כרמב״ם (פירוש המשנה, יומא ג, י)", X + 2, SY + R + 1.4, 0, 1.4, "heleneShamshit");
    }
    {
      const TX = wallX + 0.09, TY = 25.4, TZ = -12.5, TW = 2.4, TH = 1.7;   // north of the door, at the height of a man's eye over the floor (y 22)
      const cv = document.createElement("canvas"); cv.width = 256; cv.height = 180;
      const c2 = cv.getContext("2d");
      c2.fillStyle = "#e7c35a"; c2.fillRect(0, 0, 256, 180);
      c2.strokeStyle = "#8a6414"; c2.lineWidth = 6; c2.strokeRect(5, 5, 246, 170);
      c2.fillStyle = "#6e4e0c";
      for (let row = 0; row < 7; row++) for (let k = 0; k < 11; k++) {   // engraved marks in rows, right to left - not letters (model choice)
        const w = 8 + ((row * 7 + k * 13) % 9), x = 236 - k * 20 - w, y = 22 + row * 21;
        if (x > 14) c2.fillRect(x, y, w, 7);
      }
      const tex = new CanvasTexture(cv);
      tex.colorSpace = SRGBColorSpace;
      const pm = new MeshStandardMaterial({ map: tex, metalness: 0.55, roughness: 0.35, emissive: 0x5a400f, emissiveIntensity: 0.35 });
      mesh(tabG, new BoxGeometry(0.12, TH + 0.36, TW + 0.36), M2.bronze, TX - 0.02, TY + TH / 2, TZ);   // a frame, that it be seen on the gilded wall
      mesh(tabG, new BoxGeometry(0.1, TH, TW), [pm, M2.gold, M2.gold, M2.gold, M2.gold, M2.gold], TX + 0.06, TY + TH / 2, TZ);   // the engraved face toward the ulam (+x)
      lbl("טבלא של זהב — פרשת סוטה (יומא ג, י; תוספתא סוטה ב, א)", TX + 2.2, TY + TH + 1.1, TZ, 1.2, "heleneTablet");
      // HELENE_211 (decision 3 of the user, 14.11.2026: "כדאי שיהיה מבט מכוון או סימון"): the tablet is small on the great gilded wall.
      // The card's own switch "מבט" has a view that stands before it (content.json), and an amber frame glows round it for 15 s -
      // the feature heleneTabletGlow (as the upper storey's doorway, aliyahDoor). A sign of the model.
      {
        const gl = grp("heleneTabletGlow", false);
        const fm = new MeshBasicMaterial({ color: 0xff9a00 });
        const W2 = TW + 1.1, H2f = TH + 1.1, cy = TY + TH / 2, t = 0.2;
        for (const [h, w, y, z] of [[t, W2 + t, cy + H2f / 2, TZ], [t, W2 + t, cy - H2f / 2, TZ], [H2f, t, cy, TZ - W2 / 2], [H2f, t, cy, TZ + W2 / 2]]) {
          const b = new Mesh(new BoxGeometry(0.1, h, w), fm);
          b.position.set(TX + 0.16, y, z);
          b.userData.noPick = true;
          gl.add(b);
        }
        SH.features = SH.features || {};
        SH.features.heleneTabletGlow = { key: "heleneTabletGlow", isOn: () => gl.visible, on: () => { gl.visible = true; }, off: () => { gl.visible = false; } };
      }
    }
    // NIVR_SPARKS_211 (stage ב, point 34; the user: V): Yoma 37b (107:893) "תנא: בשעה שהחמה זורחת ניצוצות יוצאין ממנה, והכל יודעין
    // שהגיע זמן קריאת שמע"; Rashi (2157:1409) "ניצוצות - זהרורית שהחמה זורחת מן המזרח ונטה על פתח ההיכל שהוא לצד מערבי". Twinkling
    // sparks round the chandelier (Rashi's lamp) or the fan (the Rambam's shamshit) - whichever the row shows - while the feature
    // heleneSparks is on (a place's 15 s). Their number, size and twinkle: model choices.
    {
      const cv = document.createElement("canvas"); cv.width = cv.height = 64;
      const c2 = cv.getContext("2d"), gr = c2.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,235,1)"); gr.addColorStop(0.22, "rgba(255,226,120,0.9)"); gr.addColorStop(1, "rgba(255,190,60,0)");
      c2.fillStyle = gr; c2.fillRect(0, 0, 64, 64);
      c2.fillStyle = "rgba(255,255,240,0.95)"; c2.fillRect(30, 2, 4, 60); c2.fillRect(2, 30, 60, 4);   // the star's cross
      const tx = new CanvasTexture(cv);
      tx.colorSpace = SRGBColorSpace;
      const SP = [];
      const sparks = (parent, cx, cy, cz, rx, ry, rz, n) => {
        const sg = new Group();
        sg.visible = false;
        parent.add(sg);
        for (let i = 0; i < n; i++) {
          const m = new SpriteMaterial({ map: tx, color: 0xffffff, transparent: true, depthWrite: false, blending: AdditiveBlending });
          const sp = new Sprite(m);
          const a = i * 2.39996, r = 0.35 + 0.65 * ((i * 0.618) % 1);
          sp.position.set(cx + Math.cos(a) * rx * r, cy + ry * (((i * 0.377) % 1) - 0.5), cz + Math.sin(a) * rz * r);
          sp.userData = { noPick: true, ph: i * 1.7, f: 2.2 + (i % 5) * 0.55, s: 1.0 + 0.7 * ((i * 0.41) % 1) };
          sp.renderOrder = 9;
          sg.add(sp);
        }
        SP.push(sg);
        return sg;
      };
      sparks(lampG, 4.6, 48.7, 0, 1.9, 1.3, 1.9, 26);
      sparks(shamG, wallX + 0.6, 46.6 + 1.6, 0, 0.5, 3.0, 3.6, 30);
      SH.features = SH.features || {};
      SH.features.heleneSparks = { key: "heleneSparks", isOn: () => SP[0].visible, on: () => { for (const g2 of SP) g2.visible = true; }, off: () => { for (const g2 of SP) g2.visible = false; } };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!SP[0].visible) return;
        const t = performance.now() / 1000;
        for (const g2 of SP) for (const sp of g2.children) {
          const u = sp.userData, k = Math.max(0, Math.sin(t * u.f + u.ph));
          sp.scale.setScalar(u.s * (0.25 + 1.1 * k * k));
          sp.material.opacity = 0.25 + 0.75 * k;
        }
      });
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.heleneSparks = SP[0];   // the label's layer: shown with the sparks (in either form)
      lbl("״בשעה שהחמה זורחת ניצוצות יוצאין ממנה״ (יומא לז:)", 4.6, 54.6, 0, 1.3, "heleneSparks");
    }
    SH.helene = {
      mode: "rashi",
      set(m) { this.mode = m === "rambam" ? "rambam" : "rashi"; lampG.visible = this.mode === "rashi"; shamG.visible = this.mode === "rambam"; return this.mode; }
    };

    // ---------- 3. THE THIRTEEN SHOFAROT (Shekalim 6:1, 6:5) ----------
    // "שלשה עשר שופרות... היו במקדש". The Bartenura (Shekalim 2:1): "והיו עומדים בעזרה", learned from Jehoiada's chest - "ויתן אתו אצל
    // המזבח מימין בבוא איש בית ה'" (II Kings 12:10; Metzudat David: "בימין הבא אל הבית"). Here: in the Israelites' court (x 82.5..93.5) -
    // the nearest to the altar where one who brings his money may stand - north of the axis, to the right of one who comes in by Nikanor's
    // gate (a model choice). The form: "תבות צרות מלמעלה ורחבות מלמטה עקמות כעין שופר" (the Bartenura 6:1), "עגולות עקומות" (the
    // Rambam's commentary 6:1); the size and the metal - model choices.
    const shG = grp("shofarot", true);
    {
      const prof = [[0, 0], [0.52, 0], [0.56, 0.08], [0.52, 0.45], [0.44, 0.85], [0.33, 1.15], [0.24, 1.32], [0.2, 1.4], [0, 1.4]].map(([r, y]) => new Vector2(r, y));
      const body = new LatheGeometry(prof, 20);
      const neckCurve = new CatmullRomCurve3([new Vector3(0, 1.36, 0), new Vector3(0, 1.62, 0), new Vector3(0.12, 1.86, 0), new Vector3(0.38, 1.98, 0)]);
      const neck = new TubeGeometry(neckCurve, 16, 0.15, 10, false);
      const lip = new TorusGeometry(0.15, 0.04, 6, 16);
      // CHAMBERS_EAST_N2 (fix-n2): the Pinchas chamber now stands in the court of Israel (z -28.5..-19.5), so the thirteen chests stand in two
      // columns (x 85.5 and 88), seven rows 1.5 apart, from z -9.5 to -18.5 (one column, z -9.5..-34.7, until now)
      const X0 = 86.5, Z0 = -9.5, DZ = -1.5;   // the court of Israel's floor, east of the duchan (fix-b2, 22.11.2026, at fix-a2's request: the duchan and its steps moved 3 amot west, to touch the priests' court, x 82.5..85 - 84.0 until now stood on them)
      for (let i = 0; i < 13; i++) {
        const xi = i % 2 ? 88 : 85.5, z = Z0 + Math.floor(i / 2) * DZ, y = groundAt(xi, z, 40, LV.AZ);
        const b = new Group(); b.position.set(xi, y, z); b.rotation.y = Math.PI;   // the curved mouths toward the court (west)
        shG.add(b);
        mesh(b, body, M2.bronze, 0, 0, 0);
        mesh(b, neck, M2.bronze, 0, 0, 0);
        const l = mesh(b, lip, M2.gold, 0.38, 1.98, 0); l.rotation.y = Math.PI / 2;
      }
      lbl("שלשה עשר שופרות (שקלים ו, א; ו, ה)", X0, LV.AZ + 4.2, Z0 + 3 * DZ, 1.6);
    }

    // ---------- 4. THE CHAMBER OF THE VESSELS (Tamid 3:4) ----------
    // "נכנסו ללשכת הכלים, והוציאו משם תשעים ושלשה כלי כסף וכלי זהב". Tiferet Yisrael (Yachin, Tamid 3:4): "לא ידעתי מקומה. ואפשר
    // שהיתה באותן ל"ח לשכות שהיו סביב לכותלי ההיכל" - a label on the cells, not on one of them.
    lbl("לשכת הכלים — אפשר שבאחד מן התאים (תפארת ישראל, תמיד ג, ד)", -30, 50, -40.5, 1.6);

    // ---------- 5. BEIT HAEVEN - THE CHAMBER OF THE PRIEST WHO BURNS THE RED HEIFER (Parah 3:1; Yoma 2a) ----------
    // "ללשכה שעל פני הבירה, צפונה מזרחה, ובית אבן היתה נקראת". Two readings (the row "לשכת בית האבן — מקומה"): Rashi (Yoma 2a "במקצוע
    // מזרחית צפונית של עזרה היתה") with the Rambam (Parah Adumah 2:1 "ללשכה מוכנת בעזרה") - in the Azara's north-east corner (the
    // default); Tosafot (Yoma 2a, "ומאי שנא") "ללשכה שעל פני הבירה שחוץ לעזרה" - outside the Azara, to its north-east. Its size, its height,
    // its door and the place outside - model choices.
    const beIn = grp("beitEvenIn", true), beOut = grp("beitEvenOut", false);
    const chamber = (g, x0, x1, z0, z1, y, doorSide, name) => {
      const T = 1, HH = 9, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, lx = x1 - x0, lz = z1 - z0;
      // 2.0.8: occlude false - a small chamber is never ghosted (the view's rays ghosted its walls as if they hid the target)
      const op = (side) => (side === doorSide ? [{ center: 0, width: 3, height: 6 }] : []);
      H2.wall(g, { axis: "x", length: lx, height: HH, thickness: T, mat: M2.stoneLight, occlude: false, cx, cz: z0 + T / 2, y, openings: op("n") });
      H2.wall(g, { axis: "x", length: lx, height: HH, thickness: T, mat: M2.stoneLight, occlude: false, cx, cz: z1 - T / 2, y, openings: op("s") });
      H2.wall(g, { axis: "z", length: lz - 2 * T, height: HH, thickness: T, mat: M2.stoneLight, occlude: false, cx: x0 + T / 2, cz, y, openings: op("w") });
      H2.wall(g, { axis: "z", length: lz - 2 * T, height: HH, thickness: T, mat: M2.stoneLight, occlude: false, cx: x1 - T / 2, cz, y, openings: op("e") });
      H2.box(g, lx + 0.4, 0.6, lz + 0.4, M2.stoneSmooth, cx, y + HH, cz);   // the roof
      lbl(name, cx, y + HH + 2.4, cz, 1.4, g.name);
    };
    {
      // BEIT_EVEN_UPPER_208 (the user, 13.11.2026 00:57: "אפשרות ג לשכת בית האבן"): the court's north-east corner holds the building
      // of the three chambers (THREE_CHAMBERS_195, the Gazit by the Boaz), so for Rashi and the Rambam the chamber is an UPPER STOREY on
      // its level roof (30-courts.js: the slab x 66.2..91.8, y 29.5..30.4), in the corner itself: x 81..91 (to the court's east wall),
      // z -67.5..-57.5 (from the court's north line), its door west, to the roof. MODEL CHOICE: no source gives its storey, size,
      // door or the way up. With the chambers' roofs open (ctx2.lishkotCut) it goes with the roof.
      const yU = groundAt(86, -62.5, 60, 30.4);
      const n0 = beIn.children.length;
      chamber(beIn, 81, 91, -67.5, -57.5, yU, "w", "לשכת בית האבן — לרש״י ולרמב״ם: בקרן המזרחית־צפונית. במודל: עלייה על בניין שלוש הלשכות (בחירת מודל)");
      if (Array.isArray(ctx2.lishkotCut)) for (const m of beIn.children.slice(n0)) ctx2.lishkotCut.push(m);
      SH.beitEvenUpper = { y: yU, at: [86, yU, -62.5] };
      const yo = groundAt(86, -96, 60, LV.HAR);
      chamber(beOut, 81, 91, -101, -91, yo, "s", "לשכת בית האבן — לתוספות, חוץ לעזרה");
    }
    SH.beitEven = {
      mode: "rashi",
      set(m) { this.mode = m === "tosafot" ? "tosafot" : "rashi"; beIn.visible = this.mode === "rashi"; beOut.visible = this.mode === "tosafot"; return this.mode; }
    };

    // ---------- 7b. לשכת חשאים (CHASHAIM_208; the user, 12.11.2026 22:56: "לשכת חשאים תעשה בעזרה") ----------
    // Shekalim 5:6 "שתי לשכות היו במקדש, אחת לשכת חשאים ואחת לשכת הכלים. לשכת חשאים, יראי חטא נותנים לתוכה בחשאי, ועניים בני טובים
    // מתפרנסים מתוכה בחשאי"; Tosefta Shekalim 2:16 "כשם שהיתה לשכת חשאין במקדש, כך היתה בכל עיר ועיר". No source gives its place - the
    // Raavad (Melechet Shlomo on Tamid 3:5): "ולא ידענא אי דוקא במקדש קאמר... או בעזרה... לפיכך צריכה עיון באיזה מקום היתה עומדת". The
    // user's word: in the court. MODEL CHOICE: a small chamber against the court's south wall, south of the house, between the third
    // southern gate (x -25..-11) and the ulam's corner, its door to the north; its size as the other small chambers here.
    {
      const chG = grp("chashaim", true);
      const yC = groundAt(3, 63, 60, LV.KOH);
      const wallHit = castFrom([3, yC + 2.5, 52], [0, 0, 1], null);
      const zW = wallHit && wallHit.z > 58 && wallHit.z < 72 ? wallHit.z - 0.02 : 66.8;
      chamber(chG, -1, 7, zW - 7.5, zW, yC, "n", "לשכת חשאים (שקלים ה, ו) — מקומה: בחירת מודל");
      SH.chashaim = { at: [3, yC, zW - 3.75], group: chG };
    }

    // ---------- 8. THE ULAM'S COURSES IN THE RAMBAM'S READING (his commentary, Middot 3:6; Beit HaBechirah 4:9; the Meiri) ----------
    // "וכן סביב לכתלי האולם מלמטה עד למעלה כך היו אמה אחת חלק ורבד שלש אמות. ואמה חלק ורבד שלש אמות עד למעלה... ורבד העליון היה
    // רחבו ארבע אמות". On the ulam's front (x 17.5, z -50..50, y 22..110.5): from the top - a course of four, then an amah plain and a
    // course of three, down to the floor; round the doorway (z -10..10 below 62) and the beams and the gold band over it (z -15..15
    // below 76) the courses stop. How far a course stands out - half an amah, a model choice. Shown with the Rambam's steps only.
    const crs = grp("ulamCoursesRambam", false);
    {
      const X = 17.5, D = 0.5, YB = 22, YT = 110.5;
      const band = (y0, h) => {
        const cut = y0 < 62 ? 10 : y0 < 76 ? 15.5 : 0;
        const segs = cut ? [[-50, -cut], [cut, 50]] : [[-50, 50]];
        for (const [a, b] of segs) H2.box(crs, D, h, b - a, M2.stoneSmooth, X + D / 2, y0, (a + b) / 2);
      };
      let top = YT - 4;
      band(top, 4);
      while (top - 4 >= YB) { top -= 4; band(top, 3); }   // an amah plain, then a course of three
    }
    if (SH.ulamSteps && typeof SH.ulamSteps.set === "function") {
      const set0 = SH.ulamSteps.set.bind(SH.ulamSteps);
      SH.ulamSteps.set = (m) => { const r = set0(m); crs.visible = SH.ulamSteps.mode === "rambam"; return r; };
      crs.visible = SH.ulamSteps.mode === "rambam";
    }

    // ---------- ב. THE DOOR OF THE LEPERS' CHAMBER (both readings of the four chambers) ----------
    // No source mentions a door - a model choice (the user: "וללשכת המצורעים צריך להוסיף דלת", "ב' שתיהן"). Inside the corners (Tosafot Yom
    // Tov, the default): two cedar leaves in its doorway (30-courts.js: the partition at x 133.5, its doorway z -50.5..-44.5, 9 high over
    // the women's court's floor, y 6). The Rosh's (the chambers outside, open to the court): a wall like the partitions, 12 high, along
    // the court's line (z -67.5, x 93.5..131) with a doorway and its leaves - for this chamber only.
    const dIn = grp("lepersDoorIn", true), dOut = grp("lepersDoorRosh", false);
    {
      const Y = LV.EZN;
      for (const s of [-1, 1]) H2.box(dIn, 0.3, 9, 2.95, M2.cedar, 133.5, Y, -47.5 + s * 1.5);
      H2.wall(dOut, { axis: "x", length: 37.5, height: 12, thickness: 2.5, mat: M2.stoneLight, cx: 112.25, cz: -67.5, y: Y, openings: [{ center: 0, width: 6, height: 9 }] });
      H2.box(dOut, 8.4, 0.9, 3.2, M2.stoneSmooth, 112.25, Y + 9, -67.5);   // the lintel
      for (const s of [-1, 1]) H2.box(dOut, 2.95, 9, 0.3, M2.cedar, 112.25 + s * 1.5, Y, -67.5);
      lbl("דלת לשכת המצורעים — בחירת מודל", 112.25, Y + 14, -67.5, 1.2, "lepersDoorRosh");
      // ROSH_DOORS_211 (stage ב, point 26; the user: V - "Enclose the four like the lepers'"): in the Rosh's reading the other three
      // chambers get the same wall, doorway and leaves on the court's line - the oils' (south-west, mirrored), the wood's (north-east)
      // and the Nazirites' (south-east): each wall from the outer side wall's middle to the inner side wall's face, as the lepers'. A
      // model choice, as that one (the cards say so).
      for (const [wx, wz] of [[112.25, 67.5], [209.75, -67.5], [209.75, 67.5]]) {
        H2.wall(dOut, { axis: "x", length: 37.5, height: 12, thickness: 2.5, mat: M2.stoneLight, cx: wx, cz: wz, y: Y, openings: [{ center: 0, width: 6, height: 9 }] });
        H2.box(dOut, 8.4, 0.9, 3.2, M2.stoneSmooth, wx, Y + 9, wz);
        for (const s of [-1, 1]) H2.box(dOut, 2.95, 9, 0.3, M2.cedar, wx + s * 1.5, Y, wz);
      }
    }
    if (SH.eznChambers && typeof SH.eznChambers.set === "function") {
      const set0 = SH.eznChambers.set.bind(SH.eznChambers);
      SH.eznChambers.set = (m) => { const r = set0(m); const out = SH.eznChambers.mode === "outside"; dIn.visible = !out; dOut.visible = out; return r; };
    }

    // ---------- NORTH_211 (stage ב, point 35; the user: V - "Toggle with the three, each in a colour"): THE NORTH FOR SLAUGHTERING THE MOST HOLY ----------
    // Yoma 36a (107:851): "איזהו צפון — מקיר של מזבח צפוני ועד כותל העזרה, וכנגד כל המזבח כולו צפון, דברי רבי יוסי ברבי יהודה. רבי
    // אלעזר ברבי שמעון מוסיף אף בין האולם ולמזבח. רבי מוסיף אף מקום דריסת רגלי הכהנים ואף מקום דריסת רגלי ישראל. אבל מן החליפות ולפנים
    // הכל מודים שפסול". Rashi (2157:1323-1326): "שלשים ושתים אמה שכנגד המזבח בצפון... אבל שלא כנגד המזבח לצד מערב ולצד מזרח... אינו צפון
    // לשחיטה"; R. Elazar - "כל חלק צפוני לצד מערב" (and 1322: "מחצי פתח ההיכל ולצפון בין האולם למזבח"); Rebbi - "אף כל צפון העזרה
    // שבאחת עשרה אמה של מקום דריסת רגלי הכהנים עד כותל מזרחי של עזרה". Patches on the floor, each opinion's addition in its own colour,
    // cumulative (Rashi 1330: "דרבי נמי אית ליה בין האולם ולמזבח צפון"): green - opposite the altar, from its north face to the wall;
    // blue - between the ulam and the altar, from the middle of the house's door northward; orange - east of the altar to the court's
    // east wall, the same; red - "מן החליפות ולפנים", north of the ulam's wings and the house. Fitted to the altar's place and measures
    // (ctx2.shared.altarPlace, altarMeasures) when shown. The southern line of the two additions - Rashi's (the middle of the court) or the
    // Rambam's square (BHB 5:15-16, to the altar's wall line): NORTH_LINE_211, a switch (setLine). The colours - model choices.
    {
      const NG = grp("northZones", false);
      const Y = LV.KOH, ZN = -67.5;
      // the floor under the patches: the courts' slabs and the steps are long north-south boxes under 24.5 - their tops, by x (the highest
      // of a few samples along z), so that a patch lies on the priests' court (16), on the ulam's steps and on Israel's court (13.5) alike
      let cands = null;
      const collect = () => {
        cands = [];
        const bb = new Box3();
        ctx2.root.updateMatrixWorld(true);
        ctx2.root.traverse((o) => {
          if (!o.isMesh || o.isInstancedMesh || o.isSprite) return;
          for (let q = o; q; q = q.parent) if (q === NG) return;
          if (o.material && o.material.transparent && o.material.opacity < 0.6) return;
          try { bb.setFromObject(o); } catch (_) { return; }
          if (bb.max.y < 12 || bb.max.y > 24.5 || bb.max.z - bb.min.z < 10 || bb.max.x < 10 || bb.min.x > 96) return;
          cands.push({ o, x0: bb.min.x, x1: bb.max.x, z0: bb.min.z, z1: bb.max.z, top: bb.max.y });
        });
      };
      const floorAt = (x) => {
        if (!cands) collect();
        let best = -1;
        for (const c of cands) {
          if (x < c.x0 || x > c.x1) continue;
          let vis = true; for (let q = c.o; q; q = q.parent) if (q.visible === false) { vis = false; break; }
          if (!vis) continue;
          for (const zs of [-60, -40, -20, -6]) if (zs >= c.z0 && zs <= c.z1) { if (c.top > best) best = c.top; break; }
        }
        return best > 0 ? best : Y;
      };
      const mk = (color, op) => {
        const g2 = new Group();
        const pm = new MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false }), fm = new MeshBasicMaterial({ color });
        const unit = new BoxGeometry(1, 1, 1), pool = [];
        NG.add(g2);
        const piece = (i, mat) => { if (!pool[i]) { pool[i] = new Mesh(unit, mat); pool[i].userData.noPick = true; g2.add(pool[i]); } pool[i].visible = true; return pool[i]; };
        return { g: g2, fit(x0, x1, z0, z1, flat) {
          let n = 0;
          const d = z1 - z0, zc = (z0 + z1) / 2;
          const xs = [];
          for (let x = x0; x < x1 - 1e-6; x += 1) xs.push([x, Math.min(x + 1, x1)]);
          xs.forEach(([a, b], i) => {
            const w = b - a, xc = (a + b) / 2, y = flat ? Y : floorAt(xc);
            const p0 = piece(n++, pm); p0.material = pm; p0.scale.set(w, 0.04, d); p0.position.set(xc, y + 0.08, zc);
            for (const zz of [z0, z1]) { const b2 = piece(n++, fm); b2.material = fm; b2.scale.set(w, 0.22, 0.45); b2.position.set(xc, y + 0.13, zz); }
            if (i === 0 || i === xs.length - 1) { const b3 = piece(n++, fm); b3.material = fm; b3.scale.set(0.45, 0.22, d); b3.position.set(i === 0 ? a : b, y + 0.13, zc); }
          });
          for (let i = n; i < pool.length; i++) pool[i].visible = false;
        } };
      };
      const P1 = mk(0x37b24d, 0.38), P2 = mk(0x3a7cff, 0.34), P3 = mk(0xff9124, 0.34), PX = mk(0xe03131, 0.22);
      const L1 = { text: "רבי יוסי ברבי יהודה — כנגד כל המזבח, מקירו הצפוני ועד כותל העזרה", x: 0, y: Y + 2.6, z: 0, size: 1.7, layer: "northZones" };
      const L2 = { text: "רבי אלעזר ברבי שמעון מוסיף — בין האולם ולמזבח", x: 0, y: Y + 2.6, z: 0, size: 1.7, layer: "northZones" };
      const L3 = { text: "רבי מוסיף — מקום דריסת רגלי הכהנים ומקום דריסת רגלי ישראל", x: 0, y: Y + 2.6, z: 0, size: 1.7, layer: "northZones" };
      const LX = { text: "״מן החליפות ולפנים — הכל מודים שפסול״ (יומא לו.)", x: -10, y: Y + 3, z: -58.5, size: 1.6, layer: "northZones" };
      // NORTH_LINE_211 (the user, 15.11.2026 13:35: "גבול הצפון לשתי השיטות כמתג"): the southern line of the two additions - Rashi's, the
      // middle of the court ("מחצי פתח ההיכל ולצפון", 2157:1322), or the Rambam's, the line of the altar's north wall ("מכתל צפוני של
      // עזרה עד כתל המזבח... כל המרבע הזה הוא הנקרא צפון", BHB 5:15-16, 337:90-91); its label by the line, east of the altar
      const L4 = { text: "הגבול הדרומי לרש״י — אמצע העזרה (״מחצי פתח ההיכל ולצפון״)", x: 0, y: Y + 2.0, z: 0, size: 1.2, layer: "northZones" };
      const L5 = { text: "הגבול הדרומי לרמב״ם — קו כותל המזבח (בית הבחירה ה, טו–טז)", x: 0, y: Y + 2.0, z: 0, size: 1.2, layer: "northZonesOff" };
      ctx2.labels.push(L1, L2, L3, LX, L4, L5);
      const moveL = (l, x, z) => {
        const ox = l.x, oz = l.z; l.x = x; l.z = z;
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        if (lg) for (const spr of lg.children) if ((spr.userData && spr.userData.label === l) || (Math.abs(spr.position.x - ox) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3 && Math.abs(spr.position.y - l.y) < 1e-3)) { spr.position.set(l.x, l.y, l.z); break; }
      };
      const N = { mode: "rebbi", line: "rashi", on: false };
      const apply = () => {
        const AP = SH.altarPlace, dz = AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5;
        const yose = SH.altarMeasures && SH.altarMeasures.mode === "yose";
        const ax0 = yose ? 43.5 : 39.5, ax1 = 71.5, aN = -19.5 + dz;   // the base's west and east faces, its north face (the north-east corner fixed for R. Yose's 28)
        const mid = N.line === "rambam" ? aN : 0;   // NORTH_LINE_211
        P1.fit(ax0, ax1, ZN, aN);
        P2.fit(17.5, ax0, ZN, mid);
        P3.fit(ax1, 93.5, ZN, mid);
        PX.fit(-93.5, 17.5, ZN, -50, true);
        moveL(L1, (ax0 + ax1) / 2, (ZN + aN) / 2);
        moveL(L2, (17.5 + ax0) / 2, -24);
        moveL(L3, (ax1 + 93.5) / 2, -24);
        moveL(L4, (ax1 + 93.5) / 2, 1.6);
        moveL(L5, (ax1 + 93.5) / 2, aN + 1.6);
        const k = N.mode === "yose" ? 1 : N.mode === "elazar" ? 2 : 3;
        P1.g.visible = true; P2.g.visible = k >= 2; P3.g.visible = k >= 3; PX.g.visible = true;
        L2.layer = k >= 2 ? "northZones" : "northZonesOff"; L3.layer = k >= 3 ? "northZones" : "northZonesOff";
        L4.layer = k >= 2 && N.line !== "rambam" ? "northZones" : "northZonesOff"; L5.layer = k >= 2 && N.line === "rambam" ? "northZones" : "northZonesOff";
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        if (lg) for (const spr of lg.children) { const l = spr.userData && spr.userData.label; if (l === L2 || l === L3 || l === L4 || l === L5) spr.userData.layers = [l.layer]; }
        NG.visible = N.on;
      };
      ctx2.layers.northZonesOff = (() => { const g0 = new Group(); g0.visible = false; return g0; })();
      SH.northZones = { get mode() { return N.mode; }, get line() { return N.line; }, set(m) { N.mode = m === "yose" || m === "elazar" ? m : "rebbi"; apply(); return N.mode; },
        setLine(l) { N.line = l === "rambam" ? "rambam" : "rashi"; apply(); return N.line; } };
      SH.features = SH.features || {};
      SH.features.northZones = { key: "northZones", isOn: () => N.on, on: () => { N.on = true; apply(); }, off: () => { N.on = false; NG.visible = false; } };
      // ZONES_FOLLOW_211 (the function review, F1-09): the zones were laid out for the altar's place and measure of the moment they came on;
      // when a row moved the altar while they showed (the presentation's slides do so), they stayed behind. They follow now.
      { let k0 = ""; if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (!N.on) { k0 = ""; return; } const AP = SH.altarPlace, AM = SH.altarMeasures; const k = (AP ? AP.current : "") + "|" + (AM ? AM.mode : ""); if (k0 && k !== k0) apply(); k0 = k; }); }
    }

    // ---------- TRIBES_211 (stage ב, point 20; the user: V "לסמן גם במודל", and 15.11.2026 17:10 - "יהודה ובנימין אפשרות ב"): THE PORTIONS
    // OF YEHUDAH AND BINYAMIN AND THE STRIP ----------
    // Yoma 12a: "מה היה בחלקו של יהודה — הר הבית, הלשכות והעזרות. ומה היה בחלקו של בנימין — אולם והיכל ובית קדשי הקדשים, ורצועה היתה
    // יוצאה מחלקו של יהודה ונכנסת לחלקו של בנימין, ובה היה מזבח בנוי". Rashi there (2157:332): "צד המזרחי רוחב הר הבית, עזרת נשים כולה,
    // ועזרת ישראל כולה, י״א אמה של מקום רגלי דריסת הכהנים... ושם המזבח מתחיל. משם ולמערב בחלקו של בנימין, אלא שבמקום מושב המזבח
    // יוצאה רצועה מחלקו של יהודה ונכנסה לקרן מזרחית דרומית". Rashi Zevachim 53b (2191:2590-2591): "אמה במזרחו אמה בדרומו... כשמגיע לקרן
    // מזרחית צפונית היתה כלה בסמוך לקרן אמה... כשמגעת לקרן דרומית מערבית כלה בסמוך לקרן אמה"; "והרצועה היתה יוצאה בדרום למזבח ונכנסת
    // בחלקו של בנימין... באה בתוך חלקו של בנימין בדרומו של מזבח, ומזבח אוכל בה אמה". So: the border runs north-south on the line of the
    // altar's east face; east of it, Yehudah's (gold) - the priests' eleven amot, the court of Israel and the women's court (the Temple
    // Mount's east side - a label); west of it, Binyamin's (blue); the strip - Yehudah's - south of the altar, from its south face's inner
    // amah (the SW amah out) to the court's south wall (the user's option ב; how far it reaches south - a model choice, no source says),
    // and the altar's two bands in Yehudah's portion as gold columns (the east amah without its north end's amah, the south amah without
    // its west end's amah). Floors as the north's patches (NORTH_211): the courts at their floors' heights, the rest level. A place's
    // feature (untimed), fitted to the altar's place and measures. The colours - model choices.
    {
      const TG = grp("tribes", false);
      const KY = LV.KOH;
      let cands = null;
      const collect = () => {
        cands = [];
        const bb = new Box3();
        ctx2.root.updateMatrixWorld(true);
        ctx2.root.traverse((o) => {
          if (!o.isMesh || o.isInstancedMesh || o.isSprite) return;
          for (let q = o; q; q = q.parent) if (q === TG) return;
          if (o.material && o.material.transparent && o.material.opacity < 0.6) return;
          try { bb.setFromObject(o); } catch (_) { return; }
          if (bb.max.y < 12 || bb.max.y > 24.5 || bb.max.z - bb.min.z < 10 || bb.max.x < 60 || bb.min.x > 96) return;
          cands.push({ o, x0: bb.min.x, x1: bb.max.x, z0: bb.min.z, z1: bb.max.z, top: bb.max.y });
        });
      };
      const floorAt = (x) => {   // east of the altar: the priests' court (16), the duchan's steps, Israel's court (13.5)
        if (!cands) collect();
        let best = -1;
        for (const c of cands) {
          if (x < c.x0 || x > c.x1) continue;
          let vis = true; for (let q = c.o; q; q = q.parent) if (q.visible === false) { vis = false; break; }
          if (!vis) continue;
          for (const zs of [-60, -40, -20, -6]) if (zs >= c.z0 && zs <= c.z1) { if (c.top > best) best = c.top; break; }
        }
        return best > 0 ? best : KY;
      };
      const unit = new BoxGeometry(1, 1, 1);
      const mk = (color, op) => {
        const g2 = new Group();
        const pm = new MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false }), fm = new MeshBasicMaterial({ color });
        const pool = [];
        TG.add(g2);
        const piece = (i, mat) => { if (!pool[i]) { pool[i] = new Mesh(unit, mat); pool[i].userData.noPick = true; g2.add(pool[i]); } pool[i].visible = true; pool[i].material = mat; return pool[i]; };
        let n = 0;
        return { g: g2, begin() { n = 0; }, end() { for (let i = n; i < pool.length; i++) pool[i].visible = false; },
          // a patch x0..x1 by z0..z1: by its floor (y: a number - level; null - by floorAt, a strip an amah wide), its edges as borders
          fit(x0, x1, z0, z1, y, edges = [1, 1, 1, 1]) {
            const d = z1 - z0, zc = (z0 + z1) / 2, xs = [];
            if (y == null) { for (let x = x0; x < x1 - 1e-6; x += 1) xs.push([x, Math.min(x + 1, x1)]); } else xs.push([x0, x1]);
            xs.forEach(([a, b], i) => {
              const w = b - a, xc = (a + b) / 2, yy = y == null ? floorAt(xc) : y;
              const p0 = piece(n++, pm); p0.scale.set(w, 0.04, d); p0.position.set(xc, yy + 0.08, zc);
              if (edges[0]) { const b2 = piece(n++, fm); b2.scale.set(w, 0.22, 0.45); b2.position.set(xc, yy + 0.13, z0); }
              if (edges[1]) { const b2 = piece(n++, fm); b2.scale.set(w, 0.22, 0.45); b2.position.set(xc, yy + 0.13, z1); }
              if (edges[2] && i === 0) { const b3 = piece(n++, fm); b3.scale.set(0.45, 0.22, d); b3.position.set(a, yy + 0.13, zc); }
              if (edges[3] && i === xs.length - 1) { const b3 = piece(n++, fm); b3.scale.set(0.45, 0.22, d); b3.position.set(b, yy + 0.13, zc); }
            });
          },
          column(x0, x1, z0, z1, y0, y1) { const c = piece(n++, pm); c.scale.set(x1 - x0, y1 - y0, z1 - z0); c.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); } };
      };
      const YE = mk(0xe39b12, 0.52), YS = mk(0xd98a00, 0.6), BI = mk(0x3d7fd6, 0.42);   // (the courts' floors are bright - stronger than the north's patches)
      const TL1 = { text: "חלקו של יהודה — מקום דריסת רגלי הכהנים, עזרת ישראל ועזרת הנשים (רש״י יומא יב.)", x: 0, y: KY + 2.8, z: 0, size: 1.7, layer: "tribes" };
      const TL2 = { text: "חלקו של בנימין — המזבח, האולם, ההיכל ובית קדשי הקדשים", x: 0, y: KY + 2.8, z: 0, size: 1.7, layer: "tribes" };
      const TL3 = { text: "הרצועה — מחלקו של יהודה, בדרום המזבח ועד כותל העזרה (עד היכן — בחירת מודל)", x: 0, y: KY + 2.4, z: 0, size: 1.5, layer: "tribes" };
      const TL4 = { text: "״מזבח אוכל בחלקו של יהודה אמה״ — במזרח ובדרום; לכן אין יסוד בקרן דרומית מזרחית (זבחים נג:)", x: 0, y: KY + 11.5, z: 0, size: 1.3, layer: "tribes" };
      const TL5 = { text: "הר הבית — צדו המזרחי בחלקו של יהודה (רש״י יומא יב.)", x: 290, y: 2.6, z: -120, size: 3.2, layer: "tribes" };
      ctx2.labels.push(TL1, TL2, TL3, TL4, TL5);
      const moveL = (l, x, z) => {
        l.x = x; l.z = z;
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        if (lg) for (const spr of lg.children) if (spr.userData && spr.userData.label === l) spr.position.set(x, spr.position.y, z);
      };
      let on = false;
      const apply = () => {
        const AP = SH.altarPlace, dz = AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5;
        const yose = SH.altarMeasures && SH.altarMeasures.mode === "yose";
        const ax0 = yose ? 43.5 : 39.5, ax1 = 71.5, aN = -19.5 + dz, aS = aN + (yose ? 28 : 32);   // the base's faces (the NE corner fixed for R. Yose's 28)
        const sx0 = ax0 + 1, sz0 = aS - 1, ZS = 67.5, ZN = -67.5;
        YE.begin(); YS.begin(); BI.begin();
        YE.fit(ax1, 93.5, ZN, ZS, null, [1, 1, 1, 0]);                    // Yehudah's: the priests' eleven amot and Israel's court
        YE.fit(96, 231, ZN, ZS, LV.EZN, [1, 1, 0, 1]);                     // and the whole women's court
        YS.fit(sx0, ax1, sz0, ZS, KY, [1, 1, 1, 0]);                       // the strip, from the altar's south inner amah to the wall
        YS.column(ax1 - 1, ax1, aN + 1, aS, KY, KY + 9.3);                 // the altar's east band (its north end's amah out)
        YS.column(sx0, ax1 - 1, aS - 1, aS, KY, KY + 9.3);                 // and its south band (its west end's amah out)
        BI.fit(-93.5, sx0, ZN, ZS, KY, [1, 1, 1, 1]);                      // Binyamin's: west of the strip's line, the whole breadth
        BI.fit(sx0, ax1, ZN, sz0, KY, [1, 1, 0, 1]);                       // and north of the strip, up to the border on the altar's east face
        YE.end(); YS.end(); BI.end();
        moveL(TL1, (ax1 + 93.5) / 2 + 1, -30);
        moveL(TL2, -10, -55);
        moveL(TL3, (sx0 + ax1) / 2, (aS + ZS) / 2 + 6);
        moveL(TL4, ax1 + 1, aS + 1);
        TG.visible = on;
      };
      SH.features = SH.features || {};
      SH.features.tribes = { key: "tribes", timed: false, isOn: () => on, on: () => { on = true; apply(); }, off: () => { on = false; TG.visible = false; } };
      { let k0 = ""; if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (!on) { k0 = ""; return; } const AP = SH.altarPlace, AM = SH.altarMeasures; const k = (AP ? AP.current : "") + "|" + (AM ? AM.mode : ""); if (k0 && k !== k0) apply(); k0 = k; }); }   // ZONES_FOLLOW_211
    }

    // ---------- SIMCHA_MENOROT_211 (stage ב, points 10 / 37; the user: "מאושר" + a demonstration): THE GOLDEN LAMPS OF THE WATER-DRAWING ----------
    // Mishnah Sukkah 5:2-3 (56:52-53): "במוצאי יום טוב הראשון של חג, ירדו לעזרת נשים, ומתקנין שם תקון גדול. ומנורות של זהב היו שם,
    // וארבעה ספלים של זהב בראשיהן, וארבעה סלמות לכל אחד ואחד, וארבעה ילדים מפרחי כהנה ובידיהם כדים של שמן של מאה ועשרים לג, שהן מטילין
    // לכל ספל וספל. מבלאי מכנסי כהנים ומהמיניהן מהן היו מפקיעין, ובהן היו מדליקין, ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה".
    // Sukkah 52b (108:1355): "תנא: גובהה של מנורה חמשים אמה... ובידיהם כדי שמן של שלשים שלשים לוג, שהם כולם מאה ועשרים לוג"; and
    // (1357) "הכא סולמות, וזקיף טובא" - the ladders stood very upright. Yachin (772:520): "סולם לכל ספל". So here: FOUR lamps (their number
    // is not given - a model choice, the card says so), each a golden shaft fifty amot high with four golden cups at its head, a ladder
    // to each cup, and a young priest (white, the hat and the sash) at each ladder's foot with a jar of oil. The demonstration
    // (ctx2.shared.simchaDemo.start): the sixteen climb, pour, the wicks catch, they come down; the cups stay lit while the lamps are
    // shown. The lamps are not part of the building's everyday state: the feature simchaMenorot (a place's, untimed - they go when
    // another place is chosen), off by default. Their places in the court, the shaft's form, the cups' arms - model choices.
    {
      // SIMCHA_LAMPS_B2 (fix-b2, 22.11.2026 - the user's decisions 39, 45 and 46): the lamps now have a PLACE and a FORM.
      // THE PLACE (SH.simchaLamps.at): "mid" - four in the court, as until now; "corner" - one in each of the four chambers in the corners,
      // which were not roofed ("וארבע לשכות היו בארבע מקצעותיה... ולא היו מקורות", Middot 2:5, 89:16) - set by the roofing row when its
      // reading "in the name of Rav Chaim Kanievsky" is chosen (20-mount.js, ctx2.shared.harRoof.set): "שטח עזרת הנשים היה מקרה, ולכן יש
      // לומר ששמו את המנורות בלשכות שבפנות עזרת נשים, שלא היה להן גג" (the booklet of Sukkot, its list of sources, B201). The spots in
      // the chambers are where a lamp, its four ladders and its young priests stand clear of what each chamber holds (measured on the
      // model; in the wood chamber the ladders go diagonally, between the piles) - model choices.
      // THE FORM (SH.simchaLamps.form; the row "מנורות שמחת בית השואבה — צורתן"): "rashi" (the default) - golden shafts fifty amot high,
      // "לפי שהמנורות גבוהין חמשים אמה... והמנורות עולין למעלה הימנה" (Rashi Sukkah 51a, 2163:2408; Sukkah 52b, 108:1355); "ty" - the
      // Tiferet Yisrael (Yachin Sukkah 5:2, 772:520): "ונ"ל דלא שהיו המנורות של זהב כל כך גבוהות ועבות... אלא שהיו המנורות עומדות על
      // בימות גבוהות כל כך, או סביב שפת הגזוזטרא"; and 5:3 (772:532) "שהמנורות עומדות על כן גבוה נ' אמה" - drawn: a lamp of a few amot
      // on a stand of stone fifty amot high (the stand's form and stone, the lamp's size - model choices; the card names the balcony too).
      // Each place-and-form is a set of its own, built when first shown (SET), and the demonstration below runs the set shown.
      const MG = grp("simchaMenorot", false);
      const Y0 = LV.EZN, RB = 5.6;
      const SPOT = { mid: [[141, -20], [181, -20], [141, 20], [181, 20]], corner: [[106.5, -54.5], [205, -48], [124.5, 49.5], [201.5, 53.5]] };
      const SROT = { mid: [0, 0, 0, 0], corner: [0, Math.PI / 4, 0, 0] };
      const FORM = {
        rashi: { HH: 50, CUPR: 1.7, TOPY: Y0 + 50 - 1.0, cupS: 1 },
        ty: { HH: 50, CUPR: 1.25, TOPY: Y0 + 50 + 3.0, cupS: 0.62 }
      };
      const shaftG = new LatheGeometry([[0, 0], [2.1, 0], [2.1, 0.7], [1.3, 1.0], [0.8, 1.8], [0.66, 8], [0.55, 28], [0.48, 50 - 2.4], [0.9, 50 - 1.8], [0.55, 50 - 1.4], [0.5, 50 - 1.0], [0, 50 - 1.0]].map(([r, y]) => new Vector2(r, y)), 20);
      // the Tiferet Yisrael's lamp: a golden lamp of three amot (its base, a shaft, a knop under the arms) - on the stand's top (y 0 here)
      const tyLampG = new LatheGeometry([[0, 0], [0.62, 0], [0.62, 0.18], [0.38, 0.32], [0.24, 0.6], [0.2, 2.3], [0.42, 2.62], [0.26, 2.84], [0.24, 3.0], [0, 3.0]].map(([r, y]) => new Vector2(r, y)), 18);
      const cupG = new LatheGeometry([[0, 0], [0.3, 0], [0.34, 0.06], [0.62, 0.34], [0.7, 0.55], [0.66, 0.58], [0.58, 0.4], [0.3, 0.14], [0, 0.14]].map(([r, y]) => new Vector2(r, y)), 18);
      const oilM = new MeshStandardMaterial({ color: 0xc9a227, roughness: 0.25, metalness: 0.1 });
      const wickM = new MeshStandardMaterial({ color: 0xf2ecdc, roughness: 0.9, emissive: 0x302b22 });
      // a flame: a soft sprite (additive), drawn once
      const fcv = document.createElement("canvas"); fcv.width = 64; fcv.height = 128;
      {
        const c2 = fcv.getContext("2d"), gr = c2.createRadialGradient(32, 84, 2, 32, 84, 44);
        gr.addColorStop(0, "rgba(255,250,215,1)"); gr.addColorStop(0.3, "rgba(255,196,80,0.95)"); gr.addColorStop(0.65, "rgba(255,120,30,0.45)"); gr.addColorStop(1, "rgba(255,90,10,0)");
        c2.fillStyle = gr; c2.beginPath(); c2.moveTo(32, 4); c2.quadraticCurveTo(60, 70, 52, 100); c2.quadraticCurveTo(32, 126, 12, 100); c2.quadraticCurveTo(4, 70, 32, 4); c2.fill();
      }
      const ftx = new CanvasTexture(fcv); ftx.colorSpace = SRGBColorSpace;
      const hcv = document.createElement("canvas"); hcv.width = hcv.height = 64;
      {
        const c2 = hcv.getContext("2d"), gr = c2.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, "rgba(255,214,120,0.55)"); gr.addColorStop(0.5, "rgba(255,170,60,0.18)"); gr.addColorStop(1, "rgba(255,150,40,0)");
        c2.fillStyle = gr; c2.fillRect(0, 0, 64, 64);
      }
      const htx = new CanvasTexture(hcv); htx.colorSpace = SRGBColorSpace;
      const jarG = new LatheGeometry([[0, 0], [0.16, 0], [0.24, 0.12], [0.25, 0.34], [0.14, 0.52], [0.1, 0.6], [0.13, 0.66], [0, 0.66]].map(([r, y]) => new Vector2(r, y)), 12);
      const jarM = new MeshStandardMaterial({ color: 0xb06a3c, roughness: 0.85 });
      const YS = 1.3;
      const LAMP = { at: "mid", form: "rashi" };
      const SET = {};
      const setKey = (at, form) => "simchaSet_" + at + "_" + form;
      // the sets' groups (empty until first shown) - each a layer of its own, so that its labels show with it
      for (const at of ["mid", "corner"]) for (const form of ["rashi", "ty"]) {
        const G = new Group(); G.name = setKey(at, form); G.visible = at === "mid" && form === "rashi"; MG.add(G);
        ctx2.layers[G.name] = G;
        SET[G.name] = { G, at, form, built: false, flames: [], oils: [], halos: [], youths: [] };
      }
      const buildSet = (S) => {
        if (S.built) return S;
        S.built = true;
        const F = FORM[S.form], CUPR = F.CUPR, RT = CUPR + 0.8, TOPY = F.TOPY, G = S.G;
        const armG = new BoxGeometry(CUPR, 0.22 * (S.form === "ty" ? 0.6 : 1), 0.26 * (S.form === "ty" ? 0.6 : 1)); armG.translate(CUPR / 2, 0, 0);
        const rails = [], rungs = [];
        const railLen = Math.hypot(RB - RT, TOPY - 0.6 - Y0);
        const tilt = Math.atan2(RB - RT, TOPY - 0.6 - Y0);
        SPOT[S.at].forEach(([mx, mz], si) => {
          if (S.form === "rashi") { const sh = new Mesh(shaftG, M2.gold); sh.position.set(mx, Y0, mz); sh.castShadow = true; sh.receiveShadow = true; G.add(sh); }
          else {
            // the stand: a square pillar of stone, its foot and its top wider (model choices), and the golden lamp on it
            const st = H2.box(G, 2.4, F.HH - 1.4, 2.4, M2.stoneLight, mx, Y0 + 0.7, mz); st.castShadow = true;
            H2.box(G, 3.8, 0.7, 3.8, M2.stone, mx, Y0, mz);
            H2.box(G, 3.4, 0.7, 3.4, M2.stone, mx, Y0 + F.HH - 0.7, mz);
            const lp = new Mesh(tyLampG, M2.gold); lp.position.set(mx, Y0 + F.HH, mz); lp.castShadow = true; G.add(lp);
          }
          const r0 = SROT[S.at][si], c0 = Math.cos(r0), s0 = Math.sin(r0);
          [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([a, b]) => [a * c0 - b * s0, a * s0 + b * c0]).forEach(([dx, dz]) => {
            const yaw = Math.atan2(dx, dz);
            const arm = new Mesh(armG, M2.gold); arm.position.set(mx, TOPY - 0.35 * F.cupS, mz); arm.rotation.y = yaw - Math.PI / 2; G.add(arm);
            const cx = mx + dx * CUPR, cz = mz + dz * CUPR;
            const cup = new Mesh(cupG, M2.gold); cup.position.set(cx, TOPY - 0.3 * F.cupS, cz); cup.scale.setScalar(F.cupS); cup.castShadow = true; G.add(cup);
            const oil = new Mesh(new CylinderGeometry(0.6 * F.cupS, 0.6 * F.cupS, 0.03, 16), oilM); oil.position.set(cx, TOPY + 0.12 * F.cupS, cz); oil.visible = false; G.add(oil); S.oils.push(oil);
            const wick = new Mesh(new CylinderGeometry(0.09 * F.cupS, 0.11 * F.cupS, 0.5 * F.cupS, 8), wickM); wick.position.set(cx, TOPY + 0.2 * F.cupS, cz); G.add(wick);
            // LIVE_FIRE_304: the cup burns with the altar's live fire (40-altar.js, ctx2.shared.liveFlame) - "הפתילה העבה ביותר והבעירוה"
            // (the Tiferet Yisrael, 772:518); the soft sprite only where that fire is missing
            const live = typeof SH.liveFlame === "function" ? SH.liveFlame(G, cx, TOPY + 0.42 * F.cupS, cz, 0.36 * F.cupS, 1.3 * F.cupS, 1.0) : null;
            const fl = live || new Sprite(new SpriteMaterial({ map: ftx, transparent: true, depthWrite: false, blending: AdditiveBlending }));
            if (!live) { fl.position.set(cx, TOPY + 1.25 * F.cupS, cz); fl.scale.set(0.9 * F.cupS, 1.8 * F.cupS, 1); fl.renderOrder = 9; G.add(fl); }
            fl.visible = false; fl.userData.noPick = true; fl.userData.ph = S.flames.length * 1.3; fl.userData.k = F.cupS; S.flames.push(fl);
            // the ladder in the plane of the shaft and this cup, its foot RB from the shaft, its head just under the cup
            const ux = mx + dx * (RB + RT) / 2, uz = mz + dz * (RB + RT) / 2, uy = (Y0 + TOPY - 0.6) / 2;
            for (const sd of [-0.5, 0.5]) rails.push([ux + dz * sd, uy, uz - dx * sd, yaw, tilt]);
            for (let h = 0.9; h < TOPY - 0.6 - Y0; h += 0.9) {
              const k = h / (TOPY - 0.6 - Y0), r = RB + (RT - RB) * k;
              rungs.push([mx + dx * r, Y0 + h, mz + dz * r, yaw]);
            }
            S.youthSpots = S.youthSpots || [];
            S.youthSpots.push([mx, mz, dx, dz, si, cx, cz]);
          });
          const halo = new Sprite(new SpriteMaterial({ map: htx, transparent: true, depthWrite: false, blending: AdditiveBlending }));
          halo.position.set(mx, TOPY + 1, mz); halo.scale.set(16, 16, 1); halo.visible = false; halo.userData = { noPick: true }; G.add(halo); S.halos.push(halo);
        });
        {
          const mm = new Matrix4(), q = new Quaternion(), e = new Euler(), vp = new Vector3(), vs = new Vector3(1, 1, 1);
          const rI = new InstancedMesh(new BoxGeometry(0.14, railLen, 0.14), M2.cedar, rails.length);
          rails.forEach(([x, y, z, yaw, t], i) => { e.set(0, 0, 0); q.setFromEuler(e.set(-t, yaw, 0, "YXZ")); mm.compose(vp.set(x, y, z), q, vs); rI.setMatrixAt(i, mm); });
          const gI = new InstancedMesh(new BoxGeometry(1.0, 0.09, 0.09), M2.cedar, rungs.length);
          rungs.forEach(([x, y, z, yaw], i) => { q.setFromEuler(e.set(0, yaw, 0, "YXZ")); mm.compose(vp.set(x, y, z), q, vs); gI.setMatrixAt(i, mm); });
          for (const im of [rI, gI]) { im.instanceMatrix.needsUpdate = true; im.castShadow = false; im.receiveShadow = true; im.userData.noPick = true; G.add(im); }
        }
        // the sixteen young priests, each in a group of his own (it climbs); his face to the shaft, a jar in his hands
        try {
          const PPy = tm_people(ctx2);
          S.youthSpots.forEach(([mx, mz, dx, dz, si, cx, cz], k) => {
            const YG = new Group();
            // SIMCHA_POUR_214 (the user, 16.11.2026 17:23: "השפיכה מאבדת את הכן ושוכפת החוצה"): he climbs ON the ladder, 0.22 out from its
            // rungs all the way, and stops on its highest rung (TOPY - 1.3): the cup at his waist, the jar at his chest
            const foot = [mx + dx * (RB + 0.22), Y0, mz + dz * (RB + 0.22)], top = [mx + dx * (RT + 0.26), TOPY - 1.3, mz + dz * (RT + 0.26)];
            YG.position.set(foot[0], foot[1], foot[2]);
            YG.rotation.y = Math.atan2(-dx, -dz);   // his face to the shaft
            G.add(YG);
            PPy.crowd(YG, [[0, 0, 0]], { y: 0, s: YS, pose: "stand", kind: "kohen", robe: 0xf1ede2, young: true, avnet: false, exact: true, name: "pirchaKehunah" });   // YOUNG_300: "ארבעה ילדים מפרחי כהנה" - dark hair, a short beard (until 2.0.18 white and grey too); fix-b2 (the user's decision 68 (1)): priestly garments without the sash (avnet: false - the kit's, fix-a2)
            const jar = new Mesh(jarG, jarM); jar.position.set(0, 1.05 * YS, 0.36 * YS); jar.castShadow = true; YG.add(jar);
            // the oil's stream from the jar's mouth into the cup (SIMCHA_POUR_214): a thin rod, set every frame of the pouring
            const run = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true).translate(0, -0.5, 0), oilM); run.visible = false; run.userData.noPick = true; G.add(run);
            S.youths.push({ G: YG, jar, foot, top, cup: k, run, cx, cz });
          });
        } catch (_) {}
        S.TOPY = TOPY;
        return S;
      };
      // NOTE 4 (the understandability review, U-42): the labels twice their size; and the demonstration explains itself with captions in
      // the Mishnah's words (Sukkah 5:2-3, 56:52-53), each shown while its part runs. SIMCHA_LAMPS_B2: each set has its own (its layer)
      const CAPT = ["״וארבעה ילדים מפרחי כהנה, ובידיהם כדים של שמן של מאה ועשרים לג״ (סוכה ה, ב)", "״שהן מטילין לכל ספל וספל״ (סוכה ה, ב)", "״ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״ (סוכה ה, ג)"];
      const CAPT_T = [[0, 8.5], [8.5, 15.8], [15.8, 23.5]];
      const capL = CAPT.map((c, i) => {
        const gr = new Group(); gr.visible = false; MG.add(gr);
        ctx2.layers["simchaCap" + i] = gr;
        return gr;
      });
      for (const k in SET) {
        const S = SET[k], F = FORM[S.form], TOPY = F.TOPY, [x0, z0] = SPOT[S.at][0];
        ctx2.labels.push({ text: "״ומנורות של זהב היו שם, וארבעה ספלים של זהב בראשיהן״ (סוכה ה, ב)", x: 161, y: TOPY + 6.5, z: 0, size: 3.2, layers: ["simchaMenorot", k] });
        ctx2.labels.push({ text: S.form === "rashi" ? "״גובהה של מנורה חמשים אמה״ (סוכה נב:)" : "״שהמנורות עומדות על כן גבוה נ׳ אמה״ (תפארת ישראל, סוכה ה, ג)", x: x0, y: TOPY + 3.2, z: z0, size: 2.2, layers: ["simchaMenorot", k] });
        if (S.at === "corner") ctx2.labels.push({ text: "המנורות בלשכות שבפינות — ״שלא היה להן גג״ (בשם הגר״ח קניבסקי)", x: 161, y: TOPY + 11, z: 0, size: 2.4, layers: ["simchaMenorot", k] });
        CAPT.forEach((c, i) => ctx2.labels.push(i === 1 ? { text: c, x: x0, y: TOPY + 6.2, z: z0, size: 1.2, layers: ["simchaMenorot", "simchaCap" + i, k] }
                                                      : { text: c, x: 161, y: TOPY - 6, z: 0, size: 3.0, layers: ["simchaMenorot", "simchaCap" + i, k] }));
      }
      const caps = (t) => CAPT_T.forEach((c, i) => { capL[i].visible = t >= c[0] && t < c[1]; });
      // the demonstration's clock (seconds from the start): 0-1.5 stand, 1.5-11.5 climb, 11.5-13.5 pour, 13.5-14.5 the wicks catch, 14.5-23 down
      const ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
      const D = { t0: -1, lit: false, held: -1, fl: 0 };
      let S = null;   // the set shown
      const cur = () => {
        const k = setKey(LAMP.at, LAMP.form);
        if (!S || S.G.name !== k) {
          if (S) resetSet(S);
          S = buildSet(SET[k]);
          for (const kk in SET) SET[kk].G.visible = kk === k;
        }
        return S;
      };
      // SIMCHA_POUR_214: the jar is lifted to his chest before the pouring and tilted toward the cup: its mouth over the cup's middle;
      // the oil runs from the mouth down into the cup
      const _mo = new Vector3();
      const pose = (t) => {
        const C = cur(), F = FORM[C.form];
        const up = ss(1.5, 11.5, t) * (1 - ss(14.5, 23, t)), pour = Math.sin(Math.PI * Math.max(0, Math.min(1, (t - 11.5) / 2)));
        const lift = ss(10.9, 11.5, t) * (1 - ss(13.5, 14.2, t));
        for (const Y of C.youths) {
          Y.G.position.set(Y.foot[0] + (Y.top[0] - Y.foot[0]) * up, Y.foot[1] + (Y.top[1] - Y.foot[1]) * up, Y.foot[2] + (Y.top[2] - Y.foot[2]) * up);
          Y.jar.rotation.x = 1.3 * pour;
          Y.jar.position.y = (1.05 + 0.36 * lift) * YS;
          const on = pour > 0.35;
          if (Y.run.visible !== on) Y.run.visible = on;
          if (on) {
            Y.G.updateMatrixWorld(true);
            Y.jar.localToWorld(_mo.set(0, 0.66, 0)); C.G.worldToLocal(_mo);
            const yb = F.TOPY + 0.12 * F.cupS;   // the oil's face in the cup
            Y.run.position.copy(_mo);
            Y.run.scale.y = Math.max(0.05, _mo.y - yb);
          }
        }
        C.oils.forEach((o) => { o.visible = t >= 12.3; });
        const lit = (i) => t >= 13.5 + (i % 4) * 0.25;
        C.flames.forEach((f, i) => { f.visible = lit(i); });
        C.halos.forEach((h, i) => { h.visible = t >= 13.6 + i * 0.15; });
        caps(t);
      };
      const resetSet = (C) => { for (const Y of C.youths) { Y.G.position.set(Y.foot[0], Y.foot[1], Y.foot[2]); Y.jar.rotation.x = 0; Y.jar.position.y = 1.05 * YS; Y.run.visible = false; } C.oils.forEach((o) => { o.visible = false; }); C.flames.forEach((f) => { f.visible = false; }); C.halos.forEach((h) => { h.visible = false; }); };
      // Cleanup must not build an unseen set: leaving another place or changing a roof can stop these lamps before first use.
      const reset = () => { caps(-1); D.t0 = -1; if (S) resetSet(S); };
      // SIMCHA_STOP_211 (the function review, F1-06 / F1-07; U-50): stop / pause / resume / restart, an entry in demoStops, and the two
      // flights fired by the demonstration's own clock. SIMCHA_LAMPS_B2: the first flight goes to the first lamp of the set shown
      const FLY = [[8.5, () => { const C = cur(), [x0, z0] = SPOT[C.at][0], T = FORM[C.form].TOPY; return [[x0 + 11, T + 3, z0 + 13], [x0, T - 4, z0]]; }], [15.8, () => [[215, 60, 80], [161, 30, 0]]]];
      SH.simchaDemo = {
        start() { if (!MG.visible) MG.visible = true; cur(); reset(); D.held = -1; D.fl = 0; D.t0 = performance.now() / 1000; },
        running() { return D.t0 >= 0; },
        stop() { D.held = -1; D.fl = 0; reset(); },
        pause() { if (D.t0 >= 0 && D.held < 0) D.held = performance.now() / 1000; },
        resume() { if (D.t0 >= 0 && D.held >= 0) { D.t0 += performance.now() / 1000 - D.held; D.held = -1; } },
        paused() { return D.held >= 0; },
        // SIMCHA_304: the rejoicing's demonstration runs the lamps by its own clock (t < 0: before the climb) - no flights, no labels
        drive(t) { if (!MG.visible) MG.visible = true; D.t0 = -1; D.held = -1; pose(t); caps(-1); },
        clear() { D.held = -1; D.fl = 0; reset(); },
        tex: { flame: ftx, halo: htx }
      };
      // SIMCHA_LAMPS_B2: the place and the form. at(): "mid" | "corner"; spots(): the four lamps' [x, z]; topY(): the cups' height
      SH.simchaLamps = {
        get at() { return LAMP.at; }, get form() { return LAMP.form; },
        spots() { return SPOT[LAMP.at].map((p) => p.slice()); },
        topY() { return FORM[LAMP.form].TOPY; },
        set(o) {
          if (o && (o.at === "mid" || o.at === "corner")) LAMP.at = o.at;
          if (o && (o.form === "rashi" || o.form === "ty")) LAMP.form = o.form;
          const run = D.t0 >= 0;
          // A roof choice changes the lamps' configuration even when their layer is hidden. Build only when actually shown/running.
          if (MG.visible || run) cur();
          if (!run && S) resetSet(S);
          if (ctx2.requestRender) ctx2.requestRender();
          return { at: LAMP.at, form: LAMP.form };
        }
      };
      (SH.demoStops || (SH.demoStops = [])).push({ id: "simcha-lamps", running: () => SH.simchaDemo.running(), stop: () => SH.simchaDemo.stop(),
        pause: () => SH.simchaDemo.pause(), resume: () => SH.simchaDemo.resume(), paused: () => SH.simchaDemo.paused(), restart: () => SH.simchaDemo.start() });
      SH.features = SH.features || {};
      SH.features.simchaMenorot = { key: "simchaMenorot", timed: false, isOn: () => MG.visible, on: () => { MG.visible = true; cur(); }, off: () => { MG.visible = false; reset(); } };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!MG.visible) return;
        const C = cur();
        const now = performance.now() / 1000;
        if (D.t0 >= 0 && D.held < 0) {
          const t = now - D.t0; pose(t);
          while (D.fl < FLY.length && t >= FLY[D.fl][0]) { const f = FLY[D.fl++][1](); try { if (typeof ctx2.flyTo === "function") ctx2.flyTo(f[0], f[1], 1600); } catch (_) {} }
          if (t > 23.5) { D.t0 = -1; caps(-1); }
        }
        for (const f of C.flames) if (f.visible && f.isSprite) { const kk = f.userData.k || 1, k = 0.85 + 0.15 * Math.sin(now * 9 + f.userData.ph) + 0.06 * Math.sin(now * 23 + f.userData.ph * 2); f.scale.set(0.9 * k * kk, 1.8 * (0.9 + 0.2 * k) * kk, 1); }
      });
    }
    // ---------- SHILOACH_305 (the user, 20.11.2026 01:21: "אתה יכול להוסיף את מעיין השילוח [איך היו מגיעים לשם"; 01:25: "1. א 2. זו ----------
    // 3. כהן"): THE SHILOACH AND THE WATER'S LIBATION. "נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער
    // המים, תקעו והריעו ותקעו. עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם" (Mishnah Sukkah 4:9, book 56, line 48); "ולמה נקרא שמו
    // שער המים. שבו מכניסין צלוחית של מים של נסוך בחג" (Middot 2:6); "שני שערי חלדה מן הדרום, משמשין כניסה ויציאה" (Middot 1:3); "שילוח
    // היה מוציא מים כאיסר" (the Yerushalmi, Sukkah 5:6). No source gives the way out of the mount or how far the spring was: the pool is
    // drawn at the bottom of the model's valley south of the mount (some 220 amot from its wall), the path to it from the western gate of
    // Chulda, its form and the pool's - model choices. Always: the pool, its stream and the path. In the demonstration: a priest with the
    // golden flask goes out by the Water Gate and the gate of Chulda, fills it at the Shiloach and comes back; two priests blow at the
    // Water Gate; he goes up the ramp, turns left and pours into the western bowl (40-altar.js: the bowls at x 43.05 / 43.95, z 9.4 of the
    // altar's frame - "מערבי של מים ומזרחי של יין"). Its walk is the walk engine's (ctx2.shared.walk); the walks are hurried.
    // SH.shiloach = { demo, stop, at(t), info, refs, POOL }.
    {
      const SHL = { POOL: [-133, 535.1], PW: 15, PD: 8, D: null, run: false, SP: { x: -135, z: 537, zT: 536.52 } };   // SHILOACH_WEST_B2 (the user, 14:34-14:35, questions 117 and 160 a): south of the mount and below it, on its south-western side (until now at x 25.5, z 541.4 - due south)   // SPRING_CAVE_B2: the pool before the rock, beside the path (until 22.11.2026 at [32, 550], 26 x 12, behind the rock)
      const K = SH.priestKit;
      const fnc = (f) => typeof f === "function";
      const smooth = (u) => u * u * (3 - 2 * u), lerp = (a, b, u) => a + (b - a) * u;
      const altDz = () => { const AP = SH.altarPlace; return AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5; };
      const groundY = (x, z, from) => { const y = fnc(SH.floorY) ? SH.floorY(x, from == null ? 40 : from, z) : -Infinity; return isFinite(y) ? y : -28; };
      // ---- always: the pool, its stream and the path (built when the terrain is there: on the first frame)
      const SG = new Group();
      SG.name = "shiloach";
      ctx2.root.add(SG);
      let built = false, Y0 = -55;
      const mPath = new MeshStandardMaterial({ color: 0xcbbd9a, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      // CHULDA_RAMPS_B2 (decision 103): from the foot of the western gate of Chulda's ramp (20-mount.js, ctx2.shared.chuldaRamp)
      const RP = SH.chuldaRamp || { z0: 335, zf: 364.5, yf: -28, yAt: (z) => -28 * Math.min(1, Math.max(0, (z - 335) / 29.5)) };
      const PATH = [[0, RP.zf + 1]].concat([[-6, 440], [-26, 468], [-58, 492], [-92, 512], [-122, 526], [-138.5, 531.5]].filter((q) => q[1] > RP.zf + 6));   // SHILOACH_WEST_B2: from the southern ramp's foot south and south-west, down the valley, to the spring
      const streamTo = (yb) => { const SP = SHL.SP; if (SHL.kit) { SHL.kit.setBottom(yb); return; } if (!SP.st) return; const h = Math.max(0.05, SP.y - yb); SP.st.position.set(SP.x, yb + h / 2, SP.zT); SP.st.scale.y = h; };   // SHILOACH_KIT_B2: the kit's fall
      const buildPool = () => {
        if (built) return;
        built = true;
        try { const D0 = buildDemo(); SHL.offF = measure(D0, ARM.fill, FILL_LEAN, 0); SHL.offP = measure(D0, ARM.pour, POUR_LEAN, TILT); } catch (e) { console.warn("[shiloach]", e && e.message); }
        // the spring's mouth (the user, 01:56, over the picture of the pouring: "הוא לא מוזג לתוך הספל למה" - and a flask held over a pool
        // that it could not reach would be the same fault): its height over the mouth of the flask held out under it - measured on the
        // priest's own figure (SHL.offF)
        const SP = SHL.SP, gy = groundY(SP.x, SP.z - 0.9, 20), offF = SHL.offF || { y: 1.2 };
        SP.gy = gy;
        SP.y = gy + Math.max(1.15, offF.y + 0.34);   // the opening
        SP.base = gy + 0.36;
        // SHILOACH_KIT_B2 (fix-b2, 22.11.2026 - the coordinator: "להוציא את כל בניית המעין... לקטע משותף, shared/frag/shiloach.js"): the
        // cliff, the small opening, the fall, the basin, the great pool, the green, the lights and the roar - one build for both houses
        // (tm_shiloach). Until now here: the pool's walls and water, a block of stone with a spout, a stone basin and a thin stream, a
        // hillside of rough rocks with a cave of churning water over the opening (SPRING_CAVE_B2), boulders, ferns and the rill
        SHL.kit = tm_shiloach(ctx2, { x: SP.x, z: SP.z, mouthY: SP.y, yaw: 0, ground: (x, z) => groundY(x, z, 20), parent: SG, seed: 5507, name: "shiloachSpring",
          basinY: SP.base, basinDz: 0.55, fallZ: SP.z - SP.zT, pool: null, lake: { dx: SHL.POOL[0] - SP.x, dz: SHL.POOL[1] - SP.z, rx: 3.2, rz: 2.3 },   // NATURAL_POOL_B2 (decision 122 b): the fall drops into a natural pool; the walled pool of before - gone
          lights: { torch: 85, moon: 34 }, sfx: (n, op) => { if (typeof SH.sfx === "function") SH.sfx(n, op); }, roar: { name: "water", dur: 4.5, gain: 3.2 } });
        Y0 = SHL.kit.pool ? SHL.kit.pool.y0 : gy;
        SP.base = SHL.kit.basinY;
        if (!(typeof SH.camLow === "number" && SH.camLow <= Y0 - 3)) SH.camLow = Y0 - 3;   // SHILOACH_WEST_B2: the eye (and the walk mode) may go down into the valley, to the spring
        SHL.springLight = SHL.kit.lights.torch;
        streamTo(SP.base);
        { const KT = SHL.kit, cam = ctx2.camera, V3 = new Vector3(SP.x, SP.y, SP.z);
          if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (!SHL.run && !(cam && cam.position.distanceTo(V3) < 70)) return; KT.tick(performance.now() / 1000); }); }
        // the path: a strip on the ground from the stairs' foot to the steps (sampled every 2 amot, 3.2 wide)
        const pts = [], pos = [], idx = [];
        for (let i = 0; i < PATH.length - 1; i++) { const a = PATH[i], b = PATH[i + 1], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2); for (let k = 0; k < n; k++) pts.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]); }
        pts.push(PATH[PATH.length - 1]);
        pts.forEach((p, i) => {
          const q = pts[Math.min(pts.length - 1, i + 1)], r0 = pts[Math.max(0, i - 1)], dx = q[0] - r0[0], dz = q[1] - r0[1], L = Math.hypot(dx, dz) || 1, nx = -dz / L * 1.6, nz = dx / L * 1.6;
          for (const s of [-1, 1]) { const x = p[0] + s * nx, z = p[1] + s * nz; pos.push(x, groundY(x, z, 20) + 0.06, z); }
          if (i > 0) { const k = 2 * i; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
        });
        const pg = new BufferGeometry();
        pg.setAttribute("position", new Float32BufferAttribute(pos, 3));
        pg.setIndex(idx);
        pg.computeVertexNormals();
        const pm = new Mesh(pg, mPath);
        pm.receiveShadow = true;
        SG.add(pm);
        SG.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
      };
      // LAZY_SPRING_B2 (release, 22.11.2026 - check.sh: the Second Temple's loading slower): the spring, its pool and path, and the demonstration's
      // figures (measured for the arm's reach; 104 in the procession now) are built when the eye comes within 300 amot of the spring, or when
      // the demonstration starts - not on the first frame
      const nearSpring = () => { const c = ctx2.camera; if (!c) return false; const dx = c.position.x - SHL.SP.x, dz = c.position.z - SHL.SP.z; return dx * dx + dz * dz < 300 * 300; };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (!built && fnc(SH.floorY) && nearSpring()) { try { buildPool(); } catch (e) { console.warn("[shiloach]", e && e.message); built = true; } } });
      (ctx2.labels = ctx2.labels || []).push({ text: "מעיין השילוח", x: SHL.POOL[0], y: -45, z: SHL.POOL[1], size: 4 });
      // ---- the demonstration's people: the priest of the water and two with trumpets (the kit's priest; his arms and feet move)
      const FIG = (() => {
        if (!K) return null;
        const FS = K.FS, sc = (q, s) => q.scale(s, s, s), W1 = (q) => K.white(q);
        const P = { sx: K.SH_X * FS, sy: K.SH_Y * FS, up: K.UP * FS, fo: K.FORE * FS };
        const upP = sc(mergeGeometries([W1(K.sph(0.07, 0.07, 0.07, 14, 10)), W1(K.at(new CylinderGeometry(0.07, 0.058, P.up / FS, 14), 0, -P.up / FS / 2, 0)),
          W1(K.at(K.sph(0.058, 0.058, 0.058, 12, 8), 0, -P.up / FS, 0))]), FS);
        const foP = sc(W1(K.at(new CylinderGeometry(0.056, 0.046, P.fo / FS, 14), 0, -P.fo / FS / 2, 0)), FS);
        const hand = { 1: sc(K.at(K.handRaw(1), 0, -(P.fo / FS + 0.045), 0), FS), "-1": sc(K.at(K.handRaw(-1), 0, -(P.fo / FS + 0.045), 0), FS) };
        // HAND_SDF_MERGE_B2 (the merge of fix-a, A2's note in FIX-COORD): the kit's hands in the wrist's frame (K.handWr - "rest", and "grip"
        // for the hand that holds), on a wrist joint; the grip's place - the closed hand's ring (K.handAt(side, "grip")) and its way
        // ("gripAx", from the little finger to the first); the material K.mHand (the hand's own vertex colours - never merged with others)
        const HW = K.handWr && K.handAt ? { rest: { 1: K.handWr(1, "rest"), "-1": K.handWr(-1, "rest") }, grip: { 1: K.handWr(1, "grip"), "-1": K.handWr(-1, "grip") },
          at: { 1: K.handAt(1, "grip"), "-1": K.handAt(-1, "grip") }, ax: { 1: K.handAt(1, "gripAx"), "-1": K.handAt(-1, "gripAx") } } : null;
        const foot = { 1: sc(K.footGeo(1).translate(-0.1, 0, 0), FS), "-1": sc(K.footGeo(-1).translate(0.1, 0, 0), FS) };
        const neck = sc(K.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), 1);
        return { P, upP, foP, hand, HW, foot, neck };
      })();
      const mHandB2 = () => K.mHand || K.mSkin;
      const mkPriest = (n) => {
        const FS = K.FS, g = new Group(), lean = new Group(), S = new Group();
        g.add(lean);
        S.scale.setScalar(FS);
        lean.add(S);
        const add = (par, geo, mat) => { const m = new Mesh(geo, mat); m.castShadow = true; m.userData.noPick = true; par.add(m); return m; };
        add(S, K.gRobeBody, K.mRobe);
        add(S, FIG.neck, K.mSkin);
        const sash = add(S, K.gSash, (SH.tamid && SH.tamid.belt === "white") ? K.mSashWhite : K.mSashDyed);
        const hg = K.headOn(S, K.HEAD_Y, K.mBeards[n % K.mBeards.length], n);
        hg.traverse((m) => { if (m.isMesh) m.userData.noPick = true; });
        add(S, K.gHat, K.mHat).position.y = K.HAT_Y;
        const arm = (side) => {
          const sh = new Group();
          sh.position.set(side * FIG.P.sx, FIG.P.sy, 0);
          lean.add(sh);
          add(sh, FIG.upP, K.mRobe);
          const el = new Group();
          el.position.y = -FIG.P.up;
          sh.add(el);
          add(el, FIG.foP, K.mRobe);
          const grip = new Group();
          el.add(grip);
          if (FIG.HW) {   // HAND_SDF_MERGE_B2
            const wr = new Group();
            wr.position.y = -FIG.P.fo;
            el.add(wr);
            const hand = add(wr, FIG.HW.rest[side], mHandB2());
            const G = FIG.HW.at[side];
            grip.position.set(G.x, -FIG.P.fo + G.y, G.z);
            return { sh, el, grip, wr, hand, side };
          }
          add(el, FIG.hand[side], mHandB2());
          grip.position.set(0, -(FIG.P.fo + 0.08), 0.03);
          return { sh, el, grip, side };
        };
        const L = arm(1), R = arm(-1);
        const fl = add(g, FIG.foot[1], K.mSkin), fr = add(g, FIG.foot[-1], K.mSkin);
        fl.position.x = 0.1 * FS;
        fr.position.x = -0.1 * FS;
        g.visible = false;
        return { g, lean, L, R, fl, fr, sash };
      };
      const setArm = (A2, v, side) => { A2.sh.rotation.set(v[0], 0, side * v[1]); A2.el.rotation.set(v[2], 0, 0); };
      // HAND_SDF_MERGE_B2: the hand that holds - closed round it (the "grip" pose); gripAlign - the wrist turns so the ring's way is the held
      // thing's axis (its up, by the quaternion qt in the world), and the grip goes with the ring (the flask's neck in the closed hand)
      const holdB2 = (A2) => { if (A2.hand && FIG.HW) A2.hand.geometry = FIG.HW.grip[A2.side]; };
      const _gq = new Quaternion(), _gv = new Vector3();
      const gripAlign = (A2, qt) => {
        if (!A2.wr || !FIG.HW) return;
        A2.el.updateWorldMatrix(true, false);
        A2.el.getWorldQuaternion(_gq).invert();
        _gv.set(0, 1, 0).applyQuaternion(qt).applyQuaternion(_gq);
        A2.wr.quaternion.setFromUnitVectors(FIG.HW.ax[A2.side], _gv);
        A2.grip.position.copy(FIG.HW.at[A2.side]).applyQuaternion(A2.wr.quaternion);
        A2.grip.position.y -= FIG.P.fo;
        A2.grip.updateMatrixWorld(true);
      };
      const ARM = { rest: [0.05, 0.08, -0.15], carry: [-0.25, 0.1, -0.85], fill: [-1.05, 0.12, -0.35], pour: [-1.2, 0.1, -0.55], tR: [-1.42, 0.05, -0.2], tL: [-1.28, -0.06, -0.38] };
      // ---- SHILOACH_CHALAMISH_B2: the rest of the people, as Chalamish draws them (pp. 10-14, 27-28) - no women (the user), boys among
      // the men; the stories (the Sadducees, the frogs) left out. Built once, with the demonstration
      const buildExtra = (D2, gold, jugGeo) => {
        const DG = D2.DG, PP = tm_people(ctx2);
        const ROBES = [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50, 0x5a3e4a, 0x3e5a4a];
        // the priest of the wine: with the water's priest up the ramp, to the eastern bowl ("מערבי של מים ומזרחי של יין")
        const w = mkPriest(8); DG.add(w.g);
        const wjug = new Mesh(jugGeo(), gold); wjug.castShadow = true; wjug.userData.noPick = true; wjug.position.set(0, -0.2, 0.02); w.R.grip.add(wjug); holdB2(w.R);   // HAND_SDF_MERGE_B2
        const wwine = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true), new MeshStandardMaterial({ color: 0x8a1626, transparent: true, opacity: 0.85, roughness: 0.15 }));
        wwine.visible = false; DG.add(wwine);
        // the deputy on the horn, the sudar in his hand (Tamid 7:3; "וסודרין - הם דגלים", the Rambam's commentary) - the flag of the morning's
        // service when that module gives it (SH.makeSudar, 55-tamid.js), else the same here
        const sg = mkPriest(10); DG.add(sg.g);
        const mkSud = () => {
          const g = new Group(), W0 = 0.62, L0 = 1.0, geo = new PlaneGeometry(W0, L0, 6, 10);
          geo.translate(-W0 / 2, -L0 / 2, 0);
          const pos = geo.attributes.position, base = Float32Array.from(pos.array);
          const m = new Mesh(geo, new MeshStandardMaterial({ color: 0x17171c, roughness: 0.9, side: DoubleSide })); m.castShadow = true; g.add(m);
          g.userData.tick = (t, k) => { for (let i = 0; i < pos.count; i++) { const x = base[i * 3], y = base[i * 3 + 1], d = Math.hypot(x, y) / L0; pos.array[i * 3 + 2] = (0.03 + 0.16 * k) * d * Math.sin(6.5 * d - (3 + 7 * k) * t) + 0.05 * k * d * d * Math.sin(2.1 * t); pos.array[i * 3] = x * (1 - 0.12 * k * d * (0.5 + 0.5 * Math.sin(4 * t + 3 * d))); } pos.needsUpdate = true; geo.computeVertexNormals(); };
          g.userData.tick(0, 0); return g;
        };
        const sud = fnc(SH.makeSudar) ? SH.makeSudar() : mkSud();
        sud.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        sg.R.grip.add(sud);
        holdB2(sg.R);   // HAND_SDF_MERGE_B2: the sudar's corner in the closed hand
        // the streams down the bowls' holes to the shitin (Chalamish p. 27: "היין והמים זורמים... ויורדים דרך נקב אל השיתין"), seen through
        // the corner drawn as glass (sfalimSee) while they pour
        const shit = new Group(); DG.add(shit); shit.visible = false;
        for (const [bx, col] of [[43.05, 0x8fc3ec], [43.95, 0x8a1626]]) {
          const st = new Mesh(new CylinderGeometry(0.02, 0.026, LV.KOH + 9 - (LV.KOH - 6), 6, 1, true), new MeshStandardMaterial({ color: col, transparent: true, opacity: 0.9, roughness: 0.15, depthTest: false }));
          st.renderOrder = 6; st.userData.bx = bx; shit.add(st);
        }
        // the men and boys who watch in the women's court (p. 11), on both sides of the way
        const watch = new Group(); DG.add(watch); watch.visible = false;
        let q = 1122;
        const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const men = [], boys = [];
        for (let x = 110; x < 206; x += 7 + rr() * 3) for (const sd of [-1, 1]) {
          const z = sd * (6.2 + rr() * 6), list = rr() < 0.3 ? boys : men;
          list.push([x + (rr() - 0.5) * 2, z, sd > 0 ? Math.PI : 0]);
        }
        const yEn = groundY(150, 8, 10);
        PP.crowd(watch, men, { y: isFinite(yEn) ? yEn : LV.EZN, s: 1.4, pose: "stand", kind: "worker", robe: ROBES[1], tone: (i) => i % 4, name: "shiloachWatcher" });
        PP.crowd(watch, boys, { y: isFinite(yEn) ? yEn : LV.EZN, s: 1.0, pose: "stand", kind: "worker", robe: ROBES[4], tone: (i) => (i + 1) % 4, name: "shiloachBoy" });
        // the procession with torches (pp. 12, 14): men and boys behind the priest, from the gate of Chulda to the spring and back
        const torchM = new MeshStandardMaterial({ color: 0x5b3a1e, roughness: 0.8 });
        const flameM = new MeshStandardMaterial({ color: 0xffb13a, emissive: 0xff7a10, emissiveIntensity: 2.2, transparent: true, opacity: 0.92 });
        const stickG = new CylinderGeometry(0.025, 0.035, 1.1, 6).translate(0, 0.55, 0), flameG = new ConeGeometry(0.11, 0.36, 8).translate(0, 0.18, 0);
        // (the coordinator, after the pictures: "תהלוכה גדולה וצפופה... בבגדים צבעוניים, הרבה לפידים דולקים, והכהן עם כד הזהב באמצע") -
        // 36: a third ahead of him and the rest after him, in four files beside him; boys and two small children; a torch for every one
        // but the children, a glow round each flame and a light in six of them (more lights would slow the drawing). Colours - model choices
        // ROUTE_CROWD_B2 (the coordinator, 22.11.2026: "תהלוכת השילוח — מאה איש לפחות, והמון לאורך הדרך"): 104 - thirty ahead of him, the rest
        // after him, denser; five small children; still six lights
        const COL = [0x2f6b3a, 0x5b3a8a, 0x2e5d9a, 0xc9a227, 0x9a3030, 0x2a8a80, 0xb86a2a, 0x6b7a2e, 0x8a3a6a, 0x3a4a8a, 0xa8552e, 0x40706a];
        const glowTex = (() => { const cv = document.createElement("canvas"); cv.width = cv.height = 64; const c2 = cv.getContext("2d"); const gr = c2.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, "rgba(255,190,90,0.85)"); gr.addColorStop(0.4, "rgba(255,140,40,0.35)"); gr.addColorStop(1, "rgba(255,120,20,0)"); c2.fillStyle = gr; c2.fillRect(0, 0, 64, 64); return new CanvasTexture(cv); })();
        const glowM = new SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending });
        const fol = [], LANES = [-2.0, -0.9, 0.9, 2.0];
        const KIDS = [17, 29, 53, 71, 88], LIT = [2, 20, 38, 56, 74, 92];
        for (let i = 0; i < 104; i++) {
          const G = new Group(); G.visible = false; DG.add(G);
          const kid = KIDS.includes(i), boy = !kid && i % 5 === 3;
          PP.crowd(G, [[0, 0, 0]], { y: 0, s: kid ? 0.8 : boy ? 1.05 : 1.4, pose: "stand", kind: kid || boy ? "student" : "worker", robe: COL[(i * 5) % COL.length], tone: () => i % 4, exact: true, name: "shiloachProcession" });
          let fl = null;
          if (!kid) {
            const T0 = new Group(); T0.position.set(boy ? -0.27 : -0.36, boy ? 0.98 : 1.3, 0.3); T0.rotation.x = 0.15; G.add(T0);
            T0.add(new Mesh(stickG, torchM));
            fl = new Mesh(flameG, flameM); fl.position.y = 1.1; T0.add(fl);
            const gl = new Sprite(glowM); gl.scale.set(1.7, 1.7, 1); gl.position.y = 0.2; gl.userData.noPick = true; fl.add(gl);
            if (LIT.includes(i)) { const lt = new PointLight(0xffa040, 42, 30, 1.5);   /* SHILOACH_ROUTE_G: brighter (the user: "יותר תאורה") */ lt.position.y = 0.25; fl.add(lt); }
          }
          const lead = i < 30, k = lead ? i : i - 30;
          // (dense: each keeps a distance in amot from him along the way - the walk is hurried, so a lag in seconds would spread them)
          fol.push({ G, fl, lag: i * 0.37, d: lead ? -(1.2 + k * 0.34) : 1.0 + k * 0.36, side: LANES[i % 4] + (((i * 7) % 5) - 2) * 0.08, rank: lead ? k * 0.34 : 0 });
        }
        // a Levite with a lyre at the spring (p. 12: "ושרים כהללים כל מעיני בך")
        const lev = new Group(); DG.add(lev); lev.visible = false;
        PP.crowd(lev, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind: "levi", robe: 0xe9e3d3, tone: () => 2, exact: true, name: "shiloachLevite" });
        {
          const wood = new MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.6 }), str = new MeshStandardMaterial({ color: 0xeae2c8, roughness: 0.4 });
          const L = new Group(); L.position.set(0.05, 1.25, 0.38); L.rotation.x = -0.25; lev.add(L);
          const arm = (sx) => { const c = new Mesh(new TubeGeometry(new CatmullRomCurve3([new Vector3(sx * 0.12, 0, 0), new Vector3(sx * 0.2, 0.25, 0), new Vector3(sx * 0.16, 0.5, 0)]), 8, 0.02, 5, false), wood); L.add(c); };
          arm(-1); arm(1);
          const bar = new Mesh(new CylinderGeometry(0.018, 0.018, 0.4, 6).rotateZ(Math.PI / 2), wood); bar.position.y = 0.5; L.add(bar);
          const box = new Mesh(new BoxGeometry(0.3, 0.1, 0.06), wood); L.add(box);
          for (let k = -3; k <= 3; k++) { const sm = new Mesh(new CylinderGeometry(0.003, 0.003, 0.46, 3), str); sm.position.set(k * 0.03, 0.26, 0.02); L.add(sm); }
        }
        // the Levites on the duchan with the song of the day, flutes among them (Arachin 2:3, 84:9: "ובשנים עשר יום בשנה החליל מכה לפני המזבח... ובשמונת ימי
        // החג, ולא היה מכה באבוב של נחשת אלא באבוב של קנה"; Tamid 7:3 "ודברו הלוים בשיר"); their places as the morning's singers', south of the middle
        const duch = new Group(); DG.add(duch); duch.visible = false;
        const LZ = [3.6, 6.0, 8.4, 10.8, 13.2, 15.6, 18.0], flutes = [1, 3, 5];   // CHAMBERS_EAST_N2: z 20.4 (the eighth) stood where the chavitin makers' chamber is now (z 19.5..28.5)
        const yD = groundY(86.3, 6, 20);
        PP.crowd(duch, LZ.map((z) => [86.3, z, -Math.PI / 2]), { y: isFinite(yD) ? yD : 15.5, s: 1.4, pose: "stand", kind: "levi", robe: 0xe9e3d3, tone: (i) => i % 4, name: "shiloachDuchan" });
        const reed = new MeshStandardMaterial({ color: 0xc8b07a, roughness: 0.6 });
        for (const i of flutes) {
          const fm = new Mesh(new CylinderGeometry(0.026, 0.034, 0.62, 8), reed);   // from his mouth forward and down (he faces west, -x)
          fm.position.set(86.3 - 0.17 - 0.19, (isFinite(yD) ? yD : 15.5) + 1.86 - 0.25, LZ[i]); fm.rotation.z = -0.64; fm.castShadow = true; fm.userData.noPick = true; duch.add(fm);
        }
        Object.assign(D2, { w, wjug, wwine, sg, sud, shit, watch, fol, lev, duch });
      };
      const buildDemo = () => {
        if (SHL.D) return SHL.D;
        const DG = new Group();
        DG.name = "shiloachDemo";
        DG.visible = false;
        ctx2.root.add(DG);
        const p = mkPriest(2), t1 = mkPriest(4), t2 = mkPriest(6);
        // SHILOACH_ROUTE_G: two more on the table of the fats (t3, t4) and two at the Water Gate (t5, t6) - each pair at its own place from the start
        const t3 = mkPriest(12), t4 = mkPriest(14), t5 = mkPriest(16), t6 = mkPriest(18);
        for (const f of [p, t1, t2, t3, t4, t5, t6]) DG.add(f.g);
        // the golden flask (its form - a model choice), in his right hand
        const gold = new MeshStandardMaterial({ color: 0xd8ad45, metalness: 0.9, roughness: 0.28 });
        const jugGeo = () => mergeGeometries([   // SHILOACH_CHALAMISH_B2: a golden jug, with a handle and a lip, as Chalamish draws it (pp. 12-14)
          new LatheGeometry([[0.001, 0], [0.065, 0], [0.105, 0.045], [0.118, 0.12], [0.098, 0.19], [0.05, 0.235], [0.044, 0.27], [0.062, 0.3], [0.001, 0.3]].map(([r, y]) => new Vector2(r, y)), 20),
          new TorusGeometry(0.075, 0.013, 6, 14, Math.PI * 1.15).rotateZ(-Math.PI * 0.62).translate(-0.1, 0.17, 0),
          new ConeGeometry(0.03, 0.08, 8, 1, true).rotateZ(-Math.PI / 2.6).translate(0.07, 0.29, 0)]);
        const flask = new Mesh(jugGeo(), gold);
        flask.castShadow = true;
        flask.userData.noPick = true;
        flask.position.set(0, -0.2, 0.02);
        p.R.grip.add(flask);
        holdB2(p.R);   // HAND_SDF_MERGE_B2
        const fwater = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true), new MeshStandardMaterial({ color: 0x7fc0f0, transparent: true, opacity: 0.8, roughness: 0.1 }));
        fwater.visible = false;
        DG.add(fwater);
        // the silver trumpets (Numbers 10:2), one for each of the two, from his mouth forward and up
        const silver = new MeshStandardMaterial({ color: 0xe6e6ea, metalness: 0.85, roughness: 0.25, side: DoubleSide });
        for (const f of [t1, t2, t3, t4, t5, t6]) {
          const tr = new Group();
          const tube = new Mesh(new CylinderGeometry(0.022, 0.026, 1.25, 10), silver);
          tube.position.y = 0.625;
          const bell = new Mesh(new CylinderGeometry(0.16, 0.03, 0.26, 16, 1, true), silver);
          bell.position.y = 1.36;
          tr.add(tube, bell);
          tr.position.set(0, K.HEAD_Y * K.FS - 0.17, 0.14);
          tr.rotation.x = 1.25;
          tr.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.userData.noPick = true; } });
          f.lean.add(tr);
        }
        SHL.D = { DG, p, t1, t2, t3, t4, t5, t6, flask, fwater, gold, ys: new Map() };
        try { buildExtra(SHL.D, gold, jugGeo); } catch (e) { console.warn("[shiloach extra]", e && e.message); }
        return SHL.D;
      };
      // ---- the ways (each [x, z] in the world; the floor under them read once, from a height near it)
      const AW = (x, lz) => [x, lz + altDz()];   // in the altar's frame (the opinions table moves it)
      const yAt = (D2, x, z, near) => { const k = Math.round(x * 4) + "," + Math.round(z * 4) + "," + Math.round(near); let y = D2.ys.get(k); if (y === undefined) { y = groundY(x, z, near + 2.6); D2.ys.set(k, y); } return y; };
      const plen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
      const along = (pts, u) => {   // the point at fraction u of the way, and the way's heading there
        const L = plen(pts) * clamp(u, 0, 1);
        let acc = 0;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (acc + l >= L || i === pts.length - 1) { const f = l > 0 ? clamp((L - acc) / l, 0, 1) : 0; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[0] - a[0], b[1] - a[1])]; }
          acc += l;
        }
        return [pts[0][0], pts[0][1], 0];
      };
      // the beats (demo seconds; the walk engine runs them at ctx2.shared.demoSlow)
      // SHILOACH_WAY_B2 (fix-b2, 22.11.2026 - the user's decision 53): out by the EAST - from the court through the Nikanor gate, down the
      // fifteen steps, across the women's court and out by its eastern gate - then (unseen) across the mount to the gate of Chulda and down
      // its stairs ("הכבש הדרומי של הר הבית"), as Chalamish draws it; back up the same stairs to the Water Gate. 5 seconds more (out1).
      // SHILOACH_CHALAMISH_B2 (the user, 22.11.2026: "את הדגמת השילוח תעשה בדיוק כמו בחלמיש", without its stories; Chalamish pp. 10-14,
      // 27-28): the opening - two priests blow at the Nikanor gate (walk0), go down and walk to the eastern gate blowing (out1), turn west
      // there (decl1) - Sukkah 5:4; then (unseen) to the gate of Chulda, torches, down the southern stairs.
      // SHILOACH_SHUSHAN_B2 (the user's decision 104, 22.11.2026 09:00: "הופכים פניהם בשער עזרת נשים, ויוצאים בשער שושן, כבחלמיש (עמ' 10)"):
      // from the turn at the women's court's gate (decl1) across the mount, out by the Shushan gate (shu1); then, unseen, to the southern
      // ramp, down it (gate1 - stairs1). Back up the same ramp (backR - back1) to the Water Gate.
      // SHILOACH_PARAH_B2 (the user's decision 109, 22.11.2026: "ג" - out by the Shushan gate, along the ramp of the Parah (20-mount.js),
      // and from its end south to the southern ramp - all of it seen): shu1 - the Shushan gate; par1 - the Parah ramp's end on the Mount of
      // Olives; stairs1 - the foot of the southern ramp (CHULDA_RAMPS_B2), whence the path to the Shiloach. The walk outside is hurried.
      // SHILOACH_CHULDA_B2 (the user's decision 180 a: "הדרך אל השילוח יוצאת בשערי חולדה שבדרום, ויורדת משם אל המעיין שבדרום־מערב — לא בשער שושן
      // ולא בכבש הפרה"): shu1 - now at the western gate of Chulda (from the turn at the women's court's gate, across the mount); par1 - half way
      // down its ramp; stairs1 - the ramp's foot, whence the path south and south-west to the spring. (Until then: the Shushan gate, the Parah ramp)
      let T = {};   // SHILOACH_ROUTE_G: the timeline's moments, made at the start (mkTimeline, below)
      const FILL_LEAN = 0.1, POUR_LEAN = 0.08, TILT = 1.62;
      const QG = new Quaternion(), QT = new Quaternion(), AX = new Vector3(), NECK = new Vector3(0, -0.26, 0), MOUTH = new Vector3(0, 0.3, 0), V1 = new Vector3();
      const setFlask = (D2, tilt, yaw) => {
        const f = D2.flask;
        D2.p.g.updateMatrixWorld(true);
        QT.setFromAxisAngle(AX.set(Math.cos(yaw), 0, -Math.sin(yaw)), tilt);
        gripAlign(D2.p.R, QT);   // HAND_SDF_MERGE_B2
        D2.p.R.grip.getWorldQuaternion(QG).invert();
        f.quaternion.copy(QG).multiply(QT);
        f.position.copy(NECK).applyQuaternion(QT).applyQuaternion(QG);
        f.updateMatrixWorld(true);
      };
      const mouthW = (D2, out) => D2.flask.localToWorld(out.copy(MOUTH));
      const measure = (D2, arm, lean, tilt) => {   // the flask's mouth from his feet, his face to +z
        const p = D2.p;
        p.g.position.set(0, 0, 0);
        p.g.rotation.y = 0;
        p.lean.position.set(0, 0, 0);
        p.lean.rotation.x = lean;
        setArm(p.R, arm, -1);
        setFlask(D2, tilt, 0);
        const m = mouthW(D2, new Vector3()), o = p.g.getWorldPosition(new Vector3());
        return { x: m.x - o.x, y: m.y - o.y, z: m.z - o.z };
      };
      // the ways (each [x, z] in the world; the floor under them read once, from a height near it). The Water Gate's landing (y 13.5,
      // x -24..-12) has its stair down to the east (to y 0 at x 2) and the soreg its opening before the gate (x -19..-17, z 80)
      const BOWL = () => AW(43.05, 9.4);   // the western bowl, of the water
      const bowlY = () => { const B = BOWL(), k = Math.round(B[1] * 10); if (SHL.byK !== k) { SHL.byK = k; SHL.by = groundY(B[0], B[1], 40); } return SHL.by; };
      const standF = () => { const SP = SHL.SP, o = SHL.offF || { x: 0, z: 0.9 }; if (SHL.kit && SHL.kit.standFor) { const q = SHL.kit.standFor(o); return [q.x, q.z]; } return [SP.x - o.x, SP.zT - o.z]; };   // NATURAL_POOL_B2: on the bank beside the fall   // the flask's mouth under the spout
      const standP = () => { const B = BOWL(), o = SHL.offP || { x: 0, z: 0.9 }; return [B[0] - o.x, B[1] - o.z]; };   // the flask's mouth over the bowl
      // ===== SHILOACH_ROUTE_G (fix-g, 23.11.2026 - the user, over the draft: "עד היציאה להר הבית יש קפיצות מוזרות ולא דרך רציפה"; "גם בדרך
      // הכל בקפיצות ולא בצעידה — צריך ליצור דרך אחת שלמה"; "יותר תאורה"; "המבט מן השער קרוב יותר"): ONE WHOLE WAY. Until now the walk was
      // pieces of broken lines, each in its own seconds (across the mount some 58 amot a second while the legs stepped as at a walk), two of
      // them unseen (the priest gone, the eye flying over the walls), the eye by keys of its own, and the procession only outside. Now three
      // legs, each one smooth curve (a centripetal Catmull-Rom through its points, sampled every quarter amah by its length):
      //   OUT  - from Israel's court by the Nikanor gate, down the fifteen steps, across the women's court and out by its eastern gate and its
      //          steps, through the soreg's opening, round its south-eastern corner, across the mount to the royal stoa's aisle between the
      //          columns, through the western gate of Chulda (its gold leaves open), down its ramp and along the path to the spring's bank;
      //   BACK - the same way back (its first part is the out way itself, reversed) up the ramp and in by the gate, then north across the
      //          mount to the soreg's opening before the Water Gate, along the chel and up the stair to the landing;
      //   IN   - through the Water Gate into the court, north of the chambers and the laver, up the ramp, to the left, to the western bowl.
      // The legs meet where he stands (the filling, the Water Gate); on a leg one pace by its length (WALK_V amot a demonstration second),
      // easing in and out at each stop (the trumpeters' turn, the filling, the Water Gate, the bowl) - PACE_G below. Everyone walks on these curves:
      // the two with trumpets ahead of him to the eastern gate; the procession (104) waits beyond the soreg in its order, takes him into its
      // middle and goes with him, stops before the spring and turns about where it stands, comes back with him and stops before the soreg; the
      // eye goes ahead of him on the same curve looking back at him, and comes to a still view at each station by a soft blend. The floor:
      // under him read along each leg once (on stairs the body goes up evenly and each foot stands on its own tread), outside - the mount's
      // floor (0), the ramp's slope, the valley's ground (the terrain's own triangles). The pace, the eye's distances - model choices.
      // PACE_G (the coordinator, after the draft: 13 amot a second is four times a man's walk - "בצעידה"): a man's pace (V_WALK - 3 amot a
      // second on the screen, at demoSlow) where it matters - the gates, the spring, the filling, the Water Gate, the court - and between them, on
      // the long stretches, a soft speeding-up (to V_FAST at most) while the eye rises for a view from the air, so that the speed reads as time
      // shortened and not as a run; then a soft slowing down. Acceleration A_MAX at most (no jump in speed); the step's cadence is a walk's
      // (the legs no faster than at V_CAD - from the air they are not seen)
      const V_WALK = 4.5, V_FAST = 27, A_MAX = 5, V_CAD = 6.5, STRIDE = 2.6, STEP = 0.25, SIM_DT = 1 / 120;
      const WALK_V = V_WALK;   // (the step's amplitude is measured against a walk)
      const crPt = (P0, P1, P2, P3, u) => {   // centripetal Catmull-Rom (alpha 0.5) between P1 and P2
        const d = (A, B) => Math.max(1e-4, Math.sqrt(Math.hypot(B[0] - A[0], B[1] - A[1])));
        const t1 = d(P0, P1), t2 = t1 + d(P1, P2), t3 = t2 + d(P2, P3), t = t1 + u * (t2 - t1);
        const L = (A, B, ta, tb) => [((tb - t) * A[0] + (t - ta) * B[0]) / (tb - ta), ((tb - t) * A[1] + (t - ta) * B[1]) / (tb - ta)];
        const A1 = L(P0, P1, 0, t1), A2 = L(P1, P2, t1, t2), A3 = L(P2, P3, t2, t3), B1 = L(A1, A2, 0, t2), B2 = L(A2, A3, t1, t3);
        return L(B1, B2, t1, t2);
      };
      const denseOf = (P) => {   // the curve through P, every ~1/20 amah (its ends reflected)
        const n = P.length, out = [P[0]];
        for (let i = 0; i < n - 1; i++) {
          const P0 = i ? P[i - 1] : [2 * P[0][0] - P[1][0], 2 * P[0][1] - P[1][1]];
          const P3 = i + 2 < n ? P[i + 2] : [2 * P[n - 1][0] - P[n - 2][0], 2 * P[n - 1][1] - P[n - 2][1]];
          const K = Math.max(4, Math.ceil(Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]) / 0.05));
          for (let k = 1; k <= K; k++) out.push(k === K ? P[i + 1] : crPt(P0, P[i], P[i + 1], P3, k / K));
        }
        return out;
      };
      const angTo = (a, b, f) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return a + d * f; };
      // ---- the floor: the terrain's own triangles (the ground mesh of 20-mount.js, read from its vertices), the ramp's slope, the mount's
      // floor, and rays on the solids near the courts and the gate of Chulda (read once a quarter amah along a leg, and under each foot)
      const TER = { p: null };
      const terrainY = (x, z) => {
        if (TER.p === null) {
          TER.p = false;
          ctx2.root.traverse((o) => { const q = o.isMesh && o.geometry && o.geometry.parameters; if (q && q.width === 5200 && q.widthSegments === 220 && !TER.p) { TER.p = o.geometry.attributes.position.array; TER.n = 220; } });
          if (TER.p) { const P = TER.p; TER.X0 = P[0]; TER.Z0 = P[2]; TER.cx = P[3] - P[0]; TER.cz = P[(TER.n + 1) * 3 + 2] - P[2]; }
        }
        if (!TER.p) return null;
        const u = (x - TER.X0) / TER.cx, v = (z - TER.Z0) / TER.cz, ix = Math.floor(u), iy = Math.floor(v), n = TER.n;
        if (ix < 0 || iy < 0 || ix >= n || iy >= n) return null;
        const fu = u - ix, fv = v - iy, W = n + 1, a = iy * W + ix, b = a + W, c2 = b + 1, d2 = a + 1, P = TER.p, Y = (k) => P[k * 3 + 1];
        return fu + fv <= 1 ? Y(a) + fu * (Y(d2) - Y(a)) + fv * (Y(b) - Y(a)) : Y(c2) + (1 - fu) * (Y(b) - Y(c2)) + (1 - fv) * (Y(d2) - Y(c2));
      };
      const inCourts = (x, z) => (x > -112 && x < 241.8 && z > -95 && z < 80.6) || (Math.abs(x) < 12 && z > 318 && z < 340);
      const RS = { list: null, rc: new Raycaster(), o: new Vector3(), d: new Vector3(0, -1, 0) };
      const rayFloor = (x, z, from) => {   // the first solid under (x, from, z) near the courts (the solids' list built once)
        if (!RS.list) {
          RS.list = [];
          ctx2.root.updateMatrixWorld(true);
          const C = new Vector3();
          ctx2.root.traverse((o) => {
            if (!o.isMesh || o.userData.noPick || (SHL.D && o === SHL.D.DG)) return;
            for (let q = o; q; q = q.parent) if (q.name === "shiloachDemo" || q.name === "labels") return;
            const m = Array.isArray(o.material) ? o.material[0] : o.material;
            if (m && m.transparent && m.opacity < 0.5 && !o.userData.fadeWith && !o.userData.fade) return;   // (a wall that fades near the eye stays a floor)
            if (o.geometry && o.geometry.type === "BoxGeometry" && o.scale.x > 1000) return;
            if (o.isInstancedMesh) { RS.list.push(o); return; }
            const g = o.geometry; if (!g.boundingSphere) g.computeBoundingSphere();
            const gp = g.parameters; if (gp && gp.width === 5200 && gp.widthSegments === 220) return;   // the terrain (terrainY reads it)
            const r = g.boundingSphere.radius * o.matrixWorld.getMaxScaleOnAxis(); if (r > 600) { RS.list.push(o); return; }
            C.copy(g.boundingSphere.center).applyMatrix4(o.matrixWorld);
            const inBox = (x0, x1, z0, z1) => C.x + r > x0 && C.x - r < x1 && C.z + r > z0 && C.z - r < z1;
            if (inBox(-118, 248, -100, 86) || inBox(-15, 15, 314, 346)) RS.list.push(o);
          });
        }
        RS.rc.set(RS.o.set(x, from, z), RS.d); RS.rc.far = 60;
        for (const h of RS.rc.intersectObjects(RS.list, false)) {
          let ok = true; for (let q = h.object; q; q = q.parent) if (q.visible === false) { ok = false; break; }
          if (ok) return h.point.y;
        }
        const g = groundY(x, z, from);
        return isFinite(g) ? g : 0;
      };
      // the spring's rocks and its pool's bank are a floor too (its builder marks them noPick; its plants and its water are not)
      const KIT = { list: null, rc: new Raycaster() };
      const kitY = (x, z) => {
        if (!SHL.kit) return -Infinity;
        if (!KIT.list) {
          KIT.list = [];
          SHL.kit.G.traverse((o) => { if (!o.isMesh) return; const m = Array.isArray(o.material) ? o.material[0] : o.material; if (!m || m.transparent || (o.geometry && o.geometry.type === "PlaneGeometry")) return;
            const cc = m.color; if (cc && cc.g > cc.r * 1.12 && cc.g > cc.b) return; KIT.list.push(o); });   // (green - the ferns and the bushes)
        }
        KIT.rc.set(RS.o.set(x, Y0 + 30, z), RS.d); KIT.rc.far = 60;
        const h = KIT.rc.intersectObjects(KIT.list, false)[0];
        return h ? h.point.y : -Infinity;
      };
      const FLOOR = (x, z, hint) => {
        if (inCourts(x, z)) return rayFloor(x, z, (hint == null ? 14 : hint) + 4.5);   // (every gate on the way is 20 high; a seam that let one ray through to a lower box is mended at the next)
        const ty = z >= 335.3 ? terrainY(x, z) : null;
        if (Math.abs(x) < 7.4 && z >= 335.3 && z <= RP.zf) return ty == null ? RP.yAt(z) : Math.max(RP.yAt(z), ty + 0.06);   // (at its foot the ground covers the ramp's end)
        if (z >= RP.zf - 0.01) {
          const g = ty == null ? groundY(x, z, 20) : ty + 0.06;   // (the path's strip lies 0.06 over the ground)
          return Math.hypot(x - SHL.SP.x, z - SHL.SP.z) < 24 ? Math.max(g, kitY(x, z)) : g;
        }
        return 0;   // the mount's floor
      };
      // ---- a leg: the curve resampled every STEP; at(s) -> [x, z, yaw]; its floor (per lateral offset, read when first asked); the body's
      // height - the floor averaged over three quarters of an amah each way (on stairs he goes up evenly; each foot on its tread - feet())
      const mkLeg = (name, dense, hint0) => {
        const xs = [dense[0][0]], zs = [dense[0][1]], ss = [0];
        let acc = 0, next = STEP;
        for (let j = 1; j < dense.length; j++) {
          const a = dense[j - 1], b = dense[j], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
          while (l > 0 && acc + l >= next - 1e-9) { const f = (next - acc) / l; xs.push(a[0] + (b[0] - a[0]) * f); zs.push(a[1] + (b[1] - a[1]) * f); ss.push(next); next += STEP; }
          acc += l;
        }
        if (acc - ss[ss.length - 1] > 1e-6) { const e = dense[dense.length - 1]; xs.push(e[0]); zs.push(e[1]); ss.push(acc); }
        const N = xs.length, yw = new Float32Array(N), tabs = new Map();
        for (let i = 0; i < N; i++) { const a = Math.max(0, i - 1), b = Math.min(N - 1, i + 1); yw[i] = Math.atan2(xs[b] - xs[a], zs[b] - zs[a]); }
        const idx = (s) => Math.max(0, Math.min(N - 2, Math.floor(s / STEP)));
        const frac = (s, i) => clamp((s - ss[i]) / Math.max(1e-6, ss[i + 1] - ss[i]), 0, 1);
        const tab = (off) => { let T2 = tabs.get(off); if (!T2) { T2 = { h: new Float32Array(N).fill(NaN), n: 0 }; tabs.set(off, T2); } return T2; };
        const L = { name, xs, zs, ss, N, len: acc, yw, tabs,
          at(s) { s = clamp(s, 0, acc); const i = idx(s), f = frac(s, i); return [lerp(xs[i], xs[i + 1], f), lerp(zs[i], zs[i + 1], f), angTo(yw[i], yw[i + 1], f)]; },
          off(q, side) { return [q[0] + Math.cos(q[2]) * side, q[1] - Math.sin(q[2]) * side]; },
          fill(off, upto) {   // the floor along the leg (at the lateral offset), in order (each from the last one's height)
            const T2 = tab(off); upto = Math.min(N - 1, upto);
            while (T2.n <= upto) { const i = T2.n, x = xs[i] + Math.cos(yw[i]) * off, z = zs[i] - Math.sin(yw[i]) * off; T2.h[i] = FLOOR(x, z, i ? T2.h[i - 1] : hint0); T2.n++; }
            return T2;
          },
          h(i, off) { i = Math.max(0, Math.min(N - 1, i)); const T2 = tab(off || 0); if (i >= T2.n) L.fill(off || 0, i + 12); return T2.h[i]; },
          // (each sample the highest of its neighbours first: a narrow slot - the hair's breadth between the ramp and the altar - is no dip)
          hb(i, off) { let a = 0; for (let k = -3; k <= 3; k++) a += Math.max(L.h(i + k - 1, off), L.h(i + k, off), L.h(i + k + 1, off)); return a / 7; },
          body(s, off) { s = clamp(s, 0, acc); const i = idx(s); return lerp(L.hb(i, off), L.hb(i + 1, off), frac(s, i)); },
          near(x, z) { let best = 1e18, bi = 0; for (let i = 0; i < N; i++) { const d = (xs[i] - x) ** 2 + (zs[i] - z) ** 2; if (d < best) { best = d; bi = i; } } return ss[bi]; }
        };
        return L;
      };
      // ---- the three legs (and the wine priest's own), the stations on them, the eye's distances along them
      const mkLegs = () => {
        const A2 = (x, lz) => AW(x, lz), sf = standF(), sp = standP();
        const OUTP = [[91, 0], [96, 0], [102, 0], [110, 0], [118, 0], [130, 0], [170, 0], [210, 0], [222, 0], [228, 0], [234, 0], [240, 0], [244.5, 0.3],
          [249, 2.5], [251.6, 7], [252.4, 14], [252.5, 40], [252.3, 70], [250.5, 86], [244, 98], [200, 128.8], [127, 180], [54, 231.2], [10, 262],
          [-2.5, 276], [-3.85, 286], [-3.85, 300], [-3.85, 314], [-3.0, 319], [-1.5, 323], [-1.05, 326], [-1.0, 329], [-1.0, 334], [-0.6, 337],
          [0, 341], [0, 380], [0, RP.zf]].concat(PATH.slice(1), [sf]);
        const OUT = mkLeg("out", denseOf(OUTP), 13.5);
        // BACK: the out way reversed (the same line, point for point) up to the stoa's aisle, then north to the soreg's opening before the Water
        // Gate (x -20.5..-16), along the chel (z 74..80) east to the stair's foot, and up it (z 70.1..73.8) to the landing before the gate
        const iDiv = Math.round(OUT.near(-3.85, 300) / STEP), rev = [];
        for (let i = OUT.N - 1; i >= iDiv; i--) rev.push([OUT.xs[i], OUT.zs[i]]);
        const BP = [[OUT.xs[iDiv], OUT.zs[iDiv]], [-3.85, 290], [-4.6, 280], [-7, 268], [-12.6, 180], [-17, 110], [-18.2, 92], [-18.2, 84], [-18.2, 79],
          [-17.2, 77.4], [-14, 76.9], [-4, 76.9], [2, 76.9], [4.6, 76.0], [5.6, 74.4], [5.0, 72.8], [3.4, 72.05], [1.5, 72.0], [-6, 72.0], [-12.5, 72.0],
          [-15.5, 72.0], [-18, 72.0]];
        const BACK = mkLeg("back", rev.concat(denseOf(BP).slice(1)), FLOOR(sf[0], sf[1], 20));
        // IN: through the gate (its passage x -23..-13), then east between the ulam's steps (their south end at z 51.5) and the laver (its base from
        // z 53, its spouts to about 52.4 - moved north by fix-a: the old way went through it), north of the chambers along the south (from z 54.5),
        // round onto the ramp's foot (z 53.25) and up it
        const IN = mkLeg("in", denseOf([[-18, 72.0], [-18, 70.5], [-18, 68.5], [-18, 66], [-18, 63], [-17, 59.4], [-12.5, 55.4], [-5, 53.4], [4, 52.5],
          [12, 52.1], [17, 52.05], [22.25, 52.05], [27, 52.3], [33, 53.0], [40, 53.4], [46, 53.6], [50.5, 53.6], [55.0, 53.0], [57.1, 50.9], [57.4, 48],
          A2(57.4, 30), A2(57.4, 18.5), A2(57.0, 12.6), A2(50.8, 9.8), A2(46.6, 8.4), sp]), 13.5);
        const WINE = mkLeg("wine", denseOf([A2(58.8, 43.3), A2(58.8, 41.2), A2(58.8, 30), A2(58.8, 18.5), A2(58.4, 12.8), A2(52, 10.4), A2(47.9, 8.8),
          [sp[0] + 0.9, sp[1]]]), 16);
        const S_TG = OUT.near(224, 0), S_SOR = OUT.near(241, 0), S_T = OUT.len, U_SOR = BACK.near(-18.2, 84);
        const L = { OUT, BACK, IN, WINE, S_TG, S_D: S_TG - 4.2, S_J: S_SOR + 34.6, S_A: S_T - 26, U_R: 26, U_P: U_SOR - 30,
          S_FOOT: IN.near(...A2(57.4, 41.2)), S_CHULDA: OUT.near(-1.0, 334), S_RAMPF: OUT.near(0, RP.zf), U_CHULDA: BACK.near(-1.0, 334), U_SOR };
        // the eye's distance ahead of him on the leg and its height (by his place on it; smooth between the knots)
        const sO = (x, z) => OUT.near(x, z), sB = (x, z) => BACK.near(x, z);
        L.rig = new Map([
          [OUT, [[0, 12, 3.6], [S_TG - 12, 12, 5.0], [S_TG + 4, 12, 6.2], [S_SOR, 12, 5.6], [L.S_J - 26, 15, 6.5], [L.S_J + 6, 16, 8], [sO(244, 98) + 15, 20, 11], [sO(-2.5, 276) - 40, 20, 11],
            [sO(-2.5, 276) - 14, 15, 4.8], [L.S_CHULDA + 6, 15, 4.8], [sO(0, 376), 16, 6.5], [L.S_RAMPF + 8, 15, 6.5], [L.S_A - 20, 14, 5.5], [S_T, 10, 3.6]]],
          [BACK, [[0, 10, 3.6], [L.U_R + 4, 15, 6], [BACK.near(0, 376), 16, 6.5], [L.U_CHULDA - 6, 15, 4.8], [sB(-4.6, 280) + 6, 15, 4.8], [sB(-12.6, 180), 20, 10],
            [L.U_P - 20, 18, 9], [L.U_P + 4, 14, 6], [U_SOR, 10, 4.6], [sB(4.6, 76.0), 9, 4.6], [BACK.len, 9, 4.6]]],
          [IN, [[0, 6, 4.4], [12, 7, 4.8], [IN.near(-5, 53.4), 11, 8.5], [IN.near(40, 53.4), 12, 7], [IN.len, 10, 4.5]]]]);   // (over the laver and the ulam's steps)
        // PACE_G: the speed along each leg (amot a demonstration second; V_WALK - a man's walk)
        const W = V_WALK, sStoa = sO(-2.5, 276), uStoaN = sB(-4.6, 280), uRampF = BACK.near(0, RP.zf);
        L.pace = new Map([
          [OUT, [[0, W], [30, W], [52, 9], [S_TG - 34, 9], [S_TG - 12, W], [L.S_J + 12, W], [L.S_J + 44, V_FAST], [sStoa - 60, V_FAST], [sStoa - 16, 6], [L.S_CHULDA - 10, W],
            [L.S_CHULDA + 6, W], [L.S_CHULDA + 22, 9], [L.S_RAMPF - 12, 9], [L.S_RAMPF + 16, 24], [L.S_A - 34, 24], [L.S_A - 6, W], [S_T, W]]],
          [BACK, [[0, W], [L.U_R + 4, W], [L.U_R + 30, 24], [uRampF - 26, 24], [uRampF + 2, 9], [L.U_CHULDA - 14, 9], [L.U_CHULDA - 4, W], [L.U_CHULDA + 8, W],
            [L.U_CHULDA + 24, 9], [uStoaN + 8, 9], [uStoaN + 40, V_FAST], [L.U_P - 44, V_FAST], [L.U_P - 6, W], [BACK.len, W]]],
          [IN, [[0, W], [16, W], [26, 6], [L.S_FOOT - 8, 6], [L.S_FOOT, W], [IN.len, W]]]]);
        return L;
      };
      const rigAt = (L, leg, s) => {   // [ahead, height]
        const K2 = L.rig.get(leg) || [[0, 12, 4.5]];
        if (s <= K2[0][0]) return [K2[0][1], K2[0][2]];
        for (let i = 1; i < K2.length; i++) if (s <= K2[i][0]) { const a = K2[i - 1], b = K2[i], u = smooth(clamp((s - a[0]) / Math.max(1e-3, b[0] - a[0]), 0, 1)); return [lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; }
        const e = K2[K2.length - 1]; return [e[1], e[2]];
      };
      // ---- the timeline: holds and walks; a walk follows its leg's pace (PACE_G: knots [s, speed], smooth between them), its speed changing by
      // A_MAX at most and coming to rest at its end - simulated once into a table (every SIM_DT); stateAt(t) -> { leg, s, v, g, dist (for the step) }
      let TL = null;
      const paceAt = (K2, s) => {
        if (s <= K2[0][0]) return K2[0][1];
        for (let i = 1; i < K2.length; i++) if (s <= K2[i][0]) { const a = K2[i - 1], b = K2[i], u = smooth(clamp((s - a[0]) / Math.max(1e-3, b[0] - a[0]), 0, 1)); return lerp(a[1], b[1], u); }
        return K2[K2.length - 1][1];
      };
      const simWalk = (g, K2) => {   // the walk's table: s, v and the step's distance at each SIM_DT
        const S2 = [g.s0], Vv = [0], P2 = [0];
        let s0 = g.s0, v = 0, pd = 0, n = 0;
        while (s0 < g.s1 - 1e-4 && n < 400000) {
          const want = Math.min(paceAt(K2, s0), Math.sqrt(2 * A_MAX * Math.max(0, g.s1 - s0)) + 0.05);
          v = Math.max(0.05, v + clamp(want - v, -A_MAX * SIM_DT, A_MAX * SIM_DT));
          s0 = Math.min(g.s1, s0 + v * SIM_DT); pd += Math.min(v, V_CAD) * SIM_DT; n++;
          S2.push(s0); Vv.push(s0 >= g.s1 ? 0 : v); P2.push(pd);
        }
        g.tab = { s: Float64Array.from(S2), v: Float32Array.from(Vv), p: Float64Array.from(P2) };
        g.dur = (S2.length - 1) * SIM_DT; g.pd = pd;
      };
      const sOf = (g, t) => {   // [s, v, the step's distance in this walk]
        if (g.hold) return [g.s0, 0, 0];
        const T3 = g.tab, f = clamp((t - g.t0) / SIM_DT, 0, T3.s.length - 1), i = Math.min(T3.s.length - 2, Math.floor(f)), u = f - i;
        return [lerp(T3.s[i], T3.s[i + 1], u), lerp(T3.v[i], T3.v[i + 1], u), lerp(T3.p[i], T3.p[i + 1], u)];
      };
      const mkTimeline = (L) => {
        const segs = [];
        let dist = 0;
        const add = (o) => { o.t0 = segs.length ? segs[segs.length - 1].t1 : 0; o.t1 = o.t0 + o.dur; o.d0 = dist; dist += o.pd || 0; segs.push(o); return o; };
        const walk = (leg, s0, s1) => { const g = { leg, s0, s1 }; simWalk(g, L.pace.get(leg)); return add(g); };
        const hold = (leg, s, dur, tag) => add({ leg, s0: s, s1: s, dur, hold: true, tag });
        hold(L.OUT, 0, 3.6, "open"); walk(L.OUT, 0, L.S_D); hold(L.OUT, L.S_D, 3.2, "decl"); walk(L.OUT, L.S_D, L.OUT.len);
        hold(L.OUT, L.OUT.len, 6.6, "spring"); walk(L.BACK, 0, L.BACK.len); hold(L.BACK, L.BACK.len, 6.4, "wgate"); walk(L.IN, 0, L.IN.len);
        hold(L.IN, L.IN.len, 7.2, "pour");
        const tAt = (leg, s) => { for (const g of segs) if (!g.hold && g.leg === leg && s >= g.s0 - 1e-6 && s <= g.s1 + 1e-6) { const T3 = g.tab; let a = 0, b = T3.s.length - 1; while (b - a > 1) { const m = (a + b) >> 1; if (T3.s[m] < s) a = m; else b = m; } return g.t0 + b * SIM_DT; } return 0; };
        const tag = (k) => segs.find((g) => g.tag === k);
        const T2 = { walk0: tag("open").t1, decl0: tag("decl").t0, decl1: tag("decl").t1, rim1: tag("spring").t0, wg0: tag("wgate").t0, in0: tag("wgate").t1,
          top1: tag("pour").t0, end: tag("pour").t1,
          chulda: tAt(L.OUT, L.S_CHULDA), rampF: tAt(L.OUT, L.S_RAMPF), join: tAt(L.OUT, L.S_J), backChulda: tAt(L.BACK, L.U_CHULDA), sor: tAt(L.BACK, L.U_SOR),
          foot: tAt(L.IN, L.S_FOOT) };
        Object.assign(T2, { fill0: T2.rim1 + 1.0, fill1: T2.rim1 + 4.6, back0: tag("spring").t1, blow0: T2.wg0 + 0.3, blow1: T2.wg0 + 4.3, pour0: T2.top1 + 0.6, pour1: T2.top1 + 4.2 });
        // (kept for the captions and the sounds of before: the ramp's top as "ramp1", the court's part as "in1")
        T2.ramp1 = T2.top1 - 2.4; T2.in1 = T2.foot; T2.path1 = T2.rim1 - 1.2; T2.back1 = T2.backChulda;
        return { segs, T: T2 };
      };
      const stateAt = (t) => {
        const S = TL.segs; let g = S[0];
        for (const q of S) if (t >= q.t0) g = q;
        const [s, v, pd] = sOf(g, Math.min(t, g.t1));
        return { leg: g.leg, s, v, g, dist: g.d0 + pd };
      };
      // the floor under each foot: on stairs each on its own tread (the body between them)
      const footY1 = (x, z, by) => (inCourts(x, z) ? rayFloor(x, z, by + 1.2) : FLOOR(x, z, by));
      const footY = (x, z, by, fx, fz) => Math.max(footY1(x, z, by), footY1(x + fx * 0.12, z + fz * 0.12, by), footY1(x - fx * 0.12, z - fz * 0.12, by));   // the sole's heel, middle and toe: it rests on the highest
      // a priest of the demonstration on a leg: his place, heading and height; the step by the way walked (STRIDE amot a pair of steps)
      const placeFig = (f, leg, s, yaw, v, dist, off, carry) => {
        const q = leg.at(s), [x, z] = off ? leg.off(q, off) : [q[0], q[1]], y = leg.body(s, off || 0);
        f.g.position.set(x, y, z);
        f.g.rotation.y = yaw;
        const k = clamp(v / WALK_V, 0, 1), ph = dist * 2 * Math.PI / STRIDE, sw = Math.sin(ph);   // (dist - the step's distance: at most V_CAD a second)
        const FS = K.FS, cy = Math.cos(yaw), sy = Math.sin(yaw);
        for (const [ft, sd, sg] of [[f.fl, 1, 1], [f.fr, -1, -1]]) {
          const fz = sg * 0.3 * k * sw, lx = sd * 0.1 * FS;
          ft.position.z = fz;
          ft.position.y = footY(x + cy * lx + sy * fz, z - sy * lx + cy * fz, y, sy, cy) - y;
        }
        f.lean.position.y = Math.abs(Math.cos(ph)) * 0.035 * k;
        setArm(f.L, k > 0.05 ? [0.3 * k * sw, 0.08, -0.25] : ARM.rest, 1);
        setArm(f.R, carry ? ARM.carry : k > 0.05 ? [-0.3 * k * sw, 0.08, -0.25] : ARM.rest, -1);
      };
      // the lanes narrow in the gate of Chulda (its gold leaves open into the mount, and a column of the stoa before it)
      const kLane = (x, z) => (Math.abs(x) > 12 ? 1 : 1 - 0.7 * smooth(clamp((z - 317) / 5, 0, 1)) * (1 - smooth(clamp((z - 334) / 5, 0, 1))));   // (the left leaf's edge at x -2.3, the column at 0.2)
      const gateY = new Map();
      const folY = (x, z) => {   // the procession's floor: outside the gate - its formula; in the gate (its sill) - a ray of its own, on the gate's solids
        if (Math.abs(x) < 12 && z > 318 && z < 340) {
          if (!gateY.list) { rayFloor(0, 330, 3); const C = new Vector3(); gateY.list = RS.list.filter((o) => { if (o.isInstancedMesh) return true; const g = o.geometry; if (!g.boundingSphere) g.computeBoundingSphere(); C.copy(g.boundingSphere.center).applyMatrix4(o.matrixWorld); const r = g.boundingSphere.radius * o.matrixWorld.getMaxScaleOnAxis(); return C.x + r > -15 && C.x - r < 15 && C.z + r > 314 && C.z - r < 346; }); }
          RS.rc.set(RS.o.set(x, 3, z), RS.d); RS.rc.far = 60;
          for (const h of RS.rc.intersectObjects(gateY.list, false)) { let ok = true; for (let q = h.object; q; q = q.parent) if (q.visible === false) { ok = false; break; } if (ok) return h.point.y; }
        }
        return FLOOR(x, z, 0);
      };
      // ROUTE_CROWD_B2 (the coordinator, 22.11.2026: "והמון לאורך הדרך"): men and boys standing on both sides of the way outside the women's
      // court - from beyond the soreg across the mount and down the path to the spring (not in the stoa, the gate, on the ramp or where the
      // procession waits) - in small knots, their faces to the way; built when the demonstration starts, in pieces of about fifty amot (each its
      // own level of detail). Their number and places - model choices
      const ROUTE_COL = [0x2f6b3a, 0x5b3a8a, 0x2e5d9a, 0xc9a227, 0x9a3030, 0x2a8a80, 0xb86a2a, 0x6b7a2e, 0x8a3a6a, 0x3a4a8a];
      const buildRoute = (D2, L) => {
        if (D2.route) return D2.route;
        const RG = new Group(); RG.name = "shiloachRoute"; RG.visible = false; D2.DG.add(RG); D2.route = RG;
        let q = 9133; const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const PPr = tm_people(ctx2), OUT = L.OUT, chunks = []; let cur = [], acc = 0;
        for (let s = L.S_J + 16; s < OUT.len - 3; s += 5) {
          const qq = OUT.at(s), yaw = qq[2];
          if (qq[1] > 262 && qq[1] < RP.zf + 4) continue;   // the stoa, the gate, the ramp
          for (const sd of [-1, 1]) {
            if (rr() < 0.2) continue;
            const off = sd * (3.4 + rr() * 1.4), x0 = qq[0] + Math.cos(yaw) * off, z0 = qq[1] - Math.sin(yaw) * off;
            if (Math.hypot(x0 - SHL.SP.x, z0 - SHL.SP.z) < 30) continue;   // not at the spring (its pool, the view of the filling, the procession's halt)
            const n = 1 + (rr() < 0.55 ? 1 : 0) + (rr() < 0.25 ? 1 : 0);
            for (let k = 0; k < n; k++) { const a1 = (rr() - 0.5) * 1.8, b1 = sd * rr() * 0.9, x = x0 + Math.sin(yaw) * a1 + Math.cos(yaw) * b1, z = z0 + Math.cos(yaw) * a1 - Math.sin(yaw) * b1; cur.push([x, z, Math.atan2(qq[0] - x, qq[1] - z), FLOOR(x, z, 0), rr()]); }
          }
          acc += 5; if (acc >= 50) { chunks.push(cur); cur = []; acc = 0; }
        }
        if (cur.length) chunks.push(cur);
        let total = 0;
        chunks.forEach((C, ci) => {
          const men = C.filter((p2) => p2[4] >= 0.28), boys = C.filter((p2) => p2[4] < 0.28), avg = C.reduce((a2, p2) => a2 + p2[3], 0) / Math.max(1, C.length);
          if (men.length) PPr.crowd(RG, men.map((p2) => [p2[0], p2[1], p2[2], p2[3]]), { y: avg, s: 1.4, pose: "stand", kind: "worker", robe: ROUTE_COL[ci % ROUTE_COL.length], tone: (i) => (i + ci) % 4, name: "shiloachRoute" });
          if (boys.length) PPr.crowd(RG, boys.map((p2) => [p2[0], p2[1], p2[2], p2[3]]), { y: avg, s: 1.05, pose: "stand", kind: "student", robe: ROUTE_COL[(ci + 5) % ROUTE_COL.length], tone: (i) => (i + ci + 1) % 4, name: "shiloachRouteBoy" });
          total += C.length;
        });
        RG.userData.count = total;
        return RG;
      };
      // ---- the eye: ahead of him on his leg, looking back at him; still views at the stations, blended in and out
      const camAt = (t) => {
        const L = SHL.L, T2 = T, st = stateAt(t), q = st.leg.at(st.s), py = st.leg.body(st.s);
        // (while he stands at a leg's end, the eye's place is already the next leg's - the change is made under the still view, not seen)
        const rl = st.g.tag === "wgate" ? L.IN : st.g.tag === "spring" ? L.BACK : st.leg, rs = rl === st.leg ? st.s : 0;
        // PACE_G: the faster he goes, the higher and farther the eye (a view from the air); but under the royal stoa's roof and below the
        // courts' walls near them (smoothly)
        const [A0, H0] = rigAt(L, rl, rs), fast = Math.max(0, st.v - 6), A = A0 + 0.7 * fast;
        const sc = Math.min(rs + A, rl.len), qc = rl.at(sc);
        const wX = (x, a, b) => smooth(clamp((x - a) / 24, 0, 1)) * (1 - smooth(clamp((x - b) / 24, 0, 1)));   // 1 between a + 24 and b, 0 outside a..b + 24
        const capS = lerp(60, 5.2, smooth(clamp((qc[1] - 196) / 82, 0, 1)) * (1 - smooth(clamp((qc[1] - 338) / 10, 0, 1))));   // the royal stoa - all along the south (z 284..335)
        const capC = lerp(60, 6.5, wX(qc[0], -64, 30) * smooth(clamp((192 - qc[1]) / 82, 0, 1)));   // the court's south wall (z 65-70)
        const H = Math.min(H0 + 1.25 * fast, Math.max(H0, Math.min(capS, capC)));
        let eye = [qc[0], rl.body(sc) + H, qc[1]], look = [q[0], py + 1.9, q[1]];
        const SP = SHL.SP, sy = SP.gy != null ? SP.gy : Y0, B = BOWL();
        const pourV = (() => {
          const P1 = [[40, 31, B[1] + 11], [B[0] + 3, 25.5, B[1] - 1]], P2 = [[48.6, 29.4, B[1] + 8.6], [B[0] + 0.3, 26.2, B[1] - 0.4]], P3 = [[56, 31.5, B[1] + 13], [B[0] + 0.6, 26.2, B[1] - 0.6]];
          const mix = (P, Q, u) => [P[0].map((v, i) => lerp(v, Q[0][i], u)), P[1].map((v, i) => lerp(v, Q[1][i], u))];
          if (t < T2.pour0 + 0.8) return mix(P1, P2, smooth(clamp((t - T2.top1) / (T2.pour0 + 0.8 - T2.top1), 0, 1)));
          return mix(P2, P3, smooth(clamp((t - T2.pour0 - 0.8) / 2.0, 0, 1)));
        })();
        const shots = [
          [1 - smooth(clamp((t - T2.walk0 + 0.2) / 2.6, 0, 1)), [[108.5, 16.8, 3.2], [95.6, 15.2, 0]]],   // the opening: the two in the Nikanor gate, near
          // the eastern gate: from inside the women's court, beside them - they turn to the west, toward him and the house (the eye ahead of him
          // would stand in the gate's open leaves)
          [smooth(clamp((t - T2.decl0 + 2.4) / 2.4, 0, 1)) * (1 - smooth(clamp((t - T2.decl1) / 2.4, 0, 1))), [[213.5, 10.6, 0.8], [223.5, 8.0, 0]]],   // (in line with the gate: the blend out goes through its opening)
          [smooth(clamp((t - T2.rim1 + 2.6) / 2.6, 0, 1)) * (1 - smooth(clamp((t - T2.back0 - 0.2) / 2.8, 0, 1))), [[SP.x + 3.4, sy + 2.0, SP.z - 5.6], [SP.x - 0.4, SP.y - 0.3, SP.z - 0.4]]],
          [smooth(clamp((t - T2.wg0 + 3) / 3, 0, 1)) * (1 - smooth(clamp((t - T2.in0 + 2.0) / 2.4, 0, 1))), [[-21, 16.6, 83.2], [-16.5, 14.8, 72.4]]],   // (into the court before he goes: the eye through the gate's opening)   // the Water Gate, near (in line with its opening: the blend into the court goes through it)
          [smooth(clamp((t - T2.top1 + 3.2) / 3.2, 0, 1)), pourV]
        ];
        for (const [w, [E, Lk]] of shots) if (w > 0) { eye = eye.map((v, i) => lerp(v, E[i], w)); look = look.map((v, i) => lerp(v, Lk[i], w)); }
        return [eye, look];
      };
      // ---- the night (brighter for this demonstration: the user, "יותר תאורה. עכשיו חשוך מדי, גם בלילה, עם הלפידים")
      const NIGHT_G = { shlN: { el: -16, az: 0.15, sunI: 0.9, sunC: 0xa8bce8, hemI: 2.4, hemC: 0x97a8dc, gndC: 0x5a6590, fog: 0x101830, exp: 1.3 },
        shlA: { el: -11, az: 0.15, sunI: 0.95, sunC: 0xa8bce8, hemI: 2.3, hemC: 0x97a8dc, gndC: 0x5d6690, fog: 0x18203a, exp: 1.25 },
        shlH: { el: -2, az: 0.15, sunI: 1.1, sunC: 0xffd9b0, hemI: 2.0, hemC: 0xa8aec8, gndC: 0x6a6a78, fog: 0x4a4a58, exp: 1.15 } };   // (the dawn no darker than the night before it)
      const apply = (t) => {
        const D2 = buildDemo(), L = SHL.L, p = D2.p;
        if (!L || !TL) return;
        // the floor tables, a little each frame (ahead of the walkers; what is asked before is read at once)
        { let budget = 48; for (const [leg, off, upto] of SHL.fillList) { const n0 = (leg.tabs.get(off) || { n: 0 }).n; if (n0 > upto) continue; const n1 = leg.fill(off, Math.min(upto, n0 + budget - 1)).n; budget -= n1 - n0; if (budget <= 0) break; } }
        eznLeaves(SHL.run ? smooth(clamp((t - T.walk0) / 4, 0, 1)) : 0);   // EZN_GATE_G
        const st = stateAt(t), q = st.leg.at(st.s);
        // the priest: on his leg; while he stands - the turns (to the fall and back, to the gate, to the bowls)
        let yaw = q[2];
        if (st.g.tag === "spring") {
          const face = SHL.kit && SHL.kit.lake ? Math.PI / 2 : 0, back = L.BACK.yw[0];
          yaw = t < T.fill1 ? angTo(q[2], face, smooth(clamp((t - T.rim1) / 0.9, 0, 1))) : angTo(face, back, smooth(clamp((t - T.fill1) / 1.6, 0, 1)));
        } else if (st.g.tag === "wgate") yaw = angTo(q[2], Math.PI, smooth(clamp((t - T.wg0) / 0.9, 0, 1)));
        else if (st.g.tag === "pour") yaw = angTo(q[2], 0, smooth(clamp((t - T.top1) / 0.8, 0, 1)));
        p.g.visible = t < T.end;
        placeFig(p, st.leg, st.s, yaw, st.v, st.dist, 0, true);
        p.lean.rotation.x = 0;
        // filling under the spring's stream (the flask upright, its mouth under the spout)
        let fillK = 0, pourK = 0;
        if (t >= T.fill0 && t < T.back0) {
          fillK = smooth(clamp((t - T.fill0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.fill1 + 0.6) / 0.6, 0, 1)));
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.fill[i], fillK)), -1);
          p.lean.rotation.x = FILL_LEAN * fillK;
        }
        // pouring into the western bowl, his hand raised ("ולמנסך אומרים לו, הגבה ידך")
        if (t >= T.pour0 && t < T.end) {
          pourK = smooth(clamp((t - T.pour0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.6, 0, 1)));
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.pour[i], pourK)), -1);
          p.lean.rotation.x = POUR_LEAN * pourK;
        }
        setFlask(D2, TILT * pourK, yaw);
        const m = mouthW(D2, V1);
        streamTo(fillK > 0.9 && p.g.visible ? m.y + 0.02 : (SHL.SP.base || 0));
        D2.fwater.visible = false;
        if (pourK > 0.92 && p.g.visible) { const by = bowlY(), h = Math.max(0.05, m.y - by); D2.fwater.visible = true; D2.fwater.position.set(m.x, by + h / 2, m.z); D2.fwater.scale.y = h; }
        // SHILOACH_CHALAMISH_B2 - THE OPENING (Sukkah 5:4): "ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן...
        // היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח. הגיעו לשער היוצא ממזרח, הפכו פניהן למערב" - on his way, 4.2 amot ahead of him, three
        // amot to each side; they stop in the eastern gate and turn to the west (toward him and the house), and stay there
        {
          const sOut = st.leg === L.OUT ? st.s : L.OUT.len, sig = Math.min(sOut + 4.2, L.S_TG), walking = sig < L.S_TG - 1e-3 && st.leg === L.OUT;
          for (const [f, sd] of [[D2.t1, -3], [D2.t2, 3]]) {
            const qq = L.OUT.at(sig), turn = smooth(clamp((t - T.decl0) / 1.0, 0, 1));
            f.g.visible = true;
            placeFig(f, L.OUT, sig, qq[2] + Math.PI * turn, walking ? st.v : 0, st.dist, sd, false);
            const blowK = t < T.walk0 ? smooth(clamp((t - 0.6) / 0.5, 0, 1)) * (1 - smooth(clamp((t - 3.2) / 0.4, 0, 1)))
              : t < T.decl0 ? 1 - smooth(clamp((t - T.decl0 + 0.5) / 0.5, 0, 1)) : 0;
            if (blowK > 0) { setArm(f.R, ARM.rest.map((v, i) => lerp(v, ARM.tR[i], blowK)), -1); setArm(f.L, ARM.rest.map((v, i) => lerp(v, ARM.tL[i], blowK)), 1); }
            f.lean.children[f.lean.children.length - 1].visible = blowK > 0.3 || (t < T.decl0 && t > 0.4);
          }
        }
        // the two at the Water Gate, on its landing either side of the way in - there from the start; they blow when he comes
        for (const [f, x] of [[D2.t5, -21.4], [D2.t6, -14.4]]) {
          f.g.visible = true;
          if (SHL.wgY == null) SHL.wgY = rayFloor(-18, 73.2, 16);
          f.g.position.set(x, SHL.wgY, 73.2);
          f.g.rotation.y = x < -18 ? 0.35 : -0.35;   // their faces out, to the chel, a little toward the way in
          const up = smooth(clamp((t - T.blow0 + 0.6) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.blow1) / 0.5, 0, 1)));
          setArm(f.R, ARM.rest.map((v, i) => lerp(v, ARM.tR[i], up)), -1);
          setArm(f.L, ARM.rest.map((v, i) => lerp(v, ARM.tL[i], up)), 1);
          f.lean.children[f.lean.children.length - 1].visible = up > 0.3;
        }
        // TABLE_BLOW_B2 (the user's decision 102): two more ON THE TABLE OF THE FATS while he pours - Tamid 7:3 (88:40): "ושני כהנים עומדים על
        // שלחן החלבים ושתי חצוצרות של כסף בידם, תקעו והריעו ותקעו"; the marble table west of the ramp (40-altar.js, ctx2.shared.rampTables);
        // there from the start, their faces to the bowls
        {
          const blowA = smooth(clamp((t - T.pour0 + 0.4) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.5, 0, 1)));
          const RT = SH.rampTables, yo = SH.altarMeasures && SH.altarMeasures.mode === "yose", MBx = (RT ? RT.marble[0] : 40) + (yo ? 2 : 0), MBz = (RT ? RT.marble[1] : 16) + (yo ? -4 : 0);
          for (const [f, dz2] of [[D2.t3, -0.38], [D2.t4, 0.38]]) {
            const [x, z] = AW(MBx, MBz + dz2);
            f.g.visible = true;
            f.g.position.set(x, LV.KOH + (RT ? RT.top : 1.5) + 0.01, z);
            f.g.rotation.y = Math.atan2(43.5 - MBx, 9.4 - (MBz + dz2));
            setArm(f.R, ARM.rest.map((v, i) => lerp(v, ARM.tR[i], blowA)), -1);
            setArm(f.L, ARM.rest.map((v, i) => lerp(v, ARM.tL[i], blowA)), 1);
            f.lean.children[f.lean.children.length - 1].visible = blowA > 0.3;
          }
        }
        try { extraApply(D2, L, st, t); } catch (e) { if (!SHL.warned) { SHL.warned = true; console.warn("[shiloach extra]", e && e.message); } }
      };
      const extraApply = (D2, L, st, t) => {
        if (!D2.fol) return;
        // the night, and the dawn as they come back ("בעוד השחר עומד לעלות, שבה התהלוכה ועולה בכבש הדרומי"); the libation in the morning,
        // "מיד בסיום הקטרת קרבן התמיד" (Chalamish p. 14)
        const NK = SH.nightKit;
        if (SHL.night && NK) {
          if (!NK.P.shlH) Object.assign(NK.P, NIGHT_G);
          if (t < T.back0) NK.set("shlN", "shlN", 0);
          else if (t < T.backChulda) NK.set("shlN", "shlA", smooth(clamp((t - T.back0) / (T.backChulda - T.back0), 0, 1)));
          else if (t < T.wg0) NK.set("shlA", "shlH", smooth(clamp((t - T.backChulda) / (T.wg0 - T.backChulda), 0, 1)));
          else NK.set("shlH", "morning", smooth(clamp((t - T.wg0) / (T.top1 - T.wg0), 0, 1)));
        }
        D2.watch.visible = true;
        if (D2.route) D2.route.visible = true;   // ROUTE_CROWD_B2
        // the procession (104): on the out leg it waits beyond the soreg in its order (each d_i behind him, on its lane), takes him into its
        // middle (he walks between the lanes) and goes with him from S_J; it stops at S_A, before the spring, and he goes on alone; it turns
        // about where it stands, and when he comes back to the same place (U_R on the way back - the same point) it goes with him again, the
        // order reversed; it stops at U_P, before the soreg's opening, and he goes on alone to the Water Gate
        const fl = 0.85 + 0.15 * Math.sin(t * 17);
        const onOut = st.leg === L.OUT, sB = st.leg === L.BACK ? st.s : st.leg === L.IN ? L.BACK.len : 0;
        const moving = st.v > 0.5 && (onOut ? st.s > L.S_J && st.s < L.S_A : st.leg === L.BACK && st.s > L.U_R && st.s < L.U_P);
        const turnK = onOut && t >= T.fill1 ? smooth(clamp((t - T.fill1) / 1.6, 0, 1)) : 0;
        for (const F of D2.fol) {
          const leg = onOut ? L.OUT : L.BACK;
          const sig = clamp(onOut ? clamp(st.s, L.S_J, L.S_A) - F.d : clamp(sB, L.U_R, L.U_P) + F.d, 0, leg.len);
          const qq = leg.at(sig), side = (onOut ? 1 : -1) * F.side * kLane(qq[0], qq[1]);
          const x = qq[0] + Math.cos(qq[2]) * side, z = qq[1] - Math.sin(qq[2]) * side;
          F.G.visible = true;
          F.G.position.set(x, folY(x, z) + (moving ? Math.abs(Math.sin(st.dist * 2.6 + F.lag)) * 0.04 : 0), z);
          F.G.rotation.y = qq[2] + Math.PI * turnK;
          if (F.fl) F.fl.scale.set(fl, 0.9 + 0.2 * Math.sin(t * 23 + F.lag * 3), fl);
        }
        // SHILOACH_KIT_B2: the torches and the moon at the spring - by his distance from it
        if (SHL.kit) { const pp = D2.p.g.position; SHL.kit.setLit(SHL.run ? clamp((90 - Math.hypot(pp.x - SHL.SP.x, pp.z - SHL.SP.z)) / 30, 0, 1) : 0); }
        // the Levite with the lyre, by the spring
        const SP = SHL.SP;
        D2.lev.visible = SP.gy != null;
        if (SP.gy != null) { const lx = SP.x - 2.6, lz = SP.zT - 3.6; if (SHL.levY == null) SHL.levY = FLOOR(lx, lz, SP.gy); D2.lev.position.set(lx, SHL.levY, lz); D2.lev.rotation.y = 0.9; }
        // the libation (Chalamish pp. 27-28): the priest of the wine waits at the ramp's foot and goes up with him, to the eastern bowl
        const w2 = D2.w;
        w2.g.visible = true;
        {
          const sw = st.leg === L.IN ? clamp(st.s - L.S_FOOT + 2.1, 0, L.WINE.len) : 0, mv = st.leg === L.IN && sw > 0 && sw < L.WINE.len - 1e-3;
          const qw = L.WINE.at(sw), yawW = sw >= L.WINE.len - 1e-3 ? angTo(qw[2], 0, smooth(clamp((t - T.top1) / 0.8, 0, 1))) : qw[2];
          placeFig(w2, L.WINE, sw, yawW, mv ? st.v : 0, st.dist + 0.7, 0, true);
          const pk = smooth(clamp((t - T.pour0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.6, 0, 1)));
          if (pk > 0) { setArm(w2.R, ARM.carry.map((v, i) => lerp(v, ARM.pour[i], pk)), -1); w2.lean.rotation.x = POUR_LEAN * pk; } else w2.lean.rotation.x = 0;
          w2.g.updateMatrixWorld(true);
          QT.setFromAxisAngle(AX.set(Math.cos(w2.g.rotation.y), 0, -Math.sin(w2.g.rotation.y)), TILT * pk);
          gripAlign(w2.R, QT);   // HAND_SDF_MERGE_B2
          w2.R.grip.getWorldQuaternion(QG).invert();
          D2.wjug.quaternion.copy(QG).multiply(QT);
          D2.wjug.position.copy(NECK).applyQuaternion(QT).applyQuaternion(QG);
          D2.wjug.updateMatrixWorld(true);
          D2.wwine.visible = false;
          if (pk > 0.92) { const m = D2.wjug.localToWorld(V1.copy(MOUTH)), by = bowlY(), h = Math.max(0.05, m.y - by); D2.wwine.visible = true; D2.wwine.position.set(m.x, by + h / 2, m.z); D2.wwine.scale.y = h; }
        }
        // the deputy on the horn with the sudar ("הסגן עומד על הקרן והסודרים בידו", Tamid 7:3) - there from the start; he waves while they pour
        {
          const [hx, hz] = AW(42.0, 10.0);
          if (SHL.hornK !== hz) { SHL.hornK = hz; let hy = -Infinity; for (const [dx, dz2] of [[0, 0], [0.25, 0.25], [-0.25, 0.25], [0.25, -0.25], [-0.25, -0.25]]) hy = Math.max(hy, groundY(hx + dx, hz + dz2, 40)); SHL.hornY = isFinite(hy) ? hy : LV.KOH + 10; }
          const S2 = D2.sg;
          S2.g.visible = true;
          S2.g.position.set(hx, SHL.hornY, hz); S2.g.rotation.y = Math.PI / 2 + 0.35;
          const wave = smooth(clamp((t - T.pour0 + 0.7) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.pour1 - 0.4) / 0.5, 0, 1)));
          setArm(S2.R, ARM.rest.map((v, i) => lerp(v, [-2.85, 0.18, -0.15][i], wave)), -1);
          setArm(S2.L, ARM.rest, 1);
          S2.fl.position.z = S2.fr.position.z = 0; S2.lean.position.y = 0; S2.lean.rotation.x = 0;
          if (D2.sud.userData.tick) D2.sud.userData.tick(t, wave);
        }
        // the Levites on the duchan; the streams to the shitin while they pour
        D2.duch.visible = true;
        const pourOn = t >= T.pour0 + 0.3 && t < T.pour1 + 0.3;
        D2.shit.visible = pourOn;
        if (pourOn) { const dz = altDz(); for (const st2 of D2.shit.children) st2.position.set(st2.userData.bx, LV.KOH + 1.55, 9.4 + dz); }
        // the corner as glass while the streams go down (the place "ספלי הניסוך" shows it so)
        const FS2 = SH.features && SH.features.sfalimSee, want = t >= T.top1 && t < T.end;
        if (FS2 && SHL.glass !== want) { if (want && !FS2.isOn()) { FS2.on(); SHL.glassOurs = true; } else if (!want && SHL.glassOurs) { FS2.off(); SHL.glassOurs = false; } SHL.glass = want; }
      };
      // ---- the eye's keys for the walk engine: the eye above, every tenth of a second (Catmull-Rom through them gives it back)
      const keys = () => { const out = []; for (let k = 0, n = Math.ceil(T.end / 0.05); k <= n; k++) { const t = Math.min(T.end, k * 0.05); const [e, l] = camAt(t); out.push([+t.toFixed(3), e, l]); } return out; };
      const capsOf = () => [
        [0, "״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח״ (סוכה ד, ט)"],
        [1.2, "״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן... תקעו והריעו ותקעו״ (סוכה ה, ד)"],
        [T.walk0 + 0.4, "״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״ (סוכה ה, ד)"],
        [T.decl0 - 0.2, "״הגיעו לשער היוצא ממזרח, הפכו פניהן למערב, ואמרו... ואנו ליה עינינו״ (סוכה ה, ד)"],
        [T.decl1 + 0.2, "ויוצאים מהר הבית בשערי חולדה שבדרום — ״שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״ (מדות א, ג); ביציאה מחלקים לפידים — כפי שהובא בחלמיש"],
        [T.chulda - 0.6, "יורדים בכבש שלפני שער חולדה — ״ואלו שערי חולדה שבדרום הנם בגובה העיר היורד לשילוח״ (מעשי למלך, בשם מהרי״ט)"],
        [T.rampF, "ומרגלי הכבש דרומה ודרומה־מערבה אל השילוח — הדרך ומקום המעיין בחירת מודל"],
        [T.rim1 - 0.4, "המים נובעים בתוך הסלע בקול גדול, ויוצאים בפתח קטן — ״שילוח היה מוציא מים כאיסר״ (ירושלמי סוכה ה, ו); ״היה ממלא מן השלוח״ (סוכה ד, ט)"],
        [T.back0 + 0.6, "״בעוד השחר עומד לעלות, שבה התהלוכה ועולה בכבש הדרומי של הר הבית״ — כפי שהובא בחלמיש; ״שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״ (מידות א, ג)"],
        [T.wg0 - 0.4, "״הגיעו לשער המים, תקעו והריעו ותקעו״ (סוכה ד, ט). ״ולמה נקרא שמו שער המים. שבו מכניסין צלוחית של מים של נסוך בחג״ (מידות ב, ו)"],
        [T.foot - 0.4, "״עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם״ (סוכה ד, ט)"],
        [T.top1 - 0.6, "״הסגן עומד על הקרן והסודרים בידו״ (תמיד ז, ג); ״וסודרין — הם דגלים״ (פירוש המשניות לרמב״ם)"],
        [T.pour0 - 0.3, "״מערבי של מים, מזרחי של יין״; ״ולמנסך אומרים לו, הגבה ידך״ (סוכה ד, ט); ״ושני כהנים עומדים על שלחן החלבים ושתי חצוצרות של כסף בידם״ (תמיד ז, ג)"],
        [T.pour0 + 2.0, "״והניף הסגן בסודרין... ודברו הלוים בשיר״ (תמיד ז, ג); ״ובשנים עשר יום בשנה החליל מכה לפני המזבח... ובשמונת ימי החג״ (ערכין ב, ג); היין והמים יורדים בנקבים אל השיתין"]
      ];
      // the legs, the timeline and the floor tables (built once the spring is there; again if the altar's place moved)
      const prime = () => {
        buildPool();
        const key = altDz() + "," + (SH.altarMeasures ? SH.altarMeasures.mode : "") + "," + (SHL.offP ? SHL.offP.x : 0);
        if (!SHL.L || SHL.Lkey !== key) {
          SHL.L = mkLegs(); SHL.Lkey = key;
          TL = mkTimeline(SHL.L); T = TL.T;
          const L = SHL.L;
          SHL.fillList = [[L.OUT, 0, L.OUT.N - 1], [L.OUT, -3, Math.round(L.S_TG / STEP) + 8], [L.OUT, 3, Math.round(L.S_TG / STEP) + 8], [L.BACK, 0, L.BACK.N - 1], [L.IN, 0, L.IN.N - 1], [L.WINE, 0, L.WINE.N - 1]];
          // the first part of the out way at once (he stands for the opening): the court, the steps and the women's court
          L.OUT.fill(0, Math.round(30 / STEP)); L.OUT.fill(-3, Math.round(30 / STEP)); L.OUT.fill(3, Math.round(30 / STEP));
        }
        const D2 = buildDemo();
        try { buildRoute(D2, SHL.L); } catch (e) { console.warn("[shiloach route]", e && e.message); }   // ROUTE_CROWD_B2
        return D2;
      };
      const finish = () => {
        SHL.run = false;
        if (SHL.D) SHL.D.DG.visible = false;
        if (SHL.night && SH.nightKit) { SH.nightKit.end(); SHL.night = false; }
        if (SHL.glassOurs) { const FS2 = SH.features && SH.features.sfalimSee; if (FS2) FS2.off(); SHL.glassOurs = false; SHL.glass = false; }
        streamTo(SHL.SP.base || 0);
        if (SHL.kit) SHL.kit.setLit(0);
        eznLeaves(0);   // EZN_GATE_G: the gate as it was
        const sv = SHL.saved;
        if (sv && sv.lg) sv.lg.visible = sv.labels;
        if (sv && sv.view && SH.viewLimits) SH.viewLimits.set(sv.view);   // the view's limits as they were
        if (SHL.kit) SH.camLow = Y0 - 3; else delete SH.camLow;   // SHILOACH_WEST_B2: the valley stays open to the eye once the spring is built
        SHL.saved = null;
      };
      // EZN_GATE_G: the women's court's eastern gate - "הגיעו לשער היוצא ממזרח" (Sukkah 5:4). If its two gold leaves stand less than 1.1 radian
      // open (in 30-courts.js they stood 0.3 ajar - almost shut), they open wide into the court while the procession comes, and at the end go
      // back to the very angle they had (read from the leaves at the start - so whatever angle that module gives them)
      const EZN = { m: null, base: null, k: 0 };
      const eznRead = () => {   // at each start: the leaves' places and their opening now
        if (EZN.m === null) {
          EZN.m = false;
          ctx2.root.traverse((o) => { if (EZN.m || !o.isInstancedMesh || o.count !== 2) return; const m = new Matrix4(), p = new Vector3(); o.getMatrixAt(0, m); p.setFromMatrixPosition(m); if (Math.abs(p.x - 228.5) < 0.01 && Math.abs(p.y - 6) < 0.01 && Math.abs(Math.abs(p.z) - 5) < 0.01) EZN.m = o; });
        }
        if (!EZN.m) return;
        EZN.base = [0, 1].map((i) => {
          const m = new Matrix4(); EZN.m.getMatrixAt(i, m);
          const p = new Vector3().setFromMatrixPosition(m), e = m.elements, a = Math.atan2(e[8], e[0]), sg = p.z < 0 ? -1 : 1;
          let open = sg < 0 ? -a : a - Math.PI; while (open > Math.PI) open -= 2 * Math.PI; while (open < -Math.PI) open += 2 * Math.PI;
          return { p, a, sg, open, to: open < 1.1 ? 1.4 : open };
        });
        EZN.k = 0;
      };
      const eznLeaves = (k) => {
        if (!EZN.m || !EZN.base || Math.abs(EZN.k - k) < 1e-4) return;
        EZN.k = k;
        const m = new Matrix4();
        EZN.base.forEach((b, i) => { m.makeRotationY(b.a + b.sg * (b.to - b.open) * k); m.setPosition(b.p); EZN.m.setMatrixAt(i, m); });
        EZN.m.instanceMatrix.needsUpdate = true;
        EZN.m.boundingSphere = null; EZN.m.boundingBox = null;   // (the rays and the culling take the open leaves)
      };
      const goldEnv = (D2) => {   // GOLD_FLASK_G ("צלוחית של זהב", Sukkah 4:9 - 56:48): at night the scene has no environment map (55-payis.js), and a
        // metal without one is drawn dark brown - the gold keeps the day's reflections as its own map, and a faint warm glow of its own
        const env = ctx2.scene && ctx2.scene.environment;
        if (env && D2.gold && D2.gold.envMap !== env) { D2.gold.envMap = env; D2.gold.envMapIntensity = 1.15; D2.gold.needsUpdate = true; }
        if (D2.gold && !D2.gold.userData.glowG) { D2.gold.emissive.setHex(0x3a2806); D2.gold.emissiveIntensity = 0.55; D2.gold.userData.glowG = true; }
      };
      const start = () => {
        const Wk = SH.walk;
        if (!Wk || !K || !FIG) return false;
        if (fnc(SH.stopDemos)) SH.stopDemos("shiloachDemo");
        const D2 = prime();
        goldEnv(D2);
        eznRead();   // EZN_GATE_G
        for (const f of [D2.p, D2.t1, D2.t2, D2.t3, D2.t4, D2.t5, D2.t6, D2.w, D2.sg].filter(Boolean)) f.sash.material = (SH.tamid && SH.tamid.belt === "white") ? K.mSashWhite : K.mSashDyed;
        let lg = null;
        try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        SHL.saved = { lg, labels: lg ? lg.visible : true, view: SH.viewLimits ? SH.viewLimits.get() : null };
        if (lg) lg.visible = false;
        // the eye goes down to the Shiloach, far from the mount and under its ground: the view's limits are widened for the walk
        if (SH.viewLimits) SH.viewLimits.include([SHL.POOL[0], Y0 - 1, SHL.POOL[1] + 10]);
        SH.camLow = Y0 - 3;
        SHL.night = !!(SH.nightKit && SH.nightKit.begin());   // SHILOACH_CHALAMISH_B2: at night, by torches (pp. 11-14)
        SHL.glass = false; SHL.glassOurs = false;
        D2.DG.visible = true;
        SHL.run = true;
        apply(0);
        Wk.run(keys(), capsOf(), finish);
        return true;
      };
      const stop = () => { if (!SHL.run) return; const Wk = SH.walk; if (Wk && Wk.on) Wk.stop(); else finish(); };
      let sndT = -1;
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!SHL.run) { sndT = -1; return; }
        const Wk = SH.walk, t = Wk && fnc(Wk.now) ? Math.max(0, Wk.now()) : 0;
        try { apply(t); } catch (e) { console.warn("[shiloach]", e && e.message); }
        try {
          if (sndT >= 0 && t > sndT && fnc(SH.sfx)) {
            if (sndT < 0.8 && t >= 0.8) SH.sfx("trumpets");   // the opening, at the Nikanor gate
            for (const ts of [T.rim1 - 2.4, T.rim1 + 1.5, T.fill0 + 2.5]) if (sndT < ts && t >= ts) { if (SHL.kit) SHL.kit.roar(); }   // SHILOACH_KIT_B2: the kit's roar   // SPRING_ROAR_B2: "נובעים בקול גדול"
            if (sndT < T.fill0 + 0.4 && t >= T.fill0 + 0.4) SH.sfx("water", { dur: 2.2, gain: 0.7 });
            if (sndT < T.blow0 && t >= T.blow0) SH.sfx("trumpets");
            if (sndT < T.pour0 + 0.5 && t >= T.pour0 + 0.5) SH.sfx("water", { dur: 2.0, gain: 0.6 });
            if (sndT < T.pour0 && t >= T.pour0) SH.sfx("trumpets");   // ALTAR_BLOW_B2
          }
        } catch (_) {}
        sndT = t;
      });
      const walkEntry = () => (SH.demoStops || []).find((q) => q.id === "walk");
      (SH.demoStops || (SH.demoStops = [])).push({ id: "shiloachDemo", running: () => SHL.run, stop,
        pause: () => { const w = walkEntry(); if (w) w.pause(); }, resume: () => { const w = walkEntry(); if (w) w.resume(); },
        paused: () => { const w = walkEntry(); return !!(w && w.paused()); }, restart: () => { stop(); start(); } });
      const INFO = "**המשנה** (סוכה ד, ט): ״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו. עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם... מערבי של מים, מזרחי של יין... ולמנסך אומרים לו, הגבה ידך״; ובשבת (שם, י): ״היה ממלא מערב שבת חבית של זהב שאינה מקדשת, מן השלוח, ומניחה בלשכה״.\n" +
        "**שער המים** (מידות ב, ו): ״ולמה נקרא שמו שער המים. שבו מכניסין צלוחית של מים של נסוך בחג. רבי אליעזר בן יעקב אומר, ובו המים מפכים, ועתידין להיות יוצאין מתחת מפתן הבית״; וכן בתוספתא (סוכה ג, ג).\n" +
        "**שערי חולדה** (מידות א, ג): ״שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״.\n" +
        "**השילוח** — תני, רבן שמעון בן גמליאל אומר: ״שילוח היה מוציא מים כאיסר. אמרו: נרחיבנו וירבו מימיו. הרחיבוהו ונתמעטו מימיו. חזרו וגדרוהו וחזר לכמות שהיה״ (ירושלמי סוכה ה, ו).\n" +
        "**מקום המעין**: מדרום להר הבית ולמטה ממנו, בצד הדרומי־מערבי. **מלבי״ם** (דברי הימים ב לג, יד): ״מערבה לגיחון. הוא בצד מערב ירושלים״; ושם (לב, ל): ״מערבה. כי ברכת השלח היה בצד מערב כמבואר בנחמיה ג׳״; ולפי ההקפה שלו בנחמיה ג — ברכת השלח בחלק הדרומי של הצד המערבי, קרוב לפינה הדרומית־מערבית. **מעשי למלך** (בית הבחירה ה, א), בשם מהרי״ט: ״ואלו שערי חולדה שבדרום הנם בגובה העיר היורד לשילוח, ומשם מכניסין צלוחית של מים בחג דרך שער המים״.\n**במודל:** אין מקור שמתאר את הדרך מהמקדש אל השילוח ואת מרחקו. המעין מצויר בתחתית העמק, כמאתיים אמה מדרום לחומה ומתחת לפינה הדרומית־מערבית של הר הבית, והשביל אליו יורד מרגלי הכבש שלפני שער חולדה המערבי דרומה ודרומה־מערבה — המקום המדויק והדרך הן בחירת מודל. הדרך בהדגמה — כפי שהיא מצוירת בחלמיש (״אלחנן וחיים שמחים בירושלים״, עמ׳ 10–14): בפתיחה שני כהנים תוקעים בשער ניקנור, יורדים במעלות ותוקעים בהליכה עד שער עזרת נשים, ושם הופכים פניהם למערב (סוכה ה, ד); משם עוברים את הר הבית ויוצאים בשער חולדה המערבי שבדרום (״שני שערי חלדה מן הדרום, משמשין כניסה ויציאה״ — מדות א, ג), ובלפידים יורדים בכבש שלפניו, ומרגליו דרומה ודרומה־מערבה אל מעין השילוח; ובחזרה, עם עלות השחר, ״עולה בכבש הדרומי של הר הבית״ ונכנסת בשער חולדה אל שער המים. במשנה נאמר רק ״הגיעו לשער המים״ — הדרך בחירת מודל; ההליכה מחוץ להר הבית מואצת. **הכבש הדרומי**: לפני שני שערי חולדה כבש משופע (במקום מדרגות) — כפי שהוא נקרא בחלמיש; שיפועו ורוחבו — בחירת מודל. **המעין**: המים נובעים בקול גדול ויוצאים בפתח קטן שבתחתית צוק — ״שילוח היה מוציא מים כאיסר״ (ירושלמי סוכה ה, ו) — ונופלים במפל לבן צר ישר אל בריכה טבעית שבין סלעים אפורים, ובה קצף ומערבולת; הכהן עומד על שפת הבריכה, לצד המפל, וממלא מתחת לזרם. כמו בחלמיש (עמ׳ 13): צוק כתום־חום, הרבה שרכים ושיחים, אור הלפידים ואור ירח כחלחל. צורת הצוק, רוחב המפל, הבריכה והצמחייה — בחירת מודל. **התוקעים בשעת הניסוך** — לשון המשנה (תמיד ז, ג): ״ושני כהנים עומדים על שלחן החלבים ושתי חצוצרות של כסף בידם, תקעו והריעו ותקעו״; **הרמב״ם** (כלי המקדש ז, ו): ״וכן תוקעין שלש למלוי המים שמנסכין בחג, ואין תוקעים למלוי המים בשבת. ותוקעין שלש על גבי המזבח בשעה שמנסכין המים״. במודל — על שלחן החלבים. **הסגן והסודר** — ״הסגן עומד על הקרן והסודרים בידו״, ״והניף הסגן בסודרין, והקיש בן ארזא בצלצל, ודברו הלוים בשיר״ (תמיד ז, ג); ״וסודרין — הם דגלים״ (פירוש המשניות לרמב״ם). בהדגמה כמאה איש הולכים בתהלוכה, והמון עומד משני צדי הדרך — בהר הבית ומחוצה לו. צורת הבריכה והסלע, הפתח, צורת הכד, מספר ההולכים והעומדים והלפידים, ומקומות התוקעים והסגן — בחירות מודל. בהדגמה הכהן ממלא את הכד מתחת לזרם, ומנסך ביד מורמת לתוך הספל המערבי, וכהן היין בספל המזרחי. בהדגמה דרך אחת רציפה: בשערים, במעיין ובעזרה — בקצב הליכה; בקטעים הארוכים ההליכה מואצת, והמבט עולה למעלה.";
      const REFS = [["סוכה ד, ט", { book: 56, index: 48 }], ["סוכה ד, י", { book: 56, index: 49 }], ["מידות ב, ו", "Mishnah_Middot.2.6"], ["מידות א, ג", "Mishnah_Middot.1.3"], ["רמב״ם כלי המקדש ז, ו", { book: 338, index: 107 }], ["תמיד ז, ג", { book: 88, index: 40 }], ["סוכה ה, ד", { book: 56, index: 54 }], ["מלבי״ם דברי הימים ב לג, יד — בצד מערב", { book: 3364, index: 971 }], ["מלבי״ם דברי הימים ב לב, ל — ברכת השלח", { book: 3364, index: 958 }], ["מלבי״ם נחמיה ג — צד המערב", { book: 3370, index: 81 }], ["מלבי״ם נחמיה ג — מי השלוח", { book: 3370, index: 85 }], ["מעשי למלך בית הבחירה ה, א — בשם מהרי״ט", { book: 4304, index: 349 }]];   // SHILOACH_WEST_B2
      SH.shiloach = { demo: start, stop, get T() { return T; }, info: INFO, refs: REFS, POOL: SHL.POOL, kit: () => SHL.kit,
        // (tests and pictures: the scene at second t, and the eye there)
        at: (t) => { const D2 = prime(); goldEnv(D2); D2.DG.visible = true; apply(t); return { Y0, cam: camAt(t) }; },
        cam: (t) => { prime(); return camAt(t); }, legs: () => { prime(); return SHL.L; }, D: () => SHL.D, terrainY, state: (t) => { prime(); const st = stateAt(t); return { leg: st.leg.name, s: st.s, v: st.v, tag: st.g.tag || null }; },
        leave: () => { if (SHL.D) SHL.D.DG.visible = false; }, dbg: () => ({ route: SHL.D && SHL.D.route ? SHL.D.route.userData.count : null, fol: SHL.D && SHL.D.fol ? SHL.D.fol.length : null, offF: SHL.offF, offP: SHL.offP, SP: { x: SHL.SP.x, y: SHL.SP.y, gy: SHL.SP.gy, zT: SHL.SP.zT }, standF: standF(), standP: standP(), bowl: BOWL(), bowlY: bowlY(), T, len: SHL.L ? { out: SHL.L.OUT.len, back: SHL.L.BACK.len, in: SHL.L.IN.len } : null }) };
      SH.modelButtons = SH.modelButtons || [];
      SH.modelButtons.push({
        id: "shiloachDemo", label: "הדגמה: ניסוך המים — מן השילוח", labelOn: "עצור את ההדגמה", maxDist: 140,
        title: "״צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו״ (סוכה ד, ט). ההדגמה: מעזרת ישראל דרך עזרת נשים, הר הבית ושער חולדה המערבי, ובכבש שלפניו אל השילוח; ממלא, חוזר באותה דרך אל שער המים, ומנסך בספל המערבי, ושני כהנים תוקעים על שלחן החלבים.",
        anchor: () => [SHL.POOL[0], Y0 + 9, SHL.POOL[1]],
        get: () => SHL.run,
        set: (on) => { if (on) start(); else stop(); }
      });
    }
    // ---------- SIMCHA_304 (the user, 19.11.2026 19:09: "תעשה הדגמה של שמחת בית השואבה / א: עם כל המרפסות של עזרת הנשים / ב: עם ----------
    // חסידים שהיו מרקדין, ושרים אשרי מי שלא חטא וכו' / ג: עם כל הנלוה"; 19:33: "1." - three balconies, north, south and east; "2. זיזים
    // קבועים תמיד הדגמה רק במתג"; "3. לפני העם - תוסיף מלא אנשים בגילאים שונים כולל ילדים במבנה הדמויות שעשית רק לא כהנים"; "4. ב" - the
    // trumpets and the Levites' instruments): THE REJOICING OF THE WATER-DRAWING. Every quotation read in the library (book:line):
    //  Mishnah Sukkah 5:1-4 (56:51-54); Middot 2:5 (89:16) "וחלקה היתה בראשונה, והקיפוה כצוצרה"; the Bavli, Sukkah 51b (108:1323) "מאי
    //  תיקון גדול? ... חלקה היתה בראשונה. והקיפוה גזוזטרא", 53a (1361: the three sayings; 1366: Rabban Shimon ben Gamliel), 53b (1376: "בעי
    //  רבי ירמיה: למעלה עשירית... תיקו"); the Tosefta, Sukkah 4:1 "עשו שלש גזוזטראות בעזרה כנגד שלש רוחות", 4:2-3, 4:5; the Rambam, Beit
    //  HaBechira 5:9 (337:84), Lulav 8:12-15; the Tiferet Yisrael, Sukkah 5 (772:516 "שהניחו קרשים עם מעקה סביב על הזיזין שיוצאין מהחומות
    //  סביב", 536 "לפני כל העם שעמדו סביב אצל החומות", 554 "לרצפת עזרת נשים") and Middot 2:5 (819:243 "תקרה בולטת מאמצע גובה כתליה");
    //  the Bartenura, Sukkah 5:4 "בארבע אבוקות או בשמונה, זורק זו ומקבל את זו".
    //  ALWAYS: the corbels (zizim) in the walls of the women's court - north, south and east (by its gate), between the chambers, at the
    //  middle of the walls' height. ONLY IN THE DEMONSTRATION (a switch, off by default: the place "שמחת בית השואבה — הדגמה" and the pill):
    //  the planks and the railing on them, the night, the golden lamps lit (SH.simchaDemo.drive), the people by the walls (men and boys of
    //  every age, in their own clothes - tm_people), the dancers with torches, Rabban Shimon ben Gamliel, the Levites on the fifteen steps
    //  with their instruments and the flute below them, the music (sfxLoop "simcha"), and at the cock's crow the two priests with the
    //  trumpets, from the upper gate to the gate that goes out to the east. MODEL CHOICES: the balconies' depth, the corbels' number and
    //  form, the number and places of the people, the dancers and the Levites, the music, the timing; the tenth step - see the card.
    {
      const Y0 = LV.EZN, HB = 17, YB = Y0 + HB, DEP = 3.5, RAILH = 1.9, CXc = 161;
      const WN = -65, WS = 65, WE = 226;   // the walls' inner faces (30-courts.js: 5 thick, on z -+67.5 and x 228.5)
      const fnc = (f) => typeof f === "function";
      const SLOW = () => SH.demoSlow || 1.5;
      const noP = (o) => { o.userData.noPick = true; return o; };
      // ---- the corbels (always) and the planks with the railing (the demonstration) ----
      // a span: along x (the north and south walls) or z (the east wall); `w` the wall's face, `n` into the court; `part` - "j" only
      // when Josephus's gates of the north and the south stand (ctx2.shared.eznGates), "k" only when they do not, "e" the east's
      const SPANS = [
        { ax: "x", w: WN, n: 1, a: 133.5, b: 188.5, part: "k" }, { ax: "x", w: WN, n: 1, a: 133.5, b: 153, part: "j" }, { ax: "x", w: WN, n: 1, a: 169, b: 188.5, part: "j" },
        { ax: "x", w: WS, n: -1, a: 133.5, b: 188.5, part: "k" }, { ax: "x", w: WS, n: -1, a: 133.5, b: 153, part: "j" }, { ax: "x", w: WS, n: -1, a: 169, b: 188.5, part: "j" },
        { ax: "z", w: WE, n: -1, a: -27.5, b: -7.2, part: "e" }, { ax: "z", w: WE, n: -1, a: 7.2, b: 27.5, part: "e" }
      ];
      const zizG = grp("eznZizim", true), plankG = grp("eznGezuztra", false);
      const zizP = { k: new Group(), j: new Group(), e: new Group() }, plP = { k: new Group(), j: new Group(), e: new Group() };
      for (const k of ["k", "j", "e"]) { zizG.add(zizP[k]); plankG.add(plP[k]); }
      const zizGeo = (() => {   // the corbel's side: at the wall 1.5 high, out DEP - 0.2, its lower face rising to 0.45 under the top
        const sh = new Shape();
        sh.moveTo(0, 0); sh.lineTo(DEP - 0.2, 1.05); sh.lineTo(DEP - 0.2, 1.5); sh.lineTo(0, 1.5); sh.lineTo(0, 0);
        const g = new ExtrudeGeometry(sh, { depth: 0.6, bevelEnabled: false });
        g.translate(0, 0, -0.3);
        return g;
      })();
      const wood = new MeshStandardMaterial({ color: 0x8a6a46, roughness: 0.85 });
      const m4z = new Matrix4(), qz = new Quaternion(), vz = new Vector3(), sz1 = new Vector3(1, 1, 1), upY = new Vector3(0, 1, 0);
      for (const S of SPANS) {
        const L = S.b - S.a, nC = Math.max(2, Math.round(L / 2.5)), sp = L / nC;
        const yaw = S.ax === "x" ? (S.n > 0 ? -Math.PI / 2 : Math.PI / 2) : Math.PI;   // the corbel's local +x into the court
        const at = (u, out) => (S.ax === "x" ? [u, S.w + S.n * out] : [S.w + S.n * out, u]);
        const zi = new InstancedMesh(zizGeo, M2.stoneLight, nC);
        qz.setFromAxisAngle(upY, yaw);
        for (let i = 0; i < nC; i++) { const [x, z] = at(S.a + (i + 0.5) * sp, 0); m4z.compose(vz.set(x, YB - 1.5, z), qz, sz1); zi.setMatrixAt(i, m4z); }
        zi.instanceMatrix.needsUpdate = true;
        zi.castShadow = true; zi.receiveShadow = true;
        zizP[S.part].add(noP(zi));
        // the planks on them, and the railing at their outer edge (posts over the corbels, two rails, the two ends closed to the wall)
        const mid = at((S.a + S.b) / 2, DEP / 2);
        const pl = new Mesh(S.ax === "x" ? new BoxGeometry(L, 0.22, DEP) : new BoxGeometry(DEP, 0.22, L), wood);
        pl.position.set(mid[0], YB + 0.11, mid[1]); pl.castShadow = pl.receiveShadow = true;
        plP[S.part].add(noP(pl));
        const posts = new InstancedMesh(new BoxGeometry(0.18, RAILH, 0.18), wood, nC + 1);
        for (let i = 0; i <= nC; i++) { const [x, z] = at(S.a + Math.min(L - 0.09, Math.max(0.09, i * sp)), DEP - 0.12); m4z.compose(vz.set(x, YB + 0.22 + RAILH / 2, z), qz.identity(), sz1); posts.setMatrixAt(i, m4z); }
        posts.instanceMatrix.needsUpdate = true;
        plP[S.part].add(noP(posts));
        for (const h of [RAILH * 0.5, RAILH]) {
          const r = at((S.a + S.b) / 2, DEP - 0.12);
          const rail = new Mesh(S.ax === "x" ? new BoxGeometry(L, 0.14, 0.14) : new BoxGeometry(0.14, 0.14, L), wood);
          rail.position.set(r[0], YB + 0.22 + h, r[1]);
          plP[S.part].add(noP(rail));
          for (const u of [S.a + 0.07, S.b - 0.07]) {
            const e = at(u, (DEP - 0.12) / 2);
            const end = new Mesh(S.ax === "x" ? new BoxGeometry(0.14, 0.14, DEP - 0.12) : new BoxGeometry(DEP - 0.12, 0.14, 0.14), wood);
            end.position.set(e[0], YB + 0.22 + h, e[1]);
            plP[S.part].add(noP(end));
          }
        }
      }
      // which spans stand: Josephus's gates in the middle of the north and the south walls cut those balconies; Rabbenu Shemaya's low
      // east wall (20-mount.js / 30-courts.js, the layer ewShemayaEzn) has no corbels; the planks only while the demonstration runs
      let demoOn = false, syncK = "";
      const sync = () => {
        const j = !!(SH.eznGates && SH.eznGates.josephus), lowE = !!(ctx2.layers.ewShemayaEzn && ctx2.layers.ewShemayaEzn.visible);
        const k = (j ? "j" : "k") + (lowE ? "L" : "H") + (demoOn ? "1" : "0");
        if (k === syncK) return;
        syncK = k;
        zizP.k.visible = !j; zizP.j.visible = j; zizP.e.visible = !lowE;
        plP.k.visible = !j; plP.j.visible = j; plP.e.visible = !lowE;
        plankG.visible = demoOn;
      };
      sync();
      lbl("הזיזים — לגזוזטרא של שמחת בית השואבה (תפארת ישראל, סוכה ה, ב)", 161, YB + 4.2, WN + 3, 1.3, "eznZizim");
      // ---- the demonstration's group (built at its first start) ----
      const DG = grp("simchaShoeva", false);
      const silver = new MeshStandardMaterial({ color: 0xd9dde2, metalness: 0.85, roughness: 0.3 });
      const pitch = new MeshStandardMaterial({ color: 0x2a1c12, roughness: 0.9, emissive: 0x3a1206, emissiveIntensity: 0.6 });
      const T0 = SH.simchaDemo && SH.simchaDemo.tex ? SH.simchaDemo.tex : null;
      const flameM = T0 ? new SpriteMaterial({ map: T0.flame, transparent: true, depthWrite: false, blending: AdditiveBlending }) : null;
      const haloM = T0 ? new SpriteMaterial({ map: T0.halo, transparent: true, depthWrite: false, blending: AdditiveBlending }) : null;
      const FLS = [];   // every torch's flame (they flicker)
      const stickG = new CylinderGeometry(0.045, 0.06, 1.6, 6).translate(0, 0.8, 0);
      const headG = new CylinderGeometry(0.11, 0.075, 0.3, 8).translate(0, 1.72, 0);
      // a torch: the stick, its pitch-head and the fire on it - LIVE_FIRE_304 (the user, 20:43: "האש בלפידים צריכה להיות ממש חיה. אש
      // אש אמיתית"): the altar's live fire (40-altar.js, ctx2.shared.liveFlame), and round it a warm glow; its foot at the group's origin
      const torch = (big, fy = 2.25) => {
        const g = new Group();
        g.add(noP(new Mesh(stickG, wood)));
        g.add(noP(new Mesh(headG, pitch)));
        const live = fnc(SH.liveFlame) ? SH.liveFlame(g, 0, 1.8, 0, big ? 0.2 : 0.17, big ? 0.95 : 0.8, 1.0) : null;
        if (live) noP(live);
        else if (flameM) {   // (only where the live fire is missing: the soft sprite of before)
          const f = new Sprite(flameM); f.position.set(0, fy, 0); f.scale.set(0.55, 1.05, 1); f.renderOrder = 9; noP(f); g.add(f);
          f.userData.ph = FLS.length * 1.7; f.userData.k = 1; FLS.push(f);
        }
        if (haloM) { const h = new Sprite(haloM); h.position.set(0, 2.2, 0); h.scale.setScalar(big ? 3.6 : 2.4); h.renderOrder = 8; noP(h); g.add(h); }
        return g;
      };
      // the fifteen steps (30-courts.js): the Rambam's half discs (the default) - step k (1 the lowest) is the ring of radius 22 - k/2 ..
      // 22.5 - k/2 round (96, 0), its face at 6 + k/2; the Rid's straight steps - step k from x 96 + (15 - k)/2 to 96 + (16 - k)/2
      const ridSteps = () => !!(SH.steps15 && SH.steps15.mode === "rid");
      // the light (the user, 20:44: "התאורה, משהו חשוך, אמנם זה לילה, אבל עדיין צריך לראות מה קורה שם"): three phases of the night
      // kit (55-payis.js NIGHT) of its own - a clear night until the lamps are lit; then "ולא היתה חצר בירושלים שאינה מאירה מאור בית
      // השואבה" (Sukkah 5:3), warm and strong; at the cock's crow, the first grey of the dawn. Their values - model choices
      { const NK = SH.nightKit;
        if (NK && NK.P && !NK.P.simchaNight) Object.assign(NK.P, {
          simchaNight: { el: -16, az: 0.15, sunI: 0.75, sunC: 0xa3b5e2, hemI: 1.95, hemC: 0x96a6d6, gndC: 0x4d5578, fog: 0x0a0f1c, exp: 1.1 },
          simchaLit: { el: -16, az: 0.15, sunI: 0.7, sunC: 0xffcf98, hemI: 2.0, hemC: 0xeec49a, gndC: 0x655036, fog: 0x0c0c14, exp: 1.08 },
          simchaDawn: { el: -5, az: 0.15, sunI: 0.95, sunC: 0xd9d6e8, hemI: 2.2, hemC: 0xc8c6d6, gndC: 0x5e5a60, fog: 0x2c3044, exp: 1.1 } }); }
      const stepY = (x, z, rid) => {
        const r = rid ? x - 96 : Math.hypot(x - 96, z);
        if (rid) { if (r <= 0.5) return 13.5; if (r >= 7.5) return Y0; return Y0 + 0.5 * (16 - Math.ceil(r / 0.5)); }
        if (r <= 15) return 13.5; if (r >= 22) return Y0; return Y0 + 0.5 * Math.min(15, Math.floor((22 - r) / 0.5) + 1);
      };
      // the golden lamps (above) - SIMCHA_LAMPS_B2: where they stand now (in the court, or in the corner chambers with the roofing "in the
      // name of Rav Chaim Kanievsky"); the crowd is laid out round them, and laid out again when they move (B.crowdKey)
      const lampSpots = () => (SH.simchaLamps && typeof SH.simchaLamps.spots === "function" ? SH.simchaLamps.spots() : [[141, -20], [181, -20], [141, 20], [181, 20]]);
      const lampKey = () => JSON.stringify(lampSpots()) + "|" + (SH.eznRoof && SH.eznRoof.on ? "r" : "");
      const DR = 8.2, NDANCE = 14;
      // ---- MUSICIANS_305 (the user, 21:08: "צריך גם לעשות את הלוויים מנגנים... אם הם מנגנים, לא יכולים לעמוד כמו פסלים"; 21:10:
      // "ידיים של הכוהנים תופסות את החצוצרה, אי אפשר בלי"): THE MUSICIANS' KIT. A musician is a figure of tm_people without its own
      // arms (crowd o.arms: false); every frame his arms (PP.rig) and his instrument are set: the instrument in his hands, the hands at
      // their work in time with the music, the body swaying a little with it. All in the figure's own units (its scale 1.4 - an amah
      // is 0.714; the face to +z, the left at +x). Until 2.0.13 the Levites and the flutes stood still, their instruments standing
      // before them, and the priests' trumpets moved before their mouths without hands. The instruments' forms and the motions -
      // model choices.
      const MUS = (() => {
        const UA = 0.32, FA = 0.29, HL = 0.075;   // the upper arm, the forearm (to the wrist), the wrist to the middle of the fingers
        const SHL = new Vector3(0.25, 1.718, 0), SHR = new Vector3(-0.25, 1.718, 0);
        const cyl = (r0, r1, a, b, n = 6) => {   // a tube from a to b
          const d = new Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), L = d.length();
          const q = new CylinderGeometry(r1, r0, L, n);
          q.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), d.normalize()));
          q.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
          return q;
        };
        // the lyre (כנור): a sound-box below, two arms out and up, the yoke across them, seven strings - in its own plane (x, y) (fix-b2,
        // 22.11.2026: seven, "כנור של מקדש של שבעה נימין היה" - Arachin 13b; five until now)
        const G = {
          lyre: [mergeGeometries([new BoxGeometry(0.27, 0.085, 0.06).translate(0, 0.0425, 0), cyl(0.016, 0.013, [0.1, 0.06, 0], [0.155, 0.37, 0]),
            cyl(0.016, 0.013, [-0.1, 0.06, 0], [-0.155, 0.37, 0]), cyl(0.014, 0.014, [-0.18, 0.345, 0], [0.18, 0.345, 0])]),
            mergeGeometries([-3, -2, -1, 0, 1, 2, 3].map((k) => cyl(0.0025, 0.0025, [k * 0.03, 0.085, 0.012], [k * 0.036, 0.335, 0.012], 3)))],
          // the harp (נבל): its pillar, the neck over it, the sound-box along its foot, ten strings (fix-b2, 22.11.2026 - the user's
          // decision 66: "בנבל עשור" (Psalms 33:2), ten in every place; seven until now)
          harp: [mergeGeometries([new BoxGeometry(0.045, 0.56, 0.055).translate(0, 0.28, 0), new BoxGeometry(0.33, 0.045, 0.05).translate(0.165, 0.545, 0),
            new BoxGeometry(0.36, 0.09, 0.08).translate(0.18, 0.045, 0)]),
            mergeGeometries([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => cyl(0.0022, 0.0022, [k * 0.0305, 0.09, 0], [k * 0.0305, 0.52, 0], 3)))],
          cym: [new CylinderGeometry(0.13, 0.13, 0.016, 16).rotateZ(Math.PI / 2)],   // a cymbal: its face across x (the two meet)
          // a trumpet (חצוצרה): from the mouthpiece (the origin) forward along +z, the bell at its end
          tru: [mergeGeometries([cyl(0.017, 0.021, [0, 0, 0], [0, 0, 0.86], 8), new ConeGeometry(0.095, 0.2, 14, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 0.96)])],
          flute: [cyl(0.019, 0.026, [0, 0, 0], [0, 0, 0.68], 8)]   // the flute (חליל): from the mouth forward
        };
        G.koh = G.tru;
        const strM = new MeshStandardMaterial({ color: 0xe9dfc6, roughness: 0.55 });
        const bronzeM = new MeshStandardMaterial({ color: 0xc8963e, metalness: 0.75, roughness: 0.32 });   // (M2.bronze is dark in the night)
        const MAT = { lyre: [wood, strM], harp: [wood, strM], cym: [bronzeM], tru: [silver], koh: [silver], flute: [wood] };
        const ss01 = (x) => { const u = Math.max(0, Math.min(1, x)); return u * u * (3 - 2 * u); };
        const lerp = (a, b, u) => a + (b - a) * u;
        const V = new Vector3(), Q = new Quaternion(), E3 = new Euler(), ONE = new Vector3(1, 1, 1);
        const P1 = new Vector3(), P2 = new Vector3(), T1 = new Vector3(), T2 = new Vector3();
        const place = (out, x, y, z, rx, ry, rz) => out.compose(V.set(x, y, z), Q.setFromEuler(E3.set(rx, ry, rz, "YXZ")), ONE);
        const pt = (m, x, y, z, out) => out.set(x, y, z).applyMatrix4(m);
        const wristTo = (S, P, out) => { T1.subVectors(P, S); const d = T1.length() || 1e-6; out.copy(P).addScaledVector(T1, -HL / d); };   // the fingers at P
        // the elbow of the arm from the shoulder S to the wrist W (W is pulled in when it is beyond the arm's length): down, out and back
        const elbow = (S, W, side, out) => {
          T1.subVectors(W, S);
          let d = T1.length();
          T1.multiplyScalar(1 / (d || 1e-6));
          if (d > UA + FA - 1e-3) { d = UA + FA - 1e-3; W.copy(S).addScaledVector(T1, d); }
          const ca = Math.max(-1, Math.min(1, (UA * UA + d * d - FA * FA) / (2 * UA * Math.max(d, 1e-4)))), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
          T2.set(side * 0.55, -1, -0.3);
          T2.addScaledVector(T1, -T2.dot(T1)).normalize();
          out.copy(S).addScaledVector(T1, UA * ca).addScaledVector(T2, UA * sa);
        };
        // every instrument at a moment: e8 - the music's eighth (fractional), v - 0 at rest .. 1 playing; sets f.IM (and f.IM2), f.WL, f.WR
        const HANDS = {
          lyre(f, e8, v) {   // before the chest, a little to the left, its top out and to the left; the left hand on its left arm, the right across the strings
            place(f.IM, 0.07, 1.2, 0.3, 0.28, 0.12, -0.22);
            pt(f.IM, 0.155, 0.2, -0.02, P1);
            const sw = v * 0.075 * Math.sin(Math.PI * e8 + f.ph);   // a stroke every eighth
            pt(f.IM, sw - 0.02 * (1 - v), 0.19, 0.045 + 0.035 * (1 - v), P2);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          },
          harp(f, e8, v) {   // at the hip before him, its pillar to his right; both hands on the strings, by turns
            place(f.IM, -0.17, 0.98, 0.3, 0.12, 0.25, 0.05);
            const a = v * Math.sin(Math.PI * e8 * 0.5 + f.ph), b = v * Math.sin(Math.PI * e8 * 0.5 + f.ph + Math.PI);
            pt(f.IM, 0.23 + 0.03 * a, 0.3 + 0.05 * a, 0.04 + 0.03 * (1 - v), P1);
            pt(f.IM, 0.09 + 0.03 * b, 0.36 + 0.05 * b, 0.04 + 0.03 * (1 - v), P2);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          },
          cym(f, e8, v) {   // a cymbal in each hand; they meet at the head of every phrase (the loop's clash, 92-sounds)
            const u = ((e8 / 16) % 1 + 1) % 1;
            let gap = 0.15;
            if (u > 0.86) gap = 0.035 + 0.115 * (1 - ss01((u - 0.86) / 0.14));
            else if (u < 0.22) gap = 0.035 + 0.115 * ss01((u - 0.04) / 0.18);
            gap = 0.15 + (gap - 0.15) * v;
            const y = 1.3 + 0.14 * v, z = 0.28 + 0.04 * v;
            place(f.IM, gap, y, z, 0, 0, 0);
            place(f.IM2, -gap, y, z, 0, 0, 0);
            P1.set(gap + 0.03, y - 0.01, z - 0.01); P2.set(-gap - 0.03, y - 0.01, z - 0.01);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          },
          tru(f, e8, v) {   // across the chest at rest; at the call (the loop's trumpets: the head of the first and the third phrase) to the mouth
            const u = ((e8 % 32) + 32) % 32;
            let up = 0;
            if (u >= 29.5) up = ss01((u - 29.5) / 2.5); else if (u < 4.2) up = 1; else if (u < 6) up = 1 - ss01((u - 4.2) / 1.8);
            HANDS.koh(f, up * v);
          },
          koh(f, up) {   // the trumpet in both hands: the right by the mouthpiece, the left further; up 0 - before him, a little down; 1 - at the mouth, its bell a little up
            place(f.IM, lerp(-0.08, 0, up), lerp(1.36, 1.985, up), lerp(0.24, 0.135, up), lerp(0.38, -0.14, up), lerp(0.32, 0, up), 0);
            pt(f.IM, 0, -0.03, 0.2, P2); pt(f.IM, 0, -0.03, 0.34, P1);
            wristTo(SHR, P2, f.WR); wristTo(SHL, P1, f.WL);
          },
          flute(f, e8, v) {   // at the mouth, down and forward; the left hand above, the right below it, the fingers at work
            const b = v * 0.012 * Math.sin(Math.PI * e8 * 0.5 + f.ph);
            place(f.IM, lerp(0.02, 0, v), lerp(1.4, 1.98, v), lerp(0.22, 0.13, v), lerp(1.15, 0.55, v), lerp(-0.2, 0, v), 0);
            pt(f.IM, 0, -0.025 + b, 0.2, P1); pt(f.IM, 0, -0.025 - b, 0.42, P2);
            wristTo(SHL, P1, f.WL); wristTo(SHR, P2, f.WR);
          }
        };
        const qB = new Quaternion(), eB = new Euler(), vB = new Vector3(), vS = new Vector3(), mW = new Matrix4();
        // a set: figs [{ x, y, z, yaw, kind, cw (the crowd's handle), ci (its index there), skin }] in `parent`, their sleeves `robe`
        const set = (parent, figs, robe) => {
          const PP = tm_people(ctx2);
          const rig = PP.rig(parent, figs.length, { robe, skin: (i) => figs[i].skin });
          const count = {}, inst = {}, all = [];
          figs.forEach((f, i) => {
            f.ri = i; f.ii = count[f.kind] = (count[f.kind] || 0);
            count[f.kind]++;
            f.IM = new Matrix4(); f.IM2 = new Matrix4(); f.M = new Matrix4();
            f.WL = new Vector3(); f.WR = new Vector3(); f.EL = new Vector3(); f.ER = new Vector3();
            f.ph = ((i * 0.618) % 1) * 0.9; f.up = 0;
          });
          for (const k in count) {
            const n = count[k] * (k === "cym" ? 2 : 1);
            inst[k] = G[k].map((geo, j) => {
              const im = new InstancedMesh(geo, MAT[k][j], n);
              im.castShadow = false; im.receiveShadow = true; im.frustumCulled = false; im.userData.noPick = true; im.name = "simchaInstr";
              parent.add(im); all.push(im);
              return im;
            });
          }
          const crowds = [...new Set(figs.map((f) => f.cw).filter(Boolean))];
          return {
            g: parent, figs,
            // e8 - the music's eighth; v - how much they play (0 .. 1); the body's sway and the hands at their work. Every frame, near
            // or far (a few tens of thousands of triangles in all): a pause, or a flight to them in it, finds them set
            play(e8, v) {
              for (const f of figs) {
                const sw = v * Math.sin(Math.PI * 2 * e8 / 16 + f.ph * 7), nd = v * Math.sin(Math.PI * 2 * e8 / 8 + f.ph * 9);
                qB.setFromEuler(eB.set(0.03 * nd, f.yaw + 0.05 * sw, 0.025 * sw, "YXZ"));
                f.M.compose(vB.set(f.x, f.y, f.z), qB, vS.set(1.4, 1.4, 1.4));
                if (f.cw) f.cw.pose(f.ci, f.M);
                if (f.kind === "koh") HANDS.koh(f, f.up); else HANDS[f.kind](f, e8, v);
                elbow(SHL, f.WL, 1, f.EL);
                elbow(SHR, f.WR, -1, f.ER);
                rig.arm(f.ri, 1, f.M, SHL, f.EL, f.WL);
                rig.arm(f.ri, -1, f.M, SHR, f.ER, f.WR);
                const two = f.kind === "cym";
                mW.multiplyMatrices(f.M, f.IM);
                for (const im of inst[f.kind]) im.setMatrixAt(two ? 2 * f.ii : f.ii, mW);
                if (two) { mW.multiplyMatrices(f.M, f.IM2); for (const im of inst[f.kind]) im.setMatrixAt(2 * f.ii + 1, mW); }
              }
              for (const c of crowds) c.done();
              rig.done();
              for (const im of all) im.instanceMatrix.needsUpdate = true;
            }
          };
        };
        return { set };
      })();
      let B = null;
      const build = () => {
        if (B) return B;
        const PP = tm_people(ctx2);
        B = { dancers: [], jug: [], lev: {}, koh: [], rsbg: null };
        // ---- the people: men and boys of every age, the whole court full ("לפני כל העם שעמדו סביב אצל החומות", the Tiferet Yisrael; the
        //      user, 20:44: "צריך להיות ממש צפוף בכל העזרה הזאת"), their faces to the middle, the children rather in front; free: the
        //      dancers' ring, the lamps and their ladders, the steps and the Levites, the two flutes, the priests' way to the east gate,
        //      the lesser Sanhedrin's chamber and the four chambers. In cells of 13 amot, three crowds each (men; youths; children),
        //      their plainer levels sooner than the kit's (lodK 2.2: PEOPLE_LOD_304)
        const crowdG = new Group(); crowdG.name = "simchaCrowd"; DG.add(crowdG);
        const fillCrowd = () => {   // SIMCHA_LAMPS_B2: the people's layout, again when the lamps have moved
        for (let i = crowdG.children.length - 1; i >= 0; i--) crowdG.remove(crowdG.children[i]);
        const SPOTS = lampSpots(), COLS = SH.eznRoof && SH.eznRoof.on && Array.isArray(SH.eznRoof.cols) ? SH.eznRoof.cols : [];
        B.crowdKey = lampKey();
        const free = (x, z) => {
          if (x < 97.5 || x > 224.6 || z < -63.6 || z > 63.6) return false;   // the walls
          if ((x < 134.8 || x > 187.2) && Math.abs(z) > 26.3) return false;   // the four chambers in the corners (the default)
          if (x > 115.8 && x < 137.6 && z > -28.6 && z < -13.2) return false;   // the lesser Sanhedrin "על פתח העזרה" (30-courts.js)
          if (Math.hypot(x - 96, z) < 24.6) return false;                      // the steps and the Levites on them
          for (const [mx, mz] of SPOTS) if (Math.hypot(x - mx, z - mz) < 8.4) return false;   // the lamps, their ladders, the young priests
          for (const [cx, cz] of COLS) if (Math.hypot(x - cx, z - cz) < 1.9) return false;   // the roof's columns (the roofing "in the name of Rav Chaim Kanievsky")
          if (Math.hypot(x - CXc, z) < 14.6) return false;                     // the dancers
          if (Math.abs(z) < 3.4 && x > 112) return false;                      // the way of the two priests to the east gate
          for (const [fx, fz] of [[121.6, -6], [121.6, 6]]) if (Math.hypot(x - fx, z - fz) < 2.6) return false;   // the two flutes (MUSICIANS_305: 2.6, 1.6 until 2.0.13 - one stood before each)
          return true;
        };
        let q = 19112026;
        const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const cells = new Map(), SP = 1.3, CELL = 13;
        for (let x = 97.9; x < 224.4; x += SP) for (let z = -63.2; z < 63.4; z += SP) {
          const px = x + (rr() - 0.5) * 0.55, pz = z + (rr() - 0.5) * 0.55;
          if (!free(px, pz)) continue;
          const rc = Math.hypot(px - CXc, pz);
          const front = (rc < 18.5) || (Math.abs(pz) < 5.6 && px > 112) || SPOTS.some(([mx, mz]) => Math.hypot(px - mx, pz - mz) < 11);
          const a = rr(), kind = front && a < 0.45 ? 2 : a < 0.14 ? 10 : a < 0.36 ? 11 : a < 0.62 ? 12 : a < 0.78 ? 1 : 2;
          const yaw = Math.atan2(CXc - px, -pz) + (rr() - 0.5) * 0.55;
          const key = Math.floor(px / CELL) + "," + Math.floor(pz / CELL);
          if (!cells.has(key)) cells.set(key, [[], [], []]);
          const c = cells.get(key);
          if (kind >= 10) c[0].push([px, pz, yaw, kind - 10]); else c[kind].push([px, pz, yaw]);
        }
        const ROB = [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50, 0x55483c], ROBK = [0x5a6070, 0x6b5a3e, 0x7a6a50, 0x4a4f5a];
        let ci = 0, nPeople = 0;
        const LK = 2.6;   // and minLv 1: the people are plain figures from near too (the dancers, the Levites and the priests are full)
        for (const [, c] of cells) {
          const [men, youth, kids] = c;
          if (men.length) PP.crowd(crowdG, men.map((p) => [p[0], p[1], p[2]]), { y: Y0, s: 1.4, pose: "stand", kind: "worker", robe: ROB[ci % ROB.length], tone: (i) => men[i][3], name: "simchaPeople", lodK: LK, minLv: 1 });
          if (youth.length) PP.crowd(crowdG, youth, { y: Y0, s: 1.3, pose: "stand", kind: "student", robe: ROB[(ci + 3) % ROB.length], name: "simchaPeople", lodK: LK, minLv: 1 });
          if (kids.length) PP.crowd(crowdG, kids, { y: Y0, s: ci % 2 ? 1.0 : 0.88, pose: "stand", kind: "student", robe: ROBK[ci % ROBK.length], name: "simchaPeople", lodK: LK, minLv: 1 });
          nPeople += men.length + youth.length + kids.length;
          ci++;
        }
        B.nPeople = nPeople;
        };
        B.fillCrowd = fillCrowd;
        fillCrowd();
        // ---- the dancers: "חסידים ואנשי מעשה" - elders, grey and white; each a figure of his own, with a torch (two of them throw four)
        for (let i = 0; i < NDANCE; i++) {
          const G = new Group(); DG.add(G);
          PP.crowd(G, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind: "worker", robe: [0x2e3038, 0x3a3226, 0x2c3444][i % 3], tone: () => (i % 3 === 0 ? 0 : 1), exact: true, name: "simchaDancer" });
          const d = { G, ph: (i / NDANCE) * Math.PI * 2, hop: i * 0.37, tor: [] };
          if (i === 3 || i === 10) {   // "בארבע אבוקות... זורק זו ומקבל את זו" (the Bartenura)
            for (let k = 0; k < 4; k++) { const t = torch(k === 0, 1.9); G.add(t); d.tor.push(t); }
            B.jug.push(d);
          } else {
            const t = torch(true); t.position.set(-0.48, 1.9, 0.3); t.rotation.z = 0.12; G.add(t); d.tor.push(t);
          }
          B.dancers.push(d);
        }
        // ---- Rabban Shimon ben Gamliel: in the middle; eight torches; the kidah (a group that tilts about his feet)
        {
          const G = new Group(), Tl = new Group(); DG.add(G); G.add(Tl);
          PP.crowd(Tl, [[0, 0, 0]], { y: 0, s: 1.45, pose: "stand", kind: "worker", robe: 0x24324e, tone: () => 1, exact: true, name: "simchaRSBG" });
          const tor = [];
          for (let k = 0; k < 8; k++) { const t = torch(k % 2 === 0, 1.9); G.add(t); tor.push(t); }
          B.rsbg = { G, Tl, tor };
        }
        // ---- the two priests with the trumpets (white garments, the hat and the sash) - MUSICIANS_305: "ושתי חצוצרות בידיהן" (5:4):
        // the trumpet in both hands, to the mouth while they blow (MUS above; each priest a set of one, in his own group)
        for (const s of [-1, 1]) {
          const G = new Group(); G.visible = false; DG.add(G);
          const near = PP.crowd(G, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => (s < 0 ? 1 : 2), exact: true, arms: false, name: "simchaKohen" });
          const cw = near && near.userData ? near.userData.crowd : null;
          const set = MUS.set(G, [{ x: 0, y: 0, z: 0, yaw: 0, kind: "koh", cw, ci: 0, skin: s < 0 ? 0 : 1 }], 0xf1ede2);
          B.koh.push({ G, s, set, up: 0 });
        }
        // ---- the musicians: the Levites on the steps, and the flute below them (MUSICIANS_305: each with his instrument in his hands)
        const levites = (rid) => {
          const g = new Group(); g.visible = false; DG.add(g);
          const pts = [];
          // on all fifteen: "עמדו שם בט״ו שורות על הט״ו מעלות, ובכל שורה שררו שיר המעלות אחר" (the Tiferet Yisrael, Middot 2:5,
          // 819:253) - a row on every step, its figures between those of the row below (a half step along it)
          if (!rid) {
            for (let k = 1; k <= 15; k++) {
              const r = 22 - (k - 1) * 0.5 - 0.25, y = Y0 + 0.5 * k, off = k % 2 ? 0 : 0.5;
              for (let i = 0; i < 6; i++) {
                const th = -1.02 + ((i + off) / 5.5) * 2.04, z = r * Math.sin(th);
                if (Math.abs(z) < 2.6 || (k <= 5 && Math.abs(z) > 19)) continue;
                pts.push([96 + r * Math.cos(th), y, z, Math.atan2(Math.cos(th), Math.sin(th))]);
              }
            }
          } else {
            const RRr = (19.5 * 19.5 + 7.5 * 7.5) / 15;
            for (let k = 1; k <= 15; k++) {
              const d = 0.5 * (15 - k), half = Math.sqrt(Math.max(0, RRr * RRr - (RRr - 7.5 + d) * (RRr - 7.5 + d))) - 1, x = 96 + 0.5 * (15.5 - k), y = Y0 + 0.5 * k, off = k % 2 ? 0 : 0.5;
              for (let i = 0; i < 6; i++) { const z = -half + ((i + off) / 5.5) * 2 * half; if (Math.abs(z) >= 2.6) pts.push([x, y, z, Math.PI / 2]); }
            }
          }
          // "בכנורות ובנבלים ובמצלתים ובחצוצרות" (5:4): lyres for most, harps, cymbals and trumpets (their numbers - model choices)
          const kinds = pts.map((p, i) => (i % 9 === 4 ? "cym" : i % 7 === 3 ? "tru" : i % 4 === 1 ? "harp" : "lyre"));
          // each row's figures stand on their own step: one crowd per height
          const byY = new Map();
          pts.forEach((p, i) => { if (!byY.has(p[1])) byY.set(p[1], []); byY.get(p[1]).push(i); });
          const figs = [];
          for (const [y, idx] of byY) {
            const near = PP.crowd(g, idx.map((i) => [pts[i][0], pts[i][2], pts[i][3]]), { y, s: 1.4, pose: "stand", kind: "levi", robe: 0x8f8468, tone: (j) => 1 + (j % 2), exact: true, arms: false, name: "simchaLevi" });
            const cw = near && near.userData ? near.userData.crowd : null;
            idx.forEach((i, j) => figs.push({ x: pts[i][0], y, z: pts[i][2], yaw: pts[i][3], kind: kinds[i], cw, ci: j, skin: j }));
          }
          return MUS.set(g, figs, 0x8f8468);
        };
        B.levFor = (rid) => B.lev[rid ? "rid" : "rambam"] || (B.lev[rid ? "rid" : "rambam"] = levites(rid));
        // the flute: two players at the steps' foot, on the court's floor ("החליל מכה", the Rambam, Lulav 8:13)
        {
          const g = new Group(); DG.add(g);
          const pts = [[121.6, -6, Math.PI / 2 - 0.25], [121.6, 6, Math.PI / 2 + 0.25]];   // their faces to the court
          const near = PP.crowd(g, pts, { y: Y0, s: 1.4, pose: "stand", kind: "levi", robe: 0x8f8468, tone: (i) => 1 + i, exact: true, arms: false, name: "simchaFlute" });
          const cw = near && near.userData ? near.userData.crowd : null;
          B.flute = MUS.set(g, pts.map((p, j) => ({ x: p[0], y: Y0, z: p[1], yaw: p[2], kind: "flute", cw, ci: j, skin: j })), 0x8f8468);
        }
        return B;
      };
      // ---- the clock (the written seconds; the screen's are SH.demoSlow times longer) ----
      // CAPTIONS_305: the clock in phases - the lamps (L0), the dance (DZ), the Levites (LVS - not LV, the name of the levels in this function), Rabban Shimon (RS), the cock's crow (TD)
      const L0 = 13.7, DZ = L0 + 23.5, LVS = DZ + 41, RS = LVS + 8, TD = RS + 10;   // (until 2.0.13: 6, 29.5, 48, 56, 66)
      const CAPS = [[0, "״אמרו: כל מי שלא ראה שמחת בית השואבה, לא ראה שמחה מימיו״ (סוכה ה, א)"],
        [3, "״במוצאי יום טוב הראשון של חג, ירדו לעזרת נשים, ומתקנין שם תקון גדול״ (סוכה ה, ב)"],
        [5.8, "״מאי תיקון גדול?... חלקה היתה בראשונה, והקיפוה גזוזטרא, והתקינו שיהו נשים יושבות מלמעלה ואנשים מלמטה״ (סוכה נא:) — ״קרשים עם מעקה סביב על הזיזין שיוצאין מהחומות״ (תפארת ישראל)"],
        [9.2, "״תנו רבנן: בראשונה היו נשים מבפנים ואנשים מבחוץ, והיו באים לידי קלות ראש. התקינו שיהו נשים יושבות מבחוץ ואנשים מבפנים, ועדיין היו באין לידי קלות ראש. התקינו שיהו נשים יושבות מלמעלה ואנשים מלמטה״ (סוכה נא:)"],
        [L0, "״ומנורות של זהב היו שם, וארבעה ספלים של זהב בראשיהן, וארבעה סלמות לכל אחד ואחד, וארבעה ילדים מפרחי כהנה ובידיהם כדים של שמן״ (סוכה ה, ב)"],
        [L0 + 4.2, "״תנא: והן משובחין היו יותר מבנה של מרתא בת בייתוס״... ״מאי משובחים?... התם כבש, ומרובע, ולא זקיף. הכא סולמות, וזקיף טובא״ (סוכה נב:)"],
        [L0 + 8.5, "״מבלאי מכנסי כהנים ומהמיניהן מהן היו מפקיעין, ובהן היו מדליקין״ (סוכה ה, ג)"],
        [L0 + 15.8, "״ולא היתה חצר בירושלים שאינה מאירה מאור בית השואבה״ (סוכה ה, ג)"],
        [L0 + 19.6, "״אשה היתה בוררת חטים לאור של בית השואבה״ (סוכה נג.)"],
        [DZ, "״חסידים ואנשי מעשה היו מרקדים לפניהם באבוקות של אור שבידיהן, ואומרים לפניהן דברי שירות ותשבחות״ (סוכה ה, ד)"],
        [DZ + 4.5, "״יש מהן אומרים: אשרי ילדותנו שלא ביישה את זקנותנו — אלו חסידים ואנשי מעשה״ (סוכה נג.)"],
        [DZ + 9, "״ויש מהן אומרים: אשרי זקנותנו שכפרה את ילדותנו — אלו בעלי תשובה״ (סוכה נג.)"],
        [DZ + 13.5, "״אלו ואלו אומרים: אשרי מי שלא חטא, ומי שחטא — ישוב וימחול לו״ (סוכה נג.)"],
        [DZ + 18, "״אמרו עליו על הלל הזקן, כשהיה שמח בשמחת בית השואבה, אמר כן: אם אני כאן — הכל כאן, ואם איני כאן — מי כאן״ (סוכה נג.)"],
        [DZ + 22.5, "״הוא היה אומר כן: מקום שאני אוהב — שם רגלי מוליכות אותי. אם תבא אל ביתי — אני אבא אל ביתך, אם אתה לא תבא אל ביתי — אני לא אבא אל ביתך, שנאמר: ׳בכל המקום אשר אזכיר את שמי אבא אליך וברכתיך׳״ (סוכה נג.)"],
        [DZ + 27.5, "״אמר רבי יהושע בן חנניה: כשהיינו שמחים שמחת בית השואבה, לא ראינו שינה בעינינו״ (סוכה נג.)"],
        [DZ + 31.5, "״כיצד? שעה ראשונה תמיד של שחר, משם לתפלה, משם לקרבן מוסף, משם לתפלת המוספין, משם לבית המדרש, משם לאכילה ושתיה, משם לתפלת המנחה, משם לתמיד של בין הערבים, מכאן ואילך לשמחת בית השואבה״ (סוכה נג.)"],
        [DZ + 37, "״אלא הכי קאמר: לא טעמנו טעם שינה, דהוו מנמנמי אכתפא דהדדי״ (סוכה נג.)"],
        [LVS, "״והלוים בכנורות ובנבלים ובמצלתים ובחצוצרות ובכלי שיר בלא מספר, על חמש עשרה מעלות היורדות מעזרת ישראל לעזרת נשים״ (סוכה ה, ד)"],
        [LVS + 4, "״שיר המעלות, הנה ברכו את ה׳ כל עבדי ה׳, העומדים בבית ה׳ בלילות״ (תהלים קלד, א) — ״ולוים בכנורות ובנבלים וכל כלי שיר מהן אומרים שיר המעלות הנה ברכו״ (תוספתא סוכה ד, ה)"],
        [RS, "״אמרו עליו על רבן שמעון בן גמליאל, כשהיה שמח שמחת בית השואבה, היה נוטל שמנה אבוקות של אור, וזורק אחת ונוטל אחת ואין נוגעות זו בזו״ (סוכה נג.)"],
        [RS + 5.5, "״וכשהוא משתחוה, נועץ שני גודליו בארץ ושוחה ונושק את הרצפה וזוקף, ואין כל בריה יכולה לעשות כן, וזו היא קידה״ (סוכה נג.) — ופניו אל ההיכל"],
        [TD, "״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן. קרא הגבר — תקעו והריעו ותקעו״ (סוכה ה, ד)"],
        [TD + 8.6, "״הגיעו למעלה עשירית — תקעו והריעו ותקעו״ — בהדגמה: ירדו חמש, ועומדים על העשירית (״תיקו״, סוכה נג:)"],
        [TD + 14.9, "״הגיעו לעזרה — תקעו והריעו ותקעו״ — ״לרצפת עזרת נשים״ (תפארת ישראל)"],
        [TD + 20, () => "״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״ (סוכה ה, ד) — " + (SH.simchaWalk && SH.simchaWalk.mode === "tyt"
          ? "לתפארת ישראל: ״היינו רק תקיעה בלי תרועה״" : "לרש״י: ״באלו שלש אחרונות מאריכין עד שמגיעין לשער״ — התקיעה, התרועה והתקיעה נמשכות בהליכה")],
        [TD + 34.5, "״הגיעו לשער היוצא ממזרח, הפכו פניהן למערב, ואמרו: אבותינו שהיו במקום הזה אחוריהם אל היכל ה׳ ופניהם קדמה, והמה משתחוים קדמה לשמש — ואנו ליה עינינו״ (סוכה ה, ד)"],
        [TD + 42, "״רבי יהודה אומר: היו שונין ואומרין: אנו ליה, וליה עינינו״ (סוכה ה, ד)"],
        [TD + 46.5, "״אלא הכי אמרי: המה משתחוים קדמה, ואנו ליה — אנחנו מודים, ועינינו ליה מיחלות״ (סוכה נג:)"]];
      const TEND = TD + 51;
      // the eye: flights fired by the clock (the viewer may look round between them)
      const FLY = [[0, [252, 88, 96], [161, 14, 0]], [3.4, [173, 26, -24], [158, 22, -64]], [L0 + 0.2, [176, 32, 44], [141, 30, -20]],
        [L0 + 8.5, [152, 58, -7], [141, 51, -20]], [L0 + 15.8, [215, 60, 80], [161, 30, 0]], [DZ, [178, 13.5, 11], [161, 8.5, 0]], [DZ + 8.5, [146, 12.5, -9], [161, 8.5, 0]],
        [DZ + 27.5, [172, 20, -26], [161, 8, 0]], [LVS, [129, 16, 13], [104, 11, 0]], [RS, [177, 12, 12], [161, 9.4, 0]], [RS + 5.4, [146, 11.5, 9], [161, 8.6, 0]],
        [TD, [126, 19, 15], [97, 14, 0]], [TD + 19.5, [172, 17, 24], [128, 9, 0]],
        [TD + 27, [204, 16, 23], [182, 9, 0]], [TD + 33, [196, 12.5, 9], [223, 9.5, 0]], [TD + 42.5, [252, 70, 92], [161, 12, 0]]];
      // the two priests' way (the screen's x; their feet on the steps by stepY): the upper gate, the tenth step, the court, the east gate
      const kohWay = (rid) => {
        const x10 = rid ? 96 + 0.5 * (15.5 - 10) : 96 + (22 - 9 * 0.5 - 0.25), xF = rid ? 104.2 : 118.8, xTop = rid ? 95.6 : 110.7;
        return [[TD, 94.6], [TD + 6, 94.6], [TD + 7.4, xTop], [TD + 8.4, x10], [TD + 13.6, x10], [TD + 14.6, xF], [TD + 19.9, xF], [TD + 34, 222.2]];
      };
      const BLASTS = [TD + 1, TD + 8.7, TD + 15];   // tekia - terua - tekia, each ~4.8 s (SOUNDS_300 "trumpets")
      const LONGS = [TD + 20.2, TD + 24.8, TD + 29.4];   // "היו תוקעין והולכין" - long blasts as they go (the Tiferet Yisrael's)
      // TERUAH_305 (the user, 21:10: "ונראה לי יש תרועה שם גם, תבדוק"; 21:24: "2. ג" - a switch, ״שיטות ומחלוקות״ sh60): "היו תוקעין
      // והולכין" (5:4). Rashi (on the mishnah): "באלו שלש אחרונות מאריכין עד שמגיעין לשער היוצא מעזרת נשים להר הבית", and so the
      // Bartenura (5:5: "ומאריכין בהן עד שהגיעו לשער התחתון"), the Tosafot Yom Tov and the Pnei Moshe - the court's tekia, teruah and
      // tekia drawn out along the way, to the east gate (the default; their length - model choice); the Tiferet Yisrael (Yachin 5:5,
      // 772:581): "ואע״ג דגם לאחר מעלה עשירית קאמר תוקעין והולכין, היינו רק תקיעה בלי תרועה" - after the court's three, long blasts
      // without a teruah as they go (until 2.0.13 the only way)
      const WALK = SH.simchaWalk || (SH.simchaWalk = { mode: "rashi", set(m) { this.mode = m === "tyt" ? "tyt" : "rashi"; return this.mode; } });
      const DRAWN = [TD + 15, TD + 34];   // Rashi's: from the court's floor to the east gate
      const blowing = (t) => (WALK.mode === "tyt"
        ? BLASTS.some((s) => t >= s - 0.3 && t < s + 5) || LONGS.some((s) => t >= s - 0.2 && t < s + 3)
        : BLASTS.slice(0, 2).some((s) => t >= s - 0.3 && t < s + 5) || (t >= DRAWN[0] - 0.3 && t < DRAWN[1]));
      // ---- the run ----
      const D = { run: false, t0: 0, pausedAt: null, fl: 0, saved: null, snd: -1, way: null, rid: false, music: null };
      const tNow = () => ((D.pausedAt != null ? D.pausedAt : performance.now()) - D.t0) / 1000 / SLOW();
      let cap = null;
      const capEl = () => {
        if (cap) return cap;
        cap = document.createElement("div");
        cap.id = "tm-simcha-cap";
        cap.setAttribute("dir", "rtl");
        Object.assign(cap.style, { position: "fixed", left: "50%", bottom: "64px", transform: "translateX(-50%)", maxWidth: "min(820px, 78vw)",
          background: "rgba(14,17,28,0.84)", color: "#f4ead0", font: "17px/1.55 var(--font-main, inherit)", padding: "8px 18px",
          borderRadius: "10px", zIndex: "40", pointerEvents: "none", textAlign: "center", userSelect: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.35)", display: "none" });
        document.body.appendChild(cap);
        return cap;
      };
      const ss = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
      const at1 = (pts, t) => {   // piecewise linear [[t, v] ...]
        if (t <= pts[0][0]) return pts[0][1];
        for (let i = 0; i + 1 < pts.length; i++) if (t <= pts[i + 1][0]) { const a = pts[i], b = pts[i + 1], u = (t - a[0]) / Math.max(1e-6, b[0] - a[0]); return a[1] + (b[1] - a[1]) * u; }
        return pts[pts.length - 1][1];
      };
      const juggle = (tor, t, H, rate, side0) => {   // each torch up from its hand and down to the other, turning (a cascade)
        const n = tor.length;
        tor.forEach((tg, k) => {
          const u = (((t * rate + k / n) % 1) + 1) % 1, s = ((Math.floor(t * rate + k / n) + k) % 2 ? 1 : -1) * side0;
          tg.position.set(s * (0.42 - 0.84 * u), 2.0 + 4 * H * u * (1 - u), 0.42);
          tg.rotation.set(Math.PI * 2 * u * 1.5, 0, s * 0.3);
        });
      };
      const apply = (t) => {
        const b = B;
        if (!b) return;
        sync();
        // the lamps: their own demonstration, by this clock, without its flights and labels
        const L = SH.simchaDemo;
        if (L && fnc(L.drive)) L.drive(t < L0 ? -1 : Math.min(23.4, t - L0));
        // the dancers: standing in their ring until DZ, then round it; wider round Rabban Shimon; at the cock's crow off the way
        const go = ss(DZ, DZ + 2, t) * (1 - ss(TD - 0.2, TD + 1.6, t)), R = DR + 2.6 * ss(RS - 1, RS + 1.5, t);
        const tt = Math.min(t, TD), ang = tt < DZ ? 0 : tt < DZ + 2 ? 0.3 * (tt - DZ) * (tt - DZ) / 4 : 0.3 * (tt - DZ - 1);   // the speed rises 0 .. 0.3 in two seconds
        const aside = ss(TD - 0.2, TD + 2.2, t);
        b.dancers.forEach((d, i) => {
          const a = d.ph + ang;
          let x = CXc + R * Math.cos(a), z = R * Math.sin(a);
          if (aside > 0) { const zz = Math.sign(z || 1) * Math.max(5.2, Math.abs(z)); z = z + (zz - z) * aside; }
          const hop = 0.22 * go * Math.abs(Math.sin(Math.PI * (2.1 * t + d.hop)));
          d.G.position.set(x, Y0 + hop, z);
          // the face: to the middle while they stand (-a - PI/2), along the ring as they go round (-a), a little inward, swaying
          d.G.rotation.y = -a - (Math.PI / 2) * (1 - go) - 0.35 * go + 0.45 * go * Math.sin(1.7 * t + d.hop);
          if (b.jug.includes(d)) juggle(d.tor, t, 1.25, 0.95 * (0.35 + 0.65 * go), i % 2 ? 1 : -1);
        });
        // Rabban Shimon ben Gamliel: in the middle; his eight torches (56-61.5), then they are put down; the kidah (62-65.5)
        {
          const r = b.rsbg, jug = ss(RS - 0.4, RS + 0.4, t) * (1 - ss(RS + 5.2, RS + 5.8, t));
          r.G.position.set(CXc, Y0, -5.6 * ss(TD - 0.2, TD + 2.2, t));
          // KIDAH_WEST_305 (the user, 22:22: "בודאי כל ההשתחויות בבהמ"ק היו להיכל ולא חלילה ההיפך כמו שאמרו... אחוריהם אל ההיכל
          // ופניהם קדמה"): before the kidah he turns to the west, his face to the heichal, and after it back (until 2.0.13 - to the east)
          const wst = ss(RS + 5.4, RS + 6.2, t) * (1 - ss(RS + 9.9, RS + 10.6, t));
          r.G.rotation.y = (Math.PI / 2 + 0.9 * Math.sin(0.5 * t) * (t > RS && t < RS + 5.5 ? 1 : 0.25)) * (1 - wst) - (Math.PI / 2) * wst;
          for (const tg of r.tor) tg.visible = jug > 0.02;
          if (jug > 0.02) { juggle(r.tor, t, 2.4, 0.9, 1); for (const tg of r.tor) tg.scale.setScalar(jug); }
          const kd = ss(RS + 6.3, RS + 7.6, t) * (1 - ss(RS + 8.5, RS + 9.8, t));
          r.Tl.rotation.x = 1.38 * kd;
        }
        // the Levites of the steps' reading; the two priests
        const rid = ridSteps();
        for (const [k, st] of Object.entries(b.lev)) st.g.visible = (k === "rid") === rid;
        if (!b.lev[rid ? "rid" : "rambam"]) b.levFor(rid).g.visible = true;
        // MUSICIANS_305: the music's eighth - the loop's own clock while it sounds (D.music.beat, 92-sounds), else the screen's -
        // and how much they play: from the dance to the cock's crow, as the music (below)
        const bt = D.music && fnc(D.music.beat) ? D.music.beat() : null, e8 = bt != null ? bt : performance.now() / 200;
        const vM = ss(DZ, DZ + 1.7, t) * (1 - ss(TD - 1.2, TD + 0.2, t));
        b.lev[rid ? "rid" : "rambam"].play(e8, vM);
        if (b.flute) b.flute.play(e8, vM);
        if (!D.way || D.rid !== rid) { D.way = kohWay(rid); D.rid = rid; }
        const on = t >= TD - 0.05;
        const blow = blowing(t);
        const dt = Math.max(0, Math.min(0.2, t - (D.lt == null ? t : D.lt)));
        D.lt = t;
        for (const k of b.koh) {
          k.G.visible = on;
          if (!on) continue;
          const x = at1(D.way, t), z = k.s * 1.25;
          const walking = D.way.some((p, i) => i + 1 < D.way.length && t > p[0] && t < D.way[i + 1][0] && D.way[i + 1][1] !== p[1]);
          k.G.position.set(x, stepY(x, z, rid) + (walking ? 0.05 * Math.abs(Math.sin(t * 9)) : 0), z);
          k.G.rotation.y = Math.PI / 2 + Math.PI * ss(TD + 34, TD + 35.2, t);   // east, then the face to the west
          k.up += ((blow ? 1 : 0) - k.up) * Math.min(1, dt * 7);   // MUSICIANS_305: to the mouth in about a third of a second
          k.set.figs[0].up = k.up;
          k.set.play(0, 0);
        }
        // the night, and the first light from the cock's crow
        const NK = SH.nightKit;
        if (NK && D.saved && D.saved.night) {
          if (t < L0 + 13.3) NK.set("simchaNight", "simchaNight", 0);
          else if (t < TD + 8) NK.set("simchaNight", "simchaLit", ss(L0 + 13.3, L0 + 17, t));
          else NK.set("simchaLit", "simchaDawn", ss(TD + 8, TD + 42, t));
        }
        // the music: from the dance to the cock's crow
        if (D.music) D.music.set(D.pausedAt != null ? 0 : 0.9 * ss(DZ, DZ + 1.7, t) * (1 - ss(TD - 1.2, TD + 0.2, t)));
        // the caption
        let txt = "";
        for (const [ct, x] of CAPS) if (t >= ct) txt = typeof x === "function" ? x() : x;
        const c = capEl();
        if (c.textContent !== txt) c.textContent = txt;
        c.style.display = txt ? "block" : "none";
      };
      const stop = () => {
        if (!D.run) return;
        D.run = false;
        D.pausedAt = null;
        demoOn = false;
        DG.visible = false;
        sync();
        if (cap) cap.style.display = "none";
        if (D.music) { try { D.music.stop(); } catch (_) {} D.music = null; }
        if (fnc(SH.sfxCut)) { try { SH.sfxCut(); } catch (_) {} }
        const L = SH.simchaDemo;
        if (L && fnc(L.clear)) L.clear();
        const s = D.saved;
        D.saved = null;
        if (s) {
          if (!s.lamps && SH.features && SH.features.simchaMenorot) { try { SH.features.simchaMenorot.off(); } catch (_) {} }
          const lg = ctx2.scene && ctx2.scene.getObjectByName("labels");
          if (lg && s.labels != null) lg.visible = s.labels;
          if (s.night && SH.nightKit) SH.nightKit.end();
        }
      };
      const start = () => {
        stop();
        if (fnc(SH.stopDemos)) { try { SH.stopDemos("simcha-shoeva"); } catch (_) {} }
        build();
        if (B && B.crowdKey !== lampKey() && typeof B.fillCrowd === "function") B.fillCrowd();   // SIMCHA_LAMPS_B2
        const lg = ctx2.scene && ctx2.scene.getObjectByName("labels"), FM = SH.features && SH.features.simchaMenorot;
        D.saved = { labels: lg ? lg.visible : null, lamps: !!(FM && FM.isOn()), night: !!(SH.nightKit && SH.nightKit.begin()) };
        if (lg) lg.visible = false;
        if (D.saved.night) SH.nightKit.set("simchaNight", "simchaNight", 0);
        demoOn = true;
        DG.visible = true;
        sync();
        D.fl = 0;
        D.snd = -1;
        D.way = null;
        D.lt = null;
        D.music = fnc(SH.sfxLoop) ? SH.sfxLoop("simcha") : null;
        D.t0 = performance.now();
        D.run = true;
        apply(0);
      };
      (SH.demoStops || (SH.demoStops = [])).push({ id: "simcha-shoeva", running: () => D.run, stop,
        pause: () => { if (D.run && D.pausedAt == null) D.pausedAt = performance.now(); },
        resume: () => { if (D.pausedAt == null) return; D.t0 += performance.now() - D.pausedAt; D.pausedAt = null; },
        paused: () => D.pausedAt != null,
        restart: () => start() });
      SH.simchaShoeva = { start, stop, get on() { return D.run; },
        seek(t) { if (D.run) { D.t0 = (D.pausedAt != null ? D.pausedAt : performance.now()) - t * 1000 * SLOW(); D.fl = FLY.findIndex((f) => f[0] > t); if (D.fl < 0) D.fl = FLY.length; D.snd = t; } },   // (the tests' way to a moment)
        info: () => ({ people: B ? B.nPeople : 0, dancers: B ? B.dancers.length : 0 }) };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        sync();
        if (!D.run) return;
        const now = performance.now() / 1000;
        for (const f of FLS) { const k = 0.85 + 0.15 * Math.sin(now * 9 + f.userData.ph) + 0.06 * Math.sin(now * 23 + f.userData.ph * 2); f.scale.set(0.55 * k, 1.05 * (0.9 + 0.2 * k), 1); }
        if (D.pausedAt != null) { if (D.music) D.music.set(0); return; }
        const t = tNow();
        if (t >= TEND) { stop(); return; }
        apply(t);
        while (D.fl < FLY.length && t >= FLY[D.fl][0]) { const f = FLY[D.fl++]; try { if (fnc(ctx2.flyTo)) ctx2.flyTo(f[1], f[2], 1800); } catch (_) {} }
        // the trumpets and the cymbals, each once a run (SOUNDS_300)
        if (fnc(SH.sfx) && D.snd < t) {
          const tyt = WALK.mode === "tyt";   // TERUAH_305; the cymbals - in the loop now (MUSICIANS_305)
          for (const s of tyt ? BLASTS : BLASTS.slice(0, 2)) if (D.snd < s && t >= s) SH.sfx("trumpets");
          if (tyt) { for (const s of LONGS) if (D.snd < s && t >= s) SH.sfx("trumpets", { pattern: "long" }); }
          else if (D.snd < DRAWN[0] && t >= DRAWN[0]) SH.sfx("trumpets", { pattern: "drawn", dur: (DRAWN[1] - t) * SLOW() });
        }
        D.snd = t;
      });
      // ===== SIMCHA_FOLLOW_S2 (fix-s2, 23.11.2026 - the user's notes 8 and 8א: "לא רואים את התקיעות"; "חלק מהזמן המצלמה מאבדת את המעקב
      // איתם") - one block, the trumpets' part only. (1) THE EYE FOLLOWS THE TWO PRIESTS from the cock's crow until they have turned their
      // faces to the west and said their words, to the demonstration's end (until now four fixed flights - at the tenth step and on the floor they stood at the picture's edge or out of
      // it, and on the way east they walked past the eye): every frame the eye is set by their place - before them and a little to the
      // south while they stand at the upper gate, go down the steps and blow on the court's floor (their faces and the trumpets, the
      // steps and the gate behind them), round to their side as they walk east, and behind them for the last stretch to the gate (the
      // wall is there), and at the gate, as they turn and speak, a little back and up - eased, so that it never jumps; never under the steps' surface. While a flight runs (the start), or the
      // demonstration is paused (a press on the model), the eye is the viewer's. (2) SH.simchaShoeva.trumpets(): the demonstration from
      // just before the blowing on the women's court's floor to its end (the row "התקיעות בהליכה לשער המזרח", 70-ui.js) - a new run each
      // time (start() stops the one before). The eye's distances and the timing of its turns - model choices.
      {
        const FOL0 = TD - 0.05, FOL1 = TEND;   // to the end: the closing words are said by them at the gate (the wide closing view - from the wall's far side - hid them)
        for (let i = FLY.length - 1; i >= 0; i--) if (FLY[i][0] >= TD && FLY[i][0] < FOL1) FLY.splice(i, 1);   // the follow replaces them
        // [the clock, the eye's offset from the pair (x along the way east, up, z to the south)]
        const OFF = [[TD, [12, 8, 8]], [TD + 19.9, [12, 8, 8]], [TD + 25.5, [2, 8, 12]], [TD + 30.5, [-10, 8, 9]], [TD + 40, [-10, 8, 9]], [TD + 47, [-20, 13, 13]]];   // high enough to see them over the people
        const offAt = (t) => {
          if (t <= OFF[0][0]) return OFF[0][1];
          for (let i = 0; i + 1 < OFF.length; i++) if (t <= OFF[i + 1][0]) { const a = OFF[i], b = OFF[i + 1], u = ss(a[0], b[0], t); return a[1].map((v, q) => v + (b[1][q] - v) * u); }
          return OFF[OFF.length - 1][1];
        };
        const F = { e: null, l: null, lt: 0 };
        const pair = () => { const ks = B && B.koh; if (!ks || !ks.length) return null; let x = 0, y = 0; for (const k of ks) { x += k.G.position.x; y += k.G.position.y; } return [x / ks.length, y / ks.length, 0]; };
        const want = (t) => {
          const p = pair();
          if (!p) return null;
          const o = offAt(t), ex = p[0] + o[0], ez = p[2] + o[2];
          const ey = Math.max(p[1] + o[1], stepY(ex, ez, ridSteps()) + 2.2);
          return [[ex, ey, ez], [p[0] + o[0] * 0.12, p[1] + 1.8, p[2]]];
        };
        if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
          const now = performance.now(), dt = Math.min(0.25, Math.max(0, (now - (F.lt || now)) / 1000));
          F.lt = now;
          if (!D.run || D.pausedAt != null) { F.e = null; return; }
          const t = tNow();
          if (t < FOL0 || t > FOL1) { F.e = null; return; }
          if (fnc(ctx2.camFlying) && ctx2.camFlying()) { F.e = null; return; }
          const w = want(t), cam = ctx2.camera, c = ctx2.controls;
          if (!w || !cam) return;
          if (!F.e) { F.e = cam.position.toArray(); F.l = c && c.target ? c.target.toArray() : w[1]; }
          const k = 1 - Math.exp(-dt * 3.2);
          for (let q = 0; q < 3; q++) { F.e[q] += (w[0][q] - F.e[q]) * k; F.l[q] += (w[1][q] - F.l[q]) * k; }
          cam.position.set(F.e[0], F.e[1], F.e[2]);
          if (c && c.target) c.target.set(F.l[0], F.l[1], F.l[2]);
          cam.lookAt(F.l[0], F.l[1], F.l[2]);
        });
        SH.simchaShoeva.trumpets = () => {
          start();
          SH.simchaShoeva.seek(TD + 13.6);
          apply(TD + 13.6);
          const w = want(TD + 13.6);
          if (w && fnc(ctx2.flyTo)) { try { ctx2.flyTo(w[0], w[1], 1800); } catch (_) {} }
        };
        SH.simchaShoeva.TD = TD;   // (the tests: the cock's crow on the demonstration's clock)
      }
      // ===== end SIMCHA_FOLLOW_S2
      // the pill on the model, over the women's court
      const MB = Array.isArray(SH.modelButtons) ? SH.modelButtons : (SH.modelButtons = []);
      MB.push({
        id: "simcha-shoeva", label: "הדגמה: שמחת בית השואבה", labelOn: "עצור את ההדגמה", maxDist: 260,
        title: "״כל מי שלא ראה שמחת בית השואבה, לא ראה שמחה מימיו״ (סוכה ה, א) — הגזוזטראות על הזיזים, המנורות של זהב, החסידים ואנשי מעשה מרקדים באבוקות, הלוים על חמש עשרה המעלות, ובקריאת הגבר — שני הכהנים בחצוצרות.",
        anchor: () => { const p = ctx2.camera && ctx2.camera.position; return p && !D.run && p.x > 70 && p.x < 360 && Math.abs(p.z) < 190 && p.y < 280 ? [161, YB + 8, 0] : null; },
        get: () => D.run,
        set: (on) => { if (on) start(); else stop(); }
      });
    }
    // ---------- ARAVAH_B2 (fix-b2, 22.11.2026 - the user's decisions 56 and 80): THE WILLOW'S COMMANDMENT AND THE CIRCUIT OF THE ALTAR ----------
    // Mishnah Sukkah 4:5 (56:44): "מצות ערבה כיצד, מקום היה למטה מירושלים, ונקרא מוצא. יורדין לשם ומלקטין משם מרביות של ערבה, ובאין וזוקפין
    // אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח. תקעו והריעו ותקעו. בכל יום מקיפין את המזבח פעם אחת, ואומרים, אנא ה' הושיעה נא, אנא ה'
    // הצליחה נא... ואותו היום מקיפין את המזבח שבע פעמים"; Sukkah 45a (108:1165-1166): eleven amot long, "כדי שיהו גוחות על גבי המזבח אמה".
    // From Rav Chaim Kanievsky, as brought in Chalamish ("אלחנן וחיים שמחים בירושלים", the list of sources, on pp. 25, 30): "יש ערבות רבות
    // שממלאות את צדי המזבח, ולא מעטות"; "הערבות צריכות להיות מנחות ישירות על היסוד ולא בתוך כלי, וכנראה היו לערבות גזעים עבים"; "הערבות מנחות
    // רק במקום שיש יסוד, וזה נקרא להקיף את המזבח" - and perhaps not in the east and the south. So: many willows, thick at the foot, standing
    // on the yesod - all along the north and the west - eleven amot high, their heads bent an amah over the altar's top. THE CIRCUIT
    // (SH.aravah.circuit, the row "הקפת המזבח"): "priests" (the default) - priests alone go round (Rashi, Sukkah 43b, 2163:2025: "אבל ישראל לא
    // היה נכנס בין האולם ולמזבח"; the Tosafot, the Ritva, the Meiri, the Ran, the Gra; Kelim 1:8-9); "all" - Israelites too (the Or Zarua,
    // part 2, 315 - 3930:3793 - in the name of the Yerushalmi). The figures go round the altar and its ramp, a branch in each hand, while the
    // demonstration is shown (a place's feature, untimed). No tefillin - Chol HaMoed (SH.tefOff). MODEL CHOICES: the willows' number and form,
    // the way round (outside the ramp too), the walkers' number and pace. FOUR_K: what they hold - the four species in netilah (below).
    {
      const AG = grp("aravahDemo", false);
      const altDz = () => { const AP = SH.altarPlace; return AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5; };
      const F = LV.KOH, YT = F + 1;   // the yesod's top
      const AR = { circuit: "priests", built: false, walkers: { priests: [], all: [] }, t0: 0 };
      const trunkM = new MeshStandardMaterial({ color: 0x6d6a3e, roughness: 0.85 });
      const leafM = new MeshStandardMaterial({ color: 0x6f9a52, roughness: 0.8, side: DoubleSide });
      const leafIM = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, side: DoubleSide });
      const WG = {};   // the willows for each altar's measure (32, or R. Yose's 28), built when first shown
      const curW = () => (SH.altarMeasures && SH.altarMeasures.mode === "yose") ? 28 : 32;
      const willows = (W) => {
        if (WG[W]) return WG[W];
        const WGr = WG[W] = new Group(); WGr.name = "aravahWillows" + W; AG.add(WGr);
        const x0 = 71.5 - W, z1 = -19.5 + W;   // the altar's frame (40-altar.js): its north-east corner fixed at (71.5, -19.5)
        const trunks = [], leaves = [];
        let q = 22112026;
        const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        // a willow: [foot x, z], the inward direction [ix, iz]
        // a willow ("מרביות של ערבה" - long branches, the Bartenura's "נטיעות"): a thick foot on the yesod, a long stem bending at its head over
        // the altar's top (Sukkah 45a: "כדי שיהו גוחות על המזבח אמה"), a few side shoots, and narrow hanging leaves on the upper two thirds
        const tubeOf = (pts, r0, r1, segs) => {
          const curve = new CatmullRomCurve3(pts), tube = new TubeGeometry(curve, segs, 1, 6, false), pos = tube.attributes.position;
          for (let i = 0; i < pos.count; i++) {   // taper: each ring of the tube round its own centre
            const ring = Math.floor(i / 7), u = ring / segs, c = curve.getPointAt(u), r = r0 + (r1 - r0) * Math.pow(u, 0.6);
            pos.setXYZ(i, c.x + (pos.getX(i) - c.x) * r, c.y + (pos.getY(i) - c.y) * r, c.z + (pos.getZ(i) - c.z) * r);
          }
          trunks.push(tube);
          return curve;
        };
        const leafAlong = (curve, u0, n, spread) => {
          for (let k = 0; k < n; k++) {
            const u = u0 + (1 - u0) * Math.sqrt(rr()), p = curve.getPoint(Math.min(1, u)), a = rr() * Math.PI * 2, s = 0.04 + rr() * spread;
            leaves.push([p.x + Math.cos(a) * s, p.y + (rr() - 0.3) * 0.2, p.z + Math.sin(a) * s, rr() * Math.PI * 2, 0.25 + rr() * 0.75, rr()]);
          }
        };
        const willow = (fx, fz, ix, iz) => {
          const H = 10.6 + rr() * 0.8, reach = 2.5 + rr() * 0.6, px = -iz, pz = ix, sw = (rr() - 0.5) * 0.5, pts = [];
          for (let i = 0; i <= 10; i++) {
            const u = i / 10, y = YT + H * (u < 0.8 ? u : 0.8 + (u - 0.8) * 0.55);
            const bend = u < 0.72 ? 0.1 * u : 0.072 + Math.pow((u - 0.72) / 0.28, 1.5) * reach;   // the head bends over the altar
            pts.push(new Vector3(fx + ix * bend + px * sw * u, y, fz + iz * bend + pz * sw * u));
          }
          const main = tubeOf(pts, 0.17 + rr() * 0.05, 0.035, 16);   // "וכנראה היו לערבות גזעים עבים"
          leafAlong(main, 0.38, 60, 0.3);
          const nb = 3 + Math.floor(rr() * 3);
          for (let b = 0; b < nb; b++) {
            const u0 = 0.3 + rr() * 0.4, p0 = main.getPoint(u0), side = (b % 2 ? 1 : -1) * (0.5 + rr() * 0.6), len = 1.8 + rr() * 1.8, inw = 0.3 + rr() * 0.6;
            const P = (t, up) => new Vector3(p0.x + px * side * t + ix * inw * t * t, p0.y + up, p0.z + pz * side * t + iz * inw * t * t);
            const bc = tubeOf([P(0, 0), P(0.45, len * 0.5), P(0.85, len * 0.85), P(1.2, len * 0.9 - 0.5)], 0.05, 0.015, 8);
            leafAlong(bc, 0.25, 32, 0.22);
          }
        };
        for (let x = x0 + 0.5, k = 0; x < 71.2; x += 0.95 + (rr() - 0.5) * 0.35, k++) willow(x, k % 2 ? -18.85 : -19.2, 0, 1);       // along the north, on the yesod
        for (let z = -18.2, k = 0; z < z1 - 0.5; z += 0.95 + (rr() - 0.5) * 0.35, k++) willow(k % 2 ? x0 + 0.65 : x0 + 0.3, z, 1, 0);   // along the west
        const tm = new Mesh(mergeGeometries(trunks), trunkM); tm.castShadow = true; tm.userData.noPick = true; WGr.add(tm);
        const lg = new PlaneGeometry(0.075, 0.46).translate(0, -0.23, 0);   // a narrow leaf, hanging from its stalk
        const im = new InstancedMesh(lg, leafIM, leaves.length);
        const mm = new Matrix4(), qq = new Quaternion(), e = new Euler(), vp = new Vector3(), vs = new Vector3(1, 1, 1), col = new Color();
        leaves.forEach(([x, y, z, a, t, c], i) => {
          qq.setFromEuler(e.set(t, a, 0, "YXZ")); mm.compose(vp.set(x, y, z), qq, vs); im.setMatrixAt(i, mm);
          im.setColorAt(i, col.setHSL(0.23 + c * 0.06, 0.34 + c * 0.16, 0.24 + c * 0.12));   // willow's grey-green, lighter and darker leaves
        });
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        im.castShadow = true;
        im.instanceMatrix.needsUpdate = true; im.userData.noPick = true; WGr.add(im);
        WGr.userData.x0 = x0;
        return WGr;
      };
      const LB = [];   // the labels, in the altar's frame (z without the place's shift): moved with it
      const build = () => {
        if (AR.built) return;
        AR.built = true;
        // the walkers: priests in white; with the reading "all", Israelites in their own clothes too
        try {
          const PP = tm_people(ctx2), branchG = new CylinderGeometry(0.02, 0.03, 1.6, 5).translate(0, 0.8, 0);
          // the priests: a willow's branch in the right hand (Rashi, Sukkah 43b: "ביד נוטלין אותה ומנענעים ומקיפין בה הכהנים את המזבח");
          // the Israelites (the Or Zarua's Yerushalmi): "נוטלים את לולביהן בידיהן ימנית ואתרוגיהן בידיהן השמאלית"
          const lulavG = new CylinderGeometry(0.018, 0.026, 1.9, 5).translate(0, 0.95, 0), etrogG = new SphereGeometry(0.1, 10, 8).scale(1, 1.35, 1);
          const lulavM = new MeshStandardMaterial({ color: 0x5f7a3a, roughness: 0.8 }), etrogM = new MeshStandardMaterial({ color: 0xd9c23a, roughness: 0.6 });
          const twig = new BoxGeometry(0.04, 0.3, 0.006);
          // FOUR_K (fix-k, 23.11.2026 - the user via the coordinator: "הכהנים אמורים להקיף עם ארבעת המינים בנטילה, ולא סתם בסחיבה"): every
          // walker - the priests, and the Israelites in the reading "all" - holds the four species in netilah all the way round: the lulav with
          // its hadassim and aravot upright in his right hand, the etrog in his left, the two hands close before his chest (shared/frag/arm-k.js:
          // the kit's arms and hand.js's hands, closed round the binding and round the etrog). Until now the priests carried a willow's branch
          // aside in a hanging hand, and the Israelites' lulav and etrog stood by their sides, not in their hands
          //@@include arm-k
          // ARAVAH_209_K (the user's decision 209: "כהנים בערבה, ומתג ישראל — עם ד' מינים"): in the reading "priests" (o0) each priest holds a
          // willow's branch upright in his right hand, in netilah and shaken (Rashi in the card: "ביד נוטלין אותה ומנענעים ומקיפין בה"); in the
          // reading "all" (o1) every walker, priest and Israelite, the four species - the lulav in his right hand and the etrog in his left. Each
          // priest holds both, one shown at a time (pose, below)
          const AK = tm_armK(SH.priestKit), sleeveOf = {};
          const mk = (kind, robe, list, n, name, israel) => {
            for (let i = 0; i < n; i++) {
              const G = new Group(); G.visible = false; AG.add(G);
              const rc = Array.isArray(robe) ? robe[i % robe.length] : robe;
              PP.crowd(G, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind, robe: rc, tone: () => i % 4, exact: true, avnet: kind === "kohen" ? undefined : false, name, arms: AK ? false : undefined });
              if (AK) {
                const sm3 = sleeveOf[rc] || (sleeveOf[rc] = new MeshStandardMaterial({ color: rc, vertexColors: true, roughness: 0.9 }));
                if (israel) G.userData.hold = AK.four(G, sm3);
                else { const hs = G.userData.holds = { aravah: AK.branch(G, sm3), four: AK.four(G, sm3) }; for (const o of hs.four.parts) o.visible = false; G.userData.hold = hs.aravah; G.userData.holdK = "aravah"; }   // ARAVAH_209_K
                list.push(G); continue;
              }
              if (israel) {
                const l = new Mesh(lulavG, lulavM); l.position.set(-0.36, 1.15, 0.3); l.rotation.x = 0.12; G.add(l);
                const e = new Mesh(etrogG, etrogM); e.position.set(0.36, 1.3, 0.32); G.add(e);
              } else {
                const b = new Mesh(branchG, leafM); b.position.set(-0.36, 1.15, 0.3); b.rotation.z = 0.25; G.add(b);
                for (let j = 0; j < 7; j++) { const t = new Mesh(twig, leafM); t.position.set(-0.36 + 0.25 * (0.4 + j * 0.09) + (j % 2 ? 0.06 : -0.06), 1.15 + 1.6 * (0.4 + j * 0.09), 0.3); t.rotation.z = j % 2 ? -0.6 : 0.6; G.add(t); }
              }
              list.push(G);
            }
          };
          mk("kohen", 0xf1ede2, AR.walkers.priests, 14, "aravahPriest", false);
          mk("worker", [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50], AR.walkers.all, 18, "aravahIsraelite", true);
        } catch (e) { console.warn("[aravah] walkers", e && e.message); }   // FOUR_K: said, not swallowed
      };
      // the labels are pushed at once (the labels' layer is drawn once, at the start), and follow the altar's place
      for (const [text, x, y, z, size] of [
        ["״ובאין וזוקפין אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח״ (סוכה ד, ה)", 55.5, F + 15, -21.5, 1.6],
        ["הערבות על היסוד בלבד — מפי הגר״ח קניבסקי, כפי שהובא בחלמיש", 36.5, F + 13.2, -3.5, 1.2],
        ["״בכל יום מקיפין את המזבח פעם אחת, ואומרים, אנא ה׳ הושיעה נא״ (סוכה ד, ה)", 55.5, F + 17.2, 6, 1.5]]) {
        const l = { text, x, y, z: z + 12.5, size, layer: "aravahDemo" };
        ctx2.labels.push(l); LB.push([l, z]);
      }
      let lbDz = 12.5;
      const moveLabels = (dz) => {
        if (dz === lbDz) return;
        lbDz = dz;
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        for (const [l, z] of LB) {
          const oz = l.z; l.z = z + dz;
          if (lg) for (const spr of lg.children) {
            if ((spr.userData && spr.userData.label === l) || (Math.abs(spr.position.x - l.x) < 1e-3 && Math.abs(spr.position.y - l.y) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3)) { spr.position.z = l.z; break; }
          }
        }
      };
      // the way round, in the altar's frame: a rounded rectangle round the altar and its ramp (x 36.5..74.5, z -22.5..45.5)
      const PATH = (() => {
        const X0 = 36.5, X1 = 74.5, Z0 = -22.5, Z1 = 45.5, R = 3, P = [];
        const arc = (cx, cz, a0) => { for (let i = 0; i <= 6; i++) { const a = a0 + (Math.PI / 2) * i / 6; P.push([cx + R * Math.cos(a), cz + R * Math.sin(a)]); } };
        arc(X1 - R, Z0 + R, -Math.PI / 2); arc(X1 - R, Z1 - R, 0); arc(X0 + R, Z1 - R, Math.PI / 2); arc(X0 + R, Z0 + R, Math.PI);
        const L = [0]; for (let i = 1; i <= P.length; i++) { const a = P[i - 1], b = P[i % P.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
        return { P, L, len: L[P.length] };
      })();
      const at = (s) => {   // a point on the way at arc length s
        const { P, L, len } = PATH; s = ((s % len) + len) % len;
        let i = 1; while (i < L.length && L[i] < s) i++;
        const a = P[(i - 1) % P.length], b = P[i % P.length], u = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
        return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(a[0] - b[0], a[1] - b[1])];   // walking toward smaller s
      };
      // the way's direction: on the south side eastward, then north on the east side - the altar on the left, as one who turns to the
      // right from the ramp and goes round (a model choice: the Mishnah does not say). The walkers are in AG, which carries the place's shift
      const pose = () => {
        const t = (performance.now() - AR.t0) / 1000, sp = 2.4;
        const list = AR.circuit === "all" ? AR.walkers.priests.concat(AR.walkers.all) : AR.walkers.priests;
        for (const G of AR.walkers.priests.concat(AR.walkers.all)) if (!list.includes(G)) G.visible = false;
        const gap = PATH.len / list.length;
        list.forEach((G, i) => {
          const [x, z, yaw] = at(-t * sp + i * gap);
          G.position.set(x, F + Math.abs(Math.sin(t * 4.2 + i * 1.3)) * 0.05, z); G.rotation.y = yaw; G.visible = true;
          { const hs = G.userData.holds, want = AR.circuit === "all" ? "four" : "aravah";   // ARAVAH_209_K: the priest's - by the reading
            if (hs && G.userData.holdK !== want) { for (const o of hs[G.userData.holdK].parts) o.visible = false; for (const o of hs[want].parts) o.visible = true; G.userData.hold = hs[want]; G.userData.holdK = want; } }
          if (G.userData.hold && G.userData.hold.tick) G.userData.hold.tick(t + i * 0.37);   // FOUR_K: the willow shaken
        });
      };
      const sync = () => {
        const dz = altDz(), W = curW();
        AG.position.z = dz; moveLabels(dz);
        const WGr = willows(W);
        for (const k in WG) WG[k].visible = WG[k] === WGr;
      };
      const tefOn = (on) => { const TO = SH.tefOff || (SH.tefOff = new Set()); if (on) TO.add("aravah"); else TO.delete("aravah"); };
      SH.aravah = {
        get circuit() { return AR.circuit; },
        setCircuit(m) { AR.circuit = m === "all" ? "all" : "priests"; if (AG.visible) pose(); return AR.circuit; },
        show() { const F2 = SH.features && SH.features.aravah; if (F2 && !F2.isOn()) F2.on(); }
      };
      SH.features = SH.features || {};
      SH.features.aravah = { key: "aravah", timed: false, isOn: () => AG.visible,
        on: () => { build(); sync(); AR.t0 = performance.now(); AG.visible = true; tefOn(true); pose(); },
        off: () => { AG.visible = false; tefOn(false); } };
      // DEMO_STOP_G (the user, 23.11.2026 01:18: "הדגמת הערבה לא נעצרה, למרות שאני בכרכוב בכלל"): the circuit is a demonstration like the others -
      // any switch, place or view (90-entry.js: the click that calls stopDemos) ends it and takes its figures away; its own place and row turn
      // it on again after that click
      (SH.demoStops || (SH.demoStops = [])).push({ id: "aravahDemo", running: () => AG.visible, stop: () => SH.features.aravah.off() });
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!AG.visible) return;
        sync();
        pose();
      });
    }
    // ---------- EXEDRA_B2 (fix-b2, 22.11.2026 - the user's decisions 59 and 65): THE EXEDRAS ROUND THE COURT ----------
    // Tamid 1:3 (88:4): "ונחלקו לשתי כתות, אלו הולכים באכסדרא דרך המזרח, ואלו הולכים באכסדרא דרך המערב"; Tamid 28b (138:83-84): "ומי הוו
    // אכסדראות בעזרה?... אמר רב חסדא: באכסדראות של בנין". Two readings (the row "האכסדראות שבעזרה"): THE RAMBAM (the default; his commentary,
    // Tamid 1:3 - 575:8 - "אכסדרא הנזכרת כאן הוא גוף בולט מגוף כתלי העזרה שסביב על כולה, והוא שאמרו אכסדראות של בנין היו, ולא היה שם גג
    // של קורות כשאר הזיזים"; Beit HaBechirah 1:9 - 337:11 - "אלא של אבנים או לבנים"): a built stone body standing out of the court's walls,
    // all round, no beams and no columns - drawn as a stone overhang on corbels; THE BARTENURA (634:31): "עמודים יוצאים חוץ לכתלי העזרה,
    // ומן העמודים ועד כתלי העזרה היה סכך על גביהן... והמזבח היה שלא במקום הסכך" - columns, and a covering from them to the walls. The run
    // follows the faces the courts' module built (the court's walls and the fronts of the chambers in it - found by rays at load, the gates
    // left open). MODEL CHOICES: the depth (4 amot), the heights, the corbels' and the columns' spacing and form, the covering's material;
    // the Rambam's "body" as an overhang (rather than a raised walk on the floor) - a question for the user.
    {
      const XR = grp("exedraRambam", true), XB = grp("exedraBartenura", false);
      const DEP = 4, YP = 19;
      const cands = [];
      {
        ctx2.root.updateMatrixWorld(true);
        const bb = new Box3();
        ctx2.root.traverse((o) => {
          if (!o.isMesh || o.isInstancedMesh) return;
          for (let q = o; q; q = q.parent) if (q.visible === false) return;
          if (o.material && o.material.transparent && o.material.opacity < 0.5) return;
          try { bb.setFromObject(o); } catch (_) { return; }
          if (bb.max.y - bb.min.y < 7 || bb.max.y < YP + 2 || bb.min.y > YP) return;
          const nearN = bb.max.z <= -47 && bb.min.z >= -80, nearS = bb.min.z >= 47 && bb.max.z <= 80;
          const nearW = bb.max.x <= -84 && bb.min.x >= -110, nearE = bb.min.x >= 86 && bb.max.x <= 110;
          if (nearN || nearS || nearW || nearE) cands.push(o);
        });
      }
      const rcX = new Raycaster(), O = new Vector3(), D = new Vector3();
      const hit = (o, d, max) => { rcX.set(O.set(o[0], o[1], o[2]), D.set(d[0], d[1], d[2])); rcX.far = max; const h = rcX.intersectObjects(cands, false); return h.length ? h[0].point : null; };
      // the runs: along x (north and south) or z (west and east); `o` - the ray's start on the other axis, `d` - toward the wall
      const SIDES = [{ run: "x", a0: -90, a1: 90, o: -42, d: -1 }, { run: "x", a0: -90, a1: 90, o: 42, d: 1 },
        { run: "z", a0: -64, a1: 64, o: -85, d: -1 }, { run: "z", a0: -64, a1: 64, o: 87, d: 1 }];
      const P = (S, a, u) => S.run === "x" ? [a, S.f - S.d * u] : [S.f - S.d * u, a];   // a point `u` in from the face
      const geo = { rStone: [], rDark: [], bStone: [], cedar: [], col: [] };
      const box = (list, w, h, d, x, y, z) => list.push(new BoxGeometry(w, h, d).translate(x, y + h / 2, z));
      const floorAt = (x, z) => (x > 82.5 ? LV.AZ : LV.KOH);   // Israel's court east of 82.5, the priests' court (and round the house) at 16
      let nSeg = 0;
      for (const S of SIDES) {
        const F = [];
        for (let a = S.a0; a <= S.a1; a += 1) {
          const o = S.run === "x" ? [a, YP, S.o] : [S.o, YP, a], d = S.run === "x" ? [0, 0, S.d] : [S.d, 0, 0];
          const p = hit(o, d, 30);
          F.push(p ? (S.run === "x" ? p.z : p.x) : null);
        }
        // a door's narrow gap (the ray went into a chamber) takes the face on both its sides
        for (let i = 1; i < F.length - 1; i++) {
          if (F[i - 1] == null) continue;
          let j = i; while (j < F.length && j - i < 6 && (F[j] == null || Math.abs(F[j] - F[i - 1]) > 0.25)) j++;
          if (j > i && j < F.length && j - i < 6 && F[j] != null && Math.abs(F[j] - F[i - 1]) <= 0.25) for (let k = i; k < j; k++) F[k] = F[i - 1];
        }
        let s0 = null;
        const flush = (i1) => {
          if (s0 == null) return;
          const i0 = s0; s0 = null;
          if (i1 - i0 < 3) return;   // too short
          const f = F[i0], a0 = S.a0 + i0 - 0.5, a1 = S.a0 + i1 - 1 + 0.5, L = a1 - a0, am = (a0 + a1) / 2;
          const T = Object.assign({}, S, { f });
          const [cx, cz] = P(T, am, DEP / 2), Y = floorAt(cx, cz);
          const W = S.run === "x" ? [L, DEP] : [DEP, L];
          nSeg++;
          // the Rambam: a stone overhang 9 amot over the floor, a moulded edge, and corbels every 3 amot
          box(geo.rStone, W[0], 1.1, W[1], cx, Y + 9, cz);
          { const [ex, ez] = P(T, am, DEP - 0.2); box(geo.rStone, S.run === "x" ? L : 0.5, 0.45, S.run === "x" ? 0.5 : L, ex, Y + 8.75, ez); }
          for (let a = a0 + 1.2; a < a1 - 0.6; a += 3) {
            for (let k = 0; k < 3; k++) {   // a stepped corbel: three courses, each standing out further
              const dep = 0.9 + k * 1.0, [kx, kz] = P(T, a, dep / 2);
              box(geo.rDark, S.run === "x" ? 0.7 : dep, 0.62, S.run === "x" ? dep : 0.7, kx, Y + 7.1 + k * 0.62, kz);
            }
          }
          // the Bartenura: columns DEP in from the face, an architrave on them, and the covering from them to the wall
          const nC = Math.max(2, Math.round(L / 5) + 1);
          for (let i = 0; i < nC; i++) {
            const a = a0 + 0.6 + (L - 1.2) * i / (nC - 1), [qx, qz] = P(T, a, DEP - 0.5);
            geo.col.push(new CylinderGeometry(0.38, 0.44, 9.2, 12).translate(qx, Y + 0.5 + 4.6, qz));
            box(geo.bStone, 1.2, 0.5, 1.2, qx, Y, qz);
            box(geo.bStone, 1.1, 0.5, 1.1, qx, Y + 9.7, qz);
          }
          { const [bx, bz] = P(T, am, DEP - 0.5); box(geo.bStone, S.run === "x" ? L : 0.9, 0.8, S.run === "x" ? 0.9 : L, bx, Y + 10.2, bz); }
          { const [rx, rz] = P(T, am, (DEP + 0.1) / 2); box(geo.cedar, S.run === "x" ? L : DEP + 0.1, 0.45, S.run === "x" ? DEP + 0.1 : L, rx, Y + 11, rz); }
        };
        for (let i = 0; i <= F.length; i++) {
          const f = i < F.length ? F[i] : null;
          if (s0 != null && (f == null || Math.abs(f - F[s0]) > 0.25)) flush(i);
          if (f != null && s0 == null) s0 = i;
        }
      }
      const mergeTo = (list, mat, g) => { if (!list.length) return; const m = new Mesh(mergeGeometries(list), mat); m.castShadow = m.receiveShadow = true; g.add(m); };
      mergeTo(geo.rStone, M2.stoneLight, XR);
      mergeTo(geo.rDark, M2.stone, XR);
      mergeTo(geo.bStone, M2.stoneLight, XB);
      mergeTo(geo.col, M2.stoneLight, XB);
      mergeTo(geo.cedar, M2.cedar, XB);
      SH.__exedraQA = { cands: cands.length, segments: nSeg };
      ctx2.labels.push(
        { text: "אכסדרה — כרמב״ם: גוף בולט בנוי מכתלי העזרה, בלי גג של קורות (פירוש המשניות, תמיד א, ג)", x: -40, y: LV.KOH + 13, z: -60, size: 1.5, layer: "exedraRambam" },
        { text: "אכסדרה — כברטנורא: עמודים, ומן העמודים ועד כתלי העזרה סכך (תמיד א, ג)", x: -40, y: LV.KOH + 13.5, z: -60, size: 1.5, layer: "exedraBartenura" });
      const XE = { mode: "rambam" };
      SH.exedra = { get mode() { return XE.mode; }, set(m) { XE.mode = m === "bartenura" ? "bartenura" : m === "none" ? "none" : "rambam"; XR.visible = XE.mode === "rambam"; XB.visible = XE.mode === "bartenura"; return XE.mode; } };
    }
    // ---------- BENCHES_B2 (fix-b2, 22.11.2026 - the user's decision 77): THE HIGH STONE BENCHES BETWEEN THE ALTAR, THE SLAUGHTER PLACE AND
    // THE RAMP ----------
    // Pesachim 65b (106:2002-2006): "שבח הוא לבני אהרן שילכו עד ארכובותיהם בדם... בהולכת אברים לכבש ובהולכת דם, מיהא היכי אזלי? דמסגי
    // אאיצטבי"; Zevachim 35a (130:1255) "ולעבודה היכי אזלי? אזלי אאיצטבי"; Rashi there (2191:1664): "איצטבאות גבוהין היו שם בנין אבנים ואינן
    // חוצצין דמן הרצפה הן". The form - Chalamish ("אלחנן וחיים עולים לירושלים", the list of sources, on p. 30): "רצפת עזרת הכהנים בנויה
    // שורות שורות, גבוהות ונמוכות, כדי שהכהנים יוכלו ללכת על השורות הגבוהות בלא שבגדיהם יתלכלכו בדם". Off by default (the row "האיצטבאות
    // הגבוהות שבעזרה"); shown: rows of stone, an amah wide and half an amah high, with low channels between them, north to south - from the
    // slaughter place to the ramp, round the altar and its ramp. In the altar's frame (they move with its place). MODEL CHOICES: the rows'
    // width, height, direction and the area they cover.
    {
      const BG = grp("highBenches", false);
      const F = LV.KOH, RW = 1, RH = 0.5, GAP = 0.75;
      const parts = [];
      const Z0 = -32.5, Z1 = 45.5;   // in the altar's frame (world z - 12.5 at the Mishnah's place): from the rings' edge to past the ramp's foot
      for (let x = 30 + RW / 2; x <= 80; x += RW + GAP) {
        const cut = [];
        if (x > 38.6 && x < 72.4) cut.push([-20.4, 12.6]);   // the altar's base (and its yesod)
        if (x > 45.6 && x < 65.4) cut.push([12.4, 43.6]);    // the ramp and its little ramps
        if (x > 38.5 && x < 45.6) cut.push([12.4, 20.5]);    // the shitin's corner and the tables west of the ramp
        cut.sort((a, b) => a[0] - b[0]);
        let z = Z0;
        for (const [c0, c1] of cut.concat([[Z1, Z1]])) {
          if (c0 - z > 1) parts.push(new BoxGeometry(RW, RH, c0 - z).translate(x, F + RH / 2, (z + c0) / 2));
          z = Math.max(z, c1);
        }
      }
      const bm = new Mesh(mergeGeometries(parts), M2.stoneLight); bm.receiveShadow = bm.castShadow = true; BG.add(bm);
      const lb = { text: "איצטבאות גבוהות — ״דמסגי אאיצטבי״ (פסחים סה:); צורתן כחלמיש: שורות גבוהות ונמוכות", x: 76, y: F + 4, z: -14 + 12.5, size: 1.4, layer: "highBenches" };
      ctx2.labels.push(lb);
      let bz = 12.5;
      const follow = () => {
        const AP = SH.altarPlace, dz = AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5;
        BG.position.z = dz;
        if (dz !== bz) {
          const oz = lb.z; lb.z = -14 + dz; bz = dz;
          let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
          if (lg) for (const spr of lg.children) if ((spr.userData && spr.userData.label === lb) || (Math.abs(spr.position.x - lb.x) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3)) { spr.position.z = lb.z; break; }
        }
      };
      SH.benches = { get on() { return BG.visible; }, set(on) { BG.visible = !!on; follow(); return BG.visible; } };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (BG.visible) follow(); });
    }
    // ---------- PILGRIM_B2 (fix-b2, 22.11.2026 - the user's decisions 19 and 29: "מסלול עולה רגל בגובה העין — כברטנורא"): THE PILGRIM'S
    // WALK. Middot 2:2 (89:13): "כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל, חוץ ממי שאירעו דבר, שהוא מקיף לשמאל";
    // the Bartenura there (643:64): "כגון הנכנסים דרך שערי חלדה שהן מן הימין, מקיפין דרך שער הטדי". The walk engine's eye (3.2 over the
    // floor): up the stairs of the western gate of Chulda, in, to the right (east) along the south of the mount, north along its east (by the
    // women's court and the Shushan gate), west along its north, and out by the Tadi gate. The way between the courts and the walls, its
    // pace - model choices.
    {
      const EY = 3.2, Y = LV.HAR + EY, RPw = SH.chuldaRamp || { zf: 364.5, yf: -28, yAt: (z) => -28 * Math.min(1, Math.max(0, (z - 335) / 29.5)) };
      const KEYS = [   // (up the ramp before the gate - CHULDA_RAMPS_B2)
        [0, [0, RPw.yf + EY, RPw.zf + 8], [0, RPw.yAt(RPw.zf - 24) + EY, RPw.zf - 24]], [6, [0, RPw.yAt(352) + EY, 352], [0, EY, 330]], [9, [0, Y, 334], [0, Y, 300]],
        [12, [0, Y, 296], [0, Y, 272]], [15, [14, Y, 270], [80, Y, 270]], [22, [140, Y, 270], [220, Y, 262]],
        [28, [262, Y, 250], [298, Y, 196]], [34, [298, Y, 150], [298, Y, 60]], [40, [298, Y, 40], [290, Y, -10]],
        [46, [298, Y, -70], [292, Y, -120]], [52, [262, Y, -126], [180, Y, -126]], [59, [130, Y, -126], [60, Y, -132]],
        [64, [58, Y, -146], [55, Y + 2, -170]], [67, [55, Y, -158], [55, Y + 3, -180]]
      ];
      const CAPS = [
        [0, "״כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל״ (מידות ב, ב)"],
        [5, "״כגון הנכנסים דרך שערי חלדה שהן מן הימין, מקיפין דרך שער הטדי״ (ברטנורא שם)"],
        [13, "נכנסים בשער חולדה ופונים לימין — מזרחה"],
        [30, "צפונה, לאורך המזרח — מול עזרת נשים ושער שושן"],
        [44, "״חוץ ממי שארעו דבר, שהוא מקיף לשמאל. מה לך מקיף לשמאל — שאני אבל: השוכן בבית הזה ינחמך״ (מידות ב, ב)"],   // QUOTES_Q: מידות ב, ב (89:13): 'שארעו'
        [53, "מערבה, לאורך הצפון"],
        [61, "ויוצאים בשער הטדי — דרך שמאל; המסלול בין העזרות לחומות והקצב — בחירת מודל"]
      ];
      const PW = { run: false };
      const finish = () => { PW.run = false; const sv = PW.saved; if (sv && sv.lg) sv.lg.visible = sv.labels; if (sv && sv.view && SH.viewLimits) SH.viewLimits.set(sv.view); if (PW.camLow0 === undefined) delete SH.camLow; else SH.camLow = PW.camLow0; PW.saved = null; };
      const start = () => {
        const Wk = SH.walk;
        if (!Wk) return false;
        if (typeof SH.stopDemos === "function") SH.stopDemos("pilgrimWalk");
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        PW.saved = { lg, labels: lg ? lg.visible : true, view: SH.viewLimits ? SH.viewLimits.get() : null };
        if (lg) lg.visible = false;
        if (SH.viewLimits) SH.viewLimits.include([0, RPw.yf - 2, RPw.zf + 12]);
        PW.camLow0 = SH.camLow; SH.camLow = RPw.yf - 3;
        PW.run = true;
        Wk.run(KEYS, CAPS, finish);
        return true;
      };
      const stop = () => { if (!PW.run) return; const Wk = SH.walk; if (Wk && Wk.on) Wk.stop(); else finish(); };
      (SH.demoStops || (SH.demoStops = [])).push({ id: "pilgrimWalk", running: () => PW.run, stop,
        pause: () => { const w = (SH.demoStops || []).find((q) => q.id === "walk"); if (w) w.pause(); },
        resume: () => { const w = (SH.demoStops || []).find((q) => q.id === "walk"); if (w) w.resume(); },
        paused: () => { const w = (SH.demoStops || []).find((q) => q.id === "walk"); return !!(w && w.paused()); }, restart: () => { stop(); start(); } });
      SH.pilgrimWalk = { start, stop, get on() { return PW.run; } };
    }
    // ---------- AZARA_SEAT_B2 (fix-b2, 22.11.2026 - the user's decision 106: "תראה אותם יושבים ממש סביב שולחן. לא משנה המקום, רק שיהיה
    // בעזרת כהנים"): THE DISPLAY OF "ישיבה בעזרה". Yoma 25a (107:582): "אין ישיבה בעזרה אלא למלכי בית דוד בלבד"; the Tosafot there (1908:199),
    // the second answer, in the name of R. Yitzchak bar Avraham: "דאף על גב דאין ישיבה בעזרה אלא למלכי בית דוד, הנ"מ לדברים דלאו צורך
    // עבודה, אבל אכילה צורך עבודה היא" - so: eight priests sitting on benches round a table in the priests' court, east of the ramp (clear
    // of the ways), eating the most holy things - meat in dishes and matzot (the rest of the meal offerings, the shewbread). In their garments,
    // the kit's priests (tefillin by its rules: a weekday). The place, the table, the benches, the dishes - model choices. A hidden layer, the
    // place's feature (the place "ישיבה בעזרה").
    {
      const SG2 = grp("azaraSeating", false);
      const CX = 77.2, CZ = 45, F = groundAt(CX, CZ, 30, LV.KOH);
      // (the user, after the picture: "השולחן לא בגובה הכהנים, הבשר צריך להיות בשר אמיתי!" - the table's top now over the knees of
      // the seated, under their elbows; pieces of cooked meat, irregular, some with a bone, in silver bowls; round thin matzot; the table
      // of veined marble)
      const marbleTex = (() => { const cv = document.createElement("canvas"); cv.width = cv.height = 256; const c2 = cv.getContext("2d");
        c2.fillStyle = "#e9e3d6"; c2.fillRect(0, 0, 256, 256);
        let q3 = 31; const r3 = () => (q3 = (q3 * 1664525 + 1013904223) >>> 0) / 4294967296;
        for (let k = 0; k < 14; k++) { c2.strokeStyle = "rgba(120,112,100," + (0.18 + r3() * 0.3) + ")"; c2.lineWidth = 0.6 + r3() * 1.8; c2.beginPath(); let x = r3() * 256, y = 0; c2.moveTo(x, y); while (y < 256) { x += (r3() - 0.5) * 22; y += 6 + r3() * 10; c2.lineTo(x, y); } c2.stroke(); }
        const t = new CanvasTexture(cv); t.wrapS = t.wrapT = RepeatWrapping; return t; })();
      const stoneT = new MeshStandardMaterial({ map: marbleTex, color: 0xf2ece0, roughness: 0.32, metalness: 0.02 }), benchM = M2.cedar || M2.stoneLight;
      const silverM = new MeshStandardMaterial({ color: 0xd7d7dc, metalness: 0.85, roughness: 0.3, side: DoubleSide });
      const meatM = new MeshStandardMaterial({ color: 0x7a3a20, roughness: 0.42, metalness: 0.05 }), meatM2 = new MeshStandardMaterial({ color: 0x96502c, roughness: 0.5 });
      const boneM = new MeshStandardMaterial({ color: 0xeee6d2, roughness: 0.6 });
      const matzaTex = (() => { const cv = document.createElement("canvas"); cv.width = cv.height = 128; const c2 = cv.getContext("2d");
        c2.fillStyle = "#e6cf9a"; c2.fillRect(0, 0, 128, 128); let q4 = 7; const r4 = () => (q4 = (q4 * 1664525 + 1013904223) >>> 0) / 4294967296;
        for (let k = 0; k < 90; k++) { c2.fillStyle = "rgba(120,72,30," + (0.25 + r4() * 0.5) + ")"; c2.beginPath(); c2.arc(r4() * 128, r4() * 128, 0.8 + r4() * 2.4, 0, Math.PI * 2); c2.fill(); }
        for (let y = 10; y < 128; y += 12) { c2.strokeStyle = "rgba(150,100,50,0.35)"; c2.beginPath(); c2.moveTo(0, y); c2.lineTo(128, y); c2.stroke(); }
        return new CanvasTexture(cv); })();
      const matzaM = new MeshStandardMaterial({ map: matzaTex, roughness: 0.85 });
      const TL = 4.4, TW = 1.6, TH = 1.3;
      mesh(SG2, new BoxGeometry(TW, 0.12, TL), stoneT, CX, F + TH - 0.06, CZ);   // the table: its top over the knees of the seated (bench 0.9)
      for (const lx of [-1, 1]) for (const lz of [-1, 1]) mesh(SG2, new BoxGeometry(0.16, TH - 0.12, 0.16), stoneT, CX + lx * (TW / 2 - 0.15), F + (TH - 0.12) / 2, CZ + lz * (TL / 2 - 0.2));
      for (const sd of [-1, 1]) mesh(SG2, new BoxGeometry(0.6, 0.9, TL), benchM, CX + sd * (TW / 2 + 0.75), F + 0.45, CZ);   // the benches
      for (const sz of [-1, 1]) mesh(SG2, new BoxGeometry(0.7, 0.9, 0.6), benchM, CX, F + 0.45, CZ + sz * (TL / 2 + 0.75));   // a stool at each end
      const TY = F + TH;
      const seats = [];
      for (const sd of [-1, 1]) for (const k of [-1, 0, 1]) seats.push([CX + sd * (TW / 2 + 0.75), CZ + k * 1.35, sd < 0 ? Math.PI / 2 : -Math.PI / 2]);
      for (const sz of [-1, 1]) seats.push([CX, CZ + sz * (TL / 2 + 0.75), sz < 0 ? 0 : Math.PI]);
      let q5 = 106;
      const r5 = () => (q5 = (q5 * 1664525 + 1013904223) >>> 0) / 4294967296;
      const lump = (n) => { const g3 = new IcosahedronGeometry(1, 1), ps = g3.attributes.position; for (let k = 0; k < ps.count; k++) { const x = ps.getX(k), y = ps.getY(k), z = ps.getZ(k), f = 1 + 0.28 * Math.sin(x * 4.1 + n) * Math.cos(z * 3.3 + n * 2) + 0.15 * Math.sin(y * 6 + n); ps.setXYZ(k, x * f, y * f * 0.6, z * f); } g3.computeVertexNormals(); return g3; };
      const bowlG = new LatheGeometry([[0.001, 0], [0.18, 0], [0.26, 0.05], [0.31, 0.12], [0.3, 0.13], [0.24, 0.07], [0.001, 0.04]].map(([r, y]) => new Vector2(r, y)), 22);
      seats.forEach(([sx, sz2], si) => {
        const dx = CX - sx, dz = CZ - sz2, L = Math.hypot(dx, dz) || 1, px = sx + dx / L * (Math.abs(dx) > 0.1 ? 1.12 : 1.02), pz = sz2 + dz / L * (Math.abs(dz) > 0.1 ? 1.12 : 1.02);
        mesh(SG2, bowlG, silverM, px, TY, pz);
        for (let k = 0; k < 3; k++) {   // pieces of meat in the bowl
          const m3 = mesh(SG2, lump(si * 3 + k), k % 2 ? meatM2 : meatM, px + (r5() - 0.5) * 0.22, TY + 0.1 + k * 0.03, pz + (r5() - 0.5) * 0.22);
          m3.scale.set(0.09 + r5() * 0.05, 0.07 + r5() * 0.03, 0.07 + r5() * 0.04); m3.rotation.y = r5() * 3;
        }
        if (si % 3 === 0) { const b = mesh(SG2, new CylinderGeometry(0.018, 0.018, 0.26, 6).rotateZ(Math.PI / 2), boneM, px, TY + 0.15, pz + 0.04); b.rotation.y = r5() * 3;
          for (const e of [-1, 1]) { const k2 = mesh(SG2, new SphereGeometry(0.035, 8, 6), boneM, 0, 0, 0); b.add(k2); k2.position.set(e * 0.13, 0, 0); } }
        const mz = mesh(SG2, new CylinderGeometry(0.2, 0.2, 0.012, 24), matzaM, px - dz / L * 0.45, TY + 0.008, pz + dx / L * 0.45);   // a matzah beside the bowl
        mz.rotation.y = r5() * 3;
      });
      for (const [mx, mz] of [[CX, CZ - 0.7], [CX, CZ + 0.7]]) for (let i = 0; i < 6; i++) { const m4 = mesh(SG2, new CylinderGeometry(0.27, 0.27, 0.014, 26), matzaM, mx + (r5() - 0.5) * 0.04, TY + 0.008 + i * 0.016, mz + (r5() - 0.5) * 0.04); m4.rotation.y = r5() * 3; }
      try {
        // EAT_B2 (the coordinator, 22.11.2026: "הכהנים אוכלים — יושבים באמת על הספסלים ואוכלים"): the crowd's seat is its own height over the
        // floor - y: the bench's top (until now y: the floor, and they sank into the benches to the waist); their arms are drawn here: the left
        // hand on the table, the right one goes from the bowl to the mouth with a piece of meat or of matzah, and back, each at his own time
        const SEAT = 0.9, SC = 1.4, FW = 0.3;
        tm_people(ctx2).crowd(SG2, seats, { y: F + SEAT, s: SC, pose: "bench", seat: SEAT, kind: "kohen", robe: 0xf1ede2, tone: (i) => i % 3, fwd: FW, shadow: true, arms: false, exact: true, name: "azaraSeated" });
        const sleeveM = new MeshStandardMaterial({ color: 0xf1ede2, roughness: 0.85 }), skinM = new MeshStandardMaterial({ color: 0xc99a74, roughness: 0.7 });
        const limbG = new CylinderGeometry(1, 0.85, 1, 8, 1).translate(0, 0.5, 0), handG = new SphereGeometry(1, 10, 8), UPV = new Vector3(0, 1, 0);
        const seg = (m, a, b2, r) => { const d = new Vector3().subVectors(b2, a), L2 = d.length(); m.position.copy(a); m.quaternion.setFromUnitVectors(UPV, d.normalize()); m.scale.set(r, L2, r); };
        const ik = (S, Wt, sd) => {   // two bones, 0.33 and 0.30 (the kit's seated arm): the elbow out to the side and down
          const L1 = 0.33, L2 = 0.3, d = new Vector3().subVectors(Wt, S), D = Math.min(L1 + L2 - 1e-3, d.length()), u = d.clone().normalize();
          const a = (L1 * L1 - L2 * L2 + D * D) / (2 * D), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
          const pole = new Vector3(sd * 1, -0.6, -0.2), n = pole.sub(u.clone().multiplyScalar(pole.dot(u))).normalize();
          return { E: S.clone().add(u.clone().multiplyScalar(a)).add(n.multiplyScalar(h)), W: S.clone().add(u.multiplyScalar(D)) };
        };
        const foodG = [new IcosahedronGeometry(0.045, 1), new CylinderGeometry(0.06, 0.06, 0.008, 12)], foodM = [meatM, matzaM];
        const EATERS = seats.map(([sx, sz2, yaw], i) => {
          const G = new Group(); G.position.set(sx + Math.sin(yaw) * FW, F + SEAT, sz2 + Math.cos(yaw) * FW); G.rotation.y = yaw; G.scale.setScalar(SC); SG2.add(G);
          const mk = (geo, m) => { const o2 = new Mesh(geo, m); o2.castShadow = true; o2.userData.noPick = true; G.add(o2); return o2; };
          const arms = [-1, 1].map((sd) => ({ sd, S: new Vector3(sd * 0.245, 0.758, 0), up: mk(limbG, sleeveM), fo: mk(limbG, sleeveM), hd: mk(handG, skinM) }));
          const food = mk(foodG[i % 2], foodM[i % 2]);
          return { G, arms, food, ph: i * 0.61 };
        });
        const BOWL_L = new Vector3(-0.07, 0.36, 0.6), MOUTH_L = new Vector3(-0.03, 1.02, 0.17), REST_L = new Vector3(0.17, 0.33, 0.46);
        const pose2 = (tt) => {
          for (const e of EATERS) {
            const c = ((tt + e.ph * 4.6) % 4.6) / 4.6, k = c < 0.26 ? 0 : c < 0.43 ? (c - 0.26) / 0.17 : c < 0.6 ? 1 : c < 0.77 ? 1 - (c - 0.6) / 0.17 : 0, kk = k * k * (3 - 2 * k);
            for (const A of e.arms) {
              const Wt = A.sd > 0 ? REST_L : BOWL_L.clone().lerp(MOUTH_L, kk), q2 = ik(A.S, Wt, A.sd);
              seg(A.up, A.S, q2.E, 0.068); seg(A.fo, q2.E, q2.W, 0.056); A.hd.position.copy(q2.W); A.hd.scale.set(0.045, 0.04, 0.055);
              if (A.sd < 0) { e.food.position.copy(q2.W).add(new Vector3(0, 0.035, 0.03)); e.food.visible = c > 0.2 && c < 0.7; }
            }
          }
        };
        pose2(0);
        if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (SG2.visible) pose2(performance.now() / 1000); });
      } catch (e) { console.warn("[azara seating]", e && e.message); }
      ctx2.labels.push({ text: "כהנים יושבים ואוכלים קדשים בעזרה — ״אכילה צורך עבודה היא״ (תוספות יומא כה.)", x: CX, y: F + 5.2, z: CZ, size: 1.3, layer: "azaraSeating" });
      SH.features = SH.features || {};
      SH.features.azaraSeating = { key: "azaraSeating", timed: false, isOn: () => SG2.visible, on: () => { SG2.visible = true; }, off: () => { SG2.visible = false; } };
    }
    // ---------- BIKKURIM_B2 (fix-b2, 22.11.2026 - the user's decision 70: "הבאת ביכורים — הדגמה מהר הבית עד הקרן הדרומית מערבית... דמויות
    // גברים בלבד"): THE BRINGING OF THE FIRST FRUITS. Mishnah Bikkurim 3:4 (50:29): "החליל מכה לפניהם עד שמגיעין להר הבית. הגיעו להר
    // הבית, אפילו אגריפס המלך נוטל הסל על כתפו ונכנס, עד שמגיע לעזרה. הגיע לעזרה ודברו הלוים בשיר, ארוממך ה' כי דליתני"; 3:5 (50:30)
    // "הגוזלות שעל גבי הסלים, היו עולות"; 3:6 (50:31) "עודהו הסל על כתפו, קורא מהגדתי היום... הגיע לארמי אובד אבי, מוריד הסל מעל כתפו
    // ואוחזו בשפתותיו, וכהן מניח ידו תחתיו ומניפו... ומניחו בצד המזבח, והשתחוה ויצא"; the Rambam, Bikkurim 3:12 (336:53): "יש לו רשות
    // לתתם לעבדו וקרובו בכל הדרך עד שמגיע להר הבית. הגיע להר הבית נוטל הסל על כתפו הוא בעצמו... ומניחו בצד המזבח בקרן דרומית מערבית
    // בדרומה של קרן וישתחוה ויצא". The demonstration (the walk engine; daytime): up the ramp before the western gate of Chulda, the flute
    // before them (it stops at the gate); his companion carries his basket up to the mount, and in the gate he takes it on his own shoulder;
    // (unseen) across the mount; through the women's court, up the fifteen steps, by the Nikanor gate into the court - the Levites on the
    // duchan sing; he reads, the basket on his shoulder; round the ramp's foot and up its west side (west of the two tables) to the altar's south-west corner; he lowers it and holds
    // it by its rims, the priest's hand under it, and they wave it; he sets it down south of the corner, bows and goes out. Men only. The
    // way, the pace, the basket and its fruits, the companions - model choices; OX_B2: the ox of 3:3 goes before them (decision 123), and
    // OX_IN_B2: into the court with them, to stand at the place of slaughter (decision 178).
    {
      const BK = { run: false, built: false };
      const BG = grp("bikkurimDemo", false);
      const RPb = SH.chuldaRamp || { zf: 364.5, yf: -28, yAt: (z) => -28 * Math.min(1, Math.max(0, (z - 335) / 29.5)) };
      const altDzB = () => { const AP = SH.altarPlace; return AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5; };
      // READING_B2 (the user's decision 125 c: "מתג — תנא קמא (קורא כשהסל על כתפו, ואחר כך מניף) / רבי יהודה (מניף ב׳ארמי אובד אבי׳ וממשיך
      // לקרוא), לפי ביכורים ג, ו"): he reads at the corner; the Tanna Kamma - the whole passage with the basket on his shoulder, then the waving;
      // R. Yehuda - on his shoulder up to "ארמי אובד אבי", then the waving while he reads on to the end, and then he sets it down
      const WZ = 0.55;   // BIKKURIM_N1: the waving's place, in the altar's frame, moved 0.55 south - off the corner's cover slab (x 38.5-39.5, z 25.3-26.3 in the court's frame), where the priest stood
      const T0 = { gate: 6.4, take: 7.6, ezn0: 9.6, ezn1: 14.2, steps1: 15.8, nik: 17.0, walk0: 21.6, corner: 28.0, read0: 28.2 };
      const mkT = (r) => Object.assign({}, T0, r === "rj" ? { wave0: 30.4, wave1: 35.2, put: 37.2, bow0: 37.8, bow1: 39.2, end: 41.6 } : { wave0: 32.0, wave1: 36.8, put: 38.0, bow0: 38.6, bow1: 40.0, end: 42.4 });
      BK.reading = "tk";
      let T = mkT(BK.reading);
      const lerp2 = (a, b, u) => a + (b - a) * u, clamp2 = (v, a, b) => Math.max(a, Math.min(b, v)), sm2 = (u) => u * u * (3 - 2 * u);
      const plen2 = (P) => { let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; };
      const at2 = (P, u) => { const L = plen2(P) * clamp2(u, 0, 1); let acc = 0; for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (acc + l >= L || i === P.length - 1) { const f = l > 0 ? clamp2((L - acc) / l, 0, 1) : 0; return [lerp2(a[0], b[0], f), lerp2(a[1], b[1], f), Math.atan2(b[0] - a[0], b[1] - a[1])]; } acc += l; } return [P[0][0], P[0][1], 0]; };
      // the bringer's ways [pts, t0, t1, kind] (kind "ramp" - on the ramp's slope; else the floor, sampled before the walk with the figures hidden)
      const SW = () => { const dz = altDzB(), A = (x, z) => [x, z + dz];
        return [
          [[[0, RPb.zf + 5], [0, 336]], 0.4, T.gate, "ramp"],
          [[[0, 336], [0, 333.5]], T.gate, T.take, "floor", 0],
          [[[0, 333.5], [240, 2]], T.take + 0.2, T.ezn0, "hide"],
          [[[240, 2], [229, 1], [200, 1], [106, 1]], T.ezn0, T.ezn1, "floor", -Math.PI / 2],
          [[[106, 1], [97.5, 1]], T.ezn1, T.steps1, "floor"],
          [[[97.5, 1], [89.5, 4]], T.steps1, T.nik, "floor", -Math.PI / 2],
          // WAY_K (fix-k, 23.11.2026 - the coordinator, after agent G's finding): round the ramp's foot in the clear lane between it (its end at
          // z 38.5 in the altar's frame) and the stands south of it (from z 42) - z 40.25; until now at 43.8, through the stands
          [[[89.5, 4], [88, 18], [80, 42], A(68, 40.25), A(44.2, 40.25), A(38, 39.5), A(38, 16.2), A(38.3, 15.0 + WZ)], T.walk0, T.corner, "floor", 2.62],
          [[A(38.3, 15.0 + WZ), A(37.8, 17), A(38, 39.5), A(50, 40.3)], T.bow1 + 0.2, T.end, "floor"]
        ]; };
      const hCache = new Map();
      // OX_K: the ray from 21 amot at most (over every floor of the way: 16 in the priests' court), not from 30 - from 30 the walkers in the
      // Nikanor gate stood on the gate's roof (23.6)
      // BIKKURIM_N1: a flat slab lying on the floor (the cover at the altar's south-west corner: 8 cm, over a black frame of 3 cm) is not a floor to walk on - the
      // priest of the waving stood with his feet half on it and half off, and rose and sank as he crossed it; the walkers' floor is the first surface with more than 12 cm of air under it
      const hAt = (x, z, near) => { const k = Math.round(x * 2) + "," + Math.round(z * 2); let y = hCache.get(k); if (y === undefined) { y = groundAt(x, z, Math.min(near, 21), LV.KOH); for (let i = 0; i < 3 && isFinite(y); i++) { const y2 = groundAt(x, z, y - 0.01, NaN); if (isFinite(y2) && y - y2 < 0.12) y = y2; else break; } hCache.set(k, y); } return y; };
      // OX_IN_B2 (the user's decision 178: "הוא חוזר להקרבה" - the ox goes in with them to the court, a peace offering, and stands at the
      // place of slaughter; the Rambam, Bikkurim 3:12: "וכשם שטעונין תנופה כך טעונין קרבן שלמים"): from the Nikanor gate north-west, north of
      // the altar, to beside the rings (40-altar.js: the label at x 52, z -27); peace offerings are slaughtered anywhere in the court - the spot
      // a model choice
      const OXW = () => [[[89.5, 4], [84, 1], [78, -8], [66, -19]], T.nik - 0.6, T.nik + 3.8, "floor"];
      const prime = () => { const was = BG.visible; BG.visible = false; for (const [P, , , kind] of SW().concat([OXW()])) if (kind === "floor") { const L = plen2(P); for (let d = 0; d <= L; d += 0.5) { const q = at2(P, d / Math.max(L, 1e-3)); hAt(q[0], q[1], 30); } } BG.visible = was; };
      // ===== OX_K (fix-k, 23.11.2026 - the user, via the coordinator: "שור עם ראש מורם" - "שילך עם ראש ישר או מעט מושפל"; "קפיצות של השור
      // בעזרה" - "הליכה רציפה במסלול חלק, בלי קפיצה בין פריים לפריים ובלי חדירה לקירות או לאנשים"): THE OX, BUILT AGAIN, AND ITS WAY.
      // Bikkurim 3:3 (50:28): "והשור הולך לפניהם, וקרניו מצופות זהב, ועטרת של זית בראשו". Its body one soft shape (the back's line and the
      // withers, the belly, the flanks), the neck forward and a little down (about ten degrees under the level), the face down toward the
      // muzzle (as an ox carries its head walking), ears, eyes, the dewlap, the tail; the legs of two bones and a hoof, each hoof set on the
      // floor under it (on the steps each on its own step), the body pitched with the steps (the head kept nearer the level); a walk of four
      // beats (hind, fore, hind, fore). ITS WAY: up the ramp before them and in through the gate (as until now); unseen across the mount; from
      // the gate of the women's court one smooth way (its corners rounded) up the twelve steps, across the court, up the fifteen steps,
      // through the Nikanor gate and on to its place by the rings, never stopping on the way - at a pace that never leaps (slower on the steps),
      // always before the people. Until now: balls for a body and a level head, sticks for legs and the hooves apart from them; its height the
      // floor's under its middle (it leapt up each step, and in the Nikanor gate onto the gate's roof), its turn snapping, a hop in each stride.
      // Its measures, form and pace - model choices.
      const spl1 = (tab, x) => {   // a smooth line through [x, y] (Catmull-Rom)
        let i = 0; while (i < tab.length - 2 && x > tab[i + 1][0]) i++;
        const p0 = tab[Math.max(0, i - 1)], p1 = tab[i], p2 = tab[i + 1], p3 = tab[Math.min(tab.length - 1, i + 2)];
        const dd = p2[0] - p1[0], u = clamp2((x - p1[0]) / dd, 0, 1), m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * dd, m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * dd, u2 = u * u, u3 = u2 * u;
        return (2 * u3 - 3 * u2 + 1) * p1[1] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[1] + (u3 - u2) * m2;
      };
      const seamless = (g) => {   // one normal where the sphere's seam and poles put several vertices on one point
        const p = g.attributes.position, n = g.attributes.normal, m = new Map();
        for (let i = 0; i < p.count; i++) { const k = Math.round(p.getX(i) * 1e4) + "," + Math.round(p.getY(i) * 1e4) + "," + Math.round(p.getZ(i) * 1e4); if (!m.has(k)) m.set(k, []); m.get(k).push(i); }
        for (const L of m.values()) if (L.length > 1) { let x = 0, y = 0, z = 0; for (const i of L) { x += n.getX(i); y += n.getY(i); z += n.getZ(i); } const l = Math.hypot(x, y, z) || 1; for (const i of L) n.setXYZ(i, x / l, y / l, z / l); }
        return g;
      };
      // a soft body from A to B: across it rv (toward `up`) and rw (sideways), each from its A end to its B end; pw < 1 - fuller to its ends
      const blob = (A, B, rv0, rv1, rw0, rw1, up, pw, ws, hs, ease) => {   // (ease > 1: full for longer, narrowing late)
        const g = new SphereGeometry(1, ws || 22, hs || 14), p = g.attributes.position, ax = B.clone().sub(A), len = ax.length(); ax.multiplyScalar(1 / len);
        const w = new Vector3().crossVectors(up, ax).normalize(), v = new Vector3().crossVectors(ax, w).normalize(), P = new Vector3();
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.sqrt(Math.max(0, 1 - y * y)), f = r > 1e-6 ? Math.pow(r, pw) / r : 0, t = (1 - y) / 2;
          const te = ease ? Math.pow(t, ease) : t;
          P.copy(A).addScaledVector(ax, t * len).addScaledVector(w, x * f * (rw0 + (rw1 - rw0) * te)).addScaledVector(v, z * f * (rv0 + (rv1 - rv0) * te));
          p.setXYZ(i, P.x, P.y, P.z);
        }
        g.computeVertexNormals(); return seamless(g);
      };
      const taper = (pts, r0, r1, segs) => {   // a tube along pts narrowing from r0 to r1
        const curve = new CatmullRomCurve3(pts), tube = new TubeGeometry(curve, segs, 1, 8, false), pos = tube.attributes.position;
        for (let i = 0; i < pos.count; i++) { const u = Math.floor(i / 9) / segs, c = curve.getPointAt(Math.min(1, u)), r = r0 + (r1 - r0) * u; pos.setXYZ(i, c.x + (pos.getX(i) - c.x) * r, c.y + (pos.getY(i) - c.y) * r, c.z + (pos.getZ(i) - c.z) * r); }
        tube.computeVertexNormals(); return tube;
      };
      const V3k = (x, y, z) => new Vector3(x, y, z), UPk = V3k(0, 1, 0);
      // the legs: [x (+ his left), the hip's height, z, the upper bone, the lower (to the fetlock), the knee's way (+1 forward: the fore; -1 back:
      // the hind's hock), the step's phase, the upper's radii]
      const OXLEG = [[0.3, 1.74, 1.0, 0.9, 0.8, 1, 0.25, 0.3], [-0.3, 1.74, 1.0, 0.9, 0.8, 1, 0.75, 0.3], [0.3, 1.86, -1.15, 1.0, 0.83, -1, 0.0, 0.38], [-0.3, 1.86, -1.15, 1.0, 0.83, -1, 0.5, 0.38]];
      const OXG = { HOOF: 0.13, STR: 1.1, LIFT: 0.22, DUTY: 0.55, STRIDE: 1.6, FMAX: 2.0, NECK: V3k(0, 2.05, 1.2) };
      const oxBuild = () => {
        const G = new Group(), P = new Group(), HG = new Group(); G.add(P); P.add(HG); BG.add(G); G.visible = false; G.name = "bikkurimOx";
        HG.position.copy(OXG.NECK);
        const hide = new MeshStandardMaterial({ color: 0x74482a, roughness: 0.85 }), dark = new MeshStandardMaterial({ color: 0x2c1c12, roughness: 0.9 });
        const gold = new MeshStandardMaterial({ color: 0xd8b04a, metalness: 0.9, roughness: 0.25 }), olive = new MeshStandardMaterial({ color: 0x5f7a3a, roughness: 0.7 });
        const add = (par, geo, m, at) => { const o = new Mesh(geo, m); if (at) o.position.copy(at); o.castShadow = true; o.userData.noPick = true; par.add(o); return o; };
        const H = (v) => v.clone().sub(OXG.NECK);   // a point of the head's group (its pivot the neck's root)
        // the body: across, at each z - the back's height, the belly's, the half breadth
        { const TOP = [[-1.75, 2.12], [-1.45, 2.38], [-0.9, 2.44], [0, 2.42], [0.6, 2.48], [1.0, 2.6], [1.35, 2.5], [1.65, 2.2]];
          const BOT = [[-1.75, 1.95], [-1.45, 1.58], [-0.9, 1.32], [0, 1.2], [0.8, 1.14], [1.25, 1.26], [1.65, 1.66]];
          const WID = [[-1.75, 0.3], [-1.35, 0.5], [-0.6, 0.6], [0, 0.63], [0.7, 0.57], [1.2, 0.5], [1.65, 0.36]];
          const g = new SphereGeometry(1, 36, 24), p = g.attributes.position;
          for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i), r = Math.sqrt(Math.max(0, 1 - y * y)), f = r > 1e-6 ? Math.pow(r, 0.62) / r : 0, Z = -0.05 + y * 1.7, tp = spl1(TOP, Z), bt = spl1(BOT, Z);
            p.setXYZ(i, -x * f * spl1(WID, Z), (tp + bt) / 2 + z * f * (tp - bt) / 2, Z);
          }
          g.computeVertexNormals(); add(P, seamless(g), hide); }
        // the neck (forward and down 8 degrees), the dewlap under it, the head (its face 59 degrees down, the muzzle at its end)
        add(HG, blob(H(V3k(0, 2.05, 1.2)), H(V3k(0, 1.95, 2.12)), 0.45, 0.3, 0.33, 0.24, UPk, 0.75), hide);
        add(HG, blob(H(V3k(0, 1.55, 1.3)), H(V3k(0, 1.64, 2.05)), 0.27, 0.13, 0.08, 0.07, UPk, 0.7), hide);
        const HA = V3k(0, 2.12, 2.0), HB = V3k(0, 1.42, 2.42), hax = HB.clone().sub(HA).normalize();
        add(HG, blob(H(HA), H(HB), 0.25, 0.16, 0.25, 0.17, UPk, 0.65), hide);
        add(HG, new SphereGeometry(1, 16, 12).scale(0.17, 0.14, 0.15), dark, H(V3k(0, 1.41, 2.45)));
        for (const sd of [1, -1]) {
          add(HG, new SphereGeometry(0.04, 10, 8), dark, H(V3k(sd * 0.215, 1.94, 2.17)));                     // the eyes
          const ear = add(HG, new SphereGeometry(1, 12, 8).scale(0.16, 0.05, 0.085), hide, H(V3k(sd * 0.32, 2.03, 2.05))); ear.rotation.z = -sd * 0.35;
          const horn = add(HG, taper([V3k(0, 0, 0), V3k(0.2, 0.06, 0.02), V3k(0.33, 0.22, 0.07), V3k(0.36, 0.42, 0.14)], 0.055, 0.02, 14), gold, H(V3k(sd * 0.15, 2.16, 2.0)));
          horn.scale.set(sd, 1, 1);
        }
        // the wreath of olive round the head at the horns' roots ("ועטרת של זית בראשו")
        { const C = H(V3k(0, 2.07, 2.03)), q = new Quaternion().setFromUnitVectors(V3k(0, 0, 1), hax), w = V3k(1, 0, 0).applyQuaternion(q), v2 = V3k(0, 1, 0).applyQuaternion(q);
          const wr = add(HG, new TorusGeometry(0.245, 0.04, 8, 28), olive, C); wr.quaternion.copy(q);
          const lg = new SphereGeometry(1, 8, 5).scale(0.03, 0.06, 0.11);
          for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, lf = add(HG, lg, olive, C.clone().addScaledVector(w, Math.cos(a) * 0.255).addScaledVector(v2, Math.sin(a) * 0.255)); lf.quaternion.copy(q); lf.rotateZ(a); lf.rotateX(0.5); } }
        // the tail
        const TL = new Group(); TL.position.set(0, 2.32, -1.68); P.add(TL);
        add(TL, taper([V3k(0, 0, 0), V3k(0, -0.12, -0.18), V3k(0, -0.62, -0.22), V3k(0, -1.22, -0.18)], 0.045, 0.025, 12), hide);
        add(TL, new SphereGeometry(1, 10, 8).scale(0.07, 0.16, 0.07), dark, V3k(0, -1.3, -0.18));
        // the legs: the upper bone, the knee, the lower to the fetlock, the hoof (stands on the floor)
        const legs = OXLEG.map(([x, hy, z, a, b, , , ru]) => {
          // (the upper bone thick with its muscle, narrowing to the knee; the knee as broad as the bones on both sides of it - no ball)
          const up = add(P, blob(V3k(0, 0.22, 0), V3k(0, -a - 0.05, 0), ru, 0.1, ru * 0.7, 0.092, V3k(0, 0, 1), 0.5, 18, 14, 2.4), hide);
          const kn = add(P, new SphereGeometry(1, 14, 10).scale(0.098, 0.1, 0.108), hide);
          const lo = add(P, blob(V3k(0, 0.06, 0), V3k(0, -b - 0.02, 0), 0.094, 0.075, 0.086, 0.07, V3k(0, 0, 1), 0.6, 14, 10), hide);
          const hf = add(P, new CylinderGeometry(0.075, 0.098, OXG.HOOF + 0.01, 12).translate(0, (OXG.HOOF + 0.01) / 2, 0), dark);
          return { x, hy, z, a, b, up, kn, lo, hf, hip: V3k(x, hy, z), K: new Vector3(), F: new Vector3(), short: 0, gy: 0, lift: 0, foot: new Vector3() };
        });
        return { G, P, HG, TL, legs, visible: false };
      };
      // ---- its way: A - up the ramp before them (straight, x -0.4; two and a half seconds before them), in through the gate, hidden at z 329;
      // C - from then, one smooth way from the women's court's gate to its place, through the middle of the duchan's opening (the Levites
      // stand at its two sides); its pace by the floor. The floor along each way: every amah, and where it changes every fifth of one; each
      // step's edge found to a hundredth (four halvings); between them a straight line (the ramp)
      const OXA = { x: -0.4, z0: 357.8, v: 5.58, zh: 329, zs: 366 };
      const OXC = { pts: [[226, 1], [200, 1], [118.5, 1], [106, 1], [97.5, 1], [91, 0.6], [86, 0.3], [81.5, 0.2], [77, -4], [72, -11], [66, -19]] };
      const oxGround = (x, z) => { const y = fnc2(SH.floorY) ? SH.floorY(x, 20.5, z) : -Infinity; return isFinite(y) ? y : hAt(x, z, 21); };
      const oxProf = (Pf, L) => {
        const N = Math.ceil(L), H1 = [], K2 = [];
        for (let i = 0; i <= N; i++) { const [x, z] = Pf(Math.min(L, i)); H1.push(oxGround(x, z)); }
        for (let i = 0; i < N; i++) {
          const a = i, b2 = Math.min(L, i + 1);
          K2.push([a, H1[i]]);
          if (Math.abs(H1[i + 1] - H1[i]) < 0.03) continue;
          let sP = a, hP = H1[i];
          for (let j = 1; j <= 5; j++) {
            const s0 = Math.min(b2, a + j * 0.2), [x, z] = Pf(s0), h = j === 5 ? H1[i + 1] : oxGround(x, z);
            if (Math.abs(h - hP) > 0.3) { let lo = sP, hi = s0; for (let k = 0; k < 4; k++) { const m = (lo + hi) / 2, [mx, mz] = Pf(m), hm = oxGround(mx, mz); if (Math.abs(hm - hP) < Math.abs(hm - h)) lo = m; else hi = m; } const e = (lo + hi) / 2; K2.push([e - 1e-4, hP], [e + 1e-4, h]); }
            else if (j < 5) K2.push([s0, h]);
            sP = s0; hP = h;
          }
        }
        K2.push([L, H1[N]]);
        const hAtS = (s0) => { if (s0 <= K2[0][0]) return K2[0][1]; if (s0 >= K2[K2.length - 1][0]) return K2[K2.length - 1][1]; let a = 0, b2 = K2.length - 1; while (b2 - a > 1) { const m = (a + b2) >> 1; if (K2[m][0] <= s0) a = m; else b2 = m; } const [s1, h1] = K2[a], [s2, h2] = K2[b2]; return h1 + (h2 - h1) * (s0 - s1) / Math.max(1e-9, s2 - s1); };
        const ds = 0.05, n = Math.ceil(L / ds), cum = new Float64Array(n + 1);
        for (let i = 1; i <= n; i++) cum[i] = cum[i - 1] + hAtS((i - 0.5) * ds) * ds;
        const C = (s0) => { if (s0 <= 0) return hAtS(0) * s0; if (s0 >= n * ds) return cum[n] + hAtS(L) * (s0 - n * ds); const i = Math.floor(s0 / ds), f = s0 / ds - i; return cum[i] + (cum[i + 1] - cum[i]) * f; };
        const edges = []; for (let i = 1; i < K2.length; i++) if (K2[i][0] - K2[i - 1][0] < 3e-4 && Math.abs(K2[i][1] - K2[i - 1][1]) > 0.2) edges.push((K2[i][0] + K2[i - 1][0]) / 2);
        // a hoof is not set within 0.12 of a step's edge: the shift that keeps it off (to the side it is on)
        const off = (s0) => { for (const e of edges) { const d = s0 - e; if (Math.abs(d) < 0.12) return (d >= 0 ? 0.12 : -0.12) - d; } return 0; };
        return { hAtS, gS: (s0) => (C(s0 + 0.7) - C(s0 - 0.7)) / 1.4, knots: K2, edges, off };
      };
      const oxTables = () => {
        if (OXC.tab) return OXC.tab;
        const was = BG.visible; BG.visible = false;
        // A: s from z 366 along -z
        const LA = OXA.zs - OXA.zh + 3, PA = oxProf((s0) => [OXA.x, OXA.zs - s0], LA);
        // C: the smooth way
        const curve = new CatmullRomCurve3(OXC.pts.map(([x, z]) => new Vector3(x, 0, z)), false, "centripetal"), L = curve.getLength(), ds = 0.1, n = Math.ceil(L / ds);
        const X = new Float64Array(n + 1), Z = new Float64Array(n + 1);
        curve.getSpacedPoints(n).forEach((q, i) => { X[i] = q.x; Z[i] = q.z; });
        const PtC = (s0) => { const f = clamp2(s0 / ds, 0, n), i = Math.min(n - 1, Math.floor(f)), u = f - i; return [X[i] + (X[i + 1] - X[i]) * u, Z[i] + (Z[i + 1] - Z[i]) * u]; };
        const PC = oxProf(PtC, L);
        BG.visible = was;
        // the pace: on the flat of the women's court 22 amot a second (the demonstration's own hurried pace: the people go at 29), on every
        // flight of steps 4.5 (a hoof on each step, not sliding), from the fifteen steps through the Nikanor gate to the duchan 15, in the
        // priests' court 7, slowing to its place; never faster or slower by more than 30 amot a second in each second (no leap in the pace)
        const vRaw = new Float64Array(n + 1);
        let top15 = -1;
        for (const e of PC.edges) if (PC.hAtS(e + 0.01) > 13.2 && PC.hAtS(e + 0.01) < 13.8 && top15 < 0) top15 = e;
        if (top15 < 0) top15 = L - 60;
        for (let i = 0; i <= n; i++) {
          const s0 = i * ds;
          let v = s0 < top15 ? 22 : X[i] > 84 ? 15 : 7, stp = false;
          for (const e of PC.edges) if (Math.abs(e - s0) < 1.2) stp = true;
          if (stp) v = 4.5;
          if (s0 < 0.01) v = 6;
          if (L - s0 < 0.01) v = 0;
          vRaw[i] = v;
        }
        const V = Float64Array.from(vRaw), A2 = 2 * 30 * ds;
        for (let i = 1; i <= n; i++) V[i] = Math.min(V[i], Math.sqrt(V[i - 1] * V[i - 1] + A2));
        for (let i = n - 1; i >= 0; i--) V[i] = Math.min(V[i], Math.sqrt(V[i + 1] * V[i + 1] + A2));
        for (let i = 0; i <= n; i++) V[i] = Math.max(V[i], 0.25);
        const tA = (OXA.z0 - OXA.zh) / OXA.v, Tm = new Float64Array(n + 1); Tm[0] = tA + 0.08; for (let i = 1; i <= n; i++) Tm[i] = Tm[i - 1] + ds * 2 / (V[i] + V[i - 1]);
        // the step's phase through the whole demonstration (dφ/dt - the pace over the stride, at most FMAX) and its breadth (eased)
        const PH = [], AMP = [], STRd = [], dt = 1 / 120;
        let ph = 0, amp = 1;   // (it is walking already at the start)
        const vAt = (t) => { if (t < tA) return OXA.v; if (t < Tm[0] || t >= Tm[n]) return 0; let a = 0, b2 = n; while (b2 - a > 1) { const m = (a + b2) >> 1; if (Tm[m] <= t) a = m; else b2 = m; } return V[a]; };
        // (the step's breadth: so that a hoof on the floor stays where it came down - the pace times the time on the floor - at most 0.9 on
        // the flat and 0.6 on steps of 45 degrees; on a slope shorter and quicker steps - up to 4 a second on the steps)
        const slAt = (t) => { let P2 = PA, s0; if (t < tA) s0 = OXA.zs - (OXA.z0 - OXA.v * t); else if (t < Tm[0]) return 0; else { P2 = PC; let a = 0, b2 = n; if (t >= Tm[n]) a = n; else while (b2 - a > 1) { const m = (a + b2) >> 1; if (Tm[m] <= t) a = m; else b2 = m; } s0 = a * ds; } return Math.abs(Math.sin(Math.atan2(P2.gS(s0 + 1.0) - P2.gS(s0 - 1.15), 2.15))) / 0.7071; };
        for (let t = 0; t <= 80; t += dt) { const v = vAt(t), sl = Math.min(1, slAt(t)), f = Math.min(v / OXG.STRIDE, OXG.FMAX + 2 * sl); PH.push(ph); AMP.push(amp); STRd.push(amp * clamp2(f > 1e-3 ? v * OXG.DUTY / f : OXG.STR, 0, 0.9 - 0.3 * sl)); ph += f * dt; amp += clamp2(clamp2(v / 1.2, 0, 1) - amp, -dt / 0.6, dt / 0.6); }
        return (OXC.tab = { curve, L, n, ds, X, Z, V, Tm, PA, PC, PH, AMP, STRd, vAt, tA, top15 });
      };
      const fnc2 = (f) => typeof f === "function";
      const _ox = { q: new Quaternion(), q2: new Quaternion(), v: new Vector3(), v2: new Vector3(), m: new Matrix4(), Y: new Vector3(0, 1, 0), D: new Vector3(0, -1, 0) };
      // the ox's state at t: its way (A, C or hidden), how far along it (s), how fast; each way's point and heading at s
      const oxWay = (tb, w) => w === "A" ? { P: tb.PA, pt: (s0) => [OXA.x, OXA.zs - s0], yaw: () => Math.PI }
        : { P: tb.PC, pt: (s0) => { const f = s0 / tb.ds, i = Math.max(0, Math.min(tb.n - 1, Math.floor(f))), u = f - i; return [tb.X[i] + (tb.X[i + 1] - tb.X[i]) * u, tb.Z[i] + (tb.Z[i + 1] - tb.Z[i]) * u]; },   // (beyond its ends - straight on)
          yaw: (s0) => { const a = Math.max(0, Math.min(tb.n - 8, Math.round(s0 / tb.ds) - 4)); return Math.atan2(tb.X[a + 8] - tb.X[a], tb.Z[a + 8] - tb.Z[a]); } };
      const oxS = (t) => {
        const tb = oxTables();
        if (t < tb.tA) return { w: "A", s: OXA.zs - (OXA.z0 - OXA.v * Math.max(0, t)), v: OXA.v };
        if (t < tb.Tm[0]) return { w: null };
        let a = 0, b2 = tb.n; const n = tb.n;
        if (t >= tb.Tm[n]) return { w: "C", s: n * tb.ds, v: 0 };
        while (b2 - a > 1) { const m = (a + b2) >> 1; if (tb.Tm[m] <= t) a = m; else b2 = m; }
        const f = clamp2((t - tb.Tm[a]) / (tb.Tm[a + 1] - tb.Tm[a]), 0, 1);
        return { w: "C", s: (a + f) * tb.ds, v: tb.V[a] + (tb.V[a + 1] - tb.V[a]) * f };
      };
      const phInv = (tb, val) => { const P = tb.PH; let a = 0, b2 = P.length - 1; if (val <= P[0]) return 0; if (val >= P[b2]) return b2 / 120; while (b2 - a > 1) { const m = (a + b2) >> 1; if (P[m] < val) a = m; else b2 = m; } return (a + clamp2((val - P[a]) / Math.max(1e-9, P[b2] - P[a]), 0, 1)) / 120; };
      const oxPose = (o, t) => {
        const tb = oxTables(), S2 = oxS(t);
        o.G.visible = !!S2.w && t < T.end + 5; o.visible = o.G.visible;
        if (!o.G.visible) return;
        const W2 = oxWay(tb, S2.w), Pr = W2.P, [cx, cz] = W2.pt(S2.s), yaw = W2.yaw(S2.s);
        const ti = Math.min(tb.PH.length - 1, Math.max(0, Math.floor(t * 120))), ph = tb.PH[ti] || 0, k = tb.AMP[ti] || 0;
        // the body: on the floor averaged under its fore and hind hooves, pitched with it, and as much lower as the slope asks (its legs stay
        // upright: on a slope the hips stand higher over the floor by 1/cos - so the body comes down by that, and by half the step's rise and
        // a little for the steps' noses, so the hind hoof reaches back down the slope); each hoof's place under its hip
        const gF = Pr.gS(S2.s + 1.0), gH = Pr.gS(S2.s - 1.15), th = Math.atan2(gF - gH, 2.15), cT = Math.cos(th), sT = Math.sin(th), A0 = tb.STRd[Math.min(tb.STRd.length - 1, Math.max(0, Math.floor(t * 120)))] || 0;
        const sl3 = (d2) => Math.atan(Math.abs(Pr.gS(S2.s + d2 + 0.3) - Pr.gS(S2.s + d2 - 0.3)) / 0.6), thd = Math.max(Math.abs(th), sl3(-1.15), sl3(1.0)), cD = Math.cos(thd), sD = Math.sin(thd);
        let yC = (gF * 1.15 + gH * 1.0) / 2.15 - 1.8 * (1 / cD - 1) - 0.5 * A0 * sD / cD - 0.25 * sD / 0.7071;
        yC += (1 - k) * 0.075;   // (standing, its legs almost straight)
        // but never so low that its belly, chest or rump comes within a tenth of an amah of the floor under it (the steps' foot and top)
        for (const [by, bz] of [[1.25, -0.8], [1.2, 0], [1.18, 0.8], [1.3, 1.3], [1.95, -1.75], [1.6, -1.5]]) {
          const yy = yC + by * cT + bz * sT, aa = S2.s + bz * cT - by * sT; let fl2 = -1e9; for (let q = -0.2; q <= 0.2; q += 0.1) fl2 = Math.max(fl2, Pr.hAtS(aa + q));
          if (yy < fl2 + 0.1) yC += fl2 + 0.1 - yy;
        }
        o.G.position.set(cx, yC, cz); o.G.rotation.set(0, yaw, 0); o.P.rotation.x = -th; o.HG.rotation.x = th - Math.max(0.85 * th, 0.55 * Math.atan2(Pr.gS(S2.s + 3.0) - Pr.gS(S2.s + 0.5), 2.5), 0);   // (the head level on the flat; on a slope raised with the body, all but a little - the body comes down to the slope, and the muzzle must be clear of the steps before it; before a slope raised by half of it)
        o.TL.rotation.z = 0.12 * Math.sin(t * 2.3); o.TL.rotation.x = 0.1 * k;
        o.G.updateMatrixWorld(true);
        // and higher yet if its muzzle would come within a quarter amah of the floor before it (the steps' foot)
        for (let it = 0; it < 16; it++) {
          const mz = o.HG.localToWorld(_ox.v.set(0, 1.41 - 2.05 - 0.16, 2.45 - 1.2)), dz2 = (mz.x - cx) * Math.sin(yaw) + (mz.z - cz) * Math.cos(yaw);
          let fl2 = -1e9; for (let q = -0.3; q <= 0.45; q += 0.15) fl2 = Math.max(fl2, Pr.hAtS(S2.s + dz2 + q));
          if (mz.y >= fl2 + 0.22) break;
          o.HG.rotation.x -= 0.05; o.HG.updateMatrixWorld(true);
        }
        const qInv = _ox.q.copy(o.P.getWorldQuaternion(_ox.q2)).invert();
        // a hoof's place along the way at a time in its own step (the step's breadth there), kept off the steps' edges: on the floor where it
        // came down (its height the floor's there); in the air from where it rose to where it comes down, over the edge between them
        const At = (tt) => tb.STRd[Math.min(tb.STRd.length - 1, Math.max(0, Math.floor(tt * 120)))] || 0;
        const dlOf = (u0) => u0 < OXG.DUTY ? 0.5 - u0 / OXG.DUTY : -0.5 + sm2((u0 - OXG.DUTY) / (1 - OXG.DUTY));
        const at3 = (L, ph3, end) => { const tl = phInv(tb, ph3), S3 = oxS(tl); if (S3.w !== S2.w) return null; const th3 = Math.atan2(Pr.gS(S3.s + 1.0) - Pr.gS(S3.s - 1.15), 2.15), raw = S3.s + L.z * Math.cos(th3) - L.hy * Math.sin(th3) + (end ? -0.5 : 0.5) * At(tl); return { raw, at: raw + Pr.off(raw) }; };
        OXLEG.forEach((LG, i) => {
          const L = o.legs[i], Ph = ph + LG[6], c = Math.floor(Ph), u0 = Ph - c, Lz = L.z * cT - L.hy * sT, raw = S2.s + Lz + dlOf(u0) * A0, own = { raw, at: raw + Pr.off(raw) };
          const l0 = at3(L, c - LG[6], false) || own;
          let sh, gy, lift = 0;
          if (u0 < OXG.DUTY) { sh = raw + (l0.at - l0.raw); for (const e of Pr.edges) if (Math.abs(e - l0.at) < 2) { const sd = l0.at >= e ? 1 : -1; if (sd * (sh - e) < 0.12) sh = e + sd * 0.12; } gy = Pr.hAtS(sh); }   // (it does not slide over a step's edge)
          else {
            const u = (u0 - OXG.DUTY) / (1 - OXG.DUTY), e = sm2(u), k0 = at3(L, c + OXG.DUTY - LG[6], true) || own, l1 = at3(L, c + 1 - LG[6], false) || own;
            sh = raw + (l0.at - l0.raw) * (1 - e) + (l1.at - l1.raw) * e;
            const a0 = k0.raw + (l0.at - l0.raw), h0 = Pr.hAtS(a0), h1 = Pr.hAtS(l1.at), dh = h1 - h0, stp = Pr.edges.some((e) => (e - a0) * (e - l1.at) < 0);
            // over a step's edge: up early or down late, lifted the more; on the flat or a smooth slope: along it
            gy = stp ? h0 + dh * (dh > 0 ? sm2(Math.min(1, u * 1.7)) : sm2(Math.max(0, (u - 0.4) / 0.6))) : Pr.hAtS(sh);
            lift = (OXG.LIFT * Math.min(1, A0 / 0.8) + (stp ? 0.25 * Math.abs(dh) : 0)) * Math.sin(Math.PI * u) * (stp ? 1 : Math.min(1, A0 / 0.3));
          }
          let [px, pz] = W2.pt(sh), yw = W2.yaw(sh), wx = px + Math.cos(yw) * L.x, wz = pz - Math.sin(yw) * L.x;
          // where the leg cannot reach (the step's end on a change of slope), the hoof is drawn in toward under the hip along the floor
          const reach = (x, y, z) => o.P.worldToLocal(_ox.v.set(x, y + OXG.HOOF, z)).distanceTo(L.hip) <= L.a + L.b - 0.002;
          if (!reach(wx, gy + lift, wz)) {
            const s1 = S2.s + Lz; let lo = 0, hi = 1;
            for (let it = 0; it < 7; it++) { const m = (lo + hi) / 2, s3 = sh + (s1 - sh) * m, [qx, qz] = W2.pt(s3), y3 = Pr.hAtS(s3 + Pr.off(s3)); if (reach(qx + Math.cos(yw) * L.x, y3 + lift, qz - Math.sin(yw) * L.x)) hi = m; else lo = m; }
            sh = sh + (s1 - sh) * hi; sh += Pr.off(sh); [px, pz] = W2.pt(sh); wx = px + Math.cos(yw) * L.x; wz = pz - Math.sin(yw) * L.x; if (lift < 0.01 || !Pr.edges.length) gy = Pr.hAtS(sh);
          }
          L.gy = gy; L.lift = lift; L.foot.set(wx, gy + lift, wz); L.sh = sh;
          // two bones from the hip to the fetlock over the hoof, the knee forward (the fore) or back (the hind's hock)
          const T3 = o.P.worldToLocal(_ox.v.set(wx, gy + lift + OXG.HOOF, wz)), d3 = _ox.v2.subVectors(T3, L.hip), D0 = d3.length() || 1e-6;
          d3.multiplyScalar(1 / D0);
          const Dc = Math.min(D0, L.a + L.b - 1e-4), ca = clamp2((L.a * L.a + Dc * Dc - L.b * L.b) / (2 * L.a * Dc), -1, 1), pole = new Vector3(0, 0.5, LG[5]).addScaledVector(d3, -(0.5 * d3.y + LG[5] * d3.z)).normalize();   // (bent much, the knee comes up - not down onto the step)
          L.K.copy(L.hip).addScaledVector(d3, L.a * ca).addScaledVector(pole, L.a * Math.sqrt(Math.max(0, 1 - ca * ca)));
          L.F.copy(L.hip).addScaledVector(d3, Dc); L.short = D0 - Dc;
          L.up.position.copy(L.hip); L.up.quaternion.setFromUnitVectors(_ox.D, _ox.v.subVectors(L.K, L.hip).normalize());
          L.kn.position.copy(L.K);
          L.lo.position.copy(L.K); L.lo.quaternion.setFromUnitVectors(_ox.D, _ox.v.subVectors(L.F, L.K).normalize());
          L.hf.quaternion.copy(qInv).multiply(_ox.q2.setFromAxisAngle(_ox.Y, yw));
          L.hf.position.copy(o.P.worldToLocal(_ox.v.set(wx, gy + lift, wz)));
        });
      };
      // OX_K end
      // ===== HANDS_K (fix-k, 23.11.2026 - the user via the coordinator: "ידי הכהן מתחת ידי הבעלים, ושניהם מתחת לסל"; Bikkurim 3:6, 50:31:
      // "מוריד הסל מעל כתפו ואוחזו בשפתותיו, וכהן מניח ידו תחתיו ומניפו"; Menachot 61b, 131:2146: "כהן מניח ידו תחת ידי בעלים ומניף"):
      // THE WAVING WITH REAL HANDS. The bringer and the priest are the kit's figures (SH.priestKit: the robe, the face, hand.js's hands),
      // their arms solved every frame (shoulder, elbow, wrist - two bones) to where the hands must be: the bringer's palms up under the
      // basket's rim on its two sides (the rim a rolled lip), the priest's palms up under the bringer's hands, touching them; the basket,
      // his hands and the priest's move together, as one. Found once (kHold), from the hands' own vertices: the basket's height on his palms
      // and the priest's hands' height under his - no gap and nothing in another. Until now the basket was moved before a figure whose hands
      // stood fixed before its chest, the priest a step away. How far apart they stand and the hands' slant - model choices.
      const KK = SH.priestKit;
      const KF = KK && KK.handWr ? (() => {
        const FS = KK.FS, sc = (q, s) => q.scale(s, s, s), W1 = (q) => KK.white(q);
        return { FS, up: KK.UP * FS, fo: KK.FORE * FS, sx: KK.SH_X * FS, sy: KK.SH_Y * FS,
          upG: sc(mergeGeometries([W1(KK.sph(0.07, 0.07, 0.07, 14, 10)), W1(KK.at(new CylinderGeometry(0.07, 0.058, KK.UP, 14), 0, -KK.UP / 2, 0)), W1(KK.at(KK.sph(0.058, 0.058, 0.058, 12, 8), 0, -KK.UP, 0))]), FS),
          foG: sc(W1(KK.at(new CylinderGeometry(0.056, 0.046, KK.FORE, 14), 0, -KK.FORE / 2, 0)), FS),
          footG: { 1: sc(KK.footGeo(1).translate(-0.1, 0, 0), FS), "-1": sc(KK.footGeo(-1).translate(0.1, 0, 0), FS) },
          neckG: KK.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0),
          // the Israelite's kippah (as tm_people's, in more faces)
          kipG: W1(KK.at(KK.rot(KK.sph(KK.HR[0] * 1.09, KK.HR[1] * 1.09, KK.HR[2] * 1.09, 28, 7, 0, Math.PI * 2, 0, 0.99), -0.14), 0, KK.HEAD_Y + 0.002, -0.004)),
          kipM: new MeshStandardMaterial({ color: 0x1c1c22, roughness: 0.9 }) };
      })() : null;
      const DOWNk = new Vector3(0, -1, 0);
      // an arm of the kit (the sleeve to the elbow, the forearm, the hand at the wrist) in the figure's frame `lean`; armTo puts its wrist at
      // W with the hand turned by q (both in that frame; q null - the hand along the forearm, as it hangs), the elbow toward `pole`
      const kArm = (lean, sd, m) => {
        const up = new Mesh(KF.upG, m), fo = new Mesh(KF.foG, m), hd = new Mesh(KK.handWr(sd, "rest"), KK.mHand);
        for (const o of [up, fo, hd]) { o.castShadow = true; o.userData.noPick = true; lean.add(o); }
        const S0 = new Vector3(sd * KF.sx, KF.sy, 0); up.position.copy(S0);
        return { sd, S0, up, fo, hd, pose: "rest", E: new Vector3(), W: new Vector3(), short: 0 };
      };
      const _ka = new Vector3(), _kn = new Vector3(), _kw = new Vector3();
      const armTo = (A, W, q, pose, pole) => {
        if (pose && A.pose !== pose) { A.hd.geometry = KK.handWr(A.sd, pose); A.pose = pose; }
        const a = KF.up, b = KF.fo;
        _ka.subVectors(W, A.S0); const D = _ka.length() || 1e-6; _ka.multiplyScalar(1 / D);
        const Dc = Math.min(D, a + b - 1e-4), ca = clamp2((a * a + Dc * Dc - b * b) / (2 * a * Dc), -1, 1);
        _kn.copy(pole).addScaledVector(_ka, -pole.dot(_ka)).normalize();
        A.E.copy(A.S0).addScaledVector(_ka, a * ca).addScaledVector(_kn, a * Math.sqrt(Math.max(0, 1 - ca * ca)));
        A.W.copy(A.S0).addScaledVector(_ka, Dc);
        A.short = D - Dc;   // (> 0: the wrist could not reach W)
        A.up.quaternion.setFromUnitVectors(DOWNk, _kw.subVectors(A.E, A.S0).normalize());
        A.fo.position.copy(A.E);
        A.fo.quaternion.setFromUnitVectors(DOWNk, _kw.subVectors(A.W, A.E).normalize());
        A.hd.position.copy(A.W);
        if (q) A.hd.quaternion.copy(q); else A.hd.quaternion.copy(A.fo.quaternion);
      };
      const POLE_HANG = { 1: new Vector3(0.25, 0, -1).normalize(), "-1": new Vector3(-0.25, 0, -1).normalize() };
      const POLE_HOLD = { 1: new Vector3(0.45, -1, -0.25).normalize(), "-1": new Vector3(-0.45, -1, -0.25).normalize() };
      const hangW = (A) => A.S0.clone().add(new Vector3(A.sd * 0.07, -(KF.up + KF.fo) * 0.985, 0.1));
      // the hand turned so that its fingers go along F and its palm looks toward N (handWr's frame: the fingers down, the palm toward
      // (-sd sin 0.95, 0, -cos 0.95) - priest-kit.js handRaw)
      const handQ = (sd, F, N) => {
        const Fh = new Vector3(0, -1, 0), Nh = new Vector3(-sd * Math.sin(0.95), 0, -Math.cos(0.95)), Bh = new Vector3().crossVectors(Fh, Nh);
        const Fn = F.clone().normalize(), Nt = N.clone().addScaledVector(Fn, -N.dot(Fn)).normalize(), Bt = new Vector3().crossVectors(Fn, Nt);
        return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(Fn, Nt, Bt).multiply(new Matrix4().makeBasis(Fh, Nh, Bh).transpose()));
      };
      // a figure of the kit: kind "kohen" (his four garments, the head's tefillin) or an Israelite in his robe's colour, with a kippah
      const kFig = (kind, robe, n, name) => {
        const g = new Group(), lean = new Group(), S = new Group(); g.add(lean); S.scale.setScalar(KF.FS); lean.add(S); BG.add(g); g.visible = false; g.name = name || "";
        const add = (par, geo, m) => { const o = new Mesh(geo, m); o.castShadow = true; o.userData.noPick = true; par.add(o); return o; };
        const priest = kind === "kohen", robeM = priest ? KK.mRobe : new MeshStandardMaterial({ color: robe, vertexColors: true, roughness: 0.92 });
        add(S, KK.gRobeBody, robeM);
        add(S, KF.neckG, KK.mSkin);
        const hg = KK.headOn(S, KK.HEAD_Y, KK.mBeards[n % KK.mBeards.length], n);
        hg.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        if (priest) { add(S, KK.gSash, (SH.tamid && SH.tamid.belt === "white") ? KK.mSashWhite : KK.mSashDyed); add(S, KK.gHat, KK.mHat).position.y = KK.HAT_Y; if (KK.tefOn) KK.tefOn(hg); }
        else add(S, KF.kipG, KF.kipM);
        const fl = add(g, KF.footG[1], KK.mSkin), fr = add(g, KF.footG[-1], KK.mSkin); fl.position.x = 0.1 * KF.FS; fr.position.x = -0.1 * KF.FS;
        const F = { G: g, L: lean, arms: { 1: kArm(lean, 1, robeM), "-1": kArm(lean, -1, robeM) } };
        for (const sd of [1, -1]) armTo(F.arms[sd], hangW(F.arms[sd]), null, "rest", POLE_HANG[sd]);
        return F;
      };
      // the basket's rim: a rolled lip round its mouth (LIP: its circle's radius and height, the roll's radius - in the basket's frame; the
      // roll a little thinner than the closed hand's ring, hand.js "grip": 0.028 amah - the fingers on it, the palm's pads not in it)
      const LIP = { R: 0.385, y: 0.335, r: 0.026 };
      const WALLk = [[0.22, 0], [0.3, 0.12], [0.34, 0.3], [0.36, 0.34]];
      const wallR = (y) => { for (let i = 1; i < WALLk.length; i++) if (y <= WALLk[i][1]) { const [r0, y0] = WALLk[i - 1], [r1, y1] = WALLk[i]; return r0 + (r1 - r0) * (y - y0) / (y1 - y0); } return WALLk[WALLk.length - 1][0]; };
      // THE TWO WAYS OF THE WAVING (the user's decision 207: a switch, the default a): a - the Bartenura and R. Shimshon of Sens: the basket
      // lies on the priest's hands - his two palms up under its bottom - and the bringer holds it by its rim from above; b - the Gemara's plain
      // sense: the priest's hands under the bringer's, both at the rim - the bringer's palms up under the rim, the priest's palms up close
      // under his. Each found once (kHoldOf) in the bringer's frame (his feet at 0, his face to +z): B0 - the basket's foot; WO / qO / pO -
      // the bringer's wrists, hands' turns and poses; WP / qP - the priest's (his hand -sd under the bringer's sd in b). d - the priest's
      // distance before him; zb - the basket's middle before him. How far apart, how high, the hands' slant - model choices.
      const KW = { way: "a", t0: -1e9, from: "a" };
      const KHs = {};
      const vsK = (geo, q, W) => { const p = geo.attributes.position, nn = geo.attributes.normal, P = [], N = []; for (let i = 0; i < p.count; i++) { P.push(new Vector3(p.getX(i), p.getY(i), p.getZ(i)).applyQuaternion(q).add(W)); N.push(new Vector3(nn.getX(i), nn.getY(i), nn.getZ(i)).applyQuaternion(q)); } return { P, N }; };
      // the least signed distance of points A from the surface of points B (the nearest vertex's plane; B hashed in cells of 0.02)
      const sdistK = (A, B) => { const hs = new Map(), key = (x, y, z) => x + "," + y + "," + z;
        B.P.forEach((v, i) => { const k = key(Math.floor(v.x / 0.02), Math.floor(v.y / 0.02), Math.floor(v.z / 0.02)); if (!hs.has(k)) hs.set(k, []); hs.get(k).push(i); });
        let mn = 1e9; for (const p of A.P) { const cx = Math.floor(p.x / 0.02), cy = Math.floor(p.y / 0.02), cz = Math.floor(p.z / 0.02); let best = 1e9, bi = -1;
          for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) { const L2 = hs.get(key(cx + i, cy + j, cz + k)); if (L2) for (const q of L2) { const d2 = p.distanceToSquared(B.P[q]); if (d2 < best) { best = d2; bi = q; } } }
          if (bi >= 0) { const s0 = _kw.subVectors(p, B.P[bi]).dot(B.N[bi]); if (s0 < mn) mn = s0; } } return mn; };
      const kHoldOf = (way) => {
        if (KHs[way]) return KHs[way];
        // (the basket's middle 0.78 before him and the priest 1.56: as it is waved toward either of them - 0.12 - it comes no nearer than
        // three hundredths of an amah to his body)
        const H = { way, d: 1.56, zb: 0.78, WO: {}, qO: {}, pO: {}, WP: {}, qP: {}, pP: { 1: "flat", "-1": "flat" }, ok: true, chk: {} };
        if (way === "b") {
          // b: the bringer's palms up (a little toward the basket) under the rim on its two sides, the priest's under his, along them, his
          // fingers toward him; the basket as low as its lip may lie on the bringer's palms; the priest's hands as high as they may be
          const yw = 2.0, a = 0.06, b2 = 0.14;
          const Fo = (sd) => new Vector3(-sd * Math.sin(a), 0, Math.cos(a)), Nup = (sd) => new Vector3(-sd * Math.sin(b2), Math.cos(b2), 0);
          for (const sd of [1, -1]) { H.qO[sd] = handQ(sd, Fo(sd), Nup(sd)); H.qP[-sd] = handQ(-sd, Fo(sd).negate(), Nup(sd)); H.pO[sd] = "flat"; }
          const g = (sd) => KK.handWr(sd, "flat"), h0 = vsK(g(1), H.qO[1], new Vector3()), cO = h0.P.reduce((q, v) => q.add(v), new Vector3()).multiplyScalar(1 / h0.P.length);
          const Lh = Math.max(...h0.P.map((v) => v.dot(Fo(1))));
          const zw = H.zb - cO.z;
          let ok = false, yb = 0;
          for (let xw = 0.3; xw < 0.6 && !ok; xw += 0.002) {
            let ybx = -1e9, sup = 0; const HS = {};
            for (const sd of [1, -1]) { H.WO[sd] = new Vector3(sd * xw, yw, zw); HS[sd] = vsK(g(sd), H.qO[sd], H.WO[sd]); }
            for (const sd of [1, -1]) for (const v of HS[sd].P) { const rho = Math.hypot(v.x, v.z - H.zb), e = rho - LIP.R; if (Math.abs(e) < LIP.r) { ybx = Math.max(ybx, v.y - LIP.y + Math.sqrt(LIP.r * LIP.r - e * e)); sup++; } }
            if (!sup) continue;
            ybx -= 0.0008;
            let bad = 0;
            for (const sd of [1, -1]) for (const v of HS[sd].P) { const rho = Math.hypot(v.x, v.z - H.zb), y = v.y - ybx; if (y > -0.01 && y < LIP.y + 0.06 && rho < (y < 0 ? 0 : y > 0.34 ? 0.37 : wallR(y)) + 0.004) bad++; }
            if (!bad) { ok = true; yb = ybx; }
          }
          H.ok = ok; H.B0 = new Vector3(0, yb, H.zb);
          for (const sd of [1, -1]) {
            const F = Fo(sd), lat = new Vector3(F.z, 0, -F.x), HO = vsK(g(sd), H.qO[sd], H.WO[sd]);
            const W = H.WO[sd].clone().addScaledVector(F, Lh + 0.03); W.y = yw - 0.06;
            const hp0 = vsK(g(-sd), H.qP[-sd], new Vector3()), cP = hp0.P.reduce((q, v) => q.add(v), new Vector3()).multiplyScalar(1 / hp0.P.length);
            const cOw = H.WO[sd].clone().add(sd > 0 ? cO : new Vector3(-cO.x, cO.y, cO.z));
            W.addScaledVector(lat, cOw.clone().sub(W.clone().add(cP)).dot(lat));
            for (let it = 0; it < 40; it++) { const s0 = sdistK(vsK(g(-sd), H.qP[-sd], W), HO); if (s0 > 1e8) { W.y += 0.01; continue; } if (Math.abs(s0 + 0.0008) < 0.0003) break; W.y += s0 + 0.0008; }
            H.WP[-sd] = W;
          }
        } else {
          // a: the priest's two palms up side by side under the basket's bottom, his fingers toward the bringer (under the half of the bottom
          // nearer him - his arms reach so); the basket set down on them (the highest point of his palms under the bottom touches it); the
          // bringer's hands closed round the rim from above (hand.js "grip": the ring of the closed fingers round the rim's roll), each at 55
          // degrees from the side nearer him, his wrist over and out from the rim (65 degrees from the upright), the fingers without
          const ybT = 2.02, xP = 0.072, zP = H.zb + 0.11;
          // (the palms' slant along the hand chosen so that most of each palm lies against the flat bottom - not only the heel of the hand)
          let top = -1e9, bestN = -1;
          for (let al = -0.16; al <= 0.161; al += 0.02) {
            const qq = {}, WW = {}, HH = {}; let tp = -1e9;
            for (const sp of [1, -1]) {
              qq[sp] = handQ(sp, new Vector3(0, Math.sin(al), -Math.cos(al)), new Vector3(0, Math.cos(al), Math.sin(al)));
              // (the palm's middle - half way from the wrist to the middle finger's knuckle - at (-sp xP, zP): the palm under the flat bottom)
              const c0 = tm_hand({ sd: sp, pose: "flat" }).sk.fingers[1].j[0].clone().applyAxisAngle(new Vector3(0, 1, 0), sp * 0.95).multiplyScalar(KF.FS * 0.5).applyQuaternion(qq[sp]);
              WW[sp] = new Vector3(-sp * xP - c0.x, 0, zP - c0.z);
              HH[sp] = vsK(KK.handWr(sp, "flat"), qq[sp], WW[sp]);
              for (const v of HH[sp].P) { const rho = Math.hypot(v.x, v.z - H.zb); if (rho < 0.22) tp = Math.max(tp, v.y); else if (rho < 0.3) tp = Math.max(tp, v.y - (rho - 0.22) / 0.08 * 0.12); }   // (under the bottom, and under the wall where it widens)
            }
            let nC = 0; for (const sp of [1, -1]) for (const v of HH[sp].P) if (Math.hypot(v.x, v.z - H.zb) < 0.21 && v.y > tp - 0.004) nC++;
            if (nC > bestN) { bestN = nC; top = tp; for (const sp of [1, -1]) { H.qP[sp] = qq[sp]; H.WP[sp] = WW[sp]; } H.al = al; }
          }
          H.contactN = bestN;
          for (const sp of [1, -1]) H.WP[sp].y = ybT - top + 0.0008;   // (the palms' top a hair into the bottom: touching)
          H.B0 = new Vector3(0, ybT, H.zb);
          const th = 55 * Math.PI / 180, psi = 65 * Math.PI / 180;
          for (const sd of [1, -1]) {
            const C = new Vector3(sd * LIP.R * Math.sin(th), ybT + LIP.y, H.zb - LIP.R * Math.cos(th)), radial = new Vector3(sd * Math.sin(th), 0, -Math.cos(th));
            const wd = new Vector3(0, Math.cos(psi), 0).addScaledVector(radial, Math.sin(psi)).normalize();
            const G = KK.handAt(sd, "grip"), Axh = KK.handAt(sd, "gripAx").normalize(), Wh = G.clone().negate(); Wh.addScaledVector(Axh, -Wh.dot(Axh)).normalize();
            const best = [];
            for (const flip of [1, -1]) {   // the index finger forward along the rim, or back - the one whose fingers are outside the rim
              const ax = new Vector3(sd * Math.cos(th), 0, Math.sin(th)).multiplyScalar(flip);
              const q = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(ax, wd, new Vector3().crossVectors(ax, wd)).multiply(new Matrix4().makeBasis(Axh, Wh, new Vector3().crossVectors(Axh, Wh)).transpose()));
              const W = C.clone().sub(G.clone().applyQuaternion(q));
              const tips = tm_hand({ sd, pose: "grip" }).sk.fingers.map((f) => f.j[3].clone().applyAxisAngle(new Vector3(0, 1, 0), sd * 0.95).multiplyScalar(KF.FS).applyQuaternion(q).add(W));
              const out = tips.reduce((a2, v) => a2 + (Math.hypot(v.x, v.z - H.zb) - LIP.R), 0) / tips.length;
              best.push([out, q, W]);
            }
            best.sort((u, v) => v[0] - u[0]);
            H.qO[sd] = best[0][1]; H.WO[sd] = best[0][2]; H.pO[sd] = "grip";
          }
        }
        return (KHs[way] = H);
      };
      const kHold = () => kHoldOf(KW.way);
      // HANDS_K end (helpers)
      let D = null;
      const build = () => {
        if (D) return D;
        const PP = tm_people(ctx2);
        const fig = (kind, robe, s2, name, tone) => { const G = new Group(), L = new Group(); G.add(L); BG.add(G); PP.crowd(L, [[0, 0, 0]], { y: 0, s: s2 || 1.4, pose: "stand", kind, robe, tone: () => tone || 1, exact: true, avnet: kind === "kohen" ? undefined : false, name }); G.visible = false; return { G, L }; };
        const wick = new MeshStandardMaterial({ color: 0x9c7440, roughness: 0.9 });
        const basketG = new LatheGeometry([[0.001, 0], [0.22, 0], [0.3, 0.12], [0.34, 0.3], [0.36, 0.34], [0.33, 0.34], [0.3, 0.13], [0.2, 0.03], [0.001, 0.03]].map(([r, y]) => new Vector2(r, y)), 18);
        const fruitM = [0x5a2a6a, 0xa8202c, 0x6b8a2a, 0xc98a2a, 0x3a1a4a].map((c) => new MeshStandardMaterial({ color: c, roughness: 0.55 }));
        const doveM = new MeshStandardMaterial({ color: 0xf2f0ea, roughness: 0.7 });
        let q = 3333; const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const basket = (doves) => {
          const B = new Group(); const bm = new Mesh(basketG, wick); bm.castShadow = true; B.add(bm);
          for (let i = 0; i < 16; i++) { const a = rr() * 6.28, r = rr() * 0.24, f = new Mesh(new SphereGeometry(0.05 + rr() * 0.04, 8, 6), fruitM[i % fruitM.length]); f.position.set(Math.cos(a) * r, 0.33 + rr() * 0.07, Math.sin(a) * r); B.add(f); }
          { const lip = new Mesh(new TorusGeometry(LIP.R, LIP.r, 10, 48).rotateX(Math.PI / 2).translate(0, LIP.y, 0), wick); lip.castShadow = true; B.add(lip); }   // HANDS_K: the rolled rim ("ואוחזו בשפתותיו")
          if (doves) for (const sx of [-0.1, 0.12]) { const d = new Mesh(new SphereGeometry(0.07, 10, 8), doveM); d.scale.set(1.5, 0.9, 0.9); d.position.set(sx, 0.47, 0.02); B.add(d); const h = new Mesh(new SphereGeometry(0.035, 8, 6), doveM); h.position.set(sx + 0.1, 0.52, 0.02); B.add(h); }
          B.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
          return B;
        };
        const bringer = KF ? kFig("worker", 0x7a5a2e, 3, "bikkurimBringer") : fig("worker", 0x7a5a2e, 1.4, "bikkurimBringer", 1);   // HANDS_K: the kit's figure, his arms moving
        const myBasket = basket(true); BG.add(myBasket);
        const comps = [0x3e5a7a, 0x6a3e3e, 0x4a6a3e, 0x5a4a6a].map((c, i) => { const f = fig("worker", c, i === 3 ? 1.05 : 1.4, "bikkurimCompanion", i % 3); const b2 = basket(true);   /* the user's decision 123: "הגוזלות שעל גבי הסלים" (ג, ה) on every basket */ b2.position.set(-0.3, i === 3 ? 1.85 : 2.45, -0.05); b2.scale.setScalar(i === 3 ? 0.75 : 1); f.L.add(b2); return f; });
        const flute = fig("worker", 0x2e4a5a, 1.4, "bikkurimFlute", 2);
        { const pm = new Mesh(new CylinderGeometry(0.02, 0.028, 0.5, 8), new MeshStandardMaterial({ color: 0xc8b07a, roughness: 0.6 })); pm.rotation.x = 1.15; pm.position.set(0, 2.05, 0.32); flute.L.add(pm); }
        const priest = KF ? kFig("kohen", 0, 1, "bikkurimPriest") : fig("kohen", 0xf1ede2, 1.4, "bikkurimPriest", 1);   // HANDS_K
        // OX_B2 (the user's decision 123 a; Bikkurim 3:3, 50:28: "והשור הולך לפניהם, וקרניו מצופות זהב, ועטרת של זית בראשו"): an ox before them,
        // its horns overlaid with gold and a wreath of olive on its head; it goes before them up the ramp, to the gate. Its form - a model choice.
        // OX_K: built again (oxBuild, above)
        const ox = oxBuild();
        // the Levites on the duchan (Arachin 2:3 and the Mishnah's "ודברו הלוים בשיר"), their faces to the people (east)
        const lev = new Group(); BG.add(lev); lev.visible = false;
        { const yD = groundAt(86.3, 6, 20, 15.5), LZ = [-10.8, -8.4, -6, -3.6, 3.6, 6, 8.4, 10.8];
          PP.crowd(lev, LZ.map((z) => [86.3, z, Math.PI / 2]), { y: yD, s: 1.4, pose: "stand", kind: "levi", robe: 0xe9e3d3, tone: (i) => i % 4, name: "bikkurimLevites" }); }
        D = { bringer, myBasket, comps, flute, priest, lev, ox };
        return D;
      };
      const wayNow = (t) => { const W = SW(); let cur = null; for (const w of W) if (t >= w[1] - 0.01) cur = w; return cur; };
      const placeF = (F, P, t0, t1, kind, t, endYaw, dx, dzz) => {
        const u = clamp2((t - t0) / Math.max(1e-3, t1 - t0), 0, 1), q2 = at2(P, u);
        const yaw = u >= 1 && endYaw != null ? endYaw : q2[2], ox = Math.cos(yaw) * (dx || 0) + Math.sin(yaw) * (dzz || 0), oz = -Math.sin(yaw) * (dx || 0) + Math.cos(yaw) * (dzz || 0);
        const x = q2[0] + ox, z = q2[1] + oz, y = kind === "ramp" ? RPb.yAt(z) : hAt(x, z, 30);
        F.G.position.set(x, y + (u > 0 && u < 1 ? Math.abs(Math.sin(t * 9)) * 0.035 : 0), z); F.G.rotation.y = yaw; F.G.visible = kind !== "hide";
        return { x, y, z, yaw };
      };
      // HANDS_K: the basket from the gate to the corner and the four hands. In the bringer's frame (BL - the basket's foot): on his right
      // shoulder, his right hand under its rim (from when he takes it, T.take); "מוריד הסל מעל כתפו" - out and forward, then down before
      // him, his left hand joining it; "ואוחזו בשפתותיו" - his two palms up under its rim; "וכהן מניח ידו תחתיו" - the priest's palms up under
      // his; "ומניפו" - forward and back, up and down (the old measures), all of them together. The priest comes from where he waits to before
      // him, and back after it (until now he stood there at once). Each hand eased from where it was (0.4 - 0.6 s), never jumping
      const kQ = new Quaternion(), kQ2 = new Quaternion(), kV = new Vector3(), kV2 = new Vector3();
      const hangOf = (A) => { if (!A.hang) { armTo(A, hangW(A), null, "rest", POLE_HANG[A.sd]); A.hang = { W: A.W.clone(), q: A.hd.quaternion.clone() }; } return A.hang; };
      // the arm A toward the hold (W, q in its figure's frame) by s (0 - hanging, 1 - holding)
      const blendArm = (A, s, W, q, pole, pose) => {
        const h = hangOf(A);
        if (s <= 0) { armTo(A, h.W, null, "rest", POLE_HANG[A.sd]); return; }
        kV2.copy(h.W).lerp(W, s); kQ2.copy(h.q).slerp(q, s);
        kV.copy(POLE_HANG[A.sd]).lerp(pole, s).normalize();
        armTo(A, kV2, kQ2, s > 0.5 ? pose || "flat" : "rest", kV);
      };
      // the hold now: the chosen way's, or - for half a second after the switch (sh96, from the card too, while it runs) - eased from the other
      const holdNow = () => {
        const to = kHoldOf(KW.way), w = sm2(clamp2((performance.now() - KW.t0) / 500, 0, 1));
        if (w >= 1 || KW.from === KW.way) return to;
        const fr = kHoldOf(KW.from), H = { d: to.d, B0: fr.B0.clone().lerp(to.B0, w), WO: {}, qO: {}, pO: {}, WP: {}, qP: {}, pP: to.pP };
        for (const sd of [1, -1]) { H.WO[sd] = fr.WO[sd].clone().lerp(to.WO[sd], w); H.qO[sd] = fr.qO[sd].clone().slerp(to.qO[sd], w); H.pO[sd] = w > 0.5 ? to.pO[sd] : fr.pO[sd]; H.WP[sd] = fr.WP[sd].clone().lerp(to.WP[sd], w); H.qP[sd] = fr.qP[sd].clone().slerp(to.qP[sd], w); }
        return H;
      };
      const setWave = (m) => { const w2 = m === "b" ? "b" : "a"; if (w2 !== KW.way) { KW.from = KW.way; KW.way = w2; KW.t0 = BK.run ? performance.now() : -1e9; } return KW.way; };
      const basketL = (t, H) => {   // the basket's foot in the bringer's frame, and the waving's offset (its envelope at the ends)
        const sm = (a, b2) => sm2(clamp2((t - a) / (b2 - a), 0, 1));
        const k = clamp2((t - T.wave0) / (T.wave1 - T.wave0), 0, 1), env = t < T.wave1 ? sm(T.wave0 + 0.7, T.wave0 + 1.2) * (1 - sm(T.wave1 - 0.5, T.wave1)) : 0;
        const u = clamp2((t - (T.wave0 - 0.4)) / 0.7, 0, 1), cu = (v) => sm2(clamp2(v, 0, 1));
        return new Vector3(lerp2(-0.3, 0, cu((u - 0.35) / 0.65)) - 0.16 * Math.sin(Math.PI * Math.min(1, u / 0.8)),
          lerp2(2.45, H.B0.y, cu((u - 0.25) / 0.75)) + 0.12 * Math.sin(k * Math.PI * 4) * env,
          lerp2(-0.05, H.B0.z, cu(u / 0.6)) + 0.12 * Math.sin(k * Math.PI * 8) * env);   // (forward and back 0.12 - it was 0.18: the basket then came into the men)
      };
      const kApply = (d, b, t) => {
        const H = holdNow(), BR = d.bringer, PR = d.priest, MB = d.myBasket, dz = altDzB();
        const sm = (a, b2) => sm2(clamp2((t - a) / (b2 - a), 0, 1));
        const BL = basketL(t, H), B0 = H.B0;
        MB.rotation.set(0, 0, 0);
        BR.G.updateMatrixWorld(true);
        // BASKET_FLOW_K (fix-k, 23.11.2026 - the coordinator: "הסל 'קופץ'... תעביר את הסל ברצף, בכחצי שנייה עד שנייה, והידיים מלוות אותו"):
        // the basket never changes hands in one frame - from his fellow's hands to his shoulder it goes in an arc over TKD seconds about
        // T.take, and from his hands down to its place beside the corner over PTD seconds from T.put, his hands with it as far as they
        // reach and then letting go. Until now it was in one place in one frame and in the other in the next
        const TKA = T.take - 0.6, TKB = T.take + 0.15, PTD = 0.9, uT = sm(TKA, TKB), uP = sm(T.put, T.put + PTD);
        const c0 = d.comps[0].G; c0.updateMatrixWorld(true);
        const pC = new Vector3(0.0, 1.55, 0.42).applyMatrix4(c0.matrixWorld), pB = BR.G.localToWorld((t < T.put ? BL : basketL(T.put - 0.001, H)).clone());
        const [px0, pz0] = [40.0, 13.15 + dz], pF = new Vector3(px0, hAt(px0, pz0, 30), pz0);
        // (at T.take he turns in one frame to his next way - the basket on his shoulder swings round with him in 0.18 s, not in that frame)
        if (t >= T.take && t < T.take + 0.2) { const dyw = Math.atan2(Math.sin(b.yaw - Math.PI), Math.cos(b.yaw - Math.PI)), yS = Math.PI + dyw * sm(T.take, T.take + 0.18) - b.yaw; pB.sub(BR.G.position).applyAxisAngle(new Vector3(0, 1, 0), yS).add(BR.G.position); }
        if (t < TKB) { MB.position.lerpVectors(pC, pB, uT); MB.position.y += 0.3 * Math.sin(Math.PI * uT); MB.rotation.y = c0.rotation.y + Math.atan2(Math.sin(b.yaw - c0.rotation.y), Math.cos(b.yaw - c0.rotation.y)) * uT; MB.visible = uT > 0 ? true : c0.visible; }
        else if (t < T.put) { MB.position.copy(pB); MB.rotation.y = b.yaw; MB.visible = BR.G.visible; }
        else { MB.position.lerpVectors(pB, pF, uP); MB.rotation.y = b.yaw; MB.visible = t < T.end + 5; }
        // the bringer's hands: the right to the rim as the basket comes (on the shoulder too), the left from the lowering; both go down
        // with it at T.put and let go as it passes out of their reach
        const rel = 1 - sm(T.put + 0.3, T.put + 0.75);
        const offP = t >= T.put ? BR.G.worldToLocal(MB.position.clone()).sub(basketL(T.put - 0.001, H)) : null;
        for (const sd of [1, -1]) {
          const s = (sd < 0 ? sm(TKA + 0.15, TKB) : sm(T.wave0 - 0.15, T.wave0 + 0.3)) * rel;
          const W = (t < T.put ? BL : basketL(T.put - 0.001, H)).clone().add(kV.copy(H.WO[sd]).sub(B0));
          if (offP) W.add(offP);
          blendArm(BR.arms[sd], s, W, H.qO[sd], POLE_HOLD[sd], H.pO[sd]);
        }
        // the priest: waiting at the corner; to before him for the waving (from 1.6 s before it); back after he sets it down
        const on = t >= T.walk0 && t < T.end; PR.G.visible = on;
        if (!on) return;
        const wait = [38.2, 11.2 + dz, 0.35], fx = Math.sin(b.yaw), fz = Math.cos(b.yaw), there = [b.x + fx * H.d, b.z + fz * H.d, b.yaw + Math.PI];
        const go = sm(T.wave0 - 1.6, T.wave0 - 0.4) * (1 - sm(T.put + 0.2, T.put + 1.4)), mv = go > 0 && go < 1;
        let dy = there[2] - wait[2]; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        // BIKKURIM_N1: to the waving past the cover slab's west side (it lies at x 38.5-39.5, z 25.3-26.3 in the court's frame) - not across it
        const WM = [38.0, 14.4 + dz], g1 = clamp2(go / 0.6, 0, 1), g2 = clamp2((go - 0.6) / 0.4, 0, 1);
        const px = go < 0.6 ? lerp2(wait[0], WM[0], g1) : lerp2(WM[0], there[0], g2), pz = go < 0.6 ? lerp2(wait[1], WM[1], g1) : lerp2(WM[1], there[1], g2);
        PR.G.position.set(px, hAt(px, pz, 30) + (mv ? Math.abs(Math.sin(t * 9)) * 0.03 : 0), pz); PR.G.rotation.y = wait[2] + dy * go;
        PR.G.updateMatrixWorld(true);
        const qB = BR.G.getWorldQuaternion(kQ.clone()), qPinv = PR.L.getWorldQuaternion(new Quaternion()).invert();
        const sP = sm(T.wave0 + 0.1, T.wave0 + 0.7) * rel;
        for (const sd of [1, -1]) {
          const Wb = (t < T.put ? BL : basketL(T.put - 0.001, H)).clone().add(kV.copy(H.WP[sd]).sub(B0));
          const Wl = PR.L.worldToLocal(BR.G.localToWorld(Wb)), ql = qPinv.clone().multiply(qB.clone().multiply(H.qP[sd]));
          blendArm(PR.arms[sd], sP, Wl, ql, POLE_HOLD[sd], H.pP[sd]);
        }
      };
      const apply = (t) => {
        const d = build(), W = SW(), cur = wayNow(t) || W[0];
        const b = placeF(d.bringer, cur[0], cur[1], cur[2], cur[3], Math.min(t, cur[2]), cur[4], 0, 0);
        d.bringer.L.rotation.x = 0;
        // the companions: behind him on the ramp and through the women's court; in Israel's court they stand
        d.comps.forEach((F, i) => {
          const lag = 0.7 + i * 0.55, tt = t - lag, w = wayNow(tt) || W[0];
          if (t >= T.nik + 0.6) { const sx = 90.5 + (i % 2) * 1.6, sz = -2 - i * 1.4; F.G.visible = true; F.G.position.set(sx, hAt(sx, sz, 30), sz); F.G.rotation.y = -Math.PI / 2; return; }
          if (w === W[W.length - 1] || w === W[W.length - 2]) { F.G.visible = false; return; }
          placeF(F, w[0], w[1], w[2], w[3], Math.min(tt, w[2]), w[4], (i % 2 ? 1 : -1) * 1.1, 0);
          // BASKET_FLOW_K: in the gate the floor's height 1.1 to the side of the way was taken from the gate's own stones (the fellow, and
          // the basket in his hands, went up 3 amot in a frame, three times) - never higher than the way's own floor beside him
          if (w[3] === "floor") { const yw = F.G.rotation.y, dxv = (i % 2 ? 1 : -1) * 1.1, cy = hAt(F.G.position.x - Math.cos(yw) * dxv, F.G.position.z + Math.sin(yw) * dxv, 30); if (F.G.position.y > cy + 0.06) F.G.position.y = cy; }
        });
        // OX_B2 / OX_IN_B2: the ox before them all - up the ramp, (unseen) across the mount, through the women's court and the steps, ahead of
        // them; from the Nikanor gate to its place by the rings, where it stands until the end. OX_K: one smooth way (oxPose, above)
        oxPose(d.ox, t);
        // the flute before them up to the mount ("עד שמגיעין להר הבית")
        { const tt = t + 0.9, w = W[0]; if (t < T.take + 0.6) placeF(d.flute, w[0], w[1], w[2], "ramp", Math.min(tt, w[2]), Math.PI, 0.8, 0); else d.flute.G.visible = false; }
        // his basket: with the first companion up the ramp; on his own shoulder from the gate; lowered and waved; set down
        const MB = d.myBasket; MB.visible = !!d.bringer.G.visible || t >= T.put; MB.rotation.set(0, 0, 0);
        const c0 = d.comps[0].G;
        if (t < T.take) { c0.updateMatrixWorld(true); MB.position.set(0, 0, 0); MB.visible = c0.visible; const v = new Vector3(0.0, 1.55, 0.42).applyMatrix4(c0.matrixWorld); MB.position.copy(v); MB.rotation.y = c0.rotation.y; }
        else if (t < T.wave0) { const sh = new Vector3(-0.3, 2.45, -0.05); d.bringer.G.updateMatrixWorld(true); MB.position.copy(sh.applyMatrix4(d.bringer.G.matrixWorld)); MB.rotation.y = b.yaw; MB.visible = d.bringer.G.visible; }
        else if (t < T.put) {   // held by its rims before him, and waved - forward and back, up and down (the priest's hand under it)
          const k = clamp2((t - T.wave0) / (T.wave1 - T.wave0), 0, 1), w8 = t < T.wave1 ? Math.sin(k * Math.PI * 8) : 0, w4 = t < T.wave1 ? Math.sin(k * Math.PI * 4) : 0;
          const hv = new Vector3(0, 1.62 + 0.12 * w4, 0.55 + 0.18 * w8); d.bringer.G.updateMatrixWorld(true); MB.position.copy(hv.applyMatrix4(d.bringer.G.matrixWorld)); MB.rotation.y = b.yaw; MB.visible = true;
        } else { const [px, pz] = [40.0, 13.15 + altDzB()]; MB.position.set(px, hAt(px, pz, 30), pz); MB.visible = t < T.end + 5; }
        // he bows
        if (t >= T.bow0 && t < T.bow1) d.bringer.L.rotation.x = 0.55 * Math.sin(Math.PI * clamp2((t - T.bow0) / (T.bow1 - T.bow0), 0, 1));
        if (d.bringer.arms && KF) { kApply(d, b, t); d.lev.visible = t >= T.nik - 0.8 && t < T.corner + 1; return; }   // HANDS_K: the basket, the hands, the priest
        // the priest: waiting at the corner, then before him for the waving
        { const dz = altDzB(), on = t >= T.walk0 && t < T.end; d.priest.G.visible = on;
          if (on) { const wv = t >= T.wave0 - 0.4 && t < T.put, px = wv ? b.x + Math.sin(b.yaw) * 1.05 : 38.2, pz = wv ? b.z + Math.cos(b.yaw) * 1.05 : 11.2 + dz;
            d.priest.G.position.set(px, hAt(px, pz, 30), pz); d.priest.G.rotation.y = wv ? b.yaw + Math.PI : 0.35; } }
        d.lev.visible = t >= T.nik - 0.8 && t < T.corner + 1;
      };
      const keys = () => { const dz = altDzB(), C = [39.4, 13.8 + dz];
        return [
          [0, [22, RPb.yf + 5, RPb.zf + 18], [0, RPb.yf + 1.5, RPb.zf + 2]], [2.2, [20, RPb.yAt(RPb.zf - 12) + 5, RPb.zf - 4], [0, RPb.yAt(RPb.zf - 18) + 1.5, RPb.zf - 18]], [3.4, [20, RPb.yAt(RPb.zf - 28) + 5, RPb.zf - 22], [0, RPb.yAt(RPb.zf - 34) + 1.5, RPb.zf - 36]], [T.gate - 0.4, [12, 6, 352], [0, 2, 338]],
          [T.take + 0.2, [10, 4, 344], [0, 3, 333]], [T.take + 1.0, [120, 80, 230], [200, 0, 40]],
          [T.ezn0, [252, 14, 14], [238, 7, 1]], [T.ezn0 + 1.5, [214, 14, 13], [197, 7, 1]], [T.ezn0 + 3, [170, 14, 13], [153, 7, 1]], [T.ezn1, [122, 16, 13], [104, 9, 1]], [T.steps1, [110, 21, 14], [95, 15, 2]],
          [T.nik + 0.4, [74, 22, 20], [90, 16, 3]], [T.nik + 2.2, [74, 21, 18], [88, 16.5, 5]], [T.walk0, [74, 21, 20], [88, 16.5, 10]],
          [T.walk0 + 2, [70, 23, 50], [80, 17, 38]], [T.walk0 + 3.5, [66, 28, 40], [56, 16.5, 56]], [T.walk0 + 5.6, [31, 23, 53], [38, 17.5, 40]],
          [T.corner - 0.5, [31.5, 21.5, C[1] + 7], [C[0], 17.2, C[1]]],
          // HANDS_K: the waving from his left side, at the hands' height - the four hands under the basket, the two men whole to the waist
          ...(KF ? (() => { const yE = 2.62, fx = Math.sin(yE), fz = Math.cos(yE), lx = Math.cos(yE), lz = -Math.sin(yE), bx = 38.3 + fx * 0.78, bz = 15 + WZ + dz + fz * 0.78, y0 = hAt(38.3, 15 + WZ + dz, 30);
            const E = [bx + lx * 3.7, y0 + 1.8, bz + lz * 3.7], Lk = [bx, y0 + 2.05, bz];
            return [[T.wave0 - 0.2, E, Lk], [T.wave1 + 0.4, E, Lk], [T.put, [32, 20.5, C[1] + 2.2], [C[0] - 0.4, 17.4, C[1] + 0.4]]]; })()
            : [[T.wave0 + 0.6, [32, 20.5, C[1] + 2.2], [C[0] - 0.7, 17.8, C[1] + 0.7]], [T.put, [32, 20.5, C[1] + 2.2], [C[0] - 0.4, 17.4, C[1] + 0.4]]]),
          [T.bow1, [32.5, 21, C[1] + 3.5], [C[0], 17.4, C[1]]], [T.end, [30, 24, C[1] + 12], [39, 17, C[1] + 10]]
        ]; };
      const caps = () => [
        [0, "״והשור הולך לפניהם, וקרניו מצופות זהב, ועטרת של זית בראשו״ (ביכורים ג, ג); ״החליל מכה לפניהם עד שמגיעין להר הבית״ (ג, ד) — עולים בכבש שלפני שער חולדה"],
        [3.6, "״יש לו רשות לתנם לעבדו וקרובו בכל הדרך עד שמגיע להר הבית״ (רמב״ם ביכורים ג, יב)"],   // QUOTES_Q: רמב״ם ביכורים ג, יב (336:53): 'לתנם'
        [T.gate, "״הגיעו להר הבית, אפלו אגריפס המלך נוטל הסל על כתפו ונכנס, עד שמגיע לעזרה״ (ביכורים ג, ד)"],   // QUOTES_Q: ביכורים ג, ד (50:29): 'אפלו'
        [T.ezn0, "דרך עזרת נשים וחמש עשרה המעלות, ושער ניקנור; ״הגוזלות שעל גבי הסלים, היו עולות״ (ביכורים ג, ה)"],
        [T.nik, "״הגיע לעזרה ודברו הלוים בשיר, ארוממך ה׳ כי דליתני ולא שמחת איבי לי״ (ביכורים ג, ד)"],
        [T.walk0 - 0.6, "השור נכנס עמם לעזרה ועומד במקום השחיטה — ״וכשם שטעונין תנופה כך טעונין קרבן שלמים״ (רמב״ם ביכורים ג, יב)"],
        [T.read0, BK.reading === "rj" ? "״עודהו הסל על כתפו, קורא מהגדתי היום לה׳ אלהיך... רבי יהודה אומר עד ארמי אבד אבי״ (ביכורים ג, ו) — לרבי יהודה" : "״עודהו הסל על כתפו, קורא מהגדתי היום לה׳ אלהיך, עד שגומר כל הפרשה״ (ביכורים ג, ו) — לתנא קמא"],
        [T.wave0 - 0.4, BK.reading === "rj" ? "״הגיע לארמי אבד אבי, מוריד הסל מעל כתפו ואוחזו בשפתותיו, וכהן מניח ידו תחתיו ומניפו, וקורא מארמי אבד אבי עד שהוא גומר כל הפרשה״ (ביכורים ג, ו)" : "״מוריד הסל מעל כתפו ואוחזו בשפתותיו, וכהן מניח ידו תחתיו ומניפו״ (ביכורים ג, ו) — לתנא קמא, אחרי שגמר את הפרשה"],
        [T.put - 0.2, "״ומניחו בצד המזבח בקרן דרומית מערבית בדרומה של קרן, וישתחוה ויצא״ (רמב״ם ביכורים ג, יב)"],
        [T.bow1 + 0.4, "הדרך, הקצב, השור, הסל ופירותיו והמלווים — בחירת מודל"]
      ];
      const finish = () => { BK.run = false; BG.visible = false; const sv = BK.saved; if (sv && sv.lg) sv.lg.visible = sv.labels; if (sv && sv.view && SH.viewLimits) SH.viewLimits.set(sv.view); if (BK.camLow0 === undefined) delete SH.camLow; else SH.camLow = BK.camLow0; BK.saved = null; };
      // CHIP_KEEPS_DEMO_T (fix-t, 23.11.2026; the coordinator: "מותר להתחיל מחדש מהשלב הרלוונטי (הקריאה), לא מההתחלה"): the run may begin
      // at a second of its timeline (BK.off) - the walk's keys and captions from there, shifted to its start; setReading uses it below
      const startFrom = (off0) => {
        const Wk = SH.walk; if (!Wk) return false;
        if (typeof SH.stopDemos === "function") SH.stopDemos("bikkurimDemo");
        build(); prime();
        let lg = null; try { lg = ctx2.root.getObjectByName("labels"); } catch (_) {}
        BK.saved = { lg, labels: lg ? lg.visible : true, view: SH.viewLimits ? SH.viewLimits.get() : null };
        if (lg) lg.visible = false;
        if (SH.viewLimits) SH.viewLimits.include([0, RPb.yf - 2, RPb.zf + 30]);
        BK.camLow0 = SH.camLow; SH.camLow = RPb.yf - 3;
        T = mkT(BK.reading);
        const off = off0 > 0 ? off0 : 0;
        BK.off = off;
        BG.visible = true; BK.run = true; apply(off);
        if (!off) { Wk.run(keys(), caps(), finish); return true; }
        const K = keys(), C = caps();
        let i0 = 0, c0 = 0;
        for (let i = 0; i < K.length; i++) if (K[i][0] <= off) i0 = i;
        for (let i = 0; i < C.length; i++) if (C[i][0] <= off) c0 = i;
        Wk.run(K.slice(i0).map(([t, e, l]) => [Math.max(0, t - off), e, l]), C.slice(c0).map(([t, x]) => [Math.max(0, t - off), x]), finish);
        return true;
      };
      const start = () => startFrom(0);
      const stop = () => { if (!BK.run) return; const Wk = SH.walk; if (Wk && Wk.on) Wk.stop(); else finish(); };
      let sndB = -1;
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => {
        if (!BK.run) { sndB = -1; return; }
        const Wk = SH.walk, t = (Wk && typeof Wk.now === "function" ? Math.max(0, Wk.now()) : 0) + (BK.off || 0);   // CHIP_KEEPS_DEMO_T: + BK.off
        try { apply(t); } catch (e) { if (!BK.warned) { BK.warned = true; console.warn("[bikkurim]", e && e.message); } }
        sndB = t;
      });
      const wk = () => (SH.demoStops || []).find((q2) => q2.id === "walk");
      (SH.demoStops || (SH.demoStops = [])).push({ id: "bikkurimDemo", running: () => BK.run, stop, pause: () => { const w = wk(); if (w) w.pause(); }, resume: () => { const w = wk(); if (w) w.resume(); }, paused: () => { const w = wk(); return !!(w && w.paused()); }, restart: () => { stop(); start(); } });
      // CHIP_KEEPS_DEMO_T: setReading while it runs - on from the same second, at most from the reading (until now: from the start)
      SH.bikkurim = { start, stop, at: (t) => { build(); prime(); T = mkT(BK.reading); BG.visible = true; apply(t); }, keys, get reading() { return BK.reading; }, get off() { return BK.run ? BK.off || 0 : 0; }, get _k() { return { D, T, OXW, SW, KH: KF ? kHold() : null, kHoldOf, LIP, wallR }; }, get wave() { return KW.way; }, setWave,   /* HANDS_K: for the checks */ setReading: (r) => { BK.reading = r === "rj" ? "rj" : "tk"; if (BK.run) { const Wk = SH.walk, now = (Wk && typeof Wk.now === "function" ? Math.max(0, Wk.now()) : 0) + (BK.off || 0); stop(); startFrom(Math.min(now, T.read0)); } return BK.reading; }, get on() { return BK.run; } };
    }
    // ---------- AQUEDUCTS_B2 (fix-b2, 22.11.2026 - the user's decisions 170 and 171 a): THE TWO WATER CHANNELS ----------
    // (1) the channel under the court from the shitin to the Kidron - Middot 3:2 (89:20): "ובקרן מערבית דרומית היו שני נקבים, כמין שני
    // חטמין דקין, שהדמים הנתנין על יסוד מערבי ועל יסוד דרומי, יורדין בהן ומתערבין באמה, ויוצאין לנחל קדרון": a covered channel under
    // the court's floor from the shitin south to the court's wall, down through its foundation, under the mount south-east to its eastern
    // wall, and out of an opening in the wall's foot, the water running down the slope toward the Kidron. (2) the channel from Ein Eitam -
    // Rashi, Yoma 31a (2157:1138): "עין עיטם - ממנו באה אמת המים לבית טבילת שער המים שעל החומה ולפי ענין המקראות נראה לי שהוא מעיין מי
    // נפתוח"; Rashi, Yoma 19a (2157:606): "מעיין משוך שם באמה מעין עיטם"; Yoma 31a (107:740): "עין עיטם גבוה מקרקע עזרה עשרים ושלש
    // אמות": from the west, on a low embankment outside the mount, into its western wall, under its surface, and up inside the court's
    // wall to the bath on the Water Gate (30-courts.js: x -30, y 40.3, z 67.5 - 24 amot over the court's floor). At the drawn part's western
    // end (x -340) a sign with an arrow. The hidden parts are seen through the ground by the places' features (as the mesibah's way, 30-courts.js
    // MESIBAH_303: ghosts drawn where they are hidden). The ways, the forms, the exit and the sign - model choices. Built after the first
    // seconds, or when a place's feature turns on (rays to the ground).
    {
      const AQ = grp("aqueducts", true), XRK = [], XRE = [];
      const stoneM = new MeshStandardMaterial({ color: 0x9a8c74, roughness: 0.95 }), capM = new MeshStandardMaterial({ color: 0x857862, roughness: 0.95 });
      const waterM = new MeshStandardMaterial({ color: 0x5f9fd6, roughness: 0.12, metalness: 0.05, emissive: 0x16324c, emissiveIntensity: 0.3 });
      const darkM = new MeshStandardMaterial({ color: 0x140d08, roughness: 1 });
      const gm = new Map(), ghostM = (m) => { let g = gm.get(m); if (!g) { g = m.clone(); g.transparent = true; g.opacity = 0.62; g.depthWrite = false; g.depthTest = true; g.depthFunc = GreaterDepth; gm.set(m, g); } return g; };
      const ghost = (m, list) => { const t = new Mesh(m.geometry, ghostM(m.material)); t.visible = false; t.renderOrder = 30; t.userData.noPick = true; t.raycast = () => {}; m.add(t); list.push(t); };
      const V = (a) => new Vector3(a[0], a[1], a[2]);
      // a straight piece from a to b: a box w x h along it (its local z), optionally a strip of water on its top or inside, optionally hidden (its ghost)
      const piece = (a, b, w, h, m, list) => { const A = V(a), B = V(b), L = A.distanceTo(B); if (L < 1e-3) return null; const o = new Mesh(new BoxGeometry(w, h, L), m); o.position.copy(A).add(B).multiplyScalar(0.5); o.lookAt(B); o.castShadow = o.receiveShadow = true; o.userData.noPick = true; AQ.add(o); if (list) ghost(o, list); return o; };
      const line = (P, w, h, m, list) => { for (let i = 1; i < P.length; i++) piece(P[i - 1], P[i], w, h, m, list); };
      let built = false, t0 = -1, seeK = false, seeE = false;
      const SHI = [40, 24.55], F0 = LV.KOH;   // the shitin (40-altar.js SHITIN_LABEL: mv's frame 40, 12.05 + the altar's 12.5)
      const EXZ = 300, WALL_E = 356, WALL_W = -150, EZ = 67.5, BATH = [-30, 40.2, 67.5];
      const R = {};
      const build = () => {
        if (built) return; built = true;
        const dz = (() => { const AP = SH.altarPlace; return AP && AP.dz && typeof AP.dz[AP.current] === "number" ? AP.dz[AP.current] : 12.5; })();
        const sx = SHI[0], sz = SHI[1] - 12.5 + dz;
        // ---- (1) to the Kidron: the ground outside the eastern wall first (rays, before anything of ours is there)
        const gX = groundAt(WALL_E + 2.5, EXZ, 20, -14), yX = gX + 0.7;
        const SP = [];   // the stream down the slope
        for (let k = 0; k <= 14; k++) { const x = WALL_E + 0.6 + k * 5, z = EXZ + Math.sin(k * 0.7) * 1.6, y = k ? groundAt(x, z, yX + 6, yX - k) : yX - 0.35; SP.push([x, y + 0.07, z]); }
        const K1 = [[sx, F0 - 0.25, sz], [sx, F0 - 2.6, sz]];   // the shaft under the shitin
        const K2 = [[sx, F0 - 2.6, sz], [sx + 1.5, F0 - 3.2, 66], [sx + 3, -2.6, 76], [150, -3.4, 140], [300, -4.6, 262], [WALL_E - 11, Math.max(-6, yX - 1), EXZ], [WALL_E - 1.0, yX - 0.05, EXZ]];   // KIDRON_VIEW_H: ends inside the wall (it stood out of its face, over the opening - a "pipe" on the wall)
        line(K1, 0.5, 0.5, capM, XRK);
        line(K2, 1.1, 0.9, stoneM, XRK);
        R.shitin = [sx, F0, sz]; R.wallIn = K2[2].slice();   // AZARA_AQ_H: for the place "אמת המים — בעזרה" (the shaft under the shitin, and where it goes down in the court wall's foundation)
        for (let i = 1; i < K2.length; i++) { const a = K2[i - 1], b = K2[i]; piece([a[0], a[1] + 0.47, a[2]], [b[0], b[1] + 0.47, b[2]], 0.56, 0.06, waterM, XRK); }   // the water in it, seen with it
        // the exit: an arched opening in the wall's foot, a sill, and the small stream down to the valley
        { const ex = WALL_E + 0.08; const hole = new Mesh(new CircleGeometry(1.05, 18, 0, Math.PI), darkM); hole.rotation.y = Math.PI / 2; hole.position.set(ex, yX - 0.05, EXZ); AQ.add(hole);
          const low = new Mesh(new PlaneGeometry(2.1, 0.45), darkM); low.rotation.y = Math.PI / 2; low.position.set(ex, yX - 0.27, EXZ); AQ.add(low);
          const arch = new Mesh(new TorusGeometry(1.18, 0.2, 6, 14, Math.PI), stoneM); arch.rotation.y = Math.PI / 2; arch.position.set(ex + 0.05, yX - 0.05, EXZ); arch.castShadow = true; AQ.add(arch);
          piece([ex, yX - 0.5, EXZ], [ex + 1.8, yX - 0.62, EXZ], 2.1, 0.22, stoneM, null);   // the sill
          for (let i = 1; i < SP.length; i++) { const a = SP[i - 1], b = SP[i]; const w = 0.7 + i * 0.03; piece(a, b, w, 0.06, waterM, null); }
          R.exit = [ex, yX, EXZ]; R.streamEnd = SP[SP.length - 1]; }
        // ---- (2) from Ein Eitam: outside the mount on a low embankment, from the drawn part's western end (x -340, within the eye's reach) to the wall
        const OUT = [];
        for (let x = WALL_W - 2; x >= -340; x -= 12) { const y = groundAt(x, EZ, 80, NaN); if (!isFinite(y)) break; OUT.push([x, y + 0.85, EZ]); }
        if (OUT.length < 2) OUT.push([WALL_W - 2, 0.85, EZ], [WALL_W - 60, 0.85, EZ]);
        OUT.reverse();   // west to east
        for (let i = 1; i < OUT.length; i++) { const a = OUT[i - 1], b = OUT[i];
          piece([a[0], a[1] - 0.9, a[2]], [b[0], b[1] - 0.9, b[2]], 2.0, 1.4, capM, null);            // the embankment
          piece([a[0], a[1] - 0.05, a[2]], [b[0], b[1] - 0.05, b[2]], 1.3, 0.5, stoneM, null);         // the channel's walls
          piece([a[0], a[1] + 0.17, a[2]], [b[0], b[1] + 0.17, b[2]], 0.75, 0.06, waterM, null); }     // its water
        const yW = OUT[OUT.length - 1][1];
        const E2 = [[WALL_W - 2, yW, EZ], [WALL_W + 7, Math.min(yW, -2.5), EZ], [BATH[0] - 3, -2.5, EZ], [BATH[0], -2.5, EZ]];
        line(E2, 1.0, 0.8, stoneM, XRE);
        // up INSIDE the court's wall (30-courts.js: centred on z 67.5, 5 thick, from 13.5 to 40) to the bath on the Water Gate - Rashi, Yoma 19a:
        // "בעובי החומה מתוקן בית טבילת חול ומעיין משוך שם באמה מעין עיטם"; seen only through it, and with it a pale slice of the wall's thickness
        // round it, so that it reads as within the wall (the user's correction of the first picture: "נראית כמו עמוד דק שעומד לפני שער המים")
        piece([BATH[0], -2.5, EZ], [BATH[0], BATH[1] - 0.2, EZ], 1.0, 0.8, capM, XRE);
        piece([BATH[0], -2.2, EZ], [BATH[0], BATH[1] - 0.25, EZ], 0.34, 0.34, waterM, XRE);
        { const slM = new MeshBasicMaterial({ color: 0xa9cbe6, transparent: true, opacity: 0.3, depthWrite: false, depthTest: true, depthFunc: GreaterDepth });
          const slG = new BoxGeometry(3.4, 40 - 0.2, 4.4), sl = new Mesh(slG, slM); sl.position.set(BATH[0], 20 - 0.1, EZ); sl.visible = false; sl.renderOrder = 29; sl.userData.noPick = true; sl.raycast = () => {}; AQ.add(sl); XRE.push(sl);
          const ed = new LineSegments(new EdgesGeometry(slG), new LineBasicMaterial({ color: 0x3a6f9a, transparent: true, opacity: 0.85, depthWrite: false, depthTest: true, depthFunc: GreaterDepth })); ed.position.copy(sl.position); ed.visible = false; ed.renderOrder = 31; ed.raycast = () => {}; AQ.add(ed); XRE.push(ed); }   // its edges: the wall's 5 amot of thickness
        // the sign at the western edge: "לעין עיטם — מי נפתוח (רש״י)", the arrow to the west
        { const w0 = OUT[0], cv = document.createElement("canvas"); cv.width = 512; cv.height = 192; const c2 = cv.getContext("2d");
          c2.fillStyle = "#efe4c8"; c2.fillRect(0, 0, 512, 192); c2.strokeStyle = "#6b4a24"; c2.lineWidth = 8; c2.strokeRect(4, 4, 504, 184);
          c2.fillStyle = "#3a2a14"; c2.font = "bold 46px Arial"; c2.direction = "rtl"; c2.textAlign = "center"; c2.fillText("לעין עיטם", 300, 72); c2.font = "bold 34px Arial"; c2.fillText("מי נפתוח (רש״י)", 300, 140);
          c2.beginPath(); c2.moveTo(30, 96); c2.lineTo(92, 50); c2.lineTo(92, 76); c2.lineTo(150, 76); c2.lineTo(150, 116); c2.lineTo(92, 116); c2.lineTo(92, 142); c2.closePath(); c2.fill();   // the arrow - to the left, the west
          const tex = new CanvasTexture(cv); tex.colorSpace = SRGBColorSpace;
          const yS = groundAt(w0[0] + 3, EZ + 3, 80, w0[1] - 0.85);
          const board = new Mesh(new PlaneGeometry(4.2, 1.6), new MeshStandardMaterial({ map: tex, roughness: 0.8, side: DoubleSide })); board.position.set(w0[0] + 3, yS + 2.6, EZ + 3); AQ.add(board);   // facing south: the west on its left
          for (const dx of [-1.7, 1.7]) mesh(AQ, new BoxGeometry(0.16, 2.6, 0.16), capM, w0[0] + 3 + dx, yS + 1.3, EZ + 2.95);
          R.sign = [w0[0] + 3, yS + 2.6, EZ + 3];
          if (SH.viewLimits && typeof SH.viewLimits.include === "function") SH.viewLimits.include([w0[0] - 6, yS - 2, EZ + 14]); }   // the eye may reach the sign
        R.wallW = [WALL_W - 2, yW, EZ];
        AQ.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        { const lo = Math.min(yX, R.streamEnd[1], ...OUT.map((q) => q[1] - 0.85)) - 3; if (!(typeof SH.camLow === "number" && SH.camLow <= lo)) SH.camLow = lo; }   // the eye may go down to the exit, the stream and the sign
      };
      const setK = (v) => { if (v) build(); seeK = !!v; for (const t of XRK) t.visible = seeK; };
      const setE = (v) => { if (v) build(); seeE = !!v; for (const t of XRE) t.visible = seeE; };
      if (Array.isArray(ctx2.animated)) ctx2.animated.push(() => { if (built || typeof SH.floorY !== "function") return; const now = performance.now(); if (t0 < 0) t0 = now; if (now - t0 > 4000) { try { build(); } catch (e) { console.warn("[aqueducts]", e && e.message); built = true; } } });
      SH.features = SH.features || {};
      SH.features.aqueductKidron = { key: "aqueductKidron", timed: false, isOn: () => seeK, on: () => setK(true), off: () => setK(false) };
      SH.features.aqueductEitam = { key: "aqueductEitam", timed: false, isOn: () => seeE, on: () => setE(true), off: () => setE(false) };
      SH.aqueducts = { build, R, get built() { return built; } };
      const INFO_K = "לשון המשנה (מדות ג, ב): ״ובקרן מערבית דרומית היו שני נקבים, כמין שני חטמין דקין, שהדמים הנתנין על יסוד מערבי ועל יסוד דרומי, יורדין בהן ומתערבין באמה, ויוצאין לנחל קדרון״.\n**ומים מנין לעזרה** — מאמת המים שמעין עיטם (ראו ״אמת המים מעין עיטם״); ״אמר אביי: שמע מיניה עין עיטם גבוה מקרקע עזרה עשרים ושלש אמות״ (יומא לא.).\n**במודל:** תעלה מקורה מתחת לרצפת העזרה — מן השיתין שבקרן המערבית־הדרומית של המזבח דרומה אל כותל העזרה, ויורדת ביסודו; משם בשיפוע מתחת להר הבית אל החומה המזרחית, ובתחתית החומה פתח גלוי, שממנו המים יוצאים בזרם קטן במורד אל נחל קדרון. התעלה שבעזרה נראית מבעד לרצפה במקום ״אמת המים — בעזרה, מן השיתין אל הכותל״. מסלול התעלה, צורתה ומקום היציאה — בחירת מודל: המשנה אומרת רק ״ויוצאין לנחל קדרון״.\n**בבית ראשון לא צוירה** — רש״י (זבחים סא:): ״ובימי שלמה היה כמין בור כרוי אצל המזבח באותה זוית לירד הנסכים בתוכו״.";
      const REFS_K = [["מדות ג, ב", { book: 89, index: 20 }], ["יומא לא.", { book: 107, index: 740 }], ["רש״י זבחים סא: — בימי שלמה", { book: 2191, index: 2950 }]];
      const INFO_E = "**רש״י** (יומא לא.): ״עין עיטם - ממנו באה אמת המים לבית טבילת שער המים שעל החומה ולפי ענין המקראות נראה לי שהוא מעיין מי נפתוח האמור בספר יהושע (טו) שמשם הגבול משפע ויורד למזרח ולמערב״.\n**רש״י** (יומא יט.): ״התם על גב שער המים שהיא על גבה בעובי החומה מתוקן בית טבילת חול ומעיין משוך שם באמה מעין עיטם״.\n**הגמרא** (יומא לא.): ״חוץ מראשונה שהיתה בחול על גבי שער המים, ובצד לשכתו היתה. אמר אביי: שמע מיניה עין עיטם גבוה מקרקע עזרה עשרים ושלש אמות״.\n**בזבחים** (נד:): ״סבור למבנייה בעין עיטם – דמדלי״; ורש״י שם: ״נראה בעיני שהוא מעין מי נפתוח האמור שם אחר עליית ההר אשר על פני גיא בן הינום״.\n**במודל:** תעלה שמגיעה ממערב — מחוץ להר על גבי סוללה נמוכה — נכנסת בחומה המערבית של הר הבית, עוברת מתחת לפני השטח, ועולה בתוך כותל העזרה אל בית הטבילה שעל גבי שער המים (כעשרים וארבע אמות מעל רצפת העזרה; ״עין עיטם גבוה מקרקע עזרה עשרים ושלש אמות״). בתוך ההר התעלה נראית מבעד לקרקע (כשהמקום נבחר). מחוץ להר הבית הסוללה גלויה; מחומת הר הבית ופנימה היא אינה גלויה כלל: מתחת לרצפת ההר ובתוך עובי כותל העזרה, ורואים אותה רק בשקיפות כשבוחרים את המקום. בקצה המצויר, במערב, שלט וחץ: ״לעין עיטם — מי נפתוח (רש״י)״; המעיין עצמו אינו מצויר. **התוואי — בחירת מודל, ואין לו מקור**; המקורות הם על עצם האמה ועל גובה עין עיטם בלבד. צורת התעלה ומקום השלט — בחירת מודל.";
      const REFS_E = [["רש״י יומא לא.", { book: 2157, index: 1138 }], ["רש״י יומא יט.", { book: 2157, index: 606 }], ["יומא לא.", { book: 107, index: 740 }], ["זבחים נד:", { book: 130, index: 1886 }], ["רש״י זבחים נד:", { book: 2191, index: 2627 }]];
      SH.aqueductInfo = { kidron: { info: INFO_K, refs: REFS_K }, eitam: { info: INFO_E, refs: REFS_E } };
      ctx2.labels.push({ text: "אמת המים — היציאה לנחל קדרון (מדות ג, ב)", x: WALL_E + 6, y: -19, z: EXZ, size: 2.2, info: INFO_K, refs: REFS_K },
        { text: "אמת המים מעין עיטם — אל בית הטבילה שעל שער המים", x: WALL_W - 14, y: -18, z: EZ, size: 2.2, info: INFO_E, refs: REFS_E });
    }
    // ORDER_B2 (fix-b2, 22.11.2026 - the user's decisions 16 and 24: "בסדר היום" in the Second Temple's cards): a place -> the stage of the
    // morning service done in it (55-tamid.js, its stages' ids); the card's link starts the presentation "סדר עבודת הבוקר" at that stage
    // (70-ui.js renderLinks). The choice of the stage for each place - a model choice.
    SH.placeOrder = {
      "הר הבית": "ihb", "בית המוקד": "moked", "לשכת הגזית — הסנהדרין": "lot2", "לשכת הטלאים — בבית המוקד": "lamb",
      "הכיור": "kiyor", "הדגמת המוכני — הכיור יורד לבור ועולה": "kiyor", "המזבח": "terumah", "בית המטבחים": "tobeit", "הטבעות": "akedah",
      "השער הגדול — ארבע הדלתות": "gate", "פתיחת השער הגדול — הדגמה": "gate", "הקודש": "inner", "המנורה": "lamps5", "מזבח הזהב": "ketoret",
      "הכבש הגדול": "evarim", "שולחן החלבים — שני השולחנות שבמערב הכבש": "evarim", "שלוש המחתות — בכל יום וביום הכיפורים": "machta",
      "האולם": "birkat", "לשכת עושי חביתין": "mincha", "ספלי הניסוך": "nesachim", "דוכן הלויים": "shir"
    };
  }
