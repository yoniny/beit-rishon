#!/usr/bin/env python3
# docs/תיאור העדכון 2.0.4.txt of the unified plugin, from the two "מה חדש" lists of versions_204.py (the marks ** taken off)
import sys
src = open('/home/claude/tools204/versions_204.py', encoding='utf-8').read()
ns = {}
exec(src.split("if __name__")[0], ns)
clean = lambda s: s.replace('@מאוחד ', '').replace('**', '')
NOTE = 'הדגמת ארבעת הפייסות ו״ברקאי״; לשכת הגזית כמאירי; מתגי שיטות חדשים בשני הבתים; כסא שלמה; כפתור אחד בסרגל הספר; מצגות מתוקנות.'
assert len(NOTE) <= 150, len(NOTE)
out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.4', '',
       'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
       'בבית ראשון (1.3.7):']
out += ['• ' + clean(x) for x in ns['B1_NEWS']]
out += ['', 'בבית שני (1.9.5):']
out += ['• ' + clean(x) for x in ns['B2_NEWS']]
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(len(out), 'lines; the store note:', len(NOTE), 'chars')
