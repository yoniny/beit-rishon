// Real WebGL lifecycle/equivalence check for the one-shot environment bake.
// CHROME=/usr/bin/chromium node tools/perf-environment.mjs
// This checks the actual shipped Three.js and entry block, without loading a temple.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import { houseText } from './house-slots.mjs';

const library = houseText('rishon', '00-lib.js');
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});
const results = [];
try {
  for (const house of ['rishon', 'sheni']) {
    const entry = houseText(house, '90-entry.js');
    const start = entry.indexOf('  var pmrem = new PMREMGenerator(renderer);');
    const end = entry.indexOf('  var sky = new Sky();', start);
    assert(start >= 0 && end > start, 'production environment bake is present');
    const assignment = 'scene.environment = pmrem.fromScene(ent_room, 0.04).texture;';
    const source = entry.slice(start, end).replace(assignment, assignment + '\n    recordBefore(pmrem, ent_room);');
    const page = await browser.newPage(), errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error' && !/404|favicon/.test(message.text())) errors.push(message.text()); });
    await page.setContent('<!doctype html><canvas></canvas>');
    await page.addScriptTag({ content: library + '\nreturn { ...three_module_exports, bake(renderer, scene, recordBefore) {\n' + source + '\n} };})();' });
    const result = await page.evaluate(() => {
      const T = OtzariaPlugin;
      const renderer = new T.WebGLRenderer({ canvas: document.querySelector('canvas'), antialias: false });
      renderer.setSize(96, 96);
      const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, 1, 0.1, 20);
      scene.background = new T.Color(0x102030);
      camera.position.set(0, 0, 4);
      const material = new T.MeshStandardMaterial({ color: 0xe7be75, metalness: 0.65, roughness: 0.25 });
      scene.add(new T.Mesh(new T.SphereGeometry(1, 24, 16), material));
      const output = new T.WebGLRenderTarget(96, 96), pixels = () => {
        renderer.setRenderTarget(output);
        renderer.render(scene, camera);
        const buffer = new Uint8Array(96 * 96 * 4);
        renderer.readRenderTargetPixels(output, 0, 0, 96, 96, buffer);
        renderer.setRenderTarget(null);
        return buffer;
      };
      let original, before, sourceDisposed = 0, environmentDisposed = 0, instanceDisposed = 0;
      const roomResources = new Set(), disposedRoomResources = new Set();
      let sourceSize, sourceFormat, beforePixels;
      T.bake(renderer, scene, (generator, room) => {
        original = scene.environment;
        original.addEventListener('dispose', () => environmentDisposed++);
        const source = generator._sourceTarget;
        sourceSize = source.width;
        sourceFormat = { halfFloat: source.texture.type === T.HalfFloatType, cube: !!source.isWebGLCubeRenderTarget,
          mipmaps: source.texture.generateMipmaps, depth: source.depthBuffer };
        source.addEventListener('dispose', () => sourceDisposed++);
        room.traverse(object => {
          if (object.isInstancedMesh) object.addEventListener('dispose', () => instanceDisposed++);
          for (const resource of [object.geometry, ...(Array.isArray(object.material) ? object.material : [object.material])]) {
            if (resource && !roomResources.has(resource)) {
              roomResources.add(resource);
              resource.addEventListener('dispose', () => disposedRoomResources.add(resource));
            }
          }
        });
        beforePixels = pixels();
        before = { ...renderer.info.memory, programs: renderer.info.programs.length };
      });
      const afterPixels = pixels();
      let differingBytes = 0, nonBackgroundPixels = 0;
      for (let i = 0; i < afterPixels.length; i++) if (afterPixels[i] !== beforePixels[i]) differingBytes++;
      for (let i = 0; i < beforePixels.length; i += 4) {
        if (beforePixels[i] !== beforePixels[0] || beforePixels[i + 1] !== beforePixels[1] || beforePixels[i + 2] !== beforePixels[2]) nonBackgroundPixels++;
      }
      const after = { ...renderer.info.memory, programs: renderer.info.programs.length };
      const result = { before, after, differingBytes, nonBackgroundPixels, sameEnvironment: original === scene.environment,
        sourceDisposed, environmentDisposed, instanceDisposed, roomResources: roomResources.size,
        disposedRoomResources: disposedRoomResources.size, sourceSize, sourceFormat };
      output.dispose();
      renderer.dispose();
      return result;
    });
    assert.deepEqual(errors, []);
    assert(result.nonBackgroundPixels > 1000, 'the test must actually render an environment-lit object');
    assert.equal(result.differingBytes, 0, 'cleanup must preserve every rendered byte');
    assert.equal(result.sameEnvironment, true);
    assert.equal(result.environmentDisposed, 0, 'the generated PMREM remains owned by the scene');
    assert.equal(result.sourceDisposed, 1);
    assert.equal(result.instanceDisposed, 1, 'the room instance buffer is also released');
    assert.equal(result.disposedRoomResources, result.roomResources);
    assert.equal(result.after.textures, result.before.textures - 1, 'one retained source cubemap is released');
    assert.equal(result.after.geometries, result.before.geometries - 2, 'room and generator geometries are released');
    results.push({ house, ...result });
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
const out = process.argv.indexOf('--out');
if (out >= 0) fs.writeFileSync(process.argv[out + 1], JSON.stringify(results, null, 2) + '\n');
console.log('Environment cleanup keeps exact rendered pixels and releases bake-only GPU resources for both houses.');
