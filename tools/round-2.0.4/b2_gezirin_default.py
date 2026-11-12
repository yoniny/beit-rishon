# -*- coding: utf-8 -*-
# B2 1.9.5 - the two gezirin of the DEFAULT reading by the Gemara's measure (the user, 11.11.2026, 22:00: "מה שכתוב במקורות הוא הנכון").
# Idempotent (marker GEZIRIN_DEFAULT_195). Edits /home/claude/b2src/src/40-altar.js; backup /tmp/40-altar.b2.before_gezirin.js.
import io, os, shutil
F = '/home/claude/b2src/src/40-altar.js'
s = io.open(F, encoding='utf-8').read()
if 'GEZIRIN_DEFAULT_195' in s:
    print('already applied')
    raise SystemExit(0)
if not os.path.exists('/tmp/40-altar.b2.before_gezirin.js'):
    shutil.copy(F, '/tmp/40-altar.b2.before_gezirin.js')
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:80])
    s = s.replace(old, new)
rep("    const GP = { x0: 59.7, x1: 64.2, hz: 4, lay: 6, R: 0.25, cz: ACZ + 4.5 };\n",
    "    const GP = { x0: 59.7, x1: 64.2, hz: 4, lay: 6, R: 0.25, cz: ACZ + 4.5 };\n"
    "    const GEZ_X = GP.x0 + 0.8 + 1.05 * 1.5;   // GEZIRIN_DEFAULT_195: between the second and the third log of the pyre's top layer (62.075)\n")
rep("      // 1.0.31: the two gezirin (1 x 1 amah) lie on TOP of the great pyre so they are seen; 1 amah gap between them (the lighting gap)\n"
    "      for (const dz of [-1, 1]) H2.box(mv, PX1 - PX0, 1, 1, M2.cedar, (PX0 + PX1) / 2, TOP + LAY * R * 2, GP.cz + dz);\n",
    "      // GEZIRIN_DEFAULT_195 - 1.9.5 (the user, 11.11.2026, 22:00, asked whether the default reading's two gezirin stay two long beams\n"
    "      // while the Gemara and the Rambam give their measure: \"מה שכתוב במקורות הוא הנכון\"). The Gemara (Zevachim 62b; the user's\n"
    "      // library, book 130, line 2117): \"גזירין שעשה משה – אורכן אמה, ורוחבן אמה, ועוביין כמחק גודש סאה\"; R. Yirmeya there: \"באמה\n"
    "      // גדומה\"; the Rambam (Issurei Mizbeach 7:3; book 339, line 100): \"וכמותן עושין לדורות\". So: two flat boards an amah by an\n"
    "      // amah, a little short (0.94), as in the Ra'avad's reading since RAAVAD_PILE2 - no longer two beams 4.5 long and an amah\n"
    "      // thick (1.0.31). They lie on TOP of the great pyre, bridging two of its upper logs, an amah between them. Their thickness\n"
    "      // (0.1), their place on the pyre and the space between them - model choices.\n"
    "      for (const dz of [-1, 1]) H2.box(mv, 0.94, 0.1, 0.94, M2.cedar, GEZ_X, TOP + LAY * R * 2, GP.cz + dz);\n")
rep("    const coals = new Mesh(new PlaneGeometry(GP.x1 - GP.x0, 0.9), new MeshBasicMaterial(",
    "    const coals = new Mesh(new PlaneGeometry(1.5, 0.9), new MeshBasicMaterial(")
rep("    coals.position.set(PCX, TOP + 3.05, GP.cz);\n",
    "    coals.position.set(GEZ_X, TOP + 3.05, GP.cz);   // GEZIRIN_DEFAULT_195: between the two boards (until 1.9.4 a strip along the two beams)\n")
io.open(F, 'w', encoding='utf-8').write(s)
print('applied')
