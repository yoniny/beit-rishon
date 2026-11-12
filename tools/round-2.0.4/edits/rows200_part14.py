# -*- coding: utf-8 -*-
# B2 1.9.5 - the default reading's two gezirin by the Gemara's measure (40-altar.js: tools204/b2_gezirin_default.py). Idempotent: writes
# part 14 into b2src/tools/rows_200.py (one sentence in the card of the row "מניין המערכות", option "רבי יוסי — שלוש", and its refs).
import io
R = '/home/claude/b2src/tools/rows_200.py'
s = io.open(R, encoding='utf-8').read()
PART = r'''# ---------------------------------------------------------------- 14. THE DEFAULT READING'S TWO GEZIRIN BY THE GEMARA'S MEASURE (GEZIRIN_DEFAULT_195)
# The user (11.11.2026, 22:00), asked whether the default reading keeps two long beams while the Gemara and the Rambam give the measure:
# "מה שכתוב במקורות הוא הנכון". Geometry: tools204/b2_gezirin_default.py. The texts as read in his library (LIB_1111.md "~18:50"):
# Zevachim 62b (130:2117), the Rambam Issurei Mizbeach 7:3 (339:100), Temidin uMusafin 2:2 (344:17).
_mr = row('מניין המערכות')
_o = _mr['opts'][0]
assert _o['t'] == 'רבי יוסי — שלוש', _o['t']
_GZ = ('על המערכה הגדולה שני הגזרים שמעלים עם התמיד (רמב״ם תמידין ומוספין ב, ב: ״מצוה להעלות שני גזרים של עץ עם תמיד של שחר יותר '
       'על עצי המערכה״) — שני לוחות, אמה על אמה: ״גזירין שעשה משה – אורכן אמה, ורוחבן אמה, ועוביין כמחק גודש סאה״ (זבחים סב:); '
       '״וכמותן עושין לדורות״ (רמב״ם איסורי מזבח ז, ג). עוביים ומקומם על המערכה — בחירת מודל. ')
_ANCH = 'גודלן, וכמה דרומה עומדת הגדולה — בחירת מודל.'
# the sentence stands AFTER the model's last sentence: rows_198.py looks for its own paragraph whole (Y_NEW), so nothing goes inside it
if _GZ + _ANCH in _o['info']:
    _o['info'] = _o['info'].replace(_GZ + _ANCH, _ANCH + ' ' + _GZ.strip())
elif 'שני הגזרים שמעלים עם התמיד' not in _o['info']:
    assert _o['info'].count(_ANCH) == 1
    _o['info'] = _o['info'].replace(_ANCH, _ANCH + ' ' + _GZ.strip())
assert _o['info'].count('שני הגזרים שמעלים עם התמיד') == 1
for _r in (['רמב״ם תמידין ומוספין ב, ב', 'Mishneh_Torah,_Daily_Offerings_and_Additional_Offerings.2.2'], ['זבחים סב:', 'Zevachim.62b'],
           ['רמב״ם איסורי מזבח ז, ג', 'Rambam_Issurei_Mizbeach.7.3']):
    if _r not in _o['refs']:
        _o['refs'].append(_r)
'''
MARK = '# ---------------------------------------------------------------- 99. WALK_SORT'
if 'GEZIRIN_DEFAULT_195' in s:
    i0 = s.index("# ---------------------------------------------------------------- 14. THE DEFAULT READING'S TWO GEZIRIN")
    import re as _re
    _m = _re.search(r'\n# -{60,} \d+\. ', s[i0 + 10:])
    i1 = i0 + 10 + _m.start() + 1 if _m else s.index(MARK)
    s = s[:i0] + PART + s[i1:]
    print('part 14 replaced')
else:
    assert s.count(MARK) == 1
    s = s.replace(MARK, PART + MARK)
    print('part 14 inserted')
io.open(R, 'w', encoding='utf-8').write(s)
