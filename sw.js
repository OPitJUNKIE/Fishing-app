// v4.4.1 debug cache
const CACHE = 'bite-v4.4.1-debug';
const ASSETS = [
  'index.html',
  'lake_species.json',
  'bite_app_icon_512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      try {
        await cache.addAll(ASSETS);
      } catch (e) {
        // If some optional files (e.g., icon) are missing, don't fail the whole install
        console.warn('SW addAll partial', e);
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    // Cache-first for app shell + JSON
    event.respondWith(
      caches.match(event.request).then((resp) => resp || fetch(event.request))
    );
  } else {
    // Network-first for APIs with offline fallback
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
