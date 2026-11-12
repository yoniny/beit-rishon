#!/usr/bin/env python3
# contact sheets of a presentation scan (tourscan.mjs): python3 mktsheets.py <scan dir> [cols] [rows] [from] [to] [suffix]
# every picture with its number, its kind and its title; a red caption where the measure flagged the view
import json, sys, os
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1]; cols = int(sys.argv[2]) if len(sys.argv) > 2 else 3; rows = int(sys.argv[3]) if len(sys.argv) > 3 else 4
a = int(sys.argv[4]) if len(sys.argv) > 4 else 0; b = int(sys.argv[5]) if len(sys.argv) > 5 else 10 ** 6; suf = sys.argv[6] if len(sys.argv) > 6 else ''
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
W = 560
def flags(r):
    f = []
    if r.get('f', 1) < 0.85: f.append('f=%s' % r.get('f'))
    if r.get('near', 0) > 0.25: f.append('near=%s' % r.get('near'))
    if r.get('close', 0) > 0.15: f.append('close=%s' % r.get('close'))
    if r.get('std', 99) < 12: f.append('std=%s' % r.get('std'))
    return f
recs = {}
for l in open(os.path.join(d, 'vis.jsonl'), encoding='utf-8'):
    r = json.loads(l); recs[r['i']] = r
items = []
for i in sorted(recs):
    if i < a or i > b: continue
    r = recs[i]; fl = flags(r)
    fn = r['name'] + suf + '.jpg'
    if not os.path.exists(os.path.join(d, fn)): continue
    k = {'view': 'מבט', 'place': 'מקום', 'opinion': 'שיטה', 'verse': 'פסוק', 'throne': 'כסא'}.get(r.get('kind'), r.get('kind') or '')
    items.append((fn, '%d %s · %s' % (i, k, (r.get('title') or '')[:44]), ' '.join(fl)))
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
    out = os.path.join(d, 'sheet%s%02d.jpg' % (suf, n)); S.save(out, quality=82); n += 1
print(d, len(items), 'pictures ->', n, 'sheets')
