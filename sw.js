// v4.3.1 cache (cache name bump ensures new index is served)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('bite-v4.3.1').then(cache => cache.addAll([
      'index.html',
      'manifest.webmanifest',
      'bite_app_icon_512.png'
    ]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(r => r || fetch(event.request))
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
