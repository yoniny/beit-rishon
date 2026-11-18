// Record presentation slides of Beit Rishon as frames with durations, in virtual time, for the projector video.
//   node rec.mjs --job A --from 0 --to 23                 verses slides 0..23
//   node rec.mjs --job B --from 24 --to 46 --pre 23       verses 24..46; slide 23 is played first, not captured (its end starts the first flight)
//   node rec.mjs --job C --throne                         verses 46 played first, then the three throne readings of the topics presentation (89..91)
// Output: <out>/f/NNNNNN.jpg and <out>/frames.jsonl ({ f, d seconds, s slide }), written slide by slide; <out>/progress.json.
import fs from 'node:fs';
import path from 'node:path';
import { serve, launch } from './common.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const has = (k) => args.includes(k);
const JOB = opt('--job', 'X');
const OUT = opt('--out', '/home/claude/usb/out/' + JOB);
const THRONE = has('--throne');
const FROM = +opt('--from', THRONE ? 89 : 0);
const TO = +opt('--to', THRONE ? 91 : 46);
// the throne readings: from 89 the verses' last slide (46) is played first; from a later reading, the reading before it (topics)
const PRE = THRONE ? (FROM === 89 ? 46 : FROM - 1) : (opt('--pre', '') === '' ? -1 : +opt('--pre'));
const PRE_TOPICS = THRONE && FROM > 89;
const DRIFT = +opt('--drift', 10);
const LIMIT = +opt('--limit', 999);
const FOLLOW = opt('--follow', '') === '' ? -1 : +opt('--follow');   // the base's demonstration on this slide: filmed with its own follow view
const DIRIDX = (i) => (THRONE && i >= 89 ? 47 + (i - 89) : i);   // the drift's side alternates along the whole video
const HDR = THRONE ? { part: 'כסא שלמה · הקריאות שבמדרשים', num: { 89: '1 / 3', 90: '2 / 3', 91: '3 / 3' } } : null;
const HOUSE_VER = JSON.parse(fs.readFileSync('/home/claude/src/beit-rishon/plugin/manifest.json', 'utf8')).version;

fs.mkdirSync(path.join(OUT, 'f'), { recursive: true });
const man = fs.createWriteStream(path.join(OUT, 'frames.jsonl'), { flags: 'w' });
const log = (...a) => console.log(new Date().toISOString().slice(11, 19) + ' [' + JOB + '] ' + a.join(' '));
const readTime = (w) => Math.min(26, Math.max(8, 4 + 0.38 * w));
const q40 = (s) => Math.max(0.04, Math.round(s / 0.04) * 0.04);

const { srv, port } = await serve();
const browser = await launch();
let page;
const tReal0 = Date.now();
let nFile = 0, slideFrames = [], lastCapT = -1e9, capturing = PRE < 0, curIdx = null, slideReal0 = Date.now(), slidesDone = 0, totalVideo = 0;
const lastFrame = () => slideFrames[slideFrames.length - 1];
const addTime = (s) => { const L = lastFrame(); if (L) L.d += s; };
const writeProgress = (extra) => fs.writeFileSync(path.join(OUT, 'progress.json'), JSON.stringify(Object.assign({ job: JOB, slide: curIdx, files: nFile, video_s: +totalVideo.toFixed(1), real_min: +((Date.now() - tReal0) / 60000).toFixed(1) }, extra || {})));
async function capture(t) {
  if (!capturing) { await page.evaluate(() => window.__cap.commit()); return; }
  await page.evaluate(() => window.__cap.render());
  const f = 'f/' + String(++nFile).padStart(6, '0') + '.jpg';
  await page.screenshot({ path: path.join(OUT, f), type: 'jpeg', quality: 90, optimizeForSpeed: true });
  await page.evaluate(() => window.__cap.commit());
  slideFrames.push({ f, d: 0.04 });
  lastCapT = t;
  if (nFile % 50 === 0) writeProgress();
}
function flushSlide() {
  if (!slideFrames.length) return;
  for (const fr of slideFrames) man.write(JSON.stringify({ f: fr.f, d: +fr.d.toFixed(3), s: curIdx }) + '\n');
  const dur = slideFrames.reduce((a, b) => a + b.d, 0);
  totalVideo += dur;
  log(`slide ${curIdx} done: ${slideFrames.length} frames, ${dur.toFixed(1)} s of video, ${((Date.now() - slideReal0) / 60000).toFixed(1)} min`);
  slideFrames = [];
  writeProgress();
}
// a step of the frame loop: capture by what changed (25 fps for fast motion, 12.5 fps for slow), or let the last frame stay longer
async function stepCapture(budgetFn) {
  const s = await page.evaluate(() => window.__cap.step(40));
  if (s.changed) {
    if (s.discrete || s.fast || s.t - lastCapT >= 79) await capture(s.t);
    else addTime(0.04);
  } else if (budgetFn) budgetFn(s);
  return s;
}
// the camera arrived: the tour pauses; the slow move during the first page; then the other pages, each with its reading time
async function settle() {
  const pl = await page.evaluate(() => { window.__cap.pause(true); return window.__cap.pages(); });
  const dir = DIRIDX(curIdx) % 2 === 0 ? 1 : -1;
  const mode = await page.evaluate((d, s) => window.__cap.drift(d, s), dir, DRIFT);
  let tDrift = 0, still = 0;
  for (let k = 0; k < Math.round(DRIFT * 25) + 80; k++) {
    const s = await stepCapture(() => { still++; if (capturing) addTime(0.04); });
    tDrift += 0.04;
    if (s.changed) still = 0;
    if (k > DRIFT * 25 && still >= 3) break;
  }
  if (capturing) {
    const need = Math.max(readTime(pl[0].words), DRIFT + 3) - tDrift;
    if (need > 0) addTime(q40(need));
    for (let k = 1; k < pl.length; k++) {
      await page.evaluate((k) => window.__cap.showPage(k), k);
      await capture(-1);
      lastFrame().d = q40(readTime(pl[k].words));
    }
  }
  await page.evaluate(() => window.__cap.pause(false));
  log(`  pages ${pl.length} (words ${pl.map((p) => p.words).join('+')}), move: ${mode} ${dir > 0 ? '+' : '-'}`);
}
async function throneSwitch() {
  const pose = await page.evaluate(() => window.__cap.pose());
  await page.evaluate((pose) => {
    const T = window.__ctx.shared.tour;
    T.stop();
    T.start('topics');
    window.__cap.setPose(pose);
    T.goto(89);
  }, pose);
  capturing = true;
  log('switched to the throne readings (topics 89..91)');
}

try {
  page = await browser.newPage();
  page.setDefaultTimeout(900000);
  await page.evaluateOnNewDocument((ver) => { try { localStorage.setItem('tm1.news.seen', ver); localStorage.setItem('tm2.news.seen', '9.9.9'); } catch (_) {} }, HOUSE_VER);
  await page.evaluateOnNewDocument(fs.readFileSync('/home/claude/usb/rec/vt.js', 'utf8'));
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => log('pageerror: ' + String(e && e.message || e).slice(0, 300)));
  page.on('console', (m) => { if (m.type() === 'error') { const t = m.text(); if (!/favicon|404|Failed to load resource/.test(t)) log('console: ' + t.slice(0, 200)); } });
  await page.goto(`http://127.0.0.1:${port}/rishon/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.classList.contains('tm-ready'), { timeout: 900000, polling: 500 });
  await page.evaluate(() => { const n = document.getElementById('tm-news'); if (n) n.remove(); });
  await page.addStyleTag({ content: fs.readFileSync('/home/claude/usb/rec/fonts.css', 'utf8') + '\n' + fs.readFileSync('/home/claude/usb/rec/projector.css', 'utf8') });
  await page.evaluate(async () => {
    await Promise.all(['500 25px "Noto Sans Hebrew"', '600 17px "Noto Sans Hebrew"', '700 32px "Noto Sans Hebrew"', '400 31px "Frank Ruhl Libre"', '700 31px "Frank Ruhl Libre"'].map((f) => document.fonts.load(f, 'אבג שָׁלוֹם 123')));
    await document.fonts.ready;
  });
  await page.evaluate((h) => { window.__recHdr = h; }, HDR);
  await page.evaluate(fs.readFileSync('/home/claude/usb/rec/cap.js', 'utf8'));
  await page.evaluate(() => window.__vt.start());
  for (let k = 0; k < 600; k++) { if (await page.evaluate(() => window.__vt.raf.size > 0)) break; await new Promise((r) => setTimeout(r, 100)); }   // (no waitForFunction: its polling timers are virtual now)
  await page.evaluate(() => window.__vt.sync());
  const amb = await page.evaluate(() => window.__cap.learnAmbient(30));
  log(`ready after ${((Date.now() - tReal0) / 1000).toFixed(0)} s; ambient objects: ${amb}`);
  if (PRE >= 0) await page.evaluate((i, m) => { const T = window.__ctx.shared.tour; T.start(m); T.goto(i); }, PRE, PRE_TOPICS ? 'topics' : 'verses');
  else await page.evaluate((i) => { const T = window.__ctx.shared.tour; T.start('verses'); if (i > 0) T.goto(i); }, FROM);
  let info = null, slideStartT = 0, staticRun = 0, paged = false, budget = 0, demoSeen = false, dynPrev = false, ambientTries = 0, heldAfterDemo = false, restSince = 0;
  let followOn = false, followFar = 0;
  for (let guard = 0; guard < 3000000; guard++) {
    const s = await page.evaluate(() => window.__cap.step(40));
    if (s.ans) log('  the cloud question: answered "remove the cloud"');
    if (!s.running || s.ended) { flushSlide(); log('the presentation ended'); break; }
    if (s.idx !== curIdx) {
      flushSlide();
      curIdx = s.idx;
      if (capturing && curIdx > TO) { log('end of range'); break; }
      if (!capturing && PRE >= 0 && curIdx !== PRE && (!THRONE || PRE_TOPICS)) capturing = true;
      if (capturing && slidesDone >= LIMIT) { log('limit reached'); break; }
      if (capturing) slidesDone++;
      info = await page.evaluate((i) => window.__cap.slideInfo(i), curIdx);
      slideStartT = s.t; staticRun = 0; paged = false; budget = 0; demoSeen = false; dynPrev = false; slideReal0 = Date.now(); ambientTries = 0; heldAfterDemo = false; followOn = false; followFar = 0;
      log(`slide ${curIdx} start${capturing ? '' : ' (played first, not captured)'}: ${info && info.title} ${info ? JSON.stringify({ anim: info.anim, act: info.act, demoF: info.demoF, then: info.then }) : ''}`);
    }
    if (s.demo) demoSeen = true;
    if (FOLLOW === curIdx && capturing && !paged && !heldAfterDemo && s.demo) {
      if (!followOn) {
        // the plugin's follow view: a 1.6 s flight to the view of the present moment; after it, the view of each moment (snap) every frame
        await page.evaluate(() => { const m = window.__ctx.shared.mechona; window.__fol = { t0: m.follow.view(0).target, far: 0, from: performance.now() + 1750 }; m.follow.start(); });
        followOn = true;
        log('  the follow view: on');
      } else {
        const r = await page.evaluate(() => {
          const m = window.__ctx.shared.mechona, W = window.__fol;
          if (performance.now() < W.from) return { d: -1, far: W.far };
          m.follow.snap();
          const ctl = (window.__TM_CTX && window.__TM_CTX.controls) || window.__ctx.controls, t = ctl.target;
          const d = Math.hypot(t.x - W.t0[0], t.z - W.t0[2]);
          W.far = Math.max(W.far, d);
          return { d, far: W.far };
        });
        if (r.far > 5 && r.d >= 0 && r.d < 0.4) {
          await page.evaluate(() => { window.__cap.pause(true); const m = window.__ctx.shared.mechona; try { m.follow.stop(); } catch (_) {} try { m.demo.reset(); } catch (_) {} });
          heldAfterDemo = true;
          log('  the round is over (the base is home): the tour waits for the text');
        }
      }
    }
    // a demonstration has just ended: the tour waits (paused) until the camera rests and the text pages are shown; without this the
    // slide could end (two seconds of rest) while things still move (the base driving home), and the text would never be paged
    if (!paged && demoSeen && !s.demo && !heldAfterDemo) { await page.evaluate(() => window.__cap.pause(true)); heldAfterDemo = true; log('  the demonstration ended: the tour waits for the text'); }
    if (s.changed) {
      staticRun = 0;
      if (!paged && !s.demo && s.nScene > 0 && !s.discrete && !s.fast && s.camRest) {
        // something keeps moving while the camera rests and no demonstration runs: an ambient animation the first look did not see
        if (++ambientTries > 40) { const n = await page.evaluate(() => window.__cap.addAmbientNow()); log(`  ${n} more ambient objects`); ambientTries = 0; }
      }
      if (capturing) {
        if (s.discrete || s.fast || s.t - lastCapT >= 79) await capture(s.t);
        else addTime(0.04);
      } else await page.evaluate(() => window.__cap.commit());
      dynPrev = true;
    } else {
      staticRun++;
      if (!paged) {
        if (capturing) addTime(0.04);
        const expectDemo = info && (info.anim || info.act || info.demoF);
        if (staticRun === 3) restSince = s.t;
        // a place's action that starts no demonstration (only a view): four seconds of rest are enough; and no slide ends unpaged
        const noDemoAfterAll = expectDemo && !demoSeen && staticRun >= 3 && s.t - restSince > 4000;
        const slideEnding = !s.demo && s.slideMs > 0 && s.elapsed >= s.slideMs - 1500;
        if (staticRun >= 3 && !s.demo && (!expectDemo || demoSeen || noDemoAfterAll || slideEnding || s.t - slideStartT > 20000)) {
          await settle();
          paged = true; budget = 0; dynPrev = false;
        }
      } else {
        if (dynPrev) { budget = 2.0; dynPrev = false; }
        if (budget > 0) { if (capturing) addTime(0.04); budget -= 0.04; }
        if (THRONE && !PRE_TOPICS && !capturing && curIdx === PRE && s.elapsed >= 0.92 * s.slideMs) await throneSwitch();
      }
    }
    if (!paged && !s.demo && !heldAfterDemo && s.slideMs > 0 && s.elapsed >= s.slideMs - 1500) { await page.evaluate(() => window.__cap.pause(true)); heldAfterDemo = true; log('  the slide was ending unpaged: the tour waits for the text'); }
    if (!paged && s.demo && s.t - slideStartT > 150000) { log('  a demonstration longer than 150 s: the text pages now'); await settle(); paged = true; }
  }
  flushSlide();
  writeProgress({ done: true });
  log(`finished: ${nFile} frames, ${totalVideo.toFixed(1)} s of video, ${((Date.now() - tReal0) / 60000).toFixed(1)} min`);
} catch (e) {
  log('ERROR ' + (e && e.stack || e));
  writeProgress({ error: String(e && e.message || e) });
  process.exitCode = 1;
} finally {
  man.end();
  await browser.close();
  srv.close();
}
