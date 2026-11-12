#!/usr/bin/env python3
# B1 1.3.7 - the two labels of the new readings of the devir's height (50-heichal.js) had no card: the console's warning "labels without
# sources" (found by qa/fs/u.mjs, 11.11.2026). Both open the devir's card, which shows the row "גובה קודש הקדשים". Idempotent.
import io, sys
P = '/home/claude/beit-rishon/src/70-ui.js'
s = io.open(P, encoding='utf-8').read()
if 'LABELS_DEVIR_HEIGHT_137' in s:
    print('already'); sys.exit(0)
a = '          "טבלא של שיש וטבעת — עפר הסוטה": { p: "טבלת השיש — עפר הסוטה" },\n'
assert s.count(a) == 1
b = a + ('          // 1.3.7 (LABELS_DEVIR_HEIGHT_137): the labels of the two readings of a devir thirty amot high\n'
         '          "קודש הקדשים — שלושים אמה, כהיכל (בבא בתרא צח:)": { p: "קודש הקדשים — הדביר" },\n'
         '          "עשר האמות העליונות — אבן יקרה (רד״ק ו, כ)": { p: "קודש הקדשים — הדביר" },\n')
s = s.replace(a, b)
io.open(P, 'w', encoding='utf-8').write(s)
print('applied')
