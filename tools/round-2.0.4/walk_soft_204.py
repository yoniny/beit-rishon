#!/usr/bin/env python3
# WALK_SOFT_204 (the user, 12.11.2026 02:14: "המצלמה במסיבה כשהיא פונה שמאלה/ימינה זווית המעבר יותר חלקה ולא ריצה מוזרה של המצלמה.
# פשוט להיצמד לקיר הנגדי שמול הסיבוב ... בעיה זו קיימת גם בפשפשים"). The Second House's walks (50-heichal.js). Idempotent.
f = '/home/claude/b2src/src/50-heichal.js'
s = open(f, encoding='utf8').read()
def rep(old, new, n=1):
    global s
    assert s.count(old) == n, (s.count(old), old[:80])
    s = s.replace(old, new)
if 'WALK_SOFT_204' not in s:
    # ---- the engine: the look by angle
    rep('''      const caption = (text) => {
        if (!capEl) {
          capEl = document.createElement("div");
          capEl.id = "tm-walk-cap";''', '''      // WALK_SOFT_204 (the user, 12.11.2026 02:14: "המצלמה במסיבה כשהיא פונה שמאלה/ימינה זווית המעבר יותר חלקה ולא ריצה מוזרה של
      // המצלמה ... בעיה זו קיימת גם בפשפשים"): until 2.0.3 the look POINT went by a curve from key to key - at a corner it swept from far
      // ahead to far aside within a second, and the eye spun. A walk run with { soft: true } turns BY ANGLE: the heading and the tilt
      // at each key are those of its look point; between the keys they go evenly, smoothed over TURN_W seconds to each side (a turn
      // begins a little before its corner and ends a little after it); and no leg turns faster than TURN_MAX degrees a second - a leg
      // that would is given more time, and the keys, the captions and the events after it move with it (W.now(): the walk's WRITTEN
      // second, for a demonstration that keeps its own clock). { from, until }: only the legs between these written seconds are so
      // stretched, and from `until` on the look goes by its points again (the great gate's views after the wicket's walk)
      const TURN_W = 0.7, TURN_MAX = 40;
      const softPlan = (keys, from, until) => {
        const n = keys.length, yaw = [], pit = [], ts = [keys[0][0]];
        for (let i = 0; i < n; i++) {
          const e = keys[i][1], l = keys[i][2], dx = l[0] - e[0], dy = l[1] - e[1], dz = l[2] - e[2];
          let y = Math.atan2(dx, dz);
          if (i) { while (y - yaw[i - 1] > Math.PI) y -= 2 * Math.PI; while (y - yaw[i - 1] < -Math.PI) y += 2 * Math.PI; }
          yaw.push(y);
          pit.push(Math.atan2(dy, Math.hypot(dx, dz)));
          if (i) {
            const dt = keys[i][0] - keys[i - 1][0], need = Math.abs(yaw[i] - yaw[i - 1]) * 180 / Math.PI / TURN_MAX;
            ts.push(ts[i - 1] + (i > 1 && keys[i - 1][0] >= from - 1e-6 && keys[i][0] <= until + 1e-6 ? Math.max(dt, need) : dt));
          }
        }
        return { src: keys.map((k) => k[0]), ts, yaw, pit, tu: 1e9 };
      };
      const pw = (xs, ys, x) => {   // the broken line through (xs, ys) at x; beyond its ends it goes on one for one
        const n = xs.length;
        if (x <= xs[0]) return ys[0] + (x - xs[0]);
        if (x >= xs[n - 1]) return ys[n - 1] + (x - xs[n - 1]);
        let i = 0;
        while (i < n - 2 && x > xs[i + 1]) i++;
        return ys[i] + (x - xs[i]) / Math.max(1e-6, xs[i + 1] - xs[i]) * (ys[i + 1] - ys[i]);
      };
      const lin = (xs, ys, x) => (x <= xs[0] ? ys[0] : x >= xs[xs.length - 1] ? ys[ys.length - 1] : pw(xs, ys, x));
      const softLook = (P, t, e) => {
        let y = 0, p = 0;
        for (let k = -4; k <= 4; k++) { const w = 1 - Math.abs(k) / 5, tt = t + k * TURN_W / 4; y += w * lin(P.ts, P.yaw, tt); p += w * lin(P.ts, P.pit, tt); }
        y /= 5;
        p /= 5;
        const c = Math.cos(p);
        return [e[0] + Math.sin(y) * c * 12, e[1] + Math.sin(p) * 12, e[2] + Math.cos(y) * c * 12];
      };
      const caption = (text) => {
        if (!capEl) {
          capEl = document.createElement("div");
          capEl.id = "tm-walk-cap";''')
    rep('''        const e = at(S.keys, t, 1), l = at(S.keys, t, 2);
        cam.position.set(e[0], e[1], e[2]);''', '''        const e = at(S.keys, t, 1);
        let l = at(S.keys, t, 2);
        if (S.soft) {   // WALK_SOFT_204
          const w = Math.max(0, Math.min(1, (S.soft.tu - t) / TURN_W));
          if (w > 0) { const sl = softLook(S.soft, t, e); l = [0, 1, 2].map((q) => l[q] + (sl[q] - l[q]) * w); }
        }
        cam.position.set(e[0], e[1], e[2]);''')
    rep('''        run(keys, caps, onEnd, events) {
          stop();
          const cam = ctx2.camera, c = ctx2.controls;
          const k0 = [0, cam ? cam.position.toArray() : keys[0][1], c && c.target ? c.target.toArray() : keys[0][2]];
          if (cam && cam.isPerspectiveCamera) { fov0 = cam.fov; setFov(66); }
          S = { t0: performance.now(), onEnd,
            keys: [k0].concat(keys.map(([t, eye, look]) => [t + LEAD, eye, look])),
            caps: (caps || []).map(([t, txt]) => [t + LEAD, txt]),
            events: (events || []).map(([t, fn]) => [t + LEAD, fn]).sort((a, b) => a[0] - b[0]) };
        },''', '''        run(keys, caps, onEnd, events, opt) {
          stop();
          const cam = ctx2.camera, c = ctx2.controls;
          const k0 = [0, cam ? cam.position.toArray() : keys[0][1], c && c.target ? c.target.toArray() : keys[0][2]];
          if (cam && cam.isPerspectiveCamera) { fov0 = cam.fov; setFov(66); }
          let K = [k0].concat(keys.map(([t, eye, look]) => [t + LEAD, eye, look])), wp = (t) => t, soft = null;
          if (opt && opt.soft) {   // WALK_SOFT_204
            const un = opt.until === undefined ? 1e9 : opt.until + LEAD;
            soft = softPlan(K, (opt.from || 0) + LEAD, un);
            wp = (t) => pw(soft.src, soft.ts, t);
            if (un < 1e8) soft.tu = wp(un);
            K = K.map((k, i) => [soft.ts[i], k[1], k[2]]);
          }
          S = { t0: performance.now(), onEnd, soft, keys: K,
            caps: (caps || []).map(([t, txt]) => [wp(t + LEAD), txt]),
            events: (events || []).map(([t, fn]) => [wp(t + LEAD), fn]).sort((a, b) => a[0] - b[0]) };
        },
        // the walk's written second now, from its own start (after the lead-in)
        now() { if (!S) return -1; const t = (performance.now() - S.t0) / 1000 / SLOW; return (S.soft ? pw(S.soft.ts, S.soft.src, t) : t) - LEAD; },''')
    # ---- the mesibah: soft all the way
    rep('''        DW.run(rb ? MW.rambam : MW.stairs, rb ? MC.rambam : MC.stairs, () => stopM(true));''',
        '''        DW.run(rb ? MW.rambam : MW.stairs, rb ? MC.rambam : MC.stairs, () => stopM(true), null, { soft: true });   // WALK_SOFT_204''')
    # ---- the wicket: the Sages' way goes to the cell's far (north) wall and turns to the door in a wide arc (the cell: x -16.9..-5.5,
    # z -22..-16; the wicket's way: z -20.3..-17.5 - measured in the model)
    rep('''            [3.8, [0.6, YW, -19], [-6, F + 3, -19]],
            [4.8, [-5.4, YW, -19.2], [-12, F + 3, -19.2]],
            [5.8, [-6.5, YW, -18.4], [-6.5, F + 3, -9]],''', '''            [3.8, [0.6, YW, -19], [-6, F + 3, -19.4]],
            [4.6, [-4.2, YW, -19.5], [-10, F + 3, -20.4]],      // WALK_SOFT_204: to the side of the wall that faces the turn (the user: "להיצמד לקיר הנגדי שמול הסיבוב")
            [5.25, [-6.4, YW, -20.0], [-7.6, F + 3, -14]],      // by the cell's north wall, turning to the door in a wide arc
            [6.0, [-6.6, YW, -18.5], [-6.5, F + 3, -9]],''')
    rep('''          DW.run(keys.concat(tail), caps.concat(tcap), () => ctx2.shared.pishpeshStop(true),
            [[PW_END, () => { D.gateShut = false; if (G) G.demo(gk, false); }]]);''', '''          DW.run(keys.concat(tail), caps.concat(tcap), () => ctx2.shared.pishpeshStop(true),
            [[PW_END, () => { D.gateShut = false; if (G) G.demo(gk, false); }]], { soft: true, from: LT + 0.4, until: PW_END });   // WALK_SOFT_204: the walk's own legs''')
    rep('''          const t = (performance.now() - D.t0) / 1000 / SLOW;   // from the walk's own start (after its lead-in), in demo seconds''',
        '''          const t = DW.on ? DW.now() : (performance.now() - D.t0) / 1000 / SLOW;   // from the walk's own start (after its lead-in), in demo seconds (WALK_SOFT_204: the walk's written second - a turn given more time holds this clock too)''')
    open(f, 'w', encoding='utf8').write(s)
print('WALK_SOFT_204', s.count('WALK_SOFT_204'))
