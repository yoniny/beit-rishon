// house-bridge.js — runs first inside each house's page (rishon/index.html, sheni/index.html) of the unified plugin "בית המקדש".
// The unified plugin's index.html (the shell) shows a choice screen and keeps each house in its own <iframe>; both iframes stay
// alive while the plugin is open, so going back to a house finds it exactly where it was left (camera, open card, toggles).
//
// The shell names each iframe "tm-house:<rishon|sheni>:<otz|web>" (window.name). Without that name (the page opened by itself)
// this script does nothing and the house runs as a standalone plugin.
//
// What it does inside a house:
//  1. window.Otzaria — a proxy over postMessage to the shell, which holds the real SDK. Only the top frame gets the SDK from
//     Otzaria (and on Windows the plugin's pages are file://, i.e. opaque origins: the frames cannot touch each other's objects),
//     so every call / subscription goes through messages. plugin.boot is replayed by the shell with the house's own version.
//  2. Pausing: while the house is hidden its requestAnimationFrame callbacks are held, so the hidden 3D model does not render.
//     A house that is still loading is not paused (the loading uses frames); it pauses as soon as it is ready (html.tm-ready).
//  3. Two buttons at the start of the house's top bar: "מעבר לבית שני / ראשון" and "מסך הבחירה".
//  4. (2.0.2) The words of Otzaria's search field: the shell's message "words" becomes the page's event "tm-words" (and
//     window.__tmWords until it is read); window.__tmGo(house, words) asks the shell for the other house with the same words.
(function () {
  "use strict";
  var m = /^tm-house:(rishon|sheni):(otz|web)$/.exec(window.name || "");
  if (!m || window.parent === window) return;
  var HOUSE = m[1], IN_OTZ = m[2] === "otz";
  var OTHER = HOUSE === "rishon" ? "sheni" : "rishon";
  var shell = window.parent;
  function post(msg) {
    msg.tmHouse = HOUSE;
    try { shell.postMessage(msg, "*"); } catch (_) {}
  }

  // ---------- 1. the SDK proxy ----------
  var handlers = {};          // event -> [callbacks]
  var pending = {};           // call id -> {resolve, reject}
  var nextId = 1;
  if (IN_OTZ) {
    var proxy = {
      on: function (evt, cb) {
        if (typeof cb !== "function") return function () {};
        var list = handlers[evt] || (handlers[evt] = []);
        list.push(cb);
        if (list.length === 1) post({ tm: "on", evt: String(evt) });
        return function () { proxy.off(evt, cb); };
      },
      off: function (evt, cb) {
        var list = handlers[evt];
        if (!list) return;
        var i = list.indexOf(cb);
        if (i >= 0) list.splice(i, 1);
      },
      call: function (method, params) {
        return new Promise(function (resolve, reject) {
          var id = HOUSE + ":" + (nextId++);
          pending[id] = { resolve: resolve, reject: reject };
          post({ tm: "call", id: id, method: String(method), params: params === undefined ? null : params });
        });
      }
    };
    try {
      Object.defineProperty(window, "Otzaria", { value: proxy, writable: false, configurable: false });
    } catch (_) {
      window.Otzaria = proxy;
    }
  }

  // ---------- 2. pausing ----------
  var nativeRaf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : null;
  var paused = false, wantPause = false, held = [];
  function ready() { return document.documentElement.classList.contains("tm-ready"); }
  if (nativeRaf) {
    window.requestAnimationFrame = function (cb) {
      return nativeRaf(function (t) {
        if (paused) held.push(cb);
        else cb(t);
      });
    };
  }
  function setPaused(p) {
    wantPause = p;
    if (p && !ready()) return;            // still loading: pause when ready (the observer below)
    if (paused === p) return;
    paused = p;
    if (!p && nativeRaf) {
      var list = held; held = [];
      for (var i = 0; i < list.length; i++) nativeRaf(list[i]);
      try { window.dispatchEvent(new Event("resize")); } catch (_) {}
    }
  }
  try {
    new MutationObserver(function () { if (wantPause && !paused && ready()) setPaused(true); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  } catch (_) {}

  function fire(evt, payload) {
    var list = (handlers[evt] || []).slice();
    for (var i = 0; i < list.length; i++) {
      try { list[i](payload); } catch (err) { console.error(err); }
    }
  }

  // ---------- messages from the shell ----------
  window.addEventListener("message", function (e) {
    if (e.source !== shell) return;
    var d = e.data;
    if (!d || typeof d !== "object" || typeof d.tm !== "string") return;
    if (d.tm === "event") {
      // Otzaria sends plugin.boot after the page's load event, when every script has registered its handlers; the shell may
      // have it already when the house's first script subscribes, so it waits here for the house's load, as in Otzaria
      if (d.evt === "plugin.boot" && document.readyState !== "complete") {
        window.addEventListener("load", function () { setTimeout(function () { fire(d.evt, d.payload); }, 0); }, { once: true });
        return;
      }
      fire(d.evt, d.payload);
    } else if (d.tm === "result") {
      var p = pending[d.id];
      if (!p) return;
      delete pending[d.id];
      if (d.ok) p.resolve(d.value);
      else {
        var er = new Error((d.error && d.error.message) || "error");
        if (d.error) { for (var k in d.error) { try { er[k] = d.error[k]; } catch (_) {} } }
        p.reject(er);
      }
    } else if (d.tm === "visible") {
      setPaused(!d.visible);
      if (d.visible) { try { window.focus(); } catch (_) {} }
    } else if (d.tm === "words") {
      // 2.0.2: the words of Otzaria's search field (the plugin's button in it), handed by the shell: { q, other: { house, name, n } }.
      // The house's 72-words.js shows them in its search section; when it is not built yet it finds them in window.__tmWords.
      window.__tmWords = d.detail || null;
      try { window.dispatchEvent(new CustomEvent("tm-words", { detail: d.detail })); } catch (_) {}
    }
  });
  // 2.0.2: for 72-words.js - "also in the other house": go there with the same words
  window.__tmGo = function (house, words) {
    post(words == null ? { tm: "switch", to: house } : { tm: "switch", to: house, words: String(words) });
  };

  // ---------- 3. the buttons in the top bar ----------
  var NAMES = { rishon: "בית ראשון", sheni: "בית שני" };
  var SVG_NS = "http://www.w3.org/2000/svg";
  function icon(paths) {
    var s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    paths.forEach(function (d) {
      var p = document.createElementNS(SVG_NS, "path");
      p.setAttribute("d", d);
      s.appendChild(p);
    });
    return s;
  }
  function button(id, order, paths, label, title, onClick) {
    var b = document.createElement("button");
    b.type = "button";
    b.id = id;
    b.className = "tm-topbtn tm-housebtn";
    b.dataset.order = String(order);
    b.title = title;
    b.setAttribute("aria-label", title);
    b.appendChild(icon(paths));
    var sp = document.createElement("span");
    sp.className = "lbl";
    sp.textContent = label;
    b.appendChild(sp);
    b.addEventListener("click", function (ev) { ev.stopPropagation(); onClick(); });
    b.addEventListener("keydown", function (ev) { ev.stopPropagation(); });
    return b;
  }
  var btnSwitch, btnHome;
  function placeButtons() {
    var nav = document.getElementById("tm-topbtns");
    if (!nav) return false;
    if (!btnSwitch) {
      // two arrows: the other house
      btnSwitch = button("tm-go-other", 1, ["M7 7h11l-3-3", "M17 17H6l3 3"], NAMES[OTHER],
        "מעבר ל" + NAMES[OTHER] + " (חוזר לאותו מקום)", function () { post({ tm: "switch", to: OTHER }); });
      // four squares: the choice screen
      btnHome = button("tm-go-home", 2, ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"], "מסך הבחירה",
        "חזרה למסך הבחירה", function () { post({ tm: "switch", to: "home" }); });
    }
    if (btnSwitch.parentNode !== nav) nav.insertBefore(btnSwitch, nav.firstChild);
    if (btnHome.parentNode !== nav) nav.insertBefore(btnHome, btnSwitch.nextSibling);
    return true;
  }
  function startButtons() {
    // the house hides its bar's buttons while the model loads (index.html: html:not(.tm-ready) #tm-topbtns); these two stay
    // visible, so one can go back while a house is still loading
    try {
      var st = document.createElement("style");
      st.textContent = "html:not(.tm-ready) #tm-topbtns{visibility:visible}" +
        "html:not(.tm-ready) #tm-topbtns>:not(.tm-housebtn){visibility:hidden}";
      document.head.appendChild(st);
    } catch (_) {}
    placeButtons();
    // 2.0.1: a light check twice a second instead of a MutationObserver on the whole body - that one ran on every change of the house's
    // page and cost about 140 ms while its panel was being built (headless measure)
    setInterval(function () {
      if (!btnSwitch || !btnSwitch.isConnected || !btnHome.isConnected) placeButtons();
    }, 500);
  }
  if (document.body) startButtons();
  else document.addEventListener("DOMContentLoaded", startButtons);

  post({ tm: "hello" });
})();
