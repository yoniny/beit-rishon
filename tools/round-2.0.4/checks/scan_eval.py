#!/usr/bin/env python3
# a scan against an older one, by numbers: python3 scan_eval.py <new dir> <old dir | -> <out sheet.jpg> [max pictures]
# flags (as mksheets.py), flags that are NEW against the old scan, records with errors, and the pictures that changed most
# (mean difference of small grey copies); one sheet of the flagged-new and the most changed ones is made for a person to look at.
import json, sys, os, subprocess
from PIL import Image, ImageChops, ImageStat
new, old, sheet = sys.argv[1], sys.argv[2], sys.argv[3]; mx = int(sys.argv[4]) if len(sys.argv) > 4 else 12
def flags(r):
    f = []
    if r.get('err') or r.get('errs'): f.append('ERR')
    if r.get('f', 1) < 0.85: f.append('f=%s' % r.get('f'))
    if r.get('near', 0) > 0.25: f.append('near=%s' % r.get('near'))
    if r.get('close', 0) > 0.15: f.append('close=%s' % r.get('close'))
    if r.get('std', 99) < 12: f.append('std=%s' % r.get('std'))
    return f
def key(r):
    if 'total' in r and 'name' in r: return 'S|%s|%s|%s|%s' % (r.get('kind'), r.get('group') or '', r.get('title') or r.get('cap'), r.get('key'))
    if r.get('kind') == 'row': return 'R|%s|%s' % (r.get('cap'), r.get('key'))
    if r.get('kind') == 'place': return 'P|%s' % r.get('t')
    return 'S|%s|%s|%s' % (r.get('kind'), r.get('title') or r.get('cap'), r.get('key'))
def load(d):
    out = {}
    p = os.path.join(d, 'vis.jsonl')
    if not os.path.exists(p): return out
    for l in open(p, encoding='utf-8'):
        try: r = json.loads(l)
        except Exception: continue
        sh = r.get('shot') or r.get('name')
        if sh: r['_shot'] = sh; out[key(r)] = r
    return out
N, O = load(new), (load(old) if old != '-' else {})
small = lambda p: Image.open(p).convert('L').resize((96, 54))
rows = []
for k, r in N.items():
    fl = flags(r); o = O.get(k); ofl = flags(o) if o else []
    d = -1
    if o:
        a, b = os.path.join(new, r['_shot'] + '.jpg'), os.path.join(old, o['_shot'] + '.jpg')
        if os.path.exists(a) and os.path.exists(b): d = ImageStat.Stat(ImageChops.difference(small(a), small(b))).mean[0]
    newflag = [x.split('=')[0] for x in fl if x.split('=')[0] not in [y.split('=')[0] for y in ofl]]
    rows.append((k, r, fl, newflag, d, o is None))
print('%s: %d records (old %d); flagged %d; with NEW flags %d; not in the old scan %d; missing now %d' % (new, len(N), len(O), sum(1 for x in rows if x[2]), sum(1 for x in rows if x[3]), sum(1 for x in rows if x[5]), len([k for k in O if k not in N])))
for k in [k for k in O if k not in N][:12]: print('  GONE:', k[:90])
look = []
for k, r, fl, nf, d, isnew in rows:
    if nf or (isnew and O): look.append((1000 if nf else 500, k, r, fl, d, isnew))
ch = sorted([x for x in rows if x[4] >= 0 and not x[3]], key=lambda x: -x[4])
for k, r, fl, nf, d, isnew in ch[:max(0, mx - len(look))]:
    if d > 9: look.append((d, k, r, fl, d, isnew))
print('flag list (all flagged now):')
for k, r, fl, nf, d, isnew in rows:
    if fl: print('  %s %s | %s%s' % (r['_shot'], k[:70], ' '.join(fl), '  <-- NEW' if nf else ''))
print('to look at (%d):' % len(look))
args = ['python3', '/home/claude/qa/r3/panel.py', sheet, '4', os.path.basename(new)]
for sc, k, r, fl, d, isnew in look[:mx]:
    print('  %s %s | diff %.1f %s %s' % (r['_shot'], k[:70], d, ' '.join(fl), 'NEW-ITEM' if isnew else ''))
    cap = (k.split('|', 1)[1][:44] + (' [' + ' '.join(fl) + ']' if fl else '') + (' NEW' if isnew else '')).replace('|', ' / ')
    args.append(os.path.join(new, r['_shot'] + '.jpg') + '|' + cap)
if len(args) > 5: subprocess.run(args, stdout=subprocess.DEVNULL)
