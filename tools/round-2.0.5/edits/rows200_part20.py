# the part of b2src/tools/rows_200.py written in this round (it runs inside that script: row(), _pl() and c are its own)
# ---------------------------------------------------------------- 20. VIEWS THAT DID NOT SHOW THEIR MATTER (VIEWFIX_205)
# The user, 12.11.2026 12:11-12:18: "אם אני לוחץ על תקר[ה] אמורה להיות תקרה"; "שערי בית המ[ו]קד עפ"י המבטים לא מצלחים להבין את המח'";
# the row "הפייס הראשון" (a white wall in his window); "שתי הפרוכות לא מציג בין שתי הפרוכות, אלא מציג משהו אחר".
_r = row('תקרת האולם')
_r['pickJs'] = ('if (ctx.shared.ulamCeiling && typeof ctx.shared.ulamCeiling.set === "function") ctx.shared.ulamCeiling.set(k === "o1" ? "none" : "vault"); '
                'if (k !== "o1") for (const id of ["hei-ulam", "hei-ulam-front"]) { const b = (ctx.shared.modelButtons || []).find((x) => x.id === id); '
                'try { if (b && b.get && b.get()) b.set(false); } catch (_) {} }')   # the vault is looked at from inside: the ulam's roof and front are shut for it
_r['opts'][0]['cam'] = [7, 24.5, 29]; _r['opts'][0]['tg'] = [7, 55, 0]   # from the hall's south end, up along the vault; the look point stays UNDER the beams and the vault (a look point over them put the eye on their top: the engine keeps the eye over the floor of what it looks at)
_r = row('שערי בית המוקד')
for _o in _r['opts']:
    _o['cam'] = [8, 66, -112]; _o['tg'] = [-15, 17, -69]         # one view for both readings, from the north-east and above, the roofs open: the north wall and the east wall (the gate to the chel is in the one or in the other) and, over them, the gate to the court
_r = row('שמות שערי הצפון — אבא יוסי בן חנן')
_r['opts'][0]['cam'] = [-46, 54, -118]; _r['opts'][0]['tg'] = [-33, 29, -67]   # from the north, west of the hearth house: the Korban gate, the small gate (the Women's, by Tiferet Yisrael) and the hearth house
_r['opts'][1]['cam'] = [10, 54, -118]; _r['opts'][1]['tg'] = [-8, 29, -67]     # from the north, east of it: the hearth house (the Women's gate, by the rejected reading) and the small gate east of it
_r = row('שער העליון')
_o = _r['opts'][1]
_o['tourThen'] = [{'cam': [-150, 62, 118], 'tg': [-86, 16, 40]}, {'cam': [-40, 46, -110], 'tg': [-36, 22, -67]}]   # the Upper Gate and the two of the west; the small gate of the north
_s = 'במודל: במבט הכללי עומדת דסקית מעל כל שער — זהובה מעל שבעת הגדולים ואדומה מעל ששת הקטנים — כדי שיימנו מרחוק.'
if _s not in _o['info']: _o['info'] = _o['info'].rstrip() + '\n' + _s
_r = row('הפייס הראשון — היכן ומתי')
_r['opts'][1]['cam'] = [-18, 76, -50]; _r['opts'][1]['tg'] = [-18, 15, -67]
_p = _pl('שתי הפרוכות — בין הקודש לקודש הקדשים')
_p.pop('section', None)                                          # no cut: the eye stands BETWEEN the two, in the outer one's open end
_p['cam'] = [-45.05, 26.2, 9.75]; _p['tg'] = [-44.95, 24.6, -9]  # looking north along the amah between them; at the right, the open end to the kodesh
_p['tourThen'] = [{'cam': [-41.5, 26, 6.5], 'tg': [-45.2, 25.2, 9.4]}, {'cam': [-44.95, 26.2, -9.75], 'tg': [-45.05, 24.6, 9]}]   # the outer one's open end from the kodesh; from the north end back along the amah (the inner one's open end at the right)
_p = _pl('כלונסות הארז שבאולם'); _p['tourThen'] = [{'cam': [7, 24.5, 29], 'tg': [7, 55, 0]}]   # from below; the look point under the beams (see the vault's row)
_p = _pl('הסורג'); _p['cam'] = [262, 4.2, 22]; _p['tg'] = [246, 1.2, 8]   # near and low: the lattice between its posts, the gap before the gate (from 50 amot and 18 high it was a line on the floor)
# VIEWFIX_205 c (the scan of the dispute slides, 12.11.2026): four readings whose slide did not show their matter
_r = row('שער העליון'); _r['opts'][2]['cam'] = [165, 44, 22]; _r['opts'][2]['tg'] = [97, 30, 0]     # the Rambam: "שער העליון" is Nikanor's gate - its own view (was the far view of the whole court)
_r = row('רוחב האולם ובית החליפות')
for _o in _r['opts']:
    _o['cam'] = [8, 160, 12]; _o['tg'] = [7, 60, 12]            # (as it was: a try from further east, 12.11.2026, turned the whole house to glass and showed less - put back)
_r = row('דלתות ההיכל — ארבע הדלתות')
for _o in _r['opts']:
    _o['cam'] = [-21, 33, 6]; _o['tg'] = [-2, 31, 0]            # from inside the kodesh, on the great gate - as the place of the four doors (both readings' own eyes stood inside the south wall and the engine threw them out: the slide showed the parochet)
_r = row('חומר המנורה והשולחן')
for _o in _r['opts'][1:]:
    _o['tourThen'] = [{'cam': [-32.8, 27.3, 7.7], 'tg': [-37, 25.8, 6.5]}, {'cam': [-30.8, 28.5, -4.4], 'tg': [-37, 26.2, -7]}]   # near the menorah, near the table
# BREAD_205: the marble table's loaves are now the loaves of the table inside (src/50-heichal.js)
_p = _pl('שלחנות האולם — שיש וזהב')
_k = _p['info'].find('במודל (מ־1.9.1)')
assert _k > 0
_p['info'] = _p['info'][:_k] + ('במודל (מ־1.9.1): השולחנות שתי אמות וחומש על אמה וחומש, וגבהם אמה ושלושה חומשים — בחירת מודל.\n'
    'במודל (מ־1.9.6): על שלחן השיש — שתים עשרה החלות בצורתן שעל השולחן שבפנים (כרטיס ״שולחן לחם הפנים״), שש על שש, בלי הסניפים והקנים. '
    'אופן הנחתן על שלחן השיש לא נתפרש במקורות שבכרטיס — בחירת מודל.')
