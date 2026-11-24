  // plugin/js/payis.js
  // ===== Beit Sheni 1.9.5 (PAYIS_195): THE FOUR LOTTERIES AND "ברקאי" - A DEMONSTRATION WITH CAPTIONS, IN A NIGHT THAT TURNS TO DAY =====
  // The user (11.11.2026), on the question whether to draw the priests standing for the lottery in the Gazit's east half:
  //   21:21 "לצייר פיס אבל לא כברירת מחדל אלא כמתג + הפעלת כתוביות והדגמה מפורטת מה היה (אל תעשה קול - אלא מה שצורך קול בכתובית)"
  //   21:21 "כל הפיסות לפי הסדר לא לדלג על אף אחד"
  //   21:23 (dictated): add "אמר להם הממונה צאו וראו... הרואה אומר ברקאי" - someone goes up, find where; "צריך שיהיה מצב לילה כמובן"
  //   21:40 "שתי שיטות" - where and when the FIRST lottery is held is a row of the opinions table (rows_200.py part 14):
  //         "rambam" (the default, provisional - he was asked): Hilchot Temidin 6:1 "ויבואו ויעמדו בלשכת הגזית. ויפיסו פיס ראשון ושני";
  //         "tamid": the Mishnah's order (Tamid 1:2) as the Tiferet Yisrael reads it (Yachin, Tamid 1:35) - the first lottery at night
  //         in Beit HaMoked's holy half, "ועדיין לא היו הסנהדרין בגזית"; the other three in the Gazit.
  //   21:39 "ברור שהיה רק בבית שני" - nothing of this in the First Temple's model.
  // NOTHING IS SHOWN BY DEFAULT: the switch is the model button "crt-payis-demo" (and the panel's place "הפייסות — הדגמה"); a press
  // on the model, a second press on the button or any other switch (ctx.shared.demoStops) ends it and gives the day back.
  // EVERY CAPTION IS A SOURCE'S OWN WORDS, read in the user's library on 11.11.2026 (qa/fs/LIB_1111.md, "21:30–21:50"; book:line):
  //   Mishnah Tamid 1:2-3, 2:5, 3:1-2, 4:3, 5:2 (88:3-4, 11, 13-14, 25, 28); Yoma 2:1, 2:4, 3:1 (55:11, 14, 19); Yoma 23a (107:519),
  //   25a (107:580); Rashi Yoma 22a (2157:741), 28a (2157:1005, 1010); Rambam, Temidin 4:6-7, 6:1 (344:60-61, 87).
  // MODEL CHOICES (the sources give none of them): eighteen priests in the ring; the numbers counted (sixty and a hundred - Rashi's
  // own examples "או מאה או ששים"); eight "new ones" for the incense; the figures' shape; the torches' way round the court; the
  // watcher's place - Rashi: "על החומה או על הגג", "זה שעלה לגג"; the Bartenura and the Rambam: "מקום גבוה שהיה להם במקדש"; the
  // Meiri: "על החומה או על גג העזרה" - here the top of the court's east wall over the Gazit, by two ladders; the timing.
  // NOT DECIDED HERE, TOLD IN THE CARD: in what clothes (Yoma 24b: R. Nachman - weekday clothes, R. Sheshet - the holy garments; the
  // Rambam as R. Sheshet - so the figures wear the mitznefet the baraita speaks of); who names the number (Rashi and the Bartenura:
  // the appointed one; the Rambam: they agree on it; the Ritva after Tosafot: an elder or another priest); the count's direction
  // (Yerushalmi Yoma 2:1); R. Eliezer ben Yaakov, who has no fourth lottery (Tamid 5:2).
  async function buildPayis(ctx2) {
    const { M: M2, LV } = ctx2;
    const SH = ctx2.shared;
    const FYG0 = (ctx2.shared.gazitFloor != null ? ctx2.shared.gazitFloor : LV.KOH) + 0.02;
    let FYG = FYG0;   // ISRAEL_LIFT_N2: + ctx2.shared.israelLift() (2.5 in the first Tanna's reading of the pispasin - the hall rises with the court of Israel), refreshed at each start   // the Gazit hall's floor (30-courts.js; GAZIT_FLOOR_B2 - 13.5 from 22.11.2026, 16 until then)
    const g = new Group();
    g.name = "payisDemo";
    g.visible = false;
    ctx2.root.add(g);
    //@@include hand
    //@@include strap
    //@@include priest-kit
    SH.priestKit = { FS, HEAD_Y, HAT_Y, SH_X, SH_Y, UP, FORE, HR, sph, at, rot, white, gRobeBody, gSash, gHat, gCap, headOn, hairGeo, handRaw, handWr, handAt, mHand, footGeo,
      WAIST, gRobeLow, gRobeUp, bZ, spl,
      mat, mRobe, mSkin, mHat, mSashDyed, mSashWhite, mBeards,
      MIG, TEF, tefSet, tefOn, tefArm, gTefR, mTef, kidHands, kidHZ, kidLegs, kidBody, headBare };   // HANDS_K: kidBody (KIDDUSH_CROUCH_K)   // MIGBAAT_A2, TEFILLIN_A2; FACE_E: headBare
    // HP_KIT_A2: the high priest in his eight and the priest in his four - one construction for both houses (shared/frag/hp-kit.js): the
    // morning service's high priest (55-tamid.js) and "בגדי הכהנים" (below); built when first asked
    //@@include hp-kit
    SH.hpKit = () => hpKit(SH.priestKit);
    // HP_KIT_A2 (the user via the coordinator: "מתג כזה תעשה גם בבית שני"): "בגדי הכהנים" - a priest in his four garments and the high
    // priest in his eight, side by side between the ulam and the altar, facing east, as in the First Temple (58-ark.js): the same pair
    // (hpKit pair), its readings - the avnet of the common priest (Yoma 12b), the ephod and the mitznefet - set from the opinions table.
    // ctx.shared.priestGarments = { on, set(on), reading(o), state }
    {
      const PG = new Group();
      PG.name = "priestGarments";
      PG.visible = false;
      ctx2.root.add(PG);
      ctx2.layers.priestGarments = PG;
      // on the lower landing of the steps between the ulam and the altar ("אמה אמה ורובד שלש", Middot 3:6 - x 31..34, 2 amot above the
      // court; 30-courts.js), 7 amot west of the altar's west face (x 39.5) - model choice
      const X = 32.5, Y = LV.KOH + 2, Z = 14;
      let P = null;
      const want = { belt: "kilayim", ephod: "rashi", mitz: "rashi" };
      const PGI = { info: "בגדי הכהנים — הפירוט בתפריט, תחת ״הכהנים״: ״בגדי הכהנים — כהן הדיוט וכהן גדול״.", refs: [["רמב״ם כלי המקדש ח, א", { book: 338, index: 123 }], ["רמב״ם כלי המקדש ח, ב", { book: 338, index: 124 }]] };
      ctx2.labels.push(Object.assign({ text: "כהן הדיוט — ארבעה בגדים", x: X, y: Y + 3.9, z: Z - 1.4, size: 0.5, kMin: 0.32, layer: "priestGarments" }, PGI),
        Object.assign({ text: "כהן גדול — שמונה בגדים", x: X, y: Y + 4.35, z: Z + 1.4, size: 0.5, kMin: 0.32, layer: "priestGarments" }, PGI));
      SH.priestGarments = {
        get on() { return PG.visible; },
        get state() { return Object.assign({}, want); },
        reading(o) { Object.assign(want, o || {}); if (P) P.set(want); return Object.assign({}, want); },
        set(on) {
          if (on && !P) { P = SH.hpKit().pair(); P.g.position.set(X, Y, Z); PG.add(P.g); P.set(want); }
          PG.visible = !!on;
          return PG.visible;
        }
      };
    }
    // TEFILLIN_A2 (fix-a2; the user, 22.11.2026 01:04: "תפילין — אין לאף אחד בשבת, ביום טוב... ובחול המועד", nor by night): the
    // priests' tefillin (the kit's, and the morning service's - 55-tamid.js) are hidden while any reason in SH.tefOff stands - this
    // demonstration's night (until the dawn), the morning service's night (55-tamid.js applySky), and the High Priest's entry on
    // Yom Kippur (50-heichal.js ykEntry); by day they are seen
    SH.tefOff = SH.tefOff || new Set();
    ctx2.animated.push(() => {
      const off = SH.tefOff.size > 0 || !!(SH.ykEntry && SH.ykEntry.on);
      if (TEF.on === off) tefSet(!off);
    });
    const figure = (robe, sash, beard) => {
      const f = new Group(), n = beard || 0;
      const body = new Mesh(gRobe, robe);
      body.castShadow = true;
      f.add(body);
      f.add(new Mesh(gSkinStill, mSkin), new Mesh(gHandStill, mHand));
      if (sash) { const sm = new Mesh(gSash, mSashDyed); f.add(sm); SASHES.push(sm); }
      // (every priest a little different: the turn of his head, his height)
      const yaw = (rnd() - 0.5) * 0.5;
      const hg = headOn(f, HEAD_Y, mBeards[n % mBeards.length], n);
      hg.rotation.set((rnd() - 0.5) * 0.1, yaw, (rnd() - 0.5) * 0.07);
      tefOn(hg);   // TEFILLIN_A2
      const hat = new Group();
      hat.add(new Mesh(gHat, mHat));
      hat.position.y = HAT_Y;
      hat.rotation.y = yaw + (rnd() - 0.5) * 0.9;
      f.add(hat);
      const armR = new Group();
      armR.position.set(-SH_X, SH_Y, 0);
      armR.rotation.set(ARM_DOWN[0], 0, ARM_DOWN[1]);
      armR.add(new Mesh(gSleeve, robe));
      const hOpen = new Mesh(gHandOpen, mHand), hPoint = new Mesh(gHandPoint, mHand);
      hPoint.visible = false;
      armR.add(hOpen);
      armR.add(hPoint);
      f.add(armR);
      const hand = { on: false, get visible() { return this.on; }, set visible(v) { this.on = !!v; const a = v ? ARM_OUT : ARM_DOWN; armR.rotation.set(a[0], 0, a[1]); hOpen.visible = !v; hPoint.visible = !!v; } };
      // PAYIS_WHITE: the winner's mark - an arrow over his head (the garments are all white)
      const arrow = new Group();
      const ah = new Mesh(gArrowHead, mArrow), as = new Mesh(gArrowShaft, mArrow);
      ah.position.y = 0.2;
      as.position.y = 0.56;
      arrow.add(ah);
      arrow.add(as);
      arrow.position.y = ARROW_Y;
      arrow.visible = false;
      f.add(arrow);
      f.userData = { body, hat, hand, robe, arrow, tip: new Vector3(-SH_X, 1.49, 0.8) };
      f.scale.setScalar(FS * (0.97 + rnd() * 0.06));
      g.add(f);
      return f;
    };
    const face = (f, x, z) => { f.rotation.y = Math.atan2(x - f.position.x, z - f.position.z); };
    const torch = () => {
      const t = new Group();
      t.add(new Mesh(gStick, M2.cedar));
      // TORCHES_LIVE_N3 (the user: "כל הלפידים צריכים להיות באש חיה כמו במזבח"): the altar's live fire on the stick's head (40-altar.js, SH.liveFlame)
      const fl = typeof SH.liveFlame === "function" ? SH.liveFlame(t, 0, 1.15, 0, 0.3, 1.0, 0.95) : (() => { const c = new Mesh(gFlame, mFlame); c.position.y = 1.3; t.add(c); return c; })();
      const L = new PointLight(0xffa040, 0, 46, 1.6);
      L.position.y = 3.3;   // above the heads, so that the faces and the mitznefet are lit
      t.add(L);
      t.userData = { light: L, flame: fl };
      t.scale.setScalar(FS);
      t.visible = false;
      g.add(t);
      return t;
    };
    const N = 18, NEW = 8;
    const K = Array.from({ length: N }, (_, i) => figure(mRobe, true, i));
    const MEM = figure(mRobe, true, 0);              // the appointed one over the lotteries
    const WATCH = figure(mRobe, true, 3);            // "הרואה"
    const ELDER = new Group();                       // "וזקן יושב במערבה" - seated, in the unconsecrated half
    {
      const b = new Mesh(new CylinderGeometry(0.24, 0.36, 1.05, 10), mElder);
      b.position.y = 0.95;
      ELDER.add(b);
      const st = new Mesh(new BoxGeometry(0.8, 0.42, 0.8), M2.cedar);
      st.position.y = 0.21;
      ELDER.add(st);
      tefOn(headOn(ELDER, 1.645, mBeardOld));   // TEFILLIN_A2 (an elder of the priests)
      const cap = new Mesh(gCap, mElder);
      cap.position.y = 1.645;
      ELDER.add(cap);
      ELDER.position.set(81.7, FYG, -67);   // NORTH_CHAMBERS_N2: the hall is x 76..91 now - the elder sits by the half oval's chord (x 83.5)
      ELDER.scale.setScalar(FS);
      g.add(ELDER);
    }
    // SCALE_FIG_A2 (fix-a2, 22.11.2026; the user's decision 23): A FIGURE FOR SCALE - one priest, 170 cm tall in an amah of 48 cm =
    // 3.54 amot to the top of his head (the user's numbers: "גובה אדם ממוצע... באמה של 48 ס״מ — בחירת מודל"), in his garments, with the
    // head's tefillin (a weekday, by day). He stands on the floor a little to the right of what one looks at (a fifth of the view's
    // distance, 1.5 to 12 amot; the floor found under a point 2.5 amot over the target - not a roof over it), facing the eye, and goes with the view. Built when first asked (the lots' figures' sequence untouched).
    // SH.scaleFigure = { on, set(on) } - the row "דמות לקנה מידה" (70-ui.js). Where he stands - a model choice.
    {
      const SCALE_H = 3.54, SF = { on: false, f: null, at: new Vector3(Infinity, 0, 0), tg: new Vector3(Infinity, 0, 0) };
      const vR = new Vector3();
      const place = () => {
        const cam = ctx2.camera, oc = ctx2.controls;
        if (!cam || !oc || !SF.f) return;
        if (SF.at.distanceToSquared(cam.position) < 1e-6 && SF.tg.distanceToSquared(oc.target) < 1e-6) return;
        SF.at.copy(cam.position); SF.tg.copy(oc.target);
        const dx = oc.target.x - cam.position.x, dz = oc.target.z - cam.position.z, L = Math.hypot(dx, dz) || 1;
        const off = Math.max(1.5, Math.min(12, cam.position.distanceTo(oc.target) * 0.2));
        vR.set(-dz / L, 0, dx / L);   // the view's right
        let x = oc.target.x + vR.x * off, z = oc.target.z + vR.z * off;
        // SCALE_PLACE_H (fix-h, the user 23.11.2026, on the close views of the priests' garments: "מה אני אמור לראות פה?" - the figure stood
        // over the camera, the eye inside his robe): never nearer to the eye than 3.5 amot - in a close view he steps back, beyond the target
        { const ex = x - cam.position.x, ez = z - cam.position.z, d0 = Math.hypot(ex, ez), MIN = 3.5;
          if (d0 < MIN) { const k = Math.sqrt(Math.max(0, MIN * MIN - off * off)) - (ex * dx + ez * dz) / L; x += (dx / L) * Math.max(0, k); z += (dz / L) * Math.max(0, k); } }
        // (and the floor under him not higher than the target's own level: a ledge or a cornice over the target is no floor for him)
        const fAt = (px, pz) => { let f = typeof SH.floorY === "function" ? SH.floorY(px, oc.target.y + 2.5, pz) : -Infinity; if (isFinite(f) && f > oc.target.y + 0.5 && typeof SH.floorY === "function") f = SH.floorY(px, oc.target.y + 0.5, pz); return f; };
        // SCALE_FLAT_420 (the user 24.11.2026: "כהן בקנה מידה אם מסתובבים קצת - רואים שהוא עומד באוויר"): his whole footprint on one floor -
        // the floor found under his two feet and before and behind them (0.45 round his centre) must agree within 0.2; if not (a step's
        // edge, a ledge, the void), he moves along the view's right and left, half an amah at a time, to the nearest flat place
        const flatAt = (px, pz) => { const c = fAt(px, pz); if (!isFinite(c)) return null; for (const [ax, az] of [[0.45, 0], [-0.45, 0], [0, 0.45], [0, -0.45]]) { const q = fAt(px + ax, pz + az); if (!isFinite(q) || Math.abs(q - c) > 0.2) return null; } return c; };
        let fy = flatAt(x, z);
        if (fy === null) {
          for (let k = 1; k <= 12 && fy === null; k++) for (const sg of [1, -1]) { const tx = x + vR.x * 0.5 * k * sg, tz = z + vR.z * 0.5 * k * sg, f = flatAt(tx, tz); if (f !== null) { x = tx; z = tz; fy = f; break; } }
        }
        if (fy === null) fy = fAt(x, z);
        SF.f.position.set(x, isFinite(fy) ? fy : oc.target.y, z);
        SF.f.rotation.y = Math.atan2(cam.position.x - x, cam.position.z - z);
      };
      SH.scaleFigure = {
        get on() { return SF.on; },
        set(on) {
          SF.on = !!on;
          if (SF.on && !SF.f) {
            const f = figure(mRobe, true, 2);
            if (f.parent) f.parent.remove(f);
            f.scale.setScalar(SCALE_H / (HEAD_Y + HR[1]));
            f.name = "scaleFigure";
            f.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
            f.userData.hand.visible = false;
            (ctx2.root || ctx2.scene).add(f);
            SF.f = f;
          }
          if (SF.f) { SF.f.visible = SF.on; SF.at.set(Infinity, 0, 0); place(); }
          return SF.on;
        }
      };
      ctx2.animated.push(() => { if (SF.on) place(); });
    }
    const T1 = torch(), T2 = torch(), T3 = torch(), T4 = torch();
    // TORCHES_HELD_N3 (fix-n3, 24.11.2026 - the user, of a picture where a priest stood beside a torch and did not carry it; Tamid 1:3, 88:? "ונכנסו אחריו ושתי אבוקות של אור
    // בידם"; 3:4 "מבקרין אותו לאור האבוקות"): every torch of this demonstration is held in the hand of a priest who walks (or stands) with it - the torch is his hand's child, his arm
    // out - and no torch walks alone or stands on the floor. A torch's track and its "visible" are the carrier's (see the tracks' loop and syncCar below)
    const CAR = [T1, T2, T3, T4].map((T, i) => {
      const f = figure(mRobe, true, i + 5);
      f.visible = false; g.add(f);
      f.userData.hand.visible = true;
      f.add(T); T.scale.setScalar(1); T.position.set(-SH_X, 1.12, 0.62); T.rotation.set(0.12, 0, 0);
      T.userData.carrier = f;
      return f;
    });
    const syncCar = () => { for (const x of [T1, T2, T3, T4]) x.userData.carrier.visible = x.visible; };
    const MARK = new Mesh(new SphereGeometry(0.14, 10, 8), mMark);
    MARK.visible = false;
    g.add(MARK);
    // two ladders for the watcher: from the court of Israel to the Gazit's roof, and from the roof to the top of the east wall
    const ladder = (x0, y0, z0, x1, y1, z1) => {
      const L = new Group();
      const len = Math.hypot(x1 - x0, y1 - y0, z1 - z0), n = Math.max(3, Math.round(len / 1.1));
      for (const s of [-0.45, 0.45]) {
        const r = new Mesh(new BoxGeometry(0.14, len, 0.14), M2.cedar);
        r.position.set(s, len / 2, 0);
        L.add(r);
      }
      for (let i = 1; i < n; i++) {
        const r = new Mesh(new BoxGeometry(0.9, 0.09, 0.09), M2.cedar);
        r.position.set(0, i * len / n, 0);
        L.add(r);
      }
      L.position.set(x0, y0, z0);
      L.lookAt(x1, y1, z1);
      L.rotateX(Math.PI / 2);
      g.add(L);
      return L;
    };
    const WX = 93.5, WY = 40.9, WZ = -60;            // the watcher's stand: the top of the court's east wall
    const RY = 30.4;                                 // the Gazit's roof
    ladder(89.4, 13.5, -51.4, 89.4, RY, -54.6);
    ladder(89.9, RY, WZ, 91.3, WY, WZ);
    // ---------- small text sprites over the winners (the UI's label painter; none if it is not there)
    const tags = [];
    const tagPool = new Map();
    const tag = (text, size) => {
      if (typeof ui_makeLabelSprite !== "function") return null;
      // Replays/seeks hide the old winners. Reuse their canvas, texture and sprite;
      // retain separate copies when the same caption is visible more than once.
      const key = JSON.stringify([text, size || 0.55]);
      const pool = tagPool.get(key);
      const spare = pool && pool.find((s) => !s.visible);
      if (spare) return spare;
      let s = null;
      try { s = ui_makeLabelSprite(text, size || 0.55); } catch (_) { s = null; }
      if (!s) return null;
      s.material.depthTest = false;
      s.renderOrder = 20;
      s.visible = false;
      g.add(s);
      tags.push(s);
      if (pool) pool.push(s); else tagPool.set(key, [s]);
      return s;
    };
    // ---------- the night: the sky's sun under the eastern horizon, the lights low, no environment; then the dawn, the morning, the day back
    const NIGHT = (() => {
      let sky = null, sun = null, hemi = null, saved = null, envOff = false;
      const P = {
        // NIGHT_CLEAR_208: a clear night for a presentation (was hemI 0.46-0.6, ground 0x0b0e18-0x1c1c26, exp 0.9 - places were black)
        night: { el: -16, az: 0.15, sunI: 0.5, sunC: 0x8fa6d8, hemI: 1.35, hemC: 0x7f8fc4, gndC: 0x3d4668, fog: 0x0a0f1c, exp: 1.0 },
        alot: { el: -11, az: 0.15, sunI: 0.5, sunC: 0x94a9d8, hemI: 1.35, hemC: 0x7f8fc4, gndC: 0x3d4668, fog: 0x121829, exp: 1.0 },
        barkai: { el: -7, az: 0.15, sunI: 0.55, sunC: 0x9fb0d8, hemI: 1.35, hemC: 0x8494c4, gndC: 0x424a6a, fog: 0x1a2238, exp: 1.0 },
        heir: { el: -2, az: 0.15, sunI: 0.7, sunC: 0xffd9b0, hemI: 1.3, hemC: 0xa0a6c0, gndC: 0x5a5a68, fog: 0x4a4a58, exp: 0.95 },
        morning: { el: 9, az: 0.2, sunI: 1.5, sunC: 0xffe2bd, hemI: 0.62, hemC: 0xa9b3c8, gndC: 0x4a4436, fog: 0x8d8f98, exp: 0.9 }
      };
      const find = () => {
        if (sky && sun && hemi) return true;
        for (const o of ctx2.scene.children) {
          if (o.isDirectionalLight) sun = o;
          else if (o.isHemisphereLight) hemi = o;
          else if (o.material && o.material.uniforms && o.material.uniforms.sunPosition) sky = o;
        }
        return !!(sky && sun && hemi);
      };
      const c1 = new Color(), c2 = new Color();
      const mixHex = (a, b, k) => c1.setHex(a).lerp(c2.setHex(b), k).getHex();
      const apply = (A, B, k) => {
        const L = (a, b) => a + (b - a) * k;
        const el = L(A.el, B.el) * Math.PI / 180;
        sky.material.uniforms.sunPosition.value.set(Math.cos(el), Math.sin(el), L(A.az, B.az));
        sun.intensity = L(A.sunI, B.sunI);
        sun.color.setHex(mixHex(A.sunC, B.sunC, k));
        hemi.intensity = L(A.hemI, B.hemI);
        hemi.color.setHex(mixHex(A.hemC, B.hemC, k));
        hemi.groundColor.setHex(mixHex(A.gndC, B.gndC, k));
        if (ctx2.scene.fog) ctx2.scene.fog.color.setHex(mixHex(A.fog, B.fog, k));
        ctx2.renderer.toneMappingExposure = L(A.exp, B.exp);
      };
      return {
        P,
        begin() {
          if (!find() || saved) return !!saved;
          saved = { sp: sky.material.uniforms.sunPosition.value.clone(), sunI: sun.intensity, sunC: sun.color.getHex(), hemI: hemi.intensity,
            hemC: hemi.color.getHex(), gndC: hemi.groundColor.getHex(), fog: ctx2.scene.fog ? ctx2.scene.fog.color.getHex() : 0,
            exp: ctx2.renderer.toneMappingExposure, env: ctx2.scene.environment, shadow: sun.castShadow };
          return true;
        },
        // the state between two named phases (k 0..1); the environment map is off under the horizon (it lights every stone)
        set(a, b, k) {
          if (!saved) return;
          const A = P[a], B = P[b || a];
          apply(A, B, Math.max(0, Math.min(1, k || 0)));
          const dark = (A.el + (B.el - A.el) * (k || 0)) < 3;
          if (dark !== envOff) {
            envOff = dark;
            ctx2.scene.environment = dark ? null : saved.env;
          }
        },
        end() {
          if (!saved) return;
          sky.material.uniforms.sunPosition.value.copy(saved.sp);
          sun.intensity = saved.sunI;
          sun.color.setHex(saved.sunC);
          hemi.intensity = saved.hemI;
          hemi.color.setHex(saved.hemC);
          hemi.groundColor.setHex(saved.gndC);
          if (ctx2.scene.fog) ctx2.scene.fog.color.setHex(saved.fog);
          ctx2.renderer.toneMappingExposure = saved.exp;
          ctx2.scene.environment = saved.env;
          envOff = false;
          saved = null;
        },
        get on() { return !!saved; }
      };
    })();
    SH.nightKit = NIGHT;   // TAMID_NIGHT_207: the same night for the morning's service (55-tamid.js)
    // ---------- the caption (the walks' look: 50-heichal.js DW)
    // PAYIS_ROUND2: a fixed button over it stops the run and shows its time (the model's pill sat on the scene as the camera moved)
    let capEl = null, capTxt = null, stopEl = null;
    const shown = (el) => { try { return !!el && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().width > 0; } catch (_) { return false; } };
    const capBuild = () => {
      if (capEl) return;
      capEl = document.createElement("div");
      capEl.id = "tm-payis-cap";
      capEl.setAttribute("dir", "rtl");
      Object.assign(capEl.style, { position: "fixed", left: "50%", bottom: "64px", transform: "translateX(-50%)", maxWidth: "min(820px, 78vw)", zIndex: "40",
        display: "none", flexDirection: "column", alignItems: "center", gap: "6px", pointerEvents: "none", userSelect: "none" });
      stopEl = document.createElement("button");
      stopEl.type = "button";
      stopEl.id = "tm-payis-stop";
      Object.assign(stopEl.style, { pointerEvents: "auto", cursor: "pointer", padding: "4px 12px", borderRadius: "14px", border: "1px solid rgba(255,236,170,.85)",
        background: "rgba(201,168,76,.92)", color: "#14110a", font: "12px 'Segoe UI',Arial,sans-serif", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,.4)" });
      stopEl.addEventListener("click", (e) => { e.stopPropagation(); stop(); });
      capTxt = document.createElement("div");
      Object.assign(capTxt.style, { background: "rgba(14,17,28,0.84)", color: "#f4ead0", font: "17px/1.55 var(--font-main, inherit)", padding: "8px 18px",
        borderRadius: "10px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.35)" });
      capEl.appendChild(stopEl);
      capEl.appendChild(capTxt);
      document.body.appendChild(capEl);
    };
    // in the middle of the model's part of the window (beside the panel, not under it)
    const capPlace = () => {
      let x0 = 0, x1 = window.innerWidth;
      try {
        const p = document.getElementById("tm-panel");
        if (shown(p)) {
          const r = p.getBoundingClientRect();
          if (r.width > 40 && r.width < window.innerWidth * 0.6) { if (r.left > window.innerWidth / 2) x1 = r.left; else x0 = r.right; }
        }
      } catch (_) {}
      try {
        const xc = document.getElementById("tm-xcard");
        if (shown(xc) && !xc.classList.contains("min")) {
          const r = xc.getBoundingClientRect();
          let y0 = x0, y1 = x1;
          if (r.right < window.innerWidth * 0.6) y0 = Math.max(y0, r.right); else if (r.left > window.innerWidth * 0.4) y1 = Math.min(y1, r.left);
          if (y1 - y0 >= 300 && r.bottom > window.innerHeight - 190) { x0 = y0; x1 = y1; }
        }
      } catch (_) {}
      capEl.style.left = Math.round((x0 + x1) / 2) + "px";
      capEl.style.maxWidth = Math.max(240, Math.min(820, x1 - x0 - 40)) + "px";
    };
    const caption = (text) => {
      capBuild();
      if (capTxt.textContent !== (text || "")) capTxt.textContent = text || "";
      capTxt.style.display = text ? "block" : "none";
    };
    const mmss = (v) => Math.floor(v / 60) + ":" + String(Math.floor(v % 60)).padStart(2, "0");
    const stopShow = (on, sec, dur) => {
      capBuild();
      if (!on) { capEl.style.display = "none"; return; }
      capPlace();
      const text = "■ עצור את ההדגמה · " + mmss(sec) + " מתוך " + mmss(dur);
      if (stopEl.textContent !== text) stopEl.textContent = text;
      capEl.style.display = "flex";
    };
    // ---------- the places
    const GZ = { x: 86.25, z: -67, r: 2.4, y: FYG };   // NORTH_CHAMBERS_N2: the holy half is 5.5 wide now (10 until now): the ring, r 2.4 (3.9 until now)                       // the ring in the Gazit's east half ("פייס במזרחה")
    const refreshFYG = () => { FYG = FYG0 + (ctx2.shared.israelLift ? ctx2.shared.israelLift() : 0); GZ.y = FYG; ELDER.position.y = FYG; };
    const MK = { x: -18, z: -61.6, r: 3.0, y: LV.KOH };   // FLOOR_211: clear of the hearth, whose southern half now stands on the one floor (z -62.6, r 3.3 until 2.0.1)                 // the ring in Beit HaMoked's holy half (the Tiferet Yisrael)
    const ringAt = (R, i, n) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [R.x + R.r * Math.cos(a), R.y, R.z + R.r * Math.sin(a)]; };
    const ROLES = ["שוחט", "זורק", "מדשן מזבח הפנימי", "מדשן את המנורה", "הראש והרגל", "שתי הידים", "העקץ והרגל", "החזה והגרה", "שתי הדפנות", "הקרבים", "הסלת", "החבתין", "היין"];
    // ---------- the script: built for the reading, in seconds. Parts: cams [t, eye, look, move?] (t = the second the camera ARRIVES; it
    // rests on the pose before and moves in the last three seconds, or `move`), caps [t, text],
    // sky [t, phase a, phase b] (k runs to the next key), tracks { o, keys [t, x, y, z], faceTo? }, ev [t, fn], counts
    const build = (reading) => {
      const S = { cams: [], caps: [], sky: [], tracks: [], ev: [], counts: [], dur: 0, knock: 0, wicketAt: 1e9, dayAt: 1e9 };
      let t = 0;
      const cam = (dt, eye, look, mv, fov) => { S.cams.push([t + dt, eye, look, mv, fov]); };
      const cap = (dt, text) => { S.caps.push([t + dt, text]); };
      const ev = (dt, fn) => { S.ev.push([t + dt, fn]); };
      const track = (o, keys, faceTo) => { S.tracks.push({ o, keys: keys.map((k) => [t + k[0], k[1], k[2], k[3]]), faceTo: faceTo || null }); };
      const sky = (dt, a, b) => { S.sky.push([t + dt, a, b || a]); };
      // the ring forms: the priests come in through a doorway and stand round; n of them, the rest wait outside the view
      const enterRing = (R, from, n, t0, d) => {
        K.forEach((f, i) => {
          if (i >= n) { ev(t0, () => { f.visible = false; }); return; }
          const p = ringAt(R, i, n), s = t0 + (i / n) * d * 0.5;
          ev(t0, () => { f.visible = true; f.userData.hand.visible = false; f.userData.body.material = f.userData.robe; f.userData.hat.position.set(0, HAT_Y, 0); });
          track(f, [[t0, from[0] + (i % 3 - 1) * 0.5, from[1], from[2] + (i % 2) * 0.4], [s, from[0] + (i % 3 - 1) * 0.5, from[1], from[2] + (i % 2) * 0.4], [s + d * 0.5, p[0], p[1], p[2]]], [R.x, R.z]);
        });
      };
      // one lottery in the ring R of n priests: the mitznefet of the one at `start`, the fingers, the count of `num`, the winner(s)
      // [t0 .. t0 + 21 + extra]; returns the time it took
      const lottery = (R, n, start, num, t0, texts, winners) => {
        const sp = ringAt(R, start, n), ax = sp[0] - R.x, az = sp[2] - R.z, al = Math.hypot(ax, az);
        const mx = sp[0] - ax / al * 1.3, mz = sp[2] - az / al * 1.3;       // the appointed one before him, inside the ring
        ev(t0, () => { MEM.visible = true; MARK.visible = false; });
        track(MEM, [[t0, R.x, R.y, R.z], [t0 + 2.2, mx, R.y, mz]], [sp[0], sp[2]]);
        cap(t0, texts.ring);
        cap(t0 + 3, texts.hat);
        // the mitznefet is lifted and put back ("נוטל מצנפת מעל ראשו של אחד מהן ומחזירה" - the Rambam)
        const hat = K[start].userData.hat;
        S.tracks.push({ o: hat, local: true, keys: [[t + t0 + 3.2, 0, HAT_Y, 0], [t + t0 + 4.2, 0, HAT_Y + 0.68, 0.35], [t + t0 + 6.4, 0, HAT_Y + 0.68, 0.35], [t + t0 + 7.4, 0, HAT_Y, 0]] });
        cap(t0 + 8, texts.fingers);
        ev(t0 + 8.6, () => { for (let i = 0; i < n; i++) K[i].userData.hand.visible = true; });
        cap(t0 + 12, texts.num);
        // the count: from the one whose mitznefet was lifted, round and round ("וחוזר חלילה עד סוף המנין" - Rashi)
        const c0 = t0 + 14.5, cd = Math.min(11, 3.5 + num * 0.085);
        S.counts.push({ t0: t + c0, t1: t + c0 + cd, n, start, num, R, text: texts.count });
        ev(c0, () => { MARK.visible = true; });
        const w0 = (start + num - 1) % n, e0 = c0 + cd + 0.3;
        cap(e0, texts.win);
        winners.forEach((role, j) => {
          const idx = (w0 + j) % n;
          ev(e0 + j * 0.55, () => {
            K[idx].userData.arrow.visible = true;
            if (role) {
              const s2 = tag(role, winners.length > 1 ? 0.42 : 0.6);
              if (s2) { const p = ringAt(R, idx, n), out = winners.length > 1 ? 1.25 + (j % 2) * 1.5 : 0; s2.position.set(p[0] + (p[0] - R.x) / R.r * out, R.y + (winners.length > 1 ? 4.25 + (j % 2) * 0.5 : 6.1), p[2] + (p[2] - R.z) / R.r * out); s2.visible = true; }
            }
          });
        });
        const total = (e0 - t0) + winners.length * 0.55 + 4.5;
        ev(t0 + total, () => { for (let i = 0; i < n; i++) K[i].userData.hand.visible = false; MARK.visible = false; });
        return total;
      };
      const clearWins = (dt) => ev(dt, () => { for (const f of K) { f.userData.body.material = f.userData.robe; f.userData.arrow.visible = false; } for (const s2 of tags) s2.visible = false; });
      const T_HAT = "״והממונה בא ונוטל מצנפת מראשו של אחד מהן, ויודעין שממנו פייס מתחיל״ (יומא כה.)";
      const T_FING = "״הממנה אומר להם הצביעו. ומה הן מוציאין, אחת או שתים, ואין מוציאין אגדל במקדש״ (יומא ב, א)";
      const T_RING = "״והכהנים מוקפין ועומדין כמין (ב)כוליאר״ (יומא כה.) — רש״י: ״עגול״";
      const numTxt = (w) => "רש״י: ״ומוציא מפיו מנין או מאה או ששים הרבה יותר משהיו שם הכהנים״ — כאן: " + w;
      const T_WIN = "רש״י: ״ומי שהמנין כלה בו הוא הזוכה וכן לכל הפייסות״";
      // ===== 1. the night; the appointed one comes
      sky(0, "night");
      ev(0, () => { for (const f of K) f.visible = false; MEM.visible = false; WATCH.visible = false; ELDER.visible = false; for (const x of [T1, T2, T3, T4]) x.visible = false; });
      const adj = !!(SH.mokedGates && SH.mokedGates.mode === "adjacent");   // the Rosh's second reading of the house's gates: the gate to the chel in its east wall
      const camOpen = [[30, 62, -150], [-14, 14, -80]];                     // the north side by night: the court's wall, Beit HaMoked and its stairs from the chel
      const camMokedN = [[-18, 37, -110], [-18, 17, -79]];                  // before its gate to the chel
      const camMokedIn = [[-18, 52, -80], [-18, 16.6, -62.8]], camMokedNear = [[-18, 41, -74], [-18, 17, -62.8]];   // into its holy half (the roofs are off)
      const camMokedS = [[-7, 34, -45], [-15.5, 18, -56]];                   // before its gate to the court (PAYIS_EYE_G12: from the side and lower - from straight above the front step hid the torch-bearers as they came out of the wicket)
      const camCourt = [[30, 230, 170], [30, 16, 35]], fovCourt = 38;       // the court from high in the south: the way behind the house and by the south, and the way by the north-east and the east
      const camMeet = [[62, 52, -20], [81, 17, 18]];
      const camGazit = [[86.6, 53, -57.5], [86.3, 16.6, -67.6]], camGazitNear = [[88.8, 37.5, -60.6], [86, 16.2, -65.6]], camGazit13 = [[88.6, 46, -56.6], [86.1, 15.8, -64.8]];   // the ring and the winners' tags above the caption
      // the altar where the rows "מקום המזבח" and "מידות המזבח" now put it (40-altar.js): the ramp's middle line and its shift
      const PL = SH.altarPlace, adz = PL && PL.dz && typeof PL.dz[PL.current] === "number" ? PL.dz[PL.current] : 0;
      const yose = !!(SH.altarMeasures && SH.altarMeasures.mode === "yose"), rx = 55.5 + (yose ? 2 : 0), rz = adz + (yose ? -4 : 0);
      const camAltar = [[70, 62, 65.5 + adz], [56, 20, 15.5 + adz]];   // from the south, over the ramp's foot: its east side (the way up) and its west (the way down) are both seen
      const Y = LV.KOH, YM = LV.AZ;   // the priests' court; the floor of the house's north half and of its gate to the chel
      // the one who won goes up the ramp to the top of the altar, alone and with no light ("מהלך לאור המערכה", Tamid 1:4) - up on the
      // ramp's EAST side and down on its WEST (Yoma 4:5 "בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו"; the user, 12.11.2026:
      // he went up its middle); d seconds (twelve)
      const toAltar = (d) => {
        const f = K[6], xe = rx + 6, xw = rx - 6;
        ev(1.2, () => { for (const x of K) x.visible = false; MEM.visible = false; T1.visible = T2.visible = false; f.visible = true; f.userData.hand.visible = false; f.userData.arrow.visible = true; });
        track(f, [[1.2, xe + 5, Y, 45.4 + rz], [2.6, xe, Y, 43.2 + rz], [6.2, xe, Y + 9, 10.2 + rz], [6.9, rx + 5.1, Y + 9, 7.4 + rz], [7.8, rx + 5.1, Y + 9, 7.4 + rz], [8.5, xw, Y + 9, 10.2 + rz],
          [d - 0.3, xw, Y, 43.2 + rz]]);
        cap(5.2, "״בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו״ (יומא ד, ה)");
        ev(d, () => { f.visible = false; f.userData.arrow.visible = false; });
      };
      // ===== 1. the night; the appointed one comes from the chel to the house where the priests sleep (the court is still locked)
      cam(0, camOpen[0], camOpen[1]);   // PAYIS_STAIRS_212: in the Rosh's reading too - the way up is outside (camMokedIn until 2.1.2)
      if (adj) { cam(3.2, [22, 24, -93], [7, 9, -74]); cam(6.2, [14, 30, -90], [0, 13, -74]); cam(8.9, camMokedIn[0], camMokedIn[1], 0.01); }   // his flight, his landing and the gate; a cut into the house
      cap(0.6, reading === "tamid" ? "״הממנה בא ודופק עליהם, והם פתחו לו״ (תמיד א, ב) — בבית המוקד, בלילה"
        : "רמב״ם (תמידין ו, א): ״סמוך לעלות השחר יבוא הממנה שעל הפיסות ויקיש על העזרה ופותחין לו״");
      ev(1, () => { T1.visible = true; T1.userData.light.intensity = 26; MEM.visible = true; });
      // PAYIS_STAIRS_212 (the user, 16.11.2026 02:52, a picture of the appointed one and the torch before a wall: "הוא לא עולה במדרגות",
      // "פייסות"): since CHEL_211 (30-courts.js) the chel is at the mount's level and the house's gate to the chel is reached by a flight
      // of 27 steps along its north face, from the soreg's opening at x 3.5 (20-mount.js) - rising westwards from x 1.5 (0) to x -12
      // (13.5), a landing 2.3 deep (z -79.8..-77.5) to x -24; until 2.1.2 the way went up the old steps (twelve to 6 and fifteen to 13.5,
      // z -100.9..-80.2), which are gone - the two walked up through the air before the house's base. Now: from the mount through the
      // opening, up the flight (the treads' middles: y = 1.75 - x), along the landing to the gate - the appointed one first, the torch
      // after him. The Rosh's reading (the gate in the east wall): through the same opening, east along the chel, up his flight
      // (x 16.5 .. 3 along z -73.3: y = 16.75 - x) and over his landing to the gate.
      const stairsY = (x0, x) => Math.max(0, Math.min(YM, x0 + 0.25 - x));
      const flight = (x0, xa, xb, z, ta, tb, n) => {   // points up a flight from xa to xb (xa > xb), y on the treads
        const out = [];
        for (let i = 0; i <= n; i++) { const u = i / n, x = xa + (xb - xa) * u; out.push([ta + (tb - ta) * u, x, stairsY(x0, x), z]); }
        return out;
      };
      if (!adj) {
        const FZ = -78.65;   // the flight's middle line
        const way = (lag, xe, ze) => [[0.6 + lag, 3.9, 0, -87], [1.7 + lag, 3.9, 0, -80.9], [2.1 + lag, 3.2, 0, -79.2], [2.4 + lag, 2.0, 0, FZ]]
          .concat(flight(1.5, 1.75, -11.75, FZ, 2.5 + lag, 5.5 + lag, 6).slice(0, 7))
          .concat([[5.65 + lag, -12.4, YM, FZ], [6.6 + lag, xe, YM, ze]]);
        S.knock = 7.1;
        track(MEM, way(0, -18.9, -78.5), [-18.9, -70]);
        track(T1, way(0.45, -16.9, -78.75));
        cam(5.8, camMokedN[0], camMokedN[1]);
      } else {
        const FZ = -73.3;
        const way = (lag, dz) => [[0.6 + lag, 3.9 + dz, 0, -87], [1.7 + lag, 3.9 + dz, 0, -80.9], [2.1 + lag, 5.2, 0, -78.2 + dz], [3.1 + lag, 17.3, 0, -77.6 + dz], [3.5 + lag, 17.3, 0, FZ + dz]]
          .concat(flight(16.5, 16.75, 3.25, FZ + dz, 3.6 + lag, 6.3 + lag, 6))
          .concat([[6.75 + lag, -1.2, YM, FZ + dz]]);
        S.knock = 7.1;
        track(MEM, way(0, 0).concat([[7.6, -1.2, YM, FZ], [7.9, -3.0, YM, FZ], [8.6, -5.6, Y, FZ], [8.95, -7.5, Y, FZ]]), [-18, -67.5]);   // in at the Rosh's eastern gate (the wall at x -2) and up its five steps
        track(T1, way(0.45, 1.4).concat([[7.75, -1.0, YM, -71.9], [8.05, -3.0, YM, -71.7], [8.75, -5.6, Y, -71.6], [9.05, -7.0, Y, -71.6]]));
      }
      // into the house, round the hearth, up to its holy half
      // (FLOOR_211: the house is one floor, at the court's level - five steps inside each gate come up to it from the landing)
      // PAYIS_STAIRS_212: from the landing (13.5) through the gate and up the five steps inside it (z -76.5..-74, to the floor's 16)
      const inMem = adj ? [[-7.5, Y, -73.3], [-7.6, Y, -69.2], [-12.6, Y, -68.4], [-13.4, Y, -67]] : [[-18.9, YM, -78.5], [-18.9, YM, -76.6], [-19.4, Y, -74.0], [-22.6, Y, -72.6], [-22.6, Y, -68.2], [-22.4, Y, -67]];
      const inTor = adj ? [[-7.0, Y, -71.6], [-7.2, Y, -68.6], [-12.2, Y, -67.6], [-13.9, Y, -66.6]] : [[-16.9, YM, -78.75], [-17.2, YM, -76.6], [-16.6, Y, -74.0], [-13.9, Y, -72.6], [-13.9, Y, -68.2], [-13.9, Y, -67]];
      const walkIn = (o, pts, end, t0, d) => {
        const n = pts.length;
        track(o, pts.map((p, i) => [t0 + d * 0.8 * i / (n - 1), p[0], p[1], p[2]]).concat([[t0 + d, end[0], end[1], end[2]]]));
      };
      if (reading === "tamid") {
        t = 9;
        cap(0, "״אמר להן, מי שטבל יבא ויפיס״ (תמיד א, ב) — הפייס הראשון: מי תורם את המזבח");
        cam(3, camMokedIn[0], camMokedIn[1]);
        walkIn(MEM, inMem, [MK.x, MK.y, MK.z], 0, 3.2);
        walkIn(T1, inTor, [-13.95, Y, -59.8], 0, 3);
        enterRing(MK, [-21.6, LV.KOH, -66.3], N, 0.8, 4.2);   // FLOOR_211: from beside the hearth, not through it
        t += 5.6;
        cam(15.5, camMokedNear[0], camMokedNear[1]);
        const d1 = lottery(MK, N, 4, 60, 0, { ring: T_RING + " — תפארת ישראל: בחצי בית המוקד שבקודש", hat: T_HAT, fingers: T_FING, num: numTxt("שישים"), count: "מונה והולך: ", win: "״הפיסו, זכה מי שזכה״ (תמיד א, ב) — " + T_WIN }, ["תורם את המזבח"]);
        t += d1;
        clearWins(0);
        // ===== the torches round the court
        cap(0, "״נטל את המפתח ופתח את הפשפש, ונכנס מבית המוקד לעזרה, ונכנסו אחריו ושתי אבוקות של אור בידם״ (תמיד א, ג)");
      } else {
        if (!adj) {   // they open for him and he goes in (PAYIS_STAIRS_212: up the five steps inside the gate, to the floor's 16)
          track(MEM, [[7.6, -18.9, YM, -78.5], [8.1, -18.9, YM, -76.6], [8.75, -18.9, Y, -74.0], [8.95, -18.9, Y, -73.6]]);
          track(T1, [[7.75, -16.9, YM, -78.75], [8.2, -17.2, YM, -76.6], [8.8, -17.2, Y, -74.0], [8.98, -17.2, Y, -73.6]]);
        }
        t = 9;
        cap(0, "״ומבלשין את כל העזרה״ (רמב״ם) — ״ושתי אבוקות של אור בידם״ (תמיד א, ג)");
      }
      // out through the house's gate to the court; two companies, a torch before each, round the court to the Nicanor gate (the
      // chamber of the griddle-cakes' makers is beside it): the one by the north and the east, the other behind the house and by the south
      ev(-0.01, () => { for (const f of K) f.visible = false; MEM.visible = false; T1.visible = T2.visible = true; T1.userData.light.intensity = T2.userData.light.intensity = 30; });
      cam(2.4, camMokedS[0], camMokedS[1]);
      // through the wicket in the east leaf of the shut gate (Middot 1:7 "פשפש קטן היה לו, שבו נכנסין לבלש את העזרה"): x -15.45, z -57.4
      const W1 = 2.6, P0 = 4.8;   // the second the first torch passes the wicket; the second the companies part
      S.wicketAt = t + W1 - 1.1;
      // (PAYIS_STAIRS_212: the house is one floor at 16 since FLOOR_211 - these went at 13.5, under its floor, until 2.1.2)
      const s1 = reading === "tamid" ? [[0, -13.95, Y, -59.8]] : [[0, -17.2, Y, -73.6], [1.2, -13.9, Y, -68.4], [1.5, -13.9, Y, -67]];
      const s2 = reading === "tamid" ? [[0.5, -16.5, Y, -62.5]] : [[0.5, -16.4, Y, -72.6], [1.7, -13.9, Y, -68.4], [2, -13.9, Y, -67]];
      const pathE = s1.concat([[W1, -15.45, Y, -57.4], [W1 + 0.7, -14.6, Y, -55.4], [P0 - 0.6, -13.6, Y, -54.2], [P0, -13.6, Y, -54.2], [P0 + 3.4, 20, Y, -50], [P0 + 6.8, 58, Y, -49], [P0 + 8.8, 80, Y, -44],
        [P0 + 12, 81, Y, 14]]);
      const pathW = s2.concat([[W1 + 0.5, -15.45, Y, -57.4], [W1 + 1.2, -16.4, Y, -55.4], [P0 - 0.3, -17.6, Y, -54.2], [P0, -17.6, Y, -54.2], [P0 + 1.4, -60, Y, -52], [P0 + 2.3, -88, Y, -44], [P0 + 5.2, -88, Y, 44],
        [P0 + 6.6, -40, Y, 52], [P0 + 8.6, 26, Y, 52], [P0 + 9.2, 45, Y, 54.5], [P0 + 9.9, 66, Y, 54.5], [P0 + 12, 81, Y, 22]]);
      track(T1, pathE);
      track(T2, pathW);
      // three priests walk behind each torch (the same way, a little later)
      [pathE, pathW].forEach((p, w) => {
        for (let j = 0; j < 3; j++) {
          const f = K[w * 3 + j], lag = 0.35 + j * 0.3;
          ev(0, () => { f.visible = true; f.userData.hand.visible = false; });
          track(f, p.map((k) => [k[0] + lag, k[1] + (j - 1) * 0.5, k[2], k[3] + (j - 1) * 0.4]));
          ev(P0 + 15.2, () => { f.visible = false; });
        }
      });
      cap(P0 - 0.2, "״ונחלקו לשתי כתות, אלו הולכים באכסדרא דרך המזרח, ואלו הולכים באכסדרא דרך המערב״ (תמיד א, ג)");
      cam(P0 + 2.5, camCourt[0], camCourt[1], 0.01, fovCourt);   // a cut: the way there goes through the heichal or over its gold roof
      cam(P0 + 11.4, camMeet[0], camMeet[1]);
      cap(P0 + 12.2, "״הגיעו אלו ואלו, אמרו שלום, הכל שלום״ (תמיד א, ג)");
      t += P0 + 15.4;
      if (reading === "tamid") {
        cap(0, "״מי שזכה לתרם את המזבח, הוא יתרם את המזבח… מהלך לאור המערכה״ (תמיד א, ד)");
        cam(1, camAltar[0], camAltar[1], 0.01);   // a cut: the straight way goes through the fire
        toAltar(12);
        t += 12;
        cap(0, "״הציתו שתי המערכות באש, וירדו ובאו להם ללשכת הגזית״ (תמיד ב, ה)");
        t += 4;
      }
      // ===== the Gazit hall: the first two lotteries (the Rambam) or the second alone (the Mishnah's order)
      ev(0, () => { T1.visible = T2.visible = false; T3.visible = T4.visible = true; T3.userData.light.intensity = T4.userData.light.intensity = 20; CAR[2].position.set(88.2, FYG, -72.4); CAR[3].position.set(88.2, FYG, -60.2); face(CAR[2], 83.5, -66.3); face(CAR[3], 83.5, -66.3); syncCar(); ELDER.visible = true; });
      sky(0, "night", "alot");   // the first light: the Rambam, Temidin 4:1 - "נכנסין ללשכת הגזית אחר שיעלה עמוד השחר"
      sky(6, "alot");
      cam(3, camGazit[0], camGazit[1]);
      if (reading !== "tamid") cap(0, "רמב״ם (תמידין ו, א): ״ויבואו ויעמדו בלשכת הגזית. ויפיסו פיס ראשון ושני״");
      else cap(0, "״אמר להם הממנה, באו והפיסו״ (תמיד ג, א) — בלשכת הגזית");
      enterRing(GZ, [88.25, FYG, -57.6], N, 0.5, 4.4);
      track(MEM, [[0.5, 88.25, FYG, -57.4], [4.6, GZ.x, GZ.y, GZ.z]]);
      ev(0.5, () => { MEM.visible = true; });
      t += 5.6;
      cap(0, "״לשכת הגזית… פייס במזרחה, וזקן יושב במערבה״ (יומא כה.)");
      t += 3.6;
      if (reading !== "tamid") {
        cam(15.5, camGazitNear[0], camGazitNear[1]);
        const d1 = lottery(GZ, N, 4, 60, 0, { ring: T_RING, hat: T_HAT, fingers: T_FING, num: numTxt("שישים"), count: "מונה והולך: ", win: "הפייס הראשון: מי תורם את המזבח — " + T_WIN }, ["תורם את המזבח"]);
        t += d1;
        clearWins(0);
        cam(2.5, camGazit[0], camGazit[1]);
      }
      {
        cam(15.9, camGazit13[0], camGazit13[1]);
        const d2 = lottery(GZ, N, 11, 100, 0.4, { ring: "הפייס השני: ״מי שוחט, מי זורק, מי מדשן מזבח הפנימי, מי מדשן את המנורה, מי מעלה אברים לכבש…״ (תמיד ג, א)", hat: T_HAT, fingers: T_FING, num: numTxt("מאה"),
          count: "מונה והולך: ", win: "רמב״ם (תמידין ד, ו): ״הפיס השני זוכין בו שלשה עשר על סדר עמידתן״" }, ROLES);
        t += d2 + 0.4;
        cap(0, "״שלשה עשר כהנים זכו בו״ (יומא ב, ג)");
        t += 4.2;
        clearWins(0);
      }
      if (reading !== "tamid") {
        cap(0, "רמב״ם (תמידין ו, א): ״ומתחיל זה שזכה בתרומת הדשן ותורם על הסדר שאמרנו״");
        ev(0, () => { for (const f of K) f.visible = false; MEM.visible = false; });
        cam(3, camAltar[0], camAltar[1]);
        toAltar(12);
        t += 12;
      }
      // ===== "צאו וראו": the watcher goes up; the east lights
      ev(0, () => { for (const f of K) f.visible = false; MEM.visible = true; WATCH.visible = true; T3.visible = T4.visible = false; });
      cap(0, "״אמר להם הממנה, צאו וראו אם הגיע זמן השחיטה״ (תמיד ג, ב)");
      // DUCHAN_GAP_A2 (fix-a2): the duchan stands against the priests' court now (x 82.5..85, 30-courts.js) - the officer on the priests'
      // court's edge, the watcher down the duchan's steps (until then both stood in the air, over the ditch that lay at x 82.5..85.5)
      track(MEM, [[0, 82.2, Y, -50.6], [1, 82.2, Y, -50.6]], [89.4, -51.4]);
      cam(2.6, [70, 30, -30], [89, 24, -55]);
      track(WATCH, [[0, 82.3, Y, -50.4], [0.7, 84.5, 14.5, -50.6], [1.1, 85.5, 13.5, -50.7], [2, 89.4, 13.5, -51], [7, 89.4, RY, -54.9], [9, 90.3, RY, WZ], [12.6, 91.6, WY, WZ], [13.6, WX, WY, WZ]], [WX + 40, WZ]);
      cap(5, "להיכן יצאו? רש״י: ״על החומה או על הגג״; ״הרואה - זה שעלה לגג״. ברטנורא: ״על מקום גבוה שהיה להם במקדש״");
      cam(9.5, [72, 40, -40], [92, 36, -60]);
      cam(14.5, [79, 47.5, -57], [120, 39.5, -61]);
      sky(9, "alot", "heir");   // BARKAI_LIGHT_306 (the lotteries' demonstration): the east lit by the call ("ברקאי") - until 2.0.14 "alot" to "barkai" (dark)
      t += 15;
      cap(0, "״אם הגיע, הרואה אומר, ברקאי״ (תמיד ג, ב) — ברטנורא: ״האיר והבריק השחר״");
      sky(0, "heir");   // BARKAI_LIGHT_306: held through "האיר פני כל המזרח"
      t += 6;
      cap(0, "״מתתיא בן שמואל אומר, האיר פני כל המזרח עד שבחברון. והוא אומר הן״ (יומא ג, א)");
      cam(6.5, [77, 49.5, -52], [124, 38.5, -62]);
      sky(6.5, "heir", "morning");
      t += 8;
      // ===== the day: the third and the fourth lotteries, in the Gazit
      S.dayAt = t;
      cap(0, "אחרי שחיטת התמיד, זריקת דמו והעלאת האברים לכבש — ״וירדו ובאו להם ללשכת הגזית, לקרות את שמע״ (תמיד ד, ג)");
      sky(4.5, "morning");
      cam(3.2, camGazit[0], camGazit[1]);
      ev(0.2, () => { WATCH.visible = false; MEM.visible = true; ELDER.visible = true; });
      enterRing(GZ, [88.25, FYG, -57.6], NEW, 1.2, 3.6);
      track(MEM, [[1.2, 88.25, FYG, -57.4], [4.6, GZ.x, GZ.y, GZ.z]]);
      t += 5.4;
      // PAYIS_GARMENTS (the user, 12.11.2026: "תוסיף כרטיס שמדבר על הבגדים ... מביא את המחלוקות ... בצורה ברורה"): the garments from near, by day.
      // PAYIS_AVNET_PASS (the user, 00:31: "מתגים במצגת לא עושים עוד מצגת, אלא עושים משהו בתוך המצגת כזה, בהבלעה"): the avnet as the reading
      // chosen in the row "אבנטו של כהן הדיוט", then for a few seconds as the other reading, with its source, and back
      // (PAYIS_FIGURE4: from inside the ring, east of the appointed one - two of the priests face the camera)
      cam(2.2, [84.9, 19.0, -65.3], [81.24, 17.9, -68.7], 2.2);
      {
        const dyed = P.avnet !== "butz";
        ev(0, () => stripes(dyed));
        cap(0, dyed ? "רמב״ם (כלי המקדש ח, א): ״בגדי כהן הדיוט הם ארבעה כלים כתנת ומכנסים ומגבעות ואבנט. וארבעתן של פשתן לבנים וחוטן כפול ששה. והאבנט לבדו רקום בצמר״"
          : "רמב״ם (כלי המקדש ח, א): ״בגדי כהן הדיוט הם ארבעה כלים כתנת ומכנסים ומגבעות ואבנט. וארבעתן של פשתן לבנים וחוטן כפול ששה״");
        cap(7, "האבנט — נחלקו בו (יומא יב:): ״אבנטו של כהן הדיוט, רבי ורבי אלעזר ברבי שמעון, חד אמר: של כלאים, וחד אמר: של בוץ״");
        ev(12.5, () => stripes(!dyed));
        cap(12.5, dyed ? "״וחד אמר: של בוץ״ — של פשתן לבדו (רמב״ם ח, יג: ״הוא הפשתים והוא הבוץ״)"
          : "״חד אמר: של כלאים״ — וכן הרמב״ם (ח, א): ״והאבנט לבדו רקום בצמר״");
        ev(17.5, () => stripes(dyed));
        cap(17.5, dyed ? "ובחזרה לשיטה שנבחרה — הרמב״ם: ״והאבנט לבדו רקום בצמר״" : "ובחזרה לשיטה שנבחרה — ״של בוץ״");
        t += 20.5;
      }
      cam(2.6, camGazit[0], camGazit[1], 2.4);
      {
        cam(15.5, camGazitNear[0], camGazitNear[1]);
        const d3 = lottery(GZ, NEW, 2, 60, 0, { ring: "הפייס השלישי: ״אמר להם, חדשים לקטרת באו והפיסו״ (תמיד ה, ב) — רמב״ם: ״מי שלא הקטיר קטרת מימיו יבוא ויפיס״", hat: T_HAT, fingers: T_FING, num: numTxt("שישים"),
          count: "מונה והולך: ", win: "״הפיסו, זכה מי שזכה״ (תמיד ה, ב) — זכה בקטורת" }, ["מקטיר קטורת"]);
        t += d3;
        clearWins(0);
      }
      ev(0, () => { for (let i = 0; i < NEW; i++) { K[i].userData.robe = mRobe; K[i].userData.body.material = mRobe; } });
      cam(3, camGazit[0], camGazit[1]);
      enterRing(GZ, [88.25, FYG, -57.6], N, 0.2, 3.8);
      t += 4.4;
      {
        cam(15.5, camGazit13[0], camGazit13[1]);
        const d4 = lottery(GZ, N, 7, 100, 0, { ring: "הפייס הרביעי: ״חדשים עם ישנים באו והפיסו, מי מעלה אברים מן הכבש למזבח״ (תמיד ה, ב)", hat: T_HAT, fingers: T_FING, num: numTxt("מאה"),
          count: "מונה והולך: ", win: "רמב״ם (תמידין ד, ח): ״הפיסו וזכה מי שזכה״" }, ["מעלה אברים למזבח"]);
        t += d4;
      }
      cap(0, "״ארבעה פיסות היו שם״ (יומא ב, ב)");
      t += 4;
      cap(0, "");
      S.dur = t + 0.5;
      S.caps.sort((a, b) => a[0] - b[0]);
      S.ev.sort((a, b) => a[0] - b[0]);
      S.cams.sort((a, b) => a[0] - b[0]);
      S.sky.sort((a, b) => a[0] - b[0]);
      return S;
    };
    // PAYIS_AVNET_PASS: the dyed bands of every avnet, on or off
    const stripes = (on) => { for (const m of SASHES) m.material = on ? mSashDyed : mSashWhite; };
    // ---------- the runner
    let RUN = null;
    const P = SH.payis = {
      reading: "tamid",   // LOTS_LINK_207 (the user, 12.11.2026 20:28: "אביי"): the default is the order of the Mishnah - the first lottery in Beit HaMoked
      // PAYIS_GARMENTS: the avnet of an ordinary priest - "rambam" (as Rabbi: embroidered with dyed wool) | "butz" (R. Elazar b. R. Shimon: white)
      avnet: "rambam",
      setAvnet(m) { this.avnet = m === "butz" ? "butz" : "rambam"; stripes(this.avnet === "rambam"); if (RUN) stop(); return this.avnet; },
      // three priests stand before the altar for `ms` (fifteen seconds), by day, to be seen from near: face, side and back
      garments(ms) { garmentsOn(ms || 15000); },
      get garmentsOn() { return !!GAR; },
      setReading(m) { this.reading = m === "tamid" ? "tamid" : "rambam"; if (RUN) stop(); return this.reading; },
      get on() { return !!RUN; },
      get _torches() { return { T: [T1, T2, T3, T4], CAR }; },   // TORCHES_HELD_N3: for the checks
      start() { start(); },
      stop() { stop(); },
      // tests: the state at a second of the script, the clock held there
      at(sec, free) { if (!RUN) start(); RUN.hold = Math.max(0, sec); RUN.free = !!free; RUN.evI = 0; resetFigures(); step(); return RUN ? RUN.S.dur : 0; },
      dur() { return RUN ? RUN.S.dur : build(this.reading).dur; },
      now() { return RUN ? (RUN.hold >= 0 ? RUN.hold : (performance.now() - RUN.t0) / 1000) : -1; },   // DEMO_PAUSE_207 (tests: the run's second)
      // run on from a second of the script (tests; a skip, if the interface ever offers one)
      seek(sec) { if (!RUN) start(); RUN.hold = -1; RUN.free = false; RUN.t0 = performance.now() - Math.max(0, sec) * 1000; RUN.evI = 0; RUN.sec = -1; resetFigures(); step(); },
      // tests: the captions and the cameras with their seconds
      timeline() { const S = RUN ? RUN.S : build(this.reading); return { dur: S.dur, caps: S.caps.map((c) => [Math.round(c[0] * 10) / 10, c[1]]), cams: S.cams.map((c) => [Math.round(c[0] * 10) / 10, c[1], c[2]]), sky: S.sky.map((c) => [Math.round(c[0] * 10) / 10, c[1], c[2] || ""]) }; }
    };
    const resetFigures = () => {
      for (const f of K) { f.visible = false; f.userData.hand.visible = false; f.userData.robe = mRobe; f.userData.body.material = mRobe; f.userData.arrow.visible = false; f.userData.hat.position.set(0, HAT_Y, 0); }
      stripes(P.avnet !== "butz");
      MEM.visible = WATCH.visible = ELDER.visible = false;
      MARK.visible = false;
      for (const x of [T1, T2, T3, T4]) { x.visible = false; x.userData.light.intensity = 0; }
      syncCar();
      for (const s of tags) s.visible = false;
    };
    let KEEP = false;
    let GAR = null;
    const garmentsOff = () => {
      if (!GAR) return;
      clearTimeout(GAR);
      GAR = null;
      if (!RUN) { g.visible = false; resetFigures(); }
    };
    // FEET_ON_FLOOR_N18 (the user, 24.11.2026, of the card "בגדי הכהנים": the three priests stood in the air): the floor under a figure is
    // asked of the model itself (SH.floorY - a downward ray on the floors, from a little over the nominal level), and the nominal level is
    // only the fallback
    const groundAt = (x, z, nominal) => {
      let y = typeof SH.floorY === "function" ? SH.floorY(x, nominal + 1.5, z) : -Infinity;
      if (!isFinite(y) || Math.abs(y - nominal) > 3) y = nominal;
      return y;
    };
    const garmentsOn = (ms) => {
      if (RUN) return;
      garmentsOff();
      resetFigures();
      stripes(P.avnet !== "butz");
      [[78.5, -1.7, Math.PI / 2], [78.5, 0, Math.PI], [78.5, 1.7, -Math.PI / 2]].forEach(([x, z, ry], i) => { const f = K[i]; f.position.set(x, groundAt(x, z, LV.KOH), z); f.rotation.y = ry; f.visible = true; });
      g.visible = true;
      GAR = setTimeout(() => { GAR = null; if (!RUN) { g.visible = false; resetFigures(); } }, ms);
    };
    const cardFold = (fold) => {
      try {
        const xc = document.getElementById("tm-xcard");
        if (!shown(xc)) return false;
        const b = xc.querySelector(".h .x");
        if (!b || xc.classList.contains("min") === !!fold) return false;
        KEEP = true;   // (every button's click stops the demonstrations - 90-entry.js; not this one's own fold)
        try { b.click(); } finally { KEEP = false; }
        return true;
      } catch (_) { return false; }
    };
    // ---------- PAYIS_GATES (the user, 12.11.2026: "למה בכלל השערים פתוחים?"): while it is night every gate the model draws with leaves
    // (10-core.js doors - tagged userData.tmDoors) is shut. The house of the hearth's gate to the chel is opened for the appointed
    // one ("והם פתחו לו", Tamid 1:2), and a wicket opens in the east leaf of its gate to the court ("ופתח את הפשפש, ונכנס מבית
    // המוקד לעזרה", 1:3; R. Yehuda, Middot 1:7 - the model's own wicket stands half under the court's floor, so the night draws
    // its own at the floor). With the day, and when it stops, every leaf is as it was.
    const GT = { saved: null, chel: null, court: null, wk: null }, gv = new Vector3();
    const doorsOf = (x, z) => {
      let best = null, bd = 2.5;
      ctx2.scene.traverse((o) => {
        if (!o.userData || !o.userData.tmDoors || o.children.length < 2) return;
        let p = o, vis = true;
        while (p && vis) { vis = p.visible; p = p.parent; }
        if (!vis) return;
        o.getWorldPosition(gv);
        const d = Math.hypot(gv.x - x, gv.z - z);
        if (d < bd) { bd = d; best = o; }
      });
      return best;
    };
    const setOpen = (g, a) => {
      if (!g) return;
      const inw = g.userData.tmDoors.inward || 1;
      g.children[0].rotation.y = -a * inw;
      g.children[1].rotation.y = Math.PI + a * inw;
    };
    const wicket = (on) => {
      if (!on) {
        if (GT.wk) { GT.wk.hole.visible = false; GT.wk.piv.visible = false; if (GT.wk.wm) GT.wk.wm.visible = true; }
        return;
      }
      const leaf = GT.court && GT.court.children[1];
      if (!leaf) return;
      if (!GT.wk || GT.wk.leaf !== leaf) {
        const wm = leaf.children.find((c) => c.isMesh && c.geometry && c.geometry.parameters && Math.abs(c.geometry.parameters.width - 1.8) < 0.01 && Math.abs(c.geometry.parameters.height - 3.8) < 0.01) || null;
        const hole = new Mesh(new BoxGeometry(1.8, 3.8, 0.56), new MeshBasicMaterial({ color: 0x06070b }));
        hole.position.set(2.45, 4.25, 0);
        const piv = new Group();
        piv.position.set(3.35, 2.35, 0);
        const dg = new BoxGeometry(1.8, 3.8, 0.1);
        dg.translate(-0.9, 1.9, 0);
        piv.add(new Mesh(dg, wm ? wm.material : mat(0x8a6420, { metalness: 0.6, roughness: 0.4 })));
        leaf.add(hole);
        leaf.add(piv);
        GT.wk = { leaf, wm, hole, piv };
      }
      if (GT.wk.wm) GT.wk.wm.visible = false;
      GT.wk.hole.visible = false;
      GT.wk.piv.visible = true;
      GT.wk.piv.rotation.y = 0;
    };
    const gatesNight = (on) => {
      if (on === !!GT.saved) return;
      if (on) {
        GT.saved = [];
        ctx2.scene.traverse((o) => {
          if (!o.userData || !o.userData.tmDoors || o.children.length < 2) return;
          GT.saved.push([o, o.children[0].rotation.y, o.children[1].rotation.y]);
          setOpen(o, 0);
        });
        GT.chel = SH.mokedGates && SH.mokedGates.mode === "adjacent" ? doorsOf(-2.5, -73.3) : doorsOf(-18, -77);   // PAYIS_STAIRS_212: the Rosh's gate is in the east wall at x -2.5 since MOKED_WIDE_211 (-6.5 before - not found, the gate stayed shut)
        GT.court = doorsOf(-18, -58);
        wicket(true);
      } else {
        for (const [o, a, b] of GT.saved) { o.children[0].rotation.y = a; o.children[1].rotation.y = b; }
        GT.saved = null;
        GT.chel = GT.court = null;
        wicket(false);
      }
    };
    const gatesStep = (S, t) => {
      const night = t < S.dayAt;
      gatesNight(night);
      if (!night) return;
      const cl = (u) => Math.max(0, Math.min(1, u));
      setOpen(GT.chel, 0.95 * ease(cl((t - S.knock) / 0.9)));
      if (GT.wk) { const u = ease(cl((t - S.wicketAt) / 0.7)); GT.wk.hole.visible = u > 0.02; GT.wk.piv.rotation.y = -1.7 * u; }
    };
    const roofsBtn = () => (Array.isArray(SH.modelButtons) ? SH.modelButtons.find((b) => b && b.id === "crt-lishkot-roofs") : null);
    const labelsObj = () => ctx2.scene.getObjectByName("labels");
    function start() {
      refreshFYG();
      if (RUN) stop();
      garmentsOff();
      try { if (typeof SH.stopDemos === "function") SH.stopDemos(); } catch (_) {}
      const S = build(P.reading);
      RUN = { S, t0: performance.now(), hold: -1, evI: 0, roofs: false, labels: null, free: false, sec: -1, fov0: ctx2.camera ? ctx2.camera.fov : 0, pose: null, card: 0, w0: performance.now() };
      try { if (ctx2.camera && ctx2.controls && ctx2.controls.target) RUN.pose = { pos: ctx2.camera.position.toArray(), target: ctx2.controls.target.toArray() }; } catch (_) {}
      const rb = roofsBtn();
      if (rb && !rb.get()) { rb.set(true); RUN.roofs = true; }
      // the other buttons on the model are not shown while it runs (their anchors give nothing); stop() gives them back
      RUN.pills = [];
      for (const b of (Array.isArray(SH.modelButtons) ? SH.modelButtons : [])) {
        if (!b || b.id === "crt-payis-demo") continue;
        const d = Object.getOwnPropertyDescriptor(b, "anchor");
        if (!d || !("value" in d)) continue;
        RUN.pills.push([b, d.value]);
        b.anchor = null;
      }
      const lg = labelsObj();
      if (lg) { RUN.labels = lg.visible; lg.visible = false; }
      // SLAUGHTER_HOLD_211: the search's ways cross the slaughter place as it stands in the usual layout; the Ra'avyah's row and the
      // Gra's stand across them - the usual layout while the demonstration runs, the viewer's choice back at its end (stop())
      { const SL = SH.slaughterLayout; RUN.slaughter = SL && (SL.current === "raavyah" || SL.current === "gra") ? SL.current : null; if (RUN.slaughter) SL.set("bartenura"); }
      resetFigures();
      g.visible = true;
      NIGHT.begin();
      NIGHT.set("night");
      SH.tefOff.add("payis");   // TEFILLIN_A2: by night none (the step below gives them back with the dawn)
      try { if (typeof SH.navRepaint === "function") SH.navRepaint(); } catch (_) {}
    }
    function stop() {
      try { if (SH.sfx) SH.sfx.stop(); } catch (_) {}   // SOUND_211
      if (!RUN) return;
      const R = RUN;
      RUN = null;
      try { if (R.steps) R.steps.stop(); } catch (_) {}   // SOUNDS_300 (item 16)
      g.visible = false;
      resetFigures();
      caption("");
      stopShow(false);
      NIGHT.end();
      SH.tefOff.delete("payis");   // TEFILLIN_A2
      for (const [b, a] of R.pills || []) b.anchor = a;
      gatesNight(false);
      if (R.slaughter && SH.slaughterLayout) SH.slaughterLayout.set(R.slaughter);   // SLAUGHTER_HOLD_211
      if (R.card === 2) cardFold(false);
      if (R.fov0 && ctx2.camera && ctx2.camera.fov !== R.fov0) { ctx2.camera.fov = R.fov0; ctx2.camera.updateProjectionMatrix(); }
      try { if (R.pose && typeof ctx2.flyTo === "function") ctx2.flyTo(R.pose.pos, R.pose.target, 1200); } catch (_) {}
      const rb = roofsBtn();
      if (R.roofs && rb && rb.get()) rb.set(false);
      const lg = labelsObj();
      if (lg && R.labels !== null) lg.visible = R.labels;
      try { if (typeof SH.navRepaint === "function") SH.navRepaint(); } catch (_) {}
    }
    const ease = (u) => u * u * (3 - 2 * u);
    const v3 = new Vector3();
    function step() {
      const R = RUN;
      if (!R) return;
      const S = R.S, t = R.hold >= 0 ? R.hold : (performance.now() - R.t0) / 1000;
      // (the place's click opens its card after it starts the run - so a moment later)
      if (!R.card && performance.now() - R.w0 > 350) R.card = cardFold(true) ? 2 : 1;
      gatesStep(S, t);
      // SOUND_211 (the user, 15.11.2026: sounds in the lots' demonstration too): the night's sounds - the knock and the gate that is
      // opened to him, the wicket, the torches - by the morning service's synthesizer (SH.sfx, 55-tamid.js); the words are captions
      if (R.hold < 0 && SH.sfx && R.sT != null && t > R.sT && t - R.sT < 0.75) {
        const hit = (x) => R.sT < x && t >= x;
        if (hit(S.knock - 0.75)) SH.sfx.play("knock");
        if (hit(S.knock + 0.1)) SH.sfx.play("door");
        if (hit(S.wicketAt)) SH.sfx.play("door");
        if (t < S.dayAt && t > S.knock + 2 && Math.floor(t / 4.4) !== Math.floor(R.sT / 4.4)) SH.sfx.play("torch");
      }
      R.sT = t;
      // the events up to now, in their order
      while (R.evI < S.ev.length && S.ev[R.evI][0] <= t) { const e = S.ev[R.evI++]; try { e[1](); } catch (_) {} if (!RUN) return; }
      // the tracks
      for (const tr of S.tracks) {
        const k = tr.keys;
        if (t < k[0][0]) continue;
        let i = 0;
        while (i < k.length - 2 && t > k[i + 1][0]) i++;
        const a = k[i], b = k[Math.min(k.length - 1, i + 1)];
        const u = b[0] > a[0] ? Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0]))) : 1, e = tr.local ? ease(u) : u;
        const x = a[1] + (b[1] - a[1]) * e, y = a[2] + (b[2] - a[2]) * e, z = a[3] + (b[3] - a[3]) * e;
        const to = tr.o.userData && tr.o.userData.carrier ? tr.o.userData.carrier : tr.o;   // TORCHES_HELD_N3: a torch's track moves its carrier
        to.position.set(x, y, z);
        if (tr.local) continue;
        const moving = u < 1 && (Math.abs(b[1] - a[1]) + Math.abs(b[3] - a[3]) > 0.05);
        if (moving) to.rotation.y = Math.atan2(b[1] - a[1], b[3] - a[3]);
        else if (tr.faceTo && t >= k[k.length - 1][0]) face(to, tr.faceTo[0], tr.faceTo[1]);
      }
      syncCar();
      // SOUNDS_300 (the user's item 16, 18.11.2026): soft barefoot steps (a "steps" loop at 0.7) while a priest walks - a figure (the
      // ring's priests, the appointed one, the watcher; not the torches, not a mitznefet) between two keys of his track that are apart;
      // none while the clock stands (a pause, a still frame: R.hold). stop() ends the loop. The night's own sounds (SOUND_211) stay
      try {
        let walk = false;
        if (R.hold < 0) for (const tr of S.tracks) {
          if (tr.local || !tr.o.visible || !(tr.o.userData && tr.o.userData.body)) continue;
          const k = tr.keys;
          if (t < k[0][0] || t >= k[k.length - 1][0]) continue;
          let i = 0;
          while (i < k.length - 2 && t > k[i + 1][0]) i++;
          const a = k[i], b = k[i + 1];
          if (b[0] > a[0] && Math.hypot(b[1] - a[1], b[3] - a[3]) > 0.05) { walk = true; break; }
        }
        if (walk && !R.steps && typeof SH.sfxLoop === "function") R.steps = SH.sfxLoop("steps");
        if (R.steps) R.steps.set(walk ? 0.7 : 0);
      } catch (_) {}
      // the count: the mark over the finger of the one now counted, and the number in the caption
      let line = "";
      for (const c of S.caps) { if (c[0] <= t) line = c[1]; else break; }
      for (const c of S.counts) {
        if (t < c.t0 || t > c.t1 + 0.25) continue;
        const kNow = Math.max(1, Math.min(c.num, Math.ceil((t - c.t0) / (c.t1 - c.t0) * c.num)));
        const f = K[(c.start + kNow - 1) % c.n];
        v3.copy(f.userData.tip);
        f.localToWorld(v3);
        g.worldToLocal(v3);
        MARK.position.set(v3.x, v3.y + 0.22, v3.z);
        line = c.text + kNow + " מתוך " + c.num;
      }
      caption(line);
      { const sec = Math.floor(Math.min(t, S.dur)); if (R.sec !== sec) { R.sec = sec; stopShow(true, sec, S.dur); } }
      for (const f of K) if (f.userData.arrow.visible) f.userData.arrow.position.y = ARROW_Y + 0.09 * Math.sin(t * 4 + f.id);
      // the flames flicker
      for (const x of [T1, T2, T3, T4]) if (x.visible) x.userData.flame.scale.y = 0.85 + 0.25 * Math.sin(t * 9 + x.id);
      // the sky
      {
        const K2 = S.sky;
        let i = 0;
        while (i < K2.length - 1 && t >= K2[i + 1][0]) i++;
        const a = K2[i], b = K2[i + 1];
        if (!b || a[1] === a[2]) NIGHT.set(a[1]);
        else NIGHT.set(a[1], a[2], (t - a[0]) / Math.max(0.01, b[0] - a[0]));
        if (a[1] === "night") SH.tefOff.add("payis"); else SH.tefOff.delete("payis");   // TEFILLIN_A2: from the dawn on
      }
      // the camera
      {
        const C = S.cams, cam = ctx2.camera, oc = ctx2.controls;
        let i = 0;
        while (i < C.length - 2 && t > C[i + 1][0]) i++;
        const a = C[i], b = C[Math.min(C.length - 1, i + 1)];
        // PAYIS_ROUND2: a key's second is when the camera arrives - it rests on the pose before, then moves (three seconds, or the key's own)
        const mv = Math.max(0.01, Math.min(typeof b[3] === "number" ? b[3] : 3, b[0] - a[0]));
        const u = b[0] > a[0] ? ease(Math.max(0, Math.min(1, (t - (b[0] - mv)) / mv))) : 1;
        const L = (p, q, j) => p[j] + (q[j] - p[j]) * u;
        if (cam && !R.free) {
          cam.position.set(L(a[1], b[1], 0), L(a[1], b[1], 1), L(a[1], b[1], 2));
          let lx = L(a[2], b[2], 0), ly = L(a[2], b[2], 1), lz = L(a[2], b[2], 2);
          if (R.blend) {   // DEMO_PAUSE_207: after a pause, from where the viewer left the eye to the demonstration's, in 0.9 s
            const w = ease(Math.min(1, (performance.now() - R.blend.at) / 900)), P0 = R.blend.pos, T0 = R.blend.tg;
            cam.position.set(P0[0] + (cam.position.x - P0[0]) * w, P0[1] + (cam.position.y - P0[1]) * w, P0[2] + (cam.position.z - P0[2]) * w);
            lx = T0[0] + (lx - T0[0]) * w; ly = T0[1] + (ly - T0[1]) * w; lz = T0[2] + (lz - T0[2]) * w;
            if (w >= 1) R.blend = null;
          }
          if (oc && oc.target) oc.target.set(lx, ly, lz);
          cam.lookAt(lx, ly, lz);
          const fv = (a[4] || R.fov0) + ((b[4] || R.fov0) - (a[4] || R.fov0)) * u;
          if (R.fov0 && Math.abs(cam.fov - fv) > 0.01) { cam.fov = fv; cam.updateProjectionMatrix(); }
        }
      }
      if (R.hold < 0 && t >= S.dur) stop();
    }
    ctx2.animated.push(() => { if (RUN) step(); });
    // DEMO_PAUSE_207 (the user, 12.11.2026 20:34: "ההדגמה של הפייסות היא 4 דקות. אדם שעצר צריך להתחיל מההתחלה. יש סיכוי להשהות"): a press on
    // the model pauses the run (90-entry.js) - the clock stands at its second (hold), the eye is free; resume() goes on from that second,
    // the eye coming back to the demonstration's in under a second (blend); until 2.0.7 a press ended it
    const pauseRun = () => { const R = RUN; if (!R || R.paused != null || R.hold >= 0) return; R.paused = (performance.now() - R.t0) / 1000; R.hold = R.paused; R.free = true; };
    const resumeRun = () => {
      const R = RUN;
      if (!R || R.paused == null) return;
      const t = R.paused;
      R.paused = null; R.hold = -1; R.free = false; R.t0 = performance.now() - t * 1000;
      const cam = ctx2.camera, oc = ctx2.controls;
      if (cam && oc && oc.target) R.blend = { pos: cam.position.toArray(), tg: oc.target.toArray(), at: performance.now() };
    };
    (SH.demoStops || (SH.demoStops = [])).push({ id: "crt-payis-demo", running: () => !!RUN, stop: () => { if (!KEEP) stop(); },
      pause: pauseRun, resume: resumeRun, paused: () => !!(RUN && RUN.paused != null), restart: () => start() });
    SH.demoStops.push({ id: "payis-garments", running: () => !!GAR, stop: () => garmentsOff() });
    const MB = Array.isArray(SH.modelButtons) ? SH.modelButtons : (SH.modelButtons = []);
    MB.push({
      id: "crt-payis-demo", label: "הדגמה: ארבעת הפייסות ו״ברקאי״", labelOn: "עצור את ההדגמה", maxDist: 170,
      title: "סדר הבוקר במקדש, בלילה שהופך ליום, בכתוביות מלשון המשנה: ארבעת הפייסות לפי סדרם, ו״צאו וראו אם הגיע זמן השחיטה״ — בשיטה שנבחרה במתג (״הפייס הראשון — היכן ומתי״). בלי קול.",
      anchor: () => {
        if (RUN) return null;   // while it runs the fixed button under the model stops it
        const p = ctx2.camera && ctx2.camera.position;
        return p && p.x > 20 && p.z < 30 ? [84, 34.5, -60] : null;
      },
      get: () => !!RUN,
      set: (v) => { if (v) start(); else stop(); }
    });
    SH.flyPoints = SH.flyPoints || {};
    SH.flyPoints.payis = { pos: [84.6, 41, -47.5], target: [83.6, 16.6, -66.6] };
  }
