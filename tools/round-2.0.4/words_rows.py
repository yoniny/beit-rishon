# -*- coding: utf-8 -*-
# 2.0.4 - THE SEARCH IN THE WORDS OF THE SOURCES FINDS THE ROWS OF THE OPINIONS TABLE TOO (the open point of 2.0.2 / 2.0.3 "opinion rows
# are not search targets (places / views only)"; the user, 11.11.2026 17:10: "ד. בודאי"). The template of both houses' 72-words.js:
# tools196/words_module.js; then tools196/gen_words.py writes the two modules. Idempotent by the marker "t.o".
import io
P = '/home/claude/tools196/words_module.js'
s = io.open(P, encoding='utf-8').read()


def rep(old, new, name):
    global s
    k = s.count(old)
    if k != 1:
        raise SystemExit('PATCH %s: %d matches' % (name, k))
    s = s.replace(old, new)


if 't.o' in s:
    print('words_module.js: already patched')
else:
    rep('''    const btnOf = (t) => (t && t.p ? UI.placeButton(t.p) : t && t.v ? UI.viewButton(t.v) : null) || null;
    const nameOf = (t) => {
      if (t && t.p) return ui_stripSrc(t.p);
''', '''    // 2.0.4 (the user: "בודאי"): a row of the opinions table is a target too - { o: row }. Its button is the one of the reading that is
    // chosen now, so going there opens the row's card and its view and changes nothing in the model.
    const rowBtn = (r) => (r && r.box ? r.box.querySelector("button.on") || r.box.querySelector("button") : null);
    const btnOf = (t) => (t && t.o ? rowBtn(t.o) : t && t.p ? UI.placeButton(t.p) : t && t.v ? UI.viewButton(t.v) : null) || null;
    const nameOf = (t) => {
      if (t && t.o) return "שיטות: " + ui_stripSrc(t.o.cap || "");
      if (t && t.p) return ui_stripSrc(t.p);
''', 'btnOf')
    rep('''      try { for (const v of UI.views || []) if (v && v.key) add((UI.refs || {})[v.key], { v: v.key }); } catch (_) {}
      return CITE;
''', '''      try { for (const v of UI.views || []) if (v && v.key) add((UI.refs || {})[v.key], { v: v.key }); } catch (_) {}
      // 2.0.4: the rows of the opinions table, by their own sources and by those of each of their readings (after the places)
      try {
        for (const r of UI.opinions || []) {
          if (!r || !r.box || r.disabled) continue;
          const t = { o: r };
          add(r.refs, t);
          for (const op of r.options || []) add(op && op[3], t);
        }
      } catch (_) {}
      return CITE;
''', 'cites')
    rep('''    const go = (t, label) => {
      if (!RD.press(t)) return false;
''', '''    const go = (t, label) => {
      if (t && t.o) {   // 2.0.4: a row of the opinions table - its chosen reading's own button (RD.press(null) stops a running presentation first)
        const b = btnOf(t);
        if (!b) return false;
        try { RD.press(null); } catch (_) {}
        b.click();
        if (label) RD.toast(label + " — " + nameOf(t));
        return true;
      }
      if (!RD.press(t)) return false;
''', 'go')
    rep('''          b.textContent = nameOf(t);
          b.title = "מעבר אל המקום במודל";
''', '''          b.textContent = nameOf(t);
          b.title = t && t.o ? "פתיחת השורה שבטבלת השיטות — הכרטיס והמבט; המודל אינו משתנה" : "מעבר אל המקום במודל";
          if (t && t.o) b.className = "op";
''', 'chip')
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('words_module.js: patched')
