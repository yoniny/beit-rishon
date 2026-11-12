# -*- coding: utf-8 -*-
# 2.0.4 / B1 1.3.7 - THE HEIGHT OF THE HOLY OF HOLIES: THREE READINGS (the user, 11.11.2026 17:52 "להוסיף שיטה", 17:53 "אם רש"י מדבר על
# העלייה או על גובה קודש הקודשים עצמו", 18:09 "תוסיף רד"ק. חשוב מאוד, את האבן יקרה תעשה נורמלי, לא כמו האבנים בכיסא שלמה").
# Every text was read in his library (LIB_1111.md): Rashi I Kings 6:20 (3673:262), Bava Batra 98b (124:2324), Tosafot there (1923:1051),
# Metzudat David (3345:458), Radak (3540:369), Lechem Shamayim Yoma 5:1 (1094:219, 221).
#   "rashi" (THE DEFAULT, as built until now): the devir's ceiling at 20, its aliyah above it under the house's ceiling; in the 120
#       reading the aliyot over the devir ten amot lower than the heichal's.
#   "tosafot": the Gemara (R. Chanina: "כי קא חשיב - משפת כרובים ולמעלה") as the Tosafot bring it against Rashi - the devir 30 high as
#       the heichal, its walls gold to the ceiling; no lower ceiling, and in the 120 reading the aliyot level.
#   "radak": 30 high; the lower 20 gold, the upper ten faced with precious stone ("אבן יקרה") - a facing of polished natural slabs.
# Idempotent by the marker "devirHeight" in 50-heichal.js / 70-ui.js.
import io

B1 = '/home/claude/beit-rishon/src/'


def rd(n):
    return io.open(B1 + n, encoding='utf-8').read()


def wr(n, s):
    io.open(B1 + n, 'w', encoding='utf-8', newline='\n').write(s)


def rep(s, old, new, name, n=1):
    k = s.count(old)
    if k != n:
        raise SystemExit('PATCH %s: %d matches' % (name, k))
    return s.replace(old, new)


h = rd('50-heichal.js')
if 'devirHeight' in h:
    print('50-heichal.js: already patched')
else:
    # ---- the stone facing's material, after the coffered gold
    h = rep(h, '''    let houseRoofProxy = null;   // the cutaway toggles this stand-in; the real roof follows it AND the aliyot layer (hidden while the aliyot stand on the cedars)
''', '''    // 1.3.7 (the user, 11.11.2026 18:09: "תוסיף רד"ק. חשוב מאוד, את האבן יקרה תעשה נורמלי, לא כמו האבנים בכיסא שלמה"): THE FACING OF
    // PRECIOUS STONE of the Radak's reading of the devir's height (I Kings 6:20; book 3540, line 369): "כי עשרים אמה בגובה צפה
    // הקירות זהב והעשר אמות העליונות צפה באבן יקרה בלשם שבו ושוהם וספיר ודומיהם מן האבנים הטובות". A wall facing of polished
    // natural slabs laid in courses, five amot long and two and a half high: one light stone with fine veins - no cut gems, no
    // colours, no shine of jewels. One drawing of a fixed seed (the same wall at every load). The slabs' size and the stone's
    // hue - model choices.
    const hei_gemStone = (() => {
      // 1.3.7, later (the user, 18:21, of the first drawing - six hues: "זה צבעוני, אמרתי לך לא לעשות תכשיטים"): ONE quiet stone -
      // light polished slabs with fine veins, three near tones of the same stone, no colours
      const HUES = [
        ["#efe5d0", "#fbf5e6", "#c9bda2"],
        ["#eadfc8", "#f8f1e0", "#c2b59a"],
        ["#f2e9d6", "#fcf7ea", "#ccc1a8"]
      ];
      const COLS = 2, ROWS = 4;   // a slab: five amot by two and a half (the tile is ten amot)
      let seed = 0;
      const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      const cells = (sz, fn) => {
        const cw = sz / COLS, rh = sz / ROWS;
        for (let r = 0; r < ROWS; r++) for (let k = -1; k < COLS; k++) {
          const x = k * cw + (r % 2 ? cw / 2 : 0), y = r * rh;
          fn(x, y, cw, rh, (r * 2 + ((k + COLS) % COLS) + (r % 2)) % HUES.length);
        }
      };
      const draw = (c, sz) => {
        seed = 20261111;
        c.fillStyle = "#b3a68c";
        c.fillRect(0, 0, sz, sz);
        cells(sz, (x, y, w, hh, hi) => {
          const [base, lite, dark] = HUES[hi];
          c.save();
          c.beginPath();
          c.rect(x + 1, y + 1, w - 2, hh - 2);
          c.clip();
          c.fillStyle = base;
          c.fillRect(x, y, w, hh);
          for (let i = 0; i < 12; i++) {   // soft clouds of the stone's lighter and darker tone
            const px = x + rnd() * w, py = y + rnd() * hh, pr = (0.1 + rnd() * 0.3) * w;
            const g2 = c.createRadialGradient(px, py, 0, px, py, pr);
            g2.addColorStop(0, i % 2 ? lite : dark);
            g2.addColorStop(1, "rgba(0,0,0,0)");
            c.globalAlpha = 0.06 + rnd() * 0.08;
            c.fillStyle = g2;
            c.fillRect(px - pr, py - pr, 2 * pr, 2 * pr);
          }
          for (let i = 0; i < 7; i++) {   // fine veins, running aslant through the slab, some of them forked
            const fork = rnd() < 0.4;
            c.globalAlpha = 0.16 + rnd() * 0.2;
            c.strokeStyle = i % 3 === 2 ? "#a3957a" : dark;
            c.lineWidth = 0.5 + rnd() * 1.5;
            c.beginPath();
            let px = x - 6, py = y + rnd() * hh;
            const drift = (rnd() - 0.5) * 0.9;
            c.moveTo(px, py);
            while (px < x + w + 6) {
              const nx = px + 16 + rnd() * 34, ny = py + drift * 22 + (rnd() - 0.5) * 26;
              c.quadraticCurveTo((px + nx) / 2 + (rnd() - 0.5) * 12, (py + ny) / 2 + (rnd() - 0.5) * 18, nx, ny);
              if (fork && rnd() < 0.25) { c.lineTo(nx + 10 + rnd() * 24, ny - 14 - rnd() * 30); c.moveTo(nx, ny); }
              px = nx; py = ny;
            }
            c.stroke();
          }
          c.globalAlpha = 1;
          for (let i = 0; i < 300; i++) {   // fine grains
            c.fillStyle = i % 2 ? lite : dark;
            c.globalAlpha = 0.06 + rnd() * 0.1;
            c.fillRect(x + rnd() * w, y + rnd() * hh, 1 + rnd() * 1.6, 1 + rnd() * 1.6);
          }
          c.globalAlpha = 1;
          c.restore();
        });
      };
      const bump = (c, sz) => {
        c.fillStyle = "#707070";
        c.fillRect(0, 0, sz, sz);
        cells(sz, (x, y, w, hh) => { c.fillStyle = "#ffffff"; c.fillRect(x + 1, y + 1, w - 2, hh - 2); });
      };
      const gm = std(worldTex(makeTex(1024, draw, { bump, bumpSize: 512 }), 10), { roughness: 0.5, metalness: 0, envMapIntensity: 0.3, bumpScale: 0.25, emissive: 0xffffff, emissiveIntensity: 0.34 });
      gm.emissiveMap = gm.map;   // the devir has little light of its own: the stone carries its own tone (as the house's other inside materials do)
      return gm;
    })();
    let houseRoofProxy = null;   // the cutaway toggles this stand-in; the real roof follows it AND the aliyot layer (hidden while the aliyot stand on the cedars)
''', 'stone material')
    # ---- the devir's low ceiling and its room: kept in a list; the upper walls of the two 30-amah readings
    h = rep(h, '''      cut.push(dc, dg, dt);
      const aY = F + CO.DEVIR_H + 1.05, aH = CEIL - 0.05 - aY;               // the aliyah's gold lining: on its floor (dt), under the gold ceiling
      for (const s of [-1, 1]) {
        const sk = H.box(g, DE - DW, aH, 0.1, M.gold, (DE + DW) / 2, aY, s * 9.95);
        if (s > 0) cut.push(sk);
        aliyotHide.push(sk);   // 1.2.4: in the aliyot reading the room over the devir is the first aliyah's west part, lined by the layer itself
      }
      aliyotHide.push(H.box(g, 0.1, aH, 19.8, M.gold, DW + 0.05, aY, 0));
    }
''', '''      cut.push(dc, dg, dt);
      const aY = F + CO.DEVIR_H + 1.05, aH = CEIL - 0.05 - aY;               // the aliyah's gold lining: on its floor (dt), under the gold ceiling
      const lowList = (ctx.devirLowCut = ctx.devirLowCut || []);             // 1.3.7: what belongs to the ceiling at 20 only (Rashi's reading)
      lowList.push(dc, dg, dt);
      for (const s of [-1, 1]) {
        const sk = H.box(g, DE - DW, aH, 0.1, M.gold, (DE + DW) / 2, aY, s * 9.95);
        if (s > 0) cut.push(sk);
        aliyotHide.push(sk);   // 1.2.4: in the aliyot reading the room over the devir is the first aliyah's west part, lined by the layer itself
        lowList.push(sk);
      }
      { const skW = H.box(g, 0.1, aH, 19.8, M.gold, DW + 0.05, aY, 0); aliyotHide.push(skW); lowList.push(skW); }
      // 1.3.7 (the user, 11.11.2026 17:52 "להוסיף שיטה"; 18:09 "תוסיף רד"ק"): THE HEIGHT OF THE HOLY OF HOLIES - three readings,
      // ctx.shared.devirHeight.set("rashi" | "tosafot" | "radak") (the row "גובה קודש הקדשים", 70-ui.js):
      //   "rashi" (the default; all the above): I Kings 6:20, Rashi (book 3673, line 262) "ועשרים אמה קומתו. כלומר, עלית של בית
      //     קדשי הקדשים, נמוכה משל היכל"; Metzudat David (3345, line 458) "עליית בית קודש הקדשים היתה נמוכה משל היכל י׳ אמות".
      //   "tosafot": Bava Batra 98b (124, line 2324) "אמר להו: כי קא חשיב - משפת כרובים ולמעלה" - the devir thirty high as the
      //     house, the twenty counted from the cherubim's top; the Tosafot there (1923, line 1051): "בפירוש מקרא פרש"י דתקרה דעליית
      //     היכל היתה גבוהה משל קדשי הקדשים עשר אמות ולא עיין כאן". The ceiling at 20 and its room go (ctx.devirLowCut, hidden by
      //     70-ui.js's applyHidden); the house's own ceiling over the devir (c1w, goldW) is the devir's; the walls' upper ten amot gold.
      //   "radak" (3540, line 369): thirty high, "עשרים אמה בגובה צפה הקירות זהב והעשר אמות העליונות צפה באבן יקרה" - the same,
      //     the upper ten amot of the four walls faced with stone (hei_gemStone, above).
      // The upper walls stand flush with the devir's own skins (55-interior.js: 0.2 thick). In the 120 reading the aliyot over the
      // devir are ten lower in "rashi" only (sec. 9).
      const hiGold = new Group(), hiStone = new Group();
      hiGold.name = "devirHighGold"; hiStone.name = "devirHighStone";
      hiGold.visible = hiStone.visible = false;
      g.add(hiGold); g.add(hiStone);
      ctx.layers.devirHighGold = hiGold; ctx.layers.devirHighStone = hiStone;
      {
        const y0 = F + CO.DEVIR_H, hh = CEIL - 0.05 - y0;
        for (const [grp, mat] of [[hiGold, M.gold], [hiStone, hei_gemStone]]) {
          for (const s of [-1, 1]) { const w = H.box(grp, DE - DW, hh, 0.2, mat, (DE + DW) / 2, y0, s * 9.9); if (s > 0) cut.push(w); }
          H.box(grp, 0.2, hh, 19.6, mat, DW + 0.1, y0, 0);
        }
        H.box(hiStone, 0.06, hh, 19.6, hei_gemStone, DE - 0.03, y0, 0);   // the east wall: on the amah traksin's devir face
        ctx.labels.push(
          { text: "קודש הקדשים — שלושים אמה, כהיכל (בבא בתרא צח:)", x: (DE + DW) / 2, y: CEIL - 2.2, z: 0, size: 1.6, layer: "devirHighGold" },
          { text: "עשר האמות העליונות — אבן יקרה (רד״ק ו, כ)", x: (DE + DW) / 2, y: CEIL - 2.2, z: 0, size: 1.6, layer: "devirHighStone" });
      }
      ctx.shared.devirHeight = {
        mode: "rashi", keys: ["rashi", "tosafot", "radak"], apply: null, aliyot: null,
        set(m) {
          this.mode = this.keys.indexOf(m) >= 0 ? m : "rashi";
          hiGold.visible = this.mode === "tosafot";
          hiStone.visible = this.mode === "radak";
          if (typeof this.aliyot === "function") this.aliyot();   // the aliyot over the devir: ten lower / level (sec. 9)
          if (typeof this.apply === "function") this.apply();     // 70-ui.js: the ceiling at 20 hidden or shown
          return this.mode;
        }
      };
    }
''', 'devir ceiling')
    # ---- the aliyot layer: the block over the devir in two builds
    h = rep(h, '''        const PARTS = [
          { x0: ax0, x1: xS, SB: [DEV_TOP, 79], SC: [75, 118], AT: AT - 10, west: true },
          { x0: xS, x1: ax1, SB: [A0, 89], SC: [85, 128], AT, east: true }
        ];
        H.box(gA, DE - DW, 1, 20, M.cedar, (DE + DW) / 2, DEV_TOP - 1, 0).name = "devir-sdeirot";   // the devir's שדרות: the first aliyah's floor over it
        layerLabel(gA, "תקרת הדביר — גבים, בית דילפא ושדרות; רצפת העלייה שמעליו (מצודת דוד ו, כ)", DE + 0.8, DEV_TOP - 2, 0, 1.2);
''', '''        // 1.3.7 (ctx.shared.devirHeight): the block over the devir is built TWICE - gWL, ten amot lower (Rashi; as until now), and
        // gWH, level with the heichal's (the Gemara as the Tosafot bring it, and the Radak: the devir thirty high) - and shown by
        // the reading. The labels of the low build carry both layers.
        const gWL = new Group(), gWH = new Group();
        gWL.name = "aliyotDevirLow"; gWH.name = "aliyotDevirLevel";
        gA.add(gWL); gA.add(gWH);
        ctx.layers.aliyotDevirLow = gWL; ctx.layers.aliyotDevirLevel = gWH;
        const PARTS = [
          { x0: ax0, x1: xS, SB: [DEV_TOP, 79], SC: [75, 118], AT: AT - 10, west: true, grp: gWL },
          { x0: ax0, x1: xS, SB: [A0, 89], SC: [85, 128], AT, west: true, grp: gWH },
          { x0: xS, x1: ax1, SB: [A0, 89], SC: [85, 128], AT, east: true }
        ];
        H.box(gWL, DE - DW, 1, 20, M.cedar, (DE + DW) / 2, DEV_TOP - 1, 0).name = "devir-sdeirot";   // the devir's שדרות: the first aliyah's floor over it
        ctx.labels.push({ text: "תקרת הדביר — גבים, בית דילפא ושדרות; רצפת העלייה שמעליו (מצודת דוד ו, כ)", x: DE + 0.8, y: DEV_TOP - 2, z: 0, size: 1.2, layers: ["aliyot", "aliyotDevirLow"] });
''', 'parts')
    # inside the loop: every piece of a part goes to the part's own group
    a = h.index('        for (const P of PARTS) {\n          const cx = (P.x0 + P.x1) / 2, len = P.x1 - P.x0;')
    b = h.index('        // the step itself (1.2.4): the east part\'s end wall above the lower roof', a)
    loop = h[a:b]
    n_ga = loop.count('gA')
    loop2 = loop.replace('          const cx = (P.x0 + P.x1) / 2, len = P.x1 - P.x0;',
                         '          const cx = (P.x0 + P.x1) / 2, len = P.x1 - P.x0, G = P.grp || gA;   // 1.3.7: the part\'s own group', 1)
    loop2 = loop2.replace('hei_holeWall(H, gA,', 'hei_holeWall(H, G,').replace('H.box(gA,', 'H.box(G,')
    assert 'layerLabel(gA,' in loop2 and loop2.count('gA') < n_ga, (n_ga, loop2.count('gA'))
    h = h[:a] + loop2 + h[b:]
    h = rep(h, '''        H.box(gA, WT4, AT - (AT - 10), 2 * (10 + WT4), M.stone, xS + WT4 / 2, AT - 10, 0).name = "aliyot-step-wall";
        H.box(gA, 1, 1.5, 2 * (10 + WT4) - 2, M.stoneLight, xS + 0.5, AT, 0);
        H.box(gA, 1, 89 - 75, inW, M.gold, xS, 75, 0).name = "aliyot-step-1";
        H.box(gA, 1, 128 - 118, inW, M.gold, xS, 118, 0).name = "aliyot-step-2";
        layerLabel(gA, "עליית קודש הקדשים נמוכה בעשר אמות (מצודת דוד ו, כ ע״פ רש״י)", xS - 12, AT - 10 + 4, -16, 2.2);
        gA.updateMatrixWorld(true);
''', '''        H.box(gWL, WT4, AT - (AT - 10), 2 * (10 + WT4), M.stone, xS + WT4 / 2, AT - 10, 0).name = "aliyot-step-wall";
        H.box(gWL, 1, 1.5, 2 * (10 + WT4) - 2, M.stoneLight, xS + 0.5, AT, 0);
        H.box(gWL, 1, 89 - 75, inW, M.gold, xS, 75, 0).name = "aliyot-step-1";
        H.box(gWL, 1, 128 - 118, inW, M.gold, xS, 118, 0).name = "aliyot-step-2";
        ctx.labels.push({ text: "עליית קודש הקדשים נמוכה בעשר אמות (מצודת דוד ו, כ ע״פ רש״י)", x: xS - 12, y: AT - 10 + 4, z: -16, size: 2.2, layers: ["aliyot", "aliyotDevirLow"] },
          { text: "עליות קודש הקדשים בגובה עליות ההיכל (בבא בתרא צח:, תוספות)", x: xS - 12, y: AT + 4, z: -16, size: 2.2, layers: ["aliyot", "aliyotDevirLevel"] });
        const syncW = () => { const lowOn = !ctx.shared.devirHeight || ctx.shared.devirHeight.mode === "rashi"; gWL.visible = lowOn; gWH.visible = !lowOn; };
        syncW();
        if (ctx.shared.devirHeight) ctx.shared.devirHeight.aliyot = syncW;
        gA.updateMatrixWorld(true);
''', 'step')
    wr('50-heichal.js', h)
    print('50-heichal.js: patched')

u = rd('70-ui.js')
if 'devirHeight' in u:
    print('70-ui.js: already patched')
else:
    # ---- applyHidden: the ceiling at 20 and its room go in the two 30-amah readings; the house's ceiling over the devir stays under the level aliyot
    u = rep(u, '''        if (ctx.layers && ctx.layers.aliyot && ctx.layers.aliyot.visible) for (const m of cutList(ctx.aliyotHide)) hide.add(m);
        for (const list of [ctx.cutaway, ctx.sectionCut, ctx.yatziaCut, ctx.ulamCut, ctx.forestBoardsCut, ctx.aliyotHide]) {
''', '''        // 1.3.7 (ctx.shared.devirHeight, 50-heichal.js): in the two readings of a devir thirty high its ceiling at 20 and the room over
        // it go (ctx.devirLowCut), and under the aliyot - level there - the house's own ceiling over the devir stays
        const dvHigh = !!(ctx.shared && ctx.shared.devirHeight && ctx.shared.devirHeight.mode !== "rashi");
        if (ctx.layers && ctx.layers.aliyot && ctx.layers.aliyot.visible && !dvHigh) for (const m of cutList(ctx.aliyotHide)) hide.add(m);
        if (dvHigh) for (const m of cutList(ctx.devirLowCut)) hide.add(m);
        for (const list of [ctx.cutaway, ctx.sectionCut, ctx.yatziaCut, ctx.ulamCut, ctx.forestBoardsCut, ctx.aliyotHide, ctx.devirLowCut]) {
''', 'applyHidden')
    u = rep(u, '''      if (ctx.shared && ctx.shared.ulamCeiling) ctx.shared.ulamCeiling.apply = applyHidden;   // 1.3.5
''', '''      if (ctx.shared && ctx.shared.ulamCeiling) ctx.shared.ulamCeiling.apply = applyHidden;   // 1.3.5
      if (ctx.shared && ctx.shared.devirHeight) ctx.shared.devirHeight.apply = applyHidden;   // 1.3.7
''', 'apply hook')
    # ---- the row
    ROW = '''        // 1.3.7 (the user, 11.11.2026 17:52 "להוסיף שיטה", 18:09 "תוסיף רד"ק"): the height of the Holy of Holies - three readings,
        // ctx.shared.devirHeight (50-heichal.js). Every quote from the user's library, read there on 11.11.2026: Rashi I Kings 6:20
        // (book 3673, line 262), Metzudat David (3345, line 458), Bava Batra 98b (124, line 2324), the Tosafot there (1923, line
        // 1051), the Radak (3540, line 369), Lechem Shamayim on Yoma 5:1 (1094, lines 219, 221).
        if (ctx.shared.devirHeight) {
          const DH_V = "הפסוקים: 'והבית אשר בנה המלך שלמה לה׳ ששים אמה ארכו ועשרים רחבו ושלשים אמה קומתו' (מלכים א ו, ב); 'ולפני הדביר עשרים אמה ארך ועשרים אמה רחב ועשרים אמה קומתו' (ו, כ).\\n";
          opRow({
            id: "devirHeight", short: "גובה קודש הקדשים", cardFly: true, chips: { rashi: "רש״י: עשרים", tosafot: "הגמרא והתוספות: שלושים", radak: "רד״ק: שלושים, עשר מהן אבן יקרה" },
            cap: "גובה קודש הקדשים",
            refs: [["מלכים א ו, ב", V(10, 6, 2)], ["ו, כ", V(10, 6, 20)], ["רש״י ו, כ", { book: 3673, index: 262 }], ["מצודת דוד ו, כ", { book: 3345, index: 458 }], ["בבא בתרא צח:", { book: 124, index: 2324 }], ["תוספות בבא בתרא צח:", { book: 1923, index: 1051 }], ["רד״ק ו, כ", { book: 3540, index: 369 }], ["לחם שמים יומא ה, א", { book: 1094, index: 219 }]],
            options: [
              ["rashi", "רש״י — עשרים אמה, ועלייתו נמוכה משל ההיכל", DH_V + "רש״י (ו, כ): 'ועשרים אמה קומתו. כלומר, עלית של בית קדשי הקדשים, נמוכה משל היכל'. מצודת דוד: 'כי ההיכל לבד היתה שלשים אמה, אבל עליית בית קודש הקדשים היתה נמוכה משל היכל י׳ אמות'.\\nהיעב״ץ (לחם שמים, יומא ה, א) מקיים את דברי רש״י: 'הרי בבירור שדעתו ז״ל שזהו תכלית גובה העלייה. וכן להיכל תכלית גבהו עם עלייתו שלשים אמה. ואין עוד בגובה ההיכל והדביר בבנין בית ראשון'.\\nבמודל (**ברירת המחדל**): תקרת קודש הקדשים בגובה עשרים אמה, ומעליה עלייתו — חדר מצופה זהב ('והעליות חפה זהב', דברי הימים ב ג, ט) — עד תקרת הבית. בקריאת 'מאה ועשרים' שבשורה 'גובה הבית', עליות קודש הקדשים נמוכות בעשר אמות מעליות ההיכל."],
              ["tosafot", "הגמרא והתוספות — שלושים אמה, כהיכל", DH_V + "הגמרא (בבא בתרא צח:): 'רבי חנינא נפק לקרייתא, רמו ליה קראי אהדדי... אמר להו: כי קא חשיב – משפת כרובים ולמעלה'. התוספות שם: 'בפירוש מקרא פרש״י דתקרה דעליית היכל היתה גבוהה משל קדשי הקדשים עשר אמות ולא עיין כאן'. וכן הביא מצודת דוד (ו, כ): 'ורבותינו ז״ל אמרו (בבבא בתרא צח ב): שחושב כאן משפת כרובים ולמעלה, שהיו קומתן י׳ אמות'.\\nבמודל: קודש הקדשים שלושים אמה, כהיכל; תקרתו בגובה תקרת ההיכל, ואין תקרה בגובה עשרים. כתליו מצופים זהב עד התקרה ('ואת כל הבית צפה זהב עד תם כל הבית', ו, כב). בקריאת 'מאה ועשרים' עליות קודש הקדשים שוות לעליות ההיכל. גם עשר האמות העליונות מצוירות כעשרים שתחתיהן — אותם כרובים, תמרות ופטורי ציצים, עד התקרה."],
              ["radak", "רד״ק — שלושים אמה; עשר העליונות אבן יקרה", DH_V + "רד״ק (ו, כ): 'ואם נאמר שהדביר היה שפל מן ההיכל הלא כשאמר מדת הבית ששים ארכו הדביר בכלל וגם כן כשאמר ושלשים אמה קומתו הדביר בכלל ויש מפרשים מה שאמר ועשרים אמה קומתו מה שהיה מצופה זהב... כי עשרים אמה בגובה צפה הקירות זהב והעשר אמות העליונות צפה באבן יקרה בלשם שבו ושוהם וספיר ודומיהם מן האבנים הטובות וזהו שאמר בדברי הימים ויצף את הבית אבן יקרה וזה לתפארת... וזהו הפירוש הנכון'.\\nבמודל: קודש הקדשים שלושים אמה; עשרים האמות התחתונות של כתליו מצופות זהב, ועשר העליונות מחופות אבן יקרה — לוחות גדולים ומלוטשים של אבנים טובות, כחיפוי של קיר (לא אבנים משובצות). גוני האבנים, גודל הלוחות וסידורם — בחירת מודל. בקריאת 'מאה ועשרים' עליות קודש הקדשים שוות לעליות ההיכל."]
            ],
            current: ctx.shared.devirHeight.mode,
            onPick: (k) => { ctx.shared.devirHeight.set(k); },
            fly: () => fly([-46.3, 19.5, 6], [-60, 30.5, -4])   // one eye for the three readings, its target under the ceiling at 20
          });
        }
'''
    u = rep(u, '''        // 8. the House of the Forest of Lebanon (I Kings 7:2-6) - ctx.shared.forestHouse (60-palace.js)
''', ROW + '''        // 8. the House of the Forest of Lebanon (I Kings 7:2-6) - ctx.shared.forestHouse (60-palace.js)
''', 'row')
    # ---- the cards that speak of the devir's height
    u = rep(u, '''"מעל הדביר חדר ריק מצופה זהב: 'ועשרים אמה קומתו' (מלכים א ו, כ) — רש״י: 'עלית קה״ק נמוכה משל היכל' — תקרת הדביר בגובה עשרים, ומעליה עד תקרת ההיכל עלייה; 'והעליות חפה זהב' (דברי הימים ב ג, ט).\\nבגמרא (בבא בתרא צח:–צט.) נמדדות העשרים מכנפי הכרובים ולמעלה. ''',
            '''"מעל הדביר חדר ריק מצופה זהב: 'ועשרים אמה קומתו' (מלכים א ו, כ) — רש״י: 'ועשרים אמה קומתו. כלומר, עלית של בית קדשי הקדשים, נמוכה משל היכל' — תקרת הדביר בגובה עשרים, ומעליה עד תקרת ההיכל עלייה; 'והעליות חפה זהב' (דברי הימים ב ג, ט).\\nבקצרה — גובה קודש הקדשים (בטבלת השיטות, בשורה 'גובה קודש הקדשים'): לרש״י — עשרים אמה, ועלייתו מעליו (**ברירת המחדל**); לגמרא (בבא בתרא צח:: 'כי קא חשיב – משפת כרובים ולמעלה') ולתוספות — שלושים אמה, כהיכל, ואין שם עלייה נמוכה; לרד״ק — שלושים, ועשר האמות העליונות מחופות אבן יקרה. ''', 'aliyah place')
    u = rep(u, '''refs: [["מלכים א ו, כ", V(10, 6, 20)], ["רש״י שם", V(10, 6, 20)], ["דברי הימים ב ג, ט", V(39, 3, 9)], ["בבא בתרא צט.", P(124, "צט.")], ["מדות ד, ה", MI(4, 5)]] },''',
            '''refs: [["מלכים א ו, כ", V(10, 6, 20)], ["רש״י ו, כ", { book: 3673, index: 262 }], ["דברי הימים ב ג, ט", V(39, 3, 9)], ["בבא בתרא צח:", { book: 124, index: 2324 }], ["תוספות בבא בתרא צח:", { book: 1923, index: 1051 }], ["רד״ק ו, כ", { book: 3540, index: 369 }], ["מדות ד, ה", MI(4, 5)]] },''', 'aliyah refs')
    u = rep(u, '''**קודש הקדשים מכוסה בענן**; 'הסר ענן' שעליו מבקש אישור.''',
            '''**קודש הקדשים מכוסה בענן**; 'הסר ענן' שעליו מבקש אישור.\\nבקצרה — גובהו: עשרים אמה, כרש״י (**ברירת המחדל**); לגמרא (בבא בתרא צח:) ולתוספות — שלושים, והעשרים נמנות משפת הכרובים ולמעלה; לרד״ק — שלושים, ועשר העליונות אבן יקרה (בטבלת השיטות, בשורה 'גובה קודש הקדשים').''', 'kk card')
    u = rep(u, '''קודש הקדשים הכול נמוך בעשר אמות — 'עליית בית קודש הקדשים היתה נמוכה משל היכל י' אמות' (מצודת דוד ו, כ ע״פ רש״י): ''',
            '''קודש הקדשים הכול נמוך בעשר אמות — 'עליית בית קודש הקדשים היתה נמוכה משל היכל י' אמות' (מצודת דוד ו, כ ע״פ רש״י; בשתי הקריאות האחרות שבשורה 'גובה קודש הקדשים' העליות שוות): ''', 'aliyot card')
    u = rep(u, '''        devirDoor: ["devirDoor", "potot"], heichalDoor: ["potot"], cherubim: ["cherubPose"],   // 1.3.3: potot''',
            '''        devirDoor: ["devirDoor", "potot"], heichalDoor: ["potot"], cherubim: ["cherubPose"],   // 1.3.3: potot
        kodeshHakodashim: ["devirHeight"],   // 1.3.7: the devir's height''', 'ops_v')
    u = rep(u, '''        "שתי הסנהדראות הקטנות": ["lesserPlace", "sanhedrinRows"],   // 1.3.7''',
            '''        "שתי הסנהדראות הקטנות": ["lesserPlace", "sanhedrinRows"],   // 1.3.7
        "עליית קודש הקדשים — מעל הדביר": ["devirHeight"], "קודש הקדשים — הדביר": ["devirHeight"],   // 1.3.7''', 'ops_p')
    u = rep(u, '''"kodeshLayout", "kodeshOpinion", "devirDoor", "cherubPose", "arkLayout",''', '''"kodeshLayout", "kodeshOpinion", "devirDoor", "devirHeight", "cherubPose", "arkLayout",''', 'want')
    wr('70-ui.js', u)
    print('70-ui.js: patched')
