# -*- coding: utf-8 -*-
# 2.0.4 / B2 1.9.5 - SHUSHAN HABIRAH AND THE TWO MEASURING RODS (a remark sent on to the user, 11.11.2026 14:40; his decisions 15:02,
# 16:31 with his file of sources, 16:38 "ב"). Adds the two readings' geometry to 30-courts.js. Idempotent by the marker "shushanRods".
import io
P = '/home/claude/b2src/src/30-courts.js'
s = io.open(P, encoding='utf-8').read()
if 'shushanRods' in s:
    print('30-courts.js: already patched')
else:
    A = '    ctx2.shared.eznEastWall = (low) => { eznEHigh.visible = !low; eznELow.visible = !!low; };\n'
    assert s.count(A) == 1
    NEW = A + '''    // 1.9.5 (a remark sent on to the user, 11.11.2026: "מעל שער שושן היתה עלי' עם אמות מידה"; the user: "את עלייה עם אמות המידה ב'
    // שיטות"; his file of sources of 16:31, and "ב" - the room over the women's court's gate): SHUSHAN HABIRAH AND THE TWO MEASURING
    // RODS - Kelim 17:9 (book 91, line 150): "ושתי אמות היה בשושן הבירה, אחת על קרן מזרחית צפונית ואחת על קרן מזרחית דרומית. שעל קרן
    // מזרחית צפונית היתה יתרה על של משה חצי אצבע. שעל קרן מזרחית דרומית היתה יתרה עליה חצי אצבע, נמצאת יתרה על של משה אצבע".
    // TWO READINGS (ctx2.shared.shushanRods.set; the row "שושן הבירה ושתי האמות"):
    //  "rambam" (the default) - the Rambam's commentary there (558, line 293): "שבשער מזרחית משערי הר הבית היתה צורת שושן הבירה ולזה
    //   יקראו שער שושן הבירה... ומזה השער יאמרו ושתי אמות היו בשושן הבירה" (and on Middot 1:3 - 573, line 6; the Bartenura there - 643,
    //   line 17): the two rods at the Shushan gate, on the east faces of its two jambs; no room;
    //  "rashi" - Rashi Menachot 98a (2186, line 4648) "חדר אחד היה בנוי על שער המזרחי של עזרה ומצוייר כתבנית שושן הבירה", Rashi Pesachim
    //   86a (2162, line 4141) "בית הבנוי על גובה השער", the Bartenura on Kelim 17:9 (627, line 1141), Tosafot Pesachim 86a (1905, line
    //   910) "אחת משערי העזרה היה": a room on the wall's top over the eastern gate of the women's court (the Rashash, Pesachim 86a -
    //   2492, line 718: "ובציורי הרמב"ם בסוף מדות בטבלא א' אות ה' מצוייר בשער עזרת נשים"; the user's choice), the rods inside it, on its
    //   east wall, by its north-east and south-east corners.
    // A rod: Moses' amah of six handbreadths = twenty-four fingers; the north-eastern one half a finger more, the south-eastern a finger
    // more. The rods' look, their plates, their height on the jambs, the room's place on the wall's top, its size and door - model
    // choices. Shushan's picture is not drawn.
    {
      const A1 = 1, FNG = A1 / 24;
      const rod = (grp, x, y, z, len, face) => {   // a rod along z on a marble plate, on a wall's face (face: +1 - the face looks east, -1 - west)
        H2.box(grp, 0.08, 0.7, 1.7, M2.marble, x + face * 0.04, y - 0.4, z).userData.noPick = true;
        H2.box(grp, 0.1, 0.1, len, M2.bronze, x + face * 0.13, y - 0.05, z);
        for (const sg of [-1, 1]) H2.box(grp, 0.12, 0.28, 0.04, M2.bronze, x + face * 0.13, y - 0.14, z + sg * len / 2);   // the two end marks
      };
      // the Rambam's: on the Shushan gate's jambs (20-mount.js gateTrim: they stand at z +-5.9, their east faces 3.3 east of the wall's line)
      const gR = new Group();
      gR.name = "shushanRodsGate";
      g.add(gR);
      const XJ = CO.harE + 3.3;
      rod(gR, XJ, 4.2, -5.9, A1 + FNG / 2, 1);
      rod(gR, XJ, 4.2, 5.9, A1 + FNG, 1);
      // Rashi's: the room on the wall's top over the women's court's east gate (the wall's cap ends at y 40.9; its merlons, 1.5 high,
      // are inside the room's floor slab)
      const gT = new Group();
      gT.name = "shushanRoom";
      gT.visible = false;
      gT.position.y = 40.9;
      g.add(gT);
      const RX = 228.5, RW = 9, RL = 16, RH = 7, WT = 0.8, FL = 1.6;   // 9 (east-west) x 16 (north-south) outside, 7 high inside
      H2.box(gT, RW, FL, RL, M2.stoneLight, RX, 0, 0);                                                                    // the floor
      H2.box(gT, WT, RH, RL, M2.stone, RX + RW / 2 - WT / 2, FL, 0);                                                      // the east wall
      for (const sg of [-1, 1]) H2.box(gT, RW - 2 * WT, RH, WT, M2.stone, RX, FL, sg * (RL / 2 - WT / 2));                // north, south
      for (const sg of [-1, 1]) H2.box(gT, WT, RH, RL / 2 - 1.5, M2.stone, RX - RW / 2 + WT / 2, FL, sg * (1.5 + (RL / 2 - 1.5) / 2));   // the west wall, a door 3 wide in its middle
      H2.box(gT, WT, RH - 4.5, 3, M2.stone, RX - RW / 2 + WT / 2, FL + 4.5, 0);
      const roof = H2.box(gT, RW + 0.6, 0.6, RL + 0.6, M2.stoneLight, RX, FL + RH, 0);
      ctx2.lishkotCut.push(roof);
      const xin = RX + RW / 2 - WT, zc = RL / 2 - WT - 1.3;   // the east wall's inner face; the rods' middles
      rod(gT, xin, FL + 3.2, -zc, A1 + FNG / 2, -1);
      rod(gT, xin, FL + 3.2, zc, A1 + FNG, -1);
      ctx2.layers = ctx2.layers || {};
      ctx2.layers.shushanRodsGate = gR; ctx2.layers.shushanRoom = gT;
      const n0 = ctx2.labels.length;
      ctx2.labels.push(
        { text: "שתי האמות שבשושן הבירה (כלים יז, ט)", x: XJ + 1, y: 8.2, z: 0, size: 1.1, layer: "shushanRodsGate" },
        { text: "אמה יתרה חצי אצבע — קרן מזרחית צפונית", x: XJ + 0.5, y: 5.5, z: -5.9, size: 0.6, layer: "shushanRodsGate" },
        { text: "אמה יתרה אצבע — קרן מזרחית דרומית", x: XJ + 0.5, y: 5.5, z: 5.9, size: 0.6, layer: "shushanRodsGate" }
      );
      const n1 = ctx2.labels.length;
      ctx2.labels.push(
        { text: "שושן הבירה — חדר על גבי השער (רש״י)", x: RX, y: 40.9 + FL + RH + 2.6, z: 0, size: 1.8, layer: "shushanRoom" },
        { text: "אמה יתרה חצי אצבע — קרן מזרחית צפונית", x: xin - 0.5, y: 40.9 + FL + 4.4, z: -zc, size: 0.6, layer: "shushanRoom" },
        { text: "אמה יתרה אצבע — קרן מזרחית דרומית", x: xin - 0.5, y: 40.9 + FL + 4.4, z: zc, size: 0.6, layer: "shushanRoom" }
      );
      const roomLbl = ctx2.labels.slice(n1);
      ctx2.shared.shushanRods = {
        mode: "rambam", low: false, base: 40.9,
        set(m) {
          this.mode = m === "rashi" ? "rashi" : "rambam";
          gR.visible = this.mode === "rambam";
          gT.visible = this.mode === "rashi";
          return this.mode;
        },
        place(low) {   // Rabbenu Shemaya's low wall: the gate stands as a gatehouse 23 high, and the room on it
          const y = low ? 29.9 : 40.9, d = y - gT.position.y;
          this.low = !!low; this.base = y;
          if (!d) return;
          gT.position.y = y;
          for (const l of roomLbl) moveLbl(l, 0, d, 0);
        }
      };
      const ew0 = ctx2.shared.eznEastWall;
      ctx2.shared.eznEastWall = (low) => { ew0(low); ctx2.shared.shushanRods.place(!!low); };
    }
'''
    s = s.replace(A, NEW)
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('30-courts.js: patched')
