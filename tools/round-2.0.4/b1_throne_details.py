# 1.3.7 (the user, 11.11.2026 19:03: "שאר ההצעות מצוינות" - ה, the figures' details; "ו. תנועה במנוחה חייבת להיות מפני אימת המלך"): the
# golden figures of the throne get a mane in tufts, eyes, a jaw, toes, breast and tail feathers; and the figures of a step that do not
# stretch a limb BOW A LITTLE AND TREMBLE while the king stands on it (still at rest). Idempotent.
import io, sys
P = '/home/claude/beit-rishon/src/60-palace.js'
s = io.open(P, encoding='utf-8').read()
if 'THRONE_DETAILS_137' in s:
    print('60-palace.js: already patched'); sys.exit(0)
def rep(a, b):
    global s
    if s.count(a) != 1:
        print('ANCHOR x%d:' % s.count(a), a[:110]); sys.exit(1)
    s = s.replace(a, b, 1)
# ---- the standing lion
rep('''      .ell(0.045, 0.055, 0.03, 0.5, 1.08, 0.11).ell(0.045, 0.055, 0.03, 0.5, 1.08, -0.11);   // ears
    for (const s of [-1, 1]) {
      if (s === omit) { /* the moving part's leg */ }
      else if (paw !== s) f.rod(0.085, 0.065, 0.32, 0.56, s * 0.12, 0.36, 0.06, s * 0.12).ell(0.085, 0.05, 0.07, 0.4, 0.04, s * 0.12);''',
'''      .ell(0.045, 0.055, 0.03, 0.5, 1.08, 0.11).ell(0.045, 0.055, 0.03, 0.5, 1.08, -0.11);   // ears
    if (!lo) {
      // THRONE_DETAILS_137 - 1.3.7 (the user, 11.11.2026, of "פרטים בדמויות: רעמה לאריה, עיניים, פה...": "מצוינות"; all gold - "ז. גוונים
      // הכל זהב"): the mane in tufts round the face and down the chest, the eyes under the brows, the lower jaw a little open with two
      // teeth, the toes (below). The small figures of the elders' chairs (lo) stay plain.
      for (let i = 0; i < 16; i++) { const a = i * 2 * Math.PI / 16; f.ell(0.065, 0.075, 0.065, 0.4, 0.9 + 0.22 * Math.cos(a), 0.235 * Math.sin(a), 0.25, a, 0, 6, 4); }
      for (let i = 0; i < 9; i++) { const a = (i + 0.5) * 2 * Math.PI / 9; f.ell(0.05, 0.06, 0.055, 0.49, 0.93 + 0.15 * Math.cos(a), 0.17 * Math.sin(a), 0.2, a, 0, 5, 3); }
      for (let i = 0; i < 5; i++) f.ell(0.05, 0.08, 0.06, 0.5 - 0.02 * i, 0.74 - 0.075 * i, (i % 2 ? 1 : -1) * 0.07, 0.5, 0, 0, 5, 3);
      for (const e of [-1, 1]) f.ell(0.022, 0.022, 0.02, 0.69, 0.955, e * 0.075, 0, 0, 0, 5, 3).cone(0.012, 0.76, 0.8, e * 0.04, 0.765, 0.765, e * 0.04, 4);
      f.ell(0.075, 0.022, 0.065, 0.69, 0.775, 0, -0.25);
    }
    const toes = (x, z) => { if (!lo) for (const dz of [-0.04, 0, 0.04]) f.ell(0.028, 0.03, 0.022, x, 0.035, z + dz, 0, 0, 0, 5, 3); };
    for (const s of [-1, 1]) {
      if (s === omit) { /* the moving part's leg */ }
      else if (paw !== s) { f.rod(0.085, 0.065, 0.32, 0.56, s * 0.12, 0.36, 0.06, s * 0.12).ell(0.085, 0.05, 0.07, 0.4, 0.04, s * 0.12); toes(0.47, s * 0.12); }''')
rep('''      f.rod(0.1, 0.065, -0.32, 0.56, s * 0.11, -0.3, 0.06, s * 0.12).ell(0.085, 0.05, 0.07, -0.26, 0.04, s * 0.12);       // hind legs
    }''', '''      f.rod(0.1, 0.065, -0.32, 0.56, s * 0.11, -0.3, 0.06, s * 0.12).ell(0.085, 0.05, 0.07, -0.26, 0.04, s * 0.12);       // hind legs
      toes(-0.19, s * 0.12);
    }''')
# ---- the standing eagle
rep('''      .ell(0.18, 0.04, 0.12, -0.19, 0.24, 0, 0.5);                 // tail, slanting down
    for (const s of [-1, 1]) {
      f.rod(0.035, 0.028, 0.02, 0.3, s * 0.06, 0.04, 0.04, s * 0.07).ell(0.07, 0.025, 0.05, 0.08, 0.025, s * 0.07);   // legs and talons''',
'''      .ell(0.18, 0.04, 0.12, -0.19, 0.24, 0, 0.5);                 // tail, slanting down
    if (!lo) {
      // 1.3.7 (the figures' details): the eyes under a brow, feathers on the breast in rows, the tail's feathers, the toes (below)
      for (const e of [-1, 1]) f.ell(0.016, 0.016, 0.014, 0.115, 0.865, e * 0.055, 0, 0, 0, 5, 3).ell(0.03, 0.01, 0.02, 0.11, 0.887, e * 0.05, -0.3, 0, 0, 5, 3);
      for (let r = 0; r < 4; r++) for (let c = -1; c <= 1; c++) {
        const y = 0.66 - 0.1 * r, k = (y - 0.5) / 0.27, x = 0.15 * Math.sqrt(Math.max(0.05, 1 - k * k)) - 0.012;
        f.ell(0.014, 0.06, 0.04, x * 0.99, y, c * 0.055 + (r % 2 ? 0.027 : 0), -0.2, 0, 0, 6, 3);
      }
      for (const e of [-1, 1]) f.ell(0.19, 0.012, 0.035, -0.2, 0.235, e * 0.075, 0.5, 0, e * 0.25, 5, 3);
    }
    for (const s of [-1, 1]) {
      f.rod(0.035, 0.028, 0.02, 0.3, s * 0.06, 0.04, 0.04, s * 0.07).ell(0.07, 0.025, 0.05, 0.08, 0.025, s * 0.07);   // legs and talons
      if (!lo) for (const dz of [-0.03, 0, 0.03]) f.cone(0.014, 0.1, 0.022, s * 0.07 + dz, 0.19, 0.004, s * 0.07 + 1.7 * dz, 4);''')
# ---- the lying creatures: eyes; the lion's mane in tufts; the ox's nostrils and hooves
rep('''    const bird = (bl, bh, bw, by, hx, hy, hr) => {   // a sitting bird: body, head, beak, folded wings, legs hidden under it
      f.ell(bl, bh, bw, 0, by, 0, -0.12).ell(hr, hr * 1.05, hr * 0.92, hx, hy, 0).cone(hr * 0.45, hx + hr * 0.7, hy - hr * 0.1, 0, hx + hr * 1.7, hy - hr * 0.25, 0);''',
'''    const eyes = (x, y, z, r) => { for (const e of [-1, 1]) f.ell(r, r, r * 0.9, x, y, e * z, 0, 0, 0, 5, 3); };   // 1.3.7 (the figures' details)
    const bird = (bl, bh, bw, by, hx, hy, hr) => {   // a sitting bird: body, head, beak, folded wings, legs hidden under it
      f.ell(bl, bh, bw, 0, by, 0, -0.12).ell(hr, hr * 1.05, hr * 0.92, hx, hy, 0).cone(hr * 0.45, hx + hr * 0.7, hy - hr * 0.1, 0, hx + hr * 1.7, hy - hr * 0.25, 0);
      eyes(hx + hr * 0.5, hy + hr * 0.28, hr * 0.68, hr * 0.2);''')
rep('''        .path(0.025, 0.02, [[-0.48, 0.4, 0], [-0.58, 0.2, 0.05], [-0.56, 0.05, 0.12]]);   // tail
    } else if (kind === "lion") {''', '''        .path(0.025, 0.02, [[-0.48, 0.4, 0], [-0.58, 0.2, 0.05], [-0.56, 0.05, 0.12]]);   // tail
      eyes(0.7, 0.585, 0.105, 0.024);
      eyes(0.845, 0.455, 0.045, 0.016);                                              // nostrils
      for (const e of [-1, 1]) if (e !== omit) f.rod(0.07, 0.066, 0.66, 0.045, e * 0.138, 0.76, 0.04, e * 0.138, 6);   // the hooves of the forelegs
    } else if (kind === "lion") {''')
rep('''        .path(0.03, 0.022, [[-0.46, 0.22, 0], [-0.7, 0.05, 0.08], [-0.86, 0.05, 0.18]]).ell(0.06, 0.05, 0.06, -0.9, 0.06, 0.2);
    } else if (kind === "wolf") {''', '''        .path(0.03, 0.022, [[-0.46, 0.22, 0], [-0.7, 0.05, 0.08], [-0.86, 0.05, 0.18]]).ell(0.06, 0.05, 0.06, -0.9, 0.06, 0.2);
      eyes(0.62, 0.62, 0.065, 0.02);
      for (let i = 0; i < 14; i++) { const a = i * 2 * Math.PI / 14; f.ell(0.055, 0.065, 0.055, 0.41, 0.52 + 0.2 * Math.cos(a), 0.185 * Math.sin(a), 0.2, a, 0, 6, 4); }   // the mane in tufts
    } else if (kind === "wolf") {''')
rep('''        .ell(0.25, 0.075, 0.075, -0.62, 0.13, 0.04, 0.25);                                                     // bushy tail
    } else if (kind === "lamb") {''', '''        .ell(0.25, 0.075, 0.075, -0.62, 0.13, 0.04, 0.25);                                                     // bushy tail
      eyes(0.62, 0.485, 0.07, 0.017);
    } else if (kind === "lamb") {''')
rep('''        .ell(0.07, 0.02, 0.035, 0.42, 0.47, 0.12, 0, 0, 0.4).ell(0.07, 0.02, 0.035, 0.42, 0.47, -0.12, 0, 0, -0.4);   // drooping ears
    } else if (kind === "leopard") {''', '''        .ell(0.07, 0.02, 0.035, 0.42, 0.47, 0.12, 0, 0, 0.4).ell(0.07, 0.02, 0.035, 0.42, 0.47, -0.12, 0, 0, -0.4);   // drooping ears
      eyes(0.5, 0.485, 0.058, 0.016);
    } else if (kind === "leopard") {''')
rep('''      for (const [x, z] of [[0.25, 0.1], [0.05, -0.12], [-0.15, 0.1], [-0.3, -0.06], [0.15, -0.05]]) f.ell(0.035, 0.012, 0.035, x, 0.315, z);   // spots, raised
    } else if (kind === "kid") {''', '''      for (const [x, z] of [[0.25, 0.1], [0.05, -0.12], [-0.15, 0.1], [-0.3, -0.06], [0.15, -0.05]]) f.ell(0.035, 0.012, 0.035, x, 0.315, z);   // spots, raised
      eyes(0.685, 0.405, 0.062, 0.017);
    } else if (kind === "kid") {''')
rep('''        .rod(0.02, 0.01, -0.32, 0.3, 0, -0.36, 0.4, 0);                                                             // short tail
    } else if (kind === "cat") {''', '''        .rod(0.02, 0.01, -0.32, 0.3, 0, -0.36, 0.4, 0);                                                             // short tail
      eyes(0.475, 0.5, 0.055, 0.015);
    } else if (kind === "cat") {''')
rep('''        .path(0.025, 0.018, [[-0.3, 0.12, 0], [-0.38, 0.05, 0.14], [-0.15, 0.03, 0.2], [0.1, 0.04, 0.18]]);   // the tail round the body
    } else if (kind === "eagle" || kind === "hawk") {''', '''        .path(0.025, 0.018, [[-0.3, 0.12, 0], [-0.38, 0.05, 0.14], [-0.15, 0.03, 0.2], [0.1, 0.04, 0.18]]);   // the tail round the body
      eyes(0.44, 0.395, 0.052, 0.016);
    } else if (kind === "eagle" || kind === "hawk") {''')
rep('''        .ell(0.05, 0.05, 0.03, 0.46, 0.63, 0.11).ell(0.05, 0.05, 0.03, 0.46, 0.63, -0.11);   // round ears
    } else if (kind === "deer") {''', '''        .ell(0.05, 0.05, 0.03, 0.46, 0.63, 0.11).ell(0.05, 0.05, 0.03, 0.46, 0.63, -0.11);   // round ears
      eyes(0.63, 0.545, 0.095, 0.021);
    } else if (kind === "deer") {''')
rep('''      for (const s of [-1, 1]) f.path(0.02, 0.008, [[0.54, 0.76, s * 0.04], [0.5, 0.92, s * 0.1], [0.44, 1.02, s * 0.16]]).path(0.015, 0.006, [[0.5, 0.92, s * 0.1], [0.56, 1.0, s * 0.14]]);   // antlers
    } else if (kind === "dove") {''', '''      for (const s of [-1, 1]) f.path(0.02, 0.008, [[0.54, 0.76, s * 0.04], [0.5, 0.92, s * 0.1], [0.44, 1.02, s * 0.16]]).path(0.015, 0.006, [[0.5, 0.92, s * 0.1], [0.56, 1.0, s * 0.14]]);   // antlers
      eyes(0.61, 0.71, 0.056, 0.016);
    } else if (kind === "dove") {''')
# ---- the awe: the track and its use in the three ascents
rep('''        sitFrom(p0, a, b) {''', '''        // 1.3.7 (the user, 11.11.2026 19:03: "תנועה במנוחה חייבת להיות מפני אימת המלך"): at rest the figures stand still; a figure of the step
        // on which the king stands that stretches no limb BOWS a little and trembles while he is there, and stands again (amp: the bow)
        bow(obj, a, b, amp = 0.13) { return { a, b, f: (u, t) => { const on = u > 0 && u < 1; obj.rotation.z = on ? -amp * Math.sin(Math.PI * u) : 0; obj.rotation.x = on ? 0.012 * Math.sin(t * 37) : 0; } }; },
        sitFrom(p0, a, b) {''')
rep('''        const E6W = d.eagles[10], E6E = d.eagles[11];
        const SH_S = 3.02, SH_H = 1.74, SH_X = 0.5;''', '''        const E6W = d.eagles[10], E6E = d.eagles[11];
        // the awe (T.bow): the standing lions and eagles of the step he stands on (they stretch nothing here) - on the sixth the lions only
        for (let k = 1; k <= 6; k++) {
          const a = (k - 1) * SP, li = (k - 1) * 2, e0 = k === 1 ? 0.3 : 0.9, e1 = k < 6 ? a + 3.9 : tSeize + 2;
          for (const fg of k < 6 ? [d.lions[li], d.lions[li + 1], d.eagles[li], d.eagles[li + 1]] : [d.lions[li], d.lions[li + 1]]) tr.push(T.bow(fg.body, a + e0, e1));
        }
        const SH_S = 3.02, SH_H = 1.74, SH_X = 0.5;''')
rep('''          tr.push(T.reachTo(sp.paw, a, a + 2.6, h), T.reachTo(sp.wing, a, a + 2.6, h), T.reachBack(sp.paw, a + 4.8, a + 6, h), T.reachBack(sp.wing, a + 4.8, a + 6, h));
        }''', '''          tr.push(T.reachTo(sp.paw, a, a + 2.6, h), T.reachTo(sp.wing, a, a + 2.6, h), T.reachBack(sp.paw, a + 4.8, a + 6, h), T.reachBack(sp.wing, a + 4.8, a + 6, h));
          // 1.3.7, the awe (T.bow): the step's figures that stretch nothing - the outer lion and eagle and the lying pair - while he stands there
          const li = (k - 1) * 2;
          for (const l of [d.lions[li], d.lions[li + 1]]) if (!l.paw) tr.push(T.bow(l.body, a + 2.9, a + 5.7));
          for (const e of [d.eagles[li], d.eagles[li + 1]]) if (e.R !== sp.wing && e.L !== sp.wing) tr.push(T.bow(e.body, a + 2.9, a + 5.7));
          if (d.beasts) for (const m of [d.beasts[li], d.beasts[li + 1]]) if (m) tr.push(T.bow(m, a + 2.9, a + 5.7, 0.1));
        }''')
rep('''          tr.push(T.gear(k, a + 4, a + 6), T.reachTo(D.paw, a + 4, a + 5.4, h), T.reachTo(f.wing, a + 4, a + 5.4, h), T.reachBack(D.paw, a + 6.4, a + 7, h), T.reachBack(f.wing, a + 6.4, a + 7, h));
        }''', '''          tr.push(T.gear(k, a + 4, a + 6), T.reachTo(D.paw, a + 4, a + 5.4, h), T.reachTo(f.wing, a + 4, a + 5.4, h), T.reachBack(D.paw, a + 6.4, a + 7, h), T.reachBack(f.wing, a + 6.4, a + 7, h));
          // 1.3.7, the awe (T.bow): the eagle that stretches no wing and the lying pair of the step, as he comes up to it
          { const li = (k - 1) * 2, eO = d.eagles[li].L === f.wing || d.eagles[li].R === f.wing ? d.eagles[li + 1] : d.eagles[li];
            tr.push(T.bow(eO.body, a + 5.2, a + 7));
            if (d.beasts) for (const m of [d.beasts[li], d.beasts[li + 1]]) if (m) tr.push(T.bow(m, a + 5.2, a + 7, 0.1)); }
        }''')
rep('״ונותנה אותו על ברכיו״ (בית המדרש ב).\\nההושבה על הכסא — בכל מדרש כלשונו:',
    '״ונותנה אותו על ברכיו״ (בית המדרש ב).\\nבמודל: במנוחה הדמויות עומדות דום; כשהמלך עומד במעלה, הדמויות שבה שאינן פושטות יד מרכינות מעט את ראשן ורועדות, מפני אימת המלך, ושבות לעמוד (בחירת מודל).\\nההושבה על הכסא — בכל מדרש כלשונו:')
io.open(P, 'w', encoding='utf-8').write(s)
print('60-palace.js: patched (details of the figures, the awe)')
# (later, the same evening) the ox's neck round - applied when missing
_s = io.open(P, encoding='utf-8').read()
_a = "      f.rod(0.13, 0.11, 0.42, 0.42, 0, 0.56, 0.5, 0)               // neck"
if _a in _s:
    io.open(P, 'w', encoding='utf-8').write(_s.replace(_a, "      f.rod(0.13, 0.11, 0.42, 0.42, 0, 0.56, 0.5, 0, 12)           // neck (1.3.7: round, twelve sides - with six it read as a block)"))
# the necks of the wolf, the leopard, the kid and the deer round too (ten sides)
_s = io.open(P, encoding='utf-8').read()
for _a, _b in [("f.rod(0.09, 0.08, 0.4, 0.3, 0, 0.52, 0.4, 0).ell(", "f.rod(0.09, 0.08, 0.4, 0.3, 0, 0.52, 0.4, 0, 10).ell("), ("f.rod(0.08, 0.075, 0.44, 0.24, 0, 0.56, 0.32, 0).ell(", "f.rod(0.08, 0.075, 0.44, 0.24, 0, 0.56, 0.32, 0, 10).ell("), ("f.rod(0.07, 0.06, 0.28, 0.32, 0, 0.38, 0.42, 0).ell(", "f.rod(0.07, 0.06, 0.28, 0.32, 0, 0.38, 0.42, 0, 10).ell("), ("f.rod(0.07, 0.06, 0.34, 0.3, 0, 0.5, 0.62, 0).ell(", "f.rod(0.07, 0.06, 0.34, 0.3, 0, 0.5, 0.62, 0, 10).ell(")]:
    _s = _s.replace(_a, _b)
io.open(P, 'w', encoding='utf-8').write(_s)
# the necks start inside the bodies (their flat ends showed as blocks); the ox's hooves cloven and small
_s = io.open(P, encoding='utf-8').read()
for _a, _b in [
 ("f.rod(0.13, 0.11, 0.42, 0.42, 0, 0.56, 0.5, 0, 12)           // neck (1.3.7: round, twelve sides - with six it read as a block)", "f.rod(0.13, 0.11, 0.3, 0.35, 0, 0.56, 0.5, 0, 12)            // neck (1.3.7: round, and from inside the body - its flat end showed as a block)"),
 ("f.rod(0.09, 0.08, 0.4, 0.3, 0, 0.52, 0.4, 0, 10).ell(", "f.rod(0.09, 0.08, 0.28, 0.2, 0, 0.52, 0.4, 0, 10).ell("),
 ("f.rod(0.08, 0.075, 0.44, 0.24, 0, 0.56, 0.32, 0, 10).ell(", "f.rod(0.08, 0.075, 0.315, 0.157, 0, 0.56, 0.32, 0, 10).ell("),
 ("f.rod(0.07, 0.06, 0.28, 0.32, 0, 0.38, 0.42, 0, 10).ell(", "f.rod(0.07, 0.06, 0.18, 0.22, 0, 0.38, 0.42, 0, 10).ell("),
 ("f.rod(0.07, 0.06, 0.34, 0.3, 0, 0.5, 0.62, 0, 10).ell(", "f.rod(0.07, 0.06, 0.286, 0.193, 0, 0.5, 0.62, 0, 10).ell("),
 ("for (const e of [-1, 1]) if (e !== omit) f.rod(0.07, 0.066, 0.66, 0.045, e * 0.138, 0.76, 0.04, e * 0.138, 6);   // the hooves of the forelegs", "for (const e of [-1, 1]) if (e !== omit) for (const dz of [-0.03, 0.03]) f.ell(0.045, 0.036, 0.028, 0.7, 0.036, e * 0.138 + dz, 0, 0, 0, 6, 4);   // the cloven hooves of the forelegs")]:
    _s = _s.replace(_a, _b)
io.open(P, 'w', encoding='utf-8').write(_s)
