# SOUNDS_300 - the Second Temple's part (the user, 18.11.2026; the owner's approved items 7, 8, 9, 10, 12, 16, 18): sounds for five
# demonstrations through the demonstrations' synthesizer of 90-entry.js (ctx.shared.sfx / ctx.shared.sfxLoop), and the morning
# service's fire sounds made softer. Applied to the PLAIN bundle (no trailing " //"; safe-lines adds them later):
#   python3 -I sheni_sounds.py <in.js> <out.js>
# Every replacement is exact text, asserted to occur exactly once in the input; the rest of the file stays byte-identical.
#  0. the morning service (55-tamid.js) put its own { play, stop } IN PLACE of ctx.shared.sfx (built after 90-entry.js made it): in this
#     house the synthesizer's sounds were silent and every "steps" loop threw. Its play / stop are now hung on the function
#  7-8. "הכהן הגדול נכנס בקטורת" (ykEntry, 50-heichal.js): his soft steps while he walks; the hiss at "צבר את הקטרת על גבי גחלים"
#  9. "הכיור יורד לבור ועולה" (mukhni, 40-altar.js): the wooden wheel for each motion; a short splash into the well's water and out
#  10. "הכניסה בפשפש" (pishpesh, 50-heichal.js): the wicket on its pivot (in place of the gate's scrape that was timed there); his steps
#  12. "פתיחת השער הגדול" (greatGate, 50-heichal.js): "bigGate" as each pair of doors begins to open (in place of SFX.door)
#  16. "ארבעת הפייסות ו״ברקאי״" (payis, 55-payis.js): soft steps (0.7) while a priest walks; its night sounds stay
#  18. the morning service's synthesizer: coals, torch, hiss, ignite at 0.37 of their peaks
import sys

src, dst = sys.argv[1:3]
s = open(src, encoding='utf-8', newline='').read()
R = []


def rep(label, old, new):
    R.append((label, old, new))


# ---------------------------------------------------------------- 0. the morning service's object no longer replaces ctx.shared.sfx
rep('tamid sfx',
"""    SH.sfx = { play: (name) => sound(name), stop: stopSounds };   // SOUND_211: 55-payis.js sounds the night with it
""",
"""    // SOUNDS_300: ctx2.shared.sfx is the demonstrations' synthesizer of 90-entry.js - a function, made before the modules are built.
    // play / stop are hung on it and do not take its place: before SOUNDS_300 this object replaced it, and in this house its sounds
    // were silent and every "steps" loop threw (its step calls ctx.shared.sfx("step"))
    SH.sfx = Object.assign(typeof SH.sfx === "function" ? SH.sfx : {}, { play: (name) => sound(name), stop: stopSounds });   // SOUND_211: 55-payis.js sounds the night with it
""")

# ---------------------------------------------------------------- 18. the morning service: the fire's sounds softer
rep('tamid FIRE_LOW',
"""    const sound = (name) => {
      const a = ac();
""",
"""    // SOUNDS_300 (the user's item 18, 18.11.2026: "רעש האש בעבודת הבוקר הוא גבוה מדי ומציק"): the fire's sounds - the coals, the
    // torch, the hiss of what is put on the fire, the piles' kindling - at FIRE_LOW of their peaks before it (the others as they were).
    // 55-payis.js sounds its torches by this synthesizer too (SH.sfx.play)
    const FIRE_LOW = 0.37;
    const sound = (name) => {
      const a = ac();
""")
rep('tamid ignite',
"""        else if (name === "ignite") noise(a, t, 1.4, 0.18, "bandpass", 1200, 0.6, 1.2);
""",
"""        else if (name === "ignite") noise(a, t, 1.4, 0.18 * FIRE_LOW, "bandpass", 1200, 0.6, 1.2);   // SOUNDS_300: FIRE_LOW
""")
rep('tamid coals',
"""        else if (name === "coals") { noise(a, t, 0.5, 0.25, "bandpass", 2400, 2.5, 0.25); noise(a, t + 0.6, 0.45, 0.2, "bandpass", 2000, 2.5, 0.3); for (let i = 0; i < 8; i++) noise(a, t + 0.2 + Math.random() * 1.6, 0.012, 0.35, "highpass", 3000, 0.8, 0.05); }
""",
"""        else if (name === "coals") { noise(a, t, 0.5, 0.25 * FIRE_LOW, "bandpass", 2400, 2.5, 0.25); noise(a, t + 0.6, 0.45, 0.2 * FIRE_LOW, "bandpass", 2000, 2.5, 0.3); for (let i = 0; i < 8; i++) noise(a, t + 0.2 + Math.random() * 1.6, 0.012, 0.35 * FIRE_LOW, "highpass", 3000, 0.8, 0.05); }   // SOUNDS_300: FIRE_LOW
""")
rep('tamid hiss',
"""        else if (name === "hiss") { noise(a, t, 2.2, 0.1, "highpass", 3500, 0.6, 1.0); for (let i = 0; i < 10; i++) noise(a, t + Math.random() * 2.4, 0.012, 0.3, "highpass", 2800, 0.8, 0.05); }
""",
"""        else if (name === "hiss") { noise(a, t, 2.2, 0.1 * FIRE_LOW, "highpass", 3500, 0.6, 1.0); for (let i = 0; i < 10; i++) noise(a, t + Math.random() * 2.4, 0.012, 0.3 * FIRE_LOW, "highpass", 2800, 0.8, 0.05); }   // SOUNDS_300: FIRE_LOW
""")
rep('tamid torch',
"""        else if (name === "torch") { noise(a, t, 3.0, 0.07, "lowpass", 500, 0.7, 1.0); for (let i = 0; i < 14; i++) noise(a, t + Math.random() * 3.2, 0.012, 0.3, "highpass", 2600, 0.8, 0.05); }
""",
"""        else if (name === "torch") { noise(a, t, 3.0, 0.07 * FIRE_LOW, "lowpass", 500, 0.7, 1.0); for (let i = 0; i < 14; i++) noise(a, t + Math.random() * 3.2, 0.012, 0.3 * FIRE_LOW, "highpass", 2600, 0.8, 0.05); }   // SOUNDS_300: FIRE_LOW
""")

# ---------------------------------------------------------------- 7 / 10. the priest's steps (one helper, by KOH's place)
rep('koh steps',
"""    ctx2.shared.kohenActor = KOH;
""",
"""    ctx2.shared.kohenActor = KOH;
    // SOUNDS_300 (the user's items 7 and 10, 18.11.2026; "קול צעדים יחף אמור להיות יחסית נמוך"): THE PRIEST'S SOFT BAREFOOT STEPS - one
    // "steps" loop of 90-entry.js (ctx2.shared.sfxLoop) while KOH's place changes, whoever poses him (the wicket's walk, the great gate's
    // after it, the High Priest's); none while he stands or is hidden. kohSteps(level) every frame of a running demonstration (0 while it
    // is paused), kohSteps(-1) at its end. A halt under a quarter of a second is no halt (a corner); a jump is no walk
    const walkPaused = () => { const w = DEMO_STOPS.find((d) => d && d.id === "walk"); try { return !!(w && w.paused()); } catch (_) { return false; } };
    const kohSteps = (() => {
      let L = null, last = null, until = 0;
      return (level) => {
        try {
          if (level < 0) { if (L) L.stop(); L = null; last = null; until = 0; return; }
          const a = KOH.actor, now = performance.now();
          if (a && a.g0.visible) {
            const p = a.g0.position;
            if (last && now > last.t) { const v = Math.hypot(p.x - last.x, p.z - last.z) / ((now - last.t) / 1000); if (v > 0.4 && v < 12) until = now + 250; }
            last = { x: p.x, z: p.z, t: now };
          } else { last = null; until = 0; }
          const v = level > 0 && now < until ? level : 0;
          if (!L && v > 0 && typeof ctx2.shared.sfxLoop === "function") L = ctx2.shared.sfxLoop("steps");
          if (L) L.set(v);
        } catch (_) {}
      };
    })();
""")

# ---------------------------------------------------------------- 7-8. the High Priest's entry with the incense (ykEntry)
rep('yk stop',
"""          KOH.hide();
          solHold(false);
""",
"""          KOH.hide();
          kohSteps(-1);   // SOUNDS_300 (item 7)
          solHold(false);
""")
rep('yk start',
"""          DW.run(KEYS[Y.mode], CAPS[Y.mode], () => Y.stop(true));
          Y.t0 = performance.now();
""",
"""          DW.run(KEYS[Y.mode], CAPS[Y.mode], () => Y.stop(true));
          Y.t0 = performance.now();
          Y.sndT = null;   // SOUNDS_300 (item 8): the hiss at C_IN's second of this reading, once a run (the animation below)
          Y.tIn = ((CAPS[Y.mode] || []).find((c) => c[1] === C_IN) || [1e9])[0];
""")
rep('yk anim',
"""          if (PF) PF.near([hp, cp ? [cp.x, cp.z] : null]);
        });
""",
"""          if (PF) PF.near([hp, cp ? [cp.x, cp.z] : null]);
          // SOUNDS_300 (the user's items 7-8, 18.11.2026): his soft barefoot steps while he walks (kohSteps - none while he stands, while
          // he is in the Holy of Holies, or while the walk is paused), and the hiss of the incense as he heaps it on the coals - "צבר את
          // הקטרת על גבי גחלים, ונתמלא כל הבית כלו עשן" (Yoma 5:1) - at its caption's second (Y.tIn), once a run: on the walk's clock,
          // which stands while paused, so the resume brings no second hiss
          kohSteps(walkPaused() ? 0 : 1);
          try {
            const t0 = Y.sndT, SH = ctx2.shared;
            Y.sndT = t;
            if (t0 != null && t > t0 && t - t0 < 1 && t0 < Y.tIn && t >= Y.tIn && typeof SH.sfx === "function") SH.sfx("hiss", { dur: 3 });
          } catch (_) {}
        });
""")

# ---------------------------------------------------------------- 9. the laver lowered into the well and raised (mukhni)
rep('mukhni',
"""      wheelG.rotation.x += (d - M.drop) / 1.8;   // the rope winds on the axle as the wheel turns
""",
"""      // SOUNDS_300 (the user's item 9, 18.11.2026): Ben Katin's wooden wheel - "קול העץ שעשה בן קטין מוכני לכיור" (Tamid 1:4) - as each
      // motion begins, for as long as it lasts (the evening's down, the morning's up: T_DOWN, T_UP at the demonstration's pace), and a
      // short splash as the laver's foot goes into the well's water (0.8 under the floor) and as it comes out of it. On this clock, each
      // once a run (a new t0 is a new run; a frame's step, not a jump). This demonstration has no pause of its own
      try {
        const SH = ctx2.shared, slow = SH.demoSlow || 1.5, WET = KY - F + 0.8, TU = T_PRE + T_DOWN + T_NIGHT;
        if (M.sndT0 !== M.t0) { M.sndT0 = M.t0; M.sndE = null; }
        const e0 = M.sndE;
        M.sndE = e;
        if (e0 != null && e > e0 && e - e0 < 1000 && typeof SH.sfx === "function") {
          if (e0 < T_PRE && e >= T_PRE) SH.sfx("wheel", { dur: T_DOWN * slow / 1000 });
          if (e0 < TU && e >= TU) SH.sfx("wheel", { dur: T_UP * slow / 1000 });
          if ((M.drop < WET && d >= WET) || (M.drop > WET && d <= WET)) SH.sfx("water", { dur: 1.2 });
        }
      } catch (_) {}
      wheelG.rotation.x += (d - M.drop) / 1.8;   // the rope winds on the axle as the wheel turns
""")

# ---------------------------------------------------------------- 10. the entry by the wicket (pishpesh)
rep('pish scrape',
"""            G.sfx.scrape(at(LT + 0.25), 0.9 * SLOW);
          }
""",
"""          }
          D.sndT = null;   // SOUNDS_300 (item 10): the wicket's own sound, on the walk's clock (the animation below) - before it the gate's scrape, timed here at LT + 0.25
""")
rep('pish anim',
"""          { const G0 = ctx2.shared.greatGate; if (!(G0 && G0.t0 >= 0)) kohWicket(t); }   // KOHEN_ACTOR_211 (from the great gate's own start: kohGate)
""",
"""          { const G0 = ctx2.shared.greatGate; if (!(G0 && G0.t0 >= 0)) kohWicket(t); }   // KOHEN_ACTOR_211 (from the great gate's own start: kohGate)
          // SOUNDS_300 (the user's item 10, 18.11.2026): the wicket on its pivot as it swings in (LT + 0.2, the door above), once a run on
          // the walk's clock (it stands while paused: the resume brings no second sound), and his soft barefoot steps while he walks - to
          // the great gate and on, as long as this demonstration runs (kohSteps)
          try {
            const t0 = D.sndT, SH = ctx2.shared;
            D.sndT = t;
            if (t0 != null && t > t0 && t - t0 < 1 && t0 < LT + 0.2 && t >= LT + 0.2 && typeof SH.sfx === "function") SH.sfx("wicket");
          } catch (_) {}
          kohSteps(D.pausedAt != null || walkPaused() ? 0 : 1);
""")
rep('pish stop',
"""          D.seq = null; D.t0 = -1; D.pausedAt = null; mk.visible = false; capG.forEach((c) => (c.visible = false));   // DEMO_PAUSE_207: D.pausedAt
""",
"""          D.seq = null; D.t0 = -1; D.pausedAt = null; mk.visible = false; capG.forEach((c) => (c.visible = false));   // DEMO_PAUSE_207: D.pausedAt
          kohSteps(-1);   // SOUNDS_300 (item 10)
""")

# ---------------------------------------------------------------- 12. the opening of the great gate (greatGate)
rep('gate door',
"""          SFX.door(lead + 4.2 * SLOW, 4.5 * SLOW); SFX.door(lead + 9.0 * SLOW, 4.0 * SLOW);
""",
"""          // SOUNDS_300 (the user's item 12, 18.11.2026): the doors' sound is now the great gate's own of 90-entry.js ("bigGate"), sounded
          // on the demonstration's clock as each pair begins to open (the animation below) - before it SFX.door here, at 4.2 and 9.0
          this.sndE = null;
""")
rep('gate anim',
"""        const e = (performance.now() - G.t0) / 1000 / SLOW;
        apply(e);
""",
"""        const e = (performance.now() - G.t0) / 1000 / SLOW;
        apply(e);
        // SOUNDS_300 (the user's item 12, 18.11.2026): "מיריחו היו שומעין קול שער הגדול שנפתח" (Tamid 3:8) - the great gate's deep
        // sound ("bigGate") as each pair of doors begins to open (4.2 and 9.0: apply()), in its own demonstration and after the wicket's
        // walk alike; once a run - this clock stands while paused (above), so the resume brings none twice
        try {
          const e0 = G.sndE, SH = ctx2.shared;
          G.sndE = e;
          if (e0 != null && e > e0 && e - e0 < 1 && typeof SH.sfx === "function") for (const s of [4.2, 9.0]) if (e0 < s && e >= s) SH.sfx("bigGate");
        } catch (_) {}
""")

# ---------------------------------------------------------------- 16. the four lotteries and "barkai" (payis)
rep('payis steps',
"""      // the count: the mark over the finger of the one now counted, and the number in the caption
""",
"""      // SOUNDS_300 (the user's item 16, 18.11.2026): soft barefoot steps (a "steps" loop at 0.7) while a priest walks - a figure (the
      // ring's priests, the appointed one, the watcher; not the torches, not a mitznefet) between two keys of his track that are apart;
      // none while the clock stands (a pause, a still frame: R.hold). stop() ends the loop. The night's own sounds (SOUND_211) stay
      try {
        let walk = false;
        if (R.hold < 0) for (const tr of S.tracks) {
          if (tr.local || !tr.o.visible || !(tr.o.userData && tr.o.userData.body)) continue;
          const k = tr.keys;
          if (t < k[0][0] || t >= k[k.length - 1][0]) continue;
          let i = 0;
          while (i < k.length - 2 && t > k[i + 1][0]) i++;
          const a = k[i], b = k[i + 1];
          if (b[0] > a[0] && Math.hypot(b[1] - a[1], b[3] - a[3]) > 0.05) { walk = true; break; }
        }
        if (walk && !R.steps && typeof SH.sfxLoop === "function") R.steps = SH.sfxLoop("steps");
        if (R.steps) R.steps.set(walk ? 0.7 : 0);
      } catch (_) {}
      // the count: the mark over the finger of the one now counted, and the number in the caption
""")
rep('payis stop',
"""      RUN = null;
      g.visible = false;
""",
"""      RUN = null;
      try { if (R.steps) R.steps.stop(); } catch (_) {}   // SOUNDS_300 (item 16)
      g.visible = false;
""")

# ---------------------------------------------------------------- apply: each `old` exactly once in the input (and still once when applied)
for label, old, new in R:
    assert s.count(old) == 1, (label, s.count(old))
out = s
for label, old, new in R:
    assert out.count(old) == 1, (label, 'when applied', out.count(old))
    out = out.replace(old, new)
open(dst, 'w', encoding='utf-8', newline='').write(out)
print('sheni sounds: ok')
