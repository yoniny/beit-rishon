// Category 1 - a switch that changes nothing. Every row of the opinions table (= the chips on the cards) and every option of it, every
// on-model pill (ctx.shared.modelButtons) and every checkbox of the panel: switched, and the scene compared - the visible geometry (a hash
// per mesh: matrix, count, material), and the pixels from the same camera. Zero difference is reported.
export async function run(S, out, opt) {
  const rows = await S.ev(() => window.__SCAN.rows());
  out.stats.rows = rows.length; out.stats.options = rows.reduce((a, r) => a + r.n, 0);
  const only = opt.only ? String(opt.only).split(',') : null;
  const limit = opt.limit ? +opt.limit : 1e9;
  let k = 0;
  for (const r of rows) {
    if (only && !only.some((o) => r.id.includes(o) || (r.cap || '').includes(o))) continue;
    if (k++ >= limit) break;
    const al0 = await S.ev(() => window.__SCAN.alive()).catch(() => null);
    if (al0 && (al0.lost || al0.mean < 5)) { out.add('critical', `הרינדור מת לפני "${r.cap}" — סריקת המתגים נעצרה`, JSON.stringify(al0)); break; }
    const n0 = S.msgs.length, t0 = Date.now();
    let res;
    try { res = await S.ev((id) => window.__SCAN.rowScan(id), r.id); } catch (e) { out.add('high', `מתג "${r.cap}" — הסריקה נכשלה`, String(e.message).slice(0, 300), { item: r.id }); continue; }
    const errs = S.errsSince(n0);
    const label = (i) => `${r.labels[i]} (${r.keys[i]})`;
    let bad = 0;
    for (const p of res.pairs) {
      const nothing = !p.geom && p.px < 0.0008;
      if (nothing) {
        bad++;
        const shot = out.shot('noop-' + r.id + '-' + p.a + '-' + p.b, res.img0);
        out.add('high', `מתג שאינו משנה כלום: "${r.cap}" — ${label(p.i)} ↔ ${label(p.j)}`,
          `בין שתי האפשרויות אין שום הבדל: אותה גאומטריה גלויה (hash זהה, אותו מספר mesh) ואפס הבדל פיקסלים מ־${res.poses} מצלמות. קבוצה: ${r.group || '-'}.`, { item: r.id, shots: shot ? [shot] : [], data: p });
      } else if (!p.geom && p.px >= 0.0008) {
        out.add('info', `"${r.cap}": ${p.a} ↔ ${p.b} משנה רק צבע/תאורה`, `אין שינוי בגאומטריה אלא בפיקסלים (${p.px}).`, { item: r.id, data: p });
      } else if (p.geom && p.px < 0.0008) {
        out.add('medium', `"${r.cap}": ${p.a} ↔ ${p.b} — שינוי שאינו נראה מהמצלמות הנבדקות`, `הגאומטריה השתנתה (${(p.ex || []).join(', ')}) אך אין הבדל פיקסלים (${res.poses} מצלמות). ייתכן שהשינוי מחוץ למסגרת או מוסתר — לבדוק ידנית.`, { item: r.id, data: p });
      }
    }
    if (res.nobtn) out.add('high', `מתג "${r.cap}": ${res.nobtn} כפתורי אפשרות חסרים בשורה`, 'כפתור האפשרות אינו קיים ב־DOM של השורה.', { item: r.id });
    if (errs.length) out.add('high', `שגיאת קונסול בהחלפת "${r.cap}"`, errs.slice(0, 3).map((m) => m.text).join(' | '), { item: r.id });
    console.log(`[toggles] ${r.id} (${r.n} options) ${((Date.now() - t0) / 1000).toFixed(1)}s ${bad ? 'NO-OP x' + bad : ''}`);
  }

  // on-model pills: on, off - each must change the scene, and off must restore it
  const mbs = await S.ev(() => (window.__TM_CTX.shared.modelButtons || []).map((b, i) => ({ i, id: b.id, label: b.label, labelOn: b.labelOn, layer: b.layer || '', removal: !!b.removal, demo: (window.__TM_CTX.shared.demoStops || []).some((d) => d.id === b.id) || /^הדגמ/.test(b.label || '') })));
  out.stats.pills = mbs.length;
  for (const b of mbs) {
    if (b.demo) continue;   // the demonstrations: category 3
    const n0 = S.msgs.length;
    const res = await S.ev(async (i) => {
      const SC = window.__SCAN, c = window.__TM_CTX, B = c.shared.modelButtons[i], o = { id: B.id };
      const ask = () => { try { SC.yes(); } catch (_) {} };
      const run = async (on) => { try { B.set(on); } catch (e) { o.err = String(e.message); } ask(); window.__step(2500); await SC.sleep(20); ask(); window.__step(2500); window.__step(120); };
      const get = () => { try { return B.get(); } catch (_) { return null; } };
      o.start = get();
      // a pose that sees the pill's subject: its anchor, from 40 amot away
      let a = B.anchor; try { if (typeof a === 'function') a = a(); } catch (_) { a = null; }
      const P0 = SC.getPose();
      if (Array.isArray(a)) { const cp = c.camera.position, d = c.camera.position.clone().sub({ x: a[0], y: a[1], z: a[2] }); const L = d.length() || 1; d.multiplyScalar(Math.min(45, L) / L); SC.setPose({ p: [a[0] + d.x, a[1] + Math.max(8, d.y), a[2] + d.z], t: a }); }
      window.__step(100); const s0 = SC.snap(), p0 = SC.px(16); window.__step(100); const sN = SC.snap(), ign = SC.noise(s0, sN);
      await run(!o.start); o.mid = get(); window.__step(100); const s1 = SC.snap(), p1 = SC.px(16);
      o.cmp = SC.cmp(s0, s1, ign); o.px = SC.pdiff(p0, p1).frac; o.img = SC.jpg(420);
      await run(!!o.start); window.__step(100); const s2 = SC.snap(); o.back = SC.cmp(s0, s2, ign); o.end = get();
      SC.setPose(P0); return o;
    }, b.i).catch((e) => ({ id: b.id, err: String(e.message) }));
    const errs = S.errsSince(n0);
    const nm = `${b.label}${b.layer ? ' [' + b.layer + ']' : ''}`;
    if (res.err) out.add('high', `כפתור על המודל "${nm}" — שגיאה`, res.err, { item: b.id });
    else {
      if (res.mid === res.start) out.add('high', `כפתור "${nm}": ההחלפה לא שינתה את מצבו (get() זהה)`, `מצב לפני ${res.start}, אחרי ${res.mid}.`, { item: b.id });
      if (res.cmp.same && res.px < 0.0008) { const sh = out.shot('pill-' + b.id, res.img); out.add('high', `כפתור על המודל "${nm}" אינו משנה כלום`, `אותה גאומטריה גלויה ואפס הבדל פיקסלים בין מצב כבוי למצב דלוק (n=${res.cmp.n0}).`, { item: b.id, shots: sh ? [sh] : [], data: res.cmp }); }
      else if (res.cmp.same) out.add('low', `כפתור "${nm}": שינוי פיקסלים בלבד`, 'אין שינוי גאומטרי, יש בפיקסלים.', { item: b.id });
      if (!res.back.same) out.add('medium', `כפתור "${nm}": הכיבוי אינו מחזיר את הסצנה`, `אחרי הדלקה וכיבוי הסצנה שונה מהמקור (+${res.back.added} −${res.back.removed} ~${res.back.changed}; ${(res.back.ex || []).join(', ')}).`, { item: b.id });
    }
    if (errs.length) out.add('high', `שגיאת קונסול בכפתור "${nm}"`, errs.slice(0, 3).map((m) => m.text).join(' | '), { item: b.id });
  }

  // the panel's own checkboxes (the viewing tools)
  const boxes = await S.ev(() => [...document.querySelectorAll('#tm-panel input[type=checkbox]')].map((e, i) => ({ i, label: (e.closest('label') || e.parentElement || {}).textContent || e.id || '' })));
  out.stats.checkboxes = boxes.length;
  for (const b of boxes) {
    const n0 = S.msgs.length;
    const res = await S.ev(async (i) => {
      const SC = window.__SCAN, e = document.querySelectorAll('#tm-panel input[type=checkbox]')[i], o = {};
      if (!e || e.disabled) return { skip: true };
      SC.openUp(e); window.__step(100); const s0 = SC.snap(), p0 = SC.px(16), st0 = e.checked; window.__step(100); const ign = SC.noise(s0, SC.snap());
      e.click(); SC.yes(); window.__step(2500); await SC.sleep(20); window.__step(1500); window.__step(100);
      const s1 = SC.snap(), p1 = SC.px(16); o.cmp = SC.cmp(s0, s1, ign); o.px = SC.pdiff(p0, p1).frac; o.flipped = e.checked !== st0; o.img = SC.jpg(420);
      e.click(); SC.yes(); window.__step(2500); window.__step(120); o.restored = e.checked === st0; return o;
    }, b.i).catch((e) => ({ err: String(e.message) }));
    if (res.skip) continue;
    const nm = b.label.trim().replace(/\s+/g, ' ').slice(0, 50);
    if (res.err) out.add('medium', `תיבת סימון "${nm}" — שגיאה`, res.err);
    else {
      if (!res.flipped) out.add('high', `תיבת סימון "${nm}": הלחיצה לא החליפה את המצב`, 'ה־checkbox נשאר באותו מצב אחרי לחיצה.');
      if (res.cmp.same && res.px < 0.0008 && !/קול|שמע|צליל|רעש|השתק|מצלמה|סיבוב/.test(nm)) { const sh = out.shot('chk-' + nm, res.img); out.add('medium', `תיבת סימון "${nm}" אינה משנה כלום בסצנה`, 'אין הבדל בגאומטריה ואין הבדל פיקסלים במבט הנוכחי (ייתכן שהמתג משפיע על מבט אחר).', { shots: sh ? [sh] : [] }); }
    }
    const errs = S.errsSince(n0); if (errs.length) out.add('high', `שגיאת קונסול בתיבת "${nm}"`, errs.slice(0, 3).map((m) => m.text).join(' | '));
  }
}
