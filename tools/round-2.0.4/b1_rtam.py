# -*- coding: utf-8 -*-
# 2.0.4 / B1 1.3.7 - R. TAM'S READING (a remark sent on to the user, 11.11.2026 14:33; the user, 15:02: "2. אפשרות ב"):
# a new row of the opinions table - the yesod on the altar's south, and the altar's place (four amot further south).
# Idempotent by the marker "1.3.7 (a remark sent on to the user" in 40-altar.js.
import io, sys

B1 = '/home/claude/beit-rishon/src/'


def rd(n):
    return io.open(B1 + n, encoding='utf-8').read()


def wr(n, s):
    io.open(B1 + n, 'w', encoding='utf-8', newline='\n').write(s)


def rep(s, old, new, name):
    k = s.count(old)
    if k != 1:
        raise SystemExit('PATCH %s: %d matches' % (name, k))
    return s.replace(old, new)


a = rd('40-altar.js')
if 'RTM.sync' in a:
    print('40-altar.js: already patched')
else:
    # 1. the holder
    a = rep(a, '''    const defG = new Group();
    g.add(defG);
''', '''    const defG = new Group();
    g.add(defG);
    // 1.3.7 (a remark sent on to the user, 11.11.2026: "היה ראוי להוסיף בבית ראשון את שיטת ר"ת בזבחים שגם בבית ראשון לא היה יסוד ברוח
    // דרומית, ושמקום המזבח לפי זה היה בצד הדרומי מזרחי של המזבח שהיה בבית שני"; the user: "אפשרות ב" - a row of the table, the yesod AND
    // the altar's place): R. TAM'S READING - Tosafot Zevachim 61b (book 1936, line 654): "וקשה לר"ת דא"כ היה המזבח ד' אמות בחלקו של
    // יהודה דמסתמא בבית ראשון לא היה יסוד לקרן דרומית מזרחית לפי שלא היה בחלקו של טורף... וגרס ר"ת מן הצפון מן המערב". For him the
    // First Temple's yesod ran as the Second's (Middot 3:1 "מהלך על פני כל הצפון ועל פני כל המערב, ואוכל בדרום אמה אחת, ובמזרח אמה
    // אחת"), and since the returnees' four amot were added on the north (not on the south), Solomon's altar stood four amot further
    // SOUTH than under Tosafot's conclusion (the default). RTM holds the pieces that the reading swaps; RTM.sync() shows the right ones
    // (with the air's reading and the small ramps' reading); ctx.shared.altarRTam (at the end of the file) is the switch.
    const RTM = { on: false, south: [], stubs: [], rimS: [], rimStub: [], main: {}, small: {} };
''', 'holder')
    # 2. the default altar's south run + the one amah
    a = rep(a, '''      H2.box(defG, MID, YS, YS, BRD, ACX, F, ZS + YS / 2),                    // south, to the end of the face: x 38.5..60.5, z 11..12
      H2.box(defG, YS, YS, 1, BRD, XE + YS / 2, F, ZN + 0.5)                  // east: one amah at the north-east corner, z -11..-10
    );
''', '''      (RTM.south[0] = H2.box(defG, MID, YS, YS, BRD, ACX, F, ZS + YS / 2)),   // south, to the end of the face: x 38.5..60.5, z 11..12 (hidden in R. Tam's reading)
      H2.box(defG, YS, YS, 1, BRD, XE + YS / 2, F, ZN + 0.5)                  // east: one amah at the north-east corner, z -11..-10
    );
    // 1.3.7 R. Tam's reading: "ואוכל בדרום אמה אחת" - the amah beyond the west run's corner square (as the east one; a model choice)
    { const m = H2.box(defG, YS, YS, YS, BRD, XW + YS / 2, F, ZS + YS / 2); m.visible = false; bandParts.push(m); RTM.stubs.push(m); }
''', 'south-def')
    # 3. R. Tam's ramps of the default altar
    a = rep(a, '''    smallRamps.sovevWest.visible = false;
    for (const [k, m] of Object.entries(smallRamps)) m.name = "smallRamp_" + k;
''', '''    smallRamps.sovevWest.visible = false;
    for (const [k, m] of Object.entries(smallRamps)) m.name = "smallRamp_" + k;
    // 1.3.7 R. TAM'S READING (RTM, above): no yesod under the ramps. The big ramp floats over the sovev only and stands on the floor from
    // the wall's face; R. Chaim's air is then the sovev's amah and a quarter (as in the Second Temple model). The small ramps to the
    // sovev lose the step over the yesod; the one to the yesod runs ASKEW from the big ramp's side to the one amah of yesod in the
    // south-west corner (as the Second Temple model's walk, after the drawings of Tosafot Yom Tov and Tiferet Yisrael). With Tosafot's
    // third ramp the raised half is the one beside the big ramp and the walk to the yesod the outer one - a model choice.
    const RAMP_GAPS_RT = { hair: GAP, tosafot: 0.5, chaim: 1 + 0.25 };
    const mainRampRT = (grp, zf, zw, foot, top) => {
      const out = {};
      for (const k in RAMP_GAPS_RT) {
        const zh = zf + RAMP_GAPS_RT[k];
        const pts = zh >= zw + GAP ? [[zh, 0], [foot, 0], [zh, top(zh)]] : [[zw + GAP, 0], [foot, 0], [zh, top(zh)], [zh, SVH + GAP], [zw + GAP, SVH + GAP]];
        out[k] = prism(ACX - 8, ACX + 8, pts, AS, grp);
        out[k].name = "rampMainRT_" + k;
        out[k].visible = false;
      }
      return out;
    };
    // a small ramp whose head is moved sideways: every point is pushed in x in proportion to its way from zFar (no push) to zNear (dx)
    const askew = (m, zFar, zNear, dx) => {
      const p = m.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + dx * (zFar - p.getZ(i)) / (zFar - zNear));
      p.needsUpdate = true;
      m.geometry.computeVertexNormals();
      m.geometry.computeBoundingBox();
      m.geometry.computeBoundingSphere();
      return m;
    };
    // zs - the south face of the wall below the sovev; brz - where the small ramps leave the big one; xw - that wall's west face
    const smallRT = (grp, zs, brz, xw, tag) => {
      const sov = [[zs + GAP, 0], [brz, 0], [brz, 2], [zs + GAP, SVH]];
      const yes = [[zs + YS + GAP, 0], [brz, 0], [brz, 2], [zs + YS + GAP, YS]];
      const xEnd = xw + YS - SRW / 2;   // the walk's head: its east edge on the east end of the south's one amah
      const o = {
        sovevEast: prism(RX1 - 0.01, RX1 + SRW, sov, AS, grp),
        yesodNear: askew(prism(RX0 - SRW, RX0 + 0.01, yes, AS, grp), brz, zs + YS + GAP, xEnd - (RX0 - SRW / 2)),               // Rashi: the walk leaves the big ramp's side
        sovevWest: prism(RX0 - SRW, RX0 + 0.01, sov, AS, grp),                                                                   // Tosafot: the raised half, beside the big ramp
        yesodFar: askew(prism(RX0 - 2 * SRW, RX0 - SRW + 0.01, yes, AS, grp), brz, zs + YS + GAP, xEnd - (RX0 - 1.5 * SRW))     // and the walk to the yesod outside it
      };
      for (const k in o) { o[k].visible = false; o[k].name = "smallRampRT_" + tag + "_" + k; }
      return o;
    };
    RTM.main.def = mainRampRT(rampDefG, ACZ + S / 2, ZS, 42, RTOP);
    RTM.small.def = smallRT(rampDefG, ZS, BRZ, XW, "def");
''', 'ramps-def')
    # 4. R. Yose's altar: the south run, the one amah, the ramps
    a = rep(a, '''        H2.box(yoseG, YM, YS, YS, BRD, ACX, F, YZS + YS / 2),
        H2.box(yoseG, YS, YS, 1, BRD, YXE + YS / 2, F, YZN + 0.5)
      );
''', '''        (RTM.south[1] = H2.box(yoseG, YM, YS, YS, BRD, ACX, F, YZS + YS / 2)),
        H2.box(yoseG, YS, YS, 1, BRD, YXE + YS / 2, F, YZN + 0.5)
      );
      { const m = H2.box(yoseG, YS, YS, YS, BRD, YXW + YS / 2, F, YZS + YS / 2); m.visible = false; bandParts.push(m); RTM.stubs.push(m); }   // 1.3.7: R. Tam's reading
''', 'south-yose')
    a = rep(a, '''      smallRamps.yoseSovevWest = prism(RX0 - 2 * SRW, RX0 - SRW + 0.01, ySov, AS, rampYoseG);
      smallRamps.yoseSovevWest.visible = false;
    }
''', '''      smallRamps.yoseSovevWest = prism(RX0 - 2 * SRW, RX0 - SRW + 0.01, ySov, AS, rampYoseG);
      smallRamps.yoseSovevWest.visible = false;
      RTM.main.yose = mainRampRT(rampYoseG, ACZ + YT / 2, YZS, 44, YRT);   // 1.3.7: R. Tam's reading in R. Yose's altar
      RTM.small.yose = smallRT(rampYoseG, YZS, YBRZ, YXW, "yose");
    }
    // 1.3.7: what is seen of the yesod's south and of the ramps - by R. Tam's reading (RTM.on), the air's (rampGap) and the small ramps'
    RTM.sync = () => {
      const rt = RTM.on;
      const gm = (ctx.shared.rampGap && ctx.shared.rampGap.mode) || "hair";
      const third = !!(ctx.shared.altarRamps && ctx.shared.altarRamps.current === "tosafot");
      for (const r of [rampMain.def, rampMain.yose]) if (r) for (const k in r) r[k].visible = !rt && k === gm;
      for (const r of [RTM.main.def, RTM.main.yose]) if (r) for (const k in r) r[k].visible = rt && k === gm;
      smallRamps.sovevEast.visible = smallRamps.yesod.visible = !rt;
      smallRamps.sovevWest.visible = !rt && third;
      if (smallRamps.yoseSovevEast) {
        smallRamps.yoseSovevEast.visible = smallRamps.yoseYesod.visible = !rt;
        smallRamps.yoseSovevWest.visible = !rt && third;
      }
      for (const k of ["def", "yose"]) {
        const s = RTM.small[k];
        if (!s) continue;
        s.sovevEast.visible = rt;
        s.yesodNear.visible = rt && !third;
        s.sovevWest.visible = s.yesodFar.visible = rt && third;
      }
      for (const m of RTM.south) if (m) m.visible = !rt;
      for (const m of RTM.rimS) m.visible = !rt;
      for (const m of RTM.stubs) m.visible = rt;
      for (const m of RTM.rimStub) m.visible = rt;
    };
''', 'ramps-yose')
    # 5. the yesod's rim
    a = rep(a, '''        const rim = (w, d, x, z) => bandParts.push(H2.box(grp, w, RIM, d, BRD, x, yr, z));
        rim(xe - xw + 2 * YS, RT, (xw + xe) / 2, zn - YS + RT / 2);                              // the north edge, corner to corner
        rim(RT, zs - zn + 2 * YS - 2 * RT, xw - YS + RT / 2, (zn + zs) / 2);                     // the west edge
        rim(RX0 - 2 * SRW - (xw - YS), RT, (xw - YS + RX0 - 2 * SRW) / 2, zs + YS - RT / 2);     // the south edge, west of the ramps
        rim(xe - (RX1 + SRW), RT, (RX1 + SRW + xe) / 2, zs + YS - RT / 2);                       // the south edge, east of the ramps
        rim(RT, YS - RT, xe - RT / 2, zs + (YS - RT) / 2);                                       // the south run's east end
''', '''        const rim = (w, d, x, z) => { const m = H2.box(grp, w, RIM, d, BRD, x, yr, z); bandParts.push(m); return m; };
        rim(xe - xw + 2 * YS, RT, (xw + xe) / 2, zn - YS + RT / 2);                              // the north edge, corner to corner
        rim(RT, zs - zn + 2 * YS - 2 * RT, xw - YS + RT / 2, (zn + zs) / 2);                     // the west edge
        RTM.rimS.push(                                                                           // 1.3.7: hidden in R. Tam's reading
          rim(RX0 - 2 * SRW - (xw - YS), RT, (xw - YS + RX0 - 2 * SRW) / 2, zs + YS - RT / 2),   // the south edge, west of the ramps
          rim(xe - (RX1 + SRW), RT, (RX1 + SRW + xe) / 2, zs + YS - RT / 2),                     // the south edge, east of the ramps
          rim(RT, YS - RT, xe - RT / 2, zs + (YS - RT) / 2)                                      // the south run's east end
        );
        // 1.3.7 R. Tam's reading: the rim on the south edge of the corner square (up to where the walk to the yesod comes) and on the
        // east end of the south's one amah
        for (const m of [rim(YS - (SRW - YS), RT, xw - YS + (YS - (SRW - YS)) / 2, zs + YS - RT / 2), rim(RT, YS, xw + YS - RT / 2, zs + YS / 2)]) { m.visible = false; RTM.rimStub.push(m); }
''', 'rim')
    # 6. the air's switch
    a = rep(a, '''          for (const r of [rampMain.def, rampMain.yose]) if (r) for (const k in r) r[k].visible = k === this.mode;
          const d = RAMP_GAPS[this.mode] - RAMP_GAPS.hair;
''', '''          RTM.sync();   // 1.3.7: the prism of the air's reading AND of the yesod's reading (R. Tam, above)
          const d = (RTM.on ? RAMP_GAPS_RT : RAMP_GAPS)[this.mode] - RAMP_GAPS.hair;
''', 'gap')
    # 7. the small ramps' switch
    a = rep(a, '''          smallRamps.sovevWest.visible = key === "tosafot";
          if (smallRamps.yoseSovevWest) smallRamps.yoseSovevWest.visible = key === "tosafot";
          cur = key;
          return cur;
''', '''          cur = key;
          RTM.sync();   // 1.3.7: the western ramp to the sovev, in the yesod's reading that is on (R. Tam's ramps too)
          return cur;
''', 'small-switch')
    # 8. the place: the extra four amot + the fly point + the switch
    a = rep(a, '''      const FPK = ["mizbeach", "mizbeachSW", "mizbeachRamps", "shitin", "mizbeachTop", "mizbeachMeasures", "sfalim", "leviim", "rampGap"];   // 1.3.3: the measures' view too
''', '''      // 1.3.7: R. Tam's row - from the north-east, above (checked in renders, both readings): the north face against the house's axis
      // (drawn for 15 s by the row - the four amot show as the strip between the line and the altar), the east face, and the foot
      // of the south-east corner, where the south yesod ends or is not
      ctx.shared.flyPoints.mizbeachSE = { pos: [ACX + 37, F + 24, ACZ - 12], target: [ACX + 5, F + 1, ACZ + 2] };
      const FPK = ["mizbeach", "mizbeachSW", "mizbeachSE", "mizbeachRamps", "shitin", "mizbeachTop", "mizbeachMeasures", "sfalim", "leviim", "rampGap"];   // 1.3.3: the measures' view too
''', 'fpk')
    a = rep(a, '''          const dz = this.dz[key];
          g.position.z = dz;
''', '''          const dz = this.dz[key] + (this.extra || 0);   // 1.3.7: R. Tam's reading - four amot further south (ctx.shared.altarRTam, below)
          g.position.z = dz;
''', 'place-dz')
    a = rep(a, '''      ctx.shared.altarPlace = PLACE;
      PLACE.set("south");   // the user: the default - in the south, as the Rambam rules
''', '''      ctx.shared.altarPlace = PLACE;
      PLACE.set("south");   // the user: the default - in the south, as the Rambam rules
      // 1.3.7: R. TAM'S READING OF THE YESOD AND OF THE ALTAR'S PLACE (RTM, above) - the row "יסוד המזבח בדרום — ומקום המזבח" (70-ui.js)
      ctx.shared.altarRTam = {
        current: "tosafot", keys: ["tosafot", "rtam"],
        get() { return this.current; },
        set(k) {
          if (k !== "tosafot" && k !== "rtam") return this.current;
          this.current = k;
          RTM.on = k === "rtam";
          PLACE.extra = RTM.on ? 4 : 0;
          if (ctx.shared.rampGap) ctx.shared.rampGap.set(ctx.shared.rampGap.mode); else RTM.sync();
          PLACE.set(PLACE.current);
          return this.current;
        }
      };
''', 'switch')
    # 9. the yesod's card: the dispute, briefly
    a = rep(a, '''שהיה בלא יסוד' (תוספות זבחים סא:).\\nרש״י, על מזבח משה:''', '''שהיה בלא יסוד' (תוספות זבחים סא:). בקצרה — רבינו תם (שם): 'דמסתמא בבית ראשון לא היה יסוד לקרן דרומית מזרחית', כבבית שני; ראו בטבלת השיטות, בשורה ״יסוד המזבח בדרום — ומקום המזבח״.\\nרש״י, על מזבח משה:''', 'card')
    wr('40-altar.js', a)
    print('40-altar.js: patched')

v = rd('45-vessels.js')
if '(ap.extra || 0)' in v:
    print('45-vessels.js: already patched')
else:
    v = rep(v, '''return ap && ap.dz && ap.current in ap.dz ? ap.dz[ap.current] : 0; };''',
            '''return ap && ap.dz && ap.current in ap.dz ? ap.dz[ap.current] + (ap.extra || 0) : 0; };   // 1.3.7: + R. Tam's four amot''', 'vessels')
    wr('45-vessels.js', v)
    print('45-vessels.js: patched')

u = rd('70-ui.js')
if 'id: "altarRTam"' in u:
    print('70-ui.js: already patched')
else:
    ROW = '''        // 1.3.7 (a remark sent on to the user, 11.11.2026; the user: "2. אפשרות ב"): R. TAM'S READING - the yesod on the altar's south and
        // the altar's place - ctx.shared.altarRTam (40-altar.js). Every quote is from the user's library (Zevachim 53b: book 130, line
        // 1865; Middot 3:1: book 89, line 19; Tosafot Zevachim 61b: book 1936, line 654, the whole dibur).
        {
          const rt = ctx.shared.altarRTam;
          if (rt && typeof rt.set === "function") {
            const RT_LEAD = "בגמרא (זבחים נג:): ״וקרן מזרחית דרומית לא היה לה יסוד. מאי טעמא? אמר רבי אלעזר: לפי שלא היתה בחלקו של טורף״. ובמשנה (מדות ג, א), על מזבח בית שני: ״וכשעלו בני הגולה, הוסיפו עליו ארבע אמות מן הדרום וארבע אמות מן המערב, כמין גמא״; ״והיסוד היה מהלך על פני כל הצפון ועל פני כל המערב, ואוכל בדרום אמה אחת, ובמזרח אמה אחת״.\\nהשאלה: כיצד היה היסוד בדרומו של מזבח בית ראשון, והיכן עמד המזבח ביחס למזבח בית שני.";
            opRow({
              id: "altarRTam", short: "היסוד בדרום", cardFly: true, chips: { tosafot: "תוספות: יסוד בדרום", rtam: "רבינו תם: בלי יסוד בדרום" },
              cap: "יסוד המזבח בדרום — ומקום המזבח",
              refs: [["זבחים נג:", { book: 130, index: 1865 }], ["מדות ג, א", { book: 89, index: 19 }], ["זבחים סא:", { book: 130, index: 2096 }], ["תוספות זבחים סא:", { book: 1936, index: 654 }], ["רש״י זבחים סא:", { book: 2191, index: 2952 }]],
              options: [
                ["tosafot", "מסקנת התוספות — יסוד גם בדרום", RT_LEAD + "\\nהתוספות (זבחים סא:), במסקנתם, כגירסת הספרים ״דרום ומערב״: ״ובבית ראשון היה להם יסוד לדרום שהיה משוך בחלקו של טורף חוץ מרוח מזרחית שלא נשתנה שהיה בלא יסוד (עד) חלקו של יהודה כמו בבית שני״.\\nבמודל (ברירת המחדל): **היסוד מהלך בצפון, במערב ובדרום**; במזרח — אמה אחת בלבד, בקרן הצפונית־מזרחית.", null],
                ["rtam", "רבינו תם — בלי יסוד בדרום, והמזבח ארבע אמות לדרום", RT_LEAD + "\\nרבינו תם, בתוספות (זבחים סא:): ״וקשה לר״ת דא״כ היה המזבח ד׳ אמות בחלקו של יהודה דמסתמא בבית ראשון לא היה יסוד לקרן דרומית מזרחית לפי שלא היה בחלקו של טורף... ואם בבית שני הוסיפו בדרום א״כ בנו בחלקו של יהודה וגרס ר״ת מן הצפון מן המערב״.\\nלגירסתו נוספו ארבע האמות בצפון ובמערב, ולא בדרום. התוספות מקשים על גירסה זו — מן השיתין שבדרום, ומן הלול שבמערבו של כבש — ומסיקים כגירסת הספרים.\\nבמודל: **היסוד בצפון ובמערב, ״ואוכל בדרום אמה אחת, ובמזרח אמה אחת״**, כבבית שני; **המזבח כולו, עם הכבש, ארבע אמות לדרום** ממקומו שבברירת המחדל (שלגירסתו נוספו ארבע האמות בצפונו); הכבש הקטן שליסוד יורד אל אמת היסוד שבקרן המערבית־דרומית, והכבש הגדול אינו פורח על יסוד. מקום האמה שבדרום ומהלך הכבש הקטן — בחירת מודל.", null]
              ],
              current: rt.current || "tosafot",
              onPick: (k) => { rt.set(k); },
              fly: () => {   // the house's axis drawn for 15 s, as the row "מקום המזבח": the altar's north face against it
                flyView("mizbeachSE");
                const ax = ctx.shared.altarAxis;
                if (ax) {
                  ax.set(true);
                  clearTimeout(ax.tmr);
                  ax.tmr = setTimeout(() => ax.set(false), 15000);
                }
              }
            });
          }
        }
'''
    u = rep(u, '''        // 1.3.0 (the opinions table, as in the Second Temple model 1.8.0): the number of pyres on the altar - ctx.shared.maarachot
''', ROW + '''        // 1.3.0 (the opinions table, as in the Second Temple model 1.8.0): the number of pyres on the altar - ctx.shared.maarachot
''', 'row')
    u = rep(u, '''        mizbeach: ["altarPlace", "altarYose", "altarLook", "altarRamps", "maarachot", "maarachotYK"], mizbeachTop:''',
            '''        mizbeach: ["altarPlace", "altarRTam", "altarYose", "altarLook", "altarRamps", "maarachot", "maarachotYK"], mizbeachSE: ["altarRTam", "altarPlace"], mizbeachTop:''', 'ops-v1')
    u = rep(u, '''mizbeachSW: ["altarPlace", "altarRamps"], mizbeachRamps: ["altarPlace", "altarRamps", "rampGap"]''',
            '''mizbeachSW: ["altarPlace", "altarRTam", "altarRamps"], mizbeachRamps: ["altarPlace", "altarRTam", "altarRamps", "rampGap"]''', 'ops-v2')
    u = rep(u, '''        [/^מזבח הנחושת/, ["altarPlace", "altarYose", "altarLook", "altarRamps", "maarachot", "maarachotYK"]],''',
            '''        [/^מזבח הנחושת/, ["altarPlace", "altarRTam", "altarYose", "altarLook", "altarRamps", "maarachot", "maarachotYK"]],
        [/^היסוד/, ["altarRTam"]],   // 1.3.7: R. Tam's reading on the yesod's own label''', 'ops-l')
    u = rep(u, '''"slaughterLayout", "altarPlace", "altarYose",''', '''"slaughterLayout", "altarPlace", "altarRTam", "altarYose",''', 'want')
    wr('70-ui.js', u)
    print('70-ui.js: patched')
