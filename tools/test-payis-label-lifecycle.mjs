// Replay both real lottery scripts with the production label painter and real Three.js resources.
// Canvas drawing is recorded, not rasterized; this compares text, texture settings and sprite state, not pixels.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildModel } from './perf-geometry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Keep the reference reachable from upstream even when this PR is squash-merged.
const baselineRef = '695456732c1d93db67268d13b7367cca76783aee';
const baselineRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'beit-payis-baseline-'));
const sprites = ctx => ctx.scene.getObjectByName('payisDemo').children.filter(o => o.isSprite);
const visible = ctx => JSON.parse(JSON.stringify(sprites(ctx).filter(s => s.visible).map(s => ({
  position: s.position.toArray(), scale: s.scale.toArray(), rotation: s.rotation.toArray(),
  renderOrder: s.renderOrder, depthTest: s.material.depthTest, depthWrite: s.material.depthWrite,
  transparent: s.material.transparent, opacity: s.material.opacity, color: s.material.color.getHex(),
  texture: { width: s.material.map.image.width, height: s.material.map.image.height,
    text: s.material.map.image.textCalls, colorSpace: s.material.map.colorSpace,
    anisotropy: s.material.map.anisotropy, minFilter: s.material.map.minFilter, magFilter: s.material.map.magFilter }
})).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))));
const counts = ctx => {
  const ss = sprites(ctx);
  return { sprites: ss.length, materials: new Set(ss.map(s => s.material)).size,
    textures: new Set(ss.map(s => s.material.map)).size };
};

try {
  const archive = execFileSync('git', ['archive', baselineRef, 'src', 'sheni/src', 'shared'], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', baselineRoot], { input: archive });
  const before = await buildModel('sheni', baselineRoot, { uiLabels: true });
  const after = await buildModel('sheni', root, { uiLabels: true });
  let states = 0, peakVisible = 0;
  const sampleTimes = new Map();
  for (const reading of ['tamid', 'rambam']) {
    before.shared.payis.setReading(reading); after.shared.payis.setReading(reading);
    const timeline = after.shared.payis.timeline();
    assert.equal(JSON.stringify(timeline), JSON.stringify(before.shared.payis.timeline()));
    // Visit every caption, including the end of the thirteen-winner sequence and backward seeks.
    const times = [...new Set([0, ...timeline.caps.map(([t]) => Math.min(t + 2, timeline.dur)), timeline.dur - 0.1])].sort((a, b) => a - b);
    sampleTimes.set(reading, times);
    for (const t of [...times, ...times.slice().reverse()]) {
      before.shared.payis.at(t, true); after.shared.payis.at(t, true);
      const expected = visible(before), actual = visible(after);
      assert.deepEqual(actual, expected, `${reading}/${t}: winner caption, scale or placement changed`);
      peakVisible = Math.max(peakVisible, actual.length); states++;
    }
    before.shared.payis.stop(); after.shared.payis.stop();
    assert.equal(visible(after).length, 0);
  }
  assert.equal(peakVisible, 13, 'the full set of thirteen simultaneous winners must have been exercised');
  const warm = counts(after), originalAfterComparisons = counts(before);
  assert(warm.sprites > 0 && warm.sprites < originalAfterComparisons.sprites, 'test must expose accumulation in the original');
  const identities = sprites(after).map(s => [s, s.material, s.material.map]);
  let disposals = 0;
  for (const [, material, texture] of identities) for (const r of [material, texture]) r.addEventListener('dispose', () => disposals++);
  // Simulate repeated playback, scrubbing, restart and reading changes through the public API.
  for (let cycle = 0; cycle < 20; cycle++) {
    const reading = cycle % 2 ? 'tamid' : 'rambam', p = after.shared.payis;
    p.setReading(reading); p.start();
    for (const t of sampleTimes.get(reading)) p.at(t, true);
    p.seek(p.dur() - 0.1); p.at(0, true); p.start(); p.at(p.dur() - 0.1, true); p.stop();
    assert.equal(visible(after).length, 0, 'stop must hide every winner');
    assert.deepEqual(counts(after), warm, 'replaying must not allocate more winner sprites/materials/textures');
    assert.equal(sprites(after).length, identities.length);
    sprites(after).forEach((s, i) => {
      assert.equal(s, identities[i][0]); assert.equal(s.material, identities[i][1]); assert.equal(s.material.map, identities[i][2]);
    });
  }
  assert.equal(disposals, 0, 'reusing a pooled sprite must keep its live texture and material');
  console.log(JSON.stringify({ payisLabelLifecycle: { baselineRef, equivalentStates: states, readings: 2,
    peakVisible, replayCycles: 20, originalAfterComparisons, pooledAfterComparisons: warm, afterReplays: counts(after),
    note: 'Actual scripts and label painter with a canvas stub; resource bounds and equivalent visible inputs, not GPU pixels.' } }, null, 2));
} finally {
  fs.rmSync(baselineRoot, { recursive: true, force: true });
}
