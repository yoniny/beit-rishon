#!/bin/bash
# 3.0.0: when a recording job ends, start the next one (the throne readings), two at a time
cd /home/claude/usb/rec
OUT=/home/claude/usb/out
QUEUE=("T1|--throne --from 89 --to 89" "T2|--throne --from 90 --to 91")
i=0
while [ $i -lt ${#QUEUE[@]} ]; do
  n=$(pgrep -fc "node rec.mjs")
  if [ "$n" -lt 2 ]; then
    job=${QUEUE[$i]%%|*}; a=${QUEUE[$i]#*|}
    echo "$(date -u +%H:%M:%S) start $job" >> $OUT/sched3.log
    rm -rf $OUT/$job
    nohup node rec.mjs --job $job $a --out $OUT/$job > $OUT/$job.log 2>&1 &
    i=$((i+1))
    sleep 30
  fi
  sleep 15
done
echo "$(date -u +%H:%M:%S) queue started" >> $OUT/sched3.log
