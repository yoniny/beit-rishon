# -*- coding: utf-8 -*-
# B2 1.9.5 - the row "כיוון המנורה" (the user, 11.11.2026, 22:15: "שתוסיף את שיטת רבי בקוד עצמו… במבנה הפשוט של התוסף").
# Idempotent. Writes: part 15 of b2src/tools/rows_200.py (the row and its two cards), the row's place in the walk order (rows_198.py
# WANT_ROWS), its one line for the cards' "בקצרה" (cards_196.py ROWB), the cards that show it (port_ui.py OPS_P) and the books of its
# sources (port_ui.py OTZ_BOOKS). Geometry: tools204/b2_menorah_dir.py. Every quotation as read in the user's library on 11.11.2026
# (qa/fs/LIB_1111.md, "22:35–22:42").
import io
T = '/home/claude/b2src/tools/'
def edit(name, fn):
    p = T + name
    s = io.open(p, encoding='utf-8').read()
    s2 = fn(s)
    if s2 != s:
        io.open(p, 'w', encoding='utf-8').write(s2)
        print(name, 'edited')
    else:
        print(name, 'unchanged')

PART = r'''# ---------------------------------------------------------------- 15. THE MENORAH'S DIRECTION: THE RAMBAM (NORTH-SOUTH) / RABBI (EAST-WEST) (MENORAH_DIR_195)
# The user (11.11.2026, 22:15): "שתוסיף את שיטת רבי בקוד עצמו… במבנה הפשוט של התוסף". Geometry: tools204/b2_menorah_dir.py
# (ctx.shared.menorahDir). The texts as read in his library (LIB_1111.md "22:35–22:42").
_MD = 'כיוון המנורה והשולחן'
_MD_OLD = 'כיוון המנורה'   # the row's first name (before the third reading)
_md_refs0 = [['מנחות צח:', 'Menachot.98b'], ['רמב״ם בית הבחירה ג, יב', 'Mishneh_Torah,_The_Chosen_Temple.3.12'],
             ['רמב״ם בית הבחירה ג, ח', 'Mishneh_Torah,_The_Chosen_Temple.3.8'], ['רש״י שבת כב:', 'Rashi_on_Shabbat.22.2'],
             ['כסף משנה בית הבחירה ג, יב', 'Kesef_Mishneh_on_Beit_HaBechira.3.12']]
_md_refs1 = [['מנחות צח:', 'Menachot.98b'], ['רש״י מנחות צח:', 'Rashi_on_Menachot.98.2'], ['השגות הראב״ד בית הבחירה ג, יב', 'Raavad_on_Beit_HaBechira.3.12'],
             ['תוספות מנחות צח:', 'Tosafot_on_Menachot.98.2'], ['תמיד ג, ט', 'Mishnah_Tamid.3.9'], ['ברטנורא תמיד ג, ט', 'Bartenura_on_Mishnah_Tamid.3.9'],
             ['כסף משנה בית הבחירה ג, יב', 'Kesef_Mishneh_on_Beit_HaBechira.3.12'], ['רש״י שבת כב:', 'Rashi_on_Shabbat.22.2'],
             ['תפא״י תמיד ג, ט', 'Yachin_on_Mishnah_Tamid.3.9']]
# from the east and above: the menorah (south) and the table (north) together, so that the turn of each is seen
_md_cam = {'cam': [-25.5, 34.5, 0], 'tg': [-37, 25.3, 0],
           'camJs': '[-7, LV.HEI + houseRise(-37) + 13, 0]', 'tgJs': '[-37, LV.HEI + houseRise(-37) + 1.5, 0]', 'drawn': True}
_md_o0 = dict(_md_cam, t='הרמב״ם — מנורה צפון ודרום', init=True, refs=_md_refs0, info=(
    'בגמרא (מנחות צח:): ״תנו רבנן: מזרח ומערב היו מונחין, דברי רבי. רבי אלעזר ברבי שמעון אומר: צפון ודרום. מאי טעמא דרבי? גמר ממנורה – '
    'מה מנורה מזרח ומערב, אף הני נמי מזרח ומערב״. ורבי אלעזר ברבי שמעון משיב — ״מנורה גופה צפון ודרום הוה מנחה״; והכתוב ״יערך אתו״ — ״דמצדד '
    'להו אצדודי. דתניא: ׳אל מול פני המנורה יאירו שבעת הנרות׳ – מלמד שהיו מצדדין פניהם כלפי נר אמצעי״.\n'
    '**הרמב״ם** (בית הבחירה ג, יב): ״וכן נרות המנורה כנגד רחב הבית בין הצפון ובין הדרום״; (ג, ח): ״ששת הנרות הקבועים בששת הקנים היוצאים '
    'מן המנורה כלן פניהם לנר האמצעי שעל קני המנורה וזה הנר האמצעי פניו כנגד קדש הקדשים והוא הנקרא נר מערבי״.\n'
    '**רש״י** (שבת כב:): ״ולמ״ד צפון ודרום מונחים אמצעי קרי מערבי על שם שהיה פיו כנגד מערב וכל שאר הנרות כלפי האמצעית״.\n'
    '**כסף משנה** (בית הבחירה ג, יב): אף שהלכה כרבי מחברו — ״פסק רבינו כר\' אלעזר בר\' שמעון משום דקרא דאל מול פני המנורה יאירו שבעת '
    'הנרות מסייע ליה״.\n'
    'במודל — ברירת המחדל, כפסק הרמב״ם: קני המנורה ונרותיה מצפון לדרום, לרוחב הבית; והשולחן — ״והיה מנח ארכו לארך הבית ורחבו '
    'לרחב הבית״ (שם ג, יב), כרבי.'))
_md_o1 = dict(_md_cam, t='רבי — מזרח ומערב', refs=_md_refs1, info=(
    '**רבי** (מנחות צח:): ״מה מנורה מזרח ומערב״ — רש״י: ״השלשה קנים במזרח והשלשה במערב״. וראייתו: ״ומנורה גופה מנלן? מדכתיב בנר מערבי '
    '׳יערך אתו [אהרן וגו׳] לפני ה׳׳ – מכלל דכולהו לאו ׳לפני ה׳׳, ואי סלקא דעתך צפון ודרום, כולהו נמי ׳לפני ה׳׳ נינהו״.\n'
    '**הראב״ד** (בית הבחירה ג, יב), על דברי הרמב״ם: ״זהו מחלוקת התנאים וסדר התמיד אינו כן שהרי שנינו מצא שתי נרות מזרחיות דולקים וזהו '
    'לענין מזרח ומערב מונחים״.\n'
    '**תוספות** (מנחות צח:): ״ומתניתין דתמיד (פ״ג מ״ט) דמצא שתי מזרחיות דולקות כרבי דאמר מזרח ומערב מונחין דלמאן דאמר צפון ודרום מונחין '
    'אין שייך מזרחיות״.\n'
    '**ברטנורא** (תמיד ג, ט): ״האי תנא סבר מנורה מזרח ומערב היא מנחת״.\n'
    '**כסף משנה** (בית הבחירה ג, יב), ביישוב דברי הרמב״ם: ״שהוא סובר שמשנה זו כרבי ולא קי״ל כוותיה וכ״כ רבינו בפירוש המשנה״.\n'
    'בקצרה — איזהו ״נר מערבי״ לשיטה זו: **רש״י** בשבת (כב:) — ״נר שני שבצד החיצון שהוא במזרח״; **רש״י** במנחות (צח:) — ״והחיצון של צד '
    'מערב קרי ליה נר מערבי״; **תוספות** (שם) — ״נר שני של שתי מזרחיות קרי נר מערבי״; **תפארת ישראל** (תמיד ג, ט) מעיר על הסתירה שבדברי '
    'רש״י.\n'
    'במודל: המנורה מסובבת — קניה ונרותיה ממזרח למערב, לאורך הבית; והאבן שלפניה מצפונה, לצד פנים ההיכל. מקום האבן בשיטה זו — בחירת '
    'מודל. השולחן — ארכו לאורך הבית, כבברירת המחדל: הרמב״ם פוסק בו כרבי.'))
_md_refs2 = [['מנחות צח:', 'Menachot.98b'], ['רש״י מנחות צח:', 'Rashi_on_Menachot.98.2'], ['רמב״ם בית הבחירה ג, יב', 'Mishneh_Torah,_The_Chosen_Temple.3.12']]
_md_o2 = dict(_md_cam, t='רבי אלעזר ברבי שמעון — צפון ודרום', refs=_md_refs2, info=(
    '**רבי אלעזר ברבי שמעון** (מנחות צח:): ״צפון ודרום״. ״מאי טעמא? גמר מארון: מה ארון צפון ודרום, אף הני נמי צפון ודרום״ — רש״י: '
    '״אורכו לרוחבו של בית״. ועל המנורה: ״מנורה גופה צפון ודרום הוה מנחה״.\n'
    'במודל: גם השולחן מסובב — ארכו מצפון לדרום, לרוחב הבית; והמנורה צפון ודרום, כבברירת המחדל.\n'
    'בקצרה — **הרמב״ם** (בית הבחירה ג, יב) פוסק בשולחן כרבי — ״והיה מנח ארכו לארך הבית ורחבו לרחב הבית״ — ובנרות המנורה: ״בין '
    'הצפון ובין הדרום״.'))
_md_pick = ('const L = ["rambam", "rabbi", "rashbash"][+k.slice(1)] || "rambam"; '
            'if (ctx.shared.menorahDir && typeof ctx.shared.menorahDir.set === "function") ctx.shared.menorahDir.set(L === "rabbi" ? "ew" : "ns"); '
            'if (ctx.shared.tableDir && typeof ctx.shared.tableDir.set === "function") ctx.shared.tableDir.set(L === "rashbash" ? "ns" : "ew");')
_k = [i for i, r in enumerate(c['SHITOT']) if r['t'] in (_MD, _MD_OLD)]
if _k:
    c['SHITOT'][_k[0]] = {'t': _MD, 'pickJs': _md_pick, 'opts': [_md_o0, _md_o1, _md_o2]}
else:
    _i = [i for i, r in enumerate(c['SHITOT']) if r['t'] == 'חומר המנורה והשולחן'][0]
    c['SHITOT'].insert(_i + 1, {'t': _MD, 'pickJs': _md_pick, 'opts': [_md_o0, _md_o1, _md_o2]})
'''
MARK = '# ---------------------------------------------------------------- 99. WALK_SORT'
def f_rows200(s):
    if 'MENORAH_DIR_195' in s:
        i0 = s.index("# ---------------------------------------------------------------- 15. THE MENORAH'S DIRECTION")
        import re as _re
        _m = _re.search(r'\n# -{60,} \d+\. ', s[i0 + 10:])
        i1 = i0 + 10 + _m.start() + 1 if _m else s.index(MARK)
        return s[:i0] + PART + s[i1:]
    assert s.count(MARK) == 1
    return s.replace(MARK, PART + MARK)
edit('rows_200.py', f_rows200)

def f_rows198(s):
    if "'חומר המנורה', 'כיוון המנורה'," in s:
        return s
    a = "'דלתות ההיכל', 'חומר המנורה',\n"
    assert s.count(a) == 1, s.count(a)
    return s.replace(a, "'דלתות ההיכל', 'חומר המנורה', 'כיוון המנורה',\n")
edit('rows_198.py', f_rows198)

def f_cards(s):
    if "'כיוון המנורה והשולחן':" in s:
        return s
    if "'כיוון המנורה':" in s:   # the row's first name: the line is written again under the new one
        i = s.index("    'כיוון המנורה':")
        s = s[:i] + s[s.index("\n", i) + 1:]
    a = "    'שערי עזרת נשים': 'במשנה ובמפרשים — שער במזרח בלבד (ברירת המחדל); ליוסף בן מתתיהו — גם בצפון ובדרום.',\n"
    assert s.count(a) == 1, s.count(a)
    return s.replace(a, "    'כיוון המנורה והשולחן': 'לרמב״ם — המנורה צפון ודרום והשולחן מזרח ומערב (ברירת המחדל); לרבי — שניהם מזרח ומערב (מנחות צח:), "
                        "וכמותו משנת תמיד לפי הראב״ד, התוספות והברטנורא; לרבי אלעזר ברבי שמעון — שניהם צפון ודרום.',\n" + a)
edit('cards_196.py', f_cards)

def f_port(s):
    a = '"המנורה": rows_for(has("חומר המנורה")), "שולחן לחם הפנים": rows_for(has("חומר המנורה")), "הקודש": rows_for(has("חומר המנורה", "דלתות ההיכל", "הדרך מן הפשפש")),'
    if a in s:
        s = s.replace(a, '"המנורה": rows_for(has("חומר המנורה", "כיוון המנורה")), "שולחן לחם הפנים": rows_for(has("חומר המנורה")), "הקודש": rows_for(has("חומר המנורה", "כיוון המנורה", "דלתות ההיכל", "הדרך מן הפשפש")),')
    t0 = '"שולחן לחם הפנים": rows_for(has("חומר המנורה")),'
    if t0 in s:   # the third reading turns the table: its card shows the row too
        s = s.replace(t0, '"שולחן לחם הפנים": rows_for(has("חומר המנורה", "כיוון המנורה")),')
    assert 'rows_for(has("חומר המנורה", "כיוון המנורה"))' in s
    b = '  OTZ_BOOKS.Rashi_on_Menachot = { book: 2186, he: "רש״י על מנחות", cm: { "99,1": 4703, "98,1": 4648 } };\n'
    if b in s:
        s = s.replace(b, '  OTZ_BOOKS.Rashi_on_Menachot = { book: 2186, he: "רש״י על מנחות", cm: { "99,1": 4703, "98,1": 4648, "98,2": 4681 } };\n'
                         '  // 1.9.5: the menorah\'s direction (the row "כיוון המנורה")\n'
                         '  OTZ_BOOKS.Tosafot_on_Menachot = { book: 1933, he: "תוספות על מנחות", cm: { "98,2": 1167 } };\n'
                         '  OTZ_BOOKS.Rashi_on_Shabbat = { book: 2156, he: "רש״י על שבת", cm: { "22,2": 1043 } };\n'
                         '  OTZ_BOOKS.Kesef_Mishneh_on_Beit_HaBechira = { book: 4260, he: "כסף משנה על הלכות בית הבחירה", cm: { "3,12": 147 } };\n')
    assert 'OTZ_BOOKS.Tosafot_on_Menachot' in s
    d = '  OTZ_BOOKS.Raavad_on_Beit_HaBechira = { book: 5252, he: "השגות הראב״ד על הלכות בית הבחירה", cm: { "4,9": 29, "4,11": 33 } };\n'
    if d in s:
        s = s.replace(d, '  OTZ_BOOKS.Raavad_on_Beit_HaBechira = { book: 5252, he: "השגות הראב״ד על הלכות בית הבחירה", cm: { "3,12": 18, "4,9": 29, "4,11": 33 } };\n')
    assert '"3,12": 18' in s
    return s
edit('port_ui.py', f_port)
