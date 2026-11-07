// Build the plugin folder from src/: node tools/build.mjs [--no-min] [--pack]
//   1. tools/assemble.mjs -> a readable bundle (build/bundle.readable.js; kept for reading and for diffs, not shipped)
//   2. the version token __PLUGIN_VERSION__ (src/index.html, src/70-ui.js UI_NEWS.ver) <- plugin/manifest.json "version" (ONE source)
//   3. node --check, then tools/check.mjs (static integration checks on src/)
//   4. terser -> plugin/bundle.js (minified: comments and whitespace out, names mangled inside the IIFE; the three.js @license kept)
//      --no-min writes the readable bundle to plugin/bundle.js instead (for debugging inside Otzaria)
//   5. src/index.html -> plugin/index.html with the version written in
//   6. --pack: dist/בית-ראשון-<version>.otzplugin (a zip of plugin/, files at the zip's root, as the store expects)
// The readable sources stay in src/ (and build/bundle.readable.js); the minified file is a build product only.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const noMin = args.includes('--no-min');
const doPack = args.includes('--pack');
const plugin = path.join(root, 'plugin');
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });
const manifest = JSON.parse(fs.readFileSync(path.join(plugin, 'manifest.json'), 'utf8'));
const version = String(manifest.version || '').trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('manifest.json version is not x.y.z: ' + version);
const TOKEN = '__PLUGIN_VERSION__';
const t0 = Date.now();
const log = (m) => console.log('[build] ' + m);

// 1. assemble (readable)
const readable = path.join(buildDir, 'bundle.readable.js');
execFileSync('node', [path.join(root, 'tools', 'assemble.mjs'), readable], { stdio: 'inherit' });
let code = fs.readFileSync(readable, 'utf8');
// 2. the version
const n = code.split(TOKEN).length - 1;
if (n < 1) throw new Error('the bundle has no ' + TOKEN + ' (src/70-ui.js UI_NEWS.ver)');
code = code.split(TOKEN).join(version);
fs.writeFileSync(readable, code, 'utf8');
log('version ' + version + ' written at ' + n + ' place(s) of the bundle');
// 3. checks
execFileSync('node', ['--check', readable], { stdio: 'inherit' });
execFileSync('node', [path.join(root, 'tools', 'check.mjs')], { stdio: 'inherit' });
// 4. minify
const out = path.join(plugin, 'bundle.js');
if (noMin) {
  fs.writeFileSync(out, code, 'utf8');
  log('plugin/bundle.js written READABLE (--no-min): ' + code.length + ' chars');
} else {
  const { minify } = await import('terser');
  const res = await minify(code, {
    compress: { passes: 2, keep_infinity: true, pure_getters: false, unsafe: false },
    mangle: { keep_classnames: false, keep_fnames: false },
    format: { comments: /@license|@preserve/i, ascii_only: false, max_line_len: 4000 },
    sourceMap: false
  });
  if (!res.code) throw new Error('terser produced no code');
  fs.writeFileSync(out, res.code, 'utf8');
  execFileSync('node', ['--check', out], { stdio: 'inherit' });
  log('plugin/bundle.js minified: ' + code.length + ' -> ' + res.code.length + ' chars');
}
// 5. index.html
const html = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
if (!html.includes(TOKEN)) throw new Error('src/index.html has no ' + TOKEN);
fs.writeFileSync(path.join(plugin, 'index.html'), html.split(TOKEN).join(version), 'utf8');
log('plugin/index.html written');
// 6. pack
if (doPack) {
  const dist = path.join(root, 'dist');
  fs.mkdirSync(dist, { recursive: true });
  const name = 'בית-ראשון-' + version + '.otzplugin';
  const zip = path.join(dist, name);
  if (fs.existsSync(zip)) fs.unlinkSync(zip);
  const files = fs.readdirSync(plugin).filter((f) => f !== '.otzignore');
  execFileSync('zip', ['-r', '-X', '-9', zip, ...files], { cwd: plugin, stdio: 'inherit' });
  log('packed: dist/' + name + ' (' + fs.statSync(zip).size + ' bytes)');
}
log('done in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
