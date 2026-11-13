# NIGHT_CLEAR_208 (the user, 12.11.2026 21:22-21:23: "יש מקומות שלא רואים... צריך למצוא לזה פתרון ודחוף"; "צריך לחשוב איך יוצרים גם
# מצב לילה, מצד שני שיהיה ברור, כי בסוף זה מצגת"): the night of the lotteries and of the morning's service (55-payis.js NIGHT, used by
# 55-tamid.js through SH.nightKit) - a clear blue night: the hemisphere light about three times stronger and its ground colour lighter
# (the walls and the inside of the buildings no longer black), the exposure 1.0, the "moon" a little stronger. Still a night - the sky
# dark, the colour blue; the torches, the hearth and the pyres keep their warm light. Chosen by pictures of every night stage
# (/home/claude/qa/night/n1.mjs: "a" before, "b" too bright, "c" this). Idempotent.
p = '/home/claude/b2src/src/55-payis.js'
s = open(p, encoding='utf-8').read()
old = [
 "        night: { el: -16, az: 0.15, sunI: 0.3, sunC: 0x8fa6d8, hemI: 0.46, hemC: 0x6276b0, gndC: 0x0b0e18, fog: 0x0a0f1c, exp: 0.9 },\n",
 "        alot: { el: -11, az: 0.15, sunI: 0.32, sunC: 0x94a9d8, hemI: 0.5, hemC: 0x6a7eb4, gndC: 0x0d101b, fog: 0x121829, exp: 0.9 },\n",
 "        barkai: { el: -7, az: 0.15, sunI: 0.36, sunC: 0x9fb0d8, hemI: 0.54, hemC: 0x6a7cae, gndC: 0x10131f, fog: 0x1a2238, exp: 0.9 },\n",
 "        heir: { el: -2, az: 0.15, sunI: 0.7, sunC: 0xffd9b0, hemI: 0.6, hemC: 0x8f96b4, gndC: 0x1c1c26, fog: 0x4a4a58, exp: 0.9 },\n"]
new = [
 "        // NIGHT_CLEAR_208: a clear night for a presentation (was hemI 0.46-0.6, ground 0x0b0e18-0x1c1c26, exp 0.9 - places were black)\n"
 "        night: { el: -16, az: 0.15, sunI: 0.5, sunC: 0x8fa6d8, hemI: 1.35, hemC: 0x7f8fc4, gndC: 0x3d4668, fog: 0x0a0f1c, exp: 1.0 },\n",
 "        alot: { el: -11, az: 0.15, sunI: 0.5, sunC: 0x94a9d8, hemI: 1.35, hemC: 0x7f8fc4, gndC: 0x3d4668, fog: 0x121829, exp: 1.0 },\n",
 "        barkai: { el: -7, az: 0.15, sunI: 0.55, sunC: 0x9fb0d8, hemI: 1.35, hemC: 0x8494c4, gndC: 0x424a6a, fog: 0x1a2238, exp: 1.0 },\n",
 "        heir: { el: -2, az: 0.15, sunI: 0.7, sunC: 0xffd9b0, hemI: 1.3, hemC: 0xa0a6c0, gndC: 0x5a5a68, fog: 0x4a4a58, exp: 0.95 },\n"]
if 'NIGHT_CLEAR_208' not in s:
    for a, b in zip(old, new):
        assert s.count(a) == 1, a[:40]
        s = s.replace(a, b)
    open(p, 'w', encoding='utf-8').write(s)
    print('NIGHT_CLEAR_208 applied')
else:
    print('NIGHT_CLEAR_208 already there')
