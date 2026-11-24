// The full automatic scan of the plugin (Beit Rishon, Beit Sheni, the unified shell) - run once:   node tools/scan-full.mjs
//   [--plugin <built unified plugin dir>]  (default: <repo>/unified-plugin)   [--out <dir>] (default /home/claude/scan3/run-<time>)
//   [--houses rishon,sheni] [--cats views,toggles,demos,walk,ui,perf] [--only text,text] [--limit n] [--quick]   [--report-only <dir>]
// Every job opens the built plugin through its shell in a headless browser (the browser pieces of /home/claude/split/watch/lib.mjs, as
// tools shoot.mjs / probe.mjs do) via tools/one-browser.sh - two browser slots on the machine, shared with the other agents.
// Output: <out>/report.json, <out>/report.html (a table by severity, with the screenshots), <out>/shots/.  The product's code is not touched.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from './scan/report.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const argv = process.argv.slice(2), A = {};
for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) { A[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; }
const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
const OUT = path.resolve(A.out || A['report-only'] || `/home/claude/scan3/run-${stamp}`);
const PLUGIN = path.resolve(A.plugin || path.join(REPO, 'unified-plugin'));
const NOT = [
  'שמע: לא נבדק (אין אודיו בדפדפן headless); רק בדיקת קיום מתגי השתקה.',
  'FPS וזמני טעינה נמדדים ב־swiftshader (עיבוד תוכנה) על מכונה משותפת — מדדים יחסיים ולא של כרטיס מסך אמיתי; Intel Iris Xe וכד\' לא נבדקו.',
  'מצב הליכה: הדגם הוא רשת (2 אמות) לפי כלל הרצפה של ent_walkStep/cam_walkFloor, לא הרצת הלולאה האמיתית עם מקשים; אין בדיקת התנגשות באנכי (הקוד עצמו אינו חוסם הליכה דרך קירות).',
  'מצגות: נבדקו רק שקופיות עם הדגמה (עד --tourlimit לכל מצב), לא כל שקופית ברצף; המצגת "לפי הנושאים" עוברת על המבטים (קטגוריה 2).',
  'הדגמות: זיהוי דמויות הוא היוריסטי (שם הקבוצה או קבוצה נעה בגודל אדם); דמויות מכוסות InstancedMesh (קהל "peopleRig") לא נבדקות פרטנית. קבוצות שלא זוהו כדמות אינן נבדקות.',
  'מתגים: שינוי שאינו נראה מהמצלמות הנבדקות מסומן "בינוני" לבדיקה ידנית; מתגים שמשפיעים רק על אודיו/טקסט/DOM לא נתפסים.',
  'חוויית מגע/עכבר אמיתית (גרירה, גלגלת, pointer lock), תצוגת קלט מקלדת במצב הליכה, וקישורי "אותו מקום בבית השני" בין הבתים במעטפת — לא נבדקו.',
  'מובייל: הדמיה של חלון 390x800 עם מגע, לא מכשיר אמיתי.'
];
if (!A['report-only']) {
  fs.mkdirSync(OUT, { recursive: true });
  const houses = String(A.houses || 'rishon,sheni').split(','), cats = String(A.cats || 'views,ui,walk,perf,toggles,demos').split(',');
  const quick = !!A.quick;
  const extra = (cat) => {   // options of one category: --name.cat value (job.mjs reads them for that category only)
    const x = [], put = (k, v) => x.push('--' + k + '.' + cat, String(v));
    if (A.only) put('only', A.only);
    if (A.limit) put('limit', A.limit);
    if (quick) { if (cat === 'toggles' || cat === 'views') put('limit', 6); if (cat === 'demos') { put('limit', 2); put('tourlimit', 1); } if (cat === 'ui') put('sizes', '1280x720,390x800'); if (cat === 'perf') put('limit', 1); if (cat === 'walk') put('cap', 60000); }
    if (A.tourlimit) put('tourlimit', A.tourlimit);
    if (A.maxdemo) put('maxdemo', A.maxdemo);
    return x;
  };
  // one process per house (two browser slots on the machine, shared with the other agents): its categories one after the other
  const t0 = Date.now(); let running = 0;
  const log = fs.createWriteStream(path.join(OUT, 'scan.log'));
  const budget = (A.budget ? +A.budget : 80) * 60000;
  await Promise.all(houses.map((h, hi) => new Promise((resolve) => {
    // the first house waits in the queue of slot 2 (long-browser.sh: a blocking wait, in order), the others take whichever slot frees first
    const args = [hi === 0 ? '/home/claude/fix/tools/long-browser.sh' : '/home/claude/fix/tools/one-browser.sh', 'node', path.join(HERE, 'scan', 'job.mjs'), '--plugin', PLUGIN, '--house', h, '--cats', cats.join(','), '--out', OUT];
    // per-category options are the same for every category of the process (an option a category does not know is ignored)
    for (const c of cats) for (const x of extra(c)) args.push(x);
    console.log(`[scan] start ${h}: ${cats.join(',')}`);
    const p = spawn('/bin/bash', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    p.stdout.on('data', (d) => { log.write(`[${h}] ${d}`); process.stdout.write(`[${h}] ${d}`); }); p.stderr.on('data', (d) => log.write(`[${h}!] ${d}`));
    const to = setTimeout(() => { console.log(`[scan] budget over - killing ${h}`); try { p.kill('SIGKILL'); spawn('pkill', ['-P', String(p.pid)]); } catch (_) {} }, budget);
    p.on('exit', (code) => { clearTimeout(to); console.log(`[scan] done ${h} (code ${code}) +${Math.round((Date.now() - t0) / 60000)}min`); resolve(); });
  })));
  log.end();
}
const meta = { label: A.label || 'merge-41 [4.1.0]', when: new Date().toLocaleString('he-IL'), plugin: PLUGIN, duration: A.duration || '', notCovered: NOT };
const rep = build(OUT, meta);
console.log('\nreport: ' + path.join(OUT, 'report.html'));
for (const [k, v] of Object.entries(rep.counts)) console.log(`${k}: ${JSON.stringify(v)}`);
