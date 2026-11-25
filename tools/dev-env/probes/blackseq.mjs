// node blackseq.mjs <plugin> <titles separated by |> -> for each demo place in turn: start, run 25 s, shot, mean brightness (SC.alive)
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, titlesS, pre] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: 640, h: 400, frozen: true });
for (const [i, t] of titlesS.split('|').entries()) {
  const r = await S.ev(async (t) => { const c = window.__TM_CTX, SC = window.__SCAN; await SC.stopAll(); window.__step(200);
    const b = c.ui.placeButton(t); if (!b) return { err: 'no button ' + t }; SC.clickEl(b); SC.yes(); window.__step(300); await SC.sleep(15); SC.yes();
    const al = []; for (let k = 0; k < 50; k++) { window.__step(500); if (k % 10 === 9) { al.push(SC.alive()); await SC.sleep(2); } }
    return { running: SC.running(), al: al.map((a) => a && +(+a.mean).toFixed(1)), exp: c.renderer.toneMappingExposure, img: SC.jpg(640, 0.8) }; }, t);
  if (r.err) { console.log(r.err); continue; }
  fs.writeFileSync(`${pre}-${i}.jpg`, Buffer.from(r.img.split(',')[1], 'base64'));
  console.log(i, t, JSON.stringify({ running: r.running, al: r.al, exp: r.exp }));
}
await S.close();
