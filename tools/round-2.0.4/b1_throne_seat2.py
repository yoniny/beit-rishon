# 1.3.7 (the user, 11.11.2026: "כשמושיבים אותו, ההתיישבות היא לבד, וזה צריך להיות על ידי הנשרים או הטווסים, מה שזה ממש"; "תעשה חיה טמאה
# מול חיה טהורה"): the seating in the other two midrashic versions by what each source says - Abba Gorion: a silver peacock; Beit
# HaMidrash: the silver dragon and the throne's wheel - and Abba Gorion's lying pairs in the Esther Rabbah version. Idempotent.
import io, sys
P = '/home/claude/beit-rishon/src/60-palace.js'
s = io.open(P, encoding='utf-8').read()
if 'THRONE_SEAT2_137' in s:
    print('60-palace.js: already patched'); sys.exit(0)
def rep(a, b):
    global s
    if s.count(a) != 1:
        print('ANCHOR x%d:' % s.count(a), a[:100]); sys.exit(1)
    s = s.replace(a, b, 1)
# ---- (a) set down on the seat from any place
rep('''        spray(sp, a, b) { return { a, b, f: (u, t) => { if (u > 0 && u < 1) { sp.pts.visible = true; sp.tick(t); } else sp.pts.visible = false; } }; }
      };''', '''        spray(sp, a, b) { return { a, b, f: (u, t) => { if (u > 0 && u < 1) { sp.pts.visible = true; sp.tick(t); } else sp.pts.visible = false; } }; },
        // THRONE_SEAT2_137 - 1.3.7: he is set down on the seat from p0 (where the one that bore him holds him): the seated figure from the first moment
        sitFrom(p0, a, b) { return { a, b, f: (u) => { silSeat.visible = u > 0; silStand.visible = !(u > 0); if (u > 0) sil.position.set(p0[0] + (silSeated[0] - p0[0]) * u, p0[1] + (silSeated[1] - p0[1]) * u + 0.6 * u * (1 - u), p0[2] + (silSeated[2] - p0[2]) * u); } }; }
      };''')
# ---- (b) Esther Rabbah's version: the standing figures farther out, Abba Gorion's lying pairs, the silver peacock
rep('''        const IN = 2.6, OUT = 3.6;
''', '''        // 1.3.7: the lying pairs are in Abba Gorion's text after all (the library's 5844, line 5: "ועל כל מעלה ומעלה היו בו חיות טהורות כנגד
        // טמאות במעלה הראשונה שור וכנגדו ארי שניה טלה [וכנגדו] זאב שלישית גדי [וכנגדו] נמר רביעית צבי [וכנגדו] דוב חמישית נשר [וכנגדו] יונה
        // ששית נץ [וכנגדו] צפור והוא עולה ונותן שלום ביניהן") - the user, 11.11.2026: "תעשה חיה טמאה מול חיה טהורה". They lie by the way up
        // (below), so the standing figures move out: 3.5 and 4.5 from the middle (2.6 and 3.6 until 1.3.6), as in the other versions
        const IN = 3.5, OUT = 4.5;
''')
rep('''        gemsAt(grp, ["pearl", "emerald", "carbuncle", "glass"]);   // "לבנות ירקרקות ואדמדמות, ויש בהם בזכוכית טובה קריסטאלי" (Panim Acherim)
''', '''        gemsAt(grp, ["pearl", "emerald", "carbuncle", "glass"]);   // "לבנות ירקרקות ואדמדמות, ויש בהם בזכוכית טובה קריסטאלי" (Panim Acherim)
        d.beasts = pairsAt(grp, [["ox", "lion"], ["lamb", "wolf"], ["kid", "leopard"], ["deer", "bear"], ["eagle", "dove"], ["hawk", "bird"]]);   // 1.3.7: Abba Gorion's pairs, in his order (the first named on the east)
''')
a = s.index('        tr.push(T.move(sil, silAt(6), silFront, tTop, tTop + 1.2, 0.5), T.sit(tTop + 1.2, tTop + 2.2));')
b = s.index('        SCRIPTS.estherRabbah = { duration: 51.5, tracks: tr,', a)
s = s[:a] + '''        // 1.3.7 (the user: "כשמושיבים אותו, ההתיישבות היא לבד, וזה צריך להיות על ידי הנשרים או הטווסים, מה שזה ממש"): Abba Gorion (the library's
        // 5844, line 5): "וכן לכל מעלה ומעלה והיה טווס של כסף טען במגנון למלך ומושיבו על הכסא" - A SILVER PEACOCK at the head of the steps comes
        // under him on the sixth step, bears him on its back to the seat, and he is set down from it; then it goes back. (Until 1.3.6 he went
        // to the seat and sat by himself.) The peacock's place, size and way: model choices.
        const PK = 2.1, pkB = 0.34 * PK, p6 = silAt(6);
        const pkHome = [X + 2.0, top, bZ1 - 0.3], pkAt6 = [X, top, p6[2] - 0.05], pkSeat = [X, top, zD + DR + 0.55];
        const pk = put(grp, beastGeo("peacock"), silver, pkHome[0], pkHome[1], pkHome[2], -HP, PK, "throneSilverPeacock");
        d.silverPeacock = pk;
        const on6 = [X, top + pkB, p6[2]], onSeat = [X, top + pkB, pkSeat[2] + 0.05];
        const tS = tTop + 4.6;   // he sits
        tr.push(T.move(pk, pkHome, pkAt6, tTop, tTop + 1.1, 0.15), T.move(sil, p6, on6, tTop + 0.7, tTop + 1.3, 0.25),
          T.turn(pk, -HP, HP, tTop + 1.1, tTop + 1.6), T.move(pk, pkAt6, pkSeat, tTop + 1.6, tTop + 3.3), T.move(sil, on6, onSeat, tTop + 1.6, tTop + 3.3),
          T.sitFrom(onSeat, tTop + 3.4, tS), T.turn(pk, HP, -HP, tS + 0.3, tS + 0.9), T.move(pk, pkSeat, pkHome, tS + 0.5, tS + 1.8, 0.15));
        tr.push(T.spray(sprW, 0.5, tTop + 0.5), T.spray(sprE, 0.5, tTop + 0.5));   // "שהיו זולפים בשמים, כשהיה המלך שלמה עולה"
        // "הנשרים פורשים גפיהם, ועולים במנגנין, והיו מכסין למעלה על ראשו של מלך": all the twelve, wing tip to wing tip over the seat (A27)
        const up = d.eagles, slots = canopy([-0.85, 0, 0.85], sTop + 3.15);
        up.forEach((e, i) => flyOut(tr, e, e.home, slots[i], tS - 0.6, tS + 1.9));
        doveScroll(tr, d.dove, d.doveHome, tS + 1.9, tS + 13.6, 1.2, SCR_HANDS);   // "ויונה של זהב יורדת מן העמוד במנגנין, ופותחת הארון ולוקחת ס"ת, ונותנת לתוך ידו של מלך"
        up.forEach((e, i) => flyBack(tr, e, slots[i], tS + 11.9, tS + 13.4));
        { const C = CAP.estherRabbah; if (C.length === 9) { C.splice(6, 0, { t: tTop, text: "״וכן לכל מעלה ומעלה, והיה טווס של כסף טען במגנון למלך ומושיבו על הכסא״ (מדרש אבא גוריון)" }); C[7].t = tS - 0.6; C[8].t = tS + 1.9; C[9].t = tS + 9.9; } }
''' + s[b:]
rep('        SCRIPTS.estherRabbah = { duration: 51.5, tracks: tr,', '        SCRIPTS.estherRabbah = { duration: tS + 13.9, tracks: tr,')
# ---- (c) Beit HaMidrash: the dragon and the wheel of the throne
rep('''        tr.push(T.move(sil, silAt(6), silFront, tTop, tTop + 2, 0.5), T.sit(tTop + 2, tTop + 3), T.rock(dragon, "z", 0.22, 20, tTop, tTop + 3), T.spin(dragonGear, tTop, tTop + 3, 3));''',
'''        // 1.3.7 (the user: "כשמושיבים אותו, ההתיישבות היא לבד"): the silver dragon works the mechanism, and A WHEEL OF THE THRONE comes up under
        // his feet on the sixth step, bears him to the seat, and he is set down from it; then it goes back into the step. (Until 1.3.6 he
        // went to the seat and sat by himself while the dragon rocked.) The wheel under his feet and its way: model choices.
        const p6 = silAt(6), whl = put(grp, once("seatWheel", () => pal_gearGeo(0.8, 14, 0.1)), gold, X, top - 0.2, p6[2], 0, 1, "throneSeatWheel");
        whl.rotation.x = -HP;
        const wIn = [X, top - 0.2, p6[2]], wUp = [X, top + 0.06, p6[2]], wSeat = [X, top + DH + 0.06, zD + 1.25], kUp = [X, top + 0.12, p6[2]], kSeat = [X, top + DH + 0.12, zD + 1.25];
        tr.push(T.move(whl, wIn, wUp, tTop, tTop + 0.7), T.move(sil, p6, kUp, tTop + 0.2, tTop + 0.7),
          T.move(whl, wUp, wSeat, tTop + 0.9, tTop + 2.7, 0.4), T.move(sil, kUp, kSeat, tTop + 0.9, tTop + 2.7, 0.4),
          { a: tTop + 0.2, b: tTop + 3.6, f: (u) => { whl.rotation.z = u * 3 * 2 * Math.PI; } },
          T.sitFrom(kSeat, tTop + 2.8, tTop + 3.6), T.move(whl, wSeat, wIn, tTop + 3.8, tTop + 5),
          T.rock(dragon, "z", 0.22, 20, tTop, tTop + 3.6), T.spin(dragonGear, tTop, tTop + 3.6, 4));''')
rep('        const tE = tTop + 3, slots = canopy([-0.85, 0, 0.85], sTop + 3.15);', '        const tE = tTop + 3.8, slots = canopy([-0.85, 0, 0.85], sTop + 3.15);')
rep('        SCRIPTS.beitHamidrash = { duration: 65, tracks: tr,',
    '        { const C = CAP.beitHamidrash; if (C.length === 13) { C[9].t = tE; C[10].t = tE + 3; C[11].t = tE + 12; C[12].t = tE + 16; } }   // 1.3.7: the captions keep step\n'
    '        SCRIPTS.beitHamidrash = { duration: tE + 21, tracks: tr,')
# ---- (d) the notes
rep('המסכימים בעיקר המעשה.\\nאסתר רבה: ״וידות מזה ומזה',
    'המסכימים בעיקר המעשה.\\nבמודל: על המעלות גם החיות הרובצות, כלשון אבא גוריון — ״ועל כל מעלה ומעלה היו בו חיות טהורות כנגד טמאות במעלה הראשונה שור וכנגדו ארי שניה טלה [וכנגדו] זאב שלישית גדי [וכנגדו] נמר רביעית צבי [וכנגדו] דוב חמישית נשר [וכנגדו] יונה ששית נץ [וכנגדו] צפור והוא עולה ונותן שלום ביניהן״; ובראש המעלות טווס של כסף — ״והיה טווס של כסף טען במגנון למלך ומושיבו על הכסא״ (אבא גוריון). מקום הטווס וגודלו — בחירת מודל.\\nאסתר רבה: ״וידות מזה ומזה')
rep('״ונותנה אותו על ברכיו״ (בית המדרש ב).\\nלתרגום שני:',
    '״ונותנה אותו על ברכיו״ (בית המדרש ב).\\nההושבה על הכסא — בכל מדרש כלשונו: ״והיה טווס של כסף טען במגנון למלך ומושיבו על הכסא״ (אבא גוריון) — במודל טווס הכסף בא תחתיו במעלה השישית, נושא אותו אל המושב ומושיבו; ״תנין של כסף היה טוען גלגל של כסא וכופין למלך שלמה ומושיבין אותו על הכסא״ (בית המדרש ב) — במודל התנין מניע את המנגנון, וגלגל של הכסא עולה תחת רגליו, נושא אותו אל המושב ומושיבו (הגלגל שתחת רגליו ודרכו — בחירת מודל).\\nלתרגום שני:')
io.open(P, 'w', encoding='utf-8').write(s)
print('60-palace.js: patched (the seating in the Esther Rabbah and Beit HaMidrash versions; Abba Gorion pairs)')
