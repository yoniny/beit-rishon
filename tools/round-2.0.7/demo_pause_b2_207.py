#!/usr/bin/env python3
# DEMO_PAUSE_207 PART 2 (the second house): the lotteries (55-payis.js), the camera's walks, the great gate and the wickets (50-heichal.js)
# can pause - their entries of demoStops get pause() / resume() / paused() (and restart() where it can). A press on the model no longer
# ends them (90-entry.js pauses them). Idempotent.
import os
O = '/home/claude/b2src/src'
def edit(rel, mark, pairs):
    p = os.path.join(O, rel); s = open(p, encoding='utf-8').read()
    if mark in s: print('already:', rel, mark); return
    for a, b in pairs:
        assert s.count(a) == 1, (rel, a[:90], s.count(a))
        s = s.replace(a, b)
    assert mark in s
    open(p, 'w', encoding='utf-8').write(s); print('edited', rel, mark)
# ---------------------------------------------------------------- the lotteries
edit('55-payis.js', 'DEMO_PAUSE_207', [
    ('''    ctx2.animated.push(() => { if (RUN) step(); });
    try { ctx2.renderer.domElement.addEventListener("pointerdown", () => { if (RUN && RUN.hold < 0) stop(); }, true); } catch (_) {}
    (SH.demoStops || (SH.demoStops = [])).push({ id: "crt-payis-demo", running: () => !!RUN, stop: () => { if (!KEEP) stop(); } });
''',
     '''    ctx2.animated.push(() => { if (RUN) step(); });
    // DEMO_PAUSE_207 (the user, 12.11.2026 20:34: "ההדגמה של הפייסות היא 4 דקות. אדם שעצר צריך להתחיל מההתחלה. יש סיכוי להשהות"): a press on
    // the model pauses the run (90-entry.js) - the clock stands at its second (hold), the eye is free; resume() goes on from that second,
    // the eye coming back to the demonstration's in under a second (blend); until 2.0.7 a press ended it
    const pauseRun = () => { const R = RUN; if (!R || R.paused != null || R.hold >= 0) return; R.paused = (performance.now() - R.t0) / 1000; R.hold = R.paused; R.free = true; };
    const resumeRun = () => {
      const R = RUN;
      if (!R || R.paused == null) return;
      const t = R.paused;
      R.paused = null; R.hold = -1; R.free = false; R.t0 = performance.now() - t * 1000;
      const cam = ctx2.camera, oc = ctx2.controls;
      if (cam && oc && oc.target) R.blend = { pos: cam.position.toArray(), tg: oc.target.toArray(), at: performance.now() };
    };
    (SH.demoStops || (SH.demoStops = [])).push({ id: "crt-payis-demo", running: () => !!RUN, stop: () => { if (!KEEP) stop(); },
      pause: pauseRun, resume: resumeRun, paused: () => !!(RUN && RUN.paused != null), restart: () => start() });
'''),
    # the eye back to the demonstration's after a pause (blend, 0.9 s)
    ('''        if (cam && !R.free) {
          cam.position.set(L(a[1], b[1], 0), L(a[1], b[1], 1), L(a[1], b[1], 2));
          const lx = L(a[2], b[2], 0), ly = L(a[2], b[2], 1), lz = L(a[2], b[2], 2);
''',
     '''        if (cam && !R.free) {
          cam.position.set(L(a[1], b[1], 0), L(a[1], b[1], 1), L(a[1], b[1], 2));
          let lx = L(a[2], b[2], 0), ly = L(a[2], b[2], 1), lz = L(a[2], b[2], 2);
          if (R.blend) {   // DEMO_PAUSE_207: after a pause, from where the viewer left the eye to the demonstration's, in 0.9 s
            const w = ease(Math.min(1, (performance.now() - R.blend.at) / 900)), P0 = R.blend.pos, T0 = R.blend.tg;
            cam.position.set(P0[0] + (cam.position.x - P0[0]) * w, P0[1] + (cam.position.y - P0[1]) * w, P0[2] + (cam.position.z - P0[2]) * w);
            lx = T0[0] + (lx - T0[0]) * w; ly = T0[1] + (ly - T0[1]) * w; lz = T0[2] + (lz - T0[2]) * w;
            if (w >= 1) R.blend = null;
          }
'''),
])
# ---------------------------------------------------------------- the camera's walks (DW), the great gate, the wickets
edit('50-heichal.js', 'DEMO_PAUSE_207', [
    # the walk: its clock stands while paused, and the eye is free
    ('''      ctx2.animated.push(() => {
        if (!S) return;
        const cam = ctx2.camera, c = ctx2.controls;
        if (!cam) return;
        const t = (performance.now() - S.t0) / 1000 / SLOW;
''',
     '''      ctx2.animated.push(() => {
        if (!S) return;
        if (S.pausedAt != null) return;   // DEMO_PAUSE_207: paused - the clock stands, the eye is the viewer's
        const cam = ctx2.camera, c = ctx2.controls;
        if (!cam) return;
        const t = (performance.now() - S.t0) / 1000 / SLOW;
'''),
    ('''      try { ctx2.renderer.domElement.addEventListener("pointerdown", () => { if (S) stop(); }, true); } catch (_) {}
      const W = {
''',
     '''      // DEMO_PAUSE_207: a press on the model pauses the walk (90-entry.js) - until 2.0.7 it ended it
      const pauseW = () => { if (S && S.pausedAt == null) S.pausedAt = performance.now(); };
      const resumeW = () => {
        if (!S || S.pausedAt == null) return;
        S.t0 += performance.now() - S.pausedAt;
        S.pausedAt = null;
        const cam = ctx2.camera, c = ctx2.controls;
        if (cam && c && c.target) S.blend = { pos: cam.position.toArray(), tg: c.target.toArray(), at: performance.now() };
      };
      const W = {
'''),
    ('''      DEMO_STOPS.push({ id: "walk", running: () => !!S, stop });
''',
     '''      DEMO_STOPS.push({ id: "walk", running: () => !!S, stop, pause: pauseW, resume: resumeW, paused: () => !!(S && S.pausedAt != null) });
'''),
    # the great gate: its clock and its sound stand while paused
    ('''      DEMO_STOPS.push({ id: "hei-gate-demo", running: () => G.t0 >= 0, stop: () => { DW.stop(); G.stop(); } });
''',
     '''      DEMO_STOPS.push({ id: "hei-gate-demo", running: () => G.t0 >= 0, stop: () => { DW.stop(); G.stop(); },
        // DEMO_PAUSE_207: the clock stands; the doors' sound waits with it (its context suspended - the scheduled sounds keep their seconds)
        pause: () => { if (G.t0 >= 0 && G.pausedAt == null) { G.pausedAt = performance.now(); SFX.suspend(); } },
        resume: () => { if (G.pausedAt != null) { G.t0 += performance.now() - G.pausedAt; G.pausedAt = null; SFX.resume(); } },
        paused: () => G.pausedAt != null });
'''),
    ('''      ctx2.animated.push(() => {
        if (G.t0 < 0) return;
        const e = (performance.now() - G.t0) / 1000 / SLOW;
''',
     '''      ctx2.animated.push(() => {
        if (G.t0 < 0) return;
        if (G.pausedAt != null) return;   // DEMO_PAUSE_207
        const e = (performance.now() - G.t0) / 1000 / SLOW;
'''),
    # the doors' sound: suspend / resume of its own audio context (the scheduled sounds keep their seconds)
    ("          stop() { try { if (ac) ac.close(); } catch (_) {} ac = null; }\n",
     "          stop() { try { if (ac) ac.close(); } catch (_) {} ac = null; },\n"
     "          suspend() { try { if (ac && ac.state === \"running\") ac.suspend(); } catch (_) {} },   // DEMO_PAUSE_207\n"
     "          resume() { try { if (ac && ac.state === \"suspended\") ac.resume(); } catch (_) {} }\n"),
    ('''        stop() {
          SFX.stop();   // SFX_STOP_205''',
     '''        stop() {
          this.pausedAt = null;   // DEMO_PAUSE_207
          SFX.stop();   // SFX_STOP_205'''),
])
# (the walk's blend after a pause was added by hand in the same round: the comment "from where the viewer left the eye back to the walk's")
print('demo_pause_b2_207 ok')
