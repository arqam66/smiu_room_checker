const CACHE_NAME = 'smiu-academic-navigation-cache-v1';

// Assets to precache immediately on service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/data.ts',
  '/src/types.ts',
  '/src/assets/images/smiu_logo_1779567984801.png'
];

// Install Event - Precache primary assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching core application resources...');
        return cache.addAll(PRECACHE_ASSETS).catch((error) => {
          console.warn('[Service Worker] Some non-essential precache assets failed to load: ', error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Deleting obsolete cache store:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Intercept requests, cache dynamically, fall back to offline caches
self.addEventListener('fetch', (event) => {
  // Only process GET requests to avoid fetch interception errors (e.g., with POST or extension calls)
  if (event.request.method !== 'GET') return;

  // Avoid caching browser extensions or non-HTTP protocols
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    // Attempt network request first to guarantee the latest available contents
    fetch(event.request)
      .then((networkResponse) => {
        // Guard response to ensure it's valid before saving into cache store
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch((error) => {
        // Network failed (intermittent or offline) -> fallback to matching cache store immediately
        console.log('[Service Worker] Network request failed. Serving asset from local cache:', event.request.url);
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If total cache miss and it is a document navigation request, return root-index fallback
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
          return Promise.reject(error);
        });
      })
  );
});
