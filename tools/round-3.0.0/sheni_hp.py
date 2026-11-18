# HP_WALK_219: the High Priest's walk on Yom Kippur (the user: "נתקע בקיר, אחר כך מתקן") - the walk's waypoints off the walls, rounded
# bends, steady speed, the camera's keys inside the room, the heading by the way ahead (an agent's simulation; hp_edits.json)
import sys, json, os
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
E = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'hp_edits.json'), encoding='utf-8'))
for name, old, new in E:
    n = s.count(old)
    if n != 1: sys.exit('sheni hp: %s found %d times' % (name, n))
    s = s.replace(old, new)
open(dst, 'w', encoding='utf-8').write(s)
print('sheni hp: ok (%d)' % len(E))
