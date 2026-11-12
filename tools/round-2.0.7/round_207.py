#!/usr/bin/env python3
# 12.11.2026 19:28-21:00: the round of the morning's service (B2 1.9.8, the unified plugin 2.0.7; B1 unchanged, 1.3.9) - the versions,
# the "מה חדש" list, the maintainers' notes and docs/תיאור העדכון 2.0.7.txt. Idempotent (every step by its own text).
import json
J = lambda x: json.dumps(x, ensure_ascii=False)
B2_NEWS = [
    "**הדגמה חדשה: סדר עבודת הבוקר** — לפי מסכת תמיד: מבית המוקד בלילה ועד שיר הלויים, שלב אחר שלב, בלשון המשנה. מפעילים בכפתור שעל המזבח, במקום ״סדר עבודת הבוקר — הדגמה״ שבקטגוריית ״מזבח וכלים״, או במצגת ״סדר עבודת הבוקר — מסכת תמיד״.",
    "**שתי שורות חדשות בטבלת השיטות** — ״סדר עבודת הבוקר — אביי או הרמב״ם״ ו״המנורה והנרות בבוקר״. בחירה בשורה משנה את ההדגמה מיד, באותו שלב.",
    "**הדמויות** — הכהנים בהדגמה הם הכהנים של הפייסות. האבנט שלהם לפי השורה ״אבנטו של כהן הדיוט״.",
    "**הלילה** — הלילה בהדגמה הוא הלילה של הפייסות.",
]
NOTE = 'הדגמה חדשה: סדר עבודת הבוקר לפי מסכת תמיד — מבית המוקד בלילה ועד שיר הלויים, שלב אחר שלב, בלשון המשנה.'
assert len(NOTE) <= 150, len(NOTE)
N2 = r'''- 1.9.8 (12.11.2026 19:28; המשתמש: ״הנה הזיפ תתחיל לעבוד / שים לב להתאים את הדמויות לאלו שעשית בשרשור הזה״; ו־12:11: ״תראה אם אפשר להעתיק את הההדגמה של עבודת הבוקר ולשלב אותה בתוך המצגת (תתאים שם את בגדי הכהונה והמקומות)״):
  - **הדגמת ״סדר עבודת הבוקר״** (נבנתה בצ'אט אחר על 1.9.4; מקורותיה ב־zip של המשתמש, פרוקים ב־`/home/claude/tamid-in`): `src/55-tamid.js`, `src/56-tamid-data.js` (נוצר ב־`tools/tamid_200.py` מטקסטי הספרייה, `/home/claude/texts`), `tools/tamid_rows_200.py` (שם הקובץ שם: `rows_200.py`; כאן כבר יש `rows_200.py` אחר — שתי שורות ומקום), `tools/ui_200.py` ו־`tools/tour_200.py` (טלאים ל־70-ui.js ול־75-tour.js שנוצרים). **ההעברה** (`/home/claude/tools207/port_tamid_207.py`, סימן `TAMID_PORT_207`): השינויים הקטנים שלה ב־40-altar.js, 45-vessels.js (`menSteps` שלה = `menStone` שלנו), 90-entry.js, assemble.mjs, chain.sh ו־rows_198.py — נעשו שוב, לפי עוגנים, על הקבצים של 1.9.7; העוגן הראשון של `tour_200.py` (שורת המצב ״רציפה״) עודכן לשורה של 1.9.7.
  - **הדמויות** (`TAMID_FIG_207`, `/home/claude/tools207/tamid_fig_207.py`): `55-payis.js` נותן את חלקי הכהן שלו ב־`SH.priestKit` (`PRIEST_KIT_207`; אותן גאומטריות וחומרים, משותפים; `handRaw` — אותה יד בלי `foreAt`; הדמויות של הפייסות לא השתנו), ו־`makeFigKit` בונה מהם את הכהנים והלויים על השלד של ההדגמה (`g`, `lean`, `L/R: sh, el, grip`, `fl/fr`). הכהן הגדול: הגוף של ההדגמה (`G.HK`, בלי אוזניים) מתחת לשמונת הבגדים, והראש, הזקן, השרוולים, הידיים והרגליים — של הכהן.
  - **האבנט** (`tools/tamid_link_207.py`, `TAMID_LINK_207`): השורה ״אבנטו של כהן הדיוט״ קובעת גם את כהני ההדגמה (`TM.setBelt`) כשההדגמה רצה, ובלי להפעיל אז את מופע הבגדים של הפייסות; המתג שבפס ההדגמה עובר דרך השורה. `begin()` לוקח את הקריאה מ־`SH.payis.avnet`.
  - **הלילה** (`TAMID_NIGHT_207`, `/home/claude/tools207/tamid_look_207.py`): הלילה של ההדגמה השאיר את מפת הסביבה דולקת, והשלבים בלילה נראו כמו יום. עכשיו — `SH.nightKit` (ה־`NIGHT` של `55-payis.js`): השלבים night–alot–barkai–heir–morning לפי שעון השמים של ההדגמה (`skyAt`).
  - **מבטים** (`TAMID_VIEWS_207`, `/home/claude/tools207/tamid_views_207.py`): moked, lot1 (סדר אביי), patrol (שתי נקודות המפתח הראשונות) ו־lamb — העין עמדה בתוך קיר (באגף הצפוני של האולם, בעלה של שער, בתוך מעטפת הבית). נבחרו עיניים שהקו מהן אל המקום פנוי (`TM.qaClear`, `TAMID_QA_207`; `/home/claude/qa/tamid/views.mjs`, `clear.mjs`, `hits.mjs`).
  - **כרטיס המקום** (`TAMID_CARD_207`): ״דמויות הכהנים — כדמויות הפייסות״, ו״בקצרה״ לשלוש המחלוקות, מתוך האפשרויות של השורות עצמן.
  - **בדיקות**: `/home/claude/qa/tamid/fullrun.mjs <plugin> <abba|rambam> 0.6` (כל ההדגמה בזמן אמת: 34 / 33 שלבים, אין שגיאות), `live.mjs` (כל שלב כפי שהצופה רואה אותו), `lineup2.mjs` (הדמויות מקרוב).
'''
NU = '- 2.0.7 (12.11.2026): בית שני 1.9.8 — הדגמת ״סדר עבודת הבוקר״ (הפירוט ב־DEV_NOTES של בית שני). בית ראשון — 1.3.9, בלי שינוי. במעטפת — אין שינוי.\n'
if __name__ == '__main__':
    p = '/home/claude/b2src/tools/port_ui.py'; u = open(p, encoding='utf-8').read()
    if 'news_198 = [' not in u:
        old = 'news_197 = [\n'; assert u.count(old) == 1
        u = u.replace(old, 'news_198 = [\n    ' + ",\n    ".join(J(x) for x in B2_NEWS) + '\n]\n' + old)
        old = '  var UI_NEWS_VERS = [\n    ["1.9.7", %s],\n'; assert u.count(old) == 1
        u = u.replace(old, '  var UI_NEWS_VERS = [\n    ["1.9.8", %s],\n    ["1.9.7", %s],\n')
        old = "''' % (J(news_197), J(news_197), J(news_196),"; assert u.count(old) == 1
        u = u.replace(old, "''' % (J(news_198), J(news_198), J(news_197), J(news_196),")
        open(p, 'w', encoding='utf-8').write(u); print('B2: news 1.9.8')
    m = '/home/claude/b2src/plugin/manifest.json'; t = open(m, encoding='utf-8').read()
    if '"version": "1.9.7"' in t:
        open(m, 'w', encoding='utf-8').write(t.replace('"version": "1.9.7"', '"version": "1.9.8"', 1)); print('B2: manifest 1.9.8')
    for m in ('/home/claude/unified-wt/unified/manifest.json', '/home/claude/beit-rishon/unified/manifest.json'):
        t = open(m, encoding='utf-8').read()
        if '"version": "2.0.6"' in t:
            open(m, 'w', encoding='utf-8').write(t.replace('"version": "2.0.6"', '"version": "2.0.7"', 1)); print('unified: manifest 2.0.7', m)
    def put(path, mark, before, text):
        s = open(path, encoding='utf-8').read()
        if mark in s: return
        assert s.count(before) >= 1, (path, before)
        i = s.index(before)
        open(path, 'w', encoding='utf-8').write(s[:i] + text + s[i:]); print('notes:', path)
    put('/home/claude/b2src/DEV_NOTES.md', '- 1.9.8 (12.11.2026', '- 1.9.7 (12.11.2026', N2)
    for u_ in ('/home/claude/unified-wt/unified/DEV_NOTES.md', '/home/claude/beit-rishon/unified/DEV_NOTES.md'):
        put(u_, '- 2.0.7 (12.11.2026', '- 2.0.6 (12.11.2026', NU)
    clean = lambda s: s.replace('**', '')
    out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.7', '', 'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
           'בבית ראשון (1.3.9): אין שינוי.', '', 'בבית שני (1.9.8):'] + ['• ' + clean(x) for x in B2_NEWS]
    open('/home/claude/beit-rishon/docs/תיאור העדכון 2.0.7.txt', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
    print('release notes: %d lines; the store note %d chars' % (len(out), len(NOTE)))
