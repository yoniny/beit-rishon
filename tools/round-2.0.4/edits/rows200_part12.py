# -*- coding: utf-8 -*-
# B2 1.9.5 - the three northern chambers as one building (30-courts.js: b2_three_chambers.py). This script (idempotent) writes part 12
# into b2src/tools/rows_200.py (the cards of the three chambers, their views, the links) and adds the books of the new links to
# b2src/tools/port_ui.py. Every quote was read in the user's library on 11.11.2026 (LIB_1111.md, "~21:00").
import io, sys
R = '/home/claude/b2src/tools/rows_200.py'
s = io.open(R, encoding='utf-8').read()
PART = r'''# ---------------------------------------------------------------- 12. THE THREE NORTHERN CHAMBERS: ONE BUILDING, ONE LEVEL ROOF (THREE_CHAMBERS_195)
# The user (11.11.2026, 18:13): "אפשרות א" - the three chambers joined under one level roof; (18:21): "את לשכת הגזית תעביר כדברי הבועז.
# ברור שתעשה כך"; his rule: "אנו לא עושים נגד ראשונים". Geometry: 30-courts.js (tools204/b2_three_chambers.py). Every quote below was read
# in his library on 11.11.2026 (LIB_1111.md): Yoma 25a (107:580), Rashi there (2157:885) and on 19a (2157:595-596), the Meiri (2199:228-229),
# Tosafot Yeshanim (1992:243), the Tosafot Rid (2109:76), Tosafot Yoma 8b (1908:68), the Tosafot Yom Tov on Middot 5:4 (948:204, 205,
# 208), the Yachin (819:679, 681), the Boaz (1329:26).
def place12(title):
    for g, items in c['PLACES']:
        for it in items:
            if it['t'] == title:
                return it
    raise SystemExit('no place ' + title)
def set_paras(it, drop_prefixes, new_paras, before_prefix=None):
    """the card's paragraphs: those that open with one of drop_prefixes go, new_paras come in before the paragraph that opens with
    before_prefix (or at the end)"""
    paras = [p for p in it['info'].split('\n') if not any(p.startswith(d) for d in drop_prefixes)]
    k = next((i for i, p in enumerate(paras) if before_prefix and p.startswith(before_prefix)), len(paras))
    paras[k:k] = new_paras
    it['info'] = '\n'.join(paras)
def add_refs(it, refs):
    have = {r[1] for r in it.get('refs', [])}
    it.setdefault('refs', []).extend([r for r in refs if r[1] not in have])
G_ROOF = '״וגג שלשתן שוה״ (מידות ה, ד); רש״י (יומא יט.): ״וגג שלשתן שוה — קירוי אחד לשלשתן״'
G_SHILTEI = 'שלטי הגיבורים שבתוספות יום טוב'
# --- the Gazit hall
gz = place12('לשכת הגזית — הסנהדרין')
gz['tg'], gz['cam'] = [79, 15, -66.5], [79, 62, -50]
gz['info'] = gz['info'].replace('במזרח שתי הלשכות האחרות, ואורכה כאורכן יחד',
                                'במזרח שתי הלשכות האחרות, ״והיה ארכה מצפון לדרום, כאורך לשכת עץ ולשכת גולה מצפון לדרום יחד״')
assert '״והיה ארכה מצפון לדרום, כאורך לשכת עץ ולשכת גולה מצפון לדרום יחד״' in gz['info']
set_paras(gz, ['במודל: בחצי הצפוני', 'במודל (מגרסה 1.9.5):', '**בועז** (מידות ה, ב):', '**הגמרא** (יומא כה.):', 'חלקה הצפוני בנוי',
               'חלוקת הלשכה במודל', 'מידות האולם, מקומות הפתחים'], [
    '**בועז** (מידות ה, ב): ״ואותן ג׳ הלשכות היה מקצת מהן בעזרת ישראל, ומקצת מהן בעזרת כהנים. ויהיה איך שיהיה היה לכה״פ קצת מג׳ לשכות '
    'ההן בעזרת ישראל״.',
    '**הגמרא** (יומא כה.): ״לשכת הגזית כמין בסילקי גדולה היתה, פייס במזרחה, וזקן יושב במערבה״. רש״י: ״וזקן — של ב״ד המורה להן סדר '
    'הפייסין יושב במערבה״. **המאירי** שם: הכהנים ״מתקבצים בחציה של קדש שהיה בצד מזרחה של לשכה״, ״וזקן מזקני הסנהדרין יושב בחציה של חול '
    'לצד מערבה של לשכה״; ושאל: ״האיך היתה חציה של חול לצד המערב וחציה שבקדש למזרח והדין היה נותן בהיפך״, ותירץ: ״אפשר שמצד הפתחים '
    'היה כן שחציה הבנוי במקום קדש ר״ל בצד המערב פתוח לחול וחציה שבמזרח פתוח במקום קדש״.',
    'במודל (מגרסה 1.9.5): שלוש הלשכות — בניין אחד בצפון־מזרח העזרה, וגג אחד שווה לשלושתן: ' + G_ROOF + '. לשכת הגזית במזרח הבניין, '
    'ושתי הלשכות מאחוריה, במערבה — כ' + G_SHILTEI + ' וכתפארת ישראל. מקומה כדברי הבועז: היא תופסת את אחת עשרה האמה של עזרת ישראל '
    '(מעל מעלות הדוכן) ואת אחת עשרה האמה של עזרת הכהנים, והבניין מסתיים עשר אמות מערבה משם. אורכה מצפון לדרום, כלשון תפארת ישראל — '
    'עשרים על עשרים ושתיים אמה מבפנים.',
    'חלקה הצפוני בנוי מחוץ לכותל העזרה, ורצפתו גבוהה כרצפת העזרה (תוספות יום טוב) — הוא החול; שם יושבים שבעים ואחד בשורה אחת, כחצי '
    'גורן, הנשיא באמצע, ושני סופרי הדיינים לפניהם (סנהדרין ד, ג). חלקה הדרומי, שבתוך העזרה — הקודש; ובמזרחו מקום הפייס. הפתח לחול — '
    'במערב, ומעלות יורדות ממנו אל החיל; הפתח לקודש — בכותל הדרומי, אל עזרת הכהנים.',
    'חלוקת הלשכה במודל היא לפי קו כותל העזרה — צפון ודרום (תוספות ישנים, יומא כה.: ״דחציה בנויה בקדש וחציה בנויה בחול״); ואינה כלשון '
    'המאירי, שחצי הקודש במזרח הלשכה וחצי החול במערבה.',
    'מידות האולם, מקומות הפתחים בכתליהם וצורת הדמויות — בחירת מודל. שלוש שורות התלמידים (סנהדרין ד, ד) — לפניהם, לפי רש״י או יד רמה '
    '(בטבלת השיטות).'], 'סדר הישיבה:')
add_refs(gz, [['רש״י יומא יט.', 'Rashi_on_Yoma.19.1'], ['רש״י יומא כה.', 'Rashi_on_Yoma.25.1'], ['מאירי יומא כה.', 'Meiri_on_Yoma.25.1'],
              ['תוספות ישנים יומא כה.', 'Tosafot_Yeshanim_on_Yoma.25.1'], ['תפא״י ה, ד', 'Yachin_on_Mishnah_Middot.5.4']])
# --- the wood chamber
ez = place12('לשכת העץ — לשכת כהן גדול (פרהדרין)')
ez['tg'], ez['cam'] = [65, 16.5, -62.6], [65, 46, -61.4]
set_paras(ez, ['במודל (מ־1.5.0):', 'במודל (מגרסה 1.9.5):', '**תוספות** (יומא ח:):'], [
    '**תוספות** (יומא ח:): ״ללשכת פרהדרין שהיתה בנויה בקודש ואפילו את״ל שהיתה פתוחה לחול״. **תוספות רי״ד** (יומא כה.): ״דבתוך העזרה '
    'קיימא״. ובלשון **תוספות יום טוב**: ״שאע״פ שהיתה בנויה בקדש היתה פתוחה לחול״, ״ולא היה לזו פתח כלל אל הקדש״, ״והיו לה מעלות אשר יעלו '
    'עליה מן החול שהיא נמוך ממקומה של הלשכה שהיא בעזרה״.',
    'במודל (מגרסה 1.9.5): הלשכה בתוך העזרה, סמוכה לכותלה הצפוני — החלק הצפוני־מערבי של בניין שלוש הלשכות: במערבה של לשכת הגזית '
    'ובצפונה של לשכת הגולה, כלשון ' + G_SHILTEI + ': ״ונמצאת אומר שלשכת העץ אחורי דגזית ממש שהרי במערב שלה היא. וגם היא אחורי דגולה '
    'שהגולה היא בדרום״. פתחה היחיד — לצפון, דרך כותל העזרה, אל החיל; וחמש מעלות בעובי הכותל עולות אליה מן החיל. גגה וגג שתי האחרות — '
    'גג אחד שווה: ״קירוי אחד לשלשתן״ (רש״י יומא יט.). רוחבה מבפנים ארבע אמות (בועז: ״ובצדה למערב לשכה שלכה״פ היה רחבה ד׳ אמות, מלבד '
    'עובי כותלים שמפסיק בין גזית לפלהדרין״). אורכה, מקום הפתח בכותל, והריהוט — דירת כהן גדול לשבעת הימים — בחירת מודל. עד גרסה 1.9.4 '
    'עמדה במודל מחוץ לכותל העזרה. לשכתו השנייה של כהן גדול — בית אבטינס, בדרום (יומא יט.) — כרטיס משלה.'])
add_refs(ez, [['תוספות יומא ח:', 'Tosafot_on_Yoma.8.2'], ['תוספות רי״ד יומא כה.', 'Tosafot_Rid_on_Yoma.25.1'], ['רש״י יומא יט.', 'Rashi_on_Yoma.19.1'],
              ['בועז ה, ב', 'Boaz_on_Mishnah_Middot.5.2']])
# --- the Golah chamber
go = place12('לשכת הגולה')
go['tg'], go['cam'] = [65, 16.5, -57.2], [65, 46, -56.2]
set_paras(go, ['במודל (מ־1.5.0):', 'במודל (מגרסה 1.9.5):'], [
    'במודל (מגרסה 1.9.5): הבור, הגלגל, החבל והדלי. הלשכה היא החלק הדרומי־מערבי של בניין שלוש הלשכות שבצפון־מזרח העזרה — מאחורי לשכת '
    'הגזית, ומדרום ללשכת העץ — כלשון ' + G_SHILTEI + ': ״והיתה לשכת הגולה לדרום של גזית ולשכת העץ בצפון של גזית״; וגג אחד שווה '
    'לשלושתן. פתחה לדרום, אל העזרה. רוחבה כרוחב לשכת העץ; אורכה, מקום פתחה וגודל הבור — בחירת מודל.'])
add_refs(go, [['רש״י יומא יט.', 'Rashi_on_Yoma.19.1']])
for it, must in ((gz, 'במודל (מגרסה 1.9.5): שלוש הלשכות'), (ez, 'במודל (מגרסה 1.9.5): הלשכה בתוך העזרה'), (go, 'במודל (מגרסה 1.9.5): הבור')):
    assert it['info'].count(must) == 1 and 'במודל (מ־1.5.0)' not in it['info'], it['t']
c['LABEL_MAP']['פתח לשכת העץ — אל החיל'] = {'place': 'לשכת העץ — לשכת כהן גדול (פרהדרין)'}
# --- the views that looked at the hall's old place: the old correction's card, the students' rows
for x in c['CORRECTIONS']:
    if x['t'].startswith('לשכת הגזית — פנים הלשכה'):
        x['tg'], x['cam'] = [79, 17, -68], [79, 62, -92]
sr = row('שורות התלמידים שלפני הסנהדרין')
for o in sr['opts']:
    o['cam'], o['tg'] = [79, 44, -50], [79, 16.5, -71.5]
# --- the small gate east of Beit HaMoked (the reading the Tiferet Yisrael rejects): the Golah chamber is no longer its neighbour
OLD_SG = 'שער קטן למזרח בית המוקד, בין בית המוקד ללשכת הגולה (מקומו — בחירת מודל)'
NEW_SG = 'שער קטן למזרח בית המוקד (מקומו — בחירת מודל)'
for r_ in c['SHITOT']:
    for o in r_['opts']:
        if OLD_SG in o.get('info', ''): o['info'] = o['info'].replace(OLD_SG, NEW_SG)
for v_ in c['LABEL_MAP'].values():   # (rows_191.py copies the reading's words into two labels' cards)
    if OLD_SG in v_.get('info', ''): v_['info'] = v_['info'].replace(OLD_SG, NEW_SG)
assert OLD_SG not in json.dumps(c, ensure_ascii=False)
'''
MARK = '# ---------------------------------------------------------------- 99. WALK_SORT'
if 'THREE_CHAMBERS_195' in s:
    i0 = s.index('# ---------------------------------------------------------------- 12. THE THREE NORTHERN CHAMBERS')
    i1 = s.index(MARK)
    s = s[:i0] + PART + s[i1:]
    print('rows_200.py: part 12 rewritten')
else:
    assert s.count(MARK) == 1
    s = s.replace(MARK, PART + MARK)
    print('rows_200.py: part 12 added')
io.open(R, 'w', encoding='utf-8').write(s)

U = '/home/claude/b2src/tools/port_ui.py'
u = io.open(U, encoding='utf-8').read()
def rep(a, b):
    global u
    if b in u: return
    assert u.count(a) == 1, (u.count(a), a[:80])
    u = u.replace(a, b)
rep('OTZ_BOOKS.Rashi_on_Yoma = { book: 2157, he: "רש״י על יומא", cm: { "16,1": 493, "45,1": 1728, "52,1": 1959 } };',
    'OTZ_BOOKS.Rashi_on_Yoma = { book: 2157, he: "רש״י על יומא", cm: { "16,1": 493, "19,1": 595, "25,1": 885, "45,1": 1728, "52,1": 1959 } };')
rep('OTZ_BOOKS.Tosafot_on_Yoma = { book: 1908, he: "תוספות על יומא", cm: { "52,1": 425 } };',
    'OTZ_BOOKS.Tosafot_on_Yoma = { book: 1908, he: "תוספות על יומא", cm: { "8,2": 68, "52,1": 425 } };')
rep('OTZ_BOOKS.Tosafot_Rid_on_Yoma = { book: 2109, he: "תוספות רי״ד על יומא", cm: { "52,1": 159 } };',
    'OTZ_BOOKS.Tosafot_Rid_on_Yoma = { book: 2109, he: "תוספות רי״ד על יומא", cm: { "25,1": 76, "52,1": 159 } };\n'
    '  OTZ_BOOKS.Meiri_on_Yoma = { book: 2199, he: "בית הבחירה למאירי, יומא", cm: { "25,1": 228 } };   // 1.9.5: the three chambers\n'
    '  OTZ_BOOKS.Tosafot_Yeshanim_on_Yoma = { book: 1992, he: "תוספות ישנים על יומא", cm: { "25,1": 243 } };')
io.open(U, 'w', encoding='utf-8').write(u)
print('port_ui.py: books ok')
