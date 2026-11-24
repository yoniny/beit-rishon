    // ===== HAND_A2 (fix-a2; the user, 22.11.2026 14:46, via the coordinator: "הידיים נראות מזעזע! אין קשר ביניהם לבין ידיים") and
    // HAND_SDF_A2 (the coordinator on the draft of 52: "המראה עדיין של יד בובה או מנקן מעץ" - seams, beads at the knuckles, a paddle
    // for a palm, cylinders for fingers, a blob for the ball of the thumb): A HAND THAT LOOKS LIKE A HAND, one construction for both
    // houses (shared/frag/hand.js, by an include line "hand"): the priests' kit, the high priest's, the Levites' and the crowds'.
    // ONE BODY WITHOUT SEAMS: a field of distance (SDF) of rounded cones (the bones with their flesh - each finger's three joints, the
    // thumb's three, the four bones of the palm), ellipsoids (the ball of the thumb, the heel of the hand by the little finger, the pad
    // under the fingers) and a rounded slab (the palm), joined softly (a smooth minimum, k 0.003 - 0.014): the palm's parts into one,
    // each finger into the palm (but not into its neighbours - between them a crease), the thumb's first bone deep into the ball of the
    // thumb. Its surface found once per pose (surface nets on a grid, each point then drawn onto the field's zero), its normals the
    // field's own (so no faces are seen), kept (cache). The palm 0.55 of the hand's length (wrist to the middle finger's tip) and the
    // fingers 0.45; the palm a little hollow, its back rising to the knuckles; the knuckles soft (a joint a little broader than the
    // bone before and after it); the fingers narrowing to their tips, a little flat beneath, soft creases within at their joints, the
    // tip round, a thin nail on its back; the thumb low (its first joint by the wrist), 30 - 40 degrees from the first finger, its root
    // in the ball of the thumb. Vertex colours (a factor on the material, the face's own - priest-kit.js mHand): the shade between the
    // fingers and in the palm's hollow (from the field), the nails lighter and pinker, the palm a little lighter, the knuckles and the
    // creases a little darker. uv: the face's texture's plain skin (face.js UV_SKIN 0.9, 0.2 - in the old texture too it is plain).
    // Poses: "rest" (a little bent), "open" (the blessing - straight, a little apart), "flat" (the palm on the foot - kiddush), "grip"
    // (closed round a handle) and "point" (the first finger out - "הצביעו"). low: the crowds' (a coarser grid, the fingers held
    // together, a little fuller - from a few amot they are not told apart; 1,600 triangles); mid: the same hand in fewer faces (3,000 - the
    // figures of the demonstration more than 4.5 amot from the eye; near 7,500).
    //   tm_hand(o) -> { geo, sk }: o = { sd (+1 the left hand, -1 the right), pose, low, mid }. Its frame (kit units): the wrist joint at 0,
    //   the fingers down (-y), the palm toward -z (its back +z), the thumb at -sd x - before it is turned to the body (priest-kit.js
    //   handRaw). sk: { PL (the palm's length), PM (its middle down from the wrist), grip (the middle of the closed fingers' ring),
    //   fingers[i] = { j: [the joints, Vector3 x4 - the knuckle .. the tip's centre], r: [radii x3], ax (the bending axis) } (0 the
    //   first finger .. 3 the little), thumb: [Vector3 x4], back(x, y) - the back of the hand's surface (z), grip / gripAx / ring (a closed
    //   pose: the ring's middle, the handle's way through it, its radius) }.
    // MODEL CHOICES (no source gives a hand's measures; after the proportions of a grown man's hand; kit units, x 1.4 = amot): the hand
    //   0.231 long (wrist crease to the middle finger's tip - about the face, chin to hairline), the palm 0.55 of it (0.124 to the fingers'
    //   crease; the knuckles' joints at 0.116) and the fingers 0.45; the palm 0.087 broad at the knuckles, 0.061 at the wrist, 0.03 thick;
    //   the fingers from the knuckle's joint - the first 0.104, the middle 0.115, the ring 0.110, the little 0.088 - their three bones
    //   about 0.47 / 0.29 / 0.24 of it, 0.024 broad at the knuckle narrowing to 0.017 at the tip, 0.86 as deep as broad; the knuckles'
    //   line arched (the middle the lowest, the little 0.012 higher); the thumb from 0.018 under the wrist, its bones 0.055 / 0.038 /
    //   0.026, 0.028 broad, its first bone 32 degrees from the first finger and its tip by the middle of the first finger's first bone.
    //   Poses: rest - the fingers a little bent (the knuckle 0.14 - 0.32 rad, the middle joint 0.30 - 0.50, the last 0.17 - 0.27, more
    //   toward the little finger), together; open - straight, spread 0.15 / 0.03 / -0.09 / -0.21 rad; flat - straight, together; grip -
    //   round a handle 0.02 in radius (0.028 amah), aslant 12.4 degrees across the palm against the pads under the fingers, the thumb
    //   round its other side onto the middle and the first fingers; fist - round a rod 0.006 in radius, the thumb across the first and the middle
    //   fingers' middle bones; point - the fist with the first finger out, the thumb across the middle and the ring fingers.
    const tm_hand = (() => {
      const cache = {}, SK = {};
      const PL = 0.124;   // the palm: the wrist to the fingers' crease (the knuckles' joints at 0.116); the middle finger's tip at 0.231
      // the fingers, the thumb at +x (the right hand - the left is its mirror): the knuckle's joint, the three bones' lengths (the last
      // to its tip's centre), the radius at the knuckle, the two joints and the tip
      const FK = [[0.0355, -0.1115, -0.0015], [0.0115, -0.116, 0.0005], [-0.0122, -0.113, -0.001], [-0.0335, -0.104, -0.005]];
      const FLEN = [[0.049, 0.029, 0.0185], [0.054, 0.033, 0.0195], [0.051, 0.032, 0.019], [0.04, 0.024, 0.017]];
      const FRAD = [[0.0118, 0.0106, 0.0094, 0.0084], [0.0122, 0.011, 0.0097, 0.0088], [0.0114, 0.0102, 0.0091, 0.0084], [0.0099, 0.0089, 0.0081, 0.0075]];
      // the thumb: its root (the joint of its first bone, low by the wrist), the bones' lengths, the radii
      const TC = [0.022, -0.018, -0.01], TLEN = [0.055, 0.038, 0.026], TRAD = [0.0145, 0.0138, 0.0128, 0.0108];
      // a pose: per finger [the knuckle's bend, the middle joint's, the last's] and its spread toward the thumb (radians); the thumb's
      // three bones' ways, and the way its nail looks
      const POSE = {
        // rest: the thumb's first bone 32 degrees from the first finger, its two joints back toward the hand - its tip by the middle
        // of the first finger's first joint
        rest: { f: [[0.14, 0.3, 0.17], [0.2, 0.38, 0.21], [0.26, 0.44, 0.25], [0.32, 0.5, 0.27]], s: [0.035, 0.0, -0.03, -0.075],
          t: [[0.48, -0.78, -0.4], [0.15, -0.95, -0.27], [-0.12, -0.97, -0.2]], tn: [0.8, 0.05, 0.6] },
        open: { f: [[0.04, 0.06, 0.04], [0.04, 0.06, 0.04], [0.04, 0.06, 0.04], [0.04, 0.06, 0.04]], s: [0.15, 0.03, -0.09, -0.21],
          t: [[0.8, -0.56, -0.18], [0.7, -0.7, -0.12], [0.62, -0.77, -0.08]], tn: [0.45, 0.4, 0.8] },
        flat: { f: [[0.02, 0.03, 0.02], [0.02, 0.03, 0.02], [0.02, 0.03, 0.02], [0.02, 0.03, 0.02]], s: [0.05, 0.01, -0.04, -0.09],
          t: [[0.72, -0.66, -0.2], [0.55, -0.82, -0.12], [0.45, -0.88, -0.08]], tn: [0.6, 0.3, 0.75] },
        // grip: round a handle of radius 0.02 (RH) across the palm, aslant (GRIP_AX), against the pads under the fingers - each finger's
        // joints found so that it lies on the handle, not in it and not off it (by a search); the thumb round the handle's other side,
        // its last joint on the middle finger's middle bone, by the first finger's
        grip: { f: [[1.2, 1.25, 0.6], [1.5, 1.1, 0.9], [1.55, 1.0, 0.9], [1.45, 0.8, 0.7]], s: [0.04, 0.0, -0.03, -0.07],
          t: [[0.221, -0.747, -0.627], [-0.015, -0.294, -0.956], [-0.403, -0.862, -0.307]], tn: [0.44, 0.61, -0.65], ring: [0, -0.085, -0.0385], rh: 0.02 },
        // fist: closed (round a thin rod - the mizrak's - radius 0.006), the thumb across the first and the middle fingers' middle bones
        fist: { f: [[1.15, 1.85, 1.15], [1.55, 1.85, 1.2], [1.55, 1.85, 1.15], [1.55, 1.8, 0.95]], s: [0.03, 0.0, -0.03, -0.06],
          t: [[0.31, -0.887, -0.342], [0.098, -0.494, -0.864], [-0.945, -0.165, -0.284]], tn: [0.2, 0.15, -0.96], ring: [0, -0.0975, -0.0245], rh: 0.006 },
        // gripW: on a thick staff (the ark's, 0.11 amah in radius - 0.0786 here): the palm against it under the knuckles, the fingers
        // lying on it round its far side (by the same search), the thumb along it on its near side
        gripW: { f: [[0.3, 0.4, 0.3], [0.45, 0.45, 0.2], [0.45, 0.45, 0.2], [0.3, 0.4, 0.25]], s: [0.04, 0.0, -0.03, -0.07],
          t: [[0.623, -0.685, -0.379], [0.933, 0.096, -0.346], [0.693, 0.204, -0.691]], tn: [0.19, 0.86, 0.47], ring: [0, -0.1075, -0.0971], rh: 0.0786 },
        // bless (BIRKAT_V_A2 - the priestly blessing, Shulchan Aruch OC 128:12, 382:1024: "ופושטים ידיהם וחולקים אצבעותיהם ומכוונים לעשות
        // ה' אוירים בין ב' אצבעות לב' אצבעות אויר אחד ובין אצבע לגודל ובין גודל לגודל"): the fingers straight, the first and the middle
        // together and the ring and the little together, a space between the two pairs (as a V); the thumb straight and apart from the
        // first finger. (The two hands side by side, the thumbs near each other - the fifth space: 55-tamid.js)
        bless: { f: [[0.02, 0.02, 0.01], [0.02, 0.02, 0.01], [0.02, 0.02, 0.01], [0.02, 0.02, 0.01]], s: [0.15, 0.15, -0.15, -0.15],
          t: [[0.78, -0.6, -0.12], [0.72, -0.68, -0.08], [0.66, -0.75, -0.05]], tn: [0.3, 0.2, 0.93] },
        // point: the fist with the first finger out, the thumb across the middle and the ring fingers' middle bones
        point: { f: [[0.04, 0.06, 0.04], [1.55, 1.85, 1.2], [1.55, 1.85, 1.15], [1.55, 1.8, 0.95]], s: [0.03, 0.0, -0.03, -0.06],
          t: [[0.386, -0.465, -0.797], [-0.641, -0.736, -0.218], [-0.983, -0.18, -0.042]], tn: [0.15, 0.1, -0.98] }
      };
      const GRIP_AX = [0.9766, -0.2149, 0];   // the handle's way across the palm (from the little finger's side, nearer the wrist, to the first finger's)
      const clamp = (v, a, b) => (v < a ? a : v > b ? b : v), sstep = (a, b, v) => { const u = clamp((v - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
      const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
      const nrm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
      const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const add = (a, b, s) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
      const rotA = (v, ax, an) => {   // v about the unit axis ax by an (Rodrigues)
        const c = Math.cos(an), s = Math.sin(an), k = dot(ax, v), x = cross(ax, v);
        return [v[0] * c + x[0] * s + ax[0] * k * (1 - c), v[1] * c + x[1] * s + ax[1] * k * (1 - c), v[2] * c + x[2] * s + ax[2] * k * (1 - c)];
      };
      // ---------- the parts. seg: a bone with its flesh from a to b, its radius ra .. rb (a little narrower in its middle - the joints
      // the broader), across it (side) round, and toward its back (n) and its front a little flatter (fd, fp); a crease within at its
      // ends (ce: [at a, at b]); a nail (on the last bones)
      const seg = (a, b, ra, rb, side, n, fd, fp, o = {}) => {
        const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], len = Math.hypot(d[0], d[1], d[2]), u = [d[0] / len, d[1] / len, d[2] / len];
        let s = add(side, u, -dot(side, u)); s = nrm(s);
        const nn = nrm(cross(u, s)), sg = dot(nn, n) < 0 ? -1 : 1, N = [nn[0] * sg, nn[1] * sg, nn[2] * sg];
        const R = Math.max(ra, rb) + 0.002;
        return { a, u, len, ra, rb, s, n: N, fd, fp, waist: o.waist == null ? 0.0005 : o.waist, ce: o.ce || [0, 0], nail: !!o.nail,
          lo: [Math.min(a[0], b[0]) - R, Math.min(a[1], b[1]) - R, Math.min(a[2], b[2]) - R], hi: [Math.max(a[0], b[0]) + R, Math.max(a[1], b[1]) + R, Math.max(a[2], b[2]) + R] };
      };
      const segD = (g, x, y, z, out) => {
        const qx = x - g.a[0], qy = y - g.a[1], qz = z - g.a[2], tl = clamp(qx * g.u[0] + qy * g.u[1] + qz * g.u[2], 0, g.len), t = tl / g.len;
        const cx = qx - g.u[0] * tl, cy = qy - g.u[1] * tl, cz = qz - g.u[2] * tl;
        const ca = cx * g.u[0] + cy * g.u[1] + cz * g.u[2], cs = cx * g.s[0] + cy * g.s[1] + cz * g.s[2], cn = cx * g.n[0] + cy * g.n[1] + cz * g.n[2];
        const r = g.ra + (g.rb - g.ra) * t - g.waist * 4 * t * (1 - t), rn = r * (cn > 0 ? g.fd : g.fp);
        const ea = ca / r, es = cs / r, en = cn / rn, k0 = Math.sqrt(ea * ea + es * es + en * en), k1 = Math.sqrt((ea * ea + es * es) / (r * r) + (en * en) / (rn * rn));
        let dd = k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -rn;
        const pal = cn < 0 ? -cn / (Math.hypot(cs, cn) + 1e-9) : 0;
        if (g.ce[0] && tl < 0.005) dd += 0.0006 * Math.exp(-((tl / 0.0017) ** 2)) * pal;   // the soft creases within, at the joints
        if (g.ce[1] && g.len - tl < 0.005) dd += 0.0006 * Math.exp(-(((g.len - tl) / 0.0017) ** 2)) * pal;
        let nail = 0;
        if (g.nail && cn > 0) {   // the nail: a thin plate on the last bone's back, from a third of it to the tip
          const along = tl + Math.max(0, ca);
          nail = sstep(0.3 * g.len, 0.42 * g.len, along) * (1 - sstep(g.len + 0.55 * r, g.len + 0.85 * r, along)) * (1 - sstep(0.52 * r, 0.7 * r, Math.abs(cs)));
          dd -= 0.0004 * nail;
        }
        if (out) { out.t = t; out.tl = tl; out.cs = cs; out.cn = cn; out.r = r; out.nail = nail; out.ca = ca; }
        return dd;
      };
      // ell: an ellipsoid at c with its axes (unit u, v, w) and radii
      const ell = (c, u, v, w, ru, rv, rw) => ({ c, u, v, w, ru, rv, rw, R: Math.max(ru, rv, rw) + 0.002 });
      const ellD = (e, x, y, z) => {
        const qx = x - e.c[0], qy = y - e.c[1], qz = z - e.c[2];
        const a = (qx * e.u[0] + qy * e.u[1] + qz * e.u[2]) / e.ru, b = (qx * e.v[0] + qy * e.v[1] + qz * e.v[2]) / e.rv, c = (qx * e.w[0] + qy * e.w[1] + qz * e.w[2]) / e.rw;
        const k0 = Math.sqrt(a * a + b * b + c * c), k1 = Math.sqrt((a * a) / (e.ru * e.ru) + (b * b) / (e.rv * e.rv) + (c * c) / (e.rw * e.rw));
        return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -Math.min(e.ru, e.rv, e.rw);
      };
      const boxD = (lo, hi, x, y, z) => {   // the distance to a box (0 within) - a part cannot be nearer than its box
        const dx = Math.max(lo[0] - x, 0, x - hi[0]), dy = Math.max(lo[1] - y, 0, y - hi[1]), dz = Math.max(lo[2] - z, 0, z - hi[2]);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      };
      // the palm's slab: a rounded box, narrower to the wrist, its two long edges a little lower toward the palm (the hand's arch -
      // the back round, the palm hollow), its back rising to the knuckles
      const slabD = (x, y, z) => {
        const s = sstep(-0.006, -0.108, y), hx = 0.021 + 0.013 * s, xc = 0.0008, zc = -0.0034 + 0.0016 * s, xr = (x - xc) / 0.04;
        const yw = y - 0.0075 * xr * xr * sstep(-0.06, -0.1, y);   // (the end under the fingers arched: the middle lowest)
        const hb = Math.exp(-(((x - 0.002) / 0.024) ** 2) - (((y + 0.07) / 0.032) ** 2)) * sstep(zc + 0.004, zc - 0.004, z);   // the hollow
        const qx = Math.abs(x - xc) - hx, qy = Math.abs(yw + 0.057) - 0.051, qz = Math.abs(z - zc + 0.0052 * xr * xr - 0.0024 * hb) - (0.0052 + 0.0008 * s);
        const ox = Math.max(qx, 0), oy = Math.max(qy, 0), oz = Math.max(qz, 0);
        return Math.sqrt(ox * ox + oy * oy + oz * oz) + Math.min(Math.max(qx, qy, qz), 0) - 0.0095;
      };
      // ---------- one pose: its parts, its field, its skeleton
      const parts = (pose, low) => {
        const P = POSE[pose] || POSE.rest;
        const Z = [0, 0, 1], X = [1, 0, 0];
        // the palm: the wrist going up into the sleeve; the four bones of the palm, from by the wrist to the knuckles (their heads
        // the knuckles, a little out on the back); the ball of the thumb, along the thumb's first bone; the heel by the little finger;
        // the pad under the fingers; and a hollow in its middle
        const wrist = seg([0, 0.05, -0.003], [0.0005, -0.026, -0.004], 0.027, 0.0245, X, Z, 0.62, 0.62, { waist: 0 });
        const MB = [[0.016, -0.022, 0.0005], [0.005, -0.018, 0.001], [-0.008, -0.02, 0.0005], [-0.019, -0.028, -0.001]];
        const metas = FK.map((k, i) => seg(MB[i], [k[0], k[1] + 0.0035, k[2] + 0.0036], 0.0062, 0.0091 - 0.0004 * (i === 3), X, Z, 1, 1, { waist: 0 }));
        const tu = nrm([0.45, -0.8, -0.3]), tv = nrm(cross(Z, tu)), tw = nrm(cross(tu, tv));
        const thenar = ell([0.027, -0.042, -0.0125], tu, tv, tw, 0.031, 0.0175, 0.0128);
        const hu = nrm([0.08, -1, 0]), hv = nrm(cross(Z, hu)), hw = nrm(cross(hu, hv));
        const hypo = ell([-0.029, -0.064, -0.0094], hu, hv, hw, 0.035, 0.0125, 0.0104);
        const pads = FK.map((k, i) => ell([k[0] * 0.97, k[1] + 0.0035, k[2] - 0.0088], [1, 0, 0], [0, 1, 0], [0, 0, 1], 0.0118 - 0.001 * (i === 3), 0.0105, 0.0078));
        // the fingers: from the knuckle's joint, spread, each joint bent toward the palm about the axis across the finger
        const fingers = FK.map((k, i) => {
          const sp = P.s[i], d0 = [Math.sin(sp), -Math.cos(sp), 0], ax = [Math.cos(sp), Math.sin(sp), 0];
          const j = [k.slice()], segs = [];
          let an = 0;
          for (let q = 0; q < 3; q++) {
            an += P.f[i][q];
            const d = rotA(d0, ax, an), nx = add(j[q], d, FLEN[i][q]), n = cross(d, ax);
            segs.push(seg(j[q], nx, FRAD[i][q], FRAD[i][q + 1], ax, n, q === 2 ? 0.8 : 0.88, q === 2 ? 0.94 : 0.84, { ce: [q > 0 ? 1 : 0, q < 2 ? 1 : 0], nail: q === 2 }));
            j.push(nx);
          }
          const lo = [0, 1, 2].map((c) => Math.min(...segs.map((g) => g.lo[c]))), hi = [0, 1, 2].map((c) => Math.max(...segs.map((g) => g.hi[c])));
          return { j, r: FRAD[i].slice(0, 3), ax, segs, lo, hi };
        });
        // the thumb: its first bone from low by the wrist (most of it in the ball of the thumb), then two joints
        const tj = [TC.slice()], tsegs = [];
        for (let q = 0; q < 3; q++) {
          const d = nrm(P.t[q]), nx = add(tj[q], d, TLEN[q]);
          tsegs.push(seg(tj[q], nx, TRAD[q], TRAD[q + 1], cross(P.tn, d), P.tn, q === 2 ? 0.8 : 0.86, q === 2 ? 0.94 : 0.86, { ce: [q === 2 ? 1 : 0, q === 1 ? 1 : 0], nail: q === 2, waist: q ? 0.0005 : 0 }));
          tj.push(nx);
        }
        const tlo = [0, 1, 2].map((c) => Math.min(...tsegs.slice(1).map((g) => g.lo[c]))), thi = [0, 1, 2].map((c) => Math.max(...tsegs.slice(1).map((g) => g.hi[c])));
        const palm = (x, y, z) => {
          let d = slabD(x, y, z);
          for (const m of metas) d = smin(d, segD(m, x, y, z), 0.009);
          d = smin(d, ellD(thenar, x, y, z), 0.012);
          d = smin(d, ellD(hypo, x, y, z), 0.011);
          for (const e of pads) d = smin(d, ellD(e, x, y, z), 0.008);
          d = smin(d, segD(wrist, x, y, z), 0.014);
          d = -smin(-d, 0.034 - y, 0.008);   // (its top, in the sleeve, closed round)
          return smin(d, segD(tsegs[0], x, y, z), 0.013);   // the thumb's root into the ball of the thumb
        };
        const KF = low ? 0.0045 : 0.0065, KT = 0.013;
        // the palm's box (with the thumb's root): where a point is further from it than a finger's (or the thumb's) surface by more
        // than the blend, the palm does not change the field there (the smooth minimum is the plain one) - it is not reckoned
        const plo = [0, 1, 2].map((c) => Math.min(wrist.lo[c], ...pads.map((e) => e.c[c] - e.R), tsegs[0].lo[c], thenar.c[c] - thenar.R, hypo.c[c] - hypo.R, ...metas.map((m) => m.lo[c]), c === 0 ? -0.045 : c === 1 ? -0.12 : -0.025));
        const phi = [0, 1, 2].map((c) => Math.max(wrist.hi[c], ...pads.map((e) => e.c[c] + e.R), tsegs[0].hi[c], thenar.c[c] + thenar.R, hypo.c[c] + hypo.R, ...metas.map((m) => m.hi[c]), c === 0 ? 0.046 : c === 1 ? 0.01 : 0.02));
        const fv = new Float64Array(4);
        const field = (x, y, z) => {
          let fm = 1, tt = 1;
          if (boxD(tlo, thi, x, y, z) < 0.03) { tt = smin(segD(tsegs[1], x, y, z), segD(tsegs[2], x, y, z), 0.003); fm = tt; }
          for (let i = 0; i < 4; i++) {
            const F = fingers[i];
            if (boxD(F.lo, F.hi, x, y, z) > Math.min(fm, 0.03) + KF + 0.006) { fv[i] = 1; continue; }
            const f = smin(smin(segD(F.segs[0], x, y, z), segD(F.segs[1], x, y, z), 0.0025), segD(F.segs[2], x, y, z), 0.0025);
            fv[i] = f;
            if (f < fm) fm = f;
          }
          if (boxD(plo, phi, x, y, z) > fm + KT) {
            if (!low) return fm;
            let fa = 1;   // (the crowds': as below, without the palm)
            for (let i = 0; i < 4; i++) if (fv[i] < 1) fa = smin(fa, fv[i], 0.009);
            return Math.min(fa, tt) - 0.0025;
          }
          const dp = palm(x, y, z);
          let d = dp;
          if (tt < 1) d = Math.min(d, smin(tt, segD(tsegs[0], x, y, z), 0.004));
          if (low) {   // the crowds': the fingers held together (one soft body)
            let fa = 1;
            for (let i = 0; i < 4; i++) if (fv[i] < 1) fa = smin(fa, fv[i], 0.009);
            return Math.min(d, smin(dp, fa, KF)) - 0.0025;   // (a little fuller - its fingers at least two cells thick on its grid)
          }
          for (let i = 0; i < 4; i++) if (fv[i] < 1) d = Math.min(d, smin(dp, fv[i], KF));
          return d;
        };
        const lo = [0, 1, 2].map((c) => Math.min(wrist.lo[c], tlo[c], ...fingers.map((F) => F.lo[c]), thenar.c[c] - thenar.R)), hi = [0, 1, 2].map((c) => Math.max(wrist.hi[c], thi[c], ...fingers.map((F) => F.hi[c]), thenar.c[c] + thenar.R));
        hi[1] = Math.min(hi[1], 0.046);   // (into the sleeve: its top closed round at 0.034)
        return { field, fingers, tj, tsegs, lo, hi, metas };
      };
      // ---------- surface nets: the field on a grid (where a block of it is far from the surface, its sign only), a point in each
      // cell the surface crosses (the mean of its edges' crossings), a face (two triangles) for each edge it crosses; then each
      // point drawn onto the field's zero, its normal the field's gradient
      const mesh = (F, lo, hi, h) => {
        const ox = lo[0] - 2 * h, oy = lo[1] - 2 * h, oz = lo[2] - 2 * h;
        const nx = Math.ceil((hi[0] - lo[0]) / h) + 5, ny = Math.ceil((hi[1] - lo[1]) / h) + 5, nz = Math.ceil((hi[2] - lo[2]) / h) + 5;
        const V = new Float32Array(nx * ny * nz), I = (i, j, k) => i + nx * (j + ny * k), B = 4;
        for (let bk = 0; bk < nz; bk += B) for (let bj = 0; bj < ny; bj += B) for (let bi = 0; bi < nx; bi += B) {
          const ie = Math.min(bi + B, nx), je = Math.min(bj + B, ny), ke = Math.min(bk + B, nz);
          const dc = F(ox + ((bi + ie - 1) / 2) * h, oy + ((bj + je - 1) / 2) * h, oz + ((bk + ke - 1) / 2) * h), hd = 0.5 * h * Math.hypot(ie - 1 - bi, je - 1 - bj, ke - 1 - bk);
          if (Math.abs(dc) > 1.4 * (hd + 2 * h)) { for (let k = bk; k < ke; k++) for (let j = bj; j < je; j++) for (let i = bi; i < ie; i++) V[I(i, j, k)] = dc; continue; }
          for (let k = bk; k < ke; k++) for (let j = bj; j < je; j++) for (let i = bi; i < ie; i++) V[I(i, j, k)] = F(ox + i * h, oy + j * h, oz + k * h);
        }
        const C = new Int32Array(nx * ny * nz).fill(-1), pos = [];
        const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
        const cv = new Float64Array(8);
        for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
          let m = 0;
          for (let c = 0; c < 8; c++) { const v = V[I(i + (c & 1), j + ((c >> 1) & 1), k + ((c >> 2) & 1))]; cv[c] = v; if (v < 0) m |= 1 << c; }
          if (m === 0 || m === 255) continue;
          let sx = 0, sy = 0, sz = 0, n = 0;
          for (const [a, b] of E) {
            if ((cv[a] < 0) === (cv[b] < 0)) continue;
            const t = cv[a] / (cv[a] - cv[b]);
            sx += (a & 1) + ((b & 1) - (a & 1)) * t; sy += ((a >> 1) & 1) + (((b >> 1) & 1) - ((a >> 1) & 1)) * t; sz += ((a >> 2) & 1) + (((b >> 2) & 1) - ((a >> 2) & 1)) * t; n++;
          }
          C[I(i, j, k)] = pos.length / 3;
          pos.push(ox + (i + sx / n) * h, oy + (j + sy / n) * h, oz + (k + sz / n) * h);
        }
        const idx = [], P3 = (q) => [pos[q * 3], pos[q * 3 + 1], pos[q * 3 + 2]];
        const quad = (a, b, c, d, flip) => {
          if (a < 0 || b < 0 || c < 0 || d < 0) return;
          if (flip) { const t = b; b = d; d = t; }
          const A = P3(a), Bq = P3(b), Cq = P3(c), D = P3(d);   // the shorter diagonal
          if ((A[0] - Cq[0]) ** 2 + (A[1] - Cq[1]) ** 2 + (A[2] - Cq[2]) ** 2 <= (Bq[0] - D[0]) ** 2 + (Bq[1] - D[1]) ** 2 + (Bq[2] - D[2]) ** 2) idx.push(a, b, c, a, c, d);
          else idx.push(a, b, d, b, c, d);
        };
        for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
          const v = V[I(i, j, k)], inn = v < 0;
          if (i < nx - 1 && (V[I(i + 1, j, k)] < 0) !== inn) quad(C[I(i, j - 1, k - 1)], C[I(i, j, k - 1)], C[I(i, j, k)], C[I(i, j - 1, k)], !inn);
          if (j < ny - 1 && (V[I(i, j + 1, k)] < 0) !== inn) quad(C[I(i - 1, j, k - 1)], C[I(i - 1, j, k)], C[I(i, j, k)], C[I(i, j, k - 1)], !inn);
          if (k < nz - 1 && (V[I(i, j, k + 1)] < 0) !== inn) quad(C[I(i - 1, j - 1, k)], C[I(i, j - 1, k)], C[I(i, j, k)], C[I(i - 1, j, k)], !inn);
        }
        // each point onto the zero (twice), its normal
        // (the field and its gradient from four points about p - a tetrahedron: f their mean, grad from their differences)
        const nv = pos.length / 3, nor = new Float32Array(nv * 3), e = 0.0005, g = [0, 0, 0, 0];
        const fg = (x, y, z) => {
          const a = F(x + e, y - e, z - e), b = F(x - e, y - e, z + e), c = F(x - e, y + e, z - e), d = F(x + e, y + e, z + e);
          g[0] = (a - b - c + d) / (4 * e); g[1] = (-a - b + c + d) / (4 * e); g[2] = (-a + b - c + d) / (4 * e); g[3] = (a + b + c + d) / 4;
          return g;
        };
        for (let q = 0; q < nv; q++) {
          let x = pos[q * 3], y = pos[q * 3 + 1], z = pos[q * 3 + 2];
          let G = fg(x, y, z), G2 = G[0] * G[0] + G[1] * G[1] + G[2] * G[2];
          if (G2 > 1e-8) {   // p -= f grad / |grad|^2, no further than a cell
            let s = G[3] / G2;
            const L = Math.abs(s) * Math.sqrt(G2);
            if (L > h) s *= h / L;
            x -= G[0] * s; y -= G[1] * s; z -= G[2] * s;
            pos[q * 3] = x; pos[q * 3 + 1] = y; pos[q * 3 + 2] = z;
            G = fg(x, y, z);
          }
          const l = Math.hypot(G[0], G[1], G[2]) || 1;
          nor[q * 3] = G[0] / l; nor[q * 3 + 1] = G[1] / l; nor[q * 3 + 2] = G[2] / l;
        }
        return { pos, nor, idx };
      };
      // ---------- the skin's colour per point (a factor on the material's): the shade from the field (how much of the hand is near
      // it, out along its normal), the nails, the palm's side, the knuckles' backs and the creases
      const LIN = (v) => Math.pow(v, 2.2);
      const shadeOf = (H, M, low) => {
        const { pos, nor } = M, nv = pos.length / 3, col = new Float32Array(nv * 3), F = H.field, o = {};
        const DL = [0.004, 0.009, 0.017], DW = [0.5, 0.32, 0.22];
        for (let q = 0; q < nv; q++) {
          const x = pos[q * 3], y = pos[q * 3 + 1], z = pos[q * 3 + 2], nx = nor[q * 3], ny = nor[q * 3 + 1], nz = nor[q * 3 + 2];
          let occ = 0;
          for (let s = 0; s < 3; s++) occ += DW[s] * clamp((DL[s] - F(x + nx * DL[s], y + ny * DL[s], z + nz * DL[s])) / DL[s], 0, 1);
          const ao = clamp(1 - 0.85 * occ, 0.62, 1);
          let r = 1, gC = 1, b = 1;
          // the palm's side lighter (where the surface looks toward the palm, on the palm and within the fingers)
          const palmS = sstep(0.1, 0.7, -nz) * sstep(0.03, -0.01, y);
          r += 0.04 * palmS; gC += 0.08 * palmS; b += 0.1 * palmS;
          if (!low) {
            let nail = 0, crease = 0, knuck = 0;
            for (const Fg of H.fingers.concat([{ segs: H.tsegs }])) for (let s = 0; s < Fg.segs.length; s++) {
              const g = Fg.segs[s];
              if (boxD(g.lo, g.hi, x, y, z) > 0.002) continue;
              const dd = segD(g, x, y, z, o);
              if (dd > 0.0025) continue;
              if (g.nail) nail = Math.max(nail, o.nail);
              const jt = Math.min(o.tl, g.len - o.tl), pal = o.cn < 0 ? -o.cn / (Math.hypot(o.cs, o.cn) + 1e-9) : 0, bk = o.cn > 0 ? o.cn / (Math.hypot(o.cs, o.cn) + 1e-9) : 0;
              if ((o.tl < g.len * 0.5 ? g.ce[0] : g.ce[1]) && jt < 0.004) crease = Math.max(crease, Math.exp(-((jt / 0.0016) ** 2)) * pal);
              if (s < 2 || Fg.segs.length === 3) knuck = Math.max(knuck, Math.exp(-((Math.min(o.tl, g.len - o.tl) / 0.0035) ** 2)) * bk * bk * (Fg.segs === H.tsegs ? 0 : 1));
            }
            for (const m of H.metas) {   // the knuckles' heads, on the back
              const g = m, dd = segD(g, x, y, z, o);
              if (dd < 0.004 && g.len - o.tl < 0.008 && o.cn > 0) knuck = Math.max(knuck, 0.8 * (1 - (g.len - o.tl) / 0.008) * sstep(0.2, 0.8, nz));
            }
            r *= 1 - 0.025 * knuck; gC *= 1 - 0.05 * knuck; b *= 1 - 0.045 * knuck;
            r *= 1 - 0.06 * crease; gC *= 1 - 0.085 * crease; b *= 1 - 0.08 * crease;
            const nr = 1.2, ng = 1.07, nb = 1.07;   // the nail: lighter, a little pink
            r = r + (nr - r) * nail; gC = gC + (ng - gC) * nail; b = b + (nb - b) * nail;
          }
          col[q * 3] = LIN(clamp(r, 0, 1.4)) * ao; col[q * 3 + 1] = LIN(clamp(gC, 0, 1.4)) * ao; col[q * 3 + 2] = LIN(clamp(b, 0, 1.4)) * ao;
        }
        return col;
      };
      // ---------- one hand: the right's (the thumb at +x) found, the left its mirror
      const V3 = (a, mx) => new Vector3(a[0] * mx, a[1], a[2]);
      const build = (sd, pose, low) => {
        const key0 = pose + "|" + low;
        const R = SK[key0] || (SK[key0] = { H: parts(pose, low === 2), geo: null });
        const mx = sd > 0 ? -1 : 1, { H } = R;
        // Grip positions, finger joints and the surface used by the tefillin need only the skeleton/field. Build the expensive
        // surface nets on the first .geo read, then keep only its typed geometry buffers (not the duplicate JS pos/idx arrays).
        // The right hand is also the canonical surface for the left, whose winding and x normals are mirrored once.
        let geo = null;
        const geometry = () => {
          if (geo) return geo;
          if (!R.geo) {
            const M = mesh(H.field, H.lo, H.hi, low === 2 ? 0.0105 : low === 1 ? 0.0072 : 0.0046), col = shadeOf(H, M, low === 2);
            const nv = M.pos.length / 3, uv = new Float32Array(nv * 2);
            for (let q = 0; q < nv; q++) { uv[q * 2] = 0.9; uv[q * 2 + 1] = 0.2; }
            R.geo = new BufferGeometry();
            R.geo.setAttribute("position", new Float32BufferAttribute(M.pos, 3));
            R.geo.setAttribute("normal", new BufferAttribute(M.nor, 3));
            R.geo.setAttribute("uv", new BufferAttribute(uv, 2));
            R.geo.setAttribute("color", new BufferAttribute(col, 3));
            R.geo.setIndex(M.idx);
          }
          if (mx > 0) return (geo = R.geo);
          geo = R.geo.clone();
          const pos = geo.attributes.position.array, nor = geo.attributes.normal.array, idx = geo.index.array;
          for (let q = 0; q < pos.length; q += 3) { pos[q] = -pos[q]; nor[q] = -nor[q]; }
          for (let q = 0; q < idx.length; q += 3) { const t = idx[q + 1]; idx[q + 1] = idx[q + 2]; idx[q + 2] = t; }
          return geo;
        };
        const fingers = H.fingers.map((F) => ({ j: F.j.map((p) => V3(p, mx)), r: F.r.slice(), ax: new Vector3(F.ax[0], F.ax[1] * mx, F.ax[2] * mx) }));
        const P = POSE[pose] || POSE.rest, mf = fingers[1].j;
        let grip;
        if (P.ring) { const t = (FK[1][0] - P.ring[0]) / GRIP_AX[0]; grip = V3([P.ring[0] + GRIP_AX[0] * t, P.ring[1] + GRIP_AX[1] * t, P.ring[2]], mx); }   // the ring's middle by the middle finger
        else grip = mf.reduce((a, b) => a.add(b), new Vector3()).multiplyScalar(1 / mf.length);
        const gripAx = V3(GRIP_AX, mx);
        // the back of the hand at (x, y): down along -z from over it to the surface
        const back = (x, y) => {
          const X = x * mx;
          let z = 0.07, f = H.field(X, y, z);
          while (z > -0.03 && f > 0) { z -= 0.0015; f = H.field(X, y, z); }
          if (f > 0) return 0;
          let a = z, b = z + 0.0015;
          for (let it = 0; it < 14; it++) { const m = (a + b) / 2; if (H.field(X, y, m) > 0) b = m; else a = m; }
          return (a + b) / 2;
        };
        return { get geo() { return geometry(); }, sk: { PL, PM: PL * 0.5, grip, gripAx, ring: P.rh || 0, fingers, thumb: H.tj.map((p) => V3(p, mx)), back } };
      };
      // o.low: the crowds' (the fingers together, a coarse grid); o.mid: the same hand in fewer faces (from a few amot - 55-tamid.js)
      return (o = {}) => {
        const sd = o.sd > 0 ? 1 : -1, pose = POSE[o.pose] ? o.pose : "rest", lv = o.low ? 2 : o.mid ? 1 : 0, key = sd + "|" + pose + "|" + lv;
        return cache[key] || (cache[key] = build(sd, pose, lv));
      };
    })();
