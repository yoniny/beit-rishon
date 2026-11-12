  // ===== PEOPLE_KIT_204 BEGIN - THE SANHEDRIN'S FIGURES (one text, the same in both houses' 30-courts.js; tools204/people_204.py).
  // The user, 12.11.2026 01:41: "תעשה סנהדרין בשתי הבתים, הגוף אותו גוף רק יושב, [כעין] שמלה שחורה כזאת וכיפה, זקן לבן לכולם, חוץ
  // מהשורה היותר חיצונית ... בעצם הזקנים הכי בפנים לבן, האמצעי אפור והעליון שחור חום"; 01:42: "אלו שמולם בלי זקן בכלל. אבל צורה
  // חרדית כזאת, אבל לא חרדית קלאסית. רק בנראות של הפרצוף." He was told (01:46): in the model the seventy-one sit in ONE row and
  // the three inner rows are the students (Sanhedrin 4:4), so the beards' colours go ALONG the judges' row by the nearness to the
  // Nasi - "ושאר השבעים יושבין לפניו כפי שניהם וכפי מעלתם" (the Rambam, Sanhedrin 1:3; qa/fs/LIB_1111.md) - white by him, grey
  // further, black-brown at the row's two ends; the students - no beard, a kippah and peyot; the two scribes stand, grey-bearded.
  // THE BODY is the lottery's priest's (the Second House's 55-payis.js, PAYIS_FIGURE4: the head, the face, the beard - one body -
  // and the robe's breadth at each height), sitting, in a black robe and a kippah, with far fewer faces: the figures are small
  // (seventy-one in one row in the hall) and many, so every part is one InstancedMesh, and from afar a plain figure stands in.
  // tm_people(ctx).crowd(parent, pts, o): pts [[x, z, yaw] ...] in the parent's frame (yaw 0: the face to +z); o = { y, s (the
  // scale: figure units to amot), pose "bench" | "ground" | "stand", seat (the bench's height, amot), kind "judge" | "student" |
  // "scribe", tone (i) => 0 white | 1 grey | 2 black-brown, big (the index of the one a little larger), fwd (amot forward, to the
  // bench's front edge), name, shadow }.
  // MODEL CHOICES: the figures' size, their faces, the robe, the scribes' tablets, the beards' colours and lengths.
  function tm_people(ctx) {
    if (ctx.__tmPeople) return ctx.__tmPeople;
    const TAU = Math.PI * 2;
    const rnd = (() => { let q = 20261113; return () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; }; })();   // a fixed sequence
    const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const spl = (tab, x) => {
      let i = 0;
      while (i < tab.length - 2 && x > tab[i + 1][0]) i++;
      const p0 = tab[Math.max(0, i - 1)], p1 = tab[i], p2 = tab[i + 1], p3 = tab[Math.min(tab.length - 1, i + 2)];
      const d = p2[0] - p1[0], t = Math.max(0, Math.min(1, (x - p1[0]) / d));
      const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * d, m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * d, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
    };
    // a surface P(u, v) - u goes round (`open`: a strip, not closed), v goes along - with uv, a shade per vertex (o.c) and smooth normals
    const surf = (nu, nv, fn, open) => {
      const pos = [], uv = [], col = [], idx = [], o = { x: 0, y: 0, z: 0, c: 1 };
      for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
        o.c = 1;
        fn(i === nu && !open ? 0 : i / nu, j / nv, o);
        pos.push(o.x, o.y, o.z);
        uv.push(i / nu, j / nv);
        col.push(o.c, o.c, o.c);
      }
      for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
        const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
      const q = new BufferGeometry();
      q.setAttribute("position", new Float32BufferAttribute(pos, 3));
      q.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      q.setAttribute("color", new Float32BufferAttribute(col, 3));
      q.setIndex(idx);
      q.computeVertexNormals();
      if (!open) {
        const n = q.attributes.normal;
        for (let j = 0; j <= nv; j++) {
          const a = j * (nu + 1), b = a + nu, x = n.getX(a) + n.getX(b), y = n.getY(a) + n.getY(b), z = n.getZ(a) + n.getZ(b), l = Math.hypot(x, y, z) || 1;
          n.setXYZ(a, x / l, y / l, z / l);
          n.setXYZ(b, x / l, y / l, z / l);
        }
      }
      return q;
    };
    const shade = (q, c) => { q.setAttribute("color", new Float32BufferAttribute(new Float32Array(q.attributes.position.count * 3).fill(c), 3)); return q; };
    const tint = (q, c) => {
      const n = q.attributes.position.count, a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
      q.setAttribute("color", new Float32BufferAttribute(a, 3));
      return q;
    };
    const sph = (sx, sy, sz, ws, hs, ps, pl, ts, tl) => {
      const q = new SphereGeometry(1, ws, hs, ps === undefined ? 0 : ps, pl === undefined ? TAU : pl, ts === undefined ? 0 : ts, tl === undefined ? Math.PI : tl);
      q.scale(sx, sy, sz);
      return q;
    };
    const at = (q, x, y, z) => { q.translate(x, y, z); return q; };
    const rot = (q, rx, ry, rz) => { if (rz) q.rotateZ(rz); if (rx) q.rotateX(rx); if (ry) q.rotateY(ry); return q; };
    const flatUV = (q, u, v) => { const a = q.attributes.uv; for (let i = 0; i < a.count; i++) a.setXY(i, u, v); return q; };
    // a tube from p0 (radius r0) to p1 (radius r1), its ends open
    const limb = (p0, p1, r0, r1, n) => {
      const d = new Vector3(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]), len = d.length();
      const q = new CylinderGeometry(r1, r0, len, n, 1, true);
      q.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), d.normalize()));
      q.translate((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2);
      return q;
    };
    // ---------- the face's skin (the face's front is at a quarter of the width): the eyes with their lids, the shade about them
    // and by the nose, colour in the cheeks, the mouth; a patch of parchment (the scribes' tablets)
    const texFace = (() => {
      const cv = document.createElement("canvas");
      cv.width = 512;
      cv.height = 256;
      const c = cv.getContext("2d");
      c.fillStyle = "#cfa07a";
      c.fillRect(0, 0, 512, 256);
      const cx = 128, ey = 121;
      const blob = (x, y, rx, ry, col) => {
        const gr = c.createRadialGradient(0, 0, 0, 0, 0, 1);
        gr.addColorStop(0, col);
        gr.addColorStop(1, col.replace(/[\d.]+\)$/, "0)"));
        c.save(); c.translate(x, y); c.scale(rx, ry); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.restore();
      };
      blob(cx, 102, 56, 20, "rgba(232,190,150,0.45)");
      for (const sd of [-1, 1]) {
        const ex = cx + sd * 30.4;
        blob(ex, ey, 23, 13, "rgba(110,62,38,0.2)");
        blob(cx + sd * 40, 152, 26, 20, "rgba(200,100,82,0.26)");
        c.strokeStyle = "rgba(110,62,38,0.22)";
        c.lineWidth = 5;
        c.beginPath(); c.moveTo(cx + sd * 10, ey + 2); c.lineTo(cx + sd * 12, 152); c.stroke();
        c.fillStyle = "#e6ddcf";
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, 0, TAU); c.fill();
        c.save();
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, 0, TAU); c.clip();
        c.fillStyle = "#33210f"; c.beginPath(); c.arc(ex, ey, 4.7, 0, TAU); c.fill();
        c.fillStyle = "#5b4027"; c.beginPath(); c.arc(ex, ey, 3.7, 0, TAU); c.fill();
        c.fillStyle = "#0c0806"; c.beginPath(); c.arc(ex, ey, 2.2, 0, TAU); c.fill();
        c.fillStyle = "#ffffff"; c.beginPath(); c.arc(ex - 1.6, ey - 1.7, 1.1, 0, TAU); c.fill();
        c.restore();
        c.strokeStyle = "rgba(52,30,20,0.95)";
        c.lineWidth = 1.8;
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, Math.PI, TAU); c.stroke();
        c.strokeStyle = "rgba(120,78,58,0.6)";
        c.lineWidth = 1;
        c.beginPath(); c.ellipse(ex, ey + 0.5, 8.4, 3.8, 0, 0, Math.PI); c.stroke();
        c.strokeStyle = "rgba(110,70,48,0.35)";
        c.lineWidth = 1.2;
        c.beginPath(); c.ellipse(ex, ey - 2, 9.6, 5, 0, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
      }
      c.fillStyle = "rgba(156,83,71,0.9)";
      c.beginPath(); c.ellipse(cx, 175, 13, 3.1, 0, 0, TAU); c.fill();
      c.strokeStyle = "rgba(84,40,34,0.85)";
      c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(cx - 13, 174.6); c.quadraticCurveTo(cx, 176.6, cx + 13, 174.6); c.stroke();
      c.fillStyle = "#eadfc4";
      c.fillRect(436, 8, 68, 56);
      const t = new CanvasTexture(cv);
      t.colorSpace = SRGBColorSpace;
      return t;
    })();
    const mCloth = new MeshStandardMaterial({ color: 0x2f2f36, vertexColors: true, roughness: 0.9 });      // the black robe, the kippah, the shoes
    const mSkin = new MeshStandardMaterial({ color: 0xffffff, map: texFace, roughness: 0.8 });
    const mHair = new MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.95, side: DoubleSide });
    const mFar = new MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.9 });
    const TONES = [[0xf4f2ec, 0xe9e6de, 0xfbfaf6, 0xe2dfd6], [0xa8a49b, 0x8e8a82, 0xbab6ad, 0x9a9388], [0x3d2c1f, 0x2e231b, 0x4c3727, 0x36281d], [0x2a1f17, 0x3b2a1c, 0x1f1813, 0x4b3320, 0x5d4129]];
    const SKINS = [0xffffff, 0xf3e7dc, 0xfff3e6, 0xeedccd];
    // ---------- the head (its middle at the origin, the face to +z): an egg, narrower at the chin; the nose and the ears
    const HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1095], HS = 1.045, YJ = -0.118, OFF = 0.96, HEAD_Y = 2.075;
    const headR = (ph, y) => {
      const yn = Math.max(-0.999, Math.min(0.999, y / HR[1])), j = yn < 0 ? yn * yn : 0;
      return Math.sqrt(1 - yn * yn) / Math.hypot(Math.sin(ph) / (HR[0] * (1 - 0.2 * j)), Math.cos(ph) / (HR[2] * (1 - 0.1 * j)));
    };
    const skinPart = (q) => shade(flatUV(q, 0.75, 0.3), 1);
    const headParts = () => {
      const WS = 18, HG = 12, k = new SphereGeometry(1, WS, HG), p = k.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i), j = y < 0 ? y * y : 0;
        p.setXYZ(i, x * HR[0] * (1 - 0.2 * j), y * HR[1], z * HR[2] * (1 - 0.1 * j));
      }
      k.computeVertexNormals();
      const nr = k.attributes.normal;
      for (let j = 0; j <= HG; j++) {
        const a = j * (WS + 1), b = a + WS, x = nr.getX(a) + nr.getX(b), y = nr.getY(a) + nr.getY(b), z = nr.getZ(a) + nr.getZ(b), l = Math.hypot(x, y, z) || 1;
        nr.setXYZ(a, x / l, y / l, z / l);
        nr.setXYZ(b, x / l, y / l, z / l);
      }
      const parts = [shade(k, 1)];
      parts.push(skinPart(at(sph(0.013, 0.034, 0.02, 6, 4), 0, -0.012, 0.133)));
      parts.push(skinPart(at(sph(0.019, 0.017, 0.022, 7, 5), 0, -0.041, 0.146)));
      for (const sd of [-1, 1]) parts.push(skinPart(at(sph(0.012, 0.03, 0.02, 5, 4), sd * 0.126, 0, -0.004)));
      return parts;
    };
    // ---------- the hair. The beard is one body: from the cheeks before the ears and from the jaw, lying on the face, and under
    // the chin it hangs and comes forward to the chest, narrowing; its lower edge uneven
    const beard = (len, w2) => surf(18, 8, (u, v, o) => {
      const PM = 1.4, a = u * 2 - 1, ph = a * PM, ya = Math.abs(a), sd = 1 - v;
      const yTop = -0.094 + 0.124 * Math.pow(ya, 1.3), yBot = -0.07 - len * (1 - Math.pow(ya, 5)) + 0.008 * Math.sin(6 * ph + w2) * (1 - ya);
      const y = yTop + sd * (yBot - yTop);
      const strand = Math.sin(9 * ph + 3 * sd + w2), th = (0.004 + 0.03 * Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, sd * 1.22))), 0.9) + 0.003 * strand) * (1 - Math.pow(ya, 5));
      if (y >= YJ) {
        const r = headR(ph, y) + th;
        o.x = Math.sin(ph) * r;
        o.z = Math.cos(ph) * r;
      } else {
        const k = Math.min(1, (YJ - y) / 0.2), r = headR(ph, YJ) + th + 0.028 * Math.sin(Math.PI * Math.min(1, k * 1.3)) * Math.abs(Math.sin(ph));
        o.x = Math.sin(ph) * r * (1 - 0.08 * k * k);
        o.z = Math.cos(ph) * r * (1 - 0.1 * k) + 0.05 * k * Math.max(0, Math.cos(ph));
      }
      o.y = y;
      o.c = 0.86 + 0.14 * (0.5 + 0.5 * strand) - 0.06 * sd;
    }, true);
    const brows = () => [-1, 1].map((sd) => shade(at(rot(sph(0.027, 0.0058, 0.009, 6, 3), 0, 0, -sd * 0.05), sd * EYE[0], 0.051, 0.1262), 0.72));
    const stache = () => [-1, 1].map((sd) => shade(at(rot(sph(0.037, 0.0125, 0.016, 6, 4), 0, 0, -sd * 0.4), sd * 0.027, -0.066, 0.127), 1));
    const hairCap = (young) => [shade(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 12, 3, 0, TAU, 0, young ? 1.08 : 0.8), 0.92), shade(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 9, 4, Math.PI + 0.3, Math.PI - 0.6, 1.08, 1.4), 0.9)];
    const peyot = () => [-1, 1].flatMap((sd) => [shade(at(sph(0.013, 0.062, 0.016, 6, 5), sd * 0.122, -0.04, 0.05), 0.95), shade(at(sph(0.016, 0.016, 0.016, 6, 4), sd * 0.124, -0.102, 0.054), 1)]);
    const kippah = () => shade(at(rot(sph(HR[0] * 1.09, HR[1] * 1.09, HR[2] * 1.09, 12, 4, 0, TAU, 0, 0.99), -0.14), 0, 0.002, -0.004), 0.45);
    // ---------- the body: the robe's breadth and depth at each height of a standing man (the priest's table); a sitting man is
    // the table from OFF up, with the lap before it
    const BODY = [[0.1, 0.207, 0.166], [0.5, 0.205, 0.164], [1.0, 0.201, 0.16], [1.2, 0.199, 0.158], [1.33, 0.193, 0.15], [1.45, 0.197, 0.152], [1.58, 0.216, 0.158], [1.68, 0.244, 0.156], [1.745, 0.264, 0.146], [1.79, 0.242, 0.128], [1.83, 0.186, 0.11], [1.87, 0.116, 0.09], [1.9, 0.076, 0.076]];
    const bX = BODY.map((r) => [r[0], r[1]]), bZ = BODY.map((r) => [r[0], r[2]]);
    const robe = (ys, yo, folds) => surf(16, ys.length - 1, (u, v, o) => {
      const y = ys[Math.round(v * (ys.length - 1))], a = u * TAU + Math.PI, k = folds ? Math.max(0, (1.3 - y) / 1.2) : 0;
      const fold = Math.sin(3 * a + 0.8) * 0.6 + Math.sin(5 * a + 2.1) * 0.4, m = 1 + 0.03 * k * fold;
      o.x = spl(bX, y) * m * Math.sin(a);
      o.y = y + yo;
      o.z = spl(bZ, y) * m * Math.cos(a);
      o.c = 1 - 0.16 * k * Math.max(0, -fold);
    });
    // the robe over the thighs, round the knees and down to the shoes (a man on a bench; L: the bench's height in the figure's units)
    const lapBench = (L) => {
      const yT = 0.1, zK = 0.3, RK = 0.085, l1 = zK, l2 = RK * Math.PI / 2, l3 = (yT - RK) - (-L + 0.05), tot = l1 + l2 + l3;
      const D = [0, l1 * 0.5, l1, l1 + l2 / 3, l1 + 2 * l2 / 3, l1 + l2, l1 + l2 + l3 * 0.4, l1 + l2 + l3 * 0.75, tot];
      return surf(14, D.length - 1, (u, v, o) => {
        const d = D[Math.round(v * (D.length - 1))], ph = -u * TAU;
        let pz, py, nz, ny;
        if (d <= l1) { pz = d; py = yT; nz = 0; ny = 1; }
        else if (d <= l1 + l2 + 1e-9) { const th = (d - l1) / RK; pz = zK + RK * Math.sin(th); py = yT - RK + RK * Math.cos(th); nz = Math.sin(th); ny = Math.cos(th); }
        else { pz = zK + RK; py = yT - RK - (d - l1 - l2); nz = 1; ny = 0; }
        const k3 = sstep(l1 + l2, tot, d);
        const a = 0.212 - 0.012 * sstep(0, l1 + l2, d) + 0.02 * k3 * k3, b = 0.1 - 0.012 * sstep(l1 * 0.5, l1 + l2, d) + 0.012 * k3 * k3;
        const sx = Math.sin(ph), cx = Math.cos(ph), x = a * sx, g = Math.exp(-(x / 0.06) * (x / 0.06)), fold = Math.sin(5 * ph + 1.3) * k3;
        const r = b * (cx > 0 ? Math.pow(cx, 0.6) * (1 - 0.3 * g) : cx) * (1 + 0.04 * fold);
        o.x = x * (1 + 0.03 * fold);
        o.y = py + ny * r;
        o.z = pz + nz * r;
        o.c = (cx > 0 ? 1 - 0.3 * g : 0.8) - 0.1 * Math.max(0, fold);
      });
    };
    const arm = (S, E, W) => [shade(at(sph(0.074, 0.074, 0.074, 8, 5), S[0], S[1], S[2]), 1), shade(limb(S, E, 0.072, 0.06, 8), 0.95), shade(at(sph(0.06, 0.06, 0.06, 7, 4), E[0], E[1], E[2]), 0.95), shade(limb(E, W, 0.058, 0.048, 8), 0.9)];
    // a hand lying flat: the palm, the fingers a little bent, the thumb at the inner side (sd: the arm's side; dir: its way, from +z)
    const hand = (sd, H, dir) => {
      const q = mergeGeometries([at(sph(0.03, 0.0135, 0.042, 6, 4), 0, 0, 0.04), at(sph(0.027, 0.011, 0.03, 6, 4), 0, -0.006, 0.085), at(sph(0.01, 0.01, 0.024, 5, 3), -sd * 0.03, 0, 0.04)]);
      q.rotateY(dir);
      q.translate(H[0], H[1], H[2]);
      return skinPart(q);
    };
    const cache = {};
    const build = (pose, L, kind) => {
      const key = pose + "|" + L.toFixed(3) + "|" + kind;
      if (cache[key]) return cache[key];
      const seated = pose !== "stand", HY = HEAD_Y - (seated ? OFF : 0), SY = 1.728 - (seated ? OFF : 0), cloth = [], skin = [];
      const headT = (q) => at(q, 0, HY, 0);
      if (seated) cloth.push(robe([0.98, 1.13, 1.28, 1.43, 1.58, 1.644, 1.708, 1.772, 1.836, 1.9], -OFF, false));
      else cloth.push(robe([0.1, 0.4, 0.7, 1.0, 1.3, 1.45, 1.58, 1.644, 1.708, 1.772, 1.836, 1.9], 0, true));
      for (const sd of [-1, 1]) {
        if (pose === "bench") {
          for (const q of arm([sd * 0.245, SY - 0.01, 0], [sd * 0.27, 0.43, 0.03], [sd * 0.15, 0.225, 0.26])) cloth.push(q);
          skin.push(hand(sd, [sd * 0.13, 0.2, 0.27], -sd * 0.25));
          cloth.push(shade(at(sph(0.05, 0.032, 0.1, 6, 4), sd * 0.1, -L + 0.032, 0.42), 0.4));                       // the shoes
        } else if (pose === "ground") {
          for (const q of arm([sd * 0.245, SY - 0.01, 0], [sd * 0.285, 0.44, -0.02], [sd * 0.262, 0.225, 0.15])) cloth.push(q);
          skin.push(hand(sd, [sd * 0.25, 0.195, 0.17], sd * 0.1));
          cloth.push(shade(at(sph(0.115, 0.095, 0.14, 8, 5), sd * 0.255, 0.085, 0.2), 1));                           // the knees under the robe
        } else {
          // (a man facing +z: his left is at +x) the left hand under the tablet, the right hand on it with the pen
          const W = sd > 0 ? [0.11, 1.4, 0.25] : [-0.1, 1.46, 0.27];
          for (const q of arm([sd * 0.25, SY - 0.01, 0], [sd * 0.275, 1.4, 0.02], W)) cloth.push(q);
          skin.push(hand(sd, sd > 0 ? [0.1, 1.395, 0.26] : [-0.09, 1.475, 0.27], -sd * 0.3));
          cloth.push(shade(at(sph(0.05, 0.03, 0.1, 6, 4), sd * 0.1, 0.03, 0.07), 0.4));
        }
      }
      if (pose === "bench") cloth.push(lapBench(L));
      else if (pose === "ground") cloth.push(shade(at(sph(0.3, 0.115, 0.24, 12, 6), 0, 0.075, 0.17), 0.8));         // the robe over the crossed legs
      else {
        skin.push(shade(flatUV(at(rot(new BoxGeometry(0.21, 0.016, 0.27), -0.5), 0.01, 1.455, 0.37), 0.92, 0.86), 1));   // the scribe's tablet ("וכותבין", Sanhedrin 4:3)
        cloth.push(shade(limb([-0.07, 1.5, 0.36], [-0.11, 1.6, 0.33], 0.006, 0.004, 5), 0.5));                          // and his pen
      }
      cloth.push(headT(kippah()));
      for (const q of headParts()) skin.push(headT(q));
      skin.push(skinPart(at(new CylinderGeometry(0.066, 0.072, 0.1, 8, 1, true), 0, HY - 0.15, 0)));
      const base = () => brows().concat(hairCap(kind === "student")).map(headT);
      const hair = kind === "student"
        ? [mergeGeometries(base().concat(peyot().map(headT)))]
        : [[0.25, 1.1], [0.19, 3.3], [0.14, 5.2]].map(([len, w2]) => mergeGeometries(base().concat(stache().map(headT), [headT(beard(len, w2))])));
      // from afar: the robe, the head and the kippah, plain
      const cR = new Color(0x26262c), cS = new Color(0xcfa07a), cK = new Color(0x121215), far = [];
      if (!seated) far.push(tint(at(new CylinderGeometry(0.17, 0.21, 1.8, 6), 0, 1.0, 0), cR));
      else {
        far.push(tint(at(new CylinderGeometry(0.16, 0.2, 0.9, 6), 0, 0.45, 0), cR));
        if (pose === "bench") {
          far.push(tint(at(new BoxGeometry(0.42, 0.2, 0.5), 0, 0.1, 0.22), cR));
          far.push(tint(at(new BoxGeometry(0.4, L, 0.19), 0, -L / 2 + 0.05, 0.39), cR));
        } else far.push(tint(at(sph(0.36, 0.12, 0.27, 6, 3), 0, 0.07, 0.17), cR));
      }
      far.push(tint(at(sph(HR[0], HR[1], HR[2], 6, 4), 0, HY, 0), cS));
      far.push(tint(at(sph(HR[0] * 1.09, HR[1] * 1.09, HR[2] * 1.09, 6, 2, 0, TAU, 0, 0.92), 0, HY, -0.004), cK));
      return (cache[key] = { cloth: mergeGeometries(cloth), skin: mergeGeometries(skin), hair, far: mergeGeometries(far) });
    };
    const LOD = [], m4 = new Matrix4(), qt = new Quaternion(), sc = new Vector3(), ps = new Vector3(), up = new Vector3(0, 1, 0), c3 = new Color(), wp = new Vector3();
    const crowd = (parent, pts, o) => {
      const n = pts.length, L = o.pose === "bench" ? o.seat / o.s : 0, G = build(o.pose, L, o.kind);
      const near = new Group(), far = new Group(), anchor = new Group();
      const mk = (g, m) => { const im = new InstancedMesh(g, m, n); im.castShadow = false; im.receiveShadow = true; if (o.name) im.name = o.name; return im; };
      const cloth = mk(G.cloth, mCloth), skin = mk(G.skin, mSkin), hairs = G.hair.map((g) => mk(g, mHair)), cnt = hairs.map(() => 0), fm = mk(G.far, mFar);
      cloth.castShadow = !!o.shadow;
      let ax = 0, az = 0;
      pts.forEach(([x, z, yaw], i) => {
        const big = o.big === i, s = o.s * (big ? 1.08 : 0.97 + rnd() * 0.06);
        qt.setFromAxisAngle(up, yaw + (rnd() - 0.5) * (o.pose === "bench" ? 0.16 : 0.3));
        const fw = o.fwd || 0;
        m4.compose(ps.set(x + Math.sin(yaw) * fw, o.y, z + Math.cos(yaw) * fw), qt, sc.set(s, s, s));
        cloth.setMatrixAt(i, m4);
        skin.setMatrixAt(i, m4);
        fm.setMatrixAt(i, m4);
        skin.setColorAt(i, c3.setHex(SKINS[(i * 5 + 1) % SKINS.length]));
        const pal = TONES[o.kind === "student" ? 3 : (o.tone ? o.tone(i) : 1)], k = big ? 0 : (i * 7 + 3) % hairs.length;
        hairs[k].setMatrixAt(cnt[k], m4);
        hairs[k].setColorAt(cnt[k], c3.setHex(big ? TONES[0][2] : pal[Math.floor(rnd() * pal.length)]));
        cnt[k]++;
        ax += x / n;
        az += z / n;
      });
      hairs.forEach((h, k) => { h.count = cnt[k]; });
      for (const im of [cloth, skin, fm].concat(hairs)) {
        im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;
        if (im.count > 0) (im === fm ? far : near).add(im);
      }
      far.visible = false;
      anchor.position.set(ax, o.y, az);
      parent.add(near);
      parent.add(far);
      parent.add(anchor);
      LOD.push({ near, far, anchor });
      return near;
    };
    // from afar the plain figures stand in (the many small faces are not drawn where they cannot be seen)
    if (Array.isArray(ctx.animated)) ctx.animated.push(() => {
      const cam = ctx.camera;
      if (!cam) return;
      const f = cam.isPerspectiveCamera ? Math.tan(cam.fov * Math.PI / 360) / 0.4142 / (cam.zoom || 1) : 1;
      for (const e of LOD) {
        e.anchor.getWorldPosition(wp);
        const d = wp.distanceTo(cam.position) * f, nr = e.near.visible ? d < 170 : d < 150;
        if (nr !== e.near.visible) { e.near.visible = nr; e.far.visible = !nr; }
      }
    });
    // pts [[x, z] ...] along a row round the centre c: every one's face to the row's inner side (`away`: to its outer side)
    const facing = (pts, c, away) => pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), nz = b[0] - a[0];
      if (nx * (c[0] - p[0]) + nz * (c[1] - p[1]) < 0) { nx = -nx; nz = -nz; }
      if (away) { nx = -nx; nz = -nz; }
      return [p[0], p[1], Math.atan2(nx, nz)];
    });
    // the beards along a row of n judges: white by the one in the middle, grey further, black-brown at the two ends
    const age = (n) => (i) => { const d = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2); return d < 0.34 ? 0 : d < 0.67 ? 1 : 2; };
    return (ctx.__tmPeople = { crowd, facing, age });
  }
  // ===== PEOPLE_KIT_204 END
