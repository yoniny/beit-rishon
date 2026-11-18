// The text pages of verses slide 41 ("דבקו שערים"): the demonstration filled the slide, so its pages were never held. Render the panel only.
import fs from 'node:fs';
import { serve, launch, openHouse, sleep } from './common.mjs';
const IDX = +(process.argv[2] || 41);
const { srv, port } = await serve();
const browser = await launch();
try {
  const page = await openHouse(browser, port, 'rishon', 1280, 720);
  await page.addStyleTag({ content: fs.readFileSync('/home/claude/usb/rec/fonts.css', 'utf8') + '\n' + fs.readFileSync('/home/claude/usb/rec/projector.css', 'utf8') });
  await page.evaluate(async () => { await Promise.all(['500 25px "Noto Sans Hebrew"', '600 17px "Noto Sans Hebrew"', '700 32px "Noto Sans Hebrew"', '400 31px "Frank Ruhl Libre"'].map((f) => document.fonts.load(f, 'אבג שָׁלוֹם 123'))); await document.fonts.ready; });
  await page.evaluate((i) => { const T = window.__ctx.shared.tour; T.start('verses'); T.goto(i); T.pause(true); }, IDX);
  await sleep(1500);
  await page.evaluate(fs.readFileSync('/home/claude/usb/rec/cap.js', 'utf8'));
  const pl = await page.evaluate(() => window.__cap.pages());
  console.log(JSON.stringify(pl));
  for (let k = 0; k < pl.length; k++) {
    await page.evaluate((k) => window.__cap.showPage(k), k);
    await sleep(300);
    await page.screenshot({ path: `/home/claude/usb/out/panel${IDX}-${k + 1}.png`, clip: { x: 0, y: 0, width: 420, height: 720 } });
  }
} finally { await browser.close(); srv.close(); }
