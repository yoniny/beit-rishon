# -*- coding: utf-8 -*-
# PAYIS_195, round 3 (12.11.2026, the user 00:05): "למה בכלל השערים פתוחים?" - by night every gate is shut; the house of the hearth's
# gate to the chel is opened for the appointed one, and they go out to the court through the wicket. And the ramp: "בכל יום כהנים
# עולים במזרחו של כבש ויורדין במערבו" (Yoma 4:5, read in his library 12.11, 55:35) - the winner went up its middle.
import io, sys
C = '/home/claude/b2src/src/10-core.js'
s = io.open(C, encoding='utf-8').read()
if 'DOORS_TAG_195' not in s:
    a = "    const grp = new Group();\n    const lw = width / 2 - 0.1;\n"
    assert s.count(a) == 1
    s = s.replace(a, "    const grp = new Group();\n    grp.userData.tmDoors = { inward, open };   // DOORS_TAG_195: the lotteries' night (55-payis.js) shuts every gate and gives it back\n    const lw = width / 2 - 0.1;\n")
    io.open(C, 'w', encoding='utf-8').write(s)
    print('10-core.js: doors tagged')
F = '/home/claude/b2src/src/55-payis.js'
s = io.open(F, encoding='utf-8').read()
if 'PAYIS_GATES' in s:
    print('already'); sys.exit(0)
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:100])
    s = s.replace(a, b)
# ---------- the ramp: up on its east side, down on its west
rep('''      // the one who won goes up the ramp to the top of the altar, alone and with no light ("מהלך לאור המערכה", Tamid 1:4); d seconds
      const toAltar = (d) => {
        const f = K[6];
        ev(1.2, () => { for (const x of K) x.visible = false; MEM.visible = false; T1.visible = T2.visible = false; f.visible = true; f.userData.hand.visible = false; f.userData.body.material = mWin; });
        track(f, [[1.2, rx + 10, Y, 44.6 + rz], [3, rx + 1, Y, 43.2 + rz], [d - 1.6, rx + 1, Y + 9, 10.2 + rz], [d - 0.5, rx + 2.4, Y + 9, 5.4 + rz]]);
        ev(d, () => { f.visible = false; f.userData.body.material = f.userData.robe; });
      };''', '''      // the one who won goes up the ramp to the top of the altar, alone and with no light ("מהלך לאור המערכה", Tamid 1:4) - up on the
      // ramp's EAST side and down on its WEST (Yoma 4:5 "בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו"; the user, 12.11.2026:
      // he went up its middle); d seconds (twelve)
      const toAltar = (d) => {
        const f = K[6], xe = rx + 6, xw = rx - 6;
        ev(1.2, () => { for (const x of K) x.visible = false; MEM.visible = false; T1.visible = T2.visible = false; f.visible = true; f.userData.hand.visible = false; f.userData.body.material = mWin; });
        track(f, [[1.2, xe + 5, Y, 45.4 + rz], [2.6, xe, Y, 43.2 + rz], [6.2, xe, Y + 9, 10.2 + rz], [6.9, rx + 5.1, Y + 9, 7.4 + rz], [7.8, rx + 5.1, Y + 9, 7.4 + rz], [8.5, xw, Y + 9, 10.2 + rz],
          [d - 0.3, xw, Y, 43.2 + rz]]);
        cap(5.2, "״בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו״ (יומא ד, ה)");
        ev(d, () => { f.visible = false; f.userData.body.material = f.userData.robe; });
      };''')
rep("        toAltar(8);\n        t += 8;", "        toAltar(12);\n        t += 12;", 2)
# ---------- the appointed one waits on the steps while the gate is opened for him (its leaves swing out, to the chel)
rep("        const up = (x) => [[1, x, 0, -100.9], [2.8, x, 6, -91.75], [3.6, x, 6, -85], [6.2, x, YM, -78.8]];",
    "        const up = (x) => [[1, x, 0, -100.9], [2.8, x, 6, -91.75], [3.6, x, 6, -85], [6.2, x, YM - 2.7, -80.2]];\n        S.knock = 6.4;")
rep("        track(MEM, [[1, -8.4, YM, -73.3], [3, -12.5, YM, -73.3]], [-18, -67.5]);", "        S.knock = 0.4;\n        track(MEM, [[1, -8.4, YM, -73.3], [3, -12.5, YM, -73.3]], [-18, -67.5]);")
rep("[[-18.9, YM, -78.8], [-22.6, YM, -73], [-22.6, YM, -68.2], [-22.4, Y, -67]];", "[[-18.9, YM - 2.7, -80.2], [-18.9, YM, -77.2], [-22.6, YM, -73], [-22.6, YM, -68.2], [-22.4, Y, -67]];")
rep("[[-17.2, YM, -78.8], [-13.9, YM, -73.2], [-13.9, YM, -68.2], [-13.9, Y, -67]];", "[[-17.2, YM - 2.7, -80.2], [-17.2, YM, -77.2], [-13.9, YM, -73.2], [-13.9, YM, -68.2], [-13.9, Y, -67]];")
rep('''          track(MEM, [[7.2, -18.9, YM, -78.8], [8.8, -18.9, YM, -73.6]]);
          track(T1, [[7.2, -17.2, YM, -78.8], [8.8, -17.2, YM, -73.6]]);''', '''          track(MEM, [[7.4, -18.9, YM - 2.7, -80.2], [8.1, -18.9, YM, -77.2], [8.9, -18.9, YM, -73.6]]);
          track(T1, [[7.4, -17.2, YM - 2.7, -80.2], [8.1, -17.2, YM, -77.2], [8.9, -17.2, YM, -73.6]]);''')
# ---------- out to the court through the wicket
i = s.index("      cam(2.6, camMokedS[0], camMokedS[1]);\n      const P0 = 3.6;")
j = s.index("      track(T1, pathE);", i)
s = s[:i] + '''      cam(2.4, camMokedS[0], camMokedS[1]);
      // through the wicket in the east leaf of the shut gate (Middot 1:7 "פשפש קטן היה לו, שבו נכנסין לבלש את העזרה"): x -15.45, z -57.4
      const W1 = 2.6, P0 = 4.8;   // the second the first torch passes the wicket; the second the companies part
      S.wicketAt = t + W1 - 1.1;
      const s1 = reading === "tamid" ? [[0, -13.95, Y, -59.8]] : [[0, -17.2, YM, -73.6], [1.2, -13.9, YM, -68.4], [1.5, -13.9, Y, -67]];
      const s2 = reading === "tamid" ? [[0.5, -16.5, Y, -62.5]] : [[0.5, -16.4, YM, -72.6], [1.7, -13.9, YM, -68.4], [2, -13.9, Y, -67]];
      const pathE = s1.concat([[W1, -15.45, Y, -57.4], [W1 + 0.7, -14.6, Y, -55.4], [P0 - 0.6, -13.6, Y, -54.2], [P0, -13.6, Y, -54.2], [P0 + 3.4, 20, Y, -50], [P0 + 6.8, 58, Y, -49], [P0 + 8.8, 80, Y, -44],
        [P0 + 12, 81, Y, 14]]);
      const pathW = s2.concat([[W1 + 0.5, -15.45, Y, -57.4], [W1 + 1.2, -16.4, Y, -55.4], [P0 - 0.3, -17.6, Y, -54.2], [P0, -17.6, Y, -54.2], [P0 + 1.4, -60, Y, -52], [P0 + 2.3, -88, Y, -44], [P0 + 5.2, -88, Y, 44],
        [P0 + 6.6, -40, Y, 52], [P0 + 8.6, 26, Y, 52], [P0 + 9.2, 45, Y, 54.5], [P0 + 9.9, 66, Y, 54.5], [P0 + 12, 81, Y, 22]]);
''' + s[j:]
# ---------- the day begins: the gates as the model draws them
rep("      // ===== the day: the third and the fourth lotteries, in the Gazit\n", "      // ===== the day: the third and the fourth lotteries, in the Gazit\n      S.dayAt = t;\n")
rep("      const S = { cams: [], caps: [], sky: [], tracks: [], ev: [], counts: [], dur: 0 };", "      const S = { cams: [], caps: [], sky: [], tracks: [], ev: [], counts: [], dur: 0, knock: 0, wicketAt: 1e9, dayAt: 1e9 };")
# ---------- the runner: the gates by night
rep("    const roofsBtn = () =>", '''    // ---------- PAYIS_GATES (the user, 12.11.2026: "למה בכלל השערים פתוחים?"): while it is night every gate the model draws with leaves
    // (10-core.js doors - tagged userData.tmDoors) is shut. The house of the hearth's gate to the chel is opened for the appointed
    // one ("והם פתחו לו", Tamid 1:2), and a wicket opens in the east leaf of its gate to the court ("ופתח את הפשפש, ונכנס מבית
    // המוקד לעזרה", 1:3; R. Yehuda, Middot 1:7 - the model's own wicket stands half under the court's floor, so the night draws
    // its own at the floor). With the day, and when it stops, every leaf is as it was.
    const GT = { saved: null, chel: null, court: null, wk: null }, gv = new Vector3();
    const doorsOf = (x, z) => {
      let best = null, bd = 2.5;
      ctx2.scene.traverse((o) => {
        if (!o.userData || !o.userData.tmDoors || o.children.length < 2) return;
        let p = o, vis = true;
        while (p && vis) { vis = p.visible; p = p.parent; }
        if (!vis) return;
        o.getWorldPosition(gv);
        const d = Math.hypot(gv.x - x, gv.z - z);
        if (d < bd) { bd = d; best = o; }
      });
      return best;
    };
    const setOpen = (g, a) => {
      if (!g) return;
      const inw = g.userData.tmDoors.inward || 1;
      g.children[0].rotation.y = -a * inw;
      g.children[1].rotation.y = Math.PI + a * inw;
    };
    const wicket = (on) => {
      if (!on) {
        if (GT.wk) { GT.wk.hole.visible = false; GT.wk.piv.visible = false; if (GT.wk.wm) GT.wk.wm.visible = true; }
        return;
      }
      const leaf = GT.court && GT.court.children[1];
      if (!leaf) return;
      if (!GT.wk || GT.wk.leaf !== leaf) {
        const wm = leaf.children.find((c) => c.isMesh && c.geometry && c.geometry.parameters && Math.abs(c.geometry.parameters.width - 1.8) < 0.01 && Math.abs(c.geometry.parameters.height - 3.8) < 0.01) || null;
        const hole = new Mesh(new BoxGeometry(1.8, 3.8, 0.56), new MeshBasicMaterial({ color: 0x06070b }));
        hole.position.set(2.45, 4.25, 0);
        const piv = new Group();
        piv.position.set(3.35, 2.35, 0);
        const dg = new BoxGeometry(1.8, 3.8, 0.1);
        dg.translate(-0.9, 1.9, 0);
        piv.add(new Mesh(dg, wm ? wm.material : mat(0x8a6420, { metalness: 0.6, roughness: 0.4 })));
        leaf.add(hole);
        leaf.add(piv);
        GT.wk = { leaf, wm, hole, piv };
      }
      if (GT.wk.wm) GT.wk.wm.visible = false;
      GT.wk.hole.visible = false;
      GT.wk.piv.visible = true;
      GT.wk.piv.rotation.y = 0;
    };
    const gatesNight = (on) => {
      if (on === !!GT.saved) return;
      if (on) {
        GT.saved = [];
        ctx2.scene.traverse((o) => {
          if (!o.userData || !o.userData.tmDoors || o.children.length < 2) return;
          GT.saved.push([o, o.children[0].rotation.y, o.children[1].rotation.y]);
          setOpen(o, 0);
        });
        GT.chel = SH.mokedGates && SH.mokedGates.mode === "adjacent" ? doorsOf(-6.5, -73.3) : doorsOf(-18, -77);
        GT.court = doorsOf(-18, -58);
        wicket(true);
      } else {
        for (const [o, a, b] of GT.saved) { o.children[0].rotation.y = a; o.children[1].rotation.y = b; }
        GT.saved = null;
        GT.chel = GT.court = null;
        wicket(false);
      }
    };
    const gatesStep = (S, t) => {
      const night = t < S.dayAt;
      gatesNight(night);
      if (!night) return;
      const cl = (u) => Math.max(0, Math.min(1, u));
      setOpen(GT.chel, 0.95 * ease(cl((t - S.knock) / 0.9)));
      if (GT.wk) { const u = ease(cl((t - S.wicketAt) / 0.7)); GT.wk.hole.visible = u > 0.02; GT.wk.piv.rotation.y = -1.7 * u; }
    };
    const roofsBtn = () =>''')
rep("      for (const [b, a] of R.pills || []) b.anchor = a;", "      for (const [b, a] of R.pills || []) b.anchor = a;\n      gatesNight(false);")
rep("      // the events up to now, in their order\n", "      gatesStep(S, t);\n      // the events up to now, in their order\n")
io.open(F, 'w', encoding='utf-8').write(s)
print('ok')
