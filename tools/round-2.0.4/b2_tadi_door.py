# -*- coding: utf-8 -*-
# 1.9.5 - Tadi's leaves end aslant, as the gate's head (the user: "8. תשנה"). Patches /home/claude/b2src/src/20-mount.js. Idempotent.
import io, sys
P = '/home/claude/b2src/src/20-mount.js'
s = io.open(P, encoding='utf-8').read()
if 'tadiLeaves' in s:
    print('b2_tadi_door: already applied'); sys.exit(0)
a = '    H2.doors(g, { axis: "x", cx: 55, cz: CO.harN, y: 0, width: 10, height: 20, inward: 1, mat: M2.gateGold, open: 1.0, inset: 2 });\n'
if s.count(a) != 1: raise SystemExit('b2_tadi_door: anchor')
b = r'''    // 1.9.5 (a remark sent on to the user, 11.11.2026: "בשער טדי לכאו' הדלת הסתיימה באלכסון כמו השער - לא ממקורות אלא מהעובדה כי זה הי'
    // שער הכניסה לעיר מצפון"; the user: "8. תשנה"): TADI'S LEAVES END ASLANT, as the gate's head - each leaf as high as the jamb at
    // its hinge (20) and as the gable at the gate's middle (24), so that the two, shut, close the triangle between the two leaning
    // stones too (until 1.9.4 two upright leaves of 20, the triangle open over them). No source - a model choice; the card says so.
    {
      const grp = new Group();
      grp.name = "tadiLeaves";
      const lw = 4.9, th = 0.4, h0 = 19.7, h1 = 19.7 + 4 * (lw / 5);
      for (const sd of [-1, 1]) {
        const sh = new Shape();
        sh.moveTo(0, 0); sh.lineTo(lw, 0); sh.lineTo(lw, h1); sh.lineTo(0, h0); sh.closePath();
        const geo = new ExtrudeGeometry(sh, { depth: th, bevelEnabled: false });
        geo.translate(0, 0, -th / 2);
        const leaf = new Mesh(geo, M2.gateGold);
        leaf.position.set(sd * 5, 0.15, 2);
        leaf.rotation.y = sd < 0 ? -1.0 : Math.PI + 1.0;   // ajar into the Mount, as the other gates' leaves (H2.doors)
        leaf.castShadow = leaf.receiveShadow = true;
        H2.box(leaf, lw - 0.2, 0.35, th + 0.08, M2.bronze, lw / 2, 9.8, 0);
        grp.add(leaf);
      }
      grp.position.set(55, 0, CO.harN);
      g.add(grp);
    }
'''
s = s.replace(a, b)
io.open(P, 'w', encoding='utf-8').write(s)
print('b2_tadi_door: applied')
