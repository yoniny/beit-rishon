// node blackdiag.mjs <plugin> <pre> <secs JSON> -> the lots' demo; at each moment: shot + a state dump (camera, context, exposure, NaNs)
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, pre, secsS] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 1000, h: 640, frozen: true });
const r = await S.ev(async (secsS) => { const c = window.__TM_CTX, SC = window.__SCAN; const b = c.ui.placeButton("ארבעת הפייסות ו״ברקאי״ — הדגמה"); if (!b) return { err: 'no' }; SC.clickEl(b); SC.yes(); window.__step(300); SC.yes();
  const out = [], secs = JSON.parse(secsS); let t = 0;
  const dump = () => { const cam = c.camera, R = c.renderer, gl = R.getContext(); const e = cam.matrixWorld.elements, pe = cam.projectionMatrix.elements;
    let nanObj = 0, nanName = []; c.scene.traverse((o) => { if (o.matrixWorld && o.matrixWorld.elements.some((v) => !Number.isFinite(v))) { nanObj++; if (nanName.length < 5) nanName.push(o.name || o.type); } });
    let lights = 0, lightI = 0; c.scene.traverse((o) => { if (o.isLight && o.visible) { lights++; lightI += o.intensity || 0; } });
    return { lost: gl.isContextLost(), err: gl.getError(), cam: [cam.position.x, cam.position.y, cam.position.z].map((v) => +v.toFixed(2)), near: cam.near, far: cam.far, fov: cam.fov,
      camNaN: e.some((v) => !Number.isFinite(v)), projNaN: pe.some((v) => !Number.isFinite(v)), exp: R.toneMappingExposure, nanObj, nanName, lights, lightI: +lightI.toFixed(2),
      bg: c.scene.background && (c.scene.background.isColor ? c.scene.background.getHexString() : c.scene.background.type || 'tex'), fog: c.scene.fog && [c.scene.fog.near, c.scene.fog.far, c.scene.fog.density, c.scene.fog.color && c.scene.fog.color.getHexString()],
      calls: R.info.render.calls, tris: R.info.render.triangles, alive: SC.alive && SC.alive(), running: SC.running() }; };
  for (const s of secs) { while (t < s) { window.__step(250); t += 0.25; } window.__step(16); out.push({ s, d: dump(), img: SC.jpg(500, 0.8) }); }
  return { out }; }, secsS);
if (r.err) { console.log(r.err); process.exit(0); }
r.out.forEach((o, k) => { fs.writeFileSync(`${pre}-${k}.jpg`, Buffer.from(o.img.split(',')[1], 'base64')); console.log(o.s, JSON.stringify(o.d)); });
await S.close();
