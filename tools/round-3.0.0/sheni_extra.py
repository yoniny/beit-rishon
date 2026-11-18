# the Second Temple's own parts of round 2.0.19, on the plain bundle after hunks.py: the two hunks whose comments differ from the
# First Temple's, the Tamid moving view's aim, and "מה חדש" 2.0.10
import sys, re, json
src, dst = sys.argv[1:3]
r = open('/home/claude/beit-rishon/src/90-entry.js', encoding='utf-8').read()
s = open(src, encoding='utf-8').read()
# 1. cam_decide's tail and the new functions (the First Temple's block from the lookLock line to "var cam_in")
a = r.index('    if (cam.mode === "look") cam.lookLock = true;\n    cam_polarFit();')
b = r.index('  var cam_in = { dir: new Vector3() };', a)
old = '    if (cam.mode === "look") cam.lookLock = true;\n  }\n'
assert s.count(old) == 1, ('decide', s.count(old))
j = s.index(old)
assert s[j + len(old):].startswith('  var cam_in = { dir: new Vector3() };')
s = s[:j] + r[a:b] + s[j + len(old):]
# 2. the near plane before the render
line = "    if (ent_sec.on) ent_sectionApply();   // 1.9.1: the materials swapped in since (the wall fade's clones) are cut too\n"
assert s.count(line) == 1
s = s.replace(line, line + "    cam_nearStep();   // CAM_219 (3): after every writer of the camera (ctx.animated too)\n")
# 3. the Tamid moving view: aimed in its own frame
old = "        ctx2.controls.target.set(t[0], t[1], t[2]);\n      }\n      // the sounds of the current stage"
assert s.count(old) == 1, ('tamid', s.count(old))
s = s.replace(old, "        ctx2.controls.target.set(t[0], t[1], t[2]);\n"
  "        // CAM_219 (the audit): aimed in this very frame - it is written after controls.update(), and a key past the polar limit (the\n"
  "        // patrol's, 0.11 rad from straight above) was drawn aimed from the clamped pose, about 5 degrees off its target\n"
  "        ctx2.camera.lookAt(t[0], t[1], t[2]);\n"
  "      }\n      // the sounds of the current stage")
# 5. THE TWO LESSER COURTS (the user, 18.11.2026, of the place "שתי הסנהדראות הקטנות": "מציג רק אחת למה?"): the place showed only the
#    court before Nikanor's gate; now one view holds both - by the reading of the row "מקום שתי הסנהדראות הקטנות" (Rashi: the other by
#    the women's court's east gate, x ~252; the plain words: inside the Shushan gate, x ~323), from the south and above
old = '{ t: "שתי הסנהדראות הקטנות", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, tg: [126.5, 8, -21], cam: [126.5, 37, 3],'
assert s.count(old) == 1, ('lesser', s.count(old))
s = s.replace(old, '{ t: "שתי הסנהדראות הקטנות", action: () => { if (ctx.shared.openFor) ctx.shared.openFor("crt-lishkot-roofs", 15000); }, '
  'tg: () => (ctx.shared.lesserPlace && ctx.shared.lesserPlace.mode === "mount" ? [224.6, 3, -15] : [189, 3, -15]), '
  'cam: () => (ctx.shared.lesserPlace && ctx.shared.lesserPlace.mode === "mount" ? [224.6, 190, 62] : [189, 150, 46]),   // LESSER_BOTH_300: both courts in one view, from above (over the women\'s court\'s wall)\n         ')
# 6. THE PAROCHOT OF THE OPENINGS (the user, 18.11.2026, of the place "שער הבכורות": "אין פריפה של הפרוכת כשמוצג מיצג זה"): a view AT an
#    opening raises its parochet too - the target within 4 amot of the parochet's plane, inside the opening (a gate's place looks at
#    the gate from outside: the line to the target never crossed the parochet, and it stayed spread over the opening)
old = "          const db = across(tg) - o.c;\n          if (da * db > 0 || da === db) return false;"
assert s.count(old) == 1, ('gate', s.count(old))
s = s.replace(old, "          const db = across(tg) - o.c;\n"
  "          if (Math.abs(db) < 4 && inside(along(tg), tg.y)) return true;   // GATE_SHOWN_300: the view looks at the opening itself (a gate's place)\n"
  "          if (da * db > 0 || da === db) return false;")
# 7. THE YOUNG PRIESTS of the water-drawing (the user, 18.11.2026: "פרחי הכהונה... צריכים להיראות צעירים ולא עם שער לבן", "זקן קטן";
#    Sukkah 5:2 "וארבעה ילדים מפרחי כהנה"): the people kit's option `young` - dark hair (the students' tones) and a short beard
old = "    const build = (pose, L, kind, robeCol) => {\n      const key = pose + \"|\" + L.toFixed(3) + \"|\" + kind + \"|\" + (robeCol == null ? \"\" : robeCol);"
assert s.count(old) == 1, ('build', s.count(old))
s = s.replace(old, "    const build = (pose, L, kind, robeCol, young) => {   // YOUNG_300: young - a short beard (the young priests of the water-drawing)\n"
  "      const key = pose + \"|\" + L.toFixed(3) + \"|\" + kind + \"|\" + (robeCol == null ? \"\" : robeCol) + (young ? \"|young\" : \"\");")
old = "        : [[0.25, 1.1], [0.19, 3.3], [0.14, 5.2]].map(([len, w2]) => mergeGeometries(base().concat(stache().map(headT), [headT(beard(len, w2))])));"
assert s.count(old) == 1, ('hair', s.count(old))
s = s.replace(old, "        : (young ? [[0.05, 2.0]] : [[0.25, 1.1], [0.19, 3.3], [0.14, 5.2]]).map(([len, w2]) => mergeGeometries(base().concat(stache().map(headT), [headT(beard(len, w2))])));")
old = "      } else mh.push(headT(beard(0.2, 2.2, 8, 3)));"
assert s.count(old) == 1, ('mid beard', s.count(old))
s = s.replace(old, "      } else mh.push(headT(beard(young ? 0.05 : 0.2, 2.2, 8, 3)));")
old = "const n = pts.length, L = o.pose === \"bench\" ? o.seat / o.s : 0, G = build(o.pose, L, o.kind, o.robe), mCl0 = clothMat(o.robe);"
assert s.count(old) == 1, ('crowd', s.count(old))
s = s.replace(old, "const n = pts.length, L = o.pose === \"bench\" ? o.seat / o.s : 0, G = build(o.pose, L, o.kind, o.robe, !!o.young), mCl0 = clothMat(o.robe);")
old = "const pal = TONES[o.kind === \"student\" ? 3 : (o.tone ? o.tone(i) : 1)]"
assert s.count(old) == 1, ('tones', s.count(old))
s = s.replace(old, "const pal = TONES[o.kind === \"student\" || o.young ? 3 : (o.tone ? o.tone(i) : 1)]")
old = 'PPy.crowd(G, [[0, 0, 0]], { y: 0, s: YS, pose: "stand", kind: "kohen", robe: 0xf1ede2, tone: () => (si + di) % 3, exact: true, name: "pirchaKehunah" });'
assert s.count(old) == 1, ('youths', s.count(old))
s = s.replace(old, 'PPy.crowd(G, [[0, 0, 0]], { y: 0, s: YS, pose: "stand", kind: "kohen", robe: 0xf1ede2, young: true, exact: true, name: "pirchaKehunah" });   // YOUNG_300: "ארבעה ילדים מפרחי כהנה" - dark hair, a short beard (until 2.0.18 white and grey too)')
# 8. THE GROUP "הדגמות" (the user, 18.11.2026: "והייתי מוסיף קטגוריה נפרדת להדגמות"): the builder is the First Temple's (DEMOS_GROUP_300,
#    carried by hunks.py); this house's own list, before its places
old = "      const PLACES = [\n"
assert s.count(old) == 1, ('places', s.count(old))
s = s.replace(old, """      // DEMOS_GROUP_300: the Second Temple's demonstrations, for the group "הדגמות" at the head of the panel (built before the places' loop)
      function ui_demosList() {
        return [
          { t: "סדר עבודת הבוקר", pill: "tamid-demo" },
          { t: "ארבעת הפייסות ו״ברקאי״", place: "ארבעת הפייסות ו״ברקאי״ — הדגמה" },
          { t: "פתיחת השער הגדול", place: "פתיחת השער הגדול — הדגמה" },
          { t: "הכיור יורד לבור ועולה", pill: "alt-mukhni-demo" },
          { t: "הכניסה בפשפש", pill: "hei-pish-demo" },
          { t: "הכהן הגדול נכנס בקטורת", place: "הכהן הגדול נכנס בקטורת — הדגמה" },
          { t: "הליכה במסיבה", place: "הליכה במסיבה — הדגמה" },
          { t: "שמחת בית השואבה — מנורות של זהב", place: "מנורות של זהב — שמחת בית השואבה" }
        ];
      }
""" + old)
# 4. "מה חדש" 2.0.10
N = json.load(open('/home/claude/work219/news219.json', encoding='utf-8'))
js = lambda x: json.dumps(x, ensure_ascii=False)
items = N['common'] + N['sheni']
m = re.search(r'var UI_NEWS = \{\n    ver: "2\.0\.9",(.*)\n    items: \[.*\]\n', s)
assert m, 'UI_NEWS'
s = s[:m.start()] + 'var UI_NEWS = {\n    ver: "2.0.10",' + m.group(1) + '\n    items: ' + js(items) + '\n' + s[m.end():]
old = '  var UI_NEWS_VERS = [\n    ["2.0.9", ['
assert s.count(old) == 1
s = s.replace(old, '  var UI_NEWS_VERS = [\n    ["2.0.10", ' + js(items) + '],   // CAM_219\n    ["2.0.9", [')
open(dst, 'w', encoding='utf-8').write(s)
print('sheni extra: ok')
