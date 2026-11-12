# -*- coding: utf-8 -*-
# 2.0.4 / B1 1.3.7 - TWO PAIRS OF PLACES WITH ONE CAMERA BECOME ONE BUTTON EACH (the user, 11.11.2026 17:10: "ה. לאחד את עמודים ועב
# לאולם העמודים ואת שכבות למזבח הזהב"). UI_MERGE of 70-ui.js: the kept button's card carries both texts and all the links. The layers of
# the golden altar open for 15 seconds from the kept button now (the feature moves to it), so nothing is lost.
# Idempotent by the marker "1.3.7 (the user: \"ה. לאחד".
import io
P = '/home/claude/beit-rishon/src/70-ui.js'
s = io.open(P, encoding='utf-8').read()


def rep(old, new, name):
    global s
    k = s.count(old)
    if k != 1:
        raise SystemExit('PATCH %s: %d matches' % (name, k))
    s = s.replace(old, new)


if '1.3.7 (the user: "ה. לאחד' in s:
    print('70-ui.js: already patched')
else:
    rep('''        "הפרוכת — נשרים לצד ההיכל ואריות לצד הדביר": "הפרוכת",
''', '''        "הפרוכת — נשרים לצד ההיכל ואריות לצד הדביר": "הפרוכת",
        // 1.3.7 (the user: "ה. לאחד את עמודים ועב לאולם העמודים ואת שכבות למזבח הזהב"): two pairs of buttons that stood before one camera
        "העמודים והעב — 'ועמדים ועב על פניהם'": "אולם העמודים",
        "שכבות מזבח הזהב — אבן, ארז וזהב": "מזבח הזהב",
''', 'merge')
    rep('''          { t: "מזבח הזהב", view: "incenseAltar",
            info: "הפסוקים: 'ויצף מזבח ארז' (מלכים א ו, כ)''', '''          { t: "מזבח הזהב", view: "incenseAltar",
            // 1.3.7: the button "שכבות מזבח הזהב" merged into this one (UI_MERGE) - its feature opens from here: the layers for 15 seconds
            feature: { key: "incenseAltar.layers", isOn: () => !!(ctx.shared.incenseAltar && ctx.shared.incenseAltar.layers && ctx.shared.incenseAltar.layers.on),
              on: () => feat.altarLayers(), off: () => { const a = ctx.shared.incenseAltar; if (a && a.layers && typeof a.layers.set === "function") a.layers.set(false); } },
            info: "הפסוקים: 'ויצף מזבח ארז' (מלכים א ו, כ)''', 'feature')
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('70-ui.js: patched')
