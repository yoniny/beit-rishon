# -*- coding: utf-8 -*-
# B2 1.9.5 - THE LOTTERIES' DEMONSTRATION, ROUND 9: THE PRIEST'S FIGURE, AFTER THE USER'S REMARKS ON ROUND 8 (PAYIS_FIGURE4).
# The user, 12.11.2026:
#   01:11 "המגבעת נראית כמו כדור גלידה. הזקן כמו 6 מלפפונים מחוברים ... עשית את הכתונת כמו שמלה כזאת של נשים? מה זה על הכתפיים?
#          הגולות האלה. האבנט ... למה הוא כפול? היה אחד. והצבעים, זה בכלל לא שזור. זה אמור להיות צבע אחיד, תסתכל שוב בתמונות שם ...
#          הפרצוף קצת יותר חי ... ביקשתי לראות אנשים, לא בובות. ידיים, רגליים, פתוחות, משהו."
#   01:13 "עדיין לא תיקנת את המגבעת, עדיין לא תיקנת את הזקן ... תסתכל תמונות של אנשים, תבין איך עושים. המגבעת, יש לך תמונות, תחפש
#          באתר הזה עוד תמונות."
#   01:15 (on the site's drawing 200, the priest eating at a table) "התמונה שהבאת לגבי הכובע זה שטריימל ולא המגבעת אבל הכתונת טובה".
# So: the migba'at only after drawing 452 - a smooth egg, rounded at its head, broad bands of cloth aslant in low relief; the
# kutonet as in drawing 200 - straight, falling from natural shoulders (no narrow waist, no flared hem, no balls on the shoulders);
# the beard one body, growing from the cheeks and the jaw and coming down to the chest; the avnet one band, finely woven, its
# colours melting into one hue; the arms and the feet apart, open hands with fingers.
# Idempotent. Source: /home/claude/b2src/src/55-payis.js.
import io
P = '/home/claude/b2src/src/55-payis.js'
s = io.open(P, encoding='utf-8').read()
s0 = s
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:100])
    s = s.replace(a, b)

NEW = r'''    const FS = 1.4;                                  // the figures' scale (a model choice): to the top of the head 2.23 drawn x 1.4 = a little over three amot
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
        blob(cx + sd * 29, ey, 24, 13, "rgba(110,62,38,0.34)");
        blob(cx + sd * 40, 152, 27, 22, "rgba(200,100,82,0.36)");
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
    const HEAD_Y = 2.075, HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1105], ER = 0.0238, HS = 1.045;
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
        parts.push(skin(at(rot(sph(ER * 1.07, ER * 1.07, ER * 1.07, 12, 6, 0, TAU, 0, 0.64), 0.5), sd * EYE[0], EYE[1], EYE[2])));
        parts.push(skin(at(rot(sph(ER * 1.06, ER * 1.06, ER * 1.06, 12, 5, 0, TAU, 0, 0.52), Math.PI - 0.42), sd * EYE[0], EYE[1], EYE[2])));
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
      const PM = 1.4, w2 = rnd() * 6, len = 0.2 + rnd() * 0.09, parts = [];
      parts.push(surf(46, 22, (u, v, o) => {
        const a = u * 2 - 1, ph = a * PM, ya = Math.abs(a), sd = 1 - v;                      // sd: 0 at the upper edge, 1 at the lower
        const yTop = -0.094 + 0.124 * Math.pow(ya, 1.3), yBot = -0.07 - len * (1 - Math.pow(ya, 2.2)) + 0.012 * Math.sin(15 * ph + w2) * (1 - ya);
        const y = yTop + sd * (yBot - yTop);
        const strand = Math.sin(24 * ph + 5 * sd + w2), th = (0.004 + 0.03 * Math.pow(Math.sin(Math.PI * Math.min(1, sd * 1.22)), 0.9) + 0.003 * strand + 0.002 * Math.sin(39 * ph - 3 * sd)) * (1 - Math.pow(ya, 5));
        if (y >= YJ) {
          const r = headR(ph, y) + th;
          o.x = Math.sin(ph) * r;
          o.z = Math.cos(ph) * r;
        } else {
          const k = Math.min(1, (YJ - y) / 0.2), r = headR(ph, YJ) + th;
          o.x = Math.sin(ph) * r * (1 - 0.3 * k);
          o.z = Math.cos(ph) * r * (1 - 0.14 * k) + 0.045 * k * Math.max(0, Math.cos(ph));
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
    const gRobeBody = surf(64, 50, (u, v, o) => {
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
    const handOpen = (sd) => {
      const parts = [sph(0.03, 0.04, 0.0125, 10, 8)];
      [-0.0215, -0.0072, 0.0072, 0.0215].forEach((x, i) => parts.push(at(rot(sph(0.0083, 0.031 - Math.abs(i - 1.4) * 0.004, 0.0083, 6, 6), 0, 0, x * 5), x * 1.25, -0.062, 0)));
      parts.push(at(rot(sph(0.0098, 0.027, 0.0098, 6, 6), 0, 0, -sd * 0.75), -sd * 0.037, -0.012, 0.004));
      const q = mergeGeometries(parts);
      q.rotateY(sd * 0.95);                // the palm toward the body, the thumb to the front
      return foreAt(q, FORE + 0.045);
    };
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
    const gSash = surf(64, 8, (u, v, o) => {
      const y = SY0 + v * (SY1 - SY0), a = u * TAU + Math.PI, e = Math.sin(Math.PI * v), th = 0.003 + 0.011 * Math.pow(e, 0.35);
      o.x = (spl(bX, y) + th) * Math.sin(a);
      o.y = y;
      o.z = (spl(bZ, y) + th) * Math.cos(a);
      o.c = 0.88 + 0.12 * e;
    });
    // ---------- the migba'at (the site's drawing 452; its origin: its lower edge, over the forehead): a smooth egg, rounded at its
    // head; a band round the forehead, and above it broad bands of the cloth going up aslant, each lying on the one before it -
    // in low relief, the edge of each casting a soft shade (the user: not "כדור גלידה")
    const HAT_H = 0.33, HAT_Y = HEAD_Y + 0.058, ARROW_Y = 2.75;
    const hatLow = [[0, 0.128], [0.03, 0.156], [0.1, 0.162], [0.22, 0.168], [0.36, 0.171]];
    const gHat = surf(96, 56, (u, v, o) => {
      const a = u * TAU + Math.PI, R = v < 0.36 ? spl(hatLow, v) : 0.171 * Math.sqrt(Math.max(0, 1 - Math.pow((v - 0.36) / 0.64, 2.3)));
      const on = sstep(0.13, 0.17, v) * (1 - sstep(0.9, 0.99, v)), f = ((4 * (u - 1.15 * v)) % 1 + 1) % 1;
      const edge = Math.exp(-(1 - f) / 0.09), line = Math.exp(-Math.pow((v - 0.14) / 0.012, 2)), saw = f < 0.9 ? 0.5 - f / 0.9 : (f - 0.9) / 0.1 - 0.5;
      const r = R + on * 0.005 * saw - 0.003 * line;
      o.x = r * Math.sin(a);
      o.y = v * HAT_H;
      o.z = r * Math.cos(a) * 1.06;
      o.c = (1 - on * (0.22 * edge + 0.04 * f)) * (1 - 0.2 * line);
    });
    const gCap = sph(HR[0] * 1.1, HR[1] * 1.1, HR[2] * 1.1, 16, 5, 0, TAU, 0, 1.15);   // the elder's cap
    const gFlame = new ConeGeometry(0.2, 0.7, 8); gFlame.translate(0, 0.35, 0);
    const gArrowHead = new ConeGeometry(0.2, 0.4, 12); gArrowHead.rotateX(Math.PI);   // the point down
    const gArrowShaft = new CylinderGeometry(0.065, 0.065, 0.36, 8);
    const mArrow = new MeshBasicMaterial({ color: 0xffc83a });
    const gStick = new CylinderGeometry(0.04, 0.04, 1.3, 6); gStick.translate(0, 0.65, 0);
    // a standing figure: the group's +z is the way it faces; hat = the migba'at (its own object: the appointed one lifts it);
    // hand = the right arm: `hand.visible = true` stretches it forward, one finger out ("הצביעו")
    const figure = (robe, sash, beard) => {
      const f = new Group(), n = beard || 0;
      const body = new Mesh(gRobe, robe);
      body.castShadow = true;
      f.add(body);
      f.add(new Mesh(gSkinStill, mSkin));
      if (sash) { const sm = new Mesh(gSash, mSashDyed); f.add(sm); SASHES.push(sm); }
      // (every priest a little different: the turn of his head, his height)
      const yaw = (rnd() - 0.5) * 0.5;
      const hg = headOn(f, HEAD_Y, mBeards[n % mBeards.length], n);
      hg.rotation.set((rnd() - 0.5) * 0.1, yaw, (rnd() - 0.5) * 0.07);
      const hat = new Group();
      hat.add(new Mesh(gHat, mHat));
      hat.position.y = HAT_Y;
      hat.rotation.y = yaw + (rnd() - 0.5) * 0.9;
      f.add(hat);
      const armR = new Group();
      armR.position.set(-SH_X, SH_Y, 0);
      armR.rotation.set(ARM_DOWN[0], 0, ARM_DOWN[1]);
      armR.add(new Mesh(gSleeve, robe));
      const hOpen = new Mesh(gHandOpen, mSkin), hPoint = new Mesh(gHandPoint, mSkin);
      hPoint.visible = false;
      armR.add(hOpen);
      armR.add(hPoint);
      f.add(armR);
      const hand = { on: false, get visible() { return this.on; }, set visible(v) { this.on = !!v; const a = v ? ARM_OUT : ARM_DOWN; armR.rotation.set(a[0], 0, a[1]); hOpen.visible = !v; hPoint.visible = !!v; } };
      // PAYIS_WHITE: the winner's mark - an arrow over his head (the garments are all white)
      const arrow = new Group();
      const ah = new Mesh(gArrowHead, mArrow), as = new Mesh(gArrowShaft, mArrow);
      ah.position.y = 0.2;
      as.position.y = 0.56;
      arrow.add(ah);
      arrow.add(as);
      arrow.position.y = ARROW_Y;
      arrow.visible = false;
      f.add(arrow);
      f.userData = { body, hat, hand, robe, arrow, tip: new Vector3(-SH_X, 1.49, 0.8) };
      f.scale.setScalar(FS * (0.97 + rnd() * 0.06));
      g.add(f);
      return f;
    };
'''

if 'PAYIS_FIGURE4' not in s:
    a = s.index("    const FS = 1.4;")
    b = s.index("    const face = (f, x, z) =>")
    s = s[:a] + NEW + s[b:]
    rep("    const stripes = (on) => { for (const m of SASHES) m.geometry = on ? gSashDyed : gSashWhite; };\n",
        "    const stripes = (on) => { for (const m of SASHES) m.material = on ? mSashDyed : mSashWhite; };\n")

if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 9 applied')
else:
    print('55-payis.js: unchanged')

# ---- round 9b (after the first pictures): the beard full and rounded below (it narrowed to a point), a little shorter - as in the
# site's drawing; the migba'at's bands a little clearer; the upper lids a little lower (the eyes stared)
s = io.open(P, encoding='utf-8').read()
s0 = s
if 'PAYIS_FIGURE4B' not in s:
    rep("      const PM = 1.4, w2 = rnd() * 6, len = 0.2 + rnd() * 0.09, parts = [];",
        "      const PM = 1.4, w2 = rnd() * 6, len = 0.165 + rnd() * 0.07, parts = [];   // PAYIS_FIGURE4B: full and rounded below")
    rep("yBot = -0.07 - len * (1 - Math.pow(ya, 2.2)) + 0.012 * Math.sin(15 * ph + w2) * (1 - ya);",
        "yBot = -0.07 - len * (1 - Math.pow(ya, 3.6)) + 0.01 * Math.sin(15 * ph + w2) * (1 - ya);")
    rep("          o.x = Math.sin(ph) * r * (1 - 0.3 * k);\n          o.z = Math.cos(ph) * r * (1 - 0.14 * k) + 0.045 * k * Math.max(0, Math.cos(ph));",
        "          o.x = Math.sin(ph) * r * (1 - 0.16 * k * k);\n          o.z = Math.cos(ph) * r * (1 - 0.1 * k) + 0.05 * k * Math.max(0, Math.cos(ph));")
    rep("      const r = R + on * 0.005 * saw - 0.003 * line;", "      const r = R + on * 0.0075 * saw - 0.003 * line;")
    rep("      o.c = (1 - on * (0.22 * edge + 0.04 * f)) * (1 - 0.2 * line);", "      o.c = (1 - on * (0.3 * edge + 0.05 * f)) * (1 - 0.22 * line);")
    rep("parts.push(skin(at(rot(sph(ER * 1.07, ER * 1.07, ER * 1.07, 12, 6, 0, TAU, 0, 0.64), 0.5), sd * EYE[0], EYE[1], EYE[2])));",
        "parts.push(skin(at(rot(sph(ER * 1.07, ER * 1.07, ER * 1.07, 12, 6, 0, TAU, 0, 0.74), 0.5), sd * EYE[0], EYE[1], EYE[2])));")
if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 9b applied')
else:
    print('55-payis.js: round 9b unchanged')

# ---- round 9c: the beard's lower part broad and rounded (it still drew to a point under the narrow chin); the eyes a little
# smaller and deeper, the shade about them lighter (the lids stood out like rims)
s = io.open(P, encoding='utf-8').read()
s0 = s
if 'PAYIS_FIGURE4C' not in s:
    rep("yBot = -0.07 - len * (1 - Math.pow(ya, 3.6)) + 0.01 * Math.sin(15 * ph + w2) * (1 - ya);",
        "yBot = -0.07 - len * (1 - Math.pow(ya, 5)) + 0.01 * Math.sin(15 * ph + w2) * (1 - ya);   // PAYIS_FIGURE4C")
    rep("          const k = Math.min(1, (YJ - y) / 0.2), r = headR(ph, YJ) + th;\n          o.x = Math.sin(ph) * r * (1 - 0.16 * k * k);",
        "          const k = Math.min(1, (YJ - y) / 0.2), r = headR(ph, YJ) + th + 0.028 * Math.sin(Math.PI * Math.min(1, k * 1.3)) * Math.abs(Math.sin(ph));\n          o.x = Math.sin(ph) * r * (1 - 0.08 * k * k);")
    rep("const HEAD_Y = 2.075, HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1105], ER = 0.0238, HS = 1.045;",
        "const HEAD_Y = 2.075, HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1095], ER = 0.0222, HS = 1.045;")
    rep("parts.push(skin(at(rot(sph(ER * 1.06, ER * 1.06, ER * 1.06, 12, 5, 0, TAU, 0, 0.52), Math.PI - 0.42), sd * EYE[0], EYE[1], EYE[2])));",
        "parts.push(skin(at(rot(sph(ER * 1.06, ER * 1.06, ER * 1.06, 12, 5, 0, TAU, 0, 0.6), Math.PI - 0.42), sd * EYE[0], EYE[1], EYE[2])));")
    rep("        blob(cx + sd * 29, ey, 24, 13, \"rgba(110,62,38,0.34)\");\n        blob(cx + sd * 40, 152, 27, 22, \"rgba(200,100,82,0.36)\");",
        "        blob(cx + sd * 29, ey, 24, 13, \"rgba(110,62,38,0.16)\");\n        blob(cx + sd * 40, 152, 27, 22, \"rgba(200,100,82,0.34)\");")
if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 9c applied')
else:
    print('55-payis.js: round 9c unchanged')

# ---- round 9d (the user, 01:24, on the picture sent: "כאן צריך שינוי קטן, יותר חיבור לראש, מעל האוזן ... די מצוין. ליטוש אחרון וזהו"):
# the migba'at joins the head - its lower band lies close on it and comes down, at the sides and behind, to just above the ears;
# above the head it swells as before
s = io.open(P, encoding='utf-8').read()
s0 = s
if 'PAYIS_FIGURE4D' not in s:
    rep("    const HAT_H = 0.33, HAT_Y = HEAD_Y + 0.058, ARROW_Y = 2.75;\n    const hatLow = [[0, 0.128], [0.03, 0.156], [0.1, 0.162], [0.22, 0.168], [0.36, 0.171]];",
        "    // PAYIS_FIGURE4D: it joins the head - the lower band close on it, down to just above the ears at the sides and behind\n"
        "    const HAT_H = 0.335, HAT_Y = HEAD_Y + 0.06, ARROW_Y = 2.75;\n    const hatLow = [[0, 0.136], [0.03, 0.143], [0.1, 0.149], [0.22, 0.161], [0.36, 0.171]];")
    rep("      o.x = r * Math.sin(a);\n      o.y = v * HAT_H;\n      o.z = r * Math.cos(a) * 1.06;\n      o.c = (1 - on * (0.3 * edge + 0.05 * f)) * (1 - 0.22 * line);",
        "      o.x = r * Math.sin(a);\n      o.y = v * HAT_H - 0.034 * sstep(0.15, 0.6, 0.5 - 0.5 * Math.cos(a)) * Math.pow(1 - v, 3);\n      o.z = r * Math.cos(a) * 1.06;\n      o.c = (1 - on * (0.3 * edge + 0.05 * f)) * (1 - 0.22 * line);")
if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 9d applied')
else:
    print('55-payis.js: round 9d unchanged')
