# -*- coding: utf-8 -*-
# PAYIS_195, round 5 (12.11.2026, the user 00:27-00:28): the avnet in two readings (a row of the opinions table: the Rambam, as
# Rabbi - embroidered with dyed wool [default]; R. Elazar b. R. Shimon - of butz, white); the migba'at wound and rounded but smaller
# ("לא בדיוק כמו בובו"); the garments shown from near - a place of the panel and a moment of the demonstration, by day.
import io, sys
F = '/home/claude/b2src/src/55-payis.js'
s = io.open(F, encoding='utf-8').read()
if 'PAYIS_GARMENTS' in s:
    print('already'); sys.exit(0)
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:100])
    s = s.replace(a, b)
# ---------- the sash: at the elbows' height ("כנגד אצילי ידיו" - the Rambam, Klei HaMikdash 10:1), white, with three thin dyed bands in the Rambam's reading
rep("mSash = mat(0x8a4fa0), mElder = mat(0xd8caa2);", "mSash = mat(0xece8dc), mTch = mat(0x3f6fb5), mArg = mat(0xa12a4e), mSha = mat(0xd2452c), mElder = mat(0xd8caa2);")
rep("    const gSash = new CylinderGeometry(0.266, 0.276, 0.14, 10); gSash.translate(0, 1.05, 0);",
    "    const gSash = new CylinderGeometry(0.246, 0.254, 0.15, 12); gSash.translate(0, 1.22, 0);\n"
    "    const gStripe = new CylinderGeometry(0.2525, 0.2585, 0.03, 12);\n"
    "    const STRIPES = [];   // PAYIS_GARMENTS: the dyed bands of every sash (shown in the Rambam's reading of the avnet, hidden in \"של בוץ\")")
rep("      if (sash) f.add(new Mesh(gSash, mSash));",
    "      if (sash) {\n"
    "        f.add(new Mesh(gSash, mSash));\n"
    "        [[1.265, mTch], [1.22, mArg], [1.175, mSha]].forEach(([y, m]) => { const b = new Mesh(gStripe, m); b.position.y = y; f.add(b); STRIPES.push(b); });\n"
    "      }")
# ---------- the migba'at: smaller
rep("    const gHatDome = new SphereGeometry(0.265, 18, 12); gHatDome.scale(1, 0.8, 1.04);\n    const gHatBand = new TorusGeometry(0.25, 0.05, 8, 22);",
    "    const gHatDome = new SphereGeometry(0.226, 18, 12); gHatDome.scale(1, 0.8, 1.03);\n    const gHatBand = new TorusGeometry(0.25, 0.046, 8, 22);")
rep("for (const [y, r, tilt] of [[-0.15, 0.236, 0.16], [-0.05, 0.264, -0.14], [0.05, 0.24, 0.12]]) {", "for (const [y, r, tilt] of [[-0.125, 0.203, 0.16], [-0.045, 0.224, -0.14], [0.035, 0.2, 0.12]]) {")
# ---------- the API: the avnet's reading and the garments shown from near
rep("    const P = SH.payis = {\n      reading: \"rambam\",",
    "    const P = SH.payis = {\n      reading: \"rambam\",\n"
    "      // PAYIS_GARMENTS: the avnet of an ordinary priest - \"rambam\" (as Rabbi: embroidered with dyed wool) | \"butz\" (R. Elazar b. R. Shimon: white)\n"
    "      avnet: \"rambam\",\n"
    "      setAvnet(m) { this.avnet = m === \"butz\" ? \"butz\" : \"rambam\"; for (const b of STRIPES) b.visible = this.avnet === \"rambam\"; return this.avnet; },\n"
    "      // three priests stand before the altar for `ms` (fifteen seconds), by day, to be seen from near: face, side and back\n"
    "      garments(ms) { garmentsOn(ms || 15000); },\n"
    "      get garmentsOn() { return !!GAR; },")
rep("    let KEEP = false;\n", "    let KEEP = false;\n"
    "    let GAR = null;\n"
    "    const garmentsOff = () => {\n"
    "      if (!GAR) return;\n"
    "      clearTimeout(GAR);\n"
    "      GAR = null;\n"
    "      if (!RUN) { g.visible = false; resetFigures(); }\n"
    "    };\n"
    "    const garmentsOn = (ms) => {\n"
    "      if (RUN) return;\n"
    "      garmentsOff();\n"
    "      resetFigures();\n"
    "      [[78.5, -1.7, Math.PI / 2], [78.5, 0, Math.PI], [78.5, 1.7, -Math.PI / 2]].forEach(([x, z, ry], i) => { const f = K[i]; f.position.set(x, LV.KOH, z); f.rotation.y = ry; f.visible = true; });\n"
    "      g.visible = true;\n"
    "      GAR = setTimeout(() => { GAR = null; if (!RUN) { g.visible = false; resetFigures(); } }, ms);\n"
    "    };\n")
rep("    function start() {\n      if (RUN) stop();", "    function start() {\n      if (RUN) stop();\n      garmentsOff();")
rep("""    (SH.demoStops || (SH.demoStops = [])).push({ id: "crt-payis-demo", running: () => !!RUN, stop: () => { if (!KEEP) stop(); } });""",
    """    (SH.demoStops || (SH.demoStops = [])).push({ id: "crt-payis-demo", running: () => !!RUN, stop: () => { if (!KEEP) stop(); } });
    SH.demoStops.push({ id: "payis-garments", running: () => !!GAR, stop: () => garmentsOff() });""")
# ---------- the moment of the garments in the demonstration: by day, before the third lottery
rep("""      enterRing(GZ, [81, FYG, -57.6], NEW, 1.2, 3.6);
      track(MEM, [[1.2, 81.6, FYG, -57.4], [4.6, GZ.x, GZ.y, GZ.z]]);
      t += 5.4;
""", """      enterRing(GZ, [81, FYG, -57.6], NEW, 1.2, 3.6);
      track(MEM, [[1.2, 81.6, FYG, -57.4], [4.6, GZ.x, GZ.y, GZ.z]]);
      t += 5.4;
      // PAYIS_GARMENTS (the user, 12.11.2026: "תוסיף כרטיס שמדבר על הבגדים ... מביא את המחלוקות ... בצורה ברורה"): the garments from near, by day
      cam(2.2, [86.6, 19.4, -61.6], [84.6, 18.4, -64.6], 2.2);
      cap(0, "רמב״ם (כלי המקדש ח, א): ״בגדי כהן הדיוט הם ארבעה כלים כתנת ומכנסים ומגבעות ואבנט. וארבעתן של פשתן לבנים וחוטן כפול ששה״");
      cap(5.5, P.avnet === "butz" ? "האבנט — ביומא (יב:) נחלקו: ״חד אמר: של כלאים, וחד אמר: של בוץ״. כאן — של בוץ. הרמב״ם: ״והאבנט לבדו רקום בצמר״"
        : "האבנט — רמב״ם: ״והאבנט לבדו רקום בצמר״. ביומא (יב:) נחלקו: ״חד אמר: של כלאים, וחד אמר: של בוץ״");
      t += 11;
      cam(2.6, camGazit[0], camGazit[1], 2.4);
""")
io.open(F, 'w', encoding='utf-8').write(s)
print('ok')
