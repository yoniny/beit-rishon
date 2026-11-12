#!/usr/bin/env python3
# DEMO_PAUSE_207 (12.11.2026 20:34, the user: "השהיית הדגמה לכמה שניות היא בעייתית? כי נגיד ההדגמה של הפייסות היא 4 דקות. אדם שעצר צריך
# להתחיל מההתחלה. יש סיכוי להשהות, זה אותו דבר בכיסא שלמה שזה ארוך וכולי"; 20:36 "הכל ביחד").
# PART 1 - both houses' 90-entry.js (the same code): THE PAUSE OF A DEMONSTRATION. A demonstration may give its entry of
# ctx.shared.demoStops pause() / resume() / paused() (and restart()). While one runs:
#   - a press on the model (the canvas) PAUSES it instead of ending it (the demonstrations' own press handlers are taken out, in their files):
#     its clock stands, the eye is free - one can turn, come nearer and look;
#   - a small bar over the caption: "השהה" / "המשך" (from the same second), "מההתחלה" (where the demonstration can), "עצור";
#   - a switch (a chip, a place, a button) still ends it, as the user asked in 1.9.2 ("בלחיצה על כל מתג הוא חייב לבטל את ההדגמות");
#     the bar's own buttons are not such a switch.
# While the presentation runs it has its own pause - the bar is not shown and a press is the presentation's.
import sys
FILES = ['/home/claude/beit-rishon/src/90-entry.js', '/home/claude/b2src/src/90-entry.js']
A1 = '''  ctx.shared.stopDemos = (except) => {
    for (const d of ctx.shared.demoStops) {
      if (except && d.id === except) continue;
      try { if (d.running()) d.stop(); } catch (_) {}
    }
  };
'''
B1 = A1 + '''  // DEMO_PAUSE_207 (the user, 12.11.2026 20:34: "יש סיכוי להשהות"): a demonstration may pause - its entry has pause(), resume(), paused()
  // (and restart()). A press on the model pauses it; the bar below resumes it from the same second, starts it again or ends it.
  (function demoPause() {
    const fnc = (f) => typeof f === "function";
    const tourOn = () => { const T = ctx.shared.tour; try { const s = T && fnc(T.state) ? T.state() : null; return !!(s && s.running); } catch (_) { return false; } };
    const live = () => ctx.shared.demoStops.filter((d) => { try { return fnc(d.pause) && d.running(); } catch (_) { return false; } });
    const isPaused = (d) => { try { return fnc(d.paused) && !!d.paused(); } catch (_) { return false; } };
    let el = null, bP = null, bR = null, bS = null, shown = false;
    const press = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); try { fn(); } catch (_) {} paint(); };
    const mk = (txt, title, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = txt;
      b.title = title;
      Object.assign(b.style, { background: "rgba(201,168,76,0.16)", color: "#f4ead0", border: "1px solid rgba(201,168,76,0.55)", borderRadius: "8px",
        padding: "3px 12px", font: "14px/1.4 var(--font-main, inherit)", cursor: "pointer" });
      b.addEventListener("click", press(fn));
      return b;
    };
    const build = () => {
      el = document.createElement("div");
      el.id = "tm-dpause";
      el.setAttribute("dir", "rtl");
      Object.assign(el.style, { position: "fixed", left: "50%", bottom: "118px", transform: "translateX(-50%)", display: "none", gap: "8px",
        background: "rgba(14,17,28,0.82)", padding: "6px 10px", borderRadius: "10px", zIndex: "41", boxShadow: "0 2px 10px rgba(0,0,0,0.35)" });
      bP = mk("⏸ השהה", "השהיית ההדגמה. אפשר להסתובב ולהסתכל, ואחר כך להמשיך מאותו רגע.", () => (live().some((d) => !isPaused(d)) ? ctx.shared.demoPause() : ctx.shared.demoResume()));
      bR = mk("⟲ מההתחלה", "מתחיל את ההדגמה מההתחלה.", () => { for (const d of live()) if (fnc(d.restart)) { d.restart(); return; } });
      bS = mk("■ עצור", "עוצר את ההדגמה.", () => ctx.shared.stopDemos());
      el.appendChild(bP); el.appendChild(bR); el.appendChild(bS);
      document.body.appendChild(el);
    };
    const paint = () => {
      const L = tourOn() ? [] : live();
      const on = L.length > 0;
      if (on && !el) build();
      if (!el) return;
      if (on !== shown) { el.style.display = on ? "flex" : "none"; shown = on; }
      if (!on) return;
      const any = L.some((d) => !isPaused(d));
      const t = any ? "⏸ השהה" : "▶ המשך";
      if (bP.textContent !== t) bP.textContent = t;
      bP.title = any ? "השהיית ההדגמה. אפשר להסתובב ולהסתכל, ואחר כך להמשיך מאותו רגע." : "ממשיך את ההדגמה מהרגע שבו נעצרה.";
      const rs = L.some((d) => fnc(d.restart));
      bR.style.display = rs ? "" : "none";
    };
    ctx.shared.demoPause = () => { const L = live(); for (const d of L) if (!isPaused(d)) { try { d.pause(); } catch (_) {} } paint(); return L.length > 0; };
    ctx.shared.demoResume = () => { for (const d of live()) if (isPaused(d)) { try { d.resume(); } catch (_) {} } paint(); };
    ctx.shared.demoPaused = () => live().some(isPaused);
    setInterval(paint, 300);
    // a press on the model: a running demonstration pauses (the presentation's own press is the presentation's)
    try {
      renderer.domElement.addEventListener("pointerdown", () => {
        if (tourOn()) return;
        if (live().some((d) => !isPaused(d))) ctx.shared.demoPause();
      }, true);
    } catch (_) {}
  })();
'''
A2 = '''    if (!t || t.closest(".tm-pill, #tm-news, #tm-help, .tm-src, .tm-srcl, #tm-xcard .x, #tm-card .x, #tm-burger")) return;'''
B2 = '''    if (!t || t.closest(".tm-pill, #tm-news, #tm-help, .tm-src, .tm-srcl, #tm-xcard .x, #tm-card .x, #tm-burger, #tm-dpause")) return;   // DEMO_PAUSE_207: + the pause bar'''
for f in FILES:
    s = open(f, encoding='utf-8').read()
    if 'DEMO_PAUSE_207' in s:
        print('already:', f); continue
    for a, b in ((A1, B1), (A2, B2)):
        assert s.count(a) == 1, (f, a[:60])
        s = s.replace(a, b)
    open(f, 'w', encoding='utf-8').write(s); print('patched:', f)
