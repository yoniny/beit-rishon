// tools/safe-lines.mjs — every code line of a bundle ends with an empty comment (" //"), and a check that the store's validator can
// read the file in reasonable time.
//
// WHY (11.11.2026: the publication of 2.0.2 hung in the store's validator and was cancelled). Before it looks for the SDK calls,
// Otzaria's plugin validator takes strings, comments and regular-expression literals out of every file, and it finds the literals with
// one regular expression that cannot cross a line. A division that follows "]" - a[t]/2 - looks to it like the start of a literal;
// when no other "/" comes later on the same line the search must fail, and before it fails it tries every way to read the "[...]"
// that follow, as a class or as plain characters: 2^n ways. One line of the minified bundle (about 4000 characters, forty "[...]"
// after such a division) never ended. With a "/" at the end of every line the search succeeds at once, whatever the minifier does
// with the lines. A line break inside a template literal (the CSS texts), a string or a block comment is left as it is: the tokens
// are acorn's own (the whole file is parsed).
//
//   node tools/safe-lines.mjs <file.js>            rewrite the file in place (does nothing to a line that already ends with //)
//   node tools/safe-lines.mjs --check <file> ...   the validator's own search, line by line, on .js / .html files; exits 1 when a
//                                                  line takes too long (run it with a timeout: a bad line does not come back)
//   import { safeLines } from './safe-lines.mjs'
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// the tokens of a script without its comments: what the file IS, whatever is written between the tokens
function tokensOf(code) {
  const acorn = require('acorn');
  const list = [];
  acorn.parse(code, {
    ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true,
    onToken: (t) => { list.push(t.type.label + '\u0001' + code.slice(t.start, t.end)); }
  });
  return list;
}

export function safeLines(code) {
  const acorn = require('acorn');
  const spans = [];   // [start, end) of every token and block comment that may hold a line break
  acorn.parse(code, {
    ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true,
    // 1.3.6 / 1.9.4 (11.11.2026): a piece of a template literal is kept whatever its length - a piece that is one line break was skipped
    onToken: (t) => { if (t.type.label === 'template' || t.end - t.start > 1) spans.push([t.start, t.end]); },
    onComment: (block, text, start, end) => { if (block) spans.push([start, end]); }
  });
  spans.sort((a, b) => a[0] - b[0]);
  let out = '', last = 0, k = 0, added = 0;
  for (let p = code.indexOf('\n'); p >= 0; p = code.indexOf('\n', p + 1)) {
    while (k < spans.length && spans[k][1] <= p) k++;
    // inside a template literal / a string / a block comment. 1.3.6 / 1.9.4 (11.11.2026): "<=" - a template's text that BEGINS with a
    // line break (var css = `<line break>...) starts exactly at the break; with "<" the mark went INTO the text, and the first rule of two
    // style texts of the Second Temple was lost (the presentation's menu fell apart; the user: "מצגת בית שני, לא מתחיל לפעול בכלל")
    if (k < spans.length && spans[k][0] <= p && p < spans[k][1]) continue;
    let e = p;
    if (e > 0 && code[e - 1] === '\r') e--;
    let s = e;
    while (s > 0 && (code[s - 1] === ' ' || code[s - 1] === '\t')) s--;
    if (s === 0 || code[s - 1] === '\n') continue;                          // an empty line
    if (code[s - 1] === '/' && code[s - 2] === '/') continue;               // already ends with //
    out += code.slice(last, e) + ' //';
    last = e;
    added++;
  }
  out += code.slice(last);
  // 1.3.6 / 1.9.4: the proof that only comments were added - the file's tokens (every string, template text, name and sign) are the
  // same before and after, one by one. A difference stops the build
  if (added) {
    const A = tokensOf(code), B = tokensOf(out);
    let bad = A.length !== B.length ? Math.min(A.length, B.length) : -1;
    for (let i = 0; bad < 0 && i < A.length; i++) if (A[i] !== B[i]) bad = i;
    if (bad >= 0) throw new Error('safe-lines: the rewrite changed the code itself (token ' + bad + ': ' + JSON.stringify(String(A[bad]).slice(0, 80)) + ' -> ' + JSON.stringify(String(B[bad]).slice(0, 80)) + ')');
  }
  return { code: out, added };
}

// the validator's steps (its regular expressions, as its source gives them), timed line by line
export function probe(text, onSlow, budgetMs = 400) {
  let s = text.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  let n = 0;
  s = s.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, () => ` STR${n++} `);
  const RE = /(^|[=(,;:!?~&|+\-*/%<>{}[\]]|=>|\breturn\b|\bthrow\b|\bin\b|\bof\b|\btypeof\b|\bdelete\b|\bvoid\b|\binstanceof\b|\bnew\b)(\s*)(\/(?:\\.|\[(?:\\.|[^\]\\\n\r])*\]|[^/\\\n\r])+?\/[gimsuyd]*)/g;
  const lines = s.split('\n');
  let worst = 0, slow = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('/') < 0) continue;
    const t = Date.now();
    lines[i].replace(RE, '');
    const ms = Date.now() - t;
    if (ms > worst) worst = ms;
    if (ms > budgetMs) { slow++; if (onSlow) onSlow(i, ms, lines[i]); }
  }
  // the whole text at once, as the validator does
  const t = Date.now();
  s.replace(RE, '');
  return { lines: lines.length, worst, slow, whole: Date.now() - t };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const args = process.argv.slice(2);
  if (args[0] === '--check') {
    let bad = 0;
    for (const f of args.slice(1)) {
      process.stdout.write('[safe-lines] ' + f + ' ... ');   // written BEFORE the search: the file a hang belongs to is the last one named
      const r = probe(fs.readFileSync(f, 'utf8'), (i, ms, line) => { bad++; console.log('\n  SLOW line ' + i + ': ' + ms + ' ms: ' + line.slice(0, 120)); });
      console.log(r.lines + ' lines, the slowest ' + r.worst + ' ms, the whole file ' + r.whole + ' ms');
      if (r.whole > 5000) bad++;
    }
    process.exit(bad ? 1 : 0);
  }
  for (const f of args) {
    const before = fs.readFileSync(f, 'utf8');
    const r = safeLines(before);
    if (r.added) fs.writeFileSync(f, r.code, 'utf8');
    console.log('[safe-lines] ' + f + ': ' + r.added + ' line ends closed with //');
  }
}
