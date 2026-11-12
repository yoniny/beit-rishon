# -*- coding: utf-8 -*-
# B2 1.9.5 - the Gazit hall's inside per the Meiri (30-courts.js: tools204/b2_gazit_meiri.py). Idempotent: writes part 13 into
# b2src/tools/rows_200.py (the card's two paragraphs, the labels' map, the students' rows' camera).
import io
R = '/home/claude/b2src/tools/rows_200.py'
s = io.open(R, encoding='utf-8').read()
PART = r'''# ---------------------------------------------------------------- 13. THE GAZIT HALL'S INSIDE PER THE MEIRI (GAZIT_MEIRI_195)
# The user (11.11.2026, 21:15), on the question put to him (the Meiri: the holy half in the EAST of the hall, the unconsecrated in the
# WEST - leave the division by the court wall's line, or seat the row in the west half): "ב". Geometry: tools204/b2_gazit_meiri.py.
gz = place12('לשכת הגזית — הסנהדרין')
set_paras(gz, ['חלקה הצפוני בנוי', 'חלוקת הלשכה במודל', 'הלשכה עומדת על קו כותל העזרה'], [
    'חלוקת הלשכה במודל (מגרסה 1.9.5) — מזרח ומערב, כלשון הגמרא והמאירי: **חציה המזרחי — הקודש**, ושם מקום הפייס; **חציה המערבי — '
    'החול**, ושם יושבים שבעים ואחד בשורה אחת, כחצי גורן, פניהם למזרח, הנשיא באמצע, ושני סופרי הדיינים לפניהם (סנהדרין ד, ג). הפתח '
    'לחול — במערב, ומעלות יורדות ממנו אל החיל; הפתח לקודש — בחציה המזרחי, בכותל הדרומי, אל עזרת הכהנים. פס נחושת ברצפה, מצפון '
    'לדרום, מסמן את הגבול. כיוון פניהם לשיטת המאירי — בחירת מודל. בקצרה — **תפארת ישראל** (צורת בית המקדש): ״בנויה חציה בדרום '
    'בקודש וחציה בצפון בחול״, והסנהדרין ״פניהם לדרום ואחוריהן לצפון״.',
    'הלשכה עומדת על קו כותל העזרה: חלקה הצפוני בנוי מחוץ לכותל, ורצפתו גבוהה כרצפת העזרה (תוספות יום טוב). **תוספות ישנים** '
    '(יומא כה.): ״דחציה בנויה בקדש וחציה בנויה בחול״.'], 'מידות האולם, מקומות הפתחים')
assert gz['info'].count('חלוקת הלשכה במודל (מגרסה 1.9.5) — מזרח ומערב') == 1 and 'ואינה כלשון' not in gz['info']
c['LABEL_MAP'].pop('גבול קודש | חול', None)
if ['תפארת ישראל, צורת בית המקדש', 'Tzurat_Beit_HaMikdash_Tiferet.66'] not in gz['refs']:
    gz['refs'].append(['תפארת ישראל, צורת בית המקדש', 'Tzurat_Beit_HaMikdash_Tiferet.66'])
for _t in ('חצי החול — במערב', 'חצי הקודש — במזרח'):
    c['LABEL_MAP'][_t] = {'place': 'לשכת הגזית — הסנהדרין'}
sr = row('שורות התלמידים שלפני הסנהדרין')
for o in sr['opts']:
    o['cam'], o['tg'] = [77, 46, -50], [74.5, 16.5, -67]
'''
MARK = '# ---------------------------------------------------------------- 99. WALK_SORT'
if 'GAZIT_MEIRI_195' in s:
    i0 = s.index('# ---------------------------------------------------------------- 13. THE GAZIT HALL')
    import re as _re
    _m = _re.search(r'\n# -{60,} \d+\. ', s[i0 + 10:])
    i1 = i0 + 10 + _m.start() + 1 if _m else s.index(MARK)
    s = s[:i0] + PART + s[i1:]
    print('part 13 replaced')
else:
    assert s.count(MARK) == 1
    s = s.replace(MARK, PART + MARK)
    print('part 13 inserted')
io.open(R, 'w', encoding='utf-8').write(s)
