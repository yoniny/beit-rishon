# the Ra'avad option's card after the second drawing of his pyre (the user, 11.11.2026 18:31). Edits b2src/tools/rows_200.py (part 11)
# and b2src/tools/port_ui.py (one book of the link table). Idempotent.
import io, sys
P = '/home/claude/b2src/tools/rows_200.py'
s = io.open(P, encoding='utf-8').read()
if 'RAAVAD_PILE2' in s:
    print('rows_200.py: already'); 
else:
    pairs = [
    ("""'המערכה גדולה מזרחה, וחזיתה מזרחה, וראשי הגזרין הפנימים היו נוגעים בתפוח״.\\n'
              '**הראב״ד** (השגות""",
     """'המערכה גדולה מזרחה, וחזיתה מזרחה, וראשי הגזרין הפנימים היו נוגעים בתפוח. ורוח היה בין הגזרין, שהיו מציתין את האליתא משם״.\\n'
              '**הראב״ד** (השגות"""),
    ("""'(מידות ג, א), והטבלה עשרים ושתיים. הגזרים אמה אורכם (זבחים סב:: ״גזירין שעשה משה – אורכן אמה״), מונחים ממזרח למערב, '
              'וראשיהם הפנימיים נוגעים בטבלה; מהלך רגלי הכהנים פנוי. המערכה הגדולה במזרח; השנייה, של הקטורת, במערב — ״מכנגד קרן מערבית '
              'דרומית, משוך מן הקרן כלפי צפון ארבע אמות״ (תמיד ב, ה). מידת הקיצוץ, אורך כל מערכה, מקום שאר המערכות וצורת הערימה — '
              'בחירות מודל.')""",
     """'(מידות ג, א), והטבלה עשרים ושתיים. הגזרים עצים מבוקעים, אמה אורכם (זבחים סב:: ״גזירין שעשה משה – אורכן אמה, ורוחבן אמה, '
              'ועוביין כמחק גודש סאה״; רמב״ם איסורי מזבח ז, ג: ״וכמותן עושין לדורות״), מונחים ממזרח למערב זה בצד זה, ורווח ביניהם, '
              'וראשיהם הפנימיים נוגעים בטבלה; מהלך רגלי הכהנים פנוי. על המערכה הגדולה שני הגזרים — שני לוחות, אמה על אמה — והאש ביניהם. '
              'המערכה הגדולה במזרח; השנייה, של הקטורת, במערב — ״מכנגד קרן מערבית דרומית, משוך מן הקרן כלפי צפון ארבע אמות״ (תמיד ב, ה).\\n'
              'הראב״ד לא פירש את צורת הערימה: מספר הגזרים, עוביים, שתי השכבות, עובי שני הלוחות, מידת קיצוץ הקרנות, אורך כל מערכה ומקום '
              'שאר המערכות — בחירות מודל.')   # RAAVAD_PILE2"""),
    ("""['מידות ג, א', 'Mishnah_Middot.3.1'], ['זבחים סב:', 'Zevachim.62b'],
              ['ברטנורא תמיד ב, ב', 'Bartenura_on_Mishnah_Tamid.2.2']]""",
     """['מידות ג, א', 'Mishnah_Middot.3.1'], ['זבחים סב:', 'Zevachim.62b'],
              ['רמב״ם איסורי מזבח ז, ג', 'Rambam_Issurei_Mizbeach.7.3'], ['ברטנורא תמיד ב, ב', 'Bartenura_on_Mishnah_Tamid.2.2']]"""),
    ]
    for a, b in pairs:
        if a not in s: print('rows_200.py: ANCHOR MISSING:', a[:80]); sys.exit(1)
        s = s.replace(a, b, 1)
    io.open(P, 'w', encoding='utf-8').write(s); print('rows_200.py: part 11 updated')
Q = '/home/claude/b2src/tools/port_ui.py'
t = io.open(Q, encoding='utf-8').read()
if 'Rambam_Issurei_Mizbeach' in t:
    print('port_ui.py: already')
else:
    a = '  OTZ_BOOKS.Raavad_on_Temidin = { book: 5256, he: "השגות הראב״ד על הלכות תמידין ומוספין", cm: { "2,7": 7 } };   // 1.9.5\n'
    if a not in t: print('port_ui.py: ANCHOR MISSING'); sys.exit(1)
    t = t.replace(a, a + '  OTZ_BOOKS.Rambam_Issurei_Mizbeach = { book: 339, he: "רמב״ם הלכות איסורי מזבח", cm: { "7,3": 100 } };   // 1.9.5: the gezirin\'s measure\n', 1)
    io.open(Q, 'w', encoding='utf-8').write(t); print('port_ui.py: book 339 added')
