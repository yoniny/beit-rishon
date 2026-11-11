#!/usr/bin/env python3
# design-check.py <file.html> ... — the store's design rules for the <style> blocks of the plugin's pages, as its validator states them
# (DESIGN_GUIDE.md): no literal colours in the rules (hex, rgb(), named) - var(--...) only; font-family from var(--font-...); font-size
# not in px (except in a selector of the top bar); border-radius not in px. Custom properties' own declarations are not checked.
# 11.11.2026: the store refused the update of the plugin (it carries the tag "מראה תואם לאוצריא") because of the choice screen's styles;
# tools/build-unified.mjs runs this on the built pages, so it fails here and not in the store. Exit 1 on a violation.
import re, sys
def check(css):
    out = []
    s = re.sub(r'/\*[\s\S]*?\*/', '', css)
    s = re.sub(r'--[a-zA-Z_][\w-]*\s*:\s*[^;}]+;?', '', s)
    hx = sorted(set(re.findall(r'#[0-9a-fA-F]{3,8}\b', s)))
    if hx: out.append('hex colours: ' + ', '.join(hx[:8]))
    if re.search(r'\b(?:rgb|rgba|hsl|hsla)\s*\(', s): out.append('rgb()/rgba()/hsl() in a rule')
    allowed = {'inherit', 'initial', 'unset', 'revert', 'currentcolor', 'transparent', 'none'}
    named = re.compile(r'\b(black|white|red|green|blue|yellow|gray|grey|purple|orange|pink|brown|cyan|magenta|silver|gold|maroon|navy|teal|olive|aqua|fuchsia|lime|violet|indigo|coral|crimson|salmon|khaki|beige|ivory|wheat|tan|chocolate|tomato|turquoise|orchid)\b', re.I)
    for m in re.finditer(r'(?:^|[\s;{])(color|background(?:-color)?|border(?:-(?:top|right|bottom|left))?(?:-color)?|outline(?:-color)?|fill|stroke)\s*:\s*([^;}]+)', s, re.I):
        v = m.group(2).strip()
        if re.search(r'var\s*\(', v): continue
        ft = re.split(r'[\s,]', v)[0].lower()
        if ft in allowed or re.match(r'^[\d.]+(px|em|rem|%)?$', ft): continue
        if named.search(v): out.append('a named colour: ' + v[:40]); break
    for m in re.finditer(r'font-family\s*:\s*([^;}]+)', s, re.I):
        if not re.search(r'var\s*\(\s*--font', m.group(1), re.I): out.append('font-family: ' + m.group(1).strip()[:50]); break
    for m in re.finditer(r'font-size\s*:\s*([^;}]+)', s, re.I):
        v = m.group(1).strip()
        if re.search(r'var\s*\(', v) or re.match(r'^\d+(?:\.\d+)?\s*(?:em|rem|%)$', v, re.I) or re.match(r'^0(?:px)?$', v): continue
        op = s.rfind('{', 0, m.start()); st = max(s.rfind('}', 0, op - 1), s.rfind('{', 0, op - 1))
        if re.search('top-?bar', s[st + 1:op], re.I): continue
        if re.search(r'\d+\s*px', v, re.I): out.append('font-size in px: %s (%s)' % (v, s[st + 1:op].strip()[:50])); break
    for m in re.finditer(r'border-radius\s*:\s*([^;}]+)', s, re.I):
        v = m.group(1).strip()
        if re.search(r'var\s*\(', v) or re.match(r'^0(?:px)?(?:\s+0(?:px)?)*$', v) or re.match(r'^\d+(?:\.\d+)?\s*%$', v): continue
        if re.search(r'\d+\s*px', v, re.I): out.append('border-radius in px: ' + v[:30]); break
    return out
bad = 0
for f in sys.argv[1:]:
    t = open(f, encoding='utf-8').read()
    chunks = re.findall(r'<style[^>]*>([\s\S]*?)</style>', t, re.I)
    v = [x for c in chunks for x in check(c)]
    if chunks and not any(re.search(r'var\s*\(\s*--color-', c, re.I) for c in chunks): v.append('no var(--color-*) is used')
    m = re.search(r'<html\b([^>]*)>', t, re.I)
    if m and not re.search(r'\bdir\s*=\s*[\'"]\s*rtl\s*[\'"]', m.group(1), re.I): v.append('<html> without dir="rtl"')
    if m and not re.search(r'\blang\s*=\s*[\'"]\s*he\s*[\'"]', m.group(1), re.I): v.append('<html> without lang="he"')
    print('[design] %s: %d style block(s), %s' % (f, len(chunks), 'OK' if not v else 'VIOLATIONS: ' + '; '.join(v)))
    bad += len(v)
sys.exit(1 if bad else 0)
