  // The mountain is a 220 x 220 height grid. A ray can only hit the cells crossed
  // by its X/Z projection, not all 96,800 triangles. Keep Three.js's exact
  // triangle/UV/normal/side/near/far code; narrow only the index ranges it visits.
  // Small local deformations (the First Temple's Rashi room-width reading) keep a
  // conservative list of moved cells. Other topology/materials use the full path.
  function tm_terrainRaycast(mesh, nx, nz) {
    const original = mesh._computeIntersections, width = nx + 1;
    let cached = null;
    const version = (a) => a && (a.isInterleavedBufferAttribute ? a.data.version : a.version);
    const grid = (g) => {
      const p = g.attributes.position, index = g.index, pv = version(p), iv = version(index);
      if (cached && cached.geometry === g && cached.position === p && cached.index === index && cached.pv === pv && cached.iv === iv) return cached.grid;
      const state = cached = { geometry: g, position: p, index, pv, iv, grid: null };
      if (!p || !index || p.count !== width * (nz + 1) || index.count % 6 ||
          (g.morphAttributes.position && g.morphAttributes.position.length)) return null;
      const xs = new Float64Array(width), zs = new Float64Array(nz + 1);
      for (let x = 0; x <= nx; x++) { xs[x] = p.getX(x); if (!Number.isFinite(xs[x]) || (x && xs[x] <= xs[x - 1])) return null; }
      for (let z = 0; z <= nz; z++) { zs[z] = p.getZ(z * width); if (!Number.isFinite(zs[z]) || (z && zs[z] <= zs[z - 1])) return null; }
      let moved = null, minY = Infinity, maxY = -Infinity;
      for (let z = 0; z <= nz; z++) for (let x = 0; x <= nx; x++) {
        const i = z * width + x;
        const px = p.getX(i), py = p.getY(i), pz = p.getZ(i);
        if (!Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(pz)) return null;
        minY = Math.min(minY, py); maxY = Math.max(maxY, py);
        if (px !== xs[x] || pz !== zs[z]) {
          if (!moved) moved = new Uint8Array(p.count);
          moved[i] = 1;
        }
      }
      const cells = new Int32Array(nx * nz), warped = []; cells.fill(-1);
      for (let i = 0; i < index.count; i += 6) {
        const a = index.getX(i), z = Math.floor(a / width), x = a % width, b = a + width, d = a + 1;
        if (!Number.isInteger(a) || x < 0 || x >= nx || z < 0 || z >= nz || cells[z * nx + x] !== -1 ||
            index.getX(i + 1) !== b || index.getX(i + 2) !== d || index.getX(i + 3) !== b ||
            index.getX(i + 4) !== b + 1 || index.getX(i + 5) !== d) return null;
        cells[z * nx + x] = i;
        if (moved && (moved[a] || moved[b] || moved[b + 1] || moved[d])) {
          // A broad deformation should use the original path, not turn each ray
          // into a linear scan of tens of thousands of cached cell boxes.
          if (warped.length >= 256) return null;
          let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
          for (const v of [a, b, b + 1, d]) {
            const px = p.getX(v), pz = p.getZ(v);
            minX = Math.min(minX, px); maxX = Math.max(maxX, px);
            minZ = Math.min(minZ, pz); maxZ = Math.max(maxZ, pz);
          }
          warped.push({ start: i, minX, maxX, minZ, maxZ });
        }
      }
      return (state.grid = { xs, zs, cells, warped, minY, maxY });
    };
    // Actual Float32 vertex coordinates, rather than an ideal cell width, preserve
    // boundary hits after translation. Adjacent cells also cover exact shared edges.
    const cellAt = (a, value) => {
      let lo = 0, hi = a.length - 1;
      while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (a[mid] <= value) lo = mid; else hi = mid - 1; }
      return Math.min(lo, a.length - 2);
    };
    // Intersect a ray-parameter interval with one coordinate slab. Do not use
    // raycaster near/far here: those are world distances, while this ray is local
    // (and may have passed through a nonuniform/negative mesh transform).
    const clip = (origin, direction, low, high, span) => {
      if (direction === 0) return origin >= low && origin <= high;
      let a = (low - origin) / direction, b = (high - origin) / direction;
      if (a > b) { const t = a; a = b; b = t; }
      span.lo = Math.max(span.lo, a); span.hi = Math.min(span.hi, b);
      return span.lo <= span.hi;
    };
    mesh._computeIntersections = function (raycaster, hits, ray) {
      const g = this.geometry, range = g.drawRange;
      if (this.isSkinnedMesh ||
          this.getVertexPosition !== Mesh.prototype.getVertexPosition || Array.isArray(this.material) ||
          (g.morphAttributes.position && g.morphAttributes.position.length) ||
          range.start % 3 || !Number.isFinite(ray.origin.x + ray.origin.y + ray.origin.z +
            ray.direction.x + ray.direction.y + ray.direction.z)) return original.call(this, raycaster, hits, ray);
      const data = grid(g);
      if (!data) return original.call(this, raycaster, hits, ray);
      const starts = [], O = ray.origin, D = ray.direction;
      if (D.x === 0 && D.z === 0) {
        const x = cellAt(data.xs, O.x), z = cellAt(data.zs, O.z);
        for (let j = Math.max(0, z - 1); j <= Math.min(nz - 1, z + 1); j++) {
          for (let i = Math.max(0, x - 1); i <= Math.min(nx - 1, x + 1); i++) {
            const start = data.cells[j * nx + i]; if (start >= 0) starts.push(start);
          }
        }
        for (const cell of data.warped) {
          if (O.x >= cell.minX - 1e-7 && O.x <= cell.maxX + 1e-7 &&
              O.z >= cell.minZ - 1e-7 && O.z <= cell.maxZ + 1e-7) starts.push(cell.start);
        }
      } else {
        // Sweep grid rows crossed by the projected ray, then visit only the X
        // interval crossed inside each row. The height slab shortens steep rays;
        // horizontal rays still inspect only a narrow strip across the grid.
        // Padding and adjacent columns conservatively include shared edges and
        // cancellation when the ray starts far outside the model.
        const pad = 1e-7 + 16 * Number.EPSILON * Math.max(Math.abs(O.x), Math.abs(O.y), Math.abs(O.z),
          Math.abs(data.xs[0]), Math.abs(data.xs[nx]), Math.abs(data.zs[0]), Math.abs(data.zs[nz]),
          Math.abs(data.minY), Math.abs(data.maxY));
        const height = { lo: 0, hi: Infinity }, box = { lo: 0, hi: Infinity }, row = { lo: 0, hi: Infinity };
        if (!clip(O.y, D.y, data.minY - pad, data.maxY + pad, height)) return;
        box.lo = height.lo; box.hi = height.hi;
        if (clip(O.x, D.x, data.xs[0] - pad, data.xs[nx] + pad, box) &&
            clip(O.z, D.z, data.zs[0] - pad, data.zs[nz] + pad, box)) {
          if (!Number.isFinite(box.lo + box.hi)) return original.call(this, raycaster, hits, ray);
          for (let j = 0; j < nz; j++) {
            row.lo = box.lo; row.hi = box.hi;
            if (!clip(O.z, D.z, data.zs[j] - pad, data.zs[j + 1] + pad, row)) continue;
            const a = O.x + D.x * row.lo, b = O.x + D.x * row.hi;
            if (!Number.isFinite(a + b)) return original.call(this, raycaster, hits, ray);
            const first = Math.max(0, cellAt(data.xs, Math.min(a, b) - pad) - 1);
            const last = Math.min(nx - 1, cellAt(data.xs, Math.max(a, b) + pad) + 1);
            for (let i = first; i <= last; i++) {
              const start = data.cells[j * nx + i]; if (start >= 0) starts.push(start);
            }
          }
        }
        // A moved vertex may extend a triangle far outside its nominal row/cell
        // or even outside the grid. Its projected box must be tested separately.
        for (const cell of data.warped) {
          row.lo = height.lo; row.hi = height.hi;
          if (clip(O.x, D.x, cell.minX - pad, cell.maxX + pad, row) &&
              clip(O.z, D.z, cell.minZ - pad, cell.maxZ + pad, row)) starts.push(cell.start);
        }
      }
      starts.sort((a, b) => a - b); // preserve the original face order for equal-distance hits
      const start = range.start, count = range.count, end = start + count;
      let previous = -1;
      try {
        for (const cell of starts) {
          if (cell === previous) continue;
          previous = cell;
          range.start = Math.max(0, start, cell);
          range.count = Math.max(0, Math.min(end, cell + 6) - range.start);
          if (range.count) original.call(this, raycaster, hits, ray);
        }
      } finally { range.start = start; range.count = count; }
    };
    return mesh;
  }
