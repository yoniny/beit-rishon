# 1.3.7 (the user, 11.11.2026 18:31): in the Tosafot reading of the devir's height the upper ten amot carry THE SAME CARVINGS as the
# twenty below ("אותם ציורים של למטה, אין הבדל. זה הכוונה כולו זהב"). Idempotent.
import io, sys
B = '/home/claude/beit-rishon/src/'
def patch(fn, pairs, mark):
    s = io.open(B + fn, encoding='utf-8').read()
    if mark in s:
        print(fn + ': already patched'); return
    for a, b in pairs:
        if a not in s:
            print(fn + ': ANCHOR MISSING: ' + a[:70]); sys.exit(1)
        s = s.replace(a, b, 1)
    io.open(B + fn, 'w', encoding='utf-8').write(s)
    print(fn + ': patched')

# 50-heichal.js: the plain gold boxes of the "tosafot" reading go (the group, its label and the stone of the Radak's reading stay)
patch('50-heichal.js', [(
'''        for (const [grp, mat] of [[hiGold, M.gold], [hiStone, hei_gemStone]]) {
          for (const s of [-1, 1]) { const w = H.box(grp, DE - DW, hh, 0.2, mat, (DE + DW) / 2, y0, s * 9.9); if (s > 0) cut.push(w); }
          H.box(grp, 0.2, hh, 19.6, mat, DW + 0.1, y0, 0);
        }''',
'''        // 1.3.7, later (the user, 18:31: "לתוספות צריך להיות את אותם ציורים של למטה, אין הבדל. זה הכוונה כולו זהב"): the gold of the
        // "tosafot" reading is CARVED as the twenty amot below it - built in 55-interior.js with the devir's own skins (DEVIR_CARVED_UP),
        // into this group; here only the stone of the Radak's reading
        for (const [grp, mat] of [[hiStone, hei_gemStone]]) {
          for (const s of [-1, 1]) { const w = H.box(grp, DE - DW, hh, 0.2, mat, (DE + DW) / 2, y0, s * 9.9); if (s > 0) cut.push(w); }
          H.box(grp, 0.2, hh, 19.6, mat, DW + 0.1, y0, 0);
        }''')], 'DEVIR_CARVED_UP')

patch('55-interior.js', [(
'''      int_uvBox(dw, XDW, XDW + SKIN, F, F + DH, -HW, HW, faceUV(0, HW));     // west skin (u = 10 - z)
      mergedMesh(dw, goldCarved, g);
''',
'''      int_uvBox(dw, XDW, XDW + SKIN, F, F + DH, -HW, HW, faceUV(0, HW));     // west skin (u = 10 - z)
      mergedMesh(dw, goldCarved, g);
      // DEVIR_CARVED_UP - 1.3.7 (the user, 11.11.2026 18:31, of the reading that the devir is thirty high - Bava Batra 98b and the
      // Tosafot there: "לתוספות צריך להיות את אותם ציורים של למטה, אין הבדל. זה הכוונה כולו זהב"): the upper ten amot of the three
      // walls carry the same carved gold - a third register of the same cell (as the kodesh's three), the same uvs, so the pattern runs
      // on from below. Into the group of that reading (ctx.layers.devirHighGold, 50-heichal.js sec. 8), which shows them.
      {
        const hg = ctx.layers && ctx.layers.devirHighGold;
        if (hg) {
          const yA = F + DH, yB = F + KH - 0.05;
          const un = [], us = [], uw = [];
          int_uvBox(un, XDW, XDE, yA, yB, -HW, -HW + SKIN, faceUV(XDW, 0));
          mergedMesh(un, goldCarved, hg);
          int_uvBox(us, XDW, XDE, yA, yB, HW - SKIN, HW, faceUV(XDE, 0));
          cut.push(mergedMesh(us, goldCarvedSouth, hg));
          int_uvBox(uw, XDW, XDW + SKIN, yA, yB, -HW, HW, faceUV(0, HW));
          mergedMesh(uw, goldCarved, hg);
        }
      }
''')], 'DEVIR_CARVED_UP')
