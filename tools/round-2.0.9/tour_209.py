# -*- coding: utf-8 -*-
# 2.0.9 (TOUR_DEMO_PAUSE_209; the full review, 13.11.2026): the presentation's "⏸" pauses the slide's demonstration too, and its "▶"
# resumes it (90-entry.js DEMO_PAUSE_207) - until 2.0.8 the banner's press reached the switch rule of 90-entry.js and ENDED it.
# The same patch as Beit Rishon's src/75-tour.js. Run after port_tour.py and tour_200.py (tools/chain.sh). Idempotent.
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'src', '75-tour.js')
s = open(P, encoding='utf-8').read()
if 'TOUR_DEMO_PAUSE_209' in s:
    print('tour_209: already applied'); raise SystemExit(0)
old = open('/home/claude/tools209/setpaused_old.txt', encoding='utf-8').read()
new = open('/home/claude/tools209/setpaused_new.txt', encoding='utf-8').read()
if s.count(old) != 1:
    raise SystemExit('tour_209: anchor found %d times' % s.count(old))
s = s.replace(old, new)
# TAMID_STOP_209: a place whose action starts a presentation of its own (the morning's service) is shown in the topics without it
o2 = "          pf: placeOwnFeat(p), act: placeAct(p), actOnly: !!(placeAct(p) && !placeOwnCam(p)),   // 1.3.5 / 1.9.3"
n2 = "          pf: placeOwnFeat(p), act: p.item && p.item.tourNoAct ? null : placeAct(p), actOnly: !!(placeAct(p) && !placeOwnCam(p) && !(p.item && p.item.tourNoAct)),   // 1.3.5 / 1.9.3; TAMID_STOP_209"
if s.count(o2) != 1:
    raise SystemExit('tour_209: placeSlide anchor found %d times' % s.count(o2))
s = s.replace(o2, n2)
open(P, 'w', encoding='utf-8').write(s)
print('tour_209 ok')
