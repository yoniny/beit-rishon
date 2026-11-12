# 1.3.7 (the user, 11.11.2026 18:31, of the light one-toned stone: "זה לא נקרא אבן יקרה, זה נראה אבן פשוטה"): the facing of the
# Radak's reading drawn from THE GOOD STONES HE NAMES ("בלשם שבו ושוהם וספיר ודומיהם מן האבנים הטובות") - large polished slabs with the
# stones' own layers and veins. usage: python3 b1_gem_variants.py [warm|cool|four]   (the variant; re-runnable: replaces the block)
import io, sys, re
V = sys.argv[1] if len(sys.argv) > 1 else 'warm'
P = '/home/claude/beit-rishon/src/50-heichal.js'
s = io.open(P, encoding='utf-8').read()
a = s.index('    const hei_gemStone = (() => {')
b = s.index('    })();', a) + len('    })();')
body = io.open('/home/claude/qa/r3/gem/gemdraw.js', encoding='utf-8').read()
body = '\n'.join(('      ' + l if l.strip() else l) for l in body.split('\n')).rstrip()
new = '''    const hei_gemStone = (() => {
      // 1.3.7, third drawing (the user: first "זה צבעוני, אמרתי לך לא לעשות תכשיטים", then of one pale stone "זה לא נקרא אבן יקרה, זה
      // נראה אבן פשוטה"): the good stones the Radak names, as A WALL FACING - slabs five amot by five, polished, each with its own
      // layers and veins; no cut gems and no settings. GEM_VARIANT chooses the family of the stones' tones (a model choice).
      const GEM_VARIANT = "%s";
%s
      const gm = std(worldTex(makeTex(1024, (c, sz) => gemDraw(c, sz, GEM_VARIANT), { bump: gemBump, bumpSize: 512 }), 10),
        { roughness: 0.3, metalness: 0, envMapIntensity: 0.4, bumpScale: 0.2, emissive: 0xffffff, emissiveIntensity: 0.36 });
      gm.emissiveMap = gm.map;   // the devir has little light of its own: the stone carries its own tone (as the house's other inside materials do)
      return gm;
    })();''' % (V, body)
s = s[:a] + new + s[b:]
io.open(P, 'w', encoding='utf-8').write(s)
print('50-heichal.js: gem facing variant', V)
