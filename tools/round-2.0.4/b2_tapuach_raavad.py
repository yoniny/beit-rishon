# -*- coding: utf-8 -*-
# 2.0.4 / B2 1.9.5 - THE RA'AVAD'S TAPUACH: THE PYRES STAND BESIDE THE TABLE, NOT ON IT (the user, 11.11.2026 17:51, with the sources:
# "צריך לשנות"). Until 1.9.4 the whole top (pyres, flames, lights, smoke) was lifted one amah onto the table ("the pyres stand on it -
# model choice"). The Ra'avad's own words (Hasagot, Temidin uMusafin 2:7 - the user's library, book 5256, line 7) say otherwise:
# "שלא יהיו הגזרים הולכין צפון ודרום אלא מזרח ומערב והיינו ראשי הגזרים הפנימים נוגעין בתפוח ולא בא להוסיף אלא שיהיו נוגעים בתפוח שלא
# ירחיקו מהלך רגלי הכהנים שהיה אמה", and of the table: "ואפשר שהיתה אותה הטבלא קצוצת קרנות כעין עגולה כדי להרויח מקום המערכה".
# Idempotent by the marker "pyresRaavad".
import io
P = '/home/claude/b2src/src/40-altar.js'
s = io.open(P, encoding='utf-8').read()


def rep(old, new, name):
    global s
    k = s.count(old)
    if k != 1:
        raise SystemExit('PATCH %s: %d matches' % (name, k))
    s = s.replace(old, new)


if 'pyresRaavad' in s:
    print('40-altar.js: already patched')
else:
    rep('''    const topG = new Group();
    mv.add(topG);
    const toTop = (on) => { if (on) mv.add = function (...o) { return topG.add(...o); }; else delete mv.add; };
    toTop(true);
''', '''    const topG = new Group();
    mv.add(topG);
    // 1.9.5 (the user, 11.11.2026 17:51, of the Ra'avad's tapuach: "צריך לשנות"): TWO SETS OF PYRES in topG - pyresK, the pyres of the
    // round heap's reading (as before: the logs, the gezirin and their flames), and pyresR, the Ra'avad's (built below, by his table):
    // the pyres stand BESIDE his table, not on it, so topG is no longer lifted. The lights, the smoke, the sparks, the glow and the
    // coals stay single and follow the great pyre of the reading (FXP, ctx2.shared.tapuach).
    const pyresK = new Group(), pyresR = new Group();
    pyresK.name = "pyresKri"; pyresR.name = "pyresRaavad";
    pyresR.visible = false;
    topG.add(pyresK); topG.add(pyresR);
    const toTop = (on, tgt) => { if (on) mv.add = function (...o) { return (tgt || topG).add(...o); }; else delete mv.add; };
    toTop(true, pyresK);
''', 'topG')
    rep('''    const GP = { x0: 59.7, x1: 64.2, hz: 4, lay: 6, R: 0.25, cz: ACZ + 4.5 };
''', '''    const GP = { x0: 59.7, x1: 64.2, hz: 4, lay: 6, R: 0.25, cz: ACZ + 4.5 };
    const FXP = { x0: GP.x0, x1: GP.x1, top: 3 };   // 1.9.5: where the great pyre of the chosen reading stands (x) and how high it is - the smoke and the sparks rise from it
''', 'FXP')
    rep('''        pyre4.visible = this.count >= 4;
        pyreYK.visible = this.yk;
      },
''', '''        pyre4.visible = this.count >= 4;
        pyreYK.visible = this.yk;
        const RS = ctx2.shared.__pyresR;   // 1.9.5: the same pyres of the Ra'avad's reading
        if (RS) { RS.p3.visible = RS.f3.visible = this.count >= 3; RS.p4.visible = this.count >= 4; RS.pYK.visible = this.yk; }
      },
''', 'maarachot')
    rep('''      sparkPos[i * 3] = GP.x0 + 0.4 + Math.random() * (GP.x1 - GP.x0 - 0.8);
      sparkPos[i * 3 + 1] = TOP + 3.6 + Math.random() * 0.6;
''', '''      sparkPos[i * 3] = FXP.x0 + 0.4 + Math.random() * (FXP.x1 - FXP.x0 - 0.8);
      sparkPos[i * 3 + 1] = TOP + FXP.top + 0.6 + Math.random() * 0.6;
''', 'sparks')
    rep('''        sp.position.set(PCX + Math.sin(s * 0.7 + i * 1.7) * 0.15 * (0.4 + p), TOP + 4.4 + p * 260, GP.cz + Math.cos(s * 0.6 + i * 2.3) * 0.15 * (0.4 + p));
''', '''        sp.position.set((FXP.x0 + FXP.x1) / 2 + Math.sin(s * 0.7 + i * 1.7) * 0.15 * (0.4 + p), TOP + FXP.top + 1.4 + p * 260, GP.cz + Math.cos(s * 0.6 + i * 2.3) * 0.15 * (0.4 + p));
''', 'smoke')
    rep('''      // Drawn: a table of the altar's stone, 22 x 22 x 1 in the middle of the top, its corners cut 2 amot ("קצוצת קרנות"), the ash laid on it;
      // the pyres stand on it (model choice: the table fills the place of the pyres, 24 x 24, but for an amah round) - topG goes up one amah.
''', '''      // Drawn: a table of the altar's stone, 22 x 22 x 1 in the middle of the top, its corners cut 2 amot ("קצוצת קרנות"), the ash laid on it.
      // (Until 1.9.4 the pyres stood on it and topG went up one amah - against the Ra'avad's own words; see pyresR below.)
''', 'comment')
    rep('''      ctx2.shared.tapuach = { mode: "kri", set(k) { this.mode = k === "raavad" ? "raavad" : "kri"; const on = this.mode === "raavad"; table.visible = on; m.visible = !on; topG.position.y = on ? 1 : 0; topG.updateMatrixWorld(true); } };
''', '''      // 1.9.5 (the user, 11.11.2026 17:51: "צריך לשנות"): THE RA'AVAD'S PYRES STAND BESIDE HIS TABLE. His words (Hasagot, Temidin
      // uMusafin 2:7; the user's library, book 5256, line 7): "שלא יהיו הגזרים הולכין צפון ודרום אלא מזרח ומערב והיינו ראשי הגזרים
      // הפנימים נוגעין בתפוח ולא בא להוסיף אלא שיהיו נוגעים בתפוח שלא ירחיקו מהלך רגלי הכהנים שהיה אמה שלא יקרעו ולא ישרפו
      // בגדיהם"; and the table's corners are cut "כדי להרויח מקום המערכה". So: the table is 22 x 22 in the place of the pyres, 24 x 24
      // (Middot 3:1) - an amah is left round it, inside the kohanim's walk; the logs are an amah long ("גזירין שעשה משה - אורכן אמה",
      // Zevachim 62b; book 130, line 2117) and lie EAST-WEST in that amah, their inner ends on the table's face; the walk stays free.
      //   the great pyre - in the east ("סדר המערכה גדולה מזרחה", Tamid 2:4), along the table's east face, where it stood (z -3..5);
      //   the second, for the incense - in the west, four amot north of the south-west horn (Tamid 2:5);
      //   the third (R. Yose), R. Meir's fourth and Yom Kippur's - in the west and the east amah, opposite their old places.
      // The logs are piled as pipes (each row in the grooves of the one under it), four rows the great pyre. The length of each pyre
      // along the side, the places of the others, the pile and its height - model choices.
      {
        const XE = ACX + 11.5, XW = ACX - 11.5;   // the middle of the amah east / west of the table (x 67 / 44)
        const pile = (list, xc, zc, half, rows, r) => {
          for (let l = 0; l < rows; l++) {
            const n = Math.floor(half / r) - l;
            for (let i = 0; i < n; i++) list.push({ x: xc, z: zc - (n - 1) * r + i * 2 * r, y: TOP + r + l * r * Math.sqrt(3), alongX: true, len: 1, r });
          }
          return TOP + 2 * r + (rows - 1) * r * Math.sqrt(3);   // the pile's top
        };
        toTop(true, pyresR);
        const lR = [], l3 = [], l4 = [], lYK = [];
        const gTop = pile(lR, XE, GP.cz, GP.hz, 4, GP.R);
        pile(lR, XW, 5, 0.75, 3, 0.09);                        // the second pyre, for the incense
        pile(l3, XW, -11, 1.2, 4, 0.12);                       // the third, keeping the fire (R. Yose)
        pile(l4, XE, -9.5, 0.7, 3, 0.09);                      // R. Meir's fourth
        pile(lYK, XE, -12, 0.7, 3, 0.09);                      // Yom Kippur's
        instLogs(lR);
        const p3 = instLogs(l3), p4 = instLogs(l4), pYK = instLogs(lYK);
        // the two gezirin on the great pyre, an amah between them (the place of the lighting), and the coals in it
        for (const dz of [-1, 1]) H2.box(mv, 1, 1, 1, M2.cedar, XE, gTop, GP.cz + dz);
        const coalsR = new Mesh(new PlaneGeometry(1, 0.9), coals.material);
        coalsR.rotation.x = -Math.PI / 2;
        coalsR.position.set(XE, gTop + 0.05, GP.cz);
        coalsR.renderOrder = 1;
        mv.add(coalsR);
        [GP.cz - 3.2, GP.cz - 1.6, GP.cz, GP.cz + 1.6, GP.cz + 3.2].forEach((z, i) => {
          const k = i % 3;
          addFlame(XE + (i % 2 ? 0.12 : -0.1), gTop - 0.2, z, 0.7 - k * 0.08, 2.8 - k * 0.4, [16742942, 16758832, 16769162][k], 0.78 + k * 0.06);
        });
        addFlame(XW, TOP + 0.3, 5, 0.6, 1.6, 16758832, 0.8);
        const f3 = addFlame(XW, TOP + 0.4, -11, 0.95, 2.4, 16742942, 0.8);
        toTop(false);
        ctx2.shared.__pyresR = { p3, f3, p4, pYK, top: gTop - TOP, xe: XE, xw: XW };
      }
      ctx2.shared.tapuach = {
        mode: "kri",
        set(k) {
          this.mode = k === "raavad" ? "raavad" : "kri";
          const on = this.mode === "raavad", RS = ctx2.shared.__pyresR;
          table.visible = on; m.visible = !on;
          pyresK.visible = !on; pyresR.visible = on;
          // the fire's light, glow, coals, sparks and smoke follow the great pyre of the reading
          FXP.x0 = on ? RS.xe - 0.5 : GP.x0; FXP.x1 = on ? RS.xe + 0.5 : GP.x1; FXP.top = on ? RS.top : 3;
          const px = (FXP.x0 + FXP.x1) / 2;
          fireLight.position.set(on ? px : 62, on ? TOP + RS.top + 3.4 : 30.8, GP.cz);
          glow.position.set(px, TOP + FXP.top + 0.4, GP.cz);
          glow.scale.set(on ? 7 : 11, on ? 6.5 : 8, 1);
          coals.visible = !on;
          emberLight.position.x = on ? RS.xw : 46;
          ctx2.shared.maarachot.set(ctx2.shared.maarachot.count, ctx2.shared.maarachot.yk);
        }
      };
''', 'set')
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('40-altar.js: patched')
