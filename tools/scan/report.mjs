// Builds report.json and report.html (a table by severity, with the screenshots) from the result-*.json files of a scan directory.
import fs from 'node:fs';
import path from 'node:path';
export const CATS = { toggles: ['1', 'מתגים שאינם משנים כלום'], views: ['2', 'מבטים'], demos: ['3', 'הדגמות ומצגות'], ui: ['4', 'דפדפן / UI בגדלי חלון'], perf: ['5', 'טעינה וביצועים'], walk: ['6', 'מצב הליכה'] };
const SEVN = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }, SEVH = { critical: 'קריטי', high: 'גבוה', medium: 'בינוני', low: 'נמוך', info: 'מידע' };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export function build(dir, meta) {
  const files = fs.readdirSync(dir).filter((f) => /^result-.*\.json$/.test(f));
  const all = [], stats = {}, missing = [];
  for (const f of files) { const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); stats[j.house + '/' + j.cat] = j.stats; for (const x of j.findings) all.push(x); }
  // a long run of black views is one event (the renderer died), not N findings: they are demoted and summarised (views.mjs now also stops the category by itself)
  for (const h of ['rishon', 'sheni']) {
    const blk = all.filter((f) => f.house === h && f.cat === 'views' && /^תצוגה שחורה/.test(f.title));
    if (blk.length >= 8) {
      for (const f of blk) { f.sev = 'info'; f.title = '[חלק מרצף שחור] ' + f.title; }
      all.push({ id: h + '-views-BLACKOUT', cat: 'views', house: h, sev: 'critical', title: `רצף של ${blk.length} מבטים שחורים לגמרי ב${h === 'rishon' ? 'בית ראשון' : 'בית שני'}, החל מ"${blk[0].title.replace('[חלק מרצף שחור] ', '').split('←').pop().trim().slice(0, 60)}"`, detail: 'כל המבטים מהנקודה הזו והלאה שחורים (ממוצע בהירות 0, 100% כהה) גם בצילום חוזר. סיבה אפשרית אחת: הרינדור מת באמצע הסריקה (איבוד הקשר WebGL בעיבוד תוכנה, או שגיאת רינדור של המודל אחרי מבט מסוים) — ואז ממצאי "שחור" האחרים אינם אמינים. יש לבדוק ב־probe יעודי (SCAN.alive) לפני שמסיקים שהמבטים עצמם שבורים.', shots: blk[0].shots || [] });
    }
  }
  const ord = (a, b) => SEVN[a.sev] - SEVN[b.sev] || String(a.cat).localeCompare(String(b.cat)) || String(a.house).localeCompare(String(b.house));
  all.sort(ord);
  const count = {}; for (const k of Object.keys(CATS)) count[k] = { critical: 0, high: 0, medium: 0, low: 0, info: 0, total: 0 };
  for (const f of all) { if (!count[f.cat]) continue; count[f.cat][f.sev]++; count[f.cat].total++; }
  const report = { meta, counts: count, stats, findings: all };
  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(report, null, 1));
  const rows = all.map((f) => `<tr class="s-${f.sev}" data-cat="${f.cat}" data-sev="${f.sev}" data-house="${f.house}"><td>${SEVH[f.sev]}</td><td>${CATS[f.cat] ? CATS[f.cat][0] + '. ' + CATS[f.cat][1] : f.cat}</td><td>${f.house === 'rishon' ? 'בית ראשון' : f.house === 'sheni' ? 'בית שני' : f.house}</td><td><b>${esc(f.title)}</b><div class="d">${esc(f.detail)}</div></td><td>${(f.shots || []).map((s) => `<a href="${esc(s)}" target="_blank"><img src="${esc(s)}" loading="lazy"></a>`).join('')}</td></tr>`).join('\n');
  const sumRows = Object.keys(CATS).map((k) => `<tr><td>${CATS[k][0]}. ${CATS[k][1]}</td>${['critical', 'high', 'medium', 'low', 'info'].map((s) => `<td class="s-${s}">${count[k][s]}</td>`).join('')}<td><b>${count[k].total}</b></td></tr>`).join('');
  const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>דוח סריקה מלאה — ${esc(meta.label)}</title><style>
body{font:14px/1.5 system-ui,Arial;margin:16px;background:#fafafa;color:#222}h1{font-size:20px}table{border-collapse:collapse;width:100%;background:#fff}td,th{border:1px solid #ddd;padding:5px 8px;vertical-align:top}th{background:#eee}
.s-critical td:first-child,td.s-critical{background:#b3001b;color:#fff}.s-high td:first-child,td.s-high{background:#f4b6b6}.s-medium td:first-child,td.s-medium{background:#ffe0a8}.s-low td:first-child,td.s-low{background:#fff4c2}.s-info td:first-child,td.s-info{background:#e5ecf6}
.d{color:#555;font-size:12px;margin-top:2px;max-width:900px;white-space:pre-wrap}img{height:90px;margin:2px;border:1px solid #bbb}#f{margin:8px 0}#f select{margin-inline-end:8px}.sum{width:auto}
</style></head><body><h1>דוח סריקה מלאה — ${esc(meta.label)}</h1><p>${esc(meta.when)} · תוסף: ${esc(meta.plugin)} · משך: ${esc(meta.duration)} · רינדור תוכנה (swiftshader) על מכונה משותפת: זמני טעינה ו־FPS הם מדדים יחסיים.</p>
<table class="sum"><tr><th>קטגוריה</th><th>קריטי</th><th>גבוה</th><th>בינוני</th><th>נמוך</th><th>מידע</th><th>סה״כ</th></tr>${sumRows}</table>
<div id="f">סינון: <select id="fc"><option value="">כל הקטגוריות</option>${Object.keys(CATS).map((k) => `<option value="${k}">${CATS[k][0]}. ${CATS[k][1]}</option>`).join('')}</select><select id="fs"><option value="">כל החומרות</option><option>critical</option><option>high</option><option>medium</option><option>low</option><option>info</option></select><select id="fh"><option value="">שני הבתים</option><option value="rishon">בית ראשון</option><option value="sheni">בית שני</option></select></div>
<table id="t"><tr><th>חומרה</th><th>קטגוריה</th><th>בית</th><th>ממצא</th><th>צילומים</th></tr>${rows}</table>
<h2>מה לא כוסה</h2><ul>${(meta.notCovered || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
<script>const q=()=>{const c=fc.value,s=fs.value,h=fh.value;document.querySelectorAll('#t tr[data-cat]').forEach(r=>{r.style.display=(!c||r.dataset.cat===c)&&(!s||r.dataset.sev===s)&&(!h||r.dataset.house===h)?'':'none'})};fc.onchange=fs.onchange=fh.onchange=q</script></body></html>`;
  fs.writeFileSync(path.join(dir, 'report.html'), html);
  return report;
}
