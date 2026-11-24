// Exact terrain-ray regression tests with the vendored Three.js.
// node tools/perf-terrain-test.mjs [--helper /path/to/terrain-raycast.js]
// --helper permits independent review of a worktree before its source commit is integrated.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';

const root = new URL('../', import.meta.url), arg = process.argv.indexOf('--helper');
const lib = fs.readFileSync(new URL('shared/00-lib.js', root), 'utf8');
const helper = fs.readFileSync(arg < 0 ? new URL('shared/frag/terrain-raycast.js', root) : process.argv[arg + 1], 'utf8');
const T = new Function('window', lib + `
  const gridAllocations = [];
  const attach = ((Int32Array, Float64Array) => {
    ${helper}
    return tm_terrainRaycast;
  })(class extends Int32Array { constructor(...args) { super(...args); gridAllocations.push({ kind: 'cells', bytes: this.byteLength }); } },
     class extends Float64Array { constructor(...args) { super(...args); gridAllocations.push({ kind: 'axis', bytes: this.byteLength }); } });
  return { ...three_module_exports, attach, gridAllocations };
})(); return OtzariaPlugin;`)({ performance });
const original = T.Mesh.prototype._computeIntersections;
let groups = 0, queries = 0;
const check = (name, fn) => { fn(); groups++; console.log('PASS ' + name); };
const material = () => new T.MeshBasicMaterial({ side: T.DoubleSide });
const make = (nx = 8, nz = 11, width = 96, depth = 111) => {
  const geometry = new T.PlaneGeometry(width, depth, nx, nz).rotateX(-Math.PI / 2), p = geometry.attributes.position;
  // As in the real terrain: coordinates are translated in the Float32 vertex buffer, and heights are baked into that buffer.
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) + 317.123, z = p.getZ(i) - 23.75;
    p.setXYZ(i, x, 2 * Math.sin(x * 0.017) + 3 * Math.cos(z * 0.023), z);
  }
  geometry.computeVertexNormals();
  const uv1 = geometry.attributes.uv.clone();
  for (let i = 0; i < uv1.count; i++) uv1.setXY(i, uv1.getX(i) * 3 + 0.1, uv1.getY(i) * 2 - 0.3);
  geometry.setAttribute('uv1', uv1);
  const mesh = new T.Mesh(geometry, material()); mesh.updateMatrixWorld(true); T.attach(mesh, nx, nz);
  return mesh;
};
const ray = (x, z, up = false, near = 0, far = 2000) => new T.Raycaster(new T.Vector3(x, up ? -1000 : 1000, z), new T.Vector3(0, up ? 1 : -1, 0), near, far);
const fullHit = (h) => ({ ...h, object: h.object.id, point: h.point.toArray(), uv: h.uv?.toArray(), uv1: h.uv1?.toArray(),
  normal: h.normal?.toArray(), barycoord: h.barycoord?.toArray(), face: h.face && { ...h.face, normal: h.face.normal.toArray() } });
function compare(mesh, r) {
  const accelerated = mesh._computeIntersections, range = { ...mesh.geometry.drawRange };
  let expected;
  try { mesh._computeIntersections = original; expected = r.intersectObject(mesh, false); }
  finally { mesh._computeIntersections = accelerated; }
  const actual = r.intersectObject(mesh, false);
  assert.deepEqual(actual.map(fullHit), expected.map(fullHit), 'all hits, their metadata and equal-distance ordering must match');
  assert.deepEqual(mesh.geometry.drawRange, range, 'restore the shared geometry draw range after each query');
  queries++;
  return actual;
}
const bounds = (m) => { const p = m.geometry.attributes.position; return [p.getX(0), p.getX(p.count - 1), p.getZ(0), p.getZ(p.count - 1)]; };
const refresh = (m) => { m.geometry.computeVertexNormals(); m.geometry.computeBoundingBox(); m.geometry.computeBoundingSphere(); };
const coordinate = (m, nx, x, z) => { const p = m.geometry.attributes.position, i = z * (nx + 1) + x; return [p.getX(i), p.getZ(i)]; };
// Sample the actual displaced triangles, rather than just the original grid cells:
// a vertex can move many cells away and create additional overlapping floor hits.
const warpedSamples = (m, moved) => {
  const p = m.geometry.attributes.position, index = m.geometry.index, samples = [];
  for (let i = 0; i < index.count; i += 3) {
    const ids = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
    if (!ids.some((v) => moved.has(v))) continue;
    for (const weights of [[1 / 3, 1 / 3, 1 / 3], [0.8, 0.1, 0.1], [0.1, 0.8, 0.1], [0.1, 0.1, 0.8],
      [1, 0, 0], [0, 1, 0], [0, 0, 1], [0.5, 0.5, 0], [0, 0.5, 0.5], [0.5, 0, 0.5]]) {
      samples.push({ x: ids.reduce((s, v, j) => s + p.getX(v) * weights[j], 0),
        z: ids.reduce((s, v, j) => s + p.getZ(v) * weights[j], 0), face: i / 3, interior: weights.every((w) => w > 0) });
    }
  }
  return samples;
};

check('512 random vertical rays against the real 220 × 220 grid, with complete hit metadata', () => {
  const m = make(220, 220, 5200, 5200), [x0, x1, z0, z1] = bounds(m);
  let seed = 1207324;
  const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 | 0) >>> 0) / 4294967296;
  for (let i = 0; i < 512; i++) {
    const x = x0 + random() * (x1 - x0), z = z0 + random() * (z1 - z0);
    assert.ok(compare(m, ray(x, z, i % 3 === 0)).length);
  }
});

check('exact vertices, shared edges, diagonals, epsilon offsets and outer boundaries', () => {
  const nx = 7, nz = 9, m = make(nx, nz), [x0, x1, z0, z1] = bounds(m);
  for (let z = 0; z <= nz; z++) for (let x = 0; x <= nx; x++) {
    const [px, pz] = coordinate(m, nx, x, z);
    for (const [dx, dz] of [[0, 0], [1e-7, 0], [-1e-7, 0], [0, 1e-7], [0, -1e-7]]) compare(m, ray(px + dx, pz + dz));
    if (x < nx && z < nz) {
      const [qx, qz] = coordinate(m, nx, x + 1, z + 1);
      compare(m, ray((px + qx) / 2, pz));
      compare(m, ray(px, (pz + qz) / 2));
      compare(m, ray((px + qx) / 2, (pz + qz) / 2));
    }
  }
  for (const [x, z] of [[x0 - 1, z0], [x1 + 1, z1], [x0, z0 - 1], [x1, z1 + 1], [x0 - 200, z1 + 200]]) compare(m, ray(x, z));
});

check('removed cells, reordered cell blocks and index replacement/version changes', () => {
  const nx = 8, nz = 8, m = make(nx, nz), g = m.geometry, old = [...g.index.array];
  const sample = () => {
    for (let z = 0; z < nz; z++) for (let x = 0; x < nx; x++) {
      const [a, b] = coordinate(m, nx, x, z), [c, d] = coordinate(m, nx, x + 1, z + 1);
      compare(m, ray((a + c) / 2, (b + d) / 2));
    }
  };
  sample();
  const blocks = Array.from({ length: nx * nz }, (_, i) => old.slice(i * 6, i * 6 + 6));
  g.setIndex(blocks.filter((_, i) => i % 4 !== 0).reverse().flat()); sample();
  g.setIndex(old); sample();
  const swap = g.index.array.slice(0, 6); g.index.array.copyWithin(0, 6, 12); g.index.array.set(swap, 6); g.index.needsUpdate = true; sample();
  g.setIndex([]); sample();
});

check('height mutation, replaced/interleaved attributes and horizontal-grid changes', () => {
  const nx = 6, nz = 6, m = make(nx, nz), g = m.geometry, p = g.attributes.position;
  const [x, z] = coordinate(m, nx, 2, 3); compare(m, ray(x, z));
  for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) + 17 + Math.sin(i));
  p.needsUpdate = true; refresh(m); compare(m, ray(x, z));
  g.setAttribute('position', p.clone()); refresh(m); compare(m, ray(x, z));
  const data = new T.InterleavedBuffer(new Float32Array(p.count * 4), 4), interleaved = new T.InterleavedBufferAttribute(data, 3, 0);
  for (let i = 0; i < p.count; i++) interleaved.setXYZ(i, p.getX(i), p.getY(i), p.getZ(i));
  g.setAttribute('position', interleaved); refresh(m); compare(m, ray(x, z));
  for (let i = 0; i < p.count; i++) interleaved.setY(i, interleaved.getY(i) - 5);
  data.needsUpdate = true; refresh(m); compare(m, ray(x, z));
  for (let i = 0; i < p.count; i++) interleaved.setX(i, interleaved.getX(i) + 12);
  data.needsUpdate = true; refresh(m); compare(m, ray(x + 12, z));
  interleaved.setX(2 * (nx + 1) + 2, x + 0.3); data.needsUpdate = true; refresh(m);
  compare(m, ray(x, z));
});

check('sparse horizontal warps preserve distant, overlapping and out-of-grid triangle hits after cache mutations', () => {
  const nx = 32, nz = 24, m = make(nx, nz, 320, 240), g = m.geometry, p = g.attributes.position;
  const first = 4 * (nx + 1) + 3, second = 14 * (nx + 1) + 9, moved = new Set([first, second]);
  const [x0, x1, z0, z1] = bounds(m), originalPositions = p.array.slice();
  compare(m, ray(...coordinate(m, nx, 3, 4))); // warm the regular-grid cache before the position version changes
  const sample = () => {
    for (const s of warpedSamples(m, moved)) {
      const hits = compare(m, ray(s.x, s.z));
      if (s.interior) assert.ok(hits.some((h) => h.faceIndex === s.face), 'the ray must reach the displaced triangle, not just the grid beneath it');
      compare(m, ray(s.x, s.z, true));
    }
    for (const v of moved) for (const [dx, dz] of [[1e-7, 0], [-1e-7, 0], [0, 1e-7], [0, -1e-7]]) {
      compare(m, ray(p.getX(v) + dx, p.getZ(v) + dz));
    }
  };
  // One vertex folds across most of the lattice; another extends beyond both original axes.
  p.setXYZ(first, x1 - 18, p.getY(first) + 31, z1 - 23);
  p.setXYZ(second, x1 + 110, p.getY(second) + 17, z0 - 80);
  p.needsUpdate = true; refresh(m); sample();
  // Reuse the same BufferAttribute and mutate its version after the warped map was already cached.
  p.setXYZ(first, x0 - 70, p.getY(first) - 9, z1 + 95);
  p.setXYZ(second, x0 + 65, p.getY(second) + 13, z1 - 35);
  p.needsUpdate = true; refresh(m); sample();
  p.array.set(originalPositions); p.needsUpdate = true; refresh(m); sample();
});

check('warped cells preserve holes, reordered indices, material sides and the original draw range', () => {
  const nx = 18, nz = 16, m = make(nx, nz, 180, 160), g = m.geometry, p = g.attributes.position;
  const a = 5 * (nx + 1) + 4, b = a + 1, moved = new Set([a, b]);
  const [x0, x1, z0, z1] = bounds(m), oldIndex = [...g.index.array];
  p.setXYZ(a, x1 + 35, p.getY(a) + 20, z1 - 25);
  p.setXYZ(b, x0 + 25, p.getY(b) - 10, z0 - 30);
  p.needsUpdate = true; refresh(m);
  const sample = () => { for (const s of warpedSamples(m, moved)) compare(m, ray(s.x, s.z)); };
  sample();
  const blocks = Array.from({ length: nx * nz }, (_, i) => oldIndex.slice(i * 6, i * 6 + 6));
  // Remove some of the deformed cells as well as unrelated cells, then reverse their index-block order.
  g.setIndex(blocks.filter((_, i) => i % 5 !== 0).reverse().flat()); sample();
  const swap = g.index.array.slice(0, 6);
  g.index.array.copyWithin(0, g.index.count - 6); g.index.array.set(swap, g.index.count - 6);
  g.index.needsUpdate = true; sample();
  const samples = warpedSamples(m, moved), selected = samples.find((s) => s.interior);
  assert.ok(selected, 'the hole pattern must retain displaced triangles');
  for (const side of [T.FrontSide, T.BackSide, T.DoubleSide]) {
    m.material.side = side;
    for (const s of samples.filter((s) => s.interior)) for (const up of [false, true]) compare(m, ray(s.x, s.z, up));
  }
  for (const [start, count] of [[0, 0], [selected.face * 3, 3], [selected.face * 3, 4], [selected.face * 3 + 3, 13],
    [0, Infinity], [3, g.index.count - 9], [1, 23], [-3, g.index.count]]) {
    g.setDrawRange(start, count);
    for (const s of samples) compare(m, ray(s.x, s.z));
  }
  g.setDrawRange(0, Infinity); g.setIndex(oldIndex); sample();
});

check('widespread horizontal deformation keeps the exact full-triangle fallback', () => {
  const nx = 20, nz = 20, m = make(nx, nz, 200, 200), p = m.geometry.attributes.position;
  compare(m, ray(...coordinate(m, nx, 10, 10)));
  for (let z = 1; z < nz; z++) for (let x = 1; x < nx; x++) {
    const i = z * (nx + 1) + x;
    p.setX(i, p.getX(i) + (x % 2 ? 15 : -15)); p.setZ(i, p.getZ(i) + (z % 2 ? -12 : 12));
  }
  p.needsUpdate = true; refresh(m);
  for (let z = 2; z < nz; z += 3) for (let x = 2; x < nx; x += 3) compare(m, ray(...coordinate(m, nx, x, z)));
});

check('parent translation/rotation/nonuniform and negative scale; angled-ray fallback', () => {
  const m = make(), parent = new T.Group(); parent.add(m);
  parent.position.set(50, 20, -30); parent.scale.set(-2, 3, 0.7); parent.rotation.y = 0.3; parent.updateMatrixWorld(true);
  const local = new T.Vector3(317.123, 0, -23.75), world = local.clone().applyMatrix4(m.matrixWorld);
  assert.ok(compare(m, ray(world.x, world.z)).length);
  parent.rotation.x = 0.2; parent.rotation.z = -0.1; parent.updateMatrixWorld(true);
  world.copy(local).applyMatrix4(m.matrixWorld);
  assert.ok(compare(m, ray(world.x, world.z)).length, 'a world vertical ray can require the local angled fallback');
  const origin = world.clone().add(new T.Vector3(10, 100, 20)), direction = world.clone().sub(origin).normalize();
  assert.ok(compare(m, new T.Raycaster(origin, direction, 0, 500)).length);
});

check('material sides, groups/material arrays, near/far and partial draw ranges', () => {
  const nx = 8, nz = 8, m = make(nx, nz), g = m.geometry, [x, z] = coordinate(m, nx, 4, 4);
  for (const side of [T.FrontSide, T.BackSide, T.DoubleSide]) {
    m.material.side = side;
    for (const up of [false, true]) for (const [near, far] of [[0, 2000], [995, 1005], [1005, 1010], [0, 998]]) compare(m, ray(x, z, up, near, far));
  }
  for (const [start, count] of [[0, 0], [0, 1], [0, 4], [3, 125], [9, 270], [0, Infinity], [1, 23], [-3, 121]]) {
    g.setDrawRange(start, count); compare(m, ray(x, z));
  }
  g.setDrawRange(3, 245); g.clearGroups(); g.addGroup(0, 129, 0); g.addGroup(129, g.index.count - 129, 1);
  m.material = [new T.MeshBasicMaterial({ side: T.FrontSide }), new T.MeshBasicMaterial({ side: T.DoubleSide })];
  compare(m, ray(x, z)); compare(m, ray(x, z, true));
});

check('morphs, nonindexed topology, incompatible index layout and replacement geometry fall back', () => {
  const m = make(6, 6), [x, z] = coordinate(m, 6, 3, 3); compare(m, ray(x, z));
  const target = m.geometry.attributes.position.clone();
  for (let i = 0; i < target.count; i++) { target.setX(i, target.getX(i) + 50); target.setY(i, target.getY(i) + 12); }
  m.geometry.morphAttributes.position = [target]; m.updateMorphTargets(); m.morphTargetInfluences[0] = 0.75;
  refresh(m); compare(m, ray(x + 37.5, z));
  m.geometry = make(6, 6).geometry.toNonIndexed(); refresh(m); compare(m, ray(x, z));
  m.geometry = make(6, 6).geometry;
  const index = m.geometry.index; [index.array[1], index.array[2]] = [index.array[2], index.array[1]]; index.needsUpdate = true;
  compare(m, ray(x, z));
  m.geometry = new T.BoxGeometry(30, 20, 25).translate(x, 0, z); refresh(m); compare(m, ray(x, z));
});

check('draw range is restored if the exact triangle routine throws', () => {
  const m = make(4, 4), [x, z] = coordinate(m, 4, 2, 2), get = T.Mesh.prototype.getVertexPosition;
  m.geometry.setDrawRange(3, 84); const before = { ...m.geometry.drawRange };
  let during;
  T.Mesh.prototype.getVertexPosition = () => { during = { ...m.geometry.drawRange }; throw new Error('simulated triangle failure'); };
  try { assert.throws(() => ray(x, z).intersectObject(m, false), /simulated triangle failure/); }
  finally { T.Mesh.prototype.getVertexPosition = get; }
  assert.notDeepEqual(during, before, 'the exception must occur inside the narrowed-range path');
  assert.deepEqual(m.geometry.drawRange, before);
  compare(m, ray(x, z));
});

check('custom vertex deformation and skinned-mesh markers bypass the cached grid', () => {
  const m = make(6, 6), [x, z] = coordinate(m, 6, 3, 3), get = m.getVertexPosition;
  compare(m, ray(x, z));
  m.getVertexPosition = function (i, out) { get.call(this, i, out); out.x += 80; return out; };
  m.geometry.boundingSphere.radius += 100;
  assert.ok(compare(m, ray(x + 80, z)).length);
  delete m.getVertexPosition; m.isSkinnedMesh = true;
  assert.ok(compare(m, ray(x, z)).length);
});

check('220-grid warm queries visit at most 18 triangles and allocate one 193,600-byte cell map', () => {
  const m = make(220, 220, 5200, 5200), accelerated = m._computeIntersections, [x, z] = coordinate(m, 220, 110, 110);
  let vertices = 0; const get = T.Mesh.prototype.getVertexPosition;
  T.Mesh.prototype.getVertexPosition = function (i, v) { vertices++; return get.call(this, i, v); };
  try {
  const r = ray(x + 3, z + 2), allocationStart = T.gridAllocations.length;
  r.intersectObject(m, false); // build the validated map once
  const allocated = T.gridAllocations.slice(allocationStart);
  assert.equal(allocated.filter((a) => a.kind === 'cells').reduce((n, a) => n + a.bytes, 0), 193600);
  assert.equal(allocated.filter((a) => a.kind === 'axis').reduce((n, a) => n + a.bytes, 0), 3536);
  vertices = 0; m._computeIntersections = original; const start = performance.now();
  const expected = r.intersectObject(m, false), baselineMs = performance.now() - start, baselineVertices = vertices;
  vertices = 0; m._computeIntersections = accelerated; const next = performance.now();
  const actual = r.intersectObject(m, false), optimizedMs = performance.now() - next, optimizedVertices = vertices;
  assert.deepEqual(actual.map(fullHit), expected.map(fullHit));
  assert.equal(baselineVertices, 96800 * 3); assert.ok(optimizedVertices > 0 && optimizedVertices <= 18 * 3);
  assert.equal(T.gridAllocations.length, allocationStart + allocated.length, 'warm queries must reuse the cell map');
  console.log(JSON.stringify({ workload: 'one warm vertical ray on a 220 × 220 height grid', baselineTriangles: baselineVertices / 3,
    optimizedTriangles: optimizedVertices / 3, cellMapBytes: 193600, axisBytes: 3536, baselineMs, optimizedMs }, null, 2));
  } finally { T.Mesh.prototype.getVertexPosition = get; }
});

check('eight locally shifted vertices retain a bounded fast path on the real 220 × 220 grid', () => {
  const nx = 220, m = make(nx, nx, 5200, 5200), p = m.geometry.attributes.position, moved = new Set();
  compare(m, ray(...coordinate(m, nx, 102, 106)));
  for (let z = 105; z <= 108; z++) for (let x = 102; x <= 103; x++) {
    const i = z * (nx + 1) + x; moved.add(i); p.setX(i, p.getX(i) + 11);
  }
  p.needsUpdate = true; refresh(m);
  const s = warpedSamples(m, moved).find((s) => s.interior), r = ray(s.x, s.z), expected = compare(m, r);
  let vertices = 0; const get = T.Mesh.prototype.getVertexPosition;
  T.Mesh.prototype.getVertexPosition = function (i, v) { vertices++; return get.call(this, i, v); };
  try {
    assert.deepEqual(r.intersectObject(m, false).map(fullHit), expected.map(fullHit));
    // Eight vertices in two columns/four rows touch 15 cells; at most nine other nominal cells are visited.
    assert.ok(vertices > 0 && vertices <= (15 + 9) * 6, `sparse changes must not fall back to all 96,800 triangles (${vertices / 3} visited)`);
    console.log(JSON.stringify({ workload: 'one warm 220-grid ray after eight vertices shift horizontally', optimizedTriangles: vertices / 3 }));
  } finally { T.Mesh.prototype.getVertexPosition = get; }
});
console.log(`${groups} terrain regression groups passed; ${queries} full-hit comparisons (Three.js r${T.REVISION}).`);
