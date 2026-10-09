/**
 * Vibe College - High Seas Offline Service Worker
 * Caches core navigation logs and assets for offline resilience.
 */

const CACHE_NAME = 'vibe-college-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './student.html',
  './login.html',
  './map.html',
  './styles.css',
  './app.js',
  './audio-weather.js',
  './polly-companion.js',
  './treasure-canvas-map.js',
  './quiz-gamification.js',
  './admin-suite.js',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚓ Caching High-Seas Fleet Assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Cache first, fall back to network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // If offline and request is navigation, return cached index
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
