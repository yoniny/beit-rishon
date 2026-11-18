#!/usr/bin/env python3
"""Contact sheets for checking a recorded job: per slide its first frame, the frame where the slow move ends, and each text page.
   qa_sheets.py A  ->  /home/claude/usb/out/qa-A-N.jpg"""
import json, subprocess, sys, os
from collections import OrderedDict

job = sys.argv[1]
OUT = '/home/claude/usb/out'
rows = [json.loads(l) for l in open(f'{OUT}/{job}/frames.jsonl')]
by = OrderedDict()
for r in rows:
    by.setdefault(r['s'], []).append(r)
tiles = []
for s, fr in by.items():
    pick = [fr[0]]
    # the long holds: the end of the move (page 1) and the other pages
    pick += [x for x in fr if x['d'] > 3]
    # a frame in the middle of the slow move, if there is one
    moves = [i for i, x in enumerate(fr) if abs(x['d'] - 0.08) < 1e-6]
    if moves:
        pick.insert(1, fr[moves[len(moves) // 2]])
    seen = set()
    for x in pick:
        if x['f'] in seen:
            continue
        seen.add(x['f'])
        lab = f"{OUT}/{job}/qa_{os.path.basename(x['f'])}"
        subprocess.run(['convert', f"{OUT}/{job}/{x['f']}", '-resize', '480x270', '-gravity', 'NorthEast', '-pointsize', '20', '-fill', 'yellow',
                        '-stroke', 'black', '-strokewidth', '1', '-annotate', '+6+4', f"{s + 1}  {x['d']:.1f}s", lab], check=True)
        tiles.append(lab)
for k in range(0, len(tiles), 12):
    subprocess.run(['montage', *tiles[k:k + 12], '-tile', '3x4', '-geometry', '+3+3', '-background', '#222', f'{OUT}/qa-{job}-{k // 12 + 1}.jpg'], check=True)
print(len(tiles), 'tiles,', (len(tiles) + 11) // 12, 'sheets')
