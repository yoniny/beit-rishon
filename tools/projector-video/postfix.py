#!/usr/bin/env python3
"""Hide a text line cut by the bottom edge of the text panel's body (frames recorded before the curtain existed).
   postfix.py A [--edge-for SLIDE=Y ...]   processes every frame listed in <job>/frames.jsonl, in place.
   A line is "cut" when it has ink in the last two rows above the body's bottom edge; it is painted over with the panel's colour."""
import json, sys
import numpy as np
from PIL import Image

job = sys.argv[1]
OUT = '/home/claude/usb/out'
EDGE = 674                         # the body's bottom edge (box bottom 720 - margin 46) when no bubble stands under it
edges = {}
for a in sys.argv[2:]:
    if '=' in a:
        s, y = a.split('=')
        edges[int(s)] = int(y)
BG = np.array([14, 18, 29])
X0, X1, FILL_X1 = 24, 516, 536
done = fixed = 0
for l in open(f'{OUT}/{job}/frames.jsonl'):
    x = json.loads(l)
    p = f'{OUT}/{job}/{x["f"]}'
    edge = edges.get(x['s'], EDGE)
    im = np.asarray(Image.open(p).convert('RGB')).astype(np.int16)
    ink = (im[:, X0:X1].max(axis=2) > 70).sum(axis=1)
    done += 1
    if ink[edge - 1] == 0 and ink[edge - 2] == 0:
        continue
    y = edge - 1
    while y > 0 and ink[y - 1] > 0:
        y -= 1
    top = max(0, y - 2)
    out = im.copy()
    out[top:edge, 0:FILL_X1] = BG
    Image.fromarray(out.astype(np.uint8)).save(p, quality=92)
    fixed += 1
print(f'{job}: {done} frames checked, {fixed} fixed')
