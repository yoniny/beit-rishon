# MISHNAH_VIEWS_205 (the scan of "לפי סדר המשניות", 12.11.2026; the user: "יש כאלה שלא מציגים כלום"): slides of the Second House's third
# mode that stood before one camera in a row (1:1-1:3 the mount from afar; 1:6-1:9 the hearth house from above; 2:1-2:2; 3:1, 3:2, 3:4;
# 4:6-4:7; 5:1-5:2) each get the view of their own matter, and a slide of several things moves among them (slide(..., then=[...])).
# b2src/tools/port_tour.py. Idempotent.
import io, json
p = '/home/claude/b2src/tools/port_tour.py'; s = io.open(p, encoding='utf-8').read()
TV = json.load(io.open('/home/claude/b2src/tools/tour_views_b2.json', encoding='utf-8'))
MK = TV['בית המוקד']
if 'MISHNAH_VIEWS_205' not in s:
    a = 'def slide(ch, m, t, go, x, r=()):\n    S.append({"v": [ch, m, m], "t": t, "go": go, "x": x, "r": list(r)})\n'
    assert s.count(a) == 1
    s = s.replace(a, '''def slide(ch, m, t, go, x, r=(), then=None):
    d = {"v": [ch, m, m], "t": t, "go": go, "x": x, "r": list(r)}
    # MISHNAH_VIEWS_205: a Mishnah of several things - the further views inside its slide, each in its part of the slide's time
    if then:
        d["then"] = [{"go": [g], "at": round((i + 1.0) / (len(then) + 1), 3), "dur": 1500} for i, g in enumerate(then)]
    S.append(d)
''')
    a = '''slides_js = ",\\n".join('    { v: %s, t: %s, go: %s,\\n      x: %s,\\n      r: %s }' % (J(s["v"]), J(s["t"]), J(s["go"]), J(s["x"]), J(s["r"])) for s in S)'''
    assert s.count(a) == 1, 'emit'
    s = s.replace(a, '''slides_js = ",\\n".join('    { v: %s, t: %s, go: %s,\\n      x: %s,\\n      r: %s%s }' % (J(s["v"]), J(s["t"]), J(s["go"]), J(s["x"]), J(s["r"]), (",\\n      then: " + J(s["then"])) if s.get("then") else "") for s in S)''')
    def head(old, new):
        global s
        assert s.count(old) == 1, old
        s = s.replace(old, new)
    def then(headline, lst):
        global s
        i = s.index(headline); j = s.find('\nslide(', i + 10)
        if j < 0: j = s.index('\n', s.index(']])', i)) + 1
        seg = s[i:j]; k = seg.rstrip().rfind(')')
        assert seg.rstrip().endswith(')'), (headline, seg[-60:])
        s = s[:i] + seg[:k] + ', then=' + lst + seg[k:] + s[j:]
    G = 'המשמרות — שלושה לכהנים ועשרים ואחד ללויים'
    head('slide(1, 1, "שמירת המקדש", [fp("harHabayit")],', 'slide(1, 1, "שמירת המקדש", [pla("%s"), fp("harHabayit")],   # MISHNAH_VIEWS_205: the guards on the mount' % G)
    head('slide(1, 2, "איש הר הבית", [fp("harHabayit")],', 'slide(1, 2, "איש הר הבית", [{"pos": [-20, 250, 150], "target": [-20, 20, 0], "lay": "guards"}, fp("harHabayit")],   # the guards of the court, nearer')
    then('slide(1, 3, "חמישה שערים להר הבית"', '[{"pos": [55, 24, 436], "target": [55, 10, 340]}, {"pos": [-204, 16, 0], "target": [-154, 10, 0]}, {"pos": [55, 16, -224], "target": [55, 13, -174.5]}, {"pos": [455, 24, -88], "target": [392, -4, 0]}]')
    head('slide(1, 7, "שני שערים לבית המוקד", [pla("בית המוקד")],', 'slide(1, 7, "שני שערים לבית המוקד", [{"pos": [8, 66, -112], "target": [-15, 17, -69]}, pla("בית המוקד")],   # from the north-east: its gate to the chel')
    then('slide(1, 7, "שני שערים לבית המוקד"', '[pl("שער בית המוקד — פתחו של הבית לעזרה")]')
    then('slide(1, 8, "בית המוקד — כיפה ורובדין"', '[{"pos": %s, "target": %s}]' % (json.dumps(MK[1][0]), json.dumps(MK[1][1])))
    then('slide(1, 9, "מקום המפתחות ובית הטבילה"', '[{"pos": %s, "target": %s}]' % (json.dumps(MK[0][0]), json.dumps(MK[0][1])))
    head('slide(2, 2, "הנכנסים להר הבית", [fp("harHabayit")],', 'slide(2, 2, "הנכנסים להר הבית", [pl("שערי חולדה"), fp("harHabayit")],   # the gates of the way in')
    head('slide(3, 1, "המזבח", [fp("mizbeach")],', 'slide(3, 1, "המזבח", [pla("מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"), fp("mizbeach")],   # its measures, from above')
    head('slide(3, 2, "נקבי היסוד", [pl("נקבי המזבח והרבובה (1.0.13)"), fp("mizbeach")],', 'slide(3, 2, "נקבי היסוד", [pl("השיתין — שני הנקבים וטבלת השיש"), fp("mizbeach")],   # (the place\'s name of today; the old one resolved to nothing and the slide stood before the altar\'s general view)')
    head('slide(4, 7, "ההיכל — מאה על מאה, וצר מאחוריו", [fp("heichalFront")],', 'slide(4, 7, "ההיכל — מאה על מאה, וצר מאחוריו", [{"pos": [-30, 250, 70], "target": [-45, 60, 0]}, fp("heichalFront")],   # from above: wide in front, narrow behind')
    head('slide(5, 2, "העזרה — מצפון לדרום", [fp("azarah")],', 'slide(5, 2, "העזרה — מצפון לדרום", [{"pos": [150, 120, 0.5], "target": [20, 15, 0]}, fp("azarah")],   # from the east: its width before the eye')
    s = s.replace('def slide(ch, m, t, go, x, r=(), then=None):', '# MISHNAH_VIEWS_205: see tools204/mishnah_views_205.py\ndef slide(ch, m, t, go, x, r=(), then=None):', 1)
    io.open(p, 'w', encoding='utf-8').write(s); print('port_tour patched')
else: print('already')
