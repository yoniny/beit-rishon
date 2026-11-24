// Exact picking regression + CPU benchmark on the actual model builders and vendored Three.js.
// node tools/perf-ray-model.mjs [--house rishon|sheni] [--room-only] [--out report.json] [--source-root /path/to/repo]
// Uses perf-geometry.mjs's Canvas/DOM/audio stubs: this measures CPU ray queries, not startup, GPU or FPS.
// The reference is the SAME current scene, with the terrain's _computeIntersections replaced temporarily
// by Three.js's original method. No triangle, material, transform, visibility or scene configuration changes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { buildModel } from './perf-geometry.mjs';
import { houseText } from './house-slots.mjs';

const argv = process.argv.slice(2);
const option = (key, fallback) => { const i = argv.indexOf(key); return i < 0 ? fallback : argv[i + 1]; };
const root = path.resolve(option('--source-root', fileURLToPath(new URL('../', import.meta.url))));
const selected = option('--house');
assert(!selected || ['rishon', 'sheni'].includes(selected), '--house must be rishon or sheni');
const report = {
  note: 'Node CPU ray-query benchmark with actual model geometry; Canvas/DOM/audio stubbed. Not browser FPS or whole-application memory.',
  reference: 'Same scene and queries, with the coarse terrain using Three.js original _computeIntersections.',
  roomReference: 'Same current scene and terrain accelerator; compare the indoor guard before and after prefiltering its tmPass surfaces.',
  environment: { node: process.version, platform: process.platform, arch: process.arch, cpu: os.cpus()[0]?.model },
  workload: { warmQueriesPerBatch: 40, timingBatches: 3, statistic: 'median milliseconds per batch', randomSeed: 729418,
    firstHouseReadings: 'Actual UI default Rashi and restored Rambam, before and after deferred valley refinement.' },
  states: [], rooms: []
};
const encode = (hits) => JSON.stringify(hits.map(h => ({
  object: h.object.id, instance: h.instanceId, face: h.faceIndex, distance: h.distance,
  point: h.point.toArray(), uv: h.uv?.toArray(), normal: h.normal?.toArray()
})));

function terrainDeformation(terrain, original) {
  const p = terrain.mesh.geometry.attributes.position, width = terrain.nx + 1, vertices = [], cells = new Set();
  const extent = () => ({ min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] });
  const beforeBounds = extent(), afterBounds = extent(), delta = extent();
  const include = (bounds, point) => point.forEach((v, i) => { bounds.min[i] = Math.min(bounds.min[i], v); bounds.max[i] = Math.max(bounds.max[i], v); });
  for (let i = 0; i < p.count; i++) {
    const before = Array.from(original.subarray(i * 3, i * 3 + 3)), after = [p.getX(i), p.getY(i), p.getZ(i)];
    if (before.every((v, k) => v === after[k])) continue;
    const column = i % width, row = Math.floor(i / width);
    vertices.push({ vertex: i, column, row, before, after });
    include(beforeBounds, before); include(afterBounds, after); include(delta, after.map((v, k) => v - before[k]));
    for (const z of [row - 1, row]) for (const x of [column - 1, column]) {
      if (x >= 0 && x < terrain.nx && z >= 0 && z < terrain.nz) cells.add(z * terrain.nx + x);
    }
  }
  return { vertices, affectedCells: [...cells].sort((a, b) => a - b),
    beforeBounds: vertices.length ? beforeBounds : null, afterBounds: vertices.length ? afterBounds : null,
    coordinateDelta: vertices.length ? delta : null };
}

function roomBenchmark(ctx, house, entry, querySection) {
  ctx.scene.updateMatrixWorld(true);
  // Execute the real UI selector: this is what marks the walls eligible for the indoor camera guard.
  const ui = houseText(house, '70-ui.js', root);
  const begin = ui.indexOf('        const HIDE_GROUPS ='), end = ui.indexOf('        const hideShown =');
  assert(begin >= 0 && end > begin, 'UI room-surface selector not found');
  const walls = new Function('ctx', 'performance', 'const {Box3,Vector3}=ctx.THREE;const OCCL=ctx.H.OCC,UI_FADE_OPACITY=.35;\n' +
    ui.slice(begin, end) + '\nreturn hideList();')(ctx, performance);
  const guardStart = entry.indexOf('  var cam_in = '), guardEnd = entry.indexOf('  function cam_decideSoon(');
  assert(guardStart >= 0 && guardEnd > guardStart, 'indoor camera guard not found');
  const guard = entry.slice(guardStart, guardEnd);
  assert(guard.includes('ent_intersect(ray, walls)'), 'room-surface prefilter is required');
  // Reference: identical guard and exact AABB raycast, with its previous all-solids candidate list.
  const reference = guard.replace(/const walls = cam_in\.walls;\s*walls\.length = 0;\s*for \(const o of ent_solids\(false\)\) if \(o\.userData\.tmPass\) walls\.push\(o\);/, '')
    .replace('ent_intersect(ray, walls)', 'ent_intersect(ray, ent_solids(false))');
  const make = (body) => new Function('ctx', 'performance',
    'const {Box3,Vector3,Mesh,InstancedMesh,Matrix4,Raycaster}=ctx.THREE;const scene=ctx.scene,camera=ctx.camera,cam={},ent_sec={on:false};\n' +
    querySection + body + '\nreturn {keep:cam_keepInside,section:ent_sec,solids:ent_solids};')(ctx, performance);
  const before = make(reference), after = make(guard), { Vector3 } = ctx.THREE;
  const views = Object.entries(ctx.shared.flyPoints || {}).filter(([id, v]) =>
    /kodesh|menor|shulchan|incense|ulamInside|throne/.test(id) && Array.isArray(v.pos) && Array.isArray(v.target));
  assert(views.length > 0, 'interior viewpoints not found');
  let verifiedPoses = 0;
  for (const [id, v] of views) {
    for (const axis of [null, 'x', 'y', 'z']) {
      for (const api of [before, after]) Object.assign(api.section, {
        on: axis !== null, axis, v: axis === null ? 0 : v.target[{ x: 0, y: 1, z: 2 }[axis]]
      });
      const p0 = new Vector3(...v.pos), p1 = p0.clone(), q = new Vector3(...v.target);
      before.keep(p0, q); after.keep(p1, q);
      assert.equal(JSON.stringify(p0.toArray()), JSON.stringify(p1.toArray()), `${house}/${id}/${axis}: indoor camera correction changed`);
      verifiedPoses++;
    }
  }
  before.section.on = after.section.on = false;
  // Time only close views within the production orbit threshold; distant hall views use look mode.
  // The guard is conditional on being indoors/keeping the eye inside; this is its CPU cost, not full-frame time.
  const near = Number(/var CAM_NEAR = ([\d.]+)/.exec(entry)?.[1]);
  assert(Number.isFinite(near), 'camera orbit threshold not found');
  const timed = views.filter(([, v]) => new Vector3(...v.pos).distanceTo(new Vector3(...v.target)) <= near);
  assert(timed.length > 0, 'close orbit viewpoints not found');
  const run = (api) => {
    const t0 = performance.now();
    for (let n = 0; n < 5; n++) for (const [, v] of timed) api.keep(new Vector3(...v.pos), new Vector3(...v.target));
    return performance.now() - t0;
  };
  run(before); run(after);
  const a = [], b = [];
  for (let i = 0; i < 3; i++) { a.push(run(before)); b.push(run(after)); }
  a.sort((x, y) => x - y); b.sort((x, y) => x - y);
  return { house, verifiedPoses, markedRoomSurfaces: walls.length, solids: before.solids(false).length,
    timedViews: timed.map(([id]) => id), queriesPerBatch: timed.length * 5, baselineMs: a[1], candidateMs: b[1],
    note: 'Median of three batches; actual close viewpoints, unchanged camera result. Includes current terrain acceleration in both paths.' };
}

for (const house of selected ? [selected] : ['rishon', 'sheni']) {
  const ctx = await buildModel(house, root), { Vector3, Raycaster, Mesh } = ctx.THREE;
  // Use the production solid selection and query helpers, including each house's source slots.
  const source = houseText(house, '90-entry.js', root);
  const start = source.indexOf('  var ent_sol = '), end = source.indexOf('  function ent_roofed(');
  assert(start >= 0 && end > start, 'camera solid/query helper section not found');
  const section = source.slice(start, end);
  const makeQueries = () => new Function('ctx', 'performance',
    'const {Box3,Vector3,Mesh,InstancedMesh,Matrix4}=ctx.THREE; const scene=ctx.scene;\n' + section +
    '\nreturn {solids:ent_solids,intersect:ent_intersect,pickable:ent_pickable};')(ctx, performance);
  const terrains = [];
  ctx.scene.traverse(o => {
    const p = o.geometry?.parameters;
    if (o.isMesh && p?.widthSegments === 220 && p?.heightSegments === 220 && Object.hasOwn(o, '_computeIntersections')) {
      terrains.push({ mesh: o, accelerated: o._computeIntersections, nx: p.widthSegments, nz: p.heightSegments });
    }
  });
  assert.equal(terrains.length, 1, `${house}: expected the accelerated 220 x 220 coarse terrain`);
  const originalPositions = terrains[0].mesh.geometry.attributes.position.array.slice();
  let rashiDeformation = null;
  const setTerrain = (on) => {
    for (const t of terrains) t.mesh._computeIntersections = on ? t.accelerated : Mesh.prototype._computeIntersections;
  };
  try {
    const states = house === 'rishon' ? [
      { name: 'coarse-rashi', reading: 'rashi', refined: false },
      { name: 'coarse-rambam', reading: 'rambam', refined: false },
      { name: 'refined-valleys-rashi', reading: 'rashi', refined: true },
      { name: 'refined-valleys-rambam', reading: 'rambam', refined: true }
    ] : [{ name: 'coarse', reading: null, refined: false }];
    for (const { name: state, reading, refined } of argv.includes('--room-only') ? [] : states) {
      // buildUI.after-tg applies Rashi AFTER all builders. That setter also shifts eight coarse-terrain vertices beneath
      // the house; benchmarking the builders' initial Rambam state alone misses the real browser's irregular grid.
      if (reading) ctx.shared.traksin.set(reading);
      if (refined && !ctx.shared.valleys188.state.done) {
        // Run only the real deferred valley builder, without advancing demonstrations or unrelated animations.
        const refine = ctx.animated.find(fn => String(fn).includes('rowOf(ST.j++)'));
        assert(refine, 'deferred valley builder not found');
        for (let i = 0; i < 1000 && !ctx.shared.valleys188.state.done; i++) refine();
        assert(ctx.shared.valleys188.state.done, 'valley refinement did not finish');
        assert(ctx.shared.valleys188.cells > 0, 'no coarse cells were replaced');
      }
      ctx.scene.updateMatrixWorld(true);
      const deformation = terrainDeformation(terrains[0], originalPositions);
      if (reading === 'rashi') {
        assert(deformation.vertices.length > 0, 'Rashi default must exercise the terrain deformation present in the full UI');
        if (rashiDeformation) assert.deepEqual(deformation, rashiDeformation, 'restoring Rashi changed its terrain deformation');
        else rashiDeformation = deformation;
      } else assert.equal(deformation.vertices.length, 0, `${house}/${state}: terrain vertices did not restore exactly`);
      // A fresh selector includes the newly added valley blocks immediately, independent of the live one-second cache.
      const query = makeQueries(), solids = query.solids('floor'), rays = [];
      assert.equal(typeof query.intersect.first, 'function', 'nearest-hit helper is required');
      const down = (x, y, z, far = 500) => new Raycaster(new Vector3(x, y, z), new Vector3(0, -1, 0), 0, far);
      for (const x of [-120, -60, 0, 60, 120, 180, 240, 300]) {
        for (const z of [-180, -60, 60, 180, 300]) rays.push(down(x, 200, z));
      }
      const run = (mode) => {
        setTerrain(mode !== 'reference');
        const t0 = performance.now();
        let hits = 0;
        for (const ray of rays) {
          const hit = mode === 'nearest' ? query.intersect.first(ray, solids)
            : (mode === 'bounds' ? query.intersect(ray, solids) : ray.intersectObjects(solids, false))[0];
          if (hit) hits++;
        }
        return { ms: performance.now() - t0, hits };
      };
      setTerrain(true);
      const coldStart = performance.now();
      rays[0].intersectObjects(solids, false);
      const coldFirstQueryMs = performance.now() - coldStart;
      // Cold cost is reported separately: the first vertical query validates/builds the grid lookup.
      // Warm each path before timing; cached shader or GPU behavior is not part of this CPU measurement.
      for (const mode of ['reference', 'terrain', 'bounds', 'nearest']) run(mode);
      const times = { reference: [], terrain: [], bounds: [], nearest: [] };
      for (let batch = 0; batch < 3; batch++) {
        for (const mode of Object.keys(times)) times[mode].push(run(mode));
      }
      const timings = {};
      for (const [mode, samples] of Object.entries(times)) {
        samples.sort((a, b) => a.ms - b.ms);
        timings[mode] = samples[1];
      }

      let seed = report.workload.randomSeed;
      const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 | 0) >>> 0) / 4294967296;
      const probes = [...rays];
      for (let i = 0; i < 70; i++) probes.push(down(random() * 5000 - 2400, random() * 300 + 30, random() * 5000 - 2400, 600));
      if (refined) {
        for (let i = 0; i < 60; i++) probes.push(down(random() * 1080 - 430, 100, random() * 1040 + 430, 600));
      }
      const position = terrains[0].mesh.geometry.attributes.position;
      for (let i = 0; i < 18; i++) {
        const k = Math.floor(random() * position.count);
        probes.push(down(position.getX(k), 200, position.getZ(k), 600));
      }
      for (let i = 0; i < 12; i++) {
        probes.push(new Raycaster(new Vector3(random() * 500 - 100, 120, random() * 500 - 100),
          new Vector3(random() * 0.4 - 0.2, -1, random() * 0.4 - 0.2).normalize(), 0, 600));
      }
      const warpProbeStart = probes.length;
      if (rashiDeformation) {
        // Probe both the old/new vertices and either side of their exact edges, then both triangle interiors in every
        // affected cell. Keep these probes when returning to Rambam: geometry-version invalidation must undo the warp too.
        const { mesh, nx } = terrains[0], width = nx + 1, p = mesh.geometry.attributes.position;
        const points = new Map(), add = (x, z) => points.set(x + ':' + z, [x, z]);
        for (const { before, after } of rashiDeformation.vertices) for (const q of [before, after]) {
          for (const [dx, dz] of [[0, 0], [-1e-5, 0], [1e-5, 0], [0, -1e-5], [0, 1e-5]]) add(q[0] + dx, q[2] + dz);
        }
        for (const cell of rashiDeformation.affectedCells) {
          const a = Math.floor(cell / nx) * width + cell % nx, b = a + width, d = a + 1;
          for (const ids of [[a, b, d], [b, b + 1, d]]) {
            add(ids.reduce((n, i) => n + p.getX(i), 0) / 3, ids.reduce((n, i) => n + p.getZ(i), 0) / 3);
          }
        }
        for (const [x, z] of points.values()) {
          const world = new Vector3(x, 200, z).applyMatrix4(mesh.matrixWorld);
          probes.push(down(world.x, world.y, world.z, 600));
        }
      }
      for (let i = 0; i < probes.length; i++) {
        const ray = probes[i], label = `${house}/${state} ray ${i}`;
        setTerrain(false);
        const expected = ray.intersectObjects(solids, false);
        setTerrain(true);
        assert.equal(encode(ray.intersectObjects(solids, false)), encode(expected), label + ': terrain changed exact hits');
        assert.equal(encode(query.intersect(ray, solids)), encode(expected), label + ': bounds changed exact hits');
        assert.equal(encode([query.intersect.first(ray, solids)].filter(Boolean)), encode(expected.slice(0, 1)), label + ': nearest hit changed');
      }
      const { nx, nz } = terrains[0];
      const result = {
        house, state, solids: solids.length, verifiedRays: probes.length, coldFirstQueryMs,
        traksin: reading, uiDefault: reading === 'rashi' || house === 'sheni', targetedWarpRays: probes.length - warpProbeStart,
        terrainDeformation: { changedVertices: deformation.vertices.length, affectedCellCount: deformation.affectedCells.length, ...deformation },
        gridIndexTypedArrayBytes: (nx + 1 + nz + 1) * Float64Array.BYTES_PER_ELEMENT + nx * nz * Int32Array.BYTES_PER_ELEMENT,
        note: 'Base lattice typed-array count excludes sparse-cell and object/Map overhead; cold query includes ordinary ray initialization too.',
        timings, valleyCells: ctx.shared.valleys188?.cells || 0
      };
      report.states.push(result);
      console.log(JSON.stringify(result, null, 2));
    }
    // The room selector and camera corrections must also run in the actual first-house UI default.
    if (house === 'rishon') ctx.shared.traksin.set('rashi');
    const room = roomBenchmark(ctx, house, source, section);
    report.rooms.push(room);
    console.log(JSON.stringify(room, null, 2));
  } finally { setTerrain(true); }
}

if (option('--out')) {
  const out = path.resolve(option('--out'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
}
console.log(`Verified ${report.states.reduce((sum, s) => sum + s.verifiedRays, 0)} actual-model ray cases; exact results unchanged.`);
console.log(`Verified ${report.rooms.reduce((sum, s) => sum + s.verifiedPoses, 0)} actual indoor camera corrections; positions unchanged.`);
