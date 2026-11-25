// node shot.mjs <plugin> <cfg-json> <out-prefix> <poses-json [[name,[px,py,pz],[tx,ty,tz]],...]>
import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
import fs from 'node:fs';
const [plugin, cfgS, pre, posesS] = process.argv.slice(2);
const S = await openHouse(plugin, process.env.HOUSE || 'sheni', { w: 960, h: 600, frozen: true });
await S.ev(async (cfg) => {
  const c = window.__TM_CTX, SH = c.shared;
  if (cfg.salt) SH.saltChamber.set(cfg.salt);
  if (cfg.altar) SH.altarPlace.set(cfg.altar);
  if (cfg.chel) SH.chelSteps.set(cfg.chel);
  if (cfg.duchan) SH.duchanReading.set(cfg.duchan);
  if (cfg.js) (0, eval)(cfg.js);
}, JSON.parse(cfgS));
for (const [nm, p, t] of JSON.parse(posesS)) {
  const r = await S.ev(async ({ p, t }) => { const SC = window.__SCAN; SC.setPose({ p, t }); for (let k = 0; k < 4; k++) { window.__step(40); await SC.sleep(5); } SC.setPose({ p, t }); window.__step(16); SC.px(16); return SC.jpg(960, 0.85); }, { p, t });
  fs.writeFileSync(`${pre}-${nm}.jpg`, Buffer.from(r.split(',')[1], 'base64')); console.log('ok', nm);
}
await S.close();
