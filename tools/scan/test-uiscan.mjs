// A test of the layout check (uiscan.js): it must NOT flag a button inside a closed <details> (the browser keeps a box for it, the user cannot see it) or a
// rotating pointer-events:none wrapper, and it MUST still flag a button that is really covered by another one or really out of the window.
// Run:  /home/claude/fix/tools/one-browser.sh node tools/scan/test-uiscan.mjs
import fs from 'node:fs';
import { launch } from '/home/claude/split/watch/lib.mjs';
const UISCAN = fs.readFileSync(new URL('./uiscan.js', import.meta.url), 'utf8');
const html = `<!doctype html><meta charset=utf-8><body style="margin:0">
<div id="tm-panel" style="position:fixed;top:10px;right:10px;width:200px;max-height:300px;overflow-y:auto">
  <details id="closed"><summary>קבוצה סגורה</summary><button id="b-closed1">כפתור בקבוצה סגורה</button><button id="b-closed2">עוד כפתור בקבוצה סגורה</button></details>
  <details id="open" open><summary>קבוצה פתוחה</summary><button id="b-open">כפתור בקבוצה פתוחה</button></details>
  <div id="list" style="height:60px;overflow-y:auto"><button style="display:block;height:40px">נגלל 1</button><button style="display:block;height:40px">נגלל 2</button><button style="display:block;height:40px">נגלל 3 (מתחת לקפל)</button></div>
</div>
<div id="tm-compass" style="position:fixed;left:10px;bottom:10px;width:58px;height:58px;border-radius:50%"><div id="tm-rotor" style="position:absolute;left:0;top:0;width:56px;height:56px;transform:rotate(45deg) translate(0,6px);pointer-events:none"></div></div>
<div id="tm-nav" style="position:fixed;left:200px;top:100px">
  <button id="under" style="position:absolute;left:0;top:0;width:90px;height:40px">כפתור מכוסה</button>
  <button id="over" style="position:absolute;left:0;top:0;width:90px;height:40px">הכפתור המכסה</button>
  <button id="outside" style="position:absolute;left:300px;top:700px;width:90px;height:40px">כפתור מחוץ לחלון</button>
</div>`;
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 800, height: 600 });
await page.setContent(html);
const res = await page.evaluate(UISCAN);
await browser.close();
const has = (type, txt) => res.some((f) => f.type === type && f.text.includes(txt));
const checks = [
  ['closed group: no "covered" / "out-of-frame" for its buttons', !res.some((f) => /בקבוצה סגורה/.test(f.text))],
  ['scrolling list: its buttons below the fold are not flagged', !res.some((f) => /נגלל/.test(f.text))],
  ['rotor (pointer-events:none wrapper) is not flagged', !res.some((f) => f.el === '#tm-rotor')],
  ['a really covered button IS flagged', has('covered', 'כפתור מכוסה')],
  ['a button really out of the window IS flagged', has('out-of-frame', 'כפתור מחוץ לחלון')]
];
let bad = 0; for (const [n, ok] of checks) { console.log((ok ? 'PASS ' : 'FAIL ') + n); if (!ok) bad++; }
if (bad) console.log(JSON.stringify(res)); process.exit(bad ? 1 : 0);
