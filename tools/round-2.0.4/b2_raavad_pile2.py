# 1.9.5 (the user, 11.11.2026 18:31, of the Ra'avad's pyre - pipes and two cubes: "אתה בטוח שלזה התכוון הראב"ד? זה נראה יותר כמו, לא
# יודע מה"): the pile drawn as split wood with spaces, the two gezirin by the Gemara's measure (flat boards). Idempotent.
import io, sys
P = '/home/claude/b2src/src/40-altar.js'
s = io.open(P, encoding='utf-8').read()
if 'RAAVAD_PILE2' in s:
    print('40-altar.js: already patched'); sys.exit(0)
a = s.index('        const pile = (list, xc, zc, half, rows, r) => {')
tail = '        for (const dz of [-1, 1]) H2.box(mv, 1, 1, 1, M2.cedar, XE, gTop, GP.cz + dz);\n'
b = s.index(tail, a) + len(tail)
new = '''        // RAAVAD_PILE2 - 1.9.5, second drawing (the user, 18:31, of the pipes and the two cubes: "אתה בטוח שלזה התכוון הראב"ד? זה נראה
        // יותר כמו, לא יודע מה"). What his words give stays: the logs lie EAST-WEST, their inner heads on the table, and they keep out
        // of the kohanim's amah. The pile is drawn as SPLIT WOOD: billets an amah long, a little short (Zevachim 62b "באמה גדומה";
        // Rashi there, book 2191, line 2998: "קצרה שלא יצאו חוץ למערכה ויעכבו הכהנים מלהקיף"), side by side with a space between them
        // (Tamid 2:4 "ורוח היה בין הגזרין, שהיו מציתין את האליתא משם"), two layers. THE TWO GEZIRIN on the great pyre by the Gemara's
        // measure (Zevachim 62b, book 130, line 2117: "אורכן אמה, ורוחבן אמה, ועוביין כמחק גודש סאה"; the Rambam, Issurei Mizbeach
        // 7:3, book 339, line 100: "וכמותן עושין לדורות"): two flat boards an amah by an amah - not cubes. The number of the billets,
        // their thickness, the two layers and the boards' thickness (0.1) - model choices.
        let bN = 0;
        const hsh = (n) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
        const pile = (list, xc, zc, half, layers, wd) => {
          const pitch = wd * 1.75, n = Math.max(1, Math.round(2 * half / pitch)), sgn = xc > ACX ? 1 : -1;
          const face = xc - sgn * 0.5;   // the table's face on that side: the billets' inner heads stand on it
          for (let l = 0; l < layers; l++) {
            for (let i = 0; i < n; i++) {
              const k = ++bN, len = 0.9 + hsh(k + 0.3) * 0.06, th = wd * (0.68 + hsh(k) * 0.26);
              list.push({ x: face + sgn * (len / 2 + (l ? hsh(k + 0.1) * 0.03 : 0)), y: TOP + l * wd * 0.8 + th / 2,
                z: zc - half + pitch / 2 + i * pitch + (hsh(k + 0.2) - 0.5) * 0.06, len, w: wd * (0.8 + hsh(k + 0.4) * 0.3), t: th,
                roll: (hsh(k + 0.5) - 0.5) * 0.16, yaw: (hsh(k + 0.6) - 0.5) * 0.05 });
            }
          }
          return TOP + (layers - 1) * wd * 0.8 + wd * 0.95;   // the pile's top
        };
        const instLogsB = (list) => {
          const inst = new InstancedMesh(new BoxGeometry(1, 1, 1), M2.cedar, list.length);
          const m42 = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), sc = new Vector3();
          list.forEach((L, i) => {
            e.set(L.roll, L.yaw, 0);
            q.setFromEuler(e);
            p.set(L.x, L.y, L.z);
            sc.set(L.len, L.t, L.w);
            m42.compose(p, q, sc);
            inst.setMatrixAt(i, m42);
          });
          inst.castShadow = inst.receiveShadow = true;
          mv.add(inst);
          return inst;
        };
        toTop(true, pyresR);
        const lR = [], l3 = [], l4 = [], lYK = [];
        const gTop = pile(lR, XE, GP.cz, GP.hz, 2, 0.32);
        pile(lR, XW, 5, 0.75, 2, 0.16);                        // the second pyre, for the incense
        pile(l3, XW, -11, 1.2, 2, 0.22);                       // the third, keeping the fire (R. Yose)
        pile(l4, XE, -9.5, 0.7, 2, 0.16);                      // R. Meir's fourth
        pile(lYK, XE, -12, 0.7, 2, 0.16);                      // Yom Kippur's
        instLogsB(lR);
        const p3 = instLogsB(l3), p4 = instLogsB(l4), pYK = instLogsB(lYK);
        // the two gezirin on the great pyre, an amah between them (the place of the lighting), and the coals in it
        for (const dz of [-1, 1]) H2.box(mv, 0.94, 0.1, 0.94, M2.cedar, XE - 0.5 + 0.47, gTop, GP.cz + dz);
'''
old = s[a:b]
for must in ['toTop(true, pyresR);', 'const p3 = instLogs(l3), p4 = instLogs(l4), pYK = instLogs(lYK);']:
    if must not in old:
        print('UNEXPECTED BLOCK: missing', must); sys.exit(1)
s = s[:a] + new + s[b:]
io.open(P, 'w', encoding='utf-8').write(s)
print('40-altar.js: patched (the Raavad pile as split wood, the two gezirin as boards)')
