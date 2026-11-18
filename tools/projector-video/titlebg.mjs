// The title card's background: the general view of the model, without any interface or labels.
import fs from 'node:fs';
import { serve, launch, openHouse, sleep } from './common.mjs';
const { srv, port } = await serve();
const browser = await launch();
try {
  const page = await openHouse(browser, port, 'rishon', 1280, 720);
  await page.addStyleTag({ content: fs.readFileSync('/home/claude/usb/rec/projector.css', 'utf8') + '\n#tm-tour-box{display:none!important}' });
  const layers = await page.evaluate(() => Object.keys(window.__ctx.layers || {}).map((k) => k + ':' + (window.__ctx.layers[k] && window.__ctx.layers[k].visible ? 1 : 0)));
  console.log('layers', layers.join(' '));
  await page.evaluate(() => { const L = window.__ctx.layers || {}; for (const k of Object.keys(L)) if (/label/i.test(k) && L[k]) L[k].visible = false;
    window.__ctx.scene.traverse((o) => { if (o.name === 'labels' || o.isSprite) o.visible = false; }); });
  await sleep(6000);
  await page.screenshot({ path: '/home/claude/usb/rec/title-bg.png' });
} finally { await browser.close(); srv.close(); }
