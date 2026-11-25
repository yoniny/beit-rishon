import { openHouse } from '/home/claude/fix/rel/tools/scan/lib.mjs';
const [plugin, W, H] = process.argv.slice(2);
const S = await openHouse(plugin, 'sheni', { w: +W, h: +H, frozen: true });
const r = await S.ev(async () => {
  const SC = window.__SCAN, c = window.__TM_CTX; const b = c.ui.placeButton("הבאת ביכורים — הדגמה"); SC.clickEl(b); await SC.afterClick(6000);
  for (let k = 0; k < 20; k++) { window.__step(100); await SC.sleep(20); }
  const bar = [...document.querySelectorAll('div')].find((d) => d.style.position === 'fixed' && /מהר יותר|\+/.test(d.textContent) && d.querySelector('button') && d.style.zIndex === '60');
  const tb = document.getElementById('tm-topbar'), tbn = document.getElementById('tm-topbtns');
  const R = (e) => { if (!e) return null; const q = e.getBoundingClientRect(); return [q.left, q.top, q.width, q.height].map(Math.round); };
  const kids = tbn ? [...tbn.children].map((k) => [k.textContent.trim().slice(0, 14), Math.round(k.getBoundingClientRect().width)]) : [];
  return { bar: R(bar), barDir: bar && bar.style.flexDirection, tb: R(tb), tbn: R(tbn), kids, left: tb ? [...tb.children].map((k) => [k.id || k.className, R(k)]) : [] };
}, {});
console.log(JSON.stringify(r));
await S.close();
