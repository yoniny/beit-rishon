  // plugin/js/entry - renderer, scene, lights, camera, controls, input safety, the load sequence and the animation loop.
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
  function applyTheme(theme) {
    if (!theme || !theme.colorScheme) return;
    const cs = theme.colorScheme;
    const r = document.documentElement;
    r.style.setProperty("--bg", cs.surface);
    r.style.setProperty("--fg", cs.onSurface);
    r.style.setProperty("--muted", cs.outline);
    r.style.setProperty("--primary", cs.primary);
    r.style.setProperty("--primary-dim", cs.primary);
    r.style.setProperty("--card", cs.surfaceContainerHighest || cs.surface);
    r.style.setProperty("--border", cs.outline);
    if (theme.typography && theme.typography.fontFamily) {
      r.style.setProperty("--font", "'" + theme.typography.fontFamily + "','David',serif");
    }
    document.body.classList.toggle("dark-mode", theme.mode === "dark");
  }
  function showToast(msg, dur = 3e3) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), dur);
  }
  function makeLabelSprite2(text, size) {
    // 1.0.1-L (L.89): the bracket of a source in a clearly smaller font, 28 of 48 px (ui_labelText, 70-ui.js), so that a long label takes less of the view
    const font = '600 48px "Segoe UI",Arial', fontSmall = '600 28px "Segoe UI",Arial';
    const pad = 26;
    const cv = document.createElement("canvas");
    let c = cv.getContext("2d");
    const lt = ui_labelText(c, text, font, fontSmall);
    const tw = Math.max(8, Math.ceil(lt.w));
    cv.width = tw + pad * 2;
    cv.height = 48 + pad * 2;
    c = cv.getContext("2d");
    lt.draw(c, cv.width - pad, cv.height / 2);
    const tex = new CanvasTexture(cv);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const spr = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthTest: true, depthWrite: false }));
    const hAmot = (size || 4) * cv.height / 48;
    spr.scale.set(hAmot * cv.width / cv.height, hAmot, 1);
    return spr;
  }
  // ===== 1.0.1-K: the load measurements. ent_load.loading is true until the overlay goes: the animation loop renders nothing meanwhile =====
  var ent_load = { loading: true, rows: [], tEntry: performance.now(), printed: false, firstVisibleMs: null };
  function ent_mark(step, ms, note) {
    ent_load.rows.push({ step, ms: Math.round(ms * 10) / 10, at: Math.round(performance.now()), note: note || "" });
  }
  // 1.0.1-H (the user: "ב-360 מעלות הוא נתקע ולא מסתובב נכון"): the renderer asks for the discrete GPU, the pixel ratio is capped at 1.5 (a
  // 4K/HiDPI screen rendered at 2x was the heaviest single cost) and the shadow map is 2048 (4096 at 1.0.0); see also the orbit limits below
  // and the lighter cloud ray test in ui.js
  var renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  // 1.0.1-H (robustness, the user: "נתקע ולא מסתובב נכון"): a webview may create the page while its tab is hidden - window.innerWidth /
  // innerHeight are then 0, the camera aspect becomes NaN and OrbitControls divides a drag by the canvas height (0): every value turns
  // NaN and the camera is stuck for good. The view is therefore never sized below 2 x 2, and fitToWindow() below re-fits it when the
  // window gets its real size (on "resize", and from a watchdog for webviews that show the tab without firing "resize").
  function viewSize() { return [Math.max(2, window.innerWidth || 0), Math.max(2, window.innerHeight || 0)]; }
  var viewWH = viewSize();
  renderer.setSize(viewWH[0], viewWH[1]);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  var mainEl = document.getElementById("main");
  if (mainEl) mainEl.appendChild(renderer.domElement);
  else document.body.appendChild(renderer.domElement);
  var scene = new Scene();
  scene.fog = new Fog(15259316, 1400, 4600);
  ent_mark("renderer + scene", performance.now() - ent_load.tEntry);
  var ent_t = performance.now();
  var pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  var sky = new Sky();
  sky.scale.setScalar(6e3);
  scene.add(sky);
  ent_mark("PMREM environment + sky", performance.now() - ent_t);
  var sunDir = new Vector3();
  var phi = MathUtils.degToRad(90 - 36);
  var theta = MathUtils.degToRad(38);
  sunDir.setFromSphericalCoords(1, phi, theta);
  sky.material.uniforms.sunPosition.value.copy(sunDir);
  sky.material.uniforms.turbidity.value = 8;
  sky.material.uniforms.rayleigh.value = 2.1;
  sky.material.uniforms.mieCoefficient.value = 6e-3;
  sky.material.uniforms.mieDirectionalG.value = 0.85;
  var sun = new DirectionalLight(16769976, 3.3);
  sun.position.copy(sunDir).multiplyScalar(700);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);   // 1.0.1-H: 4096 -> 2048 (performance; the shadows are still sharp enough at the courts' scale)
  var sc = 480;
  Object.assign(sun.shadow.camera, { left: -sc, right: sc, top: sc, bottom: -sc, near: 50, far: 2e3 });
  sun.shadow.bias = -35e-5;
  sun.shadow.normalBias = 0.35;
  scene.add(sun);
  scene.add(new HemisphereLight(12572400, 9074e3, 0.75));
  var camera = new PerspectiveCamera(48, viewWH[0] / viewWH[1], 0.5, 6e3);
  camera.position.set(430, 190, 240);
  // 1.0.1-H: the controls are built by a function so that they can be rebuilt (OrbitControls keeps its drag deltas in a closure: once a
  // NaN gets in - a drag while the canvas had no height - update() re-applies it forever; see the guard in the animation loop)
  var controls = null;
  function makeControls(target) {
    const c = new OrbitControls(camera, renderer.domElement);
    c.target.copy(target || new Vector3(0, 30, 0));
    c.enableDamping = true;
    c.dampingFactor = 0.06;
    // 1.0.2 (M): free below the target's level too (was PI * 0.495: the eye never went below the target - the user could not look up under a base or down
    // between the bread stacks); the floor under the eye is the limit now, set every frame by ent_floorStep. PI - 0.06: never at the nadir, as minPolarAngle
    c.maxPolarAngle = Math.PI - 0.06;
    // 1.0.1-H: the camera never reaches the zenith (OrbitControls "sticks" at the pole: a horizontal drag there only spins the view)
    c.minPolarAngle = 0.06;
    // 1.0.1-K: never closer than 2 amot to the target (the same floor as the UI's zoom buttons); with the DPR fix in 00-lib.js a wheel
    // notch can no longer put the camera ON the target (r160's default minDistance 0 allowed it)
    c.minDistance = 2;
    // 1.0.1-L (L.87): 2200 -> 1400: the whole site still fills the view from there; further out it is a speck, and a right-button drag there jumped 2.4 amot a pixel
    c.maxDistance = 1400;
    // 1.0.1-L (FIXES L.49, the user: "מהירות הסיבוב במודל 360 הוא מהיר מדי כברירת מחדל - האט אותו"): 0.9 -> 0.5, a drag across the whole
    // canvas now turns the view about half as far (the nav buttons and the arrow keys are slowed in 70-ui.js; "סיבוב איטי" is unchanged)
    c.rotateSpeed = 0.5;
    c.zoomToCursor = false;
    // 1.0.1-K: no c.listenToKeyEvents(window) any more - its plain arrows PANNED and it preventDefault-ed every arrow key in the window
    // (the side panel could not be scrolled with the keys). The arrow keys are handled by 70-ui.js (they turn the view like the nav
    // buttons, and never while the focus is in the panel, the presentation box or a form field).
    if (controls) {
      // keep the user's toggles (auto-rotate) and the fade state of the old instance
      c.autoRotate = controls.autoRotate;
      c.autoRotateSpeed = controls.autoRotateSpeed;
      try { controls.dispose(); } catch (_) {}
    }
    controls = c;
    if (ctx) ctx.controls = c;
    return c;
  }
  var ctx = null;
  makeControls(new Vector3(0, 30, 0));
  // 1.0.1-L (Part 7, U1, the user: "יש קטע שא\"א לראות 360 מעלות במקום קטן כגון קה\"ק"): the orbit turned the camera round a target inside a small room, so a drag pushed
  // it through the walls and it could never look up. Indoors, or very near the target, a drag now turns the view round the camera's own place: while the button is down the
  // target stands 0.05 amah before the camera (the same OrbitControls, so the same feel), the polar limit opens to look up and down, and on release the target goes back to
  // its distance along the new direction, so the wheel and the pills go on as before. Outdoors nothing changes.
  // 1.0.2 (the user: "שפר את ה-360 בכל התוסף"; the proposal he accepted): "indoors" is now EVERY roofed space - the heichal, the devir, the ulam, the side chambers, the
  // palace's halls (the forest house, the throne hall, the halls of judgement): there a drag turns the view round the place where one stands, a full 360 (1.0.1-L did it only
  // in a room with walls on all sides near, and orbited the target in the larger halls - ent_slide, gone now); the nav buttons and the keys follow (70-ui.js asks
  // ctx.camIndoors), and so does "סיבוב איטי" (ent_controlsUpdate). Outside a drag orbits the target as before. Roofed = a ceiling within 60 amot straight above the camera and
  // walls on 3 of the 4 sides within 60, or on all 4 within 30 (model choice, as 1.0.1-L); the parts that the on-model buttons remove (the house's south wall and roof, the
  // chambers' walls, the ulam's front and roof, the forest house's boards) still count, so that opening the house does not turn the inside of the heichal into "outside".
  // And the camera never goes into a wall, anywhere (ent_wallStep, below).
  // 1.0.2 (M): the open polar limit (was PI * 0.495, the old orbit's; ent_floorStep closes it to the floor under the eye, outside a drag in place)
  var ENT_POLAR = Math.PI - 0.06;
  var ent_look = { on: false, id: -1, d0: 10, rel: 0, v: new Vector3(), ray: null, t: -1e9, at: new Vector3(), res: false, dirs: [new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)], up: new Vector3(0, 1, 0) };
  // the solid surfaces, for the roofed test and the walls (1.0.2: one walk of the scene a second at most, it was one per test):
  //   .all  - what is seen: meshes that are not helpers (noPick), the sky box, the cloud or the measuring line, and not a see-through material - so not a wall that the
  //           fade loop of 70-ui.js has made see-through for the moment (userData.fade) either: the camera may pass it, as in 1.0.1;
  //   .roof - the same, with those faded walls counted after all, and also the parts of the four removal lists (ctx.cutaway, yatziaCut, ulamCut, forestBoardsCut) while they are removed;
  //   .walls - .all with each mesh's bounding sphere in the world ({o, c, r}; 2 amot more, for what moves within the second), for the wall test (ent_wallHit): only the
  //           meshes whose sphere the move comes near are tested - one test of all 650 meshes took up to 100 ms a frame in the first headless run. Without the terrain (more
  //           than 30000 vertices, as the fade loop's roof list of 70-ui.js): its triangles were the dearest part, and the polar limit keeps the camera above it;
  //   .big  - 1.0.2 (M): those large meshes (the terrain), for the floor under the eye only (ent_floorY: the terrain's grid is read, not ray-tested - one ray of the
  //           whole list took 87 ms in the headless run, most of it the terrain's 97000 triangles).
  var ent_sol = { t: -1e9, all: [], roof: [], walls: [], big: [] };
  function ent_solids(withCut) {
    const now = performance.now();
    if (now - ent_sol.t > 1000) {
      ent_sol.t = now;
      const all = [], roof = [], cut = new Set();
      for (const k of ["cutaway", "yatziaCut", "ulamCut", "forestBoardsCut"]) {
        const list = ctx && ctx[k];
        if (Array.isArray(list)) for (const m of list) if (m) cut.add(m);
      }
      const walk = (o, off) => {
        if (o.name === "tm-kk-cloud" || o.name === "tm-measure") return;
        if (o.visible === false) {
          if (!cut.has(o)) return;
          off = true;   // removed by its button: a roof / a wall all the same, for the roofed test only
        }
        if (o.isMesh && !o.userData.noPick && !(o.geometry && o.geometry.type === "BoxGeometry" && o.scale.x > 1000)) {
          const m = Array.isArray(o.material) ? o.material[0] : o.material;
          const thin = !!(m && m.transparent && m.opacity < 0.5);
          if (m && m.visible !== false && (!thin || o.userData.fade)) {
            roof.push(o);
            // 1.0.2 (fix): a wall that the fade loop shows see-through is no wall for the camera's move (as in 1.0.1: one zooms through a faded
            // court wall to see inside); it still counts for the roofed test. The house's own walls never fade (1.0.1), so they always stop it.
            // 1.0.4: a building's wall or ceiling (userData.tmPass, 70-ui.js) stays in the list when faded: the floors in its merged mesh still hold the eye, and
            // its walls and ceilings are let through hit by hit (ent_wallHit, ent_passSurf)
            if (!off && (!thin || o.userData.tmPass)) all.push(o);
          }
        }
        for (const c of o.children) walk(c, off);
      };
      walk(scene, false);
      ent_sol.all = all;
      ent_sol.roof = roof;
      const walls = [], big = [];
      for (const o of all) {
        try {
          const pa = o.geometry && o.geometry.attributes && o.geometry.attributes.position;
          if (pa && pa.count > 30000) big.push(o);
          if (!pa || pa.count > 30000) continue;
          let bs;
          if (o.isInstancedMesh) {
            if (!o.boundingSphere && typeof o.computeBoundingSphere === "function") o.computeBoundingSphere();
            bs = o.boundingSphere;
          } else {
            if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
            bs = o.geometry.boundingSphere;
          }
          if (!bs || !isFinite(bs.radius)) continue;
          walls.push({ o, c: bs.center.clone().applyMatrix4(o.matrixWorld), r: bs.radius * o.matrixWorld.getMaxScaleOnAxis() + 2 });
        } catch (_) {
        }
      }
      ent_sol.walls = walls;
      ent_sol.big = big;
    }
    return withCut ? ent_sol.roof : ent_sol.all;
  }
  function ent_roofed(p) {   // is p under a roof (the test above; 1.0.4: for the camera and for the target)
    let res = false;
    try {
      const ray = ent_look.ray || (ent_look.ray = new Raycaster());
      ray.camera = camera;
      const list = ent_solids(true), hit = (d, far) => { ray.set(p, d); ray.near = 0; ray.far = far; const h = ray.intersectObjects(list, false); return h.length ? h[0].distance : Infinity; };
      const walls = ent_look.dirs.map((d) => hit(d, 60));
      const near = walls.filter((w) => w < 60).length, tight = walls.filter((w) => w < 30).length;
      res = (near >= 3 && hit(ent_look.up, 60) < 60) || tight === 4;
    } catch (_) {
    }
    return res;
  }
  function ent_indoors() {
    const now = performance.now(), p = camera.position;
    if (now - ent_look.t < 1200 && ent_look.at.distanceToSquared(p) < 0.25) return ent_look.res;
    ent_look.t = now;
    ent_look.at.copy(p);
    return (ent_look.res = ent_roofed(p));
  }
  // ===== 1.0.4: the orbit round a thing close by under a roof, through the walls and the ceilings =====
  // The user, at the menorot: "למה אני לא יכול לראות מאחוריהם? יש לי בעיה בסיבוב בעיקר לצד שמאל. אם צריך תוותר על התקרה - אני לא צריך אותה בשום מקום". Reproduced in
  // headless Chrome (drags of 500 pixels from the fly point "menorot"): in the heichal every drag turned the view in place (1.0.2's 360) - the head turned, the camera stayed, so the menorot were
  // never seen from behind; and an orbit (the drag with the 360 held off) was stopped by ent_wallStep 0.8 before the devir's wall (1.5 amot west of Moses' menorah: a
  // drag to the left stopped after 60 degrees, in the parochet) and before the south wall (4.8 amot south of it: to the right after 55 degrees, then it slid along the
  // wall toward the target), and from 27 amot away over the top by the ceiling (the eye held at 41.2). Now: a flight whose target is within ENT_ORBIT_NEAR amot of its
  // eye (the menorot 12.9, the tables 12.6, Moses' table 4, the incense altar 3.7, the cherubim 14.7, the throne 17.7; not the kodesh 22.4, the hall of hewn stone
  // 20.5, the king's house 24.1 - model choice) and that ends under a roof (the eye: ent_roofed; not Yachin and Boaz seen from the court) marks the target as a thing
  // (ent_orbit.obj); while it is under a roof (ent_roofed at the target, and the fade on - "טשטוש חומות: כבוי" means walls that stop) a drag, the nav buttons and
  // "סיבוב איטי" orbit round it (ent_inPlace false), and the walls, the ceilings and the roofs of the buildings - the meshes the fade loop of 70-ui.js can fade
  // (userData.tmPass: the groups "heichal", "interior", "palace", walls 4 high and 1 wide or more, flat ones 5 wide or more) - let the camera through, while that
  // loop fades every one of them between the camera and the target (ctx.camPass, ctx.camPassHit). What still holds the eye: the floor under the target and every
  // surface facing up at or under the target's level (+ ENT_PASS_FLOOR; the floor lining, the otem, a lower story's floor), everything at or under the floor under the
  // target (the otem's sides), the vessels, the many-copied instanced meshes (the forest house's columns; Yachin and Boaz, 2 copies, are let through) and the ground -
  // so the floor clamp is unchanged, and over the roof the floor under the eye is the heichal's floor (the roof and the upper stories are let through downward too). A
  // look in place (ent_lookEnd) or a flight to a far target clears the mark.
  var ENT_ORBIT_NEAR = 18, ENT_PASS_FLOOR = 0.3;
  var ent_orbit = { obj: false, t: -1e9, at: new Vector3(1e9, 0, 0), roofed: false, fy: -Infinity, busy: false, n: new Vector3() };
  function ent_passTarget() {   // the target's roof and the floor under it, again when the target moved an amah or after 1.2 s
    const O = ent_orbit, q = controls.target, now = performance.now();
    if (now - O.t < 1200 && O.at.distanceToSquared(q) < 1) return O;
    O.t = now;
    O.at.copy(q);
    O.busy = true;   // the floor under the target: no surface let through
    try {
      O.roofed = ent_roofed(q);
      O.fy = ent_floorY(q);
    } catch (_) {
      O.roofed = false;
    } finally {
      O.busy = false;
    }
    return O;
  }
  function ent_passOn() {
    if (!ent_orbit.obj || ent_look.on || flyAnim || ent_load.loading || !controls) return false;
    const fs = ctx && ctx.shared && ctx.shared.fadeState;
    if (fs && fs.on === false) return false;
    return ent_passTarget().roofed;
  }
  // may the camera pass the surface of x (a Raycaster hit, along the ray's direction dir)? Only a building's wall or ceiling (userData.tmPass), above the floor under
  // the target, and not a surface facing up at or under the target's level
  function ent_passSurf(x, dir) {
    const O = ent_orbit, o = x && x.object;
    if (O.busy || !o || !o.userData.tmPass) return false;
    const T = ent_passTarget();
    if (x.point.y <= T.fy + 0.05) return false;
    const n = O.n;
    if (x.face) n.copy(x.face.normal).transformDirection(o.matrixWorld);
    else n.copy(dir).negate();
    if (n.dot(dir) > 0) n.negate();
    return !(n.y > 0.7 && x.point.y <= controls.target.y + ENT_PASS_FLOOR);
  }
  function ent_thin(o) {   // shown see-through now (the test of ent_solids)
    const m = Array.isArray(o.material) ? o.material[0] : o.material;
    return !!(m && m.transparent && m.opacity < 0.5);
  }
  function ent_inPlace() {   // does a drag (and the nav buttons, "סיבוב איטי") turn the view in place? (ctx.camIndoors)
    return ent_indoors() && !ent_passOn();
  }
  function ent_lookEnd() {
    if (!ent_look.on) return;
    ent_look.on = false;
    ent_orbit.obj = false;   // 1.0.4: the target is now a point along the view, not the thing one flew to
    const c = controls, v = ent_look.v;
    const dm = c.enableDamping;
    c.enableDamping = false;   // the rest of the drag's movement is used up here, at the tiny radius, and not on the long one
    try { c.update(); } catch (_) {}
    c.enableDamping = dm;
    v.copy(c.target).sub(camera.position);
    if (!(v.lengthSq() > 0)) camera.getWorldDirection(v);
    v.normalize();
    c.minDistance = 2;
    c.maxPolarAngle = ENT_POLAR;   // 1.0.2 (M): open; ent_floorStep closes it to the floor under the eye at the next frame
    // 1.0.2: the target goes back to its distance, but not behind the wall in front (the wheel then dollies toward what is seen); 2 = minDistance
    let d = Math.max(2, ent_look.d0);
    const h = ent_wallHit(camera.position, v, d);
    if (h) d = Math.max(2, Math.min(d, h.distance - 0.5));
    c.target.copy(camera.position).addScaledVector(v, d);
    c.update();
  }
  {
    const el = renderer.domElement;
    el.addEventListener("pointerdown", (e) => {
      if (ent_look.on) {
        if (e.pointerId !== ent_look.id) ent_lookEnd();   // a second finger: a pinch, as ever
        else ent_look.rel = 0;
        return;
      }
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || !controls || controls.enabled === false || flyAnim || ent_load.loading) return;
      const c = controls, d = camera.position.distanceTo(c.target);
      // 1.0.2: in every roofed space (ent_indoors) the drag turns the view in place; outside, only very near the target (as 1.0.1-L); else OrbitControls orbits.
      // 1.0.4: round a thing one flew to under a roof (ent_passOn) OrbitControls orbits, near or far
      if (ent_passOn() || (!(d < 4) && !ent_indoors())) return;
      ent_look.on = true;
      ent_look.id = e.pointerId;
      ent_look.rel = 0;
      ent_look.d0 = d;
      const v = ent_look.v.copy(c.target).sub(camera.position).normalize();
      c.minDistance = 0.001;
      c.maxPolarAngle = Math.PI - 0.06;
      c.target.copy(camera.position).addScaledVector(v, 0.05);
      c.update();
    }, true);
    const up = (e) => { if (ent_look.on && !ent_look.rel && e.pointerId === ent_look.id) ent_look.rel = performance.now(); };
    el.addEventListener("pointerup", up, true);
    el.addEventListener("pointercancel", up, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    window.addEventListener("blur", () => { if (ent_look.on && !ent_look.rel) ent_look.rel = performance.now(); });
    el.addEventListener("wheel", () => ent_lookEnd(), { capture: true, passive: true });
  }
  function ent_lookStep(t) {   // the release: after the drag's damping has run out (140 ms of time constant)
    if (ent_look.on && ent_look.rel && performance.now() - ent_look.rel > 350) ent_lookEnd();
  }
  // ===== 1.0.2: "סיבוב איטי" in a roofed space turns the view in place =====
  // OrbitControls' autoRotate swings the camera round the target - inside a hall, through its walls. Indoors the controls' own turn is held back for that update, and the
  // view turns round the camera by the same angle (r160's getAutoRotationAngle without a delta time: 2 pi / 3600 * autoRotateSpeed a frame, the speed the user kept) and
  // in the same sense (the view's azimuth decreases as in the orbit). Never during a drag (in-place: ent_look) or a flight; controls.autoRotate itself is left as it is
  // (the panel's row and ctx.ui.autoRotate read it).
  var ent_turn = { v: new Vector3(), s: new Spherical() };
  function ent_controlsUpdate() {
    const c = controls;
    let inPlace = false;
    if (c.autoRotate && !flyAnim && !ent_look.on && ent_inPlace()) {   // 1.0.4: round a thing one flew to, it orbits (ent_inPlace)
      inPlace = true;
      c.autoRotate = false;
    }
    try {
      c.update();
    } finally {
      if (inPlace) c.autoRotate = true;
    }
    if (inPlace) {
      const v = ent_turn.v.copy(c.target).sub(camera.position), s = ent_turn.s;
      if (v.lengthSq() > 0) {
        s.setFromVector3(v);
        s.theta -= 2 * Math.PI / 60 / 60 * c.autoRotateSpeed;
        v.setFromSpherical(s);
        c.target.copy(camera.position).add(v);
        camera.lookAt(c.target);
      }
    }
  }
  // ===== 1.0.2: the camera never goes into a wall =====
  // Every move of the camera from one frame to the next that is not a flight - a drag's orbit and its damping, the wheel, a pinch or a two-finger slide (ent_zoomStep),
  // a pan, the nav buttons and keys of 70-ui.js, the slow rotation - is a segment from where the camera was; if a solid surface (ent_solids: what is seen, a wall faded by
  // the fade loop included, what the removal buttons took away not) lies on it or within ENT_WALL_M beyond it, the camera stops ENT_WALL_M before the surface, and the rest
  // of the move goes on along the surface (once, if that way is clear): so an orbit beside a wall slides along it and a dolly stops at it. 0.8 amah: more than the near
  // plane's reach (0.5 ahead, 0.66 at its corners) - the wall is not cut open on the screen (model choice; 1.0.1-L's indoor orbit kept 0.4 - 0.8).
  // Not tested: a flight (flyTo: its path is designed, it may pass a doorway's jamb), a move of more than ENT_WALL_JUMP amot in one frame (a jump made by code, e.g. a
  // test's camera; the wheel far out moves 5 % of the distance), and what the modules' per-frame hooks do after the guard (ctx.animated: e.g. the follow of a moving
  // stand, 45-vessels.js) - the frame's start is taken after them.
  // 1.0.2 (M): a surface that faces up (a floor, a table's top, the court's paving: its normal within 45 degrees of up) keeps ENT_FLOOR_M (0.4, the user's free view: the
  // eye low at a base's wheels), the walls and the ceilings still ENT_WALL_M. 0.4 over a floor is enough for the near plane there: its lower edge is 0.22 below the
  // view's middle at 0.5 ahead, so the floor is not cut open while the eye looks level or up (and looking down, the eye is higher than that over what it sees).
  // 1.0.4: round a thing one flew to under a roof the buildings' walls, ceilings and roofs are not surfaces here (ent_wallHit skips them: ent_passOn, ent_passSurf),
  // and so neither for the floor under the eye nor for the ceiling over it - the floors under the target still are.
  var ENT_WALL_M = 0.8, ENT_WALL_JUMP = 30, ENT_FLOOR_M = 0.4;
  function ent_wallM(n) { return n.y > 0.7 ? ENT_FLOOR_M : ENT_WALL_M; }   // the margin of the surface whose normal is n (ent_wall.n after a hit)
  var ent_wall = { has: false, last: new Vector3(), mv: new Vector3(), dir: new Vector3(), rest: new Vector3(), n: new Vector3(), p: new Vector3(), ray: null, ms: 0, hits: 0, cand: [], tv: new Vector3(), q: new Vector3(),
    axes: [new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1), new Vector3(0, 1, 0), new Vector3(0, -1, 0)] };
  function ent_wallHit(from, dir, far) {   // the first solid surface along dir (normalized) within far, or null; its world normal in ent_wall.n
    const W = ent_wall, ray = W.ray || (W.ray = new Raycaster());
    ray.camera = camera;
    ray.set(from, dir);
    ray.near = 0;
    ray.far = far;
    let h = null;
    try {
      ent_solids(false);
      const cand = W.cand;
      cand.length = 0;
      for (const w of ent_sol.walls) {   // the sphere comes within its radius of the segment from .. from + dir * far
        const t = Math.max(0, Math.min(far, W.tv.copy(w.c).sub(from).dot(dir)));
        if (W.tv.copy(from).addScaledVector(dir, t).distanceToSquared(w.c) <= w.r * w.r) cand.push(w.o);
      }
      const hs = cand.length ? ray.intersectObjects(cand, false) : [];
      // 1.0.4: the first surface that holds - a building's wall or ceiling is let through round a thing one flew to (ent_passOn), or while the fade shows it
      // see-through (as a faded wall before), but never a floor under the target (ent_passSurf)
      const on = !ent_orbit.busy && ent_passOn();
      for (const x of hs) {
        const ud = x.object.userData;
        if (ud.tmPass && (on || (ud.fade && ent_thin(x.object))) && ent_passSurf(x, dir)) continue;
        h = x;
        break;
      }
    } catch (_) {
      return null;
    }
    if (!h) return null;
    if (h.face) W.n.copy(h.face.normal).transformDirection(h.object.matrixWorld);
    else W.n.copy(dir).negate();
    if (W.n.dot(dir) > 0) W.n.negate();   // a double-sided face seen from its back
    return h;
  }
  function ent_wallStep() {
    const W = ent_wall, p = camera.position;
    if (!W.has || flyAnim || ent_load.loading || ent_look.on) return;   // in-place turning: the camera only circles 0.05 amah round its own place
    const mv = W.mv.copy(p).sub(W.last), L = mv.length();
    if (!(L > 1e-4) || L > ENT_WALL_JUMP) return;
    const t0 = performance.now();
    const dir = W.dir.copy(mv).multiplyScalar(1 / L);
    let h = ent_wallHit(W.last, dir, L + ENT_WALL_M), m = h ? ent_wallM(W.n) : ENT_WALL_M;
    if (h && h.distance > L + m) h = null;   // 1.0.2 (M): a floor beyond the move and its 0.4
    if (h) {
      W.hits++;
      const keep = Math.max(0, Math.min(L, h.distance - m));
      const q = W.p.copy(W.last).addScaledVector(dir, keep), n = W.n;
      // a move at a slant: the margin from the surface itself, not only along the move
      const dPerp = W.rest.copy(q).sub(h.point).dot(n);
      if (dPerp < m) q.addScaledVector(n, m - dPerp);
      // the rest of the move, without its part into the surface
      const rest = W.rest.copy(mv).addScaledVector(dir, -keep);
      const into = rest.dot(n);
      if (into < 0) rest.addScaledVector(n, -into);
      const R = rest.length();
      if (R > 1e-4) {
        const rd = W.dir.copy(rest).multiplyScalar(1 / R);
        const h2 = ent_wallHit(q, rd, R + ENT_WALL_M);
        if (!h2 || h2.distance > R + ent_wallM(W.n)) q.add(rest);
      }
      p.copy(q);
    }
    // the clearance: a move at a slant toward a surface, or along it, finds it on no ray along the move; ENT_WALL_M round the new place (the four sides, up, down).
    // Never more than this frame's own move toward that side: a place that was already nearer (a fly point in a narrow side chamber, 0.3 from its wall) is kept, not
    // pushed - in a space narrower than 2 x ENT_WALL_M two pushes would rock the camera from frame to frame.
    let pushed = !!h;
    const q2 = W.q.copy(p), mv2 = W.rest.copy(p).sub(W.last);
    for (const a of W.axes) {
      const toward = mv2.dot(a);
      if (!(toward > 1e-5)) continue;
      const ma = a.y < -0.5 ? ENT_FLOOR_M : ENT_WALL_M;   // 1.0.2 (M): down, the floor's margin
      const ha = ent_wallHit(q2, a, ma);
      if (ha && ha.distance < ma) {
        p.addScaledVector(a, -Math.min(ma - ha.distance, toward));
        pushed = true;
      }
    }
    if (pushed) {
      // the target stays at least minDistance ahead, else OrbitControls would push the camera back toward the wall on the next frame (and this guard pull it out again)
      const c = controls, v = W.tv.copy(c.target).sub(p), d = v.length(), md = c.minDistance || 0;
      if (d < md) {
        if (d > 1e-6) c.target.copy(p).addScaledVector(v, md / d);
        else c.target.copy(p).addScaledVector(camera.getWorldDirection(v), md);
      }
      camera.lookAt(c.target);
    }
    W.ms += performance.now() - t0;
  }
  function ent_wallMark() {   // the frame's end: where the next frame's moves start from
    ent_wall.last.copy(camera.position);
    ent_wall.has = true;
  }
  // ===== 1.0.2 (M): the floor under the eye =====
  // The user: "אני לא יכול לרדת מתחת לאמצע או מעל - בשולחנות אין לי דרך לראות את הבזיכין", "גם במכונות אותה בעיה". The orbit's polar limit (PI * 0.495 since 1.0.0) kept
  // the eye at the target's level or above it: at Moses' table one could not look down between the bread stacks from above, at a base not up from below. Now the only
  // limit down is the floor or the ground under the eye: ENT_FLOOR_M over the first solid surface straight below it (ent_floorY: one ray down against the wall guard's
  // list, ent_wallHit, and the terrain's grid read at the eye's x / z), measured at most every 80 ms and only when the eye has moved (ent_floorMeasure), and turned every
  // frame into OrbitControls' maxPolarAngle for the present target and distance (ent_floorStep): so an orbit downward is held at the floor's level by the controls' own
  // clamp, smoothly with their damping, and never jumps. When the floor under the eye rises (the eye passes over a step, over the altar's top) the limit rises in
  // ENT_FLOOR_EASE ms, not at once; when it falls the limit follows at once. A flight is never clamped (its path is designed): the limit is open during it, and after it
  // starts where the flight put the eye. The ceiling: the first solid surface straight above (within ENT_CEIL_FAR), less ENT_WALL_M - the eye's height (ent_liftStep)
  // stops there. The walls and the ceilings stay the wall guard's (ent_wallStep), with the floor's 0.4 there too (ent_wallM). Model choices: 0.4, the 80 ms, the 150 ms.
  var ENT_FLOOR_EASE = 150, ENT_CEIL_FAR = 400;
  var ent_floor = { raw: -Infinity, lim: -Infinity, ceil: Infinity, t: -1e9, at: new Vector3(1e9, 0, 0), o: new Vector3(), down: new Vector3(0, -1, 0), up: new Vector3(0, 1, 0), ms: 0, n: 0 };
  // the terrain (20-mount.js: a PlaneGeometry laid flat by rotateX(-PI / 2), its vertices moved up and down only, the mesh not moved but by a translation): the height
  // of its triangle under x / z, read from the grid (no ray: 97000 triangles), or NaN when the mesh is not such a grid
  function ent_gridY(o, x, z) {
    const g = o.geometry, P = g && g.parameters, pa = g && g.attributes && g.attributes.position, e = o.matrixWorld.elements;
    if (!P || !pa || g.type !== "PlaneGeometry" || !(P.widthSegments > 0) || !(P.heightSegments > 0)) return NaN;
    if (Math.abs(e[0] - 1) + Math.abs(e[5] - 1) + Math.abs(e[10] - 1) + Math.abs(e[1]) + Math.abs(e[2]) + Math.abs(e[4]) + Math.abs(e[6]) + Math.abs(e[8]) + Math.abs(e[9]) > 1e-6) return NaN;
    const nx = P.widthSegments, nz = P.heightSegments, W1 = nx + 1, cw = P.width / nx, cz = P.height / nz, x0 = pa.getX(0), z0 = pa.getZ(0);
    if (Math.abs(pa.getX(1) - x0 - cw) > 1e-3 || Math.abs(pa.getZ(W1) - z0 - cz) > 1e-3) return NaN;   // the rows run along x, z grows row by row
    const fx = (x - e[12] - x0) / cw, fz = (z - e[14] - z0) / cz;
    if (!(fx >= 0 && fx <= nx && fz >= 0 && fz <= nz)) return NaN;
    const ix = Math.min(nx - 1, Math.floor(fx)), iz = Math.min(nz - 1, Math.floor(fz)), u = fx - ix, v = fz - iz;
    const a = ix + W1 * iz, b = a + W1, c = b + 1, d = a + 1;   // PlaneGeometry's two triangles of the cell: a b d and b c d
    const ha = pa.getY(a), hb = pa.getY(b), hc = pa.getY(c), hd = pa.getY(d);
    return e[13] + (u + v <= 1 ? ha + (hd - ha) * u + (hb - ha) * v : hc + (hb - hc) * (1 - u) + (hd - hc) * (1 - v));
  }
  // the highest solid surface under p, or -Infinity: from 0.05 above p (an eye held at the floor's margin never goes more than a little below it, and a surface the
  // eye was put just under - yatziaSection stands 0.4 under the top of a beam - is not taken for its floor)
  function ent_floorY(p) {
    const F = ent_floor, o = F.o.copy(p);
    o.y += 0.05;
    const h = ent_wallHit(o, F.down, 2000);
    let y = h ? h.point.y : -Infinity;
    for (const b of ent_sol.big) {
      const gy = ent_gridY(b, p.x, p.z);
      if (gy <= o.y && gy > y) y = gy;
    }
    return y;
  }
  function ent_floorMeasure() {
    const F = ent_floor, p = camera.position, now = performance.now();
    if (now - F.t < 80) return;
    // not moved since the last measure: again once a second (a removal button, the moving base); high over the floor the measure may wait for a longer move
    const dh = Math.hypot(p.x - F.at.x, p.z - F.at.z), dv = Math.abs(p.y - F.at.y), high = p.y - F.raw > 40;
    if (dh < (high ? 4 : 0.2) && dv < (high ? 10 : 0.3) && now - F.t < 1000) return;
    F.t = now;
    F.at.copy(p);
    try {
      F.raw = ent_floorY(p);
      const hu = ent_wallHit(p, F.up, ENT_CEIL_FAR);
      F.ceil = hu ? hu.point.y - ENT_WALL_M - 0.02 : Infinity;   // (0.02: just clear of the wall guard's own margin, which would otherwise nudge the eye; so below)
    } catch (_) {
    }
    F.n++;
    F.ms += performance.now() - now;
  }
  function ent_floorStep() {
    const c = controls, F = ent_floor, p = camera.position, q = c.target;
    if (ent_load.loading || ent_look.on) return;   // a drag in place (ent_look): open while the button is down (its pointerdown), the eye only turns
    if (flyAnim) {
      c.maxPolarAngle = ENT_POLAR;
      F.lim = -Infinity;
      return;
    }
    ent_floorMeasure();
    const want = F.raw + ENT_FLOOR_M + 0.02;
    if (!isFinite(F.lim)) F.lim = Math.min(want, p.y);
    if (!(want > F.lim)) F.lim = want;
    else F.lim = Math.max(F.lim + (want - F.lim) * (1 - Math.exp(-ent_view.dt / ENT_FLOOR_EASE)), Math.min(p.y, want));   // rises: eased, and at once while the eye is above it
    const r = p.distanceTo(q), lo = c.minPolarAngle || 0.06;
    if (!(r > 0) || !isFinite(F.lim)) {
      c.maxPolarAngle = ENT_POLAR;
      return;
    }
    const k = (F.lim - q.y) / r;
    let phi;
    if (k <= Math.cos(ENT_POLAR)) phi = ENT_POLAR;
    else if (k < Math.cos(lo)) phi = Math.acos(k);
    // the target lies so far under the floor below the eye that no angle keeps the eye over it at this distance: the eye goes no lower (no jump to the top)
    else phi = Math.acos(Math.max(-1, Math.min(1, (p.y - q.y) / r)));
    c.maxPolarAngle = Math.max(lo, Math.min(ENT_POLAR, phi));
  }
  // ===== 1.0.2 (M): the eye's height - ArrowUp / ArrowDown, PageUp / PageDown, Shift + wheel =====
  // The eye and the target rise or sink together (the view's direction does not change), at ent_liftSpeed amot a second while a key is held, eased in and out in
  // ENT_LIFT_EASE ms; a short press still makes a step (ENT_LIFT_TAP ms of it); a wheel notch (100 pixels) makes ENT_LIFT_NOTCH s of it, eased as the two-finger zoom.
  // Between the floor (ent_floor.raw + ENT_FLOOR_M) and the ceiling over the eye (ent_floor.ceil), or ENT_LIFT_TOP where nothing is over it; the target stays inside the
  // pan's band (ent_view.yMin .. yMax: ent_clampView would pull both back). The speed grows with the distance to the target: 2.5 amot a second at a table, 40 from the
  // general view (model choice). Plain ArrowUp / ArrowDown tilted the view (70-ui.js, 1.0.1-K): the tilt stays on the nav buttons and on Shift + the arrows (70-ui.js's
  // handler does not look at Shift). This handler runs first (window, capture) and prevents the key, and 70-ui.js's then leaves it (e.defaultPrevented); the
  // presentation (75-tour.js, its own capture listener, which does not ask) still hands the camera over on these keys. Not while the focus is in a field one types in,
  // and only where 70-ui.js's arrows work (the page, the model, the nav row, the compass, the pills): a focused panel button or the presentation's box keep their keys.
  var ENT_LIFT_EASE = 120, ENT_LIFT_TAP = 160, ENT_LIFT_NOTCH = 0.3, ENT_LIFT_TOP = 400;
  var ent_lift = { up: false, down: false, upTo: 0, downTo: 0, v: 0, pending: 0 };
  function ent_liftSpeed() { return Math.max(2.5, Math.min(40, camera.position.distanceTo(controls.target) * 0.3)); }
  function ent_liftWheel(px) {   // px > 0: down (the wheel turned toward the user, as a page scrolls down)
    const sp = ent_liftSpeed();
    ent_lift.pending = Math.max(-2 * sp, Math.min(2 * sp, ent_lift.pending - px / 100 * ENT_LIFT_NOTCH * sp));
  }
  function ent_liftStep() {
    // (the frame's time, at most 50 ms: after a slow frame the eye does not leap - at 1 frame a second a held key raised it 10 amot a frame in the headless test)
    const L = ent_lift, p = camera.position, q = controls.target, now = performance.now(), dt = Math.min(50, ent_view.dt);
    if (flyAnim || ent_load.loading) {
      L.v = 0;
      L.pending = 0;
      return;
    }
    const dir = (L.up || now < L.upTo ? 1 : 0) - (L.down || now < L.downTo ? 1 : 0);
    L.v += (dir * ent_liftSpeed() - L.v) * (1 - Math.exp(-dt / ENT_LIFT_EASE));
    if (!dir && Math.abs(L.v) < 0.02) L.v = 0;
    let dy = L.v * dt / 1000;
    if (L.pending) {
      const s = Math.abs(L.pending) < 0.005 ? L.pending : L.pending * Math.max(0.35, 1 - Math.exp(-dt / 40));
      dy += s;
      L.pending -= s;
    }
    if (!dy) return;
    ent_floorMeasure();
    const F = ent_floor;
    const lo = Math.max(F.raw + ENT_FLOOR_M + 0.02, p.y + ent_view.yMin - q.y);
    const hi = Math.min(F.ceil, ENT_LIFT_TOP, p.y + ent_view.yMax - q.y);
    const y1 = Math.min(Math.max(p.y + dy, Math.min(lo, p.y)), Math.max(hi, p.y));   // never pushed: a limit only stops the move toward it
    const d = y1 - p.y;
    if (Math.abs(d) < Math.abs(dy) - 1e-9) {   // at a limit: the rest is dropped, and the held key's speed with it
      L.pending = 0;
      L.v = 0;
    }
    p.y += d;
    q.y += d;
  }
  (function liftKeys() {
    const KEYS = { ArrowUp: 1, PageUp: 1, ArrowDown: -1, PageDown: -1 };
    const free = (el) => !el || el === window || el === document || el === document.body || el === document.documentElement || el === renderer.domElement ||
      (el.nodeType === 1 && !el.isContentEditable && !/^(INPUT|TEXTAREA|SELECT)$/i.test(el.tagName || "") && !!(el.closest && el.closest("#tm-nav, #tm-compass, .tm-pill")));
    window.addEventListener("keydown", (e) => {
      const k = KEYS[e.key];
      if (!k || e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey || ent_load.loading) return;
      if (e.shiftKey && e.key.indexOf("Arrow") === 0) return;   // Shift + ArrowUp / ArrowDown: the tilt (70-ui.js)
      if (!free(document.activeElement) || !free(e.target)) return;
      const cf = document.getElementById("tm-confirm");   // the cloud's dialog (70-ui.js) is open: its keys
      if (cf && cf.style.display === "flex") return;
      e.preventDefault();
      if (k > 0) {
        ent_lift.up = true;
        if (!e.repeat) ent_lift.upTo = performance.now() + ENT_LIFT_TAP;
      } else {
        ent_lift.down = true;
        if (!e.repeat) ent_lift.downTo = performance.now() + ENT_LIFT_TAP;
      }
    }, true);
    window.addEventListener("keyup", (e) => {
      const k = KEYS[e.key];
      if (k > 0) ent_lift.up = false;
      else if (k < 0) ent_lift.down = false;
    }, true);
    window.addEventListener("blur", () => { ent_lift.up = ent_lift.down = false; });
  })();
  // 1.0.1-H (the user: "נתקע ולא מסתובב נכון"): pointer safety for the embedded webview. OrbitControls (r160) captures the pointer on
  // pointerdown and ends a drag only on a pointerup that reaches the canvas. Inside the host app the release can be lost (the button is let
  // go outside the webview, or the host takes the mouse) and setPointerCapture may throw before the drag listeners are attached; then the
  // controls stay in "rotate" (every later mouse move turns the view) or never rotate at all. Two guards: (1) setPointerCapture /
  // releasePointerCapture never throw; (2) a pointer's drag is ended by a synthetic pointerup on the canvas when the window sees its release
  // elsewhere, when a mouse move arrives with no button pressed, when its capture is lost, or when the window loses focus / is hidden.
  // The synthetic event carries __tmSynthetic so the UI's click handlers (measuring, labels) ignore it.
  // 1.0.1-K (review entry-pointersafety-single-pointer): EVERY pointer that is down on the canvas is tracked (a Map by pointerId) - 1.0.1-H
  // kept only the last one, so a pinch whose two releases were lost left OrbitControls with a phantom finger (every later one-finger
  // drag zoomed instead of turning). Blur / hide end them all, one synthetic pointerup each. A pointercancel is OrbitControls' own
  // business (it listens to it), so it only clears the entry.
  (function pointerSafety(el) {
    for (const name of ["setPointerCapture", "releasePointerCapture"]) {
      const orig = el[name];
      if (typeof orig !== "function") continue;
      el[name] = function(id) {
        try {
          return orig.call(el, id);
        } catch (_) {
          return void 0;
        }
      };
    }
    const active = new Map();   // pointerId -> {id, type, primary, x, y}: the pointers that went down on the canvas and are not released
    const endOne = (a, x, y) => {
      if (!a || !active.has(a.id)) return;
      active.delete(a.id);
      let ev = null;
      try {
        ev = new PointerEvent("pointerup", { bubbles: true, cancelable: true, pointerId: a.id, pointerType: a.type, isPrimary: !!a.primary,
          clientX: x == null ? a.x : x, clientY: y == null ? a.y : y, button: 0, buttons: 0 });
      } catch (_) {
        return;
      }
      ev.__tmSynthetic = true;
      el.dispatchEvent(ev);
    };
    const endAll = () => {
      for (const a of Array.from(active.values())) endOne(a);
    };
    el.addEventListener("pointerdown", (e) => {
      if (!e.__tmSynthetic) active.set(e.pointerId, { id: e.pointerId, type: e.pointerType, primary: e.isPrimary, x: e.clientX, y: e.clientY });
    });
    el.addEventListener("pointerup", (e) => {
      if (!e.__tmSynthetic) active.delete(e.pointerId);
    });
    el.addEventListener("pointercancel", (e) => {
      active.delete(e.pointerId);
    });
    el.addEventListener("lostpointercapture", (e) => {
      const a = active.get(e.pointerId);
      if (a) endOne(a, e.clientX, e.clientY);
    });
    window.addEventListener("pointerup", (e) => {
      const a = active.get(e.pointerId);
      if (a && e.target !== el) endOne(a, e.clientX, e.clientY);
    }, true);
    window.addEventListener("pointercancel", (e) => {
      const a = active.get(e.pointerId);
      if (a && e.target !== el) endOne(a, e.clientX, e.clientY);   // cancelled elsewhere (no capture): OrbitControls never hears of it
    }, true);
    window.addEventListener("pointermove", (e) => {
      const a = active.get(e.pointerId);
      if (a) {
        a.x = e.clientX;
        a.y = e.clientY;
      }
      if (e.pointerType === "mouse" && e.buttons === 0) {
        for (const b of Array.from(active.values())) if (b.type === "mouse") endOne(b, e.clientX, e.clientY);
      }
    }, true);
    window.addEventListener("blur", () => endAll());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) endAll();
    });
  })(renderer.domElement);
  var flyAnim = null;
  function flyTo(pos, target, dur = 1600) {
    ent_lookEnd();   // 1.0.1-L (Part 7, U1)
    ent_zoom.pending = 0;   // 1.0.1-K: a fly cancels a smooth zoom that is still running
    ent_viewInclude(target);   // 1.0.1-L (L.87): a flight's target is always inside the limits of the view
    flyAnim = {
      t0: performance.now(),
      dur,
      p0: camera.position.clone(),
      p1: new Vector3(...pos),
      c0: controls.target.clone(),
      c1: new Vector3(...target)
    };
    // 1.0.4: a target close to the flight's eye is a thing to orbit round (ent_passOn), if the flight ends under a roof (the animation loop)
    ent_orbit.obj = flyAnim.p1.distanceTo(flyAnim.c1) <= ENT_ORBIT_NEAR;
    ent_orbit.t = -1e9;
  }
  // ===== 1.0.1-K: two-finger zoom (the user: "תוסיף אופציה להגדלת זום או להקטנה באמצעות שתי אצבעות על עכבר על לפטופ") =====
  // A touchpad pinch reaches the page as "wheel" events with ctrlKey = true and small deltaY (Chromium / WebView2: the pinch scale is
  // exp(-deltaY / 100)); without preventDefault the WEBVIEW zooms (the whole page - and a page zoom below 100% was exactly the DPR bug).
  // r160's OrbitControls treats it as a plain wheel (0.95 ^ (|deltaY| / 100): a 10% pinch zoomed 0.5%), and skips preventDefault while a
  // drag is on. So the canvas gets its own non-passive capture listener: a pinch (ctrlKey, pixel deltas below 50) follows the fingers
  // (distance * exp(deltaY / 100)); a two-finger slide (no ctrlKey, pixel deltas below 50: a mouse notch is 100 or 120, or a line/page
  // delta) zooms at 0.1% per pixel; a Ctrl + mouse-wheel notch zooms 5% like the plain wheel. All three are applied smoothly by the
  // animation loop (ent_zoom.pending, in log-distance units, eased at 35% a frame) and clamped to [minDistance, maxDistance]. OrbitControls
  // is kept out of these events by switching its enableZoom off during their dispatch only (restored in a window bubble listener and at
  // the next frame): its touch pinch, middle-button dolly and plain mouse wheel are unchanged; other listeners (the presentation pauses on
  // a wheel) still see the event.
  var ent_zoom = { pending: 0, held: false, off: new Vector3() };
  (function wheelZoom(el) {
    const release = () => {
      if (ent_zoom.held) {
        ent_zoom.held = false;
        if (controls) controls.enableZoom = true;
      }
    };
    el.addEventListener("wheel", (e) => {
      if (ent_load.loading || !controls || controls.enabled === false) return;
      // 1.0.2 (M): Shift + wheel raises or lowers the eye (ent_liftWheel), never zooms; Chromium on Windows turns a Shift + wheel into a sideways one (deltaX), so the
      // larger delta counts (a line is 33 pixels, a page 800, as near enough)
      if (e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        if (!ent_zoom.held) {
          ent_zoom.held = true;
          controls.enableZoom = false;
        }
        const dd = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (dd && isFinite(dd)) ent_liftWheel(dd * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 800 : 1));
        return;
      }
      // 1.0.1-L (L.87): a slide mostly sideways on a touchpad (or a tilted wheel) moves nothing: its small vertical part is not a zoom for
      // either handler, and the page does not take it (no sideways scroll or back-swipe)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (!ent_zoom.held) {
          ent_zoom.held = true;
          controls.enableZoom = false;
        }
        return;
      }
      const dy = e.deltaY;
      if (!dy || !isFinite(dy)) {
        if (e.ctrlKey) e.preventDefault();   // a pinch event with no vertical delta: still never zoom the page
        return;
      }
      const pixel = e.deltaMode === 0, small = pixel && Math.abs(dy) < 50;
      let k;
      if (e.ctrlKey) k = small ? dy / 100 : Math.sign(dy) * 0.0513;   // pinch: follow the fingers; Ctrl + notch: 5% (= ln(1 / 0.95))
      else if (small) k = dy * 0.001;                                   // two-finger slide on a touchpad
      else return;                                                      // a mouse-wheel notch: OrbitControls, unchanged
      e.preventDefault();
      ent_zoom.pending = Math.max(-4, Math.min(4, ent_zoom.pending + k));
      if (!ent_zoom.held) {
        ent_zoom.held = true;
        controls.enableZoom = false;
      }
    }, { capture: true, passive: false });
    window.addEventListener("wheel", release, { passive: true });
    // 1.0.1-K review (ui-4): a pinch with the pointer over a pill, the label's card, the side panel, the nav row or the presentation's
    // box never reached the canvas listener (they are the canvas's siblings under body), so nothing prevented it and the WebView zoomed
    // the whole page - and a later pinch over the canvas could not undo it. This window listener (capture, non-passive) keeps EVERY
    // ctrl + wheel from zooming the page, during the load too; over the canvas the listener above still dollies the camera, and a plain
    // wheel (the panel's scrolling) is left alone.
    window.addEventListener("wheel", (e) => {
      if (e.ctrlKey) e.preventDefault();
    }, { capture: true, passive: false });
  })(renderer.domElement);
  // one easing step of the pending zoom (called by the animation loop before controls.update)
  function ent_zoomStep() {
    if (ent_zoom.held) {
      ent_zoom.held = false;
      controls.enableZoom = true;
    }
    if (flyAnim) {
      ent_zoom.pending = 0;
      return;
    }
    const p = ent_zoom.pending;
    if (Math.abs(p) < 1e-4) {
      ent_zoom.pending = 0;
      return;
    }
    // 1.0.1-L (L.87): eased in time, not per frame (at a low frame rate 35% a frame ran on for a second after the fingers stopped)
    const step = Math.abs(p) < 2e-3 ? p : p * Math.max(0.35, 1 - Math.exp(-ent_view.dt / 40));
    const off = ent_zoom.off.copy(camera.position).sub(controls.target);
    const L = off.length();
    if (!(L > 0) || !isFinite(L)) {
      ent_zoom.pending = 0;
      return;
    }
    const L2 = Math.min(controls.maxDistance || 2200, Math.max(controls.minDistance || 2, L * Math.exp(step)));
    camera.position.copy(controls.target).add(off.setLength(L2));
    ent_zoom.pending = L2 === L * Math.exp(step) ? p - step : 0;   // at a limit: drop the rest
  }
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
  var ent_view = { R0: 230, R: 230, yMin: -15, yMax: 180, d: new Vector3(), last: null, dt: 16.7 };
  var ENT_AX = [30, 0], ENT_BX = [103, 510];   // the axis of the site, in x / z: the inner court's middle and the forest house's (model choice)
  var ent_viewN = [0, 0];
  function ent_viewNear(x, z) {   // the nearest point of the axis, into ent_viewN
    const ax = ENT_BX[0] - ENT_AX[0], az = ENT_BX[1] - ENT_AX[1];
    const t = Math.max(0, Math.min(1, ((x - ENT_AX[0]) * ax + (z - ENT_AX[1]) * az) / (ax * ax + az * az)));
    ent_viewN[0] = ENT_AX[0] + ax * t;
    ent_viewN[1] = ENT_AX[1] + az * t;
  }
  function ent_viewInclude(p) {   // a flight: its target is inside the limit
    ent_viewNear(p[0], p[2]);
    ent_view.R = Math.max(ent_view.R0, Math.hypot(p[0] - ent_viewN[0], p[2] - ent_viewN[1]) + 30);
    ent_view.yMax = Math.max(ent_view.yMax, p[1]);
    ent_view.yMin = Math.min(ent_view.yMin, p[1]);
  }
  function ent_clampView() {
    if (flyAnim || ent_load.loading || !controls) return;
    const q = controls.target, d = ent_view.d;
    ent_viewNear(q.x, q.z);
    const nx = q.x - ent_viewN[0], nz = q.z - ent_viewN[1], L = Math.hypot(nx, nz), k = L > ent_view.R ? ent_view.R / L : 1;
    d.set(ent_viewN[0] + nx * k - q.x, Math.min(ent_view.yMax, Math.max(ent_view.yMin, q.y)) - q.y, ent_viewN[1] + nz * k - q.z);
    if (d.x === 0 && d.y === 0 && d.z === 0) return;
    q.add(d);
    camera.position.add(d);
  }
  function ent_damp(t) {
    const dt = ent_view.last == null ? 16.7 : Math.max(1, Math.min(1000, t - ent_view.last));
    ent_view.last = t;
    ent_view.dt = dt;
    controls.dampingFactor = Math.max(0.06, Math.min(0.85, 1 - Math.exp(-dt / 140)));
  }
  var root = new Group();
  scene.add(root);
  ctx = {
    THREE: three_module_exports,
    scene,
    root,
    M,
    TEX,
    H,
    LV,
    CO,
    labels: [],
    animated: [],
    cutaway: [],
    interiorOnly: [],
    layers: {},
    shared: {},
    flyTo,
    camIndoors: ent_inPlace,   // 1.0.1-L (Part 7, U1): 70-ui.js's nav buttons and keys turn in place (1.0.4: not round a thing one flew to, ent_inPlace)
    camPass: ent_passOn,       // 1.0.4: the fade loop of 70-ui.js fades the buildings' walls and ceilings between the camera and the target
    camPassHit: ent_passSurf,  //   (only those hits: ent_passSurf(hit, ray direction))
    camera,
    controls,
    renderer
  };
  // 1.0.1-K: the shadow pass's depth programs. renderer.compile() prepares the materials of the scene only; WebGLShadowMap draws every
  // shadow caster with its own MeshDepthMaterial variants (side = the caster's shadow side, instanced or not, a map / alphaMap copy for
  // alpha-tested casters), so on the 1.0.1 first frame 4 more programs compiled synchronously (~1.2 s cold on an Intel Iris Xe). This
  // builds a tiny scene with one stand-in per variant actually used, plus copies of the visible lights (the program key counts the lights
  // and their shadows), and no fog (the shadow pass renders with an empty scene); it is compiled with a render target bound (the shadow
  // pass renders into one: no tone mapping, linear output) - so the program keys are the shadow pass's own.
  function ent_depthScene() {
    const tiny = new Scene();
    const SS = { 0: 1, 1: 0, 2: 2 };   // WebGLShadowMap: FrontSide -> BackSide, BackSide -> FrontSide, DoubleSide -> DoubleSide
    const seen = new Set(), g = new BoxGeometry(1, 1, 1), lights = [];
    scene.traverseVisible((o) => {
      if (o.isLight) {
        lights.push(o);
        return;
      }
      if (!o.isMesh || !o.castShadow) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      if (!m || m.visible === false) return;
      const side = m.shadowSide != null ? m.shadowSide : SS[m.side];
      const withMap = !!(m.map && m.alphaTest > 0), withAlpha = !!(m.alphaMap && m.alphaTest > 0);
      const key = side + "|" + (o.isInstancedMesh ? 1 : 0) + "|" + (withMap ? 1 : 0) + "|" + (withAlpha ? 1 : 0) + "|" + (m.wireframe ? 1 : 0);
      if (seen.has(key)) return;
      seen.add(key);
      const dm = new MeshDepthMaterial({ depthPacking: RGBADepthPacking });
      dm.side = side;
      dm.wireframe = !!m.wireframe;
      if (withMap) {
        dm.map = m.map;
        dm.alphaTest = m.alphaTest;
      }
      if (withAlpha) {
        dm.alphaMap = m.alphaMap;
        dm.alphaTest = m.alphaTest;
      }
      tiny.add(o.isInstancedMesh ? new InstancedMesh(g, dm, 1) : new Mesh(g, dm));
    });
    for (const l of lights) {
      try { tiny.add(l.clone()); } catch (_) {}
    }
    return { tiny, variants: seen.size };
  }
  // a yield that lets the browser paint the progress bar (one frame), never a fixed wait; a hidden tab gets no frames: no yield then
  function ent_yieldPaint() {
    if (document.hidden || typeof requestAnimationFrame !== "function") return Promise.resolve();
    return new Promise((resolve) => {
      let done = false;
      const go = () => {
        if (!done) {
          done = true;
          resolve();
        }
      };
      requestAnimationFrame(() => setTimeout(go, 0));   // after the frame's paint
      setTimeout(go, 100);                              // the tab was hidden meanwhile: do not wait for a frame
    });
  }
  async function initModules() {
    const MODULES = [
      { name: "mount.js", build: buildMount },
      { name: "courts.js", build: buildCourts },
      { name: "altar.js", build: buildAltar },
      { name: "vessels.js", build: buildVessels },
      { name: "heichal.js", build: buildHeichal },
      { name: "interior.js", build: buildInterior },
      { name: "kelim.js", build: buildKelim },   // 1.0.1-L (L.88): the vessels of I Kings 7 (57-kelim.js); before ui.js, it reads the labels
      { name: "palace.js", build: buildPalace },
      { name: "ui.js", build: buildUI },
      { name: "tour.js", build: buildTour }   // 1.0.1-H: the presentation (75-tour.js); after ui.js, it uses ctx.ui
    ];
    const fill = document.getElementById("fill");
    const loadMsg = document.getElementById("loading-msg");
    const STAGES = [
      "טוען את הר הבית והחצר הגדולה",
      "טוען את חצר הכהנים ושעריה",
      "טוען את מזבח הנחושת",
      "טוען את הים, המכונות ויכין ובועז",
      "טוען את האולם, ההיכל והיציע",
      "טוען את הקודש וקודש הקדשים",
      "טוען את כלי הבית",
      "טוען את בית שלמה",
      "טוען את הקישורים והצבעים",
      "מכין את המצגת"
    ];
    const N = MODULES.length;
    const bar = (frac) => {
      if (fill) fill.style.width = (Math.max(0, Math.min(1, frac)) * 100).toFixed(1) + "%";
    };
    let yieldMs = 0;
    for (let i = 0; i < N; i++) {
      if (loadMsg) loadMsg.textContent = STAGES[i] + " (" + (i + 1) + "/" + N + ")";
      const ty = performance.now();
      await ent_yieldPaint();
      yieldMs += performance.now() - ty;
      const t = performance.now();
      try {
        await MODULES[i].build(ctx);
      } catch (e) {
        console.error("[module " + MODULES[i].name + "]", e);
        showToast("שגיאה בטעינת " + MODULES[i].name + ": " + e.message, 5e3);
      }
      ent_mark("module " + MODULES[i].name, performance.now() - t);
      bar((i + 1) / N * 0.85);
    }
    // the shaders of every material (the hidden layers too: no hitch when one is switched on), compiled together behind the overlay
    if (loadMsg) loadMsg.textContent = "מכין את התצוגה";
    const ty = performance.now();
    await ent_yieldPaint();
    yieldMs += performance.now() - ty;
    ent_mark("paint yields (progress bar)", yieldMs, N + 1 + " frames");
    const tc = performance.now();
    let how = "compile", variants = 0;
    try {
      const ds = ent_depthScene();
      variants = ds.variants;
      const rt = new WebGLRenderTarget(4, 4);
      if (!document.hidden && typeof renderer.compileAsync === "function") {
        how = "compileAsync";
        const p1 = renderer.compileAsync(scene, camera);
        renderer.setRenderTarget(rt);   // the depth programs: keyed as in the shadow pass (see ent_depthScene)
        const p2 = renderer.compileAsync(ds.tiny, camera);
        renderer.setRenderTarget(null);
        await Promise.race([Promise.all([p1, p2]), new Promise((r) => setTimeout(r, 25e3))]);
      } else {
        renderer.compile(scene, camera);
        renderer.setRenderTarget(rt);
        renderer.compile(ds.tiny, camera);
        renderer.setRenderTarget(null);
      }
    } catch (e) {
      try { renderer.setRenderTarget(null); } catch (_) {}
      console.warn("[load] shader compile:", e && e.message);
    }
    let par = false;
    try { par = !!renderer.getContext().getExtension("KHR_parallel_shader_compile"); } catch (_) {}
    ent_mark("compile shaders", performance.now() - tc, how + ", " + ((renderer.info && renderer.info.programs) || []).length + " programs incl. " + variants + " shadow-depth variants" + (par ? ", parallel" : ""));
    bar(0.97);
    // the first frame, still under the overlay: the texture uploads, the shadow map and the depth programs happen here, not in view
    const tf = performance.now();
    try {
      controls.update();
      renderer.render(scene, camera);
    } catch (e) {
      console.warn("[load] first frame:", e && e.message);
    }
    ent_mark("first frame (under the overlay)", performance.now() - tf, ((renderer.info && renderer.info.programs) || []).length + " programs after it");
    bar(1);
    ent_load.loading = false;
    // 1.0.2: the bar's buttons (the panel's, the presentation's) were hidden while the loading view was up (index.html: it no longer covers the bar)
    document.documentElement.classList.add("tm-ready");
    const loadEl = document.getElementById("loading");
    if (loadEl) {
      loadEl.style.pointerEvents = "none";   // 1.0.2: it fades out now (index.html), and the model takes the clicks at once
      loadEl.style.opacity = "0";
      setTimeout(() => loadEl.remove(), 700);
    }
    ent_mark("overlay removed (since navigation start)", performance.now(), "total");
    // (the "model loaded - developer" toast was removed)
  }
  // the "[load]" table (once, after the first visible frame): console.table + window.__loadTimes (read by the headless tests)
  function ent_printLoad() {
    if (ent_load.printed) return;
    ent_load.printed = true;
    const rows = [];
    let resEnd = null;
    try {
      const b = performance.getEntriesByType("resource").find((x) => /bundle\.js/.test(x.name));
      if (b) resEnd = b.responseEnd;
    } catch (_) {}
    if (typeof core_t0 === "number") {
      rows.push({ step: "bundle.js downloaded (since navigation start)", ms: resEnd == null ? null : Math.round(resEnd), at: resEnd == null ? null : Math.round(resEnd), note: "" });
      rows.push({ step: "three.js evaluated (lib, until 10-core)", ms: resEnd == null ? null : Math.round(core_t0 - resEnd), at: Math.round(core_t0), note: "" });
    }
    if (typeof core_texMs === "number") rows.push({ step: "10-core textures (TEX)", ms: Math.round(core_texMs * 10) / 10, at: null, note: "" });
    for (const r of ent_load.rows) rows.push(r);
    rows.push({ step: "first visible frame", ms: ent_load.firstVisibleMs == null ? null : Math.round(ent_load.firstVisibleMs * 10) / 10, at: Math.round(performance.now()), note: "" });
    window.__loadTimes = rows;
    try {
      console.log("[load] " + rows.map((r) => r.step + ": " + (r.ms == null ? "-" : r.ms + " ms") + (r.note ? " (" + r.note + ")" : "")).join(" | "));
      if (console.table) console.table(rows);
    } catch (_) {}
  }
  var ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  // 1.0.1-H: the camera guard - if any coordinate of the camera or the target is not finite (a drag while the canvas had no height, see
  // viewSize), restore the last good camera and rebuild the controls (their closure holds the NaN deltas); the fly animation is dropped.
  // 1.0.1-K: a pose closer than controls.minDistance (2) is never saved as "good" and is not accepted either: the camera goes back to the
  // last good pose (OrbitControls' update() clamps the radius itself; this catches a pose set from outside between two updates).
  var lastGoodPos = camera.position.clone(), lastGoodTarget = controls.target.clone();
  function guardCamera() {
    const p = camera.position, q = controls.target;
    if (isFinite(p.x + p.y + p.z + q.x + q.y + q.z)) {
      ent_clampView();   // 1.0.1-L (L.87)
      // (1.0.1-L closed the polar limit here after looking up indoors, back to PI * 0.495; 1.0.2 (M): the limit is the floor's, ent_floorStep)
      const minD = Math.max(0, (controls.minDistance || 0) - 1e-3);
      if (p.distanceTo(q) >= minD) {
        lastGoodPos.copy(p);
        lastGoodTarget.copy(q);
        return;
      }
      if (lastGoodPos.distanceTo(lastGoodTarget) >= minD) {
        camera.position.copy(lastGoodPos);
        controls.target.copy(lastGoodTarget);
        controls.update();
      }
      return;
    }
    flyAnim = null;
    ent_zoom.pending = 0;
    ent_look.on = false;   // 1.0.1-L (Part 7, U1)
    camera.position.copy(lastGoodPos);
    makeControls(lastGoodTarget);
    controls.update();
  }
  renderer.setAnimationLoop((t) => {
    if (ent_load.loading) return;   // 1.0.1-K: nothing is drawn behind the loading overlay (see initModules)
    const flying = !!flyAnim;   // 1.0.2: a flight's frames, its last one too, are not tested for walls (ent_wallStep)
    if (flyAnim) {
      const k = Math.min(1, (t - flyAnim.t0) / flyAnim.dur), e = ease(k);
      camera.position.lerpVectors(flyAnim.p0, flyAnim.p1, e);
      controls.target.lerpVectors(flyAnim.c0, flyAnim.c1, e);
      if (k >= 1) {
        flyAnim = null;
        // 1.0.4: a thing to orbit round only when the flight ends under a roof (the menorot, the ulam's tables); a view from outside (Yachin and Boaz from the
        // court, 15.9 amot, its target before the ulam) stays as it was
        if (ent_orbit.obj && !ent_roofed(camera.position)) ent_orbit.obj = false;
      }
    }
    ent_lookStep();   // 1.0.1-L (Part 7, U1)
    ent_damp(t);   // 1.0.1-L (L.87)
    ent_zoomStep();
    ent_liftStep();   // 1.0.2 (M): the eye's height (the keys, Shift + wheel)
    ent_floorStep();   // 1.0.2 (M): the polar limit = the floor under the eye
    ent_controlsUpdate();   // 1.0.2: controls.update(), "סיבוב איטי" in place indoors
    if (!flying) ent_wallStep();   // 1.0.2: never into a wall
    guardCamera();
    for (const fn of ctx.animated) {
      try {
        fn(t);
      } catch (_) {
      }
    }
    ent_wallMark();   // 1.0.2
    if (ent_load.printed) {
      renderer.render(scene, camera);
    } else {
      const t0 = performance.now();
      renderer.render(scene, camera);
      ent_load.firstVisibleMs = performance.now() - t0;
      ent_printLoad();
    }
  });
  setInterval(() => {
    if (document.hidden && !ent_load.loading) {
      ent_damp(performance.now());   // 1.0.1-L (L.87)
      ent_zoomStep();
      ent_floorStep();   // 1.0.2 (M)
      ent_controlsUpdate();   // 1.0.2 (as in the animation loop)
      if (!flyAnim) ent_wallStep();
      guardCamera();
      for (const fn of ctx.animated) {
        try {
          fn(performance.now());
        } catch (_) {
        }
      }
      ent_wallMark();
      renderer.render(scene, camera);
    }
  }, 250);
  // the view follows the window: on "resize" and from a watchdog (a webview may show the tab without firing "resize"; see viewSize)
  var fitW = viewWH[0], fitH = viewWH[1];
  function fitToWindow() {
    guardCamera();   // the watchdog also runs the camera guard: it ticks even where neither the animation loop nor the hidden-document interval does
    const wh = viewSize();
    if (wh[0] === fitW && wh[1] === fitH) return;
    fitW = wh[0];
    fitH = wh[1];
    camera.aspect = fitW / fitH;
    camera.updateProjectionMatrix();
    renderer.setSize(fitW, fitH);
  }
  window.addEventListener("resize", fitToWindow);
  setInterval(fitToWindow, 500);
  var isOtzaria = typeof window.Otzaria !== "undefined";
  if (isOtzaria) {
    window.Otzaria.on("plugin.boot", (payload) => {
      const ver = document.getElementById("version");
      if (ver) ver.textContent = "v" + payload.plugin.version;
      applyTheme(payload.theme);
      initModules().catch((e) => {
        console.error(e);
        showToast("שגיאה: " + e.message, 5e3);
      });
    });
    window.Otzaria.on("theme.changed", applyTheme);
  } else {
    document.documentElement.style.setProperty("--bg", "#0a0e1a");
    document.documentElement.style.setProperty("--fg", "#e8e8e8");
    document.documentElement.style.setProperty("--primary", "#c9a84c");
    initModules().catch((e) => console.error(e));
  }
  window.__ctx = ctx;
  window.__ent360 = { indoors: ent_indoors, wall: ent_wall, look: ent_look, solids: ent_solids, wallHit: ent_wallHit, floor: ent_floor, lift: ent_lift, floorY: ent_floorY, orbit: ent_orbit, passOn: ent_passOn };   // 1.0.2 (+ M, 1.0.4): for the headless tests
  window.__renderer = renderer;
  window.__camera = camera;
