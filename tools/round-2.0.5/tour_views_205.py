# TOUR_VIEWS_205 - the tables of further views inside a slide (the user, 12.11.2026 12:14: "אם יש בשקופית להראות כמה מיצגים, אז בתוך
# אותה השקופית, המבט מסתובב"). Each view was tried by qa/r3/tourstops.mjs and looked at in a picture (the sheets ts1, ts1b, ts2, ts2b);
# only the accepted ones are written. B1: into beit-rishon/src/75-tour.js between the markers. B2: tools/tour_views_b2.json, which
# tools/port_tour.py puts into its own copy of the table. Idempotent (the tables are rewritten whole).
import io, json, os, re
R3 = '/home/claude/qa/r3'
def load(d):
    out = {}
    for l in io.open(os.path.join(R3, d, 'views.jsonl'), encoding='utf-8'):
        r = json.loads(l); out[r['title']] = r
    return out
def pick(recs, title, idx):
    r = next(v for k, v in recs.items() if k == title or k.startswith(title))
    vs = [v for v in r['out'] if v.get('why') != 'own']
    res = []
    for i in idx:
        v = vs[i]; cam = v['cam']
        e = v.get('end')
        if e and max(abs(e[k] - cam[k]) for k in range(3)) > 0.6: cam = e      # the engine moved the eye: the view as it was photographed
        res.append([[round(x, 2) for x in cam], [round(x, 2) for x in v['tg']]])
    return r['title'], res
def table(spec):
    T = {}
    for d, items in spec:
        recs = load(d)
        for title, idx in items:
            t, vs = pick(recs, title, idx); T[t] = vs
    return T
B1 = table([('ts1', [('לשכת הגזית', [0, 1]), ('בית המטבחים', [1]), ('שערי חצר הכהנים', [0]), ('פשפשי בית החליפות', [0]), ('מנורת משה ועשר המנורות', [0, 1]),
                    ('שולחן משה ועשרה השולחנות', [0]), ('שולחנות האולם', [0, 1]), ('הארון ובדיו', [0]), ('החצר האחרת', [0])]),
            ('ts1b', [('הכרובים', [0, 2])])])   # (the view from above repeated the slide's own view, under a label's giant letters - dropped after the final scan)
B2 = table([('ts2', [('שער ניקנור', [0]), ('לשכת הנזירים', [0, 1]), ('לשכת המצורעים', [0]), ('לשכת שמנים', [0, 1, 2]), ('לשכת הגזית — הסנהדרין', [0, 1]),
                    ('בית המוקד', [0, 1]), ('לשכת בית אבטינס', [0]), ('לשכת המדיחין', [0]), ('לשכת הפרוה', [1]), ('מידות המזבח', [0]), ('בית המטבחיים', [0]),
                    ('כבשים קטנים — רש', [0]), ('כבשים קטנים — תוספות', [0]), ('הכבש הגדול', [0]), ('שלחנות האולם', [0, 1]), ('המנורה', [0]),
                    ('פתח העלייה ופנים העלייה', [0])]),
            ('ts2b', [('המזבח', [0]), ('פשפשי בית החליפות', [0])])])
assert 'בית המטבחים — מקרוב' not in B1
def js(T): return '{\n' + ',\n'.join('    %s: %s' % (json.dumps(k, ensure_ascii=False), json.dumps(v)) for k, v in T.items()) + '\n  }'
p = '/home/claude/beit-rishon/src/75-tour.js'; s = io.open(p, encoding='utf-8').read()
a = s.index('  // TOUR_VIEWS_205 BEGIN'); b = s.index('  // TOUR_VIEWS_205 END')
new = ('  // TOUR_VIEWS_205 BEGIN (tools204/tour_views_205.py writes this table: a place\'s further views, [eye, look point] each, tried and looked at in pictures)\n'
       '  var tour_VIEWS = ' + js(B1) + ';\n')
s2 = s[:a] + new + s[b:]
if s2 != s: io.open(p, 'w', encoding='utf-8').write(s2)
json.dump(B2, io.open('/home/claude/b2src/tools/tour_views_b2.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
p = '/home/claude/b2src/tools/port_tour.py'; s = io.open(p, encoding='utf-8').read()
if 'tour_views_b2.json' not in s:
    k = s.index('rep_span("  var tour_MODES = [", "  ];"')
    s = s[:k] + ('# TOUR_VIEWS_205: the Second House\'s own table of further views (tools/tour_views_b2.json, written by tools204/tour_views_205.py)\n'
                 'import json as _json, os as _os\n'
                 '_tv = _json.load(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "tour_views_b2.json"), encoding="utf-8"))\n'
                 'rep_span("  // TOUR_VIEWS_205 BEGIN", "  // TOUR_VIEWS_205 END", "  // TOUR_VIEWS_205 BEGIN (tools/tour_views_b2.json)\\n  var tour_VIEWS = " + _json.dumps(_tv, ensure_ascii=False) + ";\\n  // TOUR_VIEWS_205 END\\n", include_end=True, desc="tour views")\n') + s[k:]
    io.open(p, 'w', encoding='utf-8').write(s)
print('B1', len(B1), sum(len(v) for v in B1.values()), '| B2', len(B2), sum(len(v) for v in B2.values()))
for k, v in list(B1.items())[:2]: print(k, v)
