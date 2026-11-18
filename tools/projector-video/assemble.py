#!/usr/bin/env python3
"""Join the recorded frames into the projector MP4, in the order of the presentation.
   assemble.py list      write the concat list and print the parts' boundaries
   assemble.py encode    encode the MP4 (title card, fade in and out, silent stereo track)"""
import json, subprocess, sys

OUT = '/home/claude/usb/out'
TITLE = '/home/claude/usb/rec/title.jpg'
TITLE_S = 6.0
NAME = 'בית ראשון - לפי סדר הפסוקים במלכים - למקרן.mp4'
PLAN = [
    ('N1', lambda s: s <= 4),         # NARROW_300 (the panel 420): verses 0..4 (the job stopped in 5 when the chat went idle)
    ('N1b', lambda s: True),          # verses 5..23
    ('N2', lambda s: s <= 28),        # verses 24..28 (stopped in 29)
    ('N2b', lambda s: True),          # verses 29..46; the base's whole round under the follow view (FOLLOW_WHOLE_300)
    ('NT1', lambda s: True),          # the throne: Targum Sheni
    ('NT2', lambda s: True),          # the throne: Esther Rabbah..., Beit HaMidrash
]
# extra seconds on a slide's last frame: (job, slide) -> s. The ark's demonstration fills its slide to the end; its last caption rests a moment
EXTEND = {('N2b', 41): 5.0}
# frames added after a slide's last frame: the base's demonstration (a looping one) filled its slide, and its text pages 2 and 3 were
# composed from the panel (panel41.mjs 33) over the slide's last picture
INSERT = {}   # (2.0.18 / the first 3.0.0 cut: the base's slide ended at the marble tables, its pages 2-3 composed over its last frame)


def q40(d):
    return max(0.04, round(d / 0.04) * 0.04)


def build():
    lines = ['ffconcat version 1.0', f"file '{TITLE}'", f'duration {TITLE_S:.3f}']
    total = TITLE_S
    last = TITLE
    bounds = []
    for job, keep in PLAN:
        rows = [json.loads(l) for l in open(f'{OUT}/{job}/frames.jsonl')]
        rows = [r for r in rows if keep(r['s'])]
        for (j2, sl), ext in EXTEND.items():
            if j2 == job:
                idx = [i for i, r in enumerate(rows) if r['s'] == sl]
                if idx:
                    rows[idx[-1]]['d'] += ext
        for (j2, sl), extra in INSERT.items():
            if j2 == job:
                idx = [i for i, r in enumerate(rows) if r['s'] == sl]
                if idx:
                    k = idx[-1] + 1
                    rows[k:k] = [{'f': f, 'd': d, 's': sl} for f, d in extra]
        if not rows:
            raise SystemExit(f'no frames in {job}')
        bounds.append((job, rows[0]['s'], rows[-1]['s'], f"{OUT}/{job}/{rows[0]['f']}", f"{OUT}/{job}/{rows[-1]['f']}", round(total, 2)))
        for r in rows:
            p = f"{OUT}/{job}/{r['f']}"
            d = q40(r['d'])
            lines += [f"file '{p}'", f'duration {d:.3f}']
            total += d
            last = p
    lines.append(f"file '{last}'")
    open(f'{OUT}/all.ffconcat', 'w').write('\n'.join(lines) + '\n')
    return total, bounds


if __name__ == '__main__':
    total, bounds = build()
    for b in bounds:
        print(b)
    print(f'total {total:.1f} s = {total / 60:.1f} min')
    if len(sys.argv) > 1 and sys.argv[1] == 'encode':
        out = f'{OUT}/{NAME}'
        cmd = ['ffmpeg', '-y', '-v', 'error', '-stats', '-f', 'concat', '-safe', '0', '-i', f'{OUT}/all.ffconcat',
               '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
               '-vf', f'fps=25,format=yuv420p,fade=t=in:st=0:d=0.8,fade=t=out:st={total - 1.6:.2f}:d=1.5',
               '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-profile:v', 'main', '-level', '4.0',
               '-g', '50', '-keyint_min', '25', '-maxrate', '6M', '-bufsize', '12M',
               '-c:a', 'aac', '-b:a', '64k', '-map', '0:v', '-map', '1:a', '-t', f'{total:.3f}',
               '-map_metadata', '-1', '-metadata', 'title=בית המקדש הראשון — לפי סדר הפסוקים במלכים',
               '-movflags', '+faststart', out]
        subprocess.run(cmd, check=True)
        print('->', out)
