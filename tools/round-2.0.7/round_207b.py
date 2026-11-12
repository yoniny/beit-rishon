#!/usr/bin/env python3
# 12.11.2026 ~22:00: the rest of round 2.0.7 ("הכל ביחד", the user 20:36) - B1 1.4.0 (the zoom to the cursor, the pause of demonstrations),
# B2 1.9.8 news + notes for the zoom, the pause and the linked first lotteries (Abaye by default), the unified notes and the release notes.
# Runs after round_207.py; idempotent (every step checks its own text).
import json, re, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))   # our own folder (python -I leaves it out)
from round_207 import B2_NEWS as B2_TAMID
J = lambda x: json.dumps(x, ensure_ascii=False)
ZOOM = "**זום אל הסמן** — גלגלת העכבר מגדילה עכשיו את המקום שהסמן עומד עליו, ולא את מרכז התמונה. הסמן נראה כזכוכית מגדלת."
PAUSE1 = ("**השהיית הדגמה** — לחיצה על הדגם בזמן הדגמה (עליית המלך לכסא, העדים, העלייה בלולים) משהה אותה, ולא מפסיקה אותה. "
          "בסרגל שלמטה: ״המשך״ — מאותה השנייה; ״מההתחלה״; ״עצור״. בזמן ההשהיה אפשר להסתובב ולהתבונן.")
PAUSE2 = ("**השהיית הדגמה** — לחיצה על הדגם בזמן הדגמה (הפייסות, ההליכה במסיבה, פתיחת ארבע הדלתות, הכניסה בפשפש) משהה אותה, ולא מפסיקה אותה. "
          "בסרגל שלמטה: ״המשך״ — מאותה השנייה; ״מההתחלה״ (בהדגמת הפייסות); ״עצור״. בזמן ההשהיה אפשר להסתובב ולהתבונן.")
LOTS = ("**הפייס הראשון — שתי שורות מקושרות** — בטבלת השיטות, ״הפייס הראשון — היכן ומתי״ ו״סדר עבודת הבוקר — אביי או הרמב״ם״ עוברות יחד. "
        "ברירת המחדל — אביי, כסדר המשנה.")
B1_NEWS = [ZOOM, PAUSE1]
B2_NEWS = B2_TAMID + [LOTS, ZOOM, PAUSE2]
NOTE = "הדגמה חדשה: סדר עבודת הבוקר לפי מסכת תמיד. זום אל מקום הסמן. השהיית הדגמות ארוכות, והמשך מאותה השנייה."
assert len(NOTE) <= 150, len(NOTE)
N1 = r'''**1.4.0 (12.11.2026 20:23–22:00; המשתמש: ״יהיה אפשר לעמוד עם סמן (בצורת זכוכית מגדלת) והמקום עליו עומד הסמן - הוא זה שיוגדל בזום״, ו־20:34: ״יש סיכוי להשהות״; הסקריפטים ב־`/home/claude/tools207/`):**
  - **`ZOOM_CURSOR_207`** (`90-entry.js`, זהה בשני הבתים; `zoom_cursor_207.py`): הגלגלת מקרבת אל הנקודה שמתחת לסמן — קרן מהסמן אל הדגם (בלי תוויות, ספרייטים, השמים והשקופים מאוד; אם אין פגיעה — נקודה על הקרן במרחק המטרה), והמצלמה והמטרה זזות יחד בהומותטיה סביבה (`DMIN` 2.5, ובתוך בית מקורה 2). נקודת העוגן נקבעת פעם אחת לכל רצף גלגול; הסמן — זכוכית מגדלת 450 ms. `window.__zoomQA` לבדיקות. בדיקה: `/home/claude/qa/zoom/z1.mjs <plugin> <rishon|sheni>` (7 בדיקות).
  - **`DEMO_PAUSE_207`** (`90-entry.js`; `demo_pause_207.py`): רשומת `demoStops` יכולה לתת `pause()`, `resume()`, `paused()` ו־`restart()`. לחיצה על הדגם (pointerdown, לא בזמן המצגת) משהה כל הדגמה רצה שיש לה `pause`; הסרגל `#tm-dpause` (״⏸ השהה״ / ״▶ המשך״, ״⟲ מההתחלה״ כשיש `restart`, ״■ עצור״) מופיע כל עוד יש הדגמה כזאת. לחיצה על מתג עדיין עוצרת (ה־click הכללי; הסרגל — ברשימת היוצאים מן הכלל).
  - **ההליכה** (`50-heichal.js`; `demo_pause_b1_207.py`, `walk_now_b1_207.py`): `S.pausedAt` — השעון עומד והעין של הצופה; בהמשך — מעבר רך (0.9 שנ׳) מהמקום שהצופה השאיר אליו את העין אל מסלול ההליכה. `walk.now()` — שניית ההליכה (עומדת בהשהיה); האור של העולה בלולים הולך עכשיו לפיה (עד כה המשיך לבדו בהשהיה). ה־pointerdown שעצר את ההליכה — הוסר.
  - **הכסא** (`60-palace.js`): `anim.paused`, `pauseThr` / `resumeThr`; העלייה והעדים — `pause`, `resume`, `paused`; הרשומות ב־`demoStops` — `running` כולל השהיה, ו־`restart` (`start()` באותה שיטה). `stopAll` ו־`reset` מנקים את ההשהיה.
  - **`TOUR_DEFAULT_207`** (`75-tour.js`, בשני העותקים): בסוף המצגת השורות חוזרות לבחירה שלהן (`r.current`), ורק בלעדיה — לאפשרות הראשונה.
  - **בדיקה**: `/home/claude/qa/pause/p1.mjs <plugin> rishon` (בזמן אמת: העלייה לכסא — השהיה, השעון עומד שתי שניות, ״המשך״ מאותה שנייה, ״מההתחלה״, ״עצור״; ההליכה בלולים — כנ״ל; 13 בדיקות).

'''
N2 = r'''  - **זום אל הסמן והשהיית הדגמה** (`ZOOM_CURSOR_207`, `DEMO_PAUSE_207` — אותו קוד כבבית ראשון 1.4.0, ראה שם): כאן גם `55-payis.js` (`pauseRun` / `resumeRun`: `R.hold` עוצר את הזמן, `R.free` משחרר את העין, בהמשך — מעבר רך 0.9 שנ׳; `restart` — `start()`; `now()` — שניית ההדגמה, לבדיקות), `50-heichal.js` (ההליכה; השער הגדול — `G.pausedAt`, והקול: `SFX.suspend()` / `resume()` — ההקשר נעצר, והצלילים המתוזמנים שומרים את שנייתם; הפשפש — `D.pausedAt`). ה־pointerdown שעצרו את ההדגמות — הוסרו. בדיקה: `/home/claude/qa/pause/p1.mjs <plugin> sheni` (25 בדיקות: הפייסות, המסיבה, השער, הפשפש).
  - **הפייס הראשון — שתי השורות מקושרות** (`tools/lots_link_207.py`, `LOTS_LINK_207`): ״הפייס הראשון״ (`payis.setReading`) ו״סדר עבודת הבוקר״ (`TM.setOrder`) — בחירה באחת מסמנת את השנייה (`R.onPick`, `R.mark`; `S.__lotsLink` מונע לולאה). ברירת המחדל — אביי (`reading: "tamid"`; המשתמש, 20:28: ״אביי״). בדיקה: `/home/claude/qa/tamid/lots.mjs`.
'''
NU = '- 2.0.7 (12.11.2026): בית ראשון 1.4.0 — זום אל הסמן, השהיית הדגמות. בית שני 1.9.8 — הדגמת ״סדר עבודת הבוקר״, הפייס הראשון בשתי שורות מקושרות (אביי), זום אל הסמן, השהיית הדגמות (הפירוט ב־DEV_NOTES של כל בית). במעטפת — אין שינוי.\n'
def rd(p): return open(p, encoding='utf-8').read()
def wr(p, s): open(p, 'w', encoding='utf-8').write(s)
if __name__ == '__main__':
    # B2: the news list of 1.9.8, regenerated whole
    p = '/home/claude/b2src/tools/port_ui.py'; u = rd(p)
    m = re.search(r'news_198 = \[\n.*?\n\]\n', u, re.S); assert m
    blk = 'news_198 = [\n    ' + ",\n    ".join(J(x) for x in B2_NEWS) + '\n]\n'
    if m.group(0) != blk: wr(p, u[:m.start()] + blk + u[m.end():]); print('B2: news 1.9.8 -> %d lines' % len(B2_NEWS))
    # B1: 1.4.0
    p = '/home/claude/beit-rishon/src/70-ui.js'; u = rd(p)
    if '["1.4.0", [' not in u:
        old = '  var UI_NEWS_VERS = [\n    ["1.3.9", ['; assert u.count(old) == 1
        u = u.replace(old, '  var UI_NEWS_VERS = [\n    ["1.4.0", [' + ", ".join(J(x) for x in B1_NEWS) + ']],\n    ["1.3.9", [')
        wr(p, u); print('B1: news 1.4.0')
    p = '/home/claude/beit-rishon/plugin/manifest.json'; t = rd(p)
    if '"version": "1.3.9"' in t: wr(p, t.replace('"version": "1.3.9"', '"version": "1.4.0"', 1)); print('B1: manifest 1.4.0')
    def put(path, mark, before, text):
        s = rd(path)
        if mark in s: return
        assert s.count(before) >= 1, (path, before)
        i = s.index(before); wr(path, s[:i] + text + s[i:]); print('notes:', path)
    put('/home/claude/beit-rishon/plugin/DEV_NOTES.md', '**1.4.0 (12.11.2026', '**1.3.9 (12.11.2026 16:00', N1)
    put('/home/claude/b2src/DEV_NOTES.md', '`LOTS_LINK_207`', '- 1.9.7 (12.11.2026', N2)
    for p in ('/home/claude/unified-wt/unified/DEV_NOTES.md', '/home/claude/beit-rishon/unified/DEV_NOTES.md'):
        s = rd(p); m = re.search(r'^- 2\.0\.7 \(12\.11\.2026\).*\n', s, re.M); assert m, p
        if m.group(0) != NU: wr(p, s[:m.start()] + NU + s[m.end():]); print('unified notes:', p)
    clean = lambda s: s.replace('**', '')
    out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.7', '', 'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
           'בבית ראשון (1.4.0):'] + ['• ' + clean(x) for x in B1_NEWS] + ['', 'בבית שני (1.9.8):'] + ['• ' + clean(x) for x in B2_NEWS]
    wr('/home/claude/beit-rishon/docs/תיאור העדכון 2.0.7.txt', '\n'.join(out) + '\n')
    print('release notes: %d lines; the store note %d chars' % (len(out), len(NOTE)))
