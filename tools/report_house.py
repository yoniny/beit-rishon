# -*- coding: utf-8 -*-
# 1.3.4 / 1.9.2 (the user, 10.11.2026 15:48: "בדיווח צריך להוסיף על איזה בית אתה מדווח: 1. בית ראשון 2. בית שני 3. שני בתי המקדש. וללא
# אפשרות דיווח כלשהו בלי סימון א' מן התוויות"): the report form asks which house - none marked at first - and sends nothing without it.
# patch(text) -> text; used on Beit Rishon's src/70-ui.js directly and by Beit Sheni's tools/port_ui.py (on its First Temple snapshot).
def patch(s):
    def rep(a, b):
        nonlocal s
        n = s.count(a)
        assert n == 1, (n, a[:80])
        s = s.replace(a, b)
    if 'const HOUSES = [["b1", "בית ראשון"]' in s:
        return s
    rep('''        tyBtns[0].classList.add("on");
''', '''        tyBtns[0].classList.add("on");
        // which house the report is about - required, none marked at first (the user: "וללא אפשרות דיווח כלשהו בלי סימון")
        const HOUSES = [["b1", "בית ראשון"], ["b2", "בית שני"], ["both", "שני בתי המקדש"]];
        const hq = document.createElement("div");
        hq.className = "n";
        hq.textContent = "על איזה בית הדיווח? (חובה)";
        const hs = document.createElement("div");
        hs.className = "ty";
        hs.setAttribute("role", "radiogroup");
        hs.setAttribute("aria-label", "על איזה בית הדיווח");
        let house = null;
        const hBtns = HOUSES.map(([k, label]) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = label;
          b.setAttribute("role", "radio");
          b.setAttribute("aria-checked", "false");
          b.addEventListener("click", () => {
            house = k;
            for (const o of hBtns) { o.classList.toggle("on", o === b); o.setAttribute("aria-checked", o === b ? "true" : "false"); }
          });
          hs.appendChild(b);
          return b;
        });
        const clearHouse = () => { house = null; for (const o of hBtns) { o.classList.remove("on"); o.setAttribute("aria-checked", "false"); } };
''')
    rep('''        box.appendChild(hd);
        box.appendChild(ty);
''', '''        box.appendChild(hd);
        box.appendChild(hq);
        box.appendChild(hs);
        box.appendChild(ty);
''')
    rep('''          const text = ta.value.trim();
          if (!text) {''', '''          const text = ta.value.trim();
          if (!house) {
            tmToast("סמנו על איזה בית הדיווח");
            try { hBtns[0].focus(); } catch (_) {}
            return;
          }
          if (!text) {''')
    rep('''          const details = (text + "\\n\\n---\\n" + context()).slice(0, 5000);''',
        '''          const hName = (HOUSES.find((h) => h[0] === house) || [null, ""])[1];
          const details = ("הבית: " + hName + "\\n\\n" + text + "\\n\\n---\\n" + context()).slice(0, 5000);''')
    rep('''            ta.value = "";
            closeDlg();''', '''            ta.value = "";
            clearHouse();
            closeDlg();''')
    return s

if __name__ == '__main__':
    import sys
    p = sys.argv[1]
    t = open(p, encoding='utf-8').read()
    open(p, 'w', encoding='utf-8').write(patch(t))
    print('report_house: ok', p)
