# -*- coding: utf-8 -*-
# 2.0.4 / B1 1.3.7 - THE EAST GATE'S STEPS IN TWO READINGS, THE RAMBAM'S THE DEFAULT (the user, 11.11.2026 17:11: "מעלות שתי קריאות
# רמבם ברירת מחדל"; 17:13: "בבית ראשון, תעשה גם שתי שיטות") - as the fifteen steps of the Second Temple model 1.9.5.
# Idempotent by the marker "eStepsRound" in 30-courts.js.
import io

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


c = rd('30-courts.js')
if 'eStepsRound' in c:
    print('30-courts.js: already patched')
else:
    OLD = '''    const eRun = eSteps * STEP;   // 3: the steps' run east of the podium's face
    {
      const rise = (AZ - wcY) / eSteps, XW0 = podL / 2, HZ = 56.5, RR = (HZ * HZ + eRun * eRun) / (2 * eRun);
      for (let k = 1; k <= eSteps; k++) {
        const d = STEP * (eSteps - k), half = Math.sqrt(Math.max(0, RR * RR - (RR - eRun + d) * (RR - eRun + d))), dep = STEP * (eSteps + 1 - k);
        const st = H2.box(g, dep, rise * k, 2 * half, M2.stoneSmooth, XW0 + dep / 2, wcY, 0);   // solid down to the outer court's floor
        st.name = "eastGateStep";
        st.castShadow = st.receiveShadow = true;
      }
    }
'''
    NEW = '''    // 1.3.7, later the same day (the user, 11.11.2026 17:11: "מעלות שתי קריאות רמבם ברירת מחדל"; 17:13: "בבית ראשון, תעשה גם שתי
    // שיטות"): TWO READINGS OF THESE STEPS, as of the Second Temple's fifteen (there 1.9.5). The Rambam's commentary on Middot 2:5
    // (the user's library, book 573, line 25) stands against the Rid's length: "שמעלות עזרת נשים לא היו ארוכים כשאר המעלות כמו שהוא
    // מפורסם היום מצורת המדרגות אלא היתה כל מעלה כמו חצי עגולה עד שתהא כל מעלה חצי גורן כזה ... ולפיכך היתה צורת המעלה כמי שלקח קצת
    // אצטבא ונתן אותה על המעלה עד שמשלים צורת הסולם". ctx.shared.eastSteps (the row "מעלות השער המזרחי — צורתן", 70-ui.js):
    //   "rambam" (THE DEFAULT) - the group eStepsRound: half discs lying one on the other before the gate, the top one 5.5 in radius
    //     (the gate's 10 and half an amah at each side) and each one below it half an amah more - the lowest 8, clear of the king's
    //     pillar (its platform at x 104..108, z 6..10) and of the lesser court's chamber north of the way (as the first build of
    //     1.3.5). The radii - a model choice.
    //   "rid" - the group eStepsWide: the straight steps along the podium's east face (above).
    const eRun = eSteps * STEP;   // 3: the steps' run east of the podium's face
    const eStepsWide = new Group(), eStepsRound = new Group();
    eStepsWide.name = "eStepsWide"; eStepsRound.name = "eStepsRound";
    eStepsWide.visible = false;
    g.add(eStepsWide); g.add(eStepsRound);
    {
      const rise = (AZ - wcY) / eSteps, XW0 = podL / 2, HZ = 56.5, RR = (HZ * HZ + eRun * eRun) / (2 * eRun);
      for (let k = 1; k <= eSteps; k++) {
        const d = STEP * (eSteps - k), half = Math.sqrt(Math.max(0, RR * RR - (RR - eRun + d) * (RR - eRun + d))), dep = STEP * (eSteps + 1 - k);
        const st = H2.box(eStepsWide, dep, rise * k, 2 * half, M2.stoneSmooth, XW0 + dep / 2, wcY, 0);   // solid down to the outer court's floor
        st.name = "eastGateStep";
        st.castShadow = st.receiveShadow = true;
      }
      for (let k = 1; k <= eSteps; k++) {
        const R = CRT_GATE_W / 2 + 0.5 + STEP * (eSteps - k);   // 8 .. 5.5
        const sh = new Shape();   // in the shape's plane: x = the model's x - the podium's face, y = the model's -z
        sh.moveTo(0, -R);
        sh.absarc(0, 0, R, -Math.PI / 2, Math.PI / 2, false);
        sh.lineTo(0, -R);
        const geo = new ExtrudeGeometry(sh, { depth: rise, bevelEnabled: false, curveSegments: 40 });
        geo.rotateX(-Math.PI / 2);   // the extrusion rises: the slab stands on y 0..rise
        const st = new Mesh(geo, M2.stoneSmooth);
        st.position.set(XW0, wcY + (k - 1) * rise, 0);
        st.name = "eastGateStepRound";
        st.castShadow = st.receiveShadow = true;
        eStepsRound.add(st);
      }
    }
    ctx.shared.eastSteps = {
      mode: "rambam", x: podL / 2, y: wcY, run: eRun,
      set(m) { this.mode = m === "rid" ? "rid" : "rambam"; eStepsWide.visible = this.mode === "rid"; eStepsRound.visible = this.mode !== "rid"; return this.mode; }
    };
'''
    c = rep(c, OLD, NEW, 'steps')
    wr('30-courts.js', c)
    print('30-courts.js: patched')

u = rd('70-ui.js')
if 'id: "eastSteps"' in u:
    print('70-ui.js: already patched')
else:
    # ---- the gates' card
    a = u.index('במודל: לפני השער המזרחי **שש מעלות מוקפות כחצי גורן**, לאורך פני החצר')
    b = u.index('המעלות עצמן, מספרן, צורתן ואורכן בבית ראשון — בחירת מודל.",', a)
    b += len('המעלות עצמן, מספרן, צורתן ואורכן בבית ראשון — בחירת מודל.",')
    u = (u[:a] +
         "במודל: לפני השער המזרחי **שש מעלות**. בקצרה — צורתן (בטבלת השיטות, בשורה 'מעלות השער המזרחי — צורתן'), כשתי הקריאות "
         "בחמש עשרה המעלות של בית שני (מדות ב, ה: 'לא היו טרוטות, אלא מקפות כחצי גרן עגלה'): לרמב״ם — המעלות אינן ארוכות; כל מעלה "
         "חצי עיגול, זו על גבי זו, לפני השער (**ברירת המחדל**); ולרי״ד ולרבינו יהונתן — אורך המעלה כרוחב העזרה, מכותל לכותל, ובמודל "
         "כאן לאורך פני החצר. המעלות עצמן, מספרן, צורתן ואורכן בבית ראשון — בחירת מודל.\"," + u[b:])
    u = rep(u, '''["מדות ב, ה", MI(2, 5)], ["המאירי מדות ב, ה", { book: 6033, index: 35 }], ["פסקי הרי״ד סוכה נג.", { book: 7576, index: 355 }]] },''',
            '''["מדות ב, ה", MI(2, 5)], ["פירוש המשניות לרמב״ם מדות ב, ה", { book: 573, index: 25 }], ["פסקי הרי״ד סוכה נג.", { book: 7576, index: 355 }], ["רבינו יהונתן סוכה נא:", { book: 7576, index: 353 }], ["המאירי מדות ב, ה", { book: 6033, index: 35 }]] },''', 'gates refs')
    # ---- the row
    ROW = '''        // 1.3.7 (the user, 11.11.2026 17:11: "מעלות שתי קריאות רמבם ברירת מחדל"; 17:13: "בבית ראשון, תעשה גם שתי שיטות"): the east
        // gate's steps in the two readings of the Second Temple's fifteen - ctx.shared.eastSteps (30-courts.js). Every quote from the
        // user's library, read there on 11.11.2026: Middot 2:5 (book 89, line 16), the Rambam's commentary (573, line 25), the Rid and
        // R. Yehonatan (7576, lines 355, 353), the Meiri (6033, line 35).
        if (ctx.shared.eastSteps) {
          const ES_M = "לשון המשנה על חמש עשרה המעלות של בית שני (מדות ב, ה): 'וחמש עשרה מעלות עולות מתוכה לעזרת ישראל... לא היו טרוטות, אלא מקפות כחצי גרן עגלה'.\\n";
          const esFly = (k) => { const E = ctx.shared.eastSteps, x = E.x, y = E.y; if (k === "rid") fly([x + 52, y + 34, 46], [x + 1, y + 1, 0]); else fly([x + 21, y + 13, 15], [x + 2.5, y + 1.5, 0]); };
          opRow({
            id: "eastSteps", short: "מעלות השער המזרחי", cardFly: true, chips: { rambam: "הרמב״ם: חצאי עיגולים", rid: "הרי״ד: מעלות ארוכות" },
            cap: "מעלות השער המזרחי — צורתן",
            refs: [["מדות ב, ה", MI(2, 5)], ["פירוש המשניות לרמב״ם מדות ב, ה", { book: 573, index: 25 }], ["פסקי הרי״ד סוכה נג.", { book: 7576, index: 355 }], ["רבינו יהונתן סוכה נא:", { book: 7576, index: 353 }], ["המאירי מדות ב, ה", { book: 6033, index: 35 }]],
            options: [
              ["rambam", "הרמב״ם — כל מעלה חצי עיגול, לפני השער", ES_M + "הרמב״ם (פירוש המשניות, מדות ב, ה): 'שמעלות עזרת נשים לא היו ארוכים כשאר המעלות כמו שהוא מפורסם היום מצורת המדרגות אלא היתה כל מעלה כמו חצי עגולה עד שתהא כל מעלה חצי גורן כזה' (הציור שבמקום זה אינו בנוסח שבספרייה), 'ולפיכך היתה צורת המעלה כמי שלקח קצת אצטבא ונתן אותה על המעלה עד שמשלים צורת הסולם וזה אי אפשר לציירו בפשוט אבל יובן בקירוב'.\\nבמודל (**ברירת המחדל**): שש מעלות לפני השער המזרחי של חצר הכהנים — שישה חצאי עיגולים, כל אחד מונח על זה שמתחתיו; העליון הוא הקטן, וכל מעלה שמתחתיו רחבה ממנו בחצי אמה. רדיוס המעלה העליונה חמש אמות ומחצה — רוחב השער וחצי אמה מכל צד — ושל התחתונה שמונה. הדברים נאמרו על מעלות בית שני; המעלות בבית ראשון, מספרן, צורתן ומידותיהן — בחירת מודל."],
              ["rid", "הרי״ד ורבינו יהונתן — מעלות ארוכות", ES_M + "פסקי הרי״ד (סוכה נג.): 'וכל מעלה היתה גבוהה חצי אמה ורחבה חצי אמה כדתנן במידות... ואורך המעלה היה קל\\"ה אמה כרוחב העזרה מכותל לכותל'. רבינו יהונתן מלוניל (סוכה נא:): 'אורך המעלה כרוחב העזרה, ורוחב המעלה חצי אמה ורומה חצי אמה'.\\nהמאירי (מדות ב, ה): 'מוקפות כחצי גורן, שהתחתונה קצרה, והשניה עודפת לה משני קצותיה, וכן שלישית לשניה'.\\nהרי״ד ורבינו יהונתן כתבו את אורך המעלות ולא את צורתן; המאירי כתב את צורתן ולא את אורכן. בקריאה זו הן מצוירות יחד.\\nבמודל: שש מעלות ישרות לאורך פני חצר הכהנים, בין שתי הלשכות המערביות של החצר החיצונה — העליונה מאה ושלוש עשרה אמה. התחתונה היא הקצרה, וכל מעלה שמעליה עודפת עליה משני קצותיה; קצות המעלות על קשת — כחצי גורן. הדברים נאמרו על מעלות בית שני; המעלות בבית ראשון, מספרן, צורתן ואורכן — בחירת מודל."]
            ],
            current: ctx.shared.eastSteps.mode,
            onPick: (k) => { ctx.shared.eastSteps.set(k); },
            fly: esFly
          });
        }
'''
    u = rep(u, '''        // 8. the House of the Forest of Lebanon (I Kings 7:2-6) - ctx.shared.forestHouse (60-palace.js)
''', ROW + '''        // 8. the House of the Forest of Lebanon (I Kings 7:2-6) - ctx.shared.forestHouse (60-palace.js)
''', 'row')
    u = rep(u, '''        "שתי הסנהדראות הקטנות": ["lesserPlace", "sanhedrinRows"],   // 1.3.7''',
            '''        "שתי הסנהדראות הקטנות": ["lesserPlace", "sanhedrinRows"],   // 1.3.7
        "שערי חצר הכהנים": ["eastSteps"],   // 1.3.7: the east gate's steps - two readings''', 'ops_p')
    u = rep(u, '''["lesserPlace", "seaPlacement", "sanhedrinRows", "slaughterLayout",''', '''["lesserPlace", "eastSteps", "seaPlacement", "sanhedrinRows", "slaughterLayout",''', 'want')
    wr('70-ui.js', u)
    print('70-ui.js: patched')
