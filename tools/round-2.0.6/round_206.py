#!/usr/bin/env python3
# 12.11.2026 16:00-17:00: the round after 2.0.5 (B1 1.3.9, B2 1.9.7, the unified plugin 2.0.6) - the versions, the "מה חדש" lists, the
# maintainers' notes and docs/תיאור העדכון 2.0.6.txt. Idempotent (every step by its own text).
import json
J = lambda x: json.dumps(x, ensure_ascii=False)
B1_NEWS = [
    "**המצגת — הדגמות** — שקופית שיש בה הדגמה נמשכת עד סוף ההדגמה. ״המכונה בפעולה״, שנקטעה עד כה אחרי עשר שניות, מוצגת עכשיו סיבוב שלם. אחרי כל הדגמה — שתי שניות של מנוחה לפני השקופית הבאה.",
]
B2_NEWS = [
    "**המצגת — הדגמות** — שקופית שיש בה הדגמה נמשכת עד סוף ההדגמה. כך גם שקופיות השיטות של הפשפשים, של דלתות רבי יהודה ושל האבנט, שנקטעו עד כה אחרי עשר שניות. אחרי כל הדגמה — שתי שניות של מנוחה, והמבטים הנוספים של השקופית באים אחריה.",
    "**שער שושן ושער ניקנור** — נפתח הכרטיס המלא: לשון המשנה, ברטנורא, תוספות יום טוב ותפארת ישראל. בשער שושן — גם כותל המזרח הנמוך והכבש להר המשחה.",
]
NOTE = 'במצגת — כל שקופית שיש בה הדגמה נמשכת עד סוף ההדגמה; שער שושן ושער ניקנור פותחים את הכרטיס המלא, עם דברי המפרשים.'
assert len(NOTE) <= 150, len(NOTE)
N1 = r'''**1.3.9 (12.11.2026 16:00; המשתמש: ״כל מקום שיש הדגמה חייב להיות ארוך עד סוף ההדגמה״; `/home/claude/tools206/tour_demo_206.py`):**
  - **נמדד קודם, בזמן אמת** (`/home/claude/qa/fs/demoprobe.mjs <plugin> list all topics,verses` ו־`run <mode> <i,…>`): הדגמה של *מקום* (`rt.act`) החזיקה את השקופית כבר מ־1.3.5 (הלולים 36.8 שניות, דלתות ההיכל 15.1). נקטעה אחרי עשר שניות: הדגמה ש*תכונה* של השקופית מפעילה — ״המכונה בפעולה״ (נושאים 31, פסוקים 33).
  - **`TOUR_DEMO_HOLD_206`** (`75-tour.js`, בשני העותקים — כאן וב־`/home/claude/b1/src/75-tour.js`): `demoHolds(rt)` — כל הדגמה שרצה מחזיקה את השקופית (עד שתי דקות נוספות, כמקודם); בזמן שהיא רצה אין סיבוב (`orbitStep`) והמבטים הנוספים (`then`) מחכים; כשהיא מסתיימת — 3 שניות לכל מבט שנותר (`rt.thenAbs`), ובלי מבטים — 2 שניות מנוחה. שקופית עם ציר זמן משלה (`rt.anim`: שלוש שקופיות הכסא) אינה מוחזקת.
  - **הדגמה שחוזרת בלולאה**: רשומת ה־`demoStops` שלה נותנת `roundLeft()` (שניות עד סוף הסיבוב), והשקופית מחזיקה סיבוב אחד מרגע שראתה אותה רצה. כאן: המכונה (`45-vessels.js`; סיבוב 48.6 שניות; במצגת הרציפה היא מתחילה שתי שניות לפני ההדחה, ולכן השקופית קצרה יותר).
  - **בדיקה**: `/home/claude/qa/fs/t6.mjs <plugin> rishon` (בזמן אמת, כשתי דקות).

'''
N2 = r'''- 1.9.7 (12.11.2026 16:00; המשתמש: ״כל מקום שיש הדגמה חייב להיות ארוך עד סוף ההדגמה״, ״שערים לפתוח כרטיס ארוך״):
  - **הדגמות במצגת** — `TOUR_DEMO_HOLD_206`, כבבית ראשון (`tools206/tour_demo_206.py`; המנוע מגיע דרך `port_tour.py`). נמדד קודם: הדגמות של מקומות כבר החזיקו את השקופית (השער הגדול 29.3 שניות, הפשפשים 52.8, המסיבה 47.8, המוכני 25.7, בגדי הכהנים 15); נקטעו אחרי עשר שניות שקופיות ה*שיטות* שבחירתן מפעילה הדגמה: נושאים 93 (האבנט), 130–132 (שלוש קריאות הפשפש), 133 (דלתות רבי יהודה). אין כאן הדגמה שחוזרת בלולאה.
  - **כרטיסי השערים** (`GATE_CARDS_206`, בסוף `tools/cards_196.py`): המקומות ״שער שושן״ ו״שער ניקנור״ הם פריטי מבט (`key`), ופריט מבט פותח את `INFO[key]` — כרטיס קצר, שבעצמו הפנה ל״כרטיס שער שושן״; הטקסט של המקום עצמו (המשנה ושלושת המפרשים) לא הוצג בשום מקום. עכשיו `INFO[key]` נבנה בכל הרצה מטקסט המקום, וה־`REFS` ממקורותיו: בשער שושן נוספו אחרי פסקת ״במודל״ שורות ״בקצרה״ של שתי האמות (מ־`ROWB`; ה״בקצרה״ של גובה הכותל נשאר בתוך פסקת הכותל); בשער ניקנור — המשפט הפותח של הכרטיס הקצר (״מכוון כנגד בית קודש הקדשים״), ו״שתי לשכותיו — לכל אחת כרטיס משלה״.
  - **בדיקה**: `/home/claude/qa/fs/t6.mjs <plugin> sheni` (בזמן אמת, כשלוש דקות; וגם שני הכרטיסים).
'''
NU = '- 2.0.6 (12.11.2026): בית ראשון 1.3.9 ובית שני 1.9.7 (הפירוט ב־DEV_NOTES של כל בית). במעטפת — אין שינוי; `tools/qa-unified.mjs`: בחלק ״קובץ אחד״ נרשמת גרסת החדשות האמיתית כ״נראתה״.\n'
if __name__ == '__main__':
    # ---- B1
    f = '/home/claude/beit-rishon/src/70-ui.js'; s = open(f, encoding='utf-8').read()
    if '    ["1.3.9", [' not in s:
        old = '  var UI_NEWS_VERS = [\n    ["1.3.8", ['
        assert s.count(old) == 1
        s = s.replace(old, '  var UI_NEWS_VERS = [\n    ["1.3.9", [' + ",\n      ".join(J(x) for x in B1_NEWS) + ']],\n    ["1.3.8", [')
        open(f, 'w', encoding='utf-8').write(s); print('B1: news 1.3.9')
    m = '/home/claude/beit-rishon/plugin/manifest.json'; t = open(m, encoding='utf-8').read()
    if '"version": "1.3.8"' in t:
        open(m, 'w', encoding='utf-8').write(t.replace('"version": "1.3.8"', '"version": "1.3.9"', 1)); print('B1: manifest 1.3.9')
    # ---- B2
    p = '/home/claude/b2src/tools/port_ui.py'; u = open(p, encoding='utf-8').read()
    if 'news_197 = [' not in u:
        old = 'news_196 = [\n'; assert u.count(old) == 1
        u = u.replace(old, 'news_197 = [\n    ' + ",\n    ".join(J(x) for x in B2_NEWS) + '\n]\n' + old)
        old = '  var UI_NEWS_VERS = [\n    ["1.9.6", %s],\n'; assert u.count(old) == 1
        u = u.replace(old, '  var UI_NEWS_VERS = [\n    ["1.9.7", %s],\n    ["1.9.6", %s],\n')
        old = "''' % (J(news_196), J(news_196), J(news_195),"; assert u.count(old) == 1
        u = u.replace(old, "''' % (J(news_197), J(news_197), J(news_196), J(news_195),")
        open(p, 'w', encoding='utf-8').write(u); print('B2: news 1.9.7')
    m = '/home/claude/b2src/plugin/manifest.json'; t = open(m, encoding='utf-8').read()
    if '"version": "1.9.6"' in t:
        open(m, 'w', encoding='utf-8').write(t.replace('"version": "1.9.6"', '"version": "1.9.7"', 1)); print('B2: manifest 1.9.7')
    # ---- the unified plugin
    for m in ('/home/claude/unified-wt/unified/manifest.json', '/home/claude/beit-rishon/unified/manifest.json'):
        t = open(m, encoding='utf-8').read()
        if '"version": "2.0.5"' in t:
            open(m, 'w', encoding='utf-8').write(t.replace('"version": "2.0.5"', '"version": "2.0.6"', 1)); print('unified: manifest 2.0.6', m)
    # ---- the maintainers' notes
    def put(path, mark, before, text):
        s = open(path, encoding='utf-8').read()
        if mark in s: return
        assert s.count(before) >= 1, (path, before)
        i = s.index(before)
        open(path, 'w', encoding='utf-8').write(s[:i] + text + s[i:]); print('notes:', path)
    put('/home/claude/beit-rishon/plugin/DEV_NOTES.md', '**1.3.9 (12.11.2026', '**1.3.8 (12.11.2026', N1)
    put('/home/claude/b2src/DEV_NOTES.md', '- 1.9.7 (12.11.2026', '- 1.9.6 (12.11.2026', N2)
    for u_ in ('/home/claude/unified-wt/unified/DEV_NOTES.md', '/home/claude/beit-rishon/unified/DEV_NOTES.md'):
        put(u_, '- 2.0.6 (12.11.2026', '- 2.0.5 (12.11.2026', NU)
    # ---- the release notes
    clean = lambda s: s.replace('**', '')
    out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.6', '', 'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
           'בבית ראשון (1.3.9):'] + ['• ' + clean(x) for x in B1_NEWS] + ['', 'בבית שני (1.9.7):'] + ['• ' + clean(x) for x in B2_NEWS]
    open('/home/claude/beit-rishon/docs/תיאור העדכון 2.0.6.txt', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
    print('release notes: %d lines; the store note %d chars' % (len(out), len(NOTE)))
