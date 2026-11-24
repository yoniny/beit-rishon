  // plugin/js/vessels.js
  // ===== Beit Sheni 1.3.0 (the user: "את המיצגים כמו מנורה שולחן וכו' ... תעביר לבית שני", one of each): the menorah with its stone of
  // three steps, the table of the showbread and the golden altar - the geometry of the First Temple plugin (55-interior.js, 1.0.1-K/L,
  // built in tefachim after Menachot 28b / Rambam Beit HaBechirah 3:10 and Menachot 11:5 / Rambam 3:12-15), ONE of each, placed as the
  // Rambam places them (1:7; 3:17 "משליש ההיכל ולפנים כנגד הפרוכת"; Yoma 33b: the table in the north and the menorah in the south, each
  // 2.5 amot from its wall, the altar between them drawn a little outward). The lamps run north-south (Rambam 3:12). The materials of the
  // menorah and the table can be switched (ctx.shared.vesselMetal: gold / silver / iron plated with tin - Menachot 28b, Rosh Hashanah 24b,
  // Avodah Zarah 43a; Rambam 1:19). The golden altar: 1 x 1 (Rambam 3:17), 2 high (Ex 30:2 "ואמתים קמתו"; a model choice for the house).
  var INT_TEF = 1 / 6;
  var int_texCache = {};
  function int_m4(x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const m = new Matrix4();
    m.compose(new Vector3(x, y, z), new Quaternion().setFromEuler(new Euler(rx, ry, rz)), new Vector3(sx, sy, sz));
    return m;
  }
  function int_inst(parent, geo, mat, mats, shadows = true) {
    const im = new InstancedMesh(geo, mat, mats.length);
    mats.forEach((mm, i) => im.setMatrixAt(i, mm));
    im.castShadow = shadows;
    im.receiveShadow = shadows;
    parent.add(im);
    return im;
  }
  // a part of a vessel standing at (tx, ty, tz) and turned by rot about y: local offset (lx, ly, lz) -> world matrix
  function int_part(tx, ty, tz, rot, lx, ly, lz, ry = 0, rx = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const c = Math.cos(rot), s = Math.sin(rot);
    return int_m4(tx + lx * c + lz * s, ty + ly, tz - lx * s + lz * c, rx, rot + ry, rz, sx, sy, sz);
  }
  // 1.0.1-K review (interior-3): a Mesh.raycast that finds nothing, for a mesh that is no surface (the incense smoke)
  function int_canvasTex(w, h, draw, bumpDraw) {
    const mk = (fn, srgb) => {
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      fn(cv.getContext("2d"), w, h);
      const t = new CanvasTexture(cv);
      t.wrapS = t.wrapT = RepeatWrapping;
      if (srgb) t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    };
    return { map: mk(draw, true), bumpMap: bumpDraw ? mk(bumpDraw, false) : null };
  }
  const int_rep = (t, ru, rv) => { t.map.repeat.set(ru, rv); if (t.bumpMap) t.bumpMap.repeat.set(ru, rv); return t; };
  function int_crownTex() {
    if (int_texCache.crown) return int_texCache.crown;
    const draw = (c, w, h, bump) => {
      if (bump) { c.fillStyle = "#7a7a7a"; c.fillRect(0, 0, w, h); }
      else {
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#fff3c2"); g.addColorStop(0.45, "#f3d374"); g.addColorStop(1, "#d6a944");
        c.fillStyle = g; c.fillRect(0, 0, w, h);
      }
      const ink = bump ? "#2e2e2e" : "rgba(122,82,18,0.9)", hi = bump ? "#e6e6e6" : "rgba(255,249,222,0.95)";
      c.lineWidth = 1.5;
      for (let k = 0; k < 4; k++) {
        const cx = k * 64 + 32, cy = h / 2;
        for (let p = 0; p < 6; p++) {
          const a = p * Math.PI / 3;
          c.beginPath(); c.ellipse(cx + Math.cos(a) * 9, cy + Math.sin(a) * 9, 8, 4.5, a, 0, Math.PI * 2);
          c.fillStyle = hi; c.fill(); c.strokeStyle = ink; c.stroke();
        }
        c.beginPath(); c.arc(cx, cy, 4.5, 0, Math.PI * 2); c.fillStyle = ink; c.fill();
        for (const s of [-1, 1]) {
          c.beginPath(); c.ellipse(cx + s * 23, cy, 8, 3.6, s * 0.5, 0, Math.PI * 2);
          c.fillStyle = hi; c.fill(); c.strokeStyle = ink; c.stroke();
        }
      }
      c.lineWidth = 1;
      for (let x = 4; x < w; x += 8) for (const y of [5, h - 5]) {
        c.beginPath(); c.arc(x, y, 2.6, 0, Math.PI * 2); c.fillStyle = hi; c.fill(); c.strokeStyle = ink; c.stroke();
      }
    };
    int_texCache.crown = int_rep(int_canvasTex(256, 64, (c, w, h) => draw(c, w, h, false), (c, w, h) => draw(c, w, h, true)), 1 / 0.28, 1 / 0.07);
    return int_texCache.crown;
  }
  function int_speckleTex(key, base, spots, n, rMax) {
    if (int_texCache[key]) return int_texCache[key];
    int_texCache[key] = int_rep(int_canvasTex(128, 128, (c, w, h) => {
      c.fillStyle = base; c.fillRect(0, 0, w, h);
      for (let i = 0; i < n; i++) {
        const x = hash(i * 1.93 + key.length) * w, y = hash(i * 3.71 + key.length) * h, r = 1 + hash(i * 5.37) * rMax;
        c.fillStyle = spots[i % spots.length];
        for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) {
          if (x + ox + r < 0 || x + ox - r > w || y + oy + r < 0 || y + oy - r > h) continue;
          c.beginPath(); c.arc(x + ox, y + oy, r, 0, Math.PI * 2); c.fill();
        }
      }
    }), 2, 2);
    return int_texCache[key];
  }
  function int_almondTex() {
    if (int_texCache.almond) return int_texCache.almond;
    const draw = (c, w, h, bump) => {
      c.fillStyle = bump ? "#9a9a9a" : "#f0cf6a";
      c.fillRect(0, 0, w, h);
      c.fillStyle = bump ? "#343434" : "rgba(150,100,24,0.5)";
      c.beginPath(); c.ellipse(w / 2, h / 2, w * 0.2, h * 0.34, 0, 0, Math.PI * 2); c.fill();
    };
    int_texCache.almond = int_rep(int_canvasTex(32, 32, (c, w, h) => draw(c, w, h, false), (c, w, h) => draw(c, w, h, true)), 14, 10);
    return int_texCache.almond;
  }
  function int_fretTex() {
    if (int_texCache.fret) return int_texCache.fret;
    int_texCache.fret = int_rep(int_canvasTex(256, 64, (c, w, h) => {
      c.clearRect(0, 0, w, h);
      c.lineWidth = 7; c.strokeStyle = "#ecc65c";
      for (let k = -1; k <= 8; k++) { c.beginPath(); c.ellipse(k * 32 + 16, 32, 21, 19, 0, 0, Math.PI * 2); c.stroke(); }
      c.lineWidth = 2.4; c.strokeStyle = "#fff4c8";
      for (let k = -1; k <= 8; k++) { c.beginPath(); c.ellipse(k * 32 + 16, 31, 20, 17, 0, Math.PI * 1.12, Math.PI * 1.88); c.stroke(); }
      c.fillStyle = "#ecc65c"; c.fillRect(0, 0, w, 7); c.fillRect(0, h - 7, w, 7);
      c.fillStyle = "#fff4c8"; c.fillRect(0, 1, w, 2);
    }), 1 / 0.36, 1 / 0.09);
    return int_texCache.fret;
  }

  // ===== the carved gold of the walls (the First Temple plugin's 55-interior.js 1.0.1-K/L): cherubim, palms, open flowers, ropes and the
  // weave, drawn on canvas; in the Second Temple "כרובים דצורתא הוו קיימי" (Yoma 54a, R. Acha b. Yaakov) - carved or painted on the walls
  var INT_CARVE_U = 5, INT_CARVE_V = 10;
  // the layout of the cell (amot: u from its left edge, v up from its bottom). Nothing touches anything else (review H2-CARVE-2; the K.5
  // checks rasterize every motif alone through int_carveDraw's `only` and count the shared pixels: none, but the chains hanging from the
  // upper roses). Measured extents (amot): rope v 0.05..0.48; pair u 0.28..3.72, v 0.48..4.21; knob v 4.82..5.48; chains v 6.29..8.98;
  // roses v 0.52..0.91 and 8.95..9.37 (u 1.37..2.62); palm v 0.48..7.32, its crown u 3.1..5.9 (wrapping 0.9 into the next cell).
  // 1.0.1-L (L.17, the user: "תראה אם מספיק ברור כשזה חלק"): checked at 1280 x 800 from "ההיכל", the carvings' place, "קודש הקדשים" and the
  // doors - close by the figures read, but from the room's views the pairs of cherubim melted into the woven ground (the figures' gold was
  // only ~15% lighter than the weave's, the cut around them 0.03 = under a pixel at the mip levels those views use). So, the figures still
  // FLUSH with the face (Rashi 6:32, Radak 6:29): the cut around every figure 0.05 (cut), the wing a broader band with larger feathers (wing),
  // the woven ground darker and the figures lighter (INT_CARVE_PAL.gold), and a little painted shading inside every figure - light on its
  // upper-left edge, shade on its lower-right (shade / glow; the colour maps only, the figure stays flat).
  var INT_CARVE_LAYOUT = {
    cut: 0.05,                                                 // 1.0.1-L: the cut around every figure (K.5: 0.03)
    wing: { cut: 0.27, band: 0.2, scR: 0.08, scOff: 0.115 },   // 1.0.1-L: the wing's outline and band, its feathers' radius / offset (K.5: 0.2, 0.145, 0.062, 0.085)
    shade: 0.035,                                              // 1.0.1-L: the inner shading's band (amot; relief below)
    rope: { v0: 0.06, v1: 0.46, twist: 0.25 },                // 20 twists in the 5 amot of the cell
    pair: { cx: 2.0, fx: 1.15, vb: 0.5, h: 3.3 },             // the cherubim at cx -+ fx, standing on the rope (vb), 3.3 high; the arch u 0.28..3.72
    lowRoses: { u: [1.6, 2.0, 2.4], v: 0.71, r: 0.2 },        // on the rope between the two figures (their hems end at u 1.25 / 2.75)
    knob: { u: 2.0, v: 5.15, rx: 0.24, ry: 0.31 },
    upRoses: { u: [1.58, 2.0, 2.42], v: 9.15, r: 0.2 },
    chains: { u: [1.7, 2.0, 2.3], v0: 6.3, v1: 8.98 },
    palm: { u: 4.5, vb: 0.5, trunk: 5.9, frond: 1.45 }        // trunk to v 6.4, eleven fronds about 1.4 long
  };
  var INT_CARVE_PAL = {
    // the colour maps: gold (the walls and the doors) and cedar (the carved cedar under the gold, shown by the wall-layers exhibit); the bump
    // map: high = the surface, the woven ground lower, the cuts lowest. 1.0.1-L (L.17): the gold's weave darker (gap #ad882e, link #f2d270)
    // and its figures lighter (f0..f2 #d2a53e, #efcc66, #fbe7a2), the cut darker (#5a3a0a); shade / glow = the figures' inner shading.
    // 1.0.1-L (L.14): the cedar a red-brown wood (K.5's pale #dcbc84 read like the stone beside it in the exhibit)
    gold: { gap: "#8f6c22", link: "#dcb95a", linkHi: "rgba(255,236,170,0.55)", f0: "#e2b64a", f1: "#f8d97a", f2: "#fff0bc", cut: "#4a2e06",
      line: "rgba(96,62,10,0.9)", hi: "rgba(255,246,206,0.85)", ropeA: "#f5d878", ropeB: "#86601a",
      shade: "rgba(120,76,10,0.75)", glow: "rgba(255,250,226,0.9)" },
    // 1.0.1-L (L.31): the cedar's figures lighter and its weave darker, so the carving reads cut in the wood (#8a4c2a / #a8663a / #c4844f on
    // #8c5230 before)
    // (resumed round-L try: the first try's #3e200e / #7a4426 ground read almost black beside the gold; now a warm medium cedar - the
    // figures light, the weave a clear red-brown - distinct from the grey stone and the yellow gold at a glance)
    cedar: { gap: "#5a2e14", link: "#9a5a30", linkHi: "rgba(224,164,112,0.45)", f0: "#b8763f", f1: "#d9985a", f2: "#f0bc80", cut: "#2a1208",
      line: "rgba(50,22,8,0.85)", hi: "rgba(250,212,166,0.65)", ropeA: "#d9985a", ropeB: "#5a2e14",
      shade: "rgba(70,30,12,0.6)", glow: "rgba(250,216,172,0.6)" },
    bump: { gap: "#3c3c3c", link: "#8e8e8e", linkHi: "#a4a4a4", f0: "#b6b6b6", f1: "#d4d4d4", f2: "#ececec", cut: "#121212",
      line: "#6c6c6c", hi: "#f4f4f4", ropeA: "#dadada", ropeB: "#4a4a4a" }
  };
  // one weave cell, s px square: two rows of slanted links s/2 apart (the second row offset by half a link) - a link every 0.078 amah, as
  // fine as the book draws the weave next to its figures; every link is drawn with its wrapped copies, so the cell repeats without a seam
  function int_weaveCell(P, s) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const x = cv.getContext("2d");
    x.fillStyle = P.gap;
    x.fillRect(0, 0, s, s);
    const p = s / 2, pts = [];
    for (const [px, py] of [[p / 2, p / 2], [0, p * 1.5]]) for (let ox = -s; ox <= s; ox += p) for (const oy of [-s, 0, s]) pts.push([px + ox, py + oy]);
    for (const [col, k, dx, dy] of [[P.link, 1, 0, 0], [P.linkHi, 0.5, -0.07 * p, -0.05 * p]]) {
      x.fillStyle = col;
      x.beginPath();
      for (const [px, py] of pts) {
        x.moveTo(px + dx + 0.42 * p * k * Math.cos(-0.55), py + dy + 0.42 * p * k * Math.sin(-0.55));   // the ellipse starts there (no joining line)
        x.ellipse(px + dx, py + dy, 0.42 * p * k, 0.2 * p * k, -0.55, 0, Math.PI * 2);
      }
      x.fill();
    }
    return cv;
  }
  // draws the cell on a context W x Hh px at k px per amah with the palette P. `only` (the K.5 checks): draw one motif alone, no ground.
  function int_carveDraw(c, W, Hh, k, P, only) {
    const L = INT_CARVE_LAYOUT, CU = INT_CARVE_U;
    const want = (n) => !only || only === n;
    const mk = (w, h) => { const cv = document.createElement("canvas"); cv.width = Math.max(1, Math.ceil(w)); cv.height = Math.max(1, Math.ceil(h)); return cv; };
    c.setTransform(1, 0, 0, 1, 0, 0);
    if (only) c.clearRect(0, 0, W, Hh);
    else {
      c.fillStyle = c.createPattern(int_weaveCell(P, Math.round(k * 0.15625)), "repeat");   // 16 px (map) / 8 px (bump): 32 links across, 128 rows up
      c.fillRect(0, 0, W, Hh);
    }
    c.setTransform(k, 0, 0, -k, 0, Hh);                // from here on (u, v) in amot, v up
    c.lineJoin = "round";
    c.lineCap = "round";
    const LW = L.cut;                                  // the cut around every figure (1.0.1-L: 0.05, K.5 0.03)
    // the smooth, rounded face of a figure (a gradient across it), then its cut outline. 1.0.1-L (L.17): `build` makes the figure's path (it
    // is made again for each step); where the palette has shade / glow (the colour maps), a little shading inside the figure: clipped to the
    // figure, its own outline is stroked again shifted up-left (so the band falls inside its lower-right edges: the shade) and shifted
    // down-right (inside its upper-left edges: the light), in three soft passes. Cheap - no canvas shadows (the first round-L try blurred
    // a shadow of a 15 x 30-amot shape per figure: the canvas of the live page was reset half-way and the walls rendered dark). The figure
    // itself stays flush (Rashi 6:32, Radak 6:29) - this is colour only.
    const relief = (u0, u1, build) => {
      const gr = c.createLinearGradient(u0, 0, u1, 0);
      gr.addColorStop(0, P.f0); gr.addColorStop(0.3, P.f1); gr.addColorStop(0.55, P.f2); gr.addColorStop(0.8, P.f1); gr.addColorStop(1, P.f0);
      c.fillStyle = gr;
      c.beginPath(); build(); c.fill();
      if (P.shade) {
        c.save();
        c.beginPath(); build(); c.clip();
        for (const [col, s] of [[P.shade, 1], [P.glow, -1]]) for (const f of [1, 0.66, 0.33]) {
          c.save();
          c.translate(-s * L.shade * f, s * L.shade * f);     // shade: up-left (u -, v +); light: down-right
          c.globalAlpha = 0.45;
          c.strokeStyle = col; c.lineWidth = 2 * L.shade * f;
          c.beginPath(); build(); c.stroke();
          c.restore();
        }
        c.restore();
      }
      c.beginPath(); build();
      c.strokeStyle = P.cut;
      c.lineWidth = LW;
      c.stroke();
    };
    const lines = (draw, w, col) => { c.beginPath(); draw(); c.strokeStyle = col || P.line; c.lineWidth = w; c.stroke(); };
    // a motif crossing a side edge of the cell is drawn again on the other side
    const wrapped = (u0, u1, fn) => {
      for (const du of [-CU, 0, CU]) if (u1 + du > 0 && u0 + du < CU) { c.save(); c.translate(du, 0); fn(); c.restore(); }
    };
    // stamps: a motif drawn once in its own canvas (at this canvas's scale) and stamped where it repeats (FIXES K 0.6)
    const stamp = (w, h, draw) => {
      const cv = mk(w * k, h * k), x = cv.getContext("2d");
      x.setTransform(k, 0, 0, -k, 0, h * k);
      x.lineJoin = "round";
      x.lineCap = "round";
      draw(x);
      return cv;
    };
    const put = (cv, u, v, w, h) => {                  // the stamp's centre at (u, v); drawn in canvas pixels (no flip)
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(cv, u * k - cv.width / 2, Hh - v * k - cv.height / 2); c.restore();
    };
    // ---- the rope ("פטורי" - Rashi: "חבלים"): strands at k * twist, so the twist at u and at u + 5 are the same strand ----
    if (want("rope")) {
      const { v0, v1, twist } = L.rope, h = v1 - v0, vm = (v0 + v1) / 2, n = Math.round(CU / twist);
      c.fillStyle = P.ropeB;
      c.fillRect(0, v0, CU, h);
      const ra = h * 0.55, rb = twist * 0.27, rot = 1.05;          // a strand: a long oval slanted 60 deg, the strands side by side = a twist
      c.beginPath();
      for (let i = -1; i <= n + 1; i++) { const u = i * twist; c.moveTo(u + ra * Math.cos(rot), vm + ra * Math.sin(rot)); c.ellipse(u, vm, ra, rb, rot, 0, Math.PI * 2); }
      c.fillStyle = P.ropeA;
      c.fill();
      c.strokeStyle = P.cut;
      c.lineWidth = 0.014;
      c.stroke();
      lines(() => { for (let i = -1; i <= n + 1; i++) { const u = i * twist - rb * 0.3; c.moveTo(u - ra * 0.55 * Math.cos(rot), vm - ra * 0.55 * Math.sin(rot)); c.lineTo(u + ra * 0.5 * Math.cos(rot), vm + ra * 0.5 * Math.sin(rot)); } }, 0.016, P.hi);
      lines(() => { c.moveTo(-0.1, v0); c.lineTo(CU + 0.1, v0); c.moveTo(-0.1, v1); c.lineTo(CU + 0.1, v1); }, 0.02, P.cut);
    }
    // ---- the roses ("ציצים" - open flowers): one rose drawn once, stamped ----
    const rose = (x, r) => {
      const petal = (cx, cy, rr) => { x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * 2); x.fillStyle = P.f1; x.fill(); x.strokeStyle = P.cut; x.lineWidth = LW * 0.8; x.stroke(); };
      for (let i = 0; i < 5; i++) { const a = Math.PI / 2 + i * Math.PI * 2 / 5; petal(r + Math.cos(a) * r * 0.52, r + Math.sin(a) * r * 0.52, r * 0.44); }
      for (let i = 0; i < 5; i++) { const a = Math.PI / 2 + Math.PI / 5 + i * Math.PI * 2 / 5; petal(r + Math.cos(a) * r * 0.26, r + Math.sin(a) * r * 0.26, r * 0.3); }
      x.beginPath(); x.arc(r, r, r * 0.16, 0, Math.PI * 2); x.fillStyle = P.f2; x.fill(); x.strokeStyle = P.cut; x.lineWidth = LW * 0.7; x.stroke();
    };
    if (want("roses")) {
      const R = L.lowRoses.r, cv = stamp(2 * R + 0.06, 2 * R + 0.06, (x) => { x.translate(0.03, 0.03); rose(x, R); });
      for (const u of L.lowRoses.u) put(cv, u, L.lowRoses.v, 2 * R, 2 * R);
      for (const u of L.upRoses.u) put(cv, u, L.upRoses.v, 2 * R, 2 * R);
    }
    // ---- the chains (Targum "אטונין"; II Chr 3:5 "ושרשרות"): one chain drawn once, stamped three times under the upper roses ----
    if (want("chains")) {
      const { v0, v1 } = L.chains, len = v1 - v0, step = 0.085, w = 0.12;
      const cv = stamp(w, len, (x) => {
        x.beginPath();
        for (let v = step / 2, i = 0; v < len; v += step, i++) {
          if (i % 2) { x.moveTo(w / 2, v - 0.045); x.lineTo(w / 2, v + 0.045); }
          else { x.moveTo(w / 2 + 0.034, v); x.ellipse(w / 2, v, 0.034, 0.052, 0, 0, Math.PI * 2); }
        }
        x.strokeStyle = P.cut; x.lineWidth = 0.034; x.stroke();
        x.strokeStyle = P.f2; x.lineWidth = 0.014; x.stroke();
      });
      for (const u of L.chains.u) put(cv, u, (v0 + v1) / 2, w, len);
    }
    // ---- the knob ("פקעים" - "כמין כפתורים", eggs): a rounded egg above the pair ----
    if (want("knob")) {
      const { u, v, rx, ry } = L.knob;
      c.beginPath(); c.ellipse(u, v, rx, ry, 0, 0, Math.PI * 2);
      const gr = c.createRadialGradient(u - rx * 0.35, v + ry * 0.35, rx * 0.1, u, v, ry * 1.05);
      gr.addColorStop(0, P.f2); gr.addColorStop(0.55, P.f1); gr.addColorStop(1, P.f0);
      c.fillStyle = gr; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW; c.stroke();
      lines(() => { c.ellipse(u - rx * 0.32, v + ry * 0.38, rx * 0.22, ry * 0.12, -0.6, 0, Math.PI * 2); }, 0.012, P.hi);
    }
    // ---- the pair of cherubim: the left figure faces right (+u); the right one is its mirror image about the pair's centre ----
    const figure = (x0, vb) => {                       // in the pair's frame (u = 0 at its centre); vb = the hem
      // the wing first: from the back of the shoulder out, up behind the head and over it to the centre, where it meets the other's wing
      const B0 = [x0 - 0.12, vb + 2.55], B1 = [x0 - 0.56, vb + 2.82], B2 = [x0 - 0.5, vb + 3.66], B3 = [x0 + 0.05, vb + 3.6];
      const bez = (t) => { const s = 1 - t; return [s * s * s * B0[0] + 3 * s * s * t * B1[0] + 3 * s * t * t * B2[0] + t * t * t * B3[0], s * s * s * B0[1] + 3 * s * s * t * B1[1] + 3 * s * t * t * B2[1] + t * t * t * B3[1]]; };
      // 1.0.1-L (L.17): the feathers larger and the band broader (L.wing), so the wing reads as a wing from the room's views
      const WG = L.wing;
      c.beginPath();                                   // the feathers along the outer edge of the curl (scallops)
      for (let i = 0; i < 8; i++) {
        const t = 0.1 + i * 0.1, p = bez(t), q = bez(t + 0.01), du = q[0] - p[0], dv = q[1] - p[1], n = Math.hypot(du, dv) || 1;
        const cxp = p[0] - dv / n * WG.scOff, cyp = p[1] + du / n * WG.scOff;
        c.moveTo(cxp + WG.scR, cyp); c.arc(cxp, cyp, WG.scR, 0, Math.PI * 2);
      }
      c.fillStyle = P.f1; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW * 0.8; c.stroke();
      const path = () => { c.moveTo(B0[0], B0[1]); c.bezierCurveTo(B1[0], B1[1], B2[0], B2[1], B3[0], B3[1]); c.lineTo(0, vb + 3.6); };
      lines(path, WG.cut, P.cut);                      // the wing: its cut outline, then the gold band, then the feather lines on it
      lines(path, WG.band, P.f1);
      lines(path, WG.band * 0.35, P.f2);               // 1.0.1-L: a lighter ridge along the band (its rounded face, painted)
      lines(() => { for (let i = 0; i < 9; i++) { const p = bez(0.08 + i * 0.1); c.moveTo(p[0], p[1]); c.lineTo(p[0] + (x0 + 0.05 - p[0]) * 0.15, p[1] + (vb + 3.62 - p[1]) * 0.15); } }, 0.016);
      lines(() => { for (let u = x0 + 0.15; u < -0.02; u += 0.09) { c.moveTo(u, vb + 3.6 - WG.band * 0.42); c.lineTo(u + 0.06, vb + 3.6 + WG.band * 0.42); } }, 0.016);
      // the robe: from the hem (flared) to the neck, no arms
      relief(x0 - 0.42, x0 + 0.4, () => {
        c.moveTo(x0 + 0.4, vb);
        c.quadraticCurveTo(x0 + 0.15, vb + 0.35, x0 + 0.15, vb + 1.5);
        c.lineTo(x0 + 0.13, vb + 2.5);
        c.quadraticCurveTo(x0 + 0.13, vb + 2.76, x0 + 0.06, vb + 2.86);
        c.lineTo(x0 - 0.08, vb + 2.86);
        c.quadraticCurveTo(x0 - 0.17, vb + 2.7, x0 - 0.17, vb + 2.4);
        c.lineTo(x0 - 0.18, vb + 1.5);
        c.quadraticCurveTo(x0 - 0.19, vb + 0.35, x0 - 0.42, vb);
        c.closePath();
      });
      lines(() => {                                    // the long folds of the robe
        c.moveTo(x0 + 0.02, vb + 1.7); c.quadraticCurveTo(x0 + 0.04, vb + 0.7, x0 + 0.17, vb + 0.06);
        c.moveTo(x0 - 0.07, vb + 1.35); c.quadraticCurveTo(x0 - 0.09, vb + 0.6, x0 - 0.22, vb + 0.06);
      }, 0.016);
      // the head: a child's face in profile, the hair a cap over the top and the back. 1.0.1-L (L.35, "פרצופי הכרובים נוראים" - the carved
      // ones checked too): K.5's head was an oval with a triangle nose and a dark dot for the eye; now a drawn profile - forehead, a straight
      // nose, the lips, a rounded chin - an almond eye of two thin lids (no dot) and a cap of hair with its hairline (model choice, as the
      // book's calm faces)
      const hy = vb + 3.05, hx = x0 + 0.02;
      const PROF = [[0, 0.2], [0.13, 0.15], [0.165, 0.06], [0.162, 0.035], [0.207, -0.035], [0.168, -0.058], [0.177, -0.088], [0.161, -0.104],
        [0.17, -0.122], [0.152, -0.168], [0.09, -0.2], [0, -0.19], [-0.085, -0.15], [-0.168, 0], [-0.11, 0.165]];
      const smooth = (pts) => {                          // a closed smooth path through the midpoints of the points
        const m = (k) => { const a = pts[k % pts.length], b = pts[(k + 1) % pts.length]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
        let p = m(pts.length - 1);
        c.moveTo(hx + p[0], hy + p[1]);
        for (let k = 0; k < pts.length; k++) { p = m(k); c.quadraticCurveTo(hx + pts[k][0], hy + pts[k][1], hx + p[0], hy + p[1]); }
        c.closePath();
      };
      relief(hx - 0.17, hx + 0.21, () => smooth(PROF));
      c.beginPath();                                     // the hair: from the hairline over the crown and the back to the nape
      c.moveTo(hx + 0.118, hy + 0.152);
      c.quadraticCurveTo(hx + 0.02, hy + 0.235, hx - 0.115, hy + 0.18);
      c.quadraticCurveTo(hx - 0.205, hy + 0.04, hx - 0.105, hy - 0.16);
      c.quadraticCurveTo(hx - 0.045, hy - 0.06, hx - 0.01, hy + 0.0);
      c.quadraticCurveTo(hx + 0.05, hy + 0.1, hx + 0.118, hy + 0.152);
      c.closePath();
      c.fillStyle = P.f0; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW * 0.7; c.stroke();
      lines(() => { for (let i = 0; i < 4; i++) { const a = Math.PI * (0.5 + i * 0.2); c.moveTo(hx + Math.cos(a) * 0.07, hy + 0.04 + Math.sin(a) * 0.08); c.lineTo(hx + Math.cos(a) * 0.17, hy + 0.04 + Math.sin(a) * 0.17); } }, 0.008);
      lines(() => {                                      // the eye: two thin lids, the upper one curved
        c.moveTo(hx + 0.088, hy + 0.03); c.quadraticCurveTo(hx + 0.115, hy + 0.05, hx + 0.142, hy + 0.028);
        c.moveTo(hx + 0.092, hy + 0.027); c.quadraticCurveTo(hx + 0.118, hy + 0.012, hx + 0.14, hy + 0.024);
      }, 0.009);
      lines(() => { c.moveTo(hx + 0.128, hy + 0.068); c.quadraticCurveTo(hx + 0.142, hy + 0.078, hx + 0.158, hy + 0.066); }, 0.007);   // the brow
      lines(() => { c.moveTo(hx + 0.135, hy - 0.104); c.lineTo(hx + 0.158, hy - 0.104); }, 0.008);   // the closed mouth
    };
    if (want("pair")) {
      const { cx, fx, vb } = L.pair;
      for (const s of [-1, 1]) { c.save(); c.translate(cx, 0); c.scale(s, 1); figure(-fx, vb); c.restore(); }
      lines(() => { c.moveTo(cx, vb + 3.6 - L.wing.band / 2); c.lineTo(cx, vb + 3.6 + L.wing.band / 2); }, 0.022, P.cut);   // where the two wings touch
    }
    // ---- the palm ("תמרת"): a tall trunk with scales, nine fronds, two bunches of dates ----
    const leaf = (x0, y0, cu, cv, tu, tv, w) => {
      const du = tu - x0, dv = tv - y0, n = Math.hypot(du, dv) || 1, nu = -dv / n * w, nv = du / n * w;
      c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(cu + nu, cv + nv, tu, tv); c.quadraticCurveTo(cu - nu, cv - nv, x0, y0); c.closePath();
      c.fillStyle = P.f1; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW * 0.7; c.stroke();
      lines(() => {                                    // the midrib and the leaflets on both sides of it, slanting back to the crown
        c.moveTo(x0, y0); c.quadraticCurveTo(cu, cv, tu, tv);
        for (let t = 0.18; t < 0.95; t += 0.07) {
          const s = 1 - t, bu = s * s * x0 + 2 * s * t * cu + t * t * tu, bv = s * s * y0 + 2 * s * t * cv + t * t * tv, f = 0.9 * (1 - t * 0.55);
          let gu = 2 * s * (cu - x0) + 2 * t * (tu - cu), gv = 2 * s * (cv - y0) + 2 * t * (tv - cv);
          const gn = Math.hypot(gu, gv) || 1;
          gu = gu / gn * w * 0.9; gv = gv / gn * w * 0.9;
          c.moveTo(bu + nu * f - gu, bv + nv * f - gv); c.lineTo(bu, bv); c.lineTo(bu - nu * f - gu, bv - nv * f - gv);
        }
      }, 0.011);
    };
    const palm = () => {
      const { u: pu, vb, trunk, frond } = L.palm, top = vb + trunk;
      relief(pu - 0.17, pu + 0.17, () => {
        c.moveTo(pu - 0.17, vb); c.quadraticCurveTo(pu - 0.11, vb + 2.5, pu - 0.1, top); c.lineTo(pu + 0.1, top); c.quadraticCurveTo(pu + 0.11, vb + 2.5, pu + 0.17, vb); c.closePath();
      });
      lines(() => { for (let v = vb + 0.14; v < top - 0.06; v += 0.16) { const w = 0.15 - 0.055 * (v - vb) / trunk; c.moveTo(pu - w, v + 0.075); c.lineTo(pu, v); c.lineTo(pu + w, v + 0.075); } }, 0.014);
      for (let i = 0; i < 11; i++) {                   // eleven broad fronds arching out from the crown and drooping at their tips
        const a = Math.PI * (-0.1 + 1.2 * i / 10), len = frond - 0.3 * Math.abs(i - 5) / 5, ca = Math.cos(a), sa = Math.sin(a);
        leaf(pu, top, pu + ca * len * 0.5, top + sa * len * 0.5 + 0.3, pu + ca * len, top + sa * len * 0.62 - 0.38 * Math.abs(ca), 0.12);
      }
      c.beginPath();                                   // the dates
      for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { const du = s * (0.16 + (i % 2) * 0.06), dv = -0.12 - Math.floor(i / 2) * 0.07; c.moveTo(pu + du + 0.035, top + dv); c.arc(pu + du, top + dv, 0.035, 0, Math.PI * 2); }
      c.fillStyle = P.f2; c.fill(); c.strokeStyle = P.cut; c.lineWidth = LW * 0.5; c.stroke();
    };
    if (want("palm")) wrapped(L.palm.u - L.palm.frond - 0.1, L.palm.u + L.palm.frond + 0.1, palm);
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
  var int_carvedCache = null;
  function int_carvedTex() {
    if (int_carvedCache) return int_carvedCache;
    const mk = (w, h) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; return cv; };
    const W = 512, Hh = 1024, k = W / INT_CARVE_U;    // 102.4 px per amah
    const mc = mk(W, Hh), bc = mk(W / 2, Hh / 2);
    int_carveDraw(mc.getContext("2d"), W, Hh, k, INT_CARVE_PAL.gold);
    int_carveDraw(bc.getContext("2d"), W / 2, Hh / 2, k / 2, INT_CARVE_PAL.bump);
    const map = new CanvasTexture(mc);
    map.wrapS = map.wrapT = RepeatWrapping;
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 8;
    const bumpMap = new CanvasTexture(bc);
    bumpMap.wrapS = bumpMap.wrapT = RepeatWrapping;
    bumpMap.anisotropy = 4;
    int_carvedCache = { map, bumpMap };
    return int_carvedCache;
  }
  // the carved cedar's colour map (the same cell in wood colours): drawn only when the wall-layers exhibit is first shown (load time)
  function int_carvedCedarMap() {
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 1024;
    const c = cv.getContext("2d"), k = 512 / INT_CARVE_U;
    int_carveDraw(c, 512, 1024, k, INT_CARVE_PAL.cedar);
    // 1.0.1-L (L.31, the user: "העץ בשכבות ההיכל לא מספיק מחודד"): the cedar's own boards - upright, from the floor to the ceiling (6:15
    // "ויבן את קירות הבית מביתה בצלעות ארזים מקרקע הבית עד קירות הספן"), 1 amah wide (model choice): a dark joint and a light bevel beside it
    // every amah of the cell (the joints on the cell's edges meet across the seam), so the layer reads as wooden boards, the carving cut in them
    for (let b = 0; b <= INT_CARVE_U; b++) {
      const x = Math.round(b * k);
      c.fillStyle = "rgba(22,9,3,0.92)"; c.fillRect(x - 2, 0, 4, 1024);
      c.fillStyle = "rgba(232,176,126,0.5)"; c.fillRect(x + 2, 0, 2, 1024);
    }
    const t = new CanvasTexture(cv);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }
  // a carved-gold material whose cell spans tileU x tileV amot of the uvs (int_boxUV gives uvs in amot): the walls 5 x 10, the heichal
  // doors 5 x 9.9 (two registers on a 19.8 leaf), the devir doors 3 x 5.9 (two on 11.8; review H2-CARVE-3). Gold via goldStd (FIXES K 0.4).
  function int_carvedMat(tileU, tileV, extra) {
    const t = int_carvedTex();
    const map = t.map.clone(), bump = t.bumpMap.clone();
    map.needsUpdate = true;
    bump.needsUpdate = true;
    map.repeat.set(1 / tileU, 1 / tileV);
    bump.repeat.set(1 / tileU, 1 / tileV);
    return vsl_goldStd({ map, bumpMap: bump }, Object.assign({ bumpScale: 1.1 }, extra || {}));
  }
  // uvs from positions: fn(nx, ny, nz, x, y, z) -> [u, v] in amot for every vertex, (x, y, z) = the vertex + (ox, oy, oz) (the mesh's offset
  // in the frame fn works in) - so the carving runs on across the pieces of a wall and the boards of a door, and no face is mirrored
  function int_boxUV(geo, ox, oy, oz, fn) {
    const p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      const r = fn(n.getX(i), n.getY(i), n.getZ(i), p.getX(i) + ox, p.getY(i) + oy, p.getZ(i) + oz);
      uv.setXY(i, r[0], r[1]);
    }
    uv.needsUpdate = true;
    return geo;
  }
  // a box between two corners, its uvs by fn (world positions) - pushed to `list` for merging
  function int_uvBox(list, x0, x1, y0, y1, z0, z1, fn) {
    const geo = new BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
    geo.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    int_boxUV(geo, 0, 0, 0, fn);
    list.push(geo);
    return geo;
  }
  // the house floor (6:15 "ויצף את קרקע הבית בצלעות ברושים", 6:30 "ואת קרקע הבית צפה זהב לפנימה ולחיצון"): gold over cypress boards, the
  // joints showing faintly through it (FIXES K.5.4). 512 px = 8 amot; boards 1 amah wide, running east-west (as the book draws the floor,
  // p08R), each 8 long, the ends staggered (width, length: model choice). The board's tone varies a little; the joints are cut in the bump.
  // `wood` = the bare cypress (the wall-layers exhibit): 256 px = 4 amot.
  var VSL_GOLD_OPTS = { color: 0xFFF1C8, metalness: 0.5, roughness: 0.32, envMapIntensity: 1.3, emissive: 0x5a400f, emissiveIntensity: 0.45 };   // the First Temple's gold recipe (1.0.1-K)
  function vsl_std(tex, opts) {
    return new MeshStandardMaterial(Object.assign({ map: tex.map, bumpMap: tex.bumpMap || null, bumpScale: tex.bumpMap ? 1.2 : 0, roughness: 0.92, metalness: 0 }, opts || {}));
  }
  function vsl_goldStd(tex, extra) {
    return vsl_std(tex, Object.assign({}, VSL_GOLD_OPTS, extra || {}));
  }
  // 1.9.4 (the user, 11.11.2026, of the menorah's "כסף": "לחיצה על המתג לא מביאה את התוצאה הרצויה"): the silver and the tin were drawn with
  // the gold's own colour picture, so "silver" came out pale gold. Their picture is the same drawing in grey; the relief stays.
  function vsl_greyTex(tex) {
    try {
      const src = tex && tex.map && tex.map.image;
      if (!src || !src.width) return { map: null, bumpMap: (tex && tex.bumpMap) || null };
      const cv = document.createElement("canvas");
      cv.width = src.width; cv.height = src.height;
      const g = cv.getContext("2d");
      g.drawImage(src, 0, 0);
      const im = g.getImageData(0, 0, cv.width, cv.height), d = im.data;
      for (let i = 0; i < d.length; i += 4) { const y = Math.min(255, (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) * 1.1 + 8); d[i] = d[i + 1] = d[i + 2] = y; }
      g.putImageData(im, 0, 0);
      const o = tex.map, t = new CanvasTexture(cv);
      t.wrapS = o.wrapS; t.wrapT = o.wrapT; t.repeat.copy(o.repeat); t.offset.copy(o.offset); t.anisotropy = o.anisotropy;
      if ("colorSpace" in o) t.colorSpace = o.colorSpace;
      t.needsUpdate = true;
      return { map: t, bumpMap: tex.bumpMap || null };
    } catch (_) {
      return { map: null, bumpMap: (tex && tex.bumpMap) || null };
    }
  }
  // 1.5.0 (the user: "העשן נתמר כקו ישר" - the First Temple's display): the incense smoke as a straight column with wisps, and the coals
  function int_noRaycast() {}
  function int_smokeParts() {
    if (int_texCache.smoke) return int_texCache.smoke;
    const mk = (w, h) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; return cv; };
    // the wisps: soft vertical streaks, periodic over the canvas height (whole sine periods), so the texture repeats up the column
    const wc = mk(64, 256), w = wc.getContext("2d");
    w.clearRect(0, 0, 64, 256);
    w.lineCap = "round";
    for (let i = 0; i < 22; i++) {                    // 1.0.1-L (L.53): 22 wisps, stronger (K.5: 14, alpha 0.14..0.46), so the column reads on gold too
      const x0 = 14 + hash(i * 1.7) * 36, A = 1.5 + hash(i * 2.9) * 4, n = 1 + Math.floor(hash(i * 4.1) * 3), ph = hash(i * 5.3) * 6.28;
      w.strokeStyle = "rgba(255,255,255," + (0.22 + hash(i * 7.7) * 0.4).toFixed(3) + ")";
      w.lineWidth = 2.5 + hash(i * 3.1) * 8;
      w.beginPath();
      for (let y = 0; y <= 256; y += 8) { const x = x0 + A * Math.sin(y / 256 * Math.PI * 2 * n + ph); if (y) w.lineTo(x, y); else w.moveTo(x, y); }
      w.stroke();
    }
    for (let i = 0; i < 10; i++) {                     // soft puffs, drawn again across the top and the bottom edges
      const x = 20 + hash(i * 9.1) * 24, y = hash(i * 6.7) * 256, r = 6 + hash(i * 2.2) * 9;
      for (const oy of [-256, 0, 256]) {
        const gr = w.createRadialGradient(x, y + oy, 0, x, y + oy, r);
        gr.addColorStop(0, "rgba(255,255,255,0.45)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        w.fillStyle = gr;
        w.fillRect(x - r, y + oy - r, 2 * r, 2 * r);
      }
    }
    // the fades (the alpha map reads its green channel): soft edges across the column; along it, in over the coals and out over the last
    // tenth, just under the ceiling
    const fc = mk(32, 256), f = fc.getContext("2d"), img = f.createImageData(32, 256);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 32; x++) {
      const u = (x + 0.5) / 32, v = 1 - (y + 0.5) / 256;              // v: 0 over the coals, 1 at the top
      const across = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u - 0.5) * 2, 2)), 1.5);
      const along = Math.min(1, v / 0.015) * Math.min(1, (1 - v) / 0.1) * (1 - 0.25 * v);
      const a = Math.round(255 * across * along), k = (y * 32 + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = a;
      img.data[k + 3] = 255;
    }
    f.putImageData(img, 0, 0);
    const tex = (cv, srgb) => { const t = new CanvasTexture(cv); t.wrapS = ClampToEdgeWrapping; t.wrapT = RepeatWrapping; if (srgb) t.colorSpace = SRGBColorSpace; return t; };
    const coreMap = tex(wc, true), haloMap = coreMap.clone(), fade = tex(fc, false);
    fade.wrapT = ClampToEdgeWrapping;
    coreMap.repeat.set(1, 11);
    haloMap.repeat.set(1, 7);
    haloMap.needsUpdate = true;
    const mat = (map, op) => new MeshBasicMaterial({ map, alphaMap: fade, color: 0xf2f2f6, transparent: true, opacity: op, depthWrite: false, side: DoubleSide });
    int_texCache.smoke = {
      coreMap, haloMap,
      core: mat(coreMap, 0.95), halo: mat(haloMap, 0.42),                // 1.0.1-L (L.53): denser (K.5: 0.8, 0.28)
      coalGeo: new IcosahedronGeometry(0.055, 0),
      coalMat: new MeshBasicMaterial({ color: 0xffffff })                // glowing: unlit, each coal its own colour (setColorAt)
    };
    return int_texCache.smoke;
  }

  // SHOWBREAD_SHAPE_211 (2.0.2 / 1.4.4; the user, 15.11.2026 08:38: "א: כן ברירת מחדל כר"י") - R. Yochanan's loaf, "כמין ספינה רוקדת"
  // (Menachot 94b, 131:3364): Rashi (2186:4470) "אין לה שוליים אלא מלמעלה רחבה ומלמטה כלה והולכת עד כאצבע... וב' ראשיה חדין והולכין
  // וגבוהין למעלה"; its mouth "דומה כמין טבלא מרובעת" (95a, 131:3372; Rashi 2186:4490 "השוליים עשויין כספינה"). A hollow shell: the
  // mouth a rectangle LX x W (half-sizes), the two walls sloping down to a keel KEEL wide (half a finger), the two ends raked - the keel
  // shorter than the mouth - and rising toward the corners (SH over H). T - the walls' thickness. The measures: model choices.
  function int_boatLoaf(LX, W, KEEL, H, T, SH) {
    const NU = 12, NV = 5, pos = [], uvs = [];
    const P = (u, v, s, inn) => {
      const xe = LX * (0.62 + 0.38 * v) - (inn ? T * 0.75 : 0);
      const y = v * (H + SH * u * u) + (inn ? T * (1 - v) + T * 0.2 : 0);
      const hw = KEEL + (W - KEEL) * v - (inn ? T * 0.85 : 0);
      return [u * xe, y, s * Math.max(inn ? 0.004 : KEEL, hw)];
    };
    // NOTE 7 (the understandability review, U-53 2): the boat's loaves looked like dark wooden wedges beside the box's - its texture
    // was 2.4 times denser than the box's (uvWorldBox: one unit an amah), and its inner faces turned away from the eye. The same scale
    // now, and the inner faces wound the other way (their normals toward the hollow)
    const tri = (a, b, c) => { for (const q of [a, b, c]) { pos.push(q[0], q[1], q[2]); uvs.push(q[0] * 1.2, q[2] * 1.2 + q[1] * 0.4); } };   // seen from above, as the box's top
    const quad = (a, b, c, d) => { tri(a, b, c); tri(a, c, d); }, quadO = quad;
    for (const inn of [false, true]) {
      const quad = inn ? (a, b, c, d) => quadO(a, d, c, b) : quadO;
      for (const s of [-1, 1]) for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {   // the two walls
        const u0 = -1 + 2 * i / NU, u1 = -1 + 2 * (i + 1) / NU, v0 = j / NV, v1 = (j + 1) / NV;
        quad(P(u0, v0, s, inn), P(u1, v0, s, inn), P(u1, v1, s, inn), P(u0, v1, s, inn));
      }
      for (let i = 0; i < NU; i++) {                                                           // the keel
        const u0 = -1 + 2 * i / NU, u1 = -1 + 2 * (i + 1) / NU;
        quad(P(u0, 0, -1, inn), P(u1, 0, -1, inn), P(u1, 0, 1, inn), P(u0, 0, 1, inn));
      }
      for (const e of [-1, 1]) for (let j = 0; j < NV; j++) {                                  // the two raked ends
        const v0 = j / NV, v1 = (j + 1) / NV;
        quad(P(e, v0, -1, inn), P(e, v0, 1, inn), P(e, v1, 1, inn), P(e, v1, -1, inn));
      }
    }
    for (const s of [-1, 1]) for (let i = 0; i < NU; i++) {                                    // the rim along the walls
      const u0 = -1 + 2 * i / NU, u1 = -1 + 2 * (i + 1) / NU;
      quad(P(u0, 1, s, false), P(u1, 1, s, false), P(u1, 1, s, true), P(u0, 1, s, true));
    }
    for (const e of [-1, 1]) quad(P(e, 1, -1, false), P(e, 1, 1, false), P(e, 1, 1, true), P(e, 1, -1, true));   // the rim of the ends
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
    g.computeVertexNormals();
    // NOTE 7 (U-53 2): the flat normals made each row of the curved walls a band of its own - the "wood grain". Smooth them: a vertex
    // takes the mean of the normals at its point that lie within 60 degrees of its own (the keel's and the rim's edges stay sharp)
    {
      const nA = g.attributes.normal, pA = g.attributes.position, at = new Map(), out = new Float32Array(nA.count * 3);
      for (let i = 0; i < pA.count; i++) {
        const k = Math.round(pA.getX(i) * 1e4) + "," + Math.round(pA.getY(i) * 1e4) + "," + Math.round(pA.getZ(i) * 1e4);
        if (!at.has(k)) at.set(k, []);
        at.get(k).push(i);
      }
      for (const idx of at.values()) for (const i of idx) {
        const nx = nA.getX(i), ny = nA.getY(i), nz = nA.getZ(i);
        let x = 0, y = 0, z = 0;
        for (const j of idx) { const mx = nA.getX(j), my = nA.getY(j), mz = nA.getZ(j); if (nx * mx + ny * my + nz * mz > 0.5) { x += mx; y += my; z += mz; } }
        const L = Math.hypot(x, y, z) || 1;
        out[i * 3] = x / L; out[i * 3 + 1] = y / L; out[i * 3 + 2] = z / L;
      }
      g.setAttribute("normal", new BufferAttribute(out, 3));
    }
    return g;
  }
  // SHOWBREAD_SHAPE_211: the switch of the loaves' shape, one object for the whole model (whichever module asks first makes it):
  // set("boat" | "box"); shaped(mesh, boxGeo, boatGeo) - a mesh (instanced or not) whose geometry follows it
  function int_breadShape(c) {
    return c.shared.breadShape || (c.shared.breadShape = { mode: "boat", list: [],
      // NOTE 7 (U-53 2): the boat's walls face down and sideways, and in the same material as the box's lit top they looked like dark
      // wood - the boat gets the same material lifted by a warm glow (the bread's own colour; model choice), the box keeps its own
      mat(e) { if (!e.mBoat) { const m = e.mBox && e.mBox.clone ? e.mBox.clone() : e.mBox; if (m && m.emissive) { m.emissive.setHex(0x6a3a14); m.emissiveIntensity = 0.6; } e.mBoat = m; } return this.mode === "box" ? e.mBox : e.mBoat; },
      shaped(im, box, boat) { const e = { im, box, boat, mBox: im.material, mBoat: null }; this.list.push(e); if (this.mode === "boat") { im.geometry = boat; im.material = this.mat(e); if (im.isInstancedMesh) im.computeBoundingSphere(); } return im; },
      set(m) { this.mode = m === "box" ? "box" : "boat"; for (const e of this.list) { e.im.geometry = this.mode === "box" ? e.box : e.boat; e.im.material = this.mat(e); if (e.im.isInstancedMesh) e.im.computeBoundingSphere(); } return this.mode; },
      // SOLOMON_FORM_217: a shaped mesh given another material (the metal switch, 45-vessels.js) - until 2.0.7 the next set() put back the
      // material it was made in (the posts of a silver table turned gold again when the loaves' shape was switched)
      retint(im, mat) { const e = this.list.find((x) => x.im === im); if (!e) { im.material = mat; return; } e.mBox = mat; e.mBoat = null; im.material = this.mat(e); } });
  }
  async function buildVessels(ctx2) {
    const { CO, LV, M: MM } = ctx2;
    const g = new Group();
    g.name = "vessels";
    ctx2.root.add(g);
    const FL = LV.HEI + houseRise(-37);   // 1.9.3: the menorah and the table stand at x -37, on the sloping floor (10-core.js houseRise)
    // MENOROT_305 (the user, 19.11.2026 23:41: "רוחב מנורות - א - בתנאי שאתה לא פוגע בעיצוב"): 0.27 until 3.0.4 - the menorah 1.67 wide
    // (1.88), so that five north-south fit the south half with a way between them and the tables' heads, as R. Meir's walk needs
    // (the Ritva, Yoma 51b: "ונכנס בצד סוף השלחן הסמוך לו בין שלחן למנורה והולך לצפון"); its breadth is not given (Menachot 28b:
    // its height alone). The form and the height as they were; the lamps and their nozzles narrower in the same proportion (0.889)
    const LAMP_R = 0.24;
    const TBL_TOP = 1.5, TBL_BOARD = 0.08, TBL_LEG = 0.12;
    const STACK_X = 3.5 * INT_TEF;          // 0.583: a stack's centre (1 tefach of the middle air + half of the loaf's 5)
    const LOAF_X = 2.5 * INT_TEF, LOAF_Z = 0.5, LOAF_T = 0.5 * INT_TEF, LOAF_H = 2 * INT_TEF;   // half-width 0.417 (5 tef.), half-length 0.5 (6 tef.)
    const HORN = 7 / 24;                    // 7 fingers (4 to a tefach)
    const POST_Z = 0.56, POST_T = 0.05, STACK_TOP = TBL_TOP + 6 * LOAF_H;   // the posts' plane; the top of the stacks 3.5 above the floor
    const TUBE_R = 0.03, TUBE_L = 2 * (POST_Z + POST_T / 2);               // the tubes run from the outer face of one post to the other's
    const tableGeo = (() => {
      const box = (arr, w, h, d, x, y, z) => { const b = uvWorldBox(new BoxGeometry(w, h, d), w, h, d); b.translate(x, y + h / 2, z); arr.push(b); };
      const put = (arr, geo, x, y, z) => { const c = geo.clone(); c.translate(x, y, z); arr.push(c); };   // a copy of a part made once
      const body = [], crown = [], rig = [], ends = [], bread = [], spoons = [], incense = [];
      const yB = TBL_TOP - TBL_BOARD, yF = yB - INT_TEF;                  // under the board (1.42), the frame's bottom (1.253)
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(body, TBL_LEG, yB, TBL_LEG, sx * (1 - TBL_LEG / 2), 0, sz * (0.5 - TBL_LEG / 2));
      box(body, 2, TBL_BOARD, 1, 0, yB, 0);
      for (const sz of [-1, 1]) box(body, 2 - 2 * TBL_LEG, INT_TEF, 0.05, 0, yF, sz * 0.475);      // the frame from leg to leg
      for (const sx of [-1, 1]) box(body, 0.05, INT_TEF, 1 - 2 * TBL_LEG, sx * 0.975, yF, 0);
      const cy = yF + (INT_TEF - 0.07) / 2;                                                  // the crown band, 0.07 high, 0.018 proud, around
      for (const sz of [-1, 1]) box(crown, 2.036, 0.07, 0.018, 0, cy, sz * 0.509);
      for (const sx of [-1, 1]) box(crown, 0.018, 0.07, 1, sx * 1.009, cy, 0);
      const loaf = [];                                                                        // one loaf, made once
      box(loaf, 2 * LOAF_X, LOAF_T, 2 * LOAF_Z, 0, 0, 0);
      for (const sz of [-1, 1]) {
        box(loaf, 2 * LOAF_X, LOAF_H, LOAF_T, 0, 0, sz * (LOAF_Z - LOAF_T / 2));                // the walls folded up along the long edges
        for (const hx of [-1, 1]) box(loaf, LOAF_T, 0.055, HORN, hx * (LOAF_X - LOAF_T / 2), LOAF_H - 0.055, sz * (LOAF_Z - LOAF_T - HORN / 2));   // the horns, bent inward
      }
      const loafG = mergeGeometries(loaf);
      // SHOWBREAD_SHAPE_211: R. Yochanan's loaf (int_boatLoaf) - its mouth 5 tefachim by a little less than the table's breadth, so that the
      // posts STAND ON THE TABLE ("לדברי האומר כמין ספינה רוקדת - סניפין על גבי שלחן מונחין", Menachot 94b, 131:3369), against its rim
      const BOAT_W = 0.46, loafB = int_boatLoaf(LOAF_X, BOAT_W, INT_TEF / 8, LOAF_H, LOAF_T * 0.8, LOAF_H * 0.4);
      const POST_ZB = BOAT_W + POST_T / 2, TUBE_LB = 2 * (POST_ZB + POST_T / 2);
      const breadB = [], rigB = [], endsB = [];
      const tubeG = new CylinderGeometry(TUBE_R, TUBE_R, TUBE_L, 8, 1, true); tubeG.rotateX(Math.PI / 2);
      const endG = new CircleGeometry(TUBE_R * 0.8, 10), endGb = endG.clone().rotateY(Math.PI);
      const post = [];                                                                        // a post (סניף), floor to the stack's top,
      box(post, 2 * LOAF_X - 0.012, STACK_TOP, POST_T, 0, 0, 0);
      for (let k = 0; k < 5; k++) box(post, 2 * LOAF_X - 0.06, 0.025, 0.03, 0, TBL_TOP + (k + 1) * LOAF_H - TUBE_R - 0.025, -(POST_T / 2 + 0.015));   // with its five branches on the inner face
      const postG = mergeGeometries(post), postGb = postG.clone().rotateY(Math.PI);           // for the +z side / the -z side
      const postB = [];                                                                       // SHOWBREAD_SHAPE_211: from the table's top
      box(postB, 2 * LOAF_X - 0.012, STACK_TOP - TBL_TOP, POST_T, 0, TBL_TOP, 0);
      for (let k = 0; k < 5; k++) box(postB, 2 * LOAF_X - 0.06, 0.025, 0.03, 0, TBL_TOP + (k + 1) * LOAF_H - TUBE_R - 0.025, -(POST_T / 2 + 0.015));
      const postBG = mergeGeometries(postB), postBGb = postBG.clone().rotateY(Math.PI);
      const tubeBG = new CylinderGeometry(TUBE_R, TUBE_R, TUBE_LB, 8, 1, true); tubeBG.rotateX(Math.PI / 2);
      for (const sx of [-1, 1]) {
        const xc = sx * STACK_X;
        for (const sz of [-1, 1]) put(rig, sz > 0 ? postG : postGb, xc, 0, sz * POST_Z);
        for (let i = 0; i < 6; i++) put(bread, loafG, xc, TBL_TOP + i * LOAF_H, 0);              // the six loaves of this stack
        for (const sz of [-1, 1]) put(rigB, sz > 0 ? postBG : postBGb, xc, 0, sz * POST_ZB);      // SHOWBREAD_SHAPE_211
        for (let i = 0; i < 6; i++) put(breadB, loafB, xc, TBL_TOP + i * LOAF_H, 0);
        for (let k = 0; k < 5; k++) {                                                           // 3 + 3 + 3 + 3 + 2 tubes
          const y = TBL_TOP + (k + 1) * LOAF_H;
          for (const dx of k < 4 ? [-0.27, 0, 0.27] : [-0.17, 0.17]) {
            put(rig, tubeG, xc + dx, y, 0);
            put(ends, endG, xc + dx, y, TUBE_L / 2 + 0.001);                                    // the hollow ends, dark dots on the posts
            put(ends, endGb, xc + dx, y, -TUBE_L / 2 - 0.001);
            put(rigB, tubeBG, xc + dx, y, 0);                                                    // SHOWBREAD_SHAPE_211: the reeds under the keels ("מורשא עביד להו")
            put(endsB, endG, xc + dx, y, TUBE_LB / 2 + 0.001);
            put(endsB, endGb, xc + dx, y, -TUBE_LB / 2 - 0.001);
          }
        }
      }
      for (const sx of [-1, 1]) {                                                               // the two spoons in the air between the stacks
        const cup = new LatheGeometry([[0, 0], [0.062, 0], [0.07, 0.02], [0.058, 0.08], [0.07, 0.14], [0.066, 0.15], [0.058, 0.15], [0.052, 0.03], [0, 0.03]].map((q) => new Vector2(q[0], q[1])), 14);
        cup.translate(sx * 0.08, TBL_TOP, 0);
        spoons.push(cup);
        const ladle = new CylinderGeometry(0.008, 0.008, 0.24, 6);
        ladle.rotateX(0.32);
        ladle.translate(sx * 0.08, TBL_TOP + 0.16, -0.03);
        spoons.push(ladle);
        const mound = new SphereGeometry(0.052, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);         // "לבונה זכה" (Lev 24:7), white
        mound.scale(1, 0.55, 1);
        mound.translate(sx * 0.08, TBL_TOP + 0.13, 0);
        incense.push(mound);
      }
      const M2 = (a) => mergeGeometries(a);
      return { body: M2(body), crown: M2(crown), rig: M2(rig), ends: M2(ends), bread: M2(bread), spoons: M2(spoons), incense: M2(incense),
        breadB: M2(breadB), rigB: M2(rigB), endsB: M2(endsB) };   // SHOWBREAD_SHAPE_211
    })();
    // SHOWBREAD_SHAPE_211: ctx2.shared.breadShape.set("boat" | "box") - every loaf, post and reed of every table changes its geometry
    // (R. Yochanan's boat, the default; R. Chanina's open box, with the posts on the floor). breadShape.shaped(im, box, boat) - one more
    const BREAD_SH = int_breadShape(ctx2);
    const MEN_T = INT_TEF;
    const menorahGeo = (() => {
      const parts = [], steps = [], UPV = new Vector3(0, 1, 0);
      // orn = an ornament (it keeps its uvs: the almond work); the plain parts all sit on the ground of int_almondTex
      const add = (geo, x, y, z, q, orn) => {
        if (!orn) { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.01, 0.01); }
        if (q) geo.applyQuaternion(q);
        geo.translate(x, y, z);
        parts.push(geo);
      };
      const lathe = (prof, seg) => new LatheGeometry(prof.map((p) => new Vector2(p[0], p[1])), seg);
      // the ornaments, each about its own foot at y 0, h high: a cup (a narrow goblet opening upward), a knob (an apple, radius r), a flower (a
      // calyx opening upward, its lip turned out, cut into six petals; s scales its width)
      const cup = (h) => lathe([[0, 0], [0.026, 0], [0.026, h * 0.3], [0.042, h * 0.6], [0.068, h * 0.92], [0.076, h], [0.06, h], [0.034, h * 0.7], [0.018, h * 0.42], [0, h * 0.4]], 10);
      const knob = (h, r) => { const s = new SphereGeometry(1, 12, 8); s.scale(r, h / 2, r); s.translate(0, h / 2, 0); return s; };
      const flower = (h, s = 1) => {
        const f = lathe([[0, 0], [0.04 * s, 0], [0.042 * s, h * 0.4], [0.082 * s, h * 0.8], [0.105 * s, h], [0.09 * s, h], [0.062 * s, h * 0.78], [0.044 * s, h * 0.5], [0, h * 0.48]], 18);
        const p = f.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i), t = Math.min(1, Math.max(0, (y / h - 0.35) / 0.65)), c = Math.cos(6 * Math.atan2(x, z));
          p.setXYZ(i, x * (1 + 0.26 * t * c), y + 0.14 * h * t * (c - 1) / 2, z * (1 + 0.26 * t * c));   // the petals: wider and higher at their tips
        }
        f.computeVertexNormals();
        return f;
      };
      const group3 = (top, up, q) => {                                   // the last three tefachim (0.5) under a lamp: three cups, a knob, a flower
        const at = (d, g) => add(g, top.x - up.x * d, top.y - up.y * d, top.z - up.z * d, q, true);
        for (let i = 0; i < 3; i++) at(0.5 - 0.095 * i, cup(0.095));
        at(0.215, knob(0.125, 0.07));
        at(0.09, flower(0.09));
      };
      for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3 + Math.PI / 2; add(new CylinderGeometry(0.06, 0.075, 0.1, 8), Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.17); }   // the three feet
      add(new BoxGeometry(0.9, 0.2, 0.5), 0, 0.2, 0);                                  // the base "כמין תבה"
      add(flower(0.2, 1.35), 0, 0.3, 0, null, true);                                   // the lowest flower ("עד ירכה עד פרחה"), at the foot of the shaft
      add(new CylinderGeometry(0.04, 0.04, 2.7, 10), 0, 1.65, 0);                      // the shaft, y 0.3..3
      const KNOB_R = MEN_T / 2 * 1.05;                                                 // the knobs of one tefach: the 6th tefach's and the three that carry the branches
      add(cup(MEN_T), 0, 5 * MEN_T, 0, null, true);                                    // the 6th tefach: the cup on the shaft, its knob and its flower beside it (the book)
      add(knob(MEN_T, KNOB_R), -0.12, 5 * MEN_T, 0, null, true);
      { const f6 = flower(0.14, 0.7); f6.rotateZ(-Math.PI / 2); add(f6, 0.035, 5.5 * MEN_T, 0, null, true); }
      group3(new Vector3(0, 3, 0), UPV, null);                                         // the shaft's last three tefachim
      const LAMPX = [3, 2, 1].map((i) => i * LAMP_R);
      [8, 10, 12].forEach((t, k) => {                                                  // the knobs of the 9th, 11th, 13th tefach and their pairs
        const yk = (t + 0.5) * MEN_T;
        add(knob(MEN_T, KNOB_R), 0, yk - MEN_T / 2, 0, null, true);
        for (const sx of [-1, 1]) {
          const root = new Vector3(0, yk, 0), top = new Vector3(sx * LAMPX[k], 3, 0), up = top.clone().sub(root), len = up.length();
          up.normalize();
          const q = new Quaternion().setFromUnitVectors(UPV, up);
          add(new CylinderGeometry(0.032, 0.032, len, 8), (root.x + top.x) / 2, (root.y + top.y) / 2, 0, q);   // the straight branch
          group3(top, up, q);                                                          // its three cups, knob and flower
        }
      });
      for (const dx of [-3, -2, -1, 0, 1, 2, 3]) add(new CylinderGeometry(0.115, 0.071, 0.16, 8), dx * LAMP_R, 3.08, 0);   // the seven lamps ("נרתיה"); MENOROT_305: 0.13, 0.08 until 3.0.4
      // LAMPS_MIDDLE_211 (stage ב, point 25; the user: V): "'אל מול פני המנורה יאירו שבעת הנרות' - מלמד שהיו מצדדין פניהם כלפי נר
      // אמצעי" (Menachot 98b); Rashi: the middle one "פי הפתילה כלפי מערב", "ושאר הפתילות מצודדות פיהן כלפי האמצעי". Each side lamp has
      // a spout (its wick's mouth) toward the middle; the middle lamp's spout (toward the west) is drawn apart (midSpout), for it turns
      // otherwise than the menorah when the menorah's direction changes. The spouts' form and size - model choices.
      // NOZZLE_211b: the lamps stand LAMP_R (0.24; MENOROT_305) apart and their tops are 0.23 wide, so a spout cannot reach out sideways (the first
      // try put each side flame in its neighbour's lamp) - each is a short nozzle rising out of its own lamp's top on the side of its
      // face, from 0.035 to 0.111 off the lamp's centre (MENOROT_305; 0.04 to 0.125 until 3.0.4), the wick's mouth at the rim (the flame on it: SPT below)
      const spout = (dirX, dirZ, x) => {
        const B = new Vector3(x + dirX * 0.035, 3.13, dirZ * 0.035), T = new Vector3(x + dirX * 0.111, 3.205, dirZ * 0.111), v = T.clone().sub(B);
        const sg = new CylinderGeometry(0.018, 0.03, v.length(), 8);
        sg.applyQuaternion(new Quaternion().setFromUnitVectors(UPV, v.clone().normalize()));
        sg.translate((B.x + T.x) / 2, (B.y + T.y) / 2, (B.z + T.z) / 2);
        return sg;
      };
      // LAMPS_REBBI_211 (the refuter, R-08 / S4-12; the user, 15.11.2026 18:12: "5. לשנות את רבי לד' הרמבם"): "מצדדין פניהם כלפי נר אמצעי"
      // and Rashi's picture (the middle one west, the others toward it) were said for the one who sets the lamps NORTH-SOUTH (Rashi,
      // Menachot 98b; 2186:4687 "לעולם צפון ודרום מנחי..."). For Rebbi, EAST-WEST, the Rambam (his commentary on Tamid 3:9; 575:40)
      // draws the seven in a row between west and east, "ופיות כל הנרות לצד מערב זה לאחור זה". So the six side spouts are no longer
      // part of the body: sideNS - toward the middle lamp (the lamps north-south); sideEW - all toward the west, local -x (east-west).
      const sideNS = mergeGeometries([-3, -2, -1, 1, 2, 3].map((dx) => spout(-Math.sign(dx), 0, dx * LAMP_R)));
      const sideEW = mergeGeometries([-3, -2, -1, 1, 2, 3].map((dx) => spout(-1, 0, dx * LAMP_R)));
      const sbox = (w, h, d, y, z) => { const b = uvWorldBox(new BoxGeometry(w, h, d), w, h, d); b.translate(0, y + h / 2, z); steps.push(b); };
      const ST_R = 8.5 * MEN_T / 3;                                                    // A19: a third of 8.5 tefachim
      sbox(1.2, ST_R, 1.5, 0, -1.05);                                                  // the three steps (L.71; A19): treads 0.5 from z -0.3 outward, 9 tefachim in all
      sbox(1.2, ST_R, 1, ST_R, -0.8);
      sbox(1.2, ST_R, 0.5, 2 * ST_R, -0.55);
      return { body: mergeGeometries(parts), steps: mergeGeometries(steps), midNS: spout(0, -1, 0), midEW: spout(-1, 0, 0), sideNS, sideEW };
    })();
    // ---- materials: gold (the default), silver, iron plated with tin (Menachot 28b: "שפודים של ברזל היו וחיפום בבעץ; העשירו - עשאום של
    // כסף; חזרו והעשירו - עשאום של זהב")
    const menorahGold = vsl_goldStd(int_almondTex(), { color: 0xFFDC86, roughness: 0.3, emissive: 0x6b4a10, emissiveIntensity: 0.55, bumpScale: 0.06 });
    const vesselGold = vsl_goldStd(TEX.gold, { color: 0xFFDC86, roughness: 0.3, emissive: 0x6b4a10, emissiveIntensity: 0.55 });
    const crownMat = vsl_goldStd(int_crownTex(), { bumpScale: 0.7, roughness: 0.3 });
    const fretMat = vsl_goldStd(int_fretTex(), { alphaTest: 0.5, side: DoubleSide, roughness: 0.25 });
    const silver = (tex, bump) => vsl_std(vsl_greyTex(tex), { color: 0xF4F4F8, metalness: 0.55, roughness: 0.3, envMapIntensity: 1.5, emissive: 0x6a6a72, emissiveIntensity: 0.6, bumpScale: bump || 0 });   // 1.5.0: brighter (the user: "כהה מדי")
    // 1.9.5 (the user: "בבעץ, והצבע גם צריך להיות כזה"): the colour of tin - a light silvery grey with a cool cast, matt; it was a dark
    // grey-brown (0x9a9892 with almost no light of its own), which read as iron or wood
    const tin = (tex, bump) => vsl_std(vsl_greyTex(tex), { color: 0xc3cad1, metalness: 0.5, roughness: 0.58, envMapIntensity: 0.9, emissive: 0x555b62, emissiveIntensity: 0.5, bumpScale: bump || 0 });
    const METALS = {
      gold: { men: menorahGold, tbl: vesselGold, crown: crownMat },
      silver: { men: silver(int_almondTex(), 0.06), tbl: silver(TEX.gold), crown: silver(int_crownTex(), 0.7) },
      iron: { men: tin(int_almondTex(), 0.06), tbl: tin(TEX.gold), crown: tin(int_crownTex(), 0.7) }
    };
    const breadMat = vsl_std(int_speckleTex("bread", "#a2612d", ["rgba(206,150,84,0.36)", "rgba(196,138,76,0.3)", "rgba(92,48,18,0.38)"], 170, 8), { roughness: 0.78 });
    const tubeEndMat = new MeshStandardMaterial({ color: 0x24170c, roughness: 0.9 });
    const incenseMat = new MeshStandardMaterial({ color: 0xf4efe2, roughness: 0.95 });
    const flameMat = new MeshBasicMaterial({ color: 0xFFC85E });
    // ---- the places (Rambam 1:7, 3:17; Yoma 33b). The kodesh: x -4.5 (its door) .. -44.5 (the parochet), z +-10; the inner third from x -31.2
    const MEN = { x: -37, z: 6.5, rot: Math.PI / 2 };     // the menorah in the south, 2.5 from the wall to its lamps' row (Yoma 33b), the lamps north-south
    const TBL = { x: -37, z: -7, rot: 0 };               // the table in the north, 2.5 from the wall, its length along the house (Rambam 3:12)
    // ALTAR_EAST_305 (the user, 19.11.2026 22:41): 1.25 further east (x -33.5 until 2.0.13) - a way between it and the east row of
    // Solomon's tables when they lie north-south, as Rashi's answer on Yoma 51b: "שאין המזבח מכוון כנגד השולחן אלא משוך קימעא כלפי חוץ"
    const ALT = { x: -32.25, z: 0 };                     // the golden altar between them, drawn outward (east) a little
    const FLA = LV.HEI + houseRise(ALT.x);               // 1.9.3: the floor under the golden altar
    // the table
    const tM = [int_part(TBL.x, FL, TBL.z, TBL.rot, 0, 0, 0)];
    const tblBody = int_inst(g, tableGeo.body, METALS.gold.tbl, tM);
    const tblCrown = int_inst(g, tableGeo.crown, METALS.gold.crown, tM, false);
    const tblRig = BREAD_SH.shaped(int_inst(g, tableGeo.rig, METALS.gold.tbl, tM), tableGeo.rig, tableGeo.rigB);
    const tblEnds = BREAD_SH.shaped(int_inst(g, tableGeo.ends, tubeEndMat, tM, false), tableGeo.ends, tableGeo.endsB);
    const tblSpoons = int_inst(g, tableGeo.spoons, METALS.gold.tbl, tM, false);
    const tblBread = BREAD_SH.shaped(int_inst(g, tableGeo.bread, breadMat, tM, false), tableGeo.bread, tableGeo.breadB);
    breadMat.side = DoubleSide;   // SHOWBREAD_SHAPE_211: the boat loaf is a shell
    ctx2.shared.breadKit = { geo: tableGeo.bread, geoB: tableGeo.breadB, mat: breadMat, top: TBL_TOP };   // BREAD_205: the same loaves go on the ulam's marble table (50-heichal.js)
    const tblIncense = int_inst(g, tableGeo.incense, incenseMat, tM, false);
    // the menorah, its stone and its flames
    const menBody = int_inst(g, menorahGeo.body, METALS.gold.men, [int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0)]);
    const menStone = int_inst(g, menorahGeo.steps, MM.marble, [int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0)]);
    // LAMPS_MIDDLE_211: the middle lamp's spout toward the west - local -z while the lamps run north-south, local -x while east-west
    const menMidNS = int_inst(g, menorahGeo.midNS, METALS.gold.men, [int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0)], false);
    const menMidEW = int_inst(g, menorahGeo.midEW, METALS.gold.men, [int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0)], false);
    menMidEW.visible = false;
    // LAMPS_REBBI_211: the six side spouts - toward the middle (north-south), or all to the west (east-west, the Rambam on Tamid 3:9)
    const menSideNS = int_inst(g, menorahGeo.sideNS, METALS.gold.men, [int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0)], false);
    const menSideEW = int_inst(g, menorahGeo.sideEW, METALS.gold.men, [int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0)], false);
    menSideEW.visible = false;
    const menSpouts = [menMidNS, menMidEW, menSideNS, menSideEW];
    const midSync = () => {
      const ew = Math.abs(MEN.rot) < 1e-6, m = int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0);
      for (const im of menSpouts) { im.setMatrixAt(0, m); im.instanceMatrix.needsUpdate = true; if (im.computeBoundingSphere) im.computeBoundingSphere(); }
      menMidNS.visible = menSideNS.visible = !ew; menMidEW.visible = menSideEW.visible = ew;
    };
    const flameG = new ConeGeometry(0.08, 0.3, 8);
    flameG.translate(0, 0.15, 0);
    const lampX = [-3, -2, -1, 0, 1, 2, 3].map((i) => i * LAMP_R);
    // LAMPS_MIDDLE_211 (NOZZLE_211b): each flame on its nozzle's mouth, in its own lamp - the side ones SPT toward the middle, the middle
    // one SPT west (-x) in both directions; its foot FLY over the floor (the lamps' tops 3.16, the nozzles' mouths 3.205)
    const SPT = 0.102, FLY = 3.17;   // MENOROT_305: 0.115 until 3.0.4
    // LAMPS_REBBI_211: east-west (rot 0) every flame SPT west of its lamp's middle - "ופיות כל הנרות לצד מערב זה לאחור זה"
    const flameXZ = (dx, rot, z) => { const ew = Math.abs(rot) < 1e-6, d = ew ? dx - SPT : dx === 0 ? 0 : dx - Math.sign(dx) * SPT; return [MEN.x + d * Math.cos(rot) - (!ew && dx === 0 ? SPT : 0), z - d * Math.sin(rot)]; };
    const flameAt = (rot) => lampX.map((dx) => { const q = flameXZ(dx, rot, MEN.z); return [q[0], FL + FLY, q[1]]; });
    let flamePos = flameAt(MEN.rot);   // MENORAH_DIR_195: follows the menorah's direction (ctx2.shared.menorahDir)
    const flames = int_inst(g, flameG, flameMat, flamePos.map((p) => int_m4(p[0], p[1], p[2], 0, MEN.rot, 0)), false);
    const menorahLight = new PointLight(0xFFC06A, 16, 25, 2);
    menorahLight.position.set(MEN.x, FL + 4.6, MEN.z);
    g.add(menorahLight);
    // 2.0 (55-tamid.js, the morning's service: "מדשן את השאר ומניח את אלו דולקין במקומן"): every lamp's flame has its own size, 0 = out
    // (lampK), and the light goes with the lamps that burn; the menorah may turn east-west (the second reading of the lamps: Rashi, the
    // Ra'avad and the Bartenura on Tamid 3:9 - "האי תנא סבר מנורה מזרח ומערב היא מנחת"), its lamps' row then 2.5 from the south wall
    const lampK = [1, 1, 1, 1, 1, 1, 1];
    ctx2.animated.push((t) => {
      let lit = 0;
      for (let i = 0; i < 7; i++) {
        const k = lampK[i];
        lit += k;
        const s = (1 + 0.28 * Math.sin(t * 0.012 + i * 1.9) * Math.sin(t * 43e-4 + i)) * k;
        flames.setMatrixAt(i, int_m4(flamePos[i][0], flamePos[i][1], flamePos[i][2], Math.sin(t * 9e-3 + i) * 0.1, MEN.rot, Math.cos(t * 0.011 + i * 2) * 0.1, k, s, k));
      }
      flames.instanceMatrix.needsUpdate = true;
      menorahLight.intensity = (15.5 + 2.2 * Math.sin(t * 0.011) + 1.3 * Math.sin(t * 0.029 + 1)) * (0.12 + 0.88 * lit / 7);
    });
    const MEN0 = { z: MEN.z, rot: MEN.rot };   // TAMID_PORT_207: the hunks of the demonstration (its menSteps is our menStone)
    ctx2.shared.menorah = {
      MEN, FL, LAMP_R, lampX, flamePos, lampK, flameY: FL + FLY,
      // the lamps' places now (index 0..6 along the row: north-south - 0 the southern; east-west - 0 the western)
      lampPos(i) { return flamePos[i].slice(); },
      setRot(ew) {
        MEN.rot = ew ? 0 : MEN0.rot;
        MEN.z = ew ? 7.5 : MEN0.z;
        const c = Math.cos(MEN.rot), s = Math.sin(MEN.rot);
        lampX.forEach((dx, i) => { const q = flameXZ(dx, MEN.rot, MEN.z); flamePos[i][0] = q[0]; flamePos[i][2] = q[1]; });   // LAMPS_MIDDLE_211, LAMPS_REBBI_211
        menBody.setMatrixAt(0, int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0));
        midSync();
        menStone.setMatrixAt(0, int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0));
        for (const im of [menBody, menStone, flames]) { im.instanceMatrix.needsUpdate = true; if (im.computeBoundingSphere) im.computeBoundingSphere(); }
        menorahLight.position.set(MEN.x, FL + 4.6, MEN.z);
        this.ew = !!ew;
        if (SOL_HOOK.place) SOL_HOOK.place();   // MEN_ALL_G6: Solomon's ten menorahs turn with Moses' (the lamps' row of the morning)
      },
      ew: false,
      // the stone before the menorah (A19: three steps, 8.5 tefachim in all) on the side of its local -z: a point (lx, lz) in the menorah's
      // own frame -> [x, z]; stoneTop / stoneStep its heights over the floor (55-tamid.js: where the priest stands and puts the kuz)
      stoneTop: 8.5 * INT_TEF, stoneStep: 8.5 * INT_TEF / 3,
      at(lx, lz) { const c = Math.cos(MEN.rot), s = Math.sin(MEN.rot); return [MEN.x + lx * c + lz * s, MEN.z - lx * s + lz * c]; },
      reset() { for (let i = 0; i < 7; i++) lampK[i] = 1; }
    };
    // the golden altar: a gold cube of 1 x 1 x 2 with its four horns (Ex 30:2 "ממנו קרנתיו") and the crown rail (Ex 30:3 "זר זהב סביב")
    {
      const ALT_W = 1, ALT_TOP = 2, ALT_HORN_H = INT_TEF, ALT_H = ALT_TOP - ALT_HORN_H, ALT_HORN = 0.18;
      const hw = ALT_W / 2, hp = hw - ALT_HORN / 2;
      const gold = [], fret = [];
      const box = (arr, w, h, d, x, y, z) => { const b = uvWorldBox(new BoxGeometry(w, h, d), w, h, d); b.translate(ALT.x + x, FLA + y + h / 2, ALT.z + z); arr.push(b); };
      box(gold, ALT_W, ALT_H, ALT_W, 0, 0, 0);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(gold, ALT_HORN, ALT_HORN_H, ALT_HORN, sx * hp, ALT_H, sz * hp);
      const FH = 0.09, FT = 0.012, FL2 = ALT_W - 2 * ALT_HORN, fz = hw - FT / 2 - 0.004;
      for (const sz of [-1, 1]) box(fret, FL2, FH, FT, 0, ALT_H, sz * fz);
      for (const sx of [-1, 1]) box(fret, FT, FH, FL2, sx * fz, ALT_H, 0);
      const altMesh = new Mesh(mergeGeometries(gold), vesselGold);
      altMesh.castShadow = altMesh.receiveShadow = true;
      g.add(altMesh);
      const fretMesh = new Mesh(mergeGeometries(fret), fretMat);
      g.add(fretMesh);
      // 1.5.0: the incense smoke rising perfectly straight from seven coals to the ceiling - "מתמר ועולה כמקל" (Yoma 38a; 53a "עד שמגיע
      // לשמי קורה"), the First Temple's display (int_smokeParts): a core and a halo plane, turned toward the camera, the wisps flow upward
      const smokeParts = int_smokeParts();
      const ax = ALT.x, az = ALT.z;
      let coalsMesh = null;   // 2.0 (55-tamid.js)
      {
        const cm = [];
        for (let i = 0; i < 7; i++) {
          const a = i * 2.39996, r = i ? 0.06 + 0.11 * Math.sqrt(i / 6) : 0, sc = 0.75 + hash(i * 3.3 + 1) * 0.5;
          cm.push(int_m4(ax + Math.cos(a) * r, FLA + ALT_TOP + 0.035 * sc, az - 0.13 + Math.sin(a) * r * 0.8, hash(i) * 3, hash(i * 2) * 3, 0, sc, sc * 0.8, sc));
        }
        const coals = int_inst(g, smokeParts.coalGeo, smokeParts.coalMat, cm, false);
        coalsMesh = coals;
        const COAL = [0xff8a2a, 0xe8481a, 0x8a1e08, 0xffa040, 0x3a140a, 0xd0401a, 0x5a1a0a], col = new Color();
        for (let i = 0; i < 7; i++) coals.setColorAt(i, col.setHex(COAL[i]));
      }
      const smoke = [];
      {
        const y0 = FLA + ALT_TOP + 0.05, y1 = LV.HEI + 40 - 0.25, ht = y1 - y0;   // the Kodesh is 40 amot high (Middot 4:6)
        for (const [mat, w0, w1] of [[smokeParts.core, 0.26, 0.72], [smokeParts.halo, 0.6, 1.5]]) {
          const geo = new PlaneGeometry(1, ht, 1, 8);
          const pp = geo.attributes.position;
          for (let i = 0; i < pp.count; i++) { const tt = pp.getY(i) / ht + 0.5; pp.setX(i, pp.getX(i) * (w0 + (w1 - w0) * tt)); }
          const m = new Mesh(geo, mat);
          m.position.set(ax, y0 + ht / 2, az - 0.13);
          m.castShadow = m.receiveShadow = false;
          m.renderOrder = 2;
          m.userData.noPick = true;
          m.raycast = int_noRaycast;
          g.add(m);
          smoke.push(m);
        }
      }
      ctx2.shared.goldenAltar = { x: ax, z: az, top: FLA + ALT_TOP, smoke, coals: coalsMesh };   // 2.0 (55-tamid.js)
      ctx2.animated.push((t) => {
        if (ctx2.camera) {
          const ang = Math.atan2(ctx2.camera.position.x - ax, ctx2.camera.position.z - az);
          for (const m of smoke) m.rotation.y = ang;
        }
        smokeParts.coreMap.offset.y = -((t * 1.6e-4) % 1);
        smokeParts.haloMap.offset.y = -((t * 1.05e-4 + 0.37) % 1);
        const glow = 0.86 + 0.1 * Math.sin(t * 0.0042) + 0.05 * Math.sin(t * 0.0131 + 1.3);
        smokeParts.coalMat.color.setRGB(glow, glow, glow);
      });
    }
    // ---- the metal switch (the opinions table): the menorah and the table together, as the Gemara tells of the Hasmoneans' menorah and
    // the Rambam rules for all the vessels (1:19 "היו הקהל עניים עושין אותן אפילו של בדיל, ואם העשירו עושין אותן של זהב")
    const SOL_HOOK = {};   // SOLOMON_214: filled below (the vessels of Solomon), called by the metal and the two directions
    ctx2.shared.vesselMetal = {
      current: "gold",
      keys: ["gold", "silver", "iron"],
      set(k) {
        if (!METALS[k]) return false;
        this.current = k;
        menBody.material = METALS[k].men;
        for (const im of menSpouts) im.material = METALS[k].men;   // LAMPS_REBBI_211 (the spouts stayed gold on a silver or an iron menorah)
        tblBody.material = METALS[k].tbl;
        BREAD_SH.retint(tblRig, METALS[k].tbl);   // SOLOMON_FORM_217 (was: tblRig.material = ...)
        tblSpoons.material = METALS[k].tbl;
        tblCrown.material = METALS[k].crown;
        if (SOL_HOOK.metal) SOL_HOOK.metal(k);   // SOLOMON_214
        return true;
      },
      get() { return this.current; }
    };
    // ---- MENORAH_DIR_195 - 1.9.5 (the user, 11.11.2026, 22:15: "שתוסיף את שיטת רבי בקוד עצמו… במבנה הפשוט של התוסף"): THE MENORAH'S
    // DIRECTION, a row of the opinions table. Menachot 98b (the user's library, book 131, lines 3512-3518): "מזרח ומערב היו מונחין,
    // דברי רבי. רבי אלעזר ברבי שמעון אומר: צפון ודרום. מאי טעמא דרבי? גמר ממנורה – מה מנורה מזרח ומערב…"; "מנורה גופה צפון
    // ודרום הוה מנחה". "ns" (THE DEFAULT, as it stood): the Rambam, Beit HaBechirah 3:12 - "וכן נרות המנורה כנגד רחב הבית בין
    // הצפון ובין הדרום". "ew": Rabbi - Rashi there: "השלשה קנים במזרח והשלשה במערב"; the Ra'avad on 3:12, Tosafot Menachot 98b and
    // the Bartenura (Tamid 3:9) read the Mishnah of Tamid so ("שתי נרות מזרחיות"). The whole menorah turns a quarter about its shaft,
    // its stone with it: in "ew" the stone stands north of it, toward the inside of the heichal (a model choice - the sources give
    // "לפני המנורה" only). The lamps are plain cups with no mouth drawn, so nothing else turns. The table does not move: its length
    // lies along the house in both (the Rambam rules so for it, as Rabbi).
    // TABLE_DIR_195 - 1.9.5 (the user, 22:39, asked whether to add R. Elazar b. R. Shimon in full: "כן, למה לא"): THE TABLE'S
    // DIRECTION. "ew" (THE DEFAULT, as it stood): its length along the house - the Rambam, Beit HaBechirah 3:12 "והיה מנח ארכו
    // לארך הבית ורחבו לרחב הבית", as Rabbi. "ns": R. Elazar b. R. Shimon - "גמר מארון: מה ארון צפון ודרום, אף הני נמי צפון
    // ודרום" (Menachot 98b; Rashi: "אורכו לרוחבו של בית"). The table turns a quarter about its middle, with all that is on it.
    ctx2.shared.tableDir = {
      current: "ew",
      keys: ["ew", "ns"],
      set(k) {
        k = k === "ns" ? "ns" : "ew";
        this.current = k;
        TBL.rot = k === "ns" ? Math.PI / 2 : 0;
        const m = int_part(TBL.x, LV.HEI + houseRise(TBL.x), TBL.z, TBL.rot, 0, 0, 0);
        for (const im of [tblBody, tblCrown, tblRig, tblEnds, tblSpoons, tblBread, tblIncense]) {
          im.setMatrixAt(0, m);
          im.instanceMatrix.needsUpdate = true;
          if (typeof im.computeBoundingSphere === "function") im.computeBoundingSphere();
          if (typeof im.computeBoundingBox === "function") im.computeBoundingBox();
        }
        if (SOL_HOOK.place) SOL_HOOK.place();   // SOLOMON_214
        return true;
      },
      get() { return this.current; }
    };
    const menLay = { ns: new Group(), ew: new Group() };   // two empty groups: the layers of the stone's two labels
    menLay.ew.visible = false;
    g.add(menLay.ns, menLay.ew);
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.menNS = menLay.ns;
    ctx2.layers.menEW = menLay.ew;
    ctx2.shared.menorahDir = {
      current: "ns",
      keys: ["ns", "ew"],
      set(k) {
        k = k === "ew" ? "ew" : "ns";
        this.current = k;
        MEN.rot = k === "ew" ? 0 : Math.PI / 2;
        const m = int_part(MEN.x, FL, MEN.z, MEN.rot, 0, 0, 0);
        for (const im of [menBody, menStone]) {
          im.setMatrixAt(0, m);
          im.instanceMatrix.needsUpdate = true;
          if (typeof im.computeBoundingSphere === "function") im.computeBoundingSphere();
          if (typeof im.computeBoundingBox === "function") im.computeBoundingBox();
        }
        flameAt(MEN.rot).forEach((p, i) => { flamePos[i][0] = p[0]; flamePos[i][1] = p[1]; flamePos[i][2] = p[2]; });   // LAMPS_MIDDLE_211: in place - ctx2.shared.menorah keeps this array
        midSync();
        flamePos.forEach((p, i) => flames.setMatrixAt(i, int_m4(p[0], p[1], p[2], 0, MEN.rot, 0)));
        flames.instanceMatrix.needsUpdate = true;
        if (typeof flames.computeBoundingSphere === "function") flames.computeBoundingSphere();
        menLay.ns.visible = k === "ns";
        menLay.ew.visible = k === "ew";
        const fp = ctx2.shared.flyPoints && ctx2.shared.flyPoints.menorah;   // the menorah's view: broadside to the row of the lamps
        if (fp) fp.pos = k === "ew" ? [MEN.x + 1.2, FL + 3.2, MEN.z - 4.4] : [MEN.x + 4.2, FL + 3.2, MEN.z + 1.2];
        if (SOL_HOOK.place) SOL_HOOK.place();   // SOLOMON_214
        return true;
      },
      get() { return this.current; }
    };
    // ---- SOLOMON_214 BEGIN (the user, 16.11.2026 17:21: "האם בבית שני היו עשרת השולחנות שעשה שלמה"; 17:32: "1. כן 2. כן 3. נכון"; 20:21,
    // on the two open choices below: "1. אפשרות א 2. אפשרות א" - the Gemara with Rashi, and the menorahs as the tables): SOLOMON'S TEN
    // TABLES AND TEN MENORAHS - a row of the opinions table ("שולחנות שלמה ומנורותיו — בבית שני"). "one" (THE DEFAULT, as it stood): the
    // Tosafot Rid on Yoma 51b (2109:157) - "אלמא לא הי' בהיכל אלא שלחן אחד בלבד בבית שני", "ויקבץ את כל כלי הזהב אשר עשה שלמה".
    // "ten": Rashi on Yoma 51b (2157:1951) reads that sugya, of the Second Temple, with Solomon's ten tables; the Meforash on Tamid 31b
    // (2105:319): "ועשר שולחנות היו עדיין בהיכל שעשה שלמה... ובאותן של שלמה לא היו מסדרים" - no bread on them (SOLOMON_FORM_217), unlit
    // menorahs (Menachot 99a, 131:3528-3529: "ולא היו מסדרין אלא על של משה... ולא היו מדליקין אלא בשל משה"). The menorahs - the user
    // ("2. כן"; "ולכאורה מחלוקתם היא גם לגבי המנורות").
    // THE PLACES (Menachot 98b-99a, 131:3504-3527; Rashi 2186:4676-4704): "של משה באמצע, חמשה מימינו וחמשה משמאלו" - all the tables in
    // the north, the menorahs in the south, from the house's middle inward; "תרי דרי נינהו" - two rows of five, head to head. They
    // follow the row "כיוון המנורה והשולחן":
    //   the table north-south (R. Elazar b. R. Shimon): Rashi on Yoma 51b - "חמש בשורה אחת פונות ראשה של זו לראשה של זו... ועל כרחך
    //   צריך היה לסמוך ראש השולחן הצפוני לכותל"; Rashi on 99a - "שורה מערבית משוכה מכותל מערבי שתי אמות ומחצה ואמה רוחב דשולחן ושתי
    //   אמות ומחצה בינו ובין השלחן של משה": from the parochet 2.5, the west row, 2.5, Moses' table (one amah west of its own place), 2.5,
    //   the east row (its southern table 0.06 from the golden altar - "ראש השולחן הדרומי סמוך למזבח", Rashi there);
    //   the table east-west (the Rambam, Rabbi): Menachot 99a - "מי סברת שלחן דמשה בהדייהו הוה יתיב? לא, דמידלי ליה, ומנח ליה,
    //   ומיתתי להו לדידהו פורתא, כתלמיד היושב לפני רבו"; Rashi: "שלא יהא מונח ביניהם ממש אלא משוך לצד מערב וראשו מכוון כנגד אויר שבין
    //   שתי השורות", "מושיבם לצד מזרח במקום נמוך": the north row 2.5 from the north wall ("שורה הצפונית... מרוחקת מכותל צפוני שתי
    //   אמות ומחצה"), 2.5, the south row - each five head to head along the house; Moses' table west of them, on the line of the air
    //   between the rows (1.75 south of its own place), the rows beginning half an amah east of its head.
    // The menorahs: as the tables, in the south (the Meiri: "כשם שנחלקו בשלחנות לצד הצפון כך נחלקו במנורות לצד
    // דרום") - two rows of five about Moses' menorah, which does not move (the morning's service goes to it); north-south they stand from
    // the south wall (MENOROT_305, below).
    // The floor rises westward (10-core.js houseRise): each vessel stands on the floor at its own x - "כתלמיד היושב לפני רבו, נמוך
    // הימנו... דבית המקדש היה משופע ולצד מערב מגביה יותר" (Rashi 99a). Not lit, nothing on them; their metal follows vesselMetal.
    const SOL = { on: false };
    {
      const sg = new Group();
      sg.name = "solomonVessels";
      sg.visible = false;
      g.add(sg);
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.solomonVessels = sg;
      const FLx = (x) => LV.HEI;   // SLOPE2_D (fix-d): the vessels' group is sheared when the floor slopes (50-heichal.js) - built level here
      const id10 = () => Array.from({ length: 10 }, () => int_part(0, -50, 0, 0, 0, 0, 0));
      const mk = (geo, mat, sh) => int_inst(sg, geo, mat, id10(), sh);
      SOL.tBody = mk(tableGeo.body, tblBody.material, true);
      SOL.tCrown = mk(tableGeo.crown, tblCrown.material, false);
      // SOLOMON_FORM_217 (the user, 17.11.2026: "השולחנות מאויירים כשולחנות פשוטים בלי הסניפים והמנקיות כמו שלחן לחם הפנים עצמו, ובבית
      // ראשון מאויירים השולחנות בשלמותם"): each of the ten in the form of Moses' table, as the First Temple's ten (its 55-interior.js, L.46):
      // the posts and the reeds (with the loaves' shape, breadShape), their ends, and the two spoons - empty; no bread and no frankincense:
      // "ולא היו מסדרין אלא על של משה" (Menachot 99a). Until 2.0.7 the board and the crown only.
      SOL.tRig = BREAD_SH.shaped(mk(tableGeo.rig, METALS.gold.tbl, false), tableGeo.rig, tableGeo.rigB);
      SOL.tEnds = BREAD_SH.shaped(mk(tableGeo.ends, tubeEndMat, false), tableGeo.ends, tableGeo.endsB);
      SOL.tSpoons = mk(tableGeo.spoons, METALS.gold.tbl, false);
      SOL.tParts = [SOL.tBody, SOL.tCrown, SOL.tRig, SOL.tEnds, SOL.tSpoons];
      SOL.mBody = mk(menorahGeo.body, menBody.material, true);
      SOL.mMidNS = mk(menorahGeo.midNS, menBody.material, false);
      SOL.mSideNS = mk(menorahGeo.sideNS, menBody.material, false);
      SOL.mMidEW = mk(menorahGeo.midEW, menBody.material, false);
      SOL.mSideEW = mk(menorahGeo.sideEW, menBody.material, false);
      // SOLOMON_LIT_218 (the user, 17.11.2026: "כן, להוסיף מתג"; "כמו עכשיו: על כולם יחד"): "רבי אלעזר בן שמוע אומר: על כולם היו
      // מסדרין... ובכולן היו מדליקין" (Menachot 99a; 131:3530; so R. Yose b. R. Yehuda in the Jerusalem Talmud, Shekalim 6:3, 154:206) -
      // the loaves and the frankincense on each of the ten, and the seven lamps of each of the ten alight (SOL.lit); the Tanna Kamma's
      // "ולא היו מסדרין אלא על של משה... ולא היו מדליקין אלא בשל משה" (3528-3529) is the default. All of them at once - the user's
      // choice; Rashi there: "על כולן היו מסדרין - פעמים בזה פעמים בזה" (2186:4706), told in the card. No lights of their own (the
      // flames only).
      SOL.lit = false;
      SOL.tBread = BREAD_SH.shaped(mk(tableGeo.bread, breadMat, false), tableGeo.bread, tableGeo.breadB);
      SOL.tIncense = mk(tableGeo.incense, incenseMat, false);
      SOL.flames = int_inst(sg, flameG, flameMat, Array.from({ length: 70 }, () => int_m4(0, -50, 0, 0, 0, 0)), false);
      SOL.flamePos = [];   // [x, y, z, rot] of the seventy
      for (const im of [SOL.tBread, SOL.tIncense, SOL.flames]) im.visible = false;
      SOL.TBL0 = { x: TBL.x, z: TBL.z };
      // the places: { tables: [[x, z, rot] x 10], mens: [[x, z, rot] x 10], mt: [x, z] - Moses' table }
      SOL.layout = () => {
        const tNS = ctx2.shared.tableDir && ctx2.shared.tableDir.current === "ns";
        const mEW = (ctx2.shared.menorahDir && ctx2.shared.menorahDir.current === "ew") || !!(ctx2.shared.menorah && ctx2.shared.menorah.ew);   // MEN_ALL_G6 (the user 24.11.2026): the row "המנורה והנרות בבוקר", Rashi - the menorah turns east-west, and Solomon's ten with it
        const tables = [], mens = [];
        let mt = [SOL.TBL0.x, SOL.TBL0.z];
        if (tNS) {
          // ALTAR_EAST_305: the east row at 2.5 from Moses' table as the west row (Rashi 99a "כו'"); until 2.0.13 0.06 west of that,
          // touching the altar - now an amah and a quarter from it
          const xW = -44.5 + 2.5 + 0.5, xM = xW + 3.5, xE = xM + 3.5;
          for (const x of [xW, xE]) for (let i = 0; i < 5; i++) tables.push([x, -9 + 2 * i, Math.PI / 2]);
          mt = [xM, SOL.TBL0.z];
        } else {
          const zN = -10 + 2.5 + 0.5, zS = zN + 3.5, zM = (zN + zS) / 2, xM = SOL.TBL0.x, x0 = xM + 1 + 0.5 + 1;
          for (const z of [zN, zS]) for (let i = 0; i < 5; i++) tables.push([x0 + 2 * i, z, 0]);
          mt = [xM, zM];
        }
        {
          const xM = MEN.x, zM = mEW ? MEN.z : MEN0.z;
          // MENOROT_305: north-south - the five of a row from the south wall toward the middle, a little air between them and from the
          // wall (0.05); the east row 2.5 east of Moses' menorah, before the tables' east row (3.5 until 3.0.4 - it stood in the way
          // between the altar and the tables), the west row 3.5 west of it (the golden stands at x -42); between the tables' heads
          // (z 0) and the menorahs' (z 1.4) R. Meir's way - "בין שלחן למנורה" (the Ritva, Yoma 51b). Until 3.0.4: two amot apart from z 1
          // MEN_AS_TABLES_420 (the user 24.11.2026: "לא יכול להיות דבר כזה שהמנורות והשלחנות לא לאותו הצד - עיין בבית ראשון"): the menorahs'
          // rows follow the TABLES' reading, as in the First Temple (its 55-interior.js: "Menorot mirror the tables in the south") - two columns
          // north-south when the tables stand north-south, two rows along the house when they stand east-west; each menorah's own turn (its
          // branches) still follows the row of the menorah's direction. Until now the rows followed the menorah's direction alone
          const rr = mEW ? 0 : Math.PI / 2;
          if (tNS) { const h = 3 * LAMP_R + 0.115, gp = 0.05; for (const x of [xM - 3.5, xM + 2.5]) for (let i = 0; i < 5; i++) mens.push([x, 10 - gp - h - i * (2 * h + gp), rr]); }
          else { const zN = zM - 1.75, zS = zM + 1.75, x0 = xM + 2.5; for (const z of [zN, zS]) for (let i = 0; i < 5; i++) mens.push([x0 + 2 * i, z, rr]); }
        }
        return { tables, mens, mt };
      };
      SOL.place = () => {
        const L = SOL.layout();
        L.tables.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); for (const im of SOL.tParts) im.setMatrixAt(i, m); });
        L.mens.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); for (const im of [SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) im.setMatrixAt(i, m); });
        // SOLOMON_LIT_218: the loaves and the frankincense on each table; each menorah's seven flames, on its lamps as Moses' (flameXZ)
        L.tables.forEach(([x, z, r], i) => { const m = int_part(x, FLx(x), z, r, 0, 0, 0); SOL.tBread.setMatrixAt(i, m); SOL.tIncense.setMatrixAt(i, m); });
        SOL.flamePos.length = 0;
        L.mens.forEach(([x, z, r]) => {
          const ew = Math.abs(r) < 1e-6;
          for (const dx of lampX) { const d = ew ? dx - SPT : dx === 0 ? 0 : dx - Math.sign(dx) * SPT; SOL.flamePos.push([x + d * Math.cos(r) - (!ew && dx === 0 ? SPT : 0), FLx(x) + FLY, z - d * Math.sin(r), r]); }
        });
        SOL.flamePos.forEach((q, i) => SOL.flames.setMatrixAt(i, int_m4(q[0], q[1], q[2], 0, q[3], 0)));
        for (const im of [SOL.tBread, SOL.tIncense, SOL.flames]) {
          im.instanceMatrix.needsUpdate = true;
          if (im.computeBoundingSphere) im.computeBoundingSphere();
          if (im.computeBoundingBox) im.computeBoundingBox();
        }
        const mEW = (ctx2.shared.menorahDir && ctx2.shared.menorahDir.current === "ew") || !!(ctx2.shared.menorah && ctx2.shared.menorah.ew);   // MEN_ALL_G6 (the user 24.11.2026): the row "המנורה והנרות בבוקר", Rashi - the menorah turns east-west, and Solomon's ten with it
        SOL.mMidNS.visible = SOL.mSideNS.visible = !mEW;
        SOL.mMidEW.visible = SOL.mSideEW.visible = mEW;
        SOL.mBody.visible = !SOL.menOff;   // MEIR_TABLES_305
        if (SOL.menOff) SOL.mMidNS.visible = SOL.mSideNS.visible = SOL.mMidEW.visible = SOL.mSideEW.visible = false;
        SOL.flames.visible = SOL.lit && !SOL.menOff;
        for (const im of [...SOL.tParts, SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) {
          im.instanceMatrix.needsUpdate = true;
          if (im.computeBoundingSphere) im.computeBoundingSphere();
          if (im.computeBoundingBox) im.computeBoundingBox();
        }
        // Moses' table: its place in this layout (with "one" - its own); its label, found once among the labels
        if (SOL.lbl === undefined) SOL.lbl = (ctx2.labels || []).find((l) => l && l.text === "שולחן לחם הפנים") || null;
        const mt = SOL.on ? L.mt : [SOL.TBL0.x, SOL.TBL0.z];
        if (mt[0] !== TBL.x || mt[1] !== TBL.z) {
          TBL.x = mt[0]; TBL.z = mt[1];
          const m = int_part(TBL.x, FLx(TBL.x), TBL.z, TBL.rot, 0, 0, 0);
          for (const im of [tblBody, tblCrown, tblRig, tblEnds, tblSpoons, tblBread, tblIncense]) {
            im.setMatrixAt(0, m);
            im.instanceMatrix.needsUpdate = true;
            if (im.computeBoundingSphere) im.computeBoundingSphere();
            if (im.computeBoundingBox) im.computeBoundingBox();
          }
          const fp = ctx2.shared.flyPoints && ctx2.shared.flyPoints.shulchan;
          if (fp) { fp.pos = [TBL.x + 6.2, FL + 4.4, TBL.z + 2.6]; fp.target = [TBL.x, FL + 2.1, TBL.z]; }
          if (SOL.lbl) { SOL.lbl.x = TBL.x; SOL.lbl.z = TBL.z; }
          try {
            const lg = ctx2.root.getObjectByName("labels");
            if (lg) for (const spr of lg.children) if (spr.userData && spr.userData.label === SOL.lbl) spr.position.set(TBL.x, spr.position.y, TBL.z);
          } catch (_) {}
        }
      };
      SOL.metal = (k) => {
        if (!METALS[k]) return;
        SOL.tBody.material = SOL.tSpoons.material = METALS[k].tbl;
        BREAD_SH.retint(SOL.tRig, METALS[k].tbl);
        SOL.tCrown.material = METALS[k].crown;
        for (const im of [SOL.mBody, SOL.mMidNS, SOL.mSideNS, SOL.mMidEW, SOL.mSideEW]) im.material = METALS[k].men;
      };
      SOL_HOOK.place = () => { if (SOL.on || TBL.x !== SOL.TBL0.x || TBL.z !== SOL.TBL0.z) SOL.place(); };
      SOL_HOOK.metal = (k) => SOL.metal(k);
      ctx2.shared.solomonVessels = {
        current: "one",
        keys: ["one", "ten"],
        set(k) {
          k = k === "ten" ? "ten" : "one";
          this.current = k;
          SOL.on = k === "ten";
          sg.visible = SOL.on && !this.held;
          SOL.place();
          return k;
        },
        get() { return this.current; },
        // YK_SOLOMON_215 (the user, 16.11.2026 21:43, "אפשרות ב"): while the high priest's walk of Yom Kippur runs (50-heichal.js, ykEntry),
        // Solomon's ten are hidden and his way stays as it is - with them, R. Yehuda's way crossed the menorahs' east row when the
        // menorah lies north-south, and R. Yose's crossed the tables when they lie north-south (Rashi, Yoma 51b: "הלכך מפסקי שולחנות
        // את הדרך"). At its end they are back. Moses' table and menorah stay where the reading put them.
        held: false,
        hold(on) { this.held = !!on; sg.visible = SOL.on && !this.held; },
        // MEIR_TABLES_305: Solomon's menorahs alone hidden (R. Meir's walk shows the ten tables, 50-heichal.js ykEntry)
        menHold(on) { SOL.menOff = !!on; SOL.place(); },
        layout: () => SOL.layout(),   // (tests)
        // SOLOMON_LIT_218: the bread, the frankincense and the lamps on all ten (the row "סידור הלחם והדלקת הנרות בכלי שלמה")
        lit: false,
        setLit(on) { this.lit = SOL.lit = !!on; for (const im of [SOL.tBread, SOL.tIncense, SOL.flames]) im.visible = SOL.lit; SOL.place(); return this.lit; }
      };
      // the seventy flames flicker as Moses' seven
      ctx2.animated.push((t) => {
        if (!SOL.lit || !sg.visible) return;
        SOL.flamePos.forEach((q, i) => {
          const s = 1 + 0.28 * Math.sin(t * 0.012 + i * 1.9) * Math.sin(t * 43e-4 + i);
          SOL.flames.setMatrixAt(i, int_m4(q[0], q[1], q[2], Math.sin(t * 9e-3 + i) * 0.1, q[3], Math.cos(t * 0.011 + i * 2) * 0.1, 1, s, 1));
        });
        SOL.flames.instanceMatrix.needsUpdate = true;
      });
    }
    // ---- SOLOMON_214 END
    ctx2.shared.flyPoints = ctx2.shared.flyPoints || {};
    Object.assign(ctx2.shared.flyPoints, {
      menorah: { pos: [MEN.x + 4.2, FL + 3.2, MEN.z + 1.2], target: [MEN.x, FL + 1.7, MEN.z] },
      // 1.9.3 (the full scan: the table's top and the altar's name were cut by the picture's edge): a little farther and higher
      shulchan: { pos: [TBL.x + 6.2, FL + 4.4, TBL.z + 2.6], target: [TBL.x, FL + 2.1, TBL.z] },
      goldenAltar: { pos: [ALT.x + 5.6, FLA + 3.8, ALT.z + 2.2], target: [ALT.x, FLA + 2, ALT.z] }
    });
    ctx2.labels.push(
      { text: "המנורה", x: MEN.x, y: FL + 4.6, z: MEN.z, size: 1.6 },
      { text: "אבן שלפני המנורה — שלוש מעלות", x: MEN.x - 1.9, y: FL + 1.6, z: MEN.z, size: 0.9, layer: "menNS" },
      { text: "אבן שלפני המנורה — שלוש מעלות", x: MEN.x, y: FL + 1.6, z: MEN.z - 1.9, size: 0.9, layer: "menEW" },   // MENORAH_DIR_195
      { text: "שולחן לחם הפנים", x: TBL.x, y: FL + 3.6, z: TBL.z, size: 1.6 },
      { text: "מזבח הזהב", x: ALT.x, y: FLA + 3.3, z: ALT.z, size: 1.6 }
    );
  }
