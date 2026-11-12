#!/usr/bin/env python3
# 11.11.2026: the versions and "מה חדש" of the round after the user's pictures and recording of 11.11 (08:14-08:20):
# B1 1.3.6, B2 1.9.4, the unified plugin 2.0.3. "**...**" is bold; a line that starts with "@מאוחד " shows only inside the unified plugin.
# Idempotent. The lists are read by gen_release_notes2.py too.
import json
B1_NEWS = [
    "**המצגת מתחילה ממצב רגיל** — חתך, גג או קיר שנשארו פתוחים נסגרים בתחילת המצגת, וחוזרים למקומם בסופה.",
    "**מבטים מתוקנים בטבלת השיטות** — ״הפותות״: מקרוב, אל המפתח של זהב שבמנעול הדלת (רש״י), או אל הציר שבתחתיתה (תרגום ורד״ק), ולציר תווית משלו; ״הכבשים הקטנים״: מקרוב, אל המקום שבו הם מגיעים אל המזבח.",
]
B2_NEWS = [
    "**המצגת** — תפריט המצגת נפתח מתחת לכפתור, ולחיצה על אחד משלושת המצבים מתחילה אותה (בגרסה הקודמת התפריט התפזר בסרגל, והמצגת לא התחילה); והיא מתחילה ממצב רגיל: מה שנשאר פתוח נסגר בתחילתה, וחוזר בסופה.",
    "**מבטים מתוקנים בטבלת השיטות** — לחיצה על המתג מביאה אל הדבר עצמו: ״תקרת האולם — בלי תקרה״ מלמעלה, אל תוך האולם הפתוח; ״חומר המנורה והשולחן״ מול המנורה והשולחן; ״הציור על הפרוכות״ מול הפרוכת; ״שערי בית המוקד״ מעל הלשכה, בשתי צורות הבניין; ו״הרווח שבין הכבש למזבח״ מקרוב, מלמעלה.",
    "**הכסף נראה כסף** — המנורה והשולחן של כסף (וכן של ברזל מחופה בבעץ) צבועים באפור, ולא על גון הזהב.",
    "**הרווח שבין הכבש למזבח, לשיטת התוספות** — מצויר כחריץ כהה בין ראש הכבש למזבח, כדי שייראה.",
]
if __name__ == '__main__':
    J = lambda x: json.dumps(x, ensure_ascii=False)
    # ---------------------------------------------------------------- B1
    f = '/home/claude/beit-rishon/src/70-ui.js'
    s = open(f, encoding='utf-8').read()
    if '    ["1.3.6", [' not in s:
        old = '  var UI_NEWS_VERS = [\n    ["1.3.5", ['
        assert s.count(old) == 1
        s = s.replace(old, '  var UI_NEWS_VERS = [\n    ["1.3.6", [' + ",\n      ".join(J(x) for x in B1_NEWS) + ']],\n    ["1.3.5", [')
        open(f, 'w', encoding='utf-8').write(s)
        print('B1: news 1.3.6 added')
    m = '/home/claude/beit-rishon/plugin/manifest.json'
    t = open(m, encoding='utf-8').read()
    if '"version": "1.3.5"' in t:
        open(m, 'w', encoding='utf-8').write(t.replace('"version": "1.3.5"', '"version": "1.3.6"', 1))
        print('B1: manifest 1.3.6')
    # ---------------------------------------------------------------- B2
    p = '/home/claude/b2src/tools/port_ui.py'
    u = open(p, encoding='utf-8').read()
    if 'news_194 = [' not in u:
        old = 'news_193 = [\n'
        assert u.count(old) == 1
        u = u.replace(old, 'news_194 = [\n    ' + ",\n    ".join(J(x) for x in B2_NEWS) + '\n]\n' + old)
        old = '  var UI_NEWS_VERS = [\n    ["1.9.3", %s],\n'
        assert u.count(old) == 1
        u = u.replace(old, '  var UI_NEWS_VERS = [\n    ["1.9.4", %s],\n    ["1.9.3", %s],\n')
        old = "''' % (J(news_193), J(news_193), J(news_192),"
        assert u.count(old) == 1
        u = u.replace(old, "''' % (J(news_194), J(news_194), J(news_193), J(news_192),")
        open(p, 'w', encoding='utf-8').write(u)
        print('B2: news 1.9.4 added')
    m = '/home/claude/b2src/plugin/manifest.json'
    t = open(m, encoding='utf-8').read()
    if '"version": "1.9.3"' in t:
        open(m, 'w', encoding='utf-8').write(t.replace('"version": "1.9.3"', '"version": "1.9.4"', 1))
        print('B2: manifest 1.9.4')
    # ---------------------------------------------------------------- the unified plugin
    for m in ('/home/claude/unified-wt/unified/manifest.json', '/home/claude/beit-rishon/unified/manifest.json'):
        t = open(m, encoding='utf-8').read()
        if '"version": "2.0.2"' in t:
            open(m, 'w', encoding='utf-8').write(t.replace('"version": "2.0.2"', '"version": "2.0.3"', 1))
            print('unified: manifest 2.0.3', m)
