#!/usr/bin/env python3
# TAMID_QA_207: a test hook (as camAt / figAt): TM.qaClear(eye, target) - the first visible solid of the model on the line from the target
# to the eye (null if the line is free); the demonstration's own figures, the labels and anything hidden are not counted. Used by
# qa/tamid/views.mjs to choose, for a stage whose eye stood inside a wall, an eye from which its place is seen. Idempotent.
import os
p = '/home/claude/b2src/src/55-tamid.js'; s = open(p, encoding='utf-8').read()
if 'TAMID_QA_207' not in s:
    a = "      figAt: (k) => (W && W.figs[k] ? Object.assign({}, W.figs[k].st) : null)   // (tests: where a figure stands)\n"
    b = ("      figAt: (k) => (W && W.figs[k] ? Object.assign({}, W.figs[k].st) : null),   // (tests: where a figure stands)\n"
         "      qaClear: (e, t) => {   // TAMID_QA_207 (tests: is the line from the target to the eye free of the model's solids?)\n"
         "        const o = new Vector3(t[0], t[1], t[2]), d = new Vector3(e[0] - t[0], e[1] - t[1], e[2] - t[2]), len = d.length();\n"
         "        if (len < 1e-3) return null;\n"
         "        const rc = TM._rc || (TM._rc = new Raycaster());\n"
         "        rc.set(o, d.normalize()); rc.near = 0.4; rc.far = len; rc.camera = ctx2.camera;   // (a sprite asks for the camera)\n"
         "        const seen = (x) => { for (let q = x; q; q = q.parent) { if (!q.visible || q === (W && W.group) || q.name === \"labels\") return false; } return true; };\n"
         "        for (const h of rc.intersectObject(ctx2.root, true)) { const m = h.object; if (!m.isMesh || !seen(m)) continue; const mt = Array.isArray(m.material) ? m.material[0] : m.material; if (mt && (mt.transparent && mt.opacity < 0.5)) continue; return [+h.distance.toFixed(2), m.name || (m.parent && m.parent.name) || m.type]; }\n"
         "        return null;\n"
         "      }\n")
    assert s.count(a) == 1
    s = s.replace(a, b)
    open(p, 'w', encoding='utf-8').write(s); print('tamid_qa_207: added')
else: print('tamid_qa_207: already')
