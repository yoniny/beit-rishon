#!/usr/bin/env python3
# 11.11.2026 (the scan after the user's "לחיצה על המתג לא מביאת את התוצאה הרצויה"), B1 only: the row "הכבשים הקטנים" looked at the
# small ramps from far and high, over the mechonot and their label - the ramps were two thin strips at the big ramp's foot. Now the eye
# stands close, south-west of them and above, where the western ramps meet the altar: the ramp to the yesod at the foot, and - in the
# Tosafot's reading - the one that rises to the sovev above it. Chosen in pictures (both readings; the altar in its three places and
# in both sizes). Idempotent.
p = '/home/claude/beit-rishon/src/40-altar.js'
s = open(p, encoding='utf-8').read()
old = '      ctx.shared.flyPoints.mizbeachRamps = { pos: [SHX - 13.5, F + 22, SHZ + 32], target: [RX0 + 0.5, F + 2, ZS + 5] };\n'
new = ('      // 1.3.6 (the scan of 11.11.2026): that view was far and high, over the mechonot and their label, and the small ramps were two thin\n'
       '      // strips. Now close: from the south-west and above, at the place where the western ramps meet the altar = [37.5, 22, 33] looking at\n'
       '      // [46.6, 9, 25.5] (in pictures: Rashi - the one ramp at the foot; the Tosafot - the second above it, rising to the sovev)\n'
       '      ctx.shared.flyPoints.mizbeachRamps = { pos: [RX0 - 9.5, F + 16, ZS + 12], target: [RX0 - 0.4, F + 3, ZS + 4.5] };\n')
if 'pos: [RX0 - 9.5, F + 16, ZS + 12]' not in s:
    assert s.count(old) == 1
    s = s.replace(old, new)
    open(p, 'w', encoding='utf-8').write(s)
    print('40-altar.js: the small ramps\' view')
