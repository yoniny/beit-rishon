# -*- coding: utf-8 -*-
# B2 1.9.5 - THE TABLE'S DIRECTION for the third reading of the row "כיוון המנורה והשולחן" (R. Elazar b. R. Shimon: north-south) - the
# user, 11.11.2026, 22:39: "כן, למה לא". Idempotent (marker TABLE_DIR_195). Edits b2src/src/45-vessels.js (after MENORAH_DIR_195).
import io
F = '/home/claude/b2src/src/45-vessels.js'
s = io.open(F, encoding='utf-8').read()
if 'TABLE_DIR_195' in s:
    print('already applied'); raise SystemExit(0)
assert 'MENORAH_DIR_195' in s
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:90])
    s = s.replace(old, new)
rep("    int_inst(g, tableGeo.ends, tubeEndMat, tM, false);\n", "    const tblEnds = int_inst(g, tableGeo.ends, tubeEndMat, tM, false);\n")
rep("    int_inst(g, tableGeo.bread, breadMat, tM, false);\n", "    const tblBread = int_inst(g, tableGeo.bread, breadMat, tM, false);\n")
rep("    int_inst(g, tableGeo.incense, incenseMat, tM, false);\n", "    const tblIncense = int_inst(g, tableGeo.incense, incenseMat, tM, false);\n")
rep("    const menLay = { ns: new Group(), ew: new Group() };   // two empty groups: the layers of the stone's two labels\n",
    "    // TABLE_DIR_195 - 1.9.5 (the user, 22:39, asked whether to add R. Elazar b. R. Shimon in full: \"כן, למה לא\"): THE TABLE'S\n"
    "    // DIRECTION. \"ew\" (THE DEFAULT, as it stood): its length along the house - the Rambam, Beit HaBechirah 3:12 \"והיה מנח ארכו\n"
    "    // לארך הבית ורחבו לרחב הבית\", as Rabbi. \"ns\": R. Elazar b. R. Shimon - \"גמר מארון: מה ארון צפון ודרום, אף הני נמי צפון\n"
    "    // ודרום\" (Menachot 98b; Rashi: \"אורכו לרוחבו של בית\"). The table turns a quarter about its middle, with all that is on it.\n"
    "    ctx2.shared.tableDir = {\n"
    "      current: \"ew\",\n"
    "      keys: [\"ew\", \"ns\"],\n"
    "      set(k) {\n"
    "        k = k === \"ns\" ? \"ns\" : \"ew\";\n"
    "        this.current = k;\n"
    "        TBL.rot = k === \"ns\" ? Math.PI / 2 : 0;\n"
    "        const m = int_part(TBL.x, FL, TBL.z, TBL.rot, 0, 0, 0);\n"
    "        for (const im of [tblBody, tblCrown, tblRig, tblEnds, tblSpoons, tblBread, tblIncense]) {\n"
    "          im.setMatrixAt(0, m);\n"
    "          im.instanceMatrix.needsUpdate = true;\n"
    "          if (typeof im.computeBoundingSphere === \"function\") im.computeBoundingSphere();\n"
    "          if (typeof im.computeBoundingBox === \"function\") im.computeBoundingBox();\n"
    "        }\n"
    "        return true;\n"
    "      },\n"
    "      get() { return this.current; }\n"
    "    };\n"
    "    const menLay = { ns: new Group(), ew: new Group() };   // two empty groups: the layers of the stone's two labels\n")
io.open(F, 'w', encoding='utf-8').write(s)
print('applied')
