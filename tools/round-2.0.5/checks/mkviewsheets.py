#!/usr/bin/env python3
# sheets of the candidate views: one row a slide - its own view and the proposed further ones (tourviews.mjs)
#   python3 mkviewsheets.py <dir> [rows per sheet = 6] [only slides: a,b,c]
import json, sys, os
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1]; RPS = int(sys.argv[2]) if len(sys.argv) > 2 else 6
only = set(int(x) for x in sys.argv[3].split(',')) if len(sys.argv) > 3 else None
recs = [json.loads(l) for l in open(os.path.join(d, 'views.jsonl'), encoding='utf-8')]
recs = [r for r in recs if 'out' in r and (only is None or r['i'] in only)]
W, H, COLS = 420, 190, 5
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
except Exception: F = ImageFont.load_default()
def heb(s):
    try:
        from bidi.algorithm import get_display
        return get_display(s)
    except Exception: return s[::-1] if any('֐' <= ch <= '׿' for ch in s) else s
n = 0
for k in range(0, len(recs), RPS):
    chunk = recs[k:k + RPS]
    im = Image.new('RGB', (COLS * W, len(chunk) * (H + 22)), (14, 20, 34)); dr = ImageDraw.Draw(im)
    for r_i, r in enumerate(chunk):
        y = r_i * (H + 22)
        dr.text((6, y + 3), '%d  D %s  then %s  |  %s' % (r['i'], r.get('D'), r.get('then'), heb(r['title'][:60])), fill=(240, 220, 150), font=F)
        for v in range(0, min(COLS, len(r['out']) + 1)):
            p = os.path.join(d, '%s_v%d.jpg' % (r['name'], v))
            if not os.path.exists(p): continue
            t = Image.open(p).convert('RGB'); w0, h0 = t.size
            # the model's part of the page (between the card at the left and the panel at the right)
            t = t.crop((int(w0 * 0.2), 0, int(w0 * 0.86), int(h0 * 0.9))).resize((W - 4, H))
            im.paste(t, (v * W + 2, y + 20))
            if v > 0: dr.text((v * W + 6, y + 24), '%d: %s' % (v, heb(r['out'][v - 1]['why'][:44])), fill=(255, 255, 255), font=F, stroke_width=2, stroke_fill=(0, 0, 0))
    name = os.path.join(d, 'vsheet%02d.jpg' % n); im.save(name, quality=80); n += 1
print(n, 'sheets', len(recs), 'slides')
