// node perfcmp.mjs <plugin> <house> -> renderer stats and per-frame JS cost in the calm view and in the court
import { openHouse, sleep } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, house] = process.argv.slice(2);
const S = await openHouse(plugin, house, { w: 1280, h: 720, frozen: false });
await sleep(4000);
const out = {};
const measure = async (label, pose) => {
  const r = await S.ev(async (pose) => {
    const c = window.__TM_CTX, SC = window.__SCAN;
    if (pose) SC.setPose(pose);
    await new Promise((res) => setTimeout(res, 1500));
    // instrument the animated callbacks
    const A = c.animated, T = new Map();
    const orig = A.slice();
    for (let i = 0; i < A.length; i++) { const f = orig[i]; A[i] = function (...a) { const t0 = performance.now(); const v = f.apply(this, a); T.set(i, (T.get(i) || 0) + performance.now() - t0); return v; }; }
    const ft = []; let last = performance.now(); const t0 = last;
    await new Promise((res) => { const f = (now) => { ft.push(now - last); last = now; if (now - t0 < 4000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
    for (let i = 0; i < orig.length; i++) A[i] = orig[i];
    const n = ft.length, info = c.renderer.info;
    const top = [...T.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([i, t]) => [+(t / n).toFixed(2), String(orig[i]).slice(0, 90).replace(/\s+/g, ' ')]);
    let meshes = 0, vis = 0; c.scene.traverse((o) => { if (o.isMesh) { meshes++; let v = true; for (let q = o; q; q = q.parent) if (!q.visible) { v = false; break; } if (v) vis++; } });
    return { frames: n, avgMs: +(ft.reduce((a, b) => a + b, 0) / n).toFixed(1), calls: info.render.calls, tris: info.render.triangles, geos: info.memory.geometries, texs: info.memory.textures, progs: (info.programs || []).length, meshes, vis, animated: orig.length, animMsPerFrame: +([...T.values()].reduce((a, b) => a + b, 0) / n).toFixed(2), top };
  }, pose);
  out[label] = r;
};
await measure('calm', null);
await measure('court', house === 'sheni' ? { p: [140, 60, 40], t: [20, 20, 0] } : { p: [60, 40, 60], t: [0, 15, 0] });
console.log(JSON.stringify(out));
await S.close();
