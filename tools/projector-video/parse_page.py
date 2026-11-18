# Parse a saved read_conversation page: the tool calls in order (Write / Edit / Bash), HTML-unescaped. python3 parse_page.py <page.txt> <out.json>
import re, sys, json, html
t = open(sys.argv[1], encoding='utf-8').read()
calls = []
for m in re.finditer(r'&lt;tool name="(\w+)"&gt;(.*?)&lt;/tool&gt;', t, re.S):
    name, body = m.group(1), m.group(2)
    params = {}
    for p in re.finditer(r'&lt;parameter name="(\w+)"&gt;(.*?)&lt;/parameter&gt;', body, re.S):
        params[p.group(1)] = html.unescape(p.group(2))
    calls.append({'tool': name, 'params': params, 'pos': m.start()})
json.dump(calls, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False)
for i, c in enumerate(calls):
    p = c['params']
    if c['tool'] in ('Write', 'Edit'): print(i, c['tool'], p.get('file_path'), len(p.get('content', p.get('new_string', ''))))
    elif c['tool'] == 'Bash':
        cmd = p.get('command', '')
        files = re.findall(r'cat\s*>>?\s*([^\s<]+)\s*<<', cmd)
        print(i, 'Bash', (files or ''), cmd[:90].replace('\n', ' | '))
    else: print(i, c['tool'], str(p)[:80].replace('\n', ' '))
