// PINCH_FLIP_208: Ctrl + wheel (the touchpad's pinch) zooms the other way than before; the plain wheel unchanged.
// node pin.mjs <plugin>  ->  "PINCH-OK" or the failures
import { open } from '../fs/h.mjs';
const [,, dir] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const dist = () => pg.evaluate(() => { const c = window.__ctx; return c.camera.position.distanceTo(c.controls.target); });
const wheel = (dy, ctrl, n) => pg.evaluate(([dy, ctrl, n]) => {
  const cv = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0];
  const r = cv.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  for (let i = 0; i < n; i++) cv.dispatchEvent(new WheelEvent('wheel', { deltaY: dy, deltaMode: 0, ctrlKey: ctrl, clientX: x, clientY: y, bubbles: true, cancelable: true }));
}, [dy, ctrl, n]);
const reset = () => pg.evaluate(() => { const c = window.__ctx; c.camera.position.set(-150, 120, 160); c.controls.target.set(0, 20, 0); c.camera.lookAt(0, 20, 0); c.controls.update && c.controls.update(); });
const out = [];
for (const [name, dy, ctrl, want] of [['pinch dy>0', 8, true, 'closer'], ['pinch dy<0', -8, true, 'farther'], ['wheel up', -100, false, 'closer'], ['wheel down', 100, false, 'farther']]) {
  await reset(); await pg.waitForTimeout(600);
  const d0 = await dist();
  await wheel(dy, ctrl, 6); await pg.waitForTimeout(900);
  const d1 = await dist();
  const got = d1 < d0 - 0.01 ? 'closer' : d1 > d0 + 0.01 ? 'farther' : 'same';
  out.push(name + ': ' + d0.toFixed(1) + ' -> ' + d1.toFixed(1) + ' ' + got + (got === want ? '' : '  FAIL (want ' + want + ')'));
}
console.log(out.join('\n'));
console.log(out.some((l) => /FAIL/.test(l)) ? 'PINCH-FAILED' : 'PINCH-OK', 'errors:', JSON.stringify(P.errs.slice(0, 3)));
await P.close(); process.exit(0);
