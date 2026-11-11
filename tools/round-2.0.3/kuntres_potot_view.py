#!/usr/bin/env python3
# 11.11.2026 (the scan after the user's "לחיצה על המתג לא מביאת את התוצאה הרצויה... איך לא הגעת אל זה בעצמך?"), B1 only:
# the row "הפותות" flew to the general view of the heichal's doorway, where neither the key nor a pivot can be told. Now its eye stands
# close to the key in the lock of the heichal's north leaf (Rashi), or to the lower pivot of that leaf (the Targum and Radak), and
# the pivot has a label of its own (shown in that reading alone), as the key has. Idempotent.
import re
p = '/home/claude/beit-rishon/src/55-interior.js'
s = open(p, encoding='utf-8').read()
if 'pototPivots' not in s:
    # 1. the layer that gates the pivot's label
    a = '    ctx.layers.pototKeys = pototLayer;\n'
    assert s.count(a) == 1
    s = s.replace(a, a + '    const pototPivotLayer = new Group();   // 1.3.6: gates the pivot\'s label (the other reading of "והפתות")\n'
                         '    pototPivotLayer.name = "pototPivots";\n    pototPivotLayer.visible = false;\n    g.add(pototPivotLayer);\n    ctx.layers.pototPivots = pototPivotLayer;\n')
    # 2. the heichal's key is marked, and the pivot's label stands by the lower pivot of the same leaf
    a = '          heiKey = goldKey(fold, -2.2, 2.2, T / 2, 1);\n'
    assert s.count(a) == 1
    s = s.replace(a, a + '          heiKey.userData.heichal = true;   // 1.3.6: the row "הפותות" looks at this key (ctx.shared.potot.view)\n'
                         '          ctx.labels.push({ text: "ציר של זהב — ״והפתות״ (תרגום ורד״ק: צירים)", x: HX + 0.2, y: F + 0.85, z: s * DZ + 0.45, size: 0.26, layer: "pototPivots" });\n'
                         '          pototKeys.pivot = [HX, F + 0.15, s * DZ];   // the lower pivot of the north leaf (the gold cylinder below)\n')
    # 3. the reading's switch shows the pivot's label, and gives the row's eye
    a = '        for (const key of pototKeys) key.visible = k === "rashi";\n        pototLayer.visible = k === "rashi";\n        return true;\n      }\n    };\n'
    assert s.count(a) == 1
    s = s.replace(a, '        for (const key of pototKeys) key.visible = k === "rashi";\n        pototLayer.visible = k === "rashi";\n        pototPivotLayer.visible = k === "pivots";\n        return true;\n      },\n'
        '      // 1.3.6 (the scan after the user\'s "לחיצה על המתג לא מביאה את התוצאה הרצויה"): where the row\'s eye stands. Rashi - close to the key in\n'
        '      // the lock of the heichal\'s north leaf: its place and the face it comes out of are read from the model as the leaf stands (open\n'
        '      // along the reveal, or shut in the demonstration), the eye 2.6 before that face, 1.5 to its outer side and a little above. The\n'
        '      // pivots - close to the lower pivot of the same leaf, from the ulam, through the doorway. (Model choices, checked in pictures.)\n'
        '      view(k) {\n'
        '        const key = pototKeys.find((x) => x.userData.heichal);\n'
        '        if ((k || this.current) === "rashi" && key) {\n'
        '          const kp = new Vector3(), n = new Vector3();\n'
        '          key.updateWorldMatrix(true, false);\n'
        '          key.getWorldPosition(kp);\n'
        '          key.getWorldDirection(n);\n'
        '          n.y = 0;\n'
        '          if (n.lengthSq() < 1e-6) n.set(0, 0, 1);\n'
        '          n.normalize();\n'
        '          let tx = n.z, tz = -n.x;\n'
        '          if (tx < 0) { tx = -tx; tz = -tz; }   // to the east, the side of the ulam\n'
        '          return { pos: [kp.x + 2.6 * n.x + 1.5 * tx, kp.y + 0.6, kp.z + 2.6 * n.z + 1.5 * tz], target: [kp.x, kp.y - 0.1, kp.z] };\n'
        '        }\n'
        '        const pv = pototKeys.pivot;\n'
        '        return pv ? { pos: [pv[0] + 2.1, pv[1] + 1.0, pv[2] + 2.3], target: [pv[0], pv[1] + 0.3, pv[2] + 0.15] } : null;\n'
        '      }\n    };\n')
    open(p, 'w', encoding='utf-8').write(s)
    print('55-interior.js: potot view + pivot label')
p = '/home/claude/beit-rishon/src/70-ui.js'
s = open(p, encoding='utf-8').read()
if 'pt.view' not in s:
    a = '              fly: () => flyView(ctx.shared.flyPoints && ctx.shared.flyPoints.heichalDoor ? "heichalDoor" : "kodesh")\n            });\n          }\n        }\n        // 1.2.0 (the user): what lay in the ark and how'
    assert s.count(a) == 1
    s = s.replace(a, '              // 1.3.6: close to the key (Rashi) or to the lower pivot (the Targum and Radak) - the general view of the doorway showed neither\n'
        '              fly: (k) => {\n'
        '                const v = typeof pt.view === "function" ? pt.view(k) : null;\n'
        '                if (v && v.pos && v.target) fly(v.pos, v.target);\n'
        '                else flyView(ctx.shared.flyPoints && ctx.shared.flyPoints.heichalDoor ? "heichalDoor" : "kodesh");\n'
        '              }\n            });\n          }\n        }\n        // 1.2.0 (the user): what lay in the ark and how')
    a = '        [/^מפתח של זהב/, ["potot"]],'
    assert s.count(a) == 1
    s = s.replace(a, a + ' [/^ציר של זהב/, ["potot"]],')
    a = '          ["מפתח של זהב — ״והפתות״ (רש״י: מפתחות)", { p: "פתח ההיכל ודלתותיו" }]'
    assert s.count(a) == 1
    s = s.replace(a, a + ',\n          ["ציר של זהב — ״והפתות״", { p: "פתח ההיכל ודלתותיו" }]   // 1.3.6')
    open(p, 'w', encoding='utf-8').write(s)
    print('70-ui.js: the row flies to the key / the pivot')
