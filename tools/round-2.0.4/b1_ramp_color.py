# -*- coding: utf-8 -*-
# 2.0.4 / B1 1.3.7 - THE RAMP IN THE ALTAR'S OWN STONE (the user, 11.11.2026 18:17: "שמת לב שהצבע של הכבש בבית ראשון שונה מהצבע של
# הכבש בבית שני, וגם מהצבע של המזבח עצמו?"). The ramps kept the tint (0xbfb39c) they had been given beside the bronze altar of
# 1.0.0; the altar is stone in colour since 1.0.1-L, and in the Second Temple model the ramp is the altar's stone.
# Idempotent by the marker "1.3.7 (the user, 18:17".
import io
P = '/home/claude/beit-rishon/src/40-altar.js'
s = io.open(P, encoding='utf-8').read()
if '1.3.7 (the user, 18:17' in s:
    print('40-altar.js: already patched')
else:
    old = '''    const AS = M2.altarStone.clone();
    AS.color.set(0xbfb39c);
'''
    new = '''    const AS = M2.altarStone.clone();
    // 1.3.7 (the user, 18:17: "הצבע של הכבש בבית ראשון שונה מהצבע של הכבש בבית שני, וגם מהצבע של המזבח עצמו"): the ramps are of the
    // altar's own stone - no tint (until 1.3.6: 0xbfb39c, a leftover of the days the altar beside them was bronze)
    AS.roughness = 0.9;
'''
    assert s.count(old) == 1
    s = s.replace(old, new)
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('40-altar.js: patched')

# ---- 18:21: "תאחד צבעים במזבח" - the yesod and the sovev too (the band was a shade darker than the body)
s = io.open(P, encoding='utf-8').read()
if 'תאחד צבעים במזבח' in s:
    print('40-altar.js: band already unified')
else:
    old = '''    const BRD = M2.altarStone.clone();
    BRD.color.set(0xb0a58e);
    BRD.roughness = 0.95;
'''
    new = '''    const BRD = M2.altarStone.clone();
    // 1.3.7 (the user, 18:21: "תאחד צבעים במזבח"): the yesod and the sovev in the body's own stone - no tint (until 1.3.6: 0xb0a58e)
    BRD.roughness = 0.9;
'''
    assert s.count(old) == 1
    s = s.replace(old, new)
    io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
    print('40-altar.js: band unified')
