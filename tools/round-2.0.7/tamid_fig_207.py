#!/usr/bin/env python3
# 12.11.2026 19:28, the user (with the zip of the morning's service): "שים לב להתאים את הדמויות לאלו שעשית בשרשור הזה".
# TAMID_FIG_207: the figures of the morning's service (55-tamid.js) are the priest of the lotteries (55-payis.js PAYIS_FIGURE4 - built
# with the user at 00:42-01:15 after the site's drawings 452 and 200, lightened in 2.0.5): his kutonet, his avnet at the elbows, his
# migba'at, his face with its beard, his open hands and bare feet - the same geometries and materials (55-payis.js gives them in
# SH.priestKit; nothing is built twice), set on this demonstration's skeleton: two arms bent at the elbow with the grips that hold the
# vessels, and the walking feet. The Levites: the same man in their own clothes (this demonstration's colours) and a cap. The high
# priest: his eight garments are fitted to this demonstration's body, so it stays under them; his face, beard, hands, feet and the
# sleeves of his kutonet are the priest's. The avnet of an ordinary priest follows the opinions row "אבנטו של כהן הדיוט" (the same row
# as the lotteries), and the banner's switch of the demonstration sets that row.
# Idempotent (marks PRIEST_KIT_207 / TAMID_FIG_207).
import os
O = '/home/claude/b2src'
def edit(rel, mark, pairs):
    p = os.path.join(O, rel); s = open(p, encoding='utf-8').read()
    if mark in s: print('already:', rel); return
    for a, b in pairs:
        assert s.count(a) == 1, (rel, a[:90], s.count(a))
        s = s.replace(a, b)
    assert mark in s, (rel, 'the mark')
    open(p, 'w', encoding='utf-8').write(s); print('edited', rel)

# ---------------------------------------------------------------- 55-payis.js: the kit (the figures of the lotteries do not change)
edit('src/55-payis.js', 'PRIEST_KIT_207', [
    ("""      const q = mergeGeometries(parts);
      q.rotateY(sd * 0.95);                // the palm toward the body, the thumb to the front
      return foreAt(q, FORE + 0.045);
    };""",
     """      const q = mergeGeometries(parts);
      q.rotateY(sd * 0.95);                // the palm toward the body, the thumb to the front
      return q;
    };
    const handOpen = (sd) => foreAt(handRaw(sd), FORE + 0.045);   // PRIEST_KIT_207: the same hand (handRaw: in its own frame, for 55-tamid.js)"""),
    ("    const handOpen = (sd) => {\n      const parts = [sph(0.03, 0.04, 0.0125, 10, 8)];",
     "    const handRaw = (sd) => {\n      const parts = [sph(0.03, 0.04, 0.0125, 10, 8)];"),
    ("    const figure = (robe, sash, beard) => {\n",
     """    // PRIEST_KIT_207 (12.11.2026 19:28, the user: "שים לב להתאים את הדמויות לאלו שעשית בשרשור הזה"): this priest's parts, for the figures
    // of the morning's service (55-tamid.js) - the same geometries and materials, shared (nothing is built twice; his figures below unchanged)
    SH.priestKit = { FS, HEAD_Y, HAT_Y, SH_X, SH_Y, UP, FORE, HR, sph, at, rot, white, gRobeBody, gSash, gHat, gCap, headOn, handRaw, footGeo,
      mat, mRobe, mSkin, mHat, mSashDyed, mSashWhite, mBeards };
    const figure = (robe, sash, beard) => {
"""),
])

# ---------------------------------------------------------------- 55-tamid.js: the figures on the kit
NEW_FIG = r'''      // TAMID_FIG_207 (the user, 12.11.2026 19:28: "שים לב להתאים את הדמויות לאלו שעשית בשרשור הזה"): the priests and the Levites are
      // the lotteries' priest (55-payis.js PAYIS_FIGURE4; his parts in SH.priestKit, shared) on this skeleton - g, lean, the two arms (sh,
      // el, grip) and the feet, which the poses below move; the high priest keeps this demonstration's body under his eight garments
      // (fitted to it: buildHP), with the priest's head, beard, sleeves, hands and feet. Without the kit (never in the plugin): as before.
      const KIT = SH.priestKit || null;
      const KG = KIT ? (() => {
        const K = KIT, FS = K.FS, sc = (q, s) => q.scale(s, s, s);
        const W1 = (q) => K.white(q);
        // an arm in amot: the sleeve from the shoulder to the elbow (up) and from the elbow to the wrist (fore), the priest's radii
        const upper = (up) => sc(mergeGeometries([W1(K.sph(0.07, 0.07, 0.07, 14, 10)), W1(K.at(new CylinderGeometry(0.07, 0.058, up / FS, 14), 0, -up / FS / 2, 0)),
          W1(K.at(K.sph(0.058, 0.058, 0.058, 12, 8), 0, -up / FS, 0))]), FS);
        const fore = (fo) => sc(W1(K.at(new CylinderGeometry(0.056, 0.046, fo / FS, 14), 0, -fo / FS / 2, 0)), FS);
        const hand = (side, fo) => sc(K.at(K.handRaw(side), 0, -(fo / FS + 0.045), 0), FS);
        const foot = (side) => sc(K.footGeo(side).translate(-side * 0.1, 0, 0), FS);
        const P = { sx: K.SH_X * FS, sy: K.SH_Y * FS, up: K.UP * FS, fo: K.FORE * FS };      // the priest's own arm
        const H = { sx: 0.39, sy: 2.6, up: 0.6, fo: 0.66 };                                     // the high priest's: as this body (his garments)
        return {
          P, H,
          upP: upper(P.up), foP: fore(P.fo), handP: { 1: hand(1, P.fo), "-1": hand(-1, P.fo) },
          upH: upper(H.up), foH: fore(H.fo), handH: { 1: hand(1, H.fo), "-1": hand(-1, H.fo) },
          foot: { 1: foot(1), "-1": foot(-1) },
          neck: sc(K.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), 1),
          mLev: K.mat(COL.levite, { vertexColors: true, roughness: 0.9 }), mLevCap: K.mat(COL.levCap, { roughness: 0.9 })
        };
      })() : null;
      const makeFigKit = (id, kind) => {
        const K = KIT, FS = K.FS, lev = kind === "L", hp = kind === "H", n = Object.keys(figs).length;
        const g = new Group(), lean = new Group();
        g.add(lean);
        let body, belt = null;
        if (hp) {
          body = new Mesh(G.HK, MAT.fig);              // this demonstration's body (no ears: the head is the priest's)
          body.castShadow = true;
          lean.add(body);
          belt = new Mesh(G.belt, MAT.beltK);           // his avnet: "דברי הכל של כלאים"
          lean.add(belt);
          const hs = new Group();                       // the priest's head, where this body's head was (its mitznefet and tzitz sit on it)
          hs.scale.setScalar(1.3);
          hs.position.set(0, 3.0 - 1.3 * K.HEAD_Y, HZ);
          lean.add(hs);
          K.headOn(hs, K.HEAD_Y, K.mBeards[0], 1);
        } else {
          const S = new Group();
          S.scale.setScalar(FS);
          lean.add(S);
          body = new Mesh(K.gRobeBody, lev ? KG.mLev : K.mRobe);
          body.castShadow = true;
          S.add(body);
          S.add(new Mesh(KG.neck, K.mSkin));
          if (!lev) { belt = new Mesh(K.gSash, TM.belt === "white" ? K.mSashWhite : K.mSashDyed); belt.userData.kit = true; S.add(belt); }
          const hg = K.headOn(S, K.HEAD_Y, K.mBeards[n % K.mBeards.length], n);
          hg.rotation.set(0, (((n * 0.618) % 1) - 0.5) * 0.4, 0);   // every man a little different (a fixed turn, no chance)
          if (lev) { const cap = new Mesh(K.gCap, KG.mLevCap); cap.position.y = K.HEAD_Y; S.add(cap); }
          else { const hat = new Mesh(K.gHat, K.mHat); hat.position.y = K.HAT_Y; hat.rotation.y = hg.rotation.y + (((n * 0.37) % 1) - 0.5) * 0.9; S.add(hat); }
        }
        const A = hp ? KG.H : KG.P, armMat = lev ? KG.mLev : K.mRobe;
        const arm = (side) => {   // side +1 = the left (+x), -1 = the right
          const sh = new Group();
          sh.position.set(side * A.sx, A.sy, 0);
          lean.add(sh);
          sh.add(new Mesh(hp ? KG.upH : KG.upP, armMat));
          const el = new Group();
          el.position.y = -A.up;
          sh.add(el);
          el.add(new Mesh(hp ? KG.foH : KG.foP, armMat));
          el.add(new Mesh((hp ? KG.handH : KG.handP)[side], K.mSkin));
          const grip = new Group();
          grip.position.set(0, -(A.fo + 0.08), 0.03);
          el.add(grip);
          return { sh, el, grip };
        };
        const L = arm(1), R = arm(-1);
        const fl = new Mesh(KG.foot[1], K.mSkin), fr = new Mesh(KG.foot[-1], K.mSkin);
        fl.position.x = 0.1 * FS;
        fr.position.x = -0.1 * FS;
        g.add(fl, fr);
        g.visible = false;
        group.add(g);
        const f = { id, g, lean, L, R, fl, fr, levite: lev, kind, body, belt, st: null, tag: null, kit: true };
        figs[id] = f;
        return f;
      };
      const makeFig = (id, kind) => {
        if (KIT) return makeFigKit(id, kind);   // TAMID_FIG_207
'''
edit('src/55-tamid.js', 'TAMID_FIG_207', [
    ("      const makeFig = (id, kind) => {\n", NEW_FIG),
    # the high priest's body without the ears (the priest's head has its own)
    ("        for (const s of [1, -1]) parts.push(tint(plain(new SphereGeometry(1, 10, 8).scale(0.016, 0.046, 0.03).rotateY(s * 0.35).translate(s * 0.162, 2.985, HZ - 0.012)), COL.skin));   // the ears\n",
     "        if (kind !== \"HK\") for (const s of [1, -1]) parts.push(tint(plain(new SphereGeometry(1, 10, 8).scale(0.016, 0.046, 0.03).rotateY(s * 0.35).translate(s * 0.162, 2.985, HZ - 0.012)), COL.skin));   // the ears (TAMID_FIG_207: none on HK)\n"),
    ("        else if (kind === \"H\") parts.push(",
     "        else if (kind === \"H\" || kind === \"HK\") parts.push("),
    ("        K: bodyGeo(\"K\"), H: bodyGeo(\"H\"), L: bodyGeo(\"L\"), ",
     "        K: bodyGeo(\"K\"), H: bodyGeo(\"H\"), HK: bodyGeo(\"HK\"), L: bodyGeo(\"L\"), "),
    # the belts: the kit's avnet on the kit's figures
    ("      for (const id in W.figs) { const f = W.figs[id]; if (f.kind === \"K\" && f.belt) f.belt.material = bm; }\n",
     "      const K7 = SH.priestKit, km = K7 ? (TM.belt === \"white\" ? K7.mSashWhite : K7.mSashDyed) : bm;   // TAMID_FIG_207\n"
     "      for (const id in W.figs) { const f = W.figs[id]; if (f.kind === \"K\" && f.belt) f.belt.material = f.belt.userData.kit ? km : bm; }\n"),
    # the demonstration begins with the avnet of the opinions row (the lotteries' reading)
    ("      begin: () => { ensure(); TM.active = true;",
     "      begin: () => { const PY = SH.payis; if (PY && PY.avnet) TM.belt = PY.avnet === \"butz\" ? \"white\" : \"kilayim\";   // TAMID_FIG_207: the row \"אבנטו של כהן הדיוט\"\n        ensure(); applyGarb(); TM.active = true;"),
])
print('tamid_fig_207 ok')
