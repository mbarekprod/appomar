const CACHE_NAME = "elfanen-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./logo.png",
    "./wheel.html",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// تثبيت الـ Service Worker
self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then((cache) => {

                console.log("📦 Mise en cache des fichiers");

                return cache.addAll(urlsToCache);

            })

    );

});

// استرجاع الملفات من الـ Cache
self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request)

            .then((response) => {

                // إذا الملف موجود في الـ Cache
                if (response) {

                    return response;

                }

                // وإلا جيبو من الإنترنت
                return fetch(event.request);

            })

    );

});

// تحديث الـ Cache عند إصدار جديد
self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys()

            .then((cacheNames) => {

                return Promise.all(

                    cacheNames.map((cache) => {

                        if (cache !== CACHE_NAME) {

                            console.log("🗑️ Suppression :", cache);

                            return caches.delete(cache);

                        }

                    })

                );

            })

    );

});