#!/bin/sh
# round 2.0.7 final (B1 1.4.0, B2 1.9.8): the build twice (the same content and bundle), the delivery (the morning's service, the versions,
# no repeated text), then two lanes - the first house and the second - each: errors and load, the windows, the presentation's demonstrations
# in real time, the zoom to the cursor, the pause; the second also the linked lotteries and the morning's service; at the end the unified test
W=/home/claude/qa/wt
rm -f $W/final9.done $W/laneA9.done $W/laneB9.done
( cd /home/claude/b2src && sh tools/chain.sh > $W/chain1.log 2>&1 && md5sum tools/content.json plugin/bundle.js > $W/idem1.md5 ) || { echo CHAIN-FAILED > $W/idem.log; echo FAIL > $W/final9.done; exit 1; }
sh /home/claude/deliver/make.sh > $W/make.log 2>&1 || { echo MAKE-FAILED >> $W/make.log; echo FAIL > $W/final9.done; exit 1; }
( cd /home/claude/b2src && md5sum tools/content.json plugin/bundle.js > $W/idem2.md5 )
if cmp -s $W/idem1.md5 $W/idem2.md5; then echo IDEMPOTENT-OK > $W/idem.log; else echo IDEMPOTENT-FAILED > $W/idem.log; fi
D=/home/claude/dist-unified/plugin
{ grep -q 'key: "tamid"' $D/sheni/bundle.js && grep -q 'סדר עבודת הבוקר — אביי' $D/sheni/bundle.js && echo TAMID-IN-DELIVERY-OK || echo TAMID-MISSING
  grep -q '"version": "2.0.7"' $D/manifest.json && echo UNIFIED-2.0.7-OK || echo UNIFIED-VERSION-WRONG
  grep -q '\["1.4.0", *\[' $D/rishon/bundle.js && echo B1-NEWS-1.4.0-OK || echo B1-NEWS-MISSING
  grep -q '\["1.9.8", *\[' $D/sheni/bundle.js && grep -q 'שתי שורות מקושרות' $D/sheni/bundle.js && echo B2-NEWS-1.9.8-OK || echo B2-NEWS-MISSING
  for h in rishon sheni; do c=$(grep -c 'tm-dpause' $D/$h/bundle.js); z=$(grep -c '__zoomQA' $D/$h/bundle.js); echo "$h: pause-bar $c, zoom $z"; done
} > $W/deliv9.log 2>&1
python3 -I /home/claude/qa/fs/norepeat.py $D/rishon/bundle.js $D/sheni/bundle.js > $W/norepeat.log 2>&1
rm -rf $W/p1 $W/p2 && cp -r /home/claude/beit-rishon/plugin $W/p1 && cp -r /home/claude/b2src/plugin $W/p2
(
  cd /home/claude/qa/fs
  timeout 240 node e.mjs $W/p1 > $W/e1.log 2>&1
  timeout 170 node w.mjs $W/p1 rishon $W/s1 > $W/w1.log 2>&1
  timeout 600 node t6.mjs $W/p1 rishon > $W/t61.log 2>&1
  cd /home/claude/qa/zoom && timeout 300 node z1.mjs $W/p1 rishon /home/claude/qa/zoom/r1 > $W/z1r.log 2>&1
  cd /home/claude/qa/pause && timeout 300 node p1.mjs $W/p1 rishon > $W/p1r.log 2>&1
  echo done > $W/laneA9.done
) &
(
  cd /home/claude/qa/fs
  timeout 240 node e.mjs $W/p2 > $W/e2.log 2>&1
  timeout 170 node w.mjs $W/p2 sheni $W/sh > $W/w2.log 2>&1
  timeout 600 node t6.mjs $W/p2 sheni > $W/t62.log 2>&1
  cd /home/claude/qa/zoom && timeout 300 node z1.mjs $W/p2 sheni /home/claude/qa/zoom/s1 > $W/z1s.log 2>&1
  cd /home/claude/qa/pause && timeout 300 node p1.mjs $W/p2 sheni > $W/p1s.log 2>&1
  cd /home/claude/qa/tamid && timeout 200 node lots.mjs $W/p2 > $W/lots.log 2>&1
  timeout 400 node live.mjs $W/p2 /home/claude/qa/tamid/lvF abba 3800 0,9,16,28,33 > $W/tamid.log 2>&1
  echo done > $W/laneB9.done
) &
wait
cd /home/claude/unified-wt && timeout 600 node tools/qa-unified.mjs $D --standalone "/home/claude/dist-unified/בית המקדש - לצפייה בלי אוצריא.html" > $W/qa.log 2>&1
echo DONE > $W/final9.done
