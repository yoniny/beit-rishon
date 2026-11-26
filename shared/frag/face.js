  // ===== FACE_E BEGIN (fix-e, 22.11.2026; the user's decision 169 b): THE FACE OF EVERY NEAR FIGURE, ONE CONSTRUCTION FOR BOTH
  // HOUSES (shared/frag/face.js, put in once at the top of each house's 30-courts.js; tm_face() builds it once and keeps it). The user
  // compared our faces with the picture he sent ("מבנה הפרצוף יותר אמיתי") and decided: the faces of all the near figures - the
  // priests, the High Priest, the Levites, the king, the elders and the near Sanhedrin - after that picture; the crowds far off stay
  // plain. What was wrong, and what is here instead (no picture and no texture from outside - all geometry and canvas drawn here):
  //   1. the eyes - were large and round as a doll's, and high: now small, almond-shaped, with an upper and a lower lid (the opening
  //      itself is in the skin - a ball of the eye behind it), at the middle of the head's height, set in under the brows;
  //   2. the brows, the nose, the cheeks - a brow ridge with the forehead above it and a hollow under it; the nose straight, its bridge
  //      narrow, widening to its wings; cheekbones; until now a nose "as a sausage" on a flat face;
  //   3. the mouth - small lips within the moustache and the beard;
  //   4. the beard and the moustache - the beard grows from the cheeks and the chin and goes down in waves, in locks, its ends of
  //      single hairs; the moustache over the lip; until now one cast lump;
  //   5. the head - an egg, the face upright from the brows to the chin and the jaw clear beneath it (until now the lower half was a
  //      ball's), the ears at the height of the eyes and the nose;
  //   6. the skin's tone natural, its shading soft (the hollows a little darker, the cheeks and the nose a little redder).
  // In the head's frame of the figures' kit (priest-kit.js: its middle at HEAD_Y, the face to +z, units of the kit): the skull above
  // the brows and behind is the kit's own (headR - the hats, the mitznefet, the kippot and the tefillin's strap sit on it as before);
  // only the face and the jaw are new. Two levels: "hi" (near - the opening of the eyes in the skin, the balls of the eyes, every
  // fold) and "lo" (from a few amot - the same face in fewer faces, the eyes drawn on the skin).
  //   tm_face() -> { head(d), eyes(), hair(o), tex: { skin, eye, hairA }, UV_SKIN, UV_PARCH, skinPoint(th, y, off), ... }
  //     head(d)  the skin of the head with its ears ("hi" | "lo"; its texture tex.skin)
  //     eyes()   the two balls of the eyes ("hi" only; tex.eye)
  //     hair(o)  the hair of the head, the brows, the beard and the moustache, one geometry - o = { d: "hi" | "lo", len (the beard
  //              below the chin), w2 (its own waves), beard: "full" | "short" | "none" } (its texture tex.hairA, with alpha: alphaTest)
  // MODEL CHOICES: every measure of the face, its features and its colours, the beard's form, its locks and lengths.
  function tm_face() {
    if (tm_face.k) return tm_face.k;
    const TAU = Math.PI * 2, HP = Math.PI / 2;
    const clamp = (v, a, b) => (v < a ? a : v > b ? b : v), lerp = (a, b, u) => a + (b - a) * u;
    const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    const gs = (a, b, sa, sb) => Math.exp(-0.5 * ((a * a) / (sa * sa) + (b * b) / (sb * sb)));
    // a smooth line through a table of [x, y], x ascending
    const spl = (tab, x) => {
      if (x <= tab[0][0]) return tab[0][1];
      if (x >= tab[tab.length - 1][0]) return tab[tab.length - 1][1];
      let i = 0;
      while (i < tab.length - 2 && x > tab[i + 1][0]) i++;
      const p0 = tab[Math.max(0, i - 1)], p1 = tab[i], p2 = tab[i + 1], p3 = tab[Math.min(tab.length - 1, i + 2)];
      const d = p2[0] - p1[0], t = (x - p1[0]) / d;
      const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0])) * d, m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0])) * d, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
    };
    // ---------- the head's form: R(th, y) - its distance from its upright axis at the angle th (0 before, +x the figure's left) and
    // the height y. Behind and above the brows - the kit's skull (headR: an egg, HR); before, below the brows, the face's own profile
    // (FT: its depth before the axis by the height - upright from the brows to the chin, then the jaw's under side to the neck), its
    // section a little square (n - the jaw full at its corners)
    const HR = [0.128, 0.16, 0.14];
    const sqj = (y) => { const n = clamp(y / HR[1], -0.9999, 0.9999); return [Math.sqrt(1 - n * n), n < 0 ? n * n : 0]; };
    const aOf = (y) => { const q = sqj(y); return HR[0] * q[0] * (1 - 0.2 * q[1]); };
    const cBack = (y) => { const q = sqj(y); return HR[2] * q[0] * (1 - 0.1 * q[1]); };
    const FT = [[-0.16, 0], [-0.1588, 0.05], [-0.1565, 0.078], [-0.1525, 0.095], [-0.145, 0.108], [-0.13, 0.1185], [-0.11, 0.124], [-0.085, 0.1285],
      [-0.06, 0.131], [-0.03, 0.133], [0.0, 0.1332], [0.03, 0.1342], [0.05, 0.1332]];
    const cFront = (y) => (y >= 0.05 ? cBack(y) : lerp(spl(FT, y), cBack(y), sm(0.03, 0.05, y)));
    const nOf = (y) => 2 + 0.22 * sm(0.05, 0.0, y) + 0.45 * sm(-0.07, -0.125, y);
    const Rbase = (th, y) => {
      const a = aOf(y), s = Math.abs(Math.sin(th)), c = Math.cos(th);
      if (c <= 0) return 1 / Math.hypot(s / a, c / cBack(y));
      const f = cFront(y), n = nOf(y);
      return Math.pow(Math.pow(s / a, n) + Math.pow(c / f, n), -1 / n);
    };
    // the nose: its height before the face by y (NP) and its half breadth at its foot (NW); its bridge narrow and straight, the tip a
    // little round, the wings on either side and the groove round them
    const NP = [[-0.07, 0], [-0.0662, 0.0], [-0.0628, 0.0055], [-0.0585, 0.0155], [-0.0535, 0.0228], [-0.0475, 0.0246], [-0.038, 0.0206], [-0.02, 0.0146], [0.0, 0.0086], [0.012, 0.0042], [0.022, 0], [0.03, 0]];
    const NW = [[-0.07, 0.01], [-0.06, 0.0122], [-0.048, 0.0152], [-0.03, 0.0134], [0.0, 0.0118], [0.025, 0.0118]];
    const nose = (X, y) => {
      if (y < -0.08 || y > 0.03) return 0;
      const ax = Math.abs(X), P = spl(NP, y), W = spl(NW, y), t = ax / W;
      let d = t < 1 ? P * Math.pow(1 - Math.pow(t, 1.7), 1.6) : 0;
      d += 0.0025 * gs(X, y + 0.0485, 0.0055, 0.0052);                                   // the tip
      d += 0.0102 * gs(ax - 0.0158, y + 0.0548, 0.0061, 0.0060);                         // the wings
      d -= 0.0021 * gs(ax - 0.0232, y + 0.0545, 0.0026, 0.0068);                         // the groove round them
      return d;
    };
    // the face's relief over the form, before (w: none from the ears back)
    const dFace = (th, y, R) => {
      const c = Math.cos(th);
      if (c <= 0.05) return 0;
      const X = Math.sin(th) * R, ax = Math.abs(X), w = sm(0.05, 0.45, c);
      let d = 0;
      d += 0.0065 * gs(0, y - 0.029, 1, 0.0105) * (1 - sm(0.06, 0.095, ax));            // the brow ridge
      d -= 0.0022 * gs(X, y - 0.016, 0.009, 0.007);                                       // the nose's root between the brows
      d -= 0.0105 * gs(ax - EX, y - EY, 0.022, 0.0135);                                   // the eyes' sockets
      d -= 0.0035 * gs(ax - 0.105, y - 0.045, 0.018, 0.03);                               // the temples
      d += 0.0075 * gs(ax - 0.07, y + 0.026, 0.021, 0.013);                               // the cheekbones
      d -= 0.004 * gs(ax - 0.066, y + 0.066, 0.018, 0.02);                                // the hollows beneath them
      d += nose(X, y);
      d += 0.0065 * gs(X, y + 0.082, 0.027, 0.02);                                        // the mouth's ground (over the teeth)
      d += 0.0032 * gs(X, y + 0.0805, 0.018, 0.0034);                                     // the upper lip
      d -= 0.0028 * gs(X, y + 0.0868, 0.02, 0.0013);                                      // the line between the lips
      d -= 0.0018 * gs(ax - 0.021, y + 0.0868, 0.0026, 0.0026);                           // the mouth's corners
      d += 0.0042 * gs(X, y + 0.0918, 0.016, 0.0041);                                     // the lower lip
      d -= 0.0028 * gs(X, y + 0.1045, 0.02, 0.0042);                                      // the hollow under it
      d += 0.0085 * gs(X, y + 0.128, 0.026, 0.017);                                       // the chin
      { const t = clamp((-0.055 - y) / 0.035, 0, 1), xf = 0.024 + 0.012 * t, k = gs(y + 0.072, 0, 0.02, 1);   // the folds from the wings to the corners
        d -= 0.0016 * gs(ax - xf, 0, 0.0035, 1) * k; d += 0.0012 * gs(ax - xf - 0.006, y + 0.07, 0.006, 0.016); }
      return d * w;
    };
    // ---------- the eyes: a ball for each (a little broader than high), behind an opening in the skin of almond form - the upper lid
    // over the top of the iris, the lower at its foot, the outer corner a little higher (u: -1 the inner corner .. +1 the outer)
    const EX = 0.044, EY = -0.002, ERX = 0.0195, ER = 0.0175, EZ = 0.1068;
    const RREF = 0.128, TE = Math.asin(EX / RREF), WT = 0.0184 / RREF;   // the eye's middle and its half breadth, in th
    const HU = 0.0077, HL = 0.0051, TILT = 0.0015, LT = 0.0011;
    const lidUp = (u) => EY + TILT * u + HU * Math.pow(Math.max(0, 1 - u * u), 0.72) * (1 - 0.14 * u);
    const lidLo = (u) => EY + TILT * u - HL * Math.pow(Math.max(0, 1 - u * u), 1.05) * (1 + 0.16 * u);
    const eyeR = (th, y, s) => {   // the ball's face along the ray from the axis at (th, y), or -1
      const dx = Math.sin(th), dz = Math.cos(th), cx = s * EX, ix = 1 / (ERX * ERX), iz = 1 / (ER * ER);
      const A = dx * dx * ix + dz * dz * iz, B = -2 * (dx * cx * ix + dz * EZ * iz), C = cx * cx * ix + EZ * EZ * iz + (y - EY) * (y - EY) * iz - 1, D = B * B - 4 * A * C;
      return D < 0 ? -1 : (-B + Math.sqrt(D)) / (2 * A);
    };
    // the skin's distance at (th, y): "face" - the skin over all (over the ball, the lids: their thickness grows away from the
    // opening, and a crease over the upper); "in" - the skin within the opening, behind the ball (hi only)
    const skinR = (th, y, kind, lo) => {
      const R0 = Rbase(th, y), Rf = R0 + dFace(th, y, R0);
      const s = th < 0 ? -1 : 1, Re = eyeR(th, y, s);
      if (Re < 0) return Rf;
      const u = (s * th - TE) / WT, au = Math.abs(u), uc = clamp(u, -1, 1), yu = lidUp(uc), yl = lidLo(uc);
      if (kind === "in" && au < 1) { const out = Math.max(Rf, Re + LT), open = sm(0, 0.22, 1 - au); return out - (out - (Re - 0.0028)) * open; }
      const dy = y > yu ? y - yu : y < yl ? yl - y : 0, dist = au >= 1 ? Math.hypot((au - 1) * WT * RREF, dy) : dy, up = y >= (yu + yl) / 2;
      let lid = LT + (up ? 0.0042 : 0.0026) * sm(0, up ? 0.007 : 0.006, dist);
      if (up && au < 1) lid -= 0.0016 * gs(dist - 0.0056, 0, 0.0012, 1) * (1 - au * au);   // the crease of the upper lid
      if (lo) lid = Math.max(lid, 0.0017);
      return Math.max(Rf, Re + lid);
    };
    const pt = (th, R, y) => [Math.sin(th) * R, y, Math.cos(th) * R];
    // a point on the skin (no ball of the eye) and its normal, and a point off it along the normal
    const skinPoint = (th, y, off) => {
      const e = 0.0015, R = skinR(th, y, "face", true), p = pt(th, R, y);
      const pa = pt(th + e / Math.max(0.03, R), skinR(th + e / Math.max(0.03, R), y, "face", true), y), pb = pt(th, skinR(th, y + e, "face", true), y + e);
      const ux = pa[0] - p[0], uy = pa[1] - p[1], uz = pa[2] - p[2], vx = pb[0] - p[0], vy = pb[1] - p[1], vz = pb[2] - p[2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const l = Math.hypot(nx, ny, nz) || 1;
      nx /= l; ny /= l; nz /= l;
      if (nx * p[0] + nz * p[2] < 0) { nx = -nx; ny = -ny; nz = -nz; }
      const o = off || 0;
      return [p[0] + nx * o, p[1] + ny * o, p[2] + nz * o, nx, ny, nz];
    };
    // ---------- the texture's layout: the face's part - th -TH..TH over u 0..TU, y YT0..YT1 over v 0..1; at the right, patches:
    // plain skin, the ear's (dark within, to skin), the lips', parchment (people-kit.js: the scribes' tablets at 0.92, 0.86)
    const TU = 0.78, TH = 1.62, YT0 = -0.2, YT1 = 0.17;
    const uvOf = (th, y) => [clamp(th / TH * 0.5 + 0.5, 0, 1) * TU, clamp((y - YT0) / (YT1 - YT0), 0, 1)];
    const UV_SKIN = [0.9, 0.2], UV_EAR = [0.9, 0.42], UV_EAR1 = [0.9, 0.58], UV_PARCH = [0.92, 0.86], UV_NECK = [0.9, 0.65], UV_NECK1 = [0.9, 0.73];
    const NECK = [-0.222, 0.081, -0.004, 0.075];   // the neck: its foot (within the collar), its half breadth, its middle's z and its half depth
    // ---------- a grid geometry: cols x rows, fn(i, j) -> [x, y, z, u, v, shade]; o.closed - round in i (its last column the first's
    // place: the normals there joined); o.flip - its faces the other way; o.pole - the normals of its first row joined (a point);
    // o.alpha - a fourth colour, its alpha (r[6]): where the hair thins out (with the texture's alpha and alphaTest)
    const grid = (ni, nj, fn, o = {}) => {
      const pos = [], uv = [], col = [], idx = [];
      for (let j = 0; j <= nj; j++) for (let i = 0; i <= ni; i++) {
        const r = fn(i, j);
        pos.push(r[0], r[1], r[2]); uv.push(r[3], r[4]); const c = r[5] == null ? 1 : r[5]; col.push(c, c, c);
        if (o.alpha) col.push(r[6] == null ? 1 : r[6]);
      }
      for (let j = 0; j < nj; j++) for (let i = 0; i < ni; i++) {
        const a = j * (ni + 1) + i, b = a + 1, c = a + ni + 1, d = c + 1;
        if (o.flip) idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c);
      }
      const q = new BufferGeometry();
      q.setAttribute("position", new Float32BufferAttribute(pos, 3));
      q.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      q.setAttribute("color", new Float32BufferAttribute(col, o.alpha ? 4 : 3));
      q.setIndex(idx);
      q.computeVertexNormals();
      const n = q.attributes.normal, join = (list) => {
        let x = 0, y = 0, z = 0;
        for (const k of list) { x += n.getX(k); y += n.getY(k); z += n.getZ(k); }
        const l = Math.hypot(x, y, z) || 1;
        for (const k of list) n.setXYZ(k, x / l, y / l, z / l);
      };
      if (o.closed) for (let j = 0; j <= nj; j++) join([j * (ni + 1), j * (ni + 1) + ni]);
      if (o.pole) join(Array.from({ length: ni + 1 }, (_, i) => i));
      return q;
    };
    // columns by spans: [[th0, th1, n], ...] -> the th of each column (th0 of the first span .. th1 of the last)
    const spans = (S) => { const out = []; S.forEach(([a, b, n], k) => { for (let i = k ? 1 : 0; i <= n; i++) out.push(lerp(a, b, i / n)); }); return out; };
    // ---------- the skin of the head. HI: dense before (the eyes, the nose, the mouth), its rows through the eyes laid along the lids
    // (each lid's margin twice - out on the lid and in behind the ball - so that the opening's edge is sharp); LO: the same form in a
    // few faces, the eyes closed over by the lids' skin (they are drawn on it)
    const headGeo = (d) => {
      const hi = d !== "lo";
      const cols = hi ? spans([[-Math.PI, -1.3, 4], [-1.3, -0.52, 8], [-0.52, -0.18, 11], [-0.18, 0.18, 10], [0.18, 0.52, 11], [0.52, 1.3, 8], [1.3, Math.PI, 4]])
        : spans([[-Math.PI, -1.2, 3], [-1.2, -0.45, 4], [-0.45, 0.45, 8], [0.45, 1.2, 4], [1.2, Math.PI, 3]]);
      // rows (from the chin's foot up to y 0.07; the skull's cap above is its own grid): a number is a height; an object a row through
      // the eyes - { b: "lo" | "up", s } between the band's edge and the lid's margin, { m: "lo" | "up", k: "out" | "in" } a margin
      const B0 = EY - 0.0125, B1 = EY + 0.0165;
      const rows = hi ? [-0.16, -0.1592, -0.1575, -0.155, -0.1515, -0.147, -0.141, -0.134, -0.126, -0.117, -0.109, -0.1025, -0.097, -0.0928, -0.0893, -0.0868,
        -0.0842, -0.0812, -0.0778, -0.0735, -0.0685, -0.0642, -0.0605, -0.057, -0.053, -0.0488, -0.0435, -0.037, -0.03, -0.022, -0.0165,
        { b: "lo", s: 0 }, { b: "lo", s: 0.5 }, { m: "lo", k: "out" }, { m: "lo", k: "in" }, { m: "up", k: "in" }, { m: "up", k: "out" },
        { b: "up", s: 0.2 }, { b: "up", s: 0.45 }, { b: "up", s: 0.72 }, { b: "up", s: 1 }, 0.0225, 0.029, 0.036, 0.045, 0.056, 0.07]
        : [-0.16, -0.156, -0.146, -0.128, -0.108, -0.091, -0.0805, -0.068, -0.056, -0.044, -0.03, -0.016, -0.002, 0.012, 0.03, 0.05, 0.07];
      const ni = cols.length - 1, nj = rows.length - 1;
      const geo = grid(ni, nj, (i, j) => {
        const th = cols[i], r = rows[j];
        let y, kind = "face";
        if (typeof r === "number") y = r;
        else {
          const s = th < 0 ? -1 : 1, u = clamp((s * th - TE) / WT, -1, 1), yu = lidUp(u), yl = lidLo(u);
          if (r.m) { y = r.m === "up" ? yu : yl; kind = r.k; }
          else y = r.b === "up" ? lerp(yu, B1, r.s) : lerp(B0, yl, r.s);
        }
        const R = skinR(th, y, kind, !hi), p = pt(th, R, y), t = uvOf(th, y);
        if (kind === "in") t[1] += r.m === "up" ? -0.0016 : 0.0016;   // the margin's inner side: the opening's dark
        return [p[0], p[1], p[2], t[0], t[1], 1];
      }, { closed: true });
      // the skull's cap: from y 0.066 (under the face's top row) to the crown
      const capR = hi ? [0.066, 0.08, 0.095, 0.11, 0.124, 0.136, 0.146, 0.1535, 0.1582, 0.16] : [0.066, 0.1, 0.13, 0.152, 0.16];
      const nc = hi ? 20 : 12;
      const cap = grid(nc, capR.length - 1, (i, j) => {
        const th = -Math.PI + (i / nc) * TAU, y = capR[j], R = j === capR.length - 1 ? 0 : skinR(th, y, "face"), p = pt(th, R, y), t = uvOf(th, y);
        return [p[0], p[1], p[2], t[0], t[1], 1];
      }, { closed: true });
      // the neck: from within the garment's collar up into the head (it covers the bodies' own thin necks), of the skin's tone, a
      // little darker under the jaw
      const nr = hi ? 6 : 2, nn = hi ? 22 : 10;
      const neck = grid(nn, nr, (i, j) => {
        const a = -Math.PI + (i / nn) * TAU, s2 = j / nr, y = lerp(NECK[0], -0.095, s2), w = 1 + 0.04 * s2;
        return [Math.sin(a) * NECK[1] * w, y, NECK[2] + Math.cos(a) * NECK[3] * w, UV_NECK[0], lerp(UV_NECK[1], UV_NECK1[1], sm(0.35, 0.95, s2)), 1];
      }, { closed: true });
      return mergeGeometries([geo, cap, neck, earGeo(1, hi), earGeo(-1, hi)]);
    };
    // the ear (s: +1 the figure's left): its front joined to the head before the jaw's joint, standing out behind; its rim (helix)
    // round the top and the back, the ridge within it, the bowl (concha), the lobe below; its back down to the head. At the height of
    // the brows to the nose's foot
    const earGeo = (s, hi) => {
      const AL = 0.42, Bx = Math.sin(AL), Bz = -Math.cos(AL), Nx = Math.cos(AL), Nz = Math.sin(AL);   // back-and-out along the ear; out of it
      const C = [0.0175, -0.0135];   // the bowl's middle: w (from the front edge back), y
      const out = (ph) => {   // the outline at ph (0 back, pi/2 up, pi front, 3pi/2 down)
        const c = Math.cos(ph), sn = Math.sin(ph);
        return [C[0] + c * (c > 0 ? 0.0235 : 0.0172) * (sn < 0 ? 0.8 + 0.2 * Math.abs(c) : 1), C[1] + sn * (sn > 0 ? 0.042 : 0.0435)];
      };
      const place = (w, y, h) => {   // a point of the ear: w back from its front edge, at the height y, h out of its plane
        const hx = aOf(y) - 0.0015, hz = 0.0075;
        return [s * (hx + Bx * w + Nx * h), y, hz + Bz * w + Nz * h];
      };
      const nu = hi ? 20 : 8, nv = hi ? 7 : 2;
      // the relief by the way from the bowl's middle (v 0) to the edge (v 1): the bowl deep, the ridge within the rim, the groove, the rim
      // rolled, its edge turned in; the lobe below plain and full; at the front edge it goes into the head
      const H = (v, ph) => {
        const sn = Math.sin(ph), cs = Math.cos(ph), lobe = sm(-0.25, -0.8, sn), front = sm(-0.35, -0.9, cs) * (1 - lobe);
        const bowl = -0.0075 * (1 - sm(0.12, 0.52, v)) * (1 - 0.5 * sm(0.2, 0.9, sn));
        const rel = bowl + 0.0028 * gs(v - 0.63, 0, 0.075, 1) * (1 - 0.6 * sm(-0.1, -0.6, sn)) - 0.0009 * gs(v - 0.77, 0, 0.04, 1) + 0.0072 * gs(v - 0.9, 0, 0.045, 1) - 0.0034 * sm(0.94, 1, v);
        const lobeRel = -0.002 * (1 - sm(0.1, 0.5, v)) + 0.0034 * Math.sin(Math.PI * Math.min(1, v * 1.1));
        return lerp(lerp(rel, lobeRel, lobe), -0.002 + 0.002 * v, front) + 0.0045;
      };
      // its colour by its relief: the hollows darker (the bowl darkest), the ridges lighter
      const tone = (h) => [UV_EAR[0], lerp(UV_EAR[1], UV_EAR1[1], sm(-0.0032, 0.009, h))];
      const face = grid(nu, nv, (i, j) => {
        const ph = (i / nu) * TAU, v = j / nv, o = out(ph), w = lerp(C[0], o[0], v), y = lerp(C[1], o[1], v), h = H(v, ph), p = place(w, y, h), t = tone(h);
        return [p[0], p[1], p[2], t[0], t[1], 1];
      }, { closed: true, flip: s > 0, pole: true });
      const back = grid(nu, hi ? 2 : 1, (i, j) => {   // from the rim's edge in to the head (its end within the head)
        const ph = (i / nu) * TAU, o = out(ph), k = j / (hi ? 2 : 1), h = lerp(H(1, ph), -0.018, k), w = lerp(o[0], o[0] * 0.7, k);
        const p = place(w, o[1] * (1 - 0.12 * k) + C[1] * 0.12 * k, h);
        return [p[0], p[1], p[2], UV_EAR1[0], lerp(UV_EAR1[1], UV_EAR[1] + 0.06, k), 1];
      }, { closed: true, flip: s > 0 });
      return mergeGeometries([face, back]);
    };
    // the balls of the eyes (only their front: the rest is within the head); their texture by a projection from before
    const eyesGeo = () => mergeGeometries([1, -1].map((s) => grid(18, 9, (i, j) => {
      const b = (i / 18) * TAU, a = (j / 9) * 1.95, x = Math.sin(a) * Math.cos(b), y = Math.sin(a) * Math.sin(b), z = Math.cos(a);
      return [s * EX + x * ERX, EY + y * ER, EZ + z * ER, 0.5 + 0.5 * x, 0.5 + 0.5 * y, 1];
    }, { closed: true, flip: true, pole: true })));
    // ---------- the textures
    const canvas = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
    const texOf = (cv, rep) => { const t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; t.anisotropy = 4; if (rep) { t.wrapS = RepeatWrapping; } return t; };
    // the skin: its tone (warm, a man who works in the sun), uneven; the hollows a little darker (from the relief itself), the cheeks,
    // the nose and the ears a little redder; the lips; the eyes drawn (seen in "lo"; in "hi" the ball stands before them) and the
    // lashes on the lids' margins; the nostrils
    const texSkin = (() => {
      const W = 768, Hh = 768, cv = canvas(W, Hh), c = cv.getContext("2d");
      const X = (th) => (th / TH * 0.5 + 0.5) * TU * W, Y = (y) => (1 - (y - YT0) / (YT1 - YT0)) * Hh;
      const BASE = [180, 121, 96];
      // the relief's shade and the colour's places, on a small grid (smoothed up - they are soft; the load time): the relief d and, from
      // it, its hollows (where it is lower than about it - darker) and its ridges (a little lighter)
      const S = 80, sc = canvas(S, S), sx = sc.getContext("2d"), img = sx.createImageData(S, S), Dd = img.data;
      const dv = new Float32Array(S * S), wv = new Float32Array(S * S);
      for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
        const u = (px + 0.5) / S, v = 1 - (py + 0.5) / S, k = py * S + px;
        if (u >= TU) continue;
        const th = (u / TU - 0.5) * 2 * TH, y = YT0 + v * (YT1 - YT0), c = Math.cos(th);
        if (c <= 0.05 || y < -0.157 || y > 0.12) continue;
        const R = Rbase(th, y);
        dv[k] = dFace(th, y, R);
        wv[k] = sm(0.05, 0.3, c) * sm(-0.157, -0.148, y) * sm(0.12, 0.08, y);
      }
      const blur = (src, r) => {   // a box, twice each way
        let a = src, b2 = new Float32Array(S * S);
        for (let pass = 0; pass < 4; pass++) {
          const hor = pass % 2 === 0;
          for (let j = 0; j < S; j++) { let acc = 0; const at = (i) => (hor ? a[j * S + clamp(i, 0, S - 1)] : a[clamp(i, 0, S - 1) * S + j]);
            for (let i = -r; i <= r; i++) acc += at(i);
            for (let i = 0; i < S; i++) { if (hor) b2[j * S + i] = acc / (2 * r + 1); else b2[i * S + j] = acc / (2 * r + 1); acc += at(i + r + 1) - at(i - r); } }
          const t = a; a = b2; b2 = t === src ? new Float32Array(S * S) : t;
        }
        return a;
      };
      const db = blur(dv, 2);
      for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
        const k = py * S + px, o = k * 4, w = wv[k];
        let r = BASE[0], g = BASE[1], b = BASE[2];
        if (w > 0) {
          const u = (px + 0.5) / S, v = 1 - (py + 0.5) / S, th = (u / TU - 0.5) * 2 * TH, y = YT0 + v * (YT1 - YT0), R = Rbase(th, y), X2 = Math.sin(th) * R, ax = Math.abs(X2);
          const cav = clamp((db[k] - dv[k]) * 3400, -9, 34) * w;   // the hollows darker, the ridges a little lighter
          const red = (0.55 * gs(ax - 0.06, y + 0.036, 0.024, 0.02) + 0.45 * gs(X2, y + 0.046, 0.011, 0.017) + 0.2 * gs(X2, y + 0.126, 0.024, 0.02)) * w;
          const fore = gs(X2, y - 0.07, 0.07, 0.03) * w, under = gs(ax - EX, y + 0.016, 0.02, 0.0075) * w;
          r += -cav * 1.0 + red * 15 + fore * 6 - under * 10; g += -cav * 0.95 - red * 7 + fore * 5 - under * 11; b += -cav * 0.85 - red * 6 + fore * 4 - under * 7;
        }
        Dd[o] = clamp(r, 0, 255); Dd[o + 1] = clamp(g, 0, 255); Dd[o + 2] = clamp(b, 0, 255); Dd[o + 3] = 255;
      }
      sx.putImageData(img, 0, 0);
      c.imageSmoothingEnabled = true;
      c.imageSmoothingQuality = "low";
      c.drawImage(sc, 0, 0, W, Hh);
      { // a fine mottling over all: a tile of 128 (its own noise; the figures' fixed sequence untouched), laid over twice in two sizes
        const T = canvas(128, 128), tc = T.getContext("2d"), im = tc.createImageData(128, 128), d = im.data;
        for (let k = 0; k < 128 * 128; k++) {
          const x = k % 128, y = (k / 128) | 0, h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453, q = h - Math.floor(h);
          d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = q < 0.5 ? 70 : 230; d[k * 4 + 3] = Math.round(Math.abs(q - 0.5) * 2 * 40);
        }
        tc.putImageData(im, 0, 0);
        c.save(); c.globalAlpha = 0.55; c.fillStyle = c.createPattern(T, "repeat"); c.fillRect(0, 0, W, Hh);
        c.scale(3, 3); c.globalAlpha = 0.35; c.fillRect(0, 0, W / 3, Hh / 3); c.restore();
      }
      // a shape in (th, y): drawn through its points
      const path = (fn, n) => { c.beginPath(); for (let k = 0; k <= n; k++) { const [th, y] = fn(k / n); if (k) c.lineTo(X(th), Y(y)); else c.moveTo(X(th), Y(y)); } };
      const thX = (x, y) => Math.asin(clamp(x / skinR(0, y, "face", true), -1, 1));   // th of a point x across the face (near its middle)
      // the lips: the upper (darker, under the moustache), the lower; the line between
      const lip = (y0, h, w2, col) => {
        path((t) => { const a = t * TAU, x = Math.cos(a) * w2, yy = y0 + Math.sin(a) * h * (Math.sin(a) > 0 ? 1 : 0.9) * (1 - 0.25 * Math.pow(Math.abs(Math.cos(a)), 3)); return [thX(x, yy), yy]; }, 48);
        c.fillStyle = col; c.fill();
      };
      c.filter = "blur(1.5px)";
      lip(-0.0812, 0.0042, 0.0205, "rgba(150,86,74,0.75)");
      lip(-0.0918, 0.0052, 0.0185, "rgba(168,98,84,0.8)");
      c.filter = "none";
      c.strokeStyle = "rgba(92,44,36,0.85)"; c.lineWidth = 1.7;
      path((t) => { const x = lerp(-0.0215, 0.0215, t), yy = -0.0866 - 0.0008 * Math.cos(Math.PI * (t - 0.5)); return [thX(x, yy), yy]; }, 24); c.stroke();
      c.fillStyle = "rgba(255,226,206,0.22)";
      path((t) => { const a = t * TAU, x = Math.cos(a) * 0.009, yy = -0.0905 + Math.sin(a) * 0.0013; return [thX(x, yy), yy]; }, 24); c.fill();
      // the nostrils (on the nose's under side)
      c.fillStyle = "rgba(60,32,24,0.8)";
      for (const s of [-1, 1]) { path((t) => { const a = t * TAU, x = s * 0.0082 + Math.cos(a) * 0.0042, yy = -0.0605 + Math.sin(a) * 0.0011; return [thX(x, yy), yy]; }, 20); c.fill(); }
      // the eyes: the white, the iris, the lashes on the margins, the shade under the upper lid and the crease above it
      for (const s of [-1, 1]) {
        const T = (u) => s * (TE + u * WT);
        c.save();
        path((t) => (t <= 0.5 ? [T(lerp(-1, 1, t * 2)), lidUp(lerp(-1, 1, t * 2))] : [T(lerp(1, -1, t * 2 - 1)), lidLo(lerp(1, -1, t * 2 - 1))]), 64);
        c.fillStyle = "#d6c9b8"; c.fill();
        c.clip();
        const ix = X(s * TE), iy = Y(EY + 0.0012), rx = Math.abs(X(s * TE + 0.0079 / RREF) - ix), ry = Math.abs(Y(EY + 0.0012 + 0.0079) - iy);
        const gr = c.createLinearGradient(0, Y(EY + HU), 0, Y(EY - HL));
        gr.addColorStop(0, "rgba(70,40,26,0.55)"); gr.addColorStop(0.45, "rgba(70,40,26,0)");
        c.fillStyle = "#1d3a58"; c.beginPath(); c.ellipse(ix, iy, rx, ry, 0, 0, TAU); c.fill();
        c.fillStyle = "#4c84b2"; c.beginPath(); c.ellipse(ix, iy, rx * 0.86, ry * 0.86, 0, 0, TAU); c.fill();
        c.fillStyle = "#0e0806"; c.beginPath(); c.ellipse(ix, iy, rx * 0.38, ry * 0.38, 0, 0, TAU); c.fill();
        c.fillStyle = gr; c.fillRect(X(T(-1.2)) - 40, Y(EY + HU) - 2, Math.abs(X(T(1.2)) - X(T(-1.2))) + 80, Y(EY - HL) - Y(EY + HU) + 4);
        c.restore();
        c.lineCap = "round";
        c.strokeStyle = "rgba(38,22,14,0.95)"; c.lineWidth = 2.6;
        path((t) => [T(lerp(-0.92, 1, t)), lidUp(lerp(-0.92, 1, t)) + 0.0002], 32); c.stroke();
        c.strokeStyle = "rgba(70,42,30,0.6)"; c.lineWidth = 1.2;
        path((t) => [T(lerp(-0.85, 0.95, t)), lidLo(lerp(-0.85, 0.95, t)) - 0.0002], 32); c.stroke();
        c.strokeStyle = "rgba(92,52,36,0.42)"; c.lineWidth = 1.8;
        path((t) => { const u = lerp(-0.75, 0.85, t); return [T(u), lidUp(u) + 0.0052 * Math.pow(1 - u * u, 0.5) + 0.0006]; }, 32); c.stroke();
        c.fillStyle = "rgba(196,120,112,0.6)";   // the inner corner, pink
        c.beginPath(); c.ellipse(X(T(-0.97)), Y(lidUp(-0.97) * 0.5 + lidLo(-0.97) * 0.5), 2.3, 1.8, 0, 0, TAU); c.fill();
      }
      // the brows - a soft shade of their hairs (the brows themselves are the hair's, over it)
      c.lineWidth = 1.4;
      let q = 77;
      const rr = () => ((q = (q * 16807) % 2147483647) / 2147483647);
      for (const s of [-1, 1]) for (let k = 0; k < 90; k++) {
        const t = rr(), x = 0.019 + 0.054 * t, yy = EY + 0.0262 + 0.0044 * Math.sin(Math.PI * Math.pow(t, 0.85)) - 0.0035 * t * t + (rr() - 0.5) * 0.009 * (1 - 0.55 * t);
        c.strokeStyle = "rgba(90,66,52," + (0.12 + rr() * 0.12).toFixed(2) + ")";
        const th = thX(s * x, yy);
        c.beginPath(); c.moveTo(X(th), Y(yy)); c.lineTo(X(th) + s * (4 + rr() * 4), Y(yy) - 1.5 - rr() * 1.5); c.stroke();
      }
      // the patches: plain skin, the ear (dark within, to skin), parchment
      const px = TU * W + 8;
      c.fillStyle = "rgb(" + BASE.join(",") + ")"; c.fillRect(px, Y(YT0 + 0.0 * (YT1 - YT0)) - 0.4 * Hh, W - px, 0.4 * Hh);
      const eg = c.createLinearGradient(0, (1 - UV_EAR[1]) * Hh, 0, (1 - UV_EAR1[1]) * Hh);
      eg.addColorStop(0, "rgb(92,52,40)"); eg.addColorStop(0.45, "rgb(160,104,82)"); eg.addColorStop(1, "rgb(196,136,108)");
      c.fillStyle = eg; c.fillRect(px, (1 - 0.62) * Hh, W - px, 0.24 * Hh);
      c.fillStyle = "#eadfc4"; c.fillRect(px, (1 - 0.96) * Hh, W - px, 0.2 * Hh);
      const ng = c.createLinearGradient(0, (1 - UV_NECK[1]) * Hh, 0, (1 - UV_NECK1[1]) * Hh);
      ng.addColorStop(0, "rgb(" + BASE.join(",") + ")"); ng.addColorStop(1, "rgb(" + BASE.map((v, k) => Math.round(v * [0.8, 0.76, 0.76][k])).join(",") + ")");
      c.fillStyle = ng; c.fillRect(px, (1 - 0.75) * Hh, W - px, 0.12 * Hh);
      return texOf(cv);
    })();
    // the eye's ball, as projected from before (its middle the eye's): the white (warm, shaded to its edges and under the upper lid),
    // the iris blue (the user's decision 173 b: as his picture) with its darker ring and lighter threads, the pupil
    const texEye = (() => {
      const W = 256, cv = canvas(W, W), c = cv.getContext("2d"), cx = W / 2, cy = W / 2 - 0.0012 / ER * (W / 2);
      c.fillStyle = "#ddd0bf"; c.fillRect(0, 0, W, W);
      let g = c.createRadialGradient(W / 2, W / 2, W * 0.18, W / 2, W / 2, W * 0.52);
      g.addColorStop(0, "rgba(120,80,64,0)"); g.addColorStop(1, "rgba(120,80,64,0.5)");
      c.fillStyle = g; c.fillRect(0, 0, W, W);
      g = c.createLinearGradient(0, W * 0.08, 0, W * 0.5);
      g.addColorStop(0, "rgba(60,36,24,0.55)"); g.addColorStop(1, "rgba(60,36,24,0)");
      c.fillStyle = g; c.fillRect(0, 0, W, W);
      const rx = (0.0079 / ERX) * (W / 2), ry = (0.0079 / ER) * (W / 2);
      c.fillStyle = "#1b3450"; c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU); c.fill();
      g = c.createRadialGradient(cx, cy, rx * 0.3, cx, cy, rx);
      g.addColorStop(0, "#8cbcdc"); g.addColorStop(0.6, "#5491c0"); g.addColorStop(1, "#2f6290");
      c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy, rx * 0.88, ry * 0.88, 0, 0, TAU); c.fill();
      c.lineWidth = 1;
      for (let k = 0; k < 60; k++) { const a = (k / 60) * TAU + Math.sin(k * 7.3) * 0.05; c.strokeStyle = k % 2 ? "rgba(196,226,244,0.35)" : "rgba(22,44,74,0.32)"; c.beginPath(); c.moveTo(cx + Math.cos(a) * rx * 0.42, cy + Math.sin(a) * ry * 0.42); c.lineTo(cx + Math.cos(a) * rx * 0.84, cy + Math.sin(a) * ry * 0.84); c.stroke(); }
      c.fillStyle = "#0b0605"; c.beginPath(); c.ellipse(cx, cy, rx * 0.36, ry * 0.36, 0, 0, TAU); c.fill();
      return texOf(cv);
    })();
    // the hairs (FACE_HAIR_E - the user: "השער יותר תקין, תנסה לעשות אותו יותר אמיתי"): strands in LOCKS - each lock a few strands
    // waving together; their tones uneven (one lock lighter, another darker - in a white beard white and grey); each strand begins and
    // ends at its own place, and has an alpha of its own: where the hair thins out to its edge (the vertices' alpha falls), the strands
    // drop out one by one (alphaTest) - the edge is of single hairs, not a line. Light grey: the material's colour gives it its own
    const texHairA = (() => {
      const W = 128, Hh = 512, cv = canvas(W, Hh), c = cv.getContext("2d"), img = c.createImageData(W, Hh), d = img.data;
      const hsh = (n) => { const h = Math.sin(n * 127.1 + 311.7) * 43758.5453; return h - Math.floor(h); };
      // a strand: its column, a little waving down its way (each lock of ~9 px its own wave); its alpha (where the hair thins only the
      // strands of high alpha are left), its tone (its lock's and its own), where it begins and where it ends. (Tables: the load time)
      const NI = Math.ceil(W * 0.85) + 2, NL = Math.ceil(W / 9) + 1, SIN = Array.from({ length: 64 }, (_, i) => Math.sin((i / 64) * TAU));
      const st = [], en = [], al0 = [], tn = [], ph = [], lt = [];
      for (let i = 0; i < NI; i++) { st.push(hsh(i * 3.1) * 0.11); en.push(0.84 + hsh(i * 7.7) * 0.16); al0.push(0.52 + 0.48 * hsh(i * 1.37)); tn.push(35 * hsh(i * 9.1)); ph.push((hsh(i * 2.3) * 64) | 0); }
      for (let k = 0; k < NL; k++) lt.push(150 + 70 * hsh(k * 5.3));
      for (let y = 0; y < Hh; y++) {
        const v = y / Hh, wave = [];
        for (let k = 0; k < NL; k++) wave.push(Math.sin(y * 0.017 + k * 1.9) * 2.6 + Math.sin(y * 0.041 + k * 0.45) * 0.8);
        for (let x = 0; x < W; x++) {
          const xs = (x + wave[(x / 9) | 0] + W) % W, id = (xs * 0.85) | 0, lock = (xs / 9) | 0, fr = xs * 0.85 - id, e = Math.abs(fr - 0.5) * 2, core = 1 - e * e * e;
          const s0 = st[id], e0 = en[id];
          let al = 0;
          if (v >= s0 && v <= e0) al = al0[id] * (0.92 + 0.08 * core) * sm(s0, s0 + 0.025, v) * sm(e0, e0 - 0.03, v);   // (at the full alpha of the vertices every strand is seen: no holes)
          const tone = (lt[lock] + tn[id]) * (0.88 + 0.12 * core) * (0.9 + 0.1 * SIN[(y * 0.09 * 64 / TAU + ph[id]) & 63 | 0]);
          const o = (y * W + x) * 4;
          d[o] = d[o + 1] = d[o + 2] = tone > 255 ? 255 : tone; d[o + 3] = Math.round((al > 1 ? 1 : al) * 255);
        }
      }
      c.putImageData(img, 0, 0);
      return texOf(cv, true);
    })();
    // ---------- the hair: the head's, the brows, the beard, the moustache
    const BT = 1.47;   // the beard's side edge (before the ear)
    const BODYZ = [[-0.395, 0.244, 0.156], [-0.33, 0.264, 0.146], [-0.285, 0.242, 0.128], [-0.245, 0.186, 0.11], [-0.205, 0.116, 0.09], [-0.175, 0.076, 0.076]];   // the kutonet before the chest (priest-kit.js BODY, in the head's frame)
    const bX = BODYZ.map((r) => [r[0], r[1]]), bZ = BODYZ.map((r) => [r[0], r[2]]);
    const bodyZ = (x, y) => {
      if (y > -0.175) return NECK[2] + NECK[3] * Math.sqrt(Math.max(0, 1 - (x / NECK[1]) * (x / NECK[1])));   // the neck
      const a = spl(bX, y), b = spl(bZ, y);
      return b * Math.sqrt(Math.max(0, 1 - (x / a) * (x / a)));
    };
    const YTOP = [[0, -0.0985], [0.12, -0.0975], [0.22, -0.0925], [0.3, -0.078], [0.45, -0.056], [0.65, -0.039], [0.95, -0.017], [1.15, -0.002], [1.3, 0.012], [1.47, 0.012], [1.55, -0.03], [1.77, -0.07]];
    const YJAW = [[0, -0.153], [0.4, -0.148], [0.8, -0.137], [1.1, -0.121], [1.3, -0.106], [1.47, -0.097], [1.77, -0.106]];
    // the hair's lower edge at th (with a beard; "none" - the side-locks to 0.0): the hairline over the forehead; before the ear full
    // side-locks, from the temple down to the beard; over the ear (reaching it, a little over its top); behind it, curving down to the
    // nape; its line uneven, as hair grows (w2: each figure's own)
    const hairEdge = (th, kind, w2 = 0) => {
      const a = Math.abs(th), ySide = kind === "none" ? 0.0 : -0.034;   // (with a beard the side-locks run down over its top: their thinning lies on the beard)
      return (a < 0.3 ? 0.086 : a < 0.8 ? lerp(0.086, 0.06, sm(0.3, 0.8, a)) : a < 1.25 ? lerp(0.06, ySide, sm(0.8, 1.25, a)) : a < 1.49 ? ySide : a < 1.55 ? lerp(ySide, 0.024, sm(1.49, 1.55, a))
        : a < 1.72 ? 0.024 : a < 2.14 ? lerp(0.024, -0.1, Math.pow(sm(1.72, 2.14, a), 0.75)) : lerp(-0.1, -0.108, sm(2.14, 2.7, a))) + 0.0032 * Math.sin(a * 13 + w2) + 0.002 * Math.sin(a * 31 + 2 * w2);
    };
    const yStrap = (th) => -0.056 + (0.1 - 0.04 * 0.45 + 0.056) * Math.pow(0.5 + 0.5 * Math.cos(th), 0.35);   // the tefillin's strap (priest-kit.js tefRing)
    // the hair's thickness over the skin: full at the sides and behind, below the strap and the hat; thin over the crown (under the hats
    // and the kippot), over the forehead, and just over the ear (its rim seen)
    const hairBulk = (th, y) => {
      const a = Math.abs(th), yS = yStrap(th), overEar = sm(1.45, 1.55, a) * sm(1.95, 1.74, a) * sm(0.045, 0.03, y);
      return lerp(0.0046, 0.0105, sm(0.9, 1.5, a) * sm(yS - 0.006, yS - 0.022, y)) * (1 - 0.6 * sm(0.09, 0.13, y)) * (1 - 0.55 * overEar);
    };
    // the hair's outer face at (th, y) at its fullest (its outer layer included), without the thin way it leaves for the strap: what lies
    // on the hair (the tefillin's strap) may be laid at hairR + its own half thickness. For priest-kit.js / strap.js (agent A2)
    const hairR = (th, y) => (y < hairEdge(th) - 0.006 ? skinR(th, y, "face", true) : skinR(th, y, "face", true) + 0.0014 + hairBulk(th, y) * 1.2 + 0.0042);
    const nz = (a, b) => Math.sin(a * 1.7 + Math.sin(b * 2.3 + a * 0.5) * 2.1) * Math.cos(b * 1.3 - a * 0.4);   // a smooth noise, -1..1
    const hairCache = {};
    // a lock's ridge by the way round (u, in locks) and down (v): the locks flow down, a little waving, each with a tone of its own
    const lockAt = (u, v, w2, wave) => { const L = u + wave * Math.sin(v * 5.3 + u * 0.7 + w2), f = L - Math.floor(L), k = Math.floor(L), h = Math.sin(k * 91.7 + w2 * 13.1) * 43758.5453;
      return [Math.pow(0.5 + 0.5 * Math.cos(TAU * f), 1.5), h - Math.floor(h)]; };
    const hairGeo = (o) => {
      const hi = o.d !== "lo", kind = o.beard || "full", len = o.len == null ? 0.2 : o.len, w2 = o.w2 || 0;
      const key = [hi ? "hi" : "lo", kind, len.toFixed(3), w2.toFixed(2)].join("|");
      if (hairCache[key]) return hairCache[key];
      const parts = [], SH = hi ? 2 : 1;   // near: two layers - the hair's body, and over it its locks (alpha), standing a little out
      // the hair of the head: from the crown down to its edge (hairEdge). The user, via the coordinator: "עוד קצת שער מסביב האוזן — לא
      // הרבה, אבל שלא יהיה מוקף ראש" (Vayikra 19:27 "לא תקפו פאת ראשכם"; as his picture of the old faces - the hair round the ear and behind
      // it); then "יותר אמיתי": its locks flowing down from the crown, the side-locks down into the beard, standing out a little in a
      // second layer, thinning out at its edge to single hairs (no hard line)
      // its rows: from the crown down to over the strap; five along the strap's way (there it is thin, under the strap); below it, full,
      // down to its edge (where the edge is above the strap - over the forehead - the rows stop at the edge)
      const nsc = hi ? 56 : 18, NA = hi ? 5 : 2, NB = hi ? 8 : 2, SB = [0.011, 0.0055, 0, -0.0055, -0.011], nsr = NA + SB.length - 1 + NB;
      for (let sh = 0; sh < SH; sh++) parts.push(grid(nsc, nsr, (i, j) => {
        const th = -Math.PI + (i / nsc) * TAU, a = Math.abs(th), yS = yStrap(th), yE = hairEdge(th, kind, w2);
        let y, sv, under = false;
        if (j <= NA) { sv = j / NA * 0.4; y = lerp(0.1595, yS + SB[0], Math.pow(j / NA, 0.9)); }
        else if (j < NA + SB.length) { sv = 0.4 + (j - NA) / (SB.length - 1) * 0.1; y = yS + SB[j - NA]; under = true; }
        else { const t = (j - NA - SB.length + 1) / NB; sv = 0.5 + 0.5 * t; y = lerp(yS + SB[SB.length - 1], yE, Math.pow(t, 0.6)); }
        y = Math.max(y, yE);
        const behind = sm(1.68, 1.85, a) * sm(2.4, 2.1, a), [lk, tone] = lockAt(th * 3.6, sv, w2 + sh, 0.35), fade = sm(0.6 - 0.22 * behind, 1, sv), low = sm(yS - 0.006, yS - 0.022, y);   // (behind the ear the hair thins over a longer way down)   // low: below the strap (the outer layer only there - under the hats nothing stands out)
        const th2 = under ? 0.0024 : (0.0014 + hairBulk(th, y) * (0.7 + 0.5 * lk) + sh * (0.0022 + 0.0024 * lk) * low) * (1 - 0.88 * fade);   // thinning out to its edge
        const R = j === 0 ? 0 : skinR(th, y, "face", true) + th2, p = pt(th, R, y);
        const fz = clamp(fade + 0.3 * nz(th * 11 + w2, sv * 5 + sh) * sm(0.45, 0.8, sv), 0, 1);   // the edge's thinning, uneven
        return [p[0], p[1], p[2], th * 2.1 + sh * 0.37, 0.04 + 0.9 * sv, (0.7 + 0.3 * lk) * (0.86 + 0.28 * tone) - 0.05 * sv, (1 - 0.62 * fz) * (sh ? 0.82 * low + 0.18 * low * low : 1)];
      }, { closed: true, pole: true, alpha: true, flip: true }));
      // the brows: thick, from over the eye's inner corner rising and thinning outward past its outer corner; their hairs along them, their
      // edges feathered
      for (const s of [-1, 1]) {
        const ns = hi ? 14 : 4, nw = hi ? 4 : 1;
        parts.push(grid(ns, nw, (i, j) => {
          const t = i / ns, w = j / nw, x = 0.019 + 0.054 * t, ym = EY + 0.0262 + 0.0044 * Math.sin(Math.PI * Math.pow(t, 0.85)) - 0.0035 * t * t;
          const hh = 0.0052 * (1 - 0.6 * Math.pow(t, 1.3)) + 0.0006, y = ym + (w - 0.5) * 2 * hh + 0.0012 * Math.sin(t * 23 + s) * Math.abs(w - 0.5), off = 0.0007 + 0.0024 * Math.pow(Math.sin(Math.PI * w), 0.7) * (1 - 0.35 * t);
          const th = s * Math.asin(clamp(x / skinR(0, y, "face", true), -1, 1)), p = skinPoint(th, y, off);
          const hs = 0.5 + 0.5 * Math.sin(t * 40 + w * 9 + s);   // the hairs' tufts
          return [p[0], p[1], p[2], w * 0.9 + t * 0.35, 0.06 + 0.88 * t, 0.68 + 0.22 * Math.sin(Math.PI * w) + 0.1 * hs, 1 - 0.42 * Math.pow(Math.abs(w - 0.5) * 2, 2)];
        }, { flip: s < 0, alpha: true }));
      }
      if (kind !== "none") {
        // the beard: one sheet from the side-lock to the side-lock round the chin, wrapping the cheeks and the jaw. Its top edge - from
        // before the ear down the cheek to the mouth's corner and under the lower lip (uneven); its side edge before the ear (the side-lock,
        // joined to the head's hair) and, lower, round behind the jaw's corner under the ear; its top and its sides thin out into single
        // hairs (no edge); on the face as far as the jaw's under side, its thickness growing; from there it hangs - its sides down by the
        // neck, its middle forward over the chest - coming round below to its ends in points of locks; locks all along it, waving, each
        // with a tone of its own; near, a second layer of its locks over it
        const short = kind === "short", L = short ? 0.028 : len, NL = short ? 15 : 11;
        const nu = hi ? 44 : 14, na = hi ? 10 : 3, nh = short ? (hi ? 3 : 1) : hi ? 12 : 4;
        const lockF = (q, v) => 0.5 + 0.5 * Math.cos(TAU * (q * NL * 0.5 + 0.3 * Math.sin(v * 6.0 + w2 + q * 1.3) + 0.3 * v * q + 0.25));
        const BTr = (t) => BT + 0.3 * sm(0.45, 1, t);   // its side edge by the way down the face
        for (let sh = 0; sh < SH; sh++) {
          const J = [], J1 = [];
          parts.push(grid(nu, na + nh, (i, j) => {
            const q = lerp(-1, 1, i / nu), aq = Math.abs(q), vv = j / (na + nh), lf = lockF(q, vv), edge = sm(0.8, 1, aq), [lk, tone] = lockAt(q * NL * 0.9 + 0.5, vv, w2 + 3 * sh, 0.4);
            const out = sh * (0.0026 + 0.0026 * lk);   // the outer layer, out from the body
            let p, v;
            if (j <= na) {
              // on the face: from its top edge down to the jaw's edge (not under it), lifting off the skin more and more from the middle of
              // the cheek - so that below the jaw it falls, full, rather than lying on the jaw's under side and folding there
              const t = j / na, th = q * BTr(t), a = Math.abs(th), yEnd = lerp(-0.141, spl(YJAW, a) + 0.01, sm(0.0, 1.0, a / 1.2));
              const y = lerp(spl(YTOP, a) + 0.0022 * Math.sin(a * 19 + w2) * (1 - t), yEnd, Math.pow(t, 0.9));
              const lift = (short ? 0.0045 : lerp(0.019, 0.012, sm(0.3, 1.3, a))) * Math.pow(sm(0.15, 1, t), 1.3);
              const th2 = (0.0011 + lift + (short ? 0.0012 : 0.0028) * (lf - 0.45) * sm(0, 0.35, t) + out * sm(0.45, 0.8, t)) * (1 - 0.8 * edge) + 0.0005;
              p = skinPoint(th, y, th2);
              if (j === na - 1) J1[i] = p;
              if (j === na) J[i] = p;
              v = 0.09 + t * (short ? 0.53 : 0.26);
            } else {
              // hanging: on from where the face's part ends, in the same direction there (no corner), bending gradually down to its end - a
              // round of the beard below: its middle before the chest, lowest, its sides higher and back by the neck (no tail behind it)
              const k = (j - na) / nh, P0 = J[i], ps = q * HP, cs = Math.cos(ps), sn = Math.sin(ps);
              const tip = (short ? 0.006 : 0.024) * Math.pow(lockF(q, 1), 3) * (1 - 0.5 * q * q);
              const B = short ? [P0[0] * 0.96, P0[1] - L * (1 - 0.3 * q * q), P0[2] * 0.97] : [0.09 * sn, -0.153 - L * (1 - 0.55 * q * q) - tip, 0.03 + 0.125 * cs];
              const T = [P0[0] - J1[i][0], P0[1] - J1[i][1], P0[2] - J1[i][2]], tl = Math.hypot(T[0], T[1], T[2]) || 1;
              const D = Math.hypot(B[0] - P0[0], B[1] - P0[1], B[2] - P0[2]), a1 = 0.38 * D, a2 = 0.3 * D;
              const C1 = [P0[0] + T[0] / tl * a1, P0[1] + T[1] / tl * a1, P0[2] + T[2] / tl * a1];
              const C2 = [B[0], B[1] + a2, B[2] + (short ? 0 : 0.02 * cs)];   // into its end from above (and the middle a little full)
              const u = k, w0 = (1 - u) * (1 - u) * (1 - u), w1 = 3 * u * (1 - u) * (1 - u), w2b = 3 * u * u * (1 - u), w3 = u * u * u;
              let x = w0 * P0[0] + w1 * C1[0] + w2b * C2[0] + w3 * B[0], y = w0 * P0[1] + w1 * C1[1] + w2b * C2[1] + w3 * B[1], z = w0 * P0[2] + w1 * C1[2] + w2b * C2[2] + w3 * B[2];
              x += (short ? 0 : 0.003) * Math.sin(k * 9 + q * 7 + w2) * k;
              const thick = (short ? 0.0014 : 0.008) * (lf - 0.45) * (1 - 0.6 * edge) * sm(0, 0.3, k) + out * (1 - 0.6 * edge) * (1 - 0.7 * k);
              x += thick * sn; z += thick * cs;
              z = Math.max(z, bodyZ(x, y) + 0.012);
              p = [x, y, z];
              v = (short ? 0.62 : 0.35) + k * (short ? 0.34 : 0.61);
            }
            const sideF = sm(0.84, 1, aq + 0.05 * nz(vv * 9 + w2, q * 3)), topF = j <= na ? sm(0.2, 0, j / na + 0.06 * nz(q * 14 + w2, sh)) : 0;
            const al = (1 - 0.6 * sideF) * (1 - 0.6 * topF) * (sh ? 0.8 * (j <= na ? sm(0.45, 0.8, j / na) : 1) : 1);   // its side edges and its top thin out into single hairs, unevenly
            return [p[0], p[1], p[2], q * 2.6 + 0.5 + sh * 0.41, v, (0.56 + 0.44 * Math.pow(lf, 0.7)) * (0.84 + 0.3 * tone) * (1 - 0.12 * edge), al];
          }, { alpha: true, flip: true }));
        }
        // the moustache: from under the nose over the upper lip, a little over its edge; parted in the middle, its sides down past the
        // mouth's corners into the beard; its hairs going down and out; near, two layers
        const MT = [[0, -0.0648], [0.01, -0.0636], [0.02, -0.0642], [0.03, -0.0685], [0.04, -0.0755], [0.05, -0.083]];
        const MB = [[0, -0.0852], [0.012, -0.0858], [0.022, -0.0895], [0.032, -0.0975], [0.042, -0.107], [0.05, -0.116]];
        const mu = hi ? 18 : 6, mv = hi ? 5 : 2;
        for (let sh = 0; sh < SH; sh++) parts.push(grid(mu, mv, (i, j) => {
          const xq = lerp(-1, 1, i / mu), x = xq * 0.05, ax = Math.abs(x), v = j / mv, y = lerp(spl(MT, ax), spl(MB, ax), v);
          const lf = 0.5 + 0.5 * Math.cos(TAU * (xq * 3.5 + 0.25 * v * Math.sign(xq) + 0.2 + sh * 0.3));
          const th2 = ((short ? 0.0012 : 0.0018) + (short ? 0.0026 : 0.0072) * Math.sin(Math.PI * Math.min(1, v * 1.1)) * (1 - 0.3 * (ax / 0.05)) + 0.0014 * (lf - 0.5)) * (1 - 0.3 * gs(x, 0, 0.0035, 1)) + 0.001 + sh * 0.0018 * lf * Math.sin(Math.PI * Math.min(1, v * 1.2));
          const th = Math.asin(clamp(x / skinR(0, y, "face", true), -1, 1)), p = skinPoint(th, y, th2);
          p[2] += 0.003 * v * v; p[1] -= 0.0016 * v * v;
          return [p[0], p[1], p[2], xq * 1.3 + Math.sign(xq) * v * 0.35 + sh * 0.29, 0.1 + 0.86 * v, 0.72 + 0.28 * lf, (1 - 0.4 * sm(0.75, 1, Math.abs(xq)) - 0.25 * sm(0.25, 0, v)) * (sh ? 0.8 : 1)];
        }, { alpha: true, flip: true }));
      }
      return (hairCache[key] = mergeGeometries(parts));
    };
    // the hair's materials for a material given (its colour, its vertex colours): "lo" - standard, the strands' texture with its alpha;
    // "hi" (near only) - with a soft sheen along the strands (anisotropy: the highlight runs across the hairs, as on hair). Made once
    // for each material given
    const HM = new WeakMap();
    const hairMats = (m) => {
      let r = HM.get(m);
      if (r) return r;
      const lo = m.clone();
      Object.assign(lo, { map: texHairA, alphaTest: 0.42, bumpMap: texHairA, bumpScale: 0.6, side: DoubleSide, roughness: Math.min(lo.roughness, 0.62) });   // HAIR_SHINE_441: the far level a little glossier too
      const hi = new MeshPhysicalMaterial({ color: m.color.clone(), vertexColors: m.vertexColors, map: texHairA, alphaTest: 0.42, bumpMap: texHairA, bumpScale: 0.8,
        side: DoubleSide, roughness: 0.36, metalness: 0, specularIntensity: 1.0, specularColor: m.color.clone().lerp(new Color(0xffffff), 0.35), anisotropy: 0.85, sheen: 0.6, sheenRoughness: 0.35, sheenColor: m.color.clone().lerp(new Color(0xffffff), 0.5), anisotropyRotation: Math.PI / 2 });   // HAIR_SHINE_441 (the user 26.11.2026: "תוסיף ברק"): a stronger sheen along the strands (0.72 / 0.24 / 0.2 / 0.6 until now), on all the hair   // (the sheen of the hair's own colour: on dark hair, dim)
      // every layer's outer side is its front: the inner side (seen where the beard turns back to the neck) darker, as in its shade
      const inner = (sh) => { sh.fragmentShader = sh.fragmentShader.replace("#include <opaque_fragment>", "#include <opaque_fragment>\n\tif (!gl_FrontFacing) gl_FragColor.rgb *= 0.45;"); };
      lo.onBeforeCompile = hi.onBeforeCompile = inner;
      r = { lo, hi };
      HM.set(m, r);
      return r;
    };
    const headCache = {};
    let eyesG = null;
    // (head(), eyes() and hair() are made once and given to all - a figure that changes one (moves it) takes a clone)
    return (tm_face.k = {
      HR, EX, EY, ER, ERX, EZ, TE, WT, skinR, skinPoint, Rbase, head: (d) => headCache[d] || (headCache[d] = headGeo(d)), eyes: () => eyesG || (eyesG = eyesGeo()), hair: hairGeo,
      tex: { skin: texSkin, eye: texEye, hairA: texHairA }, UV_SKIN, UV_PARCH, uvOf, hairR, hairEdge, hairMats
    });
  }
  // ===== FACE_E END
