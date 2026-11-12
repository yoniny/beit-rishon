# -*- coding: utf-8 -*-
# one-off editor: part 9 of b2src/tools/rows_200.py - from "ONE DRAWING OF THE FIFTEEN STEPS" to "TWO READINGS, THE RAMBAM THE DEFAULT"
import io
P = '/home/claude/b2src/tools/rows_200.py'
s = io.open(P, encoding='utf-8').read()
a = s.index('# ---------------------------------------------------------------- 9. ONE DRAWING OF THE FIFTEEN STEPS (STEPS_ONE)') if 'STEPS_ONE' in s else s.index('# ---------------------------------------------------------------- 9. THE FIFTEEN STEPS: TWO READINGS')
b = s.index("# the menorah's card: the Gemara's word (part 1 above)")
NEW = r'''# ---------------------------------------------------------------- 9. THE FIFTEEN STEPS: TWO READINGS, THE RAMBAM THE DEFAULT (STEPS_TWO)
# The user (11.11.2026, 16:06): "יוצא היום שאין הבדל בין המאירי לראש במעלות של שער ניקנור... צריך לאחד אותם"; (16:31): "רחב במעלות" - so
# the steps became ONE wide drawing (the Rid's length, the Meiri's shape). Then the Rambam's commentary on Middot 2:5 was read in his
# library (book 573, line 25) - "לא היו ארוכים כשאר המעלות... אלא היתה כל מעלה כמו חצי עגולה" - and he was told; (17:11): "מעלות שתי
# קריאות רמבם ברירת מחדל". So the row "חמש עשרה המעלות — צורתן" (made anew by rows_198.py and renamed by part 8 on every run) is
# rewritten here whole: o0 (the default) the Rambam's half discs before the gate, o1 the Rid and R. Yehonatan's long steps (as built
# for the one drawing; their length follows the place of the four chambers). Geometry: 30-courts.js, ctx2.shared.steps15 ("rambam" |
# "rid"). Every quote was read in his library on 11.11.2026 (LIB_1111.md): Middot 2:5 (89:16), the Rambam's commentary (573:25), Beit
# HaBechirah 6:2 (337:95), the Rid and R. Yehonatan (7576:355, 353), the Meiri (6033:35), the Rosh (6035:32).
STEPS_ROW = 'חמש עשרה המעלות — צורתן'
S_LEAD = ('לשון המשנה (מידות ב, ה): ״וחמש עשרה מעלות עולות מתוכה לעזרת ישראל, כנגד חמש עשרה מעלות שבתהלים, שעליהן הלוים אומרים בשיר. '
          'לא היו טרוטות, אלא מקפות כחצי גרן עגלה״.')
S_RAMBAM = ('**הרמב״ם** (פירוש המשניות, מידות ב, ה): ״שמעלות עזרת נשים לא היו ארוכים כשאר המעלות כמו שהוא מפורסם היום מצורת המדרגות '
            'אלא היתה כל מעלה כמו חצי עגולה עד שתהא כל מעלה חצי גורן כזה״ (הציור שבמקום זה אינו בנוסח שבספרייה), ״ולפיכך היתה צורת '
            'המעלה כמי שלקח קצת אצטבא ונתן אותה על המעלה עד שמשלים צורת הסולם וזה אי אפשר לציירו בפשוט אבל יובן בקירוב״. ובבית הבחירה '
            '(ו, ב): ״רום כל מעלה חצי אמה ושלחה חצי אמה״.')
S_RID = ('**פסקי הרי״ד** (סוכה נג.): ״וכל מעלה היתה גבוהה חצי אמה ורחבה חצי אמה כדתנן במידות... ואורך המעלה היה קל״ה אמה כרוחב העזרה '
         'מכותל לכותל״. **רבינו יהונתן מלוניל** (סוכה נא:): ״אורך המעלה כרוחב העזרה, ורוחב המעלה חצי אמה ורומה חצי אמה״.')
S_MEIRI = ('**המאירי:** ״מוקפות כחצי גורן, שהתחתונה קצרה, והשניה עודפת לה משני קצותיה, וכן שלישית לשניה, וכלם על סדר זה, עד שכשהיו כלם '
           'מסודרות בסדר זה היתה צורתם דומה להקף של חצי גורן״.')
S_ROSH = ('**הרא״ש:** ״אלא מוקפות כחצי גורן עגולה. כזו״ — וצייר חצאי עיגולים, זה בתוך זה. בציורו אין סימן לאיזה צד פונות המעלות, '
          'ולא איזו מעלה היא הגבוהה.')
S_MODEL_RAMBAM = ('חמישה עשר חצאי עיגולים לפני שער ניקנור, כל אחד מונח על זה שמתחתיו; העליון הוא הקטן, וכל מעלה שמתחתיו רחבה ממנו '
                  'בחצי אמה. רדיוס המעלה העליונה חמש עשרה אמה — השער ושני פשפשיו עומדים עליה — ושל התחתונה עשרים ושתיים. חמש המעלות '
                  'התחתונות נקטעות אצל כותלי שתי הלשכות הקטנות שמצדי השער. מידות הרדיוס והקטיעה — בחירות מודל.')
S_MODEL_RID = ('מעלות ישרות לאורך כותל המערב של עזרת נשים. התחתונה היא הקצרה, וכל מעלה שמעליה עודפת עליה משני קצותיה; קצות המעלות '
               'על קשת — כחצי גורן. כשארבע הלשכות במקצועות העזרה מבפנים (ברירת המחדל), המעלות בין שתי הלשכות הקטנות שמצדי שער ניקנור — '
               'העליונה שלושים ותשע אמה. כשהלשכות מבחוץ (הרא״ש, במתג ״ארבע לשכות עזרת נשים — מקומן״), המעלה העליונה מכותל לכותל, מאה '
               'שלושים וחמש אמה, ושתי הלשכות הקטנות עומדות בתוך המעלות. הקשת, אורך המעלה התחתונה, והיות המעלות ישרות — בחירות מודל.')
S_REFS = [['מידות ב, ה', 'Mishnah_Middot.2.5'], ['פירוש המשניות לרמב״ם מידות ב, ה', 'Rambam_Commentary_on_Middot.2.5'],
          ['רמב״ם בית הבחירה ו, ב', 'Mishneh_Torah,_The_Chosen_Temple.6.2'],
          ['פסקי הרי״ד סוכה נג.', 'Kovetz_Shitot_Kamai_Middot.53.1'], ['רבינו יהונתן סוכה נא:', 'Kovetz_Shitot_Kamai_Middot.51.2'],
          ['מאירי מידות ב, ה', 'Meiri_on_Middot.2.5'], ['הרא״ש מידות ב, ה', 'Rosh_on_Mishnah_Middot.2.5'], ['מידות ב, ג', 'Mishnah_Middot.2.3']]
S_CAM_R, S_TG_R = [141, 33, 37], [104, 9.5, 5]      # the half discs, from the south-east, the gate right of the middle (the card stands at the left)
S_CAM_W, S_TG_W = [150, 44, 34], [100, 9.5, 0]      # the long steps
srow = row(STEPS_ROW)
srow['pickJs'] = 'const S = ctx.shared.steps15; if (S && typeof S.set === "function") S.set(k === "o1" ? "rid" : "rambam");'
srow['opts'] = [
    {'t': 'הרמב״ם — כל מעלה חצי עיגול, לפני השער', 'init': True, 'drawn': True, 'refs': S_REFS, 'cam': S_CAM_R, 'tg': S_TG_R,
     'info': (S_LEAD + '\n' + S_RAMBAM + '\n'
              'במודל (ברירת המחדל): ' + S_MODEL_RAMBAM)},
    {'t': 'הרי״ד ורבינו יהונתן — מעלות ארוכות, כרוחב העזרה', 'drawn': True, 'refs': S_REFS, 'cam': S_CAM_W, 'tg': S_TG_W,
     'info': (S_LEAD + '\n' + S_RID + '\n' + S_MEIRI + '\n'
              'הרי״ד ורבינו יהונתן כתבו את אורך המעלות ולא את צורתן; המאירי כתב את צורתן ולא את אורכן. בקריאה זו הן מצוירות יחד.\n'
              'במודל: ' + S_MODEL_RID)},
]
sp15['info'] = (S_LEAD + '\n'
                'בקצרה — המחלוקת בכרטיס זה (הפירוט — במתג ״חמש עשרה המעלות — צורתן״ שבקטגוריית ״שיטות ומחלוקות״):\n'
                '• לרמב״ם — המעלות אינן ארוכות; כל מעלה חצי עיגול, זו על גבי זו, לפני השער (ברירת המחדל).\n'
                '• לרי״ד ולרבינו יהונתן — אורך המעלה כרוחב העזרה, מכותל לכותל.\n'
                + S_RAMBAM + '\n' + S_RID + '\n' + S_MEIRI + '\n' + S_ROSH + '\n'
                'במודל (ברירת המחדל, הרמב״ם): ' + S_MODEL_RAMBAM)
sp15['refs'] = S_REFS
sp15['cam'], sp15['tg'] = S_CAM_R, S_TG_R
sp15['camJs'] = '() => (ctx.shared.steps15 && ctx.shared.steps15.mode === "rid" ? %s : %s)' % (json.dumps(S_CAM_W), json.dumps(S_CAM_R))
sp15['tgJs'] = '() => (ctx.shared.steps15 && ctx.shared.steps15.mode === "rid" ? %s : %s)' % (json.dumps(S_TG_W), json.dumps(S_TG_R))
cr15 = row('ארבע לשכות עזרת נשים — מקומן')
ADD_OUT = (' ובקריאת הרי״ד שבמתג ״חמש עשרה המעלות — צורתן״, המעלה העליונה היא אז מכותל לכותל, מאה שלושים וחמש אמה — כלשונו (פסקי הרי״ד, '
           'סוכה נג.): ״ואורך המעלה היה קל״ה אמה כרוחב העזרה מכותל לכותל״.')
if ADD_OUT not in cr15['opts'][1]['info']: cr15['opts'][1]['info'] += ADD_OUT
o_ = cr15['opts'][1]
if not any(x[1] == 'Kovetz_Shitot_Kamai_Middot.53.1' for x in o_['refs']): o_['refs'] = o_['refs'] + [['פסקי הרי״ד סוכה נג.', 'Kovetz_Shitot_Kamai_Middot.53.1']]
for k_ in ('חמש עשרה המעלות — מוקפות כחצי גורן (המאירי)', 'חמש עשרה המעלות — מכותל לכותל, קל״ה אמה (הרא״ש והרי״ד)',
           'חמש עשרה המעלות — כחצי גורן עגולה, כציור הרא״ש'):
    c['LABEL_MAP'].pop(k_, None)
c['LABEL_MAP']['חמש עשרה המעלות — כחצי גורן'] = {'place': sp15['t']}
for a_, b_ in (('וחמש עשרה המעלות, מוקפות כחצי גורן כדברי המאירי, אל שער ניקנור', 'וחמש עשרה המעלות, מוקפות כחצי גורן, אל שער ניקנור'),
               ('וחמש עשרה המעלות העגולות אל שער ניקנור', 'וחמש עשרה המעלות, מוקפות כחצי גורן, אל שער ניקנור')):
    c['INFO']['ezratNashim'] = c['INFO']['ezratNashim'].replace(a_, b_)
EZ15 = 'חמש עשרה המעלות: לרמב״ם — כל מעלה חצי עיגול, לפני השער (ברירת המחדל); ולרי״ד ולרבינו יהונתן — ארוכות, כרוחב העזרה (בטבלת השיטות).'
c['INFO']['ezratNashim'] = '\n'.join(p_ for p_ in c['INFO']['ezratNashim'].split('\n')
                                     if not p_.startswith('בקצרה — למאירי התחתונה היא הקצרה') and not p_.startswith('חמש עשרה המעלות: לרמב״ם'))
_ps = c['INFO']['ezratNashim'].split('\n')
_i = next((k for k, p_ in enumerate(_ps) if p_.startswith('מקום ארבע הלשכות: לתוספות יום טוב')), len(_ps) - 1)
_ps.insert(_i + 1, EZ15)
c['INFO']['ezratNashim'] = '\n'.join(_ps)
for r_ in (['פירוש המשניות לרמב״ם מידות ב, ה', 'Rambam_Commentary_on_Middot.2.5'], ['פסקי הרי״ד סוכה נג.', 'Kovetz_Shitot_Kamai_Middot.53.1']):
    if not any(x[1] == r_[1] for x in c['REFS']['ezratNashim']): c['REFS']['ezratNashim'].append(r_)
'''
s = s[:a] + NEW + s[b:]
io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('rows_200.py part 9 rewritten')
