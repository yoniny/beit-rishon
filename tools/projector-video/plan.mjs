// The verses presentation's plan and slide objects (no rendering): node plan.mjs rishon verses
import fs from 'node:fs';
import { serve, launch, openHouse } from './common.mjs';
const house = process.argv[2] || 'rishon', mode = process.argv[3] || 'verses';
const { srv, port } = await serve();
const browser = await launch();
try {
  const page = await openHouse(browser, port, house, 800, 450);
  await page.evaluate(() => { try { window.__renderer.setPixelRatio(0.05); } catch (_) {} });
  const out = await page.evaluate((mode) => {
    const T = window.__ctx.shared.tour;
    const plan = T.plan(mode);
    T.start(mode);
    const sl = T.slides.map((s, i) => {
      const o = {};
      for (const k of Object.keys(s)) {
        const v = s[k];
        if (typeof v === 'function') o[k] = 'fn';
        else if (k === 'text') o.textLen = (v || '').length;
        else if (k === 'verses' || k === 'letters') o[k] = Array.isArray(v) ? v.length : typeof v;
        else { try { o[k] = JSON.parse(JSON.stringify(v)); } catch (_) { o[k] = String(v); } }
      }
      return o;
    });
    T.stop();
    const demos = (window.__ctx.shared.demoStops || []).map((d) => d.id);
    return { plan, slides: sl, demos };
  }, mode);
  fs.writeFileSync('/home/claude/usb/rec/plan-' + house + '-' + mode + '.json', JSON.stringify(out, null, 1));
  for (const p of out.plan) console.log([p.n, p.title, p.part, p.target, p.feature || '', p.layer || '', p.anim || '', p.devir ? 'DEVIR' : '', 'chars=' + p.chars].join(' | '));
  console.log('demos:', out.demos.join(', '));
} finally { await browser.close(); srv.close(); }
