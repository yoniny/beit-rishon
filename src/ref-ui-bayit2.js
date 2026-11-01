  // plugin/js/ui.js
  function makeLabelSprite(text, size) {
    const font = '600 48px "Segoe UI", Arial';
    const pad = 26;
    const cv = document.createElement("canvas");
    let c = cv.getContext("2d");
    c.font = font;
    const tw = Math.max(8, Math.ceil(c.measureText(text).width));
    cv.width = tw + pad * 2;
    cv.height = 48 + pad * 2;
    c = cv.getContext("2d");
    c.font = font;
    c.textAlign = "center";
    c.textBaseline = "middle";
    const cx = cv.width / 2, cy = cv.height / 2;
    c.fillStyle = "rgba(0,0,0,.85)";
    for (const o of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) c.fillText(text, cx + o[0], cy + o[1]);
    c.fillStyle = "#f3dc9a";
    c.fillText(text, cx, cy);
    const tex = new CanvasTexture(cv);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const spr = new Sprite(new SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: true,
      depthWrite: false
    }));
    const hAmot = (size || 4) * cv.height / 48;
    spr.scale.set(hAmot * cv.width / cv.height, hAmot, 1);
    return spr;
  }
  var GENERAL = { pos: [430, 190, 240], target: [0, 30, 0] };
  var VIEWS = [
    { key: "__general", label: "\u05DE\u05D1\u05D8 \u05DB\u05DC\u05DC\u05D9" },
    { key: "harHabayit", label: "\u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA" },
    { key: "shushanGate", label: "\u05E9\u05E2\u05E8 \u05E9\u05D5\u05E9\u05DF" },
    { key: "royalStoa", label: "\u05D4\u05E1\u05D8\u05D9\u05D5 \u05D4\u05DE\u05DC\u05DB\u05D5\u05EA\u05D9" },
    { key: "ezratNashim", label: "\u05E2\u05D6\u05E8\u05EA \u05E0\u05E9\u05D9\u05DD" },
    { key: "nikanor", label: "\u05E9\u05E2\u05E8 \u05E0\u05D9\u05E7\u05E0\u05D5\u05E8" },
    { key: "azarah", label: "\u05D4\u05E2\u05D6\u05E8\u05D4" },
    { key: "mizbeach", label: "\u05D4\u05DE\u05D6\u05D1\u05D7" },
    { key: "heichalFront", label: "\u05D4\u05D4\u05D9\u05DB\u05DC" },
    { key: "ulam", label: "\u05D4\u05D0\u05D5\u05DC\u05DD", interior: true },
    { key: "kodesh", label: "\u05D4\u05E7\u05D5\u05D3\u05E9", interior: true },
    { key: "kodeshHakodashim", label: "\u05E7\u05D5\u05D3\u05E9 \u05D4\u05E7\u05D3\u05E9\u05D9\u05DD", interior: true }
  ];
  var INFO = {
    __general: "\u05DE\u05D5\u05D3\u05DC \u05D1\u05D9\u05EA \u05D4\u05DE\u05E7\u05D3\u05E9 \u05D4\u05E9\u05E0\u05D9 \u05E2\u05DC \u05E4\u05D9 \u05DE\u05E1\u05DB\u05EA \u05DE\u05D9\u05D3\u05D5\u05EA, \u05D9\u05D5\u05E1\u05E3 \u05D1\u05DF \u05DE\u05EA\u05EA\u05D9\u05D4\u05D5 \u05D5\u05DE\u05D7\u05E7\u05E8 \u05D0\u05E8\u05DB\u05D9\u05D0\u05D5\u05DC\u05D5\u05D2\u05D9.",
    harHabayit: "\u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA \u2014 \u05D7\u05DE\u05E9 \u05DE\u05D0\u05D5\u05EA \u05D0\u05DE\u05D4 \u05E2\u05DC \u05D7\u05DE\u05E9 \u05DE\u05D0\u05D5\u05EA \u05D0\u05DE\u05D4 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D0). \u05E8\u05D5\u05D1 \u05D4\u05E9\u05D8\u05D7 \u05D4\u05E4\u05EA\u05D5\u05D7 \u05DE\u05DF \u05D4\u05D3\u05E8\u05D5\u05DD.",
    shushanGate: "\u05D4\u05E9\u05E2\u05E8 \u05D4\u05DE\u05D6\u05E8\u05D7\u05D9 \u05E9\u05DC \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA, \u05E9\u05E2\u05DC\u05D9\u05D5 \u05E6\u05D5\u05E8\u05EA \u05E9\u05D5\u05E9\u05DF \u05D4\u05D1\u05D9\u05E8\u05D4 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D2). \u05DB\u05D5\u05EA\u05DC \u05D4\u05DE\u05D6\u05E8\u05D7 \u05D4\u05D9\u05D4 \u05E0\u05DE\u05D5\u05DA \u05DE\u05E9\u05D0\u05E8 \u05D4\u05DB\u05EA\u05DC\u05D9\u05DD, \u05DB\u05D3\u05D9 \u05E9\u05D4\u05DB\u05D4\u05DF \u05D4\u05E9\u05D5\u05E8\u05E3 \u05D0\u05EA \u05D4\u05E4\u05E8\u05D4 \u05D9\u05E8\u05D0\u05D4 \u05DE\u05D4\u05E8 \u05D4\u05DE\u05E9\u05D7\u05D4 \u05D0\u05EA \u05E4\u05EA\u05D7 \u05D4\u05D4\u05D9\u05DB\u05DC (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D3).",
    royalStoa: "\u05D4\u05E1\u05D8\u05D9\u05D5 \u05D4\u05DE\u05DC\u05DB\u05D5\u05EA\u05D9 \u05E9\u05D1\u05E0\u05D4 \u05D4\u05D5\u05E8\u05D3\u05D5\u05E1 \u05D1\u05D3\u05E8\u05D5\u05DD \u05D4\u05D4\u05E8 \u2014 \u05D1\u05D6\u05D9\u05DC\u05D9\u05E7\u05D4 \u05D1\u05EA \u05D0\u05E8\u05D1\u05E2 \u05E9\u05D5\u05E8\u05D5\u05EA \u05E9\u05DC \u05E2\u05DE\u05D5\u05D3\u05D9\u05DD (\u05E7\u05D3\u05DE\u05D5\u05E0\u05D9\u05D5\u05EA \u05D8\u05D5).",
    ezratNashim: "\u05DE\u05D0\u05D4 \u05E9\u05DC\u05D5\u05E9\u05D9\u05DD \u05D5\u05D7\u05DE\u05E9 \u05E2\u05DC \u05DE\u05D0\u05D4 \u05E9\u05DC\u05D5\u05E9\u05D9\u05DD \u05D5\u05D7\u05DE\u05E9, \u05D5\u05D0\u05E8\u05D1\u05E2 \u05DC\u05E9\u05DB\u05D5\u05EA \u05D1\u05D0\u05E8\u05D1\u05E2 \u05DE\u05E7\u05E6\u05D5\u05E2\u05D5\u05EA\u05D9\u05D4 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D4).",
    nikanor: "\u05E9\u05E2\u05E8\u05D9 \u05E0\u05D7\u05D5\u05E9\u05EA \u05E7\u05DC\u05DC \u05E9\u05D4\u05D1\u05D9\u05D0 \u05E0\u05D9\u05E7\u05E0\u05D5\u05E8 \u05DE\u05D0\u05DC\u05DB\u05E1\u05E0\u05D3\u05E8\u05D9\u05D4, \u05D5\u05E0\u05E2\u05E9\u05D5 \u05D1\u05D4\u05DD \u05E0\u05E1\u05D9\u05DD (\u05D9\u05D5\u05DE\u05D0 \u05DC\u05D7).",
    azarah: "\u05D4\u05E2\u05D6\u05E8\u05D4 \u2014 \u05DE\u05D0\u05D4 \u05E9\u05DE\u05D5\u05E0\u05D9\u05DD \u05D5\u05E9\u05D1\u05E2 \u05E2\u05DC \u05DE\u05D0\u05D4 \u05E9\u05DC\u05D5\u05E9\u05D9\u05DD \u05D5\u05D7\u05DE\u05E9 \u05D0\u05DE\u05D4 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D4, \u05D0). \u05D1\u05D4 \u05E2\u05D6\u05E8\u05EA \u05D9\u05E9\u05E8\u05D0\u05DC \u05D5\u05E2\u05D6\u05E8\u05EA \u05D4\u05DB\u05D4\u05E0\u05D9\u05DD.",
    mizbeach: "\u05DE\u05D6\u05D1\u05D7 \u05D4\u05E2\u05D5\u05DC\u05D4 \u2014 \u05E9\u05DC\u05D5\u05E9\u05D9\u05DD \u05D5\u05E9\u05EA\u05D9\u05D9\u05DD \u05E2\u05DC \u05E9\u05DC\u05D5\u05E9\u05D9\u05DD \u05D5\u05E9\u05EA\u05D9\u05D9\u05DD \u05D0\u05DE\u05D4 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D0). \u05D4\u05E7\u05D5 \u05D4\u05D0\u05D3\u05D5\u05DD \u2014 \u05D7\u05D5\u05D8 \u05D4\u05E1\u05E7\u05E8\u05D0.",
    heichalFront: "\u05DE\u05D0\u05D4 \u05E2\u05DC \u05DE\u05D0\u05D4 \u05E2\u05DC \u05E8\u05D5\u05DD \u05DE\u05D0\u05D4 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D3, \u05D5). \u05E6\u05E8 \u05DE\u05D0\u05D7\u05D5\u05E8\u05D9\u05D5 \u05D5\u05E8\u05D7\u05D1 \u05DE\u05DC\u05E4\u05E0\u05D9\u05D5 \u2014 \u05D3\u05D5\u05DE\u05D4 \u05DC\u05D0\u05E8\u05D9.",
    ulam: "\u05D4\u05D0\u05D5\u05DC\u05DD \u2014 \u05E8\u05D5\u05D7\u05D1\u05D5 \u05DE\u05D0\u05D4 \u05D0\u05DE\u05D4 \u05D5\u05E8\u05D5\u05DE\u05D5 \u05DE\u05D0\u05D4 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D3, \u05D6). \u05DE\u05E2\u05DC \u05E4\u05EA\u05D7\u05D5 \u05D2\u05E4\u05DF \u05E9\u05DC \u05D6\u05D4\u05D1.",
    kodesh: "\u05D4\u05E7\u05D5\u05D3\u05E9 \u2014 \u05D0\u05E8\u05D1\u05E2\u05D9\u05DD \u05D0\u05DE\u05D4 \u05D0\u05D5\u05E8\u05DB\u05D5, \u05D5\u05D1\u05D5 \u05D4\u05DE\u05E0\u05D5\u05E8\u05D4 \u05D1\u05D3\u05E8\u05D5\u05DD, \u05D4\u05E9\u05D5\u05DC\u05D7\u05DF \u05D1\u05E6\u05E4\u05D5\u05DF \u05D5\u05DE\u05D6\u05D1\u05D7 \u05D4\u05D6\u05D4\u05D1 \u05D1\u05D0\u05DE\u05E6\u05E2 (\u05D9\u05D5\u05DE\u05D0 \u05DC\u05D2).",
    kodeshHakodashim: "\u05DC\u05E4\u05E0\u05D9 \u05D5\u05DC\u05E4\u05E0\u05D9\u05DD. \u05D1\u05D1\u05D9\u05EA \u05E9\u05E0\u05D9 \u05DC\u05D0 \u05D4\u05D9\u05D4 \u05D1\u05D5 \u05D0\u05E8\u05D5\u05DF \u2014 \u05D0\u05D1\u05DF \u05D4\u05E9\u05EA\u05D9\u05D9\u05D4 \u05D1\u05DC\u05D1\u05D3 (\u05D9\u05D5\u05DE\u05D0 \u05D4, \u05D1)."
  };
  var CSS = `
#tm-burger{position:fixed;top:5px;right:10px;left:auto;z-index:31;width:34px;height:34px;border-radius:50%;
  background:rgba(12,16,24,.82);border:1px solid rgba(201,168,76,.45);color:#e8c96a;font-size:18px;
  cursor:pointer;backdrop-filter:blur(6px);line-height:1;display:flex;align-items:center;justify-content:center}
#tm-burger:hover{background:rgba(30,36,48,.9)}
#tm-panel{position:fixed;top:56px;right:12px;z-index:30;width:218px;max-height:calc(100vh - 72px);overflow-y:auto;
  direction:rtl;text-align:right;background:rgba(12,16,24,.82);border:1px solid rgba(201,168,76,.45);
  border-radius:12px;backdrop-filter:blur(8px);color:#e8dcae;
  font:13px 'Segoe UI',Arial,sans-serif;padding:12px 14px;box-sizing:border-box}
#tm-panel .t{font-size:17px;font-weight:600;color:#f3dc9a}
#tm-panel .s{font-size:11px;color:#b9ac82;margin-bottom:8px}
#tm-panel .sec{font-size:12px;font-weight:600;color:#c9a84c;margin:10px 0 5px;
  border-bottom:1px solid rgba(201,168,76,.25);padding-bottom:2px}
#tm-views{display:grid;grid-template-columns:1fr 1fr;gap:5px}
#tm-pl-sec{margin-top:8px}
details.tm-pl{margin-top:6px;border-top:1px solid rgba(201,168,76,.2);padding-top:4px}
details.tm-pl summary{cursor:pointer;font-size:12px;font-weight:600;color:#c9a84c;padding:3px 0}
details.tm-pl div{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:5px 0}
details.tm-pl button,#tm-views button{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.32);color:#e8dcae;
  border-radius:6px;padding:5px 3px;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer}
#tm-views button:hover,details.tm-pl button:hover{background:rgba(201,168,76,.28)}
#tm-views button.on,details.tm-pl button.on{background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.7)}
#tm-panel label.row{display:flex;align-items:center;gap:7px;margin:5px 0;cursor:pointer;user-select:none}
#tm-panel label.row input{accent-color:#c9a84c;margin:0}
#tm-info{margin-top:10px;padding:8px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);
  border-radius:8px;font-size:12px;line-height:1.55;color:#ddd2a8;min-height:44px}
#tm-refs{margin-top:6px;font-size:11px}
#tm-refs a{display:inline-block;color:#f3dc9a;margin:3px 0 3px 6px;padding:4px 9px;font-size:12px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer;position:relative;z-index:1}
#tm-refs a:hover{background:rgba(201,168,76,.3)}
#tm-units{margin-top:8px;font-size:10.5px;line-height:1.5;color:#b9ad84}
#tm-foot{margin-top:8px;font-size:10px;color:#9a8f6c;text-align:center}
#tm-nav{position:fixed;bottom:14px;left:68px;z-index:30;display:flex;gap:4px;align-items:center}
#tm-nav button{width:26px;height:26px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(12,16,24,.75);color:#e8dcae;font-size:14px;line-height:1;cursor:pointer;backdrop-filter:blur(6px);touch-action:none;user-select:none;-webkit-user-select:none}
#tm-nav button:hover{background:rgba(201,168,76,.28)}
#tm-nav button.on{background:rgba(201,168,76,.55);color:#14110a}
#tm-nav .sp{width:5px}
#tm-measure-out{position:fixed;bottom:52px;left:50%;transform:translateX(-50%);z-index:31;background:rgba(12,16,24,.9);border:1px solid rgba(201,168,76,.5);color:#f3dc9a;padding:6px 12px;border-radius:8px;font-size:12px;display:none;direction:rtl;text-align:center;pointer-events:none;max-width:92vw}
body.tm-measuring canvas{cursor:crosshair}
#tm-cloud-btn{position:fixed;z-index:29;display:none;transform:translate(-50%,-50%);padding:4px 10px;border-radius:14px;border:1px solid rgba(201,168,76,.6);background:rgba(12,16,24,.82);color:#f3dc9a;font-size:12px;cursor:pointer}
#tm-cloud-btn:hover{background:rgba(201,168,76,.35)}
#tm-confirm{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;direction:rtl}
#tm-confirm .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:16px 18px;max-width:340px;color:#e8dcae;text-align:center;line-height:1.6}
#tm-confirm .t{font-weight:700;color:#f3dc9a;margin-bottom:6px}
#tm-confirm .b{display:flex;gap:8px;justify-content:center;margin-top:12px}
#tm-confirm button{padding:6px 14px;border-radius:8px;border:1px solid rgba(201,168,76,.55);background:rgba(201,168,76,.18);color:#f3dc9a;cursor:pointer;font-size:13px}
#tm-confirm button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-compass{position:fixed;bottom:14px;left:14px;z-index:30;width:46px;height:46px;border-radius:50%;
  background:rgba(12,16,24,.75);border:1px solid rgba(201,168,76,.45);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;pointer-events:none}
#tm-rotor{display:flex;flex-direction:column;align-items:center;line-height:1;will-change:transform}
#tm-rotor .a{color:#e2544a;font-size:14px}
#tm-rotor .n{color:#e8dcae;font-size:11px;font-weight:600;margin-top:1px}
`;
  async function build5(ctx2) {
    try {
      let setCutaway = function(on) {
        cutOn = !!on;
        for (const m of Array.isArray(ctx2.cutaway) ? ctx2.cutaway : []) {
          if (m) m.visible = !cutOn;
        }
        for (const m of Array.isArray(ctx2.interiorOnly) ? ctx2.interiorOnly : []) {
          if (m) m.visible = cutOn;
        }
        if (cutBox) cutBox.checked = cutOn;
      }, toggleRow = function(text, checked, onChange) {
        const lab = document.createElement("label");
        lab.className = "row";
        const inp = document.createElement("input");
        inp.type = "checkbox";
        inp.checked = !!checked;
        inp.addEventListener("change", () => {
          try {
            onChange(inp.checked);
          } catch (_) {
          }
        });
        const span = document.createElement("span");
        span.textContent = text;
        lab.appendChild(inp);
        lab.appendChild(span);
        panel.appendChild(lab);
        return inp;
      };
      const labelGroup = new Group();
      labelGroup.name = "labels";
      for (const l of Array.isArray(ctx2.labels) ? ctx2.labels : []) {
        try {
          if (!l || !l.text) continue;
          const spr = makeLabelSprite(String(l.text), l.size);
          spr.position.set(l.x || 0, l.y || 0, l.z || 0);
          labelGroup.add(spr);
        } catch (_) {
        }
      }
      if (ctx2.root && ctx2.root.add) ctx2.root.add(labelGroup);
      for (const spr of labelGroup.children) spr.userData.base = spr.scale.clone();
      ctx2.animated.push(function() {
        const cp = ctx2.camera.position;
        for (const spr of labelGroup.children) {
          const d = cp.distanceTo(spr.position);
          const sz = spr.userData.base.y;
          const k = Math.min(1.5, Math.max(0.3, d / 170));
          spr.scale.set(spr.userData.base.x * k, spr.userData.base.y * k, 1);
          spr.visible = d < (sz > 18 ? 1800 : sz > 11 ? 700 : 330);
        }
      });
      if (!ctx2.shared.fadeState) ctx2.shared.fadeState = { on: true };
      {
        const FADE_DIST = 120; // 1.0.19: a wall fades only when it is within this many amot of the camera (1.0.17: 40 was too short, 1.0.16 and before: unlimited)
        const OCCL = ctx2.H.OCC, ray = new Raycaster(), fs = ctx2.shared.fadeState;
        const dir = new Vector3(), right = new Vector3(), upv = new Vector3(), to = new Vector3(), dd = new Vector3();
        let last = -1e9;
        ctx2.animated.push(function(t) {
          if (t - last > 140) {
            last = t;
            const blocked = /* @__PURE__ */ new Set();
            if (fs.on) {
              const cam = ctx2.camera.position, tg = ctx2.controls.target;
              dir.subVectors(tg, cam).normalize();
              right.crossVectors(dir, ctx2.camera.up).normalize();
              upv.crossVectors(right, dir).normalize();
              for (const [ox, oy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
                to.copy(tg).addScaledVector(right, ox * 20).addScaledVector(upv, oy * 16);
                dd.subVectors(to, cam);
                const L = dd.length();
                ray.set(cam, dd.normalize());
                ray.near = 0;
                ray.far = Math.min(L - 1, FADE_DIST);
                for (const h of ray.intersectObjects(OCCL, false)) blocked.add(h.object);
              }
              // 1.0.16: a wall right in front of the camera (within NEAR amot along the view direction) fades too,
              // even when the orbit target is on this side of it / on the wall itself (e.g. close to the Shushan gate).
              const NEAR = FADE_DIST;
              for (const [ox, oy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
                to.copy(cam).addScaledVector(dir, NEAR).addScaledVector(right, ox * 8).addScaledVector(upv, oy * 6);
                dd.subVectors(to, cam);
                ray.set(cam, dd.normalize());
                ray.near = 0;
                ray.far = NEAR + 2;
                for (const h of ray.intersectObjects(OCCL, false)) blocked.add(h.object);
              }
            }
            for (const m of OCCL) m.userData.fade.tgt = blocked.has(m) ? 0.1 : 1;
            for (const m of OCCL) {
              const fw = m.userData.fadeWith;
              if (fw && blocked.has(fw)) m.userData.fade.tgt = 0.1;
            }
          }
          for (const m of OCCL) {
            const f = m.userData.fade;
            if (Math.abs(f.cur - f.tgt) < 4e-3) continue;
            f.cur += (f.tgt - f.cur) * 0.2;
            const mat = m.material, tr = f.cur < 0.99;
            if (mat.transparent !== tr) {
              mat.transparent = tr;
              mat.depthWrite = !tr;
              mat.needsUpdate = true;
            }
            mat.opacity = f.cur;
          }
        });
      }
      window.__TM_CTX = ctx2; // debug hook for DEV/tests (labels, camera, controls)
      let cutOn = false;
      let autoCut = false;
      let cutBox = null;
      setCutaway(false);
      const style = document.createElement("style");
      style.textContent = CSS;
      document.head.appendChild(style);
      const burger = document.createElement("button");
      burger.id = "tm-burger";
      burger.textContent = "\u2715";
      burger.title = "\u05D4\u05E6\u05D2/\u05D4\u05E1\u05EA\u05E8 \u05DC\u05D5\u05D7 \u05D1\u05E7\u05E8\u05D4";
      document.body.appendChild(burger);
      const panel = document.createElement("div");
      panel.id = "tm-panel";
      document.body.appendChild(panel);
      const title = document.createElement("div");
      title.className = "t";
      title.textContent = "\u05D1\u05D9\u05EA \u05D4\u05DE\u05E7\u05D3\u05E9 \u05D4\u05E9\u05E0\u05D9";
      const sub = document.createElement("div");
      sub.className = "s";
      sub.textContent = "\u05E2\u05DC \u05E4\u05D9 \u05DE\u05E1\u05DB\u05EA \u05DE\u05D9\u05D3\u05D5\u05EA";
      panel.appendChild(title);
      panel.appendChild(sub);
      burger.addEventListener("click", () => {
        const hidden = panel.style.display === "none";
        panel.style.display = hidden ? "" : "none";
        burger.textContent = hidden ? "\u2715" : "\u2630";
      });
      if (window.innerWidth < 640) {
        panel.style.display = "none";
        burger.textContent = "\u2630";
      }
      const infoBox = document.createElement("div");
      infoBox.id = "tm-info";
      const REFS = {"__general":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0\u2013\u05D4","Mishnah_Middot"]],"harHabayit":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D0","Mishnah_Middot.2.1"],["\u05D0, \u05D2","Mishnah_Middot.1.3"]],"shushanGate":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D2","Mishnah_Middot.1.3"],["\u05D1, \u05D3","Mishnah_Middot.2.4"]],"royalStoa":[],"ezratNashim":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D4","Mishnah_Middot.2.5"],["\u05D1, \u05D2","Mishnah_Middot.2.3"]],"nikanor":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D3","Mishnah_Middot.1.4"]],"azarah":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D5","Mishnah_Middot.2.6"]],"mizbeach":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D0","Mishnah_Middot.3.1"]],"heichalFront":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05E4\u05E8\u05E7 \u05D3","Mishnah_Middot.4"]],"ulam":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05E4\u05E8\u05E7 \u05D2","Mishnah_Middot.3"]],"kodesh":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05E4\u05E8\u05E7 \u05D3","Mishnah_Middot.4"]],"kodeshHakodashim":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05E4\u05E8\u05E7 \u05D3","Mishnah_Middot.4"]]};
      const HEB_REF = { "Mishnah_Middot": "\u05DE\u05E9\u05E0\u05D4 \u05DE\u05D9\u05D3\u05D5\u05EA" };
      // Open a source inside Otzaria (reader.openBookAtRef, permission "reader.open"), fall back to Sefaria.
      // Middot = Otzaria book id 89 (otzaria://open/book/89). Sefaria-style ref "Mishnah_Middot.2.3" -> chapter 2, mishnah 3 -> ref "ב:ג".
      const MIDDOT_BOOK_ID = 89;
      const hebNum = (n) => {
        const L = ["", "\u05D0", "\u05D1", "\u05D2", "\u05D3", "\u05D4", "\u05D5", "\u05D6", "\u05D7", "\u05D8"];
        return L[n] || String(n);
      };
      const otzariaRefs = (ref) => {
        const mm = /^Mishnah_Middot(?:\.(\d+))?(?:\.(\d+))?$/.exec(ref);
        if (!mm || !mm[1]) return [];
        const ch = hebNum(+mm[1]);
        const out = [];
        if (mm[2]) out.push(ch + ":" + hebNum(+mm[2]));
        out.push("\u05E4\u05E8\u05E7 " + ch);
        return out;
      };
      const tmToast = (msg) => {
        const t = document.getElementById("toast");
        if (!t) return;
        t.textContent = msg;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 6000);
      };
      const errText = (res) => {
        if (res && res.error) return (res.error.code || "") + (res.error.message ? " \u2013 " + res.error.message : "");
        return "no result (" + JSON.stringify(res) + ")";
      };
      const okRes = (res) => !!res && res.success !== false && res.data !== false && res.data !== null && res.data !== undefined;
      const callT = (method, params, ms) => Promise.race([
        window.Otzaria.call(method, params),
        new Promise((resolve) => setTimeout(() => resolve({ success: false, error: { code: "timeout", message: method + " >" + (ms || 5000) + "ms" } }), ms || 5000))
      ]);
      // After a successful open, make sure the Middot tab is the active one (the API docs do not promise that it is).
      const focusBook = async () => {
        try {
          const st = await callT("reader.getCurrentState", {}, 3000);
          const d = st && st.data;
          if (!d || !Array.isArray(d.openTabs)) return;
          if (d.currentId === MIDDOT_BOOK_ID || d.currentBookUid === "id:" + MIDDOT_BOOK_ID) return;
          const i = d.openTabs.findIndex((t) => t && !t.isSelf && (t.id === MIDDOT_BOOK_ID || t.bookUid === "id:" + MIDDOT_BOOK_ID));
          if (i >= 0) await callT("reader.activateTab", { index: i }, 3000);
        } catch (_) {
        }
      };
      // Resolve the Middot position through Otzaria's own ref engine (library.resolveRef, permission library.books.read),
      // then open by bookUid+index. (1.0.10 opened by numeric id 89 and got data:false.)
      const resolveMiddot = async (queries) => {
        for (const q of queries) {
          const r = await callT("library.resolveRef", { ref: q, limit: 5 });
          if (r && r.success !== false && Array.isArray(r.data)) {
            const hit = r.data.find((h) => h && !h.isPdf && /\u05DE\u05D9\u05D3\u05D5\u05EA/.test(h.title || h.bookId || ""));
            if (hit) return hit;
          }
        }
        return null;
      };
      // Middot in Otzaria = book 89 (otzaria://open/book/89?index=N). Line index of the chapter heading per chapter;
      // mishnah m of chapter c is line MIDDOT_BASE[c] + m (verified against the exact links the user supplied:
      // 1:1=2, 1:2=3, 2:1=12, 2:3=14, 2:6=17, 3:3=21, 4:2=29, 5:1=36, 5:2=37; chapters have 9, 6, 8, 7, 4 mishnayot).
      const MIDDOT_BASE = { 1: 1, 2: 11, 3: 18, 4: 27, 5: 35 };
      const MIDDOT_COUNT = { 1: 9, 2: 6, 3: 8, 4: 7, 5: 4 };
      const middotIndex = (ref) => {
        const mm = /^Mishnah_Middot(?:\.(\d+))?(?:\.(\d+))?$/.exec(ref);
        if (!mm) return null;
        if (!mm[1]) return 0;
        const c = +mm[1];
        if (!MIDDOT_BASE[c]) return null;
        return MIDDOT_BASE[c] + (mm[2] ? Math.min(+mm[2], MIDDOT_COUNT[c]) : 0);
      };
      let middotId = null;
      const openMiddotAt = async (index) => {
        const tries = [];
        if (middotId) tries.push(middotId);
        tries.push({ bookUid: "id:" + MIDDOT_BOOK_ID }, { id: MIDDOT_BOOK_ID, type: "text" }, { id: MIDDOT_BOOK_ID, source: "library" });
        let last = "";
        for (const idf of tries) {
          const res = await callT("reader.openBook", Object.assign({}, idf, { index }));
          if (okRes(res)) { middotId = idf; return ""; }
          last = JSON.stringify(idf) + ": " + errText(res);
        }
        const md = await callT("library.getBookMetadata", { id: MIDDOT_BOOK_ID });
        const d = md && md.data;
        if (d && (d.bookUid || d.bookId)) {
          const idf = d.bookUid ? { bookUid: d.bookUid } : { bookId: d.bookId };
          const res = await callT("reader.openBook", Object.assign({}, idf, { index }));
          if (okRes(res)) { middotId = idf; return ""; }
          last = "metadata " + JSON.stringify(idf) + ": " + errText(res);
        } else {
          last += " | getBookMetadata: " + errText(md);
        }
        return last;
      };
      const openSource = async (ev, label, ref) => {
        ev.preventDefault();
        ev.stopPropagation();
        const url = "https://www.sefaria.org.il/" + ref + "?lang=he";
        const idx = middotIndex(ref);
        let lastErr = "";
        tmToast("\u05E4\u05D5\u05EA\u05D7 \u05D1\u05D0\u05D5\u05E6\u05E8\u05D9\u05D0: " + label + "...");
        try {
          if (idx === null) {
            lastErr = "no index for " + ref;
          } else if (typeof window.Otzaria === "undefined" || !window.Otzaria.call) {
            lastErr = "Otzaria API missing";
          } else {
            lastErr = await openMiddotAt(idx);
            if (!lastErr) {
              await focusBook();
              tmToast("\u05E0\u05E4\u05EA\u05D7 \u05D1\u05D0\u05D5\u05E6\u05E8\u05D9\u05D0: " + label);
              return;
            }
          }
        } catch (e) {
          lastErr = "exception: " + (e && e.message ? e.message : e);
        }
        tmToast("\u05E4\u05EA\u05D9\u05D7\u05D4 \u05D1\u05D0\u05D5\u05E6\u05E8\u05D9\u05D0 \u05E0\u05DB\u05E9\u05DC\u05D4: " + lastErr);
        setTimeout(() => window.open(url, "_blank"), 2500);
      };
      const setInfo = (key, custom) => {
        infoBox.textContent = custom ? custom.text : INFO[key] || INFO.__general;
        const rs = custom ? custom.refs || [] : REFS[key] || REFS.__general || [];
        if (!rs.length) return;
        const row = document.createElement("div");
        row.id = "tm-refs";
        row.appendChild(document.createTextNode("\u05DC\u05DE\u05E7\u05D5\u05E8: "));
        for (const [label, ref] of rs) {
          const a = document.createElement("a");
          a.href = "https://www.sefaria.org.il/" + ref + "?lang=he";
          a.target = "_blank";
          a.rel = "noopener";
          a.addEventListener("click", (ev) => openSource(ev, label, ref));
          a.textContent = label;
          row.appendChild(a);
        }
        infoBox.appendChild(row);
      };
      setInfo("__general");
      const secViews = document.createElement("div");
      secViews.className = "sec";
      secViews.textContent = "\u05DE\u05D1\u05D8\u05D9\u05DD";
      panel.appendChild(secViews);
      const grid = document.createElement("div");
      grid.id = "tm-views";
      panel.appendChild(grid);

      // ===== Holy of Holies: cloud + confirmation before it is revealed =====
      const T3 = ctx2.THREE, KKF = ctx2.LV.HEI;
      const KKC = { x: -55.5, y: KKF + 20, z: 0 };
      const cloud = new T3.Group();
      cloud.name = "tm-kk-cloud";
      ctx2.root.add(cloud);
      const cloudMat = new T3.MeshLambertMaterial({ color: 15856631, emissive: 5593704, transparent: true, opacity: 0.96 });
      const cloudGeo = new T3.IcosahedronGeometry(1, 3);
      {
        let seed = 7;
        const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
        for (let i = 0; i < 54; i++) {
          const pf = new T3.Mesh(cloudGeo, cloudMat);
          const r = 5.5 + rnd() * 3.5;
          pf.scale.set(r * 1.15, r * 0.9, r * 1.15);
          pf.position.set(KKC.x + (rnd() - 0.5) * 26, KKF + 1 + rnd() * 40, KKC.z + (rnd() - 0.5) * 26);
          pf.userData.noPick = true;
          pf.userData.base = pf.position.clone();
          pf.userData.ph = rnd() * 6.28;
          cloud.add(pf);
        }
      }
      let cloudOn = true, cloudTarget = 0.96, cloudSeenNear = false, cloudRow = null;
      const setCloud = (on) => {
        cloudOn = on;
        cloudTarget = on ? 0.96 : 0;
        if (on) cloud.visible = true;
        else cloudSeenNear = false;
        if (cloudRow) cloudRow.checked = on;
      };
      const inKK = (p) => p && p[0] > -70 && p[0] < -41 && p[2] > -13 && p[2] < 13 && p[1] > 18 && p[1] < 68;
      const cf = document.createElement("div");
      cf.id = "tm-confirm";
      cf.innerHTML = '<div class="box"><div class="t">\u05E7\u05D5\u05D3\u05E9 \u05D4\u05E7\u05D3\u05E9\u05D9\u05DD</div><div class="m">\u05E7\u05D5\u05D3\u05E9 \u05D4\u05E7\u05D3\u05E9\u05D9\u05DD \u05DE\u05DB\u05D5\u05E1\u05D4 \u05D1\u05E2\u05E0\u05DF \u05DE\u05E4\u05E0\u05D9 \u05DB\u05D1\u05D5\u05D3 \u05D4\u05DE\u05E7\u05D5\u05DD. \u05DC\u05D4\u05E1\u05D9\u05E8 \u05D0\u05EA \u05D4\u05E2\u05E0\u05DF \u05D5\u05DC\u05D4\u05E6\u05D9\u05D2 \u05D0\u05EA \u05E4\u05E0\u05D9\u05DD \u05D4\u05D7\u05D3\u05E8?</div><div class="b"><button class="y">\u05D4\u05E1\u05E8 \u05D0\u05EA \u05D4\u05E2\u05E0\u05DF</button><button class="n">\u05D1\u05D9\u05D8\u05D5\u05DC</button></div></div>';
      document.body.appendChild(cf);
      let cfYes = null, cfNo = null;
      const closeConfirm = () => { cf.style.display = "none"; cfYes = cfNo = null; };
      cf.querySelector(".y").addEventListener("click", () => { const f = cfYes; closeConfirm(); if (f) f(); });
      cf.querySelector(".n").addEventListener("click", () => { const f = cfNo; closeConfirm(); if (f) f(); });
      const askRemoveCloud = (onYes, onNo) => { cfYes = onYes; cfNo = onNo || null; cf.style.display = "flex"; };
      const cloudBtn = document.createElement("button");
      cloudBtn.id = "tm-cloud-btn";
      cloudBtn.type = "button";
      cloudBtn.textContent = "\u2601 \u05D4\u05E1\u05E8 \u05E2\u05E0\u05DF";
      cloudBtn.addEventListener("click", () => askRemoveCloud(() => setCloud(false)));
      document.body.appendChild(cloudBtn);
      {
        const cv = new T3.Vector3();
        // 1.0.19: the "remove cloud" button must appear only while the cloud is really seen: besides its size on screen we now
        // cast a ray from the camera to the cloud centre and hide the button when a visible, not-faded solid is in the way
        // (e.g. standing at the Nikanor gate: the Heichal walls hide the cloud). Throttled; targets are cached for a few seconds.
        const cRay = new T3.Raycaster(), cDir = new T3.Vector3();
        let cTargets = null, cTargetsAt = 0, cFrame = 0, cClear = true;
        const underCloud = (o) => { for (; o; o = o.parent) if (o === cloud || o.name === "tm-measure") return true; return false; };
        const isVis = (o) => { for (; o; o = o.parent) if (o.visible === false) return false; return true; };
        const solidEnough = (o) => {
          const m = Array.isArray(o.material) ? o.material[0] : o.material;
          return !m || m.visible === false || (m.transparent ? m.opacity > 0.5 : true);
        };
        const cloudClear = (cam, d) => {
          const now = performance.now();
          if (!cTargets || now - cTargetsAt > 4000) {
            cTargets = [];
            cTargetsAt = now;
            ctx2.scene.traverse((o) => {
              if (!(o.isMesh || o.isInstancedMesh) || !o.geometry || underCloud(o)) return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (pa && pa.count > 30000) return; // skip the terrain: it never hides the cloud
              cTargets.push(o);
            });
          }
          cDir.set(KKC.x - cam.x, KKC.y - cam.y, KKC.z - cam.z).normalize();
          cRay.set(cam, cDir);
          cRay.near = 0;
          cRay.far = Math.max(1, d - 3);
          for (const h of cRay.intersectObjects(cTargets, false)) {
            if (isVis(h.object) && solidEnough(h.object)) return false;
          }
          return true;
        };
        ctx2.animated.push(function(t) {
          const cam = ctx2.camera.position;
          const dist = Math.hypot(cam.x - KKC.x, cam.y - KKC.y, cam.z - KKC.z);
          const k = 0.0004 * t;
          cloud.children.forEach((pf) => {
            const b = pf.userData.base, ph = pf.userData.ph;
            pf.position.set(b.x + Math.sin(k + ph) * 0.7, b.y + Math.cos(k * 0.8 + ph) * 0.5, b.z + Math.sin(k * 0.6 + ph * 1.3) * 0.7);
          });
          if (Math.abs(cloudMat.opacity - cloudTarget) > 4e-3) cloudMat.opacity += (cloudTarget - cloudMat.opacity) * 0.08;
          if (!cloudOn && cloudMat.opacity < 0.03) cloud.visible = false;
          if (!cloudOn) {
            if (dist < 60) cloudSeenNear = true;
            else if (cloudSeenNear && dist > 85) setCloud(true);
          }
          let show = false;
          // 1.0.17: the button appears only while the cloud is actually seen at a reasonable size on screen,
          // and its size is proportional to the cloud's apparent size (clamped).
          if (cloudOn && cloud.visible && cloudMat.opacity > 0.3) {
            cv.set(KKC.x, KKC.y, KKC.z).project(ctx2.camera);
            const fovT = Math.tan((ctx2.camera.fov || 50) * Math.PI / 360);
            const cloudPx = 44 / (2 * Math.max(1, dist) * fovT) * window.innerHeight; // cloud is ~44 amot tall
            if (cv.z < 1 && Math.abs(cv.x) < 0.95 && Math.abs(cv.y) < 0.95 && cloudPx >= 90) {
              if ((cFrame++ & 7) === 0) { try { cClear = cloudClear(cam, dist); } catch (_) { cClear = false; } }
            } else {
              cClear = false;
            }
            if (cClear && cv.z < 1 && Math.abs(cv.x) < 0.95 && Math.abs(cv.y) < 0.95 && cloudPx >= 90) {
              cloudBtn.style.left = ((cv.x * 0.5 + 0.5) * window.innerWidth).toFixed(0) + "px";
              cloudBtn.style.top = ((-cv.y * 0.5 + 0.5) * window.innerHeight).toFixed(0) + "px";
              const sc = Math.min(1.6, Math.max(0.7, cloudPx / 420));
              cloudBtn.style.transform = "translate(-50%,-50%) scale(" + sc.toFixed(2) + ")";
              show = true;
            }
          }
          cloudBtn.style.display = show ? "block" : "none";
        });
      }

      // ===== measuring tool: click two points on the model =====
      const mGroup = new T3.Group();
      mGroup.name = "tm-measure";
      ctx2.scene.add(mGroup);
      const mOut = document.createElement("div");
      mOut.id = "tm-measure-out";
      document.body.appendChild(mOut);
      let mOn = false, mPts = [];
      const mRay = new T3.Raycaster(), mNdc = new T3.Vector2();
      const mClear = () => {
        while (mGroup.children.length) {
          const c = mGroup.children.pop();
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        }
        mPts = [];
      };
      const mSay = (txt) => { mOut.textContent = txt; mOut.style.display = txt ? "block" : "none"; };
      const mPick = (ev) => {
        const el = ctx2.renderer.domElement, r = el.getBoundingClientRect();
        mNdc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
        mRay.setFromCamera(mNdc, ctx2.camera);
        for (const h of mRay.intersectObjects(ctx2.root.children, true)) {
          const o = h.object;
          if (o.isSprite || o.isLine || o.isPoints || o.userData.noPick) continue;
          let vis = true;
          for (let p = o; p; p = p.parent) if (!p.visible) { vis = false; break; }
          if (!vis) continue;
          const mt = o.material;
          if (mt && !Array.isArray(mt) && (mt.opacity < 0.5 || mt.visible === false)) continue;
          return h.point.clone();
        }
        return null;
      };
      // 1.0.17: red dots with a white outline and a solid red line with a white outline (Google-Maps style);
      // all pieces keep a constant on-screen size (rescaled every frame by camera distance).
      const M_RED = 0xe53935, M_WHITE = 0xffffff, M_Y = new T3.Vector3(0, 1, 0);
      const mPiece = (geo, color, order, kind, f) => {
        const m = new T3.Mesh(geo, new T3.MeshBasicMaterial({ color, depthTest: false, transparent: true }));
        m.renderOrder = order;
        m.userData.noPick = true;
        m.userData.mk = { kind, f };
        mGroup.add(m);
        return m;
      };
      const mMark = (p) => {
        mPiece(new T3.SphereGeometry(1, 16, 12), M_WHITE, 998, "dot", 0.0085).position.copy(p);
        mPiece(new T3.SphereGeometry(1, 16, 12), M_RED, 999, "dot", 0.006).position.copy(p);
      };
      const mLine = (a, b) => {
        const len = a.distanceTo(b);
        if (len < 1e-6) return;
        const dirv = new T3.Vector3().subVectors(b, a).normalize();
        for (const [col, ord, f] of [[M_WHITE, 996, 0.0045], [M_RED, 997, 0.0028]]) {
          const c = mPiece(new T3.CylinderGeometry(1, 1, 1, 12, 1, true), col, ord, "line", f);
          c.position.copy(a).add(b).multiplyScalar(0.5);
          c.quaternion.setFromUnitVectors(M_Y, dirv);
          c.userData.mk.len = len;
        }
      };
      ctx2.animated.push(function() {
        const cp = ctx2.camera.position;
        for (const m of mGroup.children) {
          const mk = m.userData.mk;
          if (!mk) continue;
          const r = Math.max(0.02, cp.distanceTo(m.position) * mk.f);
          if (mk.kind === "dot") m.scale.set(r, r, r);
          else m.scale.set(r, mk.len, r);
        }
      });
      const mHint = "\u05DE\u05D3\u05D9\u05D3\u05D4: \u05DC\u05D7\u05E5 \u05E2\u05DC \u05E9\u05EA\u05D9 \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D1\u05DE\u05D5\u05D3\u05DC";
      const mSet = (on) => {
        mOn = on;
        document.body.classList.toggle("tm-measuring", on);
        mClear();
        mSay(on ? mHint : "");
        const b = document.getElementById("tm-nav-ruler");
        if (b) b.classList.toggle("on", on);
      };
      {
        const el = ctx2.renderer.domElement;
        let down = null;
        el.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
        el.addEventListener("pointerup", (e) => {
          if (!mOn || !down) return;
          const d = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t;
          down = null;
          if (d > 6 || dt > 600) return;
          const p = mPick(e);
          if (!p) return;
          if (mPts.length >= 2) mClear();
          mPts.push(p);
          mMark(p);
          if (mPts.length === 1) {
            mSay("\u05E0\u05E7\u05D5\u05D3\u05D4 \u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 \u05E1\u05D5\u05DE\u05E0\u05D4 \u2014 \u05DC\u05D7\u05E5 \u05E2\u05DC \u05E0\u05E7\u05D5\u05D3\u05D4 \u05E9\u05E0\u05D9\u05D9\u05D4");
          } else {
            const a = mPts[0], b = mPts[1];
            mLine(a, b);
            const dist = a.distanceTo(b), dh = Math.hypot(b.x - a.x, b.z - a.z), dy = Math.abs(b.y - a.y);
            mSay("\u05DE\u05E8\u05D7\u05E7: " + dist.toFixed(2) + " \u05D0\u05DE\u05D5\u05EA  \u00B7  \u05D0\u05D5\u05E4\u05E7\u05D9 " + dh.toFixed(2) + "  \u00B7  \u05D2\u05D5\u05D1\u05D4 " + dy.toFixed(2) + "  (\u05DC\u05D7\u05D9\u05E6\u05D4 \u05E0\u05D5\u05E1\u05E4\u05EA \u2014 \u05DE\u05D3\u05D9\u05D3\u05D4 \u05D7\u05D3\u05E9\u05D4)");
          }
        });
      }
      const realFly = typeof ctx2.flyTo === "function" ? ctx2.flyTo : function() {
      };
      const fly = function(pos, tgt, dur) {
        if (cloudOn && (inKK(pos) || inKK(tgt))) {
          askRemoveCloud(() => {
            setCloud(false);
            realFly(pos, tgt, dur);
          });
          return;
        }
        realFly(pos, tgt, dur);
      };
      const fps = ctx2.shared && ctx2.shared.flyPoints ? ctx2.shared.flyPoints : {};
      const btns = [];
      for (const v of VIEWS) {
        const fp = v.key === "__general" ? GENERAL : fps[v.key];
        if (!fp || !Array.isArray(fp.pos) || !Array.isArray(fp.target)) continue;
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = v.label;
        b.addEventListener("click", () => {
          try {
            if (v.interior) {
              if (!cutOn) {
                autoCut = true;
                setCutaway(true);
              }
            } else if (autoCut) {
              autoCut = false;
              setCutaway(false);
            }
            fly(fp.pos, fp.target);
          } catch (_) {
          }
          setInfo(v.key);
          if (window.innerWidth < 640) {
            panel.style.display = "none";
            burger.textContent = "\u2630";
          }
          for (const o of btns) o.classList.remove("on");
          b.classList.add("on");
        });
        grid.appendChild(b);
        btns.push(b);
      }
      if (btns.length) btns[0].classList.add("on");
      const PLACES = [["\u05E9\u05E2\u05E8\u05D9 \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA \u05D5\u05D7\u05E6\u05E8\u05D5\u05EA",[{"t":"\u05E9\u05E2\u05E8 \u05E9\u05D5\u05E9\u05DF","tg":[353,14,0],"cam":[420,30,36],"key":"shushanGate"},{"t":"\u05E9\u05E2\u05E8 \u05E7\u05D9\u05E4\u05D5\u05E0\u05D5\u05E1","tg":[-147,14,0],"cam":[-215,30,-34],"info":"\u05E9\u05E2\u05E8 \u05D1\u05DB\u05D5\u05EA\u05DC \u05D4\u05DE\u05E2\u05E8\u05D1\u05D9 \u05E9\u05DC \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA; \u05DE\u05E9\u05DE\u05E9 \u05DB\u05E0\u05D9\u05E1\u05D4 \u05D5\u05D9\u05E6\u05D9\u05D0\u05D4.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D2","Mishnah_Middot.1.3"]]},{"t":"\u05E9\u05E2\u05E8 \u05D8\u05D3\u05D9","tg":[55,12,-167.5],"cam":[80,28,-230],"info":"\u05E9\u05E2\u05E8 \u05D1\u05DB\u05D5\u05EA\u05DC \u05D4\u05E6\u05E4\u05D5\u05E0\u05D9 \u05E9\u05DC \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA; \u05DC\u05D0 \u05D4\u05D9\u05D4 \u05DE\u05E9\u05DE\u05E9 \u05DB\u05DC\u05D5\u05DD. \u05D1\u05DE\u05E7\u05D5\u05DD \u05DE\u05E9\u05E7\u05D5\u05E3 \u05D9\u05E9 \u05D1\u05D5 \u05E9\u05EA\u05D9 \u05D0\u05D1\u05E0\u05D9\u05DD \u05E0\u05D5\u05D8\u05D5\u05EA \u05D6\u05D5 \u05E2\u05DC \u05D6\u05D5.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D2","Mishnah_Middot.1.3"],["\u05D1, \u05D2","Mishnah_Middot.2.3"]]},{"t":"\u05E9\u05E2\u05E8\u05D9 \u05D7\u05D5\u05DC\u05D3\u05D4","tg":[55,14,332.5],"cam":[55,40,405],"info":"\u05E9\u05E0\u05D9 \u05E9\u05E2\u05E8\u05D9\u05DD \u05D1\u05DB\u05D5\u05EA\u05DC \u05D4\u05D3\u05E8\u05D5\u05DE\u05D9 \u05E9\u05DC \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA; \u05DE\u05E9\u05DE\u05E9\u05D9\u05DD \u05DB\u05E0\u05D9\u05E1\u05D4 \u05D5\u05D9\u05E6\u05D9\u05D0\u05D4. \u05DE\u05D4\u05DD \u05E2\u05D5\u05DC\u05D9\u05DD \u05D1\u05DE\u05D3\u05E8\u05D2\u05D5\u05EA \u05E8\u05D1\u05D5\u05EA \u05D0\u05DC \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D2","Mishnah_Middot.1.3"]]},{"t":"\u05D4\u05E1\u05D5\u05E8\u05D2","tg":[246,4,14],"cam":[278,18,52],"info":"\u05DE\u05D7\u05D9\u05E6\u05D4 \u05D1\u05D2\u05D5\u05D1\u05D4 \u05E2\u05E9\u05E8\u05D4 \u05D8\u05E4\u05D7\u05D9\u05DD \u05E1\u05D1\u05D9\u05D1 \u05D4\u05D4\u05D9\u05DB\u05DC. \u05DC\u05E4\u05E0\u05D9\u05DD \u05DE\u05DE\u05E0\u05D4 \u05D4\u05D7\u05D9\u05DC, \u05E8\u05D7\u05D1 \u05E2\u05E9\u05E8 \u05D0\u05DE\u05D5\u05EA.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D2","Mishnah_Middot.2.3"]]},{"t":"\u05D4\u05E9\u05E2\u05E8 \u05D4\u05E2\u05DC\u05D9\u05D5\u05DF","tg":[228.5,14,0],"cam":[278,30,34],"info":"\u05D4\u05E9\u05E2\u05E8 \u05D4\u05DE\u05D6\u05E8\u05D7\u05D9 \u05E9\u05DC \u05E2\u05D6\u05E8\u05EA \u05E0\u05E9\u05D9\u05DD. \u05DE\u05DF \u05D4\u05D7\u05D9\u05DC \u05E2\u05D5\u05DC\u05D9\u05DD \u05D0\u05DC\u05D9\u05D5 \u05D1\u05E9\u05EA\u05D9\u05DD \u05E2\u05E9\u05E8\u05D4 \u05DE\u05E2\u05DC\u05D5\u05EA, \u05DB\u05DC \u05D0\u05D7\u05EA \u05D7\u05E6\u05D9 \u05D0\u05DE\u05D4 \u05D2\u05D5\u05D1\u05D4 \u05D5\u05D7\u05E6\u05D9 \u05D0\u05DE\u05D4 \u05E9\u05D8\u05D7.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D2","Mishnah_Middot.2.3"]]},{"t":"\u05E9\u05E2\u05E8 \u05E0\u05D9\u05E7\u05E0\u05D5\u05E8","tg":[93.5,16,0],"cam":[150,34,40],"key":"nikanor"},{"t":"\u05D3\u05D5\u05DB\u05DF \u05D4\u05DC\u05D5\u05D9\u05D9\u05DD","tg":[85,16,0],"cam":[122,32,42],"info":"\u05DE\u05E7\u05D5\u05DD \u05E2\u05DE\u05D9\u05D3\u05EA \u05D4\u05DC\u05D5\u05D9\u05D9\u05DD \u05DC\u05E9\u05D9\u05E8 \u05D1\u05E2\u05EA \u05D4\u05E7\u05E8\u05D1\u05EA \u05D4\u05E7\u05E8\u05D1\u05E0\u05D5\u05EA, \u05D1\u05D9\u05DF \u05E2\u05D6\u05E8\u05EA \u05D9\u05E9\u05E8\u05D0\u05DC \u05DC\u05E2\u05D6\u05E8\u05EA \u05DB\u05D4\u05E0\u05D9\u05DD.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D5","Mishnah_Middot.2.6"]]}]],["\u05E9\u05E2\u05E8\u05D9 \u05D4\u05E2\u05D6\u05E8\u05D4",[{"t":"\u05E9\u05E2\u05E8 \u05D4\u05E0\u05D9\u05E6\u05D5\u05E5","tg":[40,20,-70.5],"cam":[56,36,-112],"info":"\u05D4\u05E8\u05D0\u05E9\u05D5\u05DF \u05DE\u05D1\u05D9\u05DF \u05E9\u05DC\u05D5\u05E9\u05EA \u05E9\u05E2\u05E8\u05D9 \u05D4\u05E6\u05E4\u05D5\u05DF \u05E9\u05DC \u05D4\u05E2\u05D6\u05E8\u05D4: \u05D4\u05E0\u05D9\u05E6\u05D5\u05E5, \u05D4\u05E7\u05E8\u05D1\u05DF \u05D5\u05D1\u05D9\u05EA \u05D4\u05DE\u05D5\u05E7\u05D3.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D3","Mishnah_Middot.1.4"]]},{"t":"\u05E9\u05E2\u05E8 \u05D4\u05E7\u05E8\u05D1\u05DF","tg":[0,20,-70.5],"cam":[16,36,-112],"info":"\u05D4\u05D0\u05DE\u05E6\u05E2\u05D9 \u05DE\u05D1\u05D9\u05DF \u05E9\u05DC\u05D5\u05E9\u05EA \u05E9\u05E2\u05E8\u05D9 \u05D4\u05E6\u05E4\u05D5\u05DF \u05E9\u05DC \u05D4\u05E2\u05D6\u05E8\u05D4.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D3","Mishnah_Middot.1.4"]]},{"t":"\u05E9\u05E2\u05E8 \u05D1\u05D9\u05EA \u05D4\u05DE\u05D5\u05E7\u05D3","tg":[-40,20,-70.5],"cam":[-24,36,-112],"info":"\u05D4\u05E9\u05DC\u05D9\u05E9\u05D9 \u05D1\u05E6\u05E4\u05D5\u05DF, \u05D4\u05E1\u05DE\u05D5\u05DA \u05DC\u05D1\u05D9\u05EA \u05D4\u05DE\u05D5\u05E7\u05D3, \u05D1\u05E6\u05D3 \u05D4\u05DE\u05E2\u05E8\u05D1\u05D9.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D3","Mishnah_Middot.1.4"]]},{"t":"\u05E9\u05E2\u05E8 \u05D4\u05D3\u05DC\u05E7","tg":[-40,20,70.5],"cam":[-24,36,112],"info":"\u05E9\u05E2\u05E8 \u05D4\u05D3\u05E8\u05D5\u05DD \u05D4\u05E8\u05D0\u05E9\u05D5\u05DF, \u05D4\u05E1\u05DE\u05D5\u05DA \u05DC\u05DE\u05E2\u05E8\u05D1 \u05DC\u05E4\u05D9 \u05E4\u05D9\u05E8\u05D5\u05E9 \u05D4\u05E8\u05F4\u05D1. \u05E9\u05DC\u05D5\u05E9\u05EA \u05E9\u05E2\u05E8\u05D9 \u05D4\u05D3\u05E8\u05D5\u05DD: \u05D4\u05D3\u05DC\u05E7, \u05D4\u05D1\u05DB\u05D5\u05E8\u05D5\u05EA \u05D5\u05D4\u05DE\u05D9\u05DD.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D3","Mishnah_Middot.1.4"]]},{"t":"\u05E9\u05E2\u05E8 \u05D4\u05D1\u05DB\u05D5\u05E8\u05D5\u05EA","tg":[0,20,70.5],"cam":[16,36,112],"info":"\u05D4\u05D0\u05DE\u05E6\u05E2\u05D9 \u05D1\u05D9\u05DF \u05E9\u05E2\u05E8\u05D9 \u05D4\u05D3\u05E8\u05D5\u05DD \u05E9\u05DC \u05D4\u05E2\u05D6\u05E8\u05D4.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D3","Mishnah_Middot.1.4"]]},{"t":"\u05E9\u05E2\u05E8 \u05D4\u05DE\u05D9\u05DD","tg":[40,20,70.5],"cam":[56,36,112],"info":"\u05D4\u05E9\u05DC\u05D9\u05E9\u05D9 \u05D1\u05D3\u05E8\u05D5\u05DD, \u05D1\u05E6\u05D3 \u05D4\u05DE\u05D6\u05E8\u05D7\u05D9.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D3","Mishnah_Middot.1.4"]]}]],["\u05DC\u05E9\u05DB\u05D5\u05EA",[{"t":"\u05DC\u05E9\u05DB\u05EA \u05D4\u05E0\u05D6\u05D9\u05E8\u05D9\u05DD","tg":[208.5,10,47.5],"cam":[183,52,102],"info":"\u05D1\u05D3\u05E8\u05D5\u05DD\u05BE\u05DE\u05D6\u05E8\u05D7 \u05E2\u05D6\u05E8\u05EA \u05E0\u05E9\u05D9\u05DD (\u05D0\u05E8\u05D1\u05E2\u05D9\u05DD \u05E2\u05DC \u05D0\u05E8\u05D1\u05E2\u05D9\u05DD \u05D0\u05DE\u05D4). \u05E9\u05DD \u05D4\u05E0\u05D6\u05D9\u05E8\u05D9\u05DD \u05DE\u05D1\u05E9\u05DC\u05D9\u05DD \u05D0\u05EA \u05E9\u05DC\u05DE\u05D9\u05D4\u05DD, \u05DE\u05D2\u05DC\u05D7\u05D9\u05DD \u05D0\u05EA \u05E9\u05E2\u05E8\u05DD \u05D5\u05DE\u05E9\u05DC\u05D9\u05DB\u05D9\u05DD \u05D0\u05D5\u05EA\u05D5 \u05EA\u05D7\u05EA \u05D4\u05D3\u05D5\u05D3.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D4","Mishnah_Middot.2.5"]]},{"t":"\u05DC\u05E9\u05DB\u05EA \u05D4\u05E2\u05E6\u05D9\u05DD","tg":[208.5,10,-47.5],"cam":[183,52,-102],"info":"\u05D1\u05E6\u05E4\u05D5\u05DF\u05BE\u05DE\u05D6\u05E8\u05D7 \u05E2\u05D6\u05E8\u05EA \u05E0\u05E9\u05D9\u05DD. \u05E9\u05DD \u05DB\u05D4\u05E0\u05D9\u05DD \u05D1\u05E2\u05DC\u05D9 \u05DE\u05D5\u05DE\u05D9\u05DD \u05D1\u05D5\u05E8\u05E8\u05D9\u05DD \u05E2\u05E6\u05D9\u05DD, \u05D5\u05E2\u05E5 \u05E9\u05E0\u05DE\u05E6\u05D0 \u05D1\u05D5 \u05EA\u05D5\u05DC\u05E2\u05EA \u05E0\u05E4\u05E1\u05DC.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D4","Mishnah_Middot.2.5"]]},{"t":"\u05DC\u05E9\u05DB\u05EA \u05D4\u05DE\u05E6\u05D5\u05E8\u05E2\u05D9\u05DD","tg":[113.5,10,-47.5],"cam":[90,52,-102],"info":"\u05D1\u05E6\u05E4\u05D5\u05DF\u05BE\u05DE\u05E2\u05E8\u05D1 \u05E2\u05D6\u05E8\u05EA \u05E0\u05E9\u05D9\u05DD. \u05E9\u05DD \u05D4\u05DE\u05E6\u05D5\u05E8\u05E2\u05D9\u05DD \u05D4\u05DE\u05D9\u05D8\u05D4\u05E8\u05D9\u05DD \u05D8\u05D5\u05D1\u05DC\u05D9\u05DD.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D4","Mishnah_Middot.2.5"]]},{"t":"\u05DC\u05E9\u05DB\u05EA \u05E9\u05DE\u05E0\u05D9\u05DD","tg":[113.5,10,47.5],"cam":[90,52,102],"info":"\u05D1\u05D3\u05E8\u05D5\u05DD\u05BE\u05DE\u05E2\u05E8\u05D1 \u05E2\u05D6\u05E8\u05EA \u05E0\u05E9\u05D9\u05DD. \u05DC\u05E9\u05DB\u05D4 \u05DC\u05E9\u05DE\u05D9\u05E8\u05EA \u05D4\u05E9\u05DE\u05DF \u05DC\u05E7\u05E8\u05D1\u05E0\u05D5\u05EA.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D4","Mishnah_Middot.2.5"]]},{"t":"\u05D1\u05D9\u05EA \u05D4\u05DE\u05D5\u05E7\u05D3","tg":[-60,22,-67.5],"cam":[-45,56,-136],"info":"\u05D1\u05E0\u05D5\u05D9 \u05DB\u05DB\u05D9\u05E4\u05D4. \u05E9\u05EA\u05D9\u05DD \u05DE\u05DC\u05E9\u05DB\u05D5\u05EA\u05D9\u05D5 \u05D1\u05E7\u05D3\u05E9 \u05D5\u05E9\u05EA\u05D9\u05DD \u05D1\u05D7\u05D5\u05DC, \u05D5\u05D9\u05E9 \u05DC\u05D5 \u05E9\u05E0\u05D9 \u05E4\u05EA\u05D7\u05D9\u05DD: \u05D0\u05D7\u05D3 \u05DC\u05D7\u05D9\u05DC \u05D5\u05D0\u05D7\u05D3 \u05DC\u05E2\u05D6\u05E8\u05D4.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D5","Mishnah_Middot.1.6"]]},{"t":"\u05DC\u05E9\u05DB\u05EA \u05D4\u05D2\u05D5\u05DC\u05D4","tg":[20,22,-67.5],"cam":[35,56,-136],"info":"\u05D0\u05D7\u05EA \u05DE\u05DC\u05E9\u05DB\u05D5\u05EA \u05D4\u05E2\u05D6\u05E8\u05D4 \u05D1\u05E6\u05E4\u05D5\u05DF, \u05D5\u05D1\u05D4 \u05D1\u05D5\u05E8 \u05D4\u05D2\u05D5\u05DC\u05D4.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05E4\u05E8\u05E7 \u05D4","Mishnah_Middot.5"]]},{"t":"\u05DC\u05E9\u05DB\u05EA \u05D4\u05D2\u05D6\u05D9\u05EA","tg":[60,24,-67.5],"cam":[75,56,-136],"info":"\u05DE\u05E7\u05D5\u05DD \u05D9\u05E9\u05D9\u05D1\u05EA \u05D4\u05E1\u05E0\u05D4\u05D3\u05E8\u05D9\u05DF \u05D4\u05D2\u05D3\u05D5\u05DC\u05D4, \u05D7\u05E6\u05D9\u05D4 \u05D1\u05E7\u05D3\u05E9 \u05D5\u05D7\u05E6\u05D9\u05D4 \u05D1\u05D7\u05D5\u05DC.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D4, \u05D3","Mishnah_Middot.5.4"]]},{"t":"\u05DC\u05E9\u05DB\u05EA \u05D4\u05DE\u05DC\u05D7","tg":[-60,22,67.5],"cam":[-45,56,136],"info":"\u05DC\u05E9\u05DB\u05D4 \u05D1\u05D3\u05E8\u05D5\u05DD \u05D4\u05E2\u05D6\u05E8\u05D4, \u05E9\u05DD \u05E0\u05D5\u05EA\u05E0\u05D9\u05DD \u05DE\u05DC\u05D7 \u05DC\u05E7\u05E8\u05D1\u05DF.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D4, \u05D2","Mishnah_Middot.5.3"]]},{"t":"\u05DC\u05E9\u05DB\u05EA \u05D4\u05E4\u05E8\u05D5\u05D4","tg":[-20,22,67.5],"cam":[-5,56,136],"info":"\u05E9\u05DD \u05DE\u05D5\u05DC\u05D7\u05D9\u05DD \u05E2\u05D5\u05E8\u05D5\u05EA \u05D4\u05E7\u05D3\u05E9\u05D9\u05DD.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D4, \u05D2","Mishnah_Middot.5.3"]]},{"t":"\u05DC\u05E9\u05DB\u05EA \u05D4\u05DE\u05D3\u05D9\u05D7\u05D9\u05DF","tg":[20,22,67.5],"cam":[35,56,136],"info":"\u05E9\u05DD \u05DE\u05D3\u05D9\u05D7\u05D9\u05DD \u05E7\u05E8\u05D1\u05D9 \u05D4\u05E7\u05D3\u05E9\u05D9\u05DD.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D4, \u05D2","Mishnah_Middot.5.3"]]}]],["\u05DE\u05D6\u05D1\u05D7 \u05D5\u05DB\u05DC\u05D9\u05DD",[{"t":"\u05D4\u05DE\u05D6\u05D1\u05D7","tg":[55.5,16,0],"cam":[115,58,72],"key":"mizbeach"},{"t":"\u05D4\u05DB\u05D1\u05E9","tg":[55.5,14,28],"cam":[100,38,76],"info":"\u05D4\u05DB\u05D1\u05E9 \u05E2\u05D5\u05DC\u05D4 \u05D0\u05DC \u05D4\u05DE\u05D6\u05D1\u05D7 \u05DE\u05D3\u05E8\u05D5\u05DE\u05D5, \u05D1\u05D0\u05D5\u05E8\u05DA \u05E9\u05DC\u05D5\u05E9\u05D9\u05DD \u05D5\u05E9\u05EA\u05D9\u05DD \u05D0\u05DE\u05D4 \u05D5\u05D1\u05E8\u05D5\u05D7\u05D1 \u05E9\u05E9 \u05E2\u05E9\u05E8\u05D4.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D2","Mishnah_Middot.3.3"]]},{"t":"\u05D4\u05DB\u05D9\u05D5\u05E8","tg":[28,18,17],"cam":[62,36,52],"info":"\u05D4\u05DB\u05D9\u05D5\u05E8 \u05E2\u05D5\u05DE\u05D3 \u05D1\u05D9\u05DF \u05D4\u05D0\u05D5\u05DC\u05DD \u05DC\u05DE\u05D6\u05D1\u05D7, \u05DE\u05E2\u05D8 \u05DC\u05D3\u05E8\u05D5\u05DD, \u05DE\u05DE\u05E0\u05D5 \u05DE\u05E7\u05D3\u05E9\u05D9\u05DD \u05D4\u05DB\u05D4\u05E0\u05D9\u05DD \u05D9\u05D3\u05D9\u05D4\u05DD \u05D5\u05E8\u05D2\u05DC\u05D9\u05D4\u05DD.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D5","Mishnah_Middot.3.6"]]},{"t":"\u05D1\u05D9\u05EA \u05D4\u05DE\u05D8\u05D1\u05D7\u05D9\u05D9\u05DD","tg":[52,16,-49],"cam":[96,46,-88],"info":"\u05D1\u05E6\u05E4\u05D5\u05DF \u05D4\u05DE\u05D6\u05D1\u05D7, \u05E9\u05DD \u05E9\u05D5\u05D7\u05D8\u05D9\u05DD \u05D5\u05DE\u05E0\u05EA\u05D7\u05D9\u05DD \u05D0\u05EA \u05D4\u05E7\u05E8\u05D1\u05E0\u05D5\u05EA.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D4","Mishnah_Middot.3.5"]]},{"t":"\u05D4\u05D8\u05D1\u05E2\u05D5\u05EA","tg":[52,16,-31.5],"cam":[86,38,-62],"info":"\u05E2\u05E9\u05E8\u05D9\u05DD \u05D5\u05D0\u05E8\u05D1\u05E2 \u05D8\u05D1\u05E2\u05D5\u05EA \u05D1\u05E6\u05E4\u05D5\u05DF \u05D4\u05DE\u05D6\u05D1\u05D7, \u05E9\u05D1\u05D4\u05DF \u05E0\u05D5\u05E2\u05DC\u05D9\u05DD \u05D0\u05EA \u05E8\u05D0\u05E9\u05D9 \u05D4\u05E7\u05E8\u05D1\u05E0\u05D5\u05EA \u05DC\u05E9\u05D7\u05D9\u05D8\u05D4.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D4","Mishnah_Middot.3.5"]]}]],["\u05D4\u05D4\u05D9\u05DB\u05DC \u05D5\u05E4\u05E0\u05D9\u05DD",[{"t":"\u05D4\u05D2\u05E4\u05DF \u05E9\u05DC \u05D6\u05D4\u05D1","tg":[2.5,44,0],"cam":[46,46,0],"info":"\u05D2\u05E4\u05DF \u05D6\u05D4\u05D1 \u05E2\u05D5\u05DE\u05D3\u05EA \u05E2\u05DC \u05E4\u05EA\u05D7 \u05D4\u05D4\u05D9\u05DB\u05DC, \u05D5\u05E2\u05DC\u05D9\u05D4 \u05EA\u05D5\u05DC\u05D9\u05DD \u05E2\u05E0\u05D1\u05D9\u05DD \u05E9\u05DE\u05E0\u05D3\u05D1\u05D9\u05DD.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D7","Mishnah_Middot.3.8"]]},{"t":"\u05D4\u05DE\u05E0\u05D5\u05E8\u05D4","tg":[-25,25,6],"cam":[-8,36,-6],"info":"\u05DE\u05E0\u05D5\u05E8\u05EA \u05D4\u05D6\u05D4\u05D1 \u05D1\u05D3\u05E8\u05D5\u05DD \u05D4\u05D4\u05D9\u05DB\u05DC, \u05D1\u05EA \u05E9\u05D1\u05E2\u05D4 \u05E7\u05E0\u05D9\u05DD.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05E4\u05E8\u05E7 \u05D3","Mishnah_Middot.4"]],"in":1},{"t":"\u05E9\u05D5\u05DC\u05D7\u05DF \u05DC\u05D7\u05DD \u05D4\u05E4\u05E0\u05D9\u05DD","tg":[-25,24,-6],"cam":[-8,36,8],"info":"\u05D1\u05E6\u05E4\u05D5\u05DF \u05D4\u05D4\u05D9\u05DB\u05DC, \u05D5\u05E2\u05DC\u05D9\u05D5 \u05DC\u05D7\u05DD \u05D4\u05E4\u05E0\u05D9\u05DD.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05E4\u05E8\u05E7 \u05D3","Mishnah_Middot.4"]],"in":1},{"t":"\u05DE\u05D6\u05D1\u05D7 \u05D4\u05D6\u05D4\u05D1","tg":[-18,24,0],"cam":[-6,34,0],"info":"\u05DE\u05D6\u05D1\u05D7 \u05D4\u05E7\u05D8\u05D5\u05E8\u05EA, \u05D1\u05D0\u05DE\u05E6\u05E2 \u05D4\u05D4\u05D9\u05DB\u05DC \u05DC\u05E4\u05E0\u05D9 \u05D4\u05E4\u05E8\u05D5\u05DB\u05EA.","refs":[["\u05DE\u05D9\u05D3\u05D5\u05EA \u05E4\u05E8\u05E7 \u05D3","Mishnah_Middot.4"]],"in":1},{"t":"\u05D0\u05D1\u05DF \u05D4\u05E9\u05EA\u05D9\u05D9\u05D4","tg":[-55.5,22,0],"cam":[-47.5,36,7],"key":"kodeshHakodashim","in":1}]]];
      const placeBtns = [];

      // 1.0.19: "corrections" group shown to the user: every halachic fix gets a short explanation + a link to the Mishnah place
      // (refs = [label, "Mishnah_Middot.<chapter>.<mishnah>"] -> opens inside Otzaria via openSource). Rambam is cited in the text only.
      // STANDING RULE: add an entry here for every halachic correction (see DEV_NOTES.md).
      const CORRECTIONS = [
        { t: "\u05E9\u05E2\u05E8 \u05D8\u05D3\u05D9 \u2014 \u05E4\u05EA\u05D7 \u05E4\u05EA\u05D5\u05D7 \u05D1\u05E6\u05D5\u05E8\u05EA \u05D2\u05D2 (1.0.19)", tg: [55, 12, -167.5], cam: [80, 28, -230],
          info: "\u05D4\u05E4\u05EA\u05D7 \u05E2\u05E9\u05E8\u05D9\u05DD \u05D0\u05DE\u05D4 \u05D2\u05D5\u05D1\u05D4 \u05D5\u05E2\u05E9\u05E8 \u05D0\u05DE\u05D5\u05EA \u05E8\u05D5\u05D7\u05D1, \u05DB\u05DE\u05D5 \u05DB\u05DC \u05D4\u05E4\u05EA\u05D7\u05D9\u05DD \u05D5\u05D4\u05E9\u05E2\u05E8\u05D9\u05DD \u05E9\u05D4\u05D9\u05D5 \u05E9\u05DD (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D2; \u05E8\u05DE\u05D1\u05F4\u05DD \u05D1\u05D9\u05EA \u05D4\u05D1\u05D7\u05D9\u05E8\u05D4 \u05D4, \u05D1). \u05DE\u05D4 \u05E9\u05DE\u05D9\u05D9\u05D7\u05D3 \u05D0\u05EA \u05E9\u05E2\u05E8 \u05D8\u05D3\u05D9 \u05D4\u05D5\u05D0 \u05D4\u05DE\u05E9\u05E7\u05D5\u05E3: \u05D1\u05DE\u05E7\u05D5\u05DD \u05E7\u05D5\u05E8\u05D4 \u05D9\u05E9\u05E8\u05D4 \u05D9\u05E9 \u05D1\u05D5 \u05E9\u05EA\u05D9 \u05D0\u05D1\u05E0\u05D9\u05DD \u05E0\u05D5\u05D8\u05D5\u05EA \u05D6\u05D5 \u05E2\u05DC \u05D2\u05D1 \u05D6\u05D5, \u05DB\u05DE\u05D5 \u05D5\u05F3 \u05D4\u05E4\u05D5\u05DB\u05D4, \u05D5\u05D4\u05D7\u05DC\u05DC \u05D4\u05DE\u05E9\u05D5\u05DC\u05E9 \u05E9\u05D1\u05D9\u05E0\u05D9\u05D4\u05DF \u05E4\u05EA\u05D5\u05D7 \u05D5\u05D0\u05D9\u05E0\u05D5 \u05DE\u05DC\u05D0 \u05D1\u05D0\u05D1\u05E0\u05D9\u05DD. \u05E6\u05D5\u05E8\u05EA\u05DF \u05D4\u05DE\u05D3\u05D5\u05D9\u05E7\u05EA \u05E9\u05DC \u05D4\u05D0\u05D1\u05E0\u05D9\u05DD \u05D0\u05D9\u05E0\u05D4 \u05DE\u05E4\u05D5\u05E8\u05D8\u05EA \u05D1\u05DE\u05E9\u05E0\u05D4.",
          refs: [["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D2", "Mishnah_Middot.2.3"], ["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D2", "Mishnah_Middot.1.3"]] },
        { t: "\u05E9\u05E2\u05E8\u05D9 \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA \u2014 \u05DE\u05E8\u05D5\u05D1\u05E2\u05D9\u05DD \u05E2\u05DD \u05DE\u05E9\u05E7\u05D5\u05E3 \u05D0\u05D1\u05DF (1.0.19)", tg: [353, 14, 0], cam: [420, 30, 36],
          info: "\u05E9\u05E2\u05E8\u05D9 \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA (\u05E9\u05D5\u05E9\u05DF, \u05E7\u05D9\u05E4\u05D5\u05E0\u05D5\u05E1, \u05E9\u05E0\u05D9 \u05E9\u05E2\u05E8\u05D9 \u05D7\u05D5\u05DC\u05D3\u05D4) \u05EA\u05D5\u05E7\u05E0\u05D5 \u05DE\u05E6\u05D5\u05E8\u05EA \u05E7\u05E9\u05EA \u05DC\u05E4\u05EA\u05D7 \u05DE\u05E8\u05D5\u05D1\u05E2, \u05E2\u05E9\u05E8\u05D9\u05DD \u05D0\u05DE\u05D4 \u05D2\u05D5\u05D1\u05D4 \u05D5\u05E2\u05E9\u05E8 \u05E8\u05D5\u05D7\u05D1, \u05D5\u05E2\u05DC\u05D9\u05D5 \u05DE\u05E9\u05E7\u05D5\u05E3 \u05D0\u05D1\u05DF (\u05E9\u05E7\u05D5\u05E3). \u05DB\u05DC \u05D4\u05E9\u05E2\u05E8\u05D9\u05DD \u05E9\u05D4\u05D9\u05D5 \u05E9\u05DD \u05D4\u05D9\u05D5 \u05DC\u05D4\u05DD \u05E9\u05E7\u05D5\u05E4\u05D5\u05EA, \u05D7\u05D5\u05E5 \u05DE\u05E9\u05E2\u05E8 \u05D8\u05D3\u05D9 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D2). \u05E9\u05E2\u05E8\u05D9 \u05D4\u05E2\u05D6\u05E8\u05D4 \u05D8\u05E8\u05DD \u05E0\u05D1\u05D3\u05E7\u05D5 \u05D5\u05E2\u05D3\u05D9\u05D9\u05DF \u05E0\u05E8\u05D0\u05D9\u05DD \u05D1\u05E7\u05E9\u05EA.",
          refs: [["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D2", "Mishnah_Middot.2.3"], ["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D2", "Mishnah_Middot.1.3"]] },
        { t: "\u05DE\u05D3\u05E8\u05D2\u05D5\u05EA \u05D7\u05D9\u05E6\u05D5\u05E0\u05D9\u05D5\u05EA \u05DC\u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA \u2014 \u05D4\u05E9\u05DC\u05DE\u05EA \u05DE\u05D5\u05D3\u05DC", tg: [55, 14, 332.5], cam: [55, 40, 405],
          info: "\u05D1\u05DE\u05E1\u05DB\u05EA \u05DE\u05D9\u05D3\u05D5\u05EA \u05D0\u05D9\u05DF \u05EA\u05D9\u05D0\u05D5\u05E8 \u05E9\u05DC \u05DE\u05D3\u05E8\u05D2\u05D5\u05EA \u05DE\u05D7\u05D5\u05E5 \u05DC\u05E9\u05E2\u05E8\u05D9 \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA. \u05D4\u05DE\u05D3\u05E8\u05D2\u05D5\u05EA \u05D1\u05DE\u05D5\u05D3\u05DC \u05D4\u05DF \u05D4\u05E9\u05DC\u05DE\u05D4 \u05E9\u05DC \u05D4\u05DE\u05D5\u05D3\u05DC \u05D1\u05DC\u05D1\u05D3. \u05DC\u05E4\u05D9 \u05D4\u05E8\u05DE\u05D1\u05F4\u05DD \u05D4\u05DE\u05E7\u05D3\u05E9 \u05DB\u05D5\u05DC\u05D5 \u05D4\u05D9\u05D4 \u05E2\u05DC \u05DE\u05E2\u05DC\u05D4 \u05D4\u05D4\u05E8 (\u05D1\u05D9\u05EA \u05D4\u05D1\u05D7\u05D9\u05E8\u05D4 \u05D5, \u05D0).",
          refs: [["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D2", "Mishnah_Middot.1.3"]] },
        { t: "\u05DB\u05D5\u05EA\u05DC \u05D4\u05DE\u05D6\u05E8\u05D7 \u05D4\u05E0\u05DE\u05D5\u05DA (1.0.6)", tg: [353, 14, 0], cam: [420, 30, 36],
          info: "\u05DB\u05D5\u05EA\u05DC \u05D4\u05DE\u05D6\u05E8\u05D7 \u05E9\u05DC \u05D4\u05E8 \u05D4\u05D1\u05D9\u05EA \u05E0\u05DE\u05D5\u05DA \u05DE\u05E9\u05D0\u05E8 \u05D4\u05DB\u05EA\u05DC\u05D9\u05DD, \u05DB\u05D3\u05D9 \u05E9\u05D4\u05DB\u05D4\u05DF \u05D4\u05E9\u05D5\u05E8\u05E3 \u05D0\u05EA \u05D4\u05E4\u05E8\u05D4 \u05D9\u05E8\u05D0\u05D4 \u05DE\u05D4\u05E8 \u05D4\u05DE\u05E9\u05D7\u05D4 \u05D0\u05EA \u05E4\u05EA\u05D7 \u05D4\u05D4\u05D9\u05DB\u05DC (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D3). \u05D1\u05DE\u05D5\u05D3\u05DC \u05D2\u05D5\u05D1\u05D4\u05D5 24 \u05D0\u05DE\u05D5\u05EA \u05DC\u05E2\u05D5\u05DE\u05EA 27 \u05D1\u05E9\u05D0\u05E8 \u05D4\u05DB\u05EA\u05DC\u05D9\u05DD; \u05E9\u05D9\u05E2\u05D5\u05E8 \u05D4\u05D4\u05E0\u05DE\u05DB\u05D4 \u05D0\u05D9\u05E0\u05D5 \u05E7\u05D1\u05D5\u05E2 \u05D1\u05DE\u05E7\u05D5\u05E8\u05D5\u05EA \u05D5\u05D1\u05DE\u05D5\u05D3\u05DC \u05D4\u05D5\u05D0 \u05E4\u05E9\u05E8\u05D4 \u05D1\u05D9\u05DF \u05D4\u05D3\u05E2\u05D5\u05EA.",
          refs: [["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D3", "Mishnah_Middot.2.4"]] },
        { t: "\u05DE\u05E2\u05DC\u05D5\u05EA \u05D4\u05D7\u05D9\u05DC \u05D5\u05D4\u05E2\u05D6\u05E8\u05D5\u05EA (1.0.6)", tg: [228.5, 14, 0], cam: [278, 30, 34],
          info: "\u05DB\u05DC \u05D4\u05DE\u05E2\u05DC\u05D5\u05EA \u05E9\u05D4\u05D9\u05D5 \u05E9\u05DD \u05D2\u05D1\u05D5\u05D4\u05D5\u05EA \u05D7\u05E6\u05D9 \u05D0\u05DE\u05D4 \u05D5\u05E9\u05D8\u05D7\u05DF \u05D7\u05E6\u05D9 \u05D0\u05DE\u05D4, \u05D7\u05D5\u05E5 \u05DE\u05E9\u05DC \u05D0\u05D5\u05DC\u05DD (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D2). \u05DE\u05DF \u05D4\u05D7\u05D9\u05DC \u05E2\u05D5\u05DC\u05D9\u05DD \u05DC\u05E2\u05D6\u05E8\u05EA \u05E0\u05E9\u05D9\u05DD \u05D1\u05E9\u05EA\u05D9\u05DD \u05E2\u05E9\u05E8\u05D4 \u05DE\u05E2\u05DC\u05D5\u05EA, \u05D5\u05DE\u05E2\u05D6\u05E8\u05EA \u05E0\u05E9\u05D9\u05DD \u05DC\u05E2\u05D6\u05E8\u05EA \u05D9\u05E9\u05E8\u05D0\u05DC \u05D1\u05D7\u05DE\u05E9 \u05E2\u05E9\u05E8\u05D4 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D4).",
          refs: [["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D2", "Mishnah_Middot.2.3"], ["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D1, \u05D4", "Mishnah_Middot.2.5"]] },
        { t: "\u05D1\u05D9\u05EA \u05D4\u05DE\u05D5\u05E7\u05D3 \u2014 \u05E9\u05E0\u05D9 \u05E4\u05EA\u05D7\u05D9\u05DD (1.0.6)", tg: [-60, 22, -67.5], cam: [-45, 56, -136],
          info: "\u05D1\u05D9\u05EA \u05D4\u05DE\u05D5\u05E7\u05D3 \u05D1\u05E0\u05D5\u05D9 \u05DB\u05DB\u05D9\u05E4\u05D4, \u05D5\u05D9\u05E9 \u05DC\u05D5 \u05E9\u05E0\u05D9 \u05E4\u05EA\u05D7\u05D9\u05DD: \u05D0\u05D7\u05D3 \u05DC\u05D7\u05D9\u05DC \u05D5\u05D0\u05D7\u05D3 \u05DC\u05E2\u05D6\u05E8\u05D4 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D5).",
          refs: [["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D0, \u05D5", "Mishnah_Middot.1.6"]] },
        { t: "\u05DE\u05E2\u05DC\u05D5\u05EA \u05D4\u05D0\u05D5\u05DC\u05DD (1.0.12)", tg: [28, 18, 17], cam: [62, 36, 52],
          info: "\u05D1\u05D9\u05DF \u05D4\u05D0\u05D5\u05DC\u05DD \u05DC\u05DE\u05D6\u05D1\u05D7 \u05E2\u05E9\u05E8\u05D9\u05DD \u05D5\u05E9\u05EA\u05D9\u05DD \u05D0\u05DE\u05D4, \u05D5\u05E9\u05EA\u05D9\u05DD \u05E2\u05E9\u05E8\u05D4 \u05DE\u05E2\u05DC\u05D5\u05EA \u05D1\u05D2\u05D5\u05D1\u05D4 \u05D7\u05E6\u05D9 \u05D0\u05DE\u05D4 \u05D5\u05E9\u05D8\u05D7 \u05D0\u05DE\u05D4, \u05E2\u05DD \u05E8\u05D5\u05D1\u05D3\u05D9\u05DD \u05E9\u05DC \u05E9\u05DC\u05D5\u05E9, \u05E9\u05DC\u05D5\u05E9 \u05D5\u05D0\u05E8\u05D1\u05E2 (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D5). \u05D4\u05E8\u05DE\u05D1\u05F4\u05DD (\u05D1\u05D9\u05EA \u05D4\u05D1\u05D7\u05D9\u05E8\u05D4 \u05D5, \u05D3) \u05DE\u05D2\u05D3\u05D9\u05E8 \u05D0\u05EA \u05E9\u05D8\u05D7 \u05DB\u05DC \u05DE\u05E2\u05DC\u05D4 \u05D7\u05E6\u05D9 \u05D0\u05DE\u05D4, \u05D5\u05D4\u05DE\u05E8\u05D7\u05E7 \u05E9\u05D1\u05D9\u05DF \u05D4\u05D0\u05D5\u05DC\u05DD \u05DC\u05DE\u05D6\u05D1\u05D7 \u05D4\u05D5\u05D0 \u05D1\u05E9\u05D5\u05D4 \u05D5\u05D0\u05D7\u05E8\u05D9\u05D5 \u05E2\u05D5\u05DC\u05D9\u05DD \u05DC\u05D0\u05D5\u05DC\u05DD. \u05D4\u05DE\u05D5\u05D3\u05DC \u05D4\u05D5\u05DC\u05DA \u05DC\u05E4\u05D9 \u05E0\u05D5\u05E1\u05D7 \u05D4\u05DE\u05E9\u05E0\u05D4, \u05D5\u05D4\u05D4\u05DB\u05E8\u05E2\u05D4 \u05D1\u05D9\u05DF \u05D4\u05E9\u05D9\u05D8\u05D5\u05EA \u05E4\u05EA\u05D5\u05D7\u05D4.",
          refs: [["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D5", "Mishnah_Middot.3.6"]] },
        { t: "\u05E0\u05E7\u05D1\u05D9 \u05D4\u05DE\u05D6\u05D1\u05D7 \u05D5\u05D4\u05E8\u05D1\u05D5\u05D1\u05D4 (1.0.13)", tg: [55.5, 16, 0], cam: [115, 58, 72],
          info: "\u05D1\u05E7\u05E8\u05DF \u05D4\u05DE\u05E2\u05E8\u05D1\u05D9\u05EA\u05BE\u05D3\u05E8\u05D5\u05DE\u05D9\u05EA \u05E9\u05DC \u05D4\u05DE\u05D6\u05D1\u05D7 \u05E9\u05E0\u05D9 \u05E0\u05E7\u05D1\u05D9\u05DD \u05D3\u05E7\u05D9\u05DD \u05DB\u05DE\u05D9\u05DF \u05E9\u05E0\u05D9 \u05D7\u05D5\u05D8\u05DE\u05D9\u05DF (\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D1; \u05E8\u05DE\u05D1\u05F4\u05DD \u05D1\u05D9\u05EA \u05D4\u05D1\u05D7\u05D9\u05E8\u05D4 \u05D1, \u05D9\u05D0), \u05D5\u05D1\u05DE\u05E2\u05E8\u05D1 \u05D4\u05DB\u05D1\u05E9 \u05D7\u05DC\u05D5\u05DF \u05D0\u05DE\u05D4 \u05E2\u05DC \u05D0\u05DE\u05D4 \u05D4\u05E0\u05E7\u05E8\u05D0\u05EA \u05E8\u05D1\u05D5\u05D1\u05D4 (\u05E8\u05DE\u05D1\u05F4\u05DD \u05D1, \u05D9\u05D3). \u05DE\u05E7\u05D5\u05DE\u05DD \u05D4\u05DE\u05D3\u05D5\u05D9\u05E7 \u05D1\u05EA\u05D5\u05DA \u05D4\u05E4\u05D9\u05E0\u05D4 \u05D5\u05D1\u05D2\u05D5\u05D1\u05D4 \u05D4\u05DB\u05D1\u05E9 \u05D0\u05D9\u05E0\u05D5 \u05E7\u05D1\u05D5\u05E2 \u05D1\u05DE\u05E7\u05D5\u05E8\u05D5\u05EA \u05D5\u05D4\u05D5\u05D0 \u05D1\u05D7\u05D9\u05E8\u05EA \u05DE\u05D5\u05D3\u05DC.",
          refs: [["\u05DE\u05D9\u05D3\u05D5\u05EA \u05D2, \u05D1", "Mishnah_Middot.3.2"]] }
      ];
      PLACES.unshift(["\u05EA\u05D9\u05E7\u05D5\u05E0\u05D9\u05DD \u05DC\u05E4\u05D9 \u05D4\u05DE\u05E9\u05E0\u05D4", CORRECTIONS]);
      for (const [gname, items] of PLACES) {
        const det = document.createElement("details");
        det.className = "tm-pl";
        const sm = document.createElement("summary");
        sm.textContent = gname;
        det.appendChild(sm);
        const box = document.createElement("div");
        for (const it of items) {
          const pb = document.createElement("button");
          pb.type = "button";
          pb.textContent = it.t;
          pb.addEventListener("click", () => {
            try {
              const fp0 = it.view ? fps[it.view] : null;
              const pos = fp0 ? fp0.pos : it.cam, tgt = fp0 ? fp0.target : it.tg;
              if (it["in"]) {
                if (!cutOn) {
                  autoCut = true;
                  setCutaway(true);
                }
              } else if (autoCut) {
                autoCut = false;
                setCutaway(false);
              }
              fly(pos, tgt);
            } catch (_) {
            }
            if (it.key) setInfo(it.key);
            else setInfo("__place", { text: it.info || "", refs: it.refs || [] });
            if (window.innerWidth < 640) {
              panel.style.display = "none";
              burger.textContent = "\u2630";
            }
            for (const o of btns) o.classList.remove("on");
            for (const o of placeBtns) o.classList.remove("on");
            pb.classList.add("on");
            try {
              infoBox.scrollIntoView({ block: "nearest" });
            } catch (_) {
            }
          });
          box.appendChild(pb);
          placeBtns.push(pb);
        }
        det.appendChild(box);
        panel.appendChild(det);
      }
      const secTog = document.createElement("div");
      secTog.className = "sec";
      secTog.textContent = "\u05EA\u05E6\u05D5\u05D2\u05D4";
      panel.appendChild(secTog);
      cutBox = toggleRow("\u05D7\u05EA\u05DA \u05E4\u05E0\u05D9\u05DD (\u05D4\u05E6\u05D2 \u05D0\u05EA \u05E4\u05E0\u05D9\u05DD \u05D4\u05D4\u05D9\u05DB\u05DC)", false, (on) => {
        autoCut = false;
        setCutaway(on);
      });
      toggleRow("\u05D7\u05D5\u05DE\u05D5\u05EA \u05E9\u05E7\u05D5\u05E4\u05D5\u05EA \u05DB\u05E9\u05D4\u05DF \u05D7\u05D5\u05E1\u05DE\u05D5\u05EA", true, (on) => {
        ctx2.shared.fadeState.on = on;
      });
      toggleRow("\u05EA\u05D5\u05D5\u05D9\u05D5\u05EA", true, (on) => {
        labelGroup.visible = on;
      });
      toggleRow("\u05E1\u05D9\u05D1\u05D5\u05D1 \u05D0\u05D9\u05D8\u05D9", false, (on) => {
        if (ctx2.controls) {
          ctx2.controls.autoRotate = on;
          ctx2.controls.autoRotateSpeed = 0.4;
        }
      });
      cloudRow = toggleRow("\u05E2\u05E0\u05DF \u05E1\u05D1\u05D9\u05D1 \u05E7\u05D5\u05D3\u05E9 \u05D4\u05E7\u05D3\u05E9\u05D9\u05DD", true, (on) => {
        if (on) {
          setCloud(true);
        } else {
          cloudRow.checked = true;
          askRemoveCloud(() => setCloud(false));
        }
      });
      panel.appendChild(infoBox);
      const units = document.createElement("div");
      units.id = "tm-units";
      units.textContent = "\u05D4\u05DE\u05D9\u05D3\u05D5\u05EA \u05D4\u05DF \u05D1\u05D0\u05DE\u05D5\u05EA \u05DC\u05E4\u05D9 \u05DE\u05E1\u05DB\u05EA \u05DE\u05D9\u05D3\u05D5\u05EA: \u05D9\u05D7\u05D9\u05D3\u05D4 \u05D0\u05D7\u05EA \u05D1\u05DE\u05D5\u05D3\u05DC = \u05D0\u05DE\u05D4 \u05D0\u05D7\u05EA (\u05DB-45\u201357 \u05E1\u05F4\u05DE, \u05DC\u05E4\u05D9 \u05D4\u05D3\u05E2\u05D5\u05EA). \u05DE\u05E2\u05DC\u05D4 = \u05D7\u05E6\u05D9 \u05D0\u05DE\u05D4 \u05D2\u05D5\u05D1\u05D4 \u05D5\u05D7\u05E6\u05D9 \u05D0\u05DE\u05D4 \u05E9\u05D8\u05D7.";
      panel.appendChild(units);
      const foot = document.createElement("div");
      foot.id = "tm-foot";
      foot.textContent = "\u05D2\u05E8\u05D5\u05E8 \u05DC\u05E1\u05D9\u05D1\u05D5\u05D1 \xB7 \u05D2\u05DC\u05D2\u05DC\u05EA \u05DC\u05D6\u05D5\u05DD \xB7 \u05E7\u05DC\u05D9\u05E7 \u05D9\u05DE\u05E0\u05D9 \u05DC\u05D4\u05D6\u05D6\u05D4";
      panel.appendChild(foot);
      const compass = document.createElement("div");
      compass.id = "tm-compass";
      const rotor = document.createElement("div");
      rotor.id = "tm-rotor";
      const arrow = document.createElement("div");
      arrow.className = "a";
      arrow.textContent = "\u25B2";
      const north = document.createElement("div");
      north.className = "n";
      north.textContent = "\u05E6";
      rotor.appendChild(arrow);
      rotor.appendChild(north);
      compass.appendChild(rotor);
      document.body.appendChild(compass);
      {
        const nav = document.createElement("div");
        nav.id = "tm-nav";
        const orbitBy = (dir) => {
          const cam = ctx2.camera, tg = ctx2.controls.target;
          const ox = cam.position.x - tg.x, oz = cam.position.z - tg.z, a = dir * 0.045, c = Math.cos(a), s2 = Math.sin(a);
          cam.position.x = tg.x + ox * c + oz * s2;
          cam.position.z = tg.z - ox * s2 + oz * c;
          ctx2.controls.update();
        };
        const zoomBy = (f) => {
          const cam = ctx2.camera, tg = ctx2.controls.target;
          const off = cam.position.clone().sub(tg);
          off.setLength(Math.min(ctx2.controls.maxDistance || 2200, Math.max(2, off.length() * f)));
          cam.position.copy(tg).add(off);
          ctx2.controls.update();
        };
        const mk = (txt, title, fn) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = txt;
          b.title = title;
          let iv = null;
          const stop = () => { if (iv) { clearInterval(iv); iv = null; } };
          b.addEventListener("pointerdown", (e) => { e.preventDefault(); stop(); fn(); iv = setInterval(fn, 40); });
          for (const ev of ["pointerup", "pointerleave", "pointercancel"]) b.addEventListener(ev, stop);
          nav.appendChild(b);
        };
        mk("\u27F2", "\u05E1\u05D1\u05D5\u05D1 \u05E9\u05DE\u05D0\u05DC\u05D4", () => orbitBy(-1));
        mk("\u27F3", "\u05E1\u05D1\u05D5\u05D1 \u05D9\u05DE\u05D9\u05E0\u05D4", () => orbitBy(1));
        mk("+", "\u05D4\u05D2\u05D3\u05DC\u05D4", () => zoomBy(0.97));
        mk("\u2212", "\u05D4\u05E7\u05D8\u05E0\u05D4", () => zoomBy(1.03));
        const sp = document.createElement("span");
        sp.className = "sp";
        nav.appendChild(sp);
        const rb = document.createElement("button");
        rb.type = "button";
        rb.id = "tm-nav-ruler";
        rb.textContent = "\uD83D\uDCCF";
        rb.title = "\u05DE\u05D3\u05D9\u05D3\u05D4 \u05D1\u05D0\u05DE\u05D5\u05EA";
        rb.addEventListener("click", () => mSet(!mOn));
        nav.appendChild(rb);
        document.body.appendChild(nav);
      }
      if (Array.isArray(ctx2.animated) && ctx2.camera && ctx2.controls && ctx2.controls.target) {
        ctx2.animated.push(function() {
          const az = Math.atan2(
            ctx2.camera.position.x - ctx2.controls.target.x,
            ctx2.camera.position.z - ctx2.controls.target.z
          );
          rotor.style.transform = "rotate(" + (az * 180 / Math.PI + 180).toFixed(2) + "deg)";
        });
      }
    } catch (e) {
      if (typeof console !== "undefined") console.error("[ui.js]", e);
    }
  }

