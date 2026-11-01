  // plugin/js/courts.js
  async function build2(ctx2) {
    const { H: H2, M: M2 } = ctx2;
    const HP = Math.PI / 2;
    const g = new Group();
    g.name = "courts";
    ctx2.root.add(g);
    const lbl = (text, x, y, z, size = 3) => ctx2.labels.push({ text, x, y, z, size });
    const water = M2.marble.clone();
    water.color = new Color(4156814);
    water.roughness = 0.25;
    const clay = M2.plaster.clone();
    clay.color = new Color(11569512);
    const goldDoor = M2.gold.clone();
    const ember = new MeshStandardMaterial({ color: 2363398, emissive: 16734744, emissiveIntensity: 1.6, roughness: 0.9 });
    H2.box(g, 197, LV.AZ - 0.15, 155, M2.stone, (CO.azW - 10 + CO.azE) / 2, 0, 0);
    H2.box(g, 145, LV.EZN - 0.15, 155, M2.stone, (CO.eznW + CO.eznE + 10) / 2, 0, 0);
    H2.box(g, 197, 0.15, 10, M2.pave, -5, 13.35, -72.5);
    H2.box(g, 197, 0.15, 10, M2.pave, -5, 13.35, 72.5);
    H2.box(g, 10, 0.15, 135, M2.pave, -98.5, 13.35, 0);
    H2.box(g, 10, 0.15, 155, M2.paveFine, 233.5, 5.85, 0);
    H2.box(g, 135, 0.15, 10, M2.paveFine, 161, 5.85, -72.5);
    H2.box(g, 135, 0.15, 10, M2.paveFine, 161, 5.85, 72.5);
    H2.box(g, 135, 0.15, 135, M2.paveFine, 161, 5.85, 0);
    H2.box(g, 11, 0.15, 135, M2.paveFine, 88, 13.35, 0);
    H2.box(g, 176, 2.65, 135, M2.pave, -5.5, 13.35, 0);
    H2.stairs(g, { width: 14, totalRise: 6, steps: 12, dir: "W", x: 244.5, y: 0, z: 0, tread: 0.5 });
    H2.stairs(g, { width: 14, totalRise: 6, steps: 12, dir: "S", x: 161, y: 0, z: -83.5, tread: 0.5 });
    H2.stairs(g, { width: 14, totalRise: 6, steps: 12, dir: "N", x: 161, y: 0, z: 83.5, tread: 0.5 });
    for (const gx of [-40, 0, 40]) for (const s of [-1, 1]) {
      const dir = s < 0 ? "S" : "N";
      H2.stairs(g, { width: 12, totalRise: 6, steps: 12, dir, x: gx, y: 0, z: 97.75 * s, tread: 0.5 });
      H2.box(g, 12, 6, 6.75, M2.stoneSmooth, gx, 0, 88.375 * s);
      H2.stairs(g, { width: 12, totalRise: 7.5, steps: 15, dir, x: gx, y: 6, z: 85 * s, tread: 0.5 });
      H2.stairs(g, { width: 10, totalRise: 2.5, steps: 5, dir, x: gx, y: 13.5, z: 70 * s, tread: 0.5 });
    }
    H2.stairs(g, { width: 60, totalRise: 1, steps: 1, dir: "W", x: 88, y: 13.5, z: 0, tread: 1 });
    H2.stairs(g, { width: 60, totalRise: 1.5, steps: 3, dir: "W", x: 87, y: 14.5, z: 0, tread: 1.5 });
    lbl("\u05D3\u05D5\u05DB\u05DF \u05D4\u05DC\u05D5\u05D9\u05D9\u05DD", 85, 19.5, 0, 2.5);
    H2.wall(g, {
      axis: "z",
      length: 135,
      height: 22,
      thickness: 5,
      mat: M2.stone,
      cx: 228.5,
      cz: 0,
      y: 6,
      openings: [{ center: 0, width: 10, height: 20, arched: true }]
    });
    for (const s of [-1, 1])
      H2.wall(g, {
        axis: "x",
        length: 139.5,
        height: 22,
        thickness: 5,
        mat: M2.stone,
        cx: 160.75,
        cz: 67.5 * s,
        y: 6,
        openings: [{ center: 0.25, width: 10, height: 20, arched: true }]
      });
    H2.occ(H2.box(g, 5.4, 0.9, 137, M2.stoneLight, 228.5, 28, 0));
    H2.occ(H2.box(g, 141, 0.9, 5.4, M2.stoneLight, 160.75, 28, -67.5));
    H2.occ(H2.box(g, 141, 0.9, 5.4, M2.stoneLight, 160.75, 28, 67.5));
    H2.crenellate(g, { x1: 228.5, z1: -64, x2: 228.5, z2: 64, y: 28.9, mat: M2.stoneLight });
    H2.crenellate(g, { x1: 95, z1: -67.5, x2: 229, z2: -67.5, y: 28.9, mat: M2.stoneLight });
    H2.crenellate(g, { x1: 95, z1: 67.5, x2: 229, z2: 67.5, y: 28.9, mat: M2.stoneLight });
    lbl("\u05D4\u05E9\u05E2\u05E8 \u05D4\u05E2\u05DC\u05D9\u05D5\u05DF", 233, 29.5, 0, 3.5);
    lbl("\u05E2\u05D6\u05E8\u05EA \u05E0\u05E9\u05D9\u05DD", 161, 9, 40, 4);
    const chambers = [
      { x0: 188.5, z0: 27.5, xw: 188.5, name: "\u05DC\u05E9\u05DB\u05EA \u05D4\u05E0\u05D6\u05D9\u05E8\u05D9\u05DD", prop: "fire" },
      { x0: 188.5, z0: -67.5, xw: 188.5, name: "\u05DC\u05E9\u05DB\u05EA \u05D4\u05E2\u05E6\u05D9\u05DD", prop: "wood" },
      { x0: 93.5, z0: -67.5, xw: 133.5, name: "\u05DC\u05E9\u05DB\u05EA \u05D4\u05DE\u05E6\u05D5\u05E8\u05E2\u05D9\u05DD", prop: "mikveh" },
      { x0: 93.5, z0: 27.5, xw: 133.5, name: "\u05DC\u05E9\u05DB\u05EA \u05E9\u05DE\u05E0\u05D9\u05DD", prop: "jars" }
    ];
    for (const c of chambers) {
      const cx = c.x0 + 20, cz = c.z0 + 20, zPlain = c.z0 > 0 ? 27.5 : -27.5;
      H2.wall(g, {
        axis: "z",
        length: 40,
        height: 12,
        thickness: 2.5,
        mat: M2.stoneLight,
        cx: c.xw,
        cz,
        y: 6,
        openings: [{ center: 0, width: 6, height: 9, arched: true }]
      });
      H2.box(g, 40, 12, 2.5, M2.stoneLight, cx, 6, zPlain);
      lbl(c.name, cx, 20, cz, 3);
      if (c.prop === "fire") {
        H2.lathe(g, [[0, 0], [1.1, 0.12], [1.55, 0.6], [1.65, 1.05], [1.45, 1.2]], M2.bronze, cx, 6, cz);
        H2.cyl(g, 1.05, 1.15, 0.35, ember, cx, 6.55, cz);
        const fl = new PointLight(16748608, 9, 24, 2);
        fl.position.set(cx, 8.2, cz);
        g.add(fl);
        ctx2.animated.push((t) => {
          fl.intensity = 8.5 + Math.sin(t * 0.011) * 2 + Math.sin(t * 0.043) * 1.1;
        });
      } else if (c.prop === "wood") {
        const logGeo = new CylinderGeometry(0.38, 0.38, 6.5, 9);
        logGeo.rotateZ(HP);
        const logs = new InstancedMesh(logGeo, M2.cedar, 8);
        const lp = [[-2.2, 6.38], [-1.1, 6.38], [0, 6.38], [1.1, 6.38], [-1.65, 7.04], [-0.55, 7.04], [0.55, 7.04], [-1.1, 7.7]];
        const m42 = new Matrix4();
        lp.forEach((p, i) => {
          m42.makeTranslation(cx - 3, p[1], cz + p[0]);
          logs.setMatrixAt(i, m42);
        });
        logs.instanceMatrix.needsUpdate = true;
        logs.castShadow = logs.receiveShadow = true;
        g.add(logs);
      } else if (c.prop === "mikveh") {
        H2.box(g, 6.4, 1.2, 0.7, M2.stoneSmooth, cx, 6, cz - 2.85);
        H2.box(g, 6.4, 1.2, 0.7, M2.stoneSmooth, cx, 6, cz + 2.85);
        H2.box(g, 0.7, 1.2, 5, M2.stoneSmooth, cx - 2.85, 6, cz);
        H2.box(g, 0.7, 1.2, 5, M2.stoneSmooth, cx + 2.85, 6, cz);
        H2.box(g, 5, 0.08, 5, water, cx, 5.98, cz);
        H2.stairs(g, { width: 2.6, totalRise: 1.2, steps: 3, dir: "N", x: cx, y: 6, z: cz + 5.5 });
      } else if (c.prop === "jars") {
        const jarGeo = new LatheGeometry(
          [[0, 0], [0.72, 0.08], [1.02, 0.75], [1.02, 1.35], [0.66, 2], [0.4, 2.25], [0.5, 2.55]].map((p) => new Vector2(p[0], p[1])),
          18
        );
        for (const [dx, dz] of [[-3, -2], [-1, -3.4], [2.4, -1.2], [0.8, 2.6]]) {
          const j = new Mesh(jarGeo, clay);
          j.position.set(cx + dx, 6, cz + dz);
          j.castShadow = j.receiveShadow = true;
          g.add(j);
        }
      }
    }
    for (const zs of [-1, 1]) for (const [wx, w] of [[144.5, 19], [177.75, 19.5]]) {
      H2.box(g, w, 0.35, 3, M2.cedar, wx, 13.65, zs * 64);
      H2.box(g, w, 2.2, 0.25, M2.lattice, wx, 14, zs * 62.6);
    }
    for (const czs of [-16.5, 16.5]) {
      H2.box(g, 3, 0.35, 19, M2.cedar, 225, 13.65, czs);
      H2.box(g, 0.25, 2.2, 19, M2.lattice, 223.6, 14, czs);
    }
    const corbGeo = H2.uvWorldBox(new BoxGeometry(1.1, 1.2, 1.6), 1.1, 1.2, 1.6);
    const corbs = [];
    for (const x of [138, 146, 152, 170, 178, 186]) {
      corbs.push([x, -64.9, 0]);
      corbs.push([x, 64.9, 0]);
    }
    for (const z of [-23, -16, -9, 9, 16, 23]) corbs.push([225.9, z, HP]);
    const ci = new InstancedMesh(corbGeo, M2.stoneLight, corbs.length);
    corbs.forEach((c, i) => {
      const m = new Matrix4().makeRotationY(c[2]);
      m.setPosition(c[0], 13.05, c[1]);
      ci.setMatrixAt(i, m);
    });
    ci.instanceMatrix.needsUpdate = true;
    ci.castShadow = ci.receiveShadow = true;
    g.add(ci);
    const gN = [["\u05E9\u05E2\u05E8 \u05D1\u05D9\u05EA \u05D4\u05DE\u05D5\u05E7\u05D3", -40], ["\u05E9\u05E2\u05E8 \u05D4\u05E7\u05E8\u05D1\u05DF", 0], ["\u05E9\u05E2\u05E8 \u05D4\u05E0\u05D9\u05E6\u05D5\u05E5", 40]];
    const gS = [["\u05E9\u05E2\u05E8 \u05D4\u05D3\u05DC\u05E7", -40], ["\u05E9\u05E2\u05E8 \u05D4\u05D1\u05DB\u05D5\u05E8\u05D5\u05EA", 0], ["\u05E9\u05E2\u05E8 \u05D4\u05DE\u05D9\u05DD", 40]];
    const ops = (xs) => xs.map(([, x]) => ({ center: x, width: 10, height: 20, arched: true }));
    H2.wall(g, { axis: "x", length: 192, height: 26.5, thickness: 5, mat: M2.stone, cx: 0, cz: -67.5, y: 13.5, openings: ops(gN) });
    H2.wall(g, { axis: "x", length: 192, height: 26.5, thickness: 5, mat: M2.stone, cx: 0, cz: 67.5, y: 13.5, openings: ops(gS) });
    H2.wall(g, { axis: "z", length: 135, height: 26.5, thickness: 5, mat: M2.stone, cx: -93.5, cz: 0, y: 13.5 });
    H2.box(g, 5, 7.5, 135, M2.stone, 93.5, 6, 0);
    H2.wall(g, { axis: "z", length: 135, height: 26.5, thickness: 5, mat: M2.stone, cx: 93.5, cz: 0, y: 13.5, openings: [
      { center: 0, width: 10, height: 20, arched: true },
      // Nikanor
      { center: -12, width: 4, height: 8, arched: true },
      // pishpeshin
      { center: 12, width: 4, height: 8, arched: true }
    ] });
    gN.forEach(([n, x]) => lbl(n, x, 35.5, -70.5, 3.2));
    gS.forEach(([n, x]) => lbl(n, x, 35.5, 70.5, 3.2));
    H2.occ(H2.box(g, 194, 0.9, 6.5, M2.stoneLight, 0, 40, -67.5));
    H2.occ(H2.box(g, 194, 0.9, 6.5, M2.stoneLight, 0, 40, 67.5));
    H2.occ(H2.box(g, 6.5, 0.9, 137, M2.stoneLight, -93.5, 40, 0));
    H2.occ(H2.box(g, 6.5, 0.9, 137, M2.stoneLight, 93.5, 40, 0));
    H2.crenellate(g, { x1: -94, z1: -67.5, x2: 94, z2: -67.5, y: 40.9, mat: M2.stoneLight });
    H2.crenellate(g, { x1: -94, z1: 67.5, x2: 94, z2: 67.5, y: 40.9, mat: M2.stoneLight });
    H2.crenellate(g, { x1: -93.5, z1: -64, x2: -93.5, z2: 64, y: 40.9, mat: M2.stoneLight });
    H2.crenellate(g, { x1: 93.5, z1: -64, x2: 93.5, z2: 64, y: 40.9, mat: M2.stoneLight });
    H2.box(g, 2.4, 22, 2.4, M2.stoneLight, 96.4, 13.5, -6.8);
    H2.box(g, 2.4, 22, 2.4, M2.stoneLight, 96.4, 13.5, 6.8);
    H2.box(g, 4.6, 2.8, 19, M2.stoneLight, 95.6, 34.2, 0);
    H2.box(g, 5.6, 1, 21.5, M2.stoneLight, 95.6, 37, 0);
    lbl("\u05E9\u05E2\u05E8 \u05E0\u05D9\u05E7\u05E0\u05D5\u05E8", 100, 39.5, 0, 4);
    for (let i = 0; i < 15; i++) {
      const geo = new CylinderGeometry(24 - i, 24 - i, 0.5, 48, 1, false, 0, Math.PI);
      const st = new Mesh(geo, M2.stoneSmooth);
      st.position.set(93.5, 6.25 + i * 0.5, 0);
      st.castShadow = st.receiveShadow = true;
      g.add(st);
    }
    const leafGeo = H2.uvWorldBox(new BoxGeometry(0.35, 19, 4.9), 0.35, 19, 4.9);
    leafGeo.translate(0, 9.5, 2.45);
    const Lm = [];
    const leaf = (x, y, z, a) => {
      const m = new Matrix4().makeRotationY(a);
      m.setPosition(x, y, z);
      Lm.push(m);
    };
    [[-40, 0.48], [0, 0.3], [40, 0.42]].forEach(([gx, d]) => {
      leaf(gx - 5, 13.5, -67.5, HP - d);
      leaf(gx + 5, 13.5, -67.5, -HP + d);
      leaf(gx - 5, 13.5, 67.5, HP + d);
      leaf(gx + 5, 13.5, 67.5, -HP - d);
    });
    leaf(156, 6, -67.5, HP - 0.35);
    leaf(166, 6, -67.5, -HP + 0.35);
    leaf(156, 6, 67.5, HP + 0.35);
    leaf(166, 6, 67.5, -HP - 0.35);
    leaf(228.5, 6, -5, -0.3);
    leaf(228.5, 6, 5, Math.PI + 0.3);
    const goldLeaves = new InstancedMesh(leafGeo, goldDoor, Lm.length);
    Lm.forEach((m, i) => goldLeaves.setMatrixAt(i, m));
    goldLeaves.instanceMatrix.needsUpdate = true;
    goldLeaves.castShadow = goldLeaves.receiveShadow = true;
    g.add(goldLeaves);
    const bz = (geo, x, z, a) => {
      const m = new Mesh(geo, M2.bronze);
      m.position.set(x, 13.5, z);
      m.rotation.y = a;
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    };
    bz(leafGeo, 94.8, -5, 0.38);
    bz(leafGeo, 94.8, 5, Math.PI - 0.38);
    const pishGeo = H2.uvWorldBox(new BoxGeometry(0.3, 7.6, 3.8), 0.3, 7.6, 3.8);
    pishGeo.translate(0, 3.8, 1.9);
    bz(pishGeo, 94.8, 10, 0.22);
    bz(pishGeo, 94.8, -10, Math.PI - 0.22);
    const annex = (x, side, w, d, h, name, ly) => {
      const cz = 67.5 * side;
      H2.box(g, w, h, d, M2.stoneLight, x, 13.5, cz);
      const roof = H2.box(g, w + 1.4, 0.7, d + 1.4, M2.stoneSmooth, x, 13.5 + h, cz);
      ctx2.cutaway.push(roof);
      H2.box(g, 3.6, 7, 0.35, M2.cedar, x, 16, cz - side * (d / 2 + 0.1));
      lbl(name, x, ly || 16.5 + h, cz, 3);
      return roof;
    };
    H2.box(g, 3.6, 7, 0.35, M2.cedar, -60, 16, -77.6); // Middot 1:6 second door, to the Hel
    lbl("\u05E4\u05EA\u05D7 \u05DC\u05D7\u05D9\u05DC", -60, 23, -79, 2);
    lbl("\u05E4\u05EA\u05D7 \u05DC\u05E2\u05D6\u05E8\u05D4", -60, 23, -56, 2);
    annex(-60, -1, 24, 20, 15, "\u05D1\u05D9\u05EA \u05D4\u05DE\u05D5\u05E7\u05D3", 37);
    const drum = H2.cyl(g, 8.2, 8.6, 1.3, M2.stoneLight, -60, 29.2, -67.5);
    const dome = H2.lathe(
      g,
      [[8.1, 0], [7.7, 1.7], [6.4, 3.1], [4.4, 4.2], [2.2, 4.9], [0, 5.15]],
      M2.stoneLight,
      -60,
      30.5,
      -67.5,
      28
    );
    ctx2.cutaway.push(drum, dome);
    for (const sx of [-1, 1]) for (const sz of [-1, 1])
      H2.box(g, 5, 11, 5, M2.stoneLight, -60 + sx * 11, 13.5, -67.5 + sz * 7.5);
    annex(20, -1, 14, 18, 13.5, "\u05DC\u05E9\u05DB\u05EA \u05D4\u05D2\u05D5\u05DC\u05D4 \u05D5\u05D1\u05D5\u05E8 \u05D4\u05D2\u05D5\u05DC\u05D4");
    H2.cyl(g, 1.85, 2, 1, M2.stoneSmooth, 32, 13.5, -74);
    H2.ring(g, 1.7, 0.45, M2.stoneSmooth, 32, 14.6, -74);
    H2.cyl(g, 1.3, 1.3, 0.06, water, 32, 14.5, -74);
    H2.ring(g, 1.5, 0.17, M2.cedar, 32, 16.4, -74, 0);
    H2.box(g, 0.4, 3.1, 0.4, M2.cedar, 30.4, 13.5, -74);
    H2.box(g, 0.4, 3.1, 0.4, M2.cedar, 33.6, 13.5, -74);
    H2.box(g, 3.6, 0.28, 0.28, M2.cedar, 32, 16.26, -74);
    H2.box(g, 26, 16, 20, M2.stoneLight, 60, 13.5, -67.5);
    H2.box(g, 27.6, 0.9, 21.6, M2.marble, 60, 29.5, -67.5);
    const tri = new Shape();
    tri.moveTo(-10.8, 0);
    tri.lineTo(10.8, 0);
    tri.lineTo(0, 4.4);
    tri.closePath();
    const gg = new ExtrudeGeometry(tri, { depth: 27, bevelEnabled: false });
    gg.translate(0, 0, -13.5);
    const gable = new Mesh(gg, M2.stoneLight);
    gable.rotation.y = HP;
    gable.position.set(60, 30.4, -67.5);
    gable.castShadow = gable.receiveShadow = true;
    g.add(gable);
    ctx2.cutaway.push(gable);
    const pilA = new InstancedMesh(H2.uvWorldBox(new BoxGeometry(1, 11.5, 1), 1, 11.5, 1), M2.marble, 7);
    [49, 52.7, 56.4, 60, 63.6, 67.3, 71].forEach((x, i) => {
      const m = new Matrix4();
      m.makeTranslation(x, 21.75, -57.2);
      pilA.setMatrixAt(i, m);
    });
    const pilB = new InstancedMesh(H2.uvWorldBox(new BoxGeometry(1, 14.5, 1), 1, 14.5, 1), M2.marble, 6);
    let bi = 0;
    for (const x of [46.8, 73.2]) for (const z of [-74.5, -67.5, -60.5]) {
      const m = new Matrix4();
      m.makeTranslation(x, 20.75, z);
      pilB.setMatrixAt(bi++, m);
    }
    for (const p of [pilA, pilB]) {
      p.instanceMatrix.needsUpdate = true;
      p.castShadow = p.receiveShadow = true;
      g.add(p);
    }
    H2.box(g, 3.8, 7.5, 0.35, M2.cedar, 60, 16, -57.35);
    lbl("\u05DC\u05E9\u05DB\u05EA \u05D4\u05D2\u05D6\u05D9\u05EA \u2014 \u05DE\u05D5\u05E9\u05D1 \u05D4\u05E1\u05E0\u05D4\u05D3\u05E8\u05D9\u05DF", 60, 33.5, -67.5, 3);
    annex(-60, 1, 14, 18, 13.5, "\u05DC\u05E9\u05DB\u05EA \u05D4\u05DE\u05DC\u05D7");
    annex(-20, 1, 14, 18, 14, "\u05DC\u05E9\u05DB\u05EA \u05D4\u05E4\u05E8\u05D5\u05D4");
    H2.ring(g, 2.1, 0.5, M2.stoneSmooth, -20, 28.5, 67.5);
    H2.cyl(g, 1.6, 1.6, 0.12, water, -20, 28.32, 67.5);
    annex(20, 1, 14, 18, 13.5, "\u05DC\u05E9\u05DB\u05EA \u05D4\u05DE\u05D3\u05D9\u05D7\u05D9\u05DF");
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    Object.assign(ctx2.shared.flyPoints, {
      ezratNashim: { pos: [240, 85, 125], target: [160, 6, 0] },
      nikanor: { pos: [190, 35, 40], target: [93, 22, 0] },
      azarah: { pos: [150, 105, 150], target: [20, 15, 0] }
    });
  }

