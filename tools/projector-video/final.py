#!/usr/bin/env python3
"""Encode the video in two segments (so the first can start while the last part is still recorded), then join them.
   final.py seg1      title + every part but the last, fade in        -> out/seg1.mp4  (one encoder thread)
   final.py seg2      the last part, fade out                          -> out/seg2.mp4
   final.py mux       join (stream copy) + silent stereo AAC + faststart -> out/<NAME>"""
import json, subprocess, sys
import assemble as A

OUT = A.OUT
VENC = ['-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-profile:v', 'main', '-level', '4.0',
        '-g', '250', '-keyint_min', '25', '-maxrate', '6M', '-bufsize', '12M', '-pix_fmt', 'yuv420p']


def listfile(parts, title, name):
    lines = ['ffconcat version 1.0']
    total = 0.0
    last = None
    if title:
        lines += [f"file '{A.TITLE}'", f'duration {A.TITLE_S:.3f}']
        total += A.TITLE_S
        last = A.TITLE
    for job, keep in parts:
        rows = [json.loads(l) for l in open(f'{OUT}/{job}/frames.jsonl')]
        rows = [r for r in rows if keep(r['s'])]
        for (j2, sl), ext in A.EXTEND.items():
            if j2 == job:
                idx = [i for i, r in enumerate(rows) if r['s'] == sl]
                if idx:
                    rows[idx[-1]]['d'] += ext
        for (j2, sl), extra in A.INSERT.items():
            if j2 == job:
                idx = [i for i, r in enumerate(rows) if r['s'] == sl]
                if idx:
                    k = idx[-1] + 1
                    rows[k:k] = [{'f': f, 'd': d, 's': sl} for f, d in extra]
        for r in rows:
            p = f"{OUT}/{job}/{r['f']}"
            d = A.q40(r['d'])
            lines += [f"file '{p}'", f'duration {d:.3f}']
            total += d
            last = p
    lines.append(f"file '{last}'")
    open(f'{OUT}/{name}.ffconcat', 'w').write('\n'.join(lines) + '\n')
    return total


def enc(name, total, vf_extra, threads):
    vf = 'fps=25,format=yuv420p' + (',' + vf_extra if vf_extra else '')
    cmd = ['ffmpeg', '-y', '-v', 'error', '-stats', '-f', 'concat', '-safe', '0', '-i', f'{OUT}/{name}.ffconcat',
           '-vf', vf, *VENC, '-threads', str(threads), '-an', '-t', f'{total:.3f}', f'{OUT}/{name}.mp4']
    subprocess.run(cmd, check=True)


if __name__ == '__main__':
    what = sys.argv[1]
    if what == 'seg1':
        t = listfile(A.PLAN[:-1], True, 'seg1')
        print('seg1', round(t, 2))
        enc('seg1', t, 'fade=t=in:st=0:d=0.8', 2)
    elif what == 'seg2':
        t = listfile(A.PLAN[-1:], False, 'seg2')
        print('seg2', round(t, 2))
        enc('seg2', t, f'fade=t=out:st={t - 1.6:.2f}:d=1.5', 2)
    elif what == 'mux':
        open(f'{OUT}/segs.txt', 'w').write(f"file '{OUT}/seg1.mp4'\nfile '{OUT}/seg2.mp4'\n")
        out = f'{OUT}/{A.NAME}'
        cmd = ['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', f'{OUT}/segs.txt', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
               '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '64k', '-shortest',
               '-map_metadata', '-1', '-metadata', 'title=בית המקדש הראשון — לפי סדר הפסוקים במלכים', '-movflags', '+faststart', out]
        subprocess.run(cmd, check=True)
        print('->', out)
