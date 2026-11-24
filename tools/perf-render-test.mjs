// Real Three.js regression tests; no browser or downloaded test dependency required.
// node tools/perf-render-test.mjs [--benchmark]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');
const library = read('shared/00-lib.js');
const helper = read('shared/frag/raycast-bounds.js');
// Load the exact vendored renderer version and the actual source fragment together.
const T = new Function('window', library + helper + '\nreturn { ...three_module_exports, makeRaycast: ent_makeRaycast, pickable: ent_pickable };})(); return OtzariaPlugin;')({ performance });
const { Group, Scene, Mesh, InstancedMesh, BoxGeometry, PlaneGeometry, BufferGeometry, BufferAttribute, Float32BufferAttribute, InterleavedBuffer, InterleavedBufferAttribute,
  MeshBasicMaterial, ShaderMaterial, Matrix4, Vector3, Raycaster, DoubleSide, FrontSide, Plane, DirectionalLight } = T;
const mat = new MeshBasicMaterial({ side: DoubleSide });
let passed = 0;
const check = (name, fn) => { fn(); passed++; console.log('PASS ' + name); };
const summary = (hits) => hits.map((h) => ({ object: h.object.id, instance: h.instanceId, face: h.faceIndex, distance: h.distance, point: h.point.toArray() }));
const compare = (cast, ray, objects) => {
  const expected = ray.intersectObjects(objects, false);
  const actual = cast(ray, objects);
  assert.deepEqual(summary(actual), summary(expected));
  assert.deepEqual(summary([cast.first(ray, objects)].filter(Boolean)), summary(expected.slice(0, 1)));
  return actual;
};
const down = (x, z, y = 100) => new Raycaster(new Vector3(x, y, z), new Vector3(0, -1, 0), 0, 200);

check('exact hit identity, triangle, distance, ordering and near/far/layers', () => {
  const a = new Mesh(new BoxGeometry(8, 2, 8), mat), b = a.clone(), c = a.clone();
  b.position.y = 5; c.layers.set(2);
  const objects = [a, b, c], cast = T.makeRaycast(), ray = down(0, 0);
  for (const o of objects) o.updateMatrixWorld();
  assert.ok(compare(cast, ray, objects).length);
  ray.near = 96; ray.far = 102;
  compare(cast, ray, objects);
  ray.layers.set(2);
  compare(cast, ray, objects);
  compare(cast, down(50, 50), objects);
});

check('moving and rotating parents, nonuniform/negative scale and boundary hits', () => {
  const parent = new Group(), mesh = new Mesh(new BoxGeometry(6, 2, 4), mat), cast = T.makeRaycast();
  parent.add(mesh); parent.updateMatrixWorld(true);
  compare(cast, down(3, 2), [mesh]);
  parent.position.set(20, 7, -15); parent.rotation.set(0.2, 0.7, -0.1); parent.scale.set(-2, 3, 0.5);
  parent.updateMatrixWorld(true);
  assert.ok(compare(cast, down(20, -15), [mesh]).length);
  compare(cast, down(0, 0), [mesh]);
});

check('geometry edits, replacement attributes and replacement geometry invalidate bounds', () => {
  const mesh = new Mesh(new BoxGeometry(2, 2, 2), mat), cast = T.makeRaycast();
  mesh.updateMatrixWorld(); compare(cast, down(0, 0), [mesh]);
  let p = mesh.geometry.attributes.position;
  for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + 20);
  p.needsUpdate = true; mesh.geometry.computeBoundingSphere();
  assert.ok(compare(cast, down(20, 0), [mesh]).length);
  p = new Float32BufferAttribute(p.array.slice(), 3);
  for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + 12);
  mesh.geometry.setAttribute('position', p); mesh.geometry.computeBoundingSphere();
  assert.ok(compare(cast, down(20, 12), [mesh]).length);
  mesh.geometry = new BoxGeometry(4, 4, 4);
  assert.ok(compare(cast, down(0, 0), [mesh]).length);
});

check('interleaved position buffer versions invalidate bounds', () => {
  const geometry = new BoxGeometry(2, 2, 2), source = geometry.attributes.position;
  const buffer = new InterleavedBuffer(new Float32Array(source.count * 4), 4);
  const p = new InterleavedBufferAttribute(buffer, 3, 0);
  for (let i = 0; i < source.count; i++) p.setXYZ(i, source.getX(i), source.getY(i), source.getZ(i));
  geometry.setAttribute('position', p);
  const mesh = new Mesh(geometry, mat), cast = T.makeRaycast(); mesh.updateMatrixWorld();
  compare(cast, down(0, 0), [mesh]);
  for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + 8);
  buffer.needsUpdate = true; geometry.computeBoundingSphere();
  assert.ok(compare(cast, down(8, 0), [mesh]).length);
});

check('instance transforms, instance buffer replacement, count and geometry invalidation', () => {
  const mesh = new InstancedMesh(new BoxGeometry(2, 2, 2), mat, 3), cast = T.makeRaycast(), matrix = new Matrix4();
  for (let i = 0; i < 3; i++) mesh.setMatrixAt(i, matrix.makeTranslation(i * 5, 0, 0));
  mesh.instanceMatrix.needsUpdate = true; mesh.updateMatrixWorld();
  compare(cast, down(0, 0), [mesh]);
  mesh.setMatrixAt(0, matrix.makeTranslation(40, 0, 0));
  mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere();
  assert.ok(compare(cast, down(40, 0), [mesh]).length);
  mesh.count = 0; mesh.computeBoundingSphere(); compare(cast, down(40, 0), [mesh]);
  mesh.count = 3; mesh.instanceMatrix = mesh.instanceMatrix.clone();
  mesh.setMatrixAt(0, matrix.makeTranslation(-40, 0, 0));
  mesh.computeBoundingSphere(); assert.ok(compare(cast, down(-40, 0), [mesh]).length);
  mesh.geometry = new BoxGeometry(2, 2, 20); mesh.computeBoundingSphere();
  assert.ok(compare(cast, down(-40, 8), [mesh]).length);
  mesh.position.z = 10; mesh.updateMatrixWorld();
  assert.ok(compare(cast, down(-40, 18), [mesh]).length);
});

check('custom raycasts, morph targets and invalid bounds safely use Three.js', () => {
  const mesh = new Mesh(new BoxGeometry(1, 1, 1), mat), cast = T.makeRaycast(); mesh.updateMatrixWorld();
  mesh.raycast = (_ray, hits) => hits.push({ object: mesh, distance: 1, point: new Vector3(50, 99, 50) });
  assert.equal(compare(cast, down(50, 50), [mesh]).length, 1);
  const morph = new Mesh(new BoxGeometry(2, 2, 2), mat);
  morph.geometry.morphAttributes.position = [morph.geometry.attributes.position.clone()];
  morph.updateMorphTargets(); morph.updateMatrixWorld();
  compare(cast, down(0, 0), [morph]);
  const invalid = new Mesh(new BoxGeometry(2, 2, 2), mat);
  invalid.geometry.attributes.position.setX(0, NaN); invalid.updateMatrixWorld();
  const warn = console.error; console.error = () => {};
  try { compare(cast, down(50, 50), [invalid]); } finally { console.error = warn; }
});

check('faded, clipped, transparent and material-array solids retain exact picking behavior', () => {
  const materials = Array.from({ length: 6 }, () => mat.clone());
  materials[0].transparent = true; materials[0].opacity = 0.1;
  materials[1].clippingPlanes = [new Plane(new Vector3(0, 1, 0), -5)];
  const mesh = new Mesh(new BoxGeometry(4, 2, 4), materials), cast = T.makeRaycast(); mesh.updateMatrixWorld();
  assert.ok(compare(cast, down(0, 0), [mesh]).length);
  mesh.material = mat.clone(); mesh.material.side = FrontSide;
  compare(cast, down(0, 0), [mesh]);
});

check('deterministic mixed scene: 400 exact ray equivalence checks', () => {
  let seed = 73491;
  const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 | 0) >>> 0) / 4294967296;
  const objects = [], cast = T.makeRaycast();
  for (let i = 0; i < 70; i++) {
    const mesh = new Mesh(new BoxGeometry(random() * 20 + 0.2, random() * 15 + 0.1, random() * 20 + 0.2), mat);
    mesh.position.set(random() * 120 - 60, random() * 20, random() * 120 - 60);
    mesh.rotation.set(random(), random(), random()); mesh.scale.set(random() + 0.1, random() + 0.1, random() + 0.1);
    mesh.updateMatrixWorld(); objects.push(mesh);
  }
  for (let i = 0; i < 400; i++) {
    const origin = new Vector3(random() * 140 - 70, random() * 100, random() * 140 - 70);
    const dir = new Vector3(random() - 0.5, random() - 1, random() - 0.5).normalize();
    compare(cast, new Raycaster(origin, dir, random() * 2, random() * 200), objects);
  }
});

const oldPick = (scene, ray) => ray.intersectObjects(scene.children, true).filter((h) => {
  const o = h.object;
  if (!o.isMesh || o.isSprite || o.userData.noPick) return false;
  for (let p = o; p; p = p.parent) if (!p.visible || p.name === 'labels') return false;
  const m = Array.isArray(o.material) ? o.material[0] : o.material;
  return !!m && !(m.uniforms && m.uniforms.sunPosition) && !(m.transparent && m.opacity < 0.5) && m.visible !== false;
});
check('zoom prefilter preserves results through hidden, fading, noPick and label changes', () => {
  const scene = new Scene(), hidden = new Group(), labels = new Group(), cast = T.makeRaycast();
  labels.name = 'labels'; hidden.visible = false; scene.add(hidden, labels);
  const add = (parent, y, material = mat) => { const o = new Mesh(new BoxGeometry(4, 1, 4), material); o.position.y = y; parent.add(o); return o; };
  add(hidden, 10); add(labels, 20);
  const solid = add(scene, 0), ignored = add(scene, 15); ignored.userData.noPick = true;
  const glass = add(scene, 8, mat.clone()); glass.material.transparent = true; glass.material.opacity = 0.1;
  const sky = add(scene, 50, new ShaderMaterial({ uniforms: { sunPosition: { value: new Vector3() } } }));
  const array = add(scene, 4, [glass.material, mat, mat, mat, mat, mat]);
  const compareZoom = () => { scene.updateMatrixWorld(true); const ray = down(0, 0); assert.deepEqual(summary(cast(ray, T.pickable(scene))), summary(oldPick(scene, ray))); };
  compareZoom();
  hidden.visible = true; compareZoom();
  glass.material.opacity = 0.8; compareZoom();
  array.material = [mat, glass.material, mat, mat, mat, mat]; compareZoom();
  solid.visible = false; compareZoom();
  ignored.userData.noPick = false; compareZoom();
  labels.name = ''; compareZoom();
  sky.material = mat; compareZoom();
  scene.visible = false; compareZoom();
});

check('hidden detail geometry never reaches the exact zoom raycast', () => {
  const scene = new Scene(), hidden = new Group(); hidden.visible = false; scene.add(hidden);
  for (let i = 0; i < 120; i++) hidden.add(new Mesh(new BoxGeometry(4, 1, 4), mat));
  const visible = new Mesh(new BoxGeometry(4, 1, 4), mat); scene.add(visible); scene.updateMatrixWorld(true);
  const ray = down(0, 0), cast = T.makeRaycast(), original = Mesh.prototype._computeIntersections;
  let oldTests = 0, newTests = 0;
  Mesh.prototype._computeIntersections = function (...args) { oldTests++; return original.apply(this, args); };
  oldPick(scene, ray);
  Mesh.prototype._computeIntersections = function (...args) { newTests++; return original.apply(this, args); };
  try { cast(ray, T.pickable(scene)); } finally { Mesh.prototype._computeIntersections = original; }
  assert.equal(oldTests, 121); assert.equal(newTests, 1);
});

check('nearest floor skips dense terrain behind it and keeps exact edge hits', () => {
  const terrain = new Mesh(new PlaneGeometry(5200, 5200, 220, 220).rotateX(-Math.PI / 2), mat);
  terrain.position.y = -28;
  const floor = new Mesh(new BoxGeometry(20, 1, 20), mat), objects = [terrain, floor], cast = T.makeRaycast();
  for (const o of objects) o.updateMatrixWorld();
  const ray = down(0, 0);
  compare(cast, ray, objects);
  const original = Mesh.prototype._computeIntersections;
  let terrainTests = 0;
  Mesh.prototype._computeIntersections = function (...args) { if (this === terrain) terrainTests++; return original.apply(this, args); };
  try {
    assert.equal(cast.first(ray, objects).object, floor);
    assert.equal(terrainTests, 0);
    assert.equal(cast.first(down(50, 50), objects).object, terrain);
    assert.equal(terrainTests, 1);
  } finally { Mesh.prototype._computeIntersections = original; }
  compare(cast, down(10, 10), objects);
  compare(cast, new Raycaster(new Vector3(0, 0, 0), new Vector3(0, -1, 0), 0, 100), objects);
});

check('nearest ties keep input order even when broad-phase box order differs', () => {
  const flat = new BufferGeometry().setAttribute('position', new Float32BufferAttribute([-2, 0, -2, 2, 0, -2, 0, 0, 2], 3));
  const tall = new BufferGeometry().setAttribute('position', new Float32BufferAttribute([
    -2, 0, -2, 2, 0, -2, 0, 0, 2, 90, 90, 90, 92, 90, 90, 90, 90, 92
  ], 3));
  const a = new Mesh(flat, mat), b = new Mesh(tall, mat), cast = T.makeRaycast(), ray = down(0, 0);
  a.updateMatrixWorld(); b.updateMatrixWorld();
  assert.equal(compare(cast, ray, [a, b])[0].object, a);
  assert.equal(compare(cast, ray, [b, a])[0].object, b);
});

check('indoor orbit prefilter preserves camera corrections and never raycasts unmarked terrain', () => {
  const source = read('shared/90-entry.js');
  const section = source.slice(source.indexOf('  var cam_in = '), source.indexOf('  function cam_decideSoon('));
  assert(section.includes('ent_intersect(ray, walls)'), 'room-surface prefilter is required');
  const terrain = new Mesh(new PlaneGeometry(5200, 5200, 220, 220).rotateX(-Math.PI / 2), mat);
  terrain.geometry.attributes.position.setY(0, 100); // a distant hill makes the global terrain box overlap indoor rays
  terrain.geometry.attributes.position.needsUpdate = true;
  const wall = new Mesh(new BoxGeometry(0.5, 12, 20), mat); wall.position.set(5, 6, 0); wall.userData.tmPass = true;
  const ignored = new Mesh(new BoxGeometry(0.5, 12, 20), mat); ignored.position.set(2, 6, 0);
  const lowFloor = new Mesh(new BoxGeometry(20, 0.2, 20), mat); lowFloor.position.y = 4.5; lowFloor.userData.tmPass = true;
  const objects = [terrain, ignored, lowFloor, wall];
  for (const o of objects) o.updateMatrixWorld();
  const make = (filtered) => new Function('T', 'objects',
    'const {Vector3,Raycaster,Box3}=T;const camera={},cam={},ent_sec={on:false};const ent_solids=()=>objects,ent_intersect=T.makeRaycast();\n' +
    (filtered ? section : section.replace('ent_intersect(ray, walls)', 'ent_intersect(ray, ent_solids(false))')) +
    '\nreturn {keep:cam_keepInside,section:ent_sec};')(T, objects);
  const before = make(false), after = make(true), q = new Vector3(0, 5, 0), p = new Vector3(10, 10, 0);
  const compareGuard = (eye = p, target = q) => {
    const a = eye.clone(), b = eye.clone(); before.keep(a, target); after.keep(b, target);
    assert.deepEqual(a.toArray(), b.toArray()); return b;
  };
  assert(compareGuard().x < 5, 'wall must constrain the eye');
  for (const axis of ['x', 'y', 'z']) {
    before.section.on = after.section.on = true;
    before.section.axis = after.section.axis = axis;
    before.section.v = after.section.v = q[axis];
    compareGuard();
  }
  before.section.on = after.section.on = false;
  wall.userData.tmPass = false; compareGuard();
  wall.userData.tmPass = true; ignored.userData.tmPass = true; compareGuard();
  ignored.userData.tmPass = false;
  wall.material = mat.clone(); wall.material.transparent = true; wall.material.opacity = 0.1; compareGuard();
  compareGuard(new Vector3(5.5, 6, 0), new Vector3(4.5, 6, 0));
  compareGuard(new Vector3(0, 5.1, 0), q);
  const original = Mesh.prototype._computeIntersections;
  let terrainTests = 0;
  Mesh.prototype._computeIntersections = function (...args) { if (this === terrain) terrainTests++; return original.apply(this, args); };
  try {
    before.keep(p.clone(), q); assert.equal(terrainTests, 1);
    after.keep(p.clone(), q); assert.equal(terrainTests, 1, 'filtered guard must not intersect the terrain');
  } finally { Mesh.prototype._computeIntersections = original; }
});

check('bridge lets loading finish, holds hidden ready frames and resumes once', () => {
  let ready = false, mutation, next = 0;
  const events = new Map(), callbacks = [], parent = { postMessage() {} };
  const window = { name: 'tm-house:rishon:web', parent, focus() {}, requestAnimationFrame(cb) { callbacks.push(cb); return ++next; },
    addEventListener(type, cb) { events.set(type, cb); }, dispatchEvent() {} };
  const document = { documentElement: { classList: { contains: () => ready } }, body: null, addEventListener() {} };
  vm.runInNewContext(read('unified/house-bridge.js'), { window, document, console, Event, CustomEvent: Event,
    MutationObserver: class { constructor(cb) { mutation = cb; } observe() {} }, setInterval() {}, setTimeout });
  const visible = (v) => events.get('message')({ source: parent, data: { tm: 'visible', visible: v } });
  let calls = 0;
  visible(false); assert.equal(window.__tmHouseVisible, true);
  window.requestAnimationFrame(() => calls++); callbacks.shift()(1); assert.equal(calls, 1);
  ready = true; mutation(); assert.equal(window.__tmHouseVisible, false);
  window.requestAnimationFrame(() => calls++); callbacks.shift()(2); assert.equal(calls, 1);
  visible(true); assert.equal(window.__tmHouseVisible, true); assert.equal(callbacks.length, 1);
  callbacks.shift()(3); assert.equal(calls, 2);
  visible(true); assert.equal(callbacks.length, 0);
  visible(false); visible(true); assert.equal(callbacks.length, 0);
});

check('animation loop never renders or runs scene work for a hidden document/house', () => {
  const source = read('shared/90-entry.js');
  const section = source.slice(source.indexOf('  function ent_isVisible()'), source.indexOf('  // the view follows the window:'));
  let frame, renders = 0, work = 0;
  const document = { hidden: false }, window = {}, noop = () => {};
  const sandbox = { document, window, renderer: { setAnimationLoop: (fn) => { frame = fn; }, render: () => renders++ },
    ent_load: { loading: false, printed: true }, flyAnim: null, cam: {}, ent_hq: { frame: () => work++ }, ctx: { animated: [() => work++] },
    ent_damp: noop, ent_zoomStep: noop, ent_liftStep: noop, ent_walkStep: noop, cam_update: noop, guardCamera: noop, cam_nearStep: noop,
    scene: {}, camera: {}, performance, setInterval: () => assert.fail('background rendering timer must not be installed') };
  vm.runInNewContext(section, sandbox);
  frame(0); assert.equal(renders, 1); assert.equal(work, 2);
  document.hidden = true;
  for (let i = 0; i < 20; i++) frame(i * 250);
  assert.equal(renders, 1); assert.equal(work, 2);
  document.hidden = false; window.__tmHouseVisible = false; frame(6000);
  assert.equal(renders, 1); assert.equal(work, 2);
  window.__tmHouseVisible = true; frame(6100);
  assert.equal(renders, 2); assert.equal(work, 4);
  sandbox.ent_load.loading = true; frame(6200); assert.equal(renders, 2);
});

check('shadow cache redraws on movement, geometry, visibility, instances and clipping', () => {
  const source = read('shared/90-entry.js');
  const section = source.slice(source.indexOf('  var shc = '), source.indexOf('  renderer.domElement.addEventListener("webglcontextrestored"'));
  const scene = new Scene(), sun = new DirectionalLight(), mesh = new Mesh(new BoxGeometry(), mat);
  sun.shadow.map = {}; mesh.castShadow = true; scene.add(mesh); scene.updateMatrixWorld(true);
  let draws = 0;
  const renderer = { shadowMap: { enabled: true, render() { draws++; } }, localClippingEnabled: false };
  const sandbox = { scene, renderer, Float64Array, Math, ent_sec: { on: false }, Array };
  vm.runInNewContext(section, sandbox);
  const render = () => renderer.shadowMap.render([sun], scene, {});
  render(); render(); render(); assert.equal(draws, 2);
  const changes = [
    () => { mesh.position.x = 4; scene.updateMatrixWorld(true); },
    () => { mesh.geometry.attributes.position.needsUpdate = true; },
    () => { mesh.visible = false; },
    () => { mesh.visible = true; },
    () => { mesh.material = mat.clone(); },
    () => { sandbox.ent_sec = { on: true, axis: 'z', v: 4 }; },
    () => { sun.shadow.camera.left -= 5; }
  ];
  for (const change of changes) { const n = draws; change(); render(); render(); render(); assert.equal(draws, n + 2); }
});

check('clipping follows newly added/replaced materials without per-object wrapper arrays', () => {
  const source = read('shared/90-entry.js');
  const section = source.slice(source.indexOf('  var ent_sec = '), source.indexOf('  function ent_sectionSet('));
  const group = new Group(), a = new Mesh(new BoxGeometry(), mat.clone()), b = new Mesh(new BoxGeometry(), [mat.clone(), mat.clone()]);
  group.add(a, b);
  const sandbox = { ctx: { root: group }, Plane, Vector3, Map, Array, FrontSide, DoubleSide };
  vm.runInNewContext(section, sandbox); sandbox.ent_sec.on = true; sandbox.ent_sectionApply();
  assert.equal(a.material.clippingPlanes[0], sandbox.ent_sec.plane);
  for (const m of b.material) assert.equal(m.clippingPlanes[0], sandbox.ent_sec.plane);
  a.material = mat.clone(); sandbox.ent_sectionApply(); assert.equal(a.material.clippingPlanes[0], sandbox.ent_sec.plane);
  const c = new Mesh(new BoxGeometry(), mat.clone()); group.add(c); sandbox.ent_sectionApply();
  assert.equal(c.material.clippingPlanes[0], sandbox.ent_sec.plane);
});

if (process.argv.includes('--benchmark')) {
  // A deterministic thin-wall workload: every broad sphere intersects the ray, while
  // the exact wall boxes do not. Times describe this workload, not whole-app FPS.
  const objects = [], cast = T.makeRaycast(), ray = down(0, 0);
  const geometry = new BoxGeometry(300, 0.25, 0.25, 96, 1, 1);
  for (let i = 0; i < 120; i++) {
    const mesh = new Mesh(geometry, mat); mesh.position.z = 1 + i * 0.4; mesh.updateMatrixWorld(); objects.push(mesh);
  }
  compare(cast, ray, objects); // Warm both paths, including bounds and JIT.
  const times = (fn) => {
    const samples = [];
    for (let i = 0; i < 7; i++) { const t = performance.now(); for (let j = 0; j < 12; j++) fn(); samples.push((performance.now() - t) / 12); }
    samples.sort((a, b) => a - b); return samples[3];
  };
  const before = times(() => ray.intersectObjects(objects, false)), after = times(() => cast(ray, objects));
  console.log(JSON.stringify({ benchmark: '120 thin wall meshes, 96 segments each; median ms per exact downward query',
    beforeMs: before, afterMs: after, speedup: before / after, exactMeshTestsBefore: 120, exactMeshTestsAfter: 0 }, null, 2));
}
console.log(`\n${passed} render/picking regression groups passed (Three.js r${T.REVISION}).`);
