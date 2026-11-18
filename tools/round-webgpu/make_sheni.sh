#!/bin/sh
# webgpu round, the Second Temple: build its readable bundle from a readable source in two steps - the library block (sheni_lib.py),
# then the module edits by text anchors (sheni_patch.py). The source: 2.0.18's unified-plugin/sheni/bundle.js, or 3.0's sheni-src/bundle.js.
# Usage: sh tools/round-webgpu/make_sheni.sh <readable source bundle> <out bundle> <webgl|webgpu> [library dir, default /home/claude/libbuild]
#   webgl  - three.js 187 with WebGLRenderer (lib187.js; step 1b)
#   webgpu - three.js 187 with WebGPURenderer (lib-webgpu.js; steps 1b + 1c)
# The library blocks are made by makelib.mjs / makelib-webgpu.mjs (three@0.187.0 + esbuild) - see tools/round-webgpu/README.md.
set -e
IN="$1"; OUT="$2"; MODE="$3"; LIBDIR="${4:-/home/claude/libbuild}"
HERE=$(cd "$(dirname "$0")" && pwd)
cp "$IN" "$OUT"
if [ "$MODE" = webgpu ]; then
  python3 "$HERE/sheni_lib.py" "$OUT" "$LIBDIR/lib-webgpu.js"
  python3 "$HERE/sheni_patch.py" "$OUT" 1b 1c
else
  python3 "$HERE/sheni_lib.py" "$OUT" "$LIBDIR/lib187.js"
  python3 "$HERE/sheni_patch.py" "$OUT" 1b
fi
node --check "$OUT"
echo "make_sheni: $OUT ($MODE) OK"
