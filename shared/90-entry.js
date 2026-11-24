  //@@slot top-note
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
  //@@slot makeLabelSprite2
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
    if (l && l.box) {   // a rounded dark plate with a gold rim, so that the number reads on the stone of the altar
      const r = 22, x0 = 6, y0 = 10, x1 = cv.width - 6, y1 = cv.height - 10;
      c.beginPath();
      c.moveTo(x0 + r, y0); c.lineTo(x1 - r, y0); c.quadraticCurveTo(x1, y0, x1, y0 + r); c.lineTo(x1, y1 - r); c.quadraticCurveTo(x1, y1, x1 - r, y1);
      c.lineTo(x0 + r, y1); c.quadraticCurveTo(x0, y1, x0, y1 - r); c.lineTo(x0, y0 + r); c.quadraticCurveTo(x0, y0, x0 + r, y0); c.closePath();
      c.fillStyle = typeof l.box === "string" ? l.box : "rgba(24,16,6,.86)";
      c.fill();
      // MEASURES_211: a plate may carry its own rim colour (l.rim) - the colour of the line it names (the altar's measures)
      c.lineWidth = typeof l.rim === "string" ? 9 : 4;
      c.strokeStyle = typeof l.rim === "string" ? l.rim : "rgba(243,220,154,.9)";
      c.stroke();
    }
    lt.draw(c, cv.width - pad, cv.height / 2);
    const tex = new CanvasTexture(cv);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const spr = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthTest: !(l && l.onTop), depthWrite: false }));
    //@@slot makeLabelSprite2-2
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
  // LOAD_211 (the user, 14.11.2026: "זמן הטעינה הוכפל לפחות, יש דרך לקצר?"): the shaders' logs are not read - three.js then never waits
  // for a program to finish linking before its first use (on Windows/ANGLE the wait is the heaviest single cost of the first frame)
  renderer.debug.checkShaderErrors = false;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  // 1.0.1-H (robustness, the user: "נתקע ולא מסתובב נכון"): a webview may create the page while its tab is hidden - window.innerWidth /
  // innerHeight are then 0, the camera aspect becomes NaN and OrbitControls divides a drag by the canvas height (0): every value turns
  // NaN and the camera is stuck for good. The view is therefore never sized below 2 x 2, and fitToWindow() below re-fits it when the
  // window gets its real size (on "resize", and from a watchdog for webviews that show the tab without firing "resize").
  function viewSize() { return [Math.max(2, window.innerWidth || 0), Math.max(2, window.innerHeight || 0)]; }
  var viewWH = viewSize();
  renderer.setSize(viewWH[0], viewWH[1]);
  renderer.shadowMap.enabled = true;
  //@@slot after-viewWH
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
  //@@slot ent_room
  ent_room.position.y = 0;
  ent_room.traverse((o) => { if (o.isPointLight) o.intensity = 5; });
  scene.environment = pmrem.fromScene(ent_room, 0.04).texture;
  var sky = new Sky();
  //@@slot after-sky
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
  //@@slot after-sc
  var shc = { scene: scene, force: true, again: 0, skip: false, n: -1, h: 0, sec: "", frames: 0, draws: 0,
    objectValues: new Float64Array(7), lightValues: new Float64Array(9), state: { n: 0, h: 0, dirty: false } };
  function shc_obj(o) {
    let c = o.__shc, ch = false;
    if (!c) { c = o.__shc = new Float64Array(23); ch = true; }
    const e = o.matrixWorld.elements;
    for (let i = 0; i < 16; i++) if (c[i] !== e[i]) { c[i] = e[i]; ch = true; }
    const g = o.geometry, pa = g && g.attributes ? g.attributes.position : null, m = o.material, im = o.instanceMatrix;
    // One scratch buffer for the pass, not a new array for every caster in every frame.
    const v = shc.objectValues;
    v[0] = g ? g.id : -1; v[1] = pa ? pa.version : -1;
    v[2] = Array.isArray(m) ? -m.length : (m ? m.id : -1); v[3] = Array.isArray(m) ? 1 : (m && m.visible ? 1 : 0);
    v[4] = o.layers.mask; v[5] = im ? im.version : -1; v[6] = o.isInstancedMesh ? o.count : -1;
    for (let i = 0; i < 7; i++) if (c[16 + i] !== v[i]) { c[16 + i] = v[i]; ch = true; }
    return ch;
  }
  function shc_walk(o, st) {
    if (o.visible === false) return;
    if ((o.isMesh || o.isLine || o.isPoints) && o.castShadow) {
      st.n++;
      st.h = (Math.imul(st.h, 31) + o.id) | 0;
      if (shc_obj(o)) st.dirty = true;
    }
    const k = o.children;
    for (let i = 0; i < k.length; i++) shc_walk(k[i], st);
  }
  function shc_light(L) {
    const s = L.shadow, sc2 = s && s.camera;
    let c = L.__shcL, ch = !s || !s.map;
    if (!c) { c = L.__shcL = new Float64Array(41); ch = true; }
    const a = L.matrixWorld.elements, b = L.target ? L.target.matrixWorld.elements : a;
    for (let i = 0; i < 16; i++) { if (c[i] !== a[i]) { c[i] = a[i]; ch = true; } if (c[16 + i] !== b[i]) { c[16 + i] = b[i]; ch = true; } }
    const v = shc.lightValues;
    if (sc2) {
      v[0] = sc2.left; v[1] = sc2.right; v[2] = sc2.top; v[3] = sc2.bottom; v[4] = sc2.near; v[5] = sc2.far;
      v[6] = s.mapSize.x; v[7] = s.mapSize.y; v[8] = sc2.fov || 0;
    } else v.fill(0);
    for (let i = 0; i < 9; i++) if (c[32 + i] !== v[i]) { c[32 + i] = v[i]; ch = true; }
    return ch;
  }
  var shc_render = renderer.shadowMap.render;
  renderer.shadowMap.render = function (lights, scn, cam) {
    if (scn !== shc.scene || !lights || !lights.length || !this.enabled) return shc_render.call(this, lights, scn, cam);
    if (shc.skip) return;   // HQ_302: the light toggles' prepass draws the scene again - the map stays as it is
    shc.frames++;
    const st = shc.state;
    st.n = 0; st.h = 0; st.dirty = false;
    shc_walk(scn, st);
    let dirty = st.dirty || st.n !== shc.n || st.h !== shc.h;
    shc.n = st.n;
    shc.h = st.h;
    for (const L of lights) if (shc_light(L)) dirty = true;
    const es = typeof ent_sec !== "undefined" && ent_sec ? ent_sec : null;
    const sec = (es && es.on ? es.axis + ":" + es.v : "-") + (renderer.localClippingEnabled ? "+" : "");
    if (sec !== shc.sec) { shc.sec = sec; dirty = true; }
    // a change is drawn twice, on its own frame and the next: state that settles a frame late (a material's program, its clipping set from
    // the section) is in the map too
    if (dirty) shc.again = 1;
    else if (shc.again > 0) { shc.again--; dirty = true; }
    if (!dirty && !shc.force) return;
    shc.force = false;
    shc.draws++;
    return shc_render.call(this, lights, scn, cam);
  };
  renderer.domElement.addEventListener("webglcontextrestored", () => { shc.force = true; });
  var camera = new PerspectiveCamera(48, viewWH[0] / viewWH[1], 0.5, 6e3);
  camera.position.set(430, 190, 240);
  //@@slot after-camera-note
  var ent_hq = HQ_make(renderer, scene, camera, { pre: (on) => { shc.skip = on; } });
  // 1.0.1-H: the controls are built by a function so that they can be rebuilt (OrbitControls keeps its drag deltas in a closure: once a
  // NaN gets in - a drag while the canvas had no height - update() re-applies it forever; see the guard in the animation loop)
  var controls = null;
  var ENT_MIN_POLAR = 0.2;   // 1.9.2 / 1.3.4: the steepest view from above (see makeControls)
  function makeControls(target) {
    const c = new OrbitControls(camera, renderer.domElement);
    c.target.copy(target || new Vector3(0, 30, 0));
    c.enableDamping = true;
    c.dampingFactor = 0.06;
    // 1.0.2 (M): free below the target's level too (was PI * 0.495: the eye never went below the target - the user could not look up under a base or down
    // between the bread stacks); the floor under the eye is the limit now, set every frame by ent_floorStep. PI - 0.06: never at the nadir, as minPolarAngle
    c.maxPolarAngle = Math.PI - 0.03;   // 1.2.0: free (the floor under the target is the limit, guardCamera)
    // 1.0.1-H: the camera never reaches the zenith (OrbitControls "sticks" at the pole: a horizontal drag there only spins the view)
    // 1.9.2 / 1.3.4 (the user, with two recordings: "בעיית גלילה מטורפת... לא מצליח לגלול 360 נורמלי, עף לכל הכיוונים"): never straight down.
    // Near the zenith a sideways drag only spins the picture round the target, and a drag on a slant tilts and spins at once; 11.5
    // degrees from the vertical still reads as a view from above, and a drag then circles round the thing like a drone (flyTo tilts
    // a flight's end to it, so the first frame does not jump)
    c.minPolarAngle = ENT_MIN_POLAR;
    // 1.0.1-K: never closer than 2 amot to the target (the same floor as the UI's zoom buttons); with the DPR fix in 00-lib.js a wheel
    // notch can no longer put the camera ON the target (r160's default minDistance 0 allowed it)
    c.minDistance = 0.3;   // 1.2.0: as close as one likes
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
    c.addEventListener("end", () => { if (!cam_drag) cam_decide(); });   // 1.2.0: the mode after every drag / pinch
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
  // ===== 1.2.0: the camera - ONE controller in two modes. Replaces the 1.0.2-1.0.5 patches (ent_look, ent_wall*, ent_floor*, ent_pass*,
  // ent_controlsUpdate), which fought each other every frame (the user: "טלאי על טלאי"). The user's rule: every exhibit from every
  // height and every distance - so there are NO wall or floor stops any more; what is between the eye and the target goes see-through
  // (the fade loop of 70-ui.js: ctx.camPass / ctx.camPassHit below).
  //   "orbit": OrbitControls round the target - outside, and inside round a thing one flew to or walked up to (closer than CAM_NEAR).
  //   "look":  in a roofed space with a far target (a hall seen from inside) a drag turns the eye in place (cam_lookDrag: OrbitControls
  //            is paused for the drag, then resumed with the target set along the new view direction, on the thing it meets); the wheel,
  //            unchanged, dollies toward the target = walks forward and back.
  // The mode is decided by cam_decide - when a flight ends, a drag ends (OrbitControls "end", the look drag's end), ~0.4 s after the last
  // wheel or lift - never every frame. The only limits left: the view's radius (ent_clampView), the floor under the TARGET (the eye stays
  // 0.35 over it: under it there is nothing to see), the ground (never under the world), minDistance 0.3.
  var ENT_POLAR = Math.PI - 0.03;
  var CAM_NEAR = 18;   // a target closer than this is "a thing" one orbits, even under a roof (1.0.5's ENT_ORBIT_NEAR)
  var CAM_DOWN = new Vector3(0, -1, 0);
  // CAM_219 (2.0.19; the user, 18.11.2026: "יש בעיה במצלמה עדיין קיימת... זה בעיה באנימציות, זה בעיה בכפתורים, בעיה בהרבה דברים";
  // found by a code audit of both houses and a browser sweep):
  // (1) the polar limit follows the mode (cam_polarFit): in "look" and in walk mode the view may go down to 0.03 from the nadir - as the
  //     look drag and the walk mode's mouse always let it - and OrbitControls' 0.2 (ENT_MIN_POLAR) is the limit of "orbit" only. Until
  //     2.0.18 a look drag steeply down was undone on release by update()'s clamp (the eye jumped up to 3.7 amot, the view turned ~10
  //     degrees), and in walk mode the eye slid back and sank every frame. A pose past the limit of a new mode is fitted by turning the
  //     VIEW (the target moves, the eye stays).
  // (2) a flight is the flight's alone: no controls.update() on its in-between poses (update()'s clamp spun the picture where a flight
  //     passed over its target - 314 pairs of this house's views), OrbitControls' leftover glide is cleared when it starts and when it
  //     lands (cam_killInertia), and a press, a wheel turn or a key on the model ENDS it where it is (cam_flyStop): until now a drag in a
  //     flight was eaten, and its rest went on after the landing.
  // (3) the near plane follows the distance to the target (cam_nearStep): a vessel seen from 0.3 (the + button, a pinch) is not cut.
  // (4) walk mode climbs and descends with the floors (cam_walkFloor); (5) the mode of a wheel / walk / lift that just ended is decided
  //     at the press, not 0.4 s later; (6) a pinch under a roof pinches (PINCH_219).
  var CAM_LOOK_MIN = 0.03;
  var cam = { mode: "orbit", inside: true, lookLock: false, roofed: false, floorY: -Infinity, decideAt: 0, ray: null, n: new Vector3(), tmp: new Vector3(), s: new Spherical(), dirs: [new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)], up: new Vector3(0, 1, 0) };
  var ent_look = cam;   // (the name the roofed test below uses for its ray and directions)
  var ent_sol = { t: -1e9, all: [], roof: [], floor: [], walls: [], big: [] };
  //@@include raycast-bounds
  function ent_solids(withCut) {
    const now = performance.now();
    if (now - ent_sol.t > 1000) {
      ent_sol.t = now;
      const all = [], roof = [], floor = [], cut = new Set();
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
            // WALK_FLOOR_A2 (fix-a2, 22.11.2026; the user: in walk mode "הוא נכנס לתוך המדרגה במקום לטפס עליה"): a wall or a floor that
            // the fade loop shows see-through is still there to stand on - walk mode's floor (ent_solids("floor")) keeps it. Until now
            // a faded mesh left the list, and the eye fell through what it stood on: the altar's top from its ramp (the eye sank into the
            // altar), the threshold of a gate in the wall of the Mount (the eye dropped into the Mount's fill), a court's floor.
            if (!off && (!thin || o.userData.tmPass || o.userData.fade)) floor.push(o);
          }
        }
        for (const c of o.children) walk(c, off);
      };
      walk(scene, false);
      ent_sol.all = all;
      ent_sol.roof = roof;
      ent_sol.floor = floor;
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
    return withCut === "floor" ? ent_sol.floor : withCut ? ent_sol.roof : ent_sol.all;
  }
  function ent_roofed(p) {   // is p under a roof (the test above; 1.0.4: for the camera and for the target)
    let res = false;
    try {
      const ray = ent_look.ray || (ent_look.ray = new Raycaster());
      ray.camera = camera;
      const list = ent_solids(true), hit = (d, far) => { ray.set(p, d); ray.near = 0; ray.far = far; const h = ent_intersect.first(ray, list); return h ? h.distance : Infinity; };
      const walls = ent_look.dirs.map((d) => hit(d, 60));
      const near = walls.filter((w) => w < 60).length, tight = walls.filter((w) => w < 30).length;
      res = (near >= 3 && hit(ent_look.up, 60) < 60) || tight === 4;
    } catch (_) {
    }
    return res;
  }
  function cam_floorY(p, list) {   // the floor under p (a downward ray on the solids), or -Infinity over the void (list: ent_solids("floor") for walk mode)
    try {
      const ray = cam.ray || (cam.ray = new Raycaster());
      ray.camera = camera;
      ray.set(cam.tmp.set(p.x, p.y + 0.3, p.z), CAM_DOWN);
      ray.near = 0;
      ray.far = 500;
      const h = ent_intersect.first(ray, list || ent_solids(false));
      return h ? h.point.y : -Infinity;
    } catch (_) {
      return -Infinity;
    }
  }
  function cam_decide() {   // the mode, the roof and the floor - at the rare moments listed above
    cam.decideAt = 0;
    if (!controls || ent_load.loading) return;
    const p = camera.position, q = controls.target;
    cam.roofed = ent_roofed(p);
    cam.floorY = cam_floorY(q);
    // a look drag locks the mode "look" until the next flight (a drag that turned in place keeps turning in place, whatever the target's
    // distance now); a flight to a near thing (a vessel) gives "orbit"
    //@@slot cam_decide
    if (cam.mode === "look") cam.lookLock = true;
    cam_polarFit();   // CAM_219 (1)
  }
  var cam_pf = { s: new Spherical(), v: new Vector3(), p: new Vector3(), q: new Vector3() };
  function cam_polarFit() {   // CAM_219 (1): the polar limits of the mode; a pose past them is fitted by turning the view - the eye stays
    const c = controls;
    if (!c) return;
    c.minPolarAngle = cam.mode === "look" ? CAM_LOOK_MIN : ENT_MIN_POLAR;
    const v = cam_pf.v.copy(camera.position).sub(c.target);
    if (!(v.lengthSq() > 1e-12)) return;
    const s = cam_pf.s.setFromVector3(v);
    if (s.phi >= c.minPolarAngle - 1e-6 && s.phi <= c.maxPolarAngle + 1e-6) return;
    s.phi = Math.max(c.minPolarAngle, Math.min(c.maxPolarAngle, s.phi));
    c.target.copy(camera.position).sub(v.setFromSpherical(s));
    camera.lookAt(c.target);
  }
  function cam_killInertia() {   // CAM_219 (2): OrbitControls' leftover glide (its deltas are private): one update() with the full factor
    const c = controls;           // spends them, and the pose is put back as it was
    if (!c) return;
    const p = cam_pf.p.copy(camera.position), q = cam_pf.q.copy(c.target), df = c.dampingFactor, ar = c.autoRotate;
    c.dampingFactor = 1;
    c.autoRotate = false;
    try { c.update(); } catch (_) {}
    c.dampingFactor = df;
    c.autoRotate = ar;
    camera.position.copy(p);
    c.target.copy(q);
    camera.lookAt(q);
  }
  function cam_flyStop() {   // CAM_219 (2): the user takes the view in a flight - it ends where it is (ctx.camFlyStop)
    if (!flyAnim) return false;
    flyAnim = null;
    cam_killInertia();
    cam_decide();
    return true;
  }
  var cam_in = { dir: new Vector3(), walls: [] };
  function cam_keepInside(p, q) {
    try {
      const v = cam_in.dir.copy(p).sub(q), L = v.length();
      if (!(L > 0.6)) return;
      v.multiplyScalar(1 / L);
      const ray = cam.ray || (cam.ray = new Raycaster());
      ray.camera = camera;
      ray.set(q, v);
      ray.near = 0.3;
      ray.far = L;
      // Only the surfaces marked by the wall-fade system can constrain this orbit.
      // Filtering after raycasting made every indoor frame intersect the terrain and
      // all props too, although their hits were immediately ignored below.
      const walls = cam_in.walls;
      walls.length = 0;
      for (const o of ent_solids(false)) if (o.userData.tmPass) walls.push(o);
      for (const h of ent_intersect(ray, walls)) {
        if (!h.object.userData.tmPass || h.distance >= L - 0.05) continue;
        // KEEP_CUT_211 (the place of the vessels' chamber, 15.11.2026: the eye looks down into a cell whose ceiling the section has cut
        // away - and the ceiling, which no one sees, still drew the eye down to a span from the shelves): a surface that stands in the
        // half that the section removed (ent_sec: the side of the larger coordinate) is not there - it holds no eye
        if (ent_sec.on) { const hp = h.point, c = ent_sec.axis === "x" ? hp.x : ent_sec.axis === "y" ? hp.y : hp.z; if (c > ent_sec.v + 0.02) continue; }
        // KEEP_NEAR_211 (the user, 15.11.2026, the lambs' chamber: the eye landed a third of an amah from the floor and all one saw was
        // a blank surface - the straw, a flat sheet 0.4 over the target, was taken for a ceiling): a surface that stands this close to
        // the target is the thing one looks at or what it lies on, not a wall of its room - and an eye drawn to less than 1.5 from the
        // target sees nothing; and a low flat thing whose top is within 2 over the target (a floor's covering, a table's top) is no ceiling
        if (h.distance < 1.8) continue;
        try {
          const o = h.object, bb = cam_in.bb || (cam_in.bb = new Box3());
          if (o.isInstancedMesh) { if (!o.boundingBox && typeof o.computeBoundingBox === "function") o.computeBoundingBox(); if (o.boundingBox) bb.copy(o.boundingBox); else bb.makeEmpty(); }
          else { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); bb.copy(o.geometry.boundingBox); }
          if (!bb.isEmpty()) { bb.applyMatrix4(o.matrixWorld); if (bb.max.y - bb.min.y < 0.6 && bb.max.y < q.y + 2) continue; }
        } catch (_) {}
        p.copy(q).addScaledVector(v, Math.max(0.3, h.distance - 0.3));
        return;
      }
    } catch (_) {
    }
  }
  function cam_decideSoon(ms) { cam.decideAt = performance.now() + (ms || 400); }
  function cam_indoors() { return cam.mode === "look"; }   // ctx.camIndoors: 70-ui.js's nav buttons and keys turn in place
  function cam_pass() {   // ctx.camPass: with "מעבר דרך קירות" on, indoors the fade loop lets the eye see through the building surfaces between it and
    // the target; in the default (the eye stays in the room) nothing is faded - the curtain stays a curtain and the cloud stays in the devir (1.2.1, the user)
    if (cam.inside || !cam.roofed || flyAnim || ent_load.loading || !controls) return false;
    const fs = ctx && ctx.shared && ctx.shared.fadeState;
    return !(fs && fs.on === false);
  }
  function cam_passHit(x, dir) {   // ctx.camPassHit: a building's wall or ceiling (userData.tmPass) - not a floor at or under the target
    const o = x && x.object;
    if (!o || !o.userData.tmPass) return false;
    const n = cam.n;
    if (x.face) n.copy(x.face.normal).transformDirection(o.matrixWorld);
    else n.copy(dir).negate();
    if (n.dot(dir) > 0) n.negate();
    return !(n.y > 0.7 && x.point.y <= controls.target.y + 0.3);
  }
  // the look drag (mode "look"): OrbitControls is disabled for its duration (its own pointerdown returns at once), the eye turns in place
  var cam_drag = null;
  function cam_lookEnd() {
    if (!cam_drag) return;
    const d0 = cam_drag.d;
    cam_drag = null;
    if (!controls) return;
    controls.enabled = true;
    // the target: along the view, on the first thing the view meets (a wall, a vessel), else at the old distance
    const v = cam.tmp.copy(controls.target).sub(camera.position);
    let d = Math.max(1, d0);
    if (v.lengthSq() > 0) {
      v.normalize();
      try {
        const ray = cam.ray || (cam.ray = new Raycaster());
        ray.camera = camera;
        ray.set(camera.position, v);
        ray.near = 0.5;
        ray.far = d;
        const h = ent_intersect.first(ray, ent_solids(false));
        if (h) d = Math.max(1, h.distance - 0.5);
      } catch (_) {
      }
      controls.target.copy(camera.position).addScaledVector(v, d);
    }
    controls.update();
    cam_decide();
  }
  {
    const el = renderer.domElement;
    el.addEventListener("pointerdown", (e) => {
      if (e.__tmSynthetic) return;   // PINCH_219: the first finger, handed to OrbitControls below
      if (cam_drag) {
        if (e.pointerId !== cam_drag.id) {
          // a second finger: a pinch. PINCH_219 (the audit: under a roof a pinch shook the view instead of zooming): the first finger
          // was the look drag's and OrbitControls never saw it, so with the second alone it TURNED the view. The first is handed over
          // now (a synthetic press at its last place), and OrbitControls holds both fingers: a pinch.
          const first = cam_drag;
          cam_lookEnd();
          if (e.pointerType === "touch" && controls && controls.enabled !== false) {
            try {
              const ev = new PointerEvent("pointerdown", { bubbles: true, cancelable: true, pointerId: first.id, pointerType: "touch", isPrimary: true,
                clientX: first.x, clientY: first.y, button: 0, buttons: 1 });
              ev.__tmSynthetic = true;
              el.dispatchEvent(ev);
            } catch (_) {}
          }
        }
        return;
      }
      if (flyAnim) cam_flyStop();             // CAM_219 (2): a press in a flight ends it - what follows is the user's
      else if (cam.decideAt) cam_decide();    // CAM_219 (5): the mode of a wheel / walk / lift that just ended, now
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || !controls || controls.enabled === false || flyAnim || ent_load.loading) return;
      if (cam.mode !== "look") return;
      cam_drag = { id: e.pointerId, x: e.clientX, y: e.clientY, d: camera.position.distanceTo(controls.target) };
      cam.s.setFromVector3(cam.tmp.copy(controls.target).sub(camera.position));
      if (!(cam.s.radius > 0)) cam.s.radius = 10;
      controls.enabled = false;
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
    }, true);
    el.addEventListener("pointermove", (e) => {
      const D = cam_drag;
      if (!D || e.pointerId !== D.id) return;
      const dx = e.clientX - D.x, dy = e.clientY - D.y;
      D.x = e.clientX;
      D.y = e.clientY;
      const k = 2 * Math.PI / Math.max(200, viewWH[1] || el.clientHeight || 800) * 0.5;   // OrbitControls' rotateSpeed 0.5, the same feel
      cam.s.theta -= dx * k;
      cam.s.phi = Math.max(0.03, Math.min(ENT_POLAR, cam.s.phi + dy * k));
      controls.target.copy(camera.position).add(cam.tmp.setFromSpherical(cam.s));
      camera.lookAt(controls.target);
    }, true);
    const end = (e) => { if (cam_drag && (!e || e.pointerId === cam_drag.id)) cam_lookEnd(); };
    el.addEventListener("pointerup", end, true);
    el.addEventListener("pointercancel", end, true);
    window.addEventListener("pointerup", end, true);
    window.addEventListener("pointercancel", end, true);
    window.addEventListener("blur", () => cam_lookEnd());
    el.addEventListener("wheel", () => {
      if (flyAnim && !ent_load.loading) cam_flyStop();   // CAM_219 (2): the wheel in a flight ends it (registered before wheelZoom's listener: the zoom then applies)
      if (!cam_drag) cam_decideSoon(400);
    }, { capture: true, passive: true });
  }
  var ent_turn = { v: new Vector3(), s: new Spherical() };
  function cam_update() {   // controls.update(), and "סיבוב איטי" in place in mode "look"
    const c = controls;
    if (cam_drag) return;   // the look drag moves the camera itself
    if (flyAnim) {   // CAM_219 (2): a flight's pose is the flight's - no limits, no glide on its way (only aimed, as update() would)
      camera.lookAt(c.target);
      return;
    }
    const inPlace = c.autoRotate && !flyAnim && cam.mode === "look";
    if (inPlace) c.autoRotate = false;
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
  // the eye's height (1.0.2 M): ArrowUp / ArrowDown, PageUp / PageDown (liftKeys below) and Shift + wheel (ent_liftWheel) raise and lower
  // the eye and the target together; the floor under the target is the only lower limit (cam.floorY), the view's yMax the upper
  var ENT_LIFT_EASE = 120, ENT_LIFT_TAP = 160, ENT_LIFT_NOTCH = 0.3, ENT_LIFT_TOP = 400;
  var ent_lift = { up: false, down: false, upTo: 0, downTo: 0, v: 0, pending: 0 };
  function ent_liftSpeed() { return Math.max(2.5, Math.min(40, camera.position.distanceTo(controls.target) * 0.3)); }
  function ent_liftWheel(px) {   // px > 0: down (the wheel turned toward the user, as a page scrolls down)
    const sp = ent_liftSpeed();
    ent_lift.pending = Math.max(-2 * sp, Math.min(2 * sp, ent_lift.pending - px / 100 * ENT_LIFT_NOTCH * sp));
  }
  function ent_liftStep() {
    const L = ent_lift, p = camera.position, q = controls.target, now = performance.now(), dt = Math.min(50, ent_view.dt);
    if (flyAnim || ent_load.loading || cam_drag) {
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
    const lo = Math.max(isFinite(cam.floorY) ? cam.floorY + 0.35 : -Infinity, p.y + ent_view.yMin - q.y);
    const hi = Math.min(ENT_LIFT_TOP, p.y + ent_view.yMax - q.y);
    const y1 = Math.min(Math.max(p.y + dy, Math.min(lo, p.y)), Math.max(hi, p.y));   // never pushed: a limit only stops the move toward it
    const d = y1 - p.y;
    if (Math.abs(d) < Math.abs(dy) - 1e-9) {   // at a limit: the rest is dropped, and the held key's speed with it
      L.pending = 0;
      L.v = 0;
    }
    p.y += d;
    q.y += d;
    cam_decideSoon(500);
  }
  // 1.2.2 (the user: "טיול כעין הליכה עם חיצים"): ArrowUp / ArrowDown WALK - the eye and the target move together along the view's horizontal
  // direction (PageUp / PageDown keep the eye's height; Shift + arrows the tilt, 70-ui.js; the left and right arrows turn). The pace grows
  // with the distance of the view (a hall: ~10 amot a second; the mount from afar: faster).
  var ent_walk = { fwd: false, back: false, left: false, right: false, fwdTo: 0, backTo: 0, v: 0, vs: 0, dir: new Vector3(), side: new Vector3() };
  function ent_walkSpeed() { return Math.max(9, Math.min(80, camera.position.distanceTo(controls.target) * 0.35)); }
  function ent_walkStep() {
    const W = ent_walk, now = performance.now(), dt = Math.min(50, ent_view.dt);
    if (flyAnim || ent_load.loading || cam_drag) { W.v = 0; return; }
    const dir = (W.fwd || now < W.fwdTo ? 1 : 0) - (W.back || now < W.backTo ? 1 : 0);
    //@@slot ent_walkStep.sd
    const ease = 1 - Math.exp(-dt / ENT_LIFT_EASE);
    W.v += (dir * ent_walkSpeed() - W.v) * ease;
    W.vs += (sd * ent_walkSpeed() * 0.8 - W.vs) * ease;
    if (!dir && Math.abs(W.v) < 0.02) W.v = 0;
    if (!sd && Math.abs(W.vs) < 0.02) W.vs = 0;
    if (!W.v && !W.vs) {
      // WALK_SETTLE_A2 (fix-a2): standing, the eye finishes the climb or the descent it began - a tap of a key or a notch of the wheel on
      // a stair stopped it short of its height, and the next walk took that lower height afresh (CAM_219 (4)), so tap after tap up a
      // stair the eye sank into the steps. Its height over the floor is now taken afresh only when something else moved the eye (a lift,
      // a flight, a place - cam_walkFloor).
      if (ent_wm.on) cam_walkFloor(dt, true);
      return;
    }
    const p = camera.position, q = controls.target, d = W.dir.copy(q).sub(p);
    d.y = 0;
    if (d.lengthSq() < 1e-6) return;
    d.normalize();
    W.side.set(-d.z, 0, d.x).multiplyScalar(W.vs * dt / 1000);   // the right-hand side of the view
    d.multiplyScalar(W.v * dt / 1000).add(W.side);
    p.add(d);
    q.add(d);
    if (ent_wm.on) cam_walkFloor(dt);   // CAM_219 (4)
    cam_decideSoon(400);
  }
  // CAM_219 (4) (the audit: walk mode set the eye 3 amot over the floor once, when it began, and then walked level - from the court into
  // the house the eye went into the higher floor, or popped up later with the view tilted down): while one walks, the eye keeps its height
  // over the floor under it - the height it had when the walk began (3 amot, unless PageUp / PageDown changed it) - eased, a step or a
  // stair climbed and a drop descended in about a third of a second. The floor is found by a ray down from a knee's height over the feet
  // (a ledge higher than 1.2 is a wall, not a step); a new ray every 90 ms or half an amah, the easing every frame.
  // WALK_STAIRS_306 (a report sent on to the user, 20.11.2026: walking in the women's court up to the steps of Nikanor's gate, the view
  // went into the steps instead of climbing them): the ray went down from a knee over the eye's eased feet, which on a stair at a walking
  // pace lag the floor by about an amah - the knee fell under the next step's face, the ray began inside the stairs and found the floor
  // under them. Now the floor is followed along the way walked since the last ray, a third of an amah at a time, each ray from a knee over
  // the floor found before it: a stair under a knee is climbed at any pace, a ledge higher than 1.2 is still a wall. Up eases in 60 ms,
  // down in 110.
  // WALK_FLOOR_A2 (fix-a2, 22.11.2026; the user, of walk mode: "הוא נכנס לתוך המדרגה במקום לטפס עליה"; a sweep of every rise in both
  // houses, walking with the model's own loop): (1) the floor is looked for in ent_solids("floor") - the faded walls and floors too (see
  // ent_solids); (2) climbing, the eye is never more than WALK_LAG below its height over the floor - with a far target the walk is fast
  // (ent_walkSpeed: up to 28 amot a second at 80), and the 60 ms easing left the eye an amah and a half under its height on the fifteen
  // steps; (3) standing, the eye settles (WALK_SETTLE_A2, ent_walkStep); the height over the floor is taken afresh only when something
  // else moved the eye since the last step (F.y: its height after the last step); (4) the wheel and the + / − buttons and keys walk too
  // (ent_walkNudge) - until now they flew the eye straight to the point under the cursor, down into the steps.
  var WALK_LAG = 0.4;
  var cam_wf = { h: NaN, rayAt: -1e9, x: NaN, z: NaN, fy: NaN, y: NaN, o: new Vector3() };
  function cam_walkFloor(dt, standing) {
    const p = camera.position, q = controls.target, F = cam_wf, now = performance.now();
    if (Number.isFinite(F.h) && (!Number.isFinite(F.y) || Math.abs(p.y - F.y) > 0.02 || (standing && Number.isFinite(F.x) && Math.hypot(p.x - F.x, p.z - F.z) > 0.6))) F.h = NaN;   // moved by something else
    if (!Number.isFinite(F.h)) {   // a new walk: its height over the floor is taken afresh
      if (standing) return;
      F.rayAt = -1e9;
      F.x = NaN;
    }
    const moved = Number.isFinite(F.x) ? Math.hypot(p.x - F.x, p.z - F.z) : 0;
    if (standing ? moved > 0.01 : (now - F.rayAt >= 90 || moved > 0.3)) {
      F.rayAt = now;
      const ray = cam.ray || (cam.ray = new Raycaster());
      ray.camera = camera;
      ray.near = 0;
      ray.far = 400;
      const solids = ent_solids("floor");   // WALK_FLOOR_A2 (1)
      const down = (x, z, from) => {
        try {
          ray.set(F.o.set(x, from, z), CAM_DOWN);
          const h = ent_intersect.first(ray, solids);
          return h ? h.point.y : NaN;
        } catch (_) { return NaN; }
      };
      let fy = NaN;
      if (!Number.isFinite(F.x) || !Number.isFinite(F.fy)) {
        fy = down(p.x, p.z, (Number.isFinite(F.h) ? p.y - F.h : p.y - ent_wm.eye) + 1.2);
      } else {
        const n = Math.min(24, Math.max(1, Math.ceil(moved / 0.33)));
        let base = F.fy;
        fy = base;
        const ux = moved > 1e-6 ? (p.x - F.x) / moved : 0, uz = moved > 1e-6 ? (p.z - F.z) / moved : 0;
        for (let i = 1; i <= n; i++) {
          const u = i / n, sx = F.x + (p.x - F.x) * u, sz = F.z + (p.z - F.z) * u;
          let y = down(sx, sz, base + 1.2);
          // WALK_FLOOR_A2 (5): a drop is a drop only if it is wider than a foot - a ray that fell through a hair's gap (the air between
          // the altar and the head of its ramp, "ואויר מעט היה מפסיק") found a floor far below, and every ray after it began under the
          // altar's top, so the eye sank into the altar. Two more rays, a sixth of an amah before and behind, and the highest wins.
          if (Number.isFinite(y) && y < base - 0.6) {
            for (const o of [-0.17, 0.17]) {
              const y2 = down(sx + ux * o, sz + uz * o, base + 1.2);
              if (Number.isFinite(y2) && y2 > y) y = y2;
            }
          }
          if (Number.isFinite(y)) base = fy = y;
        }
      }
      F.x = p.x;
      F.z = p.z;
      F.fy = fy;
      if (!Number.isFinite(F.h) && Number.isFinite(fy)) F.h = Math.max(0.5, p.y - fy);
    }
    if (!Number.isFinite(F.fy) || !Number.isFinite(F.h)) { F.y = p.y; return; }
    const want = F.fy + F.h, dy = want - p.y;
    if (Math.abs(dy) < 0.003) { F.y = p.y; return; }
    let s = dy * (1 - Math.exp(-Math.max(1, dt) / (dy > 0 ? 60 : 110)));
    if (dy > 0 && p.y + s < want - WALK_LAG) s = want - WALK_LAG - p.y;   // WALK_FLOOR_A2 (2)
    p.y += s;
    q.y += s;
    F.y = p.y;
  }
  // WALK_FLOOR_A2 (4): a short walk forward (k > 0) or back - a wheel notch (amt by its size) or a press of + / − (70-ui.js zoomBy)
  function ent_walkNudge(k, amt) {
    const W = ent_walk, now = performance.now(), a = k > 0 ? "fwdTo" : "backTo", b = k > 0 ? "backTo" : "fwdTo";
    W[b] = 0;
    W[a] = Math.min(now + 900, Math.max(W[a], now) + ENT_LIFT_TAP * (amt > 0 ? amt : 1));
    if (flyAnim) cam_flyStop();
  }
  (function liftKeys() {
    const KEYS = { ArrowUp: 1, PageUp: 1, ArrowDown: -1, PageDown: -1 };
    //@@slot free
    window.addEventListener("keydown", (e) => {
      const f = WK[e.key];
      if (!f || !ent_wm.on || e.ctrlKey || e.altKey || e.metaKey || ent_load.loading || !free(e.target)) return;
      e.preventDefault();
      if (flyAnim) cam_flyStop();   // CAM_219 (2): a key in a flight ends it - the walk is the user's at once
      ent_walk[f] = true;
    }, true);
    window.addEventListener("keyup", (e) => { const f = WK[e.key]; if (f) ent_walk[f] = false; }, true);
    //@@slot free-2
    window.addEventListener("keydown", (e) => {
      const k = KEYS[e.key];
      if (!k || e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey || ent_load.loading) return;
      if (e.shiftKey && e.key.indexOf("Arrow") === 0) return;   // Shift + ArrowUp / ArrowDown: the tilt (70-ui.js)
      if (!free(document.activeElement) || !free(e.target)) return;
      const cf = document.getElementById("tm-confirm");   // the cloud's dialog (70-ui.js) is open: its keys
      if (cf && cf.style.display === "flex") return;
      e.preventDefault();
      if (flyAnim) cam_flyStop();   // CAM_219 (2)
      const walk = e.key.indexOf("Arrow") === 0;   // 1.2.2: the arrows walk, PageUp / PageDown lift
      const S = walk ? ent_walk : ent_lift, a = walk ? "fwd" : "up", b = walk ? "back" : "down";
      if (k > 0) {
        S[a] = true;
        if (!e.repeat) S[a + "To"] = performance.now() + ENT_LIFT_TAP;
      } else {
        S[b] = true;
        if (!e.repeat) S[b + "To"] = performance.now() + ENT_LIFT_TAP;
      }
    }, true);
    window.addEventListener("keyup", (e) => {
      const k = KEYS[e.key];
      if (!k) return;
      const walk = e.key.indexOf("Arrow") === 0;
      if (walk) { if (k > 0) ent_walk.fwd = false; else ent_walk.back = false; }
      else { if (k > 0) ent_lift.up = false; else ent_lift.down = false; }
    }, true);
    window.addEventListener("blur", () => { ent_lift.up = ent_lift.down = false; ent_walk.fwd = ent_walk.back = ent_walk.left = ent_walk.right = false; });
  })();
  //@@slot after-cam_walkFloor-note
  var ent_wm = { on: false, locked: false, eye: 3 };
  function ent_walkModeSet(on) {
    on = !!on;
    if (on === ent_wm.on) return;
    ent_wm.on = on;
    const el = renderer.domElement;
    if (on) {
      const p = camera.position, q = controls.target;
      const fy = cam_floorY(p, ent_solids("floor"));   // WALK_FLOOR_A2 (1)
      cam_wf.h = NaN;
      const v = cam.tmp.copy(q).sub(p);
      v.y = 0;
      if (v.lengthSq() < 1e-6) v.set(1, 0, 0);
      v.normalize();
      p.y = (Number.isFinite(fy) ? fy : Math.max(0, p.y - 6)) + ent_wm.eye;
      q.copy(p).addScaledVector(v, 12);
      controls.update();
      cam_decide();
      try { if (el.requestPointerLock) { const r = el.requestPointerLock(); if (r && r.catch) r.catch(() => {}); } } catch (_) {}
    } else {
      try { if (document.pointerLockElement === el && document.exitPointerLock) document.exitPointerLock(); } catch (_) {}
      ent_walk.fwd = ent_walk.back = ent_walk.left = ent_walk.right = false;
      cam.lookLock = false;
      cam_decide();
    }
    try { document.documentElement.classList.toggle("tm-walk", on); } catch (_) {}
    if (ctx && ctx.shared && ctx.shared.walkMode) ctx.shared.walkMode.on = on;
    //@@slot ent_walkModeSet
  }
  document.addEventListener("pointerlockchange", () => {
    ent_wm.locked = document.pointerLockElement === renderer.domElement;
  });
  document.addEventListener("mousemove", (e) => {
    if (!ent_wm.on || !ent_wm.locked || cam_drag || flyAnim || ent_load.loading) return;
    const k = 0.0022;
    cam.s.setFromVector3(cam.tmp.copy(controls.target).sub(camera.position));
    if (!(cam.s.radius > 0)) cam.s.radius = 10;
    cam.s.theta -= e.movementX * k;
    cam.s.phi = Math.max(0.03, Math.min(ENT_POLAR, cam.s.phi + e.movementY * k));
    controls.target.copy(camera.position).add(cam.tmp.setFromSpherical(cam.s));
    camera.lookAt(controls.target);
    cam_decideSoon(400);
  });
  //@@slot after-ent_walkModeSet-note
  var ent_sec = { on: false, axis: "z", v: 0, plane: new Plane(new Vector3(0, 0, -1), 0), sides: new Map() };
  function ent_sectionMaterial(m) {
    if (!m || m.isShaderMaterial || m.isSpriteMaterial) return;
    const P = ent_sec.plane;
    if (m.clippingPlanes && m.clippingPlanes.length === 1 && m.clippingPlanes[0] === P) return;
    //@@slot ent_sectionApply-note-2
    if (!ent_sec.sides.has(m)) ent_sec.sides.set(m, m.clippingPlanes && m.clippingPlanes.length ? FrontSide : m.side);
    m.clippingPlanes = [P];
    m.clipShadows = true;
    m.side = DoubleSide;
    m.needsUpdate = true;
  }
  function ent_sectionObject(o) {
    //@@slot ent_sectionApply-note
    if (!(o.isMesh || o.isLine || o.isPoints) || !o.material) return;
    if (Array.isArray(o.material)) { for (const m of o.material) ent_sectionMaterial(m); }
    else ent_sectionMaterial(o.material);
  }
  function ent_sectionApply() {
    if (!ent_sec.on || !ctx || !ctx.root) return;
    ctx.root.traverse(ent_sectionObject);
  }
  function ent_sectionSet(on, axis, v) {
    on = !!on;
    if (axis === "x" || axis === "z" || axis === "y") ent_sec.axis = axis;
    if (Number.isFinite(v)) ent_sec.v = v;
    const P = ent_sec.plane;
    //@@slot ent_sectionSet
    if (on !== ent_sec.on) {
      ent_sec.on = on;
      renderer.localClippingEnabled = on || renderer.localClippingEnabled;
      if (on) ent_sectionApply();
      else {
        for (const [m, side] of ent_sec.sides) {
          if (m.clippingPlanes && m.clippingPlanes.indexOf(P) >= 0) m.clippingPlanes = null;
          m.clipShadows = false;
          m.side = side;
          m.needsUpdate = true;
        }
        ent_sec.sides.clear();
      }
    }
    try { document.documentElement.classList.toggle("tm-section", on); } catch (_) {}
    if (ctx && ctx.shared && ctx.shared.section) Object.assign(ctx.shared.section, { on: ent_sec.on, axis: ent_sec.axis, v: ent_sec.v });
    //@@slot ent_sectionSet-2
  }
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
  // 1.9.2 / 1.3.4: a flight's eye nearer the zenith of its target than ENT_MIN_POLAR is tilted to it - the same distance, the same side
  // (the small offset that set the picture's up), or from the south when there is none
  function ent_tiltFromZenith(p, q) {
    const d = p.clone().sub(q), r = d.length();
    if (!(r > 1e-6)) return p;
    const h = Math.hypot(d.x, d.z), phi = Math.atan2(h, d.y);
    // CAM_219 (2): and from the nadir too (OrbitControls' maxPolarAngle): the first update() after a landing changes nothing
    const lim = d.y > 0 ? ENT_MIN_POLAR : ENT_POLAR;
    if (d.y > 0 ? phi >= lim - 1e-4 : phi <= lim + 1e-4) return p;
    const ux = h > 1e-3 ? d.x / h : 0, uz = h > 1e-3 ? d.z / h : 1;
    const nh = r * Math.sin(lim), ny = r * Math.cos(lim);
    return new Vector3(q.x + ux * nh, q.y + ny, q.z + uz * nh);
  }
  function flyTo(pos, target, dur = 1600) {
    cam_killInertia();   // CAM_219 (2): the glide of a drag just before is spent where it stands
    cam_lookEnd();   // 1.2.0
    cam.lookLock = false;   // a flight decides afresh (cam_decide at its end)
    ent_zoom.pending = 0;   // 1.0.1-K: a fly cancels a smooth zoom that is still running
    ent_viewInclude(target);   // 1.0.1-L (L.87): a flight's target is always inside the limits of the view
    flyAnim = {
      t0: performance.now(),
      dur,
      p0: camera.position.clone(),
      p1: ent_tiltFromZenith(new Vector3(...pos), new Vector3(...target)),   // 1.9.2 / 1.3.4: never straight down
      c0: controls.target.clone(),
      c1: new Vector3(...target)
    };
    // 1.0.4: a target close to the flight's eye is a thing to orbit round (ent_passOn), if the flight ends under a roof (the animation loop)
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
  var ent_zoom = { pending: 0, held: false, off: new Vector3(), anchor: null, aT: 0, ax: 0, ay: 0, P: new Vector3(), O: new Vector3(), cur: 0 };
  // CURSOR_211 (the user, 14.11.2026: "עוד לא הוספת לי סמן כפי שדיברנו"; 12.11.2026: "יהיה אפשר לעמוד עם סמן (בצורת זכוכית מגדלת)"):
  // the cursor over the model is a magnifying glass at all times - a style rule on the canvas; a label's hand ("pointer") still wins
  try {
    const st = document.createElement("style");
    st.textContent = "canvas{cursor:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'><circle cx='12' cy='12' r='8' fill='rgba(255,255,255,0.22)' stroke='%23000' stroke-width='3.4'/><circle cx='12' cy='12' r='8' fill='none' stroke='%23f3dc9a' stroke-width='1.7'/><line x1='18' y1='18' x2='27' y2='27' stroke='%23000' stroke-width='5.4' stroke-linecap='round'/><line x1='18' y1='18' x2='27' y2='27' stroke='%23c9a84c' stroke-width='3' stroke-linecap='round'/><path d='M8.2 12h7.6M12 8.2v7.6' stroke='%23000' stroke-width='1.7'/></svg>\") 12 12, zoom-in}";
    document.head.appendChild(st);
  } catch (_) {}
  // ZOOM_CURSOR_207 (the user, 12.11.2026 20:23: "המקום עליו עומד הסמן - הוא זה שיוגדל בזום"): the point of the model under the cursor -
  // a ray from the cursor (x, y: the canvas's own pixels); the first solid that is seen (not hidden, not see-through, not a sprite, not the
  // sky); over the sky the point of the ray at the target's distance
  var ent_zoomRay = null;
  function ent_zoomAnchor(el, cx, cy) {
    try {
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return null;
      const ray = ent_zoomRay || (ent_zoomRay = new Raycaster());
      ray.setFromCamera(new Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1), camera);
      ray.camera = camera;
      ray.near = 0.3;
      ray.far = 3000;
      // Filter before raycasting: the hidden demonstrations/alternate readings and the
      // sky used to be intersected in full, only to have all their hits thrown away.
      const hit = ent_intersect.first(ray, ent_pickable(scene));
      if (hit) return hit.point.clone();
      const d = camera.position.distanceTo(controls.target);
      return ray.ray.origin.clone().addScaledVector(ray.ray.direction, Math.max(4, d));
    } catch (_) {
      return null;
    }
  }
  (function wheelZoom(el) {
    window.__zoomQA = { anchor: () => (ent_zoom.anchor ? ent_zoom.anchor.toArray() : null), at: (x, y) => { const p = ent_zoomAnchor(el, x, y); return p ? p.toArray() : null; } };   // ZOOM_CURSOR_207 (tests)
    const release = () => {
      if (ent_zoom.held) {
        ent_zoom.held = false;
        if (controls) controls.enableZoom = true;
      }
    };
    el.addEventListener("wheel", (e) => {
      if (ent_load.loading || !controls || controls.enabled === false) return;
      // WALK_FLOOR_A2 (4): in walk mode the wheel walks (forward when turned away from the user), and the eye climbs and descends with
      // the floors as with the keys; Shift + wheel still lifts (below)
      if (ent_wm.on && !e.shiftKey) {
        e.preventDefault();
        if (!ent_zoom.held) {
          ent_zoom.held = true;
          controls.enableZoom = false;
        }
        const dw = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : 0;
        if (dw && isFinite(dw)) ent_walkNudge(dw < 0 ? 1 : -1, Math.min(1.5, Math.abs(dw) * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 800 : 1) / 100));
        return;
      }
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
      // PINCH_FLIP_208 (the user, 12.11.2026 22:56: "בעכבר של מחשב נייד, הצביטה... הפוכה, כשפותחים את האצבעות התצוגה רחוקה יותר"): on his
      // laptop's touchpad the pinch came the other way round - so every Ctrl + wheel (his touchpad sends the pinch so) now zooms the other way
      if (e.ctrlKey) k = small ? -dy / 100 : -Math.sign(dy) * 0.0513;   // pinch: follow the fingers; Ctrl + notch: 5% (= ln(1 / 0.95))
      else if (small) k = dy * 0.001;                                   // two-finger slide on a touchpad
      else k = Math.sign(dy) * 0.0513 * Math.max(0.3, Math.min(3, Math.abs(dy) / 100));   // a mouse notch: 5% as OrbitControls' (ZOOM_CURSOR_207: by this handler everywhere - to the cursor)
      // ZOOM_CURSOR_207: the point under the cursor, once a burst (a new one after a quarter second, or when the cursor moved)
      const now = performance.now();
      if (!ent_zoom.anchor || now - ent_zoom.aT > 250 || Math.abs(e.clientX - ent_zoom.ax) + Math.abs(e.clientY - ent_zoom.ay) > 6) {
        ent_zoom.anchor = ent_zoomAnchor(el, e.clientX, e.clientY);
        ent_zoom.ax = e.clientX;
        ent_zoom.ay = e.clientY;
      }
      ent_zoom.aT = now;
      el.style.cursor = k < 0 ? "zoom-in" : "zoom-out";   // the magnifying glass while the wheel turns

      clearTimeout(ent_zoom.cur);
      ent_zoom.cur = setTimeout(() => { el.style.cursor = ""; }, 450);
      // WHEEL_ROOFED_205 (the user's recording, 12.11.2026: "ריצה בגלילה" - under a roof, with the target far, a notch was 5% of a long way:
      // ten amot and more, through walls and floors): under a roof no single wheel event moves the eye more than two amot
      if (cam.roofed) {
        const L0 = ent_zoom.anchor ? camera.position.distanceTo(ent_zoom.anchor) : camera.position.distanceTo(controls.target);   // ZOOM_CURSOR_207: to the point
        if (L0 > 0 && isFinite(L0)) k = k < 0 ? Math.max(k, Math.log(1 - Math.min(0.9, 2 / L0))) : Math.min(k, Math.log(1 + 2 / L0));
      }
      e.preventDefault();
      ent_zoom.pending = Math.max(-4, Math.min(4, ent_zoom.pending + k));
      if (cam.roofed) {   // WHEEL_ROOFED_205 b: what is still to travel under a roof is never more than 8 amot
        const L1 = ent_zoom.anchor ? camera.position.distanceTo(ent_zoom.anchor) : camera.position.distanceTo(controls.target);   // ZOOM_CURSOR_207
        if (L1 > 0 && isFinite(L1)) ent_zoom.pending = Math.max(Math.log(1 - Math.min(0.9, 8 / L1)), Math.min(Math.log(1 + 8 / L1), ent_zoom.pending));
      }
      if (!ent_zoom.held) {
        ent_zoom.held = true;
        controls.enableZoom = false;
      }
    }, { capture: true, passive: false });
    // ENTER_ZOOM_211 (the user, 15.11.2026: "הסמן לא עושה כלום אמנם רואים אותו אבל הוא לא מגדיל את המקום (צריך שבלחיצה על אנטר יגדיל
    // את המקום שנמצא עליו)"; his recording: the magnifying glass went from place to place in the Holy and nothing grew): Enter brings
    // the eye half the way to the point of the model under the cursor - Shift + Enter takes it back, twice as far - and a double
    // click does as Enter. While the cursor is over the picture the key is the picture's, whichever button the last click left the
    // focus on (a field one types in keeps its own Enter, and so do the open dialogs). Never nearer than six amot to the point: the
    // wheel's own limit is two and a half, and at a point of a floor the picture went white (the end of his recording).
    const curAt = { x: 0, y: 0, over: false };
    el.addEventListener("pointermove", (e) => { curAt.x = e.clientX; curAt.y = e.clientY; curAt.over = true; }, { passive: true });
    el.addEventListener("pointerenter", (e) => { curAt.x = e.clientX; curAt.y = e.clientY; curAt.over = true; }, { passive: true });
    el.addEventListener("pointerleave", () => { curAt.over = false; }, { passive: true });
    const zoomAtCursor = (x, y, out) => {
      if (ent_load.loading || !controls || controls.enabled === false || flyAnim) return false;
      const P = ent_zoomAnchor(el, x, y);
      const Lp = P ? camera.position.distanceTo(P) : 0;
      if (!(Lp > 0) || !isFinite(Lp)) return false;
      const NEAR = 6;
      if (!out && Lp <= NEAR + 0.05) return true;   // there already (the key is still the picture's)
      ent_zoom.anchor = P;
      ent_zoom.ax = x;
      ent_zoom.ay = y;
      ent_zoom.aT = performance.now();
      ent_zoom.pending = out ? Math.log(2) : Math.log(Math.max(0.5, NEAR / Lp));
      return true;
    };
    window.__zoomQA.enter = (x, y, out) => zoomAtCursor(x, y, !!out);   // (tests)
    window.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || e.ctrlKey || e.altKey || e.metaKey || e.defaultPrevented || e.repeat || !curAt.over) return;
      const a = document.activeElement, tag = a && a.tagName ? String(a.tagName).toUpperCase() : "";
      if (tag === "TEXTAREA" || tag === "SELECT" || (a && a.isContentEditable) ||
        (tag === "INPUT" && !/^(checkbox|radio|button|submit|reset|range|color)$/i.test(String(a.type || "text")))) return;
      for (const id of ["tm-confirm", "tm-help", "tm-news"]) { const d = document.getElementById(id); if (d && d.style.display === "flex") return; }
      if (document.querySelector("dialog[open]")) return;
      if (zoomAtCursor(curAt.x, curAt.y, e.shiftKey)) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    el.addEventListener("dblclick", (e) => { if (zoomAtCursor(e.clientX, e.clientY, e.shiftKey)) e.preventDefault(); });
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
      ent_zoom.anchor = null;   // ZOOM_CURSOR_207
      return;
    }
    const p = ent_zoom.pending;
    if (Math.abs(p) < 1e-4) {
      ent_zoom.pending = 0;
      return;
    }
    // ZOOM_CURSOR_207: to the point under the cursor - the eye and the target scaled toward it by one ratio (it stays under the cursor)
    if (ent_zoom.anchor) {
      const P = ent_zoom.anchor;
      let step = Math.abs(p) < 2e-3 ? p : p * Math.max(0.35, 1 - Math.exp(-ent_view.dt / 40));
      const Lp = camera.position.distanceTo(P), L = camera.position.distanceTo(controls.target);
      if (!(Lp > 0) || !isFinite(Lp) || !(L > 0) || !isFinite(L)) {
        ent_zoom.pending = 0;
        ent_zoom.anchor = null;
        return;
      }
      if (cam.roofed) {   // WHEEL_ROOFED_205 b, to the point: 20 amot a second at most
        const lim = 20 * Math.min(100, Math.max(1, ent_view.dt || 16)) / 1000, d = Lp * (Math.exp(step) - 1);
        if (Math.abs(d) > lim) step = Math.log(Math.max(0.05, 1 + Math.sign(d) * lim / Lp));
      }
      let s = Math.exp(step);
      const DMIN = cam.roofed ? 2 : 2.5;   // never into the thing itself (under a roof 2: cam_keepInside's own margin is not met)
      if (s < 1 && Lp * s < DMIN) {
        if (Lp <= DMIN + 1e-3) { ent_zoom.pending = 0; return; }
        s = DMIN / Lp;
      }
      const L2 = Math.min(controls.maxDistance || 2200, Math.max(controls.minDistance || 2, L * s));
      s = L2 / L;
      camera.position.sub(P).multiplyScalar(s).add(P);
      controls.target.sub(P).multiplyScalar(s).add(P);
      ent_zoom.pending = Math.abs(Math.log(s) - step) < 1e-6 ? p - step : 0;   // at a limit: drop the rest
      return;
    }
    // 1.0.1-L (L.87): eased in time, not per frame (at a low frame rate 35% a frame ran on for a second after the fingers stopped)
    let step = Math.abs(p) < 2e-3 ? p : p * Math.max(0.35, 1 - Math.exp(-ent_view.dt / 40));
    const off = ent_zoom.off.copy(camera.position).sub(controls.target);
    const L = off.length();
    if (!(L > 0) || !isFinite(L)) {
      ent_zoom.pending = 0;
      return;
    }
    if (cam.roofed) {   // WHEEL_ROOFED_205 b: under a roof the eye goes 20 amot a second at most
      const lim = 20 * Math.min(100, Math.max(1, ent_view.dt || 16)) / 1000, d = L * (Math.exp(step) - 1);
      if (Math.abs(d) > lim) step = Math.log(Math.max(0.05, 1 + Math.sign(d) * lim / L));
    }
    const L2 = Math.min(controls.maxDistance || 2200, Math.max(controls.minDistance || 2, L * Math.exp(step)));
    camera.position.copy(controls.target).add(off.setLength(L2));
    ent_zoom.pending = L2 === L * Math.exp(step) ? p - step : 0;   // at a limit: drop the rest
  }
  //@@slot ent_view
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
    shared: {
      //@@slot set
      // GI_OFF_303 (the user, 18.11.2026, over a picture of the heichal: "טכנולוגיית האור החוזר אתה מבטל עכשיו! לא לזה התכוונתי, אא\"כ
      // זה באג"; "תראה את העמעום מה זה האפור הזה?"): with both light rows on, the bounce's own ambient occlusion (radius 12 amot, 2
      // slices of 6 steps a pixel, no filter over time) took the place of the soft corner shadow, and every floor and wall came out
      // dimmed grey in blotches, the bounced light itself speckled - not a slip of the code but the method at a cost a weak computer
      // can bear. The row "אור חוזר מהקירות" is gone (giReady false: 70-ui.js builds no row and reads no stored "tm.hq.gi") and the
      // bounce is never drawn, whatever is asked; "צל רך בפינות" (GTAO) stays. The GI code stays in 85-hq.js, idle.
      hq: { get ao() { return ent_hq.S.ao; }, get gi() { return false; }, giReady: false, set: (aoOn) => ent_hq.set(aoOn, false) }   // HQ_302; GI_OFF_303
    },
    flyTo,
    camIndoors: cam_indoors,   // 1.2.0: mode "look" - 70-ui.js's nav buttons and keys turn in place
    camPass: cam_pass,         // 1.2.0: indoors the fade loop of 70-ui.js lets the eye see through the buildings' walls and ceilings
    camPassHit: cam_passHit,   //   (every building surface but a floor at or under the target)
    camMode: () => cam.mode,
    camDecide: cam_decide,
    camFlying: () => !!flyAnim,      // CAM_219 (2): 70-ui.js's compass turn gives way to a flight
    camFlyStop: () => cam_flyStop(), // CAM_219 (2): the nav buttons and keys end a flight, as a press on the model does
    camInside: { get: () => cam.inside, set: (on) => { cam.inside = !!on; } },   // "סיבוב בתוך הבית בלבד" (70-ui.js)
    camera,
    controls,
    renderer
  };
  //@@slot after-root
  if (ctx.shared.walkMode) ctx.shared.walkMode.nudge = ent_walkNudge;   // WALK_FLOOR_A2 (4): 70-ui.js zoomBy, in walk mode
  if (!ctx.shared.floorY) ctx.shared.floorY = (x, y, z) => cam_floorY({ x, y, z });   // SCALE_FIG_A2: the floor under a point, in both houses (the Second's had it)
  ctx.shared.camUnder = (list) => {
    if (!list || !list.length) return false;
    const p = camera.position;
    if (!list.__boxes || list.__boxes.n !== list.length) {
      const bs = [];
      for (const o of list) { try { if (o) bs.push(new Box3().setFromObject(o)); } catch (_) {} }
      bs.n = list.length;
      list.__boxes = bs;
    }
    // ROOF_HOLD_211 (the user's recording, 15.11.2026: "נסגר מיד, לא מציג" - Beit HaMoked's dome came back while he was still looking
    // at the room from outside): a roof also stays off while one LOOKS at what is under it from near by - the view's target is inside
    // the piece's plan and under its top, the eye within 150 of it. Flying to another place still puts it back at once (closeAuto).
    const q = controls ? controls.target : null, look = !!q && p.distanceTo(q) < 150;
    for (const b of list.__boxes) {
      if (b.isEmpty()) continue;
      if (p.x > b.min.x - 1 && p.x < b.max.x + 1 && p.z > b.min.z - 1 && p.z < b.max.z + 1 && p.y < b.max.y + 0.5) return true;
      if (look && q.x > b.min.x - 1 && q.x < b.max.x + 1 && q.z > b.min.z - 1 && q.z < b.max.z + 1 && q.y < b.max.y + 0.5) return true;
    }
    return false;
  };
  ctx.shared.openFor = (id, ms) => {
    const b = (ctx.shared.modelButtons || []).find((x) => x && x.id === id);
    if (!b) return false;
    const T = ctx.shared.__pillT || (ctx.shared.__pillT = {});
    if (!b.get()) { b.set(true); T[id] = T[id] || -1; }
    if (!T[id]) return true;   // opened by the user himself: no timer
    if (T[id] > 0) clearTimeout(T[id]);
    const close = () => {
      let again = false;
      try {
        if (ctx.shared.__autoHold && b.get()) again = true;   // the presentation holds it until the slide is left
        else if (b.get() && typeof b.under === "function" && b.under()) again = true;
        else if (b.get()) b.set(false);
      } catch (_) {}
      T[id] = again ? setTimeout(close, 4000) : 0;
    };
    T[id] = setTimeout(close, ms || 15000);
    return true;
  };
  //@@slot after-root-note
  ctx.shared.sectionFor = (axis, v, ms) => {
    const S = ctx.shared.__secT || (ctx.shared.__secT = { t: 0, axis: "z", v: 0 });
    if (S.t) clearTimeout(S.t);
    ent_sectionSet(true, axis, v);
    S.axis = ent_sec.axis;
    S.v = ent_sec.v;
    if (ctx.shared.sectionPaint) try { ctx.shared.sectionPaint(); } catch (_) {}
    const close = () => {
      // SECTION_HOLD_205: while the eye stands in the half that the section cut away, the section stays (the wall would come back over the eye)
      const inCut = ent_sec.on && ent_sec.axis === S.axis && ent_sec.v === S.v && camera && camera.position[S.axis] > S.v;
      if (ctx.shared.__autoHold || inCut) { S.t = setTimeout(close, 2000); return; }
      S.t = 0;
      if (ent_sec.on && ent_sec.axis === S.axis && ent_sec.v === S.v) {
        ent_sectionSet(false, S.axis, S.v);
        if (ctx.shared.sectionPaint) try { ctx.shared.sectionPaint(); } catch (_) {}
      }
    };
    S.t = setTimeout(close, ms || 15000);
    return true;
  };
  // FADE_HOLD_211 (the user, 15.11.2026, the row of the eastern wall's height: "החומות משתקפות, ואי אפשר לראות את גובה החומה אם היא
  // שקופה"): a reading whose SUBJECT is a wall itself shows it whole - its fly sets the hold at its target (fadeHold.set([x, y, z]));
  // the fade loop of 70-ui.js fades nothing while the hold is on. It ends when another place or reading is chosen (closeAuto), or
  // when the view's target has gone 30 amot away from it (the user went on to look at something else).
  ctx.shared.fadeHold = { on: false, arrived: false, t0: 0, at: new Vector3(),
    set(t) { if (Array.isArray(t) && t.length >= 3 && isFinite(t[0] + t[1] + t[2])) { this.at.set(t[0], t[1], t[2]); this.arrived = false; this.t0 = performance.now(); this.on = true; } else this.on = false; },
    held() {
      if (!this.on || !controls) return false;
      const d = controls.target.distanceTo(this.at);
      if (!this.arrived) {   // the flight to it: until the target is there (or 4 s: a flight that ends a little elsewhere)
        if (d < 2 || performance.now() - this.t0 > 4000) { this.arrived = true; this.at.copy(controls.target); }
        return true;
      }
      if (d > 30) { this.on = false; return false; }
      return true;
    } };
  ctx.shared.closeAuto = () => {
    try { ctx.shared.fadeHold.on = false; } catch (_) {}
    const T = ctx.shared.__pillT;
    if (T) {
      for (const id of Object.keys(T)) {
        if (!(T[id] > 0)) continue;
        clearTimeout(T[id]);
        T[id] = 0;
        const b = (ctx.shared.modelButtons || []).find((x) => x && x.id === id);
        try { if (b && b.get()) b.set(false); } catch (_) {}
      }
    }
    const S = ctx.shared.__secT;
    if (S && S.t) {
      clearTimeout(S.t);
      S.t = 0;
      if (ent_sec.on && ent_sec.axis === S.axis && ent_sec.v === S.v) {
        ent_sectionSet(false, S.axis, S.v);
        if (ctx.shared.sectionPaint) try { ctx.shared.sectionPaint(); } catch (_) {}
      }
    }
  };
  ctx.shared.holdAuto = (on) => { ctx.shared.__autoHold = !!on; };
  // 1.9.2 / 1.3.4 (the user: "בלחיצה על כל מתג הוא חייב לבטל את ההדגמות ולעבור לפקודת המתג"): every demonstration registers itself in
  // ctx.shared.demoStops ({ id, running(), stop() }); a switch - a chip of the opinions table, a place, a button of the panel, of the
  // navigation box or of the top bar - first stops whatever runs, then does its own thing. The pills call stopDemos(their id) themselves
  // (70-ui.js), so that a demonstration's own pill still toggles it; a pill marked keepDemos (the throne's mute) leaves the scene running.
  // ctx.shared.demoSlow: every demonstration runs at 1.5 of its written seconds (the user: "כל ההדגמות יותר איטיות")
  ctx.shared.demoSlow = ctx.shared.demoSlow || 1.5;
  ctx.shared.demoStops = ctx.shared.demoStops || [];
  ctx.shared.stopDemos = (except) => {
    let any = false;
    for (const d of ctx.shared.demoStops) {
      if (except && d.id === except) continue;
      try { if (d.running()) { d.stop(); any = true; } } catch (_) {}
    }
    // SOUNDS_300: what a stopped demonstration sounds stops with it (a one-shot already playing - the gate, the wheel - is cut, not left to end)
    if (any && typeof ctx.shared.sfxCut === "function") ctx.shared.sfxCut();
    // DEMO_CLOCK_N1: the speed chosen for a demonstration is for it alone - with none left running the clock goes back to the real time
    if (tm_clock.rate !== 1) { let live = false; for (const d of ctx.shared.demoStops) { try { if (d.running()) live = true; } catch (_) {} } if (!live) tm_clock.setRate(1); }
  };
  // DEMO_PAUSE_207 (the user, 12.11.2026 20:34: "יש סיכוי להשהות"): a demonstration may pause - its entry has pause(), resume(), paused()
  // (and restart()). A press on the model pauses it; the bar below resumes it from the same second, starts it again or ends it.
  (function demoPause() {
    const fnc = (f) => typeof f === "function";
    const tourOn = () => { const T = ctx.shared.tour; try { const s = T && fnc(T.state) ? T.state() : null; return !!(s && s.running); } catch (_) { return false; } };
    const live = () => ctx.shared.demoStops.filter((d) => { try { return fnc(d.pause) && d.running(); } catch (_) { return false; } });
    const isPaused = (d) => { try { return fnc(d.paused) && !!d.paused(); } catch (_) { return false; } };
    let el = null, bP = null, bR = null, bS = null, bBk = null, bFw = null, bSl = null, bFa = null, lR = null, shown = false;
    const RATES = [0.5, 0.75, 1, 1.5, 2, 3], E = { v: 0, last: 0 };   // DEMO_BAR_N1: the speeds; E - the time a demonstration with no walk has run (the clock's ms), to keep "אחורה" from going before its start
    const press = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); try { fn(); } catch (_) {} paint(); };
    const mk = (txt, title, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = txt;
      b.title = title;
      Object.assign(b.style, { background: "rgba(201,168,76,0.16)", color: "#f4ead0", border: "1px solid rgba(201,168,76,0.55)", borderRadius: "8px",
        padding: "3px 12px", font: "0.875rem/1.4 var(--font-main, inherit)", cursor: "pointer" });
      b.addEventListener("click", press(fn));
      return b;
    };
    const build = () => {
      el = document.createElement("div");
      el.id = "tm-dpause";
      el.setAttribute("dir", "rtl");
      // DPAUSE_LEFT_300 (the user, 18.11.2026: "הכפתור הזה לא במרכז, הוא מסתיר ראות, שים אותו בצד שמאל מעל המצפן"): no longer in the
      // middle of the picture - at the left, over the compass and the nav row (place(), below)
      // DEMO_BAR_N1: two rows - the pause, the start again and the stop; below them the stages and the speed
      Object.assign(el.style, { position: "fixed", left: "12px", bottom: "110px", display: "none", flexDirection: "column", gap: "6px",
        background: "rgba(14,17,28,0.82)", padding: "6px 10px", borderRadius: "10px", zIndex: "41", boxShadow: "0 2px 10px rgba(0,0,0,0.35)" });
      const row1 = document.createElement("div"), row2 = document.createElement("div");
      for (const r of [row1, row2]) Object.assign(r.style, { display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" });
      bP = mk("⏸ השהה", "השהיית ההדגמה. אפשר להסתובב ולהסתכל, ואחר כך להמשיך מאותו רגע.", () => (live().some((d) => !isPaused(d)) ? ctx.shared.demoPause() : ctx.shared.demoResume()));
      bR = mk("⟲ מההתחלה", "מתחיל את ההדגמה מההתחלה.", () => { for (const d of live()) if (fnc(d.restart)) { d.restart(); return; } });
      bS = mk("■ עצור", "עוצר את ההדגמה.", () => ctx.shared.stopDemos());
      row1.appendChild(bP); row1.appendChild(bR); row1.appendChild(bS);
      // DEMO_BAR_N1 (the user, 23.11.2026: "בכל המצגות: קדימה ואחורה, מהר יותר ולאט יותר"): a stage forward or back (a stage is a caption of the walk; a
      // demonstration with no walk - a step of 6 written seconds), and the speed of every clock of the demonstration (tm_clock, 00-lib.js)
      bBk = mk("אחורה", "חוזר להתחלת השלב שבו ההדגמה נמצאת (שלב הוא כיתוב אחד); ואם השלב התחיל זה עתה - לשלב שלפניו.", () => skip(-1));
      bFw = mk("קדימה", "מדלג אל השלב הבא של ההדגמה.", () => skip(1));
      bSl = mk("לאט יותר", "מאט את ההדגמה. הקולות שנקבעו מראש נפסקים.", () => speed(-1));
      bFa = mk("מהר יותר", "מאיץ את ההדגמה. הקולות שנקבעו מראש נפסקים.", () => speed(1));
      lR = document.createElement("span");
      Object.assign(lR.style, { color: "#f4ead0", font: "0.8125rem/1.4 var(--font-main, inherit)", minWidth: "4.5em", textAlign: "center" });
      row2.appendChild(bBk); row2.appendChild(bFw); row2.appendChild(bSl); row2.appendChild(lR); row2.appendChild(bFa);
      el.appendChild(row1); el.appendChild(row2);
      document.body.appendChild(el);
    };
    // DPAUSE_LEFT_300: over whichever is higher, the compass or the nav row, 8 px above it; its left edge with the compass's
    const place = () => {
      try {
        const c = document.getElementById("tm-compass"), n = document.getElementById("tm-nav");
        let top = window.innerHeight - 102, left = 12;
        for (const x of [c, n]) {
          if (!x) continue;
          const r = x.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) top = Math.min(top, r.top);
        }
        if (c) { const r = c.getBoundingClientRect(); if (r.width > 0) left = Math.max(4, Math.round(r.left)); }
        let bottom = Math.max(8, Math.round(window.innerHeight - top + 8));
        // DPAUSE_CARD_S1 (scan 1, finding 6): an open explanation card (#tm-xcard - a demonstration started from the group "הדגמות" opens
        // its card at the left) is not covered: the bar moves to the right of the card, or, where there is no room there (a narrow window,
        // the phone's bottom sheet), above it - and above the demonstration's caption, if it would lie on it there. Until now it sat on the
        // card's foot, over its "למקור" tabs.
        const xc = document.getElementById("tm-xcard");
        const seen = (e) => { if (!e) return false; const cs = getComputedStyle(e); return cs.display !== "none" && cs.visibility !== "hidden"; };
        if (seen(xc)) {
          const r = xc.getBoundingClientRect(), w = el.offsetWidth || 260, h = el.offsetHeight || 40;
          const bT = window.innerHeight - bottom - h, bB = window.innerHeight - bottom;
          if (r.width > 0 && r.left < left + w && left < r.right && r.top < bB && bT < r.bottom) {
            const pn = document.getElementById("tm-panel"), pr = seen(pn) ? pn.getBoundingClientRect() : null;
            const room = (pr && pr.width > 0 && pr.left > r.right ? pr.left : window.innerWidth) - 8;
            if (r.right + 8 + w <= room || r.top - h - 8 < 56) left = Math.round(r.right + 8);
            else bottom = Math.round(window.innerHeight - r.top + 8);
            // and not on the demonstration's caption (#tm-...-cap, at the foot of the picture) either: above it
            for (const cp of document.body.children) {
              if (!/-cap$/.test(cp.id || "") || !seen(cp)) continue;
              const q = cp.getBoundingClientRect(), t = window.innerHeight - bottom - h, bt = window.innerHeight - bottom;
              if (q.width > 0 && q.left < left + w && left < q.right && q.top < bt && t < q.bottom) bottom = Math.round(window.innerHeight - q.top + 8);
            }
          }
        }
        // DEMO_BAR_N1: the bar is two rows now - it does not lie on the demonstration's caption (#tm-walk-cap and its like), also with no card open
        {
          const w = el.offsetWidth || 260, h = el.offsetHeight || 40;
          for (const cp of document.body.children) {
            if (!/-cap$/.test(cp.id || "") || !seen(cp)) continue;
            const q = cp.getBoundingClientRect(), t = window.innerHeight - bottom - h, bt = window.innerHeight - bottom;
            if (q.width > 0 && q.left < left + w && left < q.right && q.top < bt && t < q.bottom) bottom = Math.round(window.innerHeight - q.top + 8);
          }
        }
        el.style.left = left + "px";
        el.style.bottom = bottom + "px";
      } catch (_) {}
    };
    // DEMO_BAR_N1: a stage forward or back. With a walk (most of the demonstrations: its captions are its stages) - to the start of the next
    // stage or of this one; without - 6 written seconds (the demonstration clock's ms: 6 x demoSlow x 1000), and "אחורה" near the start - from the start.
    // The demonstration runs on from there (one paused is resumed: the eye is to show the stage). The clock of the plugin jumps, and with it every
    // clock of the demonstration (its own and the walk's); the sounds timed ahead are cut.
    const STEP_MS = () => 6 * (ctx.shared.demoSlow || 1.5) * 1000;
    const skip = (dir) => {
      const W = ctx.shared.walk;
      let ms = null;
      if (W && W.on && fnc(W.stageMs)) ms = W.stageMs(dir);
      else if (dir > 0) ms = STEP_MS();
      else if (E.v > STEP_MS() + 500) ms = -STEP_MS();
      else { for (const d of live()) if (fnc(d.restart)) { d.restart(); E.v = 0; return; } return; }
      if (ms == null) return;
      ctx.shared.demoResume();
      tm_clock.jump(ms);
      E.v = Math.max(0, E.v + ms);
      if (typeof ctx.shared.sfxCut === "function") ctx.shared.sfxCut();
    };
    const speed = (dir) => {
      const i = RATES.indexOf(tm_clock.rate), j = Math.max(0, Math.min(RATES.length - 1, (i < 0 ? RATES.indexOf(1) : i) + dir));
      if (j === i) return;
      tm_clock.setRate(RATES[j]);
      if (typeof ctx.shared.sfxCut === "function") ctx.shared.sfxCut();
    };
    const paint = () => {
      const L = tourOn() ? [] : live();
      const on = L.length > 0;
      if (on && !el) build();
      if (!el) return;
      if (on !== shown) { el.style.display = on ? "flex" : "none"; shown = on; }
      if (!on) { E.v = 0; E.last = 0; if (tm_clock.rate !== 1 && !tourOn()) tm_clock.setRate(1); return; }   // DEMO_CLOCK_N1: no demonstration - the real time
      place();   // DPAUSE_LEFT_300
      const any = L.some((d) => !isPaused(d));
      // DEMO_BAR_N1: the speed's label, the buttons at the ends of the speeds
      const rt = tm_clock.rate, ri = RATES.indexOf(rt);
      const rl = "מהירות ×" + (rt === 0.75 ? "¾" : rt === 0.5 ? "½" : String(rt));
      if (lR && lR.textContent !== rl) lR.textContent = rl;
      if (bSl) bSl.disabled = ri === 0;
      if (bFa) bFa.disabled = ri === RATES.length - 1;
      { const nw = tm_clock.now(); if (any && E.last) E.v += Math.max(0, nw - E.last); E.last = nw; }
      const t = any ? "⏸ השהה" : "▶ המשך";
      if (bP.textContent !== t) bP.textContent = t;
      bP.title = any ? "השהיית ההדגמה. אפשר להסתובב ולהסתכל, ואחר כך להמשיך מאותו רגע." : "ממשיך את ההדגמה מהרגע שבו נעצרה.";
      const rs = L.some((d) => fnc(d.restart));
      bR.style.display = rs ? "" : "none";
    };
    ctx.shared.demoPause = () => { const L = live(); for (const d of L) if (!isPaused(d)) { try { d.pause(); } catch (_) {} } paint();
      if (L.length && typeof ctx.shared.sfxCut === "function") ctx.shared.sfxCut();   // SOUNDS_300: a pause is silent at once
      return L.length > 0; };
    ctx.shared.demoResume = () => { for (const d of live()) if (isPaused(d)) { try { d.resume(); } catch (_) {} } paint(); };
    ctx.shared.demoPaused = () => live().some(isPaused);
    setInterval(paint, 300);
    // a press on the model: a running demonstration pauses (the presentation's own press is the presentation's)
    try {
      renderer.domElement.addEventListener("pointerdown", () => {
        if (tourOn()) return;
        if (live().some((d) => !isPaused(d))) ctx.shared.demoPause();
      }, true);
    } catch (_) {}
  })();
  // ===== SOUNDS_300 (the user, 18.11.2026: "תוסיף קולות. מה שאפשר לכל ההדגמות, להוסיף קולות"; the list he approved, items 1-4, 6-10,
  // 12, 16; and "תעשה התאמת ווליום לקולות, לדוג' קול צעדים יחפ אמור להיות יחסית נמוך"): one small synthesizer for the demonstrations -
  // WebAudio, made here, no files (the plugin works offline), as the doors' and the witnesses' sounds. "קולות בהדגמות"
  // (ctx.shared.soundOff) silences it; its stopper is in ctx.shared.soundStops (what sounds now is cut). Every sound has its own level
  // (LEVEL), all under one master gain and a compressor; the steps - barefoot on stone, as the priests walked - are the softest.
  // The sounds and their levels - model choices.
  //   ctx.shared.sfx(name, { at, dur, gain, pattern }) - once: "water" (a stream, dur), "creak" (a heavy door or gate on its pivot),
  //     "bigGate" (the great gate: deep, heard far), "trumpets" (silver trumpets; pattern "long" - one long blast together, else tekia -
  //     terua - tekia), "cymbals", "click" (a step of the throne's work), "step" (one barefoot step), "hiss" (incense put on the
  //     coals, dur), "wicket" (a small door on its pivot), "wheel" (a wooden wheel turning: the laver's machine, dur)
  //   ctx.shared.sfxLoop(name) -> { set(level 0..1), stop() } - while a thing moves: "wheels" (bronze wheels on stone), "steps" (a
  //     walk: soft barefoot steps, about two a second while the level is up)
  (function sounds() {
    let ac = null, comp = null, master = null, noiseBuf = null;
    const loops = new Set();
    const A = () => {
      if (ctx.shared.soundOff) return null;
      try {
        if (!ac) {
          const C = window.AudioContext || window.webkitAudioContext;
          if (!C) return null;
          ac = new C();
          comp = ac.createDynamicsCompressor();
          comp.connect(ac.destination);
          master = ac.createGain();
          master.gain.value = 0.9;
          master.connect(comp);
          const n = ac.sampleRate * 2, buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
          for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
          noiseBuf = buf;
        }
        if (ac.state === "suspended") ac.resume();
        return ac;
      } catch (_) {
        return null;
      }
    };
    const cut = () => {   // what sounds now stops: the master is replaced (every node scheduled on the old one goes silent)
      for (const L of Array.from(loops)) L.stop();
      try {
        if (ac && master) { const old = master; master = ac.createGain(); master.gain.value = 0.9; master.connect(comp); old.disconnect(); }
      } catch (_) {}
    };
    //@@slot sounds.LEVEL
    const env = (g, t, att, peak, hold, rel) => {
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + att);
      g.gain.setValueAtTime(peak, t + att + hold);
      g.gain.linearRampToValueAtTime(0, t + att + hold + rel);
    };
    const noise = (a, t, dur, peak, type, freq, q, att, rel) => {
      const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
      src.buffer = noiseBuf;
      src.loop = true;
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      env(g, t, att, peak, Math.max(0, dur - att - rel), rel);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(t, Math.random() * 1.5);
      src.stop(t + dur + 0.05);
      return { src, f, g };
    };
    const osc = (a, type, freq, t, dur, peak, att, rel) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      env(g, t, att, peak, Math.max(0, dur - att - rel), rel);
      o.connect(g); g.connect(master);
      o.start(t);
      o.stop(t + dur + 0.05);
      return o;
    };
    const brass = (a, t, dur, k, f) => {   // a silver trumpet: two detuned saws through a low-pass that opens
      const g = a.createGain(), lp = a.createBiquadFilter();
      env(g, t, 0.04, k, Math.max(0, dur - 0.12), 0.08);
      lp.type = "lowpass";
      lp.Q.value = 1.2;
      lp.frequency.setValueAtTime(700, t);
      lp.frequency.linearRampToValueAtTime(2600, t + Math.min(0.3, dur));
      for (const dt of [-5, 5]) { const o = a.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(f || 466, t); o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + dur + 0.1); }
      lp.connect(g); g.connect(master);
    };
    //@@slot pluck
    const make = {
      water(a, t, k, o) {
        const dur = Math.max(0.8, +o.dur || 2.5);
        noise(a, t, dur, 0.9 * k, "bandpass", 1100, 0.7, 0.25, Math.min(0.8, dur / 3));
        for (let i = 0; i < dur * 7; i++) noise(a, t + Math.random() * dur, 0.08, 0.6 * k, "bandpass", 1400 + Math.random() * 1800, 2, 0.01, 0.06);
      },
      creak(a, t, k) {
        const o = osc(a, "sawtooth", 85, t, 1.6, 0.5 * k, 0.15, 0.5);
        o.frequency.linearRampToValueAtTime(62, t + 1.6);
        noise(a, t, 1.6, 0.35 * k, "bandpass", 700, 4, 0.2, 0.5);
        osc(a, "sine", 48, t + 1.5, 0.5, 0.9 * k, 0.01, 0.45);
      },
      bigGate(a, t, k) {
        const o = osc(a, "sawtooth", 46, t, 4.5, 0.55 * k, 0.6, 1.8);
        o.frequency.linearRampToValueAtTime(38, t + 4.5);
        noise(a, t, 4.5, 0.6 * k, "lowpass", 220, 0.8, 0.8, 2);
        osc(a, "sine", 34, t + 4, 1.4, k, 0.02, 1.2);
      },
      trumpets(a, t, k, o) {
        if (o.pattern === "long") { const ld = Math.max(2.6, +o.dur || 0); brass(a, t, ld, k, 466); brass(a, t + 0.03, ld - 0.03, k * 0.8, 470); return; }   // LONG_DUR_G1: o.dur - the blast lasts until the next (the whole march)
        if (o.pattern === "drawn") {   // TERUAH_305: Rashi's - the tekia, the teruah and the tekia drawn out over o.dur seconds
          const d = Math.max(4.5, +o.dur || 20) / 3;
          brass(a, t, d - 0.25, k);
          for (let i = 0, n = Math.max(9, Math.round((d - 0.3) / 0.2)); i < n; i++) brass(a, t + d + i * 0.2, 0.2, k * 1.1);   // TEKIA_LEGATO_G1: bursts touch - no silence along the march
          brass(a, t + 2 * d + 0.15, d - 0.15, k);
          return;
        }
        brass(a, t, 1.4, k);
        // TERUAH_305 (the user, 21:10: "ונראה לי יש תרועה שם גם"): the teruah's nine short blasts, each long enough to be heard as one
        // (0.08 s every 0.16 until 2.0.13 - one rattle)
        for (let i = 0; i < 9; i++) brass(a, t + 1.75 + i * 0.2, 0.13, k * 1.1);
        brass(a, t + 3.75, 1.4, k);
      },
      cymbals(a, t, k) {
        for (let i = 0; i < 3; i++) {
          noise(a, t + i * 0.9, 1.6, 0.8 * k, "highpass", 5200, 0.7, 0.005, 1.5);
          noise(a, t + i * 0.9, 0.6, 0.4 * k, "bandpass", 3200, 3, 0.005, 0.5);
        }
      },
      click(a, t, k) {
        noise(a, t, 0.06, k, "bandpass", 1800, 5, 0.002, 0.05);
        osc(a, "sine", 220, t, 0.08, 0.6 * k, 0.002, 0.07);
      },
      step(a, t, k) {
        noise(a, t, 0.09, k, "lowpass", 380, 0.8, 0.008, 0.07);
      },
      hiss(a, t, k, o) {
        const dur = Math.max(1, +o.dur || 2.4);
        noise(a, t, dur, 0.9 * k, "highpass", 3800, 0.6, 0.15, dur * 0.6);
        for (let i = 0; i < dur * 5; i++) noise(a, t + Math.random() * dur, 0.015, 0.7 * k, "highpass", 5000, 1, 0.002, 0.012);
      },
      wicket(a, t, k) {
        const o = osc(a, "sawtooth", 160, t, 0.9, 0.35 * k, 0.05, 0.3);
        o.frequency.linearRampToValueAtTime(110, t + 0.9);
        noise(a, t, 0.9, 0.3 * k, "bandpass", 1100, 5, 0.05, 0.3);
        osc(a, "sine", 90, t + 0.85, 0.25, 0.7 * k, 0.005, 0.22);
      },
      wheel(a, t, k, o) {
        const dur = Math.max(1, +o.dur || 3), w = osc(a, "sawtooth", 70, t, dur, 0.4 * k, 0.3, 0.5);
        w.frequency.linearRampToValueAtTime(92, t + dur);
        noise(a, t, dur, 0.4 * k, "bandpass", 600, 3, 0.3, 0.5);
        for (let i = 0; i < dur * 2.5; i++) noise(a, t + i * 0.4, 0.05, 0.6 * k, "bandpass", 900, 6, 0.004, 0.04);
      }
    };
    ctx.shared.sfx = (name, o) => {
      o = o || {};
      const fn = make[name], a = fn ? A() : null;
      if (!a) return;
      try { fn(a, a.currentTime + Math.max(0, +o.at || 0) + 0.02, (LEVEL[name] || 0.05) * (o.gain == null ? 1 : +o.gain), o); } catch (_) {}
    };
    ctx.shared.sfxLoop = (name) => {
      const L = { level: 0, bed: null, timer: 0, next: 0 };
      L.stop = () => {
        loops.delete(L);
        if (L.timer) { clearInterval(L.timer); L.timer = 0; }
        if (L.bed) { const b = L.bed; L.bed = null; try { b.g.gain.setTargetAtTime(0, ac.currentTime, 0.05); setTimeout(() => { try { b.srcs.forEach((x) => x.stop()); } catch (_) {} }, 400); } catch (_) {} }
        L.level = 0;
      };
      L.set = (v) => {
        v = Math.max(0, Math.min(1, +v || 0));
        if (v === L.level && (v === 0 || L.bed || L.timer)) return;
        L.level = v;
        if (v > 0 && !A()) return;
        if (name === "steps") {
          if (v > 0 && !L.timer) {
            loops.add(L);
            L.timer = setInterval(() => {
              if (ctx.shared.soundOff || L.level <= 0.02) return;
              const now = performance.now();
              if (now < L.next) return;
              L.next = now + 520 + Math.random() * 60;
              ctx.shared.sfx("step", { gain: L.level });
            //@@slot sounds
            }, 60);
          }
          return;
        }
        if (name === "wheels" && ac) {
          if (!L.bed && v > 0) {
            const g = ac.createGain(), srcs = [];
            g.gain.value = 0;
            g.connect(master);
            for (const [type, f, q, m] of [["lowpass", 260, 0.9, 1], ["bandpass", 1500, 9, 0.18]]) {
              const s = ac.createBufferSource(), fl = ac.createBiquadFilter(), gg = ac.createGain();
              s.buffer = noiseBuf; s.loop = true;
              fl.type = type; fl.frequency.value = f; fl.Q.value = q;
              gg.gain.value = m;
              s.connect(fl); fl.connect(gg); gg.connect(g);
              s.start(0, Math.random() * 1.5);
              srcs.push(s);
            }
            L.bed = { g, srcs };
            loops.add(L);
          }
          if (L.bed) L.bed.g.gain.setTargetAtTime(LEVEL.wheels * v * 2.2, ac.currentTime, 0.12);
        }
      };
      return L;
    };
    (ctx.shared.soundStops || (ctx.shared.soundStops = [])).push(cut);
    ctx.shared.sfxCut = cut;   // (stopDemos and demoPause above: a stop or a pause cuts what sounds now)
  })();
  document.addEventListener("click", (ev) => {
    const t = ev.target && ev.target.closest ? ev.target.closest("button, input, select, [role='button'], .tm-op a") : null;
    // TOUR_SOFT_204 (the user, 12.11.2026 02:14): closing a floating card, folding it, folding the panel - no command, the demonstration goes on
    if (!t || t.closest(".tm-pill, #tm-news, #tm-help, .tm-src, .tm-srcl, #tm-xcard .x, #tm-card .x, .tm-more, #tm-burger, #tm-dpause, #tm-tour-box")) return;   // DEMO_PAUSE_207: + the pause bar; TOUR_DEMO_PAUSE_209: + the presentation's banner (its buttons pause, step and end it - its own undo stops a slide's demonstration; until 2.0.8 its "⏸" ENDED the slide's demonstration)
    // DEMO_STOP_G (the user, 23.11.2026 01:18): THE RULE - a place, a view or a switch elsewhere ends the demonstration that runs and takes its
    // figures away (every demonstration, also an untimed one like the willow's circuit, is in ctx.shared.demoStops). THE EXCEPTION, one hook:
    // ctx.shared.ui_chipKeepsDemo(button, event) - true for a chip on the running demonstration's own card or on the presentation's bar
    // (fix-t); such a click changes the reading while the demonstration goes on
    try { if (typeof ctx.shared.ui_chipKeepsDemo === "function" && ctx.shared.ui_chipKeepsDemo(t, ev)) return; } catch (_) {}
    ctx.shared.stopDemos();
  }, true);
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
      //@@slot initModules
    ];
    const fill = document.getElementById("fill");
    const loadMsg = document.getElementById("loading-msg");
    const STAGES = [
      //@@slot initModules-2
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
        const p3 = renderer.compileAsync(ent_hq.warmScene(), camera);   // HQ_302: drawn into targets too, keyed as there
        renderer.setRenderTarget(null);
        await Promise.race([Promise.all([p1, p2, p3]), new Promise((r) => setTimeout(r, 25e3))]);
      } else {
        renderer.compile(scene, camera);
        renderer.setRenderTarget(rt);
        renderer.compile(ds.tiny, camera);
        renderer.compile(ent_hq.warmScene(), camera);   // HQ_302
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
  // CAM_219 (3) (the audit; Gemini's report said "near 0.05" - everywhere that would make the depth 10 times coarser, and the far walls
  // of the mount's views would flicker): the near plane is a fifth of the distance to the target, between 0.04 and 0.5 - from 2.5 amot
  // out it is 0.5 as it always was (every fly view stands farther), and only an eye brought nearer (the + button and key, a pinch, a
  // middle-button drag: minDistance 0.3) gets a nearer plane, so the vessel it looks at is not cut
  var CAM_NEAR_MIN = 0.04, CAM_NEAR_MAX = 0.5;
  function cam_nearStep() {
    if (!controls) return;
    const d = camera.position.distanceTo(controls.target);
    const n = Number.isFinite(d) ? Math.max(CAM_NEAR_MIN, Math.min(CAM_NEAR_MAX, d * 0.2)) : CAM_NEAR_MAX;
    if (Math.abs(n - camera.near) > camera.near * 0.05) {
      camera.near = n;
      camera.updateProjectionMatrix();
    }
  }
  var lastGoodPos = camera.position.clone(), lastGoodTarget = controls.target.clone();
  function guardCamera() {
    const p = camera.position, q = controls.target;
    if (isFinite(p.x + p.y + p.z + q.x + q.y + q.z)) {
      ent_clampView();   // 1.0.1-L (L.87)
      // (1.0.1-L closed the polar limit here after looking up indoors, back to PI * 0.495; 1.0.2 (M): the limit is the floor's, ent_floorStep)
      // 1.2.0: the floor under the target and the ground - the only height limits (a lift, not a stop: the move goes on sideways)
      if (!flyAnim && !cam_drag) {
        //@@slot guardCamera.lo
        if (p.y < lo) p.y = lo;
        // 1.2.0 (the user: "לראות אותו מאחור... מתוך הבית"): "סיבוב בתוך הבית בלבד" - indoors the eye never leaves the room: when a
        // building surface (userData.tmPass) stands between the target and the eye, the eye is drawn back to the surface's inner side
        if (cam.inside && cam.roofed && cam.mode === "orbit") cam_keepInside(p, q);
      }
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
    cam_drag = null;
    camera.position.copy(lastGoodPos);
    makeControls(lastGoodTarget);
    controls.update();
  }
  // SAFETY (4.2.0): the background-render stop is OFF by default - the model keeps drawing and the demonstrations keep advancing in a hidden
  // document exactly as before (the 250ms interval below), because WebView2 inside Otzaria was not tested with it. Only the house bridge's own
  // pause (__tmHouseVisible === false) stops it; set window.__tmBgRenderStop = true to also stop on document.hidden.
  function ent_isVisible() { return window.__tmHouseVisible !== false && !(window.__tmBgRenderStop === true && document.hidden); }
  renderer.setAnimationLoop((t) => {
    if (ent_load.loading || !ent_isVisible()) return;   // nothing is drawn behind the loading overlay or by a hidden house/tab
    if (flyAnim) {
      const k = Math.min(1, (t - flyAnim.t0) / flyAnim.dur), e = ease(k);
      camera.position.lerpVectors(flyAnim.p0, flyAnim.p1, e);
      controls.target.lerpVectors(flyAnim.c0, flyAnim.c1, e);
      if (k >= 1) {
        flyAnim = null;
        cam_killInertia();   // CAM_219 (2): nothing of an input in the flight goes on after it
        cam_decide();   // 1.2.0
        // 1.0.4: a thing to orbit round only when the flight ends under a roof (the menorot, the ulam's tables); a view from outside (Yachin and Boaz from the
        // court, 15.9 amot, its target before the ulam) stays as it was
      }
    }
    if (cam.decideAt && t >= cam.decideAt) cam_decide();   // 1.2.0: after a wheel burst or a lift
    ent_damp(t);   // 1.0.1-L (L.87)
    ent_zoomStep();
    ent_liftStep();   // 1.0.2 (M): the eye's height (the keys, Shift + wheel)
    ent_walkStep();   // 1.2.2: the arrows walk
    cam_update();   // 1.2.0: controls.update(), "סיבוב איטי" in place in mode "look"
    guardCamera();
    for (const fn of ctx.animated) {
      try {
        fn(t);
      } catch (_) {
      }
    }
    //@@slot after-guardCamera
    cam_nearStep();   // CAM_219 (3): after every writer of the camera (ctx.animated too)
    ent_hq.frame();   // HQ_302: with a light toggle on, its prepass and AO (nothing otherwise)
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
    if (document.hidden && !ent_load.loading && window.__tmBgRenderStop !== true && window.__tmHouseVisible !== false) {
      ent_damp(performance.now());   // 1.0.1-L (L.87)
      ent_zoomStep();
      cam_update();   // 1.2.0
      guardCamera();
      for (const fn of ctx.animated) {
        try {
          fn(performance.now());
        } catch (_) {
        }
      }
      cam_nearStep();   // CAM_219 (3)
      renderer.render(scene, camera);
    }
  }, 250);
  // the view follows the window: on "resize" and from a watchdog (a webview may show the tab without firing "resize"; see viewSize)
  var fitW = viewWH[0], fitH = viewWH[1];
  function fitToWindow() {
    if (!ent_isVisible()) return;
    guardCamera();   // recover a visible webview even if its animation loop has not resumed yet
    const wh = viewSize();
    if (wh[0] === fitW && wh[1] === fitH) return;
    fitW = wh[0];
    fitH = wh[1];
    camera.aspect = fitW / fitH;
    camera.updateProjectionMatrix();
    renderer.setSize(fitW, fitH);
  }
  window.addEventListener("resize", fitToWindow);
  document.addEventListener("visibilitychange", fitToWindow);
  setInterval(fitToWindow, 500);
  var isOtzaria = typeof window.Otzaria !== "undefined";
  if (isOtzaria) {
    window.Otzaria.on("plugin.boot", (payload) => {
      const ver = document.getElementById("version");
      if (ver && payload && payload.plugin && payload.plugin.version) ver.textContent = "v" + payload.plugin.version;
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
  window.__ent360 = { cam, decide: cam_decide, roofed: ent_roofed, solids: ent_solids, floorY: cam_floorY, lift: ent_lift, lookEnd: cam_lookEnd };   // 1.2.0: for the headless tests
  window.__renderer = renderer;
  window.__shc = shc;   // SHADOW_CACHE_302: QA (frames walked, maps drawn)
  window.__hq = ent_hq;   // HQ_302: QA
  window.__camera = camera;
