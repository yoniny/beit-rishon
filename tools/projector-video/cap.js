// Page-side capture helpers (installed after the plugin is ready and the virtual clock is on).
// window.__cap: step(dt) -> what changed; render(); pages(); showPage(k); drift(dir); ambient detection; header override.
(() => {
  const V = window.__vt, ctx = window.__ctx, R = window.__renderer, T = ctx.shared.tour, E = window.__ent360;
  const cam = ctx.camera, ctl = (window.__TM_CTX && window.__TM_CTX.controls) || ctx.controls;
  const realRender = R.render.bind(R);
  let allow = false;
  // the animation loop's own draws to the screen are skipped; draws into render targets (cube cameras, shadows) still happen
  R.render = function (s, c) { if (allow || R.getRenderTarget() !== null) return realRender(s, c); };
  R.setScissorTest(true);
  R.setScissor(540, 0, 740, 720);   // the area left of x=540 is under the opaque text panel
  const box = document.getElementById('tm-tour-box'), body = box.querySelector('.body');
  const elPart = box.querySelector('.hd .part'), elNum = box.querySelector('.hd .num');
  const pg = document.createElement('div');
  pg.id = 'rec-pg';
  box.appendChild(pg);
  let spacer = null, pageList = null, lastIdx = -99;
  const curtB = document.createElement('div'), curtT = document.createElement('div');
  curtB.id = 'rec-curtB'; curtT.id = 'rec-curtT';
  box.appendChild(curtB); box.appendChild(curtT);
  let curtKey = '';
  const lineFrags = () => {
    const out = [];
    const tw = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const rg = document.createRange();
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (!n.nodeValue.trim()) continue;
      const el = n.parentElement;
      if (el && getComputedStyle(el).display === 'none') continue;
      rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) if (r.width > 0.5 && r.height > 0.5) out.push([r.top, r.bottom]);
    }
    for (const a of body.querySelectorAll('.src a, .caps .cap')) { const r = a.getBoundingClientRect(); if (r.height > 0) out.push([r.top, r.bottom]); }
    return out;
  };
  const curtains = () => {
    const key = body.textContent.length + ':' + body.scrollTop + ':' + body.clientHeight + ':' + box.querySelector('.bubw').className + ':' + box.querySelector('.caps').childElementCount;
    if (key === curtKey) return;
    curtKey = key;
    const br = body.getBoundingClientRect(), bx = box.getBoundingClientRect();
    const fr = lineFrags();
    let lastFull = null, firstFull = null;
    for (const f of fr) if (f[0] >= br.top - 0.5 && f[1] <= br.bottom + 0.5) { if (!firstFull || f[0] < firstFull[0]) firstFull = f; if (!lastFull || f[1] > lastFull[1]) lastFull = f; }
    if (fr.some((f) => f[0] < br.bottom - 0.5 && f[1] > br.bottom + 0.5)) {
      const y = lastFull ? lastFull[1] + 3 : br.top;
      Object.assign(curtB.style, { top: (y - bx.top) + 'px', height: Math.max(0, br.bottom - y) + 'px', display: 'block' });
    } else curtB.style.display = 'none';
    if (fr.some((f) => f[0] < br.top - 0.5 && f[1] > br.top + 0.5)) {
      const y = firstFull ? firstFull[0] - 3 : br.bottom;
      Object.assign(curtT.style, { top: (br.top - bx.top) + 'px', height: Math.max(0, y - br.top) + 'px', display: 'block' });
    } else curtT.style.display = 'none';
  };
  const st = { last: null, prev: null, cur: null };
  const HDR = window.__recHdr || null;   // { part, num: { idx: "1 / 3" } } for slides taken from another presentation
  const ambient = new Set();
  const snap = new Map();
  const tf = (o) => { const p = o.position, q = o.quaternion, s = o.scale; return [p.x, p.y, p.z, q.x, q.y, q.z, q.w, s.x, s.y, s.z, o.visible ? 1 : 0]; };
  const sameTf = (a, b) => { for (let i = 0; i < 11; i++) if (Math.abs(a[i] - b[i]) > 1e-4) return false; return true; };
  // objects whose transform differs from the last committed frame (ambient ones excluded)
  const sceneChanges = (collect) => {
    const out = collect ? [] : null;
    let n = 0;
    ctx.scene.traverse((o) => {
      if (ambient.has(o)) return;
      const a = snap.get(o), b = tf(o);
      if (!a || !sameTf(a, b)) { n++; if (out) out.push(o); }
    });
    return collect ? out : n;
  };
  const commitScene = () => { snap.clear(); ctx.scene.traverse((o) => { if (!ambient.has(o)) snap.set(o, tf(o)); }); };
  const demoIds = () => (ctx.shared.demoStops || []).filter((d) => { try { return !!(d.running && d.running()); } catch (_) { return false; } }).map((d) => d.id).join(',');
  const wcap = () => { const c = document.getElementById('tm-walk-cap'); return c ? (c.style.display + ':' + c.textContent) : ''; };
  const domSig = () => [box.querySelector('.ttl').textContent, box.querySelector('.sub').textContent, body.textContent.length, body.scrollTop, elPart.textContent, elNum.textContent,
    (box.querySelector('.caps .cap.now') || {}).textContent || '', box.querySelector('.bubw').className, wcap(), pg.textContent].join('|');
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const qang = (a, b) => { const d = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]); return 2 * Math.acos(Math.min(1, d)) * 180 / Math.PI; };
  const applyHdr = (idx) => {
    if (!HDR) return;
    if (elPart.textContent !== HDR.part) elPart.textContent = HDR.part;
    const n = HDR.num[idx];
    if (n && elNum.textContent !== n) elNum.textContent = n;
  };
  const snapNow = () => {
    const tg = ctl.target.toArray(), p = cam.position.toArray();
    return { p, q: cam.quaternion.toArray(), fov: cam.fov, vo: cam.view && cam.view.enabled ? cam.view.offsetX : 0, dom: domSig(), demo: demoIds(), d: Math.max(1, dist(p, tg)) };
  };
  const state = () => {
    const s = T.state();
    return { idx: s.idx, running: s.running, ended: s.ended, paused: s.paused, elapsed: s.elapsed, slideMs: s.slideMs, title: s.title };
  };
  const C = {
    st,
    state,
    // the ambient animations (the altar's fire and smoke, flames): objects that move while nothing happens
    learnAmbient(steps) {
      commitScene();
      for (let i = 0; i < steps; i++) V.step(40);
      for (const o of sceneChanges(true)) ambient.add(o);
      commitScene();
      return ambient.size;
    },
    addAmbientNow() { const ch = sceneChanges(true); for (const o of ch) ambient.add(o); commitScene(); return ch.length; },
    step(dt) {
      V.step(dt);
      let ans = 0;
      const cf = document.getElementById('tm-confirm');
      if (cf && cf.style.display === 'flex') { const y = cf.querySelector('.y'); if (y) { y.click(); ans = 1; } }   // the cloud: removed (the user's choice)
      const s = state();
      if (s.idx !== lastIdx) {
        lastIdx = s.idx;
        if (spacer) { spacer.remove(); spacer = null; }
        pageList = null;
        pg.textContent = '';
      }
      applyHdr(s.idx);
      curtains();
      const cur = snapNow();
      const L = st.last;
      let changed = false, fast = false, discrete = false, nScene = 0, camRest = false;
      if (!L) { changed = discrete = true; }
      else {
        const dp = dist(cur.p, L.p), ang = qang(cur.q, L.q);
        const camMove = dp > 0.002 + 0.0004 * cur.d || ang > 0.02 || Math.abs(cur.fov - L.fov) > 0.01;
        camRest = !camMove;
        discrete = cur.dom !== L.dom || cur.vo !== L.vo;
        nScene = sceneChanges(false);
        changed = camMove || discrete || nScene > 0 || !!cur.demo;   // a running demonstration is always filmed (at least 12.5 frames a second)
        const P = st.prev || L;
        fast = qang(cur.q, P.q) > 0.12 || dist(cur.p, P.p) > Math.max(0.06, 0.002 * cur.d) || Math.abs(cur.fov - P.fov) > 0.05;
      }
      st.prev = cur;
      st.cur = cur;
      return Object.assign(s, { t: V.t, changed, fast, discrete, nScene, camRest, demo: cur.demo, ans, mode: E && E.cam ? E.cam.mode : '?', pages: pageList ? pageList.length : 0 });
    },
    // the frame just captured becomes the reference
    commit() { curtains(); st.last = snapNow(); st.prev = st.last; commitScene(); },
    render() { allow = true; try { realRender(ctx.scene, ctx.camera); } finally { allow = false; } },
    pause(p) { T.pause(!!p); },
    // the text pages of the current slide: line-aligned scroll positions and the words on each
    pages() {
      if (spacer) spacer.remove();
      spacer = document.createElement('div');
      spacer.className = 'rec-spacer';
      body.appendChild(spacer);
      const pt = 0, Hvis = body.clientHeight;   // the body has margins, not paddings: what is scrolled is exactly what is seen
      spacer.style.height = Hvis + 'px';
      body.scrollTop = 0;
      const br = body.getBoundingClientRect();
      const frags = [];   // [top, bottom, words] per line fragment of a text node
      const tw = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
      const rg = document.createRange();
      for (let n = tw.nextNode(); n; n = tw.nextNode()) {
        const txt = n.nodeValue;
        if (!txt.trim()) continue;
        const el = n.parentElement;
        if (el && getComputedStyle(el).display === 'none') continue;
        rg.selectNodeContents(n);
        const rs = [...rg.getClientRects()].filter((r) => r.width > 0.5 && r.height > 0.5);
        if (!rs.length) continue;
        const w = (txt.match(/[^\s]+/g) || []).length / rs.length;
        for (const r of rs) frags.push([r.top - br.top, r.bottom - br.top, w]);
      }
      for (const a of body.querySelectorAll('.src a, .caps .cap')) { const r = a.getBoundingClientRect(); if (r.height > 0) frags.push([r.top - br.top, r.bottom - br.top, 0]); }
      frags.sort((a, b) => a[0] - b[0]);
      const bands = [];
      for (const f of frags) { const m = bands[bands.length - 1]; if (m && f[0] < m[1] - 3) m[1] = Math.max(m[1], f[1]); else bands.push([f[0], f[1]]); }
      const pages = [{ s: 0, y0: 0 }];
      let y0 = 0;
      for (let guard = 0; guard < 40; guard++) {
        const lim = y0 + Hvis;
        const nb = bands.find((m) => m[1] > lim + 0.5);
        if (!nb) break;
        y0 = Math.max(nb[0] - 7, y0 + 20);   // a line that does not fit whole opens the next page (7 px for the marks above the letters)
        pages.push({ s: Math.round(y0), y0 });
      }
      const words = pages.map(() => 0);
      for (const f of frags) { const yc = (f[0] + f[1]) / 2; let k = 0; for (let i = 0; i < pages.length; i++) if (pages[i].y0 <= yc + 1) k = i; words[k] += f[2]; }
      pageList = pages.map((p, i) => ({ s: p.s, words: Math.round(words[i]) }));
      C.showPage(0);
      return pageList;
    },
    showPage(k) {
      if (!pageList || !pageList[k]) return;
      body.scrollTop = pageList[k].s;
      pg.textContent = pageList.length > 1 ? 'עמוד ' + (k + 1) + ' מתוך ' + pageList.length : '';
      curtains();
    },
    // the slow move after the camera arrives: outside - round the target; inside - the eye stays and the gaze turns
    drift(dir, secs) {
      const P = cam.position.clone(), Tg = ctl.target.clone();
      const up = P.clone().set(0, 1, 0);
      const mode = E && E.cam ? E.cam.mode : 'orbit';
      let p1, t1;
      if (mode === 'look') {
        const v = Tg.clone().sub(P).applyAxisAngle(up, dir * 9 * Math.PI / 180);
        p1 = P.clone(); t1 = P.clone().add(v);
      } else {
        const v = P.clone().sub(Tg).applyAxisAngle(up, dir * 12 * Math.PI / 180).multiplyScalar(0.93);
        p1 = Tg.clone().add(v); t1 = Tg.clone();
      }
      ctx.flyTo(p1.toArray(), t1.toArray(), secs * 1000);
      return mode;
    },
    pose() { return { p: cam.position.toArray(), t: ctl.target.toArray() }; },
    setPose(o) { cam.position.fromArray(o.p); ctl.target.fromArray(o.t); ctl.update(); },
    slideInfo(i) {
      const s = T.slides[i];
      if (!s) return null;
      const g = Array.isArray(s.go) ? s.go : (s.d && s.d.go) || [];
      const g0 = g[0] || {};
      return { title: s.title, anim: s.anim || null, act: !!(g0.act || s.act), demoF: g0.f === 'mechonaDemo', then: !!s.then };
    }
  };
  window.__cap = C;
})();
