#!/bin/bash
cd /home/claude/fix/rel
cp shared/90-entry.js /tmp/90-entry.cur
python3 /tmp/timing.py shared/90-entry.js || { cp /tmp/90-entry.cur shared/90-entry.js; echo "timing FAIL"; exit 1; }
bash /tmp/fullbuild.sh unified-tim
cp /tmp/90-entry.cur shared/90-entry.js
