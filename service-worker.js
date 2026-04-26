const CACHE = 'qna-pwa-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/manifest.webmanifest',
  '/styles/01-base.css',
  '/styles/02-layout.css',
  '/styles/03-components.css',
  '/styles/04-mobile.css',
  '/js/boot.js',
  '/js/ui-mobile.js',
  '/js/app.js',
  '/js/i18n.js',
  '/js/config.js',
  '/js/decks.js',
  '/js/about.js',
  '/js/about-content.js',
  '/js/feedback.js',
  '/assets/icons/favicon.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/maskable-512.png',
  '/assets/icons/br.png',
  '/assets/icons/en.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return resp;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});