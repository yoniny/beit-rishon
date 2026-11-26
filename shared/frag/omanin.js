    // ===== OMANIN_461 (the user 26.11.2026: "תעשה את ההדגמה תאמת מקורות עכשיו באוצריא"): THE CRAFTSMEN LOWERED INTO THE HOLY OF HOLIES IN
    // BOXES. The sources, checked in the user's library (seforim.db): Mishnah Middot 4:5 (book 89 line 32) "ולולין היו פתוחין בעליה לבית
    // קדש הקדשים, שבהן היו משלשלין את האמנים בתבות, כדי שלא יזונו עיניהן מבית קדשי הקדשים"; Pesachim 26a (106:774), Rashi there
    // (lines 4,1-4,3) "לול - ארובה שבעלייה היורדת לבית", "האומנין - כשיש בדק בחומת בית קדשי הקדשים", "יזונו - לשון הנאה"; Tosefta Kelim
    // Bava Kamma 1:9 (225:10) "מצוה בכהנים... מצוה בטהורים... מצוה בתמימין... מצוה שיכנסו בתיבות, אין שם תיבות נכנסין דרך פתחים", its
    // verse II Chr 29:16 (Hezekiah - the First Temple); the Rambam, Beit HaBechirah 4:13 and 7:23 (337:74, 133); the Ra'avyah in the
    // Tosafot Yom Tov (via Sha'arei Torat Bavel on Pesachim 26a): the boxes "פרוצות מרוח אחת" so that he works standing in the box.
    // The scene: the house cut along its axis (the south half off); in the room over the devir a lul opens in its floor; a box comes
    // down through it on two ropes along the north wall to the place of the breach; the craftsman - a priest (the Tosefta's first) -
    // works at the wall through the box's open side; the breach is mended; the box goes up. MODEL CHOICES: the lul's place (near the
    // east end of the north wall, clear of the cherubim's wings) and size, the box's size, wood and see-through walls (so the man in it
    // is seen), the ropes and the windlass, the breach, the timing and the eye. In a reading where the devir is thirty high the scene
    // is shown in Rashi's (twenty, the room above it) and the reading comes back at the end (the First Temple; OPT.devirHeight). Both houses
    // (shared/frag/omanin.js): OPT = { x, floor, fig(), devirHeight, lastCap }.
  function omaninSetup(ctx, OPT) {
    {
      const OM = { built: false, run: false, saved: null };
      const og = new Group();
      og.name = "omaninDemo";
      og.visible = false;
      ctx.root.add(og);
      const XL = OPT.x, BW = 1.4, BD = 1.3;   // the lul's x (each house its own); the box: width (x), depth (z)
      let ZW = -9.8;                              // the north wall's face (measured at the start)   // the lul's x; the north wall's gold face; the box: width (x), depth (z)
      let ZB = ZW + BD / 2 + 0.06;
      const wood = new MeshStandardMaterial({ color: 0x8a5a32, roughness: 0.85, transparent: true, opacity: 0.42, depthWrite: false, side: DoubleSide });
      const woodS = new MeshStandardMaterial({ color: 0x7a4c28, roughness: 0.85 });
      const rope = new MeshStandardMaterial({ color: 0xcdb78a, roughness: 0.95 });
      const dark = new MeshStandardMaterial({ color: 0x1c140c, roughness: 1 });
      const crackM = new MeshStandardMaterial({ color: 0x4a3a24, roughness: 1, transparent: true, opacity: 1 });
      const ray = new Raycaster();
      const hitY = (x, y, z, up) => {   // the first visible mesh above / below a point in the house (not the scene's own)
        ray.set(new Vector3(x, y, z), new Vector3(0, up ? 1 : -1, 0));
        ray.camera = ctx.camera;
        const hs = ray.intersectObjects(ctx.root.children, true).filter((h) => { if (!h.object.isMesh || h.object.isInstancedMesh) return false; for (let p = h.object; p; p = p.parent) { if (p.visible === false || p === og) return false; } return true; });
        return hs.length ? hs[0].point.y : null;
      };
      const build = () => {
        if (OM.built) return;
        OM.built = true;
        const FH = 3.54;   // the scale figure's height (SCALE_FIG_A2)
        const BH = FH + 0.35;
        const box = OM.box = new Group();
        box.name = "omaninBoxHanging";   // HANGING_461: the scan's figure check takes it as hanging
        const wall = (w, h, d, x, y, z, m) => { const q = new Mesh(new BoxGeometry(w, h, d), m || wood); q.position.set(x, y, z); box.add(q); return q; };
        wall(BW, 0.1, BD, 0, 0.05, 0, woodS);                       // the floor
        wall(BW, 0.08, BD, 0, BH, 0, woodS);                        // the roof
        wall(BW, BH, 0.07, 0, BH / 2, BD / 2);                      // the back (south) - see-through (model choice)
        wall(0.07, BH, BD, -BW / 2, BH / 2, 0); wall(0.07, BH, BD, BW / 2, BH / 2, 0);   // the sides
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) wall(0.09, BH, 0.09, sx * (BW / 2 - 0.04), BH / 2, sz * (BD / 2 - 0.04), woodS);   // the corner posts
        // the open side is the north (against the wall) - "פרוצות מרוח אחת"
        const p = OM.man = OPT.fig();   // { g, work(on, t) } - the house's own priest
        p.g.rotation.y = Math.PI;   // facing north, the wall
        p.g.position.set(0, 0.1, 0.05);
        box.add(p.g);
        og.add(box);
        // the ropes: from the roof's two ends up to the windlass in the room above
        OM.ropes = [-1, 1].map((s) => { const r = new Mesh(new CylinderGeometry(0.035, 0.035, 1, 6), rope); r.position.x = s * (BW / 2 - 0.15); og.add(r); return r; });
        // the lul: a dark square in the devir's ceiling and in the room's floor, with a wooden rim; the windlass over it
        OM.lul = new Group();
        const LS = BW + 0.5;
        for (const k of [0, 1]) {
          const d = new Mesh(new BoxGeometry(LS, 0.04, BD + 0.5), dark); d.userData.k = k; OM.lul.add(d);
        }
        const rimG = new Group(); OM.lul.add(rimG); OM.rim = rimG;
        for (const sz of [-1, 1]) { const r = new Mesh(new BoxGeometry(LS + 0.3, 0.16, 0.15), woodS); r.position.z = sz * (BD + 0.5) / 2; rimG.add(r); }
        for (const sx of [-1, 1]) { const r = new Mesh(new BoxGeometry(0.15, 0.16, BD + 0.5), woodS); r.position.x = sx * (LS / 2); rimG.add(r); }
        const wl = OM.windlass = new Group();
        for (const sx of [-1, 1]) { const post = new Mesh(new BoxGeometry(0.18, 5.0, 0.18), woodS); post.position.set(sx * (LS / 2 + 0.25), 2.5, 0); wl.add(post); }
        const drum = new Mesh(new CylinderGeometry(0.16, 0.16, LS + 0.5, 12), woodS); drum.rotation.z = Math.PI / 2; drum.position.y = 4.8; wl.add(drum); OM.drum = drum;
        OM.lul.add(wl);
        og.add(OM.lul);
        // the breach in the wall, mended while he works
        OM.crack = new Mesh(new PlaneGeometry(0.9, 0.7), crackM);
        OM.crack.position.set(XL, 0, ZW + 0.025);
        og.add(OM.crack);
      };
      const T = { down0: 4, down1: 15, work0: 16, work1: 30, up0: 31, up1: 41, end: 44 };
      const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
      const G = { floor: 12, ceil: 32, room: 42 };
      const geom = () => {   // the devir's floor, its ceiling and the room's ceiling at the lul (the slope and the reading of this moment)
        const F0 = OPT.floor;
        { ray.set(new Vector3(XL, F0 + 6, -3), new Vector3(0, 0, -1)); ray.camera = ctx.camera;   // the north wall's face
          const hs = ray.intersectObjects(ctx.root.children, true).filter((h) => { if (!h.object.isMesh || h.object.isInstancedMesh) return false; for (let p = h.object; p; p = p.parent) { if (p.visible === false || p === og) return false; } return true; });
          if (hs.length && hs[0].point.z < -6 && hs[0].point.z > -12) { ZW = hs[0].point.z; ZB = ZW + BD / 2 + 0.06; OM.crack && OM.crack.position.setZ(ZW + 0.025); } }
        const fl = hitY(XL, F0 + 4, ZB, false), ce = hitY(XL, F0 + 4, ZB, true);
        G.floor = fl != null ? fl : F0;
        G.ceil = ce != null && ce < G.floor + 48 ? ce : G.floor + 20;
        const rm = hitY(XL, G.ceil + 1.2, ZB, true);
        G.room = rm != null && rm < G.ceil + 14 ? rm : G.ceil + 10;
        const up = hitY(XL, G.ceil + 6, ZB, false);   // the room's floor over the devir's ceiling: the box stands on it
        G.upFloor = up != null && up > G.ceil - 0.05 && up < G.ceil + 6 ? up : G.ceil + 0.35;
      };
      const workY = () => G.floor + 3.2;   // the box's floor at the breach (model choice)
      const apply = (t) => {
        if (!OM.built) return;
        const top = (G.upFloor || G.ceil + 0.35) + 0.01, low = workY();
        const y = t < T.down0 ? top : t < T.down1 ? top + (low - top) * ease((t - T.down0) / (T.down1 - T.down0)) : t < T.up0 ? low : t < T.up1 ? low + (top - low) * ease((t - T.up0) / (T.up1 - T.up0)) : top;
        OM.box.position.set(XL, y, ZB);
        const ry = OM.box.position.y + 3.89, wy = (G.upFloor || G.ceil + 0.35) + 4.8;
        for (const r of OM.ropes) { r.position.y = (ry + wy) / 2; r.position.z = ZB; r.position.x = XL + Math.sign(r.position.x - XL || r.position.x) * (BW / 2 - 0.15); r.scale.y = Math.max(0.05, wy - ry); }
        OM.drum.rotation.x = -(y - top) * 2.2;
        OM.lul.position.set(XL, G.ceil, ZB);
        const uf = (G.upFloor || G.ceil + 0.35) - G.ceil;   // the room's floor over the ceiling (the slab between)
        OM.lul.children[0].position.y = -0.03; OM.lul.children[1].position.y = uf + 0.03;
        OM.rim.position.y = uf + 0.08;
        OM.windlass.position.y = uf;
        // the craftsman's arms: at the wall while he works
        OM.man.work(t > T.work0 && t < T.work1, t);
        // the breach: at his hands' height; mended through the work
        OM.crack.position.y = low + 2.6;
        OM.crack.material.opacity = t < T.work0 ? 1 : t > T.work1 ? 0 : 1 - ease((t - T.work0) / (T.work1 - T.work0));
        OM.crack.visible = OM.crack.material.opacity > 0.01;
      };
      const caps = [
        [0, "״ולולין היו פתוחין בעליה לבית קדש הקדשים, שבהן היו משלשלין את האמנים בתבות״ (משנה מדות ד, ה). רש״י (פסחים כו.): ״לול — ארובה שבעלייה היורדת לבית״"],
        [T.down0, "״האומנין — כשיש בדק בחומת בית קדשי הקדשים״ (רש״י פסחים כו.)"],
        [T.work0 - 1, "״מצוה בכהנים... מצוה בטהורים... מצוה בתמימין; מצוה שיכנסו בתיבות, אין שם תיבות נכנסין דרך פתחים״ (תוספתא כלים בבא קמא א, ט; רמב״ם בית הבחירה ז, כג). והתיבה ״פרוצות מרוח אחת״, כדי שיעשה מלאכתו כשהוא עומד בה (ראבי״ה, הובא בתוספות יום טוב)"],
        [T.up0 - 1, "״כדי שלא יזונו עיניהן מבית קדשי הקדשים״ (משנה מדות ד, ה). רש״י: ״יזונו — לשון הנאה, כמזונות שמשביע עצמו ממראית נוי המלאכה ונהנה״"],
        [T.up1, OPT.lastCap]
      ];
      const keysNow = () => {
        const lw = workY(), UF = G.upFloor || G.ceil + 0.35;
        return [[0, [XL - 5, UF + 4, 6], [XL, UF + 1.5, ZB]], [T.down0 - 0.5, [XL - 5, UF + 4, 6], [XL, UF + 1.5, ZB]],
          [T.down1, [XL - 4, lw + 4, -1], [XL, lw + 2.2, ZB]], [T.work0 + 3, [XL - 3, lw + 3, -2.5], [XL, lw + 2.6, ZB]],
          [T.work1, [XL - 3, lw + 3, -2.5], [XL, lw + 2.6, ZB]], [T.up0 + 3, [XL - 6, lw + 6, 13], [XL, lw + 6, ZB]],
          [T.up1, [XL - 5, UF + 4, 6], [XL, UF + 1.5, ZB]], [T.end, [XL - 5, UF + 4, 6], [XL, UF + 1.5, ZB]]];
      };
      const W = () => ctx.shared.walk;
      const leave = () => {
        if (!OM.saved) return;
        const s = OM.saved; OM.saved = null;
        og.visible = false;
        const DH = OPT.devirHeight ? ctx.shared.devirHeight : null;
        if (DH && s.dh && DH.mode !== s.dh) DH.set(s.dh);
        try { ctx.shared.sectionFor("z", 0, 1500); } catch (_) {}
        if (ctx.ui && typeof ctx.ui.setCloud === "function") ctx.ui.setCloud(s.cloud);
      };
      const finish = () => { OM.run = false; leave(); };
      const start = () => {
        const Wk = W();
        if (!Wk) return false;
        build();
        if (typeof ctx.shared.stopDemos === "function") ctx.shared.stopDemos("omaninDemo");
        if (!OM.saved) {
          const DH = OPT.devirHeight ? ctx.shared.devirHeight : null;
          OM.saved = { dh: DH ? DH.mode : null, cloud: !!(ctx.ui && typeof ctx.ui.cloudOn === "function" && ctx.ui.cloudOn()) };
          if (DH && DH.mode !== "rashi") DH.set("rashi");
        }
        if (ctx.ui && typeof ctx.ui.setCloud === "function") ctx.ui.setCloud(false);
        try { if (typeof setCutaway === "function") setCutaway(false); } catch (_) {}
        try { ctx.shared.sectionFor("z", 0, (T.end + 6) * 1000 * (ctx.shared.demoSlow || 1.5)); } catch (_) {}
        geom();
        og.visible = true;
        OM.run = true;
        apply(0);
        Wk.run(keysNow(), caps, finish);
        return true;
      };
      const demo = () => {
        const U = ctx.ui;
        if (U && typeof U.cloudOn === "function" && U.cloudOn() && typeof U.askCloud === "function") { U.askCloud(() => start(), () => {}); return true; }
        return start();
      };
      const stop = () => { if (!OM.run) return; const Wk = W(); if (Wk && Wk.on) Wk.stop(); else finish(); };
      ctx.animated.push(() => { if (!OM.run) return; const Wk = W(); const t = Wk && typeof Wk.now === "function" ? Wk.now() : 0; apply(Math.max(0, t)); });
      const walkEntry = () => (ctx.shared.demoStops || []).find((d) => d.id === "walk");
      (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({
        id: "omaninDemo", running: () => OM.run, stop,
        pause: () => { const w = walkEntry(); if (w) w.pause(); },
        resume: () => { const w = walkEntry(); if (w) w.resume(); },
        paused: () => { const w = walkEntry(); return !!(w && w.paused()); },
        restart: () => { stop(); start(); }
      });
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({
        id: "omaninDemo", label: "הדגמה: הורדת האומנין בתיבות לקודש הקדשים", labelOn: "עצור את ההדגמה", maxDist: 60,
        title: "״ולולין היו פתוחין בעליה לבית קדש הקדשים, שבהן היו משלשלין את האמנים בתבות, כדי שלא יזונו עיניהן מבית קדשי הקדשים״ (משנה מדות ד, ה).",
        anchor: () => null,   // in the group "הדגמות" only (the user: no pill over the model)
        get: () => OM.run,
        set: (on) => { if (on) demo(); else stop(); }
      });
      ctx.shared.omaninDemo = { demo, stop, T, G, at: (t) => { build(); geom(); og.visible = true; apply(t); } };
    }
  }
