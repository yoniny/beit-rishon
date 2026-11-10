#!/usr/bin/env python3
# gen_manifest_books.py — the books in which each house's toolbar button shows (the user, 11.11.2026: "הוספת פקדים, שבכל הספרים
# שמדברים על זה, אולי אפילו לפי קישורים... תראה מקומות שיש בהם הרבה קישורים, אז גם להוסיף לשם פקדים").
# Otzaria gives a toolbar program only the open book's identity (reader.book.id / type / source: no line, no links), and one program
# may hold 256 value nodes: an "equals" of the id against a number costs 3, an "or" 2 -> 77 book ids per house, with the two checks
# kept (library book, text). The ids are the house's own books and the 75 books of the user's library (seforim.db, 11.11.2026) with
# the most links to the house's sources (tools196/book_lists.json: [id, title, category, linked lines, distinct source lines, lines
# linking out, lines linked to, lines of the book]; rank = sqrt(linked lines * distinct source lines); dictionaries and grammar left
# out). On the click 72-words.js asks for the links of the line being read. The unified build copies both programs.
import json, sys
L = json.load(open('/home/claude/tools196/book_lists.json', encoding='utf-8'))
HOUSES = [
    ('/home/claude/beit-rishon/plugin/manifest.json', 'beit-rishon-books', [10, 39], L['r']),
    ('/home/claude/b2src/plugin/manifest.json', 'beit-sheni-books', [89, 337], L['s']),
]
MAX_NODES, MAX_CHILDREN, MAX_COND_DEPTH = 256, 16, 6

def count_value(v, depth, B):
    B[0] += 1
    assert depth <= 12
    if isinstance(v, dict):
        refs = [k for k in v if k.startswith('$')]
        if refs:
            assert len(v) == 1
            k = refs[0]
            if k == '$literal':
                count_literal(v[k], depth + 1, B)
            elif k == '$concat':
                for p in v[k]:
                    count_value(p, depth + 1, B)
            return
        for x in v.values():
            count_value(x, depth + 1, B)
    elif isinstance(v, list):
        for x in v:
            count_value(x, depth + 1, B)

def count_literal(v, depth, B):
    B[0] += 1
    if isinstance(v, dict):
        for x in v.values():
            count_literal(x, depth + 1, B)
    elif isinstance(v, list):
        for x in v:
            count_literal(x, depth + 1, B)

def count_cond(c, depth, B):
    assert depth <= MAX_COND_DEPTH, 'condition too deep'
    B[0] += 1
    op = c['op']
    if op in ('and', 'or'):
        assert set(c) == {'op', 'conditions'} and 1 <= len(c['conditions']) <= MAX_CHILDREN
        B[0] += 1
        for ch in c['conditions']:
            count_cond(ch, depth + 1, B)
    elif op == 'not':
        count_cond(c['condition'], depth + 1, B)
    elif op in ('equals', 'notEquals'):
        assert set(c) == {'op', 'left', 'right'}
        count_value(c['left'], depth + 1, B)
        count_value(c['right'], depth + 1, B)
    else:
        count_value(c['value'], depth + 1, B)

def nodes(program):
    B = [0]
    if program.get('when') is not None:
        count_cond(program['when'], 0, B)
    for cmd in program['commands']:
        assert cmd['type'] == 'data.choose'
        a = cmd['args']
        count_cond(a['condition'], 0, B)
        count_value(a['whenTrue'], 0, B)
        count_value(a['whenFalse'], 0, B)
    for v in program['outputs'].values():
        count_value(v, 0, B)
    return B[0]

def eq(path, value):
    return {'op': 'equals', 'left': {'$context': path}, 'right': value}

for path, pid, base, rows in HOUSES:
    ids = list(base) + [r[0] for r in rows if r[0] not in base]
    assert len(ids) == len(set(ids)) and all(isinstance(i, int) and i > 0 for i in ids)
    groups = [ids[i:i + MAX_CHILDREN] for i in range(0, len(ids), MAX_CHILDREN)]
    assert len(groups) <= MAX_CHILDREN
    books = {'op': 'or', 'conditions': [{'op': 'or', 'conditions': [eq('reader.book.id', i) for i in g]} for g in groups]}
    cond = {'op': 'and', 'conditions': [eq('reader.book.source', 'library'), eq('reader.book.type', 'text'), books]}
    m = json.load(open(path, encoding='utf-8'))
    progs = m['contributes']['startup']['programs']
    p = [x for x in progs if x['id'] == pid]
    assert len(p) == 1 and len(progs) == 1, (path, [x['id'] for x in progs])
    p = p[0]
    p['commands'] = [{'id': 'show', 'type': 'data.choose', 'args': {'condition': cond, 'whenTrue': 'show', 'whenFalse': ''}}]
    p['outputs'] = {'show': {'$result': 'show'}}
    n = nodes(p)
    assert n <= MAX_NODES, (pid, n)
    open(path, 'w', encoding='utf-8').write(json.dumps(m, ensure_ascii=False, indent=2) + '\n')
    print(path.replace('/home/claude/', ''), pid, len(ids), 'books in', len(groups), 'groups;', n, 'of', MAX_NODES, 'value nodes')
