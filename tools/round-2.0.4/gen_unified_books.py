#!/usr/bin/env python3
# gen_unified_books.py - 2.0.4: ONE toolbar button in the books, "פתח בתוסף בית המקדש" (the user, 11.11.2026 16:48: "אם יש ספרים
# הנמצאים בשתי הבתים תאחד ותסיר כפתורים"). Until 2.0.3 each house had its own button in 77 books and eleven books showed both.
# Otzaria allows a plugin two toolbar items, each bound to one program of at most 77 book ids: so the unified manifest carries two
# items of the SAME title on two DISJOINT programs (154 books), and the unified shell picks the house by the BOOK - and, in the eleven
# books that belong to both houses, by the links of the line being read (unified/shell.html), with the house written here as the
# default when the line has no link. The eleven places freed by the union go to the next books by the same ranking (the user's
# library, links_rank2.json on his computer, read 11.11.2026): all of them the Second Temple's (the First Temple's next ones rank far
# lower). Ezekiel and its commentaries are left out of the new ones (the user's rule: "יחזקאל הוא בית שלישי").
# Writes unified/books.json (both copies) and the rows of the new books into tools196/book_lists.json ("s_more"). Idempotent.
import json, math
LP = '/home/claude/tools196/book_lists.json'
L = json.load(open(LP, encoding='utf-8'))
S_MORE = [   # [id, title, category, linked lines, distinct source lines, lines linking out, lines linked to, lines of the book]
    [6029, 'צורת בית המקדש להתפארת ישראל', 'אחרונים', 13, 12, 13, 0, 217],
    [3791, 'ברית משה', 'מפרשים', 13, 12, 13, 0, 3682],
    [8423, 'שפתי חכמים (ברכות)', 'אחרונים', 12, 12, 12, 0, 6230],
    [6030, 'צורת בית שני', 'אחרונים', 16, 9, 16, 0, 72],
    [154, 'תלמוד ירושלמי שקלים', 'סדר מועד', 10, 14, 10, 0, 267],
    [7040, 'בני יהודא', 'מפרשים', 12, 11, 5, 7, 1724],
    [2494, 'רש"ש על יומא', 'סדר מועד', 11, 12, 6, 11, 939],
    [2885, 'באר שבע על תמיד', 'באר שבע', 10, 13, 10, 0, 202],
    [7554, 'קובץ שיטות קמאי על פסחים', 'סדר מועד', 12, 10, 12, 0, 25331],
    [156, 'תלמוד ירושלמי סוכה', 'סדר מועד', 8, 15, 8, 0, 260],
    [2989, 'רשימות שיעורים על ברכות', 'סדר זרעים', 17, 7, 16, 16, 2302],
]
L['s_more'] = S_MORE
json.dump(L, open(LP, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
rank = lambda r: math.sqrt(r[3] * r[4])
R = {r[0]: r for r in L['r']}
S = {r[0]: r for r in L['s']}
both = [i for i in R if i in S]
assert len(both) == 11, len(both)
assert not any(r[0] in R or r[0] in S for r in S_MORE) and len(S_MORE) == len(both)
out = {
    'note': 'written by tools204/gen_unified_books.py - the books of the one toolbar button: each house\'s own (its base books first), '
            'and the books of both houses with the house that opens when the line being read has no link (by the ranking)',
    'rishon': [10, 39] + [r[0] for r in L['r'] if r[0] not in S],
    'sheni': [89, 337] + [r[0] for r in L['s'] if r[0] not in R] + [r[0] for r in S_MORE],
    'common': {str(i): ('rishon' if rank(R[i]) > rank(S[i]) else 'sheni') for i in both},
}
allids = out['rishon'] + out['sheni'] + [int(i) for i in out['common']]
assert len(allids) == len(set(allids)) == 154, (len(allids), len(set(allids)))
for d in ('/home/claude/unified-wt/unified', '/home/claude/beit-rishon/unified'):
    open(d + '/books.json', 'w', encoding='utf-8').write(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
print('books.json:', len(out['rishon']), 'rishon,', len(out['sheni']), 'sheni,', len(out['common']), 'common ->', len(allids))
for i in both:
    print('  ', i, R[i][1], '| r %.1f s %.1f ->' % (rank(R[i]), rank(S[i])), out['common'][str(i)])
