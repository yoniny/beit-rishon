export const meta = {
  name: 'first-temple-audit',
  description: 'Adversarial audit of every First Temple module against the sources and the spec, then fixes',
  phases: [{ title: 'Audit', detail: 'two independent auditors per module (sources lens, geometry lens)' }, { title: 'Fix', detail: 'one fixer per module applies the confirmed findings' }],
}
const ROOT = 'C:\\Users\\x1\\AppData\\Roaming\\Claude\\scratch-workspaces\\6cc20f1e-776f-4297-b95a-bf0558e72515\\48a5e90a-221b-4185-bd62-4df70efb9058\\scratch-2026-10-26-9aa69f\\bayit1\\'
const SRC = ROOT + 'src\\'
const RESEARCH = ROOT + 'research\\'
const MODULES = [
  { key: 'mount-courts', files: ['20-mount.js', '30-courts.js'], spec: 'sections 3 and 4', notes: ['research-part3-short.md'] },
  { key: 'altar-vessels', files: ['40-altar.js', '45-vessels.js'], spec: 'section 5', notes: ['research-part1-short.md', 'research-part2-short.md', 'research-part3-short.md'] },
  { key: 'heichal', files: ['50-heichal.js'], spec: 'section 6', notes: ['research-part1-short.md', 'research-part2-short.md', 'research-part3-short.md'] },
  { key: 'interior', files: ['55-interior.js'], spec: 'section 7', notes: ['research-part1-short.md', 'research-part2-short.md', 'research-part3-short.md'] },
  { key: 'palace', files: ['60-palace.js'], spec: 'section 8', notes: ['research-part1-short.md'] },
  { key: 'ui', files: ['70-ui.js'], spec: 'section 9', notes: ['research-part1-short.md', 'research-part2-short.md', 'research-part3-short.md'] },
]
const FINDINGS = { type: 'object', properties: {
  findings: { type: 'array', items: { type: 'object', properties: {
    severity: { type: 'string', enum: ['blocker', 'major', 'minor'] }, file: { type: 'string' }, where: { type: 'string' }, problem: { type: 'string' }, evidence: { type: 'string' }, fix: { type: 'string' } },
    required: ['severity', 'file', 'where', 'problem', 'evidence', 'fix'] } },
  summary: { type: 'string' } }, required: ['findings', 'summary'] }
const extra = (args && args.extra) ? String(args.extra) : ''
const lensSources = (m) => 'You audit a Three.js module of a First Temple (Solomon) model for FIDELITY TO THE SOURCES. Read ' + ROOT + 'SPEC.md (' + m.spec + ' and sections 1-2), the research notes ' + m.notes.map(n => RESEARCH + n).join(', ') + ' (verified quotes from I Kings 6-8, II Chronicles 3-4, Rashi, Radak, Metzudot, Malbim, Ralbag, Mishnah Middot, Talmud), the Hebrew decision sheet ' + ROOT + '..\\מידות בית ראשון - מעודכן.md, and then the module file(s) ' + m.files.map(f => SRC + f).join(', ') + '. For every dimension, count, direction, placement and label in the code: is it what the verses say? If it comes from Chazal/commentators, is the attribution in the comment right and is it the opinion the user chose (Rashi first)? Is anything from Ezekiel or from the Second Temple that the spec forbids? Are the Hebrew texts (labels, explanations, references in 70-ui.js) accurate, with the right verse numbers? Report concrete findings with evidence (quote the code line and the source). Do not modify files.' + extra
const lensGeometry = (m) => 'You audit a Three.js module for GEOMETRY AND CODE CORRECTNESS. Read ' + SRC + '10-core.js (helper signatures: H.box(parent,w,h,d,mat,x,y,z) with y = bottom; H.cyl bottom at y; H.wall y bottom, openings along the wall from its centre; H.stairs x,y,z = bottom of the first step; H.lathe; H.ring; H.occ), ' + SRC + '90-entry.js, ' + ROOT + 'SPEC.md (' + m.spec + ' and sections 1-2), and the module file(s) ' + m.files.map(f => SRC + f).join(', ') + '. Mentally execute the code: compute the world-space bounds of every major part and check: parts floating above or sunk below their floor (court floor y=6, house floor y=12, platform y=0, palace terrace y=-10); walls that do not meet at corners; openings misplaced (wrong side, wrong centre); doors not in their openings; objects colliding with other modules (altar x 39.5..59.5 z -10..10 plus ramp z 10..42; sea at x 32.5 z ±26; laver x 24.5 z 0; bases x 24.5 z ±8..±28; house block x -79.5..18.5 z ±41; inner court walls at x ±93.5 z ±67.5; women court x 93.5..228.5); labels placed inside solid geometry; cutaway lists missing the south halves; occluders; InstancedMesh with instanceMatrix.needsUpdate; materials cloned before tinting (never tint ctx.M.* in place!); try/catch misuse hiding real bugs; variables used before definition; wrong argument order; runtime errors likely in a browser (undefined identifiers). Report concrete findings with evidence (code lines + computed numbers). Do not modify files.' + extra
const fixPrompt = (m, findings) => 'You are the FIXER for ' + m.files.map(f => SRC + f).join(' and ') + ' of the First Temple plugin. Read ' + ROOT + 'SPEC.md (' + m.spec + ' and sections 1-2), ' + SRC + '10-core.js, and the file(s). Apply these audit findings (JSON) with minimal surgical edits, blockers and majors first, minors when cheap; if a finding is wrong, skip it and say why: ' + JSON.stringify(findings).slice(0, 14000) + '\nRules: plain JS, no import/export, keep the exported function name, keep source comments, Hebrew in UTF-8. After editing run node --check on each file. Return a short list of what you changed and what you skipped.'
phase('Audit')
const results = await pipeline(MODULES,
  (m) => parallel([
    () => agent(lensSources(m), { label: 'audit-sources:' + m.key, phase: 'Audit', schema: FINDINGS }),
    () => agent(lensGeometry(m), { label: 'audit-geometry:' + m.key, phase: 'Audit', schema: FINDINGS }),
  ]).then(rs => rs.filter(Boolean).flatMap(r => r.findings)),
  (findings, m) => {
    const serious = findings.filter(f => f.severity !== 'minor')
    log(m.key + ': ' + findings.length + ' findings (' + serious.length + ' serious)')
    if (!findings.length) return { module: m.key, findings, fix: null }
    return agent(fixPrompt(m, findings), { label: 'fix:' + m.key, phase: 'Fix' }).then(fix => ({ module: m.key, findings, fix: String(fix).slice(0, 3000) }))
  },
)
return results.filter(Boolean)
