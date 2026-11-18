# strip the safe-lines suffix " //" from every line (to apply plain-text patches); safe-lines.mjs adds it back
import sys, re
src, dst = sys.argv[1:3]
s = open(src, encoding='utf-8').read()
out = re.sub(r'(?<=\S) //(?=\n)', '', s)
if out.endswith(' //'): out = out[:-3]
open(dst, 'w', encoding='utf-8').write(out)
print('stripped', s.count(' //\n'), 'lines')
