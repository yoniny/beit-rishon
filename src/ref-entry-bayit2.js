  // src/build-entry.js
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
    const font = '600 48px "Segoe UI",Arial';
    const pad = 26;
    const cv = document.createElement("canvas");
    let c = cv.getContext("2d");
    c.font = font;
    const tw = Math.max(8, Math.ceil(c.measureText(text).width));
    cv.width = tw + pad * 2;
    cv.height = 48 + pad * 2;
    c = cv.getContext("2d");
    c.font = font;
    c.textAlign = "center";
    c.textBaseline = "middle";
    const cx = cv.width / 2, cy = cv.height / 2;
    c.fillStyle = "rgba(0,0,0,.85)";
    for (const o of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) c.fillText(text, cx + o[0], cy + o[1]);
    c.fillStyle = "#f3dc9a";
    c.fillText(text, cx, cy);
    const tex = new CanvasTexture(cv);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const spr = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthTest: true, depthWrite: false }));
    const hAmot = (size || 4) * cv.height / 48;
    spr.scale.set(hAmot * cv.width / cv.height, hAmot, 1);
    return spr;
  }
  var renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  var mainEl = document.getElementById("main");
  if (mainEl) mainEl.appendChild(renderer.domElement);
  else document.body.appendChild(renderer.domElement);
  var scene = new Scene();
  scene.fog = new Fog(15259316, 1400, 4600);
  var pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  var sky = new Sky();
  sky.scale.setScalar(6e3);
  scene.add(sky);
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
  sun.shadow.mapSize.set(4096, 4096);
  var sc = 480;
  Object.assign(sun.shadow.camera, { left: -sc, right: sc, top: sc, bottom: -sc, near: 50, far: 2e3 });
  sun.shadow.bias = -35e-5;
  sun.shadow.normalBias = 0.35;
  scene.add(sun);
  scene.add(new HemisphereLight(12572400, 9074e3, 0.75));
  var camera = new PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.5, 6e3);
  camera.position.set(430, 190, 240);
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 30, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.maxDistance = 2200;
  var flyAnim = null;
  function flyTo(pos, target, dur = 1600) {
    flyAnim = {
      t0: performance.now(),
      dur,
      p0: camera.position.clone(),
      p1: new Vector3(...pos),
      c0: controls.target.clone(),
      c1: new Vector3(...target)
    };
  }
  var root = new Group();
  scene.add(root);
  var ctx = {
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
    shared: {},
    flyTo,
    camera,
    controls,
    renderer
  };
  async function initModules() {
    const MODULES = [
      { name: "mount.js", build },
      { name: "courts.js", build: build2 },
      { name: "altar.js", build: build3 },
      { name: "heichal.js", build: build4 },
      { name: "ui.js", build: build5 }
    ];
    const fill = document.getElementById("fill");
    const loadMsg = document.getElementById("loading-msg");
    const STAGES = [
      "\u05D8\u05D5\u05E2\u05DF \u05D0\u05EA \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA \u05D5\u05D4\u05D7\u05D5\u05DE\u05D5\u05EA",
      "\u05D8\u05D5\u05E2\u05DF \u05D0\u05EA \u05D4\u05E2\u05D6\u05E8\u05D5\u05EA \u05D5\u05D4\u05E9\u05E2\u05E8\u05D9\u05DD",
      "\u05D8\u05D5\u05E2\u05DF \u05D0\u05EA \u05D4\u05DE\u05D6\u05D1\u05D7 \u05D5\u05D4\u05DB\u05D1\u05E9",
      "\u05D8\u05D5\u05E2\u05DF \u05D0\u05EA \u05D4\u05D0\u05D5\u05DC\u05DD \u05D5\u05D4\u05D4\u05D9\u05DB\u05DC",
      "\u05D8\u05D5\u05E2\u05DF \u05D0\u05EA \u05D4\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05D5\u05D4\u05E6\u05D1\u05E2\u05D9\u05DD"
    ];
    for (let i = 0; i < MODULES.length; i++) {
      if (loadMsg) loadMsg.textContent = STAGES[i] + " (" + (i + 1) + "/" + MODULES.length + ")";
      await new Promise((r) => setTimeout(r, 30));
      try {
        await MODULES[i].build(ctx);
      } catch (e) {
        console.error("[module " + MODULES[i].name + "]", e);
        showToast("\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA " + MODULES[i].name + ": " + e.message, 5e3);
      }
      if (fill) fill.style.width = (i + 1) / MODULES.length * 100 + "%";
    }
    const loadEl = document.getElementById("loading");
    if (loadEl) {
      loadEl.style.opacity = "0";
      setTimeout(() => loadEl.remove(), 700);
    }
    // (the "model loaded - developer" toast was removed)
  }
  var ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  renderer.setAnimationLoop((t) => {
    if (flyAnim) {
      const k = Math.min(1, (t - flyAnim.t0) / flyAnim.dur), e = ease(k);
      camera.position.lerpVectors(flyAnim.p0, flyAnim.p1, e);
      controls.target.lerpVectors(flyAnim.c0, flyAnim.c1, e);
      if (k >= 1) flyAnim = null;
    }
    controls.update();
    for (const fn of ctx.animated) {
      try {
        fn(t);
      } catch (_) {
      }
    }
    renderer.render(scene, camera);
  });
  setInterval(() => {
    if (document.hidden) {
      controls.update();
      for (const fn of ctx.animated) {
        try {
          fn(performance.now());
        } catch (_) {
        }
      }
      renderer.render(scene, camera);
    }
  }, 250);
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  var isOtzaria = typeof window.Otzaria !== "undefined";
  if (isOtzaria) {
    window.Otzaria.on("plugin.boot", (payload) => {
      const ver = document.getElementById("version");
      if (ver) ver.textContent = "v" + payload.plugin.version;
      applyTheme(payload.theme);
      initModules().catch((e) => {
        console.error(e);
        showToast("\u05E9\u05D2\u05D9\u05D0\u05D4: " + e.message, 5e3);
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
})();
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
