# sheni_sounds.py: report

18 exact replacements. Each `old` is asserted to occur once in the input, and again when applied. Footprint: 7 lines replaced, 102 added, the rest byte-identical.

## 0. Conflict fixed first
In this house, 55-tamid.js ran `SH.sfx = { play, stop }` after SOUNDS_300 had created `ctx.shared.sfx`, so the object replaced the function. Headless check of the unpatched bundle: `typeof ctx.shared.sfx === "object"`. As a result, every SOUNDS_300 sound was silent, and every "steps" loop would throw on each step.

Fix (anchor `SH.sfx = { play: (name) => sound(name), stop: stopSounds };`): `Object.assign(typeof SH.sfx === "function" ? SH.sfx : {}, { play, stop })`. The lots' `SH.sfx.play/stop` still work (tested).

Not patched: if `buildTamid` failed before that line, the lots' `SH.sfx && … SH.sfx.play()` would throw.

## 7–8. "הכהן הגדול נכנס בקטורת" (ykEntry)
- **Helper `kohSteps(level)`** (anchor `ctx2.shared.kohenActor = KOH;`): one "steps" loop while the priest figure really moves (over 0.4 amah/s; halts under 250 ms bridged; jumps ignored). 0 while hidden; `kohSteps(-1)` stops it.
- **Steps:** in its animation callback (anchor `if (PF) PF.near(...)`), `kohSteps(walkPaused() ? 0 : 1)`. Stopped in `Y.stop` (anchor `KOH.hide(); solHold(false);`).
- **Hiss:** `sfx("hiss", {dur: 3})` when the walk clock crosses the second of the caption `C_IN` ("צבר את הקטרת…"): 24.6 / 20.6 / 21.4 by the reading, set in `Y.start`. Once a run: the clock stands while paused, and `Y.start` resets the tracking.

## 9. "הכיור יורד לבור ועולה" (mukhni)
Anchor `wheelG.rotation.x += (d - M.drop) / 1.8;`, on the demo's own clock:
- `sfx("wheel", {dur: 7.5})` at the start of the lowering and of the raising.
- `sfx("water", {dur: 1.2})` when the laver's foot enters and leaves the well's water (drop 1.4).
- Once a run, with a jump guard.

This demo has no pause at all (its demoStops entry has none), so the pause bar never shows for it.

## 10. "הכניסה בפשפש" (pishpesh)
- **Wicket:** `sfx("wicket")` when the walk clock crosses LT+0.2, as the door starts to swing (anchor: the `kohWicket(t)` line).
- **Decision to confirm:** I removed `G.sfx.scrape(at(LT + 0.25), …)`, the gate's scrape that was timed at that same swing, because it would drown the wicket sound. To keep both, keep that line.
- **Steps:** `kohSteps` for the whole run, the gate's part included. 0 when paused; stopped in `pishpeshStop`.

## 12. "פתיחת השער הגדול" (greatGate)
- **Replaced its door sound:** both `SFX.door(…)` calls in `G.demo` are gone. `sfx("bigGate")` now fires from the animation callback (anchor `const e = …; apply(e);`) as each pair begins to open (e = 4.2, 9.0). Key click and bar scrape kept.
- Also covers the gate part of the wicket demo.
- The callback returns early while paused, so nothing repeats. `G.demo` resets the tracking.

## 16. "ארבעת הפייסות ו״ברקאי״" (payis)
- In `step()`: steps at 0.7 while any figure (priest, appointed one, watcher; not torches) is inside a moving track segment.
- 0 while `R.hold ≥ 0` (paused or still frame). `stop()` ends the loop.
- **Not found:** no "barkai" sound exists here. SOUND_211 made the call caption-only; "barkai" is only a sky phase. Knock, door and torch are unchanged.

## 18. Morning-service levels
- `FIRE_LOW = 0.37` on every peak of coals, torch, hiss and ignite. Measured: torch 0.3→0.111, coals 0.35→0.130, ignite 0.18→0.067.
- The other sounds are unchanged. There are no footsteps in that synthesizer.
- The lots' torches use the same synthesizer, so they are lower too.

## Limits
- The API cannot stop a single sound. A one-shot already playing finishes after a pause or stop: wheel up to 7.5 s, bigGate about 5.4 s, hiss 3 s.
- The gate's old context was suspended on pause and closed on stop. A `sfxCut()` in the API would cover this.

## Validation
- "sheni sounds: ok" on `sheni-p4.js` (old and new versions) and on `sheni-p5.js`, its place in make.sh. make.sh's `sheni-p6.js` is byte-identical to my output; `sheni_hp.py`'s `sheni-p7.js` keeps all insertions.
- **`node --check` passes** on all outputs and on p7. safe-lines and minify on a copy pass.
- Headless Chrome, sound API instrumented, readable and minified builds, no page errors:
  - every sound fires at its mark;
  - nothing during a pause, no repeat after resume;
  - loops at 0 while paused or hidden, stopped at end or stop;
  - sound off/on and the one-parochet reading work.
