// Exercise the real morning-service stages and size controls. Replacing water must release its private GPU resources,
// preserve the same stream/film/pool geometry and keep the rest of the temple's shared resources alive.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildModel } from './perf-geometry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = await buildModel('sheni', root), { tamid, kiyorSize } = ctx.shared;
const stages = tamid.list(), one = stages.indexOf('kiyor'), all = stages.indexOf('kiyor12');
assert(one >= 0 && all >= 0);
const resources = group => {
  const geometries = new Set(), materials = new Set();
  group.traverse(o => { if (o.isMesh) { geometries.add(o.geometry); for (const m of Array.isArray(o.material) ? o.material : [o.material]) materials.add(m); } });
  return { geometries, materials };
};
const signature = group => {
  group.updateMatrixWorld(true);
  const hash = crypto.createHash('sha256');
  group.traverse(o => {
    if (!o.isMesh) return;
    hash.update(JSON.stringify({ visible: o.visible, matrix: o.matrixWorld.toArray(), material: o.material.toJSON().color }));
    for (const attribute of Object.values(o.geometry.attributes)) hash.update(Buffer.from(attribute.array.buffer, attribute.array.byteOffset, attribute.array.byteLength));
    if (o.geometry.index) hash.update(Buffer.from(o.geometry.index.array.buffer, o.geometry.index.array.byteOffset, o.geometry.index.array.byteLength));
  });
  return hash.digest('hex');
};
tamid.begin();
const shared = resources(ctx.scene);
let sharedDisposals = 0;
for (const resource of [...shared.geometries, ...shared.materials]) resource.addEventListener('dispose', () => sharedDisposals++);
let previous = null, releasedGeometries = 0, releasedMaterials = 0;
const states = new Map();
for (let cycle = 0; cycle < 12; cycle++) {
  const size = ['d4', 'd3', 'd525'][cycle % 3], twelve = cycle % 2 === 1;
  const old = previous ? resources(previous) : null;
  let disposedGeometries = 0, disposedMaterials = 0;
  if (old) {
    for (const g of old.geometries) g.addEventListener('dispose', () => disposedGeometries++);
    for (const m of old.materials) m.addEventListener('dispose', () => disposedMaterials++);
  }
  kiyorSize.set(size); tamid.seek(twelve ? all : one, twelve ? 10 : 17);
  const current = ctx.scene.getObjectByName('kiddushWater');
  assert(current?.visible, 'selected stage must show its water');
  const r = resources(current), key = `${size}:${twelve ? 'all' : 'one'}`;
  assert.equal(r.geometries.size, twelve ? 204 : 17, 'retain every stream, drip, film and pool');
  assert.equal(r.materials.size, 1);
  if (old) {
    assert.equal(previous.parent, null);
    assert.equal(disposedGeometries, old.geometries.size, 'all old private geometries must be released once');
    assert.equal(disposedMaterials, old.materials.size, 'the private water material must be released once');
  }
  assert.equal(sharedDisposals, 0, 'water replacement must not dispose shared temple resources');
  const state = { geometries: r.geometries.size, signature: signature(current) };
  if (states.has(key)) assert.deepEqual(state, states.get(key), 'revisiting a stage and size must retain its visible geometry');
  else states.set(key, state);
  // Reapplying the same state must reuse its resources, while a dry stage keeps the bounded last group for reuse.
  tamid.seek(twelve ? all : one, twelve ? 10 : 17);
  assert.equal(ctx.scene.getObjectByName('kiddushWater'), current);
  tamid.seek(one, 1); assert.equal(current.visible, false);
  tamid.seek(twelve ? all : one, twelve ? 10 : 17); assert.equal(ctx.scene.getObjectByName('kiddushWater'), current);
  releasedGeometries += disposedGeometries; releasedMaterials += disposedMaterials; previous = current;
}
tamid.end();
console.log(JSON.stringify({ waterLifecycle: { transitions: 12, releasedGeometries, releasedMaterials, sharedDisposals, states: Object.fromEntries(states) } }, null, 2));
