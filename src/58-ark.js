  // ===== 1.4.1 (ARK_GATES_208): "דבקו שערים" - THE ARK BROUGHT INTO THE DEVIR (Shabbat 30a; I Kings 8:3-11; II Chronicles 6:13, 6:42) =====
  // The user, 12.11.2026 21:14 ("9. אולי אפשר ליצור הדגמה"), 21:42 ("שלמה תעשה כצורת מלך ותביא לי לאישור", "תראה ענן", "4" - four
  // priests: Menachot 98b "ומנא לן דבארבעה הוו דרו להו? דכתיב ונסעו הקהתים – תרי, נשאי המקדש – נמי תרי", the two of a pair walking between
  // the staffs - "תרי גברי באמתא ופלגא לא מסתגי להו"), 22:32 (the king as King David's paintings, not red-haired; on the bronze platform as
  // Abarbanel 8:22; "הכהן תתאים לכהנים שעשית בפייסות"), 22:45 (the platform round above and square below as the Malbim; kneeling, as the
  // commentators). The figures are the Second Temple plugin's lotteries' priests (its kit, carried over below).
  // ===== ARK_FIG_208 (the user, 12.11.2026 22:32: "הכהן תתאים לכהנים שעשית בפייסות בשרשור זה!"): THE FIGURES' KIT - the lotteries'
  // priest of the Second Temple plugin (its 55-payis.js PAYIS_FIGURE4, the kit it shares as SH.priestKit with its 55-tamid.js), carried
  // over whole: the same head, face, beard, kutonet, avnet, migba'at, hands and feet, the same textures and materials. Built once, lazily.
  function ark_kit() {
    if (ark_kit.kit) return ark_kit.kit;
    //@@include hand
    //@@include strap
    //@@include priest-kit
    return (ark_kit.kit = { FS, HEAD_Y, HAT_Y, SH_X, SH_Y, UP, FORE, HR, HS, EYE, ER, TAU, rnd, sstep, spl, surf, sph, at, rot, white, flatUV, cnv, WAIST, gRobeLow, gRobeUp,
      BODY, bX, bZ, gRobeBody, gSash, gHat, gCap, headOn, hairGeo, handRaw, handWr, handAt, footGeo, mat, mRobe, mSkin, mHand, mHat, mFace, mEye, mSashDyed, mSashWhite,
      mBeards, texHair, MIG, TEF, tefSet, tefOn, tefArm, gTefR, mTef, kidHands, kidHZ, kidLegs, kidBody });   // HANDS_K: kidBody (KIDDUSH_CROUCH_K)   // MIGBAAT_A2, TEFILLIN_A2 (ARK_TEF_M: the ark's priests too - with them)
  }
  // ARK_FIG_208: the kit's arms in amot (as the Second Temple's 55-tamid.js makeFigKit): the sleeve from the shoulder to the elbow, the
  // forearm, the open hand; the feet; the neck
  function ark_kitArms() {
    if (ark_kitArms.kg) return ark_kitArms.kg;
    const K = ark_kit(), FS = K.FS, sc = (q, s) => q.scale(s, s, s), W1 = (q) => K.white(q);
    const upper = (up) => sc(mergeGeometries([W1(K.sph(0.07, 0.07, 0.07, 14, 10)), W1(K.at(new CylinderGeometry(0.07, 0.058, up / FS, 14), 0, -up / FS / 2, 0)),
      W1(K.at(K.sph(0.058, 0.058, 0.058, 12, 8), 0, -up / FS, 0))]), FS);
    const fore = (fo) => sc(W1(K.at(new CylinderGeometry(0.056, 0.046, fo / FS, 14), 0, -fo / FS / 2, 0)), FS);
    const hand = (side, fo, pose) => sc(K.at(K.handRaw(side, pose), 0, -(fo / FS + 0.045), 0), FS);
    const foot = (side) => sc(K.footGeo(side).translate(-side * 0.1, 0, 0), FS);
    const P = { sx: K.SH_X * FS, sy: K.SH_Y * FS, up: K.UP * FS, fo: K.FORE * FS };
    const handW = (side) => sc(K.at(K.handRaw(side), 0, -0.045, 0), FS);   // KIDDUSH_FLAT_A2: the hand in its own wrist frame (as 55-tamid.js KG.handW)
    // HAND_A2 (the user: "הידיים נראות מזעזע"): the kit's new hand (shared/frag/hand.js) - at rest; closed round the staff (gripP); flat on
    // the foot in kiddush (handF)
    return (ark_kitArms.kg = { P, upP: upper(P.up), foP: fore(P.fo), handP: { 1: hand(1, P.fo), "-1": hand(-1, P.fo) }, handW: { 1: handW(1), "-1": handW(-1) }, foot: { 1: foot(1), "-1": foot(-1) },
      gripP: { 1: hand(1, P.fo, "gripW"), "-1": hand(-1, P.fo, "gripW") },   // HAND_GRIP_A2: on the thick staff (gripW; "grip" until now) handF: K.handWr ? { 1: K.handWr(1, "flat"), "-1": K.handWr(-1, "flat") } : null,
      neck: K.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0),
      // KIDDUSH_FOOT_213: the leg that rises - the thigh under the kutonet (along +y, 1 long: scaled to its length), the knee, the shin
      thigh: W1(new CylinderGeometry(0.084 * FS, 0.1 * FS, 1, 12, 1, true).translate(0, 0.5, 0)),
      knee: W1(K.sph(0.09 * FS, 0.09 * FS, 0.09 * FS, 12, 8)),
      shin: W1(new CylinderGeometry(0.04 * FS, 0.05 * FS, 1, 10, 1, true).translate(0, 0.5, 0)) });
  }
  // the arms' poses, [shoulder x, abduct, elbow] as 55-tamid.js POSES (a negative x lifts the arm forward): hanging; and the hand on the
  // staff that lies on the shoulder, before it (solved for a staff 0.3 off the body's middle, 2.62 over the floor - "בכתף ישאו", Numbers 7:9)
  const ARK_POSE = { stand: [0.05, 0.08, -0.15], staff: [-0.93, -0.2, -2.25] };
  function ark_setArm(A, v, side) { A.sh.rotation.x = v[0]; A.sh.rotation.z = side * v[1]; A.el.rotation.x = v[2]; }
  // HAND_GRIP_A2 (the coordinator: "להתאים את מקום המוט לטבעת של היד הסגורה... בלי חדירה ובלי רווח"): the staff arm's pose found so that the
  // closed hand (hand.js "gripW" - on a staff 0.11 amah in radius) holds the staff: the ring's middle on the staff's axis and its way along
  // the staff - the shoulder, the abduction and the elbow, and the hand turned about the forearm (psi) - near the old pose (a search, once
  // per side). The staff in the figure's frame: x = side * off (0.3 off his middle), y over his feet, along his z. -> { v, psi, beta }
  // MODEL CHOICES: the hand 0.4 before the shoulder along the staff; the elbow out; the bounds of the bend (the elbow 2.5 rad, the wrist
  // 0.7); the staff's thickness is the model's own (0.11 - 55-interior.js), the hand lies on it (it does not close round it)
  function ark_staffFit(side, off, sy) {
    const key = side + "|" + off.toFixed(3) + "|" + sy.toFixed(3), C = ark_staffFit.c || (ark_staffFit.c = {});
    if (C[key]) return C[key];
    const K = ark_kit(), KG = ark_kitArms(), P = KG.P, G = K.handAt(side, "gripW"), AXv = K.handAt(side, "gripWAx");
    const mS = new Matrix4(), mE = new Matrix4(), mH = new Matrix4(), mB = new Matrix4(), eu = new Euler(), c = new Vector3(), a = new Vector3();
    const err = (x) => {
      mS.makeRotationFromEuler(eu.set(x[0], 0, side * x[1])).setPosition(side * P.sx, P.sy, 0);
      mE.makeRotationX(x[2]).setPosition(0, -P.up, 0);
      mH.makeRotationY(x[3]).setPosition(0, -P.fo, 0).multiply(mB.makeRotationX(x[4]));   // the wrist: turned (psi) and bent (beta) at the forearm's end
      const m = mS.multiply(mE).multiply(mH);
      c.copy(G).applyMatrix4(m);
      a.copy(AXv).transformDirection(m);
      const dx = c.x - side * off, dy = c.y - sy, d0 = [-0.93, -0.2, -2.25];
      // the ring's middle on the staff's axis, its way along it; the hand before the shoulder; the elbow and the wrist within a man's bend
      return (dx * dx + dy * dy) * 4000 + (1 - a.z * a.z) * 40 + 0.5 * (c.z - 0.4) ** 2 + 0.01 * ((x[0] - d0[0]) ** 2 + (x[1] - d0[1]) ** 2 + (x[2] - d0[2]) ** 2)
        + 4 * Math.max(0, -x[2] - 2.5) ** 2 + 4 * Math.max(0, -x[1] - 0.3) ** 2 + 4 * Math.max(0, Math.abs(x[4]) - 0.7) ** 2;
    };
    const solve = (x0) => {
      let x = x0.slice(), e = err(x);
      for (const st of [0.4, 0.2, 0.1, 0.05, 0.02, 0.01, 0.004]) for (let it = 0; it < 60; it++) {
        let moved = false;
        for (let k = 0; k < 5; k++) for (const sg of [1, -1]) { const y = x.slice(); y[k] += sg * st; const ey = err(y); if (ey < e) { x = y; e = ey; moved = true; } }
        if (!moved) break;
      }
      return { x, e };
    };
    let best = null;
    for (const s0 of [[-0.93, -0.2, -2.25], [-1.3, -0.2, -2.2], [-1.6, -0.1, -2.0], [-1.1, 0.1, -2.3]]) for (const p0 of [0, 0.6, -0.6, 1.2, -1.2, 2.0, -2.0, 3.0]) for (const b0 of [0, 0.5, -0.5]) {
      const r = solve([...s0, p0, b0]);
      if (!best || r.e < best.e) best = r;
    }
    const x = best.x;
    // the miss, for the tests: the ring's middle off the staff's axis, and its way off the staff's (radians)
    err(x); const miss = Math.hypot(c.x - side * off, c.y - sy), tilt = Math.acos(Math.min(1, Math.abs(a.z)));
    return (C[key] = { v: x.slice(0, 3), psi: x[3], beta: x[4], miss, tilt });
  }
  // a priest (the lotteries' priest): white kutonet, the avnet of colours, the migba'at; n - which of the beards
  // waist (KIDDUSH_BEND_212): the robe in two at K.WAIST, all above it in `bend` (turned there: the legs stay upright)
  // TEFILLIN_A2: noTef - no tefillin (none asks for it now: ARK_TEF_M - the ark's carriers have them, as every priest); every priest has the head's
  function ark_priestFig(n, waist, noTef) {
    const K = ark_kit(), KG = ark_kitArms(), FS = K.FS;
    const g = new Group(), lean = new Group();
    g.name = "arkPriest";
    g.add(lean);
    const S = new Group();
    S.scale.setScalar(FS);
    lean.add(S);
    let bend = null, U = S;
    if (waist) {
      bend = new Group();
      bend.position.y = K.WAIST * FS;
      lean.add(bend);
      U = new Group();
      U.scale.setScalar(FS);
      U.position.y = -K.WAIST * FS;
      bend.add(U);
    }
    const body = new Mesh(waist ? K.gRobeLow : K.gRobeBody, K.mRobe);
    body.castShadow = true;
    S.add(body);
    if (waist) { const up = new Mesh(K.gRobeUp, K.mRobe); up.castShadow = true; U.add(up); }
    // KIDDUSH_CROUCH_K (fix-k): the neck, the head and the migba'at in one group turned at the neck's foot (as the Second Temple's 55-tamid.js
    // NK) - at kiddush the head is lifted on it (the kit's kidBody); standing, not turned: all where it was
    const NKY = 1.86, NK = new Group();
    NK.position.y = NKY;
    U.add(NK);
    { const nk = new Mesh(KG.neck, K.mSkin); nk.position.y = -NKY; NK.add(nk); }
    U.add(new Mesh(K.gSash, K.mSashDyed));
    const hg = K.headOn(NK, K.HEAD_Y - NKY, K.mBeards[[3, 1, 6, 4][n % 4]], n);
    hg.rotation.set(0, (((n * 0.618) % 1) - 0.5) * 0.3, 0);
    if (!noTef && K.tefOn) K.tefOn(hg);   // TEFILLIN_A2
    const hat = new Mesh(K.gHat, K.mHat);
    hat.position.y = K.HAT_Y - NKY;
    hat.rotation.y = hg.rotation.y + (((n * 0.37) % 1) - 0.5) * 0.9;
    NK.add(hat);
    const arm = (side) => {
      const sh = new Group();
      sh.position.set(side * KG.P.sx, KG.P.sy - (bend ? bend.position.y : 0), 0);
      (bend || lean).add(sh);
      const up = new Mesh(KG.upP, K.mRobe);
      up.castShadow = true;
      sh.add(up);
      const el = new Group();
      el.position.y = -KG.P.up;
      sh.add(el);
      const fo = new Mesh(KG.foP, K.mRobe);
      fo.castShadow = true;
      el.add(fo);
      // KIDDUSH_FLAT_A2: with a waist (the washing priest) the hand on its own wrist (wr), which turns for the palm on the foot
      if (waist) { const wr = new Group(); wr.position.y = -KG.P.fo; el.add(wr); wr.add(wr.userData.hand = new Mesh(KG.handW[side], K.mHand)); return { sh, el, wr, side }; }
      const hm = new Mesh(KG.handP[side], K.mHand);
      el.add(hm);
      return { sh, el, hand: hm, side };
    };
    const L = arm(1), R = arm(-1);
    const fl = new Mesh(KG.foot[1], K.mSkin), fr = new Mesh(KG.foot[-1], K.mSkin);
    fl.position.x = 0.1 * FS;
    fr.position.x = -0.1 * FS;
    g.add(fl, fr);
    ark_setArm(L, ARK_POSE.stand, 1);
    ark_setArm(R, ARK_POSE.stand, -1);
    // KIDDUSH_FOOT_213: with a waist, a leg that rises on each side (hidden while he stands - his own foot then)
    let legs = null;
    if (waist) {
      legs = {};
      for (const side of [1, -1]) {
        const lg = new Group();
        lg.visible = false;
        lean.add(lg);
        const th = new Mesh(KG.thigh, K.mRobe), kn = new Mesh(KG.knee, K.mRobe), sn = new Mesh(KG.shin, K.mSkin), ft = new Mesh(KG.foot[side], K.mSkin);
        for (const m of [th, kn, sn, ft]) { m.castShadow = true; lg.add(m); }
        legs[side] = { g: lg, th, kn, sn, ft };
      }
    }
    return { g, lean, bend, legs, L, R, fl, fr, hat, hg, S: U, A: KG.P, body: waist ? body : null, neck: NK };   // HANDS_K: body, neck (KIDDUSH_CROUCH_K)   // (HP_RISHON_A2: hat, hg, S; KIDDUSH_FLAT_A2: A - the arm, for the kit's kidHands)
  }
  // HP_KIT_A2 (the user via the coordinator, 22.11.2026: "בבית ראשון להשתמש באותה בנייה עצמה, ולא בבנייה נפרדת"): THE HIGH PRIEST IN
  // HIS EIGHT AND THE PRIEST IN HIS FOUR - the Second Temple's construction itself (shared/frag/hp-kit.js; until now its 55-tamid.js
  // buildHP), on this kit: the robe, the ephod by Rashi or by the Rambam, its shoulders of the ephod's work (the user's decision 105),
  // the breastplate, the tzitz, the mitznefet of shesh tilted back with its cords of techelet by Rashi or by the Ramban. (Until 1.4.x
  // here a construction of its own - ark_hpFig - which the user did not accept: "האפוד... לא נכון".) Built once, lazily.
  function ark_hpKit() {
    if (ark_hpKit.k) return ark_hpKit.k;
    //@@include hp-kit
    return (ark_hpKit.k = hpKit(ark_kit()));
  }
  // KIDDUSH_FOOT_213 (the user, 16.11.2026 17:14: "הקידוש צריך להיות יד ימין על רגל ימין (מורמת) וכן בשמאל לפי הסדר! בכל ההדגמות!"),
  // as the Second Temple's 55-tamid.js: the leg in the figure's frame (kit units; side +1 the left) - the hip; the knee and the ankle
  // standing (0) and raised (1); the foot's pitch; the hand's place on the raised foot (amot). The shapes and the height - model choices.
  // KIDDUSH_LEG_214: the leg reaches further forward and the foot is higher (the knee at the hip's height, the hand on the foot at F + 1.34,
  // 1.3 ahead of him; until 1.4.7 the knee rose above the hip and the shin ran in under the bent body, so that from the follow view only
  // a hand on a foot in the air was seen - the leg itself was hidden), and the bend is less (42 degrees instead of 48)
  const ARK_LEG = { hip: 1.0, k0: [0.1, 0.55, 0.02], k1: [0.18, 1.12, 0.43], a0: [0.1, 0.15, -0.01], a1: [0.27, 1.02, 0.83], pitch: 0.1, side: 0.12 };   // side: the lean to the standing leg (the head off the stream)
  function ark_legAt(side, u) {
    const L2 = (a, b) => [side * (a[0] + (b[0] - a[0]) * u), a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
    return { H: [side * 0.1, ARK_LEG.hip, 0], K: L2(ARK_LEG.k0, ARK_LEG.k1), A: L2(ARK_LEG.a0, ARK_LEG.a1), pitch: ARK_LEG.pitch * u };
  }
  function ark_kidLocal(side) {
    const FS = ark_kit().FS, q = ark_legAt(side, 1), c = Math.cos(q.pitch), sn = Math.sin(q.pitch);
    return [q.A[0] * FS, (q.A[1] - 0.09 * c - 0.11 * sn + 0.035) * FS, (q.A[2] - 0.09 * sn + 0.11 * c) * FS];
  }
  // a priest with a waist and legs (ark_priestFig(n, true)) at kiddush: side -1 the right, +1 the left; u 0..1 how far the foot is up.
  // The bend is the least that lets the hand reach the raised foot; the arm by two bones (cached per figure and side).
  function ark_kidPose(w, side, u) {
    const K = ark_kit(), KG = ark_kitArms(), FS = K.FS, P = KG.P, WY = w.bend.position.y;
    const cl = (v, a, b) => (v < a ? a : v > b ? b : v), a = P.up, b = P.fo + 0.06 * FS;
    w.kid = w.kid || {};
    if (!w.kid[side]) {
      const T = ark_kidLocal(side), sp = [side * P.sx, P.sy - WY, 0], ph = side * ARK_LEG.side, cp = Math.cos(ph), spp = Math.sin(ph);
      let th = 0, Tb = null;
      for (th = 0; th <= 1.3; th += 0.02) {
        const cb = Math.cos(th), sb = Math.sin(th), dy = T[1] - WY, y1 = dy * cb + T[2] * sb, z1 = -dy * sb + T[2] * cb;
        Tb = [T[0] * cp + y1 * spp, -T[0] * spp + y1 * cp, z1];   // back through the bend group's Rx(th) then Rz(ph)
        if (Math.hypot(Tb[0] - sp[0], Tb[1] - sp[1], Tb[2] - sp[2]) <= (a + b) * 0.985) break;
      }
      const vx = Tb[0] - sp[0], vy = Tb[1] - sp[1], vz = Tb[2] - sp[2], D3 = Math.hypot(vx, vy, vz) || 1e-6;
      const al = Math.asin(cl(vx / D3, -0.9, 0.9)), ca = Math.cos(al);
      const Dp = Math.min(Math.hypot(vy, vz), (a + b) * ca - 1e-4), a2 = a * ca, b2 = b * ca;
      const be = Math.acos(cl((a2 * a2 + Dp * Dp - b2 * b2) / (2 * a2 * Dp), -1, 1)), ga = Math.acos(cl((a2 * a2 + b2 * b2 - Dp * Dp) / (2 * a2 * b2), -1, 1));
      w.kid[side] = { th, ph, arm: [Math.atan2(-vz, -vy) + be, side * al, -(Math.PI - ga)] };
    }
    const H = w.kid[side], other = [0.15, 0.32, -0.3], st = ARK_POSE.stand, mix = (q, v) => [q[0] + (v[0] - q[0]) * u, q[1] + (v[1] - q[1]) * u, q[2] + (v[2] - q[2]) * u];
    ark_setArm(side < 0 ? w.R : w.L, mix(st, H.arm), side);
    ark_setArm(side < 0 ? w.L : w.R, mix(st, other), -side);
    w.lean.rotation.x = 0;
    w.bend.rotation.x = H.th * u;
    w.bend.rotation.z = H.ph * u;
    for (const sd of [1, -1]) {
      const lg = w.legs[sd], uu = sd === side ? u : 0, on = uu > 0.02;
      lg.g.visible = on;
      (sd > 0 ? w.fl : w.fr).visible = !on;
      if (!on) continue;
      const q = ark_legAt(sd, uu), Hh = q.H.map((v) => v * FS), Kp = q.K.map((v) => v * FS), A = q.A.map((v) => v * FS);
      const seg = (m, p0, p1) => {
        const d = new Vector3(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]), n = d.length() || 1e-6;
        m.position.set(p0[0], p0[1], p0[2]);
        m.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.multiplyScalar(1 / n));
        m.scale.set(1, n, 1);
      };
      seg(lg.th, Hh, Kp);
      lg.kn.position.set(Kp[0], Kp[1], Kp[2]);
      seg(lg.sn, Kp, A);
      const c = Math.cos(q.pitch), sn = Math.sin(q.pitch), ay = 0.15 * FS, az = -0.01 * FS;
      lg.ft.rotation.set(q.pitch, 0, 0);
      lg.ft.position.set(A[0], A[1] - (ay * c - az * sn), A[2] - (ay * sn + az * c));
    }
  }
  // KIDDUSH_FLAT_A2 (the user via the coordinator, 22.11.2026: "כף היד על כף הרגל, וכך שניהם בו זמנית"): a priest with a waist
  // (ark_priestFig(n, true)) at kiddush - "מניח ידו הימנית על גבי רגלו הימנית, וידו השמאלית על גבי רגלו השמאלית, ומקדש" (Zevachim 19b):
  // the feet together, he bows, each palm flat on the back of its foot, at once (the kit's kidHands - the same in the Second Temple's
  // 55-tamid.js); u 0..1 - how far into it. Until now (KIDDUSH_BEND_212) the legs upright, bent at the waist by kb, each hand on the
  // front of its leg as low as it reached.
  // HAND_A2: an arm's hand (ark_priestFig without a waist) closed round the staff, or at rest
  const _ahq = new Quaternion(), _ahq2 = new Quaternion(), _ahp = new Vector3(), _ahX = new Vector3(1, 0, 0), _ahY = new Vector3(0, 1, 0);
  function ark_staffHand(A2, on, fit) {
    const KG = ark_kitArms();
    if (!A2 || !A2.hand || !KG.gripP) return;
    const gq = (on ? KG.gripP : KG.handP)[A2.side];
    if (A2.hand.geometry !== gq) A2.hand.geometry = gq;
    // HAND_GRIP_A2: on the staff the wrist turned (psi) and bent (beta) at the forearm's end - the hand's mesh turned about the wrist
    if (on && fit) { _ahq.setFromAxisAngle(_ahY, fit.psi).multiply(_ahq2.setFromAxisAngle(_ahX, fit.beta)); A2.hand.quaternion.copy(_ahq); _ahp.set(0, -KG.P.fo, 0); A2.hand.position.copy(_ahp).sub(_ahp.clone().applyQuaternion(_ahq)); }
    else { A2.hand.quaternion.identity(); A2.hand.position.set(0, 0, 0); }
  }
  function ark_kiddush(w, u, mode = "tk") {
    const K = ark_kit(), FS = K.FS;
    // KIDDUSH_RYOSE_A2: mode "ryose" - Rabbi Yose b. R. Yehuda: the right foot on the left, the hands one on the other above (the kit's)
    const H = K.kidHands(w, ark_setArm, mode), mix = (q, v) => [q[0] + (v[0] - q[0]) * u, q[1] + (v[1] - q[1]) * u, q[2] + (v[2] - q[2]) * u];
    w.lean.rotation.x = 0;
    w.bend.rotation.set(H.th * u, 0, 0);
    ark_setArm(w.L, mix(ARK_POSE.stand, H.arm[1]), 1);
    ark_setArm(w.R, mix(ARK_POSE.stand, H.arm[-1]), -1);
    const qI = ark_kiddush.qI || (ark_kiddush.qI = new Quaternion());
    for (const [A2, sd] of [[w.L, 1], [w.R, -1]]) if (A2.wr) A2.wr.quaternion.slerpQuaternions(qI, H.wq[sd], u);
    // HAND_A2: the palms flat on the feet (and on the hand in "ryose") once he is down to them; else at rest
    const KG = ark_kitArms();
    if (KG.handF) for (const [A2, sd] of [[w.L, 1], [w.R, -1]]) { const m = A2.wr && A2.wr.userData.hand, gq = u > 0.35 ? KG.handF[sd] : KG.handW[sd]; if (m && m.geometry !== gq) m.geometry = gq; }
    K.kidLegs(w, H, u);   // the feet (and in "ryose" the right leg laid on the left)
    if (K.kidBody) K.kidBody(w, H, u);   // HANDS_K (KIDDUSH_CROUCH_K): the hips down and back, the kutonet over bent knees, the head up
    return H;
  }
  // KING_211: the king's cloths - his robe of tekhelet, his mantle of argaman bordered with gold, his dark hair - made once, for the
  // kneeling king of "דבקו שערים" (below) and for the king who climbs his throne (60-palace.js pal_kingFig)
  // KING_KIPPAH_211 (the user, 15.11.2026 08:23: "אתה לא יכול לצייר לי מלך בלי כיפה"): THE KING'S HEAD IS COVERED - a kippah on his hair,
  // of the mantle's argaman, a thin rim of gold round it (under the crown, where he wears one). Put on the head's own group
  // (K.headOn's), so it goes with the head. Its form, size and colour - model choices.
  function ark_kingKippah(GOLD) {
    const K = ark_kit(), q = 1.17, TH = 1.0, g = new Group();
    const mk = ark_kingKippah.m || (ark_kingKippah.m = new MeshStandardMaterial({ color: 0x7a2145, roughness: 0.82, side: DoubleSide }));
    const cap = new Mesh(new SphereGeometry(1, 28, 9, 0, Math.PI * 2, 0, TH), mk);
    cap.scale.set(K.HR[0] * q, K.HR[1] * q, K.HR[2] * q);
    const rim = new Mesh(new TorusGeometry(Math.sin(TH), 0.045, 8, 36), GOLD);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = K.HR[1] * q * Math.cos(TH);
    rim.scale.set(K.HR[0] * q, K.HR[2] * q, K.HR[0] * q * 1.1);   // (the ring lies flat: its own y is the head's z)
    g.add(cap, rim);
    g.rotation.x = -0.1;          // a little back on the head, as a kippah lies
    g.position.set(0, 0.004, -0.006);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.userData.noPick = true; } });
    return g;
  }
  function ark_kingMats() {
    if (ark_kingMats.m) return ark_kingMats.m;
    const K = ark_kit();
    const tRobe = K.cnv(64, 64, 5, 8, (c, w, h) => {
      c.fillStyle = "#2d4d99";
      c.fillRect(0, 0, w, h);
      c.strokeStyle = "rgba(214,184,96,0.42)";
      c.lineWidth = 1.3;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.beginPath(); c.arc(i * 16 + 8, j * 16 + 8, 3.4, 0, Math.PI * 2); c.stroke(); }
    });
    const mRobeK = K.mat(0xffffff, { map: tRobe, vertexColors: true, roughness: 0.68 });
    const tMantle = K.cnv(256, 256, 1, 1, (c, w, h) => {
      c.fillStyle = "#6c1c3b";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < w; i += 9) c.fillRect(i, 0, 3, h);
      c.fillStyle = "#d4ab48";
      c.fillRect(0, 0, 13, h);
      c.fillRect(w - 13, 0, 13, h);
      c.fillRect(0, h - 13, w, 13);
      c.fillStyle = "#8a6a1e";
      c.fillRect(13, 0, 2, h);
      c.fillRect(w - 15, 0, 2, h);
      c.fillRect(0, h - 15, w, 2);
    });
    const mMantle = K.mat(0xffffff, { map: tMantle, vertexColors: true, roughness: 0.74, side: DoubleSide });
    const mHairK = K.mat(0x2a1c12, { map: K.texHair, vertexColors: true, roughness: 0.95, side: DoubleSide });
    return (ark_kingMats.m = { mRobeK, mMantle, mHairK });
  }
  // THE KING (the user, 12.11.2026 22:32: "דמות שלמה... תחפש באינטרנט דוד המלך ותעשה כמוהו רק לא גינגי"): as the paintings of King David -
  // a bearded king, a crown of gold with points, royal garments - on the priests' body (the same head, face and hands); his hair and beard
  // dark. KNEELING, his palms spread toward heaven: 22:45 ("אז תהפוך") after the commentators - "המלך כיון שכרע שוב אינו זוקף" (Berachot
  // 34b on I Kings 8:54); Ralbag 8:54 "כרע על ברכיו מהתחלת תפלתו עד כלותו"; Abarbanel 8:22 "שהיה כורע על ברכיו כל זמן התפלה"; the verse
  // 8:54 "מכרע על ברכיו וכפיו פרשות השמים". The garments: "בלבוש מלכות תכלת וחור ועטרת זהב גדולה ותכריך בוץ וארגמן" (Esther 8:15) - a
  // robe of tekhelet, a mantle of argaman bordered with gold (model choices: colours, cut, the crown's form). Front +z.
  function ark_kingFig(M2) {
    const K = ark_kit(), KG = ark_kitArms(), FS = K.FS, DROP = 0.5;   // kneeling: the body half a figure-unit (0.7 amah) lower, the shins behind
    const g = new Group();
    g.name = "arkKing";
    const S = new Group();
    S.scale.setScalar(FS);
    g.add(S);
    const { mRobeK, mMantle, mHairK } = ark_kingMats();
    const GOLD = M2.gold;
    const sp = (tab, y) => K.spl(tab, y);
    // the robe of a kneeling man: above the hips as the priest's kutonet (DROP lower); below them it falls over the thighs to the floor
    // and lies back over the shins and the feet
    const gKneel = K.surf(40, 34, (u, v, o) => {
      const yk = 0.02 + v * (1.9 - DROP - 0.02), a = u * K.TAU + Math.PI, ca = Math.cos(a), sa = Math.sin(a);
      const low = Math.max(0, (0.8 - yk) / 0.8), fold = (Math.sin(7 * a + 0.8) * 0.6 + Math.sin(11 * a + 2.1) * 0.4) * low;
      let xw, zf, zb;
      if (yk >= 0.5) { xw = sp(K.bX, yk + DROP); zf = zb = sp(K.bZ, yk + DROP); }
      else {
        const s = (0.5 - yk) / 0.48;
        xw = sp(K.bX, 1.0) + 0.085 * s;
        zf = sp(K.bZ, 1.0) + 0.08 * s;
        zb = sp(K.bZ, 1.0) + 0.43 * Math.pow(s, 1.3);
      }
      o.x = xw * sa * (1 + 0.03 * fold);
      o.z = (ca >= 0 ? zf : zb) * ca * (1 + 0.03 * fold);
      o.y = yk;
      o.c = 1 - 0.14 * Math.max(0, -fold);
      o.tv = yk / 1.4;
    });
    const robe = new Mesh(gKneel, mRobeK);
    robe.castShadow = true;
    S.add(robe);
    // the mantle: from the shoulders round the back and the sides, down to the floor and lying behind him
    const gMantle = K.surf(30, 30, (u, v, o) => {
      const a = Math.PI + (u - 0.5) * 2.85, ca = Math.cos(a), sa = Math.sin(a);
      const yk = 0.025 + v * (1.79 - DROP - 0.025);
      let xw, zw;
      if (yk >= 0.5) { const ys = Math.min(1.79, yk + DROP); xw = sp(K.bX, ys) + 0.035 + 0.035 * (1 - v); zw = sp(K.bZ, ys) + 0.04 + 0.045 * (1 - v); }
      else { const s = (0.5 - yk) / 0.475; xw = sp(K.bX, 1.0) + 0.105 + 0.11 * s; zw = sp(K.bZ, 1.0) + 0.085 + 0.5 * Math.pow(s, 1.3); }
      const fold = Math.sin(9 * a + 1.3) * (1 - v) * 0.028;
      o.x = (xw + fold) * sa;
      o.z = (zw + fold) * ca;
      o.y = yk;
      o.c = 0.88 + 0.12 * Math.sin(9 * a + 1.3);
      o.tu = u;
      o.tv = v;
    }, true);
    const mantle = new Mesh(gMantle, mMantle);
    mantle.castShadow = true;
    S.add(mantle);
    // what stands above the hips, as on the priest, DROP lower: the neck, a belt of gold, a collar of gold, the head with the crown
    const U = new Group();
    U.position.y = -DROP;
    S.add(U);
    U.add(new Mesh(KG.neck, K.mSkin));
    U.add(new Mesh(K.gSash, GOLD));
    const collar = new Mesh(new TorusGeometry(0.112, 0.02, 8, 28), GOLD);
    collar.rotation.x = Math.PI / 2;
    collar.scale.set(1, 0.84, 1);
    collar.position.y = 1.855;
    U.add(collar);
    const hg = K.headOn(U, K.HEAD_Y, mHairK, 2);
    hg.add(ark_kingKippah(GOLD));   // KING_KIPPAH_211: under the crown
    const crown = new Group();
    const band = new Mesh(new CylinderGeometry(0.152, 0.145, 0.072, 32, 1, true), GOLD);
    band.position.y = 0.112;
    crown.add(band);
    const ptG = new ConeGeometry(0.03, 0.085, 4), ballG = new SphereGeometry(0.014, 8, 6), gemG = new SphereGeometry(0.0125, 8, 6);
    const RED = K.mat(0xb3122e, { roughness: 0.25, emissive: 0x3a0610 }), GREEN = K.mat(0x1f7a3d, { roughness: 0.25, emissive: 0x062a12 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * K.TAU, x = Math.sin(a), z = Math.cos(a);
      const pt = new Mesh(ptG, GOLD);
      pt.position.set(x * 0.149, 0.19, z * 0.149);
      pt.rotation.y = a;
      crown.add(pt);
      const ball = new Mesh(ballG, GOLD);
      ball.position.set(x * 0.149, 0.238, z * 0.149);
      crown.add(ball);
      const b2 = a + Math.PI / 8, gem = new Mesh(gemG, i % 2 ? GREEN : RED);
      gem.position.set(Math.sin(b2) * 0.152, 0.112, Math.cos(b2) * 0.152);
      crown.add(gem);
    }
    crown.scale.set(1, 1, 1.08);
    hg.add(crown);
    // the arms, spread toward heaven, the palms up
    const arm = (side) => {
      const sh = new Group();
      sh.position.set(side * KG.P.sx, KG.P.sy - DROP * FS, 0);
      g.add(sh);
      const up = new Mesh(KG.upP, mRobeK);
      up.castShadow = true;
      sh.add(up);
      const el = new Group();
      el.position.y = -KG.P.up;
      sh.add(el);
      el.add(new Mesh(KG.foP, mRobeK));
      const cuff = new Mesh(new TorusGeometry(0.068, 0.012, 6, 18), GOLD);
      cuff.rotation.x = Math.PI / 2;
      cuff.position.y = -KG.P.fo + 0.03;
      el.add(cuff);
      const hand = new Mesh(KG.handP[side], K.mHand);
      hand.rotation.y = side * Math.PI / 2;
      el.add(hand);
      return { sh, el, hand };
    };
    const L = arm(1), R = arm(-1);
    const pray = (v) => { ark_setArm(L, v, 1); ark_setArm(R, v, -1); };
    pray(ARK_KING_PRAY);
    return { g, L, R, pray, crown };
  }
  const ARK_KING_PRAY = [-1.95, 0.55, -0.3];
  // SOLOMON'S BRONZE PLATFORM (II Chr 6:13 "כי עשה שלמה כיור נחשת ויתנהו בתוך העזרה חמש אמות ארכו וחמש אמות רחבו ואמות שלוש קומתו
  // ויעמד עליו ויברך על ברכיו"). KIYOR_RALBAG_208 (the user, 13.11.2026 01:3x: "כמלבי״ם: עשר על עשר"): its form and measure as the
  // Malbim there (3364, line 147): "ומ״ש חמש אמות ארכו היינו מן האמצע, כי היה למעלה עגול ולמטה מרובע, והיה המרובע נחלק לשתים, ממקום
  // שבא העגול עד קצהו, והיו חמש אמות לכל צד" - five from the middle to every side: 10 x 10, a square below and a round top, 3 high in
  // all. (Until this change 5 x 5 - against the Malbim's own words; NOT one of the stands, which are 4 x 4 "על כתף הבית", I Kings 7:27, 39.)
  // MODEL CHOICES: the square's height (2) and the round top's (1), the top's breadth (9.2), the frames on the faces.
  function ark_platform(M2) {
    const g = new Group();
    g.name = "arkKiyor";
    const br = M2.bronze;
    const box = (w, h, d, x, y, z) => { const m = new Mesh(new BoxGeometry(w, h, d), br); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    const S = 10, H = S / 2;
    box(S, 2, S, 0, 1, 0);
    for (const s of [-1, 1]) {            // the frames on its four faces, a little proud
      for (const y of [0.12, 1.88]) { box(S + 0.08, 0.16, 0.08, 0, y, s * (H + 0.02)); box(0.08, 0.16, S + 0.08, s * (H + 0.02), y, 0); }
      for (const t of [-(H - 0.08), -H / 2, 0, H / 2, H - 0.08]) { box(0.16, 1.9, 0.08, t, 1, s * (H + 0.02)); box(0.08, 1.9, 0.16, s * (H + 0.02), 1, t); }
    }
    const top = new Mesh(new CylinderGeometry(4.6, 4.75, 1, 64), br);
    top.position.y = 2.5;
    top.castShadow = top.receiveShadow = true;
    g.add(top);
    return g;
  }
  // KIYOR_RALBAG_208 (the user, 13.11.2026 01:36: "תעשה כרלבג"; and on the question where - "בחצר החיצונה, מול השער"): the Ralbag
  // (I Kings 8:22; 3645, line 350): "אחשוב שהיה עומד בעזרה גדולה שהיא עזרת ישראל... והבאור הראשון הוא יותר נכון" - not in the court
  // of the priests (the Abarbanel's "שבא בחצר הכהנים לפני מזבח הנחשת" - the card's "בקצרה"). So the platform stands OUTSIDE the inner
  // court, in the outer court (its floor MNT_WC_Y above the mount), before the inner court's east gate, on the house's axis, his face
  // west to the house through the gate; east of the gate's steps (x 98.5..101.5) and of the king's "עמוד" (MNT_AMUD, x 106, z 8 - which
  // Rashi, II Chr 23:13, likens to this platform: "עומד על עמודו. כדאמר ויעמד המלך על העמוד, כי עשה שלמה כיור נחשת וגו׳").
  //@@include omanin
  const ARK_KIYOR = { x: 115, z: 0 };   // model choice: its place in that court (x 110..120)
  const ark_kiyorY = (LV) => (LV.HAR || 0) + (typeof MNT_WC_Y === "number" ? MNT_WC_Y : 3);
  async function buildArk(ctx) {
    const M2 = ctx.M, LV = ctx.LV;
    // SCALE_FIG_A2 (fix-a2, 22.11.2026; the user's decision 23, both houses): A FIGURE FOR SCALE - one priest, 170 cm tall in an amah of
    // 48 cm = 3.54 amot to the top of his head (the user's numbers - a model choice), in his garments, with the head's tefillin (a
    // weekday, by day). He stands on the floor a little to the right of what one looks at (a fifth of the view's distance, 1.5 to 12
    // amot), facing the eye, and goes with the view. Built when first asked. ctx.shared.scaleFigure = { on, set(on) } - the row "דמות
    // לקנה מידה" (70-ui.js). Where he stands - a model choice.
    {
      const SF = { on: false, w: null, at: new Vector3(Infinity, 0, 0), tg: new Vector3(Infinity, 0, 0) };
      const place = () => {
        const cam = ctx.camera, oc = ctx.controls;
        if (!cam || !oc || !SF.w) return;
        if (SF.at.distanceToSquared(cam.position) < 1e-6 && SF.tg.distanceToSquared(oc.target) < 1e-6) return;
        SF.at.copy(cam.position); SF.tg.copy(oc.target);
        const dx = oc.target.x - cam.position.x, dz = oc.target.z - cam.position.z, L = Math.hypot(dx, dz) || 1;
        const off = Math.max(1.5, Math.min(12, cam.position.distanceTo(oc.target) * 0.2));
        let x = oc.target.x - (dz / L) * off, z = oc.target.z + (dx / L) * off;
        // SCALE_PLACE_H (fix-h, as in the Second Temple's: the figure stood over the camera in close views): never nearer to the eye than
        // 3.5 amot - in a close view he steps back, beyond the target; and the floor under him not higher than the target's own level
        { const ex = x - cam.position.x, ez = z - cam.position.z, d0 = Math.hypot(ex, ez), MIN = 3.5;
          if (d0 < MIN) { const k = Math.sqrt(Math.max(0, MIN * MIN - off * off)) - (ex * dx + ez * dz) / L; x += (dx / L) * Math.max(0, k); z += (dz / L) * Math.max(0, k); } }
        let fy = typeof ctx.shared.floorY === "function" ? ctx.shared.floorY(x, oc.target.y + 2.5, z) : -Infinity;
        if (isFinite(fy) && fy > oc.target.y + 0.5 && typeof ctx.shared.floorY === "function") fy = ctx.shared.floorY(x, oc.target.y + 0.5, z);
        SF.w.g.position.set(x, isFinite(fy) ? fy : oc.target.y, z);
        SF.w.g.rotation.y = Math.atan2(cam.position.x - x, cam.position.z - z);
      };
      ctx.shared.scaleFigure = {
        get on() { return SF.on; },
        set(on) {
          SF.on = !!on;
          if (SF.on && !SF.w) {
            const K = ark_kit(), w = ark_priestFig(2);
            w.g.scale.setScalar(3.54 / ((K.HEAD_Y + K.HR[1]) * K.FS));
            w.g.name = "scaleFigure";
            w.g.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
            ctx.root.add(w.g);
            SF.w = w;
          }
          if (SF.w) { SF.w.g.visible = SF.on; SF.at.set(Infinity, 0, 0); place(); }
          return SF.on;
        }
      };
      ctx.animated.push(() => { if (SF.on) place(); });
    }
    // HP_RISHON_A2 (the user's decision 70 b): "בגדי הכהנים" - a priest in his four garments and the high priest in his eight, side by
    // side between the ulam and the altar, facing east; built when first asked. HP_KIT_A2: the pair of both houses (hpKit pair - the
    // Second Temple has the same, 55-payis.js), its readings - the common priest's avnet (Yoma 12b), the ephod and the mitznefet - from
    // the opinions table. ctx.shared.priestGarments = { on, set(on), reading(o), state }.
    {
      const PG = new Group();
      PG.name = "priestGarments";
      PG.visible = false;
      ctx.root.add(PG);
      ctx.layers.priestGarments = PG;
      const X = 37, Y = 6, Z = 14;
      let P = null;
      const want = { belt: "kilayim", ephod: "rashi", mitz: "rashi" };
      // (LABEL_NEAR_A2: each caption over its own figure, at a height of its own, and it keeps shrinking as the eye comes near - kMin)
      const PGI = { info: "בגדי הכהנים — הפירוט בתפריט, תחת ״הכהנים״: ״בגדי הכהנים — כהן הדיוט וכהן גדול״.", refs: [["רמב״ם כלי המקדש ח, א", { book: 338, index: 123 }], ["רמב״ם כלי המקדש ח, ב", { book: 338, index: 124 }]] };
      ctx.labels.push(Object.assign({ text: "כהן הדיוט — ארבעה בגדים", x: X, y: Y + 3.9, z: Z - 1.4, size: 0.5, kMin: 0.32, layer: "priestGarments" }, PGI),
        Object.assign({ text: "כהן גדול — שמונה בגדים", x: X, y: Y + 4.35, z: Z + 1.4, size: 0.5, kMin: 0.32, layer: "priestGarments" }, PGI));
      // AVNET_ONE_A2 (the user's decision, via the coordinator: one switch "אבנט כהן הדיוט: כלאים / בוץ" for all the priests and the pair
      // together - as the Second Temple's row "אבנטו של כהן הדיוט"): the kit's dyed avnet takes the white weave (every priest of the kit
      // wears that one material), the pair's priest too, and the crowds' (people-kit, ctx.shared.peopleAvnet). The high priest's - always of
      // wool and linen (his own material). ctx.shared.priestBelt = { mode, set("kilayim" | "butz") }
      ctx.shared.priestBelt = {
        mode: "kilayim",
        set(m) {
          this.mode = m === "butz" ? "butz" : "kilayim";
          const K = ark_kit(), D = K.mSashDyed;
          if (!D.userData.dyedMap) D.userData.dyedMap = D.map;
          D.map = this.mode === "butz" ? K.mSashWhite.map : D.userData.dyedMap; D.needsUpdate = true;
          want.belt = this.mode; if (P) P.set(want);
          const PA = ctx.shared.peopleAvnet; if (PA && typeof PA.set === "function") PA.set(this.mode === "butz" ? "butz" : "rambam");
          return this.mode;
        }
      };
      ctx.shared.priestGarments = {
        get on() { return PG.visible; },
        get state() { return Object.assign({}, want); },
        reading(o) { Object.assign(want, o || {}); if (P) P.set(want); return Object.assign({}, want); },
        set(on) {
          if (on && !P) { P = ark_hpKit().pair(); P.g.position.set(X, Y, Z); PG.add(P.g); P.set(want); }
          PG.visible = !!on;
          return PG.visible;
        }
      };
    }
    const g = new Group();
    g.name = "arkGates";
    g.visible = false;
    ctx.root.add(g);
    ctx.layers.arkGates = g;
    // the preview for the user's approval: the king on his platform, and the four priests carrying the ark in the court before the steps
    const pv = new Group();
    pv.name = "arkPreview";
    pv.visible = false;
    ctx.root.add(pv);
    let pvBuilt = false;
    const buildPreview = () => {
      pvBuilt = true;
      const plat = ark_platform(M2);
      plat.position.set(ARK_KIYOR.x, ark_kiyorY(LV), ARK_KIYOR.z);
      pv.add(plat);
      const king = ark_kingFig(M2);
      king.g.position.set(ARK_KIYOR.x, ark_kiyorY(LV) + 3, ARK_KIYOR.z);
      king.g.rotation.y = -Math.PI / 2;
      pv.add(king.g);
      const A = ctx.shared.arkParts, X = 34, Y = LV.AZ;
      const ark = new Group();
      if (A) {
        const box = new Group();
        for (const o of A.body) { const c = o.clone(true); c.visible = true; box.add(c); }
        box.position.set(-(A.x0 != null ? A.x0 : A.x), -A.y0, 0);   // ARK_PLACE_D: the pieces' own (built) line
        ark.add(box);
        const sg = new CylinderGeometry(0.11, 0.11, 1, 10);
        sg.rotateZ(Math.PI / 2);
        for (const s of [-1, 1]) { const m = new Mesh(sg, A.staffMat); m.position.set(0, A.h / 2, s * A.staffZ); m.scale.x = 5.2; ark.add(m); }
      }
      ark.position.set(X, Y + 2.62 - 0.75, 0);
      pv.add(ark);
      let n = 0;
      for (const dx of [-1.6, 1.6]) for (const s of [-1, 1]) {
        const p = ark_priestFig(n++, false);   // ARK_TEF_M (the user's decision 202): the head's tefillin, as every priest - the ark was brought in before the festival, on a weekday
        p.g.position.set(X + dx, Y, s * 1.1);
        p.g.rotation.y = -Math.PI / 2;
        const fit = ark_staffFit(s > 0 ? 1 : -1, A ? A.staffZ - 1.1 : 0.3, A ? 1.87 + A.h / 2 : 2.62);   // HAND_GRIP_A2
        ark_setArm(s > 0 ? p.L : p.R, fit.v, s > 0 ? 1 : -1);
        ark_staffHand(s > 0 ? p.L : p.R, true, fit);   // HAND_A2: the hand closed round the staff
        pv.add(p.g);
      }
    };
    ctx.shared.arkGates = {
      preview(on) { if (on && !pvBuilt) buildPreview(); pv.visible = !!on; return pv.visible; },
      fit: (side) => { const AP = ctx.shared.arkParts; return ark_staffFit(side, AP ? AP.staffZ - 1.1 : 0.3, AP ? 1.87 + AP.h / 2 : 2.62); }   // (tests)
    };
    // ======================= THE DEMONSTRATION =======================
    // A walk of the eye (ctx.shared.walk, 50-heichal.js: keys, captions, pause) and, on its clock, the scene: the four priests carry a copy
    // of the ark (the model's own pieces, cloned) from the ulam's doorway down the heichal to the devir's doors; the doors are stuck; the
    // eye goes out to Solomon, kneeling on his platform before the altar, his palms spread (the three sayings of Shabbat 30a); "מיד נענה" -
    // back in, the doors open; the ark is carried in and set on the stone under the cherubim; the priests come out (the front pair round the
    // staffs' west ends - they walked between them); "ויארכו הבדים" - the staffs grow to the model's own; "והענן מלא את בית ה׳" - a cloud
    // fills the heichal from the devir's doorway out, as the priests leave it. Everything goes back as it was at the end or at any stop.
    // MODEL CHOICES: the timing; the eye's places; the staffs' length while carried (5.2); the priests' places (two before the ark and two
    // after it, between the staffs - Menachot 98b); the way the front pair comes out; the cloud's form; the procession starts in the
    // ulam's doorway (on the steps the ark would tilt); the heichal's vessels are taken away while the ark passes (the user, 22:32 "7. כן":
    // in both layouts they stand in its way); the parochet is not hung while the doors stand shut (it returns at the end).
    const A = ctx.shared.arkParts;
    const W = () => ctx.shared.walk;
    const F = LV.HEI, XE = CO.xKodeshE, SH = 2.62, CARRY = 5.2;
    const hr = (x) => { const S = ctx.shared.houseSlope; return S && typeof S.at === "function" ? S.at(x) : 0; };
    const floorAt = (x) => (x > CO.xUlamE ? LV.AZ + Math.max(0, Math.min(6, 24.5 - x)) : x >= XE ? F : F + hr(x));
    const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
    const glide = (a, b, t0, t1, t, e) => {      // from a to b in [t0, t1], easing in and out over e seconds (a trapezoid of speed)
      if (t <= t0) return a;
      if (t >= t1) return b;
      const T = t1 - t0, ee = Math.min(e, T / 2), v = 1 / (T - ee), u = t - t0;
      const s = u < ee ? 0.5 * v * u * u / ee : u > T - ee ? 1 - 0.5 * v * (T - u) * (T - u) / ee : 0.5 * v * ee + v * (u - ee);
      return a + (b - a) * s;
    };
    // SEU_SHEARIM_208 (the user, 13.11.2026 00:53: "תחפש את השיר שאו שערים ותוסיף בקטע של הכתוביות שאו שערים"): the whole of
    // "שאו שערים" as the Gemara tells it (Shabbat 30a; Psalms 24:7-10) - 7.5 seconds more at the king, every time after them later by as much
    const T = { walk1: 19.5, open0: 53.8, open1: 56.3, enter1: 62.8, lower1: 64.3, ext0: 67.0, ext1: 70.0, cloud0: 72.5, cloud1: 79.5, end: 86.5 };
    const X0 = 16.8, XS = (CO.xKodeshW || -43.5) + 2.7;
    let AX = A ? A.x : -58.5;   // ARK_PLACE_D (fix-d): the ark's place of this moment (ctx.shared.arkPlace) - read again at every start (enter)
    const arkX = (t) => (t < T.open1 ? glide(X0, XS, 0, T.walk1, t, 1.4) : glide(XS, AX, T.open1, T.enter1, t, 1.2));
    const D = { built: false, run: false, cloudWas: true, saved: null, apply: null };
    const setPath = (p) => {   // ARK_PLACE_D: the priests' way out, from the ark's place of this moment
      const front = p.front, s = p.s;
      p.path = front
        ? [[AX - 1.6, s * 1.1], [AX - 3.6, s * 1.1], [AX - 3.6, s * 2.3], [8.0, s * 2.3], [8.6, s * 3.4]]
        : [[AX + 1.6, s * 1.1], [AX + 2.8, s * 0.62], [9.6, s * 0.62], [10.4, s * 1.6]];
      p.len = [0];
      for (let i = 1; i < p.path.length; i++) p.len.push(p.len[i - 1] + Math.hypot(p.path[i][0] - p.path[i - 1][0], p.path[i][1] - p.path[i - 1][1]));
    };
    const build = () => {
      if (D.built || !A) return;
      D.built = true;
      // the procession: the ark's copy and its staffs; the four priests
      const arkM = new Group();
      arkM.name = "arkGatesArk";
      const box = new Group();
      for (const o of A.body) { const c = o.clone(true); c.visible = true; box.add(c); }
      box.position.set(-(A.x0 != null ? A.x0 : A.x), -A.y0, 0);   // ARK_PLACE_D: the pieces' own (built) line
      arkM.add(box);
      const sg = new CylinderGeometry(0.11, 0.11, 1, 10);
      sg.rotateZ(Math.PI / 2);
      for (const s of [-1, 1]) { const m = new Mesh(sg, A.staffMat); m.position.set(0, A.h / 2, s * A.staffZ); m.scale.x = CARRY; m.castShadow = true; arkM.add(m); }
      g.add(arkM);
      const P = D.P = [];   // ARK_PLACE_D: kept, for the way out from another place (enter)
      let n = 0;
      for (const front of [true, false]) for (const s of [-1, 1]) {
        const p = ark_priestFig(n++, false);   // ARK_TEF_M (the user's decision 202): the head's tefillin, as every priest - the ark was brought in before the festival, on a weekday
        p.front = front;
        p.s = s;
        p.staffArm = s > 0 ? p.L : p.R;
        p.freeArm = s > 0 ? p.R : p.L;
        p.side = s > 0 ? 1 : -1;
        // the way out (after the ark is set down): the pair behind it straight out between the staffs; the pair before it round the
        // staffs' west ends and out beside them; at the end they stand in the ulam, turned to the house
        setPath(p);
        p.v = front ? 3.8 : 3.5;   // EXIT_BACK_304: "מהלך אחורנית מעט מעט" - a little slower than the walk in (4.4 / 4.0 until 1.4.12)
        g.add(p.g);
        P.push(p);
      }
      // the extending staffs: in the house's sloping group, as the model's own (the same shear) - they grow to them
      const slope = ctx.shared.houseSlope && ctx.shared.houseSlope.group;
      const ext = [-1, 1].map((s) => { const m = new Mesh(sg, A.staffMat); m.position.set(0, A.y0 + A.h / 2, s * A.staffZ); m.visible = false; m.castShadow = true; (slope || g).add(m); return m; });
      // the king on his platform, in the outer court before the inner court's east gate (KIYOR_RALBAG_208), his face to the house
      const plat = ark_platform(M2);
      plat.position.set(ARK_KIYOR.x, ark_kiyorY(LV), ARK_KIYOR.z);
      g.add(plat);
      const king = ark_kingFig(M2);
      king.g.position.set(ARK_KIYOR.x, ark_kiyorY(LV) + 3, ARK_KIYOR.z);
      king.g.rotation.y = -Math.PI / 2;
      g.add(king.g);
      // the cloud of the heichal: puffs as the devir's (70-ui.js), born as the front passes them, from the devir's doorway out
      const KH = CO.HOUSE_H || 30;
      let seed = 5;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const puffs = [];
      for (let ix = 0; ix < 9; ix++) for (let iz = 0; iz < 4; iz++) for (let iy = 0; iy < 4; iy++) {
        const x = -41.6 + ix * 4.6 + (rnd() - 0.5) * 1.4, z = -6.9 + iz * 4.6 + (rnd() - 0.5) * 1.4, r = 3.4 + rnd() * 1.5;
        const y = F + hr(x) + 1.0 + r * 0.9 + iy * ((KH - 2.5 - 1.8 * r) / 3) + (rnd() - 0.5) * 1.2;
        puffs.push({ x, y: Math.min(y, F + KH - r * 0.8), z, r, ph: rnd() * 6.28, tb: T.cloud0 + ((x + 44) / 40.5) * (T.cloud1 - T.cloud0 - 1) + rnd() * 0.9 });
      }
      const cloudMat = new MeshLambertMaterial({ color: 0xf1f3f7, emissive: 0x555a68 });
      const cloud = new InstancedMesh(new IcosahedronGeometry(1, 2), cloudMat, puffs.length);
      cloud.name = "arkGatesCloud";
      cloud.frustumCulled = false;
      cloud.userData.noPick = true;
      cloud.visible = false;
      g.add(cloud);
      Object.assign(D, { arkM, P, ext, plat, king, puffs, cloud, m4: new Matrix4(), q: new Quaternion(), v3: new Vector3(), s3: new Vector3() });
    };
    // the doors of the devir (both readings' leaves): closed01 0 = open as the model has them, 1 = shut ("דבקו"); a shake toward opening
    const doors = (c01, shake) => {
      const DD = ctx.shared.devirDoor;
      if (!DD || typeof DD.parts !== "function") return;
      for (const k of DD.keys) {
        const Pp = DD.parts(k);
        if (!Pp) continue;
        for (const h of Pp.hinges) {
          const shut = -h.s * Math.PI / 2;
          h.hinge.rotation.y = h.open + (shut - h.open) * c01 + h.s * shake;
          h.hinge.scale.x = 1 + (Pp.pivZ / 3 - 1) * c01;
        }
      }
    };
    const curtain = (on) => {
      const DD = ctx.shared.devirDoor;
      if (DD && typeof DD.parts === "function") for (const k of DD.keys) { const Pp = DD.parts(k); if (Pp) for (const m of Pp.curtain) m.visible = on; }
      for (const m of A.swell) m.visible = on;
    };
    const original = (body, staffs) => { for (const o of A.body) o.visible = body; for (const o of A.staffs) o.visible = staffs; };
    // the labels of the heichal's vessels go with them (a layer of their own, on while the demonstration is off)
    const offL = new Group();
    offL.name = "arkGatesOff";
    ctx.layers.arkGatesOff = offL;
    const VESSEL_LABELS = ["מנורת משה", "אבן שלוש המעלות (תמיד ג, ט)", "עשר המנורות", "שולחן משה", "עשרה השולחנות", "מזבח הזהב", "אבן", "ארז", "זהב", "הפרוכת"];
    let labelsTagged = false;
    const tagLabels = () => {
      if (labelsTagged) return;
      const lg = ctx.root.getObjectByName("labels");
      if (!lg) return;
      labelsTagged = true;
      for (const spr of lg.children) {
        const l = spr.userData && spr.userData.label;
        if (!l || VESSEL_LABELS.indexOf(l.text) < 0) continue;
        const L = spr.userData.layers ? spr.userData.layers.slice() : [];
        if (L.indexOf("arkGatesOff") < 0) L.push("arkGatesOff");
        spr.userData.layers = L;
      }
    };
    let styleEl = null;
    const pillsOff = (on) => {
      if (!styleEl) { styleEl = document.createElement("style"); styleEl.textContent = "body.tm-arkdemo .tm-pill{display:none!important}"; document.head.appendChild(styleEl); }
      document.body.classList.toggle("tm-arkdemo", !!on);
    };
    // the scene at demo second t (also a still frame for checks: ctx.shared.arkGates.at(t))
    const pathAt = (p, d) => {
      const L = p.len, last = L.length - 1;
      if (d >= L[last]) { const a = p.path[last - 1], b = p.path[last]; return [b[0], b[1], Math.atan2(b[0] - a[0], b[1] - a[1]), true]; }
      let i = 1;
      while (i < last && d > L[i]) i++;
      const a = p.path[i - 1], b = p.path[i], u = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[0] - a[0], b[1] - a[1]), false];
    };
    const walkPose = (p, ph, moving, holding, hold01) => {
      const FS = 1.4, sw = Math.sin(ph) * moving;
      if (holding) {
        const fit = ark_staffFit(p.side, A ? A.staffZ - 1.1 : 0.3, SH), st = fit.v, sd = ARK_POSE.stand, k = hold01;   // HAND_GRIP_A2
        ark_setArm(p.staffArm, [st[0] + (sd[0] - st[0]) * (1 - k), st[1] + (sd[1] - st[1]) * (1 - k), st[2] + (sd[2] - st[2]) * (1 - k)], p.side);
        ark_staffHand(p.staffArm, k > 0.5, fit);   // HAND_A2
      } else { ark_setArm(p.staffArm, [0.32 * sw, 0.08, -0.25 * moving - 0.15 * (1 - moving)], p.side); ark_staffHand(p.staffArm, false); }
      ark_setArm(p.freeArm, [-0.32 * sw, 0.08, -0.25 * moving - 0.15 * (1 - moving)], -p.side);
      p.lean.position.y = Math.abs(Math.cos(ph)) * 0.035 * moving;
      p.fl.position.z = 0.17 * sw;
      p.fr.position.z = -0.17 * sw;
      void FS;
    };
    D.apply = (t) => {
      if (!D.built) return;
      // the ark
      const ax = arkX(t), moving = (t > 0.05 && t < T.walk1 - 0.05) || (t > T.open1 + 0.05 && t < T.enter1 - 0.05) ? 1 : 0;
      const dist = X0 - ax, ph = (dist * Math.PI) / 0.85;
      const bob = Math.abs(Math.cos(ph)) * 0.035 * moving;
      const carryY = floorAt(ax) + SH - A.h / 2 + bob;
      const endY = A.y0 + hr(AX);
      const ay = t <= T.enter1 ? carryY : carryY + (endY - carryY) * ease((t - T.enter1) / (T.lower1 - T.enter1));
      D.arkM.position.set(ax, ay, 0);
      const set = t >= T.lower1;
      D.arkM.visible = !set;
      original(set, t >= T.ext1);
      const ex = t >= T.lower1 && t < T.ext1;
      const k = ease((t - T.ext0) / (T.ext1 - T.ext0));
      const x0 = (AX - CARRY / 2) + (A.staffX0 - (AX - CARRY / 2)) * k, x1 = (AX + CARRY / 2) + (A.staffX0 + A.staffLen - (AX + CARRY / 2)) * k;
      for (const m of D.ext) { m.visible = ex; m.position.x = (x0 + x1) / 2; m.scale.x = x1 - x0; }
      // the doors
      const c01 = t < T.open0 ? 1 : 1 - ease((t - T.open0) / (T.open1 - T.open0));
      const sh = t > 19.8 && t < 23.4 ? 0.022 * Math.abs(Math.sin(t * 2 * Math.PI * 2.6)) * Math.min(1, (t - 19.8) / 0.4, (23.4 - t) / 0.4) : 0;
      doors(c01, sh);
      // the priests
      for (const p of D.P) {
        if (t <= T.lower1) {
          const px = ax + (p.front ? -1.6 : 1.6), pz = p.s * 1.1;
          p.g.position.set(px, floorAt(px), pz);
          p.g.rotation.y = -Math.PI / 2;
          const hold01 = t <= T.enter1 ? 1 : 1 - ease((t - T.enter1) / (T.lower1 - T.enter1));
          walkPose(p, ph + (p.front ? 0 : Math.PI), moving, true, hold01);
        } else {
          const u = t - T.lower1, d = p.v * (u < 1 ? (u * u) / 2 : u - 0.5);
          const [px, pz, yaw, done] = pathAt(p, d);
          p.g.position.set(px, floorAt(px), pz);
          // EXIT_BACK_304 (the user, 19.11.2026: "כשיוצאים מבית קה"ק צריך לצאת ואחוריהם לאולם ופניהם לקה"ק"): all the way out - round
          // the staffs' ends and through the heichal - each priest faces west, to the Holy of Holies, as he stood when the ark was set
          // down, and goes BACKWARD: the Rambam, Beit HaBechira 7:4 "כל שהשלים עבודה ונסתלק לו אינו יוצא ואחוריו להיכל, אלא מהלך
          // אחורנית מעט מעט"; Avodat Yom HaKippurim 4:1 (the High Priest) "פניו לקדש ואחוריו להיכל". Until 1.4.12 he turned to the way
          // he went (yaw), his back to the house, and turned back to it only at the end.
          void yaw;
          p.g.rotation.y = -Math.PI / 2;
          if (done) walkPose(p, 0, 0, false, 0);
          else walkPose(p, (d * Math.PI) / 0.85 + (p.front ? 0 : Math.PI), u < 0.3 ? u / 0.3 : 1, false, 0);
        }
      }
      // the cloud
      const C = D.cloud, on = t >= T.cloud0;
      C.visible = on;
      if (on) {
        const k2 = performance.now() * 0.0004;
        for (let i = 0; i < D.puffs.length; i++) {
          const pf = D.puffs[i], s = ease((t - pf.tb) / 1.4) * pf.r;
          D.v3.set(pf.x + Math.sin(k2 + pf.ph) * 0.5, pf.y + Math.cos(k2 * 0.8 + pf.ph) * 0.35, pf.z + Math.sin(k2 * 0.6 + pf.ph * 1.3) * 0.5);
          D.s3.set(Math.max(1e-4, s * 1.15), Math.max(1e-4, s * 0.9), Math.max(1e-4, s * 1.15));
          D.m4.compose(D.v3, D.q, D.s3);
          C.setMatrixAt(i, D.m4);
        }
        C.instanceMatrix.needsUpdate = true;
      }
      // the devir's own cloud (70-ui.js) comes with the heichal's
      if (t >= T.cloud0 - 0.4 && !D.cloudSet && ctx.ui && typeof ctx.ui.setCloud === "function") { D.cloudSet = true; ctx.ui.setCloud(true); }
      // (70-ui.js gives the devir its cloud back when the eye goes far from it after being near - the eye goes out to the king and back:
      // while the viewer wanted it off, it is kept off until the cloud of the end)
      if (D.wantOff && t < T.cloud0 - 0.4 && ctx.ui && typeof ctx.ui.cloudOn === "function" && ctx.ui.cloudOn()) ctx.ui.setCloud(false);
    };
    // the eye and the words
    const E = (x, h, z) => [x, floorAt(x) + h, z];
    const keys = [[0, [36, 17.5, 3.5], [13, 15.2, 0]], [3.5, [26, 16.8, 2.4], [7, 14.8, 0]]];
    for (const tk of [6, 8.5, 11, 13.5, 16, 18.4]) { const ax = arkX(tk); keys.push([tk, E(ax + 9.5, 6.8, 1.6), E(ax - 7, 3.4, 0)]); }
    const DOORV = [E(-33.5, 4.6, 4.2), E(-44.4, 7.5, -0.8)];
    const KX = ARK_KIYOR.x, KY = ark_kiyorY(LV) + 3;   // KIYOR_RALBAG_208: the king kneels on the platform's top
    keys.push([T.walk1, DOORV[0], DOORV[1]], [23.5, DOORV[0], DOORV[1]],
      [24.6, [-14, F + 9.5, 0.6], [10, F + 10, 0]], [25.6, [6, 22.5, 0.4], [40, 22, 3]], [26.6, [30, 26, 4], [62, 20, 6]],
      [27.6, [60, 34, 8], [100, 16, 2]], [28.5, [97, 33, 5], [KX, KY + 1.9, 0]],
      [29.4, [KX - 9.5, KY + 3.6, 3.2], [KX, KY + 1.5, 0]], [32.5, [KX - 8.6, KY + 3.4, 5.6], [KX, KY + 1.5, 0]],
      [35.5, [KX - 1, KY + 3.6, 9.5], [KX, KY + 1.4, 0]], [38.8, [KX + 6.5, KY + 4, 8], [KX, KY + 1.4, 0]],
      [42.0, [KX + 7, KY + 3.5, 2.5], [60, KY + 3, 0]], [47.6, [KX + 7, KY + 3.9, 1.0], [55, KY + 3.5, 0]],
      [49.4, [99, 33, 6], [60, 20, 0]], [50.5, [70, 30, 8], [40, 21, 3]], [51.6, [38, 26, 3], [8, 20, 0]], [52.7, [8, 21.5, 0.4], [-20, 19, 0]],
      [T.open0, E(-33.5, 4.6, 4.2), E(-44.4, 7.5, -0.8)], [57.5, E(-33.5, 7.8, 1.6), E(-50, 5, 0)], [61.5, E(-37, 7.4, 1.8), E(-57, 4.2, 0)],
      [T.lower1, E(-37, 7.4, 1.8), E(-57.5, 3.5, 0)], [66.0, E(-34, 7.6, 4.8), E(-52, 3.8, 0)], [69.0, E(-29, 8.4, 5.6), E(-50, 3.6, 0)],
      [70.5, E(-24, 9.2, 5.0), E(-46, 4.5, 0)], [T.cloud0, [-9, F + 11, 1.5], [-34, F + 8, 0]], [74.5, [6, 22.5, 0.5], [-30, 18, 0]],
      [76.5, [22, 18.6, 0.2], [-20, 17.6, 0]], [T.end, [22, 18.6, 0.2], [-20, 17.6, 0]]);
    const caps = [
      [0, "״ויבאו כל זקני ישראל וישאו הכהנים את הארון״ (מלכים א ח, ג)"],
      [7.5, "ארבעה כהנים נושאים: ״ומנא לן דבארבעה הוו דרו להו?״ (מנחות צח:). במודל: שנים לפני הארון ושנים אחריו, בין הבדים"],
      [19.6, "״כשבנה שלמה את בית המקדש, ביקש להכניס ארון לבית קדשי הקדשים. דבקו שערים זה בזה״ (שבת ל.)"],
      [24.6, "״אמר שלמה עשרים וארבעה רננות, ולא נענה״ (שבת ל.). רש״י: ״רנה תפילה תחינה כתובים בתפילת שלמה עד כ״ד״"],
      [30.0, "״פתח ואמר: ׳שאו שערים ראשיכם והנשאו פתחי עולם ויבא מלך הכבוד׳״ (שבת ל.; תהלים כד, ז)"],
      [35.5, "״רהטו בתריה למיבלעיה, אמרו: ׳מי הוא זה מלך הכבוד׳. אמר להו: ׳ה׳ עזוז וגבור׳״ (שבת ל.; תהלים כד, ח). רש״י: ״סברי דעל עצמו אמר מלך הכבוד״"],
      [42.0, "״חזר ואמר: ׳שאו שערים ראשיכם ושאו פתחי עולם ויבא מלך הכבוד מי הוא זה מלך הכבוד ה׳ צבאות הוא מלך הכבוד סלה׳, ולא נענה״ (שבת ל.; תהלים כד, ט–י)"],
      [48.5, "״כיון שאמר: ׳ה׳ אלהים אל תשב פני משיחך זכרה לחסדי דוד עבדך׳, מיד נענה״ (שבת ל.; דברי הימים ב ו, מב)"],
      [T.open1, "״ויבאו הכהנים את ארון ברית ה׳ אל מקומו אל דביר הבית אל קדש הקדשים אל תחת כנפי הכרובים״ (מלכים א ח, ו)"],
      [62.9, "״כי הכרובים פרשים כנפים אל מקום הארון ויסכו הכרבים על הארון ועל בדיו מלמעלה״ (מלכים א ח, ז)"],
      [T.ext0, "״ויארכו הבדים ויראו ראשי הבדים מן הקדש על פני הדביר ולא יראו החוצה״ (מלכים א ח, ח)"],
      [T.cloud0, "״ויהי בצאת הכהנים מן הקדש והענן מלא את בית ה׳״ (מלכים א ח, י). והכהנים יוצאים לאחוריהם, פניהם אל הקודש: ״אינו יוצא ואחוריו להיכל, אלא מהלך אחורנית מעט מעט״ (רמב״ם, בית הבחירה ז, ד)"],   // EXIT_BACK_304
      [79.0, "״ולא יכלו הכהנים לעמד לשרת מפני הענן כי מלא כבוד ה׳ את בית ה׳״ (מלכים א ח, יא)"]
    ];
    // the model before and after: saved at the start, given back at the end or at any stop
    const enter = () => {
      tagLabels();
      { const ax = A ? A.x : AX; if (ax !== AX) { AX = ax; for (const p of D.P || []) setPath(p); } }   // ARK_PLACE_D
      const KL = ctx.shared.kodeshLayout, AI = ctx.shared.arkInside, AL = ctx.shared.arkLift;
      D.saved = { arkInside: !!(AI && AI.on), lift: !!(AL && typeof AL.get === "function" && AL.get()) };
      if (D.saved.arkInside) AI.set(false);
      if (D.saved.lift) AL.set(false);
      try { const HD = ctx.shared.heichalDoors; if (HD && typeof HD.stop === "function") HD.stop(); } catch (_) {}
      if (KL && typeof KL.hide === "function") KL.hide(true);
      offL.visible = false;
      curtain(false);
      original(false, false);
      g.visible = true;
      pillsOff(true);
      D.cloudSet = false;
    };
    const leave = () => {
      if (!D.saved) return;
      const s = D.saved;
      D.saved = null;
      doors(0, 0);
      curtain(true);
      original(true, true);
      for (const m of D.ext || []) m.visible = false;
      if (D.cloud) D.cloud.visible = false;
      g.visible = false;
      offL.visible = true;
      const KL = ctx.shared.kodeshLayout;
      if (KL && typeof KL.hide === "function") KL.hide(false);
      if (s.arkInside && ctx.shared.arkInside) ctx.shared.arkInside.set(true);
      if (s.lift && ctx.shared.arkLift) ctx.shared.arkLift.set(true);
      pillsOff(false);
      // TOUR_ARK_209: inside the presentation a "כן" to the devir's question holds for the next slide too - the demonstration ends
      // with the cloud (8:10), and the next slide (8:6-9, in the devir) would ask the same question again at once. So there the cloud
      // goes off at the end; it comes back by itself as always (once the eye has been near it and goes away), and the slide of
      // 8:10-11 puts it back
      let inTour = false;
      try { const TR = ctx.shared.tour; inTour = !!(TR && typeof TR.state === "function" && TR.state().running); } catch (_) { inTour = false; }
      if (ctx.ui && typeof ctx.ui.setCloud === "function") ctx.ui.setCloud(inTour && D.wantOff ? false : D.cloudWas);
    };
    const finish = () => { D.run = false; leave(); };
    const start = (again) => {
      const Wk = W();
      if (!Wk || !A) return false;
      build();
      if (typeof ctx.shared.stopDemos === "function") ctx.shared.stopDemos("arkGatesDemo");
      if (!again) { D.cloudWas = !(ctx.ui && typeof ctx.ui.cloudOn === "function") || ctx.ui.cloudOn(); D.wantOff = !D.cloudWas; }
      enter();
      D.run = true;
      D.apply(0);
      Wk.run(keys, caps, finish);
      return true;
    };
    const demo = () => {
      // the devir is covered by the cloud "מפני כבוד המקום" (70-ui.js): its own question first - "כן": the ark is seen set under the
      // cherubim; "ביטול": it goes in into the cloud (the user, 22:32: "8. מצוין")
      const U = ctx.ui;
      if (U && typeof U.cloudOn === "function" && U.cloudOn() && typeof U.askCloud === "function") {
        D.cloudWas = true;
        U.askCloud(() => { U.setCloud(false); D.wantOff = true; start(true); }, () => { D.wantOff = false; start(true); });
        return true;
      }
      return start(false);
    };
    const stop = () => { if (!D.run) return; const Wk = W(); if (Wk && Wk.on) Wk.stop(); else finish(); };
    let sndT = -1;   // SOUNDS_300
    ctx.animated.push(() => {
      if (!D.run) { sndT = -1; return; }
      const Wk = W();
      const t = Wk && typeof Wk.now === "function" ? Wk.now() : 0;
      D.apply(Math.max(0, t));
      // SOUNDS_300 (the user's items 3-4, 18.11.2026): the devir's doors creak as they open (T.open0); and as the priests come out of
      // the holy and the cloud fills the house, the trumpets and the cymbals - "ויהי בצאת הכהנים מן הקדש... ויהי כאחד למחצצרים
      // ולמשררים להשמיע קול אחד... וכהרים קול בחצצרות ובמצלתים ובכלי השיר... והבית מלא ענן" (II Chr 5:11-13) - at T.cloud0. Each once
      // a run (the walk's clock stands while paused; a new run starts it again from 0)
      try {
        const SH = ctx.shared;
        if (sndT >= 0 && t > sndT && SH && typeof SH.sfx === "function") {
          if (sndT < T.open0 && t >= T.open0) { SH.sfx("creak"); SH.sfx("creak", { at: 0.4, gain: 0.8 }); }
          if (sndT < T.cloud0 && t >= T.cloud0) { SH.sfx("trumpets", { pattern: "long" }); SH.sfx("cymbals", { at: 0.5 }); }
        }
      } catch (_) {}
      sndT = Math.max(0, t);
    });
    const walkEntry = () => (ctx.shared.demoStops || []).find((d) => d.id === "walk");
    (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({
      id: "arkGatesDemo", running: () => D.run, stop,
      pause: () => { const w = walkEntry(); if (w) w.pause(); },
      resume: () => { const w = walkEntry(); if (w) w.resume(); },
      paused: () => { const w = walkEntry(); return !!(w && w.paused()); },
      restart: () => { stop(); start(true); }
    });
    ctx.shared.modelButtons = ctx.shared.modelButtons || [];
    ctx.shared.modelButtons.push({
      id: "arkGatesDemo", label: "הדגמה: ״דבקו שערים״ — הכנסת הארון", labelOn: "עצור את ההדגמה", maxDist: 46,
      title: "״כשבנה שלמה את בית המקדש, ביקש להכניס ארון לבית קדשי הקדשים. דבקו שערים זה בזה״ (שבת ל.). ההדגמה: ארבעה כהנים נושאים את הארון, השערים דבקים, שלמה מתפלל על הכיור, השערים נפתחים, הארון נכנס תחת כנפי הכרובים, והענן ממלא את הבית.",
      anchor: [CO.xKodeshW + 2.5, F + 10.5, 0],
      get: () => D.run,
      set: (on) => { if (on) demo(); else stop(); }
    });
    Object.assign(ctx.shared.arkGates, { demo, stop, T, at: (t) => { build(); if (!D.saved) { D.wantOff = !(ctx.ui && typeof ctx.ui.cloudOn === "function" && ctx.ui.cloudOn()); D.cloudWas = !D.wantOff; enter(); } D.apply(t); }, leave: () => leave(), isRunning: () => D.run });
    // OMANIN_461: the craftsmen's demonstration (shared/frag/omanin.js)
    omaninSetup(ctx, { x: -47.2, floor: LV.HEI, devirHeight: true,
      lastCap: "וכן בבית ראשון: ״ויבאו הכהנים לפנימה בית ה׳ לטהר״ (דברי הימים ב כט, טז) — הפסוק שמביאה התוספתא",
      fig: () => { const P = ark_priestFig(7, false); return { g: P.g, work: (on, t) => { const ph = t * 5.2;
        ark_setArm(P.L, on ? [-1.25 + 0.18 * Math.sin(ph), 0.12, -0.55 + 0.25 * Math.sin(ph * 0.5)] : [0.05, 0.08, -0.15], 1);
        ark_setArm(P.R, on ? [-1.25 + 0.18 * Math.cos(ph), 0.12, -0.55] : [0.05, 0.08, -0.15], -1); } }; } });
  }
