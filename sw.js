self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

// الاستماع للإشعارات القادمة
self.addEventListener('push', (event) => {
    let data = { title: 'مطعم الفنان 🍽️', body: 'ثمة جديد يستنى فيك!' };
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: 'go.png',
        badge: 'go.png',
        vibrate: [300, 100, 300],
        data: { url: './index.html' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// أول ما الحريف ينزل على الإشعار بـصبعة، يتحل الموقع
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
