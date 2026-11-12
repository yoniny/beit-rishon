#!/usr/bin/env python3
# ZOOM_CURSOR_207 (12.11.2026 20:23, the user: "כשעושים זום להגדיל ע"י גלגול העכבר, הוא מגדיל את הנראות ממרכז התמונה... הבקשה היא שהוא
# לא יגדיל סתם אקראית את התמונה ממרכזה, אלא יהיה אפשר לעמוד עם סמן (בצורת זכוכית מגדלת) והמקום עליו עומד הסמן - הוא זה שיוגדל בזום";
# 20:27 "הכל באותה הגרסה"; "אגב זום, זה לא מתכונת לבאגים?"). Both houses' 90-entry.js (the same code in both).
# THE WHEEL ZOOMS TO THE POINT UNDER THE CURSOR: every wheel event (a mouse notch too - until now OrbitControls' own dolly, to the view's
# middle) goes by ent_zoom; at the start of a burst the point of the model under the cursor is found (a ray from the cursor; not the sky,
# not what is hidden or see-through, not the sprites); each eased step is a homothety about that point (the eye AND the target scaled
# toward it by the same ratio), so the point stays under the cursor and grows. Over the sky: the point on the cursor's ray at the
# target's distance. Guards: the eye stops 2 amot before the point under a roof (2.5 in the open); under a roof the limits of WHEEL_ROOFED_205 stay
# (two amot an event, eight pending, 20 amot a second - measured now to the point); the distance limits of the controls stay; a flight
# cancels it. The cursor is a magnifying glass while the wheel turns. Idempotent.
import sys
FILES = ['/home/claude/beit-rishon/src/90-entry.js', '/home/claude/b2src/src/90-entry.js']
R = []
R.append(("  var ent_zoom = { pending: 0, held: false, off: new Vector3() };\n",
'''  var ent_zoom = { pending: 0, held: false, off: new Vector3(), anchor: null, aT: 0, ax: 0, ay: 0, P: new Vector3(), O: new Vector3(), cur: 0 };
  // ZOOM_CURSOR_207 (the user, 12.11.2026 20:23: "המקום עליו עומד הסמן - הוא זה שיוגדל בזום"): the point of the model under the cursor -
  // a ray from the cursor (x, y: the canvas's own pixels); the first solid that is seen (not hidden, not see-through, not a sprite, not the
  // sky); over the sky the point of the ray at the target's distance
  var ent_zoomRay = null;
  function ent_zoomAnchor(el, cx, cy) {
    try {
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return null;
      const ray = ent_zoomRay || (ent_zoomRay = new Raycaster());
      ray.setFromCamera(new Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1), camera);
      ray.camera = camera;
      ray.near = 0.3;
      ray.far = 3000;
      const seen = (o) => { for (let q = o; q; q = q.parent) { if (!q.visible || q.name === "labels") return false; } return true; };
      for (const h of ray.intersectObjects(scene.children, true)) {
        const o = h.object;
        if (!o.isMesh || o.isSprite || (o.userData && o.userData.noPick) || !seen(o)) continue;
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (!m || (m.uniforms && m.uniforms.sunPosition) || (m.transparent && m.opacity < 0.5) || m.visible === false) continue;
        return h.point.clone();
      }
      const d = camera.position.distanceTo(controls.target);
      return ray.ray.origin.clone().addScaledVector(ray.ray.direction, Math.max(4, d));
    } catch (_) {
      return null;
    }
  }
'''))
R.append(('''      else if (cam.roofed) k = Math.sign(dy) * 0.0513 * Math.max(0.3, Math.min(3, Math.abs(dy) / 100));   // WHEEL_ROOFED_205: under a roof a notch goes by this handler too (see below)
      else return;                                                      // a mouse-wheel notch in the open: OrbitControls, unchanged
''',
'''      else k = Math.sign(dy) * 0.0513 * Math.max(0.3, Math.min(3, Math.abs(dy) / 100));   // a mouse notch: 5% as OrbitControls' (ZOOM_CURSOR_207: by this handler everywhere - to the cursor)
      // ZOOM_CURSOR_207: the point under the cursor, once a burst (a new one after a quarter second, or when the cursor moved)
      const now = performance.now();
      if (!ent_zoom.anchor || now - ent_zoom.aT > 250 || Math.abs(e.clientX - ent_zoom.ax) + Math.abs(e.clientY - ent_zoom.ay) > 6) {
        ent_zoom.anchor = ent_zoomAnchor(el, e.clientX, e.clientY);
        ent_zoom.ax = e.clientX;
        ent_zoom.ay = e.clientY;
      }
      ent_zoom.aT = now;
      el.style.cursor = k < 0 ? "zoom-in" : "zoom-out";   // the magnifying glass while the wheel turns
      clearTimeout(ent_zoom.cur);
      ent_zoom.cur = setTimeout(() => { el.style.cursor = ""; }, 450);
'''))
R.append(('''      if (cam.roofed) {
        const L0 = camera.position.distanceTo(controls.target);
''',
'''      if (cam.roofed) {
        const L0 = ent_zoom.anchor ? camera.position.distanceTo(ent_zoom.anchor) : camera.position.distanceTo(controls.target);   // ZOOM_CURSOR_207: to the point
'''))
R.append(('''        const L1 = camera.position.distanceTo(controls.target);
        if (L1 > 0 && isFinite(L1)) ent_zoom.pending = Math.max(Math.log(1 - Math.min(0.9, 8 / L1)), Math.min(Math.log(1 + 8 / L1), ent_zoom.pending));
''',
'''        const L1 = ent_zoom.anchor ? camera.position.distanceTo(ent_zoom.anchor) : camera.position.distanceTo(controls.target);   // ZOOM_CURSOR_207
        if (L1 > 0 && isFinite(L1)) ent_zoom.pending = Math.max(Math.log(1 - Math.min(0.9, 8 / L1)), Math.min(Math.log(1 + 8 / L1), ent_zoom.pending));
'''))
R.append(('''    if (flyAnim) {
      ent_zoom.pending = 0;
      return;
    }
    const p = ent_zoom.pending;
    if (Math.abs(p) < 1e-4) {
      ent_zoom.pending = 0;
      return;
    }
''',
'''    if (flyAnim) {
      ent_zoom.pending = 0;
      ent_zoom.anchor = null;   // ZOOM_CURSOR_207
      return;
    }
    const p = ent_zoom.pending;
    if (Math.abs(p) < 1e-4) {
      ent_zoom.pending = 0;
      return;
    }
    // ZOOM_CURSOR_207: to the point under the cursor - the eye and the target scaled toward it by one ratio (it stays under the cursor)
    if (ent_zoom.anchor) {
      const P = ent_zoom.anchor;
      let step = Math.abs(p) < 2e-3 ? p : p * Math.max(0.35, 1 - Math.exp(-ent_view.dt / 40));
      const Lp = camera.position.distanceTo(P), L = camera.position.distanceTo(controls.target);
      if (!(Lp > 0) || !isFinite(Lp) || !(L > 0) || !isFinite(L)) {
        ent_zoom.pending = 0;
        ent_zoom.anchor = null;
        return;
      }
      if (cam.roofed) {   // WHEEL_ROOFED_205 b, to the point: 20 amot a second at most
        const lim = 20 * Math.min(100, Math.max(1, ent_view.dt || 16)) / 1000, d = Lp * (Math.exp(step) - 1);
        if (Math.abs(d) > lim) step = Math.log(Math.max(0.05, 1 + Math.sign(d) * lim / Lp));
      }
      let s = Math.exp(step);
      const DMIN = cam.roofed ? 2 : 2.5;   // never into the thing itself (under a roof 2: cam_keepInside's own margin is not met)
      if (s < 1 && Lp * s < DMIN) {
        if (Lp <= DMIN + 1e-3) { ent_zoom.pending = 0; return; }
        s = DMIN / Lp;
      }
      const L2 = Math.min(controls.maxDistance || 2200, Math.max(controls.minDistance || 2, L * s));
      s = L2 / L;
      camera.position.sub(P).multiplyScalar(s).add(P);
      controls.target.sub(P).multiplyScalar(s).add(P);
      ent_zoom.pending = Math.abs(Math.log(s) - step) < 1e-6 ? p - step : 0;   // at a limit: drop the rest
      return;
    }
'''))
R.append(("  (function wheelZoom(el) {\n", "  (function wheelZoom(el) {\n    window.__zoomQA = { anchor: () => (ent_zoom.anchor ? ent_zoom.anchor.toArray() : null), at: (x, y) => { const p = ent_zoomAnchor(el, x, y); return p ? p.toArray() : null; } };   // ZOOM_CURSOR_207 (tests)\n"))
for f in FILES:
    s = open(f, encoding='utf-8').read()
    if 'ZOOM_CURSOR_207' in s:
        print('already:', f); continue
    for a, b in R:
        assert s.count(a) == 1, (f, a[:80], s.count(a))
        s = s.replace(a, b)
    open(f, 'w', encoding='utf-8').write(s); print('patched:', f)
