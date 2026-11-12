#!/usr/bin/env python3
# PEOPLE_KIT_204 - the Sanhedrin's figures in both houses (the user, 12.11.2026 01:41-01:42). Idempotent:
#   * the kit's text (tools204/people_kit.js) goes in before each house's builder function; when it is there already it is replaced
#     (so the kit can be tuned and the script run again);
#   * the old peg figures' helpers and calls are replaced once.
import re, sys, io
KIT = open('/home/claude/tools204/people_kit.js', encoding='utf8').read()
B2 = '/home/claude/b2src/src/30-courts.js'
B1 = '/home/claude/beit-rishon/src/30-courts.js'

def put_kit(s, before):
    a, b = s.find('  // ===== PEOPLE_KIT_204 BEGIN'), s.find('  // ===== PEOPLE_KIT_204 END\n')
    if a >= 0 and b > a:
        return s[:a] + KIT + s[b + len('  // ===== PEOPLE_KIT_204 END\n'):]
    assert s.count(before) == 1, before
    return s.replace(before, KIT + before)

def rep(s, old, new, n=1):
    assert s.count(old) == n, (s.count(old), old[:90])
    return s.replace(old, new)

def cut_fn(s, head, tail):
    # removes a helper from its first line to its closing line (the first `tail` after it)
    a = s.find(head)
    assert a >= 0 and s.count(head) == 1, head
    b = s.find(tail, a)
    assert b > a, tail
    return s[:a] + s[b + len(tail):]

# ---------------------------------------------------------------- the Second House
s = open(B2, encoding='utf8').read()
s = put_kit(s, '  async function build2(ctx2) {\n')
if 'PPG.crowd(' not in s:
    s = rep(s, '''      const bodyGeo = new CylinderGeometry(0.2, 0.3, 1, 10); bodyGeo.translate(0, 0.5, 0);
      const headGeo = new SphereGeometry(0.21, 12, 10);
      const figMat = new MeshStandardMaterial({ color: 16777215, roughness: 0.85 });
      const skinMat = new MeshStandardMaterial({ color: 16777215, roughness: 0.8 });
      const cloth = [0xece4cc, 0xe3d9bb, 0xd9cfae, 0xf1ebd8], cloth2 = [0xb9c4d2, 0xa9b6c6, 0xc6cfdb], skin = [0xc99a73, 0xb98763, 0xd7aa86];
      const mt = new Matrix4(), q0 = new Quaternion(), sc = new Vector3(), ps = new Vector3(), col = new Color();
''', '''      const PPG = tm_people(ctx2);   // PEOPLE_KIT_204: sitting men in black robes and kippot (until 2.0.3: pegs with a ball for a head)
''')
    s = cut_fn(s, '      const figures = (parent, pts, y, w, h, colors, special) => {\n', '\n      };\n')
    s = rep(s, '''      figures(g, ovalPts(EA, EB, 71, 0, Math.PI), FY + 0.45, 0.62, 0.8, cloth, 35);
''', '''      // PEOPLE_KIT_204: the seventy-one, each one's face to the row's inner side; the Nasi in the middle (a little larger); the beards
      // white by him, grey further and black-brown at the row's two ends ("יושבין לפניו כפי שניהם וכפי מעלתם", the Rambam, Sanhedrin 1:3)
      PPG.crowd(g, PPG.facing(ovalPts(EA, EB, 71, 0, Math.PI), [CX, CZ], false), { y: FY + 0.45, s: 0.62, pose: "bench", seat: 0.45, kind: "judge", tone: PPG.age(71), big: 35, shadow: true });
''')
    s = rep(s, '''      for (const [a, b] of [[6.97, 6.94], [5.88, 5.74], [4.8, 4.53]]) figures(stRound, ovalPts(a, b, 23, 0.1 * Math.PI, 0.9 * Math.PI), FY, 0.56, 0.62, cloth2, -1);
      for (const dx of [1.7, 3.0, 4.3]) figures(stStraight, Array.from({ length: 23 }, (_, i) => [CX - dx, CZ - 6.6 + i * 0.6]), FY, 0.56, 0.62, cloth2, -1);
''', '''      // the students sit on the ground, their faces to the judges ("יושבין לפניהם"): no beards, a kippah and peyot (the user, 01:42)
      PPG.crowd(stRound, [[6.97, 6.94], [5.88, 5.74], [4.8, 4.53]].flatMap(([a, b]) => PPG.facing(ovalPts(a, b, 23, 0.1 * Math.PI, 0.9 * Math.PI), [CX, CZ], true)), { y: FY, s: 0.58, pose: "ground", kind: "student", shadow: true });
      PPG.crowd(stStraight, [1.7, 3.0, 4.3].flatMap((dx) => Array.from({ length: 23 }, (_, i) => [CX - dx, CZ - 6.6 + i * 0.6, -Math.PI / 2])), { y: FY, s: 0.58, pose: "ground", kind: "student", shadow: true });
''')
    s = rep(s, '''      for (const sx of [-2.4, 2.4]) {
        const b = new Mesh(new CylinderGeometry(0.18, 0.26, 1.9, 10), new MeshStandardMaterial({ color: 0x8fa3b8, roughness: 0.85 }));
        b.position.set(CX - 0.7, FY + 0.95, CZ + sx);
        const hd = new Mesh(new SphereGeometry(0.17, 12, 10), new MeshStandardMaterial({ color: 0xc99a73, roughness: 0.8 }));
        hd.position.set(CX - 0.7, FY + 2.05, CZ + sx);
        for (const m of [b, hd]) { m.castShadow = true; g.add(m); }
      }
''', '''      PPG.crowd(g, [-2.4, 2.4].map((sx) => [CX - 0.7, CZ + sx, -Math.PI / 2]), { y: FY, s: 0.62, pose: "stand", kind: "scribe", tone: () => 1, shadow: true });   // PEOPLE_KIT_204: their faces to the judges, a tablet in the hand ("וכותבין")
''')
    # the lesser chambers
    s = rep(s, '''      const bG = new CylinderGeometry(0.2, 0.3, 1, 10); bG.translate(0, 0.5, 0);
      const hG = new SphereGeometry(0.21, 12, 10);
      const fM = new MeshStandardMaterial({ color: 16777215, roughness: 0.85 }), sM = new MeshStandardMaterial({ color: 16777215, roughness: 0.8 });
      const m4 = new Matrix4(), q = new Quaternion(), v = new Vector3(), p = new Vector3(), c3 = new Color();
''', '''      const PPL = tm_people(ctx2);   // PEOPLE_KIT_204: the same figures as the Great Sanhedrin's
''')
    s = cut_fn(s, '      const people = (grp, pts, y, w, h, tones) => {\n', '\n      };\n')
    s = rep(s, '''        people(lg2, arcPts(R, 23, 0, Math.PI), 0.45, 0.7, 0.8, [0xece4cc, 0xe3d9bb, 0xd9cfae]);
''', '''        PPL.crowd(lg2, PPL.facing(arcPts(R, 23, 0, Math.PI), [0, 0], false), { y: 0.45, s: 0.7, pose: "bench", seat: 0.45, kind: "judge", tone: PPL.age(23), big: 11, shadow: true });
''')
    s = rep(s, '''        people(lg2, [[-2.2, 1.3], [2.2, 1.3]], 0, 0.62, 1.75, [0x8fa3b8]);
''', '''        PPL.crowd(lg2, [[-2.2, 1.3, Math.PI], [2.2, 1.3, Math.PI]], { y: 0, s: 0.7, pose: "stand", kind: "scribe", tone: () => 1, shadow: true });
''')
    s = rep(s, '''        for (const r of [6.15, 4.95, 3.75]) people(stR, arcPts(r, 23, 0.07 * Math.PI, 0.93 * Math.PI), 0, 0.45, 0.6, [0xb9c4d2, 0xa9b6c6, 0xc6cfdb]);
        for (const dz of [1.3, 2.5, 3.7]) people(stS, Array.from({ length: 23 }, (_, i) => [-5.5 + i * 0.5, -dz]), 0, 0.45, 0.6, [0xb9c4d2, 0xa9b6c6, 0xc6cfdb]);
''', '''        PPL.crowd(stR, [6.15, 4.95, 3.75].flatMap((r) => PPL.facing(arcPts(r, 23, 0.07 * Math.PI, 0.93 * Math.PI), [0, 0], true)), { y: 0, s: 0.6, pose: "ground", kind: "student", shadow: true });
        PPL.crowd(stS, [1.3, 2.5, 3.7].flatMap((dz) => Array.from({ length: 23 }, (_, i) => [-5.5 + i * 0.5, -dz, Math.PI])), { y: 0, s: 0.6, pose: "ground", kind: "student", shadow: true });
''')
open(B2, 'w', encoding='utf8').write(s)
print('B2 ok:', s.count('PPG.crowd('), 'gazit calls,', s.count('PPL.crowd('), 'lesser calls')

# ---------------------------------------------------------------- the First House
s = open(B1, encoding='utf8').read()
s = put_kit(s, '  async function buildCourts(ctx) {\n')
if 'PPG.crowd(' not in s:
    s = rep(s, '''      const bG = new CylinderGeometry(0.2, 0.3, 1, 10);
      bG.translate(0, 0.5, 0);
      const hG = new SphereGeometry(0.21, 12, 10);
      const fM = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), sM = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
      const m4 = new Matrix4(), q = new Quaternion(), v = new Vector3(), p = new Vector3(), c3 = new Color();
''', '''      const PPL = tm_people(ctx);   // PEOPLE_KIT_204 (1.3.7): sitting men in black robes and kippot (until 1.3.6: pegs with a ball for a head)
''')
    s = cut_fn(s, '      const people = (grp, pts, y, w, h, tones) => {\n', '\n      };\n')
    s = rep(s, '''        people(lg2, arcPts(R, 23, 0, Math.PI), 0.45, 0.7, 0.8, [0xece4cc, 0xe3d9bb, 0xd9cfae]);
''', '''        PPL.crowd(lg2, PPL.facing(arcPts(R, 23, 0, Math.PI), [0, 0], false), { y: 0.45, s: 0.7, pose: "bench", seat: 0.45, kind: "judge", tone: PPL.age(23), big: 11, shadow: true, name: "lesserCourtFigures" });
''')
    s = rep(s, '''        people(lg2, [[-2.2, 1.3], [2.2, 1.3]], 0, 0.62, 1.75, [0x8fa3b8]);
''', '''        PPL.crowd(lg2, [[-2.2, 1.3, Math.PI], [2.2, 1.3, Math.PI]], { y: 0, s: 0.7, pose: "stand", kind: "scribe", tone: () => 1, shadow: true, name: "lesserCourtFigures" });
''')
    s = rep(s, '''        for (const r of [6.15, 4.95, 3.75]) people(stR, arcPts(r, 23, 0.07 * Math.PI, 0.93 * Math.PI), 0, 0.45, 0.6, [0xb9c4d2, 0xa9b6c6, 0xc6cfdb]);
        for (const dz of [1.3, 2.5, 3.7]) people(stS, Array.from({ length: 23 }, (_, i) => [-5.5 + i * 0.5, -dz]), 0, 0.45, 0.6, [0xb9c4d2, 0xa9b6c6, 0xc6cfdb]);
''', '''        PPL.crowd(stR, [6.15, 4.95, 3.75].flatMap((r) => PPL.facing(arcPts(r, 23, 0.07 * Math.PI, 0.93 * Math.PI), [0, 0], true)), { y: 0, s: 0.6, pose: "ground", kind: "student", shadow: true, name: "lesserCourtFigures" });
        PPL.crowd(stS, [1.3, 2.5, 3.7].flatMap((dz) => Array.from({ length: 23 }, (_, i) => [-5.5 + i * 0.5, -dz, Math.PI])), { y: 0, s: 0.6, pose: "ground", kind: "student", shadow: true, name: "lesserCourtFigures" });
''')
    # the Great Sanhedrin
    s = rep(s, '''        const bodyGeo = new CylinderGeometry(0.2, 0.3, 1, 10);
        bodyGeo.translate(0, 0.5, 0);
        const headGeo = new SphereGeometry(0.21, 12, 10);
        const figMat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const skinMat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
        const cloth = [0xece4cc, 0xe3d9bb, 0xd9cfae, 0xf1ebd8], cloth2 = [0xb9c4d2, 0xa9b6c6, 0xc6cfdb], skin = [0xc99a73, 0xb98763, 0xd7aa86];
        const mt = new Matrix4(), q0 = new Quaternion(), sc = new Vector3(), ps = new Vector3(), col = new Color();
''', '''        const PPG = tm_people(ctx);   // PEOPLE_KIT_204 (1.3.7): sitting men in black robes and kippot (1.3.5-1.3.6: pegs with a ball for a head)
''')
    s = cut_fn(s, '        const figures = (parent, pts, y, w, h, colors, special) => {\n', '\n        };\n')
    s = rep(s, '''        figures(g, ovalPts(SA, SB, CRT_GAZIT_SEATS.n, 0, Math.PI), AZ + 0.45, 0.6, 0.72, cloth, (CRT_GAZIT_SEATS.n - 1) / 2);
''', '''        // PEOPLE_KIT_204: a judge on each seat, his face as the seat's; the one in the middle a little larger; the beards white by
        // him, grey further and black-brown at the row's two ends ("יושבין לפניו כפי שניהם וכפי מעלתם", the Rambam, Sanhedrin 1:3)
        PPG.crowd(g, PPG.facing(ovalPts(SA, SB, CRT_GAZIT_SEATS.n, 0, Math.PI), [SX, SZ], false), { y: AZ + 0.45, s: 0.62, pose: "bench", seat: 0.45, kind: "judge", tone: PPG.age(CRT_GAZIT_SEATS.n), big: (CRT_GAZIT_SEATS.n - 1) / 2, name: "sanhedrinFigures" });
''')
    s = rep(s, '''        for (const d of [1.9, 3.2, 4.5]) figures(stRound, ovalPts(SA - d, SB - d, 23, 0.1 * Math.PI, 0.9 * Math.PI), AZ, 0.6, 0.62, cloth2, -1);
''', '''        // the students sit on the ground, their faces to the judges ("יושבין לפניהם"): no beards, a kippah and peyot (the user, 12.11.2026 01:42)
        PPG.crowd(stRound, [1.9, 3.2, 4.5].flatMap((d) => PPG.facing(ovalPts(SA - d, SB - d, 23, 0.1 * Math.PI, 0.9 * Math.PI), [SX, SZ], true)), { y: AZ, s: 0.58, pose: "ground", kind: "student", name: "sanhedrinFigures" });
''')
    a = s.find('        for (const dx of [1.7, 3.0, 4.3]) figures(stStraight, ')
    assert a >= 0
    b = s.find('\n', a)
    s = s[:a] + '''        PPG.crowd(stStraight, [1.7, 3.0, 4.3].flatMap((dx) => Array.from({ length: 23 }, (_, i) => [SX - dx, SZ - 6.6 + i * 0.6, -Math.PI / 2])), { y: AZ, s: 0.58, pose: "ground", kind: "student", name: "sanhedrinFigures" });   // GAZIT_MEIRI_137: north-south''' + s[b:]
    s = rep(s, '''        for (const sx of [-2.6, 2.6]) {
          const b = new Mesh(new CylinderGeometry(0.18, 0.26, 1.9, 10), new MeshStandardMaterial({ color: 0x8fa3b8, roughness: 0.85 }));
          b.position.set(SX - 0.6, AZ + 0.95, SZ + sx);
          const hd = new Mesh(new SphereGeometry(0.17, 12, 10), new MeshStandardMaterial({ color: 0xc99a73, roughness: 0.8 }));
          hd.position.set(SX - 0.6, AZ + 2.05, SZ + sx);
          for (const m of [b, hd]) { m.castShadow = false; m.name = "sanhedrinScribe"; g.add(m); }
        }
''', '''        PPG.crowd(g, [-2.6, 2.6].map((sx) => [SX - 0.6, SZ + sx, -Math.PI / 2]), { y: AZ, s: 0.62, pose: "stand", kind: "scribe", tone: () => 1, name: "sanhedrinScribe" });   // their faces to the judges, a tablet in the hand ("וכותבין")
''')
open(B1, 'w', encoding='utf8').write(s)
print('B1 ok:', s.count('PPG.crowd('), 'gazit calls,', s.count('PPL.crowd('), 'lesser calls')
