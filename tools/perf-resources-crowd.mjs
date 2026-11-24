// Regression/CPU-work checks for crowd LOD: the bundled Three.js matrices and actual people kit,
// with tiny face/hand fixtures in place of expensive texture and face construction.
// Optional --baseline <people-kit.js> reports the same workload for a previous revision.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lib = fs.readFileSync(path.join(root, 'shared/00-lib.js'), 'utf8');
const source = fs.readFileSync(path.join(root, 'shared/frag/people-kit.js'), 'utf8');
function load(text) {
  const context = vm.createContext({ window: { performance }, console });
  return vm.runInContext(lib + `
    let distances = 0;
    const distanceTo = Vector3.prototype.distanceTo;
    Vector3.prototype.distanceTo = function (p) { distances++; return distanceTo.call(this, p); };
    const faceGeo = (name, alpha = false) => {
      const g = new BoxGeometry(0.2, 0.3, 0.2); g.name = name;
      g.setAttribute('color', new Float32BufferAttribute(new Float32Array(g.attributes.position.count * (alpha ? 4 : 3)).fill(1), alpha ? 4 : 3));
      return g;
    };
    const faces = { lo: faceGeo('head-lo'), hi: faceGeo('head-hi'), eyes: faceGeo('eyes'), hair: faceGeo('hair', true) };
    const FACE = { tex: { skin: null, eye: null }, UV_SKIN: [0.9, 0.2], uvOf: () => [0.5, 0.5],
      head: (d) => faces[d], eyes: () => faces.eyes, hair: () => faces.hair, hairMats: (m) => ({ lo: m, hi: m }) };
    const tm_face = () => FACE;
    const tm_hand = () => ({ geo: faceGeo('hand') });
    const tm_tefRosh = () => faceGeo('tefillin');
    ${text}
    return { tm_people, Group, Scene, PerspectiveCamera, Matrix4, MeshStandardMaterial,
      work: () => distances, reset: () => { distances = 0; } };
  })(); OtzariaPlugin;`, context);
}
function run(text) {
  const T = load(text), scene = new T.Scene(), layer = new T.Group(), parent = new T.Group();
  scene.add(layer); layer.add(parent);
  const camera = new T.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 2.075, 2);
  const ctx = { camera, animated: [], shared: { peopleAvnet: { meshes: [], mat: () => new T.MeshStandardMaterial() } } };
  const kit = T.tm_people(ctx), pts = Array.from({ length: 80 }, (_, i) => [(i - 40) * 1.5, 0, 0]);
  const near = kit.crowd(parent, pts, { pose: 'stand', kind: 'kohen', s: 1, y: 0, exact: true, arms: false });
  const handle = near.userData.crowd, lod = handle.lod;
  const head = near.children.find((m) => m.geometry?.name === 'head-lo');
  assert.ok(head);
  const frame = () => { scene.updateMatrixWorld(true); camera.updateMatrixWorld(true); ctx.animated.forEach((f) => f()); };
  const selected = () => Array.from({ length: pts.length }, (_, i) => i).filter((i) => head.instanceMatrix.array[i * 16] === 0);
  const states = [];
  const snap = (name) => { states.push({ name, level: lod.lv, selected: selected(), tefillin: lod.tef.visible }); };
  frame(); snap('initial');
  assert.equal(lod.lv, 0);
  assert.equal(selected().length, 6, 'keep all six nearest detailed heads');
  T.reset();
  const started = performance.now();
  for (let i = 0; i < 600; i++) frame();
  const staticWork = T.work(), staticMs = performance.now() - started;
  snap('static');
  camera.position.x = 15; frame(); snap('camera-moved');
  assert.notDeepEqual(states.at(-1).selected, states[0].selected);
  parent.position.x = 30; frame(); snap('parent-moved');
  assert.notDeepEqual(states.at(-1).selected, states.at(-2).selected, 'moving the parent must invalidate the selection');
  parent.rotation.y = Math.PI / 2; frame(); snap('parent-rotated');
  parent.scale.set(2, 1, 0.5); frame(); snap('parent-scaled');
  parent.rotation.y = 0; parent.position.x = 0; parent.scale.setScalar(1);
  camera.position.set(0, 2.075, 2); frame();
  const moved = selected()[0];
  handle.pose(moved, new T.Matrix4().makeTranslation(300, 0, 0)); handle.done();
  frame(); snap('figure-moved');
  assert.ok(!selected().includes(moved), 'moving a figure must invalidate the selection');
  ctx.shared.tefOff = new Set(['night']); frame(); snap('tefillin-hidden');
  assert.equal(lod.tef.visible, false, 'time/ritual changes still apply with a stationary camera');
  ctx.shared.tefOff.clear(); frame(); snap('tefillin-shown');
  assert.equal(lod.tef.visible, true);
  camera.zoom = 0.4; frame(); snap('zoom-out');
  camera.fov = 65; frame(); snap('lens-changed');
  layer.visible = false;
  T.reset();
  for (let i = 0; i < 600; i++) frame();
  const hiddenWork = T.work();
  // Change every input while hidden, then verify the first visible frame resumes the correct detail.
  camera.zoom = 1; camera.fov = 45; camera.position.x = -25;
  parent.position.x = -10;
  handle.pose(0, new T.Matrix4().makeTranslation(-15, 0, 0)); handle.done();
  frame(); layer.visible = true; frame(); snap('visible-again');
  camera.position.set(0, 2, 250); frame(); snap('far');
  assert.equal(lod.lv, 2);
  camera.position.set(0, 2.075, 2); frame(); snap('near-again');
  assert.equal(lod.lv, 0);
  return { staticWork, hiddenWork, staticMs, states, digest: createHash('sha256').update(JSON.stringify(states)).digest('hex') };
}
const current = run(source);
const i = process.argv.indexOf('--baseline');
const baseline = i >= 0 ? run(fs.readFileSync(process.argv[i + 1], 'utf8')) : null;
const summary = ({ states, ...result }) => ({ ...result, scenarios: states.length });
console.log(JSON.stringify({ current: summary(current), ...(baseline ? { baseline: summary(baseline) } : {}) }, null, 2));
assert.equal(current.staticWork, 600, 'stationary crowds must do only the one LOD distance per frame, not 80 head distances');
assert.equal(current.hiddenWork, 0, 'hidden ancestors must skip crowd LOD and head selection');
if (baseline) assert.deepEqual(current.states, baseline.states, 'visible LOD/face selection behaviour changed');
else assert.equal(current.digest, 'af12cd29939bd59f415e976b0548628b017be2e9f889dd98b1cc81b4da5bb58b', 'visible LOD/face selection behaviour changed');

// Removed crowds must leave both animation and material-subscription lists. The geometry/material caches are shared by
// crowds which remain in the scene, while each InstancedMesh owns GPU instance buffers released by its dispose event.
{
  const T = load(source), scene = new T.Scene(), parent = new T.Group(); scene.add(parent);
  const camera = new T.PerspectiveCamera(45, 1, 0.1, 1000); camera.position.set(0, 2.075, 2);
  const ctx = { camera, animated: [], shared: { peopleAvnet: { meshes: [], mat: () => new T.MeshStandardMaterial() } } };
  const kit = T.tm_people(ctx), options = { pose: 'stand', kind: 'kohen', s: 1, y: 0, exact: true, arms: false };
  const frame = () => { scene.updateMatrixWorld(true); camera.updateMatrixWorld(true); ctx.animated.forEach(f => f()); };
  const survivor = kit.crowd(parent, [[1, 0, 0]], options);
  frame();
  const survivorMeshes = []; parent.traverse(o => { if (o.isInstancedMesh) survivorMeshes.push(o); });
  const sharedGeometry = new Set(survivorMeshes.map(o => o.geometry)), sharedMaterial = new Set(survivorMeshes.map(o => o.material));
  let sharedDisposals = 0;
  for (const resource of [...sharedGeometry, ...sharedMaterial]) resource.addEventListener('dispose', () => sharedDisposals++);
  const survivors = parent.children.length, subscriptions = ctx.shared.peopleAvnet.meshes.length;
  let released = 0;
  for (let cycle = 0; cycle < 40; cycle++) {
    const near = kit.crowd(parent, [[0, 0, 0], [3, 0, 0]], options), h = near.userData.crowd;
    frame();
    const meshes = []; for (const g of [h.lod.near, h.lod.mid, h.lod.far]) g.traverse(o => { if (o.isInstancedMesh) meshes.push(o); });
    let disposed = 0; for (const mesh of meshes) mesh.addEventListener('dispose', () => disposed++);
    assert.equal(ctx.shared.peopleAvnet.meshes.length, subscriptions + 2);
    h.dispose(); h.dispose(); // repeated cleanup is harmless
    assert.equal(disposed, meshes.length, 'every attached crowd instance buffer must be released exactly once');
    assert.equal(parent.children.length, survivors, 'all four LOD/anchor siblings must be removed');
    assert.equal(ctx.shared.peopleAvnet.meshes.length, subscriptions, 'disposed sash meshes must be unsubscribed');
    assert.equal(sharedDisposals, 0, 'surviving crowds still use the shared geometry and materials');
    T.reset(); frame();
    assert.equal(T.work(), 1, 'only the surviving crowd may perform a LOD distance check');
    released += disposed;
  }
  survivor.userData.crowd.dispose(); T.reset(); frame();
  assert.equal(T.work(), 0, 'disposing the last crowd must remove all LOD work');
  assert.equal(ctx.shared.peopleAvnet.meshes.length, 0);
  console.log(JSON.stringify({ lifecycle: { rebuildCycles: 40, releasedInstanceMeshes: released, retainedSashSubscriptions: 0, disposedSharedResources: sharedDisposals } }));
}
