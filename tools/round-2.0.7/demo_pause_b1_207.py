#!/usr/bin/env python3
# DEMO_PAUSE_207 PART 3 (the first house): the camera's walks (50-heichal.js; the lulim's), the throne's ascent and the false witnesses
# (60-palace.js) can pause - their entries of demoStops get pause() / resume() / paused() (and restart()). A press on the model no longer
# ends a walk (90-entry.js pauses it); the throne's scenes pause by the bar or a press, as the user asked ("זה אותו דבר בכיסא שלמה").
import os
O = '/home/claude/beit-rishon/src'
def edit(rel, mark, pairs):
    p = os.path.join(O, rel); s = open(p, encoding='utf-8').read()
    if mark in s: print('already:', rel, mark); return
    for a, b in pairs:
        assert s.count(a) == 1, (rel, a[:90], s.count(a))
        s = s.replace(a, b)
    assert mark in s
    open(p, 'w', encoding='utf-8').write(s); print('edited', rel, mark)
edit('50-heichal.js', 'DEMO_PAUSE_207', [
    ('''      ctx.animated.push(() => {
        if (!S) return;
        const cam = ctx.camera, c = ctx.controls;
        if (!cam) return;
        const t = (performance.now() - S.t0) / 1000 / SLOW;
        const e = at(S.keys, t, 1), l = at(S.keys, t, 2);
        cam.position.set(e[0], e[1], e[2]);
''',
     '''      ctx.animated.push(() => {
        if (!S) return;
        if (S.pausedAt != null) return;   // DEMO_PAUSE_207: paused - the clock stands, the eye is the viewer's
        const cam = ctx.camera, c = ctx.controls;
        if (!cam) return;
        const t = (performance.now() - S.t0) / 1000 / SLOW;
        const e = at(S.keys, t, 1), l = at(S.keys, t, 2);
        if (S.blend) {   // DEMO_PAUSE_207: after a pause, from where the viewer left the eye back to the walk's, in 0.9 s
          const w0 = Math.min(1, (performance.now() - S.blend.at) / 900), w = w0 * w0 * (3 - 2 * w0), P0 = S.blend.pos, T0 = S.blend.tg;
          for (let q = 0; q < 3; q++) { e[q] = P0[q] + (e[q] - P0[q]) * w; l[q] = T0[q] + (l[q] - T0[q]) * w; }
          if (w0 >= 1) S.blend = null;
        }
        cam.position.set(e[0], e[1], e[2]);
'''),
    ('''      try { ctx.renderer.domElement.addEventListener("pointerdown", () => { if (S) stop(); }, true); } catch (_) {}
      ctx.shared.walk = {
''',
     '''      // DEMO_PAUSE_207: a press on the model pauses the walk (90-entry.js) - until 1.4.0 it ended it
      const pauseW = () => { if (S && S.pausedAt == null) S.pausedAt = performance.now(); };
      const resumeW = () => {
        if (!S || S.pausedAt == null) return;
        S.t0 += performance.now() - S.pausedAt;
        S.pausedAt = null;
        const cam = ctx.camera, c = ctx.controls;
        if (cam && c && c.target) S.blend = { pos: cam.position.toArray(), tg: c.target.toArray(), at: performance.now() };
      };
      ctx.shared.walk = {
'''),
    ('''      DEMO_STOPS.push({ id: "walk", running: () => !!S, stop });
''',
     '''      DEMO_STOPS.push({ id: "walk", running: () => !!S, stop, pause: pauseW, resume: resumeW, paused: () => !!(S && S.pausedAt != null) });
'''),
])
edit('60-palace.js', 'DEMO_PAUSE_207', [
    ('''      const freeze = (mode) => { if (anim.mode === mode && anim.running) { pal_witSound.stop(); anim.frozenAt = (performance.now() - anim.t0) / 1000 / THR_SLOW(); anim.running = false; } };
''',
     '''      const freeze = (mode) => { if (anim.mode === mode && anim.running) { pal_witSound.stop(); anim.frozenAt = (performance.now() - anim.t0) / 1000 / THR_SLOW(); anim.running = false; } };
      // DEMO_PAUSE_207 (the user, 12.11.2026 20:34: "זה אותו דבר בכיסא שלמה שזה ארוך"): a pause holds the moment (freeze), resume goes on from it
      anim.paused = null;
      const pauseThr = (mode) => { if (anim.mode === mode && anim.running) { freeze(mode); anim.paused = mode; } };
      const resumeThr = (mode) => {
        if (anim.paused !== mode || anim.mode !== mode) return;
        anim.paused = null;
        anim.t0 = performance.now() - anim.frozenAt * 1000 * THR_SLOW();
        anim.running = true;
        if (mode === "witnesses") pal_witSound.start();
      };
'''),
    ('''        stop: () => freeze("ascent"),                                  // holds the moment (seek or start goes on)
        reset: () => { if (anim.mode === "ascent") stopAll(); },
''',
     '''        stop: () => freeze("ascent"),                                  // holds the moment (seek or start goes on)
        reset: () => { anim.paused = null; if (anim.mode === "ascent") stopAll(); },
        pause: () => pauseThr("ascent"), resume: () => resumeThr("ascent"), get paused() { return anim.paused === "ascent"; },   // DEMO_PAUSE_207
'''),
    ('''        stop: () => freeze("witnesses"),
        reset: () => { if (anim.mode === "witnesses") stopAll(); },
''',
     '''        stop: () => freeze("witnesses"),
        reset: () => { anim.paused = null; if (anim.mode === "witnesses") stopAll(); },
        pause: () => pauseThr("witnesses"), resume: () => resumeThr("witnesses"), get paused() { return anim.paused === "witnesses"; },   // DEMO_PAUSE_207
'''),
    ('''        { id: "palaceThroneAscent", running: () => thrAPI.ascent.running, stop: () => thrAPI.ascent.reset() },
        { id: "palaceThroneWitnesses", running: () => thrAPI.witnesses.running, stop: () => thrAPI.witnesses.reset() });
''',
     '''        // DEMO_PAUSE_207: a paused scene still counts as running (a switch ends it); the bar resumes it or starts it again
        { id: "palaceThroneAscent", running: () => thrAPI.ascent.running || thrAPI.ascent.paused, stop: () => thrAPI.ascent.reset(),
          pause: () => thrAPI.ascent.pause(), resume: () => thrAPI.ascent.resume(), paused: () => thrAPI.ascent.paused, restart: () => thrAPI.ascent.start() },
        { id: "palaceThroneWitnesses", running: () => thrAPI.witnesses.running || thrAPI.witnesses.paused, stop: () => thrAPI.witnesses.reset(),
          pause: () => thrAPI.witnesses.pause(), resume: () => thrAPI.witnesses.resume(), paused: () => thrAPI.witnesses.paused, restart: () => thrAPI.witnesses.start() });
'''),
])
# (stopAll: anim.paused = null - added in the same round)
print('demo_pause_b1_207 ok')
