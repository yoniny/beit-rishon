#!/usr/bin/env python3
# contact sheets of a scan: python3 mksheets.py <scan dir> [cols] [rows] [only flagged: 1]
import json, sys, os
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1]; cols = int(sys.argv[2]) if len(sys.argv) > 2 else 3; rows = int(sys.argv[3]) if len(sys.argv) > 3 else 4; only = len(sys.argv) > 4 and sys.argv[4] == '1'
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
W = 560
def flags(r):
    f = []
    if r.get('err'): f.append('ERR')
    if r.get('f', 1) < 0.85: f.append('f=%s' % r.get('f'))
    if r.get('near', 0) > 0.25: f.append('near=%s' % r.get('near'))
    if r.get('close', 0) > 0.15: f.append('close=%s' % r.get('close'))
    if r.get('std', 99) < 12: f.append('std=%s' % r.get('std'))
    return f
recs = [json.loads(l) for l in open(os.path.join(d, 'vis.jsonl'), encoding='utf-8')]
items = []
for r in recs:
    if not r.get('shot'): continue
    fl = flags(r)
    if only and not fl: continue
    name = ('%d %s — %s' % (r['ri'], r['cap'][:26], (r.get('label') or '')[:30])) if r.get('kind') == 'row' else ('%d %s' % (r['i'], (r.get('t') or '')[:52]))
    items.append((r['shot'] + '.jpg', name, ' '.join(fl)))
    if r.get('shot2'): items.append((r['shot2'] + '.jpg', name + ' (אחרי 15 ש׳)', ''))
per = cols * rows; n = 0
for k in range(0, len(items), per):
    chunk = items[k:k + per]; th = None; ims = []
    for fn, cap, fl in chunk:
        im = Image.open(os.path.join(d, fn)).convert('RGB'); h = int(im.height * W / im.width); ims.append((im.resize((W, h), Image.LANCZOS), cap, fl)); th = h
    S = Image.new('RGB', (cols * W, rows * (th + 24)), (30, 30, 30)); g = ImageDraw.Draw(S)
    for j, (im, cap, fl) in enumerate(ims):
        x, y = (j % cols) * W, (j // cols) * (th + 24); S.paste(im, (x, y + 24))
        g.rectangle([x, y, x + W - 1, y + 23], fill=(120, 20, 20) if fl else (20, 20, 20))
        tw = g.textlength(cap, font=F, direction='rtl'); g.text((x + W - tw - 6, y + 3), cap, fill='white', font=F, direction='rtl')
        if fl: g.text((x + 6, y + 3), fl, fill=(255, 220, 120), font=F)
    out = os.path.join(d, ('flag' if only else 'sheet') + '%02d.jpg' % n); S.save(out, quality=80); n += 1
print(d, len(items), 'pictures ->', n, 'sheets')
