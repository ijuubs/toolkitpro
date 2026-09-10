// Self-unregister legacy service workers and purge all caches
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))),
      self.registration.unregister(),
      self.clients.claim()
    ])
  );
});

// Pass-through fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// Suppress push events
self.addEventListener('push', (event) => {
  event.waitUntil(Promise.resolve());
});

