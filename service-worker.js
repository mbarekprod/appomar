const CACHE_NAME = "fannen-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* pass-through fetch handler — required by Chrome/Android
   for the install (beforeinstallprompt) criteria to be met */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
