# -*- coding: utf-8 -*-
# B2 1.9.5 - THE LOTTERIES' DEMONSTRATION, ROUND 6 (the user, 12.11.2026 00:27-00:31):
#   "אתה חייב לעשות פנים לפחות פשוטות ממש. אני חשבתי שזה הצוואר שלו" -> PAYIS_FACES: two eyes, a nose and a beard on every figure; the
#       head a little higher out of the garment and the migba'at a little higher on it, so that the face is seen under its edge;
#   "מתגים במצגת לא עושים עוד מצגת, אלא עושים משהו בתוך המצגת כזה, בהבלעה" -> PAYIS_AVNET_PASS: in the garments' moment the avnet is
#       shown as the reading chosen, then for a few seconds as the other reading, with its source, and back;
#   the avnet's dyes after the Rambam (Klei HaMikdash 8:13): "הארגמן הוא הצמר הצבוע אדום. ותולעת השני הוא הצמר הצבוע בתולעת".
# Idempotent. Source: /home/claude/b2src/src/55-payis.js. Texts: qa/fs/LIB_1111.md ("12.11 00:07", "12.11 00:36").
import io
P = '/home/claude/b2src/src/55-payis.js'
s = io.open(P, encoding='utf-8').read()
s0 = s
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

if 'PAYIS_FACES' not in s:
    # ---- the materials: the dyes after the Rambam; the faces
    rep("mTch = mat(0x3f6fb5), mArg = mat(0xa12a4e), mSha = mat(0xd2452c), mElder = mat(0xd8caa2);",
        "mTch = mat(0x4a7fc4), mArg = mat(0xa51d2b), mSha = mat(0xe65a2a), mElder = mat(0xd8caa2);")
    rep("    const gHead = new SphereGeometry(0.19, 12, 10);\n",
        "    const gHead = new SphereGeometry(0.19, 14, 12);\n"
        "    // PAYIS_FACES (the user, 12.11.2026: \"אתה חייב לעשות פנים לפחות פשוטות ממש. אני חשבתי שזה הצוואר שלו\"): two eyes, a nose and a\n"
        "    // beard - nothing more. HEAD_Y / HAT_Y: the head stands a little out of the garment and the migba'at a little higher on it,\n"
        "    // so that the face is seen under its edge\n"
        "    const HEAD_Y = 2.09, HAT_Y = 2.33;\n"
        "    const gEye = new SphereGeometry(0.023, 8, 6);\n"
        "    const gNose = new SphereGeometry(0.03, 8, 6); gNose.scale(0.8, 1.2, 1);\n"
        "    const gBeard = new SphereGeometry(0.13, 12, 10); gBeard.scale(1, 1.2, 0.5);\n"
        "    const mEye = mat(0x1d1410, { roughness: 0.5 }), mNose = mat(0xb5855f, { roughness: 0.8 });\n"
        "    const mBeards = [mat(0x2c2119, { roughness: 0.95 }), mat(0x4b3626, { roughness: 0.95 }), mat(0x8d8a84, { roughness: 0.95 })], mBeardOld = mat(0xe4e1da, { roughness: 0.95 });\n"
        "    const faceOn = (f, y, mBeard) => {\n"
        "      for (const sx of [-1, 1]) { const e = new Mesh(gEye, mEye); e.position.set(sx * 0.07, y + 0.012, 0.171); f.add(e); }\n"
        "      const n = new Mesh(gNose, mNose);\n"
        "      n.position.set(0, y - 0.04, 0.187);\n"
        "      f.add(n);\n"
        "      const b = new Mesh(gBeard, mBeard);\n"
        "      b.position.set(0, y - 0.2, 0.172);\n"
        "      f.add(b);\n"
        "    };\n")
    # ---- the figure: the head, the face, the hat's height
    rep("    const figure = (robe, sash) => {\n", "    const figure = (robe, sash, beard) => {\n")
    rep("      const head = new Mesh(gHead, mSkin);\n      head.position.y = 2.06;\n      f.add(head);\n",
        "      const head = new Mesh(gHead, mSkin);\n      head.position.y = HEAD_Y;\n      f.add(head);\n"
        "      // (a short neck: the head stands out of the garment)\n"
        "      const neck = new Mesh(gNeck, mSkin);\n      neck.position.y = 1.9;\n      f.add(neck);\n"
        "      faceOn(f, HEAD_Y, mBeards[(beard || 0) % mBeards.length]);\n")
    rep("    const gHatDome = new SphereGeometry(0.226, 18, 12);", "    const gNeck = new CylinderGeometry(0.085, 0.1, 0.1, 8);\n    const gHatDome = new SphereGeometry(0.226, 18, 12);")
    rep("      hat.position.y = 2.27;\n", "      hat.position.y = HAT_Y;\n")
    rep("f.userData.hat.position.set(0, 2.27, 0); });", "f.userData.hat.position.set(0, HAT_Y, 0); });")
    rep("keys: [[t + t0 + 3.2, 0, 2.27, 0], [t + t0 + 4.2, 0, 2.95, 0.35], [t + t0 + 6.4, 0, 2.95, 0.35], [t + t0 + 7.4, 0, 2.27, 0]] });",
        "keys: [[t + t0 + 3.2, 0, HAT_Y, 0], [t + t0 + 4.2, 0, HAT_Y + 0.68, 0.35], [t + t0 + 6.4, 0, HAT_Y + 0.68, 0.35], [t + t0 + 7.4, 0, HAT_Y, 0]] });")
    rep("f.userData.arrow.visible = false; f.userData.hat.position.set(0, 2.27, 0); }",
        "f.userData.arrow.visible = false; f.userData.hat.position.set(0, HAT_Y, 0); }\n"
        "      stripes(P.avnet !== \"butz\");")
    rep("      arrow.position.y = 2.72;\n", "      arrow.position.y = 2.78;\n")
    rep("    const K = Array.from({ length: N }, () => figure(mRobe, true));\n    const MEM = figure(mRobe, true);                 // the appointed one over the lotteries\n"
        "    const WATCH = figure(mRobe, true);               // \"הרואה\"\n",
        "    const K = Array.from({ length: N }, (_, i) => figure(mRobe, true, i * 2 + (i % 3 === 2 ? 1 : 0)));\n"
        "    const MEM = figure(mRobe, true, 2);              // the appointed one over the lotteries\n"
        "    const WATCH = figure(mRobe, true, 1);            // \"הרואה\"\n")
    rep("      const h = new Mesh(gHead, mSkin);\n      h.position.y = 1.66;\n      ELDER.add(h);\n",
        "      const h = new Mesh(gHead, mSkin);\n      h.position.y = 1.66;\n      ELDER.add(h);\n      faceOn(ELDER, 1.66, mBeardOld);\n")
    # ---- the stripes' helper (before the runner's API, which uses it)
    rep("    // ---------- the runner\n    let RUN = null;\n",
        "    // PAYIS_AVNET_PASS: the dyed bands of every avnet, on or off\n"
        "    const stripes = (on) => { for (const b of STRIPES) b.visible = !!on; };\n"
        "    // ---------- the runner\n    let RUN = null;\n")
    rep("setAvnet(m) { this.avnet = m === \"butz\" ? \"butz\" : \"rambam\"; for (const b of STRIPES) b.visible = this.avnet === \"rambam\"; return this.avnet; },",
        "setAvnet(m) { this.avnet = m === \"butz\" ? \"butz\" : \"rambam\"; stripes(this.avnet === \"rambam\"); if (RUN) stop(); return this.avnet; },")
    # ---- the garments' moment: the chosen reading, the other one in passing, and back
    a = s.index("      // PAYIS_GARMENTS (the user, 12.11.2026: \"תוסיף כרטיס שמדבר על הבגדים")
    b = s.index("      cam(2.6, camGazit[0], camGazit[1], 2.4);\n", a)
    new = (
        "      // PAYIS_GARMENTS (the user, 12.11.2026: \"תוסיף כרטיס שמדבר על הבגדים ... מביא את המחלוקות ... בצורה ברורה\"): the garments from near, by day.\n"
        "      // PAYIS_AVNET_PASS (the user, 00:31: \"מתגים במצגת לא עושים עוד מצגת, אלא עושים משהו בתוך המצגת כזה, בהבלעה\"): the avnet as the reading\n"
        "      // chosen in the row \"אבנטו של כהן הדיוט\", then for a few seconds as the other reading, with its source, and back\n"
        "      cam(2.2, [86.6, 19.4, -61.6], [84.6, 18.4, -64.6], 2.2);\n"
        "      {\n"
        "        const dyed = P.avnet !== \"butz\";\n"
        "        ev(0, () => stripes(dyed));\n"
        "        cap(0, dyed ? \"רמב״ם (כלי המקדש ח, א): ״בגדי כהן הדיוט הם ארבעה כלים כתנת ומכנסים ומגבעות ואבנט. וארבעתן של פשתן לבנים וחוטן כפול ששה. והאבנט לבדו רקום בצמר״\"\n"
        "          : \"רמב״ם (כלי המקדש ח, א): ״בגדי כהן הדיוט הם ארבעה כלים כתנת ומכנסים ומגבעות ואבנט. וארבעתן של פשתן לבנים וחוטן כפול ששה״\");\n"
        "        cap(7, \"האבנט — נחלקו בו (יומא יב:): ״אבנטו של כהן הדיוט, רבי ורבי אלעזר ברבי שמעון, חד אמר: של כלאים, וחד אמר: של בוץ״\");\n"
        "        ev(12.5, () => stripes(!dyed));\n"
        "        cap(12.5, dyed ? \"״וחד אמר: של בוץ״ — של פשתן לבדו (רמב״ם ח, יג: ״הוא הפשתים והוא הבוץ״)\"\n"
        "          : \"״חד אמר: של כלאים״ — וכן הרמב״ם (ח, א): ״והאבנט לבדו רקום בצמר״\");\n"
        "        ev(17.5, () => stripes(dyed));\n"
        "        cap(17.5, dyed ? \"ובחזרה לקריאה שנבחרה — הרמב״ם: ״והאבנט לבדו רקום בצמר״\" : \"ובחזרה לקריאה שנבחרה — ״של בוץ״\");\n"
        "        t += 20.5;\n"
        "      }\n")
    s = s[:a] + new + s[b:]
    # ---- the three priests shown by the place "בגדי הכהנים" and by the row: the stripes as the reading
    rep("      garmentsOff();\n      resetFigures();\n      [[78.5, -1.7, Math.PI / 2]",
        "      garmentsOff();\n      resetFigures();\n      stripes(P.avnet !== \"butz\");\n      [[78.5, -1.7, Math.PI / 2]")

if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 6 applied')
else:
    print('55-payis.js: unchanged')

# ---- round 6b (after the first close pictures): the avnet at the height of the elbows ("חוגר את האבנט כנגד אצילי ידיו" - the Rambam,
# Klei HaMikdash 10:1; it stood at the hips), the beard fuller from the side, the eyes smaller
s = io.open(P, encoding='utf-8').read()
s0 = s
if 'PAYIS_FACES_B' not in s:
    rep("    const gSash = new CylinderGeometry(0.246, 0.254, 0.15, 12); gSash.translate(0, 1.22, 0);\n"
        "    const gStripe = new CylinderGeometry(0.2525, 0.2585, 0.03, 12);\n",
        "    // PAYIS_FACES_B: the avnet at the height of the elbows - \"חוגר את האבנט כנגד אצילי ידיו\" (the Rambam, Klei HaMikdash 10:1)\n"
        "    const SASH_Y = 1.5, rRobe = (y) => 0.31 - 0.11 * y / 1.9;\n"
        "    const gSash = new CylinderGeometry(rRobe(SASH_Y + 0.075) + 0.012, rRobe(SASH_Y - 0.075) + 0.012, 0.15, 14); gSash.translate(0, SASH_Y, 0);\n"
        "    const gStripe = new CylinderGeometry(1, 1, 0.03, 14);\n")
    rep("        [[1.265, mTch], [1.22, mArg], [1.175, mSha]].forEach(([y, m]) => { const b = new Mesh(gStripe, m); b.position.y = y; f.add(b); STRIPES.push(b); });\n",
        "        [[SASH_Y + 0.045, mTch], [SASH_Y, mArg], [SASH_Y - 0.045, mSha]].forEach(([y, m]) => { const b = new Mesh(gStripe, m), r = rRobe(y) + 0.018; b.scale.set(r, 1, r); b.position.y = y; f.add(b); STRIPES.push(b); });\n")
    rep("    const gEye = new SphereGeometry(0.023, 8, 6);\n", "    const gEye = new SphereGeometry(0.019, 8, 6);\n")
    rep("    const gBeard = new SphereGeometry(0.13, 12, 10); gBeard.scale(1, 1.2, 0.5);\n", "    const gBeard = new SphereGeometry(0.13, 12, 10); gBeard.scale(1, 1.2, 0.78);\n")
    rep("      b.position.set(0, y - 0.2, 0.172);\n", "      b.position.set(0, y - 0.2, 0.128);\n")
    rep("e.position.set(sx * 0.07, y + 0.012, 0.171); f.add(e); }", "e.position.set(sx * 0.068, y + 0.012, 0.174); f.add(e); }")
if s != s0:
    io.open(P, 'w', encoding='utf-8').write(s)
    print('55-payis.js: round 6b applied')
else:
    print('55-payis.js: round 6b unchanged')
