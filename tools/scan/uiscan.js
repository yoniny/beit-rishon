// A layout check of the document it runs in (the house's frame or the shell): clipped / overflowing / cut text, elements out of the frame,
// interactive elements covered by another, doubled buttons. Returns [{ type, el, text, rect, detail }] (deduplicated, at most 60).
(() => {
  const W = window.innerWidth, H = window.innerHeight, out = [], seen = new Set();
  const desc = (e) => (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '') || e.tagName.toLowerCase();
  const txt = (e) => (e.textContent || e.value || e.title || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 50);
  const R = (r) => [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
  const add = (type, e, detail) => { const k = type + '|' + desc(e) + '|' + txt(e); if (seen.has(k) || out.length >= 60) return; seen.add(k); out.push({ type, el: desc(e), text: txt(e), rect: R(e.getBoundingClientRect()), detail }); };
  // The content of a CLOSED <details> is not on the screen, but the browser still gives it a box (the content is skipped in layout, not removed): a button
  // in a closed group is not "covered" and not "out of the frame", the user cannot see it. Only the <summary> of a closed <details> is on the screen.
  const inClosedDetails = (e) => { for (let p = e, ch = null; p && p.nodeType === 1; ch = p, p = p.parentElement) if (p.tagName === 'DETAILS' && !p.open && !(ch && ch.tagName === 'SUMMARY')) return true; return false; };
  const shown = (e) => { for (let p = e; p && p.nodeType === 1; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } if (inClosedDetails(e)) return false; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const all = [...document.body.querySelectorAll('*')].filter((e) => !/^(SCRIPT|STYLE|LINK|META|CANVAS|BR|PATH|SVG|G|CIRCLE|RECT|LINE|POLYGON|USE|DEFS)$/i.test(e.tagName) && !(e instanceof SVGElement && e.tagName !== 'svg') && shown(e));
  const isCtl = (e) => /^(BUTTON|A|INPUT|SELECT|SUMMARY|TEXTAREA)$/.test(e.tagName) || e.getAttribute('role') === 'button' || e.classList.contains('tm-pill');
  const ui = (e) => e.closest('#tm-panel, #tm-xcard, #tm-nav, #tm-compass, #tm-dpause, .tm-pill, #tm-tour-box, #tm-news, #tm-help, #tm-confirm, header, #tm-card, #tm-burger, nav, dialog, .topbar, #shell, .shell, aside, footer') || e.id === 'tm-burger';
  for (const e of all) {
    const cs = getComputedStyle(e), r = e.getBoundingClientRect();
    const inUi = !!ui(e);
    if (!inUi && !isCtl(e)) continue;
    // 1. out of the frame (fixed / absolute roots of the UI; and any control)
    // (an element that takes no clicks and is not a control - such as the compass's rotating square, whose bounding box grows past its round frame when it turns - is
    // not a button the user can lose; the letters inside it are controls and are checked on their own)
    if ((isCtl(e) || (/^(fixed|absolute|sticky)$/.test(cs.position) && cs.pointerEvents !== 'none')) && (r.right > W + 1 || r.left < -1 || r.bottom > H + 1 || r.top < -1)) {
      let inScroll = false; for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p); if (/(auto|scroll)/.test(o.overflowY + o.overflowX) && p.scrollHeight > p.clientHeight) { const pr = p.getBoundingClientRect(); if (r.left >= pr.left - 1 && r.right <= pr.right + 1) inScroll = true; break; } }
      if (!inScroll) add('out-of-frame', e, `הפריט יוצא מהחלון (${W}×${H}): ימין ${Math.round(r.right)}, שמאל ${Math.round(r.left)}, למטה ${Math.round(r.bottom)}, למעלה ${Math.round(r.top)}`);
    }
    // 2. clipped / overflowing content
    const ox = cs.overflowX, oy = cs.overflowY;
    if (/(hidden|clip)/.test(ox) && e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0 && (e.children.length || e.textContent.trim())) add('clipped-x', e, `תוכן נחתך לרוחב: scrollWidth ${e.scrollWidth} > clientWidth ${e.clientWidth}`);
    if (/(hidden|clip)/.test(oy) && e.scrollHeight > e.clientHeight + 3 && e.clientHeight > 0 && e.textContent.trim() && !/(HTML|BODY)/.test(e.tagName)) add('clipped-y', e, `תוכן נחתך לגובה: scrollHeight ${e.scrollHeight} > clientHeight ${e.clientHeight}`);
    if (cs.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) add('text-ellipsis', e, `טקסט נחתך בשלוש נקודות (${e.scrollWidth} > ${e.clientWidth})`);
    if (/(auto|scroll)/.test(ox) && e.scrollWidth > e.clientWidth + 2 && !/^(PRE|CODE)$/.test(e.tagName) && inUi && e.id !== 'tm-panel') add('h-scroll', e, `גלילה אופקית בתוך הרכיב (${e.scrollWidth} > ${e.clientWidth})`);
    // a control's own text wider than the control
    if (isCtl(e) && e.tagName !== 'INPUT' && e.tagName !== 'SELECT' && e.scrollWidth > e.clientWidth + 2 && !/(auto|scroll)/.test(ox)) add('control-overflow', e, `הטקסט רחב מהכפתור (${e.scrollWidth} > ${e.clientWidth})`);
    // children sticking out of a fixed-width UI container horizontally
    if (inUi && isCtl(e)) {
      const par = e.closest('#tm-panel, #tm-xcard, #tm-nav, #tm-dpause, #tm-tour-box'); if (par && par !== e) { const pr = par.getBoundingClientRect(); if (r.right > pr.right + 2 || r.left < pr.left - 2) { let sc = false; for (let p = e.parentElement; p && p !== par; p = p.parentElement) if (/(auto|scroll)/.test(getComputedStyle(p).overflowX)) sc = true; if (!sc) add('sticks-out', e, `יוצא מהמכל ${desc(par)} (${Math.round(pr.left)}–${Math.round(pr.right)}) ל־${Math.round(r.left)}–${Math.round(r.right)}`); } }
    }
  }
  // 3. interactive elements covered by another one (a button over a button)
  const ctls = all.filter((e) => isCtl(e) && e.tagName !== 'INPUT' || (e.tagName === 'INPUT' && e.type === 'checkbox'));
  for (const e of ctls) {
    const r = e.getBoundingClientRect(); if (r.width < 6 || r.height < 6 || r.right < 0 || r.bottom < 0 || r.left > W || r.top > H) continue;
    let sc = false; for (let p = e.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p); if (/(auto|scroll)/.test(o.overflowY) && p.scrollHeight > p.clientHeight) { const pr = p.getBoundingClientRect(); if (r.top < pr.top || r.bottom > pr.bottom) sc = true; break; } }
    if (sc) continue;
    const pts = [[0.25, 0.5], [0.5, 0.5], [0.75, 0.5]];
    let covered = 0, by = null;
    for (const [fx, fy] of pts) {
      const x = r.left + r.width * fx, y = r.top + r.height * fy; if (x < 0 || y < 0 || x > W || y > H) continue;
      const top = document.elementFromPoint(x, y); if (!top || top === e || e.contains(top) || top.contains(e)) continue;
      const lab = e.closest('label'); if (lab && (lab === top || lab.contains(top))) continue;
      const tc = top.closest('button, a, summary, input, select, .tm-pill, [role=button]');
      if (tc && tc !== e && !tc.contains(e) && !e.contains(tc)) { covered++; by = tc; }
    }
    if (covered >= 2) add('covered', e, `הכפתור מכוסה בחלקו על ידי "${txt(by)}" (${desc(by)})`);
  }
  // 4. doubled buttons: the same label twice in the same row / container, both visible
  const by = new Map();
  for (const e of ctls) { const t = txt(e); if (!t || t.length < 2 || e.tagName === 'INPUT') continue; const k = (e.parentElement ? desc(e.parentElement) : '') + '|' + t; (by.get(k) || by.set(k, []).get(k)).push(e); }
  for (const [k, L] of by) if (L.length > 1) { const rs = L.map((e) => e.getBoundingClientRect()); add('duplicate-button', L[1], `${L.length} כפתורים זהים ("${txt(L[0])}") באותו מכל ${k.split('|')[0]}`); }
  return out;
})()
