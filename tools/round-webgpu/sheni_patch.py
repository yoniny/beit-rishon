# -*- coding: utf-8 -*-
# webgpu round, the Second Temple: the module edits, by text anchors (tools/round-webgpu/patchlib.py), on a readable bundle whose
# library block was already replaced (sheni_lib.py). Re-runnable on 2.0.18's unified-plugin/sheni/bundle.js and on 3.0's
# sheni-src/bundle.js. Steps:
#   1b - three.js 187 with WebGLRenderer (lib187.js): PCFSoftShadowMap -> PCFShadowMap (three.js removed it); RoomEnvironment as
#        three.js 160 built it (PointLight 5, room not lowered; 187: 900 and y -3.5 - the environment map came out far too bright); the
#        sky without 187's clouds
#   1c - three.js 187 with WebGPURenderer (lib-webgpu.js): the renderer (WebGPU, else its own WebGL 2 backend; tm.engine = "webgl" forces
#        the second), drawing straight to the canvas with sRGB encoding per material (blending as under WebGLRenderer; the night clear
#        colour in sRGB), renderer.init() before the environment map, the compile and the first frame; Sky -> SkyMesh; the live flames' GLSL
#        ShaderMaterial -> a TSL node material; the sparks (Points are one pixel wide in the node renderer) -> an instanced Sprite
#        (PointsNodeMaterial); the materials' clipping planes (and clipShadows) as maskNode (the WebGPU renderer clips by ClippingGroup
#        only); the header note. 1c needs 1b.
# The edits in the renderer setup are kept small and local (no reformatting), for the later merges.
# Usage: python3 tools/round-webgpu/sheni_patch.py <bundle.js (rewritten in place)> 1b [1c]
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from patchlib import Bundle

P, steps = sys.argv[1], sys.argv[2:]
b = Bundle(P)

if '1b' in steps:
    b.rep('''
  renderer.shadowMap.type = PCFSoftShadowMap;
''', '''
  renderer.shadowMap.type = PCFShadowMap;   // webgpu round: three.js 187 removed PCFSoftShadowMap (WebGL and WebGPU warn, then use PCFShadowMap)
''', 'shadow map type')
    # three.js 160's RoomEnvironment lit its room with a PointLight of intensity 5 unless it was given a renderer with
    # _useLegacyLights === false (then 900); this house calls it without a renderer, so the environment map was built with 5. three.js 187
    # always uses 900 and lowers the whole room by 3.5 (position.y): the map, and every surface lit by it, came out far too bright. The
    # room is put back as three.js 160 had it (the boxes and the light panels are otherwise the same, as instances / emissive Lambert).
    b.rep('''
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
''', '''
  var ent_room = new RoomEnvironment();   // webgpu round: as three.js 160 built it without a renderer - PointLight 5 (187: 900), not lowered (187: y -3.5)
  ent_room.position.y = 0;
  ent_room.traverse((o) => { if (o.isPointLight) o.intensity = 5; });
  scene.environment = pmrem.fromScene(ent_room, 0.04).texture;
''', 'environment room as in three.js 160')
    # THE ENVIRONMENT LIGHT (the one global compensation of the round; the First Temple can take the same block): three.js 160 applied a
    # material's envMapIntensity to the scene's environment map too; since 163 it applies only with the material's own envMap, else
    # scene.environmentIntensity (1). This house tunes it per material (stone and paving 0.5-0.7, marble 1.1, gold and bronze 1.1-1.3),
    # so under 187 the stone took about twice the environment light (the "brighter stone" of the first comparisons; not the GGX
    # filter) and the gold less - no single scene.environmentIntensity fits both. A standard material without an envMap of its own whose
    # envMapIntensity is not 1 reports the scene's current environment map as its envMap, so both renderers apply its envMapIntensity again
    # (scene.environment stays the switch: null at night).
    b.insert_after('''
  // plugin/js/core.js
''', '''
  // webgpu round: THE ENVIRONMENT LIGHT AS IN THREE.JS 160 - 160 applied a material's envMapIntensity to the scene's environment map too;
  // since 163 only to the material's own envMap (else scene.environmentIntensity, 1). The materials here tune it (stone and paving 0.5-0.7,
  // gold and bronze 1.1-1.3): a standard material without an envMap of its own whose envMapIntensity is not 1 reports the scene's current
  // environment map as its envMap, so its envMapIntensity counts again (scene.environment stays the switch: null at night)
  Object.defineProperty(Material.prototype, "envMap", { configurable: true,
    get() { if (this._tmEnvMap) return this._tmEnvMap; return this.isMeshStandardMaterial && this.envMapIntensity !== 1 && typeof scene !== "undefined" && scene ? scene.environment : null; },
    set(v) { this._tmEnvMap = v && !(typeof scene !== "undefined" && scene && v === scene.environment) ? v : null; } });
''', 'environment light as in three.js 160')
    # three.js 187's Sky draws clouds (cloudCoverage 0.4 by default; SkyMesh too); 160's had none - the sky is kept as it was
    b.insert_after('''
  var sky = new Sky();
''', '''
  sky.material.uniforms.cloudCoverage.value = 0;   // webgpu round: three.js 187's Sky draws clouds (coverage 0.4 by default); 160's had none
''', 'sky without clouds')

if '1c' in steps:
    # ---------------------------------------------------------------- the header note (inside the header comment: no " //" endings)
    b.insert_after(''' * STANDING RULE 7 (cross-check with the parallel plugin):''', '''
 * WEBGPU (webgpu round, 18.11.2026; Yoni: "מעבר ל-Web GPU"; tools/round-webgpu/): three.js 160 -> 187 and WebGPURenderer - WebGPU where the
 *   browser has it (Chrome / Edge 113+ on Windows with Direct3D 12, Firefox 141+, Safari 26), else the renderer's own WebGL 2 backend.
 *   localStorage "tm.engine" = "webgl" (or ?engine=webgl) forces the WebGL 2 backend; window.__tmBackend = "webgpu" / "webgl". The library
 *   is three.js's WebGPU build in its own inner scope (var __lib), its exports destructured into this scope; TSL functions as TSL.xxx.
 *   entry: renderer.init() is async - ent_gpuReady (the environment map after it) is awaited before the compile and the first frame;
 *   the canvas is drawn directly and every material tone-maps (ent_toneMapping) and encodes to sRGB itself (renderer.contextNode's
 *   getOutput; renderer.toneMapping / outputColorSpace stay linear), so the transparent things blend as under WebGLRenderer (the
 *   renderer's linear buffer made the flames pale and the smoke light);
 *   Sky -> SkyMesh (sky.material.uniforms = the mesh's uniform nodes, so .sunPosition.value etc. work as before); no stand-ins for
 *   WebGLShadowMap's depth programs. altar: the live flames are a TSL node material (same noise and colours; material.uniforms = its
 *   nodes); the sparks are an instanced Sprite with a PointsNodeMaterial (THREE.Points are one pixel wide in the node renderer). core:
 *   material.clippingPlanes / clipIntersection / clipShadows become the material's maskNode / maskShadowNode (the WebGPU renderer clips
 *   by ClippingGroup only).''',
        'header note', raw=True, prefix=True)

    # ---------------------------------------------------------------- the materials' clipping planes (the live section, the cuts)
    b.insert_after('''
  // plugin/js/core.js
''', '''
  // WEBGPU (webgpu round): material.clippingPlanes / clipIntersection (the live section, the cuts that open the house) - three.js 187's
  // WebGPU renderer clips by ClippingGroup only and ignores the material's planes. Every material's planes are kept here (accessors on
  // Material.prototype) and become its maskNode: a fragment on the clipped (negative) side of the planes is discarded - of any plane, or of
  // all of them with clipIntersection - as WebGLRenderer did. The planes are read every frame (uniforms). clipShadows as WebGLRenderer's:
  // false (the default) - the clipped parts still cast their shadows (maskShadowNode: keep all); true (the live section) - they do not
  // (the shadow pass takes maskNode). The renderer copies maskNode when it turns a material into a node material.
  (() => {
    const T = TSL, K = Symbol("tmClip");
    const st = (m) => m[K] || (m[K] = { planes: null, inter: false, shadows: false, masked: false, prev: null });
    const build = (m) => {
      const s = st(m);
      if (!s.planes || !s.planes.length) {
        if (s.masked) { m.maskNode = s.prev; m.maskShadowNode = null; s.masked = false; m.needsUpdate = true; }
        return;
      }
      const keepBy = (p) => { const u = T.uniform(new Vector4()); u.onRenderUpdate(() => { u.value.set(p.normal.x, p.normal.y, p.normal.z, p.constant); }); return T.dot(T.positionWorld, u.xyz).add(u.w).greaterThanEqual(0); };
      let keep = keepBy(s.planes[0]);
      for (let i = 1; i < s.planes.length; i++) keep = s.inter ? keep.or(keepBy(s.planes[i])) : keep.and(keepBy(s.planes[i]));
      if (!s.masked) s.prev = m.maskNode || null;
      m.maskNode = s.prev ? s.prev.and(keep) : keep;
      m.maskShadowNode = s.shadows ? null : T.bool(true);
      s.masked = true;
      m.needsUpdate = true;
    };
    Object.defineProperty(Material.prototype, "clippingPlanes", { configurable: true, get() { return this[K] ? this[K].planes : null; }, set(v) { st(this).planes = v || null; build(this); } });
    Object.defineProperty(Material.prototype, "clipIntersection", { configurable: true, get() { return this[K] ? this[K].inter : false; }, set(v) { const s = st(this); if (s.inter !== !!v) { s.inter = !!v; if (s.planes) build(this); } } });
    Object.defineProperty(Material.prototype, "clipShadows", { configurable: true, get() { return this[K] ? this[K].shadows : false; }, set(v) { const s = st(this); if (s.shadows !== !!v) { s.shadows = !!v; if (s.masked) build(this); } } });
  })();
''', 'clipping planes by maskNode')

    # ---------------------------------------------------------------- the renderer
    b.rep('''
  var renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
''', '''
  // WEBGPU (webgpu round): three.js 187's WebGPURenderer - WebGPU where the browser has it, else its own WebGL 2 backend; localStorage
  // "tm.engine" = "webgl" (or ?engine=webgl) forces the WebGL 2 backend. window.__tmBackend: "webgpu" / "webgl" (set by ent_gpuReady below)
  var ent_engine = (() => { try { const q = new URLSearchParams(location.search).get("engine"); if (q) return q; } catch (_) {} try { return localStorage.getItem("tm.engine") || ""; } catch (_) { return ""; } })();
  var renderer = new WebGPURenderer({ antialias: true, powerPreference: "high-performance", forceWebGL: ent_engine === "webgl" });
  // WEBGPU: the picture is drawn straight to the canvas and every material does its own tone mapping (ent_toneMapping, below; not when its
  // toneMapped is false) and sRGB encoding, as WebGLRenderer did, so the transparent things (the pyres' flames and sparks, the smoke, the
  // labels) blend over it as before. The renderer's own way - a linear buffer, tone-mapped and converted at the end - blends them in linear
  // light: the flames and the sparks came out pale, the smoke light. renderer.toneMapping and outputColorSpace are therefore left linear
  // (they would bring that buffer back); render targets (the environment map, the shadow maps) stay linear.
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.contextNode = TSL.context({ ...renderer.contextNode.getFlowContextData(), getOutput: (n, b) => { if (b.renderer.getRenderTarget() !== null) return n; const o = TSL.renderOutput(n, b.material.toneMapped === false ? NoToneMapping : ent_toneMapping, SRGBColorSpace); o.premultipliedAlpha = b.material.premultipliedAlpha; return o; } });
''', 'renderer')

    b.rep('''
  renderer.toneMapping = ACESFilmicToneMapping;
''', '''
  var ent_toneMapping = ACESFilmicToneMapping;   // WEBGPU: done in each material (renderer.contextNode above); renderer.toneMapping stays NoToneMapping
''', 'tone mapping per material')

    b.rep('''
  scene.environment = pmrem.fromScene(ent_room, 0.04).texture;
''', '''
  // WEBGPU: the backend is ready only after renderer.init() (async); the environment map is made after it, and initModules awaits
  // ent_gpuReady before it compiles the shaders and draws the first frame
  var ent_gpuReady = renderer.init().then(() => {
    window.__tmBackend = renderer.backend && renderer.backend.isWebGPUBackend ? "webgpu" : "webgl";
    scene.environment = pmrem.fromScene(ent_room, 0.04).texture;
  }).catch((e) => { console.error("[load] renderer init:", e && e.message); });
''', 'renderer.init + environment map')

    b.rep('''
  var sky = new Sky();
''', '''
  // WEBGPU: SkyMesh, the node version of the same sky; its uniforms are nodes on the mesh. material.uniforms holds the same nodes, so the
  // modules' sky.material.uniforms.X.value (the WebGL Sky's way: the morning service's dawn, the night) work as before
  var sky = new SkyMesh();
  sky.material.uniforms = { sunPosition: sky.sunPosition, turbidity: sky.turbidity, rayleigh: sky.rayleigh, mieCoefficient: sky.mieCoefficient, mieDirectionalG: sky.mieDirectionalG, cloudCoverage: sky.cloudCoverage };
''', 'sky')

    # the night background colour (the classic night of the morning service, before the sky shows): a clear colour is not encoded per
    # material, so with the canvas drawn directly (see the renderer) it is given already in sRGB
    b.rep('''
      ctx2.scene.background = s > 0.6 ? saved.bg : SKYC.night;
''', '''
      ctx2.scene.background = s > 0.6 ? saved.bg : (SKYC.nightOut || (SKYC.nightOut = SKYC.night.clone().convertLinearToSRGB()));   // WEBGPU: a clear colour, given in sRGB (the canvas is drawn directly)
''', 'night background in sRGB')

    # ---------------------------------------------------------------- the compile step of initModules
    b.rep('''
      const ds = ent_depthScene();
''', '''
      await ent_gpuReady;   // WEBGPU: renderer.init() and the environment map first
      const ds = { tiny: null, variants: 0 };   // WEBGPU: no stand-ins for WebGLShadowMap's depth programs (ent_depthScene, kept for reference)
''', 'compile: await the backend')
    b.rep('''
      if (!document.hidden && typeof renderer.compileAsync === "function") {
''', '''
      if (typeof renderer.compileAsync === "function") {   // WEBGPU: the node renderer has compileAsync only (no compile()); it needs no frame
''', 'compile: compileAsync always')
    b.rep('''
        renderer.setRenderTarget(rt);   // the depth programs: keyed as in the shadow pass (see ent_depthScene)
        const p2 = renderer.compileAsync(ds.tiny, camera);
        renderer.setRenderTarget(null);
''', '''
        const p2 = null;   // WEBGPU: the shadow pass's pipelines are made in the first frame, still under the overlay
''', 'compile: no depth stand-ins')

    # ---------------------------------------------------------------- altar: the live flames
    b.insert_before('''
    const flameGeo = new PlaneGeometry(1, 1);
''', '''
    // WEBGPU: the flame in TSL (three.js's node shading language) - the same noise and colours as flameVS / flameFS above (kept for
    // reference): a camera-facing quad (vertexNode: the centre in view space plus the corner times uSize), fbm noise eating the tongue.
    // Each flame has its own uniforms; material.uniforms holds the same nodes, so the animation below (u.uTime.value = ...) is unchanged.
    // The GLSL wrote its colour as it is (no colour-space conversion, no tone mapping): sRGBTransferEOTF + toneMapped false keep that.
    const flameFbm = (() => {
      const T = TSL;
      const hash = T.Fn(([p]) => T.fract(T.sin(T.dot(p, T.vec2(127.1, 311.7))).mul(43758.5453)));
      const noise = T.Fn(([p]) => {
        const i = T.floor(p), f0 = T.fract(p), f = f0.mul(f0).mul(T.float(3).sub(f0.mul(2)));
        return T.mix(T.mix(hash(i), hash(i.add(T.vec2(1, 0))), f.x), T.mix(hash(i.add(T.vec2(0, 1))), hash(i.add(T.vec2(1, 1))), f.x), f.y);
      });
      return T.Fn(([p]) => noise(p).mul(0.5).add(noise(p.mul(2.03)).mul(0.25)).add(noise(p.mul(4.1)).mul(0.125)).add(noise(p.mul(8.3)).mul(0.0625)));
    })();
    const flameMaterial = (seed, opacity, w, hgt) => {
      const T = TSL;
      const uTime = T.uniform(0), uSeed = T.uniform(seed), uOp = T.uniform(opacity), uSize = T.uniform(new Vector2(w, hgt));
      const vUv = T.uv();
      const q = T.vec2(vUv.x.sub(0.5), vUv.y), t = uTime.add(uSeed.mul(0.37));
      const n1 = flameFbm(T.vec2(q.x.mul(2.6), q.y.mul(1.8).sub(t.mul(1.35))).add(uSeed));
      const n2 = flameFbm(T.vec2(q.x.mul(5.5).add(3.1), q.y.mul(3.6).sub(t.mul(2.6))).add(uSeed.mul(1.7)));
      const sway = n1.sub(0.5).mul(0.9).mul(q.y).mul(q.y).mul(2.2);
      const xw = q.x.add(sway).mul(T.float(1).add(q.y.mul(2.4)));
      const body = T.float(1).sub(T.smoothstep(0, T.float(0.42).sub(q.y.mul(0.18)), T.abs(xw)));
      const hh = q.y.add(n2.sub(0.5).mul(0.55).mul(T.float(0.3).add(q.y)));
      const tip = T.float(1).sub(T.smoothstep(0.3, 0.98, hh));
      const a0 = body.mul(tip).mul(T.float(0.75).add(n2.mul(0.5)));
      const a = T.clamp(a0.mul(T.smoothstep(0, 0.1, q.y)), 0, 1);
      const heat = a.mul(T.float(1.15).sub(q.y.mul(0.75)));
      let col = T.mix(T.vec3(0.55, 0.05, 0), T.vec3(1, 0.38, 0.04), T.smoothstep(0.08, 0.45, heat));
      col = T.mix(col, T.vec3(1, 0.72, 0.18), T.smoothstep(0.38, 0.75, heat));
      col = T.mix(col, T.vec3(1, 0.93, 0.65), T.smoothstep(0.72, 1.05, heat));
      const mat = new MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending, fog: false });
      mat.vertexNode = T.cameraProjectionMatrix.mul(T.modelViewMatrix.mul(T.vec4(0, 0, 0, 1)).add(T.vec4(T.positionLocal.xy.mul(uSize), 0, 0)));
      mat.colorNode = T.sRGBTransferEOTF(col);
      mat.opacityNode = T.pow(a, 1.25).mul(uOp);
      mat.toneMapped = false;
      mat.uniforms = { uTime, uSeed, uOp, uSize };
      return mat;
    };
''', 'flames: the TSL material')
    b.rep('''
      const mat = new ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uSeed: { value: flames.length * 7.31 }, uOp: { value: op * FIRE.heat }, uSize: { value: new Vector2(r * 2.6, h * 1.35) } },
        vertexShader: flameVS,
        fragmentShader: flameFS,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        fog: false
      });
''', '''
      const mat = flameMaterial(flames.length * 7.31, op * FIRE.heat, r * 2.6, h * 1.35);   // WEBGPU: the TSL flame (flameMaterial above)
''', 'flames: use it')

    # ---------------------------------------------------------------- altar: the sparks
    b.rep('''
    const sparksMesh = new Points(sparkGeo, new PointsMaterial({
      size: 0.28, map: sparkTex, vertexColors: true, transparent: true, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true, fog: false
    }));
''', '''
    // WEBGPU: the node renderer draws THREE.Points one pixel wide; the sparks are one Sprite drawn SPARKS times (instanced), with a
    // PointsNodeMaterial of the same size and size attenuation; positions and colours come from the same arrays (instanced attributes)
    const sparkPosA = new InstancedBufferAttribute(sparkPos, 3), sparkColA = new InstancedBufferAttribute(sparkCol, 3);
    sparkPosA.setUsage(DynamicDrawUsage);
    sparkColA.setUsage(DynamicDrawUsage);
    const sparkMat = new PointsNodeMaterial({ size: 0.28, transparent: true, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true, fog: false });
    sparkMat.positionNode = TSL.instancedBufferAttribute(sparkPosA);
    sparkMat.colorNode = TSL.texture(sparkTex).mul(TSL.vec4(TSL.instancedBufferAttribute(sparkColA), 1));
    const sparksMesh = new Sprite(sparkMat);
    sparksMesh.count = SPARKS;
''', 'sparks: instanced sprite')
    b.rep('''
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.color.needsUpdate = true;
''', '''
      sparkPosA.needsUpdate = true;   // WEBGPU: the sprite's instanced attributes (the same arrays)
      sparkColA.needsUpdate = true;
''', 'sparks: update')

ok = b.save()
sys.exit(0 if ok else 1)
