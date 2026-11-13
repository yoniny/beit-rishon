  // ===== 1.4.1 (ARK_GATES_208): "דבקו שערים" - THE ARK BROUGHT INTO THE DEVIR (Shabbat 30a; I Kings 8:3-11; II Chronicles 6:13, 6:42) =====
  // The user, 12.11.2026 21:14 ("9. אולי אפשר ליצור הדגמה"), 21:42 ("שלמה תעשה כצורת מלך ותביא לי לאישור", "תראה ענן", "4" - four
  // priests: Menachot 98b "ומנא לן דבארבעה הוו דרו להו? דכתיב ונסעו הקהתים – תרי, נשאי המקדש – נמי תרי", the two of a pair walking between
  // the staffs - "תרי גברי באמתא ופלגא לא מסתגי להו"), 22:32 (the king as King David's paintings, not red-haired; on the bronze platform as
  // Abarbanel 8:22; "הכהן תתאים לכהנים שעשית בפייסות"), 22:45 (the platform round above and square below as the Malbim; kneeling, as the
  // commentators). The figures are the Second Temple plugin's lotteries' priests (its kit, carried over below).
  // ===== ARK_FIG_208 (the user, 12.11.2026 22:32: "הכהן תתאים לכהנים שעשית בפייסות בשרשור זה!"): THE FIGURES' KIT - the lotteries'
  // priest of the Second Temple plugin (its 55-payis.js PAYIS_FIGURE4, the kit it shares as SH.priestKit with its 55-tamid.js), carried
  // over whole: the same head, face, beard, kutonet, avnet, migba'at, hands and feet, the same textures and materials. Built once, lazily.
  function ark_kit() {
    if (ark_kit.kit) return ark_kit.kit;
    const mat = (color, extra) => new MeshStandardMaterial(Object.assign({ color, roughness: 0.85 }, extra || {}));
    const mSkin = mat(0xcfa07a, { roughness: 0.8 }), mElder = mat(0xd8caa2);
    const mFlame = new MeshBasicMaterial({ color: 0xffb347 }), mMark = new MeshBasicMaterial({ color: 0xffe08a });
    // PAYIS_LIGHT_205 (12.11.2026, the user: "הכל נהיה איטי בטירוף"): the same figure in a third of the faces - the robe 40 x 30 (was 64 x 50),
    // the migbaat 56 x 30 (96 x 56), the beard 32 x 14 (46 x 22), the avnet 40 x 6 (64 x 8): twenty-one figures were 610,000 triangles
    const FS = 1.4;                                  // the figures' scale (a model choice): to the top of the head 2.23 drawn x 1.4 = a little over three amot
    // ===== PAYIS_FIGURE4 - THE PRIEST. The user, 12.11.2026: 00:42 "לכהנים היו ידיים ... האבנט צריך להיראות שזור, לא חלק ... ככה לא
    // היה נראה המגבעת. בבקשה לנסות לחפש תמונות של כהן הדיוט, ולנסות לבנות דרכן"; 00:43 the page mikdash3.co.il/limud-leshichno-a-71
    // ("אנחנו מפה"); 00:48 "גם את הפרצוף תעשה כמוהו ... את הזקן"; 01:00 "תעשה את הכל יותר חי"; 01:11 "המגבעת נראית כמו כדור גלידה.
    // הזקן כמו 6 מלפפונים ... עשית את הכתונת כמו שמלה ... מה זה על הכתפיים? הגולות האלה. האבנט ... למה הוא כפול? היה אחד ... זה אמור
    // להיות צבע אחיד ... ביקשתי לראות אנשים, לא בובות. ידיים, רגליים, פתוחות"; 01:15 (the site's drawing 200) "זה שטריימל ולא המגבעת
    // אבל הכתונת טובה".
    // Built after that site's drawings - the migba'at and the whole man after drawing 452 "כהן הדיוט לבוש 4 בגדים", the kutonet
    // after drawing 200 - each part against the Rambam (Klei HaMikdash, read in his library - qa/fs/LIB_1111.md):
    //   the migba'at - tall, a smooth egg rounded at its head, broad bands of the cloth going up aslant one on another, a band
    //     over the forehead (the site's "שיטה ב"; 8:2 "ובניו צונפין בה ככובע", 8:19 "ארכו שש עשרה אמות"; the Ramban, Shemot 28:31
    //     "ומעלה הכפלים עליו כעין מגבעת שהוא קובע"; Ibn Ezra, 28:36 "שיכסו הראש והם גבוהים");
    //   the face - eyes with lids, brows, a nose, lips, a moustache; the beard one body, from the cheeks and the jaw to the chest;
    //   the kutonet - straight, checkered ("משבצת היתה שהיא בתים בתים באריגתה", 8:16), to above the heel, its sleeves to the palm
    //     ("וארך בית יד שלה עד פס ידו", 8:17); open hands; bare feet;
    //   the avnet - one band at the elbows ("כנגד אצילי ידיו", 10:1; "רחבו כמו שלש אצבעות", 8:19), finely woven of twined threads
    //     whose colours melt into one hue - tekhelet, argaman ("הצבוע אדום"), tola'at shani and white (8:1 "רקום בצמר", 8:13) -
    //     or all white ("של בוץ", Yoma 12b).
    // MODEL CHOICES: the proportions, the features of each face, the colour and the length of each beard.
    const cnv = (w, h, rx, ry, draw) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      draw(c.getContext("2d"), w, h);
      const t = new CanvasTexture(c);
      t.wrapS = t.wrapT = RepeatWrapping;
      t.colorSpace = SRGBColorSpace;
      t.repeat.set(rx, ry);
      return t;
    };
    const rnd = (() => { let q = 20261112; return () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; }; })();   // a fixed sequence: the same priests in every run
    const TAU = Math.PI * 2;
    const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    // a smooth line through a table of [x, y]
    const spl = (tab, x) => {
      let i = 0;
      while (i < tab.length - 2 && x > tab[i + 1][0]) i++;
      const p0 = tab[Math.max(0, i - 1)], p1 = tab[i], p2 = tab[i + 1], p3 = tab[Math.min(tab.length - 1, i + 2)];
      const d = p2[0] - p1[0], t = Math.max(0, Math.min(1, (x - p1[0]) / d));
      const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * d, m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * d, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
    };
    // a surface P(u, v) - u goes round (its seam at the back; `open`: a strip, not closed), v goes up - with uv (o.tu / o.tv may
    // set them), a shade per vertex (o.c: the folds) and smooth normals
    const surf = (nu, nv, fn, open) => {
      const pos = [], uv = [], col = [], idx = [], o = { x: 0, y: 0, z: 0, c: 1, tu: 0, tv: 0 };
      for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
        o.tu = i / nu;
        o.tv = j / nv;
        o.c = 1;
        fn(i === nu && !open ? 0 : i / nu, j / nv, o);
        pos.push(o.x, o.y, o.z);
        uv.push(i === nu && !open ? 1 : o.tu, o.tv);
        col.push(o.c, o.c, o.c);
      }
      for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
        const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
      const q = new BufferGeometry();
      q.setAttribute("position", new Float32BufferAttribute(pos, 3));
      q.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      q.setAttribute("color", new Float32BufferAttribute(col, 3));
      q.setIndex(idx);
      q.computeVertexNormals();
      if (!open) {
        const n = q.attributes.normal;
        for (let j = 0; j <= nv; j++) {
          const a = j * (nu + 1), b = a + nu, x = n.getX(a) + n.getX(b), y = n.getY(a) + n.getY(b), z = n.getZ(a) + n.getZ(b), l = Math.hypot(x, y, z) || 1;
          n.setXYZ(a, x / l, y / l, z / l);
          n.setXYZ(b, x / l, y / l, z / l);
        }
      }
      return q;
    };
    const white = (q) => { q.setAttribute("color", new BufferAttribute(new Float32Array(q.attributes.position.count * 3).fill(1), 3)); return q; };
    const sph = (sx, sy, sz, ws, hs, ps, pl, ts, tl) => {
      const q = new SphereGeometry(1, ws, hs, ps === undefined ? 0 : ps, pl === undefined ? TAU : pl, ts === undefined ? 0 : ts, tl === undefined ? Math.PI : tl);
      q.scale(sx, sy, sz);
      return q;
    };
    const at = (q, x, y, z) => { q.translate(x, y, z); return q; };
    const rot = (q, rx, ry, rz) => { if (rz) q.rotateZ(rz); if (rx) q.rotateX(rx); if (ry) q.rotateY(ry); return q; };
    const flatUV = (q, u, v) => { const a = q.attributes.uv; for (let i = 0; i < a.count; i++) a.setXY(i, u, v); return q; };
    // ---------- the textures
    // the kutonet's weave: small cells, white on white
    const texRobe = cnv(128, 128, 9, 12, (c, w, h) => {
      c.fillStyle = "#fbfaf6";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#f3f1e9";
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) c.fillRect(i * 32 + 2, j * 32 + 2, 28, 28);
      c.strokeStyle = "#d9d5c9";
      c.lineWidth = 2;
      c.setLineDash([10, 6]);
      for (let i = 0; i <= 4; i++) {
        c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32, h); c.stroke();
        c.beginPath(); c.moveTo(0, i * 32); c.lineTo(w, i * 32); c.stroke();
      }
    });
    // hair: strands
    const texHair = cnv(64, 256, 3, 1, (c, w, h) => {
      c.fillStyle = "#ffffff";
      c.fillRect(0, 0, w, h);
      for (let k = 0; k < 46; k++) {
        const x0 = rnd() * w, wv = 2 + rnd() * 3, f0 = rnd() * 6;
        c.strokeStyle = "rgba(95,90,82," + (0.16 + rnd() * 0.3).toFixed(2) + ")";
        c.lineWidth = 0.8 + rnd() * 1.4;
        for (const dx of [-w, 0, w]) {
          c.beginPath();
          for (let y = 0; y <= h; y += 8) { const x = x0 + dx + Math.sin(y / 31 + f0) * wv; if (y) c.lineTo(x, y); else c.moveTo(x, y); }
          c.stroke();
        }
      }
    });
    // the avnet's weave: fine threads, twined - every row leans the other way; a thread's colour is drawn by the palette's weights,
    // so that from a little way off the colours melt into one hue
    const weave = (pal) => cnv(256, 48, 5, 1, (c, w, h) => {
      c.fillStyle = pal[0][0];
      c.fillRect(0, 0, w, h);
      const rows = 12, rh = h / rows, tot = pal.reduce((t, p) => t + p[1], 0);
      const pick = () => { let x = rnd() * tot; for (const p of pal) { x -= p[1]; if (x <= 0) return p[0]; } return pal[0][0]; };
      c.lineCap = "round";
      c.lineWidth = 3.1;
      for (let r = 0; r < rows; r++) {
        const lean = (r % 2 ? 1 : -1) * rh * 0.9, y = r * rh;
        for (let x = -8; x < w + 8; x += 4) {
          c.strokeStyle = pick();
          c.globalAlpha = 0.8 + rnd() * 0.2;
          for (const dx of [0, w, -w]) { c.beginPath(); c.moveTo(x + dx, y + 0.6); c.lineTo(x + dx + lean, y + rh - 0.6); c.stroke(); }
        }
      }
      c.globalAlpha = 1;
    });
    // the face's skin: shade about the eyes and by the nose, colour in the cheeks, the lines at the eyes' corners (the face's
    // front is at a quarter of the width); a patch of the lips' colour (the lips' own piece takes it)
    const SKIN = "#cfa07a";
    const texFace = cnv(512, 256, 1, 1, (c) => {
      c.fillStyle = SKIN;
      c.fillRect(0, 0, 512, 256);
      const cx = 128, ey = 121;
      const blob = (x, y, rx, ry, col) => {
        const gr = c.createRadialGradient(0, 0, 0, 0, 0, 1);
        gr.addColorStop(0, col);
        gr.addColorStop(1, col.replace(/[\d.]+\)$/, "0)"));
        c.save(); c.translate(x, y); c.scale(rx, ry); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.restore();
      };
      blob(cx, 104, 58, 20, "rgba(232,190,150,0.5)");
      for (const sd of [-1, 1]) {
        blob(cx + sd * 29, ey, 24, 13, "rgba(110,62,38,0.16)");
        blob(cx + sd * 40, 152, 27, 22, "rgba(200,100,82,0.34)");
        c.strokeStyle = "rgba(110,70,48,0.4)";
        c.lineWidth = 1.3;
        for (const k of [-1, 0, 1]) { c.beginPath(); c.moveTo(cx + sd * 45, ey + k * 2.5); c.lineTo(cx + sd * 54, ey + k * 6 - 1); c.stroke(); }
        c.strokeStyle = "rgba(110,62,38,0.22)";
        c.lineWidth = 5;
        c.beginPath(); c.moveTo(cx + sd * 10, ey + 2); c.lineTo(cx + sd * 12, 152); c.stroke();
      }
      c.fillStyle = "#9c5347";
      c.fillRect(372, 190, 40, 30);
    });
    // the eye: the white, the iris, the pupil and a glint (its front is at a quarter of the width)
    const texEye = cnv(128, 64, 1, 1, (c) => {
      c.fillStyle = "#f7f3ec";
      c.fillRect(0, 0, 128, 64);
      c.fillStyle = "#2d4057"; c.beginPath(); c.arc(32, 32, 11, 0, TAU); c.fill();
      c.fillStyle = "#58789c"; c.beginPath(); c.arc(32, 32, 9.4, 0, TAU); c.fill();
      c.fillStyle = "#120d0a"; c.beginPath(); c.arc(32, 32, 4.4, 0, TAU); c.fill();
      c.fillStyle = "#ffffff"; c.beginPath(); c.arc(28.6, 28.4, 2.3, 0, TAU); c.fill();
      c.beginPath(); c.arc(35.5, 35, 1, 0, TAU); c.fill();
    });
    const mRobe = mat(0xffffff, { map: texRobe, vertexColors: true, roughness: 0.92 });   // PAYIS_WHITE: one white for every priest
    const mHat = mat(0xffffff, { vertexColors: true, roughness: 0.93 });
    const mFace = mat(0xffffff, { map: texFace, roughness: 0.78 });
    const mEye = mat(0xffffff, { map: texEye, roughness: 0.18 });
    // tekhelet, argaman ("הצבוע אדום"), tola'at shani, and the white of the linen
    const mSashDyed = mat(0xffffff, { map: weave([["#3d62ab", 4.2], ["#8e1f34", 3.1], ["#c5432b", 1.3], ["#e6e1d3", 1]]), vertexColors: true, roughness: 0.88 });
    const mSashWhite = mat(0xffffff, { map: weave([["#f7f5ee", 4], ["#e0dbcc", 3], ["#ffffff", 2], ["#cfc9b7", 1]]), vertexColors: true, roughness: 0.88 });
    const mBeards = [0xf4f2ec, 0xbdbab2, 0xeae7df, 0x54402f, 0xa29e96, 0xf0eee8, 0x6d5a48].map((c) => mat(c, { map: texHair, vertexColors: true, roughness: 0.95, side: DoubleSide })), mBeardOld = mBeards[0];
    const SASHES = [];   // every avnet's mesh: dyed in the Rambam's reading, white in "של בוץ"
    // ---------- the head (its middle at HEAD_Y): an egg, narrower at the chin; the nose with its wings, the lids, the lips and the
    // ears are pieces of its skin
    const HEAD_Y = 2.075, HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1095], ER = 0.0222, HS = 1.045;
    // (the skull's distance from its axis at the angle ph - 0 is the front - and the height y)
    const headR = (ph, y) => {
      const yn = Math.max(-0.999, Math.min(0.999, y / HR[1])), j = yn < 0 ? yn * yn : 0;
      return Math.sqrt(1 - yn * yn) / Math.hypot(Math.sin(ph) / (HR[0] * (1 - 0.2 * j)), Math.cos(ph) / (HR[2] * (1 - 0.1 * j)));
    };
    const gHeadAll = (() => {
      const k = new SphereGeometry(1, 28, 20), p = k.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i), j = y < 0 ? y * y : 0;
        p.setXYZ(i, x * HR[0] * (1 - 0.2 * j), y * HR[1], z * HR[2] * (1 - 0.1 * j));
      }
      k.computeVertexNormals();
      const skin = (q) => flatUV(q, 0.75, 0.3), parts = [k];
      parts.push(skin(at(sph(0.013, 0.034, 0.02, 8, 6), 0, -0.012, 0.133)));                 // the nose: its bridge,
      parts.push(skin(at(sph(0.019, 0.017, 0.022, 10, 8), 0, -0.041, 0.146)));               // its tip,
      for (const sd of [-1, 1]) {
        parts.push(skin(at(sph(0.011, 0.01, 0.012, 6, 5), sd * 0.017, -0.047, 0.134)));      // its wings
        parts.push(skin(at(sph(0.012, 0.03, 0.02, 6, 6), sd * 0.126, 0, -0.004)));           // the ear
        // the lids: the upper one over the top of the iris, the lower one under it
        parts.push(skin(at(rot(sph(ER * 1.07, ER * 1.07, ER * 1.07, 12, 6, 0, TAU, 0, 0.74), 0.5), sd * EYE[0], EYE[1], EYE[2])));
        parts.push(skin(at(rot(sph(ER * 1.06, ER * 1.06, ER * 1.06, 12, 5, 0, TAU, 0, 0.6), Math.PI - 0.42), sd * EYE[0], EYE[1], EYE[2])));
      }
      parts.push(flatUV(at(sph(0.021, 0.0052, 0.01, 10, 6), 0, -0.0865, 0.1215), 0.766, 0.2));   // the lips
      return mergeGeometries(parts);
    })();
    const gEyes = mergeGeometries([-1, 1].map((sd) => at(sph(ER, ER, ER, 14, 10), sd * EYE[0], EYE[1], EYE[2])));
    // ---------- the hair, one piece. THE BEARD IS ONE BODY (the user: "הזקן גוש כזה", then "כמו 6 מלפפונים" - "תסתכל תמונות של
    // אנשים"): it grows from the cheeks before the ears and from the jaw, lies on the face, and under the chin it hangs and comes
    // forward to the chest, narrowing; its lower edge is uneven and its face is of strands. With it: the brows, the moustache (two
    // parts), the hair of the head's top (seen when the migba'at is lifted) and of its back
    const YJ = -0.118;
    const hairGeo = () => {
      const PM = 1.4, w2 = rnd() * 6, len = 0.165 + rnd() * 0.07, parts = [];   // PAYIS_FIGURE4B: full and rounded below
      parts.push(surf(32, 14, (u, v, o) => {
        const a = u * 2 - 1, ph = a * PM, ya = Math.abs(a), sd = 1 - v;                      // sd: 0 at the upper edge, 1 at the lower
        const yTop = -0.094 + 0.124 * Math.pow(ya, 1.3), yBot = -0.07 - len * (1 - Math.pow(ya, 5)) + 0.01 * Math.sin(15 * ph + w2) * (1 - ya);   // PAYIS_FIGURE4C
        const y = yTop + sd * (yBot - yTop);
        const strand = Math.sin(24 * ph + 5 * sd + w2), th = (0.004 + 0.03 * Math.pow(Math.sin(Math.PI * Math.min(1, sd * 1.22)), 0.9) + 0.003 * strand + 0.002 * Math.sin(39 * ph - 3 * sd)) * (1 - Math.pow(ya, 5));
        if (y >= YJ) {
          const r = headR(ph, y) + th;
          o.x = Math.sin(ph) * r;
          o.z = Math.cos(ph) * r;
        } else {
          const k = Math.min(1, (YJ - y) / 0.2), r = headR(ph, YJ) + th + 0.028 * Math.sin(Math.PI * Math.min(1, k * 1.3)) * Math.abs(Math.sin(ph));
          o.x = Math.sin(ph) * r * (1 - 0.08 * k * k);
          o.z = Math.cos(ph) * r * (1 - 0.1 * k) + 0.05 * k * Math.max(0, Math.cos(ph));
        }
        o.y = y;
        o.c = 0.87 + 0.13 * (0.5 + 0.5 * strand) - 0.05 * sd;
        o.tu = u * 1.4;
        o.tv = v;
      }, true));
      for (const sd of [-1, 1]) {
        parts.push(white(at(rot(sph(0.031, 0.0078, 0.011, 8, 5), 0, 0, -sd * 0.04), sd * EYE[0], 0.0545, 0.1255)));   // the brow
        parts.push(white(at(rot(sph(0.037, 0.0125, 0.016, 10, 6), 0, 0, -sd * 0.4), sd * 0.027, -0.066, 0.127)));     // the moustache
      }
      parts.push(white(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 20, 6, 0, TAU, 0, 1.08)));
      parts.push(white(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 14, 8, Math.PI + 0.3, Math.PI - 0.6, 1.08, 1.4)));
      return mergeGeometries(parts);
    };
    const gHairs = [hairGeo(), hairGeo(), hairGeo(), hairGeo()];   // four beards, a little different
    const headOn = (f, y, mHair, k) => {
      const hg = new Group();
      hg.position.y = y;
      hg.add(new Mesh(gHeadAll, mFace));
      hg.add(new Mesh(gEyes, mEye));
      hg.add(new Mesh(gHairs[(k || 0) % gHairs.length], mHair));
      f.add(hg);
      return hg;
    };
    // ---------- the kutonet (the site's drawing 200 - the user: "הכתונת טובה"): straight, falling from the shoulders - the body's
    // breadth and depth at each height; soft folds of the cloth below the avnet
    const BODY = [[0.1, 0.207, 0.166], [0.5, 0.205, 0.164], [1.0, 0.201, 0.16], [1.2, 0.199, 0.158], [1.33, 0.193, 0.15], [1.45, 0.197, 0.152], [1.58, 0.216, 0.158], [1.68, 0.244, 0.156], [1.745, 0.264, 0.146], [1.79, 0.242, 0.128], [1.83, 0.186, 0.11], [1.87, 0.116, 0.09], [1.9, 0.076, 0.076]];
    const bX = BODY.map((r) => [r[0], r[1]]), bZ = BODY.map((r) => [r[0], r[2]]);
    const gRobeBody = surf(40, 30, (u, v, o) => {
      const y = v < 0.6 ? 0.1 + 2 * v : 1.3 + (v - 0.6) * 1.5, a = u * TAU + Math.PI, k = Math.max(0, (1.3 - y) / 1.2);
      const fold = Math.sin(7 * a + 0.8) * 0.6 + Math.sin(11 * a + 2.1) * 0.4, m = 1 + 0.02 * k * fold;
      o.x = spl(bX, y) * m * Math.sin(a);
      o.y = y;
      o.z = spl(bZ, y) * m * Math.cos(a);
      o.c = 1 - 0.11 * k * Math.max(0, -fold);
      o.tv = (y - 0.1) / 1.8;
    });
    // an arm hanging from the shoulder (its origin), a little bent at the elbow: the sleeve to the wrist (its top is the shoulder's
    // own roundness - no ball on it)
    const SH_X = 0.252, SH_Y = 1.728, BEND = 0.2, UP = 0.36, FORE = 0.34;
    const foreAt = (q, d) => at(rot(at(q, 0, -d, 0), -BEND), 0, -UP, 0);   // a piece at the distance d along the forearm from the elbow
    const sleeveGeo = () => mergeGeometries([
      sph(0.07, 0.07, 0.07, 14, 10),
      at(new CylinderGeometry(0.07, 0.058, UP, 14), 0, -UP / 2, 0),
      at(sph(0.058, 0.058, 0.058, 12, 8), 0, -UP, 0),
      foreAt(new CylinderGeometry(0.056, 0.046, FORE, 14), FORE / 2)
    ].map(white));
    // an open hand: the palm, four fingers a little apart, the thumb (sd: the arm's side - the thumb is to the front)
    const handRaw = (sd) => {
      const parts = [sph(0.03, 0.04, 0.0125, 10, 8)];
      [-0.0215, -0.0072, 0.0072, 0.0215].forEach((x, i) => parts.push(at(rot(sph(0.0083, 0.031 - Math.abs(i - 1.4) * 0.004, 0.0083, 6, 6), 0, 0, x * 5), x * 1.25, -0.062, 0)));
      parts.push(at(rot(sph(0.0098, 0.027, 0.0098, 6, 6), 0, 0, -sd * 0.75), -sd * 0.037, -0.012, 0.004));
      const q = mergeGeometries(parts);
      q.rotateY(sd * 0.95);                // the palm toward the body, the thumb to the front
      return q;
    };
    const handOpen = (sd) => foreAt(handRaw(sd), FORE + 0.045);   // PRIEST_KIT_207: the same hand (handRaw: in its own frame, for 55-tamid.js)
    // the hand of "הצביעו": closed, one finger out
    const handPoint = () => mergeGeometries([foreAt(sph(0.03, 0.034, 0.024, 10, 8), FORE + 0.036), foreAt(new CylinderGeometry(0.0095, 0.011, 0.085, 6), FORE + 0.105)]);
    const armPlace = (q, sd) => at(rot(q, -0.04, 0, sd * 0.17), sd * SH_X, SH_Y, 0);     // the arms a little away from the body
    const gRobe = mergeGeometries([gRobeBody, armPlace(sleeveGeo(), 1)]);
    // (the skin that does not move: the neck, the left hand, the ankles and the bare feet - a little apart, the toes outward)
    const footGeo = (sd) => mergeGeometries([at(new CylinderGeometry(0.034, 0.04, 0.14, 8), sd * 0.1, 0.1, -0.01), at(rot(sph(0.043, 0.027, 0.098, 10, 6), 0, sd * 0.22, 0), sd * 0.108, 0.027, 0.095)]);
    const gSkinStill = mergeGeometries([at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), armPlace(handOpen(1), 1), footGeo(-1), footGeo(1)]);
    // (the right arm moves: it hangs, and at "הצביעו" it is stretched forward, one finger out)
    const gSleeve = sleeveGeo(), gHandOpen = handOpen(-1), gHandPoint = handPoint();
    const ARM_DOWN = [-0.04, -0.17], ARM_OUT = [-1.15, -0.05];
    // ---------- the avnet: one band at the elbows' height, lying on the kutonet
    const SY0 = 1.337, SY1 = 1.437;
    const gSash = surf(40, 6, (u, v, o) => {
      const y = SY0 + v * (SY1 - SY0), a = u * TAU + Math.PI, e = Math.sin(Math.PI * v), th = 0.003 + 0.011 * Math.pow(e, 0.35);
      o.x = (spl(bX, y) + th) * Math.sin(a);
      o.y = y;
      o.z = (spl(bZ, y) + th) * Math.cos(a);
      o.c = 0.88 + 0.12 * e;
    });
    // ---------- the migba'at (the site's drawing 452; its origin: its lower edge, over the forehead): a smooth egg, rounded at its
    // head; a band round the forehead, and above it broad bands of the cloth going up aslant, each lying on the one before it -
    // in low relief, the edge of each casting a soft shade (the user: not "כדור גלידה")
    // PAYIS_FIGURE4D: it joins the head - the lower band close on it, down to just above the ears at the sides and behind
    const HAT_H = 0.335, HAT_Y = HEAD_Y + 0.06, ARROW_Y = 2.75;
    const hatLow = [[0, 0.136], [0.03, 0.143], [0.1, 0.149], [0.22, 0.161], [0.36, 0.171]];
    const gHat = surf(56, 30, (u, v, o) => {
      const a = u * TAU + Math.PI, R = v < 0.36 ? spl(hatLow, v) : 0.171 * Math.sqrt(Math.max(0, 1 - Math.pow((v - 0.36) / 0.64, 2.3)));
      const on = sstep(0.13, 0.17, v) * (1 - sstep(0.9, 0.99, v)), f = ((4 * (u - 1.15 * v)) % 1 + 1) % 1;
      const edge = Math.exp(-(1 - f) / 0.09), line = Math.exp(-Math.pow((v - 0.14) / 0.012, 2)), saw = f < 0.9 ? 0.5 - f / 0.9 : (f - 0.9) / 0.1 - 0.5;
      const r = R + on * 0.0075 * saw - 0.003 * line;
      o.x = r * Math.sin(a);
      o.y = v * HAT_H - 0.034 * sstep(0.15, 0.6, 0.5 - 0.5 * Math.cos(a)) * Math.pow(1 - v, 3);
      o.z = r * Math.cos(a) * 1.06;
      o.c = (1 - on * (0.3 * edge + 0.05 * f)) * (1 - 0.22 * line);
    });
    const gCap = sph(HR[0] * 1.1, HR[1] * 1.1, HR[2] * 1.1, 16, 5, 0, TAU, 0, 1.15);   // the elder's cap
    const gFlame = new ConeGeometry(0.2, 0.7, 8); gFlame.translate(0, 0.35, 0);
    const gArrowHead = new ConeGeometry(0.2, 0.4, 12); gArrowHead.rotateX(Math.PI);   // the point down
    const gArrowShaft = new CylinderGeometry(0.065, 0.065, 0.36, 8);
    const mArrow = new MeshBasicMaterial({ color: 0xffc83a });
    const gStick = new CylinderGeometry(0.04, 0.04, 1.3, 6); gStick.translate(0, 0.65, 0);
    // a standing figure: the group's +z is the way it faces; hat = the migba'at (its own object: the appointed one lifts it);
    // hand = the right arm: `hand.visible = true` stretches it forward, one finger out ("הצביעו")
    // PRIEST_KIT_207 (12.11.2026 19:28, the user: "שים לב להתאים את הדמויות לאלו שעשית בשרשור הזה"): this priest's parts, for the figures
    // of the morning's service (55-tamid.js) - the same geometries and materials, shared (nothing is built twice; his figures below unchanged)
    return (ark_kit.kit = { FS, HEAD_Y, HAT_Y, SH_X, SH_Y, UP, FORE, HR, HS, EYE, ER, TAU, rnd, sstep, spl, surf, sph, at, rot, white, flatUV, cnv,
      BODY, bX, bZ, gRobeBody, gSash, gHat, gCap, headOn, hairGeo, handRaw, footGeo, mat, mRobe, mSkin, mHat, mFace, mEye, mSashDyed, mSashWhite,
      mBeards, texHair });
  }
  // ARK_FIG_208: the kit's arms in amot (as the Second Temple's 55-tamid.js makeFigKit): the sleeve from the shoulder to the elbow, the
  // forearm, the open hand; the feet; the neck
  function ark_kitArms() {
    if (ark_kitArms.kg) return ark_kitArms.kg;
    const K = ark_kit(), FS = K.FS, sc = (q, s) => q.scale(s, s, s), W1 = (q) => K.white(q);
    const upper = (up) => sc(mergeGeometries([W1(K.sph(0.07, 0.07, 0.07, 14, 10)), W1(K.at(new CylinderGeometry(0.07, 0.058, up / FS, 14), 0, -up / FS / 2, 0)),
      W1(K.at(K.sph(0.058, 0.058, 0.058, 12, 8), 0, -up / FS, 0))]), FS);
    const fore = (fo) => sc(W1(K.at(new CylinderGeometry(0.056, 0.046, fo / FS, 14), 0, -fo / FS / 2, 0)), FS);
    const hand = (side, fo) => sc(K.at(K.handRaw(side), 0, -(fo / FS + 0.045), 0), FS);
    const foot = (side) => sc(K.footGeo(side).translate(-side * 0.1, 0, 0), FS);
    const P = { sx: K.SH_X * FS, sy: K.SH_Y * FS, up: K.UP * FS, fo: K.FORE * FS };
    return (ark_kitArms.kg = { P, upP: upper(P.up), foP: fore(P.fo), handP: { 1: hand(1, P.fo), "-1": hand(-1, P.fo) }, foot: { 1: foot(1), "-1": foot(-1) },
      neck: K.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0) });
  }
  // the arms' poses, [shoulder x, abduct, elbow] as 55-tamid.js POSES (a negative x lifts the arm forward): hanging; and the hand on the
  // staff that lies on the shoulder, before it (solved for a staff 0.3 off the body's middle, 2.62 over the floor - "בכתף ישאו", Numbers 7:9)
  const ARK_POSE = { stand: [0.05, 0.08, -0.15], staff: [-0.93, -0.2, -2.25] };
  function ark_setArm(A, v, side) { A.sh.rotation.x = v[0]; A.sh.rotation.z = side * v[1]; A.el.rotation.x = v[2]; }
  // a priest (the lotteries' priest): white kutonet, the avnet of colours, the migba'at; n - which of the beards
  function ark_priestFig(n) {
    const K = ark_kit(), KG = ark_kitArms(), FS = K.FS;
    const g = new Group(), lean = new Group();
    g.name = "arkPriest";
    g.add(lean);
    const S = new Group();
    S.scale.setScalar(FS);
    lean.add(S);
    const body = new Mesh(K.gRobeBody, K.mRobe);
    body.castShadow = true;
    S.add(body);
    S.add(new Mesh(KG.neck, K.mSkin));
    S.add(new Mesh(K.gSash, K.mSashDyed));
    const hg = K.headOn(S, K.HEAD_Y, K.mBeards[[3, 1, 6, 4][n % 4]], n);
    hg.rotation.set(0, (((n * 0.618) % 1) - 0.5) * 0.3, 0);
    const hat = new Mesh(K.gHat, K.mHat);
    hat.position.y = K.HAT_Y;
    hat.rotation.y = hg.rotation.y + (((n * 0.37) % 1) - 0.5) * 0.9;
    S.add(hat);
    const arm = (side) => {
      const sh = new Group();
      sh.position.set(side * KG.P.sx, KG.P.sy, 0);
      lean.add(sh);
      const up = new Mesh(KG.upP, K.mRobe);
      up.castShadow = true;
      sh.add(up);
      const el = new Group();
      el.position.y = -KG.P.up;
      sh.add(el);
      const fo = new Mesh(KG.foP, K.mRobe);
      fo.castShadow = true;
      el.add(fo);
      el.add(new Mesh(KG.handP[side], K.mSkin));
      return { sh, el };
    };
    const L = arm(1), R = arm(-1);
    const fl = new Mesh(KG.foot[1], K.mSkin), fr = new Mesh(KG.foot[-1], K.mSkin);
    fl.position.x = 0.1 * FS;
    fr.position.x = -0.1 * FS;
    g.add(fl, fr);
    ark_setArm(L, ARK_POSE.stand, 1);
    ark_setArm(R, ARK_POSE.stand, -1);
    return { g, lean, L, R, fl, fr };
  }
  // THE KING (the user, 12.11.2026 22:32: "דמות שלמה... תחפש באינטרנט דוד המלך ותעשה כמוהו רק לא גינגי"): as the paintings of King David -
  // a bearded king, a crown of gold with points, royal garments - on the priests' body (the same head, face and hands); his hair and beard
  // dark. KNEELING, his palms spread toward heaven: 22:45 ("אז תהפוך") after the commentators - "המלך כיון שכרע שוב אינו זוקף" (Berachot
  // 34b on I Kings 8:54); Ralbag 8:54 "כרע על ברכיו מהתחלת תפלתו עד כלותו"; Abarbanel 8:22 "שהיה כורע על ברכיו כל זמן התפלה"; the verse
  // 8:54 "מכרע על ברכיו וכפיו פרשות השמים". The garments: "בלבוש מלכות תכלת וחור ועטרת זהב גדולה ותכריך בוץ וארגמן" (Esther 8:15) - a
  // robe of tekhelet, a mantle of argaman bordered with gold (model choices: colours, cut, the crown's form). Front +z.
  function ark_kingFig(M2) {
    const K = ark_kit(), KG = ark_kitArms(), FS = K.FS, DROP = 0.5;   // kneeling: the body half a figure-unit (0.7 amah) lower, the shins behind
    const g = new Group();
    g.name = "arkKing";
    const S = new Group();
    S.scale.setScalar(FS);
    g.add(S);
    const tRobe = K.cnv(64, 64, 5, 8, (c, w, h) => {
      c.fillStyle = "#2d4d99";
      c.fillRect(0, 0, w, h);
      c.strokeStyle = "rgba(214,184,96,0.42)";
      c.lineWidth = 1.3;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { c.beginPath(); c.arc(i * 16 + 8, j * 16 + 8, 3.4, 0, Math.PI * 2); c.stroke(); }
    });
    const mRobeK = K.mat(0xffffff, { map: tRobe, vertexColors: true, roughness: 0.68 });
    const tMantle = K.cnv(256, 256, 1, 1, (c, w, h) => {
      c.fillStyle = "#6c1c3b";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < w; i += 9) c.fillRect(i, 0, 3, h);
      c.fillStyle = "#d4ab48";
      c.fillRect(0, 0, 13, h);
      c.fillRect(w - 13, 0, 13, h);
      c.fillRect(0, h - 13, w, 13);
      c.fillStyle = "#8a6a1e";
      c.fillRect(13, 0, 2, h);
      c.fillRect(w - 15, 0, 2, h);
      c.fillRect(0, h - 15, w, 2);
    });
    const mMantle = K.mat(0xffffff, { map: tMantle, vertexColors: true, roughness: 0.74, side: DoubleSide });
    const mHairK = K.mat(0x2a1c12, { map: K.texHair, vertexColors: true, roughness: 0.95, side: DoubleSide });
    const GOLD = M2.gold;
    const sp = (tab, y) => K.spl(tab, y);
    // the robe of a kneeling man: above the hips as the priest's kutonet (DROP lower); below them it falls over the thighs to the floor
    // and lies back over the shins and the feet
    const gKneel = K.surf(40, 34, (u, v, o) => {
      const yk = 0.02 + v * (1.9 - DROP - 0.02), a = u * K.TAU + Math.PI, ca = Math.cos(a), sa = Math.sin(a);
      const low = Math.max(0, (0.8 - yk) / 0.8), fold = (Math.sin(7 * a + 0.8) * 0.6 + Math.sin(11 * a + 2.1) * 0.4) * low;
      let xw, zf, zb;
      if (yk >= 0.5) { xw = sp(K.bX, yk + DROP); zf = zb = sp(K.bZ, yk + DROP); }
      else {
        const s = (0.5 - yk) / 0.48;
        xw = sp(K.bX, 1.0) + 0.085 * s;
        zf = sp(K.bZ, 1.0) + 0.08 * s;
        zb = sp(K.bZ, 1.0) + 0.43 * Math.pow(s, 1.3);
      }
      o.x = xw * sa * (1 + 0.03 * fold);
      o.z = (ca >= 0 ? zf : zb) * ca * (1 + 0.03 * fold);
      o.y = yk;
      o.c = 1 - 0.14 * Math.max(0, -fold);
      o.tv = yk / 1.4;
    });
    const robe = new Mesh(gKneel, mRobeK);
    robe.castShadow = true;
    S.add(robe);
    // the mantle: from the shoulders round the back and the sides, down to the floor and lying behind him
    const gMantle = K.surf(30, 30, (u, v, o) => {
      const a = Math.PI + (u - 0.5) * 2.85, ca = Math.cos(a), sa = Math.sin(a);
      const yk = 0.025 + v * (1.79 - DROP - 0.025);
      let xw, zw;
      if (yk >= 0.5) { const ys = Math.min(1.79, yk + DROP); xw = sp(K.bX, ys) + 0.035 + 0.035 * (1 - v); zw = sp(K.bZ, ys) + 0.04 + 0.045 * (1 - v); }
      else { const s = (0.5 - yk) / 0.475; xw = sp(K.bX, 1.0) + 0.105 + 0.11 * s; zw = sp(K.bZ, 1.0) + 0.085 + 0.5 * Math.pow(s, 1.3); }
      const fold = Math.sin(9 * a + 1.3) * (1 - v) * 0.028;
      o.x = (xw + fold) * sa;
      o.z = (zw + fold) * ca;
      o.y = yk;
      o.c = 0.88 + 0.12 * Math.sin(9 * a + 1.3);
      o.tu = u;
      o.tv = v;
    }, true);
    const mantle = new Mesh(gMantle, mMantle);
    mantle.castShadow = true;
    S.add(mantle);
    // what stands above the hips, as on the priest, DROP lower: the neck, a belt of gold, a collar of gold, the head with the crown
    const U = new Group();
    U.position.y = -DROP;
    S.add(U);
    U.add(new Mesh(KG.neck, K.mSkin));
    U.add(new Mesh(K.gSash, GOLD));
    const collar = new Mesh(new TorusGeometry(0.112, 0.02, 8, 28), GOLD);
    collar.rotation.x = Math.PI / 2;
    collar.scale.set(1, 0.84, 1);
    collar.position.y = 1.855;
    U.add(collar);
    const hg = K.headOn(U, K.HEAD_Y, mHairK, 2);
    const crown = new Group();
    const band = new Mesh(new CylinderGeometry(0.152, 0.145, 0.072, 32, 1, true), GOLD);
    band.position.y = 0.112;
    crown.add(band);
    const ptG = new ConeGeometry(0.03, 0.085, 4), ballG = new SphereGeometry(0.014, 8, 6), gemG = new SphereGeometry(0.0125, 8, 6);
    const RED = K.mat(0xb3122e, { roughness: 0.25, emissive: 0x3a0610 }), GREEN = K.mat(0x1f7a3d, { roughness: 0.25, emissive: 0x062a12 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * K.TAU, x = Math.sin(a), z = Math.cos(a);
      const pt = new Mesh(ptG, GOLD);
      pt.position.set(x * 0.149, 0.19, z * 0.149);
      pt.rotation.y = a;
      crown.add(pt);
      const ball = new Mesh(ballG, GOLD);
      ball.position.set(x * 0.149, 0.238, z * 0.149);
      crown.add(ball);
      const b2 = a + Math.PI / 8, gem = new Mesh(gemG, i % 2 ? GREEN : RED);
      gem.position.set(Math.sin(b2) * 0.152, 0.112, Math.cos(b2) * 0.152);
      crown.add(gem);
    }
    crown.scale.set(1, 1, 1.08);
    hg.add(crown);
    // the arms, spread toward heaven, the palms up
    const arm = (side) => {
      const sh = new Group();
      sh.position.set(side * KG.P.sx, KG.P.sy - DROP * FS, 0);
      g.add(sh);
      const up = new Mesh(KG.upP, mRobeK);
      up.castShadow = true;
      sh.add(up);
      const el = new Group();
      el.position.y = -KG.P.up;
      sh.add(el);
      el.add(new Mesh(KG.foP, mRobeK));
      const cuff = new Mesh(new TorusGeometry(0.068, 0.012, 6, 18), GOLD);
      cuff.rotation.x = Math.PI / 2;
      cuff.position.y = -KG.P.fo + 0.03;
      el.add(cuff);
      const hand = new Mesh(KG.handP[side], K.mSkin);
      hand.rotation.y = side * Math.PI / 2;
      el.add(hand);
      return { sh, el, hand };
    };
    const L = arm(1), R = arm(-1);
    const pray = (v) => { ark_setArm(L, v, 1); ark_setArm(R, v, -1); };
    pray(ARK_KING_PRAY);
    return { g, L, R, pray, crown };
  }
  const ARK_KING_PRAY = [-1.95, 0.55, -0.3];
  // SOLOMON'S BRONZE PLATFORM (II Chr 6:13 "כי עשה שלמה כיור נחשת ויתנהו בתוך העזרה חמש אמות ארכו וחמש אמות רחבו ואמות שלוש קומתו
  // ויעמד עליו ויברך על ברכיו"). KIYOR_RALBAG_208 (the user, 13.11.2026 01:3x: "כמלבי״ם: עשר על עשר"): its form and measure as the
  // Malbim there (3364, line 147): "ומ״ש חמש אמות ארכו היינו מן האמצע, כי היה למעלה עגול ולמטה מרובע, והיה המרובע נחלק לשתים, ממקום
  // שבא העגול עד קצהו, והיו חמש אמות לכל צד" - five from the middle to every side: 10 x 10, a square below and a round top, 3 high in
  // all. (Until this change 5 x 5 - against the Malbim's own words; NOT one of the stands, which are 4 x 4 "על כתף הבית", I Kings 7:27, 39.)
  // MODEL CHOICES: the square's height (2) and the round top's (1), the top's breadth (9.2), the frames on the faces.
  function ark_platform(M2) {
    const g = new Group();
    g.name = "arkKiyor";
    const br = M2.bronze;
    const box = (w, h, d, x, y, z) => { const m = new Mesh(new BoxGeometry(w, h, d), br); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    const S = 10, H = S / 2;
    box(S, 2, S, 0, 1, 0);
    for (const s of [-1, 1]) {            // the frames on its four faces, a little proud
      for (const y of [0.12, 1.88]) { box(S + 0.08, 0.16, 0.08, 0, y, s * (H + 0.02)); box(0.08, 0.16, S + 0.08, s * (H + 0.02), y, 0); }
      for (const t of [-(H - 0.08), -H / 2, 0, H / 2, H - 0.08]) { box(0.16, 1.9, 0.08, t, 1, s * (H + 0.02)); box(0.08, 1.9, 0.16, s * (H + 0.02), 1, t); }
    }
    const top = new Mesh(new CylinderGeometry(4.6, 4.75, 1, 64), br);
    top.position.y = 2.5;
    top.castShadow = top.receiveShadow = true;
    g.add(top);
    return g;
  }
  // KIYOR_RALBAG_208 (the user, 13.11.2026 01:36: "תעשה כרלבג"; and on the question where - "בחצר החיצונה, מול השער"): the Ralbag
  // (I Kings 8:22; 3645, line 350): "אחשוב שהיה עומד בעזרה גדולה שהיא עזרת ישראל... והבאור הראשון הוא יותר נכון" - not in the court
  // of the priests (the Abarbanel's "שבא בחצר הכהנים לפני מזבח הנחשת" - the card's "בקצרה"). So the platform stands OUTSIDE the inner
  // court, in the outer court (its floor MNT_WC_Y above the mount), before the inner court's east gate, on the house's axis, his face
  // west to the house through the gate; east of the gate's steps (x 98.5..101.5) and of the king's "עמוד" (MNT_AMUD, x 106, z 8 - which
  // Rashi, II Chr 23:13, likens to this platform: "עומד על עמודו. כדאמר ויעמד המלך על העמוד, כי עשה שלמה כיור נחשת וגו׳").
  const ARK_KIYOR = { x: 115, z: 0 };   // model choice: its place in that court (x 110..120)
  const ark_kiyorY = (LV) => (LV.HAR || 0) + (typeof MNT_WC_Y === "number" ? MNT_WC_Y : 3);
  async function buildArk(ctx) {
    const M2 = ctx.M, LV = ctx.LV;
    const g = new Group();
    g.name = "arkGates";
    g.visible = false;
    ctx.root.add(g);
    ctx.layers.arkGates = g;
    // the preview for the user's approval: the king on his platform, and the four priests carrying the ark in the court before the steps
    const pv = new Group();
    pv.name = "arkPreview";
    pv.visible = false;
    ctx.root.add(pv);
    let pvBuilt = false;
    const buildPreview = () => {
      pvBuilt = true;
      const plat = ark_platform(M2);
      plat.position.set(ARK_KIYOR.x, ark_kiyorY(LV), ARK_KIYOR.z);
      pv.add(plat);
      const king = ark_kingFig(M2);
      king.g.position.set(ARK_KIYOR.x, ark_kiyorY(LV) + 3, ARK_KIYOR.z);
      king.g.rotation.y = -Math.PI / 2;
      pv.add(king.g);
      const A = ctx.shared.arkParts, X = 34, Y = LV.AZ;
      const ark = new Group();
      if (A) {
        const box = new Group();
        for (const o of A.body) { const c = o.clone(true); c.visible = true; box.add(c); }
        box.position.set(-A.x, -A.y0, 0);
        ark.add(box);
        const sg = new CylinderGeometry(0.11, 0.11, 1, 10);
        sg.rotateZ(Math.PI / 2);
        for (const s of [-1, 1]) { const m = new Mesh(sg, A.staffMat); m.position.set(0, A.h / 2, s * A.staffZ); m.scale.x = 5.2; ark.add(m); }
      }
      ark.position.set(X, Y + 2.62 - 0.75, 0);
      pv.add(ark);
      let n = 0;
      for (const dx of [-1.6, 1.6]) for (const s of [-1, 1]) {
        const p = ark_priestFig(n++);
        p.g.position.set(X + dx, Y, s * 1.1);
        p.g.rotation.y = -Math.PI / 2;
        ark_setArm(s > 0 ? p.L : p.R, ARK_POSE.staff, s > 0 ? 1 : -1);
        pv.add(p.g);
      }
    };
    ctx.shared.arkGates = {
      preview(on) { if (on && !pvBuilt) buildPreview(); pv.visible = !!on; return pv.visible; }
    };
    // ======================= THE DEMONSTRATION =======================
    // A walk of the eye (ctx.shared.walk, 50-heichal.js: keys, captions, pause) and, on its clock, the scene: the four priests carry a copy
    // of the ark (the model's own pieces, cloned) from the ulam's doorway down the heichal to the devir's doors; the doors are stuck; the
    // eye goes out to Solomon, kneeling on his platform before the altar, his palms spread (the three sayings of Shabbat 30a); "מיד נענה" -
    // back in, the doors open; the ark is carried in and set on the stone under the cherubim; the priests come out (the front pair round the
    // staffs' west ends - they walked between them); "ויארכו הבדים" - the staffs grow to the model's own; "והענן מלא את בית ה׳" - a cloud
    // fills the heichal from the devir's doorway out, as the priests leave it. Everything goes back as it was at the end or at any stop.
    // MODEL CHOICES: the timing; the eye's places; the staffs' length while carried (5.2); the priests' places (two before the ark and two
    // after it, between the staffs - Menachot 98b); the way the front pair comes out; the cloud's form; the procession starts in the
    // ulam's doorway (on the steps the ark would tilt); the heichal's vessels are taken away while the ark passes (the user, 22:32 "7. כן":
    // in both layouts they stand in its way); the parochet is not hung while the doors stand shut (it returns at the end).
    const A = ctx.shared.arkParts;
    const W = () => ctx.shared.walk;
    const F = LV.HEI, XE = CO.xKodeshE, SH = 2.62, CARRY = 5.2;
    const hr = (x) => { const S = ctx.shared.houseSlope; return S && typeof S.at === "function" ? S.at(x) : 0; };
    const floorAt = (x) => (x > CO.xUlamE ? LV.AZ + Math.max(0, Math.min(6, 24.5 - x)) : x >= XE ? F : F + hr(x));
    const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
    const glide = (a, b, t0, t1, t, e) => {      // from a to b in [t0, t1], easing in and out over e seconds (a trapezoid of speed)
      if (t <= t0) return a;
      if (t >= t1) return b;
      const T = t1 - t0, ee = Math.min(e, T / 2), v = 1 / (T - ee), u = t - t0;
      const s = u < ee ? 0.5 * v * u * u / ee : u > T - ee ? 1 - 0.5 * v * (T - u) * (T - u) / ee : 0.5 * v * ee + v * (u - ee);
      return a + (b - a) * s;
    };
    // SEU_SHEARIM_208 (the user, 13.11.2026 00:53: "תחפש את השיר שאו שערים ותוסיף בקטע של הכתוביות שאו שערים"): the whole of
    // "שאו שערים" as the Gemara tells it (Shabbat 30a; Psalms 24:7-10) - 7.5 seconds more at the king, every time after them later by as much
    const T = { walk1: 19.5, open0: 53.8, open1: 56.3, enter1: 62.8, lower1: 64.3, ext0: 67.0, ext1: 70.0, cloud0: 72.5, cloud1: 79.5, end: 86.5 };
    const X0 = 16.8, XS = (CO.xKodeshW || -43.5) + 2.7, AX = A ? A.x : -58.5;
    const arkX = (t) => (t < T.open1 ? glide(X0, XS, 0, T.walk1, t, 1.4) : glide(XS, AX, T.open1, T.enter1, t, 1.2));
    const D = { built: false, run: false, cloudWas: true, saved: null, apply: null };
    const build = () => {
      if (D.built || !A) return;
      D.built = true;
      // the procession: the ark's copy and its staffs; the four priests
      const arkM = new Group();
      arkM.name = "arkGatesArk";
      const box = new Group();
      for (const o of A.body) { const c = o.clone(true); c.visible = true; box.add(c); }
      box.position.set(-A.x, -A.y0, 0);
      arkM.add(box);
      const sg = new CylinderGeometry(0.11, 0.11, 1, 10);
      sg.rotateZ(Math.PI / 2);
      for (const s of [-1, 1]) { const m = new Mesh(sg, A.staffMat); m.position.set(0, A.h / 2, s * A.staffZ); m.scale.x = CARRY; m.castShadow = true; arkM.add(m); }
      g.add(arkM);
      const P = [];
      let n = 0;
      for (const front of [true, false]) for (const s of [-1, 1]) {
        const p = ark_priestFig(n++);
        p.front = front;
        p.s = s;
        p.staffArm = s > 0 ? p.L : p.R;
        p.freeArm = s > 0 ? p.R : p.L;
        p.side = s > 0 ? 1 : -1;
        // the way out (after the ark is set down): the pair behind it straight out between the staffs; the pair before it round the
        // staffs' west ends and out beside them; at the end they stand in the ulam, turned to the house
        p.path = front
          ? [[AX - 1.6, s * 1.1], [AX - 3.6, s * 1.1], [AX - 3.6, s * 2.3], [8.0, s * 2.3], [8.6, s * 3.4]]
          : [[AX + 1.6, s * 1.1], [AX + 2.8, s * 0.62], [9.6, s * 0.62], [10.4, s * 1.6]];
        p.len = [0];
        for (let i = 1; i < p.path.length; i++) p.len.push(p.len[i - 1] + Math.hypot(p.path[i][0] - p.path[i - 1][0], p.path[i][1] - p.path[i - 1][1]));
        p.v = front ? 4.4 : 4.0;
        g.add(p.g);
        P.push(p);
      }
      // the extending staffs: in the house's sloping group, as the model's own (the same shear) - they grow to them
      const slope = ctx.shared.houseSlope && ctx.shared.houseSlope.group;
      const ext = [-1, 1].map((s) => { const m = new Mesh(sg, A.staffMat); m.position.set(0, A.y0 + A.h / 2, s * A.staffZ); m.visible = false; m.castShadow = true; (slope || g).add(m); return m; });
      // the king on his platform, in the outer court before the inner court's east gate (KIYOR_RALBAG_208), his face to the house
      const plat = ark_platform(M2);
      plat.position.set(ARK_KIYOR.x, ark_kiyorY(LV), ARK_KIYOR.z);
      g.add(plat);
      const king = ark_kingFig(M2);
      king.g.position.set(ARK_KIYOR.x, ark_kiyorY(LV) + 3, ARK_KIYOR.z);
      king.g.rotation.y = -Math.PI / 2;
      g.add(king.g);
      // the cloud of the heichal: puffs as the devir's (70-ui.js), born as the front passes them, from the devir's doorway out
      const KH = CO.HOUSE_H || 30;
      let seed = 5;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const puffs = [];
      for (let ix = 0; ix < 9; ix++) for (let iz = 0; iz < 4; iz++) for (let iy = 0; iy < 4; iy++) {
        const x = -41.6 + ix * 4.6 + (rnd() - 0.5) * 1.4, z = -6.9 + iz * 4.6 + (rnd() - 0.5) * 1.4, r = 3.4 + rnd() * 1.5;
        const y = F + hr(x) + 1.0 + r * 0.9 + iy * ((KH - 2.5 - 1.8 * r) / 3) + (rnd() - 0.5) * 1.2;
        puffs.push({ x, y: Math.min(y, F + KH - r * 0.8), z, r, ph: rnd() * 6.28, tb: T.cloud0 + ((x + 44) / 40.5) * (T.cloud1 - T.cloud0 - 1) + rnd() * 0.9 });
      }
      const cloudMat = new MeshLambertMaterial({ color: 0xf1f3f7, emissive: 0x555a68 });
      const cloud = new InstancedMesh(new IcosahedronGeometry(1, 2), cloudMat, puffs.length);
      cloud.name = "arkGatesCloud";
      cloud.frustumCulled = false;
      cloud.userData.noPick = true;
      cloud.visible = false;
      g.add(cloud);
      Object.assign(D, { arkM, P, ext, plat, king, puffs, cloud, m4: new Matrix4(), q: new Quaternion(), v3: new Vector3(), s3: new Vector3() });
    };
    // the doors of the devir (both readings' leaves): closed01 0 = open as the model has them, 1 = shut ("דבקו"); a shake toward opening
    const doors = (c01, shake) => {
      const DD = ctx.shared.devirDoor;
      if (!DD || typeof DD.parts !== "function") return;
      for (const k of DD.keys) {
        const Pp = DD.parts(k);
        if (!Pp) continue;
        for (const h of Pp.hinges) {
          const shut = -h.s * Math.PI / 2;
          h.hinge.rotation.y = h.open + (shut - h.open) * c01 + h.s * shake;
          h.hinge.scale.x = 1 + (Pp.pivZ / 3 - 1) * c01;
        }
      }
    };
    const curtain = (on) => {
      const DD = ctx.shared.devirDoor;
      if (DD && typeof DD.parts === "function") for (const k of DD.keys) { const Pp = DD.parts(k); if (Pp) for (const m of Pp.curtain) m.visible = on; }
      for (const m of A.swell) m.visible = on;
    };
    const original = (body, staffs) => { for (const o of A.body) o.visible = body; for (const o of A.staffs) o.visible = staffs; };
    // the labels of the heichal's vessels go with them (a layer of their own, on while the demonstration is off)
    const offL = new Group();
    offL.name = "arkGatesOff";
    ctx.layers.arkGatesOff = offL;
    const VESSEL_LABELS = ["מנורת משה", "אבן שלוש המעלות (תמיד ג, ט)", "עשר המנורות", "שולחן משה", "עשרה השולחנות", "מזבח הזהב", "אבן", "ארז", "זהב", "הפרוכת"];
    let labelsTagged = false;
    const tagLabels = () => {
      if (labelsTagged) return;
      const lg = ctx.root.getObjectByName("labels");
      if (!lg) return;
      labelsTagged = true;
      for (const spr of lg.children) {
        const l = spr.userData && spr.userData.label;
        if (!l || VESSEL_LABELS.indexOf(l.text) < 0) continue;
        const L = spr.userData.layers ? spr.userData.layers.slice() : [];
        if (L.indexOf("arkGatesOff") < 0) L.push("arkGatesOff");
        spr.userData.layers = L;
      }
    };
    let styleEl = null;
    const pillsOff = (on) => {
      if (!styleEl) { styleEl = document.createElement("style"); styleEl.textContent = "body.tm-arkdemo .tm-pill{display:none!important}"; document.head.appendChild(styleEl); }
      document.body.classList.toggle("tm-arkdemo", !!on);
    };
    // the scene at demo second t (also a still frame for checks: ctx.shared.arkGates.at(t))
    const pathAt = (p, d) => {
      const L = p.len, last = L.length - 1;
      if (d >= L[last]) { const a = p.path[last - 1], b = p.path[last]; return [b[0], b[1], Math.atan2(b[0] - a[0], b[1] - a[1]), true]; }
      let i = 1;
      while (i < last && d > L[i]) i++;
      const a = p.path[i - 1], b = p.path[i], u = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[0] - a[0], b[1] - a[1]), false];
    };
    const walkPose = (p, ph, moving, holding, hold01) => {
      const FS = 1.4, sw = Math.sin(ph) * moving;
      if (holding) {
        const st = ARK_POSE.staff, sd = ARK_POSE.stand, k = hold01;
        ark_setArm(p.staffArm, [st[0] + (sd[0] - st[0]) * (1 - k), st[1] + (sd[1] - st[1]) * (1 - k), st[2] + (sd[2] - st[2]) * (1 - k)], p.side);
      } else ark_setArm(p.staffArm, [0.32 * sw, 0.08, -0.25 * moving - 0.15 * (1 - moving)], p.side);
      ark_setArm(p.freeArm, [-0.32 * sw, 0.08, -0.25 * moving - 0.15 * (1 - moving)], -p.side);
      p.lean.position.y = Math.abs(Math.cos(ph)) * 0.035 * moving;
      p.fl.position.z = 0.17 * sw;
      p.fr.position.z = -0.17 * sw;
      void FS;
    };
    D.apply = (t) => {
      if (!D.built) return;
      // the ark
      const ax = arkX(t), moving = (t > 0.05 && t < T.walk1 - 0.05) || (t > T.open1 + 0.05 && t < T.enter1 - 0.05) ? 1 : 0;
      const dist = X0 - ax, ph = (dist * Math.PI) / 0.85;
      const bob = Math.abs(Math.cos(ph)) * 0.035 * moving;
      const carryY = floorAt(ax) + SH - A.h / 2 + bob;
      const endY = A.y0 + hr(AX);
      const ay = t <= T.enter1 ? carryY : carryY + (endY - carryY) * ease((t - T.enter1) / (T.lower1 - T.enter1));
      D.arkM.position.set(ax, ay, 0);
      const set = t >= T.lower1;
      D.arkM.visible = !set;
      original(set, t >= T.ext1);
      const ex = t >= T.lower1 && t < T.ext1;
      const k = ease((t - T.ext0) / (T.ext1 - T.ext0));
      const x0 = (AX - CARRY / 2) + (A.staffX0 - (AX - CARRY / 2)) * k, x1 = (AX + CARRY / 2) + (A.staffX0 + A.staffLen - (AX + CARRY / 2)) * k;
      for (const m of D.ext) { m.visible = ex; m.position.x = (x0 + x1) / 2; m.scale.x = x1 - x0; }
      // the doors
      const c01 = t < T.open0 ? 1 : 1 - ease((t - T.open0) / (T.open1 - T.open0));
      const sh = t > 19.8 && t < 23.4 ? 0.022 * Math.abs(Math.sin(t * 2 * Math.PI * 2.6)) * Math.min(1, (t - 19.8) / 0.4, (23.4 - t) / 0.4) : 0;
      doors(c01, sh);
      // the priests
      for (const p of D.P) {
        if (t <= T.lower1) {
          const px = ax + (p.front ? -1.6 : 1.6), pz = p.s * 1.1;
          p.g.position.set(px, floorAt(px), pz);
          p.g.rotation.y = -Math.PI / 2;
          const hold01 = t <= T.enter1 ? 1 : 1 - ease((t - T.enter1) / (T.lower1 - T.enter1));
          walkPose(p, ph + (p.front ? 0 : Math.PI), moving, true, hold01);
        } else {
          const u = t - T.lower1, d = p.v * (u < 1 ? (u * u) / 2 : u - 0.5);
          const [px, pz, yaw, done] = pathAt(p, d);
          p.g.position.set(px, floorAt(px), pz);
          if (done) {
            const tEnd = T.lower1 + 0.5 + p.len[p.len.length - 1] / p.v, w = ease((t - tEnd) / 0.6);
            p.g.rotation.y = yaw + (-Math.PI / 2 - yaw) * w;
            walkPose(p, 0, 0, false, 0);
          } else {
            p.g.rotation.y = yaw;
            walkPose(p, (d * Math.PI) / 0.85 + (p.front ? 0 : Math.PI), u < 0.3 ? u / 0.3 : 1, false, 0);
          }
        }
      }
      // the cloud
      const C = D.cloud, on = t >= T.cloud0;
      C.visible = on;
      if (on) {
        const k2 = performance.now() * 0.0004;
        for (let i = 0; i < D.puffs.length; i++) {
          const pf = D.puffs[i], s = ease((t - pf.tb) / 1.4) * pf.r;
          D.v3.set(pf.x + Math.sin(k2 + pf.ph) * 0.5, pf.y + Math.cos(k2 * 0.8 + pf.ph) * 0.35, pf.z + Math.sin(k2 * 0.6 + pf.ph * 1.3) * 0.5);
          D.s3.set(Math.max(1e-4, s * 1.15), Math.max(1e-4, s * 0.9), Math.max(1e-4, s * 1.15));
          D.m4.compose(D.v3, D.q, D.s3);
          C.setMatrixAt(i, D.m4);
        }
        C.instanceMatrix.needsUpdate = true;
      }
      // the devir's own cloud (70-ui.js) comes with the heichal's
      if (t >= T.cloud0 - 0.4 && !D.cloudSet && ctx.ui && typeof ctx.ui.setCloud === "function") { D.cloudSet = true; ctx.ui.setCloud(true); }
      // (70-ui.js gives the devir its cloud back when the eye goes far from it after being near - the eye goes out to the king and back:
      // while the viewer wanted it off, it is kept off until the cloud of the end)
      if (D.wantOff && t < T.cloud0 - 0.4 && ctx.ui && typeof ctx.ui.cloudOn === "function" && ctx.ui.cloudOn()) ctx.ui.setCloud(false);
    };
    // the eye and the words
    const E = (x, h, z) => [x, floorAt(x) + h, z];
    const keys = [[0, [36, 17.5, 3.5], [13, 15.2, 0]], [3.5, [26, 16.8, 2.4], [7, 14.8, 0]]];
    for (const tk of [6, 8.5, 11, 13.5, 16, 18.4]) { const ax = arkX(tk); keys.push([tk, E(ax + 9.5, 6.8, 1.6), E(ax - 7, 3.4, 0)]); }
    const DOORV = [E(-33.5, 4.6, 4.2), E(-44.4, 7.5, -0.8)];
    const KX = ARK_KIYOR.x, KY = ark_kiyorY(LV) + 3;   // KIYOR_RALBAG_208: the king kneels on the platform's top
    keys.push([T.walk1, DOORV[0], DOORV[1]], [23.5, DOORV[0], DOORV[1]],
      [24.6, [-14, F + 9.5, 0.6], [10, F + 10, 0]], [25.6, [6, 22.5, 0.4], [40, 22, 3]], [26.6, [30, 26, 4], [62, 20, 6]],
      [27.6, [60, 34, 8], [100, 16, 2]], [28.5, [97, 33, 5], [KX, KY + 1.9, 0]],
      [29.4, [KX - 9.5, KY + 3.6, 3.2], [KX, KY + 1.5, 0]], [32.5, [KX - 8.6, KY + 3.4, 5.6], [KX, KY + 1.5, 0]],
      [35.5, [KX - 1, KY + 3.6, 9.5], [KX, KY + 1.4, 0]], [38.8, [KX + 6.5, KY + 4, 8], [KX, KY + 1.4, 0]],
      [42.0, [KX + 7, KY + 3.5, 2.5], [60, KY + 3, 0]], [47.6, [KX + 7, KY + 3.9, 1.0], [55, KY + 3.5, 0]],
      [49.4, [99, 33, 6], [60, 20, 0]], [50.5, [70, 30, 8], [40, 21, 3]], [51.6, [38, 26, 3], [8, 20, 0]], [52.7, [8, 21.5, 0.4], [-20, 19, 0]],
      [T.open0, E(-33.5, 4.6, 4.2), E(-44.4, 7.5, -0.8)], [57.5, E(-33.5, 7.8, 1.6), E(-50, 5, 0)], [61.5, E(-37, 7.4, 1.8), E(-57, 4.2, 0)],
      [T.lower1, E(-37, 7.4, 1.8), E(-57.5, 3.5, 0)], [66.0, E(-34, 7.6, 4.8), E(-52, 3.8, 0)], [69.0, E(-29, 8.4, 5.6), E(-50, 3.6, 0)],
      [70.5, E(-24, 9.2, 5.0), E(-46, 4.5, 0)], [T.cloud0, [-9, F + 11, 1.5], [-34, F + 8, 0]], [74.5, [6, 22.5, 0.5], [-30, 18, 0]],
      [76.5, [22, 18.6, 0.2], [-20, 17.6, 0]], [T.end, [22, 18.6, 0.2], [-20, 17.6, 0]]);
    const caps = [
      [0, "״ויבאו כל זקני ישראל וישאו הכהנים את הארון״ (מלכים א ח, ג)"],
      [7.5, "ארבעה כהנים נושאים: ״ומנא לן דבארבעה הוו דרו להו?״ (מנחות צח:). במודל: שנים לפני הארון ושנים אחריו, בין הבדים"],
      [19.6, "״כשבנה שלמה את בית המקדש, ביקש להכניס ארון לבית קדשי הקדשים. דבקו שערים זה בזה״ (שבת ל.)"],
      [24.6, "״אמר שלמה עשרים וארבעה רננות, ולא נענה״ (שבת ל.). רש״י: ״רנה תפילה תחינה כתובים בתפילת שלמה עד כ״ד״"],
      [30.0, "״פתח ואמר: ׳שאו שערים ראשיכם והנשאו פתחי עולם ויבא מלך הכבוד׳״ (שבת ל.; תהלים כד, ז)"],
      [35.5, "״רהטו בתריה למיבלעיה, אמרו: ׳מי הוא זה מלך הכבוד׳. אמר להו: ׳ה׳ עזוז וגבור׳״ (שבת ל.; תהלים כד, ח). רש״י: ״סברי דעל עצמו אמר מלך הכבוד״"],
      [42.0, "״חזר ואמר: ׳שאו שערים ראשיכם ושאו פתחי עולם ויבא מלך הכבוד מי הוא זה מלך הכבוד ה׳ צבאות הוא מלך הכבוד סלה׳, ולא נענה״ (שבת ל.; תהלים כד, ט–י)"],
      [48.5, "״כיון שאמר: ׳ה׳ אלהים אל תשב פני משיחך זכרה לחסדי דוד עבדך׳, מיד נענה״ (שבת ל.; דברי הימים ב ו, מב)"],
      [T.open1, "״ויבאו הכהנים את ארון ברית ה׳ אל מקומו אל דביר הבית אל קדש הקדשים אל תחת כנפי הכרובים״ (מלכים א ח, ו)"],
      [62.9, "״כי הכרובים פרשים כנפים אל מקום הארון ויסכו הכרבים על הארון ועל בדיו מלמעלה״ (מלכים א ח, ז)"],
      [T.ext0, "״ויארכו הבדים ויראו ראשי הבדים מן הקדש על פני הדביר ולא יראו החוצה״ (מלכים א ח, ח)"],
      [T.cloud0, "״ויהי בצאת הכהנים מן הקדש והענן מלא את בית ה׳״ (מלכים א ח, י)"],
      [79.0, "״ולא יכלו הכהנים לעמד לשרת מפני הענן כי מלא כבוד ה׳ את בית ה׳״ (מלכים א ח, יא)"]
    ];
    // the model before and after: saved at the start, given back at the end or at any stop
    const enter = () => {
      tagLabels();
      const KL = ctx.shared.kodeshLayout, AI = ctx.shared.arkInside, AL = ctx.shared.arkLift;
      D.saved = { arkInside: !!(AI && AI.on), lift: !!(AL && typeof AL.get === "function" && AL.get()) };
      if (D.saved.arkInside) AI.set(false);
      if (D.saved.lift) AL.set(false);
      try { const HD = ctx.shared.heichalDoors; if (HD && typeof HD.stop === "function") HD.stop(); } catch (_) {}
      if (KL && typeof KL.hide === "function") KL.hide(true);
      offL.visible = false;
      curtain(false);
      original(false, false);
      g.visible = true;
      pillsOff(true);
      D.cloudSet = false;
    };
    const leave = () => {
      if (!D.saved) return;
      const s = D.saved;
      D.saved = null;
      doors(0, 0);
      curtain(true);
      original(true, true);
      for (const m of D.ext || []) m.visible = false;
      if (D.cloud) D.cloud.visible = false;
      g.visible = false;
      offL.visible = true;
      const KL = ctx.shared.kodeshLayout;
      if (KL && typeof KL.hide === "function") KL.hide(false);
      if (s.arkInside && ctx.shared.arkInside) ctx.shared.arkInside.set(true);
      if (s.lift && ctx.shared.arkLift) ctx.shared.arkLift.set(true);
      pillsOff(false);
      // TOUR_ARK_209: inside the presentation a "כן" to the devir's question holds for the next slide too - the demonstration ends
      // with the cloud (8:10), and the next slide (8:6-9, in the devir) would ask the same question again at once. So there the cloud
      // goes off at the end; it comes back by itself as always (once the eye has been near it and goes away), and the slide of
      // 8:10-11 puts it back
      let inTour = false;
      try { const TR = ctx.shared.tour; inTour = !!(TR && typeof TR.state === "function" && TR.state().running); } catch (_) { inTour = false; }
      if (ctx.ui && typeof ctx.ui.setCloud === "function") ctx.ui.setCloud(inTour && D.wantOff ? false : D.cloudWas);
    };
    const finish = () => { D.run = false; leave(); };
    const start = (again) => {
      const Wk = W();
      if (!Wk || !A) return false;
      build();
      if (typeof ctx.shared.stopDemos === "function") ctx.shared.stopDemos("arkGatesDemo");
      if (!again) { D.cloudWas = !(ctx.ui && typeof ctx.ui.cloudOn === "function") || ctx.ui.cloudOn(); D.wantOff = !D.cloudWas; }
      enter();
      D.run = true;
      D.apply(0);
      Wk.run(keys, caps, finish);
      return true;
    };
    const demo = () => {
      // the devir is covered by the cloud "מפני כבוד המקום" (70-ui.js): its own question first - "כן": the ark is seen set under the
      // cherubim; "ביטול": it goes in into the cloud (the user, 22:32: "8. מצוין")
      const U = ctx.ui;
      if (U && typeof U.cloudOn === "function" && U.cloudOn() && typeof U.askCloud === "function") {
        D.cloudWas = true;
        U.askCloud(() => { U.setCloud(false); D.wantOff = true; start(true); }, () => { D.wantOff = false; start(true); });
        return true;
      }
      return start(false);
    };
    const stop = () => { if (!D.run) return; const Wk = W(); if (Wk && Wk.on) Wk.stop(); else finish(); };
    ctx.animated.push(() => {
      if (!D.run) return;
      const Wk = W();
      const t = Wk && typeof Wk.now === "function" ? Wk.now() : 0;
      D.apply(Math.max(0, t));
    });
    const walkEntry = () => (ctx.shared.demoStops || []).find((d) => d.id === "walk");
    (ctx.shared.demoStops || (ctx.shared.demoStops = [])).push({
      id: "arkGatesDemo", running: () => D.run, stop,
      pause: () => { const w = walkEntry(); if (w) w.pause(); },
      resume: () => { const w = walkEntry(); if (w) w.resume(); },
      paused: () => { const w = walkEntry(); return !!(w && w.paused()); },
      restart: () => { stop(); start(true); }
    });
    ctx.shared.modelButtons = ctx.shared.modelButtons || [];
    ctx.shared.modelButtons.push({
      id: "arkGatesDemo", label: "הדגמה: ״דבקו שערים״ — הכנסת הארון", labelOn: "עצור את ההדגמה", maxDist: 46,
      title: "״כשבנה שלמה את בית המקדש, ביקש להכניס ארון לבית קדשי הקדשים. דבקו שערים זה בזה״ (שבת ל.). ההדגמה: ארבעה כהנים נושאים את הארון, השערים דבקים, שלמה מתפלל על הכיור, השערים נפתחים, הארון נכנס תחת כנפי הכרובים, והענן ממלא את הבית.",
      anchor: [CO.xKodeshW + 2.5, F + 10.5, 0],
      get: () => D.run,
      set: (on) => { if (on) demo(); else stop(); }
    });
    Object.assign(ctx.shared.arkGates, { demo, stop, T, at: (t) => { build(); if (!D.saved) { D.wantOff = !(ctx.ui && typeof ctx.ui.cloudOn === "function" && ctx.ui.cloudOn()); D.cloudWas = !D.wantOff; enter(); } D.apply(t); }, leave: () => leave(), isRunning: () => D.run });
  }
