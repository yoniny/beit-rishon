#!/usr/bin/env python3
# TOUR_TIMES_205 + TOUR_VIEWS_205 - the presentation's engine, both copies (beit-rishon/src/75-tour.js = the First House; b1/src/75-tour.js =
# the copy that port_tour.py carries to the Second House). The user, 12.11.2026 12:14: "זה ארוך מדי. צריך להיות 7 שניות לכרטיס במצב מהיר ...
# במצב רגיל 10, במצב איטי 12. דבר שני, אמרנו, אם יש בשקופית להראות כמה מיצגים, אז בתוך אותה השקופית, המבט מסתובב". Idempotent.
for f in ['/home/claude/beit-rishon/src/75-tour.js', '/home/claude/b1/src/75-tour.js']:
    s = open(f, encoding='utf8').read()
    if 'TOUR_TIMES_205' not in s:
        a = s.index('        // 1.3.7 / 1.9.5 (TOUR_ENGINE_204B): a slide of three cameras and more gets 2.5 s for each camera after the second')
        b = s.index('        return Math.max(9000, Math.min(45000, 2500 + 55 * n)) * speed;\n', a) + len('        return Math.max(9000, Math.min(45000, 2500 + 55 * n)) * speed;\n')
        s = s[:a] + '''        // TOUR_TIMES_205 (the user, 12.11.2026 12:14: "זה ארוך מדי. צריך להיות 7 שניות לכרטיס במצב מהיר ... במצב רגיל 10, במצב איטי 12"):
        // a slide's time goes by the chosen pace alone, in every mode - no longer by the length of its text (9 to 45 seconds until
        // 2.0.4); a slide of several views gets no less than three seconds a view (told to the user 12:20)
        const base = speed >= 1.3 ? 12000 : speed <= 0.75 ? 7000 : 10000;
        return Math.max(base, (1 + (Array.isArray(s.then) ? s.then.length : 0)) * 3000);
''' + s[b:]
        a = 'desc: "אותן שקופיות ברצף, כשבע שניות לכל אחת (עליית המלך לכסא — כאורכה), בתנועה איטית ובלולאה עד לעצירה." }'
        assert s.count(a) == 1
        s = s.replace(a, 'desc: "אותן שקופיות ברצף, בתנועה איטית ובלולאה עד לעצירה." }')
        a = 'tip(spdLab, "קצב המצגת: זמן ההצגה של כל שקופית");'
        assert s.count(a) == 1
        s = s.replace(a, 'tip(spdLab, "קצב המצגת: מהיר — 7 שניות לשקופית, רגיל — 10, איטי — 12");')
    if 'TOUR_VIEWS_205' not in s:
        a = '''        const L = (Array.isArray(own) ? own : []).concat(extra || [])
'''
        assert s.count(a) == 1
        s = s.replace(a, '''        // TOUR_VIEWS_205: where a place has no further views of its own - the table's (the thing seen from its sides, each view looked at)
        const tv = p && tour_VIEWS[p.title], none = !(Array.isArray(own) && own.length) && !(extra && extra.length);
        const L = (Array.isArray(own) ? own : []).concat(extra || [], none && Array.isArray(tv) ? tv.map((v) => ({ cam: v[0], tg: v[1] })) : [])
''')
        a = 'at: (i + 1) * share, dur: t.dur || 1900 }));'
        assert s.count(a) == 1
        s = s.replace(a, 'at: (i + 1) * share, dur: t.dur || 1500 }));')
        a = '  var tour_MODES = ['
        assert s.count(a) == 1
        s = s.replace(a, '''  // TOUR_VIEWS_205 BEGIN (tools204/tour_views_205.py writes this table from the reviewed candidates of qa/r3/tourviews.mjs)
  var tour_VIEWS = {};
  // TOUR_VIEWS_205 END
''' + a)
    open(f, 'w', encoding='utf8').write(s)
    print(f.split('/')[3], 'TIMES', s.count('TOUR_TIMES_205'), 'VIEWS', s.count('TOUR_VIEWS_205'))
