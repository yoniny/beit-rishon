#!/usr/bin/env python3
# 12.11.2026: the maintainers' notes of the round of 12.11.2026 12:11 on (B1 1.3.8, B2 1.9.6, the unified plugin 2.0.5).
# Idempotent (each entry by its own first line). Usage: python3 notes_205.py <B1 t5 count> <B2 t5 count>
B1 = r'''**1.3.8 (12.11.2026; רשימת המשתמש מ־12:11 ואילך, אחרי 2.0.4; הסקריפטים ב־`/home/claude/tools204/`, אידמפוטנטיים לפי סימן בקוד):**
  - **האיטיות של 2.0.4 — הסיבה והתיקון** (`people_kit.js` + `people_204.py`, סימן `PEOPLE_KIT_205` בתוך `PEOPLE_KIT_204 BEGIN/END`): 700 דמויות הסנהדרין צוירו במלואן (כ־2,000 משולשים לדמות) מכל מרחק עד 150 אמה. עכשיו שלוש רמות לכל קבוצה, לפי מרחק העין משפת הקבוצה: מלאה (עד ~22 אמה), פשוטה (~300 משולשים; אותם חומרים), ויתד (מרחוק); בלי צללים; `userData.noPick`. מדד ההשוואה (אין מדידת GPU בכרום ללא מסך): `renderer.info.render.triangles` מול בנייה של 2.0.3.
  - **זמני המצגת** (`tour_times_205.py`, `TOUR_TIMES_205`; בשני העותקים של `75-tour.js`): 7 / 10 / 12 שניות לשקופית (קצב 0.6 / 1 / 1.5), ולא פחות מ־3 שניות למבט; שקופית עם ציר זמן (`anim`) — כאורכו.
  - **מבטים נוספים בתוך שקופית** (`tour_views_205.py`, `TOUR_VIEWS_205 BEGIN/END`): הטבלה `tour_VIEWS` — כותרת מקום → רשימת [עין, נקודת מבט] — מתווספת אחרי `item.tourThen` ואחרי מצלמות הממוזגים. כל מבט צולם ונבדק בעין לפני שנכתב (`/home/claude/qa/r3/tourstops.mjs` + מפרט JSON; גיליונות `mkviewsheets.py`). **לקח:** `cam.floorY` הוא הרצפה שמתחת ל**נקודת המבט**; נקודת מבט שמעל קורה או תקרה מרימה את העין אל גגן.
  - **`optThen`**: שקופית של שיטה טסה אל `row.tourThen[key]` (רשימת `{ cam, tg }`) — להוסיף ל־`opRow` ביד כשצריך.
  - **איחוד** (`UI_MERGE`): ״עליית קודש הקדשים — מעל הדביר״ → ״קודש הקדשים — הדביר״. **בר שורא**: מבט מלמעלה (`VIEWFIX_138`).
  - **גלילה תחת גג וחתך** (`nav_205.py`; `90-entry.js`): `WHEEL_ROOFED_205` — אירוע גלגלת אחד ≤ 2 אמות, יתרת התנועה ≤ 8 אמות, מהירות ≤ 20 אמה בשנייה; `SECTION_HOLD_205` — `sectionFor` אינו נסגר כל עוד העין בחצי החתוך.
  - **קול הדלתות** (`SFX_STOP_205`; `55-interior.js`): `SFX.stop()` סוגר את ה־AudioContext; `heichalDoors.stop()` קורא לו.
  - **בדיקות**: `/home/claude/qa/fs/t5.mjs <plugin> rishon` — __B1N__ בדיקות; `t4.mjs` עודכן (1400 מופעי גלימה).

'''
B2 = r'''- 1.9.6 (12.11.2026; רשימת המשתמש מ־12:11 ואילך, אחרי 2.0.4; הסקריפטים ב־`/home/claude/tools204/`; התוכן ב־`tools/rows_200.py` חלק 20, `VIEWFIX_205`):
  - **האיטיות של 2.0.4** — כבבית ראשון (`PEOPLE_KIT_205`); ובנוסף `PAYIS_LIGHT_205` ב־`src/55-payis.js` (פחות חלוקות בכתונת, במגבעת, בזקן ובאבנט של דמות הכהן).
  - **זמני המצגת, מבטים נוספים בשקופית, `optThen`** — כבבית ראשון; הטבלה של בית שני ב־`tools/tour_views_b2.json` (נכתבת ב־`tour_views_205.py`, נכנסת ב־`port_tour.py`); `port_ui.py` מוציא `tourThen` לכל אפשרות של שורה (`opts[k].tourThen`).
  - **שערים** (`gates_205.py`, `GATES_FAR_205`; `src/30-courts.js`): בקריאות של שלושה עשר שערים — דסקית מעל כל שער (7 זהובות, 6 אדומות), גדלה עם המרחק; השמות שבמחלוקת בגודל 2.6; שם בית המוקד גם מעל פניו הצפוניים. שורת ״שער העליון״: `tourThen` לאפשרות השנייה. שורת ״שמות שערי הצפון״: מצלמה לכל קריאה. שורת ״שערי בית המוקד״: מצפון־מזרח ומלמעלה.
  - **שתי הפרוכות**: בלי חתך; העין בין שתיהן `[-45.05, 26.2, 9.75] → [-44.95, 24.6, -9]`; `tourThen` — הפתח שבדרום מן הקודש, ומן הקצה הצפוני חזרה.
  - **לחם שולחן השיש** (`bread_205.py`, `BREAD_205`): `ctx2.shared.breadKit` מ־`45-vessels.js`; `50-heichal.js` מציב את אותה גאומטריה (`ulam-table-bread`).
  - **תקרת האולם**: `pickJs` סוגר את `hei-ulam` ו־`hei-ulam-front`; המצלמה `[7, 24.5, 29] → [7, 55, 0]` (נקודת המבט מתחת לכלונסות — ראה הלקח שבבית ראשון).
  - **השיתין** (`SHITIN_LABEL_205`), **הסורג**, **הסטיו** (`royalStoa` ב־`20-mount.js`; ה־`tourThen` שלו ב־`port_ui.py`), **כלונסות הארז** — מצלמות.
  - **גלילה תחת גג וחתך** — כבבית ראשון (`nav_205.py`).
  - **קול הדלתות** (`SFX_STOP_205`, `SFX_STOP_205 b`; `src/50-heichal.js`): `G.stop()` סוגר את הקול; `pishpeshStop` (עצירה בכוח) עוצר גם את הדגמת השער שההליכה הפעילה (`D.gateRun`) ואת כל הקולות שעוד בתור.
  - **בדיקות**: `/home/claude/qa/fs/t5.mjs <plugin> sheni` — __B2N__ בדיקות.
'''
UNI = r'''- 2.0.5 (12.11.2026): בית ראשון 1.3.8 ובית שני 1.9.6 (הפירוט ב־DEV_NOTES של כל בית). במעטפת — אין שינוי.
'''
import sys
b1n, b2n = sys.argv[1], sys.argv[2]
def put(path, marker, before, text):
    s = open(path, encoding='utf-8').read()
    if marker in s:
        return
    assert s.count(before) == 1, (path, s.count(before))
    open(path, 'w', encoding='utf-8').write(s.replace(before, text + before))
    print('notes:', path)
put('/home/claude/beit-rishon/plugin/DEV_NOTES.md', '**1.3.8 (12.11.2026', '**1.3.7 (11–12.11.2026', B1.replace('__B1N__', b1n))
put('/home/claude/b2src/DEV_NOTES.md', '- 1.9.6 (12.11.2026', '- 1.9.5 (11–12.11.2026', B2.replace('__B2N__', b2n))
for u in ('/home/claude/unified-wt/unified/DEV_NOTES.md', '/home/claude/beit-rishon/unified/DEV_NOTES.md'):
    put(u, '- 2.0.5 (12.11.2026)', '- 2.0.4 (12.11.2026)', UNI)
