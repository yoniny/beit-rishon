# webgpu round — the Second Temple (בית שני)

The house has no module sources: its code is a readable bundle (2.0.18: `unified-plugin/sheni/bundle.js`; from 3.0: `sheni-src/bundle.js`,
the input of `tools/round-3.0.0/make.sh`). Every change of this round is made by scripts that find their places by **text anchors**,
never by line numbers, so they re-run on a newer readable bundle.

Two steps:

1. `sheni_lib.py <bundle> <library block>` — replaces the three.js library block: from after the IIFE opening and esbuild's two helpers
   (`var OtzariaPlugin = (() => {` … `  };`) up to the first module (`  // plugin/js/core.js`). Blocks (made outside the repo, from
   three@0.187.0 with esbuild): `lib187.js` (WebGLRenderer, flat scope, same section layout as before) and `lib-webgpu.js` (three.js's
   WebGPU build in its own inner IIFE `__lib`, its exports destructured into the plugin's scope; TSL functions as `TSL.xxx`). When the
   bundle closes its lines with ` //`, `tools/safe-lines.mjs` closes the new lines too.
2. `sheni_patch.py <bundle> 1b [1c]` — the module edits (`patchlib.py`: lines compared without the ` //` endings; a missing anchor is
   reported and fails the run):
   - **1b** (three.js 187, WebGLRenderer): `PCFSoftShadowMap` → `PCFShadowMap` (removed in 187); `RoomEnvironment` as three.js 160 built
     it without a renderer — PointLight 5 (187: 900) and the room not lowered (187: `position.y = -3.5`); the sky without 187's clouds
     (`cloudCoverage` 0; 187's default 0.4).
   - **1c** (three.js 187, WebGPURenderer; needs 1b): the renderer (`tm.engine` = `webgl` / `?engine=webgl` forces its WebGL 2 backend;
     `window.__tmBackend`); the canvas drawn directly, every material doing its own tone mapping (`ent_toneMapping`, skipped when
     `toneMapped` is false) and sRGB encoding through `renderer.contextNode`'s `getOutput`, with `renderer.toneMapping` /
     `outputColorSpace` left linear — so transparent things blend in display space as under WebGLRenderer (the renderer's own linear
     buffer made the flames and sparks pale and the smoke light), and the night clear colour given in sRGB; `renderer.init()` before
     the environment map / compile / first frame (`ent_gpuReady`); `Sky` → `SkyMesh` (`sky.material.uniforms` = the mesh's uniform
     nodes); no depth-program stand-ins; the live flames as a TSL node material (`material.uniforms` = its nodes); the sparks as an
     instanced `Sprite` with a `PointsNodeMaterial`; `material.clippingPlanes` / `clipIntersection` / `clipShadows` as the material's `maskNode` / `maskShadowNode`
     (accessors on `Material.prototype`; the WebGPU renderer clips by `ClippingGroup` only); the header note.

`make_sheni.sh <source> <out> <webgl|webgpu> [library dir]` runs both steps and `node --check`.

On 3.0 (the source of truth is `sheni-src/bundle.js`; `unified-plugin/sheni/bundle.js` is its minified build by
`tools/round-3.0.0/make.sh`):

```sh
git show origin/main:sheni-src/bundle.js > /tmp/sheni-src.js          # the pristine readable source
sh tools/round-webgpu/make_sheni.sh /tmp/sheni-src.js sheni-src/bundle.js webgpu
```

The environment light (in 1b, so in both builds): three.js 160 applied a material's `envMapIntensity` to the scene's environment map
too; since 163 it applies only with the material's own `envMap`, else `scene.environmentIntensity` (1). This house tunes it per material
(stone and paving 0.5–0.7, marble 1.1, gold and bronze 1.1–1.3), so under 187 the stone took about twice the environment light — the
brighter stone of the first comparisons (it was not the GGX filter of the PMREM). No single `scene.environmentIntensity` fits both stone
and gold, so a `Material.prototype.envMap` accessor makes a standard material without an envMap of its own, whose `envMapIntensity` is not
1, report the scene's current environment map as its envMap: both renderers apply its `envMapIntensity` again, and `scene.environment`
stays the switch (null at night). The WebGPU build vs 3.0.0's views: mean RMSE 0.129 → 0.094, median 0.069 → 0.020; mean luminance of the
clean views +8.5 → −0.3. Left: three.js 187 lights `MeshLambertMaterial` / `MeshPhongMaterial` by `scene.environment` too (160 did
not) — here one material, the incense cloud.
