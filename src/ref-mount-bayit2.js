  // plugin/js/mount.js
  async function build(ctx2) {
    const { M: M2, H: H2 } = ctx2;
    const g = new Group();
    g.name = "har-habayit";
    ctx2.root.add(g);
    const CX = (CO.harW + CO.harE) / 2;
    const CZ = (CO.harN + CO.harS) / 2;
    const T = 5;
    const WH = 27;
    const EH = 24; // Middot 2:4: eastern wall lower than all others (see DEV_NOTES.md)
    const GROUND_Y = -28;
    const M4 = new Matrix4();

    const sm = (a2, b2, x) => {
      const t = Math.min(1, Math.max(0, (x - a2) / (b2 - a2)));
      return t * t * (3 - 2 * t);
    };
    const vn = (x, z) => {
      const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
      const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
      const r = (i, j) => hash((ix + i) * 157.3 + (iz + j) * 113.9);
      return (r(0, 0) * (1 - u) + r(1, 0) * u) * (1 - v) + (r(0, 1) * (1 - u) + r(1, 1) * u) * v;
    };
    const fbm = (x, z) => vn(x, z) * 0.55 + vn(x * 2.1, z * 2.1) * 0.28 + vn(x * 4.3, z * 4.3) * 0.17;
    const bump = (x, z, cx, cz, rx, rz, amp) => amp * Math.exp(-(((x - cx) / rx) ** 2) - ((z - cz) / rz) ** 2);
    const rectDist = (x, z) => Math.hypot(Math.max(CO.harW - x, x - CO.harE, 0), Math.max(CO.harN - z, z - CO.harS, 0));
    const terrainH = (x, z) => {
      const d = rectDist(x, z);
      const ramp = sm(70, 380, d);
      let h = bump(x, z, 1100, 30, 460, 950, 190) + bump(x, z, -700, 620, 420, 330, 130) + bump(x, z, -560, -760, 460, 380, 100) + bump(x, z, 220, 1350, 560, 320, 130) + bump(x, z, 380, -1380, 620, 360, 120);
      h += (fbm(x * 3e-3, z * 3e-3) - 0.5) * 120 + (fbm(x * 0.012, z * 0.012) - 0.5) * 22;
      const rim = sm(1500, 2500, Math.hypot(x - CX, z - CZ)) * 260;
      return GROUND_Y + ramp * Math.max(h * 0.2, -5) + rim * 0.15 * ramp;
    };
    {
      const SIZE = 5200, SEG = 220;
      const geo = new PlaneGeometry(SIZE, SIZE, SEG, SEG);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) + CX, z = pos.getZ(i) + CZ, h = terrainH(x, z);
        pos.setXYZ(i, x, h, z);
        const k = 0.86 + fbm(x * 0.02, z * 0.02) * 0.2, up = sm(-20, 160, h - GROUND_Y);
        col[i * 3] = Math.min(1, k * (0.93 - up * 0.03));
        col[i * 3 + 1] = Math.min(1, k * (0.94 - up * 0.03));
        col[i * 3 + 2] = Math.min(1, k * (0.84 - up * 0.04));
      }
      geo.setAttribute("color", new BufferAttribute(col, 3));
      geo.attributes.uv.array.forEach((v, i, arr) => arr[i] = v * SIZE);
      geo.computeVertexNormals();
      const tm = M2.ground.clone();
      tm.vertexColors = true;
      tm.color.set(15527123);
      const terrain = new Mesh(geo, tm);
      terrain.receiveShadow = true;
      g.add(terrain);
    }
    H2.box(g, CO.HAR, 1.5, CO.HAR, M2.pave, CX, -1.5, CZ);
    const fndN = H2.occ(H2.box(g, 505, 30, T, M2.stone, CX, -30, CO.harN));
    const fndS = H2.occ(H2.box(g, 505, 30, T, M2.stone, CX, -30, CO.harS));
    const fndE = H2.occ(H2.box(g, T, 30, 495, M2.stone, CO.harE, -30, CZ));
    const fndW = H2.occ(H2.box(g, T, 30, 495, M2.stone, CO.harW, -30, CZ));
    const wallN = H2.wall(g, {
      axis: "x",
      length: 505,
      height: WH,
      thickness: T,
      mat: M2.stone,
      cx: CX,
      cz: CO.harN,
      y: 0,
      openings: [{ center: 55 - CX, width: 10, height: 20, gable: 4 }] // Tadi gate: 20x10 (+ an open triangular top 4 high between the two leaning stones, 1.0.19) like all gates there - Middot 2:3 ("כל הפתחים והשערים שהיו שם, גבהן עשרים אמה ורחבן עשר"), Rambam Beit HaBechira 5:2; only its lintel differs (two inclined stones)
    });
    const wallS = H2.wall(g, {
      axis: "x",
      length: 505,
      height: WH,
      thickness: T,
      mat: M2.stone,
      cx: CX,
      cz: CO.harS,
      y: 0,
      openings: [
        { center: 0 - CX, width: 10, height: 20 },
        { center: 110 - CX, width: 10, height: 20 }
      ] // 1.0.19: Har HaBayit gates are rectangular with a stone lintel (Middot 2:3), not arched
    });
    const wallE = H2.wall(g, {
      axis: "z",
      length: 495,
      height: EH,
      thickness: T,
      mat: M2.stone,
      cx: CO.harE,
      cz: CZ,
      y: 0,
      openings: [{ center: CZ, width: 10, height: 20 }] // 1.0.19: rectangular + stone lintel (Middot 2:3)
    });
    const wallW = H2.wall(g, {
      axis: "z",
      length: 495,
      height: WH,
      thickness: T,
      mat: M2.stone,
      cx: CO.harW,
      cz: CZ,
      y: 0,
      openings: [{ center: CZ, width: 10, height: 20 }] // 1.0.19: rectangular + stone lintel (Middot 2:3)
    });
    const corN = H2.occ(H2.box(g, 506, 1.3, 6.6, M2.stoneLight, CX, 25.36, CO.harN));
    const corS = H2.occ(H2.box(g, 506, 1.3, 6.6, M2.stoneLight, CX, 25.36, CO.harS));
    const corE = H2.occ(H2.box(g, 6.6, 1.3, 496, M2.stoneLight, CO.harE, 25.3 - (WH - EH), CZ));
    const corW = H2.occ(H2.box(g, 6.6, 1.3, 496, M2.stoneLight, CO.harW, 25.3, CZ));
    // the foundation (below ground) and the cornice fade together with their wall (they used to stay opaque, e.g. under the Shushan gate)
    fndN.userData.fadeWith = corN.userData.fadeWith = wallN;
    fndS.userData.fadeWith = corS.userData.fadeWith = wallS;
    fndE.userData.fadeWith = corE.userData.fadeWith = wallE;
    fndW.userData.fadeWith = corW.userData.fadeWith = wallW;
    const crenN = H2.crenellate(g, { x1: -149.5, z1: -169.5, x2: 355.5, z2: -169.5, y: WH, mat: M2.stoneLight });
    const crenS = H2.crenellate(g, { x1: -149.5, z1: 334.5, x2: 355.5, z2: 334.5, y: WH, mat: M2.stoneLight });
    const crenE = H2.crenellate(g, { x1: 355.1, z1: -165, x2: 355.1, z2: 330, y: EH, mat: M2.stoneLight });
    const crenW = H2.crenellate(g, { x1: -149.1, z1: -165, x2: -149.1, z2: 330, y: WH, mat: M2.stoneLight });
    crenN.userData.fadeWith = wallN;
    crenS.userData.fadeWith = wallS;
    crenE.userData.fadeWith = wallE;
    crenW.userData.fadeWith = wallW;
    const pil = [];
    for (let x = -135; x <= 340.1; x += 25) {
      if (Math.abs(x - 55) > 10) pil.push({ x, z: CO.harN - T / 2 - 0.35, r: 0, w: "N" });
      if (Math.abs(x) > 10 && Math.abs(x - 110) > 10) pil.push({ x, z: CO.harS + T / 2 + 0.35, r: 0, w: "S" });
    }
    for (let z = -150; z <= 325.1; z += 25) {
      if (Math.abs(z) > 10) {
        pil.push({ x: CO.harE + T / 2 + 0.35, z, r: Math.PI / 2, sy: 0.83, w: "E" });
        pil.push({ x: CO.harW - T / 2 - 0.35, z, r: Math.PI / 2, w: "W" });
      }
    }
    const pilGeo = H2.uvWorldBox(new BoxGeometry(2.6, 17.4, 1.1), 2.6, 17.4, 1.1);
    for (const [tag, wl] of [["N", wallN], ["S", wallS], ["E", wallE], ["W", wallW]]) {
      const list = pil.filter((p) => p.w === tag);
      if (!list.length) continue;
      const pilInst = new InstancedMesh(pilGeo, M2.stoneLight, list.length);
      list.forEach((p, i) => {
        M4.makeRotationY(p.r);
        if (p.sy) M4.scale(new Vector3(1, p.sy, 1));
        M4.setPosition(p.x, p.sy ? 8 + 17.4 * p.sy / 2 : 16.7, p.z);
        pilInst.setMatrixAt(i, M4);
      });
      pilInst.castShadow = pilInst.receiveShadow = true;
      g.add(pilInst);
      H2.occ(pilInst).userData.fadeWith = wl;
    }
    function gateTrim({ axis, gx, gz, arched = true, doorH = 15, doorMat = M2.cedar, inward = 1, wl = null }) {
      const tr = (m) => {
        if (wl) H2.occ(m).userData.fadeWith = wl;
        return m;
      };
      const jw = 1.8, jh = 21.8, jd = T + 1.6; // 1.0.19: jambs reach the top of the stone lintel
      if (axis === "x") {
        for (const s of [-1, 1]) tr(H2.box(g, jw, jh, jd, M2.stoneLight, gx + s * 5.9, 0, gz));
        if (arched) tr(H2.box(g, 13.6, 1.8, T + 1.2, M2.stoneLight, gx, 20, gz)); // flat stone lintel (shakuf) directly on the 20-amah opening
        tr(H2.box(g, 11.8, 0.18, T + 1.4, M2.stoneSmooth, gx, 0, gz));
      } else {
        for (const s of [-1, 1]) tr(H2.box(g, jd, jh, jw, M2.stoneLight, gx, 0, gz + s * 5.9));
        if (arched) tr(H2.box(g, T + 1.2, 1.8, 13.6, M2.stoneLight, gx, 20, gz)); // flat stone lintel (shakuf) directly on the 20-amah opening
        tr(H2.box(g, T + 1.4, 0.18, 11.8, M2.stoneSmooth, gx, 0, gz));
      }
      const pw = 4.8;
      for (const s of [-1, 1]) {
        const leaf = new Group();
        const ajar = s === 1 ? 0.38 : 0.2;
        if (axis === "x") {
          leaf.position.set(gx + s * 5, 0, gz);
          tr(H2.box(leaf, pw, doorH, 0.4, doorMat, -s * (pw / 2 + 0.05), 0, 0));
        } else {
          leaf.position.set(gx, 0, gz + s * 5);
          tr(H2.box(leaf, 0.4, doorH, pw, doorMat, 0, 0, -s * (pw / 2 + 0.05)));
        }
        leaf.rotation.y = s * ajar * inward;
        g.add(leaf);
      }
    }
    gateTrim({ axis: "z", gx: CO.harE, gz: 0, doorMat: M2.bronze, inward: 1, wl: wallE });
    for (const eb of [H2.box(g, 0.6, 1.7, 10, M2.stoneLight, CO.harE + 2.6, 20.5, 0), H2.box(g, 0.5, 1.4, 8.4, M2.stoneSmooth, CO.harE + 2.9, 20.65, 0), H2.box(g, 0.45, 1.0, 5, M2.marble, CO.harE + 3.1, 20.85, 0)]) H2.occ(eb).userData.fadeWith = wallE;
    gateTrim({ axis: "x", gx: 55, gz: CO.harN, arched: false, inward: 1, wl: wallN });
    for (const s of [-1, 1]) {
      // Middot 2:3: Tadi has no flat lintel but "two stones leaning on each other" (an inverted V).
      // 1.0.19: the triangle between them is OPEN (a gable-shaped hole in the wall, see wallN opening.gable);
      // each stone lies on its hole edge: inner face flush with the edge, from the jamb top (x=+-5, y=20) up to the apex (x=0, y=24).
      const GH = 4, TH = 1.0, ang = Math.atan2(GH, 5), edgeL = Math.hypot(5, GH);
      const stone = H2.box(g, edgeL + 0.6, TH, T + 1.2, M2.stoneLight, 0, 0, 0);
      H2.occ(stone).userData.fadeWith = wallN;
      stone.position.set(55 + s * (2.5 + Math.sin(ang) * TH / 2), 20 + GH / 2 + Math.cos(ang) * TH / 2, CO.harN);
      stone.rotation.z = -s * ang;
    }
    gateTrim({ axis: "x", gx: 0, gz: CO.harS, inward: -1, wl: wallS });
    gateTrim({ axis: "x", gx: 110, gz: CO.harS, inward: -1, wl: wallS });
    gateTrim({ axis: "z", gx: CO.harW, gz: 0, inward: -1, wl: wallW });
    const RUN = 36 * 0.8;
    H2.stairs(g, { width: 16, totalRise: 28, steps: 36, dir: "N", x: 0, y: GROUND_Y, z: CO.harS + T / 2 + RUN, tread: 0.8 });
    H2.stairs(g, { width: 16, totalRise: 28, steps: 36, dir: "N", x: 110, y: GROUND_Y, z: CO.harS + T / 2 + RUN, tread: 0.8 });
    H2.stairs(g, { width: 14, totalRise: 28, steps: 36, dir: "W", x: CO.harE + T / 2 + RUN, y: GROUND_Y, z: 0, tread: 0.8 });
    H2.stairs(g, { width: 12, totalRise: 28, steps: 36, dir: "S", x: 55, y: GROUND_Y, z: CO.harN - T / 2 - RUN, tread: 0.8 });
    H2.stairs(g, { width: 12, totalRise: 28, steps: 36, dir: "E", x: CO.harW - T / 2 - RUN, y: GROUND_Y, z: 0, tread: 0.8 });
    const colPos = [];
    const addRun = (axis, fixed, from, to, step, gaps) => {
      for (let v = from; v <= to + 0.01; v += step) {
        if (gaps.some((c) => Math.abs(v - c) < 9)) continue;
        colPos.push(axis === "x" ? { x: v, z: fixed } : { x: fixed, z: v });
      }
    };
    addRun("z", 346, -142, 277, 13, [0]);
    addRun("z", 336, -142, 277, 13, [0]);
    addRun("z", -140.5, -142, 277, 13, [0]);
    addRun("z", -130.5, -142, 277, 13, [0]);
    addRun("x", -160.5, -136, 326, 13.2, [55]);
    addRun("x", -150.5, -136, 326, 13.2, [55]);
    H2.colonnade(g, colPos, { height: 22, rShaft: 1.1, mat: M2.marble, style: "corinthian" });
    H2.box(g, 2.4, 1.6, 431, M2.stoneLight, 346, 22, 67.5);
    H2.box(g, 2.4, 1.6, 431, M2.stoneLight, 336, 22, 67.5);
    const roofE = H2.box(g, 17, 0.9, 431, M2.cedar, 342, 23.6, 67.5);
    H2.box(g, 2.4, 1.6, 431, M2.stoneLight, -140.5, 22, 67.5);
    H2.box(g, 2.4, 1.6, 431, M2.stoneLight, -130.5, 22, 67.5);
    const roofW = H2.box(g, 17, 0.9, 431, M2.cedar, -136, 23.6, 67.5);
    H2.box(g, 478, 1.6, 2.4, M2.stoneLight, 94.5, 22, -160.5);
    H2.box(g, 478, 1.6, 2.4, M2.stoneLight, 94.5, 22, -150.5);
    const roofN = H2.box(g, 478, 0.9, 17, M2.cedar, 94.5, 23.6, -156.5);
    const stoaRows = [288, 301, 314, 327];
    const stoaPos = [];
    for (const z of stoaRows)
      for (let x = -133; x <= 339; x += 12.3) stoaPos.push({ x, z });
    H2.colonnade(g, stoaPos, { height: 25, rShaft: 1.35, mat: M2.marble, style: "corinthian" });
    for (const z of stoaRows) H2.box(g, 486, 1.8, 2.8, M2.stoneLight, CX, 25, z);
    const aisleN = H2.box(g, 486, 1, 16, M2.cedar, CX, 26.8, 294.5);
    const aisleS = H2.box(g, 486, 1, 16, M2.cedar, CX, 26.8, 320.5);
    H2.box(g, 486, 9.5, 1.4, M2.plaster, CX, 26.8, 301);
    H2.box(g, 486, 9.5, 1.4, M2.plaster, CX, 26.8, 314);
    const naveRoof = H2.box(g, 490, 1.2, 16.5, M2.cedar, CX, 36.3, 307.5);
    for (const ex of [-140, 346]) {
      H2.wall(g, {
        axis: "z",
        length: 45,
        height: 26.8,
        thickness: 2.5,
        mat: M2.stoneLight,
        cx: ex,
        cz: 307.5,
        y: 0,
        openings: [
          { center: 0, width: 9, height: 16, arched: true },
          { center: 13, width: 7, height: 12, arched: true },
          { center: -13, width: 7, height: 12, arched: true }
        ]
      });
      H2.box(g, 2.5, 9.5, 15.5, M2.stoneLight, ex, 26.8, 307.5);
    }
    ctx2.cutaway.push(naveRoof, aisleN, aisleS, roofE, roofW, roofN);
    const sx1 = CO.azW - 12.5, sx2 = CO.eznE + 12.5;
    const sz1 = CO.azN - 12.5, sz2 = CO.azS + 12.5;
    const posts = [], postKeys = /* @__PURE__ */ new Set();
    const addPost = (x, z) => {
      const k = x.toFixed(1) + "|" + z.toFixed(1);
      if (!postKeys.has(k)) {
        postKeys.add(k);
        posts.push({ x, z });
      }
    };
    const soregSide = (axis, fixed, from, to, gaps) => {
      const runs = [];
      let a = from;
      for (const c of gaps.slice().sort((p, q) => p - q)) {
        runs.push([a, c - 2]);
        a = c + 2;
      }
      runs.push([a, to]);
      for (const [r0, r1] of runs) {
        const len = r1 - r0;
        if (len < 0.6) continue;
        const mid = (r0 + r1) / 2;
        if (axis === "x") H2.box(g, len, 1.7, 0.25, M2.lattice, mid, 0, fixed);
        else H2.box(g, 0.25, 1.7, len, M2.lattice, fixed, 0, mid);
        const n = Math.max(1, Math.round(len / 12));
        for (let i = 0; i <= n; i++) {
          const t = r0 + len * i / n;
          if (axis === "x") addPost(t, fixed);
          else addPost(fixed, t);
        }
      }
    };
    soregSide("x", sz1, sx1, sx2, [-40, 0, 40, 161]);
    soregSide("x", sz2, sx1, sx2, [-40, 0, 40, 161]);
    soregSide("z", sx2, sz1, sz2, [0]);
    soregSide("z", sx1, sz1, sz2, [0]);
    const postGeo = H2.uvWorldBox(new BoxGeometry(0.55, 2.05, 0.55), 0.55, 2.05, 0.55);
    const postInst = new InstancedMesh(postGeo, M2.stoneSmooth, posts.length);
    posts.forEach((p, i) => {
      M4.makeTranslation(p.x, 1.025, p.z);
      postInst.setMatrixAt(i, M4);
    });
    postInst.castShadow = postInst.receiveShadow = true;
    g.add(postInst);
    for (const z of [-26, 8, 34]) H2.box(g, 0.5, 2.2, 1.1, M2.marble, 243.1, 0, z);
    ctx2.labels.push(
      { text: "\u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA", x: CX, y: 55, z: 210, size: 8 },
      { text: "\u05E9\u05E2\u05E8 \u05E9\u05D5\u05E9\u05DF", x: 362, y: 30, z: 0, size: 5 },
      { text: "\u05E9\u05E2\u05E8 \u05D8\u05D3\u05D9", x: 55, y: 30, z: -176, size: 5 },
      { text: "\u05E9\u05E2\u05E8\u05D9 \u05D7\u05D5\u05DC\u05D3\u05D4", x: 55, y: 30, z: 341, size: 5 },
      { text: "\u05E9\u05E2\u05E8 \u05E7\u05D9\u05E4\u05D5\u05E0\u05D5\u05E1", x: -156, y: 30, z: 0, size: 5 },
      { text: "\u05D4\u05E1\u05D8\u05D9\u05D5 \u05D4\u05DE\u05DC\u05DB\u05D5\u05EA\u05D9", x: CX, y: 46, z: 307, size: 6 },
      { text: "\u05D4\u05E1\u05D5\u05E8\u05D2", x: 246, y: 6, z: 14, size: 4 }
    );
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    Object.assign(ctx2.shared.flyPoints, {
      harHabayit: { pos: [720, 320, 520], target: [100, 10, 80] },
      shushanGate: { pos: [500, 35, 0], target: [353, 15, 0] },
      royalStoa: { pos: [100, 60, 480], target: [100, 20, 310] }
    });
  }

