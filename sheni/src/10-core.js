  // plugin/js/core.js
  //@@include terrain-raycast
  // webgpu round: THE ENVIRONMENT LIGHT AS IN THREE.JS 160 - 160 applied a material's envMapIntensity to the scene's environment map too;
  // since 163 only to the material's own envMap (else scene.environmentIntensity, 1). The materials here tune it (stone and paving 0.5-0.7,
  // gold and bronze 1.1-1.3): a standard material without an envMap of its own whose envMapIntensity is not 1 reports the scene's current
  // environment map as its envMap, so its envMapIntensity counts again (scene.environment stays the switch: null at night)
  Object.defineProperty(Material.prototype, "envMap", { configurable: true,
    get() { if (this._tmEnvMap) return this._tmEnvMap; return this.isMeshStandardMaterial && this.envMapIntensity !== 1 && typeof scene !== "undefined" && scene ? scene.environment : null; },
    set(v) { this._tmEnvMap = v && !(typeof scene !== "undefined" && scene && v === scene.environment) ? v : null; } });
  var LV = { HAR: 0, EZN: 6, AZ: 13.5, KOH: 16, HEI: 22 };
  // 1.9.3 (the user, of the kuntres "בגדרי ודיני צורת הבית", point 24 and its author's first note: "חובה לשנות", "בשניהם"): THE HOUSE'S
  // FLOOR SLOPES - Rashi Menachot 99a "כתלמיד היושב לפני רבו - נמוך הימנו, כך אותם של שלמה נמוכין משל משה, דבית המקדש היה משופע ולצד מערב
  // מגביה יותר" (2186, line 4703). From the heichal's door (x -4.5) to the west wall of the Holy of Holies (x -65.5). How much is not
  // stated: 4 amot on the 61 (the user, 20:12: "שיפוע 4 אמות מספיק"; 1.5 was hardly seen) - a model choice. houseRise(x) = the floor's rise at x.
  // SLOPE2_D (fix-d, 22.11.2026 - the user's decision 145 א): the floor is LEVEL by default in this house - the Rambam, Beit HaBechirah 6:4
  // "והאולם וההיכל כלו בשוה" - and slopes only in the reading of Rashi (the row "רצפת ההיכל — משופעת או שטוחה"; 50-heichal.js, the end
  // of build4). HOUSE_SLOPE.on: houseRise(x) is 0 while it is off; what stands on the floor is built level and is lifted by a shear
  // (50-heichal.js) when the reading is chosen, and what walks (the figures, the walk) asks houseRise at its moment.
  var HOUSE_SLOPE = { x0: -4.5, x1: -65.5, rise: 4, on: false };
  var houseRise = function (x) { if (!HOUSE_SLOPE.on) return 0; return HOUSE_SLOPE.rise * Math.max(0, Math.min(1, (HOUSE_SLOPE.x0 - x) / (HOUSE_SLOPE.x0 - HOUSE_SLOPE.x1))); };
  var CO = {
    azE: 93.5,
    azW: -93.5,
    azN: -67.5,
    azS: 67.5,
    AZ_L: 187,
    AZ_W: 135,
    eznW: 93.5,
    eznE: 228.5,
    EZN: 135,
    harW: -147,
    harE: 353,
    harN: -167.5,
    harS: 332.5,
    HAR: 500,
    xIsraelW: 82.5,
    xKohanimW: 71.5,
    xAltarE: 71.5,
    xAltarW: 39.5,
    xUlamE: 17.5,
    xHeiW: -82.5,
    xDevirE: -45.5,    // 1.2.0: the east face of the Holy of Holies (Middot 4:7: 40 kodesh + the amah traksin west of x -4.5)
    xKodeshE: -4.5,
    xKodeshW: -44.5,
    zHouseS: 35,
    HOUSE_W: 70
  };
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
  function makeTex(size, draw, { bump = null } = {}) {
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
      bc.width = bc.height = size;
      bump(bc.getContext("2d"), size);
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
  function ashlarBump(rows, drafted) {
    return (ctx2, s) => {
      ctx2.fillStyle = "#404040";
      ctx2.fillRect(0, 0, s, s);
      const rh = s / rows;
      for (let r = 0; r < rows; r++) {
        const cols = 2 + r % 2;
        const cw = s / cols, off = r % 2 ? cw / 2 : 0;
        for (let i = -1; i <= cols; i++) {
          const x = i * cw + off, y = r * rh;
          const j = 2;
          ctx2.fillStyle = "#888888";
          ctx2.fillRect(x + j, y + j, cw - 2 * j, rh - 2 * j);
          const m = drafted ? Math.max(3, s / 110) : j + 1;
          ctx2.fillStyle = "#e8e8e8";
          ctx2.fillRect(x + m, y + m, cw - 2 * m, rh - 2 * m);
          for (let k = 0; k < 20; k++) {
            const px2 = x + m + hash(r * 5 + i * 3 + k) * (cw - 2 * m);
            const py2 = y + m + hash(r * 9 + i * 5 + k) * (rh - 2 * m);
            ctx2.fillStyle = `rgba(60,60,60,${0.1 + hash(k) * 0.15})`;
            ctx2.beginPath();
            ctx2.arc(px2, py2, 0.6 + hash(k * 3) * 2, 0, 7);
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
  function goldDraw(ctx2, s) {
    const g = ctx2.createLinearGradient(0, 0, s, s * 0.8);
    g.addColorStop(0, "#f8dd82");
    g.addColorStop(0.35, "#e0b23a");
    g.addColorStop(0.6, "#f3d068");
    g.addColorStop(1, "#d6a52f");
    ctx2.fillStyle = g;
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
  function parochetDraw(ctx2, s) {
    const g = ctx2.createLinearGradient(0, 0, 0, s);
    g.addColorStop(0, "#4a1d5e");
    g.addColorStop(0.5, "#5c2470");
    g.addColorStop(1, "#43195a");
    ctx2.fillStyle = g;
    ctx2.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 4) {
      ctx2.fillStyle = `rgba(20,8,30,${0.12 + hash(y) * 0.08})`;
      ctx2.fillRect(0, y, s, 1.4);
    }
    ctx2.fillStyle = "rgba(160,30,40,0.55)";
    ctx2.fillRect(0, s * 0.12, s, s * 0.06);
    ctx2.fillRect(0, s * 0.82, s, s * 0.06);
    ctx2.fillStyle = "rgba(212,164,40,0.7)";
    ctx2.fillRect(0, s * 0.2, s, s * 0.025);
    ctx2.fillRect(0, s * 0.78, s, s * 0.025);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
      const cx = (i + 0.5) * s / 4, cy = s * 0.32 + j * s * 0.16;
      ctx2.strokeStyle = "rgba(220,175,60,0.65)";
      ctx2.lineWidth = 2.5;
      ctx2.beginPath();
      ctx2.moveTo(cx, cy - 14);
      ctx2.lineTo(cx + 11, cy);
      ctx2.lineTo(cx, cy + 14);
      ctx2.lineTo(cx - 11, cy);
      ctx2.closePath();
      ctx2.stroke();
    }
  }
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
  var TEX = {
    stone: worldTex(makeTex(1024, ashlarDraw("#f1e9d3", "#bfb08c", 5, true), { bump: ashlarBump(5, true) }), 15),
    stoneLight: worldTex(makeTex(1024, ashlarDraw("#f6f0de", "#cdbf9d", 6, false), { bump: ashlarBump(6, false) }), 12),
    stoneSmooth: worldTex(makeTex(512, ashlarDraw("#f2ead6", "#c4b692", 8, false), { bump: ashlarBump(8, false) }), 6),
    marble: worldTex(makeTex(1024, marbleDraw), 20),
    gold: worldTex(makeTex(512, goldDraw), 8),
    pave: worldTex(makeTex(1024, paveDraw(10)), 30),
    paveFine: worldTex(makeTex(1024, paveDraw(14)), 20),
    altar: worldTex(makeTex(1024, altarDraw), 12),
    ground: worldTex(makeTex(1024, groundDraw), 60),
    cedar: worldTex(makeTex(512, cedarDraw), 8),
    parochet: worldTex(makeTex(1024, parochetDraw), 40),
    lattice: worldTex(makeTex(256, latticeDraw), 3),
    plaster: worldTex(makeTex(512, plasterDraw), 10)
  };
  function std(tex, opts = {}) {
    return new MeshStandardMaterial(Object.assign(
      { map: tex.map, bumpMap: tex.bumpMap || null, bumpScale: tex.bumpMap ? 1.2 : 0, roughness: 0.92, metalness: 0 },
      opts
    ));
  }
  //@@include copper
  var M = {
    stone: std(TEX.stone, { roughness: 0.72, envMapIntensity: 0.55, bumpScale: 0.7 }),
    stoneLight: std(TEX.stoneLight, { roughness: 0.66, envMapIntensity: 0.6, bumpScale: 0.6 }),
    stoneSmooth: std(TEX.stoneSmooth, { roughness: 0.55, envMapIntensity: 0.7, bumpScale: 0.4 }),
    marble: std(TEX.marble, { roughness: 0.22, metalness: 0.06, bumpScale: 0, envMapIntensity: 1.1 }),
    gold: std(TEX.gold, { color: 0xFFF1C8, metalness: 0.5, roughness: 0.32, envMapIntensity: 1.3, emissive: 0x5a400f, emissiveIntensity: 0.45 }),   // 1.3.0: the First Temple's gold recipe (1.0.1-K: cream, not brown in the shade)
    bronze: tm_copper(0xa2702e, 0.34, { glow: 0.35 }),   // COPPER_C (fix-c, 22.11.2026): the book's copper, one for both houses (shared/frag/copper.js); until now 0xa2702e, metalness .95
    // 1.5.0: the gates' doors - gold (Middot 2:3 "כל השערים שהיו שם נשתנו להיות של זהב"), and Nikanor's bronze "שנחשתן מצהיב" - a bronze
    // that yellows like gold (Yoma 38a), a little darker and warmer than the gold
    gateGold: new MeshStandardMaterial({ color: 0xF2D27A, metalness: 0.85, roughness: 0.3, envMapIntensity: 1.3, emissive: 0x4a3608, emissiveIntensity: 0.3 }),
    nikanorBronze: new MeshStandardMaterial({ color: 0xE7BA5C, metalness: 0.9, roughness: 0.32, envMapIntensity: 1.25, emissive: 0x42300a, emissiveIntensity: 0.28 }),   // 1.8.0 (the user: "יותר דומה לזהב אבל עדיין נחושת"): nearer the gates' gold (0xF2D27A), still a deeper, warmer bronze
    cedar: std(TEX.cedar, { roughness: 0.8 }),
    pave: std(TEX.pave, { roughness: 0.7, envMapIntensity: 0.5 }),
    paveFine: std(TEX.paveFine, { roughness: 0.7, envMapIntensity: 0.5 }),
    altarStone: std(TEX.altar, { roughness: 1 }),
    ground: std(TEX.ground, { roughness: 1 }),
    plaster: std(TEX.plaster, { roughness: 0.9 }),
    parochet: std(TEX.parochet, { roughness: 0.95, side: DoubleSide }),
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
  // 1.9.2 (the user: "מאז האיחוד יש איטיות" - measured: 1.9.1 drew half again as many pieces as 1.9.0): many plain copies of one box or
  // cylinder (the same size and material, directly in `group`, no fading or picking role) become ONE InstancedMesh - one draw instead of
  // dozens. Only for groups built here whose pieces are never reached one by one (railings, furnishings); `min` copies at least
  function instancify(group, min = 3) {
    const by = new Map();
    for (const o of group.children) {
      if (!o.isMesh || o.isInstancedMesh || !o.visible || o.name || Object.keys(o.userData).length) continue;
      const g = o.geometry, P = g && g.parameters;
      if (!P || !(g.type === "BoxGeometry" || g.type === "CylinderGeometry")) continue;
      const k = g.type + ":" + Object.values(P).map((v) => (typeof v === "number" ? v.toFixed(4) : String(v))).join(",") + ":" + o.material.uuid + ":" + o.castShadow + o.receiveShadow;
      if (!by.has(k)) by.set(k, []);
      by.get(k).push(o);
    }
    for (const list of by.values()) {
      if (list.length < min) continue;
      const im = new InstancedMesh(list[0].geometry, list[0].material, list.length);
      list.forEach((o, i) => { o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
      im.castShadow = list[0].castShadow;
      im.receiveShadow = list[0].receiveShadow;
      im.computeBoundingSphere();
      for (const o of list) group.remove(o);
      group.add(im);
    }
    return group;
  }
  function cyl(parent, rT, rB, h, mat, x = 0, y = 0, z = 0, seg = 24) {
    const geo = uvWorld(new CylinderGeometry(rT, rB, h, seg), 2 * Math.PI * Math.max(rT, rB), h);
    const m = new Mesh(geo, mat);
    m.position.set(x, y + h / 2, z);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  // 1.5.0 (the user: "שער ניקנור למה לא מצויר?" / the gates' doors): two door leaves in a gate's opening, hinged at the jambs and swung
  // into the court by `open` radians. axis "x": the wall runs along x and inward is +z when inward = 1; axis "z": the wall runs along z and
  // inward is +x when inward = 1. (cx, cz) the opening's centre, y its threshold, width x height the opening, thick the leaf, mat its material
  function doors(parent, { axis = "x", cx = 0, cz = 0, y = 0, width = 10, height = 20, inward = 1, mat, open = 1.0, thick = 0.4, inset = 0 }) {
    const grp = new Group();
    grp.userData.tmDoors = { inward, open };   // DOORS_TAG_195: the lotteries' night (55-payis.js) shuts every gate and gives it back
    const lw = width / 2 - 0.1;
    for (const s of [-1, 1]) {
      const geo = uvWorldBox(new BoxGeometry(lw, height - 0.3, thick), lw, height - 0.3, thick);
      geo.translate(lw / 2, (height - 0.3) / 2, 0);                         // the hinge at the leaf's own x 0
      const leaf = new Mesh(geo, mat);
      leaf.position.set(s * width / 2, 0.15, inset * inward);
      leaf.rotation.y = s < 0 ? -open * inward : Math.PI + open * inward;   // the left leaf swings one way, the right the other, both inward
      leaf.castShadow = leaf.receiveShadow = true;
      // a bronze stud band across each leaf, and a frame (model choices - the doors' look is not described)
      const band = new Mesh(uvWorldBox(new BoxGeometry(lw - 0.2, 0.35, thick + 0.08), lw - 0.2, 0.35, thick + 0.08), M.bronze);
      band.position.set(lw / 2, height * 0.5, 0);
      leaf.add(band);
      grp.add(leaf);
    }
    if (axis === "z") grp.rotation.y = Math.PI / 2;
    grp.position.set(cx, y, cz);
    parent.add(grp);
    return grp;
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
  // LAMB_211 (the user, 14.11.2026: "את הטלאים עשית ציוריים מדי, אני רוצה אותם ממש אמיתיים - השוה לתמונות שתמצא באינטרנט"): ONE LAMB for
  // the lambs' chamber (30-courts.js) and for the morning's service (55-tamid.js), built as the animal is: a deep trunk under a lumpy
  // fleece, a neck that rises forward, a long head that narrows to the muzzle - eyes on its sides, ears out and a little down, nostrils -
  // four legs with their joints (the knee and the fetlock in front, the hock behind), short-haired from the fleece down, on dark
  // hooves, and a hanging woolly tail. Every part is a lofted tube (rings along a line); the fleece's lumps are a smooth noise pushed
  // outwards, its hollows a little darker (the vertex colours); one material, its bump - small curls - only where the fleece has UVs.
  // Measures at scale 1 (amot): the back at 1.1, the trunk 1.1 long, the head 0.43 - a lamb of about half a metre at the back.
  // lambKit() -> { mat, pose(name) -> geometry ("stand" | "look" | "graze" | "lie"), build() -> { g, body, head, legs } (articulated) }
  var LAMB_KIT = null;
  function lambKit() {
    if (LAMB_KIT) return LAMB_KIT;
    const h3 = (x, y, z) => { const q = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return q - Math.floor(q); };
    const sm = (t) => t * t * (3 - 2 * t), lp = (p, q, t) => p + (q - p) * t;
    const vn = (x, y, z) => {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
      return lp(lp(lp(h3(xi, yi, zi), h3(xi + 1, yi, zi), xf), lp(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), xf), yf),
        lp(lp(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), xf), lp(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), xf), yf), zf);
    };
    const WOOL = 0xf0e9da, FACE = 0xebe1d3, MUZ = 0xe2c7b9, NOSE = 0xb58a83, EARC = 0xe6d2c5, LEG = 0xe8decd, HOOF = 0x3b322c, EYE = 0x16110d;
    // a tube through rings [x, y, z, rx, ry, colour, wool?]; rx lies along `ux` (the side), ry across it and the tube's line
    const loft = (rings, o = {}) => {
      const seg = o.seg || 14, ux = o.ux || [1, 0, 0], amp = o.amp == null ? 0.052 : o.amp, n = rings.length;
      const pos = [], col = [], uv = [], rad = [], wl = [], idx = [];
      const C = new Color(), T = new Vector3(), U = new Vector3(ux[0], ux[1], ux[2]), V = new Vector3();
      let len = 0;
      for (let i = 0; i < n; i++) {
        const a = rings[Math.max(0, i - 1)], b = rings[Math.min(n - 1, i + 1)], r = rings[i];
        T.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
        V.crossVectors(T, U).normalize();
        if (i) len += Math.hypot(r[0] - rings[i - 1][0], r[1] - rings[i - 1][1], r[2] - rings[i - 1][2]);
        C.set(r[5]);
        const w = r[6] ? 1 : 0;
        for (let j = 0; j <= seg; j++) {
          const an = j / seg * Math.PI * 2, ca = Math.cos(an), sa = Math.sin(an);
          pos.push(r[0] + U.x * r[3] * ca + V.x * r[4] * sa, r[1] + U.y * r[3] * ca + V.y * r[4] * sa, r[2] + U.z * r[3] * ca + V.z * r[4] * sa);
          rad.push(U.x * ca + V.x * sa, U.y * ca + V.y * sa, U.z * ca + V.z * sa);
          col.push(C.r, C.g, C.b);
          wl.push(w);
          if (w) uv.push(j / seg * 5, len * 7); else uv.push(0.5, 0.5);
        }
      }
      const S1 = seg + 1;
      for (let i = 0; i < n - 1; i++) for (let j = 0; j < seg; j++) {
        const A = i * S1 + j, B = A + 1, Cc = A + S1, D = Cc + 1;
        idx.push(A, B, Cc, B, D, Cc);
      }
      // the fleece: pushed outwards by a smooth noise of two sizes; the hollows a little darker
      for (let k = 0; k < wl.length; k++) {
        if (!wl[k]) continue;
        const x = pos[k * 3], y = pos[k * 3 + 1], z = pos[k * 3 + 2];
        const nz = 0.5 * vn(x * 8 + 3.1, y * 8 + 7.7, z * 8 + 1.3) + 0.32 * vn(x * 19 + 9.2, y * 19 + 4.4, z * 19 + 6.6) + 0.18 * vn(x * 41 + 2.2, y * 41 + 8.4, z * 41 + 5.6);
        const d = amp * (nz - 0.35);
        pos[k * 3] += rad[k * 3] * d; pos[k * 3 + 1] += rad[k * 3 + 1] * d; pos[k * 3 + 2] += rad[k * 3 + 2] * d;
        const sh = 0.8 + 0.26 * nz;
        col[k * 3] *= sh; col[k * 3 + 1] *= sh; col[k * 3 + 2] *= sh * 0.985;
      }
      // the two ends, closed by fans
      for (const [ri, flip] of [[0, true], [n - 1, false]]) {
        const r = rings[ri], c0 = pos.length / 3;
        C.set(r[5]);
        pos.push(r[0], r[1], r[2]); col.push(C.r, C.g, C.b); uv.push(0.5, 0.5);
        for (let j = 0; j < seg; j++) { const A = ri * S1 + j, B = A + 1; if (flip) idx.push(c0, B, A); else idx.push(c0, A, B); }
      }
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute(pos, 3));
      g.setAttribute("color", new Float32BufferAttribute(col, 3));
      g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      const nr = g.attributes.normal;   // the seam of every ring: one normal for the two copies of its first vertex
      for (let i = 0; i < n; i++) {
        const a = i * S1, b = a + seg, x = nr.getX(a) + nr.getX(b), y = nr.getY(a) + nr.getY(b), z = nr.getZ(a) + nr.getZ(b), l = Math.hypot(x, y, z) || 1;
        nr.setXYZ(a, x / l, y / l, z / l); nr.setXYZ(b, x / l, y / l, z / l);
      }
      return g;
    };
    // a small round body of one colour (the eyes, the nostrils, the wool of the poll)
    const blob = (colr, sx, sy, sz, x, y, z, wool) => {
      const g0 = new IcosahedronGeometry(1, wool ? 2 : 1), pa = g0.attributes.position, n = pa.count, cc = new Float32Array(n * 3), uvA = new Float32Array(n * 2), C = new Color(colr);
      for (let i = 0; i < n; i++) {
        let k = 1, sh = 1;
        if (wool) { const nz = vn(pa.getX(i) * 2.6 + 5, pa.getY(i) * 2.6 + 2, pa.getZ(i) * 2.6 + 8); k = 1 + 0.16 * (nz - 0.4); sh = 0.82 + 0.24 * nz; }
        pa.setXYZ(i, pa.getX(i) * sx * k + x, pa.getY(i) * sy * k + y, pa.getZ(i) * sz * k + z);
        cc[i * 3] = C.r * sh; cc[i * 3 + 1] = C.g * sh; cc[i * 3 + 2] = C.b * sh;
        uvA[i * 2] = wool ? pa.getX(i) * 9 : 0.5; uvA[i * 2 + 1] = wool ? pa.getY(i) * 9 + pa.getZ(i) * 9 : 0.5;
      }
      g0.setAttribute("color", new BufferAttribute(cc, 3));
      g0.setAttribute("uv", new BufferAttribute(uvA, 2));
      const gi = mergeVerts(g0);
      gi.computeVertexNormals();
      return gi;
    };
    // (the icosahedron comes unindexed: an index is made for it by its vertices' places, so that it merges with the tubes and shades smooth)
    function mergeVerts(g0) {
      const pa = g0.attributes.position, ca = g0.attributes.color, ua = g0.attributes.uv, map = new Map(), pos = [], col = [], uv = [], idx = [];
      for (let i = 0; i < pa.count; i++) {
        const k = Math.round(pa.getX(i) * 4000) + "," + Math.round(pa.getY(i) * 4000) + "," + Math.round(pa.getZ(i) * 4000);
        let q = map.get(k);
        if (q === undefined) { q = pos.length / 3; map.set(k, q); pos.push(pa.getX(i), pa.getY(i), pa.getZ(i)); col.push(ca.getX(i), ca.getY(i), ca.getZ(i)); uv.push(ua.getX(i), ua.getY(i)); }
        idx.push(q);
      }
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute(pos, 3));
      g.setAttribute("color", new Float32BufferAttribute(col, 3));
      g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      return g;
    }
    const xf = (g, px, py, pz, rx = 0, ry = 0, rz = 0) => { const q = g.clone(); q.applyMatrix4(new Matrix4().compose(new Vector3(px, py, pz), new Quaternion().setFromEuler(new Euler(rx, ry, rz, "YXZ")), new Vector3(1, 1, 1))); return q; };
    // ---- the parts
    const trunk = (cy, flat) => loft([
      [0, cy - 0.01, -0.57, 0.02, 0.02, WOOL, 1], [0, cy - 0.01, -0.53, 0.13, 0.15 * flat, WOOL, 1], [0, cy - 0.02, -0.45, 0.21, 0.235 * flat, WOOL, 1],
      [0, cy - 0.03, -0.3, 0.245, 0.275 * flat, WOOL, 1], [0, cy - 0.04, -0.12, 0.252, 0.287 * flat, WOOL, 1], [0, cy - 0.04, 0.08, 0.246, 0.286 * flat, WOOL, 1],
      [0, cy - 0.03, 0.26, 0.236, 0.28 * flat, WOOL, 1], [0, cy - 0.01, 0.4, 0.2, 0.25 * flat, WOOL, 1], [0, cy + 0.01, 0.5, 0.14, 0.19 * flat, WOOL, 1], [0, cy + 0.03, 0.56, 0.03, 0.04, WOOL, 1]
    ], { seg: 28 });
    const neck = (pts) => loft(pts.map(([y, z, rx, ry]) => [0, y, z, rx, ry, WOOL, 1]), { seg: 18, amp: 0.038 });
    const tail = (cy) => loft([[0, cy + 0.08, -0.5, 0.045, 0.045, WOOL, 1], [0, cy + 0.02, -0.59, 0.055, 0.05, WOOL, 1], [0, cy - 0.12, -0.63, 0.047, 0.042, WOOL, 1], [0, cy - 0.24, -0.62, 0.02, 0.02, WOOL, 1]], { seg: 10, amp: 0.02 });
    const headGeo = (() => {
      const P = [];
      P.push(loft([[0, 0, -0.07, 0.03, 0.03, FACE], [0, 0.005, -0.03, 0.082, 0.088, FACE], [0, 0.008, 0.03, 0.098, 0.103, FACE], [0, 0.002, 0.1, 0.094, 0.098, FACE],
        [0, -0.012, 0.17, 0.078, 0.086, FACE], [0, -0.024, 0.24, 0.062, 0.072, FACE], [0, -0.032, 0.3, 0.054, 0.06, MUZ], [0, -0.036, 0.34, 0.044, 0.048, MUZ],
        [0, -0.038, 0.362, 0.02, 0.022, NOSE]], { seg: 14 }));
      P.push(blob(WOOL, 0.09, 0.052, 0.098, 0, 0.074, 0.004, true));                                  // the wool of the poll
      for (const s1 of [-1, 1]) {
        // an ear: a leaf out to the side, a little down and back; its breadth along the head
        P.push(loft([[s1 * 0.07, 0.05, -0.012, 0.016, 0.014, EARC], [s1 * 0.105, 0.046, -0.018, 0.036, 0.013, EARC], [s1 * 0.16, 0.03, -0.03, 0.043, 0.011, EARC],
          [s1 * 0.205, 0.008, -0.044, 0.03, 0.008, EARC], [s1 * 0.228, -0.006, -0.05, 0.006, 0.004, EARC]], { seg: 8, ux: [0, 0, 1] }));
        P.push(blob(EYE, 0.0165, 0.0175, 0.0165, s1 * 0.084, 0.022, 0.104, false));                  // the eye
        P.push(blob(EYE, 0.007, 0.0055, 0.006, s1 * 0.017, -0.03, 0.358, false));                    // the nostril
      }
      return mergeGeometries(P);
    })();
    const legF = loft([[0, 0, 0, 0.085, 0.095, WOOL, 1], [0, -0.1, 0.005, 0.072, 0.08, WOOL, 1], [0, -0.2, 0.01, 0.05, 0.056, LEG], [0, -0.3, 0.012, 0.04, 0.044, LEG],
      [0, -0.335, 0.018, 0.044, 0.05, LEG], [0, -0.37, 0.012, 0.034, 0.038, LEG], [0, -0.5, 0.005, 0.03, 0.034, LEG], [0, -0.545, 0, 0.038, 0.042, LEG],
      [0, -0.57, 0.012, 0.033, 0.038, LEG], [0, -0.585, 0.02, 0.042, 0.05, HOOF], [0, -0.62, 0.028, 0.046, 0.056, HOOF]], { seg: 10, amp: 0.018 });
    const legH = loft([[0, 0, 0, 0.1, 0.13, WOOL, 1], [0, -0.12, -0.01, 0.085, 0.11, WOOL, 1], [0, -0.24, -0.04, 0.055, 0.068, LEG], [0, -0.33, -0.075, 0.04, 0.048, LEG],
      [0, -0.37, -0.085, 0.042, 0.05, LEG], [0, -0.41, -0.07, 0.033, 0.038, LEG], [0, -0.54, -0.045, 0.03, 0.034, LEG], [0, -0.585, -0.04, 0.038, 0.042, LEG],
      [0, -0.61, -0.028, 0.033, 0.038, LEG], [0, -0.625, -0.02, 0.042, 0.05, HOOF], [0, -0.66, -0.012, 0.046, 0.056, HOOF]], { seg: 10, amp: 0.02 });
    const FX = 0.13, FY = 0.62, FZ = 0.3, HX = 0.14, HY = 0.66, HZ = -0.33, CY = 0.83;
    const NECK_UP = [[CY + 0.05, 0.36, 0.17, 0.2], [CY + 0.15, 0.5, 0.14, 0.165], [CY + 0.25, 0.6, 0.115, 0.135], [CY + 0.33, 0.66, 0.1, 0.112]];
    const HEAD_UP = [0, CY + 0.36, 0.68];
    // ---- the whole lamb in one pose, as one geometry (for the chamber's many)
    const poses = {};
    const pose = (name) => {
      if (poses[name]) return poses[name];
      const P = [];
      if (name === "lie") {
        const cy = 0.34;
        P.push(trunk(cy, 0.93), tail(cy - 0.02));
        P.push(neck([[cy + 0.07, 0.36, 0.17, 0.2], [cy + 0.19, 0.48, 0.14, 0.165], [cy + 0.3, 0.57, 0.115, 0.135], [cy + 0.38, 0.62, 0.1, 0.112]]));
        P.push(xf(headGeo, 0, cy + 0.41, 0.64, 0.42, 0.25, 0));
        for (const s1 of [-1, 1]) {
          // the forelegs folded: the forearm forward on the floor to the knee, the hoof tucked back beside it
          P.push(loft([[s1 * 0.16, 0.1, 0.28, 0.055, 0.06, LEG], [s1 * 0.17, 0.075, 0.42, 0.045, 0.05, LEG], [s1 * 0.175, 0.062, 0.55, 0.046, 0.05, LEG], [s1 * 0.175, 0.05, 0.6, 0.02, 0.022, LEG]], { seg: 8 }));
          P.push(loft([[s1 * 0.215, 0.05, 0.5, 0.03, 0.034, LEG], [s1 * 0.22, 0.045, 0.36, 0.032, 0.036, LEG], [s1 * 0.22, 0.045, 0.3, 0.044, 0.05, HOOF], [s1 * 0.22, 0.045, 0.265, 0.02, 0.024, HOOF]], { seg: 8 }));
          // the hind legs: the hock out beside the belly, the cannon and the hoof forward along it
          P.push(loft([[s1 * 0.2, 0.16, -0.38, 0.07, 0.085, WOOL, 1], [s1 * 0.235, 0.1, -0.3, 0.05, 0.058, LEG], [s1 * 0.245, 0.062, -0.16, 0.034, 0.038, LEG], [s1 * 0.245, 0.05, -0.04, 0.036, 0.04, LEG],
            [s1 * 0.245, 0.048, 0.0, 0.044, 0.05, HOOF], [s1 * 0.245, 0.048, 0.04, 0.02, 0.024, HOOF]], { seg: 8, amp: 0.015 }));
        }
      } else {
        P.push(trunk(CY, 1), tail(CY));
        if (name === "graze") {
          P.push(neck([[CY + 0.03, 0.4, 0.17, 0.2], [CY - 0.1, 0.56, 0.135, 0.155], [CY - 0.27, 0.69, 0.108, 0.122], [CY - 0.4, 0.76, 0.094, 0.104]]));
          P.push(xf(headGeo, 0, CY - 0.43, 0.775, 1.22, 0, 0));
        } else {
          P.push(neck(NECK_UP));
          P.push(xf(headGeo, HEAD_UP[0], HEAD_UP[1], HEAD_UP[2], name === "look" ? 0.3 : 0.5, name === "look" ? 0.75 : 0, 0));
        }
        for (const s1 of [-1, 1]) {
          P.push(xf(legF, s1 * FX, FY, FZ, name === "graze" ? -0.06 * s1 : 0, 0, 0));
          P.push(xf(legH, s1 * HX, HY, HZ, 0, 0, 0));
        }
      }
      const g = mergeGeometries(P);
      g.computeBoundingSphere();
      return poses[name] = g;
    };
    // ---- the material: the colours of the vertices; small curls as the fleece's bump
    const bc = document.createElement("canvas");
    bc.width = bc.height = 256;
    {
      const q = bc.getContext("2d");
      q.fillStyle = "#808080"; q.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1500; i++) {
        const x = h3(i, 1, 2) * 256, y = h3(i, 5, 3) * 256, r = 3 + h3(i, 9, 4) * 5, a0 = h3(i, 2, 7) * 6.28;
        q.strokeStyle = h3(i, 3, 1) > 0.5 ? "rgba(215,215,215,0.75)" : "rgba(45,45,45,0.6)";
        q.lineWidth = 1.6 + h3(i, 4, 4) * 1.6;
        for (const [ox, oy] of [[0, 0], [256, 0], [-256, 0], [0, 256], [0, -256]]) { q.beginPath(); q.arc(x + ox, y + oy, r, a0, a0 + 2.2 + h3(i, 8, 8) * 2.4); q.stroke(); }
      }
    }
    const bump = new CanvasTexture(bc);
    bump.wrapS = bump.wrapT = RepeatWrapping;
    const mat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.97, metalness: 0, bumpMap: bump, bumpScale: 1.4 });
    // ---- the lamb of the service, with its joints: g > body (the trunk, the neck, the tail) > head, legs[4] (fore +x, fore -x, hind +x, hind -x)
    const bodyGeo = mergeGeometries([trunk(CY, 1), tail(CY), neck(NECK_UP)]);
    const build = () => {
      const g = new Group(), body = new Group();
      g.add(body);
      const sh = (m) => { m.castShadow = true; return m; };
      body.add(sh(new Mesh(bodyGeo, mat)));
      const head = new Group();
      head.position.set(HEAD_UP[0], HEAD_UP[1], HEAD_UP[2]);
      const hm = sh(new Mesh(headGeo, mat));
      hm.rotation.x = 0.5;   // the head's own carriage - the nose forward and down; the group's turning comes over it
      head.add(hm);
      body.add(head);
      const legs = [];
      for (const [x, y, z, gq] of [[FX, FY, FZ, legF], [-FX, FY, FZ, legF], [HX, HY, HZ, legH], [-HX, HY, HZ, legH]]) {
        const lg = new Group();
        lg.position.set(x, y, z);
        lg.add(sh(new Mesh(gq, mat)));
        body.add(lg);
        legs.push(lg);
      }
      return { g, body, head, legs };
    };
    return LAMB_KIT = { mat, pose, build };
  }
  var H = { occ, OCC, box, cyl, wall, stairs, columnGeo, colonnade, crenellate, ring, lathe, doors, uvWorld, uvWorldBox, instancify, lambKit };

