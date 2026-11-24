// Category 4 - the menus and cards at five window sizes (1920x1080, 1366x768, 1280x720, 800x600, mobile 390x800): clipping, overflow, text cut,
// elements out of the frame, covered and doubled buttons - in the house's frame and in the shell, in four states of the UI.
import fs from 'node:fs';
import path from 'node:path';
import { INPAGE, sleep } from './lib.mjs';
const UISCAN = fs.readFileSync(new URL('./uiscan.js', import.meta.url), 'utf8');
export const SIZES = [[1920, 1080, false], [1366, 768, false], [1280, 720, false], [800, 600, false], [390, 800, true]];
export async function run(S, out, opt) {
  const sizes = opt.sizes ? SIZES.filter((s) => String(opt.sizes).split(',').includes(s[0] + 'x' + s[1])) : SIZES;
  const issues = new Map();   // type|el|text -> { sizes: Set, states: Set, ...f }
  out.stats.sizes = sizes.map((s) => s[0] + 'x' + s[1]);
  for (const [w, h, mobile] of sizes) {
    const tag = mobile ? `${w}x${h} (מובייל)` : `${w}x${h}`;
    await S.page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });   // (isMobile / hasTouch would RELOAD the page and detach the house's frame: the phone is only a 390x800 window here)
    await sleep(500);
    await S.ev(() => { window.dispatchEvent(new Event('resize')); window.__step(300); });
    const states = [
      ['ברירת מחדל', async () => {}],
      ['לוח פתוח עם כל הקבוצות', async () => { await S.ev(() => { const p = document.getElementById('tm-panel'); if (p) p.style.display = ''; for (const d of document.querySelectorAll('#tm-panel details')) d.open = true; window.__step(200); }); }],
      ['כרטיס הסבר פתוח', async () => { await S.ev(async () => { const c = window.__TM_CTX; const t = c.ui.places().find((p) => p.fp); const b = c.ui.placeButton(t.title); window.__SCAN.clickEl(b); window.__step(6000); await window.__SCAN.sleep(30); window.__SCAN.yes(); window.__step(300); }); }],
      ['הדגמה רצה (פס שליטה)', async () => { await S.ev(async () => { const c = window.__TM_CTX, SC = window.__SCAN; const d = (c.shared.demoStops || []).find((x) => typeof x.pause === 'function'); const mb = (c.shared.modelButtons || []).find((b) => d && b.id === d.id) || (c.shared.modelButtons || []).find((b) => /^הדגמ/.test(b.label || '')); if (mb) { try { mb.set(true); } catch (_) {} SC.yes(); for (let i = 0; i < 6; i++) window.__step(500); await SC.sleep(450); window.__step(100); } }); }],
      ['מצגת פעילה', async () => { await S.ev(async () => { const c = window.__TM_CTX; await window.__SCAN.stopAll(); if (c.shared.tour) { try { c.shared.tour.start('continuous'); } catch (_) {} window.__step(2500); await window.__SCAN.sleep(400); window.__step(600); } }); }]
    ];
    for (const [sname, prep] of states) {
      try { await prep(); } catch (e) { out.add('low', `מצב "${sname}" לא הוכן בגודל ${tag}`, String(e.message).slice(0, 200)); }
      await sleep(350);
      const inFrame = await S.fr.evaluate(UISCAN).catch((e) => []);
      const inShell = await S.page.evaluate(UISCAN).catch(() => []);
      for (const [where, list] of [['בית', inFrame], ['מעטפת', inShell]]) for (const it of list) {
        const k = `${where}|${it.type}|${it.el}|${it.text}`;
        let f = issues.get(k);
        if (!f) { f = { where, ...it, sizes: new Set(), states: new Set(), rects: {} }; issues.set(k, f); }
        f.sizes.add(tag); f.states.add(sname); f.rects[tag] = it.rect;
        if (!f.shotKey) f.shotKey = { w, h, mobile, sname };
      }
    }
    await S.ev(async () => { await window.__SCAN.stopAll(); });
    // one screenshot per size: the default state with the panel open (evidence for the worst size)
    if (opt.shotAll) { const b = await S.page.screenshot({ type: 'jpeg', quality: 55 }); fs.writeFileSync(path.join(out.dir, 'shots', `${S.house}-ui-${w}x${h}.jpg`), b); }
  }
  // severity: out of the frame / covered / clipped at a common size is worse than at 800x600 or a phone
  const common = (f) => [...f.sizes].some((s) => /^(1920|1366|1280)/.test(s));
  let n = 0;
  const sevOf = (f) => (/^(out-of-frame|covered)$/.test(f.type) ? (common(f) ? 'high' : 'medium') : /^(clipped-x|clipped-y|control-overflow|sticks-out)$/.test(f.type) ? (common(f) ? 'medium' : 'low') : f.type === 'duplicate-button' ? 'medium' : 'low');
  const TXT = { 'out-of-frame': 'יוצא מהחלון', 'clipped-x': 'תוכן נחתך לרוחב', 'clipped-y': 'תוכן נחתך לגובה', 'text-ellipsis': 'טקסט נחתך', 'h-scroll': 'גלילה אופקית', 'control-overflow': 'טקסט חורג מהכפתור', 'sticks-out': 'יוצא מהמכל', covered: 'כפתור מכוסה', 'duplicate-button': 'כפתורים כפולים' };
  for (const f of issues.values()) {
    out.add(sevOf(f), `${TXT[f.type] || f.type}: ${f.text || f.el} (${f.where}, ${f.el})`, `${f.detail}. גדלים: ${[...f.sizes].join(', ')}. מצבים: ${[...f.states].join(', ')}.`, { item: f.el, data: { rects: f.rects } });
    n++;
  }
  out.stats.issues = n;
  // the unified shell: from this house to the other (the top bar's "tm-go-other") and back - each house must come up, with no console errors
  if (S.house === 'rishon' && !opt.noswitch) {
    const { waitFrameReady, frameOf } = await import('/home/claude/split/watch/lib.mjs');
    await S.page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    const other = 'sheni', n0 = S.msgs.length, t0 = Date.now();
    const has = await S.ev(() => !!document.getElementById('tm-go-other'));
    if (!has) out.add('high', 'במעטפת: אין כפתור מעבר בין הבתים (tm-go-other)', 'בסרגל העליון של בית ראשון אין כפתור "בית שני".');
    else {
      await S.ev(() => document.getElementById('tm-go-other').click());
      try {
        const f2 = await waitFrameReady(S.page, other, 240000);
        out.stats.switchMs = Date.now() - t0;
        const back = await f2.evaluate(() => !!document.getElementById('tm-go-other'));
        if (!back) out.add('high', 'במעטפת: בבית השני אין כפתור חזרה לבית הראשון', 'tm-go-other חסר.');
        else { await f2.evaluate(() => document.getElementById('tm-go-other').click()); await sleep(1500); const f1 = frameOf(S.page, 'rishon'); const vis = f1 && await f1.evaluate(() => document.documentElement.classList.contains('tm-ready')); if (!vis) out.add('high', 'במעטפת: החזרה לבית הראשון לא החזירה את הבית', 'ה־iframe של בית ראשון אינו מוכן אחרי החזרה.'); }
      } catch (e) { out.add('high', 'במעטפת: המעבר לבית השני לא הסתיים', String(e.message).slice(0, 200)); }
      const errs = S.errsSince(n0); if (errs.length) out.add('high', 'שגיאות קונסול במעבר בין הבתים', errs.slice(0, 3).map((m) => m.text).join(' | '));
    }
  }
}
