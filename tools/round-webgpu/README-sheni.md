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
     it without a renderer — PointLight 5 (187: 900) and the room not lowered (187: `position.y = -3.5`).
   - **1c** (three.js 187, WebGPURenderer; needs 1b): the renderer (`tm.engine` = `webgl` / `?engine=webgl` forces its WebGL 2 backend;
     `window.__tmBackend`), `renderer.init()` before the environment map / compile / first frame (`ent_gpuReady`), `Sky` → `SkyMesh`
     (`sky.material.uniforms` = the mesh's uniform nodes), no depth-program stand-ins, the live flames as a TSL node material
     (`material.uniforms` = its nodes), the sparks as an instanced `Sprite` with a `PointsNodeMaterial`, the header note.

`make_sheni.sh <source> <out> <webgl|webgpu> [library dir]` runs both steps and `node --check`.

Known difference that 1b does not remove: three.js 187 filters the environment map (PMREM) with GGX importance sampling
(three.js 160: a Gaussian blur into the cubeUV atlas). Rough stone gets clearly more light from the environment than before
(the "env only" part of a view: 55 → 86, 89 → 130, 120 → 152 in mean brightness), gold and bronze about the same (90 → 100, 135 → 131).
No single `scene.environmentIntensity` matches both; see the round's report.
