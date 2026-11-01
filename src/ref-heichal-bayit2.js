  // plugin/js/heichal.js
  function m4(x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const m = new Matrix4();
    m.compose(
      new Vector3(x, y, z),
      new Quaternion().setFromEuler(new Euler(rx, ry, rz)),
      new Vector3(sx, sy, sz)
    );
    return m;
  }
  function instMesh(parent, geo, mat, mats, shadows = true) {
    const im = new InstancedMesh(geo, mat, mats.length);
    mats.forEach((mm, i) => im.setMatrixAt(i, mm));
    im.castShadow = shadows;
    im.receiveShadow = shadows;
    parent.add(im);
    return im;
  }
  function spikeMats(segs) {
    const out = [];
    for (const s of segs) {
      const dx = s.x2 - s.x1, dz = s.z2 - s.z1;
      const n = Math.max(2, Math.floor(Math.hypot(dx, dz) / 2) + 1);
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        out.push(m4(s.x1 + dx * t, s.y, s.z1 + dz * t));
      }
    }
    return out;
  }
  async function build4(ctx2) {
    const { H: H2, M: M2 } = ctx2;
    const g = new Group();
    g.name = "heichal";
    ctx2.root.add(g);
    const F = LV.HEI;
    const AZ = LV.KOH;
    const E = CO.xUlamE;
    const W = CO.xHeiW;
    const cut = [];
    H2.box(g, 16.5, 6, 102, M2.marble, 9.25, AZ, 0);
    H2.box(g, 84.5, 6, 72, M2.marble, -41.25, AZ, 0);
    // Middot 3:6 (+5:1): 12 steps, each 0.5 amah high and 1 amah deep ("רום מעלה חצי אמה ושלחה אמה"); landings (רובד) 3, 3 and 4 amot
    // ("אמה אמה ורובד שלש" x2, "והעליונה אמה אמה ורובד ארבע"; R. Yehuda: top landing 5 - not modeled). 12 + 3 + 3 + 4 = 22 = the distance
    // between the ulam and the altar (5:1). ASSUMPTION (see DEV_NOTES): the steps and landings fill the whole 22, starting at the altar's west face.
    {
      const ALTAR_W = 39.5, LAND = [3, 3, 4];
      let sx = ALTAR_W, lvl = 0;
      for (let grp = 0; grp < 3; grp++) {
        for (let i = 0; i < 4; i++) {
          lvl += 0.5;
          H2.box(g, 1, lvl, 24, M2.stoneSmooth, sx - 0.5, AZ, 0);
          sx -= 1;
        }
        H2.box(g, LAND[grp], lvl, 24, M2.marble, sx - LAND[grp] / 2, AZ, 0);
        sx -= LAND[grp];
      }
    }
    H2.wall(g, {
      axis: "z",
      length: 100,
      height: 100,
      thickness: 5,
      mat: M2.marble,
      occlude: false,
      cx: 15,
      cz: 0,
      y: F,
      openings: [{ center: 0, width: 20, height: 40 }]
    });
    H2.box(g, 0.4, 2.5, 40, M2.stoneSmooth, 17.5, F, -30);
    H2.box(g, 0.4, 2.5, 40, M2.stoneSmooth, 17.5, F, 30);
    H2.box(g, 0.15, 37.5, 5, M2.gold, 17.575, F + 2.5, -12.7);
    H2.box(g, 0.15, 37.5, 5, M2.gold, 17.575, F + 2.5, 12.7);
    H2.box(g, 0.15, 3.5, 32, M2.gold, 17.575, 72.5, 0);
    H2.box(g, 0.18, 3, 100, M2.gold, 17.59, 99, 0);
    const beamW = [22, 24, 26, 28, 30];
    for (let i = 0; i < 5; i++) H2.box(g, 0.8, 1, beamW[i], M2.cedar, 17.6, 62.5 + i * 2, 0);
    const pilG = H2.uvWorldBox(new BoxGeometry(0.5, 76, 1.6), 0.5, 76, 1.6);
    const pilMats = [];
    for (const zz of [34.5, 39.5, 44.5, 49]) {
      pilMats.push(m4(17.6, 60, zz));
      pilMats.push(m4(17.6, 60, -zz));
    }
    instMesh(g, pilG, M2.marble, pilMats);
    const wingN = H2.box(g, 11, 95, 22.5, M2.marble, 7, F, -38.75);
    const wingS = H2.box(g, 11, 95, 22.5, M2.marble, 7, F, 38.75);
    cut.push(wingS);
    const ulamCeil = H2.box(g, 11, 0.4, 55, M2.cedar, 7, 63.9, 0);
    const ulamFill = H2.box(g, 11, 52.7, 55, M2.marble, 7, 64.3, 0);
    cut.push(ulamCeil, ulamFill);
    H2.box(g, 11.7, 1.5, 102.4, M2.gold, 6.65, 117, 0);
    H2.box(g, 11, 3, 0.9, M2.marble, 7, 118.5, -50.7);
    const ulamParS = H2.box(g, 11, 3, 0.9, M2.marble, 7, 118.5, 50.7);
    H2.box(g, 0.9, 3, 14.5, M2.marble, 1.3, 118.5, -43.6);
    const wingParS = H2.box(g, 0.9, 3, 14.5, M2.marble, 1.3, 118.5, 43.6);
    cut.push(ulamParS, wingParS);
    const bodyN = H2.box(g, 84, 85, 25, M2.marble, -40.5, F, -22.5);
    const bodyS = H2.box(g, 84, 85, 25, M2.marble, -40.5, F, 22.5);
    H2.box(g, 17, 85, 20, M2.marble, -74, F, 0);
    cut.push(bodyS);
    const goldCeil = H2.box(g, 61, 0.4, 20, M2.gold, -35, 62, 0);
    const innerFill = H2.box(g, 61, 44.6, 20, M2.marble, -35, 62.4, 0);
    cut.push(goldCeil, innerFill);
    H2.box(g, 83, 10, 68, M2.marble, -40, 107, 0);
    H2.box(g, 84.78, 1.5, 73, M2.gold, -41.61, 117, 0);
    H2.box(g, 85, 3, 0.9, M2.marble, -41, 118.5, -35.9);
    H2.box(g, 85, 3, 0.9, M2.marble, -41, 118.5, 35.9);
    H2.box(g, 0.9, 3, 70, M2.marble, -83.2, 118.5, 0);
    for (const yy of [36, 50, 64]) {
      H2.box(g, 84, 0.6, 0.7, M2.stoneSmooth, -40.5, yy, -35);
      cut.push(H2.box(g, 84, 0.6, 0.7, M2.stoneSmooth, -40.5, yy, 35));
    }
    H2.box(g, 0.7, 0.6, 70, M2.stoneSmooth, -82.5, 36, 0);
    H2.box(g, 0.7, 0.6, 70, M2.stoneSmooth, -82.5, 50, 0);
    const taG = H2.uvWorldBox(new BoxGeometry(0.8, 42, 0.3), 0.8, 42, 0.3);
    const taN = [], taS = [];
    for (let x = -80.5; x <= -3.5 + 0.01; x += 7) {
      taN.push(m4(x, 43, -35.15));
      taS.push(m4(x, 43, 35.15));
    }
    instMesh(g, taG, M2.stoneSmooth, taN);
    cut.push(instMesh(g, taG, M2.stoneSmooth, taS));
    const winG = new BoxGeometry(1.5, 4, 0.3);
    const winMat = new MeshStandardMaterial({ color: 1445897, roughness: 1 });
    const winN = [], winS = [];
    for (let x = -76; x <= -6 + 0.01; x += 10) {
      for (const yy of [70, 95]) {
        winN.push(m4(x, yy, -35.15));
        winS.push(m4(x, yy, 35.15));
      }
    }
    instMesh(g, winG, winMat, winN, false);
    cut.push(instMesh(g, winG, winMat, winS, false));
    H2.box(g, 6, 85, 1.1, M2.marble, -2, F, -35);
    const spikeG = new ConeGeometry(0.12, 1, 6);
    spikeG.translate(0, 0.5, 0);
    instMesh(g, spikeG, M2.gold, spikeMats([
      { x1: 15, z1: -49, x2: 15, z2: 49, y: 122 },
      // facade top
      { x1: -83, z1: -35.9, x2: 1, z2: -35.9, y: 121.5 },
      // body N
      { x1: -83, z1: 35.9, x2: 1, z2: 35.9, y: 121.5 },
      // body S
      { x1: -83.2, z1: -34, x2: -83.2, z2: 34, y: 121.5 },
      // body W
      { x1: 2, z1: -50.7, x2: 12, z2: -50.7, y: 121.5 },
      // ulam N
      { x1: 1.3, z1: -50, x2: 1.3, z2: -37, y: 121.5 }
      // wing N return
    ]), false);
    cut.push(instMesh(g, spikeG, M2.gold, spikeMats([
      { x1: 2, z1: 50.7, x2: 12, z2: 50.7, y: 121.5 },
      { x1: 1.3, z1: 37, x2: 1.3, z2: 50, y: 121.5 }
    ]), false));
    H2.box(g, 60.3, 0.06, 18.6, M2.marble, -34.71, F + 0.01, 0);
    H2.box(g, 6.24, 0.06, 10.1, M2.marble, -1.42, F + 0.01, 0);
    H2.box(g, 10.68, 0.06, 54.8, M2.marble, 7.06, F + 0.01, 0);
    const FL = F + 0.08;
    H2.box(g, 61, 40, 0.6, M2.gold, -35, F, -9.68);
    const lineS = H2.box(g, 61, 40, 0.6, M2.gold, -35, F, 9.68);
    H2.box(g, 0.6, 40, 18.76, M2.gold, -65.18, F, 0);
    cut.push(lineS);
    H2.wall(g, {
      axis: "z",
      length: 20,
      height: 85,
      thickness: 6,
      mat: M2.gold,
      occlude: false,
      cx: -1.5,
      cz: 0,
      y: F,
      openings: [{ center: 0, width: 10, height: 20 }]
    });
    const doorSpec = [
      { hx: 1.62, hz: -5, dz: 2.45, ry: 0.55 },
      { hx: 1.62, hz: 5, dz: -2.45, ry: -0.55 },
      { hx: -4.62, hz: -5, dz: 2.45, ry: -0.5 },
      { hx: -4.62, hz: 5, dz: -2.45, ry: 0.5 }
    ];
    for (const d of doorSpec) {
      const hinge = new Group();
      hinge.position.set(d.hx, F, d.hz);
      hinge.rotation.y = d.ry;
      g.add(hinge);
      H2.box(hinge, 0.22, 19.8, 4.9, M2.gold, 0.11, 0.05, d.dz);
    }
    H2.box(g, 0.15, 42, 17.1, M2.gold, 1.6, F, -18.75);
    cut.push(H2.box(g, 0.15, 42, 17.1, M2.gold, 1.6, F, 18.75));
    H2.cyl(g, 0.15, 0.18, 22, M2.cedar, 2.3, F, -5.7, 10);
    H2.cyl(g, 0.15, 0.18, 22, M2.cedar, 2.3, F, 5.7, 10);
    const rod = new Mesh(new CylinderGeometry(0.1, 0.1, 12, 10), M2.gold);
    rod.rotation.x = Math.PI / 2;
    rod.position.set(2.3, 43.5, 0);
    rod.castShadow = true;
    g.add(rod);
    const leafG = new BoxGeometry(0.55, 0.06, 0.4);
    const leafMats = [], grapeMats = [];
    for (let i = 0; i < 14; i++) {
      leafMats.push(m4(
        2.35 + Math.sin(i * 3.7) * 0.15,
        43.2 + Math.sin(i * 2.1) * 0.9,
        -5.5 + i * (11 / 13),
        Math.sin(i) * 0.6,
        i * 0.9,
        0.4 + Math.sin(i * 1.3) * 0.5
      ));
    }
    for (let i = 0; i < 10; i++) {
      grapeMats.push(m4(2.4, 42.3 + Math.sin(i * 2.7) * 0.5, -4.5 + i, 0, 0, 0, 1, 1.6, 1));
    }
    instMesh(g, leafG, M2.gold, leafMats, false);
    instMesh(g, new SphereGeometry(0.2, 8, 8), M2.gold, grapeMats, false);
    const chainG = new CylinderGeometry(0.07, 0.07, 24, 8);
    instMesh(
      g,
      chainG,
      M2.gold,
      [m4(7, 52, -21), m4(7, 52, 21), m4(7, 52, -25), m4(7, 52, 25)],
      false
    );
    const mx = -25, mz = 6;
    for (let i = 0; i < 3; i++) {
      const a = i * Math.PI * 2 / 3 + 0.5;
      H2.cyl(g, 0.09, 0.13, 0.35, M2.gold, mx + Math.cos(a) * 0.6, FL, mz + Math.sin(a) * 0.6, 8);
    }
    H2.lathe(g, [[0.85, 0], [0.8, 0.1], [0.45, 0.25], [0.25, 0.38], [0.16, 0.5]], M2.gold, mx, FL + 0.28, mz);
    H2.cyl(g, 0.08, 0.14, 2.35, M2.gold, mx, FL + 0.72, mz, 10);
    for (let i = 1; i <= 3; i++) {
      const br = new Mesh(new TorusGeometry(0.45 * i, 0.075, 8, 22, Math.PI), M2.gold);
      br.rotation.z = Math.PI;
      br.position.set(mx, FL + 3.07, mz);
      br.castShadow = br.receiveShadow = true;
      g.add(br);
    }
    const lampX = [-1.35, -0.9, -0.45, 0, 0.45, 0.9, 1.35];
    const cupG = new CylinderGeometry(0.14, 0.09, 0.16, 8);
    instMesh(g, cupG, M2.gold, lampX.map((dx) => m4(mx + dx, FL + 3.13, mz)), false);
    const flameG = new ConeGeometry(0.09, 0.34, 8);
    flameG.translate(0, 0.17, 0);
    const flameMat = new MeshBasicMaterial({ color: 16761438 });
    const flames = instMesh(g, flameG, flameMat, lampX.map((dx) => m4(mx + dx, FL + 3.2, mz)), false);
    const menorahLight = new PointLight(16760426, 16, 25, 2);
    menorahLight.position.set(mx, FL + 4.6, mz);
    g.add(menorahLight);
    ctx2.animated.push((t) => {
      for (let i = 0; i < 7; i++) {
        const s = 1 + 0.28 * Math.sin(t * 0.012 + i * 1.9) * Math.sin(t * 43e-4 + i);
        flames.setMatrixAt(i, m4(
          mx + lampX[i],
          FL + 3.2,
          mz,
          Math.sin(t * 9e-3 + i) * 0.1,
          0,
          Math.cos(t * 0.011 + i * 2) * 0.1,
          1,
          s,
          1
        ));
      }
      flames.instanceMatrix.needsUpdate = true;
      menorahLight.intensity = 15.5 + 2.2 * Math.sin(t * 0.011) + 1.3 * Math.sin(t * 0.029 + 1);
    });
    const sx = -25, sz = -6;
    for (const dx of [-0.85, 0.85]) for (const dz of [-0.38, 0.38])
      H2.box(g, 0.15, 1.33, 0.15, M2.gold, sx + dx, FL, sz + dz);
    H2.box(g, 2, 0.12, 1, M2.gold, sx, FL + 1.33, sz);
    H2.box(g, 0.08, 1.5, 1.05, M2.gold, sx - 0.99, FL + 1.45, sz);
    H2.box(g, 0.08, 1.5, 1.05, M2.gold, sx + 0.99, FL + 1.45, sz);
    const loafMat = M2.plaster.clone();
    loafMat.color = new Color(14268536);
    const loafG = new BoxGeometry(0.9, 0.2, 0.38);
    const loafMats = [];
    for (let i = 0; i < 6; i++) for (const dz of [-0.27, 0.27])
      loafMats.push(m4(sx, FL + 1.56 + i * 0.23, sz + dz, 0, i % 2 * 0.06));
    instMesh(g, loafG, loafMat, loafMats, false);
    H2.box(g, 1, 2, 1, M2.gold, -18, FL, 0);
    for (const dx of [-0.45, 0.45]) for (const dz of [-0.45, 0.45])
      H2.box(g, 0.16, 0.2, 0.16, M2.gold, -18 + dx, FL + 1.98, dz);
    const smokeMat = new MeshBasicMaterial({ color: 10133672, transparent: true, opacity: 0.22, depthWrite: false });
    const smoke = [];
    for (let i = 0; i < 2; i++) {
      const c = new Mesh(new ConeGeometry(0.26 + i * 0.14, 1.4 + i * 0.6, 8), smokeMat.clone());
      c.castShadow = c.receiveShadow = false;
      g.add(c);
      smoke.push(c);
    }
    ctx2.animated.push((t) => {
      smoke.forEach((c, i) => {
        const f = (t * 22e-5 + i * 0.5) % 1;
        c.position.set(-18 + Math.sin(t * 1e-3 + i * 2) * 0.15, FL + 2.3 + f * 3.2, Math.cos(t * 8e-4 + i) * 0.1);
        c.scale.setScalar(0.55 + f * 1.15);
        c.material.opacity = 0.26 * (1 - f);
      });
    });
    H2.box(g, 0.12, 39.9, 18.4, M2.parochet, -44.5, FL, -0.8);
    H2.box(g, 0.12, 39.9, 18.4, M2.parochet, -45.5, FL, 0.8);
    const rockMat = M2.stone.clone();
    rockMat.color = new Color(12167564);
    const rock = new Mesh(new DodecahedronGeometry(1.3, 0), rockMat);
    rock.scale.set(1, 0.28, 1.15);
    rock.rotation.y = 0.4;
    rock.position.set(-55.5, F + 0.3, 0);
    rock.castShadow = rock.receiveShadow = true;
    g.add(rock);
    const kodeshLight = new PointLight(16767392, 12, 50, 1.8);
    kodeshLight.position.set(-35, 42, 0);
    g.add(kodeshLight);
    ctx2.labels.push(
      { text: "\u05D4\u05D4\u05D9\u05DB\u05DC", x: -32.5, y: 130, z: 0, size: 8 },
      { text: "\u05D4\u05D0\u05D5\u05DC\u05DD", x: 7, y: 55, z: 0, size: 3.5 },
      { text: "\u05D4\u05E7\u05D5\u05D3\u05E9", x: -25, y: 45, z: 0, size: 3 },
      { text: "\u05E7\u05D5\u05D3\u05E9 \u05D4\u05E7\u05D3\u05E9\u05D9\u05DD", x: -55.5, y: 40, z: 0, size: 3 },
      { text: "\u05D4\u05DE\u05E0\u05D5\u05E8\u05D4", x: -25, y: 27.5, z: 6, size: 2.5 },
      { text: "\u05E9\u05D5\u05DC\u05D7\u05DF \u05DC\u05D7\u05DD \u05D4\u05E4\u05E0\u05D9\u05DD", x: -25, y: 26.5, z: -6, size: 2.5 },
      { text: "\u05DE\u05D6\u05D1\u05D7 \u05D4\u05D6\u05D4\u05D1", x: -18, y: 26.5, z: 0, size: 2.5 },
      { text: "\u05D4\u05D2\u05E4\u05DF \u05E9\u05DC \u05D6\u05D4\u05D1", x: 2.5, y: 46.5, z: 0, size: 2.5 },
      { text: "\u05D0\u05D1\u05DF \u05D4\u05E9\u05EA\u05D9\u05D9\u05D4", x: -55.5, y: 24.5, z: 0, size: 2.5 }
    );
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    Object.assign(ctx2.shared.flyPoints, {
      heichalFront: { pos: [130, 55, 45], target: [17, 60, 0] },
      ulam: { pos: [48, 38, 0], target: [5, 34, 0] },
      kodesh: { pos: [-6, 38, 0], target: [-30, 27, 0] },
      kodeshHakodashim: { pos: [-47.5, 36, 7], target: [-60, 24, -1] }
    });
    for (const m of cut) ctx2.cutaway.push(m);
  }

