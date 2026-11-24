    // ===== TEF_STRAP_A2 (fix-a2; the user, 22.11.2026 12:15, via the coordinator: "רצועות התפילין — דקות, שחורות ושטוחות (רצועת עור),
    // ולא חוט עגול כמו גליל"): THE STRAP OF THE TEFILLIN - a flat band of leather along a path, as a strap lies on what it is wound on.
    // One construction for all the tefillin of both houses (shared/frag/strap.js, by an include line "strap"): the priests' and the
    // Levites' (priest-kit.js - the head's ring and its two ends, the arm's under the sleeve and on the hand) and the crowds' (people-kit.js).
    //   tm_strap(pts, nrm, w, t, closed, seg) -> a geometry (positions and normals, no texture coordinates): pts - its middle line
    //   (Vector3); nrm(p, i) - the normal of what it lies on at p (its face turned to it: the head, the arm, the hand); w - its breadth,
    //   t - its thickness; closed - a ring; seg - the pieces along it. Its four faces - the face, the back and the two edges - each flat
    //   across. Its breadth and thickness - model choices.
    const tm_strap = (pts, nrm, w, t, closed = false, seg = 0) => {
      const curve = new CatmullRomCurve3(pts, closed), n = seg || Math.max(16, pts.length * 4);
      const P = [], N = [], B = [], T = [];
      let bPrev = null;
      for (let i = 0; i <= n; i++) {
        const u = i / n, p = curve.getPointAt(closed && i === n ? 0 : u), tg = curve.getTangentAt(closed && i === n ? 0 : u).normalize();
        const s = nrm(p, i).clone().normalize();
        let b = new Vector3().crossVectors(tg, s);
        if (b.lengthSq() < 1e-10) b = bPrev ? bPrev.clone() : new Vector3(1, 0, 0);
        b.normalize();
        if (bPrev && b.dot(bPrev) < 0) b.negate();   // no twist where the normal turns over
        const nn = new Vector3().crossVectors(b, tg).normalize();
        P.push(p); N.push(nn); B.push(b); T.push(tg);
        bPrev = b;
      }
      const pos = [], nor = [], idx = [];
      // a face from the corner (sb, sn) to the corner (sb2, sn2) - B and N signs - its normal (mb, mn); triangles (a, a', b), (b, a', b')
      const face = (sb, sn, sb2, sn2, mb, mn) => {
        const base = pos.length / 3;
        for (let i = 0; i <= n; i++) {
          const p = P[i], b = B[i], nn = N[i];
          for (const [qb, qn] of [[sb, sn], [sb2, sn2]]) {
            pos.push(p.x + b.x * qb * w / 2 + nn.x * qn * t / 2, p.y + b.y * qb * w / 2 + nn.y * qn * t / 2, p.z + b.z * qb * w / 2 + nn.z * qn * t / 2);
            nor.push(b.x * mb + nn.x * mn, b.y * mb + nn.y * mn, b.z * mb + nn.z * mn);
          }
        }
        for (let i = 0; i < n; i++) { const a = base + i * 2, c = a + 2; idx.push(a, c, a + 1, a + 1, c, c + 1); }
      };
      face(1, 1, -1, 1, 0, 1);     // the face (toward +N): from +B to -B
      face(-1, 1, -1, -1, -1, 0);  // the edge at -B
      face(-1, -1, 1, -1, 0, -1);  // the back
      face(1, -1, 1, 1, 1, 0);     // the edge at +B
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute(pos, 3));
      g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
      g.setIndex(idx);
      return g;
    };
    // TEF_ROSH_A2 (the user, 22.11.2026, on a picture of the model: "החוט צריך להיות לפני הקציצה ולא לאחריה!" - the strap was a ring
    // round the head with the box sitting on it, the strap going on before the box over the forehead): THE HEAD'S TEFILLIN, one
    // construction for all (the priests, the Levites, the high priest, the crowds; both houses): the box (bayit) on its base (titura)
    // set on the head at the start of the hair, in the middle, flat on it; behind the box, on the base, the passage (ma'avarta) - "ומניחין
    // מן העור שלמטה מקום שתכנס בו הרצועה כמו תובר והוא הנקרא מעברת" (the Rambam, Tefillin 3:3, 303:38; 3:1, 303:36 "שתכנס בה הרצועה
    // עד שתהא עוברת והולכת בתוך תובר שלה") - the strap comes out of it on both sides and goes back round the head, over the ears, to the
    // knot at the top of the nape ("וקושר קשר מרבע כמין דל"ת", 3:13, 303:48); before the box - nothing, the box is the front. The two
    // ends down before him (o.ends). Its measures from the head it is made for (agent E changes the heads - so they are parameters):
    //   tm_tefRosh(o) -> a geometry (positions, normals): o = { HR: [the head's half breadth, height, depth], headR(ph, y) - its radius
    //   round (ph 0 before, +x his left) at the height y over its middle, TY - the box's middle over the head's (0.1), TB - its side
    //   (0.04), knotY (-0.056), ends (the hanging ends: true), low (fewer faces), sw / st - the strap's breadth / thickness }
    const tm_tefRosh = (o) => {
      const HR = o.HR, headR = o.headR, TY = o.TY == null ? 0.1 : o.TY, TB = o.TB || 0.04, KY = o.knotY == null ? -0.056 : o.knotY, low = !!o.low;
      const SW = o.sw || 0.013, ST = o.st || 0.0018, parts = [];
      // the head's surface where the box sits: its normal there, and the way up the head behind it (t)
      const zs = HR[2] * Math.sqrt(Math.max(0, 1 - (TY / HR[1]) * (TY / HR[1]))), n = new Vector3(0, TY / (HR[1] * HR[1]), zs / (HR[2] * HR[2])).normalize();
      const t = new Vector3(0, n.z, -n.y), tilt = Math.atan2(n.y, n.z);
      const place = (q, d, back = 0) => { q.rotateX(-tilt); q.translate(t.x * back, TY + n.y * d + t.y * back, zs + n.z * d + t.z * back); return q; };
      const BASE = 0.008, MA = 0.016;   // the base's thickness; the passage's length behind the box
      // TEF_ENDS_BODY_420 (the user 25.11.2026, of the figure for scale: one end went into his chest and the other hung in the air): the
      // hanging ends belong to the body, not to the head - a head turned a little (every priest's own turn) swung them into the chest and
      // out of it. o.ends === "only" - the two ends alone (laid on the neck's group by tefOn, unturned); false - the head's part alone
      const only = o.ends === "only";
      if (!only) {
      parts.push(place(new BoxGeometry(TB * 1.25, TB * 1.25, BASE), BASE / 2 + 0.001));                      // the titura, flat on the head
      parts.push(place(new BoxGeometry(TB, TB, TB), BASE + 0.001 + TB / 2));                                   // the bayit on it
      parts.push(place(new BoxGeometry(TB * 1.25, MA, BASE * 1.6), BASE * 0.8 + 0.001, TB * 0.625 + MA / 2));    // the ma'avarta, behind it, the strap through it
      // the strap: from the passage (its middle M, behind the box) round the back of the head - over the ears - to the knot, and back into
      // the passage from the other side: a ring through the passage, not before the box
      const M = new Vector3(0, TY, zs).addScaledVector(t, TB * 0.625 + MA / 2).addScaledVector(n, BASE * 0.8);
      const N = low ? 24 : 48, ring = [];
      for (let i = 0; i < N; i++) {
        const ph = (i / N) * Math.PI * 2, w = 0.5 + 0.5 * Math.cos(ph), y = KY + (M.y - KY) * Math.pow(w, 0.35);
        const r = headR(ph, y) + 0.005;   // (before, at the top of its arc, it runs under the passage - inside it)
        ring.push(new Vector3(Math.sin(ph) * r, y, Math.cos(ph) * r));
      }
      parts.push(tm_strap(ring, (p) => new Vector3(p.x / (HR[0] * HR[0]), p.y / (HR[1] * HR[1]), p.z / (HR[2] * HR[2])), SW, ST, true, low ? 40 : 96));
      }
      const kz = -(headR(Math.PI, KY) + 0.009);
      if (!only) parts.push(new BoxGeometry(0.024, 0.02, 0.012).translate(0, KY - 0.002, kz));   // the knot, in the nape's middle
      if (o.ends !== false) for (const sd of [-1, 1]) {   // the two ends: behind the neck, over the shoulder by the neck, and down before him (sd -1 his right)
        const end = sd < 0 ? -0.93 : -0.8;
        const pts = [[0.008, KY - 0.008, kz + 0.004], [0.05, -0.13, -0.118], [0.098, -0.19, -0.088], [0.13, -0.212, -0.02], [0.136, -0.235, 0.07], [0.134, -0.29, 0.122], [0.13, -0.36, 0.142],
          [0.127, -0.48, 0.146], [0.124, -0.6, 0.15], [0.122, -0.72, 0.17], [0.121, end, sd < 0 ? 0.142 : 0.168]].map(([x, y, z]) => new Vector3(sd * x, y, z));
        const endN = (p) => { const r = new Vector3(p.x * (p.z > 0.05 ? 0.45 : 1), 0, p.z + 0.01).normalize(), w = Math.exp(-Math.pow((p.y + 0.215) / 0.035, 2)) * Math.max(0, 1 - Math.abs(p.z) / 0.12); return r.multiplyScalar(1 - w).add(new Vector3(0, w, 0)); };
        parts.push(tm_strap(pts, endN, SW * 0.95, ST, false, 80));
      }
      return mergeGeometries(parts.map((q) => { q.deleteAttribute("uv"); if (q.attributes.normal === undefined) q.computeVertexNormals(); return q; }));
    };
