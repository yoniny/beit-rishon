# -*- coding: utf-8 -*-
# webgpu round, the Second Temple, its own step: replace the three.js library block of a readable bundle (2.0.18's
# unified-plugin/sheni/bundle.js, or 3.0's sheni-src/bundle.js). Found by text, not by line numbers: the bundle keeps its header comment
# and the IIFE opening with esbuild's two helpers ("var OtzariaPlugin = (() => {" ... "  };"); the library block runs from there to the
# first module, "  // plugin/js/core.js". The new block (lib187.js: three.js 187 for WebGLRenderer, flat scope; lib-webgpu.js:
# three.js 187's WebGPU build in its own inner IIFE, its exports destructured into the plugin's scope) starts with the same IIFE opening:
# whatever of it comes before its first section is dropped (lib187: the opening and the helpers; lib-webgpu: the opening line). Then, when
# the bundle closes its lines with " //", node tools/safe-lines.mjs closes the new lines too (it proves that only comments were added).
# Usage: python3 tools/round-webgpu/sheni_lib.py <bundle.js (rewritten in place)> <library block file>
import sys, subprocess, os
BUNDLE, BLOCK = sys.argv[1], sys.argv[2]
B = open(BUNDLE, encoding='utf-8').read().split('\n')
src = lambda l: l[:-3] if l.endswith(' //') else l
suffixed = sum(1 for l in B[:400] if l.endswith(' //')) > 50
op = next(i for i, l in enumerate(B) if src(l).startswith('var OtzariaPlugin = (() => {'))
hl = next(i for i in range(op, op + 12) if src(B[i]).rstrip() == '  };')
start = hl + 1
while B[start].strip() == '':
    start += 1
end = next(i for i, l in enumerate(B) if src(l).startswith('  // plugin/js/core.js'))
L = open(BLOCK, encoding='utf-8').read().split('\n')
if L[0].startswith('var OtzariaPlugin = (() => {'):
    k = next((i for i, l in enumerate(L) if l.startswith('  // plugin/lib/three.module.js')), 1)
    L = L[k:]
while L and L[-1].strip() == '':
    L.pop()
out = B[:start] + L + [''] + B[end:]
open(BUNDLE, 'w', encoding='utf-8').write('\n'.join(out))
print('library block: lines', start + 1, '..', end, 'replaced by', len(L), 'lines (' + os.path.basename(BLOCK) + ')')
if suffixed:
    here = os.path.dirname(os.path.abspath(__file__))
    subprocess.run(['node', os.path.join(here, '..', 'safe-lines.mjs'), BUNDLE], check=True)
