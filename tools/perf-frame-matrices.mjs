// Exact world-matrix/pass checks on the production frame wrapper and vendored Three.js.
// node tools/perf-frame-matrices.mjs [--out report.json]
// CHROME=/usr/bin/google-chrome node tools/perf-frame-matrices.mjs --browser [--out report.json]
// Node fixtures use actual model builders with DOM/canvas/audio stubs; browser mode checks real WebGL pixels.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { houseText } from './house-slots.mjs';
import { buildModel } from './perf-geometry.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const library = houseText('rishon', '00-lib.js');
const T = new Function('window', library + '\nreturn three_module_exports;})(); return OtzariaPlugin;')({ performance });
function wrapper(house) {
  const source = houseText(house, '90-entry.js');
  const start = source.indexOf('  function ent_renderFrame() {'), end = source.indexOf('  renderer.setAnimationLoop(', start);
  assert(start >= 0 && end > start, 'the production frame wrapper must exist');
  return source.slice(start, end);
}
function makeFrame(house, renderer, scene, camera, ent_hq) {
  return new Function('renderer', 'scene', 'camera', 'ent_hq', 'performance',
    'const ent_load={printed:true}; const ent_printLoad=()=>{};\n' + wrapper(house) + '\nreturn ent_renderFrame;')(renderer, scene, camera, ent_hq, performance);
}
const state = scene => {
  const rows = [];
  scene.traverse(o => rows.push([o.id, ...o.matrixWorld.elements]));
  return rows;
};

function fixture(house) {
  const scene = new T.Scene(), group = new T.Group(), camera = new T.PerspectiveCamera(45, 1, 0.1, 100);
  const mesh = new T.Mesh(new T.BoxGeometry(), new T.MeshBasicMaterial()), manual = mesh.clone();
  manual.matrixAutoUpdate = false;
  manual.matrix.makeShear(0.2, 0, 0, 0.1, 0, 0);
  group.add(mesh, manual); scene.add(group); camera.position.set(4, 3, 5);
  const snapshot = () => ({ scene: state(scene), camera: camera.matrixWorld.toArray() });
  let sceneUpdates = 0, cameraUpdates = 0, passes = [], extraPasses = 0;
  const updateScene = scene.updateMatrixWorld.bind(scene), updateCamera = camera.updateMatrixWorld.bind(camera);
  scene.updateMatrixWorld = (...args) => { sceneUpdates++; return updateScene(...args); };
  camera.updateMatrixWorld = (...args) => { cameraUpdates++; return updateCamera(...args); };
  // The real renderer performs these two independent gates (shared/00-lib.js).
  const renderer = { render() {
    if (scene.matrixWorldAutoUpdate === true) scene.updateMatrixWorld();
    if (camera.parent === null && camera.matrixWorldAutoUpdate === true) camera.updateMatrixWorld();
    passes.push(snapshot());
  } };
  const hq = { on: false, frame() { for (let i = 0; i < extraPasses; i++) renderer.render(); } };
  const candidate = makeFrame(house, renderer, scene, camera, hq);
  const before = () => { hq.frame(); renderer.render(); };
  const record = fn => { sceneUpdates = cameraUpdates = 0; passes = []; fn(); return { sceneUpdates, cameraUpdates, passes }; };
  const modes = [];
  for (const [name, active, prepasses] of [['off', false, 0], ['ao', true, 1], ['gi', true, 2], ['ao-gi', true, 2], ['gi-warming', true, 0], ['off-again', false, 0]]) {
    hq.on = active; extraPasses = prepasses;
    scene.position.x += 0.25; group.rotation.y += 0.2; mesh.position.z -= 0.4; camera.position.x += 0.1;
    const a = record(before), b = record(candidate);
    assert.deepEqual(b.passes, a.passes, name + ': every pass sees identical scene/camera matrices');
    assert.equal(a.sceneUpdates, 1 + prepasses); assert.equal(b.sceneUpdates, 1);
    assert.equal(b.cameraUpdates, a.cameraUpdates); assert.equal(scene.matrixWorldAutoUpdate, true);
    modes.push({ name, beforeSceneUpdates: a.sceneUpdates, afterSceneUpdates: b.sceneUpdates, cameraUpdates: b.cameraUpdates });
  }
  // Respect manual root ownership, even when local properties changed since its last explicit update.
  scene.matrixWorldAutoUpdate = false; mesh.position.y += 8; hq.on = true; extraPasses = 2;
  const a = record(before), b = record(candidate);
  assert.deepEqual(b, a); assert.equal(b.sceneUpdates, 0); assert.equal(scene.matrixWorldAutoUpdate, false);
  // A pass failure must not disable next-frame updates. Cover both original flag states.
  for (const auto of [false, true]) {
    scene.matrixWorldAutoUpdate = auto;
    const throwing = makeFrame(house, renderer, scene, camera, { on: true, frame() { throw new Error('test pass failure'); } });
    assert.throws(throwing, /test pass failure/); assert.equal(scene.matrixWorldAutoUpdate, auto);
  }
  scene.matrixWorldAutoUpdate = true;
  const failingBeauty = makeFrame(house, { render() { throw new Error('test beauty failure'); } }, scene, camera, { on: true, frame() {} });
  assert.throws(failingBeauty, /test beauty failure/); assert.equal(scene.matrixWorldAutoUpdate, true);
  // Camera transforms remain current even if a pass callback changes them in between scene passes.
  const cameraHQ = { on: true, frame() { renderer.render(); camera.position.z += 2; renderer.render(); } };
  record(makeFrame(house, renderer, scene, camera, cameraHQ));
  assert.notDeepEqual(passes[0].camera, passes[1].camera); assert.deepEqual(passes[1].camera, passes[2].camera);
  return { house, modes, manualFlagPreserved: true, failedPassFlagRestored: true, cameraUpdateIndependent: true };
}

async function actualModel(house) {
  const ctx = await buildModel(house, root), { scene, camera } = ctx;
  let objects = 0, meshes = 0;
  // This optimization's current application contract: render callbacks do not write model transforms.
  scene.traverse(o => {
    objects++; if (o.isMesh) meshes++;
    assert.equal(o.onBeforeRender, ctx.THREE.Object3D.prototype.onBeforeRender, o.name + ': review custom pre-render transform hooks');
    assert.equal(o.onAfterRender, ctx.THREE.Object3D.prototype.onAfterRender, o.name + ': review custom post-render transform hooks');
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m) {
      assert.equal(m.onBeforeRender, ctx.THREE.Material.prototype.onBeforeRender, 'review custom material render hooks');
    }
  });
  let updates = 0, snapshots = [];
  const update = scene.updateMatrixWorld.bind(scene);
  scene.updateMatrixWorld = (...args) => { updates++; return update(...args); };
  const renderer = { render() {
    if (scene.matrixWorldAutoUpdate === true) scene.updateMatrixWorld();
    if (camera.parent === null && camera.matrixWorldAutoUpdate === true) camera.updateMatrixWorld();
    snapshots.push(state(scene));
  } };
  const hq = { on: true, frame() { renderer.render(); } }, draw = makeFrame(house, renderer, scene, camera, hq);
  const record = fn => { updates = 0; snapshots = []; fn(); return { updates, snapshots }; };
  const cases = [];
  for (const name of ['default', 'moved-parent', 'section', 'late-child']) {
    if (name === 'moved-parent') { ctx.root.position.set(2, -1, 3); ctx.root.rotation.y = 0.2; }
    if (name === 'section') ctx.shared.section.set(true, 'y', 20);
    if (name === 'late-child') { const group = new ctx.THREE.Group(); group.position.set(1, 2, 3); ctx.root.add(group); }
    const before = record(() => { hq.frame(); renderer.render(); }), after = record(draw);
    assert.deepEqual(after.snapshots, before.snapshots, house + '/' + name + ': exact model matrices');
    assert.equal(before.updates, 2); assert.equal(after.updates, 1);
    cases.push({ name, beforeSceneUpdates: before.updates, afterSceneUpdates: after.updates });
  }
  return { house, objects, meshes, cases, note: 'Exact matrices on actual models; operation counts, not FPS or frame-time measurements.' };
}

async function browserChecks() {
  const { default: puppeteer } = await import('puppeteer-core');
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true,
    protocolTimeout: 240000, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const results = [];
  try {
    for (const house of ['rishon', 'sheni']) {
      const page = await browser.newPage(), errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      page.on('console', message => { if (message.type() === 'error' && !/404|favicon/.test(message.text())) errors.push(message.text()); });
      await page.setContent('<!doctype html><canvas></canvas>');
      await page.addScriptTag({ content: library + houseText(house, '85-hq.js') + '\nreturn { ...three_module_exports, makeHQ:HQ_make, makeFrame(renderer,scene,camera,ent_hq) {const ent_load={printed:true};const ent_printLoad=()=>{};\n' + wrapper(house) + '\nreturn ent_renderFrame;} };})();' });
      const result = await page.evaluate(async () => {
        const T = OtzariaPlugin, renderer = new T.WebGLRenderer({ canvas: document.querySelector('canvas'), antialias: false });
        renderer.setSize(128, 96); renderer.shadowMap.enabled = true;
        const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, 128 / 96, 0.1, 50);
        const hq = T.makeHQ(renderer, scene, camera), draw = T.makeFrame(renderer, scene, camera, hq);
        scene.background = new T.Color(0x203040);
        const group = new T.Group(), material = new T.MeshStandardMaterial({ color: 0xd4ad62, roughness: 0.4 });
        const box = new T.Mesh(new T.BoxGeometry(1.2, 1.4, 1), material);
        box.castShadow = true; group.add(box); scene.add(group);
        const floor = new T.Mesh(new T.PlaneGeometry(12, 12), new T.MeshStandardMaterial({ color: 0xb9b5a8 }));
        floor.rotation.x = -Math.PI / 2; floor.position.y = -0.8; floor.receiveShadow = true; scene.add(floor);
        const light = new T.DirectionalLight(0xffffff, 3); light.position.set(3, 4, 2); light.castShadow = true; light.shadow.mapSize.set(128, 128);
        scene.add(light, new T.HemisphereLight(0xeeeeff, 0x333320, 1));
        const output = new T.WebGLRenderTarget(128, 96); renderer.setRenderTarget(output);
        const read = () => { const bytes = new Uint8Array(128 * 96 * 4); renderer.readRenderTargetPixels(output, 0, 0, 128, 96, bytes); return bytes; };
        const cases = [];
        for (const [mode, ao, gi] of [['off', false, false], ['ao', true, false], ['gi', false, true], ['both', true, true], ['ao-again', true, false]]) {
          hq.set(ao, gi);
          const start = performance.now();
          while (gi && hq.S.giWarm !== 2) {
            if (performance.now() - start > 60000) throw new Error('GI warmup timeout');
            await new Promise(resolve => setTimeout(resolve, 20));
          }
          for (let step = 0; step < 3; step++) {
            group.rotation.y = step * 0.4; group.position.x = step * 0.2;
            box.position.y = step * 0.1; light.position.x = 3 + step;
            camera.position.set(3 - step * 0.2, 2 + step * 0.1, 5); camera.lookAt(0, 0, 0);
            hq.frame(); renderer.render(scene, camera); const before = read();
            draw(); const after = read();
            let differingBytes = 0, min = 255, max = 0;
            for (let i = 0; i < before.length; i++) {
              if (before[i] !== after[i]) differingBytes++;
              if (i % 4 !== 3) { min = Math.min(min, before[i]); max = Math.max(max, before[i]); }
            }
            if (hq.S.error) throw new Error(hq.S.error);
            cases.push({ mode, step, differingBytes, colorRange: max - min, automaticMatricesRestored: scene.matrixWorldAutoUpdate });
          }
        }
        output.dispose(); renderer.dispose();
        return cases;
      });
      assert.deepEqual(errors, []);
      for (const c of result) { assert.equal(c.differingBytes, 0, house + '/' + c.mode + ': pixels must match'); assert(c.colorRange > 10); assert.equal(c.automaticMatricesRestored, true); }
      results.push({ house, cases: result });
      await page.close();
    }
  } finally { await browser.close(); }
  return { mode: 'real-webgl', results };
}

const result = process.argv.includes('--browser') ? await browserChecks() : {
  mode: 'node-exact-matrices', fixtures: ['rishon', 'sheni'].map(fixture),
  models: [await actualModel('rishon'), await actualModel('sheni')]
};
console.log(JSON.stringify(result, null, 2));
const out = process.argv.indexOf('--out');
if (out >= 0) { fs.mkdirSync(path.dirname(process.argv[out + 1]), { recursive: true }); fs.writeFileSync(process.argv[out + 1], JSON.stringify(result, null, 2) + '\n'); }
console.log('Frame matrix reuse checks passed.');
