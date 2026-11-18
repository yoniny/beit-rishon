#!/bin/sh
# the final checks of 3.0.0 on dist-unified (each writes its own log)
W=/home/claude/work219; P=$W/dist-unified/plugin; H="$W/dist-unified/בית המקדש - לצפייה בלי אוצריא - גרסה 3.0.0.html"
cd $W; rm -rf v4; mkdir -p v4
timeout 1500 node demos.mjs $P v4/demos > v4/demos.log 2>&1; echo "demos EXIT $?" >> v4/status
timeout 1200 node camtest.mjs $P rishon v4/cam-r 8831 > v4/cam-r.log 2>&1; echo "cam-r EXIT $?" >> v4/status
timeout 1200 node camtest.mjs $P sheni v4/cam-s 8832 > v4/cam-s.log 2>&1; echo "cam-s EXIT $?" >> v4/status
LANG=C.UTF-8 timeout 900 node bar-local.mjs $P "$H" v4/bar > v4/bar.log 2>&1; echo "bar EXIT $?" >> v4/status
echo ALLDONE >> v4/status
