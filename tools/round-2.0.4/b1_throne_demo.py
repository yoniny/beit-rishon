# 1.3.7 (the user, 11.11.2026 18:55-19:03, of his recording of the throne's ascent): the ramp as wide as the steps; in the Targum
# Sheni version the lying pair of every step stretches ("חיה טמאה מול חיה טהורה"), nothing stretches for nothing on the sixth, and
# the eagles come down, seize him, raise him and seat him. Idempotent.
import io, sys
P = '/home/claude/beit-rishon/src/60-palace.js'
s = io.open(P, encoding='utf-8').read()
if 'THRONE_DEMO_137' in s:
    print('60-palace.js: already patched'); sys.exit(0)
def rep(a, b, n=1):
    global s
    if s.count(a) < 1:
        print('ANCHOR MISSING:', a[:90]); sys.exit(1)
    s = s.replace(a, b, n)

# ---- A. the ramp
rep('      const RW = 6, RL = 3;',
    '      // THRONE_DEMO_137 - 1.3.7 (the user, 11.11.2026 19:03: "הכבש לא מיושר לכסא"; 19:00: "חיבור מדרגה הוא בכל הקריאות"): the ramp is as\n'
    '      // wide as the steps (6 until 1.3.6), its sides in one line with theirs - in the base, so in all four versions\n'
    '      const RW = SW, RL = 3;')
# ---- B. the lying creatures: a foreleg / a wing may be left out for a moving limb
rep('  function pal_beastGeo(kind) {', '  function pal_beastGeo(kind, omit = 0) {   // 1.3.7: omit = +1 / -1 - that foreleg (a bird: that folded wing) is left out, a moving limb supplies it')
rep('''        f.rod(0.05 * H / 0.4, 0.04 * H / 0.4, L * 0.28, 0.06, s * W * 0.3, L * 0.5 + 0.1, 0.045, s * W * 0.3);
        f.ell(0.06 * H / 0.4, 0.035, 0.05 * H / 0.4, L * 0.5 + 0.13, 0.035, s * W * 0.3);
''', '''        if (s !== omit) {
          f.rod(0.05 * H / 0.4, 0.04 * H / 0.4, L * 0.28, 0.06, s * W * 0.3, L * 0.5 + 0.1, 0.045, s * W * 0.3);
          f.ell(0.06 * H / 0.4, 0.035, 0.05 * H / 0.4, L * 0.5 + 0.13, 0.035, s * W * 0.3);
        }
''')
rep('      for (const s of [-1, 1]) f.ell(bl * 0.85, bh * 0.75, 0.035, -bl * 0.15, by + bh * 0.1, s * bw * 0.85, -0.25);',
    '      for (const s of [-1, 1]) if (s !== omit) f.ell(bl * 0.85, bh * 0.75, 0.035, -bl * 0.15, by + bh * 0.1, s * bw * 0.85, -0.25);')
# ---- C. the limbs' geometries
rep('''  function pal_oxLegGeo() {
    const f = pal_fig();
    f.rod(0.0625, 0.05, 0, 0, 0, 0.33, 0, 0).ell(0.075, 0.04, 0.0625, 0.35, 0, 0);
    return f.geo();
  }
''', '''  function pal_oxLegGeo() {
    const f = pal_fig();
    f.rod(0.0625, 0.05, 0, 0, 0, 0.33, 0, 0).ell(0.075, 0.04, 0.0625, 0.35, 0, 0);
    return f.geo();
  }
  // 1.3.7: the moving foreleg of a lying creature of length L and height H (the leg pal_beastGeo's `omit` leaves out), its shoulder at the
  // origin, along +x; and the moving wing of a sitting bird (body length bl, height bh), its shoulder at the origin, along +x
  function pal_beastLegGeo(L, H) {
    const f = pal_fig(), n = L * 0.22 + 0.1, k = H / 0.4;
    f.rod(0.05 * k, 0.04 * k, 0, 0, 0, n, 0, 0).ell(0.06 * k, 0.035, 0.05 * k, n + 0.03, -0.01, 0);
    return f.geo();
  }
  function pal_birdWingGeo(bl, bh) {
    const f = pal_fig();
    f.ell(bl * 0.85, bh * 0.75, 0.035, bl * 0.85, 0, 0);
    return f.geo();
  }
''')
# ---- D. the cache and the pairs
rep('      const beastGeo = (kind) => once("beast_" + kind, () => pal_beastGeo(kind));',
    '      const beastGeo = (kind, omit = 0) => once("beast_" + kind + (omit || ""), () => pal_beastGeo(kind, omit));')
rep('''      const pairsAt = (grp, PAIRS) => {
        const out = [];
        PAIRS.forEach(([e, w], i) => {
          const k = i + 1;
          out.push(put(grp, beastGeo(e), gold, X + 2.05, stepY(k), stepZ(k), Math.PI, 1, "beast_" + e), put(grp, beastGeo(w), gold, X - 2.05, stepY(k), stepZ(k), 0, 1, "beast_" + w));
        });
        return out;
      };
''', '''      // 1.3.7 (the user, 11.11.2026 19:00: "תעשה חיה טמאה מול חיה טהורה"): limbs = on that many steps, from the first, each creature of the
      // pair has a MOVING LIMB on the hall's side - a foreleg, a bird its wing - which stretches to him who goes up between them
      // (out.limbs[k] = [the east one's, the west one's]; the builders leave that leg / wing out)
      const BEAST_DIM = { ox: [1.0, 0.5, 0.46], lion: [0.95, 0.42, 0.38], wolf: [0.95, 0.34, 0.3], lamb: [0.72, 0.42, 0.42], leopard: [1.05, 0.3, 0.28], kid: [0.66, 0.34, 0.3], cat: [0.6, 0.28, 0.24], bear: [0.95, 0.5, 0.5], deer: [0.8, 0.34, 0.26] };
      const BIRD_DIM = { eagle: [0.2, 0.15, 0.14, 0.17], peacock: [0.16, 0.13, 0.12, 0.16], rooster: [0.15, 0.13, 0.11, 0.17], bird: [0.11, 0.085, 0.08, 0.1], dove: [0.14, 0.11, 0.1, 0.12] };
      const beastLimb = (mesh, kind, side) => {
        const q = BEAST_DIM[kind];
        if (q) return mkLimb(mesh, once("bleg_" + kind, () => pal_beastLegGeo(q[0], q[1])), gold, [q[0] * 0.28, 0.06, side * q[2] * 0.3], [1, 0, 0], [1, -0.05, 0], [1, 0, 0], "beastLeg");
        const b = BIRD_DIM[kind];
        return mkLimb(mesh, once("bwing_" + kind, () => pal_birdWingGeo(b[0], b[1])), gold, [b[0] * 0.55, b[3] + b[1] * 0.1, side * b[2] * 0.85], [1, 0, 0], [-1, -0.25, 0], [1, 0.2, 0], "beastWing");
      };
      const pairsAt = (grp, PAIRS, limbs = 0) => {
        const out = [];
        out.limbs = [null];
        PAIRS.forEach(([e, w], i) => {
          const k = i + 1, mvb = k <= limbs;
          const mE = put(grp, beastGeo(e, mvb ? -1 : 0), gold, X + 2.05, stepY(k), stepZ(k), Math.PI, 1, "beast_" + e), mW = put(grp, beastGeo(w, mvb ? 1 : 0), gold, X - 2.05, stepY(k), stepZ(k), 0, 1, "beast_" + w);
          out.push(mE, mW);
          out.limbs.push(mvb ? [beastLimb(mE, e, -1), beastLimb(mW, w, 1)] : null);
        });
        return out;
      };
''')
# ---- E. the Targum Sheni version
rep('''        d.beasts = pairsAt(grp, [["ox", "lion"], ["wolf", "lamb"], ["leopard", "kid"], ["eagle", "peacock"], ["cat", "rooster"], ["eagle", "bird"]]);   // 1.0.1-L (A25''',
    '''        d.beasts = pairsAt(grp, [["ox", "lion"], ["wolf", "lamb"], ["leopard", "kid"], ["eagle", "peacock"], ["cat", "rooster"], ["eagle", "bird"]], 5);   // 1.3.7: the pairs of the five lower steps stretch a limb in the ascent; 1.0.1-L (A25''')
a = s.index('        const tr = [], SP = 4, tSeize = 6 * SP;')
end_mark = 'T.sit(tSeize + 4.2, tSeize + 5.2));\n'
b = s.index(end_mark, a) + len(end_mark)
new_block = '''        // 1.3.7 (the user, 11.11.2026, of his recording: "מי ששולח את היד... זה אחד החיות ולא האריה או המקביל... תעשה השוואה לפי ההמשך";
        // 19:00: "תעשה חיה טמאה מול חיה טהורה"; "בסוף, שניים שולחים, מאריכים את הידיים שלהם ולא יוצא מזה כלום. כשמושיבים אותו, ההתיישבות
        // היא לבד, וזה צריך להיות על ידי הנשרים"). The Targum names the ox on the first step and no one on the others; until 1.3.6 the
        // standing lion and eagle stretched on steps 2-6 (a model choice) and again, for nothing, on the sixth. NOW: on each of the five
        // lower steps THE LYING PAIR of that step - the pure creature and the impure one facing it (the Targum's pairs: the ox and the lion,
        // the wolf and the lamb, the leopard and the kid, the eagle and the peacock, the cat and the rooster) - stretch a foreleg / a wing to
        // the very middle and raise him to the next step; the standing lions and eagles do not stretch in the climb. On the sixth no one
        // stretches: "ומן שתיתאה נחתין נשרין וחטפין יתיה ומסקין ומותבין יתיה על ריש כורסייה" - the two eagles of the sixth step rise, COME DOWN
        // on his shoulders, seize him, raise him, bear him over the seat and SET HIM DOWN on it; they stay on his shoulders until he sits.
        const tr = [], SP = 4, tSeize = 5 * SP + 1.6;
        const BL = d.beasts.limbs;
        d.oxLeg = BL[1][0];
        tr.push(T.silOn(0, 1e6), T.move(sil, silStart, silAt(1), 0, 0.9, 0.2));
        for (let k = 1; k <= 6; k++) tr.push(T.glow(k, (k - 1) * SP, k < 6 ? k * SP : tSeize + 2.1));
        for (let k = 1; k <= 5; k++) {
          const a = (k - 1) * SP, h = handAt(k), next = handAt(k + 1);
          for (const p of BL[k]) tr.push(T.reachTo(p, a + 0.9, a + 3, h), T.follow(p, sil, HAND_Y, a + 4, a + 5.2), T.reachBack(p, a + 5.2, a + 6, next));
          tr.push(T.move(sil, silAt(k), silAt(k + 1), a + 4, a + 5.2, 0.3));
        }
        const E6W = d.eagles[10], E6E = d.eagles[11];
        const SH_S = 3.02, SH_H = 1.74, SH_X = 0.5;   // the silhouette's shoulders: their height standing / seated, half their breadth
        const p6 = silAt(6);
        const overW = [X - SH_X, p6[1] + SH_S + 1.6, p6[2]], overE = [X + SH_X, p6[1] + SH_S + 1.6, p6[2]];
        const onW = [X - SH_X, p6[1] + SH_S, p6[2]], onE = [X + SH_X, p6[1] + SH_S, p6[2]];
        flyOut(tr, E6W, E6W.home, overW, tSeize, tSeize + 1.3, 1.0);
        flyOut(tr, E6E, E6E.home, overE, tSeize, tSeize + 1.3, 1.0);
        tr.push(T.move(E6W.body, overW, onW, tSeize + 1.3, tSeize + 1.9), T.move(E6E.body, overE, onE, tSeize + 1.3, tSeize + 1.9));   // "נחתין... וחטפין יתיה"
        const tC = tSeize + 2.1, tSeat = tC + 3.2;
        const HOV = [X, top + DH + 1.0, zHead + 0.55];            // standing, held over the front of the seat
        const HOVS = [X, HOV[1] + SH_S - SH_H, HOV[2]];           // the same moment seated: the shoulders at the same height
        const seatedW = [X - SH_X, silSeated[1] + SH_H, silSeated[2]], seatedE = [X + SH_X, silSeated[1] + SH_H, silSeated[2]];
        tr.push({ a: tC, b: tSeat, f: (u) => {                    // "ומסקין ומותבין יתיה על ריש כורסייה": he and the two eagles as one
          const seated = u > 0.58;
          silSeat.visible = seated; silStand.visible = !seated;
          if (!(u > 0)) return;
          let py, pz, sh;
          if (!seated) { const v = u / 0.58; py = p6[1] + (HOV[1] - p6[1]) * v + 0.9 * v * (1 - v); pz = p6[2] + (HOV[2] - p6[2]) * v; sh = SH_S; }
          else { const v = (u - 0.58) / 0.42; py = HOVS[1] + (silSeated[1] - HOVS[1]) * v; pz = HOVS[2] + (silSeated[2] - HOVS[2]) * v; sh = SH_H; }
          sil.position.set(X, py, pz);
          E6W.body.position.set(X - SH_X, py + sh, pz); E6E.body.position.set(X + SH_X, py + sh, pz);
        } });
        for (const e of [E6W, E6E]) tr.push(T.flap(e.R, tSeize + 0.9, tSeat, 13), T.flap(e.L, tSeize + 0.9, tSeat, 13), T.curve(e.R, tSeat, tSeat + 0.4, 0, 1), T.curve(e.L, tSeat, tSeat + 0.4, 0, 1));
        // he sits; the two let go and rise to the sides of the seat's head
        const seatW = [X - 1.7, sTop + 2.75, zHead + 0.25], seatE = [X + 1.7, sTop + 2.75, zHead + 0.25];
        tr.push(T.move(E6W.body, seatedW, seatW, tSeat + 0.3, tSeat + 1.3, 0.25), T.move(E6E.body, seatedE, seatE, tSeat + 0.3, tSeat + 1.3, 0.25));
'''
s = s[:a] + new_block + s[b:]
rep('        const GE = d.greatEagle, t0 = tSeize + 6, GEc =', '        const GE = d.greatEagle, t0 = tSeat + 1.6, GEc =')
rep('        tr.push(T.spray(sprW, 0.5, tSeize + 5.2), T.spray(sprE, 0.5, tSeize + 5.2));', '        tr.push(T.spray(sprW, 0.5, tSeat), T.spray(sprE, 0.5, tSeat));')
rep('        SCRIPTS.targumSheni = { duration: tBack + 2.5, tracks: tr,',
    '        { const C = CAP.targumSheni; C[6].t = tSeize - 0.3; C[7].t = t0; C[8].t = tD; C[9].t = tR; C[10].t = tDove; C[11].t = tDove + 8; }   // 1.3.7: the captions keep step with the new times\n'
    '        SCRIPTS.targumSheni = { duration: tBack + 2.5, tracks: tr,')
# ---- F. the note
rep('— השור פושט את ידו ממקומו ומרים ממעלה למעלה, הנשרים מושיבים, הנשר הגדול',
    '— התרגום מזכיר בפירוש את השור שבמעלה הראשונה; במודל, בכל אחת מחמש המעלות התחתונות פושטות יד שתי החיות הרובצות שבה, הטהורה מכאן והטמאה שכנגדה מכאן (בראשונה השור והארי), והמלך עולה ביניהן — בחירת מודל; מן השישית הנשרים יורדים על כתפיו, אוחזים בו, מעלים ומושיבים אותו; הנשר הגדול')
io.open(P, 'w', encoding='utf-8').write(s)
print('60-palace.js: patched (ramp, lying pairs, seating by the eagles)')
