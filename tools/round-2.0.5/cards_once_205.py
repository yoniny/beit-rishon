#!/usr/bin/env python3
# 12.11.2026 (the end of the round; found in the last comparison of two builds): three content steps of the B2 chain were not repeat-safe.
#   1. the Gazit card (rows_200.py part 12 + part 19): every run of the chain added the figures' paragraphs again - 2.0.4 was published
#      with them five times. Fixed in rows_200.py (GAZIT_ONCE_205) with an assert that fails the chain.
#   2. the mesibah card (rows_194.py + rows_196.py): rows_194's older sentence ("the click cuts the model") came back beside the newer
#      one of rows_196 on every run after the first (MESIBAH_STALE_205).
#   3. the Shushan gate's place text (rows_200.py part 10): one sentence added on every run, 92 copies - it never reached the plugin (the
#      place opens the view's card), but the source file grew (SHUSHAN_ONCE_205).
# The guard: /home/claude/qa/fs/norepeat.py (in final7.sh) - no Hebrew text of a bundle may hold the same sentence or paragraph twice;
# and "sh tools/chain.sh" twice must give the same content.json and the same bundle (checked at the end of this round, three runs).
# This script (idempotent): the user's "what is new" line, the maintainers' note.
import json
ITEM = "**כרטיס לשכת הגזית** — פסקת הדמויות נכתבה בו חמש פעמים; עכשיו פעם אחת. **כרטיס המסיבה** — הוסר משפט ישן, שלפיו הלחיצה חותכת את המודל."
J = lambda x: json.dumps(x, ensure_ascii=False)
# 1. the list of versions_205.py (the release notes are made of it)
v = '/home/claude/tools204/versions_205.py'
s = open(v, encoding='utf-8').read()
if ITEM not in s:
    last = '    "**הדגמת הפשפש** — עצירתה עוצרת גם את פתיחת השער הגדול שהיא הפעילה, ומשתיקה את קול הדלתות.",\n]\n'
    assert s.count(last) == 1
    s = s.replace(last, last[:-2] + '    ' + J(ITEM) + ',\n]\n')
    open(v, 'w', encoding='utf-8').write(s); print('versions_205.py: item added')
# 2. the plugin's own list (port_ui.py, news_196)
p = '/home/claude/b2src/tools/port_ui.py'
u = open(p, encoding='utf-8').read()
if ITEM not in u:
    i = u.index('news_196 = [\n'); j = u.index('\n]\n', i)
    u = u[:j] + ',\n    ' + J(ITEM) + u[j:]
    open(p, 'w', encoding='utf-8').write(u); print('port_ui.py: item added')
# 3. the maintainers' note (B2)
d = '/home/claude/b2src/DEV_NOTES.md'
t = open(d, encoding='utf-8').read()
NOTE = ('  - **שלושה צעדי תוכן שלא היו בטוחים להרצה חוזרת** (`cards_once_205.py`; נמצאו בהשוואת שתי בניות רצופות): (א) `rows_200.py` חלק 12 + חלק 19 — '
        'כל הרצה של `chain.sh` הוסיפה לכרטיס לשכת הגזית את פסקאות הדמויות שוב (2.0.4 פורסמה עם חמישה עותקים) — `GAZIT_ONCE_205`, ו־assert שמפיל את השרשרת; '
        '(ב) `rows_194.py` + `rows_196.py` — המשפט הישן של כרטיס המסיבה (״הלחיצה כאן חותכת את המודל״) חזר לצד החדש — `MESIBAH_STALE_205`; '
        '(ג) `rows_200.py` חלק 10 — משפט שנוסף בכל הרצה לטקסט המקום ״שער שושן״ (92 עותקים; אינו מגיע לתוסף, המקום פותח את כרטיס המבט) — `SHUSHAN_ONCE_205`. '
        '**הכלל:** צעד שמוסיף טקסט ״אם איננו״ חייב להכיר גם את הצורה שצעד מאוחר נותן לו. **הבדיקות:** `python3 -I /home/claude/qa/fs/norepeat.py <bundle.js>…` '
        '(אין משפט או פסקה פעמיים באותו טקסט; ב־`final7.sh`), ו־`sh tools/chain.sh` פעמיים — אותו `content.json` ואותו `bundle.js`.\n')
if 'cards_once_205.py' not in t:
    k = t.index('- 1.9.6 (12.11.2026'); e = t.index('\n', k) + 1
    t = t[:e] + NOTE + t[e:]
    open(d, 'w', encoding='utf-8').write(t); print('B2 DEV_NOTES: note added')
