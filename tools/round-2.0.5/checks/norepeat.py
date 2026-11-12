#!/usr/bin/env python3
"""No text in a bundle may hold the same sentence or paragraph twice (the guard against a content step that adds its text again on
every run - 2.0.4 went out with one paragraph of the Gazit card five times).   python3 -I norepeat.py <bundle.js> [...]   exit 1 on a find"""
import re, sys, collections
# a quotation that repeats in its own source (the baraita of the menorah, Menachot 28b: the knob and two branches - three times)
ALLOW = ('וטפח כפתור ושני קנים יוצאים ממנו',)
LIT = re.compile(r'"(?:[^"\\\n]|\\.)*"|\'(?:[^\'\\\n]|\\.)*\'|`(?:[^`\\]|\\.)*`')
bad = 0
for path in sys.argv[1:]:
    src = open(path, encoding='utf-8').read(); n = 0
    for m in LIT.finditer(src):
        s = m.group(0)[1:-1]
        if len(s) < 120 or len(re.findall('[\u05d0-\u05ea]', s)) < 60: continue   # the cards and notes only (not shaders or styles)
        n += 1
        s = s.replace('\\n', '\n').replace('\\"', '"')
        paras = [p.strip() for p in s.split('\n') if len(p.strip()) > 25]
        sents = [x.strip() for x in re.split(r'(?<=[.:;])\s+', s) if len(x.strip()) > 45]
        rep = [(p, k) for p, k in collections.Counter(paras).items() if k > 1] + [(p, k) for p, k in collections.Counter(sents).items() if k > 1]
        seen = set()
        for p, k in rep:
            if p in seen or any(a in p for a in ALLOW): continue
            seen.add(p); bad += 1
            print('REPEAT %dx in %s (text of %d chars, line %d): %s' % (k, path.split('/')[-2] + '/' + path.split('/')[-1], len(s), src.count('\n', 0, m.start()) + 1, p[:120]))
    print('%s: %d texts checked' % (path, n))
print('NO-REPEAT ' + ('FAILED: %d' % bad if bad else 'OK'))
sys.exit(1 if bad else 0)
