# contact sheets of a places sweep: python3 mksheet.py <dir> <from> <to> <out.png>  (12 to a sheet, the title and the flags on each)
import json, sys, os
from PIL import Image, ImageDraw, ImageFont
d, a, b, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
recs = {}
for ln in open(os.path.join(d, 'places.jsonl'), encoding='utf-8'):
    r = json.loads(ln); recs[r['i']] = r
ids = [i for i in range(a, b + 1) if os.path.exists(os.path.join(d, 'p%03d.png' % i))]
W, H, cols = 640, 400, 4
rows = (len(ids) + cols - 1) // cols
S = Image.new('RGB', (W * cols, (H + 26) * rows), 'white'); g = ImageDraw.Draw(S)
for k, i in enumerate(ids):
    im = Image.open(os.path.join(d, 'p%03d.png' % i)).convert('RGB').resize((W, H))
    x, y = (cols - 1 - k % cols) * W, (k // cols) * (H + 26)
    S.paste(im, (x, y + 26))
    r = recs.get(i, {})
    fl = []
    if r.get('dpos') is not None and r['dpos'] > 3: fl.append('d=%s' % r['dpos'])
    if r.get('ray') and r['ray'].get('f') is not None and r['ray']['f'] < 0.9: fl.append('ray=%s' % r['ray']['f'])
    if r.get('errs'): fl.append('ERR')
    cap = '%d. %s %s' % (i, (r.get('full') or r.get('t') or '')[:44], ' '.join(fl))
    tw = g.textlength(cap, font=F, direction='rtl')
    g.text((x + W - tw - 6, y + 4), cap, fill='black', font=F, direction='rtl')
S.save(out, quality=85)
print(out, len(ids), S.size)
