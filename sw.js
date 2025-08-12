// v4.4 cache (bump so the new index loads immediately)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('bite-v4.4').then(cache => cache.addAll([
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
    event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
  } else {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  }
});
