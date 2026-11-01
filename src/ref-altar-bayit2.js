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
    const F = LV.KOH;
    const ACX = 55.5, ACZ = -3.5;
    const TOP = F + 9;
    const AS = M2.altarStone;
    H2.box(g, 32, 1, 1, AS, ACX, F, -19);
    H2.box(g, 1, 1, 31, AS, 40, F, -3);
    H2.box(g, 1, 1, 1, AS, 41, F, 12);
    H2.box(g, 1, 1, 1, AS, 71, F, -18);
    // Rambam, Hilchot Beit HaBechirah 2:11 (= Middot 3:2): in the south-west corner there were two thin holes (nekavim).
    // The exact spot inside the corner is not specified in the sources; modeled as two small dark openings on the corner of the yesod.
    {
      const holeMat = new MeshBasicMaterial({ color: 1315081 });
      H2.box(g, 0.2, 0.03, 0.2, holeMat, 39.85, F + 1.005, 12.05);
      H2.box(g, 0.2, 0.03, 0.2, holeMat, 40.35, F + 1.005, 12.05);
    }
    H2.box(g, 30, 6, 30, AS, ACX, F, ACZ);
    H2.box(g, 28, 3.1, 28, AS, ACX, F + 5.9, ACZ);
    for (const hx of [42, 69]) for (const hz of [-17, 10])
      H2.box(g, 1, 1.1, 1, AS, hx, F + 8.9, hz);
    const sikra = M2.plaster.clone();
    sikra.color.set(9318179);
    const bandY = F + 4.925;
    H2.box(g, 30.24, 0.15, 0.12, sikra, ACX, bandY, -18.53);
    H2.box(g, 30.24, 0.15, 0.12, sikra, ACX, bandY, 11.53);
    H2.box(g, 0.12, 0.15, 30.2, sikra, 40.47, bandY, ACZ);
    H2.box(g, 0.12, 0.15, 30.2, sikra, 70.53, bandY, ACZ);
    {
      const sh = new Shape();
      sh.moveTo(0, 0);
      sh.lineTo(32.98, 0);
      sh.lineTo(0.98, 9);
      sh.lineTo(0, 9);
      sh.closePath();
      const geo = new ExtrudeGeometry(sh, { depth: 16, bevelEnabled: false });
      geo.rotateY(-Math.PI / 2);
      geo.translate(63.5, F, 11.52);
      const ramp = new Mesh(geo, AS);
      ramp.castShadow = ramp.receiveShadow = true;
      g.add(ramp);
    }
    H2.box(g, 14, 0.3, 1.1, AS, ACX, F + 8.72, 11.02);
    slopedSlab(g, H2, AS, 46.2, 2.5, 11.5, 22, 17.3, 23.62);
    H2.box(g, 1, 5.6, 1, AS, 46.2, F, 12.4);
    slopedSlab(g, H2, AS, 43.5, 2.5, 13, 17, 27, 20.92);
    H2.box(g, 0.9, 2.35, 0.9, AS, 43.5, F, 20);
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
    addPyre(61, ACZ, 4.4, 0.24, 3);
    addPyre(45.2, 6, 2.4, 0.17, 2);
    addPyre(45.2, -11, 2.4, 0.17, 2);
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
      const m = new Mesh(geo, new MeshBasicMaterial({
        color,
        transparent: true,
        opacity: op,
        depthWrite: false
      }));
      m.position.set(x, y, z);
      m.castShadow = false;
      m.renderOrder = 2;
      m.userData.op = op;
      g.add(m);
      flames.push(m);
    };
    addFlame(61, 26.1, ACZ, 1.5, 3.6, 16742942, 0.75);
    addFlame(61.4, 26.15, -3.2, 0.95, 2.5, 16758832, 0.85);
    addFlame(60.7, 26.2, -3.8, 0.55, 1.7, 16769162, 0.9);
    addFlame(45.2, 25.55, 6, 0.65, 1.5, 16758832, 0.8);
    addFlame(45.2, 25.55, -11, 0.6, 1.3, 16742942, 0.8);
    const fireLight = new PointLight(16751165, 24, 60, 1.8);
    fireLight.position.set(61, 28.2, ACZ);
    g.add(fireLight);
    const emberLight = new PointLight(16747056, 6, 22, 1.8);
    emberLight.position.set(45.2, 26.6, -11);
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
      const sp = new Sprite(new SpriteMaterial({
        map: smokeTexture,
        color: 9079434,
        transparent: true,
        opacity: 0.15,
        depthWrite: false
      }));
      sp.renderOrder = 3;
      g.add(sp);
      smoke.push(sp);
    }
    {
      const ashMat = M2.altarStone.clone();
      ashMat.color.set(5591113);
      const geo = new SphereGeometry(2.3, 20, 14);
      geo.scale(1, 0.42, 1);
      const m = new Mesh(geo, ashMat);
      m.position.set(ACX, TOP + 0.05, ACZ);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    }
    const KX = 28, KZ = 17;
    H2.box(g, 6, 0.5, 6, M2.stoneSmooth, KX, F, KZ);
    H2.lathe(g, [
      [0.01, 0],
      [1.5, 0],
      [1.55, 0.14],
      [1.05, 0.3],
      [0.6, 0.55],
      [0.52, 1.3],
      [0.85, 1.6],
      [1.9, 2.05],
      [2.9, 2.6],
      [3.42, 3.1],
      [3.5, 3.5],
      [3.42, 3.62],
      [3.15, 3.45],
      [3.05, 3],
      [2.2, 2.45],
      [0.9, 2.2],
      [0.01, 2.15]
    ], M2.bronze, KX, F + 0.48, KZ, 32);
    {
      const water = new Mesh(
        new CircleGeometry(2.95, 28),
        new MeshStandardMaterial({ color: 3104873, roughness: 0.15, metalness: 0.1 })
      );
      water.rotation.x = -Math.PI / 2;
      water.position.set(KX, F + 3.46, KZ);
      water.receiveShadow = true;
      g.add(water);
    }
    {
      const geo = new CylinderGeometry(0.055, 0.08, 0.75, 8);
      geo.rotateX(Math.PI / 2);
      const inst = new InstancedMesh(geo, M2.bronze, 12);
      const m42 = new Matrix4(), q = new Quaternion(), e = new Euler();
      const p = new Vector3(), s = new Vector3(1, 1, 1);
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2;
        e.set(0.35, a, 0, "YXZ");
        q.setFromEuler(e);
        p.set(KX + Math.sin(a) * 1.7, F + 2.15, KZ + Math.cos(a) * 1.7);
        m42.compose(p, q, s);
        inst.setMatrixAt(i, m42);
      }
      inst.castShadow = true;
      g.add(inst);
    }
    {
      const MX = 28, MZ = 22.5, WY = F + 1.6;
      const wheel = new Mesh(new TorusGeometry(1.35, 0.17, 8, 22), M2.cedar);
      wheel.geometry.rotateY(Math.PI / 2);
      wheel.position.set(MX, WY, MZ);
      wheel.castShadow = wheel.receiveShadow = true;
      g.add(wheel);
      for (const rot of [0, Math.PI / 4, Math.PI / 2, Math.PI * 0.75]) {
        const geo = H2.uvWorldBox(new BoxGeometry(0.14, 2.5, 0.14), 0.14, 2.5, 0.14);
        geo.rotateX(rot);
        const spoke = new Mesh(geo, M2.cedar);
        spoke.position.set(MX, WY, MZ);
        spoke.castShadow = true;
        g.add(spoke);
      }
      const axle = H2.cyl(g, 0.09, 0.09, 2.6, M2.cedar, MX, WY - 1.3, MZ);
      axle.rotation.z = Math.PI / 2;
      const drum = H2.cyl(g, 0.38, 0.38, 0.8, M2.cedar, MX + 0.85, WY - 0.4, MZ);
      drum.rotation.z = Math.PI / 2;
      H2.box(g, 0.35, 1.6, 0.35, M2.cedar, MX - 1.15, F, MZ);
      H2.box(g, 0.35, 1.6, 0.35, M2.cedar, MX + 1.15, F, MZ);
    }
    {
      const geo = new TorusGeometry(0.5, 0.09, 8, 24);
      geo.rotateX(Math.PI / 2);
      const inst = new InstancedMesh(geo, M2.bronze, 24);
      const m42 = new Matrix4();
      let k = 0;
      for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) {
        m42.makeTranslation(42 + i * 4, F + 0.1, -24 - j * 5.2);
        inst.setMatrixAt(k++, m42);
      }
      inst.castShadow = inst.receiveShadow = true;
      g.add(inst);
    }
    const colXs = [43.5, 49, 54.5, 60];
    {
      const slab = H2.uvWorldBox(new BoxGeometry(2, 0.25, 1.5), 2, 0.25, 1.5);
      slab.translate(0, 0.875, 0);
      const leg = H2.uvWorldBox(new BoxGeometry(0.18, 0.75, 0.18), 0.18, 0.75, 0.18);
      leg.translate(0, 0.375, 0);
      const slabs = new InstancedMesh(slab, M2.marble, 8);
      const legs = new InstancedMesh(leg, M2.marble, 32);
      const m42 = new Matrix4();
      let a = 0, b = 0;
      for (const tz of [-45.5, -48.5]) for (const tx of colXs) {
        m42.makeTranslation(tx, F, tz);
        slabs.setMatrixAt(a++, m42);
        for (const sx of [-0.8, 0.8]) for (const sz of [-0.55, 0.55]) {
          m42.makeTranslation(tx + sx, F, tz + sz);
          legs.setMatrixAt(b++, m42);
        }
      }
      slabs.castShadow = slabs.receiveShadow = true;
      legs.castShadow = legs.receiveShadow = true;
      g.add(slabs);
      g.add(legs);
    }
    const nanZs = [-52.5, -55.5];
    {
      const geo = H2.uvWorld(new CylinderGeometry(0.35, 0.42, 4, 12), 2.5, 4);
      geo.translate(0, 2, 0);
      const inst = new InstancedMesh(geo, M2.stoneSmooth, 8);
      const m42 = new Matrix4();
      let k = 0;
      for (const nz of nanZs) for (const nx of colXs) {
        m42.makeTranslation(nx, F, nz);
        inst.setMatrixAt(k++, m42);
      }
      inst.castShadow = inst.receiveShadow = true;
      g.add(inst);
    }
    H2.box(g, 19, 0.45, 0.5, M2.cedar, 51.75, F + 4, -52.5);
    H2.box(g, 19, 0.45, 0.5, M2.cedar, 51.75, F + 4, -55.5);
    {
      const iron = M2.bronze.clone();
      iron.color.set(4868682);
      iron.roughness = 0.55;
      iron.metalness = 0.8;
      const geo = new TorusGeometry(0.17, 0.045, 6, 10, Math.PI * 1.3);
      geo.rotateZ(Math.PI / 2);
      geo.translate(0, -0.17, 0);
      const inst = new InstancedMesh(geo, iron, 40);
      const m42 = new Matrix4(), q = new Quaternion(), e = new Euler();
      const p = new Vector3(), s = new Vector3(1, 1, 1);
      let k = 0;
      for (const nz of nanZs) for (let i = 0; i < 8; i++) {
        e.set(0, i % 2 * 0.5 - 0.25, 0);
        q.setFromEuler(e);
        p.set(44 + i * 2.2, F + 4.08, nz);
        m42.compose(p, q, s);
        inst.setMatrixAt(k++, m42);
      }
      e.set(0, 0, 0);
      q.setFromEuler(e);
      for (const nx of colXs) for (const nz of nanZs) for (const hy of [1.7, 2.6, 3.5]) {
        p.set(nx, F + hy, nz - 0.42);
        m42.compose(p, q, s);
        inst.setMatrixAt(k++, m42);
      }
      inst.castShadow = true;
      g.add(inst);
    }
    // Rambam 2:14 (rubuva): a window 1x1 amah in the west side of the ramp. Its height along the ramp is not specified;
    // placed near the ground, mid-way along the ramp.
    {
      const darkMat = new MeshBasicMaterial({ color: 985864 });
      H2.box(g, 0.1, 1.5, 1.5, M2.stoneLight, 47.46, F + 0.15, 30);
      H2.box(g, 0.1, 1, 1, darkMat, 47.4, F + 0.4, 30);
    }
    ctx2.labels.push({ text: "\u05E8\u05D1\u05D5\u05D1\u05D4", x: 45.3, y: F + 3.2, z: 30, size: 1.8 });
    // Rambam 2:15: two tables west of the ramp - one of marble (for the limbs), one of silver (for the service vessels).
    // Exact spot is not specified; placed side by side beside the lower part of the ramp.
    {
      const silver = M2.bronze.clone();
      silver.color.set(13421772);
      silver.metalness = 0.9;
      silver.roughness = 0.3;
      const mkTable = (mat, tx, tz) => {
        H2.box(g, 2, 0.25, 1.5, mat, tx, F + 0.75, tz);
        for (const lx of [-0.85, 0.85]) for (const lz of [-0.6, 0.6]) H2.box(g, 0.18, 0.75, 0.18, mat, tx + lx, F, tz + lz);
      };
      mkTable(M2.marble, 44.3, 37);
      mkTable(silver, 44.3, 40.5);
      ctx2.labels.push({ text: "\u05E9\u05DC\u05D7\u05DF \u05E9\u05D9\u05E9", x: 42, y: F + 3, z: 37, size: 1.4 }, { text: "\u05E9\u05DC\u05D7\u05DF \u05DB\u05E1\u05E3", x: 42, y: F + 3, z: 40.5, size: 1.4 });
    }
    ctx2.labels.push(
      { text: "\u05D4\u05DE\u05D6\u05D1\u05D7", x: ACX, y: F + 18, z: ACZ, size: 5 },
      { text: "\u05D4\u05DB\u05D1\u05E9", x: ACX, y: F + 11, z: 28, size: 3 },
      { text: "\u05D4\u05DB\u05D9\u05D5\u05E8", x: KX, y: F + 7, z: KZ, size: 2.5 },
      { text: "\u05D1\u05D9\u05EA \u05D4\u05DE\u05D8\u05D1\u05D7\u05D9\u05D9\u05DD", x: 52, y: F + 10, z: -49, size: 3.5 },
      { text: "\u05D4\u05D8\u05D1\u05E2\u05D5\u05EA", x: 52, y: F + 4.5, z: -31.5, size: 2.5 }
    );
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    ctx2.shared.flyPoints.mizbeach = { pos: [115, 58, 72], target: [55, 24, -3] };
    ctx2.animated.push((t) => {
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
          61 + Math.sin(s * 0.55 + i * 1.9 + p * 5) * (0.3 + p * 1.7),
          26.6 + p * 40,
          ACZ + Math.cos(s * 0.5 + i * 2.7 + p * 4) * (0.25 + p * 1.3)
        );
        const sc2 = 2.2 + p * 6.5;
        sp.scale.set(sc2, sc2, 1);
        sp.material.opacity = 0.17 * (p < 0.12 ? p / 0.12 : 1 - (p - 0.12) / 0.88);
      }
    });
  }

