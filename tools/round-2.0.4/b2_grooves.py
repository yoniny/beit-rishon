# -*- coding: utf-8 -*-
# 2.0.4 / B2 1.9.5 - THE GROOVES AT THE RAMP'S HEAD AS REAL RECESSES, NO DARK PAINT (the user, 11.11.2026 16:48: "אפשר להנכיח את החריצים
# ללא הדגשה? - א"כ תעשה"):
#  (1) the three rovdin (R. Hai Gaon) were three dark boxes sunk in the ramp's head; now they are three grooves CUT in the ramp itself,
#      in the stone's own colour - the east half of each reading's ramp is built on a profile with three notches;
#  (2) the air of the Tosafot's reading (half an amah between the ramp's head and the altar) was painted dark inside ("rampGapShade",
#      1.9.4); the paint is gone - the cleft is real and is seen by its own faces.
# Idempotent by the marker "wedgeGrooved".
import io
P = '/home/claude/b2src/src/40-altar.js'
s = io.open(P, encoding='utf-8').read()
if 'wedgeGrooved' in s:
    print('40-altar.js: already patched')
else:
    a = s.index('    const RAMP_HEADS = { hair: 10.6, tosafot: 11.0, chaim: 11.75 };')
    b = s.index('    wedge(63.5, 66.5, 11.55, 33, 6, rampG, RAMP_H(33)); // east small ramp to the soveiv (Rashi)')
    assert a < b
    old = s[a:b]
    assert 'gapShade' in old and 'rovG' in old and old.count('ctx2.shared.rampGap = {') == 1
    NEW = '''    const RAMP_HEADS = { hair: 10.6, tosafot: 11.0, chaim: 11.75 };
    // 1.9.3 (the user, of the kuntres, point 10: "חריצין"): THE THREE ROVDIN - R. Hai Gaon (Beit Yosef OC 123; 3900 line 2000): "ובין כבש
    // למזבח היו שלש רובדין של אבן, ויורד בהם ג' פסיעות על עקב"; Binyan Tzion 12 (5791 line 51): one where the ramp floats over the sovev,
    // one where it floats over the yesod, one over the ground. The kuntres: three grooves near the ramp's head, which leave three rovdin
    // at its end, joined at their side to the ramp's middle; the kohanim walk over them. On the EAST half of the head (the kuntres'
    // drawing), from the ramp's middle to its east edge: 0.4, 1.4 and 2.4 from the head - in the default reading over the sovev's
    // place (z 11), over the yesod's place (12) and over the ground (13).
    // 1.9.5 (the user, 11.11.2026 16:48: "אפשר להנכיח את החריצים ללא הדגשה? - א"כ תעשה"): REAL GROOVES, NO PAINT. Until 1.9.4 they were
    // three dark boxes sunk in the head; now each reading's ramp is built of its two halves - the west one whole, the east one on a
    // profile with three notches (0.2 wide, half an amah deep, their walls square to the slope) - merged into one mesh of the ramp's
    // own stone, so the grooves are seen by their own walls and what light falls in them. Their width and depth - model choices.
    const ROV_AT = [0.4, 1.4, 2.4], ROV_W = 0.2, ROV_D = 0.5;
    const wedgeGrooved = (xa, xm, xb, zTop, zBot, h, grp) => {
      const L = zBot - zTop, th = Math.atan2(h, L), ct = Math.cos(th), st = Math.sin(th), H = (u) => h * (1 - u / L);
      const half = (x0, x1, cut) => {
        const sh = new Shape();
        sh.moveTo(0, 0);
        sh.lineTo(L, 0);
        if (cut) for (const u of ROV_AT.slice().sort((p, q) => q - p)) {   // from the foot up to the head: the lower lip, down, across, up, the upper lip
          const bx = u + ct * ROV_W / 2, by = H(u) - st * ROV_W / 2, ax = u - ct * ROV_W / 2, ay = H(u) + st * ROV_W / 2;
          sh.lineTo(bx, by);
          sh.lineTo(bx - st * ROV_D, by - ct * ROV_D);
          sh.lineTo(ax - st * ROV_D, ay - ct * ROV_D);
          sh.lineTo(ax, ay);
        }
        sh.lineTo(0, h);
        sh.closePath();
        const geo = new ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false });
        // the stone's pattern runs on across the two halves: the side walls' v is 1 - (the way from the half's east end), so each half
        // adds its east end's distance from the whole ramp's
        const uv = geo.attributes.uv, sg = geo.groups && geo.groups[1];
        if (uv && sg && xb - x1 > 1e-6) { for (let i = sg.start; i < sg.start + sg.count; i++) uv.setY(i, uv.getY(i) - (xb - x1)); uv.needsUpdate = true; }
        geo.rotateY(-Math.PI / 2);
        geo.translate(x1, F, zTop);
        return geo;
      };
      const ga = half(xa, xm, false), gb = half(xm, xb, true);
      ga.clearGroups(); gb.clearGroups();
      const m = new Mesh(mergeGeometries([ga, gb]), AS);
      m.castShadow = m.receiveShadow = true;
      (grp || mv).add(m);
      return m;
    };
    const rampMain = {};
    for (const k in RAMP_HEADS) { rampMain[k] = wedgeGrooved(47.5, 55.5, 63.5, RAMP_HEADS[k], 42.6, RAMP_H(RAMP_HEADS[k]), rampG); rampMain[k].name = "rampMain_" + k; rampMain[k].visible = k === "hair"; }
    ctx2.labels.push({ text: "שלושה רובדין — חריצים בראש הכבש (רב האי גאון)", x: 60, y: F + 11.4, z: 12.4, size: 1.1, layer: "altarBody32", moveWithAltar: true });
    // 1.9.4 (the user, 11.11.2026: "הכבש של תוספות בבית ראשון נראה לי יותר מציאותי מאשר בבית שני"): the air of the Tosafot's reading was
    // built and not seen, so the cleft (z 10.5..11, over the sovev) was painted dark inside. 1.9.5 (the user: "ללא הדגשה"): the paint
    // is gone - the cleft is real (the ramp's head ends half an amah before the altar, down to the sovev) and is seen as it is.
    ctx2.shared.rampGap = { mode: "hair", set(m) { this.mode = Object.prototype.hasOwnProperty.call(RAMP_HEADS, m) ? m : "hair"; for (const k in rampMain) rampMain[k].visible = k === this.mode; return this.mode; } };
'''
    s = s[:a] + NEW + s[b:]
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('40-altar.js: patched')
