// try cameras without a rebuild: node camtry.mjs <plugin dir> <out dir> <step>...
//   steps: C:ri:key (press a chip, wait)  |  V:name:px,py,pz:tx,ty,tz (place the camera, photograph the page as <name>)  |  J:<js (c, q)>  |  O:<model button id>:1|0  |  S:<name> (photograph the page as it stands)  |  W:<ms>
import { open } from '/home/claude/qa/fs/h.mjs'; import fs from 'fs'; import path from 'path';
const [,, dir, out, ...steps] = process.argv; fs.mkdirSync(out, { recursive: true });
const P = await open(dir, { vw: +(process.env.VW || 1680), vh: +(process.env.VH || 760), dsf: +(process.env.DSF || 0.5) }); const pg = P.page;
for (const st of steps) {
  const k = st[0], a = st.slice(2);
  try {
    if (k === 'C') { const [ri, key] = a.split(':'); await pg.evaluate(([ri, key]) => { const c = window.__ctx; const r = c.ui.opinions[ri]; const j = r.options.findIndex((o) => o[0] === key); const box = [...document.querySelectorAll('.tm-op')].find((b) => (b.querySelector('.cap') || {}).textContent === r.cap); const b = box ? [...box.querySelectorAll('button')][j] : null; if (b) b.click(); else { r.onPick(key); if (r.mark) r.mark(key); } }, [+ri, key]); await pg.waitForTimeout(700); const cf = await pg.evaluate(() => { const q = window.__q; const m = q.confirm(); if (m) q.confirmYes(); return m; }); await P.settle(30000, 10); await pg.waitForTimeout(500); console.log('C', a, JSON.stringify(await pg.evaluate(() => window.__q.cam()))); }
    else if (k === 'V') { const [name, p, t] = a.split(':'); const r = await pg.evaluate(([p, t]) => { const c = window.__ctx; c.camera.position.set(p[0], p[1], p[2]); c.controls.target.set(t[0], t[1], t[2]); c.controls.update(); return true; }, [p.split(',').map(Number), t.split(',').map(Number)]); await pg.evaluate(() => window.__q.frames(4)); await pg.evaluate(() => { window.__q.grab(); }); await pg.screenshot({ path: path.join(out, name + '.jpg'), type: 'jpeg', quality: 80 }); console.log('V', name); }
    else if (k === 'J') console.log('J', JSON.stringify(await pg.evaluate((js) => (new Function('c', 'q', js))(window.__ctx, window.__q), a)));
    else if (k === 'O') { const [id, on] = a.split(':'); console.log('O', id, await pg.evaluate(([id, on]) => { const b = (window.__ctx.shared.modelButtons || []).find((b) => b.id === id); if (!b) return 'no button'; b.set(on === '1'); return b.get(); }, [id, on])); await pg.evaluate(() => window.__q.frames(4)); }
    else if (k === 'S') { await P.settle(20000, 10); await pg.evaluate(() => window.__q.frames(4)); await pg.evaluate(() => { window.__q.grab(); }); await pg.screenshot({ path: path.join(out, a + '.jpg'), type: 'jpeg', quality: 80 }); console.log('S', a, JSON.stringify(await pg.evaluate(() => window.__q.cam()))); }   // the page as it stands (after a press)
    else if (k === 'W') await pg.waitForTimeout(+a);
  } catch (e) { console.log('ERR', st, String(e).slice(0, 200)); }
}
console.log('errs', JSON.stringify(P.errs.slice(0, 3)));
await P.close();
