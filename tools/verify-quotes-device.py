#!/usr/bin/env python3
# tools/verify-quotes-device.py - the half of tools/verify-quotes.py that runs NEXT TO the Otzaria library (read-only).
#
# It is also imported by verify-quotes.py for the normalisation, so there is one definition of "the same text".
#
# Usage on the machine that holds the library (seforim.db; default ~/mnt/otzaria/books/seforim.db, or $OTZ_DB):
#   python3 verify-quotes-device.py < batch.json  > result.json
#   python3 verify-quotes-device.py --dir D [--budget 40]     the batches D/NNN.json, until the budget ends; the answers go to D/NNN.<time>.out.json and
#                                                             what is not done stays in NNN.json - run again to go on (nothing is ever deleted)
# Input  (made by `verify-quotes.py plan`): {"q": {"<qid>": ["<segment>", ...]}, "t": [[[<bookId>, ...], ["<qid>", ...]], ...],     every quote of a group in every book of the group
#                                             "ptr": [[book, index, "label"], ...], "find": ["name", ...], "budget": 35}
# Output: {"r": {"<qid>|<bookId>": [<per-segment result>, ...]}   only the lookups that found something (a "not found" is not listed),
#          "cov": {"<bookId>": ["<qid>", ...]}                    the lookups that were done (the rest are still to do),
#          "ptr": {"<book>:<index>": [heRef, "start of the line"] | null}, "find": {"name": [[id, title], ...]}, "titles": {...}}
# Books are cached after the first read ($VQ_CACHE, default ~/otz/vqcache) - normalising a big book takes a second, the cache 0.05 s.
# Per-segment result: ["e", [[lineIndex, heRef], ...]]   exact (after normalisation)
#                     ["s", [[lineIndex, heRef], ...]]   same except plene/defective spelling (the letters vav and yod)
#                     ["m", lineIndex, heRef, "window of the book's text", "what differs"]   near miss
#                     ["n"]                              not in this book
# Every command is short: books are decompressed one at a time and the loop stops at "budget" seconds, returning what is left in "p".
import sys, os, re, json, time, sqlite3, bisect, difflib, glob

NORM_VERSION = '2'      # bump when norm() changes: the cached books are named after it
NIKUD = re.compile('[֑-ׇ]')
TAGS = re.compile(r'<[^>]+>')
NUMPAREN = re.compile(r'[\(\[\{]\s*[א-ת]{1,3}[׳\']?\s*[\)\]\}]')   # "(א)" line numbers inside the library text
DELETE = re.compile('[״׳"\'’‘“”`´‎‏‪-‮⁦-⁩﻿]')
NONHEB = re.compile('[^א-ת ]')
FINAL = str.maketrans('ךםןףץ', 'כמנפצ')


def norm(s):
    """Text -> plain Hebrew letters and single spaces: no tags, nikud, ta'amim, gershayim/geresh/quotes, punctuation, digits, line numbers;
    maqaf, hyphens and dashes become spaces; final letters folded."""
    if not s:
        return ''
    s = TAGS.sub(' ', s)
    s = s.replace('&nbsp;', ' ').replace('&quot;', '"').replace('&amp;', '&').replace('&#39;', "'")
    s = s.replace('־', ' ').replace('‑', ' ')
    s = NIKUD.sub('', s)
    s = NUMPAREN.sub(' ', s)
    s = DELETE.sub('', s)
    s = NONHEB.sub(' ', s)
    s = s.translate(FINAL)
    s = re.sub(r'\s+', ' ', s).strip()
    # the Name as written in the library (the four letters) = as abbreviated in the code (ה׳); elokim/elohim spelled with kof = with he
    s = re.sub(r'(?:^| )יהוה(?= |$)', ' ה', s)
    s = re.sub(r'(?:^| )(ו?[בכלמש]?)אלק(?=[א-ת])', lambda m: ' ' + m.group(1) + 'אלה', s)
    return s.strip()


def skel(n):
    """Plene/defective spelling folded: the letters vav and yod removed from an already normalised text."""
    return re.sub(r'\s+', ' ', n.replace('ו', '').replace('י', '')).strip()


def segments(q):
    """A quote -> its parts: "...", an ellipsis, a bracketed insertion or a spaced dash (the code's own gloss: ״text — gloss״) cut it."""
    parts = [p for p in re.split(r'\.\.\.|…|\[[^\]]*\]|\s[\u2014\u2013]\s', q)]
    out = [norm(p) for p in parts]
    out = [p for p in out if p]
    return out


# ---------------------------------------------------------------------------------------------------------------- library access
def open_db():
    import zstandard
    path = os.environ.get('OTZ_DB') or os.path.expanduser('~/mnt/otzaria/books/seforim.db')
    db = sqlite3.connect('file:' + path + '?mode=ro', uri=True)
    d = zstandard.ZstdCompressionDict(db.execute('select dict from zstd_dict limit 1').fetchone()[0])
    dz = zstandard.ZstdDecompressor(dict_data=d)
    plain = zstandard.ZstdDecompressor()

    def txt(b):
        if b is None:
            return ''
        if isinstance(b, str):
            return b
        try:
            s = dz.decompress(b, max_output_size=10_000_000)
        except Exception:
            s = plain.decompress(b, max_output_size=10_000_000)
        return s.decode('utf-8', 'replace')
    return db, txt


def cache_dir():
    d = os.environ.get('VQ_CACHE') or os.path.expanduser('~/otz/vqcache')
    try:
        os.makedirs(d, exist_ok=True)
    except OSError:
        return None
    return d


class Book:
    def __init__(self, db, txt, bid):
        cd = cache_dir()
        cf = os.path.join(cd, '%s.n%s.json' % (bid, NORM_VERSION)) if cd else None
        if cf and os.path.exists(cf):
            with open(cf, encoding='utf-8') as f:
                self.idx, self.ref, parts = json.load(f)
        else:
            rows = db.execute('select l.lineIndex,l.heRef,c.content from line l join line_content c on c.id=l.id where l.bookId=? order by l.lineIndex', (bid,)).fetchall()
            self.idx, self.ref, parts = [], [], []
            for i, r, c in rows:
                self.idx.append(i)
                self.ref.append(r or '')
                parts.append(norm(txt(c)))
            if cf and rows:
                with open(cf, 'w', encoding='utf-8') as f:
                    json.dump([self.idx, self.ref, parts], f, ensure_ascii=False, separators=(',', ':'))
        self.parts = parts
        self.text, self.off = self._join(parts)
        self.padded = ' ' + self.text + ' '
        self._sk = None
        self._bi = None

    def bigrams(self):
        """The set of word pairs (in the skeleton spelling) of the whole book: a quote whose pairs are mostly absent cannot be in the book."""
        if self._bi is None:
            w = self.sk()[0].split(' ')
            self._bi = set(w[i] + ' ' + w[i + 1] for i in range(len(w) - 1))
            self._bi.update(w)
        return self._bi

    @staticmethod
    def _join(parts):
        off, pos = [], 0
        for t in parts:
            off.append(pos)
            pos += len(t) + 1
        return ' '.join(parts), off

    def sk(self):
        if self._sk is None:
            t, off = self._join([skel(t) for t in self.parts])      # (text, offsets)
            self._sk = (t, off, ' ' + t + ' ')
        return self._sk

    def hits(self, seg, sk=False, limit=3):
        text, off, padded = self.sk() if sk else (self.text, self.off, self.padded)
        needle = ' ' + seg + ' '
        out, start = [], 0
        while len(out) < limit:
            k = padded.find(needle, start)
            if k < 0:
                break
            out.append(bisect.bisect_right(off, k) - 1 if k < len(text) else len(off) - 1)
            start = k + 1
        return out

    def pos(self, seg):
        return self.padded.find(' ' + seg + ' ')


def prefilter(book, seg):
    """False when the quote is certainly not (nor nearly) in the book: most of its word pairs, in the skeleton spelling, are not in it."""
    w = skel(seg).split(' ')
    if len(w) < 2:
        return w[0] in book.bigrams() if w and w[0] else True
    bi = book.bigrams()
    n = len(w) - 1
    allowed = n - (1 if n == 1 else max(2, int(0.6 * n)))
    miss = 0
    for i in range(n):
        if (w[i] + ' ' + w[i + 1]) not in bi:
            miss += 1
            if miss > allowed:
                return False
    return True


def check_segment(book, seg):
    if not prefilter(book, seg):
        return ['n']
    ks = book.hits(seg)
    if ks:
        return ['e', [[book.idx[li], book.ref[li]] for li in ks]]
    ss = skel(seg)
    if ss:
        ks = book.hits(ss, sk=True)
        if ks:
            return ['s', [[book.idx[li], book.ref[li]] for li in ks]]
    return near_miss(book, seg)


def near_miss(book, seg):
    """Most word pairs of the quote are in the book, the phrase is not: the densest cluster of the pairs is where the quote should be."""
    w = seg.split(' ')
    if len(w) < 4:
        return ['n']
    bigrams = [' '.join(w[i:i + 2]) for i in range(len(w) - 1)]
    allowed_miss = len(bigrams) - max(2, int(0.6 * len(bigrams)))      # more misses than this: not a near miss (stops early in a wrong book)
    found, miss = [], 0
    for i, b in enumerate(bigrams):
        k = book.pos(b)
        if k >= 0:
            found.append((i, k))
        else:
            miss += 1
            if miss > allowed_miss:
                return ['n']
    # a pair may occur in many places: the pairs' every occurrence, the window with the most pairs wins
    occ = []
    for i, b in enumerate(bigrams):
        start = 0
        for _ in range(6):
            k = book.padded.find(' ' + b + ' ', start)
            if k < 0:
                break
            occ.append((k, i))
            start = k + 1
    occ.sort()
    span = len(seg) + 60
    best, bi, j = 0, 0, 0
    for i in range(len(occ)):
        while occ[i][0] - occ[j][0] > span:
            j += 1
        if len({x[1] for x in occ[j:i + 1]}) > best:
            best, bi = len({x[1] for x in occ[j:i + 1]}), j
    k0, i0 = occ[bi]
    start = max(0, k0 - sum(len(x) + 1 for x in w[:i0]) - 12)
    window = book.text[start:start + len(seg) + 60]
    wl = window.split(' ')
    sm = difflib.SequenceMatcher(None, w, wl, autojunk=False)
    blocks = [m for m in sm.get_matching_blocks() if m.size]
    if not blocks:
        return ['n']
    lo = max(0, blocks[0].b - blocks[0].a)
    hi = min(len(wl), blocks[-1].b + blocks[-1].size + (len(w) - blocks[-1].a - blocks[-1].size))
    wl = wl[lo:hi]
    sm = difflib.SequenceMatcher(None, w, wl, autojunk=False)
    diffs = []
    for tag, a1, a2, b1, b2 in sm.get_opcodes():
        if tag == 'equal':
            continue
        diffs.append('%s: "%s" -> "%s"' % ({'replace': 'שונה', 'delete': 'חסר בספר', 'insert': 'נוסף בספר'}[tag], ' '.join(w[a1:a2]), ' '.join(wl[b1:b2])))
    li = bisect.bisect_right(book.off, max(k0 - 1, 0)) - 1
    return ['m', book.idx[li], book.ref[li], ' '.join(wl), '; '.join(diffs[:4])]


def process(req, db, txt, t0):
    budget = float(req.get('budget', 35))
    out = {'r': {}, 'cov': {}, 'ptr': {}, 'find': {}, 'titles': {}}
    for name in req.get('find', []):
        toks = [t for t in re.split(r'\s+', name.replace('"', '').replace('\u05f4', '').replace("'", '').strip()) if t]
        like = '%' + '%'.join(toks) + '%'
        rows = db.execute("select id,title from book where replace(replace(replace(title,'\"',''),'\u05f4',''),'\u05f3','') like ? order by id limit 12", (like,)).fetchall()
        out['find'][name] = [[r[0], r[1]] for r in rows]
    for bid in req.get('titles', []):
        r = db.execute('select title from book where id=?', (int(bid),)).fetchone()
        out['titles'][str(bid)] = r[0] if r else None
    for b, i, label in req.get('ptr', []):
        r = db.execute('select l.heRef,c.content from line l join line_content c on c.id=l.id where l.bookId=? and l.lineIndex=?', (b, i)).fetchone()
        out['ptr']['%s:%s' % (b, i)] = [r[0], norm(txt(r[1]))[:60]] if r else None
    remaining = []
    for books, qids in req.get('t', []):
        left = []
        for b in books:
            if time.time() - t0 > budget:
                left.append(b)
                continue
            b = str(b)
            if os.environ.get('VQ_DEBUG'):
                print('book', b, round(time.time() - t0, 1), file=sys.stderr, flush=True)
            try:
                book = Book(db, txt, int(b))
            except Exception as e:      # a missing book
                for q in qids:
                    out['r']['%s|%s' % (q, b)] = [['x', str(e)[:80]]]
                out['cov'].setdefault(b, []).extend(qids)
                continue
            for q in qids:
                res = [check_segment(book, sg) for sg in req['q'][q]]
                if any(r[0] != 'n' for r in res):
                    out['r']['%s|%s' % (q, b)] = res
            out['cov'].setdefault(b, []).extend(qids)
        if left:
            remaining.append([left, qids])
    out['remaining'] = remaining
    out['sec'] = round(time.time() - t0, 1)
    return out


def main():
    t0 = time.time()
    db, txt = open_db()
    if len(sys.argv) > 2 and sys.argv[1] == '--dir':
        d = sys.argv[2]
        total = float(sys.argv[sys.argv.index('--budget') + 1]) if '--budget' in sys.argv else 40.0
        left = 0
        for fn in sorted(glob.glob(os.path.join(d, '*.json'))):
            if fn.endswith('.out.json'):
                continue
            with open(fn, encoding='utf-8') as f:
                req = json.load(f)
            if not (req.get('t') or req.get('ptr') or req.get('find') or req.get('titles')):
                continue
            if time.time() - t0 > total - 3:
                left += 1
                continue
            req['budget'] = max(5, total - (time.time() - t0) - 2)
            res = process(req, db, txt, time.time())
            of = fn[:-5] + '.%d.out.json' % int(time.time())
            rem = res.pop('remaining')
            with open(of, 'w', encoding='utf-8') as f:
                json.dump(res, f, ensure_ascii=False, separators=(',', ':'))
            req.update({'t': rem, 'ptr': [], 'find': [], 'titles': []})      # what is left stays in the batch: run again
            with open(fn, 'w', encoding='utf-8') as f:
                json.dump(req, f, ensure_ascii=False, separators=(',', ':'))
            left += 1 if rem else 0
            print(os.path.basename(fn), res['sec'], 's', 'books left:', sum(len(b) for b, _ in rem))
        print('left:', left, 'total', round(time.time() - t0, 1), 's')
        return
    req = json.load(sys.stdin)
    res = process(req, db, txt, t0)
    res.pop('remaining', None)
    json.dump(res, sys.stdout, ensure_ascii=False, separators=(',', ':'))


if __name__ == '__main__':
    main()
