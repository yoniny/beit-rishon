// Real model regression: switching Beit HaMoked's gate reading relocates one officer, without retaining prior figures,
// crowd subscriptions or the replaced marker's private cylinder geometry.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildModel } from './perf-geometry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = await buildModel('sheni', root), { features, mokedGates, peopleAvnet } = ctx.shared;
features.memunim.on();
const group = ctx.layers.memunim, subscriptions = peopleAvnet.meshes.length;
const counts = () => {
  let objects = 0, meshes = 0, components = 0;
  group.traverse(o => { objects++; if (o.isMesh) { meshes++; components += o.isInstancedMesh ? o.count : 1; } });
  return { objects, meshes, components };
};
const initial = counts(), labels = ctx.labels.length, states = new Map();
let releasedInstances = 0, releasedRods = 0;
for (let cycle = 0; cycle < 40; cycle++) {
  let oldHandle = null;
  for (const child of group.children) if (child.userData.crowd && child.children.some(o => o.name === 'memuneh7')) oldHandle = child.userData.crowd;
  assert(oldHandle, 'the herald must have one crowd handle');
  const oldInstances = [];
  for (const g of [oldHandle.lod.near, oldHandle.lod.mid, oldHandle.lod.far]) g.traverse(o => { if (o.isInstancedMesh) oldInstances.push(o); });
  let instances = 0, rods = 0, sharedDisposals = 0;
  for (const instance of oldInstances) instance.addEventListener('dispose', () => instances++);
  // Every marker rod is a private geometry directly in MG; discs share one geometry. A switch must dispose exactly one rod.
  const geometries = new Set(), materials = new Set();
  group.traverse(o => { if (o.isMesh) { geometries.add(o.geometry); materials.add(o.material); } });
  const rodGeometries = new Set(group.children.filter(o => o.isMesh && o.geometry.parameters?.radiusTop === 0.1).map(o => o.geometry));
  for (const g of geometries) g.addEventListener('dispose', () => { if (rodGeometries.has(g)) rods++; else sharedDisposals++; });
  for (const m of materials) m.addEventListener('dispose', () => sharedDisposals++);
  const mode = cycle % 2 ? 'opposite' : 'adjacent'; mokedGates.set(mode);
  assert.equal(instances, oldInstances.length, 'release all outgoing officer instance buffers');
  assert.equal(rods, 1, 'release the old marker rod geometry');
  assert.equal(sharedDisposals, 0, 'shared crowd/marker assets must remain live');
  assert.equal(peopleAvnet.meshes.length, subscriptions, 'sash subscriptions must remain bounded');
  assert.deepEqual(counts(), initial, 'gate switches must not add duplicate officers or markers');
  assert.equal(ctx.labels.length, labels, 'move the existing labels');
  const handle = group.children.find(o => o.userData.crowd && o.children.some(m => m.name === 'memuneh7')).userData.crowd;
  const anchor = handle.lod.anchor.position.toArray();
  assert.deepEqual(Array.from(anchor), mode === 'adjacent' ? [1.4, 13.5, -73.3] : [-15.5, 13.5, -78.9], 'officer follows the selected gate');
  if (states.has(mode)) assert.deepEqual(anchor, states.get(mode)); else states.set(mode, anchor);
  mokedGates.set(mode); assert.deepEqual(counts(), initial, 'reapplying the same mode must do no rebuilding');
  releasedInstances += instances; releasedRods += rods;
}
features.memunim.off();
console.log(JSON.stringify({ officerLifecycle: { transitions: 40, releasedInstances, releasedRods, retainedSashSubscriptions: subscriptions, initial, final: counts(), labels } }, null, 2));
