# Performance follow-up: audit, additional fixes and remaining work

Audit date: 2026-11-24. Implementation: [PR #1](https://github.com/yoniny/beit-rishon/pull/1). Continuing acceptance work: [Issue #2](https://github.com/yoniny/beit-rishon/issues/2).

This follow-up removes verified repeated work and resource growth, accelerates exact oblique terrain queries, and batches the spring's existing plants. It preserves model detail, resolution, lighting settings, historical readings, controls and active demonstrations. The broader weak-device objective remains open; isolated CPU-query gains and resource counts do not establish whole-application FPS or total memory savings.

The upstream baseline is `695456732c1d93db67268d13b7367cca76783aee`; the previously published PR head is `f8b9bef4ab312467f1a03367879e88df8422d1ba`. The [original performance report](performance.md) covers that first set of changes. Some follow-up fixtures compare with the published PR head; query benchmarks explicitly isolate one query path on the same current model.

## Two coordinated passes and independent review

**Pass 1:** the primary reviewer and three agents mapped the actual build/include graph, inspected the existing PR against upstream, and traced production rendering, navigation, UI, model construction, caches and resource ownership. Both houses' shared-source slots were included.

**Pass 2:** each owner followed behavior and invalidation through public controls and repeated transitions, checked shared versus private resource ownership, and exercised actual-code regressions. Independent reviewers then examined the changes. The user's recovered conversation supplied narrower leads for oblique rays, repeated world updates, lottery tags and spring plants; those were verified against current source and reimplemented rather than treating earlier unpreserved measurements as evidence.

| Owner | Production coverage across the two passes | Independent cross-review |
| --- | --- | --- |
| Primary reviewer | Build graph; `shared/70-ui.js`, `72-words.js`, `75-tour.js`, `90-entry.js` and both house slots; `unified/shell.html`, bridge, words index and update checker; build/release/CI integration | Rendering owner reviewed label/stone visibility gating and lottery pooling. Primary reviewer checked shared-resource disposal and environment/GI ownership. |
| Rendering agent | `shared/85-hq.js`, renderer/environment/shadows/clipping/frame scheduling in `90-entry.js`, both HQ/entry slots, core texture/material setup and relevant vendor contracts | Primary reviewer checked environment/GI changes; rendering agent independently reviewed UI picking, oblique traversal, spring batching and lottery tags. |
| Navigation agent | Camera, indoor constraints, zoom, walking/stairs, UI/tour rays; `shared/frag/raycast-bounds.js`, `terrain-raycast.js`; house-specific slots and geometry/instance mutation callers | Scene and rendering agents reviewed UI filtering, recursion and ties; rendering agent reviewed the oblique algorithm and reran its regression suite. Navigation agent independently reviewed scene disposal. |
| Scene agent | All active model modules in both houses; shared character, prop, garden and spring fragments; construction, replacement, animation subscriptions and disposal | Primary and navigation reviewers checked crowd/officer/water ownership. Rendering reviewer checked spring matrices, materials, shadow policy, floor eligibility and HQ behavior. |

Model coverage includes first-house `10-core`, `20-mount`, `30-courts`, `40-altar`, `45-vessels`, `50-heichal`, `55-interior`, `57-kelim`, `58-ark`, `59-parallels`, `60-palace` in [`src/`](../src/), and second-house `10-core`, `20-mount`, `30-courts`, `40-altar`, `45-vessels`, `50-heichal`, `55-payis`, `55-tamid`, `56-tamid-data`, `57-add208` in [`sheni/src/`](../sheni/src/).

Shared model fragments covered: `hand`, `face`, `people-kit`, `priest-kit`, `hp-kit`, `arm-k`, `strap`, `mizrak`, `copper`, `rose-garden`, `shiloach`, plus the two query fragments, in [`shared/frag/`](../shared/frag/). [Assembly](../tools/assemble.mjs), [house slots](../tools/house-slots.mjs) and [second-house building](../tools/build-sheni.mjs) define the inclusion boundary.

This is two coordinated production-source and invariant reviews, not four independent readings of every repository line. Historical `src/ref-*`, archived `tools/round-*`, research text and unrelated vendored engine internals are outside the active-runtime claim. Historical content was not re-audited for accuracy. Relevant Three.js disposal/raycast/render contracts were inspected; generated bundles are verified against rebuilds instead of reviewed as independent source.

## Eleven follow-up areas implemented in the PR

The F identifiers match Issue #2. “Implemented” describes the source changes and targeted development checks; the final integrated follow-up CI run is still pending at this document's initial publication.

| ID | Source and change | Evidence and preservation checks |
| --- | --- | --- |
| F1 | [`people-kit.js`](../shared/frag/people-kit.js), [`57-add208.js`](../sheni/src/57-add208.js): dispose replaced festival crowd handles, unregister LOD/sash updates, detach all LOD siblings and release instance buffers | Forty fixture replacements release 640 attached instances; eight real festival replacements release 14,004. The two tested layouts retain 4,310 / 4,791 people and 14 dancers. Shared geometry/materials remain live. |
| F2 | [`30-courts.js`](../sheni/src/30-courts.js), `makeMan` / `gevPlace`: replace the officer through its crowd handle and release the private marker geometry | Forty gate-reading changes retain 209 objects, 152 mesh components, 26 sash subscriptions and 626 label records; release 440 outgoing instances and 40 rods. The herald remains at the selected gate. |
| F3 | [`55-tamid.js`](../sheni/src/55-tamid.js), `KID.water`: release private geometry/material when spout mode or laver size changes | Twelve selections across six size/mode combinations release 1,122 geometries and 11 materials; all 17 / 204 water parts and revisited-state geometry/transforms match. Unchanged and dry→same-wet states reuse the group. |
| F4 | [`90-entry.js`](../shared/90-entry.js): release one-shot PMREM generator, room and room-instance resources after environment baking | Keep the generated environment texture alive and unchanged. The [WebGL fixture](../tools/perf-environment.mjs) checks disposal, retained counters and pixel equality; its final follow-up CI result is pending. No measured total-GPU-memory saving is claimed. |
| F5 | [`85-hq.js`](../shared/85-hq.js), `warmScene`, and entry initialization: omit unavailable GI-only startup shader stand-ins | Warmup fixture nodes decrease 7→5 while all normal/depth and AO variants remain prepared. Internal later GI use compiles its lit scene and both fullscreen shaders before use; mode/resize/restore tests cover that path. |
| F6 | [`70-ui.js`](../shared/70-ui.js), [`raycast-bounds.js`](../shared/frag/raycast-bounds.js): use exact broad-phase and nearest accepted hits for UI queries | Preserve distinct measurement/label material and clipping rules, later valid faces, hidden ancestors, custom recursive stops and stable ties. Add conservative fallback for custom vertex-position functions. See query evidence below. |
| F7 | [`90-entry.js`](../shared/90-entry.js), [`70-ui.js`](../shared/70-ui.js): remove unused `ent_sol.walls/big`, skip disabled-label updates and hidden-house stone scans | Retain identical ordered solid/roof/floor lists while avoiding 776 / 1,882 unused bounds records per refresh. Re-enabled labels refresh before drawing; overdue stone scans complete before the resumed frame. Ordinary resize does not force a scan. |
| F8 | [`terrain-raycast.js`](../shared/frag/terrain-raycast.js): accelerate oblique queries through conservative crossed grid cells and displaced-cell bounds | Delegate exact triangle tests to Three.js, preserve face order and full hit records, and retain unsupported/nonfinite fallbacks. Nineteen regression groups contain 5,658 exact comparisons; actual-model probes add 768 comparisons. |
| F9 | [`90-entry.js`](../shared/90-entry.js), `ent_renderFrame`: update scene world matrices once after animation and reuse them across HQ/beauty passes | AO scene traversals decrease 2→1; internal GI paths 3→1; HQ-off remains 1. Camera updates stay independent. Flags restore even on failure; exact world matrices match on fixtures and both actual models. |
| F10 | [`55-payis.js`](../sheni/src/55-payis.js), `tag`: reuse hidden winner sprites by their stable text/size instead of accumulating new resources | 172 equivalent visible-state comparisons across both readings; maximum 13 simultaneously visible tags. Original comparison exercise retains 1,452 sprites/materials/textures; pooled source retains 16 of each, unchanged after 20 replay/seek/reading cycles. |
| F11 | [`shiloach.js`](../shared/frag/shiloach.js) and both demo callers: instance exact opaque fern/leaf geometry/material combinations | Retain every plant and transform; keep water, foam and mutable boulders separate. First-house channel clearing precedes batching, its old merger skips instances, and its shadow policy remains intact. Counts and tradeoffs appear below. |

Lifecycle checks execute actual builders and public transitions: [crowds](../tools/perf-resources-crowd.mjs), [festival/lamp states](../tools/test-lamp-lifecycle.mjs), [officer](../tools/test-officer-lifecycle.mjs), [water](../tools/test-water-lifecycle.mjs), [lottery tags](../tools/test-payis-label-lifecycle.mjs). They assert no disposal of shared live resources. Resource-release event counts are not measurements of total browser heap or GPU memory.

The recovered label leak is specifically the lottery's winner-tag pool, not the main UI label group or every `ctx.labels` list. Water replacement occurs on mode/size changes, not every animation frame. The rose garden was already instanced; the newly batched cluster is the Shiloach spring.

## Measured gains and their limits

### Exact oblique queries

The [raw oblique report](performance-results/oblique-rays.json) retains source hashes, hardware, all timing samples and exact comparisons. Each timing is the median of three paired warm batches of 24 rays, using four actual overview/interior views at 960×600 and 48° FOV. Both sides use the same current model; the reference replaces only the coarse-terrain triangle method with stock Three.js. DOM/canvas/audio are stubbed; no GPU rendering is timed.

| Model/state and workload | Reference CPU time | Optimized CPU time |
| --- | ---: | ---: |
| First house, coarse Rashi, terrain only | 1,261.40 ms | 3.41 ms |
| First house, coarse Rashi, complete cursor-anchor query | 1,093.59 ms | 77.81 ms |
| First house, refined Rashi, terrain only | 1,269.29 ms | 3.09 ms |
| First house, refined Rashi, complete cursor-anchor query | 1,096.43 ms | 77.70 ms |
| Second house, default, terrain only | 1,266.97 ms | 3.03 ms |
| Second house, default, complete cursor-anchor query | 1,545.72 ms | 121.09 ms |

The complete cursor-query batches use about 92–93% less CPU in this run. This is an isolated-query result, not a 13–14× application speedup. The first measured first-house queries after reading/index changes take 53.7–59.4 ms, including lookup preparation. Second-house construction had already exercised its lookup, so “first measured” is not uniformly “cache cold.” Startup and first-interaction stalls remain tracked.

The [UI-query report](performance-results/ui-rays.json) separately records 204 synthetic, 96 actual-model UI and 24 flat-list exact comparisons. Twelve-ray warm batches decrease from 819.48→691.37 ms / 815.97→640.32 ms for first-house measurement/labels, and 1,042.37→708.58 ms / 988.76→722.32 ms for the second house: 16–32% in those batches. This snapshot predates the oblique patch and isolates UI routing; these percentages must not be added to or multiplied by the later oblique gains.

### Spring geometry and bounded repeated demonstrations

The [raw spring report](performance-results/spring-geometry.json) compares the previous published source with the changed source, using vendored Three.js and three deterministic configurations. [Its test](../tools/test-spring-geometry.mjs) expands instances and checks geometry attributes, materials, flags, transforms, animated water and subsequent helper additions; both real demo callers are also exercised.

| Spring fixture metric | Before | After | Interpretation |
| --- | ---: | ---: | --- |
| Second-house mesh objects | 974 | 54 | All 974 components and 49,026 triangles retained; potential submission reduction, not measured WebGL draw calls |
| Second-house geometry + instance arrays | 897,436 bytes | 956,636 bytes | Existing shared geometry is unchanged; 59,200 bytes of instance transforms replace individual Mesh objects |
| First-house geometry + instance arrays | 3,855,068 bytes | 2,146,716 bytes | 44.3% less buffer storage than its previous baked-geometry merge |
| First-house mesh objects / triangles | 15 / 64,510 | 16 / 64,510 | One additional mesh/submission candidate; this branch improves memory, not draw count |

The first-house fixture removes the same 23 channel components before either finalization path. The actual first-/second-house callers retain 1,130 / 925 plant components in five batches each. Maximum expanded matrix error is `1.5844e-6` amah from Float32 storage, within the existing `2e-5` tolerance. Canvas drawing is stubbed; this is not a rendered-pixel comparison. Aggregate instance bounds can submit more offscreen geometry, so adverse spring views remain part of device acceptance.

The [lottery report](performance-results/payis-label-lifecycle.json) records the 1,452→16 resource bound and 20 stable replay cycles. Its real production painter is exercised through a canvas stub: winner text, drawing inputs, positions, visibility, sizes and resource settings match. It does not prove rasterized Hebrew-font or GPU-pixel identity.

### Rendering operation counts and previous browser evidence

[Frame-matrix checks](../tools/perf-frame-matrices.mjs) compare exact per-pass matrices for 2,133 first-house and 5,361 second-house objects, including moved parents, section mode and late children. The AO 2→1 traversal reduction does not imply a 50% frame-time reduction. The separate WebGL mode requires pixel equality over five lighting modes × three poses per house; final follow-up CI is pending.

The earlier [successful CI run 45261020536](https://github.com/yom-chadash/beit-rishon/actions/runs/45261020536) validated the previously published revision, including actual Chromium/SwiftShader rendering and unified-shell behavior. Its second-house overview draw submissions fell 2,334→2,142 with 928,290 triangles unchanged. An interior view instead rose 447→449 submissions and added 900 triangles because instance bounds were coarser. Preserve this counterexample; the old run does not validate the new follow-up commits.

The old 40% AO/GI render-target estimate applies after visiting internal GI as well as AO. The product UI currently sets `giReady:false`; it is neither a default-user saving nor a 40% reduction in application RAM. [HQ tests](../tools/perf-hq-test.mjs) distinguish target allocation estimates from actual driver/process memory. Resolution, shader samples and lighting algorithms are unchanged.

## Verification status and reproduction

All 15 Node commands from the regression workflow passed sequentially on `f0a843af6174740379c0b4c1559b582775b3aff8`, with unchanged source trees throughout the run. The subsequent test-only maintenance change moves lottery, spring and UI comparison references to the reachable upstream baseline, so squash-merging the PR does not require a fork-only Git object; all three affected checks passed again. Historical measurement snapshots retain their original, explicitly recorded references.

Both final house builds have passed locally. The local Chromium process cannot launch because `socket()` is denied by the environment; no local browser success is claimed. The integrated environment/matrix pixel fixtures, tracked-bundle comparison and shell/browser checks run in GitHub Actions. Their final tested revision and run-specific outcome are recorded in [PR #1](https://github.com/yoniny/beit-rishon/pull/1) and [Issue #2](https://github.com/yoniny/beit-rishon/issues/2), separately from these local results.

[The performance workflow](../.github/workflows/performance.yml) runs Node and browser/build jobs separately and retains reports/screenshots as artifacts. Its commands are the authoritative complete reproduction list. Focused follow-up entry points include:

```sh
node tools/perf-terrain-test.mjs
node tools/perf-ui-rays.mjs --out qa/performance/ui-rays.json
node tools/perf-oblique-model.mjs --out qa/performance/oblique-rays.json
node tools/perf-frame-matrices.mjs --out qa/performance/frame-matrices.json
node tools/test-officer-lifecycle.mjs
node tools/test-water-lifecycle.mjs
node tools/test-payis-label-lifecycle.mjs
node tools/test-spring-geometry.mjs
CHROME=/usr/bin/google-chrome node tools/perf-environment.mjs --out qa/performance/environment.json
CHROME=/usr/bin/google-chrome node tools/perf-frame-matrices.mjs --browser --out qa/performance/frame-matrices-webgl.json
```

The original [geometry](performance-results/geometry.json), [vertical rays](performance-results/rays.json) and [indoor-camera](performance-results/indoor-camera.json) snapshots remain evidence for their stated revisions/workloads. A source hash or baseline recorded in a snapshot takes precedence over assuming it represents the latest PR head. Node fixtures, software-renderer screenshots and physical-device performance answer different questions.

## Remaining acceptance work: Issue #2 stays open

The following identifiers and priorities match the [17-task issue backlog](https://github.com/yoniny/beit-rishon/issues/2). None is closed by this document or automatically by merging PR #1.

| ID | Priority | Remaining work and source | Required acceptance |
| --- | --- | --- | --- |
| R1 | P1 | Demand-driven rendering and explicit active-animation ownership in `shared/90-entry.js` | No repeated renders during 30 settled seconds with no visible animated content; next-frame input/resize response; visible fire, water, people and tours retain cadence. |
| R2 | P1 | Cache unchanged indoor constraints in `guardCamera` / `cam_keepInside`, including the watchdog | No redundant idle-room rays; invalidate on pose, animated/hidden surfaces, section and mode changes; identical moving-camera corrections. |
| R3 | P1 | Material-change registration for `ent_sectionApply` | No whole-model scan for an unchanged section; late/replaced/fade-cloned materials and all axes clip correctly; original sides restore. |
| R4 | P1 | Separate static/dynamic shadow casters in `ent_shadowRefresh` | Avoid unnecessary full scans without stale shadows after instance, material, light, section or structural changes; no arbitrary frame skipping. |
| R5 | P1 | Scene mutation revisions for entry/UI/tour solid, roof and pill candidate caches | Immediate correct results after readings/rebuilds; fewer idle scans; rapidly changing opacity remains current. |
| R6 | P1 | Share candidates across `cam_walkFloor` stair/support sweeps | Identical steps, gaps and landings across speeds; no tunneling or stale candidate lists. |
| R7 | P1 | Explicit instance/private-material cleanup and unchanged-profile reuse in `src/59-parallels.js/buildChannel` | Resources plateau across terrain/channel changes; profile, texture phase, clipping/picking and shared stone/texture ownership remain correct. |
| R8 | P1 | Incremental/on-demand lottery preparation in `sheni/src/55-payis.js` | Profile its initial 303 meshes / 720,548 expanded triangles, including hidden variants; reduce long tasks without moving the freeze to first demo use. |
| R9 | P1 | Schedule first-demo route/crowd preparation in `src/59-parallels.js` and `sheni/src/57-add208.js` | Lower first-start latency/long tasks; preserve routes, people counts and terrain heights for every reading; no visible partial builds. |
| R10 | P1 | Split synchronous work inside `initModules`; measure parse/build/texture/shader/first-draw separately | Responsive loading without slower completion/first-demo use, missing content or quality reduction. |
| R11 | P1 reliability | Real WebGL context-loss restoration of generated PMREM and saved day/night environment references | Repeated `WEBGL_lose_context` cycles in both houses and active demos restore valid lighting and stable resources; simulated rebind alone is insufficient. |
| R12 | P2 | Hidden non-RAF timers: 300 ms demo controls, 60 ms audio and shell polling | No unnecessary hidden layout/scans or resume bursts/duplicate callbacks; retain documented audio, time and demo-state semantics. |
| R13 | P2 | Camera/lens/layer/section/card/layout invalidation for labels and model pills | Fewer idle calculations/DOM writes; identical sizes, ordering, positions, sources, Hebrew rendering and first-enable behavior. |
| R14 | P2 | Remaining tour/UI rays and measured candidate allocation/sort costs | Preserve full hits, ties, custom recursive behavior and clipping rules; no retained-heap growth after rebuilds. |
| R15 | P2 | Shared repeated water primitives and additional narrowly scoped, spatially bounded decoration batches | Improved real-view submissions without excessive offscreen triangles or loss of independent fade, cutaway or reading controls. |
| R16 | P2 | Explicit memory policy for disabled effects and retained house iframes | Measured savings without toggle hitches; exact camera/layer/reading/tour/demo restoration before evicting user state. |
| R17 | Completion gate | Matched physical weak-device and Otzaria WebView measurements | Record p50/p95/p99 frame time, long tasks, startup/demo latency, CPU, heap and GPU-resource counters with hardware/browser/viewport/DPR/commit. |

R17 must cover both houses: cold/warm opening, overview/interior idle, orbit, zoom on both screen sides, stairs, labels on/off, all section axes, AO, first/repeated lottery/morning-service/festival demos, reading changes, house switches and document hide/resume. Measure CPU and GPU separately and include views where instancing increases submitted triangles.

**Future completion goals, not achieved measurements:** at least 30% lower p95 frame time in fixed worst navigation/orbit scenarios in both houses; at least 50% less idle CPU where no visible animation is active; no unbounded resource growth over 40 warm demo/reading/house cycles; startup and first-demo latency no worse than baseline +10%. Any regression above 5% in a critical adverse view must be investigated and explained or fixed, not omitted. Compare identical DPR, viewport, quality, audio and timing settings while preserving all features.

Close Issue #2 only after the substantial changes are merged, repeated cycles no longer accumulate resources, visual/behavioral acceptance passes, and a reproducible complete comparison on weak hardware demonstrates the intended improvement. That physical-device comparison is still pending.
