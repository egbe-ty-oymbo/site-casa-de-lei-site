const CACHE_NAME = "casa-de-lei-v1";

const URLS_TO_CACHE = [
  "/site-casa-de-lei-site/",
  "/site-casa-de-lei-site/index.html",
  "/site-casa-de-lei-site/style.css",
  "/site-casa-de-lei-site/script.js",
  "/site-casa-de-lei-site/manifest.json",
  "/site-casa-de-lei-site/imagens/icon-192.png",
  "/site-casa-de-lei-site/imagens/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
