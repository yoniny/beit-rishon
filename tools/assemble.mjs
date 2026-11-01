// Assemble bundle.js for the First Temple plugin: header + three.js lib prefix (from the Second Temple bundle) + our modules + entry.
// Usage: node tools/assemble.mjs [outFile]  (run from the bayit1 folder; default plugin/bundle.js). Then: node --check plugin/bundle.js
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const src = path.join(root, 'src');
const order = ['00-lib.js', '10-core.js', '20-mount.js', '30-courts.js', '40-altar.js', '45-vessels.js', '50-heichal.js', '55-interior.js', '57-kelim.js', '60-palace.js', '70-ui.js', '75-tour.js', '90-entry.js'];
const header = fs.readFileSync(path.join(src, 'header.txt'), 'utf8');
let out = header;
for (const f of order) {
  const p = path.join(src, f);
  if (!fs.existsSync(p)) throw new Error('missing module ' + f);
  let t = fs.readFileSync(p, 'utf8');
  if (!t.endsWith('\n')) t += '\n';
  if (f !== '00-lib.js') out += '\n  // plugin/js/' + f + '\n';
  out += t;
}
out += '})();\n/**\n * @license\n * Copyright 2010-2023 Three.js Authors\n * SPDX-License-Identifier: MIT\n */\n';
// optional argument: another output file (parallel work must not overwrite each other's plugin/bundle.js)
const outFile = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'plugin', 'bundle.js');
fs.writeFileSync(outFile, out, 'utf8');
console.log(path.basename(outFile) + ' written:', out.length, 'chars');
