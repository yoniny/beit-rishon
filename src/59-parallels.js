  // ===== 59-parallels.js (fix-c, 22.11.2026): THE FIRST TEMPLE'S COUNTERPARTS OF PLACES THAT ONLY THE SECOND TEMPLE HAD IN THE MODEL =====
  // The user went over chapter ב of the "same place" list (same-place-list.md, 09:38: "לבצע") - a place of the Second Temple with no
  // counterpart in the First is added here too and linked by the card's button "אותו מקום" (UI_SAME_PAIRS_C in shared/70-ui.js). Each
  // piece copies the Second Temple's own (sheni/src) and fits it to this house: the court 187 x 135 at y 6 (LV.AZ), the great court
  // 500 x 500 at y 0, the outer court x 93.5..228.5 at y 3, the bronze altar of II Chr 4:1 (40-altar.js: its group "altar" moves with the
  // row "מקום המזבח", ctx.shared.altarPlace; its measures with ctx.shared.altarYose). Built here:
  //   1. the synagogue and the house of study on the Temple Mount (Yoma 7:1; Rashi Yoma 68b; the Tosefta, Chagigah 2:4) - plain houses
  //      in the great court at the Second Temple model's places (x 161 / 40, z 112);
  //   2. "בין האולם ולמזבח" - its zone on the floor, lit for 15 s by its place (Kelim 1:9; Joel 2:17);
  //   3. the two tables west of the ramp - "שלחן החלבים" (Shekalim 6:4; Tamid 7:3), by the altar's south-west corner as the Ra'avad;
  //   4. the three firepans (Yoma 4:4; Yoma 44b), a hidden group shown by their place;
  //   5. the portions of Yehudah and Binyamin (Yoma 12a; Zevachim 53b) by the row "יסוד המזבח בדרום" (Tosafot Zevachim 61b / R. Tam);
  //   6. the windows of Beit HaChalifot where the knives were kept (Middot 4:7; Rashi Sukkah 56a), one for each of the 24 watches of
  //      I Chr 24 - in the north wing; Bilga's is open: its window was shut "כשנכנסו יוונים להיכל" (Sukkah 56b), in the Second Temple.
  // Every measure and place without a source is a model choice, so marked in the cards (src/slots/70-ui.slots.js, PARALLELS_C).
  function par_mergeInto(parent, tmp, opts) {   // the meshes of a temporary group merged by material into the parent (few draw calls)
    tmp.updateMatrixWorld(true);
    const byMat = new Map();
    tmp.traverse((o) => { if (o.isMesh) { if (!byMat.has(o.material)) byMat.set(o.material, []); byMat.get(o.material).push(o.geometry.clone().applyMatrix4(o.matrixWorld)); } });
    const out = [];
    for (const [mat, list] of byMat) {
      const m = new Mesh(mergeGeometries(list), mat);
      m.castShadow = !!(opts && opts.shadow);
      m.receiveShadow = true;
      if (opts && opts.noPick) m.userData.noPick = true;
      parent.add(m);
      out.push(m);
    }
    return out;
  }
  // a label's sprite follows its label object when the label is moved (the labels are sprites made once by 70-ui.js)
  function par_moveLabel(ctx, l, x, y, z) {
    const ox = l.x, oy = l.y, oz = l.z;
    l.x = x; l.y = y; l.z = z;
    let lg = null;
    try { lg = ctx.root.getObjectByName("labels"); } catch (_) {}
    if (lg) for (const spr of lg.children) {
      if ((spr.userData && spr.userData.label === l) || (Math.abs(spr.position.x - ox) < 1e-3 && Math.abs(spr.position.y - oy) < 1e-3 && Math.abs(spr.position.z - oz) < 1e-3)) { spr.position.set(x, y, z); break; }
    }
  }

  async function buildParallels(ctx) {
    const M2 = ctx.M, H2 = ctx.H, CO2 = ctx.CO, LV2 = ctx.LV;
    const g = new Group();
    g.name = "parallels";
    ctx.root.add(g);
    ctx.layers = ctx.layers || {};
    ctx.shared.features = ctx.shared.features || {};
    const AZ = LV2.AZ;   // 6: the inner court's floor
    // the altar's frame (40-altar.js): its group moves along z with the row "מקום המזבח"; the measures go by the row "מידות המזבח"
    const altarG = () => { try { return ctx.root.getObjectByName("altar"); } catch (_) { return null; } };
    const yose = () => !!(ctx.shared.altarYose && ctx.shared.altarYose.current === "yose");
    const altarDz = () => { const A = ctx.shared.altarPlace; return A && A.dz && A.current in A.dz ? A.dz[A.current] + (A.extra || 0) : 10; };
    const ACX = (CO2.xAltarW + CO2.xAltarE) / 2;   // 55
    // the altar's base (the wall below the sovev) and its yesod's outline, in the altar's own frame (z round 0)
    const base = () => (yose() ? { x0: ACX - 13, x1: ACX + 13, z0: -13, z1: 13, yw: ACX - 14, ys: 14 } : { x0: ACX - 11, x1: ACX + 11, z0: -11, z1: 11, yw: ACX - 12, ys: 12 });
    const watchers = [];   // functions called when the altar's place or measures change (ZONES_FOLLOW_211 as in the Second Temple)
    {
      let k0 = "";
      ctx.animated.push(() => {
        const A = ctx.shared.altarPlace, R = ctx.shared.altarRTam;
        const k = (A ? A.current + ":" + (A.extra || 0) : "") + "|" + (yose() ? "y" : "c") + "|" + (R ? R.current : "");
        if (k === k0) return;
        k0 = k;
        for (const f of watchers) { try { f(); } catch (e) { console.warn("[parallels] follow", e && e.message); } }
      });
    }

    // ---------- 1. THE SYNAGOGUE AND THE HOUSE OF STUDY ON THE TEMPLE MOUNT (SYNAGOGUE_B2 / MIDRASH_B2 of the Second Temple's 20-mount.js) ----------
    // Yoma 7:1 (55:55) "חזן הכנסת נוטל ספר תורה ונותנו לראש הכנסת"; Rashi Yoma 68b (2157:2562) "בית הכנסת - היה סמוך לעזרה בהר הבית"; the
    // Tosefta, Chagigah 2:4 (200:17) "ובשבתות ובימים טובים נכנסין לבית המדרש שבהר הבית" (Sanhedrin 88b, 125:3450: "יושבין בחיל"). The
    // sources speak of the Second Temple's days; in this house the user's decision (same-place-list, 09:38: "לבצע"): the same plain houses
    // at the same places - in the great court, south of the outer court (x 161) and south of the inner court (x 40), z 112. Their places,
    // sizes and forms - model choices.
    {
      // MIDRASH_FURNISH_N13 (fix-n13, 24.11.2026 - the user's request): THE INSIDE OF THE HOUSE OF STUDY - (a) benches and tables for the pupils,
      // (b) bookcases, (c) a special place for the head of the yeshiva (a dignified chair on a platform, a reading desk before it, a hanging
      // behind). The sources speak of the house of study only by name (the Tosefta, Chagigah 2:4), so every piece, measure and place here is
      // a model choice, marked so in the card and the labels. The roof is open (bare beams) so that the inside is seen. Units: amah; the floor
      // y0 + 0.22; the door in the north wall (x 40 +-1.5), so the middle aisle is kept clear from the door to the platform.
      // Every piece is registered in ctx.shared.harMidrashItems (name, box) - the test of no piece entering another and none blocking the way.
      const midrashFurnish = (SY, X, Z, W, D, HH, y0, items) => {
        const FL = y0 + 0.22;
        const tmp = new Group();
        const wd = M2.cedar, wd2 = new MeshStandardMaterial({ color: 0x6a4a2c, roughness: 0.8 }), cloth = new MeshStandardMaterial({ color: 0x7a2a22, roughness: 0.92 });
        const brass = new MeshStandardMaterial({ color: 0xb8923a, roughness: 0.4, metalness: 0.5 }), paper = new MeshStandardMaterial({ color: 0xeee6cf, roughness: 0.8 });
        const reg = (name, cx, cz, sx, sz, yb, yt) => items.push({ name, x0: X + cx - sx / 2, x1: X + cx + sx / 2, z0: Z + cz - sz / 2, z1: Z + cz + sz / 2, y0: yb, y1: yt });
        const bx = (w, h, d, mat, x, y, z) => H2.box(tmp, w, h, d, mat, X + x, y, Z + z);   // x, z from the house's middle; y absolute
        const cyl = (r0, r1, h, mat, x, y, z, seg = 10) => { const m = new Mesh(new CylinderGeometry(r0, r1, h, seg), mat); m.position.set(X + x, y + h / 2, Z + z); tmp.add(m); return m; };
        // (a) the pupils' rows: two columns, three rows each - a bench (north of its table) and a long table, the pupils facing south, to the head
        const ROWS = [-3.6, -0.9, 1.8], TL = 5.6;
        for (const sx of [-1, 1]) for (const zc of ROWS) {
          const cx = sx * 4.7, bz = zc - 1.0, tz = zc + 0.2;
          bx(TL, 0.12, 0.7, wd, cx, FL + 0.78, bz);                                            // the bench's seat
          for (const e of [-1, 1]) bx(0.12, 0.78, 0.6, wd2, cx + e * (TL / 2 - 0.35), FL, bz);   // its two end boards
          bx(TL, 0.1, 0.06, wd2, cx, FL + 0.5, bz + 0.32);                                      // the rail under the seat
          reg("bench", cx, bz, TL, 0.7, FL, FL + 0.9);
          bx(TL, 0.12, 1.3, wd, cx, FL + 1.38, tz);                                            // the table's top
          for (const e of [-1, 1]) bx(0.14, 1.38, 1.1, wd2, cx + e * (TL / 2 - 0.35), FL, tz);   // its end boards
          bx(TL - 0.7, 0.12, 0.08, wd2, cx, FL + 1.0, tz);                                     // the stretcher between them
          // the pupils' books on the table: open volumes (paper and two covers) at three places along it
          for (let k = -1; k <= 1; k++) {
            const px = cx + k * 1.7, pz = tz - 0.1;
            bx(0.95, 0.07, 0.65, wd2, px, FL + 1.5, pz); bx(0.88, 0.06, 0.58, paper, px, FL + 1.57, pz);
          }
          reg("table", cx, tz, TL, 1.3, FL, FL + 1.5 + 0.14);
        }
        // (c) the head of the yeshiva's place, in the south wall's middle, facing the door: a platform (x +-3.6, z 3.4..6.4, 0.6 high) with a
        // step before it, a rug on it, the chair, the reading desk before the chair, two bronze lamp stands at its sides, a hanging on the wall
        const PT = FL + 0.6;
        bx(7.2, 0.6, 3.0, M2.stoneSmooth, 0, FL, 4.9); reg("platform", 0, 4.9, 7.2, 3.0, FL, PT);
        bx(5.4, 0.3, 0.45, M2.stoneSmooth, 0, FL, 3.2); reg("step", 0, 3.2, 5.4, 0.45, FL, FL + 0.3);
        bx(4.6, 0.03, 2.4, cloth, 0, PT, 4.9);                                                   // the rug on the platform
        const CZ = 5.45;
        bx(1.7, 0.14, 1.4, wd2, 0, PT + 0.95, CZ);                                              // the seat
        bx(1.5, 0.16, 1.2, cloth, 0, PT + 1.09, CZ - 0.02);                                    // the cushion
        for (const ex of [-1, 1]) for (const ez of [-1, 1]) bx(0.16, 0.95, 0.16, wd2, ex * 0.75, PT, CZ + ez * 0.58);   // the four legs
        bx(1.7, 2.7, 0.14, wd2, 0, PT + 1.09, CZ + 0.68);                                       // the high back
        bx(1.3, 0.9, 0.04, cloth, 0, PT + 1.9, CZ + 0.59);                                      // its padded panel
        for (const ex of [-1, 1]) {
          bx(0.14, 0.12, 1.3, wd2, ex * 0.86, PT + 1.75, CZ - 0.02);                            // the arms
          bx(0.14, 0.66, 0.14, wd2, ex * 0.86, PT + 1.09, CZ - 0.58);                           // and their front posts
          bx(0.2, 0.34, 0.2, brass, ex * 0.84, PT + 3.79, CZ + 0.68);                           // the gilt knobs on the back's top
        }
        reg("chair", 0, CZ + 0.05, 1.9, 1.5, PT, PT + 4.13);
        const DZ = 4.1;
        bx(2.4, 0.12, 0.9, wd, 0, PT + 1.4, DZ);                                                 // the reading desk's top
        for (const ex of [-1, 1]) bx(0.14, 1.4, 0.8, wd2, ex * 1.05, PT, DZ);
        bx(0.95, 0.07, 0.65, wd2, 0, PT + 1.52, DZ); bx(0.88, 0.06, 0.58, paper, 0, PT + 1.59, DZ);
        reg("desk", 0, DZ, 2.4, 0.9, PT, PT + 1.65);
        for (const ex of [-1, 1]) {                                                              // the lamp stands
          cyl(0.28, 0.34, 0.12, brass, ex * 3.1, PT, 4.2); cyl(0.07, 0.07, 3.4, brass, ex * 3.1, PT + 0.12, 4.2); cyl(0.3, 0.12, 0.28, brass, ex * 3.1, PT + 3.5, 4.2);
          reg("lamp", ex * 3.1, 4.2, 0.7, 0.7, PT, PT + 3.78);
        }
        bx(4.6, 4.4, 0.06, cloth, 0, FL + 1.2, 6.33);                                           // the hanging behind the chair
        bx(4.9, 0.14, 0.12, brass, 0, FL + 5.6, 6.3); bx(4.6, 0.12, 0.08, brass, 0, FL + 1.1, 6.32);
        reg("hanging", 0, 6.33, 4.9, 0.14, FL + 1.1, FL + 5.74);
        // (b) the bookcases: along the east and west walls (4 each, 2.2 long) and the south wall's two sides (2 each, 1.9 long), 4.3 high, five shelves
        const CASES = [];
        for (const sx of [-1, 1]) for (const zc of [-4.6, -2.2, 0.2, 2.6]) CASES.push({ ax: "z", cx: sx * 8.9, cz: zc, L: 2.2, sx });
        for (const sx of [-1, 1]) for (const xc of [5.15, 7.2]) CASES.push({ ax: "x", cx: sx * xc, cz: 5.95, L: 1.9, sx });
        const CD = 0.9, CHT = 4.46, SH = 0.86;
        const books = [];   // [x, y, z, sx, sy, sz, colour]
        let seed = 7;
        const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        const COLS = [0x5a2a1c, 0x3a2a1a, 0x2a3a5a, 0x4a1c24, 0x1f3a2a, 0x8a6a3a, 0x2a2a2a, 0x6a4a2c, 0x7a3a2a, 0x4a3a6a];
        for (const c of CASES) {
          const z = c.ax === "z", aw = z ? CD : c.L, ad = z ? c.L : CD;   // the case's size along x and along z
          const into = z ? -c.sx : -1;                                      // the direction from the wall into the room, along its depth axis (x for the side walls, z for the south wall)
          // the shell: the back against the wall, two sides, the top and the bottom, the four shelves between
          const back = z ? [0.1, CHT, c.L, c.cx - into * (CD / 2 - 0.05), c.cz] : [c.L, CHT, 0.1, c.cx, c.cz + (CD / 2 - 0.05)];
          bx(back[0], back[1], back[2], wd2, back[3], FL, back[4]);
          for (const e of [-1, 1]) {
            if (z) bx(CD, CHT, 0.1, wd2, c.cx, FL, c.cz + e * (c.L / 2 - 0.05)); else bx(0.1, CHT, CD, wd2, c.cx + e * (c.L / 2 - 0.05), FL, c.cz);
          }
          for (let k = 0; k <= 5; k++) {
            const yy = FL + (k === 0 ? 0 : k === 5 ? CHT - 0.12 : 0.1 + k * SH - 0.06);
            bx(aw, 0.12, ad, wd, c.cx, yy, c.cz);
          }
          reg("bookcase", c.cx, c.cz, aw, ad, FL, FL + CHT);
          // the books: five rows, each filled along the case with volumes of varied width and height, their spines to the room
          for (let k = 0; k < 5; k++) {
            const by = FL + (k === 0 ? 0.12 : 0.1 + k * SH + 0.06);
            let u = -c.L / 2 + 0.16;
            while (u < c.L / 2 - 0.3) {
              const w = 0.16 + rnd() * 0.14, h = 0.5 + rnd() * 0.22, d = 0.5 + rnd() * 0.08;
              if (u + w > c.L / 2 - 0.12) break;
              const col = COLS[Math.floor(rnd() * COLS.length)];
              if (z) books.push([c.cx - into * (CD / 2 - 0.12 - d / 2), by, c.cz + u + w / 2, d, h, w, col]);
              else books.push([c.cx + u + w / 2, by, c.cz + (CD / 2 - 0.12 - d / 2), w, h, d, col]);
              u += w + 0.015 + (rnd() < 0.08 ? 0.25 : 0);
            }
          }
        }
        // merged by material: the furniture; the books: one InstancedMesh with a colour for each
        tmp.updateMatrixWorld(true);
        const byMat = new Map();
        tmp.traverse((o) => { if (o.isMesh) { if (!byMat.has(o.material)) byMat.set(o.material, []); byMat.get(o.material).push(o.geometry.clone().applyMatrix4(o.matrixWorld)); } });
        for (const [mat, list] of byMat) { const m = new Mesh(mergeGeometries(list), mat); m.castShadow = m.receiveShadow = true; m.userData.noPick = true; SY.add(m); }
        const bm = new InstancedMesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 }), books.length);
        const M4 = new Matrix4(), cc = new Color();
        books.forEach((b, i) => { M4.makeScale(b[3], b[4], b[5]); M4.setPosition(X + b[0], b[1] + b[4] / 2, Z + b[2]); bm.setMatrixAt(i, M4); bm.setColorAt(i, cc.setHex(b[6])); });
        bm.instanceMatrix.needsUpdate = true; if (bm.instanceColor) bm.instanceColor.needsUpdate = true;
        bm.castShadow = bm.receiveShadow = true; bm.userData.noPick = true; SY.add(bm);
      };
      // SYN_FURNISH_420 (the user, 24.11.2026: "בית הכנסת הוספת ספסלים ושלחנות"): as the Second Temple's 20-mount.js - an open roof and four
      // rows of benches and tables in two columns, facing south. Their number and form - model choices
      const synFurnish = (SY, X, Z) => {
        const tmp = new Group(), FL = LV2.HAR + 0.22, wd = M2.cedar, wd2 = new MeshStandardMaterial({ color: 0x6a4a2c, roughness: 0.8 }), paper = new MeshStandardMaterial({ color: 0xeee6cf, roughness: 0.8 });
        const bx = (w, h, d, mat, x, y, z) => H2.box(tmp, w, h, d, mat, X + x, y, Z + z);
        const TL = 7;
        for (const sx of [-1, 1]) for (const zc of [-4.6, -1.8, 1.0, 3.8]) {
          const cx = sx * 5.2, bz = zc - 1.0, tz = zc + 0.2;
          bx(TL, 0.12, 0.7, wd, cx, FL + 0.78, bz); for (const e of [-1, 1]) bx(0.12, 0.78, 0.6, wd2, cx + e * (TL / 2 - 0.35), FL, bz); bx(TL, 0.1, 0.06, wd2, cx, FL + 0.5, bz + 0.32);
          bx(TL, 0.12, 1.2, wd, cx, FL + 1.38, tz); for (const e of [-1, 1]) bx(0.14, 1.38, 1.0, wd2, cx + e * (TL / 2 - 0.35), FL, tz); bx(TL - 0.7, 0.12, 0.08, wd2, cx, FL + 1.0, tz);
          for (let k = -1; k <= 1; k++) { const px = cx + k * 2.1; bx(0.95, 0.07, 0.65, wd2, px, FL + 1.5, tz - 0.1); bx(0.88, 0.06, 0.58, paper, px, FL + 1.57, tz - 0.1); }
        }
        tmp.updateMatrixWorld(true);
        const byMat = new Map();
        tmp.traverse((o) => { if (o.isMesh) { if (!byMat.has(o.material)) byMat.set(o.material, []); byMat.get(o.material).push(o.geometry.clone().applyMatrix4(o.matrixWorld)); } });
        for (const [mat, list] of byMat) { const m = new Mesh(mergeGeometries(list), mat); m.castShadow = m.receiveShadow = true; m.userData.noPick = true; SY.add(m); }
      };
      const plainHouse = (name, X, Z, W, D, HH, text, furnish) => {
        const SY = new Group(); SY.name = name; g.add(SY); ctx.layers[name] = SY;
        H2.wall(SY, { axis: "x", length: W, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X, cz: Z - D / 2, y: LV2.HAR, openings: [{ center: 0, width: 3, height: 6 }] });
        H2.wall(SY, { axis: "x", length: W, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X, cz: Z + D / 2, y: LV2.HAR, openings: [] });
        H2.wall(SY, { axis: "z", length: D - 1.2, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X - W / 2 + 0.6, cz: Z, y: LV2.HAR, openings: [] });
        H2.wall(SY, { axis: "z", length: D - 1.2, height: HH, thickness: 1.2, mat: M2.stoneLight, cx: X + W / 2 - 0.6, cz: Z, y: LV2.HAR, openings: [] });
        if (!furnish) H2.box(SY, W + 1.2, 0.8, D + 1.2, M2.stone, X, LV2.HAR + HH, Z);            // the roof
        else {   // the house of study: an open roof - bare beams across, so that the inside is seen (a model choice)
          for (let i = 0; i < 6; i++) H2.box(SY, 0.5, 0.5, D + 1.2, M2.cedar, X - W / 2 + 0.3 + i * ((W - 0.6) / 5), LV2.HAR + HH, Z);
          for (const sd of [-1, 1]) H2.box(SY, W + 1.2, 0.5, 0.6, M2.stone, X, LV2.HAR + HH, Z + sd * (D / 2 + 0.3));
        }
        H2.box(SY, W, 0.2, D, M2.paveFine, X, LV2.HAR + 0.02, Z);                                // the floor
        const dark = new MeshBasicMaterial({ color: 0x1d1610 });
        const nw = Math.floor((W - 6) / 3);
        for (let i = 0; i < nw; i++) for (const sd of [-1, 1]) {                                  // windows high in the long walls
          const w = new Mesh(new PlaneGeometry(1.2, 2.2), dark); w.position.set(X - (nw - 1) * 1.5 + i * 3, LV2.HAR + HH - 3, Z + sd * (D / 2 + 0.62)); w.rotation.y = sd > 0 ? 0 : Math.PI; w.userData.noPick = true; SY.add(w);
        }
        H2.box(SY, 4.4, 0.6, 2, M2.stoneSmooth, X, LV2.HAR, Z - D / 2 - 1.6);                    // a step before the door (the door toward the courts, north)
        ctx.labels.push({ text, x: X, y: LV2.HAR + HH + 4, z: Z, size: 2.2, layer: name });
        if (furnish === "syn") {
          synFurnish(SY, X, Z);
          ctx.labels.push({ text: "ספסלים ושולחנות (בחירת מודל)", x: X, y: LV2.HAR + 5.2, z: Z, size: 1.2, layer: name });
        } else if (furnish) {
          const items = ctx.shared.harMidrashItems = [];
          midrashFurnish(SY, X, Z, W, D, HH, LV2.HAR, items);
          ctx.labels.push({ text: "ראש הישיבה — כסא מכובד על במה (בחירת מודל)", x: X, y: LV2.HAR + 9.2, z: Z + 4.9, size: 1.2, layer: name });
          ctx.labels.push({ text: "ספסלים ושולחנות לתלמידים (בחירת מודל)", x: X - 4.7, y: LV2.HAR + 5.2, z: Z - 0.9, size: 1.2, layer: name });
          ctx.labels.push({ text: "ארונות ספרים (בחירת מודל)", x: X + 8.9, y: LV2.HAR + 7, z: Z - 1, size: 1.2, layer: name });
        }
      };
      plainHouse("harSynagogue", 161, 112, 24, 16, 13, "בית הכנסת שבהר הבית — ״היה סמוך לעזרה בהר הבית״ (רש״י יומא סח:)", "syn");
      plainHouse("harMidrash", 40, 112, 20, 14, 11, "בית המדרש שבהר הבית (תוספתא חגיגה ב, ד)", true);
    }

    // ---------- 2. "בין האולם ולמזבח" - THE ZONE ON THE FLOOR (as the Second Temple's zoneUlamAltar, 30-courts.js) ----------
    // From the ulam's front (x 18.5) to the altar's yesod (x 43, or 41 with R. Yose's altar), over the court's whole breadth (the Second
    // Temple's default). Kelim 1:9 "בין האולם ולמזבח מקודש ממנו, שאין בעלי מומין ופרועי ראש נכנסים לשם"; Joel 2:17 "בין האולם ולמזבח
    // יבכו הכהנים משרתי ה׳". The breadth and the end at the yesod - model choices. A place's feature (15 s).
    {
      const ZG = new Group();
      ZG.name = "zoneUlamAltar";
      ZG.visible = false;
      g.add(ZG);
      ctx.layers.zoneUlamAltar = ZG;
      const pm = new MeshBasicMaterial({ color: 0xff5a5a, transparent: true, opacity: 0.3, depthWrite: false }), fm = new MeshBasicMaterial({ color: 0xff5a5a });
      const unit = new BoxGeometry(1, 1, 1);
      const parts = [];
      for (let i = 0; i < 5; i++) { const m = new Mesh(unit, i ? fm : pm); m.userData.noPick = true; m.renderOrder = 2; ZG.add(m); parts.push(m); }
      const zl = { text: "בין האולם ולמזבח", x: 30, y: AZ + 3, z: 0, size: 2.2, layer: "zoneUlamAltar" };
      ctx.labels.push(zl);
      const z0 = -(CO2.AZ_W / 2 - 2.5), z1 = CO2.AZ_W / 2 - 2.5;   // between the walls' inner faces (z -+65)
      const fit = () => {
        const x0 = CO2.xUlamE, x1 = base().yw, y = AZ;
        const set = (m, w, h, d, x, yy, z) => { m.scale.set(w, h, d); m.position.set(x, yy, z); };
        set(parts[0], x1 - x0, 0.04, z1 - z0, (x0 + x1) / 2, y + 0.07, (z0 + z1) / 2);
        set(parts[1], x1 - x0, 0.22, 0.6, (x0 + x1) / 2, y + 0.11, z0);
        set(parts[2], x1 - x0, 0.22, 0.6, (x0 + x1) / 2, y + 0.11, z1);
        set(parts[3], 0.6, 0.22, z1 - z0, x0, y + 0.11, (z0 + z1) / 2);
        set(parts[4], 0.6, 0.22, z1 - z0, x1, y + 0.11, (z0 + z1) / 2);
        par_moveLabel(ctx, zl, (x0 + x1) / 2, y + 3, -30);
      };
      fit();
      watchers.push(fit);
      let on = false;
      ctx.shared.features.zoneUlamAltar = { key: "zoneUlamAltar", isOn: () => on, on: () => { on = true; fit(); ZG.visible = true; }, off: () => { on = false; ZG.visible = false; } };
      ctx.shared.ulamAltar = { get x1() { return base().yw; } };
    }

    // ---------- 3. THE TWO TABLES WEST OF THE RAMP - "שלחן החלבים" (SHULCHAN_210 of the Second Temple's 40-altar.js) ----------
    // Shekalim 6:4 (54:41) "ושנים במערב הכבש, אחד של שיש ואחד של כסף, על של שיש היו נותנים את האברים, על של כסף כלי שרת"; the marble
    // one is "שלחן החלבים" of Tamid 7:3 (88:40; the Rambam's commentary there; the Bartenura), by the altar's south-west corner as the
    // Ra'avad (Melechet Shlomo, Tamid 7:3; 1202:319) "שהרי במערבו של כבש היה השלחן היינו בקרן מערבית דרומית". In the altar's group (they
    // go with the row "מקום המזבח"); with R. Yose's altar (28) 2 west and 2 south. West of the path to the yesod (Rashi's small ramp, which
    // runs askew from the big ramp to the yesod's corner) and of the shitin's slab; 1.2 x 1.6, an amah and a half high ("שהוא גבוה" - the
    // Rosh, Tamid 33b). The measures and the exact spot - model choices. ctx.shared.rampTables = { marble: [x, z], silver: [x, z], top }
    // in the world's frame (getters), for the demonstrations (the trumpeters stand on the marble one - the user's decision 102).
    {
      const TG = new Group();
      TG.name = "rampTables";
      const silver = M2.bronze.clone();
      silver.color.set(0xcccccc);
      silver.color.set(0xe2e4e8);
      silver.metalness = 0.55;
      silver.roughness = 0.32;
      silver.emissive = new Color(0x2a2a2e);
      silver.emissiveIntensity = 0.5;
      const TW = 1.2, TD = 1.6, LEG = 1.25, TT = 0.25;
      const MB = [ACX - 15.4, 13.6], SV = [ACX - 15.4, 15.8];   // x 39.6 (the yesod's west face at 43), z 13.6 / 15.8 (its south face at 12): off the view of the small ramps (flyPoints.mizbeachRamps)
      const mkTable = (mat, tx, tz) => {
        H2.box(TG, TW, TT, TD, mat, tx, AZ + LEG, tz);
        for (const lx of [-1, 1]) for (const lz of [-1, 1]) H2.box(TG, 0.16, LEG, 0.16, mat, tx + lx * (TW / 2 - 0.12), AZ, tz + lz * (TD / 2 - 0.12));
      };
      mkTable(M2.marble, MB[0], MB[1]);
      mkTable(silver, SV[0], SV[1]);
      const ag = altarG();
      (ag || g).add(TG);
      const L1 = { text: "שלחן של שיש — שלחן החלבים", x: MB[0] - 0.8, y: AZ + 5.6, z: MB[1], size: 0.9 };
      const L2 = { text: "שלחן של כסף — לכלי שרת", x: SV[0] - 0.8, y: AZ + 4.8, z: SV[1], size: 0.9 };
      ctx.labels.push(L1, L2);
      const off = () => (yose() ? [-2, 2] : [0, 0]);
      const follow = () => {
        const [ox, oz] = off(), dz = ag ? altarDz() : 0;
        TG.position.set(ox, 0, oz);
        par_moveLabel(ctx, L1, MB[0] + ox - 0.8, AZ + 5.6, MB[1] + oz + dz);
        par_moveLabel(ctx, L2, SV[0] + ox - 0.8, AZ + 4.8, SV[1] + oz + dz);
      };
      follow();
      watchers.push(follow);
      ctx.shared.rampTables = {
        get marble() { const [ox, oz] = off(); return [MB[0] + ox, MB[1] + oz + altarDz()]; },
        get silver() { const [ox, oz] = off(); return [SV[0] + ox, SV[1] + oz + altarDz()]; },
        top: LEG + TT, floor: AZ
      };
      ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    }

    // ---------- 4. THE THREE FIREPANS (the Second Temple's 50-heichal.js, section 3) ----------
    // Mishnah Yoma 4:4 (55:34) "בכל יום היה חותה בשל כסף ומערה בתוך של זהב, והיום חותה בשל זהב ובה היה מכניס. בכל יום חותה בשל ארבעת
    // קבין ומערה בתוך של שלשת קבין... בכל יום היתה כבדה, והיום קלה. בכל יום היתה ידה קצרה, והיום ארכה. בכל יום היה זהבה ירוק, והיום אדם";
    // Yoma 44b (107:1129-1130) "גלדה עבה, והיום רך"; "והיום היה לה ניאשתיק" - Rashi (2157:1718) "טבעת בראשה". Side by side on the court's
    // floor by the altar's south-west corner, west of the two tables, only to be compared: their measures, forms and place - model
    // choices. A hidden group in the altar's group, shown by its place (the feature "machtot").
    {
      const MG = new Group();
      MG.name = "machtot";
      MG.visible = false;
      const ag = altarG();
      (ag || g).add(MG);
      ctx.layers.machtot = MG;
      const silverM = new MeshStandardMaterial({ color: 0xd9d9de, metalness: 0.85, roughness: 0.3 });
      const goldGreen = new MeshStandardMaterial({ color: 0xc8b04a, metalness: 0.9, roughness: 0.32 });
      const goldRed = new MeshStandardMaterial({ color: 0xd88a3a, metalness: 0.9, roughness: 0.3 });
      const coalM = new MeshStandardMaterial({ color: 0x2a1408, emissive: 0xc8400c, emissiveIntensity: 0.8, roughness: 0.9 });
      const part = (q, geo, mat, x, y, z) => { const m = new Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; q.add(m); return m; };
      // a pan: the floor and four sides, w x d, h high, the sides th thick (an open box)
      const pan = (q, mat, w, h, d, th) => {
        part(q, new BoxGeometry(w, th, d), mat, 0, th / 2, 0);
        part(q, new BoxGeometry(w, h, th), mat, 0, h / 2, d / 2 - th / 2);
        part(q, new BoxGeometry(w, h, th), mat, 0, h / 2, -d / 2 + th / 2);
        part(q, new BoxGeometry(th, h, d), mat, w / 2 - th / 2, h / 2, 0);
        part(q, new BoxGeometry(th, h, d), mat, -w / 2 + th / 2, h / 2, 0);
      };
      const MX = ACX - 17.6, MZ = [13.2, 14.8, 16.4];   // x 37.4, west of the tables (x 39..40.2)
      const one = (z, mat, w, d, h, th, handle, coals, ring) => {
        const q = new Group();
        q.position.set(MX, AZ, z);
        q.rotation.y = Math.PI / 2;          // the pan's own z -> the world's x; its handle (toward -z) -> the west
        MG.add(q);
        pan(q, mat, w, h, d, th);
        part(q, new BoxGeometry(0.05, 0.04, handle), mat, 0, h * 0.62, -d / 2 - handle / 2);
        if (coals) part(q, new BoxGeometry(w - 2 * th - 0.02, 0.05, d - 2 * th - 0.02), coalM, 0, h * 0.55, 0);
        if (ring) { const r = part(q, new TorusGeometry(0.06, 0.014, 8, 18), mat, 0, h * 0.62 - 0.065, -d / 2 - handle); r.rotation.y = Math.PI / 2; }
      };
      one(MZ[0], silverM, 0.5, 0.62, 0.2, 0.045, 0.34, false, false);      // every day: of silver, four kav
      one(MZ[1], goldGreen, 0.46, 0.56, 0.18, 0.045, 0.34, true, false);    // every day: of gold, three kav, thick, a short handle
      one(MZ[2], goldRed, 0.46, 0.56, 0.18, 0.018, 0.95, true, true);       // the day's: of red gold, three kav, thin, a long handle, the ring
      const LB = [
        { text: "1 · בכל יום — של כסף, ארבעת קבין", x: MX + 0.3, y: AZ + 0.95, z: MZ[0], size: 0.4, layer: "machtot" },
        { text: "2 · בכל יום — של זהב, שלושת קבין", x: MX + 0.3, y: AZ + 1.55, z: MZ[1], size: 0.4, layer: "machtot" },
        { text: "3 · ביום הכיפורים — זהב אדום, ידה ארוכה", x: MX + 0.3, y: AZ + 2.15, z: MZ[2], size: 0.4, layer: "machtot" }
      ];
      const PAN_INFO = ["של כסף, ארבעת קבין — ״בכל יום היה חותה בשל כסף״", "של זהב, שלושת קבין — ״ומערה בתוך של זהב״", "של זהב אדום, ידה ארוכה — ״והיום חותה בשל זהב ובה היה מכניס״"];
      const LN = ["1", "2", "3"].map((n, i) => ({ text: n, x: MX, y: AZ + 0.42, z: MZ[i], size: 0.3, layer: "machtot", title: "מחתה " + n,
        info: "מחתה " + n + ": " + PAN_INFO[i] + " (יומא ד, ד). ראו בלוח: ״שלוש המחתות — בכל יום וביום הכיפורים״.", refs: [["יומא ד, ד", { book: 55, index: 34 }]] }));
      ctx.labels.push(...LB, ...LN);
      const follow = () => {
        const ox = yose() ? -2 : 0, oz = yose() ? 2 : 0, dz = ag ? altarDz() : 0;
        MG.position.set(ox, 0, oz);
        LB.forEach((l, i) => par_moveLabel(ctx, l, MX + 0.3 + ox, l.y, MZ[i] + oz + dz));
        LN.forEach((l, i) => par_moveLabel(ctx, l, MX + ox, l.y, MZ[i] + oz + dz));
      };
      follow();
      watchers.push(follow);
      ctx.shared.features.machtot = { key: "machtot", isOn: () => MG.visible, on: () => { follow(); MG.visible = true; }, off: () => { MG.visible = false; } };
      ctx.shared.machtotAt = () => { const ox = yose() ? -2 : 0, oz = yose() ? 2 : 0; return [MX + ox, AZ, MZ[1] + oz + altarDz()]; };
    }

    // ---------- 5. THE PORTIONS OF YEHUDAH AND BINYAMIN (TRIBES_211 of the Second Temple's 57-add208.js) ----------
    // Yoma 12a (107:256): "מה היה בחלקו של יהודה — הר הבית, הלשכות והעזרות. ומה היה בחלקו של בנימין — אולם והיכל ובית קדשי הקדשים, ורצועה
    // היתה יוצאה מחלקו של יהודה ונכנסת לחלקו של בנימין, ובה היה מזבח בנוי"; Rashi there (2157:332); Zevachim 53b (130:1866) "וקרן מזרחית
    // דרומית לא היה לה יסוד... לפי שלא היתה בחלקו של טורף... מזבח אוכל בחלקו של יהודה אמה" (Rashi 2191:2590-2591 "אמה במזרחו אמה
    // בדרומו"). IN THIS HOUSE by the row "יסוד המזבח בדרום — ומקום המזבח" (ctx.shared.altarRTam, 40-altar.js): R. Tam's reading - the
    // First Temple's yesod ran as the Second's, so the portions as there: the east amah (its north end's amah out) and the south amah
    // (its west end's amah out) in Yehudah's, the strip from that south amah to the court's south wall; Tosafot's conclusion (the default)
    // - Tosafot Zevachim 61b (1936:659) "ובבית ראשון היה להם יסוד לדרום שהיה משוך בחלקו של טורף חוץ מרוח מזרחית שלא נשתנה שהיה בלא
    // יסוד (עד) חלקו של יהודה כמו בבית שני": the east amah as there; the south yesod in Binyamin's, and the strip south of it - three amot
    // south of the yesod's outline (the four amot the returnees added in the south, less the amah the altar ate in Yehudah's; how far -
    // a model choice, a question for the user). Gold - Yehudah's, blue - Binyamin's, dark gold - the strip. A place's feature (untimed).
    {
      const TG = new Group();
      TG.name = "tribes";
      TG.visible = false;
      g.add(TG);
      ctx.layers.tribes = TG;
      const unit = new BoxGeometry(1, 1, 1);
      const mk = (color, op) => {
        const g2 = new Group();
        const pm = new MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false }), fm = new MeshBasicMaterial({ color });
        const pool = [];
        TG.add(g2);
        const piece = (i, mat) => { if (!pool[i]) { pool[i] = new Mesh(unit, mat); pool[i].userData.noPick = true; pool[i].renderOrder = 2; g2.add(pool[i]); } pool[i].visible = true; pool[i].material = mat; return pool[i]; };
        let n = 0;
        return { begin() { n = 0; }, end() { for (let i = n; i < pool.length; i++) pool[i].visible = false; },
          fit(x0, x1, z0, z1, y, edges = [1, 1, 1, 1]) {
            if (x1 - x0 < 0.05 || z1 - z0 < 0.05) return;
            const d = z1 - z0, zc = (z0 + z1) / 2, w = x1 - x0, xc = (x0 + x1) / 2;
            const p0 = piece(n++, pm); p0.scale.set(w, 0.04, d); p0.position.set(xc, y + 0.08, zc);
            if (edges[0]) { const b = piece(n++, fm); b.scale.set(w, 0.22, 0.45); b.position.set(xc, y + 0.13, z0); }
            if (edges[1]) { const b = piece(n++, fm); b.scale.set(w, 0.22, 0.45); b.position.set(xc, y + 0.13, z1); }
            if (edges[2]) { const b = piece(n++, fm); b.scale.set(0.45, 0.22, d); b.position.set(x0, y + 0.13, zc); }
            if (edges[3]) { const b = piece(n++, fm); b.scale.set(0.45, 0.22, d); b.position.set(x1, y + 0.13, zc); }
          },
          column(x0, x1, z0, z1, y0, y1) { const c = piece(n++, pm); c.scale.set(x1 - x0, y1 - y0, z1 - z0); c.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); } };
      };
      const YE = mk(0xe39b12, 0.52), YS = mk(0xd98a00, 0.6), BI = mk(0x3d7fd6, 0.42);
      const TL1 = { text: "חלקו של יהודה — ממזרח לקו: החצר שממזרח למזבח והחצר החיצונה (רש״י יומא יב.)", x: 0, y: AZ + 2.8, z: 0, size: 1.7, layer: "tribes" };
      const TL2 = { text: "חלקו של בנימין — המזבח, האולם, ההיכל ובית קדשי הקדשים", x: 0, y: AZ + 2.8, z: 0, size: 1.7, layer: "tribes" };
      const TL3 = { text: "", x: 0, y: AZ + 2.4, z: 0, size: 1.5, layer: "tribes" };
      const TL4 = { text: "", x: 0, y: AZ + 11.5, z: 0, size: 1.3, layer: "tribes" };
      const TL5 = { text: "הר הבית — צדו המזרחי בחלקו של יהודה (רש״י יומא יב.)", x: 290, y: 2.6, z: -120, size: 3.2, layer: "tribes" };
      // the strip's and the band's texts by the reading (two labels each; the one of the reading on - a layer of its own)
      const LT = new Group(), LR = new Group();
      LT.name = "tribesTosafot"; LR.name = "tribesRTam";
      g.add(LT, LR);
      ctx.layers.tribesTosafot = LT; ctx.layers.tribesRTam = LR;
      const TL3T = { text: "הרצועה — מחלקו של יהודה, מדרום ליסוד הדרומי, שהיה ״משוך בחלקו של טורף״ (תוספות זבחים סא:); מקומה — בחירת מודל", x: 0, y: AZ + 2.4, z: 0, size: 1.5, layers: ["tribes", "tribesTosafot"] };
      const TL3R = { text: "הרצועה — מחלקו של יהודה, מאמתו הדרומית של המזבח ועד כותל החצר (ר״ת; עד היכן — בחירת מודל)", x: 0, y: AZ + 2.4, z: 0, size: 1.5, layers: ["tribes", "tribesRTam"] };
      const TL4T = { text: "״מזבח אוכל בחלקו של יהודה אמה״ — במזרח; לכן אין יסוד בקרן דרומית מזרחית (זבחים נג:)", x: 0, y: AZ + 11.5, z: 0, size: 1.3, layers: ["tribes", "tribesTosafot"] };
      const TL4R = { text: "״מזבח אוכל בחלקו של יהודה אמה״ — במזרח ובדרום (זבחים נג:)", x: 0, y: AZ + 11.5, z: 0, size: 1.3, layers: ["tribes", "tribesRTam"] };
      void TL3; void TL4;
      ctx.labels.push(TL1, TL2, TL3T, TL3R, TL4T, TL4R, TL5);
      let on = false;
      const ZS = CO2.AZ_W / 2 - 2.5, ZN = -ZS, XE = CO2.AZ_L / 2 - 2.5, XW = -XE;   // the court between its walls' inner faces (z -+65, x -+91)
      const apply = () => {
        const b = base(), dz = altarDz(), rt = !!(ctx.shared.altarRTam && ctx.shared.altarRTam.current === "rtam");
        const ax0 = b.x0, ax1 = b.x1, aN = b.z0 + dz, aS = b.z1 + dz, sx0 = ax0 + 1;
        const sz0 = rt ? aS - 1 : (b.ys + dz) + 3;   // the strip's north edge: the south amah (R. Tam), or three amot south of the yesod (Tosafot)
        YE.begin(); YS.begin(); BI.begin();
        YE.fit(ax1, XE, ZN, ZS, AZ, [1, 1, 1, 1]);                                       // Yehudah's: the court east of the line on the altar's east face
        if (ctx.shared.newCourt) { const nc = ctx.shared.newCourt; YE.fit(nc.x0 + 1, nc.x1 - 1, nc.z0 + 1, nc.z1 - 1, nc.y, [1, 1, 1, 1]); }   // and the outer court
        YS.fit(sx0, ax1, sz0, ZS, AZ, [1, 1, 1, 0]);                                       // the strip, to the court's south wall
        YS.column(ax1 - 1, ax1, aN + 1, aS, AZ, AZ + 9.3);                                 // the altar's east band (its north end's amah out)
        if (rt) YS.column(sx0, ax1 - 1, aS - 1, aS, AZ, AZ + 9.3);                         // R. Tam: and its south band (its west end's amah out)
        BI.fit(XW, sx0, ZN, ZS, AZ, [1, 1, 1, 1]);                                         // Binyamin's: west of the strip's line, the whole breadth
        BI.fit(sx0, ax1, ZN, sz0, AZ, [1, 1, 0, 1]);                                       // and north of the strip, to the line on the altar's east face
        YE.end(); YS.end(); BI.end();
        LT.visible = !rt; LR.visible = rt;
        par_moveLabel(ctx, TL1, (ax1 + XE) / 2 + 1, AZ + 2.8, -30);
        par_moveLabel(ctx, TL2, -10, AZ + 2.8, -55);
        par_moveLabel(ctx, TL3T, (sx0 + ax1) / 2, AZ + 2.4, (sz0 + ZS) / 2 + 3);
        par_moveLabel(ctx, TL3R, (sx0 + ax1) / 2, AZ + 2.4, (sz0 + ZS) / 2 + 3);
        par_moveLabel(ctx, TL4T, ax1 + 1, AZ + 11.5, aS + 1);
        par_moveLabel(ctx, TL4R, ax1 + 1, AZ + 11.5, aS + 1);
        TG.visible = on;
      };
      watchers.push(() => { if (on) apply(); });
      ctx.shared.features.tribes = { key: "tribes", timed: false, isOn: () => on, on: () => { on = true; apply(); }, off: () => { on = false; TG.visible = false; LT.visible = LR.visible = false; } };
    }

    // ---------- 6. THE WINDOWS OF BEIT HACHALIFOT, WHERE THE KNIVES WERE KEPT (CHALIFOT_WINDOWS_B2 of the Second Temple's 50-heichal.js) ----------
    // Middot 4:7 (89:34) "והוא היה נקרא בית החליפות, ששם גונזים את הסכינים"; Sukkah 5:8 (56:58) "בלגה לעולם חולקת בדרום, וטבעתה קבועה,
    // וחלונה סתומה"; Rashi there (2163:2731) "חלונות היו בבית החליפות בעובי כותלי התאים שבצפונו של היכל ששם גונזין את סכיניהן כדתנן במסכת
    // מדות (פ"ד משנה ז) וסתמו חלונה של בילגה". Twenty-four windows, one for each of the watches of I Chr 24:7-18 (38:795-806), in the north
    // wing (50-heichal.js: the wing's room z -16..-36, x 2.5..12.5, its floor at 12), on its west face - the wall against the chambers'
    // run ("בעובי כותלי התאים"), three rows of eight, two knives in each. Bilga's (the fifteenth lot, I Chr 24:14) is OPEN here: "וכששמעו
    // חכמים בדבר, קבעו את טבעתה וסתמו את חלונה" - "כשנכנסו יוונים להיכל" (Sukkah 56b, 108:1467), in the Second Temple's days; for "ויש
    // אומרים: משמרתו שוהה לבא" (108:1468) no time is said - open, a model choice. Until fix-c the house had 24 plain niches of a model
    // choice in both wings (removed from 50-heichal.js). The windows' size, height and places - model choices.
    {
      const F = LV2.HEI, XF = CO2.xHouseE;   // 12; the wing room's west face, x 2.5
      const nDark = new MeshBasicMaterial({ color: 0x17110b });
      const bladeM = new MeshStandardMaterial({ color: 0xb9bcc0, metalness: 0.85, roughness: 0.3 });
      const handleM = new MeshStandardMaterial({ color: 0x5a3c22, roughness: 0.8 });
      const frameM = M2.stoneSmooth;
      const tmp = new Group();
      for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) {
        const z = -18.2 - c * 2.3, y = F + 2.4 + r * 1.3, x = XF + 0.02;
        const d = new Mesh(new PlaneGeometry(0.8, 0.8), nDark); d.position.set(x, y, z); d.rotation.y = Math.PI / 2; tmp.add(d);
        for (const [fz, fy, fw, fh] of [[0, 0.46, 1.0, 0.12], [0, -0.46, 1.0, 0.12], [-0.46, 0, 0.12, 0.8], [0.46, 0, 0.12, 0.8]]) {
          const f = new Mesh(new BoxGeometry(0.1, fh, fw), frameM); f.position.set(XF + 0.05, y + fy, z + fz); tmp.add(f);
        }
        for (const sz of [-0.18, 0.12]) {   // two knives lying in the window, their handles to the north
          const b = new Mesh(new BoxGeometry(0.07, 0.012, 0.34), bladeM); b.position.set(XF + 0.07, y - 0.36, z + sz + 0.08); tmp.add(b);
          const h = new Mesh(new BoxGeometry(0.05, 0.03, 0.14), handleM); h.position.set(XF + 0.07, y - 0.36, z + sz - 0.16); tmp.add(h);
        }
      }
      const WG = new Group();
      WG.name = "chalifotWindows";
      g.add(WG);
      par_mergeInto(WG, tmp, { noPick: true });
      ctx.labels.push({ text: "בית החליפות — ״ששם גונזים את הסכינים״ (מידות ד, ז): כ״ד חלונות, אחד לכל משמר", x: XF + 1.2, y: F + 6.9, z: -26.25, size: 0.9 });
      ctx.shared.flyPoints = ctx.shared.flyPoints || {};
      // from the east and above, over the ulam's front and roof (the place opens them for 20 s, as the pill "פתח את האולם")
      ctx.shared.flyPoints.chalifotWindows = { pos: [27, F + 17, -26.25], target: [XF, F + 3.4, -26.25] };
    }

    // ---------- 7. THE PILGRIM'S WALK AT A MAN'S EYE (PILGRIM_B2 of the Second Temple's 57-add208.js) ----------
    // Middot 2:2 (89:13): "כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל, חוץ ממי שארעו דבר, שהוא מקיף לשמאל"; the
    // Bartenura there (643:64): "כגון הנכנסים דרך שערי חלדה שהן מן הימין, מקיפין דרך שער הטדי". IN THIS HOUSE (the user's decision 111:
    // the way by the First Temple's own building, which has one gate on each side and no women's court): in by the southern gate - named
    // here "שער חולדה" - from the landing of the king's ascent before it, to the right (east) along the south of the great court, north
    // along its east (by the outer court and the eastern gate), west along its north, and out by the northern gate - "שער טדי". The walk
    // engine of 50-heichal.js (ctx.shared.walk); the eye 3.2 over the floor. The way and the pace - model choices; the order is the
    // Mishnah's, said in the Second Temple's days (the card says so).
    {
      const EY = 3.2, Y = LV2.HAR + EY;
      const KEYS = [
        // RAMP13_420 (the user's "ג"): up the king's winding ascent (60-palace.js) - from the king's court's gate west along its lower run, round
        // its landing, east along its upper run to the landing at the gate, and in
        [0, [104, -10 + EY, 351], [84, -5 + EY, 348]], [1.6, [89, -6.97 + EY, 348], [77, -4.97 + EY, 343]], [3.0, [79, -4.97 + EY, 344], [92, -2 + EY, 339.5]],
        [4.6, [93, -1.63 + EY, 339.5], [103, Y, 337]], [5.8, [103, Y, 338], [103, Y, 316]], [7, [103, Y, 320], [126, Y, 314]],
        [10, [128, Y, 313], [200, Y, 311]], [18, [252, Y, 311], [318, Y, 292]], [24, [314, Y, 272], [318, Y, 200]],
        [31, [318, Y, 140], [318, Y, 60]], [37, [318, Y, 22], [348, Y, 0]], [41, [318, Y, -18], [318, Y, -100]],
        [47, [314, Y, -128], [250, Y, -140]], [55, [190, Y, -141], [120, Y, -145]], [61, [116, Y, -148], [103, Y + 2, -170]],
        [65, [103, Y, -158], [103, Y + 3, -190]], [68, [103, Y, -171], [103, Y - 8, -215]]
      ];
      const CAPS = [
        [0, "״כל הנכנסין להר הבית נכנסין דרך ימין ומקיפין ויוצאין דרך שמאל״ (מידות ב, ב)"],
        [4, "״כגון הנכנסים דרך שערי חלדה שהן מן הימין, מקיפין דרך שער הטדי״ (ברטנורא שם)"],
        [8, "נכנסים בשער הדרומי — שער חולדה — ופונים לימין, מזרחה"],
        [25, "צפונה, לאורך המזרח — מול החצר החיצונה והשער המזרחי"],
        [40, "״חוץ ממי שארעו דבר, שהוא מקיף לשמאל. מה לך מקיף לשמאל — שאני אבל, השוכן בבית הזה ינחמך״ (מידות ב, ב)"],
        [48, "מערבה, לאורך הצפון"],
        [60, "ויוצאים בשער הצפוני — שער טדי — דרך שמאל. המשנה נאמרה בימי הבית השני; המסלול בבית ראשון — בחירת מודל"]
      ];
      const PW = { run: false, saved: null };
      const finish = () => {
        PW.run = false;
        const sv = PW.saved;
        if (sv && sv.lg) sv.lg.visible = sv.labels;
        if (sv && sv.view && ctx.shared.viewLimits) ctx.shared.viewLimits.set(sv.view);
        if (sv && sv.fade != null && ctx.shared.fadeState) ctx.shared.fadeState.on = sv.fade;
        PW.saved = null;
      };
      const start = () => {
        const Wk = ctx.shared.walk;
        if (!Wk) return false;
        if (typeof ctx.shared.stopDemos === "function") ctx.shared.stopDemos("pilgrimWalk");
        let lg = null; try { lg = ctx.root.getObjectByName("labels"); } catch (_) {}
        PW.saved = { lg, labels: lg ? lg.visible : true, view: ctx.shared.viewLimits ? ctx.shared.viewLimits.get() : null, fade: ctx.shared.fadeState ? ctx.shared.fadeState.on : null };
        if (lg) lg.visible = false;
        if (ctx.shared.fadeState) ctx.shared.fadeState.on = false;   // at a man's eye nothing is see-through: the gates he walks through stay whole
        if (ctx.shared.viewLimits) for (const k of KEYS) { ctx.shared.viewLimits.include(k[1]); ctx.shared.viewLimits.include(k[2]); }
        PW.run = true;
        Wk.run(KEYS, CAPS, finish);
        return true;
      };
      const stop = () => { if (!PW.run) return; const Wk = ctx.shared.walk; if (Wk && Wk.on) Wk.stop(); else finish(); };
      const walkStop = () => (ctx.shared.demoStops || []).find((q) => q.id === "walk");
      (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({ id: "pilgrimWalk", running: () => PW.run, stop,
        pause: () => { const w = walkStop(); if (w && w.pause) w.pause(); },
        resume: () => { const w = walkStop(); if (w && w.resume) w.resume(); },
        paused: () => { const w = walkStop(); return !!(w && w.paused && w.paused()); }, restart: () => { stop(); start(); } });
      ctx.shared.pilgrimWalk = { start, stop, get on() { return PW.run; } };
    }

    // ---------- 8. THE WILLOW'S COMMANDMENT AND THE CIRCUIT OF THE ALTAR (ARAVAH_B2 of the Second Temple's 57-add208.js) ----------
    // Mishnah Sukkah 4:5 (56:44) "ובאין וזוקפין אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח... בכל יום מקיפין את המזבח פעם אחת"; Sukkah
    // 45a (108:1165-1166) eleven amot, "כדי שיהו גוחות על גבי המזבח אמה"; "על היסוד מנח להו". From Rav Chaim Kanievsky, as brought in
    // Chalamish: many willows, thick at the foot, only where there is a yesod; perhaps not in the east and the south. IN THIS HOUSE: on the
    // yesod of the bronze altar (40-altar.js) along its north and west, as in the Second Temple (in Tosafot's reading of the First Temple's
    // yesod it ran along the south too, under the ramp - not drawn there: a model choice); eleven amot from the yesod's top (7) to 18, the
    // heads bent over the top (16). The circuit by the row "הקפת המזבח בערבה" (c1): priests alone (the default; Rashi Sukkah 43b), or
    // Israelites too (the Or Zarua in the name of the Yerushalmi). The way round the altar and its ramp keeps off the ten bases (45-vessels.js,
    // their block x 19..41) and the two tables. No tefillin - Chol HaMoed (ctx.shared.tefOff). The willows' number and form, the way, the
    // walkers' number and pace - model choices. In the altar's group: it goes with the row "מקום המזבח".
    {
      const AG = new Group();
      AG.name = "aravahDemo";
      AG.visible = false;
      const agp = altarG();
      (agp || g).add(AG);
      ctx.layers.aravahDemo = AG;
      const YT = AZ + 1;   // the yesod's top
      const AR = { circuit: "priests", built: false, walkers: { priests: [], all: [] }, t0: 0 };
      const trunkM = new MeshStandardMaterial({ color: 0x6d6a3e, roughness: 0.85 });
      const leafM = new MeshStandardMaterial({ color: 0x6f9a52, roughness: 0.8, side: DoubleSide });
      const leafIM = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, side: DoubleSide });
      const WG = {};
      const willows = (key) => {
        if (WG[key]) return WG[key];
        const b = base();
        const WGr = WG[key] = new Group(); WGr.name = "aravahWillows_" + key; AG.add(WGr);
        const x0 = b.yw, x1 = b.x1 + 1, zN = -b.ys, zS = b.ys;   // the yesod's outline: west x0, north zN
        const trunks = [], leaves = [];
        let q = 22112026;
        const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const tubeOf = (pts, r0, r1, segs) => {
          const curve = new CatmullRomCurve3(pts), tube = new TubeGeometry(curve, segs, 1, 6, false), pos = tube.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const ring = Math.floor(i / 7), u = ring / segs, c = curve.getPointAt(u), r = r0 + (r1 - r0) * Math.pow(u, 0.6);
            pos.setXYZ(i, c.x + (pos.getX(i) - c.x) * r, c.y + (pos.getY(i) - c.y) * r, c.z + (pos.getZ(i) - c.z) * r);
          }
          trunks.push(tube);
          return curve;
        };
        const leafAlong = (curve, u0, n, spread) => {
          for (let k = 0; k < n; k++) {
            const u = u0 + (1 - u0) * Math.sqrt(rr()), p = curve.getPoint(Math.min(1, u)), a = rr() * Math.PI * 2, sp = 0.04 + rr() * spread;
            leaves.push([p.x + Math.cos(a) * sp, p.y + (rr() - 0.3) * 0.2, p.z + Math.sin(a) * sp, rr() * Math.PI * 2, 0.25 + rr() * 0.75, rr()]);
          }
        };
        const willow = (fx, fz, ix, iz) => {
          const H = 10.6 + rr() * 0.8, reach = 2.5 + rr() * 0.6, px = -iz, pz = ix, sw = (rr() - 0.5) * 0.5, pts = [];
          for (let i = 0; i <= 10; i++) {
            const u = i / 10, y = YT + H * (u < 0.8 ? u : 0.8 + (u - 0.8) * 0.55);
            const bend = u < 0.72 ? 0.1 * u : 0.072 + Math.pow((u - 0.72) / 0.28, 1.5) * reach;   // the head bends over the altar
            pts.push(new Vector3(fx + ix * bend + px * sw * u, y, fz + iz * bend + pz * sw * u));
          }
          const main = tubeOf(pts, 0.17 + rr() * 0.05, 0.035, 16);
          leafAlong(main, 0.38, 60, 0.3);
          const nb = 3 + Math.floor(rr() * 3);
          for (let k = 0; k < nb; k++) {
            const u0 = 0.3 + rr() * 0.4, p0 = main.getPoint(u0), side = (k % 2 ? 1 : -1) * (0.5 + rr() * 0.6), len = 1.8 + rr() * 1.8, inw = 0.3 + rr() * 0.6;
            const P = (t, up) => new Vector3(p0.x + px * side * t + ix * inw * t * t, p0.y + up, p0.z + pz * side * t + iz * inw * t * t);
            const bc = tubeOf([P(0, 0), P(0.45, len * 0.5), P(0.85, len * 0.85), P(1.2, len * 0.9 - 0.5)], 0.05, 0.015, 8);
            leafAlong(bc, 0.25, 32, 0.22);
          }
        };
        for (let x = x0 + 0.5, k = 0; x < x1 - 0.3; x += 0.95 + (rr() - 0.5) * 0.35, k++) willow(x, k % 2 ? zN + 0.65 : zN + 0.3, 0, 1);   // along the north, on the yesod
        for (let z = zN + 1.3, k = 0; z < zS - 0.5; z += 0.95 + (rr() - 0.5) * 0.35, k++) willow(k % 2 ? x0 + 0.65 : x0 + 0.3, z, 1, 0);   // along the west
        const tm = new Mesh(mergeGeometries(trunks), trunkM); tm.castShadow = true; tm.userData.noPick = true; WGr.add(tm);
        const lgeo = new PlaneGeometry(0.075, 0.46).translate(0, -0.23, 0);
        const im = new InstancedMesh(lgeo, leafIM, leaves.length);
        const mm = new Matrix4(), qq = new Quaternion(), e = new Euler(), vp = new Vector3(), vs = new Vector3(1, 1, 1), col = new Color();
        leaves.forEach(([x, y, z, a, t, c], i) => {
          qq.setFromEuler(e.set(t, a, 0, "YXZ")); mm.compose(vp.set(x, y, z), qq, vs); im.setMatrixAt(i, mm);
          im.setColorAt(i, col.setHSL(0.23 + c * 0.06, 0.34 + c * 0.16, 0.24 + c * 0.12));
        });
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        im.castShadow = true;
        im.instanceMatrix.needsUpdate = true; im.userData.noPick = true; WGr.add(im);
        return WGr;
      };
      const build = () => {
        if (AR.built) return;
        AR.built = true;
        try {
          const PP = tm_people(ctx), branchG = new CylinderGeometry(0.02, 0.03, 1.6, 5).translate(0, 0.8, 0);
          const lulavG = new CylinderGeometry(0.018, 0.026, 1.9, 5).translate(0, 0.95, 0), etrogG = new SphereGeometry(0.1, 10, 8).scale(1, 1.35, 1);
          const lulavM = new MeshStandardMaterial({ color: 0x5f7a3a, roughness: 0.8 }), etrogM = new MeshStandardMaterial({ color: 0xd9c23a, roughness: 0.6 });
          const twig = new BoxGeometry(0.04, 0.3, 0.006);
          // FOUR_K (fix-k, 23.11.2026 - the user via the coordinator: "הכהנים אמורים להקיף עם ארבעת המינים בנטילה, ולא סתם בסחיבה"): as the
          // Second Temple's (57-add208.js FOUR_K) - every walker holds the four species in netilah all the way round: the lulav with its hadassim
          // and aravot upright in his right hand, the etrog in his left, the two hands close before his chest (shared/frag/arm-k.js, the kit's
          // arms and hand.js's hands). Until now the priests carried a willow's branch aside in a hanging hand
          //@@include arm-k
          // ARAVAH_209_K (the user's decision 209: "כהנים בערבה, ומתג ישראל — עם ד' מינים"): in the reading "priests" (o0) each priest holds a
          // willow's branch upright in his right hand, in netilah and shaken (Rashi in the card: "ביד נוטלין אותה ומנענעים ומקיפין בה"); in the
          // reading "all" (o1) every walker, priest and Israelite, the four species - the lulav in his right hand and the etrog in his left. Each
          // priest holds both, one shown at a time (pose, below)
          const AK = tm_armK(typeof ark_kit === "function" ? ark_kit() : null), sleeveOf = {};
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
                const et = new Mesh(etrogG, etrogM); et.position.set(0.36, 1.3, 0.32); G.add(et);
              } else {
                const br = new Mesh(branchG, leafM); br.position.set(-0.36, 1.15, 0.3); br.rotation.z = 0.25; G.add(br);
                for (let j = 0; j < 7; j++) { const t = new Mesh(twig, leafM); t.position.set(-0.36 + 0.25 * (0.4 + j * 0.09) + (j % 2 ? 0.06 : -0.06), 1.15 + 1.6 * (0.4 + j * 0.09), 0.3); t.rotation.z = j % 2 ? -0.6 : 0.6; G.add(t); }
              }
              list.push(G);
            }
          };
          mk("kohen", 0xf1ede2, AR.walkers.priests, 14, "aravahPriest", false);
          mk("worker", [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50], AR.walkers.all, 18, "aravahIsraelite", true);
        } catch (e) { console.warn("[parallels] aravah walkers", e && e.message); }
      };
      // the labels follow the altar's place (pushed now: the labels are made once)
      const LB = [];
      for (const [text, x, y, z, size] of [
        ["״ובאין וזוקפין אותן בצדי המזבח, וראשיהן כפופין על גבי המזבח״ (סוכה ד, ה)", ACX, AZ + 15, -14.5, 1.6],
        ["הערבות על היסוד בלבד — מפי הגר״ח קניבסקי, כפי שהובא בחלמיש", ACX - 17, AZ + 13.2, 3.5, 1.2],
        ["״בכל יום מקיפין את המזבח פעם אחת, ואומרים, אנא ה׳ הושיעה נא״ (סוכה ד, ה)", ACX, AZ + 17.2, 13, 1.5]]) {
        const l = { text, x, y, z: z + 10, size, layer: "aravahDemo" };
        ctx.labels.push(l); LB.push([l, z]);
      }
      // the way round, in the altar's frame: round the altar and its ramp; west of the yesod by 1.6, and south of the yesod no further
      // west than x 41.9 (the bases' block reaches x 41, and it stays where it is when the altar moves)
      const pathOf = () => {
        const b = base(), foot = yose() ? 44 : 42, R = 2.5, P = [];
        const XW = b.yw - 1.6, XWS = Math.max(XW, 41.9), XE = b.x1 + 4, ZN = -b.ys - 2.5, ZS = foot + 3;
        const arc = (cx, cz, a0) => { for (let i = 0; i <= 6; i++) { const a = a0 + (Math.PI / 2) * i / 6; P.push([cx + R * Math.cos(a), cz + R * Math.sin(a)]); } };
        arc(XE - R, ZN + R, -Math.PI / 2); arc(XE - R, ZS - R, 0); arc(XWS + R, ZS - R, Math.PI / 2);
        if (XWS > XW + 0.01) { P.push([XWS, b.ys + 2.6]); P.push([XW, b.ys + 1.2]); }   // the jog round the yesod's south-west corner (R. Yose's)
        arc(XW + R, ZN + R, Math.PI);
        const L = [0]; for (let i = 1; i <= P.length; i++) { const a = P[i - 1], c = P[i % P.length]; L.push(L[i - 1] + Math.hypot(c[0] - a[0], c[1] - a[1])); }
        return { P, L, len: L[P.length] };
      };
      let PATH = null, pathKey = "";
      const at = (s) => {
        const { P, L, len } = PATH; s = ((s % len) + len) % len;
        let i = 1; while (i < L.length && L[i] < s) i++;
        const a = P[(i - 1) % P.length], c = P[i % P.length], u = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
        return [a[0] + (c[0] - a[0]) * u, a[1] + (c[1] - a[1]) * u, Math.atan2(a[0] - c[0], a[1] - c[1])];   // walking toward smaller s
      };
      const pose = () => {
        const t = (performance.now() - AR.t0) / 1000, sp = 2.4;
        const list = AR.circuit === "all" ? AR.walkers.priests.concat(AR.walkers.all) : AR.walkers.priests;
        for (const G of AR.walkers.priests.concat(AR.walkers.all)) if (!list.includes(G)) G.visible = false;
        if (!list.length || !PATH) return;
        const gap = PATH.len / list.length;
        list.forEach((G, i) => {
          const [x, z, yaw] = at(-t * sp + i * gap);
          G.position.set(x, AZ + Math.abs(Math.sin(t * 4.2 + i * 1.3)) * 0.05, z); G.rotation.y = yaw; G.visible = true;
          { const hs = G.userData.holds, want = AR.circuit === "all" ? "four" : "aravah";   // ARAVAH_209_K: the priest's - by the reading
            if (hs && G.userData.holdK !== want) { for (const o of hs[G.userData.holdK].parts) o.visible = false; for (const o of hs[want].parts) o.visible = true; G.userData.hold = hs[want]; G.userData.holdK = want; } }
          if (G.userData.hold && G.userData.hold.tick) G.userData.hold.tick(t + i * 0.37);   // FOUR_K: the willow shaken
        });
      };
      const sync = () => {
        const key = yose() ? "yose" : "chronicles", dz = agp ? altarDz() : 0;
        if (key !== pathKey) { PATH = pathOf(); pathKey = key; }
        const W = willows(key);
        for (const k in WG) WG[k].visible = WG[k] === W;
        for (const [l, z] of LB) if (Math.abs(l.z - (z + dz)) > 1e-6) par_moveLabel(ctx, l, l.x, l.y, z + dz);
      };
      const tefOn = (on) => { const TO = ctx.shared.tefOff || (ctx.shared.tefOff = new Set()); if (on) TO.add("aravah"); else TO.delete("aravah"); };
      ctx.shared.aravah = {
        get circuit() { return AR.circuit; },
        setCircuit(m) { AR.circuit = m === "all" ? "all" : "priests"; if (AG.visible) pose(); return AR.circuit; },
        show() { const F2 = ctx.shared.features.aravah; if (F2 && !F2.isOn()) F2.on(); }
      };
      ctx.shared.features.aravah = { key: "aravah", timed: false, isOn: () => AG.visible,
        on: () => { build(); sync(); AR.t0 = performance.now(); AR.pausedAt = null; AG.visible = true; tefOn(true); pose(); },
        off: () => { AG.visible = false; AR.pausedAt = null; tefOn(false); } };
      // DEMO_STOP_G (the user, 23.11.2026 01:18): any switch, place or view ends the circuit and takes its figures away (as every demonstration).
      // DEMO_PAUSE_ARAVAH_420: and the bar of the demonstrations - "השהה" holds the circuit where it is (the figures stay), "המשך" goes on from
      // there, "מההתחלה" starts it again
      AR.pausedAt = null;
      (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({ id: "aravahDemo1", continuous: true, running: () => AG.visible, stop: () => ctx.shared.features.aravah.off(),
        pause: () => { if (AG.visible && AR.pausedAt === null) AR.pausedAt = performance.now(); },
        resume: () => { if (AR.pausedAt !== null) { AR.t0 += performance.now() - AR.pausedAt; AR.pausedAt = null; } },
        paused: () => AG.visible && AR.pausedAt !== null,
        restart: () => { const F2 = ctx.shared.features.aravah; F2.off(); F2.on(); } });
      ctx.animated.push(() => { if (!AG.visible || AR.pausedAt !== null) return; sync(); pose(); });
    }

    // ---------- 9. THE WATER'S LIBATION FROM THE SHILOACH - A DEMONSTRATION (SHILOACH_305 / SHILOACH_CHALAMISH_B2 of the Second Temple) ----------
    // Mishnah Sukkah 4:9 (56:48): "נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח. הגיעו לשער המים, תקעו והריעו ותקעו.
    // עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם... מערבי של מים, מזרחי של יין... ולמנסך אומרים לו, הגבה ידך"; Sukkah 5:4 (56:54) - the
    // two priests with trumpets "בשער העליון שיורד מעזרת ישראל לעזרת נשים... עד שמגיעין לשער היוצא מזרח... הפכו פניהן למערב"; Tamid 7:3
    // (88:40) - the deputy on the horn with the sudar, the two on the table of the fats. IN THIS HOUSE (the user's decision 111): the way by
    // the First Temple's own building - no women's court and no gates of Chulda. The inner court's east gate (its round steps go down to the
    // outer court - Rashi on I Kings 6:36 calls that court "עזרת נשים") stands for "השער העליון", the outer court's east gate for "השער היוצא
    // מזרח"; across the great court to its west gate and down its stairs to the valley, south along it to the spring in the south-west corner
    // of the City of David (the user's 117, renewed: ctx.shared.shiloachSpring1 - its place, the spout and the stream - the shared builder
    // of the Second Temple's spring, shared/frag/shiloach.js); back by the same way and stairs, and across the great court to the inner
    // court's south-eastern gate, which stands for "שער המים" (the easternmost of the south, as Middot 1:4 orders the
    // Second Temple's gates - a model choice), up the ramp, to the left, into the western bowl (40-altar.js: the bowls by the south-west horn).
    // The card says the order is the Mishnah's, said in the Second Temple's days. At night by torches, back at dawn (as Chalamish draws the
    // Second Temple's); no tefillin (ctx.shared.tefOff). The way, its times and the figures' places - model choices.
    {
      const SP1 = () => ctx.shared.shiloachSpring1 || null;
      // the priests are the First Temple's own priest-kit figures (58-ark.js ark_priestFig: the white kutonet, the avnet, the migba'at),
      // a grip in each hand for the flask and the sudar
      const K = (() => { try { return typeof ark_kit === "function" && typeof ark_priestFig === "function" ? ark_kit() : null; } catch (_) { return null; } })();
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), smooth = (u) => u * u * (3 - 2 * u), lerp = (a, b, u) => a + (b - a) * u;
      const fnc = (f) => typeof f === "function";
      const groundY = (x, z, from) => { const y = fnc(ctx.shared.floorY) ? ctx.shared.floorY(x, from == null ? 40 : from, z) : -Infinity; return isFinite(y) ? y : -28; };
      const mkPriest = (n) => {
        const f = ark_priestFig(n), KG = ark_kitArms();
        for (const A2 of [f.L, f.R]) { const grip = new Group(); grip.position.set(0, -(KG.P.fo + 0.08), 0.03); A2.el.add(grip); A2.grip = grip; }
        f.g.traverse((m) => { if (m.isMesh) m.userData.noPick = true; });
        f.g.name = "shiloachPriest1";
        f.g.visible = false;
        return f;
      };
      const setArm = (A2, v, side) => { A2.sh.rotation.set(v[0], 0, side * v[1]); A2.el.rotation.set(v[2], 0, 0); };
      const ARM = { rest: [0.05, 0.08, -0.15], carry: [-0.25, 0.1, -0.85], fill: [-1.05, 0.12, -0.35], pour: [-1.2, 0.1, -0.55], tR: [-1.42, 0.05, -0.2], tL: [-1.28, -0.06, -0.38] };
      // TRUMPET_HANDS_N11: the First Temple's priest-kit figure has its hand fixed on the forearm (no wrist), so the two who blow are given a wrist
      // with the kit's hand (K.handWr), as the Second Temple's mkPriest has: the hand closes round the trumpet and the wrist turns the ring along it
      const KGP = () => ark_kitArms().P;
      const wristOn = (f) => {
        const KG = ark_kitArms(), HWk = (K.handWr && K.handAt) ? true : false;
        for (const A2 of [f.L, f.R]) {
          if (!HWk || A2.wr) continue;
          if (A2.hand) A2.hand.visible = false;
          const wr = new Group(); wr.position.y = -KG.P.fo; A2.el.add(wr);
          A2.hand2 = new Mesh(K.handWr(A2.side, "rest"), K.mHand); A2.hand2.castShadow = true; A2.hand2.userData.noPick = true; wr.add(A2.hand2);
          A2.wr = wr;
          const G = K.handAt(A2.side, "grip");
          A2.grip.position.set(G.x, -KG.P.fo + G.y, G.z);
        }
      };
      const holdB2 = (A2) => { if (A2.hand2) A2.hand2.geometry = K.handWr(A2.side, "grip"); };
      const _gq = new Quaternion(), _gv = new Vector3();
      const gripAlign = (A2, qt) => {
        if (!A2.wr) return;
        A2.el.updateWorldMatrix(true, false);
        A2.el.getWorldQuaternion(_gq).invert();
        _gv.set(0, 1, 0).applyQuaternion(qt).applyQuaternion(_gq);
        const AX = K.handAt(A2.side, "gripAx"), G = K.handAt(A2.side, "grip");
        A2.wr.quaternion.setFromUnitVectors(AX, _gv);
        A2.grip.position.copy(G).applyQuaternion(A2.wr.quaternion);
        A2.grip.position.y -= KGP().fo;
        A2.grip.updateMatrixWorld(true);
      };
      // ---- TRUMPET_HANDS_N11 (the user: "בהדגמות כהנים עם חצוצרות - הכהנים לא אוחזים את החצוצרה בידיים"): the trumpet is in BOTH hands in
      // every frame - the right by the mouthpiece, the left along the tube - whether he blows (at the mouth), walks or stands (before the
      // chest, its bell up and forward). `up` 0..1 - from the carrying pose to the mouth. The trumpet is placed in the figure's lean frame
      // (f.tr), and each arm is solved to it (the shoulder's two turns and the elbow's, damped Gauss-Newton on the hand's ring); the
      // wrist then turns the ring to the tube's way (gripAlign) and the arm is solved again. The poses and the places on the tube - model choices
      const TRUH = (() => {
        const eul = new Euler(), qS = new Quaternion(), qE = new Quaternion(), vq = new Vector3(), vp = new Vector3(), vt = new Vector3(), qW = new Quaternion();
        const P0 = new Vector3(), P1 = new Vector3(), P2 = new Vector3(), P3 = new Vector3();
        // the hand ring's place in the lean frame, for the arm's angles a (shoulder x), b (its turn out), c (elbow x)
        const fk = (A2, a, b, c, out) => {
          eul.set(a, 0, A2.side * b, "XYZ"); qS.setFromEuler(eul);
          eul.set(c, 0, 0, "XYZ"); qE.setFromEuler(eul);
          out.copy(A2.grip.position).applyQuaternion(qE).add(vq.set(0, -KGP().up, 0)).applyQuaternion(qS).add(vp.set(A2.side * KGP().sx, KGP().sy, 0));
          return out;
        };
        const solve = (A2, T, iters) => {
          let [a, b, c] = A2.ik || [-1.2, 0.05, -0.8];
          for (let it = 0; it < iters; it++) {
            fk(A2, a, b, c, P0);
            const r0 = vt.copy(T).sub(P0);
            if (r0.lengthSq() < 1e-8) break;
            const e = 1e-3, J = [];
            fk(A2, a + e, b, c, P1); J.push(P1.clone().sub(P0).multiplyScalar(1 / e));
            fk(A2, a, b + e, c, P2); J.push(P2.clone().sub(P0).multiplyScalar(1 / e));
            fk(A2, a, b, c + e, P3); J.push(P3.clone().sub(P0).multiplyScalar(1 / e));
            // damped least squares: d = J^T (J J^T + l I)^-1 r
            const l = 0.02, M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], rr = [r0.x, r0.y, r0.z], g = (v, i) => (i === 0 ? v.x : i === 1 ? v.y : v.z);
            for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let q = i === j ? l : 0; for (let k = 0; k < 3; k++) q += g(J[k], i) * g(J[k], j); M[i][j] = q; }
            const det = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
            if (Math.abs(det) < 1e-12) break;
            const inv = (i, j) => { const i1 = (i + 1) % 3, i2 = (i + 2) % 3, j1 = (j + 1) % 3, j2 = (j + 2) % 3; return (M[j1][i1] * M[j2][i2] - M[j1][i2] * M[j2][i1]) / det; };
            const y = [0, 1, 2].map((i) => inv(i, 0) * rr[0] + inv(i, 1) * rr[1] + inv(i, 2) * rr[2]);
            a += J[0].x * y[0] + J[0].y * y[1] + J[0].z * y[2];
            b += J[1].x * y[0] + J[1].y * y[1] + J[1].z * y[2];
            c += J[2].x * y[0] + J[2].y * y[1] + J[2].z * y[2];
            a = Math.max(-2.9, Math.min(1.0, a)); b = Math.max(-1.1, Math.min(1.2, b)); c = Math.max(-2.75, Math.min(0.05, c));
          }
          A2.ik = [a, b, c];
          setArm(A2, [a, b, c], A2.side);
          return fk(A2, a, b, c, P0).distanceTo(T);
        };
        const SR = 0.16, SL = 0.56;   // where on the tube (from the mouthpiece) the right and the left hand hold it
        // the whole hold; returns the larger miss of the two hands (in amot)
        const hold = (f, up) => {
          const tr = f.tr, k = Math.max(0, Math.min(1, up));
          const my = K.HEAD_Y * K.FS - 0.17;
          tr.position.set(0, KGP().sy - 0.5 + (my - (KGP().sy - 0.5)) * k, 0.3 + (0.14 - 0.3) * k);
          tr.rotation.set(0.85 + (1.25 - 0.85) * k, 0, 0);
          tr.visible = true;
          tr.updateMatrix();
          let miss = 0;
          for (const [A2, s] of [[f.R, SR], [f.L, SL]]) {
            P0.set(0, s, 0).applyMatrix4(tr.matrix);
            const T = P0.clone();
            holdB2(A2);
            miss = Math.max(miss, solve(A2, T, 6));
            // the wrist turns the ring along the tube, then the arm is solved again to the ring's new place
            f.g.updateWorldMatrix(true, false);
            f.lean.updateWorldMatrix(true, false);
            A2.sh.updateMatrixWorld(true);
            tr.updateWorldMatrix(true, false);
            tr.getWorldQuaternion(qW);
            gripAlign(A2, qW);
            miss = Math.max(miss, solve(A2, T, 4));
            A2.sh.updateMatrixWorld(true);
          }
          return miss;
        };
        return { hold };
      })();
      // ---- the night (the Second Temple's 55-payis.js NIGHT, carried over: the sky's sun under the horizon, the lights low; the dawn)
      const NIGHT = ctx.shared.nightKit || (ctx.shared.nightKit = (() => {
        let sky = null, sun = null, hemi = null, saved = null, envOff = false;
        const P = {
          night: { el: -16, az: 0.15, sunI: 0.5, sunC: 0x8fa6d8, hemI: 1.35, hemC: 0x7f8fc4, gndC: 0x3d4668, fog: 0x0a0f1c, exp: 1.0 },
          alot: { el: -11, az: 0.15, sunI: 0.5, sunC: 0x94a9d8, hemI: 1.35, hemC: 0x7f8fc4, gndC: 0x3d4668, fog: 0x121829, exp: 1.0 },
          heir: { el: -2, az: 0.15, sunI: 0.7, sunC: 0xffd9b0, hemI: 1.3, hemC: 0xa0a6c0, gndC: 0x5a5a68, fog: 0x4a4a58, exp: 0.95 },
          morning: { el: 9, az: 0.2, sunI: 1.5, sunC: 0xffe2bd, hemI: 0.62, hemC: 0xa9b3c8, gndC: 0x4a4436, fog: 0x8d8f98, exp: 0.9 }
        };
        const find = () => {
          if (sky && sun && hemi) return true;
          for (const o of ctx.scene.children) {
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
          if (ctx.scene.fog) ctx.scene.fog.color.setHex(mixHex(A.fog, B.fog, k));
          ctx.renderer.toneMappingExposure = L(A.exp, B.exp);
        };
        return {
          P,
          begin() {
            if (!find() || saved) return !!saved;
            saved = { sp: sky.material.uniforms.sunPosition.value.clone(), sunI: sun.intensity, sunC: sun.color.getHex(), hemI: hemi.intensity,
              hemC: hemi.color.getHex(), gndC: hemi.groundColor.getHex(), fog: ctx.scene.fog ? ctx.scene.fog.color.getHex() : 0,
              exp: ctx.renderer.toneMappingExposure, env: ctx.scene.environment };
            return true;
          },
          set(a, b, k) {
            if (!saved) return;
            const A = P[a], B = P[b || a];
            apply(A, B, Math.max(0, Math.min(1, k || 0)));
            const dark = (A.el + (B.el - A.el) * (k || 0)) < 3;
            if (dark !== envOff) { envOff = dark; ctx.scene.environment = dark ? null : saved.env; }
          },
          end() {
            if (!saved) return;
            sky.material.uniforms.sunPosition.value.copy(saved.sp);
            sun.intensity = saved.sunI; sun.color.setHex(saved.sunC);
            hemi.intensity = saved.hemI; hemi.color.setHex(saved.hemC); hemi.groundColor.setHex(saved.gndC);
            if (ctx.scene.fog) ctx.scene.fog.color.setHex(saved.fog);
            ctx.renderer.toneMappingExposure = saved.exp;
            ctx.scene.environment = saved.env;
            envOff = false;
            saved = null;
          },
          get on() { return !!saved; }
        };
      })());
      const SHL = { D: null, run: false, night: false, saved: null };
      const AW = (x, lz) => [x, lz + altarDz()];   // in the altar's frame (the row "מקום המזבח" moves it)
      const yAt = (D2, x, z, near) => { const k = Math.round(x * 4) + "," + Math.round(z * 4) + "," + Math.round(near); let y = D2.ys.get(k); if (y === undefined) { y = groundY(x, z, near + 2.6); D2.ys.set(k, y); } return y; };
      const plen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
      const along = (pts, u) => {
        const L = plen(pts) * clamp(u, 0, 1);
        let acc = 0;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (acc + l >= L || i === pts.length - 1) { const f = l > 0 ? clamp((L - acc) / l, 0, 1) : 0; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[0] - a[0], b[1] - a[1])]; }
          acc += l;
        }
        return [pts[0][0], pts[0][1], 0];
      };
      // the beats (demo seconds; the walk engine runs them at ctx.shared.demoSlow)
      // (the user's decision 117, renewed 22.11.2026 14:35: the spring in the west - the way out by the great court's west gate, longer)
      const T = { walk0: 4.0, out1: 9.0, decl1: 11.8, east1: 18.8, steps1: 21.6, path1: 33.6, rim1: 34.8, fill0: 35.6, fill1: 38.6, back0: 39.6,
        backS: 51.6, back1: 54.0, wg0: 61.0, wg1: 63.4, blow0: 63.6, blow1: 67.8, in1: 70.6, ramp1: 75.0, top1: 77.8, pour0: 78.4, pour1: 82.0, end: 84.6 };
      const FILL_LEAN = 0.1, POUR_LEAN = 0.08, TILT = 1.62;
      const QG = new Quaternion(), QT = new Quaternion(), AX = new Vector3(), NECK = new Vector3(0, -0.21, 0), MOUTH = new Vector3(0, 0.3, 0), V1 = new Vector3();
      const setJug = (fig, jug, tilt, yaw) => {
        fig.g.updateMatrixWorld(true);
        fig.R.grip.getWorldQuaternion(QG).invert();
        QT.setFromAxisAngle(AX.set(Math.cos(yaw), 0, -Math.sin(yaw)), tilt);
        jug.quaternion.copy(QG).multiply(QT);
        jug.position.copy(NECK).applyQuaternion(QT).applyQuaternion(QG);
        jug.updateMatrixWorld(true);
      };
      const mouthW = (jug, out) => jug.localToWorld(out.copy(MOUTH));
      const measure = (D2, arm, lean, tilt) => {   // the flask's mouth from his feet, his face to +z
        const p = D2.p;
        p.g.position.set(0, 0, 0); p.g.rotation.y = 0;
        p.lean.position.set(0, 0, 0); p.lean.rotation.x = lean;
        setArm(p.R, arm, -1);
        setJug(p, D2.flask, tilt, 0);
        const m = mouthW(D2.flask, new Vector3()), o = p.g.getWorldPosition(new Vector3());
        return { x: m.x - o.x, y: m.y - o.y, z: m.z - o.z };
      };
      // the bowls of the libations (40-altar.js: by the south-west horn, on the top; R. Yose's altar takes them 2 west and 2 south)
      const BOWL = () => (yose() ? AW(ACX - 10.7, 10.6) : AW(ACX - 8.7, 8.6));   // the western, of the water
      const bowlY = () => { const B = BOWL(), k = Math.round(B[1] * 10) + (yose() ? 1000 : 0); if (SHL.byK !== k) { SHL.byK = k; SHL.by = groundY(B[0], B[1], 22); } return SHL.by; };
      const standP = () => { const B = BOWL(), o = SHL.offP || { x: 0, z: 0.9 }; return [B[0] - o.x, B[1] - o.z]; };
      // NO BOWLS IN THIS HOUSE (the user's 168 a, after 139): poured on the top at the south-west horn, and the water goes down - Rashi on
      // Zevachim 61b (2191:2950): "ובימי שלמה היה כמין בור כרוי אצל המזבח באותה זוית לירד הנסכים בתוכו ויורדין מן המזבח ולרצפה ושותתין שם".
      // The way of the water (a model choice): from where it falls on the top west to the west face, past the horn, then down the steps
      // of the sovev and the yesod to the floor and along it into the pit by the yesod's corner (40-altar.js of 139: x SHX - 0.55, z SHZ +
      // 0.55; R. Yose's altar 2 west and 2 south). The surfaces are probed (ctx.shared.floorY), so any altar of the row draws its own steps.
      const PIT = () => { const d = yose() ? 14 : 12; return AW(ACX - d - 0.55, d + 0.55); };
      const cascadePts = () => {
        const B = BOWL(), P = PIT(), d = yose() ? 12 : 10, A = AW(ACX - d - 0.35, B[1] - altarDz());
        const pts = [], seg = (a, b, n) => { for (let i = pts.length ? 1 : 0; i <= n; i++) pts.push([lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n)]); };
        seg(B, A, 16); seg(A, P, 40);
        let lo = Infinity; const out = [];
        for (const [x, z] of pts) { const y = groundY(x, z, 26); lo = Math.min(lo, y); out.push([x, lo, z]); }
        return out;
      };
      // under the spring's fall, his face to its cliff (the kit's frame turned by its yaw: the figure's own offsets turned with it)
      const standF = () => {
        const S = SP1(), o = SHL.offF || { x: 0, z: 0.9 };
        if (!S) return [0, 0];
        if (S.kit && S.kit.lake && S.kit.standFor) { const q = S.kit.standFor(o); return [q.x, q.z]; }   // NATURAL_POOL (decision 122 b): on the bank, beside the fall
        const y = S.yaw || 0, c = Math.cos(y), n = Math.sin(y);
        return [S.spout[0] - (o.x * c + o.z * n), S.spout[2] - (-o.x * n + o.z * c)];
      };
      const standYaw = () => { const S = SP1(); if (!S) return 0; if (S.kit && S.kit.lake && S.kit.standFor) return S.kit.standFor(SHL.offF || { x: 0, z: 0.9 }).yaw; return S.yaw || 0; };
      const buildDemo = () => {
        if (SHL.D) return SHL.D;
        const DG = new Group();
        DG.name = "shiloachDemo1";
        DG.visible = false;
        ctx.root.add(DG);
        const p = mkPriest(2), t1 = mkPriest(4), t2 = mkPriest(6);
        for (const f of [p, t1, t2]) DG.add(f.g);
        const gold = new MeshStandardMaterial({ color: 0xd8ad45, metalness: 0.9, roughness: 0.28 });
        const jugGeo = () => mergeGeometries([   // a golden jug with a handle and a lip, as Chalamish draws it (the Second Temple's)
          new LatheGeometry([[0.001, 0], [0.065, 0], [0.105, 0.045], [0.118, 0.12], [0.098, 0.19], [0.05, 0.235], [0.044, 0.27], [0.062, 0.3], [0.001, 0.3]].map(([r, y]) => new Vector2(r, y)), 20),
          new TorusGeometry(0.075, 0.013, 6, 14, Math.PI * 1.15).rotateZ(-Math.PI * 0.62).translate(-0.1, 0.17, 0),
          new ConeGeometry(0.03, 0.08, 8, 1, true).rotateZ(-Math.PI / 2.6).translate(0.07, 0.29, 0)]);
        const flask = new Mesh(jugGeo(), gold);
        flask.castShadow = true; flask.userData.noPick = true; flask.position.set(0, -0.2, 0.02);
        p.R.grip.add(flask);
        const fwater = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true), tm_water(new MeshStandardMaterial({ color: 0x7fc0f0, transparent: true, opacity: 0.8, roughness: 0.1 }), { mode: "fall", scale: 0.3 }));   // WATER_420
        fwater.visible = false; DG.add(fwater);
        // the water going down from the top to the floor and the pit (NO_BOWLS_168): falls and sheets, rebuilt when the altar changes
        const cascade = new Group(); cascade.visible = false; DG.add(cascade);
        const cascM = tm_water(new MeshStandardMaterial({ color: 0x8fcaf2, transparent: true, opacity: 0.75, roughness: 0.08, metalness: 0.0, depthWrite: false }), { mode: "fall", scale: 0.5 });   // WATER_420
        const silver = new MeshStandardMaterial({ color: 0xe6e6ea, metalness: 0.85, roughness: 0.25, side: DoubleSide });
        for (const f of [t1, t2]) {   // the silver trumpets (Numbers 10:2), from the mouth forward and up
          const tr = new Group();
          const tube = new Mesh(new CylinderGeometry(0.022, 0.026, 1.25, 10), silver); tube.position.y = 0.625;
          const bell = new Mesh(new CylinderGeometry(0.16, 0.03, 0.26, 16, 1, true), silver); bell.position.y = 1.36;
          tr.add(tube, bell);
          tr.position.set(0, K.HEAD_Y * K.FS - 0.17, 0.14);
          tr.rotation.x = 1.25;
          tr.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.userData.noPick = true; } });
          f.lean.add(tr);
          f.tr = tr;
          wristOn(f);   // TRUMPET_HANDS_N11
        }
        const D2 = SHL.D = { DG, p, t1, t2, flask, fwater, cascade, cascM, ys: new Map() };
        // the rest of the people (the Second Temple's buildExtra): the wine's priest, the deputy with the sudar, the streams, the watchers,
        // the procession with torches, the Levite with the lyre at the spring, the Levites east of the altar
        try {
          const PP = tm_people(ctx);
          const ROBES = [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50, 0x5a3e4a, 0x3e5a4a];
          const w = mkPriest(8); DG.add(w.g);
          const wjug = new Mesh(jugGeo(), gold); wjug.castShadow = true; wjug.userData.noPick = true; wjug.position.set(0, -0.2, 0.02); w.R.grip.add(wjug);
          const wwine = new Mesh(new CylinderGeometry(0.035, 0.05, 1, 8, 1, true), new MeshStandardMaterial({ color: 0x8a1626, transparent: true, opacity: 0.85, roughness: 0.15 }));
          wwine.visible = false; DG.add(wwine);
          const sg = mkPriest(10); DG.add(sg.g);
          const sud = (() => {   // the sudar (the Second Temple's: a black cloth 0.62 x 1.0, its corner in the hand)
            const sg2 = new Group(), W0 = 0.62, L0 = 1.0, geo = new PlaneGeometry(W0, L0, 6, 10);
            geo.translate(-W0 / 2, -L0 / 2, 0);
            const pos = geo.attributes.position, base0 = Float32Array.from(pos.array);
            const m = new Mesh(geo, new MeshStandardMaterial({ color: 0x17171c, roughness: 0.9, side: DoubleSide })); m.castShadow = true; m.userData.noPick = true; sg2.add(m);
            sg2.userData.tick = (t, k) => { for (let i = 0; i < pos.count; i++) { const x = base0[i * 3], y = base0[i * 3 + 1], d = Math.hypot(x, y) / L0; pos.array[i * 3 + 2] = (0.03 + 0.16 * k) * d * Math.sin(6.5 * d - (3 + 7 * k) * t) + 0.05 * k * d * d * Math.sin(2.1 * t); pos.array[i * 3] = x * (1 - 0.12 * k * d * (0.5 + 0.5 * Math.sin(4 * t + 3 * d))); } pos.needsUpdate = true; geo.computeVertexNormals(); };
            sg2.userData.tick(0, 0); return sg2;
          })();
          sg.R.grip.add(sud);
          // the men and boys who watch in the outer court, on both sides of the way
          const watch = new Group(); DG.add(watch); watch.visible = false;
          let q = 1122;
          const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
          const men = [], boys = [];
          for (let x = 112; x < 218; x += 7 + rr() * 3) for (const sd of [-1, 1]) {
            const z = sd * (6.2 + rr() * 6), list = rr() < 0.3 ? boys : men;
            list.push([x + (rr() - 0.5) * 2, z, sd > 0 ? Math.PI : 0]);
          }
          const yOC = ctx.shared.newCourt ? ctx.shared.newCourt.y : 3;
          PP.crowd(watch, men, { y: yOC, s: 1.4, pose: "stand", kind: "worker", robe: ROBES[1], tone: (i) => i % 4, name: "shiloachWatcher1" });
          PP.crowd(watch, boys, { y: yOC, s: 1.0, pose: "stand", kind: "worker", robe: ROBES[4], tone: (i) => (i + 1) % 4, name: "shiloachBoy1" });
          // the procession with torches: men and boys round the priest, out and back
          const torchM = new MeshStandardMaterial({ color: 0x5b3a1e, roughness: 0.8 });
          const flameM = new MeshStandardMaterial({ color: 0xffb13a, emissive: 0xff7a10, emissiveIntensity: 2.2, transparent: true, opacity: 0.92 });
          const stickG = new CylinderGeometry(0.025, 0.035, 1.1, 6).translate(0, 0.55, 0), flameG = new ConeGeometry(0.11, 0.36, 8).translate(0, 0.18, 0);
          const COL = [0x2f6b3a, 0x5b3a8a, 0x2e5d9a, 0xc9a227, 0x9a3030, 0x2a8a80, 0xb86a2a, 0x6b7a2e, 0x8a3a6a, 0x3a4a8a, 0xa8552e, 0x40706a];
          const glowTex = (() => { const cv = document.createElement("canvas"); cv.width = cv.height = 64; const c2 = cv.getContext("2d"); const gr = c2.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, "rgba(255,190,90,0.85)"); gr.addColorStop(0.4, "rgba(255,140,40,0.35)"); gr.addColorStop(1, "rgba(255,120,20,0)"); c2.fillStyle = gr; c2.fillRect(0, 0, 64, 64); return new CanvasTexture(cv); })();
          const glowM = new SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending });
          const fol = [], LANES = [-2.0, -0.9, 0.9, 2.0];
          const KIDS = [17, 29, 53, 71, 88], LIT = [2, 20, 38, 56, 74, 92];   // ROUTE_CROWD (as the Second Temple's ROUTE_CROWD_B2; the user: "מלא אנשים"): 104, thirty ahead of him
          for (let i = 0; i < 104; i++) {
            const G = new Group(); G.visible = false; DG.add(G);
            const kid = KIDS.includes(i), boy = !kid && i % 5 === 3;
            PP.crowd(G, [[0, 0, 0]], { y: 0, s: kid ? 0.8 : boy ? 1.05 : 1.4, pose: "stand", kind: kid || boy ? "student" : "worker", robe: COL[(i * 5) % COL.length], tone: () => i % 4, exact: true, name: "shiloachProcession1" });
            let fl = null;
            if (!kid) {
              const T0 = new Group(); T0.position.set(boy ? -0.27 : -0.36, boy ? 0.98 : 1.3, 0.3); T0.rotation.x = 0.15; G.add(T0);
              T0.add(new Mesh(stickG, torchM));
              fl = new Mesh(flameG, flameM); fl.position.y = 1.1; T0.add(fl);
              const gl = new Sprite(glowM); gl.scale.set(1.7, 1.7, 1); gl.position.y = 0.2; gl.userData.noPick = true; fl.add(gl);
              if (LIT.includes(i)) { const lt = new PointLight(0xffa040, 22, 20, 1.6); lt.position.y = 0.25; fl.add(lt); }   // six lights in all (each light costs every material)
            }
            const lead = i < 30, k = lead ? i : i - 30;   // dense: each keeps a distance in amot from him (as there)
            fol.push({ G, fl, lag: i * 0.37, d: lead ? -(1.2 + k * 0.34) : 1.0 + k * 0.36, side: LANES[i % 4] + (((i * 7) % 5) - 2) * 0.08, rank: lead ? k * 0.34 : 0 });
          }
          // a Levite with a lyre at the spring
          const lev = new Group(); DG.add(lev); lev.visible = false;
          PP.crowd(lev, [[0, 0, 0]], { y: 0, s: 1.4, pose: "stand", kind: "levi", robe: 0xe9e3d3, tone: () => 2, exact: true, name: "shiloachLevite1" });
          {
            const wood = new MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.6 }), str = new MeshStandardMaterial({ color: 0xeae2c8, roughness: 0.4 });
            const LY = new Group(); LY.position.set(0.05, 1.25, 0.38); LY.rotation.x = -0.25; lev.add(LY);
            const armL = (sx) => { const c = new Mesh(new TubeGeometry(new CatmullRomCurve3([new Vector3(sx * 0.12, 0, 0), new Vector3(sx * 0.2, 0.25, 0), new Vector3(sx * 0.16, 0.5, 0)]), 8, 0.02, 5, false), wood); LY.add(c); };
            armL(-1); armL(1);
            const bar = new Mesh(new CylinderGeometry(0.018, 0.018, 0.4, 6).rotateZ(Math.PI / 2), wood); bar.position.y = 0.5; LY.add(bar);
            const bx = new Mesh(new BoxGeometry(0.3, 0.1, 0.06), wood); LY.add(bx);
            for (let kk = -3; kk <= 3; kk++) { const sm = new Mesh(new CylinderGeometry(0.003, 0.003, 0.46, 3), str); sm.position.set(kk * 0.03, 0.26, 0.02); LY.add(sm); }   // seven strings (Arachin 13b)
          }
          // the Levites with the song east of the altar - "עמדים מזרח למזבח" (II Chr 5:12; 40-altar.js, the place of the singers), flutes among
          // them (Arachin 2:3 "ובשמונת ימי החג... החליל מכה לפני המזבח"); their faces to the people, east (the user's decision 99). In the altar's group
          const duch = new Group(); duch.visible = false;
          const agd = altarG(); (agd || DG).add(duch);
          const LZ = [-8.4, -6.0, -3.6, -1.2, 1.2, 3.6, 6.0, 8.4], flutes = [1, 3, 5], LX = ACX + 17;   // x 72 (the place: x 69..77)
          PP.crowd(duch, LZ.map((z) => [LX, z, Math.PI / 2]), { y: AZ, s: 1.4, pose: "stand", kind: "levi", robe: 0xe9e3d3, tone: (i) => i % 4, name: "shiloachLevites1" });
          const reed = new MeshStandardMaterial({ color: 0xc8b07a, roughness: 0.6 });
          for (const i of flutes) {
            const fm = new Mesh(new CylinderGeometry(0.026, 0.034, 0.62, 8), reed);   // from the mouth forward and down (he faces east, +x)
            fm.position.set(LX + 0.17 + 0.19, AZ + 1.86 - 0.25, LZ[i]); fm.rotation.z = 0.64; fm.castShadow = true; fm.userData.noPick = true; duch.add(fm);
          }
          Object.assign(D2, { w, wjug, wwine, sg, sud, watch, fol, lev, duch });
        } catch (e) { console.warn("[parallels] shiloach people", e && e.message); }
        try { SHL.offF = measure(D2, ARM.fill, FILL_LEAN, 0); SHL.offP = measure(D2, ARM.pour, POUR_LEAN, TILT); } catch (e) { console.warn("[parallels] shiloach measure", e && e.message); }
        return D2;
      };
      // ---------- 10. THE SPRING OF THE SHILOACH (item 10) - the shared build: tm_shiloach (B2's shared/frag/shiloach.js, brought in by
      // 20-mount.js; in the Second Temple SHILOACH_KIT_B2) - the cliff, the small opening, the white fall into the basin, the great pool,
      // the green, the torches' and the moon's light, the roar. ITS PLACE IN THIS HOUSE waits for the user (the coordinator's question
      // 117) - he answered (22.11.2026 12:09, again 12:11: "117 א"): IN THE KIDRON VALLEY, ON ITS WESTERN SLOPE, SOUTH-EAST OF THE MOUNT, as
      // proposed - "והורדתם אתו אל־גחון" (I Kings 1:33; Rashi: "הוא מעין השלוח"), "ויעלו משם" (1:45), "מערבה לגיחון בנחל" (II Chr 33:14).
      // The cliff in the slope (west), the water out to the east, toward the valley's floor; the great pool south of it, before its face;
      // the way comes down the valley from the north, to its east side. The mouth's height is measured on the priest's own figure, as there.
      // SPRING_C = null builds nothing (and hides the demonstration and its places).
      // RENEWED (the user, 22.11.2026 14:34-14:35: "המעין וברכת השלח עוברים למערב"): by the City of David's south-western corner, below the
      // city - its outlet (the Gihon) outside the wall ("מחוץ לעיר", II Chr 32:3-4 and its commentators), the water coming down into the
      // pool of the Shiloach within the wall (the Malbim on Nehemiah 3, 3370:85 "וקרוב לו למזרחו בתוך החומה היו מי השלוח"); the cliff to
      // the south-west, the water out to the north-east, toward the pool. (Until 14:35: in the Kidron, south-east of the mount.)
      const SPRING_C = { x: 14, z: 972, yaw: -0.6435, approach: [-14, 952], pool: { dx: 3.6, dz: -55.2, w: 14, d: 9 }, poolAt: [50, 930] };   // { x, z, yaw, approach: [x, z] (the way's end before it), lake (the kit's own: the natural pool, decision 122 b) }
      let springLabel = null;
      if (SPRING_C) {
        // THE CHANNEL to the pool (the user's 189 a): in the kit's frame, from just inside the natural pool's front to over the great pool's back
        // wall - a straight line at x 4 (east of the procession's arc and of the man by the fall); built and checked in section 12
        const CHANNEL_C = { x: 4.0, z0: -3.4, z1: -50.9 };
        ctx.shared.shiloach1 = { place: SPRING_C, channel: CHANNEL_C };
        // its label over the cliff (its height set when the spring is built, on the ground found then)
        springLabel = { text: "מעיין השילוח", x: SPRING_C.x, y: -36, z: SPRING_C.z, size: 4 };
        (ctx.labels = ctx.labels || []).push(springLabel);
      }
      const mergeStatic = (G0) => {   // the kit's many fronds, boulders, leaves and spires - one mesh for each of their materials (few draw calls)
        const by = new Map();
        for (const o of G0.children) if (o.isMesh && !o.isInstancedMesh && o.material && !o.material.transparent) { const l = by.get(o.material) || []; l.push(o); by.set(o.material, l); }
        for (const [mat, list] of by) {
          if (list.length < 3) continue;
          let mg = null;
          try { mg = mergeGeometries(list.map((o) => { o.updateMatrix(); return o.geometry.clone().applyMatrix4(o.matrix); })); } catch (_) { mg = null; }
          if (!mg) continue;
          const m = new Mesh(mg, mat);
          m.castShadow = list.some((o) => o.castShadow); m.receiveShadow = true; m.userData.noPick = true;
          G0.add(m);
          for (const o of list) G0.remove(o);
        }
      };
      const buildSpring = () => {
        if (SHL.spring !== undefined) return SHL.spring;
        SHL.spring = null;
        if (!SPRING_C || typeof tm_shiloach !== "function" || !K) return null;
        try {
          const D2 = buildDemo();
          if (!SHL.offF) SHL.offF = measure(D2, ARM.fill, FILL_LEAN, 0);
          const C = SPRING_C, yaw = C.yaw || 0, c = Math.cos(yaw), n = Math.sin(yaw);
          const Wl = (lx, lz) => [C.x + lx * c + lz * n, C.z - lx * n + lz * c];   // the kit's frame -> the world (as tm_shiloach's own)
          const g0 = Wl(0, -0.9), gy = groundY(g0[0], g0[1], 60);
          const mouthY = gy + Math.max(1.15, SHL.offF.y + 0.34), basinY = gy + 0.36;
          const kit = tm_shiloach(ctx, { x: C.x, z: C.z, mouthY, yaw, ground: (x, z) => groundY(x, z, 60), parent: ctx.root, seed: 4706, name: "shiloachSpring1",
            basinY, basinDz: 0.55, fallZ: 0.5, pool: C.pool || null, lake: C.lake, lights: { torch: 85, moon: 34 },   // NATURAL_POOL (122 b): the fall into a natural pool; the walled pool - the Shiloach's, within the city's wall
            sfx: (nm, op) => { if (fnc(ctx.shared.sfx)) ctx.shared.sfx(nm, op); }, roar: { name: "water", dur: 4.5, gain: 3.2 } });
          // the kit's rill from the fall to the great pool (one flat strip, 0x8fc3ec) runs here about 55 amot - across the slope and through the
          // city's wall at one height; not drawn (the coordinator's note: "a thin blue line out of the wall") - the water's way to the pool
          // is not drawn (a question to the user)
          { const rm2 = []; kit.G.traverse((o) => { if (o.isMesh && o.material && o.material.color && o.material.color.getHex() === 0x8fc3ec && o.geometry && o.geometry.type === "PlaneGeometry") rm2.push(o); }); for (const o of rm2) { if (o.parent) o.parent.remove(o); if (o.geometry) o.geometry.dispose(); } SHL.rillHidden = rm2.length; }
          { const CHANNEL_C = (ctx.shared.shiloach1 && ctx.shared.shiloach1.channel) || { x: 4.0, z0: -3.4, z1: -50.9 }; const rmC = []; kit.G.traverse((o) => { if (!o.isMesh || !o.geometry || o === kit.G) return; if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); const r = o.geometry.boundingSphere.radius * Math.max(o.scale.x, o.scale.y, o.scale.z); if (r > 2.2) return; const p = o.position; if (Math.abs(p.x - CHANNEL_C.x) < 1.5 && p.z < -2.4 && p.z > CHANNEL_C.z1 - 1.2) rmC.push(o); }); for (const o of rmC) if (o.parent) o.parent.remove(o); SHL.chCleared = rmC.length; }   // CHANNEL_189
          kit.batchPlants(true);
          mergeStatic(kit.G);
          kit.setBottom(basinY);
          const fp = Wl(0, -0.5);   // where the fall comes down (fallZ: 0.5 before the face)
          SHL.spring = ctx.shared.shiloachSpring1 = {
            kit, gy, yaw, Wl, mouthY, approach: C.approach || Wl(-8, -28), spout: [fp[0], mouthY, fp[1]],
            streamTo: (y) => kit.setBottom(y == null ? basinY : y), lights: (on) => kit.setLit(on ? 1 : 0)
          };
          const V3 = new Vector3(C.x, mouthY, C.z);
          ctx.animated.push(() => { if (!SHL.run && !(ctx.camera && ctx.camera.position.distanceTo(V3) < 70)) return; kit.tick(performance.now() / 1000); });
          // the eye may go down into the valley, to the spring (the guard's floor, 90-entry.js: under -27.5 only where the floor under the
          // target is lower - the valley)
          SHL.camLow = Math.min(-27.5, gy - 3);
          if (springLabel) { const lq = Wl(0, 3.5); par_moveLabel(ctx, springLabel, lq[0], gy + 18, lq[1]); }
          ctx.shared.camLow = SHL.camLow;
          try { const IRD = ctx.shared.irDavid; if (IRD && fnc(IRD.buildChannel)) IRD.buildChannel(); } catch (e) { console.warn("[parallels] channel", e && e.message); }
        } catch (e) { console.warn("[parallels] shiloach spring", e && e.message); SHL.spring = null; }
        return SHL.spring;
      };
      // built at the first frame (the floor's ray needs the whole scene), as the Second Temple's
      // built when the eye comes within 300 amot of it, or when the demonstration starts (as the Second Temple's, d6d17d1: not at the first
      // frame - the load time)
      if (SPRING_C) { const VS = new Vector3(SPRING_C.x, -50, SPRING_C.z); ctx.animated.push(() => { if (SHL.spring === undefined && fnc(ctx.shared.floorY) && ctx.camera && ctx.camera.position.distanceTo(VS) < 300) buildSpring(); }); }
      // ---- the ways (each [x, z] in the world). Out: the inner court's east gate (x 93.5, its round steps to the outer court's floor),
      // the outer court's east gate (x 228.5) and its ramp, round the courts to the great court's west gate (x -147) and down its ramp (to
      // x -233.5, y -28; RAMP13_420: 84 amot at an amah in three); then to the spring. Back: up that ramp, across the great court south of
      // the inner court, to its south-eastern gate (x 40), up its ramp (z 90.5 -> 72.5), in, to the altar's ramp's foot, up its east half, on
      // the top to the left, to the bowl.
      const valley = () => {
        const S = SP1(), A = S ? S.approach : [-14, 952];
        // from the west gate's stairs' foot southward, west of the palace's terrace and of the City of David's wall, to the place before the
        // spring at the city's south-western corner (the user's decision 117, renewed: the Gihon in the west, as the Malbim) - model choices
        // [-165, 345]: round the mount's south-western corner (its west wall x -150, its south wall z 333) - not over it
        // RAMP13_420: from the foot of the west gate's ramp (84 amot out, an amah in three - 20-mount.js), back south-east to the level strip by
        // the wall (clear of the rose garden, x -177..-150, z 12..38), and on as before
        return [[-233.5, 0], [-208, 36], [-186, 92], [-170, 250], [-165, 345], [-110, 400], [-60, 560], [-36, 720], [-30, 860], A];
      };
      const WAYS = () => {
        const V = valley(), Vr = V.slice().reverse();
        return [
          { pts: [[91.6, 0], [91.7, 0]], t: [0, 0.1], near: 7, endYaw: Math.PI / 2 },   // in the gate, behind the two with trumpets
          { pts: [[91.7, 0], [98, 0], [106, 0], [226.5, 0]], t: [T.walk0 + 0.5, T.out1 + 0.5], near: 7, endYaw: -Math.PI / 2 },   // his face to the west there
          { pts: [[226.5, 0], [229.5, 0], [240.5, 0], [243, 74], [160, 97], [-90, 97], [-104, 80], [-112, 40], [-140, 4], [-149.5, 0]], t: [T.decl1 + 0.2, T.east1], near: 4, proc: true },   // round the outer court and the inner one, to the west gate (RAMP13_420: down the outer gate's ramp to its foot, x 238.5, before turning; south of the inner gates' ramps' feet, z 90.5, and round the inner court's corner)
          { pts: [[-149.5, 0], [-233.5, 0]], t: [T.east1, T.steps1], stairs: [0, -28], proc: true },   // RAMP13_420: down the ramp (was 28 amot of stairs)
          { pts: V, t: [T.steps1, T.path1], terrain: true, proc: true },
          { pts: [V[V.length - 1], standF()], t: [T.path1, T.rim1], terrain: true, endYaw: standYaw() },   // his face to the fall
          { pts: [standF()].concat(Vr.slice(1)), t: [T.back0, T.backS], terrain: true, proc: true },
          { pts: [[-233.5, 0], [-149.5, 0]], t: [T.backS, T.back1], stairs: [-28, 0], proc: true },
          // RAMP13_420: round the inner court's south-western corner (its podium x -98.5..98.5, z -72.5..72.5 - until now the way cut across it)
          // and along z 97, south of the feet of the south gates' ramps (18 amot out, to z 90.5 - 30-courts.js), to the foot of the eastern one
          { pts: [[-149.5, 0], [-140, 4], [-112, 40], [-104, 80], [-90, 97], [36, 97], [40, 94]], t: [T.back1 + 0.1, T.wg0], near: 4, proc: true },   // the procession with him, south of the inner court
          { pts: [[40, 94], [40, 90.5], [40, 72.5], [40, 71]], t: [T.wg0, T.wg1], steps: [[90.5, 0], [72.5, 6]], endYaw: Math.PI },   // up the gate's ramp, his face into the court
          { pts: [[40, 71], [40, 66], [46, 60], AW(57.0, 44.5)], t: [T.blow1, T.in1], near: 7 },
          { pts: [AW(57.0, 44.5), AW(57.0, yose() ? 15.5 : 13.5)], t: [T.in1, T.ramp1], ramp: true },
          { pts: [AW(57.0, yose() ? 15.5 : 13.5), AW(56.4, yose() ? 11.6 : 9.6)].concat(yose() ? [AW(50, 10.8), AW(46.6, 10.4)] : [AW(51.5, 8.9), AW(48.4, 8.3)]).concat([standP()]), t: [T.ramp1, T.top1], near: 18, endYaw: 0 }   // "ופנה לשמאלו"
        ];
      };
      // ROUTE_CROWD (as the Second Temple's ROUTE_CROWD_B2; the coordinator: "והמון לאורך הדרך"): men and boys standing on both sides of the
      // way outside the mount - down the valley to the spring - in small knots, their faces to the way; built when the demonstration starts
      // (the ground under each knot - one ray), in pieces of about fifty amot (each its own level of detail). Number and places - model choices
      const ROUTE_COL = [0x2f6b3a, 0x5b3a8a, 0x2e5d9a, 0xc9a227, 0x9a3030, 0x2a8a80, 0xb86a2a, 0x6b7a2e, 0x8a3a6a, 0x3a4a8a];
      const buildRoute = (D2) => {
        if (D2.route) return D2.route;
        const RG = new Group(); RG.name = "shiloachRoute1"; RG.visible = false; D2.DG.add(RG); D2.route = RG;
        let q = 9133; const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        const PPr = tm_people(ctx), WS = WAYS().filter((w) => w.terrain && w.proc && w.t[1] <= T.path1 + 0.01);
        const chunks = []; let cur = [], acc = 0;
        for (const w of WS) {
          const L = plen(w.pts);
          for (let d = 4; d < L - 6; d += 5) {
            const qq = along(w.pts, d / L), yaw = qq[2], ph = yAt(D2, qq[0], qq[1], 60);
            for (const sd of [-1, 1]) {
              if (rr() < 0.2) continue;
              const off = sd * (3.4 + rr() * 1.4), x0 = qq[0] + Math.cos(yaw) * off, z0 = qq[1] - Math.sin(yaw) * off, gy0 = yAt(D2, x0, z0, 60);
              if (!isFinite(gy0) || !isFinite(ph) || Math.abs(gy0 - ph) > 1.6) continue;
              const n = 1 + (rr() < 0.55 ? 1 : 0) + (rr() < 0.25 ? 1 : 0);
              for (let k = 0; k < n; k++) { const a1 = (rr() - 0.5) * 1.8, b1 = sd * rr() * 0.9, x = x0 + Math.sin(yaw) * a1 + Math.cos(yaw) * b1, z = z0 + Math.cos(yaw) * a1 - Math.sin(yaw) * b1; cur.push([x, z, Math.atan2(qq[0] - x, qq[1] - z), gy0, rr()]); }
            }
            acc += 5; if (acc >= 50) { chunks.push(cur); cur = []; acc = 0; }
          }
        }
        if (cur.length) chunks.push(cur);
        let total = 0;
        chunks.forEach((C, ci) => {
          const men = C.filter((p2) => p2[4] >= 0.28), boys = C.filter((p2) => p2[4] < 0.28), avg = C.reduce((a2, p2) => a2 + p2[3], 0) / Math.max(1, C.length);
          if (men.length) PPr.crowd(RG, men.map((p2) => [p2[0], p2[1], p2[2], p2[3]]), { y: avg, s: 1.4, pose: "stand", kind: "worker", robe: ROUTE_COL[ci % ROUTE_COL.length], tone: (i) => (i + ci) % 4, name: "shiloachRoute1" });
          if (boys.length) PPr.crowd(RG, boys.map((p2) => [p2[0], p2[1], p2[2], p2[3]]), { y: avg, s: 1.05, pose: "stand", kind: "student", robe: ROUTE_COL[(ci + 5) % ROUTE_COL.length], tone: (i) => (i + ci + 1) % 4, name: "shiloachRouteBoy1" });
          total += C.length;
        });
        RG.userData.count = total;
        return RG;
      };
      const wayY = (D2, w, q, u) => {
        if (w.stairs) return yAt(D2, q[0], q[1], lerp(w.stairs[0], w.stairs[1], clamp(u, 0, 1)) + 1);   // on the treads (the ray from a little over the line of the stairs)
        if (w.steps) { const [a, b] = w.steps; return yAt(D2, q[0], q[1], (q[1] >= a[0] ? a[1] : q[1] <= b[0] ? b[1] : lerp(a[1], b[1], (a[0] - q[1]) / (a[0] - b[0]))) + 1); }
        return yAt(D2, q[0], q[1], w.terrain ? 60 : w.ramp ? 20 : w.near);
      };
      const placeOn = (D2, f, w, t, carry) => {
        const u = (t - w.t[0]) / Math.max(1e-3, w.t[1] - w.t[0]), q = along(w.pts, u);
        f.g.position.set(q[0], wayY(D2, w, q, u), q[1]);
        f.g.rotation.y = u >= 1 && w.endYaw != null ? w.endYaw : q[2];
        const walking = u > 0 && u < 1, ph = t * 9;
        f.fl.position.z = walking ? 0.17 * Math.sin(ph) : 0;
        f.fr.position.z = walking ? -0.17 * Math.sin(ph) : 0;
        f.lean.position.y = walking ? Math.abs(Math.cos(ph)) * 0.035 : 0;
        setArm(f.L, walking ? [0.3 * Math.sin(ph), 0.08, -0.25] : ARM.rest, 1);
        setArm(f.R, carry ? ARM.carry : walking ? [-0.3 * Math.sin(ph), 0.08, -0.25] : ARM.rest, -1);
        return u;
      };
      const wayAt = (WS, t) => { let cur = null; for (const w of WS) if (t >= w.t[0] - 0.01) cur = w; return cur; };
      const apply = (t) => {
        const D2 = buildDemo(), WS = WAYS(), p = D2.p, S = SP1();
        const cur = wayAt(WS, t);
        p.g.visible = !!cur && t < T.end;
        if (cur) placeOn(D2, p, cur, Math.min(t, cur.t[1]), true);
        const yaw = p.g.rotation.y;
        p.lean.rotation.x = 0;
        let fillK = 0, pourK = 0;
        if (t >= T.fill0 && t < T.back0) {   // filling under the spring's stream
          fillK = smooth(clamp((t - T.fill0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.fill1) / 0.6, 0, 1)));
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.fill[i], fillK)), -1);
          p.lean.rotation.x = FILL_LEAN * fillK;
        }
        if (t >= T.pour0 && t < T.end) {   // pouring on the top at the south-west horn (168 a: no bowls in this house), his hand raised ("ולמנסך אומרים לו, הגבה ידך")
          pourK = smooth(clamp((t - T.pour0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.6, 0, 1)));
          setArm(p.R, ARM.carry.map((v, i) => lerp(v, ARM.pour[i], pourK)), -1);
          p.lean.rotation.x = POUR_LEAN * pourK;
        }
        setJug(p, D2.flask, TILT * pourK, yaw);
        const m = mouthW(D2.flask, V1);
        if (S && fnc(S.streamTo)) S.streamTo(fillK > 0.9 && p.g.visible ? m.y + 0.02 : null);
        D2.fwater.visible = false;
        if (pourK > 0.92 && p.g.visible) {
          const by = bowlY(), h = Math.max(0.05, m.y - by);
          D2.fwater.visible = true; D2.fwater.position.set(m.x, by + h / 2, m.z); D2.fwater.scale.y = h;
        }
        // the water down the altar (NO_BOWLS_168): it begins where the stream falls, runs to the floor and into the pit, and stops after the pouring
        { const runK = t >= T.pour0 + 0.6 && t < T.end ? clamp((t - T.pour0 - 0.6) / 1.6, 0, 1) * (1 - smooth(clamp((t - T.pour1 - 0.9) / 0.8, 0, 1))) : 0;
          D2.cascade.visible = runK > 0 && p.g.visible;
          if (D2.cascade.visible) {
            const key = (yose() ? "y" : "n") + Math.round(altarDz() * 10);
            if (D2.cascK !== key) {
              D2.cascK = key;
              while (D2.cascade.children.length) { const o = D2.cascade.children.pop(); if (o.geometry) o.geometry.dispose(); }
              const P3 = cascadePts(); let L = 0;
              for (let i = 1; i < P3.length; i++) {
                const a3 = P3[i - 1], b3 = P3[i], dy = a3[1] - b3[1], l = Math.hypot(b3[0] - a3[0], b3[2] - a3[2]);
                if (dy > 0.2) {   // a fall off an edge: a thin sheet from the upper surface to the lower
                  const f = new Mesh(new BoxGeometry(0.34, dy, 0.06), D2.cascM); f.position.set(b3[0], b3[1] + dy / 2 + 0.01, b3[2]); f.rotation.y = Math.atan2(b3[0] - a3[0], b3[2] - a3[2]);
                  f.userData.at = L; D2.cascade.add(f);
                }
                if (l > 1e-3) {   // a wet sheet on the surface
                  const w = new Mesh(new BoxGeometry(0.3, 0.02, l + 0.04), D2.cascM); w.position.set((a3[0] + b3[0]) / 2, b3[1] + 0.015, (a3[2] + b3[2]) / 2); w.rotation.y = Math.atan2(b3[0] - a3[0], b3[2] - a3[2]);
                  w.userData.at = L; D2.cascade.add(w);
                }
                L += l + Math.max(0, dy);
              }
              const pit = P3[P3.length - 1], pf = new Mesh(new CylinderGeometry(0.06, 0.06, 1, 8, 1, true), D2.cascM); pf.position.set(pit[0], pit[1] - 0.5, pit[2]); pf.userData.at = L; D2.cascade.add(pf);
              D2.cascL = L + 0.01;
              D2.cascade.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
            }
            const reach = runK * D2.cascL;
            for (const o of D2.cascade.children) o.visible = o.userData.at <= reach;
          }
        }
        // the opening (Sukkah 5:4): the two with trumpets in the inner court's east gate, their walk blowing to the outer court's east gate
        const tOpen = t < T.decl1 + 0.3;
        if (tOpen) {
          for (const [f, sd] of [[D2.t1, -1], [D2.t2, 1]]) {
            const z = sd * 3.0, wy = t < T.walk0 ? { pts: [[94.4, z], [94.5, z]], t: [0, 0.1], near: 7, endYaw: Math.PI / 2 }
              : { pts: [[94.4, z], [98.4, z], [106, z], [227.6, z]], t: [T.walk0, T.out1], near: 7, endYaw: -Math.PI / 2 };
            f.g.visible = true;
            placeOn(D2, f, wy, Math.min(t, wy.t[1]), false);
            const blowK = t < T.walk0 ? smooth(clamp((t - 0.6) / 0.5, 0, 1)) * (1 - smooth(clamp((t - 3.4) / 0.4, 0, 1)))
              : t < T.out1 ? 1 - smooth(clamp((t - T.out1 + 0.4) / 0.4, 0, 1)) : 0;
            TRUH.hold(f, blowK);   // TRUMPET_HANDS_N11: both hands on the trumpet, walking too
          }
        }
        // at the altar the same two stand ON THE TABLE OF THE FATS (Tamid 7:3; the user's decision 102) - the marble table (ctx.shared.rampTables)
        const tAlt = t >= T.top1 - 1.2 && t < T.end;
        if (tAlt) {
          const blowA = smooth(clamp((t - T.pour0 + 0.4) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.5, 0, 1)));
          const RT = ctx.shared.rampTables, MB = RT ? RT.marble : AW(ACX - 15.4, 13.6), B = BOWL();
          for (const [f, dz2] of [[D2.t1, -0.38], [D2.t2, 0.38]]) {
            f.g.visible = true;
            f.g.position.set(MB[0], AZ + (RT ? RT.top : 1.5) + 0.01, MB[1] + dz2);
            f.g.rotation.y = Math.atan2(B[0] - MB[0], B[1] - (MB[1] + dz2));
            TRUH.hold(f, blowA);   // TRUMPET_HANDS_N11
          }
        }
        // the two at the gate that stands for the Water Gate: on its steps' head, either side of the way in
        const tOn = t >= T.wg0 && t < T.in1 + 1;
        for (const [f, x] of [[D2.t1, 36.4], [D2.t2, 43.6]]) {
          if (!tAlt && !tOpen) f.g.visible = tOn;
          if (!tOn) continue;
          f.g.position.set(x, AZ, 73.4);
          f.g.rotation.y = x < 40 ? 0.35 : -0.35;   // their faces out, to the south, a little toward the way in
          const up = smooth(clamp((t - T.blow0 + 0.6) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.blow1) / 0.5, 0, 1)));
          TRUH.hold(f, up);   // TRUMPET_HANDS_N11
        }
        try { extraApply(D2, WS, t); } catch (e) { if (!SHL.warned) { SHL.warned = true; console.warn("[parallels] shiloach extra", e && e.message); } }
      };
      const extraApply = (D2, WS, t) => {
        if (!D2.fol) return;
        if (SHL.night) {
          if (t < T.back0) NIGHT.set("night", "night", 0);
          else if (t < T.back1) NIGHT.set("night", "alot", smooth(clamp((t - T.back0) / (T.back1 - T.back0), 0, 1)));
          else if (t < T.in1) NIGHT.set("alot", "heir", smooth(clamp((t - T.back1) / (T.in1 - T.back1), 0, 1)));
          else NIGHT.set("heir", "morning", smooth(clamp((t - T.in1) / (T.top1 - T.in1), 0, 1)));
        }
        D2.watch.visible = t < T.decl1 + 0.5;
        if (D2.route) D2.route.visible = t >= T.decl1 && t < T.back1 + 1;   // ROUTE_CROWD
        const fl = 0.85 + 0.15 * Math.sin(t * 17);
        const wp = wayAt(WS, t);
        // the procession, from the great court's east gate out (decl1 + 1.2) to the gate that stands for the Water Gate (they stay below
        // it while the two blow): the way they walk - his, if it is one of theirs (proc, stairs, terrain), else the last of theirs before it
        // (they wait at its end, in their ranks)
        let pw = null;
        if (t >= T.decl1 + 1.2 && t < T.blow1 + 1.0) for (const q of WS) if ((q.proc || q.stairs || q.terrain) && t >= q.t[0] - 0.01) pw = q;
        const S = SP1(), sf = standF(), syw = S ? S.yaw || 0 : 0, sc = Math.cos(syw), sn = Math.sin(syw);
        // at the spring they stand in an arc behind him (the kit's frame: before its face, -z), clear of the pool on his east and of the
        // eye at his west side
        const atK = S ? smooth(clamp((t - (T.path1 - 0.6)) / 1.8, 0, 1)) * (1 - smooth(clamp((t - T.back0) / 1.0, 0, 1))) : 0;
        const pwI = pw ? WS.indexOf(pw) : -1;
        const Sp = !pw ? 0 : pw === wp ? clamp((t - pw.t[0]) / Math.max(1e-3, pw.t[1] - pw.t[0]), 0, 1) * plen(pw.pts) : plen(pw.pts);
        D2.fol.forEach((F, i) => {
          F.G.visible = !!pw;
          if (!pw) return;
          let w = pw, L = plen(w.pts), S2 = Sp - F.d;
          if (S2 < 0 && pwI > 0) { const pv = WS[pwI - 1]; if (pv.proc || pv.stairs || pv.terrain) { w = pv; L = plen(w.pts); S2 = Math.max(0, L + S2); } }
          S2 = clamp(S2, 0, Math.max(0, L - 1.6 - F.rank));
          const u = L > 0 ? S2 / L : 0, qq = along(w.pts, u), yaw = qq[2];
          let x = qq[0] + Math.cos(yaw) * F.side, z = qq[1] - Math.sin(yaw) * F.side;
          let ry = t >= w.t[1] && w.endYaw != null && w === wp ? w.endYaw : yaw, near = w.stairs ? lerp(w.stairs[0], w.stairs[1], u) + 1 : w.terrain ? 60 : 4;
          if (atK > 0) {
            const row = i % 8, k = Math.floor(i / 8), ph = (-45 + 50 * (k + 0.5 * (row % 2)) / 13.5) * Math.PI / 180, r = 5.5 + row * 1.1;   // six rows, before the cliff, clear of the pool and of the eye across it
            const lx = Math.sin(ph) * r, lz = -Math.cos(ph) * r, ax = sf[0] + lx * sc + lz * sn, az = sf[1] - lx * sn + lz * sc;
            x = lerp(x, ax, atK); z = lerp(z, az, atK); near = 60;
            if (atK > 0.5) ry = Math.atan2(sf[0] - x, sf[1] - z);
          }
          F.G.position.set(x, yAt(D2, x, z, near) + (u > 0 && u < 0.999 && atK < 0.99 ? Math.abs(Math.sin(t * 8 + F.lag)) * 0.04 : 0), z);
          F.G.rotation.y = ry;
          if (F.fl) F.fl.scale.set(fl, 0.9 + 0.2 * Math.sin(t * 23 + F.lag * 3), fl);
        });
        if (S && fnc(S.lights)) S.lights(SHL.run && t >= T.path1 - 1.2 && t < T.back0 + 2.4);
        // the Levite with the lyre at the spring: on its east, by the pool's corner, his face to the priest (seen behind him from the eye)
        const lvOn = !!S && t >= T.path1 - 1 && t < T.back0 + 1.6;
        D2.lev.visible = lvOn;
        if (lvOn) { const lp = S.Wl ? S.Wl(-3.0, -2.6) : [sf[0] - 2.1, sf[1] - 2.1]; D2.lev.position.set(lp[0], yAt(D2, lp[0], lp[1], 60), lp[1]); D2.lev.rotation.y = Math.atan2(sf[0] - lp[0], sf[1] - lp[1]); }
        // the libation: the wine's priest with him up the ramp, to the eastern bowl; the deputy on the south-west horn
        const w2 = D2.w, wOn = t >= T.in1 - 1.2 && t < T.end;
        w2.g.visible = wOn;
        if (wOn) {
          const B = BOWL(), o = SHL.offP || { x: 0, z: 0.9 }, sw = [B[0] + 0.9 - o.x, B[1] - o.z], zt = yose() ? 15.5 : 13.5;
          const WW = [{ pts: [AW(58.6, 46.5), AW(58.6, 46.6)], t: [0, 0.1], near: 7 },
            { pts: [AW(58.6, 44.5), AW(58.6, zt)], t: [T.in1 + 0.5, T.ramp1 + 0.5], ramp: true },
            { pts: [AW(58.6, zt), AW(58.0, zt - 3.8), AW(52.5, zt - 4.4), AW(49.4, zt - 5.0), sw], t: [T.ramp1 + 0.5, T.top1 + 0.5], near: 18, endYaw: 0 }];
          let cw = WW[0]; for (const q2 of WW) if (t >= q2.t[0] - 0.01) cw = q2;
          placeOn(D2, w2, cw, Math.min(t, cw.t[1]), true);
          const pk = smooth(clamp((t - T.pour0) / 0.6, 0, 1)) * (1 - smooth(clamp((t - T.pour1) / 0.6, 0, 1)));
          if (pk > 0) { setArm(w2.R, ARM.carry.map((v, i) => lerp(v, ARM.pour[i], pk)), -1); w2.lean.rotation.x = POUR_LEAN * pk; } else w2.lean.rotation.x = 0;
          setJug(w2, D2.wjug, TILT * pk, w2.g.rotation.y);
          D2.wwine.visible = false;
          if (pk > 0.92) { const mm = D2.wjug.localToWorld(V1.copy(MOUTH)), by = bowlY(), h = Math.max(0.05, mm.y - by); D2.wwine.visible = true; D2.wwine.position.set(mm.x, by + h / 2, mm.z); D2.wwine.scale.y = h; }
        }
        const sOn = t >= T.top1 - 1.0 && t < T.end;
        D2.sg.g.visible = sOn;
        if (sOn) {
          const [hx, hz] = yose() ? AW(ACX - 11.5, 11.5) : AW(ACX - 9.5, 9.5);   // the south-west horn (40-altar.js: 1 x 1 x 1 on the top's corner)
          const hk = hx * 1000 + hz;
          if (SHL.hornK !== hk) { SHL.hornK = hk; let hy = -Infinity; for (const [dx, dz2] of [[0, 0], [0.25, 0.25], [-0.25, 0.25], [0.25, -0.25], [-0.25, -0.25]]) hy = Math.max(hy, groundY(hx + dx, hz + dz2, 22)); SHL.hornY = isFinite(hy) ? hy : AZ + 11; }
          const S3 = D2.sg;
          S3.g.position.set(hx, SHL.hornY, hz); S3.g.rotation.y = Math.PI / 2 + 0.35;
          const wave = smooth(clamp((t - T.pour0 + 0.7) / 0.5, 0, 1)) * (1 - smooth(clamp((t - T.pour1 - 0.4) / 0.5, 0, 1)));
          setArm(S3.R, ARM.rest.map((v, i) => lerp(v, [-2.85, 0.18, -0.15][i], wave)), -1);
          setArm(S3.L, ARM.rest, 1);
          S3.fl.position.z = S3.fr.position.z = 0; S3.lean.position.y = 0; S3.lean.rotation.x = 0;
          if (D2.sud && D2.sud.userData.tick) D2.sud.userData.tick(t, wave);
        }
        D2.duch.visible = t >= T.in1 - 1 && t < T.end;
      };
      // ---- the eye (keys [t, eye, look], demo seconds) and the words
      const pAt = (t) => {   // where he is at demo second t (for the eye)
        const D2 = buildDemo(), w = wayAt(WAYS(), t);
        if (!w) return [91.7, 6, 0];
        const u = clamp((t - w.t[0]) / Math.max(1e-3, w.t[1] - w.t[0]), 0, 1), q = along(w.pts, u);
        return [q[0], wayY(D2, w, q, u), q[1]];
      };
      const keys = () => {
        const S = SP1(), sy = S.gy, M = S.mouthY != null ? S.mouthY : S.spout[1];
        const Wl = S.Wl || ((lx, lz) => [S.spout[0] + lx, S.spout[2] + 0.5 + lz]), kp = (lx, y, lz) => { const q = Wl(lx, lz); return [q[0], y, q[1]]; };
        const off = (t, d) => { const p = pAt(t); return [t, [p[0] + d[0], p[1] + d[1], p[2] + d[2]], [p[0], p[1] + 1.4, p[2]]]; };
        const A1 = AW(57.0, 30), B = BOWL();
        return [
          [0, [118, 15, 18], [96, 9.5, 0]], [3.4, [119, 14.5, 16], [97, 9, 0]], [T.walk0 + 1.6, [150, 17, 26], [122, 4, 0]], [T.out1 - 1.2, [196, 15, 24], [224, 4, 0]],
          [T.out1 + 0.8, [244, 12, 13], [224, 5, 0]], [T.decl1, [242, 13, 14], [224, 5, 0]],
          off(T.decl1 + 1.6, [24, 18, 30]), off(T.decl1 + 4.0, [10, 26, 44]), off(T.east1 - 1.4, [26, 32, 30]),   // round the courts, from high in the south (over their chambers, 26)
          [T.east1, [-128, 26, 24], [-152, 3, 0]], [T.east1 + 1.4, [-178, 12, 38], [-195, -15, 0]], [T.steps1, [-256, -12, 26], [-234, -27, 2]],   // out by the west gate, over its wall (20), down its ramp (RAMP13_420: 84 amot)
          off(T.steps1 + 3, [-22, 18, 30]), off(T.steps1 + 7, [-22, 18, 30]), off(T.steps1 + 10, [-24, 16, 26]),   // southward, west of the terrace and the city, before them
          // the spring (as the Second Temple's: the cliff, the opening and the pool at a man's height; the filling closer, from the side)
          [T.path1 - 2.2, kp(10.5, sy + 9, -35.4), kp(2.5, sy + 4, -1.4)],
          (() => { const p = pAt(T.path1 - 0.4), sp = S.spout; return [T.path1 - 0.4, kp(10, sy + 4.5, -16), [lerp(p[0], sp[0], 0.35), sy + 1.6, lerp(p[2], sp[2], 0.35)]]; })(),   // he comes in, the cliff beside
          [T.rim1, kp(3.4, sy + 2.0, -5.6), kp(-0.4, M - 0.3, -0.4)], [T.fill1, kp(3.0, sy + 1.8, -5.0), kp(-0.4, M - 0.3, -0.4)],   // across the pool (as the Second Temple's)
          [T.fill1 + 0.6, kp(3.6, sy + 7.5, -7.5), kp(-0.4, M - 0.8, -0.4)],   // up from the pool's side first - over the crowd round it
          off(T.back0 + 1.2, [9, 12, 13]),   // he turns back with the full flask
          off(T.back0 + 3.2, [-24, 20, -40]), off(T.back0 + 7.5, [-24, 20, -40]),   // northward: before them, looking back at them
          [T.backS - 0.6, [-256, -12, 26], [-234, -27, 2]], [T.back1 - 0.4, [-190, 8, 22], [-150, 2, 0]],
          off(T.back1 + 0.9, [26, 44, 74]), off(T.back1 + 3.2, [26, 44, 74]), off(T.wg0 - 1.2, [22, 30, 52]),   // across the great court, from high in the south-east
          [T.wg0 - 0.2, [60, 18, 112], [41, 3, 92]], [T.wg1 - 0.4, [56, 16, 96], [40, 7.5, 73]], [T.blow1, [57, 15.6, 95], [40, 7.6, 73.2]],
          [T.blow1 + 1.0, [72, 34, 92], [48, 6, 60]], [T.in1 - 0.8, [76, 18, A1[1] + 18], [57, 8, A1[1] + 8]], [T.ramp1 - 1.0, [72, 22, A1[1] - 2], [57, 13, A1[1] - 12]],
          [T.top1, [33, 22, B[1] + 11], [B[0] + 3, 15.5, B[1] - 1]], [T.pour0 + 0.8, [41, 20.4, B[1] + 8.6], [B[0] + 0.3, 16.2, B[1] - 0.4]],
          [T.pour0 + 2.8, [48, 22.5, B[1] + 13], [B[0] + 0.6, 16.2, B[1] - 0.6]], [T.end, [48.5, 22.5, B[1] + 13.4], [B[0] + 0.6, 16.2, B[1] - 0.6]]
        ];
      };
      const caps = [
        [0, "״נסוך המים כיצד. צלוחית של זהב מחזקת שלשת לגים היה ממלא מן השלוח״ (סוכה ד, ט)"],
        [1.2, "״ועמדו שני כהנים בשער העליון שיורד מעזרת ישראל לעזרת נשים, ושתי חצוצרות בידיהן. קרא הגבר, תקעו והריעו ותקעו״ (סוכה ה, ד) — בבית ראשון: השער המזרחי של החצר הפנימית (בחירת מודל)"],
        [T.walk0 + 0.4, "״היו תוקעין והולכין, עד שמגיעין לשער היוצא מזרח״ (סוכה ה, ד) — בבית ראשון: השער המזרחי של החצר החיצונה (בחירת מודל)"],
        [T.out1 + 0.4, "״הגיעו לשער היוצא ממזרח, הפכו פניהן למערב, ואמרו... ואנו ליה עינינו״ (סוכה ה, ד)"],
        [T.decl1 + 0.2, "ויוצאים בשער המערבי של החצר הגדולה, בלפידים כפי שהובא בחלמיש — הדרך בבית ראשון: בחירת מודל; ההליכה מואצת"],
        [T.steps1, "אל השילוח — במערב, למטה מעיר דוד: ״מערבה לגיחון. הוא בצד מערב ירושלים״ (מלבי״ם דברי הימים ב לג, יד); הדרך: בחירת מודל"],
        [T.rim1 - 0.4, "״שילוח היה מוציא מים כאיסר״ (ירושלמי סוכה ה, ו); ״היה ממלא מן השלוח״ (סוכה ד, ט)"],
        [T.back0 + 0.6, "וחוזרים לפני עלות השחר, כפי שהובא בחלמיש — במעלות השער המערבי ובחצר הגדולה: בחירת מודל"],
        [T.wg0, "״הגיעו לשער המים, תקעו והריעו ותקעו״ (סוכה ד, ט) — בבית ראשון: השער המזרחי שבדרום החצר הפנימית, כסדר ״שבדרום, שער הדלק. שני לו, שער הבכורות. שלישי לו, שער המים״ (מדות א, ד); בחירת מודל"],
        [T.in1 - 0.4, "״עלה בכבש ופנה לשמאלו, שני ספלים של כסף היו שם״ (סוכה ד, ט) — בבית שני; בבית ראשון: ״ויורדין מן המזבח ולרצפה ושותתין שם״ (רש״י זבחים סא:)"],
        [T.top1 - 0.6, "״הסגן עומד על הקרן והסודרים בידו״ (תמיד ז, ג)"],
        [T.pour0 - 0.3, "״מערבי של מים, מזרחי של יין״; ״ולמנסך אומרים לו, הגבה ידך״ (סוכה ד, ט); ״ושני כהנים עומדים על שלחן החלבים ושתי חצוצרות של כסף בידם״ (תמיד ז, ג)"],
        [T.pour0 + 2.0, "״והניף הסגן בסודרין... ודברו הלוים בשיר״ (תמיד ז, ג); ״ובשנים עשר יום בשנה החליל מכה לפני המזבח... ובשמונת ימי החג״ (ערכין ב, ג). סדר המשנה נאמר בימי הבית השני"]
      ];
      const tefOn = (on) => { const TO = ctx.shared.tefOff || (ctx.shared.tefOff = new Set()); if (on) TO.add("shiloach1"); else TO.delete("shiloach1"); };
      const finish = () => {
        SHL.run = false;
        if (SHL.D) { SHL.D.DG.visible = false; if (SHL.D.duch) SHL.D.duch.visible = false; }
        if (SHL.night) { NIGHT.end(); SHL.night = false; }
        const S = SP1();
        if (S && fnc(S.streamTo)) S.streamTo(null);
        if (S && fnc(S.lights)) S.lights(false);
        tefOn(false);
        const sv = SHL.saved;
        if (sv && sv.lg) sv.lg.visible = sv.labels;
        if (sv && sv.view && ctx.shared.viewLimits) ctx.shared.viewLimits.set(sv.view);
        if (sv && sv.fade != null && ctx.shared.fadeState) ctx.shared.fadeState.on = sv.fade;
        if (SHL.camLow != null) ctx.shared.camLow = SHL.camLow; else delete ctx.shared.camLow;
        SHL.saved = null;
      };
      const start = () => {
        const T00 = performance.now();
        const Wk = ctx.shared.walk, S = SP1() || buildSpring();
        if (!Wk || !K || !S) return false;
        const D2 = buildDemo();
        if (fnc(ctx.shared.stopDemos)) ctx.shared.stopDemos("shiloachDemo1");
        let lg = null;
        try { lg = ctx.root.getObjectByName("labels"); } catch (_) {}
        SHL.saved = { lg, labels: lg ? lg.visible : true, view: ctx.shared.viewLimits ? ctx.shared.viewLimits.get() : null, fade: ctx.shared.fadeState ? ctx.shared.fadeState.on : null };
        if (lg) lg.visible = false;
        if (ctx.shared.fadeState) ctx.shared.fadeState.on = false;
        if (ctx.shared.viewLimits) { for (const k of keys()) { ctx.shared.viewLimits.include(k[1]); ctx.shared.viewLimits.include(k[2]); } }
        ctx.shared.camLow = Math.min(-27.5, S.gy - 3);
        SHL.night = !!NIGHT.begin();
        tefOn(true);
        try { const t0 = performance.now(); buildRoute(D2); SHL.routeMs = performance.now() - t0; } catch (e) { console.warn("[parallels] shiloach route", e && e.message); }   // ROUTE_CROWD
        D2.DG.visible = true;
        SHL.run = true;
        apply(0);
        Wk.run(keys(), caps, finish);
        SHL.startMs = performance.now() - T00;
        return true;
      };
      const stop = () => { if (!SHL.run) return; const Wk = ctx.shared.walk; if (Wk && Wk.on) Wk.stop(); else finish(); };
      let sndT = -1;
      ctx.animated.push(() => {
        if (!SHL.run) { sndT = -1; return; }
        const Wk = ctx.shared.walk, t = Wk && fnc(Wk.now) ? Math.max(0, Wk.now()) : 0;
        try { apply(t); } catch (e) { console.warn("[parallels] shiloach", e && e.message); }
        try {
          if (sndT >= 0 && t > sndT && fnc(ctx.shared.sfx)) {
            if (sndT < 0.8 && t >= 0.8) ctx.shared.sfx("trumpets");
            for (const ts of [T.path1 - 1.2, T.rim1 + 1.5, T.fill0 + 2.5]) if (sndT < ts && t >= ts) ctx.shared.sfx("water", { dur: 4.5, gain: 3.2 });   // "נובעים בקול גדול"
            if (sndT < T.blow0 && t >= T.blow0) ctx.shared.sfx("trumpets");
            if (sndT < T.pour0 && t >= T.pour0) ctx.shared.sfx("trumpets");
            if (sndT < T.pour0 + 0.5 && t >= T.pour0 + 0.5) ctx.shared.sfx("water", { dur: 2.0, gain: 0.6 });
          }
        } catch (_) {}
        sndT = t;
      });
      const walkEntry = () => (ctx.shared.demoStops || []).find((q) => q.id === "walk");
      (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({ id: "shiloachDemo1", running: () => SHL.run, stop,
        pause: () => { const w = walkEntry(); if (w && w.pause) w.pause(); }, resume: () => { const w = walkEntry(); if (w && w.resume) w.resume(); },
        paused: () => { const w = walkEntry(); return !!(w && w.paused && w.paused()); }, restart: () => { stop(); start(); } });
      ctx.shared.shiloachDemo1 = { start, stop, T, get on() { return SHL.run; }, at: (t) => { buildSpring(); const D2 = buildDemo(); D2.DG.visible = true; apply(t); }, D: () => SHL.D, ways: () => WAYS(), spring: () => buildSpring(), keys: () => keys(), stats: () => ({ route: SHL.D && SHL.D.route ? SHL.D.route.userData.count : 0, routeMs: SHL.routeMs, walkers: SHL.D && SHL.D.fol ? SHL.D.fol.length : 0, startMs: SHL.startMs }) };
    }

    // ---------- 11. THE THIRTEEN SHOFAROT (item 22; the user's decision 112 ג, 22.11.2026 12:09: a switch of its own, off) ----------
    // Mishnah Shekalim 6:5 (54:42) "שלשה עשר שופרות היו במקדש, וכתוב עליהם, תקלין חדתין ותקלין עתיקין, קנין וגוזלי עולה, עצים, ולבונה, זהב
    // לכפרת. ששה, לנדבה" - said of the Second Temple. For the First Temple: the Malbim on II Kings 12:10 (3379:449) "וי"ל שרמז זה במ"ש ארון
    // אחד... שכל הי"ג ארונות נקראו בשם ארון אחד שאחד מספרו י"ג"; the Yerushalmi Shekalim 6:4 (154:215) "על ידי שהנדבה מרובה ריבו לה שופרות
    // הרבה. [שנאמר] וככלותם הביאו לפני המלך ויהוידע"; the Bartenura (2:1, 593:56) "כההיא דכתיב ביהוידע... והיו עומדים בעזרה". IN THIS
    // HOUSE: in the inner court, by Jehoiada's inner chest (20-mount.js, MNT_ARON_IN [70, -8]) - "אצל המזבח מימין בבוא איש בית ה׳" (II Kings
    // 12:10): north of the axis, on the right of him who comes in by the east gate; a row along z at x 80, their mouths to the west. The form
    // as the Second Temple's (57-add208.js): "תבות צרות מלמעלה ורחבות מלמטה עקמות כעין שופר" (the Bartenura 6:1, 593:213). Their place, size
    // and metal - model choices. A switch (a place with its feature and a pill on the model), off by default.
    {
      const shG = new Group();
      shG.name = "shofarot13";
      shG.visible = false;
      g.add(shG);
      ctx.layers.shofarot13 = shG;
      const prof = [[0, 0], [0.52, 0], [0.56, 0.08], [0.52, 0.45], [0.44, 0.85], [0.33, 1.15], [0.24, 1.32], [0.2, 1.4], [0, 1.4]].map(([r, y]) => new Vector2(r, y));
      const body = new LatheGeometry(prof, 20);
      const neck = new TubeGeometry(new CatmullRomCurve3([new Vector3(0, 1.36, 0), new Vector3(0, 1.62, 0), new Vector3(0.12, 1.86, 0), new Vector3(0.38, 1.98, 0)]), 16, 0.15, 10, false);
      const lip = new TorusGeometry(0.15, 0.04, 6, 16);
      const X0 = 80, Z0 = -10.5, DZ = -2.1, tmp = new Group();
      for (let i = 0; i < 13; i++) {
        const b = new Group(); b.position.set(X0, AZ, Z0 + i * DZ); b.rotation.y = Math.PI;   // the curved mouths toward the court (west)
        tmp.add(b);
        b.add(new Mesh(body, M2.bronze), new Mesh(neck, M2.bronze));
        const l = new Mesh(lip, M2.gold || M2.bronze); l.position.set(0.38, 1.98, 0); l.rotation.y = Math.PI / 2; b.add(l);
      }
      par_mergeInto(shG, tmp, { shadow: true, noPick: false });
      ctx.labels.push({ text: "שלשה עשר שופרות (שקלים ו, ה; מלבי״ם מלכים ב יב, י)", x: X0, y: AZ + 4.2, z: Z0 + 6 * DZ, size: 1.6, layer: "shofarot13" });
      const set13 = (on) => { shG.visible = !!on; return shG.visible; };
      ctx.shared.shofarot13 = { get on() { return shG.visible; }, set: set13, at: [X0, AZ, Z0 + 6 * DZ] };
      (ctx.shared.features = ctx.shared.features || {}).shofarot13 = { key: "shofarot13", timed: false, isOn: () => shG.visible, on: () => set13(true), off: () => set13(false) };
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({
        id: "par-shofarot13", label: "הצג את שלושה עשר השופרות", labelOn: "הסתר את שלושה עשר השופרות",
        title: "״שלשה עשר שופרות היו במקדש״ (שקלים ו, ה); בבית ראשון — כרמז המלבי״ם (מלכים ב יב, י): ״שכל הי\"ג ארונות נקראו בשם ארון אחד״. כבוי כברירת מחדל",
        anchor: [X0, AZ + 3, Z0 + 6 * DZ], maxDist: 120, get: () => shG.visible, set: (on) => { set13(on); }
      });
    }

    // ---------- 12. THE CITY OF DAVID - A LAYER OF ITS OWN, OFF (the user's decision 153 א, 22.11.2026) - AND THE MILLO (150 א, 151 א, 152 א) ----------
    // The layer ctx.layers.irDavid (off): built only when it is first shown (as the spring - nothing at the load). Its outline, wall, the
    // fortress of Zion and the gates wait for the sources (the coordinator); until then IR_C.poly is provisional (the simple houses only).
    // THE MILLO: "וישב דוד במצדה ויקרא לה עיר דוד ויבן דוד סביב מן המלוא וביתה" (II Sam 5:9); "אך בת פרעה עלתה מעיר דוד אל ביתה אשר בנה
    // לה אז בנה את המלוא" (I Kings 9:24); "שלמה בנה את המלוא סגר את פרץ עיר דוד אביו" (11:27). Its place (the user, 150 א): outside the
    // fortress's wall and inside the city's wall, against the city's wall, by Pharaoh's daughter's house (60-palace.js: x 35..65, z 560..610) -
    // the Radak's Shorashim (6063:2110) "סמוך לחומה מבפנים", Rashi II Sam 5:9 (3688:113) "סביב למצודה", Metzudat David I Kings 9:24 (3345:889)
    // "שהיה סמוך לביתה". MILLO_C - its centre and size (moved when the city's wall is placed). Two rows: its FORM (151 א) - an open square for
    // the people's gatherings (the Radak 3541:200, the Shorashim, Metzudat David, the Malbim, the Ralbag, Abarbanel; the default) or Rashi's
    // mound - "הקף חומה נמוכה, וממלאין אותה עפר, וגבה התל באמצע, ומשפע והולך לכל רוח" (3688:113); and its TIME - before Solomon: empty, the
    // pilgrims' tents ("כי אביו הניחו לפרש בו עולי רגלים אהלים", Rashi I Kings 9:24, 3673:579), on Rashi's mound David's houses too ("ועליו
    // בנה דוד בתים"); after Solomon (the default - the model's time): houses for her servants ("לבנות לתוכו בתים, לעבדיה ולשפחותיה", 3673:579;
    // the Malbim 3394:580 "להיות מוגדר בשבילה לצניעות ובתים לעבדיה ומשרתיה" - the square fenced), and in Rashi's reading the tower ("ובנה שם
    // מגדל לבת פרעה ולאנשים שעובדין לה", Rashi Sanhedrin 101b, 2180:5595 - the user, 152 א). The breach in the city's wall - with the wall.
    // No women's figures: the pilgrims are men (the shared people kit). Sizes, the houses, the tents and the tower - model choices.
    {
      const IR = new Group(); IR.name = "irDavid"; IR.visible = false; g.add(IR); ctx.layers.irDavid = IR;
      const TH = (x, z) => (typeof ctx.shared.terrainH === "function" ? ctx.shared.terrainH(x, z) : -28);   // the ground (20-mount.js)
      const fnc = (f) => typeof f === "function", groundY = (x, z, from) => { const y = fnc(ctx.shared.floorY) ? ctx.shared.floorY(x, from == null ? 40 : from, z) : -Infinity; return isFinite(y) ? y : -28; };
      const flag = (name, on) => { const f = new Group(); f.name = name; f.visible = on; IR.add(f); ctx.layers[name] = f; return f; };
      const FL = { plaza: flag("milloPlaza", true), tel: flag("milloTel", false), before: flag("milloBefore", false), after: flag("milloAfter", true), hez: flag("irHezekiah", false),
        fortSep: flag("irFortSep", true), fortRashi: flag("irFortRashi", false) };
      // THE CITY (the user's decision 155 א, 22.11.2026, on the sources' proposal 62): south of the palace's terrace (60-palace.js: x 10..196,
      // z 352.5..672.5, its top -10) and lower than it, on a ridge that goes down southward; the Gihon below it ("כלם ירדו מציון עיר דוד שהיה
      // שם בגבוה העיר אל גיחון שהיה בשפל ההר", Abarbanel I Kings 1:38, 3574:116; "אך בת־פרעה עלתה מעיר דוד", 9:24). IR_C: its north edge
      // (N, from W to E), its southern tip (tip - a parameter: by the spring, when the spring's place is decided - 156 ב), the ridge's
      // heights (GR below). Its size, the ridge's form and the wall's line - model choices.
      const IR_C = { N: 690, W: 0, E: 210, tip: [105, 1010], houses: 750 };
      // THE GROUND (the coordinator's note, 22.11.2026 ~16:40, on the sources' 1.3 and 62 - "עלתה מעיר דוד", "בגבוה העיר אל גיחון שהיה בשפל
      // ההר"): a ridge high in the north (by the palace's terrace, -10 - the crest a little under it, the fortress at the top) going down
      // southward (drop); terraces across it (NT steps of RS amot up from the wall to the crest - the lanes and the houses on them follow the
      // heights); the wall on the brow, and outside it a steep slope down to the valleys' ground (Dk amot out for each amah of height, at
      // least D0); at the south-western corner the ground goes down to the pool's level (the spring and the pool below). Model choices.
      const GR = { crestN: -11.0, crestS: -16.5, relN: 3.0, relS: 1.0, minSpan: 1.5, NT: 5, RS: 10, D0: 6, Dk: 2.0 };   // the spine's height north/south; the brow over the valley north/south
      const MILLO_C = { x: 16, z: 722, w: 28, d: 44 };   // inside the city's west wall, at its north end - the nearest to Pharaoh's daughter's house (model choice)
      const ML = { form: "plaza", time: "after", fortress: "sep", built: false, parts: null,
        fort: { x0: 92, x1: 160, z0: 704, z1: 762 },   // the fortress of Zion: in the city's upper part (model choice)
        towerAt: [154, 710], davidAt: [62, 790] };     // its tower; David's house (model choice)
      const stoneM = M2.stoneLight || M2.stone, earthM = new MeshStandardMaterial({ color: 0xa48a62, roughness: 1 }), floorM = new MeshStandardMaterial({ color: 0xc2ab84, roughness: 1 });
      const plasterM = new MeshStandardMaterial({ color: 0xd9ccb2, roughness: 0.95 }), roofM = new MeshStandardMaterial({ color: 0x8f7a5a, roughness: 1 });
      const tentMs = [0xe8dcc0, 0xc9b48a, 0xb88c5a, 0x9c7b52].map((c) => new MeshStandardMaterial({ color: c, roughness: 0.95, side: DoubleSide }));
      // the city's outline and its ridge: high along its middle, down to the ground (-28.5) at the wall; level under the Millo
      const POLY = (() => { const { N, W, E, tip } = IR_C, [tx, tz] = tip, L = tz - N; return [[W, N], [E, N], [E + 12, N + L * 0.25], [E, N + L * 0.53], [tx + 60, tz - 60], [tx, tz], [tx - 60, tz - 60], [W - 5, N + L * 0.53], [W - 12, N + L * 0.25]]; })();
      const inPoly = (x, z) => { let c = false; for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) { const [xi, zi] = POLY[i], [xj, zj] = POLY[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
      const edgeDist = (x, z) => { let d = Infinity; for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) { const [ax, az] = POLY[j], [bx, bz] = POLY[i], vx = bx - ax, vz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz))); d = Math.min(d, Math.hypot(x - ax - vx * t, z - az - vz * t)); } return d; };
      const segDist = (x, z, A, B) => { const vx = B[0] - A[0], vz = B[1] - A[1], t = Math.max(0, Math.min(1, ((x - A[0]) * vx + (z - A[1]) * vz) / (vx * vx + vz * vz))); return Math.hypot(x - A[0] - vx * t, z - A[1] - vz * t); };
      const edgeNear = (x, z) => { let d = Infinity, ex = x, ez = z; for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) { const [ax, az] = POLY[j], [bx, bz] = POLY[i], vx = bx - ax, vz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz))), qx = ax + vx * t, qz = az + vz * t, dd = Math.hypot(x - qx, z - qz); if (dd < d) { d = dd; ex = qx; ez = qz; } } return { d, ex, ez }; };
      const sstep = (u) => { const v = Math.max(0, Math.min(1, u)); return v * v * (3 - 2 * v); };
      // the brow's height (at the wall) - down southward, never under the valley's ground + minRel; the terraces up from it to the crest
      const kz = (z) => Math.max(0, Math.min(1, (z - IR_C.N) / (IR_C.tip[1] - IR_C.N))), crest = (z) => GR.crestN + (GR.crestS - GR.crestN) * kz(z);
      const brow = (x, z) => TH(x, z) + GR.relN + (GR.relS - GR.relN) * kz(z);   // the brow (at the wall) - over the valley's ground beside it
      const tfrac = (d) => { const t = Math.max(0, Math.min(GR.NT, (d - 2) / GR.RS)), f = Math.floor(t), r = t - f; return Math.min(GR.NT, f + sstep((r - 0.7) / 0.3)) / GR.NT; };   // 0 at the wall .. 1 on the spine, in steps (terraces)
      const span = (x, z) => Math.max(GR.minSpan, crest(z) - brow(x, z));
      const MILLO_Y = () => padOf("millo").y;
      // the pool of the Shiloach (within the wall, at the south-western corner - section 10's SPRING_C.poolAt), the king's garden by it
      // (decision 161), David's tombs (162) and the stairs down from the city to the pool (Nehemiah 3:15)
      const POOL_AT = (ctx.shared.shiloach1 && ctx.shared.shiloach1.place && ctx.shared.shiloach1.place.poolAt) || [50, 930];
      // David's tombs OUTSIDE the city's wall, close by it, near the Shiloach pool (the user's 167 b, 22.11.2026 15:57) - the Radbaz on
      // Beit HaBechira 7:14 (5308:135): "והלא קברי בית דוד וקבר חולדה אינם בתוך ירושלים... וקברי בית דוד וקבר חולדה סמוכות היו"; no tunnel
      // (5308:130: "תדע שהרי קברי מלכות בית דוד לא מצינו שיהיה להם מחילות"). On the south-western wall (POLY[7] -> POLY[6]), six tenths
      // along it (clear of the spring's channel), the rock against the wall's outer face, the cave's opening outward. The place along the wall - a model choice.
      const TOMB_FX = 6.0;   // the rock face, this far out from the wall's line (the bank before it hewn steep)
      const TOMBS = (() => {
        const A = POLY[7], B = POLY[6], u = 0.6, ex = A[0] + (B[0] - A[0]) * u, ez = A[1] + (B[1] - A[1]) * u, L = Math.hypot(B[0] - A[0], B[1] - A[1]);
        let nx = (B[1] - A[1]) / L, nz = -(B[0] - A[0]) / L;
        if (nx * ((IR_C.W + IR_C.E) / 2 - ex) + nz * ((IR_C.N + IR_C.tip[1]) / 2 - ez) > 0) { nx = -nx; nz = -nz; }   // outward, away from the city
        return { e: [ex, ez], at: [ex + nx * (TOMB_FX + 2), ez + nz * (TOMB_FX + 2)], n: [nx, nz] };   // e: on the wall's line; at: before the opening
      })();
      const GARDEN_C = { x: 76, z: 946, w: 22, d: 15 }, TOMBS_AT = TOMBS.at, STAIR_C = { a: [84, 892], b: [58, 920] };
      // the low corner: the pool and the king's garden by it, at the pool's level (or a little over the valley's ground)
      const GARDEN_P = [GARDEN_C.x, GARDEN_C.z];
      const lowK = (x, z) => 1 - sstep((segDist(x, z, POOL_AT, GARDEN_P) - 13) / 16);
      const lowLevel = (x, z) => Math.max(TH(POOL_AT[0], POOL_AT[1]) - 0.5, TH(x, z) + 0.2);
      // level pads: the Millo, the fortress (the city's upper part) and David's house with the ark's tent - each at its own middle's height
      const PADS = [{ id: "millo", x0: MILLO_C.x - MILLO_C.w / 2 - 2, x1: MILLO_C.x + MILLO_C.w / 2 + 2, z0: MILLO_C.z - MILLO_C.d / 2 - 2, z1: MILLO_C.z + MILLO_C.d / 2 + 2 },
        { id: "fort", x0: ML.fort.x0 - 5, x1: ML.fort.x1 + 5, z0: ML.fort.z0 - 5, z1: ML.fort.z1 + 5 },
        { id: "david", x0: ML.davidAt[0] - 13, x1: ML.davidAt[0] + 30, z0: ML.davidAt[1] - 9, z1: ML.davidAt[1] + 9 }];
      const plateau = (x, z, d) => brow(x, z) + span(x, z) * tfrac(d);
      const padOf = (id) => { const P = PADS.find((q) => q.id === id); if (P.y == null) { const cx = (P.x0 + P.x1) / 2, cz = (P.z0 + P.z1) / 2; P.y = plateau(cx, cz, edgeDist(cx, cz)); } return P; };
      const inside = (x, z, d) => {
        if (Math.hypot(x - POOL_AT[0], z - POOL_AT[1]) < 11) return TH(POOL_AT[0], POOL_AT[1]) - 0.5;   // the pool's ground
        let h = plateau(x, z, d);
        for (const P0 of PADS) { const P = padOf(P0.id), bx = Math.max(P.x0 - x, 0, x - P.x1), bz = Math.max(P.z0 - z, 0, z - P.z1), k = 1 - sstep(Math.hypot(bx, bz) / 6); if (k > 0) h += (P.y - h) * k; }
        const lk = lowK(x, z); if (lk > 0) h += (lowLevel(x, z) - h) * lk;
        return Math.max(h, TH(x, z) + 0.2);
      };
      // the ground of the layer: inside the wall - the plateau; outside - the slope from the brow down to the valley (under the ground beyond)
      const ridgeH = (x, z) => {
        if (inPoly(x, z)) return inside(x, z, edgeDist(x, z));
        const E = edgeNear(x, z), he = inside(E.ex, E.ez, 0), rel = he - TH(E.ex, E.ez);
        if (rel <= 0.3) return TH(x, z) - 12;
        let D = Math.max(GR.D0, GR.Dk * rel);
        { const [nx, nz] = TOMBS.n, px = x - TOMBS.e[0], pz = z - TOMBS.e[1], ta = Math.abs(-px * nz + pz * nx), tp = px * nx + pz * nz;   // by David's tombs: a hewn bank, steep
          if (ta < 16 && tp > -2 && tp < 30) D += (Math.min(D, TOMB_FX - 0.4) - D) * (1 - sstep((ta - 9) / 7)); }
        if (E.d >= D) return TH(x, z) - 12;
        return Math.max(TH(x, z) - 0.05, TH(x, z) + rel * (1 - sstep(E.d / D)));
      };
      const groundAt = (x, z) => Math.max(TH(x, z), ridgeH(x, z));
      const gyAt = (x, z) => ridgeH(x, z);
      const instBoxes = (parent, list, mat, name) => {   // list [[x, y, z, sx, sy, sz, ry]] - one InstancedMesh (a unit box from its floor up)
        const geo = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0), im = new InstancedMesh(geo, mat, list.length), m4 = new Matrix4(), qq = new Quaternion(), e = new Euler(), v = new Vector3(), sc = new Vector3();
        list.forEach((b, i) => { qq.setFromEuler(e.set(0, b[6] || 0, 0)); m4.compose(v.set(b[0], b[1], b[2]), qq, sc.set(b[3], b[4], b[5])); im.setMatrixAt(i, m4); });
        im.castShadow = im.receiveShadow = true; im.name = name || "irBoxes"; im.userData.noPick = true; parent.add(im); return im;
      };
      const instBoxesC = (parent, list, cols, name) => {   // as instBoxes, each box its own colour (cols: hex per box) - a white material
        const im = instBoxes(parent, list, new MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), name), col = new Color();
        list.forEach((b, i) => im.setColorAt(i, col.setHex(cols[i % cols.length] != null ? cols[i] : 0xd9ccb2)));
        if (im.instanceColor) im.instanceColor.needsUpdate = true; return im;
      };
      // an outline moved inward by d (the outline is convex): the outline clipped by each edge's half-plane moved in by d (edges that vanish
      // on the way drop out by themselves); null when nothing is left
      const inset = (d) => {
        const n = POLY.length, cx = (IR_C.W + IR_C.E) / 2, cz = (IR_C.N + IR_C.tip[1]) / 2;
        let poly = POLY.map((p2) => p2.slice());
        for (let i = 0; i < n && poly.length >= 3; i++) {
          const [ax, az] = POLY[i], [bx, bz] = POLY[(i + 1) % n], l = Math.hypot(bx - ax, bz - az);
          let nx = -(bz - az) / l, nz = (bx - ax) / l; if (nx * (cx - ax) + nz * (cz - az) < 0) { nx = -nx; nz = -nz; }
          const f = (p2) => (p2[0] - ax) * nx + (p2[1] - az) * nz - d, out = [];
          for (let j = 0; j < poly.length; j++) {
            const P = poly[j], Q = poly[(j + 1) % poly.length], fp = f(P), fq = f(Q);
            if (fp >= 0) out.push(P);
            if ((fp >= 0) !== (fq >= 0)) { const t = fp / (fp - fq); out.push([P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]); }
          }
          poly = out;
        }
        poly = poly.filter((p2, j) => Math.hypot(p2[0] - poly[(j + 1) % poly.length][0], p2[1] - poly[(j + 1) % poly.length][1]) > 0.5);
        return poly.length >= 3 ? poly : null;
      };
      const houses = (parent, pts, name) => {   // simple houses: walls 5 x 3.6 x 5 and a flat roof - two InstancedMeshes
        instBoxes(parent, pts.map((p) => [p[0], p[1], p[2], p[3] || 5, p[6] || 3.6, p[4] || 5, p[5] || 0]), plasterM, name);   // p[6]: the walls' height (from p[1])
        instBoxes(parent, pts.map((p) => [p[0], p[1] + (p[6] || 3.6), p[2], (p[3] || 5) + 0.4, 0.35, (p[4] || 5) + 0.4, p[5] || 0]), roofM, name + "Roof");
      };
      const buildMillo = () => {
        if (ML.parts) return ML.parts;
        const C = MILLO_C, hx = C.w / 2, hz = C.d / 2, gy = gyAt(C.x, C.z), G0 = new Group(); G0.name = "millo"; IR.add(G0);
        const P = new Group(), T = new Group(), tentsP = new Group(), tentsT = new Group(), housesP = new Group(), housesT = new Group(), davidT = new Group(), fence = new Group(), tower = new Group(), pilgrims = new Group();
        for (const q of [P, T]) G0.add(q);
        P.add(tentsP, housesP, fence); T.add(tentsT, housesT, davidT, tower); G0.add(pilgrims);
        // the square: a floor of beaten earth
        H2.box(P, C.w, 0.25, C.d, floorM, C.x, gy, C.z);
        // Rashi's mound: the low wall round it and the earth within, high in the middle and falling to every side
        const LW = 2.0, LT = 0.9;
        for (const [sx, sz, lx, lz] of [[0, -1, C.w, LT], [0, 1, C.w, LT], [-1, 0, LT, C.d], [1, 0, LT, C.d]]) H2.box(T, lx, LW, lz, stoneM, C.x + sx * (hx - LT / 2), gy, C.z + sz * (hz - LT / 2));
        // Rashi (II Samuel 5:9, 3688:113): "וגבה התל באמצע, ומשפע והולך לכל רוח" - a rounded hill, high in its middle, falling to every side (the coordinator's note)
        // a natural rounded hill: broad and round on top, its sides falling to the low wall (a dome, (1 - m²)^0.75), a little uneven
        // (the hill to 0.8 of the way to the low wall; a level ring of earth inside the wall round its foot)
        // its crown level (TOP) - David's houses stand on it ("ועליו בנה דוד בתים", Rashi there), the houses on the ground, not over the slope
        const HR = 0.8, TOPH = 5.6, moundH = (lx, lz) => { const m = Math.min(1, Math.hypot(lx / (hx - LT), lz / (hz - LT)) / HR); return LW - 0.2 + Math.min(TOPH, 7.0 * Math.pow(1 - m * m, 0.75) + 0.3 * Math.sin(lx * 0.7) * Math.cos(lz * 0.45) * (1 - m)); };
        // the hill (the coordinator's note: a clear hill, not a blur): a body of earth with its own light and shade and shadow, rising out of a
        // level floor of beaten earth in a clear line; stones on its sides; on its crown a level floor and a low retaining wall round it
        const mR = (lx, lz) => Math.hypot(lx / (hx - LT), lz / (hz - LT)) / HR;
        {
          const IW = C.w - 2 * LT, ID = C.d - 2 * LT;
          const fl = new Mesh(new PlaneGeometry(IW, ID).rotateX(-Math.PI / 2), new MeshStandardMaterial({ color: 0xc8b48d, roughness: 1 })); fl.position.set(C.x, gy + LW - 0.2 + 0.01, C.z); fl.receiveShadow = true; T.add(fl);   // the level floor round the hill
          const geo = new PlaneGeometry(IW, ID, 44, 70).rotateX(-Math.PI / 2), ps = geo.attributes.position;
          for (let i = 0; i < ps.count; i++) { const lx = ps.getX(i), lz = ps.getZ(i); ps.setY(i, mR(lx, lz) >= 1 ? LW - 0.2 - 0.3 : moundH(lx, lz)); }   // outside its foot - under the floor
          geo.computeVertexNormals();
          const mm = new Mesh(geo, new MeshStandardMaterial({ color: 0xa88d5c, roughness: 1 })); mm.position.set(C.x, gy, C.z); mm.castShadow = mm.receiveShadow = true; T.add(mm);
          // stones on its sides
          const sg = new IcosahedronGeometry(0.32, 0), sm3 = new MeshStandardMaterial({ color: 0x8a7a60, roughness: 1, flatShading: true }), st = new InstancedMesh(sg, sm3, 70), m4 = new Matrix4(), qq = new Quaternion(), e = new Euler(), v = new Vector3(), sc = new Vector3();
          let qs = 7071, nS = 0; const rs = () => (qs = (qs * 1664525 + 1013904223) >>> 0) / 4294967296;
          for (let i = 0; i < 400 && nS < 70; i++) { const lx = (rs() - 0.5) * IW, lz = (rs() - 0.5) * ID, m = mR(lx, lz); if (m < 0.55 || m > 0.97) continue; const k3 = 0.6 + rs() * 1.1; qq.setFromEuler(e.set(rs() * 3, rs() * 3, rs() * 3)); m4.compose(v.set(C.x + lx, gy + moundH(lx, lz) - 0.08, C.z + lz), qq, sc.set(k3, k3 * 0.7, k3)); st.setMatrixAt(nS++, m4); }
          st.count = nS; st.castShadow = true; T.add(st);
          // the crown: where the hill reaches TOPH - a level floor and a low retaining wall round its edge
          const mc = Math.sqrt(1 - Math.pow(TOPH / 7.0, 4 / 3)), ca = (hx - LT) * HR * mc, cb = (hz - LT) * HR * mc, cy = gy + LW - 0.2 + TOPH;
          const cf = new Mesh(new CircleGeometry(1, 48).rotateX(-Math.PI / 2), new MeshStandardMaterial({ color: 0xcdb991, roughness: 1 })); cf.scale.set(ca, 1, cb); cf.position.set(C.x, cy + 0.04, C.z); cf.receiveShadow = true; T.add(cf);
          const NW = 30, wl = [];
          for (let i = 0; i < NW; i++) { const a0 = i / NW * Math.PI * 2, a1 = (i + 1) / NW * Math.PI * 2, x0 = Math.cos(a0) * ca, z0 = Math.sin(a0) * cb, x1 = Math.cos(a1) * ca, z1 = Math.sin(a1) * cb; wl.push([C.x + (x0 + x1) / 2, cy - 1.3, C.z + (z0 + z1) / 2, Math.hypot(x1 - x0, z1 - z0) + 0.12, 1.8, 0.55, -Math.atan2(z1 - z0, x1 - x0)]); }
          instBoxes(T, wl, stoneM, "milloCrownWall");
          T.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        }
        const yT = (x, z) => gy + moundH(x - C.x, z - C.z), yTs = (x, z, w) => { const r = []; for (const u of [-0.5, 0, 0.5]) for (const v of [-0.5, 0, 0.5]) r.push(yT(x + u * w, z + v * w)); return r; };
        const yTmin = (x, z, w) => Math.min(...yTs(x, z, w)), onHill = (x, z, w, ry) => { const r = yTs(x, z, w), lo = Math.min(...r) - 0.3; return [x, lo, z, w, w, ry || 0, Math.max(...r) - lo + 3.0]; };   // a house on the hill: its foundation down to the lowest ground
        // the pilgrims' tents (before Solomon): four-sided, of cloth
        const tentFlat = tentMs.map((m) => { const q = m.clone(); q.flatShading = true; return q; });   // crisp cloth faces
        const tentGeo = new CylinderGeometry(1.5, 1.5, 3.4, 3, 1, false).rotateZ(Math.PI / 2).rotateX(-Math.PI / 2).translate(0, 0.75, 0);   // a ridge tent: a prism of cloth, its ridge along x
        const tent = (parent, x, y, z, i) => { const t = new Mesh(tentGeo, tentFlat[i % tentFlat.length]); t.position.set(x, y, z); t.rotation.y = (i * 0.7) % 1.5; t.castShadow = true; t.userData.noPick = true; parent.add(t); };
        let k = 0;
        for (let iz = 0; iz < 5; iz++) for (let ix = 0; ix < 3; ix++) { const x = C.x - hx + 5 + ix * ((C.w - 10) / 2) + ((iz % 2) ? 1.2 : -1.2), z = C.z - hz + 5 + iz * ((C.d - 10) / 4); tent(tentsP, x, gy + 0.25, z, k++); }
        // (Rashi's mound: no tents on it - the pilgrims' tents and the pilgrims are on the open square, the default reading)
        // the pilgrims: men, standing and sitting by the tents
        try {
          const PPm = tm_people(ctx), ptsS = [], ptsG = [];
          let q = 15011; const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
          for (let i = 0; i < 18; i++) { const x = C.x + (rr() - 0.5) * (C.w - 6), z = C.z + (rr() - 0.5) * (C.d - 6); (i % 3 ? ptsS : ptsG).push([x, z, rr() * 6.28]); }
          const COLS = [0x6b5a3e, 0x4a4f5a, 0x5c4a3a, 0x3e4a5e, 0x7a6a50];
          PPm.crowd(pilgrims, ptsS, { y: gy + 0.25, s: 1.4, pose: "stand", kind: "worker", robe: COLS[1], tone: (i) => i % 4, name: "milloPilgrims" });
          PPm.crowd(pilgrims, ptsG, { y: gy + 0.25, s: 1.4, pose: "ground", kind: "worker", robe: COLS[3], tone: (i) => (i + 2) % 4, name: "milloPilgrimsSit" });
        } catch (e) { console.warn("[parallels] millo pilgrims", e && e.message); }
        // after Solomon: the houses for her servants - on the square in two rows (and the square fenced, as the Malbim), on the mound in a grid
        const hp = []; for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) hp.push([C.x + sx * (hx - 4.2), gy + 0.25, C.z - hz + 4.5 + i * ((C.d - 9) / 5), 5, 5, 0]);
        houses(housesP, hp, "milloHousesP");
        const FT = 0.7, FH = 3.2, GW = 5;   // the fence round the square: a gate in the east (toward her house)
        for (const [sx, sz, lx, lz] of [[0, -1, C.w, FT], [0, 1, C.w, FT], [-1, 0, FT, C.d]]) H2.box(fence, lx, FH, lz, stoneM, C.x + sx * (hx - FT / 2), gy, C.z + sz * (hz - FT / 2));
        for (const sz of [-1, 1]) H2.box(fence, FT, FH, (C.d - GW) / 2, stoneM, C.x + hx - FT / 2, gy, C.z + sz * (GW / 2 + (C.d - GW) / 4));
        const CROWN = [[-1.0, -4.4], [1.3, 0], [-0.8, 4.4]];   // on the hill's level crown, inside its retaining wall
        const ht = CROWN.map(([lx, lz]) => onHill(C.x + lx, C.z + lz, 3.4, 0));
        houses(housesT, ht, "milloHousesT");
        const hd = CROWN.map(([lx, lz]) => onHill(C.x + lx, C.z + lz, 3.4, 0.12));   // David's houses on the hill ("ועליו בנה דוד בתים")
        { let n = 0, f = 0; for (const q of ht.concat(hd)) { n++; const w = q[3], c = Math.cos(q[5]), sn = Math.sin(q[5]); for (const [u, v] of [[-w / 2, -w / 2], [w / 2, -w / 2], [-w / 2, w / 2], [w / 2, w / 2]]) if (q[1] - yT(q[0] + u * c + v * sn, q[2] - u * sn + v * c) > 0.05) { f++; break; } } ML.milloChk = { houses: n, fail: f }; }
        houses(davidT, hd, "milloHousesDavid");
        // Rashi (Sanhedrin 101b): the tower for Pharaoh's daughter - at the city's wall's side (the west, for now), its foot in the low wall
        H2.box(tower, 7, 16, 7, stoneM, C.x - hx + 3.5, gy, C.z);
        for (const [dx, dz] of [[-3, -3], [-3, 0], [-3, 3], [0, -3], [0, 3], [3, -3], [3, 0], [3, 3]]) H2.box(tower, 1.2, 1.2, 1.2, stoneM, C.x - hx + 3.5 + dx, gy + 16, C.z + dz);
        G0.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        ML.parts = { P, T, tentsP, tentsT, housesP, housesT, davidT, fence, tower, pilgrims, gy };
        return ML.parts;
      };
      const applyMillo = () => {
        FL.plaza.visible = ML.form === "plaza"; FL.tel.visible = ML.form === "tel"; FL.before.visible = ML.time === "before"; FL.after.visible = ML.time !== "before"; FL.hez.visible = ML.time === "hezekiah";
        FL.fortSep.visible = ML.fortress === "sep"; FL.fortRashi.visible = ML.fortress === "rashi";
        const CP = ML.cityParts;
        if (CP) {
          CP.breachFill.visible = ML.time !== "before"; CP.outer.visible = ML.time === "hezekiah"; CP.arkTent.visible = ML.time === "before";
          CP.fortG.visible = ML.fortress === "sep"; CP.towers.visible = ML.fortress === "rashi";
        }
        const Q = ML.parts; if (!Q || !Q.P) return;
        const pl = ML.form === "plaza", bf = ML.time === "before";
        Q.P.visible = pl; Q.T.visible = !pl;
        Q.tentsP.visible = bf; Q.tentsT.visible = false; Q.pilgrims.visible = bf && pl;
        Q.housesP.visible = Q.fence.visible = !bf; Q.housesT.visible = !bf; Q.tower.visible = !bf; Q.davidT.visible = bf;
      };
      // THE CITY: the ridge, the houses, the wall (its breach before Solomon; Hezekiah's second wall and the pool between the walls), the
      // fortress of Zion and its tower (the row "מצודת ציון"), the stairs down from the city (Nehemiah 3:15), David's house and the ark's tent
      // ---- THE CHANNEL from the spring to the Shiloach pool (the user's 189 a): "יען כי מאס העם הזה את מי השלח ההלכים לאט" (Isaiah 8:6,
      // 12:167) - an open channel built of stone, narrow and shallow, its water going slowly; on the drawn ground (the terrain's own grid, and
      // the city's ground when it is built), its water level going down all the way (0.6 in a hundred) to over the great pool's back wall;
      // where it meets the city's wall, a small opening in the wall. Its course and form - model choices.
      const triAt = (A, x0, z0, nx, nz, dx, dz, x, z) => { const fx = (x - x0) / dx, fz = (z - z0) / dz, ix = Math.max(0, Math.min(nx - 1, Math.floor(fx))), iy = Math.max(0, Math.min(nz - 1, Math.floor(fz))), u = fx - ix, v = fz - iy, W1 = nx + 1, ia = ix + W1 * iy, ib = ix + W1 * (iy + 1), ic = ix + 1 + W1 * (iy + 1), id = ix + 1 + W1 * iy; return u + v <= 1 ? A(ia) + u * (A(id) - A(ia)) + v * (A(ib) - A(ia)) : A(ic) + (1 - u) * (A(ib) - A(ic)) + (1 - v) * (A(id) - A(ic)); };
      let TERR;   // the terrain's mesh (20-mount.js: 5200 wide, its vertices in the world's coordinates)
      const terrI = (x, z) => {
        if (TERR === undefined) { TERR = null; try { ctx.root.traverse((o) => { if (!TERR && o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.width === 5200) TERR = o; }); } catch (_) {} }
        if (!TERR) return TH(x, z);
        const P = TERR.geometry.parameters, A = TERR.geometry.attributes.position;
        return triAt((i) => A.getY(i) + TERR.position.y, A.getX(0) + TERR.position.x, A.getZ(0) + TERR.position.z, P.widthSegments, P.heightSegments, P.width / P.widthSegments, P.height / P.heightSegments, x, z);
      };
      const cityH = (x, z) => { const G3 = ML.gridh; if (!G3) return -Infinity; return Math.max(triAt((i) => G3.a[i], G3.x0, G3.z0, G3.nx, G3.nz, G3.dx, G3.dz, x, z), triAt((i) => G3.b[i], G3.x0, G3.z0, G3.nx, G3.nz, G3.dx, G3.dz, x, z)); };
      const drawnH = (x, z) => Math.max(terrI(x, z), cityH(x, z));
      const CHP = { ds: 1.0, slope: 0.006, wIn: 0.8, wall: 0.34, free: 0.15, floor: 0.3 };
      const chProf = () => {
        const S1 = ctx.shared.shiloachSpring1, C1 = ctx.shared.shiloach1 && ctx.shared.shiloach1.channel;
        if (!S1 || !S1.kit || !S1.kit.pool || !C1 || !fnc(S1.Wl)) return null;
        const a = S1.Wl(C1.x, C1.z0), b = S1.Wl(C1.x, C1.z1), L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(L / CHP.ds)), ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L, px = -uz, pz = ux;
        const pts = [], gmax = [], gmin = [];
        for (let i = 0; i <= n; i++) { const x = a[0] + (b[0] - a[0]) * i / n, z = a[1] + (b[1] - a[1]) * i / n; let hi = -Infinity, lo = Infinity; for (const o of [-0.7, 0, 0.7]) { const xx = x + px * o, zz = z + pz * o; hi = Math.max(hi, drawnH(xx, zz)); lo = Math.min(lo, terrI(xx, zz)); } pts.push([x, z]); gmax.push(hi); gmin.push(lo); }
        const W = new Array(n + 1), rim = S1.kit.pool.rim;
        W[n] = Math.max(rim + CHP.floor + 0.04, gmax[n] - CHP.free);   // over the great pool's back wall
        for (let i = n - 1; i >= 0; i--) W[i] = Math.max(gmax[i] - CHP.free, W[i + 1] + CHP.slope * (L / n));   // down all the way; its edge not under the ground
        const lake = S1.kit.lake ? S1.kit.lake.y : S1.kit.basinY;
        return { a, b, L, n, ux, uz, px, pz, pts, gmax, gmin, W, rim, lake, yaw: -Math.atan2(uz, ux) };
      };
      let CHG = null;
      const buildChannel = () => {
        const P = chProf(); if (!P) return null;
        if (CHG) { g.remove(CHG); CHG.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); }
        CHG = new Group(); CHG.name = "shiloachChannel1"; g.add(CHG);
        const st = [], wa = [], half = CHP.wIn / 2 + CHP.wall / 2;
        for (let i = 0; i < P.n; i++) {
          const [x0, z0] = P.pts[i], [x1, z1] = P.pts[i + 1], cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, Wm = (P.W[i] + P.W[i + 1]) / 2, len = P.L / P.n + 0.03;
          const bot = Math.min(Wm - CHP.floor - 0.15, Math.min(P.gmin[i], P.gmin[i + 1]) - 0.25), top = Wm + CHP.free;
          for (const sd of [-1, 1]) st.push([cx + P.px * sd * half, bot, cz + P.pz * sd * half, len, top - bot, CHP.wall, P.yaw]);   // its two stone sides
          st.push([cx, bot, cz, len, Wm - CHP.floor - bot, CHP.wIn + 0.02, P.yaw]);   // its stone bed
          wa.push([cx, Wm - 0.03, cz, len, 0.03, CHP.wIn, P.yaw]);   // the water
        }
        instBoxes(CHG, st, ML.chStone || (ML.chStone = new MeshStandardMaterial({ color: 0x8f7e62, roughness: 0.95 })), "shiloachChannelStone");   // a darker stone than the sand round it
        if (!ML.chTex) { const cv = document.createElement("canvas"); cv.width = 64; cv.height = 16; const c2 = cv.getContext("2d"); c2.fillStyle = "#3f86c8"; c2.fillRect(0, 0, 64, 16); for (let k = 0; k < 9; k++) { c2.fillStyle = "rgba(220,240,255," + (0.18 + 0.2 * Math.random()) + ")"; c2.fillRect(Math.random() * 64, Math.random() * 16, 10 + Math.random() * 16, 1.2); } ML.chTex = new CanvasTexture(cv); ML.chTex.wrapS = ML.chTex.wrapT = RepeatWrapping; }
        const wm = tm_water(new MeshStandardMaterial({ color: 0x9fc4e2, map: ML.chTex, transparent: true, opacity: 0.86, roughness: 0.08, metalness: 0.05 }), { mode: "flow", flow: [P.ux * 0.45, P.uz * 0.45], scale: 0.35 });   // WATER_420: its ripples go with it, slowly
        const wim = instBoxes(CHG, wa, wm, "shiloachChannelWater"); wim.castShadow = false; wim.renderOrder = 2;
        CHG.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        ML.channel = P;
        return P;
      };
      ctx.animated.push(() => { if (ML.chTex && CHG && CHG.visible) ML.chTex.offset.x -= 0.0016; });   // the water going slowly ("ההלכים לאט")
      const buildCity = () => {
        if (ML.city) return;
        ML.city = true;
        const CG = new Group(); CG.name = "irDavidCity"; IR.add(CG);
        let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (const [x, z] of POLY) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
        x0 -= 26; x1 += 26; z0 -= 26; z1 += 26;   // the slopes outside the wall
        // the ridge: a grid over the outline, its outside sunk under the ground
        let GRIDH = null;   // the drawn ground (the two meshes' heights): what stands on the city stands on this, not on ridgeH (the grid's 4-amot triangles smooth the terraces' steps)
        {
          const nx = Math.round((x1 - x0) / 4), nz = Math.round((z1 - z0) / 4), geo = new PlaneGeometry(x1 - x0, z1 - z0, nx, nz).rotateX(-Math.PI / 2), ps = geo.attributes.position;
          // two meshes on the one grid (vertex colours do not survive the plugin's shared shader patch): the city's ground, light, and under it
          // the slopes outside the wall, rock-brown - each sunk a little under the other where it is not its own
          const hts = new Float32Array(ps.count), ins = new Uint8Array(ps.count);
          for (let i = 0; i < ps.count; i++) { const x = ps.getX(i) + (x0 + x1) / 2, z = ps.getZ(i) + (z0 + z1) / 2; hts[i] = ridgeH(x, z); ins[i] = inPoly(x, z) ? 1 : 0; }
          const geoS = geo.clone(), psS = geoS.attributes.position;
          for (let i = 0; i < ps.count; i++) { ps.setY(i, ins[i] ? hts[i] : hts[i] - 0.6); psS.setY(i, ins[i] ? hts[i] - 0.25 : hts[i]); }
          GRIDH = { x0, z0, nx, nz, dx: (x1 - x0) / nx, dz: (z1 - z0) / nz, a: Float32Array.from({ length: ps.count }, (_, i) => ps.getY(i)), b: Float32Array.from({ length: ps.count }, (_, i) => psS.getY(i)) }; ML.gridh = GRIDH;
          geo.computeVertexNormals(); geoS.computeVertexNormals();
          const sm2 = new Mesh(geoS, new MeshStandardMaterial({ color: 0x8c7653, roughness: 1 })); sm2.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2); sm2.receiveShadow = true; sm2.userData.noPick = true; sm2.name = "irDavidSlopes"; CG.add(sm2);
          const rm = new Mesh(geo, new MeshStandardMaterial({ color: 0xcdb88f, roughness: 1 })); rm.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2); rm.receiveShadow = true; rm.userData.noPick = true; rm.name = "irDavidGround"; CG.add(rm);
        }
        const meshH = (x, z) => {   // the drawn ground at (x, z): the triangles of the grid (PlaneGeometry: a b d / b c d), the higher of the two meshes
          const G3 = GRIDH, fx = (x - G3.x0) / G3.dx, fz = (z - G3.z0) / G3.dz, ix = Math.max(0, Math.min(G3.nx - 1, Math.floor(fx))), iy = Math.max(0, Math.min(G3.nz - 1, Math.floor(fz))), u = fx - ix, v = fz - iy, W1 = G3.nx + 1;
          const ia = ix + W1 * iy, ib = ix + W1 * (iy + 1), ic = ix + 1 + W1 * (iy + 1), id = ix + 1 + W1 * iy, tri = (A) => (u + v <= 1 ? A[ia] + u * (A[id] - A[ia]) + v * (A[ib] - A[ia]) : A[ic] + (1 - u) * (A[ib] - A[ic]) + (1 - v) * (A[id] - A[ic]));
          return Math.max(tri(G3.a), tri(G3.b));
        };
        const footMin = (x, z, w, d, ry, nS) => { const c = Math.cos(ry || 0), n = Math.sin(ry || 0), N = nS || 5; let lo = Infinity, hi = -Infinity; for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) { const u = (a / (N - 1) - 0.5) * w, v = (b / (N - 1) - 0.5) * d, y = meshH(x + u * c + v * n, z - u * n + v * c); lo = Math.min(lo, y); hi = Math.max(hi, y); } return [lo, hi]; };
        const CHK = { houses: 0, fail: 0, worst: 0 };   // the check: no corner of a house over ground lower than its bottom by more than 0.05
        const check = (x, z, w, d, ry, base) => { const c = Math.cos(ry || 0), n = Math.sin(ry || 0); let bad = 0; for (const [u, v] of [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]]) { const gap = base - meshH(x + u * c + v * n, z - u * n + v * c); if (gap > 0.05) { bad = 1; CHK.worst = Math.max(CHK.worst, gap); } } CHK.houses++; CHK.fail += bad; };
        // the houses: in the city, clear of the Millo, the fortress, the stairs and David's house
        const FZ = ML.fort, clear = (x, z) => !(Math.abs(x - MILLO_C.x) < MILLO_C.w / 2 + 5 && Math.abs(z - MILLO_C.z) < MILLO_C.d / 2 + 5) && !(x > FZ.x0 - 6 && x < FZ.x1 + 6 && z > FZ.z0 - 6 && z < FZ.z1 + 6) && !(Math.abs(x - ML.davidAt[0]) < 14 && Math.abs(z - ML.davidAt[1]) < 12) && Math.hypot(x - POOL_AT[0], z - POOL_AT[1]) > 15 && !(Math.abs(x - GARDEN_C.x) < GARDEN_C.w / 2 + 4 && Math.abs(z - GARDEN_C.z) < GARDEN_C.d / 2 + 4) && Math.hypot(x - TOMBS_AT[0], z - TOMBS_AT[1]) > 10 && segDist(x, z, STAIR_C.a, STAIR_C.b) > 7;
        let q = 5303; const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
        // the houses on the terraces (the coordinator's note): rows along the heights - each terrace a lane on its lower side and a row of
        // houses of different sizes (one or two storeys, flat roofs of earth and plaster), here and there a small court, a gap for an alley
        // stone and plaster tones (limestone yellows and greys), roofs of earth and lime
        const WALLC = [0xe4d8bd, 0xccb07c, 0xb7b0a1, 0xd2b79c], ROOFC = [0x9c8664, 0xa89170, 0x8f7a5a, 0xb09a74, 0x947e5c, 0xbcab88];   // four stone tones: white, honey, grey, rose
        const hs = [], hsC = [], rf = [], rfC = [], courts = [], rw = [];
        const foot = (x, z, w, d, ry) => footMin(x, z, w, d, ry, 5);   // the drawn ground under the footprint (5 x 5 points, the corners among them)
        // no house into another: each footprint (an oriented rectangle) against those already placed near it (separating axes), 0.25 apart
        const OCC = new Map(), okey = (x, z) => Math.floor(x / 12) + "," + Math.floor(z / 12);
        const corners = (r) => { const c = Math.cos(r[4]), n = Math.sin(r[4]); return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [r[0] + a * r[2] * c + b * r[3] * n, r[1] - a * r[2] * n + b * r[3] * c]); };
        const sep = (A, B) => { const ca = corners(A), cb = corners(B); for (const r of [A, B]) { const c = Math.cos(r[4]), n = Math.sin(r[4]); for (const [ax2, az2] of [[c, -n], [n, c]]) { let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity; for (const [x, z] of ca) { const d = x * ax2 + z * az2; a0 = Math.min(a0, d); a1 = Math.max(a1, d); } for (const [x, z] of cb) { const d = x * ax2 + z * az2; b0 = Math.min(b0, d); b1 = Math.max(b1, d); } if (a1 < b0 || b1 < a0) return true; } } return false; };
        const free = (cx, cz, w, dd, ry) => { const R = [cx, cz, w / 2 + 0.25, dd / 2 + 0.25, ry]; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const L3 = OCC.get((Math.floor(cx / 12) + i) + "," + (Math.floor(cz / 12) + j)); if (L3) for (const q of L3) if (!sep(R, q)) return false; } return true; };
        const take = (cx, cz, w, dd, ry) => { const k2 = okey(cx, cz); if (!OCC.has(k2)) OCC.set(k2, []); OCC.get(k2).push([cx, cz, w / 2, dd / 2, ry]); };
        const house = (cx, cz, w, dd, ry) => {   // walls from under the lowest ground of the footprint (a foundation down the slope), one storey or two
          const [lo, hi] = foot(cx, cz, w, dd, ry), two = rr() < 0.3, top = hi + (two ? 5.8 : 3.1) + rr() * 0.4, ci = Math.floor(rr() * WALLC.length);
          hs.push([cx, lo - 0.6, cz, w, top - lo + 0.6, dd, ry]); hsC.push(WALLC[ci]); check(cx, cz, w, dd, ry, lo - 0.6);
          rf.push([cx, top, cz, w + 0.25, 0.28, dd + 0.25, ry]); rfC.push(ROOFC[(ci + Math.floor(rr() * 3)) % ROOFC.length]);
        };
        const CXM = (IR_C.W + IR_C.E) / 2, CZM = (IR_C.N + IR_C.tip[1]) / 2;
        // flights of steps between the terraces: up each rise, every 30-40 amot along it; their places taken before the houses, the retaining
        // wall open where they climb
        const tst = [], tGaps = [];
        for (let k = 0; k < GR.NT; k++) {
          const ring = inset(2 + (k + 0.7) * GR.RS + 0.2); tGaps.push([]);
          if (!ring) break;
          for (let i = 0; i < ring.length; i++) {
            const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % ring.length], Le = Math.hypot(bx - ax, bz - az), vx = (bx - ax) / Le, vz = (bz - az) / Le, ry = -Math.atan2(vz, vx);
            let nx3 = -vz, nz3 = vx; if (nx3 * (CXM - ax) + nz3 * (CZM - az) < 0) { nx3 = -nx3; nz3 = -nz3; }
            for (let sPos = 8 + rr() * 14; sPos < Le - 6; sPos += 30 + rr() * 12) {
              const x = ax + vx * sPos, z = az + vz * sPos;
              if (!inPoly(x, z) || !clear(x, z) || lowK(x, z) > 0.05) continue;
              const b0 = brow(x, z), sp = span(x, z), lo = b0 + sp * k / GR.NT, up = b0 + sp * (k + 1) / GR.NT, N4 = 4;
              for (let j = 0; j < N4; j++) { const o = -0.8 + (j + 0.5) * 1.05, sx = x + nx3 * o, sz = z + nz3 * o, top = lo + (up - lo) * (j + 1) / N4, [g0] = footMin(sx, sz, 2.4, 1.05, ry, 3); tst.push([sx, g0 - 0.3, sz, 2.4, top - (g0 - 0.3), 1.08, ry]); }
              for (const sd of [-1, 1]) { const cx3 = x + vx * sd * 1.45 + nx3 * 1.3, cz3 = z + vz * sd * 1.45 + nz3 * 1.3, [g0] = footMin(cx3, cz3, 0.5, 4.2, ry, 3); tst.push([cx3, g0 - 0.3, cz3, 0.5, up + 0.6 - (g0 - 0.3), 4.2, ry]); }   // its two low side walls
              take(x + nx3 * 1.3, z + nz3 * 1.3, 3.4, 4.6, ry); tGaps[k].push([i, sPos]);
            }
          }
        }
        for (let k = 0; k < 12 && hs.length < IR_C.houses; k++) {
          const dk = 2 + k * GR.RS, ring = inset(dk + 4.6);   // the row on the terrace's level part, the lane below it (toward the wall)
          if (!ring) break;
          for (let i = 0; i < ring.length && hs.length < IR_C.houses; i++) {
            const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % ring.length], Le = Math.hypot(bx - ax, bz - az), vx = (bx - ax) / Le, vz = (bz - az) / Le, ry0 = -Math.atan2(vz, vx);
            let nx2 = -vz, nz2 = vx; if (nx2 * (CXM - ax) + nz2 * (CZM - az) < 0) { nx2 = -nx2; nz2 = -nz2; }   // inward (uphill)
            let sPos = 2.5 + rr() * 2, run = 0;
            while (sPos < Le - 3 && hs.length < IR_C.houses) {
              const yard = rr() < 0.16, w = yard ? 7.5 + rr() * 1.5 : 3.8 + rr() * 4.4, dd = yard ? 5.2 : 3.8 + rr() * 1.3;
              if (sPos + w > Le - 2.5) break;
              const jit = (rr() - 0.5) * 1.2, cx = ax + vx * (sPos + w / 2) + nx2 * jit, cz = az + vz * (sPos + w / 2) + nz2 * jit, ry = ry0 + (rr() - 0.5) * 0.16;   // rows not quite straight
              sPos += w + 0.4 + rr() * 1.1; run++;
              if (run > 3 + rr() * 5) { sPos += 2.6 + rr() * 1.4; run = 0; }   // an alley across the rows (not lined up from row to row)
              if (!inPoly(cx, cz) || !clear(cx, cz) || lowK(cx, cz) > 0.2 || rr() < 0.07 || !free(cx, cz, w, dd, ry)) continue;
              take(cx, cz, w, dd, ry);
              if (yard) {   // a house with its yard: the house at the yard's back corner, a low wall round the rest, open to the lane
                const c = Math.cos(ry), n = Math.sin(ry), ux = c, uz = -n, sd = rr() < 0.5 ? -1 : 1, hw = 3.6 + rr() * 0.8, hd = 3.6;
                const hx2 = cx + ux * sd * (w / 2 - hw / 2) + nx2 * (dd / 2 - hd / 2), hz2 = cz + uz * sd * (w / 2 - hw / 2) + nz2 * (dd / 2 - hd / 2);
                house(hx2, hz2, hw, hd, ry);
                const [lo, hi] = foot(cx, cz, w, dd, ry), wh = hi - lo + 1.7;
                courts.push([cx + nx2 * (dd / 2 - 0.25), lo - 0.4, cz + nz2 * (dd / 2 - 0.25), w, wh, 0.45, ry]);   // the back wall (uphill)
                courts.push([cx - ux * sd * (w / 2 - 0.22), lo - 0.4, cz - uz * sd * (w / 2 - 0.22), 0.45, wh, dd, ry]);   // the far side
                continue;
              }
              house(cx, cz, w, dd, ry);
            }
          }
        }
        // the terraces' retaining walls: at the foot of each rise, from the lower terrace to a little over the upper (in pieces along the heights;
        // open where a flight of steps climbs)
        for (let k = 0; k < GR.NT; k++) {
          const ring = inset(2 + (k + 0.7) * GR.RS + 0.2);
          if (!ring) break;
          for (let i = 0; i < ring.length; i++) {
            const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % ring.length], Le = Math.hypot(bx - ax, bz - az), ry = -Math.atan2(bz - az, bx - ax);
            const gaps = (tGaps[k] || []).filter((q) => q[0] === i).map((q) => q[1]).sort((p1, p2) => p1 - p2), runs = []; let s0 = 0;
            for (const gq of gaps) { if (gq - 1.25 > s0) runs.push([s0, gq - 1.25]); s0 = gq + 1.25; } if (Le > s0) runs.push([s0, Le]);
            for (const [r0, r1] of runs) {
              const np = Math.max(1, Math.round((r1 - r0) / 12)), pl = (r1 - r0) / np;
              for (let j = 0; j < np; j++) {
                const u = (r0 + (j + 0.5) * pl) / Le, x = ax + (bx - ax) * u, z = az + (bz - az) * u;
                if (!inPoly(x, z) || !clear(x, z) || lowK(x, z) > 0.05) continue;
                const b0 = brow(x, z), sp = span(x, z), lo = b0 + sp * k / GR.NT, up = b0 + sp * (k + 1) / GR.NT;
                const [g0, g1] = footMin(x, z, pl + 0.05, 1.6, ry, 4); rw.push([x, Math.min(lo, g0) - 0.6, z, pl + 0.05, Math.max(up, g1) + 0.5 - (Math.min(lo, g0) - 0.6), 0.7, ry]);
              }
            }
          }
        }
        if (tst.length) instBoxes(CG, tst, M2.stoneLight || M2.stone, "irDavidSteps");
        ML.stepFlights = tst.length / 6;
        const pts = hs;
        instBoxesC(CG, hs, hsC, "irDavidHouses"); instBoxesC(CG, rf, rfC, "irDavidHousesRoof");
        if (courts.length) instBoxes(CG, courts, M2.stoneLight || M2.stone, "irDavidCourts");
        if (rw.length) instBoxes(CG, rw, M2.stone, "irDavidTerraces");
        ML.terraceCount = rw.length; ML.courtCount = courts.length / 2; ML.chk = CHK;
        ML.cityCount = pts.length;
        // the wall round the city (stone, 9 high on the outline); before Solomon a breach by the Millo (the user: "פרצה בחומה"; Rashi I Kings
        // 11:27 "שהיה הפרץ אחורי המלוא"); Hezekiah - another wall outside it by the Millo, and the pool between the two walls
        const WH = 9, WT = 2.6, wallM = M2.stone, segs = [], breach = { x: MILLO_C.x - MILLO_C.w / 2, z0: MILLO_C.z - 4, z1: MILLO_C.z + 4 };
        const wallG = new Group(), breachFill = new Group(), outer = new Group(), towers = new Group(); CG.add(wallG, breachFill, outer, towers);
        // a stretch of wall from its foot (the ground at the outline) to WH over the highest ground just inside it (the city stands behind it)
        const cxm = (IR_C.W + IR_C.E) / 2, czm = (IR_C.N + IR_C.tip[1]) / 2;
        const seg = (parent, ax, az, bx, bz, h, t, out, ybOver) => {
          const L = Math.hypot(bx - ax, bz - az); let nx = -(bz - az) / L, nz = (bx - ax) / L; if (nx * (cxm - (ax + bx) / 2) + nz * (czm - (az + bz) / 2) < 0) { nx = -nx; nz = -nz; }
          const g0 = Math.min(TH(ax, az), TH(bx, bz), TH((ax + bx) / 2, (az + bz) / 2));
          let hi = -Infinity;
          for (const u of [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]) { const x = ax + (bx - ax) * u, z = az + (bz - az) * u; hi = Math.max(hi, out ? groundAt(x, z) : ridgeH(x + nx * 1.6, z + nz * 1.6)); }   // on the brow: the plateau just inside
          const yb = ybOver != null ? ybOver : g0 - 1.5, top = hi + (out ? h : 6.5);
          const m = H2.box(parent, L + t * 0.6, top - yb, t, wallM, (ax + bx) / 2, yb, (az + bz) / 2); m.rotation.y = -Math.atan2(bz - az, bx - ax); return m;
        };
        for (let i = 0; i < POLY.length; i++) {
          const [ax, az] = POLY[i], [bx, bz] = POLY[(i + 1) % POLY.length];
          // the west wall's first stretch carries the breach: cut it into two, the breach's stone apart (shown after Solomon)
          if (i === POLY.length - 1) {   // from [W-12, N+L/4] back to [W, N]: the Millo's side
            const zA = Math.min(az, bz), zB = Math.max(az, bz), xAt = (z) => ax + (bx - ax) * (z - az) / (bz - az);
            seg(wallG, xAt(zA), zA, xAt(breach.z0), breach.z0, WH, WT); seg(wallG, xAt(breach.z1), breach.z1, xAt(zB), zB, WH, WT);
            seg(breachFill, xAt(breach.z0), breach.z0, xAt(breach.z1), breach.z1, WH, WT);
            ML.breachAt = [xAt((breach.z0 + breach.z1) / 2), (breach.z0 + breach.z1) / 2];
            segs.push([ax, az, bx, bz]); continue;
          }
          // the channel's opening (CHANNEL_189): where the channel crosses this stretch, the wall in two, and over the opening the wall from a
          // little above the channel's edge
          const CP = chProf();
          if (CP) {
            const ex = bx - ax, ez = bz - az, dx2 = CP.b[0] - CP.a[0], dz2 = CP.b[1] - CP.a[1], den = ex * dz2 - ez * dx2;
            if (Math.abs(den) > 1e-6) {
              const sE = ((CP.a[0] - ax) * dz2 - (CP.a[1] - az) * dx2) / den, tC = ((CP.a[0] - ax) * ez - (CP.a[1] - az) * ex) / den;
              if (sE > 0.05 && sE < 0.95 && tC > 0 && tC < 1) {
                const Le = Math.hypot(ex, ez), sinA = Math.abs(ex * dz2 - ez * dx2) / (Le * Math.hypot(dx2, dz2)), cosA = Math.sqrt(Math.max(0, 1 - sinA * sinA)), half = ((CHP.wIn + 2 * CHP.wall) / sinA + WT * cosA / Math.max(0.2, sinA)) / 2 + 0.3, g2 = (half + WT * 0.3) / Le, s0 = sE - g2, s1 = sE + g2, i2 = Math.round(tC * CP.n), topC = CP.W[i2] + CHP.free;
                seg(wallG, ax, az, ax + ex * s0, az + ez * s0, WH, WT); seg(wallG, ax + ex * s1, az + ez * s1, bx, bz, WH, WT);
                // (the opening: the channel's width across the wall's slant, and its thickness; over it the wall, from a little above the channel)
                const sb0 = sE - half / Le, sb1 = sE + half / Le; seg(wallG, ax + ex * sb0, az + ez * sb0, ax + ex * sb1, az + ez * sb1, WH, WT, false, topC + 0.8);
                ML.chOpening = [ax + ex * sE, az + ez * sE, topC + 0.8]; segs.push([ax, az, bx, bz]); continue;
              }
            }
          }
          seg(wallG, ax, az, bx, bz, WH, WT); segs.push([ax, az, bx, bz]);
        }
        // Hezekiah: "ולחוצה החומה אחרת ויחזק את־המלוא עיר דויד" (II Chr 32:5); "ומקוה עשיתם בין החמתים" (Isaiah 22:11) - by the Millo
        // (Metzudat David there, 3318:1617, "וחיזק פרצות המלוא שהיתה בעיר דוד"); the other wall 14 amot out, along the west side; the pool between
        {
          const off = 14, [ax, az] = POLY[POLY.length - 1], [bx, bz] = POLY[0], [cx2, cz2] = POLY[POLY.length - 2];
          seg(outer, ax - off, az, bx - off, bz - 8, WH - 1, WT, true); seg(outer, cx2 - off, cz2, ax - off, az, WH - 1, WT, true);
          seg(outer, bx - off, bz - 8, bx + 30, bz - 8, WH - 1, WT, true);
          const pz = MILLO_C.z + 14, px = ax + (bx - ax) * (pz - az) / (bz - az) - off / 2;   // midway between the two walls
          const pool = new Mesh(new BoxGeometry(9, 0.3, 22), tm_water(new MeshStandardMaterial({ color: 0x2f6a9a, roughness: 0.15, metalness: 0.1 }), { scale: 1.4 }));   // WATER_420 (a little deeper: the sky is drawn in it now) const pgy = Math.max(groundAt(px - 5, pz), groundAt(px + 5, pz), groundAt(px, pz)); pool.position.set(px, pgy + 0.25, pz); pool.userData.noPick = true; outer.add(pool);
          for (const [dx, dz, lx, lz] of [[-5, 0, 0.8, 23.6], [5, 0, 0.8, 23.6], [0, -11.4, 10.6, 0.8], [0, 11.4, 10.6, 0.8]]) H2.box(outer, lx, 4.2, lz, M2.stoneLight || M2.stone, px + dx, pgy - 3.6, pz + dz);
          ML.poolAt = [px, pz];
        }
        // towers on the wall (in Rashi's reading - the whole city a fortress, Rashi II Sam 5:6 "מצודת ציון נקראה יבוס")
        const tl = []; for (const [ax, az, bx, bz] of segs) for (const u of [0, 0.5]) { const x = ax + (bx - ax) * u, z = az + (bz - az) * u; const L2 = Math.hypot(cxm - x, czm - z) || 1, hiT = Math.max(ridgeH(x + (cxm - x) / L2 * 1.6, z + (czm - z) / L2 * 1.6), ridgeH(x + (cxm - x) / L2 * 4, z + (czm - z) / L2 * 4)); tl.push([x, TH(x, z) - 2, z, 6.5, hiT + 6.5 + 4 - (TH(x, z) - 2), 6.5, -Math.atan2(bz - az, bx - ax)]); }
        instBoxes(towers, tl, wallM, "irDavidTowers");
        // the fortress of Zion (the default reading - Metzudat David II Sam 5:7, 3329:252 "שם מבצר חזק, סמוך למקום יבוס"; Abarbanel 3577:125;
        // the Malbim 3390:198): a walled fort in the city's upper part, its gate to the south; its tower - "מגדל דוד, הוא מצודת ציון" (Rashi Song
        // 4:4, 3659:208), high, seen from afar (Metzudat David 3316:122), shields hung on its walls ("לתלות המגינים על כתלי המגדל", 3316:123)
        const fortG = new Group(); CG.add(fortG);
        { const F = ML.fort, FH = 15, FT2 = 3, fy = padOf("fort").y - 3, w = F.x1 - F.x0, d = F.z1 - F.z0, gw = 6;
          H2.box(fortG, w, FH, FT2, wallM, (F.x0 + F.x1) / 2, fy, F.z0 + FT2 / 2);
          H2.box(fortG, FT2, FH, d, wallM, F.x0 + FT2 / 2, fy, (F.z0 + F.z1) / 2); H2.box(fortG, FT2, FH, d, wallM, F.x1 - FT2 / 2, fy, (F.z0 + F.z1) / 2);
          for (const sd of [-1, 1]) H2.box(fortG, (w - gw) / 2, FH, FT2, wallM, (F.x0 + F.x1) / 2 + sd * (gw / 2 + (w - gw) / 4), fy, F.z1 - FT2 / 2);
          for (const [cx3, cz3] of [[F.x0, F.z0], [F.x1, F.z0], [F.x0, F.z1], [F.x1, F.z1]]) H2.box(fortG, 7, FH + 5, 7, wallM, cx3, fy, cz3); }
        const towerG = new Group(); CG.add(towerG);
        { const [tx, tz] = ML.towerAt, ty = ridgeH(tx, tz) - 1, TS = 11, TH = 36;
          H2.box(towerG, TS, TH, TS, M2.stoneLight || M2.stone, tx, ty, tz);
          for (const [dx, dz] of [[-4, -4], [-4, 0], [-4, 4], [0, -4], [0, 4], [4, -4], [4, 0], [4, 4]]) H2.box(towerG, 1.6, 1.6, 1.6, M2.stoneLight || M2.stone, tx + dx, ty + TH, tz + dz);
          const sh = new InstancedMesh(new CylinderGeometry(0.75, 0.75, 0.14, 14).rotateX(Math.PI / 2), M2.bronze, 4 * 3 * 5), m4 = new Matrix4(), qq = new Quaternion(), e = new Euler(), v = new Vector3(), one = new Vector3(1, 1, 1);
          let n = 0; for (let f = 0; f < 4; f++) for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const a = f * Math.PI / 2, u = (c - 2) * 2.0, y = ty + TH - 6 - r * 3.4; v.set(tx + Math.sin(a) * (TS / 2 + 0.1) + Math.cos(a) * u, y, tz + Math.cos(a) * (TS / 2 + 0.1) - Math.sin(a) * u); qq.setFromEuler(e.set(0, a, 0)); m4.compose(v, qq, one); sh.setMatrixAt(n++, m4); }
          sh.castShadow = true; sh.userData.noPick = true; towerG.add(sh); }
        // the stairs down from the city to the pool of the Shiloach (Nehemiah 3:15 "ועד־המעלות היורדות מעיר דויד", after "חומת ברכת השלח
        // לגן־המלך"; the Ralbag there, 3635:56 "הנה מציון שהיא עיר דוד היו יורדות מעלות עד חומת ירושלים") - between two low parapets
        const stairG = new Group(); CG.add(stairG);
        { const [ax, az] = STAIR_C.a, [bx, bz] = STAIR_C.b, L = Math.hypot(bx - ax, bz - az), n = Math.round(L / 1.2), ry = -Math.atan2(bz - az, bx - ax) + Math.PI / 2, px = -(bz - az) / L, pz = (bx - ax) / L, sl = [];
          for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, x = ax + (bx - ax) * u, z = az + (bz - az) * u, y = meshH(x, z), [g0] = footMin(x, z, 7.6, L / n, ry, 3); sl.push([x, g0 - 0.4, z, 6, y + 0.5 - (g0 - 0.4), L / n + 0.05, ry]); for (const sd of [-1, 1]) { const [p0] = footMin(x + px * sd * 3.4, z + pz * sd * 3.4, 0.8, L / n, ry, 3); sl.push([x + px * sd * 3.4, p0 - 0.4, z + pz * sd * 3.4, 0.8, y + 1.4 - (p0 - 0.4), L / n + 0.05, ry]); } }
          instBoxes(stairG, sl, M2.stoneLight || M2.stone, "irDavidStairs"); }
        // the king's garden by the pool (decision 161): walled, a court of the king's own within the city - a few trees and bushes, no orchard
        // ("ברכת השלח לגן־המלך", Nehemiah 3:15; the Malbim 3370:85 "והגן והברכה היו תוך חומת העיר")
        const gardenG = new Group(); CG.add(gardenG);
        { const G2 = GARDEN_C, gy2 = (x, z) => meshH(x, z), wt = 0.7, wh = 1.9, cx4 = G2.x, cz4 = G2.z, hx4 = G2.w / 2, hz4 = G2.d / 2;
          for (const [sx, sz, lx, lz] of [[0, -1, G2.w, wt], [0, 1, G2.w, wt], [-1, 0, wt, G2.d - 4], [1, 0, wt, G2.d]]) H2.box(gardenG, lx, wh + 2, lz, M2.stoneLight || M2.stone, cx4 + sx * (hx4 - wt / 2), gy2(cx4 + sx * hx4, cz4 + sz * hz4) - 2, cz4 + sz * (hz4 - wt / 2) + (sx === -1 ? 2 : 0));
          const trunkM = new MeshStandardMaterial({ color: 0x6b4a2a, roughness: 0.9 }), leafM2 = [0x4f7f3a, 0x3f6f30, 0x5a8a40].map((c) => new MeshStandardMaterial({ color: c, roughness: 0.85 }));
          let q2 = 1610; const r2 = () => (q2 = (q2 * 1664525 + 1013904223) >>> 0) / 4294967296;
          for (let i = 0; i < 7; i++) { const x = cx4 + (r2() - 0.5) * (G2.w - 5), z = cz4 + (r2() - 0.5) * (G2.d - 4.5), y = gy2(x, z); const tr = new Mesh(new CylinderGeometry(0.2, 0.28, 3, 6).translate(0, 1.5, 0), trunkM); tr.position.set(x, y, z); gardenG.add(tr); const cn = new Mesh(new SphereGeometry(1.6, 10, 8), leafM2[i % 3]); cn.position.set(x, y + 3.8, z); cn.scale.set(1, 0.85, 1); cn.castShadow = true; gardenG.add(cn); }
          for (let i = 0; i < 12; i++) { const x = cx4 + (r2() - 0.5) * (G2.w - 3), z = cz4 + (r2() - 0.5) * (G2.d - 3), y = gy2(x, z); const b2 = new Mesh(new SphereGeometry(0.8, 8, 6), leafM2[(i + 1) % 3]); b2.position.set(x, y + 0.5, z); b2.scale.set(1.2, 0.7, 1.1); gardenG.add(b2); } }
        // David's tombs (decisions 162, 167 b; the coordinator's notes): an opening hewn in the rock - a mass of natural rock against the wall's
        // outer side (an uneven face, the rock's colour, no built wall and no roof), a dark rectangular opening cut in its face, the rolling
        // stone beside it ("עד־נגד קברי דויד ועד־הברכה", Nehemiah 3:16; the Radbaz) - no tunnel. The group's frame: origin on the wall's line, +x out.
        const tombG = new Group(); CG.add(tombG);
        { const [ex5, ez5] = TOMBS.e, [nx5, nz5] = TOMBS.n, FX = TOMB_FX, ty5 = TH(ex5 + nx5 * FX, ez5 + nz5 * FX), slopeAt = (d) => groundAt(ex5 + nx5 * d, ez5 + nz5 * d);
          const rockM3 = new MeshStandardMaterial({ color: 0x9a8562, roughness: 0.97, flatShading: true }), darkM = new MeshStandardMaterial({ color: 0x120d0a, roughness: 1 });
          tombG.position.set(ex5, ty5, ez5); tombG.rotation.y = Math.atan2(-nz5, nx5);
          const back = 1.4, dep = FX - back, H5 = Math.max(4.4, slopeAt(back + 0.2) - ty5 + 0.6), W5 = 12, dw = 1.4, dh = 2.0;
          const nz3 = (x, y, z) => 0.5 * Math.sin(x * 1.7 + y * 2.3 + z * 1.1) + 0.5 * Math.sin(x * 0.9 - z * 2.1 + y * 0.7 + 1.3);
          const geo5 = new BoxGeometry(dep, H5 + 1, W5, 5, 7, 12).translate(back + dep / 2, (H5 + 1) / 2 - 1, 0), p5 = geo5.attributes.position;
          for (let i = 0; i < p5.count; i++) {
            const x = p5.getX(i), y = p5.getY(i), z = p5.getZ(i), u = (x - back) / dep, door = Math.abs(z) < dw / 2 + 0.55 && y < dh + 0.55 && u > 0.98;
            let X = x, Y = y, Z = z;
            if (y > -0.9) { X += door ? 0 : 0.5 * nz3(x, y, z) * Math.min(1, u * 1.5); Z += 0.45 * nz3(z, x, y) - z * 0.16 * u; }   // uneven, narrowing outward
            if (y > H5 - 1.2) { Y += 0.5 * nz3(y, z, x) - 1.1 * u * u; }   // the top uneven, falling to the face's brow
            if (door && Math.abs(z) < dw / 2 + 0.05 && y < dh) X = FX - 0.02;
            p5.setXYZ(i, X, Y, Z);
          }
          geo5.computeVertexNormals();
          const rock = new Mesh(geo5, rockM3); rock.castShadow = rock.receiveShadow = true; tombG.add(rock);
          const door = new Mesh(new BoxGeometry(1.0, dh, dw).translate(-0.5 + 0.04, dh / 2, 0), darkM); door.position.set(FX, 0, 0); tombG.add(door);   // the opening, cut into the face
          const golel = new Mesh(new CylinderGeometry(1.0, 1.0, 0.5, 14).rotateZ(Math.PI / 2), new MeshStandardMaterial({ color: 0xa8936e, roughness: 0.95, flatShading: true })); golel.position.set(FX + 0.65, 1.0, dw / 2 + 1.6); golel.rotation.x = 0.05; golel.castShadow = true; tombG.add(golel);   // the rolling stone, rolled aside
          for (const [bx2, bz2, r2] of [[FX + 0.8, -W5 / 2 + 0.6, 1.3], [FX + 1.4, W5 / 2 - 0.4, 0.9], [FX - 0.4, -W5 / 2 - 0.4, 1.6]]) { const bd = new Mesh(new IcosahedronGeometry(r2, 0), rockM3); bd.position.set(bx2, r2 * 0.45, bz2); bd.rotation.set(bx2, bz2, r2); bd.castShadow = true; tombG.add(bd); }
          tombG.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
          ML.tombDoor = [ex5 + nx5 * FX, ty5 + 1, ez5 + nz5 * FX]; }
        // David's house (Nehemiah 12:37 "מעל לבית דויד"), and the tent he pitched for the ark until it went up to the Temple ("להעלות את־ארון
        // ברית־יהוה מעיר דוד", I Kings 8:1) - the tent only before Solomon's house of God
        const davidG = new Group(), arkTent = new Group(); CG.add(davidG, arkTent);
        { const [dx2, dz2] = ML.davidAt, [dg0, dg1] = footMin(dx2, dz2, 22, 14, 0, 6), dy = dg0 - 0.5; H2.box(davidG, 22, dg1 + 9 - dy, 14, M2.stoneLight || M2.stone, dx2, dy, dz2); H2.box(davidG, 23, 0.6, 15, roofM, dx2, dg1 + 9, dz2); check(dx2, dz2, 22, 14, 0, dy);
          const tx2 = dx2 + 24, tz2 = dz2 + 2, ty2 = footMin(tx2, tz2, 11, 8, 0, 4)[0] - 0.2; const tm2 = new Mesh(new ConeGeometry(4.2, 5.5, 4, 1, true).rotateY(Math.PI / 4).translate(0, 2.75, 0), tentMs[0]); tm2.position.set(tx2, ty2, tz2); tm2.scale.set(1.4, 1, 1); tm2.castShadow = true; arkTent.add(tm2); ML.arkAt = [tx2, ty2, tz2]; }
        CG.traverse((o) => { if (o.isMesh) o.userData.noPick = true; });
        // WALK_CITY_N7 (fix-n7, 24.11.2026): what one stands on in walk mode - the city's ground, the slopes outside the wall, the steps, the
        // courts and the stairs down to the pool of the Shiloach (shared/90-entry.js ent_solids: userData.walkFloor). The houses, walls and towers are not.
        CG.traverse((o) => { if (o.isMesh && /^irDavid(Ground|Slopes|Steps|Courts|Stairs)$/.test(o.name)) o.userData.walkFloor = true; });
        ML.cityParts = { wallG, breachFill, outer, towers, fortG, towerG, stairG, davidG, arkTent };
        try { buildChannel(); } catch (e) { console.warn("[parallels] channel", e && e.message); }
        applyMillo();
      };
      const ensure = () => { if (!IR.visible) return; if (!ML.parts && !ML.failed) { try { buildMillo(); applyMillo(); } catch (e) { console.warn("[parallels] millo", e && e.message); ML.err = String(e && e.stack || e).slice(0, 300); ML.parts = null; ML.failed = true; } } if (!ML.city) { try { const t0 = performance.now(); buildCity(); ML.buildMs = Math.round(performance.now() - t0); } catch (e) { console.warn("[parallels] ir david", e && e.message); ML.errC = String(e && e.stack || e).slice(0, 300); } } };
      ctx.animated.push(() => { if (IR.visible && ((!ML.parts && !ML.failed) || !ML.city) && fnc(ctx.shared.floorY)) ensure(); });
      const setLayer = (on) => {
        IR.visible = !!on;
        if (on) {
          // the spring and the Shiloach pool are at the city's south-west corner (117): built with the city, not only when the eye comes near -
          // first, so that the channel's opening in the wall is known when the wall is built
          try { const D1 = ctx.shared.shiloachDemo1; if (D1 && fnc(D1.spring)) D1.spring(); } catch (e) { console.warn("[parallels] ir david spring", e && e.message); }
          ensure();
        }
        // WALK_CITY_N7 (fix-n7, 24.11.2026; the user: from the City of David one could not walk on to the Shiloach, and back): the view's limits
        // (90-entry.js ent_view: a band 230 amot round the axis of the site, and the target no lower than -15) end at z ~740 and at -15 - the
        // city reaches z 1010 and the spring lies in the valley under it - so a walk was pushed back at every step. With the layer on, the
        // limits take in the city's outline and the spring (each point's own height: the spring's low); off - they are given back.
        try {
          const VL = ctx.shared.viewLimits;
          if (VL) {
            if (on) {
              if (!ML.vlSaved) ML.vlSaved = VL.get();
              const low = typeof ctx.shared.camLow === "number" ? ctx.shared.camLow : -45, SP = ctx.shared.shiloachSpring1;
              for (const [px, pz] of POLY) VL.include([px, low, pz]);
              VL.include([IR_C.tip[0], -12, IR_C.tip[1]]);
              if (SP && SP.spout) VL.include([SP.spout[0], low, SP.spout[2]]);
              if (SP && SP.approach) VL.include([SP.approach[0], low, SP.approach[1]]);
            } else if (ML.vlSaved) { VL.set(ML.vlSaved); ML.vlSaved = null; }
          }
        } catch (e) { console.warn("[parallels] ir david view limits", e && e.message); }
        return IR.visible;
      };
      ctx.shared.irDavid = { get on() { return IR.visible; }, set: setLayer, millo: MILLO_C, ground: (x, z) => ridgeH(x, z), buildChannel: () => buildChannel(), channel: () => ML.channel || null, drawnH: (x, z) => drawnH(x, z), poly: () => IR_C.poly, stats: () => ({ houses: ML.cityCount || 0, terraces: ML.terraceCount || 0, courts: ML.courtCount || 0, flights: ML.stepFlights || 0, check: ML.chk || null, milloCheck: ML.milloChk || null, millo: !!ML.parts, err: ML.err, errC: ML.errC, buildMs: ML.buildMs }) };
      ctx.shared.millo = {
        get form() { return ML.form; }, get time() { return ML.time; },
        setForm(f) { ML.form = f === "tel" ? "tel" : "plaza"; applyMillo(); return ML.form; },
        setTime(t) { ML.time = t === "before" || t === "hezekiah" ? t : "after"; applyMillo(); return ML.time; },
        get fortress() { return ML.fortress; }, setFortress(f) { ML.fortress = f === "rashi" ? "rashi" : "sep"; applyMillo(); return ML.fortress; },
        at: () => [MILLO_C.x, gyAt(MILLO_C.x, MILLO_C.z), MILLO_C.z]
      };
      applyMillo();
      (ctx.shared.features = ctx.shared.features || {}).irDavid = { key: "irDavid", timed: false, isOn: () => IR.visible, on: () => setLayer(true), off: () => setLayer(false) };
      ctx.labels.push({ text: "המלוא — רחבה פנויה לאסיפת העם (רד״ק; ספר השרשים)", x: MILLO_C.x, y: -2, z: MILLO_C.z, size: 2.2, far: 240, layers: ["irDavid", "milloPlaza"] });
      ctx.labels.push({ text: "המלוא — ״הקף חומה נמוכה, וממלאין אותה עפר, וגבה התל באמצע״ (רש״י שמואל ב ה, ט)", x: MILLO_C.x, y: 0, z: MILLO_C.z, size: 2.2, far: 240, layers: ["irDavid", "milloTel"] });
      ctx.labels.push({ text: "אהלי עולי הרגלים — ״לפרש בו עולי רגלים אהלים״ (רש״י מלכים א ט, כד)", x: MILLO_C.x, y: -7, z: MILLO_C.z + 8, size: 1.4, far: 240, layers: ["irDavid", "milloBefore", "milloPlaza"] });
      ctx.labels.push({ text: "בתים לעבדיה ולשפחותיה (רש״י מלכים א ט, כד)", x: MILLO_C.x + 6, y: -7, z: MILLO_C.z - 8, size: 1.4, far: 240, layers: ["irDavid", "milloAfter"] });
      ctx.labels.push({ text: "מגדל לבת פרעה (רש״י סנהדרין קא:)", x: MILLO_C.x - MILLO_C.w / 2 + 3.5, y: 4, z: MILLO_C.z, size: 1.4, far: 240, layers: ["irDavid", "milloTel", "milloAfter"] });
      ctx.labels.push({ text: "עיר דוד", x: 112, y: 0, z: 905, size: 6, far: 1400, layers: ["irDavid", "irName"] });   // in the city's southern half - apart from the palace's and the fortress's labels
      ctx.labels.push({ text: "מצודת ציון", x: 126, y: 2, z: 745, size: 3, far: 420, layers: ["irDavid", "irFortSep"] });
      ctx.labels.push({ text: "מצודת ציון — העיר כולה מצודה (רש״י שמואל ב ה, ו)", x: 105, y: 4, z: 780, size: 2.4, far: 240, layers: ["irDavid", "irFortRashi"] });
      ctx.labels.push({ text: "מגדל דוד — ״הוא מצודת ציון״ (רש״י שיר השירים ד, ד); מגינים על כתליו", x: ML.towerAt[0], y: 27, z: ML.towerAt[1], size: 1.8, far: 240, layers: ["irDavid"] });
      ctx.labels.push({ text: "״המעלות היורדות מעיר דויד״ (נחמיה ג, טו)", x: (STAIR_C.a[0] + STAIR_C.b[0]) / 2 + 6, y: -12, z: (STAIR_C.a[1] + STAIR_C.b[1]) / 2, size: 1.8, far: 240, layers: ["irDavid"] });
      ctx.labels.push({ text: "גן המלך (נחמיה ג, טו)", x: GARDEN_C.x, y: -14, z: GARDEN_C.z, size: 1.8, far: 240, layers: ["irDavid"] });
      ctx.labels.push({ text: "קברי בית דוד — מחוץ לחומה (רדב״ז)", x: TOMBS_AT[0], y: -20.5, z: TOMBS_AT[1], size: 1.8, far: 240, layers: ["irDavid"] });   // low, over the rock - apart from the garden's label
      ctx.labels.push({ text: "ברכת השלח — בתוך החומה (מלבי״ם)", x: POOL_AT[0], y: -12, z: POOL_AT[1], size: 1.8, far: 240, layers: ["irDavid"] });
      ctx.labels.push({ text: "המשנה — לשיטת ״יש שפותרים״ ברש״י (מלכים ב כב, יד): ״בין שתי החומות, שהיא משנה לעיר״", x: -17, y: -14, z: 800, size: 1.6, far: 240, layers: ["irDavid", "irHezekiah"] });
      ctx.labels.push({ text: "בית דוד", x: ML.davidAt[0], y: -2, z: ML.davidAt[1], size: 2, far: 240, layers: ["irDavid"] });
      ctx.labels.push({ text: "אהל הארון — עד שהועלה למקדש (מלכים א ח, א)", x: ML.davidAt[0] + 24, y: -9, z: ML.davidAt[1] + 2, size: 1.6, far: 240, layers: ["irDavid", "milloBefore"] });
      ctx.labels.push({ text: "הפרצה — ״פרץ עיר דוד״ (מלכים א יא, כז)", x: MILLO_C.x - MILLO_C.w / 2 - 2, y: -14, z: MILLO_C.z, size: 1.6, far: 240, layers: ["irDavid", "milloBefore"] });
      ctx.labels.push({ text: "״ולחוצה החומה אחרת״ והמקוה בין החומות (דברי הימים ב לב, ה; ישעיהו כב, יא)", x: MILLO_C.x - MILLO_C.w / 2 - 12, y: -18, z: MILLO_C.z + 14, size: 1.6, far: 240, layers: ["irDavid", "irHezekiah"] });
      // LABELS (the coordinator's note: labels piled one on another): while the eye looks at the City of David (the layer on, the target in
      // the city), the labels of what is outside the city are hidden (a flag in every such label's layers); the city's own name only from afar
      { const FARF = new Group(), NAMEF = new Group(); FARF.name = "irFar"; NAMEF.name = "irName"; ctx.layers.irFar = FARF; ctx.layers.irName = NAMEF;
        let tagged = false;
        ctx.animated.push(() => {
          if (!tagged) {
            let lg = null; try { lg = ctx.root.getObjectByName("labels"); } catch (_) {}
            if (lg && lg.children.length) {
              for (const spr of lg.children) { const l = spr.userData.label, L = spr.userData.layers; if (!l || (L && L.indexOf("irDavid") >= 0)) continue; const x = l.x || 0, z = l.z || 0; if (x > -70 && x < 290 && z > 675 && z < 1070) continue; spr.userData.layers = (L || []).concat(["irFar"]); }
              tagged = true;
            }
          }
          const t = ctx.controls && ctx.controls.target, cp = ctx.camera && ctx.camera.position;
          FARF.visible = !(IR.visible && t && t.z > 690 && t.z < 1060 && t.x > -70 && t.x < 290);
          NAMEF.visible = !cp || Math.hypot(cp.x - 105, cp.y + 15, cp.z - 850) > 260;
        }); }
      ctx.shared.modelButtons = ctx.shared.modelButtons || [];
      ctx.shared.modelButtons.push({ id: "par-irDavid", label: "הצג את עיר דוד והמלוא", labelOn: "הסתר את עיר דוד", title: "עיר דוד — שכבה פשוטה, כבויה כברירת מחדל: הבתים, המלוא (ומקום החומה והמצודה — לפי המקורות)",
        anchor: [105, 0, 700], maxDist: 320, get: () => IR.visible, set: (on) => { setLayer(on); } });
    }
    ctx.shared.parallels = { watchers };
  }
