// Build the unified plugin "בית המקדש" (the First and the Second Temple in one plugin, each on its own screen):
//
//   node tools/build-unified.mjs --rishon <built plugin dir of בית ראשון> --sheni <built plugin dir of בית שני> [--out dist-unified]
//                                [--version x.y.z] [--no-pack]
//
// Each house is taken AS BUILT (its plugin/ folder: index.html, bundle.js, manifest.json) and is not changed, except one line:
// <script src="../house-bridge.js"> at the top of its <head>. The result:
//
//   <out>/plugin/                 the plugin folder (manifest.json, index.html = the choice screen, house-bridge.js, icon/,
//                                 rishon/{index.html,bundle.js}, sheni/{index.html,bundle.js}, DEV_NOTES.md, .otzignore)
//   <out>/בית-המקדש-<ver>.otzplugin
//   <out>/בית המקדש - לצפייה בלי אוצריא.html   one file: the choice screen and both houses inside it (and, in this file only,
//                                 unified/update-check.js: the button "בדיקת עדכונים" at the end of each house's menu)
//
// The unified manifest is unified/manifest.json (id = בית ראשון's id, so the store updates the installed plugin); its toolbar
// buttons and startup programs are both houses'. The shell's routing table (which button / which book -> which house) is written
// here from the two manifests.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const U = path.join(root, 'unified');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const log = (m) => console.log('[unified] ' + m);
const read = (p) => fs.readFileSync(p, 'utf8');

const src = { rishon: opt('--rishon', path.join(root, 'plugin')), sheni: opt('--sheni') };
if (!src.sheni) throw new Error('--sheni <the built plugin folder of בית שני> is required');
const out = path.resolve(opt('--out', path.join(root, 'dist-unified')));
const manifest = JSON.parse(read(path.join(U, 'manifest.json')));
if (opt('--version')) manifest.version = opt('--version');
const version = manifest.version;
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('bad version ' + version);

// ---------- the two houses ----------
const NAMES = { rishon: 'בית ראשון', sheni: 'בית שני' };
const BASE_BOOKS = { rishon: [10, 39], sheni: [89, 337] };   // the books each house reads by its own table (ui_READ): I Kings, II Chronicles; Middot, the Rambam
const houses = {};
for (const h of ['rishon', 'sheni']) {
  const dir = path.resolve(src[h]);
  const m = JSON.parse(read(path.join(dir, 'manifest.json')));
  const html = read(path.join(dir, 'index.html'));
  const bundle = read(path.join(dir, 'bundle.js'));
  if (!html.includes('<script src="./bundle.js"></script>')) throw new Error(h + ': index.html does not load ./bundle.js as expected');
  const st = (m.contributes && m.contributes.startup) || {};
  const items = (st.toolbarItems || []).map((t) => t.id);
  // the book ids in the toolbar programs' conditions ("reader.book.id" == N). 2.0.2: the button shows in 77 books of each house (the
  // books with the most links to its sources; tools196/gen_manifest_books.py), some of them in both lists; the shell routes a click by
  // the BUTTON's id, and by the book only for the house's own books (an event with no button id) - BASE_BOOKS, which must be listed
  const listed = [];
  JSON.stringify(st.programs || [], (k, v) => {
    if (v && typeof v === 'object' && v.op === 'equals' && v.left && v.left.$context === 'reader.book.id' && v.right != null) listed.push(typeof v.right === 'object' ? v.right.$literal : v.right);
    return v;
  });
  const books = BASE_BOOKS[h];
  for (const b of books) if (!listed.includes(b)) throw new Error(h + ': the manifest does not show the button in its own book ' + b);
  log(h + ': the button shows in ' + listed.length + ' books');
  houses[h] = { dir, manifest: m, html, bundle, cfg: { name: NAMES[h], version: m.version, page: h + '/index.html', items, books } };
  log(h + ': ' + m.name + ' ' + m.version + ', buttons ' + items.join(',') + ', books ' + books.join(','));
}
// the unified manifest carries both houses' toolbar buttons and programs: make sure they are the houses' current ones
{
  const st = manifest.contributes.startup;
  st.programs = [...houses.rishon.manifest.contributes.startup.programs, ...houses.sheni.manifest.contributes.startup.programs];
  st.toolbarItems = [...houses.rishon.manifest.contributes.startup.toolbarItems, ...houses.sheni.manifest.contributes.startup.toolbarItems];
  const perms = new Set([...manifest.permissions, ...houses.rishon.manifest.permissions, ...houses.sheni.manifest.permissions]);
  manifest.permissions = [...perms];
}

// ---------- the shell ----------
const bridge = read(path.join(U, 'house-bridge.js'));
const bg = read(path.join(U, 'background.svg')).replace(/<\?xml[^>]*>\s*/, '').trim();
function shell(standalone, sourcesHtml) {
  const cfg = { standalone, houses: {} };
  for (const h of ['rishon', 'sheni']) cfg.houses[h] = houses[h].cfg;
  let s = read(path.join(U, 'shell.html'));
  s = s.replace(/\/\*__CONFIG__\*\/[\s\S]*?\/\*__END_CONFIG__\*\//, () => JSON.stringify(cfg));
  s = s.split('__PLUGIN_VERSION__').join(version);
  s = s.replace('__BACKGROUND_SVG__', () => bg);
  s = s.replace('<!--__HOUSE_SOURCES__-->', () => sourcesHtml || '');
  // 2.0.2: the words index (unified/words-index.js, written by tools196/gen_words.py with the houses' own lines): the shell counts with
  // it in which house the words of Otzaria's search field are found. Not in the one-file HTML (no Otzaria there, no search field button).
  if (!s.includes('/*__WORDS_INDEX__*/')) throw new Error('shell.html has no /*__WORDS_INDEX__*/');
  s = s.replace('/*__WORDS_INDEX__*/', () => (standalone ? '' : read(path.join(U, 'words-index.js')).replace(/<\/script/gi, '<\\/script')));
  return s;
}
const BRIDGE_TAG = '<script src="../house-bridge.js"></script>';
function houseHtml(h) {
  const html = houses[h].html;
  const i = html.indexOf('<meta charset="UTF-8">');
  if (i < 0) throw new Error(h + ': no <meta charset> in index.html');
  const at = i + '<meta charset="UTF-8">'.length;
  return html.slice(0, at) + '\n' + BRIDGE_TAG + html.slice(at);
}

// ---------- the plugin folder ----------
const P = path.join(out, 'plugin');
fs.rmSync(P, { recursive: true, force: true });
fs.mkdirSync(path.join(P, 'icon'), { recursive: true });
for (const h of ['rishon', 'sheni']) {
  fs.mkdirSync(path.join(P, h), { recursive: true });
  fs.writeFileSync(path.join(P, h, 'index.html'), houseHtml(h), 'utf8');
  fs.writeFileSync(path.join(P, h, 'bundle.js'), houses[h].bundle, 'utf8');
}
fs.writeFileSync(path.join(P, 'house-bridge.js'), bridge, 'utf8');
fs.writeFileSync(path.join(P, 'index.html'), shell(false), 'utf8');
fs.writeFileSync(path.join(P, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
execFileSync('rsvg-convert', ['-w', '256', '-h', '256', path.join(U, 'icon.svg'), '-o', path.join(P, 'icon', 'icon.png')]);
try { execFileSync('convert', [path.join(P, 'icon', 'icon.png'), '-strip', path.join(P, 'icon', 'icon.png')]); } catch (_) {}
fs.copyFileSync(path.join(U, 'DEV_NOTES.md'), path.join(P, 'DEV_NOTES.md'));
fs.writeFileSync(path.join(P, '.otzignore'), "# the store's packer leaves *.md out; the maintainers' notes travel with the plugin\n!DEV_NOTES.md\n", 'utf8');
execFileSync('node', ['--check', path.join(P, 'house-bridge.js')], { stdio: 'inherit' });
// 2.0.2: the store's validator must be able to read every file (tools/safe-lines.mjs --check: its own search for regular-expression
// literals, timed; a file on which it does not come back fails the build here and not in the store's run)
{
  const list = [];
  const walk = (d) => { for (const f of fs.readdirSync(d)) { const q = path.join(d, f); if (fs.statSync(q).isDirectory()) walk(q); else if (/\.(js|html?)$/i.test(f)) list.push(q); } };
  walk(P);
  execFileSync('node', [path.join(root, 'tools', 'safe-lines.mjs'), '--check', ...list], { stdio: 'inherit', timeout: 180000 });
}
log('plugin folder: ' + P);

// ---------- the .otzplugin ----------
if (!argv.includes('--no-pack')) {
  const zip = path.join(out, 'בית-המקדש-' + version + '.otzplugin');
  if (fs.existsSync(zip)) fs.unlinkSync(zip);
  execFileSync('zip', ['-r', '-X', '-9', '-q', zip, 'manifest.json', 'index.html', 'house-bridge.js', 'icon', 'rishon', 'sheni', 'DEV_NOTES.md'], { cwd: P, stdio: 'inherit' });
  log('packed: ' + zip + ' (' + fs.statSync(zip).size + ' bytes)');
}

// ---------- one HTML file for viewing without Otzaria ----------
{
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const inlineScript = (code) => '<script>' + code.replace(/<\/script/gi, '<\\/script') + '</script>';
  let parts = '';
  for (const h of ['rishon', 'sheni']) {
    let doc = houseHtml(h);
    // 10.11.2026 (the user: "בקובץ ה-HTML בלבד! הוסף מתג בסוף התפריט עם בדיקת עדכונים מגיט"): unified/update-check.js goes into this file only
    doc = doc.replace(BRIDGE_TAG, () => inlineScript(bridge) + inlineScript(read(path.join(U, 'update-check.js')).split('__PLUGIN_VERSION__').join(version)));
    doc = doc.replace('<script src="./bundle.js"></script>', () => inlineScript(houses[h].bundle));
    parts += '<textarea id="src-' + h + '" hidden aria-hidden="true">' + esc(doc) + '</textarea>\n';
  }
  const file = path.join(out, 'בית המקדש - לצפייה בלי אוצריא.html');
  fs.writeFileSync(file, shell(true, parts), 'utf8');
  log('standalone: ' + file + ' (' + fs.statSync(file).size + ' bytes)');
}
log('done: ' + manifest.name + ' ' + version);
