// what stands in the eye of a stage: node pick.mjs <plugin> <stage index> <sec> "x,y;x,y" (screen fractions)
import { open } from '../fs/h.mjs';
const [,, dir, si, sec, pts] = process.argv;
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
await pg.evaluate(async () => { const S = window.__ctx.shared; S.tamid.setOrder('abba'); S.tour.start('tamid', { speed: 1 }); await new Promise((r) => setTimeout(r, 1500)); });
await pg.evaluate(async (i) => { const T = window.__ctx.shared.tour; T.goto(+i); await new Promise((r) => setTimeout(r, 300)); }, si);
for (let k = 0; k < 400; k++) { const s = await pg.evaluate(() => +window.__ctx.shared.tamid.sec); if (s >= +sec) break; await pg.waitForTimeout(100); }
const r = await pg.evaluate((pts) => {
  const c = window.__ctx, T = c.THREE, rc = new T.Raycaster(), out = [];
  const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const objs = []; c.scene.traverse((o) => { if (o.isMesh && vis(o)) objs.push(o); });
  for (const p of pts.split(';')) {
    const [x, y] = p.split(',').map(Number);
    rc.setFromCamera(new T.Vector2(x * 2 - 1, -(y * 2 - 1)), c.camera);
    const h = rc.intersectObjects(objs, false).slice(0, 3);
    out.push([p, h.map((e) => { const nm = []; for (let q = e.object; q && nm.length < 5; q = q.parent) nm.push(q.name || q.type); const m = Array.isArray(e.object.material) ? e.object.material[0] : e.object.material; const bb = new T.Box3().setFromObject(e.object); return { bb: [bb.min.toArray().map((v) => +v.toFixed(1)), bb.max.toArray().map((v) => +v.toFixed(1))], geo: e.object.geometry ? e.object.geometry.type : "", d: +e.distance.toFixed(1), at: e.point.toArray().map((v) => +v.toFixed(1)), nm: nm.join('<'), col: m && m.color ? '#' + m.color.getHexString() : '', op: m ? m.opacity : null, ud: JSON.stringify(e.object.userData || {}).slice(0, 80) }; })]);
  }
  return { cam: c.camera.position.toArray().map((v) => +v.toFixed(1)), tg: c.controls.target.toArray().map((v) => +v.toFixed(1)), out };
}, pts);
console.log(JSON.stringify(r, null, 1));
await P.close(); process.exit(0);
