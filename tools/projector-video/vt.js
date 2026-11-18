// Virtual time for frame-exact recording. Installed before the page's scripts; inactive until __vt.start().
// While on: performance.now / Date.now return the virtual clock; requestAnimationFrame callbacks and timers run only from __vt.step(dt).
(() => {
  const W = window;
  const rRAF = W.requestAnimationFrame.bind(W), rCAF = W.cancelAnimationFrame.bind(W);
  const rST = W.setTimeout.bind(W), rCT = W.clearTimeout.bind(W), rSI = W.setInterval.bind(W), rCI = W.clearInterval.bind(W);
  const rPN = performance.now.bind(performance), rDN = Date.now.bind(Date);
  const V = { on: false, t: 0, dbase: 0, raf: new Map(), rid: 0, timers: new Map(), tid: 0 };
  W.__vt = V;
  performance.now = function () { return V.on ? V.t : rPN(); };
  Date.now = function () { return V.on ? Math.floor(V.dbase + V.t) : rDN(); };
  W.requestAnimationFrame = function (cb) { if (!V.on) return rRAF(cb); const id = 'v' + (++V.rid); V.raf.set(id, cb); return id; };
  W.cancelAnimationFrame = function (id) { if (typeof id === 'string' && id[0] === 'v') V.raf.delete(id); else rCAF(id); };
  W.setTimeout = function (fn, ms, ...a) {
    if (!V.on) return rST(fn, ms, ...a);
    const id = 1e9 + (++V.tid);
    V.timers.set(id, { due: V.t + Math.max(0, +ms || 0), fn, a, iv: 0, seq: V.tid });
    return id;
  };
  W.setInterval = function (fn, ms, ...a) {
    if (!V.on) return rSI(fn, ms, ...a);
    const iv = Math.max(4, +ms || 0), id = 1e9 + (++V.tid);
    V.timers.set(id, { due: V.t + iv, fn, a, iv, seq: V.tid });
    return id;
  };
  W.clearTimeout = function (id) { if (V.timers.has(id)) V.timers.delete(id); else rCT(id); };
  W.clearInterval = function (id) { if (V.timers.has(id)) V.timers.delete(id); else rCI(id); };
  V.start = () => { if (V.on) return; V.t = rPN(); V.dbase = rDN() - V.t; V.on = true; };
  V.sync = () => { V.t = Math.max(V.t, rPN()); };
  V.runTimers = (until) => {
    for (let guard = 0; guard < 20000; guard++) {
      let best = null;
      for (const e of V.timers) {
        const t = e[1];
        if (t.due <= until && (!best || t.due < best[1].due || (t.due === best[1].due && t.seq < best[1].seq))) best = e;
      }
      if (!best) break;
      const [id, t] = best;
      if (t.due > V.t) V.t = t.due;
      if (t.iv) t.due += t.iv; else V.timers.delete(id);
      try { if (typeof t.fn === 'function') t.fn(...t.a); } catch (e) { console.error('[vt timer] ' + (e && e.message)); }
    }
  };
  V.step = (dt) => {
    const until = V.t + dt;
    V.runTimers(until);
    V.t = until;
    const cbs = [...V.raf.values()];
    V.raf.clear();
    for (const cb of cbs) { try { cb(V.t); } catch (e) { console.error('[vt raf] ' + (e && e.message)); } }
    V.runTimers(V.t);
  };
})();
