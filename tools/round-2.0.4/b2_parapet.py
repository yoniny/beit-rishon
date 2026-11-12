# -*- coding: utf-8 -*-
# 1.9.5 - the roof's parapets as ONE RING (a remark sent on to the user, 11.11.2026: "בגג ההיכל המעקות לא חופפים"; the user: "מצוין").
# Patches /home/claude/b2src/src/50-heichal.js. Idempotent (a marker).
import io, sys
P = '/home/claude/b2src/src/50-heichal.js'
s = io.open(P, encoding='utf-8').read()
if 'ONE RING' in s:
    print('b2_parapet: already applied'); sys.exit(0)
def rep(a, b, n=1):
    global s
    if s.count(a) != n:
        raise SystemExit('b2_parapet: %d occurrences (want %d) of: %s' % (s.count(a), n, a[:90]))
    s = s.replace(a, b)

# 1. the facade's wall ends under the gold band, as every other wall of the house
rep("      height: 93,\n      thickness: 5,\n      mat: M2.marble,\n      occlude: false,\n      cx: 15,",
    "      height: 88.5,   // 1.9.5: up to the gold band (110.5), as the other walls; until 1.9.4 it rose to 115 as its own parapet, five amot thick\n      thickness: 5,\n      mat: M2.marble,\n      occlude: false,\n      cx: 15,")
# 2. the facade's own gold band (99..102) -> the roof's gold band goes round the facade too (x 12.5..18.7, as far out as at the ulam's ends)
rep("      H2.box(g, 0.18, 3, 100, M2.gold, 17.59, 99, 0));",
    "      H2.box(g, 6.2, 1.5, 102.4, M2.gold, 15.6, 110.5, 0));   // 1.9.5: the roof's gold band over the facade (until 1.9.4 a band of the facade's own, at 99..102)")
# 3. the ulam's four parapet pieces of 1.8.0 go (the ring below)
rep("""    const ulamParN = H2.box(g, 11, 3, 0.9, M2.marble, 7, 112, -50.7);
    const ulamParS = H2.box(g, 11, 3, 0.9, M2.marble, 7, 112, 50.7);
    const wingParN = H2.box(g, 0.9, 3, 14.5, M2.marble, 1.3, 112, -43.6);
    const wingParS = H2.box(g, 0.9, 3, 14.5, M2.marble, 1.3, 112, 43.6);
    cut.push(ulamParS, wingParS);
""", "")
rep("    ctx2.ulamOpenCut.push(ulamCap, ulamParN, ulamParS, wingParN, wingParS);",
    "    ctx2.ulamOpenCut.push(ulamCap);   // (1.9.5: the ulam's parapets are pieces of the roof's ring, below; they hide with this list too)")
# 4. the Rambam's shell: its parapet in the two readings, on the top band's edge (the line of the parapets of the ulam's ends), with the spikes
rep("      const parts = [], southBands = [];\n",
    "      const parts = [], southBands = [];\n"
    "      // 1.9.5: the shell's parapets, one group a reading (the reading of the parapet shows its own: applyTop, below)\n"
    "      const shellParTK = new Group(), shellParRY = new Group();\n"
    "      shellG.add(shellParTK); shellG.add(shellParRY);\n"
    "      shellParRY.visible = false;\n"
    "      ctx2.__shellPar = { tk: shellParTK, ry: shellParRY };\n")
rep("        slab(s, 0.9, 3, T5 - 0.45, YT);                            // its parapet\n",
    "        // its parapet. 1.9.5: on the top band's edge - the line of the parapets of the ulam's ends (until 1.9.4 on the wall's own edge, an\n"
    "        // amah inside that line, three amot in both readings and without the spikes): three amot and the spikes, or four amot (Middot 4:6)\n"
    "        for (const [hh, grp] of [[3, shellParTK], [4, shellParRY]]) {\n"
    "          const pm = H2.box(grp, L, hh, 0.9, M2.marble, (XE + XW) / 2, YT, s * ((NE + NW) / 2 + T5 + 0.6));\n"
    "          pm.rotation.y = s < 0 ? ang : -ang;\n"
    "          parts.push([pm, s]);\n"
    "          if (s > 0) cut.push(pm);\n"
    "          else (ctx2.shellNorth = ctx2.shellNorth || []).push(pm);\n"
    "        }\n"
    "        {\n"
    "          const sg0 = new ConeGeometry(0.12, 1, 6);\n"
    "          sg0.translate(0, 0.5, 0);\n"
    "          const sm = instMesh(shellParTK, sg0, M2.gold, spikeMats([{ x1: XW + 1, z1: s * (NW + T5 + 0.6), x2: XE - 1, z2: s * (NE + T5 + 0.6), y: YT + 3 }]), false);\n"
    "          parts.push([sm, s]);\n"
    "          if (s > 0) cut.push(sm);\n"
    "          else (ctx2.shellNorth = ctx2.shellNorth || []).push(sm);\n"
    "        }\n")
# 5. the ring itself
old_a = s[s.index("    const parTK = new Group(), parRY = new Group();"):s.index("    // 1.4.0: the drawn storey lines and cells of 1.0.x are gone - the cells are built above")]
new_a = '''    // 1.9.5 (a remark sent on to the user, 11.11.2026: "בגג ההיכל המעקות לא חופפים"; the user: "מצוין"): ONE RING. Until 1.9.4 the
    // house's top was pieced together: the facade's wall rose to 115 as its own parapet, five amot thick, with a gold band of its own at
    // 99..102, while the other sides had the gold band at 110.5..112 and a thin parapet on it; the west parapet ended short of the north
    // and the south ones (an open slit at both corners), and the parapets of the ulam's ends stood beside the facade's end, off its
    // line. Now the facade's wall ends under the gold band like every other wall, the band runs round the facade too, and one parapet
    // stands on the band's edge all round the roof, its corners closed: three amot and the spikes over it (the Tanna Kamma), or four
    // amot (R. Yehuda) - Middot 4:6. A piece hides with what stands under it: the ulam's with the ulam's ceiling (ulamOpenCut), the
    // facade's with the front (ulamFrontCut), the south side's with the house's cutaway (cut). mkRing builds a ring at a height - the
    // roof's (112) and the one over the Abarbanel's twenty amot (132, below).
    const parTK = new Group(), parRY = new Group();
    g.add(parTK);
    g.add(parRY);
    parRY.visible = false;
    ctx2.layers = ctx2.layers || {};
    ctx2.layers.parapetTK = parTK;
    ctx2.layers.parapetYehuda = parRY;
    const mkRing = (parent, y0, h, spikes, lists) => {
      const gS = new Group(), gUN = new Group(), gUS = new Group(), gF = new Group();
      parent.add(gS); parent.add(gUN); gS.add(gUS); parent.add(gF);
      const segs = new Map();
      const piece = (grp, x0, x1, z0, z1) => {
        H2.box(grp, x1 - x0, h, Math.abs(z1 - z0), M2.marble, (x0 + x1) / 2, y0, (z0 + z1) / 2);
        if (!segs.has(grp)) segs.set(grp, []);
        return segs.get(grp);
      };
      // the west side, whole, with both its corners
      piece(parent, -83.85, -82.95, -36.35, 36.35).push({ x1: -83.4, z1: -35.9, x2: -83.4, z2: 35.9, y: y0 + h });
      for (const [sg, gB, gU] of [[-1, parent, gUN], [1, gS, gUS]]) {
        piece(gB, -82.95, 1.85, sg * 35.45, sg * 36.35).push({ x1: -81.4, z1: sg * 35.9, x2: 1.4, z2: sg * 35.9, y: y0 + h });       // the house's side, from the west parapet to the wing's return
        piece(gU, 0.95, 1.85, sg * 36.35, sg * 50.15).push({ x1: 1.4, z1: sg * 37.9, x2: 1.4, z2: sg * 48.6, y: y0 + h });             // the return over the wing's west face
        piece(gU, 0.95, 12.5, sg * 50.15, sg * 51.05).push({ x1: 1.4, z1: sg * 50.6, x2: 11.4, z2: sg * 50.6, y: y0 + h });            // the ulam's end
        piece(gF, 12.5, 17.65, sg * 50.15, sg * 51.05).push({ x1: 13.4, z1: sg * 50.6, x2: 17.4, z2: sg * 50.6, y: y0 + h });          // ... and its part over the facade's wall
      }
      piece(gF, 17.65, 18.55, -51.05, 51.05).push({ x1: 18.1, z1: -50.6, x2: 18.1, z2: 50.6, y: y0 + h });                             // the facade, whole, with both its corners
      if (spikes) {
        const sG = new ConeGeometry(0.12, 1, 6);
        sG.translate(0, 0.5, 0);
        for (const [grp, sl] of segs) instMesh(grp, sG, M2.gold, spikeMats(sl), false);
      }
      if (lists) {
        cut.push(gS);
        ctx2.ulamOpenCut.push(gUN, gUS);
        ulamFrontCut.push(gF);
      }
      return { gS, gUN, gUS, gF };
    };
    mkRing(parTK, 112, 3, true, true);    // maakeh 3 amot (112..115) and an amah of kalah orev over it
    mkRing(parRY, 112, 4, false, true);   // "לא היה כלה עורב עולה מן המדה, אלא ארבע אמות היה מעקה" (112..116), R. Yehuda
'''
s = s.replace(old_a, new_a)
# (the spikes of 1.4.0 over the old pieces)
i0 = s.index("    const spikeG = new ConeGeometry(0.12, 1, 6);\n    spikeG.translate(0, 0.5, 0);\n    instMesh(parTK, spikeG, M2.gold, spikeMats([")
i1 = s.index("    ]), false));\n", i0) + len("    ]), false));\n")
s = s[:i0] + s[i1:]
# 6. the Abarbanel's 120: the walls go on up from the roof's band on the house's own plan, a band and a ring over them; the roof's ring goes
i0 = s.index("    H2.box(h120, 100, 20, 70, M2.marble, -32.5, 115, 0);")
i1 = s.index("    ctx2.labels.push({ text: \"תוספת עד 120 אמה — אברבנאל, יוסף בן מתתיהו\"")
new_h = '''    // 1.9.5: on the house's own plan (the house 70 wide, the ulam 100), from the roof's gold band up twenty amot, a gold band and a
    // ring of the parapet's reading over it (132..136 - the hundred and twenty with the parapet, as the Mishnah's hundred). Until 1.9.4
    // a block 100 x 70 stood on the old parapet's top (115) with parapets of its own to 138, the eastern one hanging over the wings.
    H2.box(h120, 84, 18.5, 70, M2.marble, -40.5, 112, 0);
    H2.box(h120, 16, 18.5, 100, M2.marble, 9.5, 112, 0);
    H2.box(h120, 84.78, 1.5, 73, M2.gold, -41.61, 130.5, 0);
    H2.box(h120, 17.9, 1.5, 102.4, M2.gold, 9.75, 130.5, 0);
    const h120TK = new Group(), h120RY = new Group();
    h120.add(h120TK); h120.add(h120RY);
    mkRing(h120TK, 132, 3, true, false);
    mkRing(h120RY, 132, 4, false, false);
    const applyTop = () => {
      const ry = ctx2.shared.parapet.mode === "yehuda", hi = h120.visible;
      parTK.visible = !ry && !hi; parRY.visible = ry && !hi;
      h120TK.visible = !ry; h120RY.visible = ry;
      if (ctx2.__shellPar) { ctx2.__shellPar.tk.visible = !ry; ctx2.__shellPar.ry.visible = ry; }
    };
    ctx2.shared.parapet = { mode: "tk", set(m) { this.mode = m === "yehuda" ? "yehuda" : "tk"; applyTop(); } };
    ctx2.shared.height120 = { get: () => h120.visible, set: (on) => { h120.visible = !!on; applyTop(); } };
    applyTop();
'''
old_h = s[i0:i1]
assert 'ctx2.shared.height120 = ' in old_h, old_h[-300:]
s = s[:i0] + new_h + s[i1:]
io.open(P, 'w', encoding='utf-8').write(s)
print('b2_parapet: applied')
