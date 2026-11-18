#!/bin/sh
# Round 3.0.0 build: the First Temple from src/, the Second Temple by the same camera changes applied to its built bundle (2.0.9)
set -e
R=/home/claude/beit-rishon; W=/home/claude/work219
cd $R
node tools/build.mjs > $W/build-rishon.log 2>&1 || { tail -20 $W/build-rishon.log; exit 1; }
# the base: the readable 2.0.9 bundle of 2.0.18 (2409ca0); from 3.0.0 on, the readable bundle is sheni-src/bundle.js
git show 2409ca0:unified-plugin/sheni/bundle.js > $W/sheni-orig.js
python3 -I $W/strip.py $W/sheni-orig.js $W/sheni-plain.js
python3 -I $W/hunks.py $R $W/sheni-plain.js $W/sheni-p1.js 2 src/90-entry.js src/70-ui.js src/75-tour.js > $W/hunks.log
python3 -I $W/sheni_extra.py $W/sheni-p1.js $W/sheni-p4.js
python3 -I $W/sheni_tamid.py $W/sheni-p4.js $W/sheni-p5.js
if [ -f $W/sheni_sounds.py ]; then python3 -I $W/sheni_sounds.py $W/sheni-p5.js $W/sheni-p6.js; else cp $W/sheni-p5.js $W/sheni-p6.js; fi
python3 -I $W/sheni_hp.py $W/sheni-p6.js $W/sheni-p7.js
cp $W/sheni-p7.js $W/sheni-219.js
node tools/safe-lines.mjs $W/sheni-219.js
node --check $W/sheni-219.js
# SIZE_300: the Second Temple ships minified (the readable bundle stays the source of the next patch: sheni-src/bundle.js in the repo)
node $W/minify.mjs $W/sheni-219.js $W/sheni-219.min.js
node --check $W/sheni-219.min.js
rm -rf $W/sheni-house $W/dist-unified
python3 -I tools/round-2.0.18/house_sheni.py $W/sheni-219.min.js 2.0.10 $W/sheni-house
node tools/build-unified.mjs --rishon plugin --sheni $W/sheni-house --out $W/dist-unified --version 3.0.0 | tail -4
cat $W/hunks.log | python3 -I -c "import json,sys; d=json.load(sys.stdin); print('hunks', d['hunks'], 'applied', d['applied'], 'failed', [f['hdr'] for f in d['failed']])"
