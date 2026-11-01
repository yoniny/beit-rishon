// Static integration checks for the assembled modules (run after assemble.mjs): node tools/check.mjs
// 1. every module file parses (node --check), has no import/export, defines its exported function exactly once
// 2. top-level declarations do not collide across modules
// 3. flyPoint keys used by the UI exist in some module; layers/shared objects referenced by the UI are defined
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const src = path.join(root, 'src');
const mods = { '10-core.js': [], '20-mount.js': ['buildMount'], '30-courts.js': ['buildCourts'], '40-altar.js': ['buildAltar'], '45-vessels.js': ['buildVessels'], '50-heichal.js': ['buildHeichal'], '55-interior.js': ['buildInterior'], '57-kelim.js': ['buildKelim'], '60-palace.js': ['buildPalace'], '70-ui.js': ['buildUI'], '75-tour.js': ['buildTour'], '90-entry.js': [] };
let problems = 0;
const warn = (m) => { problems++; console.log('PROBLEM: ' + m); };
const decls = {};
const texts = {};
for (const [f, fns] of Object.entries(mods)) {
  const p = path.join(src, f);
  if (!fs.existsSync(p)) { warn(f + ' is missing'); continue; }
  const t = fs.readFileSync(p, 'utf8');
  texts[f] = t;
  try { execFileSync('node', ['--check', p], { stdio: 'pipe' }); } catch (e) { warn(f + ' does not parse: ' + String(e.stderr || e.message).slice(0, 400)); }
  if (/^\s*(import|export)\s/m.test(t)) warn(f + ' contains import/export');
  for (const fn of fns) {
    const n = (t.match(new RegExp('^\\s*async function ' + fn + '\\s*\\(', 'mg')) || []).length;
    if (n !== 1) warn(f + ' must define "async function ' + fn + '(" exactly once (found ' + n + ')');
  }
  // top-level declarations: lines starting with two spaces then var/let/const/function/class/async function (the IIFE indent) or at column 0
  const re = /^(?: {2})?(?:async\s+)?(?:function|class|var|let|const)\s+([A-Za-z_$][\w$]*)/mg;
  let m;
  while ((m = re.exec(t))) { (decls[m[1]] = decls[m[1]] || []).push(f); }
}
for (const [name, files] of Object.entries(decls)) {
  const uniq = [...new Set(files)];
  if (uniq.length > 1) warn('top-level name "' + name + '" is declared in ' + uniq.join(', '));
}
// UI cross-references
const ui = texts['70-ui.js'] || '';
const others = Object.entries(texts).filter(([f]) => f !== '70-ui.js' && f !== '75-tour.js' && f !== '10-core.js' && f !== '90-entry.js').map(([, t]) => t).join('\n');
const fpKeys = new Set();
for (const m of others.matchAll(/flyPoints[^\n]*?\b([A-Za-z_]\w*)\s*:\s*\{\s*pos/g)) fpKeys.add(m[1]);
for (const m of others.matchAll(/flyPoints\.([A-Za-z_]\w*)\s*=/g)) fpKeys.add(m[1]);
for (const m of others.matchAll(/^\s+([A-Za-z_]\w*)\s*:\s*\{\s*pos\s*:/mg)) fpKeys.add(m[1]);
const used = new Set();
for (const m of ui.matchAll(/key\s*:\s*["']([A-Za-z_]\w*)["']/g)) used.add(m[1]);
for (const m of ui.matchAll(/fps\[["']([A-Za-z_]\w*)["']\]/g)) used.add(m[1]);
for (const k of used) if (k !== '__general' && !fpKeys.has(k)) console.log('WARN: UI uses flyPoint "' + k + '" that no module seems to define');
for (const k of ['aliyot', 'ulamRambam', 'palace']) { if (!new RegExp('layers\\.' + k + '\\s*=').test(others)) warn('no module sets ctx.layers.' + k); if (!ui.includes('layers.' + k) && !ui.includes("layers['" + k + "']") && !ui.includes('layers["' + k + '"]')) console.log('WARN: UI never references layer ' + k); }
for (const k of ['seaPlacement', 'kodeshLayout', 'kodeshOpinion', 'devirCenter']) { if (!new RegExp('shared\\.' + k + '\\s*=').test(others)) warn('no module sets ctx.shared.' + k); if (!ui.includes(k)) console.log('WARN: UI never references shared.' + k); }
console.log('flyPoints defined:', [...fpKeys].sort().join(', '));
console.log('flyPoints used by UI:', [...used].sort().join(', '));
console.log(problems ? problems + ' problem(s)' : 'OK: no blocking problems');
process.exit(problems ? 1 : 0);
