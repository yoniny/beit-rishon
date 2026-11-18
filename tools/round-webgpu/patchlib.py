# -*- coding: utf-8 -*-
# webgpu round: anchor-based edits of the Second Temple's readable bundle - by text, never by line number, so that the same script
# runs on 2.0.18's unified-plugin/sheni/bundle.js and on 3.0's sheni-src/bundle.js. Lines are compared without the bundle's " //"
# endings (tools/safe-lines.mjs); written lines get them back (a file without them is written without them). Every edit names its
# anchor; an anchor that is not found exactly the expected number of times is reported (MISSING) and the edit is skipped.
import sys

class Bundle:
    def __init__(self, path):
        self.path = path
        self.lines = open(path, encoding='utf-8').read().split('\n')
        self.suf = ' //' if sum(1 for l in self.lines[:400] if l.endswith(' //')) > 50 else ''
        self.missing, self.done = [], []

    @staticmethod
    def src(l):
        return l[:-3] if l.endswith(' //') else l

    def out(self, l, raw=False):
        return l if (raw or l.strip() == '') else l + self.suf

    @staticmethod
    def block(s):
        s = s.strip('\n')
        return s.split('\n')

    def find(self, ob, prefix=False):
        n, hits = len(ob), []
        for i in range(len(self.lines) - n + 1):
            ok = True
            for k in range(n):
                a = self.src(self.lines[i + k])
                if not (a.startswith(ob[k]) if (prefix and k == 0) else a == ob[k]):
                    ok = False
                    break
            if ok:
                hits.append(i)
        return hits

    def _hits(self, ob, label, n, prefix):
        hits = self.find(ob, prefix)
        if len(hits) != n:
            self.missing.append('%s (found %d, expected %d)' % (label, len(hits), n))
            print('MISSING', label, 'found', len(hits), 'expected', n)
            return None
        return hits

    def rep(self, old, new, label, n=1, raw=False, prefix=False):
        ob, nb = self.block(old), self.block(new)
        hits = self._hits(ob, label, n, prefix)
        if hits is None:
            return False
        for i in reversed(hits):
            self.lines[i:i + len(ob)] = [self.out(x, raw) for x in nb]
        self.done.append(label)
        print('ok', label)
        return True

    def insert_before(self, anchor, new, label, raw=False, prefix=False):
        ob, nb = self.block(anchor), self.block(new)
        hits = self._hits(ob, label, 1, prefix)
        if hits is None:
            return False
        self.lines[hits[0]:hits[0]] = [self.out(x, raw) for x in nb]
        self.done.append(label)
        print('ok', label)
        return True

    def insert_after(self, anchor, new, label, raw=False, prefix=False):
        ob, nb = self.block(anchor), self.block(new)
        hits = self._hits(ob, label, 1, prefix)
        if hits is None:
            return False
        p = hits[0] + len(ob)
        self.lines[p:p] = [self.out(x, raw) for x in nb]
        self.done.append(label)
        print('ok', label)
        return True

    def has(self, text):
        return any(text in self.src(l) for l in self.lines)

    def save(self):
        open(self.path, 'w', encoding='utf-8').write('\n'.join(self.lines))
        print('%d edits, %d anchors missing%s' % (len(self.done), len(self.missing), (': ' + '; '.join(self.missing)) if self.missing else ''))
        return not self.missing
