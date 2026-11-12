# -*- coding: utf-8 -*-
# 2.0.4 / B1 1.3.7 - THE THREE ROVDIN AS REAL GROOVES, NO DARK PAINT (the user, 11.11.2026 16:48: "אפשר להנכיח את החריצים ללא הדגשה? -
# א"כ תעשה"; as the Second Temple model 1.9.5). The three dark boxes sunk in the ramp's head are gone; every big ramp (the three
# readings of the air, in the verse's altar and in R. Yose's, and in R. Tam's reading - nine prisms) is built of its two halves, the
# east one on a profile with three notches, merged into one mesh of the ramp's own stone.
# Idempotent by the marker "prismGrooved".
import io
P = '/home/claude/beit-rishon/src/40-altar.js'
s = io.open(P, encoding='utf-8').read()


def rep(old, new, name):
    global s
    k = s.count(old)
    if k != 1:
        raise SystemExit('PATCH %s: %d matches' % (name, k))
    s = s.replace(old, new)


if 'prismGrooved' in s:
    print('40-altar.js: already patched')
else:
    rep('''    const rampDefG = new Group(), rampYoseG = new Group();
    rampYoseG.visible = false;
''', '''    // 1.3.7 (the user, 11.11.2026 16:48: "אפשר להנכיח את החריצים ללא הדגשה? - א"כ תעשה"): THE THREE ROVDIN ARE REAL GROOVES (their
    // sources: below, where the three dark slots stood until 1.3.6). A big ramp is built of its two halves - the west one on the plain
    // profile, the east one with three notches in its top (0.2 wide, half an amah deep, their walls square to the slope; in the
    // middle of each of the three amot from the altar's face, and they keep their distance from the ramp's head in every reading of
    // the air) - merged into one mesh of the ramp's own stone: the grooves are seen by their own walls and the light that falls in
    // them, with no paint. Their width, depth and places - model choices.
    const ROV_DZ = [0.5, 1.5, 2.5], ROV_W = 0.2, ROV_D = 0.5;
    // pts - the profile (z, height): [.., the foot (pts[1]), the head's top (pts[2]), ..]; zh - the head; top(z) - the top over the floor
    const prismGrooved = (pts, zh, top, parent) => {
      const th = Math.atan2(top(zh) - top(zh + 1), 1), ct = Math.cos(th), st = Math.sin(th);
      const cut = pts.slice(0, 2);
      for (const dz of ROV_DZ.slice().sort((p, q) => q - p)) {   // from the foot up to the head: the lower lip, down, across, up, the upper lip
        const zc = zh - GAP + dz, yc = top(zc);
        const bz = zc + ct * ROV_W / 2, by = yc - st * ROV_W / 2, az = zc - ct * ROV_W / 2, ay = yc + st * ROV_W / 2;
        cut.push([bz, by], [bz - st * ROV_D, by - ct * ROV_D], [az - st * ROV_D, ay - ct * ROV_D], [az, ay]);
      }
      for (let i = 2; i < pts.length; i++) cut.push(pts[i]);
      const XA = ACX - 8, XM = ACX, XB = ACX + 8;   // Middot 3:3 "שלשים ושתים על רחב שש עשרה" (convention)
      const geoOf = (xa, xb, p) => {
        const sh = new Shape();
        sh.moveTo(p[0][0], p[0][1]);
        for (let i = 1; i < p.length; i++) sh.lineTo(p[i][0], p[i][1]);
        sh.closePath();
        const geo = new ExtrudeGeometry(sh, { depth: xb - xa, bevelEnabled: false });
        // the stone's pattern runs on across the two halves (the side walls' v counts from the half's own east end)
        const uv = geo.attributes.uv, sg = geo.groups && geo.groups[1];
        if (uv && sg && XB - xb > 1e-6) { for (let i = sg.start; i < sg.start + sg.count; i++) uv.setY(i, uv.getY(i) - (XB - xb)); uv.needsUpdate = true; }
        geo.rotateY(-Math.PI / 2);
        geo.translate(xb, F, 0);
        geo.clearGroups();
        return geo;
      };
      const m = new Mesh(mergeGeometries([geoOf(XA, XM, pts), geoOf(XM, XB, cut)]), AS);
      m.castShadow = m.receiveShadow = true;
      (parent || g).add(m);
      return m;
    };
    const rampDefG = new Group(), rampYoseG = new Group();
    rampYoseG.visible = false;
''', 'helper')
    rep('''        out[k] = prism(ACX - 8, ACX + 8, pts, AS, grp);   // Middot 3:3 "שלשים ושתים על רחב שש עשרה" (convention)
        out[k].name = "rampMain_" + k;
''', '''        out[k] = prismGrooved(pts, zh, top, grp);   // 1.3.7: with the three rovdin's grooves in its east half
        out[k].name = "rampMain_" + k;
''', 'mainRamp')
    rep('''        out[k] = prism(ACX - 8, ACX + 8, pts, AS, grp);
        out[k].name = "rampMainRT_" + k;
''', '''        out[k] = prismGrooved(pts, zh, top, grp);
        out[k].name = "rampMainRT_" + k;
''', 'mainRampRT')
    a = s.index('    // where the ramp floats over the sovev, one where it floats over the yesod, one over the ground. Three dark slots 0.2 wide on the')
    b = s.index('      // the air\'s reading (RAMP_GAPS, above): the prism of the reading in each altar, and the slots move with the ramp\'s head')
    assert a < b
    s = (s[:a] + '''    // where the ramp floats over the sovev, one where it floats over the yesod, one over the ground. Three grooves 0.2 wide on the
    // EAST half of the ramp's head (the kuntres' drawing), in the middle of each of the three amot from the altar's face. Their width,
    // depth and places - model choices. 1.3.7: real grooves, cut in each ramp itself (prismGrooved, above); until 1.3.6 three dark boxes.
    {
''' + s[b:])
    rep('''          const d = (RTM.on ? RAMP_GAPS_RT : RAMP_GAPS)[this.mode] - RAMP_GAPS.hair;
          for (const sg of rov) sg.position.set(0, -(AH - 0.02) * d / 32, d);
''', '', 'set')
    rep('''      // the air's reading (RAMP_GAPS, above): the prism of the reading in each altar, and the slots move with the ramp's head
''', '''      // the air's reading (RAMP_GAPS, above): the prism of the reading in each altar (its grooves are cut in it)
''', 'comment')
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('40-altar.js: patched')
