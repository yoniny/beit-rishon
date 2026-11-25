#!/bin/bash
# usage: fullbuild.sh <outname>
cd /home/claude/fix/rel
node tools/build.mjs > /tmp/b-r.log 2>&1 || { echo "rishon FAIL"; tail -n 15 /tmp/b-r.log; exit 1; }
node tools/build-sheni.mjs --house build/sheni/house3 > /tmp/b-s.log 2>&1 || { echo "sheni FAIL"; grep -v "^\s*at " /tmp/b-s.log | tail -n 12; git checkout plugin/bundle.js plugin/index.html; exit 1; }
node tools/build-unified.mjs --rishon plugin --sheni build/sheni/house3 --out build/$1 --version 4.2.0 --no-pack > /tmp/b-u.log 2>&1 || { echo "unified FAIL"; tail -n 10 /tmp/b-u.log; git checkout plugin/bundle.js plugin/index.html; exit 1; }
git checkout plugin/bundle.js plugin/index.html 2>/dev/null
echo "built build/$1"
