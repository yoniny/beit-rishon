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
    c.maxPolarAngle = Math.PI * 0.495;
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
  // its distance along the new direction, so the wheel and the pills go on as before. Outdoors nothing changes. Indoors = a ceiling above and walls on 3 of 4 sides within
  // 60 amot, or walls on all 4 within 30 with the roof off (model choice; the forest house's hall is 100 x 50).
  var ENT_POLAR = Math.PI * 0.495;
  var ent_look = { on: false, id: -1, d0: 10, rel: 0, v: new Vector3(), ray: null, t: -1e9, at: new Vector3(), res: false, dirs: [new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)], up: new Vector3(0, 1, 0) };
  function ent_solids() {
    const out = [];
    const walk = (o) => {
      if (o.visible === false || o.name === "tm-kk-cloud" || o.name === "tm-measure") return;
      if (o.isMesh && !o.userData.noPick && !(o.geometry && o.geometry.type === "BoxGeometry" && o.scale.x > 1000)) {
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (m && m.visible !== false && !(m.transparent && m.opacity < 0.5)) out.push(o);
      }
      for (const c of o.children) walk(c);
    };
    walk(scene);
    return out;
  }
  function ent_indoors() {
    const now = performance.now(), p = camera.position;
    if (now - ent_look.t < 1200 && ent_look.at.distanceToSquared(p) < 0.25) return ent_look.res;
    ent_look.t = now;
    ent_look.at.copy(p);
    let res = false;
    try {
      const ray = ent_look.ray || (ent_look.ray = new Raycaster());
      ray.camera = camera;
      const list = ent_solids(), hit = (d, far) => { ray.set(p, d); ray.near = 0; ray.far = far; const h = ray.intersectObjects(list, false); return h.length ? h[0].distance : Infinity; };
      const walls = ent_look.dirs.map((d) => hit(d, 60));
      const near = walls.filter((w) => w < 60).length, tight = walls.filter((w) => w < 30).length;
      res = (near >= 3 && hit(ent_look.up, 60) < 60) || tight === 4;
    } catch (_) {
    }
    return (ent_look.res = res);
  }
  function ent_lookEnd() {
    if (!ent_look.on) return;
    ent_look.on = false;
    const c = controls, v = ent_look.v;
    const dm = c.enableDamping;
    c.enableDamping = false;   // the rest of the drag's movement is used up here, at the tiny radius, and not on the long one
    try { c.update(); } catch (_) {}
    c.enableDamping = dm;
    v.copy(c.target).sub(camera.position);
    if (!(v.lengthSq() > 0)) camera.getWorldDirection(v);
    v.normalize();
    c.minDistance = 2;
    c.maxPolarAngle = Math.max(ENT_POLAR, Math.min(Math.PI - 0.06, Math.acos(Math.max(-1, Math.min(1, -v.y))) + 1e-4));
    c.target.copy(camera.position).addScaledVector(v, Math.max(2, ent_look.d0));
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
      if (!(d < 4)) {
        // 1.0.1-L (the user: "לא רואים את השולחן, וכל חלקי ההיכל מכל הצדדים"): indoors a drag circles what is looked at, so that it is seen from every side;
        // a wall in the way brings the camera nearer along the same line, and it goes back out when there is room (ent_slideStep). Only large surfaces are tested.
        if (ent_indoors()) {
          ent_slide.on = true;
          ent_slide.id = e.pointerId;
          ent_slide.rel = 0;
          ent_slide.r0 = d;
          ent_slide.list = ent_solids().filter((o) => {
            if (o.isInstancedMesh || !o.geometry) return false;
            if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
            return o.geometry.boundingSphere && o.geometry.boundingSphere.radius > 5;
          });
          c.minDistance = 0.6;
        }
        return;
      }
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
    const up = (e) => { if (ent_look.on && !ent_look.rel && e.pointerId === ent_look.id) ent_look.rel = performance.now(); if (ent_slide.on && !ent_slide.rel && e.pointerId === ent_slide.id) ent_slide.rel = performance.now(); };
    el.addEventListener("pointerup", up, true);
    el.addEventListener("pointercancel", up, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    window.addEventListener("blur", () => { if (ent_look.on && !ent_look.rel) ent_look.rel = performance.now(); });
    el.addEventListener("wheel", () => ent_lookEnd(), { capture: true, passive: true });
  }
  var ent_slide = { on: false, id: -1, rel: 0, r0: 10, list: null, ray: null, v: new Vector3(), o: new Vector3() };
  function ent_slideStep() {
    if (!ent_slide.on) return;
    if (ent_slide.rel && performance.now() - ent_slide.rel > 400) {
      ent_slide.on = false;
      ent_slide.list = null;
      controls.minDistance = 2;
      return;
    }
    const S = ent_slide, q = controls.target, v = S.v.copy(camera.position).sub(q), L = v.length();
    if (!(L > 1e-6)) return;
    v.multiplyScalar(1 / L);
    const ray = S.ray || (S.ray = new Raycaster());
    ray.set(S.o.copy(q), v);
    ray.near = 0;
    ray.far = S.r0 + 0.5;
    ray.camera = camera;
    const h = ray.intersectObjects(S.list, false);
    const r = Math.max(0.8, Math.min(S.r0, h.length ? h[0].distance - 0.4 : S.r0));
    camera.position.copy(q).addScaledVector(v, r);
  }
  function ent_lookStep(t) {   // the release: after the drag's damping has run out (140 ms of time constant)
    if (ent_look.on && ent_look.rel && performance.now() - ent_look.rel > 350) ent_lookEnd();
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
    camIndoors: ent_indoors,   // 1.0.1-L (Part 7, U1): 70-ui.js's nav buttons and keys
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
    const loadEl = document.getElementById("loading");
    if (loadEl) {
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
      // 1.0.1-L (Part 7, U1): after looking up indoors the polar limit stays open just as far as the view needs, and closes with it
      if (!ent_look.on && controls.maxPolarAngle > ENT_POLAR) {
        const L0 = p.distanceTo(q);
        if (L0 > 0) controls.maxPolarAngle = Math.max(ENT_POLAR, Math.min(controls.maxPolarAngle, Math.acos(Math.max(-1, Math.min(1, (p.y - q.y) / L0))) + 1e-4));
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
    ent_look.on = false;   // 1.0.1-L (Part 7, U1)
    camera.position.copy(lastGoodPos);
    makeControls(lastGoodTarget);
    controls.update();
  }
  renderer.setAnimationLoop((t) => {
    if (ent_load.loading) return;   // 1.0.1-K: nothing is drawn behind the loading overlay (see initModules)
    if (flyAnim) {
      const k = Math.min(1, (t - flyAnim.t0) / flyAnim.dur), e = ease(k);
      camera.position.lerpVectors(flyAnim.p0, flyAnim.p1, e);
      controls.target.lerpVectors(flyAnim.c0, flyAnim.c1, e);
      if (k >= 1) flyAnim = null;
    }
    ent_lookStep();   // 1.0.1-L (Part 7, U1)
    ent_damp(t);   // 1.0.1-L (L.87)
    ent_zoomStep();
    controls.update();
    ent_slideStep();   // 1.0.1-L
    guardCamera();
    for (const fn of ctx.animated) {
      try {
        fn(t);
      } catch (_) {
      }
    }
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
      controls.update();
      guardCamera();
      for (const fn of ctx.animated) {
        try {
          fn(performance.now());
        } catch (_) {
        }
      }
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
  window.__renderer = renderer;
  window.__camera = camera;
