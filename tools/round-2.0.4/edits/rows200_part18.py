# -*- coding: utf-8 -*-
# B2 1.9.5 - THE PRESENTATIONS' FIXES AFTER THE HELPER'S SCAN (qa/r3/FORK_TOUR_REPORT.md; each camera checked by me): places whose
# slide showed little or nothing get a better camera, or further cameras (tourThen - the slide flies on to each). TOURFIX_195.
# With it: src/30-courts.js GUARDS_FAR_195 (discs over the guards' posts), PINCHAS_195 (the cupboard open to the room);
# src/20-mount.js the royal stoa's fly point; tools/port_ui.py the view places' further cameras. Idempotent.
import io, re
T = '/home/claude/b2src/tools/'
def edit(path, fn):
    s = io.open(path, encoding='utf-8').read()
    s2 = fn(s)
    if s2 != s:
        io.open(path, 'w', encoding='utf-8').write(s2)
        print(path.split('/')[-1], 'edited')
    else:
        print(path.split('/')[-1], 'unchanged')

PART = r'''# ---------------------------------------------------------------- 18. THE PRESENTATIONS' FIXES: CAMERAS AND FURTHER CAMERAS OF PLACES (TOURFIX_195)
# The presentations' scan (11.11.2026; the user, 14:24: "יש כרטיסים שלא מראים כלום", "אם כרטיס אחד ... מציג כמה דברים המצגת צריכה להציג
# את כולם באותו הכרטיס"). Each camera was looked at in a picture before it was written here.
def _pl(t):
    return next(x for g_, items in c['PLACES'] for x in items if x['t'] == t)
_p = _pl('שתי הסנהדראות הקטנות'); _p['tourThen'] = [{'cam': [251.5, 30, 10], 'tg': [251.5, 2, -14.5]}]                 # the second of the two
_p = _pl('דוכן הלויים'); _p['cam'] = [89.2, 16.4, 22]; _p['tg'] = [87, 14.8, 2]                                        # along it, from its north end (from the west it read as a low wall)
_p = _pl('לשכת עושי חביתין'); _p['cam'] = [98, 16.5, 27.1]; _p['tg'] = [98, 7.2, 22.6]; _p['tourThen'] = [{'cam': [95, 12, 27], 'tg': [99.2, 7.3, 22.4]}]   # (the open door's leaf lay across the view)
_p = _pl('לשכת פנחס המלביש'); _p['cam'] = [100.6, 16.2, -24]; _p['tg'] = [97.4, 9.3, -24]                                # from above the rail, down on the cupboard's shelves (PINCHAS_195 brought it out of the wall and opened it)
_p = _pl('כלונסות הארז שבאולם'); _p['tourThen'] = [{'cam': [7, 26, 30], 'tg': [7, 60, 2]}]                              # from below
_p = _pl('שתי הפרוכות — בין הקודש לקודש הקדשים'); _p['section'] = {'axis': 'z', 'v': 9.2, 'ms': 15000}; _p['cam'] = [-38, 36, 22]; _p['tg'] = [-45.5, 31, 2]
_p.pop('tourThen', None)                                                                                         # (the camera stood inside the one-cubit space, the cloth filled the picture; a second camera from the south showed a blank wall - none)
_p = _pl('המשמרות — שלושה לכהנים ועשרים ואחד ללויים'); _p['cam'] = [103, 700, 215]; _p['tg'] = [103, 0, 82.5]                 # the whole mount (from 430 only its middle was seen); GUARDS_FAR_195 draws a disc over every post
_p['tourThen'] = [{'cam': [-20, 250, 150], 'tg': [-20, 20, 0]}]                                                        # the court: the priests' three and the Levites' at its gates and corners
_p = _pl('פתיחת השער הגדול — הדגמה'); _p['tourThen'] = [{'cam': [-21, 33, 6], 'tg': [-2, 31, 0]}]                       # after the demonstration: the open doors (it rested on a view without them)
'''
MARK = '# ---------------------------------------------------------------- 99. WALK_SORT'
HEAD = "# ---------------------------------------------------------------- 18. THE PRESENTATIONS' FIXES"
def f_rows200(s):
    if 'TOURFIX_195' in s:
        i0 = s.index(HEAD)
        m = re.search(r'\n# -{60,} \d+\. ', s[i0 + 10:])
        i1 = i0 + 10 + m.start() + 1 if m else s.index(MARK)
        return s[:i0] + PART + s[i1:]
    assert s.count(MARK) == 1
    return s.replace(MARK, PART + MARK)
edit(T + 'rows_200.py', f_rows200)

def f_port(s):
    if 'TOURFIX_195' in s:
        return s
    a = 'view_item = lambda t, key, fk=None, op=None: {"t": t, "key": key, "featureKey": fk, "openPill": op}\n'
    assert s.count(a) == 1, s.count(a)
    s = s.replace(a, '# TOURFIX_195: a view place may name further cameras for its slide (th)\n'
                     'view_item = lambda t, key, fk=None, op=None, th=None: {"t": t, "key": key, "featureKey": fk, "openPill": op, "tourThen": th}\n')
    b = 'view_item("הסטיו המלכותי", "royalStoa")]'
    assert s.count(b) == 1, s.count(b)
    s = s.replace(b, 'view_item("הסטיו המלכותי", "royalStoa", None, None, [{"cam": [103, 44, 210], "tg": [103, 24, 322]}])]')
    d = 'view_item("האולם", "ulam", None, "hei-ulam")'
    assert s.count(d) == 1, s.count(d)
    s = s.replace(d, 'view_item("האולם", "ulam", None, "hei-ulam", [{"cam": [62, 58, 14], "tg": [15, 56, 0]}, {"cam": [117, 62, 0.5], "tg": [17, 62, 0]}])')
    return s
edit(T + 'port_ui.py', f_port)

def f_mount(s):
    a = '      royalStoa: { pos: [100, 60, 480], target: [100, 20, 310] }'
    if a not in s:
        return s
    return s.replace(a, '      royalStoa: { pos: [220, 34, 262], target: [60, 22, 312] }   // TOURFIX_195: inside the mount, along its columns (from outside the wall they were hidden)')
edit('/home/claude/b2src/src/20-mount.js', f_mount)
