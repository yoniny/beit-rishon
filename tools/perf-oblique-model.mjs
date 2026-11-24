// Exact oblique-ray equivalence and paired CPU measurements on the real temple models.
// node tools/perf-oblique-model.mjs [--out report.json]
// Same current scene on both sides; only the coarse terrain's triangle-query path changes.
// DOM/canvas/audio are stubbed. These are ray-query timings, not browser frame times or FPS.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { buildModel } from './perf-geometry.mjs';
import { houseText } from './house-slots.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceHash = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex');
const encode = hits => JSON.stringify(hits.map(h => ({ object: h.object.id, instance: h.instanceId,
  distance: h.distance, face: h.faceIndex, point: h.point.toArray(), uv: h.uv?.toArray(), normal: h.normal?.toArray() })));
const one = hit => hit ? [hit] : [];
const report = {
  baseCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  sourceHashes: Object.fromEntries(['shared/frag/terrain-raycast.js', 'shared/frag/raycast-bounds.js'].map(name => [name, sourceHash(name)])),
  note: 'Same current model/scene/candidates. Reference replaces only the coarse terrain triangle method with original Three.js. Node CPU queries; DOM/canvas/audio stubbed, no GPU/FPS/whole-application claim.',
  environment: { node: process.version, platform: process.platform, arch: process.arch, cpu: os.cpus()[0]?.model },
  viewport: { width: 960, height: 600, fov: 48 },
  statistic: 'Median of three paired warm batches after one warmup of each path; alternate measurement order. No timing threshold is asserted.',
  firstQueryNote: 'First measured query after each model state change is reported separately. It is not necessarily cold because model builders can query the terrain.',
  states: []
};
for (const house of ['rishon', 'sheni']) {
  const ctx = await buildModel(house, root), T = ctx.THREE;
  const entry = houseText(house, '90-entry.js', root);
  const section = entry.slice(entry.indexOf('  var ent_sol = '), entry.indexOf('  function ent_roofed('));
  assert(section.includes('function ent_solids('));
  const makeQueries = () => new Function('ctx', 'performance',
    'const {Box3,Vector3,Mesh,InstancedMesh,Matrix4,Object3D,Line,Points,Sprite}=ctx.THREE;const scene=ctx.scene;\n' +
    section + '\nreturn {solids:ent_solids,intersect:ent_intersect,pickable:ent_pickable};')(ctx, performance);
  let terrain;
  ctx.scene.traverse(o => {
    const p = o.geometry?.parameters;
    if (p?.widthSegments === 220 && p?.heightSegments === 220 && Object.hasOwn(o, '_computeIntersections')) {
      assert(!terrain, 'expected one coarse terrain'); terrain = o;
    }
  });
  assert(terrain, 'accelerated terrain was not found');
  const accelerated = terrain._computeIntersections;
  const set = on => { terrain._computeIntersections = on ? accelerated : T.Mesh.prototype._computeIntersections; };
  try {
    const states = house === 'rishon' ? [
      { name: 'coarse-rashi', reading: 'rashi', refined: false, time: true },
      { name: 'refined-rashi', reading: 'rashi', refined: true, time: true },
      { name: 'refined-rambam', reading: 'rambam', refined: true, time: false }
    ] : [{ name: 'default', reading: null, refined: false, time: true }];
    for (const state of states) {
      if (state.reading) ctx.shared.traksin.set(state.reading);
      if (state.refined && !ctx.shared.valleys188.state.done) {
        const refine = ctx.animated.find(fn => String(fn).includes('rowOf(ST.j++)'));
        assert(refine, 'valley refinement callback not found');
        for (let i = 0; i < 1000 && !ctx.shared.valleys188.state.done; i++) refine();
        assert(ctx.shared.valleys188.state.done && ctx.shared.valleys188.cells > 0);
      }
      ctx.scene.updateMatrixWorld(true);
      ctx.camera.fov = report.viewport.fov; ctx.camera.aspect = report.viewport.width / report.viewport.height;
      ctx.camera.updateProjectionMatrix();
      const views = [
        { name: 'overview', pos: [430, 190, 240], target: [0, 30, 0] },
        ...Object.entries(ctx.shared.flyPoints).filter(([id, v]) => /kodesh|menor|ulamInside/.test(id) && v.pos && v.target).slice(0, 3)
          .map(([name, v]) => ({ name, ...v }))
      ];
      assert.equal(views.length, 4);
      const rays = [];
      for (const view of views) {
        ctx.camera.position.fromArray(view.pos); ctx.camera.lookAt(new T.Vector3(...view.target)); ctx.camera.updateMatrixWorld(true);
        for (const xy of [[0, 0], [-0.7, 0], [0.7, 0], [0, -0.5], [-0.7, -0.5], [0.7, -0.5]]) {
          const ray = new T.Raycaster(); ray.setFromCamera(new T.Vector2(...xy), ctx.camera); ray.near = 0.3; ray.far = 3000;
          rays.push({ name: `${view.name}/${xy.join(',')}`, ray });
        }
      }
      const query = makeQueries(), solids = query.solids('floor');
      // Include actual terrain triangle interiors, including shallow and upward directions, in addition to view rays.
      const probes = rays.map(q => q.ray), p = terrain.geometry.attributes.position, index = terrain.geometry.index;
      let seed = 482915;
      const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 | 0) >>> 0) / 4294967296;
      for (let i = 0; i < 40; i++) {
        const face = Math.floor(random() * index.count / 3), target = new T.Vector3();
        for (let j = 0; j < 3; j++) {
          const k = index.getX(face * 3 + j); target.x += p.getX(k) / 3; target.y += p.getY(k) / 3; target.z += p.getZ(k) / 3;
        }
        target.applyMatrix4(terrain.matrixWorld);
        const origin = target.clone().add(new T.Vector3((random() - 0.5) * 1800, (random() - 0.5) * (i % 3 ? 500 : 10), (random() - 0.5) * 1800));
        const ray = new T.Raycaster(origin, target.clone().sub(origin).normalize(), 0, 5000); ray.camera = ctx.camera; probes.push(ray);
      }
      set(true); const t0 = performance.now(); probes[0].intersectObject(terrain, false); const firstMeasuredQueryMs = performance.now() - t0;
      let comparisons = 0, terrainHits = 0;
      for (const ray of probes) {
        set(false); const expected = ray.intersectObjects(solids, false), expectedTerrain = ray.intersectObject(terrain, false);
        set(true); assert.equal(encode(ray.intersectObjects(solids, false)), encode(expected)); comparisons++;
        const actualTerrain = ray.intersectObject(terrain, false); assert.equal(encode(actualTerrain), encode(expectedTerrain)); comparisons++;
        assert.equal(encode(one(query.intersect.first(ray, solids))), encode(expected.slice(0, 1))); comparisons++;
        terrainHits += actualTerrain.length;
      }
      const timings = [];
      if (state.time) for (const workload of ['terrain-only', 'cursor-anchor']) {
        const run = on => {
          set(on); let hits = 0; const start = performance.now();
          for (const { ray } of rays) {
            const hit = workload === 'terrain-only' ? ray.intersectObject(terrain, false)[0]
              : query.intersect.first(ray, query.pickable(ctx.scene));
            if (hit) hits++;
          }
          return { ms: performance.now() - start, hits };
        };
        run(false); run(true); const before = [], after = [];
        for (let i = 0; i < 3; i++) {
          if (i % 2) { after.push(run(true)); before.push(run(false)); }
          else { before.push(run(false)); after.push(run(true)); }
        }
        assert.equal(before[0].hits, after[0].hits);
        const median = values => values.map(x => x.ms).sort((a, b) => a - b)[1];
        timings.push({ workload, queriesPerBatch: rays.length, hitQueries: before[0].hits,
          baselineMs: median(before), candidateMs: median(after), samples: { before, after } });
      }
      const result = { house, state: state.name, reading: state.reading, valleyCells: ctx.shared.valleys188?.cells || 0,
        probeRays: probes.length, exactComparisons: comparisons, terrainHits, firstMeasuredQueryMs,
        views: views.map(v => v.name), timings };
      report.states.push(result); console.log(JSON.stringify(result));
    }
  } finally { set(true); }
}
const outIndex = process.argv.indexOf('--out');
if (outIndex >= 0) {
  const out = path.resolve(process.argv[outIndex + 1]); fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
}
console.log(`PASS ${report.states.reduce((n, s) => n + s.exactComparisons, 0)} exact actual-model oblique comparisons.`);
