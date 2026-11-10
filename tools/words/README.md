# tools/words — the generators of the 2.0.2 round (kept here for the record; they run on the development machine)

- `gen_words.py` — writes `src/72-words.js` of BOTH houses (the search by the words of the sources, and the links of the books' button) from
  `words_module.js` (the code, one for both houses) and `words_match.js` (the matcher), and the unified shell's `unified/words-index.js`.
  The texts are the library's own lines (I Kings, II Chronicles; Mishnah Middot, the Rambam's Hilchot Beit HaBechirah), cleaned.
  The paths inside are those of the development machine (`/home/claude/...`). `src/72-words.js` is a generated file: do not edit it.
- `gen_manifest_books.py` + `book_lists.json` — the 77 books in which each house's toolbar button shows (`plugin/manifest.json`), by the
  number of links in the user's library; the script also counts Otzaria's value nodes (254 of 256).
- `kuntres_words_ui.py`, `kuntres_news.py` — the patches of `src/70-ui.js` (the hooks of 72-words.js; "מה חדש" with bold).
- `gen_release_notes.py` — `docs/תיאור העדכון 2.0.2.txt`.
