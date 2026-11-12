#!/usr/bin/env python3
# 12.11.2026: the maintainers' notes of the round of 11-12.11.2026 (B1 1.3.7, B2 1.9.5, the unified plugin 2.0.4).
# Idempotent (each entry by its own first line). Usage: python3 notes_204.py <B1 t3 count> <B2 t3 count>
B1 = r'''**1.3.7 (11–12.11.2026; סבב ארוך לפי הודעות המשתמש מ־14:24 ואילך; כל סקריפט ב־`/home/claude/tools204/`, אידמפוטנטי לפי סימן בקוד; הכלל שלו: ״אנו לא עושים נגד ראשונים!״):**
  - **לשכת הגזית כמאירי** (`b1_gazit_meiri.py`, סימן `GAZIT_MEIRI_137`; `30-courts.js`, `70-ui.js`): `CRT_GAZIT_SEATS = { x: 59.6, z: -68.3, a: 7.9, b: 9.4, n: 71 }` — חצי הגורן נפתח למזרח; רצפה אחת ופס נחושת ב־x 59.9 (`gazitHalvesLine`); טבעת הפייס הוסרה (הפייס — תקנה, ולא נמצא מקור שנהג בבית ראשון; כתוב בכרטיס). קריאת תפארת ישראל (חציה בדרום, פניהם לדרום) — ״בקצרה״ בכרטיס.
  - **משמרות השוערים** (`b1_gatekeepers.py`, `GATEKEEPERS_137`): שכבה `gatekeepers` — 21 דמויות (18 + 3 חיוורות: ״מקומו בבית ראשון לא נתפרש״), לפי הרא״ש על תמיד כז.; `ctx.shared.gatekeepers {on, set, count}`; כפתור על המודל `crt-gatekeepers`; מקום בלוח עם `feature { key: "gatekeepers", timed: false }`. חמשת שערי הרמב״ם אינם ניתנים לציור בבית ראשון — בכרטיס, בקצרה. **תווית יכולה לשאת `far`** (טווח נראות משלה, באמות) — התיקון במנוע, בשני עותקי `70-ui.js` (כאן וב־`/home/claude/b1/src`).
  - **גובה קודש הקדשים** (`b1_devir_height.py`, `b1_devir_carved_up.py`, `b1_gem_variants.py warm`): שורה `devirHeight` (rashi / tosafot / radak); `ctx.shared.devirHeight`; שכבות `devirHighGold` (זהב מפותח, כמו למטה) ו־`devirHighStone` (לוחות אבן יקרה 5×5, בגוונים החמים — בחירת המשתמש). **פתח הדביר** עולה עם השיפוע (`b1_devir_door_up.py`: `DOOR_UP = 2.667`).
  - **כסא שלמה** (`b1_throne_demo.py`, `b1_throne_seat2.py`, `b1_throne_gems_light.py`, `b1_throne_palms.py`, `b1_throne_details.py`, `b1_throne_tour_text.py`; `60-palace.js`): מי מושיב את המלך בכל גרסה (תרגום שני — הנשרים; אבא גוריון — טווס של כסף; בית המדרש — גלגל הכסא); `T.bow` — ״אימה״; אבני החן, שמונה דקלים וטווסי שן; פרטי הדמויות.
  - **מעלות השער המזרחי** (`b1_steps_two.py`): שורה `eastSteps` (rambam — חצאי עיגולים / rid — ארוכות); `ctx.shared.eastSteps`. **הסנהדראות הקטנות** (`b1_steps_lesser.py`): `lesserChamber()`, שורה `lesserPlace`, כפתור `crt-lesser-roofs`. **רבינו תם** (`b1_rtam.py`): שורה `altarRTam`.
  - **המזבח**: צבע אחד (`b1_ramp_color.py`); הרובדין — חריצים של ממש (`b1_grooves.py`: `prismGrooved`).
  - **מיזוגים** (`b1_merges.py`: `UI_MERGE`); תוויות הדביר החדשות ממופות למקום (`b1_label_sources.py`).
  - **החיפוש במילות המקורות מוצא שורות שיטות** (`words_rows.py` → `tools196/words_module.js`; `gen_words.py`).
  - **מנוע המצגת** (`tour_engine_204.py`, `tour_engine_204b.py`; סימנים `TOUR_ENGINE_204`, `TOUR_ENGINE_204B`, `TOUR_STOPDEMOS_204`; בשני העותקים של `75-tour.js`): שקופית אחת לכל כפתור; `item.tourThen` — מצלמות המשך באותה שקופית; `item.noTour` — בלי שקופית; ביטול שקופית של שיטה עוצר הדגמות; `toolsOff()` עוצר תחילה הדגמה רצה.
  - **דמויות הסנהדרין** (`people_204.py` + `people_kit.js`, סימן `PEOPLE_KIT_204 BEGIN/END`; `30-courts.js`, לפני `buildCourts`; אותו טקסט בשני הבתים): `tm_people(ctx)` → `crowd(parent, pts, { y, s, pose: bench | ground | stand, seat, kind: judge | student | scribe, tone, big, fwd, name, shadow })`, `facing(pts, centre, away)`, `age(n)`. כל חלק — InstancedMesh אחד (גלימה + כיפה; עור עם פנים מצוירות; שיער ב־3 גרסאות זקן, צבע לכל דמות); מרחוק (מעל ~160 אמה) דמות פשוטה מחליפה (`ctx.animated`). הזקנים לאורך השורה: לבן / אפור / שחור־חום לפי הקרבה לאמצע (״כפי שניהם וכפי מעלתם״, רמב״ם סנהדרין א, ג). הרצה חוזרת של `people_204.py` מחליפה רק את טקסט הערכה.
  - **כרטיס צף / קיפול אינם פקודה** (`soft_204.py`, `TOUR_SOFT_204`; `75-tour.js` בשני העותקים — `pointerdown` ו־`wheel`; `90-entry.js` — מאזין ה־`click` של `stopDemos`): `#tm-xcard .x`, `#tm-card .x`, `#tm-burger`, `summary`.
  - **תיקוני המצגת, סבב ג** (`tour_fixes_204c.py`; `TOUR_ENGINE_204C` במנוע — `placeThen` מקבל רשימה, `mergedCard` משמיט רק שורות זהות, `mergedCams`; `TOUR_FIX_137` בתוכן).
  - **בדיקות**: `/home/claude/qa/fs/t3.mjs <plugin> rishon` — __B1N__ בדיקות; סריקת כל המתגים והמקומות ב־`/home/claude/qa/r3/vis.mjs`; סריקת כל שקופיות המצגת ב־`tourscan.mjs`.

'''
B2 = r'''- 1.9.5 (11–12.11.2026; סבב ארוך לפי הודעות המשתמש מ־14:24 ואילך; הסקריפטים ב־`/home/claude/tools204/` — תיקוני קוד לפי סימן, ותוכן ב־`tools/rows_200.py`, חלקים 1–16 וחלק 99 שממיין את השורות לפי `WANT_ROWS` שב־`rows_198.py`):
  - **הדגמת הפייסות** (`src/55-payis.js` — מקור ישיר, `buildPayis`; `PAYIS_195`, `PAYIS_ROUND2`; רשום ב־`tools/assemble.mjs` וב־`90-entry.js`): קבוצה `payisDemo`, מוסתרת כברירת מחדל; `NIGHT` (night / alot / barkai / heir / morning); התסריט נבנה ב־`build(reading)` — מפתח מצלמה הוא זמן ההגעה (המצלמה נחה, וזזה בשלוש השניות האחרונות; `0.01` = חיתוך; מפתח יכול לשאת fov); הכתוביות — לשון המקורות בלבד; `ctx.shared.payis { reading, setReading, on, start, stop, at(sec, free), seek, timeline, dur }`; כפתור `crt-payis-demo` (מוסתר בזמן הריצה; כפתור עצירה קבוע `#tm-payis-stop` מעל הכתובית `#tm-payis-cap`); בסיום חוזרים האור, התוויות, הגגות, הכפתורים, ה־fov, הכרטיס והמבט. המזבח נקרא ממקומו (`altarPlace.dz`, `altarMeasures`). **זהירות:** מאזין ב־`90-entry.js` עוצר כל הדגמה בכל לחיצה על כפתור — לכן קיפול הכרטיס נעשה תחת הדגל `KEEP`. מקום בלוח (`noTour`) ושורה ״הפייס הראשון — היכן ומתי״ (חלק 16).
  - **שלוש הלשכות** (`b2_three_chambers.py`, `THREE_CHAMBERS_195`; חלק 12): בניין אחד x 61.8..91, גג אחד; **הגזית כמאירי** (`b2_gazit_meiri.py`; חלק 13).
  - **כיוון המנורה והשולחן** (`b2_menorah_dir.py`, `b2_table_dir.py`; `MENORAH_DIR_195`, `TABLE_DIR_195`; חלק 15): `ctx.shared.menorahDir`, `ctx.shared.tableDir`; שלוש אפשרויות.
  - **המערכה**: שני הגזירים אמה על אמה (`b2_gezirin_default.py`, `GEZIRIN_DEFAULT_195`; חלק 14); **התפוח לראב״ד** (`b2_tapuach_raavad.py`, `b2_raavad_pile2.py`; חלק 11).
  - **שושן הבירה ושתי האמות** (`b2_shushan_rods.py`; חלק 10); **חמש עשרה המעלות** (`b2_steps_two.py`: `ctx.shared.steps15`; חלק 9); **הסנהדראות הקטנות** (`b2_lesser.py`; חלק 7); **השיש של הורדוס** (`b2_herod_floor.py`; חלק 6).
  - **המעקה** (`b2_parapet.py`: `mkRing`); **השיתין** (`b2_shitin.py`); **כבש הפרה** (`b2_parah_ramp.py`: קבוצה `parahRamp`); **שער טדי** (`b2_tadi_door.py`); **הרובדין** (`b2_grooves.py`: `wedgeGrooved`; `rovG` ו־`gapShade` הוסרו).
  - **מנוע המצגת** — מועבר מבית ראשון ב־`port_tour.py`; `port_ui.py` מוציא `tourThen` / `noTour` / `pickJs` / `camJs` / `tgJs` מתוך `content.json`.
  - **דמות הכהן שבהדגמה** (`payis_round6.py` … `payis_round9.py`; `PAYIS_FIGURE4` ב־`src/55-payis.js`): ראש עם פנים, זקן גוף אחד, כתונת משובצת, אבנט אחד ארוג, מגבעת; `setAvnet`, `garments(ms)`. **בגדי הכהנים** — מקום ושורה (חלק 17, `GARMENTS_195`).
  - **דמויות הסנהדרין** (`people_204.py` + `people_kit.js`, `PEOPLE_KIT_204`; `src/30-courts.js` לפני `build2`; חלק 19 — המשפט בכרטיסים): כבבית ראשון; `fwd` מושיב את הדיינים בשפת הספסל.
  - **הליכה רכה** (`walk_soft_204.py`, `WALK_SOFT_204`; `src/50-heichal.js`): `DW.run(keys, caps, onEnd, events, { soft, from, count })` — המבט לפי זווית, מוחלק ב־`TURN_W`, ולא מהר מ־`TURN_MAX` מעלות בשנייה (קטע שפונה מהר מקבל זמן, והכתוביות והאירועים זזים איתו); `DW.now()` — השנייה הכתובה, לשעון של הדגמת הפשפש. המסיבה — כולה; הפשפש — עד סוף ההליכה (`count`), ומבטי השער הגדול שאחריה כמו שנכתבו. נמדד: עד 30 מעלות בשנייה (אמיתית) במסיבה.
  - **כרטיס צף / קיפול אינם פקודה** (`soft_204.py`, `TOUR_SOFT_204`; `src/90-entry.js`, והמנוע המועבר).
  - **תיקוני המצגת** (חלק 18, `TOURFIX_195` — מצלמות; `GUARDS_FAR_195` ו־`PINCHAS_195` — שינויים ישירים ב־`src/30-courts.js`).
  - **בדיקות**: `/home/claude/qa/fs/t3.mjs <plugin> sheni` — __B2N__ בדיקות; `vis.mjs`, `tourscan.mjs` ו־`camtry.mjs` שב־`/home/claude/qa/r3`.
'''
UNI = r'''- 2.0.4 (12.11.2026): בית ראשון 1.3.7 ובית שני 1.9.5 (הפירוט ב־DEV_NOTES של כל בית). **במעטפת:** כפתור אחד בסרגל הספר, ״פתח בתוסף בית המקדש״ — שתי תוכניות זרות של 77 ספרים (`tools/build-unified.mjs`, גרסת תוכנית 2; `unified/books.json` נוצר ב־`tools204/gen_unified_books.py`), והמעטפת בוחרת את הבית (`houseOfBook`, `houseByLinks`, `routeOf`, `retarget`); ושדה החיפוש `findRef` נוסף ל־`searchFieldActions` — מראה מקום שנכתב נפתח במודל (`refOf`). `unified/base-books.json` נכתב ב־`tools196/gen_words.py`.
'''
import sys
b1n, b2n = sys.argv[1], sys.argv[2]
def put(path, marker, before, text):
    s = open(path, encoding='utf-8').read()
    if marker in s:
        return
    assert s.count(before) == 1, (path, s.count(before))
    open(path, 'w', encoding='utf-8').write(s.replace(before, text + before))
    print('notes:', path)
put('/home/claude/beit-rishon/plugin/DEV_NOTES.md', '**1.3.7 (11–12.11.2026', '**1.3.6 (11.11.2026; המשתמש, אחרי 2.0.2', B1.replace('__B1N__', b1n))
put('/home/claude/b2src/DEV_NOTES.md', '- 1.9.5 (11–12.11.2026', '- 1.9.4 (11.11.2026; המשתמש, אחרי 2.0.2', B2.replace('__B2N__', b2n))
for u in ('/home/claude/unified-wt/unified/DEV_NOTES.md', '/home/claude/beit-rishon/unified/DEV_NOTES.md'):
    put(u, '- 2.0.4 (12.11.2026)', '- 2.0.3 (11.11.2026): בית ראשון 1.3.6 ובית שני 1.9.4', UNI)
