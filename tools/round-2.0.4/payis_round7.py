# -*- coding: utf-8 -*-
# B2 1.9.5 - THE LOTTERIES' DEMONSTRATION, ROUND 7: THE PRIEST'S FIGURE REBUILT (PAYIS_FIGURE2).
# The user, 12.11.2026:
#   00:42 "לכהנים היו ידיים ... האבנט צריך להיראות שזור, לא חלק. מה הצמדת להם לאף? מה זה אמור להיות זקן? ... ככה לא היה נראה
#          המגבעת. בבקשה לנסות לחפש תמונות של כהן הדיוט, ולנסות לבנות דרכן."
#   00:43 "https://mikdash3.co.il/limud-leshichno-a-71/ אנחנו מפה תחפור עוד הרבה באתר הזה."
#   00:48 "גם את הפרצוף תעשה כמוהו, את הפרצוף ... את הזקן."
# Seen in the app's browser pane (00:50): that page's drawing 452 "כהן הדיוט לבוש 4 בגדים" (uploads/2022/04/498.jpg) and the page
# limud-leshichno-b-14's drawing 194 "ארבע בגדי כהן הדיוט" (uploads/2022/03/194.jpg: the migba'at in two ways - "שיטה א" low and
# broad, "שיטה ב" tall and rounded; "אבנט מפשתן" / "אבנט משש חוטים"), 195 and 196 (the measures: 16 amot / 32 amot, 3 fingers).
# The figure is built after drawing 452 (the tall migba'at, "שיטה ב"), each part against the Rambam as read in his library.
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
    // ===== PAYIS_FIGURE2 (the user, 12.11.2026 00:42-00:48: "לכהנים היו ידיים"; "האבנט צריך להיראות שזור, לא חלק"; "ככה לא היה נראה
    // המגבעת ... לחפש תמונות של כהן הדיוט, ולנסות לבנות דרכן"; the page he sent - mikdash3.co.il/limud-leshichno-a-71, its drawing 452
    // "כהן הדיוט לבוש 4 בגדים", and drawing 194 "ארבע בגדי כהן הדיוט" of limud-leshichno-b-14; "גם את הפרצוף תעשה כמוהו ... את הזקן").
    // Built after those drawings, each part against the Rambam (Klei HaMikdash, read in his library - qa/fs/LIB_1111.md):
    //   the migba'at - tall, rounded at its head, wound aslant, a thick edge over the forehead (the site's "שיטה ב"; 8:2 "ובניו צונפין
    //     בה ככובע", 8:19 "ארכו שש עשרה אמות"; the Ramban, Shemot 28:31 "ומעלה הכפלים עליו כעין מגבעת שהוא קובע"; Ibn Ezra, 28:36
    //     "שיכסו הראש והם גבוהים");
    //   the face - eyes, brows, a nose, a mouth, a moustache and a full beard down to the chest;
    //   the kutonet - checkered ("משבצת היתה שהיא בתים בתים באריגתה", 8:16), to above the heel, its sleeves to the palm ("וארך בית
    //     יד שלה עד פס ידו", 8:17); the hands; bare feet;
    //   the avnet - at the elbows ("כנגד אצילי ידיו", 10:1), two windings each three fingers wide ("רחבו כמו שלש אצבעות ... מקיפו
    //     ומחזירו כרך על גבי כרך", 8:19), its face twined threads - white, blue, red and scarlet (8:1 "רקום בצמר", 8:13 the dyes), or
    //     all white ("של בוץ", Yoma 12b).
    // MODEL CHOICES: the proportions, the features of the face, the colour of each beard, the number of windings that are seen.
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
    // twined threads: rows of slanted strands, each row leaning the other way
    const twine = (cols) => cnv(240, 64, 4, 1, (c, w, h) => {
      c.fillStyle = cols[0];
      c.fillRect(0, 0, w, h);
      const rows = 4, rh = h / rows, per = 12;
      for (let r = 0; r < rows; r++) {
        const lean = (r % 2 ? 1 : -1) * rh * 0.75, y = r * rh;
        for (let k = -3; k < w / per + 3; k++) {
          c.fillStyle = cols[(k + r * 2 + 400) % cols.length];
          const x = k * per;
          c.beginPath();
          c.moveTo(x, y); c.lineTo(x + per * 0.84, y); c.lineTo(x + per * 0.84 + lean, y + rh); c.lineTo(x + lean, y + rh);
          c.closePath();
          c.fill();
        }
        c.fillStyle = "rgba(50,40,30,0.3)";
        c.fillRect(0, y, w, 1.6);
      }
    });
    // the migba'at's windings: aslant
    const texHat = cnv(128, 128, 3, 1.5, (c, w, h) => {
      c.fillStyle = "#f5f3ee";
      c.fillRect(0, 0, w, h);
      for (let k = -6; k < 8; k++) {
        const x = k * 32;
        c.strokeStyle = "#c4c0b5"; c.lineWidth = 4; c.beginPath(); c.moveTo(x, h); c.lineTo(x + 96, 0); c.stroke();
        c.strokeStyle = "#ffffff"; c.lineWidth = 6; c.beginPath(); c.moveTo(x + 8, h); c.lineTo(x + 104, 0); c.stroke();
      }
    });
    // the face: the eyes, the brows and the mouth are painted on the head (its front is at a quarter of the width)
    const texFace = cnv(512, 256, 1, 1, (c) => {
      c.fillStyle = "#c99a73";
      c.fillRect(0, 0, 512, 256);
      const cx = 128, ey = 122;
      c.lineCap = "round";
      for (const sd of [-1, 1]) {
        const x = cx + sd * 29;
        c.fillStyle = "#f6f2ea"; c.beginPath(); c.ellipse(x, ey, 12.5, 5.6, 0, 0, Math.PI * 2); c.fill();
        c.fillStyle = "#4f6f92"; c.beginPath(); c.arc(x, ey, 5.3, 0, Math.PI * 2); c.fill();
        c.fillStyle = "#17110d"; c.beginPath(); c.arc(x, ey, 2.5, 0, Math.PI * 2); c.fill();
        c.strokeStyle = "#5b4333"; c.lineWidth = 2; c.beginPath(); c.ellipse(x, ey, 12.5, 5.6, 0, Math.PI, Math.PI * 2); c.stroke();
        c.strokeStyle = "#8f8478"; c.lineWidth = 4.6; c.beginPath(); c.moveTo(x - sd * 13, ey - 11.5); c.quadraticCurveTo(x, ey - 15.5, x + sd * 15, ey - 11); c.stroke();
      }
      c.strokeStyle = "#9a4d40"; c.lineWidth = 3.4; c.beginPath(); c.moveTo(cx - 12, 170); c.quadraticCurveTo(cx, 173.5, cx + 12, 170); c.stroke();
    });
    const mRobe = mat(0xffffff, { map: texRobe, roughness: 0.92 });                    // PAYIS_WHITE: one white for every priest
    const mHat = mat(0xffffff, { map: texHat, roughness: 0.9 });
    const mFace = mat(0xffffff, { map: texFace, roughness: 0.8 });
    const mSashDyed = mat(0xffffff, { map: twine(["#f4f0e4", "#3f73c4", "#a51d2b", "#e2562a"]), roughness: 0.9 });   // שש, תכלת, ארגמן ("הצבוע אדום"), תולעת שני
    const mSashWhite = mat(0xffffff, { map: twine(["#fbfaf5", "#e4dfd0", "#f4f1e7", "#d6d0bf"]), roughness: 0.9 });
    const mBeards = [0xf1efe9, 0xb9b6ae, 0xe9e6de, 0x4c3b2d, 0x9c9891].map((c) => mat(c, { roughness: 0.95 })), mBeardOld = mBeards[0];
    const SASHES = [];   // every avnet's mesh: dyed in the Rambam's reading, white in "של בוץ"
    const sph = (sx, sy, sz, ws, hs, ps, pl, ts, tl) => {
      const q = new SphereGeometry(1, ws, hs, ps === undefined ? 0 : ps, pl === undefined ? Math.PI * 2 : pl, ts === undefined ? 0 : ts, tl === undefined ? Math.PI : tl);
      q.scale(sx, sy, sz);
      return q;
    };
    const at = (q, x, y, z) => { q.translate(x, y, z); return q; };
    const flatUV = (q, u, v) => { const a = q.attributes.uv; for (let i = 0; i < a.count; i++) a.setXY(i, u, v); return q; };
    const lathe = (pts, seg) => new LatheGeometry(pts.map((p) => new Vector2(p[0], p[1])), seg);
    // ---- the head (its middle at HEAD_Y): the face painted; the nose and the ears of its skin
    const HEAD_Y = 2.075, HR = [0.13, 0.159, 0.14], HS = 1.045;
    const gHeadAll = mergeGeometries([
      sph(HR[0], HR[1], HR[2], 22, 16),
      at(flatUV(sph(0.019, 0.04, 0.028, 8, 6), 0.75, 0.3), 0, -0.022, 0.136),
      at(flatUV(sph(0.012, 0.03, 0.02, 6, 5), 0.75, 0.3), -HR[0] * 0.98, -0.005, 0),
      at(flatUV(sph(0.012, 0.03, 0.02, 6, 5), 0.75, 0.3), HR[0] * 0.98, -0.005, 0)
    ]);
    // ---- the hair, one piece: the moustache; the beard on the jaw from ear to ear, below the mouth; the beard under the chin,
    // leaning forward down to the chest; before the ears; the top of the head (seen when the migba'at is lifted) and its back
    const gHair = mergeGeometries([
      at(sph(0.056, 0.015, 0.02, 10, 6), 0, -0.058, 0.128),
      sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 22, 8, -0.25, Math.PI + 0.5, 2.12, Math.PI - 2.12),
      (() => { const q = sph(0.105, 0.135, 0.078, 14, 12); q.rotateX(-0.3); q.translate(0, -0.222, 0.118); return q; })(),
      at(sph(0.016, 0.075, 0.04, 6, 6), -0.122, -0.02, 0.052),
      at(sph(0.016, 0.075, 0.04, 6, 6), 0.122, -0.02, 0.052),
      sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 20, 6, 0, Math.PI * 2, 0, 1.08),
      sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 14, 8, Math.PI + 0.3, Math.PI - 0.6, 1.08, 1.4)
    ]);
    const headOn = (f, y, mHair) => {
      const h = new Mesh(gHeadAll, mFace);
      h.position.y = y;
      f.add(h);
      const b = new Mesh(gHair, mHair);
      b.position.y = y;
      f.add(b);
    };
    // ---- the kutonet with its shoulders and its left sleeve (the body is broader than it is deep)
    const BZ = 0.78, SH_X = 0.262, SH_Y = 1.765;
    const armPart = (q, side) => { q.rotateZ(side * 0.1); q.rotateX(-0.06); q.translate(side * SH_X, SH_Y, 0); return q; };
    const sleeve = () => { const q = new CylinderGeometry(0.066, 0.05, 0.72, 10); q.translate(0, -0.36, 0); return q; };
    const handGeo = () => at(sph(0.036, 0.062, 0.03, 8, 6), 0, -0.775, 0);
    const gRobe = mergeGeometries([
      (() => { const q = lathe([[0, 0.1], [0.243, 0.1], [0.25, 0.14], [0.24, 0.5], [0.223, 0.9], [0.2, 1.2], [0.188, 1.32], [0.196, 1.45], [0.226, 1.6], [0.25, 1.72], [0.244, 1.79], [0.2, 1.85], [0.12, 1.895], [0.076, 1.915], [0, 1.915]], 24); q.scale(1, 1, BZ); return q; })(),
      at(sph(0.078, 0.078, 0.07, 10, 8), -SH_X, SH_Y, 0),
      at(sph(0.078, 0.078, 0.07, 10, 8), SH_X, SH_Y, 0),
      armPart(sleeve(), 1)
    ]);
    // (the skin that does not move: the left hand, the bare feet)
    const gSkinStill = mergeGeometries([armPart(handGeo(), 1), at(sph(0.048, 0.03, 0.095, 8, 6), -0.085, 0.03, 0.13), at(sph(0.048, 0.03, 0.095, 8, 6), 0.085, 0.03, 0.13)]);
    // (the right arm moves: it hangs, and at "הצביעו" it is stretched forward, a finger out)
    const gSleeve = sleeve(), gHand = handGeo();
    const gFinger = new CylinderGeometry(0.013, 0.014, 0.1, 6); gFinger.translate(0, -0.87, 0);
    const ARM_DOWN = [-0.06, -0.1], ARM_OUT = [-1.25, -0.03];
    // ---- the avnet: two windings at the elbows' height
    const rbAt = (y) => 0.188 + (y - 1.32) * 0.0615;
    const gSash = lathe([[1.296, 0.004], [1.306, 0.027], [1.34, 0.031], [1.374, 0.027], [1.385, 0.019], [1.396, 0.027], [1.43, 0.031], [1.464, 0.027], [1.474, 0.004]].map(([y, d]) => [rbAt(y) + d, y]), 28);
    gSash.scale(1, 1, BZ);
    // ---- the migba'at (its origin: the middle of its edge-roll)
    const HAT_Y = HEAD_Y + 0.088, ARROW_Y = 2.74;
    const gHat = lathe([[0.128, -0.03], [0.156, -0.028], [0.168, -0.012], [0.169, 0.006], [0.16, 0.022], [0.152, 0.03], [0.158, 0.055], [0.167, 0.1], [0.17, 0.145], [0.164, 0.19], [0.148, 0.228], [0.12, 0.258], [0.082, 0.278], [0.04, 0.289], [0, 0.292]], 28);
    gHat.scale(1, 1, 1.06);
    const gCap = sph(HR[0] * 1.1, HR[1] * 1.1, HR[2] * 1.1, 16, 5, 0, Math.PI * 2, 0, 1.15);   // the elder's cap
    const gFlame = new ConeGeometry(0.2, 0.7, 8); gFlame.translate(0, 0.35, 0);
    const gArrowHead = new ConeGeometry(0.2, 0.4, 12); gArrowHead.rotateX(Math.PI);   // the point down
    const gArrowShaft = new CylinderGeometry(0.065, 0.065, 0.36, 8);
    const mArrow = new MeshBasicMaterial({ color: 0xffc83a });
    const gStick = new CylinderGeometry(0.04, 0.04, 1.3, 6); gStick.translate(0, 0.65, 0);
    // a standing figure: the group's +z is the way it faces; hat = the migba'at (its own object: the appointed one lifts it);
    // hand = the right arm: `hand.visible = true` stretches it forward with a finger out ("הצביעו")
    const figure = (robe, sash, beard) => {
      const f = new Group();
      const body = new Mesh(gRobe, robe);
      body.castShadow = true;
      f.add(body);
      f.add(new Mesh(gSkinStill, mSkin));
      if (sash) { const sm = new Mesh(gSash, mSashDyed); f.add(sm); SASHES.push(sm); }
      headOn(f, HEAD_Y, mBeards[(beard || 0) % mBeards.length]);
      const hat = new Group();
      hat.add(new Mesh(gHat, mHat));
      hat.position.y = HAT_Y;
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
      f.userData = { body, hat, hand, robe, arrow, tip: new Vector3(-SH_X, 1.48, 0.855) };
      f.scale.setScalar(FS);
      g.add(f);
      return f;
    };
'''

if 'PAYIS_FIGURE2' not in s:
    a = s.index("    const FS = 1.4;")
    b = s.index("    const face = (f, x, z) =>")
    s = s[:a] + NEW + s[b:]
    # the materials' line: the robe, the hat and the avnet are defined with their textures (above)
    rep("    const mRobe = mat(0xfaf9f5), mSkin = mat(0xc99a73, { roughness: 0.8 }), mHat = mat(0xffffff), mSash = mat(0xece8dc), mTch = mat(0x4a7fc4), mArg = mat(0xa51d2b), mSha = mat(0xe65a2a), mElder = mat(0xd8caa2);   // PAYIS_WHITE: one white for every priest\n",
        "    const mSkin = mat(0xc99a73, { roughness: 0.8 }), mElder = mat(0xd8caa2);\n")
    rep("    const K = Array.from({ length: N }, (_, i) => figure(mRobe, true, i * 2 + (i % 3 === 2 ? 1 : 0)));\n"
        "    const MEM = figure(mRobe, true, 2);              // the appointed one over the lotteries\n"
        "    const WATCH = figure(mRobe, true, 1);            // \"הרואה\"\n",
        "    const K = Array.from({ length: N }, (_, i) => figure(mRobe, true, i));\n"
        "    const MEM = figure(mRobe, true, 0);              // the appointed one over the lotteries\n"
        "    const WATCH = figure(mRobe, true, 3);            // \"הרואה\"\n")
    rep("      const h = new Mesh(gHead, mSkin);\n      h.position.y = 1.66;\n      ELDER.add(h);\n      faceOn(ELDER, 1.66, mBeardOld);\n",
        "      headOn(ELDER, 1.645, mBeardOld);\n"
        "      const cap = new Mesh(gCap, mElder);\n      cap.position.y = 1.645;\n      ELDER.add(cap);\n")
    rep("    const stripes = (on) => { for (const b of STRIPES) b.visible = !!on; };\n",
        "    const stripes = (on) => { for (const m of SASHES) m.material = on ? mSashDyed : mSashWhite; };\n")
    rep("f.userData.arrow.position.y = 2.72 + 0.09 * Math.sin(t * 4 + f.id);", "f.userData.arrow.position.y = ARROW_Y + 0.09 * Math.sin(t * 4 + f.id);")

if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 7 applied')
else:
    print('55-payis.js: unchanged')

# ---- round 7b (after the first close pictures): the hair before the ears lies on the cheeks (it stood out like flaps); the beard
# on the jaw fuller, the beard under the chin narrower; the shoulders round and smooth; the nose shorter
s = io.open(P, encoding='utf-8').read()
s0 = s
if 'PAYIS_FIGURE2B' not in s:
    rep("      at(sph(0.016, 0.075, 0.04, 6, 6), -0.122, -0.02, 0.052),\n      at(sph(0.016, 0.075, 0.04, 6, 6), 0.122, -0.02, 0.052),\n",
        "      // PAYIS_FIGURE2B: before the ears the hair lies on the cheeks, from the migba'at's edge down to the jaw\n"
        "      sph(HR[0] * 1.035, HR[1] * 1.035, HR[2] * 1.035, 6, 8, 0.14, 0.5, 1.12, 1.02),\n"
        "      sph(HR[0] * 1.035, HR[1] * 1.035, HR[2] * 1.035, 6, 8, Math.PI - 0.64, 0.5, 1.12, 1.02),\n")
    rep("      sph(HR[0] * HS, HR[1] * HS, HR[2] * HS, 22, 8, -0.25, Math.PI + 0.5, 2.12, Math.PI - 2.12),\n",
        "      sph(HR[0] * 1.075, HR[1] * 1.06, HR[2] * 1.075, 22, 8, -0.25, Math.PI + 0.5, 2.1, Math.PI - 2.1),\n")
    rep("      (() => { const q = sph(0.105, 0.135, 0.078, 14, 12); q.rotateX(-0.3); q.translate(0, -0.222, 0.118); return q; })(),\n",
        "      (() => { const q = sph(0.092, 0.14, 0.07, 14, 12); q.rotateX(-0.3); q.translate(0, -0.226, 0.112); return q; })(),\n")
    rep("      at(flatUV(sph(0.019, 0.04, 0.028, 8, 6), 0.75, 0.3), 0, -0.022, 0.136),\n",
        "      at(flatUV(sph(0.018, 0.034, 0.027, 8, 6), 0.75, 0.3), 0, -0.024, 0.136),\n")
    rep("      at(sph(0.078, 0.078, 0.07, 10, 8), -SH_X, SH_Y, 0),\n      at(sph(0.078, 0.078, 0.07, 10, 8), SH_X, SH_Y, 0),\n",
        "      at(sph(0.086, 0.084, 0.08, 16, 12), -SH_X, SH_Y, 0),\n      at(sph(0.086, 0.084, 0.08, 16, 12), SH_X, SH_Y, 0),\n")
    rep("    const sleeve = () => { const q = new CylinderGeometry(0.066, 0.05, 0.72, 10); q.translate(0, -0.36, 0); return q; };",
        "    const sleeve = () => { const q = new CylinderGeometry(0.066, 0.05, 0.72, 14); q.translate(0, -0.36, 0); return q; };")
if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 7b applied')
else:
    print('55-payis.js: round 7b unchanged')
