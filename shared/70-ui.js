  //@@slot UI_SRC_NAME
  var ui_ICONS = {
    play: ['<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>'],
    stop: ['<rect x="6.5" y="6.5" width="11" height="11" rx="1.5" fill="currentColor" stroke="none"/>'],
    help: ['<circle cx="12" cy="12" r="9.2"/>', '<path d="M15.6 8.4l-2.3 6-6 2.3 2.3-6z" fill="currentColor" stroke="none"/>'],
    print: ['<path d="M7 9V4h10v5"/>', '<path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/>', '<path d="M7 14h10v6H7z"/>'],
    report: ['<path d="M5 21V4"/>', '<path d="M5 4h13l-2.5 4.5L18 13H5"/>'],
    news: ['<path d="M12 3.5l2.1 5.6 5.6 2.1-5.6 2.1L12 19l-2.1-5.7-5.6-2.1 5.6-2.1z" fill="currentColor" stroke="none"/>']
  };
  function ui_topIcon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = (ui_ICONS[name] || ui_ICONS.help).join("");
    return svg;
  }
  function ui_setTopBtn(el, icon, label) {
    const svg = el.querySelector("svg");
    if (icon) {
      const n = ui_topIcon(icon);
      if (svg) el.replaceChild(n, svg);
      else el.insertBefore(n, el.firstChild);
    }
    const sp = el.querySelector(".lbl");
    if (label != null) {
      if (sp) sp.textContent = label;
      else {
        const s2 = document.createElement("span");
        s2.className = "lbl";
        s2.textContent = label;
        el.appendChild(s2);
      }
    }
  }
  var ui_barCache = { w: -1, h: 56 };
  function ui_barH() {
    const w = window.innerWidth;
    if (w !== ui_barCache.w) {
      const b = document.querySelector("header.topbar");
      const h = b ? b.offsetHeight : 0;
      if (h) ui_barCache = { w, h };
      else return 56;
    }
    return ui_barCache.h;
  }
  function ui_srcIs(body) {
    if (!body || body.length > 70 || /[\u0591-\u05C7]/.test(body) || /[()]/.test(body)) return false;
    if (/^עמ['׳]\s?[א-ת]/.test(body)) return true;           // the book's page
    if (/'|(?:^|\s)["״]|["״](?:$|[\s,;.:])/.test(body)) return false;   // a quote inside: its words stay as they are
    if (UI_SRC_NAME.test(body)) return true;
    // chapter and verse ("ז, לח"), a daf ("צט.", "לג:"): letters that are a Hebrew number, so that "אבן, ברוש וזהב" is not taken for a source
    return /(?:^|\s)(?=[א-ת])[קרשת]?[יכלמנסעפצ]?[א-ט]?,\s?(?=[א-ת])[קרשת]?[יכלמנסעפצ]?[א-ט]?(?:$|[\s,;–-])/.test(body) || /(?:^|\s)(?=[א-ת])[קרשת]?[יכלמנסעפצ]?[א-ט]?[.:](?:$|[\s,;–-])/.test(body);
  }
  function ui_srcRuns(text) {
    const s = String(text == null ? "" : text), out = [];
    let q = "", from = 0;
    const edge = (c) => c === "" || /[\s(\[—–:,;.\-]/.test(c);
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === "'" || c === '"' || c === "״") {
        const p = i ? s[i - 1] : "", n = i + 1 < s.length ? s[i + 1] : "";
        if (q) { if (c === q && p !== " " && (n === "" || /[\s.,;:)\]—–?!]/.test(n))) q = ""; }
        // an opening: at a word's edge, or after one prefix letter (ו'נכח השלחן')
        else if ((edge(p) || (p !== "" && "ובלכשמה".indexOf(p) >= 0 && edge(i > 1 ? s[i - 2] : ""))) && n !== "" && n !== " ") q = c;
        continue;
      }
      if (c !== "(" || q) continue;
      const e = s.indexOf(")", i + 1);
      if (e < 0 || e - i > 72 || !ui_srcIs(s.slice(i + 1, e))) continue;
      if (i > from) out.push({ t: s.slice(from, i), s: false });
      out.push({ t: s.slice(i, e + 1), s: true, i });   // 1.0.2 (A): i = where the bracket stands in the text (the book named before it)
      from = e + 1;
      i = e;
    }
    if (from < s.length) out.push({ t: s.slice(from), s: false });
    return out;
  }
  // 1.0.2 (A): link(run, text) -> an element for a source's bracket (span.tm-src with links inside it) or null (a plain bracket); only the cards pass it
  function ui_fillSrc(el, text, link) {
    el.textContent = "";
    const full = String(text == null ? "" : text);
    for (const r of ui_srcRuns(full)) {
      if (!r.s) { el.appendChild(document.createTextNode(r.t)); continue; }
      let ln = null;
      if (typeof link === "function") {
        try { ln = link(r, full); } catch (_) { ln = null; }
      }
      if (ln) { el.appendChild(ln); continue; }
      const sp = document.createElement("span");
      sp.className = "tm-src";
      sp.textContent = r.t;
      el.appendChild(sp);
    }
  }
  // ===== 1.3.3 (the user: "שינוי ניסוח, עיצוב וחלוקה לפסקאות, הדגשת שמות מפרשים ודברים חשובים ללא הגדלת הכרטיס"): THE CARD'S TEXT, RICH.
  // A "\n" in a card's text starts a paragraph (a small gap, not a blank line); a paragraph's lead - its words up to the first colon, when they
  // are few and stand before any quote or full stop ("רש״י:", "במודל:", "לשון המשנה (מידות ד, א):", "• רבי יהודה:") - is bold, and so are the
  // commentators' and the sages' names (UI_RICH_NAMES) wherever they stand outside a quote; "**...**" marks an important phrase. A quote's own
  // words are never touched, and the sources' brackets stay links (ui_srcRuns). ui_fillRich(el, text, link) - the cards; ui_richHTML(text) -
  // the presentation (ctx.ui.smallSources); the print rebuilds from the card's own text (el.__raw). The line height drops a little (1.6 -> 1.5),
  // so that the gaps between the paragraphs do not make the card taller. =====
  var UI_RICH_NAMES = new RegExp("(?<=(?:^|[^א-ת׳״'\"])[ובלכשמהד]?)(?:" + [
    "תוספות יום טוב", "תפארת ישראל", "מצודת דוד", "מצודת ציון", "מצודות", "מלבי״ם", "רלב״ג", "רד״ק", "רש״י", "רש\"י", "אברבנאל", "תרגום יונתן", "תרגום שני", "התרגום",
    "הרמב״ם", "רמב״ם", "הראב״ד", "ראב״ד", "הברטנורא", "ברטנורא", "תוספות רי״ד", "התוספות", "תוספות", "רבינו שמעיה", "רבנו שמעיה", "הר״ש", "רי״ד", "ר״י",
    "המשנה למלך", "משנה למלך", "שלטי הגיבורים", "רבי אליעזר בן יעקב", "רבי יהודה בן לקיש", "יוסי ברבי יהודה", "רבי יהודה", "רבי יוסי", "רבי מאיר",
    "רבי אליעזר", "רבי שמעון איש המצפה", "רבי שמעון", "רבי עקיבא", "אבא שאול", "תנא קמא", "רב הונא", "אביי", "רבא",
    "ר׳ יצחק בר מרדכי", "ר׳ יצחק הבחור", "מלאכת שלמה", "הרב קאפח", "קאפח"
  ].join("|") + ")(?![א-ת])", "g");
  function ui_quoteMask(s) {   // 1 inside a quote (its marks too), by ui_srcRuns' own rule; a new paragraph ends an open quote
    const m = new Uint8Array(s.length);
    let q = "";
    const edge = (c) => c === "" || /[\s(\[—–:,;.\-]/.test(c);
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === "\n") { q = ""; continue; }
      if (c === "'" || c === '"' || c === "״") {
        const p = i ? s[i - 1] : "", n = i + 1 < s.length ? s[i + 1] : "";
        if (q) { if (c === q && p !== " " && (n === "" || /[\s.,;:)\]—–?!]/.test(n))) { m[i] = 1; q = ""; continue; } }
        else if ((edge(p) || (p !== "" && "ובלכשמה".indexOf(p) >= 0 && edge(i > 1 ? s[i - 2] : ""))) && n !== "" && n !== " ") { q = c; m[i] = 1; continue; }
      }
      if (q) m[i] = 1;
    }
    return m;
  }
  function ui_richSegs(text) {   // -> { plain (the text without the marks), segs: [{ p } | { src: run } | { t, b }] }
    const src0 = String(text == null ? "" : text);
    let plain = "";
    const bold = [];
    let on = false;
    for (let i = 0; i < src0.length; i++) {
      if (src0[i] === "*" && src0[i + 1] === "*") { on = !on; i++; continue; }
      plain += src0[i];
      bold.push(on ? 1 : 0);
    }
    const n = plain.length, B = Uint8Array.from(bold), Q = ui_quoteMask(plain);
    UI_RICH_NAMES.lastIndex = 0;
    for (let m; (m = UI_RICH_NAMES.exec(plain)); ) if (!Q[m.index]) B.fill(1, m.index, m.index + m[0].length);
    for (let ps = 0; ps <= n; ) {   // the paragraphs' leads
      let pe = plain.indexOf("\n", ps);
      if (pe < 0) pe = n;
      let a = ps;
      while (a < pe && /[\s•–-]/.test(plain[a])) a++;
      let depth = 0, c = -1, len = 0;
      for (let k = a; k < pe && len <= 60; k++) {   // 60 letters outside the brackets (a bracket's words do not count, its quotes neither)
        const ch = plain[k];
        if (Q[k] && !depth) break;
        if (!depth) len++;
        if (ch === "(") depth++;
        else if (ch === ")") depth = Math.max(0, depth - 1);
        else if (!depth && (k + 1 >= pe || /\s/.test(plain[k + 1]))) {
          if (ch === ":") { c = k; break; }
          if (ch === "." || ch === ";" || ch === "?") break;   // a sentence ended first: no lead
        }
      }
      if (c > a && /[א-ת][^]*[א-ת]/.test(plain.slice(a, c))) B.fill(1, a, c + 1);
      ps = pe + 1;
    }
    const segs = [];
    let pos = 0;
    for (const r of ui_srcRuns(plain)) {
      const e = pos + r.t.length;
      if (r.s) { segs.push({ src: r }); pos = e; continue; }
      let k0 = pos;
      for (let k = pos; k <= e; k++) {
        if (k < e && plain[k] !== "\n" && B[k] === B[k0]) continue;
        if (k > k0) segs.push({ t: plain.slice(k0, k), b: !!B[k0] });
        if (k < e && plain[k] === "\n") { segs.push({ p: true }); k0 = k + 1; }
        else k0 = k;
      }
      pos = e;
    }
    return { plain, segs };
  }
  function ui_fillRich(el, text, link, fold) {
    el.textContent = "";
    el.__raw = String(text == null ? "" : text);
    const R = ui_richSegs(el.__raw);
    let p = document.createElement("span");
    p.className = "p";
    el.appendChild(p);
    for (const sg of R.segs) {
      if (sg.p) {
        p = document.createElement("span");
        p.className = "p";
        el.appendChild(p);
        continue;
      }
      if (sg.src) {
        let ln = null;
        if (typeof link === "function") {
          try { ln = link(sg.src, R.plain); } catch (_) { ln = null; }
        }
        if (ln) { p.appendChild(ln); continue; }
        const sp = document.createElement("span");
        sp.className = "tm-src";
        sp.textContent = sg.src.t;
        p.appendChild(sp);
        continue;
      }
      if (sg.b) {
        const b = document.createElement("b");
        b.textContent = sg.t;
        p.appendChild(b);
      } else p.appendChild(document.createTextNode(sg.t));
    }
    //@@slot ui_fillRich-note
    if (fold && el.__raw.length > fold) {
      const ps = [...el.children].filter((c) => c.classList && c.classList.contains("p"));
      const tx = (c) => c.textContent.trim();
      let acc = 0, k = -1;
      for (let i = 0; i < ps.length; i++) { acc += ps[i].textContent.length; if (i >= 1 && acc > fold * 0.5) { k = i; break; } }
      if (k >= 0) {
        while (k + 1 < ps.length && (/:$/.test(tx(ps[k])) || /^•/.test(tx(ps[k + 1])))) k++;
        const rest = ps.slice(k + 1);
        const isModel = (c) => /^במודל/.test(tx(c));
        const keep = new Set(ps.some(isModel) ? rest.filter(isModel) : rest.filter((c) => /בחיר(ת|ות) (ה)?מודל/.test(c.textContent)));
        rest.forEach((c, i) => { if (keep.has(c) && /:$/.test(tx(c))) for (let j = i + 1; j < rest.length && /^•/.test(tx(rest[j])); j++) keep.add(rest[j]); });
        const hide = rest.filter((c) => !keep.has(c)), nH = hide.filter(tx).length;
        if (hide.reduce((n, c) => n + c.textContent.length, 0) > 200) {
          for (const c of hide) c.style.display = "none";
          const bt = document.createElement("button");
          bt.className = "tm-more";
          bt.textContent = "▾ המשך הכרטיס — " + (nH === 1 ? "עוד פסקה אחת" : "עוד " + nH + " פסקאות");
          bt.onclick = (e) => { e.stopPropagation(); for (const c of hide) c.style.display = ""; bt.remove(); };
          el.insertBefore(bt, hide[0]);
        }
      }
    }
  }
  function ui_richHTML(text) {
    const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return ui_richSegs(text).segs.map((sg) => (sg.p ? "<br>" : sg.src ? '<span class="tm-src">' + esc(sg.src.t) + "</span>" : sg.b ? "<b>" + esc(sg.t) + "</b>" : esc(sg.t))).join("");
  }
  // 1.1.0 (the user: "תסיר מקורות מעץ התפריט - שישארו רק בכרטיסים"): a label for the tree - the source brackets out (ui_srcRuns), the
  // dashes and spaces that led to them tidied; the full title stays on the item (the card, the presentation, the search)
  // 2.0.2 (the user: "הדגש דברים עיקריים במה חדש"): a line of "מה חדש" - plain text, and what stands between ** and ** in bold
  function ui_newsFill(el, text) {   // -> false: the line is not for this build ("@מאוחד ...": only inside the unified plugin "בית המקדש")
    let s0 = String(text == null ? "" : text);
    if (s0.indexOf("@מאוחד ") === 0) {
      if (!/^tm-house:/.test(window.name || "")) return false;
      s0 = s0.slice("@מאוחד ".length);
    }
    if (s0.indexOf("@גדול ") === 0) {   // 3.0.2 (the user, 18.11.2026: "תכתוב בבולד ובגדול"): a line in large letters, in a frame
      el.className = "big";
      s0 = s0.slice("@גדול ".length);
    }
    el.textContent = "";
    s0.split("**").forEach((t, i) => {
      if (!t) return;
      if (i % 2) {
        const b = document.createElement("b");
        b.textContent = t;
        el.appendChild(b);
      } else el.appendChild(document.createTextNode(t));
    });
    return true;
  }
  function ui_stripSrc(text) {
    const runs = ui_srcRuns(text);
    if (!runs.some((r) => r.s)) return String(text == null ? "" : text);
    let t = runs.filter((r) => !r.s).map((r) => r.t).join("");
    t = t.replace(/\s+/g, " ").replace(/\s*[—–-]\s*$/, "").replace(/^\s*[—–-]\s*/, "").replace(/\s+([,;:.])/g, "$1").replace(/[,;:]\s*$/, "").trim();
    return t || String(text);
  }
  //@@slot ui_smallSources
    return ui_richHTML(text);
  }
  // the label's text on a 2D canvas: the bracket in a clearly smaller font (28 of 48 px), so that a long label takes less of the view.
  // ui_labelText(c, text, font, fontSmall) measures and returns { w, draw(c, right, y) }, drawn from the right edge, right to left.
  function ui_labelText(c, text, font, fontSmall) {
    const runs = ui_srcRuns(text);
    let w = 0;
    for (const r of runs) {
      c.font = r.s ? fontSmall : font;
      r.w = c.measureText(r.t).width;
      w += r.w;
    }
    return {
      w,
      draw(c2, right, y) {
        c2.textAlign = "right";
        c2.textBaseline = "middle";
        c2.direction = "rtl";
        let x = right;
        for (const r of runs) {
          c2.font = r.s ? fontSmall : font;
          c2.fillStyle = "rgba(0,0,0,.85)";
          for (const o of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) c2.fillText(r.t, x + o[0], y + o[1]);
          c2.fillStyle = "#f3dc9a";
          c2.fillText(r.t, x, y);
          x -= r.w;
        }
      }
    };
  }
  //@@slot UI_ARK_TXT
  function ui_makeLabelSprite(text, size) {
    const font = '600 48px "Segoe UI", Arial', fontSmall = '600 28px "Segoe UI", Arial';
    const pad = 26;
    const cv = document.createElement("canvas");
    let c = cv.getContext("2d");
    const lt = ui_labelText(c, text, font, fontSmall);
    const tw = Math.max(8, Math.ceil(lt.w));
    cv.width = tw + pad * 2;
    cv.height = 48 + pad * 2;
    c = cv.getContext("2d");
    lt.draw(c, cv.width - pad, cv.height / 2);
    const tex = new CanvasTexture(cv);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const spr = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthTest: true, depthWrite: false }));
    const hAmot = (size || 4) * cv.height / 48;
    spr.scale.set(hAmot * cv.width / cv.height, hAmot, 1);
    return spr;
  }
  // UI_UNIFY_A2 (the user's decision 55/15): the Second Temple's source links in both houses - a bare "ch, m" after a named citation goes to
  // the same book, and the commentaries on the Mishnah (Bartenura, Tosafot Yom Tov, Tiferet Yisrael) go to their place (OTZ_CM, UI_SRC_CM)
  // 1.7.0 (stage 4): the commentaries on the Mishnah, by (chapter, mishnah) -> the first line of that mishnah in the book (tools/cm_links.json,
  // from the exports: the <h3> heading of the mishnah in the Bartenura and the Tosafot Yom Tov, the first se'if of the mishnah in the Yachin
  // (aligned by the dibbur ha-matchil), the chapter's note in the Boaz). Opened like the Mishnah: book id + line index.
  var OTZ_CM = {"89": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "1,5": 6, "1,6": 7, "1,7": 8, "1,8": 9, "1,9": 10, "2,1": 12, "2,2": 13, "2,3": 14, "2,4": 15, "2,5": 16, "2,6": 17, "3,1": 19, "3,2": 20, "3,3": 21, "3,4": 22, "3,5": 23, "3,6": 24, "3,7": 25, "3,8": 26, "4,1": 28, "4,2": 29, "4,3": 30, "4,4": 31, "4,5": 32, "4,6": 33, "4,7": 34, "5,1": 36, "5,2": 37, "5,3": 38, "5,4": 39}, "643": {"1,1": 3, "1,2": 12, "1,3": 14, "1,4": 21, "1,5": 28, "1,6": 33, "1,7": 41, "1,8": 46, "1,9": 53, "2,1": 60, "2,2": 63, "2,3": 68, "2,4": 81, "2,5": 86, "2,6": 98, "3,1": 108, "3,2": 124, "3,3": 129, "3,4": 136, "3,5": 143, "3,6": 151, "3,7": 159, "3,8": 165, "4,1": 171, "4,2": 176, "4,3": 180, "4,4": 184, "4,5": 186, "4,6": 191, "4,7": 199, "5,1": 208, "5,3": 216, "5,4": 220}, "948": {"1,1": 14, "1,2": 24, "1,3": 28, "1,4": 35, "1,5": 41, "1,6": 43, "1,7": 49, "1,8": 51, "1,9": 53, "2,1": 61, "2,2": 65, "2,3": 67, "2,4": 76, "2,5": 79, "2,6": 89, "3,1": 101, "3,2": 115, "3,3": 118, "3,4": 123, "3,5": 126, "3,6": 134, "3,7": 138, "3,8": 140, "4,1": 149, "4,2": 153, "4,3": 156, "4,4": 160, "4,5": 163, "4,6": 171, "4,7": 178, "5,1": 185, "5,2": 188, "5,3": 193, "5,4": 200}, "819": {"1,1": 3, "1,2": 25, "1,3": 47, "1,4": 65, "1,5": 77, "1,6": 89, "1,7": 103, "1,8": 109, "1,9": 123, "2,1": 146, "2,2": 158, "2,3": 176, "2,4": 208, "2,5": 218, "2,6": 260, "3,1": 313, "3,2": 354, "3,3": 366, "3,4": 380, "3,5": 412, "3,6": 432, "3,7": 440, "3,8": 456, "4,1": 479, "4,2": 505, "4,3": 521, "4,4": 535, "4,5": 551, "4,6": 577, "4,7": 595, "5,1": 626, "5,2": 644, "5,3": 658, "5,4": 672}, "1329": {"1,1": 3, "1,2": 4, "1,3": 5, "1,4": 6, "1,5": 7, "2,1": 9, "2,2": 10, "2,3": 11, "3,1": 13, "3,2": 14, "3,3": 15, "3,4": 16, "3,5": 17, "3,6": 18, "4,1": 20, "4,2": 21, "4,3": 22, "4,4": 23, "5,1": 25, "5,2": 26, "5,3": 27, "5,4": 28}, "88": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "2,1": 7, "2,2": 8, "2,3": 9, "2,4": 10, "2,5": 11, "3,1": 13, "3,2": 14, "3,3": 15, "3,4": 16, "3,5": 17, "3,6": 18, "3,7": 19, "3,8": 20, "3,9": 21, "4,1": 23, "4,2": 24, "4,3": 25, "5,1": 27, "5,2": 28, "5,3": 29, "5,4": 30, "5,5": 31, "5,6": 32, "6,1": 34, "6,2": 35, "6,3": 36, "7,1": 38, "7,2": 39, "7,3": 40, "7,4": 41}, "634": {"1,1": 3, "1,2": 23, "1,3": 29, "1,4": 32, "2,1": 39, "2,2": 45, "2,3": 51, "2,4": 56, "2,5": 61, "3,1": 69, "3,2": 78, "3,3": 84, "3,4": 88, "3,5": 93, "3,6": 100, "3,7": 107, "3,8": 113, "3,9": 121, "4,1": 133, "4,2": 141, "4,3": 151, "5,1": 163, "5,2": 168, "5,3": 172, "5,4": 176, "5,5": 181, "5,6": 192, "6,1": 200, "6,2": 207, "6,3": 211, "7,1": 219, "7,2": 223, "7,3": 233, "7,4": 245}, "944": {"1,1": 5, "1,2": 25, "1,3": 30, "1,4": 36, "2,1": 52, "2,2": 60, "2,3": 64, "2,4": 68, "2,5": 74, "3,1": 82, "3,2": 87, "3,3": 89, "3,4": 95, "3,5": 98, "3,6": 101, "3,7": 103, "3,8": 106, "3,9": 111, "4,1": 118, "4,2": 128, "4,3": 139, "5,1": 162, "5,2": 167, "5,3": 171, "5,4": 176, "5,5": 181, "5,6": 187, "6,1": 193, "6,2": 198, "6,3": 200, "7,1": 205, "7,2": 210, "7,3": 218, "7,4": 229}, "818": {"1,1": 3, "1,2": 57, "1,3": 77, "1,4": 97, "2,1": 132, "2,2": 148, "2,3": 162, "2,4": 178, "2,5": 190, "3,1": 209, "3,2": 235, "3,3": 243, "3,4": 257, "3,5": 267, "3,6": 289, "3,7": 305, "3,8": 325, "3,9": 345, "4,1": 374, "4,2": 392, "4,3": 428, "5,1": 501, "5,2": 521, "5,3": 527, "5,4": 535, "5,5": 547, "5,6": 573, "6,1": 588, "6,2": 602, "6,3": 606, "7,1": 631, "7,2": 643, "7,3": 671, "7,4": 719}, "1330": {"1,1": 3, "1,2": 4, "1,3": 5, "3,1": 7, "3,2": 8, "3,3": 9, "3,4": 10, "3,5": 11, "4,1": 13, "5,1": 15, "5,2": 16, "5,3": 17, "7,1": 19}, "54": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "1,5": 6, "1,6": 7, "1,7": 8, "2,1": 10, "2,2": 11, "2,3": 12, "2,4": 13, "2,5": 14, "3,1": 16, "3,2": 17, "3,3": 18, "3,4": 19, "4,1": 21, "4,2": 22, "4,3": 23, "4,4": 24, "4,5": 25, "4,6": 26, "4,7": 27, "4,8": 28, "4,9": 29, "5,1": 31, "5,2": 32, "5,3": 33, "5,4": 34, "5,5": 35, "5,6": 36, "6,1": 38, "6,2": 39, "6,3": 40, "6,4": 41, "6,5": 42, "6,6": 43, "7,1": 45, "7,2": 46, "7,3": 47, "7,4": 48, "7,5": 49, "7,6": 50, "7,7": 51, "8,1": 53, "8,2": 54, "8,3": 55, "8,4": 56, "8,5": 57, "8,6": 58, "8,7": 59, "8,8": 60}, "593": {"1,1": 3, "1,2": 13, "1,3": 16, "1,4": 27, "1,5": 31, "1,6": 36, "1,7": 44, "2,1": 54, "2,2": 63, "2,3": 69, "2,4": 75, "2,5": 82, "3,1": 94, "3,2": 99, "3,3": 105, "3,4": 108, "4,1": 113, "4,2": 119, "4,3": 129, "4,4": 134, "4,5": 145, "4,6": 152, "4,7": 157, "4,8": 161, "4,9": 165, "5,1": 172, "5,2": 190, "5,3": 194, "5,4": 200, "5,5": 204, "5,6": 208, "6,1": 212, "6,2": 217, "6,3": 221, "6,4": 232, "6,5": 238, "6,6": 244, "7,1": 249, "7,2": 254, "7,3": 259, "7,4": 269, "7,5": 274, "7,6": 277, "7,7": 284, "8,1": 290, "8,2": 294, "8,3": 300, "8,4": 310, "8,5": 317, "8,6": 323, "8,7": 327, "8,8": 329}, "893": {"1,1": 5, "1,2": 11, "1,3": 13, "1,4": 21, "1,5": 24, "1,6": 28, "1,7": 34, "2,1": 39, "2,2": 46, "2,3": 49, "2,4": 51, "2,5": 54, "3,1": 59, "3,2": 65, "3,3": 70, "3,4": 72, "4,1": 76, "4,2": 81, "4,3": 85, "4,4": 87, "4,5": 91, "4,6": 96, "4,8": 101, "4,9": 104, "5,1": 113, "5,2": 121, "5,3": 125, "5,4": 130, "5,5": 132, "5,6": 134, "6,1": 137, "6,2": 139, "6,3": 142, "6,4": 150, "6,5": 154, "6,6": 160, "7,1": 164, "7,2": 168, "7,3": 172, "7,4": 177, "7,5": 181, "7,6": 184, "7,7": 194, "8,1": 199, "8,2": 202, "8,3": 208, "8,4": 215, "8,5": 219, "8,7": 224, "8,8": 226}, "768": {"1,1": 3, "1,2": 19, "1,3": 27, "1,4": 45, "1,5": 51, "1,6": 59, "1,7": 83, "2,1": 98, "2,2": 116, "2,3": 132, "2,4": 144, "2,5": 156, "3,1": 183, "3,2": 195, "3,3": 209, "3,4": 213, "4,1": 228, "4,2": 238, "4,3": 254, "4,4": 262, "4,5": 280, "4,6": 298, "4,7": 312, "4,8": 328, "4,9": 336, "5,1": 351, "5,2": 385, "5,3": 395, "5,4": 415, "5,5": 423, "5,6": 431, "6,1": 434, "6,2": 442, "6,3": 450, "6,4": 480, "6,5": 492, "6,6": 510, "7,1": 525, "7,2": 539, "7,3": 551, "7,4": 571, "7,5": 581, "7,6": 587, "7,7": 603, "8,1": 616, "8,2": 626, "8,3": 636, "8,4": 658, "8,5": 674, "8,6": 686, "8,7": 694, "8,8": 696}, "1279": {"2,1": 3, "2,2": 4, "2,3": 5, "4,1": 7, "5,1": 9, "5,2": 10, "6,1": 12, "7,1": 14, "7,2": 15, "7,3": 16, "8,1": 18, "8,2": 19, "8,3": 20, "8,4": 21}, "55": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "1,5": 6, "1,6": 7, "1,7": 8, "1,8": 9, "2,1": 11, "2,2": 12, "2,3": 13, "2,4": 14, "2,5": 15, "2,6": 16, "2,7": 17, "3,1": 19, "3,2": 20, "3,3": 21, "3,4": 22, "3,5": 23, "3,6": 24, "3,7": 25, "3,8": 26, "3,9": 27, "3,10": 28, "3,11": 29, "4,1": 31, "4,2": 32, "4,3": 33, "4,4": 34, "4,5": 35, "4,6": 36, "5,1": 38, "5,2": 39, "5,3": 40, "5,4": 41, "5,5": 42, "5,6": 43, "5,7": 44, "6,1": 46, "6,2": 47, "6,3": 48, "6,4": 49, "6,5": 50, "6,6": 51, "6,7": 52, "6,8": 53, "7,1": 55, "7,2": 56, "7,3": 57, "7,4": 58, "7,5": 59, "8,1": 61, "8,2": 62, "8,3": 63, "8,4": 64, "8,5": 65, "8,6": 66, "8,7": 67, "8,8": 68, "8,9": 69}, "582": {"1,1": 3, "1,2": 8, "1,3": 14, "1,4": 20, "1,5": 22, "1,6": 29, "1,7": 32, "1,8": 37, "2,1": 45, "2,2": 53, "2,3": 56, "2,4": 73, "2,5": 77, "2,6": 82, "2,7": 85, "3,1": 90, "3,2": 97, "3,3": 101, "3,4": 106, "3,5": 113, "3,6": 119, "3,7": 124, "3,8": 130, "3,9": 134, "3,10": 139, "3,11": 147, "4,1": 155, "4,2": 161, "4,3": 166, "4,4": 170, "4,5": 180, "4,6": 183, "5,1": 189, "5,2": 205, "5,3": 207, "5,4": 213, "5,5": 218, "5,6": 220, "5,7": 226, "6,1": 233, "6,2": 241, "6,3": 243, "6,4": 246, "6,5": 252, "6,6": 255, "6,7": 260, "6,8": 268, "7,1": 274, "7,2": 292, "7,3": 294, "7,4": 298, "7,5": 300, "8,1": 304, "8,2": 311, "8,3": 314, "8,4": 317, "8,5": 322, "8,6": 326, "8,7": 334, "8,8": 338, "8,9": 342}, "898": {"1,1": 5, "1,2": 10, "1,3": 14, "1,4": 16, "1,5": 18, "1,7": 23, "1,8": 26, "2,1": 30, "2,2": 36, "2,3": 39, "2,4": 45, "2,5": 48, "2,6": 53, "2,7": 55, "3,1": 60, "3,2": 63, "3,3": 66, "3,4": 74, "3,5": 83, "3,6": 88, "3,7": 93, "3,8": 98, "3,9": 106, "3,10": 109, "3,11": 115, "4,1": 119, "4,2": 121, "4,3": 127, "4,4": 134, "4,5": 140, "4,6": 144, "5,1": 149, "5,2": 163, "5,3": 167, "5,4": 171, "5,5": 176, "5,6": 182, "5,7": 187, "6,1": 191, "6,2": 196, "6,3": 202, "6,4": 205, "6,5": 209, "6,6": 211, "6,7": 215, "6,8": 221, "7,1": 227, "7,2": 238, "7,3": 240, "7,4": 245, "7,5": 248, "8,1": 252, "8,2": 256, "8,3": 260, "8,5": 264, "8,6": 267, "8,7": 273, "8,8": 276, "8,9": 280}, "762": {"1,1": 3, "1,2": 13, "1,3": 23, "1,4": 41, "1,5": 43, "1,6": 63, "1,7": 69, "1,8": 81, "2,1": 96, "2,2": 116, "2,3": 120, "2,4": 154, "2,5": 160, "2,6": 174, "2,7": 180, "3,1": 189, "3,2": 203, "3,3": 217, "3,4": 227, "3,5": 243, "3,6": 251, "3,7": 255, "3,8": 267, "3,9": 281, "3,10": 295, "3,11": 317, "4,1": 330, "4,2": 348, "4,3": 366, "4,4": 384, "4,5": 408, "4,6": 416, "5,1": 425, "5,2": 469, "5,3": 479, "5,4": 491, "5,5": 499, "5,6": 507, "5,7": 523, "6,1": 534, "6,2": 564, "6,3": 574, "6,4": 576, "6,5": 590, "6,6": 596, "6,7": 606, "6,8": 620, "7,1": 633, "7,2": 685, "7,3": 687, "7,4": 701, "7,5": 709, "8,1": 730, "8,2": 746, "8,3": 752, "8,4": 766, "8,5": 774, "8,6": 784, "8,7": 802, "8,8": 814, "8,9": 826}, "1281": {"1,1": 3, "1,2": 4, "1,3": 5, "2,1": 7, "2,2": 8, "3,1": 10, "6,1": 12, "8,1": 14, "8,2": 15, "8,3": 16}, "81": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "2,1": 7, "2,2": 8, "2,3": 9, "2,4": 10, "2,5": 11, "3,1": 13, "3,2": 14, "3,3": 15, "3,4": 16, "3,5": 17, "3,6": 18, "3,7": 19, "4,1": 21, "4,2": 22, "4,3": 23, "4,4": 24, "4,5": 25, "5,1": 27, "5,2": 28, "5,3": 29, "5,4": 30, "5,5": 31, "5,6": 32, "5,7": 33, "5,8": 34, "5,9": 35, "6,1": 37, "6,2": 38, "6,3": 39, "6,4": 40, "6,5": 41, "6,6": 42, "6,7": 43, "7,1": 45, "7,2": 46, "7,3": 47, "7,4": 48, "7,5": 49, "7,6": 50, "8,1": 52, "8,2": 53, "8,3": 54, "8,4": 55, "8,5": 56, "8,6": 57, "8,7": 58, "9,1": 60, "9,2": 61, "9,3": 62, "9,4": 63, "9,5": 64, "9,6": 65, "9,7": 66, "9,8": 67, "9,9": 68, "10,1": 70, "10,2": 71, "10,3": 72, "10,4": 73, "10,5": 74, "10,6": 75, "10,7": 76, "10,8": 77, "10,9": 78, "11,1": 80, "11,2": 81, "11,3": 82, "11,4": 83, "11,5": 84, "11,6": 85, "11,7": 86, "11,8": 87, "11,9": 88, "12,1": 90, "12,2": 91, "12,3": 92, "12,4": 93, "12,5": 94, "13,1": 96, "13,2": 97, "13,3": 98, "13,4": 99, "13,5": 100, "13,6": 101, "13,7": 102, "13,8": 103, "13,9": 104, "13,10": 105, "13,11": 106}, "635": {"1,1": 3, "1,2": 11, "1,3": 22, "1,4": 34, "2,1": 43, "2,2": 47, "2,3": 56, "2,4": 58, "2,5": 62, "3,1": 70, "3,2": 77, "3,3": 89, "3,4": 96, "3,5": 102, "3,6": 109, "3,7": 124, "4,1": 132, "4,2": 139, "4,3": 142, "4,4": 153, "4,5": 158, "5,1": 167, "5,2": 174, "5,3": 177, "5,4": 188, "5,5": 193, "5,6": 198, "5,7": 208, "5,8": 216, "5,9": 222, "6,1": 231, "6,2": 238, "6,3": 241, "6,4": 248, "6,5": 253, "6,6": 261, "6,7": 266, "7,1": 270, "7,2": 278, "7,3": 290, "7,4": 299, "7,5": 307, "7,6": 312, "8,1": 317, "8,2": 327, "8,3": 339, "8,4": 344, "8,5": 362, "8,6": 364, "8,7": 372, "9,1": 381, "9,2": 386, "9,3": 394, "9,4": 402, "9,5": 412, "9,6": 420, "9,7": 423, "9,8": 431, "9,9": 441, "10,1": 448, "10,2": 452, "10,3": 456, "10,4": 467, "10,5": 480, "10,6": 489, "10,7": 496, "10,8": 504, "10,9": 511, "11,1": 523, "11,2": 528, "11,3": 532, "11,4": 535, "11,5": 540, "11,6": 551, "11,7": 558, "11,8": 573, "11,9": 582, "12,1": 591, "12,2": 594, "12,3": 602, "12,4": 606, "12,5": 612, "13,1": 620, "13,2": 626, "13,3": 635, "13,4": 639, "13,5": 644, "13,6": 650, "13,7": 656, "13,8": 664, "13,9": 670, "13,10": 678}, "950": {"1,1": 5, "1,2": 14, "1,3": 26, "2,1": 38, "2,2": 40, "2,3": 44, "2,4": 47, "2,5": 50, "3,1": 55, "3,2": 58, "3,3": 67, "3,4": 71, "3,5": 74, "3,6": 81, "3,7": 84, "4,1": 91, "4,2": 98, "4,3": 101, "4,4": 107, "4,5": 118, "5,1": 124, "5,2": 128, "5,3": 132, "5,4": 136, "5,5": 141, "5,6": 145, "5,7": 151, "5,8": 153, "5,9": 156, "6,1": 159, "6,2": 163, "6,3": 168, "6,4": 174, "6,5": 181, "6,6": 185, "6,7": 187, "7,1": 191, "7,2": 195, "7,3": 199, "7,4": 205, "7,5": 213, "7,6": 216, "8,1": 222, "8,2": 228, "8,3": 233, "8,4": 238, "8,6": 244, "8,7": 247, "9,1": 253, "9,2": 256, "9,3": 261, "9,4": 268, "9,5": 274, "9,6": 281, "9,7": 285, "9,8": 293, "9,9": 302, "10,1": 306, "10,2": 308, "10,3": 310, "10,4": 315, "10,5": 322, "10,6": 329, "10,7": 334, "10,8": 340, "10,9": 344, "11,1": 355, "11,2": 361, "11,3": 367, "11,4": 371, "11,5": 377, "11,6": 383, "11,7": 391, "11,8": 401, "11,9": 405, "12,1": 411, "12,2": 417, "12,3": 421, "12,4": 423, "12,5": 431, "13,1": 436, "13,2": 439, "13,3": 442, "13,4": 449, "13,5": 453, "13,6": 458, "13,7": 461, "13,8": 465, "13,9": 467, "13,10": 471, "13,11": 480}, "814": {"1,1": 3, "1,2": 27, "1,3": 63, "1,4": 91, "2,1": 108, "2,2": 120, "2,3": 140, "2,4": 148, "2,5": 154, "3,1": 165, "3,2": 175, "3,3": 209, "3,4": 227, "3,5": 241, "3,6": 251, "3,7": 285, "4,1": 296, "4,2": 306, "4,3": 312, "4,4": 332, "4,5": 352, "5,1": 369, "5,2": 383, "5,3": 393, "5,4": 413, "5,5": 419, "5,6": 423, "5,7": 451, "5,8": 465, "5,9": 477, "6,1": 488, "6,2": 501, "6,3": 517, "6,4": 533, "6,5": 543, "6,6": 563, "6,7": 569, "7,1": 574, "7,2": 592, "7,3": 612, "7,6": 630, "8,1": 665, "8,2": 675, "8,3": 695, "8,4": 705, "8,5": 739, "8,6": 743, "8,7": 763, "9,1": 782, "9,2": 792, "9,3": 808, "9,4": 826, "9,5": 844, "9,6": 866, "9,7": 870, "9,8": 882, "9,9": 898, "10,1": 913, "10,2": 927, "10,3": 933, "10,4": 963, "10,5": 997, "10,6": 1015, "10,7": 1029, "10,8": 1037, "10,9": 1051, "11,1": 1072, "11,2": 1086, "11,3": 1094, "11,4": 1100, "11,5": 1114, "11,6": 1134, "11,7": 1156, "11,8": 1190, "11,9": 1212, "12,1": 1233, "12,2": 1245, "12,3": 1265, "12,4": 1269, "12,5": 1291, "13,1": 1306, "13,2": 1316, "13,3": 1332, "13,4": 1342, "13,5": 1354, "13,6": 1366, "13,7": 1378, "13,8": 1394, "13,9": 1400, "13,10": 1418, "13,11": 1438}, "1327": {"3,1": 3, "5,1": 5, "10,1": 7, "10,2": 8, "10,3": 9, "11,1": 11, "11,2": 12, "11,3": 13, "12,1": 15, "12,2": 16, "13,1": 18, "13,2": 19, "13,3": 20, "13,4": 21}, "56": {"1,1": 2, "1,2": 3, "1,3": 4, "1,4": 5, "1,5": 6, "1,6": 7, "1,7": 8, "1,8": 9, "1,9": 10, "1,10": 11, "1,11": 12, "2,1": 14, "2,2": 15, "2,3": 16, "2,4": 17, "2,5": 18, "2,6": 19, "2,7": 20, "2,8": 21, "2,9": 22, "3,1": 24, "3,2": 25, "3,3": 26, "3,4": 27, "3,5": 28, "3,6": 29, "3,7": 30, "3,8": 31, "3,9": 32, "3,10": 33, "3,11": 34, "3,12": 35, "3,13": 36, "3,14": 37, "3,15": 38, "4,1": 40, "4,2": 41, "4,3": 42, "4,4": 43, "4,5": 44, "4,6": 45, "4,7": 46, "4,8": 47, "4,9": 48, "4,10": 49, "5,1": 51, "5,2": 52, "5,3": 53, "5,4": 54, "5,5": 55, "5,6": 56, "5,7": 57, "5,8": 58}, "588": {"1,1": 3, "1,2": 11, "1,3": 15, "1,4": 20, "1,5": 28, "1,6": 33, "1,7": 35, "1,8": 41, "1,9": 46, "1,10": 53, "1,11": 59, "2,1": 66, "2,2": 71, "2,3": 74, "2,4": 84, "2,5": 89, "2,6": 92, "2,7": 97, "2,8": 99, "2,9": 102, "3,1": 107, "3,2": 119, "3,3": 124, "3,4": 128, "3,5": 131, "3,6": 136, "3,7": 144, "3,8": 147, "3,9": 150, "3,10": 156, "3,11": 160, "3,12": 165, "3,13": 170, "3,14": 173, "3,15": 175, "4,1": 183, "4,2": 191, "4,3": 194, "4,4": 196, "4,5": 202, "4,6": 206, "4,7": 209, "4,8": 212, "4,9": 216, "4,10": 231, "5,1": 236, "5,2": 240, "5,3": 243, "5,4": 247, "5,5": 257, "5,6": 267, "5,7": 274, "5,8": 284}, "899": {"1,1": 5, "1,2": 13, "1,3": 17, "1,4": 21, "1,5": 29, "1,6": 33, "1,7": 37, "1,8": 43, "1,9": 49, "1,10": 51, "1,11": 56, "2,1": 61, "2,2": 66, "2,3": 71, "2,4": 76, "2,5": 82, "2,6": 88, "2,7": 93, "2,8": 98, "2,9": 103, "3,1": 109, "3,2": 121, "3,3": 126, "3,4": 135, "3,5": 141, "3,6": 150, "3,7": 161, "3,8": 165, "3,9": 170, "3,10": 176, "3,11": 180, "3,12": 184, "3,13": 189, "3,14": 191, "3,15": 193, "4,1": 197, "4,2": 200, "4,3": 204, "4,4": 207, "4,5": 212, "4,6": 225, "4,7": 228, "4,8": 230, "4,9": 233, "4,10": 243, "5,1": 247, "5,2": 252, "5,3": 258, "5,4": 261, "5,5": 273, "5,6": 278, "5,7": 282, "5,8": 291}, "772": {"1,1": 3, "1,2": 21, "1,3": 27, "1,4": 39, "1,5": 59, "1,6": 67, "1,7": 73, "1,8": 85, "1,9": 95, "1,10": 105, "1,11": 115, "2,1": 136, "2,2": 144, "2,3": 156, "2,4": 166, "2,5": 180, "2,6": 190, "2,7": 200, "2,8": 204, "2,9": 210, "3,1": 219, "3,2": 249, "3,3": 255, "3,4": 267, "3,5": 271, "3,6": 287, "3,7": 311, "3,8": 315, "3,9": 325, "3,10": 337, "3,11": 343, "3,12": 353, "3,13": 361, "3,14": 369, "3,15": 371, "4,1": 386, "4,2": 404, "4,3": 408, "4,4": 410, "4,5": 426, "4,6": 444, "4,7": 456, "4,8": 458, "4,9": 466, "4,10": 498, "5,1": 505, "5,2": 511, "5,3": 527, "5,4": 533, "5,5": 565, "5,6": 587, "5,7": 617, "5,8": 643}, "1284": {"3,1": 3}};
  //@@slot ui_GENERAL
  function ui_gematria(s) {
    const V = { "א": 1, "ב": 2, "ג": 3, "ד": 4, "ה": 5, "ו": 6, "ז": 7, "ח": 8, "ט": 9, "י": 10, "כ": 20, "ל": 30, "מ": 40, "נ": 50, "ס": 60, "ע": 70, "פ": 80, "צ": 90, "ק": 100, "ר": 200, "ש": 300, "ת": 400 };
    let n = 0;
    for (const ch of s) n += V[ch] || 0;
    return n;
  }
  // V(book, chapter, verse) -> Tanach verse; P(book, "צח:") -> Talmud page; MI(ch, m) -> Mishnah Middot; RB(ch, h) -> Rambam Beit HaBechira (h = 0: chapter heading)
  function ui_V(book, ch, v) {
    const base = ui_BASE[book] && ui_BASE[book][ch];
    return { book, index: base == null ? null : base + v };
  }
  function ui_P(book, page) {
    const idx = ui_PAGES[book] && ui_PAGES[book][page];
    return { book, index: idx == null ? null : idx };
  }
  function ui_MI(ch, m) {
    return { book: 89, index: ui_BASE[89][ch] + (m || 0) };
  }
  function ui_RB(ch, h) {
    return { book: 337, index: ui_BASE[337][ch] + (h || 0) };
  }
  // 1.0.1-K: MN(book, ch, m) -> a Mishnah of another tractate (Sanhedrin 73, Menachot 81, Tamid 88, Kelim 91), like MI for Middot
  function ui_MN(book, ch, m) {
    const base = ui_BASE[book] && ui_BASE[book][ch];
    return { book, index: base == null ? null : base + (m || 0) };
  }
  // A plain Sefaria-style string ref ("Mishnah_Middot.4.7", "I_Kings.6.6") -> Otzaria position, when the book is known.
  function ui_sefToOtz(ref) {
    //@@slot ui_sefToOtz.mm
  // 1.7.0 (stage 4): a commentary named before a Mishnah tractate in the brackets -> that commentary's book, at the mishnah (OTZ_CM)
  var UI_SRC_CM_B = { 89: 643, 88: 634, 54: 593, 55: 582, 81: 635, 56: 588 }, UI_SRC_CM_T = { 89: 948, 88: 944, 54: 893, 55: 898, 81: 950, 56: 899 },
    UI_SRC_CM_Y = { 89: 819, 88: 818, 54: 768, 55: 762, 81: 814, 56: 772 }, UI_SRC_CM_Z = { 89: 1329, 88: 1330, 54: 1279, 55: 1281, 81: 1327, 56: 1284 };
  var UI_SRC_CM = { "ברטנורא": UI_SRC_CM_B, 'רע"ב': UI_SRC_CM_B, "תוספות יום טוב": UI_SRC_CM_T, 'תוי"ט': UI_SRC_CM_T,
    "תפארת ישראל": UI_SRC_CM_Y, "יכין": UI_SRC_CM_Y, "בועז": UI_SRC_CM_Z };
  var UI_SRC_NUM = /^[קרשת]{0,2}(?:[יכלמנסעפצ]?[א-ט]?|טו|טז)$/;
  function ui_srcNorm(s) {
    return String(s || "").replace(/[֑-ׇ]/g, "").replace(/[״"]/g, '"').replace(/[׳']/g, "'").replace(/\s+/g, " ").replace(/^[\s,;]+|[\s,;]+$/g, "");
  }
  // "ז, טו–כב" -> "ז, טו"; "ו–ז" stays (no verse: it is not read)
  function ui_srcNoRange(s) {
    return s.replace(/(,\s?[א-ת"']{1,5})\s*[–-]\s*[א-ת"']{1,5}$/, "$1").replace(/([א-ת"']{1,5}[.:])\s*[–-]\s*[א-ת"']{1,5}[.:]?$/, "$1");
  }
  function ui_srcNum(t) {
    const s = String(t || "").replace(/["']/g, "");
    return s && UI_SRC_NUM.test(s) ? ui_gematria(s) : 0;
  }
  // the last Tanach book named at the head of a bracket in text before `pos` (a bracket with a quote counts too: it names its book), or null
  function ui_srcLastBook(text, pos) {
    const s = ui_srcNorm(String(text || "").slice(0, Math.max(0, pos || 0)));
    const re = /\((?:(?:רש"י|רד"ק|מצודת דוד|מצודת ציון|מצודות|מלבי"ם|רלב"ג|תרגום יונתן|תרגום|ראו|וראו)\s+)?(מלכים א|מלכים ב|דברי הימים א|דברי הימים ב|דה"י א|דה"י ב|ירמיהו|ירמיה|שמות|ויקרא|במדבר|שיר השירים|קהלת)\s/g;
    let m, last = null;
    while ((m = re.exec(s))) last = UI_SRC_TN[m[1]] || null;
    return last;
  }
  // one part (normalized, its range end dropped) -> { book, index } or null; bareBook = the book of a bare "ז, כו" (null: not read)
  function ui_srcParse(p, bareBook) {
    p = String(p || "").replace(/ ע"א$/, ".").replace(/ ע"ב$/, ":");   // Beit Sheni: the amud as ע״א / ע״ב (ui_srcNorm made the quote plain)
    const tal = /^(.+?) ([א-ת"']{1,5}[.:])$/.exec(p);
    if (tal && UI_SRC_TAL[tal[1]]) {
      const b = UI_SRC_TAL[tal[1]], pg = tal[2].replace(/["']/g, "");
      const idx = ui_PAGES[b] && ui_PAGES[b][pg];
      return idx == null ? null : { book: b, index: idx };
    }
    const m = /^(?:(.+?) )?([א-ת"']{1,5}), ?([א-ת"']{1,5})$/.exec(p);
    if (!m) return null;
    const ch = ui_srcNum(m[2]), v = ui_srcNum(m[3]);
    if (!ch || !v) return null;
    let book = null;
    const name = m[1] || "";
    if (!name) book = bareBook;
    else if (UI_SRC_TN[name]) book = UI_SRC_TN[name];
    else if (UI_SRC_MI[name]) book = UI_SRC_MI[name];
    else {
      for (const pre of Object.keys(UI_SRC_CM)) {   // 1.7.0: "ברטנורא מידות ב, ג" -> the Bartenura at 2:3
        if (name.indexOf(pre + " ") !== 0) continue;
        const tr = UI_SRC_MI[name.slice(pre.length + 1)], cb = tr && UI_SRC_CM[pre][tr];
        if (!cb || !OTZ_CM[cb]) break;
        const i = OTZ_CM[cb][ch + "," + v];
        return i == null ? null : { book: cb, index: i };
      }
      for (const pre of UI_SRC_PRE) {
        if (name === pre) { book = bareBook; break; }
        if (name.indexOf(pre + " ") === 0) { book = UI_SRC_TN[name.slice(pre.length + 1)] || null; break; }
      }
    }
    const B = book != null && ui_BASE[book];
    if (!B || B[ch] == null) return null;
    const idx = B[ch] + v;
    if (B[ch + 1] != null && idx >= B[ch + 1]) return null;   // past the chapter's end (books 10 and 39 have all their chapters)
    return { book, index: idx };
  }
  //@@slot UI_BOOK_ITEM
  var ui_bookQueue = [];
  var ui_bookGo = null;
  var ui_bootVersion = "";   // payload.plugin.version of plugin.boot (for the report, item 1)
  // the reading ranges -> the panel's button: p = a place title, v = a view key (the grid's own buttons); [chapter, from verse, to verse].
  // The first range that holds the verse wins (the narrow ones first); verse 0 = the chapter's heading line. Built from the verses
  // themselves (each one read in the DB); where a verse names something narrower than its range it has its own line (marked).
  var ui_READ = {
    //@@slot ui_READ
    ]
  };
  // a book given as a number, "10", "id:10", a title ("מלכים א", "דברי הימים ב", with or without its marks) or an object holding one of them
  function ui_bookOf(b) {
    if (b == null) return null;
    if (typeof b === "object") {
      for (const k of ["id", "bookId", "currentId", "bookUid", "title", "name", "currentBook"]) {
        const r = ui_bookOf(b[k]);
        if (r) return r;
      }
      return null;
    }
    //@@slot ui_bookOf
    const s = String(b).trim();
    const n = /^(?:id:)?(\d+)$/.exec(s);
    if (n) return ui_bookOf(+n[1]);
    const t = s.replace(/[֑-ׇ]/g, "").replace(/[׳״'"]/g, "").replace(/[\s,_-]+/g, " ").trim();
    //@@slot ui_bookOf-2
    return null;
  }
  // line index -> { ch, v } by ui_BASE (the largest chapter base not after the line; v 0 = the heading line)
  function ui_lineToVerse(book, index) {
    const B = ui_BASE[book];
    if (!B || !(index >= 0)) return null;
    let ch = 0;
    for (const k of Object.keys(B)) if (B[k] <= index && (!ch || B[k] > B[ch])) ch = +k;
    return ch ? { ch, v: index - B[ch] } : null;
  }
  // a reference string ("מלכים א, ז, כג" as the DB's heRef, or "מלכים א פרק ז") -> { ch, v } (v 0 = the chapter only)
  function ui_refToVerse(ref) {
    const s = String(ref || "").replace(/[֑-ׇ]/g, "").replace(/[׳״'"]/g, "");
    const p = /פרק\s+([א-ת]{1,3})(?:\s*,?\s*(?:פסוק\s+)?([א-ת]{1,3}))?\s*$/.exec(s);
    const m = p || /,\s*([א-ת]{1,3})\s*,\s*([א-ת]{1,3})\s*$/.exec(s);
    if (!m) return null;
    const ch = ui_gematria(m[1]), v = m[2] ? ui_gematria(m[2]) : 0;
    return ch > 0 ? { ch, v } : null;
  }
  // a number in Hebrew letters (15 = ט״ו, 16 = ט״ז) for the toast
  function ui_heNum(n) {
    const L = [[400, "ת"], [300, "ש"], [200, "ר"], [100, "ק"], [90, "צ"], [80, "פ"], [70, "ע"], [60, "ס"], [50, "נ"], [40, "מ"], [30, "ל"], [20, "כ"], [10, "י"], [9, "ט"], [8, "ח"], [7, "ז"], [6, "ו"], [5, "ה"], [4, "ד"], [3, "ג"], [2, "ב"], [1, "א"]];
    let s = "";
    for (const [v, c] of L) while (n >= v) { if (n === 15 || n === 16) { s += n === 15 ? "טו" : "טז"; n = 0; break; } s += c; n -= v; }
    return s.length > 1 ? s.slice(0, -1) + "״" + s.slice(-1) : s + "׳";
  }
  // the reading position of an event -> { book, ch, v } or null (another book, another button, nothing readable)
  function ui_readingOf(d) {
    if (!d || typeof d !== "object") return null;
    if (d.itemId && d.itemId !== UI_BOOK_ITEM) return null;
    let book = null;
    for (const k of ["currentId", "currentBookId", "currentBook", "bookId", "book", "id", "bookUid", "title"]) {
      book = ui_bookOf(d[k]);
      if (book) break;
    }
    const ix = [d.currentIndex, d.index, d.lineIndex].map((x) => (typeof x === "string" && /^\d+$/.test(x) ? +x : x)).find((x) => typeof x === "number" && isFinite(x));
    if (!book) {
      // 2.0.2: the button clicked in ANOTHER book (the manifest shows it in the books that have the most links to this house's sources):
      // the book and the line go to 72-words.js, which asks for the links of that line (ctx.ui.reading.linked)
      if (d.itemId !== UI_BOOK_ITEM) return null;
      const num = (x) => (typeof x === "number" && isFinite(x) ? x : typeof x === "string" && /^\d+$/.test(x) ? +x : null);
      const uid = /^id:(\d+)$/.exec(String(d.currentBookUid || d.bookUid || ""));
      let oid = uid ? +uid[1] : null;
      for (const k of ["currentId", "id"]) if (oid == null) oid = num(d[k]);
      let title = "";
      for (const k of ["currentBook", "currentBookId", "bookId", "title"]) if (!title && typeof d[k] === "string" && d[k] && !/^(?:id:)?\d+$/.test(d[k])) title = d[k];
      if (oid == null && !title) return null;
      return { other: { id: oid, title, index: ix == null ? null : ix } };
    }
    const cv = ix != null ? ui_lineToVerse(book, ix) : ui_refToVerse(d.currentRef || d.ref);
    return cv ? { book, ch: cv.ch, v: cv.v } : { book, ch: 0, v: 0 };
  }
  function ui_bookEvent(d) {
    const r = ui_readingOf(d);
    if (!r) return;
    if (ui_bookGo) {
      try { ui_bookGo(r); } catch (_) {}
    } else {
      ui_bookQueue.push(r);
      if (ui_bookQueue.length > 4) ui_bookQueue.shift();
    }
  }
  try {
    if (typeof window !== "undefined" && window.Otzaria && typeof window.Otzaria.on === "function") {
      window.Otzaria.on("reader.toolbar_item_clicked", (d) => ui_bookEvent(d));
      window.Otzaria.on("plugin.page_opened", (d) => { if (d && d.param && typeof d.param === "object") ui_bookEvent(d.param); });
      window.Otzaria.on("plugin.boot", (p) => { ui_bootVersion = (p && p.plugin && p.plugin.version) || ui_bootVersion; });
    }
  } catch (_) {
  }
  //@@slot ui_YB_BODY
  var ui_PHONE_MAX = 639;
  // 1.0.2: #tm-panel and #tm-xcard start 9 px below the fixed top bar of index.html (--topbar-h: 56 px, 44 px in a narrow window), as below the old 47 px header
  var ui_AUTO_OFF_S = 15;   // 1.0.1-L (L.27): a feature a PLACE switched on goes off by itself after this many seconds
  // 1.0.2 (C): the window "מה חדש" - shown once for this version (ver = manifest.json's version); short plain Hebrew, one line a feature
  var UI_NEWS = {
    //@@slot UI_NEWS
  ];
  var ui_CSS = `
/* 1.1.0: #tm-burger and the bar's buttons (.tm-topbtn) are styled by index.html (header.topbar); nothing here */
/* 4.2.0: on a phone (390 px) the seven round buttons, the burger and the version left the title 41 of its 125 px - "בי..." was all that showed. Below 860 px the version is hidden
   (the same version is the one "what's new" shows) and the title may take two lines, so the name of the house shows whole. */
@media(max-width:860px){header.topbar #version{display:none}header.topbar .title{white-space:normal;line-height:1.15;text-overflow:clip}}
@media(max-width:600px){header.topbar .title{font-size:13px}}
html,body{overscroll-behavior:none}
.tm-src{font-size:.74em;opacity:.8;font-weight:400}
.tm-src a.tm-srcl{color:inherit;text-decoration:none;cursor:pointer}
.tm-src a.tm-srcl:hover{text-decoration:underline}
#tm-panel{position:fixed;top:calc(var(--topbar-h, 56px) + 9px);right:12px;z-index:30;width:218px;max-height:calc(100vh - var(--topbar-h, 56px) - 25px);overflow-y:auto;
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
details.tm-pl>div{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:5px 0}
details.tm-ops-det>div,details.tm-ops-det>div div{display:block;grid-template-columns:none}
details.tm-ops-det>.s{margin:4px 0 2px}
details.tm-pl button,#tm-views button,#tm-panel .tm-opt button{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.32);color:#e8dcae;
  border-radius:6px;padding:5px 3px;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer;position:relative}
details.tm-pl .tm-cnt{position:absolute;left:3px;top:-7px;min-width:17px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:#c9a84c;color:#14110a;font:600 10px/16px 'Segoe UI',Arial,sans-serif;direction:ltr;text-align:center;pointer-events:none}
#tm-views button:hover,details.tm-pl button:hover,#tm-panel .tm-opt button:hover{background:rgba(201,168,76,.28)}
#tm-views.one{grid-template-columns:1fr;margin-bottom:2px}
#tm-views.one button{font-weight:700}
#tm-views button.on,details.tm-pl button.on,#tm-panel .tm-opt button.on{background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.7)}
#tm-panel .tm-opt{margin:7px 0 4px}
#tm-panel .tm-opt .cap{display:block;font-size:11px;color:#b9ac82;margin-bottom:3px}
#tm-panel .tm-opt .bb{display:grid;grid-template-columns:1fr 1fr;gap:5px}
#tm-panel .tm-opt button{font-size:11.5px;padding:4px 3px}
#tm-ops{margin-top:4px;border:1px solid rgba(201,168,76,.3);border-radius:8px;padding:4px 7px 2px;background:rgba(201,168,76,.05)}
#tm-ops .tm-op{padding:5px 0 6px;border-bottom:1px dashed rgba(201,168,76,.22)}
#tm-ops .tm-op:last-child{border-bottom:0}
#tm-ops .tm-op .cap{display:block;font-size:11.5px;font-weight:600;color:#e8dcae;margin-bottom:2px}
#tm-ops .tm-op .src{display:block;font-size:10px;color:#b9ac82;margin-bottom:4px;line-height:1.5}
#tm-ops .tm-op .src a,#tm-panel .tm-src a{color:#f3dc9a;text-decoration:none;border-bottom:1px dotted rgba(243,220,154,.6);margin-left:5px;cursor:pointer}
#tm-ops .tm-op .src a:hover,#tm-panel .tm-src a:hover{color:#fff2c8}
#tm-ops .tm-op .bb{display:grid;grid-template-columns:1fr 1fr;gap:4px}
#tm-ops .tm-op .bb.c3{grid-template-columns:1fr 1fr 1fr}
#tm-ops .tm-op .bb.one{grid-template-columns:1fr}
#tm-ops .tm-op button{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.32);color:#e8dcae;border-radius:6px;padding:4px 3px;font:11px 'Segoe UI',Arial,sans-serif;cursor:pointer;line-height:1.3}
#tm-ops .tm-op button:hover{background:rgba(201,168,76,.28)}
#tm-ops .tm-op button.on{background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.7)}
#tm-ops .tm-op button:disabled{opacity:.45;cursor:default}
#tm-ops details.tm-opg{border-bottom:1px solid rgba(201,168,76,.2)}
#tm-ops details.tm-opg:last-child{border-bottom:0}
#tm-ops details.tm-opg>summary{cursor:pointer;font-size:12px;font-weight:600;color:#e8dcae;padding:6px 0 5px}
#tm-ops details.tm-opg>summary:hover{color:#fff2c8}
#tm-ops details.tm-opg[open]>summary{color:#f3dc9a}
#tm-ops details.tm-opg>summary .n{font-weight:400;font-size:10.5px;color:#b9ac82;margin-right:5px}
#tm-ops .tm-opg-b{margin:0 4px 7px 0;padding-right:8px;border-right:2px solid rgba(201,168,76,.28)}
#tm-panel label.row{display:flex;align-items:center;gap:7px;margin:5px 0;cursor:pointer;user-select:none;flex-wrap:wrap}
#tm-panel label.row input{accent-color:#c9a84c;margin:0}
#tm-panel label.row input:disabled+span{color:#7d7560}
#tm-panel label.row .tm-src{font-size:10px;color:#b9ac82;flex-basis:100%;margin-right:19px;line-height:1.4}
#tm-units{margin-top:8px;font-size:10.5px;line-height:1.5;color:#b9ad84}
#tm-foot{margin-top:8px;font-size:10px;color:#9a8f6c;text-align:center}
#tm-nav{position:fixed;bottom:14px;left:78px;z-index:30;display:flex;gap:4px;align-items:center;flex-wrap:wrap;max-width:calc(100vw - 96px);direction:ltr}
#tm-nav button{width:26px;height:26px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(12,16,24,.75);color:#e8dcae;font-size:14px;line-height:1;cursor:pointer;backdrop-filter:blur(6px);touch-action:none;user-select:none;-webkit-user-select:none}
#tm-nav button:hover{background:rgba(201,168,76,.28)}
#tm-nav button.on{background:rgba(201,168,76,.55);color:#14110a}
#tm-nav .sp{width:5px}
#tm-nav button.tm-txt{width:auto;padding:0 9px;border-radius:13px;font:11.5px 'Segoe UI',Arial,sans-serif;direction:rtl;white-space:nowrap}
#tm-nav .tm-grp{display:flex;align-items:center;gap:3px;height:26px;padding:0 3px 0 6px;border:1px solid rgba(201,168,76,.45);border-radius:13px;background:rgba(12,16,24,.75);backdrop-filter:blur(6px);direction:rtl;color:#e8dcae;font:11.5px 'Segoe UI',Arial,sans-serif;white-space:nowrap}
#tm-nav .tm-grp button{width:20px;height:20px;font-size:13px;border-color:rgba(201,168,76,.35)}
#tm-nav .tm-grp .v{min-width:44px;text-align:center;color:#f3dc9a}
#tm-nav .tm-range{width:86px;height:14px;accent-color:#c9a84c;margin:0 4px;vertical-align:middle}
#tm-nav .tm-sec button.tm-txt{width:auto;padding:0 7px;height:20px;font-size:11px}
#tm-nav button#tm-nav-walk.on{background:rgba(201,168,76,.55);color:#1b2030}
#tm-nav .tm-grp.off{opacity:.55}
#tm-nav #tm-reset-all{display:none;background:rgba(201,168,76,.42);color:#fff2c8;border-color:rgba(201,168,76,.8)}
#tm-nav #tm-reset-all:hover{background:rgba(201,168,76,.6)}
.tm-pill{position:fixed;z-index:28;display:none;left:0;top:0;transform:translate(-50%,-50%);padding:4px 11px;border-radius:14px;border:1px solid rgba(201,168,76,.6);background:rgba(12,16,24,.84);color:#f3dc9a;font:12px 'Segoe UI',Arial,sans-serif;cursor:pointer;white-space:nowrap;direction:rtl;box-shadow:0 2px 8px rgba(0,0,0,.35);user-select:none;-webkit-user-select:none}
.tm-pill:hover{background:rgba(201,168,76,.35)}
.tm-pill.on{background:rgba(201,168,76,.62);color:#14110a;border-color:rgba(255,236,170,.85)}
#tm-tip{position:fixed;z-index:120;display:none;max-width:280px;padding:6px 10px;border-radius:8px;border:1px solid rgba(201,168,76,.6);background:rgba(12,16,24,.95);color:#efe3b8;font:12px/1.5 'Segoe UI',Arial,sans-serif;direction:rtl;text-align:right;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,.45);white-space:normal}
#tm-measure-out{position:fixed;bottom:52px;left:50%;transform:translateX(-50%);z-index:31;background:rgba(12,16,24,.9);border:1px solid rgba(201,168,76,.5);color:#f3dc9a;padding:6px 12px;border-radius:8px;font-size:12px;display:none;direction:rtl;text-align:center;pointer-events:none;max-width:92vw}
body.tm-measuring canvas{cursor:crosshair}
#tm-confirm{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;direction:rtl}
#tm-confirm .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:16px 18px;max-width:340px;color:#e8dcae;text-align:center;line-height:1.6}
#tm-confirm .t{font-weight:700;color:#f3dc9a;margin-bottom:6px}
#tm-confirm .b{display:flex;gap:8px;justify-content:center;margin-top:12px}
#tm-confirm button{padding:6px 14px;border-radius:8px;border:1px solid rgba(201,168,76,.55);background:rgba(201,168,76,.18);color:#f3dc9a;cursor:pointer;font-size:13px}
#tm-confirm button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-compass{position:fixed;bottom:10px;left:12px;z-index:30;width:58px;height:58px;border-radius:50%;box-sizing:border-box;transform:scale(1.25);transform-origin:0 100%;
  background:rgba(12,16,24,.75);border:1px solid rgba(201,168,76,.45);backdrop-filter:blur(6px);user-select:none;-webkit-user-select:none}
#tm-rotor{position:absolute;left:0;top:0;width:56px;height:56px;will-change:transform;pointer-events:none}
#tm-rotor .a{position:absolute;left:28px;top:28px;transform:translate(-50%,-62%);color:#e2544a;font-size:13px;line-height:1}
#tm-rotor .d{position:absolute;width:19px;height:19px;margin:-9.5px 0 0 -9.5px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font:600 10px 'Segoe UI',Arial,sans-serif;color:#e8dcae;cursor:pointer;pointer-events:auto;line-height:1}
#tm-rotor .d:hover{background:rgba(201,168,76,.4);color:#fff2c8}
#tm-rotor .d.n{color:#ff8a7e}
#tm-card{position:fixed;z-index:29;display:none;flex-direction:column;left:0;top:0;width:min(320px,86vw);max-height:46vh;overflow:hidden;box-sizing:border-box;padding:7px 10px 8px;border-radius:10px;border:1px solid rgba(201,168,76,.65);background:rgba(12,16,24,.94);color:#e8dcae;font:12px/1.55 'Segoe UI',Arial,sans-serif;direction:rtl;text-align:right;box-shadow:0 4px 16px rgba(0,0,0,.5);backdrop-filter:blur(6px)}
#tm-card .h{flex:none;display:flex;align-items:flex-start;gap:6px;margin-bottom:4px}
#tm-card .tt{flex:1;font-weight:700;color:#f3dc9a;font-size:12.5px}
#tm-card .x{flex:none;width:20px;height:20px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;font-size:11px;line-height:1;cursor:pointer}
#tm-card .x:hover{background:rgba(201,168,76,.35)}
#tm-card .b{flex:1 1 auto;min-height:0;overflow-y:auto;white-space:normal;padding-left:4px}
#tm-card .r{flex:none;margin-top:5px;padding-top:4px;border-top:1px solid rgba(201,168,76,.25);font-size:11px}
#tm-card .r a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-card .r a:hover{background:rgba(201,168,76,.3)}
#tm-panel .tm-src.row-src{display:block;font-size:10px;color:#b9ac82;margin:-3px 19px 6px 0;line-height:1.4;cursor:default}
#tm-xcard{position:fixed;z-index:29;display:none;flex-direction:column;top:calc(var(--topbar-h, 56px) + 9px);right:242px;width:min(320px,86vw);max-height:calc(100vh - var(--topbar-h, 56px) - 93px);overflow:hidden;box-sizing:border-box;padding:8px 11px 9px;border-radius:10px;border:1px solid rgba(201,168,76,.65);background:rgba(12,16,24,.94);color:#e8dcae;font:12.5px/1.6 'Segoe UI',Arial,sans-serif;direction:rtl;text-align:right;box-shadow:0 4px 16px rgba(0,0,0,.5);backdrop-filter:blur(6px)}
#tm-xcard .h{flex:none;display:flex;align-items:flex-start;gap:6px;margin-bottom:4px}
#tm-xcard .tt{flex:1;font-weight:700;color:#f3dc9a;font-size:13px;line-height:1.4}
#tm-xcard .x{flex:none;width:22px;height:22px;padding:0;border-radius:50%;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;font-size:12px;line-height:1;cursor:pointer}
#tm-xcard .x:hover{background:rgba(201,168,76,.35)}
#tm-search-wrap{position:sticky;top:-12px;z-index:2;margin:0 0 6px;padding:14px 0 4px;background:#0f141d}   /* PANEL_FIT_N8: opaque, and over the panel's top padding: the list no longer shows through above and behind the search box */
#tm-search{width:100%;box-sizing:border-box;height:28px;padding:0 8px;border-radius:8px;border:1px solid rgba(201,168,76,.55);background:rgba(12,16,24,.9);color:#f3dc9a;font:13px 'Segoe UI',Arial,sans-serif;direction:rtl;outline:none}
#tm-search:focus{border-color:#f3dc9a;box-shadow:0 0 0 1px rgba(243,220,154,.4)}
#tm-search-none{display:none;padding:6px 2px;font-size:12px;color:#d9cfa8}
#tm-xcard.min .b,#tm-xcard.min .r{display:none}
#tm-xcard.min .h{margin-bottom:0}
#tm-xcard.min .tt{cursor:pointer}
#tm-xcard .b{flex:1 1 auto;min-height:0;overflow-y:auto;white-space:normal;padding-left:4px;color:#ddd2a8;overscroll-behavior:contain}
#tm-xcard .r{flex:none;margin-top:6px;padding-top:5px;border-top:1px solid rgba(201,168,76,.25);font-size:11px;max-height:120px;overflow-y:auto}
#tm-xcard .r a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:3px 8px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-xcard .r a:hover{background:rgba(201,168,76,.3)}
#tm-xcard .r a{white-space:normal;max-width:100%;line-height:1.35}
#tm-panel,#tm-topbar,#tm-nav,.tm-pill,#tm-xcard .h,#tm-xcard .r,#tm-help,#tm-news .x{user-select:none;-webkit-user-select:none}
#tm-xcard .b{user-select:text;-webkit-user-select:text}
#tm-panel,#tm-topbar,#tm-nav,.tm-pill,#tm-xcard .h,#tm-xcard .r,#tm-help,#tm-news .x{user-select:none;-webkit-user-select:none}
#tm-xcard .b{user-select:text;-webkit-user-select:text}
#tm-xcard .b{white-space:pre-line}
#tm-xcard .b,#tm-card .b{line-height:1.5}
#tm-xcard .b .p,#tm-card .b .p{display:block;margin-top:3px}
#tm-xcard .tm-more,#tm-card .tm-more{display:block;width:100%;box-sizing:border-box;text-align:center;margin:8px 0 6px;background:rgba(201,168,76,.26);border:1px solid rgba(201,168,76,.65);color:#f3dc9a;border-radius:6px;padding:5px 12px;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit}
#tm-xcard .tm-more:hover,#tm-card .tm-more:hover{background:rgba(201,168,76,.3)}
#tm-xcard .b .p:first-child,#tm-card .b .p:first-child{margin-top:0}
#tm-xcard .b b,#tm-card .b b{font-weight:700;color:#f3dc9a}
#tm-xcard .o,#tm-card .o{flex:none;max-height:40vh;overflow-y:auto;overscroll-behavior:contain;margin-top:5px;padding-top:4px;border-top:1px solid rgba(201,168,76,.25);font-size:11px;line-height:1.5;color:#b9ac82}
#tm-xcard.min .o{display:none}
/* N15 (the user, a general instruction for every card): the text justified, RTL; the readings' switches first (above the text, a line under them); the sources closed behind a button */
#tm-xcard .b,#tm-card .b{direction:rtl;text-align:justify;text-justify:inter-word;hyphens:manual}
#tm-xcard .o.ops-top,#tm-card .o.ops-top{margin:0 0 6px;padding:0 0 5px;border-top:0;border-bottom:1px solid rgba(201,168,76,.25)}
#tm-xcard .r .rl,#tm-card .r .rl{display:none;margin-top:4px}
#tm-xcard .r.open .rl,#tm-card .r.open .rl,#tm-tour-box .src.open .rl{display:block}
#tm-tour-box .src .rl{display:none;margin-top:4px}
.tm-rt{display:inline-block;box-sizing:border-box;font:inherit;font-size:1em;font-weight:700;color:#f3dc9a;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.45);border-radius:6px;padding:3px 10px;cursor:pointer;user-select:none;-webkit-user-select:none}
.tm-rt:hover{background:rgba(201,168,76,.3)}
#tm-card .o{max-height:20vh}
#tm-xcard .o .g,#tm-card .o .g{display:block}
#tm-xcard .o .k,#tm-card .o .k{margin-left:3px}
#tm-xcard .o a,#tm-card .o a{display:inline-block;color:#f3dc9a;margin:2px 0 2px 5px;padding:2px 7px;border:1px solid rgba(201,168,76,.45);border-radius:6px;background:rgba(201,168,76,.12);text-decoration:none;cursor:pointer}
#tm-xcard .o a:hover,#tm-card .o a:hover{background:rgba(201,168,76,.3)}
#tm-xcard .o a.on,#tm-card .o a.on{background:rgba(201,168,76,.5);color:#14110a;border-color:rgba(255,236,170,.85);cursor:default}
#tm-news li.v{list-style:none;font-weight:700;color:#f3dc9a;margin:7px 0 2px}
#tm-report,#tm-printdlg,#tm-news,#tm-help{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;direction:rtl}
#tm-printdlg .box,#tm-news .box,#tm-help .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:12px 14px;width:min(320px,90vw);box-sizing:border-box;color:#e8dcae;font:12.5px/1.5 'Segoe UI',Arial,sans-serif;text-align:right}
#tm-printdlg .t,#tm-news .t,#tm-help .t{font-weight:700;color:#f3dc9a;margin-bottom:6px;font-size:13.5px}
#tm-printdlg .b,#tm-news .b,#tm-help .b{display:flex;gap:8px;margin-top:10px}
#tm-printdlg .b button,#tm-news .b button,#tm-help .b button{flex:1;padding:5px 6px;border-radius:7px;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;cursor:pointer;font:12px 'Segoe UI',Arial,sans-serif}
#tm-printdlg .b button.y,#tm-news .b button.y,#tm-help .b button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-printdlg .b button:disabled{opacity:.5;cursor:default}
#tm-news,#tm-help{background:rgba(0,0,0,.35)}
#tm-news .box,#tm-help .box{width:min(340px,90vw);max-height:calc(100vh - var(--topbar-h, 56px) - 40px);overflow-y:auto}
#tm-help .box{width:min(400px,92vw)}
#tm-news .box{width:min(560px,92vw);display:flex;flex-direction:column;overflow:hidden;font-size:13px;line-height:1.55}
#tm-news .box:focus{outline:none}
#tm-news ul{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain}
#tm-news .t{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px}
#tm-news .t .x{cursor:pointer;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;border-radius:6px;padding:0 8px;font:inherit;line-height:1.5}
#tm-news .b{flex:none}
#tm-foot-news{margin-top:4px;font-size:10px;color:#c9b77a;text-align:center;cursor:pointer;text-decoration:underline}
@media (max-height:700px){#tm-xcard .o,#tm-card .o{max-height:24vh}#tm-xcard .r{max-height:70px}}
#tm-help h4{margin:9px 0 3px;font-size:12.5px;color:#f3dc9a}
#tm-help h4:first-of-type{margin-top:2px}
#tm-help ul{margin:0;padding:0 16px 0 0;list-style:disc}
#tm-help li{margin:2px 0}
#tm-help kbd{font:11px Consolas,'Segoe UI',monospace;background:rgba(255,255,255,.08);border:1px solid rgba(201,168,76,.35);border-radius:4px;padding:0 4px}
#tm-news ul{margin:2px 0 0;padding:0 16px 0 0;list-style:disc}
#tm-news li{margin:3px 0}
#tm-news li b{color:#f3dc9a;font-weight:700}
#tm-news li.big{list-style:none;font-size:1.22em;line-height:1.45;margin:4px 0 12px;padding:9px 12px;border:2px solid #e0b84f;border-radius:8px;background:rgba(224,184,79,.14);color:#fff}
#tm-news li.big b{font-size:1.08em;color:#ffd77a}
#tm-print{display:none}
@media print{
  @page{size:A4 landscape;margin:10mm}
  html,body{background:#fff !important;color:#000 !important;width:auto !important;height:auto !important;overflow:visible !important}
  body>*:not(#tm-print){display:none !important}
  #tm-print{display:block !important;direction:rtl;text-align:right;color:#000;font:11pt/1.5 'Segoe UI',Arial,sans-serif}
  #tm-print h1{font-size:15pt;font-weight:700;margin:0 0 3mm}
  #tm-print img{display:block;max-width:100%;max-height:150mm;margin:0 auto 4mm;object-fit:contain}
  #tm-print .tt{font-size:12pt;font-weight:700;margin:0 0 1mm}
  #tm-print .tx{white-space:pre-line}
  #tm-print .tx .p{display:block;margin-top:1.4mm}
  #tm-print .tx .p:first-child{margin-top:0}
  #tm-print .tm-src{font-size:.8em;opacity:1}
  #tm-print .cr{font-size:9pt;color:#555;margin:1mm 0 0}
  #tm-print .pg2{break-before:page;page-break-before:always}
  #tm-print .rs a{color:#000}
  #tm-print .rs{margin-top:2mm;font-size:9.5pt;color:#333}
}
#tm-report .box{background:#1b2030;border:1px solid rgba(201,168,76,.6);border-radius:10px;padding:12px 14px;width:min(340px,90vw);box-sizing:border-box;color:#e8dcae;font:12.5px/1.5 'Segoe UI',Arial,sans-serif;text-align:right}
#tm-report .t{font-weight:700;color:#f3dc9a;margin-bottom:6px;font-size:13.5px}
#tm-report .ty{display:flex;gap:5px;margin-bottom:7px}
#tm-report .ty button,#tm-report .b button{flex:1;padding:5px 6px;border-radius:7px;border:1px solid rgba(201,168,76,.45);background:rgba(201,168,76,.12);color:#e8dcae;cursor:pointer;font:12px 'Segoe UI',Arial,sans-serif}
#tm-report .ty button.on{background:rgba(201,168,76,.45);color:#fff2c8;border-color:rgba(201,168,76,.8)}
#tm-report textarea{width:100%;box-sizing:border-box;height:110px;resize:vertical;padding:6px 8px;border-radius:7px;border:1px solid rgba(201,168,76,.5);background:rgba(12,16,24,.9);color:#f3dc9a;font:12.5px/1.5 'Segoe UI',Arial,sans-serif;direction:rtl;outline:none}
#tm-report textarea:focus{border-color:#f3dc9a}
#tm-report .n{font-size:10.5px;color:#9a8f6c;margin:4px 0 0}
#tm-report .b{display:flex;gap:8px;margin-top:9px}
#tm-report .b button.y{background:rgba(201,168,76,.5);color:#14110a}
#tm-report .b button:disabled{opacity:.5;cursor:default}
#tm-panel,#tm-card .b,#tm-xcard .b,#tm-xcard .r,#tm-tour-box .body,#tm-tour-box .bub{scrollbar-width:thin;scrollbar-color:rgba(201,168,76,.5) transparent}
/* PANEL_FIT_N8: in a window narrower than the bottom row of buttons (#tm-nav, from the left to about 780 px) plus the panel, the panel ends above that row, not under it */
@media(max-width:1080px){#tm-panel{max-height:calc(100vh - var(--topbar-h, 56px) - 9px - 58px)}}
@media(max-width:${ui_PHONE_MAX}px){#tm-nav .tm-grp .cap{display:none}
  #tm-xcard{left:8px;right:8px;top:auto;bottom:76px;width:auto;max-height:min(42vh,calc(50vh - 60px))}
  #tm-xcard .r{max-height:66px}
  #tm-panel{max-height:calc(100vh - var(--topbar-h, 56px) - 9px - 112px)}}   /* 4.2.0: the old 100vh - 132px forgot that the panel starts below the bar, so on a 390 x 800 phone its bottom edge (721) went 21 px under the row of nav buttons (from 700) */
`;
  async function buildUI(ctx) {
    try {
      const uiGroup = new Group();
      uiGroup.name = "ui";
      if (ctx.root && ctx.root.add) ctx.root.add(uiGroup);
      if (!Array.isArray(ctx.animated)) ctx.animated = [];
      if (!ctx.shared) ctx.shared = {};
      if (!ctx.layers) ctx.layers = {};
      //@@slot buildUI.CO
      const CO = ctx.CO || { seaX: 80, seaZ: 54, seaZRashi: -54, kiyorX: 30, mechX: 30, mechZ: [38, 50], xUlamE: 18.5, xHouseE: 2.5, HOUSE_WALL: [7, 6, 5, 4], zHouseS: 27, xHeiW: -80.5 };   // UNIFY_A2 (decision 63): one line for both houses (the Second's mechZ [33, 45] was never used - ctx.CO is always given)
      const LVL = ctx.LV || { HAR: 0, AZ: 6, HEI: 12 };
      // 1.0.1-L: the one phone rule (ui_PHONE_MAX; the CSS media rule is built from the same number)
      const isPhone = (w) => (w == null ? window.innerWidth || 0 : w) <= ui_PHONE_MAX;
      // The four hide-lists (FIXES-1.0.1-K.md 0.5a), all CLOSED by default and opened ONLY by their on-model buttons (1.0.1-K: no view,
      // place, table row, label or presentation call opens them): ctx.cutaway (the house: its south wall, roof and the interior pieces on
      // that side), ctx.yatziaCut (the chambers' outer walls, all three sides), ctx.ulamCut (the ulam's front wall and roof),
      // ctx.forestBoardsCut (60-palace.js: the boards of the roofing of בית יער הלבנון, to show the beams). Any list may be missing.
      let cutOn = false;
      let sectionOn = false;   // 1.2.2: the section along the length (ctx.sectionCut: the house's south wall and windows off, the ceilings kept)
      let yatziaOpen = false, ulamOpen = false;
      let boardsOff = false;
      const layerRows = {};
      const cutList = (a) => Array.isArray(a) ? a : [];
      // one pass sets the visibility of every object of the four "hide" lists, so an object listed in two of them stays hidden while
      // either switch is on and comes back only when both are off
      const applyHidden = function() {
        const hide = new Set();
        if (cutOn) for (const m of cutList(ctx.cutaway)) hide.add(m);
        // 1.2.3 (the user: "ממזרח"): the section is seen from the east - the house's east wall with what hangs on it (ctx.sectionCut), the
        // ulam's front, ceilings and roof (ctx.ulamCut) and Yachin and Boaz (the group; they stand east of the cut)
        if (sectionOn) {
          for (const m of cutList(ctx.sectionCut)) hide.add(m);
          for (const m of cutList(ctx.ulamCut)) hide.add(m);
        }
        if (yatziaOpen) for (const m of cutList(ctx.yatziaCut)) hide.add(m);
        if (ulamOpen) for (const m of cutList(ctx.ulamCut)) hide.add(m);
        //@@slot applyHidden
          for (const m of cutList(list)) if (m) m.visible = !hide.has(m);
        }
        try { const yb = ctx.root.getObjectByName("yachinBoaz"); if (yb) yb.visible = !sectionOn; } catch (_) {}
        for (const m of cutList(ctx.interiorOnly)) {
          if (m) m.visible = cutOn;
        }
      };
      //@@slot buildUI.after-dvHigh
      const setCutaway = function(on) {
        cutOn = !!on;
        applyHidden();
      };
      const setSection = function(on) {   // 1.2.2
        sectionOn = !!on;
        applyHidden();
      };
      const setYatziaCut = function(on) {
        yatziaOpen = !!on;
        applyHidden();
      };
      const setUlamCut = function(on) {
        ulamOpen = !!on;
        applyHidden();
      };
      const setBoardsOff = function(on) {
        boardsOff = !!on;
        applyHidden();
        // 1.0.1-L (K review follow-up): the labels that name the boards go with them (60-palace.js's layer group; its per-frame hook keeps it in step whoever hides them)
        if (ctx.layers && ctx.layers.forestBoards) ctx.layers.forestBoards.visible = !boardsOff;
      };
      // Optional layers (ctx.layers.aliyot / ulamRambam / palace): Groups built by the other modules with visible=false.
      const layerMarks = {};   // 1.0.1-H: layers that are chosen in the opinions table (aliyot, ulamRambam) mark their row there
      const setLayer = function(name, on) {
        const g = ctx.layers && ctx.layers[name];
        if (g) g.visible = !!on;
        if (name === "aliyot") { try { applyHidden(); } catch (_) {} }   // 1.2.4: ctx.aliyotHide follows the layer
        const row = layerRows[name];
        if (row) row.checked = !!on;
        if (typeof layerMarks[name] === "function") {
          try {
            layerMarks[name](!!on);
          } catch (_) {
          }
        }
        return !!g;
      };
      // ===== labels =====
      const labelGroup = new Group();
      labelGroup.name = "labels";
      // the engine's sprite maker (makeLabelSprite2 in 90-entry.js) when it is in scope; ui_makeLabelSprite is the fallback copy
      const mkLabel = typeof makeLabelSprite2 === "function" ? makeLabelSprite2 : ui_makeLabelSprite;
      for (const l of Array.isArray(ctx.labels) ? ctx.labels : []) {
        try {
          if (!l || !l.text) continue;
          //@@slot buildUI.spr
          spr.position.set(l.x || 0, l.y || 0, l.z || 0);
          // CONTRACT (no position heuristic): a label that belongs to an optional layer carries an explicit
          // {layer: "aliyot" | "ulamRambam" | "palace"} = the key of its ctx.layers group, and is shown only while that layer is
          // on. 50-heichal.js pushes its layer labels here (with the layer field); 60-palace.js still builds its labels as sprites
          // inside its own layer group (with its own scaling loop) and pushes to ctx.labels only as a fallback, so the "תוויות"
          // toggle does not reach them. Every other label - e.g. 20-mount's "השער הדרומי" at z 341.5,
          // or a future high label - is an ordinary label and stays visible.
          // 1.0.1-H: a label may belong to SEVERAL layers at once (`layers: ["palace", "forestRashi"]`, 60-palace.js: the labels of a
          // reading of בית יער הלבנון) - it is shown only while every listed layer group is visible
          spr.userData.layers = Array.isArray(l.layers) ? l.layers.slice() : l.layer ? [l.layer] : null;
          spr.userData.label = l;   // 1.0.1-H: a click on the label shows its explanation and sources (see "labels -> sources" below)
          labelGroup.add(spr);
        } catch (_) {
        }
      }
      uiGroup.add(labelGroup);
      for (const spr of labelGroup.children) spr.userData.base = spr.scale.clone();
      ctx.animated.push(function() {
        if (!labelGroup.visible) return;   // all label state is refreshed before the first frame after re-enabling it
        const cp = ctx.camera.position;
        const tanHalf = Math.tan(((ctx.camera.fov || 50) * Math.PI) / 360);   // LABEL_CAP_S1
        for (const spr of labelGroup.children) {
          const d = cp.distanceTo(spr.position);
          const sz = spr.userData.base.y;
          const kMin = spr.userData.label && typeof spr.userData.label.kMin === "number" ? spr.userData.label.kMin : 0.3;   // LABEL_NEAR_A2: a label may keep shrinking as the eye comes near (a figure's caption)
          // LABEL_CAP_S1 (scan 1, findings 2, 4, 22: a label beside the eye - "מזבח הזהב" in the incense demonstration, the oven's in לשכת עושי
          // לחם הפנים, "המנורה" by the curtains - filled a corner of the screen and was cut by its edge): nearer than 170 * kMin a label stops
          // shrinking, so on the screen it grew without end as the eye came near. Now, near, it grows no taller than 5% of the window's height
          // (as a large place name from afar; its letters - about 3%), nor shrinks below its size from afar; from its usual distance
          // (d / 170 >= kMin) nothing changes. (9% was tried: the oven's label in לשכת עושי לחם הפנים stayed too large.)
          const kCap = (0.05 * 2 * d * tanHalf) / (sz || 1);
          const k = Math.min(1.5, Math.max(d / 170, Math.min(kMin, kCap)));
          spr.scale.set(spr.userData.base.x * k, spr.userData.base.y * k, 1);
          // 1.3.7 / 1.9.5: a label may name its own reach (`far`, amot) - the captions of a switch that is looked at from the whole
          // Mount's view (the gatekeepers' sides); without it the reach goes by the label's size, as before
          const far = spr.userData.label && typeof spr.userData.label.far === "number" ? spr.userData.label.far : 0;
          let vis = d < (far || (sz > 18 ? 1800 : sz > 11 ? 700 : 330));
          //@@slot buildUI.after-vis-note
          const SEC = ctx.shared.section;
          //@@slot buildUI.after-SEC
          const lays = spr.userData.layers;
          if (vis && lays) {
            for (const lay of lays) {
              const g = ctx.layers[lay];
              if (!g || !g.visible) { vis = false; break; }
            }
          }
          //@@slot buildUI.HL
          spr.visible = vis;
        }
      });
      // ===== occluder fade loop (1.0.19) =====
      // 1.0.1-K (Yossi: "שהחומות יהיו שקופות לא לגמרי, שיאחזו שיש חומה. להוסיף כפתור טשטוש וחסימת חומות. וכן להוסיף כפתור להגדיל את המרחק
      // של הטשטוש"): a blocking wall fades to UI_FADE_OPACITY (0.35; it was 0.1, the wall all but vanished); the fade can be switched off
      // (walls block) and its distance changed (fadeState.dist, 60..400 amot, default 120 = the 1.0.19 FADE_DIST) from the nav row; both
      // are remembered per viewer (localStorage, wrapped: the page works the same without it)
      const UI_FADE_OPACITY = 0.35;
      const UI_FADE_STOPS = [60, 80, 100, 120, 150, 200, 250, 300, 400];
      const lsGet = (k) => {
        try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (_) { return null; }
      };
      const lsSet = (k, v) => {
        try { if (window.localStorage) window.localStorage.setItem(k, String(v)); } catch (_) {}
      };
      if (!ctx.shared.fadeState) ctx.shared.fadeState = { on: true, dist: 120 };
      {
        //@@slot buildUI.fs0
        fs0.dist = UI_FADE_STOPS.indexOf(sDist) >= 0 ? sDist : typeof fs0.dist === "number" ? fs0.dist : 120;
      }
      {
        const OCCL = ctx.H && Array.isArray(ctx.H.OCC) ? ctx.H.OCC : [], ray = new Raycaster(), fs = ctx.shared.fadeState;
        const dir = new Vector3(), right = new Vector3(), upv = new Vector3(), to = new Vector3(), dd = new Vector3();
        // 1.0.1-K (K.9b; K.6's report: ghost walls inside the throne hall, the king's house and לשכת הגזית): under a roof - an interior
        // view - the rays around the target (+-20 / +-16) and the "near" rays along the view (through the target, up to the fade distance)
        // hit the room's OWN walls and faded them; there only the direct line from the camera to its target clears what blocks it. "Under a
        // roof" = a ray straight up from the camera meets a visible, solid part of the model within 60 amot (the model's large meshes -
        // plain, or instanced with up to 2000 copies, e.g. the 45 boards of בית יער הלבנון - cached for 4 s; the sky, the terrain and the
        // cloud are not part of the test).
        const OFFS5 = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]], OFFS1 = [[0, 0]], OFFS0 = [];
        const upRay = new Raycaster(), UPV = new Vector3(0, 1, 0);
        let roofT = null, roofAt = -1e9;
        const roofList = () => {
          const now = performance.now();
          if (roofT && now - roofAt < 4000) return roofT;
          roofAt = now;
          roofT = [];
          const bb = new Box3(), sz = new Vector3();
          if (ctx.root && typeof ctx.root.traverse === "function") {
            ctx.root.traverse((o) => {
              if (!o.isMesh || !o.geometry) return;
              for (let p = o; p; p = p.parent) if (p.name === "tm-kk-cloud") return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (pa && pa.count > 30000) return;   // the terrain
              if (o.isInstancedMesh) {
                if (o.count > 2000 || typeof o.computeBoundingBox !== "function") return;
                if (!o.boundingBox) o.computeBoundingBox();
                bb.copy(o.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
              } else {
                if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
                bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
              }
              if (Math.max(sz.x, sz.z) < 6) return;
              roofT.push(o);
            });
          }
          return roofT;
        };
        const underRoof = (cam) => {
          upRay.set(cam, UPV);
          upRay.near = 0;
          upRay.far = 60;
          for (const h of ctx.raycast(upRay, roofList())) {
            let vis = true;
            for (let p = h.object; p; p = p.parent) if (p.visible === false) { vis = false; break; }
            if (!vis) continue;
            const m = Array.isArray(h.object.material) ? h.object.material[0] : h.object.material;
            if (m && (m.visible === false || (m.transparent && m.opacity < 0.5))) continue;
            return true;
          }
          return false;
        };
        //@@slot buildUI.HIDE_GROUPS
        const HIDE_PASS_FLAT = 0.06;
        let hideT = null, hideAt = -1e9;
        const hidePair = new Map(), hideBlocked = new Set(), hideHits = [], HID = [], hideFlat = new Set(), hideSmall = new Set(), hideDeep = new Set();
        const hideBB = new Box3(), hideSz = new Vector3(), hideN = new Vector3();
        const hideTo = (o) => (hideDeep.has(o) ? HIDE_PASS_FLAT : UI_FADE_OPACITY);   // 1.0.4: how far a hidden mesh fades
        const hideList = () => {
          const now = performance.now();
          if (hideT && now - hideAt < 5000) return hideT;
          hideAt = now;
          const occS = new Set(OCCL), out = [], stems = new Map();
          hidePair.clear();
          hideFlat.clear();
          hideSmall.clear();
          for (const top of ctx.root && Array.isArray(ctx.root.children) ? ctx.root.children : []) {
            if (HIDE_GROUPS.indexOf(top.name) < 0) continue;
            top.traverse((o) => {
              // 1.0.4: an instanced mesh of up to HIDE_INST copies too (Yachin and Boaz in the ulam, whose shafts stopped the orbit round the ulam's tables:
              // the two fade together); not the forest house's 45 columns
              if (!o.isMesh || (o.isInstancedMesh && !(o.count <= HIDE_INST && typeof o.computeBoundingBox === "function")) || !o.geometry || occS.has(o) || o.userData.noPick) return;
              // 1.2.2 (the user: the capital "disappears"): the pillars and their capitals are never faded - the dome of the capital stood between
              // the eye and the target (the capital's centre) and went see-through; also any mesh or group marked userData.noFade
              for (let p = o; p; p = p.parent) if (p.name === "tm-kk-cloud" || p.name === "yachinBoaz" || (p.userData && p.userData.noFade)) return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (!pa || pa.count > 30000) return;
              if (o.isInstancedMesh) {
                if (!o.boundingBox) o.computeBoundingBox();
                hideBB.copy(o.boundingBox);
              } else {
                if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
                hideBB.copy(o.geometry.boundingBox);
              }
              hideBB.applyMatrix4(o.matrixWorld).getSize(hideSz);
              //@@slot hideList.hz
              const small = !flat && hideSz.y >= 4 && hz < 5 && hz >= 1;
              if ((hz < 5 && !small) || (!flat && hideSz.y < 4)) return;
              out.push(o);
              o.userData.tmPass = true;   // 1.0.4: 90-entry.js lets the camera through it round a thing one flew to
              if (flat) hideFlat.add(o);   // 1.0.4: a ceiling, a roof, a floor: the pass only
              if (small) hideSmall.add(o);   // 1.0.4: the pass only
              const sm = /^(.+)-(?:stone|cedar)$/.exec(o.name || "");
              if (sm) {
                const k = (o.parent ? o.parent.uuid : "") + "|" + sm[1];
                if (!stems.has(k)) stems.set(k, []);
                stems.get(k).push(o);
              }
            });
          }
          for (const g of stems.values()) if (g.length > 1) for (const o of g) hidePair.set(o, g);
          hideT = out;
          return out;
        };
        const hideShown = (o) => {
          for (let p = o; p; p = p.parent) if (p.visible === false) return false;
          return true;
        };
        const hideStart = (m) => {
          const ud = m.userData, orig = m.material;
          let clone = ud.tmHideClone;
          if (!clone || ud.tmHideOrig !== orig) {
            clone = Array.isArray(orig) ? orig.map((x) => x.clone()) : orig.clone();
            ud.tmHideClone = clone;
            ud.tmHideOrig = orig;
          }
          const base = Array.isArray(orig) ? orig.map((x) => (typeof x.opacity === "number" ? x.opacity : 1)) : typeof orig.opacity === "number" ? orig.opacity : 1;
          for (const c of Array.isArray(clone) ? clone : [clone]) {
            c.transparent = true;
            c.depthWrite = false;
            c.needsUpdate = true;
          }
          m.material = clone;
          const st = { m, orig, clone, base, cur: 1, tgt: 1 };
          ud.fade = st;
          HID.push(st);
          return st;
        };
        const hideHas = (m) => {
          for (let i = 0; i < HID.length; i++) if (HID[i].m === m) return HID[i];
          return null;
        };
        const hideDrop = (i) => {
          const st = HID[i];
          if (st.m.userData.fade === st) delete st.m.userData.fade;
          HID[i] = HID[HID.length - 1];
          HID.pop();
        };
        let last = -1e9;
        ctx.animated.push(function(t) {
          if (t - last > 140) {
            last = t;
            const blocked = new Set();
            hideBlocked.clear();
            hideDeep.clear();
            const FADE_DIST = typeof fs.dist === "number" && fs.dist > 0 ? fs.dist : 120;   // a wall fades only within this many amot of the camera
            // 1.2.2 (the user's recording: the eye left the heichal through its wall while orbiting the menorot): hideList() marks the
            // buildings' walls and ceilings userData.tmPass, and 90-entry.js's cam_keepInside holds the eye in the room by those marks -
            // but it ran only in the modes "גם קיר מסתיר" / "מעבר דרך קירות", so in the default mode no wall was marked. Now every tick (cached 5 s).
            try { hideList(); } catch (_) {}
            //@@slot buildUI.fadeHeld
            try { fadeHeld = !!(ctx.shared.fadeHold && ctx.shared.fadeHold.held()); } catch (_) { fadeHeld = false; }
            if (fs.on && !fadeHeld) {
              const cam = ctx.camera.position, tg = ctx.controls.target;
              let inside = false;
              try { inside = underRoof(cam); } catch (_) { inside = false; }
              dir.subVectors(tg, cam).normalize();
              right.crossVectors(dir, ctx.camera.up).normalize();
              upv.crossVectors(right, dir).normalize();
              for (const [ox, oy] of inside ? OFFS1 : OFFS5) {
                to.copy(tg).addScaledVector(right, ox * 20).addScaledVector(upv, oy * 16);
                dd.subVectors(to, cam);
                const L = dd.length();
                ray.set(cam, dd.normalize());
                ray.near = 0;
                // 1.0.1-K review (ui-3): 3 amot short of the target (was 1): with a far "מרחק טשטוש" these rays reach the target, and the
                // face of the wall it stands in faded with them (the eastGate view at 400: the gate's own wall); 3 = model choice
                ray.far = Math.min(L - 3, FADE_DIST);
                for (const h of ctx.raycast(ray, OCCL)) blocked.add(h.object);
              }
              // 1.0.16: a wall right in front of the camera (within NEAR amot along the view direction) fades too,
              // even when the orbit target is on this side of it / on the wall itself (e.g. close to a gate).
              // 1.0.1-K: not under a roof (see above)
              // 1.0.1-K review (ui-3): NEAR keeps the 1.0.19 reach (120) at most - these rays go on past the target on purpose (a wall
              // the target stands on), so NEAR = FADE_DIST (up to 400) ghosted the walls far behind the target (eastGate at 400: a third
              // of the screen); a larger distance now lengthens only the rays toward the target above
              const NEAR = Math.min(FADE_DIST, 120);
              for (const [ox, oy] of inside ? OFFS0 : OFFS5) {
                to.copy(cam).addScaledVector(dir, NEAR).addScaledVector(right, ox * 8).addScaledVector(upv, oy * 6);
                dd.subVectors(to, cam);
                ray.set(cam, dd.normalize());
                ray.near = 0;
                ray.far = NEAR + 2;
                for (const h of ctx.raycast(ray, OCCL)) blocked.add(h.object);
              }
              // 1.0.2 (D): the building's walls that hide the target (see above); 1.0.4: and the pass (see above)
              let pass = false;
              try { pass = typeof ctx.camPass === "function" && !!ctx.camPass() && typeof ctx.camPassHit === "function"; } catch (_) { pass = false; }
              if (fs.hide || pass) {
                const list = hideList();
                for (const [ox, oy] of inside ? OFFS1 : OFFS5) {
                  to.copy(tg).addScaledVector(right, ox * 1.5).addScaledVector(upv, oy * 1.5);
                  dd.subVectors(to, cam);
                  const far = Math.min(dd.length() - (pass ? HIDE_PASS_SHORT : 2), FADE_DIST);
                  if (!(far > 0.5)) continue;
                  ray.set(cam, dd.normalize());
                  ray.near = 0;
                  ray.far = far;
                  hideHits.length = 0;
                  ctx.raycast(ray, list, hideHits);
                  for (const h of hideHits) {
                    const o = h.object;
                    if (hideBlocked.has(o) || !hideShown(o)) continue;
                    if (pass) {
                      if (!ctx.camPassHit(h, ray.ray.direction)) continue;   // a floor under the target
                    } else if (hideFlat.has(o) || hideSmall.has(o)) continue;
                    else if (h.face) {
                      hideN.copy(h.face.normal).transformDirection(o.matrixWorld);
                      if (Math.abs(hideN.y) > 0.7) continue;
                    }
                    hideBlocked.add(o);
                    if (pass && hideFlat.has(o)) hideDeep.add(o);
                    const pr = hidePair.get(o);
                    if (pr) for (const q of pr) hideBlocked.add(q);
                  }
                }
                hideHits.length = 0;
              }
            }
            // GAZE_WALL_A2 (fix-a2; the user's decision 62: "כשהמטרה היא לראות את החומה עצמה (שער וכד'), אסור שתהיה שקיפות"): the wall the
            // view is aimed at - the first thing the line from the eye meets within two amot of the target - is never see-through; only what
            // stands between the eye and it fades
            if (blocked.size || hideBlocked.size) {
              const cp = ctx.camera.position, tgp = ctx.controls.target, Lt = cp.distanceTo(tgp);
              if (Lt > 2.5) {
                dd.subVectors(tgp, cp).normalize();
                ray.set(cp, dd); ray.near = 0; ray.far = Lt + 2;
                const cand = [...blocked, ...hideBlocked];
                for (const h of ctx.raycast(ray, cand)) {
                  if (h.distance < Lt - 2) continue;
                  blocked.delete(h.object); hideBlocked.delete(h.object);
                  break;
                }
              }
            }
            for (const m of OCCL) m.userData.fade.tgt = blocked.has(m) ? UI_FADE_OPACITY : 1;
            for (const m of OCCL) {
              const fw = m.userData.fadeWith;
              if (fw && blocked.has(fw)) m.userData.fade.tgt = UI_FADE_OPACITY;
            }
            for (let i = 0; i < HID.length; i++) HID[i].tgt = hideBlocked.has(HID[i].m) ? hideTo(HID[i].m) : 1;
            for (const o of hideBlocked) if (!hideHas(o)) hideStart(o).tgt = hideTo(o);
          }
          // 1.0.2 (D): the building's walls toward their target; whole again -> the shared material back
          for (let i = HID.length - 1; i >= 0; i--) {
            const st = HID[i];
            if (st.m.material !== st.clone) {   // another module changed the material meanwhile: it wins
              hideDrop(i);
              continue;
            }
            if (Math.abs(st.cur - st.tgt) < 4e-3) {
              if (st.tgt >= 1) {
                st.m.material = st.orig;
                hideDrop(i);
              }
              continue;
            }
            st.cur += (st.tgt - st.cur) * 0.2;
            if (Array.isArray(st.clone)) for (let k = 0; k < st.clone.length; k++) st.clone[k].opacity = st.base[k] * st.cur;
            else st.clone.opacity = st.base * st.cur;
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
      window.__TM_CTX = ctx; // debug hook for DEV/tests (labels, camera, controls)
      setCutaway(false);
      // ===== panel =====
      const style = document.createElement("style");
      style.textContent = ui_CSS;
      document.head.appendChild(style);
      // 1.1.0: the burger lives in the top bar of index.html (header.topbar .tb-start); created here only if the page has none
      let burger = document.getElementById("tm-burger");
      if (!burger) {
        burger = document.createElement("button");
        burger.id = "tm-burger";
        burger.type = "button";
        burger.title = "הצג/הסתר לוח בקרה";
        document.body.appendChild(burger);
      }
      burger.textContent = "✕";
      const panel = document.createElement("div");
      panel.id = "tm-panel";
      document.body.appendChild(panel);
      const title = document.createElement("div");
      title.className = "t";
      //@@slot buildUI.after-title
      panel.appendChild(title);
      panel.appendChild(sub);
      burger.addEventListener("click", () => {
        const hidden = panel.style.display === "none";
        panel.style.display = hidden ? "" : "none";
        burger.textContent = hidden ? "✕" : "☰";
      });
      // the phone layout (panel closed) is decided once the real window size is known: a page booted in a hidden tab sees innerWidth 0
      // and 1.0.1 took that for a phone (review ui-zero-width-boot-hides-panel) - then the decision waits for a resize or the next ticks
      {
        let decided = false, iv = null;
        const decide = () => {
          if (decided) return;
          const w = window.innerWidth || 0;
          if (w < 2) return;
          decided = true;
          window.removeEventListener("resize", decide);
          if (iv) clearInterval(iv);
          if (isPhone(w)) {
            panel.style.display = "none";
            burger.textContent = "☰";
          }
        };
        decide();
        if (!decided) {
          window.addEventListener("resize", decide);
          iv = setInterval(decide, 400);
        }
      }
      const hidePanelOnPhone = () => {
        if (isPhone()) {
          panel.style.display = "none";
          burger.textContent = "☰";
        }
      };
      // 1.0.1-H (the user: "הוסף מקורות להכל"): a row may carry its sources - opts.src = [[label, ref], ...] - shown as small links under it
      // (refLinks is defined with the Otzaria opener below; the rows are built after it)
      const toggleRow = function(text, checked, onChange, opts) {
        const lab = document.createElement("label");
        lab.className = "row";
        const inp = document.createElement("input");
        inp.type = "checkbox";
        inp.checked = !!checked;
        if (opts && opts.disabled) {
          inp.disabled = true;
          lab.title = opts.title || "השכבה לא נטענה";
        }
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
        // 1.0.1-K (review UI-H2-3): the sources go AFTER the label, not inside it - a click on their caption toggled the checkbox
        if (false && opts && Array.isArray(opts.src) && opts.src.length) {   // 1.1.0: no sources in the tree (they stay in the cards)
          const s = document.createElement("div");
          s.className = "tm-src row-src";
          s.appendChild(document.createTextNode(opts.srcLabel || "מקור: "));
          refLinks(s, opts.src);
          panel.appendChild(s);
        }
        return inp;
      };
      // (1.0.1-H: the 1.0.0 two-button rows `optRow` were replaced by the opinions table below)
      // 1.0.1-H: the opinions table (the user: "את השיטות תנסה להכניס לתוך מסגרת מסודרת"): one row per dispute - the subject, its sources as
      // links, and the readings as buttons (2 or 3); picking one calls onPick(key), marks the button, shows the reading's explanation in the
      // info box and, when the row has `fly`, flies to the spot. Rows whose model switch is missing are shown disabled.
      // row = { cap, refs, options: [[key, label, info, infoRefs?]], current, onPick, fly?: () => void, disabled? }; returns { mark }
      const opsBox = document.createElement("div");
      opsBox.id = "tm-ops";
      // 1.0.1-H: every row is also kept in OPS (with row.mark and row.cur = the key now shown) for the presentation (75-tour.js, ctx.ui)
      const OPS = [];
      // 1.0.2 (item 4): a row with an id (the ctx.shared key of its switch) is found by the cards' chips: OPS_BY_ID[id]; row.short = its
      // name in a card with two rows, row.chips = { key: the chip's short label }, row.cardFly = a chip also flies (the subject moves)
      const OPS_BY_ID = {};
      const opRow = function(row) {
        OPS.push(row);
        if (row.id) OPS_BY_ID[row.id] = row;
        row.cur = row.current;
        const box = document.createElement("div");
        box.className = "tm-op";
        const cap = document.createElement("span");
        cap.className = "cap";
        cap.textContent = ui_stripSrc(row.cap);   // 1.1.0: no sources in the tree (they are on the card's chips)
        box.appendChild(cap);
        // 1.1.0 (the user): no sources in the tree - the row's refs stay on the card of its subject (the chips) and in the presentation
        const bb = document.createElement("div");
        // PANEL_FIT_N8 (the user, 24.11.2026: "תפארת ישראל — בלילה, בבית המוקד" came out narrow and cut): a reading whose label is long takes the row's
        // whole width (one column) - in a half-width cell (about 75 px) it ran to four lines
        const longOpt = row.options.some((o) => ui_stripSrc(String(o && o[1] || "")).length > 18);
        bb.className = "bb" + (longOpt ? " one" : row.options.length % 3 === 0 ? " c3" : "");   // 1.0.1-L: three in a row; two and four in two columns (1.8.0: six - two rows of three)
        const bts = [];
        const mark = (key) => {
          row.cur = key;
          for (const b of bts) b.el.classList.toggle("on", b.key === key);
          chipsRefresh();   // 1.0.2 (item 4): an open card's chips follow the table, whoever marked it
        };
        row.mark = mark;
        for (const [key, label, info, infoRefs] of row.options) {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = ui_stripSrc(label);   // 1.1.0: no sources in the tree
          if (b.textContent !== label) b.title = label;
          if (row.disabled) b.disabled = true;
          b.addEventListener("click", () => {
            //@@slot opRow-note
            if (typeof row.fly === "function") {
              try { autoOff.flush(); } catch (_) {}
              try { if (typeof ctx.shared.closeAuto === "function") ctx.shared.closeAuto(); } catch (_) {}
              try { placeLeave({}); } catch (_) {}   // the layer or the untimed feature of the place before
            }
            mark(key);
            try {
              row.onPick(key);
            } catch (_) {
            }
            // 1.0.1-L (L.34): the reading's explanation opens in the floating card beside the panel (K.9b scrolled the panel to its foot)
            if (info) setInfo("__place", { text: info, refs: infoRefs || row.refs || [] }, { title: row.cap + " — " + label, anchor: b, row });   // 1.0.2: the card's chips = this row
            if (typeof row.fly === "function") {
              try {
                row.fly(key);
              } catch (_) {
              }
              // 1.0.1-K (review UI-H2-2): the row flew elsewhere - the view or place it left is no longer marked
              for (const o of btns) o.classList.remove("on");
              for (const o of placeBtns) o.classList.remove("on");
            }
            hidePanelOnPhone();
          });
          bb.appendChild(b);
          bts.push({ key, el: b });
        }
        box.appendChild(bb);
        //@@slot opRow-2
        mark(row.current);
        return { mark };
      };
      let chipsRefresh = () => {};   // 1.0.2 (item 4): set with the cards' chips below
      const ui_chipHooks = [];   // CHIP_KEEPS_DEMO_T: more hosts of chips that follow every change of a row (ctx.ui.chips.hook: the presentation's banner)
      // ===== 1.0.1-L (L.34, the user: "כל פעם שלוחצים על הר הבית הוא פותח הסבר ואז צריך לגלול כדי למצוא את יתר הכפתורים"; "כן, כרטיס צף"):
      // the floating EXPLANATION CARD #tm-xcard. Until 1.0.1-K the explanation of a view / place / reading was written into #tm-info at the
      // panel's foot and the panel was scrolled to it, so the buttons went out of view. Now the panel holds the buttons only; the explanation
      // opens in a card BESIDE the panel (over the model, next to the panel's edge, its top at the height of the clicked button), with a ✕,
      // its own scroll and the source links; a new choice replaces its content; Esc or ✕ closes it; on a phone it is a bottom sheet above the
      // nav row (CSS). One card at a time: opening it closes the label's card (openCard closes this one), and the presentation closes it when
      // it starts (ctx.ui.card.close). setInfo keeps its old signature and fills the card (ctx.ui.setInfo). =====
      let closeLabelCard = () => {};   // the label's card (set below, where it is built)
      const xcard = document.createElement("div");
      xcard.id = "tm-xcard";
      xcard.setAttribute("role", "dialog");
      xcard.setAttribute("aria-label", "הסבר ומקורות");
      const xHead = document.createElement("div");
      xHead.className = "h";
      const xTitle = document.createElement("span");
      xTitle.className = "tt";
      const xClose = document.createElement("button");
      xClose.type = "button";
      xClose.className = "x";
      xClose.textContent = "✕";
      xClose.title = "סגור את ההסבר (Esc)";
      // 1.0.1-L (the user, on the card over the Sea: "הבועה הזו חוסמת את המסך"): the card opens at the window's left edge, clear of the subject in the
      // middle, and ▾ folds it to its title; the fold stays for the next places, until it is opened again or the card is closed
      const xMin = document.createElement("button");
      xMin.type = "button";
      xMin.className = "x";
      const setXMin = (on) => {
        xcard.classList.toggle("min", !!on);
        xMin.textContent = on ? "▴" : "▾";
        xMin.title = on ? "פתח את ההסבר" : "קפל את ההסבר, כדי לראות את המודל";
      };
      setXMin(false);
      const toggleXMin = (e) => {
        e.stopPropagation();
        setXMin(!xcard.classList.contains("min"));
        placeXCard();
      };
      xMin.addEventListener("click", toggleXMin);
      xTitle.addEventListener("click", (e) => { if (xcard.classList.contains("min")) toggleXMin(e); });
      xHead.appendChild(xTitle);
      xHead.appendChild(xMin);
      xHead.appendChild(xClose);
      const xBody = document.createElement("div");
      xBody.className = "b";
      const xRefs = document.createElement("div");
      xRefs.className = "r";
      const xOps = document.createElement("div");   // 1.0.2 (item 4): "שיטות:" and the chips, when the subject has opinions
      xOps.className = "o";
      xOps.style.display = "none";
      // SAME_PLACE_B2 / ORDER_B2 (fix-b2, 22.11.2026 - the user's decisions 15, 16 and 24): the card's own links, under its opinions:
      // "אותו מקום בבית השני" - the same place in the other house (the shell opens it there: house-bridge.js window.__tmGoPlace) - for the
      // places that have a counterpart (UI_SAME_PAIRS: [the First Temple's title, the Second Temple's]); and in the Second Temple "בסדר
      // היום" - the morning service's presentation at the stage done in that place (ctx.shared.placeOrder: title -> stage id, 57-add208.js)
      const xLinks = document.createElement("div");
      xLinks.className = "o";
      xLinks.style.display = "none";
      xOps.classList.add("ops-top");   // N15: the readings' switches open the card, above the text
      xcard.appendChild(xHead);
      xcard.appendChild(xOps);
      xcard.appendChild(xBody);
      xcard.appendChild(xRefs);
      xcard.appendChild(xLinks);
      document.body.appendChild(xcard);
      const UI_SAME_PAIRS = [
        ["הר הבית והחצר הגדולה", "הר הבית"],
        // SAME_PAIRS_107 (the user's decision 107, 22.11.2026): the outer court and the women's court; the gates of the priests' court and the seven
        // gates of the Azara (each of the seven leads to the one; the one to the Nikanor gate); the steps to the house and the ulam (its steps are in its card)
        ["החצר החיצונה (החצר החדשה)", "עזרת נשים"], ["שערי חצר הכהנים", "שער ניקנור"], ["שערי חצר הכהנים", "שער הקרבן"], ["שערי חצר הכהנים", "שער הניצוץ"],
        ["שערי חצר הכהנים", "שער הדלק"], ["שערי חצר הכהנים", "שער הבכורות"], ["שערי חצר הכהנים", "שער המים"], ["שערי חצר הכהנים", "שער בית המוקד — פתחו של הבית לעזרה"],
        ["המעלות אל הבית (האוטם)", "האולם"], ["גנת הוורדים — מחוץ לשער המערב", "גנת הוורדים — מחוץ לשער קיפונוס"], ["השער המזרחי", "שער שושן"], ["החצר הפנימית — חצר הכהנים", "העזרה"], ["חצר הכהנים", "עזרת כהנים"],
        ["בר שורא — חומה קטנה לפנים מן החומה", "בר שורא — חומה קטנה לפנים מן החומה"], ["שתי הסנהדראות הקטנות", "שתי הסנהדראות הקטנות"],
        ["משמרות השוערים (דברי הימים א כו)", "המשמרות — שלושה לכהנים ועשרים ואחד ללויים"], ["לשכת הגזית", "לשכת הגזית — הסנהדרין"],
        ["בית המטבחים", "בית המטבחים"], ["מזבח הנחושת", "המזבח"], ["מידות המזבח — קווי האמות", "מידות המזבח — 32, 30, 28, 26, 24, והמזבח הקודם 28 על 28"],
        ["השיתין — השלמה מן המשנה", "השיתין — שני הנקבים וטבלת השיש"], ["ספלי הניסוך — השלמה מן המשנה", "ספלי הניסוך"],
        ["הכבשים הקטנים — השלמה מן הגמרא", "כבשים קטנים — רש״י"], ["הכבש", "הכבש הגדול"], ["עולים במזרח ויורדים במערב — הכבש", "עולים במזרח ויורדים במערב — הכבש"],
        ["כיור משה", "הכיור"], ["מקום הלויים המשוררים", "דוכן הלויים"], ["האולם ובית החליפות", "האולם"], ["פשפשי בית החליפות", "פשפשי בית החליפות"],
        ["שולחנות האולם — ר׳ יוסי בר׳ יהודה", "שולחנות האולם — שיש וזהב"], ["פתח ההיכל ודלתותיו", "השער הגדול — ארבע הדלתות"],
        ["פתיחת דלתות ההיכל — הדגמה", "פתיחת השער הגדול — הדגמה"], ["ההיכל", "הקודש"], ["שיפוע רצפת הבית", "שיפוע רצפת הבית"],
        ["טבלת השיש — עפר הסוטה", "טבלת השיש — עפר הסוטה"], ["מנורת משה ועשר המנורות", "המנורה"], ["שולחן משה ועשרה השולחנות", "שולחן לחם הפנים"],
        ["מזבח הזהב", "מזבח הזהב"], ["גילופי הקירות — כרובים, תמורות, פטורי ציצים, פקעים", "פיתוחי הקירות — כרובים דצורתא"],
        ["הפרוכת", "שתי הפרוכות — בין הקודש לקודש הקדשים"], ["קודש הקדשים — הדביר", "קודש הקדשים ואבן השתייה"], ["אבן השתייה", "קודש הקדשים ואבן השתייה"],
        ["הלול שאחורי בית הכפורת", "הלול שאחורי בית הכפורת"], ["היציע והתאים", "התאים — שלושים ושמונה בשלוש קומות"],
        ["עליית קודש הקדשים — מעל הדביר", "העלייה והלולין"]
      ];
      // SAME_PAIRS_C (fix-c, 22.11.2026 - the user, the "same place" list, chapter ב, 09:38: "לבצע"): the First Temple's new counterparts
      // (src/slots/70-ui.slots.js PARALLELS_C, 59-parallels.js) and the Second Temple's places they stand for
      UI_SAME_PAIRS.push(
        ["דין המנעל בהר הבית", "דין המנעל בהר הבית"], ["בית המדרש שבהר הבית", "בית המדרש שבהר הבית"], ["בית הכנסת שבהר הבית", "בית הכנסת שבהר הבית"],
        ["השער המערבי — שער קיפונוס", "שער קיפונוס"], ["השער הצפוני — שער טדי", "שער טדי"], ["השער הדרומי — שער חולדה", "שערי חולדה"],
        ["בין האולם ולמזבח", "בין האולם ולמזבח"], ["בית החליפות — חלונות הסכינים", "בית החליפות — חלונות הסכינים"],
        ["חלקי יהודה ובנימין — הרצועה שבדרום המזבח", "חלקי יהודה ובנימין — הרצועה שבדרום המזבח"], ["הכבשים הקטנים — תוספות", "כבשים קטנים — תוספות"],
        ["שלוש המחתות — בכל יום וביום הכיפורים", "שלוש המחתות — בכל יום וביום הכיפורים"], ["שולחן החלבים — שני השולחנות שבמערב הכבש", "שולחן החלבים — שני השולחנות שבמערב הכבש"],
        ["הליכת עולה רגל — בגובה העיניים (ברטנורא)", "הליכת עולה רגל — בגובה העיניים (ברטנורא)"], ["מצות ערבה — הדגמה", "מצות ערבה — הדגמה"],
        ["מעיין השילוח", "מעיין השילוח"], ["ניסוך המים מן השילוח — הדגמה", "ניסוך המים מן השילוח — הדגמה"],   // 117 א (12:09)
        ["שלושה עשר השופרות — מתג", "שלשה עשר שופרות"],   // 112 ג (12:09)
        ["בית המטבחים", "הטבעות"]   // 113 א (12:09): the Second Temple's rings - this house's slaughter place (its own pair with "בית המטבחים" stays first)
      );
      const samePlaceOf = (t) => {
        const h = typeof window.__tmHouse === "string" ? window.__tmHouse : null;
        if (!h || typeof window.__tmGoPlace !== "function") return null;
        const i = h === "rishon" ? 0 : 1, p = UI_SAME_PAIRS.find((q) => q[i] === t);
        return p ? p[1 - i] : null;
      };
      const renderLinks = (title) => {
        xLinks.textContent = "";
        const t = String(title || ""), other = samePlaceOf(t), PO = ctx.shared.placeOrder, st = PO && PO[t];
        const T = ctx.shared.tour, TM = ctx.shared.tamid;
        const link = (txt, tip, fn) => { const a = document.createElement("a"); a.textContent = txt; a.title = tip; a.addEventListener("click", (e) => { e.preventDefault(); fn(); }); xLinks.appendChild(a); };
        if (other) link(window.__tmHouse === "rishon" ? "אותו מקום בבית השני" : "אותו מקום בבית הראשון", "פותח את \u201d" + other + "\u201d בבית " + (window.__tmHouse === "rishon" ? "השני" : "הראשון"), () => window.__tmGoPlace(other));
        if (st && T && TM && typeof T.start === "function") link("בסדר היום", "פותח את מצגת סדר עבודת הבוקר בשלב שנעשה כאן", () => {
          xcardClose();
          if (T.start("tamid") === false) return;
          const i = (T.slides || []).findIndex((x) => x && x.id === st);
          if (i > 0 && typeof T.goto === "function") T.goto(i);
        });
        xLinks.style.display = xLinks.childNodes.length ? "" : "none";
      };
      let xOpen = false, xAnchor = null, xSide = null, xOpsIds = null, xRow = null;
      // CHIP_KEEPS_DEMO_T: the open card is the card of the demonstration its click started (set by the place's button below); its chips
      // keep that demonstration running while it runs (an untimed feature of a demonstration's button - the willows' circuit - counts as
      // running while it is on)
      let xDemo = false, xFeat = null;
      const xRuns = () => { if (ui_demoLive()) return true; try { return !!(xFeat && typeof xFeat.isOn === "function" && xFeat.isOn()); } catch (_) { return false; } };
      const xKeep = () => xDemo && xRuns();
      //@@slot buildUI.UI_OPS_V
      const opsFor = (subj) => {
        const ids = [];
        const add = (a) => { for (const id of a || []) if (ids.indexOf(id) < 0) ids.push(id); };
        if (!subj) return ids;
        if (subj.view) add(UI_OPS_V[subj.view]);
        if (subj.title) {
          add(UI_OPS_P[subj.title]);
          const it = placeItemByT[subj.title];
          if (it) { add(UI_OPS_V[it.view]); add(UI_OPS_V[it.key]); }
          // CHIP_KEEPS_DEMO_T (fix-t): a button of the group "הדגמות" has its own title - its card takes the rows of the place or the card
          // it stands for (it.opsOf, set where the group is built) and the demonstration's own rows (it.opsAdd: ui_demosList's d.ops)
          if (it && Array.isArray(it.opsOf)) for (const t of it.opsOf) add(UI_OPS_P[t]);
          if (it && Array.isArray(it.opsAdd)) add(it.opsAdd);
        }
        if (subj.label) for (const [re, a] of UI_OPS_L) if (re.test(subj.label)) add(a);
        for (const lay of subj.layers || []) if (UI_OPS_LAYER[lay]) add([UI_OPS_LAYER[lay]]);
        return ids;
      };
      // the rows now present (an id or a row object), each once; a disabled row (its switch missing) shows no chips
      const opsLive = (ids) => {
        const out = [];
        for (const id of Array.isArray(ids) ? ids : []) {
          const r = id && typeof id === "object" ? id : OPS_BY_ID[id];
          if (r && !r.disabled && Array.isArray(r.options) && r.options.length > 1 && out.indexOf(r) < 0) out.push(r);
        }
        return out;
      };
      // a chip's words: row.chips[key], else the reading's label up to its colon, without a closing bracket
      const opsChip = (row, key) => {
        if (row.chips && row.chips[key]) return row.chips[key];
        const o = row.options.find((x) => x[0] === key);
        let s = String(o ? o[1] : key);
        const i = s.indexOf(":");
        if (i > 0 && i < 40) s = s.slice(0, i);
        s = s.replace(/\s*\([^()]*\)\s*$/, "").trim();
        return s.length > 72 ? s.slice(0, 70) + "…" : s;   // 1.5.0: the chips wrap, not cut
      };
      // CHIP_KEEPS_DEMO_T (fix-t, 23.11.2026 - the user, 01:31: "בכל הדגמה ומצגת שיש שיטות, צריך שבכרטיס יהיה מעבר ברור ומהיר בין
      // השיטות"; the coordinator's plan, item 19): a chip on the card of a RUNNING demonstration, or on the presentation's banner, changes the
      // reading and the demonstration goes on with it - it is not stopped (the rule of 90-entry.js asks ctx.shared.ui_chipKeepsDemo, below)
      // and the camera does not fly (row.fly is skipped). A row with a way of its own to change while its demonstration runs has it in
      // UI_LIVE[row.id](row, key) (the house's slots); otherwise its onPick. The cards of the places keep their old behaviour.
      const ui_demoLive = () => {
        for (const d of ctx.shared.demoStops || []) { try { if (d && typeof d.running === "function" && d.running()) return true; } catch (_) {} }
        return false;
      };
      // THE ONE EXCEPTION to "a switch stops the demonstrations" (90-entry.js asks this hook, DEMO_STOP_G): a chip drawn to keep the
      // demonstration (the class "tm-dk": on the running demonstration's own card, or on the presentation's banner) - true while one runs
      ctx.shared.ui_chipKeepsDemo = (btn) => !!(btn && typeof btn.closest === "function" && btn.closest(".tm-dk") && (btn.closest("#tm-tour-box") || xKeep()));
      const pickFromCard = (row, key, keep) => {
        if (keep) {
          row.mark(key);
          const L = typeof UI_LIVE === "object" && UI_LIVE ? UI_LIVE[row.id] : null;
          try { if (typeof L === "function") L(row, key); else row.onPick(key); } catch (_) {}
          return;
        }
        row.mark(key);
        try {
          row.onPick(key);
        } catch (_) {
        }
        if (row.cardFly && typeof row.fly === "function") {
          //@@slot pickFromCard
          try {
            row.fly(key);
          } catch (_) {
          }
          for (const o of btns) o.classList.remove("on");
          for (const o of placeBtns) o.classList.remove("on");
        }
      };
      // writes the chips of the rows `ids` into host; false (and host hidden) when there is none. onPicked(row, key) after a chip's switch
      // CHIP_KEEPS_DEMO_T: keep (a function, asked at the click) - true while the chip should keep the demonstration running; such chips
      // carry the class "tm-dk" (ctx.shared.ui_chipKeepsDemo)
      const renderChips = (host, ids, onPicked, keep) => {
        host.textContent = "";
        const rows = opsLive(ids);
        host.style.display = rows.length ? "" : "none";
        if (!rows.length) return false;
        //@@slot renderChips
        for (const row of rows) {
          const g = document.createElement("span");
          // CHIP_NAME_211 (the understandability review, U-45): a card with ONE row ended "שיטות:" and bare chips - in "הרובד הרביעי"
          // the three chips of "מעלות האולם" read as three opinions about the rovad. The row's name stands before its chips always.
          const nm = row.short || (row.cardOnly ? "" : row.cap) || "";
          if (rows.length > 1 || nm) {
            g.className = "g";
            const k = document.createElement("span");
            k.className = "k";
            k.textContent = nm + (nm ? ":" : "");
            g.appendChild(k);
          }
          for (const [key, label] of row.options) {
            const a = document.createElement("a");
            a.href = "#";
            a.setAttribute("role", "button");
            const on = row.cur === key;
            a.className = (on ? "on" : "") + (keep ? " tm-dk" : "");   // CHIP_KEEPS_DEMO_T
            a.setAttribute("aria-pressed", on ? "true" : "false");
            ui_fillSrc(a, opsChip(row, key));
            a.title = String(label || "");
            a.addEventListener("click", (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              if (row.cur === key) return;
              pickFromCard(row, key, typeof keep === "function" ? !!keep() : !!keep);   // CHIP_KEEPS_DEMO_T
              if (onPicked) onPicked(row, key);
            });
            g.appendChild(a);
          }
          host.appendChild(g);
        }
        return true;
      };
      // the panel's card: a card opened from the table (xRow) shows the new reading's explanation, as the table's button does
      const xChipPicked = (row, key) => {
        if (xRow !== row) return;
        const o = row.options.find((x) => x[0] === key);
        if (o && o[2]) setInfo("__place", { text: o[2], refs: o[3] || row.refs || [] }, { title: row.cap + " — " + o[1], anchor: xAnchor, side: xSide, row });
      };
      // the card's place: beside the panel's edge (right of the panel when it is shown, else at the window's edge), its top at the clicked
      // button's top, clamped so that it stays inside the window above the nav row; a phone uses the CSS bottom sheet (no inline top)
      const placeXCard = () => {
        if (!xOpen) return;
        const W = window.innerWidth || 0, H = window.innerHeight || 0;
        if (isPhone(W)) {
          // the bottom sheet, just above the nav row and the compass (the row wraps on a phone: its real top is measured)
          xcard.style.right = "";
          xcard.style.left = "";
          xcard.style.top = "";
          xcard.style.width = "";
          let edge = H - 70;
          for (const id of ["tm-nav", "tm-compass"]) {
            const el = document.getElementById(id);
            const r = el && typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : null;
            if (r && r.height && r.top < edge) edge = r.top;
          }
          xcard.style.bottom = (H - edge + (document.body.classList.contains("tm-measuring") ? 34 : 6)).toFixed(0) + "px";
          return;
        }
        xcard.style.bottom = "";
        const shown = panel.style.display !== "none", rightGap = shown ? 242 : 12;
        // the presentation's banner on the left (a card opened while it is paused) is never overlapped: the card narrows in a small window
        const tb = document.getElementById("tm-tour-box");
        const tr = tb && typeof tb.getBoundingClientRect === "function" ? tb.getBoundingClientRect() : null;
        const atLeft = !(tr && tr.width);   // 1.0.1-L: every card at the window's left edge, so that the subject in the middle stays clear; beside the panel only while the presentation's banner holds the left
        xcard.style.left = atLeft ? "12px" : "";
        xcard.style.right = atLeft ? "auto" : rightGap + "px";
        xcard.style.width = tr && tr.width ? Math.max(180, Math.min(340, W - rightGap - tr.right - 8)).toFixed(0) + "px" : "";
        const barH = ui_barH();   // 1.0.2: 9 px below the bar, as #tm-panel (the old 56 sat flush against the 56 px bar)
        let top = barH + 9;
        if (!atLeft && xAnchor && xAnchor.isConnected !== false && typeof xAnchor.getBoundingClientRect === "function") {
          const r = xAnchor.getBoundingClientRect();
          if (r && r.height) top = r.top - 6;
        }
        const h = xcard.offsetHeight || 200;
        top = Math.max(barH + 9, Math.min(H - h - 64, top));
        xcard.style.top = top.toFixed(0) + "px";
      };
      const xcardClose = () => {
        if (!xOpen) return;
        xOpen = false;
        xAnchor = null;
        xSide = null;
        xOpsIds = null;
        xRow = null;
        xDemo = false; xFeat = null;   // CHIP_KEEPS_DEMO_T
        setXMin(false);
        xcard.style.display = "none";
      };
      // open(title, content, refs, anchor, side, ops?, row?): the content is plain text, or HTML when it starts with a tag (ctx.ui.card); refs = [[label, ref], ...]
      // become links; 1.0.2: ops = the rows whose chips end the card (ids or rows; none from ctx.ui.card.open), row = the table's row that opened it
      const xcardOpen = (title, text, refs, anchor, side, ops, row) => {
        closeLabelCard();   // one card at a time
        ui_fillSrc(xTitle, String(title || ""));   // 1.0.1-L (L.89)
        if (/^\s*</.test(String(text || ""))) { xBody.innerHTML = String(text); xBody.__raw = null; }
        //@@slot xcardOpen
        const rs = Array.isArray(refs) ? refs : [];
        refsBlock(xRefs, rs, placeXCard);   // N15: the sources closed behind "הצג מקורות"
        xOpsIds = Array.isArray(ops) && ops.length ? ops : null;
        xRow = row || null;
        xDemo = false; xFeat = null;   // CHIP_KEEPS_DEMO_T (the place's button marks it again when its click started a demonstration)
        renderChips(xOps, xOpsIds, xChipPicked);
        renderLinks(title);   // SAME_PLACE_B2 / ORDER_B2
        xAnchor = anchor || null;
        xSide = side || null;
        xOpen = true;
        xcard.style.display = "flex";
        xBody.scrollTop = 0;
        xRefs.scrollTop = 0;
        placeXCard();
      };
      xClose.addEventListener("click", (e) => {
        e.stopPropagation();
        xcardClose();
      });
      window.addEventListener("resize", placeXCard);
      // the panel came or went: the card moves to the panel's edge; on a phone the open panel covers the sheet, so the sheet closes
      burger.addEventListener("click", () => {
        if (isPhone() && panel.style.display !== "none") xcardClose();
        else placeXCard();
      });
      window.addEventListener("keydown", (e) => {
        if (e.defaultPrevented || (e.key !== "Escape" && e.key !== "Esc")) return;
        const had = xOpen;
        xcardClose();
        closeLabelCard();   // (the label's card closes with Esc too)
        if (had) e.preventDefault();
      });
      // ----- 1.0.1-L (L.27, the user: "תן לזה 15 שניות ויחזור אוטו"): a feature a PLACE switched on goes off by itself after ui_AUTO_OFF_S seconds,
      // with a small countdown on the place's button. One setTimeout + one 1 s interval per armed feature, nothing per frame. The feature's own
      // pill or opinion row cancels the timer and the user's state stays; a feature the user switched on by its pill is never armed; the pills
      // themselves are not timed; "↺ החזר הכל" and the presentation cancel the timers (ctx.ui.autoOff); an animation with its own duration is
      // exempt (feature.timed === false: the king's ascent). -----
      const AUTO = new Map();   // feature key -> { off, left, badge, timer, tick }
      const autoClear = (key) => {
        const a = AUTO.get(key);
        if (!a) return false;
        clearTimeout(a.timer);
        clearInterval(a.tick);
        if (a.badge && a.badge.parentNode) a.badge.parentNode.removeChild(a.badge);
        AUTO.delete(key);
        return true;
      };
      //@@slot buildUI.after-a-note
      let leaveLayer = null, leaveFeat = null;
      // PILL_SCOPE_N8 (the user, 24.11.2026: "למה מוצגים פה?" - "פתח את המסיבה" and "הסר ענן" in the middle of a demonstration): the place the
      // reader last pressed in the panel ({ title, group }); a view button or "↺ החזר הכל" clears it. A pill with a scope() shows only for its own place.
      let uiPlaceCtx = null;
      const placeLeave = (it) => {
        // LEAVE_TWICE_211 (the refuter, R-03): the same place clicked twice in a row keeps what it armed at the first click - before
        // this the second click forgot it (the feature was "already on", so it passed for the reader's own) and it never went off again.
        const keepL = (leaveLayer && leaveLayer === it.layer) ? leaveLayer : null;
        const keepF = (leaveFeat && it.feature && it.feature.key === leaveFeat.key) ? leaveFeat : null;
        if (leaveLayer && !keepL) { const g = ctx.layers && ctx.layers[leaveLayer]; if (g && g.visible) setLayer(leaveLayer, false); }
        //@@slot placeLeave
        leaveLayer = keepL; leaveFeat = keepF;
        if (it.layer && !keepL) { const g = ctx.layers && ctx.layers[it.layer]; if (g && !g.visible) leaveLayer = it.layer; }
        const F = it.feature;
        if (!keepF && F && F.timed === false && typeof F.off === "function" && typeof F.isOn === "function") { try { if (!F.isOn()) leaveFeat = F; } catch (_) {} }
      };
      const autoOff = {
        seconds: ui_AUTO_OFF_S,
        arm: (key, off, btn, secs) => {
          autoClear(key);
          const S = secs > 0 ? secs : ui_AUTO_OFF_S;   // AUTO30_242: a feature may ask for its own seconds (F.secs)
          const a = { off, left: S, badge: null, timer: 0, tick: 0 };
          if (btn) {
            a.badge = document.createElement("span");
            a.badge.className = "tm-cnt";
            a.badge.textContent = String(a.left);
            btn.appendChild(a.badge);
          }
          a.tick = setInterval(() => {
            a.left = Math.max(0, a.left - 1);
            if (a.badge) a.badge.textContent = String(a.left);
          }, 1000);
          a.timer = setTimeout(() => {
            autoClear(key);
            try { off(); } catch (_) {}
          }, S * 1000);
          AUTO.set(key, a);
        },
        // cancel(key): that feature's timer, cancel(): every timer; the features stay as they are
        cancel: (key) => {
          if (key != null) return autoClear(key);
          for (const k of Array.from(AUTO.keys())) autoClear(k);
          return true;
        },
        pending: () => Array.from(AUTO.keys()),   // the features now waiting for their timer (their ctx.shared keys)
        // the place's click: its feature on; a timer unless the user had it on by its own pill, or it is an animation with its own end
        run: (F, btn) => {
          if (!F || typeof F.on !== "function") return;
          const armed = AUTO.has(F.key), was = !!F.isOn();
          if (!was) F.on();
          if (F.timed !== false && typeof F.off === "function" && (!was || armed)) autoOff.arm(F.key, F.off, btn, F.secs);
        },
        // "↺ החזר הכל": what the timers would have switched off goes back now, and no timer stays
        flush: () => {
          for (const [k, a] of Array.from(AUTO.entries())) {
            autoClear(k);
            try { a.off(); } catch (_) {}
          }
        }
      };
      // ----- Otzaria: open a source at book id + line index (reader.openBook, permission "reader.open"); 1.0.1-L (Part 7, U2): Otzaria only, no other site -----
      const tmToast = (msg) => {
        const t = document.getElementById("toast");
        if (!t) return;
        t.textContent = msg;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 6000);
      };
      const errText = (res) => {
        if (res && res.error) return (res.error.code || "") + (res.error.message ? " – " + res.error.message : "");
        return "no result (" + JSON.stringify(res) + ")";
      };
      const okRes = (res) => !!res && res.success !== false && res.data !== false && res.data !== null && res.data !== undefined;
      const callT = (method, params, ms) => Promise.race([
        window.Otzaria.call(method, params),
        new Promise((resolve) => setTimeout(() => resolve({ success: false, error: { code: "timeout", message: method + " >" + (ms || 5000) + "ms" } }), ms || 5000))
      ]);
      // After a successful open, make sure the book's tab is the active one (the API docs do not promise that it is).
      const focusBook = async (book) => {
        try {
          const st = await callT("reader.getCurrentState", {}, 3000);
          const d = st && st.data;
          if (!d || !Array.isArray(d.openTabs)) return;
          if (d.currentId === book || d.currentBookUid === "id:" + book) return;
          const i = d.openTabs.findIndex((t) => t && !t.isSelf && (t.id === book || t.bookUid === "id:" + book));
          if (i >= 0) await callT("reader.activateTab", { index: i }, 3000);
        } catch (_) {
        }
      };
      // Open by bookUid+index (1.0.10 of the Second Temple plugin opened by numeric id and got data:false); the identifier
      // that worked is cached per book. Fallback: library.getBookMetadata gives the bookUid.
      const bookIdf = {};
      const openAt = async (book, index) => {
        const tries = [];
        if (bookIdf[book]) tries.push(bookIdf[book]);
        tries.push({ bookUid: "id:" + book }, { id: book, type: "text" }, { id: book, source: "library" });
        let last = "";
        for (const idf of tries) {
          const res = await callT("reader.openBook", Object.assign({}, idf, { index }));
          if (okRes(res)) {
            bookIdf[book] = idf;
            return "";
          }
          last = JSON.stringify(idf) + ": " + errText(res);
        }
        const md = await callT("library.getBookMetadata", { id: book });
        const d = md && md.data;
        if (d && (d.bookUid || d.bookId)) {
          const idf = d.bookUid ? { bookUid: d.bookUid } : { bookId: d.bookId };
          const res = await callT("reader.openBook", Object.assign({}, idf, { index }));
          if (okRes(res)) {
            bookIdf[book] = idf;
            return "";
          }
          last = "metadata " + JSON.stringify(idf) + ": " + errText(res);
        } else {
          last += " | getBookMetadata: " + errText(md);
        }
        return last;
      };
      // ref = {book, index} (from ui_V / ui_P / ui_MI / ui_RB / ui_MN) or a string the old tables used ("I_Kings.6.6")
      // 1.0.1-L (Part 7, U2, the user: "כל קישורי המקורות בבאנרי המידע חייבים להיות לתוכנת אוצריא ולא לספריא"): outside Otzaria, as in the shared
      // link, a click names the source and says where it opens; it never goes to another site.
      const UI_OTZ_NOTE = " — המקור נפתח בתוכנת אוצריא";
      const openSource = async (ev, label, ref) => {
        ev.preventDefault();
        ev.stopPropagation();
        let target = null;
        if (ref && typeof ref === "object" && ref.book && ref.index !== null && ref.index !== undefined) target = ref;
        else if (typeof ref === "string") target = ui_sefToOtz(ref);
        if (typeof window.Otzaria === "undefined" || !window.Otzaria.call || !target) {
          if (target) {
            // 1.0.1-L (the user: "לחצתי על מקור לפתיחה באוצריא והוא לא נפתח"): outside the plugin, Otzaria's own link: otzaria://open/book/<id>?index=<line>
            tmToast("פותח באוצריא: " + label + " (רק כשאוצריא מותקנת במחשב)");
            try {
              const go = document.createElement("a");
              go.href = "otzaria://open/book/" + encodeURIComponent(target.book) + "?index=" + encodeURIComponent(target.index);
              go.style.display = "none";
              document.body.appendChild(go);
              go.click();
              go.remove();
            } catch (_) {}
            return;
          }
          tmToast(label + UI_OTZ_NOTE);
          return;
        }
        let lastErr = "";
        tmToast("פותח באוצריא: " + label + "...");
        try {
          lastErr = await openAt(target.book, target.index);
          if (!lastErr) {
            await focusBook(target.book);
            tmToast("נפתח באוצריא: " + label);
            return;
          }
        } catch (e) {
          lastErr = "exception: " + (e && e.message ? e.message : e);
        }
        tmToast("פתיחה באוצריא נכשלה: " + label + " (" + lastErr + ")");
      };
      // source links appended to any element (1.0.1-H: used by the info box, the opinions table and the toggle rows)
      // 1.0.1-L: 57-kelim.js gives its links as specs, ["V", 10, 7, 40] / ["L", book, line]: unresolved, the place's and the vessels' links opened nothing
      const refOf = (ref0) => !Array.isArray(ref0) ? ref0 : ref0[0] === "V" ? ui_V(ref0[1], ref0[2], ref0[3]) : ref0[0] === "L" ? { book: ref0[1], index: ref0[2] } : "";
      const refLinks = (host, rs) => {
        for (const [label, ref0] of rs) {
          const ref = refOf(ref0);
          const a = document.createElement("a");
          a.href = "#";
          a.__ref = ref;   // 1.0.1-L (Part 7, U2): no address of another site; the click opens Otzaria
          a.addEventListener("click", (ev) => openSource(ev, label, ref));
          a.textContent = label;
          host.appendChild(a);
        }
      };
      // N15 (the user, a general instruction): a card's sources are CLOSED by default behind a button "הצג מקורות" / "הסתר מקורות". host = the
      // card's sources' box (div.r / the banner's div.src); its links stay in div.rl (a closed box is still read by the print: it takes the links
      // by tag, not by sight); onToggle = the card's re-placing, as its height changes. A button, not a link (the demonstrations' ignore list: .tm-rt).
      const refsBlock = (host, rs, onToggle) => {
        host.textContent = "";
        host.classList.remove("open");
        const has = Array.isArray(rs) && rs.length > 0;
        host.style.display = has ? "" : "none";
        if (!has) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tm-rt";
        btn.textContent = "הצג מקורות";
        btn.setAttribute("aria-expanded", "false");
        const list = document.createElement("div");
        list.className = "rl";
        list.appendChild(document.createTextNode("למקור: "));
        refLinks(list, rs);
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const on = host.classList.toggle("open");
          btn.textContent = on ? "הסתר מקורות" : "הצג מקורות";
          btn.setAttribute("aria-expanded", on ? "true" : "false");
          if (typeof onToggle === "function") onToggle(on);
          if (on && typeof list.scrollIntoView === "function") list.scrollIntoView({ block: "nearest" });
        });
        host.appendChild(btn);
        host.appendChild(list);
      };
      // 1.0.2 (A): the linker of a card's text (ui_fillSrc's third argument) for the card's refs rs: each part of a source's bracket that
      // resolves (ui_srcParse above: the label first) becomes a link that opens it exactly as its chip does (openSource: Otzaria, or the
      // otzaria:// link outside it); the bracket keeps its small style (span.tm-src) and its words; nothing resolves -> null (a plain bracket)
      const srcLinker = (rs) => {
        const labels = [];
        let firstBook = null;
        (Array.isArray(rs) ? rs : []).forEach((r, k) => {
          if (!Array.isArray(r) || r.length < 2) return;
          const ref = refOf(r[1]);
          const t = ref && typeof ref === "object" ? ref : typeof ref === "string" ? ui_sefToOtz(ref) : null;
          if (!t || !t.book || t.index == null) return;
          labels.push({ n: ui_srcNorm(r[0]), label: String(r[0]), ref });
          if (k === 0 && UI_SRC_TN_IDS.indexOf(t.book) >= 0) firstBook = t.book;   // the card's first ref only
        });
        const byLabel = (n) => {
          for (const L of labels) if (L.n === n) return L;
          return null;
        };
        const resolve = (body, bare) => {
          const n = ui_srcNorm(body), nr = ui_srcNoRange(n);
          for (const pre of Object.keys(UI_SRC_CM)) {   // 1.7.0: a commentary's bracket goes to the commentary, not to the Mishnah chip
            if (n.indexOf(pre + " ") !== 0) continue;
            const tc = ui_srcParse(nr, bare);
            if (tc) return { label: body.trim(), ref: tc };
            break;
          }
          let L = byLabel(n) || byLabel(nr);
          if (!L) {
            for (const pre of UI_SRC_PRE) {
              if (n.indexOf(pre + " ") !== 0) continue;
              const rest = n.slice(pre.length + 1);
              L = byLabel(rest) || byLabel(ui_srcNoRange(rest));
              break;
            }
          }
          if (L) return { label: L.label, ref: L.ref };
          const t = ui_srcParse(nr, bare);
          return t ? { label: body.trim(), ref: t } : null;
        };
        return (run, full) => {
          const inner = run.t.slice(1, -1);
          const lb = ui_srcLastBook(full, run.i);
          const bare = firstBook != null && lb === firstBook ? firstBook : null;
          const sp = document.createElement("span");
          sp.className = "tm-src";
          sp.appendChild(document.createTextNode("("));
          let any = false;
          let lastName = "";   // 1.7.0: the book named in the previous part of the bracket ("ברטנורא מידות"), for a bare "ch, m" after ";"
          {   // 1.7.0 (Beit Sheni): a bare "(ב, ג)" follows the last citation before it in the card's text; with none - Mishnah Middot
            const before = ui_srcNorm(full.slice(0, run.i)), reb = /\(([^()]*)\)/g;
            let mb;
            while ((mb = reb.exec(before))) {   // the last NAMED citation wins ("(ו, ב)" after "(תמיד ג, ט)" is Tamid too)
              const first = mb[1].split(";")[0].trim(), nmb = /^(.+?) [א-ת"']{1,5}, ?[א-ת"']{1,5}$/.exec(first);
              if (nmb) lastName = nmb[1];
            }
            if (!lastName) lastName = UI_SRC_BARE;
          }
          inner.split(";").forEach((raw, k) => {
            if (k) sp.appendChild(document.createTextNode(";"));
            const body = raw.trim();
            const lead = raw.slice(0, raw.indexOf(body)), trail = raw.slice(raw.indexOf(body) + body.length);
            if (lead) sp.appendChild(document.createTextNode(lead));
            let hit = body ? resolve(body, bare) : null;
            const nm = /^(.+?) [א-ת"'״׳]{1,5}, ?[א-ת"'״׳]{1,5}$/.exec(ui_srcNorm(body));
            if (hit && nm) lastName = nm[1];
            else if (!hit && lastName && /^[א-ת"'״׳]{1,5}, ?[א-ת"'״׳]{1,5}$/.test(ui_srcNorm(body))) hit = resolve(lastName + " " + body, bare);
            if (hit) {
              const a = document.createElement("a");
              a.href = "#";
              a.className = "tm-srcl";
              a.__ref = hit.ref;
              a.textContent = body;
              a.addEventListener("click", (ev) => openSource(ev, hit.label, hit.ref));
              sp.appendChild(a);
              any = true;
            } else if (body) sp.appendChild(document.createTextNode(body));
            if (trail) sp.appendChild(document.createTextNode(trail));
          });
          sp.appendChild(document.createTextNode(")"));
          return any ? sp : null;
        };
      };
      // 1.0.1-L (L.34): setInfo(key | "__place", custom?, opts?) opens the explanation card: the text of the view `key` (ui_INFO / ui_REFS) or
      // the custom {text, refs}; opts.title (else the view's label), opts.anchor = the clicked button (the card's top follows it)
      const setInfo = (key, custom, opts) => {
        const text = custom ? custom.text : ui_INFO[key] || ui_INFO.__general;
        const rs = custom ? custom.refs || [] : ui_REFS[key] || ui_REFS.__general || [];
        let title = opts && opts.title;
        if (!title) {
          const v = ui_VIEWS.find((vv) => vv.key === key);
          title = v ? v.label : key === "__general" ? "מבט כללי" : "";
        }
        // 1.0.2 (item 4): the card's opinions - the table's own row, opts.ops, or the subject's rows by its view key and title
        const row = opts && opts.row ? opts.row : null;
        const ops = row ? [row] : opts && Array.isArray(opts.ops) ? opts.ops : opsFor({ view: key !== "__place" ? key : null, title: opts && opts.title });
        xcardOpen(title, text, rs, opts && opts.anchor, opts && opts.side, ops, row);
      };
      //@@slot buildUI.palaceBasis
      const ncY = ctx.shared && ctx.shared.newCourt && typeof ctx.shared.newCourt.y === "number" ? ctx.shared.newCourt.y : 3;
      const ncCX = ctx.shared && ctx.shared.newCourt && typeof ctx.shared.newCourt.x0 === "number" && typeof ctx.shared.newCourt.x1 === "number"
        ? (ctx.shared.newCourt.x0 + ctx.shared.newCourt.x1) / 2 : 161; // the court's centre x (93.5..228.5)
      //@@slot buildUI.OCI_FB
      const oci = (frag, fb) => {
        const list = ctx.shared && Array.isArray(ctx.shared.outerCourtItems) ? ctx.shared.outerCourtItems : [];
        const it = list.find((o) => o && typeof o.name === "string" && o.name.indexOf(frag) >= 0 && typeof o.x === "number");
        return it ? [it.x, typeof it.y === "number" ? it.y : fb[1], typeof it.z === "number" ? it.z : fb[2]] : fb;
      };
      // the camera for such an item: the module's own (outerCourtItems[i].cam, 20-mount.js 1.0.1-K), else dist amot from it toward the
      // court's centre (so it stays inside the court) and 0.55 dist higher
      const ociCam = (frag, fb, dist) => {
        const list = ctx.shared && Array.isArray(ctx.shared.outerCourtItems) ? ctx.shared.outerCourtItems : [];
        const it = list.find((o) => o && typeof o.name === "string" && o.name.indexOf(frag) >= 0 && Array.isArray(o.cam) && o.cam.length >= 3);
        if (it && isFinite(it.cam[0] + it.cam[1] + it.cam[2])) return it.cam.slice(0, 3);
        const p = oci(frag, fb);
        const dx = ncCX - p[0], dz = 0 - p[2], L = Math.hypot(dx, dz) || 1;
        return [p[0] + dx / L * dist, p[1] + dist * 0.55, p[2] + dz / L * dist];
      //@@slot ociCam
      };
      // (1.0.1-L: no explanation is shown at the start - the card opens on the first choice; the panel's intro line says what the lists are)
      const secViews = document.createElement("div");
      secViews.className = "sec";
      secViews.textContent = "מבטים";
      // ----- 1.0.1-L (the user: search in all the buttons): a field above the views. It filters every button of the panel by its name, without regard to nikud
      // or to quotation marks; the groups that hold a match open, the rest step aside; an empty field brings everything back as it was. Nothing per frame. -----
      {
        const wrap = document.createElement("div");
        wrap.id = "tm-search-wrap";
        const input = document.createElement("input");
        input.id = "tm-search";
        input.type = "search";
        input.placeholder = "חיפוש בכל הכפתורים...";
        input.setAttribute("aria-label", "חיפוש בכל כפתורי התוסף");
        input.autocomplete = "off";
        const none = document.createElement("div");
        none.id = "tm-search-none";
        none.textContent = "לא נמצא כפתור בשם הזה.";
        wrap.appendChild(input);
        wrap.appendChild(none);
        panel.appendChild(wrap);
        const norm = (t) => String(t || "").replace(/[\u0591-\u05C7]/g, "").replace(/[׳״'"`]/g, "").replace(/[.,:;()\-–—]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
        // 1.0.1-L (last check): the marks are dropped, not spaced ("רדק" finds רד״ק, "מלבים" מלבי״ם). Each word of the query is looked for: "מנורה" finds מנורת and המנורות,
        // "שלחן" שולחן (without ו and י, and without a word's ending, when 3 letters are left); a word of one or two letters is a whole word with its prefixes: "ים" finds הים and והים, not every plural
        const loose = (s) => s.replace(/[וי]/g, "");
        const wordHit = (txt, w) => {
          if (w.length <= 2) return (" " + txt + " ").search(new RegExp(" [והבלמשכ]{0,2}" + w.replace(/[^\p{L}\p{N}]/gu, "") + " ", "u")) >= 0;
          const l = loose(w);
          if (l.length < 3) return txt.includes(w);
          const st = l.replace(/[התםן]$/, "");
          return loose(txt).includes(st.length >= 3 ? st : l);
        };
        const textHit = (t, q) => { const n = norm(t); return q.split(" ").every((w) => wordHit(n, w)); };
        const hit = (el, q) => textHit(el.textContent, q) || textHit(el.title, q);
        // the buttons and the switches' rows; an opinion row's caption finds all its options
        const ITEMS = "button, label";
        // OPS_GROUPS_303: the name of a group of the opinions table finds all its rows
        const itemHit = (b, q) => { const op = b.closest(".tm-op"), cap = op && op.querySelector(".cap"), g = op && op.closest("details.tm-opg"), gs = g && g.querySelector("summary"); return hit(b, q) || (!!cap && hit(cap, q)) || (!!gs && hit(gs, q)); };
        let savedTop = 0;
        let saved = null;  // the state before the search: the blocks' display and the groups' open
        const run = () => {
          const q = norm(input.value);
          const kids = Array.from(panel.children).filter((c) => c !== wrap);
          if (!q) {
            if (saved) {
              for (const [el, st] of saved) {
                el.style.display = st.display;
                if (st.open !== undefined) el.open = st.open;
              }
              saved = null;
            }
            for (const b of panel.querySelectorAll(ITEMS)) b.style.display = b.dataset.tmHid ? b.dataset.tmHid === "x" ? "" : b.dataset.tmHid : b.style.display, delete b.dataset.tmHid;
            none.style.display = "none";
            panel.scrollTop = savedTop;
            return;
          }
          if (!saved) {
            savedTop = panel.scrollTop;
            saved = new Map();
            for (const el of Array.from(panel.querySelectorAll("*"))) if (el.tagName === "DETAILS" || el.parentNode === panel) saved.set(el, { display: el.style.display, open: el.tagName === "DETAILS" ? el.open : undefined });
            saved.delete(wrap);
          }
          let total = 0;
          for (const b of panel.querySelectorAll(ITEMS)) {
            if (b.dataset.tmHid === undefined) b.dataset.tmHid = b.style.display || "x";
            const ok = itemHit(b, q);
            b.style.display = ok ? b.dataset.tmHid === "x" ? "" : b.dataset.tmHid : "none";
            if (ok) total++;
          }
          for (const el of kids) {
            const has = (el.tagName === "LABEL" && el.style.display !== "none") || (!!el.querySelector && Array.from(el.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none"));
            el.style.display = has ? (saved.get(el) ? saved.get(el).display : "") : "none";
            if (el.tagName === "DETAILS" && has) el.open = true;
          if (has && el.tagName !== "DETAILS" && el.tagName !== "LABEL") {
            for (const c of Array.from(el.children)) {
              if (!saved.has(c)) saved.set(c, { display: c.style.display });
              if (c.tagName === "BUTTON" || c.tagName === "LABEL") continue;
              const show = Array.from(c.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none");
              c.style.display = show ? saved.get(c).display : "none";
            }
          }
          }
          // OPS_GROUPS_303: a group inside a group (the groups of the opinions table) opens when it holds a match and steps aside
          // when it holds none; a row of the table without a match steps aside too (its caption alone was left). saved: back
          for (const d of panel.querySelectorAll("details details")) {
            if (!saved.has(d)) saved.set(d, { display: d.style.display, open: d.open });
            const has = Array.from(d.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none");
            d.style.display = has ? saved.get(d).display : "none";
            if (has) d.open = true;
          }
          for (const r of panel.querySelectorAll("#tm-ops .tm-op")) {
            if (!saved.has(r)) saved.set(r, { display: r.style.display });
            r.style.display = Array.from(r.querySelectorAll(ITEMS)).some((b) => b.style.display !== "none") ? saved.get(r).display : "none";
          }
          none.style.display = total ? "none" : "block";
        };
        input.addEventListener("input", run);
        // typing in the field never moves the camera or presses the model's keys; Esc clears it
        input.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc") {
            input.value = "";
            run();
          }
        });
        input.addEventListener("keyup", (e) => e.stopPropagation());
      }
      panel.appendChild(secViews);
      const grid = document.createElement("div");
      grid.id = "tm-views";
      panel.appendChild(grid);
      // 1.1.0: after the merges (UI_VIEW_HOME) the grid keeps "מבט כללי" alone - no "מבטים" header, one wide button
      setTimeout(() => {
        if (grid.children.length <= 1) {
          secViews.style.display = "none";
          grid.classList.add("one");
        }
      }, 0);

      // ===== Holy of Holies: cloud + confirmation before it is revealed =====
      const KKF = LVL.HEI;
      const dc = ctx.shared.devirCenter;
      const KKC = dc && typeof dc.x === "number" ? { x: dc.x, y: dc.y, z: dc.z } : { x: -54, y: 22, z: 0 }; // SPEC 7: devir centre
      const cloud = new Group();
      cloud.name = "tm-kk-cloud";
      uiGroup.add(cloud);
      const cloudMat = new MeshLambertMaterial({ color: 15856631, emissive: 5593704, transparent: true, opacity: 0.96 });
      const IcoGeo = (ctx.THREE && ctx.THREE.IcosahedronGeometry) || (typeof IcosahedronGeometry !== "undefined" ? IcosahedronGeometry : null);
      const cloudGeo = IcoGeo ? new IcoGeo(1, 3) : new SphereGeometry(1, 10, 8);
      {
        let seed = 7;
        const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
        // the devir is 20 x 20 x 20 (I Kings 6:20), built 19 clear because the amah traksin is taken from it (user's decision, 10-core.js
        // CO.xDevirE / xDevirW): interior x -63.5..-44.5, z +-10, y 12..32, and its aliyah above (y 33..42).
        // The WHOLE cloud (puff centre + scaled radius + the 0.7 / 0.5 sway of the animation below) stays inside x/z +-9 around
        // the centre and y 13..31.5 (1.2.2; was 41), so no puff pokes through the traksin into the kodesh, through the side walls or through the
        // west wall into the ta'im. Smaller puffs than 1.0.19, hence more of them (shared geometry: still cheap).
        // 1.2.2 (the scan): the puffs stay under the devir's own ceiling (F + 20, 50-heichal.js sec. 8) - they rose to 41, into the gold room
        // above the devir, which has its own button now
        const HALF = 9, Y0 = KKF + 1, Y1 = KKF + 19.5, SWAY = 0.7, SWAY_Y = 0.5;
        for (let i = 0; i < 72; i++) {
          const pf = new Mesh(cloudGeo, cloudMat);
          const r = 3 + rnd() * 2;                              // scaled radius 3.45..5.75 in x/z, 2.7..4.5 in y
          pf.scale.set(r * 1.15, r * 0.9, r * 1.15);
          const sp = Math.max(0, HALF - r * 1.15 - SWAY);       // allowed centre spread in x/z for this puff
          const hy = r * 0.9 + SWAY_Y;                          // vertical half-extent incl. the sway
          pf.position.set(
            KKC.x + (rnd() - 0.5) * 2 * sp,
            Y0 + hy + rnd() * Math.max(0, Y1 - Y0 - 2 * hy),
            KKC.z + (rnd() - 0.5) * 2 * sp
          );
          pf.userData.noPick = true;
          pf.userData.base = pf.position.clone();
          pf.userData.ph = rnd() * 6.28;
          cloud.add(pf);
        }
      }
      let cloudOn = true, cloudTarget = 0.96, cloudSeenNear = false;
      const setCloud = (on) => {
        cloudOn = on;
        cloudTarget = on ? 0.96 : 0;
        if (on) cloud.visible = true;
        else cloudSeenNear = false;
      };
      // A camera position/target inside this box counts as "inside the devir" (1.0.19 logic: fly() tests pos and target).
      // SPEC 9.7 gives x -66..-42, z +-12, y 14..44 - but -42 lies 1.5 amot EAST of the traksin's kodesh face (x -43.5), so every
      // kodesh-side spot in front of the traksin (the chains, the traksin, the parochet, the devir door) would pop the
      // Holy-of-Holies confirmation and not fly on "ביטול". The east bound is therefore the devir's east face, CO.xDevirE
      // (-44.5 = the traksin's devir side): only a camera/target really inside the devir (or its aliyah) asks. Rest as in the SPEC.
      const KK_E = CO && typeof CO.xDevirE === "number" ? CO.xDevirE : -44.5;
      const inKK = (p) => p && p[0] > -66 && p[0] < KK_E && p[2] > -12 && p[2] < 12 && p[1] > 14 && p[1] < 44;
      const cf = document.createElement("div");
      cf.id = "tm-confirm";
      cf.innerHTML = '<div class="box"><div class="t">קודש הקדשים</div><div class="m">קודש הקדשים מכוסה בענן מפני כבוד המקום. להסיר את הענן ולהציג את פנים החדר?</div><div class="b"><button class="y">הסר את הענן</button><button class="n">ביטול</button></div></div>';
      document.body.appendChild(cf);
      let cfYes = null, cfNo = null;
      const closeConfirm = () => {
        cf.style.display = "none";
        cfYes = cfNo = null;
        // 1.0.1-K: the focus given to the dialog's button goes back to the page (else the arrow keys stay blocked on a hidden button)
        try {
          const ae = document.activeElement;
          if (ae && cf.contains && cf.contains(ae) && typeof ae.blur === "function") ae.blur();
        } catch (_) {
        }
      };
      cf.querySelector(".y").addEventListener("click", () => {
        const f = cfYes;
        closeConfirm();
        if (f) f();
      });
      cf.querySelector(".n").addEventListener("click", () => {
        const f = cfNo;
        closeConfirm();
        if (f) f();
      });
      const askRemoveCloud = (onYes, onNo) => {
        cfYes = onYes;
        cfNo = onNo || null;
        cf.style.display = "flex";
        // 1.0.1-K (the presentation's request, review UX1): Enter answers the dialog itself ("הסר את הענן")
        try {
          cf.querySelector(".y").focus();
        } catch (_) {
        }
      };
      // 1.0.1-K: the dialog answered from outside (the presentation): "ביטול" runs the pending "no", closeConfirm drops both
      const cancelConfirm = () => {
        if (cf.style.display !== "flex") return;
        const f = cfNo;
        closeConfirm();
        if (f) f();
      };
      // 1.0.1-K: the cloud's pill is an entry of the on-model buttons' registry (see "on-model buttons" below); this block decides when
      // it is seen (cloudSeen.show) and its size (cloudSeen.scale): when the cloud (or, while it is off, its place) is seen at a
      // reasonable size and nothing solid hides it (1.0.17 / 1.0.19 logic); while it is off the pill offers "☁ החזר את הענן" (the cloud
      // also comes back by itself once the camera has been near it and goes more than 75 amot away, as before)
      const cloudSeen = { show: false, scale: 1 };
      {
        const cv = new Vector3();
        // 1.0.19: the "remove cloud" button must appear only while the cloud is really seen: besides its size on screen we
        // cast a ray from the camera to the cloud centre and hide the button when a visible, not-faded solid is in the way
        // (e.g. standing in the court: the house walls hide the cloud). Throttled; targets are cached for a few seconds.
        const cRay = new Raycaster(), cDir = new Vector3();
        let cTargets = null, cTargetsAt = 0, cFrame = 0, cClear = true;
        const underCloud = (o) => {
          for (; o; o = o.parent) if (o === cloud || o.name === "tm-measure") return true;
          return false;
        };
        const isVis = (o) => {
          for (; o; o = o.parent) if (o.visible === false) return false;
          return true;
        };
        const solidEnough = (o) => {
          const m = Array.isArray(o.material) ? o.material[0] : o.material;
          return !m || m.visible === false || (m.transparent ? m.opacity > 0.5 : true);
        };
        const cloudClear = (cam, d) => {
          const now = performance.now();
          if (!cTargets || now - cTargetsAt > 4000) {
            cTargets = [];
            cTargetsAt = now;
            // 1.0.1-H (performance, the user: "נתקע"): only plain meshes of some size can hide the cloud - the walls, ceilings, roofs and
            // the court walls; instanced meshes (knobs, chains, reliefs, pillars: a raycast tests every instance) and small parts are skipped
            const bb = new Box3(), sz = new Vector3();
            ctx.scene.traverse((o) => {
              if (!o.isMesh || o.isInstancedMesh || !o.geometry || underCloud(o)) return;
              const pa = o.geometry.attributes && o.geometry.attributes.position;
              if (pa && pa.count > 30000) return; // skip the terrain: it never hides the cloud
              if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
              bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
              if (Math.max(sz.x, sz.y, sz.z) < 6) return;   // a part smaller than 6 amot in every direction never hides the 30-amah cloud
              cTargets.push(o);
            });
          }
          cDir.set(KKC.x - cam.x, KKC.y - cam.y, KKC.z - cam.z).normalize();
          cRay.set(cam, cDir);
          cRay.near = 0;
          cRay.far = Math.max(1, d - 3);
          for (const h of ctx.raycast(cRay, cTargets)) {
            if (isVis(h.object) && solidEnough(h.object)) return false;
          }
          return true;
        };
        const kkP = [0, 0, 0];   // 1.0.4: the orbit into the cloud (below)
        let kkAsked = false, kkRel = 0;
        ctx.renderer.domElement.addEventListener("pointerdown", () => { kkRel = Infinity; });
        window.addEventListener("pointerup", () => { if (kkRel === Infinity) kkRel = performance.now(); }, true);
        window.addEventListener("pointercancel", () => { if (kkRel === Infinity) kkRel = performance.now(); }, true);
        ctx.animated.push(function(t) {
          const cam = ctx.camera.position;
          const dist = Math.hypot(cam.x - KKC.x, cam.y - KKC.y, cam.z - KKC.z);
          const k = 0.0004 * t;
          cloud.children.forEach((pf) => {
            const b = pf.userData.base, ph = pf.userData.ph;
            pf.position.set(b.x + Math.sin(k + ph) * 0.7, b.y + Math.cos(k * 0.8 + ph) * 0.5, b.z + Math.sin(k * 0.6 + ph * 1.3) * 0.7);
          });
          if (Math.abs(cloudMat.opacity - cloudTarget) > 4e-3) cloudMat.opacity += (cloudTarget - cloudMat.opacity) * 0.08;
          if (!cloudOn && cloudMat.opacity < 0.03) cloud.visible = false;
          if (!cloudOn) {
            if (dist < 50) cloudSeenNear = true;
            else if (cloudSeenNear && dist > 75) setCloud(true);
          }
          // 1.0.4: the orbit round a thing one flew to (ctx.camPass, 90-entry.js; Moses' menorah stands 1.5 amot before the devir) takes the camera through the
          // devir's wall into the cloud: once the drag is let go (kkRel, 400 ms), the question a flight into the devir asks (askRemoveCloud) - once each time the
          // camera goes in; "ביטול" leaves the cloud, and the camera where it is
          kkP[0] = cam.x;
          kkP[1] = cam.y;
          kkP[2] = cam.z;
          if (!inKK(kkP)) kkAsked = false;
          else if (cloudOn && !kkAsked && cf.style.display !== "flex" && performance.now() - kkRel > 400 && typeof ctx.camPass === "function" && ctx.camPass()) {
            kkAsked = true;
            askRemoveCloud(() => setCloud(false));
          }
          let show = false;
          // 1.0.17: the button appears only while the cloud is actually seen at a reasonable size on screen,
          // and its size is proportional to the cloud's apparent size (clamped).
          // 1.0.1-K: with the cloud off, the pill (then "החזר את הענן") appears where the cloud's would: the devir seen at a reasonable size
          const seenOn = cloudOn && cloud.visible && cloudMat.opacity > 0.3;
          if (seenOn || !cloudOn) {
            cv.set(KKC.x, KKC.y, KKC.z).project(ctx.camera);
            const fovT = Math.tan((ctx.camera.fov || 50) * Math.PI / 360);
            const cloudPx = 30 / (2 * Math.max(1, dist) * fovT) * window.innerHeight; // the cloud is ~30 amot tall
            const onScreen = cv.z < 1 && Math.abs(cv.x) < 0.95 && Math.abs(cv.y) < 0.95 && cloudPx >= 90;
            if (onScreen) {
              if ((cFrame++ & 31) === 0) {   // 1.0.1-H: every 32nd frame (was 8): the ray test is the one periodic cost while the cloud is seen
                try {
                  cClear = cloudClear(cam, dist);
                } catch (_) {
                  cClear = false;
                }
              }
            } else {
              cClear = false;
            }
            if (cClear && onScreen) {
              cloudSeen.scale = Math.min(1.6, Math.max(0.7, cloudPx / 300));
              show = true;
            }
          }
          cloudSeen.show = show;
        });
      }

      // ===== measuring tool: click two points on the model (1.0.17: red line with white outline) =====
      const mGroup = new Group();
      mGroup.name = "tm-measure";
      ctx.scene.add(mGroup);
      const mOut = document.createElement("div");
      mOut.id = "tm-measure-out";
      document.body.appendChild(mOut);
      let mOn = false, mPts = [];
      const mRay = new Raycaster(), mNdc = new Vector2();
      const mClear = () => {
        while (mGroup.children.length) {
          const c = mGroup.children.pop();
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        }
        mPts = [];
      };
      const mSay = (txt) => {
        mOut.textContent = txt;
        mOut.style.display = txt ? "block" : "none";
      };
      const mAccept = (h) => {
        const o = h.object;
        if (o.isSprite || o.isLine || o.isPoints || o.userData.noPick) return false;
        let vis = true;
        for (let p = o; p; p = p.parent) if (!p.visible) {
          vis = false;
          break;
        }
        if (!vis) return false;
        const mt0 = o.material, mt = Array.isArray(mt0) ? mt0[(h.face && h.face.materialIndex) || 0] : mt0;
        if (mt && (mt.opacity < 0.5 || mt.visible === false)) return false;
        if (mt && Array.isArray(mt.clippingPlanes) && mt.clippingPlanes.some((pl) => pl && pl.distanceToPoint(h.point) < -1e-4)) return false;
        return true;
      };
      const mPick = (ev) => {
        const el = ctx.renderer.domElement, r = el.getBoundingClientRect();
        mNdc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
        mRay.setFromCamera(mNdc, ctx.camera);
        // MEASURE_300 (the user, 18.11.2026: "לפעמים אני שם נקודה על נקודה, והוא לא באמת מציג את הנקודה"): a point is put only on what
        // is drawn - not on a surface nearer than the camera's near plane (it is not drawn), not on a face that a clipping plane cuts
        // away (the live section: its meshes stay whole, only their drawing is cut), and for a mesh of several materials, by the
        // material of the face that was hit
        mRay.near = ctx.camera.near || 0;
        mRay.far = Infinity;
        const h = ctx.raycast.firstVisible(mRay, ctx.root, mAccept);
        return h ? h.point.clone() : null;
      };
      const M_RED = 0xe53935, M_WHITE = 0xffffff, M_Y = new Vector3(0, 1, 0);
      const mPiece = (geo, color, order, kind, f) => {
        const m = new Mesh(geo, new MeshBasicMaterial({ color, depthTest: false, transparent: true }));
        m.renderOrder = order;
        m.userData.noPick = true;
        m.userData.mk = { kind, f };
        mGroup.add(m);
        return m;
      };
      const mMark = (p) => {
        mPiece(new SphereGeometry(1, 16, 12), M_WHITE, 998, "dot", 0.0085).position.copy(p);
        mPiece(new SphereGeometry(1, 16, 12), M_RED, 999, "dot", 0.006).position.copy(p);
      };
      const mLine = (a, b) => {
        const len = a.distanceTo(b);
        if (len < 1e-6) return;
        const dirv = new Vector3().subVectors(b, a).normalize();
        for (const [col, ord, f] of [[M_WHITE, 996, 0.0045], [M_RED, 997, 0.0028]]) {
          const c = mPiece(new CylinderGeometry(1, 1, 1, 12, 1, true), col, ord, "line", f);
          c.position.copy(a).add(b).multiplyScalar(0.5);
          c.quaternion.setFromUnitVectors(M_Y, dirv);
          c.userData.mk.len = len;
        }
      };
      ctx.animated.push(function() {
        const cp = ctx.camera.position;
        for (const m of mGroup.children) {
          const mk = m.userData.mk;
          if (!mk) continue;
          const r = Math.max(0.02, cp.distanceTo(m.position) * mk.f);
          if (mk.kind === "dot") m.scale.set(r, r, r);
          else m.scale.set(r, mk.len, r);
        }
      });
      const mHint = "מדידה: לחץ על שתי נקודות במודל";
      const mSet = (on) => {
        mOn = on;
        document.body.classList.toggle("tm-measuring", on);
        ctx.renderer.domElement.style.cursor = "";   // 1.0.1-K (review UI-H2-6): a label's hand must not hide the crosshair
        mClear();
        mSay(on ? mHint : "");
        const b = document.getElementById("tm-nav-ruler");
        if (b) b.classList.toggle("on", on);
      };
      {
        const el = ctx.renderer.domElement;
        let down = null;
        el.addEventListener("pointerdown", (e) => {
          down = { x: e.clientX, y: e.clientY, t: performance.now() };
        });
        el.addEventListener("pointerup", (e) => {
          if (e.__tmSynthetic) {   // 1.0.1-H: the release synthesized by 90-entry.js's pointer safety is not a click
            down = null;
            return;
          }
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
            mSay("נקודה ראשונה סומנה — לחץ על נקודה שנייה");
          } else {
            const a = mPts[0], b = mPts[1];
            mLine(a, b);
            const dist = a.distanceTo(b), dh = Math.hypot(b.x - a.x, b.z - a.z), dy = Math.abs(b.y - a.y);
            mSay("מרחק: " + dist.toFixed(2) + " אמות  ·  אופקי " + dh.toFixed(2) + "  ·  גובה " + dy.toFixed(2) + "  (לחיצה נוספת — מדידה חדשה)");
          }
        });
      }
      // ===== flying =====
      const realFly = typeof ctx.flyTo === "function" ? ctx.flyTo : function() {
      };
      const fly = function(pos, tgt, dur) {
        //@@slot fly
        if (cloudOn && (inKK(pos) || inKK(tgt))) {
          askRemoveCloud(() => {
            setCloud(false);
            realFly(pos, tgt, dur);
          });
          return;
        }
        realFly(pos, tgt, dur);
      };
      const fps = ctx.shared && ctx.shared.flyPoints ? ctx.shared.flyPoints : {};
      // The fly point of a key: the module's registration, or (for the Sea) the current placement, or the SPEC fallback.
      const resolveFp = (key) => {
        if (key === "__general") return ui_GENERAL;
        if (key === "yam" || key === "yamOxen") {   // 1.0.1-K: the oxen's view follows the placement too (45-vessels.js oxenFlyPoint)
          const sp = ctx.shared.seaPlacement;
          const fn = sp && (key === "yam" ? sp.flyPoint : sp.oxenFlyPoint);
          if (typeof fn === "function") {
            try {
              const f = fn.call(sp);
              if (f && Array.isArray(f.pos) && Array.isArray(f.target)) return f;
            } catch (_) {
            }
          }
          if (key === "yamOxen") {
            const fo = fps.yamOxen;
            return fo && Array.isArray(fo.pos) && Array.isArray(fo.target) ? fo : null;
          }
          const f0 = fps.yam;
          if (f0 && Array.isArray(f0.pos) && Array.isArray(f0.target)) return f0;
          // 1.0.1-L (L.7): the fallback as 45-vessels.js's flyPoint: from the court's side of the corner (x + 40 would stand outside the east wall)
          const z = sp && sp.current === "radak" ? CO.seaZ : CO.seaZRashi, s = z < 0 ? 1 : -1;
          return { pos: [CO.seaX - 18, LVL.AZ + 30, z + s * 20], target: [CO.seaX - 1, LVL.AZ + 3, z + s] };
        }
        const f = fps[key];
        if (f && Array.isArray(f.pos) && Array.isArray(f.target)) return f;
        return ui_FP[key] || null;
      };
      // 1.0.1-K (the user: "כפתור להסרה ולא הסרה אוט'"; "כברירת מחדל ההיכל צריך להיות סגור מכל צדדיו ורק עם כפתור להסרה"): navigation
      // never opens anything. 1.0.1 opened the cutaway / the chambers / the ulam / the boards automatically for the views and places that
      // carried interior / yatzia / ulam / boards / in; those flags stay in ui_VIEWS and PLACES as data only, the interior views look
      // from cameras inside the closed house (55-interior.js), and the removals are the on-model pills. applyCut / applyOpen stay in
      // ctx.ui as no-ops for older callers.
      const applyCut = function() {};
      const applyOpen = function() {};
      // the removals by id (the pills, "↺ החזר הכל" and ctx.ui.removals use these)
      const REMOVALS = {
        house: { list: () => ctx.cutaway, isOn: () => cutOn, set: (on) => setCutaway(on) },
        yatzia: { list: () => ctx.yatziaCut, isOn: () => yatziaOpen, set: (on) => setYatziaCut(on) },
        ulam: { list: () => ctx.ulamCut, isOn: () => ulamOpen, set: (on) => setUlamCut(on) },
        boards: { list: () => ctx.forestBoardsCut, isOn: () => boardsOff, set: (on) => setBoardsOff(on) }
      };
      // ===== opinion switches shared by the places and the toggles =====
      let seaRow = null, layoutRow = null, opinionRow = null, ulamTablesRow = null, throneRow = null;
      const pickSea = (key) => {
        const sp = ctx.shared.seaPlacement;
        if (sp && typeof sp.set === "function") {
          try {
            sp.set(key);
          } catch (_) {
          }
        }
        if (seaRow) seaRow.mark(key);
      };
      const pickLayout = (key) => {
        const kl = ctx.shared.kodeshLayout;
        if (kl && typeof kl.set === "function") {
          try {
            kl.set(key);
          } catch (_) {
          }
        }
        if (layoutRow) layoutRow.mark(key);
      };
      const pickOpinion = (key) => {
        const ko = ctx.shared.kodeshOpinion;
        if (ko && typeof ko.set === "function") {
          try {
            ko.set(key);
          } catch (_) {
          }
        }
        if (opinionRow) opinionRow.mark(key);
      };
      // the ark line (even shetiya, ark, great cherubim) in the WEST part of the devir: x -58.5 (Rambam Beit HaBechira 4:1 "במערבו"; SPEC 7),
      // read from 55-interior.js (ctx.shared.arkX) so the place targets follow the model
      const arkX = () => (ctx.shared && typeof ctx.shared.arkX === "number" ? ctx.shared.arkX : -58.5);
      // model numbers for the place targets and the EXTRAS texts, read from the model instead of retyped literals: the laver / bases
      // row and the Sea from ctx.CO (10-core.js, SPEC 2), Yachin and Boaz from 50-heichal.js (ctx.shared.heichal.pillars)
      // 1.0.1-L (L.77): the block of bases from the model (45-vessels.js ctx.shared.mechona.block: its columns, its rows, Moses' laver), else from CO
      const blk = (ctx.shared.mechona && ctx.shared.mechona.block) || null;
      const blkLaver = blk && Array.isArray(blk.laver) ? blk.laver : null;
      const rowX = blkLaver ? blkLaver[0] : typeof CO.kiyorX === "number" ? CO.kiyorX : 30;   // Moses' laver, between the two rows of bases
      const kz = blkLaver ? blkLaver[1] : Array.isArray(CO.mechZ) && CO.mechZ.length ? CO.mechZ.reduce((s, v) => s + v, 0) / CO.mechZ.length : 39;
      const blkRows = blk && Array.isArray(blk.rows) && blk.rows.length > 1 ? blk.rows : Array.isArray(CO.mechZ) && CO.mechZ.length > 1 ? CO.mechZ : [33, 45];
      const blkCols = blk && Array.isArray(blk.cols) && blk.cols.length > 1 ? blk.cols : [21, 25.5, 30, 34.5, 39];
      const ulamE = typeof CO.xUlamE === "number" ? CO.xUlamE : 18.5;     // the outer face of the ulam's front wall
      const seaXm = typeof CO.seaX === "number" ? CO.seaX : 80;           // the Sea's axis, in the court's corner (L.7)
      const courtE = ctx.shared.innerCourt && typeof ctx.shared.innerCourt.x1 === "number" ? ctx.shared.innerCourt.x1 : 91;   // the inner face of the court's east wall
      const houseE = typeof CO.xHouseE === "number" ? CO.xHouseE : 2.5;   // east face of the house wall = the hall's west wall
      const pil = (ctx.shared.heichal && ctx.shared.heichal.pillars) || { x: 6.08, z: 7.17 }; // Yachin / Boaz centres (1.0.1-L, L.6: x 6.08, z +-7.17 - the capital 0.02 from the doorposts and the side walls)
      const ulamDoor = (ctx.shared.heichal && ctx.shared.heichal.ulamDoor) || { w: 10, h: 22, x: [12.5, 18.5], y: [12, 34] };   // 1.0.1-L (L.59; heichal-door.md)
      // ===== views grid =====
      const btns = [];
      const placeBtns = [];
      const viewBtnByKey = {};   // 1.0.1-H: for the presentation (ctx.ui.viewButton)
      const placeBtnByT = {}, placeItemByT = {};   // 1.0.1-J: places by title (ctx.ui.placeButton / ctx.ui.place)
      for (const v of ui_VIEWS) {
        if (!resolveFp(v.key)) continue;
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = v.label;
        viewBtnByKey[v.key] = b;
        b.addEventListener("click", () => {
          try {
            if (v.layer) setLayer(v.layer, true);
            // VIEW_LEAVE_211 (the function review, F1-04 / F2-02): a view button did not put back what the place before it had switched on by
            // itself - the tower of "העליות", the officers, the golden stands stayed over "מבט כללי" for good. It does now what a place's
            // click and a chip do (CHIP_CLOSEAUTO_211).
            try { autoOff.flush(); } catch (_) {}
            try { if (typeof ctx.shared.closeAuto === "function") ctx.shared.closeAuto(); } catch (_) {}
            try { placeLeave({}); } catch (_) {}
            uiPlaceCtx = null;   // PILL_SCOPE_N8
            try { if (typeof ctx.camReset === "function") ctx.camReset(); } catch (_) {}   // CAM_RESET_N8
            // 1.0.1-K: no automatic removal (v.interior / v.yatzia / v.ulam are data only)
            const fp = resolveFp(v.key);
            if (fp) fly(fp.pos, fp.target);
          } catch (_) {
          }
          setInfo(v.key, null, { title: v.label, anchor: b });   // 1.0.1-L (L.34): in the floating card
          hidePanelOnPhone();
          for (const o of btns) o.classList.remove("on");
          for (const o of placeBtns) o.classList.remove("on");
          b.classList.add("on");
          closeCard();   // 1.0.1-K: a new view closes the label's card (defined with the labels below; the click comes after buildUI)
        });
        grid.appendChild(b);
        btns.push(b);
      }
      if (btns.length) btns[0].classList.add("on");
      // ===== places accordion (SPEC 9.5): item = {t, tg, cam, info, refs, layer?, action?, view?, key?} =====
      // tg / cam may be functions (resolved at click time); view = a fly point key (resolveFp); action = a model feature switched on
      // with the place (1.0.1-K: the yatzia section, the wall / altar layers, the base's demo and its exploded view - FEATURES the user
      // asks to see, never one of the four removals; each has its own "off" on the model and in "↺ החזר הכל"). The 1.0.1 flags in /
      // yatzia / ulam / boards are gone: navigation never opens anything (1.0.1-K).
      const V = ui_V, P = ui_P, MI = ui_MI, RB = ui_RB, MN = ui_MN;
      // 1.0.1-L (Part 7, U4, the user: "כפתור מקום הים אמור להראות ממבט מלמעלה את המיקום ולא מקרוב"): from above, the court's corner in the frame; follows the reading.
      // Model choice: the Sea's side comes from its own fly point's target. The panel's width is why the target stands east of the Sea's middle.
      const uiSeaSide = () => {
        const sp = ctx.shared.seaPlacement;
        try { const f = sp && sp.flyPoint && sp.flyPoint(); if (f && f.target) return f.target[2] < 0 ? -1 : 1; } catch (_) {}
        return -1;
      };
      const uiSeaCam = () => { const k = uiSeaSide(); return [66, 118, k * 22]; };
      const uiSeaTg = () => { const k = uiSeaSide(); return [72, 6, k * 48]; };
      // 1.0.1-L (L.85; part5-house.md FOR-UI 2, 3)
      const UI_ARK_REFS = [["מלכים א ח, ט", V(10, 8, 9)], ["רד״ק שם", { book: 3540, index: 544 }], ["רלב״ג שם", { book: 3645, index: 335 }], ["מלבי״ם שם", { book: 3394, index: 445 }], ["בבא בתרא יד.", { book: 124, index: 369 }], ["בבא בתרא יד:", { book: 124, index: 381 }], ["מנחות צט.", { book: 131, index: 3535 }], ["רש״י בבא בתרא יד:", { book: 2178, index: 585 }], ["יומא נב:", { book: 107, index: 1344 }], ["שמואל א ו, ח", { book: 8, index: 133 }], ["שמות טז, לג", V(2, 16, 33)], ["במדבר יז, כג", V(4, 17, 23)]];
      const PN = (ctx.shared && ctx.shared.palaceNotes) || {};          // 60-palace.js's Hebrew notes (K.6), with their sources
      // 1.0.1-L (L.57, L.81; palace-2.md): the sources of the throne and of its versions - the verses, the commentators and the midrashim (book : line in the DB)
      const TH_V = [["מלכים א י, יח", V(10, 10, 18)], ["י, יט", V(10, 10, 19)], ["י, כ", V(10, 10, 20)], ["דברי הימים ב ט, יז", V(39, 9, 17)], ["ט, יח", V(39, 9, 18)], ["ט, יט", V(39, 9, 19)]];
      const TH_REFS = {
        pesukim: TH_V.concat([["רש״י י, יט", { book: 3673, index: 610 }], ["רד״ק י, יט", { book: 3540, index: 683 }], ["מצודת דוד י, יט", { book: 3345, index: 939 }], ["רלב״ג י, יט", { book: 3645, index: 462 }], ["מלבי״ם י, יט", { book: 3394, index: 624 }], ["תרגום יונתן י, יט", { book: 3206, index: 391 }], ["אברבנאל י, יח–כ", { book: 3574, index: 563 }], ["רש״י דברי הימים ב ט, יט", { book: 3662, index: 354 }], ["מצודת דוד דברי הימים ב ט, יח", { book: 3318, index: 493 }]]),
        targumSheni: [["תרגום שני לאסתר א, ב", { book: 3237, index: 13 }], ["מלכים א י, יט", V(10, 10, 19)], ["רש״י דברי הימים ב ט, יט", { book: 3662, index: 354 }]],
        estherRabbah: [["מהרז״ו על אסתר רבה", { book: 3117, index: 76 }], ["מתנות כהונה", { book: 3099, index: 151 }], ["יפה ענף", { book: 3079, index: 120 }], ["עץ יוסף", { book: 3086, index: 290 }], ["אסתר רבה א, יב", { book: 264, index: 25 }], ["פנים אחרים נוסח ב", { book: 274, index: 116 }], ["מדרש אבא גוריון א", { book: 274, index: 6 }], ["במדבר רבה יב, יז", { book: 259, index: 222 }], ["פסיקתא דרב כהנא א, ז", { book: 277, index: 8 }], ["מלכים א י, יט", V(10, 10, 19)]],
        beitHamidrash: [["בית המדרש ב (דמות כסא שלמה)", { book: 7924, index: 8 }], ["ענין כסא שלמה", { book: 7958, index: 4 }], ["מלכים א י, יט", V(10, 10, 19)]]
      };
      const nf = (v) => String(+(+v).toFixed(2));                        // a model number for a text (no float tails)
      const fhCur = () => (ctx.shared.forestHouse && ctx.shared.forestHouse.current) || "rashi";
      const mech = () => (ctx.shared && ctx.shared.mechona) || null;
      // the features of the build tracks (FIXES-1.0.1-K.md 0.5f), each guarded: a missing one only skips its switch
      const feat = {
        section: () => { const s = ctx.shared.yatziaSection; if (s && typeof s.set === "function") s.set(true); },
        wallLayers: () => { const w = ctx.shared.wallLayers; if (w && typeof w.set === "function") w.set(true); },
        altarLayers: () => { const a = ctx.shared.incenseAltar; if (a && a.layers && typeof a.layers.set === "function") a.layers.set(true); },
        // 1.0.1-K review (vessels-3): the base back in its place at once when the demonstration is running (or still driving home; 1.0.1-L: the pills on the base start it):
        // "המכונות מקרוב" frames its home spot (flyPoints.mechonaClose), and after the demonstration the
        // base kept looping round the court, mostly out of the view (headless: 8 amot from home 1 s after the click)
        park: () => { const m = mech(); if (m && m.demo && typeof m.demo.reset === "function" && !m.demo.home) m.demo.reset(); },
      };
      // the parts' labels (layer mechonaParts) belong to the exploded view: they go off when the explode goes OFF, whoever switched it off
      // ("הרכב בחזרה", "↺ החזר הכל", the presentation). 1.0.1-K review (vessels-6): the hook only ever HIDES them, at that moment - they are
      // switched on by the pill itself (45-vessels.js, through ctx.ui.setLayer; 1.0.1-L, L.51: the place "המכונה בפירוק" is gone), so it never fights the pill
      // or a slide that shows them (1.0.1-K hid them only after the place had shown them). No allocation per frame.
      let explodeWas = false;
      ctx.animated.push(function() {
        const m = mech();
        const on = !!(m && m.explode && m.explode.on);
        if (on === explodeWas) return;
        explodeWas = on;
        if (!on && ctx.layers.mechonaParts && ctx.layers.mechonaParts.visible) setLayer("mechonaParts", false);
      });
      //@@slot altarShift
        ];
      }
      const PLACES = [
        //@@slot buildUI.after-PLACES
      {
        const byT = {};
        for (const g of PLACES) for (const it of g[1]) if (!byT[it.t]) byT[it.t] = it;
        // the titles of 60-palace.js / 57-kelim.js may change: a merge whose title is not there is skipped (the button stays), and the check reports it
        for (const dt of Object.keys(UI_MERGE)) {
          const d = byT[dt], k = byT[UI_MERGE[dt]];
          if (!d || !k || d === k) { console.warn("[ui.js] merge skipped: " + dt); continue; }
          d.noButton = true;
          d.mergeInto = k;
          (k.more = k.more || []).push(d);
        }
        for (const key of Object.keys(UI_VIEW_HOME)) {
          const b = viewBtnByKey[key], k = byT[UI_VIEW_HOME[key]];
          if (!b || !k) continue;
          grid.removeChild(b);
          if (k.key !== key && k.view !== key) (k.more = k.more || []).push({ t: "", key });
          else if (k.key !== key && ui_INFO[key] && !k.key && String(k.info || "").indexOf(String(ui_INFO[key]).slice(0, 40)) < 0) (k.more = k.more || []).push({ t: "", key });
        }
      }
      const uiItemText = (it) => String((it.key ? ui_INFO[it.key] : it.info) || "");
      const uiItemRefs = (it) => (it.key ? ui_REFS[it.key] : it.refs) || [];
      // the card of a button that took over others: its text, then each one's under its title; the links without repeats
      const uiMergedCard = (it) => {
        const parts = [uiItemText(it)];
        const refs = uiItemRefs(it).slice(), seen = new Set(refs.map((r) => r[0]));
        for (const d of it.more) {
          const tx = uiItemText(d);
          if (tx && parts.indexOf(tx) < 0) parts.push((d.t ? d.t + ": " : "") + tx);
          for (const r of uiItemRefs(d)) if (!seen.has(r[0])) { seen.add(r[0]); refs.push(r); }
        }
        // DEDUPE_211 (the understandability review, U-53): each of the joined texts came with the "בקצרה" block of the card's switches -
        // the card of "שולחן משה מקרוב" showed it twice. A paragraph that already stands in the card is not repeated.
        const seenP = new Set(), outP = [];
        for (const par of parts.filter(Boolean).join("\n\n").split("\n")) { const k = par.trim(); if (k.length > 40 && seenP.has(k)) continue; if (k) seenP.add(k); outP.push(par); }
        return { text: outP.join("\n").replace(/\n{3,}/g, "\n\n"), refs };
      };
      // 1.0.1-L (the contract with 75-tour.js): every place button in the panel's order, for ctx.ui.places()
      const placeList = [];
      const viewKeySet = new Set(ui_VIEWS.map((v) => v.key));
      // DEMOS_GROUP_300 (the user, 18.11.2026: "והייתי מוסיף קטגוריה נפרדת להדגמות"): the house's demonstrations together, in a group of
      // their own at the head of the panel, "הדגמות" (ui_demosList, the house's own list). Each starts as its own button does - a place's
      // (the same item: its camera and its card) or the pill's on the model (its own flight; the card is the pill's tooltip) - and has
      // no slide of its own in the presentation (noTour: each already has its place there)
      try {
        const list = typeof ui_demosList === "function" ? ui_demosList() : [];
        const pillOf = (id) => (ctx.shared.modelButtons || []).find((x) => x && x.id === id) || null;
        const D = [];
        for (const d of list) {
          let it = null;
          if (d.place) {
            for (const [, its] of PLACES) { const o = its.find((x) => x && x.t === d.place); if (o) { it = Object.assign({}, o, { t: d.t }); break; } }
          } else {
            it = { t: d.t };
            // DEMO_CARD_S1 (scan 1, finding 10; the user's decision): a pill's demonstration opens the card of its own place (d.card) - its
            // text and its sources, as the demonstrations started by a place do; the action stays the pill's (its own flight, not the place's)
            let src = null;
            if (d.card) for (const [, its] of PLACES) { const o = its.find((x) => x && x.t === d.card); if (o) { src = o; break; } }
            if (src) { for (const k of ["info", "refs", "key", "more"]) if (src[k] != null) it[k] = src[k]; }
            else Object.defineProperty(it, "info", { get: () => { const b = pillOf(d.pill); return (b && b.title) || ""; }, enumerable: true });
            if (!src && Array.isArray(d.refs)) it.refs = d.refs;   // WIT_REFS_S2: a pill's demonstration with no place of its own - its own sources (d.refs)
          }
          if (!it) continue;
          it.opsOf = [d.place || d.card].filter(Boolean);   // CHIP_KEEPS_DEMO_T: the rows of the place / card it stands for (opsFor)
          if (Array.isArray(d.ops)) it.opsAdd = d.ops.slice();   // and its own (ui_demosList's d.ops)
          if (d.pill) {
            it.action = () => {
              try { if (d.run) d.run(); } catch (_) {}
              const b = pillOf(d.pill);
              if (b && typeof b.set === "function" && !(typeof b.get === "function" && b.get())) b.set(true);
              //@@slot buildUI.after-b
            };
          }
          if (d.layer) it.layer = d.layer;
          it.noTour = true;
          delete it.noButton;
          D.push(it);
        }
        if (D.length) PLACES.unshift(["הדגמות", D]);
      } catch (_) {}
      for (const [gname, items] of PLACES) {
        const det = document.createElement("details");
        det.className = "tm-pl";
        const sm = document.createElement("summary");
        sm.textContent = gname;
        det.appendChild(sm);
        const box = document.createElement("div");
        for (const it of items) {
          // 1.0.1-K: a place whose view no module registered (and that has no camera of its own) is left out - no dead button
          if (it.view && !resolveFp(it.view) && !(it.cam && it.tg)) continue;
          if (it.noButton) {   // 1.0.1-L (Part 7, U3): no button of its own; its slide stays
            if (!placeItemByT[it.t]) placeItemByT[it.t] = it;
            placeList.push({ title: it.t, group: gname, view: it.view && viewKeySet.has(it.view) ? it.view : null,
              fp: it.view && resolveFp(it.view) ? it.view : null, info: it.key ? ui_INFO[it.key] || "" : it.info || "",
              //@@slot buildUI.after-box
            continue;
          }
          const pb = document.createElement("button");
          pb.type = "button";
          pb.textContent = ui_stripSrc(it.t);   // 1.1.0: no sources in the tree
          if (pb.textContent !== it.t) pb.title = it.t;
          pb.addEventListener("click", () => {
            try {
              // 1.3.5 / 1.9.3 (the full scan: the zone, the roof or the section of the place before stayed over this place's view for the
              // rest of its 15 seconds): what a place or a row switched on or opened for a while goes back first
              try { autoOff.flush(); } catch (_) {}
              try { if (typeof ctx.shared.closeAuto === "function") ctx.shared.closeAuto(); } catch (_) {}
              try { placeLeave(it); } catch (_) {}   // PLACE_LEAVE_210
              try { if (typeof ctx.camReset === "function") ctx.camReset(); } catch (_) {}   // CAM_RESET_N8
              uiPlaceCtx = { title: String(it.t || ""), group: String(gname || "") };   // PILL_SCOPE_N8
              if (it.layer) setLayer(it.layer, true);
              if (typeof it.action === "function") {
                try {
                  it.action();
                } catch (_) {
                }
              }
              // 1.0.1-L (L.27): the place's model feature on, with its 15 seconds (an animation with its own end runs to it)
              if (it.feature) {
                try {
                  autoOff.run(it.feature, pb);
                } catch (_) {
                }
              }
              const fp0 = it.view ? resolveFp(it.view) : null;
              // tg / cam may be functions resolved at click time (e.g. a place that follows the model's numbers)
              const pos = fp0 ? fp0.pos : typeof it.cam === "function" ? it.cam() : it.cam;
              const tgt = fp0 ? fp0.target : typeof it.tg === "function" ? it.tg() : it.tg;
              //@@slot buildUI.after-tgt
            } catch (_) {
            }
            // 1.0.1-L (L.34): the explanation in the floating card beside the panel, at this button's height; the panel's lists stay where they are
            if (it.more) setInfo("__place", uiMergedCard(it), { title: it.t, anchor: pb, side: it.cardSide });   // 1.0.1-L (Part 7, U3)
            else if (it.key) setInfo(it.key, null, { title: it.t, anchor: pb, side: it.cardSide });
            else setInfo("__place", { text: it.info || "", refs: it.refs || [] }, { title: it.t, anchor: pb, side: it.cardSide });
            // CHIP_KEEPS_DEMO_T: this click started a demonstration - its card's chips keep it running (and do not move the camera)
            xFeat = it.feature && it.feature.timed === false && (it.noTour || /הדגמה/.test(String(it.t || ""))) ? it.feature : null;
            if (xOpen && xOpsIds && xRuns()) { xDemo = true; renderChips(xOps, xOpsIds, xChipPicked, xKeep); }
            hidePanelOnPhone();
            for (const o of btns) o.classList.remove("on");
            for (const o of placeBtns) o.classList.remove("on");
            pb.classList.add("on");
          });
          box.appendChild(pb);
          placeBtns.push(pb);
          if (!placeBtnByT[it.t]) { placeBtnByT[it.t] = pb; placeItemByT[it.t] = it; }   // 1.0.1-J: for the presentation (ctx.ui.placeButton)
          placeList.push({ title: it.t, group: gname, view: it.view && viewKeySet.has(it.view) ? it.view : null,
            fp: it.view && resolveFp(it.view) ? it.view : null, info: it.key ? ui_INFO[it.key] || "" : it.info || "",
            //@@slot buildUI.after-tgt-2
        }
        det.appendChild(box);
        if (box.children.length) panel.appendChild(det);   // 1.1.0: a group whose buttons all merged elsewhere is not shown
      }
      for (const dt of Object.keys(UI_MERGE)) {   // 1.0.1-L (Part 7, U3): the old title leads to the kept button
        const d = placeItemByT[dt];
        if (d && d.mergeInto && placeBtnByT[d.mergeInto.t]) placeBtnByT[dt] = placeBtnByT[d.mergeInto.t];
      }
      // ===== 1.0.1-H: labels -> sources (the user: "הוסף מקורות להכל"): a click on a label in the model shows the explanation and the source
      // links of the matching view or place; the cursor turns into a hand over such a label. A label object may also carry
      // its own {info, refs}. LABEL_MAP ties the label texts of the modules (20-mount ... 60-palace) to a view key {v}, a place title {p}
      // (PLACES / EXTRAS above) or its own text {info, refs}; a function entry chooses by the label's position or layer (texts shared).
      // 1.0.1-K (K.9b item 7, the addendum C; the user on "העמוד": "ההסבר הזה ייכנס גם ללוח — ליד העמוד"): the click opens a small
      // card NEXT TO THE LABEL on the model - the explanation and its source links - that follows the camera and closes with its ✕ or a click
      // elsewhere (nothing is allocated per frame). 1.0.1-L (L.34): one card at a time - it and the panel's floating explanation card close
      // each other; the panel's #tm-info box is gone. =====
      // the label's card (built before the label handlers; closeCard is also called by the views and the places through setInfo)
      const card = document.createElement("div");
      card.id = "tm-card";
      card.setAttribute("role", "dialog");
      const cardHead = document.createElement("div");
      cardHead.className = "h";
      const cardTitle = document.createElement("span");
      cardTitle.className = "tt";
      const cardX = document.createElement("button");
      cardX.type = "button";
      cardX.className = "x";
      cardX.textContent = "✕";
      cardX.title = "סגור את ההסבר (Esc)";
      cardHead.appendChild(cardTitle);
      cardHead.appendChild(cardX);
      const cardBody = document.createElement("div");
      cardBody.className = "b";
      const cardRefs = document.createElement("div");
      cardRefs.className = "r";
      const cardOps = document.createElement("div");   // 1.0.2 (item 4): the label's opinions (renderChips above)
      cardOps.className = "o";
      cardOps.style.display = "none";
      card.appendChild(cardHead);
      cardOps.classList.add("ops-top");   // N15: the readings' switches open the card, above the text
      card.appendChild(cardOps);
      card.appendChild(cardBody);
      card.appendChild(cardRefs);
      document.body.appendChild(card);
      let cardOpsIds = null;
      let cardSpr = null, cardW = 300, cardH = 160, cardShown = false, cardX0 = -1, cardY0 = -1, cardSide = 1;   // side: 1 right of the label, -1 left
      const cardV = new Vector3(), cardC = new Vector3();
      const closeCard = () => {
        cardSpr = null;
        cardShown = false;
        card.style.display = "none";
      };
      closeLabelCard = closeCard;   // 1.0.1-L (L.34): the panel's explanation card closes this one
      cardX.addEventListener("click", (e) => {
        e.stopPropagation();
        closeCard();
      });
      // the card's place: beside the label's projected point (to its left on screen when there is no room on its right), inside the window
      // and left of the side panel; hidden (but kept) while the label is behind the camera, out of the view or hidden itself
      const placeCard = (force) => {
        const spr = cardSpr;
        if (!spr) return;
        let ok = !!spr.parent && spr.visible && labelGroup.visible;
        let x = 0, y = 0, half = 0;
        if (ok) {
          cardC.copy(spr.position).applyMatrix4(ctx.camera.matrixWorldInverse);
          ok = cardC.z < -0.5;
          if (ok) {
            cardV.copy(spr.position).project(ctx.camera);
            ok = Math.abs(cardV.x) < 1.05 && Math.abs(cardV.y) < 1.05;
            const W = window.innerWidth, H = window.innerHeight;
            x = (cardV.x * 0.5 + 0.5) * W;
            y = (-cardV.y * 0.5 + 0.5) * H;
            const pxPerAmah = H / (2 * -cardC.z * Math.tan((ctx.camera.fov || 50) * Math.PI / 360));
            half = Math.min(W * 0.25, spr.scale.x * pxPerAmah * 0.5);
          }
        }
        if (!ok) {
          if (cardShown) { cardShown = false; card.style.display = "none"; }
          return;
        }
        if (!cardShown) { cardShown = true; card.style.display = "flex"; }
        const W = window.innerWidth, H = window.innerHeight;
        const right = panel.style.display !== "none" && !isPhone(W) ? W - 242 : W - 8;
        // beside one end of the label; it keeps its side while that side has room (no jumping from side to side as the view turns)
        const leftR = x + half + 10, leftL = x - half - 10 - cardW;
        const fitsR = leftR + cardW <= right, fitsL = leftL >= 8;
        if (cardSide > 0 ? !fitsR && fitsL : !fitsL && fitsR) cardSide = -cardSide;
        let left = cardSide > 0 ? leftR : leftL;
        left = Math.max(8, Math.min(right - cardW, left));
        let top = y - cardH * 0.35;
        top = Math.max(ui_barH() + 8, Math.min(H - cardH - 60, top));   // 1.0.2: never over the fixed top bar (#tm-card is above it, z 29 > 20)
        if (force || Math.abs(left - cardX0) > 0.5 || Math.abs(top - cardY0) > 0.5) {
          cardX0 = left;
          cardY0 = top;
          card.style.left = left.toFixed(0) + "px";
          card.style.top = top.toFixed(0) + "px";
        }
      };
      const openCard = (spr, t) => {
        xcardClose();   // 1.0.1-L (L.34): one card at a time
        cardSpr = spr;
        cardSide = 1;
        ui_fillSrc(cardTitle, String((spr.userData.label && spr.userData.label.text) || "") + (t.title ? " — " + t.title : ""));   // a bare measure gets its meaning
        const rs = t.key ? ui_REFS[t.key] || [] : t.refs || [];
        //@@slot openCard
        refsBlock(cardRefs, rs, () => { cardW = card.offsetWidth || cardW; cardH = card.offsetHeight || cardH; placeCard(true); });   // N15: the sources closed behind "הצג מקורות"
        cardOpsIds = Array.isArray(t.ops) && t.ops.length ? t.ops : null;   // 1.0.2 (item 4)
        renderChips(cardOps, cardOpsIds);
        card.style.display = "flex";   // a column: the title, the text (scrolls), the source links (always seen)
        cardShown = true;
        card.scrollTop = 0;
        cardBody.scrollTop = 0;
        cardW = card.offsetWidth || 300;   // measured once per opening
        cardH = card.offsetHeight || 160;
        placeCard(true);
      };
      ctx.animated.push(() => { if (cardSpr) placeCard(false); });
      // 1.0.2 (item 4): a row marked anywhere (the table, a chip, the presentation) redraws the open cards' chips; the label's card is measured again
      chipsRefresh = () => {
        if (xOpen && xOpsIds) renderChips(xOps, xOpsIds, xChipPicked, xDemo ? xKeep : null);   // CHIP_KEEPS_DEMO_T
        for (const f of ui_chipHooks) { try { f(); } catch (_) {} }   // CHIP_KEEPS_DEMO_T: the presentation's banner
        if (cardSpr && cardOpsIds) {
          renderChips(cardOps, cardOpsIds);
          cardW = card.offsetWidth || cardW;
          cardH = card.offsetHeight || cardH;
          placeCard(true);
        }
      };
      window.addEventListener("resize", () => {
        if (!cardSpr) return;
        cardW = card.offsetWidth || cardW;
        cardH = card.offsetHeight || cardH;
        placeCard(true);
      });
      // a click anywhere else on the page closes the card (the canvas decides in its own pointerup below: a label opens another card)
      document.addEventListener("click", (e) => {
        if (!cardSpr) return;
        const t = e.target;
        if (t === ctx.renderer.domElement || (t && card.contains && card.contains(t))) return;
        closeCard();
      }, true);
      {
        const placeByT = {};
        for (const [, items] of PLACES) for (const it of items) if (it && it.t && !placeByT[it.t]) placeByT[it.t] = it;
        const viewKeys = new Set(ui_VIEWS.map((v) => v.key));
        //@@slot buildUI.DIM
          const shi = ctx.shared.shitin;
          if (/^השיתין/.test(l.text) && shi && shi.info) return { text: shi.info, refs: Array.isArray(shi.refs) ? shi.refs : [] };
          // 1.0.1-L (L.88; part5-kelim.md FOR-UI 3): a vessel's label opens that vessel; the exhibit's titles open the exhibit
          if (l.kelimKey && ctx.shared.kelim) {
            const K = ctx.shared.kelim, itK = K.items.find((x) => x.key === l.kelimKey);
            return itK ? { text: itK.text, refs: itK.refs || [], title: itK.name + " — " + itK.verse } : { text: K.info, refs: K.refs || [], title: K.title || "" };
          }
          let m = Object.prototype.hasOwnProperty.call(LABEL_MAP, l.text) ? LABEL_MAP[l.text] : null;
          //@@slot labelTarget
          if (!m && Array.isArray(l.layers)) {
            for (const lay of l.layers) {
              const k = lay === "thronePesukim" ? "pesukim" : lay === "throneTargumSheni" ? "targumSheni" : lay === "throneEstherRabbah" ? "estherRabbah" : lay === "throneBeitHamidrash" ? "beitHamidrash" : null;
              if (k && PN.throneVersions && PN.throneVersions[k]) { m = { info: PN.throneVersions[k], refs: TH_REFS[k] }; break; }
            }
          }
          if (typeof m === "function") m = m(l);
          if (!m) for (const [pre, t] of LABEL_PREFIX) if (l.text.indexOf(pre) === 0) { m = t; break; }
          if (!m) {
            const v = ui_VIEWS.find((vv) => vv.label === l.text);
            if (v) m = { v: v.key };
            else if (placeByT[l.text]) m = { p: l.text };
          }
          if (!m) return null;
          if (m.info) return { text: m.info, refs: m.refs || [], title: m.title || "", subj: { view: m.v || null, title: m.p || null } };
          if (m.v && viewKeys.has(m.v)) return { key: m.v };
          const it = m.p && placeByT[m.p];
          if (!it) return null;
          if (it.info) return { text: it.info, refs: it.refs || [], subj: { title: m.p } };
          if (it.key) return { key: it.key, subj: { title: m.p } };
          if (it.view && viewKeys.has(it.view)) return { key: it.view, subj: { title: m.p } };
          return null;
        };
        // 1.0.2 (item 4): the label's opinions - its view or place (as the panel's card), its own text and its layers (the throne's
        // versions, the forest readings)
        const labelOps = (l, t) => {
          const s = (t && t.subj) || {};
          const lays = Array.isArray(l.layers) ? l.layers : l.layer ? [l.layer] : [];
          return opsFor({ view: (t && t.key) || s.view || null, title: s.title || null, label: l.text, layers: lays });
        };
        for (const spr of labelGroup.children) {
          const t = labelTarget(spr.userData.label);
          if (t) t.ops = labelOps(spr.userData.label, t);
          spr.userData.target = t;
        }
        const missing = labelGroup.children.filter((s) => !s.userData.target).map((s) => s.userData.label && s.userData.label.text);
        if (missing.length) console.warn("[ui.js] labels without sources:", missing.join(" | "));
        const el = ctx.renderer.domElement;
        const lRay = new Raycaster(), lNdc = new Vector2();
        const visibleLabels = () => (labelGroup.visible ? labelGroup.children.filter((s) => s.visible && s.userData.target) : []);
        const labelOccluder = (m) => {
          const o = m.object;
          if (o.isSprite || o.isLine || o.isPoints || o.userData.noPick) return false;
          let vis = true;
          for (let p = o; p; p = p.parent) if (!p.visible) { vis = false; break; }
          if (!vis) return false;
          const mt = o.material;
          if (mt && !Array.isArray(mt) && (mt.opacity < 0.5 || mt.visible === false)) return false;
          return true;
        };
        const pickLabel = (ev, occlusion) => {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return null;
          lNdc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
          lRay.setFromCamera(lNdc, ctx.camera);   // sets lRay.camera, which sprites need
          const hits = lRay.intersectObjects(visibleLabels(), false);
          if (!hits.length) return null;
          const h = hits[0];
          if (occlusion) {
            // 1.0.1-K (review UI-H2-5): the Holy of Holies' cloud hides the labels inside it while it is on (its puffs carry noPick)
            if (cloud.visible && cloudMat.opacity > 0.5) {
              const ch = lRay.intersectObjects(cloud.children, false);
              if (ch.length && ch[0].distance < h.distance - 1) return null;
            }
            // a label behind a wall is hidden by the depth test: ignore it when a visible, opaque mesh is clearly nearer
            const m = ctx.raycast.firstVisible(lRay, ctx.root, labelOccluder);
            if (m && m.distance < h.distance - 1) return null;
          }
          return h.object;
        };
        let lDown = null, lastHover = 0;
        el.addEventListener("pointerdown", (e) => {
          lDown = e.__tmSynthetic ? null : { x: e.clientX, y: e.clientY, t: performance.now() };
        });
        el.addEventListener("pointerup", (e) => {
          if (e.__tmSynthetic || !lDown || mOn) { lDown = null; return; }
          const d = Math.hypot(e.clientX - lDown.x, e.clientY - lDown.y), dt = performance.now() - lDown.t;
          lDown = null;
          if (d > 6 || dt > 600) return;
          let spr = null;
          try { spr = pickLabel(e, true); } catch (_) { spr = null; }
          if (!spr) {
            closeCard();   // a click on the model, not on a label
            return;
          }
          // 1.0.1-L (L.34): the label's own card is the explanation (the panel's info box is gone, and the panel stays as the user left it)
          openCard(spr, spr.userData.target);
        });
        el.addEventListener("pointermove", (e) => {
          if (e.buttons || mOn) return;
          const now = performance.now();
          if (now - lastHover < 120) return;
          lastHover = now;
          let spr = null;
          // 1.0.1-K (review UI-H2-4): the hand only over a label that a click would open (the same occlusion test; it runs only when the
          // pointer is on a label at all)
          try { spr = pickLabel(e, true); } catch (_) { spr = null; }
          el.style.cursor = spr ? "pointer" : "";
        });
      }

      // ===== 1.0.1-H: the opinions table (the user: "את השיטות תנסה להכניס לתוך מסגרת מסודרת יצר בלבול לגמרי") =====
      // Every dispute of the model in ONE place, one row each: the subject, its sources (links), and the readings as buttons. The
      // places accordion no longer carries opinion buttons (one place = one button); the layers "העליות" and "האולם לשיטת הרמב״ם" are
      // rows here too (a view that needs a layer still switches it on, and the row follows through layerMarks).
      // 1.1.0 (the user: no doubles): the table is a closed group like the places' groups - every row is also a chip on its subject's
      // card, so the table is the one place to see ALL the readings together, and it does not sit open under the tree
      const secOps = document.createElement("details");
      secOps.className = "tm-pl tm-ops-det";
      const opsSum = document.createElement("summary");
      opsSum.textContent = "שיטות ומחלוקות — בחירת השיטה";
      secOps.appendChild(opsSum);
      const opsNote = document.createElement("div");
      opsNote.className = "s";
      opsNote.textContent = "המחלוקות מחולקות לקבוצות לפי המקומות; לחיצה על קבוצה פותחת אותה. בכל שורה: הנושא והדעות. הלחיצה מחליפה את המודל, מסבירה את הדעה ועפה אליה. המקורות — בכרטיס ההסבר.";   // OPS_GROUPS_303
      secOps.appendChild(opsNote);
      secOps.appendChild(opsBox);
      panel.appendChild(secOps);
      {
        //@@slot buildUI.sp
        });
      }
      //@@slot buildUI.after-tvNotes-note
      {
        const GROUPS = [
          //@@slot buildUI.after-GROUPS
        ];
        const byId = {};
        for (const r of OPS) if (r && r.id && !byId[r.id]) byId[r.id] = r;
        const used = new Set();
        const lists = [];
        for (const [name, ids] of GROUPS) {
          const rows = [];
          for (const id of ids) {
            const r = byId[id];
            if (r && !used.has(r)) { used.add(r); rows.push(r); }
          }
          if (rows.length) lists.push([name, rows]);
        }
        const rest = OPS.filter((r) => r && !used.has(r));
        if (rest.length) lists.push(["עוד", rest]);
        OPS.length = 0;
        for (const [name, rows] of lists) {
          const det = document.createElement("details");
          det.className = "tm-opg";
          const body = document.createElement("div");
          body.className = "tm-opg-b";
          let n = 0;
          for (const r of rows) {
            OPS.push(r);
            r.group = name;
            if (r.box && !r.cardOnly) { body.appendChild(r.box); n++; }
          }
          if (!n) continue;   // a group of card rows only: no empty group in the table
          const sm = document.createElement("summary");
          sm.textContent = name;
          const cnt = document.createElement("span");
          cnt.className = "n";
          cnt.textContent = "(" + n + ")";
          sm.appendChild(cnt);
          det.appendChild(sm);
          det.appendChild(body);
          opsBox.appendChild(det);
        }
      }
      // ===== viewing tools (SPEC 9.6; 1.0.1 FIXES F.2; 1.0.1-H: sources on the rows) =====
      // 1.0.1-K: the removal rows (the cutaway, the chambers, the ulam, the boards, the cloud) left the panel for the on-model pills (the
      // user: "הכפתור צריך להיות על המיצג ולא בתוכן הענינים"); the wall fade moved to the nav row. The panel says where they are.
      const secTog = document.createElement("div");
      secTog.className = "sec";
      secTog.textContent = "תצוגה — כלי צפייה (אינם חלק מן הבניין)";
      panel.appendChild(secTog);
      {
        const note = document.createElement("div");
        note.className = "s";
        note.style.lineHeight = "1.5";
        //@@slot buildUI.after-note-code
        panel.appendChild(note);
      }
      toggleRow("תוויות", true, (on) => {
        labelGroup.visible = on;
      });
      const setAutoRotate = (on) => {
        if (ctx.controls) {
          ctx.controls.autoRotate = !!on;
          ctx.controls.autoRotateSpeed = 0.4;
        }
      };
      // 1.0.1-K review (tour-8): the row's input is kept for ctx.ui.autoRotate (the presentation suspends the rotation through it)
      const autoRotRow = toggleRow("סיבוב איטי", false, setAutoRotate);
      // 1.2.0 (the user): indoors the eye stays in the room while it orbits a vessel (the DEFAULT: to see the menorot from behind, come close
      // with the wheel and drag round them); this row lets the eye pass the walls, which then go see-through (the 1.0.5 way)
      if (ctx.camInside && typeof ctx.camInside.set === "function") {
        toggleRow("מעבר דרך קירות (שקופים)", !ctx.camInside.get(), (on) => ctx.camInside.set(!on));
      }
      // STONE_211 (the user, 14.11.2026: "יש דרך לעשות את כל החומות והלשכות בצבע אבן עתיקה"; then: "לא צריך מתג לגוון האבן - אפשר לעשות
      // זאת מתג רק בצורה של אלו" - a row here, by "תוויות"; then, 23:15: "את כלל החומות בגוון אבן עתיקה (גם הלשכות, רק לא האולם, היכל,
      // קה״ק ותאים)"): the stone of ALL the walls and the chambers in a warm, aged hue - on by default; off: the light stone as before.
      // The Temple's own building (the ulam, the heichal, the Holy of Holies, the cells) keeps its light stone: its pieces that share
      // the walls' materials get an untinted twin. The walls' own clones (the fading walls of 10-core.js) are found by their texture.
      // A view setting only, not a reading (the marble of Herod's building is the opinions' row "בניין הורדוס")
      {
        const MM = ctx.M || {}, TT = ctx.THREE;
        const BASES = ["stone", "stoneLight", "stoneSmooth"].map((k) => MM[k]).filter(Boolean);
        if (BASES.length && TT && ctx.scene) {
          const TINT = new TT.Color(0xe8d3aa);
          const orig = new Map(BASES.map((m) => [m, m.color.clone()]));   // a base material -> its own colour
          const tinted = new Map(BASES.map((m) => [m, m.color.clone().multiply(TINT)]));
          const aged = new Map();    // every tinted material -> the colour it goes back to
          const fresh = new Map();   // a base material -> its untinted twin, for the Temple's building
          const src = (t) => t && (t.source || t.image || t);
          const baseOf = (m) => { if (orig.has(m)) return m; if (!m.map) return null; for (const b of BASES) if (b.map && (b.map === m.map || src(b.map) === src(m.map))) return b; return null; };
          const near = (p, q) => Math.abs(p.r - q.r) + Math.abs(p.g - q.g) + Math.abs(p.b - q.b) < 0.02;
          const inTemple = (o) => { for (let p = o; p; p = p.parent) if (/^(heichal|interior|ulamCourses|house-)/.test(p.name || "")) return true; return false; };
          let on = true;
          const notStone = new WeakSet(), done = new WeakMap();   // materials that are not the walls' stone; a mesh -> the material it had when scanned
          const scan = () => {
            ctx.scene.traverse((o) => {
              if (!o.isMesh || o.isSprite) return;
              const arr = Array.isArray(o.material);
              if (!arr && done.get(o) === o.material) return;
              const ms = arr ? o.material : [o.material];
              let temple = null;
              for (let i = 0; i < ms.length; i++) {
                const m = ms[i];
                if (!m || !m.color || notStone.has(m) || (m.userData && m.userData.tmFresh)) continue;
                const isBase = orig.has(m);
                if (!isBase && aged.has(m)) continue;
                const b = isBase ? m : baseOf(m);
                if (!b) { notStone.add(m); continue; }
                if (temple === null) temple = inTemple(o);
                if (temple) {
                  if (isBase) {   // the building shares the walls' material: its untinted twin
                    let f = fresh.get(b);
                    if (!f) { f = b.clone(); f.color.copy(orig.get(b)); f.userData.tmFresh = true; fresh.set(b, f); }
                    if (arr) o.material[i] = f; else o.material = f;
                  } else { if (near(m.color, tinted.get(b))) m.color.copy(orig.get(b)); m.userData.tmFresh = true; }   // its own clone stays light
                  continue;
                }
                if (!isBase && !near(m.color, orig.get(b)) && !near(m.color, tinted.get(b))) { notStone.add(m); continue; }   // a clone with a colour of its own
                aged.set(m, orig.get(b));
              }
              if (!arr) done.set(o, o.material);
            });
          };
          const apply = () => { for (const [m, c] of aged) { m.color.copy(c); if (on) m.color.multiply(TINT); } };
          const setAged = (v) => { on = !!v; scan(); apply(); };
          setAged(true);
          toggleRow("גוון אבן עתיקה", true, setAged);
          ctx.shared.stoneAged = { set: setAged, isOn: () => on, count: () => aged.size };
          let stoneScanDeferred = false;
          const refreshDeferredStone = () => {
            if (!stoneScanDeferred || document.hidden || window.__tmHouseVisible === false) return;
            stoneScanDeferred = false;
            const n = aged.size; scan(); if (aged.size !== n) apply();
          };
          setInterval(() => { stoneScanDeferred = true; refreshDeferredStone(); }, 2500);
          // The house bridge emits resize on resume. Apply an overdue tint before the next visible frame,
          // including materials created while hidden; ordinary resizes do not trigger another scan.
          document.addEventListener("visibilitychange", refreshDeferredStone);
          window.addEventListener("resize", refreshDeferredStone);
        }
      }
      // SOUND_211 (the user, 15.11.2026: sounds in the demonstrations - and a way to silence them): the row "קולות בהדגמות", on by
      // default; off - no demonstration makes a sound (ctx.shared.soundOff: every sound maker asks it) and what sounds now stops
      // (ctx.shared.soundStops). Kept between visits (localStorage "tm.sound.off", one key for both houses)
      {
        let off = false;
        try { off = localStorage.getItem("tm.sound.off") === "1"; } catch (_) {}
        ctx.shared.soundOff = off;
        const inpS = toggleRow("קולות בהדגמות", !off, (on) => {
          ctx.shared.soundOff = !on;
          try { localStorage.setItem("tm.sound.off", on ? "0" : "1"); } catch (_) {}
          if (!on) { for (const f of (Array.isArray(ctx.shared.soundStops) ? ctx.shared.soundStops : [])) { try { f(); } catch (_) {} } }
        });
        // SOUND_SYNC_211 (the function review, F2-09): the key was read once, at load - with both houses open, silencing one left the
        // other sounding. Now each house reads it again when the other writes it ("storage") and when it is shown again.
        const syncS = () => {
          let o = false;
          try { o = localStorage.getItem("tm.sound.off") === "1"; } catch (_) { return; }
          if (o === !!ctx.shared.soundOff) return;
          ctx.shared.soundOff = o;
          if (inpS) inpS.checked = !o;
          if (o) { for (const f of (Array.isArray(ctx.shared.soundStops) ? ctx.shared.soundStops : [])) { try { f(); } catch (_) {} } }
        };
        window.addEventListener("storage", (e) => { if (!e || e.key == null || e.key === "tm.sound.off") syncS(); });
        window.addEventListener("focus", syncS);
        document.addEventListener("visibilitychange", syncS);
      }
      // HQ_302 (the WebGPU round's STAGE2_LIGHT rows, in the regular engine): "soft shadow in corners" and, once it is ready, "light
      // bounced from the walls"; both off by default, kept between visits in localStorage "tm.hq.ao" / "tm.hq.gi" (one key for both
      // houses, as "tm.sound.off"); ctx.shared.hq (90-entry.js, 85-hq.js) does the drawing. Each house follows the other's change
      // ("storage", focus, shown again), as the sound row does.
      if (ctx.shared.hq) {
        const HQ = ctx.shared.hq;
        const rd = (k) => { try { return localStorage.getItem(k) === "1"; } catch (_) { return false; } };
        const wr = (k, on) => { try { localStorage.setItem(k, on ? "1" : "0"); } catch (_) {} };
        let aoOn = rd("tm.hq.ao"), giOn = HQ.giReady ? rd("tm.hq.gi") : false;
        HQ.set(aoOn, giOn);
        const inpAO = toggleRow("איכות גבוהה: צל רך בפינות", aoOn, (on) => { aoOn = on; wr("tm.hq.ao", on); HQ.set(aoOn, giOn); });
        if (inpAO && inpAO.parentNode) inpAO.parentNode.title = "צל רך בפינות, בחיבורים ובתחתית הקירות. במחשב חלש זה עלול להאט את התנועה.";
        let inpGI = null;
        if (HQ.giReady) {
          inpGI = toggleRow("אור חוזר מהקירות (כבד מאוד)", giOn, (on) => { giOn = on; wr("tm.hq.gi", on); HQ.set(aoOn, giOn); });
          if (inpGI && inpGI.parentNode) inpGI.parentNode.title = "אור שחוזר מהקירות ומהזהב אל מה שסביבם. כבד מאוד: במחשב חלש התנועה תאט מאוד.";
        }
        const syncHQ = () => {
          const a = rd("tm.hq.ao"), g = HQ.giReady ? rd("tm.hq.gi") : false;
          if (a === aoOn && g === giOn) return;
          aoOn = a;
          giOn = g;
          if (inpAO) inpAO.checked = a;
          if (inpGI) inpGI.checked = g;
          HQ.set(aoOn, giOn);
        };
        window.addEventListener("storage", (e) => { if (!e || e.key == null || e.key === "tm.hq.ao" || e.key === "tm.hq.gi") syncHQ(); });
        window.addEventListener("focus", syncHQ);
        document.addEventListener("visibilitychange", syncHQ);
      }
      //@@slot buildUI.secLay
      panel.appendChild(units);
      const foot = document.createElement("div");
      foot.id = "tm-foot";
      // 1.1.0: the controls' hint is the "ניווט" dialog of the top bar; the foot only points there
      foot.textContent = "הוראות ניווט (עכבר, מגע, מקלדת) — בכפתור ״ניווט״ שבסרגל העליון";
      foot.style.cursor = "pointer";
      foot.addEventListener("click", () => { const b = document.getElementById("tm-help-btn"); if (b) b.click(); });
      panel.appendChild(foot);
      // NEWS_WIN_211: the way back to the list of this version - the top bar's button goes once the list was seen (1.1.0, the user)
      {
        const fn = document.createElement("div");
        fn.id = "tm-foot-news";
        fn.textContent = "מה חדש בגרסה זו";
        fn.addEventListener("click", () => { try { const o = document.getElementById("tm-news"); if (o) o.remove(); else if (ctx.ui && ctx.ui.news) ctx.ui.news.show(); } catch (_) {} });
        panel.appendChild(fn);
      }
      // 1.1.0: the top bar's buttons are children of #tm-topbtns in index.html's header, in a flex row, ordered by `order`
      // (presentation 10, navigation help 20, print 30, report 40, what's new 50). Each gets an inline SVG icon (ui_topIcon) and its
      // label in a span.lbl (hidden in a narrow window: index.html). No measuring, no polling: the row lays itself out.
      // ctx.ui.topbarAdd is exported for 75-tour.js (the presentation button, built after this module).
      const topbarAdd = (el, order, icon, label) => {
        el.classList.add("tm-topbtn");
        el.dataset.order = String(order == null ? 99 : order);
        if (icon || label) {
          el.textContent = "";
          if (icon) el.appendChild(ui_topIcon(icon));
          if (label) {
            const sp = document.createElement("span");
            sp.className = "lbl";
            sp.textContent = label;
            el.appendChild(sp);
          }
        }
        const nav = document.getElementById("tm-topbtns");
        if (!nav) {
          document.body.appendChild(el);
          return el;
        }
        const o = +el.dataset.order;
        let before = null;
        for (const c of nav.children) {
          if (+c.dataset.order > o) { before = c; break; }
        }
        nav.insertBefore(el, before);
        return el;
      };
      // ===== 1.1.0 (the user): a clear button in the bar with the navigation instructions ("הוראות ניווט") =====
      {
        const hbtn = document.createElement("button");
        hbtn.type = "button";
        hbtn.id = "tm-help-btn";
        hbtn.title = "הוראות ניווט: עכבר, משטח מגע, מגע ומקלדת";
        topbarAdd(hbtn, 20, "help", "ניווט");
        const dlg = document.createElement("div");
        dlg.id = "tm-help";
        dlg.setAttribute("role", "dialog");
        dlg.setAttribute("aria-label", "הוראות ניווט");
        const box = document.createElement("div");
        box.className = "box";
        const t = document.createElement("div");
        t.className = "t";
        t.textContent = "הוראות ניווט במודל";
        box.appendChild(t);
        const sec = (title, items) => {
          const h = document.createElement("h4");
          h.textContent = title;
          box.appendChild(h);
          const ul = document.createElement("ul");
          for (const it of items) {
            const li = document.createElement("li");
            // "<kbd>" marks a key: [[text]]
            const parts = String(it).split(/(\[\[[^\]]+\]\])/);
            for (const p of parts) {
              if (!p) continue;
              const m = /^\[\[([^\]]+)\]\]$/.exec(p);
              if (m) {
                const k = document.createElement("kbd");
                k.textContent = m[1];
                li.appendChild(k);
              } else li.appendChild(document.createTextNode(p));
            }
            ul.appendChild(li);
          }
          box.appendChild(ul);
        };
        // HELP_211: the navigation help in plain words (the user: "בשפה יותר ברורה גם לכאלו שלא מבינים במחשב")
        sec("עם עכבר", [
          "להסתובב סביב המקום: לחץ על הכפתור השמאלי של העכבר, החזק אותו, והזז את העכבר.",
          "להתקרב או להתרחק: גלגל את הגלגלת שבאמצע העכבר. המודל מתקרב בדיוק למקום שעליו עומד הסמן — זכוכית המגדלת.",
          "אפשר גם בלי גלגלת: העמד את זכוכית המגדלת על מקום ולחץ [[Enter]] — המודל מתקרב אליו. [[Shift]] + [[Enter]] — מתרחק. לחיצה כפולה בעכבר עושה כמו [[Enter]].",
          "להזיז את התמונה הצידה: לחץ על הכפתור הימני של העכבר, החזק אותו, והזז את העכבר.",
          "לקרוא הסבר על מקום: לחץ על השם שכתוב עליו במודל. כשהסמן נעשה יד — אפשר ללחוץ."
        ]);
        sec("במחשב נייד (משטח מגע)", [
          "להסתובב: לחץ על המשטח, החזק, וגרור את האצבע (או: הקש פעמיים, ובפעם השנייה השאר את האצבע על המשטח וגרור).",
          "להתקרב: שים שתי אצבעות על המשטח והרחק אותן זו מזו, או החלק את שתיהן יחד למעלה.",
          "אם במקום להתקרב הדף כולו זז: לחץ פעם אחת על המודל, ונסה שוב כשהסמן עומד על המודל."
        ]);
        sec("בטלפון או בטאבלט (מסך מגע)", [
          "אצבע אחת — מסובבת. שתי אצבעות שנפתחות — מקרבות. שתי אצבעות שזזות יחד — מזיזות את התמונה."
        ]);
        sec("עם המקלדת", [
          "[[↑]] — ללכת קדימה. [[↓]] — ללכת אחורה.",
          "[[←]] [[→]] — לפנות שמאלה וימינה.",
          "[[PageUp]] — לעלות. [[PageDown]] — לרדת.",
          "[[+]] [[−]] — להתקרב ולהתרחק. [[Esc]] — לסגור כרטיס הסבר."
        ]);
        sec("התפריט שבצד", [
          "בתפריט רשומים כל המקומות. לחיצה על שם — מעבירה אל המקום ופותחת עליו הסבר.",
          "שורת החיפוש שבראש התפריט: כתוב מילה, ויופיעו המקומות שמתאימים לה.",
          "״שיטות ומחלוקות״: כאן בוחרים איך לצייר דבר שנחלקו בו. לחיצה על שיטה — משנה את המודל מיד.",
          "״מה חדש בגרסה זו״, בסוף התפריט — פותח שוב את רשימת החידושים."
        ]);
        sec("הדגמות", [
          "כפתור של הדגמה מפעיל סרטון בתוך המודל.",
          "לחיצה על המודל בזמן הדגמה — עוצרת אותה. ״המשך״ — ממשיך מאותו רגע. ״עצור״ — מפסיק."
        ]);
        sec("כלים נוספים", [
          "המצפן (בפינה התחתונה): החץ האדום מראה לאן הצפון. לחיצה על אחת האותיות — מפנה את המבט לכיוון שלה.",
          "🚶 מצב הליכה: העין בגובה אדם, כאילו אתה הולך במקום. החצים במקלדת — הליכה. [[Esc]] — יציאה.",
          "״חתך״: חותך את הבניין כמו בשרטוט, כדי לראות מה בפנים. הפס שלידו מזיז את מקום החתך.",
          "בתוך ההיכל: כשאתה רחוק — הגרירה מסובבת את המבט סביבך. ליד כלי — הגרירה מסתובבת סביב הכלי.",
          "״מעבר דרך קירות״ (בתפריט, תחת ״תצוגה״) — מרשה לעבור דרך קירות; הם נעשים שקופים בדרך.",
          "״טשטוש חומות״ (בשורת הכפתורים שבתחתית המסך): חומה שמסתירה את מה שמביטים בו נעשית שקופה למחצה. ״מרחק טשטוש״ — עד איזה מרחק מן העין.",
          "״↺ החזר הכל״ — מופיע בשורת הכפתורים שבתחתית המסך אחרי שפתחת משהו במודל (גג, קיר, חתך). לחיצה עליו סוגרת את כל מה שנפתח. את השיטות שבחרת הוא אינו משנה.",
          "בסרגל העליון: ״מצגת״ — סיור מודרך, שלב אחר שלב. ״הדפסה״ — מדפיסה את התמונה ואת כרטיס ההסבר. ״דיווח״ — לשלוח הערה או תיקון."
        ]);
        const bb = document.createElement("div");
        bb.className = "b";
        const ok = document.createElement("button");
        ok.type = "button";
        ok.className = "y";
        ok.textContent = "סגירה";
        bb.appendChild(ok);
        box.appendChild(bb);
        dlg.appendChild(box);
        document.body.appendChild(dlg);
        const close = () => { dlg.style.display = "none"; };
        ok.addEventListener("click", close);
        dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
        dlg.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc" || e.key === "Enter") close();
        });
        dlg.addEventListener("keyup", (e) => e.stopPropagation());
        hbtn.addEventListener("click", () => {
          dlg.style.display = dlg.style.display === "flex" ? "none" : "flex";
          if (dlg.style.display === "flex") { try { ok.focus({ preventScroll: true }); } catch (_) {} }
        });
      }
      // ===== 1.0.2 (B, printing): one quiet link at the panel's foot, beside "דיווח על טעות או תקלה" (no new button on the model's view).
      // It builds a clean print page #tm-print: the plugin's name and the current place or view (the open card's title, else the marked
      // button), the view as a picture (one frame rendered and the canvas read with toDataURL right after it, in the same task: the
      // drawing buffer is not kept), and, when a card is open, its text (the brackets small) with its sources' names below. @media print
      // (ui_CSS) hides everything else; A4 landscape. Inside Otzaria (api.md): a small choice - ui.print (the system's dialog) or
      // ui.exportPdf ("שמור בשם") - called straight from the button's click (both need the user's own gesture, no permission; no timeout of
      // ours: sdk.md excludes them), with the page size given as parameters (@page is not honoured there). Outside Otzaria: window.print().
      // The print page goes when the print is done or cancelled. =====
      {
        let pg = null, busy = false;
        const PR_OPTS = { pageSize: "a4", orientation: "landscape", marginMm: 10, printBackgrounds: true };
        const inOtz = () => typeof window.Otzaria !== "undefined" && !!window.Otzaria && typeof window.Otzaria.call === "function";
        const drop = () => {
          if (pg) {
            pg.remove();
            pg = null;
          }
        };
        const curName = () => {
          if (xOpen && xTitle.textContent.trim()) return xTitle.textContent.trim();
          if (cardSpr && cardTitle.textContent.trim()) return cardTitle.textContent.trim();
          const on = btns.concat(placeBtns).find((b) => b.classList.contains("on"));
          return on ? on.textContent.replace(/\d+$/, "").trim() : "";
        };
        const build = () => {
          drop();
          let url = "";
          try {
            ctx.renderer.render(ctx.scene, ctx.camera);
            url = ctx.renderer.domElement.toDataURL("image/jpeg", 0.9);
          } catch (e) {
            console.warn("[ui.js] print picture: " + (e && e.message ? e.message : e));
          }
          const name = curName();
          pg = document.createElement("div");
          pg.id = "tm-print";
          const h = document.createElement("h1");
          h.textContent = name || "בית המקדש הראשון";   // 1.1.0 (the user): one title - the place's name (the plugin's name is in the credit)
          pg.appendChild(h);
          if (/^data:image\/(?:jpeg|png)/.test(url) && url.length > 64) {
            const img = document.createElement("img");
            img.alt = name || "בית המקדש הראשון";
            img.src = url;
            pg.appendChild(img);
          }
          const credit = () => {   // 1.1.0 (the user): a link to the plugin in Otzaria
            const cr = document.createElement("div");
            cr.className = "cr";
            //@@slot credit
            a.textContent = "לפתיחת התוסף באוצריא";
            cr.appendChild(a);
            return cr;
          };
          pg.appendChild(credit());
          const tb = xOpen ? xBody : cardSpr ? cardBody : null, tr = xOpen ? xRefs : cardSpr ? cardRefs : null;
          //@@slot build.raw
          const body = raw != null ? raw : tb ? String(tb.textContent || "").trim() : "";
          if (body) {
            // 1.0.6 (the user): the card on a page of its own, attached: its title, its text and each source with its link to Otzaria
            const p2 = document.createElement("div");
            p2.className = "pg2";
            const tx = document.createElement("div");
            tx.className = "tx";
            if (raw != null) ui_fillRich(tx, body); else ui_fillSrc(tx, body);   // the brackets small, as in the card
            p2.appendChild(tx);
            const as = tr ? Array.from(tr.querySelectorAll("a")).filter((a) => String(a.textContent || "").trim()) : [];
            if (as.length) {
              const rs = document.createElement("div");
              rs.className = "rs";
              rs.appendChild(document.createTextNode("מקורות: "));
              as.forEach((a, k) => {
                const r = a.__ref, l = document.createElement("a");
                l.textContent = String(a.textContent).trim();
                if (r && r.book != null && r.index != null) l.href = "otzaria://open/book/" + r.book + "?index=" + r.index;
                if (k) rs.appendChild(document.createTextNode(" · "));
                rs.appendChild(l);
              });
              p2.appendChild(rs);
            }
            p2.appendChild(credit());
            pg.appendChild(p2);
          }
          document.body.appendChild(pg);
          return pg;
        };
        //@@slot fileName
        const plink = document.createElement("button");
        plink.type = "button";
        plink.id = "tm-print-link";
        plink.textContent = "הדפסה";
        plink.title = "הדפסה או שמירה כ-PDF";
        topbarAdd(plink, 30, "print", "הדפסה");
        // inside Otzaria: the choice
        const pdlg = document.createElement("div");
        pdlg.id = "tm-printdlg";
        pdlg.setAttribute("role", "dialog");
        pdlg.setAttribute("aria-label", "הדפסה או שמירה כ-PDF");
        const pbox = document.createElement("div");
        pbox.className = "box";
        const pt = document.createElement("div");
        pt.className = "t";
        pt.textContent = "הדפסה או שמירה כ-PDF";
        const pn = document.createElement("div");
        pn.textContent = "תמונת המבט ושם המקום; וכשהסבר פתוח — גם ההסבר ומקורותיו.";
        const pbb = document.createElement("div");
        pbb.className = "b";
        const bPrint = document.createElement("button");
        bPrint.type = "button";
        bPrint.className = "y";
        bPrint.textContent = "הדפסה";
        const bPdf = document.createElement("button");
        bPdf.type = "button";
        bPdf.textContent = "שמירה כ-PDF";
        const bNo = document.createElement("button");
        bNo.type = "button";
        bNo.textContent = "ביטול";
        pbb.appendChild(bPrint);
        pbb.appendChild(bPdf);
        pbb.appendChild(bNo);
        pbox.appendChild(pt);
        pbox.appendChild(pn);
        pbox.appendChild(pbb);
        pdlg.appendChild(pbox);
        document.body.appendChild(pdlg);
        const closeP = () => {
          pdlg.style.display = "none";
          try { if (pdlg.contains(document.activeElement)) document.activeElement.blur(); } catch (_) {}
          if (!busy) drop();
        };
        // the call is made at once, inside the click (the user's gesture); then the choice closes and the page waits for the answer
        const runOtz = (method, params) => {
          if (busy) return;
          busy = true;
          bPrint.disabled = bPdf.disabled = true;
          let p;
          try {
            p = window.Otzaria.call(method, params);
          } catch (e) {
            p = Promise.resolve({ success: false, error: { message: e && e.message ? e.message : String(e) } });
          }
          pdlg.style.display = "none";
          Promise.resolve(p).then((res) => {
            if (res && res.success === false) {
              const code = res.error ? res.error.code || res.error.message || "" : "";
              if (code) console.warn("[ui.js] " + method + ": " + code);
              tmToast(code === "error.conflict" ? "חלון אחר פתוח כעת, נסו שוב אחריו" : method === "ui.exportPdf" ? "השמירה לא נפתחה, נסו שוב" : "ההדפסה לא נפתחה, נסו שוב");
            } else if (method === "ui.exportPdf" && res && res.data && res.data.saved) {
              tmToast("נשמר" + (res.data.name ? ": " + res.data.name : ""));
            }
          }, (e) => {
            console.warn("[ui.js] " + method + ": " + (e && e.message ? e.message : e));
            tmToast("ההדפסה לא נפתחה, נסו שוב");
          }).then(() => {
            busy = false;
            bPrint.disabled = bPdf.disabled = false;
            drop();
          });
        };
        bPrint.addEventListener("click", () => runOtz("ui.print", Object.assign({ jobName: fileName() }, PR_OPTS)));
        // 1.0.4 (the user's picture): in Otzaria 0.9.98.x ui.exportPdf opens a FOLDER picker and puts fileName into its folder box, which then
        // fails with "Path does not exist" - so no fileName: the person picks a folder and Otzaria names the file
        bPdf.addEventListener("click", () => runOtz("ui.exportPdf", Object.assign({ title: "שמירה כ-PDF" }, PR_OPTS)));
        bNo.addEventListener("click", closeP);
        pdlg.addEventListener("click", (e) => { if (e.target === pdlg) closeP(); });
        pdlg.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc") closeP();
        });
        pdlg.addEventListener("keyup", (e) => e.stopPropagation());
        plink.addEventListener("click", () => {
          if (busy) return;
          if (inOtz()) {
            build();   // the picture of the view as it is now, before the choice covers it
            bPrint.disabled = bPdf.disabled = false;
            pdlg.style.display = "flex";
            try { bPrint.focus(); } catch (_) {}
            return;
          }
          // outside Otzaria: the browser's own print, once the picture is decoded
          const page = build();
          const img = page.querySelector("img");
          let done = false;
          const fin = () => {
            if (done) return;
            done = true;
            window.removeEventListener("afterprint", fin);
            drop();
          };
          const go = () => {
            window.addEventListener("afterprint", fin);
            try { window.print(); } catch (_) {}
            setTimeout(fin, 1000);
          };
          const dec = img && typeof img.decode === "function" ? img.decode().catch(() => {}) : Promise.resolve();
          Promise.race([dec, new Promise((r) => setTimeout(r, 1500))]).then(go);
        });
      }
      // ===== 1.0.2 (item 1, the user: "התוסף בחנות כבר"): a report from inside the plugin. The plugin is in the Otzaria store, so
      // feedback.report (api.md: no permission; Otzaria shows its own confirmation with a preview; returns 'sent' | 'queued' | 'cancelled';
      // details up to 5000 characters; reportType bug | crash | content | other) reaches its developer. One quiet link at the panel's foot opens a
      // small form: the kind, the text and "שלח"; the details get the version, the view or the open card, the camera and the readings now
      // chosen. Outside Otzaria (no window.Otzaria.call: the standalone HTML file, a browser) there is no link. =====
      if (typeof window.Otzaria !== "undefined" && window.Otzaria && typeof window.Otzaria.call === "function") {
        const RT = [["content", "טעות במקור"], ["bug", "תקלה"], ["other", "הצעה"]];
        const link = document.createElement("button");
        link.type = "button";
        link.id = "tm-report-link";
        link.textContent = "דיווח";
        link.title = "דיווח על טעות או תקלה";
        topbarAdd(link, 40, "report", "דיווח");
        const dlg = document.createElement("div");
        dlg.id = "tm-report";
        dlg.setAttribute("role", "dialog");
        dlg.setAttribute("aria-label", "דיווח על טעות או תקלה");
        const box = document.createElement("div");
        box.className = "box";
        const hd = document.createElement("div");
        hd.className = "t";
        hd.textContent = "דיווח על טעות או תקלה";
        const ty = document.createElement("div");
        ty.className = "ty";
        let kind = "content";
        const tyBtns = RT.map(([k, label]) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = label;
          b.addEventListener("click", () => { kind = k; for (const o of tyBtns) o.classList.toggle("on", o === b); });
          ty.appendChild(b);
          return b;
        });
        tyBtns[0].classList.add("on");
        // which house the report is about - required, none marked at first (the user: "וללא אפשרות דיווח כלשהו בלי סימון")
        const HOUSES = [["b1", "בית ראשון"], ["b2", "בית שני"], ["both", "שני בתי המקדש"]];
        const hq = document.createElement("div");
        hq.className = "n";
        hq.textContent = "על איזה בית הדיווח? (חובה)";
        const hs = document.createElement("div");
        hs.className = "ty";
        hs.setAttribute("role", "radiogroup");
        hs.setAttribute("aria-label", "על איזה בית הדיווח");
        let house = null;
        const hBtns = HOUSES.map(([k, label]) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = label;
          b.setAttribute("role", "radio");
          b.setAttribute("aria-checked", "false");
          b.addEventListener("click", () => {
            house = k;
            for (const o of hBtns) { o.classList.toggle("on", o === b); o.setAttribute("aria-checked", o === b ? "true" : "false"); }
          });
          hs.appendChild(b);
          return b;
        });
        const clearHouse = () => { house = null; for (const o of hBtns) { o.classList.remove("on"); o.setAttribute("aria-checked", "false"); } };
        const ta = document.createElement("textarea");
        ta.maxLength = 3500;
        ta.placeholder = "מה לא נכון, ואיפה? (למשל: המקור, המידה או הכפתור)";
        ta.setAttribute("aria-label", "תוכן הדיווח");
        const note = document.createElement("div");
        note.className = "n";
        note.textContent = "יצורפו: גרסת התוסף, המבט או ההסבר הפתוח, והשיטות שנבחרו.";
        const bb = document.createElement("div");
        bb.className = "b";
        const send = document.createElement("button");
        send.type = "button";
        send.className = "y";
        send.textContent = "שלח";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "ביטול";
        bb.appendChild(send);
        bb.appendChild(cancel);
        box.appendChild(hd);
        box.appendChild(hq);
        box.appendChild(hs);
        box.appendChild(ty);
        box.appendChild(ta);
        box.appendChild(note);
        box.appendChild(bb);
        dlg.appendChild(box);
        document.body.appendChild(dlg);
        const closeDlg = () => {
          dlg.style.display = "none";
          try { if (dlg.contains(document.activeElement)) document.activeElement.blur(); } catch (_) {}
        };
        link.addEventListener("click", () => {
          dlg.style.display = "flex";
          send.disabled = false;
          try { ta.focus(); } catch (_) {}
        });
        cancel.addEventListener("click", closeDlg);
        dlg.addEventListener("click", (e) => { if (e.target === dlg) closeDlg(); });
        // typing in the form never turns the model (the arrow keys, + / -) and never reaches the presentation's keys; Esc closes it
        dlg.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape" || e.key === "Esc") closeDlg();
        });
        dlg.addEventListener("keyup", (e) => e.stopPropagation());
        // what the report is about, for the developer: the version, the open card or the marked view / place, the camera, the readings
        const context = () => {
          const L = [];
          const verEl = document.getElementById("version");
          const ver = ui_bootVersion || (verEl && verEl.textContent ? verEl.textContent.replace(/^v/, "") : "");
          //@@slot context
          L.push("גרסה: " + (ver || "לא ידועה"));
          if (xOpen) L.push("הסבר פתוח: " + xTitle.textContent);
          if (cardSpr) L.push("תווית פתוחה: " + cardTitle.textContent);
          const on = btns.concat(placeBtns).find((b) => b.classList.contains("on"));
          if (on) L.push("מבט / מקום: " + on.textContent.replace(/\d+$/, "").trim());
          try {
            const r1 = (v) => [v.x, v.y, v.z].map((n) => Math.round(n * 10) / 10).join(", ");
            L.push("מצלמה: " + r1(ctx.camera.position) + " ← " + r1(ctx.controls.target));
          } catch (_) {}
          const chosen = OPS.filter((r) => !r.disabled && r.cur != null).map((r) => (r.short || r.cap) + ": " + opsChip(r, r.cur));
          if (chosen.length) L.push("שיטות: " + chosen.join(" · "));
          return L.join("\n");
        };
        send.addEventListener("click", async () => {
          const text = ta.value.trim();
          if (!house) {
            tmToast("סמנו על איזה בית הדיווח");
            try { hBtns[0].focus(); } catch (_) {}
            return;
          }
          if (!text) {
            tmToast("כתבו מה לדווח");
            try { ta.focus(); } catch (_) {}
            return;
          }
          send.disabled = true;
          const hName = (HOUSES.find((h) => h[0] === house) || [null, ""])[1];
          const details = ("הבית: " + hName + "\n\n" + text + "\n\n---\n" + context()).slice(0, 5000);
          let res = null;
          try {
            res = await window.Otzaria.call("feedback.report", { details, reportType: kind });
          } catch (e) {
            res = { success: false, error: { message: e && e.message ? e.message : String(e) } };
          }
          send.disabled = false;
          const st = typeof res === "string" ? res : res && typeof res.data === "string" ? res.data : null;
          if (st === "sent" || st === "queued") {
            tmToast(st === "sent" ? "הדיווח נשלח, תודה" : "יישלח כשיהיה חיבור");
            ta.value = "";
            clearHouse();
            closeDlg();
          } else if (st === "cancelled") {
            // Otzaria's own dialog was cancelled: the form stays as it was, nothing to say
          } else {
            // 1.0.2 (fix): the screen in plain Hebrew; the code (error.conflict, error.internal ...) goes to the console
            const code = res && res.error ? res.error.code || res.error.message || "" : "";
            if (code) console.warn("[ui.js] feedback.report: " + code);
            tmToast(code === "error.conflict" ? "הדיווח לא נשלח: חלון אישור אחר פתוח" : "הדיווח לא נשלח, נסו שוב מאוחר יותר");
          }
        });
      }
      // ===== 1.0.1-K: custom tooltips (the user: "בריחוף על כפתורי המצפן צריך להיות הסבר מה הם עושים") =====
      // Any element with data-tip - or a title, moved into data-tip on the first hover so the browser's own tooltip does not double it
      // (the presentation's buttons, the burger) - shows its short Hebrew sentence after 350 ms of hover, above it (below it near the
      // top edge), inside the window. On touch a long press (500 ms without moving) shows it for 3 s, and the click that ends that long
      // press is swallowed (a long press asks "what is this?", it does not press).
      const tipEl = document.createElement("div");
      tipEl.id = "tm-tip";
      tipEl.setAttribute("role", "tooltip");
      document.body.appendChild(tipEl);
      const tip = (el, text) => {
        if (!el || !text || typeof el.setAttribute !== "function") return el;
        try {
          el.setAttribute("data-tip", String(text));
          if (el.removeAttribute) el.removeAttribute("title");
          if (String(el.textContent || "").trim().length <= 2) el.setAttribute("aria-label", String(text));   // an icon button
        } catch (_) {}
        return el;
      };
      {
        let tipFor = null, tipTimer = null, hideTimer = null, lpTimer = null, lp = null, swallow = null, swallowT = null;
        const tipTarget = (node) => {
          for (let n = node; n && n.nodeType === 1 && n !== document.body; n = n.parentNode) {
            if (n.hasAttribute && (n.hasAttribute("data-tip") || n.hasAttribute("title"))) return n;
          }
          return null;
        };
        const textOf = (el) => {
          let t = el.getAttribute("data-tip");
          if (!t) {
            const ti = el.getAttribute("title");
            if (ti) {
              el.setAttribute("data-tip", ti);
              el.removeAttribute("title");
              t = ti;
            }
          }
          return t;
        };
        const hideTip = () => {
          clearTimeout(tipTimer);
          clearTimeout(hideTimer);
          tipTimer = hideTimer = null;
          tipEl.style.display = "none";
          tipFor = null;
        };
        const showTip = (el) => {
          const text = el && el.isConnected !== false ? textOf(el) : null;
          if (!text) return;
          ui_fillSrc(tipEl, text);
          tipEl.style.left = "0px";
          tipEl.style.top = "0px";
          tipEl.style.display = "block";
          const r = el.getBoundingClientRect(), tw = tipEl.offsetWidth, th = tipEl.offsetHeight, W = window.innerWidth, H = window.innerHeight;
          const x = Math.max(6, Math.min(W - tw - 6, r.left + r.width / 2 - tw / 2));
          let y = r.top - th - 8;
          if (y < 6) y = Math.min(H - th - 6, r.bottom + 8);
          tipEl.style.left = x.toFixed(0) + "px";
          tipEl.style.top = y.toFixed(0) + "px";
          tipFor = el;
        };
        document.addEventListener("pointerover", (e) => {
          if (e.pointerType === "touch") return;
          const el = tipTarget(e.target);
          if (el === tipFor && el) return;
          hideTip();
          if (!el || !textOf(el)) return;
          tipTimer = setTimeout(() => showTip(el), 350);
        }, true);
        document.addEventListener("pointerout", (e) => {
          if (e.pointerType === "touch") return;
          const el = tipTarget(e.target);
          if (!el) return;
          const to = e.relatedTarget;
          if (to && el.contains && el.contains(to)) return;
          hideTip();
        }, true);
        document.addEventListener("pointerdown", (e) => {
          clearTimeout(lpTimer);
          lp = null;
          // 1.0.1-K review (ui-5): a new press disarms the swallow of an earlier long press - Chromium ends a long touch with a
          // contextmenu / long-tap and NO click, and the flag then ate the user's next real tap on that button
          swallow = null;
          clearTimeout(swallowT);
          if (e.pointerType !== "touch") {
            hideTip();
            return;
          }
          const el = tipTarget(e.target);
          if (!el) return;
          lp = { x: e.clientX, y: e.clientY };
          lpTimer = setTimeout(() => {
            lp = null;
            showTip(el);
            swallow = el;
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hideTip, 3000);
          }, 500);
        }, true);
        document.addEventListener("pointermove", (e) => {
          if (lp && e.pointerType === "touch" && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10) {
            clearTimeout(lpTimer);
            lp = null;
          }
        }, true);
        for (const ev of ["pointerup", "pointercancel"]) {
          document.addEventListener(ev, (e) => {
            if (e.pointerType === "touch") {
              clearTimeout(lpTimer);
              lp = null;
              // the click that ends a long press comes right after its pointerup; if none comes, the swallow ends 400 ms later
              // (1.0.1-K review, ui-5; 400 ms = model choice)
              if (swallow) {
                clearTimeout(swallowT);
                swallowT = setTimeout(() => { swallow = null; }, 400);
              }
            }
          }, true);
        }
        document.addEventListener("click", (e) => {
          const s = swallow;
          swallow = null;
          if (s && s.contains && s.contains(e.target)) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
        window.addEventListener("blur", hideTip);
        document.addEventListener("scroll", hideTip, true);
        tip(burger, "הצג או הסתר את לוח הבקרה (המבטים, המקומות, השיטות והמקורות)");
      }
      // ===== camera steps (the nav buttons, the arrow keys, the compass) =====
      // 1.0.1-L (L.49, the user: "מהירות הסיבוב במודל 360 הוא מהיר מדי כברירת מחדל - האט אותו, וסיבוב איטי השאר כך"): the turn step 0.045 -> 0.025 rad,
      // the tilt step 0.035 -> 0.02 rad and the hold's repeat of the two turn buttons 40 -> 50 ms: 64 -> 29 degrees a second while held (a drag:
      // rotateSpeed 0.9 -> 0.5, 90-entry.js); "סיבוב איטי" (autoRotateSpeed 0.4) is unchanged
      // 1.0.1-L (Part 7, U1): indoors (ctx.camIndoors, 90-entry.js) the buttons and the keys turn the view round the camera's own place, as the drag does
      const orbitBy = (dir) => {
        ctx.camFlyStop && ctx.camFlyStop();   // CAM_219 (2): a nav button or key in a flight ends it, and acts at once
        const cam = ctx.camera, tg = ctx.controls.target;
        if (ctx.camIndoors && ctx.camIndoors()) {
          const dx = tg.x - cam.position.x, dz = tg.z - cam.position.z, a = dir * 0.025, c = Math.cos(a), s2 = Math.sin(a);
          tg.x = cam.position.x + dx * c + dz * s2;
          tg.z = cam.position.z - dx * s2 + dz * c;
          ctx.controls.update();
          return;
        }
        const ox = cam.position.x - tg.x, oz = cam.position.z - tg.z, a = dir * 0.025, c = Math.cos(a), s2 = Math.sin(a);
        cam.position.x = tg.x + ox * c + oz * s2;
        cam.position.z = tg.z - ox * s2 + oz * c;
        ctx.controls.update();
      };
      // 1.0.1-K: up / down - the camera rises or sinks around the target within the controls' polar limits
      const tiltBy = (dir) => {
        ctx.camFlyStop && ctx.camFlyStop();   // CAM_219 (2): a nav button or key in a flight ends it, and acts at once
        const cam = ctx.camera, c = ctx.controls, tg = c.target;
        const off = cam.position.clone().sub(tg);
        if (!(off.length() > 0)) return;
        const sph = new Spherical().setFromVector3(off);
        if (ctx.camIndoors && ctx.camIndoors()) {   // 1.0.1-L (Part 7, U1): the head turns up and down, the camera stays
          sph.phi = Math.max(0.06, Math.min(Math.PI - 0.06, sph.phi - dir * 0.02));
          off.setFromSpherical(sph);
          c.maxPolarAngle = Math.max(c.maxPolarAngle, sph.phi + 1e-4);
          tg.copy(cam.position).sub(off);
          c.update();
          return;
        }
        sph.phi = Math.max(c.minPolarAngle || 0.06, Math.min(c.maxPolarAngle || Math.PI * 0.495, sph.phi - dir * 0.02));
        off.setFromSpherical(sph);
        cam.position.copy(tg).add(off);
        c.update();
      };
      const zoomBy = (f) => {
        // WALK_FLOOR_A2 (fix-a2): in walk mode + / − walk forward and back, climbing and descending with the floors (90-entry.js); until
        // now they moved the eye level toward the view's target, into the steps
        const wmz = ctx.shared && ctx.shared.walkMode;
        if (wmz && wmz.on && typeof wmz.nudge === "function") { wmz.nudge(f < 1 ? 1 : -1); return; }
        ctx.camFlyStop && ctx.camFlyStop();   // CAM_219 (2): a nav button or key in a flight ends it, and acts at once
        const cam = ctx.camera, tg = ctx.controls.target;
        const off = cam.position.clone().sub(tg);
        off.setLength(Math.min(ctx.controls.maxDistance || 2200, Math.max(ctx.controls.minDistance || 2, off.length() * f)));
        cam.position.copy(tg).add(off);
        ctx.controls.update();
      };
      // 1.0.1-K: turn the view to a heading (the compass letters). az = atan2(camera - target) in x / z: 0 = the camera south of the
      // target, looking north (north up on the compass); -PI/2 looking east, PI looking south, PI/2 looking west. Eased over 0.65 s;
      // a drag on the model stops it.
      let turnAnim = null;
      const turnTo = (azT) => {
        ctx.camFlyStop && ctx.camFlyStop();   // CAM_219 (2): a nav button or key in a flight ends it, and acts at once
        const cam = ctx.camera, tg = ctx.controls.target;
        const az0 = Math.atan2(cam.position.x - tg.x, cam.position.z - tg.z);
        let d = azT - az0;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        turnAnim = Math.abs(d) < 1e-3 ? null : { t0: performance.now(), dur: 650, az0, d, look: !!(ctx.camIndoors && ctx.camIndoors()) };
      };
      ctx.renderer.domElement.addEventListener("pointerdown", () => { turnAnim = null; });
      ctx.animated.push(function() {
        if (!turnAnim) return;
        if (ctx.camFlying && ctx.camFlying()) { turnAnim = null; return; }   // CAM_219 (2): a flight that began in the turn takes the view (the turn bent it, then it snapped)
        const cam = ctx.camera, tg = ctx.controls.target;
        const k = Math.min(1, (performance.now() - turnAnim.t0) / turnAnim.dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const az = turnAnim.az0 + turnAnim.d * e, rh = Math.hypot(cam.position.x - tg.x, cam.position.z - tg.z);
        if (turnAnim.look) {   // 1.0.1-L (Part 7, U1)
          tg.x = cam.position.x - Math.sin(az) * rh;
          tg.z = cam.position.z - Math.cos(az) * rh;
        } else {
          cam.position.x = tg.x + Math.sin(az) * rh;
          cam.position.z = tg.z + Math.cos(az) * rh;
        }
        cam.lookAt(tg);
        if (k >= 1) turnAnim = null;
      });
      // ===== compass (1.0.1-K: four letters; a click on a letter turns the view toward it) =====
      const compass = document.createElement("div");
      compass.id = "tm-compass";
      tip(compass, "מצפן: החץ האדום והאות צ׳ מראים לאן הצפון במבט הנוכחי. לחיצה על אות מפנה את המבט לכיוון שלה.");
      const rotor = document.createElement("div");
      rotor.id = "tm-rotor";
      const arrow = document.createElement("div");
      arrow.className = "a";
      arrow.textContent = "▲";
      rotor.appendChild(arrow);
      const DIRS = [
        // [letter, name, x, y in the 56 px rotor, the heading to turn to]
        ["צ", "צפון", 28, 9, 0],
        ["מז", "מזרח", 47, 28, -Math.PI / 2],
        ["ד", "דרום", 28, 47, Math.PI],
        ["מע", "מערב", 9, 28, Math.PI / 2]
      ];
      const dirEls = [];
      for (const [letter, name, x, y, az] of DIRS) {
        const d = document.createElement("div");
        d.className = "d" + (letter === "צ" ? " n" : "");
        d.textContent = letter;
        d.style.left = x + "px";
        d.style.top = y + "px";
        d.setAttribute("role", "button");
        tip(d, name + " — לחץ כדי להפנות את המבט " + (name === "צפון" ? "צפונה" : name === "דרום" ? "דרומה" : name === "מזרח" ? "מזרחה (אל פתח הבית)" : "מערבה (אל קודש הקדשים)") + "; הסיבוב סביב מרכז המבט, בלי לשנות את הגובה והמרחק.");
        d.addEventListener("click", (e) => {
          e.stopPropagation();
          turnTo(az);
        });
        rotor.appendChild(d);
        dirEls.push(d);
      }
      compass.appendChild(rotor);
      document.body.appendChild(compass);
      // ===== nav buttons =====
      const nav = document.createElement("div");
      nav.id = "tm-nav";
      let resetAllBtn = null;
      {
        const mk = (txt, ttl, fn, rep) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = txt;
          tip(b, ttl);
          let iv = null;
          const stop = () => {
            if (iv) {
              clearInterval(iv);
              iv = null;
            }
          };
          b.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            stop();
            fn();
            iv = setInterval(fn, rep || 40);
          });
          for (const ev of ["pointerup", "pointerleave", "pointercancel"]) b.addEventListener(ev, stop);
          nav.appendChild(b);
          return b;
        };
        mk("⟲", "סובב את המבט שמאלה סביב מרכזו (החזק להמשך). גם: מקש חץ שמאלה, או גרירה במודל.", () => orbitBy(-1), 50);
        mk("⟳", "סובב את המבט ימינה סביב מרכזו (החזק להמשך). גם: מקש חץ ימינה, או גרירה במודל.", () => orbitBy(1), 50);
        mk("+", "קרב את המבט (החזק להמשך). גם: גלגלת העכבר, צביטה או גלילה בשתי אצבעות על משטח המגע, ומקש +.", () => zoomBy(0.97));
        mk("−", "הרחק את המבט (החזק להמשך). גם: גלגלת העכבר, צביטה או גלילה בשתי אצבעות על משטח המגע, ומקש −.", () => zoomBy(1.03));
        const sp = document.createElement("span");
        sp.className = "sp";
        nav.appendChild(sp);
        const rb = document.createElement("button");
        rb.type = "button";
        rb.id = "tm-nav-ruler";
        rb.textContent = "📏";
        tip(rb, "מדידה באמות: לחץ על שתי נקודות במודל, והמרחק ביניהן יוצג (גם האופקי והגובה). לחיצה נוספת על הכפתור מסיימת.");
        rb.addEventListener("click", () => mSet(!mOn));
        nav.appendChild(rb);
        //@@slot buildUI.after-rb-note
        {
          //@@slot buildUI.after-rb-note-2
          const pillsFrame = () => { try { const f = ctx.shared.__pillsFrame; if (typeof f === "function") f(true); } catch (_) {} };
          const wb = document.createElement("button");
          wb.type = "button";
          wb.id = "tm-nav-walk";
          wb.textContent = "🚶";
          tip(wb, "מצב הליכה: העין יורדת לגובה אדם ומביטה קדימה; העכבר לבדו מסובב את המבט (הלחיצה על הכפתור נועלת את העכבר למודל, Esc משחררת — ואז גרירה מסובבת), והמקשים W S A D (או ו ד ש ג, או החצים) הולכים ונעים הצידה. לחיצה נוספת — יציאה ממצב הליכה.");
          wb.addEventListener("click", () => { const w = ctx.shared.walkMode; if (!w) return; w.set(!w.on); wb.classList.toggle("on", !!w.on); pillsFrame(); });
          nav.appendChild(wb);
          const sg = document.createElement("span");
          sg.className = "tm-grp tm-sec";
          tip(sg, "חתך חי: מישור חיתוך שעובר במודל — כל מה שמדרום לו (בציר צפון–דרום) או ממזרח לו (בציר מזרח–מערב) נחתך, ורואים את הפנים כמו בחתך אדריכלי. המישור מתחיל במקום שאליו מביטים; הגרירה מזיזה אותו (80 אמה לכל צד), הכפתור מחליף ציר, ״חתך״ מפעיל ומכבה. פני החתך אינם ממולאים — בחירת מודל.");
          const sb = document.createElement("button");
          sb.type = "button";
          sb.className = "tm-txt";
          sb.textContent = "חתך";
          const sr = document.createElement("input");
          sr.type = "range";
          sr.min = "-80"; sr.max = "80"; sr.step = "0.5"; sr.value = "0";
          sr.className = "tm-range";
          const ax = document.createElement("button");
          ax.type = "button";
          ax.className = "tm-txt";
          const HALF = 80;
          // 1.3.4 (from the Second Temple plugin; the user: "כל סעיף 3 לעשות"): a third axis, the height - a plan, everything above the slider cut
          const center = (axis) => { const t = ctx.controls && ctx.controls.target; const c = t ? (axis === "x" ? t.x : axis === "y" ? t.y + 6 : t.z) : 0; return Math.round(c * 2) / 2; };
          const span = (c, axis) => { if (axis === "y") { sr.min = "-10"; sr.max = "150"; } else { sr.min = String(c - HALF); sr.max = String(c + HALF); } sr.value = String(c); };
          const paintSec = () => {
            const S = ctx.shared.section || {};
            sb.classList.toggle("on", !!S.on);
            sr.disabled = !S.on;
            ax.textContent = S.axis === "x" ? "מזרח–מערב" : S.axis === "y" ? "גובה" : "צפון–דרום";
            wb.classList.toggle("on", !!(ctx.shared.walkMode || {}).on);
          };
          sb.addEventListener("click", () => {
            const S = ctx.shared.section;
            if (!S) return;
            if (!S.on) { const c = center(S.axis); span(c, S.axis); S.set(true, S.axis, c); } else S.set(false, S.axis, +sr.value);
            paintSec();
            pillsFrame();
          });
          sr.addEventListener("input", () => { const S = ctx.shared.section; if (!S || !S.on) return; S.set(true, S.axis, +sr.value); pillsFrame(); });
          ax.addEventListener("click", () => {
            const S = ctx.shared.section;
            if (!S) return;
            const axis = S.axis === "z" ? "x" : S.axis === "x" ? "y" : "z", c = center(axis);   // 1.3.4: south -> east -> height
            span(c, axis);
            S.set(S.on, axis, c);
            paintSec();
            pillsFrame();
          });
          sg.appendChild(sb);
          sg.appendChild(sr);
          sg.appendChild(ax);
          nav.appendChild(sg);
          paintSec();
          // UI_UNIFY_A2 (the user's decision 55/13): the live section of both houses - the First Temple's (its slider 80 amot each side of the
          // point looked at, re-centred when it is switched on or its axis changes; the height -10 .. 150); a row of the opinions table or a
          // place may turn it on at a value of its own (the Second Temple's 1.9.0 - sectionPaint): the slider is centred on that value
          ctx.shared.sectionPaint = () => { const S = ctx.shared.section || {}; if (Number.isFinite(S.v)) span(S.v, S.axis); paintSec(); pillsFrame(); };
          ctx.shared.navRepaint = paintSec;   // "↺ החזר הכל" and the engine repaint the box
        }
        // 1.0.1-K (Yossi): the wall fade - on / off, and its distance
        const fs = ctx.shared.fadeState;
        const fadeBtn = document.createElement("button");
        fadeBtn.type = "button";
        fadeBtn.id = "tm-fade-toggle";
        fadeBtn.className = "tm-txt";
        // 1.0.2 (D): three states from the same button - "פועל" (the court and mount walls, as before; the default), "גם קיר מסתיר" (also a
        // wall of the house, the ulam, the chambers or the palace that hides what is looked at), "כבוי"; a click goes on to the next
        tip(fadeBtn, "טשטוש חומות: כשחומה עומדת בין המצלמה לבין מה שמביטים בו, היא נעשית שקופה למחצה — ונשארת נראית. לחיצה נוספת: גם קיר מסתיר — גם קיר של הבית, האולם, התאים או הארמון שמסתיר את מה שמביטים בו נעשה שקוף, וחוזר כשאינו מסתיר עוד. לחיצה נוספת: כבוי — החומות חוסמות את המבט כמו במציאות.");
        const grp = document.createElement("span");
        grp.className = "tm-grp";
        // 1.0.1-K review (ui-3): the far setting fades only walls that hide what is looked at (not those behind it) - the text says so
        tip(grp, "מרחק טשטוש: חומה שמסתירה את מה שמביטים בו מיטשטשת רק כשהיא בטווח הזה מן המצלמה (באמות). פחות — רק חומות קרובות; יותר — גם חומות רחוקות.");
        const cap = document.createElement("span");
        cap.className = "cap";
        cap.textContent = "מרחק טשטוש";
        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        tip(minus, "הקטן את מרחק הטשטוש: רק חומות קרובות יותר יהיו שקופות");
        const val = document.createElement("span");
        val.className = "v";
        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        tip(plus, "הגדל את מרחק הטשטוש: גם חומות רחוקות יותר יהיו שקופות כשהן מסתירות");
        grp.appendChild(cap);
        grp.appendChild(plus);
        grp.appendChild(val);
        grp.appendChild(minus);
        const paintFade = () => {
          fadeBtn.textContent = fs.on && fs.hide ? "טשטוש: גם קיר מסתיר" : "טשטוש חומות: " + (fs.on ? "פועל" : "כבוי");
          fadeBtn.classList.toggle("on", !!fs.on);
          val.textContent = fs.dist + " אמה";
          grp.classList.toggle("off", !fs.on);
          minus.disabled = fs.dist <= UI_FADE_STOPS[0];
          plus.disabled = fs.dist >= UI_FADE_STOPS[UI_FADE_STOPS.length - 1];
        };
        const stepDist = (dir) => {
          let i = UI_FADE_STOPS.indexOf(fs.dist);
          if (i < 0) i = UI_FADE_STOPS.findIndex((v) => v >= fs.dist);
          if (i < 0) i = UI_FADE_STOPS.length - 1;
          fs.dist = UI_FADE_STOPS[Math.max(0, Math.min(UI_FADE_STOPS.length - 1, i + dir))];
          //@@slot stepDist
          paintFade();
        };
        fadeBtn.addEventListener("click", () => {
          // פועל -> גם קיר מסתיר -> כבוי -> פועל
          if (fs.on && !fs.hide) fs.hide = true;
          else if (fs.on) { fs.on = false; fs.hide = false; }
          else fs.on = true;
          //@@slot buildUI.after-i
          paintFade();
        });
        minus.addEventListener("click", () => stepDist(-1));
        plus.addEventListener("click", () => stepDist(1));
        paintFade();
        nav.appendChild(fadeBtn);
        nav.appendChild(grp);
        ctx.shared.fadeState.repaint = paintFade;
        // "↺ החזר הכל" - while anything of the on-model buttons is on (see the registry below)
        resetAllBtn = document.createElement("button");
        resetAllBtn.type = "button";
        resetAllBtn.id = "tm-reset-all";
        resetAllBtn.className = "tm-txt";
        resetAllBtn.textContent = "↺ החזר הכל";
        tip(resetAllBtn, "מחזיר את המודל למצבו הרגיל: סוגר את כל מה שנפתח או הוסר בכפתורים שעל המודל (הבית, קירות היציע, האולם, הנסרים, החתך והתצוגות שעל המודל) ומחזיר את הענן.");
        nav.appendChild(resetAllBtn);
        document.body.appendChild(nav);
      }
      if (ctx.camera && ctx.controls && ctx.controls.target) {
        let lastAz = null;
        ctx.animated.push(function() {
          const az = Math.atan2(
            ctx.camera.position.x - ctx.controls.target.x,
            ctx.camera.position.z - ctx.controls.target.z
          );
          // az = the clockwise screen angle of north (+z = south: the camera due south of the target gives 0deg and the "▲" points
          // straight up); the Second Temple's "+ 180" (ref-ui-bayit2.js) turned the needle to the south in this coordinate frame.
          // 1.0.1-K: the letters turn with the rotor and are turned back so they stay upright
          const deg = (az * 180 / Math.PI).toFixed(1);
          if (deg === lastAz) return;
          lastAz = deg;
          rotor.style.transform = "rotate(" + deg + "deg)";
          for (const d of dirEls) d.style.transform = "rotate(" + (-deg) + "deg)";
        });
      }
      // ===== 1.0.1-K: on-model buttons (FIXES-1.0.1-K.md 0.5b; the user: "הכפתור צריך להיות על המיצג ולא בתוכן הענינים") =====
      // Registry ctx.shared.modelButtons: { id, label, labelOn, title, anchor: [x,y,z] | () => [x,y,z] | null, maxDist (150), get, set,
      // layer? | layers? }. A pill is drawn per entry at the projected anchor while the anchor is given (a function may return null =
      // not now), in front of the camera, inside the view, closer than maxDist and its layer(s) visible; it reads labelOn while get() is
      // true and calls set(!get()) on a click; title is its tooltip. Build modules register their own entries (before or after the UI);
      // the UI registers the cloud and the four removals. Overlapping pills are pushed apart vertically. Internal extras (the UI's own
      // entries only): show() - an extra condition, scale() - a size factor.
      const MB = Array.isArray(ctx.shared.modelButtons) ? ctx.shared.modelButtons : (ctx.shared.modelButtons = []);
      {
        const visUp = (o) => {
          for (; o; o = o.parent) if (o.visible === false) return false;
          return true;
        };
        const hwTop = Array.isArray(CO.HOUSE_WALL) && CO.HOUSE_WALL.length ? CO.HOUSE_WALL[CO.HOUSE_WALL.length - 1] : 4;   // the house wall above the chambers' roof
        const HW2 = (typeof CO.HOUSE_W === "number" ? CO.HOUSE_W : 20) / 2;                                                   // the house's inner half width (I Kings 6:2)
        const midX = typeof CO.xKodeshE === "number" && typeof CO.xKodeshW === "number" ? (CO.xKodeshE + CO.xKodeshW) / 2 : -23.5;   // mid-kodesh
        const zYS = typeof CO.zHouseS === "number" ? CO.zHouseS : 27;                                                          // the chambers' south outer face
        const xYW = typeof CO.xHeiW === "number" ? CO.xHeiW : -80.5;                                                            // the chambers' west outer face
        const frT = fps.forestRoof && Array.isArray(fps.forestRoof.target) ? fps.forestRoof.target : [103, 21, 509.5];
        // fallback anchors, used only while ctx.shared.anchors (50-heichal.js / 60-palace.js) lacks the point - on the visible outside
        const ANCH_FB = {
          houseSouth: [midX, LVL.HEI + 26, HW2 + hwTop + 0.5],   // the house's south face above the chambers' roof (y 38)
          yatziaSouth: [midX, LVL.HEI + 7.5, zYS + 0.5],          // the chambers' south outer wall, at its middle storey
          ulamFront: [(typeof CO.xUlamE === "number" ? CO.xUlamE : 18.5) + 0.5, LVL.HEI + 26.5, 0],   // the ulam front above its doorway (1.0.1-L, L.59: 22 high, its lintel to 35; 50-heichal.js anchors.ulamFront y 38.5)
          forestRoof: [frT[0], frT[1] + 2, frT[2]]               // the roof of בית יער הלבנון
        };
        const anchorPt = (name) => {
          const a0 = ctx.shared.anchors && ctx.shared.anchors[name];
          let a = a0;
          try { if (typeof a0 === "function") a = a0(); } catch (_) { a = null; }
          if (Array.isArray(a) && a.length >= 3 && isFinite(a[0] + a[1] + a[2])) return a;
          if (a && typeof a.x === "number" && isFinite(a.x + a.y + a.z)) return [a.x, a.y, a.z];
          return ANCH_FB[name];
        };
        const camP = () => ctx.camera.position;
        const yatziaPts = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];   // the chambers' south / north / west faces
        const has = (list) => cutList(list).length > 0;
        const reg = (b) => {
          if (!MB.some((x) => x && x.id === b.id)) MB.push(b);
        };
        // the cloud (1.0.19's button, now one of the pills; the removal asks first, as before)
        reg({
          id: "ui-cloud", label: "☁ הסר ענן", labelOn: "☁ החזר את הענן", removal: true,
          //@@slot buildUI.after-reg
          anchor: [KKC.x, KKC.y, KKC.z], maxDist: 1e9, occlude: false,   // the cloud has its own ray test (cloudSeen)
          get: () => !cloudOn,
          set: (on) => { if (on) askRemoveCloud(() => setCloud(false)); else setCloud(true); },
          show: () => cloudSeen.show, scale: () => cloudSeen.scale,
          scope: (c) => !c || /הר הבית|עיר דוד/.test(c.group + " " + c.title)   // PILL_SCOPE_N8: not over the court, the house or the cells
        });
        // the house: its south wall, its roof and the interior pieces on that side (ctx.cutaway) - seen from the south or from above
        if (has(ctx.cutaway)) reg({
          //@@slot buildUI.after-reg-2
          anchor: () => {
            const a = anchorPt("houseSouth"), c = camP();
            //@@slot anchor
            return c.z > a[2] - 1 || c.y > a[1] + 12 ? a : null;
          },
          get: () => cutOn, set: (on) => setCutaway(on)
        });
        // the chambers' outer walls, all three sides (ctx.yatziaCut): the pill sits on the side the camera looks at
        if (has(ctx.yatziaCut)) reg({
          id: "ui-yatzia", label: "הסר את קירות היציע", labelOn: "החזר את קירות היציע", removal: true, maxDist: 200,
          //@@slot title
            p[1] = a[1];
            p[2] = side === 0 ? zf : side === 1 ? -zf : 0;
            return p;
          },
          get: () => yatziaOpen, set: (on) => setYatziaCut(on)
        });
        // the ulam: its front wall with the doorway, and its roof (ctx.ulamCut) - seen from the east
        if (has(ctx.ulamCut)) reg({
          id: "ui-ulam", label: "פתח את האולם", labelOn: "סגור את האולם", removal: true, maxDist: 150,
          title: "מסיר את חזית האולם ואת גגו כדי לראות את יכין ובועז ואת פתח ההיכל. כלי צפייה בלבד — האולם סגור מלבד פתחו (מלכים א ו, ג; ז, כא).",
          anchor: () => {
            const a = anchorPt("ulamFront"), c = camP();
            return c.x > a[0] - 1 ? a : null;
          },
          get: () => ulamOpen, set: (on) => setUlamCut(on)
        });
        // the boards of the roofing of בית יער הלבנון (ctx.forestBoardsCut) - seen from above, with the palace layer on.
        // 1.0.1-K review (palace-courts-5): the tooltip follows the reading shown (a getter: the renderer reads b.title every frame and
        // re-sets the tip only when it changes; two constant strings, no allocation) - Rashi: without the 45 boards and the thin boards
        // the עבים, the small beams with their ledges and the upper storey are seen, his כרותות stay under the upper floor (60-palace.js
        // y 0..1, the floor 1..1.5); the second reading: without the boards and the stone roof, the כרותות on the pillars
        const BOARDS_TIP = {
          rashi: "מסיר את 45 נסרי הסיפון ואת הנסרים הדקים (מלכים א ז, ג–ד) — ונראים המרישין הקטנים ושקופיהם (רש״י ז, ד) והקומה העליונה; הכרותות שמעמוד לעמוד (רש״י ז, ב) נשארות מתחת לרצפתה. כלי צפייה בלבד.",
          metzudot: "מסיר את 45 הלוחות ואת גג האבן — ונראות הכרותות שעל העמודים: 'והם כרותות הארזים אשר על העמודים שהיו ארבעים וחמשה' (רלב״ג ז, ג). כלי צפייה בלבד.",
          // 1.0.1-L (L.20; verify-palace Follow-ups §2): the third reading
          mzd: "מסיר את 45 לוחות הארז של התקרה — ונראות הצלעות שמטור לטור והכרותות שעל העמודים: 'השכיבו צלעות ונסרים, להיות מחיצות הבית ממעל, ועל הצלעות ההם הניחו לוחות ארז, להיות לתקרה' (מצודת דוד ז, ג). כלי צפייה בלבד."
        };
        if (has(ctx.forestBoardsCut)) reg({
          id: "ui-boards", label: "הסר את הנסרים", labelOn: "החזר את הנסרים", removal: true, maxDist: 150, layer: "palace",
          get title() { return BOARDS_TIP[fhCur()] || BOARDS_TIP.rashi; },
          anchor: () => {
            const a = anchorPt("forestRoof"), c = camP();
            return c.y > a[1] - 2 ? a : null;
          },
          get: () => boardsOff, set: (on) => setBoardsOff(on)
        });
        // 1.0.1-L (L.90, the user: "כל פעם שיש הסרת תצוגה זה אמור להוביל לכך שהמסך יראה את התצוגה עצמה, לדוג' הסרת קירוי המסך אמור לעבור למבט מלמעלה"):
        // a table by pill id: on switching on, the camera flies to a view that shows what was revealed; on switching off it returns to where it was.
        // Only a click on the pill itself does this (revealPress, from pillFor): the presentation calls b.set or the shared objects directly, so
        // it does not fly; a removal stays only by the pill. fp = a fly point; cam() = a camera of this table (each checked in a picture: model
        // choice); own: the module's set() already flies there; the flight back here replaces any flight of its own (the section's to heichalSouth).
        //@@slot buildUI.REVEAL
          "ui-cloud": { fp: "kodeshHakodashim" },
          //@@slot cam
        };
        const revealView = (id) => {
          const R = REVEAL[id];
          if (!R) return null;
          if (R.cam) return R.cam();
          return R.fp ? resolveFp(R.fp) : null;
        };
        const revealSaved = new Map();   // pill id -> the camera before it was switched on, in the order of switching
        //@@slot buildUI.ROOF_PILLS
        const roofTimers = new Map();
        const roofDisarm = (id) => { if (roofTimers.has(id)) { clearTimeout(roofTimers.get(id)); roofTimers.delete(id); } };
        const roofArm = (b) => {
          roofDisarm(b.id);
          if (!ROOF_PILLS.has(b.id)) return;
          roofTimers.set(b.id, setTimeout(() => {
            roofTimers.delete(b.id);
            if (!b.get()) return;
            try { revealPress(b, true); } catch (err) { console.warn("[ui.js] roof timer " + b.id + ":", err && err.message); }
            frame(true);
          }, 30000));
        };
        const revealGo = (id) => {
          const f = revealView(id);
          if (f) fly(f.pos, f.target);
        };
        const revealPress = (b, auto) => {
          const id = b.id, R = REVEAL[id];
          const pose = { pos: ctx.camera.position.toArray(), target: ctx.controls.target.toArray() };
          const was = !!b.get();
          // the cloud's removal asks first: the flight comes with the answer
          if (id === "ui-cloud" && !was) {
            askRemoveCloud(() => {
              setCloud(false);
              revealSaved.delete(id);
              revealSaved.set(id, pose);
              revealGo(id);
              frame(true);
            });
            return;
          }
          b.set(!was);
          if (!R) return;
          const now = !!b.get();
          if (now && !was) {
            revealSaved.delete(id);
            revealSaved.set(id, pose);
            if (!R.own) revealGo(id);
            roofArm(b);
          } else if (!now && was) {
            roofDisarm(id);
            const back = revealSaved.get(id);
            revealSaved.delete(id);
            // CAM_RESET_N8: the roof's own timer (30 s) puts the eye back where it was only if it is still where the roof's view left it - a
            // reader who has gone on to another card is not pulled back to the view of a minute ago
            let stay = false;
            if (auto && back) { try { const f = revealView(id); const near = (a, b2, r) => Math.hypot(a[0] - b2[0], a[1] - b2[1], a[2] - b2[2]) < r; stay = !(f && near(ctx.camera.position.toArray(), f.pos, 40) && near(ctx.controls.target.toArray(), f.target, 40)); } catch (_) {} }
            if (back && !stay) realFly(back.pos, back.target);
          }
        };
        // the renderer
        const PILL_FEATURE = { "hei-yatzia-section": "yatziaSection", wallLayers: "wallLayers", incenseAltarLayers: "incenseAltar.layers", palaceThroneAscent: "throne.ascent" };   // 1.0.1-L (L.27)
        const pills = new Map();   // entry -> { el, text, on, disp, x, y, sc, w, h }
        const pv = new Vector3(), pc = new Vector3();
        const pillFor = (b) => {
          let st = pills.get(b);
          if (st) return st;
          const el = document.createElement("button");
          el.type = "button";
          el.className = "tm-pill";
          if (b.id === "ui-cloud") el.id = "tm-cloud-btn";
          else if (b.id) el.setAttribute("data-mb", String(b.id));
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            //@@slot pillFor-note
            if (!b.keepDemos && typeof ctx.shared.stopDemos === "function") ctx.shared.stopDemos(b.id);
            // 1.0.1-L (L.27): the feature's own pill cancels the place's 15-second timer; the user's state stays
            if (PILL_FEATURE[b.id]) autoOff.cancel(PILL_FEATURE[b.id]);
            try {
              revealPress(b);   // 1.0.1-L (L.90)
            } catch (err) {
              console.warn("[ui.js] model button " + b.id + ":", err && err.message);
            }
            frame(true);
          });
          document.body.appendChild(el);
          st = { el, text: null, on: null, disp: "none", x: -1, y: -1, sc: 1, w: 80, h: 24, tip: null, occ: null, occAt: 0 };
          pills.set(b, st);
          return st;
        };
        // a pill whose anchor is hidden behind a solid part of the model is not shown either (from the front, the ulam hides the house's
        // south face: no "פתח את הבית" floating on the ulam). A throttled ray test (every 6th frame per pill) against the large plain
        // meshes, as the cloud's; a faded (transparent) wall does not hide; a hit within 1.5 amot of the anchor does not count (an anchor
        // sits on its own face); an entry may opt out with occlude: false
        const oRay = new Raycaster(), oDir = new Vector3();
        let oTargets = null, oTargetsAt = -1e9, frameNo = 0;
        const bigMeshes = () => {
          const now = performance.now();
          if (oTargets && now - oTargetsAt < 4000) return oTargets;
          oTargetsAt = now;
          oTargets = [];
          const bb = new Box3(), sz = new Vector3();
          ctx.scene.traverse((o) => {
            if (!o.isMesh || o.isInstancedMesh || !o.geometry) return;
            for (let p = o; p; p = p.parent) if (p.name === "tm-kk-cloud" || p.name === "tm-measure") return;
            const pa = o.geometry.attributes && o.geometry.attributes.position;
            if (pa && pa.count > 30000) return;   // the terrain
            if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
            bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld).getSize(sz);
            if (Math.max(sz.x, sz.y, sz.z) < 6) return;
            oTargets.push(o);
          });
          return oTargets;
        };
        const occluded = (a, wallsToo) => {
          const cam = ctx.camera.position;
          oDir.set(a[0] - cam.x, a[1] - cam.y, a[2] - cam.z);
          const L = oDir.length();
          if (!(L > 2)) return false;
          oRay.set(cam, oDir.multiplyScalar(1 / L));
          oRay.near = 0;
          oRay.far = L - 1.5;
          for (const hh of ctx.raycast(oRay, bigMeshes())) {
            const o = hh.object;
            if (!visUp(o)) continue;
            const m = Array.isArray(o.material) ? o.material[0] : o.material;
            // PILL_HOME_211: a wall that the fade shows see-through still hides the pill behind it (the user: the ulam's and the cloud's
            // pills "יצאו החוצה סתם" in the view of the Nikanor gate) - unless the pill is switched on (wallsToo = false: it must stay
            // within reach, to be switched off); glass and water never hid a pill
            if (m && m.visible !== false && m.transparent && m.opacity <= 0.5 && wallsToo && (o.userData.fade || o.userData.tmPass)) return true;
            if (m && (m.visible === false || (m.transparent && m.opacity <= 0.5))) continue;
            return true;
          }
          return false;
        };
        // PILL_SCOPE_N8: a demonstration (ctx.shared.demoStops, the walk too) or the presentation is running; read every 6 frames
        let busyAt = -1e9, busyVal = false;
        const sceneBusy = () => {
          if (frameNo - busyAt < 6) return busyVal;
          busyAt = frameNo; busyVal = false;
          try { busyVal = (ctx.shared.demoStops || []).some((d) => { try { return !!(d && typeof d.running === "function" && d.running()); } catch (_) { return false; } }); } catch (_) {}
          if (!busyVal) { try { const T = ctx.shared.tour; busyVal = !!(T && typeof T.state === "function" && T.state().running); } catch (_) {} }
          return busyVal;
        };
        const layerVis = (l) => {
          const g = ctx.layers && ctx.layers[l];
          return !!g && visUp(g);
        };
        const scr = [0, 0];   // the screen point of place() (reused)
        const place = (b, st, force) => {
          if (!b || typeof b.get !== "function" || typeof b.set !== "function") return null;
          if (b.layer && !layerVis(b.layer)) return null;
          if (Array.isArray(b.layers)) for (const l of b.layers) if (!layerVis(l)) return null;
          if (typeof b.show === "function" && !b.show()) return null;
          // PILL_SCOPE_N8: the removal / opening pills are not drawn over a demonstration or the presentation (the demonstration bar and its
          // own buttons are there to stop it), and a pill with a scope() only while the place that it belongs to is the one pressed
          if (b.removal && sceneBusy()) return null;
          if (typeof b.scope === "function" && !(b.get && b.get())) { let ok = false; try { ok = !!b.scope(uiPlaceCtx); } catch (_) {} if (!ok) return null; }
          let a = b.anchor;
          if (typeof a === "function") a = a();
          if (!Array.isArray(a) || a.length < 3 || !isFinite(a[0] + a[1] + a[2])) return null;
          //@@slot place
          const cam = ctx.camera;
          // PILL_HOME_211 (the user's picture of "לשכת הכלים": the great gate's pill hung in the air over a section that had cut the
          // gate away): a pill whose place is in the half that the live section removes is not shown
          try {
            const SC = ctx.shared.section;
            if (SC && SC.on && typeof SC.v === "number") { const ai = SC.axis === "x" ? 0 : SC.axis === "y" ? 1 : 2; if (a[ai] > SC.v) return null; }
          } catch (_) {}
          pv.set(a[0], a[1], a[2]);
          if (pv.distanceTo(cam.position) > (typeof b.maxDist === "number" ? b.maxDist : 150)) return null;
          pc.copy(pv).applyMatrix4(cam.matrixWorldInverse);
          if (pc.z > -0.5) return null;                       // behind the camera
          pv.project(cam);
          if (Math.abs(pv.x) > 0.96 || Math.abs(pv.y) > 0.94) return null;   // outside the view
          if (b.occlude !== false) {
            if (force || st.occ == null || frameNo - st.occAt >= 6) {
              let isOn = false;
              try { isOn = !!b.get(); } catch (_) { isOn = false; }
              st.occ = occluded(a, !isOn);   // PILL_HOME_211
              st.occAt = frameNo;
            }
            if (st.occ) return null;
          }
          scr[0] = (pv.x * 0.5 + 0.5) * window.innerWidth;
          scr[1] = (-pv.y * 0.5 + 0.5) * window.innerHeight;
          return scr;
        };
        const resetAll = () => {
          autoOff.flush();   // 1.0.1-L (L.27): what a place switched on goes back now (the tables of the ulam have no pill), and no timer stays
          try { placeLeave({}); } catch (_) {}   // VIEW_LEAVE_211: and the place's own layer or untimed feature
          uiPlaceCtx = null;   // PILL_SCOPE_N8
          for (const b of MB.slice()) {
            try {
              if (b && typeof b.get === "function" && typeof b.set === "function" && b.get()) b.set(false);
            } catch (_) {}
          }
          revealSaved.clear();   // 1.0.1-L (L.90)
          frame(true);
        };
        // 1.0.1-L (L.90): the button of the panel returns to where the first of them was switched on; ctx.ui.resetAll (the presentation) does not fly
        resetAllBtn.addEventListener("click", () => {
          const first = revealSaved.values().next().value;
          resetAll();
          //@@slot buildUI.after-first
            const S = ctx.shared.section, w = ctx.shared.walkMode;
            if (S && S.on) S.set(false, S.axis, S.v);
            if (w && w.on) w.set(false);
            //@@slot buildUI.after-S
          } catch (_) {}
          if (first) realFly(first.pos, first.target);
        });
        // PILL_FREE_210 (the outside review, 14.11.2026: a pill under the places' panel or under the floating card could not be pressed - 23
        // of 108 pills seen in בית ראשון, 8 of 34 in בית שני): a pill whose place falls under the panel (#tm-panel) or the card (#tm-xcard)
        // moves sideways, to the nearer free side of it (the side with room in the window); the two rectangles are read every 15 frames
        const freeRects = [];
        let freeAt = -1e9;
        const pillFreeX = (x, y, w, h) => {
          if (frameNo - freeAt > 15) {
            freeAt = frameNo;
            freeRects.length = 0;
            for (const id of ["tm-panel", "tm-xcard"]) {
              const e = document.getElementById(id);
              if (!e) continue;   // PILL_HOME_211: (the panel and the card are position: fixed - their offsetParent is always null, so this test used to skip them both and no pill was ever moved)
              const cs = getComputedStyle(e);
              if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
              const r = e.getBoundingClientRect();
              if (r.width > 20 && r.height > 20) freeRects.push({ l: r.left, r: r.right, t: r.top, b: r.bottom });
            }
          }
          for (let k = 0; k < 3; k++) {
            let moved = false;
            for (const R of freeRects) {
              if (x + w / 2 < R.l - 6 || x - w / 2 > R.r + 6 || y + h / 2 < R.t - 6 || y - h / 2 > R.b + 6) continue;
              const toL = R.l - w / 2 - 10, toR = R.r + w / 2 + 10, W = window.innerWidth;
              const okL = toL - w / 2 > 4, okR = toR + w / 2 < W - 4;
              if (!okL && !okR) return x;
              x = okL && (!okR || Math.abs(toL - x) <= Math.abs(toR - x)) ? toL : toR;
              moved = true;
            }
            if (!moved) break;
          }
          return x;
        };
        let anyOnShown = null;
        const rects = [];   // the screen rectangles of the pills placed in this frame (a pool, reused every frame)
        let topBarH = 56, topBarAt = -1e9, navR = null;
        // CARD_PILLS_211: the chips at the card's foot for the pills that the card hides (rebuilt only when the list changes)
        let cardPillsKey = "";
        const cardPills = (list) => {
          const card = document.getElementById("tm-xcard");
          const shown = !!card && card.style.display !== "none" && card.offsetParent !== undefined && getComputedStyle(card).display !== "none";
          const key = shown ? list.map((b) => b.id + ":" + (b.label || "")).join("|") : "";
          if (key === cardPillsKey) return;
          cardPillsKey = key;
          let host = card ? card.querySelector("#tm-card-pills") : null;
          if (!key) { if (host) host.style.display = "none"; return; }
          if (!host) { host = document.createElement("div"); host.id = "tm-card-pills"; host.style.cssText = "padding:4px 10px 8px;border-top:1px solid rgba(201,168,76,.25)"; card.appendChild(host); }
          host.innerHTML = "";
          host.style.display = "";
          const t = document.createElement("div");
          t.textContent = "כפתורים שעל המודל, שהכרטיס מסתיר:";
          t.style.cssText = "font-size:12px;opacity:.8;margin:2px 0 4px";
          host.appendChild(t);
          for (const b of list) {
            const bt = document.createElement("button");
            bt.type = "button";
            bt.className = "tm-more";
            bt.textContent = "▶ " + String(b.label || b.id || "");
            bt.onclick = (e) => { e.stopPropagation(); try { b.set(!b.get()); } catch (_) {} cardPillsKey = ""; };
            host.appendChild(bt);
          }
        };
        const frame = (force) => {
          const cam = ctx.camera;
          cam.updateMatrixWorld();
          frameNo++;
          if (frameNo - topBarAt > 30) {   // the bar's height (56 / 44 px by the width), measured now and then
            topBarAt = frameNo;
            try { const tb = document.getElementById("tm-topbar"); if (tb) topBarH = tb.offsetHeight || topBarH; } catch (_) {}
            // PILL_NAV_211 (the function review, F2-07): the navigation row's rectangle, measured with the bar
            try { const nv = document.getElementById("tm-nav"), r = nv && getComputedStyle(nv).display !== "none" ? nv.getBoundingClientRect() : null; navR = r && r.width > 20 ? { l: r.left, r: r.right, t: r.top } : null; } catch (_) { navR = null; }
          }
          let nPlaced = 0;
          const hidCard = [];   // CARD_PILLS_211: the pills hidden under the card or the panel in this frame
          let anyOn = false;
          for (const b of MB) {
            if (!b || typeof b.get !== "function") continue;
            let on = false;
            try { on = !!b.get(); } catch (_) {}
            if (on) anyOn = true;
            const st = pillFor(b);
            let p = null;
            try { p = place(b, st, force); } catch (_) { p = null; }
            const text = String((on ? b.labelOn || b.label : b.label) || b.id || "");
            if (st.text !== text) {
              st.text = text;
              ui_fillSrc(st.el, text);
              st.w = 0;
            }
            const t = b.title ? String(b.title) : "";
            if (st.tip !== t) {
              st.tip = t;
              if (t) tip(st.el, t);
            }
            if (st.on !== on) {
              st.on = on;
              st.el.classList.toggle("on", on);
            }
            if (!p) {
              if (st.disp !== "none") {
                st.disp = "none";
                st.el.style.display = "none";
              }
              continue;
            }
            if (st.disp !== "block") {
              st.disp = "block";
              st.el.style.display = "block";
            }
            if (!st.w) {
              st.w = st.el.offsetWidth || 8 * text.length + 24;   // measured once per text
              st.h = st.el.offsetHeight || 24;
            }
            const sc = typeof b.scale === "function" ? Math.max(0.5, Math.min(2, +b.scale() || 1)) : 1;
            const w = st.w * sc, h = st.h * sc;
            let x = p[0];
            let y = p[1];
            x = pillFreeX(x, y, w, h);   // PILL_FREE_210
            x = Math.max(w / 2 + 6, Math.min(window.innerWidth - w / 2 - 6, x));   // PANEL_FIT_N8: a pill at the window's edge is whole, not cut
            // PILL_HOME_211 (the user, 15.11.2026: "כל כפתורי הפתיחה, כגון הסר ענן, פתח את האולם, יצאו החוצה סתם" - a pill moved from under
            // the card floated beside it, over a part of the model that is not its own): a pill whose own place is under the card or the
            // panel is NOT shown (folding the card or turning the view brings it back at its place). One that is switched on still moves
            // aside, so that it can be switched off.
            if (x !== p[0] && !on) {
              hidCard.push(b);   // CARD_PILLS_211
              st.disp = "none";
              st.el.style.display = "none";
              continue;
            }
            // 1.2.3 (the user: "הכפתור של הבאת המכונה מוסתר עם הסרגל - צריך להזיז אותו"): never under the top bar - a pill whose anchor projects
            // behind the bar is held just below it
            if (y - h / 2 < topBarH + 6) y = topBarH + 6 + h / 2;
            // PILL_NAV_211: in a low window "הצג מה שבתוך הארון" was drawn under the navigation row and could not be pressed
            if (navR && x + w / 2 > navR.l && x - w / 2 < navR.r && y + h / 2 > navR.t - 4) y = navR.t - 4 - h / 2;
            // push down below any pill already placed that it overlaps (in registration order)
            for (let k = 0; k < 8; k++) {
              let hit = null;
              for (let i = 0; i < nPlaced; i++) {
                const r = rects[i];
                if (Math.abs(r.x - x) * 2 < r.w + w + 4 && Math.abs(r.y - y) * 2 < r.h + h + 4) {
                  hit = r;
                  break;
                }
              }
              if (!hit) break;
              y = hit.y + (hit.h + h) / 2 + 4;
            }
            if (!rects[nPlaced]) rects[nPlaced] = { x: 0, y: 0, w: 0, h: 0 };
            const rr = rects[nPlaced++];
            rr.x = x;
            rr.y = y;
            rr.w = w;
            rr.h = h;
            if (force || Math.abs(st.x - x) > 0.5 || Math.abs(st.y - y) > 0.5 || st.sc !== sc) {
              st.x = x;
              st.y = y;
              st.sc = sc;
              st.el.style.left = x.toFixed(0) + "px";
              st.el.style.top = y.toFixed(0) + "px";
              st.el.style.transform = sc === 1 ? "translate(-50%,-50%)" : "translate(-50%,-50%) scale(" + sc.toFixed(2) + ")";
            }
          }
          // entries taken out of the registry: their pills go
          if (pills.size > MB.length) {
            for (const [b, st] of pills) {
              if (MB.indexOf(b) < 0) {
                st.el.remove();
                pills.delete(b);
              }
            }
          }
          //@@slot frame
          if (typeof leaveFeat !== "undefined" && (leaveFeat || leaveLayer)) anyOn = true;   // VIEW_LEAVE_211
          try { cardPills(hidCard); } catch (_) {}   // CARD_PILLS_211
          if (anyOn !== anyOnShown) {
            anyOnShown = anyOn;
            resetAllBtn.style.display = anyOn ? "inline-block" : "none";
          }
        };
        ctx.animated.push(() => frame(false));
        //@@slot buildUI.after-rr
        ctx.shared.modelButtonsReset = resetAll;
        ctx.shared.revealViews = { ids: Object.keys(REVEAL), view: revealView, own: (id) => !!(REVEAL[id] && REVEAL[id].own) };   // 1.0.1-L (L.90): for the checks
      }
      // ===== 1.0.1-K: the arrow keys (review entry-arrow-keys-pan-and-swallow) =====
      // Left / right turn the view like the nav buttons, up / down raise or lower it, + / - zoom. Only while the focus is on the page, the
      // model or the nav / compass / pills: a focused panel button, the presentation's controls, a link or a form field keep their keys
      // (the panel scrolls with them); nothing happens while the cloud dialog is open; Ctrl / Alt / Meta combinations are the browser's.
      window.addEventListener("keydown", (e) => {
        if (e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey) return;
        const k = e.key;
        const act = k === "ArrowLeft" ? () => orbitBy(-1) : k === "ArrowRight" ? () => orbitBy(1) : k === "ArrowUp" ? () => tiltBy(1)
          : k === "ArrowDown" ? () => tiltBy(-1) : k === "+" || k === "=" ? () => zoomBy(0.94) : k === "-" || k === "_" ? () => zoomBy(1.06) : null;
        if (!act) return;
        if (cf.style.display === "flex") return;
        const ae = document.activeElement;
        const free = !ae || ae === document.body || ae === document.documentElement || ae === ctx.renderer.domElement ||
          !!(ae.closest && ae.closest("#tm-nav, #tm-compass, .tm-pill"));
        if (!free) return;
        const tg = e.target;
        if (tg && tg !== window && tg !== document && tg.nodeType === 1 && tg !== document.body && tg !== document.documentElement && tg !== ctx.renderer.domElement &&
          !(tg.closest && tg.closest("#tm-nav, #tm-compass, .tm-pill"))) return;
        e.preventDefault();
        turnAnim = null;
        act();
      });
      //@@slot buildUI.after-tg
      // SAME_PLACE_B2: the place asked by the other house (the shell's message "place" - house-bridge.js: the event "tm-place", or
      // window.__tmPlace when it came before this point) is opened as its own button opens it
      {
        const goPlace = (t) => { const b = placeBtnByT[t]; if (!b) return false; const d = b.closest && b.closest("details"); if (d) d.open = true; b.click(); return true; };
        window.addEventListener("tm-place", (e) => { const t = e && e.detail; window.__tmPlace = null; if (t) setTimeout(() => goPlace(String(t)), 60); });
        if (window.__tmPlace) { const t = String(window.__tmPlace); window.__tmPlace = null; setTimeout(() => goPlace(t), 400); }
      }
      ctx.ui = {
        topbarAdd,            // 1.1.0: (el, order, icon, label) - a button into the top bar (75-tour.js: the presentation button)
        setTopBtn: ui_setTopBtn,
        views: ui_VIEWS,
        info: ui_INFO,
        refs: ui_REFS,
        viewButton: (key) => viewBtnByKey[key] || null,
        opinions: OPS,
        // CHIP_KEEPS_DEMO_T (fix-t): the cards' chips for another host (75-tour.js: the presentation's banner) - of(subj) = the rows of a
        // subject { view, title } (as a card's), render(host, ids, onPicked, keep) as the cards draw them, hook(fn) = fn after every change of a row
        chips: { of: (subj) => opsFor(subj || {}), render: (host, ids, onPicked, keep) => renderChips(host, ids, onPicked, keep), hook: (fn) => { if (typeof fn === "function") ui_chipHooks.push(fn); } },
        setInfo,
        refLinks,
        refsBlock,   // N15: the sources closed behind a button (75-tour.js: the banner's)
        smallSources: ui_smallSources,   // 1.0.1-L (L.89): text -> HTML with the sources' brackets in a smaller font (75-tour.js)
        applyCut,    // 1.0.1-K: no-ops (navigation never opens anything); the removals are ctx.ui.removals / the on-model pills
        applyOpen,
        setLayer,
        setCutaway,   // 1.2.1: the house's cutaway (the pill "פתח את הבית") from a place
        setSection,   // 1.2.2: the section along the length (the south wall off, the ceilings kept) - the pill "פתח את העליות", the place "בית דילפא"
        sectionOn: () => sectionOn,
        fly,
        resolveFp,
        confirmOpen: () => cf.style.display === "flex",
        panel,
        burger,
        // 1.0.1-J: places by title (the place's own click logic: layers, fly, info) and the cloud
        placeButton: (t) => placeBtnByT[t] || null,
        place: (t) => placeItemByT[t] || null,
        placeTitles: () => Object.keys(placeBtnByT),
        // 1.0.1-L (the contract with 75-tour.js, brief-ui-shared.md): every place button in the panel's order: { title, group, view (a key of
        // ui_VIEWS or null), fp (a fly point key or null), info, refs, layer, feature (the ctx.shared key it switches on, or null), item }
        places: () => placeList.slice(),
        // 1.0.1-L (L.34): the floating explanation card: open(title, text or html, refs?, anchorElement?), close(), isOpen()
        card: { open: (title, content, refs, anchor) => xcardOpen(title, content, refs, anchor), close: xcardClose, isOpen: () => xOpen },
        // 1.0.1-L (L.27): the 15-second rule: { seconds, cancel(key?) - the timers go, the features stay, pending() - the features waiting for
        // their timer; arm / run / flush - the panel's own }
        autoOff,
        setCloud: (on) => setCloud(!!on),
        cloudOn: () => cloudOn,
        //@@slot askCloud
        cancelConfirm,
        closeConfirm,
        tip,
        tooltip: tip,
        modelButtons: MB,
        resetAll: () => { if (typeof ctx.shared.modelButtonsReset === "function") ctx.shared.modelButtonsReset(); },
        removals: {
          ids: () => Object.keys(REMOVALS),
          get: (id) => (id === "cloud" ? !cloudOn : !!(REMOVALS[id] && REMOVALS[id].isOn())),
          set: (id, on) => {
            if (id === "cloud") return void setCloud(!on);
            const R = REMOVALS[id];
            if (R && cutList(R.list()).length) R.set(!!on);
          },
          state: () => {
            const o = { cloud: !cloudOn };
            for (const k of Object.keys(REMOVALS)) o[k] = REMOVALS[k].isOn();
            return o;
          }
        },
        fade: {
          // 1.0.2 (D): hide = the mode "טשטוש: גם קיר מסתיר" (only while on)
          get: () => ({ on: !!ctx.shared.fadeState.on, hide: !!(ctx.shared.fadeState.on && ctx.shared.fadeState.hide), dist: ctx.shared.fadeState.dist, opacity: UI_FADE_OPACITY, stops: UI_FADE_STOPS.slice() }),
          set: (o) => {
            const fs = ctx.shared.fadeState;
            if (o && typeof o.on === "boolean") fs.on = o.on;
            if (o && typeof o.hide === "boolean") {
              fs.hide = o.hide;
              if (o.hide && typeof o.on !== "boolean") fs.on = true;
            }
            if (!fs.on) fs.hide = false;
            if (o && UI_FADE_STOPS.indexOf(o.dist) >= 0) fs.dist = o.dist;
            if (typeof fs.repaint === "function") fs.repaint();
          }
        },
        orbitBy,
        tiltBy,
        zoomBy,
        turnTo,
        // 1.0.1-K (K.9b): the info card next to a clicked label (the addendum C) - closed by the presentation's slides if it wants
        closeCard,   // (1.0.1-L: the label's card; the panel's explanation card is ctx.ui.card)
        cardOpen: () => !!cardSpr,
        // 1.0.1-K review (tour-8): the panel's "סיבוב איטי" - get() = its checkbox, set(on) = the checkbox AND controls.autoRotate together
        // (the box always shows what really turns; setting .checked fires no "change", so the row's handler does not run a second time)
        autoRotate: {
          get: () => !!(autoRotRow && autoRotRow.checked),
          set: (on) => {
            if (autoRotRow) autoRotRow.checked = !!on;
            setAutoRotate(!!on);
          }
        }
      };
      // ===== 1.0.2 (item 2, the user: "תוסיף כפתור בספרים הנ"ל"): the reading position from the book's button (ui_bookEvent at the top of
      // this file) -> ui_READ -> the panel's own button for it (a place by its title, or a view of the grid): the same fly, card and marking
      // as a click on it; a verse outside the table, or a position that cannot be read, gives the general view. It waits for the loading
      // screen (ent_load of 90-entry.js, when it is in scope); a running presentation stops first. A toast names the verse. =====
      {
        const loading = () => typeof ent_load !== "undefined" && !!ent_load && !!ent_load.loading;
        let lastKey = "", lastAt = 0;
        const readTarget = (r) => {
          const at = (v) => { for (const [c, a, b, t] of ui_READ[r.book] || []) if (c === r.ch && v >= a && v <= b) return t; return null; };
          return r.v === 0 ? at(1) || at(0) : at(r.v);   // the chapter's heading line: as its first verse (1.0.2 fix: before the 0-based catch-all ranges)
        };
        // 2.0.2: a target's own button, as a click on it (the presentation stops first) - for the reading below and for 72-words.js
        const pressTarget = (t) => {
          try {
            const T = ctx.shared.tour;
            if (T && typeof T.state === "function" && T.state().running && typeof T.stop === "function") T.stop();
          } catch (_) {
          }
          cancelConfirm();
          const b = (t && t.p ? placeBtnByT[t.p] : t && t.v ? viewBtnByKey[t.v] : null) || null;
          if (b) b.click();
          return !!b;
        };
        const goReading = (r) => {
          if (r && r.other) {   // 2.0.2: another book's line: by its links (72-words.js)
            const L = ctx.ui.reading && ctx.ui.reading.linked;
            if (typeof L === "function") Promise.resolve(L(r.other)).catch((e) => console.warn("[ui.js] links: " + ((e && e.message) || e)));
            return;
          }
          const k = r.book + ":" + r.ch + ":" + r.v, now = performance.now();
          if (k === lastKey && now - lastAt < 2000) return;   // the same click told twice (plugin.page_opened and the toolbar event)
          lastKey = k;
          lastAt = now;
          try {
            const T = ctx.shared.tour;
            if (T && typeof T.state === "function" && T.state().running && typeof T.stop === "function") T.stop();
          } catch (_) {
          }
          cancelConfirm();
          const t = r.ch ? readTarget(r) : null;
          const b = (t && t.p ? placeBtnByT[t.p] : t && t.v ? viewBtnByKey[t.v] : null) || viewBtnByKey.__general || null;
          if (b) b.click();
          else {
            fly(ui_GENERAL.pos, ui_GENERAL.target);
            setInfo("__general");
          }
          //@@slot goReading
        };
        const whenReady = (r) => {
          let n = 0;
          const tick = () => {
            if (!loading()) return void goReading(r);
            if (++n < 480) setTimeout(tick, 250);   // up to 2 minutes behind the loading screen
          };
          tick();
        };
        ui_bookGo = whenReady;
        const q = ui_bookQueue.splice(0);
        if (q.length) whenReady(q[q.length - 1]);
        ctx.ui.reading = { go: (d) => ui_bookEvent(d), target: (book, ch, v) => readTarget({ book, ch, v }), lineToVerse: ui_lineToVerse,
          press: pressTarget, toast: tmToast, open: openSource, linked: null };   // 2.0.2: press / toast / open / linked - for 72-words.js
      }
      // 2.0.2: the search in the words of the sources (a section at the end of the panel) and the links of the books' button - 72-words.js
      if (typeof buildWords === "function") {
        try { await buildWords(ctx); } catch (e) { console.error("[words.js]", e); }
      }
      // ===== 1.0.2 (C, "מה חדש"): on the first opening of a version that has a list in UI_NEWS, once the model is ready (the loading view
      // gone), a small window with the list and "סגירה"; never while the presentation runs or another window of the plugin is open (it
      // waits). The seen version is remembered at once when it shows: Otzaria's plugin storage (storage.get / storage.set; sdk.md: the
      // permissions plugin.storage.* are given to every plugin since 0.9.97 - none in manifest.json), with localStorage as the fallback and
      // the only store outside Otzaria. Either store saying "seen" is enough. The version: plugin.boot's, else UI_NEWS.ver. =====
      {
        //@@slot buildUI.NEWS_KEY
        const inOtz = typeof window.Otzaria !== "undefined" && !!window.Otzaria && typeof window.Otzaria.call === "function";
        const lsSeen = () => lsGet(NEWS_KEY);
        const storeSeen = async () => {
          if (!inOtz) return null;
          try {
            const res = await window.Otzaria.call("storage.get", { key: NEWS_KEY });
            return res && res.success !== false && typeof res.data === "string" ? res.data : null;
          } catch (_) {
            return null;
          }
        };
        const markSeen = (ver) => {
          lsSet(NEWS_KEY, ver);
          const nb0 = document.getElementById("tm-news-btn");   // 1.1.0 (the user): the bar's button goes once the news was seen
          if (nb0 && ver === UI_NEWS.ver) nb0.remove();
          if (inOtz) {
            try {
              Promise.resolve(window.Otzaria.call("storage.set", { key: NEWS_KEY, value: ver })).then((r) => {
                if (r && r.success === false) console.warn("[ui.js] storage.set: " + (r.error ? r.error.code || r.error.message || "" : ""));
              }, () => {});
            } catch (_) {
            }
          }
        };
        let newsSince = null;   // 1.0.6: the version seen before (set by tick), or null
        const show = (ver) => {
          const dlg = document.createElement("div");
          dlg.id = "tm-news";
          dlg.setAttribute("role", "dialog");
          dlg.setAttribute("aria-label", "מה חדש בגרסה " + ver);
          const box = document.createElement("div");
          box.className = "box";
          const t = document.createElement("div");
          t.className = "t";
          const cmpV = (a, b) => {
            const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
            for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
            return 0;
          };
          const known = !!newsSince && UI_NEWS_VERS.some((v) => v[0] === newsSince);
          // 1.2.1 (the user): only THIS version's list, whatever was seen before (the older lists stay in the table for the record)
          const vers = UI_NEWS_VERS.filter((v) => v[0] === ver);
          void known;
          t.textContent = known ? "מה חדש בגרסה " + ver : "מה חדש בתוסף";
          const ul = document.createElement("ul");
          for (const [vv, its] of vers) {
            if (vers.length > 1) {
              const lh = document.createElement("li");
              lh.className = "v";
              lh.textContent = "גרסה " + vv;
              ul.appendChild(lh);
            }
            for (const s2 of its) {
              const li = document.createElement("li");
              if (!ui_newsFill(li, s2)) continue;   // 2.0.2: plain text, and **...** in bold (the main things); a line of the unified plugin only there
              ul.appendChild(li);
            }
          }
          const bb = document.createElement("div");
          bb.className = "b";
          const ok = document.createElement("button");
          ok.type = "button";
          ok.className = "y";
          ok.textContent = "סגירה";
          bb.appendChild(ok);
          // NEWS_WIN_211 (the reviews, U-19 / F2-03; the user, 15.11.2026 18:39: "20. א"): the list was 3.4 screens long in its box and
          // "סגירה" stood only at its very end, under the window's edge. Now only the list scrolls: the title (with a ✕) and "סגירה"
          // always show. Enter - this release's own key for coming closer - no longer closes the window (Esc and a click beside it do).
          const tx = document.createElement("span");
          tx.textContent = t.textContent;
          const xb = document.createElement("button");
          xb.type = "button";
          xb.className = "x";
          xb.textContent = "✕";
          xb.title = "סגירה";
          t.textContent = "";
          t.appendChild(tx);
          t.appendChild(xb);
          box.tabIndex = -1;
          box.appendChild(t);
          box.appendChild(ul);
          box.appendChild(bb);
          xb.addEventListener("click", () => dlg.remove());
          dlg.appendChild(box);
          document.body.appendChild(dlg);
          const close = () => dlg.remove();
          ok.addEventListener("click", close);
          dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
          dlg.addEventListener("keydown", (e) => {
            e.stopPropagation();
            if (e.key === "Enter") { e.preventDefault(); return; }   // NEWS_WIN_211
            if (e.key === "Escape" || e.key === "Esc") close();
          });
          dlg.addEventListener("keyup", (e) => e.stopPropagation());
          dlg.style.display = "flex";
          try { box.focus({ preventScroll: true }); } catch (_) {}   // NEWS_WIN_211: not the button - Enter would press it
          markSeen(ver);
        };
        // ready = the loading view gone, no presentation running, no other window of the plugin open
        const ready = () => {
          if (typeof ent_load !== "undefined" && ent_load && ent_load.loading) return false;
          if (document.getElementById("loading")) return false;
          try {
            const T = ctx.shared.tour;
            if (T && typeof T.state === "function" && T.state().running) return false;
          } catch (_) {
          }
          for (const id of ["tm-confirm", "tm-report", "tm-printdlg"]) {
            const el = document.getElementById(id);
            if (el && el.style.display === "flex") return false;
          }
          return true;
        };
        let tries = 0;
        const tick = async () => {
          if (!ready()) {
            if (++tries < 3600) setTimeout(tick, 1000);   // up to an hour (a long presentation)
            return;
          }
          const ver = String(ui_bootVersion || UI_NEWS.ver).replace(/^v/, "");
          if (ver !== UI_NEWS.ver) return;   // a version with no list of its own
          let seen = lsSeen();
          if (seen !== ver) {
            const st = await storeSeen();
            if (st) seen = st;
          }
          if (seen === ver) {
            lsSet(NEWS_KEY, ver);
            return;
          }
          newsSince = seen || null;
          if (!ready()) {   // (the storage's answer took a moment)
            tries = 0;
            setTimeout(tick, 1000);
            return;
          }
          show(ver);
        };
        setTimeout(tick, 800);
        ctx.ui.news = { items: UI_NEWS.items.slice(), ver: UI_NEWS.ver, show: () => show(UI_NEWS.ver) };   // for the checks
        // 1.1.0: "מה חדש" in the top bar - until the news of this version was seen once (markSeen removes it; the user)
        if (lsSeen() !== UI_NEWS.ver) {
          const nb = document.createElement("button");
          nb.type = "button";
          nb.id = "tm-news-btn";
          nb.title = "מה חדש בתוסף, לפי גרסאות";
          topbarAdd(nb, 50, "news", "מה חדש");
          nb.addEventListener("click", () => {
            const open = document.getElementById("tm-news");
            if (open) { open.remove(); return; }
            newsSince = null;
            show(UI_NEWS.ver);
          });
        }
      }
    } catch (e) {
      if (typeof console !== "undefined") console.error("[ui.js]", e);
    }
  }
