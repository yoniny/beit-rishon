// Real model regression: configuration and cleanup of hidden lamps must not allocate their cached models.
// Once shown, all four historical readings and demonstration controls still work, and their caches remain bounded.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildModel } from './perf-geometry.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = await buildModel('sheni', root);
const counts = () => {
  let objects = 0, meshes = 0;
  const geometries = new Set(), materials = new Set();
  ctx.scene.traverse(o => { objects++; if (o.isMesh) { meshes++; geometries.add(o.geometry); materials.add(o.material); } });
  return { objects, meshes, geometries: geometries.size, materials: materials.size };
};
const { simchaLamps: lamps, simchaDemo: demo, harRoof: roof, features } = ctx.shared;
const feature = features.simchaMenorot;
const initial = counts();
for (let i = 0; i < 40; i++) {
  roof.set(i % 2 ? 'kanievsky' : 'all');
  lamps.set({ form: i % 4 < 2 ? 'rashi' : 'ty' });
  feature.off(); demo.stop(); demo.clear();
}
assert.deepEqual(counts(), initial, 'hidden configuration/cleanup built lamp geometry');
assert.equal(feature.isOn(), false);
assert.equal(demo.running(), false);

const states = [];
for (const at of ['mid', 'corner']) for (const form of ['rashi', 'ty']) {
  lamps.set({ at, form }); feature.on();
  assert.equal(feature.isOn(), true);
  const group = ctx.layers[`simchaSet_${at}_${form}`];
  assert(group.visible && group.children.length > 0, 'selected lamp reading was not built');
  for (const a of ['mid', 'corner']) for (const f of ['rashi', 'ty']) {
    assert.equal(ctx.layers[`simchaSet_${a}_${f}`].visible, a === at && f === form, 'stale lamp reading stayed visible');
  }
  demo.start(); assert.equal(demo.running(), true);
  demo.pause(); assert.equal(demo.paused(), true);
  demo.resume(); assert.equal(demo.paused(), false);
  demo.drive(12.5); demo.drive(15); // pouring and lit poses; real figure transforms execute
  demo.stop(); assert.equal(demo.running(), false);
  feature.off(); assert.equal(feature.isOn(), false);
  states.push({ at, form, ...counts() });
}
const warm = counts();
for (let i = 0; i < 40; i++) {
  lamps.set({ at: i % 2 ? 'corner' : 'mid', form: i % 4 < 2 ? 'rashi' : 'ty' });
  feature.on(); demo.start(); demo.pause(); demo.resume(); demo.stop(); feature.off();
}
assert.deepEqual(counts(), warm, 'revisiting a lamp reading allocated a duplicate cached model');
console.log(JSON.stringify({ initial, afterHiddenChanges: initial, states, after40WarmCycles: counts() }, null, 2));

// The festival's crowd is rebuilt when the lamp/roof layout changes. Scene object counts alone did not reveal the old leak:
// detached crowd instances stayed registered with the people kit and their GPU instance buffers were never released.
const festival = ctx.shared.simchaShoeva, crowdStates = new Map();
lamps.set({ at: 'mid', form: 'rashi' }); roof.set('all'); festival.start();
let releasedCrowdMeshes = 0;
for (let cycle = 0; cycle < 8; cycle++) {
  const crowdGroup = ctx.scene.getObjectByName('simchaCrowd');
  assert(crowdGroup, 'festival crowd was not built');
  const oldHandles = crowdGroup.children.map(o => o.userData.crowd).filter(Boolean);
  const oldMeshes = [];
  crowdGroup.traverse(o => { if (o.isInstancedMesh) oldMeshes.push(o); });
  assert(oldMeshes.length > 100, 'exercise the real full court crowd');
  let released = 0;
  for (const mesh of oldMeshes) mesh.addEventListener('dispose', () => released++);
  festival.stop();
  const at = cycle % 2 ? 'mid' : 'corner';
  lamps.set({ at, form: 'rashi' }); roof.set(cycle % 2 ? 'all' : 'kanievsky'); festival.start();
  assert.equal(released, oldMeshes.length, 'layout replacement must release every outgoing crowd instance buffer');
  for (const handle of oldHandles) for (const group of [handle.lod.near, handle.lod.mid, handle.lod.far, handle.lod.anchor]) {
    assert.equal(group.parent, null, 'outgoing crowd groups must be detached');
  }
  const state = { ...festival.info(), crowdGroups: crowdGroup.children.length };
  assert(state.people > 3000 && state.dancers === 14, 'retain the full festival crowd and all dancers');
  if (crowdStates.has(at)) assert.deepEqual(state, crowdStates.get(at), 'revisiting a layout must retain its people/groups');
  else crowdStates.set(at, state);
  releasedCrowdMeshes += released;
}
festival.stop();
console.log(JSON.stringify({ crowdLifecycle: { rebuildCycles: 8, releasedInstanceMeshes: releasedCrowdMeshes, layouts: Object.fromEntries(crowdStates) } }, null, 2));
