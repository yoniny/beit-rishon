  // SHILOACH_KIT_B2 (fix-b2, 22.11.2026 - the coordinator, after the pictures of the spring beside Chalamish p. 13: "צוק כתום־חום חלק יותר
  // ועליו הרבה ירוק (שרכים, עלים); מפל לבן נראה מהפתח הקטן אל הבריכה, עם קצף ומערבולת כחולה־לבנה; אור לפידים חזק ואור ירח כחלחל; מדרון,
  // סלעים ושיחים מסביב"; "לבנות כפונקציה משותפת, כי סוכן ג יעתיק את המעין לבית ראשון"; "להוציא את כל בניית המעין... לקטע משותף, shared/frag/shiloach.js... אל תכניס תלות ב־SH או בקואורדינטות של בית שני"). THE SPRING OF THE SHILOACH, one build for both
  // houses: a smooth orange-brown cliff of rounded spires with vertical grooves (Chalamish p. 13), and at its foot a small opening out of
  // which the water comes - the user's decision 101: "המים נובעים בקול גדול... ויוצאים כאיסר" (the Yerushalmi: "שילוח היה מוציא מים
  // כאיסר") - as a narrow white fall into a small round basin among grey boulders, foaming and turning (a blue-white whirlpool); ferns and
  // leafy bushes on the cliff's ledges and round its foot; the torches' light and a bluish moonlight (off until setLit). The cliff, the
  // plants, the fall's width, the basin and the lights - model choices.
  // tm_shiloach(ctx, o) - no tie to either house: its place, its ground, its lights and its sound come in o.
  //   o = { x, z: the opening's ground point; mouthY (absolute) or mouthH (over the ground, 1.6): the opening's height;
  //   yaw: 0 = the water comes out toward -z (the cliff behind it, toward +z); ground(x, z) -> y; parent (ctx.root); seed; scale (1); name;
  //   basinR (1.0), basinDz (0.55, the basin's centre before the face), basinY (its water's level; default the ground + 0.36),
  //   fallZ (0.5, where the fall comes down, before the face);
  //   pool: { dx, dz, w, d } - the great pool: its centre in the kit's own frame (as the world's x and z when yaw is 0; dz < 0 is before
  //     the face), w x d, its walls of stone 1 thick, its water at its lowest ground + 0.95 - or null for none;
  //   lights: { torch: 85, moon: 34, torchColor, moonColor, torchPos: [x, y over the opening, z], moonPos } (the frame's; off until setLit);
  //   sfx(name, opts) - the house's player of sounds (optional); roar: { name: "water", dur: 4.5, gain: 3.2 } }
  //   lake: { dx, dz, rx, rz } - the natural pool the fall drops into (default { 2.0, -1.9, 3.2, 2.3 }); false - the small basin instead;
  // -> { G, mouth: {x, y, z}, basinY, pool: { y0, rim, wl, water } | null, lake: { cx, cz, rx, rz, y, center } | null, standFor(off), setBottom(y), setLit(k), roar(), tick(t), swirlMat(),
  //      clump(x, y, z, s), boulder(x, y, z, s), bush(x, y, z, s) (world coordinates), lights }
  function tm_shiloach(ctx, o) {
    const G = new Group(); G.name = o.name || "shiloachKit"; (o.parent || ctx.root).add(G);
    const yaw = o.yaw || 0, cs = Math.cos(yaw), sn = Math.sin(yaw), S = o.scale || 1;
    G.position.set(o.x, 0, o.z); G.rotation.y = yaw;
    const W = (lx, lz) => [o.x + lx * cs + lz * sn, o.z - lx * sn + lz * cs];   // local -> world (the group's own rotation)
    const L = (wx, wz) => { const dx = wx - o.x, dz = wz - o.z; return [dx * cs - dz * sn, dx * sn + dz * cs]; };   // world -> local
    const gL = (lx, lz) => { const [wx, wz] = W(lx, lz), y = o.ground(wx, wz); return isFinite(y) ? y : o.mouthY - 1.3; };
    let q = (o.seed || 9091) >>> 0;
    const rr = () => (q = (q * 1664525 + 1013904223) >>> 0) / 4294967296;
    const GY = gL(0, -0.5), MY = o.mouthY != null ? o.mouthY : GY + (o.mouthH || 1.6) * S;
    const noPick = (m) => { m.userData.noPick = true; return m; };
    // ---- the cliff: rounded spires, tapering, with vertical grooves and streaks of light and dark (vertex colours, smooth shading)
    const rockM = new MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0.0 });
    const cA = new Color(0xb8642c), cL = new Color(0xd88f4c), cD = new Color(0x7e3f1c), cT = new Color();
    const recess = (x, y, z) => (Math.abs(x) < 1.25 * S && y < MY + 1.1 * S && z < 0.32 * S);   // the face round the opening stays back
    const spire = (cx, cz, rx, rz, h, sd) => {
      const g = new CylinderGeometry(1, 1, 1, 56, 30, true).translate(0, 0.5, 0), ps = g.attributes.position, col = new Float32Array(ps.count * 3);
      const base = Math.min(gL(cx - rx, cz), gL(cx + rx, cz), gL(cx, cz - rz), gL(cx, cz + rz), gL(cx, cz)) - 1.6;
      const top = gL(cx, cz) + h, H = top - base;
      for (let i = 0; i < ps.count; i++) {
        const a = Math.atan2(ps.getZ(i), ps.getX(i)), v = ps.getY(i);
        const taper = (1 - 0.5 * Math.pow(v, 1.5)) * (v > 0.86 ? Math.sqrt(Math.max(0.02, 1 - Math.pow((v - 0.86) / 0.14, 2))) : 1);
        const gr = 0.028 * Math.sin(a * 7 + sd) + 0.016 * Math.sin(a * 13 + v * 5 + sd * 2), bl = 0.11 * Math.sin(v * 3.6 + a * 2 + sd) + 0.06 * Math.sin(v * 7.5 + a * 3 + sd * 3) + 0.04 * Math.cos(a * 4 - v * 6 + sd);
        const f = taper * (1 + gr + bl);
        let x = cx + Math.cos(a) * rx * f, z = cz + Math.sin(a) * rz * f; const y = base + v * H;
        if (recess(x, y, z)) z = 0.32 * S + (0.1 * Math.sin(x * 4)) * S;
        ps.setXYZ(i, x, y, z);
        const k = Math.max(-1, Math.min(1, (gr * 2 + bl * 0.5) * 9)), mo = 0.5 + 0.5 * Math.sin(v * 13 + a * 3 + sd);
        cT.copy(cA).lerp(k > 0 ? cL : cD, Math.abs(k) * 0.65).lerp(cD, v < 0.05 ? 0.3 : 0).multiplyScalar(0.9 + 0.2 * mo);
        col[i * 3] = cT.r; col[i * 3 + 1] = cT.g; col[i * 3 + 2] = cT.b;
      }
      g.setAttribute("color", new Float32BufferAttribute(col, 3)); g.computeVertexNormals();
      const m = new Mesh(g, rockM); m.castShadow = m.receiveShadow = true; G.add(noPick(m));
      return { cx, cz, rx, rz, base, top };
    };
    const SPIRES = [
      spire(0.5 * S, 3.3 * S, 3.2 * S, 2.9 * S, 13 * S, 1.1), spire(-4.4 * S, 4.0 * S, 2.5 * S, 2.3 * S, 9.5 * S, 2.7), spire(4.9 * S, 4.4 * S, 2.7 * S, 2.5 * S, 10.5 * S, 4.2),
      spire(1.4 * S, 7.6 * S, 4.4 * S, 3.4 * S, 16 * S, 5.6), spire(-8.6 * S, 6.2 * S, 3.8 * S, 3.4 * S, 6.5 * S, 6.9), spire(9.6 * S, 7.0 * S, 4.0 * S, 3.4 * S, 7.5 * S, 8.3),
      spire(-12.5 * S, 9.5 * S, 4.4 * S, 4.0 * S, 4.5 * S, 9.1), spire(13.5 * S, 10 * S, 4.6 * S, 4.0 * S, 5 * S, 10.4)
    ];
    // ---- the small opening: a dark hollow with a lip of rock
    { const hole = new Mesh(new CircleGeometry(0.3 * S, 20), new MeshStandardMaterial({ color: 0x140c08, roughness: 1 })); hole.position.set(0, MY, 0.3 * S); hole.rotation.y = Math.PI; G.add(noPick(hole));
    }
    // ---- canvas textures: the fall's streaks, the whirlpool, the fern's frond
    const cvs = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t; };
    const fallTex = cvs(64, 256, (x, w, h) => { x.fillStyle = "rgba(225,240,252,0.9)"; x.fillRect(0, 0, w, h); for (let i = 0; i < 70; i++) { const px = rr() * w, py = rr() * h, l = 20 + rr() * 60; x.strokeStyle = rr() < 0.6 ? "rgba(255,255,255,0.95)" : "rgba(120,170,215,0.7)"; x.lineWidth = 1 + rr() * 3; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (rr() - 0.5) * 3, py + l); x.stroke(); } });
    fallTex.wrapS = fallTex.wrapT = RepeatWrapping; fallTex.repeat.set(1, 2);
    const swirlTex = cvs(256, 256, (x, w, h) => {
      const gr = x.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); gr.addColorStop(0, "#d8ecfa"); gr.addColorStop(0.35, "#5d9fd6"); gr.addColorStop(1, "#2f6aa6"); x.fillStyle = gr; x.fillRect(0, 0, w, h);
      for (let k = 0; k < 9; k++) { x.strokeStyle = k % 3 ? "rgba(235,246,255,0.75)" : "rgba(160,205,240,0.8)"; x.lineWidth = 2 + (k % 3); x.beginPath();
        for (let s = 0; s < 120; s++) { const a = s * 0.09 + k * 0.7, r = 6 + s * 1.0; const px = w / 2 + Math.cos(a) * r, py = h / 2 + Math.sin(a) * r * 0.95; if (s) x.lineTo(px, py); else x.moveTo(px, py); } x.stroke(); }
    });
    swirlTex.center.set(0.5, 0.5);
    const frondTex = cvs(128, 512, (x, w, h) => {
      x.clearRect(0, 0, w, h); x.strokeStyle = "#3b6a1e"; x.lineWidth = 5; x.beginPath(); x.moveTo(w / 2, h); x.quadraticCurveTo(w / 2 + 6, h / 2, w / 2, 6); x.stroke();
      for (let i = 0; i < 26; i++) { const v = i / 26, y = h - 18 - v * (h - 30), len = (w / 2 - 6) * Math.sin(Math.PI * (0.15 + 0.85 * (1 - v))) * (1 - v * 0.35);
        for (const s of [-1, 1]) { x.fillStyle = i % 2 ? "#4f8f2c" : "#3f7d26"; x.beginPath(); x.moveTo(w / 2, y); x.quadraticCurveTo(w / 2 + s * len * 0.6, y - 16, w / 2 + s * len, y - 22); x.quadraticCurveTo(w / 2 + s * len * 0.5, y - 4, w / 2, y + 6); x.fill(); } }
    });
    const fernM = new MeshStandardMaterial({ map: frondTex, alphaTest: 0.45, side: DoubleSide, roughness: 0.75 });
    const leafM = [0x3d7a2a, 0x2f6a24, 0x4f8a32].map((c) => new MeshStandardMaterial({ color: c, roughness: 0.8 }));
    const boulM = new MeshStandardMaterial({ color: 0x8d8b87, roughness: 0.9 });
    const frond = new PlaneGeometry(0.95, 2.5, 1, 5).translate(0, 1.25, 0);
    { const p = frond.attributes.position; for (let i = 0; i < p.count; i++) { const v = p.getY(i) / 2.5; p.setZ(i, -0.5 * v * v); } frond.computeVertexNormals(); }   // each frond arches outward
    const blob = (n) => { const g = new IcosahedronGeometry(1, 2), ps = g.attributes.position, v = new Vector3(); for (let i = 0; i < ps.count; i++) { v.fromBufferAttribute(ps, i); const k = 1 + 0.18 * Math.sin(v.x * 3.1 + n) * Math.cos(v.y * 2.7 + n * 1.7) + 0.1 * Math.sin(v.z * 5.3 + n * 0.6); ps.setXYZ(i, v.x * k, v.y * k, v.z * k); } g.computeVertexNormals(); return g; };
    const BLOBS = [0, 1, 2, 3, 4, 5].map((n) => blob(n * 1.7 + 0.3));
    // local helpers (lx, ly, lz) and their world forms for the house's own use
    const clumpL = (lx, ly, lz, s, n) => { for (let k = 0; k < (n || 8); k++) { const f = new Mesh(frond, fernM); f.position.set(lx, ly, lz); f.rotation.set(-0.35 - rr() * 0.6, k * (6.28 / (n || 8)) + rr() * 0.5, 0, "YXZ"); f.scale.setScalar(s * (0.75 + rr() * 0.45)); G.add(noPick(f)); } };
    const boulderL = (lx, ly, lz, s) => { const b = new Mesh(BLOBS[Math.floor(rr() * BLOBS.length)], boulM); b.position.set(lx, ly, lz); b.scale.set(s * (1 + rr() * 0.4), s * (0.55 + rr() * 0.25), s * (0.9 + rr() * 0.3)); b.rotation.y = rr() * 6.3; b.castShadow = b.receiveShadow = true; G.add(noPick(b)); return b; };
    const bushL = (lx, ly, lz, s) => { for (let k = 0; k < 4; k++) { const b = new Mesh(BLOBS[(k + 2) % BLOBS.length], leafM[k % 3]); b.position.set(lx + (rr() - 0.5) * s, ly + s * (0.35 + rr() * 0.3), lz + (rr() - 0.5) * s); b.scale.set(s * 0.6, s * 0.45, s * 0.6); G.add(noPick(b)); } clumpL(lx, ly, lz, s * 0.8, 5); };
    // Finalize after the house has cleared individual plants out of its channel. Ferns use alphaTest, not blended
    // transparency: their identical geometry/material can share draws while retaining every leaf and its depth test.
    // The first house's existing opaque merge makes every merged material receive shadows; retain that policy there.
    const batchPlants = (mergedShadows = false) => {
      const batches = new Map(), materialCounts = new Map();
      for (const m of G.children) if (m.isMesh && !m.isInstancedMesh && m.material && !m.material.transparent) materialCounts.set(m.material, (materialCounts.get(m.material) || 0) + 1);
      for (const m of G.children) {
        if (!m.isMesh || m.isInstancedMesh || !m.visible || m.material.transparent ||
            !(m.geometry === frond && m.material === fernM || BLOBS.includes(m.geometry) && leafM.includes(m.material))) continue;
        const key = m.geometry.uuid + ":" + m.material.uuid + ":" + m.castShadow + ":" + m.receiveShadow + ":" + m.renderOrder + ":" + m.layers.mask;
        if (!batches.has(key)) batches.set(key, []);
        batches.get(key).push(m);
      }
      for (const list of batches.values()) {
        if (list.length < 2) {
          if (mergedShadows && materialCounts.get(list[0].material) >= 3) list[0].receiveShadow = true;
          continue;
        }
        const first = list[0], im = new InstancedMesh(first.geometry, first.material, list.length);
        list.forEach((m, i) => { m.updateMatrix(); im.setMatrixAt(i, m.matrix); });
        im.instanceMatrix.needsUpdate = true;
        im.castShadow = first.castShadow;
        im.receiveShadow = mergedShadows && materialCounts.get(first.material) >= 3 ? true : first.receiveShadow;
        im.renderOrder = first.renderOrder; im.layers.mask = first.layers.mask;
        im.computeBoundingSphere(); im.userData.noPick = true;
        for (const m of list) G.remove(m);
        G.add(im);
      }
    };
    // (BROW_OFF_B2, the user's decision 176 a: the orange stone over the opening, "like a hat" - removed; the opening stays in the rock)
    const toL = (fn) => (wx, wy, wz, s) => { const [lx, lz] = L(wx, wz); return fn(lx, wy, lz, s); };
    // ---- the basin under the fall: a round bed of stone, its water turning (the whirlpool), grey boulders round it, open toward the front
    const BR = (o.basinR || 1.0) * S, BZ = -(o.basinDz != null ? o.basinDz : 0.55) * S, BY = o.basinY != null ? o.basinY : GY + 0.36;
    // NATURAL_POOL_B2 (the user's decision 122 b: "בריכה טבעית שהמפל נופל לתוכה, כבחלמיש; מקום המילוי בהתאם" - in both houses): by default
    // the fall drops straight into a natural pool before the face (o.lake: { dx, dz, rx, rz } in the kit's frame; o.lake === false - the
    // small basin of before). Its size and outline - model choices
    const LK = o.lake === false ? null : Object.assign({ dx: 2.0, dz: -1.9, rx: 3.2, rz: 2.3 }, o.lake || {});
    const inLake = (x, z, k) => !!LK && Math.pow((x - LK.dx * S) / (LK.rx * S * (k || 1)), 2) + Math.pow((z - LK.dz * S) / (LK.rz * S * (k || 1)), 2) < 1;
    if (!LK) { const bed = new Mesh(new CylinderGeometry(BR, BR * 0.8, BY - GY + 0.8, 24, 1, true), new MeshStandardMaterial({ color: 0x5f5a52, roughness: 1, side: DoubleSide })); bed.position.set(0, (BY + GY - 0.8) / 2, BZ); G.add(noPick(bed));
      const swirlM = new MeshStandardMaterial({ map: swirlTex, roughness: 0.1, metalness: 0.05, emissive: 0x2a5a8a, emissiveIntensity: 0.6 });
      const wtr = new Mesh(new CircleGeometry(BR + 0.05, 32).rotateX(-Math.PI / 2), swirlM); wtr.position.set(0, BY, BZ); G.add(noPick(wtr));
      for (let i = 0; i < 11; i++) { const a = -Math.PI * 0.2 + (i / 10) * Math.PI * 1.4 + (rr() - 0.5) * 0.15, r = BR + 0.16 * S; boulderL(Math.cos(a) * r, BY - 0.05, BZ + Math.sin(a) * r * 0.9 + 0.1, (0.32 + rr() * 0.22) * S); } }
    // ---- the fall: a narrow white ribbon out of the opening, arching forward and down into the basin; setBottom cuts it (a vessel under it)
    const FZ = -(o.fallZ != null ? o.fallZ : 0.5) * S, FW = 0.46 * S, NSEG = 18;
    const fallG = new BufferGeometry(), fpos = new Float32Array((NSEG + 1) * 2 * 3), fuv = new Float32Array((NSEG + 1) * 2 * 2), fidx = [];
    for (let i = 0; i < NSEG; i++) { const k = i * 2; fidx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    fallG.setAttribute("position", new Float32BufferAttribute(fpos, 3)); fallG.setAttribute("uv", new Float32BufferAttribute(fuv, 2)); fallG.setIndex(fidx);
    const fallM = new MeshStandardMaterial({ map: fallTex, transparent: true, opacity: 0.96, side: DoubleSide, roughness: 0.2, emissive: 0xb8d6ee, emissiveIntensity: 0.55, depthWrite: false });
    const fall = new Mesh(fallG, fallM); fall.renderOrder = 3; fall.frustumCulled = false; G.add(noPick(fall));
    let yBot = BY;
    const setBottom = (y) => {
      yBot = Math.min(MY - 0.05, y); const P = fallG.attributes.position, U = fallG.attributes.uv, drop = MY - yBot;
      for (let i = 0; i <= NSEG; i++) {
        const u = i / NSEG, yy = MY - drop * u, arc = Math.min(1, u * drop / 0.45), z = 0.28 * S + (FZ - 0.28 * S) * Math.sqrt(arc), w = FW * (0.75 + 0.5 * u);
        P.setXYZ(i * 2, -w / 2, yy, z); P.setXYZ(i * 2 + 1, w / 2, yy, z); U.setXY(i * 2, 0, u * drop); U.setXY(i * 2 + 1, 1, u * drop);
      }
      P.needsUpdate = U.needsUpdate = true; fallG.computeVertexNormals(); fallG.computeBoundingSphere();
    };
    setBottom(BY);
    // ---- the foam and the spray where it falls (points thrown up and falling back), and a ring of foam on the basin
    const NP = 380, spos = new Float32Array(NP * 3), SPp = [];
    for (let k = 0; k < NP; k++) SPp.push({ a: rr() * 6.283, v: 0.5 + rr() * 1.3, h: 0.2 + rr() * 0.6, ph: rr(), sp: 0.9 + rr() * 1.4 });
    const sg = new BufferGeometry(); sg.setAttribute("position", new Float32BufferAttribute(spos, 3));
    const spray = new Points(sg, new PointsMaterial({ color: 0xffffff, size: 0.11 * S, transparent: true, opacity: 0.9, depthWrite: false })); spray.frustumCulled = false; G.add(noPick(spray));
    const foam = new Mesh(new RingGeometry(0.15 * S, 0.85 * S, 24, 2).rotateX(-Math.PI / 2), new MeshStandardMaterial({ color: 0xf4fbff, roughness: 0.3, transparent: true, opacity: 0.85, emissive: 0x7894aa, emissiveIntensity: 0.4, depthWrite: false }));
    foam.position.set(0, BY + 0.02, FZ); foam.renderOrder = 3; G.add(noPick(foam));
    // ---- green: ferns on the cliff's ledges and round its foot, leafy bushes, grey boulders on the slope
    for (const sp of SPIRES) {
      const n = 5 + Math.floor(rr() * 4);
      for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (rr() - 0.5) * 2.6, v = 0.25 + rr() * 0.5, y = sp.base + 1.6 + (sp.top - sp.base - 1.6) * v, f = (1 - 0.5 * Math.pow(v, 1.5)) * 0.97;
        const x = sp.cx + Math.cos(a) * sp.rx * f, z = sp.cz + Math.sin(a) * sp.rz * f; if (Math.abs(x) < 1.6 * S && y < MY + 2) continue; clumpL(x, y, z, (0.8 + rr() * 0.6) * S, 7); }
    }
    for (let i = 0; i < 52; i++) { const x = (rr() - 0.5) * 24 * S, z = -0.2 * S + rr() * 3.4 * S - Math.abs(x) * 0.02; if ((x > -4.8 * S && x < 2.8 * S && z < 1.7 * S) || inLake(x, z, 1.15)) continue;   // the way to the opening and the view of it from the side left clear
      clumpL(x, gL(x, z) - 0.05, z, (0.9 + rr() * 0.8) * S, 9); }
    for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) { const x = sx * (1.1 + rr() * 1.6) * S, y = MY + (1.3 + i * 1.1 + rr() * 0.5) * S, z = 0.25 * S; clumpL(x, y, z, (0.7 + rr() * 0.4) * S, 6); }   // on the face, beside the opening (Chalamish p. 13)
    for (let i = 0; i < 16; i++) { const x = (rr() - 0.5) * 22 * S, z = -0.8 * S + rr() * 2.4 * S; if (Math.abs(x) < 2.6 * S || inLake(x, z, 1.25)) continue; bushL(x, gL(x, z) - 0.1, z, (0.9 + rr() * 0.6) * S); }
    for (let i = 0; i < 14; i++) { const x = (rr() - 0.5) * 24 * S, z = -2.5 * S + rr() * 3 * S; if (Math.abs(x) < 3 * S || inLake(x, z, 1.2)) continue; boulderL(x, gL(x, z) + 0.1, z, (0.5 + rr() * 0.7) * S); }
    // ---- the great pool (optional): four walls of stone and a floor, its water turning, grey boulders on its rim (the way to the basin left
    //      open), ferns along its sides and bushes behind it; a rill from the basin to it
    const EXTRA = [];
    const swirlMat = () => { const t = swirlTex.clone(); t.needsUpdate = true; t.center.set(0.5, 0.5); const m = new MeshStandardMaterial({ map: t, roughness: 0.12, metalness: 0.08, transparent: true, opacity: 0.92, emissive: 0x24507c, emissiveIntensity: 0.5 }); EXTRA.push(t); return m; };
    let POOL = null;
    let LAKE = null;
    if (LK) {   // NATURAL_POOL_B2: the pool - an irregular round of water, turning, a bank of wet earth round it, grey boulders on its edge
      const cx = LK.dx * S, cz = LK.dz * S, rx = LK.rx * S, rz = LK.rz * S, N = 48;
      const rad = (a) => 1 + 0.09 * Math.sin(a * 3 + 1.3) + 0.06 * Math.sin(a * 5 + 0.4);
      const edge = (a, k) => [cx + Math.cos(a) * rx * rad(a) * k, cz + Math.sin(a) * rz * rad(a) * k];
      const pos = [0, 0, 0], nor = [0, 1, 0], uv = [0.5, 0.5], idx = [];
      for (let i = 0; i <= N; i++) { const a = i / N * 6.283, [x, z] = edge(a, 1); pos.push(x - cx, 0, z - cz); nor.push(0, 1, 0); uv.push(0.5 + 0.5 * Math.cos(a) * rad(a), 0.5 + 0.5 * Math.sin(a) * rad(a)); if (i) idx.push(0, i + 1, i); }
      const wg = new BufferGeometry(); wg.setAttribute("position", new Float32BufferAttribute(pos, 3)); wg.setAttribute("normal", new Float32BufferAttribute(nor, 3)); wg.setAttribute("uv", new Float32BufferAttribute(uv, 2)); wg.setIndex(idx);
      const wm = swirlMat(); wm.side = DoubleSide; wm.transparent = false; wm.opacity = 1;
      const water = new Mesh(wg, wm); water.position.set(cx, BY, cz); water.renderOrder = 2; G.add(noPick(water));
      const sp = [], si = [];
      for (let i = 0; i <= N; i++) { const a = i / N * 6.283, [x1, z1] = edge(a, 0.97), [x2, z2] = edge(a, 1.28); sp.push(x1, BY + 0.01, z1, x2, Math.min(BY + 0.5, gL(x2, z2) + 0.03), z2); if (i) { const k = i * 2; si.push(k - 2, k - 1, k, k - 1, k + 1, k); } }
      const sg2 = new BufferGeometry(); sg2.setAttribute("position", new Float32BufferAttribute(sp, 3)); sg2.setIndex(si); sg2.computeVertexNormals();
      const bank = new Mesh(sg2, new MeshStandardMaterial({ color: 0x6a5e4c, roughness: 1, side: DoubleSide })); bank.receiveShadow = true; G.add(noPick(bank));
      const BANK = [-1.0 * S, FZ];   // the dry bank beside the fall, on its left as one faces the cliff - where one stands to fill
      for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283 + (rr() - 0.5) * 0.12, [x, z] = edge(a, 1.06); if (Math.hypot(x - BANK[0], z - BANK[1]) < 1.5 * S || Math.hypot(x, z - FZ) < 0.8 * S) continue; boulderL(x, BY - 0.05, z, (0.42 + rr() * 0.45) * S); }
      for (let i = 0; i < 4; i++) { const a = rr() * 6.283, k = 0.35 + rr() * 0.4, [x, z] = edge(a, k); if (Math.hypot(x, z - FZ) < 1.2 * S) continue; boulderL(x, BY - 0.12, z, (0.3 + rr() * 0.25) * S); }   // a few stones in the water
      for (let i = 0; i < 10; i++) { const a = rr() * 6.283, [x, z] = edge(a, 1.4 + rr() * 0.3); if (Math.hypot(x - BANK[0], z - BANK[1]) < 1.8 * S || z > 0.2 * S) continue; clumpL(x, gL(x, z) - 0.05, z, (0.8 + rr() * 0.6) * S, 8); }   // ferns round it (Chalamish p. 13)
      LAKE = { cx, cz, rx, rz, y: BY, center: W(cx, cz) };
    }
    if (o.pool) {
      const P = o.pool, pw = P.w * S, pd = P.d * S, cx = P.dx * S, cz = P.dz * S, W2 = pw / 2, D2 = pd / 2;
      let lo = Infinity; for (const ax of [-W2, 0, W2]) for (const az of [-D2, 0, D2]) lo = Math.min(lo, gL(cx + ax, cz + az));
      const y0 = isFinite(lo) ? lo : GY, rim = y0 + 1.3, wlv = y0 + 0.95;
      const mSt = new MeshStandardMaterial({ color: 0xbfae8c, roughness: 0.95 }), mSt2 = new MeshStandardMaterial({ color: 0xa8987a, roughness: 0.95 });
      const box = (w, h, d, m, x, y, z) => { const b = new Mesh(new BoxGeometry(w, h, d), m); b.position.set(x, y + h / 2, z); b.castShadow = b.receiveShadow = true; G.add(noPick(b)); return b; };
      box(pw + 2, rim - y0 + 1.5, 1, mSt, cx, y0 - 1.5, cz - D2 - 0.5); box(pw + 2, rim - y0 + 1.5, 1, mSt, cx, y0 - 1.5, cz + D2 + 0.5);
      box(1, rim - y0 + 1.5, pd, mSt, cx - W2 - 0.5, y0 - 1.5, cz); box(1, rim - y0 + 1.5, pd, mSt, cx + W2 + 0.5, y0 - 1.5, cz); box(pw, 0.2, pd, mSt2, cx, y0 - 1.6, cz);
      const water = new Mesh(new PlaneGeometry(pw, pd).rotateX(-Math.PI / 2), swirlMat()); water.position.set(cx, wlv, cz); water.renderOrder = 2; G.add(noPick(water));
      const W2b = W2 + 0.5, D2b = D2 + 0.5;
      for (let i = 0; i < 46; i++) { const side = i % 4, u = rr() * 2 - 1;
        const x = side < 2 ? cx + u * W2b : cx + (side === 2 ? -W2b : W2b), z = side < 2 ? cz + (side === 0 ? -D2b : D2b) : cz + u * D2b;
        if (Math.hypot(x, z - FZ) < 2.4 * S) continue; boulderL(x, rim + 0.2, z, (0.7 + rr() * 0.9) * S); }
      for (let i = 0; i < 14; i++) { const sd = i % 2 ? 1 : -1, x = cx + sd * (W2b + 0.9), z = cz + (rr() - 0.5) * pd; clumpL(x, gL(x, z), z, (0.8 + rr() * 0.5) * S); }
      for (let i = 0; i < 8; i++) { const x = cx + (rr() - 0.5) * pw, z = cz + (cz < 0 ? D2b + 1.2 + rr() * 1.5 : -(D2b + 1.2 + rr() * 1.5)); bushL(x, gL(x, z), z, (0.9 + rr() * 0.5) * S); }
      { const ax = (cx > 0 ? 0.9 : -0.9) * S, az = -0.9 * S, ex = cx + (cx > 0 ? -W2 : W2), ez = Math.min(cz + D2 - 1, az - 1.5), Lr = Math.hypot(ex - ax, ez - az);
        const rill = new Mesh(new PlaneGeometry(0.45 * S, Lr).rotateX(-Math.PI / 2), new MeshStandardMaterial({ color: 0x8fc3ec, roughness: 0.1, transparent: true, opacity: 0.85 }));
        rill.position.set((ax + ex) / 2, Math.max(gL((ax + ex) / 2, (az + ez) / 2), rim - 0.4) + 0.07, (az + ez) / 2); rill.rotation.y = Math.atan2(ex - ax, ez - az); G.add(noPick(rill)); }
      POOL = { y0, rim, wl: wlv, water };
    }
    // ---- the lights: the torches (warm, from the front, the procession's side) and the moon (bluish, high)
    const LO = Object.assign({ torch: 85, moon: 34, torchColor: 0xffa04a, moonColor: 0x8fb2ff, torchPos: [2.6, 3.6, -5.2], moonPos: [-9, 18, -12] }, o.lights || {});
    const torch = new PointLight(LO.torchColor, 0, 40 * S, 1.3); torch.position.set(LO.torchPos[0] * S, MY + LO.torchPos[1] * S, LO.torchPos[2] * S); G.add(torch);
    const moon = new PointLight(LO.moonColor, 0, 90 * S, 0.6); moon.position.set(LO.moonPos[0] * S, MY + LO.moonPos[1] * S, LO.moonPos[2] * S); G.add(moon);
    const setLit = (k) => { torch.intensity = LO.torch * k; moon.intensity = LO.moon * k; };   // (two lights, always in the scene: no new shaders when lit)
    const RO = Object.assign({ name: "water", dur: 4.5, gain: 3.2 }, o.roar || {});
    const roar = () => { if (typeof o.sfx === "function") try { o.sfx(RO.name, { dur: RO.dur, gain: RO.gain }); } catch (_) {} };
    const tick = (tt) => {
      fallTex.offset.y = -tt * 2.4;
      swirlTex.rotation = -tt * 0.9; for (let i = 0; i < EXTRA.length; i++) EXTRA[i].rotation = -tt * 0.25 * (i % 2 ? -1 : 1);
      for (let k = 0; k < NP; k++) { const p = SPp[k], u = (p.ph + tt * p.sp) % 1, r = p.v * u * 0.5 * S;
        spos[k * 3] = Math.cos(p.a) * r; spos[k * 3 + 1] = yBot + 0.02 + p.h * 4 * u * (1 - u) * S; spos[k * 3 + 2] = FZ + Math.sin(p.a) * r * 0.8; }
      sg.attributes.position.needsUpdate = true;
      foam.position.set(0, yBot + 0.02, FZ); foam.visible = yBot <= BY + 0.05; spray.visible = foam.visible;
      foam.rotation.y = tt * 1.7; foam.scale.setScalar(1 + 0.08 * Math.sin(tt * 9));
    };
    tick(0);
    const [mx, mz] = W(0, 0.3 * S);
    // where one stands to fill a vessel under the fall (NATURAL_POOL_B2): on the bank on the fall's left, facing across it; off = the vessel's
    // mouth from the figure in the figure's own frame (facing +z) - { x, z } -> { x, z, yaw } in the world
    const standFor = (off) => { const ox = (off && off.x) || 0, oz = (off && off.z) || 0.9; if (!LK) { const [x, z] = W(-ox, FZ - oz); return { x, z, yaw }; } const [x, z] = W(-oz, FZ + ox); return { x, z, yaw: yaw + Math.PI / 2 }; };
    return { G, mouth: { x: mx, y: MY, z: mz }, basinY: BY, pool: POOL, lake: LAKE, standFor, setBottom, setLit, roar, tick, swirlMat, batchPlants, clump: toL(clumpL), boulder: toL(boulderL), bush: toL(bushL), lights: { torch, moon } };
  }
