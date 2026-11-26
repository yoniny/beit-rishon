// In-page helpers of the full scan (tools/scan-full.mjs). Evaluated in the HOUSE'S frame (after tm-ready); defines window.__SCAN.
// Everything here reads the scene as the model itself keeps it (window.__TM_CTX, window.__ent360) - no change of the product's code.
(() => {
  if (window.__SCAN) return;
  const c = window.__TM_CTX, T = c.THREE, scene = c.scene, cam = c.camera, ctl = c.controls, E = window.__ent360, R = window.__renderer;
  const V3 = T.Vector3;
  const vis = (o) => { for (; o; o = o.parent) if (o.visible === false) return false; return true; };
  const r2 = (v) => Math.round(v * 100) / 100;
  const h32 = (a, v) => (Math.imul(a ^ (v | 0), 16777619) >>> 0);
  const q = (v) => Math.round(v * 50);
  const S = {};
  S.ray = () => { if (!E.cam.ray) E.floorY({ x: 0, y: 0, z: 0 }); return E.cam.ray; };

  // ---- the scene's visible geometry: a hash per mesh (matrix, count, material), a map id -> hash, and the sums
  // Background motion that runs by itself, whatever the demonstration does (flames and their sprites, the way to the immersion house, the altar, the courts, the
  // curtains' sway, the incense cloud and the altar's smoke puffs): `snap({ still: true })` leaves it out, so that "the scene stands still while paused" looks only
  // at what the demonstration moves.
  const BG_NAME = /^(tevilaWay|courts|altar|parochet|tm-kk-cloud|thronePalm|shiloachSpring)/i;
  // SCAN_420: an overlay drawn over the walls (depthTest off, transparent - the floating colour's chevrons of the mesibah) is a guide, not the scene
  const isOverlay = (o) => { const m = o && o.material; const a = Array.isArray(m) ? m[0] : m; return !!(a && a.depthTest === false && a.transparent); };
  const isBg = (o) => { if (o.isSprite || isOverlay(o) || (o.isInstancedMesh && o.geometry && o.geometry.type === 'IcosahedronGeometry')) return true; for (let p = o; p; p = p.parent) if (p.name && BG_NAME.test(p.name)) return true; return false; };
  S.snap = (opt) => {
    scene.updateMatrixWorld(true);
    const ids = new Map(), names = new Map(), still = !!(opt && opt.still);
    let n = 0, tot = 0;
    scene.traverse((o) => {
      if (!(o.isMesh || o.isLine || o.isPoints || o.isSprite)) return;
      if (!vis(o)) return;
      if (still && isBg(o)) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      if (m && m.visible === false) return;
      let h = 2166136261;
      const e = o.matrixWorld.elements;
      for (let i = 0; i < 16; i++) h = h32(h, q(e[i]));
      h = h32(h, o.geometry ? o.geometry.id : 0);
      if (o.isInstancedMesh) { h = h32(h, o.count); const a = o.instanceMatrix.array, st = Math.max(16, Math.floor(a.length / 16 / 40) * 16); for (let i = 0; i < a.length; i += st) h = h32(h, q(a[i + 12]) ^ q(a[i + 13]) ^ q(a[i + 14])); }
      if (m) { h = h32(h, q(m.opacity == null ? 1 : m.opacity * 4)); if (m.color) h = h32(h, m.color.getHex()); }
      ids.set(o.id, h); { let nm = ''; for (let p = o; p && !nm; p = p.parent) nm = p.name || ''; names.set(o.id, nm ? (o.name ? nm : nm + '/' + o.type) : o.type); }   // SCAN_420: the nearest named ancestor - 'Mesh' alone says nothing
      n++; tot = (tot + h) >>> 0;
    });
    return { n, tot, ids, names };
  };
  // the ids that move or flicker by themselves (flames, smoke, the way to the immersion house...): what two snapshots of the SAME state differ in
  S.noise = (a, b) => { const z = new Set(); for (const [id, h] of b.ids) { const g = a.ids.get(id); if (g === undefined || g !== h) z.add(id); } for (const [id] of a.ids) if (!b.ids.has(id)) z.add(id); return z; };
  S.cmp = (a, b, ign) => {
    if (ign) { const cp = (x) => { const ids = new Map(), names = new Map(); for (const [id, h] of x.ids) if (!ign.has(id)) { ids.set(id, h); names.set(id, x.names.get(id)); } return { n: ids.size, tot: 0, ids, names }; }; a = cp(a); b = cp(b); a.tot = b.tot = 0; }
    let added = 0, removed = 0, changed = 0; const ex = [];
    for (const [id, h] of b.ids) { const g = a.ids.get(id); if (g === undefined) { added++; if (ex.length < 6) ex.push('+' + b.names.get(id)); } else if (g !== h) { changed++; if (ex.length < 6) ex.push('~' + b.names.get(id)); } }
    for (const [id] of a.ids) if (!b.ids.has(id)) { removed++; if (ex.length < 6) ex.push('-' + a.names.get(id)); }
    return { added, removed, changed, same: a.tot === b.tot && !added && !removed && !changed, n0: a.n, n1: b.n, ex };
  };

  // ---- pixels: one frame, the canvas drawn small; stats; difference between two captures
  const W0 = 160, H0 = 100;
  const cv = document.createElement('canvas'); cv.width = W0; cv.height = H0; const cx = cv.getContext('2d', { willReadFrequently: true });
  S.px = (stepMs) => {
    window.__step(stepMs == null ? 16 : stepMs);
    cx.drawImage(R.domElement, 0, 0, W0, H0);
    return cx.getImageData(0, 0, W0, H0).data.slice();
  };
  S.pdiff = (a, b) => {
    let big = 0, sum = 0;
    for (let i = 0; i < a.length; i += 4) { const d = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]); sum += d; if (d > 36) big++; }
    return { frac: big / (a.length / 4), mean: sum / (a.length / 4) / 3 };
  };
  S.pstats = (a) => {
    const N = a.length / 4; let sum = 0, sq = 0, dark = 0, cnt = new Map(), cN = 0, cSum = 0;
    for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) {
      const i = (y * W0 + x) * 4, l = 0.2126 * a[i] + 0.7152 * a[i + 1] + 0.0722 * a[i + 2];
      sum += l; sq += l * l; if (l < 14) dark++;
      const k = (a[i] >> 4) | ((a[i + 1] >> 4) << 4) | ((a[i + 2] >> 4) << 8); cnt.set(k, (cnt.get(k) || 0) + 1);
      if (x > W0 * 0.3 && x < W0 * 0.7 && y > H0 * 0.3 && y < H0 * 0.7) { cSum += l; cN++; }
    }
    let top = 0; for (const v of cnt.values()) if (v > top) top = v;
    const mean = sum / N;
    return { mean: r2(mean), std: r2(Math.sqrt(Math.max(0, sq / N - mean * mean))), dark: r2(dark / N), top: r2(top / N), centre: r2(cSum / cN) };
  };
  S.jpg = (w, qlt) => {
    const c2 = document.createElement('canvas'), w2 = w || 480; c2.width = w2; c2.height = Math.round(w2 * R.domElement.height / R.domElement.width);
    c2.getContext('2d').drawImage(R.domElement, 0, 0, c2.width, c2.height);
    return c2.toDataURL('image/jpeg', qlt || 0.62);
  };

  // ---- camera diagnostics
  const wsph = (o) => {
    try {
      const g = o.geometry; if (!g) return null;
      if (o.isInstancedMesh) { if (!o.boundingSphere) o.computeBoundingSphere(); const s = o.boundingSphere; return s ? { c: s.center.clone().applyMatrix4(o.matrixWorld), r: s.radius * o.matrixWorld.getMaxScaleOnAxis() } : null; }
      if (!g.boundingSphere) g.computeBoundingSphere(); const s = g.boundingSphere;
      return { c: s.center.clone().applyMatrix4(o.matrixWorld), r: s.radius * o.matrixWorld.getMaxScaleOnAxis() };
    } catch (_) { return null; }
  };
  S.sph = new Map(); // mesh id -> sphere (refreshed with the solids list)
  S.solids = (kind) => { const L = E.solids(kind === 'floor' ? 'floor' : kind === 'roof' ? true : false); return L; };
  S.refreshSph = () => { S.sph.clear(); scene.updateMatrixWorld(true); for (const o of S.solids('roof')) { const s = wsph(o); if (s) S.sph.set(o.id, s); } };
  const DIRS = []; for (const x of [-1, 0, 1]) for (const y of [-1, 0, 1]) for (const z of [-1, 0, 1]) if (x || y || z) DIRS.push(new V3(x, y, z).normalize());
  // is p inside a solid (a back face of a closed mesh is the first thing met in many directions)?  -> { back, of, names }
  S.inside = (p, far, skip) => {
    far = far || 2.5;
    const ray = S.ray(), list = [];
    for (const o of S.solids('all')) { if (skip && skip.has(o.id)) continue; if (isOverlay(o)) continue; const s = S.sph.get(o.id) || wsph(o); if (!s) continue; if (p.distanceTo(s.c) <= s.r + far) list.push(o); }
    const sides = list.map((o) => { const m = o.material; return Array.isArray(m) ? m.map((x) => x.side) : m.side; });
    list.forEach((o) => { const m = o.material; if (Array.isArray(m)) m.forEach((x) => (x.side = 2)); else m.side = 2; });
    let back = 0; const of = new Map(), hit = new Array(DIRS.length).fill(null);
    try {
      DIRS.forEach((d, i) => {
        ray.set(p, d); ray.near = 0; ray.far = far;
        const hs = ray.intersectObjects(list, false);
        if (!hs.length) return;
        const h = hs[0], o = h.object; if (!h.face) return;
        const nrm = h.face.normal.clone();
        if (h.instanceId != null && o.isInstancedMesh) { const mm = new T.Matrix4(); o.getMatrixAt(h.instanceId, mm); nrm.transformDirection(mm); }
        nrm.transformDirection(o.matrixWorld);
        const os = Array.isArray(sides[list.indexOf(o)]) ? sides[list.indexOf(o)][0] : sides[list.indexOf(o)];
        if (os === 1) return;   // a BackSide surface (a room modelled inside out) is meant to be seen from inside
        if (nrm.dot(d) > 0.05) hit[i] = o;
      });
      // SCAN_420: a back face counts only when the opposite direction also meets one first (DIRS is symmetric: the opposite of i is 25 - i) -
      // inside a solid both ways are closed; a lone back face is an open shell or a face turned the wrong way, met from the outside
      DIRS.forEach((d, i) => {
        const o = hit[i]; if (!o || !hit[DIRS.length - 1 - i]) return;
        back++; const nm = o.name || (o.parent && o.parent.name) || o.type; of.set(nm, (of.get(nm) || 0) + 1);
      });
    } finally {
      list.forEach((o, i) => { const m = o.material; if (Array.isArray(m)) m.forEach((x, k) => (x.side = sides[i][k])); else m.side = sides[i]; });
    }
    return { back, of: [...of.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map((e) => e[0] + '×' + e[1]) };
  };
  // SCAN_420: is p inside the closed body o? (an odd number of crossings upward and eastward - both faces counted)
  S.holds = (o, p) => {
    const bx = new T.Box3().setFromObject(o); if (!bx.expandByScalar(0.5).containsPoint(p)) return false;
    const mats = Array.isArray(o.material) ? o.material : [o.material], sd = mats.map((m) => m.side); mats.forEach((m) => (m.side = 2));
    try {
      const rc = new T.Raycaster(); let odd = 0;
      for (const d of [new V3(0, 1, 0), new V3(1, 0, 0), new V3(0, 0, 1)]) { rc.set(p, d); rc.near = 0; rc.far = 1e4; const n = rc.intersectObject(o, false).length; if (n % 2 === 1) odd++; }
      return odd >= 2;
    } finally { mats.forEach((m, i) => (m.side = sd[i])); }
  };
  S.occluder = (from, to) => {
    const ray = S.ray(), d = new V3().subVectors(to, from), L = d.length(); if (L < 1e-3) return null;
    d.normalize(); ray.set(from, d); ray.near = 0; ray.far = L;
    for (const h of ray.intersectObjects(S.solids('all'), false)) {
      const o = h.object, m = Array.isArray(o.material) ? o.material[0] : o.material;
      if (o.userData && (o.userData.fade || o.userData.tmPass || o.userData.noPick)) continue;
      if (m && (m.opacity < 0.6 || m.visible === false)) continue;
      // SCAN_420: the subject itself - a body whose box holds the target (the altar, the sea, the ramp, a chamber's walls round its middle) -
      // is what the view looks at, not something in its way
      try { if (S.holds(o, to)) return null; } catch (_) {}
      if (h.distance < L - 1.5) { let nm = ''; for (let q = o; q && !nm; q = q.parent) nm = q.name || ''; return { d: r2(h.distance), L: r2(L), name: nm || o.type }; }
      return null;
    }
    return null;
  };
  S.nearest = (p) => {   // distance from p to the nearest visible solid's bounding sphere (the terrain-sized ones excluded)
    let best = 1e9, nm = '';
    for (const [id, s] of S.sph) { if (s.r > 700) continue; const d = p.distanceTo(s.c) - s.r; if (d < best) { best = d; nm = id; } }
    return r2(best);
  };
  S.diag = () => {
    S.refreshSph();
    scene.updateMatrixWorld(true); cam.updateMatrixWorld(true);
    const P = cam.position.clone(), Tg = ctl.target.clone();
    const ndc = Tg.clone().project(cam);
    const o = { pos: P.toArray().map(r2), tg: Tg.toArray().map(r2), ndc: [r2(ndc.x), r2(ndc.y), r2(ndc.z)], inFrustum: Math.abs(ndc.x) < 0.98 && Math.abs(ndc.y) < 0.98 && ndc.z > -1 && ndc.z < 1 };
    o.inside = S.inside(P, 2.2);
    o.occ = S.occluder(P, Tg);
    o.void = S.nearest(Tg);
    o.mode = E.cam.mode;
    return o;
  };

  // ---- the floor under a point, ignoring a subtree (for the figures): the highest upward face at or under y0
  S.floorUnder = (x, y0, z, skip) => {
    const ray = S.ray(); ray.set(new V3(x, y0, z), new V3(0, -1, 0)); ray.near = 0; ray.far = 300;
    const list = skip ? S.solids('floor').filter((o) => !skip.has(o.id)) : S.solids('floor');
    const hs = ray.intersectObjects(list, false); return hs.length ? hs[0].point.y : null;
  };

  
  // ---- helpers for the jobs (run in the page: no round trip per frame)
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  S.sleep = sleep;
  S.step = async (ms, n) => { for (let i = 0; i < (n || 1); i++) { window.__step(ms); if (i % 3 === 2) await sleep(5); } };
  S.alive = () => { let lost = null; try { lost = R.getContext().isContextLost(); } catch (_) {} const st = S.pstats(S.px(16)); return { lost, mean: st.mean, std: st.std, calls: R.info.render.calls, tris: R.info.render.triangles, geo: R.info.memory.geometries, tex: R.info.memory.textures }; };
  S.shotNow = (w) => { window.__step(16); return S.jpg(w); };
  S.getPose = () => ({ p: cam.position.toArray(), t: ctl.target.toArray() });
  S.setPose = (P) => { cam.position.set(...P.p); ctl.target.set(...P.t); ctl.update(); cam.lookAt(...P.t); cam.updateMatrixWorld(true); };
  S.poseDist = (a, b) => new V3(...a.p).distanceTo(new V3(...b.p)) + new V3(...a.t).distanceTo(new V3(...b.t));
  S.yes = () => { const cf = document.getElementById('tm-confirm'); if (cf && cf.style.display === 'flex') { const y = cf.querySelector('.y'); if (y) { y.click(); return true; } } return false; };
  S.openUp = (el) => { for (let d = el && el.closest && el.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) d.open = true; };
  S.clickEl = (el) => { S.openUp(el); el.click(); };
  S.afterClick = async (big) => { S.yes(); window.__step(big || 6000); await sleep(20); S.yes(); window.__step(300); await sleep(20); window.__step(120); };
  S.rows = () => c.ui.opinions.filter((r) => r && r.id && r.box && r.options && r.options.length > 1).map((r) => ({ id: r.id, cap: r.cap, group: r.group, n: r.options.length, keys: r.options.map((o) => o[0]), labels: r.options.map((o) => o[1]), fly: typeof r.fly === 'function', cur: r.cur }));
  S.optBtn = (id, i) => { const r = c.ui.opinions.find((o) => o.id === id); return r && r.box ? r.box.querySelectorAll('.bb button')[i] : null; };
  S.groupPose = async (group) => {   // the pose of the first place with a camera in the row's group (for a row with no flight of its own)
    const p = c.ui.places().find((x) => x.group === group && (x.fp || x.view));
    if (!p) return null; const b = c.ui.placeButton(p.title); if (!b) return null;
    S.clickEl(b); await S.afterClick(6000); return S.getPose();
  };
  // one dispute: every option, from the same cameras; verdict per pair
  S.rowScan = async (id) => {
    const rows = c.ui.opinions, r = rows.find((o) => o.id === id), n = r.options.length, cur0 = r.cur;
    const keys = r.options.map((o) => o[0]);
    const res = { id, cap: r.cap, keys, errs: 0 };
    const poses = [];
    for (let i = 0; i < n; i++) {   // pass 1: the flights
      const b = S.optBtn(id, i); if (!b) { res.nobtn = (res.nobtn || 0) + 1; continue; }
      S.clickEl(b); await S.afterClick(6000); poses.push(S.getPose());
    }
    let P = [];
    if (r.fly && poses.length) { P.push(poses[0]); const far = poses.find((p) => S.poseDist(p, poses[0]) > 3); if (far) P.push(far); }
    if (P.length < 2) { const gp = await S.groupPose(r.group); if (gp) P.push(gp); }
    if (!P.length) P.push(S.getPose());
    res.poses = P.length;
    const rec = [];
    for (let i = 0; i < n; i++) {   // pass 2: the same cameras for every option
      const b = S.optBtn(id, i); if (!b) { rec.push(null); continue; }
      S.clickEl(b); await S.afterClick(6000);
      const o = { snap: [], px: [] };
      for (const pose of P) { S.setPose(pose); window.__step(60); window.__step(60); o.snap.push(S.snap()); o.px.push(S.px(16)); }
      rec.push(o);
      if (i === 0) res.img0 = S.jpg(420);
    }
    res.pairs = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (!rec[i] || !rec[j]) continue;
      let geom = false, pxMax = 0, ex = [];
      for (let k = 0; k < P.length; k++) { const cm = S.cmp(rec[i].snap[k], rec[j].snap[k]); if (!cm.same) { geom = true; if (!ex.length) ex = cm.ex; } pxMax = Math.max(pxMax, S.pdiff(rec[i].px[k], rec[j].px[k]).frac); }
      res.pairs.push({ i, j, a: keys[i], b: keys[j], geom, px: Math.round(pxMax * 10000) / 10000, ex });
    }
    // back to the first state
    const bi = keys.indexOf(cur0); const b0 = S.optBtn(id, bi < 0 ? 0 : bi); if (b0) { S.clickEl(b0); await S.afterClick(6000); }
    return res;
  };

  // ---- demonstrations: run one from its start to its end (a tick = 500 ms of the model's clock), looking at the figures at every tick
  const FIGRE = /priest|fig|person|walker|pilgrim|oleh|king|guard|carrier|bearer|levi|kohen|worker|singer|youth|boy|shiloach|actor|nazir|musician|servant/i;
  const boxOf = (obj) => {
    const b = new T.Box3(); let any = false, meshes = 0; const ids = new Set();
    obj.updateWorldMatrix(true, true);
    const rec = (o) => {
      if (o.visible === false) return;
      if (o.isMesh && !o.isInstancedMesh && o.geometry) {
        const m = Array.isArray(o.material) ? o.material[0] : o.material; if (m && m.visible === false) return;
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        b.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld)); any = true; meshes++; ids.add(o.id);
      } else if (o.isMesh) ids.add(o.id);
      for (const ch of o.children) rec(ch);
    };
    rec(obj);
    return any ? { b, meshes, ids } : null;
  };
  const ancVis = (o) => { for (let p = o.parent; p; p = p.parent) if (p.visible === false) return false; return true; };
  S.figTrack = () => ({ pos: new Map(), figs: new Map(), t: 0 });
  S.figUpdate = (T0) => {
    // movers: groups whose world position changed since the last tick; the figure = the first of them (from the top) with a human size
    scene.updateMatrixWorld(true);
    const movers = [];
    const walk = (o, depth) => {
      if (o.visible === false) return;
      if (!o.isMesh && !o.isLight && o.children.length) {
        const e = o.matrixWorld.elements, key = o.id, last = T0.pos.get(key);
        const cur = [e[12], e[13], e[14]];
        T0.pos.set(key, cur);
        const moved = last && (Math.abs(cur[0] - last[0]) + Math.abs(cur[1] - last[1]) + Math.abs(cur[2] - last[2])) > 0.04;
        if (moved || FIGRE.test(o.name || '') ) movers.push([o, depth]);
      }
      for (const ch of o.children) walk(ch, depth + 1);
    };
    walk(scene, 0);
    const has = (o) => { for (let p = o; p; p = p.parent) if (T0.figs.has(p.id)) return true; return false; };
    // The laver and the laver-machine are tall moving groups of human size, but they are not people: the group that holds the laver's parts (the unnamed bowl group
    // and the group that lifts, swings and lowers it together: the parent and the grandparent of a mesh named kiyor.../mechona...) and the named machine groups, with all
    // that is under them, are left out - so the laver is not reported "in the air" or "under the floor". A priest standing at the laver is another group and is still checked.
    const notFig = new Set();
    // SCAN_420: only a SMALL parent / grandparent (the laver's own groups, under 25 amot across) - in the First House a laver's mesh hangs
    // straight under the interior's group, and the whole interior (the doors' priest with it) was left out: no figures were found at all
    const small = (o) => { try { const b = new T.Box3().setFromObject(o), z = b.getSize(new V3()); return Math.max(z.x, z.y, z.z) < 25; } catch (_) { return false; } };
    scene.traverse((o) => { if (o.name && /^(kiyor|mechona)/i.test(o.name)) { notFig.add(o.id); if (o.parent && o.parent !== scene && small(o.parent)) { notFig.add(o.parent.id); if (o.parent.parent && o.parent.parent !== scene && small(o.parent.parent)) notFig.add(o.parent.parent.id); } } });
    const inLaver = (o) => { for (let p = o; p; p = p.parent) if (notFig.has(p.id)) return true; return false; };
    movers.sort((a, b) => a[1] - b[1]);
    for (const [o] of movers) {
      if (has(o) || T0.figs.size > 60 || inLaver(o)) continue;
      const bx = boxOf(o); if (!bx || bx.meshes < 3) continue;
      const sz = bx.b.getSize(new V3()), named = FIGRE.test(o.name || '');
      if ((sz.y >= 2.2 && sz.y <= 6.5 && Math.max(sz.x, sz.z) <= 4.6) || (named && sz.y >= 1.5 && sz.y <= 8 && Math.max(sz.x, sz.z) <= 6))
        T0.figs.set(o.id, { obj: o, name: o.name || (o.parent && o.parent.name) || o.type, frames: 0, vis: 0, under: [], hover: [], wall: [], lastVis: -1, firstVis: -1, vanish: [] });
    }
  };
  S.figCheck = (T0, t) => {
    const out = [];
    for (const [id, f] of T0.figs) {
      f.frames++;
      const o = f.obj; let v = o.visible !== false && ancVis(o);
      let bx = v ? boxOf(o) : null; if (!bx) v = false;
      if (v) {
        f.vis++; if (f.firstVis < 0) f.firstVis = t; f.lastVis = t;
        const cx = (bx.b.min.x + bx.b.max.x) / 2, cz = (bx.b.min.z + bx.b.max.z) / 2, feet = bx.b.min.y;
        let fl = null; try { fl = S.floorUnder(cx, feet + 1.4, cz, bx.ids); } catch (_) {}
        if (fl != null) {
          const dy = feet - fl;
          if (dy < -0.55 && f.under.length < 4) f.under.push({ t, dy: r2(dy), at: [r2(cx), r2(feet), r2(cz)] });
          else if (dy > 0.8 && f.hover.length < 4) f.hover.push({ t, dy: r2(dy), at: [r2(cx), r2(feet), r2(cz)] });
          if (dy < -0.55) f.nUnder = (f.nUnder || 0) + 1; if (dy > 0.8) f.nHover = (f.nHover || 0) + 1;
        } else if (f.under.length < 4) { f.noFloor = (f.noFloor || 0) + 1; }
        // the figure's chest inside a solid
        if (f.vis % 4 === 1) {
          const ch = new V3(cx, feet + (bx.b.max.y - feet) * 0.6, cz); const ins = S.inside(ch, 0.9, bx.ids);
          if (ins.back >= 8) { f.nWall = (f.nWall || 0) + 1; if (f.wall.length < 3) f.wall.push({ t, back: ins.back, of: ins.of, at: [r2(ch.x), r2(ch.y), r2(ch.z)] }); out.push('wall'); }
        }
        if (f.nUnder === 1 || f.nHover === 1) out.push('feet');
      } else if (f.lastVis >= 0 && f.lastVis === t - 0.5 && f.vanish.length < 3) f.vanish.push(t);
    }
    return out;
  };
  const running = () => (c.shared.demoStops || []).filter((d) => { try { return d.running(); } catch (_) { return false; } }).map((d) => d.id);
  S.running = running;
  S.stopAll = async () => { try { c.shared.stopDemos(); } catch (_) {} try { if (c.shared.tour && c.shared.tour.state().running) c.shared.tour.stop(); } catch (_) {} const x = document.getElementById('tm-xcard'); if (x && x.querySelector('.x')) x.querySelector('.x').click(); window.__step(300); await sleep(10); window.__step(300); };
  // run for up to maxMs of the clock; returns { ticks, ended, ... } - call again with the same state `st` to go on (st kept in the page)
  S.demoRun = async (maxMs, tickMs, opts) => {
    opts = opts || {}; tickMs = tickMs || 500;
    let st = S.cur; if (!st || opts.fresh) { st = S.cur = { T0: S.figTrack(), t: 0, idle: 0, ran: new Set(), blank: [], inside: [], nonfin: 0, caps: new Set(), shots: [], issues: new Set(), started: false, ticks: 0, fps: [] }; }
    const t_end = st.t + maxMs / 1000;   // SCAN_420: maxMs is in ms, st.t in seconds (until 4.2.0 a call ran until the demonstration ended - a looping one never did)
    let finished = false;
    while (st.t < t_end) {
      const tt0 = performance.now ? Date.now() : 0;
      window.__step(tickMs); st.t += tickMs / 1000; st.ticks++;
      const run = running(); for (const id of run) st.ran.add(id);
      const tourOn = c.shared.tour && c.shared.tour.state().running;
      if (run.length || (opts.alive && opts.alive())) { st.started = true; st.idle = 0; } else if (st.started || st.ticks > 8) st.idle++;
      if (st.ticks % 4 === 1 || st.ticks < 4) S.figUpdate(st.T0);
      const issues = S.figCheck(st.T0, st.t);
      for (const k of issues) if (!st.issues.has(k) && st.shots.length < 6) { st.issues.add(k); st.shots.push({ kind: k, t: st.t, img: S.jpg(420) }); }
      if (!isFinite(cam.position.x + cam.position.y + cam.position.z + ctl.target.x)) st.nonfin++;
      if (st.ticks % 4 === 0) {
        const px = S.px(0); const ps = S.pstats(px);
        if (ps.mean < 10 || ps.std < 4 || ps.top > 0.96) { st.blank.push({ t: st.t, ps }); if (st.blank.length === 1 && st.shots.length < 6) st.shots.push({ kind: 'blank', t: st.t, img: S.jpg(420) }); }
      }
      if (st.ticks % 8 === 0) { const d = S.diag(); if (d.inside.back >= 6) { st.inside.push({ t: st.t, back: d.inside.back, of: d.inside.of }); if (st.inside.length === 1 && st.shots.length < 6) st.shots.push({ kind: 'cam-inside', t: st.t, img: S.jpg(420) }); } }
      const cap = document.getElementById('tm-walk-cap'); if (cap && cap.style.display !== 'none' && cap.textContent) st.caps.add(cap.textContent.slice(0, 80));
      if (st.ticks % 6 === 0) await sleep(5);
      if (st.idle >= 3) { finished = true; break; }
      // SCAN_420: a demonstration that goes round and round (the laver's machine: roundLeft()) - done after opts.rounds rounds (default 1)
      for (const d of (c.shared.demoStops || [])) {
        if (typeof d.roundLeft !== 'function') continue;
        let on = false; try { on = !!d.running(); } catch (_) {}
        if (!on) continue;
        const rl = +d.roundLeft(), k = 'rl:' + d.id;
        if (st[k] != null && rl > st[k] + 1) st.rounds = (st.rounds || 0) + 1;
        st[k] = rl;
      }
      if ((st.rounds || 0) >= (opts.rounds || 1)) { finished = true; st.looped = true; break; }   // (a frame's step is capped in the model: one round of the machine is about 360 s of the scan's clock)
    }
    return { t: st.t, ticks: st.ticks, finished, looped: !!st.looped, rounds: st.rounds || 0, running: running(), ran: [...st.ran], started: st.started };
  };
  S.demoReport = () => {
    const st = S.cur; if (!st) return null;
    const figs = [...st.T0.figs.values()].map((f) => ({ name: f.name, frames: f.frames, vis: f.vis, firstVis: f.firstVis, lastVis: f.lastVis, nUnder: f.nUnder || 0, nHover: f.nHover || 0, nWall: f.nWall || 0, under: f.under, hover: f.hover, wall: f.wall, vanish: f.vanish, noFloor: f.noFloor || 0 }));
    return { t: st.t, ticks: st.ticks, ran: [...st.ran], nonfin: st.nonfin, blank: st.blank.slice(0, 3), nBlank: st.blank.length, inside: st.inside.slice(0, 3), nInside: st.inside.length, caps: st.caps.size, figs, shots: st.shots };
  };
  // the bar of a demonstration (90-entry.js #tm-dpause): the checks of its buttons
  S.demoControls = async () => {
    const o = { steps: [] }, chk = (name, ok, detail) => o.steps.push({ name, ok: !!ok, detail });
    const bar = () => document.getElementById('tm-dpause');
    const btn = (re) => { const e = bar(); return e ? [...e.querySelectorAll('button')].find((b) => re.test(b.textContent + ' ' + (b.getAttribute('aria-label') || ''))) : null; };
    await sleep(450);
    // SCAN_420: a demonstration that runs as a presentation (the morning's service: the tour's mode "tamid") is driven by the presentation's
    // own banner (#tm-tour-box: pause, back, forward, end) - not by the demonstrations' bar
    try {
      const T = c.shared.tour, ts = T && typeof T.state === 'function' ? T.state() : null;
      if (ts && ts.running) { const tb = document.getElementById('tm-tour-box'); const ok = !!tb && getComputedStyle(tb).display !== 'none'; chk('tour-banner', ok, ok ? '' : 'ההדגמה רצה כמצגת, אבל פס המצגת (#tm-tour-box) לא מוצג'); o.bar = ok; return o; }
    } catch (_) {}
    const e = bar(); const shown = !!e && getComputedStyle(e).display !== 'none';
    chk('bar-visible', shown, shown ? '' : 'פס ההדגמה (#tm-dpause) לא מוצג בזמן שהדגמה רצה');
    o.bar = shown;
    if (!shown) return o;
    const names = ['השהה', 'מההתחלה', 'עצור', 'אחורה', 'קדימה', 'לאט יותר', 'מהר יותר'];
    for (const n of names) { const b = [...e.querySelectorAll('button')].find((x) => (x.textContent + ' ' + (x.getAttribute('aria-label') || '')).includes(n)); if (!b) chk('btn-' + n, false, 'הכפתור "' + n + '" חסר בפס'); else if (n !== 'מההתחלה') { const r = b.getBoundingClientRect(); chk('btn-' + n, r.width > 4 && r.height > 4, 'גודל ' + Math.round(r.width) + '×' + Math.round(r.height)); } }
    const tick = async (n) => { for (let i = 0; i < n; i++) { window.__step(500); if (i % 3 === 2) await sleep(5); } await sleep(40); };
    await tick(4);
    // pause
    const bp = btn(/השהה|המשך/);
    if (bp) {
      bp.click(); await sleep(60); const paused = c.shared.demoPaused(); chk('pause', paused, 'demoPaused() אחרי לחיצה על השהה: ' + paused);
      window.__step(100); const s0 = S.snap({ still: true }); await tick(3); const s1 = S.snap({ still: true }); const cm = S.cmp(s0, s1); chk('paused-still', cm.same, 'בזמן השהיה הסצנה השתנתה: +' + cm.added + ' −' + cm.removed + ' ~' + cm.changed + ' ' + cm.ex.join(','));
      await sleep(350); const bp2 = btn(/השהה|המשך/); chk('pause-label', bp2 && /המשך|▶/.test(bp2.textContent + ' ' + (bp2.getAttribute('aria-label') || '')), 'תווית הכפתור בהשהיה: ' + (bp2 && bp2.textContent));
      if (bp2) { bp2.click(); await sleep(60); const p2 = c.shared.demoPaused(); chk('resume', !p2 && running().length > 0, 'אחרי המשך: demoPaused=' + p2 + ', רצות=' + running().join(',')); }
      const s2 = S.snap(); await tick(3); const s3 = S.snap(); const cm2 = S.cmp(s2, s3); chk('resumed-moves', !cm2.same, 'אחרי המשך הסצנה לא זזה');
    } else chk('pause', false, 'כפתור ההשהיה חסר');
    // speed
    const lab = () => { const sp = e.querySelectorAll('span'); return [...sp].map((x) => x.textContent).find((t) => /מהירות|^×/.test(t)) || ''; };
    const l0 = lab(); const fa = btn(/מהר יותר/); if (fa) { fa.click(); await sleep(350); const l1 = lab(); chk('faster', l1 !== l0 || fa.disabled, 'תווית מהירות ' + l0 + ' → ' + l1); }
    const sl = btn(/לאט יותר/); if (sl) { const lb = lab(); sl.click(); await sleep(350); const la = lab(); chk('slower', la !== lb || sl.disabled, 'תווית מהירות ' + lb + ' → ' + la); sl.click(); await sleep(100); }
    // forward / back: the scene or the walk's caption moves
    await tick(2);
    const fw = btn(/קדימה/); if (fw) { const sa = S.snap(), ca = (document.getElementById('tm-walk-cap') || {}).textContent; fw.click(); await sleep(60); window.__step(200); await sleep(20); window.__step(200); const sb = S.snap(), cb = (document.getElementById('tm-walk-cap') || {}).textContent; const cm3 = S.cmp(sa, sb); chk('forward', !cm3.same || ca !== cb, 'קדימה לא שינה את הסצנה או הכיתוב'); }
    await tick(3);
    const bk = btn(/אחורה/); if (bk) { const sa = S.snap(), ca = (document.getElementById('tm-walk-cap') || {}).textContent; bk.click(); await sleep(60); window.__step(200); await sleep(20); window.__step(200); const sb = S.snap(), cb = (document.getElementById('tm-walk-cap') || {}).textContent; const cm4 = S.cmp(sa, sb); chk('back', !cm4.same || ca !== cb, 'אחורה לא שינה את הסצנה או הכיתוב'); }
    const rs = btn(/מההתחלה/); if (rs && getComputedStyle(rs).display !== 'none' && running().length) {   // SCAN_420: a short demonstration may have ended under "קדימה" - then the bar is gone for the user too
      rs.click(); await sleep(60); await tick(2); chk('restart', running().length > 0, 'אחרי "מההתחלה" ההדגמה אינה רצה'); }
    // stop
    const st = btn(/עצור/); if (st) { st.click(); await sleep(60); window.__step(300); await sleep(20); window.__step(300); await sleep(400); const r = running(); chk('stop', r.length === 0, 'אחרי "עצור" עדיין רצות: ' + r.join(',')); const e2 = bar(); chk('bar-hides', !e2 || getComputedStyle(e2).display === 'none', 'פס ההדגמה נשאר מוצג אחרי עצירה'); }
    return o;
  };

  window.__SCAN = S;
})();
