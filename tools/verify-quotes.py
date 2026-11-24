#!/usr/bin/env python3
# tools/verify-quotes.py - checks every quotation and every source reference in the code, the README and the news files against the
# Otzaria library (seforim.db), so that "the text is as it is in the book" is a run of a tool and not a memory.
#
# WHAT IT DOES
#   extract  quotes between gershayim (״...״, also “...”, «...» and, in .md files, "...") and, in the .js files, between escaped \"...\";
#            for each: the file and line, the source reference near it ("(מידות ד, ב)" after it, in front of it, after a chain of quotes,
#            or "הרמב״ם:" in front of it), and the quote cut at "..." into parts. Also the pointers ["label", {book: N, index: M}].
#   plan     the library lookups still missing, as small batches (default <= 400 KB each) for verify-quotes-device.py.
#   ingest   merges a batch's answer into build/verify-quotes/results.json.
#   run      plan + a command that runs the device half (--exec) + ingest, in a loop, until nothing is missing.
#   report   the report: verified / verified in another book / near miss / not found / book not mapped, with file:line.
#
# HOW A QUOTE IS COMPARED (the normalisation is verify-quotes-device.py: norm())
#   no tags, no nikud and ta'amim, gershayim/geresh/quotes removed (so רמב״ם = רמבם), maqaf/hyphen/dash = space, punctuation, digits and
#   "(א)" line numbers removed, final letters folded. The quote is compared as a whole phrase (word boundaries) inside the book's text, lines
#   joined, so a quote that crosses a line is found. "exact" = same letters; "spelling" = same after removing vav and yod (plene/defective);
#   "near miss" = most word pairs are in the book but the phrase is not (the report shows the differing words); else "not found".
#
# THE BOOK TABLE: tools/verify-quotes.books.json (tractate -> mishnah / bavli / commentators ids; Rambam; Tanach; standalone books; pool).
#   A reference whose book is not in the table is listed under "unmapped" (in the file, with how often it was seen, where, and - after
#   `plan` + the device's "find" - suggestions of library titles). Fill the id in the table and run again.
#
# USAGE (from the repository root; the library half runs where the library is, every command is short - see --budget)
#   python3 tools/verify-quotes.py extract [--since <git base>] [--files a.js b.md ...]
#   python3 tools/verify-quotes.py plan [--pool] [--max-bytes 12000] [--out DIR]       -> DIR/batches/NNN.json (prints how many left)
#   <on the library machine>  python3 verify-quotes-device.py < NNN.json > NNN.out.json
#   python3 tools/verify-quotes.py ingest NNN.out.json ...                                  (or: ... | ingest -)
#   python3 tools/verify-quotes.py run --exec 'ssh host python3 ~/otz/verify-quotes-device.py'   (all of the above in a loop)
#   python3 tools/verify-quotes.py report [--json] [--verbose]                              exit code 1 when a near miss or a miss is left
#   --since BASE: only quotes on lines that `git diff BASE` added or changed (fast check of a change).
import sys, os, re, json, hashlib, subprocess, argparse, glob, importlib.util, time
sys.dont_write_bytecode = True

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TABLE = os.path.join(HERE, 'verify-quotes.books.json')
_spec = importlib.util.spec_from_file_location('vq_device', os.path.join(HERE, 'verify-quotes-device.py'))
dev = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(dev)
norm, skel = dev.norm, dev.skel

PARTIAL_POOL = False      # report --partial: judge by the pool books looked up so far
DEFAULT_FILES = ['sheni/src/**/*', 'src/**/*', 'shared/**/*', 'unified/news*.md', 'README.md']
EXTS = ('.js', '.mjs', '.md', '.html', '.txt')
HEB = 'א-ת'
H = re.compile('[' + HEB + ']')

STATUS_HE = {
    'verified': 'אומת', 'spelling': 'אומת (כתיב מלא/חסר שונה)', 'other': 'אומת בספר אחר מהמצוין', 'unref': 'אומת (אין מראה מקום)',
    'noref': 'אין מראה מקום ולא נמצא', 'mismatch': 'אי־התאמה', 'notfound': 'לא נמצא', 'unmapped': 'ספר לא ממופה', 'pending': 'עוד לא נבדק', 'short': 'קצר מדי',
}


# ------------------------------------------------------------------------------------------------------------------------ table
def load_table():
    with open(TABLE, encoding='utf-8') as f:
        return json.load(f)


def save_table(t):
    with open(TABLE, 'w', encoding='utf-8') as f:
        json.dump(t, f, ensure_ascii=False, indent=1)
        f.write('\n')


class Refs:
    """Resolves reference texts ("ברטנורא סוכה ה, ה") to library book ids with the table."""

    def __init__(self, table):
        self.t = table
        self.comm = {}                       # normalised alias -> commentator key
        for key, aliases in table['commentators'].items():
            for a in aliases:
                self.comm[norm(a)] = key
        self.names = {}                      # normalised alias -> (kind, canonical name)
        for n, e in table['tractates'].items():
            for a in [n] + e.get('aliases', []):
                self.names[norm(a)] = ('tractate', n)
        for n, e in table['mt'].items():
            for a in [n] + e.get('aliases', []):
                self.names[norm(a)] = ('mt', n)
        for n, e in table['tanach'].items():
            for a in [n] + e.get('aliases', []):
                self.names[norm(a)] = ('tanach', n)
        for n, e in table['books'].items():
            for a in [n] + e.get('aliases', []):
                self.names[norm(a)] = ('book', n)
        self.en = {}
        for n, e in table['tractates'].items():
            for a in e.get('en', []):
                self.en[a.lower()] = n
        self.maxn = 4
        self._pool = None

    CORE = ('מידות', 'תמיד', 'יומא', 'סוכה', 'שקלים', 'זבחים', 'מנחות')

    def pool(self, seen=()):
        """The books searched when a quote is not found in the books of its own reference (or has none): the table's pool, the Mishneh Torah,
        Tanach, the stand-alone books and, for the tractates of the Temple service and every tractate that some reference of the code names,
        all that the table knows about the tractate."""
        key = tuple(sorted(seen))
        if self._pool is None or self._pool[0] != key:
            ids = list(self.t.get('pool', []))
            for n, e in self.t['tractates'].items():
                if n in self.CORE:
                    ids += [v for k, v in e.items() if k != 'aliases' and isinstance(v, int)]
                elif n in seen:
                    ids += [e[k] for k in ('mishnah', 'bavli', 'yerushalmi', 'tosefta', 'rashi', 'tosafot') if isinstance(e.get(k), int)]
            for e in self.t['mt'].values():
                ids.append(e['id'])
                ids += [v for v in e.get('by', {}).values() if isinstance(v, int)]
            for e in self.t['tanach'].values():
                ids.append(e['id'])
                ids += [v for v in e.get('by', {}).values() if isinstance(v, int)]
            for e in self.t['books'].values():
                ids += e['ids']
            self._pool = (key, sorted(set(ids)))
        return self._pool[1]

    def family(self, comm):
        """Every book of one commentator (when the reference names only the commentator: "הרמב״ם: ...")."""
        ids = []
        for e in self.t['tractates'].values():
            v = e.get(comm)
            if isinstance(v, int):
                ids.append(v)
        for e in list(self.t['mt'].values()) + list(self.t['tanach'].values()):
            v = e.get('by', {}).get(comm)
            if isinstance(v, int):
                ids.append(v)
        if comm == 'rambam_mishna':   # "הרמב״ם" alone: the Mishneh Torah or the commentary on the Mishnah
            ids += [e['id'] for e in self.t['mt'].values()]
        return sorted(set(ids))

    # ---- one reference text -> list of resolved parts
    NUM = re.compile(r'^(?:[קרשת]{1,3})?(?:ט[וז]|[יכלמנסעפצ]?[א-ט]?)$')

    def parse(self, raw):
        out = []
        s = re.sub(r'<[^>]+>|\*\*', '', raw)
        s = re.sub(r'^\s*(?:ראה|וראה|עיין|השוו|כן|לפי|כמו ש)\s+', '', s)
        s = s.replace('–', ' ').replace('—', ' ')
        for part in re.split(r'[;؛]', s):
            part = part.strip(' ,')
            if not part:
                continue
            r = self._part(part)
            if r:
                out.append(r)
        return out

    COMMON = ('לא', 'אל', 'אם', 'אב', 'בא', 'כא', 'מי', 'לב', 'לו', 'כי', 'אי', 'בו', 'גם')
    FORCE = {'משנה': 'mishnah', 'ירושלמי': 'yerushalmi', 'תוספתא': 'tosefta', 'בבלי': 'bavli', 'גמרא': 'bavli', 'בגמרא': 'bavli'}
    FILLER = ('הלכות', 'על', 'לרמבם', 'פרק', 'דף', 'סימן', 'מסכת', 'הלכה', 'בפרק')

    def _part(self, part):
        raw = [t for t in re.split(r'[\s,]+', part) if t]
        for s in range(0, min(4, len(raw))):
            r = self._try(part, raw, s)
            if r:
                return r
        # a leading one-letter prefix (ו, כ, ל, ב): "כרמב״ם", "וברטנורא"
        for s in range(0, min(3, len(raw))):
            t = raw[s]
            if len(norm(t)) > 3 and norm(t)[0] in 'וכלב':
                r = self._try(part, raw[:s] + [t[1:]] + raw[s + 1:], s)
                if r:
                    return r
        # an unknown book with a location: reported as unmapped (a name of 1-3 words and 1-3 numerals)
        loc, name = [], []
        for t in raw:
            nt = norm(t)
            if nt and self.NUM.match(nt) and nt not in ('על',) + self.COMMON:
                loc.append((nt, self._marker(t)))
            elif nt:
                name.append(re.sub('[\u0591-\u05c7]', '', t).strip('.,:;'))
        known = any(norm(w) in self.names or norm(w) in self.comm for w in name)
        if not known and not all(norm(w) in self.FILLER for w in name) and 1 <= len(name) <= 3 and 1 <= len(loc) <= 3 and not any(norm(w) in self.STOP for w in name) and part == part.strip() and len(norm(name[0])) > 2:
            return {'raw': part, 'unmapped': ' '.join(name), 'loc': loc, 'ids': [], 'comm': None, 'kind': None, 'name': None}
        return None

    STOP = ('חצי', 'פי', 'עד', 'כל', 'אמה', 'אמות', 'ראה', 'שם', 'לעיל', 'להלן', 'בערך', 'כמו', 'סעיף', 'הערה', 'שורה', 'ס', 'פרק', 'ו', 'כ', 'ב', 'ל', 'מ')

    @staticmethod
    def _marker(t):
        m = re.search(r'([.:])\W*$', t)
        return m.group(1) if m else ''

    def _try(self, part, raw, s):
        n_all = [norm(t) for t in raw]
        i = s
        force = None
        while i < len(raw) and n_all[i] in self.FORCE:
            force = self.FORCE[n_all[i]]
            i += 1
        comm = None
        for w in range(self.maxn, 0, -1):
            if i + w <= len(raw):
                key = norm(' '.join(raw[i:i + w]))
                if key in self.comm:
                    comm, i = self.comm[key], i + w
                    break
        while i < len(raw) and n_all[i] in self.FILLER:
            i += 1
        kind = name = None
        for w in range(self.maxn, 0, -1):
            if i + w <= len(raw):
                key = norm(' '.join(raw[i:i + w]))
                if key in self.names:
                    (kind, name), i = self.names[key], i + w
                    break
        if kind is None and comm is None:
            return None
        loc = []
        junk = 0
        for t in raw[i:]:
            nt = norm(t)
            if not nt:
                continue
            if nt in ('עא', 'עב'):
                loc.append(('', '.' if nt == 'עא' else ':'))
            elif nt in self.FILLER:
                continue
            elif self.NUM.match(nt):
                loc.append((nt, self._marker(t)))
            else:
                junk += 1
        if junk > 1 or len(loc) > 4:
            return None
        res = {'raw': part, 'comm': comm, 'kind': kind, 'name': name, 'loc': loc, 'ids': [], 'unmapped': None}
        daf = bool(loc) and any(m for _, m in loc)
        if kind == 'tractate':
            e = self.t['tractates'][name]
            if comm:
                v = e.get(comm)
                if isinstance(v, int):
                    res['ids'] = [v]
                else:
                    res['unmapped'] = '%s על %s' % (self.t['commentators'][comm][0] if self.t['commentators'].get(comm) else comm, name)
            else:
                want = force or ('bavli' if daf else 'mishnah')
                v = e.get(want)
                if isinstance(v, int):
                    res['ids'] = [v]
                else:
                    res['unmapped'] = {'mishnah': 'משנה', 'bavli': 'בבלי', 'yerushalmi': 'ירושלמי', 'tosefta': 'תוספתא'}[want] + ' ' + name
        elif kind in ('mt', 'tanach'):
            e = self.t[kind][name]
            if comm in (None, 'rambam_mishna') and kind == 'mt' or comm is None:
                res['ids'] = [e['id']]
            else:
                v = e.get('by', {}).get(comm)
                if isinstance(v, int):
                    res['ids'] = [v]
                else:
                    res['unmapped'] = '%s על %s' % (self.t['commentators'][comm][0] if self.t['commentators'].get(comm) else comm, name)
        elif kind == 'book':
            res['ids'] = list(self.t['books'][name]['ids'])
        elif comm:
            res['family'] = comm                    # only the commentator is named: no book to look in first, the pool decides
        return res


# ------------------------------------------------------------------------------------------------------------------------ extract
QUOTE_PAIRS = [('“', '”'), ('«', '»')]


def find_quotes(line, ascii_from, escaped):
    """-> [(start, end, text, kind)] with start/end the positions of the opening and closing mark."""
    out = []
    n = len(line)
    # gershayim: a mark with a Hebrew letter on both sides is the acronym sign (רמב״ם), the others are quote marks
    opened = None
    for i, ch in enumerate(line):
        if ch != '״':
            continue
        prv = line[i - 1] if i else ' '
        nxt = line[i + 1] if i + 1 < n else ' '
        if H.match(prv) and H.match(nxt):
            continue
        if opened is None and nxt != ' ' and not (H.match(prv)):
            opened = i
        elif opened is not None:
            out.append((opened, i, line[opened + 1:i], 'gershayim'))
            opened = None
        elif H.match(prv):
            pass
    for a, b in QUOTE_PAIRS:
        for m in re.finditer(re.escape(a) + r'([^' + re.escape(b) + r']+)' + re.escape(b), line):
            out.append((m.start(), m.end() - 1, m.group(1), 'curly'))
    if escaped:       # \"...\" inside a JS string
        for m in re.finditer(r'\\"((?:(?!\\").)+?)\\"', line):
            out.append((m.start(), m.end() - 1, m.group(1), 'escaped'))
    if ascii_from is not None and ascii_from >= 0:   # "..." in a markdown line or in a code comment, opened in front of a Hebrew letter
        for m in re.finditer(r'(?<![' + HEB + r'"])"([' + HEB + r'][^"]*?)"(?![' + HEB + '])', line[ascii_from:]):
            out.append((m.start() + ascii_from, m.end() - 1 + ascii_from, m.group(1), 'ascii'))
    out.sort()
    return out


REF_EN = re.compile(r'^\s*(?:[\u2014\u2013-]\s*)?\(([A-Z][A-Za-z.\' ]{2,24}?)\s+(\d+)(?:[:.](\d+)|([ab]))\)')
GEMATRIA = [(400, 'ת'), (300, 'ש'), (200, 'ר'), (100, 'ק'), (90, 'צ'), (80, 'פ'), (70, 'ע'), (60, 'ס'), (50, 'נ'), (40, 'מ'), (30, 'ל'), (20, 'כ'), (10, 'י'),
            (9, 'ט'), (8, 'ח'), (7, 'ז'), (6, 'ו'), (5, 'ה'), (4, 'ד'), (3, 'ג'), (2, 'ב'), (1, 'א')]


def hebnum(n):
    if n in (15, 16):
        return 'טו' if n == 15 else 'טז'
    out = ''
    for v, ch in GEMATRIA:
        while n >= v:
            out += ch
            n -= v
    return out


def english_ref(m, rx):
    """(Middot 1:8) -> 'מידות א, ח'; (Yoma 37a) -> 'יומא לז.'"""
    name = rx.en.get(m.group(1).strip().lower().replace('.', ''))
    if not name:
        return None
    if m.group(3):
        return '%s %s, %s' % (name, hebnum(int(m.group(2))), hebnum(int(m.group(3))))
    return '%s %s%s' % (name, hebnum(int(m.group(2))), '.' if m.group(4) == 'a' else ':')


REF_AFTER = re.compile(r'^\s*(?:[—–-]\s*)?\(([^()]{2,100})\)')
REF_BEFORE = re.compile(r'\(([^()]{2,100})\)\s*[:—–-]?\s*(?:\*\*)?\s*$')
SEP_CHAIN = re.compile(r'^\s*(?:[;,.]|\.\.\.|…|—|–|-|ו)?\s*(?:—|–|-)?\s*$')


def refs_for(line, qs, k, rx):
    """Reference texts of quote k of the line: ('after'|'chain'|'before'|'attr'|'none', [raw...])."""
    s, e, _, _ = qs[k]
    m = REF_AFTER.match(line[e + 1:])
    if m:
        return 'after', [m.group(1)]
    m = REF_EN.match(line[e + 1:])
    if m:
        r = english_ref(m, rx)
        if r:
            return 'after', [r]
    # a chain of quotes: ״a״; ״b״ (ref) - the reference at the end belongs to all of them
    j, last = k, e
    while j + 1 < len(qs) and SEP_CHAIN.match(line[last + 1:qs[j + 1][0]]):
        j += 1
        last = qs[j][1]
    if j != k:
        m = REF_AFTER.match(line[last + 1:])
        if m:
            return 'chain', [m.group(1)]
    pre = line[:s]
    m = REF_BEFORE.search(pre)
    if m and rx.parse(m.group(1)):
        ref = m.group(1)
        # "**המפרש** (תמיד כה:)" - the commentator in front of the parenthesis belongs to the reference
        words = re.sub(r'\*\*|\s*[:\u2014\u2013-]\s*$', '', pre[:m.start()]).split()
        for w in range(min(3, len(words)), 0, -1):
            cand = ' '.join(words[-w:])
            r = rx.parse(cand)
            if r and r[0].get('comm') and not r[0].get('kind') and not r[0].get('loc') and not rx.parse(ref)[0].get('comm'):
                ref = cand + ' ' + ref
                break
        return 'before', [ref]
    # "הרמב״ם: ״" / "מלאכת שלמה: ״" in front of the quote
    m = re.search(r'([' + HEB + r'״\'"׳ ]{2,40}?)\s*[:—–-]\s*$', pre.rstrip('*'))
    if m:
        words = m.group(1).split()
        for w in range(min(4, len(words)), 0, -1):
            cand = ' '.join(words[-w:])
            r = rx.parse(cand)
            if r and (r[0].get('comm') or r[0].get('kind')):
                return 'attr', [cand]
    return 'none', []


def comment_start(line):
    """Where the comment of a JS line starts (-1: none): a line that starts with // or *, or the first ' //' outside a string."""
    st = line.lstrip()
    if st.startswith('//') or st.startswith('*') or st.startswith('/*'):
        return 0
    k = line.find(' //')
    while k >= 0:
        if line[:k].count('"') % 2 == 0 and line[:k].count('`') % 2 == 0:
            return k
        k = line.find(' //', k + 1)
    return -1


def in_comment(line, pos, is_js):
    if not is_js:
        return False
    st = line.lstrip()
    if st.startswith('//') or st.startswith('*') or st.startswith('/*'):
        return True
    k = line.find(' //')
    while k >= 0:
        if pos > k and line[:k].count('"') % 2 == 0 and line[:k].count('`') % 2 == 0:
            return True
        k = line.find(' //', k + 1)
    return False


def expand_files(patterns, root):
    out = []
    for p in patterns:
        for f in glob.glob(os.path.join(root, p), recursive=True):
            if os.path.isfile(f) and f.endswith(EXTS):
                out.append(os.path.relpath(f, root))
    return sorted(set(out))


def changed_lines(base, files, root):
    """git diff BASE -> {file: set(new line numbers)}"""
    res = {}
    cmd = ['git', '-C', root, 'diff', '-U0', base, '--'] + files
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    cur = None
    for ln in out.splitlines():
        if ln.startswith('+++ b/'):
            cur = ln[6:]
            res.setdefault(cur, set())
        elif ln.startswith('@@') and cur:
            m = re.match(r'@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@', ln)
            if m:
                a = int(m.group(1))
                c = int(m.group(2)) if m.group(2) is not None else 1
                res[cur].update(range(a, a + c))
    return res


def cmd_extract(a):
    table = load_table()
    rx = Refs(table)
    files = expand_files(a.files or DEFAULT_FILES, ROOT)
    only = changed_lines(a.since, files, ROOT) if a.since else None
    quotes, pointers, skipped = [], [], 0
    for f in files:
        try:
            lines = open(os.path.join(ROOT, f), encoding='utf-8').read().split('\n')
        except UnicodeDecodeError:
            continue
        is_js = f.endswith(('.js', '.mjs', '.html'))
        is_md = f.endswith(('.md', '.txt'))
        for ln, line in enumerate(lines, 1):
            if only is not None and ln not in only.get(f, ()):
                continue
            if '״' not in line and '\\"' not in line and '"' not in line and '“' not in line and '«' not in line:
                continue
            qs = find_quotes(line, ascii_from=(0 if is_md else comment_start(line) if is_js else None), escaped=is_js)
            for k, (s, e, text, kind) in enumerate(qs):
                text = text.replace('\\"', '"')
                if not H.search(text) or re.search('[A-Za-z]{3,}', text):
                    continue
                segs = dev.segments(text)
                if not segs:
                    continue
                src, raws = refs_for(line, qs, k, rx)
                parsed = []
                for r in raws:
                    parsed += rx.parse(r)
                words = sum(len(x.split()) for x in segs)
                # a label of the UI (one or two words, no reference) is not a quotation
                if not parsed and (words < 3 or in_comment(line, s, is_js)):
                    skipped += 1
                    continue
                qid = hashlib.sha1((' | '.join(segs)).encode('utf-8')).hexdigest()[:10]
                quotes.append({
                    'qid': qid, 'file': f, 'line': ln, 'col': s + 1, 'text': text, 'kind': kind, 'comment': in_comment(line, s, is_js),
                    'refs': raws, 'ref_src': src, 'segs': segs, 'parsed': parsed,
                })
            if is_js:
                for m in re.finditer(r'\[\s*"([^"]+)"\s*,\s*\{\s*book:\s*(\d+)\s*,\s*index:\s*(\d+)', line):
                    pointers.append({'file': f, 'line': ln, 'label': m.group(1), 'book': int(m.group(2)), 'index': int(m.group(3)),
                                     'parsed': rx.parse(m.group(1))})
    out = outdir(a)
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, 'quotes.json'), 'w', encoding='utf-8') as fh:
        json.dump({'base': a.since, 'files': files, 'quotes': quotes, 'pointers': pointers, 'skipped_labels': skipped}, fh, ensure_ascii=False, indent=0)
    update_unmapped(table, quotes + pointers)
    print('extract: %d quotes (%d unique texts), %d pointers, %d short labels skipped, %d files%s' % (
        len(quotes), len({q['qid'] for q in quotes}), len(pointers), skipped, len(files), (' [only lines changed since %s]' % a.since) if a.since else ''))


def update_unmapped(table, items):
    """The unmapped names go into the table file (counts, first place) - the table is the to-do list of the mapping."""
    um = table.setdefault('unmapped', {})
    seen = {}
    for q in items:
        for p in q.get('parsed', []):
            if p.get('unmapped'):
                d = seen.setdefault(p['unmapped'], {'seen': 0, 'first': '%s:%d' % (q['file'], q['line'])})
                d['seen'] += 1
    for name, d in seen.items():
        old = um.get(name, {})
        um[name] = {'seen': d['seen'], 'first': d['first'], 'suggest': old.get('suggest', [])}
    for name in list(um):
        if name not in seen and not um[name].get('suggest') and False:
            del um[name]
    save_table(table)


# ------------------------------------------------------------------------------------------------------------------------ plan / ingest
def outdir(a):
    return os.path.join(ROOT, getattr(a, 'out', None) or 'build/verify-quotes')


def load_json(path, default):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return default


def load_results(out):
    r = load_json(os.path.join(out, 'results.json'), {})
    for k in ('r', 'cov', 'ptr', 'find'):
        r.setdefault(k, {})
    return r


def quote_books(q):
    ids = []
    for p in q['parsed']:
        ids += p.get('ids', [])
    return list(dict.fromkeys(ids))


def covered(results, qid, b):
    return qid in results['cov_sets'].get(str(b), ())


def lookup(results, q, b):
    """per-segment results of quote q in book b: None = not looked up yet; [['n'], ...] = not in the book."""
    if not covered(results, q['qid'], b):
        return None
    return results['r'].get('%s|%s' % (q['qid'], b)) or [['n'] for _ in q['segs']]


def prep(results):
    results['cov_sets'] = {b: set(v) for b, v in results['cov'].items()}
    return results


def book_status(res):
    """per-segment results of one (quote, book) -> 'V'|'S'|'M'|'N'|'X'"""
    kinds = [r[0] for r in res]
    if 'x' in kinds:
        return 'X'
    if 'm' in kinds:
        return 'M'
    if all(k == 'e' for k in kinds):
        return 'V'
    if all(k in ('e', 's') for k in kinds):
        return 'S'
    if all(k == 'n' for k in kinds):
        return 'N'
    return 'M'      # some parts found, some not


def cmd_plan(a):
    out = outdir(a)
    data = load_json(os.path.join(out, 'quotes.json'), None)
    if not data:
        sys.exit('no quotes.json - run extract first')
    results = prep(load_results(out))
    rx = Refs(load_table())
    seen = seen_tractates(data)
    pool = rx.pool(seen)
    uniq = {}
    for q in data['quotes']:
        uniq.setdefault(q['qid'], q)
    need = {}       # book -> [qid]
    for qid, q in uniq.items():
        cited = quote_books(q)
        books = list(cited)
        if a.pool:
            if quote_status(q, results, rx, seen)['code'] in ('verified', 'spelling'):
                continue
            books = [b for b in pool if b not in cited]
        for b in books:
            if not covered(results, qid, b):
                need.setdefault(b, []).append(qid)
    ptr, seenp = [], set()
    if not a.pool:
        for p in data['pointers']:
            k = '%s:%s' % (p['book'], p['index'])
            if k not in results['ptr'] and k not in seenp:
                seenp.add(k)
                ptr.append([p['book'], p['index'], p['label']])
    find = []
    if not a.pool:
        um = load_table().get('unmapped', {})
        find = [n for n, d in um.items() if not d.get('suggest') and n not in results['find']]
    bdir = os.path.join(out, 'batches')
    os.makedirs(bdir, exist_ok=True)
    for old in glob.glob(os.path.join(bdir, '*.json')):
        os.remove(old)
    segsize = {qid: len(json.dumps(uniq[qid]['segs'], ensure_ascii=False)) + 16 for qid in uniq}
    # books that need the same quotes go together: a batch holds groups [[books], [qids]] (every quote in every book of its group)
    groups = {}
    for b in sorted(need):
        groups.setdefault(tuple(sorted(need[b])), []).append(b)
    batches = []

    def new():
        return {'q': {}, 't': [], 'ptr': [], 'find': [], 'budget': a.budget}
    cur, size = new(), 0
    for qids, books in groups.items():
        qchunks, chunk, csize = [], [], 0
        for qid in qids:
            if csize + segsize[qid] > a.max_bytes and chunk:
                qchunks.append(chunk)
                chunk, csize = [], 0
            chunk.append(qid)
            csize += segsize[qid]
        qchunks.append(chunk)
        for chunk in qchunks:
            csize = sum(segsize[q] for q in chunk)
            for i in range(0, len(books), a.books_per_batch):
                bs = books[i:i + a.books_per_batch]
                if size and size + csize > a.max_bytes * 2:
                    batches.append(cur)
                    cur, size = new(), 0
                for q in chunk:
                    cur['q'][q] = uniq[q]['segs']
                cur['t'].append([bs, chunk])
                size += csize + 8 * len(bs)
    cur['ptr'] = ptr
    cur['find'] = find
    if cur['t'] or cur['ptr'] or cur['find']:
        batches.append(cur)
    for i, bt in enumerate(batches, 1):
        with open(os.path.join(bdir, '%03d.json' % i), 'w', encoding='utf-8') as fh:
            json.dump(bt, fh, ensure_ascii=False, separators=(',', ':'))
    n = sum(len(v) for v in need.values())
    print('plan%s: %d lookups (quote x book) in %d books + %d pointers + %d names to find -> %d batches in %s' % (
        ' (pool)' if a.pool else '', n, len(need), len(ptr), len(find), len(batches), os.path.relpath(bdir, ROOT)))
    return len(batches)


def ingest_obj(out, obj):
    results = load_results(out)
    results['r'].update(obj.get('r', {}))
    for b, qs in obj.get('cov', {}).items():
        results['cov'][b] = sorted(set(results['cov'].get(b, [])) | set(qs))
    results['ptr'].update(obj.get('ptr', {}))
    results['find'].update(obj.get('find', {}))
    with open(os.path.join(out, 'results.json'), 'w', encoding='utf-8') as fh:
        json.dump(results, fh, ensure_ascii=False, separators=(',', ':'))
    if obj.get('find'):
        table = load_table()
        for n, c in obj['find'].items():
            if n in table.get('unmapped', {}):
                table['unmapped'][n]['suggest'] = c
        save_table(table)
    return sum(len(v) for v in obj.get('cov', {}).values()), len(obj.get('r', {}))


def cmd_ingest(a):
    out = outdir(a)
    done = hits = 0
    for f in a.files:
        txt = sys.stdin.read() if f == '-' else open(f, encoding='utf-8').read()
        d, h = ingest_obj(out, json.loads(txt))
        done += d
        hits += h
    print('ingest: %d lookups done (%d with something found); run plan again to see what is left' % (done, hits))


def cmd_run(a):
    out = outdir(a)
    for pool in (False, True):
        a.pool = pool
        guard = 0
        while True:
            n = cmd_plan(a)
            if not n:
                break
            guard += 1
            if guard > 20:
                sys.exit('too many rounds')
            for fn in sorted(glob.glob(os.path.join(out, 'batches', '*.json'))):
                t0 = time.time()
                with open(fn, 'rb') as fh:
                    p = subprocess.run(a.exec, shell=True, stdin=fh, capture_output=True)
                if p.returncode != 0:
                    sys.exit('device command failed: ' + p.stderr.decode('utf-8', 'replace')[:400])
                d, h = ingest_obj(out, json.loads(p.stdout.decode('utf-8')))
                print('  %s: %d lookups, %d hits, %.1fs' % (os.path.basename(fn), d, h, time.time() - t0))
    cmd_report(a)


# ------------------------------------------------------------------------------------------------------------------------ report
def loc_ok(loc, heref):
    toks = [t for t in re.split(r'[\s,]+', heref or '') if t]
    for tok, mark in loc:
        if tok and not any(norm(t) == tok for t in toks):
            return False
        if tok and mark and not any(norm(t) == tok and t.rstrip(',').endswith(mark) for t in toks):
            return False
    return True


def seen_tractates(data):
    return {p['name'] for q in data['quotes'] for p in q['parsed'] if p.get('kind') == 'tractate'}


def quote_status(q, results, rx, seen=()):
    """-> {'code','books','where','detail'} for one quote from the lookups done so far."""
    cited = quote_books(q)
    order = {'V': 0, 'S': 1, 'M': 2, 'N': 3, 'X': 4}
    names = [p['unmapped'] for p in q['parsed'] if p.get('unmapped')]
    done_cited = []
    for b in cited:
        r = lookup(results, q, b)
        if r is not None:
            done_cited.append((book_status(r), b, r))
    if cited and len(done_cited) < len(cited):
        return {'code': 'pending', 'books': [], 'where': None, 'detail': ''}
    done_cited.sort(key=lambda t: order[t[0]])
    pool_done, pool_todo = [], 0
    for b in rx.pool(seen):
        if b in cited:
            continue
        r = lookup(results, q, b)
        if r is not None:
            pool_done.append((book_status(r), b, r))
        else:
            pool_todo += 1
    if done_cited and done_cited[0][0] in ('V', 'S'):
        st, b, r = done_cited[0]
        hits = [h for x in r for h in (x[1] if x[0] in 'es' else [])]
        locs = [p['loc'] for p in q['parsed'] if p.get('loc')]
        ok = True
        if locs and hits:
            ok = any(loc_ok(l, h[1]) for l in locs for h in hits)
        return {'code': 'verified' if st == 'V' else 'spelling', 'books': [b], 'where': hits[:2], 'loc_ok': ok, 'detail': ''}
    pool_good = sorted([t for t in pool_done if t[0] in ('V', 'S')], key=lambda t: order[t[0]])
    if pool_good:
        st, b, r = pool_good[0]
        hits = [h for x in r for h in (x[1] if x[0] in 'es' else [])]
        return {'code': 'other' if cited else 'unref', 'books': [t[1] for t in pool_good][:4], 'where': hits[:2], 'detail': '; '.join(x for x in (('לא נמצא בספר המצוין (%s)' % ','.join(map(str, cited))) if cited else '', ('ספר לא ממופה: ' + ', '.join(names)) if names else '') if x)}
    # a near miss in a book the reference does not name needs a long quote to mean anything
    long_pool = [t for t in pool_done if t[0] == 'M' and max(len(x.split()) for x in q['segs']) >= 6]
    mm = [t for t in done_cited if t[0] == 'M'] or long_pool
    if pool_todo and pool_done and not PARTIAL_POOL:
        return {'code': 'pending', 'books': cited, 'where': None, 'detail': 'עוד %d ספרים בבדיקת הנפח (plan --pool)' % pool_todo}
    if mm:
        st, b, r = mm[0]
        det = [x for x in r if x[0] == 'm']
        miss = [i for i, x in enumerate(r) if x[0] == 'n']
        d = '; '.join('%s [%s] "%s"' % (x[4] or 'חלק מהקטע', x[2], x[3][:90]) for x in det[:2])
        if not det and miss:
            d = 'חלק מהקטעים לא נמצא: ' + ' | '.join(q['segs'][i] for i in miss[:2])
        return {'code': 'mismatch', 'books': [b], 'where': None, 'detail': d}
    if not cited and names and not pool_done:
        return {'code': 'unmapped', 'books': [], 'where': None, 'detail': ', '.join(names)}
    if not pool_done:
        return {'code': 'pending', 'books': cited, 'where': None, 'detail': 'לא נמצא בספר המצוין; עוד לא נבדק בשאר הספרים (plan --pool)'}
    if not cited and names:
        return {'code': 'unmapped', 'books': [], 'where': None, 'detail': ', '.join(names)}
    if not cited and not q['refs']:
        return {'code': 'noref', 'books': [], 'where': None, 'detail': 'אין מראה מקום ולא נמצא באף ספר ממופה'}
    return {'code': 'notfound', 'books': cited, 'where': None, 'detail': ('בספרים: %s' % ','.join(map(str, cited))) if cited else 'מראה המקום רק שם פרשן'}


def cmd_report(a):
    global PARTIAL_POOL
    PARTIAL_POOL = getattr(a, 'partial', False)
    out = outdir(a)
    data = load_json(os.path.join(out, 'quotes.json'), None)
    if not data:
        sys.exit('no quotes.json - run extract first')
    results = prep(load_results(out))
    table = load_table()
    rx = Refs(table)
    seen = seen_tractates(data)
    stat = {}
    rows = []
    for q in data['quotes']:
        st = stat.get(q['qid'])
        if st is None:
            st = stat[q['qid']] = quote_status(q, results, rx, seen)
        rows.append((q, st))
    counts = {}
    for q, st in rows:
        counts[st['code']] = counts.get(st['code'], 0) + 1
    ucounts = {}
    for qid, st in stat.items():
        ucounts[st['code']] = ucounts.get(st['code'], 0) + 1
    # pointers
    pt = {'ok': 0, 'book_diff': 0, 'loc_diff': 0, 'missing': 0, 'pending': 0, 'unparsed': 0}
    pbad = []
    for p in data['pointers']:
        r = results['ptr'].get('%s:%s' % (p['book'], p['index']), 'pending')
        if r == 'pending':
            pt['pending'] += 1
        elif r is None:
            pt['missing'] += 1
            pbad.append((p, 'missing', ''))
        else:
            ids = [i for x in p['parsed'] for i in x.get('ids', [])]
            locs = [x['loc'] for x in p['parsed'] if x.get('loc')]
            if re.search(r'(^|\s)שם(\s|$)', p['label']):
                ids, locs = [], []          # "רש״י שם": the place is the one named before it
            if ids and p['book'] not in ids:
                pt['book_diff'] += 1
                pbad.append((p, 'book_diff', r[0]))
            elif locs and not any(loc_ok(l, r[0]) for l in locs):
                pt['loc_diff'] += 1
                pbad.append((p, 'loc_diff', r[0]))
            else:
                pt['ok'] += 1
    if a.json:
        print(json.dumps({'counts': counts, 'unique': ucounts, 'pointers': pt,
                          'items': [dict(file=q['file'], line=q['line'], text=q['text'], refs=q['refs'], comment=q['comment'], **st) for q, st in rows]},
                         ensure_ascii=False, indent=1))
    else:
        total = len(rows)
        okn = counts.get('verified', 0) + counts.get('spelling', 0) + counts.get('other', 0) + counts.get('unref', 0)
        print('# דוח אימות ציטוטים מול אוצריא%s' % ((' (שינויים מאז %s)' % data['base']) if data.get('base') else ''))
        print()
        print('נמצאו %d ציטוטים (%d טקסטים שונים) ב-%d קבצים; %d תוויות קצרות לא נספרו.' % (total, len(stat), len(data['files']), data.get('skipped_labels', 0)))
        print('אומתו: %d (מתוכם בספר המצוין: %d, בכתיב שונה: %d, בספר אחר: %d, בלי מראה מקום: %d)' % (
            okn, counts.get('verified', 0), counts.get('spelling', 0), counts.get('other', 0), counts.get('unref', 0)))
        print('אי־התאמה: %d | לא נמצא: %d | ספר לא ממופה: %d | אין מראה מקום ולא נמצא: %d | עוד לא נבדק: %d' % (counts.get('mismatch', 0), counts.get('notfound', 0), counts.get('unmapped', 0), counts.get('noref', 0), counts.get('pending', 0)))
        print('מצביעים [שם, {book, index}]: %d (תקינים %d, ספר שונה מהמצוין %d, מקום שונה %d, שורה חסרה %d, עוד לא נבדקו %d)' % (
            len(data['pointers']), pt['ok'], pt['book_diff'], pt['loc_diff'], pt['missing'], pt['pending']))
        order = ['mismatch', 'notfound', 'unmapped', 'pending', 'other', 'unref', 'noref', 'spelling'] + (['verified'] if a.verbose else [])
        for code in order:
            items = [(q, st) for q, st in rows if st['code'] == code]
            if not items:
                continue
            print()
            print('## %s (%d)' % (STATUS_HE[code], len(items)))
            for q, st in items:
                tag = ' [הערת קוד]' if q['comment'] else ''
                print('- %s:%d%s  ״%s״' % (q['file'], q['line'], tag, q['text'] if len(q['text']) < 110 else q['text'][:107] + '...'))
                if q['refs']:
                    print('    מראה מקום: %s' % ' ; '.join(q['refs']))
                if st.get('where'):
                    print('    נמצא: %s' % ' ; '.join('%s [%s]' % (w[1], w[0]) for w in st['where']) + ('' if st.get('loc_ok', True) else '   (!) המקום שונה ממראה המקום'))
                if st['books'] and code in ('other', 'unref', 'mismatch'):
                    print('    ספרים: %s' % ','.join(map(str, st['books'])))
                if st['detail']:
                    print('    %s' % st['detail'])
        locs = [(q, st) for q, st in rows if st['code'] in ('verified', 'spelling') and not st.get('loc_ok', True)]
        if locs and not a.verbose:
            print()
            print('## נמצא בספר המצוין אבל במקום שונה ממראה המקום (%d)' % len(locs))
            for q, st in locs:
                print('- %s:%d  %s  נמצא ב: %s' % (q['file'], q['line'], ' ; '.join(q['refs']), st['where'][0][1] if st['where'] else ''))
        if pbad:
            print()
            print('## מצביעים בעייתיים (%d)' % len(pbad))
            for p, why, hr in pbad:
                print('- %s:%d  "%s" -> book %d index %d: %s %s' % (p['file'], p['line'], p['label'], p['book'], p['index'], {'missing': 'השורה לא קיימת', 'book_diff': 'ספר שונה מהמצוין, השורה היא', 'loc_diff': 'מקום שונה, השורה היא'}[why], hr))
        um = table.get('unmapped', {})
        if um:
            print()
            print('## שמות ספרים שלא מופו (%d) - לתיקון ב-tools/verify-quotes.books.json' % len(um))
            for n, d in sorted(um.items(), key=lambda t: -t[1]['seen']):
                print('- %s  (x%d, ראשון ב-%s)%s' % (n, d['seen'], d['first'], ('  הצעות: ' + ' | '.join('%s=%s' % (i, t) for i, t in d.get('suggest', [])[:4])) if d.get('suggest') else ''))
    bad = counts.get('mismatch', 0) + counts.get('notfound', 0)
    sys.exit(1 if bad else 0)


# ------------------------------------------------------------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser(description='verify quotations and references against the Otzaria library')
    ap.add_argument('--out', default='build/verify-quotes', help='working directory (relative to the repository)')
    sp = ap.add_subparsers(dest='cmd', required=True)
    e = sp.add_parser('extract')
    e.add_argument('--since', help='git base: only lines added or changed since it')
    e.add_argument('--files', nargs='*', help='globs relative to the repository (default: sheni/src, src, shared, unified/news*.md, README.md)')
    p = sp.add_parser('plan')
    p.add_argument('--pool', action='store_true', help='second phase: quotes not verified in their own book, against every mapped book')
    p.add_argument('--max-bytes', type=int, default=400000)
    p.add_argument('--books-per-batch', type=int, default=40, help='books per batch (every quote of a group is looked up in each)')
    p.add_argument('--budget', type=int, default=35, help='seconds the device half may work in one command')
    i = sp.add_parser('ingest')
    i.add_argument('files', nargs='+')
    r = sp.add_parser('run')
    r.add_argument('--exec', required=True, help='command that runs verify-quotes-device.py (stdin: a batch, stdout: its answer)')
    r.add_argument('--max-bytes', type=int, default=400000)
    r.add_argument('--books-per-batch', type=int, default=40)
    r.add_argument('--budget', type=int, default=35)
    r.add_argument('--json', action='store_true')
    r.add_argument('--verbose', action='store_true')
    q = sp.add_parser('report')
    q.add_argument('--json', action='store_true')
    q.add_argument('--verbose', action='store_true', help='also list the verified ones')
    q.add_argument('--partial', action='store_true', help='do not wait for every pool book: judge by what was looked up so far')
    a = ap.parse_args()
    a.pool = getattr(a, 'pool', False)
    {'extract': cmd_extract, 'plan': cmd_plan, 'ingest': cmd_ingest, 'run': cmd_run, 'report': cmd_report}[a.cmd](a)


if __name__ == '__main__':
    main()
