// SLIDES OF A PRESENTATION, EACH WITH ITS FURTHER VIEWS (12.11.2026; the user: "אם יש בשקופית להראות כמה מיצגים, אז בתוך אותה השקופית,
// המבט מסתובב"; "יש כאלה שלא מציגים כלום"). Every slide (or only those of the spec) is entered as the presentation enters it and
// photographed (v0); then the further views proposed for it in the spec are tried: a stop is a point [x, y, z, d?] - the eye comes
// nearer to it along the slide's own line of sight, to the distance d (default 0.4 of the slide's own, 4..26), nearer still when a
// wall stands in the way - or a written view { cam, tg }. Each is photographed (v1..), and the views as they were tried are written to
// views.jsonl ("out": [{ cam, tg, why }]), from which the table of the presentation is made after a person looked at every picture.
//   node tourstops.mjs <plugin dir> <out dir> <spec json | -> [mode = topics] [kinds = all | place,opinion,view,...] [only the spec's slides = 0|1]
import { open } from '/home/claude/qa/fs/h.mjs'; import fs from 'fs'; import path from 'path';
const [,, dir, out, specFile, modeArg, kindsArg, onlyArg] = process.argv; fs.mkdirSync(out, { recursive: true });
const SPEC = specFile && specFile !== '-' ? JSON.parse(fs.readFileSync(specFile, 'utf8')) : {};
const MODE = modeArg || 'topics', KINDS = !kindsArg || kindsArg === 'all' ? null : kindsArg.split(','), ONLY = onlyArg === '1';
const specOf = (title) => { const k = Object.keys(SPEC).find((k) => title === k) || Object.keys(SPEC).find((k) => title.indexOf(k) === 0); return k ? SPEC[k] : null; };
const P = await open(dir, { vw: 1680, vh: 760, dsf: 0.5 }); const pg = P.page;
await pg.evaluate(() => { const c = window.__ctx, q = window.__q, T = c.THREE;
  q.stops = (stops) => { const cam = c.camera.position.clone(), tg = c.controls.target.clone(), D = cam.distanceTo(tg), out = [];
    const sol = window.__ent360.solids(false), rc = new T.Raycaster(); rc.camera = c.camera;
    const first = (a, b) => { const d = b.clone().sub(a), L = d.length(); if (!(L > 0.01)) return Infinity; rc.set(a, d.normalize()); rc.near = 0.05; rc.far = L; const h = rc.intersectObjects(sol, false); return h.length ? h[0].distance : Infinity; };
    const r3 = (v) => v.toArray().map((x) => +x.toFixed(2));
    for (const s of stops || []) {
      if (!Array.isArray(s) && s && s.cam && s.tg) { out.push({ cam: s.cam, tg: s.tg, why: s.why || 'written' }); continue; }
      const a = Array.isArray(s) ? s : s.p, aim = new T.Vector3(a[0], a[1], a[2]); let u = cam.clone().sub(tg).normalize();
      if (!Array.isArray(s) && (s.az != null || s.el != null)) { const el = s.el != null ? s.el * Math.PI / 180 : Math.asin(u.y), az = Math.atan2(u.x, u.z) + (s.az || 0) * Math.PI / 180; u = new T.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)); }
      const d0 = (Array.isArray(s) ? a[3] : s.d) || Math.max(4, Math.min(26, 0.4 * D)); let done = false;
      for (const k of [1, 0.75, 0.55]) { const cp = aim.clone().addScaledVector(u, d0 * k); const f = first(cp, aim); if (f >= 0.9 * d0 * k) { out.push({ cam: r3(cp), tg: r3(aim), why: 'stop d' + (d0 * k).toFixed(1) }); done = true; break; } }
      if (!done) out.push({ cam: r3(aim.clone().addScaledVector(u, d0)), tg: r3(aim), why: 'BLOCKED' }); }
    return { D: +D.toFixed(1), cam: r3(cam), tg: r3(tg), out }; };
  q.setView = (p, t) => { c.camera.position.set(p[0], p[1], p[2]); c.controls.target.set(t[0], t[1], t[2]); c.controls.update(); try { window.__ent360.decide(); } catch (_) {} c.camera.position.set(p[0], p[1], p[2]); c.controls.update(); }; });   // decide(): the floor under the new look point (else the last view's floor lifts the eye)
await pg.evaluate((m) => { window.__ctx.shared.tour.start(m, { speed: 1 }); }, MODE); await pg.waitForTimeout(900);
const pause = async (on) => { await pg.evaluate((on) => { const T = window.__ctx.shared.tour; const st = T.state(); if (!!st.paused === !!on) return; T.pause(on); }, on); await pg.waitForTimeout(120); };
const list = await pg.evaluate(() => (window.__ctx.shared.tour.slides || []).map((s, i) => ({ i, kind: s.kind, title: s.title || '', then: (s.then || []).length, anim: !!s.anim, own: (s.then || []).map((t) => { const g = t.go && t.go[0]; return g && g.pos && g.target ? { cam: g.pos, tg: g.target, why: 'own' } : null; }).filter(Boolean) })));
const log = fs.createWriteStream(path.join(out, 'views.jsonl'), { flags: 'a' });
console.log('slides', list.length, 'spec', Object.keys(SPEC).length);
const missing = Object.keys(SPEC).filter((k) => !list.some((s) => s.title === k || s.title.indexOf(k) === 0)); if (missing.length) console.log('SPEC TITLES NOT FOUND:', JSON.stringify(missing));
for (const s of list) {
  const sp = specOf(s.title); if (ONLY && !sp) continue; if (KINDS && !KINDS.includes(s.kind)) continue;
  await pause(false); const ok = await pg.evaluate((i) => window.__ctx.shared.tour.goto(i), s.i); await pg.waitForTimeout(450); await pause(true);
  if (await pg.evaluate(() => window.__q.confirm())) { await pg.evaluate(() => window.__q.confirmYes()); await pg.waitForTimeout(400); }
  await P.settle(30000, 10); await pg.waitForTimeout(400);
  const name = 's' + String(s.i).padStart(3, '0'); await pg.evaluate(() => window.__q.grab()); await pg.screenshot({ path: path.join(out, name + '_v0.jpg'), type: 'jpeg', quality: 70 });
  const C = await pg.evaluate((st) => window.__q.stops(st), (s.own || []).concat(sp || []));
  let k = 0; for (const v of C.out) { k++; await pg.evaluate(([p, t]) => window.__q.setView(p, t), [v.cam, v.tg]); await P.settle(8000, 6); await pg.waitForTimeout(150);
    v.end = await pg.evaluate(() => window.__ctx.camera.position.toArray().map((x) => +x.toFixed(1)));
    await pg.evaluate(() => window.__q.grab()); await pg.screenshot({ path: path.join(out, name + '_v' + k + '.jpg'), type: 'jpeg', quality: 70 }); }
  const rec = { i: s.i, name, kind: s.kind, title: s.title, then: s.then, anim: s.anim, goto: ok, ...C };
  console.log(s.i, '|', s.kind, '|', s.title, '| D', C.D, '| then', s.then, '|', C.out.map((v) => v.why + (v.end && Math.hypot(v.end[0] - v.cam[0], v.end[1] - v.cam[1], v.end[2] - v.cam[2]) > 0.6 ? ' MOVED->' + v.end.join(',') : '')).join(' ; '));
  log.write(JSON.stringify(rec) + '\n');
}
console.log('errs', JSON.stringify(P.errs.slice(0, 5))); log.end(); fs.writeFileSync(path.join(out, 'done'), '1'); await P.close();
