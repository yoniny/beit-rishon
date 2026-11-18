// Builds the candidate PATH / BACK / KEYS strings (rounded), applies them to a COPY of the source (/tmp/hp/sheni-patched.js), and
// prints the old/new pairs. Every old string is asserted unique in the source.
import fs from "fs";
const SRC = process.argv[2] || "/home/claude/work219/sheni-219.js";
const OUT = "/tmp/hp/sheni-patched.js";
const r2 = (v) => Math.round(v * 100) / 100;
// a polyline through the vertices with circular fillets (radius per inner vertex), sampled every <= stepDeg degrees
const fillet = (V, R, stepDeg = 22) => {
  const out = [V[0]];
  for (let i = 1; i < V.length - 1; i++) {
    const A = V[i - 1], B = V[i], C = V[i + 1], r = R[i] || 0;
    const u = [A[0] - B[0], A[1] - B[1]], w = [C[0] - B[0], C[1] - B[1]], lu = Math.hypot(...u), lw = Math.hypot(...w);
    u[0] /= lu; u[1] /= lu; w[0] /= lw; w[1] /= lw;
    const ang = Math.acos(Math.max(-1, Math.min(1, u[0] * w[0] + u[1] * w[1])));   // the inner angle at B
    if (!r || ang > Math.PI - 1e-3) { out.push(B); continue; }
    const tl = r / Math.tan(ang / 2), P0 = [B[0] + u[0] * tl, B[1] + u[1] * tl], P1 = [B[0] + w[0] * tl, B[1] + w[1] * tl];
    const bis = [u[0] + w[0], u[1] + w[1]], lb = Math.hypot(...bis), dc = r / Math.sin(ang / 2), Cc = [B[0] + bis[0] / lb * dc, B[1] + bis[1] / lb * dc];
    const a0 = Math.atan2(P0[1] - Cc[1], P0[0] - Cc[0]); let a1 = Math.atan2(P1[1] - Cc[1], P1[0] - Cc[0]);
    let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    const n = Math.max(2, Math.ceil(Math.abs(da) * 180 / Math.PI / stepDeg));
    for (let k = 0; k <= n; k++) { const a = a0 + da * k / n; out.push([Cc[0] + r * Math.cos(a), Cc[1] + r * Math.sin(a)]); }
  }
  out.push(V[V.length - 1]);
  return out;
};
// times by arc length between anchors: anchors = [[pointIndex, t], ...] (first and last included)
const timed = (pts, anchors) => {
  const s = [0]; for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const t = new Array(pts.length);
  for (let a = 0; a + 1 < anchors.length; a++) { const [i0, t0] = anchors[a], [i1, t1] = anchors[a + 1]; for (let i = i0; i <= i1; i++) t[i] = t0 + (t1 - t0) * (s[i] - s[i0]) / Math.max(1e-9, s[i1] - s[i0]); }
  return pts.map((p, i) => [r2(t[i]), r2(p[0]), r2(p[1])]);
};
const fmt = (arr) => "[" + arr.map((q) => "[" + q.join(", ") + "]").join(", ") + "]";
const idx = (pts, x, z) => { let b = 0, d = 1e9; pts.forEach((p, i) => { const e = Math.hypot(p[0] - x, p[1] - z); if (e < d) { d = e; b = i; } }); return b; };

// ---------- PATH.two - R. Yehuda: between the altar and the menorah; along the south wall to the outer opening (under the TYT corner);
// in, turning north; up the middle of the amah (x -45); stop short of the north wall (the firepan, 1.71 ahead), turn west into the
// inner opening (the migba'at under its sloping edge: z <= -7.89 where it crosses x -45.5); in, and his face to the south
const two = (() => {
  const head = [[-7.5, 1.2], [-17, 2.8], [-33.5, 3.3]];
  const A = fillet([[-33.5, 3.3], [-38.5, 4.6], [-41.5, 8.5], [-45.0, 8.5], [-45.0, -7.62]], [0, 4, 2.5, 1.5]);
  // stop short of the north wall (the firepan 1.71 ahead), turn on the spot, cross the inner parochet's plane at z -7.96 (the migba'at
  // under the fold line), west, and his face to the south along the parochet
  const tail = [[-45.5, -7.96], [-46.35, -7.96], [-46.6, -7.86], [-46.77, -7.61], [-46.8, -7.36], [-46.8, -5.6]];
  const pts = head.concat(A.slice(1), tail);
  const iIn = idx(pts, -45.0, 7.0), iN = idx(pts, -45.0, -7.62);
  return timed(pts, [[0, 0], [1, 3.0], [2, 7.5], [iIn, 12.6], [iN, 17.36], [pts.length - 1, 19.6]]);
})();
// ---------- PATH.one - R. Yose: between the table and the north wall (z -8.66: the firepan clear of the wall, the spoon of the table in
// both its directions); west through the opening in the north; inside, his face to the south, along the parochet (x -45.35: clear of
// the Rid's corner laid back on its west face)
const one = (() => {
  const app = [[-7.5, -1.2], [-11.5, -6.6], [-12.6, -7.5], [-14.0, -8.05], [-15.8, -8.35], [-18.5, -8.55], [-21.5, -8.66], [-43.6, -8.66]];
  const T = fillet([[-43.6, -8.66], [-45.35, -8.66], [-45.35, -0.5]], [0, 0.6], 30);
  const pts = app.concat(T.slice(1), [[-46.95, 0]]);
  const iT = idx(pts, -44.75, -8.66), iS = idx(pts, -45.35, -8.06);
  return timed(pts, [[0, 0], [1, 1.6], [iT, 12.2], [iS, 12.75], [pts.length - 2, 15.8], [pts.length - 1, 16.6]]);
})();
// ---------- PATH.meir - R. Meir: between the table and the altar; past the table, turned north-west; through the opening in the north at
// a slant (z -7.95 at the parochet); inside as R. Yose's
const meir = (() => {
  // past the table turned north-west, under the TYT corner's high part (crossing its lower edge east of x -42.5), the firepan clear of
  // the north wall, west through the opening (z -8.3 at the parochet); inside as R. Yose's (left turn, radius 0.74, to x -45.35)
  const head = [[-7.5, -1.2], [-15.5, -2.4], [-31.5, -3.4], [-37.0, -3.6], [-38.8, -4.4], [-40.3, -5.8], [-41.5, -7.2], [-42.5, -7.8], [-43.5, -8.15], [-44.5, -8.3]];
  const c = [-44.61, -7.57], r = 0.74, arc = [-70, -40, -15, 0].map((d) => { const p = d * Math.PI / 180; return [c[0] - r * Math.cos(p), c[1] + r * Math.sin(p)]; });
  const pts = head.concat(arc, [[-45.35, -0.5], [-46.95, 0]]);
  return timed(pts, [[0, 0], [1, 2.6], [2, 7.6], [3, 9.4], [9, 12.85], [13, 13.6], [14, 16.6], [15, 17.4]]);
})();
const BACKN = {
  two: "[[26.0, -45.0, 3.0, NORTH], [28.0, -45.0, 8.5, NORTH], [28.8, -43.6, 8.5, WESTY], [30.0, -41.6, 7.0, WESTY]]",
  one: "[[20.0, -45.35, -5.0, 0], [21.2, -45.35, -8.66, 0], [22.0, -43.5, -8.66, WESTY], [23.2, -41.6, -7.6, WESTY]]",
  meir: "[[20.8, -45.35, -5.0, 0], [22.0, -45.35, -8.66, 0], [22.8, -43.5, -8.66, WESTY], [24.0, -41.0, -6.6, WESTY]]"
};
const src = fs.readFileSync(SRC, "utf8");
const REPL = [];
const lineOf = (key) => { const m = src.match(new RegExp("\\n\\s*" + key + ": (\\[\\[[^\\n]*\\]\\])(,?) //")); if (!m) throw new Error(key); return m; };
// PATH lines (the first occurrence of "two: [[0, -7.5" etc. is PATH's)
for (const [k, arr] of [["two", two], ["one", one], ["meir", meir]]) {
  const m = src.match(new RegExp(k + ": (\\[\\[0, -7\\.5, -?1\\.2\\][^\\n]*?\\]\\])(,?) //"));
  REPL.push(["PATH." + k, k + ": " + m[1], k + ": " + fmt(arr)]);
}
for (const k of ["two", "one", "meir"]) {
  const m = src.match(new RegExp(k + ": (\\[\\[\\d+\\.\\d, -45\\.\\d+, -?\\d\\.\\d, (?:NORTH|0)\\][^\\n]*?\\]\\])(,?) //"));
  REPL.push(["BACK." + k, k + ": " + m[1], k + ": " + BACKN[k]]);
}
// KEYS.two - the eye kept out of the south wall's gold (its keys at z 9.55 / 9.4 / 9.3 / 9.15: the curve went 0.19 into it)
REPL.push(["KEYS.two 13.2", "[13.2, [-44.1, E(-44.1, 3.4), 9.3], [-45.0, E(-45, 2.3), 3.5]]", "[13.2, [-44.1, E(-44.1, 3.4), 8.95], [-45.0, E(-45, 2.3), 3.5]]"]);
REPL.push(["KEYS.two 14.2", "[14.2, [-44.86, E(-45, 3.3), 9.55], [-45.0, E(-45, 2.3), -9]]", "[14.2, [-44.86, E(-45, 3.3), 8.9], [-45.0, E(-45, 2.3), -9]]"]);
REPL.push(["KEYS.two 15.4", "[15.4, [-44.98, E(-45, 3.3), 8.9], [-45.0, E(-45, 2.3), -9]]", "[15.4, [-44.98, E(-45, 3.3), 8.4], [-45.0, E(-45, 2.3), -9]]"]);
REPL.push(["KEYS.two 22.8", "[22.8, [-44.9, E(-45, 3.3), 9.4], [-45.0, E(-45, 2.3), 2]]", "[22.8, [-44.9, E(-45, 3.3), 8.9], [-45.0, E(-45, 2.3), 2]]"]);
REPL.push(["KEYS.two 24.2", "[24.2, [-43.4, E(-43.4, 3.4), 9.15], [-44.9, E(-45, 2.3), 9.6]]", "[24.2, [-43.4, E(-43.4, 3.4), 8.85], [-44.9, E(-45, 2.3), 8.6]]"]);
// KOH.pose turns him only when he moved > 0.004 a frame (41228): slow legs keep the old heading on fast screens - give the way ahead
REPL.push(["heading (look-ahead)", "if (t <= 0.05) o.yaw = Math.atan2(P[1][1] - P[0][1], P[1][2] - P[0][2]);", "if (t <= 0.05) o.yaw = Math.atan2(P[1][1] - P[0][1], P[1][2] - P[0][2]); else { const q = at(P, t + 0.05); if (Math.hypot(q[1] - p[1], q[2] - p[2]) > 1e-4) o.yaw = Math.atan2(q[1] - p[1], q[2] - p[2]); }"]);
let out = src;
const only = process.argv.includes("--paths-only");
for (const [name, a, b] of REPL) {
  if (only && name.startsWith("KEYS")) continue;
  const n = out.split(a).length - 1;
  if (n !== 1) throw new Error(name + ": old string found " + n + " times");
  out = out.replace(a, b);
  if (process.argv.includes("--print")) console.log("### " + name + "\nOLD: " + a + "\nNEW: " + b + "\n");
}
fs.writeFileSync(OUT, out);
console.log("written", OUT, "(" + REPL.length + " replacements" + (only ? ", paths only" : "") + ")");
