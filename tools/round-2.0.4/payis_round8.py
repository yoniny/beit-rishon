# -*- coding: utf-8 -*-
# B2 1.9.5 - THE LOTTERIES' DEMONSTRATION, ROUND 8: THE PRIEST'S FIGURE MADE ALIVE (PAYIS_FIGURE3).
# The user, 12.11.2026 01:00 (on the pictures of round 7): "הפנים מאוד מתות, לא חיות, הזקן גוש כזה ... [האבנט] זה לא שזור, זה צריך
# להיות יותר שזור. המגבעת, לא למדת את הציור נכון. תעשה את הכל יותר חי." (01:01: "התכוונתי לאבנט, אין אפוד").
# So: the migba'at after the site's drawing 452 again - it narrows upward to a rounded head, and its windings are thick folds of
# cloth going up aslant, each on the one before (relief, not painted lines); the avnet of real twined strands (white, tekhelet,
# argaman, tola'at shani - or all white), a flat cord three fingers wide wound twice; the face with eyes that have lids and a
# glint, brows, a nose with its wings, lips, colour in the cheeks; the beard of locks side by side and a moustache of two parts;
# folds in the kutonet, the arms bent at the elbow, hands with a thumb; every priest a little different (height, the head's turn).
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
    // ===== PAYIS_FIGURE3 - THE PRIEST. The user, 12.11.2026: 00:42 "לכהנים היו ידיים ... האבנט צריך להיראות שזור, לא חלק ... ככה לא
    // היה נראה המגבעת. בבקשה לנסות לחפש תמונות של כהן הדיוט, ולנסות לבנות דרכן"; 00:43 the page mikdash3.co.il/limud-leshichno-a-71
    // ("אנחנו מפה"); 00:48 "גם את הפרצוף תעשה כמוהו ... את הזקן"; 01:00 "הפנים מאוד מתות ... הזקן גוש כזה ... זה צריך להיות יותר שזור.
    // המגבעת, לא למדת את הציור נכון. תעשה את הכל יותר חי".
    // Built after that page's drawing 452 "כהן הדיוט לבוש 4 בגדים" and drawing 194 "ארבע בגדי כהן הדיוט" (limud-leshichno-b-14), each
    // part against the Rambam (Klei HaMikdash, read in his library - qa/fs/LIB_1111.md):
    //   the migba'at - tall, narrowing to a rounded head, the cloth's folds going up aslant one on another, a band over the forehead
    //     (the site's "שיטה ב"; 8:2 "ובניו צונפין בה ככובע", 8:19 "ארכו שש עשרה אמות"; the Ramban, Shemot 28:31 "ומעלה הכפלים עליו
    //     כעין מגבעת שהוא קובע"; Ibn Ezra, 28:36 "שיכסו הראש והם גבוהים");
    //   the face - eyes with lids, brows, a nose, lips, a moustache and a full beard of locks down to the chest;
    //   the kutonet - checkered ("משבצת היתה שהיא בתים בתים באריגתה", 8:16), to above the heel, its sleeves to the palm ("וארך בית
    //     יד שלה עד פס ידו", 8:17); hands; bare feet;
    //   the avnet - at the elbows ("כנגד אצילי ידיו", 10:1), three fingers wide, wound twice ("רחבו כמו שלש אצבעות ... מקיפו ומחזירו
    //     כרך על גבי כרך", 8:19), of strands twined together - white, tekhelet, argaman ("הצבוע אדום") and tola'at shani (8:1 "רקום
    //     בצמר", 8:13), or all white ("של בוץ", Yoma 12b).
    // MODEL CHOICES: the proportions, the features of each face, the colour of each beard, the number of windings that are seen.
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
    // a surface P(u, v) - u goes round (its seam at the back), v goes up - with uv, a shade per vertex (the folds) and smooth normals
    const surf = (nu, nv, fn) => {
      const pos = [], uv = [], col = [], idx = [], o = { x: 0, y: 0, z: 0, c: 1 };
      for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
        fn(i === nu ? 0 : i / nu, j / nv, o);
        pos.push(o.x, o.y, o.z);
        uv.push(i / nu, j / nv);
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
      const n = q.attributes.normal;
      for (let j = 0; j <= nv; j++) {
        const a = j * (nu + 1), b = a + nu, x = n.getX(a) + n.getX(b), y = n.getY(a) + n.getY(b), z = n.getZ(a) + n.getZ(b), l = Math.hypot(x, y, z) || 1;
        n.setXYZ(a, x / l, y / l, z / l);
        n.setXYZ(b, x / l, y / l, z / l);
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
      c.fillStyle = "#f2f0e7";
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) c.fillRect(i * 32 + 2, j * 32 + 2, 28, 28);
      c.strokeStyle = "#d6d2c5";
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
      blob(cx, 104, 58, 20, "rgba(232,190,150,0.5)");                       // the forehead's light
      for (const sd of [-1, 1]) {
        blob(cx + sd * 29, ey, 24, 13, "rgba(110,62,38,0.34)");               // the eye's hollow
        blob(cx + sd * 40, 152, 27, 22, "rgba(204,98,80,0.42)");              // the cheek
        c.strokeStyle = "rgba(110,70,48,0.4)";
        c.lineWidth = 1.3;
        for (const k of [-1, 0, 1]) { c.beginPath(); c.moveTo(cx + sd * 45, ey + k * 2.5); c.lineTo(cx + sd * 54, ey + k * 6 - 1); c.stroke(); }
        c.strokeStyle = "rgba(110,62,38,0.22)";
        c.lineWidth = 5;
        c.beginPath(); c.moveTo(cx + sd * 10, ey + 2); c.lineTo(cx + sd * 12, 152); c.stroke();   // by the nose
      }
      c.fillStyle = "#a9584b";
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
    const mSash = mat(0xffffff, { vertexColors: true, roughness: 0.82 });
    const mBeards = [0xf4f2ec, 0xbdbab2, 0xeae7df, 0x54402f, 0xa29e96, 0xf0eee8, 0x6d5a48].map((c) => mat(c, { map: texHair, roughness: 0.95 })), mBeardOld = mBeards[0];
    const SASHES = [];   // every avnet's mesh: its strands dyed in the Rambam's reading, all white in "של בוץ"
    // ---------- the head (its middle at HEAD_Y): an egg, narrower at the chin; the nose with its wings, the lids, the lips and the
    // ears are pieces of its skin
    const HEAD_Y = 2.075, HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1125], ER = 0.0215;
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
        // the lids: the upper one comes down over the top of the iris, the lower one under it
        parts.push(skin(at(rot(sph(ER * 1.07, ER * 1.07, ER * 1.07, 12, 6, 0, TAU, 0, 0.82), 0.5), sd * EYE[0], EYE[1], EYE[2])));
        parts.push(skin(at(rot(sph(ER * 1.06, ER * 1.06, ER * 1.06, 12, 5, 0, TAU, 0, 0.6), Math.PI - 0.42), sd * EYE[0], EYE[1], EYE[2])));
      }
      parts.push(flatUV(at(sph(0.027, 0.0075, 0.012, 10, 6), 0, -0.084, 0.124), 0.766, 0.2));   // the lips
      return mergeGeometries(parts);
    })();
    const gEyes = mergeGeometries([-1, 1].map((sd) => at(sph(ER, ER, ER, 14, 10), sd * EYE[0], EYE[1], EYE[2])));
    // ---------- the hair, one piece: the brows; the moustache, two parts; the beard on the jaw, from ear to ear; the beard itself -
    // locks side by side, the middle ones longer, leaning forward down to the chest; the cheeks before the ears; the top of the
    // head (seen when the migba'at is lifted) and its back
    const hairGeo = () => {
      const parts = [];
      for (const sd of [-1, 1]) {
        parts.push(at(rot(sph(0.03, 0.0075, 0.011, 8, 5), 0, 0, -sd * 0.14), sd * EYE[0], 0.05, 0.1265));
        parts.push(at(rot(sph(0.036, 0.012, 0.016, 10, 6), 0, 0, -sd * 0.42), sd * 0.027, -0.066, 0.127));
        parts.push(sph(HR[0] * 1.035, HR[1] * 1.035, HR[2] * 1.035, 6, 8, sd < 0 ? 0.14 : Math.PI - 0.64, 0.5, 1.12, 1.02));
      }
      parts.push(sph(HR[0] * 1.03, HR[1] * 1.045, HR[2] * 1.05, 22, 8, -0.25, Math.PI + 0.5, 2.12, Math.PI - 2.12));
      const lock = (t, back) => {
        const L = (back ? 0.15 : 0.21) * (1 - 0.42 * t * t) * (0.9 + rnd() * 0.2), wd = 0.02 + rnd() * 0.007;
        const q = sph(wd, L / 2, 0.022 + rnd() * 0.006, 8, 8);
        q.rotateY(rnd() * 3);
        q.translate(0, -L / 2 + 0.02, 0);                 // it hangs from its top
        q.rotateZ(t * 0.34 + (rnd() - 0.5) * 0.12);       // the side ones spread a little
        q.rotateX(-0.24 - rnd() * 0.08);                  // forward, to lie on the chest
        q.translate(0.083 * t, -0.103 + 0.038 * t * t - (back ? -0.012 : 0), 0.112 * Math.sqrt(1 - 0.6 * t * t) - 0.004 - (back ? 0.02 : 0));
        return q;
      };
      for (let i = 0; i < 7; i++) parts.push(lock(-1 + i / 3, false));
      for (let i = 0; i < 6; i++) parts.push(lock(-0.83 + i / 3, true));
      parts.push(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 20, 6, 0, TAU, 0, 1.08));
      parts.push(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 14, 8, Math.PI + 0.3, Math.PI - 0.6, 1.08, 1.4));
      return mergeGeometries(parts);
    };
    const HS = 1.045;
    const gHairs = [hairGeo(), hairGeo(), hairGeo()];   // three beards, a little different
    const headOn = (f, y, mHair, k) => {
      const hg = new Group();
      hg.position.y = y;
      hg.add(new Mesh(gHeadAll, mFace));
      hg.add(new Mesh(gEyes, mEye));
      hg.add(new Mesh(gHairs[(k || 0) % gHairs.length], mHair));
      f.add(hg);
      return hg;
    };
    // ---------- the kutonet: its body with the folds of the cloth below the avnet, the shoulders, the left sleeve (the body is
    // broader than it is deep)
    const BZ = 0.78, SH_X = 0.262, SH_Y = 1.765, BEND = 0.34, UP = 0.36, FORE = 0.36;
    const robeTab = [[0.1, 0.25], [0.14, 0.252], [0.5, 0.24], [0.9, 0.223], [1.2, 0.2], [1.32, 0.188], [1.45, 0.196], [1.6, 0.226], [1.72, 0.25], [1.79, 0.244], [1.85, 0.2], [1.895, 0.12], [1.915, 0.076]];
    const rbAt = (y) => spl(robeTab, y);
    const gRobeBody = surf(72, 46, (u, v, o) => {
      const y = 0.1 + v * 1.815, a = u * TAU + Math.PI, k = Math.max(0, (1.27 - y) / 1.17);
      const fold = Math.sin(9 * a + 0.8) * 0.6 + Math.sin(14 * a + 2.1) * 0.4, r = rbAt(y) * (1 + 0.06 * k * Math.sqrt(k) * fold);
      o.x = r * Math.sin(a);
      o.y = y;
      o.z = r * Math.cos(a) * BZ;
      o.c = 1 - 0.2 * k * Math.max(0, -fold);
    });
    // an arm, hanging from the shoulder (its origin), bent forward at the elbow: the sleeve; the hand - palm, fingers, thumb
    const sleeveGeo = () => mergeGeometries([
      at(new CylinderGeometry(0.066, 0.057, UP, 14), 0, -UP / 2, 0),
      at(sph(0.058, 0.058, 0.058, 12, 8), 0, -UP, 0),
      at(rot(at(new CylinderGeometry(0.056, 0.045, FORE, 14), 0, -FORE / 2, 0), -BEND), 0, -UP, 0)
    ].map(white));
    const foreAt = (q, d) => at(rot(at(q, 0, -d, 0), -BEND), 0, -UP, 0);   // a piece at the distance d along the forearm from the elbow
    const handGeo = (sd) => mergeGeometries([
      foreAt(sph(0.031, 0.045, 0.018, 8, 6), FORE + 0.04),
      foreAt(sph(0.027, 0.036, 0.015, 8, 6), FORE + 0.09),
      foreAt(at(rot(sph(0.011, 0.03, 0.011, 6, 5), 0, 0, sd * 0.5), -sd * 0.03, 0, 0.012), FORE + 0.045)
    ]);
    const armPlace = (q, sd) => at(rot(q, -0.05, 0, sd * 0.09), sd * SH_X, SH_Y, 0);
    const gRobe = mergeGeometries([gRobeBody, white(at(sph(0.086, 0.084, 0.08, 16, 12), -SH_X, SH_Y, 0)), white(at(sph(0.086, 0.084, 0.08, 16, 12), SH_X, SH_Y, 0)), armPlace(sleeveGeo(), 1)]);
    // (the skin that does not move: the neck, the left hand, the bare feet)
    const gSkinStill = mergeGeometries([at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), armPlace(handGeo(1), 1),
      at(sph(0.048, 0.03, 0.095, 8, 6), -0.085, 0.03, 0.13), at(sph(0.048, 0.03, 0.095, 8, 6), 0.085, 0.03, 0.13)]);
    // (the right arm moves: it hangs, and at "הצביעו" it is stretched forward, a finger out)
    const gSleeve = sleeveGeo(), gHand = handGeo(-1);
    const gFinger = foreAt(new CylinderGeometry(0.0105, 0.012, 0.085, 6), FORE + 0.145);
    const ARM_DOWN = [-0.05, -0.09], ARM_OUT = [-1.0, -0.03];
    // ---------- the avnet: four strands twined into a flat cord three fingers wide, wound twice at the elbows' height
    const ropeGeo = (dyed) => {
      const pos = [], col = [], uv = [], idx = [], NU = 144, NV = 5, M = 18;
      const C = dyed ? [[0.955, 0.94, 0.89], [0.2, 0.4, 0.74], [0.62, 0.08, 0.13], [0.9, 0.3, 0.12]] : [[0.99, 0.985, 0.96], [0.9, 0.88, 0.82], [0.97, 0.96, 0.92], [0.86, 0.84, 0.77]];
      [1.341, 1.429].forEach((y0, wi) => C.forEach((rgb, si) => {
        const base = pos.length / 3, ph = si * Math.PI / 2 + wi * 0.7;
        for (let i = 0; i <= NU; i++) {
          const a = (i % NU) / NU * TAU, al = M * a + ph, sx = Math.sin(a), cz = Math.cos(a);
          const R = rbAt(y0) + 0.02 + 0.0125 * Math.cos(al), yc = y0 + 0.03 * Math.sin(al), sh = 0.66 + 0.34 * (0.5 + 0.5 * Math.cos(al));
          for (let j = 0; j <= NV; j++) {
            const b = (j % NV) / NV * TAU, rr = R + 0.0148 * Math.cos(b);
            pos.push(rr * sx, yc + 0.0148 * Math.sin(b), rr * cz * BZ);
            col.push(rgb[0] * sh, rgb[1] * sh, rgb[2] * sh);
            uv.push(i / NU, j / NV);
          }
        }
        for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
          const p = base + i * (NV + 1) + j, q2 = p + NV + 1;
          idx.push(p, q2, p + 1, q2, q2 + 1, p + 1);
        }
      }));
      const q = new BufferGeometry();
      q.setAttribute("position", new Float32BufferAttribute(pos, 3));
      q.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      q.setAttribute("color", new Float32BufferAttribute(col, 3));
      q.setIndex(idx);
      q.computeVertexNormals();
      return q;
    };
    const gSashDyed = ropeGeo(true), gSashWhite = ropeGeo(false);
    // ---------- the migba'at (its origin: its lower edge, over the forehead). A band; above it the cloth's folds go up aslant, each
    // lying on the one before it; it swells a little and narrows to a rounded head that leans a little aside
    const HAT_H = 0.34, HAT_Y = HEAD_Y + 0.058, ARROW_Y = 2.76;
    const hatTab = [[0, 0.127], [0.03, 0.157], [0.08, 0.164], [0.2, 0.169], [0.33, 0.173], [0.5, 0.168], [0.65, 0.152], [0.78, 0.125], [0.88, 0.091], [0.95, 0.055], [1, 0.006]];
    const gHat = surf(84, 44, (u, v, o) => {
      const a = u * TAU + Math.PI, f = ((6 * (u - 0.72 * v)) % 1 + 1) % 1, w = f < 0.14 ? f / 0.14 : 1 - (f - 0.14) / 0.86;
      const amp = 0.02 * sstep(0.1, 0.2, v) * (1 - sstep(0.86, 1, v)), band = v < 0.115 ? Math.sin(Math.PI * v / 0.115) : 0;
      const groove = Math.exp(-Math.pow((v - 0.122) / 0.016, 2));
      const r = spl(hatTab, v) + amp * (w - 0.45) + 0.007 * band - 0.007 * groove, lean = v * v * v;
      o.x = r * Math.sin(a) + 0.022 * lean;
      o.y = v * HAT_H;
      o.z = (r * Math.cos(a) - 0.012 * lean) * 1.06;
      o.c = (1 - (amp > 0.001 ? 0.3 * (amp / 0.02) * Math.pow(1 - w, 2.2) : 0)) * (1 - 0.26 * groove);
    });
    const gCap = sph(HR[0] * 1.1, HR[1] * 1.1, HR[2] * 1.1, 16, 5, 0, TAU, 0, 1.15);   // the elder's cap
    const gFlame = new ConeGeometry(0.2, 0.7, 8); gFlame.translate(0, 0.35, 0);
    const gArrowHead = new ConeGeometry(0.2, 0.4, 12); gArrowHead.rotateX(Math.PI);   // the point down
    const gArrowShaft = new CylinderGeometry(0.065, 0.065, 0.36, 8);
    const mArrow = new MeshBasicMaterial({ color: 0xffc83a });
    const gStick = new CylinderGeometry(0.04, 0.04, 1.3, 6); gStick.translate(0, 0.65, 0);
    // a standing figure: the group's +z is the way it faces; hat = the migba'at (its own object: the appointed one lifts it);
    // hand = the right arm: `hand.visible = true` stretches it forward with a finger out ("הצביעו")
    const figure = (robe, sash, beard) => {
      const f = new Group(), n = beard || 0;
      const body = new Mesh(gRobe, robe);
      body.castShadow = true;
      f.add(body);
      f.add(new Mesh(gSkinStill, mSkin));
      if (sash) { const sm = new Mesh(gSashDyed, mSash); f.add(sm); SASHES.push(sm); }
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
      armR.add(new Mesh(gHand, mSkin));
      const fin = new Mesh(gFinger, mSkin);
      fin.visible = false;
      armR.add(fin);
      f.add(armR);
      const hand = { on: false, get visible() { return this.on; }, set visible(v) { this.on = !!v; const a = v ? ARM_OUT : ARM_DOWN; armR.rotation.set(a[0], 0, a[1]); fin.visible = !!v; } };
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
      f.userData = { body, hat, hand, robe, arrow, tip: new Vector3(-SH_X, 1.47, 0.83) };
      f.scale.setScalar(FS * (0.97 + rnd() * 0.06));
      g.add(f);
      return f;
    };
'''

if 'PAYIS_FIGURE3' not in s:
    a = s.index("    const FS = 1.4;")
    b = s.index("    const face = (f, x, z) =>")
    s = s[:a] + NEW + s[b:]
    rep("    const mSkin = mat(0xc99a73, { roughness: 0.8 }), mElder = mat(0xd8caa2);\n",
        "    const mSkin = mat(0xcfa07a, { roughness: 0.8 }), mElder = mat(0xd8caa2);\n")
    rep("    const stripes = (on) => { for (const m of SASHES) m.material = on ? mSashDyed : mSashWhite; };\n",
        "    const stripes = (on) => { for (const m of SASHES) m.geometry = on ? gSashDyed : gSashWhite; };\n")

if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 8 applied')
else:
    print('55-payis.js: unchanged')

# ---- round 8b (after the first pictures): the migba'at's folds broad and soft (they were a screw's thread, jagged at the edge); the
# eyes open and a little larger, the brows level (the face looked tired); the lips small; the beard one full body with the tips of
# its locks at its edge (the locks stood apart like fingers); the shoulders not puffed
s = io.open(P, encoding='utf-8').read()
s0 = s
if 'PAYIS_FIGURE3B' not in s:
    rep("    const gHat = surf(84, 44, (u, v, o) => {\n      const a = u * TAU + Math.PI, f = ((6 * (u - 0.72 * v)) % 1 + 1) % 1, w = f < 0.14 ? f / 0.14 : 1 - (f - 0.14) / 0.86;\n"
        "      const amp = 0.02 * sstep(0.1, 0.2, v) * (1 - sstep(0.86, 1, v)),",
        "    // PAYIS_FIGURE3B: the folds broad and soft\n"
        "    const gHat = surf(120, 60, (u, v, o) => {\n      const a = u * TAU + Math.PI, f = ((5 * (u - 0.66 * v)) % 1 + 1) % 1, w = f < 0.3 ? sstep(0, 0.3, f) : 1 - sstep(0.3, 1, f);\n"
        "      const amp = 0.019 * sstep(0.1, 0.2, v) * (1 - sstep(0.86, 1, v)),")
    rep("      o.c = (1 - (amp > 0.001 ? 0.3 * (amp / 0.02) * Math.pow(1 - w, 2.2) : 0)) * (1 - 0.26 * groove);",
        "      o.c = (1 - (amp > 0.001 ? 0.26 * (amp / 0.019) * Math.pow(1 - w, 2) : 0)) * (1 - 0.24 * groove);")
    rep("const HEAD_Y = 2.075, HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1125], ER = 0.0215;",
        "const HEAD_Y = 2.075, HR = [0.128, 0.16, 0.14], EYE = [0.047, 0.014, 0.1105], ER = 0.0238;")
    rep("parts.push(skin(at(rot(sph(ER * 1.07, ER * 1.07, ER * 1.07, 12, 6, 0, TAU, 0, 0.82), 0.5), sd * EYE[0], EYE[1], EYE[2])));",
        "parts.push(skin(at(rot(sph(ER * 1.07, ER * 1.07, ER * 1.07, 12, 6, 0, TAU, 0, 0.64), 0.5), sd * EYE[0], EYE[1], EYE[2])));")
    rep("parts.push(skin(at(rot(sph(ER * 1.06, ER * 1.06, ER * 1.06, 12, 5, 0, TAU, 0, 0.6), Math.PI - 0.42), sd * EYE[0], EYE[1], EYE[2])));",
        "parts.push(skin(at(rot(sph(ER * 1.06, ER * 1.06, ER * 1.06, 12, 5, 0, TAU, 0, 0.52), Math.PI - 0.42), sd * EYE[0], EYE[1], EYE[2])));")
    rep("parts.push(at(rot(sph(0.03, 0.0075, 0.011, 8, 5), 0, 0, -sd * 0.14), sd * EYE[0], 0.05, 0.1265));",
        "parts.push(at(rot(sph(0.031, 0.0078, 0.011, 8, 5), 0, 0, -sd * 0.04), sd * EYE[0], 0.0545, 0.1255));")
    rep("      parts.push(flatUV(at(sph(0.027, 0.0075, 0.012, 10, 6), 0, -0.084, 0.124), 0.766, 0.2));   // the lips",
        "      parts.push(flatUV(at(sph(0.021, 0.0052, 0.01, 10, 6), 0, -0.0865, 0.1215), 0.766, 0.2));   // the lips")
    rep("      c.fillStyle = \"#a9584b\";\n      c.fillRect(372, 190, 40, 30);", "      c.fillStyle = \"#9c5347\";\n      c.fillRect(372, 190, 40, 30);")
    # the beard: one body, the locks' tips at its edge
    a = s.index("      const lock = (t, back) => {")
    b = s.index("      parts.push(sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 20, 6, 0, TAU, 0, 1.08));", a)
    s = s[:a] + (
        "      // the beard's body: full, from the mouth's line down, leaning forward to lie on the chest\n"
        "      parts.push(at(rot(sph(0.097, 0.118, 0.058, 16, 12), -0.27), 0, -0.192, 0.104));\n"
        "      // the locks on it: thin, pointed, of uneven lengths - their tips make its edge\n"
        "      const lock = (t, layer) => {\n"
        "        const L = (0.2 - layer * 0.035) * (1 - 0.5 * t * t) * (0.86 + rnd() * 0.28), wd = 0.015 + rnd() * 0.006;\n"
        "        const q = sph(1, 1, 1, 7, 8), p = q.attributes.position;\n"
        "        for (let i = 0; i < p.count; i++) { const y = p.getY(i), k = y < 0 ? 1 - 0.55 * y * y : 1; p.setXYZ(i, p.getX(i) * wd * k, y * L / 2, p.getZ(i) * 0.02 * k); }\n"
        "        q.computeVertexNormals();\n"
        "        q.rotateY(rnd() * 3);\n"
        "        q.translate(0, -L / 2 + 0.02, 0);\n"
        "        q.rotateZ(t * 0.3 + (rnd() - 0.5) * 0.14);\n"
        "        q.rotateX(-0.25 - rnd() * 0.06);\n"
        "        q.translate(0.084 * t, -0.1 + 0.04 * t * t + layer * 0.012, 0.118 * Math.sqrt(1 - 0.6 * t * t) - 0.002 - layer * 0.012);\n"
        "        return q;\n"
        "      };\n"
        "      for (let i = 0; i < 11; i++) parts.push(lock(-1 + i / 5, 0));\n"
        "      for (let i = 0; i < 10; i++) parts.push(lock(-0.9 + i / 5, 1));\n") + s[b:]
    rep("    const BZ = 0.78, SH_X = 0.262, SH_Y = 1.765, BEND = 0.34, UP = 0.36, FORE = 0.36;", "    const BZ = 0.78, SH_X = 0.252, SH_Y = 1.758, BEND = 0.34, UP = 0.36, FORE = 0.36;")
    rep("white(at(sph(0.086, 0.084, 0.08, 16, 12), -SH_X, SH_Y, 0)), white(at(sph(0.086, 0.084, 0.08, 16, 12), SH_X, SH_Y, 0)),",
        "white(at(sph(0.072, 0.07, 0.07, 16, 12), -SH_X, SH_Y, 0)), white(at(sph(0.072, 0.07, 0.07, 16, 12), SH_X, SH_Y, 0)),")
    rep("      at(new CylinderGeometry(0.066, 0.057, UP, 14), 0, -UP / 2, 0),\n", "      at(new CylinderGeometry(0.068, 0.057, UP, 14), 0, -UP / 2, 0),\n")
if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 8b applied')
else:
    print('55-payis.js: round 8b unchanged')
