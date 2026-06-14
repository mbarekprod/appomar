// ملف السيرفيس وركر لتفعيل التنزيل والإشعارات
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // يخلّي الموقع يخدم عادي
    event.respondWith(fetch(event.request));
});
