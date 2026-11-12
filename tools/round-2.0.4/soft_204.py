#!/usr/bin/env python3
# TOUR_SOFT_204 (the user, 12.11.2026 02:14: "סגירת כרטיס צף או קיפול במצגת או בכל הדגמה אינה נחשבת פקודה לעניין העצירת המצגת או
# ההדגמה"): the press that closes a floating card (its X), folds or opens it, folds a group of the panel (summary) or the panel
# itself (the burger), and the wheel over a floating card - none of these pauses a presentation or stops a demonstration. Idempotent.
SOFT = '#tm-xcard .x, #tm-card .x, #tm-burger, summary'
for f in ['/home/claude/beit-rishon/src/75-tour.js', '/home/claude/b1/src/75-tour.js']:
    s = open(f, encoding='utf8').read()
    if 'TOUR_SOFT_204' not in s:
        a = '''        if (inside(t, box) || inside(t, btn) || inside(t, menu) || inside(t, cfEl())) return;
        downPtrs.add(e.pointerId);   // tour-6: held while it is down
        userInteract();
'''
        assert s.count(a) == 1, f
        s = s.replace(a, '''        if (inside(t, box) || inside(t, btn) || inside(t, menu) || inside(t, cfEl())) return;
        // TOUR_SOFT_204 (the user, 12.11.2026 02:14: "סגירת כרטיס צף או קיפול במצגת או בכל הדגמה אינה נחשבת פקודה"): closing a floating
        // card, folding it, folding a group of the panel or the panel itself - not the user taking over
        if (t && t.closest && t.closest("%s")) return;
        downPtrs.add(e.pointerId);   // tour-6: held while it is down
        userInteract();
''' % SOFT)
        b = '''        if (inside(t, box) || inside(t, menu) || (U.panel && inside(t, U.panel))) return;
        userInteract();
'''
        assert s.count(b) == 1, f
        s = s.replace(b, '''        if (inside(t, box) || inside(t, menu) || (U.panel && inside(t, U.panel))) return;
        if (t && t.closest && t.closest("#tm-xcard, #tm-card")) return;   // TOUR_SOFT_204: reading a floating card
        userInteract();
''')
        open(f, 'w', encoding='utf8').write(s)
    print('tour', f.split('/')[3], s.count('TOUR_SOFT_204'))
for f in ['/home/claude/beit-rishon/src/90-entry.js', '/home/claude/b2src/src/90-entry.js']:
    s = open(f, encoding='utf8').read()
    if 'TOUR_SOFT_204' not in s:
        a = '''    if (!t || t.closest(".tm-pill, #tm-news, #tm-help, .tm-src, .tm-srcl")) return;
'''
        assert s.count(a) == 1, f
        s = s.replace(a, '''    // TOUR_SOFT_204 (the user, 12.11.2026 02:14): closing a floating card, folding it, folding the panel - no command, the demonstration goes on
    if (!t || t.closest(".tm-pill, #tm-news, #tm-help, .tm-src, .tm-srcl, #tm-xcard .x, #tm-card .x, #tm-burger")) return;
''')
        open(f, 'w', encoding='utf8').write(s)
    print('entry', f.split('/')[3], s.count('TOUR_SOFT_204'))
