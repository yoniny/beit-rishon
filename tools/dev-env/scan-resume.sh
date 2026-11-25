#!/bin/bash
# idempotent: runs every missing category of one house, one category at a time; a finished category (result-<house>-<cat>.json) is skipped
# usage: scan-resume.sh <house> <out> [plugin]
H=$1; OUT=$2; PL=${3:-build/unified-42d/plugin}; cd /home/claude/fix/rel
for C in views ui walk perf toggles demos; do
  [ -s "$OUT/result-$H-$C.json" ] && grep -q '"findings"' "$OUT/result-$H-$C.json" && continue
  node tools/scan-full.mjs --plugin $PL --houses $H --cats $C --out $OUT >> $OUT.log 2>&1
done
