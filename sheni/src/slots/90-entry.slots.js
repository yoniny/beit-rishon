//@@begin top-note
  // plugin/js/entry.js
  // plugin/js/entry - renderer, scene, lights, camera, controls, input safety, the load sequence and the animation loop.
  // 1.2.0 (Second Temple, 8.11.2026): this file is the First Temple plugin's 90-entry.js (1.2.7) taken whole, with these adaptations only:
  //   the module list (mount, courts, altar, heichal, ui, tour), the loading stage names, the view clamp's axis (ENT_AX / ENT_BX: the
  //   Temple Mount's middle line), and the extra keys at the end (turn, tilt, +/- zoom; 70-ui.js of the First Temple does those there).
  //   Everything below that says "the user" quotes the First Temple's history; it applies here as it is.
  // 1.0.1-K (K.9a, the user: "שפר מהירות טעינה של עלית התוסף", "תוסיף אופציה להגדלת זום או להקטנה באמצעות שתי אצבעות"):
  //   - the load is measured: a "[load]" table in the console (and window.__loadTimes): the three.js evaluation, the 10-core textures,
  //     the renderer/scene, PMREM + sky, every module, the shader compile, the first frame under the overlay, the first visible frame;
  //   - nothing is rendered while the modules load (1.0.1 rendered a frame after EVERY module behind the overlay: each frame compiled the
  //     new shaders synchronously - 27 frames, ~12 s of a ~14 s cold load on an Intel Iris Xe); the 30 ms wait per module is gone (one
  //     frame yield repaints the progress bar); the shaders compile together at the end (renderer.compileAsync: in parallel where the
  //     driver has KHR_parallel_shader_compile), then ONE frame is rendered under the overlay (texture uploads, shadow map), then the
  //     overlay goes;
  //   - two-finger zoom on a laptop touchpad: a pinch arrives as wheel events with ctrlKey (Chromium / WebView2) - handled here
  //     (preventDefault: the page itself never zooms) with a smooth dolly; a two-finger slide (small wheel deltas) zooms smoothly too;
  //     the mouse wheel stays with OrbitControls; touch pinch stays with OrbitControls;
  //   - the DPR bug (review entry-dpr-wheel-collapse): 00-lib.js getZoomScale divided by (100 * (devicePixelRatio | 0)) = 0 below DPR 1
  //     (one notch put the camera ON the target) - now / 100; controls.minDistance = 2; guardCamera never saves or accepts a pose closer
  //     than minDistance;
  //   - the arrow keys are no longer OrbitControls' (plain arrows PANNED and every arrow press anywhere was preventDefault-ed, so the side
  //     panel could not scroll): 70-ui.js turns the view with them like the nav buttons and leaves the panel's keys alone;
  //   - pointerSafety tracks EVERY pointer down on the canvas (a Map): a lost two-finger release is ended for both fingers.
  // 1.0.1-K review (ui-4): a touchpad pinch (ctrl + wheel) over the overlays (the pills, the label's card, the panel, the nav row, the
  //   presentation's box) no longer zooms the whole page: a window listener prevents every ctrl + wheel; the canvas keeps its own zoom.
  // 1.0.1-L (FIXES L.49, the user: "מהירות הסיבוב במודל 360 הוא מהיר מדי כברירת מחדל - האט אותו, וסיבוב איטי השאר כך"): the free drag
  //   rotation is slower - OrbitControls rotateSpeed 0.9 -> 0.5 (makeControls); the nav buttons' and the arrow keys' step is slowed in
  //   70-ui.js; "סיבוב איטי" (autoRotateSpeed 0.4, 70-ui.js) is unchanged.
  // 1.0.1-L (L.87): the pan is limited (ent_clampView), the damping follows time (ent_damp), a sideways wheel moves nothing, maxDistance 1400; (L.89) the bracket of a source is smaller in the labels.
  // 1.0.2 (the user: "שפר את ה-360 בכל התוסף"): in every roofed space a drag, the nav buttons and "סיבוב איטי" turn the view in place (ent_indoors, ent_look,
  //   ent_controlsUpdate); outside the drag orbits as before; the camera never goes into a wall (ent_wallStep). The loading view stays below the top bar (index.html):
  //   initModules marks the page ready (html.tm-ready) when it goes.
  // 1.0.2 (M; the user: "אני לא יכול לרדת מתחת לאמצע או מעל - בשולחנות אין לי דרך לראות את הבזיכין", "גם במכונות אותה בעיה"): the view is free up and down everywhere -
  //   the orbit's polar limit no longer keeps the eye above the target's level; it keeps the eye ENT_FLOOR_M over the floor or the ground under it (ent_floorStep), and,
  //   as before, out of the walls and the ceilings (ent_wallStep: a floor keeps 0.4 now, a wall or a ceiling 0.8). The eye's height: ArrowUp / ArrowDown, PageUp /
  //   PageDown and Shift + wheel raise and lower the eye and the target together (ent_liftStep); the tilt the arrows did stays on the nav buttons and on Shift + arrows.
  // 1.0.4 (the user, in the heichal: "כשאני מסתכל על המנורות למה אני לא יכול לראות מאחוריהם? יש לי בעיה בסיבוב בעיקר לצד שמאל. אם צריך תוותר על התקרה"): after a
  //   flight to something close under a roof (the menorot, the tables, the cherubim: ENT_ORBIT_NEAR) a drag orbits round it again, and the walls and the ceilings of
  //   the buildings let the camera through while the fade loop of 70-ui.js shows them see-through (ent_orbit, ent_passOn, ent_passSurf); the 360 in place stays for
  //   a hall seen from afar (the kodesh, the forest house) and after a look in place.
//@@end top-note
//@@begin makeLabelSprite2
  function makeLabelSprite2(text, size, l) {   // 1.9.1: l - the label's record; l.box draws the text on a dark plate (the altar's measures)
//@@end makeLabelSprite2
//@@begin makeLabelSprite2-2
    if (l && l.onTop) spr.renderOrder = 10;   // 1.9.1: drawn over the stone it names (the numbers of the altar's frames)
//@@end makeLabelSprite2-2
//@@begin after-viewWH
  renderer.shadowMap.type = PCFShadowMap;   // webgpu round: three.js 187 removed PCFSoftShadowMap (WebGL and WebGPU warn, then use PCFShadowMap)
//@@end after-viewWH
//@@begin ent_room
  var ent_room = new RoomEnvironment();   // webgpu round: as three.js 160 built it without a renderer - PointLight 5 (187: 900), not lowered (187: y -3.5)
//@@end ent_room
//@@begin after-sky
  sky.material.uniforms.cloudCoverage.value = 0;   // webgpu round: three.js 187's Sky draws clouds (coverage 0.4 by default); 160's had none
//@@end after-sky
//@@begin after-sc
  var hemi = new HemisphereLight(12572400, 9074e3, 0.75);   // TAMID_PORT_207 (55-tamid.js): kept, the night and the dawn of the morning's service dim it
  scene.add(hemi);
  // SHADOW_CACHE_302 (the user, 18.11.2026: "תשפר את המנוע הרגיל כמה שאתה יכול"): THE SUN'S SHADOW IS DRAWN AGAIN ONLY WHEN IT CHANGES.
  // Until now every frame drew the shadow map anew - every caster of the mount (about 2400 here) a second time, from the sun: measured, a third of
  // the frame's work (the opening view: 15.5 ms a frame with it, 10.0 without). The map depends on the casters and the light only, never on the eye.
  // It is drawn again when a caster moved, was shown, hidden, added or removed, its shape, material or layers changed, the light or its shadow
  // box changed, or the section (ent_sec) changed. The check walks the visible casters once a frame, as three.js's own pass does, and compares
  // each one's world matrix with the one the map was drawn with. Other scenes (the shader warm-up's) are passed through as before.
//@@end after-sc
//@@begin after-camera-note
  // HQ_302: the light toggles (hq.js); made before any material is compiled, since it adds its lines to every lit material
//@@end after-camera-note
//@@begin cam_decide
    cam.mode = (ent_wm.on || cam.roofed && (cam.lookLock || p.distanceTo(q) > CAM_NEAR)) ? "look" : "orbit";   // 1.6.0: walk mode is always "look"
//@@end cam_decide
//@@begin ent_walkStep.sd
    const sd = (W.right ? 1 : 0) - (W.left ? 1 : 0);   // 1.6.0 (walk mode): A / D strafe
//@@end ent_walkStep.sd
//@@begin free
    const WK = { w: "fwd", s: "back", a: "left", d: "right", "ו": "fwd", "ד": "back", "ש": "left", "ג": "right", W: "fwd", S: "back", A: "left", D: "right" };   // 1.6.0: walk mode's keys (QWERTY and the Hebrew layout)
//@@end free
//@@begin free-2
    const free = (el) => !el || el === window || el === document || el === document.body || el === document.documentElement || el === renderer.domElement ||
      (el.nodeType === 1 && !el.isContentEditable && !/^(INPUT|TEXTAREA|SELECT)$/i.test(el.tagName || "") && !!(el.closest && el.closest("#tm-nav, #tm-compass, .tm-pill")));
//@@end free-2
//@@begin after-cam_walkFloor-note
  // ===== 1.6.0 (stage 6, the user: "תוסיף כפתור מצב הליכה"): WALK MODE. The eye drops to 3 amot over the floor under it and looks ahead; the
  // mode is "look" (turning in place); the mouse alone turns the view under pointer lock (requested on the canvas; Esc or the button
  // release it), and where pointer lock is refused (a webview) dragging turns the view as in mode "look"; W / S / A / D (also ו ד ש ג and
  // the arrows) walk and strafe at eye height through the existing walking (ent_walkStep, with its pace by distance). ctx.shared.walkMode
  // = { on, set(on) }; the html class "tm-walk" while on (the UI's button state).
//@@end after-cam_walkFloor-note
//@@begin ent_walkModeSet
    if (ctx && ctx.shared && ctx.shared.navRepaint) try { ctx.shared.navRepaint(); } catch (_) {}   // 1.9.3 (as the First Temple plugin): the nav box's button state
//@@end ent_walkModeSet
//@@begin after-ent_walkModeSet-note
  // ===== 1.6.0 (stage 6, the user: "חתך אמיתי"): THE LIVE SECTION - one clipping plane across the model, moved by a slider: everything
  // of the model (not the sky, the ground or the labels) on the far side of the plane is cut away, and the cut faces show as the
  // walls' inner faces (every clipped material is drawn two-sided while the section is on; no filled caps - a model choice, told in the
  // help). Axis "z": the plane is z = v, the SOUTH of it cut (a section through the house from the south, as the cutaway); axis "x": x = v,
  // the EAST cut (a section along the house's length, seen from the east). ctx.shared.section = { on, axis, v, set(on, axis, v) }.
  // 1.9.1: the materials are found anew every frame while the section is on (ent_sectionApply, from the animation loop) - the wall fade of
  // 70-ui.js swaps a wall's material for its own clone while the wall is faded and puts the shared one back after, so a list made once
  // (until 1.9.0) missed the clones made later, and the originals put back while a clone was in the list: such walls were not cut (the
  // user's height cut of the upper storey showed its roof). Each material met is given the plane and drawn two-sided, its own side kept
  // (sides: material -> side) and given back when the section goes off. A clone made while the section is on carries a copy of the plane
  // and the side two-sided from its original: it is given the live plane, and its own side is taken as the front's.
//@@end after-ent_walkModeSet-note
//@@begin ent_sectionApply-note
      // 1.9.3 (the full scan: the dark edges of the doors' boards stood whole in the cut part): lines and points are cut as the meshes
//@@end ent_sectionApply-note
//@@begin ent_sectionApply-note-2
//@@end ent_sectionApply-note-2
//@@begin ent_sectionSet
    if (ent_sec.axis === "z") P.set(new Vector3(0, 0, -1), ent_sec.v);   // keeps p.z <= v (the north), cuts the south
    else if (ent_sec.axis === "y") P.set(new Vector3(0, -1, 0), ent_sec.v);   // 1.9.1: keeps p.y <= v - a plan, everything above cut (the mesibah)
    else P.set(new Vector3(-1, 0, 0), ent_sec.v);                         // keeps p.x <= v (the west), cuts the east
//@@end ent_sectionSet
//@@begin ent_sectionSet-2
    if (ctx && ctx.shared && ctx.shared.navRepaint) try { ctx.shared.navRepaint(); } catch (_) {}   // 1.9.3 (as the First Temple plugin)
//@@end ent_sectionSet-2
//@@begin ent_view
  // ===== 1.0.1-L (L.87, the user: "עדיין יש בעיה בגלילה בעיקר לצד ימין המסך בורח ללא שליטה") =====
  // Reproduced with real events in headless Chrome (SCR/L-part5/panel/scroll2.log): the wheel, the touchpad's slide and sideways deltas only change
  // the radius, but a pan (right button, Ctrl / Shift + left, a two-finger press on a touchpad) has no limit: three drags to the right put the target at
  // [-657, 30, 654], about 900 amot from the Temple, the model gone from the screen; and the damping is per frame, 6% of what is left each
  // frame, so at a low frame rate the view glides on for seconds after the release. Two fixes, for every input:
  // (1) ent_clampView: the target stays inside a band along the site (below; a flight may widen it), the camera moving with it;
  // (2) ent_damp: the damping follows time, 140 ms, whatever the frame rate (at 60 frames a second 0.11 instead of 0.06; at 10, 0.51).
  // (the limit is a band along the site, from the Temple's courts to the palace's, 230 amot to each side: at the first view's distance, 518, the view is 370 to
  // each side, so the site always stays on the screen. A flight to a farther target widens it until the next flight. Model choice; an earlier box of 90 amot round the
  // fly points' targets, and a band that always reached all of them, 350, left an empty desert: pics/s-right4.png, s2-right4.png.)
  var ent_view = { R0: 290, R: 290, yMin: -15, yMax: 420, d: new Vector3(), last: null, dt: 16.7 };
  var ENT_AX = [-110, 82.5], ENT_BX = [320, 82.5];   // 1.2.0 (Second Temple): the axis of the site = the Temple Mount's middle line (z 82.5), west to east (model choice)
//@@end ent_view
//@@begin set
      walkMode: { on: false, set: (on) => ent_walkModeSet(on) },                                    // 1.6.0
      section: { on: false, axis: "z", v: 0, set: (on, axis, v) => ent_sectionSet(on, axis, v) },   // 1.6.0
//@@end set
//@@begin after-root
  // 2.0 (55-tamid.js, the morning's service): the sky, the sun and the light of the hemisphere, as made above (the demonstration turns them to the
  // night and the dawn, and gives them back), and the floor under a point (the solids' downward ray of the walking mode: a figure's feet)
  ctx.shared.sky = { sky, sun, hemi, sunDir: sunDir.clone(), sunInt: sun.intensity, hemiInt: hemi.intensity, exposure: renderer.toneMappingExposure, fogColor: scene.fog.color.getHex(), env: scene.environment };
  ctx.shared.floorY = (x, y, z) => cam_floorY({ x, y, z });
  ctx.shared.viewLimits = { get: () => ({ R: ent_view.R, yMin: ent_view.yMin, yMax: ent_view.yMax }), set: (o) => { if (o) Object.assign(ent_view, o); }, include: (q) => { const R1 = ent_view.R; ent_viewInclude(q); ent_view.R = Math.max(R1, ent_view.R); } };   // VIEW_WIDEN_420: a demo's include only widens (a part built lazily during the Shiloach walk called it with a near point, and the radius fell back to 290 - the eye was pulled back to z 364 and saw nothing)   // SHILOACH_305: the Shiloach's walk
  // 1.9.2 / 1.3.4 (the user's recording: a chamber's roof came back while the eye was inside it, and all one saw was the stone):
  // ctx.shared.camUnder(list) - is the eye under one of these pieces (inside its plan, below its top)? Their boxes are taken once.
  // ctx.shared.openFor(id, ms) - a place or a row opens a pill for a while (another call within it starts the count again; a pill the user
  // opened himself stays open); when the time is up and the eye is under what the pill would put back (its under()), it waits 4 s more
//@@end after-root
//@@begin after-root-note
  // 1.9.3 (the full scan of 10.11.2026: a place's roof, section or zone stayed for the rest of its 15 s over the NEXT place's view):
  // ctx.shared.sectionFor(axis, v, ms) - a place or a row shows a section of the model for a while (another call within it starts the
  // count again); ctx.shared.closeAuto() - everything a place or a row opened for a while (openFor's pills, sectionFor's section) goes
  // back at once: the next place or chip calls it before its own action. What the user opened himself (a pill, the navigation box's
  // section) has no timer and stays. ctx.shared.holdAuto(on) - the presentation holds what a slide opened until the slide is left.
//@@end after-root-note
//@@begin sounds.LEVEL
    const LEVEL = { water: 0.07, creak: 0.06, bigGate: 0.16, trumpets: 0.045, cymbals: 0.045, click: 0.05, step: 0.02, hiss: 0.03, wicket: 0.045, wheel: 0.05, wheels: 0.05, steps: 0.02,
      flute: 0.05, lyre: 0.026, harp: 0.04, clap: 0.03 };   // SIMCHA_304
//@@end sounds.LEVEL
//@@begin pluck
    // SIMCHA_304: the water-drawing's music - "החליל מכה ומנגנין בכנור ובנבלים ובמצלתים... ורוקדין ומספקין ומטפחין" (the Rambam, Lulav
    // 8:13): a flute with a slow vibrato and its breath, plucked strings (the lyres high, the harps low), and the clapping of hands. The
    // tune - four phrases in the mode of "אהבה רבה" on D - and its instruments' sound: model choices, not a reconstruction
    const pluck = (a, t, f, k, dur) => {
      for (const [m, type, pk] of [[1, "triangle", 1], [2, "sine", 0.35], [3, "sine", 0.12]]) {
        const o = a.createOscillator(), g = a.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f * m, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(k * pk, t + 0.006);
        g.gain.setTargetAtTime(0, t + 0.012, dur / (2.5 + m));
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + dur + 0.25);
      }
    };
    const pipe = (a, t, f, k, dur) => {
      const o = a.createOscillator(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(f, t);
      lfo.frequency.value = 5.2;
      lg.gain.value = f * 0.006;
      lfo.connect(lg); lg.connect(o.frequency);
      env(g, t, 0.05, k, Math.max(0, dur - 0.13), 0.08);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.1); lfo.start(t); lfo.stop(t + dur + 0.1);
      osc(a, "triangle", f * 2, t, dur, k * 0.16, 0.05, 0.08);
      noise(a, t, dur, k * 0.22, "bandpass", f * 2.2, 3, 0.04, 0.08);
    };
    const SIM = (() => {   // the cycle: 64 eighths of 0.2 s; [eighth, kind, semitones from D4, length in eighths]
      const E8 = 0.2, D4 = 293.66, hz = (n) => D4 * Math.pow(2, n / 12);
      const MEL = [
        [[7, 1], [7, 1], [8, 1], [7, 1], [5, 1], [4, 1], [5, 1], [7, 1], [4, 1], [5, 1], [4, 1], [1, 1], [0, 4]],
        [[12, 1], [12, 1], [10, 1], [8, 1], [7, 1], [8, 1], [10, 1], [12, 1], [10, 1], [8, 1], [7, 1], [5, 1], [7, 4]],
        [[7, 1], [8, 1], [10, 1], [12, 1], [13, 2], [12, 2], [10, 1], [8, 1], [7, 1], [5, 1], [4, 2], [7, 2]],
        [[8, 1], [7, 1], [5, 1], [4, 1], [5, 2], [4, 1], [1, 1], [0, 4], [null, 4]]];
      const CH = [[[0, 4, 7], [0, 4, 7]], [[-2, 1, 5], [0, 4, 7]], [[-2, 1, 5], [1, 5, 8]], [[5, 8, 12], [0, 4, 7]]];
      const BASS = [[-12, -12], [-14, -12], [-14, -11], [-19, -12]];
      const at = new Map(), put = (e, x) => { if (!at.has(e)) at.set(e, []); at.get(e).push(x); };
      MEL.forEach((ph, p) => { let e = p * 16; for (const [n, l] of ph) { if (n != null) put(e, ["f", n, l]); e += l; } });
      for (let e = 0; e < 64; e++) {
        const p = Math.floor(e / 16), h = Math.floor((e % 16) / 8), ch = CH[p][h];
        put(e, ["l", ch[[0, 1, 2, 1][e % 4]] + (e % 2 ? 12 : 0), 2]);
        if (e % 4 === 0) put(e, ["h", BASS[p][h], 6]);
        if (e % 4 === 2) put(e, ["c", 0, 0]);
      }
      // MUSICIANS_305: the Levites' trumpets - a call at the head of the first and the third phrase (D, A) - and the cymbals: one clash
      // at the head of every phrase (until 2.0.13 three clashes at the head of the cycle, unseen)
      put(0, ["t", 0, 4]); put(32, ["t", 7, 4]);
      for (let e = 0; e < 64; e += 16) put(e, ["y", 0, 0]);
      return { E8, hz, at };
    })();
    const simchaStep = (a, t, step, lv) => {
      const e = step % 64;
      for (const [kind, n, l] of SIM.at.get(e) || []) {
        if (kind === "f") pipe(a, t, SIM.hz(n), LEVEL.flute * lv, l * SIM.E8 * 0.95);
        else if (kind === "l") pluck(a, t, SIM.hz(n), LEVEL.lyre * lv * (e % 2 ? 0.6 : 1), 0.9);
        else if (kind === "h") pluck(a, t, SIM.hz(n), LEVEL.harp * lv, 1.6);
        else if (kind === "t") brass(a, t, l * SIM.E8 * 0.92, LEVEL.trumpets * 0.45 * lv, SIM.hz(n));
        else if (kind === "y") { const k = LEVEL.cymbals * 0.6 * lv; noise(a, t, 1.5, 0.75 * k, "highpass", 5200, 0.7, 0.005, 1.4); noise(a, t, 0.5, 0.38 * k, "bandpass", 3200, 3, 0.005, 0.45); }
        else noise(a, t, 0.05, LEVEL.clap * lv, "bandpass", 1300, 1.4, 0.002, 0.045);
      }
    };
//@@end pluck
//@@begin sounds
            }, 60);
          }
          return;
        }
        if (name === "simcha") {   // SIMCHA_304: the tune, an eighth at a time, a little ahead of the clock; the level read at each one
          if (v > 0 && !L.timer && ac) {
            loops.add(L);
            L.step = 0;
            L.at = ac.currentTime + 0.1;
            L.beat = () => (L.timer && ac ? L.step - (L.at - ac.currentTime) / SIM.E8 : null);   // MUSICIANS_305: the eighth that sounds now
            L.timer = setInterval(() => {
              if (!ac || ctx.shared.soundOff) return;
              if (L.at < ac.currentTime) L.at = ac.currentTime + 0.05;
              while (L.at < ac.currentTime + 0.25) {
                if (L.level > 0.02) { try { simchaStep(ac, L.at, L.step, L.level); } catch (_) {} }
                L.step++;
                L.at += SIM.E8;
              }
//@@end sounds
//@@begin initModules
      { name: "mount.js", build },
      { name: "courts.js", build: build2 },
      { name: "altar.js", build: build3 },
      { name: "vessels.js", build: typeof buildVessels === "function" ? buildVessels : async () => {} },   // 1.3.0: the menorah, the table, the golden altar
      { name: "heichal.js", build: build4 },
      { name: "payis.js", build: typeof buildPayis === "function" ? buildPayis : async () => {} },   // 1.9.5: the lotteries' demonstration (55-payis.js); built hidden
      { name: "tamid.js", build: typeof buildTamid === "function" ? buildTamid : async () => {} },   // 2.0.7: the morning's service (55-tamid.js; built on its first use)
      { name: "add208.js", build: typeof buildAdd208 === "function" ? buildAdd208 : async () => {} },   // ADD_208 (57-add208.js): the chandelier and the tablet, the shofarot, Beit HaEven, the ulam's courses, the lepers' door
      { name: "ui.js", build: buildUI },
      { name: "tour.js", build: typeof buildTour === "function" ? buildTour : async () => {} }   // 1.2.0: the presentation (75-tour.js); after ui.js, it uses ctx.ui
//@@end initModules
//@@begin initModules-2
      "טוען את הר הבית והחומות",
      "טוען את העזרות והשערים",
      "טוען את המזבח והכבש",
      "טוען את כלי הקודש",
      "טוען את האולם וההיכל",
      "מכין את הדגמת הפייסות",
      "מכין את סדר העבודה",
      "מוסיף את הנברשת, השופרות והלשכות",
//@@end initModules-2
//@@begin guardCamera.lo
        // CAM_219 (4): not in walk mode - there the eye keeps its height over the floor under ITSELF (cam_walkFloor); the target's floor
        // held it up when one walked backward down a stair (the target still on the top step)
        const lo = Math.max(typeof ctx.shared.camLow === "number" ? ctx.shared.camLow : -27.5, !ent_wm.on && isFinite(cam.floorY) ? cam.floorY + 0.35 : -Infinity);   // SHILOACH_305: ctx.shared.camLow - the walk in the valley
//@@end guardCamera.lo
//@@begin after-guardCamera
    if (ent_sec.on) ent_sectionApply();   // 1.9.1: the materials swapped in since (the wall fade's clones) are cut too
//@@end after-guardCamera
