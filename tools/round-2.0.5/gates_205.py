# GATES_FAR_205 + the engine's optThen (the user, 12.11.2026 12:11: "שערי בית המקדש עפ"י המבטים לא מצליחים להבין את המח'").
#  B2 src/30-courts.js: in the readings of thirteen gates a disc over every gate (gold: the seven great; red: the six small), growing with
#     the camera's distance; the names over the north gates a little larger, and the hearth house's name also over its north face.
#  B2 tools/port_ui.py: a reading may carry its own further views for the presentation (opts[i].tourThen -> row.tourThen[key]).
#  Both copies of 75-tour.js: optThen - a dispute's slide flies to its reading's further views (as a place's slide does).
# Idempotent.
import io
def rw(p, fn):
    s = io.open(p, encoding='utf-8').read(); t = fn(s)
    if t != s: io.open(p, 'w', encoding='utf-8').write(t)
    return t != s
def courts(s):
    if 'GATES_FAR_205' in s: return s
    a = '    // the Rambam (5:5): "ושער זה הוא הנקרא שער העליון והוא שער ניקנור" - a label on Nikanor\'s gate, shown by the same row\n'
    assert s.count(a) == 1
    b = '''    // GATES_FAR_205 (the user, 12.11.2026: "שערי בית המקדש עפ"י המבטים לא מצליחים להבין את המח'" - from the row's own view, over the whole
    // court, a small gate of four amot could not be made out): in the readings of thirteen gates a disc stands over every gate - gold
    // over the seven great ones, red over the six small ones - and grows with the camera's distance (as the guards' discs,
    // GUARDS_FAR_195). A sign of the model, said in the row's card.
    {
      const FARG = [], mG = new MeshBasicMaterial({ color: 0xe2a400 }), mS = new MeshBasicMaterial({ color: 0xc23b22 }), gD = new CylinderGeometry(2, 2, 0.4, 24);
      const disc = (grp, x, z, small) => { const d = new Mesh(gD, small ? mS : mG); d.position.set(x, 48, z); d.userData.noPick = true; grp.add(d); FARG.push(d); };
      for (const [grp, nx] of [[g13, NASHIM_X], [g13r, SHIR_R_X]]) {
        for (const [, x] of gN) disc(grp, x, -67.5, false);
        disc(grp, MOKED_X, -56, false);                       // the hearth house's gate to the court - the third of the north
        for (const [, x] of gS) disc(grp, x, 67.5, false);
        disc(grp, 93.5, 0, false);                            // Nikanor
        disc(grp, 93.5, -12, true); disc(grp, 93.5, 12, true);   // its two wickets
        disc(grp, SMALL_X, 67.5, true);                       // the Upper Gate
        disc(grp, nx, -67.5, true);                           // the small gate of the north (its place by the reading)
        for (const z of SMALL_Z) disc(grp, -93.5, z, true);   // the two of the west
      }
      if (ctx2.animated) ctx2.animated.push(() => {
        if (!g13.visible && !g13r.visible) return;
        const cp = ctx2.camera.position;
        for (const d of FARG) { const k = Math.min(4.5, Math.max(1, cp.distanceTo(d.position) / 110)); d.scale.set(k, 1, k); }
      });
      // the hearth house's name by Abba Yose also over its north face (its label by the gate to the court is hidden from the north)
      ctx2.labels.push({ text: "לאבא יוסי בן חנן: שער השיר (תפארת ישראל)", x: MOKED_X, y: 50, z: -79, size: 2, layer: "gates13" },
        { text: "לאבא יוסי בן חנן: שער הנשים — בית המוקד (האפשרות הנדחית)", x: MOKED_X, y: 50, z: -79, size: 2, layer: "gates13r" });
    }
'''
    s = s.replace(a, b + a)
    n = 0
    for old in ['{ text: "שער הנשים — שער קטן (תפארת ישראל)", x: NASHIM_X, y: 24.5, z: -71, size: 1.6, layer: "gates13" }',
                '{ text: "לאבא יוסי בן חנן: שער יכניה", x: -78, y: 31, z: -71, size: 1.6, layer: "gates13" }',
                '{ text: "לאבא יוסי בן חנן: שער הקרבן", x: -48, y: 31, z: -71, size: 1.6, layer: "gates13" }',
                '{ text: "שער השיר — שער קטן למזרח בית המוקד (האפשרות שתפארת ישראל דוחה)", x: SHIR_R_X, y: 24.5, z: -71, size: 1.6, layer: "gates13r" }',
                '{ text: "לאבא יוסי בן חנן: שער יכניה", x: -78, y: 31, z: -71, size: 1.6, layer: "gates13r" }',
                '{ text: "לאבא יוסי בן חנן: שער הקרבן", x: -48, y: 31, z: -71, size: 1.6, layer: "gates13r" }']:
        assert s.count(old) == 1, old
        s = s.replace(old, old.replace('size: 1.6', 'size: 2')); n += 1
    return s
def portui(s):
    if 'TOUR_VIEWS_205' in s: return s
    a = "          current: %s,\n          onPick: (k) => { %s },"
    assert s.count(a) == 1
    s = s.replace(a, "          current: %s,''' + then_js + '''\n          onPick: (k) => { %s },")
    a = '    card_only = " cardOnly: true," if t.get("cardOnly") else ""\n'
    assert s.count(a) == 1
    s = s.replace(a, a + '''    # TOUR_VIEWS_205: a reading's own further views for the presentation (opts[k].tourThen, a list of { cam, tg }) -> row.tourThen[key]
    _th = {"o%d" % k: o["tourThen"] for k, o in enumerate(opts) if o.get("tourThen")}
    then_js = ("\\n          tourThen: %s," % J(_th)) if _th else ""
''')
    return s
def tour(s):
    if 'const optThen' in s: return s
    a = '      const placeSlide = (p, groupCam) => {\n'
    assert s.count(a) == 1
    s = s.replace(a, '''      // TOUR_VIEWS_205: a reading's own further views (row.tourThen[key], a list of { cam, tg }): the slide of a dispute moves among
      // the places it speaks of, as a place's slide does
      const optThen = (row, key) => {
        const L = ((row && row.tourThen && row.tourThen[key]) || []).filter((t) => t && t.cam && t.tg);
        if (!L.length) return null;
        const share = 1 / (L.length + 1);
        return L.map((t, i) => ({ go: [{ pos: t.cam, target: t.tg }], at: (i + 1) * share, dur: t.dur || 1500 }));
      };
''' + a)
    a = '            out.push({ kind: "opinion", part: 1, row, key, def, title: label, sub: row.cap, text: info || "", refs: infoRefs || row.refs || [],\n              out: tour_OUT });\n'
    assert s.count(a) == 1
    return s.replace(a, a.replace('out: tour_OUT });', 'then: optThen(row, key), out: tour_OUT });'))
print('courts', rw('/home/claude/b2src/src/30-courts.js', courts), 'port_ui', rw('/home/claude/b2src/tools/port_ui.py', portui),
      'tour B1', rw('/home/claude/beit-rishon/src/75-tour.js', tour), 'tour B2 base', rw('/home/claude/b1/src/75-tour.js', tour))

# GATES_FAR_205 b: the names that the two readings give differently (the small gate, the hearth house) - larger, 2.6
def courts_b(s):
    if 'GATES_FAR_205 b' in s: return s
    reps = [('{ text: "שער הנשים — שער קטן (תפארת ישראל)", x: NASHIM_X, y: 24.5, z: -71, size: 2, layer: "gates13" }', 'y: 26, z: -71, size: 2.6'),
            ('{ text: "שער השיר — שער קטן למזרח בית המוקד (האפשרות שתפארת ישראל דוחה)", x: SHIR_R_X, y: 24.5, z: -71, size: 2, layer: "gates13r" }', 'y: 26, z: -71, size: 2.6')]
    for old, new in reps:
        assert s.count(old) == 1, old
        s = s.replace(old, old.replace('y: 24.5, z: -71, size: 2', new))
    for lay in ('gates13', 'gates13r'):
        k = s.index('x: MOKED_X, y: 50, z: -79, size: 2, layer: "%s" }' % lay)
        s = s[:k] + s[k:].replace('x: MOKED_X, y: 50, z: -79, size: 2, layer: "%s" }' % lay, 'x: MOKED_X, y: 51, z: -79, size: 2.6, layer: "%s" }' % lay, 1)
    return s.replace('    // GATES_FAR_205 (the user', '    // GATES_FAR_205 b: the names that the readings give differently are 2.6 high (the others 2)\n    // GATES_FAR_205 (the user', 1)
print('courts b', rw('/home/claude/b2src/src/30-courts.js', courts_b))
