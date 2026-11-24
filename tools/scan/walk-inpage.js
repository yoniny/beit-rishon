// Category 6, in the page: a map of the walker's floor (the model's own rule: 90-entry.js cam_walkFloor - the eye follows the highest
// upward face at or under (the floor it stands on + 1.2), in steps of a third of an amah) over a grid; nodes = (column, level);
// edges = the walker's micro-walk between neighbouring columns. Triangles are binned and tested analytically (a vertical ray against a triangle).
(() => {
  const S = window.__SCAN, c = window.__TM_CTX, T = c.THREE, E = window.__ent360, scene = c.scene;
  const STEP = 0.33, UP = 1.2;
  S.walkBuild = async (G, cap) => {
    G = G || 2; const t0 = Date.now();
    scene.updateMatrixWorld(true);
    const list = E.solids('floor');
    // region
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    S.refreshSph();
    for (const o of list) { const s = S.sph.get(o.id); if (!s || s.r > 700) continue; x0 = Math.min(x0, s.c.x - s.r); x1 = Math.max(x1, s.c.x + s.r); z0 = Math.min(z0, s.c.z - s.r); z1 = Math.max(z1, s.c.z + s.r); }
    // triangles
    let buf = new Float32Array(9 * 400000), nt = 0, cbuf = new Float32Array(9 * 100000), nc = 0;
    const push = (A, nn, ax, ay, az, bx, by, bz, cx, cy, cz) => { let b = A === 0 ? buf : cbuf; if (A === 0) { if ((nt + 1) * 9 > b.length) { const nb = new Float32Array(b.length * 2); nb.set(b); buf = b = nb; } const o = nt * 9; b[o] = ax; b[o + 1] = ay; b[o + 2] = az; b[o + 3] = bx; b[o + 4] = by; b[o + 5] = bz; b[o + 6] = cx; b[o + 7] = cy; b[o + 8] = cz; nt++; } else { if ((nc + 1) * 9 > b.length) { const nb = new Float32Array(b.length * 2); nb.set(b); cbuf = b = nb; } const o = nc * 9; b[o] = ax; b[o + 1] = ay; b[o + 2] = az; b[o + 3] = bx; b[o + 4] = by; b[o + 5] = bz; b[o + 6] = cx; b[o + 7] = cy; b[o + 8] = cz; nc++; } };
    const M = new T.Matrix4(), M2 = new T.Matrix4();
    let skipped = 0;
    for (const o of list) {
      const g = o.geometry; if (!g || !g.attributes || !g.attributes.position) continue;
      const m = Array.isArray(o.material) ? o.material[0] : o.material; const side = m ? m.side : 0;
      const pa = g.attributes.position, ia = g.index, cnt = ia ? ia.count : pa.count;
      const inst = o.isInstancedMesh ? o.count : 1;
      if (inst * cnt / 3 > 3e6) { skipped++; continue; }
      const P = new Float32Array(pa.count * 3); for (let i = 0; i < pa.count; i++) { P[i * 3] = pa.getX(i); P[i * 3 + 1] = pa.getY(i); P[i * 3 + 2] = pa.getZ(i); }
      const W = new Float32Array(pa.count * 3);
      for (let k = 0; k < inst; k++) {
        if (o.isInstancedMesh) { o.getMatrixAt(k, M2); M.multiplyMatrices(o.matrixWorld, M2); } else M.copy(o.matrixWorld);
        const e = M.elements;
        for (let i = 0; i < pa.count; i++) { const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2]; W[i * 3] = e[0] * x + e[4] * y + e[8] * z + e[12]; W[i * 3 + 1] = e[1] * x + e[5] * y + e[9] * z + e[13]; W[i * 3 + 2] = e[2] * x + e[6] * y + e[10] * z + e[14]; }
        for (let t = 0; t < cnt; t += 3) {
          const a = ia ? ia.getX(t) : t, b = ia ? ia.getX(t + 1) : t + 1, cc = ia ? ia.getX(t + 2) : t + 2;
          const ax = W[a * 3], ay = W[a * 3 + 1], az = W[a * 3 + 2], bx = W[b * 3], by = W[b * 3 + 1], bz = W[b * 3 + 2], cx = W[cc * 3], cy = W[cc * 3 + 1], cz = W[cc * 3 + 2];
          const ux = bx - ax, uy = by - ay, uz = bz - az, vx = cx - ax, vy = cy - ay, vz = cz - az;
          const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, L = Math.hypot(nx, ny, nz);
          if (L < 1e-9) continue; const nyn = ny / L;
          if (nyn > 0.5 && side !== 1) push(0, 0, ax, ay, az, bx, by, bz, cx, cy, cz);
          else if (nyn < -0.5 && (side === 1 || side === 2)) push(0, 0, ax, ay, az, bx, by, bz, cx, cy, cz);
          else if (nyn < -0.5) push(1, 0, ax, ay, az, bx, by, bz, cx, cy, cz);
        }
        if (nt > 9e6) break;
      }
      if (nt > 9e6) break;
    }
    // bins (cells of 4 amot)
    const CELL = 4, bin = new Map(), large = [];
    const key = (ix, iz) => ix * 100003 + iz;
    const binTris = (arr, n, B, L) => {
      for (let t = 0; t < n; t++) {
        const o = t * 9;
        const mnx = Math.min(arr[o], arr[o + 3], arr[o + 6]), mxx = Math.max(arr[o], arr[o + 3], arr[o + 6]), mnz = Math.min(arr[o + 2], arr[o + 5], arr[o + 8]), mxz = Math.max(arr[o + 2], arr[o + 5], arr[o + 8]);
        const i0 = Math.floor(mnx / CELL), i1 = Math.floor(mxx / CELL), j0 = Math.floor(mnz / CELL), j1 = Math.floor(mxz / CELL);
        if ((i1 - i0 + 1) * (j1 - j0 + 1) > 150) { L.push(t); continue; }
        for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) { const k = key(i, j); let l = B.get(k); if (!l) B.set(k, l = []); l.push(t); }
      }
    };
    binTris(buf, nt, bin, large);
    const cbin = new Map(), clarge = []; binTris(cbuf, nc, cbin, clarge);
    const inTri = (arr, o, x, z) => {
      const ax = arr[o], az = arr[o + 2], bx = arr[o + 3], bz = arr[o + 5], cx = arr[o + 6], cz = arr[o + 8];
      const d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz); if (d > -1e-9 && d < 1e-9) return NaN;
      const l1 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d, l2 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d, l3 = 1 - l1 - l2;
      if (l1 < -1e-4 || l2 < -1e-4 || l3 < -1e-4) return NaN;
      return l1 * arr[o + 1] + l2 * arr[o + 4] + l3 * arr[o + 7];
    };
    const highestBelow = (x, z, ymax) => {
      let best = -1e9; const l = bin.get(key(Math.floor(x / CELL), Math.floor(z / CELL)));
      if (l) for (let i = 0; i < l.length; i++) { const y = inTri(buf, l[i] * 9, x, z); if (y <= ymax && y > best) best = y; }
      for (let i = 0; i < large.length; i++) { const y = inTri(buf, large[i] * 9, x, z); if (y <= ymax && y > best) best = y; }
      return best > -1e8 ? best : NaN;
    };
    const levelsAt = (x, z) => {
      const ys = []; const l = bin.get(key(Math.floor(x / CELL), Math.floor(z / CELL)));
      if (l) for (let i = 0; i < l.length; i++) { const y = inTri(buf, l[i] * 9, x, z); if (y === y) ys.push(y); }
      for (let i = 0; i < large.length; i++) { const y = inTri(buf, large[i] * 9, x, z); if (y === y) ys.push(y); }
      ys.sort((a, b) => b - a); const o = []; for (const y of ys) if (!o.length || o[o.length - 1] - y > 0.12) o.push(y); return o;
    };
    const ceilAbove = (x, z, y) => {
      let best = 1e9; const l = cbin.get(key(Math.floor(x / CELL), Math.floor(z / CELL)));
      const chk = (t) => { const v = inTri(cbuf, t * 9, x, z); if (v === v && v > y + 0.2 && v < best) best = v; };
      if (l) for (let i = 0; i < l.length; i++) chk(l[i]); for (let i = 0; i < clarge.length; i++) chk(clarge[i]);
      return best;
    };
    // grid
    if (cap && (x1 - x0) / G * ((z1 - z0) / G) > cap) G = Math.ceil(Math.sqrt((x1 - x0) * (z1 - z0) / cap) * 2) / 2;
    const NX = Math.ceil((x1 - x0) / G) + 1, NZ = Math.ceil((z1 - z0) / G) + 1;
    const colOff = new Int32Array(NX * NZ + 1); const ly = []; 
    for (let ix = 0; ix < NX; ix++) for (let iz = 0; iz < NZ; iz++) { const ci = ix * NZ + iz; colOff[ci] = ly.length; const ys = levelsAt(x0 + ix * G, z0 + iz * G); for (const y of ys) ly.push(y); }
    colOff[NX * NZ] = ly.length;
    const N = ly.length, LY = Float32Array.from(ly);
    const colOf = new Int32Array(N); for (let ci = 0; ci < NX * NZ; ci++) for (let k = colOff[ci]; k < colOff[ci + 1]; k++) colOf[k] = ci;
    const DX = [1, -1, 0, 0], DZ = [0, 0, 1, -1];
    const edge = new Int32Array(N * 4).fill(-1);
    const jumps = [];   // steps of the micro-walk: a rise over 0.7 or a drop over 1.5 in a third of an amah
    const blocked = []; // a level 1.2 .. 2.2 higher in the neighbouring column that the walk does not reach
    for (let i = 0; i < N; i++) {
      const ci = colOf[i], ix = (ci / NZ) | 0, iz = ci - ix * NZ, y = LY[i], px = x0 + ix * G, pz = z0 + iz * G;
      for (let d = 0; d < 4; d++) {
        const jx = ix + DX[d], jz = iz + DZ[d]; if (jx < 0 || jz < 0 || jx >= NX || jz >= NZ) continue;
        const n = Math.max(1, Math.ceil(G / STEP)); let yc = y, ok = true;
        for (let s = 1; s <= n; s++) {
          const x = px + DX[d] * G * s / n, z = pz + DZ[d] * G * s / n, yh = highestBelow(x, z, yc + UP);
          if (yh !== yh) { ok = false; break; }
          const dy = yh - yc; if ((dy > 0.7 || dy < -1.5) && jumps.length < 20000) jumps.push([x, yc, z, dy]);
          yc = yh;
        }
        if (!ok) continue;
        const cj = jx * NZ + jz; let best = -1, bd = 0.4;
        for (let k = colOff[cj]; k < colOff[cj + 1]; k++) { const dd = Math.abs(LY[k] - yc); if (dd < bd) { bd = dd; best = k; } }
        edge[i * 4 + d] = best;
      }
    }
    const t1 = Date.now();
    // search
    const bfs = (starts, rev) => {
      const seen = new Uint8Array(N), q = new Int32Array(N); let h = 0, t = 0;
      let radj = null;
      if (rev) { const cnt = new Int32Array(N + 1); for (let i = 0; i < N * 4; i++) { const e = edge[i]; if (e >= 0) cnt[e + 1]++; } for (let i = 0; i < N; i++) cnt[i + 1] += cnt[i]; const pos = cnt.slice(0, N), arr = new Int32Array(cnt[N]); for (let i = 0; i < N * 4; i++) { const e = edge[i]; if (e >= 0) arr[pos[e]++] = (i / 4) | 0; } radj = { cnt, arr }; }
      for (const s of starts) if (s >= 0 && !seen[s]) { seen[s] = 1; q[t++] = s; }
      while (h < t) { const u = q[h++]; if (rev) { for (let k = radj.cnt[u]; k < radj.cnt[u + 1]; k++) { const v = radj.arr[k]; if (!seen[v]) { seen[v] = 1; q[t++] = v; } } } else for (let d = 0; d < 4; d++) { const v = edge[u * 4 + d]; if (v >= 0 && !seen[v]) { seen[v] = 1; q[t++] = v; } } }
      return { seen, n: t };
    };
    const nodeAt = (x, z, y, tol) => {   // the level nearest under/near y at the column nearest to (x, z)
      const ix = Math.round((x - x0) / G), iz = Math.round((z - z0) / G); let best = -1, bd = tol == null ? 1e9 : tol;
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const jx = ix + a, jz = iz + b; if (jx < 0 || jz < 0 || jx >= NX || jz >= NZ) continue; const cj = jx * NZ + jz; for (let k = colOff[cj]; k < colOff[cj + 1]; k++) { const dd = Math.abs(LY[k] - y) + 0.5 * (Math.abs(a) + Math.abs(b)) * G; if (dd < bd) { bd = dd; best = k; } } }
      return best;
    };
    const posOf = (i) => { const ci = colOf[i], ix = (ci / NZ) | 0, iz = ci - ix * NZ; return [x0 + ix * G, LY[i], z0 + iz * G]; };
    // the ground the walker starts from: the floor under each place's camera (as ent_walkModeSet does) - and the biggest of the candidate starts is "the main walk"
    const places = c.ui.places().map((p) => { let f = null; try { f = p.fp ? c.ui.resolveFp(p.fp) : null; } catch (_) {} return { title: p.title, group: p.group, pos: f && f.pos, tg: f && f.target }; }).filter((p) => p.pos);
    const floorNode = (pos) => { const y = highestBelow(pos[0], pos[2], pos[1] + 0.3); return y === y ? nodeAt(pos[0], pos[2], y, 1.5) : -1; };
    const cands = places.map((p) => floorNode(p.pos));
    let mainSeen = null, mainRev = null, mainStart = -1, best = -1;
    const tried = new Set();
    for (const cn of cands) { if (cn < 0 || tried.has(cn)) continue; tried.add(cn); if (tried.size > 8) break; const r = bfs([cn], false); if (r.n > best) { best = r.n; mainStart = cn; mainSeen = r.seen; } }
    const R = { G, N, tris: nt, ctris: nc, skipped, region: [x0, x1, z0, z1], tBuild: (t1 - t0) / 1000, tAll: 0, main: best, mainStart: mainStart >= 0 ? posOf(mainStart) : null };
    mainRev = mainStart >= 0 ? bfs([mainStart], true).seen : new Uint8Array(N);
    let reachN = 0, backN = 0; for (let i = 0; i < N; i++) { if (mainSeen && mainSeen[i]) reachN++; if (mainRev[i]) backN++; }
    R.reach = reachN; R.back = backN;
    const nearestPlace = (x, z) => { let b = null, bd = 1e9; for (const p of places) { const d = Math.hypot(p.pos[0] - x, p.pos[2] - z); if (d < bd) { bd = d; b = p; } } return b ? b.title + ' (' + Math.round(bd) + ' אמות)' : ''; };
    // places: reachable from the main walk? can one come back?
    R.places = places.map((p) => { const nd = floorNode(p.pos); return { title: p.title, group: p.group, pos: p.pos.map((v) => Math.round(v * 10) / 10), node: nd >= 0, fwd: nd >= 0 && !!(mainSeen && mainSeen[nd]), back: nd >= 0 && !!mainRev[nd] }; });
    // unreachable enclosed floors (an interior with a ceiling over it): clusters
    const comp = new Int32Array(N).fill(-1); const clusters = [];
    for (let i = 0; i < N; i++) {
      if (mainSeen && mainSeen[i] || comp[i] >= 0) continue;
      const [x, y, z] = posOf(i); if (ceilAbove(x, z, y) > y + 14) continue;   // open to the sky: a roof / a top, not a room
      const stack = [i]; comp[i] = clusters.length; const members = [];
      while (stack.length) { const u = stack.pop(); members.push(u); for (let d = 0; d < 4; d++) { const v = edge[u * 4 + d]; if (v >= 0 && comp[v] < 0 && !(mainSeen && mainSeen[v])) { comp[v] = clusters.length; stack.push(v); } } for (const dd of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ci = colOf[u], ix = ((ci / NZ) | 0) + dd[0], iz = (ci % NZ) + dd[1]; if (ix < 0 || iz < 0 || ix >= NX || iz >= NZ) continue; const cj = ix * NZ + iz; for (let k = colOff[cj]; k < colOff[cj + 1]; k++) if (comp[k] < 0 && !(mainSeen && mainSeen[k]) && Math.abs(LY[k] - LY[u]) < 0.3) { comp[k] = clusters.length; stack.push(k); } } }
      let sx = 0, sy = 0, sz = 0; for (const u of members) { const p = posOf(u); sx += p[0]; sy += p[1]; sz += p[2]; } const k = members.length;
      clusters.push({ cols: k, area: Math.round(k * G * G), at: [sx / k, sy / k, sz / k].map((v) => Math.round(v * 10) / 10), near: nearestPlace(sx / k, sz / k) });
    }
    R.rooms = clusters.filter((q) => q.cols >= 6).sort((a, b) => b.cols - a.cols).slice(0, 30);
    // blocked rises: from a reached node to a level 1.2 .. 2.2 above in the next column that is not reached
    const bl = new Map();
    for (let i = 0; i < N; i++) {
      if (!(mainSeen && mainSeen[i])) continue;
      const ci = colOf[i], ix = (ci / NZ) | 0, iz = ci - ix * NZ;
      for (let d = 0; d < 4; d++) {
        const jx = ix + DX[d], jz = iz + DZ[d]; if (jx < 0 || jz < 0 || jx >= NX || jz >= NZ) continue; const cj = jx * NZ + jz;
        for (let k = colOff[cj]; k < colOff[cj + 1]; k++) { const rise = LY[k] - LY[i]; if (rise > UP + 0.05 && rise <= 2.3 && !mainSeen[k]) { const [x, y, z] = posOf(i); const kk = Math.round(x / 6) + ',' + Math.round(z / 6); const o = bl.get(kk); if (!o) bl.set(kk, { n: 1, rise, at: [x, y, z] }); else { o.n++; o.rise = Math.max(o.rise, rise); } } }
      }
    }
    R.blocked = [...bl.values()].filter((o) => o.n >= 3).sort((a, b) => b.n - a.n).slice(0, 30).map((o) => ({ n: o.n, rise: Math.round(o.rise * 100) / 100, at: o.at.map((v) => Math.round(v * 10) / 10), near: nearestPlace(o.at[0], o.at[2]) }));
    // jumps: clusters of 6 amot
    const jc = new Map();
    for (const [x, y, z, dy] of jumps) { const kk = Math.round(x / 6) + ',' + Math.round(z / 6); const o = jc.get(kk); if (!o) jc.set(kk, { n: 1, dy, at: [x, y, z] }); else { o.n++; if (Math.abs(dy) > Math.abs(o.dy)) o.dy = dy; } }
    R.jumps = [...jc.values()].sort((a, b) => Math.abs(b.dy) - Math.abs(a.dy)).slice(0, 40).map((o) => ({ n: o.n, dy: Math.round(o.dy * 100) / 100, at: o.at.map((v) => Math.round(v * 10) / 10), near: nearestPlace(o.at[0], o.at[2]) }));
    R.nJumps = jumps.length;
    // explicit pairs: both ways between two places (by a part of the title)
    S._walk = { places, floorNode, bfs, edge, N, posOf };
    R.tAll = (Date.now() - t0) / 1000;
    return R;
  };
  S.walkPair = (a, b) => {
    const W = S._walk; if (!W) return null;
    const fa = W.places.filter((p) => p.title.includes(a)), fb = W.places.filter((p) => p.title.includes(b));
    if (!fa.length || !fb.length) return { missing: !fa.length ? a : b };
    const na = W.floorNode(fa[0].pos), nb = W.floorNode(fb[0].pos);
    if (na < 0 || nb < 0) return { nofloor: na < 0 ? a : b };
    const ra = W.bfs([na], false), rb = W.bfs([nb], false);
    return { a: fa[0].title, b: fb[0].title, ab: !!ra.seen[nb], ba: !!rb.seen[na], pa: fa[0].pos, pb: fb[0].pos };
  };
})();
