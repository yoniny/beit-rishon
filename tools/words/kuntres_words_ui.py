#!/usr/bin/env python3
# kuntres_words_ui.py — the hooks of 72-words.js in the UI module, the SAME patch in both files: beit-rishon/src/70-ui.js (B1) and
# b1/src/70-ui.js (the snapshot B2's UI is ported from). Idempotent.
#  A. ui_readingOf: the book's button clicked in ANOTHER book (the manifest now shows it in the books with the most links) ->
#     { other: { id, title, index } } instead of null.
#  B. the reading block: goReading hands such a position to ctx.ui.reading.linked (72-words.js); ctx.ui.reading also exports
#     press (a target's own button, the presentation stopped first), toast and open; buildWords(ctx) is called there.
#  C. "מה חדש": **...** in a line is bold (the user: "הדגש דברים עיקריים במה חדש"); the list is a little wider.
import sys
FILES = ['/home/claude/beit-rishon/src/70-ui.js', '/home/claude/b1/src/70-ui.js']

A_OLD = '''    if (!book) return null;
    const ix = [d.currentIndex, d.index, d.lineIndex].map((x) => (typeof x === "string" && /^\\d+$/.test(x) ? +x : x)).find((x) => typeof x === "number" && isFinite(x));'''
A_NEW = '''    const ix = [d.currentIndex, d.index, d.lineIndex].map((x) => (typeof x === "string" && /^\\d+$/.test(x) ? +x : x)).find((x) => typeof x === "number" && isFinite(x));
    if (!book) {
      // 2.0.2: the button clicked in ANOTHER book (the manifest shows it in the books that have the most links to this house's sources):
      // the book and the line go to 72-words.js, which asks for the links of that line (ctx.ui.reading.linked)
      if (d.itemId !== UI_BOOK_ITEM) return null;
      const num = (x) => (typeof x === "number" && isFinite(x) ? x : typeof x === "string" && /^\\d+$/.test(x) ? +x : null);
      const uid = /^id:(\\d+)$/.exec(String(d.currentBookUid || d.bookUid || ""));
      let oid = uid ? +uid[1] : null;
      for (const k of ["currentId", "id"]) if (oid == null) oid = num(d[k]);
      let title = "";
      for (const k of ["currentBook", "currentBookId", "bookId", "title"]) if (!title && typeof d[k] === "string" && d[k] && !/^(?:id:)?\\d+$/.test(d[k])) title = d[k];
      if (oid == null && !title) return null;
      return { other: { id: oid, title, index: ix == null ? null : ix } };
    }'''

B1_OLD = '''        const goReading = (r) => {
          const k = r.book + ":" + r.ch + ":" + r.v, now = performance.now();'''
B1_NEW = '''        // 2.0.2: a target's own button, as a click on it (the presentation stops first) - for the reading below and for 72-words.js
        const pressTarget = (t) => {
          try {
            const T = ctx.shared.tour;
            if (T && typeof T.state === "function" && T.state().running && typeof T.stop === "function") T.stop();
          } catch (_) {
          }
          cancelConfirm();
          const b = (t && t.p ? placeBtnByT[t.p] : t && t.v ? viewBtnByKey[t.v] : null) || null;
          if (b) b.click();
          return !!b;
        };
        const goReading = (r) => {
          if (r && r.other) {   // 2.0.2: another book's line: by its links (72-words.js)
            const L = ctx.ui.reading && ctx.ui.reading.linked;
            if (typeof L === "function") Promise.resolve(L(r.other)).catch((e) => console.warn("[ui.js] links: " + ((e && e.message) || e)));
            return;
          }
          const k = r.book + ":" + r.ch + ":" + r.v, now = performance.now();'''

B2_OLD = '''        ctx.ui.reading = { go: (d) => ui_bookEvent(d), target: (book, ch, v) => readTarget({ book, ch, v }), lineToVerse: ui_lineToVerse };   // for the checks
      }'''
B2_NEW = '''        ctx.ui.reading = { go: (d) => ui_bookEvent(d), target: (book, ch, v) => readTarget({ book, ch, v }), lineToVerse: ui_lineToVerse,
          press: pressTarget, toast: tmToast, open: openSource, linked: null };   // 2.0.2: press / toast / open / linked - for 72-words.js
      }
      // 2.0.2: the search in the words of the sources (a section at the end of the panel) and the links of the books' button - 72-words.js
      if (typeof buildWords === "function") {
        try { await buildWords(ctx); } catch (e) { console.error("[words.js]", e); }
      }'''

C_OLD = '''              li.textContent = s2;   // (plain: a small bracket in a short list only looked broken)'''
C_NEW = '''              ui_newsFill(li, s2);   // 2.0.2: plain text, and **...** in bold (the main things)'''
C2_OLD = '''  function ui_stripSrc(text) {'''
C2_NEW = '''  // 2.0.2 (the user: "הדגש דברים עיקריים במה חדש"): a line of "מה חדש" - plain text, and what stands between ** and ** in bold
  function ui_newsFill(el, text) {
    el.textContent = "";
    String(text == null ? "" : text).split("**").forEach((t, i) => {
      if (!t) return;
      if (i % 2) {
        const b = document.createElement("b");
        b.textContent = t;
        el.appendChild(b);
      } else el.appendChild(document.createTextNode(t));
    });
  }
  function ui_stripSrc(text) {'''
D_OLD = '''#tm-news li{margin:2px 0}'''
D_NEW = '''#tm-news li{margin:3px 0}
#tm-news li b{color:#f3dc9a;font-weight:700}'''
D2_OLD = '''#tm-help .box{width:min(400px,92vw)}'''
D2_NEW = '''#tm-help .box{width:min(400px,92vw)}
#tm-news .box{width:min(430px,92vw)}'''

PAIRS = [('A', A_OLD, A_NEW, 'if (d.itemId !== UI_BOOK_ITEM) return null;'), ('B1', B1_OLD, B1_NEW, 'const pressTarget = (t) => {'),
         ('B2', B2_OLD, B2_NEW, 'press: pressTarget, toast: tmToast'), ('C', C_OLD, C_NEW, 'ui_newsFill(li, s2);'),
         ('C2', C2_OLD, C2_NEW, 'function ui_newsFill(el, text) {'), ('D', D_OLD, D_NEW, '#tm-news li b{'), ('D2', D2_OLD, D2_NEW, '#tm-news .box{width:min(430px')]
for f in FILES:
    s = open(f, encoding='utf-8').read()
    done = []
    for name, old, new, mark in PAIRS:
        if mark in s:
            done.append(name + '=')
            continue
        n = s.count(old)
        assert n == 1, (f, name, n)
        s = s.replace(old, new)
        done.append(name)
    open(f, 'w', encoding='utf-8').write(s)
    print(f.replace('/home/claude/', ''), ' '.join(done))
