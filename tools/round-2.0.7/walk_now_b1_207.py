# DEMO_PAUSE_207 (B1): the walk's own second, which stands while it is paused - the lulim's light follows it (it went on alone during a pause),
# and the tests read it. Idempotent.
import sys
p = '/home/claude/beit-rishon/src/50-heichal.js'
s = open(p, encoding='utf-8').read()
a = "        get on() { return !!S; }\n      };\n      DEMO_STOPS.push({ id: \"walk\""
b = ("        get on() { return !!S; },\n"
     "        now() { if (!S) return -1; return ((S.pausedAt != null ? S.pausedAt : performance.now()) - S.t0) / 1000 / SLOW - LEAD; }   // DEMO_PAUSE_207: stands while paused\n"
     "      };\n      DEMO_STOPS.push({ id: \"walk\"")
c = "        const t = (performance.now() - tStart) / 1000 / SLOW, s2 = sAt(t);\n"
d = "        const t = W.now ? W.now() : (performance.now() - tStart) / 1000 / SLOW, s2 = sAt(t);   // DEMO_PAUSE_207: on the walk's clock (it stands in a pause)\n"
n = 0
if 'now() { if (!S) return -1;' not in s:
    assert s.count(a) == 1, 'walk anchor'; s = s.replace(a, b); n += 1
if 'W.now ? W.now()' not in s:
    assert s.count(c) == 1, 'lulim anchor'; s = s.replace(c, d); n += 1
open(p, 'w', encoding='utf-8').write(s)
print('walk_now_b1_207:', n, 'changes')
