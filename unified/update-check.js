// update-check.js — ONLY in the single HTML file ("בית המקדש - לצפייה בלי אוצריא.html"); it is never part of the plugin (inside Otzaria
// the store updates the plugin). tools/build-unified.mjs writes it into each house's page of that file, after house-bridge.js.
// The user (10.11.2026): "בקובץ ה-HTML בלבד! הוסף מתג בסוף התפריט עם בדיקת עדכונים מגיט".
// What it does: a button at the END of the house's menu (#tm-panel). A click asks GitHub for the published version - the "version" of
// unified-plugin/manifest.json on the main branch of yoniny/beit-rishon (the folder the store publishes from) - and says whether a newer
// one exists, with a link to the plugin's page. Nothing is asked before the click, and nothing is sent but the request itself.
(function () {
  "use strict";
  var VER = "__PLUGIN_VERSION__", REPO = "yoniny/beit-rishon";
  var SRC = "https://raw.githubusercontent.com/" + REPO + "/main/unified-plugin/manifest.json";   // 2.0.2: the published folder of the unified plugin
  function cmp(a, b) {
    a = String(a).split("."); b = String(b).split(".");
    for (var i = 0; i < 3; i++) { var d = (+a[i] || 0) - (+b[i] || 0); if (d) return d; }
    return 0;
  }
  function build(panel) {
    var box = document.createElement("div");
    box.id = "tm-upd";
    box.style.cssText = "margin:12px 0 4px;padding-top:8px;border-top:1px solid rgba(201,168,76,.3)";
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = "בדיקת עדכונים";
    b.title = "בודק ב־GitHub אם פורסמה גרסה חדשה";
    b.style.cssText = "width:100%;padding:6px 8px;border-radius:6px;cursor:pointer;font:inherit;font-size:13px;background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.32);color:#e8dcae";
    var out = document.createElement("div");
    out.style.cssText = "font-size:12px;color:#b9ac82;margin-top:6px;line-height:1.5";
    out.textContent = "הגרסה שלפניך: " + VER;
    b.addEventListener("click", function () {
      b.disabled = true;
      out.textContent = "בודק…";
      fetch(SRC + "?t=" + Date.now(), { cache: "no-store" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).then(function (m) {
        var v = String((m && m.version) || "");
        if (!/^\d+\.\d+\.\d+$/.test(v)) throw new Error("no version");
        out.textContent = "";
        if (cmp(v, VER) > 0) {
          out.appendChild(document.createTextNode("יש גרסה חדשה: " + v + " (לפניך " + VER + "). "));
          var a = document.createElement("a");
          a.href = "https://github.com/" + REPO;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = "לדף התוסף ב־GitHub";
          a.style.color = "#f3dc9a";
          out.appendChild(a);
        } else {
          out.textContent = "הגרסה שלפניך (" + VER + ") היא העדכנית.";
        }
      }).catch(function () {
        out.textContent = "הבדיקה לא הצליחה: אין חיבור לרשת, או שהאתר אינו זמין. הגרסה שלפניך: " + VER;
      }).then(function () { b.disabled = false; });
    });
    box.appendChild(b);
    box.appendChild(out);
    panel.appendChild(box);
  }
  // the menu is built by the house's own code; the button is put at its end once the house is ready, and put back if the menu is rebuilt
  setInterval(function () {
    var p = document.getElementById("tm-panel");
    if (!p || !document.documentElement.classList.contains("tm-ready")) return;
    var box = document.getElementById("tm-upd");
    if (!box) build(p);
    else if (p.lastElementChild !== box) p.appendChild(box);
  }, 1500);
})();
