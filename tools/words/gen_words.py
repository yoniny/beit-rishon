#!/usr/bin/env python3
# gen_words.py — writes src/72-words.js of BOTH houses (the search in the words of the sources + the links of the books' button) and
# the unified shell's words index. One code (words_module.js + words_match.js), two data sets:
#   B1 (beit-rishon): the verses of I Kings (10) and II Chronicles (39) that the reading table (ui_READ) maps or that a card brings
#       as a source (V(10, ch, v) / V(39, ch, v) / ["V", 10, ch, v] in src/*.js);
#   B2 (b2src): every mishnah of Middot (89) and every halacha of the Rambam's Hilchot Beit HaBechirah (337).
# The texts are the library's own (/home/claude/texts/<id> - <name>.txt: line index, reference, text), cleaned: no tags, no nikud or
# te'amim, the Name written ה׳ (as the cards write it). Run: python3 -I tools196/gen_words.py
import re, html, json, os, sys, glob

T = '/home/claude/texts'
HERE = os.path.dirname(os.path.abspath(__file__))
FILES = {10: '10 - מלכים א.txt', 39: '39 - דברי הימים ב.txt', 89: '89 - משנה מדות.txt', 337: '337 - משנה תורה, הלכות בית הבחירה.txt'}

def rows(book):
    out = []
    for l in open(os.path.join(T, FILES[book]), encoding='utf-8'):
        p = l.rstrip('\n').split('\t')
        out.append((int(p[0]), p[1], p[2] if len(p) > 2 else ''))
    return out

def clean(t):
    t = html.unescape(t)
    t = re.sub(r'\{[^}]*\}', ' ', t)                 # {פ} {ס}
    t = re.sub(r'<small>\s*\([^)]*\)\s*</small>', ' ', t)   # the edition's own references inside the Rambam's text, "(דברי הימים א כב א)": not his words
    t = re.sub(r'<[^>]+>', '', t)
    t = t.replace('־', ' ')                     # maqaf
    t = re.sub('[֑-ׇ͏]', '', t)       # nikud, te'amim, paseq, sof pasuq
    t = re.sub('[    ]', ' ', t)
    t = re.sub(r'^\s*\([א-ת]{1,3}\)\s*', '', t)      # the verse's / mishnah's own number
    t = re.sub(r'(?<![א-ת])([ולבכמשה]{0,2})יהוה(?![א-ת])', lambda m: m.group(1) + 'ה׳', t)
    t = re.sub(r"(?<![א-ת])([ולבכמשה]{0,2})ה'(?![א-ת])", lambda m: m.group(1) + 'ה׳', t)   # the Rambam's own ה'
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'\s+([,.;:])', r'\1', t)
    return t

def chapters(book):
    """heading line index of every chapter: {ch: index}, and the number of lines of each"""
    R = rows(book)
    heads = [i for i, ref, text in R if re.match(r'\s*<h2>', text)]
    base = {k + 1: h for k, h in enumerate(heads)}
    size = {k + 1: (heads[k + 1] if k + 1 < len(heads) else len(R)) - h - 1 for k, h in enumerate(heads)}
    return base, size

def windows(idx, cap=200):
    idx = sorted(set(idx))
    out = []
    for i in idx:
        if out and i - out[-1][0] + 1 <= cap:
            out[-1][1] = i
        else:
            out.append([i, i])
    return out

def js(o):
    return json.dumps(o, ensure_ascii=False, separators=(',', ':'))

def data_js(D):
    L = D.pop('L')
    head = js(D)[:-1]
    body = ',\n    '.join(js(x) for x in L)
    return head + ',"L":[\n    ' + body + '\n  ]}'

MATCH = open(os.path.join(HERE, 'words_match.js'), encoding='utf-8').read().rstrip('\n')
TEMPLATE = open(os.path.join(HERE, 'words_module.js'), encoding='utf-8').read()
assert '/*__WORDS_DATA__*/null' in TEMPLATE and '/*__WORDS_MATCH__*/' in TEMPLATE

def write(path, D):
    lines = list(D['L'])
    t = TEMPLATE.replace('/*__WORDS_DATA__*/null', data_js(dict(D))).replace('/*__WORDS_MATCH__*/', MATCH)
    open(path, 'w', encoding='utf-8').write(t)
    print(os.path.relpath(path, '/home/claude'), len(t), 'chars;', len(lines), 'lines of text')
    return lines

# ------------------------------------------------------------------ B1
B1 = '/home/claude/beit-rishon/src'
ui = open(os.path.join(B1, '70-ui.js'), encoding='utf-8').read()
blk = ui[ui.index('  var ui_READ = {'):]
blk = blk[:blk.index('\n  };') + 5]
read = {}
cur = None
for line in blk.split('\n'):
    m = re.match(r'\s*(\d+): \[', line)
    if m:
        cur = int(m.group(1)); read[cur] = []
    for m in re.finditer(r'\[(\d+), (\d+), (\d+), \{', line):
        read[cur].append(tuple(int(x) for x in m.groups()))
assert set(read) == {10, 39}, read.keys()
cited = {10: set(), 39: set()}
for f in sorted(glob.glob(os.path.join(B1, '*.js'))):
    if os.path.basename(f).startswith(('ref-', '72-', '00-')):
        continue
    s = open(f, encoding='utf-8').read()
    for m in re.finditer(r'(?:\bV|\bui_V)\((10|39),\s*(\d+),\s*(\d+)\)', s):
        cited[int(m.group(1))].add((int(m.group(2)), int(m.group(3))))
    for m in re.finditer(r'\["V",\s*(10|39),\s*(\d+),\s*(\d+)\]', s):
        cited[int(m.group(1))].add((int(m.group(2)), int(m.group(3))))
L1 = []
books1 = {}
for book, name in ((10, 'מלכים א'), (39, 'דברי הימים ב')):
    base, size = chapters(book)
    R = rows(book)
    want = set()
    for ch, a, b, in read[book]:
        for v in range(max(a, 1), min(b, size[ch]) + 1):
            want.add(base[ch] + v)
    n_read = len(want)
    for ch, v in cited[book]:
        if ch in base and 1 <= v <= size[ch]:
            want.add(base[ch] + v)
    for i in sorted(want):
        idx, ref, text = R[i]
        assert idx == i and ref, (book, i, ref)
        L1.append([book, i, clean(text)])
    books1[str(book)] = {'n': name, 't': name, 'w': windows(want)}
    print(' B1 book', book, 'verses of the reading table', n_read, '+ cited by cards ->', len(want), 'windows', books1[str(book)]['w'])
D1 = {
    'house': 'rishon', 'sec': 'חיפוש בפסוקים', 'ph': 'מילה מן הפסוק…',
    'intro': 'כותבים מילה מפסוקי הבניין שבמלכים א ובדברי הימים ב, ומגיעים אל מקומה במודל.',
    'none': 'המילים האלה לא נמצאו בפסוקי הבניין שבמלכים א ובדברי הימים ב.',
    'one': 'נמצא פסוק אחד.', 'many': 'נמצאו %n פסוקים.',
    'jump': 'לחיפוש המילים בפסוקים ↓', 'bases': 'מלכים א או דברי הימים ב',
    'books': books1, 'L': L1,
}
lines1 = write(os.path.join(B1, '72-words.js'), D1)

# ------------------------------------------------------------------ B2
B2 = '/home/claude/b2src/src'
L2 = []
books2 = {}
for book, name, title in ((89, 'מידות', 'משנה מדות'), (337, 'רמב״ם בית הבחירה', 'משנה תורה, הלכות בית הבחירה')):
    R = rows(book)
    idxs = []
    for idx, ref, text in R:
        if not ref:
            continue
        L2.append([book, idx, clean(text)])
        idxs.append(idx)
    books2[str(book)] = {'n': name, 't': title, 'w': windows(idxs)}
    print(' B2 book', book, len(idxs), 'lines; windows', books2[str(book)]['w'])
D2 = {
    'house': 'sheni', 'sec': 'חיפוש במשנה', 'ph': 'מילה מן המשנה או מן הרמב״ם…',
    'intro': 'כותבים מילה ממסכת מידות או מהלכות בית הבחירה לרמב״ם, ומגיעים אל מקומה במודל.',
    'none': 'המילים האלה לא נמצאו במסכת מידות ולא בהלכות בית הבחירה לרמב״ם.',
    'one': 'נמצא מקור אחד.', 'many': 'נמצאו %n מקורות.',
    'jump': 'לחיפוש המילים במשנה וברמב״ם ↓', 'bases': 'מסכת מידות או הלכות בית הבחירה',
    'books': books2, 'L': L2,
}
lines2 = write(os.path.join(B2, '72-words.js'), D2)

# ------------------------------------------------------------------ the unified shell's index (only what it needs: the texts, to count)
OUT = '/home/claude/unified-wt/unified/words-index.js'
idx = ('// words-index.js — GENERATED by tools196/gen_words.py (the same lines as the houses\' src/72-words.js; the matcher is the same text).\n'
       '// The unified shell counts with it in which house the words of Otzaria\'s search field are found, without loading a house.\n'
       '(function () {\n  "use strict";\n' + MATCH + '\n'
       '  var TEXTS = {\n    rishon: ' + js([x[2] for x in lines1]) + ',\n    sheni: ' + js([x[2] for x in lines2]) + '\n  };\n'
       '  var PREP = {};\n'
       '  window.__tmWordsCount = function (house, text) {\n'
       '    var q = wordsNorm(text), n = 0;\n'
       '    if (!TEXTS[house] || q.replace(/ /g, "").length < 2) return 0;\n'
       '    var P = PREP[house] || (PREP[house] = TEXTS[house].map(wordsPrep));\n'
       '    for (var i = 0; i < P.length; i++) if (wordsFind(P[i], q)) n++;\n'
       '    return n;\n'
       '  };\n})();\n')
open(OUT, 'w', encoding='utf-8').write(idx)
print(os.path.relpath(OUT, '/home/claude'), len(idx), 'chars')
