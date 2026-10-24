/* Nukkad service worker: opens instantly and works on a weak connection.
   Pages: network first, cached copy if offline. Assets: cache first. Database calls are never cached. */
const CACHE = 'nukkad-3.1.0';
const SHELL = ['./', './index.html', './seller/', './seller/index.html', './assets/app.css?v=3.1.0', './assets/app.js?v=3.1.0', './assets/qrcode.min.js', './config.js?v=3.1.0',
  './icons/customer-192.png', './icons/seller-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || /supabase\.(co|in)$/.test(url.hostname) || url.pathname.includes('/rest/') || url.pathname.includes('/realtime/')) return;
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
