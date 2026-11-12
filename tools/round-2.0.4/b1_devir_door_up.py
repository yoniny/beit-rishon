# -*- coding: utf-8 -*-
# 2.0.4 / B1 1.3.7 - THE DEVIR'S DOORWAY GOES UP WITH THE SLOPING FLOOR (the user, 11.11.2026 17:10: "ג.להגביה"). Since 1.3.5 the house's
# floor rises four amot from the heichal's door to the devir's west wall, and what is fixed to the building stayed: at the amah
# traksin the floor stood 2.67 over the doorway's foot - the doors, the posts and the parochet were buried that much, the doorway's
# clear height was 9.33 for 12, and the lowest bar of the gold chains lay under the floor. Now the doorway with all that belongs to it
# (the hole in the wall, the posts and the lintel of both readings, the doors with their pivots and the key, the parochet and its bent
# head, the bars of the chains, their labels) stands 2.67 higher - on the floor.
# Idempotent by the marker "DOOR_UP" in 55-interior.js.
import io

P = '/home/claude/beit-rishon/src/55-interior.js'
s = io.open(P, encoding='utf-8').read()


def rep(old, new, name, n=1):
    global s
    k = s.count(old)
    if k != n:
        raise SystemExit('PATCH %s: %d matches' % (name, k))
    s = s.replace(old, new)


if 'DOOR_UP' in s:
    print('55-interior.js: already patched')
else:
    rep('''  var INT_DEVIR_DOOR_H = 12;                                          // devir doorway height (model choice)
''', '''  var INT_DEVIR_DOOR_H = 12;                                          // devir doorway height (model choice)
  var INT_FLOOR_RISE = 4;                                             // 1.3.5: the house floor's rise from the heichal's door to the devir's west wall (model choice; see "houseSlope" below)
''', 'var')
    rep('''    const XE = CO.xKodeshE, XW = CO.xKodeshW, XDE = CO.xDevirE, XDW = CO.xDevirW;   // -3.5, -43.5, -44.5, -63.5
''', '''    const XE = CO.xKodeshE, XW = CO.xKodeshW, XDE = CO.xDevirE, XDW = CO.xDevirW;   // -3.5, -43.5, -44.5, -63.5
    // 1.3.7 (the user, 11.11.2026 17:10, of the devir's doorway that the sloping floor had buried 2.67 deep: "להגביה"): THE DEVIR'S
    // DOORWAY STANDS ON THE SLOPING FLOOR. DOOR_UP = the floor's rise at the traksin's east face (4 * 40 / 60 = 2.667): the hole in the
    // wall, the posts and the lintel of both readings, the doors with their pivots and the key, the parochet with its bent head, and
    // the four bars of the gold chains (their heights are counted from the floor) all stand that much higher. The doorway's clear
    // height is again the whole 12. (At the wall's west face the floor is 0.07 higher still - it covers the posts' feet there.)
    const DOOR_UP = INT_FLOOR_RISE * (XE - XW) / (XE - XDW);
''', 'const')
    rep('''      for (const y of [F + 2, F + 8]) { bar(y, -HW, -hz); bar(y, hz, HW); }
      for (const y of [F + 14, F + 20]) bar(y, -HW, HW);
''', '''      for (const y of [F + DOOR_UP + 2, F + DOOR_UP + 8]) { bar(y, -HW, -hz); bar(y, hz, HW); }   // 1.3.7: counted from the floor at the wall
      for (const y of [F + DOOR_UP + 14, F + DOOR_UP + 20]) bar(y, -HW, HW);
''', 'chains')
    rep('''      int_uvBox(tg, XDE, XW, F + INT_DEVIR_DOOR_H + TRK_BAND, F + KH, -HW, HW, trkUV);
''', '''      int_uvBox(tg, XDE, XW, F + DOOR_UP + INT_DEVIR_DOOR_H + TRK_BAND, F + KH, -HW, HW, trkUV);
''', 'wall above')
    rep('''      const pg = [], y1 = F + INT_DEVIR_DOOR_H, y2 = y1 + TRK_BAND;
      int_uvBox(pg, XDE, XW, F, y1, -HW, -holeW / 2, trkUV);
      int_uvBox(pg, XDE, XW, F, y1, holeW / 2, HW, trkUV);
''', '''      const pg = [], y1 = F + DOOR_UP + INT_DEVIR_DOOR_H, y2 = y1 + TRK_BAND;
      int_uvBox(pg, XDE, XW, F, y1, -HW, -holeW / 2, trkUV);
      int_uvBox(pg, XDE, XW, F, y1, holeW / 2, HW, trkUV);
      int_uvBox(pg, XDE, XW, F, F + DOOR_UP - 0.02, -holeW / 2, holeW / 2, trkUV);   // 1.3.7: the wall under the doorway's foot (the sloping floor covers it)
''', 'piers')
    rep('''      trkPiers(vg, holeW, pent ? INT_DEVIR_HOLE : 0);                // 1.0.1-L (L.32): Rashi's reading - the lintel fills the band's hole
''', '''      trkPiers(vg, holeW, pent ? INT_DEVIR_HOLE : 0);                // 1.0.1-L (L.32): Rashi's reading - the lintel fills the band's hole
      const fixed = vg.children.slice();                             // 1.3.7: the wall's own pieces - all that is added after them goes up DOOR_UP (below)
''', 'fixed')
    rep('''            const ln = new LineSegments(new EdgesGeometry(o.geometry, 20), edgeMat);
            ln.position.copy(o.position);
''', '''            const ln = new LineSegments(new EdgesGeometry(o.geometry, 20), edgeMat);
            ln.userData.src = o;
            ln.position.copy(o.position);
''', 'edges src')
    rep('''      devVar[key] = vg;
      return vg;
''', '''      // 1.3.7: the doorway's own parts stand DOOR_UP higher (the wall's pieces were built so already)
      for (const o of vg.children) {
        if (fixed.indexOf(o) >= 0) continue;
        o.position.y += DOOR_UP;
        if (o.name === "devir-pent-edges") for (const ln of o.children) if (fixed.indexOf(ln.userData.src) >= 0) ln.position.y -= DOOR_UP;   // the edges of the wall's pieces stay with them
      }
      devVar[key] = vg;
      return vg;
''', 'raise')
    rep('''      { text: "רתוקות הזהב", x: XW + 1.2, y: F + 17, z: -6, size: 1.8 },
      { text: "אמה טרקסין", x: XW + 0.8, y: F + INT_DEVIR_DOOR_H + 4.5, z: 0, size: 2.4 },''',
        '''      { text: "רתוקות הזהב", x: XW + 1.2, y: F + DOOR_UP + 17, z: -6, size: 1.8 },
      { text: "אמה טרקסין", x: XW + 0.8, y: F + DOOR_UP + INT_DEVIR_DOOR_H + 4.5, z: 0, size: 2.4 },''', 'labels 1')
    rep('''      { text: "פתח הדביר (מזוזות חמישית)", x: XW + 1.5, y: F + INT_DEVIR_DOOR_H + 3.2, z: 0, size: 2 },''',
        '''      { text: "פתח הדביר (מזוזות חמישית)", x: XW + 1.5, y: F + DOOR_UP + INT_DEVIR_DOOR_H + 3.2, z: 0, size: 2 },''', 'labels 2')
    rep('''      const SL = { x0: XE, x1: XDW, rise: 4 };
''', '''      const SL = { x0: XE, x1: XDW, rise: INT_FLOOR_RISE };
''', 'SL')
    rep('''          if (o.name !== "goldKey" || o.userData.slopeUp) return;
          o.getWorldPosition(wp);
''', '''          if (o.name !== "goldKey" || o.userData.slopeUp) return;
          for (let p = o.parent; p; p = p.parent) if (/^devir-door-/.test(p.name || "")) return;   // 1.3.7: the devir's doors went up themselves (DOOR_UP), their key with them
          o.getWorldPosition(wp);
''', 'keys')
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('55-interior.js: patched')

# ---- the floor of the doorway itself (the cypress wedge of the slope showed between the two rooms' gold floors)
s = io.open(P, encoding='utf-8').read()
if 'devir-door-floor' in s:
    print('55-interior.js: doorway floor already there')
else:
    rep('''      const df = [];
      int_uvBox(df, XDW, XDE, F, F + 0.06, -HW, HW, floorUV);
      mergedMesh(df, goldFloor, g);
''', '''      const df = [];
      int_uvBox(df, XDW, XDE, F, F + 0.06, -HW, HW, floorUV);
      mergedMesh(df, goldFloor, g);
      // 1.3.7: the floor of the doorway itself, between the two rooms' floors - gold as they are (6:30 "לפנימה ולחיצון"); the cypress
      // wedge of the slope showed there. It rises with the floor (the slope's group finds it by its bounds).
      {
        const dd = [];
        int_uvBox(dd, XDE, XW, F, F + 0.06, -INT_DEVIR_HOLE / 2, INT_DEVIR_HOLE / 2, floorUV);
        const dm = mergedMesh(dd, goldFloor, g);
        if (dm) dm.name = "devir-door-floor";
      }
''', 'door floor')
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('55-interior.js: doorway floor added')
