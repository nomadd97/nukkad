#!/usr/bin/env python3
"""Build Nukkad.

  python3 tools/build.py            -> assets/app.js, index.html, seller/index.html, manifests, sw.js
  python3 tools/build.py --preview  -> also writes one self-contained preview file (for Claude)

No npm, no bundler. Plain files you can drop on any static host (Vercel, Netlify, GitHub Pages).
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
VERSION = '3.0.0'
FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap'


def read(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


def write(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(s)


def load_i18n():
    hi, kn = {}, {}
    for n, line in enumerate(read(P('tools', 'i18n.tsv')).splitlines(), 1):
        if not line.strip():
            continue
        parts = line.split('|')
        if len(parts) != 3:
            sys.exit(f'i18n.tsv line {n}: expected 3 columns, got {len(parts)}')
        en, h, k = parts
        for tr, name in ((h, 'hi'), (k, 'kn')):
            if set(re.findall(r'\{\w+\}', en)) != set(re.findall(r'\{\w+\}', tr)):
                sys.exit(f'i18n.tsv line {n} ({name}): placeholders differ: {en!r}')
        hi[en], kn[en] = h, k
    return {'hi': hi, 'kn': kn}


def bundle_js():
    files = sorted(glob.glob(P('src', '*.js')))
    src = '\n'.join(read(f) for f in files)
    i18n = load_i18n()
    used = set(re.findall(r"\bt\(\s*'((?:[^'\\]|\\.)*)'", src))
    missing = sorted(k for k in used if k not in i18n['hi'])
    if missing:
        print(f'  ! {len(missing)} strings have no Hindi/Kannada yet (English shows):')
        for k in missing:
            print('    -', k)
    cmd = read(P('supabase', 'functions', '_shared', 'commands.js'))
    cmd = re.sub(r'^export\s+', '', cmd, flags=re.M)
    src = src.replace('/*@COMMANDS@*/null', '(() => {\n' + cmd + '\nreturn {parseMessage, replyFor, HELP_TEXT};\n})()')
    src = src.replace('/*@I18N@*/{hi:{}, kn:{}}', json.dumps(i18n, ensure_ascii=False, separators=(',', ':')))
    body = src.replace("'use strict';", '', 1)
    return f"/* Nukkad {VERSION} · built from src/ by tools/build.py */\n(() => {{\n'use strict';\n{body}\n}})();\n"


def shell(app, prefix, inline_css=None, inline_js=None, preview=False):
    seller = app == 'seller'
    title = 'Nukkad for Shops' if seller else 'Nukkad'
    theme = '#EE9A2E' if seller else '#1E4D3A'
    head = [
        f'<title>{title}</title>',
    ]
    if preview:
        head.append('<meta name="claude:viewport-fit-sides" content="cover">')
    else:
        head += [
            '<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
            f'<meta name="theme-color" content="{theme}">',
            '<meta name="description" content="Order from the shops on your street. Zero commission, pay the shop directly.">',
            '<meta name="apple-mobile-web-app-capable" content="yes">',
            f'<meta name="apple-mobile-web-app-title" content="{"Nukkad Shops" if seller else "Nukkad"}">',
            '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
            f'<link rel="manifest" href="{prefix}{"seller/" if seller else ""}manifest.webmanifest">',
            f'<link rel="icon" href="{prefix}icons/{"seller" if seller else "customer"}-192.png">',
            f'<link rel="apple-touch-icon" href="{prefix}icons/{"seller" if seller else "customer"}-180.png">',
        ]
    head += [
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
        f'<link rel="stylesheet" href="{FONTS}">',
    ]
    head.append(f'<style>\n{inline_css}\n</style>' if inline_css else f'<link rel="stylesheet" href="{prefix}assets/app.css?v={VERSION}">')
    body_attr = '' if preview else f' data-app="{app}"'
    # QR library is vendored (assets/qrcode.min.js) so posters and UPI QR work offline too
    scripts = [f'<script src="{prefix}assets/qrcode.min.js" defer></script>' if not preview else f'<script>\n{read(P("assets", "qrcode.min.js"))}\n</script>']
    if inline_js:
        scripts.append(f'<script>\n{inline_js}</script>')
    else:
        scripts.append(f'<script src="{prefix}config.js?v={VERSION}"></script>')
        scripts.append(f'<script src="{prefix}assets/app.js?v={VERSION}" defer></script>')
    noscript = '<noscript><p style="padding:24px;font:16px system-ui">Nukkad needs JavaScript turned on.</p></noscript>'
    if preview:
        return '\n'.join(head) + f'\n<div class="app" id="app"></div>\n<div id="fx"></div>\n<div id="toast" role="status" aria-live="polite"></div>\n' + '\n'.join(scripts) + '\n'
    return ('<!doctype html>\n<html lang="en">\n<head>\n' + '\n'.join(h for h in head if h) + '\n</head>\n'
            f'<body{body_attr}>\n{noscript}\n<div class="app" id="app"></div>\n<div id="fx"></div>\n<div id="toast" role="status" aria-live="polite"></div>\n'
            + '\n'.join(scripts) + '\n</body>\n</html>\n')


def manifest(app):
    seller = app == 'seller'
    m = {
        'name': 'Nukkad for Shops' if seller else 'Nukkad: shops on your street',
        'short_name': 'Nukkad Shops' if seller else 'Nukkad',
        'description': ('Take orders, manage stock and see what your street is searching for. Zero commission.' if seller
                        else 'Order from the shops on your street. Pickup or delivery, pay the shop directly.'),
        'id': '/seller/' if seller else '/',
        'start_url': './' if seller else './',
        'scope': './',
        'display': 'standalone',
        'orientation': 'portrait',
        'background_color': '#F7F3EA',
        'theme_color': '#EE9A2E' if seller else '#1E4D3A',
        'lang': 'en-IN',
        'categories': ['shopping', 'business'] if seller else ['shopping', 'food'],
        'icons': [
            {'src': f'{"../" if seller else ""}icons/{app}-192.png', 'sizes': '192x192', 'type': 'image/png'},
            {'src': f'{"../" if seller else ""}icons/{app}-512.png', 'sizes': '512x512', 'type': 'image/png'},
            {'src': f'{"../" if seller else ""}icons/{app}-maskable.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'},
        ],
    }
    if not seller:
        m['shortcuts'] = [{'name': 'Nukkad for Shops', 'url': 'seller/', 'icons': [{'src': 'icons/seller-192.png', 'sizes': '192x192'}]}]
    return json.dumps(m, indent=2, ensure_ascii=False) + '\n'


SW = """/* Nukkad service worker: opens instantly and works on a weak connection.
   Pages: network first, cached copy if offline. Assets: cache first. Database calls are never cached. */
const CACHE = 'nukkad-%s';
const SHELL = ['./', './index.html', './seller/', './seller/index.html', './assets/app.css?v=%s', './assets/app.js?v=%s', './assets/qrcode.min.js', './config.js?v=%s',
  './icons/customer-192.png', './icons/seller-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || /supabase\\.(co|in)$/.test(url.hostname) || url.pathname.includes('/rest/') || url.pathname.includes('/realtime/')) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match(url.pathname.includes('/seller') ? './seller/' : './'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok && (url.origin === location.origin || /cdnjs|jsdelivr|gstatic|googleapis/.test(url.hostname))) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
""" % (VERSION, VERSION, VERSION, VERSION)

CONFIG = """/* Nukkad settings. Fill these after you create the free Supabase project (see README).
   Leave them empty and the apps still run as a demo copy on each phone. */
window.NK_CONFIG = {
  supabaseUrl: '',          // e.g. 'https://abcdxyz.supabase.co'
  supabaseKey: '',          // the "anon public" key. Safe to ship: the database rules decide what it can do.
  publicUrl: '',            // e.g. 'https://nukkad.vercel.app/'  (used in shop links and QR posters)
  smartFillFunction: 'smart-fill', // Supabase Edge Function that calls the AI. Leave as is.
  botNumber: ''             // Nukkad's WhatsApp bot number, e.g. '15551234567' (shows a 'Message Nukkad on WhatsApp' button)
};
"""


def dashboard_bot():
    """One-file copy of the WhatsApp bot to paste into the Supabase dashboard (no CLI needed)."""
    cmd = read(P('supabase', 'functions', '_shared', 'commands.js'))
    bot = read(P('supabase', 'functions', 'whatsapp-bot', 'index.ts'))
    bot = bot.replace("import { parseMessage, replyFor } from '../_shared/commands.js';\n", '')
    head = "import { createClient } from 'npm:@supabase/supabase-js@2';\n"
    bot = bot.replace(head, head + '\n// ---- commands.js (inlined) ----\n' + cmd + '\n// ---- the bot ----\n')
    write(P('supabase', 'dashboard', 'whatsapp-bot.ts'), '// @ts-nocheck\n// Single-file version of supabase/functions/whatsapp-bot for the Supabase dashboard editor.\n// Generated by tools/build.py from whatsapp-bot/index.ts + _shared/commands.js. Edit those, not this.\n' + bot)


def main():
    preview = '--preview' in sys.argv
    js = bundle_js()
    dashboard_bot()
    write(P('assets', 'app.js'), js)
    write(P('index.html'), shell('customer', ''))
    write(P('seller', 'index.html'), shell('seller', '../'))
    write(P('manifest.webmanifest'), manifest('customer'))
    write(P('seller', 'manifest.webmanifest'), manifest('seller'))
    write(P('sw.js'), SW)
    if not os.path.exists(P('config.js')):
        write(P('config.js'), CONFIG)
    write(P('config.example.js'), CONFIG)
    print(f'  built assets/app.js ({len(js)//1024} KB), index.html, seller/index.html, manifests, sw.js')
    if preview:
        out = sys.argv[sys.argv.index('--preview') + 1] if len(sys.argv) > sys.argv.index('--preview') + 1 else P('dist', 'preview.html')
        html = shell('customer', '', inline_css=read(P('assets', 'app.css')), inline_js=js, preview=True)
        write(out, html)
        print(f'  built preview {out} ({len(html)//1024} KB)')


if __name__ == '__main__':
    main()
