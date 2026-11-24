  // plugin/js/tamid.js
  // ===== 55-tamid.js — "סדר עבודת הבוקר": the morning's service by Masechet Tamid, a demonstration in stages (2.0, 11.11.2026) =====
  // The user (11.11.2026): "הדלקת הנרות וכל הסדר הידוע של הבוקר... לעשות הדגמה להקרבת קורבן התמיד, לפי הסדר"; "תתחיל דווקא בגדול";
  // his decisions: the Second Temple only; two orders in one switch - Abaye's (Yoma 33a, "אליבא דאבא שאול"; the default) and the
  // Rambam's (Temidin uMusafin 6, as the Chachamim); the lamps in two readings in one switch - the Rambam's (the default: the menorah
  // north-south, Beit HaBechirah 3:12; the middle lamp faces the Holy of Holies and is the western, 3:8; the two left for the second
  // entry = the middle and the one north of it, the Tiferet Yisrael; lit in the morning, "והדלקת הנרות היא הטבתם", Temidin 3:12) and
  // Rashi's, the Ra'avad's and the Bartenura's ("אלו אותם אנשים": the menorah east-west as this Tanna, the two eastern by the door, the
  // western the second from the east, Rashi Shabbat 22b; in the morning left unlit until the evening, the Bartenura); simple figures (the
  // priests in their four garments); the lamb without its slaughter; sounds; the night turning to dawn. Not yet a part of the plugin's
  // release: a separate viewing file first (the user: "שלא תצרף לתוסף עד שאגיד לך").
  // HOW: the stages' words are TAMID_DATA (56-tamid-data.js, generated from the library's texts by tools/tamid_200.py); the presentation
  // (75-tour.js, mode "tamid") shows each stage as a slide whose timeline it drives: ctx.shared.tamid.seek(stage, sec, order) every
  // frame. The world is a pure function of the moment: every frame starts from the night and replays every earlier stage to its end and
  // the current one to its second (SC[id]) - so prev / next / pause / speed just work, in either order. A figure walks from wherever the
  // earlier stages left it, by the court's ways (route(): a small graph of the doors, the lanes, the ramp and the steps). Nothing is built
  // before the first use (ensure()). Units: amot; +x east, +z south, y up. Model choices are marked "model choice".
  // The lamps' reading is a reading of the model as well (the opinions table): the menorah turns east-west in Rashi's reading.
  async function buildTamid(ctx2) {
    const DATA = typeof TAMID_DATA !== "undefined" ? TAMID_DATA : null;
    if (!DATA) return;
    // SALT_STAGE_S2 (fix-s2, 23.11.2026 - the user: "הדגמת הבוקר — שלב מליחת האברים לפני ההקטרה"; Tamid 4:3, 88:25: "הלכו ונתנום מחצי
    // הכבש ולמטה במערבו, ומלחום"): a stage of its own, "melach", right after "evarim" in both orders - the nine, who set the limbs, the
    // fine flour, the cakes and the wine on the ramp's lower half by its west side, salt them. Its caption is the Mishnah's words as the
    // data has them (until now the last caption of "evarim", which moves here), with the source; the salt is the ramp's ("על גבי הכבש
    // — ששם מולחים את האברים", Menachot 21b, in the salt's card). The gestures and the stage's length - model choices
    if (DATA.stages && DATA.stages.evarim && !DATA.stages.melach) {
      const ev = DATA.stages.evarim, cs = (ev.caps || []).find((c) => /מְלָחוּם|מלחום/.test(c[1]));
      if (cs) {
        ev.caps = ev.caps.filter((c) => c !== cs);
        DATA.stages.melach = { id: "melach", title: "מליחת האברים על הכבש", dur: 12, v: (ev.v || []).slice(-1), vr: [], caps: [[0.6, cs[1] + " (תמיד ד, ג)"]],
          text: "הכהנים מולחים את האברים, הסולת, החביתין והיין שנתנו על הכבש — מחציו ולמטה, במערבו.", refs: [["תמיד ד, ג", "Mishnah_Tamid.4.3"]], lamps: null };
        for (const o of Object.keys(DATA.orders || {})) { const L = DATA.orders[o], i = L.indexOf("evarim"); if (i >= 0 && L.indexOf("melach") < 0) L.splice(i + 1, 0, "melach"); }
      }
    }
    const F = LV.KOH, MK = 13.5, HEI = LV.HEI, ACX = 55.5, ACZ = -3.5, TOP0 = F + 9;
    const SH = ctx2.shared;
    const KID = {};   // KIDDUSH_FOOT_213: the raised leg, the hand's place on the foot, the priest's spots and the stream (below)
    const fnc = (f) => typeof f === "function";
    const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
    const lerp = (a, b, u) => a + (b - a) * u;
    const smooth = (u) => u * u * (3 - 2 * u);
    const HP = Math.PI / 2;
    // the altar's place (the opinions table moves `mv` of 40-altar.js along z; all its own coordinates below are in its frame: A(), V3())
    const altDz = () => { const P = SH.altarPlace; return P && P.dz && P.dz[P.current] != null ? P.dz[P.current] : 12.5; };
    const topLift = () => (SH.tapuach && SH.tapuach.mode === "raavad" ? 1 : 0);
    let D = altDz(), TOP = TOP0;
    const A = (x, lz) => [x, lz + D];
    const V3 = (x, y, lz) => [x, y, lz + D];
    // (the methods never use `this`: the tour calls them unbound)
    const TM = SH.tamid = {
      order: "abba", lamps: "rambam", belt: "kilayim", mitz: "rashi", ephod: "rashi", shalom: "mishna", kidd: "tk", hp: "off", active: false, stage: -1, sec: 0, qa: null,
      readings: () => ({ order: TM.order, lamps: TM.lamps, belt: TM.belt, mitz: TM.mitz, ephod: TM.ephod, shalom: TM.shalom, kidd: TM.kidd, hp: TM.hp }),
      // HP_TAMID_A2 (the user's decision 70 a): the high priest in his eight garments - Tamid 7:1, 7:3 (88:38, 40) - "בזמן שכהן גדול
      // נכנס להשתחוות" and "בזמן שכהן גדול רוצה להקטיר": in the stages of the blessing and of the limbs, when chosen
      setHp: (m) => { TM.hp = m === "on" ? "on" : "off"; retour(); return TM.hp; },
      // KIDDUSH_A2 (the user's decision 82): the kiddush - the Tanna Kamma and the Rambam (the default) or R. Yose b. R. Yehuda with his
      // fellow helping him (Zevachim 19b, 130:754-755) - the presentation built again at the same stage
      setKidd: (m) => { TM.kidd = m === "ryose" ? "ryose" : "tk"; retour(); return TM.kidd; },
      // NIGHT_WATCH_305: the row "״שלום עליך״" - who says it: the officer (the Mishnah, Middot 1:2; the default, the user 23:49) or
      // the guard (the Gemara, Tamid 27b; the Rambam, Beit HaBechira 8:10) - the presentation built again at the same stage
      setShalom: (m) => { TM.shalom = m === "gemara" ? "gemara" : "mishna"; retour(); return TM.shalom; },
      // the priests' belt (Yoma 12b, Ravin: "לא נחלקו אלא באבנטו של כהן הדיוט... שרבי אומר: של כלאים, ורבי אלעזר ברבי שמעון אומר: של
      // בוץ"; the high priest's in the days of the year "דברי הכל של כלאים") - at once, the stage going on
      setBelt: (m) => { TM.belt = m === "white" ? "white" : "kilayim"; applyGarb(); return TM.belt; },
      // the high priest's mitznefet: Rashi's or the Ramban's (buildHP) - at once
      setMitz: (m) => { TM.mitz = m === "ramban" ? "ramban" : "rashi"; applyGarb(); return TM.mitz; },
      // the ephod's breadth (the user, 12.11.2026: Rashi and the Rambam): Rashi "רחבו כמדת רחב גבו של אדם ויותר" (28:6), girded round to
      // the front (28:26); the Rambam "רחבו כרחב גבו של אדם מכתף לכתף" (Klei HaMikdash 9:9) - at once
      setEphod: (m) => { TM.ephod = m === "rambam" ? "rambam" : "rashi"; applyGarb(); return TM.ephod; },
      // the opinions table's row "סדר עבודת הבוקר": while the presentation runs, it is built again in the new order at the same stage
      setOrder: (m) => {
        const v = m === "rambam" ? "rambam" : "abba";
        if (v === TM.order) return v;
        TM.order = v;
        retour();
        return v;
      },
      // the row "המנורה והנרות בבוקר": the menorah's turning (a reading of the model) and the lamps of the demonstration
      setLamps: (m) => {
        TM.lamps = m === "rashi" ? "rashi" : "rambam";
        applyLampRot();
        retour();
        return TM.lamps;
      },
      list: (o) => DATA.orders[o || TM.order] || DATA.orders.abba,
      slides: () => { const o = TM.order; return TM.list(o).map((id, i) => slideOf(id, i, o)); },
      begin: () => { const PY = SH.payis; if (PY && PY.avnet) TM.belt = PY.avnet === "butz" ? "white" : "kilayim";   // TAMID_FIG_207: the row "אבנטו של כהן הדיוט"
        ensure(); applyGarb(); TM.active = true; W.group.visible = true; enterWorld(); play(TM.order, 0, 0); return true; },
      end: () => { if (!TM.active) return; TM.active = false; leaveWorld(); },
      seek: (i, sec, o) => { if (TM.active) play(o || TM.order, i, sec); },
      duration: (i, o) => { const st = DATA.stages[TM.list(o)[i]]; return st ? st.dur : 0; },
      camAt: (i, sec, o) => { const ck = CAMK[TM.list(o)[i]]; return ck ? camKey(ck(o || TM.order), sec) : null; },   // (tests: the moving eye)
      figAt: (k) => (W && W.figs[k] ? Object.assign({}, W.figs[k].st) : null),   // (tests: where a figure stands)
      figKeys: () => (W ? Object.keys(W.figs) : []),   // (tests: the figures' names - the path check against the table and the walls)
      figObj: (k) => (W && W.figs[k]) || null,   // HANDS_K (tests: the figure itself - its hands and feet at kiddush)
      qaClear: (e, t) => {   // TAMID_QA_207 (tests: is the line from the target to the eye free of the model's solids?)
        const o = new Vector3(t[0], t[1], t[2]), d = new Vector3(e[0] - t[0], e[1] - t[1], e[2] - t[2]), len = d.length();
        if (len < 1e-3) return null;
        const rc = TM._rc || (TM._rc = new Raycaster());
        rc.set(o, d.normalize()); rc.near = 0.4; rc.far = len; rc.camera = ctx2.camera;   // (a sprite asks for the camera)
        const seen = (x) => { for (let q = x; q; q = q.parent) { if (!q.visible || q === (W && W.group) || q.name === "labels") return false; } return true; };
        for (const h of rc.intersectObject(ctx2.root, true)) { const m = h.object; if (!m.isMesh || !seen(m)) continue; const mt = Array.isArray(m.material) ? m.material[0] : m.material; if (mt && (mt.transparent && mt.opacity < 0.5)) continue; return [+h.distance.toFixed(2), m.name || (m.parent && m.parent.name) || m.type]; }
        return null;
      }
    };
    const retour = () => {
      const T = SH.tour;
      if (!TM.active || !T || !fnc(T.retamid)) return;
      try { T.retamid(); } catch (_) {}
    };
    const applyLampRot = () => { const m = SH.menorah; if (m && fnc(m.setRot)) m.setRot(TM.lamps === "rashi"); };
    // ---------------------------------------------------------------- the slides (75-tour.js mode "tamid")
    // GAZIT_PLACE_211 (found 15.11.2026, while the officers were placed): the hall of hewn stone has stood in the court's north-EAST
    // since 1.9.5 (30-courts.js: inner x 69..89, z -78..-56; the lottery's place its east half, x 79..89; the door to the court in
    // the south wall at x 79.75..82.25) - but this demo, written after that, still gathered the priests where the hall had stood
    // before (x 47..73): in the open court, west of the building. Now: the ring in the hall's east half, as the lots demo's
    // (55-payis.js: its centre (84, -67)), the way in by the hall's own door, and the lots demo's eye over it.
    const GZV = [[86.6, 53, -57.5], [86.3, 16.6, -67.6]];   // the hall of hewn stone from above its south wall (its roof opened)
    const menView = () => {
      const m = SH.menorah;
      if (!m) return [[-31, 27.5, 9], [-37, 26.5, 6.5]];
      const M = m.MEN;
      return m.ew ? [[M.x + 4.6, m.FL + 4, M.z - 5.6], [M.x, m.FL + 2.5, M.z]] : [[M.x + 5.2, m.FL + 3.7, M.z - 2.6], [M.x, m.FL + 2.4, M.z]];
    };
    const VIEW = {
      // TAMID_VIEWS_207: the eyes that stood inside a wall in the current model (moked, lot1, patrol, lamb) - from where the place is seen
      // NIGHT_VIEWS_209: from above the hall itself, north of its gate - the gate's two open leaves (gold, twenty amot high, at
      // z -57.5..-53.2) stood across the picture of an eye south of them, as two dark slabs; from here the hearth, the elders on the
      // stone ledges and the four rooms are seen whole
      ihb: () => CAMK.ihb()[0].slice(1), gevini: () => CAMK.gevini()[0].slice(1),   // NIGHT_WATCH_305
      moked: () => CAMK.moked()[0].slice(1),   // NIGHT_WATCH_305: the moving eye's first key (MOKED_WIDE_211's eye at its end)
      lot1: (o) => (o === "rambam" ? GZV : [[-18, 50.5, -58.6], [-18, 15, -69]]),
      patrol: () => CAMK.patrol()[0].slice(1),
      kiyor: () => CAMK.kiyor()[0].slice(1),   // KIYOR_A2; KIYOR_VIEW_S2: the moving eye's first key (CAMK.kiyor)
      kiyor12: () => [[34.5, 28, 44.5], [22, 17.6, 54.7]],   // KIYOR_A2: the twelve round the laver
      terumah: () => [V3(88, 44, 46), V3(56, 21, 18)],
      tapuach: () => [V3(82, 42, 28), V3(55.5, 25, -3.5)],
      maarachah: () => [V3(84, 42, 24), V3(60, 26, 0)],
      maarachah2: () => [V3(30, 40, 30), V3(47, 25.5, 4)],
      gezirin: () => [V3(84, 42, 20), V3(61.5, 27, 1)],
      lot2: () => GZV,
      barkai: () => [[40, 46, -60], [120, 40, -40]],
      lamb: () => CAMK.lamb()[0].slice(1),   // NIGHT_VIEWS_209: the moving eye (CAMK.lamb)
      tobeit: () => [[70, 34, -10], [26, 16, -44]],
      keys: () => [[52, 32, 24], [16, 22, 0]],
      gate: () => [[34, 30, 12], [1, 26, -7]],
      inner: () => [[-20, 27.6, 7], [-32.25, 24.4, 0]],   // ALTAR_EAST_305
      lamps5: menView,
      akedah: () => [[54, 25, -10], [42, 16.5, -25]],
      dam: () => CAMK.dam()[0].slice(1),
      evarim: () => [V3(34, 46, 40), V3(50, 18, 32)],
      melach: () => [V3(37.8, 22.6, 34.9), V3(48.6, 19.2, 35.5)],   // SALT_STAGE_S2: from the west, a little above - the nine in their row on the ramp's lower half, the parts before them
      shema: () => GZV,
      lot34: () => GZV,
      machta: () => [V3(80, 44, 50), V3(52, 22, 20)],
      magrefa: () => [[106, 40, -30], [40, 18, 0]],
      teni: () => [[-20, 28, 8], [-32.25, 24, 0]],   // ALTAR_EAST_305
      lamps2: menView,
      gechalim: () => [[-25, 27.5, 6], [-32.25, 24.5, 0]],   // ALTAR_EAST_305
      ketoret: () => [[-22, 28.5, 8], [-32.25, 25, 0]],   // ALTAR_EAST_305
      // BIRKAT_VIEW_209: the eye stood on the altar's top, in its fire - now in the court between the ulam and the altar, at the south
      birkat: () => [[34, 27, 20], [20, 20.5, -1]],
      haalaah: () => [V3(82, 46, 42), V3(57, 24, 8)],
      mincha: () => [V3(82, 46, 42), V3(57, 24, 8)],
      nesachim: () => [[64, 64, 48], [60, 18, 8]],
      shir: () => [[62, 30, 6], [83.5, 18, 0]],   // DUCHAN_GAP_A2
      sof: () => [[150, 130, 130], [30, 16, 0]]
    };
    // a stage whose eye moves with it: keyframes [sec, pos, target] (smoothed between them), from the slide's own view at 0
    const CAMK = {
      // NIGHT_WATCH_305: with Ish Har HaBayit along the north chel, then with Ben Bavi by the west
      // (NIGHT_SIT_305: the sleepers seen beside the one who comes to them - from the west of the gate of the spark, from the south-west
      // behind the house of the kaporet; until the second draft the eye looked over the officer's back)
      // KIYOR_VIEW_S2 (the user: "צריך מהכיוון השני, לראות גם את הכיור וגם את המוכני"; the coordinator: "הכיור והמוכני גדולים וברורים, מאירים,
      // ובלי עמוד לפניהם. בזמן הקידוש רואים גם את הכהן המקדש"): from the south, between the well and the court's wall - above, while the
      // at a man's height, under the exedra's overhang (from above it hides the wheel) and east of the well (the laver comes up beside the
      // eye, not under it), west of the wall of לשכת המדיחין: the toothed wheel, the well, the laver rising and set on its base, and at the
      // kiddush the priest at its west spout. Until now from the north-west, the wheel behind its posts
      kiyor: () => [[0, [26.3, 20.4, 62.8], [20.6, 17.8, 59.4]], [10.5, [26.3, 20.4, 62.8], [20.6, 17.8, 59.4]], [13.6, [26.3, 20.4, 62.8], [20.2, 19.7, 56.5]], [40, [26.3, 20.4, 62.8], [20.2, 19.6, 56.4]]],   // (the well's mouth seen at first, the eye lifted with the laver)
      ihb: () => [[0, [-28, 17, -99], [-42, 1.6, -77.2]], [2.6, [-49, 7.5, -89], [-41.2, 1.5, -76.9]], [6.4, [-49, 7.5, -89], [-41.2, 1.5, -76.9]],
        [11.2, [-80, 6.2, -83], [-71.3, 1.3, -76.7]], [12.0, [-82, 4.6, -80.5], [-71.3, 1.2, -76.6]], [18.6, [-82, 4.6, -80.5], [-71.3, 1.2, -76.6]],
        [19.4, [-79, 3.8, -80.6], [-71.0, 0.8, -76.6]], [25.6, [-79, 3.8, -80.6], [-71.0, 0.8, -76.6]],
        [27.0, [-84, 22, -100], [-98.5, 2, -78.5]], [29.6, [-88, 12, -93], [-98.6, 1.8, -77.4]], [30.2, [-88, 12, -93], [-98.6, 1.8, -77.4]],
        [33.4, [-112, 9, -50], [-99, 1.6, -42]], [36.6, [-110, 7, -2], [-99, 1.4, -10]], [37.6, [-104, 4.5, 0], [-98.3, 1.2, -6.4]],
        [46, [-104, 4.5, 0], [-98.3, 1.2, -6.4]]],
      // Gevini on the landing: from the north-east, then from before him when he turns to the chel
      gevini: () => [[0, [-2, 21, -95], [-13.5, 14.6, -79.1]], [3.0, [-8.6, 16.9, -86.4], [-15.4, 15.9, -79.0]], [6.2, [-8.6, 16.9, -86.4], [-15.4, 15.9, -79.0]],
        [7.4, [-15.0, 16.4, -88.6], [-15.5, 15.8, -79.0]], [14, [-15.0, 16.4, -88.6], [-15.5, 15.8, -79.0]]],
      // NIGHT_WATCH_305 (the user, 19.11.2026 21:24: "4. הממונה"): the officer across the chel and up the flight, then into the house
      moked: () => [[0, [16, 8.5, -94], [7, 2.4, -79]], [1.0, [16, 8.5, -94], [7, 2.4, -79]], [5.6, [5, 13, -94.5], [-6.5, 8.5, -79.2]],
        [9.2, [-8, 20.5, -93], [-18, 14.6, -79.4]], [10.6, [-8, 20.5, -93], [-18, 14.6, -79.4]], [12.6, [-18, 50.5, -58.6], [-18, 14, -69]], [22, [-18, 50.5, -58.6], [-18, 14, -69]]],
      // NESACHIM_BOW_209: the libation from above, then - at the bows of the song ("והשתחוו העם", Tamid 7:3) - the priests on the
      // ulam's steps bowing toward the house, from the court
      nesachim: () => [[0, [64, 64, 48], [60, 18, 8]], [19.4, [64, 64, 48], [60, 18, 8]], [21.2, [36, 27, 26], [20, 18.5, -3]], [30, [35, 26.5, 24], [20, 18.5, -3]]],
      // NIGHT_VIEWS_209: the lamb - first from above the hall (as the hall's own eye), the slaughterer going in to the lambs' room
      // (its south-west room) and out with the lamb; when they reach the gate, a cut to the court, south-east of the gate, where it is
      // given to drink from the gold cup and examined by the torch's light (12-22.5). A cut, not a flight: every way from above the
      // hall down to the court passes through the gate's open leaves (gold, twenty amot high)
      lamb: () => [[0, [-19, 46, -58], [-21.5, 16, -66]], [9.4, [-19, 46, -58], [-21.5, 16, -66]],
        [9.5, [-3, 29, -37], [-17.5, 15.5, -51]], [24, [-3, 29, -37], [-17.5, 15.5, -51]]],
      patrol: () => [[0, [-18, 50.5, -58.6], [-18, 15, -68]], [9, [-18, 50.5, -58.6], [-18, 15, -68]],   // NIGHT_VIEWS_209 (the first nine seconds)
        // (NIGHT_VIEWS_209: up above the hall first - straight on to the high eye, the way passed ten amot over the house's roof)
        [12, [-18, 150, -60], [-18, 15, -45]],
        [15, [10, 210, 150], [0, 16, 0]], [23, [10, 210, 150], [0, 16, 0]],
        [27, [114, 58, 54], [88, 15, 21]], [34, [114, 58, 54], [88, 15, 21]]],
      dam: () => [[0, V3(52, 30, -40), V3(56, 17, -10)], [4, V3(86, 26, -36), V3(70, 18, -18)], [8, V3(86, 26, -36), V3(70, 18, -18)],
        [10.5, V3(30, 36, -32), V3(42, 18, 0)], [13, V3(26, 26, 30), V3(40, 18, 12)], [20, V3(26, 26, 30), V3(40, 18, 12)]]
    };
    // KIDDUSH_VIEW_K (fix-k, 23.11.2026 - the user: "הזווית לא נכונה. אני רוצה שיראו איך הוא מקדש ממש"; the coordinator: from the side - the
    // whole figure, the tap, and the right hand flat on the back of the right foot): while he sanctifies, the eye goes to his right side -
    // out from the laver along the spout's way (he stands sideways to the spout, the laver at his left), a little before him, at his
    // bowed back's height; and back after it. In "kiyor" (S2's moving eye, KIYOR_VIEW_S2, kept before and after) from 15.2 to 20.2; in
    // "kiyor12" the priest at the west spout (s7), from 8.2 to 15.8. The distance and the height - model choices
    const kidSide = (i, sec0, sec1, base) => {
      const q = KID.flatSpot(i), fw = [Math.sin(q.yaw), Math.cos(q.yaw)], rt = [-Math.cos(q.yaw), Math.sin(q.yaw)], y0 = F;
      const E = [q.p[0] + rt[0] * 5.6 + fw[0] * 0.7, y0 + 2.3, q.p[1] + rt[1] * 5.6 + fw[1] * 0.7], T = [q.p[0] + fw[0] * 0.3, y0 + 1.05, q.p[1] + fw[1] * 0.3];
      const K0 = base || [[0, E, T]], at = (t) => { const v = camKey(K0, t); return [t, v[0], v[1]]; };
      return K0.filter((k) => k[0] < sec0).concat([at(sec0), [sec0 + 0.8, E, T], [sec1 - 0.8, E, T], at(sec1)], K0.filter((k) => k[0] > sec1));
    };
    { const k0 = CAMK.kiyor; if (k0) CAMK.kiyor = (o) => kidSide(6, 15.2, 20.2, k0(o)); }
    { const v12 = VIEW.kiyor12; CAMK.kiyor12 = () => { const v = v12(); return kidSide(6, 8.2, 15.8, [[0, v[0], v[1]], [30, v[0], v[1]]]); }; }
    const camKey = (K, sec) => {
      let j = 0;
      while (j < K.length - 1 && K[j + 1][0] <= sec) j++;
      if (j >= K.length - 1) return [K[K.length - 1][1], K[K.length - 1][2]];
      const a = K[j], b = K[j + 1], u = smooth(clamp((sec - a[0]) / Math.max(0.01, b[0] - a[0]), 0, 1));
      return [a[1].map((v, k) => lerp(v, b[1][k], u)), a[2].map((v, k) => lerp(v, b[2][k], u))];
    };
    const tourHeld = () => { const T = SH.tour; try { return !!(T && T.state && T.state.paused); } catch (_) { return false; } };
    const viewOf = (id, o) => {
      D = altDz();
      const f = VIEW[id], v = f ? f(o) : [[150, 130, 130], [30, 16, 0]];
      return { pos: v[0].slice(), target: v[1].slice() };
    };
    const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    const slideOf = (id, i, o) => {
      const st = DATA.stages[id], R = o === "rambam", n = TM.list(o).length;
      const verses = st.v.map((x) => [0, x.w, x.lbl]);
      if (R) for (const x of st.vr || []) verses.push([0, x.w, x.lbl]);
      const text = st.lamps ? st.lamps[TM.lamps] || st.text : st.text;
      if (id === "shir") {
        const d = new Date().getDay();
        verses.splice(0, verses.length, [0, DATA.shir[d] || DATA.shir[0], "תמיד ז, ד — " + (d === 6 ? "השיר של שבת" : "השיר של יום " + DAYS[d])]);
      }
      const caps = (st.capsG && TM.shalom === "gemara" ? st.capsG : R && st.capsR ? st.capsR : st.caps).map(([t, c]) => ({ t, text: c }));   // NIGHT_WATCH_305: capsG
      // LAMPS_CAP_300 (the user, 18.11.2026, "א+ג": the lamp he fixes as it was, and a caption): in the Rambam's reading all seven lamps
      // burn at the second dressing - at the first he lit the five ("והדלקת הנרות היא הטבתם", Temidin 3) - the caption says so at the
      // stage's start, and the Mishnah's first words follow at 3.6 (he reaches the menorah at 4.6)
      if (id === "lamps2" && TM.lamps !== "rashi" && caps.length) { caps[0].t = Math.max(caps[0].t, 3.6); caps.unshift({ t: 0, text: "כרמב״ם: בהטבה הראשונה הדליק את החמישה, ולכן כל השבעה דולקים" }); }
      return { kind: "tamid", part: 0, id, order: o, title: st.title, sub: (R ? "סדר הרמב״ם" : "סדר אביי") + " · שלב " + (i + 1) + " מתוך " + n,
        text, refs: st.refs, verses, go: [viewOf(id, o)], anim: "tamid", stage: i, caps, dur: st.dur };
    };
    // ---------------------------------------------------------------- the world (built on its first use)
    let W = null;
    const ensure = () => { if (!W) { W = buildWorld(); applyGarb(); } return W; };
    const applyGarb = () => {
      if (!W) return;
      const bm = TM.belt === "white" ? W.MAT.beltW : W.MAT.beltK;
      const K7 = SH.priestKit, km = K7 ? (TM.belt === "white" ? K7.mSashWhite : K7.mSashDyed) : bm;   // TAMID_FIG_207
      for (const id in W.figs) { const f = W.figs[id]; if (f.kind === "K" && f.belt) f.belt.material = f.belt.userData.kit ? km : bm; }
      for (const p of W.piles) p.material = bm;
      const m = W.hp && W.hp.mitz;
      if (m) { for (const g of m.rashi) g.visible = TM.mitz !== "ramban"; for (const g of m.ramban) g.visible = TM.mitz === "ramban"; }
      const e = W.hp && W.hp.ephod;
      if (e) { e.rashi.visible = TM.ephod !== "rambam"; e.rambam.visible = TM.ephod === "rambam"; }
    };
    function buildWorld() {
      const group = new Group();
      group.name = "tamid-world";
      group.visible = false;
      ctx2.scene.add(group);
      const altarG = new Group();   // what stands on the altar or by it: moved with it (D) and lifted with the Ra'avad's table
      group.add(altarG);
      const std = (color, o = {}) => new MeshStandardMaterial(Object.assign({ color, roughness: 0.85, metalness: 0 }, o));
      // the tunic's weave (Rambam, Klei HaMikdash 8:16 "בתים בתים... כמו בית הכוסות"): white, a grid of fine lines, four cells to a tile
      const weave = (() => {
        const cv = document.createElement("canvas");
        cv.width = cv.height = 64;
        const c = cv.getContext("2d");
        c.fillStyle = "#ffffff"; c.fillRect(0, 0, 64, 64);
        c.fillStyle = "#d3ccba";
        for (let i = 0; i < 4; i++) { c.fillRect(i * 16, 0, 2, 64); c.fillRect(0, i * 16, 64, 2); }
        const tx = new CanvasTexture(cv);
        tx.wrapS = tx.wrapT = RepeatWrapping;
        tx.colorSpace = SRGBColorSpace;
        tx.anisotropy = 4;
        return tx;
      })();
      const MAT = {
        fig: std(0xffffff, { vertexColors: true, roughness: 0.9, map: weave }),
        skin: std(0xc4946c, { roughness: 0.8 }), cap: std(0x2a2520, { roughness: 1 }),
        gold: std(0xe6c05a, { metalness: 0.85, roughness: 0.3, emissive: 0x3a2a06, emissiveIntensity: 0.4 }),
        silver: std(0xd9dee4, { metalness: 0.9, roughness: 0.25, emissive: 0x202428, emissiveIntensity: 0.3 }),
        bronze: tm_copper(0xb7823e, 0.35, { metalness: 0.8 }),   // COPPER_C (fix-c): the book's copper (shared/frag/copper.js; until now std(0xb7823e)) wood: std(0x7c5130, { roughness: 0.95 }),
        woodNew: std(0xd2a46c, { roughness: 0.9, emissive: 0xff5a10, emissiveIntensity: 0 }),
        ash: std(0x77726c, { roughness: 1 }), wool: std(0xf1ece0, { roughness: 1 }), woolDark: std(0x8c8072, { roughness: 1 }),
        portion: std(0xc79a8c, { roughness: 0.85 }), flour: std(0xf8f5ec, { roughness: 1 }), cake: std(0xd8ad62, { roughness: 0.85 }),
        salt: std(0xffffff, { roughness: 0.6 }), cloth: std(0xfaf8f2, { roughness: 0.95, side: DoubleSide }),
        blanket: [std(0x5b4637), std(0x46505e), std(0x5e5440), std(0x4b3c3c)], incense: std(0x6a3f22, { roughness: 1 }),
        ember: new MeshBasicMaterial({ color: 0xff7a26 }), blood: new MeshBasicMaterial({ color: 0x6e0b0b, transparent: true, opacity: 0, depthWrite: false })
      };
      // ---- the figures: one body of merged pieces coloured by vertex (the tunic, the belt, the head, the beard, the hat), the arms in two
      // pieces each and the feet; one material for all - 7 draws a figure. The garments by the Rambam, Klei HaMikdash 8 - 10: the tunic
      // "משבצת היתה שהיא בתים בתים באריגתה כמו בית הכוסות" (8:16: the weave below, a fine check, white in white) "עד למעלה מן העקב", its
      // sleeve "עד פס ידו. ורחבו כרחב היד" (8:17); the belt "רחבו כמו שלש אצבעות" (8:19), girded "כנגד אצילי ידיו ומקיפו כרך על כרך עד
      // שגומר וקושר" (10:1; "על לבביהון", 10:2 - above the elbow of the hanging arm), of wool and linen ("והאבנט לבדו רקום בצמר", 8:1 -
      // Rebbi) or of linen (Rabbi Elazar b. R. Shimon; Yoma 12b) - TM.belt; its colours by 8:13 (techelet "כעצם שמים", argaman "הצמר הצבוע
      // אדום", tola'at shani "הצבוע בתולעת", shesh the linen), its threads twined (twine below), no knot shown;
      // the hat "ובניו צונפין בה ככובע ולפיכך נקראת מגבעת" (8:2), "קושר בה כל ראשו ומעלה הכפלים עליו כעין מגבעת" (the Ramban, Shemot
      // 28:31, as Rashi's "כמין כפת כובע" for the sons) - wound over the whole head, rising like a hill. The high priest: buildHP below
      const V2 = (r, y) => new Vector2(r, y);
      const tint = (geo, hex) => {
        const c = new Color(hex), n = geo.attributes.position.count, a = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
        geo.setAttribute("color", new BufferAttribute(a, 3));
        return geo;
      };
      // the weave's texture coordinates: the woven linen scaled to the cells; what is not of it takes a point inside a cell (plain)
      const plain = (geo) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.12, 0.12); return geo; };
      const uvScale = (geo, fu, fv) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * fu, uv.getY(i) * fv); return geo; };
      const uvLathe = (geo, fu, fv) => { const uv = geo.attributes.uv, p = geo.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * fu, p.getY(i) * fv); return geo; };
      // the body (the user, 12.11.2026: "מה עשית בכתפיים?... נראה יותר שמלה"): a man's, not a bell - broad at the shoulders, flat before
      // and behind (its depth ZS of its breadth - the tunic and all that lies on it), the tunic falling to above the heel ("עד למעלה מן
      // העקב", 8:17) and the bare feet seen below it
      const ZS = 0.66;
      const TUNIC = [V2(0.001, 0.2), V2(0.36, 0.2), V2(0.355, 0.6), V2(0.335, 1.3), V2(0.3, 1.85), V2(0.315, 2.2), V2(0.335, 2.42), V2(0.36, 2.56),
        V2(0.375, 2.61), V2(0.36, 2.66), V2(0.3, 2.72), V2(0.21, 2.77), V2(0.125, 2.8), V2(0.08, 2.815), V2(0.001, 2.815)];
      const robeR = (y) => { for (let i = 2; i < TUNIC.length; i++) { const a = TUNIC[i - 1], b = TUNIC[i]; if (y <= b.y) return lerp(a.x, b.x, clamp((y - a.y) / Math.max(1e-6, b.y - a.y), 0, 1)); } return 0.08; };
      const COL = { linen: 0xf2eee3, hat: 0xf7f4ec, hat2: 0xe9e4d6, shesh: 0xf1ebdc, techelet: 0x2f58a6, argaman: 0x8e1f24, tolaat: 0xc23a30, beltW: 0xe6e0cf,
        skin: 0xc9a07c, beard: 0x35261b, beardW: 0xf4f2ee, beardG: 0xdcd8d0, beardD: 0xbcb6ac, hair: 0xdedad2, levite: 0xd8cfb7, levCap: 0x2a2520 };
      // a fabric of twined threads (the user: "חוט מכל מין יחד שזורים... בעצם יוצר עירוב צבעים"; "האבנט לא מספיק שזור"): the threads
      // across (th pixels each), every thread twined of the kinds - its plies seen as short slanting strokes, each of one kind - the
      // kinds coming in patches along it (the site's picture 194, "אבנט משש חוטים"; model choice). kinds: [colour, weight]
      const twine = (w, h, kinds, seed, th = 4, bias = 1.2, patch = 1, chev = false) => {
        const cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        const c = cv.getContext("2d"), img = c.createImageData(w, h), d = img.data;
        let sd = seed;
        const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
        const K = kinds.map(([n, wt]) => [[(n >> 16) & 255, (n >> 8) & 255, n & 255], wt]), GX = 8, GY = 2, grid = K.map(() => Array.from({ length: GX * GY }, rnd));
        const at = (k, i, j) => grid[k][(((j % GY) + GY) % GY) * GX + (((i % GX) + GX) % GX)];
        const noise = (k, x, y) => {
          const gx = (x / w) * GX, gy = (y / h) * GY, i = Math.floor(gx), j = Math.floor(gy), fx = smooth(gx - i), fy = smooth(gy - j);
          return lerp(lerp(at(k, i, j), at(k, i + 1, j), fx), lerp(at(k, i, j + 1), at(k, i + 1, j + 1), fx), fy);
        };
        const hash = (a, b) => { const q = Math.sin(a * 127.1 + b * 311.7 + seed) * 43758.5453; return q - Math.floor(q); };
        for (let y = 0; y < h; y++) {
          const t = Math.floor(y / th), fy = ((y % th) + 0.5) / th;
          for (let x = 0; x < w; x++) {
            const q = x + (chev && t % 2 ? (1 - fy) : fy) * 4 + t * 1.7, seg = Math.floor(q / 4), ph = (q / 4) % 1;   // AVNET_211: chev - a braid
            let best = 0, bv = -1;
            for (let k = 0; k < K.length; k++) { const v = patch * noise(k, x, y) + 0.9 * hash(t * 7 + k, seg) + bias * K[k][1]; if (v > bv) { bv = v; best = k; } }
            const sh = (0.6 + 0.4 * Math.sin(Math.PI * ph)) * (0.76 + 0.24 * Math.sin(Math.PI * fy)), col = K[best][0], o = (y * w + x) * 4;
            d[o] = Math.min(255, col[0] * sh); d[o + 1] = Math.min(255, col[1] * sh); d[o + 2] = Math.min(255, col[2] * sh); d[o + 3] = 255;
          }
        }
        c.putImageData(img, 0, 0);
        return cv;
      };
      const texOf = (cv) => { const t = new CanvasTexture(cv); t.wrapS = t.wrapT = RepeatWrapping; t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t; };
      // the belt (the user: "יותר מדי הארגמן בולט"; then "לא תיקנת את הצבע... של האבנט"): the techelet the most of it, the white, the two
      // reds (the Rambam 8:13: argaman "הצמר הצבוע אדום", tola'at shani "הצבוע בתולעת") - as the site's 194
      // AVNET_211 (the user, 14.11.2026: "אבנט כהן גדול צריך עירוב צבעים יותר טוב", and the picture of the coiled avnet he sent): finer
      // threads, almost no large patches - every ply its own kind by the weights - in rows leaning one way and the other, as a braid;
      // from a step away the four kinds melt into one mixed hue
      MAT.beltK = std(0xffffff, { map: texOf(twine(256, 64, [[COL.techelet, 0.3], [COL.argaman, 0.24], [COL.tolaat, 0.21], [COL.shesh, 0.25]], 777, 3, 0.55, 0.12, true)), roughness: 0.85 });
      MAT.beltW = std(0xffffff, { map: texOf(twine(256, 64, [[0xf1ece0, 0.5], [0xddd5c2, 0.3], [0xfbf8f1, 0.3]], 99, 3, 0.6, 0.15, true)), roughness: 0.9 });
      // three fingers a turn (24 to the amah; "רחבו כמו שלש אצבעות", Klei HaMikdash 8:19) - AVNET_211 (the user: "אבנט הכהנים רחב יותר"):
      // four turns "כרך על גבי כרך", each a little above the last, so that the band is seen broader and thicker than one turn - model choice
      const BELT_Y = 2.02, BELT_H = 0.19, BELT_TURNS = 4, BELT_BULGE = 0.021;
      // the belt, its own mesh: wound round "כרך על כרך" (10:1; three turns seen, each a little rounded - model choice), of wool and linen,
      // every thread the four kinds twined together - Rashi, Yoma 71b: "דיש בו נמי ארבע מינין וכל אחד כפול ששה וכששוזרן יחד הוו להו כ"ד" -
      // or, for Rabbi Elazar b. R. Shimon, of linen only (TM.belt; the high priest's always of wool and linen: "בשאר ימות השנה — דברי הכל של
      // כלאים", Yoma 12b). No knot nor ends hanging (the user: "מה הקשר של הסרט באפוד ובאבנט? לא קשור")
      const beltG = (() => {
        const r0 = robeR(BELT_Y + BELT_H / 2) + 0.012, prof = [V2(r0 - 0.012, BELT_Y)];
        for (let k = 0; k <= 48; k++) { const u = k / 48; prof.push(V2(r0 + BELT_BULGE * Math.sqrt(Math.sin(Math.PI * ((u * BELT_TURNS) % 1))), BELT_Y + u * BELT_H)); }   // AVNET_211
        prof.push(V2(r0 - 0.012, BELT_Y + BELT_H));
        return uvLathe(new LatheGeometry(prof, 56), 9, 1 / BELT_H).scale(1, 1, ZS);
      })();
      // the hat (the user, 12.11.2026: "המגבעת לא מגבעת"; the site's picture 194, "מגבעת שיטה ב", worn in its picture 498): the cloth wound
      // round the head and on up in slanting turns, each lying over the last, to a tall rounded top - as an egg ("קושר בה כל ראשו ומעלה
      // הכפלים עליו כעין מגבעת", the Ramban 28:31); set a little back on the head, its front edge above the forehead
      const HAT = [[0, 0.2], [0.05, 0.208], [0.12, 0.207], [0.2, 0.198], [0.28, 0.181], [0.35, 0.157], [0.41, 0.127], [0.46, 0.092], [0.495, 0.056], [0.515, 0.025], [0.522, 0.001]];
      const hatR = (y) => { for (let i = 1; i < HAT.length; i++) if (y <= HAT[i][0]) return lerp(HAT[i - 1][1], HAT[i][1], (y - HAT[i - 1][0]) / (HAT[i][0] - HAT[i - 1][0])); return 0.001; };
      const migbaat = () => {
        const NR = 80, NY = 52, H = 0.522, pos = [], col = [], uv = [], idx = [];
        const c0 = new Color(COL.hat), c1 = new Color(COL.hat2).multiplyScalar(0.8);
        for (let j = 0; j <= NY; j++) {
          const y = (H * j) / NY, r0 = hatR(y), fade = clamp(y / 0.06, 0, 1) * clamp((H - 0.02 - y) / 0.1, 0, 1);
          for (let i = 0; i <= NR; i++) {
            // each turn out where it lies over the one below, in where the next goes over it; the shade under the next one's edge
            const ph = (i / NR) * Math.PI * 2, t = ((((ph / (Math.PI * 2)) * 10 + y * 10) % 1) + 1) % 1, r = r0 + fade * (0.012 * (1 - t) - 0.004);
            pos.push(Math.sin(ph) * r * 0.93, y, Math.cos(ph) * r);
            const cc = c0.clone().lerp(c1, fade * 0.6 * Math.pow(t, 5));
            col.push(cc.r, cc.g, cc.b);
            uv.push(0.12, 0.12);
          }
        }
        for (let j = 0; j < NY; j++) for (let i = 0; i < NR; i++) { const a = j * (NR + 1) + i, b = a + NR + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
        const g = new BufferGeometry();
        g.setAttribute("position", new Float32BufferAttribute(pos, 3));
        g.setAttribute("color", new Float32BufferAttribute(col, 3));
        g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        g.computeVertexNormals();
        return [g.rotateX(-0.17).translate(0, 3.08, HZ - 0.012)];
      };
      // kind: "K" a priest (the belt of wool and linen), "W" a priest (the belt of linen), "H" the high priest (his hair seen; his
      // mitznefet apart), "L" a Levite (his own clothes)
      // folds of hanging cloth on a garment round the y axis: its radius waved round, by the height (amp(y))
      const folds = (geo, n, amp) => {
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = amp(y);
          if (!a) continue;
          const ph = Math.atan2(x, z), k = 1 + a * Math.sin(n * ph + 0.8 * Math.sin(3 * ph + y * 2.1));
          p.setX(i, x * k); p.setZ(i, z * k);
        }
        geo.computeVertexNormals();
        return geo;
      };
      // a geometry mirrored to the other side (x), its faces turned back out
      const mirrorX = (g) => {
        const p = g.attributes.position, n = g.attributes.normal;
        for (let i = 0; i < p.count; i++) { p.setX(i, -p.getX(i)); n.setX(i, -n.getX(i)); }
        const ix = g.index.array;
        for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
        return g;
      };
      const gs = (a, b, sa, sb) => Math.exp(-(a * a) / (2 * sa * sa) - (b * b) / (2 * sb * sb));
      // the head (the user: "הפנים... בובתיות"; then "למתוח קצת את הפנים, מדי נמוכות"): an egg taller than it is broad (HD: its half
      // breadth, height and depth; its middle at y); the nose, the brows, the cheekbones, the lower lip and the chin raised, the eyes set
      // in, the jaw narrowing (model choice). headDef: a point of the unit sphere to the head's, both in its units; headAt: a point on it
      // (th round from before, +x the left; ys up) and `off` out from it - the beard and the hair lie on it
      const HD = { a: 0.158, b: 0.232, c: 0.185, y: 3.0 }, HZ = 0.06;   // HZ: the head's middle before the body's
      const headDef = (x, y, z) => {
        if (z > 0) {
          z += 0.15 * gs(x, y + 0.14, 0.07 + 0.09 * clamp(-(y + 0.02) / 0.3, 0, 1), 0.13) * clamp(1 + (y + 0.3) * 7, 0, 1);   // the nose
          z -= 0.06 * (gs(x - 0.33, y + 0.02, 0.11, 0.07) + gs(x + 0.33, y + 0.02, 0.11, 0.07));                              // the eyes set in
          z += 0.035 * gs(0, y - 0.11, 1, 0.06) * (Math.abs(x) < 0.55 ? 1 : 0.4);                                              // the brows
          z += 0.04 * (gs(x - 0.52, y + 0.2, 0.15, 0.13) + gs(x + 0.52, y + 0.2, 0.15, 0.13));                                // the cheekbones
          z += 0.03 * gs(x, y + 0.465, 0.15, 0.035);                                                                            // the lower lip
          z += 0.05 * gs(x, y + 0.78, 0.22, 0.13);                                                                              // the chin
        }
        if (y < -0.35) x *= 1 - 0.3 * (-0.35 - y);   // the jaw
        if (z < 0 && y < -0.3) z *= 1 - 0.38 * smooth(clamp((-0.3 - y) / 0.6, 0, 1));   // the nape, drawn in to the neck
        return [x, y, z];
      };
      const headAt = (th, ys, off) => {
        const rho = Math.sqrt(Math.max(0, 1 - ys * ys)), [x, y, z] = headDef(rho * Math.sin(th), ys, rho * Math.cos(th));
        const n = new Vector3(x / HD.a, y / HD.b, z / HD.c).normalize();
        return new Vector3(x * HD.a, HD.y + y * HD.b, z * HD.c + HZ).addScaledVector(n, off);
      };
      // the neckline lower before than behind - the chin over it (model choice): a garment's top dipped before, zs its flattening
      const neckDip = (geo, zs) => {
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
          if (y <= 2.6 || z <= 0) continue;
          const r = Math.hypot(x, z / zs), c = r > 1e-4 ? z / zs / r : 0;
          p.setY(i, y - 0.07 * smooth(clamp((y - 2.6) / 0.22, 0, 1)) * Math.pow(c, 1.5));
        }
        geo.computeVertexNormals();
        return geo;
      };
      const bodyGeo = (kind) => {
        const lev = kind === "L", parts = [];
        // the tunic, its cloth falling in folds below the belt (the user: "משהו לא חי") - model choice; flat before and behind (ZS)
        const robe = neckDip(folds(new LatheGeometry(TUNIC, 48), 9, (y) => 0.045 * clamp((2.0 - y) / 1.8, 0, 1)).scale(1, 1, ZS), ZS);
        parts.push(tint(lev ? plain(robe) : uvLathe(robe, 8, 3.4), lev ? COL.levite : COL.linen));
        for (const s of [1, -1]) { const dg = new SphereGeometry(1, 16, 10).scale(0.13, 0.05, 0.085).translate(s * 0.36, 2.6, 0); parts.push(tint(lev ? plain(dg) : uvScale(dg, 2, 2), lev ? COL.levite : COL.linen)); }   // the shoulders
        parts.push(tint(plain(new CylinderGeometry(0.066, 0.078, 0.2, 14, 1, true).rotateX(0.2).translate(0, 2.88, 0.02)), COL.skin));   // the neck
        if (kind !== "HK") for (const s of [1, -1]) parts.push(tint(plain(new SphereGeometry(1, 10, 8).scale(0.016, 0.046, 0.03).rotateY(s * 0.35).translate(s * 0.162, 2.985, HZ - 0.012)), COL.skin));   // the ears (TAMID_FIG_207: none on HK)
        if (lev) parts.push(tint(plain(new SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, HP).scale(0.18, 0.17, 0.2).translate(0, 3.09, HZ)), COL.levCap));
        else if (kind === "H" || kind === "HK") parts.push(tint(plain(new SphereGeometry(1, 18, 9, 0, Math.PI * 2, 0, 1.0).scale(0.166, 0.246, 0.194).translate(0, 3.0, HZ)), COL.hair));   // his hair, seen between the tzitz and the mitznefet
        else parts.push(...migbaat());
        return mergeGeometries(parts);
      };
      // the arm: the sleeve from the shoulder (its top round) to the elbow; the forearm, the sleeve's end at the wrist ("עד פס ידו", 8:17)
      const sleeve = (lev) => mergeGeometries([new CylinderGeometry(0.086, 0.077, 0.62, 16, 1, true).translate(0, -0.31, 0), new SphereGeometry(0.092, 16, 8, 0, Math.PI * 2, 0, HP).scale(1, 0.5, 1)]
        .map((g) => tint(lev ? plain(g) : uvScale(g, 2, 2), lev ? COL.levite : COL.linen)));
      // the hand, open (the user: "תפתח להם גם את הידיים"): the palm toward the body, the fingers a little bent, the thumb before; side +1
      // the left hand, -1 the right (mirrored)
      const handG = (side) => {
        const parts = [], Q = new Quaternion(), DN = new Vector3(0, -1, 0);
        const bone = (r, len, from, dir) => {
          const g = new CapsuleGeometry(r, len, 3, 8);
          g.applyQuaternion(Q.setFromUnitVectors(DN, dir));
          return g.translate(from.x + (dir.x * len) / 2, from.y + (dir.y * len) / 2, from.z + (dir.z * len) / 2);
        };
        parts.push(new CylinderGeometry(0.036, 0.04, 0.06, 12).translate(0, -0.585, 0));                    // the wrist
        parts.push(new SphereGeometry(1, 14, 10).scale(0.021, 0.05, 0.043).translate(-0.004, -0.635, 0.004));   // the palm
        [[0.031, 0.072, 0.0105], [0.011, 0.08, 0.011], [-0.009, 0.075, 0.0105], [-0.027, 0.06, 0.0092]].forEach(([z, len, r], k) => {   // the fingers
          const a1 = 0.12 + 0.05 * k, a2 = a1 + 0.38, d1 = new Vector3(-Math.sin(a1), -Math.cos(a1), 0), d2 = new Vector3(-Math.sin(a2), -Math.cos(a2), 0);
          const p0 = new Vector3(-0.004, -0.675, z * 0.95), p1 = p0.clone().addScaledVector(d1, len * 0.55);
          parts.push(bone(r, len * 0.55, p0, d1), bone(r * 0.9, len * 0.45, p1, d2));
        });
        const t1 = new Vector3(-0.35, -0.62, 0.7).normalize(), t2 = new Vector3(-0.45, -0.85, 0.3).normalize(), t0 = new Vector3(-0.008, -0.61, 0.03);   // the thumb
        parts.push(bone(0.0125, 0.04, t0, t1), bone(0.011, 0.034, t0.clone().addScaledVector(t1, 0.04), t2));
        const g = mergeGeometries(parts.map((q) => tint(plain(q), COL.skin)));
        return side > 0 ? g : mirrorX(g);
      };
      const fore = (lev, side) => mergeGeometries([
        tint(lev ? plain(new CylinderGeometry(0.079, 0.064, 0.56, 16, 1, true)) : uvScale(new CylinderGeometry(0.079, 0.064, 0.56, 16, 1, true), 2, 2), lev ? COL.levite : COL.linen).translate(0, -0.28, 0),
        tint(lev ? plain(new SphereGeometry(0.08, 14, 8)) : uvScale(new SphereGeometry(0.08, 14, 8), 2, 2), lev ? COL.levite : COL.linen),   // the elbow
        handG(side)]);
      const headG = (() => {
        const g = new SphereGeometry(1, 48, 40), p = g.attributes.position, uv = g.attributes.uv;
        for (let i = 0; i < p.count; i++) {
          const [x, y, z] = headDef(p.getX(i), p.getY(i), p.getZ(i));
          uv.setXY(i, z > -0.05 ? 0.5 + x * 0.5 : 0.015, z > -0.05 ? 0.5 + y * 0.5 : 0.5);
          p.setXYZ(i, x * HD.a, y * HD.b + HD.y, z * HD.c + HZ);
        }
        g.computeVertexNormals();
        return g;
      })();
      // the face painted (projected from before; the back of the head plain skin): the eyes with their lids, the brows' hairs, the
      // nose's shades, the mouth - the lower lip seen under the moustache (the user: "אין פה")
      MAT.face = std(0xffffff, { roughness: 0.72, map: (() => {
        const cv = document.createElement("canvas");
        cv.width = cv.height = 256;
        const c = cv.getContext("2d");
        let gr = c.createRadialGradient(128, 128, 20, 128, 140, 150);
        gr.addColorStop(0, "#dcb38f"); gr.addColorStop(0.6, "#cba17d"); gr.addColorStop(1, "#b98f6c");
        c.fillStyle = gr; c.fillRect(0, 0, 256, 256);
        for (const s of [-1, 1]) {   // the cheeks' warmth
          gr = c.createRadialGradient(128 + s * 60, 160, 2, 128 + s * 60, 160, 32);
          gr.addColorStop(0, "rgba(205,115,95,0.3)"); gr.addColorStop(1, "rgba(205,115,95,0)");
          c.fillStyle = gr; c.fillRect(0, 0, 256, 256);
        }
        for (const s of [-1, 1]) {   // the eyes
          const ex = 128 + s * 42, ey = 131;
          gr = c.createRadialGradient(ex, ey, 2, ex, ey, 22);
          gr.addColorStop(0, "rgba(95,60,45,0.38)"); gr.addColorStop(1, "rgba(95,60,45,0)");
          c.fillStyle = gr; c.fillRect(ex - 30, ey - 26, 60, 52);
          c.fillStyle = "#ece4d8"; c.beginPath(); c.ellipse(ex, ey, 11.5, 4.8, 0, 0, Math.PI * 2); c.fill();
          c.fillStyle = "#5c412b"; c.beginPath(); c.arc(ex - s, ey + 0.4, 4.4, 0, Math.PI * 2); c.fill();
          c.fillStyle = "#130c07"; c.beginPath(); c.arc(ex - s, ey + 0.4, 2, 0, Math.PI * 2); c.fill();
          c.fillStyle = "rgba(255,255,255,0.85)"; c.beginPath(); c.arc(ex - s - 1.3, ey - 1.1, 0.9, 0, Math.PI * 2); c.fill();
          c.strokeStyle = "#3a271b"; c.lineWidth = 2.4; c.beginPath(); c.ellipse(ex, ey + 1.2, 12.4, 6.4, 0, Math.PI * 1.07, Math.PI * 1.93); c.stroke();
          c.strokeStyle = "rgba(95,62,46,0.5)"; c.lineWidth = 1; c.beginPath(); c.ellipse(ex, ey - 1, 11.4, 5.4, 0, Math.PI * 0.12, Math.PI * 0.88); c.stroke();
          c.strokeStyle = "rgba(125,85,64,0.4)"; c.lineWidth = 1; c.beginPath(); c.ellipse(ex, ey - 3.5, 13, 9, 0, Math.PI * 1.12, Math.PI * 1.88); c.stroke();
        }
        let sd = 99;
        const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
        c.lineWidth = 1.3;
        for (const s of [-1, 1]) for (let k = 0; k < 46; k++) {   // the brows: hairs, grey and white
          const u = rnd(), x0 = 128 + s * (24 + u * 34), y0 = 116 - Math.sin(u * Math.PI) * 4 + (rnd() - 0.5) * 4;
          c.strokeStyle = rnd() < 0.55 ? "rgba(232,229,222,0.92)" : "rgba(140,130,120,0.85)";
          c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + s * (5 + rnd() * 4), y0 - 1.5 - rnd() * 1.5); c.stroke();
        }
        for (const s of [-1, 1]) {   // the nose's shades, the nostrils
          gr = c.createLinearGradient(128 + s * 3, 0, 128 + s * 15, 0);
          gr.addColorStop(0, "rgba(120,78,58,0)"); gr.addColorStop(1, "rgba(120,78,58,0.3)");
          c.fillStyle = gr; c.fillRect(Math.min(128 + s * 3, 128 + s * 15), 126, 12, 36);
          c.fillStyle = "rgba(68,38,28,0.62)"; c.beginPath(); c.ellipse(128 + s * 7, 162, 3.6, 2, s * 0.3, 0, Math.PI * 2); c.fill();
        }
        c.strokeStyle = "rgba(120,78,58,0.25)"; c.lineWidth = 1;   // the forehead's lines
        for (const y of [90, 99]) { c.beginPath(); c.moveTo(96, y); c.quadraticCurveTo(128, y - 4, 160, y); c.stroke(); }
        // the mouth: the upper lip (mostly under the moustache), the line between, the lower lip with its light
        c.fillStyle = "#9b5a4d"; c.beginPath(); c.ellipse(128, 180.5, 15, 3.2, 0, 0, Math.PI * 2); c.fill();
        c.fillStyle = "#b06c5e"; c.beginPath(); c.ellipse(128, 187.5, 14.5, 5, 0, 0, Math.PI * 2); c.fill();
        c.fillStyle = "rgba(255,226,210,0.35)"; c.beginPath(); c.ellipse(127, 186.3, 7, 1.5, 0, 0, Math.PI * 2); c.fill();
        c.strokeStyle = "#4b231d"; c.lineWidth = 1.7; c.beginPath(); c.moveTo(112.5, 183.2); c.quadraticCurveTo(128, 185.6, 143.5, 183.2); c.stroke();
        const tx = new CanvasTexture(cv);
        tx.colorSpace = SRGBColorSpace;
        tx.anisotropy = 8;
        return tx;
      })() });
      // the beard (the user: "הזקן... לא מחובר לאוזניים, יצוק מדי... אין פה"): of hairs, not a cast - from before the ears (joined there
      // to the hair) and from under the cheekbones, over the jaw and the chin, from below the lower lip (the mouth seen), hanging to the
      // upper chest and lying on what is there (env: the least depth before the body at x, y); the moustache over the upper lip; the
      // hair below the hat round the back of the head, the ears out of it. Locks in all of it; its edges of single hairs (beardTex)
      const sheet = (rows, uvf) => {
        const pos = [], uv = [], idx = [], NV = rows.length, NU = rows[0].length;
        rows.forEach((row, j) => row.forEach((p, i) => { pos.push(p.x, p.y, p.z); uv.push(...uvf(i, j)); }));
        for (let j = 0; j < NV - 1; j++) for (let i = 0; i < NU - 1; i++) { const a = j * NU + i, b = a + NU; idx.push(a, b, a + 1, b, b + 1, a + 1); }
        const g = new BufferGeometry();
        g.setAttribute("position", new Float32BufferAttribute(pos, 3));
        g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        g.computeVertexNormals();
        return g;
      };
      const beardG = (env) => {
        const geos = [], TH = 1.62, NT = 44, NS = 12, NK = 18;
        const lock = (th, u) => 0.0055 * Math.sin(th * 21 + 1.7 * Math.sin(th * 6)) * (0.35 + u);
        const top = (th) => { const a = Math.abs(th); return a > 1.45 ? lerp(0.14, -0.28, smooth(clamp((a - 1.45) / 0.2, 0, 1))) : a > 1.25 ? 0.14 : a > 0.6 ? lerp(-0.3, 0.14, smooth((a - 0.6) / 0.65)) : lerp(-0.54, -0.3, smooth(a / 0.6)); };
        const jaw = (th) => { const a = Math.abs(th); return a > 1.5 ? -0.45 - (a - 1.5) * 0.8 : lerp(-0.95, -0.45, Math.pow(smooth(a / 1.5), 1.2)); };
        const rows = [];
        for (let j = 0; j <= NS; j++) {   // over the face
          const s = j / NS, row = [];
          for (let i = 0; i <= NT; i++) {
            const th = lerp(-TH, TH, i / NT), sb = smooth(clamp((Math.abs(th) - 1.15) / 0.3, 0, 1)) * (1 - s), p = headAt(th, lerp(top(th), jaw(th), s), (lerp(0.005, 0.03, smooth(s)) + lock(th, s)) * (1 - 0.6 * sb)), zmin = env(p.x, p.y);
            if (zmin > 0 && p.z < zmin + 0.012) p.z = zmin + 0.012;
            row.push(p);
          }
          rows.push(row);
        }
        const J = rows[NS];
        for (let k = 1; k <= NK; k++) {   // hanging below the jaw
          const u = k / NK, row = [];
          for (let i = 0; i <= NT; i++) {
            const th = lerp(-TH, TH, i / NT), q = th / TH, e = Math.sin(q * HP), cq = Math.cos(q * HP);
            const p = J[i].clone().lerp(new Vector3(0.075 * q, 2.545 + 0.08 * q * q, 0.21 + HZ - 0.06 * q * q), Math.pow(u, 0.9));
            p.z += 0.04 * Math.sin(Math.PI * u) * cq + lock(th, 1) * cq * 1.2;
            p.x += 0.03 * Math.sin(Math.PI * u) * e + lock(th, 1) * e * 1.2;
            const tuck = smooth(clamp((Math.abs(q) - 0.78) / 0.22, 0, 1)) * Math.sin(Math.PI * u);   // its sides drawn back toward the neck
            p.x = lerp(p.x, Math.sign(q) * 0.085, 0.45 * tuck); p.z = lerp(p.z, HZ + 0.02, 0.5 * tuck);
            const zmin = env(p.x, p.y);
            if (zmin > 0 && p.z < zmin + 0.014) p.z = zmin + 0.014;
            row.push(p);
          }
          rows.push(row);
        }
        geos.push(sheet(rows, (i, j) => [(i / NT) * 5, j <= NS ? (j / NS) * 0.45 : 0.45 + ((j - NS) / NK) * 0.55]));
        {   // the moustache: from under the nose over the upper lip, its ends down past the mouth into the beard; its hairs falling
          const NU = 24, NV = 6, mrows = [];
          for (let j = 0; j <= NV; j++) {
            const t = j / NV, row = [];
            for (let i = 0; i <= NU; i++) {
              const xs = lerp(-0.36, 0.36, i / NU), a = Math.abs(xs) / 0.36, ys = lerp(-0.285 - 0.1 * a * a, -0.4 - 0.2 * Math.pow(a, 1.6), t);
              row.push(headAt(Math.asin(clamp(xs / Math.sqrt(1 - ys * ys), -1, 1)), ys, 0.005 + 0.011 * Math.sin(Math.PI * Math.min(1, t * 1.25)) * (1 - 0.4 * a)));
            }
            mrows.push(row);
          }
          geos.push(sheet(mrows, (i, j) => [(i / NU) * 2.2, 0.62 + (j / NV) * 0.38]));
        }
        {   // the hair, below the hat round the back (to the nape) and the sides (to the ears' lobes), the ears out of it
          const NTh = 34, NSh = 10, hrows = [], huv = [];
          for (let j = 0; j <= NSh; j++) {
            const s = j / NSh, row = [];
            for (let i = 0; i <= NTh; i++) {
              const th = lerp(1.22, Math.PI * 2 - 1.22, i / NTh), wb = smooth(clamp(1 - Math.abs(th - Math.PI) / 1.9, 0, 1));
              const ys = lerp(lerp(0.42, 0.32, wb), lerp(-0.45, -0.82, wb), s), ear = Math.min(1, gs(th - HP, ys + 0.02, 0.34, 0.42) + gs(th - 3 * HP, ys + 0.02, 0.34, 0.42));
              row.push(headAt(th, ys, (lerp(0.009, 0.015, s) + 0.6 * lock(th * 1.3, s)) * (1 - 0.9 * ear)));
              const ew = smooth(clamp(ear * 2.2, 0, 1));
              (huv[j] = huv[j] || []).push([(i / NTh) * 6, lerp(0.3 + s * 0.66, 0.012 + s * 0.05, ew)]);
            }
            hrows.push(row);
          }
          geos.push(sheet(hrows, (i, j) => huv[j][i]));
        }
        return mergeGeometries(geos);
      };
      // what the beard lies on: the tunic; the high priest's - the robe, and the breastplate on it (in his torso, scaled ZS)
      const MEIL = [[0.3, 0.456], [0.55, 0.45], [1.3, 0.4], [1.85, 0.36], [2.3, 0.39], [2.52, 0.405], [2.62, 0.395], [2.68, 0.37], [2.74, 0.31], [2.83, 0.155]];
      const meilR = (y) => { for (let i = 1; i < MEIL.length; i++) if (y <= MEIL[i][0]) return lerp(MEIL[i - 1][1], MEIL[i][1], clamp((y - MEIL[i - 1][0]) / (MEIL[i][0] - MEIL[i - 1][0]), 0, 1)); return 0; };
      const envK = (x, y) => { if (y > 2.8) return -1; const R = robeR(y); return ZS * Math.sqrt(Math.max(0, R * R - x * x)); };
      const envH = (x, y) => { if (y > 2.83) return -1; const R = meilR(y); let z = ZS * Math.sqrt(Math.max(0, R * R - x * x)); if (y < 2.53 && Math.abs(x) < 0.26) z = Math.max(z, ZS * 0.466); return z; };
      // the hairs: a body whole between its two ends, single hairs at the top (where it begins on the face) and at the bottom (its end)
      const beardTex = (() => {
        const W2 = 128, H2 = 512, cv = document.createElement("canvas");
        cv.width = W2; cv.height = H2;
        const c = cv.getContext("2d");
        let sd = 4321;
        const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
        c.fillStyle = "#eeece7"; c.fillRect(0, 0.07 * H2, W2, 0.83 * H2);
        for (let k = 0; k < 1300; k++) {
          const x0 = rnd() * W2, y0 = (rnd() < 0.55 ? rnd() * 0.12 : rnd() * 0.05) * H2, y1 = (0.86 + rnd() * 0.14) * H2, g = (178 + rnd() * 77) | 0, ph = rnd() * 6;
          c.strokeStyle = "rgba(" + g + "," + (g - 3) + "," + (g - 8) + "," + (0.55 + rnd() * 0.45).toFixed(2) + ")";
          c.lineWidth = 0.7 + rnd() * 1.1;
          c.beginPath();
          for (let y = y0; y <= y1; y += 8) { const x = x0 + Math.sin(y * 0.022 + ph) * 3; if (y === y0) c.moveTo(x, y); else c.lineTo(x, y); }
          c.stroke();
        }
        const tx = new CanvasTexture(cv);
        tx.wrapS = RepeatWrapping;
        tx.colorSpace = SRGBColorSpace;
        tx.anisotropy = 8;
        return tx;
      })();
      MAT.beard = [COL.beardW, COL.beardG, COL.beardD].map((col) => std(col, { map: beardTex, alphaTest: 0.42, side: DoubleSide, roughness: 0.92, bumpMap: beardTex, bumpScale: 0.6 }));
      // the feet, bare (Zevachim 24a: nothing between the feet and the floor): a man's foot in its length, the toes, the ankle up into the
      // hem; the left foot (its great toe within, -x), the right mirrored
      const footG = (() => {
        const g = new SphereGeometry(1, 18, 12), p = g.attributes.position;
        for (let i = 0; i < p.count; i++) {
          let x = p.getX(i), y = p.getY(i);
          const z = p.getZ(i), f = Math.max(0, z);
          if (y < 0) y *= 0.25;                                // the sole flat
          y *= 1 - 0.5 * f;                                    // low toward the toes
          x *= 1 + 0.22 * f - 0.25 * Math.max(0, -z);          // broad at the ball, narrow at the heel
          p.setXYZ(i, x * 0.068, 0.012 + (y + 0.25) * 0.055, z * 0.215 + 0.12);
        }
        g.computeVertexNormals();
        const parts = [g, new CylinderGeometry(0.047, 0.052, 0.2, 12).translate(0, 0.14, -0.02)];   // the ankle
        [[-0.042, 0.315, 0.016], [-0.02, 0.33, 0.013], [0.0, 0.333, 0.012], [0.019, 0.327, 0.0115], [0.037, 0.315, 0.011]].forEach(([x, z, r]) => parts.push(new SphereGeometry(r, 8, 6).scale(1, 0.8, 1.3).translate(x, 0.022, z)));   // the toes
        return mergeGeometries(parts);
      })();
      // the garments by the sleepers' heads (Tamid 1:1 "פושטין ומקפלין ומניחין אותן"; the Gemara 27a: "כנגד ראשיהן", not under them - "תיפוק
      // ליה משום איסורא דכלאים"): the folded linen and the hat; the belt rolled on them (its own mesh, roll)
      const pileGeo = () => mergeGeometries([
        tint(uvScale(new BoxGeometry(0.44, 0.1, 0.34), 2, 2), COL.linen).translate(0, 0.05, 0),
        tint(plain(new SphereGeometry(0.11, 10, 6, 0, Math.PI * 2, 0, HP).scale(1, 0.75, 1)), COL.hat).translate(0.08, 0.1, 0.07)
      ]);
      const G = {
        K: bodyGeo("K"), H: bodyGeo("H"), HK: bodyGeo("HK"), L: bodyGeo("L"), head: headG, beard: { K: beardG(envK), H: beardG(envH) }, pile: pileGeo(), belt: beltG,
        roll: uvScale(new CylinderGeometry(0.045, 0.045, 0.26, 12).rotateZ(HP), 4, 1),
        upperP: sleeve(false), upperL: sleeve(true), foreP: { 1: fore(false, 1), "-1": fore(false, -1) }, foreL: { 1: fore(true, 1), "-1": fore(true, -1) },
        foot: { 1: footG, "-1": mirrorX(footG.clone()) }
      };
      const figs = {};
      // TAMID_FIG_207 (the user, 12.11.2026 19:28: "שים לב להתאים את הדמויות לאלו שעשית בשרשור הזה"): the priests and the Levites are
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
        const handW = (side) => sc(K.at(K.handRaw(side), 0, -0.045, 0), FS);   // BIRKAT_HANDS_A2: the hand in its own wrist frame
        const foot = (side) => sc(K.footGeo(side).translate(-side * 0.1, 0, 0), FS);
        const P = { sx: K.SH_X * FS, sy: K.SH_Y * FS, up: K.UP * FS, fo: K.FORE * FS };      // the priest's own arm
        const H = { sx: 0.39, sy: 2.6, up: 0.6, fo: 0.66 };                                     // the high priest's: as this body (his garments)
        return {
          P, H,
          upP: upper(P.up), foP: fore(P.fo), handP: { 1: hand(1, P.fo), "-1": hand(-1, P.fo) }, handW: { 1: handW(1), "-1": handW(-1) },
          upH: upper(H.up), foH: fore(H.fo), handH: { 1: hand(1, H.fo), "-1": hand(-1, H.fo) },
          foot: { 1: foot(1), "-1": foot(-1) },
          // KIDDUSH_FOOT_213: the leg that rises - the thigh under the kutonet (along +y, 1 long: scaled to its length), the knee, the shin
          thigh: W1(new CylinderGeometry(0.084 * FS, 0.1 * FS, 1, 12, 1, true).translate(0, 0.5, 0)),
          knee: W1(K.sph(0.09 * FS, 0.09 * FS, 0.09 * FS, 12, 8)),
          shin: W1(new CylinderGeometry(0.04 * FS, 0.05 * FS, 1, 10, 1, true).translate(0, 0.5, 0)),
          neck: sc(K.at(new CylinderGeometry(0.066, 0.072, 0.09, 12), 0, 1.925, 0), 1),
          mLev: K.mat(COL.levite, { vertexColors: true, roughness: 0.9 }), mLevCap: K.mat(COL.levCap, { roughness: 0.9 }),
          // HAND_A2 (the user: "הידיים נראות מזעזע"): the kit's hand (shared/frag/hand.js) in its poses - rest, open (the blessing), flat
          // (kiddush), grip (round a handle), point ("הצביעו") - in the wrist's frame; the grip's place: the middle of the closed hand
          hands: K.handWr ? Object.fromEntries(["rest", "open", "flat", "grip", "fist", "point", "bless"].map((k) => [k, { 1: K.handWr(1, k), "-1": K.handWr(-1, k) }])) : null,
          gripAt: K.handAt ? { 1: K.handAt(1, "grip"), "-1": K.handAt(-1, "grip") } : null,
          // HAND_GRIP_A2: the closed hand's rings - round a handle (grip) and round a thin rod (fist): their middles and their ways
          ring: K.handAt ? Object.fromEntries(["grip", "fist"].map((k) => [k, { at: { 1: K.handAt(1, k), "-1": K.handAt(-1, k) }, ax: { 1: K.handAt(1, k + "Ax"), "-1": K.handAt(-1, k + "Ax") } }])) : null
        };
      })() : null;
      const makeFigKit = (id, kind) => {
        const K = KIT, FS = K.FS, lev = kind === "L", hp = kind === "H", n = Object.keys(figs).length;
        // HP_KIT_A2: the high priest - the one construction of both houses (SH.hpKit, shared/frag/hp-kit.js: his body, his eight
        // garments and their readings - the ephod, the mitznefet - on the kit's head, sleeves, hands and feet)
        if (hp && SH.hpKit) {
          const F = SH.hpKit().figure();
          F.g.visible = false;
          group.add(F.g);
          const f = { id, g: F.g, lean: F.lean, bend: null, legs: null, A: F.A, L: F.L, R: F.R, fl: F.fl, fr: F.fr, levite: false, kind, body: F.body, belt: F.belt, st: null, tag: null, kit: true, neck: null, upper: null, garb: F.garb };
          figs[id] = f;
          return f;
        }
        const g = new Group(), lean = new Group();
        g.add(lean);
        let body, belt = null, bend = null, neckG = null, upG = null;   // NIGHT_SIT_305: the neck's pivot; the part above the waist
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
          const hh = K.headOn(hs, K.HEAD_Y, K.mBeards[0], 1);
          if (K.tefOn) K.tefOn(hh);   // TEFILLIN_A2: "שערו היה נראה בין ציץ למצנפת, ששם מניחין תפילין" (Zevachim 19a)
        } else {
          const S = new Group();
          S.scale.setScalar(FS);
          lean.add(S);
          // KIDDUSH_BEND_212: the robe in two at the waist (55-payis.js WAIST) - all above it in `bend`, turned there (the legs upright)
          const WY = (K.WAIST || 0) * FS;
          bend = new Group();
          bend.position.y = WY;
          lean.add(bend);
          const U = new Group();
          U.scale.setScalar(FS);
          U.position.y = -WY;
          bend.add(U);
          body = new Mesh(K.gRobeLow || K.gRobeBody, lev ? KG.mLev : K.mRobe);
          body.castShadow = true;
          S.add(body);
          if (K.gRobeUp) { const up = new Mesh(K.gRobeUp, lev ? KG.mLev : K.mRobe); up.castShadow = true; U.add(up); }
          // NIGHT_SIT_305: the neck, the head and its cap or hat in one group, turned at the neck's foot (NK) - a guard asleep bows his
          // head (applyFig: headA). Not turned, all is where it was.
          const NKY = 1.86, NK = new Group();
          NK.position.y = NKY;
          U.add(NK);
          neckG = NK; upG = U;
          { const nk = new Mesh(KG.neck, K.mSkin); nk.position.y = -NKY; NK.add(nk); }
          if (!lev) { belt = new Mesh(K.gSash, TM.belt === "white" ? K.mSashWhite : K.mSashDyed); belt.userData.kit = true; U.add(belt); }
          const hg = K.headOn(NK, K.HEAD_Y - NKY, K.mBeards[n % K.mBeards.length], n);
          hg.rotation.set(0, (((n * 0.618) % 1) - 0.5) * 0.4, 0);   // every man a little different (a fixed turn, no chance)
          // TEFILLIN_A2: the head's tefillin on every priest and Levite (the Levite's cap set back, that they be seen before it)
          if (lev) { const cap = new Mesh(K.gCap, KG.mLevCap); cap.position.y = K.HEAD_Y - NKY; cap.rotation.x = -0.52; NK.add(cap); }
          else { const hat = new Mesh(K.gHat, K.mHat); hat.position.y = K.HAT_Y - NKY; hat.rotation.y = hg.rotation.y + (((n * 0.37) % 1) - 0.5) * 0.9; NK.add(hat); }
          if (K.tefOn) K.tefOn(hg);
        }
        const A = hp ? KG.H : KG.P, armMat = lev ? KG.mLev : K.mRobe;
        const arm = (side) => {   // side +1 = the left (+x), -1 = the right
          const sh = new Group();
          const by = bend ? bend.position.y : 0;   // KIDDUSH_BEND_212: the arms go with the body above the waist
          sh.position.set(side * A.sx, A.sy - by, 0);
          (bend || lean).add(sh);
          // LEVITE_SLEEVE_A2 (the user's decision 96, corrected): the sleeve is not rolled up - the arm tefillin under it (K.tefArm, below)
          sh.add(new Mesh(hp ? KG.upH : KG.upP, armMat));
          const el = new Group();
          el.position.y = -A.up;
          sh.add(el);
          el.add(new Mesh(hp ? KG.foH : KG.foP, armMat));
          // BIRKAT_HANDS_A2: the hand on a wrist joint (it turns and bends for the priestly blessing - applyFig)
          const wr = new Group();
          wr.position.y = -A.fo;
          el.add(wr);
          wr.add(wr.userData.hand = new Mesh(KG.handW[side], K.mHand || K.mSkin));
          const grip = new Group();
          // HAND_A2: where a handle lies in the closed hand (until now 0.08 under the wrist and 0.03 before it - by the small hand)
          if (KG.gripAt) { grip.position.set(KG.gripAt[side].x, -A.fo + KG.gripAt[side].y, KG.gripAt[side].z); grip.userData.fo = A.fo; }
          else grip.position.set(0, -(A.fo + 0.08), 0.03);
          el.add(grip);
          return { sh, el, grip, wr };
        };
        const L = arm(1), R = arm(-1);
        // TEFILLIN_A2 (the user, 00:58: "תפילין גם ללויים... של ראש ושל יד"): the Levite's arm tefillin, on his left arm (L)
        // LEVITE_SLEEVE_A2: the box a bulge in the sleeve over it, the strap seen only where it comes out by the hand
        if (lev && K.tefArm) K.tefArm(L.sh, L.el, A.up, A.fo, 0.07 * FS, 0.056 * FS, armMat, L.wr, 1);
        const fl = new Mesh(KG.foot[1], K.mSkin), fr = new Mesh(KG.foot[-1], K.mSkin);
        fl.position.x = 0.1 * FS;
        fr.position.x = -0.1 * FS;
        g.add(fl, fr);
        // KIDDUSH_FOOT_213 (the user, 16.11.2026 17:14): a leg that rises for kiddush, on each side - hidden while he stands (his own foot)
        let legs = null;
        if (bend) {
          legs = {};
          for (const side of [1, -1]) {
            const lg = new Group();
            lg.visible = false;
            lean.add(lg);
            const th = new Mesh(KG.thigh, lev ? KG.mLev : K.mRobe), kn = new Mesh(KG.knee, lev ? KG.mLev : K.mRobe);
            const sn = new Mesh(KG.shin, K.mSkin), ft = new Mesh(KG.foot[side], K.mSkin);
            for (const m of [th, kn, sn, ft]) { m.castShadow = true; lg.add(m); }
            legs[side] = { g: lg, th, kn, sn, ft };
          }
        }
        g.visible = false;
        group.add(g);
        const f = { id, g, lean, bend, legs, A, L, R, fl, fr, levite: lev, kind, body, belt, st: null, tag: null, kit: true, neck: neckG, upper: upG };   // NIGHT_SIT_305
        figs[id] = f;
        return f;
      };
      const makeFig = (id, kind) => {
        if (KIT) return makeFigKit(id, kind);   // TAMID_FIG_207
        const lev = kind === "L", g = new Group(), lean = new Group();
        g.add(lean);
        const body = new Mesh(G[kind], MAT.fig);
        lean.add(new Mesh(G.head, MAT.face));
        const bd = new Mesh(kind === "H" ? G.beard.H : G.beard.K, MAT.beard[kind === "H" ? 0 : Object.keys(figs).length % MAT.beard.length]);   // the beards' shades by turns
        bd.castShadow = true;
        lean.add(bd);
        body.castShadow = true;
        lean.add(body);
        let belt = null;
        if (!lev) { belt = new Mesh(G.belt, MAT.beltK); belt.castShadow = true; lean.add(belt); }
        const arm = (side) => {   // side +1 = the left (+x), -1 = the right
          const sh = new Group();
          sh.position.set(side * 0.39, 2.6, 0);
          lean.add(sh);
          sh.add(new Mesh(lev ? G.upperL : G.upperP, MAT.fig));
          const el = new Group();
          el.position.y = -0.6;
          sh.add(el);
          el.add(new Mesh(lev ? G.foreL[side] : G.foreP[side], MAT.fig));
          const grip = new Group();
          grip.position.set(0, -0.66, 0.03);
          el.add(grip);
          return { sh, el, grip };
        };
        const L = arm(1), R = arm(-1);
        const fl = new Mesh(G.foot[1], MAT.skin), fr = new Mesh(G.foot[-1], MAT.skin);
        fl.castShadow = fr.castShadow = true;
        fl.position.x = 0.1;
        fr.position.x = -0.1;
        g.add(fl, fr);
        g.visible = false;
        group.add(g);
        const f = { id, g, lean, L, R, fl, fr, levite: lev, kind, body, belt, st: null, tag: null };
        figs[id] = f;
        return f;
      };
      for (const id of FIG_IDS) makeFig(id, "K");
      for (const id of LEV_IDS) makeFig(id, "L");
      // TZOARIM_A2 (the user's decision 69): the Levites' little ones - "אין קטן נכנס לעזרה לעבודה אלא בשעה שהלוים עומדים בשיר... רבי
      // אליעזר בן יעקב אומר, אין עולין למנין, ואין עומדים על הדוכן, אלא בארץ היו עומדין, וראשיהן מבין רגלי הלוים, וצוערי הלוים היו
      // נקראין" (Arachin 2:6; 84:12). Three boys, a Levite's figure at 0.72, without beard (their hair a plain cap of hair) and without
      // tefillin; their age and size - model choices
      for (const id of LEV_KIDS) {
        const f = makeFig(id, "L");
        f.g.scale.setScalar(0.72);
        f.kid = true;
        const heads = [];
        f.g.traverse((o) => { if (o.isMesh && o.name === "tefillin-rosh") heads.push(o); });
        for (const m of heads) { const hg = m.parent; m.removeFromParent(); if (KIT && KIT.headBare) { KIT.headBare(hg, KID_HAIR); continue; } const hair = hg.children[2]; if (hair && hair.isMesh) { hair.visible = false; const head = hg.children[0]; head.geometry.computeBoundingBox(); const bb = head.geometry.boundingBox, c = bb.getCenter(new Vector3()), sz = bb.getSize(new Vector3()); const sc = new Mesh(new SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, 1.5), KID_HAIR); sc.scale.set(sz.x * 0.53, sz.y * 0.53, sz.z * 0.54); sc.rotation.x = -0.42; sc.position.set(c.x, c.y + sz.y * 0.04, c.z - sz.z * 0.03); hg.add(sc); } }   // the hair over the crown and the back, the forehead and the face bare
        const arm = [];
        if (KIT && KIT.mTef) f.g.traverse((o) => { if (o.isMesh && o.name === "tefillin-bulge") arm.push(o); else if (o.isMesh && o.material === KIT.mTef) arm.push(o.parent && o.parent.isGroup && o.parent.children.every((c) => c.material === KIT.mTef) ? o.parent : o); });
        for (const o of new Set(arm)) o.removeFromParent();
      }
      // NIGHT_WATCH_305: the night's watch - Ish Har HaBayit (his tribe is not said: plain clothes in a colour of his own, as the
      // officers' "not said"), four Levite guards, and Ben Bavi and Gevini - priests ("בן בביי, שם כהן", Rabbeinu Elyakim on Yoma 23a;
      // "כהן ששמו גביני", the Bartenura on Tamid 3:8), in the priests' garments without the avnet: "לפיכך לובשם ביום עבודתו ואפילו
      // שלא בשעת עבודה, חוץ מן האבנט מפני שהוא שעטנז" (the Rambam, Klei HaMikdash 8:11)
      for (const id of ["bbv", "gev"]) { const f = makeFig(id, "K"); if (f.belt) f.belt.visible = false; }
      for (const id of ["ihb", "gk", "gn", "gc", "gp"]) makeFig(id, "L");
      if (KG) { const mI = KG.mLev.clone(); mI.color.setHex(0x56606e); figs.ihb.g.traverse((o) => { if (o.isMesh && o.material === KG.mLev) o.material = mI; }); }
      // ---- the high priest in his eight (Rambam, Klei HaMikdash 9 - 10; 10:3 "לובש המעיל. ועל המעיל האפוד והחשן וחוגר בחשב האפוד על
      // המעיל מתחת החשן... ואחר כך צונף במצנפת וקושר הציץ למעלה מן המצנפת ושערו היה נראה בין ציץ למצנפת ושם היה מניח תפלין"):
      //  the robe "כלו תכלת... ואין לו בית יד" (9:3), to the feet (the Ramban 28:31 "עד רגלי האדם"; its opening not drawn), on its hem
      //   "פעמון ורמון פעמון ורמון": 72 bells of gold and as many pomegranates of the three wools (9:4);
      //  the ephod "רחבו כרחב גבו של אדם מכתף לכתף. וארכו מכנגד אצילי הידים מאחוריו עד הרגלים", its band "קשור על לבו תחת החשן", its two
      //   shoulders with a square shoham in gold on each (9:9 - 9:11; the stones' colour a model choice; the names on them not drawn);
      //  the breastplate "זרת על זרת... ארבעה טורים של אבן המפרשים בתורה כל אבן מהן מרבע ומשקע בבית של זהב" (9:6), "על לבו בשוה"
      //   (9:11), the stones of Shemot 28:17 - 20 in their rows, the tribes' names on them "כתולדותם... על האדם ראובן ועל ישפה בנימין" (9:7;
      //   Rashi 28:10, 28:21) and above and below them the Gemara's words (Yoma 73b; the user: as the Gemara); the
      //   first of a row at the viewer's right (model choice: as it is read); the stones' colours are not in the verse - a model choice,
      //   only to tell them apart; the chains of gold from its upper rings to the shoulders, the cords of techelet from its lower rings
      //   under the arms to the ephod's (9:8 - 9:11);
      //  the tzitz "טס של זהב רחב שתי אצבעות ומקיף מאזן לאזן... קדש מלמטה לה' מלמעלה" (9:1);
      //  the mitznefet - TM.mitz: Rashi "כמין כפת כובע" (28:4) "למעלה בגבה הראש ואינה עמקה לכנס בה כל הראש עד המצח", with his three
      //   cords, the middle one over it (28:37); or the Ramban "כעין צניף שצונף בו את ראשו, מגלגל ומחזיר... כפל על כפל" (28:31; the Rambam
      //   8:2 "כמי שלופף על השבר"), with the Rambam's one cord "נקשר... כנגד הערף" (9:2) "למעלה מן המצנפת" (10:3)
      // HP_KIT_A2: his eight garments - buildHP, its stones and its textures - are now in shared/frag/hp-kit.js (SH.hpKit), one
      // construction for both houses; the readings as before (TM.ephod, TM.mitz - applyGarb)
      const hpGarb = makeFig("hp", "H").garb || null;
      // ---- the sleepers of Beit HaMoked (Tamid 1:1): the elders on the stone benches ("רובדין של אבן", 30-courts.js - MOKED_WIDE_211,
      // FLOOR_211: the lower step x -33..-31 top 17, the upper -33..-32 top 18, z -69.5..-65.5, and the same on the east; the floor
      // 16), the young on the floor by the hearth, each
      // on his own garment, covered in his own clothes
      const sleepers = new Group(), piles = [];
      group.add(sleepers);
      {
        const body = new CapsuleGeometry(0.42, 2.0, 4, 10).rotateX(HP), bodyS = new CapsuleGeometry(0.4, 0.95, 4, 10).rotateX(HP);
        const head = new SphereGeometry(0.2, 10, 8), capG = new SphereGeometry(0.21, 10, 6, 0, Math.PI * 2, 0, HP);
        // SLEEPERS_N3 (fix-n3, 24.11.2026 - the user: "לא רואים כהנים ישנים על הרובדים"): the four elders of the house of the father - Middot 1:8 "וזקני
        // בית אב ישנים שם" (on the rovdin) - lie where the chosen reading of "רובדין של אבן" puts them (30-courts.js ROVDIN_A2, SH.rovdin.mode): the Rosh's, the
        // Bartenura's, the Rambam's and the Tiferet Yisrael's - on the top terrace of each end wall ("וברובד העליון היו ישנים זקני הבית אב", Yachin 1:56),
        // two side by side; the Mefaresh's - each in a bed-niche in the wall. Until 4.1.0 they lay inside the terraces' stone (the terraces had grown to
        // five, and these four were still where the two old steps had been). The young - "ופרחי כהונה איש כסתו בארץ" - on the floor, as before.
        // Every elder is built twice (the terrace's and the niche's, a shorter lying figure), and the one of the chosen reading is shown (sleepersNow)
        const GEO = () => SH.rovdinGeo || { FL: F, wxW: -33, wxE: -3, d0: 4.5, ds: 0.6, n: 5, z0: -69.9, z1: -65.1, NY0: [F + 1.6, F + 4.4], NDEP: 0.9, zc: -68.8 };
        const eld = [];
        SLEEP.forEach(([x, y, z, yaw], i) => {
          const mk = (compact) => {
          const s = new Group();
          const b = new Mesh(compact ? bodyS : body, MAT.blanket[i % 4]);
          b.scale.set(1, 0.62, 1);
          b.position.y = 0.26;
          s.add(b);
          const hz = compact ? 1.05 : 1.45;
          const h = new Mesh(head, MAT.skin);
          h.position.set(0, 0.32, hz);
          s.add(h);
          const c = new Mesh(capG, MAT.cap);
          c.rotation.x = HP;
          c.position.set(0, 0.32, hz + 0.05);
          s.add(c);
          if (!compact) {
          const pl = new Mesh(G.pile, MAT.fig);   // "כנגד ראשיהן"
          pl.position.set(0, 0, 1.83);
          s.add(pl);
          const roll = new Mesh(G.roll, MAT.beltK);
          roll.position.set(-0.03, 0.143, 1.76);
          s.add(roll);
          piles.push(roll);
          }
          sleepers.add(s);
          return s;
          };
          const s = mk(false);
          s.position.set(x, y, z);
          s.rotation.y = yaw;
          if (i < 4) { const sN = mk(true); eld.push({ i, s, sN }); }
        });
        // where the elder i lies: [x, y, z, yaw] on the top terrace, or in his niche - the walkers' hint (hintY below) and the rising (RISEn) use these too
        const sleeperSpot = (i, mef) => {
          const g = GEO(), west = i < 2, sx = west ? 1 : -1, wallX = west ? g.wxW : g.wxE, k = i % 2;
          if (mef) return [wallX - sx * (g.NDEP / 2 - 0.05), g.NY0[k] + 0.2, g.zc - 0.45, 0];
          const dTop = g.d0 - g.ds * (g.n - 1);   // the top terrace's width (2.1)
          return [wallX + sx * (dTop * (k ? 0.76 : 0.26)), g.FL + g.n, -67.5 + (k ? 0.2 : -0.2), k ? Math.PI : 0];
        };
        W_sleeperSpot = sleeperSpot;
        sleepersNow = () => {
          const mef = !!(SH.rovdin && SH.rovdin.mode === "mefaresh");
          for (const e of eld) { const p = sleeperSpot(e.i, mef); e.s.visible = !mef; e.sN.visible = mef; const t = mef ? e.sN : e.s; t.position.set(p[0], p[1], p[2]); t.rotation.y = p[3]; }
        };
        sleepersNow();
        SH.sleepersNow = () => sleepersNow();   // SLEEPERS_N3: called by the rovdin switch (30-courts.js)
      }
      // ---- the lamb (Tamid 3:3): faces +z; legs that swing; bound = on its side, the legs together (4:1 "ראשו לדרום ופניו למערב")
      // LAMB_211 (the user, 14.11.2026: "את הטלאים עשית ציוריים מדי, אני רוצה אותם ממש אמיתיים"): the kit's lamb (10-core.js
      // lambKit: the animal's own build, with its joints) - the same lamb as in its chamber. Until 2.0.1: a ball, a tube and sticks.
      const lamb = (() => {
        const L = ctx2.H.lambKit().build();
        L.g.visible = false;
        group.add(L.g);
        return { g: L.g, body: L.body, legs: L.legs, head: L.head, st: null };
      })();
      // ---- the vessels and the other things: each a prop, in the world or held at a figure's grip
      const props = {};
      const prop = (id, o, grip, upright = true) => { const p = { id, o, grip: grip || { p: [0, 0, 0], r: [0, 0, 0] }, upright, st: null }; o.visible = false; group.add(o); props[id] = p; return p; };
      const mesh = (geo, mat, x = 0, y = 0, z = 0) => { const m = new Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; return m; };
      const pan = (mat) => {   // a fire pan: a shallow box with a long handle (Tamid 1:4 "מחתת הכסף"; 5:5 "לתוך של זהב")
        const g = new Group();
        g.add(mesh(new BoxGeometry(0.62, 0.12, 0.62), mat, 0, 0.06, 0.62));
        const coals = mesh(new BoxGeometry(0.5, 0.06, 0.5), MAT.ember, 0, 0.13, 0.62);
        coals.visible = false;
        g.add(coals);
        g.add(mesh(new CylinderGeometry(0.028, 0.028, 0.75, 8).rotateX(HP), mat, 0, 0.08, 0.1));   // HAND_GRIP_A2: as thick as the closed hand's ring (0.035 until now)
        g.userData.coals = coals;
        return g;
      };
      // HAND_GRIP_A2: held by the handle's end (applyProps - holdHandle)
      prop("machtaS", pan(MAT.silver), { p: [0, -0.1, 0.05], r: [0, 0, 0] }).handle = { at: [0, 0.08, -0.2], dir: [0, 0, 1] };
      prop("machtaG", pan(MAT.gold), { p: [0, -0.1, 0.05], r: [0, 0, 0] }).handle = { at: [0, 0.08, -0.2], dir: [0, 0, 1] };
      prop("teni", (() => {   // "הטני דומה לתרקב גדול של זהב" (3:6): a deep golden basket with two handles
        const g = new Group();
        g.add(mesh(new CylinderGeometry(0.32, 0.24, 0.42, 14, 1, true), MAT.gold, 0, 0.21, 0));
        g.add(mesh(new CircleGeometry(0.24, 14).rotateX(-HP), MAT.gold, 0, 0.01, 0));
        for (const s of [-1, 1]) g.add(mesh(new TorusGeometry(0.09, 0.022, 6, 10, Math.PI).rotateY(HP), MAT.gold, s * 0.32, 0.3, 0));
        const ash = mesh(new CylinderGeometry(0.28, 0.28, 0.06, 12), MAT.ash, 0, 0.3, 0);
        ash.visible = false;
        g.add(ash);
        g.userData.ash = ash;
        return g;
      })(), { p: [0, -0.32, 0.22], r: [0, 0, 0] });
      prop("kuz", (() => {   // "והכוז דומה לקיתון גדול של זהב" (3:6): a pitcher with a handle
        const g = new Group();
        g.add(mesh(new LatheGeometry([V2(0.001, 0), V2(0.17, 0.02), V2(0.21, 0.18), V2(0.16, 0.42), V2(0.1, 0.52), V2(0.13, 0.6)], 14), MAT.gold));
        g.add(mesh(new TorusGeometry(0.12, 0.022, 6, 12, Math.PI * 1.2).rotateY(HP), MAT.gold, 0, 0.36, -0.2));
        return g;
      })(), { p: [0, -0.3, 0.12], r: [0, 0, 0] });
      prop("kaf", (() => {   // "והכף דומה לתרקב גדול של זהב... והבזך היה בתוכו, מלא וגדוש קטרת. וכסוי היה לו" (6:3 / 5:4)
        const g = new Group();
        g.add(mesh(new CylinderGeometry(0.34, 0.26, 0.36, 14, 1, true), MAT.gold, 0, 0.18, 0));
        g.add(mesh(new CircleGeometry(0.26, 14).rotateX(-HP), MAT.gold, 0, 0.01, 0));
        g.add(mesh(new TorusGeometry(0.34, 0.028, 8, 32).rotateX(HP), MAT.gold, 0, 0.36, 0));   // HAND_GRIP_A2: its lip rolled - where the hand holds it (a model choice)
        const lid = new Group();
        lid.add(mesh(new SphereGeometry(0.29, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2.4), MAT.gold, 0, 0.295, 0));   // HAND_GRIP_A2: within the lip, on it (0.35 until now - over it)
        lid.add(mesh(new SphereGeometry(0.06, 8, 6), MAT.gold, 0, 0.585, 0));
        // KAF_CLOTH_A2 (the user's decision 61): "ומטוטלת היתה עליו מלמעלה" (Tamid 5:4) - as the Aruch in the Bartenura (634:180)
        // "חתיכת בגד... שהיה נתון על כסוי הבזך כמין סודר קטן לנוי", the Yachin (818:546) and the Mefaresh (2105:394) "מפה קטנה מאד כמין
        // חתיכת בגד": a small cloth lying on the cover, round its knob. Its colour and size - model choices.
        lid.add(mesh(new SphereGeometry(0.297, 18, 4, 0, Math.PI * 2, 0, 0.5), MAT.cloth, 0, 0.295, 0));
        g.add(lid);
        g.userData.lid = lid;
        return g;
      })(), { p: [0, -0.3, 0.25], r: [0, 0, 0] }).handle = { at: [0, 0.36, -0.34], dir: [1, 0, 0], dirL: [-1, 0, 0] };   // HAND_GRIP_A2: by the lip, the vessel hanging outward
      prop("bazach", (() => {   // the dish of incense, "מלא וגדוש"
        const g = new Group();
        g.add(mesh(new CylinderGeometry(0.2, 0.15, 0.1, 12), MAT.gold, 0, 0.05, 0));
        g.add(mesh(new SphereGeometry(0.17, 12, 6, 0, Math.PI * 2, 0, HP).scale(1, 0.5, 1), MAT.incense, 0, 0.1, 0));
        return g;
      })(), { p: [0, -0.06, 0.12], r: [0, 0, 0] });
      // MAGREFA_ERCHIN_A2 (the user's decision 62): the magrefa that is thrown (Tamid 5:6) as the Gemara, Arachin 11a (134:342) "היא אמה
      // וגבוהה אמה, וקתא יוצא הימנה, ועשרה נקבים היו בה" - a box of an amah, an amah high, a handle out of it, ten holes. Its breadth
      // (half an amah), its metal and the holes' places - model choices. Until now a broad blade on a handle.
      prop("magrefa", (() => {
        const g = new Group();
        g.add(mesh(new BoxGeometry(1.0, 1.0, 0.5), MAT.bronze, 0, 0, 1.2));
        const hm = new MeshStandardMaterial({ color: 0x1a120c, roughness: 1 });
        for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const h = new Mesh(new CircleGeometry(0.055, 10), hm); h.position.set(-0.36 + c * 0.18, 0.2 - r * 0.4, 1.2 + 0.252); g.add(h); }
        g.add(mesh(new CylinderGeometry(0.028, 0.028, 0.95, 8).rotateX(HP), MAT.wood, 0, 0, 0.5));   // HAND_GRIP_A2: as thick as the hand's ring (0.04 until now)
        return g;
      })(), { p: [0, 0, 0], r: [1.0, 0, 0] }, false).handle = { at: [0, 0, 0.1], dir: [0, 0, 1] };   // held by its handle's end, along the hand's ring
      props.magrefa.upright = true;   // HAND_GRIP_A2: held level, the box before him (not up in the air when the arm is bent); thrown - as it was
      prop("mizrak", (() => {   // the bowl of the blood
        // MIZRAK_SILVER_A2 (the user, on picture 37: black, as a funnel - "כלי שרת — מתכת: כסף או זהב, עם ברק"): silver that shines in the
        // dawn too - less mirror (it reflected the dark sky), its own light a little; inside and out
        const mzM = std(0xe4e8ee, { metalness: 0.5, roughness: 0.22, emissive: 0x5a6068, emissiveIntensity: 0.55, side: DoubleSide });
        // MIZRAK_A2 (the user: "הוא נראה כספל מאורך, רק מחודד בסופו"; held "ביד אחת, בידית או בגוף, איך שנראה טבעי"): the shared cone with
        // its rod (shared/frag/mizrak.js), held in one hand by the rod's end, the cone before him and a little inward; until now a broad
        // bowl with a short point, its point in the palm
        //@@include mizrak
        const bm = MAT.blood.clone();
        bm.opacity = 0.95;
        return tm_mizrak(mzM, { r: 0.17, at: "rod", handleYaw: 1.92, bloodMat: bm });
      })(), { p: [0, 0, 0.02], r: [0, 0, 0] });   // MIZRAK_A2: the rod's end in the hand
      // HAND_GRIP_A2: the thin rod (0.0085) in the closed fist (its ring 0.006 x 1.4), a little in from its end; the rod's way from its end
      // to the cone (mizrak.js: up at atan 0.42, turned by handleYaw)
      { const p = props.mizrak, a = Math.atan2(0.42, 1), hy = 1.92, d = [-Math.cos(a) * Math.cos(hy), -Math.sin(a), Math.cos(a) * Math.sin(hy)];
        p.hold = "fist"; p.handle = { at: d.map((v) => v * 0.022), dir: d }; }
      // KNIFE_A2 (the user's decision 72 e - a model choice): the slaughterer's knife in his hand - a long blade, straight, without a point,
      // and a wooden handle; along the hand's way (its -y)
      prop("knife", (() => {
        const g = new Group();
        g.add(mesh(new BoxGeometry(0.05, 0.2, 0.06), MAT.wood, 0, 0.02, 0));
        g.add(mesh(new BoxGeometry(0.012, 0.5, 0.075), std(0xc9cdd3, { metalness: 0.45, roughness: 0.3 }), 0, -0.33, 0.004));
        return g;
      })(), { p: [0, 0.02, 0.0], r: [0, 0, 0] }, false);
      prop("cup", mesh(new LatheGeometry([V2(0.001, 0), V2(0.07, 0.01), V2(0.06, 0.08), V2(0.09, 0.2)], 12), MAT.gold), { p: [0, -0.1, 0.08], r: [0, 0, 0] });
      const torch = (k) => {   // "ושתי אבוקות של אור בידם" (1:3)
        const g = new Group();
        g.add(mesh(new CylinderGeometry(0.05, 0.04, 1.3, 6), MAT.wood, 0, 0.45, 0));
        // TORCHES_LIVE_N3 (fix-n3, 24.11.2026 - the user: "כל הלפידים צריכים להיות באש חיה כמו במזבח"): the altar's live fire (40-altar.js, SH.liveFlame - a camera-facing
        // flame, always up on the screen) on the stick's head, instead of an orange cone that leaned with the torch in the hand
        const fl = fnc(SH.liveFlame) ? SH.liveFlame(g, 0, 1.05, 0, 0.26, 1.15, 0.95) : (() => { const c = new Mesh(new ConeGeometry(0.16, 0.5, 8), new MeshBasicMaterial({ color: 0xffb04a })); c.position.y = 1.32; g.add(c); return c; })();
        const li = new PointLight(0xffa04a, 0, 34, 1.6);
        li.position.y = 1.5;
        g.add(li);
        g.userData.light = li;
        return prop("torch" + k, g, { p: [0, -0.1, 0.1], r: [-0.25, 0, 0] }, false);
      };
      torch(1); torch(2);
      // ---- NIGHT_WATCH_305 (the user, 19.11.2026 21:24 "5. להוסיף את איש הר הבית, כולל שומר ישן וכו'"; 23:26 "2. כתפא"י", "3. ב") - the
      // night's watch on the chel (SC.ihb, SC.gevini): the guards' lanterns - "משמע שהאבוקות עומדות במקומן בפנסין סביב, שלא יתכבו ברוח"
      // (Tiferet Yisrael, Middot 1:2) - two of them giving light where the stage is (N.lantA); the stones the guards sit on; the cloak
      // that is burnt ("לשרוף את כסותו - ר"ל רק כסותו העליון שמסתמא התחתל בו, ובא עי"ז לשינה", there), the officer's staff ("חובטו במקלו - בפקיע שבהמקל", there), Ben Bavi's pakia (Yoma 23a "מאי פקיע -
      // נגדא", Rashi "מפסקת בראשה לרצועות דקות") and the lantern's torch. Their places, forms and colours - model choices.
      const NW = (() => {
        const grp = new Group();
        grp.name = "night-watch";
        group.add(grp);
        const mCloak = std(0x6e5c46, { roughness: 1 }), mStone = std(0x8f8a80, { roughness: 0.95 }), mStrap = std(0x5a3a22, { roughness: 0.8 });
        const mFlame = new MeshBasicMaterial({ color: 0xffb04a });
        const mGlass = new MeshStandardMaterial({ color: 0xfff1c8, roughness: 0.2, transparent: true, opacity: 0.22, emissive: 0xffb04a, emissiveIntensity: 0.35, depthWrite: false });
        // the lanterns: [x, z, the floor] - 0 at the gate of the offering, 1 at the gate of the spark, 2 at the court's north-west corner,
        // 3 behind the house of the kaporet (Middot 1:1 "ואחד אחורי בית הכפורת"), 4-7 on the way, 8 at the foot of Beit HaMoked's
        // flight, 9 on its landing
        const LANT = [[-43.6, -75.0, 0], [-73.6, -75.0, 0], [-97.3, -74.9, 0], [-97.2, -3.6, 0], [-58.5, -75.0, 0], [-87.0, -75.0, 0], [-97.1, -42.0, 0],
          [-36.4, -75.0, 0], [6.5, -77.8, 0], [-22.5, -79.2, 13.5]];
        const LG = new Group();
        LG.visible = false;
        grp.add(LG);
        const lanterns = LANT.map(([x, z, fy]) => {
          const g = new Group();
          g.position.set(x, fy, z);
          g.add(mesh(new CylinderGeometry(0.06, 0.085, 2.5, 8), MAT.wood, 0, 1.25, 0));
          for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [0.2, 0.2], [-0.2, 0.2]]) g.add(mesh(new CylinderGeometry(0.018, 0.018, 0.62, 5), MAT.bronze, dx, 2.81, dz));
          g.add(mesh(new BoxGeometry(0.5, 0.05, 0.5), MAT.bronze, 0, 2.5, 0));
          g.add(mesh(new ConeGeometry(0.34, 0.2, 4).rotateY(Math.PI / 4), MAT.bronze, 0, 3.2, 0));
          const gl = new Mesh(new BoxGeometry(0.4, 0.58, 0.4), mGlass);
          gl.position.y = 2.81;
          gl.renderOrder = 2;
          g.add(gl);
          const fl = fnc(SH.liveFlame) ? SH.liveFlame(g, 0, 2.62, 0, 0.17, 0.62, 0.9) : (() => { const c = new Mesh(new ConeGeometry(0.075, 0.26, 8), mFlame); c.position.y = 2.7; g.add(c); return c; })();   // TORCHES_LIVE_N3
          LG.add(g);
          return { g, fl };
        });
        const LPAIR = { 1: [0, 1], 2: [2, 3], 3: [8, 9] };
        const lights = [0, 1].map(() => { const l = new PointLight(0xffa64a, 0, 24, 1.6); grp.add(l); return l; });
        // NIGHT_SIT_305: the stones the guards sit on (the Tamid figures themselves sit - applyFig "sit", "doze"): at the gate of the
        // offering, at the gate of the spark, behind the house of the kaporet - each in its guard's frame (his face +z), the seat 0.63 high
        const stones = new Group();
        stones.visible = false;
        grp.add(stones);
        for (const [x, z, yaw] of [[-41.6, -75.9, Math.PI], [-71.6, -75.8, Math.PI], [-97.7, -6.0, -HP]]) {
          const st = new Group();
          st.position.set(x, 0, z);
          st.rotation.y = yaw;
          const b = new Mesh(new BoxGeometry(0.74, 0.63, 0.52), mStone);
          b.position.set(0, 0.315, -0.06);
          b.castShadow = true;
          b.receiveShadow = true;
          st.add(b);
          stones.add(st);
        }
        // the cloak on the ground, and its fire
        const cloakG = new Group(), cloakCloth = [];   // CLOAK_S2: the cloth's folds (hidden while only the hem burns on him)
        {
          // a cloth fallen in a heap: a few low folds over one another (NIGHT_SIT_305: until the second draft one flat disc)
          for (const [sx, sy, sz, x, y, z, ry] of [[0.6, 0.09, 0.46, 0, 0.05, 0, 0.2], [0.38, 0.13, 0.27, 0.22, 0.1, -0.12, 0.7], [0.3, 0.11, 0.22, -0.26, 0.09, 0.14, -0.5],
            [0.24, 0.1, 0.34, 0.05, 0.13, 0.18, 1.2]]) {
            const c = new Mesh(new SphereGeometry(1, 16, 8).scale(sx, sy, sz), mCloak);
            c.position.set(x, y, z);
            c.rotation.y = ry;
            c.castShadow = true;
            cloakG.add(c);
            cloakCloth.push(c);   // CLOAK_S2
          }
        }
        // its fire: tongues of flame over it, orange about and yellow in the middle, and their light on the chel
        const mFlameO = new MeshBasicMaterial({ color: 0xff7424, transparent: true, opacity: 0.88, depthWrite: false });
        const cloakFl = [];
        for (let i = 0; i < 11; i++) {
          const inner = i >= 7, an = i * 2.4, rr = inner ? 0.1 + 0.05 * (i % 2) : 0.24 + 0.08 * (i % 3) / 2;
          const h = inner ? 0.62 + 0.12 * (i % 2) : 0.36 + 0.1 * ((i * 7) % 3) / 2;
          const fl = new Mesh(new ConeGeometry(inner ? 0.075 : 0.1, h, 7).translate(0, h / 2, 0), inner ? mFlame : mFlameO);
          fl.position.set(Math.cos(an) * rr * 1.2, 0.1, Math.sin(an) * rr);
          fl.visible = false;
          cloakG.add(fl);
          cloakFl.push(fl);
        }
        // KIYOR_LIGHT_S2 (the coordinator, of the stage "kiyor": "המבט כהה... הכיור והמוכני גדולים וברורים, מאירים"): a soft light over the
        // laver and the machine while that night stage is shown (N.kiyorLit; no lamp is drawn - a viewing light, a model choice)
        const kiyorL = new PointLight(0xffe2bc, 0, 26, 1.4);
        kiyorL.position.set(21.5, 25.5, 62.5);
        grp.add(kiyorL);
        const cloakL = new PointLight(0xff8a3a, 0, 10, 1.8);
        cloakL.position.set(0, 0.6, 0);
        cloakG.add(cloakL);
        const cloakCol = new Color(0x6e5c46), charCol = new Color(0x241a12);
        prop("cloakN", cloakG, null, false);
        // the staff (held at a third of it), the strap at its head
        const stickG = new Group();
        stickG.add(mesh(new CylinderGeometry(0.035, 0.045, 2.4, 7), MAT.wood, 0, 0.55, 0));
        stickG.add(mesh(new BoxGeometry(0.03, 0.42, 0.012), mStrap, 0.035, 1.54, 0));
        prop("stick", stickG, { p: [0, -0.1, 0.1], r: [-0.25, 0, 0] }, false);
        // the pakia: a handle and a strap, split at its end into thin straps
        const pakG = new Group();
        pakG.add(mesh(new CylinderGeometry(0.03, 0.035, 0.45, 7), MAT.wood, 0, 0.12, 0));
        pakG.add(mesh(new BoxGeometry(0.045, 0.5, 0.012), mStrap, 0, 0.6, 0));
        for (const dx of [-0.045, -0.015, 0.015, 0.045]) pakG.add(mesh(new BoxGeometry(0.009, 0.28, 0.006), mStrap, dx, 0.98, 0));
        prop("pakia", pakG, { p: [0, -0.06, 0.08], r: [-0.4, 0, 0] }, false);
        // the torch of the lantern at the gate of the spark (lantern 1 shows no flame while it is out)
        const ltG = new Group();
        ltG.add(mesh(new CylinderGeometry(0.03, 0.025, 0.7, 6), MAT.wood, 0, 0.2, 0));
        if (fnc(SH.liveFlame)) SH.liveFlame(ltG, 0, 0.55, 0, 0.14, 0.62, 0.95); else { const f = new Mesh(new ConeGeometry(0.075, 0.26, 8), mFlame); f.position.y = 0.66; ltG.add(f); }   // TORCHES_LIVE_N3
        prop("ltorch", ltG, { p: [0, -0.08, 0.08], r: [-1.55, 0, 0] }, false);   // TORCH_FWD_420 (the user 24.11.2026: "הלפיד שוב לכיוון הכהן ולא הלוי" - bent over, the flame pointed back at the officer): held forward, the flame ahead - lowered, to the hem
        // none of these is a floor or a wall: the figures' floor ray (floorAt) and the camera pass through them
        for (const o of [grp, cloakG, stickG, pakG, ltG]) o.traverse((m) => { m.userData.noPick = true; });
        return {
          grp, lanterns,
          apply(N) {
            LG.visible = N.lanterns > 0.5;
            const pair = LG.visible ? LPAIR[N.lantA | 0] : null;
            lights.forEach((l, i) => { if (pair) { const p = lanterns[pair[i]].g.position; l.position.set(p.x, p.y + 2.85, p.z); l.intensity = 16; } else l.intensity = 0; });
            lanterns[1].fl.visible = !(N.ltorchOut > 0.5);
            const tt = performance.now() * 0.001;
            lanterns.forEach((L, i) => { L.fl.scale.set(1, 1 + 0.16 * Math.sin(tt * 9 + i * 1.3), 1); });
            stones.visible = LG.visible;
            const cf = N.cloakFire;
            cloakFl.forEach((m, i) => { m.visible = cf > 0.02; const w = 0.8 + 0.3 * Math.sin(tt * 11 + i * 1.7); m.scale.set(Math.max(0.01, cf * (0.9 + 0.1 * w)), Math.max(0.01, cf * w), Math.max(0.01, cf * (0.9 + 0.1 * w))); });
            cloakL.intensity = cf > 0.02 ? cf * (5 + 1.2 * Math.sin(tt * 13)) : 0;
            mCloak.color.copy(cloakCol).lerp(charCol, clamp(cf * 1.4, 0, 1) * 0.7);   // the cloth blackens as it burns
            for (const c of cloakCloth) c.visible = !(N.cloakCloth < 0.5);   // CLOAK_S2: the fire alone at the hem of the cloak he wears
            kiyorL.intensity = N.kiyorLit > 0 ? 34 * N.kiyorLit : 0;   // KIYOR_LIGHT_S2
          }
        };
      })();
      // TOOLS_RASHI_A2 (the user's decision 63): "נטלו את המגרפות ואת הצנורות ועלו לראש המזבח" (Tamid 2:1) - as Rashi on the vessels of
      // the Mishkan's altar (Shemot 27:3, 3692:1904, 1906): the shovel (toolS) "מגרפות שנוטלים בהם הדשן, והן כמין כסוי הקדרה של מתכת דק ולו
      // בית יד" - a thin round metal dish, like a pot's lid, on a handle; the fork (toolF) "כמין אונקליות כפופים" - bent hooks. Until now a
      // square blade and three straight prongs. Their sizes - model choices.
      const toolS = () => { const g = new Group(); g.add(mesh(new SphereGeometry(0.27, 16, 6, 0, Math.PI * 2, 0, 0.62).scale(1, 0.45, 1).rotateX(Math.PI), MAT.bronze, 0, 0.06, 0.82)); g.add(mesh(new CylinderGeometry(0.03, 0.03, 1.1, 6).rotateX(HP), MAT.wood, 0, 0.02, 0.1)); return g; };
      const toolF = () => {
        const g = new Group();
        for (const x of [-0.07, 0.07]) {
          const hook = new CatmullRomCurve3([new Vector3(x, 0, 0.6), new Vector3(x, 0.0, 0.82), new Vector3(x * 1.3, -0.04, 0.95), new Vector3(x * 1.3, -0.14, 0.98), new Vector3(x * 1.2, -0.2, 0.9)]);
          g.add(mesh(new TubeGeometry(hook, 14, 0.016, 5, false), MAT.bronze));
        }
        g.add(mesh(new BoxGeometry(0.2, 0.03, 0.04), MAT.bronze, 0, 0, 0.6));
        g.add(mesh(new CylinderGeometry(0.03, 0.03, 1.1, 6).rotateX(HP), MAT.wood, 0, 0.02, 0.1));
        return g;
      };
      prop("tool1", toolS(), null, false); prop("tool2", toolF(), null, false); prop("tool3", toolS(), null, false); prop("tool4", toolF(), null, false);
      const logGeo = new CylinderGeometry(0.22, 0.22, 3.2, 8).rotateZ(HP);
      for (let i = 1; i <= 4; i++) prop("carry" + i, mesh(logGeo, MAT.woodNew), { p: [0, -0.15, 0.25], r: [0, HP, 0] }, false);
      // ONE_KOHEN_211 (the refuter, R-04): the two gezirin of the morning in the hands of the one who won the terumah (below, SC.maarachah)
      // - two flat boards an amah by an amah, as the model's own (40-altar.js GEZIRIN_DEFAULT_195: Zevachim 62b "אורכן אמה, ורוחבן אמה")
      { const g2 = new Group(); for (const dy of [0, 0.13]) g2.add(mesh(new BoxGeometry(0.94, 0.1, 0.94), MAT.woodNew, 0, dy, 0)); prop("carryT", g2, { p: [0, -0.2, 0.42], r: [0, 0, 0] }, false); }
      // the new wood on the pyres (40-altar.js): the great pyre GP x 59.7..64.2, z ACZ + 4.5 +- 4, six layers to TOP + 3, and the model's two
      // gezirin on it (TOP + 3..4, z GP.cz +- 1, the gap between them left open: "ורוח היה בין הגזרין") - the new logs lie beside them; the
      // second pyre at (46, 5), 1.5 x 1, its top TOP + 0.7 (addPyre)
      const L1 = [], L2 = [];
      const GPZ = ACZ + 4.5;
      for (const dz of [-3.4, -2.4, 2.4, 3.4]) { const m = mesh(new CylinderGeometry(0.22, 0.22, 4.3, 8).rotateZ(HP), MAT.woodNew, 61.95, TOP0 + 3.22, GPZ + dz); altarG.add(m); L1.push(m); }
      for (const z of [4.6, 5.0, 5.4]) { const m = mesh(new CylinderGeometry(0.1, 0.1, 1.4, 7).rotateZ(HP), MAT.woodNew, 46, TOP0 + 0.8, z); altarG.add(m); L2.push(m); }
      // the model's own gezirin (40-altar.js): hidden until the stage that lays them. GEZ_FIND_211: since 1.9.5 they are two boards
      // 0.94 x 0.1 x 0.94 (GEZIRIN_DEFAULT_195), and this search still looked for the old beams 4.5 x 1 x 1 - it found nothing, so the two
      // boards lay on the pyre from the demonstration's first second. Both sizes are looked for now.
      const modelGez = [];
      try { ctx2.root.traverse((o) => { const p = o.isMesh && o.geometry && o.geometry.parameters; if (!p) return;
        const near = (v, w) => Math.abs(v - w) < 0.011;
        if ((near(p.width, 0.94) && near(p.height, 0.1) && near(p.depth, 0.94)) || (near(p.width, 4.5) && p.height === 1 && p.depth === 1)) modelGez.push(o); }); } catch (_) {}
      // KEY_SLAB_211: the keys of the court on their ring, taken from under the marble tablet (30-courts.js mokedSlab; Middot 1:9)
      prop("keys", (() => {
        const g = new Group();
        g.add(mesh(new TorusGeometry(0.06, 0.011, 8, 20), MAT.bronze));
        for (const dx of [-0.04, 0, 0.04]) { g.add(mesh(new CylinderGeometry(0.012, 0.012, 0.26, 6), MAT.bronze, dx, -0.19, 0)); g.add(mesh(new BoxGeometry(0.045, 0.04, 0.012), MAT.bronze, dx + 0.02, -0.3, 0)); }
        return g;
      })(), { p: [0, -0.06, 0.06], r: [0, 0, 0] }, false);
      // the heap of the morning's ash east of the ramp (1:4), the golden altar's ash, the portions, the salt
      prop("ashHeap", mesh(new ConeGeometry(0.55, 0.45, 12).translate(0, 0.225, 0), MAT.ash));
      prop("ashGold", mesh(new SphereGeometry(0.34, 12, 6, 0, Math.PI * 2, 0, HP).scale(1, 0.35, 1), MAT.ash));
      const portionGeo = new SphereGeometry(0.22, 10, 8).scale(1.4, 0.8, 0.9);
      for (let i = 1; i <= 9; i++) {
        let o;
        if (i === 7) o = (() => { const g = new Group(); g.add(mesh(new CylinderGeometry(0.3, 0.24, 0.26, 12), MAT.silver, 0, 0.13, 0)); g.add(mesh(new CylinderGeometry(0.27, 0.27, 0.04, 12), MAT.flour, 0, 0.26, 0)); return g; })();
        else if (i === 8) o = (() => { const g = new Group(); g.add(mesh(new CylinderGeometry(0.34, 0.34, 0.06, 14), MAT.silver)); for (let k = 0; k < 5; k++) g.add(mesh(new CylinderGeometry(0.12, 0.12, 0.05, 10), MAT.cake, Math.cos(k * 1.26) * 0.18, 0.06, Math.sin(k * 1.26) * 0.18)); return g; })();
        else if (i === 9) o = (() => { const g = new Group(); g.add(mesh(new LatheGeometry([V2(0.001, 0), V2(0.16, 0.02), V2(0.19, 0.2), V2(0.1, 0.42), V2(0.12, 0.5)], 12), MAT.gold)); return g; })();
        else { o = new Group(); o.add(mesh(portionGeo, MAT.portion, -0.12, 0.16, 0)); if (i !== 6) o.add(mesh(portionGeo, MAT.portion, 0.16, 0.18, 0.05)); }
        prop("p" + i, o, { p: [0, -0.16, 0.24], r: [0, 0, 0] });
      }
      prop("salt", (() => { const g = new Group(); for (let i = 0; i < 9; i++) g.add(mesh(new SphereGeometry(0.06, 6, 4), MAT.salt, Math.cos(i) * 0.3, 0.06, (i - 4) * 1.2)); return g; })());
      // SALT_STAGE_S2: each of the nine's pinch of salt, in his right hand while he salts (SC.melach)
      for (let i = 1; i <= 9; i++) prop("saltH" + i, (() => { const g = new Group(); for (const [x, y, z] of [[0, 0, 0], [0.06, 0.035, 0.02], [-0.05, 0.03, -0.03], [0.01, 0.07, -0.01]]) g.add(mesh(new SphereGeometry(0.05, 6, 4), MAT.salt, x, y, z)); return g; })());
      // MAARACHOT2_211 (stage ב; the user: the arrangements in detail): the limbs and the fats not consumed from the evening - charred, on the
      // old fire until "סונקין אותם לצדדי המזבח" (Tamid 2:1) and "מחזירין אותן למערכה" (2:5); and the kindling lit in the gaps between the
      // new logs - "ורוח היה בין הגזרין, שהיו מציתין את האליתא משם" (2:4). Their number, form and places - model choices
      const charMat = new MeshStandardMaterial({ color: 0x3a2116, roughness: 1, emissive: 0x2a0a02, emissiveIntensity: 0.6 });
      for (let i = 1; i <= 3; i++) { const o = new Group(); o.add(mesh(portionGeo, charMat, -0.1, 0.15, 0)); if (i !== 2) o.add(mesh(portionGeo, charMat, 0.15, 0.17, 0.06)); prop("old" + i, o, null, false); }
      const kindleMat = new MeshBasicMaterial({ color: 0xffb347 });
      for (let i = 1; i <= 3; i++) prop("kindle" + i, mesh(new ConeGeometry(0.16, 0.55, 8).translate(0, 0.27, 0), kindleMat), null, false);
      // the blood's marks: the two corners above the yesod and below the red line (40-altar.js: the body x 40.5..70.5, z -18.5..11.5,
      // the line at F + 4.925) - "מתנה אחת שהן שתים", one on each face of the corner; the remainder on the southern yesod (its top F + 1)
      const blood = {};
      // BLOOD_THROW_A2 (the user via the coordinator: "בזריקת הדם — שפיכה של דם ממש, כולל טיפות"): the marks are stains - a splash with
      // drops round it and runs down from it (the corners' faces), a pool on the yesod and its runs down the yesod's face - not plain
      // rectangles; the throw itself, the drops and the pouring of the remainder: bloodFx (below). Their forms - model choices.
      const stainTex = (seed, kind) => {
        const W2 = 128, H2 = kind === "pool" ? 128 : 192, cv = document.createElement("canvas");
        cv.width = W2; cv.height = H2;
        const c = cv.getContext("2d");
        let sd = seed * 977 + 31;
        const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
        const blob = (cx, cy, R, n, wob) => {
          c.beginPath();
          for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2, r = R * (1 + wob * (rnd() - 0.5) + 0.12 * Math.sin(a * 3 + seed)); const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
          c.closePath(); c.fill();
        };
        const cy = kind === "pool" ? 64 : kind === "drip" ? 8 : 62;
        const g = c.createRadialGradient(64, cy, 4, 64, cy, kind === "pool" ? 58 : 46);
        g.addColorStop(0, "rgba(72,4,6,0.98)"); g.addColorStop(0.7, "rgba(102,10,12,0.95)"); g.addColorStop(1, "rgba(122,18,18,0.9)");
        c.fillStyle = g;
        if (kind !== "drip") blob(64, cy, kind === "pool" ? 46 : 34, 28, 0.55);
        for (let i = 0; i < (kind === "pool" ? 10 : 16); i++) {   // the drops thrown round it
          const a = rnd() * Math.PI * 2, d = (kind === "pool" ? 50 : 40) + rnd() * 22, r = 1.5 + rnd() * 4.5;
          blob(64 + Math.cos(a) * d, cy + Math.sin(a) * d * (kind === "pool" ? 1 : 0.8), r, 10, 0.4);
        }
        if (kind !== "pool") {   // the runs down from it
          const n = kind === "drip" ? 7 : 6;
          for (let i = 0; i < n; i++) {
            const x = 64 + (rnd() - 0.5) * (kind === "drip" ? 100 : 54), y0 = cy + (kind === "drip" ? 0 : 18 + rnd() * 10), L = (kind === "drip" ? 60 : 40) + rnd() * (kind === "drip" ? 110 : 90), w = 3 + rnd() * 5;
            c.beginPath(); c.moveTo(x - w / 2, y0); c.lineTo(x - w * 0.3, y0 + L); c.arc(x, y0 + L, w * 0.42, Math.PI, 0, true); c.lineTo(x + w / 2, y0); c.closePath(); c.fill();
          }
        }
        const t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; t.anisotropy = 4;
        return t;
      };
      const bmark = (key, w, h, x, y, z, ry, kind = "wall", seed = 1) => {
        const m = new Mesh(new PlaneGeometry(w, h), new MeshStandardMaterial({ map: stainTex(seed, kind), color: 0xffffff, emissive: 0x2a0204, transparent: true, opacity: 0, depthWrite: false, roughness: 0.22, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2 }));
        m.position.set(x, y, z); m.rotation.y = ry; m.renderOrder = 3; m.visible = false; m.userData.kind = kind; altarG.add(m); (blood[key] = blood[key] || []).push(m);
      };
      bmark("ne", 1.5, 2.25, 69.75, F + 2.75, -18.53, Math.PI, "wall", 1); bmark("ne", 1.5, 2.25, 70.53, F + 2.75, -17.75, HP, "wall", 2);
      bmark("sw", 1.5, 2.25, 41.25, F + 2.75, 11.53, 0, "wall", 3); bmark("sw", 1.5, 2.25, 40.47, F + 2.75, 10.75, -HP, "wall", 4);
      { const m = new Mesh(new PlaneGeometry(1.3, 1.3).rotateX(-HP), new MeshStandardMaterial({ map: stainTex(5, "pool"), emissive: 0x2a0204, transparent: true, opacity: 0, depthWrite: false, roughness: 0.15, polygonOffset: true, polygonOffsetFactor: -2 })); m.position.set(41.2, F + 1.016, 12.0); m.renderOrder = 3; m.visible = false; m.userData.kind = "pool"; altarG.add(m); blood.ys = [m]; }
      bmark("ys", 1.4, 0.9, 41.2, F + 0.55, 12.515, 0, "drip", 6);   // the runs down the yesod's south face (its face z 12.5)
      blood.corner = { ne: [70.5, F + 3.1, -18.5], sw: [40.5, F + 3.1, 11.5], ys: [41.2, F + 1.03, 12.0] };   // where the throw strikes (altarG's frame)
      { // the jet and its drops (instanced), the poured stream (pieces of a tube)
        const bm = new MeshStandardMaterial({ color: 0x6a080b, emissive: 0x3a0305, emissiveIntensity: 1, roughness: 0.2, metalness: 0 });   // (its own glow a little: red, not black, in the dawn's shade)
        const drops = new InstancedMesh(new SphereGeometry(1, 8, 6), bm, 72);
        drops.frustumCulled = false; drops.count = 0; drops.userData.noPick = true; group.add(drops);
        const pour = [];
        for (let i = 0; i < 8; i++) { const q = new CylinderGeometry(1, 1, 1, 7, 1, true); q.translate(0, 0.5, 0); const m = new Mesh(q, bm); m.visible = false; m.userData.noPick = true; group.add(m); pour.push(m); }
        blood.fx = { drops, pour };
      }
      // the trumpets, the cymbals, the flags, the lyres
      const trumpet = () => { const g = new Group(); g.add(mesh(new CylinderGeometry(0.03, 0.03, 1.6, 8).rotateX(HP), MAT.silver, 0, 0, 0.7)); g.add(mesh(new ConeGeometry(0.13, 0.3, 12, 1, true).rotateX(HP), MAT.silver, 0, 0, 1.55)); return g; };
      prop("tru1", trumpet(), { p: [0, 0, 0], r: [-1.1, 0, 0] }, false);
      prop("tru2", trumpet(), { p: [0, 0, 0], r: [-1.1, 0, 0] }, false);
      prop("cymL", mesh(new CylinderGeometry(0.28, 0.28, 0.03, 16).rotateZ(HP), MAT.bronze), { p: [0, -0.05, 0.05], r: [0, 0, 0] }, false);
      prop("cymR", mesh(new CylinderGeometry(0.28, 0.28, 0.03, 16).rotateZ(HP), MAT.bronze), { p: [0, -0.05, 0.05], r: [0, 0, 0] }, false);
      prop("flags", SH.makeSudar(), null, false);   // SUDAR_A2: the flag (SH.makeSudar, below); until now a pole with a white cloth
      for (let i = 1; i <= 9; i++) {   // LEVITES_211: nine lyres (six until 2.0.1)
        const g = new Group();
        g.add(mesh(new TorusGeometry(0.32, 0.03, 6, 14, Math.PI * 1.3).rotateZ(-0.1), MAT.wood, 0, 0.3, 0));
        g.add(mesh(new BoxGeometry(0.62, 0.05, 0.06), MAT.wood, 0, 0.6, 0));
        // KINOR7_A2 (fix-a2; approved by the user's rule - the source is explicit): seven strings - Arachin 13b (134:437): "כנור של מקדש
        // של שבעת נימין היה" (five until now; in the instruments' chambers already seven)
        for (let s = -3; s <= 3; s++) g.add(mesh(new CylinderGeometry(0.004, 0.004, 0.52, 3), MAT.salt, s * 0.068, 0.35, 0));
        prop("lyre" + i, g, { p: [0, 0.1, 0.05], r: [0, 0, 0] });   // MUSICIANS_305: upright (false until 2.0.13), on the hand (0.2 above it)
      }
      for (let i = 1; i <= 2; i++) {   // LEVITES_211: two harps (נבלים) - a tall frame with a resonator below and more strings; the form - model choice
        const g = new Group();
        g.add(mesh(new BoxGeometry(0.09, 0.95, 0.11), MAT.wood, 0, 0.47, 0));
        g.add(mesh(new BoxGeometry(0.56, 0.07, 0.09), MAT.wood, 0.27, 0.92, 0));
        g.add(mesh(new BoxGeometry(0.58, 0.14, 0.14), MAT.wood, 0.28, 0.07, 0));
        // NEVEL10_A2 (the user's decision 66): ten strings - "בנבל עשור" (Psalms 33:2, in Arachin 13b 134:440), "של עשר נימין" (Rashi
        // there, 2190:507); seven until now. (Rashi's other reading - a wind instrument "כמפוח של נפחים", 2190:509 - in the stage's text.)
        for (let s = 1; s <= 10; s++) g.add(mesh(new CylinderGeometry(0.0035, 0.0035, 0.74, 3), MAT.salt, s * 0.049, 0.51, 0));
        prop("nevel" + i, g, { p: [0, 0.05, -0.05], r: [0, Math.PI, 0] });   // MUSICIANS_305: upright, its strings toward his middle, its foot at the hand
      }
      // the role tags over the figures (sprites, drawn over everything on a dark plate)
      const tagCache = new Map();
      const tagMat = (text) => {
        if (tagCache.has(text)) return tagCache.get(text);
        const cv = document.createElement("canvas"), c = cv.getContext("2d"), fs = 46, font = "600 " + fs + "px 'Segoe UI', Arial, sans-serif";
        c.font = font;
        const w = Math.ceil(c.measureText(text).width) + 36;
        cv.width = w; cv.height = fs + 26;
        c.font = font;
        c.fillStyle = "rgba(18,22,32,0.84)";
        const r = 14, h = cv.height;
        c.beginPath(); c.moveTo(r, 0); c.lineTo(w - r, 0); c.quadraticCurveTo(w, 0, w, r); c.lineTo(w, h - r); c.quadraticCurveTo(w, h, w - r, h); c.lineTo(r, h); c.quadraticCurveTo(0, h, 0, h - r); c.lineTo(0, r); c.quadraticCurveTo(0, 0, r, 0); c.fill();
        c.fillStyle = "#ffe7a8"; c.textAlign = "center"; c.textBaseline = "middle"; c.direction = "rtl";
        c.fillText(text, w / 2, h / 2 + 2);
        const t = new CanvasTexture(cv);
        t.colorSpace = SRGBColorSpace;
        const v = { m: new SpriteMaterial({ map: t, depthTest: false, transparent: true }), aspect: w / h };
        tagCache.set(text, v);
        return v;
      };
      return { group, altarG, MAT, G, figs, hp: hpGarb, piles, lamb, props, sleepers, L1, L2, modelGez, blood, tagMat, paths: new Map(), routes: new Map(), night: NW,   // NIGHT_WATCH_305
        hands: KG ? KG.hands : null, gripAt: KG ? KG.gripAt : null, ring: KG ? KG.ring : null,   // HAND_A2; HAND_GRIP_A2
        handMid: KG && SH.priestKit && SH.priestKit.handWr ? (() => { const m = {}; return (kind, side) => m[kind + side] || (m[kind + side] = SH.priestKit.handWr(side, kind, true)); })() : null };
    }
    // ---------------------------------------------------------------- the cast
    const FIG_IDS = ["mem", "t", "mc", "cv", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "k", "f", "e", "b1", "b2", "b3", "b4", "sg", "tr1", "tr2"];
    // LEVITES_211 (stage ב, point 28; the user: V): "אין פוחתין משנים עשר לוים עומדים על הדוכן" (Arachin 2:6); "אין פוחתין משני נבלים ולא
    // מוסיפין על ששה... ואין פוחתין מתשעה כנורות, ומוסיפין עד לעולם. והצלצל לבד" (2:5) - twelve: nine with lyres, two with harps, and Ben
    // Arza with the cymbal (no flute - only on twelve days, Rambam KH 3:6). Until 2.0.1 six and Ben Arza.
    // SINGERS_211 (the refuter, R-06; the user, 15.11.2026 18:12: "2. ב"): THE TWELVE OF THE DUCHAN SING WITH THEIR MOUTHS, AND THE PLAYERS
    // ARE OTHERS - the Rambam, Klei HaMikdash 3:3 (338:39): "ואין פוחתין משנים עשר לוים עומדים על הדוכן בכל יום לומר שירה על הקרבן... ואין
    // אומרין שירה אלא בפה בלא כלי... ואחרים היו עומדים שם מנגנין בכלי שיר. מהן לוים ומהן ישראלים מיחסין... ואין אלו המשוררים על פי הכלים
    // עולין למנין השנים עשר". (Rav Papa, Arachin 13b, 134:435: the twelve are "כנגד תשעה כנורות ושני נבלים וצלצל אחד" - said in the
    // stage's words.) So: twelve singers, "v1".."v12", their hands empty; and the players - nine lyres ("l1".."l9"), two harps ("l10",
    // "l11") and Ben Arza with the cymbal ("ba"). Until this fix the twelve of the duchan were the players themselves. All are drawn
    // as Levites (whether some players were Israelites of good descent - not drawn); their spots along the duchan - model choices.
    const LEV_SING = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11", "v12"];
    const LEV_IDS = ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "l11", "ba", ...LEV_SING];
    const LEV_PLAY = LEV_IDS.slice(0, 11);
    const LEV_KIDS = ["y1", "y2", "y3"];   // TZOARIM_A2
    const KID_HAIR = new MeshStandardMaterial({ color: 0x3a2a1e, roughness: 0.95, metalness: 0 });
    const R13 = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13"];
    const ROLE = { s1: "השוחט", s2: "הזורק", s3: "מדשן מזבח הפנימי", s4: "מדשן המנורה", s5: "הראש והרגל", s6: "שתי הידים", s7: "העוקץ והרגל", s8: "החזה והגרה",
      s9: "שתי הדפנות", s10: "הקרבים", s11: "הסולת", s12: "החביתין", s13: "היין" };
    const LOT1 = ["t", "b1", "b2", "b3", "b4", "s1", "s5", "s6", "s7", "s8"];   // those who woke in Beit HaMoked (model choice: ten)
    const ALLP = ["t", "mc", "b1", "b2", "b3", "b4", ...R13, "k", "f", "e", "sg", "tr1", "tr2"];   // the priests of the hall of hewn stone
    const REST = ["t", "b1", "b2", "b3", "s1", "s2", "s5", "s6", "s7", "s8", "s9", "s10"];   // the priests who have no vessel in the stages of the heichal
    let W_sleeperSpot = null, sleepersNow = () => {};   // SLEEPERS_N3 (set when the sleepers are built)
    // SLEEPERS_N3: where the elder i stands up (the first four, by the chosen reading of the rovdin): on the top terrace where he lay, or on the floor before his niche
    const riseOf = (i) => {
      if (i >= 4 || !W_sleeperSpot) return RISE[i];
      const mef = !!(SH.rovdin && SH.rovdin.mode === "mefaresh"), p = W_sleeperSpot(i, mef), g = SH.rovdinGeo || { wxW: -33, wxE: -3 };
      if (!mef) return [p[0], p[2]];
      return [i < 2 ? g.wxW + 2.6 : g.wxE - 2.6, p[2] + 0.45];
    };
    const riseH = (i) => { const r = riseOf(i); return hintY(r[0], r[1]); };
    // the sleepers: [x, y, z, yaw] (the body along its local z, the head at +z), and where each rises - the ten of LOT1 in order
    const SLEEP = [[-31.6, F + 1, -67.5, 0], [-32.5, F + 2, -67.5, Math.PI], [-4.4, F + 1, -67.5, 0], [-3.5, F + 2, -67.5, Math.PI],
      // (SLEEP_CLEAR_211: the two by the hearth lie beside the aisle's middle line, not on it - the officer's way in from the north gate
      // and the priests' way out by the south gate run along x -18, and a way's floor is sampled once, sometimes while a sleeper still lay there)
      [-15.4, F, -72.6, HP], [-20.6, F, -61.3, -HP], [-23.6, F, -67.5, 0], [-12.4, F, -67.5, Math.PI], [-20.15, F + 0.1, -70.5, -HP], [-10.8, F, -67.5, 0]];
    // KEY_SLAB_211: the ninth lies on the marble tablet (30-courts.js mokedSlab, its top F + 0.1), his head to the west - the one who locked:
    // "החזיר את המפתחות לשלשלת ואת הטבלא למקומה, נתן כסותו עליה, ישן לו" (Middot 1:9); he rises beside it (the ring keeps its old spots)
    const RISE = [[-30.1, -66.4], [-30.1, -68.8], [-5.9, -66.4], [-5.9, -68.8], [-16.6, -71.3], [-20.4, -62.6], [-22.6, -66.2], [-13.4, -69.2], [-21.6, -72.0], [-13.6, -66.0]];
    // ---------------------------------------------------------------- the floor under a point, and the ways of the court
    const hintY = (x, z) => {
      const lz = z - D;
      if (x > -34 && x < -2 && z > -77.5 && z < -57.5) {
        // SLEEPERS_N3: the rovdin's terraces (the Rosh's reading and its like) - the elders walk down them from where they lay
        const g = SH.rovdinGeo;
        if (g && !(SH.rovdin && SH.rovdin.mode === "mefaresh") && z > g.z0 && z < g.z1) {
          const d = x < -18 ? x - g.wxW : g.wxE - x;
          if (d > 0 && d < g.d0) return F + Math.min(g.n, Math.floor((g.d0 - d) / g.ds) + 1);
        }
        return F;
      }                                             // Beit HaMoked (MOKED_WIDE_211, FLOOR_211: 32 wide, one floor at the court's level; the steps inside its gate to the chel are found from above)
      if (x > -34 && x < 9 && z <= -77.5 && z > -100) return null;                                           // before its gate to the chel: whatever is there (CHEL_211: the landing and the flight along the north face)
      if (x > 77.8 && x < 89.2 && z > -78.2 && z < -55.8) return F;                                          // GAZIT_PLACE_211: the hall of hewn stone's floor (over the court of Israel's strip too)
      if (x > 41 && x < 70 && lz > -18 && lz < 11) return TOP;                                               // the altar's top
      if (x > 47.5 && x < 63.5 && lz >= 10.5 && lz < 42.6) return F + 9 * (42.6 - lz) / 32;                 // the ramp
      if (x > 17.5 && x <= 39.5 && Math.abs(z) <= 50) return F + 6 * clamp((39.5 - x) / 19, 0, 1);          // the ulam's steps
      if (x > 1.5 && x <= 17.5 && Math.abs(z) <= 50) return HEI;                                            // the ulam
      if (x <= 1.5 && x > -82.5 && Math.abs(z) <= 35) return HEI + houseRise(x);                            // the house
      if (x > 85) return MK + (SH.israelLift ? SH.israelLift() : 0);                                                                                 // the court of Israel (DUCHAN_GAP_A2: the duchan x 82.5..85)
      return F;
    };
    const floorCache = new Map();
    const floorAt = (x, z, h) => {
      const hint = h != null ? h : hintY(x, z);
      const key = Math.round(x * 4) + "," + Math.round(z * 4) + "," + (hint == null ? "n" : Math.round(hint * 2));
      let y = floorCache.get(key);
      if (y !== undefined) return y;
      y = fnc(SH.floorY) ? SH.floorY(x, (hint == null ? F : hint) + 2.2, z) : -Infinity;
      if (hint == null) { if (!isFinite(y)) y = MK; }
      else if (!(isFinite(y) && Math.abs(y - hint) < 3.2)) y = hint;
      floorCache.set(key, y);
      return y;
    };
    // the regions of the court and the nodes that join them (model choices: the lanes a few amot from the walls and the furniture)
    const regionOf = (x, z) => {
      const lz = z - D;
      if (x > -30 && x < -6 && z > -77.5 && z < -57.5) return "moked";
      if (x > -34 && x < 9 && z <= -77.5) return "mokedN";
      if (x > 68.8 && x < 89.2 && z > -78.2 && z < -55.8) return "gazit";   // GAZIT_PLACE_211 (x 46.8..73.2 until 2.0.1)
      if (x > 39.4 && x < 71.6 && lz > -19.6 && lz < 12.6) return "top";
      if (x >= 47.5 && x <= 63.5 && lz >= 12.6 && lz < 42.7) return "ramp";
      if (x <= -4.5 && Math.abs(z) < 10.5) return "heichal";
      if (x > -4.5 && x <= 1.5 && Math.abs(z) < 5) return "gate";
      if (x > 1.5 && x <= 12.5 && Math.abs(z) < 36) return "ulam";
      if (x > 12.5 && x <= 17.5 && Math.abs(z) < 10) return "ulamDoor";
      if (x > 17.5 && x < 39.4 && Math.abs(z) <= 50) return "steps";
      if (x > 85) return "israel";   // DUCHAN_GAP_A2
      if (x >= 71.6) return "courtE";
      if (lz <= -19.6) return "courtN";
      if (x > 63.5 && lz >= 12.6) return "courtSE";
      if (x >= 39.4 && x < 47.5 && lz >= 12.6) return "courtSW";
      if (z > 50) return "courtS";
      return "courtN";
    };
    const nodes = () => ({
      MN_OUT: [-18, -78.65], MN_IN: [-18, -74.4], MK_C: [-18, -62.6], MS_IN: [-18, -59.6], MS_OUT: [-18, -55.3],
      CN_W: [-15, -52.2], CN: [36, -48.5], NL: [65.45, -49.6], GZ_OUT: [88.25, -51.4], GZ_IN: [88.25, -57.4], GZ_C: [86.2, -61.4],   // NORTH_CHAMBERS_N2: the hall's door, in its south wall at x 87..89.5 (it was still drawn at x 81, where the door stood until 22.11)
      CNE: [74.5, -47], CE: [74.5, -12], CE2: [74.5, 32],   // CHAMBERS_EAST_N2: the lane x 74.5 (77.5 until now - the Parvah and the Madichin stand from x 77)
       CSE: A(68.4, 32.6), RF_E: A(64.8, 42.1), RF: A(55.5, 41.6), RT: A(55.5, 11.6),
      TOP_S: A(55.5, 8.4), RF_W: A(46.6, 42.1), RFW2: A(49.6, 41.9), RFE2: A(61.4, 41.9), CSW: A(41.6, 30), CSW_N: A(41.4, 14.4), STB_S: [38.4, 48.6], STB_N: [38.4, -12],
      ST_C: [30, -1], LAV: [24.6, 52.6], UL_D: [15, 0], UL: [8, 0], G_OUT: [2.6, 0], G_IN: [-6.2, 0], HEI: [-22, 0], WK: [3.4, -19],
      ISR: [92, 0], DUCH: [83.6, 0], UL_NE: [18.6, -52.2], CV_D: [87, 15.6], ST_NE: [34.4, -51.0], ST_SE: [34.4, 51.0]
    });
    // ROUTER_BLOCK_215: the north lane passes the ulam's platform (it reaches z -51) by the corner UL_NE, not across its edge
    const EDGES = [["MN_OUT", "MN_IN"], ["MN_IN", "MK_C"], ["MK_C", "MS_IN"], ["MS_IN", "MS_OUT"], ["MS_OUT", "CN_W"], ["CN_W", "UL_NE"], ["UL_NE", "ST_NE"], ["ST_NE", "CN"], ["CN", "NL"], ["NL", "GZ_OUT"],
      ["GZ_OUT", "GZ_IN"], ["GZ_IN", "GZ_C"], ["CNE", "GZ_OUT"], ["NL", "CNE"], ["CNE", "CE"], ["CE", "CE2"], ["CE2", "CSE"], ["CSE", "RF_E"], ["RF_E", "RF"], ["RF", "RT"], ["RT", "TOP_S"],
      ["RF_W", "RFW2"], ["RFW2", "RF"], ["RF_E", "RFE2"], ["RFE2", "RF"], ["RF_W", "CSW"], ["CSW", "CSW_N"], ["CSW", "STB_S"], ["STB_S", "ST_SE"], ["ST_SE", "LAV"], ["STB_S", "RF_W"], ["STB_S", "STB_N"], ["STB_N", "CN"], ["CN", "ST_C"], ["STB_N", "ST_C"],
      ["STB_S", "ST_C"], ["ST_C", "UL_D"], ["UL_D", "UL"], ["UL", "G_OUT"], ["G_OUT", "G_IN"], ["G_IN", "HEI"], ["UL", "WK"], ["CE", "DUCH"], ["CE2", "DUCH"], ["DUCH", "ISR"], ["CV_D", "DUCH"]];   // ROUTER_BLOCK_215: CV_D before the chavitin chamber's door - CHAMBERS_EAST_N2: now in its north wall (x 87, z 19.5), the way to it by the gate (the edge to CE2 crossed the chamber)
    const REG_NODES = { moked: ["MK_C", "MS_IN", "MN_IN"], mokedN: ["MN_OUT"], gazit: ["GZ_C", "GZ_IN"], top: ["TOP_S"], ramp: ["RF", "RT", "RFW2", "RFE2"], heichal: ["HEI", "G_IN"],
      gate: ["G_IN", "G_OUT"], ulam: ["UL", "WK", "G_OUT"], ulamDoor: ["UL_D"], steps: ["ST_C", "STB_N", "STB_S", "UL_D"], israel: ["ISR", "CV_D"],
      courtE: ["CE", "CE2", "CNE", "DUCH"], courtN: ["CN", "CN_W", "NL", "CNE", "STB_N", "MS_OUT"], courtSE: ["CSE", "RF_E"], courtSW: ["CSW", "CSW_N", "RF_W", "STB_S"], courtS: ["LAV", "STB_S", "ST_SE"] };   // ROUTER_BLOCK_215: ST_NE and ST_SE - round the corners of the ulam's twelve steps (to z ±50), not over them
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    // ROUTER_BLOCK_215: the house (70 wide) and the ulam on its platform (100 wide, to x 17.5) stand in the court, with half
    // an amah to spare; a straight hop between two points outside them that would cross them is not taken
    // (and the low wall at x 90..91 before the court's east wall, open only at the gate, the wickets and the chambers' doors)
    // (and the ulam's twelve steps - a hop round their corners, not over them)
    const BLK = [[-83, 1.5, -35.6, 35.6], [1, 17.9, -51.6, 51.6], [17.5, 33.9, -50.4, 50.4],
      ...[[-65, -28.5], [-19.5, -14.6], [-9.4, -5.6], [5.6, 9.4], [14.6, 19.5], [28.5, 65]].map(([z0, z1]) => [89.6, 91.4, z0 - 0.4, z1 + 0.4]),
      // CHAMBERS_EAST_N2: the chambers of the court of Israel (30-courts.js): Pinchas's, the chavitin makers', the Madichin, the Parvah, the salt
      [82, 91.7, -28.9, -19.1], [82, 91.7, 19.1, 28.9], [76.5, 91.7, 29, 39.8], [76.5, 91.7, 44.6, 55.4], [79, 91.7, 54.6, 65.7],
      // NORTH_CHAMBERS_N2: the three northern chambers, one building (30-courts.js): the Gazit hall x 76..91, the Golah and the Etz x 70.8..76
      [70.3, 91.7, -80.5, -53.4]];
    const inBlk = (p) => BLK.some(([x0, x1, z0, z1]) => p[0] > x0 && p[0] < x1 && p[1] > z0 && p[1] < z1);
    const segBox = (p, q, x0, x1, z0, z1) => {
      let t0 = 0, t1 = 1;
      const dx = q[0] - p[0], dz = q[1] - p[1];
      const clip = (den, num) => {
        if (den === 0) return num >= 0;
        const t = num / den;
        if (den < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
        return true;
      };
      return clip(-dx, p[0] - x0) && clip(dx, x1 - p[0]) && clip(-dz, p[1] - z0) && clip(dz, z1 - p[1]) && t0 < t1;
    };
    const blocked = (p, q) => !inBlk(p) && !inBlk(q) && BLK.some(([x0, x1, z0, z1]) => segBox(p, q, x0, x1, z0, z1));
    const route = (p, q) => {
      const rp = regionOf(p[0], p[1]), rq = regionOf(q[0], q[1]);
      if (rp === rq && rp !== "courtN") return [p, q];
      const key = p[0].toFixed(1) + "," + p[1].toFixed(1) + ">" + q[0].toFixed(1) + "," + q[1].toFixed(1) + "@" + D;
      const hit = W.routes.get(key);
      if (hit) return hit;
      const N = nodes(), dd = {}, prev = {}, done = new Set();
      const seeds = (REG_NODES[rp] || ["CN"]).filter((n) => !blocked(p, N[n]));
      for (const n of seeds.length ? seeds : REG_NODES[rp] || ["CN"]) { dd[n] = dist(p, N[n]); prev[n] = null; }
      const adj = {};
      for (const [a, b] of EDGES) { (adj[a] = adj[a] || []).push(b); (adj[b] = adj[b] || []).push(a); }
      for (;;) {
        let u = null;
        for (const n in dd) if (!done.has(n) && (u === null || dd[n] < dd[u])) u = n;
        if (u === null) break;
        done.add(u);
        for (const v of adj[u] || []) { const c = dd[u] + dist(N[u], N[v]); if (dd[v] === undefined || c < dd[v]) { dd[v] = c; prev[v] = u; } }
      }
      let best = null, bc = Infinity;
      const ends = (REG_NODES[rq] || ["CN"]).filter((n) => dd[n] !== undefined && !blocked(N[n], q));
      for (const n of ends.length ? ends : REG_NODES[rq] || ["CN"]) if (dd[n] !== undefined && dd[n] + dist(N[n], q) < bc) { bc = dd[n] + dist(N[n], q); best = n; }
      const out = [p];
      if (best) { const chain = []; for (let n = best; n; n = prev[n]) chain.unshift(N[n]); for (const c of chain) if (dist(c, out[out.length - 1]) > 0.4) out.push(c); }
      if (dist(q, out[out.length - 1]) > 0.05) out.push(q);
      W.routes.set(key, out);
      return out;
    };
    // a path: points [x, z] or [x, z, y-hint]; sampled every 1.2 amot, each sample's floor taken once
    const pathOf = (pts) => {
      const key = pts.map((p) => p[0].toFixed(2) + "," + p[1].toFixed(2) + (p[2] != null ? "," + p[2].toFixed(2) : "")).join(";");
      let P = W.paths.get(key);
      if (P) return P;
      const S = [];
      let s = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        if (i === 0) { S.push({ x: a[0], z: a[1], h: a[2], s: 0, y: null }); continue; }
        const b = pts[i - 1], L = Math.hypot(a[0] - b[0], a[1] - b[1]), n = Math.max(1, Math.ceil(L / 1.2));
        for (let k = 1; k <= n; k++) {
          const u = k / n;
          S.push({ x: lerp(b[0], a[0], u), z: lerp(b[1], a[1], u), h: a[2] != null && b[2] != null ? lerp(b[2], a[2], u) : u === 1 ? a[2] : undefined, s: s + L * u, y: null });
        }
        s += L;
      }
      P = { S, len: s };
      W.paths.set(key, P);
      return P;
    };
    const yOf = (q) => (q.y == null ? (q.y = floorAt(q.x, q.z, q.h)) : q.y);
    const pathAt = (P, d) => {
      const S = P.S;
      if (S.length === 1) return { x: S[0].x, y: yOf(S[0]), z: S[0].z, yaw: null };
      d = clamp(d, 0, P.len);
      let i = 1;
      while (i < S.length - 1 && S[i].s < d) i++;
      const a = S[i - 1], b = S[i], u = b.s > a.s ? clamp((d - a.s) / (b.s - a.s), 0, 1) : 1;
      return { x: lerp(a.x, b.x, u), y: lerp(yOf(a), yOf(b), u), z: lerp(a.z, b.z, u), yaw: Math.atan2(b.x - a.x, b.z - a.z) };
    };
    // ---------------------------------------------------------------- the state of the world, from the night (resetState) by the stages (SC)
    const N = {};
    const S0 = {};   // where each figure stands when the current stage begins (a stage walks from there)
    const resetState = () => {
      for (const id in W.figs) {
        const f = W.figs[id];
        if (!f.st) f.st = {};
        Object.assign(f.st, { vis: false, x: 0, y: 0, z: 0, yaw: 0, pose: "stand", ph: 0, t: 0, tag: "", cloak: false });   // NIGHT_SIT_305: cloak
        if (!S0[id]) S0[id] = { vis: false, x: 0, z: 0, yaw: 0 };
      }
      W.lamb.st = { vis: false, x: 0, y: 0, z: 0, yaw: 0, pose: "stand", ph: 0 };
      for (const id in W.props) { const p = W.props[id]; if (!p.st) p.st = {}; Object.assign(p.st, { vis: false, fig: null, hand: "R", x: 0, y: 0, z: 0, ry: 0, rx: 0 }); }
      Object.assign(N, { kidWater: 0, sleepers: 1, gate: 0, mukhni: 1, lamps: [1, 1, 1, 1, 1, 1, 1], tap: 1, l1: 0, l2: 0, gz: 0, glow: 0, ashGold: 1, coals: 0, smoke: 0,
        blood: { ne: 0, sw: 0, ys: 0 }, chelG: 0, roofs: false, torches: [0, 0], coalsS: 0, coalsG: 0, teniAsh: 0, kafLid: 1, mizrak: 0, slab: 0, slabKeys: 1, fx: [], night: 1,
        lanterns: 0, lantA: 0, joltN: 0, joltP: 0, cloakFire: 0, ltorchOut: 0 });   // NIGHT_WATCH_305 //   // NIGHT_COALS_304: night
      N.lamps.fill(1);
      N.cloakCloth = 1;   // CLOAK_S2
      N.kiyorLit = 0;   // KIYOR_LIGHT_S2
    };
    const snap = () => { for (const id in W.figs) { const s = W.figs[id].st, o = S0[id]; o.vis = s.vis; o.x = s.x; o.z = s.z; o.yaw = s.yaw; } };
    // the script API of one stage at its second `tau` (every call does nothing before its own time)
    const API = (tau, id, prevId) => {
      const fig = (k) => W.figs[k], P = (k) => W.props[k];
      const a = {
        tau, prev: prevId,
        from(k, fb) { const s = S0[k]; return s && s.vis ? [s.x, s.z] : fb; },
        seen(k) { return !!(S0[k] && S0[k].vis); },
        path(p, q) { return route(p, q); },
        // a walk along points between two times; at its end a pose and a facing
        walk(k, pts, t0, t1, o = {}) {
          if (tau < t0) return;
          const f = fig(k), Pth = pathOf(pts), T = Math.max(0.01, t1 - t0), u = clamp((tau - t0) / T, 0, 1);
          const d = Pth.len * (u < 1 ? lerp(u, smooth(u), 0.35) : 1);
          const q = pathAt(Pth, d);
          Object.assign(f.st, { vis: true, x: q.x, y: q.y, z: q.z });
          if (q.yaw != null && u < 1) f.st.yaw = q.yaw;
          if (u < 1) { const v = Pth.len / T; f.st.pose = o.carry ? "walkCarry" : o.hold ? "walkHold" : "walk"; f.st.ph = v > 3.2 ? (tau - t0) * 14 : d * 4.5; }
          else { if (q.yaw != null) f.st.yaw = q.yaw; f.st.pose = o.end || "stand"; if (o.yaw != null) f.st.yaw = o.yaw; }
        },
        // to a point by the court's ways, from where the figure stood when the stage began (or o.from)
        go(k, q, t0, t1, o = {}) {
          const p = o.from || a.from(k, null);
          if (!p) { a.at(k, q[0], q[1], o.yaw, t0, o); return; }
          a.walk(k, route(p, q), t0, t1, o);
        },
        at(k, x, z, yaw, t = 0, o = {}) {
          if (tau < t) return;
          const f = fig(k);
          Object.assign(f.st, { vis: true, x, z, y: o.y != null ? o.y : floorAt(x, z, o.h), pose: o.pose || "stand" });
          if (yaw != null) f.st.yaw = yaw;
        },
        pose(k, p, t0, t1 = 1e9) { if (tau >= t0 && tau < t1) { const f = fig(k); f.st.pose = p; f.st.t = tau - t0; f.st.tl = t1 - tau; } },
        // LAMPS_HANDS_219: at lamp i of the menorah from t0 to t1 - the hand on its side at its wick's mouth (applyFig, trimArm)
        trim(k, i, t0, t1) { if (tau >= t0 && tau < t1) { const f = fig(k); f.st.pose = "trim"; f.st.lamp = i; f.st.t = tau - t0; f.st.tl = t1 - tau; } },
        face(k, yaw, t) { if (tau >= t) fig(k).st.yaw = yaw; },
        hide(k, t = 0) { if (tau >= t) fig(k).st.vis = false; },
        tag(k, text, t0 = 0, t1 = 1e9) { if (tau >= t0 && tau < t1) fig(k).st.tag = text; },
        cloak(k, t0 = 0, t1 = 1e9) { if (tau >= t0 && tau < t1) fig(k).st.cloak = true; },   // NIGHT_SIT_305: wrapped in his cloak
        hold(k, p, hand, t) { if (tau >= t) Object.assign(P(p).st, { vis: true, fig: k, hand }); },
        put(p, x, y, z, t, ry = 0, rx = 0) { if (tau >= t) Object.assign(P(p).st, { vis: true, fig: null, x, y: y == null ? floorAt(x, z) : y, z, ry, rx }); },
        putA(p, x, lz, t, ry = 0, y = null) { a.put(p, x, y, lz + D, t, ry); },   // by the altar: (x, z) in its own frame
        // a thrown or tossed prop flying from where it is to a point between two times (an arc of height h)
        fly(p, to, t0, t1, h = 1) {
          if (tau < t0) return;
          const st = P(p).st;
          if (tau >= t1) { Object.assign(st, { vis: true, fig: null, x: to[0], y: to[1], z: to[2] }); return; }
          const from = st.fig ? gripWorld(st.fig, st.hand) : [st.x, st.y, st.z];
          const u = (tau - t0) / (t1 - t0);
          Object.assign(st, { vis: true, fig: null, x: lerp(from[0], to[0], u), y: lerp(from[1], to[1], u) + Math.sin(u * Math.PI) * h, z: lerp(from[2], to[2], u) });
        },
        gone(p, t) { if (tau >= t) P(p).st.vis = false; },
        set(key, v, t) { if (tau >= t) N[key] = v; },
        ramp(key, v0, v1, t0, t1) { if (tau < t0) return; const u = clamp((tau - t0) / Math.max(0.01, t1 - t0), 0, 1); N[key] = lerp(v0, v1, smooth(u)); },
        lamp(i, v0, v1, t0, t1) { if (tau < t0) return; const u = clamp((tau - t0) / Math.max(0.01, t1 - t0), 0, 1); N.lamps[i] = lerp(v0, v1, u); },
        blood(k, t0, t1) { if (tau >= t0) N.blood[k] = clamp((tau - t0) / Math.max(0.01, t1 - t0), 0, 1); },
        lamb(x, z, yaw, t, pose = "stand") { if (tau >= t) Object.assign(W.lamb.st, { vis: true, x, z, y: floorAt(x, z), yaw, pose }); },
        lambWalk(pts, t0, t1, yawEnd) {
          if (tau < t0) return;
          const Pth = pathOf(pts), u = clamp((tau - t0) / Math.max(0.01, t1 - t0), 0, 1), q = pathAt(Pth, Pth.len * u);
          Object.assign(W.lamb.st, { vis: true, x: q.x, y: q.y, z: q.z, pose: u < 1 ? "walk" : "stand", ph: Pth.len * u * 7 });
          if (q.yaw != null) W.lamb.st.yaw = u < 1 || yawEnd == null ? q.yaw : yawEnd;
        },
        lambGone(t) { if (tau >= t) W.lamb.st.vis = false; },
        fx(name, t) { N.fx.push([id, name, t]); },   // a sound at its second (play() sounds it when the clock passes it)
        roofs(t0 = 0, t1 = 1e9) { if (tau >= t0 && tau < t1) N.roofs = true; }
      };
      return a;
    };
    const gripWorld = (k, hand) => {
      const f = W.figs[k], gp = (hand === "L" ? f.L : f.R).grip;
      f.g.updateMatrixWorld(true);
      const v = new Vector3();
      gp.getWorldPosition(v);
      return [v.x, v.y, v.z];
    };
    // the circle of a lottery (Rambam 4:1 "והן עומדין בהקפה"): `ids` on an arc round a centre, facing it; the arc leaves a gap at `gap`
    // (an angle; the officer stands there)
    const ringSpots = (ids, cx, cz, rx, rz, gap = -HP, open = 0.5) => ids.map((k, i) => {
      const an = gap + open + (i + 0.5) / ids.length * (Math.PI * 2 - 2 * open);
      const x = cx + Math.cos(an) * rx, z = cz + Math.sin(an) * rz;
      return [k, x, z, Math.atan2(cx - x, cz - z)];
    });
    // Beit HaMoked: the ring round the hearth (30-courts.js: the hearth at (-18, -67.5), its stones 2.4 round), each rising to the nearest
    // place; and the way round the hearth to the gate (a figure never walks through the fire)
    const MOKED_RING = (() => {
      const spots = ringSpots(LOT1, -18, -67.5, 4.3, 4.3).map((x) => x.slice(1)), used = new Set();
      return RISE.map((r) => { let b = -1, bd = 1e9; spots.forEach((x, j) => { const d = Math.hypot(x[0] - r[0], x[1] - r[1]); if (!used.has(j) && d < bd) { bd = d; b = j; } }); used.add(b); return spots[b]; });
    })();
    const byHearth = (p) => { const sd = p[0] < -18 ? -1 : 1; return p[1] < -67.5 ? [[-18 + sd * 3.6, -70.6], [-18 + sd * 3.6, -64.4]] : p[1] < -64.4 ? [[-18 + sd * 3.6, -64.4]] : []; };
    const GZX = 86.25, GZZ = -67;   // GAZIT_PLACE_211: the middle of the hall's east half (60, -63.3 until 2.0.1 - where the hall stood before 1.9.5)
    const gather = (a, ids, t0, t1) => {   // all into the hall of hewn stone, its holy half ("מקום הפייס"), round the officer (model choice: an
      // ellipse, the officer in its gap at the door's side)
      for (const [k, x, z, yaw] of ringSpots(ids, GZX, GZZ, 2.5, 7.4, HP, 0.42)) {   // GAZIT_PLACE_211: the east half is ten by twenty-two, long north-south
        if (a.seen(k)) a.go(k, [x, z], t0, t1, { yaw });
        else a.at(k, x, z, yaw, t0);
      }
      if (a.seen("mem")) a.go("mem", [GZX, GZZ + 7.0], t0, t1, { yaw: Math.PI }); else a.at("mem", GZX, GZZ + 7.0, Math.PI, t0);
    };
    // the lamps by the reading (45-vessels.js: index 0..6 along the row - north-south: 0 the southern, 3 the middle, 6 the northern;
    // east-west: 0 the western, 6 the eastern)
    const lampSets = () => (TM.lamps === "rashi"
      ? { five: [0, 1, 2, 3, 4], east: 6, west: 5, light: false }   // the two eastern by the door; the western = the second from the east
      : { five: [0, 1, 2, 5, 6], east: 4, west: 3, light: true });  // the middle (the western) and the one north of it (Tiferet Yisrael)
    const menorahWay = () => {   // the priest's way to the stone before the menorah, and his place on its top step
      const m = SH.menorah;
      if (!m || !fnc(m.at)) return { pre: [-40, 3.5], ap: [-39.6, 6.5], stand: [-37.6, 6.5], y: HEI + houseRise(-37) + 1.42, yaw: HP, kuz: [-38, 6.9], kuzY: HEI + houseRise(-37) + 0.94 };
      const M = m.MEN;
      return { pre: m.ew ? [M.x + 0.4, M.z - 3.6] : [M.x - 3.4, M.z - 3.1], ap: m.at(0, -2.3), stand: m.at(0, -0.62), y: m.FL + m.stoneTop, yaw: M.rot,
        kuz: m.at(0.36, -1.05), kuzY: m.FL + 2 * m.stoneStep };
    };
    const GA = () => SH.goldenAltar || { x: -32.25, z: 0, top: 25.9 };   // ALTAR_EAST_305
    const BOWSPOT = (p) => [GA().x + 5.0, p[1]];   // BOW_SPOT_209: where one bows in the heichal after his service at the golden altar - east of it
    const RING2 = [42, -30];   // Rambam 1:11 "על קרן צפונית מערבית של בית המטבחים על טבעת שניה" - model choice: the second ring of the western
    // column from that corner (40-altar.js: the rings at 42 + 4i, -18 - 6j; the north is -z)
    // ---------------------------------------------------------------- THE STAGES (each its own words in TAMID_DATA, by its id)
    const SC = {};
    // MAARACHOT2_211: where the unconsumed limbs lie (the altar's frame): on the old fire, at the altar's east side ("לצדדי המזבח"), on the new pyre
    const OLDL = { fire: [[61.0, 3.3, 0.0], [62.6, 3.35, 2.2], [60.4, 3.3, 3.1]], side: [[66.2, 0.25, -2.4], [66.3, 0.25, -0.6], [66.2, 0.25, 1.2]], back: [[61.3, 3.5, -0.9], [62.5, 3.55, 1.4], [61.1, 3.5, 2.7]] };
    const oldAt = (where, i) => { const p = OLDL[where][i]; return V3(p[0], TOP + p[1], p[2]); };
    // ---------------------------------------------------------------- NIGHT_WATCH_305: the night's watch and Gevini's call
    // (the user, 19.11.2026 21:24: "5. להוסיף את איש הר הבית, כולל שומר ישן וכו', תוסיף אח"כ את גביני צועק (את הצעקה תדגים בתנועות גוף
    // עם יד על הפה וכד', והמלל בכתובית)... את בן בבי שמכה אותם (תעשה אחד ער ואחד ישן - ובישן הכאה)"; 23:26: "2. כתפא"י", "3. ב"; 23:49:
    // "שלום עליך - א"). Every figure walks the chel on its own floor (y 0: hintY gives the court's there), between the court's wall
    // (z -74.25, x -96.75) and the soreg (z -80, x -100). The places of the posts, the lanterns and the ways - model choices.
    const ON_CHEL = (pts) => pts.map((p) => [p[0], p[1], 0]);
    const NWP = { gk: [-41.6, -75.9], gn: [-71.6, -75.8], gc: [-97.9, -76.0], gp: [-97.7, -6.0], cloak: [-70.4, -76.2] }; //   // (the cloak falls on his east side, before the stone - NIGHT_SIT_305)
    const faceTo = (from, to) => Math.atan2(to[0] - from[0], to[1] - from[1]);
    const upAt = (p, yaw) => [p[0] + 0.62 * Math.sin(yaw), p[1] + 0.62 * Math.cos(yaw)];   // NIGHT_SIT_305: where he stands up (SIT.step before the stone)
    const NIGHT_FIGS = ["ihb", "bbv", "gk", "gn", "gc", "gp"];
    SC.ihb = (a) => {
      const GM = TM.shalom === "gemara";   // the row "״שלום עליך״": the guard says it (the Gemara, Tamid 27b; the Rambam) - or the officer (the Mishnah)
      a.set("lanterns", 1, 0);
      a.set("lantA", 1, 0);
      a.at("gc", NWP.gc[0], NWP.gc[1], -2.36, 0, { y: 0 });   // the north-west corner's guard, awake, at his post all night
      // NIGHT_SIT_305: the guards on their stones - the gate of the offering's awake, the gate of the spark's and the one behind the
      // house of the kaporet asleep, wrapped in their cloaks
      a.at("gk", NWP.gk[0], NWP.gk[1], Math.PI, 0, { y: 0, pose: "sit" });
      a.at("gn", NWP.gn[0], NWP.gn[1], Math.PI, 0, { y: 0, pose: "doze" });
      a.cloak("gn", 0, 21.0);   // CLOAK_S2: on him until he throws it (16.4 until now)
      a.at("gp", NWP.gp[0], NWP.gp[1], -HP, 0, { y: 0, pose: "doze" });
      a.cloak("gp", 0);
      // ---- Ish Har HaBayit (Middot 1:2): along the north chel, westward
      const p0 = [-36.5, -78.0], p1 = [-40.4, -78.0], p2 = [-69.8, -77.9], p3 = [-70.6, -77.3];
      a.hold("ihb", "stick", "R", 0);
      a.at("ihb", p0[0], p0[1], -HP, 0, { y: 0 });
      a.walk("ihb", ON_CHEL([p0, p1]), 0.8, 2.6, { yaw: faceTo(p1, NWP.gk) });
      a.tag("ihb", "איש הר הבית", 0.6, 26);
      // the guard of the gate of the offering is awake: he sees him by the lantern's light and rises (Tiferet Yisrael: "כדי שכשהשומר ער,
      // יראה להשר ויקום לפניו")
      a.face("gk", faceTo(NWP.gk, p1), 2.4);
      a.pose("gk", "situp", 2.4, 3.3);
      const gkU = upAt(NWP.gk, faceTo(NWP.gk, p1));
      a.at("gk", gkU[0], gkU[1], faceTo(NWP.gk, p1), 3.3, { y: 0 });
      if (GM) { a.pose("gk", "hail", 3.6, 5.6); a.tag("gk", "״איש הר הבית, שלום עליך״", 3.6, 6.2); }
      a.walk("ihb", ON_CHEL([p1, [-55, -78.2], p2]), 6.4, 11.2, { yaw: faceTo(p2, NWP.gn) });
      a.face("gk", Math.PI, 7.5);
      // the guard of the gate of the spark sleeps: he does not rise
      if (!GM) { a.pose("ihb", "hail", 12.0, 13.8); a.tag("ihb", "״שלום עליך״", 12.0, 14.2); }
      a.walk("ihb", ON_CHEL([p2, p3]), 14.4, 14.9, { yaw: faceTo(p3, NWP.gn) });
      a.pose("ihb", "strike", 14.9, 16.3);
      a.fx("strike", 15.25); a.fx("strike", 15.95);
      a.ramp("joltN", 1, 0, 15.25, 15.65); a.ramp("joltN", 1, 0, 15.95, 16.35);
      // CLOAK_S2 (fix-s2, 23.11.2026 - the user, of the morning's night: "שריפת כסותו — הכוונה הבגד שעליו, כדי להעיר אותו!"; Middot 1:2,
      // 89:3: "ורשות היה לו לשרף את כסותו... קול בן לוי לוקה ובגדיו נשרפין, שישן לו על משמרו"): the blows do not wake him;
      // the officer takes the torch from the lantern and sets a small flame to the hem of the cloak while it is still on him, and only
      // then he wakes and leaps up, throws the cloak from him to the ground, where it burns a little and dies down. No harm to the body:
      // the flame only at the hem, small, and the cloak off him at once. (Until now he woke at the blows, his cloak fell, and the
      // officer burned it on the ground.) The flame's size, the timing and where it falls - model choices
      const pl = [-73.0, -75.9];
      a.walk("ihb", ON_CHEL([p3, pl]), 16.6, 17.6, { yaw: faceTo(pl, [-73.6, -75.0]) });
      a.pose("ihb", "reachL", 17.6, 18.2);
      a.set("ltorchOut", 1, 18.0);
      a.hold("ihb", "ltorch", "L", 18.0);
      const pc = [-71.05, -77.0];   // by his west side, the face to the hem of his cloak
      const hem = [-71.95, 0.78, -75.7];   // the cloak's hem at his west side, by the seat (he sits facing north: yaw PI)
      a.walk("ihb", ON_CHEL([pl, pc]), 18.3, 19.1, { yaw: faceTo(pc, [hem[0], hem[2]]) });
      a.pose("ihb", "lowerL", 19.2, 20.4);
      a.set("cloakCloth", 0, 19.5);
      a.put("cloakN", hem[0], hem[1], hem[2], 19.5, 0.5);
      a.ramp("cloakFire", 0, 0.24, 19.6, 20.2);   // a small flame at the hem
      a.fx("ignite", 19.6);
      // now he wakes - the cloak still on him - and leaps up, throwing it from him
      a.face("gn", faceTo(NWP.gn, p3), 20.5);
      a.pose("gn", "wake", 20.5, 21.5);
      a.set("cloakCloth", 1, 21.0);
      a.fly("cloakN", [NWP.cloak[0] - 0.9, 0.02, NWP.cloak[1] + 0.5], 21.0, 21.6, 0.5);
      a.ramp("cloakFire", 0.24, 0.5, 21.6, 22.4);
      const gnU = upAt(NWP.gn, faceTo(NWP.gn, p3));
      a.at("gn", gnU[0], gnU[1], faceTo(NWP.gn, p3), 21.5, { y: 0 });
      a.walk("gn", ON_CHEL([gnU, [-72.6, -76.6]]), 21.6, 22.4, { yaw: faceTo([-72.6, -76.6], [NWP.cloak[0] - 0.9, NWP.cloak[1] + 0.5]) });
      // the torch back to the lantern
      a.fx("torch", 21.2);
      a.walk("ihb", ON_CHEL([pc, pl]), 21.2, 22.0, { yaw: faceTo(pl, [-73.6, -75.0]) });
      a.pose("ihb", "reachL", 22.0, 22.5);
      a.gone("ltorch", 22.3);
      a.set("ltorchOut", 0, 22.3);
      a.ramp("cloakFire", 0.5, 0.25, 23, 26);
      // ---- Ben Bavi (Shekalim 5:1 "בן בבי על הפקיע"; the Yachin there: "והיה הוא או אנשיו חוזרים על המשמורת בלילה"): by the west
      a.set("lantA", 2, 26.0);
      const b0 = [-91.0, -78.2], b1 = [-99.2, -78.4], b2 = [-99.1, -8.2], b3 = [-98.9, -6.9];
      a.hold("bbv", "pakia", "R", 26.0);
      a.at("bbv", b0[0], b0[1], -HP, 26.0, { y: 0 });
      a.tag("bbv", "בן בבי — על הפקיע", 26.0, 46);
      a.walk("bbv", ON_CHEL([b0, b1]), 26.4, 28.6, { yaw: faceTo(b1, NWP.gc) });
      a.face("gc", faceTo(NWP.gc, b1), 27.8);
      a.walk("bbv", ON_CHEL([b1, [-99.2, -60], [-99.1, -20], b2]), 30.0, 36.6, { yaw: faceTo(b2, NWP.gp) });
      a.face("gc", -2.36, 31.0);
      a.walk("bbv", ON_CHEL([b2, b3]), 37.6, 38.1, { yaw: faceTo(b3, NWP.gp) });
      a.pose("bbv", "strike", 38.1, 39.5);
      a.fx("strike", 38.45); a.fx("strike", 39.15);
      a.ramp("joltP", 1, 0, 38.45, 38.85); a.ramp("joltP", 1, 0, 39.15, 39.55);
      a.face("gp", faceTo(NWP.gp, b3), 39.6);
      a.pose("gp", "wake", 39.6, 40.6);
      const gpU = upAt(NWP.gp, faceTo(NWP.gp, b3));
      a.at("gp", gpU[0], gpU[1], faceTo(NWP.gp, b3), 40.6, { y: 0 });
    };
    // Gevini the herald (the Bartenura on Tamid 3:8: "כהן ששמו גביני, שהיה מכריז בכל בוקר בבית המקדש"; the Yachin there: "מכריז בכל
    // בוקר בהר הבית לפני שער בית המוקד הסגור" - on the landing, as in the officers' layer, GEVINI_211): up the flight, his hands about
    // his mouth; first to the gate (the priests within), then to the chel (the Levites and Israel) - model choice. The officer stands
    // at the gate from the stage before (Tamid 1:2 "פעמים שהוא בא מקריאת הגבר, או סמוך לו מלפניו או מלאחריו").
    SC.gevini = (a) => {
      a.roofs();
      const gv = [-15.5, -78.9];
      a.walk("gev", [[3.0, -78.65], [-11.5, -78.65], [-12.6, -78.75], [gv[0], gv[1], 13.5]], 0.2, 3.0, { yaw: 0 });
      a.tag("gev", "גביני — הכרוז", 0.2, 14);
      a.pose("gev", "call", 3.3, 13.4);
      [[6.2, 0.8], [6.35, 1.6], [6.5, 2.4], [6.65, Math.PI]].forEach(([t, y]) => a.face("gev", y, t));
    };
    SC.moked = (a) => {
      a.roofs();
      for (let i = 0; i < 3; i++) { const q = oldAt("fire", i); a.put("old" + (i + 1), q[0], q[1], q[2], 0, i * 1.1); }   // MAARACHOT2_211
      // NIGHT_WATCH_305: the officers of the watch gone; the lanterns' light at the flight and its landing
      for (const k of ["ihb", "bbv"]) a.hide(k, 0);
      for (const pr of ["cloakN", "stick", "pakia", "ltorch"]) a.gone(pr, 0);
      a.set("lantA", 3, 0);
      a.walk("mem", [[8, -78.65], [1.5, -78.65], [-12, -78.65], [-13.2, -79.4], [-18, -79.4, 13.5]], 1, 9.2, { yaw: 0 });   // NIGHT_WATCH_305: 2..12 until 3.0.4 (CAMK.moked) //   // MOKED_KNOCK_215: on the landing, clear of the leaf ajar   // CHEL_211: across the chel and up the flight along the house's north face
    };
    // the first lot: Abaye's order - in Beit HaMoked round the hearth; the Rambam's - the first and the second together, in the hall of
    // hewn stone, after the search (6:1)
    SC.lot1 = (a) => {
      a.roofs();
      if (a.prev === "moked" || a.prev === "gevini") {   // NIGHT_WATCH_305: after Gevini's call too
        // MOKED_KNOCK_215: on the landing before the gate (z -79.8..-77.5, 13.5 high) - until 2.0.14 at z -80.5, beyond its edge, so the
        // officer stood on the ground below it and walked in through the landing's stone; the gate opens (CHEL_GATE_215)
        a.at("mem", -18, -79.4, 0, 0, { h: 13.5 });
        a.pose("mem", "knock", 0.5, 3);
        a.fx("knock", 0.6);
        a.fx("door", 1.7);   // SOUND_211: "והם פתחו לו"
        a.ramp("chelG", 0, 1, 1.7, 2.6);
        a.set("sleepers", 0, 2.2);
        LOT1.forEach((k, i) => {
          const sp = MOKED_RING[i], yaw = Math.atan2(-18 - sp[0], -67.5 - sp[1]);
          { const r0 = riseOf(i); a.at(k, r0[0], r0[1], yaw, 2.2, { h: i < 4 ? riseH(i) : F }); }
          // LOT1_RING_211: the ring's spot is [x, z, yaw] - given whole as a path point, its yaw was read as the floor's height, and the
          // ten sank under the floor when they reached the ring (so it was in 2.0.1 as published, found 15.11.2026 while the wider
          // house was checked)
          a.walk(k, [riseOf(i), [sp[0], sp[1]]], 2.6 + i * 0.12, 5.4 + i * 0.12, { yaw });
        });
        a.walk("mem", [[-18, -79.4, 13.5], [-18, -74.4], [-18, -72.2]], 3, 6.5, { yaw: 0 });
        for (const k of LOT1) a.pose(k, "fingers", 8, 13);
        a.pose("mem", "point", 8.5, 12.5);
        a.tag("t", "זכה בתרומת הדשן", 13);
        return;
      }
      gather(a, ALLP, 0, 6.5);
      for (const k of ALLP) a.pose(k, "fingers", 7, 11);
      a.pose("mem", "point", 7.5, 11);
      a.tag("t", "זכה בתרומת הדשן", 11.5);
      R13.forEach((k, i) => a.tag(k, ROLE[k], 12 + i * 0.4));
    };
    // the search with torches (1:3): the officer opens the wicket, all come out after him, two groups go round the court - one by the east,
    // one by the west (behind the house and along the south) - and meet at the chamber of the chavitin's makers by the Nikanor gate (model
    // choice: the lanes; the walk is quick). In the Rambam's order the stage begins with the knock and the waking (6:1).
    // KLI_SHIR_211: they meet before the chavitin chamber's door (through the court's east wall at z 24, the bar shura broken there) - the
    // ends were at x 92.4, inside the wall's thickness (x 91..96), and the third of the east group stood on the bar shura (x 90..91)
    const EAST = [[-14, -52.4], [36, -51.2], [62, -50.6], [74.5, -47], [75.4, -20], [75.4, 14.4], [85.0, 16.2]];   // CHAMBERS_EAST_N2: the lane x 74.5..75.4 and the end before the door in the chamber's north wall (z 19.5)
    const WEST = [[-22, -52.4], [-80, -52.4], [-88.4, -44], [-88.4, 44], [-80, 53.6], [16, 53.6], [44.5, 54.2],   // PLATFORM_215: z 53.6 (52.2 until 2.0.14 - the third, 1.4 inside, walked in the ulam's platform)
      [66, 54.2], [73, 46], [75.4, 28], [75.4, 14.8], [87.4, 16.2]];
    SC.patrol = (a) => {
      const night = a.prev === "moked" || a.prev === "gevini";   // (the Rambam's order; NIGHT_WATCH_305)
      a.roofs(0, 9);
      let t0 = 1;
      const start = {};
      if (night) {
        a.at("mem", -18, -79.4, 0, 0, { h: 13.5 });   // MOKED_KNOCK_215
        a.pose("mem", "knock", 0.5, 2.6);
        a.fx("knock", 0.6);
        a.fx("door", 1.7);   // SOUND_211: "והם פתחו לו"
        a.ramp("chelG", 0, 1, 1.7, 2.6);   // CHEL_GATE_215
        a.set("sleepers", 0, 2.4);
        LOT1.forEach((k, i) => { const r0 = riseOf(i); a.at(k, r0[0], r0[1], Math.PI, 2.4, { h: i < 4 ? riseH(i) : F }); start[k] = r0; });
      } else LOT1.forEach((k) => { start[k] = a.from(k, [-18, -64]); });
      // KEY_SLAB_211 (stage ב; the user, 14.11.2026 22:22): first to the marble tablet - he lifts it by its ring and takes the key from the
      // chain under it ("נטל את המפתח" - Tamid 1:3; "מתחת הטבלא של שיש" - Melechet Shlomo there; Middot 1:9), puts the tablet back, and
      // then to the wicket. He stands north of the tablet, facing south (model choice)
      const SL = SH.mokedSlab, sp = SL ? [SL.x, SL.z - 1.25] : [-20, -71.75];
      if (night) a.walk("mem", [[-18, -79.4, 13.5], [-18, -74.4], sp], 2.8, 4.4, { yaw: 0 });
      else a.walk("mem", [a.from("mem", [-18, -72.2]), sp], 1, 1.8, { yaw: 0 });
      const ts = night ? 4.6 : 2;
      a.pose("mem", "scoop", ts, ts + 2.6);
      a.ramp("slab", 0, 1, ts + 0.3, ts + 1.1);
      a.set("slabKeys", 0, ts + 1.5);
      a.hold("mem", "keys", "R", ts + 1.5);
      a.ramp("slab", 1, 0, ts + 1.8, ts + 2.5);
      a.fx("door", ts + 2.4);   // SOUND_211: the tablet back in its place
      a.tag("mem", "מגביה את טבלת השיש בטבעת — המפתחות תחתיה (מידות א, ט)", ts, ts + 3);
      t0 = ts + 2.8;
      const mp = sp;
      a.walk("mem", [mp, ...byHearth(mp), [-18, -59.6]], t0, t0 + 1.4, { hold: true, yaw: 0 });
      a.pose("mem", "knock", t0 + 1.4, t0 + 2.6);   // the key in the wicket
      a.tag("mem", "״נטל את המפתח ופתח את הפשפש״", t0 + 1.2, t0 + 4.2);   // KEYS_211: Tamid 1:3 (88:4), as a caption
      a.fx("door", t0 + 2.3); a.fx("torch", t0 + 3.4); a.fx("torch", 13); a.fx("torch", 21);   // SOUND_211: "ופתח את הפשפש"; the torches
      a.walk("mem", [[-18, -59.6], [-18, -55.3], [-18.6, -53.2]], t0 + 2.6, t0 + 4, { yaw: Math.PI });
      a.gone("keys", t0 + 4.2);   // KEY_SLAB_211 (model choice: kept in his clothes)
      const E = ["b1", "s5", "s6"], Wg = ["b3", "s7", "s8"], stay = ["t", "b2", "b4", "s1"];
      a.hold("b1", "torch1", "R", 0);
      a.hold("b3", "torch2", "R", 0);
      a.set("torches", [1, 1], 0);
      const out = (k, i, list, t1, t2, side) => a.walk(k, [start[k], ...byHearth(start[k]), [-18 + side * 0.6, -59.6], [-18 + side * 0.6, -55.4], ...list.map(([x, z]) => [x + (i ? -0.9 * i * side : 0), z - 0.7 * i])], t1, t2);
      E.forEach((k, i) => out(k, i, EAST, t0 + 3 + i * 0.4, 24.6 + i * 0.4, 1));
      Wg.forEach((k, i) => out(k, i, WEST, t0 + 3.2 + i * 0.4, 27 + i * 0.4, -1));
      stay.forEach((k, i) => a.walk(k, [start[k], ...byHearth(start[k]), [-18, -59.6], [-18, -55.4], [-21.4 + i * 1.6, -51.8 + (i % 2) * 0.8]], t0 + 4 + i * 0.4, t0 + 7.5 + i * 0.4, { yaw: Math.PI }));
      for (const k of [...E, ...Wg]) a.pose(k, "greet", 28.5, 31.5);
      // SHALOM_211 (stage ב, point 20; the user: "מוחשי יותר"): "הגיעו אלו ואלו, אמרו שלום, הכל שלום" (Tamid 1:3) - the words as captions
      a.tag("b1", "״שלום״", 28.6, 35);
      a.tag("b3", "״הכל שלום״", 29.6, 36.5);
      a.at("cv", 87, 20.5, Math.PI, 31);   // "העמידו עושי חבתים לעשות חבתים" (CHAMBERS_EAST_N2: in the door of the chamber, in the court of Israel - the door in its north wall, x 87, z 19.5; his face north, to those who come; KLI_SHIR_211: x 96.7, z 24 until now)
      a.tag("cv", "עושי חביתין", 31);
      a.set("torches", [0, 0], 33.6);
      a.gone("torch1", 33.6); a.gone("torch2", 33.6);
    };
    // KIYOR_A2 / KIDDUSH_A2 (fix-a2; the user's decisions 58, 82, 38): the winner turns Ben Katin's wheel and the arm raises the laver
    // out of the well onto its base (the Mefaresh, Tamid 28b, 2105:153); then he sanctifies at a spout: he opens its tap, puts his right
    // hand on his right foot and his left hand on his left foot, bows and sanctifies all four at once - Zevachim 19b (130:754) "מניח ידו
    // הימנית על גבי רגלו הימנית, וידו השמאלית על גבי רגלו השמאלית, ומקדש"; the Rambam, Biat HaMikdash 5:16 (340:93) "ושוחה ומקדש"; and the
    // water goes down to the floor. Until now (KIDDUSH_FOOT_213) the right foot raised under the stream, then the left.
    const KIY = () => (fnc(SH.kiyorInfo) ? SH.kiyorInfo() : { R: 2, x: 22, z: 54.7, foot: F + 1.3, spouts: [] });
    KID.spotAt = (i, out = 1.75) => { const I = KIY(), o = I.spouts[i] || { a: -HP }, r = I.R + out; return { p: [I.x + Math.sin(o.a) * r, I.z + Math.cos(o.a) * r], yaw: o.a + Math.PI }; };
    // KIDDUSH_FLAT_A2: where he stands for the palms on the feet - sideways to the spout, the laver at his left: the stream comes out of
    // the spout and falls in an arc (KID.waterAt) past his left side, under his bowed body, onto the backs of his hands on his feet; his
    // hands' middle d amot out from the spout's mouth (until now he faced the laver - bowed so, his body was under the stream). Model choice
    // SPOUT_211_K (fix-k, 23.11.2026 - decision 211: the mouths come down to 1.5 over the floor, 40-altar.js; the coordinator: "תתאים גם את
    // מיקום הכהן כך שיעמוד מתחת לזרם"): the water leaves the low mouth level and falls KID_DX out onto his hands; it comes to him from his
    // FRONT-LEFT (KID_PH from his face), not from his left: stooping as a man stoops (KIDDUSH_CROUCH_K) his shoulders and head are over his
    // hands, and from the side or behind the jet passes through his left arm or the kutonet - measured over all sides and distances
    // (both readings, "tk" and "ryose"): from 45 degrees and 2.0 out its axis keeps 0.059 / 0.051 from him (the stream's own half-breadth
    // 0.03). Until now he stood sideways, the laver at his left, his hands 0.9 out. Model choice
    const KID_PH = Math.PI / 4, KID_DX = 2.0;
    KID.flatSpot = (i, d = KID_DX) => {
      const I = KIY(), o = I.spouts[i] || { a: -HP, p: [I.x, F, I.z - I.R] }, ua = [Math.sin(o.a), Math.cos(o.a)];
      const rh = Math.hypot(o.p[0] - I.x, o.p[2] - I.z) + d, yaw = o.a + Math.PI - KID_PH, fw = [Math.sin(yaw), Math.cos(yaw)], hz = (SH.priestKit && SH.priestKit.kidHZ) || 0.29;
      return { p: [I.x + ua[0] * rh - fw[0] * hz, I.z + ua[1] * rh - fw[1] * hz], yaw };
    };
    const WHEEL_SPOT = [15.15, 57.15];   // west of the drum's handles (40-altar.js: the post x 17.4, z 58.05; the handles at x 16.05)
    SC.kiyor = (a) => {
      a.putA("machtaS", 46.4, 14.1, 0, Math.PI);   // "והרי המחתה נתונה במקצוע בין הכבש למזבח, במערבו של כבש"
      a.go("t", WHEEL_SPOT, 0, 9.4, { yaw: HP });   // PACE_215: round the house and the altar
      a.pose("t", "carry", 9.6, 14.2);              // his hands on the wheel's handles
      a.ramp("mukhni", 1, 0, 9.8, 14);
      a.fx("mukhni", 10.6);
      const W8 = KID.flatSpot(6);                   // the spout on the laver's west side (40-altar.js: spout 6 at 270 degrees) - KIDDUSH_FLAT_A2
      a.walk("t", [WHEEL_SPOT, [WHEEL_SPOT[0] + 1.2, 54.2], W8.p], 14.4, 15.6, { yaw: W8.yaw });
      a.pose("t", "kiddush", 15.8, 19.6);
      a.set("kidWater", 1, 16.4); a.set("kidWater", 0, 19.0);
      a.fx("water", 16.4);   // SOUND_211
      a.tag("t", "מסובב את הגלגל ומעלה את הכיור; ואחר כך מקדש — יד ימין על רגל ימין ויד שמאל על רגל שמאל, שוחה ומקדש (זבחים יט:)", 9.6, 19.6);
    };
    // KIYOR_A2 (the user's decision 83): THE TWELVE AT ONCE - "כדי שיהיו שנים עשר אחיו הכהנים העסוקין בתמיד מקדשין ידיהן ורגליהן בבת
    // אחת. תנא: שחרית במילואו — מקדש ידיו ורגליו מן העליון" (Yoma 37a, 107:888): s1 at the upper spout, s2..s12 at the eleven. In R. Yose
    // b. R. Yehuda's reading his fellow (b1) stands by s1 and helps him ("וחבירו מסייעו", 130:755). Who stands where - model choices.
    SC.kiyor12 = (a) => {
      for (let i = 0; i < 12; i++) {
        const k = "s" + (i + 1), q = KID.flatSpot(i);   // KIDDUSH_FLAT_A2 (KID.spotAt(i, 1.55 / 1.75) - facing the laver - until now)
        a.go(k, q.p, 0.2 + i * 0.15, 7 + i * 0.15, { yaw: q.yaw });
        a.pose(k, "kiddush", 8.6 + (i % 3) * 0.1, 15.4);
      }
      a.set("kidWater", 12, 9.2); a.set("kidWater", 0, 15);
      a.fx("water", 9.2);
      if (TM.kidd === "ryose") {
        // KIDDUSH_RYOSE_A2: "וחבירו מסייעו" (Zevachim 19b, 130:755) - the one at the upper spout (s1), standing on one foot, is held by
        // a fellow (b1): at his right (away from the laver), his face to him, his hands on his side and back. KIDDUSH_HELP1_A2 (the user's
        // decision 120 b, via the coordinator: "חבר אחד בלבד, אצל הכהן שבדד העליון. שאר האחד עשר מקדשים בלי חבר מצויר") - until now a
        // fellow for each of the twelve. Who he is and where he stands - model choices
        {
          const q = KID.flatSpot(0), side = [q.p[0] - Math.cos(q.yaw) * 0.72, q.p[1] + Math.sin(q.yaw) * 0.72];
          a.go("b1", side, 0.4, 7.6, { yaw: q.yaw + HP });
          a.pose("b1", "support", 8.4, 15.4);
        }
        a.tag("b1", "״וחבירו מסייעו״ (זבחים יט:) — לרבי יוסי ברבי יהודה", 8.6, 15.4);
        a.tag("s4", "״מניח שתי ידיו זו על גב זו, ועל גבי שתי רגליו זו על גבי זו״ (זבחים יט:)", 8.6, 15.4);
      }
      a.tag("s1", "מן הדד העליון — ״שחרית במילואו מקדש ידיו ורגליו מן העליון״ (יומא לז.)", 8.6, 15.4);
      a.tag("s6", "שנים עשר כהנים מקדשים בבת אחת", 8.6, 15.4);
    };
    SC.terumah = (a) => {
      const pan = A(45.3, 15.3);
      a.go("t", pan, 0, 4.2, { yaw: Math.PI * 0.8 });
      a.hold("t", "machtaS", "R", 4.4);
      // EAST_UP_211 (the refuter, R-12): "בכל יום כהנים עולים במזרחו של כבש ויורדין במערבו" (Yoma 4:5; 55:35) - every ascent of the
      // demonstration runs on the ramp's EAST half (x 58..61; its middle 55.5) and every descent on the west half. Until this fix the
      // ascents ran on the west half too - against the very rule that the new arrows on the ramp teach. From the fire-pan (west of the
      // ramp) he walks down to the ramp's foot, across it, and up its east side.
      // CIRCUIT_304 (the user, 19.11.2026 19:24, of the Mishnah Zevachim 6:3 - 130:2152 - "כל העולין למזבח עולין דרך ימין, ומקיפין,
      // ויורדין דרך שמאל... מה לא ברור בזה? זה לא נקרא הקפה"; the Rambam, Ma'aseh HaKorbanot 7:11, 341:123, and his commentary there:
      // "וסובב על המזבח כלו"): up the east side to the inner coals at the night's heap (NIGHT_COALS_304: by the old fire's south-west),
      // then round the whole altar on the priests' walk - east, the south-east horn, north, west, south - and down the ramp's WEST side;
      // below, round the ramp's foot to its east (the user, 19:35: "מאושר"; no source names it) and north some ten amot (Tamid 1:4;
      // the Tiferet Yisrael, 818:126 "עד י' אמות מתחלת תחתית הכבש"). Until 2.0.12 he went down straight from the coals, no circuit.
      const SC0 = A(59.0, 4.7);   // by the heap's south-west foot, his face to its heart
      a.walk("t", [pan, A(46.6, 41.9), A(49.6, 41.9), A(60.2, 41.7), A(60.0, 12.2), A(59.6, 8.0), SC0], 4.8, 10.6, { hold: true, yaw: 2.6 });
      a.pose("t", "scoop", 10.8, 14);
      a.fx("coals", 11.2);   // SOUND_211
      a.set("coalsS", 1, 13);
      a.walk("t", [SC0, A(60.8, 9.0), A(68.0, 9.0), A(68.0, -16.0), A(43.0, -16.0), A(43.0, 9.0), A(51.2, 9.4)], 14.2, 22.0, { hold: true, yaw: 0 });   // CIRCUIT_304: the priests' walk
      a.walk("t", [A(51.2, 9.4), A(51.2, 12.2), A(50.6, 40.6), A(55.5, 42.2), A(64.4, 42.3), A(64.4, 33.4)], 22.2, 29.4, { hold: true, yaw: Math.PI });
      a.pose("t", "pour", 29.8, 32.4);
      a.fx("coals", 30.2);   // SOUND_211
      a.set("coalsS", 0, 31.4);
      a.putA("ashHeap", 64.05, 32.4, 31.2);
      a.putA("machtaS", 65.3, 34.3, 33.4, 0.4);
      a.tag("t", "תרומת הדשן", 1, 14.1);
      a.tag("t", "מקיף את כל המזבח — ״ומקיפין, ויורדין דרך שמאל״", 14.2, 22.1);   // CIRCUIT_304
      a.tag("t", "יורד במערב הכבש, ומקיף את רגלו אל מזרח הכבש", 22.2, 29.5);
      a.tag("t", "צובר את הגחלים — כעשר אמות מתחתית הכבש", 29.6, 33.4);
      // BROTHERS_215: the two brothers who stood by Beit HaMoked go, at a walk, to the meeting place of the patrol before the chavitin
      // makers' chamber (Tamid 1:3, "הגיעו אלו ואלו אצל בית עושי חביתין"), where their brothers stand - so that the run to the laver in
      // the next stage ("והם רצו ובאו", 2:1) starts there for all four, and not 150 amot away (until 2.0.14 it was run in 4.4 s)
      a.go("b2", [86.0, 16.4], 3, 21, { yaw: Math.PI });   // CHAMBERS_EAST_N2: before the door in the chamber's north wall (x 87, z 19.5) - north of it, their backs to the door
      a.go("b4", [87.8, 16.4], 3.6, 21.6, { yaw: Math.PI });
      // (in the Rambam's order the lots were cast in the hall of hewn stone after the search: the two who carried the torches come too)
      a.go("b1", [85.0, 16.2], 3.3, 21.3, { yaw: Math.PI });
      a.go("b3", [87.4, 16.2], 3.9, 21.9, { yaw: Math.PI });
    };
    const TAP = [0.55, 0.95, 1.35, 1.75].map((f) => [ACX + Math.cos(f * Math.PI) * 4.6, ACZ + Math.sin(f * Math.PI) * 4.6]);   // round the heap, clear of the pyre
    const B4 = ["b1", "b2", "b3", "b4"];
    SC.tapuach = (a) => {
      B4.forEach((k, i) => {
        const w = [23.2 + i * 1.3, 52.8];
        a.go(k, w, 0, 6.4, { yaw: 0 });   // PACE_215 / BROTHERS_215: from the chavitin chamber, running (4.4 s until 2.0.14)
        a.pose(k, "wash", 6.6, 8.8);
        a.hold(k, "tool" + (i + 1), "R", 9.0);
        const c = A(TAP[i][0], TAP[i][1]);
        a.walk(k, [w, ...route(w, A(58.0 + i * 0.9, 41.4)).slice(1), A(58.2 + i * 0.9, 12.2), c], 9.1, 14.3, { hold: true, yaw: Math.atan2(ACX - TAP[i][0], ACZ - TAP[i][1]) });   // EAST_UP_211
        a.pose(k, "shovel", 14.5, 21);
      });
      a.ramp("tap", 1, 1.28, 15, 21);
      a.fx("water", 6.9); a.fx("coals", 15.2); a.fx("coals", 18.2);   // SOUND_211
      a.tag("b1", "האחים", 1, 8);
      // MAARACHOT2_211: "האברין והפדרין שלא נתאכלו מבערב, סונקין אותם לצדדי המזבח" (Tamid 2:1) - before the ash goes up to the heap
      for (let i = 0; i < 3; i++) a.fly("old" + (i + 1), oldAt("side", i), 14.4 + i * 0.4, 15.4 + i * 0.4, 0.5);
      a.tag("b2", "״סונקין אותם לצדדי המזבח״ — האברים שלא נתאכלו", 14.2, 18.5);
    };
    // ONE_KOHEN_211 (the refuter, R-04; the user, 15.11.2026 18:13: approved): THE GREAT PYRE AND THE TWO LOGS OF THE MORNING ARE ONE
    // PRIEST'S WORK - the one who won the terumah: "מי שזכה בתרומת הדשן (יזכה) בסידור מערכה ובשני גזירי עצים" (Yoma 22a; 107:486);
    // the Rambam, Temidin uMusafin 4:5 (344:59): "והוא מסדר את המערכה. והוא מעלה שני גזרי עצים למזבח"; 2:3 (344:18): "שני גזרים של בין
    // הערבים מעלין אותן שני כהנים... אבל של שחר בכהן אחד"; the Tiferet Yisrael, Tamid 2 (818:163, 179): "וזה שזכה בתרומת הדשן הולך בראשון
    // ונושא ב' גזירי עצים", "אותו שזכה בתרומת הדשן מסדר המערכה הגדולה... ואחרים מסדרין מערכה שנייה של קטורת... ואח"כ הזוכה בתרומת הדשן
    // מניח ב' הגיזרין על המערכה הגדולה". Until this fix the four brothers laid the great pyre and two of them laid the logs (the
    // evening's rule), and the winner stood aside. Now: he goes up first with the two logs; his brothers bring the wood up after him
    // ("החלו מעלין בגזרין", Tamid 2:3) and hand it over; he lays the pyre, and - alone - the two logs. THE SECOND PYRE (the user, 18:39:
    // "הוסף שיטה בתוך המצגת לכמה שניות"): the brothers lay it, as the Tiferet Yisrael; and for a few seconds the Rambam's way is said and
    // shown - Temidin 6:1 (344:87) "ואחר כך מסדר מערכה גדולה. ואחר כך מסדר מערכה שניה" - the winner steps over to it.
    // The spots and the times: model choices. Every ascent on the ramp's east side (EAST_UP_211).
    const T_PYRE = () => A(61.9, 7.0), BRO = [[59.3, 8.6], [60.9, 9.0], [62.9, 9.0], [64.5, 8.6]];
    SC.maarachah = (a) => {
      // SALT_A2 (the user's decision 51): before the wood goes up - "בוזקין מלח על גבי כבש בשביל שלא יחליקו" (Eruvin 104a, 105:3801), "בהולכת
      // עצים למערכה" (3807); the salt strewn on the ramp is the altar's own (40-altar.js SALT_A2) - here it is said
      a.tag("t", "״בוזקין מלח על גבי כבש בשביל שלא יחליקו״ — בהולכת עצים למערכה (עירובין קד.)", 0.2, 3.6);
      const tp = T_PYRE(), t0 = a.from("t", A(64.4, 33.4));
      a.walk("t", [t0, A(64.6, 42.3), A(60.9, 41.9)], 0.3, 2.0, { yaw: -HP });
      a.hold("t", "carryT", "R", 2.1);
      a.walk("t", [A(60.9, 41.9), A(60.9, 12.2), tp], 2.3, 6.0, { carry: true, yaw: Math.PI });
      a.putA("carryT", 65.4, 6.9, 6.3, 0, TOP + 0.06);   // the two boards wait beside him on the altar's top (the spot: model choice)
      B4.forEach((k, i) => {
        a.gone("tool" + (i + 1), 0);
        const c = a.from(k, A(TAP[i][0], TAP[i][1])), sp = A(BRO[i][0], BRO[i][1]);
        a.walk(k, [c, A(50.8 + i * 0.9, 12.2), A(50.4 + i * 0.9, 41.2)], 0.4 + i * 0.25, 4.2 + i * 0.25);
        a.hold(k, "carry" + (i + 1), "R", 4.4 + i * 0.25);
        a.walk(k, [A(50.4 + i * 0.9, 41.2), A(58.0 + i * 0.9, 41.5), A(58.2 + i * 0.9, 12.2), sp], 4.7 + i * 0.25, 9.6 + i * 0.25, { carry: true, yaw: Math.PI });
        a.pose(k, "place", 9.9 + i * 0.25, 11.0 + i * 0.25);
        a.gone("carry" + (i + 1), 10.6 + i * 0.25);
      });
      a.pose("t", "place", 8.6, 16.6);
      a.ramp("l1", 0, 4, 10.4, 16.6);
      a.ramp("night", 1, 0, 10.4, 16.6);   // NIGHT_COALS_304: the great pyre laid - its logs come, the night's heap goes
      a.fx("wood", 10.4); a.fx("wood", 13.4);   // SOUND_211
      a.tag("b1", "אחיו הכהנים מעלים את העצים — ״החלו מעלין בגזרין״", 4.6, 10.2);
      a.tag("t", "הזוכה בתרומת הדשן מסדר את המערכה הגדולה (יומא כב.)", 6.4, 17.5);
    };
    SC.maarachah2 = (a) => {
      a.walk("b1", [a.from("b1", A(BRO[0][0], BRO[0][1])), A(57.6, 8.6), A(50, 7.4), A(47.7, 5.6)], 0.5, 5, { yaw: -HP });
      a.walk("b2", [a.from("b2", A(BRO[1][0], BRO[1][1])), A(57.2, 9.4), A(50, 8.6), A(47.7, 4.4)], 0.8, 5.3, { yaw: -HP });
      a.pose("b1", "place", 5.5, 9); a.pose("b2", "place", 5.8, 9);
      a.ramp("l2", 0, 3, 6, 10);
      a.fx("wood", 6);   // SOUND_211
      a.tag("b1", "המערכה השנייה, של קטורת — ״ואחרים מסדרין״ (תפארת ישראל)", 1.2, 9.2);
      // the Rambam's way, for a few seconds: the winner himself comes over to the second pyre
      a.walk("t", [a.from("t", T_PYRE()), A(57.4, 9.6), A(51.4, 8.8), A(49.9, 6.6)], 9.2, 11.6, { yaw: -HP });
      a.pose("t", "place", 11.8, 13.4);
      a.tag("t", "ולרמב״ם (תמידין ו, א) — הזוכה בתרומת הדשן מסדר גם את המערכה השנייה", 9.4, 15.6);
      // MAARACHOT2_211: the third arrangement, "לקיים מצות האש" (the Rambam, Temidin uMusafin 2:4; 344:19) - when the reading "מניין המערכות"
      // has three or four (40-altar.js ctx2.shared.maarachot; its logs at (46, -11) in the altar's frame burn all the while in the model)
      const MC = SH.maarachot;
      if (MC && MC.count >= 3) {
        a.walk("b2", [A(47.7, 4.4), A(48.7, -2), A(48.9, -9.4)], 9.3, 11.2, { yaw: -HP });
        a.pose("b2", "place", 11.4, 13.6);
        a.fx("wood", 11.6);
        a.tag("b2", "המערכה השלישית — לקיום האש (רבי יוסי, יומא ד, ו; רמב״ם תמידין ב, ד)", 11.2, 15.6);
      }
    };
    SC.gezirin = (a) => {
      const tp = T_PYRE();
      a.walk("t", [a.from("t", A(49.9, 6.6)), A(51.4, 8.8), A(57.4, 9.6), tp], 0.2, 2.0, { yaw: Math.PI });
      a.pose("t", "place", 2.3, 5);
      a.gone("carryT", 3.9);
      a.set("gz", 1, 4);
      a.fx("wood", 2.6);   // SOUND_211
      a.tag("t", "שני גזרי עצים — בשחר כהן אחד מעלה אותם, הזוכה בתרומת הדשן (רמב״ם תמידין ב, ג)", 1.2, 5.2);
      // MAARACHOT2_211: "האברים והפדרים שלא נתאכלו מבערב, מחזירין אותן למערכה" (Tamid 2:5), and the kindling in the gaps (2:4)
      a.from("b3", A(BRO[2][0], BRO[2][1])); a.from("b4", A(BRO[3][0], BRO[3][1]));
      a.pose("b3", "place", 5.4, 7.2);
      for (let i = 0; i < 3; i++) a.fly("old" + (i + 1), oldAt("back", i), 5.5 + i * 0.35, 6.6 + i * 0.35, 0.8);
      a.tag("b3", "״מחזירין אותן למערכה״ (תמיד ב, ה)", 5.3, 7.6);
      [-2.9, 0, 2.9].forEach((dz, i) => { const q = V3(61.95, TOP + 3.32, ACZ + 4.5 + dz); a.put("kindle" + (i + 1), q[0], q[1], q[2], 7.6 + i * 0.3); });
      a.tag("b4", "מציתין את האליתא — ״ורוח היה בין הגזרין״ (תמיד ב, ד)", 7.6, 9.6);
      for (let i = 1; i <= 3; i++) a.gone("kindle" + i, 13.2);
      a.ramp("glow", 0, 1, 9.6, 13);
      a.fx("ignite", 10);
      a.tag("b3", "״הציתו שתי המערכות באש״", 9.8, 13.6);   // MAARACHOT_211: Tamid 2:5 (88:11), as a caption
    };
    SC.lot2 = (a) => {
      a.roofs();
      gather(a, ALLP, 0, 9);
      for (const k of ALLP) a.pose(k, "fingers", 10, 15);
      a.pose("mem", "point", 10.5, 15);
      R13.forEach((k, i) => a.tag(k, ROLE[k], 15.5 + i * 0.55));
    };
    SC.barkai = (a) => {
      for (const k of ["gk", "gn", "gc", "gp"]) a.hide(k, 0);   // NIGHT_WATCH_305: the watch ends with the light
      a.set("lanterns", 0, 0); a.set("lantA", 0, 0);
      a.roofs(0, 1);
      // BARKAI_UP_215: he leaves the hall and is seen on its roof (until 2.0.14 he slid there at once, through the wall), and after the
      // call he goes down out of sight - until 2.0.14 he stood on the roof to the Shema, and then was set inside the hall's west wall
      a.hide("b2", 0.4);
      a.at("b2", 79, -62, HP, 1.4, { h: 33.5 });   // "on a high place" (Bartenura) - model choice: the roof of the hall of hewn stone, looking east
      a.pose("b2", "point", 7, 16);
      // SOUND_211: no tone for "ברקאי" - a man's call is a caption only (the user, 15.11.2026: speech in the captions)
      // BARKAI_211 (stage ב, point 24; the user: "ברור יותר"): "אם הגיע, הרואה אומר, ברקאי" (Tamid 3:2) - the call itself, as a caption
      a.tag("b2", "הרואה — עולה למקום גבוה", 2, 7.8);
      a.tag("b2", "״ברקאי!״ — הגיע זמן השחיטה", 7.8, 15.4);
      a.hide("b2", 15.4);
      // GATES_TEKIOT_A2 (the user's decision 64): "שלש לפתיחת שערים" (Sukkah 5:5, 56:55) - "כשפותחים שערי העזרה היו תוקעים תקיעה תרועה
      // תקיעה" (the Bartenura there, 588:258; the Rambam, Klei HaMikdash 7:5, 338:106) - with the light, two priests with silver trumpets
      // at Nikanor's gate, inside it, facing east: a tekia, a terua and a tekia. Who blows and where - model choices.
      a.at("tr1", 91.4, -2.2, HP, 8.6); a.at("tr2", 91.4, 2.2, HP, 8.6);
      a.hold("tr1", "tru1", "R", 8.6); a.hold("tr2", "tru2", "R", 8.6);
      for (const [t0, t1, fx] of [[9.6, 11.0, "tekia"], [11.3, 12.5, "tekiaShort"], [12.8, 14.2, "tekia"]]) { a.pose("tr1", "trumpet", t0, t1); a.pose("tr2", "trumpet", t0, t1); a.fx(fx, t0 + 0.1); }
      a.tag("tr1", "שלש לפתיחת שערים — ״כשפותחים שערי העזרה היו תוקעים תקיעה תרועה תקיעה״ (ברטנורא סוכה ה, ה)", 9.4, 15.6);
    };
    SC.lamb = (a) => {
      // the lamb from its chamber - the south-west room of Beit HaMoked (30-courts.js, MOKED_WIDE_211: its doorway to the hall at x -25,
      // z -65.2; the chamber's wall to the aisle at x -23.3)
      a.go("s1", [-23.9, -66.9], 0, 6.6, { yaw: -HP });
      a.lamb(-25.0, -66.1, Math.PI, 6.8);
      const way = [[-25.0, -66.1], [-21.8, -66.6], [-19.4, -62.4], [-18, -57.5], [-17.4, -51.4]];
      a.walk("s1", [[-23.9, -66.9], [-21.2, -66.0], [-19.2, -61.4], [-18.8, -55.4], [-19.2, -50.2]], 7.2, 12, { yaw: HP });
      a.lambWalk(way, 7.4, 12.4, HP);
      a.fx("bleat", 8.2); a.fx("bleat", 15.4);   // SOUND_211
      a.go("s2", [-15.4, -49.6], 0, 9, { yaw: -HP * 0.7 });
      a.hold("s2", "cup", "R", 9);
      a.pose("s2", "offer", 13, 16.5);
      a.go("b1", [-16.6, -53.8], 0, 9.5, { yaw: -HP });
      a.hold("b1", "torch1", "R", 9.5);
      a.set("torches", [1, 0], 9.5);
      a.pose("b1", "offer", 18, 22.5);
      a.tag("s1", "השוחט", 1);
    };
    SC.tobeit = (a) => {
      a.gone("cup", 0); a.gone("torch1", 0); a.set("torches", [0, 0], 0);
      const lamb0 = [W.lamb.st.x || -17.4, W.lamb.st.z || -51.4];
      const way = [lamb0, [8, -52.4], [18.6, -52.4], [34.4, -51.0], [36, -47.8], [40.9, -34.6], [42, -31.1]];   // PLATFORM_215: round the ulam's corner and its steps' corner
      a.lambWalk(way, 0.6, 9, 0);
      a.walk("s1", [a.from("s1", [-19.2, -50.2]), [8, -53.8], [18.6, -53.8], [34.6, -52.4], [36, -49.2], [43.4, -35.4], [43.5, -32.4]], 0.4, 9, { yaw: -HP });
      ["s5", "s6", "s7", "s8", "s9", "s10"].forEach((k, i) => a.go(k, [45.2 + (i % 3) * 1.4, -37.2 - Math.floor(i / 3) * 1.4], 1 + i * 0.3, 11 + i * 0.3, { yaw: Math.PI * 0.85 }));
      // NINE_215: the meal, the cakes and the wine (Tamid 4:3 - the nine who carry to the ramp) come out of the hall after them, and wait
      // behind them (model choice); until 2.0.14 they stayed in the hall and were set by the row of the nine at once, 50 amot away
      ["s11", "s12", "s13"].forEach((k, i) => a.go(k, [45.2 + i * 1.4, -40.2], 2.8 + i * 0.3, 13 + i * 0.3, { yaw: Math.PI * 0.85 }));
      a.tag("s1", "השוחט", 1.5);
    };
    SC.keys = (a) => {
      a.go("s3", [11.6, -1.6], 0, 11, { hold: true, yaw: -HP });
      a.go("s4", [11.6, 1.6], 0.3, 11.3, { hold: true, yaw: -HP });
      a.hold("s3", "teni", "R", 0); a.hold("s4", "kuz", "R", 0);
      a.tag("s3", "הטני", 3); a.tag("s4", "הכוז", 3);
    };
    SC.gate = (a) => {
      // to the northern wicket (50-heichal.js: the Sages' way - from the wicket to the cell, from the cell into the heichal)
      a.walk("s3", [a.from("s3", [11.6, -1.6]), [6.4, -12], [3.4, -18.6], [0.4, -19]], 0, 4.4, { hold: true });
      a.hide("s3", 4.6);
      a.at("s3", -6.4, -2.8, HP, 14, { pose: "stand" });
      a.ramp("gate", 0, 1, 10, 15.5);
      a.fx("gate", 10);
      for (const i of lampSets().five) a.lamp(i, 1, 0, 2, 3);   // by now five have gone out (the morning finds two burning, 3:9)
      a.tag("s3", "הפשפש הצפוני", 0.5, 4.6);
    };
    SC.inner = (a) => {
      const g = GA(), sp = [g.x + 1.5, g.z];
      a.walk("s3", [a.from("s3", [-6.4, -2.8]), [-24, -1.4], sp], 0, 4, { hold: true, yaw: -HP });
      a.put("teni", g.x + 1.1, null, g.z + 0.95, 4.2);
      a.pose("s3", "scoop", 4.5, 11);
      a.fx("coals", 5.2);   // SOUND_211
      a.ramp("ashGold", 1, 0, 5, 11);
      a.ramp("teniAsh", 0, 1, 5, 11);
      a.walk("s3", [sp, [-24, -1.6], [-6, -1.6], [10.6, -2.6]], 12, 15.6, { yaw: HP });
    };
    const toMenorah = (a, k, t0, t1, hold) => {
      const w = menorahWay(), p = a.from(k, [11.6, 1.6]);
      a.walk(k, [p, [-6, 1.4], [-29, 3], w.pre, w.ap, w.stand], t0, t1, { hold, yaw: w.yaw });
      a.at(k, w.stand[0], w.stand[1], w.yaw, t1 + 0.05, { y: w.y });
      return w;
    };
    SC.lamps5 = (a) => {
      const L = lampSets();
      for (const i of L.five) a.lamp(i, 0, 0, 0, 0.1);
      const w = toMenorah(a, "s4", 0, 5, true);
      L.five.forEach((i, n) => {
        const t = 6 + n * 2.6;
        a.trim("s4", i, t, t + 2.6);   // LAMPS_HANDS_219: his hand at this lamp while it is dressed (and lit, in the Rambam's reading)
        a.hold("s4", "kuz", i > 3 ? "R" : "L", t);   // the kuz in his other hand (the lamps past the middle are on his left, in both readings)
        if (L.light) a.lamp(i, 0, 1, t + 1.8, t + 2.4);   // the Rambam: "ומדליק נר שכבה" (3:12)
      });
      a.hold("s4", "kuz", "R", 19);   // LAMPS_HANDS_219: until now "reach" 6..19.5 - both hands 1.2..1.4 amot over the lamps
      a.put("kuz", w.kuz[0], w.kuzY, w.kuz[1], 25.5, w.yaw);
      a.walk("s4", [w.stand, w.ap, w.pre, [-29, 3], [-6, 1.4], [10.6, 2.6]], 26.5, 29.6, { yaw: HP });
      a.tag("s4", "מטיב חמש נרות", 6, 21);
    };
    SC.akedah = (a) => {
      const [rx, rz] = RING2;
      a.lamb(rx, rz - 0.9, 0, 0, "bound");   // "ראשו לדרום ופניו למערב" - the head at the ring, the body north of it
      [["s5", 40.6, rz - 0.8, HP], ["s6", 40.6, rz - 1.9, HP], ["s7", 40.7, rz - 3, HP], ["s8", 41.6, rz - 3.9, 0], ["s9", 42.8, rz - 3.9, 0], ["s10", 44, rz - 3.4, -HP * 0.6]]
        .forEach(([k, x, z, yaw], i) => { a.go(k, [x, z], 0.3 + i * 0.15, 3.6 + i * 0.15, { yaw }); a.pose(k, "hold", 4 + i * 0.1); });
      a.go("s1", [rx + 1.5, rz - 1.1], 0.8, 3.2, { yaw: -HP });   // "השוחט עומד במזרח ופניו למערב"
      a.go("s2", [rx - 0.9, rz + 1.2], 0, 8, { yaw: Math.PI * 0.8 });
      a.hold("s2", "mizrak", "R", 8.2);
      a.tag("s2", "המקבל — הזורק", 9);
      a.tag("s1", "השוחט", 9);
      a.hold("s1", "knife", "R", 3.4);   // KNIFE_A2
      a.pose("s1", "hold", 3.6);
    };
    SC.dam = (a) => {
      const [rx, rz] = RING2;
      a.lamb(rx, rz - 0.9, 0, 0, "bound");
      a.set("mizrak", 1, 1.6);
      const ne = A(72.4, -20.4), sw = A(38.2, 13.6), ys = A(41.4, 13.9);
      a.walk("s2", [a.from("s2", [rx - 0.9, rz + 1.2]), [rx - 0.6, -9.6], A(71.6, -21.4), ne], 2.2, 5.6, { hold: true, yaw: -Math.PI / 4 });
      a.pose("s2", "throw", 5.8, 7.6);
      a.blood("ne", 6.0, 7.6);   // BLOOD_THROW_A2: the jet seen (6.6 .. 7.4 until now)
      a.walk("s2", [ne, A(71.6, -21.4), A(38.2, -21.2), sw], 7.8, 11, { hold: true, yaw: Math.PI * 0.75 });
      a.pose("s2", "throw", 11.2, 13.0);
      a.blood("sw", 11.4, 13.0);
      a.walk("s2", [sw, ys], 14, 15.2, { yaw: Math.PI });
      a.pose("s2", "pour", 16, 19);
      a.blood("ys", 16.6, 18.6);
      a.set("mizrak", 0, 18.6);
      a.tag("s2", "הזורק", 0.5);
    };
    // the nine in a row with the limbs (4:3), to the lower half of the ramp, its west side, and salt (Rambam 6:3)
    const NINE = ["s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13"];
    const onRamp = (i) => A(48.25, 30.2 + i * 1.25);
    // SHULCHAN_210: the two tables west of the ramp (40-altar.js: ctx2.shared.rampTables, in mv's frame; R. Yose's first altar moves them
    // with the ramps, 2 east and 4 north)
    const tableLocal = (k) => {
      const RT = SH.rampTables, p = RT && RT[k] ? RT[k] : k === "silver" ? [40, 18.2] : [40, 16];
      const y = !!(SH.altarMeasures && SH.altarMeasures.mode === "yose");
      return [p[0] + (y ? 2 : 0), p[1] + (y ? -4 : 0)];
    };
    const tableAt = (k) => { const p = tableLocal(k); return A(p[0], p[1]); };
    const tableTop = () => (SH.rampTables && SH.rampTables.top) || 1.5;
    SC.evarim = (a) => {
      a.lambGone(0.5);
      a.gone("mizrak", 0);
      a.gone("knife", 0);   // KNIFE_A2
      NINE.forEach((k, i) => {
        const row = [44.4 + i * 1.3, -33.4];
        a.walk(k, [a.from(k, row), row], 0, 0.8 + i * 0.25, { yaw: Math.PI });   // NINE_215: a walk to the row (until 2.0.14 set there at once)
        a.hold(k, "p" + (i + 1), "R", 0.4);
        const s = onRamp(i);
        // TABLES_215: west of the two tables by the altar's south-west corner (x 39.4..40.6, z 28..31.2) - until 2.0.14 the way cut over
        // the silver table's corner
        a.walk(k, [row, [38.4, -10], [38.4, 26], [38.2, 33.6], A(41.6, 30), A(46.6, 41.9), A(48.9, 42.3), [48.9, s[1]]], 1 + i * 0.25, 11 + i * 0.25, { carry: true, yaw: -HP });
        a.put("p" + (i + 1), s[0], null, s[1], 12 + i * 0.12, HP);
        a.pose(k, "place", 11.4 + i * 0.25, 12.6 + i * 0.25);
      });
      a.tag("s5", "האברים", 2, 14);   // SALT_STAGE_S2: the salt in the stage of its own (below; until now put here at 15 s)
    };
    // KIYOR_LIGHT_S2: the stage "kiyor" (its own script is not touched - the kiddush is agent H's, HANDS_K) lit while it is shown, and
    // not in the stages after it (they replay it at its end: the light off at its end)
    { const sk0 = SC.kiyor; if (sk0) SC.kiyor = (a) => { sk0(a); a.set("kiyorLit", 1, 0); a.set("kiyorLit", 0, (DATA.stages.kiyor ? DATA.stages.kiyor.dur : 20) + 0.5); }; }
    // SALT_STAGE_S2: "ומלחום" (Tamid 4:3) - each of the nine, on the ramp east of what he set down, his face to the west: a scoop of salt,
    // then over his part, twice; the grains seen on the parts
    SC.melach = (a) => {
      NINE.forEach((k, i) => {
        const s = onRamp(i);
        a.at(k, 48.9, s[1], -HP, 0, { y: null });
        for (const r of [0, 3.6]) {
          const t0 = 0.8 + r + i * 0.28;
          a.pose(k, "scoop", t0, t0 + 1.1);
          a.pose(k, "place", t0 + 1.2, t0 + 2.4);
          a.hold(k, "saltH" + (i + 1), "R", t0 + 0.7);   // the pinch, from the scoop until it is strewn over his part
          a.gone("saltH" + (i + 1), t0 + 2.2);
        }
      });
      a.put("salt", onRamp(4)[0] + 0.05, null, onRamp(4)[1], 2.2);
      a.tag("s5", "מולחים את האברים", 0.6, 11.5);
    };
    SC.shema = (a) => {
      a.roofs();
      gather(a, ALLP, 0, 8.5);
    };
    SC.lot34 = (a) => {
      a.roofs();
      gather(a, ALLP, 0, 0.1);
      for (const k of ALLP) a.pose(k, "fingers", 2, 7);
      a.tag("k", "זכה בקטורת", 7.5);
      a.tag("e", "מעלה האברים מן הכבש למזבח", 10);
    };
    SC.machta = (a) => {
      a.hold("k", "kaf", "R", 0.5);
      a.go("k", [37.6, 21], 0.5, 9, { hold: true, yaw: -HP });
      a.tag("k", "הכף", 1, 12);
      // SHULCHAN_210: the golden machta lies on the silver table, by the altar's south-west corner (40-altar.js) - he comes down the ramp,
      // round the foot of the path to the yesod, and stands east of the table, his face to the west
      const sv = tableLocal("silver");
      const up = A(60.4, 41.4), coal = A(47.8, 6.6), stand = A(sv[0] + 1.25, sv[1] + 0.1);
      a.go("mc", A(66, 35.4), 0.5, 7.8, { yaw: -HP });
      a.hold("mc", "machtaS", "R", 8);
      a.walk("mc", [A(66, 35.4), A(64.6, 42.2), up, A(60.6, 12.2), A(52, 8.6), coal], 8.2, 12.8, { hold: true, yaw: -HP });
      a.pose("mc", "scoop", 13, 14.6);
      a.fx("coals", 13.2);   // SOUND_211
      a.set("coalsS", 1, 14);
      a.walk("mc", [coal, A(50.6, 12.2), A(50.4, 41.2), A(46.8, 42), A(44.2, 38.8), A(42.2, 30), A(41.6, 22.5), stand], 14.8, 17.8, { hold: true, yaw: -HP });
      a.putA("machtaG", sv[0], sv[1] - 0.35, 0, HP, F + tableTop() + 0.02);   // on the silver table (Rambam Beit HaBechirah 2:15: the table of silver for the vessels)
      a.pose("mc", "pour", 18, 19.6);
      a.fx("coals", 18.2);   // SOUND_211
      a.set("coalsS", 0, 19); a.set("coalsG", 1, 19);
      a.putA("machtaS", sv[0], sv[1] + 0.4, 19.7, HP, F + tableTop() + 0.02);
      a.hold("mc", "machtaG", "R", 19.8);
      a.tag("mc", "מי שזכה במחתה", 9.5);
    };
    const stepsSpot = (i, n) => [34.6 - (i % 2) * 1.6, -13 + (i / Math.max(1, n - 1)) * 26];
    SC.magrefa = (a) => {
      a.hold("b4", "magrefa", "R", 0);
      a.go("b4", [38.2, -6], 0, 5, { hold: true, yaw: -HP });
      a.pose("b4", "throw", 5.2, 6.2);
      a.fly("magrefa", [28, floorAt(28, -2) + 0.52, -2], 5.7, 6.6, 1.6);
      a.fx("magrefa", 6.6);
      REST.forEach((k, i) => a.go(k, stepsSpot(i, REST.length), 7 + i * 0.1, 12 + i * 0.1, { yaw: -HP }));
      [["k", [27, 3.4]], ["mc", [27, 5.4]], ["f", [27, 7.4]], ["s3", [27, -3.4]], ["s4", [27, -5.4]], ["e", [33, 14]], ["s11", [33, 16]], ["s12", [33, 18]], ["s13", [33, 20]]]
        .forEach(([k, p], i) => a.go(k, p, 7 + i * 0.15, 12.2 + i * 0.15, { yaw: -HP, hold: k === "k" || k === "mc" }));
      // LEVITES_211 / SINGERS_211: in through Nikanor's gate, then each to his place along the duchan - the twelve singers in its
      // middle part (six north and six south of the middle, where Ben Arza stands with the cymbal and the two trumpeters come later),
      // and the players beyond them on both sides: five lyres north; four lyres and the two harps south (the spots: model choices)
      // CHAMBERS_EAST_N2 (fix-n2): the chambers of the gate stand in the court of Israel now (z -28.5..-19.5 and 19.5..28.5, x 82.5..91.5) and
      // close the way along the duchan beyond them - the twelve singers stay in the duchan's middle (x 83.3, z +-3.6..15.6 and the one at
      // 0.6) and the eleven players (five lyres north, four lyres and the two harps south: as before) stand in a second row on the step of an
      // amah (x 84.7), between the chambers (z -18.2..18.2; until now z +-18.4..30.4, in one row)
      const LX = [84.7, 84.7, 84.7, 84.7, 84.7, 84.7, 84.7, 84.7, 84.7, 84.7, 84.7, 83.3, 83.3, 83.3, 83.3, 83.3, 83.3, 83.3, 83.3, 83.3, 83.3, 83.3, 83.3, 83.3];
      const LZ = [-18.2, -15.8, -13.4, -11.0, -8.6, 6.2, 8.6, 11.0, 13.4, 15.8, 18.2, 0.6,
        -15.6, -13.2, -10.8, -8.4, -6.0, -3.6, 3.6, 6.0, 8.4, 10.8, 13.2, 15.6];
      // LEVITES_GATE_215: two files through the gate's opening (its walls at z ±5, the low wall west of it open at |z| < 5.6),
      // and only west of the wicket frames (x 89.7) each turns to his place
      LEV_IDS.forEach((k, i) => {
        const s = LZ[i] < 0 ? -1.2 : 1.2;
        a.walk(k, [[98.4, s], [89.4, s], [LX[i], LZ[i]]], 7 + i * 0.12, 12.4 + i * 0.12, { yaw: HP });   // DUCHAN_GAP_A2: on the duchan's second step (x 83..83.5; until then 86.3); LEVITES_EAST_A2: their faces to the people, east (the user's decision 99; west until now)
        if (i < 9) a.hold(k, "lyre" + (i + 1), "L", 7);
        else if (i < 11) a.hold(k, "nevel" + (i - 8), "L", 7);
      });
      a.hold("ba", "cymL", "L", 7); a.hold("ba", "cymR", "R", 7);
      // TZOARIM_A2: the little ones behind them, on the ground of the court of Israel before the duchan's step (x 85.4), their heads at
      // the height of the Levites' legs, by the singers (their spots - model choices)
      [[-6.0, -1], [6.0, 1], [10.8, 1]].forEach(([z, sd], i) => a.walk(LEV_KIDS[i], [[98.4, sd * 1.2], [89.4, sd * 1.2], [85.45, z]], 10.2 + i * 0.3, 14.2 + i * 0.3, { yaw: HP }));   // LEVITES_EAST_A2
      a.tag("y2", "צוערי הלויים — ״בארץ היו עומדין, וראשיהן מבין רגלי הלוים״ (ערכין ב, ו)", 14.4, 18);
      a.tag("v6", "שנים עשר לויים — אומרים שירה בפה (רמב״ם כלי המקדש ג, ג)", 10, 14);
      a.tag("l3", "המנגנים בכלי שיר — אינם ממניין השנים עשר", 10.6, 14);
    };
    SC.teni = (a) => {
      const g = GA(), sp = [g.x + 1.8, g.z - 0.4];
      a.put("magrefa", 28, floorAt(28, -2) + 0.52, -2, 0);
      a.walk("s3", [a.from("s3", [27, -3.4]), [15, -1.4], [-6, -1.4], [-24, -1.6], sp], 0, 5, { yaw: -HP });
      a.hold("s3", "teni", "R", 5.2);
      // BOW_SPOT_209 (the user, 13.11.2026 02:57: "...כאילו הוא משתחוה על המזבח"): he bowed where he stood, by the golden altar, and lay
      // over it - now he steps back east first, and bows toward the devir with the altar before him, not under him (model choice: 4.4 east)
      const bs = BOWSPOT(sp);
      a.walk("s3", [sp, bs], 5.4, 6.1, { hold: true, yaw: -HP });
      a.face("s3", -HP, 6.1); a.pose("s3", "prostrate", 6.2, 9.2);   // PROSTRATE_WEST_209: toward the devir
      a.walk("s3", [bs, [-24, -1.6], [-6, -1.6], [15, -2], [19.2, -4.6]], 9.5, 13.6, { hold: true, yaw: HP });
    };
    SC.lamps2 = (a) => {
      const L = lampSets();
      const w = toMenorah(a, "s4", 0, 4.6, false);
      a.trim("s4", L.east, 5.2, 11.2);   // LAMPS_HANDS_219: his hand at the eastern lamp while it is dressed (until now "reach" 5..12, over the lamps)
      if (L.light) { a.lamp(L.east, 1, 0.5, 6, 7.5); a.lamp(L.east, 0.5, 1, 9, 10.5); }   // the Rambam: "ונר שמצאו שלא כבה מתקנו" (3:12)
      else a.lamp(L.east, 1, 0, 6, 8);                                                          // the Bartenura: new oil and wick, left unlit until the evening
      a.tag("s4", L.light ? "מתקן את הנר שמצפון לאמצעי — האמצעי נשאר דולק" : "מדשן את המזרחי — המערבי נשאר דולק", 6, 16);
      a.walk("s4", [w.stand, w.ap], 12.6, 13.6);
      a.hold("s4", "kuz", "R", 14);
      a.face("s4", -HP, 14.7); a.pose("s4", "prostrate", 14.8, 17.6);   // PROSTRATE_WEST_209: toward the devir (he stood at the menorah)
      a.walk("s4", [w.ap, w.pre, [-29, 3], [-6, 1.4], [15, 2], [19.2, 4.6]], 18, 21.6, { hold: true, yaw: HP });
    };
    SC.gechalim = (a) => {
      const g = GA(), sp = [g.x + 1.6, g.z + 0.3];
      a.walk("mc", [...route(a.from("mc", [27, 5.4]), [-6, 1.2]), [-24, 1.2], sp], 0, 5, { hold: true, yaw: -HP });
      a.pose("mc", "pour", 5.5, 8.5);
      a.fx("coals", 5.8);   // SOUND_211
      a.set("coalsG", 0, 7);
      a.ramp("coals", 0, 1, 6, 8);
      const bs = BOWSPOT(sp);   // BOW_SPOT_209: back from the golden altar before he bows
      a.walk("mc", [sp, bs], 8.6, 9.3, { hold: true, yaw: -HP });
      a.face("mc", -HP, 9.3); a.pose("mc", "prostrate", 9.4, 11.6);   // PROSTRATE_WEST_209: toward the devir
      a.walk("mc", [bs, [-24, 1.2], [-6, 1.2], [15, 2], [19.2, 6.6]], 11.6, 13.8, { hold: true, yaw: HP });   // CUT_215: ends within the stage (14 s; to 14.2 until 2.0.14 - he was set the last 3 amot at once)
    };
    SC.ketoret = (a) => {
      const g = GA(), sk = [g.x + 1.7, g.z - 0.2], sf = [g.x + 2.5, g.z - 1.4];
      a.set("coals", 1, 0);
      a.walk("k", [...route(a.from("k", [27, 3.4]), [-6, 0.4]), [-24, 0.4], sk], 0, 5, { hold: true, yaw: -HP });
      a.walk("f", [...route(a.from("f", [27, 7.4]), [-6, -0.8]), [-24, -0.8], sf], 0.3, 5.3, { yaw: -HP * 1.15 });
      a.set("kafLid", 0, 5.5);
      a.hold("f", "bazach", "R", 5.6);   // "נוטל את הבזך מתוך הכף ונותנו לאוהבו או לקרובו"
      a.pose("f", "offer", 7.6, 9.4);    // "נתפזר ממנו לתוכו, נותנו לו בחפניו"
      a.tag("f", "אוהבו או קרובו", 6, 12);
      a.walk("f", [sf, [-24, -1.6], [-6, -1.6], [15, -1]], 9.6, 13, { hold: true });
      a.go("mem", [16.2, -6], 0, 9, { yaw: -HP });
      a.pose("mem", "point", 12, 14.5);
      a.tag("mem", "הממונה: הקטר", 12, 16);
      // "פרשו העם" - the priests on the steps step back from between the ulam and the altar (model choice: to the north, by the rings)
      REST.forEach((k, i) => a.go(k, [41 + (i % 4) * 1.6, -21 - Math.floor(i / 4) * 1.6], 12.4 + i * 0.05, 16 + i * 0.05, { yaw: -HP }));
      ["b4", "e", "s11", "s12", "s13"].forEach((k, i) => a.go(k, [48 + i * 1.5, -24.8], 12.6, 16.2, { yaw: -HP }));
      a.pose("k", "pour", 14, 18);
      a.ramp("smoke", 0, 1, 15, 18);
      a.fx("hiss", 15);   // SOUND_211: the incense on the coals
      const bs = BOWSPOT(sk);   // BOW_SPOT_209: back from the golden altar before he bows
      a.walk("k", [sk, bs], 18.2, 18.9, { hold: true, yaw: -HP });
      a.face("k", -HP, 18.9); a.pose("k", "prostrate", 19, 21.5);   // PROSTRATE_WEST_209: toward the devir
      a.walk("k", [bs, [-24, 0.4], [-6, 0.4], [15, 1], [19.2, 2.6]], 22, 24, { hold: true, yaw: HP });
      a.tag("k", "המקטיר", 13, 22);
    };
    SC.birkat = (a) => {
      a.set("smoke", 1, 0); a.set("coals", 1, 0);
      // "עמדו הראשונים לדרום אחיהם הכהנים, וחמשה כלים בידם: הטני ביד אחד, והכוז ביד אחד, והמחתה ביד אחד, והבזך ביד אחד, וכף וכסויה ביד אחד"
      [["s3", "teni"], ["s4", "kuz"], ["mc", "machtaG"], ["f", "bazach"], ["k", "kaf"]].forEach(([k, p], i) => {
        a.hold(k, p, "R", 0);
        a.go(k, [21.6, 9.4 + i * 1.6], 0, 6, { yaw: HP, hold: true });
      });
      const others = [...REST, "b4", "e", "s11", "s12", "s13"];
      others.forEach((k, i) => a.go(k, [21.6, 7.6 - i * 1.6], 0.3 + i * 0.08, 6.5 + i * 0.08, { yaw: HP }));
      // BIRKAT_VESSELS_A2 (the user's decision 98: "הכלים לידם על המעלות, כבחלמיש; הידיים מורמות ופנויות"): the five set their vessels
      // down on the step beside them (at their left, between them and the next), raise their hands empty, and take them up again after
      [["s3", "teni"], ["s4", "kuz"], ["mc", "machtaG"], ["f", "bazach"], ["k", "kaf"]].forEach(([k, p], i) => {
        a.pose(k, "place", 8.7, 9.6);
        a.put(p, 21.95, null, 9.4 + i * 1.6 + 0.62, 9.3, HP);
        a.hold(k, p, "R", 18.9);
      });
      for (const k of [...others, "s3", "s4", "mc", "f", "k"]) a.pose(k, "raise", 10, 18.5);
      a.tag("s5", "״וחולקים אצבעותיהם... ה׳ אוירים״, ״תוך כפיהם כנגד הארץ״ (שו״ע או״ח קכח, יב)", 10.6, 18.5);   // BIRKAT_V_A2 (382:1024)
      // HP_TAMID_A2: Tamid 7:1 (88:38) "בזמן שכהן גדול נכנס להשתחוות, שלשה אוחזין בו, אחד בימינו, ואחד בשמאלו, ואחד באבנים טובות... נכנס
      // והשתחוה ויצא" - he goes into the heichal with three priests holding him (b1 at his right, b2 at his left, b3 before him by the
      // stones of the breastplate), bows and comes out; at the blessing he stands in the middle, his hands not above the tzitz - "חוץ מכהן
      // גדול שאינו מגביה את ידיו למעלה מן הציץ" (7:2, 88:39). The three's places - model choices.
      if (TM.hp === "on") {
        const IN = [[20.5, 0], [15, 0], [8, 0], [2.6, 0], [-6.2, 0], [-12, 0]];
        a.walk("hp", IN, 0, 5.2, { yaw: -HP });
        [["b1", 1.0, 0], ["b2", -1.0, 0], ["b3", 0, -0.75]].forEach(([k, dz, dx]) => a.walk(k, IN.map(([x, z]) => [x + dx, z + dz]), 0, 5.2, { yaw: -HP }));
        a.pose("hp", "prostrate", 5.4, 7.2);
        a.walk("hp", [[-12, 0], [-6.2, 0], [2.6, 0], [8, 0], [15, 0], [21.6, 0]], 7.4, 10, { yaw: HP });
        [["b1", 7.6, 1.6], ["b2", 7.6, -1.6], ["b3", 7.6, 3.2]].forEach(([k, t, z]) => a.walk(k, [[-12, z * 0.6], [2.6, z * 0.6], [15, z], [21.6, z * 6]], t, 10.2, { yaw: HP }));
        a.pose("hp", "raiseHP", 10.4, 18.5);   // BIRKAT_V_A2: blessing, his hands not over the tzitz (until now "offer" - held before him)
        a.tag("hp", "״בזמן שכהן גדול נכנס להשתחוות, שלשה אוחזין בו״ (תמיד ז, א)", 0.5, 7.2);
        a.tag("hp", "״חוץ מכהן גדול שאינו מגביה את ידיו למעלה מן הציץ״ (תמיד ז, ב)", 10.4, 18.5);
      }
      // SOUND_211: no chord for the blessing - the priests' words are a caption only (the user, 15.11.2026: speech in the captions)
    };
    const UPTOP = A(57.4, 7.2), FIRE = () => V3(61.9, TOP + 3.6, 1);
    SC.haalaah = (a) => {
      a.go("e", [48.9, onRamp(0)[1] + 0.6], 0, 5, { yaw: -HP });   // PACE_215: from the ulam's steps round the altar (3 s until 2.0.14)
      for (let i = 0; i < 3; i++) {
        const t = 5 + i * 5.0, at = [48.9, onRamp(2 * i)[1] + 0.6];
        a.hold("e", "p" + (2 * i + 1), "R", t);
        a.hold("e", "p" + (2 * i + 2), "L", t);
        a.walk("e", [at, A(59.6, (at[1] - D + 12.2) / 2), A(59.8, 12.2), UPTOP], t + 0.1, t + 2.4, { carry: true, yaw: HP * 0.6 });   // EAST_UP_211: the limbs lie on the ramp's west half (Tamid 4:3); he crosses to its east side as he climbs
        a.pose("e", "throw", t + 2.5, t + 3.1);
        a.fx("hiss", t + 3.2);   // SOUND_211
        a.fly("p" + (2 * i + 1), FIRE(), t + 2.6, t + 3.2, 1.2);
        a.fly("p" + (2 * i + 2), FIRE(), t + 2.7, t + 3.3, 1.2);
        a.gone("p" + (2 * i + 1), t + 3.3); a.gone("p" + (2 * i + 2), t + 3.4);
        if (i < 2) a.walk("e", [UPTOP, A(51.4, 12.2), [48.9, onRamp(2 * i + 2)[1] + 0.6]], t + 3.4, t + 5.0, { yaw: -HP });
      }
      a.tag("e", "מעלה האברים למזבח", 1);
      // HP_TAMID_A2: Tamid 7:3 (88:40) "בזמן שכהן גדול רוצה להקטיר, היה עולה בכבש והסגן בימינו. הגיע למחצית הכבש, אחז הסגן בימינו
      // והעלהו. הושיט לו הראשון הראש והרגל, וסמך עליהן וזרקן" - he goes up the ramp's east side with the deputy at his right; the one who
      // brings the limbs up hands them to him at the top, and he throws them (the others' order - as the stage)
      if (TM.hp === "on") {
        const up = [A(60.2, 41.7), A(60.0, 26), A(59.8, 12.2), A(58.6, 8.8)];
        a.walk("hp", up, 0, 4.6, { yaw: Math.PI });
        a.walk("sg", up.map((q) => [q[0] - 1.1, q[1]]), 0, 4.6, { yaw: Math.PI });
        a.pose("sg", "greet", 2.2, 4.4);
        for (let i = 0; i < 3; i++) { const t = 5 + i * 5.0; a.pose("hp", "offer", t + 2.2, t + 2.5); a.pose("hp", "throw", t + 2.5, t + 3.1); }
        a.tag("hp", "״בזמן שכהן גדול רוצה להקטיר, היה עולה בכבש והסגן בימינו״ (תמיד ז, ג)", 0.4, 6);
        a.tag("hp", "״הושיט לו הראשון הראש והרגל, וסמך עליהן וזרקן״ (תמיד ז, ג)", 6.2, 20);
      }
      // PACE_215: the two of the meal and the cakes walk meanwhile to their places by their parts on the ramp (until 2.0.14 they ran
      // there in the first 3 s of the next stage)
      a.go("s11", [48.9, onRamp(6)[1] + 0.6], 6, 18, { yaw: -HP });
      a.go("s12", [48.9, onRamp(7)[1] + 0.6], 7, 19, { yaw: -HP });
    };
    // DESHEN_211 (the user, 15.11.2026 18:12, with the sources he sent; the refuter R-05, S4-15): THE ASHES OF THE TENI AND THE KUZ ARE
    // POURED OUT AS SOON AS THE TWO VESSELS ARE TAKEN OUT, after the trimming of the two lamps - the Bartenura, Tamid 6:1 (634:201):
    // "היה ממתין עד לאחר זריקת התמיד שהיה הזוכה בדשון המנורה עושה הטבת שתי נרות וגומר השלמת דשון המנורה, ואז היו שניהן מוציאין זה הטני
    // וזה הכוז ושופכים הדשן במקום אחד אצל המזבח קדמה" (and on 3:9, 634:123); the Rosh on Tamid 33a (2224:289): "כדי שיוציאם ביחד". So a
    // stage of its own, "deshen", right after "lamps2" in BOTH orders (in Abaye's - before the incense; in the Rambam's, where the two
    // lamps follow the incense - after it). Until this fix the pouring stood inside "haalaah", after the incense and the blessing in
    // Abaye's order, and its time was called a model choice. Afterwards the two stand at the blessing with the vessels in their hands
    // (Tamid 7:2). The place: "מקום שנותנין מראות העוף ודשון מזבח הפנימי והמנורה" (Tamid 1:4; 88:5), east of the ramp; the Rambam
    // (Temidin uMusafin 3:12; 344:43): "משליכו במקום הדשן אצל המזבח עם דשון המזבח הפנימי והחיצון". The way there (round the ramp's foot,
    // north along its east side) and their spots east of the heap - model choices.
    SC.deshen = (a) => {
      [["s3", "teni"], ["s4", "kuz"]].forEach(([k, p], i) => {
        // ASH_PLACE_215: the two lanes across the ramp's foot lie north of its edge (z 55.2, where the chambers begin - until 2.0.14 the
        // second walked in their wall), and the two stand south of the small ramp (x 63.5..65.7, to z 44.4 - the first stood in it)
        const ap = A(65.25, 32.95 + i * 1.25), st = a.from(k, [19.2, i ? 4.6 : -4.6]);
        a.hold(k, p, "R", 0);
        a.walk(k, [...route(st, A(46.6, 42.0 - i * 0.7)), A(55.5, 41.6 - i * 0.7), A(64.6, 41.9 - i * 0.7), A(66.0, 39.6), ap], 0.4 + i * 0.5, 10.6 + i * 0.5, { hold: true, yaw: -HP });
        a.pose(k, "pour", 11.2 + i * 0.4, 14.0);
      });
      a.fx("coals", 11.7);   // SOUND_211
      a.set("teniAsh", 0, 12.8);
      a.tag("s3", "דישון מזבח הפנימי והמנורה — אל מקום הדשן שבמזרח הכבש", 9.6, 16.5);
    };
    SC.mincha = (a) => {
      ["s11", "s12"].forEach((k, i) => {
        // PACE_215: the stage is 17 s (14 until 2.0.14): in the Rambam's order the two come from the blessing on the ulam's steps (round
        // the altar, some 70 amot - they ran it in 3 s), in Abaye's they are at their places already (they came in the stage before)
        const at = [48.9, onRamp(6 + i)[1] + 0.6], t = 5.2 + i * 4.4;
        a.go(k, at, 0, 5.0 + i * 0.6, { yaw: -HP });
        a.hold(k, "p" + (7 + i), "R", t);
        a.walk(k, [at, A(59.6, (at[1] - D + 12.2) / 2), A(59.8, 12.2), UPTOP], t + 0.2, t + 2.6, { carry: true, yaw: HP * 0.6 });   // EAST_UP_211
        a.pose(k, "throw", t + 2.7, t + 3.3);
        a.fx("hiss", t + 3.4);   // SOUND_211
        a.fly("p" + (7 + i), FIRE(), t + 2.8, t + 3.4, 1);
        a.gone("p" + (7 + i), t + 3.5);
        a.walk(k, [UPTOP, A(51.4, 12.2), A(50.8, 34 + i * 1.6)], t + 3.6, t + 5.6);
      });
      // PACE_215: meanwhile the wine's priest to his place by the ramp, the deputy (with the flags) to its foot, and the two trumpeters to
      // the marble table (until 2.0.14 they all ran there in the first seconds of the next stage, some 120 amot in 5 s)
      a.go("s13", [48.9, onRamp(8)[1] + 0.6], 3, 13, { yaw: -HP });
      a.go("sg", A(46.0, 40.0), 1, 13, { yaw: -HP });
      { const tb = tableAt("marble"); a.go("tr1", [tb[0] - 1.3, tb[1] - 0.4], 1.5, 13.5, { yaw: HP }); a.go("tr2", [tb[0] - 1.3, tb[1] + 0.4], 2, 13.8, { yaw: HP }); }
    };
    const SFALIM_POUR = [44.4, 7.45];   // SFALIM_303: where the priest of the libations stands to pour into the wine's bowl (40-altar.js: x 43.95, z 9.4) - the jug in his right hand, west of him and 1.95 before him, over its middle
    SC.nesachim = (a) => {
      // the wine at the south-west horn (the libation bowls there); the deputy on the horn with the flags; two priests with silver
      // trumpets on the marble table (the table of the fats, Rambam 2:15), then beside Ben Arza at the duchan (model choice: its middle)
      a.go("s13", [48.9, onRamp(8)[1] + 0.6], 0, 2.6, { yaw: -HP });
      a.hold("s13", "p9", "R", 2.8);
      a.walk("s13", [[48.9, onRamp(8)[1] + 0.6], A(59.6, (onRamp(8)[1] + 0.6 - D + 12.2) / 2), A(59.4, 12.0), A(50.8, 9.8), A(46.6, 8.6), A(45.0, 8.05), A(SFALIM_POUR[0], SFALIM_POUR[1])], 3, 7, { carry: true, yaw: 0 });   // EAST_UP_211: up the east side, and at the top to his left, to the south-west horn; SFALIM_303: north of the bowls, to the wine's, facing it
      a.hold("sg", "flags", "R", 0);
      // SUDAR_A2: "הסגן עומד על הקרן" - up onto the south-west horn itself (its top: 40-altar.js, the hollow horns - he stands on its rim,
      // over the small square mouth), beside it on the altar's top first
      const HS = (SH.__horns || []).map((h) => { const v = h.getWorldPosition(new Vector3()); return { x: v.x, y: v.y + h.scale.y, z: v.z, h }; }).filter((q) => q.h.visible !== false && (!q.h.parent || q.h.parent.visible !== false));
      const sw = HS.length ? HS.reduce((b, q) => (q.z - q.x > b.z - b.x ? q : b)) : null;
      if (sw) {
        a.go("sg", [sw.x + 1.05, sw.z - 1.05], 0, 6, { hold: true, yaw: -Math.PI * 0.75 });
        a.at("sg", sw.x, sw.z, -Math.PI * 0.75, 6.3, { y: sw.y });
      } else a.go("sg", A(42.4, 7.4), 0, 6, { hold: true, yaw: -Math.PI * 0.75 });
      // SHULCHAN_210: the marble table stands by the altar's south-west corner (40-altar.js, ctx2.shared.rampTables - the Ra'avad); the
      // two step up onto it from its west side, and down to it again
      const tb = tableAt("marble"), TTOP = F + tableTop();
      const sw1 = [tb[0] - 1.3, tb[1] - 0.4], sw2 = [tb[0] - 1.3, tb[1] + 0.4];
      a.go("tr1", sw1, 0, 5.2, { hold: true, yaw: HP });
      a.go("tr2", sw2, 0, 5.2, { hold: true, yaw: HP });
      // TABLE_TRUMPETS_A2 (the user's decision 102; as the water's libation, 57-add208.js): both on the marble table, 0.38 apart from its
      // middle along z, their faces to the bowls of the libations (40-altar.js: x 43.95, z 9.4) - until now facing east
      const sfB = A(43.95, 9.4), ywB = (q) => Math.atan2(sfB[0] - q[0], sfB[1] - q[1]);
      a.at("tr1", tb[0], tb[1] - 0.38, ywB([tb[0], tb[1] - 0.38]), 5.4, { y: TTOP });
      a.at("tr2", tb[0], tb[1] + 0.38, ywB([tb[0], tb[1] + 0.38]), 5.4, { y: TTOP });
      a.hold("tr1", "tru1", "R", 0); a.hold("tr2", "tru2", "R", 0);
      a.pose("tr1", "trumpet", 6, 10); a.pose("tr2", "trumpet", 6, 10);
      a.fx("tekia", 6.2);
      const ba = [83.6, 0.6];   // DUCHAN_GAP_A2 (86.6 until then)
      a.at("ba", ba[0], ba[1], HP, 0);   // LEVITES_EAST_A2: Ben Arza, a Levite - his face to the people too
      a.walk("tr1", [[tb[0], tb[1] - 0.38], ...route(sw1, [ba[0] - 0.2, ba[1] - 1.8])], 10.4, 20.4, { hold: true, yaw: -HP });   // PACE_215: to 13.8 until 2.0.14 (they blow there at 21)
      a.walk("tr2", [[tb[0], tb[1] + 0.38], ...route(sw2, [ba[0] - 0.2, ba[1] + 1.8])], 10.4, 20.4, { hold: true, yaw: -HP });
      a.pose("s13", "pour", 13, 17);
      a.fx("pour", 13.3);   // SOUND_211: the wine
      a.pose("sg", "wave", 13.4, 17);
      a.pose("ba", "cymbal", 13.8, 15);
      a.fx("cymbal", 14);
      a.fx("song", 14.6);
      // MUSICIANS_305: the players and the twelve singers, with a pause at each section while the trumpets sound - "הגיעו לפרק - חלק
      // שבשיר. שכל שיר של יום חלקוהו לג' חלקים, שמפסיקין שם בין פרק לפרק" (Yachin, Tamid 7, 818:712); the song again after each
      for (const [t0, t1] of [[14.6, 21], [23.2, 26], [28.2, 30]]) { LEV_PLAY.forEach((k) => a.pose(k, "play", t0, t1)); LEV_SING.concat(LEV_KIDS).forEach((k) => a.pose(k, "sing", t0, t1)); }   // TZOARIM_A2: and the little ones
      a.fx("song", 23.2); a.fx("song", 28.2);
      for (const t of [21, 26]) { a.pose("tr1", "trumpet", t, t + 2); a.pose("tr2", "trumpet", t, t + 2); a.fx("tekiaShort", t + 0.1); }
      // PROSTRATE_WEST_209 (the user, 13.11.2026 02:57: "בעבודת הבוקר יש כמה פאדיחות עם ההשתחוויות יוצא שכאילו הוא משתחוה על המזבח"):
      // "הגיעו לפרק, תקעו, והשתחוו העם" (Tamid 7:3) - TOWARD THE HOUSE. The priests on the ulam's steps stood facing the people for the
      // blessing (east, to the altar): they turn west first. The three at their service on the altar's top and its ramp (the limbs,
      // the meal-offerings: "e", "s11", "s12") do not bow there. (Until 2.0.8 all of them bowed as they stood - to the altar, and on it.)
      const BOW = [...REST, "b4", "s3", "s4", "mc", "f", "k"];
      for (const k of BOW) a.face(k, -HP, 20.9);
      for (const k of BOW) { a.pose(k, "prostrate", 21.6, 24.6); a.pose(k, "prostrate", 26.6, 29.6); }
      a.tag("sg", "״הסגן עומד על הקרן והסודרים בידו״; ״הניף הסגן בסודרין״ (תמיד ז, ג)", 1, 18);
      a.tag("ba", "בן ארזא — הצלצל", 12, 18);
      a.tag("s13", "הנסכים", 3, 18);
    };
    SC.shir = (a) => {
      LEV_PLAY.forEach((k) => a.pose(k, "play", 0, 16));
      LEV_SING.concat(LEV_KIDS).forEach((k) => a.pose(k, "sing", 0, 16));   // MUSICIANS_305; TZOARIM_A2
      a.fx("song", 0.5);
      a.tag("v6", "שיר של יום", 0.5, 16);
    };
    SC.sof = () => {};
    // ---------------------------------------------------------------- applying the state to the scene
    const POSES = {   // [right shoulder x, abduct, elbow], [left ...], lean - the arm hangs down; a negative x lifts it forward
      stand: [[0.05, 0.08, -0.15], [0.05, 0.08, -0.15], 0], hold: [[-0.55, 0.05, -1.0], [0.05, 0.08, -0.15], 0], carry: [[-0.5, -0.12, -1.15], [-0.5, -0.12, -1.15], 0],
      fingers: [[-1.25, 0.05, -0.45], [0.05, 0.08, -0.15], 0], knock: [[-1.4, 0.05, -1.3], [0.05, 0.08, -0.15], 0.05], wash: [[-0.95, -0.12, -0.55], [-0.95, -0.12, -0.55], 0.18],
      scoop: [[-0.95, 0.05, -0.35], [-0.95, 0.05, -0.35], 0.42], shovel: [[-0.85, -0.1, -0.5], [-0.75, -0.25, -0.7], 0.3], place: [[-0.9, -0.1, -0.4], [-0.9, -0.1, -0.4], 0.35],
      pour: [[-1.15, 0.05, -0.35], [0.05, 0.08, -0.15], 0.22], offer: [[-1.0, -0.05, -0.6], [-0.6, -0.1, -0.8], 0.15], point: [[-1.7, 0.1, -0.05], [0.05, 0.08, -0.15], 0],
      reach: [[-1.95, -0.05, -0.55], [-1.65, -0.08, -0.7], 0], raise: [[-2.53, -0.17, -0.04], [-2.43, -0.17, -0.04], 0], raiseHP: [[-1.82, -0.15, -0.04], [-1.78, -0.15, -0.04], 0], greet: [[-0.6, 0.05, -1.2], [-0.6, 0.05, -1.2], 0.12],
      trumpet: [[-1.5, -0.25, -1.45], [-1.45, -0.3, -1.55], 0], cymbal: [[-1.0, 0.5, -1.2], [-1.0, 0.5, -1.2], 0], wave: [[-2.6, 0.35, -0.2], [0.05, 0.08, -0.15], 0],
      play: [[-0.75, -0.15, -1.15], [-0.2, -0.12, -1.35], 0], throw: [[-1.5, 0.05, -0.2], [0.05, 0.08, -0.15], 0.1], prostrate: [[-2.9, 0.4, 0], [-2.9, 0.4, 0], 1.48],
      // KIDDUSH_211 (the user, 14.11.2026 23:36; Zevachim 19b, 130:754): "מניח ידו הימנית על גבי רגלו הימנית, וידו השמאלית על גבי רגלו
      // השמאלית, ומקדש" - each hand down to its leg. KIDDUSH_BEND_212 (the user, 16.11.2026 13:31: "הכהן צריך להיות כמה שיותר זקוף ורק
      // היד שלו על הרגל (כיפוף ולא נפילה...)"): the legs upright, the body bends at the waist (KB), each hand on its leg as low as it
      // reaches (kidReach) - until 2.1.2 the whole figure leaned from the ankles (0.5), as falling. The arms below: only where there is
      // no waist (the high priest's body) - there the old lean, a little less.
      kiddush: [[-0.3, 0.14, 0], [-0.3, 0.14, 0], 0.4],
      support: [[-0.95, -0.16, -0.5], [-0.95, -0.16, -0.5], 0.2],   // KIDDUSH_RYOSE_A2: the fellow's hands on the side and back of the one who sanctifies
      // NIGHT_WATCH_305: "שלום עליך" - the right hand raised before him; the blow of the staff or the pakia (applyFig); woken; up from
      // the stone; the left hand to the lantern and down to the cloak; the herald's two hands about his mouth (callArms)
      hail: [[-1.25, 0.12, -0.75], [0.05, 0.08, -0.15], 0.04], strike: [[-0.85, 0.05, -0.15], [0.05, 0.08, -0.15], 0.1],
      startle: [[0.05, 0.08, -0.15], [0.05, 0.08, -0.15], 0], rise: [[0.05, 0.08, -0.15], [0.05, 0.08, -0.15], 0],
      reachL: [[0.05, 0.08, -0.15], [-1.9, -0.05, -0.4], 0], lowerL: [[0.05, 0.08, -0.15], [-0.6, -0.05, -0.2], 0], call: [[-0.9, 0.2, -1.6], [-0.9, 0.2, -1.6], 0]
    };
    const KB = 0.95;   // KIDDUSH_BEND_212: how far he bends at the waist (rad) - a model choice
    // NIGHT_SIT_305 (the user, 19.11.2026 21:24: "כולל שומר ישן"): A GUARD ON HIS STONE. The legs (KIDDUSH_FOOT_213's: the thigh, the
    // knee, the shin, the foot) bent at the hip and the knee, the robe over the knees down to the feet (sitParts) and its lower part
    // hidden; awake ("sit") upright, the hands on the thighs; asleep ("doze") bent forward at the waist, the head bowed, the hands in
    // the lap, a slow breath - and a start at each blow (N.joltN, N.joltP); "situp": up in 0.9 s; "wake": up in 0.35 s, the hands
    // raised as "startle". The cloak about his shoulders (cloakOn: the API's cloak()) - "רק כסותו העליון שמסתמא התחתל בו, ובא עי"ז
    // לשינה" (Tiferet Yisrael, Middot 1:2). The stone's height (seat, amot), the postures and the cloak's form - model choices.
    // step: how far before the stone he stands up (his feet stay where they were; the stage puts the standing man there)
    const SIT = { seat: 0.63, step: 0.62, knee: [0.125, 1.02, 0.42], ank: [0.13, 0.47], gPel: null, gDrape: null, gCloak: null, mCloak: null };
    const sitArms = (f, doze) => {   // the hands' places: in the lap (asleep), on the thighs (awake); the targets in the bend's frame
      const key = doze ? "d" : "a";
      f.sitArms = f.sitArms || {};
      if (f.sitArms[key]) return f.sitArms[key];
      const K = SH.priestKit, FS = K.FS, WY = f.bend.position.y, A = f.A, th = doze ? 0.36 : 0, cb = Math.cos(th), sb = Math.sin(th), out = {};
      for (const side of [1, -1]) {
        const T = doze ? [side * 0.07, WY + 0.15 * FS, 0.25 * FS] : [side * 0.15, WY + 0.14 * FS, 0.3 * FS];
        const dy = T[1] - WY, Tb = [T[0], dy * cb + T[2] * sb, -dy * sb + T[2] * cb];
        out[side] = reach([side * A.sx, A.sy - WY, 0], Tb, A.up, A.fo + 0.06 * FS, side);
      }
      return (f.sitArms[key] = out);
    };
    const sitPose = (f, s, p, t) => {
      const doze = p === "doze", wake = p === "wake";
      const u = p === "situp" ? 1 - smooth(clamp(t / 0.9, 0, 1)) : wake ? 1 - smooth(clamp(t / 0.35, 0, 1)) : 1, w = 1 - u;
      const H = sitArms(f, doze || wake), q = { u, bend: 0, bz: 0, head: 0, lean: 0, R: H[-1], L: H[1], shift: doze || p === "sit" ? 0 : SIT.step * w };
      const mix = (a2, b2) => [lerp(a2[0], b2[0], w), lerp(a2[1], b2[1], w), lerp(a2[2], b2[2], w)];
      if (doze) {
        const jo = f.id === "gn" ? N.joltN : f.id === "gp" ? N.joltP : 0, br = Math.sin(t * 1.25);
        q.bend = 0.36 + 0.012 * br + 0.06 * jo * Math.sin(t * 31);
        q.bz = 0.04 * jo * Math.sin(t * 23);
        q.head = 0.62 + 0.03 * br;
      } else if (wake) {
        const k = smooth(clamp(t / 0.25, 0, 1)) * (1 - smooth(clamp((t - 0.6) / 0.4, 0, 1))), S2 = [lerp(0.05, -1.0, k), lerp(0.08, 0.45, k), lerp(-0.15, -1.25, k)];
        q.R = mix(H[-1], S2); q.L = mix(H[1], S2); q.bend = 0.36 * u; q.head = 0.62 * u; q.lean = -0.1 * k;
      } else if (p === "situp") {
        q.R = mix(H[-1], POSES.stand[0]); q.L = mix(H[1], POSES.stand[1]); q.bend = 0.3 * Math.sin(Math.PI * w);   // forward as he rises
      }
      return q;
    };
    const sitParts = (f) => {   // the seat under the robe above the waist, and the robe hanging from each knee (the robe's own material)
      const FS = SH.priestKit.FS, mR = f.body.material, g = new Group();
      if (!SIT.gPel) {   // (white vertex colours: the robe's material takes them, as the kit's legs)
        SIT.gPel = SH.priestKit.white(new SphereGeometry(1, 16, 10).scale(0.22 * FS, 0.12 * FS, 0.21 * FS));
        SIT.gDrape = SH.priestKit.white(new CylinderGeometry(0.1 * FS, 0.088 * FS, 1, 12, 1, true).translate(0, 0.5, 0));
      }
      const pel = new Mesh(SIT.gPel, mR);
      pel.castShadow = true;
      pel.position.set(0, f.bend.position.y - 0.04 * FS, -0.03 * FS);
      g.add(pel);
      const dr = {};
      for (const side of [1, -1]) { const m = new Mesh(SIT.gDrape, mR); m.castShadow = true; g.add(m); dr[side] = m; }
      g.visible = false;
      f.lean.add(g);
      return (f.sitP = { g, pel, dr });
    };
    // u: 1 seated, 0 standing - the body lowered so the hip is just over the stone, the knee before it, the foot on the floor
    const setSit = (f, u) => {
      const P = f.sitP || sitParts(f), on = u > 0.001;
      P.g.visible = on;
      if (on) { f.body.visible = u < 0.3; f.sitHid = true; }
      else if (f.sitHid) { f.body.visible = true; f.sitHid = false; }
      P.pel.visible = on && u >= 0.3;
      if (!on) return;   // the legs as setLeg left them (hidden, the feet his own)
      const FS = SH.priestKit.FS, hk = SIT.seat / FS + 0.1, dk = (1 - hk) * u;   // the hip over the floor when seated; its drop now (kit units)
      f.lean.position.y -= dk * FS;
      for (const side of [1, -1]) {
        const lg = f.legs[side];
        lg.g.visible = true;
        (side > 0 ? f.fl : f.fr).visible = false;
        const Hp = [side * 0.1 * FS, FS, 0];
        const Kp = [side * lerp(0.1, SIT.knee[0], u) * FS, lerp(0.55 + dk, SIT.knee[1], u) * FS, lerp(0.02, SIT.knee[2], u) * FS];
        const Ap = [side * lerp(0.1, SIT.ank[0], u) * FS, (dk + 0.15) * FS, lerp(-0.01, SIT.ank[1], u) * FS];
        seg(lg.th, Hp, Kp);
        lg.kn.position.set(Kp[0], Kp[1], Kp[2]);
        seg(lg.sn, Kp, Ap);
        lg.ft.rotation.set(0, 0, 0);
        lg.ft.position.set(Ap[0], Ap[1] - 0.15 * FS, Ap[2] + 0.01 * FS);
        seg(P.dr[side], Kp, [Ap[0], Ap[1] + 0.02 * FS, Ap[2]]);
      }
    };
    const cloakOn = (f, on) => {   // a cloak over the shoulders and the back, open before him; with the body above the waist
      if (!f.cloakG) {
        if (!on) return;
        if (!SIT.gCloak) {
          SIT.mCloak = new MeshStandardMaterial({ color: 0x6e5c46, roughness: 1, metalness: 0, side: DoubleSide });
          // rings from the neck down to below the waist (the kit's units): [y, half-breadth, half-depth] about the body and over the
          // arms; round him from his back (0) to ±2.3 rad, open before him; soft folds that grow toward the hem
          const RG = [[1.875, 0.1, 0.085], [1.84, 0.21, 0.13], [1.79, 0.34, 0.17], [1.72, 0.42, 0.195], [1.6, 0.4, 0.205], [1.4, 0.35, 0.21],
            [1.2, 0.33, 0.215], [1.0, 0.33, 0.225], [0.82, 0.34, 0.24]], NS = 30, PM = 2.3, pos = [], idx = [];
          RG.forEach(([y, a2, b2]) => {
            const k = clamp((1.72 - y) / 0.8, 0, 1);
            for (let j = 0; j <= NS; j++) { const ph = -PM + (2 * PM * j) / NS, w2 = 1 + 0.045 * k * Math.sin(9 * ph + 0.6); pos.push(a2 * w2 * Math.sin(ph), y, -0.02 - b2 * w2 * Math.cos(ph)); }
          });
          for (let i = 0; i < RG.length - 1; i++) for (let j = 0; j < NS; j++) { const q0 = i * (NS + 1) + j, q2 = q0 + NS + 1; idx.push(q0, q2, q0 + 1, q0 + 1, q2, q2 + 1); }
          SIT.gCloak = new BufferGeometry();
          SIT.gCloak.setAttribute("position", new Float32BufferAttribute(pos, 3));
          SIT.gCloak.setIndex(idx);
          SIT.gCloak.computeVertexNormals();
        }
        const m = new Mesh(SIT.gCloak, SIT.mCloak);
        m.castShadow = true;
        m.userData.noPick = true;
        f.upper.add(m);   // in the kit's units, above the waist
        f.cloakG = m;
      }
      f.cloakG.visible = on;
    };
    // NIGHT_WATCH_305: the herald's hands cupped about his mouth - the targets in the bending part's frame, as kidReach's (cached)
    const callArms = (f) => {
      if (f.callArms) return f.callArms;
      const K = SH.priestKit, FS = K.FS, WY = f.bend.position.y, A = f.A, my = K.HEAD_Y * FS - 0.135 - WY, out = {};
      for (const side of [1, -1]) out[side] = reach([side * A.sx, A.sy - WY, 0], [side * 0.075, my, 0.27], A.up, A.fo + 0.06 * FS, side);
      return (f.callArms = out);
    };
    const gripDown = () => (W && W.gripAt ? -W.gripAt[1].y : 0.08);   // HAND_A2: the closed hand's middle under the wrist (0.08 with the small hand)
    // an arm reaching a point: sp the shoulder, tp the point (in its parent's frame, amot); a the upper arm, b the forearm to the palm;
    // side as setArm's. [shoulder x, abduct, elbow] - the elbow bends forward. Out of reach: the arm straight toward the point.
    const reach = (sp, tp, a, b, side) => {
      const vx = tp[0] - sp[0], vy = tp[1] - sp[1], vz = tp[2] - sp[2], D3 = Math.hypot(vx, vy, vz) || 1e-6;
      const al = Math.asin(clamp(vx / D3, -0.9, 0.9)), ca = Math.cos(al);
      const Dp = Math.min(Math.hypot(vy, vz), (a + b) * ca - 1e-4), a2 = a * ca, b2 = b * ca;
      const phT = Math.atan2(-vz, -vy);
      const be = Math.acos(clamp((a2 * a2 + Dp * Dp - b2 * b2) / (2 * a2 * Dp), -1, 1));
      const ga = Math.acos(clamp((a2 * a2 + b2 * b2 - Dp * Dp) / (2 * a2 * b2), -1, 1));
      return [phT + be, side * al, -(Math.PI - ga)];
    };
    // the hands' places for kiddush on a figure with a waist: on the front of each leg, the lowest it reaches (cached on the figure)
    // LAMPS_HANDS_219 (the user, 18.11.2026: "הוא לא באמת מטיב שם, הוא מתעסק שם למעלה"): the arm that reaches lamp s.lamp (the foot of
    // its flame, ctx2.shared.menorah.lampPos) - the hand on the lamp's side of him; the target in the frame of the arm's parent, as kidFoot's
    const trimArm = (f, s) => {
      const q = SH.menorah.lampPos(s.lamp), c = Math.cos(s.yaw), sn = Math.sin(s.yaw), dx = q[0] - s.x, dz = q[2] - s.z;
      const lx = dx * c - dz * sn, lz = dx * sn + dz * c, side = lx > 0.05 ? 1 : -1, A = f.A, WY = f.bend ? f.bend.position.y : 0;
      return { side, arm: reach([side * A.sx, A.sy - WY, 0], [lx, q[1] - s.y - WY, lz - 0.12], A.up, A.fo + gripDown(), side) };
    };
    const kidReach = (f) => {
      if (f.kidArms) return f.kidArms;
      const K = SH.priestKit, FS = K.FS, WY = f.bend.position.y, cb = Math.cos(KB), sb = Math.sin(KB);   // (KIT is the world builder's own)
      const A = f.A, a = A.up, b = A.fo + 0.06 * FS;
      const toBend = (x, y, z) => { const dy = y - WY; return [x, dy * cb + z * sb, -dy * sb + z * cb]; };   // the figure's frame -> the bending part's
      const out = {};
      for (const side of [1, -1]) {
        const sp = [side * A.sx, A.sy - WY, 0];
        let best = null;
        for (let y = 0.18; y <= 1.2; y += 0.02) {
          const tp = toBend(side * 0.1 * FS, y * FS, (K.spl(K.bZ, y) + 0.05) * FS);
          if (Math.hypot(tp[0] - sp[0], tp[1] - sp[1], tp[2] - sp[2]) <= (a + b) * 0.985) { best = tp; break; }
        }
        out[side] = reach(sp, best || toBend(side * 0.1 * FS, 0.9 * FS, 0.25 * FS), a, b, side);
      }
      return (f.kidArms = out);
    };
    // KIDDUSH_FOOT_213 (the user, 16.11.2026 17:14: "הקידוש צריך להיות יד ימין על רגל ימין (מורמת) וכן בשמאל לפי הסדר! בכל ההדגמות!"):
    // the leg in the figure's frame (the priest's kit units; side +1 the left): the hip; the knee and the ankle standing (0) and raised
    // (1: the thigh a little above the level, the shin down and forward); the foot's pitch (the toes a little down). The foot's ankle
    // point is (0, 0.15, -0.01) of its geometry, its top (0, 0.06, 0.10). The shapes and the height - model choices.
    // KIDDUSH_LEG_214 (as the First Temple's 58-ark.js ARK_LEG): the leg reaches further forward and the foot is higher - the knee at the
    // hip's height, the hand on the foot 1.34 above the floor and 1.3 ahead of him; until 2.0.13 the knee rose above the hip and the shin
    // ran in under the bent body, so that the leg itself was hardly seen - and the bend is less (42 degrees instead of 48)
    const LEG = { hip: 1.0, k0: [0.1, 0.55, 0.02], k1: [0.18, 1.12, 0.43], a0: [0.1, 0.15, -0.01], a1: [0.27, 1.02, 0.83], pitch: 0.1, side: 0.12 };   // side: the body leans a little to the standing leg (the head off the stream)
    const legAt = (side, u) => {
      const L2 = (a, b) => [side * lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
      return { H: [side * 0.1, LEG.hip, 0], K: L2(LEG.k0, LEG.k1), A: L2(LEG.a0, LEG.a1), pitch: LEG.pitch * u };
    };
    const footTop = (A, pitch) => { const c = Math.cos(pitch), sn = Math.sin(pitch); return [A[0], A[1] - 0.09 * c - 0.11 * sn, A[2] - 0.09 * sn + 0.11 * c]; };
    KID.local = (side) => { const FS = SH.priestKit.FS, q = legAt(side, 1), T = footTop(q.A, q.pitch); return [T[0] * FS, (T[1] + 0.035) * FS, T[2] * FS]; };   // the hand's place (amot)
    // where he stands for each side: the hand on the raised foot at KID.P (under the north spout's stream)
    // KIDDUSH_SOUTH_214: his face to the laver (south) for both - the right foot raised ahead of him, a step west, the left; he stands on
    // the court's floor, 0.56 north of the well's curb (until 2.0.13 he faced east for the right and west for the left and stood on the
    // well's wall - from the laver's own eye, in the west, the right was washed behind his back). From that eye both are seen from the side.
    KID.P = [22, 54.25];   // 40-altar.js: the laver KX 22, KZ 57; the north spout's mouth at z 55.35 - the stream comes 1.1 out
    KID.yaw = () => 0;
    KID.spot = (side) => {
      const T = KID.local(side), ps = KID.yaw(side), x2 = T[0] * Math.cos(ps) + T[2] * Math.sin(ps), z2 = -T[0] * Math.sin(ps) + T[2] * Math.cos(ps);
      return [KID.P[0] - x2, KID.P[1] - z2];
    };
    // the bend (the least that lets the hand reach the foot) and the arm's angles, per figure and side (cached)
    const kidFoot = (f, side) => {
      f.kidFoot = f.kidFoot || {};
      if (f.kidFoot[side]) return f.kidFoot[side];
      const K = SH.priestKit, FS = K.FS, WY = f.bend.position.y, A = f.A, a = A.up, b = A.fo + 0.06 * FS;
      const T = KID.local(side), sp = [side * A.sx, A.sy - WY, 0];
      const ph = side * LEG.side, cp = Math.cos(ph), spp = Math.sin(ph);   // the bend group: Rx(th) then Rz(ph) (Euler XYZ) - the target back through both
      let th = 0, Tb = null;
      for (th = 0; th <= 1.3; th += 0.02) {
        const cb = Math.cos(th), sb = Math.sin(th), dy = T[1] - WY, y1 = dy * cb + T[2] * sb, z1 = -dy * sb + T[2] * cb;
        Tb = [T[0] * cp + y1 * spp, -T[0] * spp + y1 * cp, z1];
        if (Math.hypot(Tb[0] - sp[0], Tb[1] - sp[1], Tb[2] - sp[2]) <= (a + b) * 0.985) break;
      }
      return (f.kidFoot[side] = { th, ph, arm: reach(sp, Tb, a, b, side) });
    };
    const _lv = new Vector3(), _lw = new Vector3(), _lup = new Vector3(0, 1, 0);
    const seg = (m, a, b) => { _lv.set(a[0], a[1], a[2]); _lw.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const n = _lw.length() || 1e-6; m.position.copy(_lv); m.quaternion.setFromUnitVectors(_lup, _lw.multiplyScalar(1 / n)); m.scale.set(1, n, 1); };
    const setLeg = (f, side, u) => {
      const lg = f.legs[side], on = u > 0.02;
      if (lg.g.visible !== on) lg.g.visible = on;
      const own = side > 0 ? f.fl : f.fr;
      if (own.visible === on) own.visible = !on;
      if (!on) return;
      const FS = SH.priestKit.FS, q = legAt(side, u), H = q.H.map((v) => v * FS), Kp = q.K.map((v) => v * FS), A = q.A.map((v) => v * FS);
      seg(lg.th, H, Kp);
      lg.kn.position.set(Kp[0], Kp[1], Kp[2]);
      seg(lg.sn, Kp, A);
      const c = Math.cos(q.pitch), sn = Math.sin(q.pitch), ay = 0.15 * FS, az = -0.01 * FS;
      lg.ft.rotation.set(q.pitch, 0, 0);
      lg.ft.position.set(A[0], A[1] - (ay * c - az * sn), A[2] - (ay * sn + az * c));
    };
    // the north spout's stream (40-altar.js: its mouth at x 22, y KY + 1.22 - 0.129, z 55.35, pointing north and down by 0.35) onto the
    // hand on the raised foot (KID.P), and off the foot to the floor; built on first use
    // KIYOR_A2 / KIDDUSH_A2: the water from a spout's tap onto the hands on the feet, and off them to the floor (decision 38: "המים היו
    // נשפכים על הרצפה ולא לתוך קערה") - for the spouts in `list` (40-altar.js kiyorInfo: their mouths); built on first use
    // KIDDUSH_WATER_A2 (the user: "גם היד נשטפת, ולא רק נשענת על הרגל"): the stream from the tap falls ON THE HANDS that lie on the feet,
    // and runs off them onto the feet and down to the floor; water seen on the hands and on the feet - at each spout, for the priest
    // who sanctifies there ("t" at the west spout; "s1".."s12" at the twelve). The stream follows his hands as he bends (KID.waterAt,
    // every frame while it runs). Until now the stream fell to a point at the laver's foot.
    KID.water = (list) => {
      const g = new Group();
      g.name = "kiddushWater";
      const M = new MeshStandardMaterial({ color: 0x7db8ec, emissive: 0x15406a, emissiveIntensity: 0.5, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.8, depthWrite: false });
      const cyl = (r0, r1) => { const q = new CylinderGeometry(r1, r0, 1, 7, 1, true); q.translate(0, 0.5, 0); const m = new Mesh(q, M); m.renderOrder = 5; g.add(m); return m; };
      const blob = (sx, sy, sz) => { const m = new Mesh(new SphereGeometry(1, 10, 6), M); m.scale.set(sx, sy, sz); m.renderOrder = 5; g.add(m); return m; };
      g.userData.items = list.map((i) => ({
        i, fig: list.length > 1 ? "s" + (i + 1) : "t",
        stream: [cyl(0.03, 0.029), cyl(0.029, 0.028), cyl(0.028, 0.027), cyl(0.027, 0.026), cyl(0.026, 0.027), cyl(0.027, 0.029), cyl(0.029, 0.031), cyl(0.031, 0.035)],   // KIDDUSH_FLAT_A2: eight pieces
        drip: [cyl(0.02, 0.016), cyl(0.02, 0.016), cyl(0.014, 0.012), cyl(0.014, 0.012)],
        film: [blob(0.05, 0.012, 0.065), blob(0.05, 0.012, 0.065), blob(0.06, 0.012, 0.09), blob(0.06, 0.012, 0.09)],   // KIDDUSH_FLAT_A2: thinner - the hands seen under the water
        pool: (() => { const m = new Mesh(new CircleGeometry(0.34, 18).rotateX(-Math.PI / 2), M); g.add(m); return m; })()
      }));
      W.group.add(g);
      return g;
    };
    const _kq = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()], _kb = new Vector3(), _kc = new Vector3();
    const v3a = (v) => [v.x, v.y, v.z];
    KID.waterAt = (g) => {
      const I = KIY();
      for (const it of g.userData.items || []) {
        const o = I.spouts[it.i], f = W.figs[it.fig];
        const show = !!(o && f && f.g.visible && f.st && f.st.pose === "kiddush");
        for (const m of [...it.stream, ...it.drip, ...it.film, it.pool]) m.visible = show;
        if (!show) continue;
        // KIDDUSH_FLAT_A2: the palms on the feet - the stream onto the backs of both hands between them, off the fingers onto the toes
        // and off the toes to the floor ("המים מהברז נופלים על גב היד, ומשם על הרגל, ושתיהן נשטפות יחד")
        const FSk = SH.priestKit ? SH.priestKit.FS : 1, flat = !!(f.R.wr && f.kidH);
        const hR = flat ? f.R.wr.localToWorld(_kq[0].set(0, -0.064 * FSk, 0)) : f.R.grip.getWorldPosition(_kq[0]);   // HAND_A2: the palm's middle (0.05 with the small hand)
        const hL = flat ? f.L.wr.localToWorld(_kq[1].set(0, -0.064 * FSk, 0)) : f.L.grip.getWorldPosition(_kq[1]);
        const fR = flat ? f.fr.localToWorld(_kq[2].set(0, 0.03 * FSk, 0.2 * FSk)) : f.fr.getWorldPosition(_kq[2]);
        const fL = flat ? f.fl.localToWorld(_kq[3].set(0, 0.03 * FSk, 0.2 * FSk)) : f.fl.getWorldPosition(_kq[3]);
        if (!flat) { const ft = 0.11 * FSk; fR.y += ft; fL.y += ft; }
        const H = _kq[4].copy(hR).add(hL).multiplyScalar(0.5); H.y += flat ? 0.045 : 0.03;
        // the stream: out of the tap and down onto the hands (a quadratic curve in four pieces)
        const P0 = _kq[5].set(o.p[0], o.p[1], o.p[2]), sx = Math.sin(o.a), sz = Math.cos(o.a);
        const C = _kc.set(o.p[0] + sx * 0.3, o.p[1] - 0.05, o.p[2] + sz * 0.3);
        let prev = v3a(P0);
        const NS = it.stream.length;
        for (let k = 1; k <= NS; k++) {
          const t = k / NS, u = 1 - t;
          // KIDDUSH_FLAT_A2: out of the mouth level and falling - straight on across, down as the square of the way (a jet's arc)
          const q = flat ? [P0.x + (H.x - P0.x) * t, P0.y - (P0.y - H.y) * t * t, P0.z + (H.z - P0.z) * t]
            : [u * u * P0.x + 2 * u * t * C.x + t * t * H.x, u * u * P0.y + 2 * u * t * C.y + t * t * H.y, u * u * P0.z + 2 * u * t * C.z + t * t * H.z];
          seg(it.stream[k - 1], prev, q);
          prev = q;
        }
        // off the hands onto the feet, and off the feet to the floor
        seg(it.drip[0], v3a(hR), v3a(fR)); seg(it.drip[1], v3a(hL), v3a(fL));
        seg(it.drip[2], v3a(fR), [fR.x, F + 0.01, fR.z]); seg(it.drip[3], v3a(fL), [fL.x, F + 0.01, fL.z]);
        // the water on the hands and on the feet
        it.film[0].position.copy(hR); it.film[1].position.copy(hL);
        it.film[2].position.copy(fR); it.film[3].position.copy(fL);
        it.film[0].rotation.y = it.film[1].rotation.y = it.film[2].rotation.y = it.film[3].rotation.y = f.g.rotation.y;
        it.pool.position.set((fR.x + fL.x) / 2, F + 0.012, (fR.z + fL.z) / 2);
      }
    };
    // SUDAR_A2 (the user: "הגבהת הסודר כמו בחלמיש — שייך גם להדגמת הבוקר"; B-04, B-05): THE DEPUTY'S SUDAR - "הסגן עומד על הקרן
    // והסודרין בידו... הניף הסגן בסודרין, והקיש בן ארזא בצלצל, ודברו הלוים בשיר" (Tamid 7:3, 88:40); its form a flag - the Rambam's
    // commentary there (575:79) "וסודרין — הם דגלים"; its size, its colour and the way it is held as the booklet draws it: a black cloth
    // held by its corner, hanging by his side, then raised high and waved. SH.makeSudar() - for both demonstrations (the water's
    // libation, 57-add208.js, too): a Group whose origin is the corner in the hand, the cloth along its -y (and -x); .userData.tick(t, k) ripples
    // it (k 0 - still, 1 - waved). Its measures (0.62 x 1.0) and the ripple - model choices.
    SH.makeSudar = () => {
      const g = new Group(), W0 = 0.62, L0 = 1.0, geo = new PlaneGeometry(W0, L0, 6, 10);
      geo.translate(-W0 / 2, -L0 / 2, 0);   // from the corner in the hand along the fingers' way (down by his side; up over the raised hand)
      const pos = geo.attributes.position, base = Float32Array.from(pos.array);
      const m = new Mesh(geo, new MeshStandardMaterial({ color: 0x17171c, roughness: 0.9, metalness: 0, side: DoubleSide }));
      m.castShadow = true;
      g.add(m);
      g.userData.tick = (t, k) => {
        for (let i = 0; i < pos.count; i++) {
          const x = base[i * 3], y = base[i * 3 + 1], d = Math.hypot(x, y) / L0;
          pos.array[i * 3 + 2] = (0.03 + 0.16 * k) * d * Math.sin(6.5 * d - (3 + 7 * k) * t) + 0.05 * k * d * d * Math.sin(2.1 * t);
          pos.array[i * 3] = x * (1 - 0.12 * k * d * (0.5 + 0.5 * Math.sin(4 * t + 3 * d)));
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
      };
      g.userData.tick(0, 0);
      return g;
    };
    const setArm = (A2, v, side) => { A2.sh.rotation.x = v[0]; A2.sh.rotation.z = side * v[1]; A2.el.rotation.x = v[2]; };
    // MUSICIANS_305 (the user, 19.11.2026 21:08: "צריך גם לעשות את הלוויים מנגנים, אותו דבר בעבודת הבוקר. אם הם מנגנים, לא יכולים
    // לעמוד כמו פסלים"): THE PLAYER'S RIGHT HAND on the strings of the instrument in his left (the lyre: seven strings on its face - KINOR7_A2; the
    // harp: ten along it - NEVEL10_A2) - across them and back, a stroke in about 0.45 s, from the face of the strings nearer to him; the left arm
    // as POSES.play. And every Levite of the song - the players and the twelve singers - sways a little with it (songSway: the body
    // above the waist, aside and forward). Until 2.0.13 the right arm swung 0.12 in the air, and the singers stood still. The
    // motions - model choices
    const PLAY_STR = { lyre: [[-0.14, 0.33], [0.14, 0.38]], nevel: [[0.1, 0.45], [0.42, 0.55]] };
    const mPA = new Matrix4(), mPB = new Matrix4(), mPI = new Matrix4(), qP = new Quaternion(), eP = new Euler(), vP = new Vector3(), vP1 = new Vector3(), vP2 = new Vector3();
    const figNo = (f) => { if (f.no == null) { let h = 0; for (const c of String(f.id)) h = (h * 31 + c.charCodeAt(0)) % 997; f.no = h; } return f.no; };
    const playArm = (f, t) => {
      if (!f.A || !f.L || !f.L.grip || !f.R) return null;
      const inst = /^l(10|11)$/.test(f.id) ? "nevel" : /^l[1-9]$/.test(f.id) ? "lyre" : null, pr = inst && W.props[inst + "1"];
      if (!pr) return null;
      setArm(f.L, POSES.play[1], 1);
      f.L.sh.updateMatrix(); f.L.el.updateMatrix(); f.L.grip.updateMatrix();
      mPA.multiplyMatrices(f.L.sh.matrix, f.L.el.matrix).multiply(f.L.grip.matrix);
      if (pr.upright) {   // upright (applyProps): its own place in the hand, turned as the figure and by its own turn (grip.r[1])
        vP.set(pr.grip.p[0], pr.grip.p[1], pr.grip.p[2]).applyMatrix4(mPA);
        mPA.makeRotationY(pr.grip.r[1] || 0).setPosition(vP);
      } else {
        mPB.compose(vP.set(pr.grip.p[0], pr.grip.p[1], pr.grip.p[2]), qP.setFromEuler(eP.set(pr.grip.r[0], pr.grip.r[1], pr.grip.r[2])), vP2.set(1, 1, 1));
        mPA.multiply(mPB);   // the instrument in the frame of the arms' parent
      }
      const sp = f.R.sh.position;
      vP1.copy(sp).applyMatrix4(mPI.copy(mPA).invert());   // the right shoulder in the instrument's frame: which face of the strings is his
      const side = vP1.z >= 0 ? 1 : -1, ab = PLAY_STR[inst], u = 0.5 + 0.5 * Math.sin(t * 14 + figNo(f));
      vP.set(ab[0][0] + (ab[1][0] - ab[0][0]) * u, ab[0][1] + (ab[1][1] - ab[0][1]) * u, side * 0.06).applyMatrix4(mPA);
      return reach([sp.x, sp.y, sp.z], [vP.x, vP.y, vP.z], f.A.up, f.A.fo + gripDown(), -1);
    };
    const songSway = (f, s) => {
      const t = s.t || 0, k = smooth(clamp(t / 0.6, 0, 1)) * smooth(clamp((s.tl == null ? 9 : s.tl) / 0.5, 0, 1)), ph = figNo(f) * 0.11;
      return [0.055 * k * Math.sin(t * 2.4 + ph), k * (0.04 + 0.035 * Math.sin(t * 4.8 + ph))];
    };
    const _qI = new Quaternion();   // KIDDUSH_FLAT_A2
    const BLESS_PALM = 1, _qW1 = new Quaternion(), _qW2 = new Quaternion(), _qW3 = new Quaternion(), _vX = new Vector3(1, 0, 0), _vY = new Vector3(0, 1, 0), _vZ = new Vector3(0, 0, 1);   // BIRKAT_V_A2
    const applyFig = (f) => {
      const s = f.st;
      f.g.visible = !!s.vis;
      if (!s.vis) { if (f.tag) f.tag.visible = false; return; }
      f.g.position.set(s.x, s.y, s.z);
      f.g.rotation.y = s.yaw;
      const p = s.pose;
      let R = POSES.stand[0], Lv = POSES.stand[1], lean = 0, bob = 0, fz0 = 0, fz1 = 0, bendA = 0, bendZ = 0, legR = 0, legL = 0, headA = 0, sitU = 0, sitZ = 0, kidU = 0, kidH = null;   // NIGHT_SIT_305: headA, sitU, sitZ   // KIDDUSH_FLAT_A2: kidU, kidH
      if (p === "walk" || p === "walkCarry" || p === "walkHold") {
        const sw = Math.sin(s.ph);
        R = p === "walkCarry" ? POSES.carry[0] : p === "walkHold" ? POSES.hold[0] : [-0.32 * sw, 0.08, -0.25];
        Lv = p === "walkCarry" ? POSES.carry[1] : [0.32 * sw, 0.08, -0.25];
        bob = Math.abs(Math.cos(s.ph)) * 0.035;
        fz0 = 0.17 * sw; fz1 = -0.17 * sw;
      } else {
        const P0 = POSES[p] || POSES.stand, t = s.t || 0;
        R = P0[0]; Lv = P0[1]; lean = P0[2];
        if (p === "throw") { const u = clamp(t / 0.7, 0, 1); R = [lerp(0.7, -1.5, u), 0.05, lerp(-0.6, -0.2, u)]; }
        else if (p === "wave") R = [-2.6, 0.35 + 0.35 * Math.sin(t * 9), -0.2];
        else if (p === "cymbal") { const u = Math.abs(Math.sin(t * 5)); R = Lv = [-1.0, 0.15 + 0.5 * u, -1.25]; }
        else if (p === "shovel" || p === "scoop" || p === "place") { const w = Math.sin(t * 3.2); R = [R[0] + 0.25 * w, R[1], R[2]]; Lv = [Lv[0] + 0.25 * w, Lv[1], Lv[2]]; }
        else if (p === "wash") { const w = Math.sin(t * 6); R = [R[0] + 0.1 * w, R[1], R[2]]; Lv = [Lv[0] - 0.1 * w, Lv[1], Lv[2]]; }
        else if (p === "play" || p === "sing") {   // MUSICIANS_305: the player's right hand over the strings; both sway with the song
          if (p === "play") { const H = playArm(f, t); R = H || [R[0] + 0.12 * Math.sin(t * 7), R[1], R[2]]; }
          const w = songSway(f, s);
          bendZ = w[0]; bendA = w[1];
        }
        else if (p === "fingers") R = [R[0] + 0.06 * Math.sin(t * 2), R[1], R[2]];
        else if (p === "prostrate") { const u = clamp(t / 1.2, 0, 1), d = t > 2.2 ? clamp((t - 2.2) / 0.8, 0, 1) : 0, k = smooth(u) * (1 - smooth(d)); lean = 1.48 * k; R = Lv = [lerp(0.05, -2.9, k), 0.4 * k, 0]; }
        else if (p === "knock") R = [-1.4 + 0.2 * Math.sin(t * 9), 0.05, -1.3];
        else if (p === "strike") {   // NIGHT_WATCH_305: raised high and brought down, twice in 1.4 seconds
          const ph = (t / 0.7) % 1, k = ph < 0.55 ? smooth(ph / 0.55) : 1 - smooth(Math.min(1, (ph - 0.55) / 0.2));
          R = [lerp(-0.85, -2.75, k), lerp(0.05, 0.3, k), lerp(-0.15, -0.55, k)]; lean = 0.1 + 0.08 * (1 - k);
        }
        else if (p === "hail") R = [-1.25 - 0.12 * Math.sin(t * 5), 0.12, -0.75];
        else if (p === "startle") { const u = smooth(clamp(t / 0.25, 0, 1)) * (1 - smooth(clamp((t - 0.6) / 0.4, 0, 1))); R = Lv = [lerp(0.05, -1.0, u), lerp(0.08, 0.45, u), lerp(-0.15, -1.25, u)]; lean = -0.1 * u; }
        else if (p === "rise" && f.bend) { const u = 1 - smooth(clamp(t / 0.8, 0, 1)); bendA = 0.6 * u; R = Lv = [lerp(0.05, -0.5, u), 0.15, lerp(-0.15, -0.6, u)]; }
        else if (p === "lowerL" && f.bend) { const u = smooth(clamp(t / 0.4, 0, 1)); bendA = 0.55 * u; }
        else if (p === "call" && f.bend && f.A && SH.priestKit) { const H = callArms(f); R = H[-1]; Lv = H[1]; bendA = 0.1 + 0.06 * Math.sin(t * 2.6); }
        else if ((p === "sit" || p === "doze" || p === "situp" || p === "wake") && f.legs && f.bend && f.A && SH.priestKit) {   // NIGHT_SIT_305
          const q = sitPose(f, s, p, t);
          R = q.R; Lv = q.L; bendA = q.bend; bendZ = q.bz; headA = q.head; sitU = q.u; lean = q.lean; sitZ = q.shift;
        }
        else if (p === "trim" && f.A && SH.menorah && fnc(SH.menorah.lampPos)) {   // LAMPS_HANDS_219: the hand to the lamp and back, the other arm as he stands
          const H = trimArm(f, s), tl = s.tl == null ? 9 : s.tl, u = smooth(clamp(t / 0.4, 0, 1)) * smooth(clamp(tl / 0.3, 0, 1));
          const mix = (q, w) => [lerp(q[0], w[0], u), lerp(q[1], w[1], u), lerp(q[2], w[2], u)];
          if (H.side < 0) R = mix(POSES.stand[0], H.arm); else Lv = mix(POSES.stand[1], H.arm);
        }
        else if ((p === "kidR" || p === "kidL") && f.legs && SH.priestKit) {   // KIDDUSH_FOOT_213: the foot raised, the hand on it
          const side = p === "kidR" ? -1 : 1, tl = s.tl == null ? 9 : s.tl;
          const u = smooth(clamp(t / 0.55, 0, 1)) * smooth(clamp(tl / 0.45, 0, 1)), H = kidFoot(f, side);
          const mix = (q, w) => [lerp(q[0], w[0], u), lerp(q[1], w[1], u), lerp(q[2], w[2], u)], other = [0.15, 0.32, -0.3];
          if (side < 0) { R = mix(POSES.stand[0], H.arm); Lv = mix(POSES.stand[1], other); legR = u; }
          else { Lv = mix(POSES.stand[1], H.arm); R = mix(POSES.stand[0], other); legL = u; }
          lean = 0; bendA = H.th * u; bendZ = H.ph * u;
        }
        else if (p === "kiddush" && f.bend && f.L.wr && SH.priestKit && SH.priestKit.kidHands) {
          // KIDDUSH_FLAT_A2 (the user via the coordinator: "כף היד על כף הרגל, וכך שניהם בו זמנית"): the feet together, he bows, each palm
          // flat on the back of its foot (the kit's kidHands - the same in the First Temple); until now each hand on the front of its leg
          // as low as it reached (kidReach, KB)
          // KIDDUSH_RYOSE_A2 (the user's decision 82 c): in Rabbi Yose b. R. Yehuda's reading the twelve stand on the left foot, the right
          // laid on it, and the hands one on the other above (the kit's kidHands "ryose"); the one at the upper spout held by his fellow (SC.kiyor12)
          const md = TM.kidd === "ryose" && /^s\d+$/.test(f.id) ? "ryose" : "tk";
          const u = smooth(clamp(t / 0.8, 0, 1)), H = SH.priestKit.kidHands(f, setArm, md), mix = (q, w) => [lerp(q[0], w[0], u), lerp(q[1], w[1], u), lerp(q[2], w[2], u)];
          R = mix(POSES.stand[0], H.arm[-1]); Lv = mix(POSES.stand[1], H.arm[1]); lean = 0; bendA = H.th * u; kidU = u; kidH = H;
          if (SH.priestKit.kidBody) { SH.priestKit.kidBody(f, H, u); headA = -H.lift * u; f.kBowed = true; }   // HANDS_K (KIDDUSH_CROUCH_K): the hips down and back, the kutonet over bent knees, the head up
        }
        else if (p === "kiddush" && f.bend && SH.priestKit && SH.priestKit.bZ) {   // KIDDUSH_BEND_212: upright legs, bent at the waist, the hands on the legs
          const u = smooth(clamp(t / 0.8, 0, 1)), H = kidReach(f), mix = (q, w) => [lerp(q[0], w[0], u), lerp(q[1], w[1], u), lerp(q[2], w[2], u)];
          R = mix(POSES.stand[0], H[-1]); Lv = mix(POSES.stand[1], H[1]); lean = 0.03 * u; bendA = KB * u;
        }
      }
      if (f.kBowed && !kidH && SH.priestKit && SH.priestKit.kidBody) { SH.priestKit.kidBody(f, null, 0); f.kBowed = false; }   // HANDS_K: up again after kiddush
      setArm(f.R, R, -1);
      setArm(f.L, Lv, 1);
      // BIRKAT_HANDS_A2 (the user: "צריכים להושיט ידיים בדיוק כמו בחלמיש!" - B-07, B-25): in the blessing the arms go up straight before him,
      // about 55 degrees over the level, side by side (POSES.raise); the hands turned so that the palms face forward, to the people, and
      // bent back at the wrist - the fingers up. Elsewhere the hand straight on the arm
      if (f.id === "sg" && W.props.flags && W.props.flags.o.userData.tick) { const fl = W.props.flags.o; if (fl.visible) fl.userData.tick(p === "wave" ? (s.t || 0) : performance.now() / 1000, p === "wave" ? 1 : 0); }   // SUDAR_A2
      // BIRKAT_V_A2 (the user, via the coordinator: "שגב היד כלפי השמיים, אבל תנוחת היד יותר לכיוון העם"; Shulchan Aruch OC 128:12, 382:1024
      // "כדי שיהא תוך כפיהם כנגד הארץ ואחורי ידיהם כנגד השמים", "ומגביהים יד ימנית קצת למעלה מהשמאלית"; the Rambam, Tefillah 14:9, 302:238
      // "ומגביהין ידיהם למעלה על גבי ראשיהן... חוץ מכהן גדול שאין מגביה ידיו למעלה מן הציץ"): the arms forward to the people, some 37
      // degrees from the upright, the hands over the heads (the high priest's lower - raiseHP: not over the tzitz), drawn in so that the two
      // hands are side by side, the thumbs near each other (the fifth space), the right a little higher; the palms toward the earth, the
      // fingers forward. BLESS_PALM: 1 - the palms toward the earth (the Shulchan Aruch); 0 - toward the people, the fingers up (until now).
      // MODEL CHOICES: the arms 35 (the right) and 41 (the left) degrees from the upright, drawn in 0.17 rad - the hands' tops 3.33 and 3.27
      // amot over the feet, 0.025 apart (the thumbs); the high priest's 1.82 / 1.78 rad from hanging, 0.15 in - their tops 3.06 / 3.01, the
      // tzitz's top 3.12; the fingers' spread in the V (hand.js "bless": 0.15 rad each pair)
      if (f.R.wr) for (const [A2, sd] of [[f.R, -1], [f.L, 1]]) {
        if (p === "raise" || p === "raiseHP") {
          const th = A2.sh.rotation.x + A2.el.rotation.x, ph = (Math.PI - th) + (-Math.PI / 2 - th - (Math.PI - th)) * BLESS_PALM;
          _qW1.setFromAxisAngle(_vZ, -A2.sh.rotation.z); _qW2.setFromAxisAngle(_vX, ph); _qW3.setFromAxisAngle(_vY, -sd * 0.95);
          A2.wr.quaternion.copy(_qW1).multiply(_qW2).multiply(_qW3);   // (the shoulder's turn outward undone, then the wrist's bend and turn)
        } else A2.wr.rotation.set(0, 0, 0);
      }
      if (kidH && f.R.wr) for (const [A2, sd] of [[f.R, -1], [f.L, 1]]) A2.wr.quaternion.slerpQuaternions(_qI, kidH.wq[sd], kidU);   // KIDDUSH_FLAT_A2: the palms down on the feet
      // HAND_A2: the hands' pose - open in the blessing and the greeting, flat on the feet in kiddush and on the floor in prostration and
      // on the fellow's side (support), the first finger out in the lotteries and in pointing, a fist in knocking; else at rest (a little
      // bent). A held vessel closes its hand round it (applyProps, after this)
      if (f.R.wr && W.hands) {
        const hk = { R: "rest", L: "rest" };
        if (p === "raise" || p === "raiseHP") hk.R = hk.L = "bless";   // BIRKAT_V_A2
        else if (p === "hail") hk.R = "open";
        else if ((p === "kiddush" && kidH) || p === "prostrate" || p === "support") hk.R = hk.L = "flat";
        else if (p === "fingers" || p === "point") hk.R = "point";
        else if (p === "knock" || p === "strike") hk.R = "grip";
        f.handK = hk;
        setHands(f);
      }
      if (f.bend) { f.bend.rotation.x = bendA; f.bend.rotation.z = bendZ; }
      if (f.legs) { setLeg(f, -1, legR); setLeg(f, 1, legL); }
      f.lean.rotation.x = lean;
      f.lean.position.y = bob + (lean > 1 ? 0.36 * Math.sin(lean) : 0);
      f.fl.position.z = fz0;
      f.fr.position.z = fz1;
      // KIDDUSH_FLAT_A2 / KIDDUSH_RYOSE_A2: the feet at kiddush (and the leg laid on the other) - the kit's kidLegs; else where they stand
      if (kidH && SH.priestKit.kidLegs) SH.priestKit.kidLegs(f, kidH, kidU);
      else if (f.kit) { const fx = 0.1 * SH.priestKit.FS; f.fl.position.x = fx; f.fr.position.x = -fx; f.fl.position.y = f.fr.position.y = 0; f.fl.rotation.set(0, 0, 0); f.fr.rotation.set(0, 0, 0); }
      f.fl.visible = f.fr.visible = lean < 1;
      if (f.neck) f.neck.rotation.x = headA;   // NIGHT_SIT_305
      if (f.legs && (sitU > 0 || f.sitP)) setSit(f, sitU);   // NIGHT_SIT_305: on his stone - after the lean and the feet
      if (sitZ > 0) { f.lean.position.z = sitZ; f.fl.position.z += sitZ; f.fr.position.z += sitZ; }   // getting up: the body over the feet
      else if (f.lean.position.z !== 0) f.lean.position.z = 0;
      if (f.upper && (s.cloak || f.cloakG)) cloakOn(f, !!s.cloak);
      if (s.tag) {
        const tm = W.tagMat(s.tag);
        if (!f.tag) { f.tag = new Sprite(tm.m); f.tag.renderOrder = 45; f.tag.center.set(0.5, 0); W.group.add(f.tag); }
        if (f.tag.material !== tm.m) f.tag.material = tm.m;
        f.tag.scale.set(0.62 * tm.aspect, 0.62, 1);
        f.tag.position.set(s.x, s.y + (lean > 1 ? 1.2 : 3.75), s.z);
        f.tag.visible = true;
      } else if (f.tag) f.tag.visible = false;
    };
    // HAND_A2: put a figure's hands to their poses (f.handK: { R, L }), each its own geometry (KG.hands) - the Levite's left hand, with the
    // strap of his tefillin on it, stays at rest
    // HAND_SDF_A2 (the coordinator: no drop in the frame rate where the near figures are many): a figure more than HAND_FAR amot from the
    // eye has its hands in fewer faces (hand.js "mid": 3,000 triangles - 7,500 near); made when first wanted
    const HAND_FAR = 4.5, _hv = new Vector3();
    const setHands = (f) => {
      const far = !!(W.handMid && ctx2.camera && f.g && f.g.getWorldPosition(_hv).distanceTo(ctx2.camera.position) > HAND_FAR);
      for (const [A2, side, k] of [[f.R, -1, "R"], [f.L, 1, "L"]]) {
        const m = A2.wr && A2.wr.userData.hand;
        if (!m) continue;
        const kind = f.levite && side > 0 ? "rest" : f.handK[k], geo = W.hands[kind] && (far ? W.handMid(kind, side) : W.hands[kind][side]);
        if (geo && m.geometry !== geo) m.geometry = geo;
      }
    };
    const applyLamb = () => {
      const L = W.lamb, s = L.st;
      L.g.visible = !!s.vis;
      if (!s.vis) return;
      L.g.position.set(s.x, s.y, s.z);
      L.g.rotation.y = s.yaw;
      if (s.pose === "bound") {   // on its side, the legs west, held together (model choice for "ופניו למערב")
        L.body.rotation.z = -HP;
        L.body.position.set(-0.3, 0.32, 0);
        L.legs.forEach((lg, i) => { lg.rotation.x = i < 2 ? -0.5 : 0.5; });
        L.head.rotation.set(-0.4, 0, 0);
      } else {
        L.body.rotation.z = 0;
        L.body.position.set(0, 0, 0);
        const w = s.pose === "walk" ? Math.sin(s.ph) * 0.45 : 0;
        L.legs.forEach((lg, i) => { lg.rotation.x = i === 0 || i === 3 ? w : -w; });
        L.head.rotation.set(0, 0, 0);
      }
    };
    const QA = new Quaternion(), QB = new Quaternion(), EU = new Euler();
    // HAND_GRIP_A2 (the coordinator, on 53: "באחיזת כלי, האצבעות עוטפות את הידית, בלי לחדור לתוכה ובלי רווח"): a vessel held by its
    // handle (p.handle: { at - a point on the handle's axis where the hand holds it, dir - the handle's way from the hand to the vessel, in
    // the vessel's frame }) lies in the closed hand's ring: the handle's axis through the ring's middle and along its way (the ring as
    // wide as the handle - hand.js: grip 0.02, fist 0.006 kit units). An upright vessel (a fire pan, the mizrak) stays level: it turns
    // about the upright so that its handle goes the hand's way, and the wrist bends the hand to the handle; any other (the magrefa) goes
    // with the hand, its handle along the ring, its top as near up as it can be. MODEL CHOICES: the fire pans' and the magrefa's handles
    // 0.028 amah in radius (as the ring; 0.035 and 0.04 until now), held at their ends; the kaf's lip rolled (0.028) and held by it, the
    // vessel hanging outward; the mizrak's thin rod in the fist, 0.022 in from its end
    const _hA = new Vector3(), _hD = new Vector3(), _hW = new Vector3(), _hQ = new Quaternion(), _hQE = new Quaternion(), _hM = new Matrix4(), _hM2 = new Matrix4();
    const _hX = new Vector3(), _hY = new Vector3(), _hZ = new Vector3(), _hUp = new Vector3(0, 1, 0);
    const holdHandle = (f, A2, side, p, hk) => {
      const gp = A2.grip, o = p.o, H = p.handle, R = W.ring[hk], AX = R.ax[side], G = R.at[side];
      A2.el.updateWorldMatrix(true, false);
      A2.el.getWorldQuaternion(_hQE);
      _hA.copy(AX).applyQuaternion(A2.wr.quaternion).applyQuaternion(_hQE);   // the ring's way in the world, as the arm holds it
      const hd = side > 0 && H.dirL ? H.dirL : H.dir;
      _hD.set(hd[0], hd[1], hd[2]).normalize();
      if (p.upright) {
        // its level way: the ring's, and where the ring stands nearly upright (the forearm before him) the forearm's
        _hX.set(0, -1, 0).applyQuaternion(A2.wr.quaternion).applyQuaternion(_hQE);
        const lh = Math.hypot(_hA.x, _hA.z), wf = clamp(1 - lh / 0.6, 0, 1);
        _hQ.setFromAxisAngle(_hUp, Math.atan2(_hA.x + _hX.x * wf, _hA.z + _hX.z * wf) - Math.atan2(_hD.x, _hD.z));
        _hW.copy(_hD).applyQuaternion(_hQ).applyQuaternion(QB.copy(_hQE).invert());   // the handle's way in the elbow's frame
        A2.wr.quaternion.setFromUnitVectors(AX, _hW);
      } else {
        const bx = (v, d, u) => { v.copy(u).addScaledVector(d, -u.dot(d)); if (v.lengthSq() < 1e-6) v.set(1, 0, 0).addScaledVector(d, -d.x); return v.normalize(); };
        bx(_hY, _hD, _hUp); _hX.crossVectors(_hY, _hD); _hM.makeBasis(_hX, _hY, _hD);           // the vessel's own: (side, up, handle)
        bx(_hY, _hA, _hUp); _hX.crossVectors(_hY, _hA); _hM2.makeBasis(_hX, _hY, _hZ.copy(_hA));  // the same in the world
        _hQ.setFromRotationMatrix(_hM2.multiply(_hM.transpose()));
      }
      gp.position.set(G.x, G.y, G.z).applyQuaternion(A2.wr.quaternion);   // the ring turns with the wrist, about its joint
      gp.position.y -= gp.userData.fo;
      gp.updateWorldMatrix(true, false);
      gp.getWorldQuaternion(QA);
      o.quaternion.copy(QA.invert()).multiply(_hQ);
      o.position.set(-H.at[0], -H.at[1], -H.at[2]).applyQuaternion(o.quaternion);
    };
    // TRUMPET_HANDS_N11 (the user: "הכהנים לא אוחזים את החצוצרה בידיים"): a silver trumpet (tru1, tru2) is in BOTH hands in every frame - the
    // right by the mouthpiece, the left along the tube - at the mouth while the pose is "trumpet" (it rises and falls with the pose's
    // time), else before his chest, its bell up and forward; also while he walks and stands. The trumpet is placed in the figure's lean
    // frame and each arm is solved to it (the shoulder's two turns and the elbow's: damped Gauss-Newton on the closed hand's ring); the
    // wrist turns the ring along the tube and the arm is solved again. The two places on the tube and the poses - model choices
    const _tq = new Quaternion(), _tq2 = new Quaternion(), _te = new Euler(), _tv = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()], _tz = new Vector3(0, 0, 1);
    const trFk = (f, A2, side, a, b, c, out) => {
      _te.set(a, 0, side * b, "XYZ"); _tq.setFromEuler(_te);
      _te.set(c, 0, 0, "XYZ"); _tq2.setFromEuler(_te);
      out.copy(A2.grip.position).applyQuaternion(_tq2).add(_tv[4].set(0, -f.A.up, 0)).applyQuaternion(_tq).add(A2.sh.position);
      if (f.bend) out.y += f.bend.position.y;
      return out;
    };
    const trSolve = (f, A2, side, T, iters) => {
      let [a, b, c] = A2.ik || [-1.2, 0.05, -0.8];
      const P0 = _tv[0], P1 = _tv[1], P2 = _tv[2], P3 = _tv[3];
      for (let it = 0; it < iters; it++) {
        trFk(f, A2, side, a, b, c, P0);
        const r0 = [T.x - P0.x, T.y - P0.y, T.z - P0.z];
        if (r0[0] * r0[0] + r0[1] * r0[1] + r0[2] * r0[2] < 1e-8) break;
        const e = 1e-3, J = [];
        for (const [da, db, dc, Pn] of [[e, 0, 0, P1], [0, e, 0, P2], [0, 0, e, P3]]) { trFk(f, A2, side, a + da, b + db, c + dc, Pn); J.push([(Pn.x - P0.x) / e, (Pn.y - P0.y) / e, (Pn.z - P0.z) / e]); }
        const l = 0.02, M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let q = i === j ? l : 0; for (let k = 0; k < 3; k++) q += J[k][i] * J[k][j]; M[i][j] = q; }
        const det = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
        if (Math.abs(det) < 1e-12) break;
        const inv = (i, j) => { const i1 = (i + 1) % 3, i2 = (i + 2) % 3, j1 = (j + 1) % 3, j2 = (j + 2) % 3; return (M[j1][i1] * M[j2][i2] - M[j1][i2] * M[j2][i1]) / det; };
        const y = [0, 1, 2].map((i) => inv(i, 0) * r0[0] + inv(i, 1) * r0[1] + inv(i, 2) * r0[2]);
        a += J[0][0] * y[0] + J[0][1] * y[1] + J[0][2] * y[2];
        b += J[1][0] * y[0] + J[1][1] * y[1] + J[1][2] * y[2];
        c += J[2][0] * y[0] + J[2][1] * y[1] + J[2][2] * y[2];
        a = clamp(a, -2.9, 1.0); b = clamp(b, -1.1, 1.2); c = clamp(c, -2.75, 0.05);
      }
      A2.ik = [a, b, c];
      A2.sh.rotation.set(a, 0, side * b); A2.el.rotation.set(c, 0, 0);
      return trFk(f, A2, side, a, b, c, P0).distanceTo(T);
    };
    const trHold = (f, p) => {
      if (!f.A || !f.L.wr || !W.ring || !W.ring.grip || !SH.priestKit) return false;
      const o = p.o, s = f.st, k = s.pose === "trumpet" ? smooth(clamp((s.t || 0) / 0.4, 0, 1)) * smooth(clamp((s.tl == null ? 9 : s.tl) / 0.3, 0, 1)) : 0;
      if (o.parent !== f.lean) f.lean.add(o);
      // the trumpet (its tube along +z, from the mouthpiece at z -0.1): its mouthpiece at the mouth, or before his chest
      const my = SH.priestKit.HEAD_Y * SH.priestKit.FS - 0.17, dy = lerp(0.62, 0.32, k), dz = Math.sqrt(1 - dy * dy);
      const d = _tv[4].set(0, dy, dz);
      const mx = 0, mY = lerp(f.A.sy - 0.5, my, k), mZ = lerp(0.3, 0.14, k);
      o.quaternion.setFromUnitVectors(_tz, d);
      o.position.set(mx + d.x * 0.1, mY + d.y * 0.1, mZ + d.z * 0.1);
      o.scale.set(1, 1, 1);
      const dir = d.clone();
      let miss = 0;
      f.handK = f.handK || { R: "grip", L: "grip" }; f.handK.R = f.handK.L = "grip"; setHands(f);
      for (const [A2, side, zz] of [[f.R, -1, 0.26], [f.L, 1, 0.82]]) {
        const T = new Vector3(mx, mY, mZ).addScaledVector(dir, zz + 0.0);
        const AX = W.ring.grip.ax[side], G = W.ring.grip.at[side];
        for (let pass = 0; pass < 2; pass++) {
          miss = Math.max(miss, trSolve(f, A2, side, T, pass ? 4 : 6));
          // the wrist turns the ring along the tube (in the elbow's frame), the ring goes with it
          _te.set(A2.sh.rotation.x, 0, A2.sh.rotation.z, "XYZ"); _tq.setFromEuler(_te);
          _te.set(A2.el.rotation.x, 0, 0, "XYZ"); _tq2.setFromEuler(_te); _tq.multiply(_tq2).invert();
          const ax = _tv[3].copy(dir).applyQuaternion(_tq);
          A2.wr.quaternion.setFromUnitVectors(AX, ax);
          A2.grip.position.set(G.x, G.y, G.z).applyQuaternion(A2.wr.quaternion);
          A2.grip.position.y -= f.A.fo;
        }
      }
      f.trMiss = miss;
      return true;
    };
    const applyProps = () => {
      for (const id in W.props) {
        const p = W.props[id], s = p.st, o = p.o;
        if (!s.vis) { o.visible = false; continue; }
        if (s.fig) {
          const f = W.figs[s.fig];
          if (!f.st.vis) { o.visible = false; continue; }
          if (/^tru[12]$/.test(id) && trHold(f, p)) { o.visible = true; continue; }   // TRUMPET_HANDS_N11: both hands
          const A2 = s.hand === "L" ? f.L : f.R, gp = A2.grip, side = s.hand === "L" ? 1 : -1, hk = /^(lyre|nevel)/.test(id) ? null : p.hold || "grip";
          if (f.handK && W.hands && hk) { f.handK[s.hand === "L" ? "L" : "R"] = hk; setHands(f); }   // HAND_A2: closed round what it holds (the instruments rest on the hand)
          if (o.parent !== gp) gp.add(o);
          if (hk && W.ring && gp.userData.fo != null) {   // HAND_GRIP_A2: the grip where this pose's ring is
            const G = W.ring[hk].at[side];
            gp.position.set(G.x, -gp.userData.fo + G.y, G.z);
            if (p.handle && A2.wr) { holdHandle(f, A2, side, p, hk); o.visible = true; continue; }
          }
          o.position.set(p.grip.p[0], p.grip.p[1], p.grip.p[2]);
          o.rotation.set(p.grip.r[0], p.grip.r[1], p.grip.r[2]);
          if (p.upright) {   // vessels stay upright whatever the arm does
            gp.getWorldQuaternion(QA);
            EU.set(0, f.g.rotation.y + (p.grip.r[1] || 0), 0);   // MUSICIANS_305: and its own turn
            QB.setFromEuler(EU);
            o.quaternion.copy(QA.invert()).multiply(QB);
          }
        } else {
          if (o.parent !== W.group) W.group.add(o);
          o.position.set(s.x, s.y, s.z);
          o.rotation.set(s.rx || 0, s.ry || 0, 0);
        }
        o.visible = true;
      }
    };
    // BLOOD_THROW_A2: the throw - out of the mizrak in a dark red jet, in an arc onto the corner (N.blood.ne / .sw rising 0..1: the jet
    // to 0.45, its drops striking by 0.75; drops thrown back off the stone and falling); the remainder poured onto the southern yesod
    // (N.blood.ys): a stream out of the tilted bowl down to the yesod, a few drops splashing there. Zevachim 5:4 "ושירים היה שופך על
    // יסוד דרומי"; the forms and the timing - model choices
    const _bv = [new Vector3(), new Vector3(), new Vector3()], _bm4 = new Matrix4(), _bq = new Quaternion(), _bs = new Vector3();
    const bhash = (i, k) => { const q = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return q - Math.floor(q); };
    const bloodFx = () => {
      const B = W.blood && W.blood.fx;
      if (!B) return;
      const mz = W.props.mizrak && W.props.mizrak.o;
      let n = 0;
      for (const m of B.pour) m.visible = false;
      const put = (x, y, z, r) => { if (n >= B.drops.instanceMatrix.count) return; _bm4.compose(_bs.set(x, y, z), _bq, _bv[2].set(r, r * 1.15, r)); B.drops.setMatrixAt(n++, _bm4); };
      if (mz && mz.visible) {
        mz.updateWorldMatrix(true, false);
        const src = mz.userData.lip ? mz.localToWorld(_bv[0].copy(mz.userData.lip(0)).setY(mz.userData.rimY - 0.02)) : mz.localToWorld(_bv[0].set(0, 0.15, 0.18));   // MIZRAK_A2: its rim before him
        for (const k of ["ne", "sw"]) {
          const v = N.blood[k];
          if (!(v > 0.001 && v < 0.999)) continue;
          const c = W.blood.corner[k], T = W.altarG.localToWorld(_bv[1].set(c[0], c[1], c[2]));
          const out = [T.x - src.x, 0, T.z - src.z], ol = Math.hypot(out[0], out[2]) || 1;   // away from the stone: back toward the thrower
          for (let i = 0; i < 40; i++) {   // the jet: drops launched one after another, each flying 0.3 of the way
            const u0 = (i / 40) * 0.45, p = (v - u0) / 0.3;
            if (p <= 0) continue;
            if (p < 1) {
              const j1 = bhash(i, 1) - 0.5, j2 = bhash(i, 2) - 0.5;
              put(lerp(src.x, T.x, p) + j1 * 0.12 * p, lerp(src.y, T.y, p) + Math.sin(Math.PI * p) * 0.45 + j2 * 0.1 * p, lerp(src.z, T.z, p) - j1 * 0.08 * p, 0.014 + 0.018 * bhash(i, 3));
            } else if (p < 1.9 && i % 3 !== 0) {   // thrown back off the stone, and falling
              const q = (p - 1) / 0.9, a = (bhash(i, 4) - 0.5) * 2.2, sp = 0.5 + 0.7 * bhash(i, 5), ux = -out[0] / ol, uz = -out[2] / ol;
              const dx = ux * Math.cos(a) - uz * Math.sin(a), dz = ux * Math.sin(a) + uz * Math.cos(a);
              put(T.x + dx * sp * q, T.y + (0.6 * bhash(i, 6)) * q - 2.6 * q * q, T.z + dz * sp * q, 0.018 + 0.015 * bhash(i, 7));
            }
          }
          if (v < 0.42) {   // the jet's body: a tube along the arc behind its head
            const head = Math.min(1, v / 0.3), tail = Math.max(0, (v - 0.2) / 0.3);
            for (let s2 = 0; s2 < 6; s2++) {
              const pa = lerp(tail, head, s2 / 6), pb = lerp(tail, head, (s2 + 1) / 6), at = (pp) => [lerp(src.x, T.x, pp), lerp(src.y, T.y, pp) + Math.sin(Math.PI * pp) * 0.45, lerp(src.z, T.z, pp)];
              const m = B.pour[s2]; seg(m, at(pa), at(pb)); m.scale.x = m.scale.z = 0.02; m.visible = pb > pa + 1e-3;
            }
          }
        }
        const v = N.blood.ys;
        if (v > 0.02 && v < 0.92) {   // the remainder poured out: a stream from the lip down to the yesod
          const c = W.blood.corner.ys, T = W.altarG.localToWorld(_bv[1].set(c[0], c[1], c[2]));
          const at = (t) => [lerp(src.x, T.x, t), src.y - (src.y - T.y) * t * t, lerp(src.z, T.z, t)];
          for (let s2 = 0; s2 < 8; s2++) { const m = B.pour[s2]; seg(m, at(s2 / 8), at((s2 + 1) / 8)); m.scale.x = m.scale.z = 0.022 + 0.012 * (s2 / 8); m.visible = true; }
          for (let i = 0; i < 10; i++) { const ph = (v * 9 + bhash(i, 8)) % 1, a = bhash(i, 9) * 6.283, d = 0.1 + 0.35 * ph; put(T.x + Math.cos(a) * d, T.y + 0.25 * Math.sin(Math.PI * ph), T.z + Math.sin(a) * d, 0.014 + 0.01 * bhash(i, 10)); }
        }
      }
      B.drops.count = n;
      B.drops.instanceMatrix.needsUpdate = true;
    };
    let roofAt = 0;
    const applyWorld = () => {
      W.altarG.position.z = D;
      W.altarG.position.y = TOP - TOP0;
      W.sleepers.visible = N.sleepers > 0.5; sleepersNow();   // SLEEPERS_N3
      if (W.night) W.night.apply(N);   // NIGHT_WATCH_305
      W.L1.forEach((m, i) => { m.visible = N.l1 > i + 0.5; });
      W.L2.forEach((m, i) => { m.visible = N.l2 > i + 0.5; });
      for (const m of W.modelGez) m.visible = N.gz > 0.5;
      if (SH.altarNight && fnc(SH.altarNight.set)) SH.altarNight.set(N.night);   // NIGHT_COALS_304
      W.MAT.woodNew.emissiveIntensity = 0.55 * N.glow;
      const T = SH.tapuach;
      if (T && T.heap) { const h = T.heap; if (!h.userData.s0) h.userData.s0 = h.scale.clone(); const s0 = h.userData.s0; h.scale.set(s0.x * Math.sqrt(N.tap), s0.y * N.tap, s0.z * Math.sqrt(N.tap)); }
      const g = SH.goldenAltar;
      if (g) {
        if (g.coals) g.coals.visible = N.coals > 0.5;
        for (const m of g.smoke || []) {
          const k = Math.max(0.02, N.smoke), ht = m.geometry.parameters ? m.geometry.parameters.height : 0;
          m.visible = N.smoke > 0.02;
          m.scale.y = k;
          m.position.y = g.top + 0.05 + ht * k / 2;
        }
        const ag = W.props.ashGold;
        if (N.ashGold > 0.02) { Object.assign(ag.st, { vis: true, fig: null, x: g.x, y: g.top + 0.01, z: g.z - 0.13 }); ag.o.scale.setScalar(Math.max(0.05, N.ashGold)); } else ag.st.vis = false;
      }
      for (const k of ["ne", "sw", "ys"]) for (const m of W.blood[k]) {   // BLOOD_THROW_A2: a stain shows when the blood reaches it, and grows
        const v = N.blood[k], kd = m.userData.kind, a = kd === "drip" ? clamp((v - 0.55) / 0.4, 0, 1) : kd === "pool" ? clamp((v - 0.12) / 0.5, 0, 1) : clamp((v - 0.32) / 0.25, 0, 1);
        m.visible = a > 0.01; m.material.opacity = 0.95 * a;
        const sc = kd === "drip" ? 1 : 0.55 + 0.45 * smooth(a); m.scale.set(sc, kd === "drip" ? 0.4 + 0.6 * smooth(a) : sc, sc);
        if (kd === "drip") m.position.y = F + 1.0 - 0.45 * m.scale.y;
      }
      W.props.machtaS.o.userData.coals.visible = N.coalsS > 0.5;
      W.props.machtaG.o.userData.coals.visible = N.coalsG > 0.5;
      W.props.teni.o.userData.ash.visible = N.teniAsh > 0.5;
      if (SH.mokedSlab && fnc(SH.mokedSlab.pose)) SH.mokedSlab.pose(N.slab, N.slabKeys > 0.5);   // KEY_SLAB_211
      W.props.kaf.o.userData.lid.visible = N.kafLid > 0.5;
      W.props.mizrak.o.userData.blood.visible = N.mizrak > 0.5;
      W.props.torch1.o.userData.light.intensity = N.torches[0] ? 26 : 0;
      W.props.torch2.o.userData.light.intensity = N.torches[1] ? 26 : 0;
      const m = SH.menorah;
      if (m && m.lampK) for (let i = 0; i < 7; i++) m.lampK[i] = clamp(N.lamps[i], 0, 1);
      if (SH.greatGate && fnc(SH.greatGate.pose)) { try { SH.greatGate.pose(N.gate); } catch (_) {} }
      chelGate(N.chelG);   // CHEL_GATE_215
      if (SH.mukhni && fnc(SH.mukhni.pose)) { try { SH.mukhni.pose(5.6 * N.mukhni, null); } catch (_) {} }
      {   // KIYOR_A2: 1 - the west spout (the winner), 12 - all twelve; built again when the laver's size changed
        const sz = SH.kiyorSize ? SH.kiyorSize.mode : "", want = N.kidWater >= 12 ? "all" : N.kidWater > 0 ? "one" : "";
        if (want && (!W.kidWater || W.kidWater.userData.k !== want + sz)) {
          if (W.kidWater) W.group.remove(W.kidWater);
          try { W.kidWater = KID.water(want === "all" ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [6]); W.kidWater.userData.k = want + sz; } catch (_) { W.kidWater = null; }
        }
        if (W.kidWater) { W.kidWater.visible = !!want; if (want) KID.waterAt(W.kidWater); }   // KIDDUSH_WATER_A2
      }
      const now = performance.now();
      if (N.roofs && fnc(SH.openFor) && now - roofAt > 2500) { roofAt = now; try { SH.openFor("crt-lishkot-roofs", 6000); } catch (_) {} }
    };
    // the night (0), the first light (1: "האיר פני כל המזרח"), sunrise (2), the morning (3): the sun from the east, the sky, the lights,
    // the fog, the environment. The light comes with "ברקאי" and grows to the end, whichever the order (skyAt)
    const SKYC = { night: new Color(0x070b16), fogN: new Color(0x0a0f1c), fog: new Color(), dir: new Vector3() };
    let saved = null;
    const applySky = (s) => {
      const K = SH.sky;
      // TEFILLIN_A2 (the user's decision 67: "חוץ מבתחילת הבוקר לפני שעלה עמוד השחר"): the tefillin from the dawn ("alot", s 0.6) on
      // TEF_S2 (fix-s2, 23.11.2026 - the coordinator's word on the user's decision 67: no tefillin on anyone by night, until "ברקאי"):
      // until the east is lit at "ברקאי" (skyAt: 2.0 at 7.4 s of that stage, the call at 7.8 s) - until now from the first grey (0.6)
      if (SH.tefOff) { if (TM.active && s < 2.0) SH.tefOff.add("tamid"); else SH.tefOff.delete("tamid"); }
      if (!K || !saved) return;
      // TAMID_NIGHT_207: the lotteries' night (55-payis.js NIGHT) - the phase by the demonstration's clock of the sky
      const NK = SH.nightKit;
      if (NK && saved.night) {
        const ph = s < 0.6 ? ["night", "alot", s / 0.6] : s < 1.2 ? ["alot", "barkai", (s - 0.6) / 0.6] : s < 2 ? ["barkai", "heir", (s - 1.2) / 0.8] : ["heir", "morning", Math.min(1, s - 2)];
        NK.set(ph[0], ph[1], ph[2]);
        K.sky.visible = true;
        ctx2.scene.background = saved.bg;
        return;
      }
      const day = clamp(s / 3, 0, 1), dark = 1 - smooth(clamp(s / 2.2, 0, 1));   // dark: 1 in the night, 0 from the sunrise
      const el = s < 1 ? -14 + 10 * s : s < 2 ? -4 + 9 * (s - 1) : 5 + 17 * (s - 2);   // degrees: -14 .. -4 .. 5 .. 22
      const az = MathUtils.degToRad(s < 2 ? 92 : lerp(92, 112, s - 2));
      const dir = SKYC.dir.setFromSphericalCoords(1, MathUtils.degToRad(90 - el), az);
      K.sky.material.uniforms.sunPosition.value.copy(dir);
      K.sky.visible = s > 0.6;
      ctx2.scene.background = s > 0.6 ? saved.bg : SKYC.night;
      K.sun.position.copy(dir).multiplyScalar(700);
      // the night is a dim blue light (model choice: enough to see the figures by), and the torches, the hearth and the pyres
      const sk = clamp((el + 2) / 24, 0, 1);
      K.sun.intensity = K.sunInt * lerp(0.28, 1, Math.max(sk, 1 - dark));
      K.sun.color.setRGB(lerp(0.55, 1, sk), lerp(0.66, 0.93, sk), lerp(1, 0.8, sk));
      K.hemi.intensity = K.hemiInt * lerp(1, 0.5, dark);
      ctx2.renderer.toneMappingExposure = K.exposure * lerp(1, 0.6, dark);
      ctx2.scene.environment = K.env;
      if (ctx2.scene.fog) ctx2.scene.fog.color.copy(SKYC.fogN).lerp(SKYC.fog.setHex(K.fogColor), day);
    };
    const skyAt = (list, i, sec) => {
      const kB = list.indexOf("barkai");
      if (kB < 0 || i < kB) return 0;
      const st = DATA.stages[list[i]], u = clamp(sec / Math.max(1, st.dur), 0, 1);
      // BARKAI_LIGHT_306 (a report sent on to the user: "כשהרואה אומר ברקאי לא רואים את האור"): the east lights while the watcher goes
      // up and looks - the night kit's "heir", whose glow is the first seen in the east, by 7.4 s (his call, 7.8 s: "אם הגיע, הרואה
      // אומר, ברקאי", Tamid 3:2) - and a little more by 11.8 s ("האיר פני כל המזרח", 12 s), the sun still under the horizon
      // ("קודם שתעלה החמה", the Rambam, Temidin 1:2). The next stages: the dawn to the stage of the Shema (the sun at the horizon by
      // its end), then the morning. Until 2.0.14 the light began at 2 s and was only at "barkai" (still dark) at 14 s. Model choices
      if (i === kB) return sec < 7.4 ? 2.0 * smooth(clamp((sec - 1.4) / 6.0, 0, 1)) : 2.0 + 0.08 * smooth(clamp((sec - 7.4) / 4.4, 0, 1));
      const n = list.length - 1 - kB, kS = list.indexOf("shema");
      const v = (k) => kS > kB + 1 && kS < list.length - 1 ? (k <= kS ? lerp(2.08, 2.18, (k - kB) / (kS - kB)) : lerp(2.18, 3.0, (k - kS) / (list.length - 1 - kS))) : lerp(2.08, 3.0, (k - kB) / Math.max(1, n));
      return lerp(v(i - 1 >= kB ? i - 1 : kB), v(i), u);
    };
    const enterWorld = () => {
      const K = SH.sky, lg = ctx2.scene.getObjectByName("labels");
      // the model's labels are put aside while the demonstration runs (its own tags name the priests); they come back at its end
      saved = { bg: ctx2.scene.background, sunCol: K ? K.sun.color.clone() : null, labels: lg ? lg.visible : null };
      { const NK = SH.nightKit; saved.night = !!(NK && NK.begin()); }   // TAMID_NIGHT_207
      if (lg) lg.visible = false;
      if (fnc(SH.stopDemos)) { try { SH.stopDemos("tamid-demo"); } catch (_) {} }   // (TAMID_STOP_209: the others, not itself)
      // SLAUGHTER_HOLD_211: the priests' ways cross the slaughter place as it stands in the usual layout (two rows of pillars, the
      // tables south of them) - the Ra'avyah's row and the Gra's (40-altar.js, SLAUGHTER_SPLIT_211) stand across those ways. While
      // the demonstration runs the usual layout is shown; the viewer's choice comes back at its end
      { const SL = SH.slaughterLayout; saved.slaughter = SL && (SL.current === "raavyah" || SL.current === "gra") ? SL.current : null; if (saved.slaughter) SL.set("bartenura"); }
      applyLampRot();
      floorCache.clear();
      W.paths.clear();
      W.routes.clear();
      lastI = -1;
    };
    const leaveWorld = () => {
      W.group.visible = false;
      if (SH.tefOff) SH.tefOff.delete("tamid");   // TEFILLIN_A2
      stopSounds();
      if (saved && saved.slaughter && SH.slaughterLayout) { SH.slaughterLayout.set(saved.slaughter); saved.slaughter = null; }   // SLAUGHTER_HOLD_211
      if (saved && saved.night && SH.nightKit) SH.nightKit.end();   // TAMID_NIGHT_207 (the lines below give the day back as well)
      const K = SH.sky;
      if (K) {
        K.sky.material.uniforms.sunPosition.value.copy(K.sunDir);
        K.sky.visible = true;
        K.sun.position.copy(K.sunDir).multiplyScalar(700);
        K.sun.intensity = K.sunInt;
        if (saved && saved.sunCol) K.sun.color.copy(saved.sunCol);
        K.hemi.intensity = K.hemiInt;
        ctx2.renderer.toneMappingExposure = K.exposure;
        ctx2.scene.environment = K.env;
        if (ctx2.scene.fog) ctx2.scene.fog.color.setHex(K.fogColor);
      }
      ctx2.scene.background = saved ? saved.bg : null;
      { const lg = ctx2.scene.getObjectByName("labels"); if (lg && saved && saved.labels != null) lg.visible = saved.labels; }
      const m = SH.menorah;
      if (m && fnc(m.reset)) m.reset();
      if (SH.mokedSlab && fnc(SH.mokedSlab.pose)) SH.mokedSlab.pose(0, true);   // KEY_SLAB_211: the tablet in its place, the keys under it
      const T = SH.tapuach;
      if (T && T.heap && T.heap.userData.s0) T.heap.scale.copy(T.heap.userData.s0);
      const g = SH.goldenAltar;
      if (g) { if (g.coals) g.coals.visible = true; for (const s of g.smoke || []) { s.visible = true; s.scale.y = 1; s.position.y = g.top + 0.05 + (s.geometry.parameters ? s.geometry.parameters.height / 2 : 0); } }
      for (const o of W.modelGez) o.visible = true;
      if (SH.altarNight && fnc(SH.altarNight.set)) SH.altarNight.set(0);   // NIGHT_COALS_304: the model's own pyres again
      chelGate(-1);   // CHEL_GATE_215: the leaves as they were
      if (SH.greatGate && fnc(SH.greatGate.pose)) { try { SH.greatGate.pose(1); } catch (_) {} }
      if (SH.mukhni && fnc(SH.mukhni.stop)) { try { SH.mukhni.stop(); } catch (_) {} }
      saved = null;
      TM.stage = -1;
    };
    // CHEL_GATE_215: the gate of Beit HaMoked to the chel (10-core.js doors, tagged userData.tmDoors; it stands ajar in the model) -
    // "הממונה בא ודופק עליהם, והם פתחו לו" (Tamid 1:2): from the knock its leaves open out to the chel (half a radian - the landing
    // before it is 2.3 amot deep), so that the officer walks in through the doorway and not through the leaves (found 16.11.2026: he passed between
    // two leaves ajar, 0.4 amah apart). At the demo's end the leaves are as they were.
    const CG = { o: null, r0: null, cur: null };
    const chelGate = (u) => {
      if (u < 0) { if (CG.o && CG.r0) { CG.o.children[0].rotation.y = CG.r0[0]; CG.o.children[1].rotation.y = CG.r0[1]; } CG.o = CG.r0 = CG.cur = null; return; }
      if (!CG.o) {
        const P0 = SH.mokedGates && SH.mokedGates.mode === "adjacent" ? [-2.5, -73.3] : [-18, -77];
        let best = null, bd = 2.5;
        const v = new Vector3();
        ctx2.scene.traverse((o) => {
          if (!o.userData || !o.userData.tmDoors || o.children.length < 2) return;
          let q = o, vis = true;
          while (q && vis) { vis = q.visible; q = q.parent; }
          if (!vis) return;
          o.getWorldPosition(v);
          const d = Math.hypot(v.x - P0[0], v.z - P0[1]);
          if (d < bd) { bd = d; best = o; }
        });
        if (!best) return;
        CG.o = best; CG.r0 = [best.children[0].rotation.y, best.children[1].rotation.y];
      }
      if (u === CG.cur) return;
      CG.cur = u;
      if (u <= 0) { CG.o.children[0].rotation.y = CG.r0[0]; CG.o.children[1].rotation.y = CG.r0[1]; return; }
      // half a radian: the leaves open out over the landing before the gate (it is 2.3 deep) and leave 1.6 amot between them
      const inw = CG.o.userData.tmDoors.inward || 1, a = 0.5, k = Math.min(1, u);
      CG.o.children[0].rotation.y = lerp(CG.r0[0], -a * inw, k);
      CG.o.children[1].rotation.y = lerp(CG.r0[1], Math.PI + a * inw, k);
    };
    // FOLLOW_420 (the user 24.11.2026: "צבר את הגחלים המצלמה לא עוקבת - כך כל חלק המזבח, גחלים, גזרי עצים וכו'"; "אברים לכבש - מצלמה
    // לא עוקבת"; "כל עבודת הבוקר צריך בדיקת מעקב מצלמה"): a stage without a moving eye of its own (CAMK) - until now its slide's one view
    // the whole stage - follows the one who works: the figure that moved last (it stays with him while he stands and works, and passes
    // to another only when that one moves on), seen from the side of the stage's own view, at its height, nearer (7-15 amot), the eye
    // gliding after him. A line from the eye to him through a wall raises the eye. A jump of the clock (a seek) puts it there at once
    const FOL = { key: "", last: {}, actor: null, still: 0, cam: new Vector3(), tg: new Vector3(), sec: 0, el: 0, chk: 0 };
    const fv = new Vector3(), fw = new Vector3(), fq = new Vector3();
    const followCam = (id, o, sec) => {
      const key = id + "|" + o;
      let jump = Math.abs(sec - FOL.sec) > 0.9;
      if (FOL.key !== key) { FOL.key = key; FOL.last = {}; FOL.actor = null; FOL.still = 0; FOL.cam.copy(ctx2.camera.position); FOL.tg.copy(ctx2.controls.target); FOL.el = 0; jump = false; }
      FOL.sec = sec;
      let best = null, bd = 0.012;
      for (const k in W.figs) {
        const f = W.figs[k], st = f.st;
        if (!st || !st.vis || !f.g) { delete FOL.last[k]; continue; }
        const L = FOL.last[k], q = f.g.getWorldPosition(fq);   // (world: the figures' group moves with the altar's place)
        if (L && !jump) { const d = Math.hypot(q.x - L[0], q.z - L[2]) + Math.abs(q.y - L[1]) * 0.5; if (d > bd) { bd = d; best = k; } }
        FOL.last[k] = [q.x, q.y, q.z];
      }
      const cur = FOL.actor && W.figs[FOL.actor] && W.figs[FOL.actor].st.vis ? FOL.actor : null;
      if (best === cur) FOL.still = 0; else if (cur) FOL.still++;
      if (!cur || (best && FOL.still > 20)) { if (best) { FOL.actor = best; FOL.still = 0; } }
      if (!FOL.actor || !W.figs[FOL.actor] || !W.figs[FOL.actor].st.vis) return;
      const v = VIEW[id] ? VIEW[id](o) : null;
      if (!v || !v[0] || !v[1]) return;
      const g = W.figs[FOL.actor].g.getWorldPosition(fq);
      let hx = v[0][0] - v[1][0], hz = v[0][2] - v[1][2], hl = Math.hypot(hx, hz);
      if (hl < 1e-3) { hx = 0; hz = 1; hl = 1; }
      hx /= hl; hz /= hl;
      const full = Math.hypot(hl, v[0][1] - v[1][1]);
      const D = Math.max(7, Math.min(15, full * 0.55));
      let el = Math.min(1.35, Math.max(0.35, Math.min(0.95, Math.atan2(v[0][1] - v[1][1], hl))) + FOL.el);
      fw.set(g.x, g.y + 1.6, g.z);
      fv.set(fw.x + hx * Math.cos(el) * D, fw.y + Math.sin(el) * D, fw.z + hz * Math.cos(el) * D);
      if (--FOL.chk <= 0 && fnc(TM.qaClear)) {   // every half second or so: a wall between - higher; free - back down by steps
        FOL.chk = 8;
        let ok = true; try { ok = !TM.qaClear(fv.toArray(), fw.toArray()); } catch (_) { ok = true; }   // (qaClear: null when the line is free)
        if (!ok && FOL.el < 0.9) FOL.el += 0.25; else if (ok && FOL.el > 0) FOL.el = Math.max(0, FOL.el - 0.04);
      }
      const k = jump ? 1 : 0.07;
      FOL.tg.lerp(fw, k); FOL.cam.lerp(fv, k);
      ctx2.camera.position.copy(FOL.cam);
      ctx2.controls.target.copy(FOL.tg);
      ctx2.camera.lookAt(FOL.tg);
    };
    // ---------------------------------------------------------------- the clock
    let lastI = -1, lastSec = 0, lastO = "";
    const play = (o, i, sec) => {
      const list = TM.list(o);
      i = clamp(i | 0, 0, list.length - 1);
      const d = altDz(), top = TOP0 + topLift();
      if (d !== D || top !== TOP) { D = d; TOP = top; floorCache.clear(); W.paths.clear(); W.routes.clear(); }
      resetState();
      for (let k = 0; k <= i; k++) {
        const id = list[k], st = DATA.stages[id], fn = SC[id];
        if (k === i) for (const f in W.figs) W.figs[f].st.tag = "";
        snap();
        const tau = k < i ? st.dur + 1 : clamp(sec, 0, st.dur);
        if (fn) { try { fn(API(tau, id, k > 0 ? list[k - 1] : null)); } catch (e) { console.warn("[tamid] stage " + id + ":", e && e.message); } }
      }
      if (fnc(TM.qa)) { try { TM.qa(API(1e9, "qa", null)); } catch (e) { console.warn("[tamid] qa:", e && e.message); } }
      for (const id in W.figs) applyFig(W.figs[id]);
      applyLamb();
      applyWorld();
      applyProps();
      bloodFx();   // BLOOD_THROW_A2
      applySky(skyAt(list, i, sec));
      // the moving eye of a stage (CAMK), after the slide's own flight (sec > 0) and never while the viewer holds the presentation
      const ck = CAMK[list[i]];
      if (ck && sec > 0.02 && !tourHeld() && ctx2.camera && ctx2.controls) {
        const [p, t] = camKey(ck(o), sec);
        ctx2.camera.position.set(p[0], p[1], p[2]);
        ctx2.controls.target.set(t[0], t[1], t[2]);
        // CAM_219 (the audit): aimed in this very frame - it is written after controls.update(), and a key past the polar limit (the
        // patrol's, 0.11 rad from straight above) was drawn aimed from the clamped pose, about 5 degrees off its target
        ctx2.camera.lookAt(t[0], t[1], t[2]);
      } else if (!ck && sec > 0.6 && !tourHeld() && ctx2.camera && ctx2.controls) followCam(list[i], o, sec);
      // the sounds of the current stage whose second the clock has just passed (forward, in the same stage, not by a jump)
      if (i === lastI && o === lastO && sec > lastSec && sec - lastSec < 0.75) {
        const cur = list[i];
        for (const [sid, name, t] of N.fx) if (sid === cur && t > lastSec && t <= sec) sound(name);
      }
      lastI = i; lastSec = sec; lastO = o;
      TM.stage = i; TM.sec = sec;
    };
    // ---------------------------------------------------------------- the sounds (WebAudio, made here; no files)
    let AC = null, master = null;
    const live = new Set();
    const ac = () => {
      if (SH.soundOff) return null;   // SOUND_211: the settings' row "קולות בהדגמות"
      if (!AC) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        try { AC = new C(); master = AC.createGain(); master.gain.value = 0.55; master.connect(AC.destination); } catch (_) { return null; }
      }
      if (AC.state === "suspended") { try { AC.resume(); } catch (_) {} }
      return AC;
    };
    const stopSounds = () => { for (const n of live) { try { n.stop(); } catch (_) {} } live.clear(); };
    (SH.soundStops || (SH.soundStops = [])).push(stopSounds);   // SOUND_211: the row silences what sounds now
    const noiseBuf = (a, sec) => { const b = a.createBuffer(1, Math.max(1, Math.floor(a.sampleRate * sec)), a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
    const env = (g, t, att, hold, rel, peak) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + att); g.gain.setValueAtTime(peak, t + att + hold); g.gain.exponentialRampToValueAtTime(0.0001, t + att + hold + rel); };
    const osc = (a, type, f, t, dur, peak, dest, att = 0.02, rel = 0.3) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      env(g, t, att, Math.max(0, dur - att), rel, peak);
      o.connect(g); g.connect(dest || master);
      o.start(t); o.stop(t + dur + rel + 0.05);
      live.add(o); o.onended = () => live.delete(o);
      return o;
    };
    const noise = (a, t, dur, peak, fType, fFreq, q = 1, rel = 0.2) => {
      const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
      s.buffer = noiseBuf(a, dur + rel + 0.1);
      f.type = fType; f.frequency.value = fFreq; f.Q.value = q;
      env(g, t, 0.005, dur, rel, peak);
      s.connect(f); f.connect(g); g.connect(master);
      s.start(t); s.stop(t + dur + rel + 0.1);
      live.add(s); s.onended = () => live.delete(s);
    };
    const brass = (a, t, dur, f = 466) => {   // a silver trumpet: two detuned saws through a low-pass that opens
      const lp = a.createBiquadFilter();
      lp.type = "lowpass"; lp.Q.value = 2;
      lp.frequency.setValueAtTime(600, t); lp.frequency.linearRampToValueAtTime(2600, t + 0.12);
      lp.connect(master);
      osc(a, "sawtooth", f, t, dur, 0.16, lp, 0.05, 0.12);
      osc(a, "sawtooth", f * 1.004, t, dur, 0.12, lp, 0.05, 0.12);
      osc(a, "square", f / 2, t, dur, 0.04, lp, 0.05, 0.12);
    };
    // SOUNDS_300 (the user's item 18, 18.11.2026: "רעש האש בעבודת הבוקר הוא גבוה מדי ומציק"): the fire's sounds - the coals, the
    // torch, the hiss of what is put on the fire, the piles' kindling - at FIRE_LOW of their peaks before it (the others as they were).
    // 55-payis.js sounds its torches by this synthesizer too (SH.sfx.play)
    const FIRE_LOW = 0.37;
    const sound = (name) => {
      const a = ac();
      if (!a) return;
      const t = a.currentTime + 0.02;
      try {
        if (name === "knock") { for (let i = 0; i < 3; i++) { noise(a, t + i * 0.32, 0.03, 0.9, "lowpass", 380, 1, 0.15); osc(a, "sine", 95, t + i * 0.32, 0.05, 0.5, null, 0.003, 0.18); } }
        else if (name === "mukhni") { const o = osc(a, "sawtooth", 70, t, 2.6, 0.07, null, 0.2, 0.4); o.frequency.linearRampToValueAtTime(95, t + 2.6); noise(a, t + 0.3, 2.3, 0.08, "bandpass", 900, 0.8, 0.5); noise(a, t + 2.7, 0.4, 0.2, "lowpass", 600, 1, 0.8); }
        else if (name === "gate") { const o = osc(a, "sawtooth", 58, t, 4.2, 0.1, null, 0.3, 0.6); o.frequency.linearRampToValueAtTime(82, t + 3); noise(a, t, 4.2, 0.12, "lowpass", 160, 1, 0.6); osc(a, "sine", 46, t + 4.3, 0.2, 0.6, null, 0.005, 0.6); }
        else if (name === "magrefa") { for (const [f, p] of [[523, 0.3], [811, 0.22], [1307, 0.15], [1879, 0.1], [2467, 0.07]]) osc(a, "sine", f, t, 0.05, p, null, 0.002, 1.6); noise(a, t, 0.08, 0.6, "highpass", 1800, 0.7, 0.9); osc(a, "sine", 70, t, 0.1, 0.5, null, 0.003, 0.8); }
        else if (name === "ignite") noise(a, t, 1.4, 0.18 * FIRE_LOW, "bandpass", 1200, 0.6, 1.2);   // SOUNDS_300: FIRE_LOW
        // SOUND_211 (the user, 15.11.2026: more sounds in the morning's service; speech stays in the captions): a door on its pivot and
        // its thud; water at the laver; a shovel in the coals and their crackle; logs laid on the pile; the lamb; the hiss of what is
        // put on the fire; wine poured; a torch. All made here, model choices
        else if (name === "door") { const o = osc(a, "sawtooth", 140, t, 0.7, 0.05, null, 0.05, 0.2); o.frequency.linearRampToValueAtTime(95, t + 0.7); noise(a, t, 0.7, 0.06, "bandpass", 700, 4, 0.2); noise(a, t + 0.85, 0.03, 0.5, "lowpass", 300, 1, 0.2); }
        else if (name === "water") { for (let i = 0; i < 5; i++) noise(a, t + i * 0.33 + Math.random() * 0.1, 0.12, 0.22, "bandpass", 1500 + Math.random() * 1400, 1.2, 0.25); noise(a, t, 1.8, 0.05, "highpass", 2500, 0.5, 0.5); }
        else if (name === "coals") { noise(a, t, 0.5, 0.25 * FIRE_LOW, "bandpass", 2400, 2.5, 0.25); noise(a, t + 0.6, 0.45, 0.2 * FIRE_LOW, "bandpass", 2000, 2.5, 0.3); for (let i = 0; i < 8; i++) noise(a, t + 0.2 + Math.random() * 1.6, 0.012, 0.35 * FIRE_LOW, "highpass", 3000, 0.8, 0.05); }   // SOUNDS_300: FIRE_LOW
        else if (name === "wood") { for (let i = 0; i < 4; i++) { const tt = t + i * 0.55; noise(a, tt, 0.02, 0.6, "bandpass", 520 + i * 60, 3, 0.12); osc(a, "sine", 150 + i * 14, tt, 0.03, 0.3, null, 0.002, 0.12); } }
        else if (name === "bleat") {
          const bp = a.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1100; bp.Q.value = 2.5; bp.connect(master);
          const o = osc(a, "sawtooth", 420, t, 0.7, 0.14, bp, 0.05, 0.15); o.frequency.linearRampToValueAtTime(360, t + 0.7);
          const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = 11; lg.gain.value = 26; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + 1); live.add(l); l.onended = () => live.delete(l);
        }
        else if (name === "hiss") { noise(a, t, 2.2, 0.1 * FIRE_LOW, "highpass", 3500, 0.6, 1.0); for (let i = 0; i < 10; i++) noise(a, t + Math.random() * 2.4, 0.012, 0.3 * FIRE_LOW, "highpass", 2800, 0.8, 0.05); }   // SOUNDS_300: FIRE_LOW
        else if (name === "pour") { noise(a, t, 1.6, 0.12, "bandpass", 900, 1.2, 0.5); for (let i = 0; i < 6; i++) osc(a, "sine", 500 + Math.random() * 500, t + 0.1 + i * 0.25, 0.04, 0.05, null, 0.005, 0.12); }
        else if (name === "torch") { noise(a, t, 3.0, 0.07 * FIRE_LOW, "lowpass", 500, 0.7, 1.0); for (let i = 0; i < 14; i++) noise(a, t + Math.random() * 3.2, 0.012, 0.3 * FIRE_LOW, "highpass", 2600, 0.8, 0.05); }   // SOUNDS_300: FIRE_LOW
        else if (name === "barkai") osc(a, "sine", 660, t, 0.6, 0.05, null, 0.2, 0.8);
        else if (name === "strike") { noise(a, t, 0.06, 0.45, "lowpass", 900, 0.8, 0.08); osc(a, "sine", 120, t, 0.05, 0.22, null, 0.003, 0.1); }   // NIGHT_WATCH_305: a soft blow
        else if (name === "tekia") { brass(a, t, 1.4); for (let i = 0; i < 9; i++) brass(a, t + 1.75 + i * 0.2, 0.13); brass(a, t + 3.75, 1.4); }   // TERUAH_305: the nine each heard
        else if (name === "tekiaShort") brass(a, t, 1.3);
        else if (name === "cymbal") { noise(a, t, 0.05, 0.7, "highpass", 4000, 0.6, 1.8); for (const f of [3150, 4470, 5560, 7230]) osc(a, "square", f, t, 0.02, 0.025, null, 0.001, 1.2); }
        else if (name === "song" || name === "blessing") {   // a quiet choir of four voices (and for the song a lyre) - model choice
          const base = name === "blessing" ? 196 : 220, chord = [1, 5 / 4, 3 / 2, 2];
          const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1400; lp.connect(master);
          chord.forEach((r, i) => { osc(a, "triangle", base * r, t + i * 0.12, 5.5, 0.05, lp, 1.2, 2.2); osc(a, "sawtooth", base * r * 1.003, t + i * 0.12, 5.5, 0.012, lp, 1.2, 2.2); });
          if (name === "song") [0, 2, 4, 5, 7, 9, 7, 4].forEach((s, i) => osc(a, "sine", base * 2 * Math.pow(2, s / 12), t + 0.4 + i * 0.55, 0.02, 0.12, null, 0.003, 1.4));
        }
      } catch (_) {}
    };
    // SOUNDS_300: ctx2.shared.sfx is the demonstrations' synthesizer of 90-entry.js - a function, made before the modules are built.
    // play / stop are hung on it and do not take its place: before SOUNDS_300 this object replaced it, and in this house its sounds
    // were silent and every "steps" loop threw (its step calls ctx.shared.sfx("step"))
    SH.sfx = Object.assign(typeof SH.sfx === "function" ? SH.sfx : {}, { play: (name) => sound(name), stop: stopSounds });   // SOUND_211: 55-payis.js sounds the night with it
    // ---------------------------------------------------------------- the button on the model (over the altar), as the other demonstrations
    {
      const MB = Array.isArray(SH.modelButtons) ? SH.modelButtons : (SH.modelButtons = []);
      MB.push({
        id: "tamid-demo", label: "הדגמה: סדר עבודת הבוקר", labelOn: "עצור את ההדגמה", maxDist: 150,
        title: "סדר עבודת הבוקר לפי מסכת תמיד — מבית המוקד בלילה ועד שיר הלויים, שלב אחר שלב, בלשון המשנה ובסדר שנבחר בתפריט, תחת ״שיטות ומחלוקות״ (אביי או הרמב״ם).",
        anchor: () => [ACX, TOP0 + 7.5, ACZ + 14 + altDz()],
        show: () => !(ctx2.layers && ctx2.layers.altar28 && ctx2.layers.altar28.visible),   // MEASURES_211: not over the plates of the altar's measures
        get: () => { const T = SH.tour; try { const s = T && fnc(T.state) ? T.state() : null; return !!(s && s.running && s.mode === "tamid"); } catch (_) { return false; } },
        set: (on) => { const T = SH.tour; if (!T) return; if (on) T.start("tamid"); else if (fnc(T.stop)) T.stop(); }
      });
    }
    // TAMID_STOP_209 (the full review, 13.11.2026): the demonstration runs as the presentation's fourth mode, so the rule of 90-entry.js
    // "every switch first stops the demonstrations" (ctx.shared.demoStops) did not reach it: a place pressed in the panel flew there, and
    // the demonstration's moving eye took the camera back at once (and went on, stage after stage). Now it is one of them - a switch
    // ends it; the presentation's own banner is not a switch (90-entry.js), and its own start stops the others but not itself
    (SH.demoStops || (SH.demoStops = [])).push({
      id: "tamid-demo",
      running: () => { const T = SH.tour; try { const s = T && fnc(T.state) ? T.state() : null; return !!(s && s.running && s.mode === "tamid"); } catch (_) { return false; } },
      stop: () => { const T = SH.tour; if (T && fnc(T.stop)) T.stop(); }
    });
  }
