# -*- coding: utf-8 -*-
# 1.9.5 - Herod's three-coloured marble: OFF the heichal's walls, INTO the azarah's floor (the user, 11.11.2026: "להסיר את שיטת הקירות,
# ולהעביר לרצפה"). Patches /home/claude/b2src/src/30-courts.js and 50-heichal.js. Idempotent.
import io, sys
P3 = '/home/claude/b2src/src/30-courts.js'
P5 = '/home/claude/b2src/src/50-heichal.js'
s3 = io.open(P3, encoding='utf-8').read()
s5 = io.open(P5, encoding='utf-8').read()
if 'herodFloor' in s3 and 'herodFloorTex' in s5:
    print('b2_herod_floor: already applied'); sys.exit(0)
def rep(s, a, b, n=1):
    if s.count(a) != n: raise SystemExit('b2_herod_floor: %d occurrences of: %s' % (s.count(a), a[:90]))
    return s.replace(a, b)
# ---- 30-courts.js: the azarah's floor pieces are kept (ctx2.herodFloor), their top faces mapped by their place in the court
s3 = rep(s3, """    const boxHoles = (parent, w, h, d, mat, cx, y, cz, holes) => {
      const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;""",
"""    const boxHoles = (parent, w, h, d, mat, cx, y, cz, holes) => {
      const made = [];   // 1.9.5: the pieces, for the reading of the floor's marble (ctx2.herodFloor)
      const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;""")
s3 = rep(s3, """        for (const [h0, h1] of zs) { if (h0 - zc > 1e-3) H2.box(parent, b - a, h, h0 - zc, mat, mid, y, (zc + h0) / 2); zc = Math.max(zc, h1); }
        if (z1 - zc > 1e-3) H2.box(parent, b - a, h, z1 - zc, mat, mid, y, (zc + z1) / 2);
      }
    };""",
"""        for (const [h0, h1] of zs) { if (h0 - zc > 1e-3) made.push(H2.box(parent, b - a, h, h0 - zc, mat, mid, y, (zc + h0) / 2)); zc = Math.max(zc, h1); }
        if (z1 - zc > 1e-3) made.push(H2.box(parent, b - a, h, z1 - zc, mat, mid, y, (zc + z1) / 2));
      }
      return made;
    };""")
s3 = rep(s3, "    H2.box(g, 11, 0.15, 135, M2.paveFine, 88, 13.35, 0);\n",
"""    // 1.9.5 (the user, 11.11.2026: "להסיר את שיטת הקירות, ולהעביר לרצפה"): the pieces of THE AZARAH'S FLOOR - the court of Israel's strip
    // and the priests' court's slab - are kept in ctx2.herodFloor: the reading "שיש בשלושה גוונים ברצפת העזרה" of the row "בניין הורדוס"
    // gives them its marble (50-heichal.js, ctx2.shared.herod). Their top faces are mapped by their place in the court (u = x, v = z),
    // so that the marble's bands run on from piece to piece.
    const herodFloor = [H2.box(g, 11, 0.15, 135, M2.paveFine, 88, 13.35, 0)];
""")
s3 = rep(s3, """    boxHoles(g, 176, 2.65, 135, M2.pave, -5.5, 13.35, 0, [MPIT, KPIT, CIH]);
    const ciPlug = H2.box(g, CIH.w, 2.65, CIH.d, M2.pave, CIH.x, 13.35, CIH.z);
""", """    herodFloor.push(...boxHoles(g, 176, 2.65, 135, M2.pave, -5.5, 13.35, 0, [MPIT, KPIT, CIH]));
    const ciPlug = H2.box(g, CIH.w, 2.65, CIH.d, M2.pave, CIH.x, 13.35, CIH.z);
    herodFloor.push(ciPlug);
    for (const m of herodFloor) {
      const uv = m.geometry.attributes.uv, ps = m.geometry.attributes.position, nr = m.geometry.attributes.normal;
      for (let i = 0; i < uv.count; i++) if (nr.getY(i) > 0.5) uv.setXY(i, ps.getX(i) + m.position.x, ps.getZ(i) + m.position.z);
      uv.needsUpdate = true;
    }
    ctx2.herodFloor = herodFloor;
""")
# ---- 50-heichal.js: the walls' marble goes, the floor's marble comes
i0 = s5.index("    // 1.4.0 (the user: \"הורודס כמתג\"): Herod's building (Bava Batra 4a:")
i1 = s5.index("    // 1.9.5 (a remark sent on to the user, 11.11.2026: \"בגג ההיכל המעקות לא חופפים\"; the user: \"מצוין\"): ONE RING.")
old = s5[i0:i1]
assert 'const herodTex = ' in old and 'ctx2.herodAdd = ' in old, 'herod block'
new = r'''    // 1.4.0 (the user: "הורודס כמתג"): Herod's building - Bava Batra 4a / Sukkah 51b (124, line 74; 108, lines 1317-1318): "במאי בנייה?
    // אמר רבה: באבני שישא ומרמרא. איכא דאמרי: באבני כוחלא, שישא ומרמרא. אפיק שפה ועייל שפה, כי היכי דנקביל סידא. סבר למשעייה
    // בדהבא, אמרו ליה רבנן: שבקיה, דהכי שפיר טפי, דמיחזי כי אידוותא דימא". Rashi (Bava Batra 4a): "שישא - שיש ירוק", "ומרמרא - שיש
    // לבן", "כוחלא - שיש צבוע כעין כחול", "אידוותא דימא - גלי הים"; (Sukkah 51b) "כגלי הים שהאבנים משונים במראיהן זו מזו והעינים
    // המסתכלות בהן שוטטות ונראות כאילו גלי הים הם נדים ונעים". From 1.4.0 to 1.9.4 the reading dressed THE HEICHAL'S WALLS in
    // courses of the three marbles.
    // 1.9.5 (a remark sent on to the user, 11.11.2026: "בבנין הורדוס השיש הצבוע לא הי' בקירות ההיכל... השיש כגלי הים הי' בריצפה";
    // the user: "להסיר את שיטת הקירות, ולהעביר לרצפה"): the walls keep their stone in every reading, and the reading lays the three
    // marbles in THE AZARAH'S FLOOR (the pieces of 30-courts.js, ctx2.herodFloor) - the Rambam, Beit HaBechirah 1:10 "ומרצפין את כל
    // העזרה באבנים יקרות" (337, line 12), Har HaMoriah there "כוונתו באבני שיש" (5474, line 25). That the coloured marble was in the
    // floor is told in the name of the book "חנוכת הבית" - not in the user's library, NOT VERIFIED; the card says so. The floor: slabs
    // of two amot in the three marbles, their rows waving like the sea (the slabs' size and the rows' wave - model choices).
    const herodFloorTex = (() => {
      const SZ = 1024, N = 12, T = SZ / N;   // the tile is 24 amot: 12 x 12 slabs of 2 amot
      const cv = document.createElement("canvas");
      cv.width = cv.height = SZ;
      const c = cv.getContext("2d");
      const MARBLE = [["#f1eee7", "#e2ddd0"], ["#a9c0a2", "#8ea886"], ["#9db4d0", "#839dbd"]];   // white, green, blue
      for (let i = 0; i < N; i++) {
        const wave = Math.round(1.6 * Math.sin((2 * Math.PI * i) / N));   // the rows wave across the tile (one wave a tile: it joins itself)
        for (let j = 0; j < N; j++) {
          const kind = (((j + wave) % 3) + 3) % 3, x = i * T, y = j * T;
          const [a, b2] = MARBLE[kind];
          const gr = c.createLinearGradient(x, y, x + T, y + T);
          gr.addColorStop(0, a); gr.addColorStop(0.35 + hash(i * 7.3 + j * 3.1) * 0.3, b2); gr.addColorStop(1, a);
          c.fillStyle = gr; c.fillRect(x, y, T, T);
          for (let v = 0; v < 5; v++) {   // the veins of the marble
            c.strokeStyle = kind === 0 ? "rgba(150,140,125,0.22)" : "rgba(255,255,255,0.26)";
            c.lineWidth = 1 + hash(v + i * 1.7 + j) * 1.4;
            c.beginPath();
            let px = x + hash(v * 3.3 + i + j * 2.9) * T, py = y + hash(v * 5.1 + j + i * 0.7) * T;
            c.moveTo(px, py);
            for (let k = 0; k < 4; k++) { px += (hash(k + v + i * 2.1) - 0.4) * 30; py += (hash(k * 2.2 + v + j) - 0.5) * 24; c.lineTo(Math.min(x + T, Math.max(x, px)), Math.min(y + T, Math.max(y, py))); }
            c.stroke();
          }
          c.fillStyle = "rgba(60,55,45,0.5)"; c.fillRect(x, y, T, 1.5); c.fillRect(x, y, 1.5, T);   // the joints
        }
      }
      const tx = new CanvasTexture(cv);
      tx.wrapS = tx.wrapT = RepeatWrapping; tx.anisotropy = 8; tx.colorSpace = SRGBColorSpace; tx.repeat.set(1 / 24, 1 / 24);
      return tx;
    })();
    const herodFloorMat = new MeshStandardMaterial({ map: herodFloorTex, roughness: 0.3, metalness: 0.03, envMapIntensity: 0.9 });
    const herodPairs = (ctx2.herodFloor || []).map((m) => [m, m.material]);
    ctx2.shared.herod = { on: false, get() { return this.on; }, set(on) { this.on = !!on; herodPairs.forEach(([m, b]) => { m.material = this.on ? herodFloorMat : b; }); } };
    ctx2.herodAdd = () => {};   // (1.9.5: the house's outer faces keep their stone - nothing joins the swap any more)
'''
s5 = s5[:i0] + new + s5[i1:]
io.open(P3, 'w', encoding='utf-8').write(s3)
io.open(P5, 'w', encoding='utf-8').write(s5)
print('b2_herod_floor: applied')
