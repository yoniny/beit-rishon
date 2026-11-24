// Reproducible scene/resource report using the shipped Three.js and real WebGL.
// node tools/perf-scene.mjs <unified plugin directory> <rishon|sheni> <output directory>
// Software WebGL timings describe this runner, not a user's GPU or FPS.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const [directory = 'dist-unified/plugin', house = 'rishon', output = 'qa/performance'] = process.argv.slice(2);
assert(['rishon', 'sheni'].includes(house), 'house must be rishon or sheni');
fs.mkdirSync(output, { recursive: true });
const cfg = JSON.parse(/var CFG = (\{[\s\S]*?\});\n/.exec(fs.readFileSync(path.join(directory, 'index.html'), 'utf8'))[1]);
const report = { house, viewport: [960, 600, 1], renderer: 'Chromium / SwiftShader', errors: [], scenes: [] };
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, timeout: 60000, protocolTimeout: 240000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist', '--no-first-run', '--disable-background-networking', '--disable-sync']
});
try {
  const page = await browser.newPage();
  page.on('pageerror', e => report.errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/404|favicon/.test(m.text())) report.errors.push(m.text()); });
  await page.setViewport({ width: 960, height: 600, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument((versions) => {
    let seed = 123456789;
    Math.random = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296; };
    try { localStorage.setItem('tm1.news.seen', versions.rishon); localStorage.setItem('tm2.news.seen', versions.sheni); } catch (_) {}
  }, { rishon: cfg.houses.rishon.version, sheni: cfg.houses.sheni.version });
  const start = Date.now();
  await page.goto(pathToFileURL(path.resolve(directory, house, 'index.html')).href, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 240000, polling: 500 });
  report.readyMs = Date.now() - start;
  await page.evaluate(() => {
    window.__renderer.setAnimationLoop(null);
    window.__perfNow = performance.now.bind(performance);
    window.__perfTime = 60000;
    performance.now = () => window.__perfTime;
    window.__ctx.controls.autoRotate = false;
    for (const id of ['tm-news', 'tm-help']) document.getElementById(id)?.remove();
  });
  for (const view of ['overview', 'interior']) {
    const scene = await page.evaluate((view) => {
      const c = window.__ctx, r = window.__renderer, now = window.__perfNow;
      if (view === 'interior') {
        const p = c.shared.flyPoints.kodesh;
        if (p) { c.camera.position.fromArray(p.pos); c.controls.target.fromArray(p.target); }
      }
      c.controls.update();
      for (let i = 0; i < 5; i++) { c.scene.updateMatrixWorld(true); for (const fn of c.animated) fn(window.__perfTime); }
      const hooks = c.animated.map((fn, i) => ({ i, source: fn.toString().slice(0, 100), ms: 0 }));
      const samples = [];
      for (let frame = 0; frame < 30; frame++) {
        const start = now();
        for (let i = 0; i < c.animated.length; i++) {
          const t = now(); c.animated[i](window.__perfTime); hooks[i].ms += now() - t;
        }
        samples.push(now() - start);
      }
      c.scene.updateMatrixWorld(true);
      // Let the shadow cache settle without advancing animation. A single render
      // can include a shadow refresh in only one revision and distort draw counts.
      for (let i = 0; i < 3; i++) r.render(c.scene, c.camera);
      const queries = [];
      const measure = (name, query) => {
        const times = []; let result;
        query();
        for (let i = 0; i < 7; i++) { const t = now(); result = query(); times.push(now() - t); }
        times.sort((a, b) => a - b);
        queries.push({ name, medianMs: times[3], result });
      };
      measure('floor-camera', () => window.__ent360.floorY(c.camera.position));
      measure('floor-target', () => window.__ent360.floorY(c.controls.target));
      const rect = r.domElement.getBoundingClientRect();
      for (const [name, x, y] of [['center', 0.5, 0.5], ['left', 0.2, 0.5], ['right', 0.8, 0.5]]) {
        measure('zoom-' + name, () => window.__zoomQA.at(rect.left + rect.width * x, rect.top + rect.height * y));
      }
      const geometries = new Set(), materials = new Set(), arrays = new Set();
      let objects = 0, meshes = 0, vertices = 0;
      c.scene.traverse(o => {
        objects++;
        if (o.isMesh) meshes++;
        if (o.geometry) geometries.add(o.geometry);
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m) materials.add(m);
      });
      for (const g of geometries) {
        vertices += g.attributes.position?.count || 0;
        for (const a of Object.values(g.attributes || {})) { const b = a.array || a.data?.array; if (b) arrays.add(b.buffer); }
        if (g.index) arrays.add(g.index.array.buffer);
      }
      samples.sort((a, b) => a - b);
      return { view, objects, meshes, geometries: geometries.size, materials: materials.size, vertices,
        geometryBufferBytes: [...arrays].reduce((n, b) => n + b.byteLength, 0),
        draw: { ...r.info.render }, gpuResources: { ...r.info.memory },
        animatedCallbacks: c.animated.length, callbackMedianMs: samples[Math.floor(samples.length / 2)], callbackSamplesMs: samples,
        topCallbacks: hooks.sort((a, b) => b.ms - a.ms).slice(0, 12), queries,
        camera: c.camera.position.toArray(), target: c.controls.target.toArray() };
    }, view);
    report.scenes.push(scene);
    await page.screenshot({ path: path.join(output, `${house}-${view}.png`) });
    console.log('[scene]', house, JSON.stringify(scene));
  }
  report.effects = [];
  for (const [name, ao, gi] of [['ao', true, false], ['gi', false, true], ['ao-gi', true, true], ['off', false, false]]) {
    const effect = await page.evaluate(async (name, ao, gi) => {
      const h = window.__hq, r = window.__renderer, c = window.__ctx;
      h.set(ao, gi);
      const start = window.__perfNow();
      while (gi && h.S.giWarm !== 2) {
        if (window.__perfNow() - start > 60000) throw new Error('GI shader warmup timed out');
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      h.frame(); r.render(c.scene, c.camera);
      if (h.S.error) throw new Error('HQ: ' + h.S.error);
      if (h.S.ao !== ao || h.S.gi !== gi) throw new Error('HQ effect failed to stay enabled');
      // renderer.info auto-resets per render: this describes the final beauty pass,
      // not the normal/lit/fullscreen passes that h.frame() performed beforehand.
      return { name, ao: h.S.ao, gi: h.S.gi, gpuResources: { ...r.info.memory }, beautyDraw: { ...r.info.render } };
    }, name, ao, gi);
    report.effects.push(effect);
    await page.screenshot({ path: path.join(output, `${house}-${name}.png`) });
    console.log('[effect]', house, JSON.stringify(effect));
  }
  assert.equal(report.errors.length, 0, report.errors.join('\n'));
} finally {
  await browser.close();
  fs.writeFileSync(path.join(output, `${house}.json`), JSON.stringify(report, null, 2));
  console.log('[performance]', JSON.stringify(report));
}
