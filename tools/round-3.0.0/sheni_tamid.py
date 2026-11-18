# Round 3.0.0, the Second Temple: LAMPS_HANDS_219 - the trimming priest's hand at each lamp (the morning service, "הטבת חמש נרות" and
# "הטבת שתי נרות"), from the agent's edits (tamid_edits.json, written against the file with its " //" line ends; applied here to the plain text)
import sys, json, re, os
src, dst = sys.argv[1:3]
s = open(src, encoding='utf-8').read()
E = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tamid_edits.json'), encoding='utf-8'))
for e in E:
    old, new = e['old'], re.sub(r'(?<=\S) //(?=\n|$)', '', e['new'])
    assert s.count(old) == 1, ('tamid', old[:60], s.count(old))
    s = s.replace(old, new)
open(dst, 'w', encoding='utf-8').write(s)
print('sheni tamid: ok')
