/* Trainings-Tracker Service Worker — Offline-Cache */
const CACHE = 'trainings-tracker-v15';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './training-icon-180-v2.png',
  './training-icon-192-v2.png',
  './training-icon-512-v2.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c) { return c.addAll(ASSETS); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(keys.filter(function(k) { return k.startsWith('trainings-tracker-') && k !== CACHE; }).map(function(k) { return caches.delete(k); }));
      })
      .then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin || !ASSETS.some(function(asset) { return new URL(asset, self.registration.scope).pathname === url.pathname; })) return;
  e.respondWith(
    caches.open(CACHE).then(function(cache) { return cache.match(e.request, { ignoreSearch: true }); }).then(function(cached) {
      // App-Shell einer Version zusammenhalten; Updates erst bewusst aktivieren.
      if (cached) return cached;
      var network = fetch(e.request).then(function(res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function() { return cached; });
      return cached || network;
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
