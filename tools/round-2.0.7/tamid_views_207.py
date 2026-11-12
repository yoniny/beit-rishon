#!/usr/bin/env python3
# TAMID_VIEWS_207 (12.11.2026 ~20:30): the stages whose eye stood inside a wall in the current model (the pictures qa/tamid/lv1; the
# line from the place to the eye tested by TM.qaClear - qa/tamid/views.mjs, clear.mjs, hits.mjs). The other chat's read-me: "בכמה שלבים
# המצלמה קרובה מדי לקיר, או בתוכו. כך גם בשלב הראשון, בית המוקד":
#   moked, lot1 (Abaye's order) - the eye [0, 50, -44] / [-6, 42, -46] stood in the ulam's north wing (and over a gate's leaf): now from the
#     south-east, over the court's north side, into Beit HaMoked (its roofs open - the stage's own a.roofs()): [-5, 44.6, -51];
#   patrol - its first eye looked through the leaf of the wicket's gate, its second at the house's north wall (house-shell): the first
#     [-4, 46, -62] -> [-18, 15, -60], held to the ninth second, then up to the view of the whole court as before;
#   lamb - the eye [-30, 32, -38] stood inside the house's shell: now [-26, 40, -52] -> [-24, 14.5, -62], the door of the lambs' chamber.
# Idempotent.
import os
p = '/home/claude/b2src/src/55-tamid.js'; s = open(p, encoding='utf-8').read()
if 'TAMID_VIEWS_207' in s:
    print('tamid_views_207: already'); raise SystemExit(0)
pairs = [
    ('      moked: () => [[0, 50, -44], [-18, 13.5, -69]],\n',
     '      // TAMID_VIEWS_207: the eyes that stood inside a wall in the current model (moked, lot1, patrol, lamb) - from where the place is seen\n'
     '      moked: () => [[-5, 44.6, -51], [-18, 13.5, -69]],\n'),
    ('      lot1: (o) => (o === "rambam" ? GZV : [[-6, 42, -46], [-18, 14, -68]]),\n',
     '      lot1: (o) => (o === "rambam" ? GZV : [[-5, 44.6, -51], [-18, 15.5, -68]]),\n'),
    ('      lamb: () => [[-30, 32, -38], [-19, 14.5, -55]],\n',
     '      lamb: () => [[-26, 40, -52], [-24, 14.5, -62]],\n'),
    ('      patrol: () => [[0, [-2, 52, -30], [-18, 15, -58]], [9, [8, 74, -8], [-10, 16, -50]], ',
     '      patrol: () => [[0, [-4, 46, -62], [-18, 15, -60]], [9, [-4, 46, -62], [-18, 15, -60]], '),
]
for a, b in pairs:
    assert s.count(a) == 1, a[:70]
    s = s.replace(a, b)
open(p, 'w', encoding='utf-8').write(s); print('tamid_views_207 ok')
