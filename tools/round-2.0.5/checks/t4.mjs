// the checks of the round of 11-12.11.2026 (2.0.4 = B1 1.3.7 + B2 1.9.5): node t4.mjs <plugin dir> <rishon|sheni>
//  sheni:  the lotteries' demonstration (off by default; starts, runs in both readings, stops, and gives everything back), the row of
//          the first lottery drives its reading, the row of the menorah and the table turns them (three readings), the new rows exist
//  rishon: the gatekeepers' switch (21 figures), the new rows (the devir's height in three readings, the east steps, the lesser
//          courts' place, the yesod in the south), the Gazit hall's bronze strip, the merged places have no button of their own
import { open } from './h.mjs';
const [,, dir, house] = process.argv;
const res = []; const ok = (name, cond, info) => { res.push(!!cond); console.log((cond ? 'OK   ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 320) : '')); };
const P = await open(dir); const pg = P.page;
const pick = (cap, key) => pg.evaluate(([cap, key]) => { const c = window.__ctx; const r = c.ui.opinions.find((r) => r.cap.indexOf(cap) === 0); if (!r) return 'no row'; r.onPick(key); if (r.mark) r.mark(key); return key; }, [cap, key]);
const caps = await pg.evaluate(() => window.__ctx.ui.opinions.map((r) => r.cap));
if (house === 'sheni') {
  ok('the opinions table has 40 rows', caps.length === 40, caps.length);
  for (const c of ['הפייס הראשון — היכן ומתי', 'כיוון המנורה והשולחן', 'שושן הבירה ושתי האמות', 'חמש עשרה המעלות — צורתן', 'מקום שתי הסנהדראות הקטנות'])
    ok('the row "' + c + '" is there', caps.includes(c));
  const state = () => pg.evaluate(() => { const c = window.__ctx, P = c.shared.payis; const g = c.scene.getObjectByName('payisDemo'), lg = c.scene.getObjectByName('labels'); const cap = document.getElementById('tm-payis-cap');
    const rb = c.shared.modelButtons.find((b) => b.id === 'crt-lishkot-roofs'); const others = c.shared.modelButtons.filter((b) => b.id !== 'crt-payis-demo' && Object.getOwnPropertyDescriptor(b, 'anchor') && 'value' in Object.getOwnPropertyDescriptor(b, 'anchor'));
    return { has: !!P, on: !!(P && P.on), reading: P && P.reading, group: g ? g.visible : null, labels: lg ? lg.visible : null, env: !!c.scene.environment, fov: c.camera.fov, roofs: rb ? !!rb.get() : null,
      cap: cap ? getComputedStyle(cap).display : 'none', capTxt: cap && cap.lastChild ? cap.lastChild.textContent : '', nullAnchors: others.filter((b) => b.anchor === null).length, others: others.length }; });
  let s = await state();
  ok('the lotteries\' demonstration is off by default: nothing of it is drawn', s.has && !s.on && s.group === false && s.cap === 'none' && s.env && s.labels === true, s);
  const fov0 = s.fov, roofs0 = s.roofs;
  await pg.evaluate(() => window.__ctx.shared.payis.start()); await pg.waitForTimeout(1500);
  s = await state();
  ok('it starts: night (no environment light), the labels and the other on-model buttons hidden, its stop button shown', s.on && s.group === true && !s.env && s.labels === false && s.cap === 'flex' && s.others > 3 && s.nullAnchors === s.others, s);
  const tl = await pg.evaluate(() => { const P = window.__ctx.shared.payis; P.setReading('rambam'); const a = P.timeline(); P.setReading('tamid'); const b = P.timeline(); P.setReading('rambam'); return { a: [a.dur, a.caps.length, a.caps[0][1]], b: [b.dur, b.caps.length, b.caps[0][1]],
    lot: [a, b].map((x) => x.caps.filter((c) => /הפייס (הראשון|השני|השלישי|הרביעי)/.test(c[1])).length), barkai: [a, b].map((x) => x.caps.some((c) => c[1].indexOf('ברקאי') >= 0)) }; });
  ok('both readings are whole: the Rambam\'s and the Mishnah\'s order, each with its lotteries and "ברקאי"', tl.a[0] > 180 && tl.b[0] > tl.a[0] && tl.a[2].indexOf('רמב״ם') === 0 && tl.b[2].indexOf('דופק עליהם') > 0 && tl.barkai.every(Boolean) && tl.lot.every((n) => n >= 3), tl);
  s = await state();
  ok('a change of the reading stops it and gives the day back', !s.on && s.env && s.labels === true && s.fov === fov0 && s.roofs === roofs0 && s.nullAnchors === 0 && s.cap === 'none', s);
  const when = await pg.evaluate(() => { const P = window.__ctx.shared.payis; const tl = P.timeline(); const at = (w) => { const c = tl.caps.find((c) => c[1].indexOf(w) >= 0); return c ? c[0] + 1 : -1; }; return { count: at('כאן: שישים') + 4, barkai: at('ברקאי'), third: at('הפייס השלישי') }; });
  for (const [t, want, day] of [[when.count, 'מונה והולך', false], [when.barkai, 'ברקאי', false], [when.third, 'הפייס השלישי', true]]) {
    await pg.evaluate((t) => window.__ctx.shared.payis.at(t), t); await pg.waitForTimeout(400);
    s = await state(); ok('at second ' + Math.round(t) + ' the caption speaks of "' + want + '"' + (day ? ', by day' : ', by night'), t > 0 && s.on && s.capTxt.indexOf(want) >= 0 && s.env === day, { capTxt: s.capTxt.slice(0, 70), env: s.env });
  }
  const gates = await pg.evaluate(() => { const c = window.__ctx, P = c.shared.payis; const all = []; c.scene.traverse((o) => { if (o.userData && o.userData.tmDoors && o.children.length >= 2) all.push(o); });
    const shut = () => all.filter((o) => Math.abs(o.children[0].rotation.y) < 1e-6 && Math.abs(o.children[1].rotation.y - Math.PI) < 1e-6).length; const day0 = shut(); P.at(20); const night = shut(); P.stop(); return { n: all.length, day0, night, back: shut() }; });
  ok('by night every gate of the model is shut but the one opened for the appointed one; when it stops they are as they were', gates.n > 10 && gates.night >= gates.n - 1 && gates.night > gates.day0 && gates.back === gates.day0, gates);
  await pg.evaluate(() => window.__ctx.shared.payis.seek(1e4)); await pg.waitForTimeout(1800);
  s = await state();
  ok('at its end everything is back: the day, the labels, the roofs, the buttons, the lens', !s.on && s.group === false && s.env && s.labels === true && s.fov === fov0 && s.roofs === roofs0 && s.nullAnchors === 0 && s.cap === 'none', s);
  await pick('הפייס הראשון', 'o1'); s = await state(); const r1 = s.reading; await pick('הפייס הראשון', 'o0'); s = await state();
  ok('the row "הפייס הראשון" sets the demonstration\'s reading', r1 === 'tamid' && s.reading === 'rambam', [r1, s.reading]);
  const dirs = [];
  for (const k of ['o0', 'o1', 'o2', 'o0']) { await pick('כיוון המנורה והשולחן', k); dirs.push(await pg.evaluate(() => { const S = window.__ctx.shared; return S.menorahDir.current + '/' + S.tableDir.current; })); }
  ok('the row of the menorah and the table: the Rambam ns/ew, Rabbi ew/ew, R. Elazar b. R. Shimon ns/ns', dirs.join(' ') === 'ns/ew ew/ew ns/ns ns/ew', dirs);
  const pl = await pg.evaluate(() => { const c = window.__ctx; const p = (c.ui.places() || []).find((p) => p.title.indexOf('ארבעת הפייסות') === 0); const btn = [...document.querySelectorAll('#tm-panel details.tm-pl button')].some((b) => b.textContent.indexOf('ארבעת הפייסות') === 0);
    return p ? { noTour: !!(p.item && p.item.noTour), act: typeof (p.item && p.item.action), cam: !!(p.item && (p.item.cam || p.item.view)), btn } : null; });
  ok('the demonstration\'s place is in the panel, starts it, and is no slide of the presentations', !!pl && pl.noTour && pl.act === 'function' && !pl.cam && pl.btn, pl);
  // 12.11: the priests' garments - the place, the row of the avnet, the display of three priests, the other reading in the demonstration
  ok('the row "אבנטו של כהן הדיוט" is there', caps.includes('אבנטו של כהן הדיוט'));
  const gp = await pg.evaluate(() => { const c = window.__ctx; const p = (c.ui.places() || []).find((p) => p.title === 'בגדי הכהנים'); return p ? { act: typeof (p.item && p.item.action), cam: !!(p.item && (p.item.cam || p.item.view)), noTour: !!(p.item && p.item.noTour) } : null; });
  ok('the place "בגדי הכהנים" is there, with a camera and an action, and is a slide of the presentations', !!gp && gp.act === 'function' && gp.cam && !gp.noTour, gp);
  const gar = await pg.evaluate(async () => { const c = window.__ctx, P = c.shared.payis, g = c.scene.getObjectByName('payisDemo'); const vis = () => g.visible ? g.children.filter((o) => o.visible && o.userData && o.userData.hat).length : 0; const a = [P.garmentsOn, vis()]; P.garments(700); a.push(P.garmentsOn, vis()); await new Promise((r) => setTimeout(r, 1100)); a.push(P.garmentsOn, vis()); return a; });
  ok('the garments\' display: three priests for its time, then nothing', !!gar && gar.join() === 'false,0,true,3,false,0', gar);
  await pick('אבנטו של כהן הדיוט', 'o1'); const av1 = await pg.evaluate(() => [window.__ctx.shared.payis.avnet, window.__ctx.shared.payis.garmentsOn]);
  await pick('אבנטו של כהן הדיוט', 'o0'); const av0 = await pg.evaluate(() => { const S = window.__ctx.shared, a = [S.payis.avnet, S.payis.garmentsOn]; if (S.stopDemos) S.stopDemos(); a.push(S.payis.garmentsOn); return a; });
  ok('the row of the avnet: "של בוץ", back to the Rambam, the three priests shown, and a stop clears them', av1.join() === 'butz,true' && av0.join() === 'rambam,true,false', [av1, av0]);
  const capsBoth = await pg.evaluate(() => { const P = window.__ctx.shared.payis; const t = (m) => { P.setAvnet(m); return P.timeline().caps.map((c) => c[1]).filter((x) => x.indexOf('של בוץ') >= 0 && x.indexOf('של כלאים') >= 0 || x.indexOf('ובחזרה') === 0).length; }; const a = [t('rambam'), t('butz')]; P.setAvnet('rambam'); return a; });
  ok('in the demonstration the other reading of the avnet passes and goes back (in both settings)', capsBoth[0] === 2 && capsBoth[1] === 2, capsBoth);
}
if (house === 'rishon') {
  const ids = await pg.evaluate(() => window.__ctx.ui.opinions.map((r) => [r.id, (r.options || []).length]));
  for (const [id, n] of [['devirHeight', 3], ['eastSteps', 2], ['lesserPlace', 2], ['altarRTam', 2]]) { const r = ids.find((x) => x[0] === id); ok('the row "' + id + '" is there, with ' + n + ' readings', !!r && r[1] === n, r); }
  const gk = await pg.evaluate(() => { const c = window.__ctx, G = c.shared.gatekeepers; if (!G) return null; const L = c.layers && c.layers.gatekeepers; const a = [G.on, L ? L.visible : null]; G.set(true); a.push(G.on, L ? L.visible : null, G.count); G.set(false); a.push(G.on, L ? L.visible : null); return a; });
  ok('the gatekeepers\' switch: off by default, 21 figures when on, off again', !!gk && gk.join() === 'false,false,true,true,21,false,false', gk);
  const dh = await pg.evaluate(() => { const D = window.__ctx.shared.devirHeight; if (!D) return null; const a = []; for (const k of ['tosafot', 'radak', 'rashi']) { D.set(k); a.push(D.mode); } return a; });
  ok('the devir\'s height takes its three readings', !!dh && dh.join() === 'tosafot,radak,rashi', dh);
  const gz = await pg.evaluate(() => { const c = window.__ctx; return { strip: !!c.scene.getObjectByName('gazitHalvesLine'), lots: typeof c.shared.lots }; });
  ok('the Gazit hall: the bronze strip between its halves is drawn, and no ring of a lottery', gz.strip && gz.lots === 'undefined', gz);
  const btns = await pg.evaluate(() => [...document.querySelectorAll('#tm-panel details.tm-pl button')].map((b) => (b.title || b.textContent).trim()));
  ok('the merged places have no button of their own', !btns.some((t) => t.indexOf('שכבות מזבח הזהב') === 0 || t.indexOf('העמודים והעב') === 0) && btns.some((t) => t.indexOf('משמרות השוערים') === 0), btns.length);
}
// ---- 2.0.4, both houses: PEOPLE_KIT_204 (the Sanhedrin's figures), TOUR_SOFT_204 (closing or folding a card is no command)
{
  const ppl = await pg.evaluate(() => { const c = window.__ctx; let n = 0, m = 0; c.scene.traverse((o) => { if (o.isInstancedMesh && o.material && o.material.color && o.material.color.getHex() === 0x2f2f36) { n += o.count; m++; } }); return { kit: !!c.__tmPeople, n, m }; });
  ok('the Sanhedrin\'s figures: the kit is in, 700 robed figures (the great court 211, each of three lesser chambers 163) - since 2.0.5 in two drawn levels of the robe, 1400 instances', ppl.kit && ppl.n === 1400, ppl);
  const soft = await pg.evaluate(async () => {
    const c = window.__ctx, S = c.shared, W = S.walk, wait = (ms) => new Promise((r) => setTimeout(r, ms)), out = {};
    const x = document.querySelector('#tm-xcard .x'), start = S.mesibahDemo || S.lulimDemo;
    if (!x || !W || !start) return { x: !!x, W: !!W, start: !!start };
    start(); await wait(900); out.on0 = W.on;
    x.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); await wait(150); out.afterX = W.on;                    // the card's X: the walk goes on
    const sm = document.querySelector('#tm-panel summary'); if (sm) { sm.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); await wait(150); sm.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }
    out.afterFold = W.on;
    const b = [...document.querySelectorAll('#tm-panel details.tm-pl button')].find((e) => e.textContent.trim().length > 2); if (b) b.click(); await wait(200); out.afterPlace = W.on;   // a place: a command, the walk stops
    if (S.stopDemos) S.stopDemos();
    const T = S.tour; T.start('topics', { speed: 1 }); await wait(1200); const st = () => { const q = typeof T.state === 'function' ? T.state() : T.state; return q && q.running ? !!q.paused : null; };
    out.t0 = st();
    x.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 41 })); x.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 41 })); await wait(150); out.tX = st();   // the card's X: no pause
    const cv = c.renderer.domElement; cv.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 42 })); cv.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 42 })); await wait(150); out.tModel = st();   // the model: the user takes over
    T.stop(); await wait(300);
    return out;
  });
  ok('closing a floating card or folding does not stop a demonstration; a place does', soft.on0 === true && soft.afterX === true && soft.afterFold === true && soft.afterPlace === false, soft);
  ok('closing a floating card does not pause a presentation; a press on the model does', soft.t0 === false && soft.tX === false && soft.tModel === true, soft);
}
console.log('errs', JSON.stringify(P.errs.slice(0, 4)));
ok('no errors in the console', P.errs.length === 0, P.errs.slice(0, 2));
await P.close();
console.log(res.every(Boolean) ? 'ALL PASS (' + res.length + ')' : 'FAILED ' + res.filter((x) => !x).length + ' of ' + res.length);
process.exit(res.every(Boolean) ? 0 : 1);
