# Replay the file writes and file patches of a parsed past-chat page (parse_page.py json) into /home/claude/usb/rec, in order.
#   python3 replay.py <page.json> [--dry]
import json, re, sys, subprocess, os
calls = json.load(open(sys.argv[1], encoding='utf-8'))
dry = '--dry' in sys.argv
REC = '/home/claude/usb/rec'
def heredocs(cmd):
    # (kind, target, body) for cat >/>> and python3 - heredocs, in order
    out = []
    cds = [(m.start(), m.group(1)) for m in re.finditer(r"(?:^|&&|;|\n)\s*cd\s+(/\S+)", cmd)]
    for m in re.finditer(r"(cat\s*(>>?)\s*([^\s<]+)\s*<<\s*'?(\w+)'?|python3\s+-\s*<<\s*'?(\w+)'?)[^\n]*\n", cmd):
        here = [d for pos, d in cds if pos < m.start()]
        hcwd = here[-1] if here else None
        tag = m.group(4) or m.group(5)
        start = m.end()
        end = cmd.find('\n' + tag + '\n', start - 1)
        if end < 0:
            end = cmd.find('\n' + tag, start - 1)
            if end < 0 or cmd[end + 1 + len(tag):].strip(' \n;&|') not in ('',) and not cmd[end + 1 + len(tag):].startswith(('\n', ' ', ';', '&', '|')): continue
        body = cmd[start:end + 1]
        if m.group(3): out.append(('cat' + m.group(2), m.group(3), body, hcwd))
        else: out.append(('py', None, body, hcwd))
    return out
for i, c in enumerate(calls):
    p = c['params']
    if c['tool'] == 'Write':
        fp = p.get('file_path', '')
        if fp.startswith(REC + '/'):
            print(f'{i:3} Write {fp} ({len(p["content"])})')
            if not dry: open(fp, 'w', encoding='utf-8').write(p['content'])
    elif c['tool'] == 'Edit':
        print(f'{i:3} Edit {p.get("file_path")} -- NOT HANDLED')
    elif c['tool'] == 'Bash':
        cmd = p.get('command', '')
        m = re.match(r'\s*cd\s+(\S+)', cmd); cwd0 = m.group(1) if m else REC
        if not cwd0.startswith('/home/claude/usb'): cwd0 = REC
        cwd = cwd0
        for kind, tgt, body, hcwd in heredocs(cmd):
            cwd = hcwd if hcwd and hcwd.startswith('/home/claude/usb') else (hcwd and REC) or cwd0
            if kind.startswith('cat'):
                path = tgt if tgt.startswith('/') else os.path.join(cwd, tgt)
                if not path.startswith(REC + '/'): continue
                print(f'{i:3} {kind} {path} ({len(body)})')
                if not dry: open(path, 'a' if kind == 'cat>>' else 'w', encoding='utf-8').write(body)
            else:
                w = re.search(r"open\(\s*(p|'[^']+'|\"[^\"]+\")\s*,\s*'w'", body)
                pm = re.search(r"^p\s*=\s*'([^']+)'", body, re.M)
                tgtf = pm.group(1) if pm else (w.group(1).strip("'\"") if w else None)
                if not w or (tgtf and ('/out/' in tgtf or tgtf.endswith(('.jpg', '.png')))): continue
                print(f'{i:3} py-patch {tgtf} in {cwd}')
                if not dry:
                    r = subprocess.run(['python3', '-'], input=body, text=True, cwd=cwd, capture_output=True)
                    if r.returncode: print('     FAILED:', (r.stderr or r.stdout)[-400:])
                    elif r.stdout.strip(): print('     ', r.stdout.strip()[:160].replace('\n', ' | '))
        for sm in re.finditer(r"(sed -i [^\n;&]*?(\S+\.(?:py|mjs|js|css|sh)))(?=\s*(?:&&|;|\n|$))", cmd):
            f = sm.group(2); path = f if f.startswith('/') else os.path.join(cwd, f)
            if not path.startswith(REC + '/'): continue
            print(f'{i:3} sed {path}: {sm.group(1)[:100]}')
            if not dry:
                r = subprocess.run(sm.group(1), shell=True, cwd=cwd, capture_output=True, text=True)
                if r.returncode: print('     FAILED:', r.stderr[-300:])
