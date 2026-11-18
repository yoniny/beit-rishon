// Design check: the verses presentation in the projector layout; a few slides (real time), screenshots. node look2.mjs 1,13,35
import fs from 'node:fs';
import { serve, launch, openHouse, sleep } from './common.mjs';
const slides = (process.argv[2] || '1,13,35').split(',').map(Number);
const { srv, port } = await serve();
const browser = await launch();
try {
  const page = await openHouse(browser, port, 'rishon', 1280, 720);
  await page.addStyleTag({ content: fs.readFileSync('/home/claude/usb/rec/fonts.css', 'utf8') + '\n' + fs.readFileSync('/home/claude/usb/rec/projector.css', 'utf8') });
  await page.evaluate(async () => { await Promise.all(['500 23px "Noto Sans Hebrew"', '700 29px "Noto Sans Hebrew"', '400 28px "Frank Ruhl Libre"', '600 17px "Noto Sans Hebrew"'].map((f) => document.fonts.load(f, 'אבג שָׁלוֹם 123'))); await document.fonts.ready; });
  await page.evaluate(() => window.__ctx.shared.tour.start('verses'));
  for (const i of slides) {
    await page.evaluate((i) => window.__ctx.shared.tour.goto(i), i);
    for (let k = 0; k < 30; k++) {
      await sleep(1000);
      await page.evaluate(() => { const cf = document.getElementById('tm-confirm'); if (cf && cf.style.display === 'flex') cf.querySelector('.y').click(); });
    }
    await page.evaluate(() => window.__ctx.shared.tour.pause(true));
    await sleep(1500);
    const info = await page.evaluate(() => { const b = document.querySelector('#tm-tour-box .body'); return { sh: b.scrollHeight, ch: b.clientHeight, ttl: document.querySelector('#tm-tour-box .ttl').textContent }; });
    console.log('slide', i + 1, JSON.stringify(info));
    await page.screenshot({ path: '/home/claude/usb/rec/look2-' + (i + 1) + '.png' });
    await page.evaluate(() => window.__ctx.shared.tour.pause(false));
  }
} finally { await browser.close(); srv.close(); }
