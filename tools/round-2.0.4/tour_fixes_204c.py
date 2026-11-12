# -*- coding: utf-8 -*-
# 2.0.4 (B1 1.3.7 / B2 1.9.5) - THE PRESENTATIONS' FIXES AFTER THE HELPER'S SCAN (qa/r3/FORK_TOUR_REPORT.md), each checked by me.
# The user, 11.11.2026 14:24: "יש כרטיסים שלא מראים כלום - להסיר אותם או לאחד", "אם כרטיס אחד ... מציג כמה דברים המצגת צריכה להציג את
# כולם באותו הכרטיס"; 18:24 "לסרוק את כל השינויים ... וגם לעדכן מצגות".
# ENGINE (both copies: beit-rishon/src/75-tour.js and b1/src/75-tour.js - the base B2's tour is ported from), marker TOUR_ENGINE_204C:
#   1. placeThen takes { pos, target } as well as { cam, tg }, a function for the list, and further entries of the engine's own;
#   2. mergedCard drops only the lines the kept card already has (it dropped a whole merged card whose first 40 letters were the same);
#   3. a merged matter that has a camera of its own is one of its slide's further cameras (up to four), when the place names none.
# B1 CONTENT (70-ui.js, 30-courts.js), marker TOUR_FIX_137: the view "newCourt" folds into its place (its title had changed); the
#   gatekeepers' button is hidden behind walls while it is off; further cameras for five places.
# Idempotent.
import io

def patch(path, fn):
    s = io.open(path, encoding='utf-8').read()
    s2 = fn(s)
    if s2 != s:
        io.open(path, 'w', encoding='utf-8').write(s2)
        print(path.replace('/home/claude/', ''), 'edited')
    else:
        print(path.replace('/home/claude/', ''), 'unchanged')

def one(s, a, b):
    assert s.count(a) == 1, (s.count(a), a[:90])
    return s.replace(a, b)

# ---------------------------------------------------------------- the engine
def f_engine(s):
    if 'TOUR_ENGINE_204C' in s:
        return s
    s = one(s,
        "      const placeThen = (p) => {\n"
        "        const L = p && p.item && Array.isArray(p.item.tourThen) ? p.item.tourThen.filter((t) => t && (t.fp || t.place || (t.cam && t.tg))) : [];\n",
        "      // TOUR_ENGINE_204C (the helper's scan, 11.11.2026): the list may be a function; an entry may be { pos, target } (the\n"
        "      // gatekeepers' place wrote it so and its cameras never ran); `extra`: further entries the engine adds (mergedCams)\n"
        "      const placeThen = (p, extra) => {\n"
        "        let own = p && p.item ? p.item.tourThen : null;\n"
        "        if (fnc(own)) own = call(own);\n"
        "        const L = (Array.isArray(own) ? own : []).concat(extra || [])\n"
        "          .map((t) => (t && !t.fp && !t.place && !(t.cam && t.tg) && t.pos && t.target ? Object.assign({}, t, { cam: t.pos, tg: t.target }) : t))\n"
        "          .filter((t) => t && (t.fp || t.place || (t.cam && t.tg)));\n")
    s = one(s,
        "            if (tx && parts.indexOf(tx) < 0 && String(p.info || \"\").indexOf(String(tx).slice(0, 40)) < 0) parts.push((d.t ? d.t + \": \" : \"\") + tx);\n",
        "            // TOUR_ENGINE_204C: only the lines the card already has are left out (a merged card that opened with the kept card's\n"
        "            // own verse was dropped whole - its first 40 letters were the same)\n"
        "            if (tx) {\n"
        "              const have = parts.join(\"\\n\") + \"\\n\" + String(p.info || \"\"), fresh = String(tx).split(\"\\n\").filter((ln) => ln.trim() && have.indexOf(ln.trim()) < 0);\n"
        "              if (fresh.length) parts.push((d.t ? d.t + \": \" : \"\") + fresh.join(\"\\n\"));\n"
        "            }\n")
    s = one(s,
        "        const buttonSlide = (p, groupCam) => {\n"
        "          const s = placeSlide(p, groupCam);\n"
        "          if (p.item && Array.isArray(p.item.more) && p.item.more.length) {\n"
        "            const mc = mergedCard(p);\n"
        "            s.text = mc.text;\n"
        "            s.refs = mc.refs;\n"
        "          }\n"
        "          return s;\n"
        "        };\n",
        "        // TOUR_ENGINE_204C: a merged matter that has a camera of its own is one of the slide's further cameras - up to four -\n"
        "        // when the kept place names none itself (item.tourThen)\n"
        "        const mergedCams = (p) => {\n"
        "          const out = [], own = camKey(p);\n"
        "          for (const d of p.item && Array.isArray(p.item.more) ? p.item.more : []) {\n"
        "            if (!d || out.length >= 4) continue;\n"
        "            if (d.t) {\n"
        "              const q = allPlaces.find((x) => x.item === d || x.title === d.t);\n"
        "              if (q && placeOwnCam(q) && camKey(q) !== own) out.push({ place: q.title });\n"
        "            } else if (d.key && d.key !== own && resolveFp(d.key)) out.push({ fp: d.key });\n"
        "          }\n"
        "          return out;\n"
        "        };\n"
        "        const buttonSlide = (p, groupCam) => {\n"
        "          const s = placeSlide(p, groupCam);\n"
        "          if (p.item && Array.isArray(p.item.more) && p.item.more.length) {\n"
        "            const mc = mergedCard(p);\n"
        "            s.text = mc.text;\n"
        "            s.refs = mc.refs;\n"
        "            if (!s.then) s.then = placeThen(p, mergedCams(p));\n"
        "          }\n"
        "          return s;\n"
        "        };\n")
    return s

for p in ['/home/claude/beit-rishon/src/75-tour.js', '/home/claude/b1/src/75-tour.js']:
    patch(p, f_engine)

# ---------------------------------------------------------------- B1: the content
def f_ui(s):
    if 'TOUR_FIX_137' in s:
        return s
    s = one(s, "      const UI_VIEW_HOME = { newCourt: \"החצר החיצונה\", azarah:",
               "      // TOUR_FIX_137: the place's title is \"החצר החיצונה (החצר החדשה)\" since 1.0.1 - under the old one the view never folded into it\n"
               "      const UI_VIEW_HOME = { newCourt: \"החצר החיצונה (החצר החדשה)\", azarah:")
    T = [
        ('          { t: "לשכות החצר החיצונה", action: () => openPill20("mnt-lishka-roofs-nw"),',
         '          { t: "לשכות החצר החיצונה", action: () => openPill20("mnt-lishka-roofs-nw"),\n'
         '            // TOUR_FIX_137: the four chambers are small at the court\'s corners - the slide goes on to each\n'
         '            tourThen: [{ cam: [118, 20, -38], tg: [104.5, 5.5, -61.5] }, { cam: [208, 20, -38], tg: [221.5, 5.5, -61.5] }, { cam: [208, 20, 38], tg: [221.5, 5.5, 61.5] }, { cam: [118, 20, 38], tg: [104.5, 5.5, 61.5] }],'),
        ('          { t: "שתי הסנהדראות הקטנות", action: () => openPill20("crt-lesser-roofs"),',
         '          { t: "שתי הסנהדראות הקטנות", action: () => openPill20("crt-lesser-roofs"),\n'
         '            tourThen: [{ cam: [240.55, 31, 9.5], tg: [240.55, 2, -14.5] }],   // TOUR_FIX_137: the second of the two'),
        ('          { t: "פתח ההיכל ודלתותיו", view: "heichalDoor",',
         '          { t: "פתח ההיכל ודלתותיו", view: "heichalDoor",\n'
         '            tourThen: [{ cam: [-20, 22, -7], tg: [-0.5, 21, 2] }, { cam: [-30, 23, 5], tg: [-0.5, 22, 0] }],   // TOUR_FIX_137: the doorway and its doors from inside'),
        ('          { t: "מזבח הזהב", view: "incenseAltar",',
         '          { t: "מזבח הזהב", view: "incenseAltar",\n'
         '            tourThen: [{ cam: [-23.5, 16.2, 3.2], tg: [-28, 14.6, 0] }],   // TOUR_FIX_137: the whole altar'),
        ('          { t: "קודש הקדשים — הדביר", view: "kodeshHakodashim", key: "kodeshHakodashim" },',
         '          { t: "קודש הקדשים — הדביר", view: "kodeshHakodashim", key: "kodeshHakodashim",\n'
         '            tourThen: [{ cam: [-45.3, 17.5, 0], tg: [-58, 20, 0] }] },   // TOUR_FIX_137: from its doorway, facing the ark'),
    ]
    for a, b in T:
        s = one(s, a, b)
    return s
patch('/home/claude/beit-rishon/src/70-ui.js', f_ui)

def f_courts(s):
    if 'TOUR_FIX_137' in s:
        return s
    return one(s, "        anchor: [CO2.azE + 4, AZ + 30, 0],\n        occlude: false,\n        get maxDist() { return gk.visible ? 5000 : 320; },",
                  "        anchor: [CO2.azE + 4, AZ + 30, 0],\n"
                  "        get occlude() { return gk.visible ? false : undefined; },   // TOUR_FIX_137: while it is off a wall hides it (it showed inside the heichal)\n"
                  "        get maxDist() { return gk.visible ? 5000 : 320; },")
patch('/home/claude/beit-rishon/src/30-courts.js', f_courts)
