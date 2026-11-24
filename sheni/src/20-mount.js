  // plugin/js/mount.js
  //@@include rose-garden
  async function build(ctx2) {
    const { M: M2, H: H2 } = ctx2;
    const g = new Group();
    g.name = "har-habayit";
    ctx2.root.add(g);
    const CX = (CO.harW + CO.harE) / 2;
    const CZ = (CO.harN + CO.harS) / 2;
    const T = 5;
    const WH = 27;
    // (1.9.1: the eastern wall's height is per reading - see ctx2.shared.eastWall below; until 1.9.0 one height, 24)
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
    // TERRAIN_211 (the user, 14.11.2026: "רק כבש1 כהצעה 1" - one ramp, the Parah's, and the mountain's shape): the mount stands on its
    // ridge - the ground falls away from the walls' feet (level for 35 amot, where the stairs stand) into the Kidron on the east (its bed
    // some 150 amot east of the wall, 32 lower), down the slope on the south and into the valley on the west; on the north the ridge goes
    // on level. The depths, widths and places - model choices (no source gives them). Until 2.0.1 the ground lay level round the mount.
    const valley = (x, z) => {
      let v = 0;
      if (x > CO.harE) v += 32 * Math.exp(-((((x - CO.harE) - 150) / 85) ** 2));   // (the Parah ramp's lowest row goes down to 34 under the wall's foot)
      if (z > CO.harS) v += 30 * Math.exp(-((((z - CO.harS) - 200) / 140) ** 2));
      if (x < CO.harW) v += 24 * Math.exp(-((((CO.harW - x) - 110) / 70) ** 2));
      return v;
    };
    const terrainH0 = (x, z) => {
      const d = rectDist(x, z);
      const ramp = sm(70, 380, d);
      let h = bump(x, z, 1100, 30, 460, 950, 190) + bump(x, z, -700, 620, 420, 330, 130) + bump(x, z, -560, -760, 460, 380, 100) + bump(x, z, 220, 1350, 560, 320, 130) + bump(x, z, 380, -1380, 620, 360, 120);
      h += (fbm(x * 3e-3, z * 3e-3) - 0.5) * 120 + (fbm(x * 0.012, z * 0.012) - 0.5) * 22;
      const rim = sm(1500, 2500, Math.hypot(x - CX, z - CZ)) * 260;
      return GROUND_Y + ramp * Math.max(h * 0.2, -5) + rim * 0.15 * ramp - sm(35, 100, d) * valley(x, z);
    };
    // OLIVES_B2 (fix-b2, 22.11.2026 - the user's decision 17: "הר המשחה וקו הראייה — רק בבית שני"): THE MOUNT OF OLIVES east of the Kidron.
    // Middot 2:4 (89:15): "כל הכתלים שהיו שם היו גבוהים, חוץ מכותל המזרחי, שהכהן השורף את הפרה עומד בראש הר המשחה, ומתכוון ורואה בפתחו
    // של היכל בשעת הזית הדם"; the Rambam, Beit HaBechirah 6:5 (337:98): "...ומפני זה עשו כתל שעל גבי שער זה נמוך. כדי שיהא כהן העומד בהר
    // המשחה רואה פתח ההיכל בשעה שמזה מדם הפרה נכח ההיכל". A hill whose top (OLV.x, 0) is OLV.top over the Mount's floor: as high as it may be
    // while the eye of one standing on it still sees the heichal's door through the gate of the women's court (its east wall high, 34 -
    // 30-courts.js) and over the low wall above the Shushan gate. Its height, its place and its form - model choices; the real mountain
    // is much higher and farther (the model's ground is drawn small - TERRAIN_211).
    const OLV = { x: 1150, z: 0, rx: 380, rz: 650, top: 35 };
    OLV.amp = OLV.top - terrainH0(OLV.x, OLV.z);
    const terrainH = (x, z) => terrainH0(x, z) + sm(CO.harE, CO.harE + 120, x) * OLV.amp * Math.exp(-(((x - OLV.x) / OLV.rx) ** 2) - (((z - OLV.z) / OLV.rz) ** 2));
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
      tm_terrainRaycast(terrain, SEG, SEG);
      terrain.receiveShadow = true;
      g.add(terrain);
    }
    // MESIBAH_303: the mount's floor in four pieces round the mouth of the way down to the bath (30-courts.js: the stair's shaft under
    // Beit HaMoked's north-west chamber, x -30..-26.5, z -75..-71.5); each piece's texture as the whole floor's
    {
      const hx0 = -30, hx1 = -26.5, hz0 = -75, hz1 = -71.5, h5 = CO.HAR / 2, x0 = CX - h5, x1 = CX + h5, z0 = CZ - h5, z1 = CZ + h5;
      for (const [a, b, c, d] of [[x0, hx0, z0, z1], [hx1, x1, z0, z1], [hx0, hx1, z0, hz0], [hx0, hx1, hz1, z1]]) {
        const m = H2.box(g, b - a, 1.5, d - c, M2.pave, (a + b) / 2, -1.5, (c + d) / 2);
        const p = m.geometry.attributes.position, n = m.geometry.attributes.normal, uv = m.geometry.attributes.uv, o = m.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i) + o.x, y = p.getY(i) + o.y, z = p.getZ(i) + o.z, nx = n.getX(i), ny = n.getY(i), nz = n.getZ(i);
          if (nx > 0.5) uv.setXY(i, z1 - z, y + 1.5); else if (nx < -0.5) uv.setXY(i, z - z0, y + 1.5);
          else if (ny > 0.5) uv.setXY(i, x - x0, z1 - z); else if (ny < -0.5) uv.setXY(i, x - x0, z - z0);
          else if (nz > 0.5) uv.setXY(i, x - x0, y + 1.5); else uv.setXY(i, x1 - x, y + 1.5);
        }
        uv.needsUpdate = true;
      }
    }
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
    // 1.9.1 (the user: "הכונה לכותל שנמצא מעל שער שושן ותעשה את שיטת הרמבם תפאי פסקי תוס"): THE LOW EASTERN WALL (Middot 2:4 "כל
    // הכתלים שהיו שם היו גבוהים, חוץ מכותל המזרחי") is the Mount's eastern wall, over the Shushan gate - Rashi (Yoma 16a), the Bartenura
    // and the Rambam (Beit HaBechirah 6:5 and his commentary); until 1.9.0 the women's court's east wall was the low one (no source was found
    // for that; it is high again - 30-courts.js). Four drawn readings (ctx2.shared.eastWall.set, the opinions table):
    //  "rambam" (default) - the wall high (27) and only the wall over the gate low: a span of 20 over the gate, its top 23 (model choice);
    //  "tiferet" - Tiferet Yisrael (Yachin 2:34): the whole eastern wall "only a little more than twenty" - 23 along its length;
    //  "piskei" - Piskei Tosafot (Middot 8) as written, "כותל מזרחי גבוה שש אמות" (so the Rashash read it): the whole wall 6, the gate a
    //    gatehouse 20 wide, 23 high (model choice, so that the gate does not hang in the air);
    //  "chok" - the Chok Natan's reading of the Piskei Tosafot: six amot over the gate, along the whole east - 26.
    // Ezekiel's measures are NOT a source here (the user: Ezekiel is the Third Temple). Every piece is an occluder; the gate's trim, the
    // emblem, the foundation and the pilasters follow the active reading's gate piece (userData.fadeWith, switched in set()).
    //  "shemaya" (1.9.1, the user: "ר' שמעיה צייר") - Rabbenu Shemaya: the low wall is the chel's eastern wall, about ten amot (drawn on
    //    the women's court's east wall line - 30-courts.js, ctx2.shared.eznEastWall); the Mount's wall stays high, 27.
    const ewG = { rambam: new Group(), tiferet: new Group(), piskei: new Group(), chok: new Group(), shemaya: new Group() };
    const ewGate = {};
    for (const k of Object.keys(ewG)) { ewG[k].visible = k === "rambam"; g.add(ewG[k]); }
    const ewPiece = (k, z0, z1, h, gate) => {
      const len = z1 - z0, cz = (z0 + z1) / 2;
      const w = H2.wall(ewG[k], { axis: "z", length: len, height: h, thickness: T, mat: M2.stone, cx: CO.harE, cz, y: 0,
        openings: gate ? [{ center: cz, width: 10, height: 20 }] : [] });   // the opening at world z 0 (a z wall's local x = cz - z)
      const cor = H2.occ(H2.box(ewG[k], 6.6, 1.3, len + 1, M2.stoneLight, CO.harE, h - 1.64, cz));
      cor.userData.fadeWith = w;
      const cr = H2.crenellate(ewG[k], { x1: CO.harE + 0.1, z1: z0 + 1, x2: CO.harE + 0.1, z2: z1 - 1, y: h, mat: M2.stoneLight });
      cr.userData.fadeWith = w;
      if (gate) ewGate[k] = w;
      return w;
    };
    ewPiece("rambam", -165, -10, WH); ewPiece("rambam", 10, 330, WH); ewPiece("rambam", -10, 10, 23, true);
    ewPiece("tiferet", -165, 330, 23, true);
    ewPiece("piskei", -165, -10, 6); ewPiece("piskei", 10, 330, 6); ewPiece("piskei", -10, 10, 23, true);
    ewPiece("chok", -165, 330, 26, true);
    ewPiece("shemaya", -165, 330, WH, true);
    const wallE = ewGate.rambam;   // the reference the gate's trim etc. are built with; switched in ctx2.shared.eastWall.set
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.ewRambam = ewG.rambam;
    ctx2.layers.ewTiferet = ewG.tiferet;
    ctx2.layers.ewPiskei = ewG.piskei;
    ctx2.layers.ewChok = ewG.chok;
    ctx2.layers.ewShemaya = ewG.shemaya;
    // EW_EZEKIEL_B2 (fix-b2, 22.11.2026 - the user's decision 72 (ד)): the six amot again, as a reading of its own in the name of Ezekiel (40:5,
    // 14:1058: "והנה חומה מחוץ לבית סביב סביב וביד האיש קנה המדה שש אמות באמה וטפח... וקומה קנה אחד") - drawn as the Piskei Tosafot's
    // (the wall six amot high, the gate a gatehouse); two layers that only tell the labels which of the two is meant
    const ewPL = new Group(), ewEL = new Group(); ewEL.visible = false;
    ctx2.layers.ewPiskeiL = ewPL; ctx2.layers.ewEzekielL = ewEL;
    ctx2.labels.push(
      { text: "הכותל שעל גבי שער שושן נמוך — הרמב״ם", x: CO.harE + 6, y: 31, z: 22, size: 2.2, layer: "ewRambam" },
      { text: "כל כותל המזרח מעט יותר מעשרים — תפארת ישראל", x: CO.harE + 6, y: 27, z: 40, size: 2.2, layer: "ewTiferet" },
      { text: "כותל מזרחי גבוה שש אמות — פסקי תוספות", x: CO.harE + 6, y: 10, z: 40, size: 2.2, layers: ["ewPiskei", "ewPiskeiL"] },
      { text: "חומה — קנה אחד, שש אמות (יחזקאל מ, ה) — בשם יחזקאל", x: CO.harE + 6, y: 10, z: 40, size: 2.2, layers: ["ewPiskei", "ewEzekielL"] },
      { text: "שש אמות מעל השער — פסקי תוספות לחק נתן", x: CO.harE + 6, y: 30, z: 40, size: 2.2, layer: "ewChok" }
    );
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
    const corW = H2.occ(H2.box(g, 6.6, 1.3, 496, M2.stoneLight, CO.harW, 25.3, CZ));
    // the foundation (below ground) and the cornice fade together with their wall (they used to stay opaque, e.g. under the Shushan gate)
    fndN.userData.fadeWith = corN.userData.fadeWith = wallN;
    fndS.userData.fadeWith = corS.userData.fadeWith = wallS;
    fndE.userData.fadeWith = wallE;
    fndW.userData.fadeWith = corW.userData.fadeWith = wallW;
    const crenN = H2.crenellate(g, { x1: -149.5, z1: -169.5, x2: 355.5, z2: -169.5, y: WH, mat: M2.stoneLight });
    const crenS = H2.crenellate(g, { x1: -149.5, z1: 334.5, x2: 355.5, z2: 334.5, y: WH, mat: M2.stoneLight });
    const crenW = H2.crenellate(g, { x1: -149.1, z1: -165, x2: -149.1, z2: 330, y: WH, mat: M2.stoneLight });
    crenN.userData.fadeWith = wallN;
    crenS.userData.fadeWith = wallS;
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
    let pilE = null;
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
      if (tag === "E") pilE = pilInst;   // 1.9.1: hidden in the six-amot reading
    }
    function gateTrim({ axis, gx, gz, arched = true, doorH = 15, doorMat = M2.cedar, inward = 1, wl = null, leaves = true, sillCut = 0 }) {
      const tr = (m) => {
        if (wl) H2.occ(m).userData.fadeWith = wl;
        return m;
      };
      const jw = 1.8, jh = 21.8, jd = T + 1.6; // 1.0.19: jambs reach the top of the stone lintel
      if (axis === "x") {
        for (const s of [-1, 1]) tr(H2.box(g, jw, jh, jd, M2.stoneLight, gx + s * 5.9, 0, gz));
        if (arched) tr(H2.box(g, 13.6, 1.8, T + 1.2, M2.stoneLight, gx, 20, gz)); // flat stone lintel (shakuf) directly on the 20-amah opening
        tr(H2.box(g, 11.8, 0.18, T + 1.4 - (sillCut ? 0.7 : 0), M2.stoneSmooth, gx, 0, gz - sillCut * 0.35));   // CHULDA_LEAVES_G: sillCut - the sill ends at the wall's face on that side (a ramp begins there)
      } else {
        for (const s of [-1, 1]) tr(H2.box(g, jd, jh, jw, M2.stoneLight, gx, 0, gz + s * 5.9));
        if (arched) tr(H2.box(g, T + 1.2, 1.8, 13.6, M2.stoneLight, gx, 20, gz)); // flat stone lintel (shakuf) directly on the 20-amah opening
        tr(H2.box(g, T + 1.4, 0.18, 11.8, M2.stoneSmooth, gx, 0, gz));
      }
      const pw = 4.8;
      for (const s of leaves ? [-1, 1] : []) {   // 1.9.5: Tadi has its own leaves (tadiLeaves, below) - the two upright cedar ones stood before them
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
    // 1.9.1: the readings' switch - whatever was built to fade with the gate piece (the trim, the emblem, the foundation, the pilasters)
    // follows the active reading's gate piece
    {
      const followers = [];
      g.traverse((o) => { if (o.userData && o.userData.fadeWith === wallE && !ewG.rambam.children.includes(o)) followers.push(o); });
      ctx2.shared.eastWall = {
        mode: "rambam",
        set(m) {
          this.mode = ["tiferet", "piskei", "chok", "shemaya", "ezekiel"].includes(m) ? m : "rambam";
          const dm = this.mode === "ezekiel" ? "piskei" : this.mode;   // EW_EZEKIEL_B2: drawn as the Piskei Tosafot's
          for (const k of Object.keys(ewG)) ewG[k].visible = k === dm;
          ewPL.visible = this.mode === "piskei"; ewEL.visible = this.mode === "ezekiel";
          for (const o of followers) o.userData.fadeWith = ewGate[dm];
          if (pilE) pilE.visible = dm !== "piskei";
          if (typeof ctx2.shared.eznEastWall === "function") ctx2.shared.eznEastWall(this.mode === "shemaya");
        }
      };
    }
    gateTrim({ axis: "x", gx: 55, gz: CO.harN, arched: false, inward: 1, wl: wallN, leaves: false });
    // TADI_ONE_S1 (the user's decision on scan 1, finding 17: "להוריד את האפשרות 'אבנים זקופות — לא מאומת'"): Tadi's top in the one
    // reading that has a source - "שתי אבנים מטות זו על גב זו" (Middot 2:3). Until now (1.5.0) a toggle also drew "אבנים זקופות" (the
    // Ra'aviah's, in Tosafot Yom Tov on 1:3), two upright stones beside the opening's top, marked unverified; the toggle, its stones and its
    // label are gone. (The Ra'aviah's words stay in the cards, as a source.)
    const tadiM = new Group();
    g.add(tadiM);
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.tadiMutot = tadiM;
    for (const s of [-1, 1]) {
      // Middot 2:3: Tadi has no flat lintel but "two stones leaning on each other" (an inverted V).
      // 1.0.19: the triangle between them is OPEN (a gable-shaped hole in the wall, see wallN opening.gable);
      // each stone lies on its hole edge: inner face flush with the edge, from the jamb top (x=+-5, y=20) up to the apex (x=0, y=24).
      const GH = 4, TH = 1.0, ang = Math.atan2(GH, 5), edgeL = Math.hypot(5, GH);
      const stone = H2.box(tadiM, edgeL + 0.6, TH, T + 1.2, M2.stoneLight, 0, 0, 0);
      H2.occ(stone).userData.fadeWith = wallN;
      stone.position.set(55 + s * (2.5 + Math.sin(ang) * TH / 2), 20 + GH / 2 + Math.cos(ang) * TH / 2, CO.harN);
      stone.rotation.z = -s * ang;
    }
    // CHULDA_LEAVES_G (fix-g, 23.11.2026): the two gates of Chulda have their gold leaves (1.5.0, H2.doors below, open into the Mount) - the old
    // cedar pair of the trim stood almost shut inside the same opening, across the way (the processions of the libation and of the first fruits
    // walked through them); left out, as Tadi's. And their sill no longer runs on over the ramp's head (it stood 0.4-0.6 over the ramp there, a
    // step down in the air): it ends at the wall's outer face, where the ramp begins
    gateTrim({ axis: "x", gx: 0, gz: CO.harS, inward: -1, wl: wallS, leaves: false, sillCut: 1 });
    gateTrim({ axis: "x", gx: 110, gz: CO.harS, inward: -1, wl: wallS, leaves: false, sillCut: 1 });
    gateTrim({ axis: "z", gx: CO.harW, gz: 0, inward: -1, wl: wallW });
    const RUN = 36 * 0.8;
    // CHULDA_RAMPS_B2 (fix-b2, 22.11.2026 - the user's decision 103: "שערי חולדה — כבש משופע תמיד, במקום מדרגות"; Chalamish, "אלחנן וחיים
    // שמחים בירושלים" pp. 12, 14: "התהלוכה יורדת בכבש הדרומי של הר הבית"): before each gate of Chulda a sloping ramp, 16 wide, from the
    // gate's sill (y 0, the wall's outer face) down at one in two to where it meets the ground (found on the terrain; the ground falls
    // away toward the valley); a solid body of stone under it and a low parapet on both its sides. Until 22.11.2026: 36 steps with
    // railings. The slope, the width and the parapet - model choices. ctx2.shared.chuldaRamp = { xs, z0, zf, yf, w, yAt(z) }
    {
      const Z0 = CO.harS + T / 2, SL = 0.5, RW = 16;
      let zf = Z0 + 40;
      for (let z = Z0 + 10; z < Z0 + 160; z += 0.5) { const yr = -(z - Z0) * SL; if (yr <= Math.max(terrainH(0, z), terrainH(110, z)) + 0.05) { zf = z; break; } }
      const yf = -(zf - Z0) * SL, L = zf - Z0;
      const M = new Matrix4();
      const body = (x0, prof, w, xc) => {   // a profile in (along, y) extruded across x, w wide, centred on xc
        const sh = new Shape(); prof.forEach(([a, y], i) => (i ? sh.lineTo(a, y) : sh.moveTo(a, y))); sh.closePath();
        const geo = new ExtrudeGeometry(sh, { depth: w, bevelEnabled: false });
        M.set(0, 0, -1, xc + w / 2, 0, 1, 0, 0, 1, 0, 0, Z0, 0, 0, 0, 1);
        geo.applyMatrix4(M);
        return geo;
      };
      const yb = yf - 12;
      for (const x0 of [0, 110]) {
        const rb = new Mesh(body(x0, [[0, 0], [L, yf], [L, yb], [0, yb]], RW, x0), M2.pave || M2.stoneLight);
        rb.castShadow = rb.receiveShadow = true; rb.name = "chuldaRamp"; g.add(rb);
        for (const sd of [-1, 1]) {
          const pk = new Mesh(body(x0, [[0, 0], [L, yf], [L, yf + 1.2], [0, 1.2]], 0.5, x0 + sd * (RW / 2 - 0.25)), M2.stoneLight);
          pk.castShadow = true; g.add(pk);
        }
      }
      ctx2.shared.chuldaRamp = { xs: [0, 110], z0: Z0, zf, yf, w: RW, yAt: (z) => -(Math.min(zf, Math.max(Z0, z)) - Z0) * SL };
    }
    // (1.9.5: no steps at the Shushan gate - the ramp of the Parah, below)
    H2.stairs(g, { width: 12, totalRise: 28, steps: 36, dir: "S", x: 55, y: GROUND_Y, z: CO.harN - T / 2 - RUN, tread: 0.8 });
    H2.stairs(g, { width: 12, totalRise: 28, steps: 36, dir: "E", x: CO.harW - T / 2 - RUN, y: GROUND_Y, z: 0, tread: 0.8 });
    // 1.9.1 (the user: "מדרגות — להשאיר, להוסיף מעקה"): a railing on both sides of each of the five outer stairs - posts on every fourth
    // step and a sloped handrail two amot over the steps. The stairs and their railings are a model choice (the Mishnah gives the gates of
    // the Mount, not the way up to them); the cards say so
    {
      const railMat = M2.stoneSmooth || M2.marble;
      const rise = 28 / 36, tread = 0.8;
      const rail = (width, dir, x, z) => {
        const grp = new Group();
        for (const sz of [-1, 1]) {
          const lz = sz * (width / 2 - 0.25);
          for (let i = 0; i <= 36; i += 4) { const k = Math.min(i, 35); H2.box(grp, 0.3, 2, 0.3, railMat, k * tread + tread / 2, (k + 1) * rise, lz); }
          const x0 = tread / 2, x1 = 35 * tread + tread / 2, y0 = rise + 2, y1 = 36 * rise + 2;
          const bar = new Mesh(new BoxGeometry(Math.hypot(x1 - x0, y1 - y0), 0.25, 0.35), railMat);
          bar.position.set((x0 + x1) / 2, (y0 + y1) / 2, lz);
          bar.rotation.z = Math.atan2(y1 - y0, x1 - x0);
          bar.castShadow = true;
          grp.add(bar);
        }
        grp.rotation.y = { W: Math.PI, E: 0, N: Math.PI / 2, S: -Math.PI / 2 }[dir];
        grp.position.set(x, GROUND_Y, z);
        g.add(grp);
        H2.instancify(grp);   // 1.9.2: the posts - one draw per railing (they were 110 pieces)
      };
      rail(12, "S", 55, CO.harN - T / 2 - RUN);
      rail(12, "E", CO.harW - T / 2 - RUN, 0);
    }
    // 1.9.5 (a remark sent on to the user, 11.11.2026: "בשער שושן לא הי' מדרגות אלא כבש להר הזיתים לשחיטת פרה ולשעיר המשתלח"; the user:
    // "אפשרות א" - a ramp instead of the steps): THE RAMP OF THE PARAH. Parah 3:6 (book 94, line 18): "וכבש היו עושים מהר הבית להר
    // המשחה, כפין על גבי כפין, וכפה כנגד האטם, מפני קבר התהום"; Middot 1:3: "שער המזרחי... שבו כהן גדול השורף את הפרה ופרה וכל
    // מסעדיה יוצאים להר המשחה"; the Rambam, Parah Adumah 3:1 (372, line 28): "וכבש היו עושין מהר הבית להר המשחה ותחתיו בנוי כפין
    // כפין וכפה על כל שני כפין כדי שיהיו שני רגלי הכפה על גג שני כפין שתחתיה. כדי שתהיה תחת הכל חלול מפני קבר התהום"; the
    // Bartenura (632, line 103): "רגלי הכפה שהכפה נשענת עליהם נקראין אטם. ואין רגלי הכפה העליונה כנגד רגלי התחתונה, אלא כנגד הכפה
    // עצמה, דכנגד אטם העליונה עומד חלל התחתונה". So: out of the Shushan gate eastward, a paved way on two rows of arches - every
    // pier of the upper row stands over the hollow of a lower arch, and every upper arch over a lower pier. It is drawn for 150 amot
    // only (the Mount of Olives is not built), level with the gate's sill, ten amot wide as the gate, a low kerb on both its sides.
    // Its height, width and length and the arches' measures - model choices. The 36 steps of 1.0 and their railing are gone here.
    {
      // OLIVES_B2: the ramp goes on over the Kidron until it meets the Mount of Olives' slope ("וכבש היו עושים מהר הבית להר המשחה");
      // until now it was drawn for 150 amot only
      let LEN = 150;
      for (let x = CO.harE + 160; x < OLV.x; x += 2) if (terrainH(x, 0) > -1.2) { LEN = Math.ceil(x - (CO.harE + T / 2)) + 6; break; }
      const X0 = CO.harE + T / 2, WID = 10, BAY = 10, PIER = 3, YB = GROUND_Y - 2.5, YM = GROUND_Y + 14, YD = -1;
      const cw = new Group();
      cw.name = "parahRamp";
      g.add(cw);
      const R = (BAY - PIER) / 2;
      const tier = (y0, y1, c0, floor) => {   // a wall 0..LEN long, y0..y1, an arched hollow on every centre c0, c0 + BAY, ...
        const sh = new Shape();
        sh.moveTo(0, y0); sh.lineTo(LEN, y0); sh.lineTo(LEN, y1); sh.lineTo(0, y1); sh.closePath();
        const spring = y1 - 1.5 - R;
        for (let c = c0; c + R < LEN - 0.5; c += BAY) {
          const h = new Path();
          h.moveTo(c - R, floor); h.lineTo(c + R, floor); h.lineTo(c + R, spring);
          h.absarc(c, spring, R, 0, Math.PI, false);
          h.lineTo(c - R, floor);
          sh.holes.push(h);
        }
        const geo = new ExtrudeGeometry(sh, { depth: WID, bevelEnabled: false, curveSegments: 14 });
        const m = new Mesh(geo, M2.stone);
        m.position.set(X0, 0, -WID / 2);
        m.castShadow = m.receiveShadow = true;
        cw.add(m);
        return m;
      };
      // TERRAIN_211: the ground now falls away eastward under the ramp (into the Kidron) - a third row of arches below, from 34 under the
      // ground's level by the wall (hidden there) to the lower row's foot; its hollows on 10, 20, ... - under the lower row's piers
      tier(GROUND_Y - 34, YB, BAY, GROUND_Y - 33.6);
      tier(YB, YM, BAY / 2, YB + 0.4);          // the lower row: hollows on 5, 15, ... 145 (their floors under the ground by the wall)
      tier(YM, YD, BAY, YM + 0.03);             // the upper row: hollows on 10, 20, ... 140 - over the lower piers; its piers over the lower hollows
      H2.box(cw, LEN, 1, WID, M2.pave, X0 + LEN / 2, YD, 0);                                            // the way itself, its top level with the gate's sill
      for (const sz of [-1, 1]) H2.box(cw, LEN, 1, 0.5, M2.stoneSmooth, X0 + LEN / 2, 0, sz * (WID / 2 - 0.25));   // a low kerb
      ctx2.labels.push(
        { text: "כבש הפרה — כיפין על גבי כיפין, וכיפה כנגד האוטם (פרה ג, ו)", x: X0 + 55, y: 7, z: 0, size: 2.6, layer: "parahKippin" },
        { text: "הכבש מגיע אל הר המשחה", x: X0 + LEN - 6, y: 4.5, z: 0, size: 2, layer: "parahKippin" });
      OLV.rampEnd = X0 + LEN;
      // PARAH_PILLARS_D (fix-d, 22.11.2026 - the user's decision 135 ב): TWO READINGS of the way to the Mount of Anointing (the row
      // "כבש הפרה"; ctx2.shared.parahRamp.set("kippin" | "pillars")). The default - the Mishnah's ramp of arches over arches, above. And
      // Rabbi Eliezer in the Tosefta (Parah 3:5, book 230 line 18): "ר"א אומר לא היה שם כבש אלא עמודים של שיש היו וכלונסאות של ארז על
      // גביהן והפרה לא היתה צריכה לצאת בכבש" - marble pillars in two rows, ten amot apart along the way, from the ground up, cedar beams
      // along each row on their heads and cedar logs laid across them, side by side, the walking floor at the gate's sill (as the
      // ramp's). The pillars' spacing and thickness, the beams and logs - model choices.
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.parahKippin = cw;
      const pw = new Group();
      pw.name = "parahPillars";
      pw.visible = false;
      g.add(pw);
      ctx2.layers.parahPillars = pw;
      {
        const LOG_R = 0.45, BEAM_H = 1, Y_LOG = -LOG_R, Y_BEAM = Y_LOG - LOG_R - BEAM_H, ZS = [-(WID / 2 - 1), WID / 2 - 1];
        const cols = [];
        for (let dx = 4; dx < LEN - 1; dx += 10) for (const z of ZS) cols.push([X0 + dx, z, terrainH(X0 + dx, z)]);
        const colGeo = new CylinderGeometry(1.0, 1.1, 1, 18);
        const colInst = new InstancedMesh(colGeo, M2.marble, cols.length);
        cols.forEach(([x, z, y0], i) => {
          const h = Math.max(0.5, Y_BEAM - y0);
          M4.makeScale(1, h, 1).setPosition(x, y0 + h / 2, z);
          colInst.setMatrixAt(i, M4);
        });
        colInst.castShadow = colInst.receiveShadow = true;
        pw.add(colInst);
        for (const z of ZS) H2.box(pw, LEN, BEAM_H, 1.1, M2.cedar, X0 + LEN / 2, Y_BEAM, z);   // the cedar beams on the pillars' heads
        const nLog = Math.floor((LEN - 0.2) / (2 * LOG_R + 0.04));
        const logGeo = new CylinderGeometry(LOG_R, LOG_R, WID, 10);
        const logInst = new InstancedMesh(logGeo, M2.cedar, nLog);
        for (let i = 0; i < nLog; i++) {
          M4.makeRotationX(Math.PI / 2).setPosition(X0 + 0.1 + LOG_R + i * (2 * LOG_R + 0.04), Y_LOG, 0);
          logInst.setMatrixAt(i, M4);
        }
        logInst.castShadow = logInst.receiveShadow = true;
        pw.add(logInst);
        ctx2.labels.push(
          { text: "רבי אליעזר: לא היה שם כבש אלא עמודים של שיש וכלונסאות של ארז על גביהן (תוספתא פרה ג, ה)", x: X0 + 55, y: 7, z: 0, size: 2.4, layer: "parahPillars" },
          { text: "הדרך מגיעה אל הר המשחה", x: X0 + LEN - 6, y: 4.5, z: 0, size: 2, layer: "parahPillars" });
      }
      ctx2.shared.parahRamp = {
        mode: "kippin",
        set(m) {
          this.mode = m === "pillars" ? "pillars" : "kippin";
          cw.visible = this.mode === "kippin";
          pw.visible = this.mode === "pillars";
          if (ctx2.requestRender) ctx2.requestRender();
          return this.mode;
        }
      };
    }
    // OLIVES_B2: THE LINE OF SIGHT - the priest on the Mount of Olives' top, his face to the heichal, and the line from his eye to its door
    // (a feature of the place "הר המשחה — קו הראייה", untimed; while it is shown the parochot of the openings are raised - Nikanor's, the
    // ulam's and the heichal's would stand in the line). The line's target on the door: as high as the gate of the women's court lets it.
    {
      const SG = new Group(); SG.name = "parahSight"; SG.visible = false; g.add(SG); ctx2.layers.parahSight = SG;
      const yTop = terrainH(OLV.x, OLV.z), E = yTop + 3.2, DX = 1.65, k = (231 - DX) / (OLV.x - DX);
      const yt = Math.min(32, (25.6 - E * k) / (1 - k));
      OLV.eye = [OLV.x, E, 0]; OLV.door = [DX, yt, 0]; OLV.ok = yt >= 22.2;
      const L = Math.hypot(OLV.x - DX, E - yt);
      const lineM = new MeshBasicMaterial({ color: 0xffcc33, transparent: true, opacity: 0.85, depthWrite: false });
      const ln = new Mesh(new CylinderGeometry(0.22, 0.22, L, 8, 1, true), lineM);
      ln.rotation.z = Math.atan2(E - yt, OLV.x - DX) - Math.PI / 2; ln.position.set((OLV.x + DX) / 2, (E + yt) / 2, 0); ln.userData.noPick = true; ln.renderOrder = 7; SG.add(ln);
      const dot = new Mesh(new SphereGeometry(0.7, 12, 8), lineM); dot.position.set(DX + 0.4, yt, 0); dot.userData.noPick = true; SG.add(dot);
      const pad = new Mesh(new CylinderGeometry(3.2, 3.6, 0.6, 20), M2.stoneSmooth); pad.position.set(OLV.x, yTop + 0.1, 0); pad.receiveShadow = true; SG.add(pad);
      let fig = null;
      const ensureFig = () => {
        if (fig) return;
        fig = new Group(); SG.add(fig);
        try { tm_people(ctx2).crowd(fig, [[OLV.x, 0, -Math.PI / 2]], { y: yTop + 0.4, s: 1.4, pose: "stand", kind: "kohen", robe: 0xf1ede2, exact: true, name: "parahPriest" }); } catch (_) {}
      };
      ctx2.labels.push(
        { text: "״שהכהן השורף את הפרה עומד בראש הר המשחה, ומתכוון ורואה בפתחו של היכל בשעת הזית הדם״ (מידות ב, ד)", x: OLV.x - 10, y: E + 9, z: 0, size: 4, layer: "parahSight", far: 1600 },
        { text: "כאן הכותל נמוך — הקו עובר מעליו", x: CO.harE + 4, y: 34, z: 6, size: 2.4, layer: "parahSight", far: 1600 },
        { text: "פתח ההיכל — סוף קו הראייה מהר המשחה", x: DX + 3, y: yt + 6, z: 4, size: 2.4, layer: "parahSight", far: 1600 });
      let saved = null;
      ctx2.shared.features = ctx2.shared.features || {};
      ctx2.shared.features.parahSight = { key: "parahSight", timed: false, isOn: () => SG.visible,
        on: () => { ensureFig(); SG.visible = true; const GP = ctx2.shared.gateParochot; if (GP && saved == null) { saved = GP.mode; GP.set("up"); } },
        off: () => { SG.visible = false; const GP = ctx2.shared.gateParochot; if (GP && saved != null) { GP.set(saved); saved = null; } } };
      ctx2.shared.olives = OLV;
    }
    // ROSES_B2 (fix-b2, 22.11.2026 - the user's decisions 76, 77): the rose garden - a hidden layer outside the Kiponos gate (shared/frag/
    // rose-garden.js), on the place's feature "גנת הוורדים — מחוץ לשער קיפונוס"
    try {
      const RG = tm_roseGarden(ctx2, { x0: -177, x1: -149.6, z0: 12, z1: 38, ground: terrainH, open: "n", wall: "e", name: "roseGarden",
        info: "**הברייתא** (בבא קמא פב:): ״ואין עושין בה גנות ופרדסות — חוץ מגנות וורדין שהיו מימות נביאים הראשונים״; **הרמב״ם** (בית הבחירה ז, יד): ״ואין מקימין בה אילנות חוץ מגנת ורדים שהיתה שם מימות נביאים הראשונים״. מקומה לא נתפרש; תוספות יום טוב (מידות א, ג) ותפארת ישראל (יכין, מידות א, כה) מפרשים כך את שם ״שער קיפונוס״ שבמערב. מקומה, גודלה וצורתה — בחירת מודל.",   // QUOTES_Q: רמב״ם בית הבחירה ז, יד (337:124): 'מקימין', 'מגנת'
        refs: [["בבא קמא פב:", { book: 122, index: 3124 }], ["רמב״ם בית הבחירה ז, יד", { book: 337, index: 124 }], ["תוספות יום טוב מידות א, ג", { book: 948, index: 30 }], ["יכין מידות א, כה", { book: 819, index: 52 }]] });
      ctx2.shared.features = ctx2.shared.features || {};
      ctx2.shared.features.roseGarden = { key: "roseGarden", timed: false, isOn: () => RG.visible, on: () => { RG.visible = true; }, off: () => { RG.visible = false; } };
    } catch (e) { console.warn("[mount] rose garden skipped", e && e.message); }
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
    // 1.2.0: the roofs of the royal stoa and of the porticos have their own list and their own pill on the model (not the heichal's cutaway)
    ctx2.stoaCut = [naveRoof, aisleN, aisleS, roofE, roofW, roofN];
    {
      const MB = Array.isArray(ctx2.shared.modelButtons) ? ctx2.shared.modelButtons : (ctx2.shared.modelButtons = []);
      let on = false;
      MB.push({
        id: "mnt-stoa-roofs", label: "פתח את הסטיו", labelOn: "סגור את הסטיו", removal: true, maxDist: 450,
        title: "מסיר את גגות הסטיו המלכותי והאכסדראות כדי לראות את העמודים ואת החללים שבפנים. כלי צפייה בלבד.",
        anchor: () => [103, 37.6, 307.5],   // the ridge of the royal stoa's nave roof
        get: () => on,
        set: (v) => { on = !!v; for (const m of ctx2.stoaCut) m.visible = !on; },
        under: () => !!(ctx2.shared.camUnder && ctx2.shared.camUnder(ctx2.stoaCut))   // 1.9.2: not closed over the eye
      });
    }
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
    // SOREG_211 (the user, 14.11.2026: "הסורג, צריך להיות עבה יותר ולא טס מתכת"; Bartenura Middot 2:3: "מחצה העשויה נקבים נקבים כמטה
    // מסרגת בחבלים, והיא עשויה מדפי עץ ארכים וקצרים שמרכיבין אותן זו על זו באלכסון"): a lattice of cedar slats crossed on the diagonal,
    // one layer leaning each way, between a low rail and a top rail - ten tefachim in all ("גבוה עשרה טפחים", 2:3). The slats of each
    // group are instanced (one draw per direction). The breaches of the Greeks: SOREG_BREACH_211 below.
    const SG_H = 1.7, SG_R = 0.17, SG_T = 0.3, SG_SP = 0.62, SG_IN = SG_H - 2 * SG_R;
    const SG_SLATS = new Map();   // parent group -> [[axis, fixed, t], ...]
    const SG_MAT = M2.cedar.clone();   // the user: "צבע הסורג עץ כהה"
    SG_MAT.color.setHex(0x5e4636);
    const soregRun = (parent, axis, fixed, r0, r1) => {
      const len = r1 - r0, mid = (r0 + r1) / 2;
      for (const y of [0, SG_H - SG_R]) {
        if (axis === "x") H2.box(parent, len, SG_R, SG_T, SG_MAT, mid, y, fixed);
        else H2.box(parent, SG_T, SG_R, len, SG_MAT, fixed, y, mid);
      }
      if (!SG_SLATS.has(parent)) SG_SLATS.set(parent, []);
      const list = SG_SLATS.get(parent);
      for (let t = r0 + SG_IN / 2; t <= r1 - SG_IN / 2 + 1e-6; t += SG_SP) list.push([axis, fixed, t]);
    };
    const soregSlats = () => {
      const L = SG_IN * Math.SQRT2;
      const gX = new BoxGeometry(0.1, L, 0.07), gZ = new BoxGeometry(0.07, L, 0.1);
      for (const [parent, list] of SG_SLATS) {
        for (const axis of ["x", "z"]) {
          const mine = list.filter((e) => e[0] === axis);
          if (!mine.length) continue;
          for (const sgn of [1, -1]) {
            const im = new InstancedMesh(axis === "x" ? gX : gZ, SG_MAT, mine.length);
            mine.forEach(([, fixed, t], i) => {
              if (axis === "x") M4.makeRotationZ(sgn * Math.PI / 4).setPosition(t, SG_R + SG_IN / 2, fixed + sgn * 0.075);
              else M4.makeRotationX(sgn * Math.PI / 4).setPosition(fixed + sgn * 0.075, SG_R + SG_IN / 2, t);
              im.setMatrixAt(i, M4);
            });
            im.castShadow = im.receiveShadow = true;
            parent.add(im);
          }
        }
      }
    };
    // SOREG_BREACH_211 (the user: "הפרצות היו רק בימי היוונים, אפשר לעשות מתג"; Middot 2:3: "ושלש עשרה פרצות היו שם, שפרצום מלכי
    // יון. חזרו וגדרום"): the repair ("חזרו וגדרום", shown by default) and the Greeks' days, in two groups. ctx2.shared.soregBreach.set("greeks" | "repaired")
    // BREACH13_D (fix-d, 22.11.2026 - the user's decision 133 א, with the coordinator's answer "אפשרות א"): THE THIRTEEN BREACHES OPPOSITE
    // THE THIRTEEN GATES, as the Ra'avyah in the Tosafot Yom Tov (Middot 2:3, book 948 line 68): "ולא היה פתוח ופרוץ אלא לצד מזרח ומשום
    // חיזוק ושמירה ובאו בני יון ופרצו י"ג פרצים בסורג. כנגד י"ג שערי (מזרח) [עזרה] שיוכלו ליכנס בכל צד לעזרה בהרוחה"; the Tzurat Bayit
    // Sheni (6030 line 14): "ובו י"ג פרצות כנגד י"ג שערים"; their places - the Yerushalmi Shekalim 6:2 (154 line 196): "ארבע בצפון וארבע
    // בדרום שלש במזרח ושתים במערב כנגד שלשה עשר שערים" (the TYT there dissents: "ובשקלים פ"ו אינו כן... וצ"ל דלהראבי"ה גירסא אחרת
    // בירושלמי"). In the Greeks' days the soreg is closed all round but for its opening in the east (opposite the women's court's gate),
    // and broken opposite Abba Yose ben Chanan's thirteen gates as the model draws them (30-courts.js, gates13, Tiferet Yisrael's
    // reading): north x -78 (Yechonya = HaNitzotz), -48 (HaKorban), -38.5 (HaNashim, small), -18 (HaShir = Beit HaMoked); south -88
    // (HaElyon, small), -78, -48, -18; east - Nikanor (z 0) and its two wickets (z +-12): the east's opening broken wider, eight amot;
    // west z +-20. In the repaired soreg (the default) - as before, Tiferet Yisrael's: open opposite the seven great gates.
    // The breaches four amot wide (as the openings); the broken stubs and the fallen slats - model choices.
    const repairG = new Group(), breachG = new Group();
    g.add(repairG, breachG);
    breachG.visible = false;
    const GAP_W = 4;
    // Fallen boards and broken rail ends are static. Keep their exact world UVs/rotations, with one batch per board size.
    const debrisBatches = new Map();
    const debris = (w, h, d, x, y, z, axis, angle) => {
      const key = w + ":" + h + ":" + d;
      if (!debrisBatches.has(key)) debrisBatches.set(key, { w, h, d, matrices: [] });
      const mm = new Matrix4();
      if (axis === "x") mm.makeRotationX(angle);
      else if (axis === "y") mm.makeRotationY(angle);
      else mm.makeRotationZ(angle);
      mm.setPosition(x, y + h / 2, z);
      debrisBatches.get(key).matrices.push(mm);
    };
    const soregDebris = (axis, fixed, c, w) => {   // the Greeks' days: slats fallen by the gap, a broken stub of the top rail at each side
      const P = (t, off) => axis === "x" ? [t, off] : [off, t];
      const pieces = [[-1.2, 0.35, 0.4, 0.9], [-0.3, -0.5, 1.7, 1.3], [0.6, 0.6, 2.6, 1.1], [1.1, -0.2, 0.9, 1.7], [0.2, 0.9, 3.4, 0.8]];
      for (const [dt, doff, rot, len] of pieces) {
        const [x, z] = P(c + dt * w / 3, fixed + doff);
        debris(0.1, 0.06, len, x, 0.02, z, "y", rot);
      }
      for (const sgn of [-1, 1]) {
        const [x, z] = P(c + sgn * (w / 2 - 0.25), fixed);
        debris(axis === "x" ? 0.5 : SG_T, SG_R, axis === "x" ? SG_T : 0.5, x, SG_H - SG_R - 0.25, z, axis === "x" ? "z" : "x", sgn * 0.5);
      }
    };
    // gates: the openings opposite the court's gates (open in the repaired soreg, closed in the Greeks' days unless a breach is there);
    // other: openings left as they are in both (x 161 - Josephus' side gates, closed by Chazal: soregChazal below); breaches: [c, w]
    const soregSide = (axis, fixed, from, to, gates, other, breaches) => {
      const near = (a, b) => Math.abs(a - b) < 0.01;
      const cuts = [];
      for (const c of gates) {
        const br = breaches.find((b) => near(b[0], c));
        const w = br ? Math.max(br[1], GAP_W) : GAP_W;
        cuts.push([c - w / 2, c + w / 2, br ? "gateBreach" : "gate", c, w]);
      }
      for (const c of other) cuts.push([c - GAP_W / 2, c + GAP_W / 2, "other", c, GAP_W]);
      for (const [c, w] of breaches) if (!gates.some((q) => near(q, c))) cuts.push([c - w / 2, c + w / 2, "breach", c, w]);
      cuts.sort((p, q) => p[0] - q[0]);
      const runs = [];
      let a = from;
      for (const [c0, c1, kind, c, w] of cuts) {
        runs.push([a, c0]);
        a = c1;
        if (kind === "gate") soregRun(breachG, axis, fixed, c0, c1);            // closed in the Greeks' days
        else if (kind === "breach") { soregRun(repairG, axis, fixed, c0, c1); soregDebris(axis, fixed, c, w); }
        else if (kind === "gateBreach") {                                         // open in both; wider in the Greeks' days
          if (w > GAP_W + 0.01) { soregRun(repairG, axis, fixed, c - w / 2, c - GAP_W / 2); soregRun(repairG, axis, fixed, c + GAP_W / 2, c + w / 2); }
          soregDebris(axis, fixed, c, w);
        }
      }
      runs.push([a, to]);
      for (const [r0, r1] of runs) {
        const len = r1 - r0;
        if (len < 0.6) continue;
        soregRun(g, axis, fixed, r0, r1);   // SOREG_211
        const n = Math.max(1, Math.round(len / 12));
        for (let i = 0; i <= n; i++) {
          const t = r0 + len * i / n;
          if (axis === "x") addPost(t, fixed);
          else addPost(fixed, t);
        }
      }
    };
    // CHEL_211: the third opening of the north at the foot of Beit HaMoked's flight (x 3.5; -18 until 2.0.1); 1.4.0: the gaps face the
    // gates of 1.3.0 (west part of the walls; -18 = Beit HaMoked / the Water Gate) and Josephus' side gates (x 161)
    const B4 = (c) => [c, GAP_W];
    soregSide("x", sz1, sx1, sx2, [-78, -48, 3.5], [161], [B4(-78), B4(-48), B4(-38.5), B4(-18)]);
    soregSide("x", sz2, sx1, sx2, [-78, -48, -18], [161], [B4(-88), B4(-78), B4(-48), B4(-18)]);
    soregSide("z", sx2, sz1, sz2, [0], [], [[0, 8], B4(-12), B4(12)]);
    soregSide("z", sx1, sz1, sz2, [0], [], [B4(-20), B4(20)]);
    for (const { w, h, d, matrices } of debrisBatches.values()) {
      const im = new InstancedMesh(H2.uvWorldBox(new BoxGeometry(w, h, d), w, h, d), SG_MAT, matrices.length);
      matrices.forEach((mm, i) => im.setMatrixAt(i, mm));
      im.castShadow = im.receiveShadow = true;
      im.computeBoundingSphere();
      breachG.add(im);
    }
    // ===== ROOF_ALL_211 (the user, 15.11.2026 00:53: a row of opinions for THE ROOFING OF THE TEMPLE MOUNT). The Rambam (Beit HaBechirah
    // 5:1, book 337 line 76): "הר הבית... וכלו היה מקרה סטיו לפנים מסטיו" (Pesachim 13b, 106 line 388: "הר הבית סטיו כפול היה... סטיו
    // לפנים מסטיו"). THE TOSAFOT YOM TOV (Middot 2:1, 948 line 64): "ודאי שאין הר הבית מכוסה, שלא היה מסוכך אלא ע"ג האצטבאות... והן
    // בצדדים סביב לא באמצע" - the model until now, and the default: the double colonnades along the east, north and west walls and the
    // royal stoa in the south, the middle of the mount open. THE LECHEM SHAMAYIM (Middot 2:1, 1145 line 35): "הר הבית סטיו לפנים מסתיו
    // היה, א"כ כולו עשוי אצטבאות, ממילא כולו מקורה... ותו הרמב"ם נפק לאפיה... שכולו מקורה היה. והוא האמת" - drawn here: rings of
    // columns, a ring within a ring, over the whole mount outside the soreg, and one roof on them (see-through, so that the mount under
    // it is seen). The courts themselves stay open (Boaz, Middot 2:1, 1329 line 9: the four chambers of the Women's Court were not
    // roofed, "וכ"ש העזרה שחוצה לה"; against the Shiltei HaGiborim). ctx2.shared.harRoof = { mode: "sides" | "all", set(m) }.
    // MODEL CHOICES: its height (the side colonnades'), the rings and their columns. (How far in it reached: ROOF_CHEL_211, below.)
    {
      const RG = new Group();
      RG.name = "harRoofAll";
      RG.visible = false;
      g.add(RG);
      ctx2.layers.harRoofAll = RG;
      const W0 = CO.harW, E0 = CO.harE, N0 = CO.harN, S0 = 284;                   // (the royal stoa takes the south, from z 284)
      const inSoreg = (x, z) => x > sx1 - 7 && x < sx2 + 7 && z > sz1 - 7 && z < sz2 + 7;
      const pos = [], seen = new Set();
      // NOTE 10 (U-58): no column within six amot of the eye of the row "הסורג — שלוש עשרה הפרצות" (82, 94) or of its line of sight -
      // one stood right before it and filled the view when both rows were chosen. BREACH13_D: and of its new eye (-30, 100) and line of sight
      const EYES = [[82, 94], [76, 87], [-30, 100], [-39, 90]], nearEye = (x, z) => EYES.some(([ex, ez]) => Math.hypot(x - ex, z - ez) < 6);
      const put = (x, z) => { const k = Math.round(x) + "," + Math.round(z); if (seen.has(k) || inSoreg(x, z) || nearEye(x, z)) return; seen.add(k); pos.push({ x, z }); };
      for (let d = 34; d < 260; d += 24) {                                          // a ring every 24 amot, in from the side colonnades
        const x0 = W0 + d, x1 = E0 - d, z0 = N0 + d, z1 = S0 - (d - 34);
        if (x1 - x0 < 20 || z1 - z0 < 20) break;
        for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / Math.max(1, Math.round((x1 - x0) / 13))) { put(x, z0); put(x, z1); }
        for (let z = z0; z <= z1 + 0.01; z += (z1 - z0) / Math.max(1, Math.round((z1 - z0) / 13))) { put(x0, z); put(x1, z); }
      }
      const cols = H2.colonnade(RG, pos, { height: 22, rShaft: 0.95, mat: M2.marble, style: "corinthian" });
      cols.userData.noPick = true;
      const roofM = new MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.85, transparent: true, opacity: 0.4, depthWrite: false, side: DoubleSide });
      // SKYLIGHTS_B2 (fix-b2, 22.11.2026 - the user's decision 75): in the reading "all" the roof has skylights - the Tiferet Yisrael
      // (Boaz Middot 2:1, 819:157): "ונ"ל שהי' ארובות בקרוי כדי להביא אור תחת הקרוי". Their number, size (8 by 8 amot, a curb round each)
      // and places (on a grid of 48 amot, between the rings of columns) - model choices. The reading "in the name of Rav Chaim Kanievsky"
      // (below) has the same roof without them (the booklet does not draw them). Two sets of slabs: RGH (with holes) and RGP (plain).
      const RGH = new Group(), RGP = new Group();
      RG.add(RGH); RG.add(RGP);
      RGP.visible = false;
      const SKY = [];
      {
        const IXa = -96 - 8, IXb = 231 + 8, IZa = -70 - 8, IZb = 70 + 8;
        for (let x = -127.5 + 30; x < 333.5 - 10; x += 48) for (let z = -148 + 30; z < 286.5 - 10; z += 48) {
          if (x > IXa && x < IXb && z > IZa && z < IZb) continue;               // the courts and the chel
          if (pos.some((p) => Math.abs(p.x - x) < 6.5 && Math.abs(p.z - z) < 6.5)) continue;   // no column under it
          SKY.push([x, z]);
        }
      }
      const curbMats = [[], []];   // identical opaque boards; roof slabs stay separately sortable
      const slab = (x0, x1, z0, z1) => {
        const m = new Mesh(new BoxGeometry(x1 - x0, 0.7, z1 - z0), roofM); m.position.set((x0 + x1) / 2, 23.5, (z0 + z1) / 2); m.userData.noPick = true; m.renderOrder = 6; RGP.add(m);
        // the same slab with its skylights: a shape with square holes, extruded 0.7
        const holes = SKY.filter(([x, z]) => x - 5 > x0 && x + 5 < x1 && z - 5 > z0 && z + 5 < z1);
        const sh = new Shape();
        sh.moveTo(x0, z0); sh.lineTo(x1, z0); sh.lineTo(x1, z1); sh.lineTo(x0, z1); sh.closePath();
        for (const [x, z] of holes) { const h = new Path(); h.moveTo(x - 4, z - 4); h.lineTo(x - 4, z + 4); h.lineTo(x + 4, z + 4); h.lineTo(x + 4, z - 4); h.closePath(); sh.holes.push(h); }
        const geo = new ExtrudeGeometry(sh, { depth: 0.7, bevelEnabled: false });
        geo.rotateX(Math.PI / 2);                                                   // the shape's (x, y) -> (x, z); extruded downward from y 0
        const mh = new Mesh(geo, roofM); mh.position.set(0, 23.85, 0); mh.userData.noPick = true; mh.renderOrder = 6; RGH.add(mh);
        for (const [x, z] of holes) {                                                // the curb: four low boards round the opening
          for (const [w, d, dx, dz] of [[9, 0.5, 0, -4.25], [9, 0.5, 0, 4.25], [0.5, 8, -4.25, 0], [0.5, 8, 4.25, 0]]) {
            curbMats[w === 9 ? 0 : 1].push(m4(x + dx, 24.3, z + dz));
          }
        }
      };
      const X0 = -127.5, X1 = 333.5, Z0 = -148, Z1 = 286.5;                          // between the side colonnades' own roofs
      // ROOF_CHEL_211 (the review, S3-05; the user, 15.11.2026 18:12: "להאריך"): the roof goes on OVER THE CHEL, to the courts' wall - the
      // Tiferet Yisrael, whom the card follows for the open courts, says so: "דרק הר הבית שמחוץ לחומה הפנימית מקורה היה" (Boaz Middot
      // 2:1, 1329:9), and of the chel's steps "וכולו מחופה בגג" (Tzurat Beit HaMikdash, siman 8; 6029:25). Until this fix the roof
      // stopped at the soreg - a choice of the model's that stood against him. The columns still end at the soreg; over the chel the
      // roof leans on the courts' wall (their outer faces: x -96 / 231, z -70 / 70 - CHEL_211).
      const IX0 = -96, IX1 = 231, IZ0 = -70, IZ1 = 70;
      slab(X0, X1, Z0, IZ0);
      slab(X0, X1, IZ1, Z1);
      slab(X0, IX0, IZ0, IZ1);
      slab(IX1, X1, IZ0, IZ1);
      for (let i = 0; i < curbMats.length; i++) if (curbMats[i].length) {
        const c = instMesh(RGH, new BoxGeometry(i ? 0.5 : 9, 0.9, i ? 8 : 0.5), M2.cedar, curbMats[i], false);
        c.userData.noPick = true;
      }
      const LSG = new Group(); LSG.name = "harRoofLS"; ctx2.layers.harRoofLS = LSG;   // (a layer only: the labels of the reading "all")
      ctx2.labels.push({ text: "״וכולו היה מקורה, סטיו לפנים מסטיו״ (רמב״ם) — כל הר הבית, כלחם שמים", x: 250, y: 30, z: 160, size: 5, layers: ["harRoofAll", "harRoofLS"] });
      ctx2.labels.push({ text: "ארובות בקירוי — ״כדי להביא אור תחת הקרוי״ (תפארת ישראל)", x: SKY.length ? SKY[0][0] : 0, y: 27, z: SKY.length ? SKY[0][1] : 0, size: 2.4, layers: ["harRoofAll", "harRoofLS"] });
      // EZN_ROOF_B2 (fix-b2, 22.11.2026 - the user's decision 46): THE ROOFING "IN THE NAME OF RAV CHAIM KANIEVSKY", a third reading of the
      // row. The booklet "אלחנן וחיים עולים לירושלים" (D66), on the Rambam 5:1 "וכלו היה מקרה סטיו לפנים מסטיו": "ומשמע שהיה כלו מקרה, למעט
      // ארבעת הלשכות והשטח הסמוך לבית המקדש. וכן הורה לנו הגר"ח קניבסקי שליט"א שכך יש לצייר"; the booklet of Sukkot (B201): "שטח עזרת
      // הנשים היה מקרה, ולכן יש לומר ששמו את המנורות בלשכות שבפנות עזרת נשים, שלא היה להן גג". Drawn: the whole mount roofed as in "all"
      // (without the skylights), and the women's court at its walls' top, except its four corner chambers ("ולא היו מקורות", Middot 2:5,
      // 89:16) - a cross of roof; the courts of Israel and of the priests open. Under it cedar beams, and four columns with two lintels where
      // the chambers' inner walls would meet. The golden lamps of the water-drawing move into the chambers (57-add208.js, SH.simchaLamps).
      // MODEL CHOICES: the beams, the columns and their places, and the roof's see-through look (as the mount's roof).
      const EZ = new Group(); EZ.name = "eznRoofKanievsky"; EZ.visible = false; g.add(EZ); ctx2.layers.eznRoofKanievsky = EZ;
      const EZC = [[133.5, -9.17], [133.5, 9.17], [188.5, -9.17], [188.5, 9.17]];
      {
        const YR = 40, WX0 = 96, WX1 = 226, WZ = 65, CX0 = 133.5, CX1 = 188.5, CZ = 27.5;
        const ezSlab = (x0, x1, z0, z1) => { const m = new Mesh(new BoxGeometry(x1 - x0, 0.7, z1 - z0), roofM); m.position.set((x0 + x1) / 2, YR + 0.35, (z0 + z1) / 2); m.userData.noPick = true; m.renderOrder = 6; EZ.add(m); };
        ezSlab(CX0, CX1, -WZ, WZ);                                                    // the middle, from the north wall to the south wall
        ezSlab(WX0, CX0, -CZ, CZ);                                                    // the west arm (over the fifteen steps)
        ezSlab(CX1, WX1, -CZ, CZ);                                                    // the east arm (before the gate)
        const beamMats = new Map();
        const beam = (x, z, w, d) => {
          const key = w + "," + d;
          if (!beamMats.has(key)) beamMats.set(key, { w, d, mats: [] });
          beamMats.get(key).mats.push(m4(x, YR - 0.5, z));
        };
        for (let z = -WZ + 3; z <= WZ - 2.9; z += 6.2) beam((CX0 + CX1) / 2, z, CX1 - CX0, 0.8);   // the middle: east to west
        for (let x = WX0 + 3; x < CX0 - 1; x += 6.25) beam(x, 0, 0.8, 2 * CZ);                     // the arms: north to south
        for (let x = CX1 + 3; x < WX1 - 1; x += 6.25) beam(x, 0, 0.8, 2 * CZ);
        for (const x of [CX0, CX1]) beam(x, 0, 1.6, 2 * CZ + 1);                                  // the two lintels on the columns
        for (const { w, d, mats } of beamMats.values()) {
          const m = instMesh(EZ, new BoxGeometry(w, 1.0, d), M2.cedar, mats, false);
          m.castShadow = true; m.userData.noPick = true;
        }
        const ec = H2.colonnade(EZ, EZC.map(([x, z]) => ({ x, y: LV.EZN, z })), { height: YR - 1 - LV.EZN, rShaft: 0.95, mat: M2.marble, style: "corinthian" });
        ec.userData.noPick = true;
      }
      ctx2.labels.push({ text: "עזרת נשים מקורה, חוץ מארבע הלשכות שבפינותיה — כהוראת הגר״ח קניבסקי, כפי שהובא בחלמיש", x: 161, y: 46, z: 0, size: 3, layer: "eznRoofKanievsky" });
      ctx2.shared.eznRoof = { on: false, cols: EZC.map((c) => c.slice()) };
      ctx2.shared.harRoof = { mode: "sides", count: pos.length, skylights: SKY.length,
        set(m) {
          this.mode = m === "all" ? "all" : m === "kanievsky" ? "kanievsky" : "sides";
          RG.visible = this.mode !== "sides";
          RGH.visible = this.mode === "all"; RGP.visible = this.mode === "kanievsky"; LSG.visible = this.mode === "all";
          EZ.visible = this.mode === "kanievsky";
          ctx2.shared.eznRoof.on = EZ.visible;
          const L = ctx2.shared.simchaLamps;
          if (L && typeof L.set === "function") L.set({ at: EZ.visible ? "corner" : "mid" });
          if (ctx2.requestRender) ctx2.requestRender();
          return this.mode;
        } };
    }
    // CHAMBERS30_B2 (fix-b2, 22.11.2026 - the user's decision 74): THE CHAMBERS OF THE TEMPLE MOUNT - a reading (ctx2.shared.harChambers.set,
    // off by default). Middot 2:1 (89:12): "רבו מן הדרום, שני לו מן המזרח, שלישי לו מן הצפון, מעוטו מן המערב. מקום שהיה רב מדתו, שם היה רב
    // תשמישו"; the Tosafot Yom Tov (948:64): "יפה פי' בעל שלטי הגבורים שכתב שהוא על לשכות הרבה ובתים שהיו עשוים באמת ויושר למשמשי הבית
    // נוסף על הלשכות שנאמרו במשנה... ומנה אותן שלשים ואני אומר לסיוע לו שכן נמצא בבנינא דיחזקאל [מ' י"ז] שלשים לשכות אל הרצפה... ועוד
    // נסתפק... לשכה לכל אחד מט"ו הממונים"; the Tiferet Yisrael (Yachin Middot 2:1, 819:157): "ובכל הרווח ההוא בנויים לשכות... ובאותן הרווחים
    // היה דירת כל הט"ו ממונים של הר הבית... והשאר היו בהר הבית רובם בדרום". Thirty chambers in a row before the porticos - thirteen in the
    // south, nine in the east, five in the north, three in the west (most in the south, then by the Mishnah's order); each 12 by 10, 9
    // high, its door toward the courts; the ways from the gates left open. Their number on each side, size, form and places - model choices.
    {
      const CG = new Group(); CG.name = "harChambers30"; CG.visible = false; g.add(CG); ctx2.layers.harChambers30 = CG;
      const tmp = new Group(), dark = new MeshBasicMaterial({ color: 0x1d1610 });
      const CW = 12, CD = 10, CHH = 9;
      const ch = (x, z, face) => {   // face: the side of the door - "n" / "s" / "e" / "w"
        const alongX = face === "n" || face === "s";
        const w = alongX ? CW : CD, d = alongX ? CD : CW;
        const b = new Mesh(H2.uvWorldBox(new BoxGeometry(w, CHH, d), w, CHH, d), M2.stoneLight); b.position.set(x, CHH / 2, z); tmp.add(b);
        const r = new Mesh(new BoxGeometry(w + 0.8, 0.6, d + 0.8), M2.stone); r.position.set(x, CHH + 0.3, z); tmp.add(r);
        const dw = 2.6, dh = 5.2, off = (alongX ? d : w) / 2 + 0.03;
        const door = new Mesh(new PlaneGeometry(dw, dh), dark);
        const sx = face === "e" ? 1 : face === "w" ? -1 : 0, sz = face === "s" ? 1 : face === "n" ? -1 : 0;
        door.position.set(x + sx * off, dh / 2, z + sz * off); door.rotation.y = Math.atan2(sx, sz); tmp.add(door);
      };
      const row = (n, from, to, fixed, axis, face, gaps) => {   // n chambers spread between from and to, skipping the gaps [a, b]
        const L = to - from, step = L / n;
        let made = 0;
        for (let i = 0; i < n * 3 && made < n; i++) {
          const t = from + step * (made + 0.5) + (i - made) * step * 0.25;
          if (gaps.some(([a, b]) => t > a - 8 && t < b + 8)) continue;
          if (axis === "x") ch(t, fixed, face); else ch(fixed, t, face);
          made++;
        }
      };
      row(13, -118, 326, 268, "x", "n", [[-8, 8], [102, 118]]);          // the south, before the royal stoa - the ways from the gates of Chulda left open
      row(9, -136, 270, 318, "z", "w", [[-12, 12], [250, 280]]);         // the east, before its portico - the Shushan gate's way open
      row(5, -116, 318, -136, "x", "s", [[45, 65]]);                      // the north - Tadi's way open
      row(3, -136, 270, -118, "z", "e", [[-12, 12]]);                     // the west - Kiponos' way open
      tmp.updateMatrixWorld(true);
      const byMat = new Map();
      tmp.traverse((o) => { if (o.isMesh) { if (!byMat.has(o.material)) byMat.set(o.material, []); byMat.get(o.material).push(o.geometry.clone().applyMatrix4(o.matrixWorld)); } });
      for (const [mat, list] of byMat) { const m = new Mesh(mergeGeometries(list), mat); m.castShadow = m.receiveShadow = true; m.userData.noPick = true; CG.add(m); }
      ctx2.labels.push({ text: "שלושים לשכות בהר הבית — רובן בדרום (שלטי הגבורים; תוספות יום טוב, מידות ב, א)", x: 103, y: 16, z: 262, size: 4, layer: "harChambers30", far: 1600 });
      ctx2.labels.push({ text: "״ובאותן הרווחים היה דירת כל הט״ו ממונים של הר הבית״ (תפארת ישראל)", x: 318, y: 14, z: 120, size: 2.6, layer: "harChambers30", far: 1600 });
      ctx2.shared.harChambers = { on: false, set(v) { this.on = !!v; CG.visible = this.on; if (ctx2.requestRender) ctx2.requestRender(); return this.on; } };
    }
    // SYNAGOGUE_B2 (fix-b2, 22.11.2026 - the user's decision 52: "מבנה סמלי סמוך לעזרה"): THE SYNAGOGUE ON THE TEMPLE MOUNT - "חזן הכנסת
    // נוטל ספר תורה ונותנו לראש הכנסת" (Yoma 7:1, 55:55); Rashi (Yoma 68b, 2157:2562): "בית הכנסת - היה סמוך לעזרה בהר הבית". A plain
    // house south of the women's court, beyond the chel and the soreg, its door toward the court; 24 by 16, 13 high, a row of windows high
    // in its walls. MIDRASH_B2 (the user's decision 71): THE HOUSE OF STUDY ON THE TEMPLE MOUNT, a plain house as the synagogue - the
    // Tosefta, Chagigah 2:4 (200:17): "ובשבתות ובימים טובים נכנסין לבית המדרש שבהר הבית"; the Gemara (Sanhedrin 88b, 125:3450) has
    // "ובשבתות ובימים טובים, יושבין בחיל" (the card brings both). South of the court of Israel, between the ways from the two gates of
    // Chulda; 20 by 14, 11 high. Their places, sizes and forms - model choices, proposed to the user.
    const plainHouse = (name, X, Z, W, D, HH, text) => {
      const SY = new Group(); SY.name = name; g.add(SY); ctx2.layers[name] = SY;
      H2.wall(SY, { axis: "x", length: W, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X, cz: Z - D / 2, y: 0, openings: [{ center: 0, width: 3, height: 6 }] });
      H2.wall(SY, { axis: "x", length: W, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X, cz: Z + D / 2, y: 0, openings: [] });
      H2.wall(SY, { axis: "z", length: D - 1.2, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X - W / 2 + 0.6, cz: Z, y: 0, openings: [] });
      H2.wall(SY, { axis: "z", length: D - 1.2, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X + W / 2 - 0.6, cz: Z, y: 0, openings: [] });
      H2.box(SY, W + 1.2, 0.8, D + 1.2, M2.stone, X, HH, Z);                                   // the roof
      H2.box(SY, W, 0.2, D, M2.paveFine, X, 0.02, Z);                                          // the floor
      const dark = new MeshBasicMaterial({ color: 0x1d1610 });
      const nw = Math.floor((W - 6) / 3);
      for (let i = 0; i < nw; i++) for (const sd of [-1, 1]) {                                  // windows high in the long walls
        const w = new Mesh(new PlaneGeometry(1.2, 2.2), dark); w.position.set(X - (nw - 1) * 1.5 + i * 3, HH - 3, Z + sd * (D / 2 + 0.62)); w.rotation.y = sd > 0 ? 0 : Math.PI; w.userData.noPick = true; SY.add(w);
      }
      H2.box(SY, 4.4, 0.6, 2, M2.stoneSmooth, X, 0, Z - D / 2 - 1.6);                          // a step before the door
      ctx2.labels.push({ text, x: X, y: HH + 4, z: Z, size: 2.2, layer: name });
    };
    plainHouse("harSynagogue", 161, 112, 24, 16, 13, "בית הכנסת שבהר הבית — ״היה סמוך לעזרה בהר הבית״ (רש״י יומא סח:)");
    plainHouse("harMidrash", 40, 112, 20, 14, 11, "בית המדרש שבהר הבית (תוספתא חגיגה ב, ד)");
    ctx2.labels.push({ text: "שלוש עשרה פרצות כנגד שלשה עשר שערים — הראבי״ה (תוספות יום טוב מידות ב, ג)", x: -48, y: 4.5, z: sz2 + 1, size: 2.2, layer: "soregBreach" });   // BREACH13_D: by the south breaches (was x 70)
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.soregBreach = breachG;
    ctx2.layers.soregRepair = repairG;
    ctx2.shared.soregBreach = {
      mode: "repaired",
      set(m) {
        this.mode = m === "greeks" ? "greeks" : "repaired";
        breachG.visible = this.mode === "greeks";
        repairG.visible = !breachG.visible;
        if (ctx2.requestRender) ctx2.requestRender();
      }
    };
    // 1.8.0 (the user: "שערי עזרת נשים לפי חז״ל לא מבטל את השערים של יוסף בן מתתיהו"): the gaps at x 161 face Josephus' side gates of the
    // women's court only - by Chazal (the default) the soreg runs on there: a filler piece in each long side, hidden by ctx2.shared.eznGates
    {
      const fill = new Group();
      g.add(fill);
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.soregChazal = fill;
      for (const z of [sz1, sz2]) soregRun(fill, "x", z, 161 - 2.05, 161 + 2.05);   // SOREG_211
    }
    soregSlats();   // SOREG_211
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
      { text: "הר הבית", x: CX, y: 55, z: 210, size: 8 },
      { text: "שער שושן", x: 362, y: 30, z: 0, size: 5 },
      { text: "שער טדי", x: 55, y: 30, z: -176, size: 5 },
      { text: "שערי חולדה", x: 55, y: 30, z: 341, size: 5 },
      { text: "שער קיפונוס", x: -156, y: 30, z: 0, size: 5 },
      { text: "הסטיו המלכותי", x: CX, y: 46, z: 307, size: 6 },
      { text: "הסורג — מדפי עץ באלכסון, נקבים נקבים (ברטנורא, מידות ב, ג)", x: 246, y: 6, z: 14, size: 3 }
    );
    // 1.5.0: the doors of the five gates of the Mount (Middot 1:3) - gold leaves (2:3), ajar into the Mount; Tadi's between its two leaning
    // stones. Huldah x 0 and 110 (south), Kiponus (west), Tadi x 55 (north), Shushan (east, z 0).
    for (const x of [0, 110]) H2.doors(g, { axis: "x", cx: x, cz: CO.harS, y: 0, width: 10, height: 20, inward: -1, mat: M2.gateGold, open: 1.0, inset: 2 });
    // 1.9.5 (a remark sent on to the user, 11.11.2026: "בשער טדי לכאו' הדלת הסתיימה באלכסון כמו השער - לא ממקורות אלא מהעובדה כי זה הי'
    // שער הכניסה לעיר מצפון"; the user: "8. תשנה"): TADI'S LEAVES END ASLANT, as the gate's head - each leaf as high as the jamb at
    // its hinge (20) and as the gable at the gate's middle (24), so that the two, shut, close the triangle between the two leaning
    // stones too (until 1.9.4 two upright leaves of 20, the triangle open over them). No source - a model choice; the card says so.
    {
      const grp = new Group();
      grp.name = "tadiLeaves";
      const lw = 4.9, th = 0.4, h0 = 19.7, h1 = 19.7 + 4 * (lw / 5);
      for (const sd of [-1, 1]) {
        const sh = new Shape();
        sh.moveTo(0, 0); sh.lineTo(lw, 0); sh.lineTo(lw, h1); sh.lineTo(0, h0); sh.closePath();
        const geo = new ExtrudeGeometry(sh, { depth: th, bevelEnabled: false });
        geo.translate(0, 0, -th / 2);
        const leaf = new Mesh(geo, M2.gateGold);
        leaf.position.set(sd * 5, 0.15, 2);
        leaf.rotation.y = sd < 0 ? -0.3 : Math.PI + 0.3;   // a little ajar into the Mount, so that their slanted heads are seen from outside ("טדי מן הצפון, לא היה משמש כלום", Middot 1:3); the other gates' leaves stand wide open
        leaf.castShadow = leaf.receiveShadow = true;
        H2.box(leaf, lw - 0.2, 0.35, th + 0.08, M2.bronze, lw / 2, 9.8, 0);
        grp.add(leaf);
      }
      grp.position.set(55, 0, CO.harN);
      g.add(grp);
    }
    H2.doors(g, { axis: "z", cx: CO.harE, cz: 0, y: 0, width: 10, height: 20, inward: -1, mat: M2.gateGold, open: 1.0, inset: 2 });
    H2.doors(g, { axis: "z", cx: CO.harW, cz: 0, y: 0, width: 10, height: 20, inward: 1, mat: M2.gateGold, open: 1.0, inset: 2 });
    // 1.5.0: THE CHEL as a zone (see 30-courts.js): the 10 amot between the soreg and the courts' walls (Middot 2:3), lit by its place.
    // 1.9.1 (the user: "תוסיף צבע צף לחיל שיהיה ברור מהו בדיוק, כמו בעזרת נשים"): the patch lay on the ground (y 0.12), under the courts'
    // podiums - they run 7.5 amot into the chel on every side (30-courts.js: the azarah's at 13.5, the women's court's at 6; only the
    // outer 2.5 amot by the soreg stay at the mount's level) - so almost nothing showed, and its label stood inside the podium. Now the
    // patch floats on each part's own surface, with a bright frame like the courts' zones; on the east (the chel at the mount's level,
    // 30-courts.js) a sloped patch lies over the twelve steps.
    {
      ctx2.layers = ctx2.layers || {};
      ctx2.shared.features = ctx2.shared.features || {};
      const grp = new Group();
      grp.visible = false;
      grp.name = "zoneHel";
      const HEL = 0x3ad1c9;
      const pm = new MeshBasicMaterial({ color: HEL, transparent: true, opacity: 0.42, depthWrite: false, side: DoubleSide });
      const fm = new MeshBasicMaterial({ color: HEL });
      const strip = (parent, x0, x1, z0, z1, y) => {
        const p = new Mesh(new BoxGeometry(x1 - x0, 0.04, z1 - z0), pm);
        p.position.set((x0 + x1) / 2, y + 0.08, (z0 + z1) / 2);
        p.userData.noPick = true;
        parent.add(p);
        const bar = (w, d, x, z) => { const b = new Mesh(new BoxGeometry(w, 0.2, d), fm); b.position.set(x, y + 0.12, z); b.userData.noPick = true; parent.add(b); };
        bar(x1 - x0, 0.35, (x0 + x1) / 2, z0); bar(x1 - x0, 0.35, (x0 + x1) / 2, z1);
        bar(0.35, z1 - z0, x0, (z0 + z1) / 2); bar(0.35, z1 - z0, x1, (z0 + z1) / 2);
      };
      const ix0 = CO.azW - 2.5, ix1 = CO.eznE + 2.5, iz0 = CO.azN - 2.5, iz1 = CO.azS + 2.5;   // the walls' outer faces
      const px0 = CO.azW - 10, pz0 = CO.azN - 10, pz1 = CO.azS + 10;                            // the podiums' outer edges (30-courts.js)
      const yAz = LV.AZ, yEz = LV.EZN;
      // CHEL_211: the whole chel is at the mount's level (until 2.0.1 the patch lay on the podiums' ledges, 7.5 of the ten amot):
      // four strips round the courts - north, south, west and east
      strip(grp, sx1, sx2, sz1, iz0, 0.04);
      strip(grp, sx1, sx2, iz1, sz2, 0.04);
      strip(grp, sx1, ix0, iz0, iz1, 0.04);
      // the east: the chel at the mount's level, and the twelve steps inside it (x 231..237, 14 wide) - a sloped patch over them
      strip(grp, ix1, sx2, iz0, iz1, 0.04);
      {
        const x0 = ix1, x1 = ix1 + 6, hw = 7, lift = 0.35;
        const geo = new BufferGeometry();
        geo.setAttribute("position", new Float32BufferAttribute([x1, lift, -hw, x1, lift, hw, x0, yEz + lift, hw, x0, yEz + lift, -hw], 3));
        geo.setIndex([0, 1, 2, 0, 2, 3]);
        const sl = new Mesh(geo, pm);
        sl.userData.noPick = true;
        grp.add(sl);
      }
      g.add(grp);
      ctx2.layers.zoneHel = grp;
      ctx2.shared.features.zoneHel = { key: "zoneHel", isOn: () => grp.visible, on: () => { grp.visible = true; }, off: () => { grp.visible = false; } };
      ctx2.labels.push({ text: "החיל — עשר אמות בין הסורג לחומה (מידות ב, ג)", x: 20, y: 4, z: sz2 - 5, size: 3, layer: "zoneHel" });
      ctx2.labels.push({ text: "החיל", x: sx2 - 5, y: 4, z: -45, size: 3, layer: "zoneHel" });
    }
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    Object.assign(ctx2.shared.flyPoints, {
      harHabayit: { pos: [720, 320, 520], target: [100, 10, 80] },
      shushanGate: { pos: [455, 24, -88], target: [392, -4, 0] },   // 1.9.5: from the north-east - the gate and the ramp of the Parah on its two rows of arches
      royalStoa: { pos: [190, 14, 250], target: [80, 12, 305] }   // TOURFIX_195: inside the mount, along its columns (from outside the wall they were hidden); VIEWFIX_205: under the roof's height (from 34 the roof's top filled the view)
    });
  }

