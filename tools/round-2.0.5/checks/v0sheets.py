#!/usr/bin/env python3
# sheets of every slide's own view (the v0 pictures of tourviews.mjs / tourstops.mjs): python3 v0sheets.py <dir> [cols=6] [rows=6]
import json, sys, os
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1]; COLS = int(sys.argv[2]) if len(sys.argv) > 2 else 6; ROWS = int(sys.argv[3]) if len(sys.argv) > 3 else 6
recs = [json.loads(l) for l in open(os.path.join(d, 'views.jsonl'), encoding='utf-8')]
recs = [r for r in recs if os.path.exists(os.path.join(d, r['name'] + '_v0.jpg'))]
W, H = 350, 170
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
def heb(s):
    try:
        from bidi.algorithm import get_display
        return get_display(s)
    except Exception: return s[::-1]
n = 0
for k in range(0, len(recs), COLS * ROWS):
    chunk = recs[k:k + COLS * ROWS]; rows = (len(chunk) + COLS - 1) // COLS
    im = Image.new('RGB', (COLS * W, rows * (H + 18)), (14, 20, 34)); dr = ImageDraw.Draw(im)
    for j, r in enumerate(chunk):
        x, y = (j % COLS) * W, (j // COLS) * (H + 18)
        t = Image.open(os.path.join(d, r['name'] + '_v0.jpg')).convert('RGB'); w0, h0 = t.size
        t = t.crop((int(w0 * 0.2), int(h0 * 0.07), int(w0 * 0.86), int(h0 * 0.9))).resize((W - 4, H))
        im.paste(t, (x + 2, y + 17))
        dr.text((x + 4, y + 2), '%d %s' % (r['i'], heb(r['title'][:38])), fill=(240, 220, 150), font=F)
    name = os.path.join(d, 'v0sheet%02d.jpg' % n); im.save(name, quality=80); n += 1
print(n, 'sheets', len(recs), 'slides')
