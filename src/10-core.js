  // Levels (y, in amot above the mount platform). Model choice, see DEV_NOTES.md: the inner court is 12 steps (6 amot)
  // above the great court (as Middot 2:3 for the ascent from the Hel), the house floor 12 steps (6 amot) above the inner court
  // (Middot 3:6 for the ulam steps). Kings I gives no levels.
  var LV = { HAR: 0, AZ: 6, HEI: 12 };
  // Coordinates (x east+, z south+). Inner court 187 x 135 per Middot 5:1 (user's decision); great court 500 x 500 per Middot 2:1,
  // the court placed as in Middot 2:1 (most open space on the south, then east, then north, least on the west).
  var CO = {
    azE: 93.5, azW: -93.5, azN: -67.5, azS: 67.5, AZ_L: 187, AZ_W: 135,
    harW: -147, harE: 353, harN: -167.5, harS: 332.5, HAR: 500,
    // altar: bronze, 20 x 20 x 10 (II Chr 4:1); west face 21 amot east of the ulam front (after Middot 5:1), centred on the house axis (model choice)
    xAltarW: 39.5, xAltarE: 59.5, altarZ: 0, ALTAR: 20, ALTAR_H: 10,
    // the house, interior measures (I Kings 6:2-3, 6:17, 6:20). Walls (1.0.1-K, K.2): the long house walls and the west wall 7 / 6 / 5 at the
    // three stories of the chambers and 4 above their roof (Rashi 6:6 as the book - the user's reference, pp. ג, ו - draws it), the east wall
    // 6 (Middot 4:7), the ulam 6 (Rashi on Sanhedrin 100a), the chamber wall 5 (Middot 4:7)
    xUlamE: 18.5,          // outer face of the ulam front wall (ulam wall 6: Rashi on Sanhedrin 100a "וכותל האולם שש")
    xUlamIn: 12.5,         // inner face of the ulam front wall
    xHouseE: 2.5,          // east face of the house wall (ulam interior 10 deep)
    xKodeshE: -3.5,        // inner east face of the kodesh (house wall 6)
    xKodeshW: -43.5,       // kodesh 40 long
    xDevirE: -44.5,        // amah traksin 1 (Yoma 51b), taken from the devir side (user's decision)
    xDevirW: -63.5,        // devir interior 19 (20 incl. the traksin)
    xHouseW: -70.5,        // outer face of the west wall at the lowest story: -63.5 - 7 (1.0.1-K; was -69.5 with the wall 6)
    xHeiW: -80.5,          // outer face of the west chamber wall: house wall 7 + chamber 5 + chamber wall 5 (I Kings 6:6, Middot 4:7; was -79.5)
    HOUSE_W: 20, HOUSE_H: 30, DEVIR_H: 20, ULAM_W: 20, ULAM_D: 10,
    HOUSE_WALL: [7, 6, 5, 4], // 1.0.1-K: the house wall at the three stories of the chambers and above their roof - it steps in 1 amah at the top
                              // of each story (מגרעות, I Kings 6:6; Rashi "וכשעולה כתל ההיכל חמש אמות, גורע את עביו, וכנס בו אמה"; Metzudat David: a
                              // third ledge for the roof beams), 7 / 6 / 5 / 4 as the book draws Rashi's calculation; 1.0.1 had [6, 5, 4] (Middot 4:7 "כתל
                              // ההיכל שש", a Second-Temple measure). The last entry is the wall above the chambers' roof (70-ui.js reads it).
    YATZIA_W: [5, 6, 7], YATZIA_H: 5, TA_WALL: 5, ULAM_WALL: 6,
    YATZIA_BEAM: 1,        // 1.0.1-K: the cedar beams of the chambers' ceilings and roof, 1 thick (model choice after the book; Rashi 6:10 "הרי גבהן חמש עשרה
                           // אמות, לבד עבי התקרה"): floors 12 / 18 / 24, ledges 17 / 23 / 29, roof 29..30
    ULAM_WING: 15,         // the ulam front is 15 wider than the house body on each side (Middot 4:7 "האולם עודף עליו חמש עשרה אמה מן הצפון וחמש עשרה
                           // אמה מן הדרום"; בית החליפות, Rashi on Yoma 36a) -> ulam block z +-42 (1.0.1-K: the house body is 54 wide; was +-41)
    zHouseS: 27, zHouseN: -27, // outer faces of the chamber walls: 10 + 7 + 5 + 5 (1.0.1-K; was 26)
    // the sea (I Kings 7:39): two opinions - Rashi on I Kings: north-east (z -40); Radak, Metzudot, Ralbag, Rashi on II Chr 4:10: south-east (z +40)
    seaX: 80, seaZ: 54, seaZRashi: -54, SEA_D: 10, SEA_H: 5,   // 1.0.1-L (FIXES L.7, the user: "כרש"י ובספר"): the Sea in the inner court's CORNER (מקצוע) as the book p20 draws it - its axis 11 amot from the inner faces of the east wall (x 91) and of the north / south wall (z -+65): Rashi on I Kings 7:39 "מקצוע מזרחית צפונית" -> x 80, z -54 (the default); the second reading in the south-east (Metzudat David 7:39 "משוך כלפי מקצוע מזרחית דרומית"; Radak, Ralbag; Rashi on II Chr 4:10 "לדרומה של עזרה") -> x 80, z 54 (the corner is free: FIXES L.21 put לשכת הגזית on the north wall, west of the Sea). 45-vessels.js vsl_layout computes both from the walls and keeps 1 amah from ctx.shared.lishkatHaGazit; these are this build's values (the UI's fallback; the comment line above still says +-40). Was x 34, z +-40 (1.0.1-K)
    // Moses' laver in the middle of the block of the 10 bases with their lavers, 5 to its right and 5 to its left (I Kings 7:39; Rashi on II Chr 4:6, Radak; the book p. לח)
    kiyorX: 30, mechX: 30, mechZ: [33, 45]   // 1.0.1-L (FIXES L.67 / L.74, the user: "המכונות היו כולן במקום אחד... בין כותל ההיכל הימני לכותל העזרה הימני", "הכיור בין שתי השורות"): ALL TEN bases in one block of two rows of five, as the book draws them (the picture p. לח, the plan p. ב-ג): south of the axis, directly east of the ulam's south wing, between it and the altar's ramp - the rows at z = mechZ, the five columns 4.5 apart round mechX (x 21, 25.5, 30, 34.5, 39), Moses' laver at kiyorX between the rows (z 39); 45-vessels.js vsl_layout. Was x 27, z +-8..28, one row before the ulam (1.0.1-K)
  };
  // ===== textures (1.0.1-K, K.9a "load speed"): core_t0 = the moment the bundle's own code starts (three.js evaluated before it) and
  // core_texMs = the time to draw TEX - both read by the "[load]" table of 90-entry.js. The bump canvases of the ashlar textures are drawn at
  // HALF the size of their colour maps (makeTex option bumpSize; ashlarBump scales its pixel constants with the canvas, so the joints
  // and pits stay where the colour map has them): a quarter of the pixels to draw and to upload, no visible change (the bump is a soft
  // relief of joints and pits). Everything else is drawn as before.
  var core_t0 = performance.now();
  function hash(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function hex2rgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [n >> 16, n >> 8 & 255, n & 255];
  }
  function mix(c1, c2, t) {
    return c1.map((v, i) => v + (c2[i] - v) * t);
  }
  function css(c) {
    return `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  }
  // makeTex(size, draw, { bump, bumpSize }): draw(ctx2d, size) paints the colour map; bump(ctx2d, bumpSize) the bump map. bumpSize defaults
  // to size (unchanged for every caller that draws its bump at a fixed size, e.g. 55-interior's carved tiles); a smaller bumpSize is
  // only for bump painters that draw in terms of the size they receive (ashlarBump below).
  function makeTex(size, draw, { bump = null, bumpSize = size } = {}) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = size;
    draw(cv.getContext("2d"), size);
    const t = new CanvasTexture(cv);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    let b = null;
    if (bump) {
      const bc = document.createElement("canvas");
      bc.width = bc.height = bumpSize;
      bump(bc.getContext("2d"), bumpSize);
      b = new CanvasTexture(bc);
      b.wrapS = b.wrapT = RepeatWrapping;
      b.anisotropy = 4;
    }
    return { map: t, bumpMap: b };
  }
  function ashlarDraw(base, joint, rows, drafted) {
    const cb = hex2rgb(base), cj = hex2rgb(joint);
    return (ctx2, s) => {
      ctx2.fillStyle = css(cj);
      ctx2.fillRect(0, 0, s, s);
      const rh = s / rows;
      for (let r = 0; r < rows; r++) {
        const cols = 2 + r % 2;
        const cw = s / cols, off = r % 2 ? cw / 2 : 0;
        for (let i = -1; i <= cols; i++) {
          const x = i * cw + off, y = r * rh;
          const tone = (hash(r * 37.7 + i * 11.3) - 0.5) * 0.18;
          const blockC = mix(cb, [255, 250, 235], tone > 0 ? tone : 0);
          const blockD = mix(cb, [60, 48, 30], tone < 0 ? -tone : 0);
          const c = tone > 0 ? blockC : blockD;
          const j = 2;
          ctx2.fillStyle = css(mix(c, [70, 58, 40], 0.28));
          ctx2.fillRect(x + j, y + j, cw - 2 * j, rh - 2 * j);
          const m = drafted ? Math.max(3, s / 110) : j + 1;
          const g = ctx2.createLinearGradient(x, y + m, x, y + rh - m);
          g.addColorStop(0, css(mix(c, [255, 252, 240], 0.13)));
          g.addColorStop(1, css(mix(c, [90, 75, 50], 0.13)));
          ctx2.fillStyle = g;
          ctx2.fillRect(x + m, y + m, cw - 2 * m, rh - 2 * m);
          for (let k = 0; k < 26; k++) {
            const px2 = x + m + hash(r * 51 + i * 13 + k) * (cw - 2 * m);
            const py2 = y + m + hash(r * 29 + i * 7 + k * 3) * (rh - 2 * m);
            const a = 0.04 + hash(k * 3.3 + i + r) * 0.09;
            ctx2.fillStyle = hash(k + r * i) > 0.5 ? `rgba(110,92,60,${a})` : `rgba(250,246,230,${a})`;
            ctx2.beginPath();
            ctx2.arc(px2, py2, 0.6 + hash(k * 7 + r) * 2.2, 0, 7);
            ctx2.fill();
          }
        }
      }
    };
  }
  // mapSize (1.0.1-K) = the size of the colour map this bump belongs to: the joint (2 px), the drafted margin and the pits are drawn at
  // the colour map's scale (q = s / mapSize), so a half-size bump keeps them where the map has them; without mapSize q = 1 (as before)
  function ashlarBump(rows, drafted, mapSize) {
    return (ctx2, s) => {
      const q = mapSize ? s / mapSize : 1;
      ctx2.fillStyle = "#404040";
      ctx2.fillRect(0, 0, s, s);
      const rh = s / rows;
      for (let r = 0; r < rows; r++) {
        const cols = 2 + r % 2;
        const cw = s / cols, off = r % 2 ? cw / 2 : 0;
        for (let i = -1; i <= cols; i++) {
          const x = i * cw + off, y = r * rh;
          const j = 2 * q;
          ctx2.fillStyle = "#888888";
          ctx2.fillRect(x + j, y + j, cw - 2 * j, rh - 2 * j);
          const m = (drafted ? Math.max(3, (mapSize || s) / 110) : 3) * q;
          ctx2.fillStyle = "#e8e8e8";
          ctx2.fillRect(x + m, y + m, cw - 2 * m, rh - 2 * m);
          for (let k = 0; k < 20; k++) {
            const px2 = x + m + hash(r * 5 + i * 3 + k) * (cw - 2 * m);
            const py2 = y + m + hash(r * 9 + i * 5 + k) * (rh - 2 * m);
            ctx2.fillStyle = `rgba(60,60,60,${0.1 + hash(k) * 0.15})`;
            ctx2.beginPath();
            ctx2.arc(px2, py2, (0.6 + hash(k * 3) * 2) * q, 0, 7);
            ctx2.fill();
          }
        }
      }
    };
  }
  function marbleDraw(ctx2, s) {
    ctx2.fillStyle = "#faf8f1";
    ctx2.fillRect(0, 0, s, s);
    for (let i = 0; i < 70; i++) {
      const grey = 150 + hash(i) * 60;
      ctx2.strokeStyle = `rgba(${grey | 0},${grey - 8 | 0},${grey - 18 | 0},${0.07 + hash(i * 5) * 0.13})`;
      ctx2.lineWidth = 0.5 + hash(i * 11) * 2.2;
      ctx2.beginPath();
      let x = hash(i * 13) * s, y = -10;
      ctx2.moveTo(x, y);
      while (y < s + 10) {
        y += 5 + hash(i + y) * 15;
        x += (hash(i * 3.1 + y) - 0.5) * 34;
        ctx2.lineTo(x, y);
      }
      ctx2.stroke();
    }
    for (let i = 0; i < 300; i++) {
      ctx2.fillStyle = `rgba(200,196,184,${hash(i * 7) * 0.1})`;
      ctx2.fillRect(hash(i * 3) * s, hash(i * 5) * s, 1 + hash(i) * 2, 1 + hash(i * 2) * 2);
    }
  }
  // 1.0.1-K (the user: "אכן רצפת העזרה היתה משיש, אייר זאת כך"): the inner court's floor laid in marble slabs - I Chr 29:2 "ואבני שיש
  // לרב"; Rashi there "ואבני שיש - לעמודים ושלחנות ולרצפה"; Targum "ואבני מרמוריא". The veins of marbleDraw, each slab a little lighter
  // or greyer than its neighbours, and thin joints; n x n slabs per tile (slab size: model choice).
  function marblePaveDraw(n) {
    return (ctx2, s) => {
      marbleDraw(ctx2, s);
      const c = s / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const t = hash(i * 17.3 + j * 5.9);
        ctx2.fillStyle = t > 0.5 ? `rgba(255,255,250,${(t - 0.5) * 0.22})` : `rgba(120,116,104,${(0.5 - t) * 0.12})`;
        ctx2.fillRect(i * c, j * c, c, c);
      }
      ctx2.strokeStyle = "rgba(128,120,104,0.55)";
      ctx2.lineWidth = 1.4;
      for (let i = 0; i <= n; i++) {
        ctx2.beginPath();
        ctx2.moveTo(i * c, 0);
        ctx2.lineTo(i * c, s);
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(0, i * c);
        ctx2.lineTo(s, i * c);
        ctx2.stroke();
      }
    };
  }
  function goldDraw(ctx2, s) {
    // 1.0.1-K (the user: gold looked brown): a brighter warm base, and shading that REPEATS - the old diagonal gradient (#f8dd82 ->
    // #d6a52f) did not, so every 8-amah tile edge showed a colour step. Two gradients whose first and last stops are equal: one across, one
    // (translucent) down.
    const gx = ctx2.createLinearGradient(0, 0, s, 0);
    gx.addColorStop(0, "#f6d777");
    gx.addColorStop(0.5, "#ebc75e");
    gx.addColorStop(1, "#f6d777");
    ctx2.fillStyle = gx;
    ctx2.fillRect(0, 0, s, s);
    const gy = ctx2.createLinearGradient(0, 0, 0, s);
    gy.addColorStop(0, "rgba(255,236,170,0.22)");
    gy.addColorStop(0.5, "rgba(214,168,60,0.18)");
    gy.addColorStop(1, "rgba(255,236,170,0.22)");
    ctx2.fillStyle = gy;
    ctx2.fillRect(0, 0, s, s);
    ctx2.strokeStyle = "rgba(140,100,20,0.35)";
    ctx2.lineWidth = 2;
    const n = 5;
    for (let i = 1; i < n; i++) {
      ctx2.beginPath();
      ctx2.moveTo(i * s / n, 0);
      ctx2.lineTo(i * s / n, s);
      ctx2.stroke();
      ctx2.beginPath();
      ctx2.moveTo(0, i * s / n);
      ctx2.lineTo(s, i * s / n);
      ctx2.stroke();
    }
    for (let i = 0; i < 500; i++) {
      ctx2.fillStyle = `rgba(255,244,190,${hash(i) * 0.18})`;
      ctx2.fillRect(hash(i * 3) * s, hash(i * 7) * s, 1 + hash(i) * 2.5, 1 + hash(i * 2) * 2.5);
    }
  }
  function paveDraw(scale) {
    return (ctx2, s) => {
      ctx2.fillStyle = "#dccfb0";
      ctx2.fillRect(0, 0, s, s);
      const n = scale, c = s / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const t = (hash(i * 13.1 + j * 7.7) - 0.5) * 0.16;
        const base = mix(hex2rgb("#dccfb0"), t > 0 ? [255, 250, 235] : [80, 66, 44], Math.abs(t));
        const g = ctx2.createLinearGradient(i * c, j * c, i * c + c, j * c + c);
        g.addColorStop(0, css(mix(base, [255, 252, 240], 0.06)));
        g.addColorStop(1, css(mix(base, [90, 75, 50], 0.08)));
        ctx2.fillStyle = g;
        ctx2.fillRect(i * c + 1.2, j * c + 1.2, c - 2.4, c - 2.4);
        for (let k = 0; k < 8; k++) {
          ctx2.fillStyle = `rgba(105,90,60,${0.05 + hash(i + j + k) * 0.07})`;
          ctx2.beginPath();
          ctx2.arc(i * c + hash(i * j + k) * c, j * c + hash(i + j * k + 1) * c, 0.5 + hash(k) * 1.8, 0, 7);
          ctx2.fill();
        }
      }
      ctx2.strokeStyle = "rgba(120,105,75,0.9)";
      ctx2.lineWidth = 1.6;
      for (let i = 0; i <= n; i++) {
        ctx2.beginPath();
        ctx2.moveTo(i * c, 0);
        ctx2.lineTo(i * c, s);
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(0, i * c);
        ctx2.lineTo(s, i * c);
        ctx2.stroke();
      }
    };
  }
  function altarDraw(ctx2, s) {
    ctx2.fillStyle = "#9d8d6d";
    ctx2.fillRect(0, 0, s, s);
    const cb = hex2rgb("#9d8d6d");
    for (let i = 0; i < 320; i++) {
      const t = (hash(i * 3.7) - 0.5) * 0.34;
      ctx2.fillStyle = css(mix(cb, t > 0 ? [235, 226, 200] : [58, 48, 32], Math.abs(t)));
      const x = hash(i * 13) * s, y = hash(i * 29) * s, r = 4 + hash(i) * 16;
      ctx2.beginPath();
      for (let a = 0; a < 8; a++) {
        const ang = a / 8 * Math.PI * 2, rr = r * (0.55 + hash(i + a) * 0.7);
        a ? ctx2.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr) : ctx2.moveTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr);
      }
      ctx2.fill();
    }
    for (let i = 0; i < 90; i++) {
      ctx2.fillStyle = `rgba(240,235,220,${0.05 + hash(i * 9) * 0.1})`;
      ctx2.fillRect(hash(i * 3) * s, hash(i * 5) * s, 3 + hash(i) * 20, 2 + hash(i * 2) * 6);
    }
  }
  function groundDraw(ctx2, s) {
    ctx2.fillStyle = "#b8b08f";
    ctx2.fillRect(0, 0, s, s);
    const cb = hex2rgb("#b8b08f");
    for (let i = 0; i < 900; i++) {
      const t = (hash(i * 1.7) - 0.5) * 0.3;
      ctx2.fillStyle = css(mix(cb, t > 0 ? [225, 212, 180] : [70, 58, 38], Math.abs(t)));
      ctx2.beginPath();
      ctx2.arc(hash(i * 3) * s, hash(i * 7) * s, 1 + hash(i) * 6, 0, 7);
      ctx2.fill();
    }
    for (let i = 0; i < 40; i++) {
      ctx2.fillStyle = `rgba(110,115,60,${0.1 + hash(i * 13) * 0.14})`;
      ctx2.beginPath();
      ctx2.arc(hash(i * 31) * s, hash(i * 17) * s, 4 + hash(i) * 14, 0, 7);
      ctx2.fill();
    }
  }
  function cedarDraw(ctx2, s) {
    ctx2.fillStyle = "#7a5230";
    ctx2.fillRect(0, 0, s, s);
    for (let i = 0; i < 46; i++) {
      ctx2.strokeStyle = `rgba(${50 + hash(i) * 60 | 0},${30 + hash(i * 3) * 40 | 0},${12 + hash(i * 7) * 25 | 0},${0.25 + hash(i * 5) * 0.4})`;
      ctx2.lineWidth = 1 + hash(i * 11) * 3;
      ctx2.beginPath();
      let y = i / 46 * s + (hash(i) - 0.5) * 8;
      ctx2.moveTo(0, y);
      for (let x = 0; x <= s; x += 16) ctx2.lineTo(x, y + Math.sin(x * 0.05 + i) * 2.5);
      ctx2.stroke();
    }
  }
  // (1.0.1-K: parochetDraw / TEX.parochet / M.parochet removed - 55-interior.js weaves the parochet's two faces itself, int_parochetTex)
  function latticeDraw(ctx2, s) {
    ctx2.fillStyle = "rgba(122,102,66,1)";
    ctx2.fillRect(0, 0, s, s);
    ctx2.strokeStyle = "#584828";
    ctx2.lineWidth = 7;
    for (let i = -s; i < s * 2; i += 26) {
      ctx2.beginPath();
      ctx2.moveTo(i, 0);
      ctx2.lineTo(i + s, s);
      ctx2.stroke();
      ctx2.beginPath();
      ctx2.moveTo(i + s, 0);
      ctx2.lineTo(i, s);
      ctx2.stroke();
    }
    ctx2.strokeStyle = "rgba(200,180,130,0.25)";
    ctx2.lineWidth = 2;
    for (let i = -s; i < s * 2; i += 26) {
      ctx2.beginPath();
      ctx2.moveTo(i + 2, 0);
      ctx2.lineTo(i + s + 2, s);
      ctx2.stroke();
    }
  }
  function plasterDraw(ctx2, s) {
    ctx2.fillStyle = "#e9e2d0";
    ctx2.fillRect(0, 0, s, s);
    for (let i = 0; i < 500; i++) {
      ctx2.fillStyle = `rgba(${170 + hash(i) * 60 | 0},${160 + hash(i * 2) * 55 | 0},${135 + hash(i * 3) * 50 | 0},${0.06 + hash(i * 5) * 0.09})`;
      ctx2.beginPath();
      ctx2.arc(hash(i * 3) * s, hash(i * 7) * s, 1 + hash(i) * 5, 0, 7);
      ctx2.fill();
    }
  }
  function worldTex(texObj, tileAmot) {
    const r = 1 / tileAmot;
    texObj.map.repeat.set(r, r);
    if (texObj.bumpMap) texObj.bumpMap.repeat.set(r, r);
    return texObj;
  }
  var core_texT0 = performance.now();
  var TEX = {
    // 1.0.1-K: the three ashlar bumps at half the colour map's size (1024 -> 512, 512 -> 256), see the note above hash()
    stone: worldTex(makeTex(1024, ashlarDraw("#f1e9d3", "#bfb08c", 5, true), { bump: ashlarBump(5, true, 1024), bumpSize: 512 }), 15),
    stoneLight: worldTex(makeTex(1024, ashlarDraw("#f6f0de", "#cdbf9d", 6, false), { bump: ashlarBump(6, false, 1024), bumpSize: 512 }), 12),
    stoneSmooth: worldTex(makeTex(512, ashlarDraw("#f2ead6", "#c4b692", 8, false), { bump: ashlarBump(8, false, 512), bumpSize: 256 }), 6),
    marble: worldTex(makeTex(1024, marbleDraw), 20),
    marblePave: worldTex(makeTex(1024, marblePaveDraw(8)), 24),   // 1.0.1-K: the inner court's floor, slabs 3 x 3 amot (model choice)
    gold: worldTex(makeTex(512, goldDraw), 8),
    pave: worldTex(makeTex(1024, paveDraw(10)), 30),
    paveFine: worldTex(makeTex(1024, paveDraw(14)), 20),
    altar: worldTex(makeTex(1024, altarDraw), 12),
    ground: worldTex(makeTex(1024, groundDraw), 60),
    cedar: worldTex(makeTex(512, cedarDraw), 8),
    lattice: worldTex(makeTex(256, latticeDraw), 3),
    plaster: worldTex(makeTex(512, plasterDraw), 10)
  };
  var core_texMs = performance.now() - core_texT0;
  function std(tex, opts = {}) {
    return new MeshStandardMaterial(Object.assign(
      { map: tex.map, bumpMap: tex.bumpMap || null, bumpScale: tex.bumpMap ? 1.2 : 0, roughness: 0.92, metalness: 0 },
      opts
    ));
  }
  // 1.0.1-K - ONE gold recipe for every gold surface (the user: "כל מה שצריך להיות זהב יותר דומה לחום ולא לזהב תקן זאת"). The 1.0.1 gold
  // multiplied a yellow texture by a yellow colour (0xF0C964: the product is an orange-brown ~#D38C17) and leaned on metalness 0.68-0.72,
  // so in the closed house (shadowed from the sun, lit by the hemisphere light and the environment only) it read brown. Now: a cream
  // colour (no second tint), metalness 0.5 so the diffuse light counts, and a faint warm emissive so gold never sinks to brown in shade.
  // Tested live on the kodesh walls (tools/shots g0 = old, g3 = this). Use goldStd(tex, extra) for any new gold material.
  var GOLD_OPTS = { color: 0xFFF1C8, metalness: 0.5, roughness: 0.32, envMapIntensity: 1.3, emissive: 0x5a400f, emissiveIntensity: 0.45 };
  function goldStd(tex, extra) {
    return std(tex, Object.assign({}, GOLD_OPTS, extra || {}));
  }
  var M = {
    stone: std(TEX.stone, { roughness: 0.72, envMapIntensity: 0.55, bumpScale: 0.7 }),
    stoneLight: std(TEX.stoneLight, { roughness: 0.66, envMapIntensity: 0.6, bumpScale: 0.6 }),
    stoneSmooth: std(TEX.stoneSmooth, { roughness: 0.55, envMapIntensity: 0.7, bumpScale: 0.4 }),
    marble: std(TEX.marble, { roughness: 0.22, metalness: 0.06, bumpScale: 0, envMapIntensity: 1.1 }),
    marblePave: std(TEX.marblePave, { roughness: 0.38, metalness: 0.02, bumpScale: 0, envMapIntensity: 0.8 }),
    gold: goldStd(TEX.gold),                 // 1.0.1-K: was std(TEX.gold, { roughness 0.28, metalness 0.72, color 0xF0C964, envMapIntensity 2.2 }) - brown
    // 1.0.1-K (integration): the warm polished bronze of 45-vessels.js's vsl_bronze for every bronze - with 1.0.1's colour 0xA26F2E and
    // metalness 0.95 the altar's shaded faces rendered black; metalness 0.75 lets the hemisphere light count and a faint warm emissive keeps
    // the shade from sinking to black (the idea of GOLD_OPTS). The clones (the altar, the doors, vessels, Yachin and Boaz) keep their overrides.
    bronze: new MeshStandardMaterial({ color: 0xb87a3e, roughness: 0.34, metalness: 0.75, envMapIntensity: 1.3, emissive: 0x351a08, emissiveIntensity: 0.35 }),
    cedar: std(TEX.cedar, { roughness: 0.8 }),
    pave: std(TEX.pave, { roughness: 0.7, envMapIntensity: 0.5 }),
    paveFine: std(TEX.paveFine, { roughness: 0.7, envMapIntensity: 0.5 }),
    altarStone: std(TEX.altar, { roughness: 1 }),
    ground: std(TEX.ground, { roughness: 1 }),
    plaster: std(TEX.plaster, { roughness: 0.9 }),
    lattice: std(TEX.lattice, { roughness: 0.9 })
  };
  function uvWorldBox(geo, w, h, d) {
    const uv = geo.attributes.uv, pos = geo.attributes.position;
    const nrm = geo.attributes.normal;
    for (let i = 0; i < uv.count; i++) {
      const nx = Math.abs(nrm.getX(i)), ny = Math.abs(nrm.getY(i)), nz = Math.abs(nrm.getZ(i));
      let su = 1, sv = 1;
      if (nx > 0.5) {
        su = d;
        sv = h;
      } else if (ny > 0.5) {
        su = w;
        sv = d;
      } else {
        su = w;
        sv = h;
      }
      uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
    }
    uv.needsUpdate = true;
    return geo;
  }
  function uvWorld(geo, sx, sy) {
    const uv = geo.attributes.uv;
    if (!uv) return geo;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy);
    uv.needsUpdate = true;
    return geo;
  }
  function box(parent, w, h, d, mat, x = 0, y = 0, z = 0) {
    const geo = uvWorldBox(new BoxGeometry(w, h, d), w, h, d);
    const m = new Mesh(geo, mat);
    m.position.set(x, y + h / 2, z);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function cyl(parent, rT, rB, h, mat, x = 0, y = 0, z = 0, seg = 24) {
    const geo = uvWorld(new CylinderGeometry(rT, rB, h, seg), 2 * Math.PI * Math.max(rT, rB), h);
    const m = new Mesh(geo, mat);
    m.position.set(x, y + h / 2, z);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function lathe(parent, pts, mat, x = 0, y = 0, z = 0, segs = 24) {
    const v = pts.map((p) => new Vector2(p[0], p[1]));
    const geo = new LatheGeometry(v, segs);
    const m = new Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function ring(parent, r, tube, mat, x = 0, y = 0, z = 0, rotX = Math.PI / 2) {
    const m = new Mesh(new TorusGeometry(r, tube, 10, 28), mat);
    m.rotation.x = rotX;
    m.position.set(x, y, z);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  var OCC = [];
  function occ(m) {
    m.material = m.material.clone();
    m.userData.fade = { cur: 1, tgt: 1 };
    OCC.push(m);
    return m;
  }
  function wall(parent, { axis = "x", length, height, thickness = 4, mat = M.stone, cx = 0, cz = 0, y = 0, openings = [], occlude = true }) {
    const shape = new Shape();
    shape.moveTo(-length / 2, 0);
    shape.lineTo(length / 2, 0);
    shape.lineTo(length / 2, height);
    shape.lineTo(-length / 2, height);
    shape.closePath();
    for (const o of openings) {
      const w2 = o.width / 2, hc = o.center || 0, hh = o.height;
      const p = new Path();
      if (o.gable) {
        // 1.0.19: pentagon opening (rectangle + triangular top of height o.gable) - used for the Tadi gate (Middot 2:3)
        p.moveTo(hc - w2, 0);
        p.lineTo(hc + w2, 0);
        p.lineTo(hc + w2, hh);
        p.lineTo(hc, hh + o.gable);
        p.lineTo(hc - w2, hh);
        p.closePath();
      } else if (o.arched) {
        const straight = Math.max(hh - w2, 1e-3);
        p.moveTo(hc - w2, 0);
        p.lineTo(hc + w2, 0);
        p.lineTo(hc + w2, straight);
        p.absarc(hc, straight, w2, 0, Math.PI, false);
        p.lineTo(hc - w2, 0);
      } else {
        p.moveTo(hc - w2, 0);
        p.lineTo(hc + w2, 0);
        p.lineTo(hc + w2, hh);
        p.lineTo(hc - w2, hh);
        p.closePath();
      }
      shape.holes.push(p);
    }
    const geo = new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 24 });
    geo.translate(0, 0, -thickness / 2);
    const m = new Mesh(geo, mat);
    if (axis === "z") m.rotation.y = Math.PI / 2;
    m.position.set(cx, y, cz);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    if (occlude) occ(m);
    return m;
  }
  function stairs(parent, { width, totalRise, steps, dir = "W", x = 0, y = 0, z = 0, mat = M.stoneSmooth, tread = 0.75 }) {
    const rise = totalRise / steps;
    const g = new Group();
    const geos = [];
    for (let i = 0; i < steps; i++) {
      const h = (i + 1) * rise;
      const bg = new BoxGeometry(tread, h, width);
      uvWorldBox(bg, tread, h, width);
      bg.translate(i * tread + tread / 2, h / 2, 0);
      geos.push(bg);
    }
    const merged = mergeGeometries(geos);
    const mesh = new Mesh(merged, mat);
    mesh.castShadow = mesh.receiveShadow = true;
    g.add(mesh);
    const rotY = { W: Math.PI, E: 0, N: Math.PI / 2, S: -Math.PI / 2 }[dir];
    g.rotation.y = rotY;
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  }
  function columnGeo({ height = 25, rShaft = 1, style = "doric" } = {}) {
    const parts = [];
    const baseH = rShaft * 0.55;
    const b1 = new CylinderGeometry(rShaft * 1.45, rShaft * 1.55, baseH * 0.5, 20);
    b1.translate(0, baseH * 0.25, 0);
    parts.push(b1);
    const b2 = new TorusGeometry(rShaft * 1.18, rShaft * 0.22, 10, 22);
    b2.rotateX(Math.PI / 2);
    b2.translate(0, baseH * 0.68, 0);
    parts.push(b2);
    const shaftH = height - baseH - rShaft * 1.5;
    const sh = new CylinderGeometry(rShaft * 0.82, rShaft, shaftH, 20);
    sh.translate(0, baseH + shaftH / 2, 0);
    parts.push(sh);
    const capY = baseH + shaftH;
    if (style === "corinthian") {
      const bell = new CylinderGeometry(rShaft * 1.25, rShaft * 0.8, rShaft * 1.1, 20);
      bell.translate(0, capY + rShaft * 0.55, 0);
      parts.push(bell);
      const ab = new BoxGeometry(rShaft * 2.7, rShaft * 0.4, rShaft * 2.7);
      ab.translate(0, capY + rShaft * 1.3, 0);
      parts.push(ab);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        const v = new SphereGeometry(rShaft * 0.28, 8, 8);
        v.translate(sx * rShaft * 1.05, capY + rShaft * 1, sz * rShaft * 1.05);
        parts.push(v);
      }
    } else {
      const ech = new CylinderGeometry(rShaft * 1.3, rShaft * 0.85, rShaft * 0.6, 20);
      ech.translate(0, capY + rShaft * 0.3, 0);
      parts.push(ech);
      const ab = new BoxGeometry(rShaft * 2.5, rShaft * 0.45, rShaft * 2.5);
      ab.translate(0, capY + rShaft * 0.85, 0);
      parts.push(ab);
    }
    const merged = mergeGeometries(parts);
    uvWorld(merged, 1, 1);
    return merged;
  }
  function colonnade(parent, positions, { height = 25, rShaft = 1, mat = null, style = "corinthian" } = {}) {
    const geo = columnGeo({ height, rShaft, style });
    const material = mat || M.marble;
    const inst = new InstancedMesh(geo, material, positions.length);
    const m42 = new Matrix4();
    positions.forEach((p, i) => {
      m42.makeTranslation(p.x, p.y || 0, p.z);
      inst.setMatrixAt(i, m42);
    });
    inst.castShadow = inst.receiveShadow = true;
    parent.add(inst);
    return inst;
  }
  function crenellate(parent, { x1, z1, x2, z2, y, mat = M.stoneLight, h = 1.5, w = 1.5, gap = 1.4, depth = 0.9 }) {
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    const n = Math.max(1, Math.floor(len / (w + gap)));
    const geo = uvWorldBox(new BoxGeometry(w, h, depth), w, h, depth);
    const inst = new InstancedMesh(geo, mat, n);
    const m42 = new Matrix4();
    const ang = Math.atan2(dx, dz) + Math.PI / 2;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      m42.makeRotationY(ang);
      m42.setPosition(x1 + dx * t, y + h / 2, z1 + dz * t);
      inst.setMatrixAt(i, m42);
    }
    inst.castShadow = true;
    parent.add(inst);
    occ(inst);
    return inst;
  }
  var H = { occ, OCC, box, cyl, wall, stairs, columnGeo, colonnade, crenellate, ring, lathe, uvWorld, uvWorldBox };

