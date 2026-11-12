# compose report pictures: python3 panel.py <out.jpg> <cols> <title> <img>|<caption> ...
# each picture is cropped to the model area (0,56,870,620) unless the name ends with "!" (kept whole)
import sys
from PIL import Image, ImageDraw, ImageFont
out, cols, title = sys.argv[1], int(sys.argv[2]), sys.argv[3]
items = [a.split('|', 1) for a in sys.argv[4:]]
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
ft, fc = ImageFont.truetype(F, 30), ImageFont.truetype(F, 22)
W, H, PAD, CAP = 870, 564, 14, 44
tiles = []
for p, cap in items:
    whole = p.endswith('!')
    im = Image.open(p.rstrip('!')).convert('RGB')
    if not whole:
        im = im.crop((0, 56, min(870, im.width), min(620, im.height)))
    im = im.resize((W, int(im.height * W / im.width)))
    if im.height != H:
        c = Image.new('RGB', (W, H), (20, 26, 40)); c.paste(im, (0, max(0, (H - im.height) // 2))); im = c.crop((0, 0, W, H))
    tiles.append((im, cap))
rows = (len(tiles) + cols - 1) // cols
TH = 64 if title else 0
sheet = Image.new('RGB', (PAD + cols * (W + PAD), TH + PAD + rows * (H + CAP + PAD)), (16, 22, 36))
d = ImageDraw.Draw(sheet)
def rtl(xy, s, f, fill, anchor):
    try: d.text(xy, s, font=f, fill=fill, anchor=anchor, direction='rtl')
    except Exception: d.text(xy, s[::-1], font=f, fill=fill, anchor=anchor)
if title: rtl((sheet.width - PAD - 6, 34), title, ft, (240, 214, 150), 'rm')
for i, (im, cap) in enumerate(tiles):
    r, c = divmod(i, cols)
    x = sheet.width - (c + 1) * (W + PAD)      # right to left
    y = TH + PAD + r * (H + CAP + PAD)
    d.rectangle([x, y, x + W, y + CAP], fill=(34, 44, 66))
    rtl((x + W - 12, y + CAP // 2), cap, fc, (255, 255, 255), 'rm')
    sheet.paste(im, (x, y + CAP))
sheet.save(out, quality=88)
print(out, sheet.size)
