# BREAD_205 (the user, 12.11.2026 12:11: "הלחם בשולחנות האולם צריך להיות נאמן למקור"): the Second House's marble table in the ulam carried
# twelve plain slabs; it now carries the loaves of the table inside (the same geometry), as the First House plugin does since 1.3.3.
# Idempotent. Run from anywhere.
import io, os, re
S = '/home/claude/b2src/src'
def rw(name, fn):
    p = os.path.join(S, name); s = io.open(p, encoding='utf-8').read(); t = fn(s)
    if t != s: io.open(p, 'w', encoding='utf-8').write(t)
    return t != s
def vessels(s):
    if 'BREAD_205' in s: return s
    a = '    const tblBread = int_inst(g, tableGeo.bread, breadMat, tM, false);\n'
    assert s.count(a) == 1
    return s.replace(a, a + '    ctx2.shared.breadKit = { geo: tableGeo.bread, mat: breadMat, top: TBL_TOP };   // BREAD_205: the same loaves go on the ulam\'s marble table (50-heichal.js)\n')
def heichal(s):
    if 'BREAD_205' in s: return s
    a = ('    {\n'
         '      const breadMat = new MeshStandardMaterial({ color: 0xc89a5e, roughness: 0.95, emissive: 0x24170a });\n'
         '      for (let i = 0; i < 6; i++) for (const s2 of [-1, 1]) H2.box(g, 1.0, 0.16, 0.42, breadMat, 4 + s2 * 0.55, F + 1.76 + i * 0.17, -8);\n'
         '    }\n')
    assert s.count(a) == 1
    b = ('    {\n'
         '      // BREAD_205 (the user: "הלחם בשולחנות האולם צריך להיות נאמן למקור"): the loaves of the table inside (45-vessels.js tableGeo.bread:\n'
         '      // two stacks of six, each loaf with its walls folded up and its horns), without the posts and the tubes, which belong to the\n'
         '      // golden table inside; their base on the marble board (its top at F + 1.74). As in the First House plugin since 1.3.3.\n'
         '      // How they lay on the marble table is not written: a model choice (said in the card).\n'
         '      const BK = ctx2.shared.breadKit;\n'
         '      if (BK) { const br = instMesh(g, BK.geo, BK.mat, [new Matrix4().makeTranslation(4, F + 1.74 - BK.top, -8)], true); br.name = "ulam-table-bread"; }\n'
         '    }\n')
    s = s.replace(a, b)
    l0 = '{ text: "שלחן השיש — לחם הפנים בכניסתו", x: 4, y: F + 4, z: -8, size: 1.2 }, { text: "שלחן הזהב — ביציאתו", x: 4, y: F + 4, z: 8, size: 1.2 }'
    assert s.count(l0) == 1
    return s.replace(l0, l0.replace('y: F + 4, z: -8', 'y: F + 4.8, z: -8').replace('y: F + 4, z: 8', 'y: F + 4.8, z: 8'))   # the stacks reach F + 3.74
print('vessels', rw('45-vessels.js', vessels), 'heichal', rw('50-heichal.js', heichal))
