#!/bin/sh
# round 2.0.9 final (B1 1.4.2, B2 2.0.0, unified 2.0.9) - derived from 2.0.8's final10.sh, with this round's checks:
# the ark in the presentation (verses, the cloud asked once), the presentation's pause pausing a demonstration (B1), the morning's
# service ended by a switch, paused by the banner, started from the panel with its own first view, and the topics passing its slide (B2).
# (the 2.0.8 header follows)
# round 2.0.8 final (B1 1.4.1, B2 1.9.9, unified 2.0.8): the build twice (the same content and bundle), the delivery (versions, news,
# the new pieces, no repeated text), then two lanes - each house: errors and load, the windows, the presentation in real time, the zoom,
# the pause, the pinch; B1 also "דבקו שערים" in real time (both answers to the cloud question) and Yehoyada's chests; B2 also the lots,
# the morning's service, the secret-gifts chamber, every source reference, the 2.0.8 pieces in pictures; at the end the unified test
W=/home/claude/qa/wt
mkdir -p /home/claude/qa/ark/F1 /home/claude/qa/ark/F2 /home/claude/qa/ark/FY /home/claude/qa/chash/F /home/claude/qa/add208/F
mkdir -p $W
rm -f $W/final11.done $W/laneA11.done $W/laneB11.done
( cd /home/claude/b2src && sh tools/chain.sh > $W/chain1.log 2>&1 && md5sum tools/content.json plugin/bundle.js > $W/idem1.md5 ) || { echo CHAIN-FAILED > $W/idem.log; echo FAIL > $W/final11.done; exit 1; }
sh /home/claude/deliver/make.sh > $W/make.log 2>&1 || { echo MAKE-FAILED >> $W/make.log; echo FAIL > $W/final11.done; exit 1; }
( cd /home/claude/b2src && md5sum tools/content.json plugin/bundle.js > $W/idem2.md5 )
if cmp -s $W/idem1.md5 $W/idem2.md5; then echo IDEMPOTENT-OK > $W/idem.log; else echo IDEMPOTENT-FAILED > $W/idem.log; fi
D=/home/claude/dist-unified/plugin
{ grep -q '"version": "2.0.9"' $D/manifest.json && echo UNIFIED-2.0.9-OK || echo UNIFIED-VERSION-WRONG
  grep -q '\["1.4.2", *\[' $D/rishon/bundle.js && echo B1-NEWS-1.4.2-OK || echo B1-NEWS-MISSING
  grep -q '\["2.0.0", *\[' $D/sheni/bundle.js && echo B2-NEWS-2.0.0-OK || echo B2-NEWS-MISSING
  grep -q 'arkGatesDemo' $D/rishon/bundle.js && grep -q 'mnt-yehoyada' $D/rishon/bundle.js && echo B1-ARK-YEHOYADA-OK || echo B1-PIECES-MISSING
  grep -q 'לשכת חשאים' $D/sheni/bundle.js && grep -q 'הנברשת והטבלא של הילני' $D/sheni/bundle.js && echo B2-PIECES-OK || echo B2-PIECES-MISSING
  grep -q 'key: "tamid"' $D/sheni/bundle.js && echo TAMID-IN-DELIVERY-OK || echo TAMID-MISSING
  [ $(grep -o 'הכנסת הארון — ״דבקו שערים״' $D/rishon/bundle.js | wc -l) -ge 2 ] && echo B1-ARK-SLIDE-OK || echo B1-ARK-SLIDE-MISSING
  grep -q 'קודש הקדשים ואבן השתייה' $D/sheni/bundle.js && grep -q 'tourNoAct' $D/sheni/bundle.js && echo B2-209-PIECES-OK || echo B2-209-PIECES-MISSING
} > $W/deliv11.log 2>&1
python3 -I /home/claude/qa/fs/norepeat.py $D/rishon/bundle.js $D/sheni/bundle.js > $W/norepeat.log 2>&1
rm -rf $W/p1 $W/p2 && cp -r /home/claude/beit-rishon/plugin $W/p1 && cp -r /home/claude/b2src/plugin $W/p2
(
  cd /home/claude/qa/fs
  timeout 240 node e.mjs $W/p1 > $W/e1.log 2>&1
  timeout 170 node w.mjs $W/p1 rishon $W/s1 > $W/w1.log 2>&1
  timeout 600 node t6.mjs $W/p1 rishon > $W/t61.log 2>&1
  cd /home/claude/qa/zoom && timeout 300 node z1.mjs $W/p1 rishon /home/claude/qa/zoom/r1 > $W/z1r.log 2>&1
  cd /home/claude/qa/pause && timeout 300 node p1.mjs $W/p1 rishon > $W/p1r.log 2>&1
  cd /home/claude/qa/pinch && timeout 200 node pin.mjs $W/p1 > $W/pin1.log 2>&1
  cd /home/claude/qa/ark && timeout 420 node rt.mjs $W/p1 /home/claude/qa/ark/F1 > $W/rt1.log 2>&1
  timeout 420 node rt.mjs $W/p1 /home/claude/qa/ark/F2 no > $W/rt2.log 2>&1
  timeout 200 node yh.mjs $W/p1 /home/claude/qa/ark/FY > $W/yh.log 2>&1
  mkdir -p /home/claude/qa/tour209/FF && cd /home/claude/qa/tour209 && timeout 360 node ark.mjs $W/p1 /home/claude/qa/tour209/FF verses > $W/tourark.log 2>&1
  timeout 200 node pause1.mjs $W/p1 > $W/pause1.log 2>&1
  echo done > $W/laneA11.done
) &
(
  cd /home/claude/qa/fs
  timeout 240 node e.mjs $W/p2 > $W/e2.log 2>&1
  timeout 170 node w.mjs $W/p2 sheni $W/sh > $W/w2.log 2>&1
  timeout 600 node t6.mjs $W/p2 sheni > $W/t62.log 2>&1
  cd /home/claude/qa/zoom && timeout 300 node z1.mjs $W/p2 sheni /home/claude/qa/zoom/s1 > $W/z1s.log 2>&1
  cd /home/claude/qa/pause && timeout 300 node p1.mjs $W/p2 sheni > $W/p1s.log 2>&1
  cd /home/claude/qa/pinch && timeout 200 node pin.mjs $W/p2 > $W/pin2.log 2>&1
  cd /home/claude/qa/tamid && timeout 200 node lots.mjs $W/p2 > $W/lots.log 2>&1
  timeout 400 node live.mjs $W/p2 /home/claude/qa/tamid/lvF abba 3800 0,9,16,28,33 > $W/tamid.log 2>&1
  cd /home/claude/qa/chash && timeout 300 node check.mjs $W/p2 /home/claude/qa/chash/F > $W/chash.log 2>&1
  timeout 300 node refs.mjs $W/p2 > $W/refs.log 2>&1
  cd /home/claude/qa/add208 && timeout 400 node shots.mjs $W/p2 /home/claude/qa/add208/F > $W/add208.log 2>&1
  cd /home/claude/qa/tour209 && timeout 300 node stop.mjs $W/p2 > $W/stop.log 2>&1
  timeout 200 node t60.mjs $W/p2 60 > $W/t60.log 2>&1
  echo done > $W/laneB11.done
) &
wait
cd /home/claude/unified-wt && timeout 600 node tools/qa-unified.mjs $D --standalone "/home/claude/dist-unified/בית המקדש - לצפייה בלי אוצריא.html" > $W/qa.log 2>&1
echo DONE > $W/final11.done
