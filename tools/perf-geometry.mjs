// Model-only regression and count benchmark, using the repository's actual bundled Three.js and model builders.
// node tools/perf-geometry.mjs [--baseline-ref <git commit>] [--house rishon|sheni] [--out <report.json>]
// Canvas painting and DOM/audio are stubbed. This checks scene geometry, transforms, materials, shadows, picking flags and
// visibility switches; it does not measure GPU frame time or replace a real browser screenshot comparison.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { houseText } from './house-slots.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const option = (key, fallback) => { const i = argv.indexOf(key); return i < 0 ? fallback : argv[i + 1]; };
const modules = {
  rishon: ['00-lib.js', '10-core.js', '20-mount.js', '30-courts.js', '40-altar.js', '45-vessels.js', '50-heichal.js', '55-interior.js', '57-kelim.js', '58-ark.js', '59-parallels.js', '60-palace.js'],
  sheni: ['00-lib.js', '10-core.js', '20-mount.js', '30-courts.js', '40-altar.js', '45-vessels.js', '50-heichal.js', '55-payis.js', '56-tamid-data.js', '55-tamid.js', '57-add208.js']
};
const builders = {
  rishon: ['buildMount', 'buildCourts', 'buildAltar', 'buildVessels', 'buildHeichal', 'buildInterior', 'buildKelim', 'buildArk', 'buildParallels', 'buildPalace'],
  sheni: ['build', 'build2', 'build3', 'buildVessels', 'build4', 'buildPayis', 'buildTamid', 'buildAdd208']
};
const noop = () => {};

function domStub() {
  // No pixel claims are made from this stub; retaining texture dimensions/settings still catches accidental material changes.
  const canvas = () => {
    const style = { setProperty: noop };
    const cv = { width: 256, height: 256, style, textCalls: [], addEventListener: noop, removeEventListener: noop, appendChild: noop, setAttribute: noop };
    const gradient = { addColorStop: noop };
    const context = new Proxy({
      canvas: cv, createLinearGradient: () => gradient, createRadialGradient: () => gradient,
      measureText: text => ({ width: String(text).length * 12 }),
      fillText(text, x, y) { cv.textCalls.push([text, x, y, this.font, this.fillStyle]); },
      createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
      getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), getLineDash: () => []
    }, { get: (target, key) => key in target ? target[key] : noop });
    cv.getContext = () => context;
    return cv;
  };
  return {
    createElement: canvas, createElementNS: () => canvas(), getElementById: () => null,
    querySelector: () => null, querySelectorAll: () => [], addEventListener: noop,
    body: { appendChild: noop, children: [] }
  };
}

export async function buildModel(house, sourceRoot, { uiLabels = false } = {}) {
  const document = domStub();
  const window = { performance, addEventListener: noop, removeEventListener: noop, innerWidth: 640, innerHeight: 400, devicePixelRatio: 1 };
  const sandbox = { console, document, window, performance, setTimeout: noop, clearTimeout: noop, setInterval: noop,
    clearInterval: noop, requestAnimationFrame: noop, localStorage: { getItem: () => null, setItem: noop },
    navigator: { userAgent: '' }, Uint8ClampedArray };
  // Keep the real section/material lifecycle in these tests without booting the renderer or UI.
  const entry = houseText(house, '90-entry.js', sourceRoot);
  const sectionStart = entry.indexOf('  var ent_sec ='), sectionEnd = entry.indexOf('  // 1.0.1-H', sectionStart);
  assert(sectionStart >= 0 && sectionEnd > sectionStart, 'entry section block could not be found');
  // Opt in to the real label painter for replay/resource tests, without initializing the UI.
  let labelCode = '';
  if (uiLabels) {
    const ui = houseText(house, '70-ui.js', sourceRoot);
    const names = ui.match(/^  var UI_SRC_NAME = .+$/m);
    const runs = ui.indexOf('  function ui_srcIs('), runsEnd = ui.indexOf('  function ui_fillSrc(', runs);
    const paint = ui.indexOf('  function ui_labelText('), paintEnd = ui.indexOf('  // UI_UNIFY_A2', paint);
    assert(names && runs >= 0 && runsEnd > runs && paint >= 0 && paintEnd > paint, 'production label painter boundaries');
    labelCode = names[0] + '\n' + ui.slice(runs, runsEnd) + ui.slice(paint, paintEnd);
  }
  const code = modules[house].map(name => houseText(house, name, sourceRoot)).join('\n') + labelCode + `
    var scene = new Scene(), camera = new PerspectiveCamera(45, 1, .1, 10000), root = new Group();
    scene.add(root); camera.position.set(500, 300, 500);
    var controls = { target: new Vector3(), update: () => {}, addEventListener: () => {} };
    var ctx = { THREE: three_module_exports, scene, root, M, TEX, H, LV, CO, labels: [], animated: [], cutaway: [],
      interiorOnly: [], layers: {}, shared: {}, camera, controls, renderer: { domElement: document.createElement('canvas') }, flyTo: () => {} };
    var renderer = ctx.renderer;
    ${entry.slice(sectionStart, sectionEnd)}
    ctx.shared.section = { on: false, axis: 'z', v: 0, set: ent_sectionSet };
    return { ctx, builds: [${builders[house].join(',')}] };
  })(); OtzariaPlugin;`;
  const { ctx, builds } = vm.runInNewContext(code, sandbox, { timeout: 60000 });
  for (let i = 0; i < builds.length; i++) {
    try { await builds[i](ctx); }
    catch (error) { throw new Error(`${house}/${builders[house][i]} failed`, { cause: error }); }
  }
  return ctx;
}

const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const bytesOf = array => Buffer.from(array.buffer, array.byteOffset, array.byteLength);
function geometryKey(g) {
  const parts = [];
  for (const name of Object.keys(g.attributes).sort()) {
    const a = g.attributes[name];
    assert(!a.isInterleavedBufferAttribute, 'benchmark expects ordinary buffer attributes');
    parts.push([name, a.itemSize, a.normalized, a.array.constructor.name, digest(bytesOf(a.array))]);
  }
  return digest(JSON.stringify({ attributes: parts, index: g.index ? digest(bytesOf(g.index.array)) : null,
    groups: g.groups, drawRange: g.drawRange, morphTargetsRelative: g.morphTargetsRelative }));
}

function materialKey(material) {
  const encode = value => {
    if (value == null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
    if (typeof value === 'function') return String(value);
    if (ArrayBuffer.isView(value)) return [value.constructor.name, digest(bytesOf(value))];
    if (value.isTexture) {
      const im = value.image || {};
      return { type: 'Texture', width: im.width, height: im.height, data: im.data ? encode(im.data) : null,
        wrapS: value.wrapS, wrapT: value.wrapT, repeat: value.repeat.toArray(), offset: value.offset.toArray(),
        rotation: value.rotation, center: value.center.toArray(), colorSpace: value.colorSpace, channel: value.channel,
        minFilter: value.minFilter, magFilter: value.magFilter, anisotropy: value.anisotropy, flipY: value.flipY };
    }
    if (value.isColor || value.isVector2 || value.isVector3 || value.isVector4 || value.isMatrix3 || value.isMatrix4) return value.toArray();
    if (Array.isArray(value)) return Array.from(value, encode);
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (['id', 'uuid', '_listeners', 'version'].includes(key)) continue;
      out[key] = encode(value[key]);
    }
    return out;
  };
  return digest(JSON.stringify(encode(material)));
}

// Expanding an InstancedMesh back into its component records permits a direct before/after comparison. Geometry and UV buffers,
// material settings and flags must match exactly. World matrices allow only Float32 instance-translation rounding (2e-5 amot).
export function snapshot(ctx) {
  const { Matrix4 } = ctx.THREE;
  ctx.scene.updateMatrixWorld(true);
  const geometryKeys = new Map(), materialKeys = new Map(), groups = new Map();
  const geometries = new Set(), materials = new Set();
  const counters = { objects: 0, meshes: 0, visibleMeshes: 0, components: 0, visibleComponents: 0, geometries: 0, materials: 0, geometryBytes: 0, instanceBytes: 0 };
  const visit = (o, parentVisible) => {
    counters.objects++;
    const visible = parentVisible && o.visible;
    if (o.isMesh) {
      counters.meshes++; if (visible) counters.visibleMeshes++;
      const g = o.geometry, mats = Array.isArray(o.material) ? o.material : [o.material];
      geometries.add(g); for (const mat of mats) materials.add(mat);
      if (!geometryKeys.has(g)) geometryKeys.set(g, geometryKey(g));
      for (const mat of mats) if (!materialKeys.has(mat)) materialKeys.set(mat, materialKey(mat));
      const key = JSON.stringify({ geometry: geometryKeys.get(g), materials: mats.map(mat => materialKeys.get(mat)),
        visible, name: o.name, castShadow: o.castShadow, receiveShadow: o.receiveShadow, noPick: !!o.userData.noPick,
        layers: o.layers.mask, renderOrder: o.renderOrder });
      if (!groups.has(key)) groups.set(key, []);
      const list = groups.get(key), count = o.isInstancedMesh ? o.count : 1;
      counters.components += count; if (visible) counters.visibleComponents += count;
      if (o.isInstancedMesh) counters.instanceBytes += o.instanceMatrix.array.byteLength;
      for (let i = 0; i < count; i++) {
        const world = new Matrix4();
        if (o.isInstancedMesh) { o.getMatrixAt(i, world); world.premultiply(o.matrixWorld); }
        else world.copy(o.matrixWorld);
        list.push(Array.from(world.elements));
      }
    }
    for (const child of o.children) visit(child, visible);
  };
  visit(ctx.scene, true);
  for (const geometry of geometries) {
    for (const attr of Object.values(geometry.attributes)) counters.geometryBytes += attr.array.byteLength;
    if (geometry.index) counters.geometryBytes += geometry.index.array.byteLength;
  }
  counters.geometries = geometries.size; counters.materials = materials.size;
  for (const list of groups.values()) list.sort((a, b) => {
    // Translation first; identical pieces at the same place then compare rotation/scale.
    for (const i of [12, 13, 14, 0, 1, 2, 4, 5, 6, 8, 9, 10]) { const d = a[i] - b[i]; if (Math.abs(d) > 2e-5) return d; }
    return 0;
  });
  return { counters, groups };
}

export function compare(before, after, label, visibleOnly = false) {
  // Lazy caches may legitimately be absent while hidden; every visible component must still match the baseline.
  const select = snapshot => visibleOnly ? new Map([...snapshot.groups].filter(([key]) => JSON.parse(key).visible)) : snapshot.groups;
  const beforeGroups = select(before), afterGroups = select(after);
  assert.deepEqual([...afterGroups.keys()].sort(), [...beforeGroups.keys()].sort(), `${label}: geometry, materials, flags or visibility changed`);
  let maxMatrixError = 0;
  for (const [key, actual] of afterGroups) {
    const expected = beforeGroups.get(key);
    assert.equal(actual.length, expected.length, `${label}: a model component was lost/duplicated`);
    for (let i = 0; i < expected.length; i++) for (let k = 0; k < 16; k++) {
      const error = Math.abs(actual[i][k] - expected[i][k]);
      maxMatrixError = Math.max(maxMatrixError, error);
      assert(error <= 2e-5, `${label}: component transform changed (${error} at element ${k})`);
    }
  }
  return { comparedComponents: visibleOnly ? after.counters.visibleComponents : after.counters.components, visibleOnly, maxMatrixError, equivalent: true };
}

// Real Three.js raycasts through the baseline group's pieces, also when a candidate replaced them with instances. Selection and
// camera collision use hit points/distances, not a static board's Object3D identity. Use off-centre rays to avoid triangle-edge ties.
function compareGroupRays(before, after, groupName) {
  const group = before.layers[groupName], other = after.layers[groupName];
  assert(group && other, `missing raycast regression group ${groupName}`);
  const { Matrix4, Vector3, Raycaster } = before.THREE, points = [], mm = new Matrix4();
  group.traverse(o => {
    if (!o.isMesh) return;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    const n = o.isInstancedMesh ? o.count : 1;
    for (let i = 0; i < n; i++) {
      if (o.isInstancedMesh) { o.getMatrixAt(i, mm); mm.premultiply(o.matrixWorld); } else mm.copy(o.matrixWorld);
      points.push(o.geometry.boundingSphere.center.clone().applyMatrix4(mm).add(new Vector3(0.007, 0.003, 0.011)));
    }
  });
  const ray = new Raycaster(), rayAfter = new after.THREE.Raycaster();
  let hits = 0, maxPointError = 0;
  for (const point of points) {
    const origin = point.clone().add(new Vector3(3.7, 5.3, 2.9)), direction = point.clone().sub(origin).normalize();
    ray.set(origin, direction); ray.far = 12;
    rayAfter.set(new after.THREE.Vector3(...origin.toArray()), new after.THREE.Vector3(...direction.toArray())); rayAfter.far = 12;
    const b = ray.intersectObject(group, true)[0], a = rayAfter.intersectObject(other, true)[0];
    assert.equal(!!a, !!b, `${groupName}: a picking/collision hit disappeared`);
    if (!b) continue;
    hits++;
    const error = a.point.distanceTo(b.point);
    maxPointError = Math.max(maxPointError, error);
    assert(error <= 5e-5, `${groupName}: picking/collision point changed (${error})`);
    assert(Math.abs(a.distance - b.distance) <= 5e-5, `${groupName}: picking/collision distance changed`);
  }
  assert(hits > 0, `${groupName}: raycast regression had no hits`);
  return { rays: points.length, hits, maxPointError, equivalent: true };
}

const scenarios = [
  ['default', () => {}],
  ['guards-on', ctx => ctx.shared.features.guards.on(), 'guards'],
  // Exercise the real frame hook; the camera-scaled discs must remain independent of the newly instanced bodies.
  ['guards-near', ctx => { ctx.camera.position.set(0, 20, 0); ctx.animated.find(f => String(f).includes('!guards.visible'))(); }, 'guards'],
  ['guards-far', ctx => { ctx.camera.position.set(1000, 300, 1000); ctx.animated.find(f => String(f).includes('!guards.visible'))(); }, 'guards'],
  ['guards-clipped', ctx => ctx.shared.section.set(true, 'z', 0)],
  ['guards-off', ctx => { ctx.shared.section.set(false); ctx.shared.features.guards.off(); ctx.camera.position.set(500, 300, 500); }],
  ['soreg-greeks', ctx => ctx.shared.soregBreach.set('greeks'), 'soregBreach'],
  ['soreg-clipped', ctx => ctx.shared.section.set(true, 'x', -38)],
  ['soreg-repaired', ctx => { ctx.shared.section.set(false); ctx.shared.soregBreach.set('repaired'); }],
  ['whole-mount-roof', ctx => ctx.shared.harRoof.set('all')],
  ['kanievsky-roof', ctx => ctx.shared.harRoof.set('kanievsky')],
  ['ulam-open', ctx => ctx.shared.modelButtons.find(b => b.id === 'hei-ulam-front').set(true)],
  ['ulam-closed', ctx => ctx.shared.modelButtons.find(b => b.id === 'hei-ulam-front').set(false)],
  // Visit the two Rashi positions first: the old roof controls eagerly built them in this order. The live-fire shader's
  // procedural seed follows creation order, so matching that history lets us compare its uniforms exactly as well.
  ...['rashi', 'ty'].flatMap(form => ['mid', 'corner'].flatMap(at => [
    [`lamps-${at}-${form}`, ctx => { ctx.shared.simchaLamps.set({ at, form }); ctx.shared.features.simchaMenorot.on(); }],
    [`lamps-${at}-${form}-pour`, ctx => ctx.shared.simchaDemo.drive(12.5)],
    [`lamps-${at}-${form}-lit`, ctx => ctx.shared.simchaDemo.drive(15)]
  ]))
];

async function main() {
let baselineRoot;
const report = { note: 'Model-only; Canvas/DOM/audio stubbed. Counts are scene objects, not measured GPU draw calls or FPS.', houses: {} };
try {
  const ref = option('--baseline-ref');
  if (ref) {
    baselineRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'beit-geometry-baseline-'));
    const archive = execFileSync('git', ['archive', ref, 'src', 'sheni/src', 'shared'], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
    execFileSync('tar', ['-x', '-C', baselineRoot], { input: archive });
    report.baseline = execFileSync('git', ['rev-parse', ref], { cwd: root, encoding: 'utf8' }).trim();
  }
  const houseArg = option('--house');
  const houses = houseArg ? [houseArg] : ['rishon', 'sheni'];
  for (const house of houses) {
    assert(modules[house], 'house must be rishon or sheni');
    const candidate = await buildModel(house, root);
    const baseline = baselineRoot ? await buildModel(house, baselineRoot) : null;
    const states = [];
    for (const [name, apply, rayGroup] of house === 'sheni' ? scenarios : [scenarios[0]]) {
      apply(candidate); if (baseline) apply(baseline);
      const after = snapshot(candidate), before = baseline ? snapshot(baseline) : null;
      const result = { name, candidate: after.counters };
      if (before) { result.baseline = before.counters; result.validation = compare(before, after, `${house}/${name}`, name !== 'default'); }
      if (baseline && rayGroup) result.picking = compareGroupRays(baseline, candidate, rayGroup);
      states.push(result);
    }
    report.houses[house] = states;
    console.log(JSON.stringify({ house, states }, null, 2));
  }
  if (option('--out')) {
    const out = path.resolve(option('--out')); fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
  }
} finally {
  if (baselineRoot) fs.rmSync(baselineRoot, { recursive: true, force: true });
}

}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
