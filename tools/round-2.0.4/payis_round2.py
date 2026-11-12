# -*- coding: utf-8 -*-
# PAYIS_195, round 2 (11.11.2026, after the pictures of the whole run): the camera rests on a pose and moves only before the next
# key (it drifted between keys - the thirteen winners were never seen, and it flew through the heichal); the appointed one comes
# from the CHEL to the house's gate (the court is still locked: Tamid 1:3 "ופתח את הפשפש ונכנס מבית המוקד לעזרה"); the search of the
# court is seen from the north-east; the winner goes up the ramp ("מהלך לאור המערכה"); a fixed stop button with the time, in place
# of the pill that sat on the scene.
import io, re, sys
F = '/home/claude/b2src/src/55-payis.js'
s = io.open(F, encoding='utf-8').read()
if 'PAYIS_ROUND2' in s:
    print('already'); sys.exit(0)
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:100])
    s = s.replace(a, b)
def span(a, b, new):
    global s
    i = s.index(a); j = s.index(b, i)
    assert s.count(a) == 1, a[:80]
    s = s[:i] + new + s[j:]

# ---------- 1. the caption and the stop button
span("    let capEl = null;\n", "    // ---------- the places\n", r'''    // PAYIS_ROUND2: a fixed button over it stops the run and shows its time (the model's pill sat on the scene as the camera moved)
    let capEl = null, capTxt = null, stopEl = null;
    const capBuild = () => {
      if (capEl) return;
      capEl = document.createElement("div");
      capEl.id = "tm-payis-cap";
      capEl.setAttribute("dir", "rtl");
      Object.assign(capEl.style, { position: "fixed", left: "50%", bottom: "64px", transform: "translateX(-50%)", maxWidth: "min(820px, 78vw)", zIndex: "40",
        display: "none", flexDirection: "column", alignItems: "center", gap: "6px", pointerEvents: "none", userSelect: "none" });
      stopEl = document.createElement("button");
      stopEl.type = "button";
      stopEl.id = "tm-payis-stop";
      Object.assign(stopEl.style, { pointerEvents: "auto", cursor: "pointer", padding: "4px 12px", borderRadius: "14px", border: "1px solid rgba(255,236,170,.85)",
        background: "rgba(201,168,76,.92)", color: "#14110a", font: "12px 'Segoe UI',Arial,sans-serif", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,.4)" });
      stopEl.addEventListener("click", (e) => { e.stopPropagation(); stop(); });
      capTxt = document.createElement("div");
      Object.assign(capTxt.style, { background: "rgba(14,17,28,0.84)", color: "#f4ead0", font: "17px/1.55 var(--font-main, inherit)", padding: "8px 18px",
        borderRadius: "10px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.35)" });
      capEl.appendChild(stopEl);
      capEl.appendChild(capTxt);
      document.body.appendChild(capEl);
    };
    // in the middle of the model's part of the window (beside the panel, not under it)
    const capPlace = () => {
      let x0 = 0, x1 = window.innerWidth;
      try {
        const p = document.getElementById("tm-panel");
        if (p && p.offsetParent !== null) {
          const r = p.getBoundingClientRect();
          if (r.width > 40 && r.width < window.innerWidth * 0.6) { if (r.left > window.innerWidth / 2) x1 = r.left; else x0 = r.right; }
        }
      } catch (_) {}
      capEl.style.left = Math.round((x0 + x1) / 2) + "px";
      capEl.style.maxWidth = Math.max(240, Math.min(820, x1 - x0 - 40)) + "px";
    };
    const caption = (text) => {
      capBuild();
      if (capTxt.textContent !== (text || "")) capTxt.textContent = text || "";
      capTxt.style.display = text ? "block" : "none";
    };
    const mmss = (v) => Math.floor(v / 60) + ":" + String(Math.floor(v % 60)).padStart(2, "0");
    const stopShow = (on, sec, dur) => {
      capBuild();
      if (!on) { capEl.style.display = "none"; return; }
      capPlace();
      const text = "■ עצור את ההדגמה · " + mmss(sec) + " מתוך " + mmss(dur);
      if (stopEl.textContent !== text) stopEl.textContent = text;
      capEl.style.display = "flex";
    };
''')

# ---------- 2. the script's parts
rep("    // ---------- the script: built for the reading, in seconds. Parts: cams [t, eye, look] (eased between), caps [t, text],",
    "    // ---------- the script: built for the reading, in seconds. Parts: cams [t, eye, look, move?] (t = the second the camera ARRIVES; it\n"
    "    // rests on the pose before and moves in the last three seconds, or `move`), caps [t, text],")
rep("      const cam = (dt, eye, look) => { S.cams.push([t + dt, eye, look]); };",
    "      const cam = (dt, eye, look, mv) => { S.cams.push([t + dt, eye, look, mv]); };")

span("      const camMoked = [[-18, 50, -43.5]", "      // ===== the Gazit hall:", r'''      const adj = !!(SH.mokedGates && SH.mokedGates.mode === "adjacent");   // the Rosh's second reading of the house's gates: the gate to the chel in its east wall
      const camOpen = __CAM_OPEN__;                     // the north side by night: the court's wall, Beit HaMoked and its stairs from the chel
      const camMokedN = [[-18, 37, -110], [-18, 17, -79]];                  // before its gate to the chel
      const camMokedIn = [[-18, 52, -80], [-18, 16.6, -62.8]], camMokedNear = [[-18, 41, -74], [-18, 17, -62.8]];   // into its holy half (the roofs are off)
      const camMokedS = [[-18, 50, -43.5], [-18, 16, -61.5]];               // before its gate to the court
      const camCourt = __CAM_COURT__;                    // the court from the north-east: both ways round the house
      const camMeet = [[62, 52, -38], [81, 17, 2]];
      const camGazit = [[84.4, 53, -57.5], [84, 16.6, -67.6]], camGazitNear = [[87.2, 35, -62.4], [83.7, 17.2, -67.4]];
      // the altar where the rows "מקום המזבח" and "מידות המזבח" now put it (40-altar.js): the ramp's middle line and its shift
      const PL = SH.altarPlace, adz = PL && PL.dz && typeof PL.dz[PL.current] === "number" ? PL.dz[PL.current] : 0;
      const yose = !!(SH.altarMeasures && SH.altarMeasures.mode === "yose"), rx = 55.5 + (yose ? 2 : 0), rz = adz + (yose ? -4 : 0);
      const camAltar = [[78, 44, 45.5 + adz], [52, 20, -6.5 + adz]];
      const Y = LV.KOH, YM = LV.AZ;   // the priests' court; the floor of the house's north half and of its gate to the chel
      // the one who won goes up the ramp to the top of the altar, alone and with no light ("מהלך לאור המערכה", Tamid 1:4); d seconds
      const toAltar = (d) => {
        const f = K[6];
        ev(1.2, () => { for (const x of K) x.visible = false; MEM.visible = false; T1.visible = T2.visible = false; f.visible = true; f.userData.hand.visible = false; f.userData.body.material = mWin; });
        track(f, [[1.2, rx + 10, Y, 44.6 + rz], [3, rx + 1, Y, 43.2 + rz], [d - 1.6, rx + 1, Y + 9, 10.2 + rz], [d - 0.5, rx + 2.4, Y + 9, 5.4 + rz]]);
        ev(d, () => { f.visible = false; f.userData.body.material = f.userData.robe; });
      };
      // ===== 1. the night; the appointed one comes from the chel to the house where the priests sleep (the court is still locked)
      cam(0, adj ? camMokedIn[0] : camOpen[0], adj ? camMokedIn[1] : camOpen[1]);
      cap(0.6, reading === "tamid" ? "״הממנה בא ודופק עליהם, והם פתחו לו״ (תמיד א, ב) — בבית המוקד, בלילה"
        : "רמב״ם (תמידין ו, א): ״סמוך לעלות השחר יבוא הממנה שעל הפיסות ויקיש על העזרה ופותחין לו״");
      ev(1, () => { T1.visible = true; T1.userData.light.intensity = 26; MEM.visible = true; });
      if (!adj) {
        // up the stairs from the mount to the chel and from the chel to the gate (30-courts.js: twelve steps to 6, a landing, fifteen to 13.5)
        const up = (x) => [[1, x, 0, -100.9], [2.8, x, 6, -91.75], [3.6, x, 6, -85], [6.2, x, YM, -78.8]];
        track(MEM, up(-18.9), [-18.9, -70]);
        track(T1, up(-17.2));
        cam(5.6, camMokedN[0], camMokedN[1]);
      } else {
        track(MEM, [[1, -8.4, YM, -73.3], [3, -12.5, YM, -73.3]], [-18, -67.5]);
        track(T1, [[1, -8.2, YM, -71.9], [3, -12, YM, -71.6]]);
      }
      // into the house, round the hearth, up to its holy half
      const inMem = adj ? [[-12.5, YM, -73.3], [-13.2, YM, -68.2], [-13.4, Y, -67]] : [[-18.9, YM, -78.8], [-22.6, YM, -73], [-22.6, YM, -68.2], [-22.4, Y, -67]];
      const inTor = adj ? [[-12, YM, -71.6], [-12.4, YM, -68.2], [-13.9, Y, -66.6]] : [[-17.2, YM, -78.8], [-13.9, YM, -73.2], [-13.9, YM, -68.2], [-13.9, Y, -67]];
      const walkIn = (o, pts, end, t0, d) => {
        const n = pts.length;
        track(o, pts.map((p, i) => [t0 + d * 0.8 * i / (n - 1), p[0], p[1], p[2]]).concat([[t0 + d, end[0], end[1], end[2]]]));
      };
      if (reading === "tamid") {
        t = 9;
        cap(0, "״אמר להן, מי שטבל יבא ויפיס״ (תמיד א, ב) — הפייס הראשון: מי תורם את המזבח");
        cam(3, camMokedIn[0], camMokedIn[1]);
        walkIn(MEM, inMem, [MK.x, MK.y, MK.z], 0, 3.2);
        walkIn(T1, inTor, [-13.95, Y, -59.8], 0, 3);
        enterRing(MK, [-18, LV.KOH, -66.4], N, 0.8, 4.2);
        t += 5.6;
        cam(15.5, camMokedNear[0], camMokedNear[1]);
        const d1 = lottery(MK, N, 4, 60, 0, { ring: T_RING + " — תפארת ישראל: בחצי בית המוקד שבקודש", hat: T_HAT, fingers: T_FING, num: numTxt("שישים"), count: "מונה והולך: ", win: "״הפיסו, זכה מי שזכה״ (תמיד א, ב) — " + T_WIN }, ["תורם את המזבח"]);
        t += d1;
        clearWins(0);
        // ===== the torches round the court
        cap(0, "״נטל את המפתח ופתח את הפשפש, ונכנס מבית המוקד לעזרה, ונכנסו אחריו ושתי אבוקות של אור בידם״ (תמיד א, ג)");
      } else {
        if (!adj) {   // they open for him and he goes in
          track(MEM, [[7.2, -18.9, YM, -78.8], [8.8, -18.9, YM, -73.6]]);
          track(T1, [[7.2, -17.2, YM, -78.8], [8.8, -17.2, YM, -73.6]]);
        }
        t = 9;
        cap(0, "״ומבלשין את כל העזרה״ (רמב״ם) — ״ושתי אבוקות של אור בידם״ (תמיד א, ג)");
      }
      // out through the house's gate to the court; two companies, a torch before each, round the court to the Nicanor gate (the
      // chamber of the griddle-cakes' makers is beside it): the one by the north and the east, the other behind the house and by the south
      ev(-0.01, () => { for (const f of K) f.visible = false; MEM.visible = false; T1.visible = T2.visible = true; T1.userData.light.intensity = T2.userData.light.intensity = 30; });
      cam(2.6, camMokedS[0], camMokedS[1]);
      const P0 = 3.6;   // the second the companies part
      const pathE = [[0, -17, Y, -60.4], [P0 - 0.5, -16.8, Y, -54.5], [P0, -16.8, Y, -54.5], [P0 + 3.4, 20, Y, -50], [P0 + 6.8, 58, Y, -49], [P0 + 8.8, 80, Y, -44], [P0 + 12, 81, Y, -8]];
      const pathW = [[0, -19, Y, -60.4], [P0 - 0.5, -19.2, Y, -54.5], [P0, -19.2, Y, -54.5], [P0 + 1.4, -60, Y, -52], [P0 + 2.3, -88, Y, -44], [P0 + 5.2, -88, Y, 44], [P0 + 6.9, -40, Y, 60], [P0 + 9.5, 40, Y, 60],
        [P0 + 10.4, 70, Y, 58], [P0 + 12, 81, Y, 12]];
      track(T1, pathE);
      track(T2, pathW);
      // three priests walk behind each torch (the same way, a little later)
      [pathE, pathW].forEach((p, w) => {
        for (let j = 0; j < 3; j++) {
          const f = K[w * 3 + j], lag = 0.35 + j * 0.3;
          ev(0, () => { f.visible = true; f.userData.hand.visible = false; });
          track(f, p.map((k) => [k[0] + lag, k[1] + (j - 1) * 0.5, k[2], k[3] + (j - 1) * 0.4]));
          ev(P0 + 15.2, () => { f.visible = false; });
        }
      });
      cap(P0 - 0.2, "״ונחלקו לשתי כתות, אלו הולכים באכסדרא דרך המזרח, ואלו הולכים באכסדרא דרך המערב״ (תמיד א, ג)");
      cam(P0 + 2.6, camCourt[0], camCourt[1]);
      cam(P0 + 11.4, camMeet[0], camMeet[1]);
      cap(P0 + 12.2, "״הגיעו אלו ואלו, אמרו שלום, הכל שלום״ (תמיד א, ג)");
      t += P0 + 15.4;
      if (reading === "tamid") {
        cap(0, "״מי שזכה לתרם את המזבח, הוא יתרם את המזבח… מהלך לאור המערכה״ (תמיד א, ד)");
        cam(3, camAltar[0], camAltar[1]);
        toAltar(8);
        t += 8;
        cap(0, "״הציתו שתי המערכות באש, וירדו ובאו להם ללשכת הגזית״ (תמיד ב, ה)");
        t += 4;
      }
''')
rep("__CAM_OPEN__", "[[30, 62, -150], [-14, 14, -80]]")
rep("__CAM_COURT__", "[[60, 215, -105], [-8, 16, -22]]")

# the Gazit: the near camera is there when the count begins
rep("        cam(20, camGazitNear[0], camGazitNear[1]);\n        const d1 = lottery(GZ, N, 4, 60, 0,", "        cam(15.5, camGazitNear[0], camGazitNear[1]);\n        const d1 = lottery(GZ, N, 4, 60, 0,")
rep("        cam(18, [85.6, 40, -60.2], [83.9, 17, -67.4]);\n        const d2 =", "        cam(15.9, [85.6, 40, -60.2], [83.9, 17, -67.4]);\n        const d2 =")
rep("        cam(16, camGazitNear[0], camGazitNear[1]);\n        const d3 =", "        cam(15.5, camGazitNear[0], camGazitNear[1]);\n        const d3 =")
rep("        cam(17, [85.6, 40, -60.2], [83.9, 17, -67.4]);\n        const d4 =", "        cam(15.5, [85.6, 40, -60.2], [83.9, 17, -67.4]);\n        const d4 =")
# the Rambam: the one who won the terumat hadeshen begins
rep("""        ev(0, () => { for (const f of K) f.visible = false; MEM.visible = false; });
        cam(3, [78, 44, 58], [52, 20, 6]);
        t += 6.5;""", """        ev(0, () => { for (const f of K) f.visible = false; MEM.visible = false; });
        cam(3, camAltar[0], camAltar[1]);
        toAltar(8);
        t += 8;""")
# the watcher starts on the priests' floor and goes down the duchan's steps
rep("      track(WATCH, [[0, 86.4, 13.5, -50.4], [2, 89.4, 13.5, -51],", "      track(WATCH, [[0, 84.9, Y, -50.4], [1, 86.75, 14.75, -50.7], [2, 89.4, 13.5, -51],")

# ---------- 3. the runner
rep("      at(sec) { if (!RUN) start(); RUN.hold = Math.max(0, sec); RUN.evI = 0; resetFigures(); step(); return RUN ? RUN.S.dur : 0; },",
    "      at(sec, free) { if (!RUN) start(); RUN.hold = Math.max(0, sec); RUN.free = !!free; RUN.evI = 0; resetFigures(); step(); return RUN ? RUN.S.dur : 0; },")
rep("      RUN = { S, t0: performance.now(), hold: -1, evI: 0, roofs: false, labels: null };",
    "      RUN = { S, t0: performance.now(), hold: -1, evI: 0, roofs: false, labels: null, free: false, sec: -1 };")
rep("      resetFigures();\n      caption(\"\");\n      NIGHT.end();", "      resetFigures();\n      caption(\"\");\n      stopShow(false);\n      NIGHT.end();")
rep("      caption(capTxt);\n", "      caption(capTxt);\n      { const sec = Math.floor(Math.min(t, S.dur)); if (R.sec !== sec) { R.sec = sec; stopShow(true, sec, S.dur); } }\n")
rep("""        const a = C[i], b = C[Math.min(C.length - 1, i + 1)];
        const u = b[0] > a[0] ? ease(Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])))) : 1;
        const L = (p, q, j) => p[j] + (q[j] - p[j]) * u;
        if (cam) {""", """        const a = C[i], b = C[Math.min(C.length - 1, i + 1)];
        // PAYIS_ROUND2: a key's second is when the camera arrives - it rests on the pose before, then moves (three seconds, or the key's own)
        const mv = Math.max(0.01, Math.min(typeof b[3] === "number" ? b[3] : 3, b[0] - a[0]));
        const u = b[0] > a[0] ? ease(Math.max(0, Math.min(1, (t - (b[0] - mv)) / mv))) : 1;
        const L = (p, q, j) => p[j] + (q[j] - p[j]) * u;
        if (cam && !R.free) {""")
rep("""        const p = ctx2.camera && ctx2.camera.position;
        return p && p.x > 20 && p.z < 30 ? [84, 34.5, -60] : null;""", """        if (RUN) return null;   // while it runs the fixed button under the model stops it
        const p = ctx2.camera && ctx2.camera.position;
        return p && p.x > 20 && p.z < 30 ? [84, 34.5, -60] : null;""")
io.open(F, 'w', encoding='utf-8').write(s)
print('ok', len(s))
