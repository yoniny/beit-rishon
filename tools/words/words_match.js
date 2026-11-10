  // ----- the matcher (ONE text: tools196/words_match.js is written into each house's 72-words.js and into the unified shell) -----
  // The compared text: no nikud or te'amim, no quotation marks, punctuation as spaces, the final letters as the plain ones (שלחן is found in
  // שלחנות). wordsPrep(text) keeps, for every letter of the compared text, its place in the shown text (for the marking of a hit).
  var WORDS_FINALS = { "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ" };
  function wordsNorm(t) {
    return String(t == null ? "" : t).replace(/[֑-ׇ]/g, "").replace(/[׳״'"`]/g, "").replace(/[^0-9A-Za-zא-ת]+/g, " ").replace(/\s+/g, " ").trim().toLowerCase().replace(/[ךםןףץ]/g, (c) => WORDS_FINALS[c]);
  }
  function wordsPrep(text) {
    const s = String(text == null ? "" : text);
    let n = "";
    const at = [];
    let gap = true;
    for (let i = 0; i < s.length; i++) {
      const c = s[i], k = c.charCodeAt(0);
      if ((k >= 0x0591 && k <= 0x05C7) || "׳״'\"`".indexOf(c) >= 0) continue;
      if ((k >= 0x05D0 && k <= 0x05EA) || (k >= 48 && k <= 57) || (k >= 65 && k <= 90) || (k >= 97 && k <= 122)) {
        n += WORDS_FINALS[c] || c.toLowerCase();
        at.push(i);
        gap = false;
      } else if (!gap) {
        n += " ";
        at.push(i);
        gap = true;
      }
    }
    if (n.endsWith(" ")) { n = n.slice(0, -1); at.pop(); }
    // the same text without ו and י (שלחן = שולחן, מנרות = מנורות), each letter with its place in n
    let l = "";
    const la = [];
    for (let i = 0; i < n.length; i++) if (n[i] !== "ו" && n[i] !== "י") { l += n[i]; la.push(i); }
    return { n, at, l, la };
  }
  // One word of the query in a prepared line -> { s, a, b } (the hit in n) or null. The word must START a word of the line, after the
  // prefix letters at most (ו, and one of ה ב ל מ כ ש: "הים" finds הים and והים, not אלהים), and what follows it in that word must be an
  // ending of inflection or nothing (שלחן finds שלחנות and שלחנו; הים does not find הימנית); a word of one or two letters must be the
  // whole word. s: 4 = the whole word as written, 3 = as written with an ending, 2 = the whole word without ו / י (מסיבה = מסבה),
  // 1 = without ו / י with an ending (עמוד finds עמדים), or without a final ה / ת of the searched word (מנורה finds מנרות).
  var WORDS_SUF = "(?:ימ|ות|י|ו|ה|ת|יו|יה|יהמ|ותיו|ותיהמ|המ|הנ|כ|כמ|מ|נ|ית|יות|יימ|ינ|תו|תי|תמ|ותמ)";   // (not נו: "הים" found the Mishnah's הימנו)
  var WORDS_SUF_L = "(?:מ|ת|ה|המ|הנ|תהמ|תמ|נ|כ|כמ)";   // the same endings without ו and י
  function wordsHit(P, w) {
    if (!w) return null;
    const at = (hay, pre, word, suf) => {
      const m = new RegExp("(?:^| )(" + pre + ")" + word + "(" + suf + "?)(?= |$)").exec(hay);
      return m ? { i: m.index + (m[0][0] === " " ? 1 : 0) + m[1].length, whole: !m[2] } : null;
    };
    if (w.length <= 2) {
      const h = at(P.n, "ו?[הבלמשכ]?", w, "(?:)");
      return h ? { s: 4, a: h.i, b: h.i + w.length } : null;
    }
    const h = at(P.n, "[והבלמשכ]{0,2}?", w, WORDS_SUF);
    if (h) return { s: h.whole ? 4 : 3, a: h.i, b: h.i + w.length };
    const lw = w.replace(/[וי]/g, "");
    if (lw.length < 3) return null;
    let len = lw.length, g = at(P.l, "[הבלמשכ]{0,2}?", lw, WORDS_SUF_L);   // (also when the word itself has no ו / י: the line may have them)
    if (g && g.whole) return { s: 2, a: P.la[g.i], b: P.la[g.i + len - 1] + 1 };
    if (!g) {
      const st = lw.replace(/[הת]$/, "");
      if (st.length < 3 || st === lw) return null;
      g = at(P.l, "[הבלמשכ]{0,2}?", st, WORDS_SUF_L);
      len = st.length;
      if (!g) return null;
    }
    return { s: 1, a: P.la[g.i], b: P.la[g.i + len - 1] + 1 };
  }
  // the whole query (already wordsNorm'ed) in a prepared line -> { score, hits: [[a, b] in n] } or null (every word must be found)
  function wordsFind(P, q) {
    const ws = q.split(" ").filter(Boolean);
    if (!ws.length) return null;
    let score = 0;
    const hits = [];
    for (const w of ws) {
      const h = wordsHit(P, w);
      if (!h) return null;
      score += h.s;
      hits.push([h.a, h.b]);
    }
    if (ws.length > 1) {
      const p = (" " + P.n + " ").indexOf(" " + q);
      if (p >= 0) { score += 3; hits.length = 0; hits.push([p, p + q.length]); }
    }
    return { score, hits };
  }
