# -*- coding: utf-8 -*-
# PAYIS_195, round 4 (12.11.2026, the user 00:22): "כולם לבן תעשה חץ מעליו שמדגים שהוא הזוכה ... גם בחדשים חצים ולא צבע ... הכל חייב
# להיות לבן" - every priest's garment is white (the winner was gold, the new ones bluish, the appointed one cream, the watcher grey
# and bare-headed); a winner is shown by an arrow over his head. The sash stays dyed until he decides (the Rambam, Klei HaMikdash
# 8:1 "והאבנט לבדו רקום בצמר"; Yoma 12b - Rabbi: of kilayim, R. Elazar b. R. Shimon: of butz).
import io, sys
F = '/home/claude/b2src/src/55-payis.js'
s = io.open(F, encoding='utf-8').read()
if 'PAYIS_WHITE' in s:
    print('already'); sys.exit(0)
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:100])
    s = s.replace(a, b)
# the arrow over a figure's head (hidden until he wins)
rep("      f.userData = { body, hat, hand, robe, tip: new Vector3(0.12, 1.86, 0.77) };",
    "      // PAYIS_WHITE: the winner's mark - an arrow over his head (the garments are all white)\n"
    "      const arrow = new Group();\n"
    "      const ah = new Mesh(gArrowHead, mArrow), as = new Mesh(gArrowShaft, mArrow);\n"
    "      ah.position.y = 0.2;\n"
    "      as.position.y = 0.56;\n"
    "      arrow.add(ah);\n"
    "      arrow.add(as);\n"
    "      arrow.position.y = 2.72;\n"
    "      arrow.visible = false;\n"
    "      f.add(arrow);\n"
    "      f.userData = { body, hat, hand, robe, arrow, tip: new Vector3(0.12, 1.86, 0.77) };")
rep("    const gFlame = new ConeGeometry(0.2, 0.7, 8); gFlame.translate(0, 0.35, 0);",
    "    const gFlame = new ConeGeometry(0.2, 0.7, 8); gFlame.translate(0, 0.35, 0);\n"
    "    const gArrowHead = new ConeGeometry(0.2, 0.4, 12); gArrowHead.rotateX(Math.PI);   // the point down\n"
    "    const gArrowShaft = new CylinderGeometry(0.065, 0.065, 0.36, 8);\n"
    "    const mArrow = new MeshBasicMaterial({ color: 0xffc83a });")
# every priest in white: the appointed one and the watcher too (the watcher wears the migba'at and the sash as they do)
rep("    const MEM = figure(mMem, true);                  // the appointed one over the lotteries\n    const WATCH = figure(mWatch, false);             // \"הרואה\"\n    WATCH.userData.hat.visible = false;\n",
    "    const MEM = figure(mRobe, true);                 // the appointed one over the lotteries\n    const WATCH = figure(mRobe, true);               // \"הרואה\"\n")
# the winners: an arrow, not a colour
rep("            K[idx].userData.body.material = mWin;", "            K[idx].userData.arrow.visible = true;")
rep("R.y + 4.25 + (winners.length > 1 ? (j % 2) * 0.5 : 0),", "R.y + (winners.length > 1 ? 4.25 + (j % 2) * 0.5 : 6.1),")
rep("      const clearWins = (dt) => ev(dt, () => { for (const f of K) f.userData.body.material = f.userData.robe; for (const s2 of tags) s2.visible = false; });",
    "      const clearWins = (dt) => ev(dt, () => { for (const f of K) { f.userData.body.material = f.userData.robe; f.userData.arrow.visible = false; } for (const s2 of tags) s2.visible = false; });")
rep("f.visible = true; f.userData.hand.visible = false; f.userData.body.material = mWin; });", "f.visible = true; f.userData.hand.visible = false; f.userData.arrow.visible = true; });")
rep("        ev(d, () => { f.visible = false; f.userData.body.material = f.userData.robe; });", "        ev(d, () => { f.visible = false; f.userData.arrow.visible = false; });")
# the new ones: no colour (only they stand in the third lottery's ring)
rep("      ev(1.2, () => { for (let i = 0; i < NEW; i++) { K[i].userData.robe = mNew; K[i].userData.body.material = mNew; } });\n", "")
io.open(F, 'w', encoding='utf-8').write(s)
print('ok')
