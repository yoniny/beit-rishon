# Performance work: CPU queries, scene submission and retained resources

This change targets the expensive work performed while navigating the models, the work done by hidden houses, and resources allocated for features that are not being displayed. It keeps the existing rendering resolution, shadow settings, lighting algorithms, model detail, demonstrations and controls.

The source baseline is `695456732c1d93db67268d13b7367cca76783aee`. The regression scripts use the repository's vendored Three.js and actual model builders; no runtime dependency was added. The [follow-up audit](performance-followup.md) records the additional oblique-ray, lifecycle, lighting and spring improvements after the initially published PR head `f8b9bef`.

## What changed

### Camera and terrain queries

The coarse mountain is a 220 × 220 height grid containing 96,800 triangles. Previously, an ordinary downward floor query could test every triangle. `tm_terrainRaycast` validates its lattice and index topology once, locates the ray's cell, and delegates only that cell and its neighbours to the existing Three.js triangle implementation. In an unchanged part of the grid, at most 18 triangles are visited. Visiting neighbouring cells preserves exact edge and vertex hits; sorting the selected index ranges preserves equal-distance hit order.

The first-house UI also selects the Rashi room-width reading after model construction, moving eight terrain vertices across 15 cells. A strict rectangular-grid accelerator would silently fall back everywhere in this actual default state. The final implementation additionally visits conservative bounds for these locally deformed cells, even when vertices move across many nominal cells. It combines and deduplicates those candidates before the same exact triangle routine. More than 256 deformed cells fall back to the full path rather than creating a large per-query linear scan.

The accelerator supports the first house's refined valleys, which replace subsets of coarse terrain cells. It invalidates the lookup when position/index attributes or their versions change, including switching between Rashi and Rambam. Oblique rays now traverse conservative grid-row intervals, clipped to the terrain's height range, and separately test displaced-cell bounds. Morphs, custom vertex positions, unsupported topology and material arrays retain the original path. The lookup uses 197,136 bytes of typed arrays per coarse mountain, plus small JavaScript object overhead and the bounded deformed-cell records; its first-use validation cost is reported separately.

Camera picking also uses conservative world-space bounding boxes before the exact Three.js raycast. Boxes follow geometry, instances and parent transforms. Queries that only need the nearest result visit candidates in distance order and stop when the remaining boxes cannot beat it. Unbounded/custom/deformed objects retain their exact test. Zoom candidates exclude hidden and non-pickable branches before intersecting them, using the previous post-hit eligibility rules.

Those bounds add cached boxes and matrices per queried object/geometry. The maps are weakly keyed, allowing discarded scenes to be collected. This trades some retained CPU-side metadata for substantially fewer triangle tests; total browser heap reduction is not claimed.

The indoor orbit constraint now filters its candidates to surfaces marked by the wall-fade system before raycasting. It previously intersected terrain and props on every indoor frame and then discarded every unmarked hit. The same camera correction and section-plane rules still apply. Avoiding irrelevant objects remains useful even after adding the oblique terrain accelerator.

### Hidden rendering and frame allocations

The old hidden-document timer rendered each loaded house four times per second, bypassing normal browser frame suspension. Hidden documents now stop that drawing. The unified shell also tells each house whether it is visible so its resize/camera watchdog can suspend the same work. Loading and restoration of the visible house remain supported, and switching houses retains their state.

The shadow cache reuses scratch arrays and state rather than allocating per shadow-casting object on each frame. Section clipping handles scalar materials directly instead of allocating a one-element array for every mesh visit. Neither change alters shadow invalidation or clipping rules.

### Repeated architecture

The second house now instances more static, opaque repeated components. Objects with independent transparency ordering, visibility or animation remain independently controlled.

| Component | Previous mesh objects | New batches |
| --- | ---: | ---: |
| Stair and landing rail posts | 273 | 40 |
| Opaque ulam window frames | 64 | 2 |
| Skylight curbs | 108 | 2 |
| Women's court roof beams | 35 | 3 |
| Broken soreg boards | 91 | 7 |
| Guard bodies and heads | 48 | 4 |

Transparent ulam panes retain individual sorting and share immutable geometry. The 24 guard distance markers retain their individual animated scale. Section clipping, shadows, historical readings and roof controls are covered by the actual-model comparison.

Combined model-only counts, before deferred lamp variants are requested:

| Metric | Baseline | Updated |
| --- | ---: | ---: |
| Second-house mesh objects | 4,936 | 4,375 |
| Unique geometries | 4,015 | 3,398 |
| Expanded mesh components | 30,728 | 30,728 |
| Geometry-buffer bytes | 21,226,444 | 20,641,556 |
| Instance-buffer bytes | 1,738,752 | 1,778,368 |
| Default visible mesh candidates | 2,281 | 2,089 |
| Whole-roof visible mesh candidates | 2,394 | 2,096 |

This is 561 fewer mesh objects (11.4%), 617 fewer geometries (15.4%), and a net 545,272 fewer geometry/instance-buffer bytes. These model counts do not include the browser UI and are not GPU draw-call or FPS measurements. Instanced bounds can submit additional offscreen instances, so GPU triangle counts need not fall with object counts.

### Character and demonstration resources

Hand grip positions and finger skeletons no longer construct the expensive surface geometry. Surface construction occurs on the first `.geo` access and retains the typed geometry rather than duplicate intermediate JavaScript arrays. The generated geometry remains unchanged when requested. A 48-case pose/detail/side regression covers 98,790 vertices and 5,536,200 bytes of final geometry buffers with the same SHA-256 digest. This defers unnecessary work; requesting every hand surface still incurs that surface work.

Crowd close-face selection is cached while camera position, lens factor, parent world matrix and poses are unchanged. Moving or reposing a crowd invalidates it. Hidden ancestor groups skip their LOD updates until shown. With an 80-person fixture using the real crowd code over 600 stationary frames, distance calculations fall from 48,600 to 600; with the ancestor hidden they fall to zero. The same six detailed faces and LOD transitions remain available.

Festival lamp variants are built when shown or played, rather than by hidden configuration changes and cleanup. Forty hidden roof/configuration cycles allocate zero lamp models; the baseline eagerly creates two cached variants totalling 692 objects and 524 meshes. The baseline cache is bounded, not an unbounded memory leak. All four visible variants, pouring/burning states, pause/resume and repeated warm cycles are tested. Construction order can change the procedural flame phase, whose original seed already depends on that order; flame detail and animation remain intact.

### Optional AO/GI buffers

AO and GI resolve paths are mutually exclusive: the GI result already contains the AO term when both switches are enabled. They now reuse the same pair of half-float colour targets. Fullscreen colour passes no longer allocate unused depth attachments. GI-only frames skip the normal/depth prepass while the lit shaders are still compiling; no consumer could use that prepass yet.

At a 1920 × 1080 drawing buffer, the existing half-resolution effects use 960 × 540 targets. After visiting AO and GI, colour-target storage falls from 22,809,600 to 14,515,200 bytes. Including an estimate of four bytes per depth attachment, the targeted render-buffer total falls from 31,104,000 to 18,662,400 bytes (40%). Actual allocation depends on the graphics driver. **GI is currently unavailable in the public UI (`giReady: false`), so this combined-mode estimate is not a default-user saving or a claim of 40% lower total application memory.** Effect resolution, samples and shaders are unchanged. Startup now skips the two unavailable GI-only shader stand-ins and still prepares them if GI becomes available internally later.

## Verification and measurement scope

### Recorded CPU query results

The committed [measurement snapshots](performance-results/) retain the workload, hardware and source revision. The query rows below are from the local Linux validation runner (Intel Xeon, Node 24) with the actual first-house UI default selected. Each entry is the median of three warm batches. Runner load affects absolute times, so compare the two columns within a row; these numbers are not a hardware-independent performance budget.

| Isolated workload | Original query path | Optimized path |
| --- | ---: | ---: |
| First house: 40 downward queries, Rashi/coarse terrain | 4,509.69 ms | 19.75 ms |
| First house: 40 downward queries, Rashi/refined valleys | 2,174.69 ms | 18.48 ms |
| Second house: 40 downward queries | 2,622.66 ms | 72.62 ms |
| First house: 35 nearby indoor-orbit constraints, Rashi | 3,331.98 ms | 238.66 ms |
| Second house: 10 nearby indoor-orbit constraints | 558.65 ms | 5.09 ms |

The terrain comparison keeps the current scene and replaces only the query path with original Three.js raycasting. The indoor comparison already includes terrain acceleration in both columns and isolates the additional early room-surface filter. All compared hit data/camera positions match. The first coarse-terrain lookup in the Rashi state took 83.48 ms in this run, including lookup validation and ordinary first-query setup; warm timings exclude that one-time cost. These are CPU query timings, not full frames or application speedup factors.

### Correctness and browser coverage

The test suites distinguish correctness, operation counts and runtime measurements:

- `perf-terrain-test.mjs`: 5,658 exact-hit comparisons across random vertical/oblique/grazing rays, lattice boundaries, holes and reordered cells, local deformations and distant folds, transforms, buffer changes, morph/custom fallbacks, near/far limits and draw ranges. The unchanged triangle routine supplies the complete hit data. A deliberately broken candidate selector fails the displaced-triangle cases.
- `perf-render-test.mjs`: broad-phase and nearest-hit equivalence, visibility and eligibility rules, geometry/instance mutations, tie order, shadows and clipping.
- `perf-ray-model.mjs`: 1,260 actual-model ray comparisons in both houses, including the actual Rashi UI default, restoration to Rambam, and 995 refined valley cells in both readings. The reference uses the same current scene with the original terrain routine and ordinary raycasting. It reports cold cost and warm medians separately. A second workload checks 56 indoor camera corrections, including every clipping axis, and times the nearby orbit viewpoints that call the production room constraint. It is not a whole-application before/after benchmark. Use `--room-only` for the latter workload alone.
- `perf-geometry.mjs`: baseline-to-candidate comparison of expanded geometry, indices, UVs, material settings, shadow/picking flags and world transforms. The second house covers 25 states and 331 actual raycasts through newly instanced groups. Float32 instance storage introduces at most 0.000006104 amot of world-matrix difference and 0.000000115 amot of ray-hit-point difference in these checks.
- `perf-resources-hand.mjs`, `perf-resources-crowd.mjs`, `test-lamp-lifecycle.mjs`: exact generated hands, crowd selection/invalidation and deferred demonstration lifecycle.
- `perf-hq-test.mjs`: mode switching, resize, simulated context restoration, material restoration, target allocation and absence of framebuffer feedback using the real HQ code with a recording renderer.
- `perf-scene.mjs`: actual Chromium/SwiftShader rendering of both houses, overview/interior captures, floor/zoom queries and AO/GI mode checks. Draw counts are sampled after the shadow cache settles. Each effect's `beautyDraw` field counts the final beauty pass, not its preceding HQ passes. Its manually invoked, frozen-time animation callbacks are diagnostics, not frame times.
- `qa-unified.mjs`: the real unified shell and standalone HTML, SDK bridge, house switching, preserved camera position, hidden-house suspension, background-document suspension and resumed drawing.

Canvas, DOM and audio are stubbed only in the Node model tests. They establish geometry and logic equivalence, not pixel identity. The separate browser runs exercise actual WebGL and save screenshots. SwiftShader measurements describe the CI runner, not a low-end user's physical GPU, and no whole-application FPS or total RAM improvement is inferred from the isolated query speedups.

## Reproduce

The `Performance regression checks` workflow runs the Node suites and the browser/build checks in separate jobs. It saves JSON reports and browser captures as artifacts. The build requires Node.js, `npm ci`, a Chromium executable and the existing `rsvg-convert` dependency from `librsvg2-bin`.

```sh
node tools/perf-render-test.mjs
node tools/perf-terrain-test.mjs
node tools/perf-resources-hand.mjs
node tools/perf-resources-crowd.mjs
node tools/perf-hq-test.mjs
node tools/test-lamp-lifecycle.mjs
node tools/perf-geometry.mjs --baseline-ref 695456732c1d93db67268d13b7367cca76783aee --out qa/performance/geometry.json
node tools/perf-ray-model.mjs --out qa/performance/rays.json

npm ci --no-audit --no-fund
npm run build
node tools/build-sheni.mjs --house build/sheni/house
node tools/build-unified.mjs --sheni build/sheni/house --no-pack
CHROME=/usr/bin/google-chrome node tools/perf-scene.mjs dist-unified/plugin rishon qa/performance
CHROME=/usr/bin/google-chrome node tools/perf-scene.mjs dist-unified/plugin sheni qa/performance
CHROME=/usr/bin/google-chrome node tools/qa-unified.mjs dist-unified/plugin --shots qa/unified
```

Pass `--standalone dist-unified/<generated-file>.html` to the last command to test the one-file build too. The workflow does this automatically.

## Further audit

The primary reviewer and three agents completed two coordinated source/invariant passes and cross-reviewed changes. Coverage and limits are recorded in the [follow-up audit](performance-followup.md). The large repeated architecture is already merged or instanced, but that does not remove the remaining idle CPU, startup, shadow/section invalidation and first-demo costs. Other groups have independent fade, cutaway, hinge or historical-reading behaviour; further batching must preserve those controls and in-place edits.

[Issue #2](https://github.com/yoniny/beit-rishon/issues/2) tracks the remaining prioritized work and acceptance criteria, including real weak-device frame-time and memory measurements. It remains open independently of this PR. Isolated query speedups, source-level operation counts and software-renderer checks do not establish whole-application performance on the user's computer.
