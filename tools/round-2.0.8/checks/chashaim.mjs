// the chamber of secret gifts (CHASHAIM_208): place, refs, pictures. node check.mjs <plugin> <outdir>
import { open } from '../fs/h.mjs';
import fs from 'node:fs';
const [,, dir, out] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir); const pg = P.page;
await P.settle(30000, 3);
const info = await pg.evaluate(() => { const c = window.__ctx, S = c.shared, g = c.layers.chashaim;
  const refs = ['Mishnah_Shekalim.5.6', 'Bartenura_on_Mishnah_Shekalim.5.6', 'Tosafot_Yom_Tov_on_Mishnah_Shekalim.5.6'].map((r) => r + ' -> ' + JSON.stringify(S.refIndex(r)));
  const b = new (c.camera.position.constructor)(); let box = null;
  if (g) { g.updateMatrixWorld(true); const B = new (window.__ctx.__Box3 || Object)(); }
  return { at: S.chashaim && S.chashaim.at, layer: !!g, kids: g ? g.children.length : 0, refs }; });
console.log(JSON.stringify(info, null, 1));
const cam = async (name, e, t) => { await pg.evaluate(([e, t]) => { const c = window.__ctx; c.camera.position.set(...e); c.controls.target.set(...t); c.camera.lookAt(...t); }, [e, t]); await pg.waitForTimeout(1200); await P.settle(20000, 6); await P.rshot(out + '/' + name + '.png'); };
await cam('1-card', [-10, 31, 38], [3, 19, 56.5]);
await cam('2-wide', [-25, 95, 85], [3, 16, 57]);
await cam('3-east', [20, 27, 54], [3, 18, 58]);
console.log('errors:', JSON.stringify(P.errs.slice(0, 6)));
await P.close(); process.exit(0);
