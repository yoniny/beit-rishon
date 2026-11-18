// minify the Second Temple's readable bundle as tools/build.mjs minifies the First's (same terser options), then safe-lines
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/claude/beit-rishon/package.json');
const { minify } = require('terser');
const { safeLines } = await import('/home/claude/beit-rishon/tools/safe-lines.mjs');
const [src, dst] = process.argv.slice(2);
const code = fs.readFileSync(src, 'utf8');
const t0 = Date.now();
const res = await minify(code, {
  compress: { passes: 2, keep_infinity: true, pure_getters: false, unsafe: false },
  mangle: { keep_classnames: false, keep_fnames: false },
  format: { comments: /@license|@preserve/i, ascii_only: false, max_line_len: 4000 },
  sourceMap: false
});
if (!res.code) throw new Error('terser produced no code');
const safe = safeLines(res.code);
fs.writeFileSync(dst, safe.code, 'utf8');
console.log('minified', code.length, '->', res.code.length, 'chars,', Buffer.byteLength(safe.code), 'bytes, in', ((Date.now() - t0) / 1000).toFixed(1), 's');
