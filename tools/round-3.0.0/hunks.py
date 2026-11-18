# apply the hunks of the First Temple's source diff (git diff -U<n> of the given files) to the Second Temple's plain bundle
import sys, subprocess, re, json, os
repo, plain, out, ctxn = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
files = sys.argv[5:]
s = open(plain, encoding='utf-8').read()
# the base: 2.0.18 (2409ca0), whose Second Temple bundle is the patch's input (not HEAD: this round's work is committed on release-3.0)
base = os.environ.get('HUNKS_BASE', '2409ca0')
diff = subprocess.run(['git', '-C', repo, 'diff', '-U' + ctxn, base, '--'] + files, capture_output=True, text=True).stdout
hunks, cur = [], None
for line in diff.split('\n'):
    if line.startswith('@@'):
        cur = {'old': [], 'new': [], 'hdr': line}; hunks.append(cur); continue
    if cur is None or line.startswith(('diff ', 'index ', '--- ', '+++ ')):
        if line.startswith('diff '): cur = None
        continue
    if line.startswith(' '): cur['old'].append(line[1:]); cur['new'].append(line[1:])
    elif line.startswith('-'): cur['old'].append(line[1:])
    elif line.startswith('+'): cur['new'].append(line[1:])
    elif line == '\\ No newline at end of file': pass
ok, bad = 0, []
for h in hunks:
    old, new = '\n'.join(h['old']) + '\n', '\n'.join(h['new']) + '\n'
    n = s.count(old)
    if n == 1:
        s = s.replace(old, new); ok += 1
    else:
        bad.append({'hdr': h['hdr'], 'count': n, 'first': h['old'][:3]})
open(out, 'w', encoding='utf-8').write(s)
print(json.dumps({'hunks': len(hunks), 'applied': ok, 'failed': bad}, ensure_ascii=False, indent=1))
