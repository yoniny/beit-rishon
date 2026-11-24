// UI picking equivalence on vendored Three.js and actual model geometry.
// node tools/perf-ui-rays.mjs [--out report.json]
// CPU query timing only: no rendering, DOM layout, GPU/FPS or total-memory claim.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { buildModel } from './perf-geometry.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
// Keep the reference reachable from upstream even when this PR is squash-merged.
const baseline = '695456732c1d93db67268d13b7367cca76783aee';
const oldUI = execFileSync('git', ['show', baseline + ':shared/70-ui.js'], { cwd: root, encoding: 'utf8' });
const oldEntry = execFileSync('git', ['show', baseline + ':shared/90-entry.js'], { cwd: root, encoding: 'utf8' });
const ui = read('shared/70-ui.js');
const helper = read('shared/frag/raycast-bounds.js');
const T = new Function('window', read('shared/00-lib.js') + helper + '\nreturn { ...three_module_exports, makeRaycast: ent_makeRaycast };})(); return OtzariaPlugin;')({ performance });
const { Scene, Group, Mesh, BoxGeometry, MeshBasicMaterial, DoubleSide, Vector3, Raycaster, Plane, Object3D } = T;
const encode = h => h ? JSON.stringify({ object: h.object.id, instance: h.instanceId, face: h.faceIndex,
  distance: h.distance, point: h.point.toArray(), uv: h.uv?.toArray(), normal: h.normal?.toArray() }) : null;
// Read each original post-hit loop verbatim, so the reference does not share the new predicates.
function oldAccept(kind) {
  const prefix = kind === 'measure' ? '        for (const h of mRay.intersectObjects(ctx.root.children, true)) {' :
    '            for (const m of lRay.intersectObjects(ctx.root.children, true)) {';
  const end = kind === 'measure' ? '          return h.point.clone();' : '              if (m.distance < h.distance - 1) return null;';
  const start = oldUI.indexOf(prefix);
  assert(start >= 0);
  const body = oldUI.slice(start + prefix.length, oldUI.indexOf(end, start)).replaceAll('continue;', 'return false;');
  return new Function(kind === 'measure' ? 'h' : 'm', body + '\nreturn true;');
}
function currentAccept(kind) {
  const name = kind === 'measure' ? 'mAccept' : 'labelOccluder';
  const start = ui.indexOf('const ' + name + ' = '), end = ui.indexOf('\n' + (kind === 'measure' ? '      ' : '        ') + '};', start);
  assert(start >= 0 && end > start);
  return new Function(ui.slice(start, end + (kind === 'measure' ? 10 : 12)) + '\nreturn ' + name + ';')();
}
const filters = ['measure', 'label'].map(kind => ({ kind, before: oldAccept(kind), after: currentAccept(kind) }));
let checks = 0;
function compare(cast, scene, ray) {
  const expected = ray.intersectObjects(scene.children, true);
  for (const f of filters) {
    assert.equal(encode(cast.firstVisible(ray, scene, f.after)), encode(expected.find(f.before)), `${f.kind}: hit changed`);
    checks++;
  }
}
const material = new MeshBasicMaterial({ side: DoubleSide });
const add = (parent, x, y, z, m = material) => { const mesh = new Mesh(new BoxGeometry(4, 2, 4), m); mesh.position.set(x, y, z); parent.add(mesh); return mesh; };
const down = (x = 0, z = 0) => new Raycaster(new Vector3(x, 40, z), new Vector3(0, -1, 0), 0, 100);
const scene = new Scene(), cast = T.makeRaycast(), hidden = new Group();
scene.add(hidden); hidden.visible = false;
add(hidden, 0, 30, 0); add(scene, 0, 0, 0);
const noPick = add(scene, 0, 20, 0); noPick.userData.noPick = true; add(noPick, 8, 0, 0);
const ghost = add(scene, 0, 15, 0, material.clone()); ghost.material.opacity = 0.25;
const materials = Array.from({ length: 6 }, () => material.clone()); materials[2].opacity = 0.1;
materials[3].clippingPlanes = [new Plane(new Vector3(0, 1, 0), -9)];
const multi = add(scene, 0, 10, 0, materials);
const clip = add(scene, 0, 5, 0, material.clone()); clip.material.clippingPlanes = [new Plane(new Vector3(0, -1, 0), 5)];
const parent = add(scene, 20, 0, 0); add(parent, 12, 0, 0); // child extends beyond its parent's geometry bounds
const custom = new Group(); scene.add(custom); const child = add(custom, 40, 0, 0);
custom.raycast = () => false;
const customLeaf = add(scene, 50, 0, 0); customLeaf.raycast = function (ray, hits) { Mesh.prototype.raycast.call(this, ray, hits); };
const customParent = add(scene, 60, 0, 0); add(customParent, 12, 0, 0);
customParent.raycast = function (ray, hits) { Mesh.prototype.raycast.call(this, ray, hits); return false; };
const tied = add(scene, 80, 0, 0), tied2 = add(scene, 80, 0, 0);
for (const change of [() => {}, () => { hidden.visible = true; }, () => { multi.visible = false; },
  () => { ghost.material.opacity = 1; }, () => { custom.raycast = Object3D.prototype.raycast; },
  () => { customParent.layers.set(2); }, () => { parent.visible = false; },
  () => { tied.visible = false; }, () => { scene.visible = false; }, () => { scene.visible = true; }]) {
  change(); scene.updateMatrixWorld(true);
  for (const x of [0, 2, 8, 20, 32, 40, 50, 60, 72, 80]) compare(cast, scene, down(x));
}
// A first hit rejected by the predicate must not hide a later usable face in that same mesh.
const clippedScene = new Scene(); const clipped = add(clippedScene, 0, 0, 0, material.clone());
clipped.material.clippingPlanes = [new Plane(new Vector3(0, -1, 0), 0)]; clippedScene.updateMatrixWorld(true);
const firstClipped = cast.firstVisible(down(), clippedScene, filters[0].after);
assert.equal(firstClipped.point.y, -1); compare(cast, clippedScene, down());
// A custom subtree keeps recursive return-false semantics even when its own hit is ineligible.
const stopScene = new Scene(), stopper = add(stopScene, 0, 20, 0);
stopper.userData.noPick = true; stopper.raycast = () => false; add(stopper, 0, -10, 0); add(stopScene, 0, 0, 0);
stopScene.updateMatrixWorld(true); compare(cast, stopScene, down());
console.log(`PASS ${checks} synthetic UI hit comparisons, including clipping, material arrays and recursive custom raycasts`);

const sourceHashes = Object.fromEntries(['shared/70-ui.js', 'shared/90-entry.js', 'shared/frag/raycast-bounds.js']
  .map(name => [name, crypto.createHash('sha256').update(read(name)).digest('hex')]));
const report = { baseline, sourceHashes, note: 'Same current models and rays; compares the original UI ray/predicate path with the optimized path. Node CPU only, DOM/canvas/audio stubbed.',
  syntheticComparisons: checks, houses: [] };
for (const house of ['rishon', 'sheni']) {
  const ctx = await buildModel(house, root);
  if (house === 'rishon') ctx.shared.traksin.set('rashi');
  const { Vector3, Raycaster, Object3D, Mesh, InstancedMesh, Matrix4, Box3, Line, Points, Sprite } = ctx.THREE;
  const accelerated = new Function('T', 'const {Vector3,Object3D,Mesh,InstancedMesh,Matrix4,Box3,Line,Points,Sprite}=T;\n' + helper + '\nreturn ent_intersect;')(ctx.THREE);
  ctx.scene.updateMatrixWorld(true); ctx.camera.updateMatrixWorld(true);
  const solidsAPI = source => {
    const section = source.slice(source.indexOf('  var ent_sol = '), source.indexOf('  function ent_roofed('));
    return new Function('ctx', 'performance', 'const {Vector3,Box3}=ctx.THREE;const scene=ctx.scene;\n' +
      section + '\nreturn {solids:ent_solids,state:ent_sol};')(ctx, performance);
  };
  const oldSolids = solidsAPI(oldEntry), newSolids = solidsAPI(read('shared/90-entry.js'));
  for (const kind of [false, true, 'floor']) {
    assert.equal(JSON.stringify(newSolids.solids(kind).map(o => o.id)), JSON.stringify(oldSolids.solids(kind).map(o => o.id)));
  }
  const removedUnusedWallRecords = oldSolids.state.walls.length;
  const views = [
    { name: 'overview', pos: [430, 190, 240], target: [0, 20, 0] },
    ...Object.entries(ctx.shared.flyPoints).filter(([id, v]) => /kodesh|menor|ulamInside/.test(id) && v.pos && v.target).slice(0, 3)
      .map(([name, v]) => ({ name, ...v }))
  ];
  const queries = [];
  for (const view of views) for (const dx of [-3, 0, 3]) {
    const origin = new Vector3(...view.pos), target = new Vector3(...view.target); target.x += dx;
    const ray = new Raycaster(origin, target.sub(origin).normalize(), 0.3, Infinity); ray.camera = ctx.camera;
    queries.push({ name: `${view.name}/${dx}`, ray });
  }
  const queriesBefore = checks;
  for (const q of queries) compare(accelerated, ctx.root, q.ray);
  // Exercise live visibility, material replacement and clipping without rebuilding the cached bounds.
  ctx.shared.section.set(true, 'z', 0);
  for (const q of queries) compare(accelerated, ctx.root, q.ray);
  ctx.shared.section.set(false);
  const elapsed = fn => { const t = performance.now(); fn(); return performance.now() - t; };
  const median = a => a.sort((x, y) => x - y)[Math.floor(a.length / 2)];
  const times = [];
  for (const f of filters) {
    const before = () => queries.forEach(q => q.ray.intersectObjects(ctx.root.children, true).find(f.before));
    const after = () => queries.forEach(q => accelerated.firstVisible(q.ray, ctx.root, f.after));
    before(); after();
    const a = [], b = [];
    for (let i = 0; i < 3; i++) {
      if (i % 2) { b.push(elapsed(after)); a.push(elapsed(before)); }
      else { a.push(elapsed(before)); b.push(elapsed(after)); }
    }
    times.push({ kind: f.kind, queriesPerBatch: queries.length, beforeMs: median(a), afterMs: median(b) });
  }
  // Flat fade/roof/cloud/pill lists retain exactly the same complete intersection list.
  const flat = []; ctx.root.traverse(o => { if (o.isMesh) flat.push(o); });
  for (const q of queries) {
    assert.equal(JSON.stringify(accelerated(q.ray, flat).map(encode)), JSON.stringify(q.ray.intersectObjects(flat, false).map(encode)));
  }
  const result = { house, identicalSolidLists: 3, removedUnusedWallRecords, exactUIComparisons: checks - queriesBefore, exactFlatListComparisons: queries.length,
    views: views.map(v => v.name), times };
  report.houses.push(result); console.log(JSON.stringify(result));
}
const outIndex = process.argv.indexOf('--out');
if (outIndex >= 0) {
  const out = path.resolve(process.argv[outIndex + 1]); fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
}
console.log('PASS UI ray acceptance, all-hit equivalence and model picking checks');
