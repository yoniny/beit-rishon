// Category 5 - loading and performance. Real clock (no freezer): load time until interactive, bundle sizes, frame rate in a calm view and in
// the heavy demonstrations, heap, console. Software GL (swiftshader) on a shared machine: the numbers are RELATIVE (a frame is compared with
// the same house's calm view) and the absolute fps is not the user's.
import fs from 'node:fs';
import path from 'node:path';
import { openHouse, sleep, INPAGE } from './lib.mjs';
export async function run(S, out, opt) {
  const plugin = opt.plugin;
  // sizes of the files of the house
  const dir = path.join(plugin, S.house), sz = {};
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) { const st = fs.statSync(path.join(dir, f)); if (st.isFile()) sz[f] = st.size; }
  const total = Object.values(sz).reduce((a, b) => a + b, 0);
  out.stats.bundleBytes = total; out.stats.files = sz; out.stats.loadMs = S.tReady; out.stats.shellMs = S.tShell;
  if (total > 12e6) out.add('medium', `גודל חבילת הבית ${S.house}: ${(total / 1e6).toFixed(1)}MB`, JSON.stringify(sz), { item: 'bundle' });
  else out.add('info', `גודל חבילת הבית ${S.house}: ${(total / 1e6).toFixed(1)}MB`, JSON.stringify(sz), { item: 'bundle' });
  const lt = await S.ev(() => ({ loadTimes: (window.__loadTimes || []).slice(0, 40), mem: performance.memory ? { used: performance.memory.usedJSHeapSize, total: performance.memory.totalJSHeapSize } : null, tris: window.__renderer ? window.__renderer.info.render.triangles : null, calls: window.__renderer ? window.__renderer.info.render.calls : null, geo: window.__renderer ? window.__renderer.info.memory.geometries : null, tex: window.__renderer ? window.__renderer.info.memory.textures : null })).catch(() => ({}));
  out.stats.engine = lt;
  if (S.tReady > 60000) out.add('medium', `זמן טעינה עד אינטראקטיבי (${S.house}): ${(S.tReady / 1000).toFixed(0)} שניות`, 'במכונה משותפת עם עיבוד תוכנה (swiftshader); מדד יחסי בלבד.', { item: 'load' });
  else out.add('info', `זמן טעינה עד אינטראקטיבי (${S.house}): ${(S.tReady / 1000).toFixed(1)} שניות`, 'במכונה משותפת עם עיבוד תוכנה; מדד יחסי בלבד.', { item: 'load' });
  if (lt.mem && lt.mem.used > 900e6) out.add('medium', `זיכרון JS אחרי טעינה: ${(lt.mem.used / 1e6).toFixed(0)}MB`, '', { item: 'mem' });
  // frame rate: the real rAF, 4 s per scene
  const fps = async (label, secs = 4) => {
    const r = await S.ev((secs) => new Promise((res) => { const t = [], t0 = performance.now(); let last = performance.now(); const f = (now) => { t.push(now - last); last = now; if (now - t0 < secs * 1000) requestAnimationFrame(f); else { t.shift(); const s = [...t].sort((a, b) => a - b); res({ n: t.length, avg: t.reduce((a, b) => a + b, 0) / Math.max(1, t.length), p95: s[Math.floor(s.length * 0.95)] || 0, max: s[s.length - 1] || 0 }); } }; requestAnimationFrame(f); }), secs);
    return { label, ...r, fpsAvg: Math.round(1000 / r.avg * 10) / 10, fpsMin: Math.round(1000 / r.max * 10) / 10 };
  };
  const rows = [];
  const base = await fps('מבט כללי (רגוע)'); rows.push(base);
  const heavy = await S.ev(() => { const c = window.__TM_CTX; const ids = new Set((c.shared.demoStops || []).map((d) => d.id)); return (c.shared.modelButtons || []).map((b, i) => ({ i, id: b.id, label: b.label })).filter((b) => ids.has(b.id) || /^הדגמ/.test(b.label || '')); });
  const only = opt.only ? String(opt.only).split(',') : null;
  let n = 0;
  for (const b of heavy) {
    if (only && !only.some((o) => b.label.includes(o) || b.id.includes(o))) continue;
    if (n++ >= (opt.limit ? +opt.limit : 8)) break;
    await S.ev(async (i) => { const c = window.__TM_CTX; try { c.shared.stopDemos(); } catch (_) {} const B = c.shared.modelButtons[i]; try { B.set(true); } catch (_) {} const y = document.querySelector('#tm-confirm .y'); if (y) y.click(); await new Promise((r) => setTimeout(r, 1500)); }, b.i);
    const r = await fps('הדגמה: ' + b.label, 5); rows.push(r);
    await S.ev(() => { try { window.__TM_CTX.shared.stopDemos(); } catch (_) {} });
    await sleep(300);
  }
  out.stats.fps = rows;
  for (const r of rows) {
    const rel = r.avg / base.avg;
    const sev = r === base ? 'info' : rel > 2.5 ? 'high' : rel > 1.6 ? 'medium' : 'info';
    out.add(sev, `FPS ${r.label}: ממוצע ${r.fpsAvg}, מינימום ${r.fpsMin}${r === base ? '' : ` (פי ${rel.toFixed(2)} זמן פריים מהמבט הרגוע)`}`, `${r.n} פריימים, p95 ${r.p95.toFixed(0)}ms, מקסימום ${r.max.toFixed(0)}ms. רינדור תוכנה — מדד יחסי.`, { item: 'fps' });
    if (r.max > 1500 && r !== base) out.add('medium', `קפיצת פריים (${(r.max / 1000).toFixed(1)} שניות) ב"${r.label}"`, 'פריים בודד ארוך — ייתכן עיכוב סינכרוני (בניית גאומטריה / shader) באמצע ההדגמה.', { item: 'fps' });
  }
  const heap = await S.ev(() => (performance.memory ? performance.memory.usedJSHeapSize : null)).catch(() => null);
  out.stats.heapEnd = heap;
  if (lt.mem && heap && heap - lt.mem.used > 250e6) out.add('medium', `זיכרון JS גדל ב־${((heap - lt.mem.used) / 1e6).toFixed(0)}MB במהלך ההדגמות`, 'ייתכן דליפה (גאומטריות/טקסטורות שלא משוחררות).', { item: 'mem' });
  const errs = S.msgs.filter((m) => m.type === 'error' || m.type === 'pageerror'), warns = S.msgs.filter((m) => m.type === 'warn');
  out.stats.console = { errors: errs.length, warns: warns.length };
  const groups = new Map(); for (const m of [...errs, ...warns]) { const k = m.type + ': ' + m.text.replace(/\d+(\.\d+)?/g, '#').slice(0, 160); groups.set(k, (groups.get(k) || 0) + 1); }
  for (const [k, v] of groups) out.add(k.startsWith('warn') ? 'low' : 'high', `קונסול (${S.house}): ${k.slice(0, 120)} ×${v}`, k, { item: 'console' });
}
