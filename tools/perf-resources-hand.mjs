// Exact mesh/skeleton regression and allocation check for all hand poses and detail levels.
// Uses the bundled Three.js, so it runs in Node without a browser or extra dependencies.
// Optional --baseline <hand.js> compares any source revision and reports its construction time.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lib = fs.readFileSync(path.join(root, 'shared/00-lib.js'), 'utf8');
const source = fs.readFileSync(path.join(root, 'shared/frag/hand.js'), 'utf8');
const poses = ['rest', 'open', 'flat', 'grip', 'fist', 'gripW', 'bless', 'point'];
const load = (text) => {
  const context = vm.createContext({ window: { performance }, console });
  return vm.runInContext(lib + `
    let builds = 0;
    const OriginalGeometry = BufferGeometry;
    BufferGeometry = class extends OriginalGeometry { constructor(...args) { super(...args); builds++; } };
    ${text}
    return { hand: tm_hand, builds: () => builds };
  })(); OtzariaPlugin;`, context);
};
function sample(text) {
  const kit = load(text), hands = [], hash = createHash('sha256');
  const started = performance.now();
  for (const pose of poses) for (const lv of [0, 1, 2]) for (const sd of [-1, 1]) {
    const options = { pose, sd, low: lv === 2, mid: lv === 1 };
    const hand = kit.hand(options), sk = hand.sk;
    assert.equal(kit.hand(options), hand, 'repeated requests must reuse the hand');
    assert.ok(sk.fingers.every((f) => f.j.length === 4));
    const skeleton = { PL: sk.PL, PM: sk.PM, grip: sk.grip.toArray(), gripAx: sk.gripAx.toArray(), ring: sk.ring,
      fingers: sk.fingers.map((f) => ({ j: f.j.map((p) => p.toArray()), r: f.r, ax: f.ax.toArray() })),
      thumb: sk.thumb.map((p) => p.toArray()), back: [sk.back(0, -0.06), sk.back(sd * 0.01, -0.1)] };
    hash.update(JSON.stringify([pose, lv, sd, skeleton]));
    hands.push(hand);
  }
  const skeletonMs = performance.now() - started, skeletonGeometries = kit.builds();
  let bufferBytes = 0, vertices = 0;
  const geometryStart = performance.now();
  for (const hand of hands) {
    const geo = hand.geo;
    assert.equal(hand.geo, geo, 'geometry must be constructed only once');
    for (const name of ['position', 'normal', 'uv', 'color', 'index']) {
      const attr = name === 'index' ? geo.index : geo.attributes[name];
      assert.ok(attr && attr.array.length > 0, name + ' must be present');
      const bytes = Buffer.from(attr.array.buffer, attr.array.byteOffset, attr.array.byteLength);
      hash.update(bytes);
      bufferBytes += bytes.length;
    }
    vertices += geo.attributes.position.count;
  }
  return { skeletonMs, skeletonGeometries, geometryMs: performance.now() - geometryStart,
    geometries: kit.builds(), cases: hands.length, vertices, bufferBytes, digest: hash.digest('hex') };
}
const current = sample(source);
// From the pre-optimization implementation at 6954567: every index, vertex, normal, UV, vertex colour and skeleton value.
const expected = '42f46f4e2af6121c25a734013b6a2545b9585419164063f367c82a417aa41a77';
const i = process.argv.indexOf('--baseline');
const baseline = i >= 0 ? sample(fs.readFileSync(process.argv[i + 1], 'utf8')) : null;
console.log(JSON.stringify({ current, ...(baseline ? { baseline } : {}) }, null, 2));
assert.equal(current.skeletonGeometries, 0, 'skeleton-only queries must not build meshes');
assert.equal(current.geometries, poses.length * 3 * 2, 'one geometry per pose/detail/side');
assert.equal(current.digest, baseline ? baseline.digest : expected, 'hand geometry or skeleton changed');
