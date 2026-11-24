// Actual Shiloach construction, vendored Three.js and the upstream baseline. Canvas drawing is stubbed:
// this checks every expanded geometry/material/transform and animated water state, not rendered pixels or FPS.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildModel, snapshot, compare } from './perf-geometry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Keep the reference reachable from upstream even when this PR is squash-merged.
const baselineRef = '695456732c1d93db67268d13b7367cca76783aee';
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const original = f => execFileSync('git', ['show', baselineRef + ':' + f], { cwd: root, encoding: 'utf8' });
const oldSpring = original('shared/frag/shiloach.js');
const oldParallels = original('src/59-parallels.js'), newParallels = read('src/59-parallels.js');
const mergeText = source => source.slice(source.indexOf('const mergeStatic = '), source.indexOf('      const buildSpring = '));
const noop = () => {};
function documentStub() {
  return { createElement: () => {
    const cv = { width: 0, height: 0 }, gradient = { addColorStop: noop };
    const ctx = new Proxy({ canvas: cv, createLinearGradient: () => gradient, createRadialGradient: () => gradient,
      createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
      getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }) }, { get: (o, k) => k in o ? o[k] : noop });
    cv.getContext = () => ctx; return cv;
  } };
}
function load(source, mergeSource) {
  return vm.runInNewContext(read('shared/00-lib.js') + source + mergeText(mergeSource) + `
    return { ...three_module_exports, build: tm_shiloach, mergeStatic };
  })(); OtzariaPlugin;`, { window: { performance }, performance, document: documentStub(), console, Uint8ClampedArray });
}
const old = load(oldSpring, oldParallels), now = load(read('shared/frag/shiloach.js'), newParallels);
function build(T, options) {
  const scene = new T.Scene(), root = new T.Group(); scene.add(root);
  const ctx = { THREE: T, scene, root };
  return { ctx, kit: T.build(ctx, { ground: (x, z) => -3 + 0.025 * x - 0.015 * z, ...options }) };
}
function counts(model) {
  const result = snapshot(model.ctx).counters;
  let triangles = 0;
  model.kit.G.traverse(o => { if (o.isMesh) triangles += (o.isInstancedMesh ? o.count : 1) * (o.geometry.index?.count || o.geometry.attributes.position.count) / 3; });
  return { ...result, triangles };
}
// Exactly the first house's published channel clearance, before batching; plant deletion must remain per component.
function clearChannel(kit) {
  const removed = [];
  kit.G.traverse(o => {
    if (!o.isMesh || !o.geometry) return;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    const r = o.geometry.boundingSphere.radius * Math.max(o.scale.x, o.scale.y, o.scale.z), p = o.position;
    if (r <= 2.2 && Math.abs(p.x - 4) < 1.5 && p.z < -2.4 && p.z > -50.9 - 1.2) removed.push(o);
  });
  for (const o of removed) o.removeFromParent();
  return removed.length;
}
function mergedShadowPolicy(group) {
  // Existing first-house merge preserves geometry/material but sets receivesShadow on each material with >=3 meshes.
  const by = new Map();
  for (const o of group.children) if (o.isMesh && !o.material.transparent) { if (!by.has(o.material)) by.set(o.material, []); by.get(o.material).push(o); }
  for (const list of by.values()) if (list.length >= 3) for (const o of list) o.receiveShadow = true;
}
const cases = [
  { name: 'second-house-spring', options: { x: 0, z: 0, mouthY: 0, seed: 5507, lake: { dx: 2, dz: -1.9, rx: 3.2, rz: 2.3 } } },
  { name: 'first-house-channel', first: true, options: { x: 14, z: 972, yaw: -0.6435, mouthY: -14, seed: 4706, pool: { dx: 3.6, dz: -55.2, w: 14, d: 9 } } },
  { name: 'small-basin-scaled', options: { x: 30, z: -40, yaw: 0.72, scale: 1.4, mouthY: 3, seed: 42, lake: false } }
];
const results = [];
for (const test of cases) {
  const before = build(old, test.options), after = build(now, test.options);
  let cleared = 0;
  if (test.first) { cleared = clearChannel(before.kit); assert.equal(clearChannel(after.kit), cleared); }
  compare(snapshot(before.ctx), snapshot(after.ctx), test.name + '/unbatched');
  const baselineRaw = counts(before);
  // Preserve and compare the original live component records. The old first-house postpass then bakes those same transforms
  // into duplicated vertex buffers; compare its counts separately, because that aggregate geometry has no per-leaf records.
  if (test.first) mergedShadowPolicy(before.kit.G);
  const componentsBefore = snapshot(before.ctx);
  after.kit.batchPlants(!!test.first);
  const validation = compare(componentsBefore, snapshot(after.ctx), test.name + '/expanded');
  const candidateBatched = counts(after);
  const childCount = after.kit.G.children.length;
  after.kit.batchPlants(!!test.first);
  assert.equal(after.kit.G.children.length, childCount, 'finalizing twice must not create duplicate batches');
  for (const t of [0, 1.25, 9]) {
    before.kit.tick(t); after.kit.tick(t);
    before.kit.setBottom(-5 + t / 10); after.kit.setBottom(-5 + t / 10);
    before.kit.setLit(t ? 1 : 0); after.kit.setLit(t ? 1 : 0);
    compare(snapshot(before.ctx), snapshot(after.ctx), test.name + '/water-' + t);
  }
  // Baseline/source and candidate use their actual merge implementations. New instances must survive that postpass intact.
  if (test.first) { old.mergeStatic(before.kit.G); now.mergeStatic(after.kit.G); }
  const finalBefore = counts(before), finalAfter = counts(after);
  assert.equal(finalAfter.triangles, finalBefore.triangles, 'no leaf or bush triangle may be dropped by the merge postpass');
  if (!test.first) assert(finalAfter.meshes < finalBefore.meshes / 2, 'substantially reduce spring mesh submissions');
  else assert(finalAfter.geometryBytes + finalAfter.instanceBytes < finalBefore.geometryBytes, 'avoid duplicated foliage vertex buffers');
  // Exported world-space foliage helpers can still add plants. Finalizing new plants preserves existing batches.
  let lateValidation = null;
  if (!test.first) {
    before.kit.clump(20, 2, -10, 1.1); after.kit.clump(20, 2, -10, 1.1);
    before.kit.bush(-4, -2, 5, 0.9); after.kit.bush(-4, -2, 5, 0.9);
    lateValidation = compare(snapshot(before.ctx), snapshot(after.ctx), test.name + '/late-helpers');
    after.kit.batchPlants();
    compare(snapshot(before.ctx), snapshot(after.ctx), test.name + '/late-batched');
  }
  results.push({ name: test.name, cleared, baselineRaw, candidateBatched, baselineFinal: finalBefore, candidateFinal: finalAfter, validation, lateValidation });
}
// Exercise both real callers, including the first house's channel cleanup + opaque merge. A missing call or a merger that
// treats an InstancedMesh as an ordinary Mesh would pass isolated-kit checks but silently drop or fail to batch plants.
const integrations = [];
for (const house of ['rishon', 'sheni']) {
  const ctx = await buildModel(house, root);
  let kit;
  if (house === 'rishon') kit = ctx.shared.shiloachDemo1.spring()?.kit;
  else { ctx.shared.shiloach.at(0); kit = ctx.shared.shiloach.kit(); }
  assert(kit, house + ': public spring demonstration must construct its spring');
  const batches = kit.G.children.filter(o => o.isInstancedMesh);
  assert.equal(batches.length, 5, house + ': both real callers must preserve all five plant batches');
  assert(batches.every(o => o.count > 1 && o.userData.noPick && !o.material.transparent && o.boundingSphere?.radius > 0));
  integrations.push({ house, plantBatches: batches.length, plantComponents: batches.reduce((n, o) => n + o.count, 0) });
}
console.log(JSON.stringify({ baseline: baselineRef, note: 'Model/resource counts only; all foliage retained. Float32 instance transforms use the existing 2e-5-amah tolerance. First-house postmerge material/shadow policy preserved.', results, integrations }, null, 2));
