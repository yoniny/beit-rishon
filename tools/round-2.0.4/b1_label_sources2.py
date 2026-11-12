#!/usr/bin/env python3
# B1 1.3.7 - LABELS_ROUND_137: the labels added in this round had no card (the console's warning "labels without sources", found by
# qa/fs/u.mjs in the final tests, 12.11.2026): the two halves of the Gazit hall open its card; every label of the layer
# "gatekeepers" opens the card of the place "משמרות השוערים (דברי הימים א כו)". Idempotent.
import io, sys
P = '/home/claude/beit-rishon/src/70-ui.js'
s = io.open(P, encoding='utf-8').read()
if 'LABELS_ROUND_137' in s:
    print('already'); sys.exit(0)
a = '          let m = Object.prototype.hasOwnProperty.call(LABEL_MAP, l.text) ? LABEL_MAP[l.text] : null;\n'
assert s.count(a) == 1
s = s.replace(a, a + '          if (!m && l.layer === "gatekeepers") m = { p: "משמרות השוערים (דברי הימים א כו)" };   // 1.3.7 (LABELS_ROUND_137): every label of the layer\n')
b = '          // 1.3.7 (LABELS_DEVIR_HEIGHT_137): the labels of the two readings of a devir thirty amot high\n'
assert s.count(b) == 1
s = s.replace(b, '          // 1.3.7 (LABELS_ROUND_137): the two halves of the Gazit hall (GAZIT_MEIRI_137)\n'
              '          "חצי החול — במערב": { p: "לשכת הגזית" },\n          "חצי הקודש — במזרח": { p: "לשכת הגזית" },\n' + b)
io.open(P, 'w', encoding='utf-8').write(s)
print('applied')
