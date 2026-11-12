#!/bin/sh
# the final build and every test of the round of 12.11.2026 (2.0.5 = B1 1.3.8 + B2 1.9.6): two lanes side by side (two cores), then the
# unified test alone (under two busy lanes its one-file part ran out of time)
W=/home/claude/qa/wt
rm -f $W/final.done $W/laneA.done $W/laneB.done $W/idem.log $W/norepeat.log
# 1. the B2 chain run again by make.sh must give the same content and the same bundle (a content step that adds its text on every run
#    fails here; 2.0.4 went out with a paragraph of the Gazit card five times)
( cd /home/claude/b2src && sh tools/chain.sh > $W/chain1.log 2>&1 && md5sum tools/content.json plugin/bundle.js > $W/idem1.md5 ) || { echo CHAIN-FAILED > $W/idem.log; echo FAIL > $W/final.done; exit 1; }
sh /home/claude/deliver/make.sh > $W/make.log 2>&1 || { echo MAKE-FAILED >> $W/make.log; echo FAIL > $W/final.done; exit 1; }
( cd /home/claude/b2src && md5sum tools/content.json plugin/bundle.js > $W/idem2.md5 )
if cmp -s $W/idem1.md5 $W/idem2.md5; then echo IDEMPOTENT-OK > $W/idem.log; else echo IDEMPOTENT-FAILED > $W/idem.log; fi
# 2. no text of the two bundles repeats a sentence or a paragraph
python3 -I /home/claude/qa/fs/norepeat.py /home/claude/dist-unified/plugin/rishon/bundle.js /home/claude/dist-unified/plugin/sheni/bundle.js > $W/norepeat.log 2>&1
rm -rf $W/p1 $W/p2 && cp -r /home/claude/beit-rishon/plugin $W/p1 && cp -r /home/claude/b2src/plugin $W/p2
( cd /home/claude/qa/fs
  timeout 600 node u.mjs /home/claude/dist-unified/plugin $W/sh > $W/u.log 2>&1
  timeout 240 node look.mjs /home/claude/dist-unified/plugin /home/claude/qa/look/final > $W/look.log 2>&1
  timeout 900 node f.mjs /home/claude/dist-unified/plugin "/home/claude/dist-unified/בית המקדש - לצפייה בלי אוצריא.html" > $W/f.log 2>&1
  echo DONE > $W/laneA.done ) &
( cd /home/claude/qa/fs
  timeout 170 node w.mjs $W/p1 rishon $W/sh > $W/w1.log 2>&1
  timeout 170 node w.mjs $W/p2 sheni $W/sh > $W/w2.log 2>&1
  timeout 240 node e.mjs $W/p1 > $W/e1.log 2>&1
  timeout 240 node e.mjs $W/p2 > $W/e2.log 2>&1
  timeout 400 node t3.mjs $W/p1 rishon > $W/t31.log 2>&1
  timeout 600 node t3.mjs $W/p2 sheni > $W/t32.log 2>&1
  timeout 300 node t4.mjs $W/p1 rishon > $W/t41.log 2>&1
  timeout 300 node t4.mjs $W/p2 sheni > $W/t42.log 2>&1
  timeout 420 node t5.mjs $W/p1 rishon > $W/t51.log 2>&1
  timeout 480 node t5.mjs $W/p2 sheni > $W/t52.log 2>&1
  echo DONE > $W/laneB.done ) &
wait
( cd /home/claude/unified-wt && timeout 600 node tools/qa-unified.mjs /home/claude/dist-unified/plugin --standalone "/home/claude/dist-unified/בית המקדש - לצפייה בלי אוצריא.html" > $W/qa.log 2>&1 )
echo DONE > $W/final.done
