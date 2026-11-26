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
    // FACE_E (fix-e, 22.11.2026; the user's decision 169 b: "מבנה הפרצוף יותר אמיתי" - the faces of all the near figures after the picture
    // he sent): the skin, the eyes, the brows, the nose, the mouth, the ears, the beard, the moustache and the hair are the one
    // construction of shared/frag/face.js (tm_face - built once in a house, for this kit and for the crowds' near figures alike). Until
    // now here: a ball of a head with a nose, lids and lips of small balls on it, round eyes, and a beard of one smooth sheet (FACE_A2,
    // FACE_REAL_A2 - the user: "הפרצוף עצמו קצת נראה כבובה")
    const FACE = tm_face();
    const mRobe = mat(0xffffff, { map: texRobe, vertexColors: true, roughness: 0.92 });   // PAYIS_WHITE: one white for every priest
    const mHat = mat(0xffffff, { vertexColors: true, roughness: 0.93 });
    const mFace = mat(0xffffff, { map: FACE.tex.skin, roughness: 0.74 });
    const mEye = mat(0xffffff, { map: FACE.tex.eye, roughness: 0.14 });
    // tekhelet, argaman ("הצבוע אדום"), tola'at shani, and the white of the linen
    const mSashDyed = mat(0xffffff, { map: weave([["#3d62ab", 4.2], ["#8e1f34", 3.1], ["#c5432b", 1.3], ["#e6e1d3", 1]]), vertexColors: true, roughness: 0.88 });
    const mSashWhite = mat(0xffffff, { map: weave([["#f7f5ee", 4], ["#e0dbcc", 3], ["#ffffff", 2], ["#cfc9b7", 1]]), vertexColors: true, roughness: 0.88 });
    // BLOND_441b (the user 26.11.2026: most of the priests blond, true blond; elders few): five of the seven blond - honey-gold, taken from the user's own picture (26.11.2026: "איכס איזה צבע! תחפש באינטרנט" - its hair #a57a52..#c69368) and measured on the screen: the hair's light and sheen wash a colour out, so the colours here are more saturated than what is seen; 0 white and 4 grey (the elders)
    const mBeards = [0xf4f2ec, 0xffb850, 0xf0a040, 0xffc468, 0xbdbab2, 0xe08a30, 0xf4a848].map((c) => mat(c, { map: texHair, vertexColors: true, roughness: 0.95, side: DoubleSide })), mBeardOld = mBeards[0];
    const SASHES = [];   // every avnet's mesh: dyed in the Rambam's reading, white in "של בוץ"
    // ---------- the head (its middle at HEAD_Y): FACE_E - the skull as before (headR: the hats, the mitznefet, the kippot and the
    // tefillin's strap sit on it), the face, the jaw, the ears, the eyes and the hair of shared/frag/face.js
    const HEAD_Y = 2.075, HR = FACE.HR, EYE = [FACE.EX, FACE.EY, FACE.EZ + FACE.ER], ER = FACE.ER, HS = 1.045;
    // (the skull's distance from its axis at the angle ph - 0 is the front - and the height y)
    const headR = (ph, y) => {
      const yn = Math.max(-0.999, Math.min(0.999, y / HR[1])), j = yn < 0 ? yn * yn : 0;
      return Math.sqrt(1 - yn * yn) / Math.hypot(Math.sin(ph) / (HR[0] * (1 - 0.2 * j)), Math.cos(ph) / (HR[2] * (1 - 0.1 * j)));
    };
    // FACE_E: TWO LEVELS - the full face near (the opening of the eyes in the skin and their balls, every fold, the beard's locks) and
    // the same face in fewer faces from LOD_FAR amot of the eye (the eyes drawn on the skin); one geometry of each for every figure
    // The near level is made only when a figure first comes near the eye (the load time: nothing of it is built before)
    const LOD_FAR = 9, gHeadLo = FACE.head("lo"), _lv = new Vector3();
    // four beards, a little different: their length below the chin and their waves (the same fixed sequence as until now)
    const HAIRV = [0, 1, 2, 3].map(() => { const w2 = rnd() * 6, len = 0.165 + rnd() * 0.07; return { w2, len }; });
    // (face.js's length is from the chin's foot, -0.153; until now from -0.07 - so that the beards end where they did: less 0.083)
    const hairGeo = (d, k, beard) => { const v = HAIRV[(k || 0) % HAIRV.length]; return FACE.hair({ d, len: v.len - 0.083, w2: v.w2, beard: beard || "full" }); };
    // the head's hair takes the figure's own hair material (its colour) with the hairs' texture of face.js - its edges thinning out to
    // single hairs (alphaTest); near, with a soft sheen along the strands (face.js hairMats)
    const headOn = (f, y, mHair, k, o) => {
      const hg = new Group();
      hg.position.y = y;
      const F = { k: k || 0, beard: (o && o.beard) || "full", mH: FACE.hairMats(mHair), hair: {} }, lod = new LOD(), hi = new Group(), lo = new Group();
      F.hair.lo = new Mesh(hairGeo("lo", F.k, F.beard), F.mH.lo);
      lo.add(new Mesh(gHeadLo, mFace), F.hair.lo);
      lod.addLevel(hi, 0, 0.1);
      lod.addLevel(lo, LOD_FAR, 0.1);
      const fill = () => { F.hair.hi = new Mesh(hairGeo("hi", F.k, F.beard), F.mH.hi); hi.add(new Mesh(FACE.head("hi"), mFace), new Mesh(FACE.eyes(), mEye), F.hair.hi); hi.updateMatrixWorld(true);
        // NOPICK_HEAD_H (fix-h): made late, the near head takes the far one's noPick - else the figures' heads (noPick when built) caught the
        // rays for the floor and the clicks once the eye had come near (the figure for scale stood on a priest's head)
        if (lo.children.some((m) => m.userData && m.userData.noPick)) for (const m of hi.children) m.userData.noPick = true; };   // (made during a frame: placed at once)
      lod.update = function (cam) {
        if (!F.hair.hi && this.getWorldPosition(_lv).distanceTo(cam.position) / (cam.zoom || 1) < LOD_FAR * 1.4) fill();
        return LOD.prototype.update.call(this, cam);
      };
      hg.add(lod);
      hg.userData.face = F;
      f.add(hg);
      return hg;
    };
    // a head without a beard (the Levites' little ones, 55-tamid.js): the brows and the hair only, of the material m (the hair's colour)
    const headBare = (hg, m) => {
      const F = hg.userData.face;
      if (!F) return;
      F.beard = "none";
      if (m) F.mH = FACE.hairMats(m);
      for (const d of ["hi", "lo"]) if (F.hair[d]) { F.hair[d].geometry = hairGeo(d, F.k, "none"); F.hair[d].material = F.mH[d]; }
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
    //@@slot top-note
    const WAIST = 1.0;
    const robeBand = (y0, y1, rows, grow) => surf(40, rows, (u, v, o) => {
      const y = y0 + (y1 - y0) * v, a = u * TAU + Math.PI, k = Math.max(0, (1.3 - y) / 1.2);
      const fold = Math.sin(7 * a + 0.8) * 0.6 + Math.sin(11 * a + 2.1) * 0.4, m = (1 + 0.02 * k * fold) * (typeof grow === "function" ? grow(v) : grow);
      o.x = spl(bX, y) * m * Math.sin(a);
      o.y = y;
      o.z = spl(bZ, y) * m * Math.cos(a);
      o.c = 1 - 0.11 * k * Math.max(0, -fold);
      o.tv = (y - 0.1) / 1.8;
    });
    //@@slot ROWS
    const gRobeAll = robeBand(0.1, 1.9, ROWS, 1);
    const part = (j0, j1) => {
      const q = new BufferGeometry();
      for (const k of ["position", "uv", "color", "normal"]) q.setAttribute(k, gRobeAll.attributes[k]);
      q.setIndex(Array.from(gRobeAll.index.array.slice(j0 * 40 * 6, j1 * 40 * 6)));
      return q;
    };
    const gRobeLow = mergeGeometries([part(0, CUT), robeBand(WAIST - 0.02, WAIST + 0.16, 6, (v) => 0.97 - 0.4 * v * v)]);
    const gRobeUp = part(CUT, ROWS);
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
    // the hand (sd: the arm's side - the thumb is to the front). HAND_A2 (the user: "הידיים נראות מזעזע! אין קשר ביניהם לבין ידיים"): the
    // hand of shared/frag/hand.js (tm_hand) - a palm, four fingers of three joints, a thumb - in this kit's old frame: the wrist HAND_W
    // over its origin (the places that put it - handW, hand(side, fo), handOpen - as they were), turned so that the palm is toward the
    // body and the thumb to the front. pose: "rest" (a little bent), "open", "flat", "grip", "point". Until now a ball and four
    // sausages, half the size (the palm 0.08 long; now the hand 0.232 - about the face, chin to hairline)
    const HAND_W = 0.045;
    // HAND_SDF_A2: the hand's skin - the face's own material (its texture's plain skin: tm_hand's uv), with the hand's vertex colours
    // (the shade between the fingers, the nails, the palm) - so the hands are of the face's tone (with fix-e's face.js: its new texture)
    const mHand = mFace.clone();
    mHand.vertexColors = true;
    const handRaw = (sd, pose = "rest", low = false, mid = false) => { const q = tm_hand({ sd, pose, low, mid }).geo.clone(); q.translate(0, HAND_W, 0); q.rotateY(sd * 0.95); return q; };
    // the hand in its own wrist's frame (the wrist at 0), in amot - as the houses' handW; one geometry per side and pose (shared)
    const HWR = {};
    const handWr = (sd, pose = "rest", mid = false) => { const k = (sd > 0 ? 1 : -1) + pose + (mid ? "m" : ""); return HWR[k] || (HWR[k] = handRaw(sd, pose, false, mid).translate(0, -HAND_W, 0).scale(FS, FS, FS)); };   // HAND_SDF_A2: mid - in fewer faces
    // places on the hand, in its wrist's frame (amot): the middle of the closed hand's ring - where a handle lies (grip) - and the palm's middle
    // HAND_GRIP_A2: what - "grip" (round a handle), "fist" (round a thin rod) or "gripW" (on the ark's thick staff): the ring's middle; "gripAx" / "fistAx": the handle's way
    // through it (a unit vector, from the little finger's side to the first finger's); else the palm's middle
    const handAt = (sd, what) => {
      const ax = /Ax$/.test(what), pose = what.replace(/Ax$/, ""), closed = pose === "grip" || pose === "fist" || pose === "gripW", H = tm_hand({ sd, pose: closed ? pose : "rest" });
      const v = ax ? H.sk.gripAx.clone() : closed ? H.sk.grip.clone() : new Vector3(0, -H.sk.PM, -0.012);
      v.applyAxisAngle(new Vector3(0, 1, 0), sd * 0.95);
      return ax ? v : v.multiplyScalar(FS);
    };
    const handOpen = (sd) => foreAt(handRaw(sd), FORE + 0.045);   // PRIEST_KIT_207: the same hand (handRaw: in its own frame, for 55-tamid.js)
    // the hand of "הצביעו": closed, one finger out (HAND_A2: tm_hand "point", the right hand)
    const handPoint = () => foreAt(handRaw(-1, "point"), FORE + 0.045);
    const armPlace = (q, sd) => at(rot(q, -0.04, 0, sd * 0.17), sd * SH_X, SH_Y, 0);     // the arms a little away from the body
    const gRobe = mergeGeometries([gRobeBody, armPlace(sleeveGeo(), 1)]);
    // (the skin that does not move: the neck, the left hand, the ankles and the bare feet - a little apart, the toes outward)
    const footGeo = (sd) => mergeGeometries([at(new CylinderGeometry(0.034, 0.04, 0.14, 8), sd * 0.1, 0.1, -0.01), at(rot(sph(0.043, 0.027, 0.098, 10, 6), 0, sd * 0.22, 0), sd * 0.108, 0.027, 0.095)]);
    const gSkinStill = mergeGeometries([at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), footGeo(-1), footGeo(1)]);
    const gHandStill = armPlace(handOpen(1), 1);   // HAND_SDF_A2: the left hand apart (its material mHand - its own vertex colours)
    // (the right arm moves: it hangs, and at "הצביעו" it is stretched forward, one finger out)
    const gSleeve = sleeveGeo(), gHandOpen = handOpen(-1), gHandPoint = handPoint();
    const ARM_DOWN = [-0.04, -0.17], ARM_OUT = [-1.15, -0.05];
    // ---------- the avnet: one band at the elbows' height, lying on the kutonet
    // AVNET_211 (the user: "אבנט הכהנים רחב יותר"): broader, and its turns seen - three turns "כרך על גבי כרך" (8:19), each rounded
    const SY0 = 1.312, SY1 = 1.462;
    const gSash = surf(40, 12, (u, v, o) => {
      const tv = (v * 3) % 1, e = Math.max(0, Math.sin(Math.PI * tv)) * (0.55 + 0.45 * Math.sin(Math.PI * v));
      const y = SY0 + v * (SY1 - SY0), a = u * TAU + Math.PI, th = 0.004 + 0.017 * Math.pow(e, 0.35);
      o.x = (spl(bX, y) + th) * Math.sin(a);
      o.y = y;
      o.z = (spl(bZ, y) + th) * Math.cos(a);
      o.c = 0.88 + 0.12 * e;
    });
    // ---------- the migba'at. MIGBAAT_A2 (fix-a2, 22.11.2026; the user: "המגבעות — לשנות את כולן כמו בחוברת", tall, a cone wound with
    // bands; and "להזיז את המגבעות קצת לאחור על הראש, כך שהתפילין ייראו מלפנים"): as the priests of the booklet "אלחנן וחיים שמחים
    // בירושלים" draw it - a tall cone, narrowing a little to a round head, the cloth wound round it in bands, one above another; it sits
    // on the head from the start of the hair up (its lower edge at the hairline all round, a little back), so the head's tefillin are
    // seen before it (gTefR). The Rambam, Klei HaMikdash 8:2 (338:124): "ומצנפת האמורה באהרן היא המגבעת האמורה בבניו. אלא שכהן גדול צונף
    // בה כמי שלופף על השבר. ובניו צונפין בה ככובע ולפיכך נקראת מגבעת". Until now (PAYIS_FIGURE4D, the site's drawing 452): an egg, its
    // bands aslant, down to the forehead. Its height, the narrowing and the bands' number - model choices. Its origin stays HAT_Y (the
    // figures place it there); the lower edge is MIG.y0 over it.
    const HAT_H = 0.335, HAT_Y = HEAD_Y + 0.06, ARROW_Y = 2.75;
    // MIGBAAT_CHALAMISH_A2 (the user, on pictures 07-08: "נוראיות, וממש לא דומות לזו שבחלמיש" - A-10, A-11, B-03, B-07, B-22): as the
    // booklet draws it - a tall white cylinder, hardly narrowing, about half as high again as the head, its head a low round dome; the
    // cloth wound round it in bands that run ASLANT (three bands going round together), a soft fold between them; it sits back on the
    // crown, a little tilted back, its lower edge from just over the ears round the back of the head, and in front it rises over the
    // head's tefillin - the box and the strap lie on the hair, the hat above and behind them, nothing between (the user, after
    // Shulchan Aruch OC 27:4, 382:231: "לא יהא דבר חוצץ בין תפילין לבשרו"; "גם רצועה לא עוברת מעל" - the strap round the head under its
    // edge). Its measures, the tilt and the bands - model choices. Until now: a cone of six level bands, its edge round the head at
    // one height. Its origin stays HAT_Y (the figures place it there).
    const MIG = { y0: 0.012, H: 0.41, rx: 0.122, rz: 0.132, top: 0.58, back: -0.014, bands: 5.5, starts: 2, lift: 0.06, tilt: 0.12 };
    const hatSurf = (P, bandsOn) => (u, v, o) => {
      const a = u * TAU + Math.PI, body = 0.86, k = v < body ? v / body : 1, fr = Math.pow(Math.max(0, Math.cos(a)), 2);
      let R = 1 - (1 - P.top) * Math.pow(k, 0.95), y = P.y0 + P.lift * fr * Math.pow(1 - k, 1.4) + v * P.H;   // MIGBAAT_CONE_A2: a cone narrowing upward
      if (v > body) { const w = (v - body) / (1 - body); R = P.top * Math.sqrt(Math.max(0, 1 - w * w)); y = P.y0 + body * P.H + w * P.top * P.rz * 1.0; }
      const t = (((v / body) * P.bands + u * P.starts) % 1 + 1) % 1, on = bandsOn ? (v < body ? sstep(0.0, 0.04, v) : 1 - sstep(body, 0.97, v)) : 0;
      const r = R * (1 + on * (0.045 * (1 - t) * (1 - t) - 0.01));
      const x = r * P.rx * Math.sin(a), z = r * P.rz * Math.cos(a) + P.back, c = Math.cos(P.tilt), sn = Math.sin(P.tilt);
      o.x = x;
      o.y = y * c + z * sn;            // tilted back: the front up, the top back
      o.z = -y * sn + z * c;
      o.c = 1 - on * (Math.exp(-t / 0.07) * 0.36 + 0.06 * Math.pow(t, 3));
    };
    const gHat = surf(48, 44, hatSurf(MIG, true));
    // TEFILLIN_A2 (fix-a2; the user's decision 67, 22.11.2026): THE HEAD'S TEFILLIN on every priest - Zevachim 19a (130:737-743):
    // "כֹּהֲנִים בַּעֲבוֹדָתָן... פְּטוּרִין מִן הַתְּפִלָּה וּמִן הַתְּפִילִּין"; "הָא דְּיָד, הָא דְּרֹאשׁ" (the arm's comes between, the head's does
    // not); "שְׂעָרוֹ הָיָה נִרְאֶה בֵּין צִיץ לְמִצְנֶפֶת, שֶׁשָּׁם מַנִּיחִין תְּפִילִּין". At the start of the hair (the user: "בתחילת צמיחת השער"):
    // the box (bayit) on its base (titura), the strap round the head to the knot behind, and its two ends down before the shoulders.
    // Not by night, nor on Shabbat, a festival or its middle days (the user, 01:04) - the houses' demonstrations hide them (tefSet).
    // In the head's frame (its middle at 0). Their size (a little over four fingers) and the straps' length - model choices.
    const TEF = { on: true, list: [] };
    const tefSet = (on) => { TEF.on = !!on; for (const m of TEF.list) m.visible = TEF.on; };
    // TEF_MATTE_A2 (the coordinator: the box's base "מחזיר אור ונראה בהיר מקרוב"): black and matte, the box, its base and the straps alike -
    // rough, and hardly any light of the sky on it (until now roughness 0.42: at a slant the flat base shone pale)
    const mTef = mat(0x0b0b0b, { roughness: 0.92, metalness: 0.0, envMapIntensity: 0.15 });
    // TEFILLIN_PLACE_A2 (the user: "תעשה במקומם, גם מבחינת הרצועות שסביב הראש. אל תחרטט"; the box smaller): Shulchan Aruch OC 27:9
    // (382:236) "מהתחלת עיקרי השער ממצחו עד סוף המקום שמוחו של תינוק רופס" - the box's foot at the start of the hair (the hair's edge
    // here at y 0.079 over the head's middle), in the middle, over between the eyes; 27:10 (382:237) "צריך שיהיה הקשר מאחורי הראש למעלה
    // בעורף... באמצע העורף ולא יטה לכאן או לכאן" - the strap from the box round the head, over the ears, to the knot behind, at the top of
    // the nape, in its middle; 27:11 (382:238) "ישלשל הרצועות שיהיו תלוים לפניו ויגיעו עד הטבור או למעלה ממנו מעט" - the two ends from
    // the knot over the shoulders and down before him, the right to the navel, the left a little shorter (the user). Until now the box
    // was 0.052 and the ends stopped at the chest. Their thickness - a model choice.
    const TY = 0.1, TB = 0.04;   // the box's middle over the head's, and its side
    // TEF_ROSH_A2 (the user: "החוט צריך להיות לפני הקציצה ולא לאחריה!"): the head's tefillin of shared/frag/strap.js (tm_tefRosh) -
    // the strap out of the passage behind the box, round the head to the knot; nothing before the box. Until now a ring with the box on
    // it, the strap going on before it over the forehead. One geometry per height of the box (o.TY - the high priest's: under the mitznefet)
    const GTR = {};
    const gTefRAt = (ty = TY) => GTR[ty] || (GTR[ty] = tm_tefRosh({ HR, headR, TY: ty, TB, ends: true }));
    const gTefR = gTefRAt(TY);
    // the head's tefillin on a head made by headOn (its group): priests only - the figures that are priests ask for it
    // TEF_ENDS_BODY_420: the head's part on the head; its two hanging ends on the head's parent (the neck, the body) at the head's place,
    // not turned with the head - a head turned a little swung one end into the chest and the other into the air (a head with no parent yet: as before)
    const GTH = {}, GTE = {};
    const gTefHeadAt = (ty = TY) => GTH[ty] || (GTH[ty] = tm_tefRosh({ HR, headR, TY: ty, TB, ends: false }));
    const gTefEndsAt = (ty = TY) => GTE[ty] || (GTE[ty] = tm_tefRosh({ HR, headR, TY: ty, TB, ends: "only" }));
    const tefOn = (hg, o) => {
      const ty = o && o.TY != null ? o.TY : TY, P = hg.parent;
      const m = new Mesh(P ? gTefHeadAt(ty) : gTefRAt(ty), mTef); m.name = "tefillin-rosh"; m.visible = TEF.on; hg.add(m); TEF.list.push(m);
      if (P) { const e = new Mesh(gTefEndsAt(ty), mTef); e.name = "tefillin-rosh-ends"; e.position.copy(hg.position); e.scale.copy(hg.scale); e.visible = TEF.on; P.add(e); TEF.list.push(e); m.userData.tefEnds = e; }
      return m;
    };
    // TEFILLIN_A2: THE ARM'S, for the Levites (the user, 00:58: "תפילין גם ללויים" - no priestly garments, nothing between): on the left
    // arm's upper part. up / fo: the arm's two lengths in its own frame (the shoulder at 0, the elbow at -up; the forearm from the elbow,
    // 0 .. -fo); rU / rF: their radii.
    // LEVITE_SLEEVE_A2 (the user's decision 96, corrected): the sleeve is NOT rolled up - the box lies on the flesh under the sleeve
    // ("בזרוע שמאל, בבשר התופח שבעצם שבין הקובד"ו ובית השחי, ויטה התפלה מעט לצד הגוף", Shulchan Aruch OC 27:1 - 382:228), seen only as a
    // bulge in the garment over it (sleeveMat: the sleeve's own material); the strap wound round the arm under the sleeve, seen only where
    // it comes out by the hand (wrist: the hand's own group - a turn round the palm below the sleeve's end; sd: the arm's side)
    const tefArm = (shoulder, elbow, up, fo, rU, rF, sleeveMat, wrist, sd = 1) => {
      const list = [];
      if (sleeveMat) {
        const dir = new Vector3(Math.sin(-0.6), 0, Math.cos(-0.6)), rs = rU * 0.915 - 0.004;
        // a rounded cube under the cloth (the box and its titura), not a ball
        const bg = sph(1, 1, 1, 16, 12), bp = bg.attributes.position;
        for (let i = 0; i < bp.count; i++) { const x = bp.getX(i), y = bp.getY(i), z = bp.getZ(i), f = (u) => Math.sign(u) * Math.pow(Math.abs(u), 0.45); bp.setXYZ(i, f(x) * TB * 0.82, f(y) * TB * 0.8, f(z) * TB * 0.5); }
        bg.computeVertexNormals();
        const bump = new Mesh(white(bg), sleeveMat);
        bump.name = "tefillin-bulge";
        bump.position.set(dir.x * rs, -up * 0.5, dir.z * rs);
        bump.rotation.y = -0.6;
        shoulder.add(bump);
        list.push(bump);
      }
      // TEF_WRAP_A2 (the user's decision 119, via the coordinator - Shulchan Aruch OC 27:8, 382:235: "ותמתח על אצבע אמצעית ויכרוך ממנה על
      // אצבעו שלשה כריכות ויקשור, ונוהגים העולם לכרוך על הזרוע ששה או שבעה כריכות"): seven turns round the forearm, under the sleeve
      // (elbow: the forearm's group, 0 .. -fo along its -y; not seen but in a section), and from the wrist the strap comes out on the
      // back of the hand to the middle finger, and three turns round it (wrist: the hand's own group - in the hand's frame, tm_hand,
      // then turned and scaled FS). Until now a turn and a half round the palm. TEF_STRAP_A2: a flat strap of leather (tm_strap),
      // not a round cord. Its breadth, the turns' spacing and where on the finger - model choices.
      const SW = 0.0105, ST = 0.0016;   // the strap on the arm, kit units: its breadth and thickness
      if (elbow && fo > 0) {
        const N7 = 7, per = 20, pts = [], rS = (y) => FS * (0.056 - 0.01 * (-y / fo));   // the sleeve's radius along the forearm (fore())
        for (let k = 0; k <= N7 * per; k++) {
          const u = k / (N7 * per), th = sd * u * N7 * TAU + 0.6, y = -fo * (0.22 + 0.74 * u), r = rS(y) * 0.8;
          pts.push(new Vector3(Math.sin(th) * r, y, Math.cos(th) * r));
        }
        const g = tm_strap(pts, (p) => new Vector3(p.x, 0, p.z), SW * FS, ST * FS, false, N7 * 48);
        const m = new Mesh(g, mTef);
        m.name = "tefillin-yad-arm";
        elbow.add(m);
        list.push(m);
      }
      if (wrist) {
        // HAND_A2: on the hand of tm_hand ("rest" - the Levites' hands do not change their pose), in its frame before it is turned: the
        // wrist at 0, the fingers down, its back toward +z, the thumb at -sd x. Out of the sleeve on the little finger's side, aslant
        // across the back of the hand to the middle finger's knuckle, and three turns round its first joint, from the knuckle down
        const H = tm_hand({ sd, pose: "rest" }), MF = H.sk.fingers[1], back = H.sk.back, lift = ST / 2 + 0.0007, pts = [];
        const K0 = MF.j[0];
        for (const [x, y] of [[sd * 0.02, 0.032], [sd * 0.023, 0.012], [sd * 0.02, -0.012], [sd * 0.013, -0.045], [sd * 0.003, -0.078], [K0.x * 0.75, -0.105], [K0.x, -0.12]])
          pts.push(new Vector3(x, y, Math.max(back(x, y), 0.006) + lift));
        const A0 = MF.j[0], A1 = MF.j[1], ax = A1.clone().sub(A0), alen = ax.length();
        ax.normalize();
        const e2 = new Vector3(0, 0, 1).addScaledVector(ax, -ax.z).normalize(), e1 = new Vector3().crossVectors(ax, e2);
        const NT = 3, per = 24, R0 = MF.r[0];
        for (let k = 0; k <= NT * per; k++) {
          const u = k / (NT * per), th = sd * u * NT * TAU, at = A0.clone().addScaledVector(ax, alen * (0.18 + 0.64 * u)), r = R0 + lift;
          pts.push(at.addScaledVector(e2, Math.cos(th) * r).addScaledVector(e1, Math.sin(th) * r));
        }
        const onFinger = (p) => { const q = p.clone().sub(A0), t = q.dot(ax); return t > alen * 0.1 ? q.addScaledVector(ax, -t) : null; };
        const nrm = (p) => onFinger(p) || new Vector3(0, 0, 1);
        const g = tm_strap(pts, nrm, SW * 0.82, ST, false, 260);
        g.rotateY(sd * 0.95);   // as handRaw
        g.scale(FS, FS, FS);
        const m = new Mesh(g, mTef);
        m.name = "tefillin-yad-hand";
        wrist.add(m);
        list.push(m);
      }
      for (const m of list) { m.visible = TEF.on; TEF.list.push(m); }
      return { list };
    };
    // KIDDUSH_FLAT_A2 (the user via the coordinator, 22.11.2026: "כף היד על כף הרגל, וכך שניהם בו זמנית" - the palm flat on the back
    // of the foot, the right on the right and the left on the left, at once; not over it in the air and not on the shin): "מניח ידו הימנית
    // על גבי רגלו הימנית, וידו השמאלית על גבי רגלו השמאלית, ומקדש" (Zevachim 19b, 130:754), "ושוחה ומקדש" (the Rambam, Biat HaMikdash
    // 5:16, 340:93). For a figure with a waist (both houses: f.bend at the waist, f.L / f.R = { sh, el, wr }, f.A = the arm's { sx, sy,
    // up, fo } in amot): his feet together (x +-FX) and a little forward from under the hem (DZ); he bows at the waist as far as both
    // hands need (th - the least); each hand on its foot's forepart, the palm down, the fingers toward the toes (turned out with the foot),
    // the thumb inward. setArm(A, [x, abduct, elbow], side) - the house's own (the same in both). Found once per figure (f.kidH):
    // { th, arm: { 1, -1 }, wq: { 1, -1 } (the wrists' turns), fx, dz } - in amot. How far forward, how close - model choices.
    const KID_FX = 0.064, KID_DZ = 0.06;
    const kidHZ = (0.095 + KID_DZ + 0.05 * Math.cos(0.22)) * FS;   // the hands' middle before him (amot) - where the stream falls (55-tamid.js KID.flatSpot)
    // KIDDUSH_RYOSE_A2 (the user's decision 82 c, via the coordinator): mode "ryose" - Rabbi Yose b. R. Yehuda, "מניח שתי ידיו זו על גב
    // זו, ועל גבי שתי רגליו זו על גבי זו, ומקדש" (Zevachim 19b, 130:754-755): he stands on his left foot, his right foot laid on the back
    // of it (the right leg: kidLegs), his left palm on the back of the right foot and his right palm on the back of the left hand - and
    // his fellow holds him ("וחבירו מסייעו" - the house's own figure). Which foot is above and which hand - model choices.
    // Every place in the kit's units in the figure's frame: KF - the feet (x, y, z, pitch, yaw), KP - the palms' middles
    const KIDM = {
      tk: { feet: { 1: [KID_FX, 0, KID_DZ, 0, 0], "-1": [-KID_FX, 0, KID_DZ, 0, 0] }, palms: null, leg: 0 },
      ryose: { feet: { 1: [0.045, 0, KID_DZ, 0, 0], "-1": [0.03, 0.046, KID_DZ + 0.03, 0.12, 0.18] },
        palms: { 1: [0.045, 0.106, KID_DZ + 0.13], "-1": [0.04, 0.131, KID_DZ + 0.118] }, leg: -1 }
    };
    const kidHands = (f, setArm, mode = "tk") => {
      const key = mode === "ryose" ? "kidHY" : "kidH";
      if (f[key]) return f[key];
      const M0 = KIDM[mode === "ryose" ? "ryose" : "tk"];
      const A = f.A, WY = f.bend.position.y, a = A.up, b = A.fo;
      const cl = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
      const reach = (sp, tp, side) => {   // as 55-tamid.js reach: the shoulder's two turns and the elbow's, the wrist at tp
        const vx = tp[0] - sp[0], vy = tp[1] - sp[1], vz = tp[2] - sp[2], D3 = Math.hypot(vx, vy, vz) || 1e-6;
        const al = Math.asin(cl(vx / D3, -0.9, 0.9)), ca = Math.cos(al);
        const Dp = Math.min(Math.hypot(vy, vz), (a + b) * ca - 1e-4), a2 = a * ca, b2 = b * ca;
        const be = Math.acos(cl((a2 * a2 + Dp * Dp - b2 * b2) / (2 * a2 * Dp), -1, 1)), ga = Math.acos(cl((a2 * a2 + b2 * b2 - Dp * Dp) / (2 * a2 * b2), -1, 1));
        return [Math.atan2(-vz, -vy) + be, side * al, -(Math.PI - ga)];
      };
      const fin = {}, palmN = {}, wrist = {};
      for (const sd of [1, -1]) {
        const ft = M0.feet[sd], ry = M0.palms ? ft[4] * 0.5 : sd * 0.22, cy = Math.cos(ry), sy = Math.sin(ry);   // the foot turned out (footGeo)
        const F = new Vector3(0.95 * sy, -0.3, 0.95 * cy).normalize();
        const N = new Vector3(-0.3 * sy, -1, -0.3 * cy).normalize();
        N.addScaledVector(F, -N.dot(F)).normalize();
        fin[sd] = F; palmN[sd] = N;
        // the palm's middle: on its own foot's forepart (the foot's middle z 0.095 + DZ, 0.05 before it; its top 0.05 there), or as KP
        const P = M0.palms ? new Vector3(M0.palms[sd][0], M0.palms[sd][1], M0.palms[sd][2]) : new Vector3(sd * (KID_FX + 0.008 + 0.05 * sy), 0.066, 0.095 + KID_DZ + 0.05 * cy);
        wrist[sd] = P.addScaledVector(F, -tm_hand({ sd, pose: "flat" }).sk.PM).multiplyScalar(FS);   // HAND_A2: the middle of the palm from the wrist (0.045 until now)
      }
      // KIDDUSH_TOUCH_K (fix-k, 23.11.2026 - the user via the coordinator: "היד באמת שטוחה על גב הרגל, בלי רווח ובלי חדירה"): each palm laid
      // ON the back of its foot - neither over it nor in it: the hand's own vertices (hand.js "flat", turned as it lies) against the foot
      // (footGeo's ellipsoid, where kidLegs sets it), the hand moved along its palm's normal until its nearest point touches (a hair in). In
      // R. Yose's reading the left palm on the right foot laid on the left, and the right palm on the back of the left hand (its vertices).
      // Until now the palm's middle was set by a measure (0.066 over the floor) - the right hand was 0.023 amah into its foot, the left 0.013
      const qOf = (sd) => {
        const Fh = new Vector3(0, -1, 0), Nh = new Vector3(-sd * Math.sin(0.95), 0, -Math.cos(0.95)), Bh = new Vector3().crossVectors(Fh, Nh);
        const Bt = new Vector3().crossVectors(fin[sd], palmN[sd]);
        return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(fin[sd], palmN[sd], Bt).multiply(new Matrix4().makeBasis(Fh, Nh, Bh).transpose()));
      };
      const ptsOf = (sd, W) => { const g = tm_hand({ sd, pose: "flat" }).geo.attributes.position, q = qOf(sd), Y = new Vector3(0, 1, 0), out = []; for (let i = 0; i < g.count; i++) out.push(new Vector3(g.getX(i), g.getY(i), g.getZ(i)).applyAxisAngle(Y, sd * 0.95).applyQuaternion(q).add(W)); return out; };
      const footSD = (p, sf) => {   // kit units, the figure's frame
        const ft = M0.feet[sf], e = new Euler(ft[3], ft[4], 0), Ri = new Quaternion().setFromEuler(e).invert();
        const l = p.clone().sub(new Vector3(ft[0], ft[1], ft[2])).applyQuaternion(Ri).sub(new Vector3(sf * 0.008, 0.027, 0.095)).applyAxisAngle(new Vector3(0, 1, 0), -sf * 0.22);
        const r0 = 0.043, r1 = 0.027, r2 = 0.098, a = l.x / r0, b = l.y / r1, c = l.z / r2, k0 = Math.hypot(a, b, c), k1 = Math.hypot(a / r0, b / r1, c / r2);
        return k1 > 1e-9 ? (k0 * (k0 - 1)) / k1 : -r1;
      };
      // (to 0.003 off it in kit units: the arms that the houses then turn to these wrists bring each hand down 0.004 - 0.012 amah more - the
      // measured hands then lie 0 - 0.009 amah into the foot's surface, touching it)
      const settle = (sd, dist) => {   // move hand sd along its palm's normal until dist (its least) is 0.003 (kit units)
        const W = wrist[sd].clone().multiplyScalar(1 / FS);
        for (let it = 0; it < 8; it++) { const m = Math.min(...ptsOf(sd, W).map(dist)); if (Math.abs(m - 0.003) < 0.0002) break; W.addScaledVector(palmN[sd], m - 0.003); }
        wrist[sd] = W.multiplyScalar(FS);
      };
      if (M0.palms) {
        settle(1, (p) => footSD(p, -1));
        const L = ptsOf(1, wrist[1].clone().multiplyScalar(1 / FS)), hs = new Map(), key = (x, y, z) => x + "," + y + "," + z, C = 0.006;
        const Ln = (() => { const g = tm_hand({ sd: 1, pose: "flat" }).geo.attributes.normal, q = qOf(1), Y = new Vector3(0, 1, 0), o = []; for (let i = 0; i < g.count; i++) o.push(new Vector3(g.getX(i), g.getY(i), g.getZ(i)).applyAxisAngle(Y, 0.95).applyQuaternion(q)); return o; })();
        L.forEach((v, i) => { const k = key(Math.floor(v.x / C), Math.floor(v.y / C), Math.floor(v.z / C)); if (!hs.has(k)) hs.set(k, []); hs.get(k).push(i); });
        settle(-1, (p) => { const cx = Math.floor(p.x / C), cy = Math.floor(p.y / C), cz = Math.floor(p.z / C); let best = 1e9, bi = -1;
          for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) { const L2 = hs.get(key(cx + i, cy + j, cz + k)); if (L2) for (const q of L2) { const d2 = p.distanceToSquared(L[q]); if (d2 < best) { best = d2; bi = q; } } }
          return bi < 0 ? 0.01 : p.clone().sub(L[bi]).dot(Ln[bi]); });
      } else for (const sd of [1, -1]) settle(sd, (p) => footSD(p, sd));
      // KIDDUSH_CROUCH_K (fix-k, 23.11.2026 - the coordinator, on the pictures: "הכהן מקופל כמו אולר... הגוף מתחת לקו האופקי, הראש תלוי ליד
      // הרצפה, המגבעת שוכבת הצידה, והרגליים ישרות לגמרי"; the user: "צריך תיקון בהכל"): HE STOOPS AS A MAN STOOPS - bent at the waist 70 degrees
      // (80 at the most; until now as far as the hands needed, 1.5 - 1.8 rad, under the level), and the rest from the knees: the hips go
      // down and back (drop - as little as the hands need; back - 0.55 of it), the knees forward under the kutonet (kidBody bends its lower
      // part); the head lifted on the neck (lift), the face forward and down to the hands, the migba'at on it, its top forward and up.
      // The waist's place standing (WY0) kept on the figure. How far each - a model choice; the hands as before (KIDDUSH_TOUCH_K)
      const WY0 = f.bend.userData.y0 != null ? f.bend.userData.y0 : (f.bend.userData.y0 = f.bend.position.y);
      const toBend = (p, th, d) => { const dy = p.y - (WY0 - d), dz = p.z + 0.55 * d, c = Math.cos(th), s2 = Math.sin(th); return [p.x, dy * c + dz * s2, -dy * s2 + dz * c]; };
      const fits = (th, d) => { for (const sd of [1, -1]) { const t = toBend(wrist[sd], th, d), sp = [sd * A.sx, A.sy - WY0, 0]; if (Math.hypot(t[0] - sp[0], t[1] - sp[1], t[2] - sp[2]) > (a + b) * 0.975) return false; } return true; };
      // (the turn at the waist from 70 to 80 degrees - the one with the hips the least down; the arms nearly straight)
      let th = 1.22, drop = 0.9;
      for (const t0 of [1.22, 1.27, 1.31, 1.35, 1.39]) for (let d0 = 0; d0 < drop - 0.03; d0 += 0.01) if (fits(t0, d0)) { th = t0; drop = d0; break; }
      const res = { mode: M0 === KIDM.ryose ? "ryose" : "tk", th, drop, back: 0.55 * drop, lift: Math.max(0, th - 0.72), arm: {}, wq: {}, fx: KID_FX * FS, dz: KID_DZ * FS, feet: M0.feet, leg: null };
      for (const sd of [1, -1]) res.arm[sd] = reach([sd * A.sx, A.sy - WY0, 0], toBend(wrist[sd], th, drop), sd);
      if (M0.leg) {   // the leg whose foot is laid on the other: hip (down and back with the stoop), knee (two bones, the knee forward), ankle - amot
        const ft = M0.feet[M0.leg], c = Math.cos(ft[3]), sn = Math.sin(ft[3]);
        const H = new Vector3(M0.leg * 0.1, 1.0 - drop / FS, -0.55 * drop / FS), Aa = new Vector3(ft[0], ft[1] + 0.15 * c + 0.01 * sn, ft[2] + 0.15 * sn - 0.01 * c);
        const L1 = 0.45, L2 = 0.401, d = Math.min(L1 + L2 - 1e-4, H.distanceTo(Aa)), u = Aa.clone().sub(H).normalize();
        const al = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - al * al)), n = new Vector3(0, 0, 1).addScaledVector(u, -u.z).normalize();
        const K = H.clone().addScaledVector(u, al).addScaledVector(n, h);
        res.leg = { side: M0.leg, H: H.multiplyScalar(FS), K: K.multiplyScalar(FS), A: Aa.multiplyScalar(FS) };
      }
      // the wrists: the hand's own axes (the fingers down its -y, the palm toward the body - handRaw) to the wanted ones, in the frame of
      // the forearm as it is in this pose
      const lr = f.lean.rotation.x, br = [f.bend.rotation.x, f.bend.rotation.z], bp = [f.bend.position.y, f.bend.position.z];
      f.lean.rotation.x = 0; f.bend.rotation.set(th, 0, 0); f.bend.position.y = WY0 - drop; f.bend.position.z = -0.55 * drop;
      for (const sd of [1, -1]) setArm(sd > 0 ? f.L : f.R, res.arm[sd], sd);
      f.g.updateMatrixWorld(true);
      const qG = f.g.getWorldQuaternion(new Quaternion()).invert(), M1 = new Matrix4(), M2 = new Matrix4();
      for (const sd of [1, -1]) {
        const Fh = new Vector3(0, -1, 0), Nh = new Vector3(-sd * Math.sin(0.95), 0, -Math.cos(0.95)), Bh = new Vector3().crossVectors(Fh, Nh);
        const Ft = fin[sd], Nt = palmN[sd], Bt = new Vector3().crossVectors(Ft, Nt);
        M1.makeBasis(Fh, Nh, Bh); M2.makeBasis(Ft, Nt, Bt);
        const qT = new Quaternion().setFromRotationMatrix(M2.multiply(M1.transpose()));
        const qE = qG.clone().multiply((sd > 0 ? f.L : f.R).el.getWorldQuaternion(new Quaternion()));
        res.wq[sd] = qE.invert().multiply(qT);
      }
      f.lean.rotation.x = lr; f.bend.rotation.set(br[0], 0, br[1]); f.bend.position.y = bp[0]; f.bend.position.z = bp[1];
      return (f[key] = res);
    };
    // KIDDUSH_CROUCH_K: the stoop on the figure, u 0..1 into it (H null - standing): the waist down and back (f.bend), the kutonet's lower
    // part (f.body - gRobeLow) shortened as the hips go down, its top back with them and its middle a little forward (the knees under it),
    // the head lifted at the neck (f.neck) - each house calls it with its own figure; until now only the waist turned
    const robeBow = (m, dk, bk, th = 0, yP = WAIST - dk) => {
      if (!m || !m.geometry) return;
      const key = dk.toFixed(4) + "," + bk.toFixed(4) + "," + th.toFixed(3);
      if (m.userData.bowKey === key) return;
      m.userData.bowKey = key;
      if (dk < 1e-4 && bk < 1e-4) { if (m.userData.bowOrig) m.geometry = m.userData.bowOrig; return; }
      if (!m.userData.bowGeo) { m.userData.bowOrig = m.geometry; m.userData.bowGeo = m.geometry.clone(); m.userData.bowBase = Float32Array.from(m.geometry.attributes.position.array); }
      const g = m.userData.bowGeo, P = g.attributes.position, B = m.userData.bowBase;
      // (the knees under its front, where two bones put them - the thigh from the hip (down and back with the stoop) to the knee, the shin
      // from the knee to the ankle, kit units: the cloth's front goes from the waist along the thigh, nearly level, round the knee and
      // down before the shin, its hem raised to the middle of the shin - the hands on the feet seen under it; its back only shortened, as
      // it hangs from the hips to the heels; a little wider at the knees. Until now the front was carried forward most at the middle of
      // its height - a sack. Standing (dk 0) - as it was)
      const hy = 1.0 - dk, hz = -bk, ay = 0.08, az = KID_DZ, L1 = 0.45, L2 = 0.401;
      const dd = Math.min(L1 + L2 - 1e-4, Math.hypot(hy - ay, hz - az)), uy = (ay - hy) / dd, uz = (az - hz) / dd;
      const al = (L1 * L1 - L2 * L2 + dd * dd) / (2 * dd), hh = Math.sqrt(Math.max(0, L1 * L1 - al * al));
      const ky = hy + uy * al + uz * hh, kz = hz + uz * al - uy * hh;   // the knee (the perpendicular forward and up)
      const amt = Math.min(1, dk / 0.25), KR = 0.072, yW = WAIST - dk, yH = 0.1 + 0.14 * amt;
      const tk = Math.max(0.3, Math.min(0.95, (ky - yH) / Math.max(0.05, yW - yH))), zK = kz + KR, zW = spl(bZ, WAIST) - bk;
      const zF = (t) => t <= tk ? zK - 0.035 * Math.pow(1 - t / tk, 2) : zK + (zW - zK) * Math.pow((t - tk) / (1 - tk), 1.6);
      for (let i = 0; i < P.count; i++) {
        const x = B[i * 3], y = B[i * 3 + 1], z = B[i * 3 + 2], t = Math.max(0, Math.min(1, (y - 0.1) / (WAIST - 0.1)));
        const fr = Math.max(0, z) / Math.max(1e-4, Math.hypot(x, z)), wq = Math.max(0, Math.min(1, (fr - 0.2) / 0.6)), w = wq * wq * (3 - 2 * wq) * amt;   // (broad: both knees)
        const yB = y - dk * t, zB = z - bk * t, yF = yH + t * (yW - yH), zB0 = spl(bZ, Math.min(Math.max(y, 0.1), WAIST)) - bk * t;
        const kn = Math.exp(-Math.pow((t - tk) / 0.25, 2)) * amt;
        let Y = yB + w * (yF - yB), Z = zB + w * (zF(t) - zB0);
        // (its top, the band at the waist, turns with the body over it (about the waist's pivot, yP / -bk): left level it stood up
        // behind the bowed back - a flap)
        const kc = Math.max(0, Math.min(1, (y - (WAIST - 0.06)) / 0.2));
        if (kc > 0 && th > 0) { const a = th * kc, dy = Y - yP, dz = Z + bk, ca = Math.cos(a), sa = Math.sin(a); Y = yP + dy * ca - dz * sa; Z = -bk + dy * sa + dz * ca; }
        P.setXYZ(i, x * (1 + 0.12 * kn), Y, Z);
      }
      P.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere();
      m.geometry = g;
    };
    const kidBody = (f, H, u) => {
      if (!f || !f.bend) return;
      const y0 = f.bend.userData.y0 != null ? f.bend.userData.y0 : (f.bend.userData.y0 = f.bend.position.y), k = H ? u : 0;
      f.bend.position.y = y0 - (H ? H.drop : 0) * k; f.bend.position.z = -(H ? H.back : 0) * k;
      robeBow(f.body, (H ? H.drop : 0) * k / FS, (H ? H.back : 0) * k / FS, (H ? H.th : 0) * k, f.bend.position.y / FS);
      if (f.neck) f.neck.rotation.x = -(H ? H.lift : 0) * k;
    };
    // the feet (and in "ryose" the leg laid on the other) for a figure at kiddush, u 0..1 into it: from where they stand (+-0.1, 0) to
    // their places; the raised leg's thigh, knee, shin and foot (f.legs - the same in both houses) instead of its own foot
    const _kv = [new Vector3(), new Vector3()], _kup = new Vector3(0, 1, 0);
    const kidSeg = (m, A0, B0) => { _kv[1].subVectors(B0, A0); const n = _kv[1].length() || 1e-6; m.position.copy(A0); m.quaternion.setFromUnitVectors(_kup, _kv[1].multiplyScalar(1 / n)); m.scale.set(1, n, 1); };
    const kidLegs = (f, H, u) => {
      for (const sd of [1, -1]) {
        const ft = H.feet[sd], m = sd > 0 ? f.fl : f.fr, x0 = sd * 0.1;
        m.position.set((x0 + (ft[0] - x0) * u) * FS, ft[1] * u * FS, ft[2] * u * FS);
        m.rotation.set(ft[3] * u, ft[4] * u, 0);
      }
      const lg = H.leg && f.legs ? f.legs[H.leg.side] : null;
      if (f.legs) for (const sd of [1, -1]) if (f.legs[sd] && f.legs[sd] !== lg) f.legs[sd].g.visible = false;
      if (!lg) { f.fl.visible = f.fr.visible = true; return; }
      const on = u > 0.02, own = H.leg.side > 0 ? f.fl : f.fr;
      lg.g.visible = on; own.visible = !on;
      if (!on) return;
      const hip = H.leg.H, Kn = _kv[0].copy(hip).lerp(H.leg.K, 1), Aa = H.leg.A;
      const K2 = new Vector3(hip.x, hip.y - 0.45 * FS, hip.z + 0.02 * FS).lerp(Kn, u), A2 = new Vector3(H.leg.side * 0.1 * FS, 0.15 * FS, -0.01 * FS).lerp(Aa, u);
      kidSeg(lg.th, hip, K2); lg.kn.position.copy(K2); kidSeg(lg.sn, K2, A2);
      lg.ft.position.copy(own.position); lg.ft.rotation.copy(own.rotation);
    };
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