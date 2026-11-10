#!/usr/bin/env python3
# docs/תיאור העדכון 2.0.2.txt of the unified plugin, from the two "מה חדש" lists of kuntres_news.py (the marks ** and @מאוחד taken off)
import re, sys, importlib.util
src = open('/home/claude/tools196/kuntres_news.py', encoding='utf-8').read()
ns = {}
exec(src[src.index('B1_NEWS = ['):src.index('# ---- B1: the entry of 1.3.5')], {'J': None}, ns)
clean = lambda s: s.replace('@מאוחד ', '').replace('**', '')
NOTE = 'שני בתי המקדש בתוסף אחד; חיפוש לפי מילות הפסוק והמשנה; כפתור בחיפוש של אוצריא ובעוד ספרים; שיפוע הרצפה, כיפת האולם ועוד.'
assert len(NOTE) <= 150, len(NOTE)
uni = [x for x in ns['B1_NEWS'] if x.startswith('@מאוחד ')]
out = ['בית המקדש (בית ראשון ובית שני בתוסף אחד) — גרסה 2.0.2', '',
       'הערת העדכון לחנות (עד 150 תווים; כאן %d):' % len(NOTE), NOTE, '',
       'בתוסף כולו:']
out += ['• ' + clean(x) for x in uni]
out += ['• הודעה חד־פעמית במסך הבחירה מסבירה את האיחוד ואת החידושים העיקריים.', '',
        'בבית ראשון (1.3.5) — כל מה שהתחדש מאז 1.3.2:']
out += ['• ' + clean(x) for x in ns['B1_NEWS'] if not x.startswith('@מאוחד ')]
out += ['', 'בית שני (1.9.3) — הבית כולו, בקצרה:']
out += ['• ' + clean(x) for x in ns['B2_NEWS'] if not x.startswith('@מאוחד ')]
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(len(out), 'lines; the store note:', len(NOTE), 'chars')
