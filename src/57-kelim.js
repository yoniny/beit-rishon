  // First Temple - 57-kelim.js: the vessels at the end of I Kings 7 as one exhibit (1.0.1-L, L.88; the user: "תוסיף כפתור להצגת כלים
  // (סירות סיפות מזמרות - כל מה שבסוף פרק ז) ותכניס למצגת").
  // I Kings 7:40, 7:45 (bronze), 7:48-50 (gold); II Chr 4:11, 4:16, 4:19-22. The golden altar, the tables and the menorot are built in their
  // places (55-interior.js): the exhibit does not repeat them, shared.kelim.existing points to their fly points.
  // Hidden by default: it opens only from its on-model pill (id "kelim") or from the UI through ctx.shared.kelim.set(v).
  // Contract: ctx.shared.kelim = { on, set(v), items: [{ key, name, label, verse, text, refs, shape, anchor, fly }], title, info, refs, existing },
  //   ctx.layers.kelim (the group; labels carry layer "kelim" and kelimKey), ctx.shared.flyPoints.kelim, ctx.shared.modelButtons += "kelim".
  // Every quote is kept with its book and line (KEL_ITEMS q: [who, words, [book, line]]); text and refs are composed from it, so a quote and
  // its link cannot part. Words are the DB's letter for letter; "..." marks an omission.
  // Shapes: "כציור הספר" = the book's pages מ (bronze), מג (the tweezers, the lamps) and מד (gold) - a model choice, the book is not a source;
  // the book itself says of its musical instruments and keys that they are for illustration only. Others: "בחירת מודל".
  // Place: the great court, north of the inner court and west of its north gates (x -81..-39, z -128..-108): free ground (scene scan of 1.11.2026),
  // on no path between the gates. Standing here, and the enlarged size, are a model choice: no source gives their place or size in the exhibit.

  // ----- the sources -----
  var KEL_V = { m: ["מלכים א ז, מ", ["V", 10, 7, 40]], mh: ["מלכים א ז, מה", ["V", 10, 7, 45]], mt: ["מלכים א ז, מט", ["V", 10, 7, 49]], n: ["מלכים א ז, נ", ["V", 10, 7, 50]],
    dya: ["דברי הימים ב ד, יא", ["V", 39, 4, 11]], dtz: ["דברי הימים ב ד, טז", ["V", 39, 4, 16]], dka: ["דברי הימים ב ד, כא", ["V", 39, 4, 21]], dkb: ["דברי הימים ב ד, כב", ["V", 39, 4, 22]] };
  var KEL_ITEMS = [
    // ---- bronze (front row, from the viewer's right) ----
    { key: "sirot", row: 0, name: "הסירות (הכירות)", label: "הסירות (ז, מ; ז, מה)", verse: "מלכים א ז, מ; ז, מה; דברי הימים ב ד, יא; ד, טז", v: ["m", "mh", "dya", "dtz"], metal: "נחושת",
      q: [["רש״י ז, מ", "הכירות הן הן סירות, כמה דאת אמר: ככיור אש בעצים; וכן: והכה בכיור", [3673, 448]],
        ["רש״י ז, מ", "הכירות. של נחשת, לדשן את המזבח", [3673, 449]],
        ["רש״י שמות כז, ג", "סירתיו. כמין יורות", [3692, 1902]],
        ["מצודת ציון ז, מ", "הכירות. הסירות, כמו (שמואל א ב יד) והכה בכיור", [3449, 281]],
        ["רלב״ג ז, מ", "והנה אלו הסירות היו משמשות לשום בהם דשן המזבח", [3645, 296]],
        ["מלבי״ם ז, מ", "שהיו עשוים לדשן את האפר ככירה, מלשון ככיור אש בעצים", [3394, 408]]],
      shape: "צורת הסיר והשלשלאות כציור הספר (בחירת מודל)." },
    { key: "yaim", row: 0, name: "היעים", label: "היעים (ז, מ; ז, מה)", verse: "מלכים א ז, מ; ז, מה; דברי הימים ב ד, יא; ד, טז", v: ["m", "mh", "dya", "dtz"], metal: "נחושת",
      q: [["רש״י ז, מ", "מגרפות של נחשת... לחתות בהן דשן בתוך הסירות", [3673, 450]],
        ["רש״י שמות כז, ג", "מגרפות שנוטלים בהם הדשן, והן כמין כסוי הקדרה של מתכת דק ולו בית יד", [3692, 1904]],
        ["מצודת ציון ז, מ", "היעים. המכבדות, לגרף בהם הדשן", [3449, 282]],
        ["רלב״ג ז, מה", "הם מגרפו' של נחושת לדשן בהם המזבח", [3645, 298]]],
      shape: "הצורה כציור הספר (בחירת מודל)." },
    { key: "mizrakotN", row: 0, name: "המזרקות של נחושת", label: "המזרקות (ז, מ; ז, מה)", verse: "מלכים א ז, מ; ז, מה; דברי הימים ב ד, יא", v: ["m", "mh", "dya"], metal: "נחושת",
      q: [["רש״י שמות כז, ג", "ומזרקתיו. לקבל בהם דם הזבחים", [3692, 1905]],
        ["מצודת ציון ז, מ", "המזרקות. הספלים המקבלים בו הדם לזריקה", [3449, 283]],
        ["רלב״ג ז, מה", "הם כלים יקבלו בהם הדם להזות על המזבח", [3645, 299]]],
      shape: "הצורה כציור הספר (בחירת מודל)." },
    { key: "mazlegot", row: 0, name: "המזלגות", label: "המזלגות (דה״ב ד, טז)", verse: "דברי הימים ב ד, טז", v: ["dtz"], metal: "נחושת",
      q: [["רש״י דה״ב ד, טז", "וגם מודיענו מזלגות שלא הזכר למעלה", [3662, 155]],
        ["רש״י שמות כז, ג", "כמין אנקליות כפופים, ומכה בהם בבשר ונתחבים בו ומהפך בהן על גחלי המערכה שיהא ממהר שרפתן", [3692, 1906]]],
      shape: "במודל: הספר אינו מצייר כלי זה. הצורה בחירת מודל, על פי לשון רש״י 'כמין אנקליות כפופים'." },
    // ---- gold, 7:49 and the instruments of 7:50 (middle row) ----
    { key: "perach", row: 1, name: "הפרח", label: "הפרח (ז, מט)", verse: "מלכים א ז, מט; דברי הימים ב ד, כא", v: ["mt", "dka"], metal: "זהב",
      q: [["רש״י ז, מט", "והפרח. של מנורה", [3673, 460]],
        ["רש״י דה״ב ד, כא", "פרשו רבותינו (מנחות כח:) הוא כנגד אותו פרח שהוסיף משה בפרשת בהעלתך", [3662, 163]],
        ["רד״ק ז, מט", "פרחי המנורה כמו שכתוב במנורת משה כפתור ופרח", [3540, 520]],
        ["מצודת ציון ז, מט", "קבוצת פרחי המנורה", [3449, 294]],
        ["רלב״ג ז, מט", "שעד פרחה שהיה בסוף ירכה ועד הנרות שהיו בקצה המנורה השני הכל הי' זהב", [3645, 312]],
        ["מלבי״ם ז, מט", "והפרח של המנורה, מפני שהדין הוא שאם המנורה אינה באה זהב א\"צ גביעים כפתורים ופרחים", [3394, 422]]],
      shape: "הפרח והכפתור שתחתיו כציור המנורה בספר (בחירת מודל)." },
    { key: "nerot", row: 1, name: "הנרות", label: "הנרת (ז, מט)", verse: "מלכים א ז, מט; דברי הימים ב ד, כא", v: ["mt", "dka"], metal: "זהב",
      q: [["רש״י ז, מט", "והנרת. בזיכין שנותנין בהן השמן והפתילה", [3673, 461]],
        ["רש״י דה״ב ד, כ", "מכלל שלא היו הנרות אדוקין", [3662, 161]],
        ["רד״ק ז, מט", "וכן הנרות שבעה בכל מנורה כמו במנורת משה", [3540, 520]],
        ["מצודת ציון ז, מט", "עשוים כעין בזיכין, ובהם משימין השמן והפתילות", [3449, 295]]],
      shape: "במודל: הקערה כציור המנורה בספר (בחירת מודל); השמן והפתילה — כלשון רש״י." },
    { key: "melkachayim", row: 1, name: "המלקחים", label: "המלקחים (ז, מט)", verse: "מלכים א ז, מט; דברי הימים ב ד, כא", v: ["mt", "dka"], metal: "זהב",
      q: [["רש״י ז, מט", "והמלקחים. שמרימים בהן את הפתילה מתוך השמן", [3673, 462]],
        ["רש״י דה״ב ד, כא", "והמלקחים זהב. שמגביהים הפתילה מן הנר שיש בו השמן", [3662, 164]],
        ["מצודת ציון ז, מט", "הצבתים ילקחו בהם הפתילות למושכם ולהניחם על מקום הראוי", [3449, 296]],
        ["רלב״ג ז, מט", "וכן המלקחים היו זהב כמו שהוגבל בתורה", [3645, 312]]],
      shape: "הצורה כציור הספר (בחירת מודל)." },
    { key: "sefotZemer", row: 1, name: "הספות — לרש״י כלי זמר", label: "הספות לרש״י (ז, נ)", verse: "מלכים א ז, נ", v: ["n"], metal: "זהב",
      q: [["רש״י ז, נ", "והספות. כלי של מיני זמר הוא, וכן מזמרות", [3673, 464]],
        ["רלב״ג ז, נ", "ואפשר שיהיו גם כן הספות מינים אחרים מכלי זמר", [3645, 316]]],
      shape: "הפסוק אינו מפרש איזה כלי זמר. בדברי הימים ב ד, כב לא נזכרו הספות.\nבמודל: הצורה כציור הספר (בחירת מודל), להמחשה בלבד." },
    { key: "sefotKad", row: 1, name: "הספות — לרד״ק כעין כדים", label: "הספות לרד״ק (ז, נ)", verse: "מלכים א ז, נ", v: ["n"], metal: "זהב",
      q: [["רד״ק ז, נ", "ואפשר שהם הנקראים בדברי רז\"ל קיתון קיתונות", [3540, 522]],
        ["מצודת ציון ז, נ", "כלים כעין כדים, כי תרגם יונתן: קולין", [3449, 298]],
        ["רלב״ג ז, נ", "הם בדמיון כדים העשויים לשום בהם יין", [3645, 315]]],
      shape: "הספר אינו מצייר פירוש זה: צורת הכד בחירת מודל." },
    { key: "mizmerot", row: 1, name: "המזמרות", label: "המזמרות (ז, נ)", verse: "מלכים א ז, נ; דברי הימים ב ד, כב", v: ["n", "dkb"], metal: "זהב",
      q: [["רש״י ז, נ", "כלי של מיני זמר הוא, וכן מזמרות", [3673, 464]],
        ["רד״ק ז, נ", "והמזמרות. כלי שמזמרים בהם", [3540, 523]],
        ["מצודת ציון ז, נ", "והמזמרות. כלי זמר", [3449, 299]],
        ["רלב״ג ז, נ", "הם כלי זמר עשוים מזהב", [3645, 316]],
        ["מלבי״ם דה״ב ד, כב", "והמזמרות. כלי זמר", [3364, 124]],
        ["ערכין י:", "מגריפה היתה במקדש", [134, 340]],
        ["ערכין יא.", "עשרה נקבים היו בה, כל אחד ואחד מוציא עשרה מיני זמר", [134, 342]],
        ["ערכין יא.", "היא אמה וגבוה אמה, וקתא יוצא הימנה", [134, 342]],
        ["רש״י ערכין יא.", "ובכל נקב היה קנה אחד ובכל קנה וקנה היו בו י' נקבים", [2190, 390]]],
      shape: "במודל: **המגריפה**, כלי שיר שהיה במקדש, כציור הספר (בחירת מודל). הספר מצייר אותה כדוגמה לכלי שיר, ולא כפירוש המילה 'מזמרות' דווקא. עשרה קנים, ובכל קנה עשרה נקבים — כלשון רש״י בערכין." },
    // ---- gold, the rest of 7:50 (back row) ----
    { key: "mizrakotZ", row: 2, name: "המזרקות של זהב", label: "המזרקות (ז, נ)", verse: "מלכים א ז, נ; דברי הימים ב ד, כב", v: ["n", "dkb"], metal: "זהב",
      q: [["רש״י ז, נ", "והמזרקות. לקבל דם", [3673, 465]],
        ["רש״י דה״ב ד, כב", "והמזרקות. לזרוק בהם דם על המזבח", [3662, 168]],
        ["רלב״ג ז, נ", "הם לקבל הדם ואחשוב שהיו משמשים לדם קדשים אשר יובא אל הקדש פנימה", [3645, 317]]],
      shape: "הצורה כציור הספר (בחירת מודל)." },
    { key: "kapot", row: 2, name: "הכפות", label: "הכפות (ז, נ)", verse: "מלכים א ז, נ; דברי הימים ב ד, כב", v: ["n", "dkb"], metal: "זהב",
      q: [["רש״י ז, נ", "והכפות. לבזיכי לבונה", [3673, 466]],
        ["מצודת ציון ז, נ", "והכפות. הבזיכין שבהם הלבונה", [3449, 300]],
        ["רלב״ג ז, נ", "הם לשום בהם מלא קומץ לבונה להקטיר", [3645, 318]]],
      shape: "הספר אינו מצייר כלי זה: הצורה בחירת מודל; בתוכה לבונה." },
    { key: "machtot", row: 2, name: "המחתות", label: "המחתות (ז, נ)", verse: "מלכים א ז, נ; דברי הימים ב ד, כב", v: ["n", "dkb"], metal: "זהב",
      q: [["רש״י ז, נ", "לחתות בהן תרומת הדשן וגחלים להוליך ממזבח החיצון למזבח הפנימי להקטיר קטרת", [3673, 467]],
        ["רש״י שמות כז, ג", "בית קבול יש להם לטל בהן גחלים מן המזבח", [3692, 1907]],
        ["מצודת ציון ז, נ", "כלים לחתות בהם האש על הקטורת", [3449, 301]],
        ["רלב״ג ז, נ", "הם לחתות בהם גחלים להוליך ממזבח החיצון למזבח הזהב", [3645, 319]]],
      shape: "הצורה כציור הספר (בחירת מודל)." },
    { key: "petotKey", row: 2, name: "הפתות — לרש״י מפתחות", label: "הפתות לרש״י (ז, נ)", verse: "מלכים א ז, נ; דברי הימים ב ד, כב", v: ["n", "dkb"], metal: "זהב",
      q: [["רש״י ז, נ", "והפתות. מפתחות, שמעתי. שמפתחין בהם את המנעול", [3673, 468]],
        ["מצודת דוד ז, נ", "זהב. מוסב על הפותות, שהם היו מזהב", [3345, 693]]],
      shape: "צורת המפתח כציור הספר (בחירת מודל), להמחשה בלבד." },
    { key: "petotTzir", row: 2, name: "הפותות — לרד״ק צירי הדלתות", label: "הפותות לרד״ק (ז, נ)", verse: "מלכים א ז, נ", v: ["n"], metal: "זהב",
      q: [["רד״ק ז, נ", "תרגום יונתן ומוגלסיא והם צירי הדלתות", [3540, 524]],
        ["מצודת ציון ז, נ", "הם העשויות להציב בהן צירי הדלתות, לסבב אילך ואילך, ובמשנה (כלים פרק יא משנה ב) והפותה שתחת הציר", [3449, 302]],
        ["רלב״ג ז, נ", "מה שיכנס ציר הדלת בו שהוא מחובר לדלת, הנה זה היה בדביר ובהיכל מזהב", [3645, 320]],
        ["מלבי״ם ז, נ", "והפותות י\"מ צירי הדלתות שכ\"ה בלשון המשנה", [3394, 424]]],
      shape: "במודל: הספר אינו מצייר פירוש זה. הצורה בחירת מודל — בית הציר בסף, והציר מורם ממנו כדי שייראה." }
  ];
  var KEL_INFO_Q = [
    ["רד״ק ז, מה", "כעין אותם הכלים שהיו באהל מועד כן עשה חירם למלך שלמה בבית המקדש", [3540, 508]],
    ["רד״ק ז, מה", "ממורט. זך ונקי מכל חלודה ומכל סיג", [3540, 509]],
    ["רלב״ג ז, מט", "זהב סגור. ר\"ל נקי ומזוקק", [3645, 313]]
  ];
  // the words of a quote joined for the screen; the same words are checked against the DB by the report's script
  function kel_quotes(q) {
    return q.map((e) => "'" + e[1] + "' (" + e[0] + ")").join("; ");
  }
  function kel_refs(q, vkeys) {
    const out = [], seen = {};
    for (const k of vkeys || []) out.push(KEL_V[k]);
    for (const e of q) {
      const id = e[2][0] + ":" + e[2][1];
      if (seen[id]) continue;
      seen[id] = true;
      out.push([e[0], ["L", e[2][0], e[2][1]]]);
    }
    return out;
  }

  // ----- small shapes -----
  function kel_lathe(parent, pts, mat, seg) {
    const m = new Mesh(new LatheGeometry(pts.map((p) => new Vector2(p[0], p[1])), seg || 48), mat);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  // a round rod between two points
  function kel_rod(parent, a, b, r, mat, r2) {
    const A = new Vector3(a[0], a[1], a[2]), B = new Vector3(b[0], b[1], b[2]);
    const m = new Mesh(new CylinderGeometry(r2 == null ? r : r2, r, A.distanceTo(B), 12), mat);
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), B.clone().sub(A).normalize());
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  function kel_tube(parent, pts, r, mat, seg) {
    const c = new CatmullRomCurve3(pts.map((p) => new Vector3(p[0], p[1], p[2])));
    const m = new Mesh(new TubeGeometry(c, seg || 24, r, 8, false), mat);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  function kel_ball(parent, r, mat, x, y, z, sx, sy, sz) {
    const m = new Mesh(new SphereGeometry(r, 18, 12), mat);
    m.position.set(x, y, z);
    m.scale.set(sx || 1, sy || 1, sz || 1);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  // a chain of links along a polyline, one merged mesh (the book's סיר p. מ)
  function kel_chain(parent, pts, mat) {
    const link = new TorusGeometry(0.115, 0.03, 6, 12);
    link.scale(1.45, 1, 1);
    const curve = new CatmullRomCurve3(pts.map((p) => new Vector3(p[0], p[1], p[2])));
    const n = Math.max(4, Math.round(curve.getLength() / 0.235));
    const geos = [], m4 = new Matrix4(), q = new Quaternion(), q2 = new Quaternion(), X = new Vector3(1, 0, 0), s = new Vector3(1, 1, 1);
    for (let i = 0; i <= n; i++) {
      const u = i / n, p = curve.getPointAt(u), t = curve.getTangentAt(u);
      q.setFromUnitVectors(X, t);
      q2.setFromAxisAngle(X, i % 2 ? Math.PI / 2 : 0);
      q.multiply(q2);
      m4.compose(p, q, s);
      geos.push(link.clone().applyMatrix4(m4));
    }
    const m = new Mesh(mergeGeometries(geos), mat);
    m.castShadow = true;
    parent.add(m);
    for (const g of geos) g.dispose();
    link.dispose();
    return m;
  }

  // ----- the vessels: each builder fills a group whose origin is on the shelf, and returns the height of its top -----
  // סיר, as the book p. מ: a round-bellied pot with a flared rim and a chain at each side
  function kel_sir(g, mat) {
    kel_lathe(g, [[0, 0], [0.95, 0], [1.35, 0.25], [1.62, 0.8], [1.62, 1.25], [1.42, 1.66], [1.38, 1.82], [1.54, 2.0], [1.5, 2.04],
      [1.32, 1.86], [1.28, 1.62], [1.48, 1.2], [1.48, 0.85], [1.22, 0.35], [0.85, 0.14], [0, 0.14]], mat);
    kel_ball(g, 0.1, mat, 1.62, 1.28, 0.05);
    kel_ball(g, 0.1, mat, -1.62, 1.28, -0.05);
    kel_chain(g, [[1.68, 1.25, 0.08], [1.86, 0.55, 0.3], [2.05, 0.08, 0.72], [2.75, 0.08, 1.0], [3.05, 0.08, 0.3], [2.5, 0.08, 0.0]], mat);
    kel_chain(g, [[-1.68, 1.25, -0.08], [-1.9, 0.55, -0.1], [-2.15, 0.08, 0.2], [-2.85, 0.08, 0.35], [-3.0, 0.08, -0.5]], mat);
    return 2.1;
  }
  // יעה, as the book p. מ and Rashi on Ex 27:3 "כמין כסוי הקדרה של מתכת דק ולו בית יד": a thin, barely dished disc with a rod
  function kel_yaa(g, mat) {
    kel_lathe(g, [[0, 0.08], [1.75, 0.08], [2.25, 0.26], [2.28, 0.31], [2.2, 0.3], [1.72, 0.15], [0, 0.15]], mat, 64);
    kel_rod(g, [-1.62, 0.32, -1.62], [-2.95, 1.75, -2.95], 0.13, mat, 0.1);
    return 1.9;
  }
  // מזרק, as the book pp. מ, מד: a cone standing on its point with a rod at the rim
  function kel_mizrak(g, mat) {
    const t = new Group();
    kel_lathe(t, [[0, 0], [1.38, 2.75], [1.48, 2.84], [1.42, 2.86], [1.26, 2.72], [0.03, 0.22], [0, 0.22]], mat, 56);
    kel_rod(t, [-1.2, 2.72, 0.5], [-2.4, 3.9, 1.0], 0.1, mat, 0.075);
    t.rotation.z = -0.2;   // leaning a little, as in the book's picture
    g.add(t);
    return 3.9;
  }
  // מזלג: II Chr 4:16; Rashi on Ex 27:3 "כמין אנקליות כפופים". Not in the book: a model choice - a long handle, three bent prongs
  function kel_mazleg(g, mat) {
    kel_rod(g, [2.9, 0.14, 0.9], [-0.7, 0.14, 0.05], 0.1, mat, 0.13);
    kel_rod(g, [-0.72, 0.14, -0.62], [-0.72, 0.14, 0.72], 0.1, mat);
    for (const z of [-0.6, 0.05, 0.7])
      kel_tube(g, [[-0.72, 0.14, z], [-1.7, 0.14, z], [-2.5, 0.24, z], [-3.0, 0.72, z], [-2.8, 1.25, z]], 0.075, mat);
    return 1.4;
  }
  // פרח, as the book's menorah (p. מג): a stub of the branch, the ball and on it the rosette of pointed petals
  function kel_perach(g, mat) {
    kel_lathe(g, [[0, 0], [0.75, 0], [0.75, 0.12], [0.2, 0.22], [0, 0.22]], mat, 32);
    kel_rod(g, [0, 0.2, 0], [0, 1.7, 0], 0.17, mat);
    kel_ball(g, 0.5, mat, 0, 1.95, 0);
    const petal = new SphereGeometry(1, 12, 8);
    petal.scale(0.27, 0.72, 0.09);
    petal.translate(0, 0.72, 0);
    const geos = [], m4 = new Matrix4(), e = new Euler(), p = new Vector3(0, 2.35, 0), s = new Vector3(1, 1, 1), q = new Quaternion();
    for (let ring = 0; ring < 2; ring++)
      for (let i = 0; i < 6; i++) {
        e.set(ring ? 0.55 : 1.05, (i + ring * 0.5) * Math.PI / 3, 0, "YXZ");
        q.setFromEuler(e);
        m4.compose(p, q, s);
        geos.push(petal.clone().applyMatrix4(m4));
      }
    const m = new Mesh(mergeGeometries(geos), mat);
    m.castShadow = true;
    g.add(m);
    for (const x of geos) x.dispose();
    petal.dispose();
    return 3.5;
  }
  // נר, as the book's menorah: a wide round bowl on a small foot; in it the oil and the wick (Rashi "בזיכין שנותנין בהן השמן והפתילה")
  function kel_ner(g, mat, oil, wick) {
    kel_lathe(g, [[0, 0], [0.62, 0], [0.62, 0.08], [0.18, 0.22], [0.18, 0.44], [0.95, 0.72], [1.72, 1.34], [1.78, 1.42],
      [1.68, 1.38], [0.9, 0.84], [0, 0.62]], mat, 56);
    kel_lathe(g, [[0, 1.08], [1.32, 1.08]], oil, 48);
    kel_tube(g, [[0.05, 0.98, 0], [0.55, 1.12, 0.1], [1.1, 1.3, 0.25], [1.5, 1.55, 0.36]], 0.055, wick);
    return 1.7;
  }
  // מלקחיים, as the book p. מג: two long thin arms joined at one end, a little apart along the way, their tips near
  function kel_melkachayim(g, mat) {
    const Y = 0.14;
    kel_tube(g, [[2.85, Y, 0], [1.2, Y, 0.17], [-0.9, Y, 0.28], [-2.5, Y, 0.09], [-2.95, Y, 0.03]], 0.11, mat, 40).scale.y = 0.75;
    kel_tube(g, [[2.85, Y, 0], [1.2, Y, -0.17], [-0.9, Y, -0.28], [-2.5, Y, -0.09], [-2.95, Y, -0.03]], 0.11, mat, 40).scale.y = 0.75;
    kel_ball(g, 0.13, mat, 2.85, Y * 0.75, 0, 1.4, 0.75, 1);
    return 0.5;
  }
  // כלי שיר, as the book p. מד: two discs with concentric grooves, back to back, a pin at the centre. A model choice for illustration:
  // the book says it does not mean that this is the verse's meaning
  function kel_cymbals(g, mat) {
    const t = new Group();
    const R = 1.95, pts = [];
    for (let i = 0; i <= 72; i++) {
      const r = R * i / 72;
      pts.push([r, 0.62 * Math.pow(r / R, 1.2) + 0.012 * Math.sin(r * 34)]);
    }
    const a = kel_lathe(t, pts, mat, 72);
    a.rotation.z = -Math.PI / 2;
    a.position.x = 0.12;
    const b = kel_lathe(t, pts, mat, 72);
    b.rotation.z = Math.PI / 2;
    b.position.x = -0.12;
    kel_rod(t, [-0.42, 0, 0], [0.42, 0, 0], 0.08, mat);
    t.position.y = R + 0.02;
    t.rotation.y = -0.95;   // its face toward the viewer (from the south)
    g.add(t);
    return 4.0;
  }
  // כד: Radak, Metzudat Zion, Ralbag on "והספות". Not in the book: a model choice - belly, neck, handle
  function kel_kad(g, mat) {
    kel_lathe(g, [[0, 0], [0.82, 0], [0.92, 0.1], [1.4, 0.95], [1.46, 1.5], [1.18, 2.2], [0.56, 2.8], [0.46, 3.2], [0.68, 3.6], [0.7, 3.66],
      [0.56, 3.62], [0.36, 3.2], [0.44, 2.8], [0, 2.6]], mat, 48);
    kel_tube(g, [[-0.46, 3.15, 0], [-1.05, 3.25, 0], [-1.42, 2.6, 0], [-1.38, 1.8, 0]], 0.09, mat);
    return 3.8;
  }
  // מגריפה, as the book p. מד (Arachin 10b-11a): a drum "היא אמה וגבוה אמה", its handle "וקתא יוצא הימנה" and ten pipes (Rashi there "ובכל נקב היה
  // קנה אחד ובכל קנה וקנה היו בו י' נקבים"), each with ten holes. Drum length = diameter = 2.3 at this exhibit's size.
  function kel_magrefa(g, mat, dark) {
    const t = new Group(), L = 2.3, R = 1.15, Y = 0.95 + R;
    kel_lathe(t, [[0, 0], [0.62, 0], [0.62, 0.1], [0.17, 0.2], [0, 0.2]], mat, 32);
    kel_rod(t, [0, 0.15, 0], [0, 0.95 + 0.05, 0], 0.15, mat);
    const drum = new Mesh(new CylinderGeometry(R, R, L, 48), mat);
    drum.rotation.z = Math.PI / 2;
    drum.position.y = Y;
    drum.castShadow = true;
    t.add(drum);
    const dot = new SphereGeometry(0.036, 6, 4), geos = [], m4 = new Matrix4();
    const S = R * Math.SQRT1_2 * 0.96;
    for (let i = 0; i < 10; i++) {
      const x = -L / 2 + 0.15 + i * (L - 0.3) / 9;
      kel_tube(t, [[x, Y + S, S], [x, Y + S + 0.3, S + 0.05], [x, Y + S + 0.75, S - 0.06], [x, Y + S + 1.4, S - 0.2], [x, Y + S + 2.5, S - 0.22]], 0.06, mat, 18);
      for (let h = 0; h < 10; h++) {
        m4.makeTranslation(x, Y + S + 0.68 + h * 0.19, S - 0.14);
        geos.push(dot.clone().applyMatrix4(m4));
      }
    }
    const dots = new Mesh(mergeGeometries(geos), dark);
    t.add(dots);
    for (const x of geos) x.dispose();
    dot.dispose();
    t.rotation.y = 0.4;   // the drum's end shows, as in the book
    g.add(t);
    return Y + S + 2.55;
  }
  // כף: Rashi "לבזיכי לבונה", Ralbag "לשום בהם מלא קומץ לבונה". Not in the book: a model choice - a shallow bowl with a short handle and frankincense
  function kel_kaf(g, mat, incense) {
    kel_lathe(g, [[0, 0], [0.8, 0], [1.3, 0.42], [1.42, 0.72], [1.36, 0.74], [1.2, 0.46], [0.74, 0.12], [0, 0.12]], mat, 48);
    kel_rod(g, [-1.32, 0.68, 0], [-2.85, 0.72, 0], 0.11, mat, 0.13);
    kel_ball(g, 0.17, mat, -2.9, 0.72, 0);
    kel_ball(g, 0.92, incense, 0, 0.22, 0, 1, 0.42, 1);
    return 1.0;
  }
  // מחתה, as the book p. מד: a flat pan, a high back and two sides falling to an open front, a rod from the back
  function kel_machta(g, mat) {
    const W = 3.0, D = 3.5, H = 1.15, T = 0.08;
    const floor = new Mesh(new BoxGeometry(W, T, D), mat);
    floor.position.set(0, T / 2, 0.3);
    floor.castShadow = floor.receiveShadow = true;
    g.add(floor);
    const back = new Mesh(new BoxGeometry(W, H, T), mat);
    back.position.set(0, H / 2, 0.3 - D / 2);
    back.castShadow = true;
    g.add(back);
    const sh = new Shape();
    sh.moveTo(0, 0);
    sh.lineTo(D, 0);
    sh.lineTo(0, H);
    sh.closePath();
    const side = new ExtrudeGeometry(sh, { depth: T, bevelEnabled: false });
    for (const x of [-W / 2, W / 2 - T]) {
      const m = new Mesh(side, mat);
      m.rotation.y = -Math.PI / 2;      // the shape's +x (the front) toward +z
      m.position.set(x + T, 0, 0.3 - D / 2);
      m.castShadow = true;
      g.add(m);
    }
    kel_rod(g, [0, H * 0.72, 0.3 - D / 2], [0, H + 0.95, 0.3 - D / 2 - 1.75], 0.12, mat, 0.095);
    return 2.2;
  }
  // מפתח, as the book p. מד ("צורת המפתחות להמחשה בלבד"): two rings for a bow, a collar, a split shank and a bit; it hangs by a ring, as there
  function kel_key(g, mat, ringMat, post) {
    kel_rod(g, [-1.6, 0, 0], [-1.6, 5.35, 0], 0.11, post);
    kel_rod(g, [-1.65, 5.3, 0], [0.12, 5.3, 0], 0.09, post);
    const ring = new Mesh(new TorusGeometry(0.4, 0.05, 10, 32), ringMat);
    ring.position.set(0, 4.95, 0);
    ring.rotation.y = 0.9;
    ring.castShadow = true;
    g.add(ring);
    const bow1 = new Mesh(new TorusGeometry(0.42, 0.075, 10, 32), mat);
    bow1.position.set(0, 4.28, 0);
    bow1.scale.set(1.12, 0.9, 1);
    bow1.castShadow = true;
    g.add(bow1);
    const bow2 = new Mesh(new TorusGeometry(0.28, 0.07, 10, 28), mat);
    bow2.position.set(0, 3.68, 0);
    bow2.castShadow = true;
    g.add(bow2);
    kel_lathe(g, [[0, 3.08], [0.2, 3.08], [0.24, 3.16], [0.16, 3.22], [0.2, 3.32], [0.12, 3.42], [0, 3.42]], mat, 24);
    kel_rod(g, [-0.075, 3.1, 0], [-0.075, 1.15, 0], 0.06, mat);
    kel_rod(g, [0.075, 3.1, 0], [0.075, 1.15, 0], 0.06, mat);
    for (const b of [[0.34, 1.5, 0.42, 0.16], [0.34, 1.26, 0.56, 0.16], [0.28, 1.04, 0.5, 0.2]]) {
      const m = new Mesh(new BoxGeometry(b[2], b[3], 0.09), mat);
      m.position.set(b[0], b[1], 0);
      m.castShadow = true;
      g.add(m);
    }
    return 5.5;
  }
  // פותה: Metzudat Zion "והפותה שתחת הציר", Ralbag "מה שיכנס ציר הדלת בו". Not in the book: a model choice - the gold socket in a stone sill, and above
  // it the door's pivot and a piece of the door, lifted so that the socket shows
  function kel_pota(g, mat, stone) {
    const sill = new Mesh(new BoxGeometry(3.0, 0.5, 2.2), stone);
    sill.position.set(0, 0.25, 0);
    sill.castShadow = sill.receiveShadow = true;
    g.add(sill);
    kel_lathe(g, [[0, 0.5], [0.8, 0.5], [0.8, 0.9], [0.72, 0.96], [0.42, 0.96], [0.42, 0.56], [0, 0.56]], mat, 40);
    kel_lathe(g, [[0, 1.45], [0.32, 1.45], [0.38, 1.55], [0.38, 2.1], [0.46, 2.1], [0.46, 4.1], [0, 4.1]], mat, 32);
    const door = new Mesh(new BoxGeometry(1.8, 2.0, 0.26), mat);
    door.position.set(1.3, 3.1, 0);
    door.castShadow = true;
    g.add(door);
    return 4.2;
  }

  // ----- the build -----
  async function buildKelim(ctx) {
    const M2 = ctx.M, F = ctx.LV.HAR;
    const KX = -60, KZ = -118;           // the exhibit's centre, see the header (model choice)
    const g = new Group();
    g.name = "kelim";
    g.visible = false;                   // hidden by default: only the pill or the UI opens it
    ctx.root.add(g);
    ctx.layers.kelim = g;

    const gold = M2.gold.clone();        // the one gold recipe; both faces, the vessels are open shells
    gold.side = DoubleSide;
    const bronze = vsl_bronze(M2, 0xB8683A, 0.3);
    bronze.side = DoubleSide;
    const dark = new MeshStandardMaterial({ color: 0x3a2706, roughness: 0.8 });
    const oil = new MeshStandardMaterial({ color: 0xB98F1E, roughness: 0.18, metalness: 0.1, side: DoubleSide });
    const wick = new MeshStandardMaterial({ color: 0xE8E0CC, roughness: 0.9 });
    const incense = new MeshStandardMaterial({ color: 0xF2EEE2, roughness: 0.95 });

    // the stand: three stone steps, the front (south) lowest. Model choice.
    const ROWS = [
      { y: 0.8, z: 6.5, w: 30, d: 6.5, keys: 4, pitch: 7.2 },
      { y: 2.2, z: 0, w: 43, d: 6.5, keys: 6, pitch: 7 },
      { y: 3.6, z: -6.5, w: 43, d: 6.5, keys: 5, pitch: 7 }   // 0, +-7, +-14: between the middle row's +-3.5, +-10.5, +-17.5, nothing hides behind a tall one
    ];
    const standMat = M2.stoneSmooth.clone();   // darker than the court's floor, so that the gold reads on it
    standMat.color.set(0x8f8473);
    for (const r of ROWS) box(g, r.w, r.y, r.d, standMat, KX, F, KZ + r.z);

    const BUILD = {
      sirot: (t) => kel_sir(t, bronze),
      yaim: (t) => kel_yaa(t, bronze),
      mizrakotN: (t) => kel_mizrak(t, bronze),
      mazlegot: (t) => kel_mazleg(t, bronze),
      perach: (t) => kel_perach(t, gold),
      nerot: (t) => kel_ner(t, gold, oil, wick),
      melkachayim: (t) => kel_melkachayim(t, gold),
      sefotZemer: (t) => kel_cymbals(t, gold),
      sefotKad: (t) => kel_kad(t, gold),
      mizmerot: (t) => kel_magrefa(t, gold, dark),
      mizrakotZ: (t) => kel_mizrak(t, gold),
      kapot: (t) => kel_kaf(t, gold, incense),
      machtot: (t) => kel_machta(t, gold),
      petotKey: (t) => kel_key(t, gold, bronze, M2.stoneSmooth),
      petotTzir: (t) => kel_pota(t, gold, M2.stoneSmooth)
    };
    const items = [];
    const counters = [0, 0, 0];
    for (const it of KEL_ITEMS) {
      const r = ROWS[it.row], i = counters[it.row]++;
      const pitch = r.pitch;
      // Hebrew order: the first at the viewer's right; the viewer stands south of the stand and looks north, his right is east (+x)
      const x = KX + (r.keys - 1) / 2 * pitch - i * pitch, y = F + r.y, z = KZ + r.z;
      const t = new Group();
      t.name = "kelim-" + it.key;
      t.position.set(x, y, z);
      g.add(t);
      let h = 3;
      try {
        h = BUILD[it.key](t);
      } catch (e) {
        console.error("[kelim] " + it.key, e);
      }
      const text = kel_quotes(it.q) + ". " + it.shape;
      const anchor = [x, y + h / 2, z];
      items.push({
        key: it.key, name: it.name, label: it.label, verse: it.verse, metal: it.metal, text, shape: it.shape, refs: kel_refs(it.q, it.v), anchor,
        fly: { pos: [x, y + h / 2 + 7, z + 12], target: anchor }
      });
      ctx.labels.push({ text: it.label, x, y: y + h + 1.1, z, size: 2, layer: "kelim", kelimKey: it.key });
    }
    const TITLE = "כלי הבית — סוף פרק ז";
    ctx.labels.push({ text: TITLE, x: KX, y: F + 13.5, z: KZ - 6.5, size: 3.4, layer: "kelim", kelimKey: "__title" });
    ctx.labels.push({ text: "כלי הנחושת (ז, מ; ז, מה)", x: KX + 18.5, y: F + 3.4, z: KZ + 6.5, size: 2, layer: "kelim", kelimKey: "__nechoshet" });
    ctx.labels.push({ text: "כלי הזהב (ז, מט–נ)", x: KX - 18.5, y: F + 3.4, z: KZ + 6.5, size: 2, layer: "kelim", kelimKey: "__zahav" });

    const INFO = "כלי הבית שבסוף פרק ז.\nכלי הנחושת שעשה חירם: 'ויעש חירום את הכירות ואת היעים ואת המזרקות' (ז, מ), 'נחשת ממרט' (ז, מה), ועוד 'המזלגות' (דברי הימים ב ד, טז).\nכלי הזהב שעשה שלמה: 'והפרח והנרת והמלקחים זהב' (ז, מט), 'והספות והמזמרות והמזרקות והכפות והמחתות זהב סגור והפתות' (ז, נ)." + kel_quotes(KEL_INFO_Q) + ". " +
      "מזבח הזהב, השלחן והמנורות (ז, מח–מט) עומדים במקומם בהיכל.\nבמודל: **המוצג כאן להמחשה בלבד** — לא מקומו בחצר ולא גודל הכלים מן המקורות, וכל צורה מסומנת אם היא כציור הספר או בחירת מודל.";
    const REFS = [["מלכים א ז, מ", ["V", 10, 7, 40]], ["מלכים א ז, מה", ["V", 10, 7, 45]], ["מלכים א ז, מח", ["V", 10, 7, 48]], ["מלכים א ז, מט", ["V", 10, 7, 49]], ["מלכים א ז, נ", ["V", 10, 7, 50]],
      ["דברי הימים ב ד, יא", ["V", 39, 4, 11]], ["דברי הימים ב ד, טז", ["V", 39, 4, 16]], ["דברי הימים ב ד, יט", ["V", 39, 4, 19]], ["דברי הימים ב ד, כ", ["V", 39, 4, 20]], ["דברי הימים ב ד, כא", ["V", 39, 4, 21]], ["דברי הימים ב ד, כב", ["V", 39, 4, 22]]]
      .concat(kel_refs(KEL_INFO_Q));

    ctx.shared.kelim = {
      on: false,
      title: TITLE,
      info: INFO,
      refs: REFS,
      items,
      existing: [   // built in their places in the house (55-interior.js): the UI may link to them
        { name: "מזבח הזהב", verse: "מלכים א ז, מח", fly: "incenseAltar" },
        { name: "השלחן", verse: "מלכים א ז, מח", fly: "shulchanot" },
        { name: "המנורות", verse: "מלכים א ז, מט", fly: "menorot" }
      ],
      set(v) {
        this.on = !!v;
        g.visible = this.on;
      }
    };

    ctx.shared.flyPoints = ctx.shared.flyPoints || {};
    // from the south, between the inner court's north wall and the stand; the view runs north over the free court (the ray stays clear)
    ctx.shared.flyPoints.kelim = { pos: [KX + 5, F + 21, KZ + 40], target: [KX + 5, F + 4.5, KZ - 2] };

    // the pill. It stands over the title; from inside the inner court or the house (no sight of the exhibit through the wall) it is not drawn
    const ANCHOR = [KX, F + 16, KZ - 6.5];
    ctx.shared.modelButtons = ctx.shared.modelButtons || [];
    ctx.shared.modelButtons.push({
      id: "kelim",
      label: "הצג את כלי הבית",
      labelOn: "הסתר את כלי הבית",
      title: "הכלים שבסוף פרק ז: הסירות, היעים והמזרקות של נחושת (ז, מ; ז, מה), המזלגות (דברי הימים ב ד, טז), והפרח, הנרות, המלקחים, הספות, המזמרות, המזרקות, הכפות, המחתות והפתות של זהב (ז, מט–נ).",
      anchor: () => {
        const c = ctx.camera.position;
        return c.z < -74 || c.y > 34 ? ANCHOR : null;
      },
      maxDist: 110,
      get: () => ctx.shared.kelim.on,
      set: (on) => ctx.shared.kelim.set(on)
    });
  }
