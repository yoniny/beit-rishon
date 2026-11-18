import { launch, sleep } from './common.mjs';
const browser = await launch();
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await page.goto('file:///home/claude/usb/rec/title.html', { waitUntil: 'load' });
  await page.evaluate(async () => { await document.fonts.load('700 78px "Noto Sans Hebrew"', 'בית'); await document.fonts.load('500 37px "Noto Sans Hebrew"', 'בית'); await document.fonts.ready; });
  await sleep(500);
  await page.screenshot({ path: '/home/claude/usb/rec/title.jpg', type: 'jpeg', quality: 92 });
} finally { await browser.close(); }
