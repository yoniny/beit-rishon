# NAV_205 (the user's recording of 12.11.2026 11:55, "ריצה בגלילה" + the place of the two curtains that ended on a blank wall).
#  1. WHEEL_ROOFED_205 b: under a roof the wheel's pending travel is never more than 8 amot, and it is played at 20 amot a second at most
#     (a free-spinning wheel sent dozens of events: the 2-amot cap of one event was not enough).
#  2. SECTION_HOLD_205: a section that a place opened "for a while" does not close while the eye stands in the half that it cut away
#     (the wall came back over the eye: a blank screen). It closes as before when another place or row is picked (closeAuto), or within
#     two seconds after the eye leaves the cut half.
# Both houses' 90-entry.js. Idempotent.
import io
def patch(p):
    s = io.open(p, encoding='utf-8').read(); s0 = s
    if 'WHEEL_ROOFED_205 b' not in s:
        a = '      ent_zoom.pending = Math.max(-4, Math.min(4, ent_zoom.pending + k));\n'
        assert s.count(a) == 1, p
        s = s.replace(a, a +
            '      if (cam.roofed) {   // WHEEL_ROOFED_205 b: what is still to travel under a roof is never more than 8 amot\n'
            '        const L1 = camera.position.distanceTo(controls.target);\n'
            '        if (L1 > 0 && isFinite(L1)) ent_zoom.pending = Math.max(Math.log(1 - Math.min(0.9, 8 / L1)), Math.min(Math.log(1 + 8 / L1), ent_zoom.pending));\n'
            '      }\n')
        a = '    const step = Math.abs(p) < 2e-3 ? p : p * Math.max(0.35, 1 - Math.exp(-ent_view.dt / 40));\n'
        assert s.count(a) == 1, p
        s = s.replace(a, a.replace('const step', 'let step'))
        a = '    const L2 = Math.min(controls.maxDistance || 2200, Math.max(controls.minDistance || 2, L * Math.exp(step)));\n'
        assert s.count(a) == 1, p
        s = s.replace(a,
            '    if (cam.roofed) {   // WHEEL_ROOFED_205 b: under a roof the eye goes 20 amot a second at most\n'
            '      const lim = 20 * Math.min(100, Math.max(1, ent_view.dt || 16)) / 1000, d = L * (Math.exp(step) - 1);\n'
            '      if (Math.abs(d) > lim) step = Math.log(Math.max(0.05, 1 + Math.sign(d) * lim / L));\n'
            '    }\n' + a)
    if 'SECTION_HOLD_205' not in s:
        a = '      if (ctx.shared.__autoHold) { S.t = setTimeout(close, 2000); return; }\n      S.t = 0;\n      if (ent_sec.on && ent_sec.axis === S.axis && ent_sec.v === S.v) {\n'
        assert s.count(a) == 1, p
        s = s.replace(a,
            '      // SECTION_HOLD_205: while the eye stands in the half that the section cut away, the section stays (the wall would come back over the eye)\n'
            '      const inCut = ent_sec.on && ent_sec.axis === S.axis && ent_sec.v === S.v && camera && camera.position[S.axis] > S.v;\n'
            '      if (ctx.shared.__autoHold || inCut) { S.t = setTimeout(close, 2000); return; }\n      S.t = 0;\n      if (ent_sec.on && ent_sec.axis === S.axis && ent_sec.v === S.v) {\n')
    if s != s0: io.open(p, 'w', encoding='utf-8').write(s)
    return s != s0
for p in ['/home/claude/b2src/src/90-entry.js', '/home/claude/beit-rishon/src/90-entry.js']:
    print(p, patch(p))
