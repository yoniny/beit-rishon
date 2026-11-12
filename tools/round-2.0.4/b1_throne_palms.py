# 1.3.7 (the user, 11.11.2026 19:00: "הדקלים בבית המדרש ב לא מספיק 'חיים'"; 19:03, of the proposals: "שאר ההצעות מצוינות"): livelier date
# palms round the throne (the midrash: "מקיפין לכסא") - a ringed leaning trunk, a full crown of feathered fronds that sways a little,
# clusters of dates, the linen wrapped in folds and embroidered - and the peacock's tail spread as a fan of feathers. Idempotent.
import io, sys
P = '/home/claude/beit-rishon/src/60-palace.js'
s = io.open(P, encoding='utf-8').read()
if 'THRONE_PALMS_137' in s:
    print('60-palace.js: already patched'); sys.exit(0)
def rep(a, b):
    global s
    if s.count(a) != 1:
        print('ANCHOR x%d:' % s.count(a), a[:100]); sys.exit(1)
    s = s.replace(a, b, 1)
# ---- the peacock's tail and crest
rep('''      for (const z of [-0.025, 0, 0.025]) f.rod(0.006, 0.006, 0.19, 0.66, z, 0.17, 0.74, z * 2).ell(0.012, 0.012, 0.012, 0.17, 0.745, z * 2);   // crest
      const fan = new CylinderGeometry(0.5, 0.5, 0.025, 16, 1, false, 0, Math.PI);                                // the tail spread as a fan
      fan.rotateZ(Math.PI / 2);
      fan.translate(-0.16, 0.18, 0);
      f.add(fan);
      for (let i = 0; i < 7; i++) { const a = Math.PI * (i + 0.5) / 7; f.ell(0.015, 0.045, 0.045, -0.145, 0.18 + 0.38 * Math.sin(a), 0.38 * Math.cos(a)); }   // its "eyes"''',
'''      for (const z of [-0.04, -0.02, 0, 0.02, 0.04]) f.rod(0.006, 0.006, 0.19, 0.66, z * 0.6, 0.17, 0.76, z * 1.6).ell(0.014, 0.014, 0.014, 0.17, 0.765, z * 1.6);   // crest (1.3.7: five)
      // THRONE_PALMS_137 - 1.3.7 (the user, of "זנב פרוש וציצה": "מצוינות"): the tail spread wide - a fan of thirteen feathers, each with its
      // "eye", over a thin half disc (until 1.3.6 a plain half disc with seven knobs)
      const fan = new CylinderGeometry(0.46, 0.46, 0.02, 20, 1, false, 0, Math.PI);
      fan.rotateZ(Math.PI / 2);
      fan.translate(-0.16, 0.18, 0);
      f.add(fan);
      for (let i = 0; i < 13; i++) {
        const a = Math.PI * (i + 0.5) / 13, sy = Math.sin(a), cz = Math.cos(a);
        f.rod(0.012, 0.006, -0.15, 0.2, 0, -0.15, 0.18 + 0.66 * sy, 0.66 * cz, 4);
        f.ell(0.016, 0.075, 0.05, -0.146, 0.18 + 0.58 * sy, 0.58 * cz, 0, a - Math.PI / 2, 0, 6, 4);
        f.ell(0.02, 0.03, 0.03, -0.14, 0.18 + 0.58 * sy, 0.58 * cz, 0, 0, 0, 5, 4);
      }''')
# ---- the palm's parts and the linen's embroidery (before pal_palmGeos)
rep('''  function pal_palmGeos() {''', '''  // 1.3.7 (the user, 11.11.2026 19:00: "הדקלים בבית המדרש ב לא מספיק 'חיים'"; 19:03 of the proposals: "מצוינות"): A LIVELIER DATE PALM - the
  // trunk in rings of leaf bases, leaning a little; a full crown of feathered fronds in three tiers (rising, arching, hanging); clusters
  // of dates under it; the white linen round the trunk in folds, its hem waving, embroidered (pal_linenTex). The crown's parts are built
  // round the crown's foot (their origin), so that the crown can sway. All the forms and measures: model choices.
  var PAL_PALM_H = 4.4, PAL_PALM_LEAN = 0.22;
  function pal_palmParts() {
    const HT = PAL_PALM_H, lean = (y) => PAL_PALM_LEAN * (y / HT) * (y / HT);
    const hs = (n) => { const x = Math.sin(n * 91.7 + 13.1) * 43758.5453; return x - Math.floor(x); };
    const t = pal_fig(), N = 24;
    for (let i = 0; i < N; i++) {
      const y0 = HT * i / N, y1 = HT * (i + 1) / N, r = 0.2 - 0.075 * i / N;
      t.rod(r * 0.84, r * 1.14, lean(y0), y0, 0, lean(y1), y1, 0, 10);   // every ring flares upward: the leaf bases' rim
    }
    t.ell(0.2, 0.16, 0.2, lean(HT), HT + 0.02, 0, 0, 0, 0, 10, 6);        // the crown's heart
    const FP = [], FI = [];
    const frond = (az, elev, L, W, droop) => {   // a feathered blade: the midrib and two edges that go in and out (the leaflets), a little folded
      const S = 12, ca = Math.cos(az), sa = Math.sin(az), base = FP.length / 3;
      for (let i = 0; i <= S; i++) {
        const tt = i / S, u = 0.12 + L * tt * Math.cos(elev), v = L * tt * Math.sin(elev) - droop * L * tt * tt;
        const w = W * Math.pow(Math.sin(Math.PI * (0.07 + 0.9 * tt)), 0.75) * (i % 2 ? 1 : 0.6);
        const cx = u * ca, cz = u * sa;
        FP.push(cx - w * sa, v - 0.3 * w, cz + w * ca, cx, v, cz, cx + w * sa, v - 0.3 * w, cz - w * ca);
        if (i < S) { const a = base + 3 * i; FI.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5); }
      }
    };
    for (let i = 0; i < 7; i++) frond(i * 2 * Math.PI / 7 + 0.3, 0.95 + 0.25 * hs(i), 1.7 + 0.3 * hs(i + 9), 0.2, 0.5);
    for (let i = 0; i < 10; i++) frond(i * 2 * Math.PI / 10 + 0.1, 0.42 + 0.3 * hs(i + 20), 2.25 + 0.3 * hs(i + 30), 0.24, 0.6);
    for (let i = 0; i < 9; i++) frond(i * 2 * Math.PI / 9 + 0.55, -0.05 + 0.28 * hs(i + 40), 2.1 + 0.3 * hs(i + 50), 0.22, 0.48);
    const fg = new BufferGeometry();
    fg.setAttribute("position", new BufferAttribute(new Float32Array(FP), 3));
    fg.setIndex(FI);
    fg.computeVertexNormals();
    const dt = pal_fig();   // four clusters of dates hanging under the crown
    for (let c = 0; c < 4; c++) {
      const a = c * Math.PI / 2 + 0.7, ca = Math.cos(a), sa = Math.sin(a);
      dt.path(0.025, 0.015, [[0.1 * ca, -0.05, 0.1 * sa], [0.42 * ca, -0.12, 0.42 * sa], [0.5 * ca, -0.45, 0.5 * sa]], 5);
      for (let j = 0; j < 16; j++) {
        const r = 0.11 * hs(c * 31 + j), b = hs(c * 17 + j * 3) * 6.283, y = -0.45 - 0.42 * hs(c * 7 + j * 5);
        dt.ell(0.045, 0.06, 0.045, 0.5 * ca + r * Math.cos(b), y, 0.5 * sa + r * Math.sin(b), 0, 0, 0, 6, 4);
      }
    }
    const LP = [], LI = [], LU = [], SEG = 28, RINGS = 9, Y0 = 0.55, Y1 = 3.35;   // the linen: a pleated sleeve
    for (let j = 0; j <= RINGS; j++) {
      const f = j / RINGS, y = Y0 + (Y1 - Y0) * f, R = 0.2 - 0.075 * y / HT + 0.075 + 0.05 * (1 - f) * (1 - f);
      for (let i = 0; i <= SEG; i++) {
        const th = i / SEG * 2 * Math.PI, pl = 1 + 0.11 * Math.sin(7 * th + 1.4 * f) * (1 - 0.5 * f);
        LP.push(lean(y) + R * pl * Math.cos(th), y + (j === 0 ? 0.07 * Math.sin(7 * th) : 0), R * pl * Math.sin(th));
        LU.push(i / SEG * 4, f);
        if (j < RINGS && i < SEG) { const a = j * (SEG + 1) + i, b2 = a + SEG + 1; LI.push(a, b2, a + 1, a + 1, b2, b2 + 1); }
      }
    }
    const lg = new BufferGeometry();
    lg.setAttribute("position", new BufferAttribute(new Float32Array(LP), 3));
    lg.setAttribute("uv", new BufferAttribute(new Float32Array(LU), 2));
    lg.setIndex(LI);
    lg.computeVertexNormals();
    return { trunk: t.geo(), fronds: fg, dates: dt.geo(), linen: lg, top: [lean(HT), HT] };
  }
  // the linen's embroidery ("ומרוקמים בבגדי שש" - Beit HaMidrash): white, a faint weave, two embroidered bands and small lozenges, in gold thread
  function pal_linenTex() {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 256;
    const c = cv.getContext("2d");
    c.fillStyle = "#f6f1e6";
    c.fillRect(0, 0, 256, 256);
    c.globalAlpha = 0.08;
    c.strokeStyle = "#8a8170";
    for (let i = 0; i < 256; i += 3) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, 256); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(256, i); c.stroke(); }
    c.globalAlpha = 1;
    const band = (y, hgt) => {
      c.strokeStyle = "#b8892a";
      c.lineWidth = 3;
      c.beginPath(); c.moveTo(0, y); c.lineTo(256, y); c.moveTo(0, y + hgt); c.lineTo(256, y + hgt); c.stroke();
      c.lineWidth = 2.5;
      c.beginPath();
      for (let x = 0; x <= 256; x += 16) { if (x === 0) c.moveTo(x, y + hgt - 4); else c.lineTo(x, y + ((x / 16) % 2 ? 4 : hgt - 4)); }
      c.stroke();
      c.fillStyle = "#8f6a1c";
      for (let x = 16; x < 256; x += 32) { c.beginPath(); c.arc(x, y + hgt / 2 + 3, 2.4, 0, 7); c.fill(); }
    };
    band(14, 26);
    band(206, 30);
    c.fillStyle = "#b8892a";
    for (let r = 0; r < 4; r++) for (let x = 0; x < 256; x += 32) { const px = x + (r % 2 ? 16 : 0), py = 70 + r * 36; c.beginPath(); c.moveTo(px, py - 5); c.lineTo(px + 4, py); c.lineTo(px, py + 5); c.lineTo(px - 4, py); c.closePath(); c.fill(); }
    const tx = new CanvasTexture(cv);
    tx.wrapS = tx.wrapT = RepeatWrapping;
    tx.colorSpace = SRGBColorSpace;
    tx.anisotropy = 4;
    return tx;
  }
  function pal_palmGeos() {''')
# ---- the palms round the throne
a = s.index('      // two palm trees beside the steps, their trunks wrapped in white linen, an ivory peacock on each facing the throne, its eagles\' wings')
b = s.index('      const backZ = zD + 0.1 - 0.65 - 0.11;', a)
s = s[:a] + '''      // 1.3.7 (the user, 11.11.2026 19:00, 19:03): THE PALMS SURROUND THE THRONE - "ואילני תמרים מקיפין לכסא מכורכין בבגדי שש וטווסין של שן מוכנין
      // כנגד כנפי הנשרים" (Abba Gorion, the library's 5844, line 5); "ואילני תמרים היו מקיפין לכסא, מכוסין בבגדי שש לבן, ועל ראשיהם טווסין של שן
      // מכוונים כנגד גפי נשרים" (Panim Acherim נוסח ב, 274, line 116); "ואילני תמרים מיפות את הכסא ומרוקמים בבגדי שש, והיו טווסין של שן מכוונים
      // כנגד כנפי נשרים" (Beit HaMidrash, 7924, line 8). EIGHT palms, four a side from the ramp's end to the body's back (two beside the
      // steps until 1.3.6), each leaning a little toward the throne, an ivory peacock on its head facing the throne; the crowns sway a
      // little, always (the hook below). Their number, places, height and the swaying: model choices.
      const palmCrowns = [];
      if (Array.isArray(ctx.animated)) ctx.animated.push((t) => {
        if (!palmCrowns.length) return;
        const u = (typeof t === "number" ? t : performance.now()) * 0.001;
        for (const c of palmCrowns) { if (!c.parent.visible) continue; const p = c.userData.phase; c.rotation.z = 0.04 * Math.sin(u * 0.8 + p); c.rotation.x = 0.035 * Math.sin(u * 0.61 + p * 1.7); }
      });
      const palmsAt = (grp, d) => {
        const pp = once("palm2", () => pal_palmParts());
        const linenMat = once("palmLinenMat", () => new MeshStandardMaterial({ map: pal_linenTex(), roughness: 0.9, side: DoubleSide, emissive: 0x57524a, emissiveIntensity: 0.3 }));
        const barkMat = once("palmBarkMat", () => new MeshStandardMaterial({ color: 0x8C6A42, roughness: 0.95, emissive: 0x2a1c0c, emissiveIntensity: 0.5 }));
        const dateMat = once("palmDateMat", () => new MeshStandardMaterial({ color: 0xB8651C, roughness: 0.5, emissive: 0x3c1e06, emissiveIntensity: 0.6 }));
        frondMat.side = DoubleSide;
        d.peacocks = [];
        let n = 0;
        for (const s of [-1, 1]) for (const [dx, pz] of [[8.6, 626.6], [10.4, 622.3], [10.6, 617.0], [8.4, 612.0]]) {
          const px = X + s * dx, ry = s > 0 ? Math.PI : 0, lx = s > 0 ? -pp.top[0] : pp.top[0];   // each leans toward the throne
          put(grp, pp.trunk, barkMat, px, YT, pz, ry, 1, "thronePalm");
          put(grp, pp.linen, linenMat, px, YT, pz, ry, 1, "thronePalmLinen");
          const crown = put(grp, pp.fronds, frondMat, px + lx, YT + pp.top[1], pz, n * 0.8, 1, "thronePalmFronds");
          const dates = new Mesh(pp.dates, dateMat);
          dates.name = "thronePalmDates";
          dates.castShadow = true;
          crown.add(dates);
          crown.userData.phase = n * 1.37;
          palmCrowns.push(crown);
          d.peacocks.push(put(grp, beastGeo("peacock"), ivory, px + lx, YT + pp.top[1] + 0.25, pz, s > 0 ? Math.PI : 0, 1.25, "thronePeacock"));
          n++;
        }
      };
''' + s[b:]
# ---- the notes
rep('מקום הטווס וגודלו — בחירת מודל.\\nאסתר רבה: ״וידות מזה ומזה',
    'מקום הטווס וגודלו — בחירת מודל. אילני התמרים — ״מקיפין לכסא מכורכין בבגדי שש״ — שמונה סביב הכסא, ובראש כל אחד טווס של שן; מספרם, מקומם וגובהם — בחירת מודל.\\nאסתר רבה: ״וידות מזה ומזה')
rep('לפי בית המדרש ב (ילינק; בספרייה בילקוט מדרשים, בלי מספרי ההערות).\\nהאריות ולוחות הכתב:',
    'לפי בית המדרש ב (ילינק; בספרייה בילקוט מדרשים, בלי מספרי ההערות).\\nבמודל: אילני התמרים ״מיפות את הכסא ומרוקמים בבגדי שש״ — שמונה סביבו, כרוכים בבד שש מרוקם, ובראש כל אחד טווס של שן; מספרם, מקומם וגובהם — בחירת מודל.\\nהאריות ולוחות הכתב:')
io.open(P, 'w', encoding='utf-8').write(s)
print('60-palace.js: patched (the palms round the throne, the peacock)')
