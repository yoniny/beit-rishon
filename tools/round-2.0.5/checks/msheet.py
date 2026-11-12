#!/usr/bin/env python3
# a contact sheet with captions: python3 msheet.py <out.jpg> <cols> <thumb width> <file>...   (the caption = the file's stem)
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, cols, W = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); files = [f for f in sys.argv[4:] if os.path.exists(f)]
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
except Exception: F = ImageFont.load_default()
ims = [Image.open(f).convert('RGB') for f in files]
H = max(int(W * im.size[1] / im.size[0]) for im in ims); rows = (len(ims) + cols - 1) // cols
sh = Image.new('RGB', (cols * W, rows * (H + 20)), (14, 20, 34)); dr = ImageDraw.Draw(sh)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * W, (i // cols) * (H + 20)
    sh.paste(im.resize((W - 4, int((W - 4) * im.size[1] / im.size[0]))), (x + 2, y + 20))
    dr.text((x + 6, y + 2), os.path.splitext(os.path.basename(f))[0], fill=(250, 225, 140), font=F)
sh.save(out, quality=82); print(out, sh.size, len(ims))
