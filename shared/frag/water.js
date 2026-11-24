  // ===== WATER_420 BEGIN - ONE WATER FOR BOTH HOUSES (shared/frag/water.js). The user, 24.11.2026 23:20: "כמה מסובך יהיה לעשות את כל
  // המקומות שיש מים כמים אמיתיים ולא סתם צבע תכלת?" - his choice "א" (in this round). Until now every water was a flat light-blue
  // colour of its own. Now its own material is kept (its colour, its map, its transparency) and taught to move:
  //   - small ripples that wander (four crossing waves of the world's place, so neighbouring vessels do not ripple alike), their slope bent
  //     into the surface's normal - the lights glint on it (low roughness);
  //   - the sky in it: at a grazing look the colour of the horizon (the fog's - so at night the night's) toward the height's, the more the
  //     flatter the look (Fresnel), and straight down the water's own colour, darker (depth);
  //   - running water ("flow"): the ripples carried along its way; falling water ("fall"): streaks that run down it.
  // No second rendering of the scene (a true mirror would draw the whole model again for every water - too heavy in Otzaria): the cost
  // is a few lines in the water's own pixels. tm_water(m, o) - the material, changed in place and returned; o = { mode: "still" | "flow" |
  // "fall", flow: [dx, dz] (amot a second; in the frame of userData.tmWater.obj when that is set), scale (the ripples' size, 1 - about an amah), amp (their slope, 1), refl (the sky's part, 1) }.
  // tm_waterTick(t, scene) - once a frame (90-entry.js). MODEL CHOICES: all the numbers (by pictures, by day and by night).
  var tm_waterU = { uTmT: { value: 0 }, uTmHor: { value: new Color(0xc9d8e6) }, uTmZen: { value: new Color(0x6f9cc8) } };
  var tm_waterZ = new Color();
  function tm_waterTick(t, scene) {
    tm_waterU.uTmT.value = (t || 0) / 1000;
    const f = scene && scene.fog && scene.fog.color, b = scene && scene.background && scene.background.isColor ? scene.background : null, h = f || b;
    if (h) {
      tm_waterU.uTmHor.value.copy(h);
      const hsl = { h: 0, s: 0, l: 0 };
      h.getHSL(hsl);
      tm_waterZ.setHSL(0.58, Math.max(0.35, hsl.s), Math.max(0.04, hsl.l * 0.72));   // the height: bluer and a little darker than the horizon
      tm_waterU.uTmZen.value.copy(tm_waterZ);
    }
  }
  function tm_water(m, o) {
    if (!m || !m.isMeshStandardMaterial || (m.userData && m.userData.tmWater)) return m;
    o = o || {};
    const mode = o.mode === "ribbon" ? 3 : o.mode === "fall" ? 2 : o.mode === "flow" ? 1 : 0, fl = o.flow || [0, 0];
    m.roughness = Math.min(m.roughness == null ? 1 : m.roughness, mode === 2 ? 0.18 : 0.1);
    m.metalness = 0;
    m.envMapIntensity = 0.35;   // (the scene's environment is a room's light - the sky is drawn here, below)
    m.userData.tmWater = { mode, flow: fl.slice(), scale: o.scale == null ? 1 : o.scale, amp: o.amp == null ? 1 : o.amp, refl: o.refl == null ? 1 : o.refl };
    const W = m.userData.tmWater;
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uTmT = tm_waterU.uTmT;
      sh.uniforms.uTmHor = tm_waterU.uTmHor;
      sh.uniforms.uTmZen = tm_waterU.uTmZen;
      let fw = W.flow;
      if (W.obj && W.obj.matrixWorld) {   // a flow given in the object's own frame ("obj": the mesh, set after it is made) - into the world's, at the first drawing (the mesh is in its place by then)
        const L = Math.hypot(fw[0], fw[1]), v = new Vector3(fw[0], 0, fw[1]);
        try { W.obj.updateWorldMatrix(true, false); } catch (_) {}
        v.transformDirection(W.obj.matrixWorld).multiplyScalar(L);
        fw = [v.x, v.z];
      }
      sh.uniforms.uTmFlow = { value: new Vector2(fw[0], fw[1]) };
      sh.uniforms.uTmS = { value: W.scale };
      sh.uniforms.uTmA = { value: W.amp };
      sh.uniforms.uTmR = { value: W.refl };
      sh.vertexShader = "varying vec3 vTmWP;\n" + (mode === 3 ? "attribute vec2 tmA; attribute vec2 tmT; varying vec2 vTmA; varying vec2 vTmT;\n" : "") + sh.vertexShader.replace("#include <begin_vertex>", [
        "#include <begin_vertex>",
        mode === 3 ? "  vTmA = tmA; vTmT = tmT;" : "",
        "#ifdef USE_INSTANCING",
        "  vTmWP = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;",
        "#else",
        "  vTmWP = (modelMatrix * vec4(transformed, 1.0)).xyz;",
        "#endif"].join("\n"));
      sh.fragmentShader = [
        "uniform float uTmT; uniform vec3 uTmHor; uniform vec3 uTmZen; uniform vec2 uTmFlow; uniform float uTmS; uniform float uTmA; uniform float uTmR;",
        "varying vec3 vTmWP;",
        mode === 3 ? "varying vec2 vTmA; varying vec2 vTmT;" : "",
        "float tmWh(vec2 p) {",
        "  float t = uTmT;",
        "  return sin(dot(p, vec2(1.0, 0.35)) * 2.1 + t * 1.3) * 0.5 + sin(dot(p, vec2(-0.45, 1.0)) * 2.9 + t * 1.7) * 0.35",
        "    + sin(dot(p, vec2(0.8, -0.7)) * 4.3 + t * 2.3) * 0.2 + sin(dot(p, vec2(-0.9, -0.25)) * 6.7 + t * 3.1) * 0.12;",
        "}",
        "vec2 tmWp() {",
        mode === 3 ? "  return vec2((vTmA.x - uTmFlow.x * uTmT) * 1.3, vTmA.y * 3.2) / uTmS;"   // along the stream (carried with it, stretched along it), across it
          : mode === 2 ? "  return vec2((vTmWP.x + vTmWP.z) * 7.0, vTmWP.y * 1.4 + uTmT * 3.6) / uTmS;" : "  return (vTmWP.xz - uTmFlow * uTmT) * 2.2 / uTmS;",
        "}"
      ].join("\n") + "\n" + sh.fragmentShader
        .replace("#include <color_fragment>", mode === 2
          ? "#include <color_fragment>\n  { float s = tmWh(tmWp()); diffuseColor.rgb *= 0.86 + 0.24 * s; }"
          : mode === 3 ? "#include <color_fragment>\n  { float s = tmWh(tmWp()); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.93, 0.97), smoothstep(0.72, 1.1, s) * 0.32); }"   // the crests a little white - running water
          : "#include <color_fragment>")
        .replace("#include <normal_fragment_maps>", [
          "#include <normal_fragment_maps>",
          "  {",
          "    vec2 p = tmWp(); float e = 0.05;",
          "    float h0 = tmWh(p), hx = tmWh(p + vec2(e, 0.0)), hz = tmWh(p + vec2(0.0, e));",
          mode === 3 ? "    vec3 T3 = vec3(vTmT.x, 0.0, vTmT.y), N3 = vec3(-vTmT.y, 0.0, vTmT.x); vec3 dW = (-(hx - h0) / e * 1.3 * T3 - (hz - h0) / e * 3.2 * N3) * uTmA * 0.03;"
            : mode === 2 ? "    vec3 dW = vec3(0.0, -(hz - h0) / e, 0.0) * uTmA * 0.05;" : "    vec3 dW = vec3(-(hx - h0) / e, 0.0, -(hz - h0) / e) * uTmA * 0.07;",
          "    normal = normalize(normal + (viewMatrix * vec4(dW, 0.0)).xyz);",
          "  }"].join("\n"))
        .replace("#include <opaque_fragment>", [
          "  {",
          "    vec3 Vw = normalize(cameraPosition - vTmWP), Nw = inverseTransformDirection(normal, viewMatrix);",
          "    float c = clamp(dot(Nw, Vw), 0.0, 1.0), fr = 0.04 + 0.96 * pow(1.0 - c, 5.0);",
          "    vec3 Rw = reflect(-Vw, Nw), sky = mix(uTmHor, uTmZen, smoothstep(0.0, 0.7, Rw.y));",
          mode === 2 ? "    outgoingLight = mix(outgoingLight, sky, fr * 0.35 * uTmR);" : "    outgoingLight = mix(outgoingLight * (0.78 + 0.22 * (1.0 - c)), sky, clamp(fr * 0.85 + 0.08, 0.0, 1.0) * uTmR);",
          "  }",
          "#include <opaque_fragment>"].join("\n"));
    };
    m.customProgramCacheKey = () => "tmWater" + mode;
    m.needsUpdate = true;
    return m;
  }
  // tm_waterRibbon(P, o) - running water on the ground (the user, 23:42, of the stream out to the Kidron: "קצת לא הגיוני שיש פס של מים, זה
  // אמור להיות יותר קולח"; 23:43: "אותו דבר בכל המקומות האלו"): not a strip of boxes - one soft ribbon along its way (the line P,
  // [[x, z], ...], rounded twice), its width changing (o.width(u) - the half width at the share u of the way), its edges fading into
  // the ground (seven across, the outer ones clear), every point of it laid on the ground (o.ground(x, z, fallback) + o.lift), and its
  // ripples carried along it (o.speed amot a second). o.edge - the alpha of the edges' next row (0.75; in a channel's walls 1).
  function tm_waterRibbon(P, o) {
    o = o || {};
    let L = P.map((q) => [q[0], q[1]]);
    for (let it = 0; it < 2; it++) { const Q = [L[0]]; for (let i = 0; i < L.length - 1; i++) { const a = L[i], b = L[i + 1]; Q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } Q.push(L[L.length - 1]); L = Q; }
    const n = L.length, S = [0];
    for (let i = 1; i < n; i++) S.push(S[i - 1] + Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]));
    const tot = S[n - 1] || 1, eA = o.edge == null ? 0.75 : o.edge;
    const AC = [[-1.25, 0], [-0.85, eA], [-0.4, 0.95], [0, 1], [0.4, 0.95], [0.85, eA], [1.25, 0]];
    const pos = [], col = [], ta = [], tt = [], idx = [], lift = o.lift == null ? 0.05 : o.lift;
    let lastY = null;
    for (let i = 0; i < n; i++) {
      const a = L[Math.max(0, i - 1)], b = L[Math.min(n - 1, i + 1)];
      let tx = b[0] - a[0], tz = b[1] - a[1]; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
      const nx = -tz, nz = tx, u = S[i] / tot, hw = o.width ? o.width(u) : 0.4;
      for (const [k, al] of AC) {
        const x = L[i][0] + nx * hw * k, z = L[i][1] + nz * hw * k;
        let y = o.ground ? o.ground(x, z, lastY) : 0;
        if (!isFinite(y)) y = lastY == null ? 0 : lastY;
        if (k === 0) lastY = y;
        pos.push(x, y + lift, z); col.push(1, 1, 1, al * (o.alpha ? o.alpha(u) : 1)); ta.push(S[i], k * hw); tt.push(tx, tz);
      }
    }
    const m7 = AC.length;
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < m7 - 1; j++) { const a = i * m7 + j, b = a + 1, c = a + m7, d = c + 1; idx.push(a, b, c, b, d, c); }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new Float32BufferAttribute(col, 4));
    g.setAttribute("tmA", new Float32BufferAttribute(ta, 2));
    g.setAttribute("tmT", new Float32BufferAttribute(tt, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    const m = tm_water(new MeshStandardMaterial({ color: o.color == null ? 0x3f78ab : o.color, roughness: 0.1, emissive: o.emissive == null ? 0x16324c : o.emissive, emissiveIntensity: o.glow == null ? 0.3 : o.glow,
      vertexColors: true, transparent: true, depthWrite: false }), { mode: "ribbon", flow: [o.speed == null ? 1.6 : o.speed, 0], scale: o.scale == null ? 0.4 : o.scale });
    const r = new Mesh(g, m);
    r.renderOrder = 2;
    r.userData.noPick = true;
    r.userData.tmLen = tot;
    return r;
  }
  // ===== WATER_420 END
