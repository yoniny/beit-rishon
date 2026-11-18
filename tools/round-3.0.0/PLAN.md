# Round 3.0.0 (18.11.2026) — בית המקדש 3.0.0: בית ראשון 1.4.9, בית שני 2.0.10 — WORK IN PROGRESS (branch release-3.0)

Not published. The user, 18.11.2026 03:05: publish 3.0 to main when it is ready, after his approval; the webgpu branch (three.js 187 +
WebGPU, another session) will merge 3.0 in. The version: the user, 02:24, "מס' הגרסא יהיה 3.0" (the store needs x.y.z: 3.0.0).

## For the merge with the branch webgpu
This round does NOT touch src/00-lib.js or three.js. src/90-entry.js changes (~360 lines added), all tagged:
- CAM_219 (1)-(6): `cam_polarFit` (the polar limit by the mode: minPolarAngle 0.03 in "look"/walk mode, ENT_MIN_POLAR 0.2 in "orbit";
  a pose past it is fitted by turning the view), `cam_killInertia` (OrbitControls' private glide spent by one update() with
  dampingFactor 1, the pose put back), `cam_flyStop` (ctx.camFlyStop; a press / wheel / walk-lift key / nav button in a flight ends it),
  `cam_update` (no controls.update() during a flight: only lookAt), flyTo (cam_killInertia at the start; ent_tiltFromZenith also tilts
  from the nadir), the landing (cam_killInertia), `cam_nearStep` (camera.near = 0.2 x the eye-target distance, 0.04..0.5, after every
  writer of the camera, before the render), `cam_walkFloor` (walk mode keeps the eye's height over the floor under it; the guard's
  floor-under-the-target rule is off in walk mode), the pointerdown handler (PINCH_219: a second finger hands the first to
  OrbitControls with a synthetic pointerdown; a pending cam_decide runs at the press), ctx.camFlying / ctx.camFlyStop.
- DPAUSE_LEFT_300: the demonstrations' bar at the left, over the compass / the nav row (place()).
- SOUNDS_300: `ctx.shared.sfx(name, opts)` / `ctx.shared.sfxLoop(name)` - a WebAudio synthesizer for the demonstrations (no files).
The second house's bundle carries the same 90-entry.js (its entry section is the first house's, "taken whole").

## The user's requests and what was done
1. Gemini's report on the camera (an attachment): checked claim by claim against the code (an audit agent) and in the browser (a
   sweep agent + tools/round-3.0.0/camtest.mjs, before/after): Gemini's code was not used (its maxPolarAngle PI/2-0.02 blocks looking
   up; near 0.05 everywhere would make the depth 10x coarser). Fixed: CAM_219 above. Before/after (rishon / sheni): a steep look down
   in place then release - the eye jumped 3.7 / 2.6 amot and the view turned ~10 degrees -> 0; a press in a flight - the flight went on
   (159 amot) -> stops; + down to 0.3 at a menorah - cut (near 0.5) -> whole (near 0.06 / 0.098); walk mode down the ulam's steps -
   the eye stayed 9 over the court -> 3; a two-finger pinch under a roof - turned 71 degrees and jumped 26-32 amot -> a zoom.
2. "הגודל של הקובץ נראה לי גדל מדי": the second house's bundle ships MINIFIED (terser, the first house's options; minify.mjs):
   4.57 MB -> 2.6 MB; the .otzplugin 1.73 -> 1.34 MB; the one-file HTML 6.68 -> 4.76 MB. Its READABLE bundle is kept in
   sheni-src/bundle.js (the source of the next patch - the second house's own sources are not in the repository).
3. The ruler ("מודל האמות... יכין צריך להיות 18... יוצא 21"): the tool is exact (21.02 to the top of the capital, 16.01 to the
   capital's foot, 0.00 for one point twice); 21 = Rashi 7:16 "והעמוד תחוב בכותרת שתי אמות" + the capital 5 (the pillars' card says
   so; the book's "21 אמות"). MEASURE_300 (70-ui.js mPick): a point only on what is drawn - not nearer than the near plane, not on a
   face a clipping plane cuts (the live section), a multi-material mesh by the hit face's material.
4. The demonstrations' bar "לא במרכז... שים אותו בצד שמאל מעל המצפן": DPAUSE_LEFT_300.
5. בית שני, "פרחי הכהונה... צעירים ולא עם שער לבן", "זקן קטן": YOUNG_300 (the people kit's option young: dark hair, a short beard).
6. בית שני, "שתי הסנהדראות הקטנות... מציג רק אחת": LESSER_BOTH_300 - one view of both, by the reading of their place.
7. בית שני, "אין פריפה של הפרוכת כשמוצג מיצג זה" (שער הבכורות): GATE_SHOWN_300 - a parochet is raised when the view aims at its opening.
8. "תוסיף קולות... לכל ההדגמות" - the list he approved (1-4, 6-10, 12, 16; not 5, 11; 13-15 wait for a full שמחת בית השואבה) and
   "התאמת ווליום" (barefoot steps soft; the morning service's fire quieter): SOUNDS_300. בית ראשון: the laver stand's wheels and the
   tap's water (checked: a wheels loop by speed, water at the stop), the devir's doors creak (T.open0), trumpets and cymbals as the
   priests come out and the cloud fills the house (II Chr 5:11-13 - not at the ark's entering: the verses put them there; told the
   user), a click at each of the throne's six steps (checked). בית שני: sheni_sounds.py (an agent; WIP).
9. "קטגוריה נפרדת להדגמות": DEMOS_GROUP_300 - the group "הדגמות" at the head of the panel in both houses (ui_demosList per house),
   noTour; checked: every item starts its demonstration.
10. בית שני, the morning service, "הטבת... הוא לא באמת מטיב שם, הוא מתעסק שם למעלה": LAMPS_HANDS_219 (an agent's analysis;
    sheni_tamid.py) - the pose "reach" held his hands 1.3 amot over the lamps; now the hand goes to each lamp (reach() IK); checked in
    the browser from the side (lampscheck2.mjs). "חלק מהנרות דולקים... הוא בא להדליק": by the sources (Tamid 3:9 "ומצא שני נרות מזרחיים
    דולקים"; the Rambam, Temidin 3, "והדלקת הנרות היא הטבתם" - seven burn at the second dressing) - put to the user as a question of
    reading; his answer (03:18): "א+ג" - the lamp he fixes dims and comes back (as it was), and a caption at the stage's start in the
    Rambam's reading: LAMPS_CAP_300 (tamid_edits.json, the 7th edit: slideOf, the first caption; the Mishnah's first words at 3.6).
11. "עלייה בלולים... בורחת מעבר לסיבוב": the eye never stood on the stair (it backed east through it, out of the chamber, 4.6 beyond the
    cut, and only rose there) - an agent's simulation; 50-heichal.js: the keys on the stair itself (onRing/stepTop), LAG 3, RE 1.9,
    EYE 3.0; the card's words and the comment. No sound (the user).
12. "הכהן גדול נכנס לקטורת... נתקע בקיר, אחר כך מתקן": the walk's waypoints 0.13 from the gold (made when the parochet had a 1-amah gap
    at the wall; PAROCHET_217 replaced it), snap turns at every corner (a broken line), a swerve inserted in 2.0.18, camera keys outside
    the room, the heading frozen on slow legs at high refresh rates - an agent's simulation (all routes x folds x 60/240/360 Hz):
    HP_WALK_219 (sheni_hp.py, hp_edits.json: 12 replacements - PATH/BACK of the three routes rounded and off the walls, KEYS.two's eye
    inside, the heading by the way ahead). The routes of R. Yehuda / R. Yose / R. Meir unchanged; inside the Holy of Holies he walks ~2
    amot south along the parochet ("מהלך לשמאלו עם הפרכת"; the eye does not see it). Checked in the browser (v3check.mjs).
13. Sounds of the Second Temple (sheni_sounds.py, an agent; 18 replacements): the High Priest's steps and the incense's hiss, the
    mukhni's wheel and water, the wicket (the gate's scrape at the same swing removed - it drowned the wicket), the great gate's
    bigGate per pair of doors (instead of its door sound), the lots' steps; the morning service's fire x0.37. The fix found on the way:
    55-tamid.js set SH.sfx = {play, stop} over SOUNDS_300's function - every new sound of the house was silent. sfxCut on a pause or a
    stop (90-entry.js, both houses).
14. The loading time (the user: "תבדוק אם אפשר לקצר את הטעינה"): measured, 2.0.18 against 3.0.0, alternating, headless (loadtime.mjs):
    rishon 6.5/5.5 s -> 6.0/6.2 s, sheni 8.1/7.8 s -> 8.0/7.2 s - about the same; the time is the scene's building, the paint yields and
    the first frame, not the file's size. Not changed further before the release (told the user).
15. Open: the projector's MP4 (to be made again from 3.0 at the end).

## The build (tools/round-3.0.0/make.sh; paths of the session's workspace)
rishon: node tools/build.mjs. sheni: the 2.0.18 bundle (git HEAD) -> strip.py (the " //" ends off; round-trip checked byte for byte)
-> hunks.py (the first house's diff of 90-entry.js / 70-ui.js / 75-tour.js applied hunk by hunk; 3 hunks of different comments and the
news are done by sheni_extra.py) -> sheni_extra.py (the house's own parts) -> sheni_tamid.py -> sheni_sounds.py -> safe-lines.mjs ->
node --check -> minify.mjs -> house_sheni.py (tools/round-2.0.18) -> build-unified.mjs --version 3.0.0.
