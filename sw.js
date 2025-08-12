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
    event.respondWith(
      caches.match(event.request).then((resp) => resp || fetch(event.request))
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
