// find the template literal chunks of a bundle that begin with " //" + a line break (the mark safe-lines.mjs put inside them by mistake)
import fs from 'fs'; import { createRequire } from 'module'; const require = createRequire('/home/claude/beit-rishon/tools/'); const acorn = require('acorn');
const f = process.argv[2]; const code = fs.readFileSync(f, 'utf8'); const hits = [];
acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true, onToken: (t) => { if (t.type.label === 'template' && /^ \/\/\r?\n/.test(code.slice(t.start, t.start + 5))) hits.push(t.start); } });
const lineOf = (p) => code.slice(0, p).split('\n').length;
console.log(f, 'template chunks starting with " //":', hits.length);
for (const p of hits) { const ln = lineOf(p); const before = code.slice(code.lastIndexOf('\n', p - 1) + 1, p).trim().slice(-70); const after = code.slice(p + 4, p + 110).replace(/\n/g, ' ⏎ '); console.log('  line', ln, '|', before, '|', after); }
