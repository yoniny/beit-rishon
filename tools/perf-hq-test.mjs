// HQ pass/resource regression tests using each house's assembled source and its bundled Three.js.
// The recording renderer checks pass ordering, sampler/target aliasing, material restoration and
// framebuffer attachment lifetimes; browser CI separately checks the real WebGL output.
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { houseText } from './house-slots.mjs';

const lib = houseText('rishon', '00-lib.js');
function load(house) {
  const hq = houseText(house, '85-hq.js');
  // Keep the compile timeout pending without a 25-second Node timer. Each test resolves/rejects the compile itself.
  return new Function('window', 'setTimeout', lib + hq + '\nreturn { ...three_module_exports, makeHQ: HQ_make };})(); return OtzariaPlugin;')({ performance }, () => 0);
}
async function run(house) {
  const T = load(house), scene = new T.Scene(), camera = new T.PerspectiveCamera(45, 1.5, 0.1, 2000);
  const clip = new T.Plane(new T.Vector3(0, 1, 0), 2);
  const opaque = new T.MeshStandardMaterial({ side: T.DoubleSide, clippingPlanes: [clip], polygonOffset: true, polygonOffsetFactor: 2 });
  const glass = new T.MeshStandardMaterial({ transparent: true, opacity: 0.4 });
  const solid = new T.Mesh(new T.BoxGeometry(), opaque), transparent = new T.Mesh(new T.BoxGeometry(), glass);
  scene.add(solid, transparent); scene.background = new T.Color(0x445566); scene.updateMatrixWorld(true);
  camera.position.set(1, 2, 3); camera.updateMatrixWorld(true);
  const bg = scene.background, allocated = new Map(), targets = new Set(), passes = [], hooks = [];
  let rt = null, width = 1920, height = 1080, alpha = 0.3, clear = new T.Color(0x102030), hq, resolveCompile, compilePromise;
  const compileScenes = [];
  const originalClear = clear.clone();
  const record = (target) => {
    if (!target) return;
    if (!targets.has(target)) { targets.add(target); target.addEventListener('dispose', () => allocated.delete(target)); }
    allocated.set(target, { width: target.width, height: target.height, halfFloat: target.texture.type === T.HalfFloatType,
      depth: target.depthBuffer, depthTexture: !!target.depthTexture });
  };
  const renderer = {
    autoClear: false,
    getRenderTarget: () => rt,
    setRenderTarget: (target) => { rt = target; record(target); },
    getClearAlpha: () => alpha,
    getClearColor: (out) => out.copy(clear),
    setClearColor: (value, a) => { clear.set(value); alpha = a; },
    getDrawingBufferSize: (out) => out.set(width, height),
    compileAsync: (root) => { compileScenes.push(root); return compilePromise || (compilePromise = new Promise((resolve) => { resolveCompile = resolve; })); },
    render(root) {
      if (root === scene) {
        const normal = solid.material.isMeshNormalMaterial;
        passes.push(normal ? 'normal' : 'lit');
        assert.equal(transparent.material.visible, false, 'transparent surfaces stay out of both prepasses');
        if (normal) {
          assert.equal(solid.material.side, opaque.side);
          assert.equal(solid.material.clippingPlanes, opaque.clippingPlanes);
          assert.equal(solid.material.polygonOffsetFactor, opaque.polygonOffsetFactor);
        } else {
          assert.equal(solid.material, opaque);
          assert.equal(hq.U.tmHQOn.value, 0, 'the lit prepass must not feed last-frame HQ light back into itself');
        }
        assert.equal(rt.depthBuffer, true, 'scene prepasses still need their depth attachments');
      } else {
        const name = Object.entries(hq.mats()).find(([, m]) => m === root.material)?.[0];
        assert.ok(name, 'known full-screen material');
        passes.push(name);
        assert.equal(rt.depthBuffer, false, 'full-screen passes must not allocate a depth attachment');
        for (const uniform of Object.values(root.material.uniforms)) assert.notEqual(uniform.value, rt.texture, 'never sample the current draw target');
      }
    }
  };
  hq = T.makeHQ(renderer, scene, camera, { pre: (v) => hooks.push(v) });
  const frame = (expected) => {
    passes.length = hooks.length = 0;
    hq.frame();
    assert.deepEqual(passes, expected);
    assert.deepEqual(hooks, expected.length ? [true, false] : []);
    assert.equal(solid.material, opaque); assert.equal(transparent.material, glass);
    assert.equal(scene.background, bg); assert.equal(renderer.getRenderTarget(), null);
    assert.equal(renderer.autoClear, false); assert.equal(alpha, 0.3); assert.ok(clear.equals(originalClear));
    assert.equal(hq.S.error, '');
  };
  const metrics = () => {
    const a = [...allocated.values()];
    return { targets: a.length, halfFloatColorTargets: a.filter((x) => x.halfFloat).length,
      depthAttachments: a.filter((x) => x.depth).length,
      colorBytes: a.reduce((sum, x) => sum + x.width * x.height * (x.halfFloat ? 8 : 4), 0),
      // Depth backing storage depends on the driver. This explicitly uses a common four-byte allocation for its estimate.
      estimatedBytesWith4ByteDepth: a.reduce((sum, x) => sum + x.width * x.height * ((x.halfFloat ? 8 : 4) + (x.depth ? 4 : 0)), 0) };
  };
  const warmAO = hq.warmScene(false), warmAll = hq.warmScene();
  assert.equal(warmAO.children.filter(o => o.material.isMeshNormalMaterial).length, 3);
  assert.equal(warmAO.children.length, 5, 'normal variants and the two AO shaders are still warmed');
  assert.deepEqual(warmAO.children.filter(o => o.material.isShaderMaterial).map(o => o.material), [hq.mats().gtaoM, hq.mats().pdM]);
  assert.equal(warmAll.children.length, 7, 'an exposed GI capability still receives full startup warmup');
  assert.equal(allocated.size, 0, 'shader warmup alone must not allocate framebuffer attachments');
  hq.set(true, false); frame(['normal', 'gtaoM', 'pdM']);
  const ao = metrics();
  const aoResult = hq.U.tmAOTex.value, aoRaw = hq.mats().pdM.uniforms.tDiffuse.value;
  assert.equal(ao.targets, 3); assert.equal(ao.depthAttachments, 1);
  assert.deepEqual(hq.U.tmAOMask.value.toArray(), [1, 0, 0, 0]);
  hq.set(false, false); frame([]);
  assert.equal(hq.U.tmHQOn.value, 0);
  hq.set(false, true);
  assert.equal(compileScenes[0], scene, 'GI warms the actual lit scene');
  assert.deepEqual(compileScenes[1].children.map(o => o.material), [hq.mats().giM, hq.mats().gdM], 'deferred GI shaders compile on first use');
  for (let i = 0; i < 120; i++) frame([]); // GI-only warmup does no discarded scene prepasses.
  assert.equal(hq.U.tmHQOn.value, 0);
  hq.set(true, true); frame(['normal', 'gtaoM', 'pdM']); // AO still works while GI is compiling.
  assert.deepEqual(hq.U.tmAOMask.value.toArray(), [1, 0, 0, 0]);
  resolveCompile(); await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  assert.equal(hq.S.giWarm, 2);
  frame(['normal', 'lit', 'giM', 'gdM']);
  hq.set(true, true); frame(['normal', 'lit', 'giM', 'gdM']);
  assert.equal(hq.U.tmAOTex.value, hq.U.tmGITex.value);
  assert.equal(hq.U.tmGITex.value, aoResult, 'GI and AO reuse the same resolved target');
  assert.equal(hq.mats().gdM.uniforms.tInput.value, aoRaw, 'GI and AO reuse the same raw target');
  assert.deepEqual(hq.U.tmAOMask.value.toArray(), [0, 0, 0, 1]);
  const allModes = metrics();
  assert.equal(allModes.targets, 4); assert.equal(allModes.halfFloatColorTargets, 3); assert.equal(allModes.depthAttachments, 2);
  hq.set(true, false); frame(['normal', 'gtaoM', 'pdM']);
  assert.deepEqual(hq.U.tmAOMask.value.toArray(), [1, 0, 0, 0]);
  // A changed live section/material side is reflected immediately in the shared normal prepass.
  opaque.clippingPlanes = [new T.Plane(new T.Vector3(1, 0, 0), -4)]; opaque.side = T.FrontSide;
  frame(['normal', 'gtaoM', 'pdM']);
  width = 1280; height = 720;
  frame(['normal', 'gtaoM', 'pdM']);
  hq.set(true, true); frame(['normal', 'lit', 'giM', 'gdM']);
  for (const info of allocated.values()) assert.deepEqual([info.width, info.height], [640, 360]);
  // Context restoration drops GPU attachments while retaining Three.js target objects; the next pass must bind them afresh.
  allocated.clear(); frame(['normal', 'lit', 'giM', 'gdM']);
  assert.equal(allocated.size, 4);
  hq.set(true, false); frame(['normal', 'gtaoM', 'pdM']);
  assert.equal(allocated.size, 4, 'returning to AO must not allocate another pair');
  hq.set(false, false); frame([]);
  assert.equal(hq.U.tmHQOn.value, 0); assert.equal(hq.U.tmAOTex.value.image.width, 1); assert.equal(hq.U.tmGITex.value.image.width, 1);
  return { house, ao, allModes };
}
for (const house of ['rishon', 'sheni']) console.log(JSON.stringify(await run(house), null, 2));
console.log('HQ pass order, modes, clipping, resize, context restore, feedback and attachment checks passed for both houses.');
