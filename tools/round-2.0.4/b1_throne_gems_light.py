# 1.3.7 (the user, 11.11.2026 19:03: "ח. מצוין / ט. מעולה"): the stones of the throne's steps set FLAT in the gold, small, in deep tones
# (until 1.3.6: bright half balls - "נראים יותר תכשיטים"); a warm light on the throne and a glint that moves over the gold. Idempotent.
import io, sys
P = '/home/claude/beit-rishon/src/60-palace.js'
s = io.open(P, encoding='utf-8').read()
if 'THRONE_GEMS_137' in s:
    print('60-palace.js: already patched'); sys.exit(0)
def rep(a, b):
    global s
    if s.count(a) != 1:
        print('ANCHOR x%d:' % s.count(a), a[:100]); sys.exit(1)
    s = s.replace(a, b, 1)
rep('''        pearl: new MeshStandardMaterial({ color: 0xF2EEE4, roughness: 0.22, metalness: 0.05 }),
        emerald: new MeshStandardMaterial({ color: 0x1E8C55, roughness: 0.18, metalness: 0.1, emissive: 0x0B3D24, emissiveIntensity: 0.6 }),
        carbuncle: new MeshStandardMaterial({ color: 0xB3152E, roughness: 0.18, metalness: 0.1, emissive: 0x420812, emissiveIntensity: 0.6 }),
        beryl: new MeshStandardMaterial({ color: 0x3FB8AF, roughness: 0.2, metalness: 0.1, emissive: 0x0E3A38, emissiveIntensity: 0.5 }),
        saffron: new MeshStandardMaterial({ color: 0xE2A72E, roughness: 0.25, metalness: 0.1, emissive: 0x4A3208, emissiveIntensity: 0.5 }),
        glass: new MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.8, emissive: 0xCFE2F2, emissiveIntensity: 0.55 })   // 1.0.1-L: clear and pale (plain, over the gold it read as dull grey)
      };''', '''        // THRONE_GEMS_137 - 1.3.7 (the user, 11.11.2026: of the bright stones "נראים יותר תכשיטים"; 19:03 of setting them flat, small, in a
        // deep tone: "מצוין"): deep tones, little light of their own
        pearl: new MeshStandardMaterial({ color: 0xE6E0D0, roughness: 0.3, metalness: 0.05, emissive: 0x4a463c, emissiveIntensity: 0.3 }),
        emerald: new MeshStandardMaterial({ color: 0x0E6B43, roughness: 0.22, metalness: 0.1, emissive: 0x05301E, emissiveIntensity: 0.45 }),
        carbuncle: new MeshStandardMaterial({ color: 0x8E1022, roughness: 0.22, metalness: 0.1, emissive: 0x3A0610, emissiveIntensity: 0.45 }),
        beryl: new MeshStandardMaterial({ color: 0x1E7F86, roughness: 0.24, metalness: 0.1, emissive: 0x0A3336, emissiveIntensity: 0.4 }),
        saffron: new MeshStandardMaterial({ color: 0xB5791A, roughness: 0.28, metalness: 0.1, emissive: 0x3E2A06, emissiveIntensity: 0.4 }),
        glass: new MeshStandardMaterial({ color: 0xF4F8FA, roughness: 0.08, metalness: 0.0, transparent: true, opacity: 0.78, emissive: 0xB8CCDA, emissiveIntensity: 0.4 }),   // 1.0.1-L: clear and pale (plain, over the gold it read as dull grey)
        bezel: new MeshStandardMaterial({ color: 0x9C6B1C, roughness: 0.38, metalness: 0.75, emissive: 0x3a2606, emissiveIntensity: 0.4 })   // the setting: a darker gold rim round every stone
      };''')
rep('''        for (let k = 1; k <= 6; k++) for (let i = 0; i < 9; i++) {
          if (k === 1 && Math.abs(i - 4) < RW / 2 + 0.2) continue;
          lists[(i + k) % palette.length].push({ x: X - 4 + i, y: YT + (k - 0.5) * SR, z: zF - (k - 1) * ST, sz: 0.45 });
        }
        const gemGeo = once("gem", () => new SphereGeometry(0.12, 8, 5));
        lists.forEach((list, ci) => { if (list.length) pal_instanced(grp, gemGeo, gemMats[palette[ci]], list, false).name = "throneGems"; });''',
'''        // 1.3.7: SET FLAT IN THE GOLD - thirteen small oval stones a riser (nine half balls until 1.3.6), each 0.17 x 0.12 and a hair proud of
        // the face, in a rim of darker gold; the first riser is behind the ramp (as wide as the steps now), so it has none
        const rims = [];
        for (let k = 2; k <= 6; k++) for (let i = 0; i < 13; i++) {
          const it = { x: X - 4.5 + i * 0.75, y: YT + (k - 0.5) * SR, z: zF - (k - 1) * ST };
          lists[(i + k) % palette.length].push(Object.assign({ sx: 0.085, sy: 0.06, sz: 0.014 }, it));
          rims.push(Object.assign({ sx: 0.108, sy: 0.082, sz: 0.006 }, it));
        }
        const gemGeo = once("gem", () => new SphereGeometry(1, 14, 8));
        pal_instanced(grp, gemGeo, gemMats.bezel, rims, false).name = "throneGemRims";
        lists.forEach((list, ci) => { if (list.length) pal_instanced(grp, gemGeo, gemMats[palette[ci]], list, false).name = "throneGems"; });''')
# the light: after the label of the throne (in the base, so in every version)
rep('''      lbl("כסא שלמה", X, Y + 9.5, zD, 2.5);
''', '''      lbl("כסא שלמה", X, Y + 9.5, zD, 2.5);
      // 1.3.7 (the user, 11.11.2026 19:03, of "תאורה חמה על הכיסא, וניצוץ שנע על הזהב": "מעולה"): a warm light before and above the throne,
      // and a small one that goes slowly to and fro over the steps, so that a glint wanders on the gold (their strength, colour and way:
      // model choices). Both are in the throne's group: with the palace hidden they do not light.
      {
        const warm = new PointLight(0xFFD49A, 9, 34, 1.7);
        warm.position.set(X, Y + 9.5, zF + 3.5);
        warm.name = "throneWarmLight";
        g.add(warm);
        const glint = new PointLight(0xFFF1CF, 5, 9, 2);
        glint.position.set(X, top + 2.4, zF - 3 * ST);
        glint.name = "throneGlintLight";
        g.add(glint);
        if (Array.isArray(ctx.animated)) ctx.animated.push((t) => {
          const u = (typeof t === "number" ? t : performance.now()) * 0.001;
          glint.position.set(X + 4.2 * Math.sin(u * 0.43), top + 2.2 + 0.5 * Math.sin(u * 0.29), zF - 3 * ST + 3.2 * Math.cos(u * 0.31));
        });
      }
''')
io.open(P, 'w', encoding='utf-8').write(s)
print('60-palace.js: patched (flat stones, warm light and glint)')
