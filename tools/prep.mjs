// One-time prep: derive 10-core.js and 90-entry.js from the Second Temple reference sections.
import fs from 'node:fs';
import path from 'node:path';
const src = path.resolve(process.argv[2]);
const rd = f => fs.readFileSync(path.join(src, f), 'utf8');
const wr = (f, t) => fs.writeFileSync(path.join(src, f), t, 'utf8');

// ---- core: new levels and coordinates for the First Temple
let core = rd('ref-core-bayit2.js').split('\n').slice(1).join('\n');
const lvStart = core.indexOf('  var LV = ');
const coEnd = core.indexOf('  };', core.indexOf('  var CO = ')) + 5;
const NEW_CO = `  // Levels (y, in amot above the mount platform). Model choice, see DEV_NOTES.md: the inner court is 12 steps (6 amot)
  // above the great court (as Middot 2:3 for the ascent from the Hel), the house floor 12 steps (6 amot) above the inner court
  // (Middot 3:6 for the ulam steps). Kings I gives no levels.
  var LV = { HAR: 0, AZ: 6, HEI: 12 };
  // Coordinates (x east+, z south+). Inner court 187 x 135 per Middot 5:1 (user's decision); great court 500 x 500 per Middot 2:1,
  // the court placed as in Middot 2:1 (most open space on the south, then east, then north, least on the west).
  var CO = {
    azE: 93.5, azW: -93.5, azN: -67.5, azS: 67.5, AZ_L: 187, AZ_W: 135,
    harW: -147, harE: 353, harN: -167.5, harS: 332.5, HAR: 500,
    // altar: bronze, 20 x 20 x 10 (II Chr 4:1); west face 22 amot east of the ulam front (Middot 5:1), centred on the house axis (model choice)
    xAltarW: 39.5, xAltarE: 59.5, altarZ: 0, ALTAR: 20, ALTAR_H: 10,
    // the house, interior measures (I Kings 6:2-3, 6:17, 6:20); wall thicknesses from Middot 4:7 (ulam wall 5, house wall 6, ta wall 5)
    xUlamE: 17.5,          // outer face of the ulam front wall
    xUlamIn: 12.5,         // inner face of the ulam front wall (ulam wall 5)
    xHouseE: 2.5,          // east face of the house wall (ulam interior 10 deep)
    xKodeshE: -3.5,        // inner east face of the kodesh (house wall 6)
    xKodeshW: -43.5,       // kodesh 40 long
    xDevirE: -44.5,        // amah traksin 1 (Yoma 51b), taken from the devir side (user's decision)
    xDevirW: -63.5,        // devir interior 19 (20 incl. the traksin)
    xHouseW: -69.5,        // west wall 6 at the lowest story
    xHeiW: -79.5,          // outer face of the yatzia wall: house wall 6 + yatzia 5 + ta wall 5 (I Kings 6:6, Middot 4:7)
    HOUSE_W: 20, HOUSE_H: 30, DEVIR_H: 20, ULAM_W: 20, ULAM_D: 10,
    HOUSE_WALL: [6, 5, 4], // house wall thickness per yatzia story: the wall steps in 1 amah per story (מגרעות, I Kings 6:6)
    YATZIA_W: [5, 6, 7], YATZIA_H: 5, TA_WALL: 5, ULAM_WALL: 5,
    zHouseS: 26, zHouseN: -26, // outer faces of the yatzia walls: 10 + 6 + 5 + 5
    // the sea: south-east of the house, between the ulam and the altar, drawn south (I Kings 7:39)
    seaX: 28.5, seaZ: 24, SEA_D: 10, SEA_H: 5,
    // 10 bases with lavers: 5 along the south flank, 5 along the north flank of the house (I Kings 7:39), model placement
    mechZ: 40, mechX: [-75, -60, -45, -30, -15]
  };
`;
core = core.slice(0, lvStart) + NEW_CO + core.slice(coEnd);
wr('10-core.js', core);

// ---- entry
let entry = rd('ref-entry-bayit2.js').split('\n');
entry = entry.slice(1); // drop marker
// drop trailing "})();" + license (6 lines) - the assembler appends them
const endIdx = entry.findIndex(l => l.startsWith('})();'));
entry = entry.slice(0, endIdx);
let e = entry.join('\n');
e = e.replace(/    const MODULES = \[[\s\S]*?\];\n/, `    const MODULES = [
      { name: "mount.js", build: buildMount },
      { name: "courts.js", build: buildCourts },
      { name: "altar.js", build: buildAltar },
      { name: "vessels.js", build: buildVessels },
      { name: "heichal.js", build: buildHeichal },
      { name: "interior.js", build: buildInterior },
      { name: "palace.js", build: buildPalace },
      { name: "ui.js", build: buildUI }
    ];
`);
e = e.replace(/    const STAGES = \[[\s\S]*?\];\n/, `    const STAGES = [
      "טוען את הר הבית והחצר הגדולה",
      "טוען את חצר הכהנים ושעריה",
      "טוען את מזבח הנחושת",
      "טוען את הים, המכונות ויכין ובועז",
      "טוען את האולם, ההיכל והיציע",
      "טוען את הקודש וקודש הקדשים",
      "טוען את בית שלמה",
      "טוען את הקישורים והצבעים"
    ];
`);
e = e.replace('    interiorOnly: [],\n    shared: {},', '    interiorOnly: [],\n    layers: {},\n    shared: {},');
if (!e.includes('layers: {}')) throw new Error('ctx.layers not inserted');
wr('90-entry.js', e + '\n');
console.log('core + entry written');
