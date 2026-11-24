  //@@slot top-note
  var tour_PHONE_MQ = "(max-width:639px)";
  var tour_CSS = `
/* 1.1.0: #tm-tour-btn is a bar button (index.html header.topbar .tm-topbtn, via ctx.ui.topbarAdd); the menu hangs under the bar's
   button row (#tm-topbtns is position:relative), at its start edge (right, RTL), where the presentation button is */
#tm-tour-menu{position:absolute;top:calc(100% + 6px);right:0;left:auto;z-index:33;width:min(282px,calc(100vw - 20px));display:none;flex-direction:column;gap:5px;
  padding:7px;box-sizing:border-box;direction:rtl;text-align:right;background:rgba(12,16,24,.95);border:1px solid rgba(201,168,76,.55);
  border-radius:11px;backdrop-filter:blur(8px);box-shadow:0 8px 26px rgba(0,0,0,.5);font:13px 'Segoe UI',Arial,sans-serif;color:#e8dcae}
#tm-tour-menu .mh{font-size:11px;color:#b9ac82;padding:0 3px 1px}
#tm-tour-menu button{display:block;width:100%;text-align:right;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.3);
  border-radius:8px;padding:7px 9px;color:#e8dcae;cursor:pointer;font:inherit;direction:rtl}
#tm-tour-menu button:hover,#tm-tour-menu button:focus-visible{background:rgba(201,168,76,.26);outline:none}
#tm-tour-menu button b{display:block;color:#f3dc9a;font-size:13.5px;font-weight:700}
#tm-tour-menu button span{display:block;font-size:11.5px;color:#b9ac82;margin-top:2px;line-height:1.45}
#tm-tour-box{position:fixed;left:12px;top:calc(var(--topbar-h, 56px) + 5px);bottom:76px;width:min(300px,34vw);z-index:29;display:none;flex-direction:column;
  box-sizing:border-box;direction:rtl;text-align:right;background:rgba(12,16,24,.9);border:1px solid rgba(201,168,76,.55);border-radius:12px;
  overflow:hidden;backdrop-filter:blur(8px);color:#e8dcae;font:13px 'Segoe UI',Arial,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.45)}
#tm-tour-box .hd{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px 2px;font-size:11px;color:#b9ac82;flex:none}
#tm-tour-box .hd .part{color:#c9a84c;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
#tm-tour-box .hd .num{direction:ltr;unicode-bidi:isolate;white-space:nowrap;font-variant-numeric:tabular-nums}
#tm-tour-box .hd .fold{flex:none;margin-right:auto;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.45);color:#f3dc9a;border-radius:50%;width:22px;height:22px;padding:0;font:11px 'Segoe UI',Arial,sans-serif;cursor:pointer;line-height:20px}
#tm-tour-box.min{bottom:auto}
#tm-tour-box.min .sub,#tm-tour-box.min .wait,#tm-tour-box.min .o,#tm-tour-box.min .opts,#tm-tour-box.min .body,#tm-tour-box.min .bubw{display:none !important}
#tm-tour-box .ttl{padding:3px 12px 0;font-size:16px;font-weight:700;color:#f3dc9a;line-height:1.35;flex:none}
#tm-tour-box .sub{padding:1px 12px 0;font-size:11.5px;color:#c9b98a;flex:none}
//@@slot tour_CSS
#tm-tour-box .wait{display:none;margin:6px 12px 0;padding:5px 8px;border-radius:7px;background:rgba(255,207,110,.12);
  border:1px solid rgba(255,207,110,.35);color:#ffcf6e;font-size:12px;line-height:1.45;flex:none}
#tm-tour-box .body{position:relative;flex:1 1 auto;min-height:0;overflow-y:auto;padding:8px 12px 6px;overscroll-behavior:contain}
#tm-tour-box .vs{font-family:var(--font-main,'Frank Ruhl Libre','David',serif),'David','Times New Roman',serif;font-size:17.5px;line-height:1.9;
  color:#f6ead0;margin-bottom:8px;padding-bottom:7px;border-bottom:1px solid rgba(201,168,76,.22)}
#tm-tour-box .vs:empty{display:none}
#tm-tour-box .vs .v{margin:0 0 3px}
#tm-tour-box .vs .vn{color:#c9a84c;font:600 12px 'Segoe UI',Arial,sans-serif;margin-left:5px;vertical-align:2px}
#tm-tour-box .vs .kt{color:#9a8f6c;font-size:.8em}
//@@slot tour_CSS-2
#tm-tour-box .txt{line-height:1.65;direction:rtl;text-align:justify;text-justify:inter-word}
#tm-tour-box .src{margin-top:8px;font-size:11px;color:#b9ac82;line-height:1.5}
#tm-tour-box .src a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;
  background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-tour-box .src a:hover{background:rgba(201,168,76,.3)}
#tm-tour-box .o{flex:none;max-height:30%;overflow-y:auto;margin:6px 12px 0;padding-top:4px;border-top:1px solid rgba(201,168,76,.25);font-size:.6875rem;line-height:1.5;color:#b9ac82}
#tm-tour-box .o .g{display:block}
#tm-tour-box .o .k{margin-left:3px}
#tm-tour-box .o a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-tour-box .o a:hover{background:rgba(201,168,76,.3)}
#tm-tour-box .o a.on{background:rgba(201,168,76,.5);color:#14110a;border-color:rgba(255,236,170,.85);cursor:default}
#tm-tour-box .caps{margin-top:6px}
#tm-tour-box .caps:empty{display:none}
#tm-tour-box .caps .cap{margin:0 0 6px;padding:4px 8px;border-right:3px solid rgba(201,168,76,.3);border-radius:4px;line-height:1.6;color:#a89c78;
  font-family:var(--font-main,'Frank Ruhl Libre','David',serif),'David','Times New Roman',serif;font-size:14px}
#tm-tour-box .caps .cap.now{color:#f6ead0;border-right-color:#f3dc9a;background:rgba(201,168,76,.13)}
#tm-tour-box .bubw{display:none;position:relative;flex:none;flex-direction:column;min-height:0;max-height:34%;margin:7px 10px 13px}
#tm-tour-box .bubw.on{display:flex}
#tm-tour-box .bubw::before,#tm-tour-box .bubw::after{content:"";position:absolute;right:26px;width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent}
#tm-tour-box .bubw::before{bottom:-10px;border-top:10px solid #7fb4ee}
#tm-tour-box .bubw::after{bottom:-8px;border-top:9px solid #14304f}
#tm-tour-box .bub{flex:0 1 auto;min-height:0;overflow-y:auto;box-sizing:border-box;padding:7px 10px 8px;border-radius:14px;background:#14304f;
  border:1px solid #7fb4ee;color:#e4f0ff;font-size:12px;line-height:1.55;box-shadow:0 2px 10px rgba(0,0,0,.35)}
#tm-tour-box .bub .m{display:inline-block;margin-left:6px;padding:0 8px;border-radius:9px;background:#7fb4ee;color:#0b1a2c;font-weight:700;font-size:11.5px;line-height:1.55}
#tm-tour-box .bub .bt{margin-top:5px;font-weight:600}
#tm-tour-box .bub .bq{color:#cfe2fa;font-family:var(--font-main,'Frank Ruhl Libre','David',serif),'David','Times New Roman',serif;font-size:13px}
#tm-tour-box .bub .br{margin-top:4px;font-size:11px}
#tm-tour-box .bub .br a{display:inline-block;color:#e4f0ff;margin:2px 0 2px 5px;padding:1px 7px;border:1px solid rgba(127,180,238,.6);border-radius:6px;
  background:rgba(127,180,238,.16);text-decoration:none;cursor:pointer}
#tm-tour-box .bub .br a:hover{background:rgba(127,180,238,.34)}
#tm-tour-box .prog{height:3px;background:rgba(201,168,76,.18);flex:none}
#tm-tour-box .prog .bar{height:100%;width:0;background:#c9a84c}
#tm-tour-box .ctl{display:flex;gap:5px;padding:7px 10px 4px;flex:none}
#tm-tour-box .ctl button{flex:1 1 0;min-width:0;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.4);color:#e8dcae;
  border-radius:7px;padding:5px 2px;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer;white-space:nowrap;overflow:hidden}
#tm-tour-box .ctl button:hover{background:rgba(201,168,76,.3)}
#tm-tour-box .ctl button:disabled{opacity:.4;cursor:default}
#tm-tour-box .ctl2{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:2px 12px 8px;font-size:11px;color:#b9ac82;flex:none}
#tm-tour-box .spd{display:flex;align-items:center;white-space:nowrap}
#tm-tour-box .spd select{background:#141a26;color:#e8dcae;border:1px solid rgba(201,168,76,.4);border-radius:6px;
  font:11.5px 'Segoe UI',Arial,sans-serif;padding:1px 3px;margin-right:4px}
#tm-tour-box .ctl .spd{flex:none;font-size:11px;color:#b9ac82}
#tm-tour-box .ctl .spd .k{display:none}
#tm-tour-box .ctl .spd select{margin-right:0;padding:4px 2px;font-size:12px}
body.tm-measuring #tm-tour-box{bottom:96px}
@media(hover:none){#tm-tour-box .ctl2 .esc{display:none}}
@media(min-width:640px) and (max-width:881px){#tm-tour-box .ctl{gap:3px;padding-left:6px;padding-right:6px}#tm-tour-box .ctl button{padding:5px 1px;font-size:11px}}
@media${tour_PHONE_MQ}{
  #tm-tour-box{left:8px;right:8px;top:auto;bottom:66px;width:auto;max-height:min(40vh,calc(50vh - 70px))}
  body.tm-measuring #tm-tour-box{bottom:96px;max-height:min(40vh,calc(50vh - 100px))}
  #tm-tour-box .vs{font-size:16px;line-height:1.75}
  #tm-tour-box .ttl{font-size:14.5px}
  #tm-tour-box .hd{padding-top:6px}
  #tm-tour-box .wait{margin:4px 12px 0;padding:2px 8px;font-size:11.5px;line-height:1.35}
  #tm-tour-box .body{padding:6px 12px 4px}
  #tm-tour-box .ctl{padding:6px 8px}
  #tm-tour-box .ctl2{display:none}
  #tm-tour-box .bubw{max-height:none;margin:8px 0 14px}
  #tm-tour-box .caps .cap{font-size:13.5px}
}
`;
  //@@slot tour_VIEWS
  ];
  var tour_DWELL = 7000;        // the continuous mode: ms per slide (the brief: ~7 s; model choice)
  // 1.0.1-L (L.78-L.81): a slide with a timeline (the king's ascent, the witnesses' scene): seconds before it starts (the camera arrives: the
  // UI's fly is 1.6 s) and at rest after it, for reading the last caption (model choices)
  var tour_ANIM_LEAD = 2;
  var tour_ANIM_TAIL = 2.5;
  //@@slot tour_VIEW_GROUP
  ];
  //@@slot after-tour_KINGS-note
  function tour_heb(n) {
    if (n === 15) return "טו";
    if (n === 16) return "טז";
    const T = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"], O = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    return (T[Math.floor(n / 10)] || "") + (O[n % 10] || "");
  }
  // a source spec -> the UI's ref ({book, index} from ui_V / ui_P / ui_MI / ui_MN / ui_RB of 70-ui.js);
  // 1.0.1-L: ["L", book, line, sef?] = a line of the Otzaria library named directly (commentaries and pages the UI's tables do not hold)
  function tour_ref(sp) {
    try {
      if (sp[0] === "L") return { book: sp[1], index: sp[2] };
      if (sp[0] === "V") {
        if (typeof ui_V === "function") return ui_V(sp[1], sp[2], sp[3]);
        return null;
      }
      if (sp[0] === "P" && typeof ui_P === "function") return ui_P(sp[1], sp[2]);
      if (sp[0] === "MI") return typeof ui_MI === "function" ? ui_MI(sp[1], sp[2]) : null;
      if (sp[0] === "MN" && typeof ui_MN === "function") return ui_MN(sp[1], sp[2], sp[3]);
      if (sp[0] === "RB" && typeof ui_RB === "function") return ui_RB(sp[1], sp[2]);
    } catch (_) {
    }
    return null;
  }
  async function buildTour(ctx) {
    try {
      const U = ctx.ui;
      if (!U || !Array.isArray(U.views)) return;   // the UI did not load: no presentation
      if (!Array.isArray(ctx.animated)) ctx.animated = [];
      if (!ctx.shared) ctx.shared = {};
      const style = document.createElement("style");
      style.textContent = tour_CSS;
      document.head.appendChild(style);
      const CO = ctx.CO || {};
      const fnc = (f) => typeof f === "function";
      const call = (f, ...a) => {
        try {
          return fnc(f) ? f(...a) : undefined;
        } catch (_) {
          return undefined;
        }
      };
      const fin3 = (a) => Array.isArray(a) && a.length >= 3 && isFinite(a[0]) && isFinite(a[1]) && isFinite(a[2]);
      const now = () => performance.now();
      const inside = (node, el) => {
        for (let n = node; n && el; n = n.parentNode) if (n === el) return true;
        return false;
      };
      // ---- the UI's API (70-ui.js ctx.ui), each call guarded ----
      const confirmOpen = () => !!call(U.confirmOpen);
      const cloudOn = () => !!call(U.cloudOn);
      const resolveFp = (key) => {
        const f = call(U.resolveFp, key);
        return f && fin3(f.pos) && fin3(f.target) ? f : null;
      };
      const fly = (pos, target, dur) => {
        if (fnc(U.fly)) call(U.fly, pos, target, dur);
        else call(ctx.flyTo, pos, target, dur);
      };
      const setInfo = (key, custom) => call(U.setInfo, key, custom);
      // 1.0.1-L (L.34): the floating explanation card of the panel (ctx.ui.card)
      const closeXCard = () => {
        const c = U.card;
        if (!c || !fnc(c.close)) return;
        try {
          c.close();
        } catch (_) {
        }
      };
      const layerOn = (name) => !!(ctx.layers && ctx.layers[name] && ctx.layers[name].visible);
      const setLayer = (name, on) => {
        if (fnc(U.setLayer)) call(U.setLayer, name, !!on);
        else if (ctx.layers && ctx.layers[name]) ctx.layers[name].visible = !!on;
      };
      const cfEl = () => document.getElementById("tm-confirm");
      // a pending Holy-of-Holies confirmation is answered "ביטול" (its fly is dropped)
      const cancelConfirm = () => {
        if (!confirmOpen()) return;
        if (fnc(U.cancelConfirm)) return void call(U.cancelConfirm);
        const c = cfEl(), n = c && fnc(c.querySelector) ? c.querySelector(".n") : null;
        if (n && fnc(n.click)) n.click();
        else call(U.closeConfirm);
      };
      // the devir and its aliyah, as the UI's cloud test ("inKK": x -66..CO.xDevirE, |z| < 12, y 14..44)
      const KK_E = typeof CO.xDevirE === "number" ? CO.xDevirE : -44.5;
      const inDevir = (p) => fin3(p) && p[0] > -66 && p[0] < KK_E && p[2] > -12 && p[2] < 12 && p[1] > 14 && p[1] < 44;
      // ---- model features a slide switches on for itself (each undone when the slide is left); a missing one is skipped ----
      const onOff = (o) => (o && fnc(o.set) ? { on: () => !!o.on, set: (v) => o.set(!!v) } : null);
      const FEATURES = {
        yatziaSection: () => onOff(ctx.shared.yatziaSection),
        wallLayers: () => onOff(ctx.shared.wallLayers),
        altarLayers: () => onOff(ctx.shared.incenseAltar && ctx.shared.incenseAltar.layers),
        mechonaExplode: () => onOff(ctx.shared.mechona && ctx.shared.mechona.explode),
        mechonaDemo: () => {
          const d = ctx.shared.mechona && ctx.shared.mechona.demo;
          if (!d || !fnc(d.start) || !fnc(d.stop)) return null;
          // 1.0.1-K review (vessels-2 / tour-4): the slide's undo (off) parks the base AT ONCE - demo.reset(), "at once back in its place (for
          // the presentation)" (45-vessels.js) - also after the user's own "עצור" (then it drives home): stop() let it finish its round
          // at three times the speed, still driving for seconds into 7:34-37, which takes it apart and looks at its empty place
          const off = () => {
            if (fnc(d.reset)) {
              if (d.home !== true) d.reset();
            } else if (d.running) d.stop();
          };
          // 1.0.1-L (vessels-2 FOR-UI; a round is 48.6 s now, first the priests' washing, then the rinsing): the continuous mode's short slide
          // starts two seconds before the rinsing beside the marble tables (the purpose, L.40), the other modes from the start
          const on = () => {
            if (mode.key === "continuous" && fnc(d.seek) && Array.isArray(d.pourAt)) d.seek(d.pourAt[0] - 2);
            d.start();
          };
          return { on: () => !!d.running, set: (v) => (v ? on() : off()), off };
        },
        // 8:10-11: the cloud is put back over the devir and LEFT there (no undo): the UI itself returns it whenever the camera leaves the
        // devir, and switching it off again would reset that return (setCloud(false) clears its "seen near" state)
        cloud: () => (fnc(U.setCloud) && fnc(U.cloudOn) ? { on: cloudOn, set: (v) => (v ? U.setCloud(true) : undefined) } : null),
        // 1.0.1-L (L.72): R. Yose b. R. Yehuda's two tables in the ulam, the place "שולחנות האולם" (a switch of readings: "none" = hidden)
        ulamTables: () => {
          const o = ctx.shared.ulamTables;
          return o && fnc(o.set) ? { on: () => true, set: () => true } : null;   // 1.1.0: the tables are always shown (no "none")
        },
        // 1.2.2: the section along the length (70-ui.js setSection: the house's south wall off, the ceilings kept) with the aliyot opened
        houseSection: () => {
          const ao = ctx.shared.aliyotOpen;
          if (!fnc(U.setSection) || !fnc(U.sectionOn) || !ao || !fnc(ao.set)) return null;
          return {
            on: () => !!U.sectionOn(),
            set: (v) => {
              if (v) { if (fnc(U.setCutaway)) U.setCutaway(false); U.setSection(true); ao.set(true); }
              else { U.setSection(false); ao.set(false); }
            }
          };
        }
      };
      // 1.0.1-L (L.50): the feature a place of the panel switches on: its name in ctx.ui.places() (the ctx.shared key) -> the tour's FEATURES;
      // any other key of ctx.shared with set() and on (or current / keys) works too, and a missing one is skipped
      const FEAT_ALIAS = { incenseAltar: "altarLayers", "incenseAltar.layers": "altarLayers", "mechona.demo": "mechonaDemo", "mechona.explode": "mechonaExplode", section: "yatziaSection", demo: "mechonaDemo", explode: "mechonaExplode" };
      const featureOf = (name) => {
        const k = FEAT_ALIAS[name] || name;
        if (FEATURES[k]) return FEATURES[k]();
        const o = ctx.shared[k];
        if (!o || !fnc(o.set)) return null;
        if (Array.isArray(o.keys) && o.keys.length > 1) return { on: () => o.current !== o.keys[0], set: (v) => o.set(v ? o.keys[1] : o.keys[0]) };
        return onOff(o);
      };
      const hasFeature = (name) => !!featureOf(name);
      const featureOn = (rt, name) => {
        const F = featureOf(name);
        if (!F) return false;
        try {
          if (!F.on()) {
            F.set(true);
            rt.undo.push(() => {
              try {
                if (fnc(F.off)) F.off();   // the feature's own way back (the base's demo: parked at once)
                else if (F.on()) F.set(false);
              } catch (_) {
              }
            });
          }
          return true;
        } catch (_) {
          return false;
        }
      };
      // 1.0.1-K review (vessels-2 / tour-4): a slide that takes the base apart (7:34-37) starts from a parked base - a demo still running
      // (the user's own) is parked at once and started again when the slide is left (this undo is pushed before the explode's, so it runs
      // after it: the parts go down in 1.1 s while the base waits its first 1.2 s); a base driving home after "עצור" is parked at once
      const parkBase = (rt) => {
        const d = ctx.shared.mechona && ctx.shared.mechona.demo;
        if (!d || !fnc(d.reset) || d.home === true) return;
        const was = !!d.running;
        try {
          d.reset();
        } catch (_) {
          return;
        }
        if (was && fnc(d.start)) {
          rt.undo.push(() => {
            try {
              if (!d.running) d.start();
            } catch (_) {
            }
          });
        }
      };
      const layerNeed = (rt, name) => {
        if (!name || !ctx.layers || !ctx.layers[name] || layerOn(name)) return;
        setLayer(name, true);
        rt.undo.push(() => setLayer(name, false));
      };
      //@@slot buildTour.OWNED
      const OWN_FEAT = ["yatziaSection", "wallLayers", "altarLayers", "mechonaExplode", "kelim", "arkInside"];   // (1.0.1-L: kelim, arkInside: a press of their pills during the tour)
      const layerVis = () => Object.keys(ctx.layers || {}).filter((n) => !OWNED.has(n) && n.indexOf("throne") !== 0).map((n) => [n, layerOn(n)]);
      const featState = (k) => {
        try {
          const F = featureOf(k);
          return F ? !!F.on() : null;
        } catch (_) {
          return null;
        }
      };
      // 1.0.1-K review (tour-8): the panel's "סיבוב איטי" through the UI - ctx.ui.autoRotate {get(): its checkbox, set(on): the checkbox and
      // controls.autoRotate together}, so the box shows what really turns; without it (an older ui.js) controls.autoRotate directly
      const autoRot = () => (U.autoRotate && fnc(U.autoRotate.get) && fnc(U.autoRotate.set) ? U.autoRotate : null);
      // ---- the user's rule: the tour never opens a removal by itself. If a navigation call of the UI still opens one (an older ui.js:
      // the automatic cutaway / openings of the views and rows), it is undone at once - by the UI's own "automatic" switches, by the
      // on-model buttons that flipped, and as the last resort on the meshes of the hide-list ----
      const HIDE = () => [["cut", ctx.cutaway], ["yatzia", ctx.yatziaCut], ["ulam", ctx.ulamCut], ["boards", ctx.forestBoardsCut]];
      const anyHidden = (a) => Array.isArray(a) && a.some((m) => m && m.visible === false);
      const mbList = () => (Array.isArray(ctx.shared.modelButtons) ? ctx.shared.modelButtons : []);
      // 1.3.6 / 1.9.4 (the user, 11.11.2026: "למה הוא מציג במצגת בהתחלה את החתך פתוח לא קשור למקום"; "החתך נשאר פתוח לאורך כל המצגת"): the
      // presentation starts from the model's regular state. Every viewing tool the viewer left on - the on-model buttons (the house or
      // the galleries opened, a section of the galleries, roofs, a demonstration), the live section and the walk - goes off when it
      // starts, and what is not a demonstration comes back when it ends (restore), as the rows and the layers do. Not touched: the
      // cloud (the devir's slides ask about it themselves) and a button that only mutes (keepDemos).
      const toolsOff = () => {
        const back = [];
        // TOUR_STOPDEMOS_204: a running demonstration ends first and gives back what IT opened (the lotteries' night opens the
        // chambers' roofs), so that what it opened is not taken for the viewer's own and opened again when the presentation ends
        try { call(ctx.shared.stopDemos); } catch (_) {}
        for (const b of mbList().slice()) {
          try {
            if (!b || !fnc(b.get) || !fnc(b.set) || b.keepDemos || b.id === "ui-cloud" || !b.get()) continue;
            b.set(false);
            if (!b.get() && !/^עצור/.test(String(b.labelOn || "")) && !/demo/i.test(String(b.id || ""))) back.push(() => { if (!b.get()) b.set(true); });
          } catch (_) {
          }
        }
        try {
          const S = ctx.shared.section;
          if (S && S.on && fnc(S.set)) {
            const ax = S.axis, v = S.v;
            S.set(false, ax, v);
            back.push(() => { if (!S.on) S.set(true, ax, v); });
          }
          const w = ctx.shared.walkMode;
          if (w && w.on && fnc(w.set)) w.set(false);
          if (fnc(ctx.shared.navRepaint)) ctx.shared.navRepaint();
        } catch (_) {
        }
        return back;
      };
      const snapOpen = () => {
        const o = { mb: mbList().map((b) => !!(b && fnc(b.get) && call(b.get))) };
        for (const [k, a] of HIDE()) o[k] = anyHidden(a);
        return o;
      };
      const keepClosed = (before) => {
        let opened = false;
        for (const [k, a] of HIDE()) {
          if (before[k] || !anyHidden(a)) continue;
          opened = true;
          if (k === "cut") call(U.applyCut, false);
          else call(U.applyOpen, k, false);
        }
        if (!opened) return;
        mbList().forEach((b, i) => {
          if (b && fnc(b.get) && fnc(b.set) && !before.mb[i] && call(b.get)) call(b.set, false);
        });
        for (const [k, a] of HIDE()) if (!before[k] && anyHidden(a)) for (const m of a) if (m) m.visible = true;
      };
      // ---- targets: a fly point (ctx.ui.resolveFp: the module's, the Sea's placement, or the UI's fallback), a place of the panel by title
      // (its view, or its cam / tg), or an explicit camera ----
      const camOf = (c) => {
        if (!c) return null;
        if (c.fp) {
          const f = resolveFp(c.fp);
          return f ? { pos: f.pos.slice(0, 3), target: f.target.slice(0, 3), layer: null } : null;
        }
        if (c.place) {
          const it = call(U.place, c.place);
          if (!it) return null;
          const f = it.view ? resolveFp(it.view) : null;
          const pos = f ? f.pos : fnc(it.cam) ? call(it.cam) : it.cam;
          const target = f ? f.target : fnc(it.tg) ? call(it.tg) : it.tg;
          return fin3(pos) && fin3(target) ? { pos: pos.slice(0, 3), target: target.slice(0, 3), layer: it.layer || null } : null;
        }
        return fin3(c.pos) && fin3(c.target) ? { pos: c.pos.slice(0, 3), target: c.target.slice(0, 3), layer: null } : null;
      };
      const pick = (list) => {
        for (const c of Array.isArray(list) ? list : []) {
          if (c.f && !hasFeature(c.f)) continue;   // a candidate tied to a feature the model does not have
          const cam = camOf(c);
          if (cam) return { c, cam };
          // 1.3.5 / 1.9.3: a place shown by its action alone (a walk that leads the eye itself) has no camera of its own
          if (c.place && c.act && placeAct(placeByTitle(c.place))) return { c, cam: { pos: null, target: null, layer: null } };
        }
        return null;
      };
      // ---- exterior test of the continuous mode's orbit: the camera >= 35 from its target and nothing above it within 150 amot ----
      let roofList = null;
      const roofs = () => {
        if (roofList) return roofList;
        roofList = [];
        if (ctx.root && fnc(ctx.root.traverse)) {
          ctx.root.traverse((o) => {
            if (!o.isMesh || o.isInstancedMesh || !o.geometry) return;
            const pa = o.geometry.attributes && o.geometry.attributes.position;
            if (pa && pa.count > 30000) return;   // the terrain: always below
            roofList.push(o);
          });
        }
        return roofList;
      };
      const upRay = new Raycaster(), UP = new Vector3(0, 1, 0), P0 = new Vector3();
      const shown = (o) => {
        for (; o; o = o.parent) if (o.visible === false) return false;
        return true;
      };
      const outdoors = (pos, target) => {
        if (!fin3(pos) || !fin3(target)) return false;
        if (Math.hypot(pos[0] - target[0], pos[1] - target[1], pos[2] - target[2]) < 35) return false;
        try {
          P0.set(pos[0], pos[1], pos[2]);
          upRay.set(P0, UP);
          upRay.near = 0;
          upRay.far = 150;
          for (const h of upRay.intersectObjects(roofs(), false)) if (shown(h.object)) return false;
        } catch (_) {
          return false;
        }
        return true;
      };
      // ---- the opinions table (rows of ctx.ui.opinions: options [[key, label, info, refs]], onPick, mark, cur, fly) ----
      const rowsOf = () => (Array.isArray(U.opinions) ? U.opinions : []).filter((r) => r && !r.disabled && Array.isArray(r.options) && r.options.length > 1 && fnc(r.onPick));
      const setRow = (row, key) => {
        if (!row || row.cur === key) return;
        call(row.onPick, key);
        call(row.mark, key);
      };
      // 1.0.1-L (L.81): the throne's versions: the row "כסא שלמה — לפי איזה מדרש" of the opinions table (70-ui.js), when it is there
      const isThroneRow = (r) => r.options.some((o) => o[0] === "targumSheni");
      //@@slot isTamidRow
      const throneRow = () => rowsOf().find(isThroneRow) || null;
      // ---- the slides ----
      const vRange = (v) => tour_heb(v[0]) + ", " + tour_heb(v[1]) + (v[2] > v[1] ? "–" + tour_heb(v[2]) : "");
      // 1.0.1-L (L.50): the panel's places in its order: ctx.ui.places() (one entry per place button: title, group, view, fp, info, refs, layer,
      // feature, item), or by the older API (placeTitles + place: no groups, the camera from the item)
      const placesOf = () => {
        let list = null;
        if (fnc(U.places)) list = call(U.places);
        // 1.3.7 / 1.9.5 (TOUR_ENGINE_204): a place whose matter is shown by another place's slide (item.noTour) has no slide of its own
        if (Array.isArray(list) && list.length) return list.filter((p) => p && p.title && !(p.item && p.item.noTour));
        const titles = call(U.placeTitles);
        if (!Array.isArray(titles)) return [];
        const out = [];
        for (const t of titles) {
          const it = call(U.place, t);
          if (!it) continue;
          out.push({ title: t, group: it.group || "", view: it.view || null, fp: null, info: it.key ? (U.info && U.info[it.key]) || "" : it.info || "",
            refs: it.key ? (U.refs && U.refs[it.key]) || [] : it.refs || [], layer: it.layer || null, feature: it.feature || null, item: it });
        }
        return out;
      };
      const camKey = (p) => p.fp || p.view || (p.item && p.item.view) || null;
      const isExtras = (g) => !!g && g.indexOf("השלמות") >= 0;   // the group "השלמות": its entries repeat the views' cameras and are not their home
      // the feature a place's slide needs: the panel's word for it, and a fly point that is only right with its feature on (the section's camera
      // stands inside the closed chambers while the section is off: 50-heichal.js) - when the panel's list does not name them
      const NEED_FEAT = { yatziaSection: "yatziaSection", wallLayers: "wallLayers" };
      const placeFeat = (p) => {
        if (p.feature && hasFeature(p.feature)) return p.feature;
        const k = camKey(p);
        return k && NEED_FEAT[k] ? NEED_FEAT[k] : null;
      };
      // a place's slide: its fly point / view, else its own camera, else (only a text) its group's view; with its feature when it has one
      // (1.0.1-L: 57-kelim.js gives its links as specs, ["V", 10, 7, 40]: resolved here)
      const linkRefs = (rs) => (rs || []).map(([l, r]) => [l, Array.isArray(r) ? tour_ref(r) : r]).filter((x) => x[1]);
      // 1.3.5 / 1.9.3 (the user: "בדוק שכל הטכני באמת נמצא בשני הבתים כולל עדכון כרטיסים ומצגות"; the full scan of 10.11.2026): A PLACE'S
      // SLIDE DOES WHAT THE PLACE'S BUTTON DOES - its own feature (pf: a zone lit on the floor, the altar's frames - a feature object of
      // the panel, { isOn, on, off }, that is not one of the tour's named FEATURES) and its action (act: the roof opened to look down
      // into a chamber, the cells' section, a demonstration). What the action opens is held until the slide is left (the engine's
      // ctx.shared.holdAuto / closeAuto), a demonstration runs to its end before the next slide, and a place whose action is all it has
      // (a walk that leads the eye itself) is not flown to. Until now such slides only flew: a closed roof seen from above, or the
      // group's general view instead of the walk. A verse's slide shows a place so by a candidate { place, act: true }.
      const placeOwnFeat = (p) => {
        const F = p && p.item && p.item.feature;
        //@@slot placeOwnFeat
        if (p.feature && hasFeature(p.feature)) return null;                       // one of the tour's own features: switched on by its name
        return F;
      };
      const placeAct = (p) => (p && p.item && fnc(p.item.action) ? p.item.action : null);
      const placeOwnCam = (p) => !!(p && (p.fp || (p.item && (p.item.view || p.item.cam || p.item.tg))));
      const placeByTitle = (t) => placesOf().find((x) => x.title === t) || null;
      const demoRunning = () => {
        const L = ctx.shared.demoStops;
        if (!Array.isArray(L)) return false;
        for (const d of L) {
          try {
            if (d && fnc(d.running) && d.running()) return true;
          } catch (_) {
          }
        }
        return false;
      };
      // TOUR_DEMO_HOLD_206 b: does a demonstration hold this slide now? One that goes round and round (its entry has roundLeft(), the
      // seconds left of its present round) holds it for one round, counted from the moment the slide first saw it running
      const demoHolds = (rt) => {
        const L = ctx.shared.demoStops;
        if (!rt || rt.anim || !Array.isArray(L)) return false;   // (a slide with a timeline: the timeline is its length)
        for (const d of L) {
          try {
            if (!d || !fnc(d.running) || !d.running()) continue;
            if (fnc(d.roundLeft)) {
              const R = rt.rounds || (rt.rounds = {});
              if (R[d.id] === undefined) R[d.id] = elapsed + Math.max(0, +d.roundLeft() || 0) * 1000;
              if (elapsed >= R[d.id]) continue;
            }
            return true;
          } catch (_) {
          }
        }
        return false;
      };
      const runPlace = (rt, s, res) => {
        let pf = s.pf || null, act = s.act || null;
        if (s.actOnly) rt.actOnly = true;
        if (res && res.c && res.c.place && res.c.act) {
          const p = placeByTitle(res.c.place);
          if (p) {
            pf = pf || placeOwnFeat(p);
            act = act || placeAct(p);
            if (act && !placeOwnCam(p)) rt.actOnly = true;
          }
        }
        if (pf && !rt.feat) {
          try {
            if (!pf.isOn()) {
              pf.on();
              rt.undo.push(() => {
                try {
                  if (fnc(pf.off) && pf.isOn()) pf.off();
                } catch (_) {
                }
              });
            }
          } catch (_) {
          }
        }
        if (act) {
          const rows0 = rowsOf().map((r) => [r, r.cur]);
          rt.undo.push(() => {
            call(ctx.shared.stopDemos);
            for (const [r, k] of rows0) if (r.cur !== k) setRow(r, k);   // (a place may pick a reading: the small ramps' two places)
          });
          call(act);
          rt.act = true;
        }
      };
      // 1.3.7 / 1.9.5 (TOUR_ENGINE_204; the user, 11.11.2026: "אם כרטיס אחד... מציג כמה דברים המצגת צריכה להציג את כולם באותו הכרטיס
      // (דהיינו באותם ה7 שניות להסתובב ולהציג הכל"): a place that speaks of several things names their further cameras - item.tourThen,
      // a list of { cam, tg } | { fp } | { place } - and its slide flies to each in its turn, the slide's time shared between them
      // TOUR_ENGINE_204C (the helper's scan, 11.11.2026): the list may be a function; an entry may be { pos, target } (the
      // gatekeepers' place wrote it so and its cameras never ran); `extra`: further entries the engine adds (mergedCams)
      const placeThen = (p, extra) => {
        let own = p && p.item ? p.item.tourThen : null;
        if (fnc(own)) own = call(own);
        // TOUR_VIEWS_205: the table's further views of this place - the things its card speaks of, each looked at in a picture before it was written
        const tv = p && tour_VIEWS[p.title];   // (the table's views come after the place's own and the merged ones)
        const L = (Array.isArray(own) ? own : []).concat(extra || [], Array.isArray(tv) ? tv.map((v) => ({ cam: v[0], tg: v[1] })) : [])
          .map((t) => (t && !t.fp && !t.place && !(t.cam && t.tg) && t.pos && t.target ? Object.assign({}, t, { cam: t.pos, tg: t.target }) : t))
          .filter((t) => t && (t.fp || t.place || (t.cam && t.tg)));
        if (!L.length) return null;
        const share = 1 / (L.length + 1);
        return L.map((t, i) => ({ go: [t.fp ? { fp: t.fp } : t.place ? { place: t.place } : { pos: t.cam, target: t.tg }], at: (i + 1) * share, dur: t.dur || 1500 }));
      };
      // TOUR_VIEWS_205: a reading's own further views (row.tourThen[key], a list of { cam, tg }): the slide of a dispute moves among
      // the places it speaks of, as a place's slide does
      const optThen = (row, key) => {
        const L = ((row && row.tourThen && row.tourThen[key]) || []).filter((t) => t && t.cam && t.tg);
        if (!L.length) return null;
        const share = 1 / (L.length + 1);
        return L.map((t, i) => ({ go: [{ pos: t.cam, target: t.tg }], at: (i + 1) * share, dur: t.dur || 1500 }));
      };
      const placeSlide = (p, groupCam) => {
        const f = placeFeat(p), k = camKey(p), go = f === "kelim" ? tour_KELIM_GO.slice() : [];   // 1.0.1-L (L.88): the panel's own camera there is for the card beside its panel
        if (k) go.push(f ? { fp: k, f } : { fp: k });
        go.push(f ? { place: p.title, f } : { place: p.title });
        if (groupCam) go.push({ fp: groupCam });
        return { kind: "place", part: 0, group: p.group || "", title: p.title, text: tour_SHORT[p.title] || p.info || "", refs: linkRefs(p.refs), go, lay: p.layer || null, out: tour_OUT,
          //@@slot placeSlide
          then: placeThen(p),   // 1.3.7 / 1.9.5
          bubble: p.title === "כסא שלמה" || p.title === "עליית המלך לכסא" || k === "throneSteps" };
      };
      const viewSlide = (v, group) => ({ kind: "view", part: 0, group: group || "", key: v.key, title: v.label, text: (U.info && U.info[v.key]) || "", refs: (U.refs && U.refs[v.key]) || [],
        go: [{ fp: v.key }], lay: v.layer || null, out: tour_OUT });
      // the base's demonstration and its parts: L.51 took their places out of the panel (the pills on the base do them), and the presentation
      // still shows them, after the close view of the base: the pill's own words as the slide's title, its explanation as the text
      const baseSlides = (group) => {
        const out = [];
        for (const [id, feat, go, lay, what] of [
          ["mechonaDemo", "mechonaDemo", [{ pos: [70, 88, -8], target: [34, 8, -8], f: "mechonaDemo" }, { fp: "mechonaDemo", f: "mechonaDemo" }, { fp: "mechonaClose", f: "mechonaDemo" }, { fp: "mechonot" }], null, "המכונה בפעולה"],
          ["mechonaExplode", "mechonaExplode", [{ fp: "mechonaParts", f: "mechonaExplode", lay: "mechonaParts" }, { fp: "mechonaClose", f: "mechonaExplode", lay: "mechonaParts" }, { fp: "mechonot" }], null, "המכונה לחלקיה"]
        ]) {
          const b = mbList().find((x) => x && x.id === id);
          if (!b || !hasFeature(feat)) continue;
          // (the pill's title ends by telling what a further click does; in a slide nothing is clicked, and leaving the slide reassembles the base)
          out.push({ kind: "place", part: 0, group: group || "", title: what + " — ״" + b.label + "״", text: (b.title || "").replace(/\s*לחיצה נוספת[^.]*\.\s*$/, ""), refs: [["מלכים א ז, כז", tour_ref(["V", 10, 7, 27])], ["ז, לג", tour_ref(["V", 10, 7, 33])], ["דברי הימים ב ד, ו", tour_ref(["V", 39, 4, 6])]].filter((x) => x[1]),
            go, lay, out: tour_OUT });
        }
        return out;
      };
      // 1.0.1-L (L.78-L.81): one slide per version of the throne, then each midrash's witnesses' scene; "pesukim" (no ascent) a plain slide with the verses
      const throneSlides = (group) => {
        const tv = ctx.shared.throneVersion, th = ctx.shared.throne;
        if (!tv || !Array.isArray(tv.keys) || !fnc(tv.set)) return [];
        const out = [], names = tv.names || {}, T = tour_THRONE;
        for (const key of tv.keys) {
          const name = key === "beitHamidrash" ? "בית המדרש ב" : names[key] || key, cap = th && th.script && th.script[key], cw = th && th.witnessScript && th.witnessScript[key];   // 1.0.1-L: the user: its name on screen, whatever the module's list says
          const asc = !!(th && th.ascent && fnc(th.ascent.start) && Array.isArray(cap) && cap.length);
          const common = { kind: "throne", part: 0, group: group || "", ver: key, sub: "מלכים א י, יח–כ", lay: "palace", out: tour_OUT, bubble: true, refs: (T.refs[key] || T.refs.pesukim).map(([l, sp]) => [l, tour_ref(sp)]).filter((x) => x[1]) };
          if (key === "pesukim" || !asc) {
            const verses = [], kv = [18, 19, 20];
            let letters = 0;
            if (key === "pesukim") for (const v of kv) { const t = tour_VERSES["10:" + v] || ""; verses.push([v, t]); letters += t.replace(/[^א-ת]/g, "").length; }
            out.push(Object.assign({}, common, { title: "כסא שלמה — לפי " + name, text: key === "pesukim" ? T.pesukim : T.lead[key] || "", go: [{ fp: "throne" }, { fp: "throneSteps" }, { fp: "palace" }], then: [{ go: [{ fp: "throneSteps" }], at: 0.5, dur: 3000 }], verses, letters, anim: null }));
            continue;
          }
          // 1.0.1-L (A31, "תאחד"): one slide per version: the ascent, and on the same slide the witnesses with their captions (beginAnim, animStep)
          const wit = !!(th.witnesses && fnc(th.witnesses.start) && Array.isArray(cw) && cw.length);
          out.push(Object.assign({}, common, { title: "כסא שלמה — לפי " + name, text: T.lead[key] || "", go: [{ fp: "throneSteps" }, { fp: "throne" }, { fp: "palace" }], anim: "ascent", animW: wit, goW: [{ fp: "throne" }, { fp: "throneSteps" }, { fp: "palace" }] }));
        }
        return out;
      };
      // L.50: the whole panel. The opening view; then group by group its places in their order, each grid view of the group right before the first
      // place that flies to it (a place that only repeats the view's text IS that slide); a view no place flies to, and an overview, opens its
      // group; the group "השלמות" is the panel's last and holds no view. After the throne's own places, its versions; at the VERY END the readings
      const topicSlides = () => {
        const out = [];
        const views = (Array.isArray(U.views) ? U.views : []).filter((v) => v && v.key && v.key !== "aliyot" && resolveFp(v.key));   // "העליות" is the row "גובה הבית" of the opinions table: shown with the readings
        const byKey = {};
        for (const v of views) byKey[v.key] = v;
        // 1.3.7 / 1.9.5 (TOUR_ENGINE_204B; the user, 11.11.2026: "יש כרטיסים שלא מראים כלום - להסיר אותם או לאחד", "אם כרטיס אחד...
        // מציג כמה דברים המצגת צריכה להציג את כולם באותו הכרטיס"): ONE SLIDE PER BUTTON OF THE PANEL. Until now a place that the
        // panel had merged into another button (70-ui.js UI_MERGE: noButton, mergeInto - the whole group "השלמות") still had a slide
        // of its own, before the kept button's own camera, and a view of the grid whose button a place had taken (UI_VIEW_HOME) had
        // its slide right before that place's - the same picture two and three times. Now the kept button's slide stands for them,
        // with the card the button shows (its text, then each merged one's under its title: mergedCard), and a merged matter that
        // has a camera of its own is one of the slide's further cameras (item.tourThen on the kept place, 70-ui.js)
        const allPlaces = placesOf();
        const keptOf = (p) => {
          const k = p && p.item && p.item.noButton ? p.item.mergeInto : null;
          return k ? allPlaces.find((x) => x.item === k) || null : null;
        };
        const places = allPlaces.filter((p) => !keptOf(p));
        const groups = [];
        for (const p of places) if (groups.indexOf(p.group || "") < 0) groups.push(p.group || "");
        const viewKeyOf = (k) => (k && !byKey[k] && tour_VIEW_ALIAS[k] ? tour_VIEW_ALIAS[k] : k);
        // a view whose button left the grid (a place repeats it): the place's slide is the view's slide
        const gridless = (key) => {
          const b = fnc(U.viewButton) ? call(U.viewButton, key) : null;
          return !!b && !b.parentNode;
        };
        const coverOf = {};
        for (const p of places) {
          if (isExtras(p.group)) continue;
          const k = camKey(p);
          if (k && byKey[k] && k !== "__general" && gridless(k) && !(k in coverOf)) coverOf[k] = p;
          for (const d of p.item && Array.isArray(p.item.more) ? p.item.more : []) {
            if (d && !d.t && d.key && byKey[d.key] && gridless(d.key) && !(d.key in coverOf)) coverOf[d.key] = p;
          }
        }
        const mergedCard = (p) => {
          const own = tour_SHORT[p.title] || p.info || "";
          const parts = [own], refs = linkRefs(p.refs).slice(), seen = new Set(refs.map((r) => r[0]));
          for (const d of p.item && Array.isArray(p.item.more) ? p.item.more : []) {
            if (!d) continue;
            const tx = (d.t && tour_SHORT[d.t]) || (d.key ? (U.info && U.info[d.key]) || "" : d.info || "");
            // TOUR_ENGINE_204C: only the lines the card already has are left out (a merged card that opened with the kept card's
            // own verse was dropped whole - its first 40 letters were the same)
            if (tx) {
              const have = parts.join("\n") + "\n" + String(p.info || ""), fresh = String(tx).split("\n").filter((ln) => ln.trim() && have.indexOf(ln.trim()) < 0);
              if (fresh.length) parts.push((d.t ? d.t + ": " : "") + fresh.join("\n"));
            }
            for (const r of linkRefs(d.key ? (U.refs && U.refs[d.key]) || [] : d.refs || [])) {
              if (!seen.has(r[0])) {
                seen.add(r[0]);
                refs.push(r);
              }
            }
          }
          return { text: parts.filter(Boolean).join("\n\n"), refs };
        };
        // TOUR_ENGINE_204C: a merged matter that has a camera of its own is one of the slide's further cameras - up to four -
        // when the kept place names none itself (item.tourThen)
        const mergedCams = (p) => {
          const out = [], own = camKey(p);
          for (const d of p.item && Array.isArray(p.item.more) ? p.item.more : []) {
            if (!d || out.length >= 4) continue;
            if (d.t) {
              const q = allPlaces.find((x) => x.item === d || x.title === d.t);
              if (q && placeOwnCam(q) && camKey(q) !== own) out.push({ place: q.title });
            } else if (d.key && d.key !== own && resolveFp(d.key)) out.push({ fp: d.key });
          }
          return out;
        };
        const buttonSlide = (p, groupCam) => {
          const s = placeSlide(p, groupCam);
          if (p.item && Array.isArray(p.item.more) && p.item.more.length) {
            const mc = mergedCard(p);
            s.text = mc.text;
            s.refs = mc.refs;
            if (!s.then) s.then = placeThen(p, mergedCams(p));
          }
          return s;
        };
        const home = {};
        for (const p of places) {
          const k = viewKeyOf(camKey(p));
          if (k && byKey[k] && !isExtras(p.group) && !(k in home)) home[k] = p.group || "";
        }
        const opens = {};
        let prev = groups.filter((g) => !isExtras(g))[0];
        for (const v of views) {
          if (v.key === "__general") continue;
          if (!(v.key in home)) {
            const hint = tour_VIEW_GROUP[v.key], g = hint ? groups.find((x) => x.indexOf(hint) >= 0) : undefined;
            home[v.key] = g !== undefined ? g : prev;
            opens[v.key] = true;
          }
          if (tour_VIEW_OPENS[v.key]) opens[v.key] = true;
          prev = home[v.key];
        }
        const done = {};
        for (const k of Object.keys(coverOf)) done[k] = true;   // TOUR_ENGINE_204B: the covering place's slide stands for the view
        const viewSlideOf = {};   // 1.3.5 / 1.9.3: a place folded into its view's slide gives it its feature and its action
        const emitView = (v, g) => {
          if (done[v.key]) return;
          done[v.key] = true;
          const vs = viewSlide(v, g);
          viewSlideOf[v.key] = vs;
          out.push(vs);
        };
        if (byKey.__general) emitView(byKey.__general, "");
        // (an older ui.js gives no groups: the grid first, in its order, then the places)
        if (groups.length <= 1) for (const v of views) emitView(v, "");
        let throneAt = -1;
        for (const g of groups) {
          const gv = views.filter((v) => home[v.key] === g && v.key !== "__general");
          const groupCam = gv.length ? gv[0].key : null;
          for (const v of gv) if (opens[v.key]) emitView(v, g);
          for (const p of places) {
            if ((p.group || "") !== g) continue;
            const k = camKey(p), vk = viewKeyOf(k), v = vk && !isExtras(g) && home[vk] === g ? byKey[vk] : null;
            let fold = false;
            if (v) {
              for (const w of gv) {
                emitView(w, g);
                if (w === v) break;
              }
              fold = vk === k && coverOf[vk] !== p && !!viewSlideOf[vk] && ((p.item && p.item.key === k) || !p.info || p.info === (U.info && U.info[k]));
            }
            if (!fold) {
              const bs = buttonSlide(p, groupCam);
              out.push(bs);
              for (const ck of Object.keys(coverOf)) if (coverOf[ck] === p && !viewSlideOf[ck]) viewSlideOf[ck] = bs;
            }
            else if (v && viewSlideOf[v.key]) {
              const vs = viewSlideOf[v.key];
              if (!vs.act) vs.act = placeAct(p);
              if (!vs.pf) vs.pf = placeOwnFeat(p);
            }
            if (k === "mechonaClose" && !isExtras(g) && !done.__base) {
              done.__base = true;
              for (const s of baseSlides(g)) out.push(s);
            }
            if (k === "throne" || k === "throneSteps") { if (!isExtras(g)) throneAt = out.length; }
          }
          for (const v of gv) emitView(v, g);
        }
        for (const v of views) emitView(v, "");   // (no places, or a view of no group: in the grid's order)
        // the throne's versions after its own places (else after the palace's overview, else at the end of the places)
        if (throneAt < 0) {
          for (let i = out.length - 1; i >= 0; i--) if (out[i].key === "palace") { throneAt = i + 1; break; }
        }
        const ts = throneSlides(throneAt >= 0 ? out[throneAt - 1].group : "");
        if (ts.length) out.splice(throneAt >= 0 ? throneAt : out.length, 0, ...ts);
        for (const row of rowsOf()) {
          //@@slot topicSlides
          const def = row.cur != null && row.options.some((o) => o[0] === row.cur) ? row.cur : row.options[0][0];
          for (const [key, label, info, infoRefs] of row.options.filter((o) => o[0] !== def)) {
            out.push({ kind: "opinion", part: 1, group: row.group || "", row, key, def, title: label, sub: row.cap, text: info || "", refs: infoRefs || row.refs || [],
              then: optThen(row, key), out: tour_OUT });
          }
        }
        return out;
      };
      const verseSlides = () => tour_KINGS.filter((d) => !d.kelim || ctx.shared.kelim).map((d) => {
        const verses = [];
        let letters = 0;
        // (a completion slide, d.compl: no verse of its own; the slide says on which verses it stands)
        if (!d.compl) {
          for (let v = d.v[1]; v <= d.v[2]; v++) {
            const t = tour_VERSES[d.v[0] + ":" + v] || "";
            verses.push([v, t]);
            letters += t.replace(/[^א-ת]/g, "").length;
          }
        }
        //@@slot verseSlides.refs
        for (const [label, sp] of d.r || []) {
          const ref = tour_ref(sp);
          if (ref && !refs.some((x) => x[0] === label)) refs.push([label, ref]);
        }
        if (d.kelim) for (const r of linkRefs(ctx.shared.kelim.refs)) refs.push(r);
        //@@slot verseSlides
          go: d.go || [], lay: d.lay || null, out: d.out || tour_OUT, nofly: !!d.nofly, then: d.then ? [].concat(d.then) : null, verses, letters, bubble: !!d.bubble };
      });
      // ---- the DOM ----
      const mk = (tag, cls, txt, parent) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (txt != null) e.textContent = txt;
        if (parent) parent.appendChild(e);
        return e;
      };
      const tip = (el, text) => {
        el.title = text;
        if (fnc(el.setAttribute)) el.setAttribute("data-tip", text);   // for the UI's custom tooltips (K.9a), when it reads them
        if (fnc(U.tip)) call(U.tip, el, text);
        else if (fnc(U.tooltip)) call(U.tooltip, el, text);
      };
      // 1.1.0: the button goes into the top bar (70-ui.js ctx.ui.topbarAdd: order 10 = first), the menu under the bar's button row
      const btn = mk("button", null, "▶ מצגת", null);
      btn.id = "tm-tour-btn";
      btn.type = "button";
      if (fnc(U.topbarAdd)) call(U.topbarAdd, btn, 10, "play", "מצגת");
      else document.body.appendChild(btn);
      //@@slot buildTour.after-btn
      const menu = mk("div", null, null, btn.parentNode && btn.parentNode.id === "tm-topbtns" ? btn.parentNode : document.body);
      menu.id = "tm-tour-menu";
      mk("div", "mh", "מצגת — בחר את סוג המצגת:", menu);
      for (const M of tour_MODES) {
        const b = mk("button", null, null, menu);
        b.type = "button";
        mk("b", null, M.label, b);
        mk("span", null, M.desc, b);   // (no tooltip: the item already shows its description)
        b.addEventListener("click", () => {
          if (!confirmOpen()) start(M.key);
        });
      }
      const box = mk("div", null, null, document.body);
      box.id = "tm-tour-box";
      const hd = mk("div", "hd", null, box);
      const elPart = mk("span", "part", "", hd), elNum = mk("span", "num", "", hd);
      // TOUR_FOLD_420 (the user 24.11.2026: "למה אין קיפול בכרטיס של עבודת הבוקר?"): a fold, as the cards' - the text and the readings fold
      // away, the title, the numbers and the buttons stay
      { const fb = mk("button", "fold", "▴", hd); fb.type = "button"; fb.title = "קיפול"; fb.setAttribute("aria-label", "קיפול");
        fb.addEventListener("click", (e) => { e.stopPropagation(); const on = !box.classList.contains("min"); box.classList.toggle("min", on); fb.textContent = on ? "▾" : "▴"; fb.title = on ? "פתיחה" : "קיפול"; fb.setAttribute("aria-label", fb.title); }); }
      const elTtl = mk("div", "ttl", "", box), elSub = mk("div", "sub", "", box), elWait = mk("div", "wait", "", box);
      //@@slot buildTour.elOpts
      const body = mk("div", "body", null, box);
      // CHIP_KEEPS_DEMO_T (fix-t, 23.11.2026 - the user, 01:31: "בכל הדגמה ומצגת שיש שיטות, צריך שבכרטיס יהיה מעבר ברור ומהיר בין השיטות"):
      // the slide's opinions as chips, as on the cards (70-ui.js ctx.ui.chips), under its title: a place or a view - its card's rows; a
      // reading of the table - its own row. A chip changes the model at once and marks the row in the menu (and back: the hook); the
      // presentation goes on - no flight, no stop (the banner is no switch, 90-entry.js; ctx.shared.ui_chipKeepsDemo)
      const elOps = mk("div", "o", null, null);
      elOps.style.display = "none";
      box.insertBefore(elOps, body);
      const chipsOf = (s) => {
        const C = U.chips;
        if (!s || !C || !fnc(C.of)) return null;
        if (s.kind === "opinion") return s.row ? [s.row] : null;
        if (s.kind === "place") return call(C.of, { title: s.title });
        if (s.kind === "view") return call(C.of, { view: s.key });
        return null;
      };
      const renderOps = (s) => {
        const C = U.chips, ids = running && s ? chipsOf(s) : null;
        elOps.textContent = "";
        if (!ids || !ids.length || !C || !fnc(C.render) || !call(C.render, elOps, ids, null, () => true)) elOps.style.display = "none";
      };
      if (U.chips && fnc(U.chips.hook)) call(U.chips.hook, () => { if (running && slides[idx]) renderOps(slides[idx]); });
      // 1.0.1-L: elCaps = the captions of a timeline (the king's ascent, the witnesses), added one by one at their times
      const elVs = mk("div", "vs", null, body), elTxt = mk("div", "txt", "", body), elCaps = mk("div", "caps", null, body), elSrc = mk("div", "src", "", body);
      // 1.0.1-L (L.80): the bubble on the throne slides - in the banner under the scrolling text, always seen (on a phone it scrolls with the text:
      // placeBubble): the marker "לכאורה", the USER'S inference, the Ben Yehoyada's own words and their links
      const bubW = mk("div", "bubw", null, box);
      const elBub = mk("div", "bub", null, bubW);
      elBub.setAttribute("role", "note");
      {
        mk("div", "bq", tour_BUBBLE.quote, elBub);   // his words first, the inference apart from them
        const bt = mk("div", "bt", null, elBub);
        mk("span", "m", tour_BUBBLE.mark, bt);
        bt.appendChild(document.createTextNode(tour_BUBBLE.inference));
        if (fnc(U.refLinks)) call(U.refLinks, mk("div", "br", null, elBub), tour_BUBBLE.refs.map(([l, sp]) => [l, tour_ref(sp)]).filter((x) => x[1]));
      }
      const progEl = mk("div", "prog", null, box);
      const bar = mk("div", "bar", null, progEl);
      const ctl = mk("div", "ctl", null, box);
      const bPrev = mk("button", "prev", "→ הקודם", ctl), bPause = mk("button", "pause", "⏸ השהה", ctl);
      const bNext = mk("button", "next", "הבא ←", ctl), bStop = mk("button", "stop", "✕ סיום", ctl);
      for (const b of [bPrev, bPause, bNext, bStop]) b.type = "button";
      tip(bPrev, "לשקופית הקודמת");
      tip(bPause, "השהיית המצגת או המשכתה");
      tip(bNext, "לשקופית הבאה");
      tip(bStop, "סיום המצגת: השיטות, השכבות והמתגים חוזרים למה שהיו לפניה (Esc)");
      const ctl2 = mk("div", "ctl2", null, box);
      // 1.0.1-K review (tour-7): the speed's label (.spd, its word "קצב" in a span) moves into the controls row on a phone (placeSpeed)
      const spdLab = mk("label", "spd", null, ctl2);
      mk("span", "k", "קצב", spdLab);
      const spd = mk("select", null, null, spdLab);
      const SPEEDS = [["איטי", 1.5], ["רגיל", 1], ["מהיר", 0.6]];
      for (const [lab, k] of SPEEDS) {
        const o = mk("option", null, lab, spd);
        o.value = String(k);
      }
      tip(spdLab, "קצב המצגת: מהיר — 7 שניות לשקופית, רגיל — 10, איטי — 12");
      mk("span", "esc", "Esc — סיום", ctl2);
      // a mouse click does not leave the focus on the tour's buttons (Enter / Space then cannot act on them behind the cloud dialog)
      for (const b of [btn, bPrev, bPause, bNext, bStop]) b.addEventListener("mousedown", (e) => e.preventDefault());
      // ---- the state ----
      let mode = tour_MODES[0], slides = [], idx = -1, running = false, paused = false, ended = false, round = 1;
      let onlyIx = null;   // SEG_ONLY_420: the slides of one reading's part (tour.only) - the presentation plays them and holds at the last
      let elapsed = 0, total = 1, lastT = 0, idleUntil = 0, cfSeenAt = -1e9, progAt = 0, waitTxt = "", menuOpen = false, orbitSide = 1;
      let holdDemo = false;   // CAM_219: the continuous mode's hold paused the slide's demonstration
      let cur = null, saved = null;
      // 1.0.1-L: the cloud dialog was answered "ביטול" in this run: the next devir slides do not ask again, they use their views from outside
      let cloudDenied = false;
      // 1.0.1-K review (tour-6): the pointers that are down now (pointerId; pressed on the model, the nav row, the pills or the panel - not
      // on the tour's own elements or the dialog): the continuous mode holds while any is down and 8 s after the last is lifted
      const downPtrs = new Set();
      // the speed the user chose ("קצב", remembered in localStorage) and the speed of the running tour (start(mode, {speed}) may override it
      // for that run only: tests)
      let userSpeed = 1;
      try {
        const k = parseFloat(localStorage.getItem("tm-tour-speed"));
        if (SPEEDS.some((s) => s[1] === k)) userSpeed = k;
      } catch (_) {
      }
      let speed = userSpeed;
      spd.value = String(userSpeed);
      const slideMs = (s) => {
        // 1.0.1-L: a slide with a timeline dwells for it, in every mode (the speed scales the timeline too: animStep)
        const a = cur && cur.s === s ? cur.anim : null;
        if (a) return (tour_ANIM_LEAD + a.whole + tour_ANIM_TAIL) * 1000 * speed;
        // TOUR_TIMES_205 (the user, 12.11.2026 12:14: "זה ארוך מדי. צריך להיות 7 שניות לכרטיס במצב מהיר ... במצב רגיל 10, במצב איטי 12"):
        // a slide's time goes by the chosen pace alone, in every mode - no longer by the length of its text (9 to 45 seconds until
        // 2.0.4); a slide of several views gets no less than three seconds a view (told to the user 12:20)
        const base = speed >= 1.3 ? 12000 : speed <= 0.75 ? 7000 : 10000;
        return Math.max(base, (1 + (Array.isArray(s.then) ? s.then.length : 0)) * 3000);
      };
      const setBtn = () => {
        if (fnc(U.setTopBtn)) call(U.setTopBtn, btn, running ? "stop" : "play", running ? "עצור" : "מצגת");
        else btn.textContent = running ? "■ עצור" : "▶ מצגת";
        btn.classList.toggle("on", running);
        //@@slot setBtn
      };
      const openMenu = (on) => {
        menuOpen = !!on;
        menu.style.display = menuOpen ? "flex" : "none";
        btn.classList.toggle("open", menuOpen);
      };
      const setPaused = (p) => {
        paused = !!p;
        if (!paused) idleUntil = 0;
        holdDemo = false;   // CAM_219: "⏸" / "▶" take the demonstration over (below)
        bPause.textContent = paused ? "▶ המשך" : "⏸ השהה";
        // TOUR_DEMO_PAUSE_209: the slide's demonstration pauses with the presentation and goes on with it (90-entry.js DEMO_PAUSE_207)
        try {
          if (paused) { if (fnc(ctx.shared.demoPause)) ctx.shared.demoPause(); }
          else if (fnc(ctx.shared.demoPaused) && ctx.shared.demoPaused() && fnc(ctx.shared.demoResume)) ctx.shared.demoResume();
        } catch (_) {
        }
        showWait();
      };
      const showWait = () => {
        let t = "";
        if (running) {
          if (confirmOpen()) t = "ממתין לתשובה בחלון קודש הקדשים…";
          else if (paused) t = "המצגת מושהית.";
          else if (mode.key === "continuous" && idleUntil > now()) t = "המצגת ממשיכה מעצמה בעוד " + Math.max(1, Math.ceil((idleUntil - now()) / 1000)) + " שניות.";
          else if (cur && cur.outside) t = "קודש הקדשים מכוסה בענן — המבט מחוצה לו.";
        }
        if (t === waitTxt) return;
        waitTxt = t;
        elWait.textContent = t;
        elWait.style.display = t ? "block" : "none";
        if (cur && cur.anim && cur.anim.last) showCaption(cur.anim, cur.anim.last);   // 1.0.1-L: (the notice line takes the text's height: the caption stays in view)
      };
      // the banner stays above the compass and the nav row at the bottom left (#tm-compass, #tm-nav of 70-ui.js), whatever their height
      // (on a phone the nav row wraps to two lines): bottom = max(76 / 66 by CSS, their top + 8); on a phone the sheet's height is then
      // capped so that it never reaches the centre of the view. Measured on every slide, on resize and once a second while running.
      const fitBox = () => {
        const H = window.innerHeight || 0;
        let top = Infinity;
        for (const id of ["tm-nav", "tm-compass"]) {
          const e = document.getElementById(id);
          const r = e && fnc(e.getBoundingClientRect) ? e.getBoundingClientRect() : null;
          if (r && r.height > 0 && r.top > H / 2 && r.top < top) top = r.top;   // (only a row at the bottom counts)
        }
        let need = isFinite(top) ? Math.ceil(H - top + 8) : 0;
        if (document.body && document.body.classList && document.body.classList.contains("tm-measuring")) need = Math.max(need, 96);   // UX3
        box.style.bottom = need > (narrow() ? 66 : 76) ? need + "px" : "";
        box.style.maxHeight = narrow() && need > 66 ? Math.max(120, Math.floor(Math.min(0.4 * H, H / 2 - need - 4))) + "px" : "";
        placeSpeed();
        placeBubble();
        viewShift();
      };
      // 1.0.1-L (L.93): the panel is closed, and the banner stands on the left: the view's centre moves to the middle of the free space, so that what a slide looks at stands
      // beside the banner. A lens shift (setViewOffset): no camera, target or ray changes, the pills and the labels follow it. Measured with fitBox; if the viewer reopens the
      // panel, the middle between the two. On a phone, where the banner is a bottom sheet, the shift is upward
      let shiftKey = "";
      const viewShift = () => {
        const c = ctx.camera;
        if (!c || !fnc(c.setViewOffset) || !fnc(c.clearViewOffset)) return;
        const W = window.innerWidth || 0, H = window.innerHeight || 0;
        let dx = 0, dy = 0;
        if (running && W > 0 && H > 0 && fnc(box.getBoundingClientRect)) {
          const r = box.getBoundingClientRect();
          if (narrow()) {
            // 1.0.1-L: on a phone the sheet covers the lower half, and the view's centre fell on its edge (the throne's steps, the ascent itself, behind it): the centre goes up to the middle of the space above the sheet (in steps of 24 px, so that a slide's text of another length does not move the view)
            if (r && r.height > 0 && r.top > 0) dy = Math.round(Math.max(0, Math.min(0.3 * H, (H - r.top - 48) / 2)) / 24) * 24;
          } else {
            const p = panelOpen() && fnc(U.panel.getBoundingClientRect) ? U.panel.getBoundingClientRect() : null;
            if (r && r.width > 0) dx = Math.round((r.right + (p && p.width > 0 ? p.left : W) - W) / 2);
          }
        }
        const k = dx || dy ? W + "x" + H + ":" + dx + ":" + dy : "";
        if (k === shiftKey) return;
        shiftKey = k;
        if (dx || dy) c.setViewOffset(W, H, -dx, dy, W, H);
        else c.clearViewOffset();
      };
      // 1.0.1-L (L.80): the bubble's place: a strip of its own under the text; on a phone (the sheet is low) at the end of the scrolling text
      const placeBubble = () => {
        const home = narrow() ? body : box;
        if (bubW.parentNode === home) return;
        if (home === box && fnc(box.insertBefore)) box.insertBefore(bubW, progEl);
        else home.appendChild(bubW);
      };
      // 1.0.1-K review (tour-7): on a phone the speed choice sits at the end of the controls row (the row under it is not shown there, for
      // the text's height); on a wider window it goes back before the "Esc" hint. Moved only when the side changes
      const placeSpeed = () => {
        const home = narrow() ? ctl : ctl2;
        if (spdLab.parentNode === home) return;
        if (home === ctl2 && fnc(ctl2.insertBefore)) ctl2.insertBefore(spdLab, ctl2.firstChild);
        else home.appendChild(spdLab);
      };
      window.addEventListener("resize", () => {
        if (box.style.display !== "none") fitBox();
      });
      let fitAt = 0;
      //@@slot partLabel
        return "לפי הנושאים · " + (s.part ? "שיטות נוספות" + (s.group ? " · " + s.group : "") : s.group || "מבטים");   // 1.0.1-L: the panel's group
      };
      const renderVerses = (list) => {
        elVs.textContent = "";
        //@@slot renderVerses
            else p.appendChild(document.createTextNode(part));
          }
        }
      };
      // 1.0.1-L (L.89, "כל הסוגריים של מקורות תקטין יותר"): the helper of 70-ui.js: a source in parentheses, outside a quote, in a smaller font; the letters do not change
      const fillSrc = (el, text) => {
        const h = fnc(U.smallSources) ? call(U.smallSources, text) : null;
        if (typeof h === "string") el.innerHTML = h;
        else el.textContent = text;
      };
      const slideText = (s, rt) => s.text + (rt && rt.feat && s.xf ? (s.text ? " " : "") + s.xf : "");
      const render = (s, rt) => {
        elPart.textContent = partLabel(s);
        elNum.textContent = (idx + 1) + " / " + slides.length;
        fillSrc(elTtl, s.title);
        elSub.textContent = s.sub || "";
        elSub.style.display = s.sub ? "" : "none";
        renderOps(s);   // CHIP_KEEPS_DEMO_T
        //@@slot render
        renderVerses(s.verses && s.verses.length ? s.verses : null);
        fillSrc(elTxt, slideText(s, rt));
        elCaps.textContent = "";
        bubW.classList.toggle("on", !!s.bubble);
        elSrc.textContent = "";
        elSrc.classList.remove("open");
        if (s.refs && s.refs.length && fnc(U.refsBlock)) {
          call(U.refsBlock, elSrc, s.refs);   // N15: the sources closed behind "הצג מקורות"
        } else if (s.refs && s.refs.length && fnc(U.refLinks)) {
          elSrc.appendChild(document.createTextNode("מקורות: "));
          call(U.refLinks, elSrc, s.refs);
        }
        bPrev.disabled = idx <= 0 && mode.key !== "continuous";
        bNext.disabled = false;
        bNext.textContent = idx === slides.length - 1 && mode.key !== "continuous" ? "לסיכום ←" : "הבא ←";
        bPause.textContent = paused ? "▶ המשך" : "⏸ השהה";
        bStop.textContent = "✕ סיום";
        bar.style.width = "0%";
        body.scrollTop = 0;
        showWait();
        fitBox();
      };
      // ---- entering and leaving a slide ----
      const leave = () => {
        const rt = cur;
        cur = null;
        if (!rt) return;
        for (let k = rt.undo.length - 1; k >= 0; k--) {
          try {
            rt.undo[k]();
          } catch (_) {
          }
        }
      };
      const flyRes = (res, dur) => {
        const before = snapOpen();
        fly(res.cam.pos, res.cam.target, dur);
        keepClosed(before);
      };
      // 1.0.1-L (L.81): a version of the throne for this slide (through its row of the opinions table when it is there, so the panel shows it);
      // it goes back when the slide is left
      const versionFor = (rt, key) => {
        const tv = ctx.shared.throneVersion;
        if (!tv || !fnc(tv.set) || tv.current === key) return;
        const row = throneRow(), was = tv.current;
        rt.lv = layerVis();   // (tour-5: a row's onPick may switch the palace layer)
        rt.undo.push(() => {
          for (const [n, v] of rt.lv) if (layerOn(n) !== v) setLayer(n, v);
        });
        if (row) setRow(row, key);
        else call(tv.set, key);
        rt.undo.push(() => {
          if (row) setRow(row, was);
          else call(tv.set, was);
        });
        rt.lv = rt.lv.filter(([n, v]) => layerOn(n) !== v);
      };
      // 1.0.1-L (L.78-L.81): starts the slide's timeline. The tour drives it (animStep: seek per frame), so its clock is the slide's: frozen while the
      // tour is paused, held or hidden, scaled by the speed. Null-safe: no API or no script for this version = a plain slide
      const beginAnim = (rt) => {
        const s = rt.s, th = ctx.shared.throne;
        //@@slot beginAnim
        if (!s.anim || !th) return;
        const wit = s.anim === "witnesses", api = wit ? th.witnesses : th.ascent, scr = wit ? th.witnessScript : th.script;
        const caps = scr && scr[s.ver];
        if (!api || !fnc(api.start)) return;
        let ok = false;
        try {
          ok = wit ? api.start() : api.start(s.ver);
        } catch (_) {
        }
        if (!ok) return;
        const dur = typeof api.duration === "number" && api.duration > 0 ? api.duration : 0;
        rt.anim = { api, dur, whole: dur, base: 0, next: null, caps: Array.isArray(caps) ? caps : [], i: 0, last: null, done: false, scrolled: false };
        // 1.0.1-L (A31): the witnesses follow on the same slide, after a moment for the camera (animStep)
        if (s.animW && th.witnesses && fnc(th.witnesses.start)) {
          const w = th.witnesses, wc = th.witnessScript && th.witnessScript[s.ver], wd = typeof w.duration === "number" && w.duration > 0 ? w.duration : 0;
          if (wd > 0) {
            rt.anim.next = { api: w, dur: wd, caps: Array.isArray(wc) ? wc : [] };
            rt.anim.whole += tour_ANIM_LEAD + wd;
            rt.undo.push(() => {
              try {
                if (fnc(w.reset)) w.reset();
              } catch (_) {
              }
            });
          }
        }
        rt.undo.push(() => {
          try {
            if (fnc(api.reset)) api.reset();
          } catch (_) {
          }
        });
        total = slideMs(s);
      };
      // the newest caption stays in view, unless the reader scrolled the text himself
      const showCaption = (a, e) => {
        const top = e.offsetTop, h = e.offsetHeight, ch = body.clientHeight;
        if (!a.scrolled && ch > 0 && isFinite(top + h)) body.scrollTop = Math.max(0, top + h - ch + 8);
      };
      const addCaption = (a, c) => {
        if (a.last) a.last.classList.remove("now");
        const e = mk("div", "cap now", null, elCaps);
        fillSrc(e, c.text);   // (L.89: the bracket after the midrash's quote; the helper leaves the quote's own words)
        a.last = e;
        showCaption(a, e);
      };
      // per frame, also while held (the same moment again: the timeline stays frozen); no allocation but the caption's element when one appears
      const animStep = (rt) => {
        const a = rt.anim;
        if (!a || a.done) return;
        const at = elapsed / (1000 * speed) - tour_ANIM_LEAD - a.base, sec = at > 0 ? at : 0;   // (at < 0: the camera is still on its way)
        while (a.i < a.caps.length && a.caps[a.i].t <= at) addCaption(a, a.caps[a.i++]);
        if (sec >= a.dur) {
          try {
            if (fnc(a.api.reset)) a.api.reset();
          } catch (_) {
          }
          // 1.0.1-L (A31): from the ascent to the witnesses on the same slide: their lead as a caption, the throne's view, their timeline after the same lead time
          const n = a.next;
          if (n) {
            a.next = null;
            a.base += tour_ANIM_LEAD + a.dur;
            a.api = n.api;
            a.dur = n.dur;
            a.caps = n.caps;
            a.i = 0;
            addCaption(a, { text: tour_THRONE.leadW });
            let ok = false;
            try {
              ok = n.api.start();
            } catch (_) {
            }
            if (ok) {
              const r2 = pick(rt.s.goW);
              if (r2) flyRes(r2);
              return;
            }
          }
          a.done = true;   // everything returns to rest; the last caption stays until the slide ends
          return;
        }
        try {
          if (fnc(a.api.seek)) a.api.seek(sec);
        } catch (_) {
        }
      };
      // returns false when the slide is skipped (the continuous mode, the devir under the cloud); its switches are then undone by leave()
      const enter = () => {
        const s = slides[idx];
        const rt = { s, undo: [], feat: false, devirNav: false, asked: false, orbit: null, thenI: 0, lv: null, anim: null, outside: false, act: false, actOnly: false, demoSeen: false, demoEnd: null, thenAbs: null };
        cur = rt;
        // 1.3.5 / 1.9.3: what this slide's place or reading opens for a while (a roof, a section) stays until the slide is left
        call(ctx.shared.holdAuto, true);
        rt.undo.push(() => {
          call(ctx.shared.holdAuto, false);
          call(ctx.shared.closeAuto);
          try { if (ctx.ui && ctx.ui.autoOff) ctx.ui.autoOff.flush(); } catch (_) {}   // TOUR_FLUSH_211: the zones, the see-through house
        });
        if (s.kind === "opinion") {
          // 1.0.1-K review (tour-5): a reading's own calls may switch a layer that is not its own - the forest house's onPick and fly
          // turn the palace layer on, and so does its undo, onPick(def) (70-ui.js): the layers are recorded first, and those that the
          // slide's own calls changed (rt.lv, narrowed after the row's fly below) are put back after the row's undo (pushed first, so it
          // runs last). In "רציפה" the palace stayed on from the second round. A feature's own group is not among them (OWNED)
          rt.lv = layerVis();
          rt.undo.push(() => {
            for (const [n, v] of rt.lv) if (layerOn(n) !== v) setLayer(n, v);
          });
          // 1.3.5 / 1.9.3: a reading may move another row with it (the names of the north gates show the thirteen gates) - the other rows
          // go back after this row's own way back (pushed first, so it runs after it)
          // 1.3.7 / 1.9.5 (TOUR_ENGINE_204; the scan of 11.11.2026): a row whose onPick runs a demonstration (the way from the wicket to
          // the great gate) started the DEFAULT reading's demonstration when the slide was left and the row went back - over the next
          // slide. The demonstrations are stopped after the rows went back (pushed before their undos: the stack runs backwards)
          rt.undo.push(() => call(ctx.shared.stopDemos));
          const rows0 = rowsOf().filter((r) => r !== s.row).map((r) => [r, r.cur]);
          rt.undo.push(() => {
            for (const [r, k] of rows0) if (r.cur !== k) setRow(r, k);
          });
          setRow(s.row, s.key);
          rt.undo.push(() => setRow(s.row, s.def));
        }
        if (s.ver) versionFor(rt, s.ver);   // 1.0.1-L: before the camera is chosen (a version may re-aim the throne's fly points)
        if (s.lay) layerNeed(rt, s.lay);
        let res = null;
        if (s.kind !== "opinion" && !s.nofly) {
          res = pick(s.go) || pick([{ fp: "__general" }]);   // a missing target: the general view, never an error
          if (res) {
            rt.devirNav = inDevir(res.cam.pos) || inDevir(res.cam.target);
            if (mode.key === "continuous" && rt.devirNav && cloudOn()) return false;
            // 1.0.1-L: after a "ביטול" in this run no second dialog: the slide's view from outside the devir
            if (rt.devirNav && cloudDenied && cloudOn()) {
              const r2 = pick(s.out);
              if (r2) {
                res = r2;
                rt.devirNav = false;
                rt.outside = true;
              }
            }
            if (res.c.f === "mechonaExplode") parkBase(rt);   // 1.0.1-K review (vessels-2 / tour-4): taken apart in its place
            if (res.c.f) rt.feat = featureOn(rt, res.c.f);
            if (rt.feat && s.xf) total = slideMs(s);
            if (res.c.lay) layerNeed(rt, res.c.lay);
            if (res.cam.layer) layerNeed(rt, res.cam.layer);
          }
        }
        render(s, rt);
        // 1.0.1-L (L.34): the UI's info box became the floating card, which stays closed while the tour runs: its text is the banner's own
        if (!U.card) {
          if (s.kind === "view") setInfo(s.key);
          else setInfo("__place", { text: elTxt.textContent, refs: s.refs || [] });
        }
        if (s.kind === "opinion") {
          const before = snapOpen();
          if (fnc(s.row.fly)) call(s.row.fly, s.key);
          keepClosed(before);
          rt.lv = rt.lv.filter(([n, v]) => layerOn(n) !== v);   // (tour-5) only the layers this slide's own calls changed
          if (confirmOpen()) {
            rt.devirNav = true;
            if (mode.key === "continuous") {
              cancelConfirm();
              return false;
            }
            if (cloudDenied) {   // 1.0.1-L: no second dialog in this run
              cancelConfirm();
              rt.devirNav = false;
              rt.outside = true;
              const r2 = pick(s.out);
              if (r2) flyRes(r2);
            }
          }
        } else {
          runPlace(rt, s, res);   // 1.3.5 / 1.9.3: the place's own feature and action, as its button (before its flight, as there)
          if (res && !rt.actOnly) flyRes(res);
        }
        if (s.anim) beginAnim(rt);
        if (mode.key === "continuous" && !rt.devirNav && !s.nofly && !rt.actOnly && !(Array.isArray(s.then) && s.then.length)) {   // TOUR_ENGINE_204B: its own cameras turn it
          rt.orbit = { start: 1800, amp: tour_ORBIT * orbitSide, applied: 0, begun: false, dead: false };
          orbitSide = -orbitSide;
        }
        return true;
      };
      // the slide's further cameras (8:1-5: from the south up to the house; 1.0.1-L: a list, each at its part of the slide)
      const thenStep = (rt) => {
        const th = rt.s.then;
        // TOUR_DEMO_HOLD_206: after a demonstration the further views that waited for it have times of their own (rt.thenAbs)
        if (!th || rt.thenI >= th.length || elapsed < (rt.thenAbs ? rt.thenAbs[rt.thenI] : total * th[rt.thenI].at)) return;
        const t = th[rt.thenI++];
        const r2 = pick(t.go);
        if (!r2) return;
        // 1.0.1-L (L.88): a stop may switch its feature on, for the rest of the slide; the slide's added sentence comes with it
        if (r2.c.f && !rt.feat && featureOn(rt, r2.c.f)) {
          rt.feat = true;
          if (rt.s.xf) {
            fillSrc(elTxt, slideText(rt.s, rt));
            const t1 = slideMs(rt.s);
            if (t1 > total) total = t1;
          }
        }
        flyRes(r2, t.dur);
      };
      // the continuous mode's orbit: eased from 0 to +-12 degrees about the vertical through the target, over the rest of the slide
      const orbitStep = (rt) => {
        const o = rt.orbit;
        if (!o || o.dead || elapsed < o.start) return;
        const cam = ctx.camera, oc = ctx.controls;
        if (!cam || !oc || !oc.target) {
          o.dead = true;
          return;
        }
        const p = cam.position, tg = oc.target;
        if (!o.begun) {
          if (!outdoors([p.x, p.y, p.z], [tg.x, tg.y, tg.z])) {
            o.dead = true;
            return;
          }
          o.begun = true;
        }
        const k = Math.min(1, (elapsed - o.start) / Math.max(1, total - o.start));
        const th = o.amp * (1 - Math.cos(Math.PI * k)) / 2, d = th - o.applied;
        if (Math.abs(d) < 1e-7) return;
        o.applied = th;
        const ox = p.x - tg.x, oz = p.z - tg.z, c = Math.cos(d), sn = Math.sin(d);
        p.x = tg.x + ox * c + oz * sn;
        p.z = tg.z - ox * sn + oz * c;
        cam.lookAt(tg);
      };
      const go = (i, dir) => {
        dir = dir < 0 ? -1 : 1;
        cancelConfirm();   // a pending dialog of the slide that is left: its fly must not land on the next slide
        // 1.0.1-K review (tour-2): the card of a clicked label (70-ui.js, K.9b) is closed on every slide change, as the UI's views and
        // places do - in "רציפה" the tour moves on by itself and the card stayed over the next views with the old label's text
        call(U.closeCard);
        closeXCard();
        leave();
        const N = slides.length;
        let wrapped = false;
        for (let k = 0; k < N; k++) {
          let j = i + k * dir;
          if (mode.key === "continuous") {
            if (j >= N && !wrapped) {
              round++;   // the loop starts again
              wrapped = true;
            }
            j = ((j % N) + N) % N;
          } else if (j < 0 || j >= N) break;
          idx = j;
          elapsed = 0;
          total = slideMs(slides[j]);
          if (enter()) return true;
          leave();   // skipped: undo what it switched on
        }
        return false;
      };
      // ---- the pre-tour state, restored at the end ----
      // 1.0.1-K review (tour-1 / cross-2 / interior-2): the layers but for a feature's own groups (OWNED), and the features themselves
      // (OWN_FEAT, null = not in the model) with the parts' labels of the base taken apart
      const snapshot = () => ({
        rows: rowsOf().map((r) => [r, r.cur]),
        layers: layerVis(),
        feats: OWN_FEAT.map((k) => [k, featState(k)]),
        parts: layerOn("mechonaParts"),
        ver: ctx.shared.throneVersion ? ctx.shared.throneVersion.current : null,   // 1.0.1-L: (also when the panel has no row for it)
        auto: false,
        panel: false
      });
      const restore = () => {
        const sv = saved;
        saved = null;
        if (!sv) return;
        //@@slot restore
        const tvr = ctx.shared.throneVersion;
        if (sv.ver && tvr && tvr.current !== sv.ver && fnc(tvr.set)) call(tvr.set, sv.ver);
        for (const [n, vis] of sv.layers) if (ctx.layers[n] && layerOn(n) !== vis) setLayer(n, vis);
        // 1.0.1-K review (tour-1 / cross-2 / interior-2): a feature the user switched during the tour (its pill, "↺ החזר הכל") goes back
        // as it was before the tour through its own set(), which moves its meshes, its "on" and its group together - the raw restore of
        // the group left the measures, the layers' labels or the parts' labels without their feature (or over the closed model)
        for (const [k, on] of sv.feats) {
          if (on === null || featState(k) === on) continue;
          try {
            featureOf(k).set(on);
          } catch (_) {
          }
        }
        // 1.3.6 / 1.9.4: the viewing tools that were on before the presentation come back (toolsOff)
        for (const f of sv.tools || []) {
          try {
            f();
          } catch (_) {
          }
        }
        // the parts' labels go with the base taken apart: as before the tour while it is apart
        const parts = sv.parts && featState("mechonaExplode") === true;
        if (ctx.layers.mechonaParts && layerOn("mechonaParts") !== parts) setLayer("mechonaParts", parts);
        // tour-8: on again only if it was on before the tour and nobody switched it back on meanwhile
        if (sv.auto) {
          const ar = autoRot();
          if (ar) {
            if (!call(ar.get)) call(ar.set, true);
          } else if (ctx.controls && !ctx.controls.autoRotate) ctx.controls.autoRotate = true;
        }
        // 1.0.1-L (L.93): the panel as it was before the presentation, whatever the viewer did with the burger meanwhile
        if (U.panel && U.burger && fnc(U.burger.click) && panelOpen() !== sv.panel) U.burger.click();
      };
      // 1.0.1-K review (tour-7): the same rule as the CSS (tour_PHONE_MQ), one MediaQueryList made once
      let phoneMQ = null;
      try {
        if (fnc(window.matchMedia)) phoneMQ = window.matchMedia(tour_PHONE_MQ);
      } catch (_) {
      }
      const narrow = () => (phoneMQ && typeof phoneMQ.matches === "boolean" ? phoneMQ.matches : (window.innerWidth || 1024) < 640);
      const panelOpen = () => !!(U.panel && U.panel.style.display !== "none");
      const start = (key, opts) => {
        if (confirmOpen()) return false;
        if (running) finish(true);
        const M = tour_MODES.find((m) => m.key === key) || tour_MODES[typeof key === "number" ? key : 0] || tour_MODES[0];
        mode = M;
        speed = opts && opts.speed > 0 ? opts.speed : userSpeed;
        onlyIx = null;
        //@@slot start
        openMenu(false);
        if (!slides.length) return false;
        // 1.0.1-L (L.34 / L.27): the explanation card closes and stays closed; a place's 15-second timer no longer runs - a slide's feature is the
        // tour's alone, and what such a timer would have switched off goes back now (before the snapshot, so the end does not bring it back)
        closeXCard();
        if (U.autoOff) {
          call(U.autoOff.flush);
          call(U.autoOff.cancel);
        }
        if (fnc(ctx.shared.closeAuto)) call(ctx.shared.closeAuto);   // (1.9.4: what a place or a row opened for a while, the Second Temple's timers)
        const tools = toolsOff();   // 1.3.6 / 1.9.4: before the snapshot, so that the features among them are "off" in it
        saved = snapshot();
        saved.tools = tools;
        cloudDenied = false;
        //@@slot start-2
        {
          const tvs = ctx.shared.throneVersion;   // (L.81: the throne too, also when the panel has no row for it)
          if (tvs && Array.isArray(tvs.keys) && tvs.keys.length && tvs.current !== tvs.keys[0] && fnc(tvs.set)) call(tvs.set, tvs.keys[0]);
        }
        // the tour moves the camera itself: "סיבוב איטי" off while it runs (1.0.1-K review tour-8: through the UI's checkbox when it can)
        const ar = autoRot();
        if (ar ? !!call(ar.get) : !!(ctx.controls && ctx.controls.autoRotate)) {
          if (ar) call(ar.set, false);
          else ctx.controls.autoRotate = false;
          saved.auto = true;
        }
        // 1.0.1-L (L.93, the user: "אני רוצה שבזמן הצפיה התפריט מצד ימין יסגר לצד לגמרי כדי לתת מרחב יותר לתצוגה"): in every mode, as the burger closes it; the burger stays
        saved.panel = panelOpen();
        if (saved.panel && U.burger && fnc(U.burger.click)) U.burger.click();
        running = true;
        ended = false;
        paused = false;
        idleUntil = 0;
        holdDemo = false;   // CAM_219
        downPtrs.clear();
        round = 1;
        orbitSide = 1;
        roofList = null;
        cfSeenAt = -1e9;
        box.style.display = "flex";
        setBtn();
        idx = -1;
        //@@slot start-3
        go(0, 1);   // (closes the label's card: tour-2)
        return true;
      };
      // 1.0.1-K review (tour-3): the hidden banner keeps no focus (a focused speed <select> would go on taking the arrow keys)
      const hideBox = () => {
        const ae = document.activeElement;
        if (ae && inside(ae, box) && fnc(ae.blur)) ae.blur();
        box.style.display = "none";
      };
      const showEnd = () => {
        //@@slot showEnd
        elNum.textContent = "";
        elTtl.textContent = "סוף המצגת";
        elSub.style.display = "none";
        elOps.textContent = "";   // CHIP_KEEPS_DEMO_T
        elOps.style.display = "none";
        elVs.textContent = "";
        elTxt.textContent = "השיטות, השכבות והמתגים שהיו לפני המצגת הוחזרו, וחזרנו למבט הכללי. אפשר להמשיך לבד בלוח הבקרה, או להתחיל שוב.";
        elCaps.textContent = "";
        bubW.classList.remove("on");
        elSrc.textContent = "";
        waitTxt = "";
        elWait.style.display = "none";
        bPrev.disabled = true;
        bPause.textContent = "▶ התחל שוב";
        bNext.textContent = "—";
        bNext.disabled = true;
        bStop.textContent = "✕ סגור";
        bar.style.width = "100%";
      };
      const finish = (close) => {
        if (!running) {
          if (close) hideBox();
          return;
        }
        cancelConfirm();
        call(U.closeCard);   // 1.0.1-K review (tour-2): the label's card does not outlive the tour either
        leave();
        //@@slot finish
        restore();
        running = false;
        viewShift();   // 1.0.1-L (L.93): the lens back to the centre
        paused = false;
        idleUntil = 0;
        holdDemo = false;   // CAM_219
        downPtrs.clear();
        idx = -1;
        setBtn();
        if (close) {
          hideBox();
          return;
        }
        ended = true;
        showEnd();
        const g = resolveFp("__general");
        if (g) flyRes({ cam: { pos: g.pos, target: g.target } });
        if (!U.card) setInfo("__general");   // (1.0.1-L: the floating card does not open by itself)
      };
      const next = () => {
        if (!running) return;
        if (idx + 1 < slides.length || mode.key === "continuous") go(idx + 1, 1);
        else finish(false);
      };
      const prev = () => {
        if (!running) return;
        if (idx > 0) go(idx - 1, -1);
        else if (mode.key === "continuous") go(slides.length - 1, -1);
      };
      const setSpeed = (k) => {
        if (!(k > 0)) return;
        const frac = total > 0 ? elapsed / total : 0;
        speed = userSpeed = k;
        spd.value = String(k);
        try {
          localStorage.setItem("tm-tour-speed", String(k));
        } catch (_) {
        }
        if (running && slides[idx]) {
          total = slideMs(slides[idx]);
          elapsed = frac * total;
        }
      };
      // the user looks around: the continuous mode holds 8 s after the last interaction, the other modes pause until "המשך"
      const userInteract = () => {
        if (!running) return;
        if (mode.key === "continuous" && !paused) {
          idleUntil = now() + 8000;
          if (cur && cur.orbit) cur.orbit.dead = true;
          // CAM_219 (the audit: in "רציפה" a demonstration that leads the eye - a walk, the lots - kept writing the camera through the
          // hold, and a drag or a key did nothing until it ended): the slide's demonstration pauses with the hold (the eye is the
          // viewer's), and goes on from the same moment when the hold ends (the tick, below) - as "⏸" does in the other modes
          try { if (fnc(ctx.shared.demoPause) && ctx.shared.demoPause()) holdDemo = true; } catch (_) {}
          showWait();
        } else setPaused(true);
      };
      // 1.0.1-K review (tour-6): the continuous mode's hold is kept 8 s ahead while a pointer is down or drags (no allocation: per frame)
      const holdOn = () => {
        if (running && mode.key === "continuous" && !paused) idleUntil = Math.max(idleUntil, now() + 8000);
      };
      // ---- the controls ----
      btn.addEventListener("click", () => {
        if (confirmOpen()) return;
        if (running) finish(true);
        else openMenu(!menuOpen);
      });
      bPrev.addEventListener("click", () => {
        if (confirmOpen()) return;
        onlyIx = null;
        setPaused(false);
        prev();
      });
      bNext.addEventListener("click", () => {
        if (confirmOpen()) return;
        onlyIx = null;
        setPaused(false);
        next();
      });
      bPause.addEventListener("click", () => {
        if (confirmOpen()) return;
        if (!running) {
          start(mode.key);
          return;
        }
        setPaused(!paused);
      });
      bStop.addEventListener("click", () => {
        if (confirmOpen()) return;
        finish(true);
      });
      // 1.0.1-K review (tour-3): after a choice the select gives the focus back - Chromium leaves it there after a mouse pick, and then Esc
      // did not end the tour and the arrow keys changed (and stored) the speed instead of turning the view
      spd.addEventListener("change", () => {
        setSpeed(parseFloat(spd.value));
        if (fnc(spd.blur)) spd.blur();
      });
      // F1 / UX2: a source link opened from the banner (Otzaria takes the reader away): pause. Capture phase - the link's own handler
      // (openSource) stops the click's propagation (1.0.1-L: the bubble's links too)
      for (const host of [elSrc, elBub]) {
        host.addEventListener("click", (e) => {
          if (!running) return;
          for (let n = e.target; n && n !== host; n = n.parentNode) {
            if (n.tagName && String(n.tagName).toUpperCase() === "A") {
              setPaused(true);
              return;
            }
          }
        }, true);
      }
      // 1.0.1-L: the reader scrolls the text himself: a new caption no longer scrolls it away
      for (const ev of ["wheel", "pointerdown", "touchstart"]) {
        body.addEventListener(ev, () => {
          if (cur && cur.anim) cur.anim.scrolled = true;
        }, { passive: true });
      }
      // F4 / UX6: any pointer on the model, the nav buttons, the model's pills or the panel = the user takes over; the wheel outside the
      // banner and the panel too. Not the tour's own elements, not the cloud dialog; synthetic pointer events (90-entry.js) are ignored
      document.addEventListener("pointerdown", (e) => {
        const t = e.target;
        if (menuOpen && !inside(t, menu) && !inside(t, btn)) openMenu(false);
        if (!running || e.__tmSynthetic) return;
        if (inside(t, box) || inside(t, btn) || inside(t, menu) || inside(t, cfEl())) return;
        // TOUR_SOFT_204 (the user, 12.11.2026 02:14: "סגירת כרטיס צף או קיפול במצגת או בכל הדגמה אינה נחשבת פקודה"): closing a floating
        // card, folding it, folding a group of the panel or the panel itself - not the user taking over
        if (t && t.closest && t.closest("#tm-xcard .x, #tm-card .x, .tm-rt, #tm-burger, summary")) return;
        downPtrs.add(e.pointerId);   // tour-6: held while it is down
        userInteract();
      }, true);
      // 1.0.1-K review (tour-6): "רציפה" counted only the press, so a drag or a nav button held longer than 8 s (they repeat every 40 ms
      // with no new events) flew to the next slide mid-gesture. Now the tour holds while any pointer is down and 8 s after the last is
      // lifted; a move with a button pressed refreshes the hold too. Synthetic events of 90-entry.js's pointer safety never start or
      // refresh a hold - a synthetic release (a lost release it ends) only clears its pointer, as a move with no button pressed, the
      // window's blur and a hidden document do: a lost release never holds the tour for good
      const ptrUp = (e) => {
        if (!downPtrs.delete(e.pointerId)) return;
        if (!e.__tmSynthetic) holdOn();
      };
      document.addEventListener("pointerup", ptrUp, true);
      document.addEventListener("pointercancel", ptrUp, true);
      document.addEventListener("pointermove", (e) => {
        if (!running) return;
        if (!e.buttons) {
          if (downPtrs.size) downPtrs.delete(e.pointerId);   // not pressed any more (released outside the page)
          return;
        }
        if (e.__tmSynthetic || mode.key !== "continuous" || paused) return;
        const t = e.target;
        if (inside(t, box) || inside(t, btn) || inside(t, menu) || inside(t, cfEl())) return;
        holdOn();
      }, { capture: true, passive: true });
      const ptrsLost = () => {
        if (!downPtrs.size) return;
        downPtrs.clear();
        holdOn();
      };
      window.addEventListener("blur", ptrsLost);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) ptrsLost();
      });
      document.addEventListener("wheel", (e) => {
        if (!running) return;
        const t = e.target;
        if (inside(t, box) || inside(t, menu) || (U.panel && inside(t, U.panel))) return;
        if (t && t.closest && t.closest("#tm-xcard, #tm-card")) return;   // TOUR_SOFT_204: reading a floating card
        userInteract();
      }, { capture: true, passive: true });
      // keys: Esc closes the menu / answers the cloud dialog ("ביטול") / ends the tour; the arrows and the zoom keys turn the view -> the user
      // takes over. Nothing else is taken while the focus is in an input, a select or the side panel; no key is prevented
      window.addEventListener("keydown", (e) => {
        const ae = document.activeElement;
        const tag = ae && ae.tagName ? String(ae.tagName).toUpperCase() : "";
        const cf = confirmOpen();
        if (e.key === "Escape" || e.key === "Esc") {
          // 1.0.1-K review (tour-3): Esc BEFORE the focus test - with the focus on a side-panel button or checkbox, or on the banner's speed
          // <select> (Chromium leaves the focus on what the mouse clicked), the banner's "Esc — סיום" did nothing. Esc has no use there;
          // only a field one types in (none in the UI today) keeps its own Esc
          if (tag === "TEXTAREA" || (ae && ae.isContentEditable) ||
            (tag === "INPUT" && !/^(checkbox|radio|button|submit|reset|range|color|file|image)$/i.test(String(ae.type || "text")))) return;
          if (menuOpen) return void openMenu(false);
          if (cf) {
            if (running) cancelConfirm();
            return;
          }
          // the dialog was open at the last frame and is closed now: its own Esc handler (if ui.js has one) closed it during this very key
          // press - the tour goes on (a person's next key comes much later than 80 ms)
          if (now() - cfSeenAt < 80) return;
          // 1.0.1-L (L.34): an explanation card the user opened during a pause: this Esc closes the card (70-ui.js), not the tour
          if (running && U.card && fnc(U.card.isOpen) && U.card.isOpen()) return;
          if (running) finish(true);
          else if (box.style.display !== "none") hideBox();
          return;
        }
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (ae && ae.isContentEditable) || (U.panel && inside(ae, U.panel))) return;
        if (!running || cf) return;
        if (/^(Arrow(Up|Down|Left|Right)|PageUp|PageDown|\+|-|=)$/.test(e.key || "")) userInteract();
      }, true);
      // ---- the clock: a ctx.animated hook (no interval), frozen while paused, held, waiting for the dialog or hidden ----
      ctx.animated.push(function(t) {
        const tn = typeof t === "number" && isFinite(t) ? t : now();
        const dt = lastT ? Math.min(500, Math.max(0, tn - lastT)) : 0;
        lastT = tn;
        if (!running) return;
        const cf = confirmOpen();
        if (cf) cfSeenAt = now();
        const rt = cur;
        if (rt && rt.devirNav) {
          if (cf) rt.asked = true;
          else if (rt.asked) {
            // the confirmation was answered: "ביטול" (the cloud still covers the devir) -> the slide's view from outside the devir
            rt.asked = false;
            if (cloudOn()) {
              cloudDenied = true;   // 1.0.1-L: not asked again in this run
              const r2 = pick(rt.s.out);
              if (r2) flyRes(r2);
            }
          }
        }
        const hidden = typeof document !== "undefined" && document.hidden;
        if (downPtrs.size) holdOn();   // tour-6: a pointer is still down (a long drag, a nav button held)
        const hold = paused || cf || hidden || (mode.key === "continuous" && now() < idleUntil);
        if (holdDemo && !paused && !(mode.key === "continuous" && now() < idleUntil)) {   // CAM_219: the hold is over - its demonstration goes on
          holdDemo = false;
          try { if (fnc(ctx.shared.demoPaused) && ctx.shared.demoPaused() && fnc(ctx.shared.demoResume)) ctx.shared.demoResume(); } catch (_) {}
        }
        showWait();
        if (tn - fitAt > 1000) {
          fitAt = tn;
          fitBox();   // the nav row may change (e.g. "החזר הכל" appears when a removal is on)
        }
        // 1.0.1-L (L.34): the explanation card stays closed while the tour runs; while the user himself paused it, a card he opened from the
        // panel may stay beside the panel (on a phone it would lie over the banner: closed)
        if (U.card && fnc(U.card.isOpen) && U.card.isOpen() && (!paused || narrow())) closeXCard();
        if (!hold) elapsed += dt;
        if (rt) animStep(rt);   // 1.0.1-L: (held too: the timeline stays at the same moment)
        if (hold) return;
        if (rt) {
          // TOUR_DEMO_HOLD_206 (the user, 12.11.2026 16:00: "כל מקום שיש הדגמה חייב להיות ארוך עד סוף ההדגמה"): ANY demonstration that
          // runs in a slide holds it - also one that a reading's choice or a feature of the slide started (until 2.0.5 only a place's
          // action, rt.act, did: the readings of the wickets and of the doors, and the base that brings the laver, were cut after ten
          // seconds). While it runs it leads the eye itself: no orbit, and the slide's further views wait; when it ends they come one
          // after the other, three seconds each; with none, its end rests two seconds.
          const demo = demoHolds(rt);
          if (demo) rt.demoSeen = true;
          else if (rt.demoSeen && rt.demoEnd == null) {
            rt.demoEnd = elapsed;
            const th = rt.s.then, n = th ? th.length - rt.thenI : 0;
            if (n > 0) {
              rt.thenAbs = [];
              for (let j = rt.thenI; j < th.length; j++) rt.thenAbs[j] = elapsed + 300 + (j - rt.thenI) * 3000;
              total = Math.max(total, elapsed + 300 + n * 3000);
            } else total = Math.max(total, elapsed + 2000);
          }
          if (!demo) {
            thenStep(rt);
            if (!rt.demoSeen) orbitStep(rt);   // (after a demonstration the eye stays where it left it)
          }
        }
        if (tn - progAt > 120 || elapsed >= total) {
          progAt = tn;
          bar.style.width = Math.min(100, elapsed / total * 100).toFixed(1) + "%";
        }
        if (elapsed >= total) {
          // 1.3.5 / 1.9.3: a demonstration that the slide started runs to its end first (two minutes more at most)
          if (rt && elapsed < total + 120000 * speed && demoHolds(rt)) return;   // TOUR_DEMO_HOLD_206: any demonstration, not only a place's action
          if (onlyIx) { const n = onlyIx.find((q) => q > idx); if (n != null) go(n, 1); else { onlyIx = null; setPaused(true); } return; }   // SEG_ONLY_420
          next();
        }
      });
      setBtn();
      openMenu(false);
      // ---- the API (tests, the integrator) ----
      const state = () => ({ running, paused, ended, mode: mode.key, idx, total: slides.length, title: slides[idx] ? slides[idx].title : "",
        waiting: confirmOpen(), idle: !!(running && mode.key === "continuous" && now() < idleUntil), round, speed, elapsed, slideMs: total });
      for (const k of ["running", "paused", "ended", "mode", "idx", "total", "title", "waiting", "idle", "round", "speed"]) {
        Object.defineProperty(state, k, { get: () => state()[k], enumerable: true });
      }
      // each slide's resolved target, without moving anything (for tests): fp / place, the feature, whether a fallback was used
      const plan = (key) => {
        const M = tour_MODES.find((m) => m.key === key) || tour_MODES[0];
        //@@slot plan.list
        return list.map((s, i) => {
          const base = { n: i + 1, kind: s.kind, title: s.title, sub: s.sub || "", group: s.group || "", part: s.part, bubble: !!s.bubble, ver: s.ver || null, anim: s.anim ? s.anim + (s.animW ? "+witnesses" : "") : null, chars: (s.text || "").length, refs: (s.refs || []).length };
          if (s.nofly) return Object.assign(base, { target: "nofly" });
          if (s.kind === "opinion") return Object.assign(base, { target: "row.fly(" + s.key + ")" });
          const r = pick(s.go);
          if (!r) return Object.assign(base, { target: "MISSING -> __general" });
          const c = r.c;
          return Object.assign(base, { target: c.fp ? "fp:" + c.fp : c.place ? "place:" + c.place : "pos", feature: c.f || null, layer: s.lay || c.lay || r.cam.layer || null,
            fallback: s.go.indexOf(c) > 0, pos: r.cam.pos, at: r.cam.target, devir: inDevir(r.cam.pos) || inDevir(r.cam.target) });
        });
      };
      ctx.shared.tour = {
        modes: tour_MODES.map((m) => ({ key: m.key, label: m.label, desc: m.desc })),
        start: (m, opts) => start(m, opts),
        stop: () => finish(true),
        next,
        prev,
        // 1.0.1-L: to a slide by its index, and to a moment of its timeline in seconds (tests, the integrator's pictures)
        goto: (i) => (running && i >= 0 && i < slides.length ? go(i, 1) : false),
        only: (list) => { onlyIx = Array.isArray(list) && list.length ? list.slice().sort((x, y) => x - y) : null; return !!onlyIx; },   // SEG_ONLY_420
        //@@slot retamid
        seek: (sec) => {
          if (!running || !cur || !cur.anim || !(sec >= 0)) return false;
          elapsed = (sec + tour_ANIM_LEAD) * 1000 * speed;
          return true;
        },
        pause: (p) => setPaused(p === undefined ? true : !!p),
        setSpeed,
        state,
        plan,
        get slides() {
          return slides;
        }
      };
    } catch (e) {
      if (typeof console !== "undefined") console.error("[tour.js]", e);
    }
  }
