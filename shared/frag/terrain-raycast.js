  // The mountain is a 220 x 220 height grid. A vertical floor ray can only hit its
  // own cell (and shared edges), not all 96,800 triangles. Keep Three.js's exact
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
      let moved = null;
      for (let z = 0; z <= nz; z++) for (let x = 0; x <= nx; x++) {
        const i = z * width + x;
        const px = p.getX(i), py = p.getY(i), pz = p.getZ(i);
        if (!Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(pz)) return null;
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
      return (state.grid = { xs, zs, cells, warped });
    };
    // Actual Float32 vertex coordinates, rather than an ideal cell width, preserve
    // boundary hits after translation. Adjacent cells also cover exact shared edges.
    const cellAt = (a, value) => {
      let lo = 0, hi = a.length - 1;
      while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (a[mid] <= value) lo = mid; else hi = mid - 1; }
      return Math.min(lo, a.length - 2);
    };
    mesh._computeIntersections = function (raycaster, hits, ray) {
      const g = this.geometry, range = g.drawRange;
      if (ray.direction.x !== 0 || ray.direction.z !== 0 || this.isSkinnedMesh ||
          this.getVertexPosition !== Mesh.prototype.getVertexPosition || Array.isArray(this.material) ||
          (g.morphAttributes.position && g.morphAttributes.position.length) ||
          range.start % 3 || !Number.isFinite(ray.origin.x + ray.origin.z)) return original.call(this, raycaster, hits, ray);
      const data = grid(g);
      if (!data) return original.call(this, raycaster, hits, ray);
      const x = cellAt(data.xs, ray.origin.x), z = cellAt(data.zs, ray.origin.z), starts = [];
      for (let j = Math.max(0, z - 1); j <= Math.min(nz - 1, z + 1); j++) {
        for (let i = Math.max(0, x - 1); i <= Math.min(nx - 1, x + 1); i++) {
          const start = data.cells[j * nx + i]; if (start >= 0) starts.push(start);
        }
      }
      // The nominal cell lookup is not enough when a vertex has moved across a
      // cell boundary. Test every intersected moved-cell box as well, even far
      // from its original cell; the exact triangle routine still decides hits.
      for (const cell of data.warped) {
        if (ray.origin.x >= cell.minX - 1e-7 && ray.origin.x <= cell.maxX + 1e-7 &&
            ray.origin.z >= cell.minZ - 1e-7 && ray.origin.z <= cell.maxZ + 1e-7) starts.push(cell.start);
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
