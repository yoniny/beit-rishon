// Category 2 - the views. Every place of the menu, every view button of the panel and "מבט כללי": go there, shoot, and flag: the aim point
// not in the frustum / hidden behind a solid / in empty air, the eye inside a solid (a back face is the first thing met in many
// directions), a dark / black / one-colour picture (histogram), console errors on the way. Also each option of the opinions table that flies.
export async function run(S, out, opt) {
  const items = await S.ev(() => {
    const c = window.__TM_CTX, o = [];
    for (const p of c.ui.places()) { let exp = null; try { const f = p.fp ? c.ui.resolveFp(p.fp) : null; if (f && f.target) exp = f.target; } catch (_) {} o.push({ kind: 'place', title: p.title, group: p.group, exp, fp: p.fp, feature: p.feature }); }
    const V = c.ui.views || [];
    for (const v of V) o.push({ kind: 'view', title: v.label || v.title || v.key, key: v.key, group: 'מבטים' });
    return o;
  });
  out.stats.items = items.length;
  const only = opt.only ? String(opt.only).split(',') : null, limit = opt.limit ? +opt.limit : 1e9;
  let k = 0;
  const seenFinding = new Set();
  let darkRun = 0;
  for (const it of items) {
    if (only && !only.some((o) => it.title.includes(o))) continue;
    if (k++ >= limit) break;
    const n0 = S.msgs.length;
    const r = await S.ev(async (it) => {
      const SC = window.__SCAN, c = window.__TM_CTX, o = {};
      const b = it.kind === 'place' ? c.ui.placeButton(it.title) : c.ui.viewButton(it.key);
      if (!b) return { nobtn: true };
      if (b.disabled) return { disabled: true };
      SC.clickEl(b); await SC.afterClick(6000);
      window.__step(200);
      o.stats = SC.pstats(SC.px(16));
      if (o.stats.mean < 14 || o.stats.std < 6) { for (let i = 0; i < 4; i++) { window.__step(150); await SC.sleep(20); } o.first = o.stats; o.stats = SC.pstats(SC.px(16)); }   // a black frame may be a frame not painted yet: look again
      o.diag = SC.diag();
      if (it.exp) o.arrive = Math.round(new c.THREE.Vector3(...it.exp).distanceTo(c.controls.target) * 10) / 10;
      o.demoRunning = (c.shared.demoStops || []).filter((d) => { try { return d.running(); } catch (_) { return false; } }).map((d) => d.id);
      o.card = !!document.getElementById('tm-xcard') && getComputedStyle(document.getElementById('tm-xcard')).display !== 'none';
      return o;
    }, it).catch((e) => ({ err: String(e.message) }));
    const errs = S.errsSince(n0);
    const nm = `${it.group ? it.group + ' ← ' : ''}${it.title}`;
    const add = async (sev, title, detail) => {
      const key = sev + title; if (seenFinding.has(key)) return; seenFinding.add(key);
      const jp = await S.ev(() => window.__SCAN.shotNow(480)).catch(() => null);
      const sh = out.shot((it.kind === 'place' ? 'p-' : 'v-') + it.title, jp);
      out.add(sev, title, detail, { item: it.title, shots: sh ? [sh] : [], data: { diag: r.diag, stats: r.stats } });
    };
    if (r.nobtn) { out.add('high', `פריט תפריט בלי כפתור: ${nm}`, 'placeButton/viewButton מחזיר null.'); continue; }
    if (r.disabled) { out.add('medium', `כפתור מנוטרל בתפריט: ${nm}`, 'הכפתור disabled.'); continue; }
    if (r.err) { out.add('high', `מעבר למבט נכשל: ${nm}`, r.err); continue; }
    const st = r.stats, d = r.diag;
    if (st.mean < 14 || st.dark > 0.9) darkRun++; else darkRun = 0;
    if (darkRun >= 4) {   // not four dark views in a row by chance: the renderer is dead (a lost WebGL context under software GL, or a render error) - the rest would be noise
      const al = await S.ev(() => window.__SCAN.alive()).catch((e) => ({ err: String(e.message) }));
      out.add('critical', `הרינדור מת באמצע הסריקה (אחרי "${nm}")`, `4 מבטים רצופים שחורים לגמרי. מצב: ${JSON.stringify(al)}. אם lost=true זה איבוד הקשר WebGL (swiftshader/זיכרון) — ממצאי "שחור" לפני כן אינם אמינים מכאן והלאה; אם lost=false הרינדור נכשל בגלל המודל (לבדוק קונסול).`);
      out.stats.abortedAt = nm; out.stats.alive = al;
      break;
    }
    if (st.mean < 14 || st.dark > 0.9) await add('high', `תצוגה שחורה/כהה מדי: ${nm}`, `ממוצע בהירות ${st.mean}, ${Math.round(st.dark * 100)}% פיקסלים כהים. מצלמה ${d.pos}, יעד ${d.tg}.`);
    else if (st.std < 6 || st.top > 0.93) await add('high', `תצוגה ריקה (צבע אחד): ${nm}`, `סטיית תקן ${st.std}, ${Math.round(st.top * 100)}% מהפיקסלים בצבע אחד. מצלמה ${d.pos}, יעד ${d.tg}.`);
    else if (st.centre < 10) await add('medium', `מרכז התצוגה כהה: ${nm}`, `בהירות מרכז ${st.centre} (ממוצע ${st.mean}). יעד ${d.tg}.`);
    if (d.inside.back >= 6) await add('high', `המצלמה בתוך גוש/קיר: ${nm}`, `${d.inside.back} מ־26 כיוונים פוגעים קודם בפן אחורי של ${d.inside.of.join(', ')}. מצלמה ${d.pos}.`);
    else if (d.inside.back >= 3) await add('medium', `המצלמה קרובה מאוד/חותכת גוש: ${nm}`, `${d.inside.back} מ־26 כיוונים פוגעים בפן אחורי של ${d.inside.of.join(', ')}. מצלמה ${d.pos}.`);
    if (!d.inFrustum) await add('high', `יעד המבט מחוץ לפרוסטום: ${nm}`, `NDC ${d.ndc}. יעד ${d.tg}.`);
    if (d.occ) await add('medium', `יעד המבט מוסתר מאחורי "${d.occ.name}": ${nm}`, `הקרן מהמצלמה פוגעת ב־${d.occ.d} מתוך ${d.occ.L} אמות ליעד. מצלמה ${d.pos} → יעד ${d.tg}.`);
    if (d.void > 25) await add('medium', `היעד באוויר ריק (${d.void} אמות מהמשטח הקרוב): ${nm}`, `יעד ${d.tg}.`);
    if (r.arrive != null && r.arrive > 8) await add('low', `המבט לא הגיע ליעד המוגדר (${r.arrive} אמות): ${nm}`, `הצפוי ${it.exp}, בפועל ${d.tg}.`);
    if (errs.length) await add('high', `שגיאת קונסול במעבר ל: ${nm}`, errs.slice(0, 3).map((m) => m.text).join(' | '));
  }
  // return to the general view for whatever runs next
}
