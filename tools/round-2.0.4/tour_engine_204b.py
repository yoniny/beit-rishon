#!/usr/bin/env python3
# 1.3.7 / 1.9.5 - the presentation "לפי הנושאים" / "רציפה": ONE SLIDE PER BUTTON OF THE PANEL (TOUR_ENGINE_204B).
# Applied to BOTH engine copies: /home/claude/beit-rishon/src/75-tour.js and /home/claude/b1/src/75-tour.js. Idempotent.
import sys, io
FILES = ["/home/claude/beit-rishon/src/75-tour.js", "/home/claude/b1/src/75-tour.js"]
MARK = "TOUR_ENGINE_204B"

def rep(s, a, b, what, count=1):
    n = s.count(a)
    if n != count:
        raise SystemExit("ENGINE PATCH: %s: found %d, expected %d" % (what, n, count))
    return s.replace(a, b)

for f in FILES:
    s = io.open(f, encoding="utf-8").read()
    if MARK in s:
        print("already:", f); continue
    # (1) the places: the merged ones apart
    a = """        const places = placesOf();
        const groups = [];
        for (const p of places) if (groups.indexOf(p.group || "") < 0) groups.push(p.group || "");
        const viewKeyOf = (k) => (k && !byKey[k] && tour_VIEW_ALIAS[k] ? tour_VIEW_ALIAS[k] : k);"""
    b = """        // 1.3.7 / 1.9.5 (TOUR_ENGINE_204B; the user, 11.11.2026: "יש כרטיסים שלא מראים כלום - להסיר אותם או לאחד", "אם כרטיס אחד...
        // מציג כמה דברים המצגת צריכה להציג את כולם באותו הכרטיס"): ONE SLIDE PER BUTTON OF THE PANEL. Until now a place that the
        // panel had merged into another button (70-ui.js UI_MERGE: noButton, mergeInto - the whole group "השלמות") still had a slide
        // of its own, before the kept button's own camera, and a view of the grid whose button a place had taken (UI_VIEW_HOME) had
        // its slide right before that place's - the same picture two and three times. Now the kept button's slide stands for them,
        // with the card the button shows (its text, then each merged one's under its title: mergedCard), and a merged matter that
        // has a camera of its own is one of the slide's further cameras (item.tourThen on the kept place, 70-ui.js)
        const allPlaces = placesOf();
        const keptOf = (p) => {
          const k = p && p.item && p.item.noButton ? p.item.mergeInto : null;
          return k ? allPlaces.find((x) => x.item === k) || null : null;
        };
        const places = allPlaces.filter((p) => !keptOf(p));
        const groups = [];
        for (const p of places) if (groups.indexOf(p.group || "") < 0) groups.push(p.group || "");
        const viewKeyOf = (k) => (k && !byKey[k] && tour_VIEW_ALIAS[k] ? tour_VIEW_ALIAS[k] : k);
        // a view whose button left the grid (a place repeats it): the place's slide is the view's slide
        const gridless = (key) => {
          const b = fnc(U.viewButton) ? call(U.viewButton, key) : null;
          return !!b && !b.parentNode;
        };
        const coverOf = {};
        for (const p of places) {
          if (isExtras(p.group)) continue;
          const k = camKey(p);
          if (k && byKey[k] && k !== "__general" && gridless(k) && !(k in coverOf)) coverOf[k] = p;
          for (const d of p.item && Array.isArray(p.item.more) ? p.item.more : []) {
            if (d && !d.t && d.key && byKey[d.key] && gridless(d.key) && !(d.key in coverOf)) coverOf[d.key] = p;
          }
        }
        const mergedCard = (p) => {
          const own = tour_SHORT[p.title] || p.info || "";
          const parts = [own], refs = linkRefs(p.refs).slice(), seen = new Set(refs.map((r) => r[0]));
          for (const d of p.item && Array.isArray(p.item.more) ? p.item.more : []) {
            if (!d) continue;
            const tx = (d.t && tour_SHORT[d.t]) || (d.key ? (U.info && U.info[d.key]) || "" : d.info || "");
            if (tx && parts.indexOf(tx) < 0 && String(p.info || "").indexOf(String(tx).slice(0, 40)) < 0) parts.push((d.t ? d.t + ": " : "") + tx);
            for (const r of linkRefs(d.key ? (U.refs && U.refs[d.key]) || [] : d.refs || [])) {
              if (!seen.has(r[0])) {
                seen.add(r[0]);
                refs.push(r);
              }
            }
          }
          return { text: parts.filter(Boolean).join("\\n\\n"), refs };
        };
        const buttonSlide = (p, groupCam) => {
          const s = placeSlide(p, groupCam);
          if (p.item && Array.isArray(p.item.more) && p.item.more.length) {
            const mc = mergedCard(p);
            s.text = mc.text;
            s.refs = mc.refs;
          }
          return s;
        };"""
    s = rep(s, a, b, "places")
    # (2) the covered views are never emitted on their own
    a = """        const done = {};
        const viewSlideOf = {};   // 1.3.5 / 1.9.3: a place folded into its view's slide gives it its feature and its action"""
    b = """        const done = {};
        for (const k of Object.keys(coverOf)) done[k] = true;   // TOUR_ENGINE_204B: the covering place's slide stands for the view
        const viewSlideOf = {};   // 1.3.5 / 1.9.3: a place folded into its view's slide gives it its feature and its action"""
    s = rep(s, a, b, "done")
    # (3) the place loop
    a = """              fold = vk === k && ((p.item && p.item.key === k) || !p.info || p.info === (U.info && U.info[k]));
            }
            if (!fold) out.push(placeSlide(p, groupCam));
            else if (v && viewSlideOf[v.key]) {"""
    b = """              fold = vk === k && coverOf[vk] !== p && !!viewSlideOf[vk] && ((p.item && p.item.key === k) || !p.info || p.info === (U.info && U.info[k]));
            }
            if (!fold) {
              const bs = buttonSlide(p, groupCam);
              out.push(bs);
              for (const ck of Object.keys(coverOf)) if (coverOf[ck] === p && !viewSlideOf[ck]) viewSlideOf[ck] = bs;
            }
            else if (v && viewSlideOf[v.key]) {"""
    s = rep(s, a, b, "loop")
    # (4) the continuous mode: a slide of several cameras - no orbit, and from the third camera on 2.5 s more for each
    a = """        if (mode.key === "continuous") return tour_DWELL * speed;"""
    b = """        // 1.3.7 / 1.9.5 (TOUR_ENGINE_204B): a slide of three cameras and more gets 2.5 s for each camera after the second - in seven
        // seconds three flights leave nothing to look at
        if (mode.key === "continuous") return (tour_DWELL + Math.max(0, (Array.isArray(s.then) ? s.then.length : 0) - 1) * 2500) * speed;"""
    s = rep(s, a, b, "dwell")
    a = """        if (mode.key === "continuous" && !rt.devirNav && !s.nofly && !rt.actOnly) {
          rt.orbit ="""
    b = """        if (mode.key === "continuous" && !rt.devirNav && !s.nofly && !rt.actOnly && !(Array.isArray(s.then) && s.then.length)) {   // TOUR_ENGINE_204B: its own cameras turn it
          rt.orbit ="""
    s = rep(s, a, b, "orbit")
    io.open(f, "w", encoding="utf-8").write(s)
    print("patched:", f)
