  // ===== 40-altar.js: מזבח הנחושת (the bronze altar of Solomon) =====
  // II Chr 4:1 "ויעש מזבח נחשת עשרים אמה ארכו ועשרים אמה רחבו ועשר אמות קומתו". User decision: the altar is BRONZE
  // (the verse), not stone. Kings I does not describe the altar (only "המזבח" in 8:64, 9:25), so every detail beyond
  // 20 x 20 x 10 is a model choice, marked below. Placement (CO.xAltarW/E, CO.altarZ): west face 21 amot east of the ulam front
  // after Middot 5:1 (model choice), centred on the house axis.
  // The ramp (כבש) and the horns (קרנות) are MODEL CHOICES: no First Temple verse mentions them; the ramp follows
  // Ex 20:23 "ולא תעלה במעלת על מזבחי" (no steps) with the size of Middot 3:3 (32 x 16) as a convention, on the SOUTH
  // (Middot 3:3 "וכבש היה לדרומו של מזבח" as a convention; user decision); the horns follow Ex 27:2 "ועשית קרנתיו על ארבע פנתיו",
  // plan 1 x 1 after Middot 3:1 "מקום הקרנות אמה מזה ואמה מזה", height 1 as a model choice (cf. the altar baraita, Zevachim 54a).
  // Pyre, logs, flames, smoke and the fire lights are copied from the Second Temple module (ref-altar-bayit2.js) with y adapted.

  // 1.0.0: the fire on the altar: logs are instanced cylinders; the flames are animated cones; the smoke is 7 rising sprites.
  async function buildAltar(ctx) {
    const H2 = ctx.H, M2 = ctx.M, LV2 = ctx.LV, CO2 = ctx.CO;
    const g = new Group();
    g.name = "altar";
    ctx.root.add(g);

    const F = LV2.AZ;                                  // court floor, y 6 (inner court level, model choice: see 10-core.js)
    const S = CO2.ALTAR;                               // 20: II Chr 4:1 "עשרים אמה ארכו ועשרים אמה רחבו"
    const AH = CO2.ALTAR_H;                            // 10: II Chr 4:1 "ועשר אמות קומתו"
    const ACX = (CO2.xAltarW + CO2.xAltarE) / 2;       // 49.5: x 39.5..59.5 (west face 21 east of the ulam front, Middot 5:1 convention)
    const ACZ = CO2.altarZ;                            // 0: on the house axis (model choice)
    const TOP = F + AH;                                // 16: the top surface of the altar

    // materials: bronze body (II Chr 4:1; big bronze surface -> roughness .45 per SPEC), darker bronze for the band,
    // bronze-tinted stone for the ramp (model choice: the ramp is not in the verses, so it is not made part of the bronze casting)
    const BR = M2.altarStone.clone();   // 1.0.1-L (the user: a stone altar in colour; the name stays): was M2.bronze
    BR.roughness = 0.9;
    const BRD = M2.altarStone.clone();
    BRD.color.set(0xb0a58e);
    BRD.roughness = 0.95;
    const AS = M2.altarStone.clone();
    AS.color.set(0xbfb39c);

    // --- the body: 20 x 20 x 10, y 6..16 (II Chr 4:1) ---
    H2.box(g, S, AH, S, BR, ACX, F, ACZ);

    // --- a lip 0.5 high and 0.5 thick around the top edge (model choice; cf. the כרכוב of Ex 27:5) ---
    // The south lip is interrupted where the ramp meets the altar (x 41.5..57.5, model choice).
    {
      const LIP = 0.5;
      H2.box(g, S, LIP, LIP, BR, ACX, TOP, ACZ - S / 2 + LIP / 2);                       // north
      H2.box(g, 2, LIP, LIP, BR, CO2.xAltarW + 1, TOP, ACZ + S / 2 - LIP / 2);           // south, west stub (x 39.5..41.5)
      H2.box(g, 2, LIP, LIP, BR, CO2.xAltarE - 1, TOP, ACZ + S / 2 - LIP / 2);           // south, east stub (x 57.5..59.5)
      H2.box(g, LIP, LIP, S - 2 * LIP, BR, CO2.xAltarE - LIP / 2, TOP, ACZ);             // east
      H2.box(g, LIP, LIP, S - 2 * LIP, BR, CO2.xAltarW + LIP / 2, TOP, ACZ);             // west
    }

    // --- four horns 1 x 1 x 1 at the corners (model choice after Ex 27:2; plan after Middot 3:1 "מקום הקרנות אמה מזה ואמה מזה";
    // height 1 a model choice after the altar baraita, Zevachim 54a) ---
    for (const sx of [-1, 1]) for (const sz of [-1, 1])
      H2.box(g, 1, 1, 1, BR, ACX + sx * (S / 2 - 0.5), TOP, ACZ + sz * (S / 2 - 0.5));

    // --- the band (כרכוב) at y 11 = half the altar height (model choice after Ex 27:5 "תחת כרכב המזבח מלמטה... עד חצי המזבח") ---
    {
      const BY = F + AH / 2 - 0.25;                    // band centred at y 11: y 10.75..11.25
      H2.box(g, S + 0.4, 0.5, 0.2, BRD, ACX, BY, ACZ - S / 2 - 0.1);                     // north
      H2.box(g, S + 0.4, 0.5, 0.2, BRD, ACX, BY, ACZ + S / 2 + 0.1);                     // south
      H2.box(g, 0.2, 0.5, S + 0.4, BRD, CO2.xAltarE + 0.1, BY, ACZ);                     // east
      H2.box(g, 0.2, 0.5, S + 0.4, BRD, CO2.xAltarW - 0.1, BY, ACZ);                     // west
    }

    // (No bronze net / מכבר: Ex 27:4-5 describes the Tabernacle altar; SPEC 5 lists body, lip, horns, band, ramp and fire only.)

    // --- the ramp (כבש) on the SOUTH: 32 long x 16 wide (Middot 3:3 as a convention; Ex 20:23: a ramp, not steps; model choice),
    // from the court floor at z 42 up to the altar top (y 16) at z 10, x 41.5..57.5 ---
    {
      const RL = 32, RW = 16;                          // Middot 3:3 "וכבש היה לדרומו של מזבח, שלשים ושתים על רוחב שש עשרה" (convention)
      const OV = 0.3;                                  // the ramp runs 0.3 into the altar body so the joint is hidden inside it (model choice)
      const TD = 0.02;                                 // its top meets the body 0.02 below the altar top: no face coplanar with the top (y 16)
      const sh = new Shape();                          // profile in (u = along the ramp from the altar southward, v = height)
      sh.moveTo(0, 0);
      sh.lineTo(RL + OV, 0);
      sh.lineTo(OV, AH - TD);
      sh.lineTo(0, AH - TD);
      sh.closePath();
      const geo = new ExtrudeGeometry(sh, { depth: RW, bevelEnabled: false });
      geo.rotateY(-Math.PI / 2);                       // local u -> world +z (south), local depth -> world -x
      geo.translate(ACX + RW / 2, F, ACZ + S / 2 - OV); // x 41.5..57.5, z 9.7..42, y 6..15.98 (the 0.3 plateau lies inside the body)
      const ramp = new Mesh(geo, AS);
      ramp.castShadow = ramp.receiveShadow = true;
      g.add(ramp);
    }

    // --- the fire: three pyres (מערכות) of cedar logs (model choice as in the Second Temple model, after Yoma 45a; the First Temple
    // verses only mention the burnt offerings on the altar: I Kings 8:64, 9:25; II Chr 7:1 "והאש ירדה מהשמים") ---
    const PX = ACX + 4.5, PZ = ACZ - 1.5;              // the big pyre, east of the centre (model choice)
    const E1X = ACX - 5.5, E1Z = ACZ + 5.5;            // second pyre (model choice)
    const E2X = ACX - 5.5, E2Z = ACZ - 6;              // third pyre (model choice)
    const logs = [];
    const addPyre = (cx, cz, len, r, layers) => {
      for (let l = 0; l < layers; l++) {
        const n = l === layers - 1 ? 2 : 3, alongX = l % 2 === 0;
        for (let i = 0; i < n; i++) {
          const off = (i - (n - 1) / 2) * len * 0.3;
          logs.push({
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
    addPyre(PX, PZ, 4.4, 0.24, 3);
    addPyre(E1X, E1Z, 2.4, 0.17, 2);
    addPyre(E2X, E2Z, 2.4, 0.17, 2);
    {
      const geo = new CylinderGeometry(1, 1, 1, 8);
      const inst = new InstancedMesh(geo, M2.cedar, logs.length);
      const m42 = new Matrix4(), q = new Quaternion(), e = new Euler();
      const p = new Vector3(), s = new Vector3();
      logs.forEach((L, i) => {
        e.set(L.alongX ? 0 : Math.PI / 2, 0, L.alongX ? Math.PI / 2 : 0);
        q.setFromEuler(e);
        p.set(L.x, L.y, L.z);
        s.set(L.r, L.len, L.r);
        m42.compose(p, q, s);
        inst.setMatrixAt(i, m42);
      });
      inst.castShadow = inst.receiveShadow = true;
      g.add(inst);
    }
    const flames = [];
    const addFlame = (x, y, z, r, h, color, op) => {
      const geo = new ConeGeometry(r, h, 10);
      geo.translate(0, h / 2, 0);
      const m = new Mesh(geo, new MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false }));
      m.position.set(x, y, z);
      m.castShadow = false;
      m.renderOrder = 2;
      m.userData.op = op;
      g.add(m);
      flames.push(m);
    };
    addFlame(PX, TOP + 1.1, PZ, 1.5, 3.6, 0xff791e, 0.75);
    addFlame(PX + 0.4, TOP + 1.15, PZ + 0.3, 0.95, 2.5, 0xffb730, 0.85);
    addFlame(PX - 0.3, TOP + 1.2, PZ - 0.3, 0.55, 1.7, 0xffdf8a, 0.9);
    addFlame(E1X, TOP + 0.55, E1Z, 0.65, 1.5, 0xffb730, 0.8);
    addFlame(E2X, TOP + 0.55, E2Z, 0.6, 1.3, 0xff791e, 0.8);
    const fireLight = new PointLight(0xff9a3d, 24, 60, 1.8);
    fireLight.position.set(PX, TOP + 3.2, PZ);
    g.add(fireLight);
    const emberLight = new PointLight(0xff8a30, 6, 22, 1.8);
    emberLight.position.set(E2X, TOP + 1.6, E2Z);
    g.add(emberLight);
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
    for (let i = 0; i < 7; i++) {
      const sp = new Sprite(new SpriteMaterial({ map: smokeTexture, color: 0x8a8a8a, transparent: true, opacity: 0.15, depthWrite: false }));
      sp.renderOrder = 3;
      g.add(sp);
      smoke.push(sp);
    }
    // the ash heap (תפוח) in the middle of the top (model choice, as in the Second Temple model after Tamid 2:2)
    try {
      const ashMat = M2.altarStone.clone();
      ashMat.color.set(0x555049);
      const geo = new SphereGeometry(2, 20, 14);
      geo.scale(1, 0.4, 1);
      const m = new Mesh(geo, ashMat);
      m.position.set(ACX, TOP + 0.05, ACZ);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    } catch (e) {
      console.warn("[altar] ash heap skipped", e);
    }

    // --- labels and fly point ---
    ctx.labels.push(
      { text: "מזבח הנחושת", x: ACX, y: TOP + 9, z: ACZ, size: 4.5 },
      { text: "הכבש", x: ACX, y: F + 8, z: ACZ + 30, size: 3 }
    );
    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    ctx.shared.flyPoints.mizbeach = { pos: [115, 52, 72], target: [ACX, TOP, ACZ] };

    // --- animation: flicker, lights, smoke ---
    ctx.animated.push((t) => {
      const s = t * 1e-3;
      for (let i = 0; i < flames.length; i++) {
        const f = flames[i];
        const n = Math.sin(s * 9.1 + i * 2.3) * 0.6 + Math.sin(s * 15.7 + i * 4.1) * 0.4;
        f.scale.y = 1 + 0.15 * n;
        f.scale.x = f.scale.z = 1 + 0.06 * Math.sin(s * 12.3 + i * 3.1);
        f.material.opacity = f.userData.op * (0.85 + 0.15 * n);
      }
      fireLight.intensity = 23 + 4.5 * Math.sin(s * 9.7) + 2.5 * Math.sin(s * 22.3 + 1.3);
      emberLight.intensity = 5.5 + 1.4 * Math.sin(s * 7.3);
      for (let i = 0; i < smoke.length; i++) {
        const sp = smoke[i];
        const p = (s * 0.045 + i / smoke.length) % 1;
        sp.position.set(
          PX + Math.sin(s * 0.55 + i * 1.9 + p * 5) * (0.3 + p * 1.7),
          TOP + 1.6 + p * 40,
          PZ + Math.cos(s * 0.5 + i * 2.7 + p * 4) * (0.25 + p * 1.3)
        );
        const sc2 = 2.2 + p * 6.5;
        sp.scale.set(sc2, sc2, 1);
        sp.material.opacity = 0.17 * (p < 0.12 ? p / 0.12 : 1 - (p - 0.12) / 0.88);
      }
    });
  }
