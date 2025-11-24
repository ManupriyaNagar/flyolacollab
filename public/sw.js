// Service Worker - Minimal implementation to avoid CORS issues
const CACHE_NAME = 'flyola-v1';

// Install event - skip caching to avoid issues
self.addEventListener('install', (event) => {
  // Skip to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - let all requests pass through without interference
self.addEventListener('fetch', (event) => {
  // Don't intercept any requests to avoid CORS and caching issues
  // This allows all API calls to work normally
  return;
});