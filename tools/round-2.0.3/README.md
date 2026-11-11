# tools/round-2.0.3 — the patches and the checks of the round of 11.11.2026 (kept here for the record; they run on the development machine)

The round answered the user's pictures and recording after 2.0.2: a switch whose view did not show its matter, the presentation that began
with the viewer's section open, and the Second Temple's presentation menu that did not open.

Patches (idempotent; the paths inside are those of the development machine, `/home/claude/...`):
- `kuntres_tour_clean.py` — `src/75-tour.js` (both houses: the Second Temple's file is ported from the First's): the presentation starts
  from the model's regular state and gives back at its end what it closed.
- `kuntres_potot_view.py` — `src/55-interior.js`, `src/70-ui.js`: the row "הפותות" looks at the key in the lock / at the lower pivot.
- `kuntres_ramps_view.py` — `src/40-altar.js`: the row "הכבשים הקטנים" looks from near at the place where the small ramps meet the altar.
- `kuntres_versions2.py` — the versions (1.3.6, 1.9.4, 2.0.3) and the "מה חדש" lists; `gen_release_notes2.py` — `docs/תיאור העדכון 2.0.3.txt`.
- `kuntres_notes2.py` — the entries of the three DEV_NOTES files.
- The fix of `tools/safe-lines.mjs` itself (a line end that is the first character of a template chunk; the token-equality proof) is in
  that file.

Checks (`checks/`, headless, playwright; `h.mjs` is the harness they import — on the development machine it is `/home/claude/qa/fs/h.mjs`):
- `t3.mjs <plugin dir> <rishon|sheni>` — the presentation's menu hangs under its button and a click of the mouse starts it; the
  presentation starts from the regular state and restores at its end; the corrected rows show their matter; no template text of the
  bundle begins with the line-end mark.
- `vis.mjs <plugin dir> <out> <rows|places> [pre] [range]` + `mksheets.py` — THE SCAN: every switch and every place is pressed as the
  user presses it, in a wide window; the page is photographed as he sees it and the view is measured (is the way to the target free, is
  the eye shut in, is the picture empty; with `LATER=1` again after the 15-second timer). **The measure only flags; a person looks at
  every picture.** The scan before 2.0.2 judged by numbers alone, and seven rows passed it that showed nothing of their matter.
- `camtry.mjs` — try cameras without a rebuild; `rows.mjs` — list the rows; `tpl.mjs <bundle>` — template chunks that begin with " //".
